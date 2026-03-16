import { Module } from "../types";

export const portfolioTheoryModule: Module = {
  id: "qf-portfolio",
  title: "Portfolio Theory",
  description:
    "Master modern portfolio theory — mean-variance optimization, CAPM, multi-factor models, APT, and the Black-Litterman framework for combining quantitative models with investor views.",
  lessons: [
    {
      id: "qf-mean-variance",
      slug: "mean-variance-optimization",
      title: "Mean-Variance Optimization",
      content: `## Mean-Variance Optimization

Harry Markowitz's 1952 paper "Portfolio Selection" launched modern portfolio theory by formalizing the tradeoff between risk and return. Mean-variance optimization (MVO) remains the cornerstone of quantitative portfolio construction, used by pension funds, endowments, and robo-advisors managing trillions of dollars.

### The Core Idea

An investor holds N assets. Each asset has an expected return and a variance (risk). The key insight is that portfolio risk depends not just on individual asset risks, but on the **correlations** between assets. By combining assets with low or negative correlations, an investor can achieve better risk-adjusted returns than holding any single asset.

### Mathematical Formulation

For a portfolio with weight vector w, expected return vector mu, and covariance matrix Sigma:

\`\`\`
Portfolio return:    E[r_p] = w' * mu
Portfolio variance:  sigma_p^2 = w' * Sigma * w
\`\`\`

The optimization problem is:

\`\`\`
Minimize:    w' * Sigma * w
Subject to:  w' * mu = target_return
             w' * 1 = 1  (weights sum to 1)
             w >= 0       (optional: no short selling)
\`\`\`

### The Efficient Frontier

By solving this optimization for every possible target return, you trace out the **efficient frontier** — the set of portfolios that offer the highest expected return for each level of risk. Any portfolio below the frontier is suboptimal because you could achieve the same return with less risk (or more return with the same risk).

### Python Implementation

\`\`\`python
import numpy as np
from scipy.optimize import minimize

# Expected annual returns for 4 assets
mu = np.array([0.12, 0.10, 0.07, 0.03])

# Covariance matrix (annual)
Sigma = np.array([
    [0.0400, 0.0120, 0.0080, 0.0010],
    [0.0120, 0.0225, 0.0060, 0.0005],
    [0.0080, 0.0060, 0.0100, 0.0020],
    [0.0010, 0.0005, 0.0020, 0.0009]
])

def portfolio_volatility(weights, cov_matrix):
    return np.sqrt(weights @ cov_matrix @ weights)

def neg_sharpe(weights, mu, cov_matrix, rf=0.02):
    ret = weights @ mu
    vol = portfolio_volatility(weights, cov_matrix)
    return -(ret - rf) / vol

n = len(mu)
constraints = [{'type': 'eq', 'fun': lambda w: np.sum(w) - 1}]
bounds = [(0, 1) for _ in range(n)]
w0 = np.ones(n) / n

result = minimize(neg_sharpe, w0, args=(mu, Sigma),
                  method='SLSQP', bounds=bounds,
                  constraints=constraints)

opt_weights = result.x
opt_return = opt_weights @ mu
opt_vol = portfolio_volatility(opt_weights, Sigma)
sharpe = (opt_return - 0.02) / opt_vol

print(f"Optimal Weights: {np.round(opt_weights, 4)}")
print(f"Expected Return: {opt_return:.4f}")
print(f"Volatility:      {opt_vol:.4f}")
print(f"Sharpe Ratio:    {sharpe:.4f}")
\`\`\`

### Practical Challenges

MVO is elegant in theory but notoriously difficult in practice. The main issues are:

| Challenge | Description |
|-----------|-------------|
| **Estimation error** | Small errors in expected returns lead to wildly different optimal portfolios |
| **Concentration** | MVO tends to produce extreme allocations concentrated in a few assets |
| **Sensitivity** | The solution is highly sensitive to the covariance matrix estimate |
| **Single-period** | MVO is a one-period model that ignores rebalancing costs and multi-period dynamics |

**Regularization techniques** such as shrinkage estimators for the covariance matrix, maximum weight constraints, and robust optimization help mitigate these issues. The Ledoit-Wolf shrinkage estimator is particularly popular: it shrinks the sample covariance matrix toward a structured target, reducing estimation error.

### The Two-Fund Separation Theorem

Tobin's separation theorem states that every investor should hold a combination of the **risk-free asset** and the **tangency portfolio** (the portfolio on the efficient frontier with the highest Sharpe ratio). Conservative investors hold more of the risk-free asset; aggressive investors lever up the tangency portfolio. This is the theoretical foundation for index fund investing.

### Key Takeaway

Mean-variance optimization translates the intuition of diversification into a precise mathematical framework. While the raw optimizer is fragile, combining it with robust estimation techniques and practical constraints produces portfolios that form the basis of institutional asset management.`,
      starterCode: `import numpy as np
from scipy.optimize import minimize

# TODO: Define expected returns for 5 assets
mu = np.array([])

# TODO: Define a 5x5 covariance matrix
Sigma = np.array([])

# TODO: Write a function to compute portfolio volatility
def portfolio_volatility(weights, cov_matrix):
    pass

# TODO: Write a function for the negative Sharpe ratio
def neg_sharpe(weights, mu, cov_matrix, rf=0.02):
    pass

# TODO: Set up constraints (weights sum to 1) and bounds (0 to 1)

# TODO: Run the optimizer and print results
`,
      solutionCode: `import numpy as np
from scipy.optimize import minimize

# Expected annual returns for 5 assets
mu = np.array([0.12, 0.10, 0.08, 0.05, 0.03])

# Covariance matrix (annual)
Sigma = np.array([
    [0.0400, 0.0120, 0.0080, 0.0020, 0.0010],
    [0.0120, 0.0225, 0.0060, 0.0015, 0.0005],
    [0.0080, 0.0060, 0.0100, 0.0010, 0.0008],
    [0.0020, 0.0015, 0.0010, 0.0025, 0.0003],
    [0.0010, 0.0005, 0.0008, 0.0003, 0.0009]
])

def portfolio_volatility(weights, cov_matrix):
    return np.sqrt(weights @ cov_matrix @ weights)

def neg_sharpe(weights, mu, cov_matrix, rf=0.02):
    ret = weights @ mu
    vol = portfolio_volatility(weights, cov_matrix)
    return -(ret - rf) / vol

n = len(mu)
constraints = [{'type': 'eq', 'fun': lambda w: np.sum(w) - 1}]
bounds = [(0, 1) for _ in range(n)]
w0 = np.ones(n) / n

result = minimize(neg_sharpe, w0, args=(mu, Sigma),
                  method='SLSQP', bounds=bounds,
                  constraints=constraints)

opt_weights = result.x
opt_return = opt_weights @ mu
opt_vol = portfolio_volatility(opt_weights, Sigma)
sharpe = (opt_return - 0.02) / opt_vol

print(f"Optimal Weights: {np.round(opt_weights, 4)}")
print(f"Expected Return: {opt_return:.4f}")
print(f"Volatility:      {opt_vol:.4f}")
print(f"Sharpe Ratio:    {sharpe:.4f}")
`,
    },
    {
      id: "qf-capm",
      slug: "capital-asset-pricing-model",
      title: "Capital Asset Pricing Model (CAPM)",
      content: `## Capital Asset Pricing Model (CAPM)

The Capital Asset Pricing Model, developed independently by William Sharpe (1964), John Lintner (1965), and Jan Mossin (1966), extends Markowitz's portfolio theory to derive the equilibrium relationship between risk and expected return. CAPM is the single most influential model in finance and remains central to corporate finance, asset management, and regulatory capital calculations.

### The CAPM Equation

\`\`\`
E[r_i] = r_f + beta_i * (E[r_m] - r_f)
\`\`\`

where:
- **E[r_i]** is the expected return on asset i
- **r_f** is the risk-free rate
- **beta_i** is the asset's systematic risk exposure
- **E[r_m] - r_f** is the market risk premium (typically 5-7% historically)

### Understanding Beta

Beta measures how much an asset moves relative to the overall market:

| Beta Value | Interpretation | Example |
|-----------|----------------|---------|
| beta = 1.0 | Moves with the market | S&P 500 index fund |
| beta > 1.0 | More volatile than market | Tech stocks (beta ~ 1.3) |
| 0 < beta < 1 | Less volatile than market | Utilities (beta ~ 0.5) |
| beta = 0 | Uncorrelated with market | Treasury bills |
| beta < 0 | Moves opposite to market | Gold (sometimes), VIX |

Mathematically, beta is:

\`\`\`
beta_i = Cov(r_i, r_m) / Var(r_m)
\`\`\`

This is exactly the slope coefficient from regressing asset returns on market returns.

### The Security Market Line

The CAPM predicts that all assets should lie on the **Security Market Line (SML)**, which plots expected return against beta. Assets above the SML offer excess return (positive alpha) and are undervalued; assets below the SML have negative alpha and are overvalued.

\`\`\`
alpha_i = r_i - [r_f + beta_i * (r_m - r_f)]
\`\`\`

Jensen's alpha measures the risk-adjusted excess return. A positive alpha means the asset or portfolio outperformed what CAPM predicted given its beta.

### Computing Beta and Alpha in Python

\`\`\`python
import numpy as np
from scipy import stats

np.random.seed(42)

# Simulated monthly returns
market_returns = np.random.normal(0.008, 0.04, 60)
stock_returns = 0.002 + 1.3 * market_returns + np.random.normal(0, 0.02, 60)

# OLS regression: stock = alpha + beta * market
slope, intercept, r_value, p_value, std_err = stats.linregress(
    market_returns, stock_returns
)

print(f"Beta:    {slope:.4f}")
print(f"Alpha:   {intercept:.6f} (monthly)")
print(f"R-squared: {r_value**2:.4f}")

# Annualize
print(f"Annualized Alpha: {intercept * 12:.4f}")
\`\`\`

### CAPM Assumptions and Limitations

CAPM rests on strong assumptions:

- Investors are mean-variance optimizers (they only care about expected return and variance)
- Markets are frictionless (no taxes, transaction costs, or short-selling constraints)
- All investors have homogeneous expectations (same estimates of returns, variances, covariances)
- There is a single-period investment horizon
- A risk-free asset exists that all investors can borrow and lend at

These assumptions are clearly violated in reality. Empirical tests by Fama and French (1992) showed that beta alone does not fully explain cross-sectional differences in returns. Small-cap stocks and value stocks earned returns higher than CAPM predicted, leading to multi-factor models.

### Practical Applications Despite Limitations

Despite its empirical shortcomings, CAPM remains widely used:

- **Cost of equity estimation** — Companies use CAPM to estimate their cost of equity for project valuation: r_e = r_f + beta * ERP
- **Performance attribution** — Jensen's alpha measures manager skill
- **Regulatory capital** — Bank regulators use beta-like measures for risk-weighting assets
- **Benchmarking** — CAPM provides a baseline for evaluating any investment strategy

### Key Takeaway

CAPM's genius is connecting individual asset pricing to the aggregate market portfolio. While a single factor (the market) is insufficient to explain all return variation, CAPM established the framework that all subsequent factor models build upon.`,
      starterCode: `import numpy as np
from scipy import stats

np.random.seed(42)

# TODO: Generate 60 months of simulated market returns
market_returns = None

# TODO: Generate stock returns with beta = 1.5 and alpha = 0.003
stock_returns = None

# TODO: Regress stock returns on market returns
# to estimate beta and alpha

# TODO: Print beta, alpha, and R-squared
`,
      solutionCode: `import numpy as np
from scipy import stats

np.random.seed(42)

# Generate 60 months of simulated market returns
market_returns = np.random.normal(0.008, 0.04, 60)

# Generate stock returns with beta = 1.5 and alpha = 0.003
stock_returns = 0.003 + 1.5 * market_returns + np.random.normal(0, 0.02, 60)

# Regress stock returns on market returns
slope, intercept, r_value, p_value, std_err = stats.linregress(
    market_returns, stock_returns
)

print(f"Beta:    {slope:.4f}")
print(f"Alpha:   {intercept:.6f} (monthly)")
print(f"R-squared: {r_value**2:.4f}")
print(f"Annualized Alpha: {intercept * 12:.4f}")
`,
    },
    {
      id: "qf-fama-french",
      slug: "fama-french-three-factor",
      title: "Fama-French Three-Factor Model",
      content: `## Fama-French Three-Factor Model

In 1993, Eugene Fama and Kenneth French published "Common Risk Factors in the Returns on Stocks and Bonds," one of the most cited papers in financial economics. They showed that two additional factors — size and value — capture return patterns that CAPM's single market factor cannot explain. The three-factor model became the standard benchmark for academic research and professional portfolio evaluation.

### The Three Factors

\`\`\`
E[r_i] - r_f = beta_m * (r_m - r_f) + beta_s * SMB + beta_v * HML
\`\`\`

| Factor | Name | Construction | Premium |
|--------|------|-------------|---------|
| **MKT** | Market | Return on broad market minus risk-free rate | ~6% annually |
| **SMB** | Small Minus Big | Return on small-cap portfolio minus large-cap portfolio | ~2-3% annually |
| **HML** | High Minus Low | Return on high book-to-market (value) minus low book-to-market (growth) | ~3-5% annually |

### Why Size and Value Matter

**The Size Effect:** Small-cap stocks have historically outperformed large-cap stocks by 2-3% per year. The explanations are debated:
- **Risk-based:** Small firms are riskier (less diversified, higher leverage, less liquid), so investors demand a premium
- **Behavioral:** Investors overvalue large, well-known firms and neglect smaller companies

**The Value Effect:** Stocks with high book-to-market ratios (value stocks) have outperformed growth stocks by 3-5% per year. Again, explanations differ:
- **Risk-based:** Value firms are often financially distressed, so the premium compensates for distress risk
- **Behavioral:** Investors extrapolate past growth too far into the future, overpricing growth stocks and underpricing value stocks

### Factor Construction

Fama and French construct their factors by sorting stocks into portfolios:

1. **Size sort:** Rank all NYSE/AMEX/NASDAQ stocks by market capitalization. Split at the NYSE median into Small and Big.
2. **Value sort:** Rank by book-to-market ratio. Split into three groups — top 30% (High/Value), middle 40%, bottom 30% (Low/Growth).
3. **Form 6 portfolios** by intersecting the two sorts (Small-Value, Small-Neutral, Small-Growth, Big-Value, Big-Neutral, Big-Growth).
4. **SMB** = average return of the 3 small portfolios minus average return of the 3 big portfolios.
5. **HML** = average return of the 2 value portfolios minus average return of the 2 growth portfolios.

### Implementing the Three-Factor Regression

\`\`\`python
import numpy as np
from scipy import stats

np.random.seed(42)
n = 120  # 10 years of monthly data

# Simulated factor returns (monthly)
mkt = np.random.normal(0.006, 0.04, n)  # market excess return
smb = np.random.normal(0.002, 0.03, n)  # size factor
hml = np.random.normal(0.003, 0.03, n)  # value factor

# Stock with exposure to all three factors
stock_excess = (0.001 + 1.1 * mkt + 0.5 * smb + 0.3 * hml
                + np.random.normal(0, 0.015, n))

# Multiple regression using least squares
X = np.column_stack([np.ones(n), mkt, smb, hml])
betas = np.linalg.lstsq(X, stock_excess, rcond=None)[0]

print(f"Alpha (monthly): {betas[0]:.6f}")
print(f"Market Beta:     {betas[1]:.4f}")
print(f"SMB Beta:        {betas[2]:.4f}")
print(f"HML Beta:        {betas[3]:.4f}")
print(f"Annualized Alpha: {betas[0] * 12:.4f}")
\`\`\`

### Impact on Alpha Measurement

One of the most important practical consequences of the Fama-French model is that it dramatically reduces measured alpha. A fund manager who appears skilled under CAPM may simply have been tilting toward small-cap and value stocks. When you control for SMB and HML loadings, much of the apparent alpha disappears.

For example, a small-cap value fund that earned 15% per year when the market earned 10% might have a CAPM alpha of 3%. But after accounting for its positive SMB and HML betas, the Fama-French alpha might be near zero — the returns were fair compensation for factor risk, not manager skill.

### Extensions: The Five-Factor Model

In 2015, Fama and French added two more factors:
- **RMW (Robust Minus Weak):** profitability factor — firms with high operating profitability outperform
- **CMA (Conservative Minus Aggressive):** investment factor — firms that invest conservatively outperform

The five-factor model explains even more return variation but remains controversial because the value factor (HML) becomes redundant once profitability and investment are included.

### Key Takeaway

The Fama-French three-factor model demonstrated that expected returns are driven by multiple risk dimensions, not just market beta. Understanding your portfolio's factor exposures is essential for distinguishing genuine alpha from factor tilts.`,
      starterCode: `import numpy as np

np.random.seed(42)
n = 120  # 10 years monthly

# TODO: Simulate factor returns (mkt, smb, hml)

# TODO: Create a stock with known factor exposures
# beta_mkt=1.2, beta_smb=0.6, beta_hml=-0.2, alpha=0.002

# TODO: Run a multiple regression to recover the betas
# Hint: use np.linalg.lstsq with a design matrix [ones, mkt, smb, hml]

# TODO: Print alpha and all betas
`,
      solutionCode: `import numpy as np

np.random.seed(42)
n = 120

# Simulate factor returns (monthly)
mkt = np.random.normal(0.006, 0.04, n)
smb = np.random.normal(0.002, 0.03, n)
hml = np.random.normal(0.003, 0.03, n)

# Create a stock with known factor exposures
stock_excess = (0.002 + 1.2 * mkt + 0.6 * smb - 0.2 * hml
                + np.random.normal(0, 0.015, n))

# Multiple regression
X = np.column_stack([np.ones(n), mkt, smb, hml])
betas = np.linalg.lstsq(X, stock_excess, rcond=None)[0]

print(f"Alpha (monthly): {betas[0]:.6f}")
print(f"Market Beta:     {betas[1]:.4f}")
print(f"SMB Beta:        {betas[2]:.4f}")
print(f"HML Beta:        {betas[3]:.4f}")
print(f"Annualized Alpha: {betas[0] * 12:.4f}")
`,
    },
    {
      id: "qf-apt",
      slug: "arbitrage-pricing-theory",
      title: "Arbitrage Pricing Theory (APT)",
      content: `## Arbitrage Pricing Theory (APT)

Stephen Ross introduced the Arbitrage Pricing Theory in 1976 as a more general alternative to CAPM. While CAPM derives from specific assumptions about investor preferences, APT requires only the assumption of **no arbitrage** — the idea that risk-free profits cannot persist in competitive markets. This weaker assumption makes APT theoretically more robust, though it comes at the cost of not specifying which factors matter.

### The APT Framework

APT assumes that asset returns are generated by a linear factor model:

\`\`\`
r_i = alpha_i + beta_i1 * F_1 + beta_i2 * F_2 + ... + beta_iK * F_K + epsilon_i
\`\`\`

where F_1 through F_K are systematic risk factors and epsilon_i is idiosyncratic risk.

The key result is that in a large, diversified portfolio, idiosyncratic risk is diversified away, and **expected returns are determined solely by factor exposures**:

\`\`\`
E[r_i] = r_f + beta_i1 * lambda_1 + beta_i2 * lambda_2 + ... + beta_iK * lambda_K
\`\`\`

where lambda_j is the risk premium for factor j.

### APT vs. CAPM

| Feature | CAPM | APT |
|---------|------|-----|
| **Assumptions** | Mean-variance optimization, homogeneous expectations | No arbitrage only |
| **Factors** | Single factor (market portfolio) | Multiple (unspecified) |
| **Factor identification** | Market return is prescribed | Must be discovered empirically |
| **Theoretical rigor** | Exact pricing for all assets | Approximate pricing for well-diversified portfolios |
| **Practical use** | Cost of capital, performance attribution | Multi-factor risk models, statistical arbitrage |

### Identifying Factors

APT does not specify which factors drive returns — this must be determined empirically. Two main approaches exist:

**1. Macroeconomic factors** — Chen, Roll, and Ross (1986) identified these macro factors:
- Unexpected changes in industrial production
- Unexpected inflation
- Changes in the yield curve slope (term spread)
- Changes in the credit spread (default risk premium)
- Unexpected changes in oil prices

**2. Statistical factors (PCA)** — Principal Component Analysis extracts factors directly from the return covariance matrix without requiring economic interpretation:

\`\`\`python
import numpy as np
from numpy.linalg import eig

np.random.seed(42)

# Simulate returns for 20 stocks over 120 months
n_stocks, n_months = 20, 120

# Generate returns from a 3-factor model
F = np.random.normal(0, 0.02, (3, n_months))
B = np.random.normal(0, 0.5, (n_stocks, 3))
noise = np.random.normal(0, 0.01, (n_stocks, n_months))
returns = B @ F + noise

# PCA on the covariance matrix
cov_matrix = np.cov(returns)
eigenvalues, eigenvectors = eig(cov_matrix)

# Sort by eigenvalue (largest first)
idx = np.argsort(eigenvalues)[::-1]
eigenvalues = eigenvalues[idx].real
eigenvectors = eigenvectors[:, idx].real

# Variance explained by each component
total_var = np.sum(eigenvalues)
for i in range(5):
    pct = eigenvalues[i] / total_var * 100
    cum = np.sum(eigenvalues[:i+1]) / total_var * 100
    print(f"PC{i+1}: {pct:.1f}% variance (cumulative: {cum:.1f}%)")
\`\`\`

In practice, the first 3-5 principal components typically explain 50-70% of return variation across a broad equity universe.

### Commercial Factor Models

The investment industry has developed commercial multi-factor models that blend APT's framework with economic intuition:

- **Barra (MSCI)** — Uses industry factors plus style factors (size, value, momentum, volatility, quality)
- **Axioma** — Similar multi-factor structure with statistical and fundamental factors
- **Bloomberg** — Provides factor models integrated with their terminal

These models are used for portfolio construction, risk decomposition, and performance attribution.

### Statistical Arbitrage and APT

Statistical arbitrage strategies are a direct application of APT. The process is:

1. Estimate a factor model for a universe of stocks
2. Calculate expected returns based on factor exposures
3. Identify stocks whose actual returns deviate from model predictions
4. Go long undervalued stocks and short overvalued stocks
5. The portfolio is approximately factor-neutral, isolating alpha from idiosyncratic mispricings

This approach was pioneered by firms like D.E. Shaw and Renaissance Technologies and remains a core strategy at many quantitative hedge funds.

### Key Takeaway

APT provides a flexible, theoretically grounded framework for multi-factor risk modeling. Unlike CAPM, it does not specify which factors matter, giving practitioners the freedom to choose factors that best explain their investment universe. The price of this flexibility is that factor selection requires careful empirical work and economic judgment.`,
      starterCode: `import numpy as np
from numpy.linalg import eig

np.random.seed(42)

# TODO: Simulate returns for 15 stocks over 100 months
# using a hidden 3-factor structure

# TODO: Compute the covariance matrix

# TODO: Run PCA (eigendecomposition of the covariance matrix)

# TODO: Print variance explained by each of the first 5 components
`,
      solutionCode: `import numpy as np
from numpy.linalg import eig

np.random.seed(42)

# Simulate returns for 15 stocks over 100 months
n_stocks, n_months = 15, 100
F = np.random.normal(0, 0.02, (3, n_months))
B = np.random.normal(0, 0.5, (n_stocks, 3))
noise = np.random.normal(0, 0.01, (n_stocks, n_months))
returns = B @ F + noise

# Compute the covariance matrix
cov_matrix = np.cov(returns)

# PCA via eigendecomposition
eigenvalues, eigenvectors = eig(cov_matrix)
idx = np.argsort(eigenvalues)[::-1]
eigenvalues = eigenvalues[idx].real
eigenvectors = eigenvectors[:, idx].real

# Variance explained
total_var = np.sum(eigenvalues)
for i in range(5):
    pct = eigenvalues[i] / total_var * 100
    cum = np.sum(eigenvalues[:i+1]) / total_var * 100
    print(f"PC{i+1}: {pct:.1f}% variance (cumulative: {cum:.1f}%)")
`,
    },
    {
      id: "qf-black-litterman",
      slug: "black-litterman-model",
      title: "Black-Litterman Model",
      content: `## The Black-Litterman Model

In 1992, Fischer Black and Robert Litterman at Goldman Sachs published a model that elegantly solved the biggest practical problems with mean-variance optimization: extreme sensitivity to expected return estimates and unintuitive portfolio weights. The Black-Litterman model has become the industry standard for institutional asset allocation, used by sovereign wealth funds, pension funds, and asset managers worldwide.

### The Problem with Traditional MVO

Standard mean-variance optimization requires expected return inputs for every asset. These estimates are notoriously unreliable, and MVO amplifies estimation errors:

- A 1% change in expected return for a single asset can swing portfolio weights by 30-50%
- The optimizer "maximizes estimation error" by overweighting assets whose returns are overestimated
- The resulting portfolios are often concentrated, unintuitive, and impractical

### The Black-Litterman Solution

Black-Litterman starts from **equilibrium** — specifically, the market-capitalization-weighted portfolio — and asks: "What expected returns would make the market portfolio optimal?" These are the **implied equilibrium returns**:

\`\`\`
Pi = delta * Sigma * w_market
\`\`\`

where:
- **Pi** is the vector of implied equilibrium excess returns
- **delta** is the risk aversion coefficient (typically 2.5-3.5)
- **Sigma** is the covariance matrix
- **w_market** is the vector of market capitalization weights

These implied returns serve as the **prior** in a Bayesian framework. The investor then specifies **views** — beliefs about how certain assets or combinations of assets will perform — along with the **confidence** in each view.

### Expressing Views

Views can be absolute or relative:

- **Absolute view:** "I believe US equities will return 8% next year" (with some confidence)
- **Relative view:** "I believe emerging markets will outperform developed markets by 3%" (with some confidence)

Views are encoded in a matrix P and a vector Q:

\`\`\`
P * mu = Q + noise
\`\`\`

where noise represents the uncertainty in the view, captured by the diagonal matrix Omega.

### The Black-Litterman Formula

The posterior expected returns combine the prior (equilibrium) with the views:

\`\`\`
mu_BL = [(tau * Sigma)^(-1) + P' * Omega^(-1) * P]^(-1)
        * [(tau * Sigma)^(-1) * Pi + P' * Omega^(-1) * Q]
\`\`\`

where tau is a scalar (typically 0.025-0.05) controlling the weight given to the prior.

### Python Implementation

\`\`\`python
import numpy as np

def black_litterman(Sigma, w_mkt, P, Q, omega, delta=2.5, tau=0.05):
    """
    Compute Black-Litterman posterior expected returns.
    Sigma: NxN covariance matrix
    w_mkt: market cap weights (N,)
    P: KxN pick matrix (K views on N assets)
    Q: Kx1 view vector
    omega: KxK uncertainty of views (diagonal)
    """
    # Implied equilibrium returns
    Pi = delta * Sigma @ w_mkt

    # Precision matrices
    tau_sigma_inv = np.linalg.inv(tau * Sigma)
    omega_inv = np.linalg.inv(omega)

    # Posterior expected returns
    M = np.linalg.inv(tau_sigma_inv + P.T @ omega_inv @ P)
    mu_bl = M @ (tau_sigma_inv @ Pi + P.T @ omega_inv @ Q)

    return mu_bl, Pi

# Example: 4 asset classes
asset_names = ['US Equity', 'Intl Equity', 'Bonds', 'Commodities']
Sigma = np.array([
    [0.0225, 0.0135, 0.0027, 0.0054],
    [0.0135, 0.0256, 0.0036, 0.0072],
    [0.0027, 0.0036, 0.0016, 0.0008],
    [0.0054, 0.0072, 0.0008, 0.0400]
])
w_mkt = np.array([0.40, 0.30, 0.25, 0.05])

# View 1: US equity will return 10% (absolute)
# View 2: Intl equity will outperform commodities by 2%
P = np.array([
    [1, 0, 0, 0],
    [0, 1, 0, -1]
])
Q = np.array([0.10, 0.02])
omega = np.diag([0.001, 0.002])

mu_bl, Pi = black_litterman(Sigma, w_mkt, P, Q, omega)

print("Equilibrium Returns:")
for name, r in zip(asset_names, Pi):
    print(f"  {name}: {r:.4f}")

print("\\nBlack-Litterman Returns:")
for name, r in zip(asset_names, mu_bl):
    print(f"  {name}: {r:.4f}")
\`\`\`

### Advantages Over Raw MVO

| Feature | Standard MVO | Black-Litterman |
|---------|-------------|-----------------|
| **Starting point** | Arbitrary return estimates | Market equilibrium |
| **Sensitivity** | Extreme | Moderate — anchored to equilibrium |
| **No-view case** | Undefined | Returns the market portfolio |
| **Incorporating views** | All-or-nothing | Blends views with equilibrium based on confidence |
| **Portfolio stability** | Unstable over time | Relatively stable |

### Practical Considerations

The key practical decision in Black-Litterman is **view calibration**: how confident should you be in your views? A common approach is to set the diagonal elements of Omega proportional to the variance implied by P * Sigma * P'. This means your uncertainty in a view is proportional to the volatility of the assets involved. Highly confident views will pull returns further from equilibrium; uncertain views will leave returns near the prior.

### Key Takeaway

The Black-Litterman model solves the practical failures of mean-variance optimization by starting from market equilibrium and blending in investor views through a Bayesian framework. It produces stable, intuitive portfolios and has become the gold standard for institutional asset allocation.`,
      starterCode: `import numpy as np

# TODO: Implement the Black-Litterman function
def black_litterman(Sigma, w_mkt, P, Q, omega, delta=2.5, tau=0.05):
    """Compute Black-Litterman posterior expected returns."""
    pass

# TODO: Define a covariance matrix for 4 assets
Sigma = None

# TODO: Define market cap weights
w_mkt = None

# TODO: Define one absolute view and one relative view
P = None
Q = None
omega = None

# TODO: Compute and print equilibrium and BL returns
`,
      solutionCode: `import numpy as np

def black_litterman(Sigma, w_mkt, P, Q, omega, delta=2.5, tau=0.05):
    """Compute Black-Litterman posterior expected returns."""
    Pi = delta * Sigma @ w_mkt
    tau_sigma_inv = np.linalg.inv(tau * Sigma)
    omega_inv = np.linalg.inv(omega)
    M = np.linalg.inv(tau_sigma_inv + P.T @ omega_inv @ P)
    mu_bl = M @ (tau_sigma_inv @ Pi + P.T @ omega_inv @ Q)
    return mu_bl, Pi

# 4 asset classes
asset_names = ['US Equity', 'Intl Equity', 'Bonds', 'Commodities']
Sigma = np.array([
    [0.0225, 0.0135, 0.0027, 0.0054],
    [0.0135, 0.0256, 0.0036, 0.0072],
    [0.0027, 0.0036, 0.0016, 0.0008],
    [0.0054, 0.0072, 0.0008, 0.0400]
])
w_mkt = np.array([0.40, 0.30, 0.25, 0.05])

# View 1: US equity returns 10% (absolute)
# View 2: Intl equity outperforms commodities by 2%
P = np.array([[1, 0, 0, 0], [0, 1, 0, -1]])
Q = np.array([0.10, 0.02])
omega = np.diag([0.001, 0.002])

mu_bl, Pi = black_litterman(Sigma, w_mkt, P, Q, omega)

print("Equilibrium Returns:")
for name, r in zip(asset_names, Pi):
    print(f"  {name}: {r:.4f}")
print("\\nBlack-Litterman Returns:")
for name, r in zip(asset_names, mu_bl):
    print(f"  {name}: {r:.4f}")
`,
    },
  ],
};
