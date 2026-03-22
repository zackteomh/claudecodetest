# autoresearch-trading

This is an experiment to have an LLM autonomously iterate on trading strategies.
Adapted from [karpathy/autoresearch](https://github.com/karpathy/autoresearch).

## Setup

To set up a new experiment, work with the user to:

1. **Agree on a run tag**: propose a tag based on today's date (e.g. `mar22`). The branch `autoresearch/<tag>` must not already exist — this is a fresh run.
2. **Create the branch**: `git checkout -b autoresearch/<tag>` from current main.
3. **Read the in-scope files**: The repo is small. Read these files for full context:
   - `README.md` — repository context.
   - `prepare.py` — fixed constants, data prep, feature engineering, evaluation. Do not modify.
   - `train.py` — the file you modify. Model architecture, optimizer, training loop.
4. **Verify data exists**: Check that `~/.cache/autoresearch-trading/data/tensors.pt` exists. If not, tell the human to run `uv run prepare.py`.
5. **Initialize results.tsv**: Create `results.tsv` with just the header row. The baseline will be recorded after the first run.
6. **Confirm and go**: Confirm setup looks good.

Once you get confirmation, kick off the experimentation.

## Experimentation

Each experiment runs on a single GPU. The training script runs for a **fixed time budget of 5 minutes** (wall clock training time, excluding startup/compilation). You launch it simply as: `uv run train.py`.

**What you CAN do:**
- Modify `train.py` — this is the only file you edit. Everything is fair game: model architecture, optimizer, hyperparameters, training loop, batch size, model size, loss function, etc.

**What you CANNOT do:**
- Modify `prepare.py`. It is read-only. It contains the fixed evaluation, data loading, feature engineering, and training constants (time budget, lookback, etc).
- Install new packages or add dependencies. You can only use what's already in `pyproject.toml`.
- Modify the evaluation harness. The `evaluate_sharpe` function in `prepare.py` is the ground truth metric.

**The goal is simple: get the highest val_sharpe.** Since the time budget is fixed, you don't need to worry about training time — it's always 5 minutes. Everything is fair game: change the architecture, the optimizer, the hyperparameters, the batch size, the model size, the loss function. The only constraint is that the code runs without crashing and finishes within the time budget.

**VRAM** is a soft constraint. Some increase is acceptable for meaningful val_sharpe gains, but it should not blow up dramatically.

**Simplicity criterion**: All else being equal, simpler is better. A small improvement that adds ugly complexity is not worth it. Conversely, removing something and getting equal or better results is a great outcome — that's a simplification win.

**The first run**: Your very first run should always be to establish the baseline, so you will run the training script as is.

## Key differences from original autoresearch

- **Domain**: Price prediction on hourly US equity data (not language modeling)
- **Metric**: `val_sharpe` (annualized Sharpe ratio) — **higher is better** (opposite of val_bpb)
- **Data**: 60-bar lookback windows with ~15 features (returns, volatility, RSI, MACD, volume, time encodings)
- **Model**: Transformer encoder for time-series (not GPT decoder)
- **Target**: Predict next-bar log return, position sized by tanh(prediction)
- **Tickers**: 10 liquid large-cap US equities (SPY, AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA, JPM, V)

## Ideas to explore

Here are starting directions for the agent to consider:
- **Loss functions**: Try pure MSE, Sharpe-aware loss, ranking loss, quantile regression
- **Architecture**: LSTM, CNN+attention hybrid, mixture of experts, deeper/wider transformers
- **Features**: The model only sees what `prepare.py` provides, but you can engineer how to use them (e.g. attention over feature dim, feature-wise normalization layers)
- **Regularization**: Dropout, weight decay, label smoothing, data augmentation (noise injection)
- **Optimization**: Learning rate, scheduler, optimizer choice (Adam, AdamW, SGD+momentum, LAMB)
- **Ensemble**: Train multiple heads, average predictions
- **Per-ticker specialization**: Ticker embeddings, conditional layers

## Output format

Once the script finishes it prints a summary like this:

```
---
val_sharpe:       1.234567
training_seconds: 300.1
total_seconds:    325.9
peak_vram_mb:     2048.0
num_steps:        5000
num_params_M:     0.50
d_model:          128
n_layers:         3
batch_size:       256
learning_rate:    0.001
```

You can extract the key metric from the log file:

```
grep "^val_sharpe:" run.log
```

## Logging results

When an experiment is done, log it to `results.tsv` (tab-separated, NOT comma-separated).

The TSV has a header row and 5 columns:

```
commit	val_sharpe	memory_gb	status	description
```

1. git commit hash (short, 7 chars)
2. val_sharpe achieved (e.g. 1.234567) — use 0.000000 for crashes
3. peak memory in GB, round to .1f (e.g. 2.0 — divide peak_vram_mb by 1024) — use 0.0 for crashes
4. status: `keep`, `discard`, or `crash`
5. short text description of what this experiment tried

Example:

```
commit	val_sharpe	memory_gb	status	description
a1b2c3d	0.850000	2.0	keep	baseline
b2c3d4e	1.120000	2.1	keep	increase d_model to 256
c3d4e5f	0.700000	2.0	discard	switch to LSTM
d4e5f6g	0.000000	0.0	crash	double model width (OOM)
```

## The experiment loop

The experiment runs on a dedicated branch (e.g. `autoresearch/mar22`).

LOOP FOREVER:

1. Look at the git state: the current branch/commit we're on
2. Tune `train.py` with an experimental idea by directly hacking the code.
3. git commit
4. Run the experiment: `uv run train.py > run.log 2>&1` (redirect everything — do NOT use tee or let output flood your context)
5. Read out the results: `grep "^val_sharpe:\|^peak_vram_mb:" run.log`
6. If the grep output is empty, the run crashed. Run `tail -n 50 run.log` to read the Python stack trace and attempt a fix. If you can't get things to work after more than a few attempts, give up.
7. Record the results in the tsv (NOTE: do not commit the results.tsv file, leave it untracked by git)
8. If val_sharpe improved (higher), you "advance" the branch, keeping the git commit
9. If val_sharpe is equal or worse, you git reset back to where you started

**Timeout**: Each experiment should take ~5 minutes total (+ a few seconds for startup). If a run exceeds 10 minutes, kill it and treat it as a failure (discard and revert).

**Crashes**: If a run crashes (OOM, or a bug, etc.), use your judgment: If it's something dumb and easy to fix, fix it and re-run. If the idea itself is fundamentally broken, just skip it.

**NEVER STOP**: Once the experiment loop has begun, do NOT pause to ask the human if you should continue. The human might be asleep. You are autonomous. If you run out of ideas, think harder — try combining previous near-misses, try more radical architectural changes. The loop runs until the human interrupts you, period.
