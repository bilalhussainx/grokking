import { Module } from "../types";

export const supervisedModule: Module = {
  id: "fml-supervised",
  title: "Supervised Learning for Finance",
  description:
    "Apply supervised learning to financial prediction — regression for price forecasting, classification for trading signals, ensemble methods, and proper walk-forward cross-validation.",
  lessons: [
    {
      id: "fml-price-prediction",
      slug: "price-prediction-regression",
      title: "Price Prediction with Regression",
      content: `## Price Prediction with Regression

Regression models that predict future returns from historical features are the backbone of quantitative trading strategies. While the efficient market hypothesis suggests that returns are unpredictable, decades of academic research have identified weak but persistent predictive signals. This lesson covers how to build, validate, and interpret regression models for financial prediction.

### What Are We Predicting?

The choice of prediction target fundamentally affects model design:

| Target | Pros | Cons |
|--------|------|------|
| **Raw return** (r_{t+1}) | Direct financial interpretation | Non-stationary, noisy |
| **Excess return** (r_{t+1} - r_market) | Controls for market direction | Still very noisy |
| **Normalized return** (r_{t+1} / sigma) | Scale-invariant across time | Requires volatility estimate |
| **Multi-period return** (r_{t+1:t+5}) | Stronger signal, less noise | Introduces overlapping labels |

In practice, predicting normalized 5-day or 20-day forward returns often works better than predicting raw daily returns because the signal-to-noise ratio improves with horizon (at the cost of fewer independent observations).

### Linear Regression with Regularization

Ordinary least squares (OLS) overfits badly when the number of features approaches the number of observations — a common situation in financial ML. Regularization constrains the model:

**Ridge Regression (L2):** Shrinks coefficients toward zero but never to exactly zero:
\`\`\`
minimize: sum(y - X*beta)^2 + alpha * sum(beta^2)
\`\`\`

**Lasso Regression (L1):** Can shrink coefficients to exactly zero, performing feature selection:
\`\`\`
minimize: sum(y - X*beta)^2 + alpha * sum(|beta|)
\`\`\`

**Elastic Net:** Combines L1 and L2, offering both sparsity and grouping:

\`\`\`python
import numpy as np
from sklearn.linear_model import Ridge, Lasso, ElasticNet
from sklearn.preprocessing import StandardScaler

np.random.seed(42)

# Simulate financial features and returns
n_train, n_test = 756, 252  # 3 years train, 1 year test
n_features = 20

# Features: technical indicators + noise
X = np.random.normal(0, 1, (n_train + n_test, n_features))
# Only first 3 features have signal
true_betas = np.zeros(n_features)
true_betas[:3] = [0.002, -0.001, 0.0015]
y = X @ true_betas + np.random.normal(0, 0.01, n_train + n_test)

# Time-aware split (NO random shuffling)
X_train, X_test = X[:n_train], X[n_train:]
y_train, y_test = y[:n_train], y[n_train:]

# Scale features
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

# Compare models
models = {
    'Ridge': Ridge(alpha=1.0),
    'Lasso': Lasso(alpha=0.001),
    'ElasticNet': ElasticNet(alpha=0.001, l1_ratio=0.5),
}

for name, model in models.items():
    model.fit(X_train_s, y_train)
    train_pred = model.predict(X_train_s)
    test_pred = model.predict(X_test_s)

    train_corr = np.corrcoef(train_pred, y_train)[0, 1]
    test_corr = np.corrcoef(test_pred, y_test)[0, 1]

    # Simulated strategy: go long when prediction > 0
    positions = np.sign(test_pred)
    strategy_returns = positions * y_test
    sharpe = np.mean(strategy_returns) / np.std(strategy_returns) * np.sqrt(252)

    n_nonzero = np.sum(np.abs(model.coef_) > 1e-6)
    print(f"{name:12s}: train_corr={train_corr:.4f}, "
          f"test_corr={test_corr:.4f}, sharpe={sharpe:.2f}, "
          f"non-zero={n_nonzero}")
\`\`\`

### Walk-Forward Cross-Validation

Standard k-fold CV is invalid for time series. Walk-forward CV respects temporal order:

\`\`\`python
def walk_forward_cv(X, y, train_size, test_size, step_size):
    """Generator for walk-forward train/test splits."""
    n = len(X)
    splits = []
    start = 0
    while start + train_size + test_size <= n:
        train_end = start + train_size
        test_end = train_end + test_size
        splits.append((
            (start, train_end),
            (train_end, test_end)
        ))
        start += step_size
    return splits

# Example: 3-year rolling train, 3-month test, step 1 month
splits = walk_forward_cv(X, y, train_size=756, test_size=63, step_size=21)
print(f"Number of walk-forward folds: {len(splits)}")
\`\`\`

### Interpreting Regression Coefficients

In financial regression, coefficients have direct economic meaning:

- A coefficient of 0.002 on the 20-day momentum feature means: a 1-standard-deviation increase in momentum predicts a 0.2% increase in forward returns
- The sign tells you the direction (positive momentum predicts positive returns = momentum effect)
- The magnitude tells you the economic significance

However, be cautious: statistical significance (low p-value) does not imply economic significance (profitable after costs), and vice versa.

### Key Takeaway

Regression for return prediction works best with regularization, proper walk-forward validation, and a clear understanding that financial signals are weak. A model that achieves 2-5% correlation between predicted and actual returns is considered very good — this is a domain where small edges compound into meaningful profits when applied systematically.`,
      starterCode: `import numpy as np
from sklearn.linear_model import Ridge, Lasso
from sklearn.preprocessing import StandardScaler

np.random.seed(42)

# TODO: Simulate 1008 observations of 20 features
# with only 3 features having real signal

# TODO: Split into train (756) and test (252) - temporal split

# TODO: Fit Ridge and Lasso, compare train/test correlations

# TODO: Compute Sharpe ratio of a long/short strategy
# based on model predictions
`,
      solutionCode: `import numpy as np
from sklearn.linear_model import Ridge, Lasso
from sklearn.preprocessing import StandardScaler

np.random.seed(42)

n_train, n_test, n_features = 756, 252, 20
X = np.random.normal(0, 1, (n_train + n_test, n_features))
true_betas = np.zeros(n_features)
true_betas[:3] = [0.002, -0.001, 0.0015]
y = X @ true_betas + np.random.normal(0, 0.01, n_train + n_test)

X_train, X_test = X[:n_train], X[n_train:]
y_train, y_test = y[:n_train], y[n_train:]

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

for name, model in [('Ridge', Ridge(alpha=1.0)), ('Lasso', Lasso(alpha=0.001))]:
    model.fit(X_train_s, y_train)
    train_corr = np.corrcoef(model.predict(X_train_s), y_train)[0, 1]
    test_pred = model.predict(X_test_s)
    test_corr = np.corrcoef(test_pred, y_test)[0, 1]
    positions = np.sign(test_pred)
    strat_ret = positions * y_test
    sharpe = np.mean(strat_ret) / np.std(strat_ret) * np.sqrt(252)
    print(f"{name}: train_corr={train_corr:.4f}, test_corr={test_corr:.4f}, sharpe={sharpe:.2f}")
`,
    },
    {
      id: "fml-classification-signals",
      slug: "classification-trading-signals",
      title: "Classification for Trading Signals",
      content: `## Classification for Trading Signals

While regression predicts the magnitude of returns, classification predicts their direction or category. In trading, classification models generate discrete signals: buy, sell, or hold. This framing can be more practical than regression because many trading strategies ultimately reduce to binary decisions.

### Framing the Classification Problem

The most common classification frameworks for trading:

**Binary classification:**
- Label +1 if the forward return exceeds a threshold (e.g., > 0.5%)
- Label -1 if the forward return is below a negative threshold (e.g., < -0.5%)
- Optionally label 0 for returns within the band (becomes multi-class)

**The Triple Barrier Method** (Lopez de Prado):
A more sophisticated labeling approach that considers three outcomes:
1. **Upper barrier** — Price hits take-profit level first (label = +1)
2. **Lower barrier** — Price hits stop-loss level first (label = -1)
3. **Time barrier** — Neither barrier is hit within a maximum holding period (label = 0 or based on return sign)

\`\`\`python
import numpy as np

def triple_barrier_labels(prices, upper=0.02, lower=-0.02, max_holding=10):
    """
    Label each observation using the triple barrier method.
    """
    n = len(prices)
    labels = np.zeros(n)

    for i in range(n - max_holding):
        entry_price = prices[i]

        for j in range(1, max_holding + 1):
            if i + j >= n:
                break
            ret = (prices[i + j] - entry_price) / entry_price

            if ret >= upper:
                labels[i] = 1   # hit take-profit
                break
            elif ret <= lower:
                labels[i] = -1  # hit stop-loss
                break
        else:
            # Time barrier: label based on final return
            final_ret = (prices[i + max_holding] - entry_price) / entry_price
            labels[i] = np.sign(final_ret)

    return labels

np.random.seed(42)
returns = np.random.normal(0.0003, 0.015, 500)
prices = 100 * np.exp(np.cumsum(returns))

labels = triple_barrier_labels(prices)
print(f"Label distribution:")
print(f"  +1 (take-profit): {np.sum(labels == 1)}")
print(f"   0 (neutral):     {np.sum(labels == 0)}")
print(f"  -1 (stop-loss):   {np.sum(labels == -1)}")
\`\`\`

### Choosing the Right Classifier

| Model | Strengths | Weaknesses | Financial Use |
|-------|-----------|-----------|---------------|
| **Logistic Regression** | Interpretable, fast, regularizable | Linear decision boundary | Baseline model |
| **Random Forest** | Handles nonlinearity, robust to outliers | Can overfit with many features | Feature importance, signal generation |
| **Gradient Boosting** | State-of-the-art accuracy, handles mixed features | Prone to overfitting, slow to train | Main prediction model |
| **SVM** | Good with high-dimensional data | Hard to interpret, slow on large datasets | Niche applications |
| **Neural Networks** | Captures complex patterns | Requires large data, hard to interpret | Alternative data processing |

### Class Imbalance

Financial labels are often imbalanced — most days are "neutral" rather than strong buy or sell signals. Techniques to handle imbalance:

- **SMOTE** — Synthetic oversampling of minority class (use with caution in time series)
- **Class weights** — Weight minority class higher in the loss function
- **Threshold adjustment** — Adjust the prediction threshold to optimize for the desired metric
- **Meta-labeling** — First predict direction (primary model), then predict whether to act on the signal (secondary model)

### Meta-Labeling

Lopez de Prado's meta-labeling approach splits the classification into two stages:

1. **Primary model** — A simple model (or rule-based system) that generates directional bets (+1 or -1)
2. **Meta-model** — An ML model that decides whether the primary model's bet is worth taking (1 = trade, 0 = skip)

This approach improves precision (fewer bad trades) even if it reduces recall (misses some good trades).

### Evaluation Metrics for Classification

Standard accuracy is misleading in finance. Use instead:

- **Precision** — Of the trades the model recommends, what fraction is profitable?
- **Recall** — Of the profitable opportunities, what fraction does the model capture?
- **F1 score** — Harmonic mean of precision and recall
- **Log loss** — Measures calibration of probability estimates
- **Profit/loss** — The ultimate metric; convert predictions to positions and compute financial metrics

### Key Takeaway

Classification for trading signals requires careful label design (triple barrier method), appropriate handling of class imbalance, and evaluation metrics that connect prediction quality to financial outcomes. The meta-labeling approach is particularly powerful because it separates the directional prediction from the trade sizing decision.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Generate 500 days of simulated prices

# TODO: Implement the triple barrier labeling method
# with upper=0.02, lower=-0.02, max_holding=10

# TODO: Print the label distribution

# TODO: Create features and train a simple classifier
# Evaluate using walk-forward validation
`,
      solutionCode: `import numpy as np

def triple_barrier_labels(prices, upper=0.02, lower=-0.02, max_holding=10):
    n = len(prices)
    labels = np.zeros(n)
    for i in range(n - max_holding):
        entry_price = prices[i]
        for j in range(1, max_holding + 1):
            if i + j >= n:
                break
            ret = (prices[i + j] - entry_price) / entry_price
            if ret >= upper:
                labels[i] = 1
                break
            elif ret <= lower:
                labels[i] = -1
                break
        else:
            final_ret = (prices[i + max_holding] - entry_price) / entry_price
            labels[i] = np.sign(final_ret)
    return labels

np.random.seed(42)
returns = np.random.normal(0.0003, 0.015, 500)
prices = 100 * np.exp(np.cumsum(returns))

labels = triple_barrier_labels(prices)
print(f"+1 (take-profit): {np.sum(labels == 1)}")
print(f" 0 (neutral):     {np.sum(labels == 0)}")
print(f"-1 (stop-loss):   {np.sum(labels == -1)}")
`,
    },
    {
      id: "fml-random-forests",
      slug: "random-forests-finance",
      title: "Random Forests for Finance",
      content: `## Random Forests for Finance

Random forests are one of the most useful ML models for financial applications. They handle non-linear relationships, are robust to outliers, provide built-in feature importance measures, and are less prone to overfitting than single decision trees. This lesson covers how to use random forests for financial prediction with proper validation.

### Why Random Forests for Finance?

Random forests offer several advantages in financial contexts:

- **Non-linearity** — Financial relationships are rarely linear; the impact of momentum on returns may reverse at extremes
- **Robustness** — Ensemble of many trees averages out individual tree errors
- **Feature importance** — Built-in measures help identify which features drive predictions
- **Handles mixed features** — Works with continuous and categorical features without normalization
- **Parallel training** — Trees are independent, enabling efficient training on large datasets
- **Out-of-bag estimation** — Provides a built-in validation estimate without a separate test set

### Building a Random Forest Trading Model

\`\`\`python
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

np.random.seed(42)

# Generate features with non-linear financial signals
n = 1500
momentum = np.random.normal(0, 1, n)
volatility = np.abs(np.random.normal(0, 1, n))
volume_ratio = np.random.lognormal(0, 0.5, n)
mean_reversion = np.random.normal(0, 1, n)
sector_momentum = np.random.normal(0, 1, n)

# Non-linear target: momentum works when volatility is low,
# mean reversion works when volatility is high
signal = np.where(
    volatility < 1.0,
    0.3 * momentum - 0.1 * mean_reversion,
    -0.1 * momentum + 0.3 * mean_reversion
)
noise = np.random.normal(0, 0.5, n)
y = (signal + noise > 0).astype(int)

X = np.column_stack([momentum, volatility, volume_ratio,
                     mean_reversion, sector_momentum])
feature_names = ['momentum', 'volatility', 'volume_ratio',
                 'mean_reversion', 'sector_momentum']

# Walk-forward split
train_end = 1000
X_train, y_train = X[:train_end], y[:train_end]
X_test, y_test = X[train_end:], y[train_end:]

# Train random forest
rf = RandomForestClassifier(
    n_estimators=500,
    max_depth=5,
    min_samples_leaf=50,
    max_features='sqrt',
    random_state=42,
    n_jobs=-1
)
rf.fit(X_train, y_train)

# Evaluate
train_acc = rf.score(X_train, y_train)
test_acc = rf.score(X_test, y_test)
print(f"Train accuracy: {train_acc:.4f}")
print(f"Test accuracy:  {test_acc:.4f}")

# Feature importance
importances = rf.feature_importances_
sorted_idx = np.argsort(importances)[::-1]
print("\\nFeature Importance:")
for idx in sorted_idx:
    print(f"  {feature_names[idx]:20s}: {importances[idx]:.4f}")
\`\`\`

### Hyperparameter Tuning for Finance

Key parameters to tune for financial applications:

| Parameter | Impact | Recommended Range |
|-----------|--------|------------------|
| **n_estimators** | More trees = less variance | 200-1000 (more is generally better) |
| **max_depth** | Controls tree complexity | 3-8 (shallow trees prevent overfitting) |
| **min_samples_leaf** | Minimum samples per leaf | 50-200 (larger = more regularization) |
| **max_features** | Features per split | sqrt(n_features) or 0.3 * n_features |
| **class_weight** | Handle imbalanced labels | 'balanced' or custom weights |

**The critical insight:** In finance, you should err heavily toward regularization (shallower trees, larger min_samples_leaf) because the signal-to-noise ratio is so low. A model that appears to perform well with deep trees is almost certainly overfitting to noise.

### Feature Importance Methods

Random forests offer multiple ways to measure feature importance:

**1. Mean Decrease in Impurity (MDI)** — The default method in scikit-learn. Measures how much each feature reduces the impurity (Gini or entropy) across all splits. Biased toward high-cardinality features.

**2. Mean Decrease in Accuracy (MDA / Permutation Importance)** — Measures how much accuracy drops when a feature's values are randomly shuffled. More reliable than MDI but computationally expensive.

**3. SHAP Values** — Provides a game-theory-based explanation of each feature's contribution to each prediction. Most informative but computationally intensive.

For financial models, MDA or SHAP values are preferred over MDI because they are less susceptible to bias from correlated features.

### Common Pitfalls

- **Too many trees, too deep** — Random forests can memorize training data with deep trees; constrain depth and leaf size
- **Correlated features** — Random forests split importance among correlated features, making each look less important than it is
- **Non-stationary features** — Features that change meaning over time (e.g., absolute price levels) will degrade model performance
- **Leaking future information** — Ensure no feature uses future data in its computation

### Key Takeaway

Random forests are a workhorse model for financial ML because they capture non-linear relationships, provide interpretable feature importance, and are relatively robust to overfitting when properly regularized. The keys to success are shallow trees, large leaf sizes, and proper walk-forward validation — all designed to prevent the model from learning noise in the low-signal financial data.`,
      starterCode: `import numpy as np
from sklearn.ensemble import RandomForestClassifier

np.random.seed(42)

# TODO: Generate features with a non-linear financial signal
# (momentum works when vol is low, mean reversion when vol is high)

# TODO: Train a random forest with walk-forward split

# TODO: Print train/test accuracy and feature importances
`,
      solutionCode: `import numpy as np
from sklearn.ensemble import RandomForestClassifier

np.random.seed(42)
n = 1500
momentum = np.random.normal(0, 1, n)
volatility = np.abs(np.random.normal(0, 1, n))
volume_ratio = np.random.lognormal(0, 0.5, n)
mean_reversion = np.random.normal(0, 1, n)
sector = np.random.normal(0, 1, n)

signal = np.where(volatility < 1.0, 0.3 * momentum, 0.3 * mean_reversion)
y = (signal + np.random.normal(0, 0.5, n) > 0).astype(int)
X = np.column_stack([momentum, volatility, volume_ratio, mean_reversion, sector])
names = ['momentum', 'volatility', 'volume_ratio', 'mean_reversion', 'sector']

X_train, y_train = X[:1000], y[:1000]
X_test, y_test = X[1000:], y[1000:]

rf = RandomForestClassifier(n_estimators=500, max_depth=5,
                            min_samples_leaf=50, random_state=42)
rf.fit(X_train, y_train)
print(f"Train accuracy: {rf.score(X_train, y_train):.4f}")
print(f"Test accuracy:  {rf.score(X_test, y_test):.4f}")
for idx in np.argsort(rf.feature_importances_)[::-1]:
    print(f"  {names[idx]:20s}: {rf.feature_importances_[idx]:.4f}")
`,
    },
    {
      id: "fml-xgboost",
      slug: "xgboost-lightgbm-finance",
      title: "XGBoost and LightGBM for Finance",
      content: `## XGBoost and LightGBM for Finance

Gradient boosting machines — particularly XGBoost and LightGBM — have become the dominant ML models for structured financial data. They consistently outperform random forests and neural networks on tabular financial datasets and are used extensively by hedge funds, banks, and FinTech companies for credit scoring, fraud detection, and alpha generation.

### Gradient Boosting vs. Random Forests

While random forests build many independent trees and average their predictions, gradient boosting builds trees **sequentially**, with each new tree correcting the errors of the previous ones:

| Feature | Random Forest | Gradient Boosting |
|---------|--------------|-------------------|
| **Construction** | Independent trees (bagging) | Sequential trees (boosting) |
| **Bias-variance** | Low variance, higher bias | Lower bias, can have higher variance |
| **Overfitting risk** | Lower | Higher (mitigated by regularization) |
| **Training speed** | Fast (parallelizable) | Slower (sequential) |
| **Performance ceiling** | Good | Often better for structured data |

### XGBoost and LightGBM

**XGBoost** (Extreme Gradient Boosting) introduced regularization, column subsampling, and efficient handling of missing values. It dominated Kaggle competitions from 2015 to 2018.

**LightGBM** (Light Gradient Boosting Machine) by Microsoft improved on XGBoost with:
- **Histogram-based splitting** — Much faster training on large datasets
- **Leaf-wise growth** — Grows the leaf with the largest loss reduction (vs. XGBoost's level-wise growth)
- **Native categorical feature support** — No need for one-hot encoding
- **GPU support** — Efficient GPU training for large datasets

### Financial ML with LightGBM

\`\`\`python
import numpy as np

np.random.seed(42)

# Simulate a realistic financial prediction problem
n = 2000
n_features = 30

# Features: mix of informative and noise
X = np.random.normal(0, 1, (n, n_features))

# Non-linear target with interactions
signal = (0.3 * X[:, 0] * (X[:, 1] > 0)
          - 0.2 * X[:, 2] ** 2
          + 0.15 * np.maximum(X[:, 3], 0)
          + 0.1 * X[:, 4] * X[:, 5])
noise = np.random.normal(0, 0.8, n)
y = signal + noise

# Walk-forward evaluation
train_end = 1500
X_train, y_train = X[:train_end], y[:train_end]
X_test, y_test = X[train_end:], y[train_end:]

# Simple gradient boosting (manual implementation concept)
# In practice, you would use:
# import lightgbm as lgb
# model = lgb.LGBMRegressor(
#     n_estimators=200, max_depth=4, learning_rate=0.05,
#     subsample=0.8, colsample_bytree=0.8,
#     min_child_samples=100, reg_alpha=0.1, reg_lambda=1.0
# )

# For this example, we'll use sklearn's GradientBoosting
from sklearn.ensemble import GradientBoostingRegressor

model = GradientBoostingRegressor(
    n_estimators=200,
    max_depth=4,
    learning_rate=0.05,
    subsample=0.8,
    min_samples_leaf=100,
    random_state=42
)
model.fit(X_train, y_train)

train_pred = model.predict(X_train)
test_pred = model.predict(X_test)

train_corr = np.corrcoef(train_pred, y_train)[0, 1]
test_corr = np.corrcoef(test_pred, y_test)[0, 1]

# Strategy evaluation
positions = np.sign(test_pred)
strategy_returns = positions * y_test / np.std(y_test)
sharpe = np.mean(strategy_returns) / np.std(strategy_returns) * np.sqrt(252)

print(f"Train correlation: {train_corr:.4f}")
print(f"Test correlation:  {test_corr:.4f}")
print(f"Strategy Sharpe:   {sharpe:.2f}")

# Feature importance
importances = model.feature_importances_
top_5 = np.argsort(importances)[-5:][::-1]
print("\\nTop 5 features:")
for idx in top_5:
    print(f"  Feature {idx}: {importances[idx]:.4f}")
\`\`\`

### Hyperparameter Tuning Strategy

For financial applications, these are the most important parameters:

**Regularization parameters (prevent overfitting):**
- \`max_depth\`: 3-6 (shallow trees for noisy financial data)
- \`min_child_samples\` / \`min_samples_leaf\`: 50-200
- \`reg_alpha\` (L1) and \`reg_lambda\` (L2): 0.1-10.0
- \`colsample_bytree\`: 0.5-0.8

**Learning parameters:**
- \`learning_rate\`: 0.01-0.1 (lower is more robust but needs more trees)
- \`n_estimators\`: 100-1000 (use early stopping to find optimal)
- \`subsample\`: 0.7-0.9

**The golden rule for financial ML:** When in doubt, add more regularization. The signal-to-noise ratio in finance is so low that underfitting is far less dangerous than overfitting.

### Early Stopping

Early stopping monitors performance on a validation set and stops training when it starts to deteriorate:

- Split training data further into training and validation (respecting temporal order)
- Train the model and evaluate on validation after each boosting round
- Stop when validation performance has not improved for N rounds (patience)
- This automatically selects the optimal number of trees

### Handling Financial Data Quirks

**Missing values:** Both XGBoost and LightGBM handle missing values natively by learning the best direction to send missing values at each split. This is valuable in finance where data gaps are common.

**Monotone constraints:** You can enforce economic intuition — for example, requiring that higher credit scores always decrease default probability. Both frameworks support monotone constraints.

**Custom objectives:** You can define custom loss functions that align with financial objectives (e.g., penalizing false positives more than false negatives in fraud detection).

### Key Takeaway

XGBoost and LightGBM are the go-to models for structured financial data. Their ability to capture non-linear interactions, handle missing values, and provide built-in regularization makes them ideal for the noisy, non-stationary world of financial prediction. The key to success is aggressive regularization and rigorous walk-forward validation.`,
      starterCode: `import numpy as np
from sklearn.ensemble import GradientBoostingRegressor

np.random.seed(42)

# TODO: Generate 2000 samples with 30 features
# Include non-linear interactions in the target

# TODO: Walk-forward split (1500 train, 500 test)

# TODO: Train a gradient boosting model with conservative
# hyperparameters (max_depth=4, min_samples_leaf=100)

# TODO: Print train/test correlations and strategy Sharpe
`,
      solutionCode: `import numpy as np
from sklearn.ensemble import GradientBoostingRegressor

np.random.seed(42)
n, n_features = 2000, 30
X = np.random.normal(0, 1, (n, n_features))
signal = (0.3 * X[:, 0] * (X[:, 1] > 0)
          - 0.2 * X[:, 2] ** 2
          + 0.15 * np.maximum(X[:, 3], 0))
y = signal + np.random.normal(0, 0.8, n)

X_train, y_train = X[:1500], y[:1500]
X_test, y_test = X[1500:], y[1500:]

model = GradientBoostingRegressor(
    n_estimators=200, max_depth=4, learning_rate=0.05,
    subsample=0.8, min_samples_leaf=100, random_state=42
)
model.fit(X_train, y_train)

train_corr = np.corrcoef(model.predict(X_train), y_train)[0, 1]
test_corr = np.corrcoef(model.predict(X_test), y_test)[0, 1]
positions = np.sign(model.predict(X_test))
strat_ret = positions * y_test / np.std(y_test)
sharpe = np.mean(strat_ret) / np.std(strat_ret) * np.sqrt(252)

print(f"Train correlation: {train_corr:.4f}")
print(f"Test correlation:  {test_corr:.4f}")
print(f"Strategy Sharpe:   {sharpe:.2f}")
`,
    },
    {
      id: "fml-walk-forward-cv",
      slug: "walk-forward-cross-validation",
      title: "Walk-Forward Cross-Validation",
      content: `## Walk-Forward Cross-Validation

Walk-forward cross-validation is the correct way to validate time series models. Standard k-fold cross-validation randomly shuffles data, allowing future information to leak into training sets. In finance, this produces wildly optimistic performance estimates. Walk-forward CV respects the temporal ordering of data, providing realistic estimates of out-of-sample performance.

### Why Standard CV Fails for Finance

Consider a model trained on data from 2015-2020 and tested on 2021:
- Standard 5-fold CV might train on {2016, 2018, 2019, 2021} and test on {2015, 2017, 2020} — the model has seen the future
- The model can learn patterns specific to 2021 and "predict" 2020 using that knowledge
- This produces inflated performance metrics that do not reflect real trading conditions

### The Walk-Forward Framework

Walk-forward validation simulates how a model would actually be used in production:

\`\`\`python
import numpy as np
from sklearn.linear_model import Ridge

def walk_forward_validation(X, y, initial_train, test_size,
                            step_size, purge_window=0):
    """
    Walk-forward cross-validation with purging.

    Parameters:
    -----------
    X: feature matrix (n_samples x n_features)
    y: target vector
    initial_train: size of initial training window
    test_size: size of each test window
    step_size: how far to roll forward each iteration
    purge_window: number of samples to remove between
                  train and test to prevent label leakage
    """
    n = len(X)
    results = []

    train_start = 0
    train_end = initial_train

    while train_end + purge_window + test_size <= n:
        test_start = train_end + purge_window
        test_end = test_start + test_size

        X_train = X[train_start:train_end]
        y_train = y[train_start:train_end]
        X_test = X[test_start:test_end]
        y_test = y[test_start:test_end]

        # Train model
        model = Ridge(alpha=1.0)
        model.fit(X_train, y_train)

        # Predict and evaluate
        predictions = model.predict(X_test)
        correlation = np.corrcoef(predictions, y_test)[0, 1]

        # Strategy returns
        positions = np.sign(predictions)
        strategy_returns = positions * y_test

        results.append({
            'train_period': (train_start, train_end),
            'test_period': (test_start, test_end),
            'correlation': correlation,
            'mean_return': np.mean(strategy_returns),
            'std_return': np.std(strategy_returns),
        })

        # Roll forward
        train_end += step_size

    return results

# Generate synthetic financial data
np.random.seed(42)
n = 2520  # 10 years of daily data
n_features = 10

X = np.random.normal(0, 1, (n, n_features))
true_betas = np.zeros(n_features)
true_betas[:3] = [0.002, -0.001, 0.0015]
y = X @ true_betas + np.random.normal(0, 0.01, n)

# Walk-forward: 2-year train, 3-month test, 1-month step
results = walk_forward_validation(
    X, y,
    initial_train=504,   # 2 years
    test_size=63,         # 3 months
    step_size=21,         # 1 month
    purge_window=5        # 5-day purge
)

# Aggregate results
correlations = [r['correlation'] for r in results]
mean_returns = [r['mean_return'] for r in results]

print(f"Number of folds: {len(results)}")
print(f"Average correlation: {np.mean(correlations):.4f}")
print(f"Std of correlation:  {np.std(correlations):.4f}")
print(f"Average daily return: {np.mean(mean_returns):.6f}")

# Annualized Sharpe from walk-forward
all_returns = np.concatenate([
    np.sign(Ridge(alpha=1.0).fit(
        X[r['train_period'][0]:r['train_period'][1]],
        y[r['train_period'][0]:r['train_period'][1]]
    ).predict(X[r['test_period'][0]:r['test_period'][1]]))
    * y[r['test_period'][0]:r['test_period'][1]]
    for r in results
])
wf_sharpe = np.mean(all_returns) / np.std(all_returns) * np.sqrt(252)
print(f"Walk-forward Sharpe: {wf_sharpe:.4f}")
\`\`\`

### Expanding vs. Rolling Windows

**Expanding window:** Training set grows with each step (always starts from time 0). Uses all available history.

**Rolling window:** Training set has a fixed size that slides forward. Discards oldest data each step.

| Approach | Pros | Cons |
|----------|------|------|
| Expanding | More training data, stable estimates | Stale data may hurt if regimes change |
| Rolling | Adapts to regime changes | Less data, higher variance |

For most financial applications, a rolling window of 2-5 years works well, with the exact choice depending on how quickly market dynamics change.

### Purging and Embargo

**Purging:** Remove training samples whose labels overlap with the test period. If your label is based on 5-day forward returns, any training sample within 5 days of the test boundary could leak information.

**Embargo:** Add an additional gap between training and test sets to be conservative. Even after purging, there may be residual serial correlation that biases results.

### Combinatorial Purged Cross-Validation (CPCV)

Lopez de Prado introduced CPCV as an improvement over simple walk-forward:
- Creates many train/test splits from non-overlapping groups
- Each split respects temporal order within groups
- Provides more out-of-sample paths, giving a distribution of performance outcomes
- Reduces the variance of performance estimates

### What Good Walk-Forward Results Look Like

| Metric | Good Sign | Bad Sign |
|--------|-----------|----------|
| **Correlation stability** | Consistent across folds | Highly variable, some folds negative |
| **Sharpe ratio** | 0.5-2.0 (after costs) | > 3.0 (likely overfit) or < 0 |
| **Drawdown** | Moderate, recovers | Catastrophic in some folds |
| **Turn-of-year pattern** | None | Performance concentrated in January |

### Key Takeaway

Walk-forward cross-validation with purging and embargo is the minimum standard for validating financial ML models. Any result that has not survived walk-forward testing should be treated with deep skepticism. The procedure is more computationally expensive than standard CV but dramatically reduces the risk of deploying a model that fails in production.`,
      starterCode: `import numpy as np
from sklearn.linear_model import Ridge

np.random.seed(42)

# TODO: Implement walk-forward validation with purging
# Parameters: initial_train=504, test_size=63,
# step_size=21, purge_window=5

# TODO: Generate 2520 days of synthetic data (10 years)
# with 10 features, 3 having weak signal

# TODO: Run walk-forward validation and print:
# - Number of folds
# - Average correlation
# - Walk-forward Sharpe ratio
`,
      solutionCode: `import numpy as np
from sklearn.linear_model import Ridge

def walk_forward_validation(X, y, initial_train, test_size, step_size, purge_window=0):
    n = len(X)
    results = []
    train_end = initial_train
    while train_end + purge_window + test_size <= n:
        test_start = train_end + purge_window
        test_end = test_start + test_size
        model = Ridge(alpha=1.0)
        model.fit(X[:train_end], y[:train_end])
        preds = model.predict(X[test_start:test_end])
        corr = np.corrcoef(preds, y[test_start:test_end])[0, 1]
        strat_ret = np.sign(preds) * y[test_start:test_end]
        results.append({'corr': corr, 'returns': strat_ret})
        train_end += step_size
    return results

np.random.seed(42)
n, n_f = 2520, 10
X = np.random.normal(0, 1, (n, n_f))
betas = np.zeros(n_f)
betas[:3] = [0.002, -0.001, 0.0015]
y = X @ betas + np.random.normal(0, 0.01, n)

results = walk_forward_validation(X, y, 504, 63, 21, 5)
corrs = [r['corr'] for r in results]
all_ret = np.concatenate([r['returns'] for r in results])
sharpe = np.mean(all_ret) / np.std(all_ret) * np.sqrt(252)

print(f"Folds: {len(results)}")
print(f"Avg correlation: {np.mean(corrs):.4f}")
print(f"Walk-forward Sharpe: {sharpe:.4f}")
`,
    },
  ],
};
