"""
Autoresearch-trading training script. Single-GPU, single-file.
Adapted from karpathy/autoresearch for price prediction.
Usage: uv run train.py
"""

import os
os.environ["PYTORCH_ALLOC_CONF"] = "expandable_segments:True"

import gc
import math
import time
from dataclasses import dataclass, asdict

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

from prepare import LOOKBACK, TIME_BUDGET, make_dataloader, evaluate_sharpe

# ---------------------------------------------------------------------------
# Model
# ---------------------------------------------------------------------------

@dataclass
class ModelConfig:
    num_features: int = 15     # set dynamically from data
    lookback: int = LOOKBACK   # 60 hourly bars
    d_model: int = 128         # hidden dimension
    n_heads: int = 4           # attention heads
    n_layers: int = 3          # transformer encoder layers
    dropout: float = 0.1       # dropout rate
    ffn_mult: int = 4          # FFN hidden = d_model * ffn_mult


class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=512):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        self.register_buffer('pe', pe.unsqueeze(0))  # (1, max_len, d_model)

    def forward(self, x):
        return x + self.pe[:, :x.size(1)]


class TransformerPredictor(nn.Module):
    """
    Transformer encoder for time-series price prediction.
    Input: (batch, lookback, num_features)
    Output: (batch, 1) — predicted next-bar return
    """

    def __init__(self, config):
        super().__init__()
        self.config = config

        # Input projection
        self.input_proj = nn.Linear(config.num_features, config.d_model)
        self.pos_enc = PositionalEncoding(config.d_model, max_len=config.lookback + 10)

        # Transformer encoder
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=config.d_model,
            nhead=config.n_heads,
            dim_feedforward=config.d_model * config.ffn_mult,
            dropout=config.dropout,
            activation='gelu',
            batch_first=True,
            norm_first=True,
        )
        self.encoder = nn.TransformerEncoder(encoder_layer, num_layers=config.n_layers)

        # Output head: pool over time -> predict return
        self.norm = nn.LayerNorm(config.d_model)
        self.head = nn.Sequential(
            nn.Linear(config.d_model, config.d_model),
            nn.GELU(),
            nn.Dropout(config.dropout),
            nn.Linear(config.d_model, 1),
        )

    def forward(self, x):
        """x: (batch, lookback, num_features) -> (batch, 1)"""
        x = self.input_proj(x)
        x = self.pos_enc(x)
        x = self.encoder(x)

        # Mean pool over time dimension
        x = x.mean(dim=1)
        x = self.norm(x)
        x = self.head(x)
        return x

    def compute_loss(self, x, targets):
        """
        Combined loss: MSE on return prediction + directional accuracy penalty.
        """
        preds = self.forward(x).squeeze(-1)

        # MSE loss on returns
        mse_loss = F.mse_loss(preds, targets)

        # Directional loss: penalize wrong sign predictions
        pred_sign = torch.tanh(preds * 10)  # soft sign
        target_sign = torch.sign(targets)
        direction_loss = F.mse_loss(pred_sign, target_sign)

        # Combined
        loss = mse_loss + 0.1 * direction_loss
        return loss


# ---------------------------------------------------------------------------
# Hyperparameters (edit these directly, no CLI flags needed)
# ---------------------------------------------------------------------------

# Model architecture
D_MODEL = 128           # hidden dimension
N_HEADS = 4             # attention heads
N_LAYERS = 3            # transformer layers
DROPOUT = 0.1           # dropout
FFN_MULT = 4            # FFN multiplier

# Optimization
LEARNING_RATE = 1e-3    # peak learning rate
WEIGHT_DECAY = 0.01     # AdamW weight decay
ADAM_BETAS = (0.9, 0.999)
WARMUP_RATIO = 0.1      # fraction of time budget for LR warmup
WARMDOWN_RATIO = 0.3    # fraction of time budget for LR warmdown
FINAL_LR_FRAC = 0.01    # final LR as fraction of initial

# Training
BATCH_SIZE = 256         # batch size (reduce if OOM)
GRAD_CLIP = 1.0          # gradient clipping norm

# ---------------------------------------------------------------------------
# Setup: data, model, optimizer
# ---------------------------------------------------------------------------

t_start = time.time()
torch.manual_seed(42)
torch.cuda.manual_seed(42)
np.random.seed(42)
torch.set_float32_matmul_precision("high")
device = torch.device("cuda")

# Load prepared data
data_path = os.path.join(os.path.expanduser("~"), ".cache", "autoresearch-trading", "data", "tensors.pt")
print(f"Loading data from {data_path}...")
saved = torch.load(data_path, map_location="cpu", weights_only=True)
train_data = saved["train"]
val_data = saved["val"]
stats = saved["stats"]
num_features = train_data["features"].shape[-1]
print(f"Train: {len(train_data['features']):,} samples, Val: {len(val_data['features']):,} samples")
print(f"Features per bar: {num_features}, Lookback: {LOOKBACK}")

