"""
Always-on live trading service using Alpaca.
Loads the trained model, fetches hourly bars, computes features, and places trades.

Usage:
    # Set environment variables (or use .env file):
    export ALPACA_API_KEY=...
    export ALPACA_SECRET_KEY=...
    export ALPACA_BASE_URL=https://api.alpaca.markets

    # Run:
    uv run python -m live.trader
"""

import os
import sys
import math
import time
import signal
import logging
from datetime import datetime, timedelta, timezone

import numpy as np
import pandas as pd
import torch
import torch.nn as nn

# Add project root to path so we can import prepare and train
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from prepare import compute_features, LOOKBACK, DEFAULT_TICKERS
from train import TransformerPredictor, ModelConfig

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("trader")

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

CHECKPOINT_PATH = os.path.join(
    os.path.expanduser("~"), ".cache", "autoresearch-trading", "checkpoints", "model.pt"
)

# How much of total equity to allocate to this strategy
EQUITY_FRACTION = 0.95  # use 95% of buying power, keep 5% cash buffer

# Maximum position size per ticker as fraction of strategy allocation
MAX_PER_TICKER = 0.20  # 20% max per ticker

# Minimum position change (in dollars) to bother rebalancing
MIN_REBALANCE_USD = 50.0

# How often to check for new bars and rebalance (seconds)
POLL_INTERVAL = 60  # check every minute for new hourly bar

# Number of hourly bars to fetch for feature computation
BARS_TO_FETCH = 120  # need at least LOOKBACK + warmup for rolling features


# ---------------------------------------------------------------------------
# Alpaca client
# ---------------------------------------------------------------------------

def get_alpaca_clients():
    """Initialize Alpaca trading and data clients."""
    from alpaca.trading.client import TradingClient
    from alpaca.data.historical import StockHistoricalDataClient

    api_key = os.environ.get("ALPACA_API_KEY")
    secret_key = os.environ.get("ALPACA_SECRET_KEY")
    base_url = os.environ.get("ALPACA_BASE_URL", "https://api.alpaca.markets")

    if not api_key or not secret_key:
        log.error("ALPACA_API_KEY and ALPACA_SECRET_KEY must be set")
        sys.exit(1)

    paper = "paper" in base_url
    log.info(f"Alpaca mode: {'PAPER' if paper else 'LIVE'}")

    trading_client = TradingClient(api_key, secret_key, paper=paper)
    data_client = StockHistoricalDataClient(api_key, secret_key)

    return trading_client, data_client


# ---------------------------------------------------------------------------
# Model loading
# ---------------------------------------------------------------------------

def load_model(checkpoint_path):
    """Load trained model from checkpoint."""
    if not os.path.exists(checkpoint_path):
        log.error(f"No checkpoint found at {checkpoint_path}")
        log.error("Run train.py first to generate a model checkpoint.")
        sys.exit(1)

    log.info(f"Loading model from {checkpoint_path}")
    checkpoint = torch.load(checkpoint_path, map_location="cpu", weights_only=False)

    config = ModelConfig(**checkpoint["config"])
    model = TransformerPredictor(config)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()

    stats = checkpoint["stats"]
    feat_mean = stats["mean"]  # (num_features,)
    feat_std = stats["std"]    # (num_features,)

    log.info(f"Model loaded — val_sharpe: {checkpoint.get('val_sharpe', 'N/A'):.4f}")
    log.info(f"Config: d_model={config.d_model}, n_layers={config.n_layers}, n_heads={config.n_heads}")

    return model, feat_mean, feat_std


# ---------------------------------------------------------------------------
# Data fetching
# ---------------------------------------------------------------------------

def fetch_hourly_bars(data_client, tickers, num_bars=BARS_TO_FETCH):
    """Fetch recent hourly bars from Alpaca for all tickers."""
    from alpaca.data.requests import StockBarsRequest
    from alpaca.data.timeframe import TimeFrame

    end = datetime.now(timezone.utc)
    # Fetch extra days to account for weekends/holidays
    start = end - timedelta(days=int(num_bars / 7 * 2) + 10)

    request = StockBarsRequest(
        symbol_or_symbols=tickers,
        timeframe=TimeFrame.Hour,
        start=start,
        end=end,
    )

    bars = data_client.get_stock_bars(request)
    result = {}

    for ticker in tickers:
        ticker_bars = bars[ticker] if ticker in bars else []
        if not ticker_bars:
            log.warning(f"No bars returned for {ticker}")
            continue

        rows = []
        for bar in ticker_bars:
            rows.append({
                "Open": bar.open,
                "High": bar.high,
                "Low": bar.low,
                "Close": bar.close,
                "Volume": bar.volume,
            })
            # Use bar.timestamp for index
            last_ts = bar.timestamp

        df = pd.DataFrame(rows)
        # Build DatetimeIndex from bar timestamps
        timestamps = [bar.timestamp for bar in ticker_bars]
        df.index = pd.DatetimeIndex(timestamps)
        df.index.name = "Datetime"

        result[ticker] = df

    return result


