import { Module } from "../types";

export const derivativesModule: Module = {
  id: "qf-derivatives",
  title: "Derivatives Instruments",
  description: "Understand the major categories of financial derivatives — forwards, futures, options, and swaps — and how they are used for hedging and speculation.",
  lessons: [
    {
      id: "qf-what-are-derivatives",
      slug: "what-are-derivatives",
      title: "What are Derivatives",
      content: `## What are Derivatives?

A **derivative** is a financial instrument whose value is derived from the price of an underlying asset. The underlying can be a stock, bond, commodity, interest rate, exchange rate, or even another derivative. Derivatives are among the most important — and most misunderstood — instruments in modern finance.

### Why Derivatives Exist

Derivatives serve three fundamental purposes:

**1. Hedging (Risk Management)** — A farmer growing wheat faces the risk that prices will fall before harvest. By selling wheat futures, the farmer locks in a price today, transferring price risk to a willing counterparty. Airlines hedge jet fuel costs, multinational corporations hedge currency exposure, and banks hedge interest rate risk — all using derivatives.

**2. Speculation** — Derivatives allow traders to take leveraged positions on market movements. Buying a call option on a stock costs a fraction of buying the stock itself, but provides amplified upside (and limited downside). This leverage attracts speculators seeking to profit from anticipated price movements.

**3. Price Discovery** — Derivatives markets often lead spot markets in reflecting new information. Futures prices for oil, natural gas, and agricultural commodities are global benchmarks that guide production and investment decisions.

### The Four Major Types

| Derivative | Description | Where Traded |
|-----------|-------------|--------------|
| **Forwards** | Custom agreement to buy/sell at a future date and price | Over-the-counter (OTC) |
| **Futures** | Standardized forward contract | Exchanges (CME, ICE) |
| **Options** | Right (not obligation) to buy/sell | Both OTC and exchanges |
| **Swaps** | Exchange of cash flows between parties | Primarily OTC |

### Market Size

The global derivatives market is enormous. The Bank for International Settlements (BIS) estimates the notional outstanding value of OTC derivatives alone at over $600 trillion — roughly 6 times global GDP. This figure overstates the actual economic exposure (since many positions offset each other), but it underscores how central derivatives are to the global financial system.

### Linear vs. Non-Linear Payoffs

A critical distinction in derivatives is between **linear** and **non-linear** payoffs:

- **Linear:** Forwards and futures have payoffs that move dollar-for-dollar with the underlying asset. If the underlying rises by $1, a long futures position gains $1 (ignoring leverage effects).
- **Non-linear:** Options have asymmetric payoffs. A call option gains value when the underlying rises but has limited loss (the premium paid) when it falls. This asymmetry makes options pricing fundamentally more complex.

### Counterparty Risk

Every derivative contract involves two parties, and each faces **counterparty risk** — the risk that the other party fails to honor its obligations. This risk is managed differently depending on the market:

- **Exchange-traded derivatives** use a **central clearinghouse** that stands between buyer and seller, requiring daily margin payments. This virtually eliminates counterparty risk.
- **OTC derivatives** historically involved bilateral counterparty risk. After the 2008 crisis (where AIG's inability to honor its swap obligations nearly collapsed the financial system), regulations now require many OTC derivatives to be cleared centrally.

### A Simple Python Example

\`\`\`python
# Payoff of a forward contract at expiration
def forward_payoff(spot_price, forward_price, position="long"):
    """
    spot_price: price of the asset at expiration
    forward_price: agreed-upon price in the contract
    position: 'long' (buyer) or 'short' (seller)
    """
    if position == "long":
        return spot_price - forward_price
    else:
        return forward_price - spot_price

# Example: agreed to buy gold at $2000/oz
forward_price = 2000
for spot in [1800, 1900, 2000, 2100, 2200]:
    payoff = forward_payoff(spot, forward_price)
    print(f"Spot: \${spot}, Long Payoff: \${payoff}")
\`\`\`

### Key Takeaway

Derivatives are not inherently dangerous — they are tools for transferring and managing risk. The danger arises from misuse: excessive leverage, inadequate risk management, and failure to understand the instruments. This module will equip you with the knowledge to understand, price, and use derivatives responsibly.`,
    },
    {
      id: "qf-forwards-futures",
      slug: "forwards-futures",
      title: "Forward & Futures Contracts",
      content: `## Forward & Futures Contracts

Forward and futures contracts are the simplest derivatives. Both are agreements to buy or sell an asset at a specified future date for a specified price. The key difference lies in standardization and how they are traded.

### Forward Contracts

A **forward contract** is a private agreement between two parties. The terms — quantity, quality, delivery date, and price — are negotiated directly. No money changes hands at inception (ignoring collateral requirements).

**Pricing a Forward Contract:** The fair forward price is determined by the cost of carry:

\`\`\`
F = S * exp(r * T)          (no dividends/storage)
F = S * exp((r - q) * T)    (continuous dividend yield q)
F = (S + U) * exp(r * T)    (storage cost U)
\`\`\`

where S is the spot price, r is the risk-free rate, and T is time to delivery.

This formula arises from a **no-arbitrage argument**: if the forward price deviated from this value, you could construct a riskless profit by simultaneously trading in the forward and spot markets.

### Futures Contracts

A **futures contract** is a standardized forward that trades on an organized exchange. Key differences from forwards:

| Feature | Forward | Futures |
|---------|---------|---------|
| **Standardization** | Customized | Standardized (size, expiry) |
| **Trading venue** | OTC (bilateral) | Exchange |
| **Counterparty risk** | Direct exposure to other party | Clearinghouse guarantees |
| **Settlement** | At expiration only | Daily mark-to-market |
| **Liquidity** | Low (hard to exit early) | High (can offset on exchange) |

### Daily Mark-to-Market (Margining)

The most important operational difference is daily settlement. Each day, the exchange calculates gains and losses based on the closing futures price:

- If the futures price rises, long position holders receive cash; short position holders pay cash
- If the futures price falls, the reverse occurs
- Each party must maintain a **margin account** with the exchange

\`\`\`python
def simulate_margin_account(initial_margin, futures_prices):
    """Simulate daily P&L for a long futures position."""
    balance = initial_margin
    daily_pnl = []

    for i in range(1, len(futures_prices)):
        pnl = futures_prices[i] - futures_prices[i-1]
        balance += pnl
        daily_pnl.append(pnl)
        print(f"Day {i}: Price={futures_prices[i]:.2f}, "
              f"Daily P&L=\${pnl:.2f}, Balance=\${balance:.2f}")

    return balance, daily_pnl

# Example: 5-day futures position on crude oil
prices = [75.00, 76.20, 74.80, 75.50, 76.00]
initial_margin = 5000
final_balance, _ = simulate_margin_account(initial_margin, prices)
print(f"\\nNet P&L: \${final_balance - initial_margin:.2f}")
\`\`\`

### Convergence at Expiration

As the delivery date approaches, the futures price converges to the spot price. At expiration, F = S. This must hold because:

- If F > S at expiration, you could sell the futures and buy spot for a riskless profit
- If F < S at expiration, you could buy the futures and sell spot for a riskless profit

### Basis and Basis Risk

The **basis** is the difference between the spot and futures price:

\`\`\`
Basis = Spot Price - Futures Price
\`\`\`

For hedgers, **basis risk** — the risk that the basis changes unexpectedly — is the residual risk that remains after hedging. A perfect hedge eliminates all price risk only if the basis is zero at the time the hedge is lifted.

### Common Futures Markets

| Market | Exchange | Contract Size |
|--------|----------|---------------|
| S&P 500 E-mini | CME | $50 x index |
| Crude Oil (WTI) | NYMEX | 1,000 barrels |
| Gold | COMEX | 100 troy ounces |
| Eurodollar | CME | $1,000,000 |
| 10-Year Treasury | CBOT | $100,000 face |
| Corn | CBOT | 5,000 bushels |

### Hedging with Futures

The **hedge ratio** determines how many futures contracts to trade:

\`\`\`
N = (beta * Portfolio Value) / (Futures Price * Contract Size)
\`\`\`

For a portfolio perfectly correlated with the index, this fully eliminates market risk. In practice, cross-hedging (hedging with a related but imperfect instrument) introduces basis risk.

### Key Takeaway

Forwards and futures are conceptually identical — agreements to trade at a future price — but differ in their operational mechanics. The daily margining of futures eliminates counterparty risk at the cost of interim cash flow uncertainty. Understanding the cost-of-carry pricing formula and the concept of basis risk is essential for any quantitative finance practitioner.`,
    },
    {
      id: "qf-options-basics",
      slug: "options-calls-puts",
      title: "Options: Calls, Puts & Payoffs",
      content: `## Options: Calls, Puts & Payoffs

Options are the most versatile and mathematically rich derivatives. Unlike forwards and futures, options give the holder a **right but not an obligation**, creating asymmetric payoffs that require fundamentally different pricing methods.

### Call Options

A **call option** gives the holder the right to **buy** the underlying asset at a specified **strike price** (K) on or before a specified **expiration date** (T). The buyer pays a **premium** upfront for this right.

**Payoff at expiration (long call):**
\`\`\`
Payoff = max(S - K, 0)
\`\`\`

If the stock price S is above the strike K, the option is exercised for a profit of (S - K). If S is below K, the option expires worthless and the holder loses only the premium paid.

### Put Options

A **put option** gives the holder the right to **sell** the underlying asset at the strike price.

**Payoff at expiration (long put):**
\`\`\`
Payoff = max(K - S, 0)
\`\`\`

### The Four Basic Positions

| Position | Right/Obligation | Payoff | Max Gain | Max Loss |
|----------|-------------------|--------|----------|----------|
| Long Call | Right to buy | max(S-K, 0) | Unlimited | Premium |
| Short Call | Obligation to sell | -max(S-K, 0) | Premium | Unlimited |
| Long Put | Right to sell | max(K-S, 0) | K - Premium | Premium |
| Short Put | Obligation to buy | -max(K-S, 0) | Premium | K - Premium |

### Moneyness

An option's relationship to the current stock price is described by its **moneyness**:

- **In-the-money (ITM):** Call with S > K, or put with S < K — has intrinsic value
- **At-the-money (ATM):** S approximately equals K
- **Out-of-the-money (OTM):** Call with S < K, or put with S > K — no intrinsic value

### Intrinsic Value vs. Time Value

An option's price (premium) has two components:

\`\`\`
Option Price = Intrinsic Value + Time Value
\`\`\`

- **Intrinsic value** = max(S - K, 0) for calls, max(K - S, 0) for puts
- **Time value** = Option Price - Intrinsic Value

Time value is always non-negative (before expiration) and reflects the possibility that the option may become more valuable. Time value decays as expiration approaches — a phenomenon called **theta decay**.

### American vs. European Options

- **European options** can only be exercised at expiration
- **American options** can be exercised at any time before expiration
- American options are worth at least as much as European options (the early exercise right has value)
- For non-dividend-paying stocks, American and European calls have the same value (it is never optimal to exercise early)

### Computing Payoffs in Python

\`\`\`python
import numpy as np

def option_payoff(S, K, option_type="call", position="long"):
    """
    Calculate option payoff at expiration.
    S: stock price at expiration (scalar or array)
    K: strike price
    option_type: 'call' or 'put'
    position: 'long' or 'short'
    """
    if option_type == "call":
        payoff = np.maximum(S - K, 0)
    else:
        payoff = np.maximum(K - S, 0)

    if position == "short":
        payoff = -payoff

    return payoff

# Example: plot payoff diagram
S_range = np.linspace(80, 120, 100)
K = 100
premium = 5

# Profit (payoff minus premium paid)
call_profit = option_payoff(S_range, K, "call", "long") - premium
put_profit = option_payoff(S_range, K, "put", "long") - premium

# Breakeven points
call_breakeven = K + premium  # 105 for the call
put_breakeven = K - premium   # 95 for the put
print(f"Call breakeven: \${call_breakeven}")
print(f"Put breakeven: \${put_breakeven}")
\`\`\`

### Factors Affecting Option Prices

Six factors determine an option's value:

| Factor | Effect on Call | Effect on Put |
|--------|---------------|---------------|
| Stock price (S) up | Increases | Decreases |
| Strike price (K) up | Decreases | Increases |
| Time to expiration (T) up | Increases | Increases |
| Volatility (sigma) up | Increases | Increases |
| Risk-free rate (r) up | Increases | Decreases |
| Dividends up | Decreases | Increases |

The sensitivity of option price to each factor is captured by the **Greeks**, which we will study in detail later in this course.

### Key Takeaway

Options create asymmetric payoffs that cannot be replicated by any combination of the underlying asset and borrowing alone. Understanding the payoff diagrams, moneyness, and the factors affecting option prices is the foundation for everything in options pricing and trading.`,
    },
    {
      id: "qf-options-strategies",
      slug: "options-strategies",
      title: "Options Strategies",
      content: `## Options Strategies

By combining multiple options (and sometimes the underlying stock), traders can construct payoff profiles tailored to specific market views. These **options strategies** allow you to express nuanced opinions about direction, volatility, and timing — not just "up or down."

### Covered Call

A **covered call** combines a long stock position with a short (sold) call option. The investor owns the shares and sells someone the right to buy them at the strike price.

\`\`\`
Covered Call = Long Stock + Short Call
\`\`\`

**When to use:** You are mildly bullish or neutral. You are willing to sell the stock at the strike price and want to earn income from the premium.

**Payoff profile:**
- Below the strike: you keep the stock and the premium (cushions losses)
- Above the strike: the stock is called away; your gain is capped at (K - purchase price) + premium
- Maximum gain is limited; maximum loss is (purchase price - premium) if the stock goes to zero

This is the most commonly used options strategy among retail investors and is often described as "selling volatility" because you benefit when the stock does not move dramatically.

### Protective Put

A **protective put** combines a long stock position with a long put option. It acts as insurance on your stock holding.

\`\`\`
Protective Put = Long Stock + Long Put
\`\`\`

**When to use:** You are bullish but want downside protection. You are willing to pay a premium (the cost of the put) to limit your losses.

**Payoff profile:**
- Below the strike: the put kicks in, limiting your loss to (purchase price - K) + premium
- Above the strike: you keep the upside, minus the premium paid
- This is equivalent to a long call (by put-call parity) plus cash

### Straddle

A **straddle** buys both a call and a put with the same strike price and expiration.

\`\`\`
Long Straddle = Long Call(K) + Long Put(K)
\`\`\`

**When to use:** You expect a big move in either direction but are unsure which way. Common before earnings announcements, FDA decisions, or election results.

**Payoff profile:**
- Profits if the stock moves significantly in either direction
- Loss limited to the total premium paid (call premium + put premium)
- Breakeven points: K + total premium (upside) and K - total premium (downside)
- Maximum loss occurs if the stock expires exactly at the strike price

### Strangle

A **strangle** is similar to a straddle but uses different strike prices — typically an OTM call and an OTM put.

\`\`\`
Long Strangle = Long Call(K2) + Long Put(K1), where K1 < K2
\`\`\`

**When to use:** Same thesis as a straddle (expecting a large move) but at a lower cost, since both options are out-of-the-money. The tradeoff is that the stock must move further for the position to be profitable.

### Bull Call Spread

A **bull call spread** buys a call at a lower strike and sells a call at a higher strike, both with the same expiration.

\`\`\`
Bull Call Spread = Long Call(K1) + Short Call(K2), K1 < K2
\`\`\`

**When to use:** Moderately bullish. You want to reduce the cost of the long call by selling a higher-strike call. This caps your upside but also reduces your premium outlay.

### Python Implementation

\`\`\`python
import numpy as np

def strategy_payoff(S, positions):
    """
    Calculate total strategy payoff.
    positions: list of dicts with keys:
        type: 'call', 'put', or 'stock'
        strike: strike price (ignored for stock)
        qty: number of contracts (+1 long, -1 short)
        premium: premium per unit
    """
    total = np.zeros_like(S, dtype=float)

    for pos in positions:
        if pos["type"] == "stock":
            total += pos["qty"] * S
        elif pos["type"] == "call":
            total += pos["qty"] * np.maximum(S - pos["strike"], 0)
        elif pos["type"] == "put":
            total += pos["qty"] * np.maximum(pos["strike"] - S, 0)
        # Subtract premium paid (or add premium received)
        total -= pos["qty"] * pos["premium"]

    return total

# Example: Long Straddle with K=100
S_range = np.linspace(80, 120, 100)
straddle = [
    {"type": "call", "strike": 100, "qty": 1, "premium": 4},
    {"type": "put", "strike": 100, "qty": 1, "premium": 3.5},
]
payoff = strategy_payoff(S_range, straddle)
max_loss = min(payoff)
print(f"Max loss (at S=K): \${max_loss:.2f}")
print(f"Upside breakeven: \${100 + 7.5:.2f}")
print(f"Downside breakeven: \${100 - 7.5:.2f}")
\`\`\`

### Strategy Selection Guide

| Market View | Strategy | Risk Profile |
|-------------|----------|--------------|
| Mildly bullish, earn income | Covered Call | Limited upside, large downside |
| Bullish with protection | Protective Put | Unlimited upside, limited downside |
| Big move, direction unknown | Straddle | Limited loss, unlimited gain |
| Big move, cheaper bet | Strangle | Limited loss, unlimited gain |
| Moderately bullish | Bull Call Spread | Limited gain, limited loss |
| Moderately bearish | Bear Put Spread | Limited gain, limited loss |

### Key Takeaway

Options strategies allow you to express precise market views with defined risk parameters. The key is matching the strategy to your thesis: if you have a directional view, use spreads to reduce cost; if you are betting on volatility itself, use straddles or strangles. Always calculate breakeven points and maximum loss before entering a position.`,
    },
    {
      id: "qf-swaps",
      slug: "swaps",
      title: "Swaps: Interest Rate & Currency",
      content: `## Swaps: Interest Rate & Currency

A **swap** is an agreement between two parties to exchange cash flows over time according to a predetermined formula. Swaps are the largest segment of the OTC derivatives market, with interest rate swaps alone accounting for hundreds of trillions of dollars in notional value.

### Interest Rate Swaps

The most common swap is the **plain vanilla interest rate swap**, where two parties exchange:
- **Fixed rate** payments (one party pays a fixed rate on a notional principal)
- **Floating rate** payments (the other party pays a variable rate, typically SOFR or a similar benchmark)

**Example:** Company A has a floating-rate loan but prefers fixed payments. Company B has a fixed-rate loan but prefers floating. They enter a swap:

\`\`\`
Company A pays: Fixed 4.0% on $100M notional
Company A receives: SOFR + 0.5% on $100M notional
\`\`\`

The **notional principal** is never exchanged — it is only used to calculate payment amounts. On each payment date, the two cash flows are netted and only the difference changes hands.

### Why Use Interest Rate Swaps?

1. **Transform liability structure** — Convert floating-rate debt to fixed-rate (or vice versa) without refinancing
2. **Reduce borrowing costs** — Exploit comparative advantage. If Company A can borrow more cheaply in fixed markets and Company B in floating markets, both can benefit from swapping
3. **Hedge interest rate exposure** — Banks with duration mismatches use swaps to align their asset and liability sensitivities
4. **Speculate on rate movements** — If you believe rates will fall, pay fixed and receive floating

### Swap Valuation

An interest rate swap can be valued as the difference between two bonds:

\`\`\`
Value to fixed-rate payer = B_float - B_fixed
\`\`\`

where B_float is the value of the floating-rate bond and B_fixed is the value of the fixed-rate bond. At inception, the swap is structured so that its value is zero (the fixed rate is set to make both legs equal in present value).

\`\`\`python
import numpy as np

def value_swap(notional, fixed_rate, floating_rates,
               discount_factors, payment_freq=0.5):
    """
    Value an interest rate swap from the fixed-payer perspective.
    floating_rates: array of forward rates for each period
    discount_factors: array of discount factors for each payment date
    """
    n_periods = len(floating_rates)

    # Fixed leg present value
    fixed_pv = sum(
        notional * fixed_rate * payment_freq * discount_factors[i]
        for i in range(n_periods)
    )
    # Add notional repayment
    fixed_pv += notional * discount_factors[-1]

    # Floating leg present value
    floating_pv = sum(
        notional * floating_rates[i] * payment_freq * discount_factors[i]
        for i in range(n_periods)
    )
    floating_pv += notional * discount_factors[-1]

    swap_value = floating_pv - fixed_pv
    return swap_value

# Example: 2-year swap, semi-annual payments
notional = 100_000_000
fixed_rate = 0.04
floating_rates = [0.038, 0.042, 0.044, 0.041]  # forward SOFR rates
discount_factors = [0.981, 0.962, 0.943, 0.925]

value = value_swap(notional, fixed_rate, floating_rates, discount_factors)
print(f"Swap value to fixed payer: \${value:,.2f}")
\`\`\`

### Currency Swaps

A **currency swap** exchanges principal and interest payments in two different currencies. Unlike interest rate swaps, the notional principal IS exchanged at the start and end of the swap.

**Structure of a typical currency swap:**
1. At inception: Exchange USD notional for EUR notional at the current exchange rate
2. During the swap: Party A pays USD interest; Party B pays EUR interest
3. At maturity: Re-exchange the original notional amounts

**Uses:**
- Hedge long-term foreign currency exposure
- Access foreign currency financing at better rates
- Convert the currency denomination of assets or liabilities

### Other Swap Types

| Swap Type | Description |
|-----------|-------------|
| **Total Return Swap** | One party receives total return (capital gains + income) of an asset; pays a fixed or floating rate |
| **Credit Default Swap (CDS)** | Buyer pays periodic premiums; seller pays if a reference entity defaults |
| **Equity Swap** | Exchange equity returns for a fixed or floating rate |
| **Commodity Swap** | Exchange fixed price for floating commodity price |

### Credit Default Swaps (CDS)

CDS deserve special mention because of their role in the 2008 financial crisis. A CDS is essentially insurance on a bond:

- The **protection buyer** pays periodic premiums (the "CDS spread")
- The **protection seller** pays the face value minus recovery if the reference entity defaults

CDS spreads are widely used as a market-implied measure of credit risk. A rising CDS spread signals that the market perceives increasing default probability.

### Regulatory Changes Post-2008

The financial crisis revealed that the massive, opaque OTC swap market posed systemic risk. Key regulatory reforms include:

- **Central clearing** — Many standardized swaps must now be cleared through central counterparties (CCPs)
- **Margin requirements** — Both initial and variation margin are required for uncleared swaps
- **Trade reporting** — All swap transactions must be reported to trade repositories
- **Platform trading** — Standardized swaps must be traded on swap execution facilities (SEFs)

### Key Takeaway

Swaps are the workhorses of modern risk management. Interest rate swaps transform liability structures and hedge duration risk. Currency swaps manage cross-border exposure. Understanding swap mechanics and valuation is essential because swaps underpin the pricing of virtually all fixed-income derivatives.`,
    },
  ],
};