# Build model
config = ModelConfig(
    num_features=num_features,
    lookback=LOOKBACK,
    d_model=D_MODEL,
    n_heads=N_HEADS,
    n_layers=N_LAYERS,
    dropout=DROPOUT,
    ffn_mult=FFN_MULT,
)
print(f"Model config: {asdict(config)}")

model = TransformerPredictor(config).to(device)
num_params = sum(p.numel() for p in model.parameters())
print(f"Parameters: {num_params:,} ({num_params/1e6:.2f}M)")

optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=LEARNING_RATE,
    betas=ADAM_BETAS,
    weight_decay=WEIGHT_DECAY,
)

model = torch.compile(model, dynamic=False)

train_loader = make_dataloader(train_data, BATCH_SIZE, device=device, shuffle=True)
x, y = next(train_loader)  # prefetch first batch

print(f"Time budget: {TIME_BUDGET}s")
print(f"Batch size: {BATCH_SIZE}")

# ---------------------------------------------------------------------------
# LR schedule (time-based, matching autoresearch design)
# ---------------------------------------------------------------------------

def get_lr_multiplier(progress):
    if progress < WARMUP_RATIO:
        return progress / WARMUP_RATIO if WARMUP_RATIO > 0 else 1.0
    elif progress < 1.0 - WARMDOWN_RATIO:
        return 1.0
    else:
        cooldown = (1.0 - progress) / WARMDOWN_RATIO
        return cooldown * 1.0 + (1 - cooldown) * FINAL_LR_FRAC

# ---------------------------------------------------------------------------
# Training loop
# ---------------------------------------------------------------------------

t_start_training = time.time()
smooth_train_loss = 0
total_training_time = 0
step = 0

while True:
    torch.cuda.synchronize()
    t0 = time.time()

    model.train()
    loss = model.module.compute_loss(x, y) if hasattr(model, 'module') else model(x).squeeze(-1)

    # Handle compiled model — compute_loss might not be directly accessible
    # So we compute loss manually here
    preds = model(x).squeeze(-1)
    mse_loss = F.mse_loss(preds, y)
    pred_sign = torch.tanh(preds * 10)
    target_sign = torch.sign(y)
    direction_loss = F.mse_loss(pred_sign, target_sign)
    loss = mse_loss + 0.1 * direction_loss

    loss.backward()

    # Gradient clipping
    torch.nn.utils.clip_grad_norm_(model.parameters(), GRAD_CLIP)

    # LR schedule
    progress = min(total_training_time / TIME_BUDGET, 1.0)
    lrm = get_lr_multiplier(progress)
    for group in optimizer.param_groups:
        group["lr"] = LEARNING_RATE * lrm

    optimizer.step()
    optimizer.zero_grad(set_to_none=True)

    # Fetch next batch
    x, y = next(train_loader)

    train_loss_f = loss.item()

    # Fast fail
    if math.isnan(train_loss_f) or train_loss_f > 100:
        print("FAIL: loss exploded")
        exit(1)

    torch.cuda.synchronize()
    t1 = time.time()
    dt = t1 - t0

    if step > 5:
        total_training_time += dt

    # Logging
    ema_beta = 0.95
    smooth_train_loss = ema_beta * smooth_train_loss + (1 - ema_beta) * train_loss_f
    debiased_smooth_loss = smooth_train_loss / (1 - ema_beta**(step + 1))
    pct_done = 100 * progress
    remaining = max(0, TIME_BUDGET - total_training_time)

    if step % 10 == 0:
        print(f"\rstep {step:05d} ({pct_done:.1f}%) | loss: {debiased_smooth_loss:.6f} | lr: {LEARNING_RATE * lrm:.2e} | dt: {dt*1000:.0f}ms | remaining: {remaining:.0f}s    ", end="", flush=True)

    # GC management
    if step == 0:
        gc.collect()
        gc.freeze()
        gc.disable()

    step += 1

    if step > 5 and total_training_time >= TIME_BUDGET:
        break

print()  # newline after \r training log

# Final eval
print("Evaluating on validation set...")
model.eval()
val_sharpe = evaluate_sharpe(model, val_data, batch_size=BATCH_SIZE, device=device)

# Final summary
t_end = time.time()
peak_vram_mb = torch.cuda.max_memory_allocated() / 1024 / 1024

print("---")
print(f"val_sharpe:       {val_sharpe:.6f}")
print(f"training_seconds: {total_training_time:.1f}")
print(f"total_seconds:    {t_end - t_start:.1f}")
print(f"peak_vram_mb:     {peak_vram_mb:.1f}")
print(f"num_steps:        {step}")
print(f"num_params_M:     {num_params / 1e6:.2f}")
print(f"d_model:          {D_MODEL}")
print(f"n_layers:         {N_LAYERS}")
print(f"batch_size:       {BATCH_SIZE}")
print(f"learning_rate:    {LEARNING_RATE}")