# ---------------------------------------------------------------------------
# Signal generation
# ---------------------------------------------------------------------------

@torch.no_grad()
def generate_signals(model, feat_mean, feat_std, bar_data, tickers):
    """
    For each ticker, compute features from recent bars, normalize,
    and run model inference. Returns dict of ticker -> position signal [-1, 1].
    """
    signals = {}

    for ticker in tickers:
        if ticker not in bar_data:
            signals[ticker] = 0.0
            continue

        df = bar_data[ticker]

        if len(df) < LOOKBACK + 60:
            log.warning(f"{ticker}: only {len(df)} bars, need {LOOKBACK + 60} — skipping")
            signals[ticker] = 0.0
            continue

        # Compute features (same as prepare.py)
        feat_df = compute_features(df)
        feat_df = feat_df.dropna()

        if len(feat_df) < LOOKBACK:
            log.warning(f"{ticker}: only {len(feat_df)} valid feature rows — skipping")
            signals[ticker] = 0.0
            continue

        # Take the last LOOKBACK bars
        window = feat_df.iloc[-LOOKBACK:].values.astype(np.float32)

        # Normalize with training stats
        window_tensor = torch.tensor(window).unsqueeze(0)  # (1, LOOKBACK, num_features)
        window_tensor = (window_tensor - feat_mean.view(1, 1, -1)) / feat_std.view(1, 1, -1)

        # Inference
        pred = model(window_tensor).squeeze().item()
        position = math.tanh(pred)  # bounded [-1, 1]

        signals[ticker] = position
        log.info(f"  {ticker}: pred={pred:.6f}, position={position:+.4f}")

    return signals


# ---------------------------------------------------------------------------
# Order execution
# ---------------------------------------------------------------------------

def get_current_positions(trading_client):
    """Get current positions as dict of ticker -> quantity."""
    positions = trading_client.get_all_positions()
    return {p.symbol: float(p.qty) for p in positions}


def get_account_equity(trading_client):
    """Get current account equity."""
    account = trading_client.get_account()
    return float(account.equity)


def get_current_prices(data_client, tickers):
    """Get latest prices for tickers."""
    from alpaca.data.requests import StockLatestQuoteRequest

    request = StockLatestQuoteRequest(symbol_or_symbols=tickers)
    quotes = data_client.get_stock_latest_quote(request)
    return {ticker: float(quotes[ticker].ask_price or quotes[ticker].bid_price)
            for ticker in tickers if ticker in quotes}


def execute_rebalance(trading_client, data_client, signals, tickers):
    """
    Rebalance portfolio based on signals.
    Positive signal = long, negative = short, zero = flat.
    """
    from alpaca.trading.requests import MarketOrderRequest
    from alpaca.trading.enums import OrderSide, TimeInForce

    equity = get_account_equity(trading_client)
    strategy_equity = equity * EQUITY_FRACTION
    current_positions = get_current_positions(trading_client)
    prices = get_current_prices(data_client, tickers)

    log.info(f"Account equity: ${equity:,.2f}, strategy allocation: ${strategy_equity:,.2f}")

    # Compute target positions
    total_signal = sum(abs(s) for s in signals.values())
    if total_signal < 1e-8:
        log.info("All signals are zero — no trades needed")
        return

    for ticker in tickers:
        if ticker not in prices:
            log.warning(f"No price for {ticker} — skipping")
            continue

        signal = signals.get(ticker, 0.0)
        price = prices[ticker]

        # Allocate proportional to signal magnitude, capped at MAX_PER_TICKER
        raw_alloc = abs(signal) / total_signal * strategy_equity
        max_alloc = strategy_equity * MAX_PER_TICKER
        alloc_usd = min(raw_alloc, max_alloc)

        # Target shares (positive for long, negative for short)
        target_qty = int(alloc_usd / price) * (1 if signal > 0 else -1)
        if abs(signal) < 0.01:
            target_qty = 0

        current_qty = current_positions.get(ticker, 0)
        delta = target_qty - int(current_qty)

        if abs(delta * price) < MIN_REBALANCE_USD:
            continue

        side = OrderSide.BUY if delta > 0 else OrderSide.SELL
        qty = abs(delta)

        log.info(
            f"  {ticker}: current={int(current_qty)}, target={target_qty}, "
            f"delta={delta:+d} ({side.value} {qty} @ ~${price:.2f})"
        )

        try:
            order = MarketOrderRequest(
                symbol=ticker,
                qty=qty,
                side=side,
                time_in_force=TimeInForce.DAY,
            )
            trading_client.submit_order(order)
            log.info(f"  {ticker}: order submitted")
        except Exception as e:
            log.error(f"  {ticker}: order failed — {e}")


# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------

def is_market_open(trading_client):
    """Check if market is currently open."""
    clock = trading_client.get_clock()
    return clock.is_open


def wait_for_next_bar():
    """Sleep until the next hour boundary + small buffer."""
    now = datetime.now(timezone.utc)
    next_hour = now.replace(minute=0, second=0, microsecond=0) + timedelta(hours=1)
    wait_seconds = (next_hour - now).total_seconds() + 5  # 5s buffer for bar availability
    log.info(f"Waiting {wait_seconds:.0f}s until next hourly bar ({next_hour.strftime('%H:%M')} UTC)")
    time.sleep(wait_seconds)


def run():
    """Main trading loop."""
    log.info("=" * 60)
    log.info("Autoresearch Trading — Live Service")
    log.info("=" * 60)

    # Load model
    model, feat_mean, feat_std = load_model(CHECKPOINT_PATH)

    # Initialize Alpaca
    trading_client, data_client = get_alpaca_clients()

    tickers = DEFAULT_TICKERS
    log.info(f"Trading universe: {tickers}")

    # Verify account
    account = trading_client.get_account()
    log.info(f"Account: {account.account_number}, equity: ${float(account.equity):,.2f}")
    log.info(f"Buying power: ${float(account.buying_power):,.2f}")

    # Track last processed hour to avoid duplicate trades
    last_processed_hour = None

    # Graceful shutdown
    shutdown = False

    def handle_signal(signum, frame):
        nonlocal shutdown
        log.info("Shutdown signal received — will exit after current cycle")
        shutdown = True

    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)

    log.info("Service started — entering main loop")

    while not shutdown:
        try:
            now = datetime.now(timezone.utc)
            current_hour = now.replace(minute=0, second=0, microsecond=0)

            # Skip if we already processed this hour
            if current_hour == last_processed_hour:
                time.sleep(POLL_INTERVAL)
                continue

            # Only trade during market hours
            if not is_market_open(trading_client):
                log.info("Market closed — sleeping 60s")
                time.sleep(60)
                continue

            # Wait a few minutes after the hour for bars to settle
            minutes_past = now.minute
            if minutes_past < 2:
                log.info(f"Waiting for bar to finalize ({2 - minutes_past} min)...")
                time.sleep((2 - minutes_past) * 60)

            log.info(f"--- Hourly cycle: {current_hour.strftime('%Y-%m-%d %H:%M')} UTC ---")

            # Fetch latest bars
            log.info("Fetching hourly bars...")
            bar_data = fetch_hourly_bars(data_client, tickers)
            log.info(f"Got bars for {len(bar_data)}/{len(tickers)} tickers")

            # Generate signals
            log.info("Computing signals...")
            signals = generate_signals(model, feat_mean, feat_std, bar_data, tickers)

            # Log summary
            longs = [t for t, s in signals.items() if s > 0.01]
            shorts = [t for t, s in signals.items() if s < -0.01]
            log.info(f"Signals — Long: {longs}, Short: {shorts}")

            # Execute trades
            log.info("Executing rebalance...")
            execute_rebalance(trading_client, data_client, signals, tickers)

            last_processed_hour = current_hour
            log.info("Cycle complete\n")

        except KeyboardInterrupt:
            break
        except Exception as e:
            log.error(f"Error in main loop: {e}", exc_info=True)
            time.sleep(60)  # back off on error

    log.info("Service stopped")


if __name__ == "__main__":
    run()
