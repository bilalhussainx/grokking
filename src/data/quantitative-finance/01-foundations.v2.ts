import { Module } from "../types";

export const foundationsModule: Module = {
  id: "qf-foundations",
  title: "Foundations of Quantitative Finance",
  description: "Build the mathematical and statistical foundation needed for quantitative finance — random walks, probability distributions, and market efficiency.",
  lessons: [
    {
      id: "qf-what-is-quant-finance",
      slug: "what-is-quant-finance",
      title: "What is Quantitative Finance",
      content: `## What is Quantitative Finance?

Quantitative finance is the discipline of applying mathematical models, statistical methods, and computational techniques to financial markets and instruments. It sits at the intersection of mathematics, computer science, and finance, providing the analytical backbone for modern capital markets.

### The Role of Quants

Quantitative analysts — commonly called "quants" — work in investment banks, hedge funds, asset management firms, and proprietary trading shops. Their primary responsibilities include:

- **Pricing complex derivatives** using stochastic calculus and numerical methods
- **Building risk models** that quantify potential losses under various market scenarios
- **Developing trading strategies** based on statistical patterns and market inefficiencies
- **Constructing optimal portfolios** that balance risk and return

### A Brief History

The field traces its roots to Louis Bachelier's 1900 doctoral thesis, "The Theory of Speculation," which first modeled stock prices as a random process. However, quantitative finance truly exploded in the 1970s with two landmark developments:

1. **The Black-Scholes formula (1973)** — Fischer Black and Myron Scholes published their options pricing model, giving traders a mathematical framework to price options. This single equation transformed derivatives markets and earned Scholes the Nobel Prize.
2. **The rise of electronic trading** — As computers entered trading floors, quantitative methods became essential for executing and managing large portfolios.

### Key Pillars of Quantitative Finance

| Pillar | Description | Key Tools |
|--------|-------------|-----------|
| **Derivatives Pricing** | Valuing options, futures, swaps | Stochastic calculus, PDEs |
| **Risk Management** | Measuring and controlling financial risk | VaR, Monte Carlo simulation |
| **Portfolio Optimization** | Allocating capital efficiently | Mean-variance optimization, factor models |
| **Algorithmic Trading** | Automated execution of trading strategies | Statistical models, machine learning |
| **Fixed Income** | Modeling bonds and interest rates | Term structure models, yield curves |

### Mathematics You Will Need

Quantitative finance draws on several branches of mathematics:

- **Probability and statistics** — The language of uncertainty. You need distributions, expectations, variance, and hypothesis testing.
- **Calculus** — Both ordinary and stochastic. The Ito calculus is the workhorse of derivatives pricing.
- **Linear algebra** — Essential for portfolio theory and factor models. Covariance matrices, eigendecomposition, and matrix operations appear constantly.
- **Differential equations** — The Black-Scholes PDE and interest rate models are partial or stochastic differential equations.
- **Numerical methods** — Most real-world problems lack closed-form solutions. Monte Carlo simulation, finite difference methods, and optimization algorithms fill the gap.

### Why Python?

Python has become the lingua franca of quantitative finance for several reasons:

\`\`\`python
import numpy as np

# Quick example: simulate 1000 stock price paths
S0 = 100        # initial stock price
mu = 0.08       # expected annual return
sigma = 0.20    # annual volatility
T = 1.0         # one year
dt = 1/252      # daily steps
n_steps = 252
n_paths = 1000

np.random.seed(42)
Z = np.random.standard_normal((n_steps, n_paths))
S = np.zeros_like(Z)
S[0] = S0

for t in range(1, n_steps):
    S[t] = S[t-1] * np.exp((mu - 0.5*sigma**2)*dt + sigma*np.sqrt(dt)*Z[t])

print(f"Mean final price: \${S[-1].mean():.2f}")
print(f"Std of final price: \${S[-1].std():.2f}")
\`\`\`

Libraries like NumPy, SciPy, pandas, and QuantLib provide production-grade tools for numerical computation, data manipulation, and derivatives pricing. Throughout this course, you will use Python to implement the models you learn.

### Career Paths

Quantitative finance offers several career trajectories: front-office quant (pricing and trading), risk quant (model validation and risk measurement), quant developer (building infrastructure), and quant researcher (alpha generation). Each requires a blend of mathematical depth and coding ability.

### Key Takeaway

Quantitative finance transforms financial intuition into rigorous, testable models. This course will take you from foundational mathematics through derivatives pricing, risk management, portfolio theory, and algorithmic trading — all with hands-on Python implementations.`,
    },
    {
      id: "qf-random-walks",
      slug: "random-walks-brownian-motion",
      title: "Random Walks & Brownian Motion",
      content: `## Random Walks & Brownian Motion

The random walk is one of the most fundamental concepts in quantitative finance. It provides the mathematical foundation for modeling stock prices, interest rates, and virtually every other financial variable that evolves unpredictably over time.

### The Simple Random Walk

Imagine flipping a fair coin repeatedly. If heads, you step up by one unit; if tails, you step down. Your position after \`n\` flips is a **simple random walk**:

\`\`\`
S(n) = X(1) + X(2) + ... + X(n)
\`\`\`

where each X(i) is +1 or -1 with equal probability. This seemingly simple process has profound properties:

- **The expected position is zero** — on average, you end up where you started
- **The variance grows linearly with time** — Var(S(n)) = n
- **The standard deviation grows as the square root of time** — this is the famous "square root of time" rule used in risk management

### From Discrete to Continuous: Brownian Motion

In 1827, botanist Robert Brown observed pollen grains jittering in water. Decades later, mathematicians formalized this as **Brownian motion** (also called a Wiener process), denoted W(t). It is the continuous-time limit of a random walk and has these defining properties:

1. **W(0) = 0** — starts at zero
2. **Independent increments** — W(t) - W(s) is independent of the path up to time s
3. **Normal increments** — W(t) - W(s) follows a normal distribution with mean 0 and variance (t - s)
4. **Continuous paths** — the sample paths are continuous but nowhere differentiable

The nowhere-differentiable property is crucial: it means you cannot predict the direction of a Brownian motion at any instant, no matter how much history you observe. This aligns with the intuition that short-term stock price movements are essentially unpredictable.

### Geometric Brownian Motion (GBM)

Raw Brownian motion can go negative, which is unrealistic for stock prices. The standard model for stock price evolution is **geometric Brownian motion**:

\`\`\`
dS = mu * S * dt + sigma * S * dW
\`\`\`

where:
- \`S\` is the stock price
- \`mu\` is the drift (expected return)
- \`sigma\` is the volatility
- \`dW\` is the Brownian motion increment

The solution to this stochastic differential equation is:

\`\`\`
S(t) = S(0) * exp((mu - sigma^2/2) * t + sigma * W(t))
\`\`\`

This ensures prices remain positive and returns are log-normally distributed, which matches empirical observations reasonably well for many asset classes.

### Simulating Brownian Motion in Python

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Parameters
T = 1.0       # time horizon (1 year)
N = 1000      # number of time steps
dt = T / N    # time step size

# Generate standard normal increments
np.random.seed(42)
dW = np.sqrt(dt) * np.random.standard_normal(N)

# Cumulative sum gives the Brownian motion path
W = np.cumsum(dW)
W = np.insert(W, 0, 0.0)  # W(0) = 0

t = np.linspace(0, T, N + 1)
\`\`\`

### Properties of Financial Returns

Under GBM, the log-returns over a period dt are:

\`\`\`
ln(S(t+dt)/S(t)) ~ Normal((mu - sigma^2/2)*dt, sigma^2*dt)
\`\`\`

This has important practical implications:
- Daily returns are approximately normally distributed (though real markets have fatter tails)
- Returns over longer periods have higher variance, proportional to the time period
- The \`sigma^2/2\` correction term ensures the expected value of the stock price equals \`S(0) * exp(mu * t)\`

### Limitations of GBM

While GBM is the foundation of modern finance, it has well-known shortcomings:

| GBM Assumption | Market Reality |
|----------------|---------------|
| Constant volatility | Volatility clusters and changes over time |
| Continuous paths | Markets can gap (jump) overnight or during crashes |
| Normal log-returns | Returns exhibit fat tails and skewness |
| Independent increments | Autocorrelation exists in volatility (not returns) |

These limitations motivate extensions like stochastic volatility models, jump-diffusion models, and GARCH processes, which you will encounter later in this course.

### Key Takeaway

Brownian motion is the mathematical engine behind nearly all pricing models in finance. Understanding its properties — especially the square root of time rule and the distinction between arithmetic and geometric Brownian motion — is essential for everything that follows.`,
    },
    {
      id: "qf-probability-distributions",
      slug: "probability-distributions-finance",
      title: "Probability Distributions in Finance",
      content: `## Probability Distributions in Finance

Financial modeling requires a deep understanding of probability distributions. Every pricing model, risk metric, and trading strategy implicitly assumes some distribution for returns, prices, or volatility. Choosing the wrong distribution can lead to catastrophic underestimation of risk.

### The Normal Distribution

The normal (Gaussian) distribution is the starting point for most financial models. It is characterized by two parameters: the mean (mu) and the standard deviation (sigma).

\`\`\`
f(x) = (1 / (sigma * sqrt(2*pi))) * exp(-(x-mu)^2 / (2*sigma^2))
\`\`\`

**Why finance uses it:** The Central Limit Theorem tells us that the sum of many independent random variables approaches a normal distribution. Since daily returns are influenced by millions of independent decisions, normal returns are a reasonable first approximation.

**Where it fails:** Real financial returns have **fat tails** — extreme events occur far more frequently than the normal distribution predicts. The 2008 financial crisis, for example, was a "25-sigma event" under normal assumptions, meaning it should occur approximately once every 10^135 years. Obviously, the assumption was wrong.

### The Log-Normal Distribution

If log-returns are normally distributed, then prices follow a **log-normal distribution**. This is the distribution implied by geometric Brownian motion:

\`\`\`
S(T) = S(0) * exp((mu - sigma^2/2)*T + sigma*sqrt(T)*Z)
\`\`\`

where Z is standard normal.

Key properties of the log-normal distribution:
- Always positive (suitable for prices)
- Right-skewed (long right tail)
- The mean exceeds the median (important for expected returns)
- The Black-Scholes model assumes stock prices are log-normal

### Fat-Tailed Distributions

To address the shortcomings of the normal distribution, quants use several alternatives:

| Distribution | Key Feature | Use Case |
|--------------|-------------|----------|
| **Student's t** | Heavier tails, controlled by degrees of freedom | Risk modeling with more realistic tail behavior |
| **Generalized Extreme Value (GEV)** | Models the distribution of maximum losses | Extreme risk analysis |
| **Stable (Levy)** | Allows infinite variance | Mandelbrot's model of speculative prices |
| **Mixture of normals** | Combines multiple regimes | Modeling calm vs. crisis periods |

### Empirical Return Distributions

Let us examine what real returns look like:

\`\`\`python
import numpy as np
from scipy import stats

# Simulate "realistic" returns with fat tails
np.random.seed(42)
normal_returns = np.random.normal(0.0005, 0.01, 10000)
t_returns = stats.t.rvs(df=5, loc=0.0005, scale=0.008, size=10000)

# Compare tail probabilities
# P(return < -3%) under each distribution
normal_tail = np.mean(normal_returns < -0.03)
t_tail = np.mean(t_returns < -0.03)

print(f"Normal: P(r < -3%) = {normal_tail:.4f}")
print(f"Student-t (df=5): P(r < -3%) = {t_tail:.4f}")
\`\`\`

In practice, the Student-t distribution with 3 to 7 degrees of freedom fits equity return data much better than the normal distribution, especially in the tails.

### Skewness and the Asymmetry of Returns

Equity returns are typically **negatively skewed** — large negative returns are more likely than large positive returns of the same magnitude. This creates challenges for risk management because:

- Standard deviation treats upside and downside equally
- Investors care much more about downside risk
- Options markets price in this asymmetry through the volatility smile

### Multi-Asset Distributions: The Copula Approach

When modeling portfolios, you need the **joint distribution** of multiple asset returns. The correlation matrix captures linear dependence, but real assets can have:

- **Tail dependence** — assets that are uncorrelated in normal times become highly correlated during crises
- **Non-linear dependence** — correlation only measures linear relationships

**Copulas** separate the marginal distributions of individual assets from their dependence structure. The most common copulas in finance are the Gaussian copula (used extensively in structured credit, famously implicated in the 2008 crisis) and the Student-t copula (which captures tail dependence).

### Practical Implications for Risk Management

The choice of distribution directly affects risk metrics:

- Under normal assumptions, 99% VaR = 2.33 * sigma
- Under Student-t (df=5), 99% VaR = 3.37 * sigma — a 45% increase
- This difference becomes even more extreme at the 99.9% level used by banks for regulatory capital

### Key Takeaway

The normal distribution is a convenient starting point, but understanding its limitations and knowing when to use fat-tailed alternatives is essential for accurate risk measurement and sound financial modeling. Always validate your distributional assumptions against empirical data.`,
    },
    {
      id: "qf-statistical-concepts",
      slug: "statistical-concepts-finance",
      title: "Statistical Concepts for Finance",
      content: `## Statistical Concepts for Finance

Finance is inherently about uncertainty, and statistics provides the tools to measure, describe, and make decisions under uncertainty. This lesson covers the core statistical concepts that appear throughout quantitative finance: the four moments of a distribution, correlation, regression, and time series stationarity.

### The Four Moments

Every distribution can be characterized by its **moments**, which describe its shape:

**1. Mean (First Moment)** — The expected value or average return. For a sample of n returns:

\`\`\`
mean = (1/n) * sum(r_i)
\`\`\`

In finance, the mean return is the expected reward for holding an asset. Annual equity returns have historically averaged around 8-10% for the S&P 500.

**2. Variance and Standard Deviation (Second Moment)** — Measures the dispersion of returns around the mean:

\`\`\`
variance = (1/(n-1)) * sum((r_i - mean)^2)
std_dev = sqrt(variance)
\`\`\`

In finance, standard deviation is called **volatility** and is the most common risk measure. Annual S&P 500 volatility is typically 15-20%.

**3. Skewness (Third Moment)** — Measures asymmetry:

\`\`\`
skewness = (1/n) * sum(((r_i - mean)/std_dev)^3)
\`\`\`

- Skewness = 0: symmetric (normal distribution)
- Skewness < 0: left tail is longer (equity returns are typically negatively skewed)
- Skewness > 0: right tail is longer (some commodities, venture capital returns)

**4. Kurtosis (Fourth Moment)** — Measures the heaviness of tails:

\`\`\`
kurtosis = (1/n) * sum(((r_i - mean)/std_dev)^4)
\`\`\`

- Kurtosis = 3: normal distribution (mesokurtic)
- Kurtosis > 3: fat tails, more extreme events than normal (leptokurtic)
- Kurtosis < 3: thin tails, fewer extremes (platykurtic)

Financial returns almost always exhibit **excess kurtosis** (kurtosis > 3), meaning extreme events occur more often than a normal model predicts.

### Computing Moments in Python

\`\`\`python
import numpy as np
from scipy import stats

# Sample data: daily returns
np.random.seed(42)
returns = np.random.standard_t(df=5, size=1000) * 0.01

print(f"Mean:     {np.mean(returns):.6f}")
print(f"Std Dev:  {np.std(returns, ddof=1):.6f}")
print(f"Skewness: {stats.skew(returns):.4f}")
print(f"Kurtosis: {stats.kurtosis(returns, fisher=True):.4f}")
# fisher=True gives excess kurtosis (0 for normal)
\`\`\`

### Correlation and Covariance

**Covariance** measures how two variables move together:

\`\`\`
cov(X, Y) = (1/(n-1)) * sum((x_i - mean_x)(y_i - mean_y))
\`\`\`

**Correlation** normalizes covariance to a [-1, 1] scale:

\`\`\`
corr(X, Y) = cov(X, Y) / (std_x * std_y)
\`\`\`

In portfolio theory, the correlation matrix is the key input for diversification. Low or negative correlations between assets reduce portfolio risk. However, correlations are **not constant** — they tend to increase during market crises, precisely when diversification is most needed. This phenomenon is called **correlation breakdown**.

### Stationarity

A time series is **stationary** if its statistical properties (mean, variance, autocorrelation) do not change over time. This is a crucial concept because:

- Most statistical tests assume stationarity
- Stock prices are **non-stationary** (they trend upward over time)
- Stock **returns** are approximately stationary (at least weakly)
- Interest rates, volatility, and exchange rates may or may not be stationary

The Augmented Dickey-Fuller (ADF) test is the standard method for testing stationarity. If a series is non-stationary, you typically transform it by taking differences (returns) or log-differences (log-returns).

### Regression in Finance

Linear regression is used extensively in finance:

- **CAPM beta** is the slope coefficient from regressing asset returns on market returns
- **Factor models** regress returns on multiple factors (market, size, value, momentum)
- **Pairs trading** uses regression to find cointegrated pairs of stocks

\`\`\`python
# Computing CAPM beta
# beta = cov(r_stock, r_market) / var(r_market)
stock_returns = np.random.normal(0.001, 0.02, 252)
market_returns = np.random.normal(0.0005, 0.01, 252)
beta = np.cov(stock_returns, market_returns)[0, 1] / np.var(market_returns, ddof=1)
print(f"CAPM Beta: {beta:.4f}")
\`\`\`

### Key Takeaway

The four moments (mean, variance, skewness, kurtosis) describe the full shape of return distributions. Correlation drives portfolio construction. Stationarity determines which statistical tools are valid. These concepts reappear in every area of quantitative finance — mastering them now will pay dividends throughout this course.`,
    },
    {
      id: "qf-efficient-market-hypothesis",
      slug: "efficient-market-hypothesis",
      title: "The Efficient Market Hypothesis",
      content: `## The Efficient Market Hypothesis

The Efficient Market Hypothesis (EMH) is one of the most important — and most debated — ideas in finance. Proposed by Eugene Fama in his 1970 paper, it asserts that asset prices fully reflect all available information. If true, consistently beating the market through skill alone is impossible.

### Three Forms of Market Efficiency

Fama defined three levels of market efficiency, each incorporating a broader set of information:

**1. Weak Form Efficiency**

Prices reflect all **past trading data** — historical prices, volumes, and returns. This implies:
- Technical analysis (chart patterns, moving averages) cannot generate excess returns
- Past price movements contain no information about future prices
- This is the most widely accepted form of EMH

**2. Semi-Strong Form Efficiency**

Prices reflect all **publicly available information** — financial statements, earnings announcements, economic data, news. This implies:
- Fundamental analysis cannot generate excess returns
- Prices adjust immediately to new public information
- Event studies generally support this form (prices adjust within minutes of earnings releases)

**3. Strong Form Efficiency**

Prices reflect **all information, including private/insider information**. This implies:
- Even insiders cannot earn excess returns
- This is the most extreme and least supported form
- The existence of insider trading regulations (and convictions) suggests markets are not strong-form efficient

### Evidence For EMH

Several empirical findings support the EMH:

| Evidence | Description |
|----------|-------------|
| **Random walk behavior** | Short-term stock returns are nearly unpredictable; autocorrelations are close to zero |
| **Active fund underperformance** | The majority (roughly 85-90%) of actively managed funds underperform their benchmark index over 15-year periods |
| **Rapid price adjustment** | Markets incorporate earnings surprises, M&A announcements, and macro data within minutes |
| **Professional forecasting failures** | Equity analyst forecasts are, on average, no more accurate than simple statistical models |

Warren Buffett famously quipped that he would be "a bum on the street with a tin cup" if markets were truly efficient, yet the data shows his track record is an extreme outlier — consistent with the EMH prediction that a few investors will outperform by luck alone.

### Evidence Against EMH

The EMH has been challenged by a growing body of research documenting **market anomalies**:

- **Momentum effect** — Stocks that have performed well over the past 3-12 months tend to continue performing well. First documented by Jegadeesh and Titman (1993), it has been confirmed across multiple markets and time periods.
- **Value premium** — Stocks with low price-to-book ratios tend to outperform growth stocks over long horizons (Fama and French, 1992).
- **Post-earnings announcement drift** — Stocks that beat earnings expectations continue to drift upward for weeks after the announcement, suggesting prices do not adjust instantaneously.
- **Volatility clustering** — Periods of high volatility cluster together, violating the assumption that returns are independently distributed.
- **Behavioral biases** — Investors systematically overreact to bad news, underreact to good news, and exhibit herding behavior.

### The Adaptive Markets Hypothesis

Andrew Lo of MIT proposed the **Adaptive Markets Hypothesis (AMH)** as a middle ground. AMH applies evolutionary principles to financial markets:

- Market efficiency varies over time as competition, regulation, and technology evolve
- Arbitrage opportunities appear and are competed away, but new ones emerge
- Different strategies work in different market regimes
- Behavioral biases exist but are moderated by learning and selection pressure

This framework explains why some anomalies persist for decades while others disappear once published in academic journals — the very act of documenting an anomaly attracts capital that trades it away.

### Implications for Quants

The EMH debate has direct practical implications:

\`\`\`python
# The EMH in practice: testing for return predictability
import numpy as np
from scipy import stats

np.random.seed(42)
returns = np.random.normal(0.0003, 0.01, 1000)  # simulated daily returns

# Autocorrelation at lag 1 (if EMH holds, should be ~0)
autocorr = np.corrcoef(returns[:-1], returns[1:])[0, 1]
print(f"Lag-1 autocorrelation: {autocorr:.4f}")

# Runs test: are up/down sequences random?
signs = np.sign(returns)
n_runs = 1 + np.sum(signs[1:] != signs[:-1])
print(f"Number of runs: {n_runs}")
print(f"Expected runs (random): {len(returns)/2:.0f}")
\`\`\`

If markets are efficient, then **risk management** and **transaction cost minimization** are more valuable than return prediction. If markets are somewhat inefficient, then statistical models and machine learning can potentially capture alpha — but only with rigorous backtesting to avoid overfitting.

### Key Takeaway

The truth lies between the extremes. Markets are highly competitive and reasonably efficient, but not perfectly so. Anomalies exist but are difficult and expensive to exploit. Understanding the EMH helps you calibrate expectations: beating the market is possible but extremely difficult, and any strategy that claims to do so must be tested rigorously against the null hypothesis of market efficiency.`,
    },
  ],
};
