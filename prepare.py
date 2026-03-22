"""
One-time data preparation for autoresearch-trading experiments.
Downloads hourly US equity data and prepares train/val tensors.

Usage:
    python prepare.py                # full prep with default tickers
    python prepare.py --tickers SPY AAPL MSFT GOOGL AMZN NVDA META TSLA JPM V

Data is stored in ~/.cache/autoresearch-trading/.
"""

import os
import argparse
import pickle
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
import torch

# ---------------------------------------------------------------------------
# Constants (fixed, do not modify)
# ---------------------------------------------------------------------------

LOOKBACK = 60              # number of hourly bars the model sees as input
FORECAST_HORIZON = 1       # predict 1-bar-ahead return
TIME_BUDGET = 300          # training time budget in seconds (5 minutes)
ANNUALIZATION = 252 * 7    # ~1764 hourly bars per year (252 days * ~7 trading hours)

# Default liquid large-cap tickers
DEFAULT_TICKERS = ["SPY", "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "JPM", "V"]

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

CACHE_DIR = os.path.join(os.path.expanduser("~"), ".cache", "autoresearch-trading")
DATA_DIR = os.path.join(CACHE_DIR, "data")

# ---------------------------------------------------------------------------
# Feature engineering
# ---------------------------------------------------------------------------

def compute_features(df):
    """
    Compute features from OHLCV hourly data for a single ticker.
    Returns a DataFrame of features aligned to the original index.
    All features are normalized / stationary.
    """
    features = pd.DataFrame(index=df.index)

    close = df["Close"]
    high = df["High"]
    low = df["Low"]
    volume = df["Volume"].replace(0, np.nan).ffill()

    # Log returns at various horizons
    features["ret_1"] = np.log(close / close.shift(1))
    features["ret_5"] = np.log(close / close.shift(5))
    features["ret_20"] = np.log(close / close.shift(20))

    # Volatility (rolling std of 1-bar returns)
    features["vol_20"] = features["ret_1"].rolling(20).std()
    features["vol_60"] = features["ret_1"].rolling(60).std()

    # RSI (14-period)
    delta = close.diff()
    gain = delta.clip(lower=0).rolling(14).mean()
    loss = (-delta.clip(upper=0)).rolling(14).mean()
    rs = gain / loss.replace(0, np.nan)
    features["rsi_14"] = (rs / (1 + rs)) - 0.5  # center around 0

    # MACD-style: short EMA - long EMA, normalized by vol
    ema_12 = close.ewm(span=12).mean()
    ema_26 = close.ewm(span=26).mean()
    features["macd_norm"] = (ema_12 - ema_26) / close

    # Volume features
    vol_ma = volume.rolling(20).mean()
    features["volume_ratio"] = (volume / vol_ma.replace(0, np.nan)) - 1.0

    # High-low range normalized
    features["hl_range"] = (high - low) / close

    # Distance from rolling highs/lows
    features["dist_high_20"] = (close - close.rolling(20).max()) / close
    features["dist_low_20"] = (close - close.rolling(20).min()) / close

    # Hour of day (cyclical encoding)
    if hasattr(df.index, 'hour'):
        hour = df.index.hour
        features["hour_sin"] = np.sin(2 * np.pi * hour / 24)
        features["hour_cos"] = np.cos(2 * np.pi * hour / 24)

    # Day of week (cyclical encoding)
    if hasattr(df.index, 'dayofweek'):
        dow = df.index.dayofweek
        features["dow_sin"] = np.sin(2 * np.pi * dow / 5)
        features["dow_cos"] = np.cos(2 * np.pi * dow / 5)

    return features


def compute_target(df):
    """Forward 1-bar log return as prediction target."""
    return np.log(df["Close"] / df["Close"].shift(-FORECAST_HORIZON))


# ---------------------------------------------------------------------------
# Data download
# ---------------------------------------------------------------------------

def download_data(tickers, period="2y"):
    """Download hourly OHLCV data via yfinance. Returns dict of DataFrames."""
    import yfinance as yf

    os.makedirs(DATA_DIR, exist_ok=True)
    cache_path = os.path.join(DATA_DIR, "raw_hourly.pkl")

    if os.path.exists(cache_path):
        print(f"Data: loading cached data from {cache_path}")
        with open(cache_path, "rb") as f:
            data = pickle.load(f)
        # Check if all tickers are present
        missing = [t for t in tickers if t not in data]
        if not missing:
            return data
        print(f"Data: missing tickers {missing}, re-downloading all...")

    print(f"Data: downloading hourly data for {tickers} ({period})...")
    data = {}
    for ticker in tickers:
        print(f"  Downloading {ticker}...")
        try:
            df = yf.download(ticker, period=period, interval="1h", progress=False)
            if len(df) < LOOKBACK * 2:
                print(f"  WARNING: {ticker} has only {len(df)} bars, skipping")
                continue
            # Flatten MultiIndex columns if present
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = df.columns.get_level_values(0)
            data[ticker] = df
            print(f"  {ticker}: {len(df)} bars from {df.index[0]} to {df.index[-1]}")
        except Exception as e:
            print(f"  ERROR downloading {ticker}: {e}")

    with open(cache_path, "wb") as f:
        pickle.dump(data, f)
    print(f"Data: saved to {cache_path}")
    return data


# ---------------------------------------------------------------------------
# Tensor preparation
# ---------------------------------------------------------------------------

def prepare_tensors(data, tickers, val_fraction=0.2):
    """
    Build feature/target tensors from raw data.
    Returns train and val datasets as dicts with keys:
        features: (N, LOOKBACK, num_features) float32 tensor
        targets:  (N,) float32 tensor — forward 1-bar return
        tickers:  (N,) int64 tensor — ticker index
    """
    all_features = []
    all_targets = []
    all_ticker_ids = []

    ticker_to_id = {t: i for i, t in enumerate(tickers)}

    for ticker in tickers:
        if ticker not in data:
            continue

        df = data[ticker]
        feat_df = compute_features(df)
        target_series = compute_target(df)

        # Combine and drop NaNs
        combined = feat_df.copy()
        combined["_target"] = target_series
        combined = combined.dropna()

        if len(combined) < LOOKBACK + 10:
            print(f"  Skipping {ticker}: only {len(combined)} valid rows after feature computation")
            continue

        feature_cols = [c for c in combined.columns if c != "_target"]
        feat_values = combined[feature_cols].values.astype(np.float32)
        target_values = combined["_target"].values.astype(np.float32)

        # Create sliding windows
        for i in range(LOOKBACK, len(feat_values)):
            window = feat_values[i - LOOKBACK:i]
            target = target_values[i - 1]  # target aligned with last bar in window
            all_features.append(window)
            all_targets.append(target)
            all_ticker_ids.append(ticker_to_id[ticker])

    if not all_features:
        raise ValueError("No valid data found. Check that tickers downloaded successfully (run prepare.py with internet access).")

    features = torch.tensor(np.array(all_features), dtype=torch.float32)
    targets = torch.tensor(np.array(all_targets), dtype=torch.float32)
    ticker_ids = torch.tensor(np.array(all_ticker_ids), dtype=torch.long)

    # Normalize features globally (z-score per feature)
    N, T, F = features.shape
    flat = features.view(-1, F)
    mean = flat.mean(dim=0)
    std = flat.std(dim=0).clamp(min=1e-8)
    features = (features - mean.view(1, 1, F)) / std.view(1, 1, F)

    # Train/val split (temporal: last val_fraction of samples per ticker)
    n_val = int(len(features) * val_fraction)
    n_train = len(features) - n_val

    train_data = {
        "features": features[:n_train],
        "targets": targets[:n_train],
        "tickers": ticker_ids[:n_train],
    }
    val_data = {
        "features": features[n_train:],
        "targets": targets[n_train:],
        "tickers": ticker_ids[n_train:],
    }

    stats = {"mean": mean, "std": std, "feature_cols": [c for c in compute_features(list(data.values())[0]).columns]}

    return train_data, val_data, stats


# ---------------------------------------------------------------------------
# Evaluation (DO NOT CHANGE — this is the fixed metric)
# ---------------------------------------------------------------------------

@torch.no_grad()
def evaluate_sharpe(model, val_data, batch_size=512, device="cuda"):
    """
    Evaluate trading Sharpe ratio on validation set.
    The model outputs a scalar prediction per sample.
    We interpret the sign as position (+1 long, -1 short)
    and magnitude as confidence (used for position sizing).

    Returns annualized Sharpe ratio.
    """
    features = val_data["features"]
    targets = val_data["targets"]
    N = len(features)

    all_preds = []
    for i in range(0, N, batch_size):
        batch_feat = features[i:i+batch_size].to(device)
        pred = model(batch_feat).squeeze(-1)
        all_preds.append(pred.cpu())

    preds = torch.cat(all_preds)

    # Position = tanh(pred) to bound between [-1, 1]
    positions = torch.tanh(preds)

    # PnL = position * actual_return
    pnl = positions * targets

    mean_ret = pnl.mean().item()
    std_ret = pnl.std().item()

    if std_ret < 1e-10:
        return 0.0

    sharpe = (mean_ret / std_ret) * np.sqrt(ANNUALIZATION)
    return sharpe


# ---------------------------------------------------------------------------
# Dataloader
# ---------------------------------------------------------------------------

def make_dataloader(data, batch_size, device="cuda", shuffle=True):
    """
    Infinite iterator yielding (features, targets) batches on device.
    """
    features = data["features"]
    targets = data["targets"]
    N = len(features)

    while True:
        if shuffle:
            perm = torch.randperm(N)
            features = features[perm]
            targets = targets[perm]

        for i in range(0, N - batch_size + 1, batch_size):
            batch_feat = features[i:i+batch_size].to(device, non_blocking=True)
            batch_tgt = targets[i:i+batch_size].to(device, non_blocking=True)
            yield batch_feat, batch_tgt


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Prepare data for autoresearch-trading")
    parser.add_argument("--tickers", nargs="+", default=DEFAULT_TICKERS,
                        help="Tickers to download")
    parser.add_argument("--period", default="2y", help="yfinance period string")
    args = parser.parse_args()

    print(f"Cache directory: {CACHE_DIR}")
    print(f"Tickers: {args.tickers}")
    print()

    # Step 1: Download data
    data = download_data(args.tickers, period=args.period)
    print()

    # Step 2: Prepare tensors
    print("Preparing feature tensors...")
    train_data, val_data, stats = prepare_tensors(data, args.tickers)
    print(f"  Train samples: {len(train_data['features']):,}")
    print(f"  Val samples:   {len(val_data['features']):,}")
    print(f"  Features per bar: {train_data['features'].shape[-1]}")
    print(f"  Lookback window: {LOOKBACK} bars")
    print()

    # Save tensors
    tensor_path = os.path.join(DATA_DIR, "tensors.pt")
    torch.save({"train": train_data, "val": val_data, "stats": stats}, tensor_path)
    print(f"Saved tensors to {tensor_path}")
    print()
    print("Done! Ready to train.")
