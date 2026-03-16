import { Module } from "../types";

export const optionsPricingModule: Module = {
  id: "qf-options",
  title: "Options Pricing Models",
  description:
    "Master the core options pricing models — binomial trees, Black-Scholes, the Greeks, implied volatility, and put-call parity.",
  lessons: [
    {
      id: "qf-binomial-model",
      slug: "binomial-options-pricing",
      title: "Binomial Options Pricing Model",
      content: `## Binomial Options Pricing Model

The binomial model is the most intuitive approach to options pricing. It builds a discrete-time tree of possible stock prices and works backward from expiration to determine the option's fair value today. Despite its simplicity, it converges to the Black-Scholes formula as the number of steps increases.

### The One-Step Model

Consider a stock currently priced at S that can move to either Su (up) or Sd (down) after one period. We want to price a European call option with strike K.

**Key insight:** We can create a **replicating portfolio** of the stock and a risk-free bond that exactly matches the option's payoff in both the up and down states. Since the portfolio and the option have identical payoffs, they must have the same price (by no-arbitrage).

The replicating portfolio consists of:
- Delta shares of stock
- B dollars in the risk-free bond

\`\`\`
Up state:   Delta * Su + B * exp(r*dt) = max(Su - K, 0)
Down state: Delta * Sd + B * exp(r*dt) = max(Sd - K, 0)
\`\`\`

Solving these two equations gives Delta (the hedge ratio) and B. The option price is then:

\`\`\`
C = Delta * S + B
\`\`\`

### Risk-Neutral Pricing

An equivalent and computationally simpler approach uses **risk-neutral probabilities**. Define:

\`\`\`
p = (exp(r*dt) - d) / (u - d)
\`\`\`

where u = Su/S and d = Sd/S. Then the option price is the discounted expected payoff under the risk-neutral measure:

\`\`\`
C = exp(-r*dt) * [p * C_up + (1-p) * C_down]
\`\`\`

These are not real-world probabilities — they are mathematical constructs that give the correct price. This is the foundation of **risk-neutral valuation**, one of the most powerful ideas in mathematical finance.

### Multi-Step Binomial Tree

For n steps, the stock price at node (i, j) — step i, j up-moves — is:

\`\`\`
S(i, j) = S * u^j * d^(i-j)
\`\`\`

The option is priced by working backward from the terminal payoffs:

\`\`\`python
import numpy as np

def binomial_option(S, K, T, r, sigma, n_steps, option_type="call"):
    """
    Price a European option using the binomial tree model.
    S: current stock price
    K: strike price
    T: time to expiration (years)
    r: risk-free rate
    sigma: volatility
    n_steps: number of time steps
    option_type: 'call' or 'put'
    """
    dt = T / n_steps
    u = np.exp(sigma * np.sqrt(dt))    # up factor
    d = 1 / u                           # down factor
    p = (np.exp(r * dt) - d) / (u - d)  # risk-neutral probability

    # Terminal stock prices
    stock_prices = np.array([S * u**j * d**(n_steps - j)
                             for j in range(n_steps + 1)])

    # Terminal option payoffs
    if option_type == "call":
        option_values = np.maximum(stock_prices - K, 0)
    else:
        option_values = np.maximum(K - stock_prices, 0)

    # Backward induction
    for i in range(n_steps - 1, -1, -1):
        option_values = (np.exp(-r * dt) *
                        (p * option_values[1:i+2] +
                         (1-p) * option_values[0:i+1]))

    return option_values[0]

# Price a European call
price = binomial_option(S=100, K=100, T=1.0, r=0.05, sigma=0.2, n_steps=200)
print(f"European Call Price: \${price:.4f}")
\`\`\`

### American Options and Early Exercise

The binomial model handles American options naturally. At each node, you compare the value of holding (continuing backward induction) with the value of exercising immediately:

\`\`\`
V(i,j) = max(exercise_value, continuation_value)
\`\`\`

This is the primary practical advantage of the binomial model over the Black-Scholes formula, which only prices European options directly.

### Convergence to Black-Scholes

As the number of steps n increases, the binomial model converges to the Black-Scholes price. With n = 100 steps, the binomial price typically matches Black-Scholes to within a few cents. This convergence provides an important sanity check for both models.

### Key Takeaway

The binomial model is both pedagogically valuable and practically useful. It teaches the fundamental concepts of replication, no-arbitrage, and risk-neutral pricing in an intuitive framework, while also providing a flexible numerical method for pricing American options and other path-dependent derivatives.`,
    },
    {
      id: "qf-black-scholes",
      slug: "black-scholes-formula",
      title: "The Black-Scholes Formula",
      content: `## The Black-Scholes Formula

The Black-Scholes model, published in 1973 by Fischer Black, Myron Scholes, and Robert Merton, is the most famous equation in finance. It provides a closed-form solution for the price of European options and fundamentally changed how derivatives markets operate.

### The Black-Scholes Assumptions

The model rests on several simplifying assumptions:

1. The stock price follows geometric Brownian motion with constant drift and volatility
2. No dividends during the option's life (easily relaxed)
3. No transaction costs or taxes
4. Continuous trading is possible
5. The risk-free interest rate is constant
6. No arbitrage opportunities exist
7. Short selling is permitted with full use of proceeds

### The Formula

For a European call option:

\`\`\`
C = S * N(d1) - K * exp(-r*T) * N(d2)
\`\`\`

For a European put option:

\`\`\`
P = K * exp(-r*T) * N(-d2) - S * N(-d1)
\`\`\`

where:

\`\`\`
d1 = (ln(S/K) + (r + sigma^2/2) * T) / (sigma * sqrt(T))
d2 = d1 - sigma * sqrt(T)
\`\`\`

N(x) is the cumulative standard normal distribution function.

### Interpreting the Formula

Each term has a financial interpretation:

- **S * N(d1):** The present value of receiving the stock, weighted by the probability of exercise under the risk-neutral measure. N(d1) is also the option's delta (hedge ratio).
- **K * exp(-r*T) * N(d2):** The present value of paying the strike price, weighted by the risk-neutral probability that the option finishes in-the-money. N(d2) is the probability that S(T) > K under the risk-neutral measure.

### Python Implementation

\`\`\`python
import numpy as np
from scipy.stats import norm

def black_scholes(S, K, T, r, sigma, option_type="call"):
    """
    Calculate Black-Scholes option price.
    S: current stock price
    K: strike price
    T: time to expiration (years)
    r: risk-free rate (annualized)
    sigma: volatility (annualized)
    option_type: 'call' or 'put'
    """
    d1 = (np.log(S / K) + (r + sigma**2 / 2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)

    if option_type == "call":
        price = S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    else:
        price = K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)

    return price

# Example: ATM option on a $100 stock
S, K, T, r, sigma = 100, 100, 1.0, 0.05, 0.20
call_price = black_scholes(S, K, T, r, sigma, "call")
put_price = black_scholes(S, K, T, r, sigma, "put")

print(f"Call Price: \${call_price:.4f}")
print(f"Put Price:  \${put_price:.4f}")
print(f"Call - Put: \${call_price - put_price:.4f}")
print(f"S - K*exp(-rT): \${S - K*np.exp(-r*T):.4f}")  # Put-call parity
\`\`\`

### The Black-Scholes PDE

The formula is derived from a partial differential equation obtained by constructing a riskless portfolio (delta hedging):

\`\`\`
dV/dt + (1/2)*sigma^2*S^2*(d^2V/dS^2) + r*S*(dV/dS) - r*V = 0
\`\`\`

This PDE holds for any derivative V(S, t) on the stock. Different boundary conditions yield different derivative prices. For a European call, the boundary condition at T is max(S - K, 0).

### Extensions to the Basic Model

| Extension | What It Addresses |
|-----------|-------------------|
| **Merton (1973)** | Continuous dividend yield: replace S with S*exp(-q*T) |
| **Garman-Kohlhagen** | Currency options: two risk-free rates |
| **Black (1976)** | Options on futures: replace S with F*exp(-r*T) |
| **Merton jump-diffusion** | Adds Poisson jumps to capture fat tails |
| **Heston model** | Stochastic volatility |

### Practical Limitations

The Black-Scholes model systematically misprices options because volatility is not constant. In practice, traders use the formula "backward" — they observe market prices and solve for the volatility that makes Black-Scholes match. This is **implied volatility**, which we will study next.

### Key Takeaway

The Black-Scholes formula transformed derivatives markets by providing a universal language for pricing options. While its assumptions are violated in practice, it remains the benchmark against which all other models are compared. Understanding its derivation, interpretation, and limitations is essential for any career in quantitative finance.`,
      starterCode: `import numpy as np
from scipy.stats import norm

def black_scholes(S, K, T, r, sigma, option_type="call"):
    """
    Calculate the Black-Scholes option price.

    Parameters:
    -----------
    S : float - Current stock price
    K : float - Strike price
    T : float - Time to expiration in years
    r : float - Risk-free interest rate (annualized)
    sigma : float - Volatility (annualized)
    option_type : str - 'call' or 'put'

    Returns:
    --------
    float - Option price
    """
    # TODO: Calculate d1 and d2
    d1 = 0  # Replace with correct formula
    d2 = 0  # Replace with correct formula

    # TODO: Calculate option price using N(d1), N(d2)
    if option_type == "call":
        price = 0  # Replace with Black-Scholes call formula
    else:
        price = 0  # Replace with Black-Scholes put formula

    return price


# Test your implementation
S, K, T, r, sigma = 100, 100, 1.0, 0.05, 0.20

call = black_scholes(S, K, T, r, sigma, "call")
put = black_scholes(S, K, T, r, sigma, "put")

print(f"Call Price: \${call:.4f}")
print(f"Put Price:  \${put:.4f}")

# Verify put-call parity: C - P = S - K*exp(-rT)
parity_lhs = call - put
parity_rhs = S - K * np.exp(-r * T)
print(f"Put-Call Parity Check: {abs(parity_lhs - parity_rhs) < 1e-10}")
`,
      solutionCode: `import numpy as np
from scipy.stats import norm

def black_scholes(S, K, T, r, sigma, option_type="call"):
    """
    Calculate the Black-Scholes option price.

    Parameters:
    -----------
    S : float - Current stock price
    K : float - Strike price
    T : float - Time to expiration in years
    r : float - Risk-free interest rate (annualized)
    sigma : float - Volatility (annualized)
    option_type : str - 'call' or 'put'

    Returns:
    --------
    float - Option price
    """
    d1 = (np.log(S / K) + (r + sigma**2 / 2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)

    if option_type == "call":
        price = S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    else:
        price = K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)

    return price


# Test your implementation
S, K, T, r, sigma = 100, 100, 1.0, 0.05, 0.20

call = black_scholes(S, K, T, r, sigma, "call")
put = black_scholes(S, K, T, r, sigma, "put")

print(f"Call Price: \${call:.4f}")
print(f"Put Price:  \${put:.4f}")

# Verify put-call parity: C - P = S - K*exp(-rT)
parity_lhs = call - put
parity_rhs = S - K * np.exp(-r * T)
print(f"Put-Call Parity Check: {abs(parity_lhs - parity_rhs) < 1e-10}")
`,
    },
    {
      id: "qf-greeks",
      slug: "the-greeks",
      title: "The Greeks: Delta, Gamma, Theta, Vega, Rho",
      content: `## The Greeks: Delta, Gamma, Theta, Vega, Rho

The "Greeks" are the partial derivatives of an option's price with respect to its input parameters. They quantify how sensitive an option's value is to changes in the underlying stock price, volatility, time, and interest rates. Understanding the Greeks is essential for hedging, risk management, and trading.

### Delta (dV/dS)

**Delta** measures the rate of change of the option price with respect to changes in the underlying stock price.

\`\`\`
Delta_call = N(d1)         (ranges from 0 to 1)
Delta_put = N(d1) - 1      (ranges from -1 to 0)
\`\`\`

**Interpretation:**
- A delta of 0.6 means the option price increases by \$0.60 for each \$1 increase in the stock
- Delta is also approximately the probability that the option finishes in-the-money (under the risk-neutral measure)
- ATM options have delta near 0.5 (calls) or -0.5 (puts)

**Delta hedging:** To create a delta-neutral position, sell delta shares for each option held. This removes first-order exposure to stock price movements.

### Gamma (d^2V/dS^2)

**Gamma** measures the rate of change of delta with respect to the stock price — it is the second derivative.

\`\`\`
Gamma = N'(d1) / (S * sigma * sqrt(T))
\`\`\`

where N'(x) is the standard normal density function.

**Interpretation:**
- Gamma is highest for ATM options near expiration
- High gamma means delta changes rapidly — your hedge becomes stale quickly
- Long option positions have positive gamma (you benefit from large moves)
- Short option positions have negative gamma (you are hurt by large moves)

### Theta (dV/dT)

**Theta** measures the rate of time decay — how much value the option loses each day as it approaches expiration.

\`\`\`
Theta_call = -(S * N'(d1) * sigma) / (2 * sqrt(T)) - r * K * exp(-r*T) * N(d2)
\`\`\`

**Interpretation:**
- Theta is almost always negative for long options (options lose value over time)
- ATM options have the highest theta, especially near expiration
- There is a fundamental relationship: Theta + (1/2)*sigma^2*S^2*Gamma + r*S*Delta - r*V = 0
- This means you cannot have positive gamma without paying theta — there is no free lunch

### Vega (dV/d_sigma)

**Vega** measures sensitivity to changes in implied volatility.

\`\`\`
Vega = S * sqrt(T) * N'(d1)
\`\`\`

**Interpretation:**
- Vega is always positive for long options (higher volatility increases value)
- ATM options have the highest vega
- Longer-dated options have higher vega (more time for volatility to affect the outcome)
- Vega is quoted per 1% change in volatility

### Rho (dV/dr)

**Rho** measures sensitivity to changes in the risk-free interest rate.

\`\`\`
Rho_call = K * T * exp(-r*T) * N(d2)
Rho_put = -K * T * exp(-r*T) * N(-d2)
\`\`\`

Rho is typically the least important Greek for short-dated equity options, but becomes significant for long-dated options and interest rate derivatives.

### Computing All Greeks in Python

\`\`\`python
import numpy as np
from scipy.stats import norm

def compute_greeks(S, K, T, r, sigma, option_type="call"):
    """Compute all Black-Scholes Greeks."""
    d1 = (np.log(S/K) + (r + sigma**2/2)*T) / (sigma*np.sqrt(T))
    d2 = d1 - sigma*np.sqrt(T)

    # Common terms
    n_d1 = norm.pdf(d1)  # standard normal density
    N_d1 = norm.cdf(d1)
    N_d2 = norm.cdf(d2)

    # Delta
    delta = N_d1 if option_type == "call" else N_d1 - 1

    # Gamma (same for calls and puts)
    gamma = n_d1 / (S * sigma * np.sqrt(T))

    # Theta (per year — divide by 365 for daily)
    theta_common = -(S * n_d1 * sigma) / (2 * np.sqrt(T))
    if option_type == "call":
        theta = theta_common - r * K * np.exp(-r*T) * N_d2
    else:
        theta = theta_common + r * K * np.exp(-r*T) * norm.cdf(-d2)

    # Vega (per 1% vol change)
    vega = S * np.sqrt(T) * n_d1 / 100

    # Rho (per 1% rate change)
    if option_type == "call":
        rho = K * T * np.exp(-r*T) * N_d2 / 100
    else:
        rho = -K * T * np.exp(-r*T) * norm.cdf(-d2) / 100

    return {
        "delta": delta, "gamma": gamma,
        "theta": theta/365, "vega": vega, "rho": rho
    }

greeks = compute_greeks(100, 100, 0.5, 0.05, 0.20, "call")
for name, value in greeks.items():
    print(f"{name:>6}: {value:>10.6f}")
\`\`\`

### The Greeks in Portfolio Management

For a portfolio of options, each Greek is additive:

| Portfolio Greek | Formula |
|----------------|---------|
| Portfolio Delta | Sum of (position size x delta) for each option |
| Portfolio Gamma | Sum of (position size x gamma) for each option |
| Portfolio Theta | Sum of (position size x theta) for each option |

Market makers continuously rebalance their portfolios to remain delta-neutral and manage gamma and vega exposures within risk limits.

### Key Takeaway

The Greeks transform options from opaque instruments into precisely measurable risk exposures. Delta tells you directional risk. Gamma tells you how fast your hedge changes. Theta is the cost of holding options. Vega is your volatility exposure. Together, they provide a complete picture of an option position's risk profile.`,
    },
    {
      id: "qf-implied-vol",
      slug: "implied-volatility-smile",
      title: "Implied Volatility & the Volatility Smile",
      content: `## Implied Volatility & the Volatility Smile

If the Black-Scholes model were perfectly correct, all options on the same underlying with the same expiration would have the same implied volatility regardless of strike price. In reality, they do not — and the pattern of implied volatilities across strikes reveals fundamental truths about how markets price risk.

### What is Implied Volatility?

**Implied volatility (IV)** is the volatility value that, when plugged into the Black-Scholes formula, produces the observed market price of an option. It is found by numerically inverting the Black-Scholes equation:

\`\`\`
Given: Market Price = BS(S, K, T, r, sigma_implied)
Find: sigma_implied
\`\`\`

Since the Black-Scholes formula is monotonically increasing in sigma (for both calls and puts), there is a unique solution.

### Computing Implied Volatility

The standard approach uses Newton-Raphson iteration, leveraging vega as the derivative:

\`\`\`python
import numpy as np
from scipy.stats import norm

def implied_volatility(market_price, S, K, T, r, option_type="call",
                       tol=1e-8, max_iter=100):
    """
    Find implied volatility using Newton-Raphson method.
    """
    sigma = 0.20  # initial guess

    for i in range(max_iter):
        d1 = (np.log(S/K) + (r + sigma**2/2)*T) / (sigma*np.sqrt(T))
        d2 = d1 - sigma*np.sqrt(T)

        if option_type == "call":
            bs_price = S*norm.cdf(d1) - K*np.exp(-r*T)*norm.cdf(d2)
        else:
            bs_price = K*np.exp(-r*T)*norm.cdf(-d2) - S*norm.cdf(-d1)

        vega = S * np.sqrt(T) * norm.pdf(d1)

        if vega < 1e-12:
            break

        sigma = sigma - (bs_price - market_price) / vega

        if abs(bs_price - market_price) < tol:
            return sigma

    return sigma

# Example
iv = implied_volatility(
    market_price=10.45, S=100, K=100, T=1.0, r=0.05, option_type="call"
)
print(f"Implied Volatility: {iv:.4f} ({iv*100:.2f}%)")
\`\`\`

### The Volatility Smile

Before the 1987 crash, implied volatilities were roughly constant across strikes. After Black Monday (when the S&P 500 fell 22.6% in a single day), a persistent pattern emerged:

**Equity options** exhibit a **volatility skew** (or smirk):
- OTM puts have higher implied volatility than ATM options
- OTM calls have lower implied volatility than ATM options
- The pattern slopes downward from left to right

This reflects the market's assessment that large downward moves are more likely than the log-normal model predicts. Investors are willing to pay more for downside protection (puts), driving up their implied volatilities.

**Currency options** and **commodity options** often show a true **smile** — both OTM puts and OTM calls have higher IV than ATM options. This reflects fat tails in both directions.

### The Volatility Surface

When you plot implied volatility across both strike prices and expirations, you get a three-dimensional **volatility surface**. This surface encodes the market's complete view of the probability distribution of future prices.

Key features of the volatility surface:
- **Strike dimension:** The smile/skew pattern described above
- **Term structure:** Short-dated options often have steeper skew than long-dated options
- **ATM term structure:** ATM implied volatility typically exhibits mean reversion — high IV tends to decrease and low IV tends to increase over time

### Why the Smile Exists

Several explanations have been proposed:

| Explanation | Mechanism |
|-------------|-----------|
| **Fat tails** | Real returns have heavier tails than log-normal, so OTM options are worth more |
| **Leverage effect** | Stock price declines increase a firm's leverage, increasing equity volatility |
| **Crash risk premium** | Investors pay extra for crash protection, inflating OTM put prices |
| **Supply/demand** | Portfolio insurance creates persistent demand for OTM puts |
| **Stochastic volatility** | Volatility itself is random, which fattens tails and creates the smile |
| **Jumps** | Sudden price jumps make OTM options more valuable |

### Models That Capture the Smile

The basic Black-Scholes model cannot produce a smile because it assumes constant volatility. More advanced models include:

- **Local volatility (Dupire):** Volatility is a deterministic function of stock price and time. Can fit any smile exactly but has unrealistic dynamics.
- **Stochastic volatility (Heston):** Volatility follows its own random process. Produces realistic smiles and is widely used in practice.
- **Jump-diffusion (Merton):** Adds Poisson jumps to GBM. Captures short-dated smile well.
- **SABR model:** Popular for interest rate options. Has analytic approximations for the smile.

### Trading the Smile

Implied volatility is itself a tradable quantity:

- **VIX** (the "fear index") is a model-free measure of 30-day implied volatility for S&P 500 options
- **Variance swaps** pay the difference between realized and implied variance
- **Volatility arbitrage** involves buying options when IV is "cheap" relative to expected realized volatility, and selling when IV is "expensive"

### Key Takeaway

Implied volatility is the market's consensus forecast of future uncertainty. The volatility smile reveals that markets price in fat tails, crash risk, and other phenomena that the basic Black-Scholes model ignores. Understanding the smile is essential for options traders, risk managers, and anyone who prices or trades volatility.`,
    },
    {
      id: "qf-put-call-parity",
      slug: "put-call-parity",
      title: "Put-Call Parity",
      content: `## Put-Call Parity

Put-call parity is one of the most elegant and important relationships in options pricing. It links the prices of European calls and puts with the same strike and expiration through a simple, model-free equation. Unlike the Black-Scholes formula, put-call parity does not depend on any assumptions about stock price dynamics — it follows purely from no-arbitrage.

### The Relationship

For European options on a non-dividend-paying stock:

\`\`\`
C - P = S - K * exp(-r * T)
\`\`\`

Or equivalently:

\`\`\`
C + K * exp(-r * T) = P + S
\`\`\`

where C is the call price, P is the put price, S is the current stock price, K is the strike price, r is the risk-free rate, and T is time to expiration.

### Intuition: Two Equivalent Portfolios

Put-call parity states that two portfolios have identical payoffs at expiration:

**Portfolio A:** One European call + cash equal to K * exp(-r * T)
**Portfolio B:** One European put + one share of stock

At expiration T, regardless of the stock price S(T):

| Scenario | Portfolio A Value | Portfolio B Value |
|----------|-------------------|-------------------|
| S(T) > K | (S(T) - K) + K = S(T) | 0 + S(T) = S(T) |
| S(T) <= K | 0 + K = K | (K - S(T)) + S(T) = K |

Both portfolios always have the same value at expiration. By the law of one price (no-arbitrage), they must have the same value today. This gives us the parity relationship.

### Arbitrage When Parity is Violated

If put-call parity does not hold, an arbitrage opportunity exists. Consider:

**Case 1: C - P > S - K * exp(-r*T)** — The call is "too expensive" relative to the put.

Strategy: Sell the call, buy the put, buy the stock, borrow K*exp(-r*T).
This locks in a riskless profit equal to the parity violation.

**Case 2: C - P < S - K * exp(-r*T)** — The put is "too expensive" relative to the call.

Strategy: Buy the call, sell the put, short the stock, invest K*exp(-r*T).

\`\`\`python
import numpy as np
from scipy.stats import norm

def check_put_call_parity(S, K, T, r, call_price, put_price):
    """Check if put-call parity holds and identify arbitrage."""
    lhs = call_price - put_price
    rhs = S - K * np.exp(-r * T)

    diff = lhs - rhs

    print(f"C - P = \${lhs:.4f}")
    print(f"S - K*exp(-rT) = \${rhs:.4f}")
    print(f"Difference: \${diff:.4f}")

    if abs(diff) < 0.01:
        print("Parity holds (within tolerance)")
    elif diff > 0.01:
        print(f"ARBITRAGE: Call overpriced by \${diff:.4f}")
        print("Strategy: Sell call, buy put, buy stock, borrow PV(K)")
    else:
        print(f"ARBITRAGE: Put overpriced by \${-diff:.4f}")
        print("Strategy: Buy call, sell put, short stock, invest PV(K)")

    return diff

# Example 1: Parity holds
S, K, T, r = 100, 100, 1.0, 0.05
check_put_call_parity(S, K, T, r, call_price=10.45, put_price=5.57)

print()

# Example 2: Parity violated
check_put_call_parity(S, K, T, r, call_price=12.00, put_price=5.57)
\`\`\`

### Extensions

**With dividends (continuous yield q):**
\`\`\`
C - P = S * exp(-q*T) - K * exp(-r*T)
\`\`\`

**With discrete dividends:**
\`\`\`
C - P = (S - PV(dividends)) - K * exp(-r*T)
\`\`\`

**For American options:** Put-call parity becomes an inequality:
\`\`\`
S - K <= C - P <= S - K * exp(-r*T)
\`\`\`

The inequality arises because American puts may be exercised early, which makes the exact relationship more complex.

### Practical Applications

**1. Synthetic Positions:** Put-call parity lets you create any position from the other components:
- **Synthetic call** = Long put + Long stock - Borrow PV(K)
- **Synthetic put** = Long call - Long stock + Invest PV(K)
- **Synthetic stock** = Long call - Long put + Invest PV(K)

This is useful when one instrument is more liquid or cheaper to trade than another.

**2. Pricing Consistency:** Market makers use parity to ensure their call and put quotes are consistent. If a call is priced, the put price is determined by parity (and vice versa).

**3. Model Validation:** Any options pricing model must satisfy put-call parity. If your model violates it, there is a bug in your implementation.

### Implied Forward Price

Rearranging put-call parity:

\`\`\`
F = S * exp(r*T) = K + (C - P) * exp(r*T)
\`\`\`

This gives the **implied forward price** from options markets. It is a market-implied estimate of the future stock price, accounting for dividends and borrowing costs.

### Why Put-Call Parity Matters

Put-call parity is remarkable because it is **model-free**. It does not assume Black-Scholes, binomial trees, or any specific dynamics for the stock price. It only requires the absence of arbitrage. This makes it one of the most robust and practically useful results in all of derivatives pricing.

In practice, small deviations from parity do exist due to transaction costs, bid-ask spreads, and differences in borrowing/lending rates. These deviations define the boundaries within which market makers operate.

### Key Takeaway

Put-call parity is the fundamental link between calls, puts, the underlying stock, and the risk-free rate. It enables the creation of synthetic positions, ensures pricing consistency, and provides a model-free arbitrage check. Master it thoroughly — it will appear repeatedly throughout your career in quantitative finance.`,
    },
  ],
};
