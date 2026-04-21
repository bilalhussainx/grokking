import { Module } from "../types";

export const fixedIncomeQuantModule: Module = {
  id: "qf-fixed-income",
  title: "Fixed Income Quantitative Methods",
  description: "Master bond mathematics, term structure models, yield curve construction, swap pricing, and mortgage-backed securities.",
  lessons: [
    {
      id: "qf-bond-math",
      slug: "bond-mathematics",
      title: "Bond Mathematics",
      content: `## Bond Mathematics: Price, Yield, Duration & Convexity

Bonds are the foundation of fixed income markets. Understanding how to price bonds, compute yields, and measure interest rate sensitivity through duration and convexity is essential for any quantitative finance practitioner.

### Bond Pricing

A bond's price is the present value of its future cash flows — coupon payments and the face value returned at maturity:

\`\`\`
P = sum(C / (1+y)^t) + F / (1+y)^n
\`\`\`

where C is the coupon payment, F is the face value, y is the yield per period, and n is the number of periods.

\`\`\`python
import numpy as np

def bond_price(face_value, coupon_rate, ytm, years, freq=2):
    """
    Calculate the price of a fixed-rate bond.
    face_value: par value (typically 1000)
    coupon_rate: annual coupon rate
    ytm: yield to maturity (annual)
    years: years to maturity
    freq: payments per year (2 = semi-annual)
    """
    n_periods = int(years * freq)
    coupon = face_value * coupon_rate / freq
    y = ytm / freq

    # Present value of coupons (annuity formula)
    if y == 0:
        pv_coupons = coupon * n_periods
    else:
        pv_coupons = coupon * (1 - (1 + y)**(-n_periods)) / y

    # Present value of face value
    pv_face = face_value / (1 + y)**n_periods

    return pv_coupons + pv_face

# Example: 10-year, 5% coupon bond at various yields
face = 1000
coupon = 0.05
for ytm in [0.03, 0.04, 0.05, 0.06, 0.07]:
    price = bond_price(face, coupon, ytm, 10)
    print(f"YTM={ytm:.0%}: Price=\${price:.2f}")
\`\`\`

### Yield to Maturity (YTM)

YTM is the internal rate of return of a bond — the single discount rate that equates the bond's price to the present value of its cash flows. It is found by solving the pricing equation numerically.

Key relationships:
- When price = face value, YTM = coupon rate (par bond)
- When price > face value, YTM < coupon rate (premium bond)
- When price < face value, YTM > coupon rate (discount bond)

### Modified Duration

**Duration** measures the sensitivity of a bond's price to changes in yield. **Macaulay duration** is the weighted average time to receive the bond's cash flows:

\`\`\`
D_mac = (1/P) * sum(t * CF_t / (1+y)^t)
\`\`\`

**Modified duration** converts this to a price sensitivity measure:

\`\`\`
D_mod = D_mac / (1 + y/freq)
\`\`\`

The approximate price change for a small yield change dy is:

\`\`\`
dP/P ≈ -D_mod * dy
\`\`\`

\`\`\`python
def modified_duration(face_value, coupon_rate, ytm, years, freq=2):
    """Calculate modified duration of a bond."""
    n_periods = int(years * freq)
    coupon = face_value * coupon_rate / freq
    y = ytm / freq
    price = bond_price(face_value, coupon_rate, ytm, years, freq)

    # Macaulay duration (in periods)
    mac_dur = 0
    for t in range(1, n_periods + 1):
        cf = coupon if t < n_periods else coupon + face_value
        mac_dur += t * cf / (1 + y)**t

    mac_dur /= price  # in periods
    mac_dur /= freq   # convert to years

    mod_dur = mac_dur / (1 + y)
    return mod_dur

dur = modified_duration(1000, 0.05, 0.05, 10)
print(f"Modified Duration: {dur:.4f} years")
print(f"For a 1% rate increase, price change ≈ {-dur * 0.01:.2%}")
\`\`\`

### Convexity

Duration provides a linear approximation of the price-yield relationship, but the actual relationship is curved (convex). **Convexity** captures this curvature:

\`\`\`
dP/P ≈ -D_mod * dy + (1/2) * Convexity * dy^2
\`\`\`

Convexity is always positive for plain vanilla bonds, which means bonds gain more from falling rates than they lose from rising rates. This asymmetry is valuable — investors prefer bonds with higher convexity, all else equal.

### Duration as a Risk Management Tool

Portfolio managers use duration to:
- **Immunize** a portfolio against interest rate changes (match asset duration to liability duration)
- **Set risk limits** (e.g., portfolio duration cannot exceed 5 years)
- **Hedge** by constructing duration-neutral positions

### Key Takeaway

Bond mathematics provides the analytical foundation for the entire fixed income market. Price, yield, duration, and convexity are the essential metrics. Duration tells you how sensitive a bond is to rate changes; convexity tells you how that sensitivity itself changes. Together, they enable precise interest rate risk management.`,
    },
    {
      id: "qf-term-structure",
      slug: "term-structure-models",
      title: "Term Structure Models",
      content: `## Term Structure Models

The **term structure of interest rates** — the relationship between yields and maturities — is one of the most important objects in fixed income. Term structure models describe how interest rates evolve over time and are essential for pricing bonds, swaps, and interest rate derivatives.

### The Short Rate

Most term structure models are built around the **short rate** r(t) — the instantaneous interest rate at time t. The price of a zero-coupon bond maturing at T is:

\`\`\`
P(t, T) = E[exp(-integral from t to T of r(s) ds)]
\`\`\`

Different assumptions about how r(t) evolves lead to different models.

### The Vasicek Model (1977)

The Vasicek model assumes the short rate follows a mean-reverting process:

\`\`\`
dr = a(b - r) dt + sigma dW
\`\`\`

where:
- a = speed of mean reversion
- b = long-run average rate
- sigma = volatility

**Key properties:**
- Mean-reverting: rates are pulled back toward b
- Normally distributed: rates can go negative (a drawback, though now realistic given negative rates in Europe and Japan)
- Closed-form bond prices and option prices exist

\`\`\`python
import numpy as np

def vasicek_simulate(r0, a, b, sigma, T, dt=1/252, n_paths=1000):
    """Simulate short rate paths under the Vasicek model."""
    n_steps = int(T / dt)
    rates = np.zeros((n_steps + 1, n_paths))
    rates[0] = r0

    for t in range(n_steps):
        dW = np.sqrt(dt) * np.random.standard_normal(n_paths)
        rates[t+1] = rates[t] + a * (b - rates[t]) * dt + sigma * dW

    return rates

np.random.seed(42)
rates = vasicek_simulate(r0=0.05, a=0.5, b=0.04, sigma=0.01, T=10)
print(f"Mean rate at T=10: {rates[-1].mean():.4f}")
print(f"Std at T=10: {rates[-1].std():.4f}")
\`\`\`

### The CIR Model (Cox-Ingersoll-Ross, 1985)

The CIR model addresses the negative rate problem by making volatility proportional to the square root of the rate:

\`\`\`
dr = a(b - r) dt + sigma * sqrt(r) * dW
\`\`\`

When r approaches zero, the volatility shrinks, preventing the rate from going negative (provided 2ab > sigma^2, the Feller condition).

**Key properties:**
- Mean-reverting with non-negative rates
- Chi-squared distribution for r(t)
- Closed-form bond prices exist
- Widely used in credit risk modeling (for default intensity)

### The Hull-White Model (1990)

The Hull-White model extends Vasicek by allowing time-dependent parameters:

\`\`\`
dr = (theta(t) - a*r) dt + sigma dW
\`\`\`

The function theta(t) is chosen to exactly fit the current term structure of interest rates (the observed yield curve). This is called **calibration** and is essential for practical applications: a model that does not match today's market prices will produce arbitrage opportunities.

**Key properties:**
- Exactly fits the initial yield curve
- Analytically tractable (closed-form bond and swaption prices)
- The most widely used short-rate model in practice
- Can produce negative rates (like Vasicek)

### Equilibrium vs. No-Arbitrage Models

| Type | Examples | Approach |
|------|----------|----------|
| **Equilibrium** | Vasicek, CIR | Model derived from economic assumptions; may not fit current market |
| **No-Arbitrage** | Hull-White, HJM, LGM | Calibrated to fit current market prices exactly |

For derivatives pricing, no-arbitrage models are preferred because they ensure consistency with observed market prices.

### The Heath-Jarrow-Morton (HJM) Framework

Rather than modeling the short rate, HJM models the entire forward rate curve f(t, T) simultaneously:

\`\`\`
df(t, T) = alpha(t, T) dt + sigma(t, T) dW
\`\`\`

HJM showed that the drift alpha is fully determined by the volatility function sigma (under the risk-neutral measure). This is the most general framework for interest rate modeling, with Vasicek, CIR, and Hull-White all being special cases.

### Choosing a Model

| Model | Negative Rates | Fits Market | Complexity | Best For |
|-------|---------------|-------------|------------|----------|
| Vasicek | Yes | No | Low | Education, quick estimates |
| CIR | No | No | Medium | Credit risk modeling |
| Hull-White | Yes | Yes | Medium | Swaptions, rate derivatives |
| HJM | Depends | Yes | High | Exotic interest rate products |

### Key Takeaway

Term structure models are the engine behind fixed income derivatives pricing. The choice between Vasicek, CIR, Hull-White, and HJM depends on the application: simpler models provide intuition, while calibrated no-arbitrage models are required for accurate derivatives pricing. Understanding mean reversion and the tradeoff between analytical tractability and market fit is essential.`,
    },
    {
      id: "qf-yield-curve",
      slug: "yield-curve-construction",
      title: "Yield Curve Construction",
      content: `## Yield Curve Construction

The **yield curve** is a plot of interest rates against maturities. It is the single most important input for fixed income pricing, risk management, and monetary policy analysis. Constructing a smooth, arbitrage-free yield curve from market data is both an art and a science.

### What the Yield Curve Tells Us

The shape of the yield curve conveys information about market expectations and risk premiums:

| Shape | Description | Typical Interpretation |
|-------|-------------|----------------------|
| **Normal (upward sloping)** | Long rates > short rates | Economic growth expected; term premium positive |
| **Flat** | Long rates ≈ short rates | Uncertainty; possible transition period |
| **Inverted** | Long rates < short rates | Recession expected; historically reliable signal |
| **Humped** | Medium rates highest | Mixed signals; unusual |

An inverted yield curve has preceded every US recession since 1960, typically by 12-18 months. This makes it one of the most closely watched economic indicators.

### Market Instruments for Curve Construction

The yield curve is built from multiple market instruments across the maturity spectrum:

| Maturity Range | Instruments | Rate Type |
|---------------|-------------|-----------|
| Overnight to 3 months | Federal funds, SOFR, T-bills | Money market rates |
| 3 months to 2 years | Eurodollar futures, FRAs, T-notes | Short-term rates |
| 2 to 30 years | Interest rate swaps, Treasury bonds | Long-term rates |

### Bootstrapping the Zero Curve

**Bootstrapping** extracts zero-coupon (spot) rates from coupon-bearing instrument prices. The idea is to solve for spot rates sequentially, starting from the shortest maturity.

\`\`\`python
import numpy as np

def bootstrap_zero_curve(maturities, coupon_rates, prices, face=100):
    """
    Bootstrap zero-coupon rates from coupon bond prices.
    Assumes annual coupons and annual maturities.
    """
    zero_rates = []

    for i, T in enumerate(maturities):
        coupon = face * coupon_rates[i]
        price = prices[i]

        if T == 1:
            # First bond: simple calculation
            zero_rate = (face + coupon) / price - 1
        else:
            # Discount prior coupons using known zero rates
            pv_prior_coupons = sum(
                coupon / (1 + zero_rates[j])**(j+1)
                for j in range(len(zero_rates))
            )
            # Solve for the T-year zero rate
            remaining = price - pv_prior_coupons
            zero_rate = ((face + coupon) / remaining)**(1/T) - 1

        zero_rates.append(zero_rate)
        print(f"T={T}: Zero rate = {zero_rate:.4%}")

    return zero_rates

# Example: bootstrap from 3 bonds
maturities = [1, 2, 3]
coupon_rates = [0.04, 0.045, 0.05]
prices = [100.50, 100.80, 101.20]

zeros = bootstrap_zero_curve(maturities, coupon_rates, prices)
\`\`\`

### Interpolation Methods

Market data provides rates at discrete maturities. To price instruments at intermediate maturities, you need interpolation:

**Linear interpolation** — Simple but produces kinks in the forward rate curve, which can cause problems for derivatives pricing.

**Cubic spline interpolation** — Produces a smooth curve by fitting piecewise cubic polynomials. The most common choice in practice.

**Nelson-Siegel model** — A parametric model that fits the entire yield curve with just four parameters (level, slope, curvature, and decay):

\`\`\`
y(T) = beta0 + beta1 * (1-exp(-T/tau))/(T/tau)
        + beta2 * ((1-exp(-T/tau))/(T/tau) - exp(-T/tau))
\`\`\`

**Svensson extension** — Adds two more parameters for additional curvature flexibility. Used by many central banks (ECB, Bundesbank).

### Discount Factors and Forward Rates

Once you have the zero curve, you can derive:

**Discount factors:**
\`\`\`
D(T) = 1 / (1 + z(T))^T    (or exp(-z(T)*T) for continuous compounding)
\`\`\`

**Forward rates** — the implied rate between two future dates:
\`\`\`
f(T1, T2) = ((1 + z(T2))^T2 / (1 + z(T1))^T1)^(1/(T2-T1)) - 1
\`\`\`

Forward rates are critical because they represent the market's expectation (plus a risk premium) of future short-term rates, and they are the discount rates used in derivatives pricing.

### Practical Considerations

**Multi-curve framework:** Since the 2008 crisis, the industry has moved from a single yield curve to a **multi-curve framework**. Different curves are used for discounting (OIS/SOFR curve) and for projecting forward rates (SOFR term structure). The spread between these curves reflects credit and liquidity premiums.

**Smoothness vs. fit:** There is an inherent tension between fitting every market price exactly and producing a smooth curve. Over-fitting produces unrealistic forward rate volatility; under-fitting creates pricing errors.

### Key Takeaway

Yield curve construction is the foundation of fixed income analytics. Bootstrapping, interpolation, and the extraction of forward rates are daily tasks for any quant working in rates. The shift to multi-curve frameworks post-2008 added complexity but also made the models more realistic. A well-constructed yield curve is the starting point for pricing every bond, swap, and interest rate derivative.`,
    },
    {
      id: "qf-irs-pricing",
      slug: "interest-rate-swap-pricing",
      title: "Interest Rate Swaps Pricing",
      content: `## Interest Rate Swaps Pricing

Interest rate swaps are the most actively traded derivative in the world. Pricing them correctly requires a solid understanding of yield curve construction, discount factors, and forward rates. This lesson walks through the mechanics of swap valuation from first principles.

### Swap Structure Review

In a plain vanilla interest rate swap:
- **Fixed leg:** One party pays a fixed rate (the swap rate) on the notional principal at regular intervals
- **Floating leg:** The other party pays a floating rate (typically SOFR) that resets each period

The notional is never exchanged — it is only used to calculate payment amounts.

### The Par Swap Rate

At inception, a swap has zero value to both parties. The **par swap rate** is the fixed rate that makes the present value of the fixed leg equal to the present value of the floating leg:

\`\`\`
PV(fixed leg) = PV(floating leg)
\`\`\`

\`\`\`python
import numpy as np

def par_swap_rate(discount_factors, payment_times):
    """
    Calculate the par swap rate.
    discount_factors: array of discount factors at each payment date
    payment_times: array of payment times (in years)
    """
    # PV of floating leg = 1 - D(T_n)  (for par notional)
    # PV of fixed leg = swap_rate * sum(delta_i * D(T_i))
    # Setting equal: swap_rate = (1 - D(T_n)) / sum(delta_i * D(T_i))

    n = len(payment_times)
    deltas = np.diff(np.insert(payment_times, 0, 0))  # accrual periods

    annuity = np.sum(deltas * discount_factors)
    swap_rate = (1 - discount_factors[-1]) / annuity

    return swap_rate

# Example: 5-year swap with semi-annual payments
payment_times = np.arange(0.5, 5.5, 0.5)
# Discount factors from a yield curve (illustrative)
zero_rates = 0.04 + 0.002 * payment_times  # upward-sloping curve
discount_factors = np.exp(-zero_rates * payment_times)

rate = par_swap_rate(discount_factors, payment_times)
print(f"5-year par swap rate: {rate:.4%}")
\`\`\`

### Valuing an Existing Swap

After inception, interest rates change and the swap gains or loses value. To value an existing swap from the perspective of the fixed-rate payer:

\`\`\`
V = PV(floating leg) - PV(fixed leg)
\`\`\`

**Fixed leg valuation:**
\`\`\`
PV_fixed = Notional * swap_rate * sum(delta_i * D(T_i))
\`\`\`

**Floating leg valuation:**
Using the forward rates implied by today's yield curve:
\`\`\`
PV_floating = Notional * sum(f_i * delta_i * D(T_i))
\`\`\`

where f_i is the forward rate for period i.

\`\`\`python
def value_swap(notional, fixed_rate, forward_rates,
               discount_factors, payment_times, payer="fixed"):
    """
    Value an interest rate swap.
    payer: 'fixed' means we pay fixed, receive floating
    """
    deltas = np.diff(np.insert(payment_times, 0, 0))

    pv_fixed = notional * fixed_rate * np.sum(deltas * discount_factors)
    pv_floating = notional * np.sum(forward_rates * deltas * discount_factors)

    if payer == "fixed":
        value = pv_floating - pv_fixed
    else:
        value = pv_fixed - pv_floating

    return value, pv_fixed, pv_floating

# Example: 5-year swap entered at 4.5%, now rates have moved
notional = 10_000_000
fixed_rate = 0.045
forward_rates = np.array([0.042, 0.044, 0.046, 0.048, 0.050,
                          0.051, 0.052, 0.053, 0.054, 0.055])

val, pv_f, pv_fl = value_swap(notional, fixed_rate, forward_rates,
                               discount_factors, payment_times)
print(f"Swap value (fixed payer): \${val:,.2f}")
print(f"PV fixed leg: \${pv_f:,.2f}")
print(f"PV floating leg: \${pv_fl:,.2f}")
\`\`\`

### DV01 and Swap Risk

**DV01** (Dollar Value of a Basis Point) measures how much the swap value changes for a 1 basis point parallel shift in the yield curve:

\`\`\`
DV01 ≈ Notional * Modified Duration * 0.0001
\`\`\`

For a par swap, DV01 is approximately equal to the annuity factor times the notional times 0.0001. Swap traders use DV01 to size hedges and manage interest rate exposure.

### The Multi-Curve Framework

Since the 2008 crisis, swap pricing uses two curves:

1. **Discounting curve (OIS/SOFR):** Used to discount all cash flows
2. **Projection curve (SOFR term rates):** Used to estimate future floating rate fixings

Before 2008, a single LIBOR curve was used for both purposes. The spread between OIS and LIBOR (the "OIS-LIBOR spread") widened dramatically during the crisis, demonstrating that the single-curve approach embedded significant credit risk that was not being priced.

### Swap Spread

The **swap spread** is the difference between the swap rate and the Treasury yield of the same maturity:

\`\`\`
Swap Spread = Swap Rate - Treasury Yield
\`\`\`

Swap spreads reflect the credit premium of the banking sector relative to the government. They are closely watched as indicators of financial system stress.

### Key Takeaway

Interest rate swap pricing is a direct application of yield curve mathematics. The par swap rate is determined by discount factors. Existing swaps are valued by comparing the present values of fixed and floating legs using current market curves. The post-2008 multi-curve framework adds realism by separating discounting and projection. Mastering swap valuation is essential for any fixed income quant role.`,
    },
    {
      id: "qf-mbs",
      slug: "mortgage-backed-securities",
      title: "Mortgage-Backed Securities",
      content: `## Mortgage-Backed Securities

**Mortgage-backed securities (MBS)** are bonds backed by pools of residential or commercial mortgages. They are among the largest fixed income markets in the world — the US MBS market alone exceeds $12 trillion. MBS played a central role in the 2008 financial crisis, making their analysis both financially important and historically significant.

### How MBS Work

The **securitization** process transforms individual mortgages into tradeable securities:

1. A bank originates thousands of individual home loans
2. The loans are pooled together and transferred to a special purpose vehicle (SPV)
3. The SPV issues bonds (MBS) backed by the cash flows from the mortgage pool
4. Investors buy these bonds and receive monthly payments of principal and interest

**Agency MBS** are guaranteed by government-sponsored enterprises (Fannie Mae, Freddie Mac, Ginnie Mae). These carry minimal credit risk — the agencies guarantee timely payment of principal and interest.

**Non-agency (private label) MBS** carry credit risk and are typically structured into tranches with different seniority levels (CMOs — Collateralized Mortgage Obligations).

### Prepayment Risk

The unique challenge of MBS analysis is **prepayment risk**. Homeowners can repay their mortgages early — by refinancing, selling, or making additional payments. This creates cash flow uncertainty for MBS investors.

**When rates fall:** Prepayments accelerate as homeowners refinance at lower rates. The MBS investor receives principal back sooner than expected and must reinvest at lower rates. This is called **contraction risk**.

**When rates rise:** Prepayments slow down as homeowners hold onto their low-rate mortgages. The MBS investor is stuck with a low-yielding asset for longer. This is called **extension risk**.

This asymmetric behavior makes MBS exhibit **negative convexity** — they underperform in both rising and falling rate environments compared to a non-callable bond.

### Prepayment Models

\`\`\`python
import numpy as np

def psa_prepayment(month, psa_speed=100):
    """
    Public Securities Association (PSA) prepayment model.
    PSA assumes CPR (Conditional Prepayment Rate) ramps from 0 to 6%
    over the first 30 months, then remains at 6%.
    psa_speed: percentage of PSA standard (100 = standard, 200 = 2x, etc.)
    """
    if month <= 30:
        cpr = 0.06 * (month / 30) * (psa_speed / 100)
    else:
        cpr = 0.06 * (psa_speed / 100)

    # Convert annual CPR to monthly SMM (Single Monthly Mortality)
    smm = 1 - (1 - cpr)**(1/12)
    return cpr, smm

# Show prepayment rates at different speeds
for speed in [100, 150, 200, 300]:
    cpr_6m, smm_6m = psa_prepayment(6, speed)
    cpr_36m, smm_36m = psa_prepayment(36, speed)
    print(f"PSA {speed}%: Month 6 CPR={cpr_6m:.2%}, "
          f"Month 36 CPR={cpr_36m:.2%}")
\`\`\`

More sophisticated prepayment models incorporate:
- The **refinancing incentive** (difference between current rates and the coupon rate)
- **Burnout** (after a refinancing wave, remaining borrowers are less likely to refinance)
- **Seasonality** (prepayments are higher in summer months due to home sales)
- **Age of the loan** (newer loans have lower prepayment rates)

### MBS Cash Flow Projection

\`\`\`python
def project_mbs_cashflows(balance, mortgage_rate, n_months, psa_speed=100):
    """Project monthly MBS cash flows under a PSA assumption."""
    monthly_rate = mortgage_rate / 12
    cashflows = []

    for month in range(1, n_months + 1):
        # Scheduled payment (amortization)
        remaining_months = n_months - month + 1
        scheduled_payment = balance * monthly_rate / (
            1 - (1 + monthly_rate)**(-remaining_months)
        )
        interest = balance * monthly_rate
        scheduled_principal = scheduled_payment - interest

        # Prepayment
        _, smm = psa_prepayment(month, psa_speed)
        prepayment = (balance - scheduled_principal) * smm

        total_principal = scheduled_principal + prepayment
        total_cf = interest + total_principal

        cashflows.append({
            "month": month,
            "interest": interest,
            "scheduled_principal": scheduled_principal,
            "prepayment": prepayment,
            "total": total_cf,
            "remaining_balance": balance - total_principal,
        })

        balance -= total_principal
        if balance <= 0:
            break

    return cashflows

cfs = project_mbs_cashflows(100000, 0.06, 360, psa_speed=150)
print(f"Month 1: Interest=\${cfs[0]['interest']:.2f}, "
      f"Principal=\${cfs[0]['scheduled_principal']:.2f}, "
      f"Prepay=\${cfs[0]['prepayment']:.2f}")
\`\`\`

### Option-Adjusted Spread (OAS)

Because of prepayment optionality, MBS cannot be valued using a simple yield-to-maturity. The **Option-Adjusted Spread (OAS)** is the spread over the Treasury curve that makes the model price equal to the market price, after accounting for the prepayment option.

OAS is computed using Monte Carlo simulation:
1. Simulate thousands of interest rate paths
2. For each path, project prepayment rates and cash flows
3. Discount each path's cash flows at Treasury rates + OAS
4. Average across all paths to get the model price
5. Solve for the OAS that equates model price to market price

A higher OAS indicates a cheaper (more attractive) MBS, all else equal.

### The 2008 Crisis and MBS

The financial crisis was fundamentally an MBS crisis. Key factors:
- Subprime mortgages were securitized and given undeserved AAA ratings
- CDOs (Collateralized Debt Obligations) created synthetic exposure to subprime MBS
- When housing prices fell and defaults surged, the entire chain of securitization collapsed
- The failure to properly model correlated defaults and the inadequacy of rating agency models were central causes

### Key Takeaway

MBS are unique fixed income instruments because of prepayment risk — the embedded option that homeowners hold to repay their mortgage early. This creates negative convexity and requires specialized models (prepayment models, OAS analysis, Monte Carlo simulation) for proper valuation. Understanding MBS is essential for any fixed income quant and provides important lessons about the risks of financial engineering.`,
    },
  ],
};
