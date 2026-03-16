import { Module } from "../types";

export const productionModule: Module = {
  id: "fml-production",
  title: "Production ML for Trading",
  description:
    "Deploy financial ML systems to production — building ML pipelines, feature stores, model monitoring, integrating risk management with ML, and navigating regulatory considerations.",
  lessons: [
    {
      id: "fml-ml-pipeline",
      slug: "ml-pipeline-trading",
      title: "ML Pipeline for Trading",
      content: `## ML Pipeline for Trading

Moving a financial ML model from research notebook to production trading system is one of the most challenging engineering tasks in quantitative finance. The gap between a profitable backtest and a profitable live system is where most quant strategies fail. This lesson covers the end-to-end ML pipeline required for production trading.

### The Research-to-Production Gap

| Research | Production |
|----------|-----------|
| Static historical data | Real-time streaming data |
| Single backtest run | 24/7 continuous operation |
| Perfect data quality | Missing data, late arrivals, errors |
| No latency constraints | Millisecond to second latency requirements |
| No infrastructure costs | Significant compute and data costs |
| Manually monitored | Automated monitoring and alerting |

### Pipeline Architecture

\`\`\`python
import numpy as np
from datetime import datetime

class TradingMLPipeline:
    """
    Production ML pipeline for trading.
    Handles data ingestion, feature computation, prediction,
    and signal generation.
    """
    def __init__(self, model_weights, feature_config, risk_limits):
        self.model_weights = model_weights
        self.feature_config = feature_config
        self.risk_limits = risk_limits
        self.prediction_log = []

    def ingest_data(self, market_data):
        """
        Step 1: Validate and clean incoming market data.
        """
        validated = {}
        for ticker, data in market_data.items():
            if data.get('price') is None or data['price'] <= 0:
                validated[ticker] = None  # flag as bad data
                continue
            if data.get('volume', 0) <= 0:
                data['volume'] = 0  # handle missing volume
            validated[ticker] = data
        return validated

    def compute_features(self, validated_data, historical_data):
        """
        Step 2: Compute features from validated data.
        """
        features = {}
        for ticker, current in validated_data.items():
            if current is None:
                continue
            hist = historical_data.get(ticker, {})
            prices = hist.get('prices', [])
            if len(prices) < 20:
                continue

            f = {}
            f['return_1d'] = (current['price'] - prices[-1]) / prices[-1]
            f['return_5d'] = (current['price'] - prices[-5]) / prices[-5]
            f['volatility'] = np.std(np.diff(prices[-20:]) / prices[-20:-1]) * np.sqrt(252)
            f['volume_ratio'] = current.get('volume', 0) / max(np.mean(hist.get('volumes', [1])[-20:]), 1)

            features[ticker] = np.array(list(f.values()))
        return features

    def predict(self, features):
        """
        Step 3: Generate predictions from features.
        """
        predictions = {}
        for ticker, feat_vector in features.items():
            # Simple linear model (in production, use trained model)
            score = feat_vector @ self.model_weights[:len(feat_vector)]
            predictions[ticker] = {
                'score': score,
                'timestamp': datetime.now().isoformat(),
            }
        return predictions

    def apply_risk_limits(self, predictions, current_portfolio):
        """
        Step 4: Apply risk management constraints.
        """
        signals = {}
        for ticker, pred in predictions.items():
            signal = pred['score']

            # Position size limit
            max_position = self.risk_limits.get('max_position_pct', 0.10)

            # Sector concentration limit
            # (simplified - in production, check sector exposure)

            # Maximum number of simultaneous positions
            max_positions = self.risk_limits.get('max_positions', 20)
            if len(signals) >= max_positions and signal > 0:
                continue

            signals[ticker] = {
                'direction': 'long' if signal > 0 else 'short' if signal < 0 else 'flat',
                'strength': min(abs(signal), max_position),
                'raw_score': signal,
            }
        return signals

    def run(self, market_data, historical_data, current_portfolio):
        """Execute the complete pipeline."""
        validated = self.ingest_data(market_data)
        features = self.compute_features(validated, historical_data)
        predictions = self.predict(features)
        signals = self.apply_risk_limits(predictions, current_portfolio)
        self.prediction_log.append({
            'timestamp': datetime.now().isoformat(),
            'n_predictions': len(predictions),
            'n_signals': len(signals),
        })
        return signals

# Example usage
np.random.seed(42)

pipeline = TradingMLPipeline(
    model_weights=np.array([0.3, -0.1, 0.2, 0.15]),
    feature_config={'lookback': 20},
    risk_limits={'max_position_pct': 0.10, 'max_positions': 20}
)

# Simulate market data
market_data = {
    'AAPL': {'price': 185.50, 'volume': 55000000},
    'GOOGL': {'price': 141.20, 'volume': 22000000},
    'MSFT': {'price': 378.90, 'volume': 28000000},
}

historical_data = {
    ticker: {
        'prices': list(100 + np.cumsum(np.random.normal(0.1, 1, 30))),
        'volumes': list(np.random.lognormal(16, 0.5, 30))
    }
    for ticker in market_data
}

signals = pipeline.run(market_data, historical_data, {})
print("Trading Signals:")
for ticker, signal in signals.items():
    print(f"  {ticker}: {signal['direction']:5s} "
          f"strength={signal['strength']:.4f} "
          f"score={signal['raw_score']:.4f}")
\`\`\`

### Data Pipeline Requirements

| Requirement | Description | Tools |
|-------------|-------------|-------|
| **Real-time ingestion** | Process market data with sub-second latency | Kafka, Redis Streams |
| **Data validation** | Detect and handle missing, stale, or erroneous data | Custom validators, Great Expectations |
| **Feature computation** | Calculate features in real-time as data arrives | Flink, custom Python services |
| **Model serving** | Low-latency model inference | TorchServe, TFServing, custom |
| **Signal generation** | Convert predictions to trading signals | Custom risk-aware logic |
| **Order management** | Route signals to execution system | FIX protocol, broker APIs |
| **Logging** | Record every decision for audit and debugging | Time-series databases, S3 |

### Deployment Patterns

**Batch prediction:** Compute signals once daily (e.g., after market close) for next-day trading. Simpler infrastructure, suitable for daily rebalancing strategies.

**Real-time prediction:** Compute signals continuously as data arrives. Required for intraday strategies. Much more complex infrastructure.

**Hybrid:** Batch computation of slow-changing features (fundamentals, monthly macro) combined with real-time computation of fast features (intraday momentum, order flow).

### Key Takeaway

Production ML for trading requires robust data pipelines, real-time feature computation, low-latency model serving, and rigorous risk management integration. The engineering challenges are as significant as the modeling challenges, and the gap between research and production is where most quant strategies fail.`,
      starterCode: `import numpy as np
from datetime import datetime

# TODO: Implement a TradingMLPipeline with:
# - Data validation
# - Feature computation
# - Prediction
# - Risk limit application

# TODO: Run the pipeline on simulated market data and print signals
`,
      solutionCode: `import numpy as np
from datetime import datetime

class TradingMLPipeline:
    def __init__(self, weights, risk_limits):
        self.weights = weights
        self.limits = risk_limits

    def compute_features(self, price, hist_prices):
        if len(hist_prices) < 20:
            return None
        return np.array([
            (price - hist_prices[-1]) / hist_prices[-1],
            (price - hist_prices[-5]) / hist_prices[-5],
            np.std(np.diff(hist_prices[-20:]) / hist_prices[-20:-1]) * np.sqrt(252),
        ])

    def run(self, market_data, historical):
        signals = {}
        for ticker, data in market_data.items():
            hist = historical.get(ticker, [])
            feat = self.compute_features(data['price'], hist)
            if feat is None:
                continue
            score = feat @ self.weights[:len(feat)]
            signals[ticker] = {
                'direction': 'long' if score > 0 else 'short',
                'strength': min(abs(score), self.limits['max_pct']),
                'score': score
            }
        return signals

np.random.seed(42)
pipe = TradingMLPipeline(np.array([0.3, -0.1, 0.2]), {'max_pct': 0.10})
market = {'AAPL': {'price': 185.5}, 'GOOGL': {'price': 141.2}, 'MSFT': {'price': 378.9}}
hist = {t: list(100 + np.cumsum(np.random.normal(0.1, 1, 30))) for t in market}
for t, s in pipe.run(market, hist).items():
    print(f"{t}: {s['direction']:5s} str={s['strength']:.4f} score={s['score']:.4f}")
`,
    },
    {
      id: "fml-feature-store",
      slug: "feature-store",
      title: "Feature Store for Finance",
      content: `## Feature Store for Financial ML

A feature store is a centralized system for managing, storing, and serving ML features. In financial ML, where feature engineering is the most time-consuming and error-prone step, a well-designed feature store can dramatically improve research velocity, ensure consistency between research and production, and prevent subtle bugs that lead to financial losses.

### Why Feature Stores Matter in Finance

Without a feature store, quant teams face common problems:

- **Training-serving skew** — Features computed differently in research (Python/pandas) vs. production (Java/C++) give different values, causing model degradation
- **Point-in-time correctness** — Using the wrong timestamp for features introduces look-ahead bias
- **Duplicated work** — Multiple researchers compute the same features independently
- **Feature drift** — Feature distributions change over time without anyone noticing
- **Reproducibility** — Cannot reproduce past predictions because feature values were not stored

### Feature Store Architecture

A financial feature store consists of three components:

**1. Offline store** — For batch feature computation and model training. Stores historical feature values with timestamps, enabling point-in-time correct joins for backtesting.

**2. Online store** — For real-time feature serving during live trading. Provides low-latency access to the latest feature values.

**3. Feature registry** — Metadata about each feature: who created it, what it means, how it is computed, what data it depends on, and its update frequency.

### Point-in-Time Correctness

The most critical function of a financial feature store is ensuring **point-in-time correctness**. Every feature value must be tagged with the timestamp at which it became known:

\`\`\`python
import numpy as np

class SimpleFeatureStore:
    """
    Simplified feature store with point-in-time correct retrieval.
    """
    def __init__(self):
        self.features = {}  # {feature_name: [(timestamp, entity_id, value)]}
        self.feature_metadata = {}

    def register_feature(self, name, description, computation_fn, frequency):
        """Register a new feature in the store."""
        self.feature_metadata[name] = {
            'description': description,
            'computation_fn': computation_fn,
            'frequency': frequency,
            'created_at': 'now',
        }
        self.features[name] = []

    def store_feature(self, name, timestamp, entity_id, value):
        """Store a feature value with its timestamp."""
        self.features[name].append((timestamp, entity_id, value))

    def get_feature_at_time(self, name, entity_id, as_of_time):
        """
        Point-in-time retrieval: return the latest feature value
        that was available at as_of_time.
        """
        if name not in self.features:
            return None

        valid_values = [
            (ts, val) for ts, eid, val in self.features[name]
            if eid == entity_id and ts <= as_of_time
        ]

        if not valid_values:
            return None

        # Return most recent value available at as_of_time
        valid_values.sort(key=lambda x: x[0])
        return valid_values[-1][1]

    def get_training_dataset(self, feature_names, entity_ids, timestamps):
        """
        Build a training dataset with point-in-time correct features.
        """
        rows = []
        for ts in timestamps:
            for eid in entity_ids:
                row = {'timestamp': ts, 'entity_id': eid}
                for fname in feature_names:
                    row[fname] = self.get_feature_at_time(fname, eid, ts)
                rows.append(row)
        return rows

# Example usage
store = SimpleFeatureStore()

# Register features
store.register_feature('momentum_20d', '20-day price momentum',
                       lambda: None, 'daily')
store.register_feature('volatility_20d', '20-day realized volatility',
                       lambda: None, 'daily')

# Store some feature values
np.random.seed(42)
for day in range(30):
    for ticker in ['AAPL', 'GOOGL', 'MSFT']:
        store.store_feature('momentum_20d', day, ticker,
                           np.random.normal(0, 0.1))
        store.store_feature('volatility_20d', day, ticker,
                           np.abs(np.random.normal(0.2, 0.05)))

# Point-in-time retrieval
momentum = store.get_feature_at_time('momentum_20d', 'AAPL', as_of_time=15)
print(f"AAPL momentum at day 15: {momentum:.4f}")

# Build training dataset
dataset = store.get_training_dataset(
    feature_names=['momentum_20d', 'volatility_20d'],
    entity_ids=['AAPL'],
    timestamps=[10, 15, 20, 25]
)
print(f"\\nTraining dataset ({len(dataset)} rows):")
for row in dataset:
    mom = row['momentum_20d']
    vol = row['volatility_20d']
    if mom is not None and vol is not None:
        print(f"  Day {row['timestamp']}: momentum={mom:.4f}, vol={vol:.4f}")
\`\`\`

### Industry Feature Stores

| Platform | Type | Financial Use |
|----------|------|-------------|
| **Feast** | Open-source | Flexible, self-hosted, good for custom pipelines |
| **Tecton** | Managed | Production-grade, real-time serving, enterprise features |
| **Databricks** | Platform feature | Integrated with Spark, good for large-scale batch |
| **AWS SageMaker FS** | Cloud-managed | Easy AWS integration, limited real-time capability |
| **Custom** | In-house | Most hedge funds and prop shops build their own |

### Feature Versioning and Lineage

Every feature should have complete lineage:
- **What data** went into computing it (price source, adjustment method)
- **What code** was used to compute it (git hash of the feature computation)
- **When** it was computed and for what time period
- **Version** history (if the computation logic changes, old values are preserved)

This lineage is essential for debugging (why did the model make that trade?) and compliance (regulators may require audit trails of model decisions).

### Key Takeaway

A feature store is essential infrastructure for production financial ML. It ensures point-in-time correctness (preventing look-ahead bias), consistency between research and production (preventing training-serving skew), and provides the foundation for reproducible, auditable model development.`,
      starterCode: `import numpy as np

# TODO: Implement a SimpleFeatureStore with:
# - Feature registration
# - Point-in-time correct storage and retrieval
# - Training dataset generation

# TODO: Store 30 days of features for 3 stocks
# TODO: Demonstrate point-in-time retrieval
`,
      solutionCode: `import numpy as np

class SimpleFeatureStore:
    def __init__(self):
        self.features = {}

    def register(self, name):
        self.features[name] = []

    def store(self, name, timestamp, entity, value):
        self.features[name].append((timestamp, entity, value))

    def get_at_time(self, name, entity, as_of):
        vals = [(ts, v) for ts, e, v in self.features.get(name, [])
                if e == entity and ts <= as_of]
        if not vals:
            return None
        vals.sort()
        return vals[-1][1]

np.random.seed(42)
store = SimpleFeatureStore()
store.register('momentum')
store.register('volatility')

for day in range(30):
    for ticker in ['AAPL', 'GOOGL', 'MSFT']:
        store.store('momentum', day, ticker, np.random.normal(0, 0.1))
        store.store('volatility', day, ticker, abs(np.random.normal(0.2, 0.05)))

for day in [10, 15, 20, 25]:
    m = store.get_at_time('momentum', 'AAPL', day)
    v = store.get_at_time('volatility', 'AAPL', day)
    print(f"Day {day}: momentum={m:.4f}, vol={v:.4f}")
`,
    },
    {
      id: "fml-model-monitoring",
      slug: "model-monitoring",
      title: "Model Monitoring and Decay",
      content: `## Model Monitoring and Decay

Financial ML models degrade over time. Market dynamics change, new participants enter, regulations shift, and the patterns that drove past performance fade. Detecting and responding to model decay is critical — a model that was profitable last quarter might be losing money today. This lesson covers how to monitor model health and implement decay detection systems.

### Why Models Decay

Financial models decay for several reasons:

| Cause | Mechanism | Example |
|-------|-----------|---------|
| **Regime change** | Market environment shifts fundamentally | COVID crash, rate hiking cycle |
| **Alpha decay** | Signal becomes crowded as others discover it | Published academic anomalies |
| **Data drift** | Input feature distributions shift | Volatility regime change |
| **Concept drift** | Relationship between features and target changes | New market structure rules |
| **Structural breaks** | Market mechanics change | Decimal pricing, Reg NMS |

### Monitoring Framework

\`\`\`python
import numpy as np

class ModelMonitor:
    """
    Monitor model performance and feature distributions
    for signs of decay.
    """
    def __init__(self, baseline_sharpe, baseline_features,
                 alert_threshold=0.5):
        self.baseline_sharpe = baseline_sharpe
        self.baseline_features = baseline_features
        self.alert_threshold = alert_threshold
        self.daily_returns = []
        self.daily_predictions = []
        self.daily_actuals = []
        self.alerts = []

    def record(self, prediction, actual_return):
        """Record a daily prediction and actual return."""
        self.daily_predictions.append(prediction)
        self.daily_actuals.append(actual_return)
        position = np.sign(prediction)
        self.daily_returns.append(position * actual_return)

    def check_performance(self, window=63):
        """Check if recent Sharpe has degraded significantly."""
        if len(self.daily_returns) < window:
            return None

        recent = np.array(self.daily_returns[-window:])
        recent_sharpe = (np.mean(recent) / max(np.std(recent), 1e-10)
                        * np.sqrt(252))

        ratio = recent_sharpe / max(self.baseline_sharpe, 0.01)

        status = {
            'recent_sharpe': recent_sharpe,
            'baseline_sharpe': self.baseline_sharpe,
            'degradation_ratio': ratio,
            'alert': ratio < self.alert_threshold,
        }

        if status['alert']:
            self.alerts.append({
                'type': 'performance_decay',
                'recent_sharpe': recent_sharpe,
                'message': (f"Sharpe degraded to {recent_sharpe:.2f} "
                           f"({ratio:.1%} of baseline)")
            })

        return status

    def check_prediction_quality(self, window=63):
        """Check if prediction-actual correlation has degraded."""
        if len(self.daily_predictions) < window:
            return None

        preds = np.array(self.daily_predictions[-window:])
        actuals = np.array(self.daily_actuals[-window:])

        correlation = np.corrcoef(preds, actuals)[0, 1]
        hit_rate = np.mean(np.sign(preds) == np.sign(actuals))

        status = {
            'correlation': correlation,
            'hit_rate': hit_rate,
            'alert': correlation < 0,
        }

        if status['alert']:
            self.alerts.append({
                'type': 'prediction_quality',
                'correlation': correlation,
                'message': f"Prediction correlation negative: {correlation:.4f}"
            })

        return status

    def check_feature_drift(self, current_features, threshold=2.0):
        """
        Detect feature distribution drift using z-score test.
        """
        drift_alerts = []
        for i, (current, baseline) in enumerate(
            zip(current_features, self.baseline_features)):
            baseline_mean, baseline_std = baseline
            if baseline_std == 0:
                continue
            z_score = abs(current - baseline_mean) / baseline_std
            if z_score > threshold:
                drift_alerts.append({
                    'feature_idx': i,
                    'z_score': z_score,
                    'current': current,
                    'baseline_mean': baseline_mean,
                })
        return drift_alerts

    def get_report(self):
        """Generate monitoring report."""
        perf = self.check_performance()
        quality = self.check_prediction_quality()
        return {
            'performance': perf,
            'prediction_quality': quality,
            'total_alerts': len(self.alerts),
            'recent_alerts': self.alerts[-5:] if self.alerts else [],
        }

# Example: simulate model decay
np.random.seed(42)

monitor = ModelMonitor(
    baseline_sharpe=1.5,
    baseline_features=[(0.0, 1.0), (0.0, 0.02), (0.2, 0.05)],
)

# Phase 1: model works well (days 0-126)
for day in range(126):
    pred = np.random.normal(0.001, 0.01)
    actual = 0.3 * pred + np.random.normal(0, 0.008)
    monitor.record(pred, actual)

# Phase 2: model starts decaying (days 127-252)
for day in range(126):
    pred = np.random.normal(0.001, 0.01)
    actual = -0.1 * pred + np.random.normal(0, 0.012)  # signal inverted!
    monitor.record(pred, actual)

report = monitor.get_report()
print("Model Monitoring Report:")
if report['performance']:
    p = report['performance']
    print(f"  Recent Sharpe:  {p['recent_sharpe']:.4f}")
    print(f"  Baseline:       {p['baseline_sharpe']:.4f}")
    print(f"  Degradation:    {p['degradation_ratio']:.2%}")
    print(f"  Alert:          {p['alert']}")

if report['prediction_quality']:
    q = report['prediction_quality']
    print(f"  Pred Correlation: {q['correlation']:.4f}")
    print(f"  Hit Rate:         {q['hit_rate']:.4f}")

print(f"  Total Alerts: {report['total_alerts']}")
for alert in report['recent_alerts']:
    print(f"    [{alert['type']}] {alert['message']}")
\`\`\`

### Response Playbook

When decay is detected, follow a structured response:

1. **Reduce exposure** — Immediately reduce position sizes (e.g., halve allocation)
2. **Diagnose** — Is it performance decay, feature drift, or regime change?
3. **Compare** — Is the decay specific to this model or affecting the entire strategy?
4. **Retrain** — Retrain on recent data to adapt to new dynamics
5. **Validate** — Test retrained model on held-out recent data
6. **Restore or retire** — If retrained model passes validation, gradually restore allocation; if not, retire the model

### Key Takeaway

Model monitoring is not optional in production financial ML — it is a survival necessity. Models that are not monitored will silently lose money. Implement automated checks for performance decay, prediction quality degradation, and feature drift, with clear escalation procedures when alerts fire.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Implement a ModelMonitor that tracks:
# - Rolling Sharpe ratio vs baseline
# - Prediction-actual correlation
# - Feature drift detection

# TODO: Simulate a model that works for 126 days then decays
# TODO: Print monitoring report showing the decay
`,
      solutionCode: `import numpy as np

np.random.seed(42)

class ModelMonitor:
    def __init__(self, baseline_sharpe):
        self.baseline = baseline_sharpe
        self.returns = []
        self.preds = []
        self.actuals = []

    def record(self, pred, actual):
        self.preds.append(pred)
        self.actuals.append(actual)
        self.returns.append(np.sign(pred) * actual)

    def report(self, window=63):
        recent = np.array(self.returns[-window:])
        sharpe = np.mean(recent) / max(np.std(recent), 1e-10) * np.sqrt(252)
        corr = np.corrcoef(self.preds[-window:], self.actuals[-window:])[0, 1]
        hit = np.mean(np.sign(self.preds[-window:]) == np.sign(self.actuals[-window:]))
        print(f"Sharpe: {sharpe:.4f} (baseline: {self.baseline:.4f})")
        print(f"Correlation: {corr:.4f}")
        print(f"Hit rate: {hit:.4f}")
        print(f"Alert: {sharpe < self.baseline * 0.5}")

mon = ModelMonitor(1.5)
for _ in range(126):
    p = np.random.normal(0.001, 0.01)
    mon.record(p, 0.3 * p + np.random.normal(0, 0.008))
for _ in range(126):
    p = np.random.normal(0.001, 0.01)
    mon.record(p, -0.1 * p + np.random.normal(0, 0.012))

mon.report()
`,
    },
    {
      id: "fml-risk-ml",
      slug: "risk-management-with-ml",
      title: "Risk Management with ML",
      content: `## Risk Management with ML

Machine learning is transforming risk management from a backward-looking, rule-based discipline into a forward-looking, adaptive system. ML models can predict defaults more accurately, estimate tail risks that parametric models miss, detect market regime changes in real time, and dynamically adjust portfolio risk limits. This lesson covers the key applications of ML in risk management.

### ML for Credit Risk

Credit risk modeling is perhaps the most mature application of ML in risk management. Traditional scorecards (logistic regression on a handful of features) are being replaced by gradient boosting models that use hundreds of features:

\`\`\`python
import numpy as np

def simulate_credit_risk_model():
    """
    Simulate a credit risk ML model comparison:
    traditional scorecard vs. gradient boosting.
    """
    np.random.seed(42)
    n = 10000

    # Features
    income = np.random.lognormal(10.5, 0.8, n)
    debt_ratio = np.random.beta(2, 5, n)
    credit_history = np.random.gamma(5, 2, n)
    employment_years = np.random.exponential(5, n)
    n_accounts = np.random.poisson(5, n)

    # Non-linear default probability
    log_odds = (-3 + 0.5 * (debt_ratio > 0.4)
                - 0.3 * np.log(income / 50000)
                + 0.8 * (credit_history < 3)
                + 0.4 * (employment_years < 1)
                + 0.2 * debt_ratio * (income < 40000))  # interaction

    default_prob = 1 / (1 + np.exp(-log_odds))
    defaults = np.random.binomial(1, default_prob)

    X = np.column_stack([income, debt_ratio, credit_history,
                         employment_years, n_accounts])

    # Split
    split = 7000
    X_train, y_train = X[:split], defaults[:split]
    X_test, y_test = X[split:], defaults[split:]

    # Simple logistic regression (traditional scorecard)
    from sklearn.linear_model import LogisticRegression
    lr = LogisticRegression(max_iter=1000)
    lr.fit(X_train, y_train)
    lr_probs = lr.predict_proba(X_test)[:, 1]

    # Gradient boosting (ML approach)
    from sklearn.ensemble import GradientBoostingClassifier
    gb = GradientBoostingClassifier(n_estimators=100, max_depth=4,
                                     min_samples_leaf=50, random_state=42)
    gb.fit(X_train, y_train)
    gb_probs = gb.predict_proba(X_test)[:, 1]

    # Evaluate: AUC-ROC
    def compute_auc(y_true, y_score):
        sorted_idx = np.argsort(y_score)[::-1]
        y_sorted = y_true[sorted_idx]
        tpr_list, fpr_list = [0], [0]
        tp, fp = 0, 0
        n_pos = np.sum(y_true)
        n_neg = len(y_true) - n_pos
        for y in y_sorted:
            if y == 1:
                tp += 1
            else:
                fp += 1
            tpr_list.append(tp / max(n_pos, 1))
            fpr_list.append(fp / max(n_neg, 1))
        auc = np.trapz(tpr_list, fpr_list)
        return auc

    lr_auc = compute_auc(y_test, lr_probs)
    gb_auc = compute_auc(y_test, gb_probs)

    print(f"Default rate: {np.mean(defaults):.4f}")
    print(f"Logistic Regression AUC: {lr_auc:.4f}")
    print(f"Gradient Boosting AUC:   {gb_auc:.4f}")
    print(f"Improvement:             {(gb_auc - lr_auc) / lr_auc:.1%}")

simulate_credit_risk_model()
\`\`\`

### ML for Market Risk

Traditional Value at Risk (VaR) models assume static distributions. ML improves VaR estimation by:

- **Regime-aware models** — Automatically detect high/low volatility regimes and adjust risk estimates
- **Non-parametric tail estimation** — Use historical simulation enhanced with ML to better capture tail behavior
- **Dynamic correlation** — ML models that capture time-varying correlations between assets
- **Scenario generation** — GANs that generate plausible stress scenarios beyond historical experience

### ML for Fraud Detection

Fraud detection is a natural ML application because fraudulent patterns are complex, evolving, and non-linear:

| Technique | Application | Advantage |
|-----------|------------|-----------|
| **Supervised classification** | Flag known fraud patterns | High precision on known types |
| **Anomaly detection** | Detect novel fraud types | Catches unknown patterns |
| **Graph neural networks** | Detect fraud networks | Captures relationships between accounts |
| **Sequential models** | Detect behavioral changes | Catches account takeover |
| **Ensemble methods** | Combine multiple detectors | Best overall performance |

### Regulatory Considerations for ML in Risk

Regulators are cautiously embracing ML in risk management but impose requirements:

- **Model validation** — ML models must pass independent validation (SR 11-7 in the US)
- **Explainability** — Regulators expect explanations for model decisions, particularly for credit
- **Fairness** — Models must not discriminate based on protected characteristics
- **Documentation** — Complete documentation of model development, validation, and monitoring
- **Stress testing** — Models must be tested under extreme scenarios

### Key Takeaway

ML enhances risk management by capturing non-linear relationships, adapting to changing market conditions, and processing vastly more data than traditional models. However, deploying ML in risk management requires meeting regulatory standards for explainability, fairness, and validation. The most effective approach combines ML's predictive power with traditional risk management frameworks and human judgment.`,
      starterCode: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import GradientBoostingClassifier

np.random.seed(42)

# TODO: Simulate credit default data with non-linear relationships

# TODO: Compare logistic regression vs gradient boosting for default prediction

# TODO: Compute and compare AUC for both models
`,
      solutionCode: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import GradientBoostingClassifier

np.random.seed(42)
n = 10000
income = np.random.lognormal(10.5, 0.8, n)
debt = np.random.beta(2, 5, n)
history = np.random.gamma(5, 2, n)
employment = np.random.exponential(5, n)

log_odds = -3 + 0.5*(debt > 0.4) - 0.3*np.log(income/50000) + 0.8*(history < 3)
defaults = np.random.binomial(1, 1/(1+np.exp(-log_odds)))
X = np.column_stack([income, debt, history, employment])

X_tr, y_tr = X[:7000], defaults[:7000]
X_te, y_te = X[7000:], defaults[7000:]

lr = LogisticRegression(max_iter=1000).fit(X_tr, y_tr)
gb = GradientBoostingClassifier(n_estimators=100, max_depth=4,
                                 min_samples_leaf=50, random_state=42).fit(X_tr, y_tr)

def auc(y, scores):
    idx = np.argsort(scores)[::-1]
    ys = y[idx]
    tp = fp = 0
    n_pos, n_neg = sum(y), len(y) - sum(y)
    tprs, fprs = [0], [0]
    for yi in ys:
        if yi: tp += 1
        else: fp += 1
        tprs.append(tp/n_pos); fprs.append(fp/n_neg)
    return np.trapz(tprs, fprs)

lr_auc = auc(y_te, lr.predict_proba(X_te)[:, 1])
gb_auc = auc(y_te, gb.predict_proba(X_te)[:, 1])
print(f"LR AUC: {lr_auc:.4f}, GB AUC: {gb_auc:.4f}, Improvement: {(gb_auc-lr_auc)/lr_auc:.1%}")
`,
    },
    {
      id: "fml-regulatory",
      slug: "regulatory-considerations",
      title: "Regulatory Considerations for Financial ML",
      content: `## Regulatory Considerations for Financial ML

Deploying machine learning in financial services is not just a technical challenge — it is a regulatory one. Financial regulators worldwide are grappling with how to govern AI/ML systems that make consequential decisions about credit, trading, risk management, and consumer finance. Understanding the regulatory landscape is essential for anyone building financial ML systems.

### The Regulatory Framework

Financial ML operates at the intersection of multiple regulatory domains:

| Domain | Key Regulations | ML Impact |
|--------|----------------|-----------|
| **Model risk** | SR 11-7 (US), SS1/23 (UK) | All ML models require validation |
| **Fair lending** | ECOA, Fair Housing Act (US) | Models must not discriminate |
| **Consumer protection** | CFPB regulations, GDPR | Transparency and data rights |
| **Market integrity** | SEC/FINRA rules, MiFID II | Algorithmic trading oversight |
| **Prudential** | Basel III/IV, FRTB | Risk model standards |
| **AI-specific** | EU AI Act, NIST AI RMF | Emerging comprehensive AI regulation |

### Model Risk Management (SR 11-7)

The Federal Reserve's SR 11-7 guidance (Supervisory Guidance on Model Risk Management) is the foundation of model governance in US banking. It requires:

**Model development:** Rigorous development process with clear documentation of data sources, assumptions, methodology, and limitations.

**Model validation:** Independent review by a party not involved in development. Validation must assess conceptual soundness, outcomes analysis (backtesting), and benchmarking against alternative approaches.

**Model monitoring:** Ongoing performance tracking with defined thresholds for remediation and processes for model updates.

For ML models, SR 11-7 presents specific challenges because:
- Complex models are harder to validate than simple regression
- Feature engineering decisions are harder to document and justify
- Black-box models resist conceptual soundness analysis
- Non-stationarity of financial data means validation results may not hold

### Explainability Requirements

Regulators increasingly require that financial models be explainable:

\`\`\`python
import numpy as np

def explain_prediction(model_weights, feature_names, feature_values):
    """
    Generate a simple feature-level explanation for a model prediction.
    In practice, use SHAP or LIME for non-linear models.
    """
    contributions = model_weights * feature_values
    prediction = np.sum(contributions)

    explanation = {
        'prediction': prediction,
        'direction': 'approve' if prediction > 0 else 'deny',
        'top_factors': [],
    }

    sorted_idx = np.argsort(np.abs(contributions))[::-1]
    for idx in sorted_idx[:5]:
        explanation['top_factors'].append({
            'feature': feature_names[idx],
            'value': feature_values[idx],
            'contribution': contributions[idx],
            'direction': 'positive' if contributions[idx] > 0 else 'negative',
        })

    return explanation

# Example: credit decision explanation
feature_names = ['income_zscore', 'debt_ratio', 'credit_history_years',
                 'employment_years', 'n_delinquencies']
model_weights = np.array([0.3, -0.5, 0.2, 0.15, -0.8])

# Applicant features
applicant = np.array([1.5, 0.35, 8.0, 5.0, 0.0])

explanation = explain_prediction(model_weights, feature_names, applicant)

print(f"Decision: {explanation['direction'].upper()}")
print(f"Score: {explanation['prediction']:.4f}")
print(f"\\nTop factors:")
for factor in explanation['top_factors']:
    print(f"  {factor['feature']:25s}: {factor['contribution']:+.4f} "
          f"({factor['direction']})")
\`\`\`

### Fair Lending and Bias

Fair lending laws prohibit discrimination in credit decisions based on protected characteristics (race, gender, age, national origin). ML models can inadvertently discriminate through:

**Proxy discrimination** — Features that correlate with protected characteristics (zip code correlates with race; first name correlates with gender) can cause the model to discriminate even without directly using protected features.

**Historical bias** — Training data reflecting past discriminatory practices teaches the model to perpetuate those patterns.

**Disparate impact** — Even if the model is not intentionally discriminatory, if its outcomes disproportionately affect a protected group, it may violate fair lending laws.

**Testing for bias:**
- Compare approval rates across demographic groups
- Measure model performance (AUC, precision) separately for each group
- Use fairness metrics: demographic parity, equalized odds, calibration across groups
- Conduct adverse action analysis (are denial reasons distributed fairly?)

### The EU AI Act

The EU AI Act (effective 2024-2026) is the most comprehensive AI regulation globally:

- **High-risk AI systems** include credit scoring, insurance pricing, and trading algorithms
- High-risk systems must have: risk management, data governance, transparency, human oversight, accuracy and robustness
- **Prohibited practices** include social scoring and certain forms of predictive policing
- **Fines** up to 7% of global revenue for violations

### Practical Compliance Framework

For deploying ML in finance, follow this framework:

1. **Inventory** — Catalog all ML models and their risk tier (high/medium/low)
2. **Governance** — Establish a model risk committee with authority over model approvals
3. **Documentation** — Maintain comprehensive model documentation (data, methodology, validation, monitoring)
4. **Validation** — Independent validation before deployment and periodically thereafter
5. **Monitoring** — Continuous performance monitoring with defined alert thresholds
6. **Fairness** — Regular bias testing across protected groups
7. **Explainability** — Generate human-readable explanations for model decisions
8. **Audit trail** — Log all model inputs, outputs, and decisions for regulatory inspection

### Key Takeaway

Regulatory compliance is not an obstacle to financial ML — it is a requirement for sustainable deployment. Organizations that build compliance into their ML lifecycle from the start will deploy faster, avoid costly regulatory actions, and build trust with regulators and customers. The trend toward comprehensive AI regulation (EU AI Act, NIST AI RMF) means that the bar for responsible ML in finance will only rise.`,
      starterCode: `import numpy as np

# TODO: Implement a simple prediction explainer that:
# - Computes feature contributions
# - Ranks features by importance
# - Generates a human-readable explanation

# TODO: Demonstrate with a credit decision example
`,
      solutionCode: `import numpy as np

def explain_prediction(weights, names, values):
    contributions = weights * values
    prediction = np.sum(contributions)
    idx = np.argsort(np.abs(contributions))[::-1]
    print(f"Decision: {'APPROVE' if prediction > 0 else 'DENY'}")
    print(f"Score: {prediction:.4f}")
    print("\\nTop factors:")
    for i in idx[:5]:
        direction = 'positive' if contributions[i] > 0 else 'negative'
        print(f"  {names[i]:25s}: {contributions[i]:+.4f} ({direction})")

names = ['income_zscore', 'debt_ratio', 'credit_history',
         'employment_years', 'delinquencies']
weights = np.array([0.3, -0.5, 0.2, 0.15, -0.8])
applicant = np.array([1.5, 0.35, 8.0, 5.0, 0.0])

explain_prediction(weights, names, applicant)
`,
    },
  ],
};
