import { Module } from "../types";

export const foundationsModule: Module = {
  id: "fml-foundations",
  title: "ML in Finance Foundations",
  description:
    "Build the foundation for financial machine learning — understanding why finance is different, dealing with financial data characteristics, engineering features, avoiding backtesting pitfalls, and evaluating models with finance-specific metrics.",
  lessons: [
    {
      id: "fml-ml-in-finance",
      slug: "ml-in-finance",
      title: "Machine Learning in Finance",
      content: `## Machine Learning in Finance

Machine learning has become the dominant analytical framework in quantitative finance. From credit scoring to algorithmic trading to fraud detection, ML models process financial data at scale and speed that human analysts cannot match. However, applying ML to finance is fundamentally different from applying it to image recognition or natural language processing. This lesson introduces the unique opportunities and challenges of financial ML.

### Why ML in Finance?

Financial markets generate enormous quantities of structured and unstructured data:

- **Market data** — Prices, volumes, order book snapshots (terabytes per day for a single exchange)
- **Fundamental data** — Balance sheets, income statements, cash flow statements for thousands of companies
- **Alternative data** — Satellite imagery, credit card transactions, social media sentiment, web scraping
- **Text data** — SEC filings, earnings call transcripts, news articles, analyst reports
- **Transaction data** — Billions of payment transactions with fraud labels

ML excels at finding patterns in high-dimensional data — exactly the kind of data finance produces.

### Key Application Areas

| Area | ML Approach | Business Value |
|------|-----------|---------------|
| **Alpha generation** | Supervised/RL models predicting returns | Trading profits |
| **Risk management** | Classification/regression for default prediction | Reduced losses |
| **Fraud detection** | Anomaly detection, graph neural networks | Prevented fraud |
| **Portfolio optimization** | Reinforcement learning, Bayesian methods | Better risk-adjusted returns |
| **NLP for finance** | Sentiment analysis, document understanding | Faster information processing |
| **Market making** | RL agents for optimal quoting | Improved execution |

### Why Finance is Different

Applying ML to finance presents unique challenges that do not exist in other domains:

**1. Non-stationarity** — Financial data is not independently and identically distributed (i.i.d.). Markets evolve over time as regulations change, new participants enter, and economic regimes shift. A model trained on 2010-2015 data may fail completely in 2016 because the underlying data-generating process has changed.

**2. Low signal-to-noise ratio** — Financial prediction signals are extremely weak compared to noise. In image classification, the signal (pixels forming an object) dominates noise. In financial prediction, the signal (predictable component of returns) is a tiny fraction of the total variation.

**3. Non-linear, regime-dependent relationships** — The relationship between features and returns changes across market regimes (bull vs. bear, low vs. high volatility). A model that works in calm markets may fail during crises.

**4. Adversarial environment** — Unlike natural phenomena (weather, protein folding), financial markets actively adapt to your predictions. If a pattern becomes widely known, other traders will exploit it until it disappears.

**5. High cost of errors** — A misclassified image has limited consequences; a bad trading signal loses real money, potentially catastrophically with leverage.

### The ML Pipeline for Finance

\`\`\`python
# Conceptual pipeline for financial ML

# 1. Data Collection
# - Market data: prices, volumes, order flow
# - Fundamental data: financial statements
# - Alternative data: news, satellite, social

# 2. Feature Engineering
# - Technical indicators (momentum, volatility, volume)
# - Fundamental ratios (P/E, debt/equity)
# - Cross-asset features (sector returns, yield curves)
# - Alternative data features (sentiment scores, foot traffic)

# 3. Label Generation
# - Forward returns (regression target)
# - Direction classification (+1 / -1)
# - Triple-barrier method (take-profit / stop-loss / time limit)

# 4. Model Training (with temporal awareness)
# - Walk-forward cross-validation (NEVER random splits)
# - Purging: remove samples near the train/test boundary
# - Embargo: add a gap between train and test sets

# 5. Evaluation (finance-specific metrics)
# - Sharpe ratio, Sortino ratio
# - Maximum drawdown
# - Hit rate and profit factor
# - Risk-adjusted returns after transaction costs

# 6. Live Deployment
# - Paper trading first
# - Gradual capital allocation
# - Continuous monitoring for model decay
\`\`\`

### The Quantitative Research Workflow

Professional quant researchers follow a disciplined process:

1. **Hypothesis formation** — Start with an economic intuition or research paper, not with data mining
2. **Data preparation** — Clean, align, and transform data (this consumes 60-80% of total time)
3. **Feature engineering** — Create informative features grounded in financial theory
4. **Model selection** — Choose models appropriate for the task (not just the latest trend)
5. **Validation** — Use walk-forward cross-validation with purging and embargo
6. **Performance attribution** — Understand why the model works, not just that it works
7. **Production monitoring** — Continuously track live performance vs. backtest expectations

### Key Takeaway

ML in finance offers enormous potential but requires a fundamentally different approach than ML in other domains. The non-stationary, adversarial, low-signal-to-noise nature of financial data means that standard ML practices (random train-test splits, static models, accuracy as a metric) will mislead. Success requires combining ML expertise with deep financial domain knowledge.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Simulate 1000 days of market data for 5 stocks
# Each stock: returns = small_signal + large_noise

# TODO: Compute the signal-to-noise ratio for each stock
# SNR = mean(signal) / std(noise)

# TODO: Print the SNR for each stock to demonstrate
# how weak financial signals typically are
`,
      solutionCode: `import numpy as np

np.random.seed(42)

n_days = 1000
n_stocks = 5

# Signal is very weak, noise dominates
signal = np.random.normal(0.0003, 0.0001, (n_days, n_stocks))
noise = np.random.normal(0, 0.02, (n_days, n_stocks))
returns = signal + noise

for i in range(n_stocks):
    snr = np.mean(signal[:, i]) / np.std(noise[:, i])
    print(f"Stock {i+1} SNR: {snr:.6f}")
    print(f"  Signal mean: {np.mean(signal[:, i]):.6f}")
    print(f"  Noise std:   {np.std(noise[:, i]):.6f}")
`,
    },
    {
      id: "fml-financial-data",
      slug: "financial-data-characteristics",
      title: "Financial Data Characteristics",
      content: `## Financial Data Characteristics

Financial data has properties that violate the assumptions underlying most standard machine learning algorithms. Understanding these characteristics is not academic — ignoring them leads to models that look brilliant in backtests and fail catastrophically in production. This lesson covers the key statistical properties of financial time series data.

### Non-Stationarity

Financial time series are fundamentally non-stationary:

- **Prices** trend upward over long periods (stocks, real estate) or exhibit mean-reverting behavior at different time scales
- **Volatility** clusters — periods of high volatility persist and are followed by more high volatility (GARCH effects)
- **Correlations** change over time — assets that were uncorrelated in calm markets become highly correlated during crises
- **Market regimes** shift — bull markets, bear markets, and ranging markets have different statistical properties

**Implication for ML:** You cannot randomly shuffle financial data for cross-validation. The temporal order matters because models trained on one regime may not generalize to another.

### Fat Tails and Non-Normality

Financial returns exhibit heavier tails than the normal distribution predicts:

\`\`\`python
import numpy as np
from scipy import stats

np.random.seed(42)

# Simulate returns with fat tails (Student-t with 4 df)
n = 10000
normal_returns = np.random.normal(0, 0.01, n)
fat_tail_returns = stats.t.rvs(df=4, loc=0, scale=0.008, size=n)

# Compare tail probabilities
threshold = 0.03  # 3% daily move
normal_extreme = np.mean(np.abs(normal_returns) > threshold)
fat_extreme = np.mean(np.abs(fat_tail_returns) > threshold)

print(f"P(|return| > 3%) - Normal: {normal_extreme:.4f}")
print(f"P(|return| > 3%) - Fat-tail: {fat_extreme:.4f}")
print(f"Ratio: {fat_extreme / max(normal_extreme, 1e-10):.1f}x more extreme events")

# Moments comparison
for name, data in [("Normal", normal_returns), ("Fat-tail", fat_tail_returns)]:
    print(f"\\n{name}:")
    print(f"  Mean:     {np.mean(data):.6f}")
    print(f"  Std:      {np.std(data):.6f}")
    print(f"  Skewness: {stats.skew(data):.4f}")
    print(f"  Kurtosis: {stats.kurtosis(data):.4f}")
\`\`\`

**Implication for ML:** Models that assume normality (linear regression, Gaussian processes) will underestimate tail risk. Use robust methods and be aware that extreme events occur far more often than standard models predict.

### Autocorrelation Patterns

Financial returns have a distinctive autocorrelation structure:

| Property | Returns | Squared/Absolute Returns |
|----------|---------|------------------------|
| **Autocorrelation** | Near zero at most lags | Significant and persistent |
| **Interpretation** | Prices are hard to predict | Volatility clusters (high vol follows high vol) |
| **Implication** | Directional prediction is difficult | Volatility prediction is more feasible |

This asymmetry is one of the most important properties of financial data: while you cannot easily predict whether the market will go up or down tomorrow, you can predict whether tomorrow will be volatile based on recent volatility.

### Survivorship and Look-Ahead Bias

**Survivorship bias** — Databases typically contain only assets that still exist. Companies that went bankrupt, were delisted, or were acquired are often missing. This makes historical returns look better than they actually were (survivors outperform by definition).

**Look-ahead bias** — Using information that was not available at the time of the decision. Common examples:
- Using point-in-time restated financial data instead of originally reported values
- Including companies in the universe that were not yet publicly traded
- Using the final version of economic data instead of the first release

\`\`\`python
# Example: survivorship bias in returns
np.random.seed(42)

n_stocks = 100
n_years = 10
annual_returns = np.random.normal(0.08, 0.25, (n_years, n_stocks))

# Simulate delisting: stocks that fall below a threshold are removed
cumulative = np.cumprod(1 + annual_returns, axis=0)
survived = cumulative[-1] > 0.3  # stocks that didn't lose 70%+

all_mean = np.mean(annual_returns)
survivor_mean = np.mean(annual_returns[:, survived])

print(f"All stocks avg annual return:      {all_mean:.4f}")
print(f"Surviving stocks avg annual return: {survivor_mean:.4f}")
print(f"Survivorship bias:                  {survivor_mean - all_mean:.4f}")
print(f"Stocks that survived:               {np.sum(survived)} / {n_stocks}")
\`\`\`

### Data Frequency and Aggregation

Financial data exists at multiple frequencies, each with different properties:

| Frequency | Characteristics | Use Cases |
|-----------|----------------|-----------|
| **Tick data** | Every trade/quote; microsecond timestamps | HFT, microstructure research |
| **Minute bars** | OHLCV aggregated by minute | Intraday trading |
| **Daily bars** | End-of-day OHLCV | Swing trading, factor research |
| **Monthly** | Monthly returns | Asset allocation, factor models |
| **Quarterly** | Financial statement data | Fundamental analysis |

Higher frequency data has more samples but also more noise, more microstructure effects (bid-ask bounce), and more stringent infrastructure requirements.

### Missing Data and Corporate Actions

Financial data is messy in practice:

- **Missing values** — Data gaps from exchange outages, trading halts, or data vendor issues
- **Splits** — A 2:1 stock split halves the price overnight; you must adjust historical prices
- **Dividends** — Ex-dividend date creates a price drop equal to the dividend amount
- **Mergers/acquisitions** — Symbols change, companies disappear, price series end
- **Currency effects** — International data must be adjusted for exchange rate movements

### Key Takeaway

Financial data is not "just another dataset." Its non-stationarity, fat tails, survivorship bias, and temporal dependencies require specialized handling at every stage of the ML pipeline. The most common cause of failed financial ML projects is treating financial data like i.i.d. samples from a static distribution.`,
      starterCode: `import numpy as np
from scipy import stats

np.random.seed(42)

# TODO: Generate 10000 daily returns with fat tails (Student-t, df=4)

# TODO: Compare tail probabilities with normal distribution
# at the 3% threshold

# TODO: Compute and print all four moments for both distributions

# TODO: Demonstrate survivorship bias:
# Simulate 100 stocks over 10 years, remove those that lost > 70%
# Compare average returns with and without survivors
`,
      solutionCode: `import numpy as np
from scipy import stats

np.random.seed(42)
n = 10000

normal_returns = np.random.normal(0, 0.01, n)
fat_tail_returns = stats.t.rvs(df=4, loc=0, scale=0.008, size=n)

threshold = 0.03
normal_extreme = np.mean(np.abs(normal_returns) > threshold)
fat_extreme = np.mean(np.abs(fat_tail_returns) > threshold)

print(f"P(|return| > 3%) - Normal: {normal_extreme:.4f}")
print(f"P(|return| > 3%) - Fat-tail: {fat_extreme:.4f}")

for name, data in [("Normal", normal_returns), ("Fat-tail", fat_tail_returns)]:
    print(f"\\n{name}:")
    print(f"  Mean:     {np.mean(data):.6f}")
    print(f"  Std:      {np.std(data):.6f}")
    print(f"  Skewness: {stats.skew(data):.4f}")
    print(f"  Kurtosis: {stats.kurtosis(data):.4f}")

# Survivorship bias
n_stocks = 100
n_years = 10
annual_returns = np.random.normal(0.08, 0.25, (n_years, n_stocks))
cumulative = np.cumprod(1 + annual_returns, axis=0)
survived = cumulative[-1] > 0.3

print(f"\\nAll stocks avg return:      {np.mean(annual_returns):.4f}")
print(f"Surviving stocks avg return: {np.mean(annual_returns[:, survived]):.4f}")
print(f"Survivors: {np.sum(survived)} / {n_stocks}")
`,
    },
    {
      id: "fml-feature-engineering",
      slug: "feature-engineering-finance",
      title: "Feature Engineering for Finance",
      content: `## Feature Engineering for Finance

Feature engineering is the most important step in financial machine learning. The quality of your features determines the ceiling of your model's performance — no amount of model sophistication can compensate for poor features. In finance, feature engineering draws on domain knowledge from technical analysis, fundamental analysis, and market microstructure theory.

### Categories of Financial Features

**1. Price-Based Features (Technical)**

| Feature | Formula | Interpretation |
|---------|---------|---------------|
| **Returns** | r_t = (P_t - P_{t-1}) / P_{t-1} | Price change as percentage |
| **Log returns** | ln(P_t / P_{t-1}) | Additive over time, approximately normal |
| **Moving averages** | SMA_n = mean(P_{t-n+1:t}) | Trend indicator |
| **RSI** | 100 - 100/(1 + avg_gain/avg_loss) | Momentum oscillator (0-100) |
| **Bollinger Bands** | SMA +/- k * std | Volatility-adjusted range |
| **MACD** | EMA_12 - EMA_26 | Trend-following momentum |

**2. Volatility Features**

- **Realized volatility** — Standard deviation of returns over a lookback window
- **Garman-Klass volatility** — Uses OHLC data for more efficient estimation
- **Parkinson volatility** — Uses high-low range
- **EWMA volatility** — Exponentially weighted moving average (more weight on recent data)
- **Volatility of volatility** — Second-order measure indicating regime changes

**3. Volume Features**

- **Volume moving averages** — Trend in trading activity
- **Volume-price trend** — Cumulative volume adjusted by price changes
- **On-balance volume (OBV)** — Running total of volume on up vs. down days
- **VWAP** — Volume-weighted average price (institutional benchmark)

**4. Cross-Asset Features**

- **Sector returns** — Average return of the stock's sector
- **Market returns** — S&P 500 or other broad index
- **Yield curve features** — Slope, curvature, level of the treasury yield curve
- **VIX** — Market-implied volatility (fear gauge)
- **Currency and commodity factors** — USD index, oil price, gold price

### Implementation in Python

\`\`\`python
import numpy as np

def compute_features(prices, volumes):
    """Compute a feature matrix from price and volume data."""
    n = len(prices)
    features = {}

    # Returns at multiple horizons
    for lag in [1, 5, 10, 21]:
        features[f'return_{lag}d'] = np.zeros(n)
        features[f'return_{lag}d'][lag:] = (
            prices[lag:] - prices[:-lag]) / prices[:-lag]

    # Realized volatility (20-day)
    daily_returns = np.zeros(n)
    daily_returns[1:] = np.diff(prices) / prices[:-1]
    features['vol_20d'] = np.zeros(n)
    for i in range(20, n):
        features['vol_20d'][i] = np.std(daily_returns[i-20:i]) * np.sqrt(252)

    # RSI (14-day)
    features['rsi_14'] = np.full(n, 50.0)
    for i in range(15, n):
        changes = np.diff(prices[i-14:i+1])
        gains = np.mean(changes[changes > 0]) if np.any(changes > 0) else 0
        losses = -np.mean(changes[changes < 0]) if np.any(changes < 0) else 1e-10
        rs = gains / losses
        features['rsi_14'][i] = 100 - 100 / (1 + rs)

    # Volume ratio (current / 20-day average)
    features['vol_ratio'] = np.ones(n)
    for i in range(20, n):
        avg_vol = np.mean(volumes[i-20:i])
        features['vol_ratio'][i] = volumes[i] / max(avg_vol, 1)

    # Moving average crossover signal
    features['ma_cross'] = np.zeros(n)
    for i in range(50, n):
        sma_20 = np.mean(prices[i-20:i])
        sma_50 = np.mean(prices[i-50:i])
        features['ma_cross'][i] = (sma_20 - sma_50) / sma_50

    return features

# Generate sample data
np.random.seed(42)
n = 500
returns = np.random.normal(0.0003, 0.015, n)
prices = 100 * np.exp(np.cumsum(returns))
volumes = np.random.lognormal(15, 0.5, n)

features = compute_features(prices, volumes)
print("Features computed:")
for name, values in features.items():
    print(f"  {name}: mean={np.mean(values[50:]):.6f}, "
          f"std={np.std(values[50:]):.6f}")
\`\`\`

### Feature Normalization

Financial features must be normalized carefully:

- **Z-score normalization** — Subtract rolling mean, divide by rolling standard deviation. Use a rolling window (not the full sample) to avoid look-ahead bias.
- **Rank normalization** — Convert values to their cross-sectional rank. This is robust to outliers and regime changes.
- **Quantile normalization** — Map values to a uniform or normal distribution. Useful for features with heavy tails.

### Feature Selection Pitfalls

- **Do not use future information** — A feature based on tomorrow's data is useless in production
- **Use point-in-time data** — Financial statement data should reflect what was known at the time, not restated values
- **Avoid multicollinearity** — Highly correlated features add noise without information
- **Test for stationarity** — Non-stationary features (raw prices) should be transformed into stationary ones (returns, ratios)
- **Domain knowledge matters** — A feature grounded in financial theory (factor exposures, yield curve shape) is more likely to be robust than a purely statistical pattern

### Key Takeaway

Feature engineering in finance requires combining ML expertise with financial domain knowledge. The best features are grounded in economic theory, computed without look-ahead bias, properly normalized, and tested for robustness across market regimes.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Generate 500 days of simulated price and volume data

# TODO: Implement a feature computation function that calculates:
# - 1-day, 5-day, 21-day returns
# - 20-day realized volatility
# - RSI (14-day)
# - Volume ratio (current / 20-day average)

# TODO: Print summary statistics for each feature
`,
      solutionCode: `import numpy as np

np.random.seed(42)
n = 500
returns = np.random.normal(0.0003, 0.015, n)
prices = 100 * np.exp(np.cumsum(returns))
volumes = np.random.lognormal(15, 0.5, n)

def compute_features(prices, volumes):
    n = len(prices)
    features = {}
    daily_ret = np.zeros(n)
    daily_ret[1:] = np.diff(prices) / prices[:-1]

    for lag in [1, 5, 21]:
        features[f'return_{lag}d'] = np.zeros(n)
        features[f'return_{lag}d'][lag:] = (prices[lag:] - prices[:-lag]) / prices[:-lag]

    features['vol_20d'] = np.zeros(n)
    for i in range(20, n):
        features['vol_20d'][i] = np.std(daily_ret[i-20:i]) * np.sqrt(252)

    features['rsi_14'] = np.full(n, 50.0)
    for i in range(15, n):
        changes = np.diff(prices[i-14:i+1])
        gains = np.mean(changes[changes > 0]) if np.any(changes > 0) else 0
        losses = -np.mean(changes[changes < 0]) if np.any(changes < 0) else 1e-10
        features['rsi_14'][i] = 100 - 100 / (1 + gains / losses)

    features['vol_ratio'] = np.ones(n)
    for i in range(20, n):
        features['vol_ratio'][i] = volumes[i] / max(np.mean(volumes[i-20:i]), 1)

    return features

features = compute_features(prices, volumes)
for name, values in features.items():
    print(f"{name}: mean={np.mean(values[50:]):.6f}, std={np.std(values[50:]):.6f}")
`,
    },
    {
      id: "fml-backtesting-pitfalls",
      slug: "backtesting-pitfalls",
      title: "Backtesting Pitfalls in ML",
      content: `## Backtesting Pitfalls in Financial ML

Backtesting is the most dangerous step in the financial ML pipeline. A rigorous backtest gives you justified confidence; a flawed backtest gives you unjustified confidence — and the second case is far worse than having no backtest at all. Marcos Lopez de Prado, one of the leading researchers in financial ML, estimates that most published backtests are flawed and most strategies that look profitable in backtests fail in live trading.

### The Seven Deadly Sins of Financial ML Backtesting

**1. Look-Ahead Bias** — Using information that was not available at the time of the prediction:
- Using adjusted close prices that include future dividend information
- Using financial data that was restated after the original release
- Including stocks in your universe that were not publicly traded at the time
- Normalizing features using the full dataset's statistics rather than rolling windows

**2. Survivorship Bias** — Only testing on assets that survived to the present:
- Omitting delisted stocks inflates returns by 1-2% per year
- Ignoring failed funds in manager selection overstates active management returns
- Not including defaulted bonds in credit portfolios

**3. Data Snooping (Multiple Testing)** — Testing many strategies on the same data and reporting only the best:
- If you test 100 strategies at p < 0.05, you expect 5 false positives
- The probability of finding at least one "significant" result from N independent tests is 1 - (1-0.05)^N
- For N=100, this is 99.4% — you are almost guaranteed a false discovery

**4. Overfitting** — Learning noise rather than signal:

\`\`\`python
import numpy as np

np.random.seed(42)

# Demonstrate overfitting: random data with no signal
n_train = 500
n_test = 200
n_features = 50

# Pure noise - no signal exists
X_train = np.random.normal(0, 1, (n_train, n_features))
y_train = np.random.normal(0, 0.01, n_train)
X_test = np.random.normal(0, 1, (n_test, n_features))
y_test = np.random.normal(0, 0.01, n_test)

# Overfit: find the best linear combination in-sample
# (equivalent to data mining many features)
betas = np.linalg.lstsq(X_train, y_train, rcond=None)[0]
train_pred = X_train @ betas
test_pred = X_test @ betas

train_corr = np.corrcoef(train_pred, y_train)[0, 1]
test_corr = np.corrcoef(test_pred, y_test)[0, 1]

print(f"Train correlation: {train_corr:.4f}")
print(f"Test correlation:  {test_corr:.4f}")
print(f"Overfitting ratio: {abs(train_corr / max(abs(test_corr), 1e-6)):.1f}x")
\`\`\`

**5. Ignoring Transaction Costs** — Many strategies that appear profitable before costs are unprofitable after:
- Spreads: 0.01-0.10% per trade depending on the asset
- Commissions: \$0.001-0.005 per share
- Market impact: proportional to sqrt(volume/ADV)
- Short selling costs: 0.5-10% annualized for borrow fees

**6. Temporal Leakage in Cross-Validation** — Standard k-fold cross-validation shuffles data randomly, mixing future data into training sets:

The solution is **purged walk-forward cross-validation**:
- Train on data from time 0 to T
- Purge: remove samples within a buffer window around T (to prevent label leakage)
- Embargo: add a gap between training and test sets
- Test on data from T + embargo to T + embargo + test_window
- Roll forward and repeat

**7. Selection Bias in Reporting** — Researchers and practitioners tend to:
- Report only strategies that worked
- Cherry-pick the best parameter set
- Choose the most favorable time period
- Ignore strategies that were tried and failed

### The Deflated Sharpe Ratio

Lopez de Prado's deflated Sharpe ratio accounts for multiple testing:

\`\`\`python
def deflated_sharpe_ratio(observed_sr, n_trials, n_obs,
                          skewness=0, kurtosis=3):
    """
    Test whether an observed Sharpe ratio is significant
    after accounting for multiple testing.
    """
    from scipy.stats import norm

    # Expected maximum Sharpe under null hypothesis
    # (from n_trials random strategies)
    e_max_sr = norm.ppf(1 - 1/n_trials) * np.sqrt(1/n_obs)

    # Standard error of Sharpe ratio
    se = np.sqrt((1 + 0.5 * observed_sr**2 -
                  skewness * observed_sr +
                  (kurtosis - 3) / 4 * observed_sr**2) / n_obs)

    # Test statistic: is observed SR > expected max from random trials?
    psr = norm.cdf((observed_sr - e_max_sr) / se)
    return psr

# Example: you tested 50 strategies and the best has SR = 1.5
# over 252 daily observations
psr = deflated_sharpe_ratio(
    observed_sr=1.5,
    n_trials=50,
    n_obs=252
)
print(f"Deflated Sharpe p-value: {psr:.4f}")
print(f"Significant at 5%? {psr > 0.95}")
\`\`\`

### Best Practices

| Practice | Why It Matters |
|----------|---------------|
| Walk-forward validation with purging | Prevents temporal leakage |
| Deflated Sharpe ratio | Accounts for multiple testing |
| Out-of-sample testing on held-out period | Final sanity check before deployment |
| Parameter stability analysis | Ensures results are not fragile to small changes |
| Include transaction costs from the start | Eliminates strategies that only work in theory |
| Track all experiments | Enables honest accounting of selection bias |

### Key Takeaway

The vast majority of "profitable" backtests are artifacts of look-ahead bias, overfitting, survivorship bias, or multiple testing. The single most important skill in financial ML is knowing how to validate rigorously. If you cannot be confident in your backtest, you cannot be confident in your strategy.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Demonstrate overfitting on random data
# Generate random features (50) and random returns (no signal)
# Fit a linear model and show train vs test correlation

# TODO: Implement the deflated Sharpe ratio test
# Test a Sharpe ratio of 1.5 from 50 trials over 252 observations
`,
      solutionCode: `import numpy as np
from scipy.stats import norm

np.random.seed(42)

# Overfitting demonstration
n_train, n_test, n_features = 500, 200, 50
X_train = np.random.normal(0, 1, (n_train, n_features))
y_train = np.random.normal(0, 0.01, n_train)
X_test = np.random.normal(0, 1, (n_test, n_features))
y_test = np.random.normal(0, 0.01, n_test)

betas = np.linalg.lstsq(X_train, y_train, rcond=None)[0]
train_corr = np.corrcoef(X_train @ betas, y_train)[0, 1]
test_corr = np.corrcoef(X_test @ betas, y_test)[0, 1]

print(f"Train correlation: {train_corr:.4f}")
print(f"Test correlation:  {test_corr:.4f}")

# Deflated Sharpe ratio
def deflated_sharpe_ratio(observed_sr, n_trials, n_obs, skewness=0, kurtosis=3):
    e_max_sr = norm.ppf(1 - 1/n_trials) * np.sqrt(1/n_obs)
    se = np.sqrt((1 + 0.5 * observed_sr**2 -
                  skewness * observed_sr +
                  (kurtosis - 3) / 4 * observed_sr**2) / n_obs)
    return norm.cdf((observed_sr - e_max_sr) / se)

psr = deflated_sharpe_ratio(1.5, 50, 252)
print(f"\\nDeflated Sharpe p-value: {psr:.4f}")
print(f"Significant at 5%? {psr > 0.95}")
`,
    },
    {
      id: "fml-evaluation-metrics",
      slug: "evaluation-metrics-finance",
      title: "Evaluation Metrics (Sharpe/Sortino/Drawdown)",
      content: `## Evaluation Metrics for Financial ML

Standard ML metrics like accuracy, precision, and AUC are insufficient for evaluating financial models. A model that predicts market direction with 51% accuracy might be wildly profitable, while one with 60% accuracy might lose money after transaction costs. Finance requires its own evaluation framework that accounts for risk, transaction costs, and the economic significance of predictions.

### Return-Based Metrics

**Sharpe Ratio** — The most widely used risk-adjusted performance metric:

\`\`\`
Sharpe = (R_p - R_f) / sigma_p
\`\`\`

where R_p is the portfolio return, R_f is the risk-free rate, and sigma_p is the portfolio volatility (standard deviation of returns).

| Sharpe Ratio | Interpretation |
|-------------|----------------|
| < 0 | Strategy loses money |
| 0.0 - 0.5 | Marginal (barely worth the risk) |
| 0.5 - 1.0 | Acceptable (many hedge funds target this) |
| 1.0 - 2.0 | Very good (top-tier systematic strategies) |
| > 2.0 | Exceptional or suspicious (possible overfitting) |

**Annualization:** Sharpe is typically annualized: multiply daily Sharpe by sqrt(252), monthly by sqrt(12).

**Sortino Ratio** — Like Sharpe but only penalizes downside volatility:

\`\`\`
Sortino = (R_p - R_f) / sigma_downside
\`\`\`

This is more appropriate for strategies with asymmetric returns (e.g., option-selling strategies that earn small gains most of the time but have occasional large losses).

### Drawdown Metrics

**Maximum Drawdown** — The largest peak-to-trough decline:

\`\`\`python
import numpy as np

def compute_metrics(returns, rf_annual=0.02):
    """Compute comprehensive financial metrics."""
    # Basic returns
    cum_returns = np.cumprod(1 + returns)
    total_return = cum_returns[-1] - 1
    ann_return = (1 + total_return) ** (252 / len(returns)) - 1

    # Volatility
    ann_vol = np.std(returns) * np.sqrt(252)

    # Sharpe ratio
    rf_daily = (1 + rf_annual) ** (1/252) - 1
    excess_returns = returns - rf_daily
    sharpe = np.mean(excess_returns) / np.std(excess_returns) * np.sqrt(252)

    # Sortino ratio (downside deviation)
    downside = returns[returns < 0]
    downside_std = np.std(downside) * np.sqrt(252) if len(downside) > 0 else 1e-10
    sortino = (ann_return - rf_annual) / downside_std

    # Maximum drawdown
    peak = np.maximum.accumulate(cum_returns)
    drawdowns = (cum_returns - peak) / peak
    max_dd = np.min(drawdowns)

    # Calmar ratio (return / max drawdown)
    calmar = ann_return / abs(max_dd) if max_dd != 0 else 0

    # Win rate
    win_rate = np.mean(returns > 0)

    # Profit factor
    gross_profits = np.sum(returns[returns > 0])
    gross_losses = abs(np.sum(returns[returns < 0]))
    profit_factor = gross_profits / max(gross_losses, 1e-10)

    return {
        'total_return': total_return,
        'ann_return': ann_return,
        'ann_volatility': ann_vol,
        'sharpe_ratio': sharpe,
        'sortino_ratio': sortino,
        'max_drawdown': max_dd,
        'calmar_ratio': calmar,
        'win_rate': win_rate,
        'profit_factor': profit_factor,
    }

# Example: evaluate a strategy
np.random.seed(42)
strategy_returns = np.random.normal(0.0003, 0.01, 504)  # 2 years

metrics = compute_metrics(strategy_returns)
for name, value in metrics.items():
    print(f"{name:20s}: {value:.4f}")
\`\`\`

### Strategy-Specific Metrics

| Metric | Formula | What It Measures |
|--------|---------|-----------------|
| **Information Ratio** | (R_p - R_benchmark) / TE | Active return per unit of tracking error |
| **Treynor Ratio** | (R_p - R_f) / beta | Return per unit of systematic risk |
| **Hit Rate** | N_profitable / N_total | Percentage of profitable trades |
| **Average Win / Average Loss** | Mean profit / Mean loss | Payoff ratio |
| **Turnover** | Value traded / Portfolio value | Trading activity (affects costs) |
| **Kelly Fraction** | (p * b - q) / b | Optimal position size (p=win prob, b=win/loss ratio) |

### Why Accuracy is Not Enough

Consider two models predicting daily stock direction:

**Model A:** 55% accuracy, but wins are +0.5% on average and losses are -0.7% on average. Expected daily return: 0.55 * 0.005 - 0.45 * 0.007 = -0.0004 (loses money despite high accuracy).

**Model B:** 48% accuracy, but wins are +1.2% on average and losses are -0.3% on average. Expected daily return: 0.48 * 0.012 - 0.52 * 0.003 = +0.0042 (profitable despite low accuracy).

The lesson: **accuracy does not equal profitability**. What matters is the combination of hit rate, average win size, average loss size, and transaction costs.

### Evaluating ML Models for Trading

For an ML model that generates trading signals, the evaluation should proceed in layers:

1. **Statistical evaluation** — Does the model's prediction have statistically significant correlation with future returns?
2. **Economic evaluation** — After converting predictions to positions (with realistic position sizing), is the Sharpe ratio meaningful?
3. **Cost-adjusted evaluation** — After accounting for transaction costs (spreads, commissions, market impact), is the strategy still profitable?
4. **Risk evaluation** — Are the drawdowns acceptable? Is the strategy robust across regimes?
5. **Stability evaluation** — Is performance consistent across sub-periods, or concentrated in a few lucky months?

### Key Takeaway

Financial ML evaluation requires metrics that capture risk-adjusted returns, drawdown characteristics, and economic profitability after costs. The Sharpe ratio, Sortino ratio, maximum drawdown, and profit factor form the core evaluation toolkit. Always evaluate after transaction costs, and be deeply skeptical of Sharpe ratios above 2.0 in backtests.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Implement a comprehensive metrics function that computes:
# - Total return, annualized return
# - Annualized volatility
# - Sharpe ratio, Sortino ratio
# - Maximum drawdown, Calmar ratio
# - Win rate, profit factor

# TODO: Generate 504 days of simulated strategy returns

# TODO: Compute and print all metrics
`,
      solutionCode: `import numpy as np

def compute_metrics(returns, rf_annual=0.02):
    cum_returns = np.cumprod(1 + returns)
    total_return = cum_returns[-1] - 1
    ann_return = (1 + total_return) ** (252 / len(returns)) - 1
    ann_vol = np.std(returns) * np.sqrt(252)

    rf_daily = (1 + rf_annual) ** (1/252) - 1
    excess = returns - rf_daily
    sharpe = np.mean(excess) / np.std(excess) * np.sqrt(252)

    downside = returns[returns < 0]
    down_std = np.std(downside) * np.sqrt(252) if len(downside) > 0 else 1e-10
    sortino = (ann_return - rf_annual) / down_std

    peak = np.maximum.accumulate(cum_returns)
    max_dd = np.min((cum_returns - peak) / peak)
    calmar = ann_return / abs(max_dd) if max_dd != 0 else 0

    win_rate = np.mean(returns > 0)
    gross_profits = np.sum(returns[returns > 0])
    gross_losses = abs(np.sum(returns[returns < 0]))
    profit_factor = gross_profits / max(gross_losses, 1e-10)

    return {
        'total_return': total_return, 'ann_return': ann_return,
        'ann_volatility': ann_vol, 'sharpe_ratio': sharpe,
        'sortino_ratio': sortino, 'max_drawdown': max_dd,
        'calmar_ratio': calmar, 'win_rate': win_rate,
        'profit_factor': profit_factor,
    }

np.random.seed(42)
strategy_returns = np.random.normal(0.0003, 0.01, 504)
metrics = compute_metrics(strategy_returns)
for name, value in metrics.items():
    print(f"{name:20s}: {value:.4f}")
`,
    },
  ],
};
