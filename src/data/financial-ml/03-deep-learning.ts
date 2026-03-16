import { Module } from "../types";

export const deepLearningModule: Module = {
  id: "fml-deep-learning",
  title: "Deep Learning for Finance",
  description:
    "Apply deep learning architectures to financial problems — LSTMs for time series, CNNs for chart patterns, Transformers for market prediction, attention mechanisms, and GANs for synthetic data generation.",
  lessons: [
    {
      id: "fml-lstm",
      slug: "lstms-for-time-series",
      title: "LSTMs for Time Series",
      content: `## LSTMs for Financial Time Series

Long Short-Term Memory (LSTM) networks are a type of recurrent neural network designed to capture long-range dependencies in sequential data. In finance, LSTMs process sequences of historical returns, prices, and features to predict future values. While they are more complex than tree-based models, LSTMs can capture temporal patterns that static models miss.

### Why LSTMs for Finance?

Financial data is inherently sequential — today's market state depends on yesterday's, which depends on the day before. Standard ML models (random forests, XGBoost) treat each observation independently, ignoring this temporal structure. LSTMs explicitly model the sequential nature of financial data through their internal memory mechanism.

### The LSTM Architecture

An LSTM cell maintains two state vectors:
- **Cell state (C)** — Long-term memory that carries information across many time steps
- **Hidden state (h)** — Short-term output used for predictions

Three gates control information flow:

| Gate | Function | Formula |
|------|----------|---------|
| **Forget gate** | Decides what to forget from cell state | f = sigmoid(W_f * [h_{t-1}, x_t] + b_f) |
| **Input gate** | Decides what new information to store | i = sigmoid(W_i * [h_{t-1}, x_t] + b_i) |
| **Output gate** | Decides what to output | o = sigmoid(W_o * [h_{t-1}, x_t] + b_o) |

### Implementing an LSTM for Return Prediction

\`\`\`python
import numpy as np

# LSTM concept: prepare sequential data for financial prediction
np.random.seed(42)

def create_sequences(features, targets, lookback=20):
    """
    Create sequences of (lookback) days for LSTM input.
    features: (n_days, n_features) array
    targets: (n_days,) array of forward returns
    Returns: X of shape (n_samples, lookback, n_features), y of shape (n_samples,)
    """
    X, y = [], []
    for i in range(lookback, len(features)):
        X.append(features[i - lookback:i])
        y.append(targets[i])
    return np.array(X), np.array(y)

# Simulate financial features
n_days = 1000
n_features = 5

# Features: returns, volume, volatility, momentum, spread
features = np.random.normal(0, 1, (n_days, n_features))

# Target: forward return with weak signal from past patterns
signal = 0.1 * np.mean(features[:-1, 0:2], axis=1)  # weak signal
noise = np.random.normal(0, 0.01, n_days - 1)
targets = np.zeros(n_days)
targets[1:] = signal + noise

# Create sequences
lookback = 20
X, y = create_sequences(features, targets, lookback)

# Walk-forward split
split = int(0.7 * len(X))
X_train, y_train = X[:split], y[:split]
X_test, y_test = X[split:], y[split:]

print(f"Training sequences: {X_train.shape}")
print(f"Test sequences:     {X_test.shape}")
print(f"Each sequence: {lookback} days x {n_features} features")

# In practice, you would build the LSTM with PyTorch:
# class FinancialLSTM(nn.Module):
#     def __init__(self, input_size, hidden_size, num_layers, dropout):
#         super().__init__()
#         self.lstm = nn.LSTM(input_size, hidden_size, num_layers,
#                             batch_first=True, dropout=dropout)
#         self.fc = nn.Linear(hidden_size, 1)
#
#     def forward(self, x):
#         lstm_out, _ = self.lstm(x)
#         return self.fc(lstm_out[:, -1, :])  # use last hidden state
\`\`\`

### Best Practices for Financial LSTMs

**Data preparation:**
- Normalize features using rolling z-scores (not global statistics)
- Use returns, not raw prices (stationarity)
- Include multiple feature types (price-based, volume, cross-asset)

**Architecture choices:**
- 1-2 LSTM layers (deeper networks overfit on financial data)
- Hidden size of 32-128 (larger than needed = overfitting)
- Dropout of 0.2-0.5 between layers
- Lookback window of 10-60 days (task dependent)

**Training:**
- Use early stopping on a validation set
- Learning rate scheduling (reduce on plateau)
- Batch normalization for training stability
- Walk-forward validation, never random splits

### Limitations

LSTMs face several challenges in finance:

- **Overfitting** — LSTMs have many parameters and can memorize training sequences
- **Non-stationarity** — Patterns the LSTM learns may not persist into the future
- **Computational cost** — Training is much slower than tree-based models
- **Interpretability** — Understanding why an LSTM makes a particular prediction is difficult
- **Diminishing returns** — For many financial prediction tasks, XGBoost performs comparably with much less effort

### Key Takeaway

LSTMs are powerful tools for sequential financial data but require careful regularization and validation. They shine when temporal patterns genuinely exist in the data (volatility clustering, momentum) but should not be the default choice — tree-based models often perform equally well with less complexity.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Generate 1000 days of 5 financial features

# TODO: Create a target with weak signal from past patterns

# TODO: Implement create_sequences() to prepare LSTM input
# with a lookback window of 20 days

# TODO: Split into train/test and print shapes
`,
      solutionCode: `import numpy as np

np.random.seed(42)

def create_sequences(features, targets, lookback=20):
    X, y = [], []
    for i in range(lookback, len(features)):
        X.append(features[i - lookback:i])
        y.append(targets[i])
    return np.array(X), np.array(y)

n_days, n_features = 1000, 5
features = np.random.normal(0, 1, (n_days, n_features))
signal = 0.1 * np.mean(features[:-1, 0:2], axis=1)
targets = np.zeros(n_days)
targets[1:] = signal + np.random.normal(0, 0.01, n_days - 1)

X, y = create_sequences(features, targets, 20)
split = int(0.7 * len(X))
X_train, y_train = X[:split], y[:split]
X_test, y_test = X[split:], y[split:]

print(f"Training: {X_train.shape}, Test: {X_test.shape}")
print(f"Each sequence: 20 days x {n_features} features")
`,
    },
    {
      id: "fml-cnn-charts",
      slug: "cnns-on-financial-charts",
      title: "CNNs on Financial Charts",
      content: `## CNNs on Financial Charts

Convolutional Neural Networks (CNNs), typically associated with image recognition, have found a surprising application in finance: analyzing price charts as images. The idea is straightforward — if human traders can identify patterns in candlestick charts, perhaps a CNN can learn to do the same, potentially identifying patterns that humans miss.

### The Chart-as-Image Approach

Traditional feature engineering extracts numerical features (returns, volatility, RSI) from price data. The chart-as-image approach takes a different path:

1. **Convert price data to candlestick charts** — Each chart covers a fixed lookback period (e.g., 20, 40, or 60 days)
2. **Render as pixel images** — Standard chart with OHLC candles, possibly including volume bars and moving averages
3. **Feed into a CNN** — The CNN learns to extract visual patterns directly from the chart images
4. **Predict forward returns** — Classification (up/down) or regression (expected return)

### Why This Might Work

Technical analysis has been used by traders for over a century. Common chart patterns include:

| Pattern | Visual Description | Traditional Interpretation |
|---------|-------------------|--------------------------|
| **Head and shoulders** | Three peaks, middle tallest | Bearish reversal |
| **Double bottom** | Two troughs at similar levels | Bullish reversal |
| **Cup and handle** | U-shape followed by small dip | Bullish continuation |
| **Triangle** | Converging trendlines | Breakout pending |
| **Flag** | Brief consolidation after sharp move | Continuation |

Academic research by Jiang, Kelly, and Xiu (2023) demonstrated that CNNs applied to financial chart images can extract predictive signals that are not captured by traditional numerical features. The key finding: visual representations contain information about cross-feature interactions that is difficult to engineer manually.

### Creating Chart Images

\`\`\`python
import numpy as np

def price_to_image(ohlcv, image_size=64):
    """
    Convert OHLCV data to a grayscale image representation.
    Each column represents one trading day.
    Pixel intensity encodes price relative to the day's range.
    """
    n_days = len(ohlcv)
    image = np.zeros((image_size, n_days))

    opens, highs, lows, closes, volumes = ohlcv.T

    # Normalize prices to [0, 1] range
    price_min = np.min(lows)
    price_max = np.max(highs)
    price_range = price_max - price_min
    if price_range == 0:
        return image

    for i in range(n_days):
        # Map prices to pixel rows
        open_px = int((opens[i] - price_min) / price_range * (image_size - 1))
        close_px = int((closes[i] - price_min) / price_range * (image_size - 1))
        high_px = int((highs[i] - price_min) / price_range * (image_size - 1))
        low_px = int((lows[i] - price_min) / price_range * (image_size - 1))

        # Draw the wick (high to low)
        image[low_px:high_px + 1, i] = 0.5

        # Draw the body (open to close)
        body_low = min(open_px, close_px)
        body_high = max(open_px, close_px)
        # Green candle (close > open) = bright, red = dark
        body_value = 1.0 if closes[i] >= opens[i] else 0.3
        image[body_low:body_high + 1, i] = body_value

    # Flip so that higher prices are at the top
    return np.flipud(image)

# Generate sample OHLCV data
np.random.seed(42)
n_days = 40

close = 100 * np.exp(np.cumsum(np.random.normal(0.001, 0.015, n_days)))
high = close * (1 + np.abs(np.random.normal(0, 0.005, n_days)))
low = close * (1 - np.abs(np.random.normal(0, 0.005, n_days)))
opens = close * (1 + np.random.normal(0, 0.003, n_days))
volumes = np.random.lognormal(15, 0.3, n_days)

ohlcv = np.column_stack([opens, high, low, close, volumes])
chart_image = price_to_image(ohlcv, image_size=64)

print(f"Chart image shape: {chart_image.shape}")
print(f"Pixel value range: [{chart_image.min():.1f}, {chart_image.max():.1f}]")
print(f"Non-zero pixels: {np.sum(chart_image > 0)}")
\`\`\`

### CNN Architecture for Charts

A typical CNN architecture for financial chart classification:

\`\`\`
Input: (batch, 1, 64, 40) — grayscale chart image

Conv2D(1 -> 16, kernel=3x3, padding=1) + BatchNorm + ReLU
MaxPool2D(2x2)

Conv2D(16 -> 32, kernel=3x3, padding=1) + BatchNorm + ReLU
MaxPool2D(2x2)

Conv2D(32 -> 64, kernel=3x3, padding=1) + BatchNorm + ReLU
GlobalAvgPool2D

Linear(64 -> 32) + ReLU + Dropout(0.5)
Linear(32 -> 1) — output: predicted return or probability
\`\`\`

### Multi-Channel Chart Images

More sophisticated approaches use multiple image channels:

- **Channel 1:** Candlestick chart (OHLC body and wicks)
- **Channel 2:** Volume bars
- **Channel 3:** Moving average overlays (20-day, 50-day)
- **Channel 4:** RSI or other indicator as a heatmap

This gives the CNN richer visual information while maintaining the spatial structure that convolutions exploit.

### Research Findings

Academic research on CNN-based chart analysis has found:

- CNNs can learn traditional technical patterns (head and shoulders, double bottom) without being explicitly programmed
- The predictive power is strongest at 5-20 day horizons
- CNN features complement traditional numerical features — combining both improves performance
- The approach works across markets (US, Europe, Asia) and asset classes
- Performance degrades during extreme market conditions (high volatility, crashes)

### Limitations

- **Data requirements** — CNNs need large datasets to train; financial data is limited
- **Computational cost** — Processing thousands of chart images is expensive
- **Interpretability** — Harder to explain than feature-based models
- **Overfitting** — The high parameter count of CNNs is dangerous with limited financial data
- **Stationarity assumption** — Chart patterns that worked historically may not persist

### Key Takeaway

CNNs applied to financial chart images represent an innovative approach to financial prediction that complements traditional feature-based methods. They can capture visual patterns and cross-feature interactions that numerical features miss. However, they require careful validation and should be used alongside — not instead of — conventional approaches.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Generate 40 days of simulated OHLCV data

# TODO: Implement price_to_image() to convert OHLCV
# to a 64-pixel-high grayscale chart image

# TODO: Print the image shape and basic statistics
`,
      solutionCode: `import numpy as np

def price_to_image(ohlcv, image_size=64):
    n_days = len(ohlcv)
    image = np.zeros((image_size, n_days))
    opens, highs, lows, closes, volumes = ohlcv.T
    price_min, price_max = np.min(lows), np.max(highs)
    price_range = price_max - price_min
    if price_range == 0:
        return image
    for i in range(n_days):
        open_px = int((opens[i] - price_min) / price_range * (image_size - 1))
        close_px = int((closes[i] - price_min) / price_range * (image_size - 1))
        high_px = int((highs[i] - price_min) / price_range * (image_size - 1))
        low_px = int((lows[i] - price_min) / price_range * (image_size - 1))
        image[low_px:high_px + 1, i] = 0.5
        body_low, body_high = min(open_px, close_px), max(open_px, close_px)
        image[body_low:body_high + 1, i] = 1.0 if closes[i] >= opens[i] else 0.3
    return np.flipud(image)

np.random.seed(42)
n_days = 40
close = 100 * np.exp(np.cumsum(np.random.normal(0.001, 0.015, n_days)))
high = close * (1 + np.abs(np.random.normal(0, 0.005, n_days)))
low = close * (1 - np.abs(np.random.normal(0, 0.005, n_days)))
opens = close * (1 + np.random.normal(0, 0.003, n_days))
volumes = np.random.lognormal(15, 0.3, n_days)

ohlcv = np.column_stack([opens, high, low, close, volumes])
chart = price_to_image(ohlcv)
print(f"Shape: {chart.shape}, Range: [{chart.min():.1f}, {chart.max():.1f}]")
print(f"Non-zero pixels: {np.sum(chart > 0)}")
`,
    },
    {
      id: "fml-transformers",
      slug: "transformers-for-markets",
      title: "Transformers for Market Prediction",
      content: `## Transformers for Market Prediction

The Transformer architecture, originally designed for natural language processing, has emerged as a powerful model for financial time series. Its self-attention mechanism allows it to weigh the importance of each historical time step dynamically, potentially capturing long-range dependencies and regime changes that LSTMs struggle with.

### Why Transformers for Finance?

Transformers offer several advantages over recurrent models (LSTMs, GRUs):

| Feature | LSTM | Transformer |
|---------|------|------------|
| **Parallelization** | Sequential (slow) | Fully parallel (fast) |
| **Long-range dependencies** | Struggle beyond 50-100 steps | Handle long sequences naturally |
| **Attention** | Fixed processing order | Dynamic attention to any position |
| **Gradient flow** | Vanishing gradient risk | Direct connections to all positions |
| **Interpretability** | Opaque hidden states | Attention weights show what the model focuses on |

### Self-Attention for Financial Data

The self-attention mechanism computes a weighted average of all positions in a sequence, where the weights are learned based on the content of the positions themselves:

\`\`\`
Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V
\`\`\`

In financial terms: given a sequence of 60 daily feature vectors, self-attention allows the model to attend to specific historical days that are most relevant for today's prediction. For example, it might learn to attend to recent volatility spikes, earnings dates, or similar market conditions from the past.

### Financial Transformer Architecture

\`\`\`python
import numpy as np

# Transformer concept: positional encoding + self-attention

def positional_encoding(seq_len, d_model):
    """
    Sinusoidal positional encoding for the Transformer.
    Adds position information to input embeddings.
    """
    position = np.arange(seq_len)[:, np.newaxis]
    div_term = np.exp(np.arange(0, d_model, 2) * -(np.log(10000.0) / d_model))

    pe = np.zeros((seq_len, d_model))
    pe[:, 0::2] = np.sin(position * div_term)
    pe[:, 1::2] = np.cos(position * div_term)
    return pe

def scaled_dot_product_attention(Q, K, V):
    """
    Compute scaled dot-product attention.
    Q, K, V: (seq_len, d_model)
    """
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)

    # Apply causal mask (prevent attending to future)
    seq_len = scores.shape[0]
    mask = np.triu(np.ones((seq_len, seq_len)), k=1) * -1e9
    scores = scores + mask

    # Softmax
    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    attention_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)

    output = attention_weights @ V
    return output, attention_weights

# Example: apply attention to financial features
np.random.seed(42)
seq_len = 60  # 60 trading days
d_model = 16  # embedding dimension

# Simulated feature embeddings
features = np.random.normal(0, 1, (seq_len, d_model))
pe = positional_encoding(seq_len, d_model)
features_with_pos = features + pe

# Self-attention (Q=K=V for self-attention)
output, weights = scaled_dot_product_attention(
    features_with_pos, features_with_pos, features_with_pos
)

print(f"Input shape:  {features.shape}")
print(f"Output shape: {output.shape}")
print(f"Attention weights shape: {weights.shape}")

# What does the last day attend to?
last_day_attention = weights[-1]
top_attended = np.argsort(last_day_attention)[-5:][::-1]
print(f"\\nDay 60 attends most to days: {top_attended}")
print(f"Attention weights: {last_day_attention[top_attended]}")
\`\`\`

### Temporal Fusion Transformers (TFT)

The Temporal Fusion Transformer (Google, 2021) is specifically designed for multi-horizon time series forecasting. It combines:

- **Variable selection networks** — Automatically identify the most relevant features at each time step
- **Gated residual networks** — Allow the model to skip unnecessary processing
- **Multi-head attention** — Capture different types of temporal patterns simultaneously
- **Quantile outputs** — Predict entire probability distributions, not just point estimates

TFT has achieved state-of-the-art results on multiple financial forecasting benchmarks.

### Attention as Interpretability

One of the most valuable aspects of Transformers for finance is that attention weights provide interpretability:

- **Which historical days matter?** — High attention weights on specific past days reveal what the model considers important
- **Regime detection** — Changes in attention patterns can signal regime shifts
- **Feature relevance over time** — Multi-head attention can specialize, with different heads attending to different types of patterns

### Practical Considerations

**Sequence length:** 20-120 trading days is typical. Longer sequences capture more history but increase computational cost and overfitting risk.

**Embedding dimension:** 16-64 for financial features. Larger embeddings require more data to train.

**Number of attention heads:** 2-8. Each head can specialize in different temporal patterns.

**Training data requirements:** Transformers are data-hungry. For financial applications, you often need thousands of stocks over multiple years to train effectively.

**Causal masking:** Essential for financial applications — the model must not attend to future time steps during training or inference.

### Key Takeaway

Transformers bring powerful attention mechanisms to financial time series analysis. Their ability to dynamically focus on relevant historical periods and process sequences in parallel makes them well-suited for capturing complex temporal dependencies. However, they require more data and careful regularization than simpler models, and should be validated rigorously with walk-forward testing.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Implement positional encoding for a sequence of 60 days

# TODO: Implement scaled dot-product attention with causal mask

# TODO: Apply self-attention to simulated financial features

# TODO: Print which historical days the last day attends to most
`,
      solutionCode: `import numpy as np

def positional_encoding(seq_len, d_model):
    position = np.arange(seq_len)[:, np.newaxis]
    div_term = np.exp(np.arange(0, d_model, 2) * -(np.log(10000.0) / d_model))
    pe = np.zeros((seq_len, d_model))
    pe[:, 0::2] = np.sin(position * div_term)
    pe[:, 1::2] = np.cos(position * div_term)
    return pe

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)
    seq_len = scores.shape[0]
    mask = np.triu(np.ones((seq_len, seq_len)), k=1) * -1e9
    scores = scores + mask
    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    return weights @ V, weights

np.random.seed(42)
seq_len, d_model = 60, 16
features = np.random.normal(0, 1, (seq_len, d_model))
features += positional_encoding(seq_len, d_model)

output, weights = scaled_dot_product_attention(features, features, features)
print(f"Output shape: {output.shape}")
top = np.argsort(weights[-1])[-5:][::-1]
print(f"Day 60 attends to days: {top}")
print(f"Weights: {weights[-1][top]}")
`,
    },
    {
      id: "fml-attention-prediction",
      slug: "attention-based-prediction",
      title: "Attention-Based Prediction Models",
      content: `## Attention-Based Prediction Models

Attention mechanisms have evolved beyond the standard Transformer architecture into specialized models for financial prediction. This lesson covers cross-attention between different data modalities (price, volume, news), temporal attention patterns in financial markets, and how to build production-ready attention-based prediction systems.

### Cross-Modal Attention

Financial prediction benefits from multiple data sources. Cross-attention allows the model to attend across different modalities:

- **Price features attending to news:** "What recent news events are most relevant to this stock's price pattern?"
- **Stock features attending to market:** "How does the overall market context affect this stock's outlook?"
- **Current state attending to history:** "What historical periods are most similar to now?"

\`\`\`python
import numpy as np

def cross_attention(query, key, value):
    """
    Cross-attention: query from one modality, key/value from another.
    query: (n_query, d_model)
    key, value: (n_key, d_model)
    """
    d_k = query.shape[-1]
    scores = query @ key.T / np.sqrt(d_k)
    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    output = weights @ value
    return output, weights

np.random.seed(42)

# Price features for 30 days
price_features = np.random.normal(0, 1, (30, 16))

# News embeddings (5 recent news items)
news_embeddings = np.random.normal(0, 1, (5, 16))

# Price attending to news: which news matters for price prediction?
output, attention = cross_attention(price_features, news_embeddings,
                                    news_embeddings)

print(f"Cross-attention output shape: {output.shape}")
print(f"\\nLast day's attention to each news item:")
for i, w in enumerate(attention[-1]):
    print(f"  News {i+1}: {w:.4f}")
\`\`\`

### Multi-Head Attention

Multi-head attention runs several attention mechanisms in parallel, allowing the model to attend to different types of patterns simultaneously:

\`\`\`python
def multi_head_attention(Q, K, V, n_heads=4):
    """
    Multi-head attention splits the embedding into n_heads
    and runs attention independently on each head.
    """
    d_model = Q.shape[-1]
    d_head = d_model // n_heads
    heads = []

    for h in range(n_heads):
        start = h * d_head
        end = start + d_head
        Q_h = Q[:, start:end]
        K_h = K[:, start:end]
        V_h = V[:, start:end]

        scores = Q_h @ K_h.T / np.sqrt(d_head)
        exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
        weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
        heads.append(weights @ V_h)

    # Concatenate heads
    return np.concatenate(heads, axis=-1)

# Example with 4 heads
np.random.seed(42)
seq = np.random.normal(0, 1, (30, 16))
mha_output = multi_head_attention(seq, seq, seq, n_heads=4)
print(f"Multi-head output shape: {mha_output.shape}")
\`\`\`

In finance, different attention heads often specialize:
- **Head 1** might focus on recent momentum (attending to the last 5 days)
- **Head 2** might focus on similar historical patterns (attending to days with matching volatility)
- **Head 3** might focus on periodic patterns (attending to the same day of week/month)
- **Head 4** might focus on extreme events (attending to days with large moves)

### Temporal Attention Patterns in Finance

Research has revealed characteristic attention patterns in financial Transformers:

**Recency bias:** Most attention weight falls on the most recent observations, consistent with the empirical finding that recent data is most predictive.

**Event attention:** Models learn to attend heavily to days with unusual volume or price movements — these "event days" carry disproportionate information.

**Periodic attention:** Some heads learn weekly or monthly patterns, attending to observations that are 5, 21, or 63 days in the past.

**Regime attention:** During volatile periods, the model attends to similar past volatile periods, effectively implementing a regime-matching strategy.

### Building a Production Attention Model

A complete attention-based prediction system for production use:

1. **Feature encoding** — Project raw features through learned embeddings
2. **Positional encoding** — Add temporal position information
3. **Self-attention layers** — 2-4 layers of multi-head self-attention with residual connections
4. **Cross-attention** (optional) — Attend to alternative data (news, events)
5. **Prediction head** — Linear layer mapping the final representation to predicted returns
6. **Uncertainty estimation** — Output a distribution (mean + variance) rather than a point prediction

### Attention for Portfolio Construction

Beyond predicting individual asset returns, attention can be used for portfolio construction:

- **Asset-to-asset attention** — Let each stock attend to all other stocks, capturing cross-sectional dependencies
- **Factor attention** — Attend to factor returns (market, size, value, momentum) to understand current factor exposures
- **Dynamic allocation** — Use attention weights to dynamically adjust portfolio weights based on market conditions

### Key Takeaway

Attention mechanisms provide a flexible and interpretable framework for financial prediction. Cross-modal attention integrates diverse data sources; multi-head attention captures multiple types of temporal patterns; and attention weights offer a window into what the model considers important. The combination of strong performance and interpretability makes attention-based models increasingly attractive for institutional finance applications.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Implement cross-attention between price features and news

# TODO: Implement multi-head attention with 4 heads

# TODO: Analyze which news items the model attends to most
`,
      solutionCode: `import numpy as np

def cross_attention(query, key, value):
    d_k = query.shape[-1]
    scores = query @ key.T / np.sqrt(d_k)
    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    return weights @ value, weights

def multi_head_attention(Q, K, V, n_heads=4):
    d_head = Q.shape[-1] // n_heads
    heads = []
    for h in range(n_heads):
        s, e = h * d_head, (h + 1) * d_head
        scores = Q[:, s:e] @ K[:, s:e].T / np.sqrt(d_head)
        exp_s = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
        w = exp_s / np.sum(exp_s, axis=-1, keepdims=True)
        heads.append(w @ V[:, s:e])
    return np.concatenate(heads, axis=-1)

np.random.seed(42)
price = np.random.normal(0, 1, (30, 16))
news = np.random.normal(0, 1, (5, 16))

output, attn = cross_attention(price, news, news)
print(f"Cross-attention shape: {output.shape}")
print("Last day's attention to news:")
for i, w in enumerate(attn[-1]):
    print(f"  News {i+1}: {w:.4f}")

mha = multi_head_attention(price, price, price, 4)
print(f"Multi-head output: {mha.shape}")
`,
    },
    {
      id: "fml-gan-synthetic",
      slug: "gan-synthetic-financial-data",
      title: "GAN-Generated Synthetic Financial Data",
      content: `## GAN-Generated Synthetic Financial Data

Generative Adversarial Networks (GANs) can create synthetic financial data that preserves the statistical properties of real data while providing unlimited additional training samples. This addresses one of the fundamental constraints of financial ML: limited historical data. Synthetic data can augment training sets, stress test portfolios under novel scenarios, and enable privacy-preserving data sharing.

### The Data Scarcity Problem

Financial ML suffers from a chronic shortage of independent data:

- **Daily data:** 50 years of S&P 500 daily returns = ~12,600 observations. This sounds like a lot but contains only a handful of recessions, crashes, and regime changes.
- **Regime-specific data:** If you want to train a model for bear markets, you have perhaps 3-4 bear market periods in 50 years.
- **New instruments:** Cryptocurrencies have less than 15 years of data; many altcoins have less than 5.
- **Alternative data:** Many alternative data sources (satellite imagery, credit card data) have only a few years of history.

### How Financial GANs Work

A GAN consists of two neural networks in competition:

**Generator (G):** Takes random noise as input and produces synthetic financial data (return sequences, order flows, or multi-asset time series).

**Discriminator (D):** Takes either real or synthetic data and tries to classify it as real or fake.

The two networks are trained alternately:
1. Train D to distinguish real from fake data
2. Train G to fool D (produce data that D classifies as real)
3. Repeat until D cannot reliably distinguish real from synthetic

\`\`\`python
import numpy as np

# Simplified GAN concept for financial returns
np.random.seed(42)

# Real data characteristics we want to reproduce
n_real = 1000
real_returns = np.random.standard_t(df=5, size=n_real) * 0.01
# Real data has: fat tails, volatility clustering, slight negative skew

def simple_generator(n_samples, noise_dim=10):
    """Generate synthetic returns from noise."""
    noise = np.random.normal(0, 1, (n_samples, noise_dim))
    # Simple transformation (in practice, this is a neural network)
    synthetic = np.tanh(noise @ np.random.normal(0, 0.3, (noise_dim, 1)))
    return synthetic.flatten() * 0.015

def evaluate_synthetic(real, synthetic):
    """Compare statistical properties of real and synthetic data."""
    from scipy import stats

    metrics = {}
    for name, data in [("Real", real), ("Synthetic", synthetic)]:
        metrics[name] = {
            'mean': np.mean(data),
            'std': np.std(data),
            'skew': stats.skew(data),
            'kurtosis': stats.kurtosis(data),
            'min': np.min(data),
            'max': np.max(data),
            'autocorr_1': np.corrcoef(data[:-1], data[1:])[0, 1],
        }

    print(f"{'Metric':<15} {'Real':>10} {'Synthetic':>10}")
    print("-" * 37)
    for metric in metrics['Real']:
        r = metrics['Real'][metric]
        s = metrics['Synthetic'][metric]
        print(f"{metric:<15} {r:>10.6f} {s:>10.6f}")

synthetic_returns = simple_generator(1000)
evaluate_synthetic(real_returns, synthetic_returns)
\`\`\`

### TimeGAN: Temporal GAN for Time Series

The standard GAN architecture does not capture temporal dynamics well. TimeGAN (Yoon et al., 2019) specifically addresses this by incorporating:

- **Embedding network** — Maps real data to a latent space
- **Recovery network** — Maps from latent space back to data space
- **Sequence generator** — Generates latent sequences that respect temporal dynamics
- **Sequence discriminator** — Evaluates whether temporal patterns are realistic

TimeGAN better preserves:
- Autocorrelation structure (volatility clustering)
- Cross-asset correlations
- Temporal trends and mean-reversion behavior
- Distributional properties (fat tails, skewness)

### Applications of Synthetic Financial Data

**1. Data Augmentation** — Generate additional training samples to reduce overfitting. Particularly valuable when real data is limited (e.g., credit default events, market crashes).

**2. Stress Testing** — Generate scenarios that have not occurred in history but are plausible: a 50% market crash combined with rising interest rates, or a pandemic-like shock in a different sector.

**3. Privacy-Preserving Analytics** — Share synthetic data with researchers or partners without exposing actual customer or proprietary trading data. The synthetic data preserves statistical relationships without containing any real records.

**4. Model Validation** — Test whether models generalize to data with known properties. Generate data with a specific embedded signal and verify that the model can recover it.

**5. Scenario Analysis** — Generate thousands of plausible future market paths for portfolio risk assessment, going beyond traditional Monte Carlo simulation (which assumes specific parametric distributions).

### Evaluating Synthetic Data Quality

| Metric | What It Measures | How to Compute |
|--------|-----------------|---------------|
| **Distributional similarity** | Marginal distributions match | KS test, Wasserstein distance |
| **Temporal fidelity** | Autocorrelation structure matches | Compare ACF plots |
| **Cross-correlation** | Multi-asset relationships preserved | Compare correlation matrices |
| **Tail behavior** | Extreme events are realistic | Compare tail probabilities, kurtosis |
| **Predictive utility** | Models trained on synthetic perform well on real | Train-on-synthetic, test-on-real |
| **Privacy** | No real records can be recovered | Nearest-neighbor distance tests |

### Challenges

- **Mode collapse** — GANs can produce limited variety, generating data that looks realistic but does not cover the full range of market conditions
- **Temporal coherence** — Maintaining realistic dynamics over long sequences (100+ days) is difficult
- **Multi-asset consistency** — Generating realistic joint behavior across many assets simultaneously
- **Evaluation difficulty** — There is no single metric that captures all aspects of synthetic data quality
- **Garbage in, garbage out** — Synthetic data inherits the biases and limitations of the training data

### Key Takeaway

GAN-generated synthetic financial data is a powerful tool for augmenting limited datasets, stress testing, and privacy-preserving analytics. While not a substitute for real data, well-generated synthetic data can significantly improve model robustness and enable analyses that would be impossible with historical data alone. The key is rigorous evaluation to ensure the synthetic data faithfully reproduces the statistical properties that matter for your specific application.`,
      starterCode: `import numpy as np
from scipy import stats

np.random.seed(42)

# TODO: Generate real returns with fat tails (Student-t)

# TODO: Implement a simple synthetic data generator

# TODO: Compare the statistical properties of real vs synthetic:
# mean, std, skew, kurtosis, autocorrelation
`,
      solutionCode: `import numpy as np
from scipy import stats as sp_stats

np.random.seed(42)

real_returns = np.random.standard_t(df=5, size=1000) * 0.01

def simple_generator(n_samples, noise_dim=10):
    noise = np.random.normal(0, 1, (n_samples, noise_dim))
    weights = np.random.normal(0, 0.3, (noise_dim, 1))
    synthetic = np.tanh(noise @ weights).flatten() * 0.015
    return synthetic

synthetic = simple_generator(1000)

print(f"{'Metric':<15} {'Real':>10} {'Synthetic':>10}")
print("-" * 37)
for name, fn in [('mean', np.mean), ('std', np.std),
                  ('skew', sp_stats.skew), ('kurtosis', sp_stats.kurtosis)]:
    print(f"{name:<15} {fn(real_returns):>10.6f} {fn(synthetic):>10.6f}")

r_ac = np.corrcoef(real_returns[:-1], real_returns[1:])[0, 1]
s_ac = np.corrcoef(synthetic[:-1], synthetic[1:])[0, 1]
print(f"{'autocorr_1':<15} {r_ac:>10.6f} {s_ac:>10.6f}")
`,
    },
  ],
};
