import { Module } from "../types";

export const algoTradingModule: Module = {
  id: "qf-algo",
  title: "Algorithmic Trading",
  description:
    "Explore the world of algorithmic trading — from market microstructure and order types to momentum strategies, mean reversion, and rigorous backtesting methodology.",
  lessons: [
    {
      id: "qf-algo-fundamentals",
      slug: "algo-trading-fundamentals",
      title: "Algorithmic Trading Fundamentals",
      content: `## Algorithmic Trading Fundamentals

Algorithmic trading uses computer programs to execute trades based on predefined rules. What began as simple order-routing automation in the 1990s has evolved into a sophisticated discipline where algorithms account for over 70% of US equity market volume. Understanding the fundamentals of algo trading is essential for any quantitative finance practitioner.

### What is Algorithmic Trading?

At its core, algorithmic trading means replacing human discretion with systematic, rule-based decision-making. An algorithm specifies:

- **When to trade** — Entry and exit signals based on price patterns, indicators, or model predictions
- **What to trade** — Universe selection and filtering criteria
- **How much to trade** — Position sizing and risk management rules
- **How to execute** — Order types, execution timing, and routing

### Categories of Algorithmic Trading

| Category | Time Horizon | Objective | Example |
|----------|-------------|-----------|---------|
| **High-Frequency Trading (HFT)** | Microseconds to minutes | Market making, latency arbitrage | Citadel Securities, Virtu |
| **Statistical Arbitrage** | Days to weeks | Exploit relative mispricings | Renaissance, D.E. Shaw |
| **Systematic Macro** | Weeks to months | Trend following across asset classes | AQR, Bridgewater |
| **Smart Order Routing** | Milliseconds | Minimize execution costs | Bank execution desks |
| **Execution Algorithms** | Minutes to hours | Fill large orders with minimal market impact | VWAP, TWAP, Implementation Shortfall |

### The Anatomy of a Trading Algorithm

Every trading algorithm has five core components:

**1. Data Pipeline** — Ingesting and cleaning market data (prices, volumes, order book, fundamentals, alternative data). Data quality is paramount; a single bad data point can trigger catastrophic trades.

**2. Signal Generation** — Transforming raw data into actionable trading signals. This can be as simple as a moving average crossover or as complex as a machine learning model processing thousands of features.

**3. Risk Management** — Constraining position sizes, enforcing stop-losses, monitoring portfolio-level risk, and preventing concentrated exposures. Risk management is the difference between a strategy that survives and one that blows up.

**4. Execution Engine** — Translating signals into actual market orders. The execution layer must handle order types (market, limit, stop), slippage, partial fills, and exchange connectivity.

**5. Performance Monitoring** — Real-time tracking of P&L, risk metrics, slippage, and strategy behavior relative to backtested expectations.

### A Simple Signal in Python

\`\`\`python
import numpy as np

np.random.seed(42)

# Simulate 500 days of price data
returns = np.random.normal(0.0003, 0.015, 500)
prices = 100 * np.exp(np.cumsum(returns))

# Simple moving average crossover signal
def sma(data, window):
    return np.convolve(data, np.ones(window)/window, mode='valid')

fast_ma = sma(prices, 20)
slow_ma = sma(prices, 50)

# Align lengths
min_len = min(len(fast_ma), len(slow_ma))
fast_ma = fast_ma[-min_len:]
slow_ma = slow_ma[-min_len:]
aligned_prices = prices[-min_len:]

# Signal: +1 when fast > slow (bullish), -1 when fast < slow
signal = np.where(fast_ma > slow_ma, 1, -1)

# Strategy returns
strategy_returns = signal[:-1] * np.diff(aligned_prices) / aligned_prices[:-1]
cumulative = np.cumprod(1 + strategy_returns) - 1

print(f"Final cumulative return: {cumulative[-1]:.4f}")
print(f"Annualized return: {np.mean(strategy_returns) * 252:.4f}")
print(f"Annualized volatility: {np.std(strategy_returns) * np.sqrt(252):.4f}")
\`\`\`

### Key Performance Metrics

| Metric | Formula | Good Value |
|--------|---------|-----------|
| **Sharpe Ratio** | (Return - Rf) / Volatility | > 1.5 |
| **Max Drawdown** | Largest peak-to-trough decline | < 15% |
| **Win Rate** | Profitable trades / Total trades | > 55% (for trend following) |
| **Profit Factor** | Gross profits / Gross losses | > 1.5 |
| **Turnover** | Value traded / Portfolio value | Strategy dependent |

### Regulatory and Ethical Considerations

Algorithmic trading operates under strict regulatory oversight. Key regulations include:
- **Reg NMS** (US) — Ensures best execution across market venues
- **MiFID II** (EU) — Requires algorithm registration, kill switches, and testing
- **Market manipulation rules** — Spoofing, layering, and quote stuffing are illegal

### Key Takeaway

Algorithmic trading is a disciplined engineering process: data in, signals out, risk controlled, execution optimized. Success requires not just a good signal but robust infrastructure, rigorous risk management, and continuous monitoring.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Simulate 500 days of price data (start at 100)

# TODO: Implement a simple moving average function

# TODO: Compute 20-day and 50-day moving averages

# TODO: Generate a +1/-1 trading signal based on crossover

# TODO: Compute strategy returns and print performance metrics
# (cumulative return, annualized return, annualized volatility)
`,
      solutionCode: `import numpy as np

np.random.seed(42)

# Simulate 500 days of price data
returns = np.random.normal(0.0003, 0.015, 500)
prices = 100 * np.exp(np.cumsum(returns))

# Simple moving average function
def sma(data, window):
    return np.convolve(data, np.ones(window)/window, mode='valid')

# 20-day and 50-day moving averages
fast_ma = sma(prices, 20)
slow_ma = sma(prices, 50)

# Align lengths
min_len = min(len(fast_ma), len(slow_ma))
fast_ma = fast_ma[-min_len:]
slow_ma = slow_ma[-min_len:]
aligned_prices = prices[-min_len:]

# Trading signal
signal = np.where(fast_ma > slow_ma, 1, -1)

# Strategy returns
strategy_returns = signal[:-1] * np.diff(aligned_prices) / aligned_prices[:-1]
cumulative = np.cumprod(1 + strategy_returns) - 1

print(f"Final cumulative return: {cumulative[-1]:.4f}")
print(f"Annualized return: {np.mean(strategy_returns) * 252:.4f}")
print(f"Annualized volatility: {np.std(strategy_returns) * np.sqrt(252):.4f}")
`,
    },
    {
      id: "qf-market-microstructure",
      slug: "market-microstructure",
      title: "Market Microstructure",
      content: `## Market Microstructure

Market microstructure is the study of how exchanges operate, how prices form, and how the mechanics of trading affect market outcomes. For algorithmic traders, understanding microstructure is the difference between a profitable strategy and one that bleeds money through poor execution.

### How Modern Markets Work

Today's equity markets are fragmented across multiple venues:

- **Exchanges** — NYSE, NASDAQ, CBOE (lit markets with public order books)
- **Dark pools** — Private venues where large orders trade without pre-trade transparency
- **ECNs** — Electronic Communication Networks that match buyers and sellers
- **Internalizers** — Broker-dealers that fill orders from their own inventory

In the US alone, there are over 60 trading venues for equities. The National Best Bid and Offer (NBBO) aggregates the best prices across all lit exchanges.

### The Limit Order Book

The limit order book (LOB) is the central data structure of modern markets. It records all outstanding buy (bid) and sell (ask) limit orders at each price level:

\`\`\`
Ask:  \$100.05  (500 shares)
      \$100.04  (1200 shares)
      \$100.03  (800 shares)    <- Best Ask
-----------------------------------
      \$100.02  (1500 shares)   <- Best Bid
      \$100.01  (2000 shares)
      \$100.00  (3000 shares)
Bid:
\`\`\`

The **spread** is the difference between the best ask and best bid (\$100.03 - \$100.02 = \$0.01 in this example). The spread represents the cost of immediate execution.

### Order Types and Their Uses

| Order Type | Description | When to Use |
|-----------|-------------|-------------|
| **Market order** | Execute immediately at best available price | Urgent trades where speed matters more than price |
| **Limit order** | Execute only at specified price or better | Patient trades where price control matters |
| **Stop order** | Becomes market order when trigger price is hit | Protecting against adverse moves |
| **Iceberg/hidden** | Only shows a portion of total size | Large orders to avoid revealing intent |
| **Peg order** | Automatically adjusts to track NBBO | Maintaining competitive pricing |

### Market Impact

When you trade, you move the market against yourself. This **market impact** is the largest hidden cost for institutional traders:

\`\`\`python
import numpy as np

def estimate_market_impact(volume_to_trade, avg_daily_volume,
                           daily_volatility, spread):
    """
    Simple market impact model (square-root model).
    Market impact is proportional to sqrt(participation rate) * volatility.
    """
    participation_rate = volume_to_trade / avg_daily_volume
    temporary_impact = spread / 2  # crossing the spread
    permanent_impact = daily_volatility * np.sqrt(participation_rate)
    total_impact = temporary_impact + permanent_impact
    return {
        'participation_rate': participation_rate,
        'temporary_impact_bps': temporary_impact * 10000,
        'permanent_impact_bps': permanent_impact * 10000,
        'total_impact_bps': total_impact * 10000
    }

# Example: trading 500K shares when ADV is 5M
impact = estimate_market_impact(
    volume_to_trade=500_000,
    avg_daily_volume=5_000_000,
    daily_volatility=0.02,
    spread=0.0002
)

for key, val in impact.items():
    print(f"{key}: {val:.2f}")
\`\`\`

The **square-root law** of market impact states that impact scales as the square root of the volume traded, not linearly. This has been confirmed across markets and time periods and is a fundamental result in microstructure research.

### The Role of Market Makers

Market makers provide liquidity by continuously posting buy and sell quotes. They profit from the bid-ask spread but face the risk of **adverse selection** — trading with informed counterparties who know something they do not. The market maker's dilemma is:

- Narrower spreads attract more order flow (more revenue)
- But narrower spreads also increase vulnerability to informed traders

This tension drives much of the theory and practice of market making algorithms.

### Information and Price Discovery

Prices incorporate information through the trading process itself. The Kyle (1985) model shows that informed traders reveal information gradually through their order flow, and market makers adjust prices in response. Key concepts:

- **Kyle's lambda** — The price impact per unit of order flow, measuring market depth
- **Price discovery** — The process by which markets incorporate new information into prices
- **Informed vs. uninformed flow** — Market makers must estimate the probability that incoming orders contain information

### Latency and the Speed Race

In high-frequency trading, speed is a competitive advantage. Latency — the time between an event and a response — is measured in microseconds:

- Exchange matching engine: ~10-50 microseconds
- Colocation (servers next to exchange): ~1-5 microseconds of network latency
- Cross-country fiber: ~30-60 milliseconds
- Microwave towers: ~5-10 milliseconds (speed of light advantage)

### Key Takeaway

Market microstructure determines the true cost of trading. Every algorithm must account for spreads, market impact, latency, and the strategic behavior of other participants. Ignoring microstructure leads to backtests that look profitable but fail in live trading.`,
      starterCode: `import numpy as np

# TODO: Implement a market impact estimator using the square-root model
def estimate_market_impact(volume_to_trade, avg_daily_volume,
                           daily_volatility, spread):
    pass

# TODO: Estimate impact for trading 1M shares with ADV of 10M,
# daily vol of 1.5%, and spread of 0.01%

# TODO: Print all impact components in basis points
`,
      solutionCode: `import numpy as np

def estimate_market_impact(volume_to_trade, avg_daily_volume,
                           daily_volatility, spread):
    participation_rate = volume_to_trade / avg_daily_volume
    temporary_impact = spread / 2
    permanent_impact = daily_volatility * np.sqrt(participation_rate)
    total_impact = temporary_impact + permanent_impact
    return {
        'participation_rate': participation_rate,
        'temporary_impact_bps': temporary_impact * 10000,
        'permanent_impact_bps': permanent_impact * 10000,
        'total_impact_bps': total_impact * 10000
    }

impact = estimate_market_impact(
    volume_to_trade=1_000_000,
    avg_daily_volume=10_000_000,
    daily_volatility=0.015,
    spread=0.0001
)

for key, val in impact.items():
    print(f"{key}: {val:.2f}")
`,
    },
    {
      id: "qf-momentum-strategies",
      slug: "momentum-strategies",
      title: "Momentum Strategies",
      content: `## Momentum Strategies

Momentum is one of the most robust and well-documented anomalies in finance. First rigorously documented by Jegadeesh and Titman in 1993, the momentum effect shows that assets that have performed well over the past 3-12 months tend to continue performing well, and those that have performed poorly tend to continue underperforming. This pattern persists across equities, bonds, currencies, and commodities.

### The Momentum Anomaly

The classic momentum strategy forms portfolios based on past returns:

1. **Rank** all assets by their trailing return over a formation period (typically 12 months, skipping the most recent month)
2. **Go long** the top decile (winners)
3. **Go short** the bottom decile (losers)
4. **Hold** for a holding period (typically 1-6 months)
5. **Rebalance** at the end of the holding period

Historically, this strategy has earned 8-12% annualized returns in US equities, with a Sharpe ratio of 0.5-0.8.

### Types of Momentum

| Type | Lookback | Description |
|------|----------|-------------|
| **Cross-sectional** | 3-12 months | Rank assets against each other; long winners, short losers |
| **Time-series** | 1-12 months | Each asset: long if past return positive, short if negative |
| **Dual momentum** | 12 months | Combine cross-sectional and time-series signals |
| **Short-term reversal** | 1-4 weeks | Opposite of momentum — recent losers tend to bounce |
| **Industry momentum** | 6-12 months | Apply momentum at the industry/sector level |

### Implementing Cross-Sectional Momentum

\`\`\`python
import numpy as np

np.random.seed(42)

# Simulate 100 stocks over 252 days
n_stocks = 100
n_days = 252
returns = np.random.normal(0.0003, 0.02, (n_days, n_stocks))

# Add momentum signal: stocks 0-9 have positive drift,
# stocks 90-99 have negative drift
returns[:, :10] += 0.001    # winners
returns[:, 90:] -= 0.001    # losers

# Formation period: last 252 days (skip last 21)
formation_returns = np.sum(returns[:-21], axis=0)

# Rank stocks by formation period return
rankings = np.argsort(formation_returns)

# Long top 10, short bottom 10
long_stocks = rankings[-10:]
short_stocks = rankings[:10]

# Holding period: last 21 days
holding_returns = returns[-21:]

# Portfolio returns
long_ret = np.mean(holding_returns[:, long_stocks], axis=1)
short_ret = np.mean(holding_returns[:, short_stocks], axis=1)
momentum_ret = long_ret - short_ret

cum_return = np.prod(1 + momentum_ret) - 1
ann_sharpe = np.mean(momentum_ret) / np.std(momentum_ret) * np.sqrt(252)

print(f"Momentum cumulative return (21 days): {cum_return:.4f}")
print(f"Annualized Sharpe ratio: {ann_sharpe:.4f}")
\`\`\`

### Why Does Momentum Work?

The persistence of momentum is a puzzle because it appears to violate market efficiency. Several explanations have been proposed:

**Behavioral explanations:**
- **Underreaction** — Investors are slow to incorporate new information, so prices gradually drift toward fair value
- **Herding** — Positive feedback loops as investors pile into winning stocks
- **Disposition effect** — Investors sell winners too early and hold losers too long, slowing price adjustment

**Risk-based explanations:**
- Momentum returns may compensate for **crash risk** — momentum portfolios experience occasional severe drawdowns (momentum crashes)
- Momentum may be related to **macroeconomic risk** that varies over the business cycle

### Momentum Crashes

The most dangerous aspect of momentum investing is the **momentum crash**. When markets recover sharply after a downturn, past losers (which tend to have high beta) rally violently while past winners lag. The most dramatic example occurred in 2009, when momentum strategies lost over 50% in a matter of weeks.

Strategies to mitigate momentum crashes:
- **Dynamic hedging** — Reduce exposure when market volatility spikes
- **Volatility scaling** — Scale positions inversely with realized volatility
- **Stop-losses** — Exit positions when losses exceed a threshold
- **Factor timing** — Reduce momentum exposure during high-dispersion regimes

### Combining Momentum with Other Factors

Momentum works even better when combined with other factors:

- **Momentum + Value** — These two factors are negatively correlated, providing natural diversification. A portfolio that is long cheap winners and short expensive losers has historically earned higher risk-adjusted returns than either factor alone.
- **Momentum + Quality** — Adding quality screens (profitability, low leverage) to momentum reduces crash risk.
- **Multi-asset momentum** — Applying momentum across asset classes (equities, bonds, commodities, currencies) provides further diversification.

### Key Takeaway

Momentum is a persistent, cross-market phenomenon that forms the backbone of many systematic strategies. However, it requires careful risk management due to the ever-present risk of momentum crashes. Combining momentum with value and quality factors creates more robust portfolios.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Simulate 50 stocks over 252 days
# Give stocks 0-4 extra positive drift, stocks 45-49 negative drift

# TODO: Compute formation period returns (skip last 21 days)

# TODO: Rank stocks and select top 5 (long) and bottom 5 (short)

# TODO: Compute holding period returns for the momentum strategy

# TODO: Print cumulative return and annualized Sharpe ratio
`,
      solutionCode: `import numpy as np

np.random.seed(42)

# Simulate 50 stocks over 252 days
n_stocks = 50
n_days = 252
returns = np.random.normal(0.0003, 0.02, (n_days, n_stocks))
returns[:, :5] += 0.001
returns[:, 45:] -= 0.001

# Formation period returns (skip last 21 days)
formation_returns = np.sum(returns[:-21], axis=0)

# Rank and select
rankings = np.argsort(formation_returns)
long_stocks = rankings[-5:]
short_stocks = rankings[:5]

# Holding period returns (last 21 days)
holding_returns = returns[-21:]
long_ret = np.mean(holding_returns[:, long_stocks], axis=1)
short_ret = np.mean(holding_returns[:, short_stocks], axis=1)
momentum_ret = long_ret - short_ret

cum_return = np.prod(1 + momentum_ret) - 1
ann_sharpe = np.mean(momentum_ret) / np.std(momentum_ret) * np.sqrt(252)

print(f"Momentum cumulative return (21 days): {cum_return:.4f}")
print(f"Annualized Sharpe ratio: {ann_sharpe:.4f}")
`,
    },
    {
      id: "qf-mean-reversion",
      slug: "mean-reversion-strategies",
      title: "Mean Reversion Strategies",
      content: `## Mean Reversion Strategies

While momentum exploits trends, mean reversion exploits the tendency of prices to revert toward a historical average or equilibrium value. Mean reversion strategies are the counterpart to momentum and are particularly common in pairs trading, statistical arbitrage, and fixed income. The two approaches are complementary: momentum tends to work at medium-term horizons (3-12 months), while mean reversion dominates at very short (intraday to days) and very long (3-5 year) horizons.

### The Mean Reversion Hypothesis

Mean reversion asserts that extreme price movements are temporary and that prices will eventually return to a long-run equilibrium. In statistical terms, a mean-reverting process has a negative autocorrelation at the relevant time scale: positive returns are followed by negative returns, and vice versa.

The Ornstein-Uhlenbeck (OU) process is the standard mathematical model for mean reversion:

\`\`\`
dX = theta * (mu - X) * dt + sigma * dW
\`\`\`

where:
- **theta** is the speed of mean reversion (higher = faster reversion)
- **mu** is the long-run mean
- **sigma** is the volatility
- **dW** is a Brownian motion increment

### Testing for Mean Reversion

Before trading a mean reversion strategy, you must test whether the target series actually mean-reverts. The two standard tests are:

**1. Augmented Dickey-Fuller (ADF) Test** — Tests the null hypothesis of a unit root (non-stationarity). A statistically significant result (p-value < 0.05) suggests the series is stationary and mean-reverting.

**2. Hurst Exponent** — Measures the long-range dependence of a time series:

| Hurst Value | Interpretation |
|-------------|----------------|
| H < 0.5 | Mean-reverting |
| H = 0.5 | Random walk |
| H > 0.5 | Trending (momentum) |

\`\`\`python
import numpy as np

def hurst_exponent(time_series, max_lag=100):
    """Estimate the Hurst exponent using the rescaled range method."""
    lags = range(2, max_lag)
    tau = []
    for lag in lags:
        # Compute variance of lagged differences
        diffs = time_series[lag:] - time_series[:-lag]
        tau.append(np.std(diffs))

    # Fit log-log regression
    log_lags = np.log(list(lags))
    log_tau = np.log(tau)
    coeffs = np.polyfit(log_lags, log_tau, 1)
    return coeffs[0]  # Hurst exponent

np.random.seed(42)

# Mean-reverting series (OU process)
n = 1000
theta, mu, sigma = 0.5, 100.0, 2.0
dt = 1/252
ou_series = np.zeros(n)
ou_series[0] = mu
for t in range(1, n):
    ou_series[t] = (ou_series[t-1]
                    + theta * (mu - ou_series[t-1]) * dt
                    + sigma * np.sqrt(dt) * np.random.normal())

# Random walk
rw_series = np.cumsum(np.random.normal(0, 1, n)) + 100

print(f"OU process Hurst exponent: {hurst_exponent(ou_series):.4f}")
print(f"Random walk Hurst exponent: {hurst_exponent(rw_series):.4f}")
\`\`\`

### Pairs Trading

Pairs trading is the most famous mean reversion strategy. The idea is to find two stocks that move together (are cointegrated) and trade the spread between them:

1. **Identify pairs** — Find stocks with similar business models or economic exposure whose price ratio or spread is stationary
2. **Test for cointegration** — Use the Engle-Granger or Johansen test to verify the spread mean-reverts
3. **Compute the hedge ratio** — Regress one stock on the other to determine the appropriate ratio
4. **Generate signals** — When the spread deviates from its mean by more than a threshold (e.g., 2 standard deviations), enter a position betting on convergence
5. **Exit** — Close the position when the spread returns to its mean

\`\`\`python
# Simulated pairs trade
np.random.seed(42)
n = 500

# Two cointegrated stocks
common_factor = np.cumsum(np.random.normal(0, 0.5, n))
stock_a = 50 + common_factor + np.random.normal(0, 0.5, n)
stock_b = 30 + 0.6 * common_factor + np.random.normal(0, 0.3, n)

# Compute the spread (using hedge ratio of 0.6)
spread = stock_a - (50/30) * stock_b

# Z-score of the spread
spread_mean = np.mean(spread[:250])   # estimated on first half
spread_std = np.std(spread[:250])
z_score = (spread - spread_mean) / spread_std

# Trading signals on second half
signals = np.zeros(n)
signals[z_score > 2] = -1   # spread too high: short A, long B
signals[z_score < -2] = 1   # spread too low: long A, short B

trade_days = np.sum(np.abs(signals[250:]) > 0)
print(f"Number of trading signals (out-of-sample): {trade_days}")
print(f"Spread mean: {spread_mean:.4f}")
print(f"Spread std: {spread_std:.4f}")
\`\`\`

### Bollinger Band Mean Reversion

For single-asset mean reversion, Bollinger Bands provide a simple framework:

- **Middle band** — N-period simple moving average
- **Upper band** — Middle + K standard deviations
- **Lower band** — Middle - K standard deviations

The strategy goes long when price touches the lower band (oversold) and short when it touches the upper band (overbought). This works best for range-bound assets or during low-volatility regimes.

### Risks of Mean Reversion

Mean reversion strategies carry specific risks:

- **Regime change** — A previously mean-reverting relationship can break permanently due to fundamental changes (mergers, regulatory shifts, structural economic changes)
- **Inventory risk** — Positions can grow very large if the spread keeps diverging before reverting
- **Crowding** — Popular pairs become arbitraged away, reducing profitability
- **Negative skew** — Mean reversion strategies typically win small amounts frequently but lose large amounts occasionally

### Key Takeaway

Mean reversion is a powerful edge, particularly at short time horizons and in relative value settings. Success requires rigorous statistical testing, disciplined risk management, and continuous monitoring for regime changes that can turn a profitable strategy into a losing one.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Implement the Hurst exponent estimator

# TODO: Simulate an Ornstein-Uhlenbeck process (1000 steps)

# TODO: Simulate a random walk for comparison

# TODO: Compute and print the Hurst exponent for both series
# (OU should be < 0.5, random walk should be ~0.5)
`,
      solutionCode: `import numpy as np

def hurst_exponent(time_series, max_lag=100):
    lags = range(2, max_lag)
    tau = []
    for lag in lags:
        diffs = time_series[lag:] - time_series[:-lag]
        tau.append(np.std(diffs))
    log_lags = np.log(list(lags))
    log_tau = np.log(tau)
    coeffs = np.polyfit(log_lags, log_tau, 1)
    return coeffs[0]

np.random.seed(42)

# Ornstein-Uhlenbeck process
n = 1000
theta, mu, sigma = 0.5, 100.0, 2.0
dt = 1/252
ou_series = np.zeros(n)
ou_series[0] = mu
for t in range(1, n):
    ou_series[t] = (ou_series[t-1]
                    + theta * (mu - ou_series[t-1]) * dt
                    + sigma * np.sqrt(dt) * np.random.normal())

# Random walk
rw_series = np.cumsum(np.random.normal(0, 1, n)) + 100

print(f"OU process Hurst exponent: {hurst_exponent(ou_series):.4f}")
print(f"Random walk Hurst exponent: {hurst_exponent(rw_series):.4f}")
`,
    },
    {
      id: "qf-backtesting",
      slug: "backtesting-strategies",
      title: "Backtesting Strategies",
      content: `## Backtesting Strategies

Backtesting is the process of evaluating a trading strategy on historical data to estimate its future performance. It is simultaneously the most important and most dangerous step in quantitative strategy development. A well-conducted backtest provides confidence that a strategy captures a real market phenomenon; a poorly conducted backtest produces illusory profits that evaporate in live trading.

### Why Backtesting Matters

Before committing real capital, you need answers to critical questions:

- Does the strategy generate positive risk-adjusted returns?
- How large are the drawdowns?
- Is the strategy robust to different market regimes?
- How sensitive is performance to parameter choices?
- What are the execution costs, and do they destroy profitability?

### The Backtesting Framework

A proper backtest simulates the complete trading process:

\`\`\`python
import numpy as np

class SimpleBacktester:
    def __init__(self, prices, signal, transaction_cost=0.001):
        """
        prices: array of daily prices
        signal: array of positions (-1, 0, +1) for each day
        transaction_cost: one-way cost as fraction of trade value
        """
        self.prices = prices
        self.signal = signal
        self.tc = transaction_cost

    def run(self):
        returns = np.diff(self.prices) / self.prices[:-1]
        positions = self.signal[:-1]

        # Strategy gross returns
        strategy_returns = positions * returns

        # Transaction costs (proportional to position changes)
        trades = np.abs(np.diff(np.concatenate([[0], positions])))
        costs = trades * self.tc
        strategy_returns -= costs[:-1] if len(costs) > len(strategy_returns) else costs

        # Compute metrics
        cum_returns = np.cumprod(1 + strategy_returns)
        total_return = cum_returns[-1] - 1
        ann_return = (1 + total_return) ** (252 / len(returns)) - 1
        ann_vol = np.std(strategy_returns) * np.sqrt(252)
        sharpe = ann_return / ann_vol if ann_vol > 0 else 0

        # Maximum drawdown
        peak = np.maximum.accumulate(cum_returns)
        drawdowns = (cum_returns - peak) / peak
        max_dd = np.min(drawdowns)

        return {
            'total_return': total_return,
            'ann_return': ann_return,
            'ann_volatility': ann_vol,
            'sharpe_ratio': sharpe,
            'max_drawdown': max_dd,
            'n_trades': int(np.sum(trades > 0)),
        }

# Example usage
np.random.seed(42)
n_days = 1000
prices = 100 * np.exp(np.cumsum(np.random.normal(0.0003, 0.015, n_days)))

# Simple momentum signal: long if 20-day return > 0
lookback = 20
signal = np.zeros(n_days)
for i in range(lookback, n_days):
    signal[i] = 1 if prices[i] > prices[i - lookback] else -1

bt = SimpleBacktester(prices, signal, transaction_cost=0.001)
results = bt.run()

for key, val in results.items():
    print(f"{key}: {val:.4f}" if isinstance(val, float) else f"{key}: {val}")
\`\`\`

### The Cardinal Sins of Backtesting

The most common errors that lead to false confidence:

**1. Look-Ahead Bias** — Using information that was not available at the time of the trade. Examples: using end-of-day prices for intraday signals, incorporating restated financial data, using future knowledge to select the stock universe.

**2. Survivorship Bias** — Testing only on stocks that still exist today, ignoring delisted companies (which were often poor performers). This inflates returns by 1-2% per year.

**3. Overfitting** — Optimizing too many parameters on historical data until the strategy fits noise rather than signal. A strategy with 20 optimized parameters and 5 years of data is almost certainly overfit.

**4. Ignoring Transaction Costs** — Strategies with high turnover can see their profits entirely consumed by spreads, commissions, and market impact.

**5. Data Snooping** — Testing many strategies on the same dataset and selecting the one that worked best. With enough trials, random data will produce apparent patterns.

### Combating Overfitting

| Technique | Description |
|-----------|-------------|
| **Walk-forward analysis** | Train on rolling windows, test on out-of-sample periods |
| **Cross-validation** | Use k-fold or combinatorial purged cross-validation |
| **Minimum backtest length** | Require sufficient out-of-sample data (Bailey and Lopez de Prado suggest using the deflated Sharpe ratio) |
| **Parameter stability** | Check that performance is robust to small parameter changes |
| **Multiple hypothesis correction** | Adjust for the number of strategies tested (Bonferroni, BH) |

### Walk-Forward Analysis

Walk-forward analysis is the gold standard for validating trading strategies:

1. **Divide data** into in-sample (training) and out-of-sample (testing) windows
2. **Optimize** parameters on the training window
3. **Test** on the subsequent out-of-sample window
4. **Roll forward** — shift both windows and repeat
5. **Concatenate** all out-of-sample results to form a continuous performance record

This simulates how the strategy would actually be used: you optimize on past data and trade on future data that was not available during optimization.

### Key Metrics to Report

A complete backtest report should include:

- **Sharpe Ratio** — Risk-adjusted return (beware: Sharpe > 2 in backtests is often a red flag for overfitting)
- **Maximum Drawdown** — Largest peak-to-trough loss
- **Calmar Ratio** — Annualized return / max drawdown
- **Sortino Ratio** — Return / downside deviation (penalizes only negative volatility)
- **Turnover** — How frequently the portfolio trades
- **Profit Factor** — Gross profits / gross losses
- **Number of trades** — Too few trades means statistically insignificant results

### The Deflated Sharpe Ratio

Bailey and Lopez de Prado (2014) introduced the **deflated Sharpe ratio** to account for multiple testing. It adjusts the observed Sharpe ratio for the number of strategies tested, the skewness and kurtosis of returns, and the length of the backtest. This is perhaps the single most important innovation in backtesting methodology in the past decade.

### Key Takeaway

Backtesting is essential but treacherous. The difference between a rigorous and a naive backtest can be the difference between a strategy that makes money and one that loses it. Always use walk-forward analysis, account for transaction costs, correct for multiple testing, and be deeply skeptical of exceptional backtest results.`,
      starterCode: `import numpy as np

# TODO: Implement a SimpleBacktester class with:
# - __init__(prices, signal, transaction_cost)
# - run() method that returns a dict of performance metrics:
#   total_return, ann_return, ann_volatility, sharpe_ratio, max_drawdown

# TODO: Generate 1000 days of simulated prices

# TODO: Create a simple moving average crossover signal

# TODO: Run the backtest and print results
`,
      solutionCode: `import numpy as np

class SimpleBacktester:
    def __init__(self, prices, signal, transaction_cost=0.001):
        self.prices = prices
        self.signal = signal
        self.tc = transaction_cost

    def run(self):
        returns = np.diff(self.prices) / self.prices[:-1]
        positions = self.signal[:-1]
        strategy_returns = positions * returns
        trades = np.abs(np.diff(np.concatenate([[0], positions])))
        costs = trades[:len(strategy_returns)] * self.tc
        strategy_returns -= costs

        cum_returns = np.cumprod(1 + strategy_returns)
        total_return = cum_returns[-1] - 1
        ann_return = (1 + total_return) ** (252 / len(returns)) - 1
        ann_vol = np.std(strategy_returns) * np.sqrt(252)
        sharpe = ann_return / ann_vol if ann_vol > 0 else 0
        peak = np.maximum.accumulate(cum_returns)
        drawdowns = (cum_returns - peak) / peak
        max_dd = np.min(drawdowns)

        return {
            'total_return': total_return,
            'ann_return': ann_return,
            'ann_volatility': ann_vol,
            'sharpe_ratio': sharpe,
            'max_drawdown': max_dd,
            'n_trades': int(np.sum(trades > 0)),
        }

np.random.seed(42)
n_days = 1000
prices = 100 * np.exp(np.cumsum(np.random.normal(0.0003, 0.015, n_days)))

lookback = 20
signal = np.zeros(n_days)
for i in range(lookback, n_days):
    signal[i] = 1 if prices[i] > prices[i - lookback] else -1

bt = SimpleBacktester(prices, signal, transaction_cost=0.001)
results = bt.run()
for key, val in results.items():
    print(f"{key}: {val:.4f}" if isinstance(val, float) else f"{key}: {val}")
`,
    },
  ],
};
