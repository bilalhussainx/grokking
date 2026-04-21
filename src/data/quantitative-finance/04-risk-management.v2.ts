import { Module } from "../types";

export const riskManagementModule: Module = {
  id: "qf-risk",
  title: "Risk Management",
  description: "Learn the quantitative tools for measuring and managing financial risk — Value at Risk, Expected Shortfall, stress testing, credit risk, and operational risk.",
  lessons: [
    {
      id: "qf-var",
      slug: "value-at-risk",
      title: "Value at Risk (VaR)",
      content: `## Value at Risk (VaR)

**Value at Risk** is the single most widely used risk measure in finance. It answers a simple question: "What is the maximum loss we can expect over a given time horizon at a given confidence level?" VaR is used by banks for regulatory capital requirements, by fund managers for risk budgeting, and by corporate treasurers for exposure management.

### Definition

VaR at confidence level alpha over horizon T is the loss level that will not be exceeded with probability alpha:

\`\`\`
P(Loss > VaR) = 1 - alpha
\`\`\`

For example, a 1-day 99% VaR of $10 million means: "There is a 99% probability that the portfolio will not lose more than $10 million over the next trading day." Equivalently, we expect to exceed this loss about 2-3 times per year (1% of approximately 252 trading days).

### Three Methods for Computing VaR

**1. Parametric (Variance-Covariance) VaR**

Assumes returns are normally distributed. The VaR is computed directly from the portfolio's mean and standard deviation:

\`\`\`
VaR = -mu + z_alpha * sigma
\`\`\`

where z_alpha is the standard normal quantile (2.326 for 99%, 1.645 for 95%).

For a portfolio:
\`\`\`
sigma_portfolio = sqrt(w' * Sigma * w)
\`\`\`

where w is the vector of portfolio weights and Sigma is the covariance matrix.

**Pros:** Fast, easy to compute, works well for linear portfolios.
**Cons:** Assumes normality (underestimates tail risk), does not capture option nonlinearity.

**2. Historical Simulation VaR**

Uses actual historical returns to build the loss distribution. Sort the historical P&L from worst to best, and the VaR is the (1-alpha) percentile.

**Pros:** No distributional assumptions, captures fat tails and nonlinearity.
**Cons:** Limited by historical data (if the sample does not contain a crisis, the VaR will be too low), assumes the past is representative of the future.

**3. Monte Carlo Simulation VaR**

Generates thousands of simulated portfolio returns from a specified model (which can include fat tails, stochastic volatility, correlations, and option payoffs), then computes the VaR from the simulated distribution.

**Pros:** Most flexible — can handle any distribution, any instrument, any nonlinearity.
**Cons:** Computationally expensive, model-dependent (garbage in, garbage out).

### Python Implementation

\`\`\`python
import numpy as np

def parametric_var(returns, confidence=0.99):
    """Parametric VaR assuming normal distribution."""
    mu = np.mean(returns)
    sigma = np.std(returns, ddof=1)
    from scipy.stats import norm
    z = norm.ppf(1 - confidence)
    var = -(mu + z * sigma)
    return var

def historical_var(returns, confidence=0.99):
    """Historical simulation VaR."""
    sorted_returns = np.sort(returns)
    index = int((1 - confidence) * len(sorted_returns))
    var = -sorted_returns[index]
    return var

def monte_carlo_var(S0, mu, sigma, T, n_sims, confidence=0.99):
    """Monte Carlo VaR for a single asset."""
    np.random.seed(42)
    Z = np.random.standard_normal(n_sims)
    ST = S0 * np.exp((mu - 0.5*sigma**2)*T + sigma*np.sqrt(T)*Z)
    pnl = ST - S0
    sorted_pnl = np.sort(pnl)
    index = int((1 - confidence) * n_sims)
    var = -sorted_pnl[index]
    return var

# Example: compute VaR three ways
np.random.seed(42)
returns = np.random.standard_t(df=5, size=1000) * 0.01

print(f"Parametric VaR (99%):  {parametric_var(returns):.4f}")
print(f"Historical VaR (99%):  {historical_var(returns):.4f}")
print(f"Monte Carlo VaR (99%): {monte_carlo_var(100, 0.0, 0.16, 1/252, 100000):.4f}")
\`\`\`

### VaR for Portfolios

For a multi-asset portfolio, the parametric method uses the covariance matrix:

\`\`\`python
def portfolio_var(weights, cov_matrix, portfolio_value, confidence=0.99):
    """Portfolio VaR using variance-covariance method."""
    from scipy.stats import norm
    port_variance = weights @ cov_matrix @ weights
    port_std = np.sqrt(port_variance)
    z = norm.ppf(confidence)
    var = portfolio_value * z * port_std
    return var
\`\`\`

### Limitations of VaR

VaR has several well-known weaknesses:

| Limitation | Explanation |
|-----------|-------------|
| **Not subadditive** | VaR of a combined portfolio can exceed the sum of individual VaRs (violates diversification logic) |
| **Ignores tail shape** | Two portfolios can have the same VaR but very different tail risks |
| **Confidence dependent** | The 95% VaR may look fine while the 99.9% VaR is catastrophic |
| **Procyclical** | VaR increases during crises, forcing position reductions that amplify selling |

These limitations led to the development of Expected Shortfall (CVaR), covered in the next lesson.

### Basel Regulatory Framework

The Basel Committee on Banking Supervision uses VaR as the basis for market risk capital requirements:
- Basel II: 10-day 99% VaR, multiplied by a safety factor of 3
- Basel III (FRTB): Shifted to Expected Shortfall at 97.5% confidence for the trading book

### Key Takeaway

VaR provides a single, intuitive number that summarizes portfolio risk. While imperfect, it remains the industry standard for risk communication, limit setting, and regulatory capital computation. Understanding its three computation methods and their tradeoffs is essential for any risk management role.`,
      starterCode: `import numpy as np
from scipy.stats import norm

def parametric_var(returns, confidence=0.99):
    """
    Calculate parametric (variance-covariance) VaR.

    Parameters:
    -----------
    returns : np.array - Array of historical returns
    confidence : float - Confidence level (e.g., 0.99 for 99%)

    Returns:
    --------
    float - VaR as a positive number (loss amount)
    """
    # TODO: Calculate mean and standard deviation of returns
    mu = 0
    sigma = 0

    # TODO: Find the z-score for the given confidence level
    z = 0

    # TODO: Calculate VaR = -(mu + z * sigma)
    var = 0

    return var


def historical_var(returns, confidence=0.99):
    """
    Calculate historical simulation VaR.

    Parameters:
    -----------
    returns : np.array - Array of historical returns
    confidence : float - Confidence level

    Returns:
    --------
    float - VaR as a positive number
    """
    # TODO: Sort returns from worst to best
    # TODO: Find the (1-confidence) percentile
    # TODO: Return VaR as a positive number
    var = 0

    return var


def monte_carlo_var(S0, mu, sigma, T, n_sims=100000, confidence=0.99):
    """
    Calculate Monte Carlo VaR for a single asset using GBM.

    Parameters:
    -----------
    S0 : float - Initial asset price
    mu : float - Expected return (annualized)
    sigma : float - Volatility (annualized)
    T : float - Time horizon in years
    n_sims : int - Number of simulations
    confidence : float - Confidence level

    Returns:
    --------
    float - VaR as a positive number (dollar loss)
    """
    # TODO: Generate random standard normal samples
    # TODO: Simulate terminal prices using GBM formula
    # TODO: Calculate P&L = ST - S0
    # TODO: Find the (1-confidence) percentile of P&L
    var = 0

    return var


# Test with synthetic data
np.random.seed(42)
daily_returns = np.random.standard_t(df=5, size=1000) * 0.01

print("=== VaR Calculation Results ===")
print(f"Parametric VaR (99%):  {parametric_var(daily_returns):.6f}")
print(f"Historical VaR (99%):  {historical_var(daily_returns):.6f}")

mc_var = monte_carlo_var(S0=100, mu=0.08, sigma=0.20, T=1/252)
print(f"Monte Carlo VaR (99%, 1-day, $100 position): \${mc_var:.2f}")
`,
      solutionCode: `import numpy as np
from scipy.stats import norm

def parametric_var(returns, confidence=0.99):
    """
    Calculate parametric (variance-covariance) VaR.
    """
    mu = np.mean(returns)
    sigma = np.std(returns, ddof=1)
    z = norm.ppf(1 - confidence)
    var = -(mu + z * sigma)
    return var


def historical_var(returns, confidence=0.99):
    """
    Calculate historical simulation VaR.
    """
    sorted_returns = np.sort(returns)
    index = int((1 - confidence) * len(sorted_returns))
    var = -sorted_returns[index]
    return var


def monte_carlo_var(S0, mu, sigma, T, n_sims=100000, confidence=0.99):
    """
    Calculate Monte Carlo VaR for a single asset using GBM.
    """
    np.random.seed(42)
    Z = np.random.standard_normal(n_sims)
    ST = S0 * np.exp((mu - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)
    pnl = ST - S0
    sorted_pnl = np.sort(pnl)
    index = int((1 - confidence) * n_sims)
    var = -sorted_pnl[index]
    return var


# Test with synthetic data
np.random.seed(42)
daily_returns = np.random.standard_t(df=5, size=1000) * 0.01

print("=== VaR Calculation Results ===")
print(f"Parametric VaR (99%):  {parametric_var(daily_returns):.6f}")
print(f"Historical VaR (99%):  {historical_var(daily_returns):.6f}")

mc_var = monte_carlo_var(S0=100, mu=0.08, sigma=0.20, T=1/252)
print(f"Monte Carlo VaR (99%, 1-day, $100 position): \${mc_var:.2f}")
`,
    },
    {
      id: "qf-expected-shortfall",
      slug: "expected-shortfall-cvar",
      title: "Expected Shortfall (CVaR)",
      content: `## Expected Shortfall (CVaR)

**Expected Shortfall** (ES), also known as **Conditional Value at Risk (CVaR)**, addresses the key weakness of VaR by answering: "If we do exceed the VaR, how bad is it on average?" While VaR tells you the threshold, ES tells you the average loss in the worst-case scenarios.

### Definition

Expected Shortfall at confidence level alpha is the expected loss given that the loss exceeds the VaR:

\`\`\`
ES = E[Loss | Loss > VaR]
\`\`\`

For a 99% ES, this is the average of the worst 1% of outcomes. ES is always greater than or equal to VaR at the same confidence level.

### Why ES is Superior to VaR

**VaR's blind spot:** Consider two portfolios, both with a 99% VaR of $10 million. Portfolio A's worst 1% of losses range from $10M to $12M. Portfolio B's worst 1% of losses range from $10M to $500M (it contains concentrated tail risk). VaR treats these identically, but ES reveals the difference.

**Subadditivity:** ES satisfies the subadditivity property that VaR violates:

\`\`\`
ES(A + B) <= ES(A) + ES(B)
\`\`\`

This means diversification always reduces (or at least does not increase) the ES of a combined portfolio. This is a mathematically desirable property that makes ES a **coherent risk measure** (as defined by Artzner et al., 1999).

### Computing Expected Shortfall

**Historical method:**
\`\`\`python
import numpy as np

def historical_es(returns, confidence=0.99):
    """Expected Shortfall from historical returns."""
    sorted_returns = np.sort(returns)
    cutoff_index = int((1 - confidence) * len(sorted_returns))
    tail_losses = sorted_returns[:cutoff_index]
    es = -np.mean(tail_losses)
    return es

np.random.seed(42)
returns = np.random.standard_t(df=5, size=10000) * 0.01

var_99 = -np.percentile(returns, 1)
es_99 = historical_es(returns, 0.99)

print(f"99% VaR: {var_99:.4f}")
print(f"99% ES:  {es_99:.4f}")
print(f"ES/VaR ratio: {es_99/var_99:.2f}")
\`\`\`

**Parametric method (normal distribution):**

Under the normal distribution:
\`\`\`
ES = mu + sigma * phi(z_alpha) / (1 - alpha)
\`\`\`

where phi is the standard normal density and z_alpha is the quantile.

**Monte Carlo method:** Simply average the worst (1-alpha) fraction of simulated outcomes:

\`\`\`python
def monte_carlo_es(S0, mu, sigma, T, n_sims=100000, confidence=0.99):
    """Monte Carlo Expected Shortfall."""
    np.random.seed(42)
    Z = np.random.standard_normal(n_sims)
    ST = S0 * np.exp((mu - 0.5*sigma**2)*T + sigma*np.sqrt(T)*Z)
    pnl = ST - S0
    sorted_pnl = np.sort(pnl)
    cutoff = int((1 - confidence) * n_sims)
    es = -np.mean(sorted_pnl[:cutoff])
    return es
\`\`\`

### VaR vs. ES Comparison

| Property | VaR | ES (CVaR) |
|----------|-----|-----------|
| Interpretation | Threshold loss | Average loss in the tail |
| Subadditive | No | Yes |
| Tail sensitivity | None (ignores tail shape) | Full (averages entire tail) |
| Coherent risk measure | No | Yes |
| Regulatory adoption | Basel II/III market risk | Basel III FRTB (2023+) |
| Backtesting | Easy (count exceedances) | Harder (need to verify conditional mean) |

### ES in Portfolio Optimization

Because ES is convex and subadditive, it can be used directly in portfolio optimization. **Mean-CVaR optimization** minimizes CVaR for a given expected return, analogous to mean-variance optimization but with a more realistic risk measure:

\`\`\`python
# Conceptual framework for mean-CVaR optimization
# (Full implementation requires linear programming)

def portfolio_es(weights, returns_matrix, confidence=0.95):
    """Compute portfolio ES from historical return scenarios."""
    portfolio_returns = returns_matrix @ weights
    sorted_returns = np.sort(portfolio_returns)
    cutoff = int((1 - confidence) * len(sorted_returns))
    es = -np.mean(sorted_returns[:cutoff])
    return es
\`\`\`

### The ES/VaR Ratio

For a normal distribution, the ratio ES/VaR at 99% confidence is approximately 1.15. For fat-tailed distributions (Student-t with low degrees of freedom), this ratio can be 1.5 or higher. A high ES/VaR ratio signals that tail risk is concentrated — losses in the worst 1% of scenarios are much worse than the VaR threshold suggests.

### Regulatory Shift: Basel III FRTB

The Basel Committee's Fundamental Review of the Trading Book (FRTB) replaced VaR with ES as the primary market risk measure:
- **Old standard:** 10-day 99% VaR
- **New standard:** 10-day 97.5% ES

The shift to 97.5% ES produces risk numbers comparable in magnitude to 99% VaR but with better tail sensitivity and subadditivity.

### Key Takeaway

Expected Shortfall answers the question VaR ignores: "How bad can it get?" As a coherent risk measure, it properly accounts for diversification and tail risk concentration. Its adoption by Basel III signals the industry's recognition that understanding the full tail — not just a single quantile — is essential for sound risk management.`,
    },
    {
      id: "qf-stress-testing",
      slug: "risk-metrics-stress-testing",
      title: "Risk Metrics & Stress Testing",
      content: `## Risk Metrics & Stress Testing

VaR and ES capture risk under "normal" market conditions. But financial crises are precisely the scenarios where standard risk models fail — correlations spike, volatility explodes, and liquidity evaporates. **Stress testing** examines portfolio behavior under extreme but plausible scenarios, providing a critical complement to statistical risk measures.

### Common Risk Metrics Beyond VaR

**Maximum Drawdown:** The largest peak-to-trough decline in portfolio value. It measures the worst cumulative loss an investor would have experienced.

\`\`\`python
import numpy as np

def max_drawdown(returns):
    """Calculate maximum drawdown from a return series."""
    cumulative = np.cumprod(1 + returns)
    running_max = np.maximum.accumulate(cumulative)
    drawdowns = (cumulative - running_max) / running_max
    return np.min(drawdowns)

np.random.seed(42)
returns = np.random.normal(0.0003, 0.01, 1000)
mdd = max_drawdown(returns)
print(f"Maximum Drawdown: {mdd:.2%}")
\`\`\`

**Sharpe Ratio:** Risk-adjusted return — excess return per unit of volatility:
\`\`\`
Sharpe = (R_portfolio - R_risk_free) / sigma_portfolio
\`\`\`

**Sortino Ratio:** Like Sharpe but uses only downside deviation, recognizing that investors penalize losses more than they reward gains.

**Tracking Error:** Standard deviation of the difference between portfolio and benchmark returns. Used to evaluate active manager performance.

### Types of Stress Tests

**1. Historical Stress Tests**

Apply actual historical crisis scenarios to the current portfolio:

| Event | Date | Key Moves |
|-------|------|-----------|
| Black Monday | Oct 1987 | S&P 500 -22.6% in one day |
| LTCM Crisis | Aug-Sep 1998 | Credit spreads +200bps, equity -20% |
| Dot-com Crash | Mar 2000 - Oct 2002 | Nasdaq -78% |
| Global Financial Crisis | Sep 2008 - Mar 2009 | S&P -57%, credit freeze |
| COVID Crash | Feb-Mar 2020 | S&P -34% in 23 trading days |

**2. Hypothetical Stress Tests**

Construct plausible but unprecedented scenarios:

\`\`\`python
def apply_stress_scenario(portfolio_value, asset_weights, shocks):
    """
    Apply a stress scenario to a portfolio.
    shocks: dict mapping asset class to percentage shock
    """
    stressed_value = portfolio_value
    details = {}

    for asset, weight in asset_weights.items():
        shock = shocks.get(asset, 0)
        loss = portfolio_value * weight * shock
        stressed_value += loss
        details[asset] = loss

    total_loss = stressed_value - portfolio_value
    pct_loss = total_loss / portfolio_value

    return {
        "original_value": portfolio_value,
        "stressed_value": stressed_value,
        "total_loss": total_loss,
        "pct_loss": pct_loss,
        "details": details,
    }

# Example: Stagflation scenario
portfolio = 100_000_000
weights = {"equities": 0.60, "bonds": 0.30, "commodities": 0.10}
stagflation = {"equities": -0.25, "bonds": -0.10, "commodities": 0.15}

result = apply_stress_scenario(portfolio, weights, stagflation)
print(f"Stressed value: \${result['stressed_value']:,.0f}")
print(f"Total loss: \${result['total_loss']:,.0f} ({result['pct_loss']:.1%})")
\`\`\`

**3. Sensitivity Analysis (Factor Stress Tests)**

Systematically vary one or more risk factors:
- Shift interest rates +/- 100, 200, 300 basis points
- Change equity markets +/- 10%, 20%, 30%
- Widen credit spreads by 50, 100, 200 bps
- Increase volatility by 50%, 100%, 200%

### Reverse Stress Testing

Rather than asking "What happens if X occurs?", reverse stress testing asks: "What scenario would cause the firm to fail?" This identifies the specific vulnerabilities that pose existential risk.

Steps:
1. Define the failure threshold (e.g., capital falls below regulatory minimum)
2. Work backward to find scenarios that breach this threshold
3. Assess the plausibility of those scenarios
4. Develop contingency plans

### Regulatory Stress Testing

Post-2008 regulations mandate regular stress tests for large banks:

- **CCAR/DFAST (US):** The Federal Reserve runs annual stress tests on the largest US banks using macro scenarios (severe recession, market shock, counterparty default)
- **EBA Stress Tests (EU):** European Banking Authority tests EU banks biennially
- **Bank of England:** Annual Concurrent Stress Test

These tests determine whether banks have sufficient capital to absorb losses under stress and whether they can continue lending.

### Integrating Risk Metrics

A comprehensive risk framework combines multiple measures:

| Metric | Answers | Time Horizon |
|--------|---------|--------------|
| VaR | How much can we lose on a normal day? | 1-10 days |
| ES/CVaR | How bad is the average bad day? | 1-10 days |
| Stress tests | How bad if a crisis hits? | Crisis duration |
| Max drawdown | What is the worst cumulative loss? | Full history |
| Sharpe/Sortino | Are we being compensated for risk? | Annualized |

### Key Takeaway

No single risk metric tells the full story. VaR and ES provide statistical estimates of normal-conditions risk. Stress testing reveals vulnerabilities that statistical models miss. Maximum drawdown grounds the analysis in historical experience. Together, these tools create a layered defense against financial loss. The best risk managers use all of them and maintain healthy skepticism about any single number.`,
    },
    {
      id: "qf-credit-risk",
      slug: "credit-risk-models",
      title: "Credit Risk Models",
      content: `## Credit Risk Models

**Credit risk** is the risk that a borrower fails to meet their financial obligations — a default. It is the largest source of risk for most banks and a critical consideration for bond investors, derivative counterparties, and anyone who extends credit. Quantifying credit risk requires models that estimate the probability of default, the loss given default, and the exposure at default.

### The Three Components of Credit Loss

Expected credit loss is the product of three components:

\`\`\`
Expected Loss = PD x LGD x EAD
\`\`\`

| Component | Definition | Typical Range |
|-----------|-----------|---------------|
| **PD** (Probability of Default) | Likelihood of default over a given horizon | 0.01% (AAA) to 20%+ (CCC) |
| **LGD** (Loss Given Default) | Percentage of exposure lost if default occurs | 20-80% depending on seniority |
| **EAD** (Exposure at Default) | Amount owed at the time of default | Depends on facility type |

### Structural Models: Merton's Model

Robert Merton (1974) applied Black-Scholes to credit risk by modeling a firm's equity as a **call option on its assets**. The key insight: equity holders own the firm's assets but owe a fixed amount to debt holders. If assets fall below the debt level, the firm defaults.

\`\`\`
Equity = max(Assets - Debt, 0)   (call option payoff!)
\`\`\`

\`\`\`python
import numpy as np
from scipy.stats import norm

def merton_default_prob(V, D, r, sigma_V, T):
    """
    Merton model: probability of default.
    V: current asset value
    D: face value of debt
    r: risk-free rate
    sigma_V: asset volatility
    T: time to maturity of debt
    """
    d2 = (np.log(V/D) + (r - 0.5*sigma_V**2)*T) / (sigma_V*np.sqrt(T))
    pd = norm.cdf(-d2)  # probability that assets < debt at T
    return pd

# Example: Firm with assets = $100M, debt = $80M
pd = merton_default_prob(V=100, D=80, r=0.05, sigma_V=0.25, T=1.0)
print(f"1-year default probability: {pd:.4%}")

# Stressed firm: assets = $90M (closer to debt)
pd_stressed = merton_default_prob(V=90, D=80, r=0.05, sigma_V=0.25, T=1.0)
print(f"Stressed default probability: {pd_stressed:.4%}")
\`\`\`

**Distance to Default (DD):** The number of standard deviations the firm's asset value is above the default point:
\`\`\`
DD = (ln(V/D) + (mu - sigma_V^2/2)*T) / (sigma_V * sqrt(T))
\`\`\`

A lower DD indicates higher default risk. KMV (now Moody's Analytics) commercialized this concept as the Expected Default Frequency (EDF).

### Reduced-Form Models

Unlike structural models that model the firm's assets directly, **reduced-form models** treat default as a random event governed by a hazard rate (intensity). The firm defaults at the first arrival of a Poisson process with intensity lambda(t).

\`\`\`
P(no default by time T) = exp(-integral from 0 to T of lambda(s) ds)
\`\`\`

For constant hazard rate:
\`\`\`
P(default by T) = 1 - exp(-lambda * T)
\`\`\`

Reduced-form models are more tractable for pricing credit derivatives (CDS, credit-linked notes) and are the industry standard for credit portfolio modeling.

### Credit Ratings and Transition Matrices

Rating agencies (Moody's, S&P, Fitch) assign credit ratings that map to historical default probabilities:

| Rating | 1-Year PD | 5-Year Cumulative PD |
|--------|-----------|----------------------|
| AAA | 0.00% | 0.09% |
| AA | 0.02% | 0.28% |
| A | 0.05% | 0.67% |
| BBB | 0.18% | 2.40% |
| BB | 0.79% | 8.55% |
| B | 3.96% | 22.10% |
| CCC | 15.39% | 45.78% |

**Transition matrices** show the probability of moving between ratings over a one-year period. A BBB-rated firm might have a 90% probability of remaining BBB, a 4% probability of being upgraded to A, a 5% probability of being downgraded to BB, and a 1% probability of default.

### Credit Portfolio Models

For a portfolio of loans or bonds, the key challenge is modeling **default correlation** — the tendency for defaults to cluster. Two main approaches:

**CreditMetrics (J.P. Morgan):** Models asset value correlations using a factor model. Firms' asset values are driven by common (systematic) and idiosyncratic factors. High systematic exposure means defaults cluster during recessions.

**CreditRisk+ (Credit Suisse):** Uses a Poisson mixture model. Default rates are driven by random sector-level factors. More tractable for large portfolios.

### Key Credit Risk Metrics

| Metric | Description |
|--------|-------------|
| **Expected Loss (EL)** | Average loss over the horizon: PD x LGD x EAD |
| **Unexpected Loss (UL)** | Standard deviation or VaR of credit losses |
| **Credit VaR** | VaR applied to the credit loss distribution |
| **Credit Spread** | Yield premium demanded by the market for bearing credit risk |
| **Recovery Rate** | 1 - LGD; percentage of exposure recovered after default |

### Key Takeaway

Credit risk is modeled through the interplay of default probability, loss severity, and exposure. Structural models (Merton) provide economic intuition by linking default to asset values. Reduced-form models provide mathematical tractability for pricing. Both approaches require careful calibration and a recognition that default correlations — the tendency for defaults to cluster during crises — are the primary driver of portfolio credit risk.`,
    },
    {
      id: "qf-operational-risk",
      slug: "operational-risk",
      title: "Operational Risk",
      content: `## Operational Risk

**Operational risk** is the risk of loss resulting from inadequate or failed internal processes, people, systems, or external events. It encompasses everything from trading errors and IT failures to fraud, legal liability, and natural disasters. While less mathematically elegant than market or credit risk, operational risk has caused some of the largest financial losses in history.

### Notable Operational Risk Events

| Event | Year | Loss | Category |
|-------|------|------|----------|
| Barings Bank (Nick Leeson) | 1995 | $1.3 billion | Unauthorized trading |
| Societe Generale (Jerome Kerviel) | 2008 | $7.2 billion | Unauthorized trading |
| Knight Capital | 2012 | $440 million | Software deployment error |
| JPMorgan "London Whale" | 2012 | $6.2 billion | Risk management failure |
| Equifax data breach | 2017 | $1.4 billion | Cybersecurity failure |
| Wirecard fraud | 2020 | $2.1 billion | Accounting fraud |

These events share common themes: control failures, inadequate oversight, and systemic vulnerabilities that were not detected until catastrophic losses occurred.

### Basel Categories of Operational Risk

The Basel framework identifies seven categories:

1. **Internal fraud** — Unauthorized trading, theft, misrepresentation of positions
2. **External fraud** — Robbery, forgery, hacking, identity theft
3. **Employment practices** — Discrimination claims, workers' compensation, workplace safety violations
4. **Clients, products, and business practices** — Market manipulation, money laundering, product defects
5. **Damage to physical assets** — Natural disasters, terrorism, vandalism
6. **Business disruption and systems failures** — IT outages, software bugs, telecommunications failures
7. **Execution, delivery, and process management** — Data entry errors, accounting errors, failed settlements

### Measuring Operational Risk

Operational risk is inherently harder to quantify than market or credit risk because loss events are rare, the data is scarce, and the distribution is extremely fat-tailed (most losses are small, but occasional losses are enormous).

**Loss Distribution Approach (LDA):**

The most sophisticated approach models two components separately:
- **Frequency distribution:** How many loss events occur per year? (Poisson or negative binomial)
- **Severity distribution:** How large is each loss? (Lognormal, Weibull, or generalized Pareto)

The total loss distribution is the compound distribution of frequency and severity, typically estimated via Monte Carlo simulation.

\`\`\`python
import numpy as np

def simulate_operational_losses(n_years=10000, avg_events=5,
                                severity_mean=100000,
                                severity_std=500000):
    """
    Monte Carlo simulation of annual operational losses.
    Uses Poisson frequency and lognormal severity.
    """
    annual_losses = []

    # Lognormal parameters from mean and std
    mu_ln = np.log(severity_mean**2 / np.sqrt(severity_std**2 + severity_mean**2))
    sigma_ln = np.sqrt(np.log(1 + severity_std**2 / severity_mean**2))

    for _ in range(n_years):
        # Number of events this year
        n_events = np.random.poisson(avg_events)

        if n_events == 0:
            annual_losses.append(0)
        else:
            # Severity of each event
            losses = np.random.lognormal(mu_ln, sigma_ln, n_events)
            annual_losses.append(np.sum(losses))

    annual_losses = np.array(annual_losses)
    return annual_losses

np.random.seed(42)
losses = simulate_operational_losses()

print(f"Mean annual loss:   \${np.mean(losses):,.0f}")
print(f"Median annual loss: \${np.median(losses):,.0f}")
print(f"99% VaR:            \${np.percentile(losses, 99):,.0f}")
print(f"99.9% VaR:          \${np.percentile(losses, 99.9):,.0f}")
\`\`\`

### Key Risk Indicators (KRIs)

Since operational losses are difficult to predict statistically, organizations monitor leading indicators:

| KRI | What It Signals |
|-----|----------------|
| Number of failed trades | Process breakdowns |
| System downtime hours | Technology vulnerability |
| Staff turnover rate | Knowledge loss, morale issues |
| Audit findings count | Control weaknesses |
| Customer complaints | Product/service failures |
| Cybersecurity incidents | Technology risk exposure |

### Three Lines of Defense

The standard operational risk governance framework:

**First line:** Business units own and manage their operational risks. They implement controls, follow procedures, and report incidents.

**Second line:** Risk management and compliance functions set policies, define risk appetite, monitor KRIs, and challenge the first line.

**Third line:** Internal audit provides independent assurance that the first and second lines are functioning effectively.

### Cybersecurity as Operational Risk

Cybersecurity has become the dominant operational risk for many financial institutions. Key threats include ransomware, data breaches, DDoS attacks, and supply chain compromises. The financial sector is particularly targeted due to the direct monetary value of its systems and data.

### Basel Capital Requirements

Under Basel II/III, banks must hold capital against operational risk. Three approaches are available:

- **Basic Indicator Approach:** Capital = 15% of average annual gross income (simplest)
- **Standardized Approach:** Different multipliers for different business lines
- **Advanced Measurement Approach (AMA):** Banks use internal models (being replaced by the Standardized Measurement Approach under Basel III finalization)

### Key Takeaway

Operational risk is the "other" risk category — everything that is not market risk or credit risk. While harder to model, it has produced some of the largest losses in financial history. Effective operational risk management combines quantitative modeling (loss distribution approach), qualitative assessment (scenario analysis), and organizational controls (three lines of defense). The growing importance of cybersecurity has made operational risk management more critical than ever.`,
    },
  ],
};
