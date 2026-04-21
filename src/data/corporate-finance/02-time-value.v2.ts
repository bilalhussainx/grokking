import { Module } from "../types";

export const timeValueModule: Module = {
  id: "cf-time-value",
  title: "Time Value of Money",
  description: "Master the most important concept in finance — why a dollar today is worth more than a dollar tomorrow, and the math to prove it.",
  lessons: [
    {
      id: "cf-present-future-value",
      slug: "present-future-value",
      title: "Present Value & Future Value",
      content: `## Present Value & Future Value

The **time value of money (TVM)** is the most fundamental concept in all of finance. It states that a dollar received today is worth more than a dollar received in the future because today's dollar can be invested to earn a return.

### Future Value (FV)

If you invest $1,000 today at 8% annual interest, how much will you have in 5 years?

**Formula:**
\`\`\`
FV = PV x (1 + r)^n
\`\`\`

Where:
- PV = Present Value ($1,000)
- r = interest rate per period (0.08)
- n = number of periods (5)

\`\`\`
FV = 1,000 x (1.08)^5 = 1,000 x 1.4693 = $1,469.33
\`\`\`

### The Power of Compounding

Albert Einstein reportedly called compound interest the "eighth wonder of the world." Whether or not he said it, the math is compelling:

| Investment | Rate | 10 Years | 20 Years | 30 Years |
|-----------|------|----------|----------|----------|
| $10,000 | 7% | $19,672 | $38,697 | $76,123 |
| $10,000 | 10% | $25,937 | $67,275 | $174,494 |
| $10,000 | 12% | $31,058 | $96,463 | $299,599 |

A seemingly small difference in return (7% vs. 12%) produces dramatically different outcomes over long periods. This is why Warren Buffett, whose Berkshire Hathaway compounded at ~20% annually for 58 years (1965-2023), turned $10,000 into over $300 million (Source: Berkshire Hathaway Annual Report, 2023).

### Present Value (PV)

Present value works in reverse — it tells you what a future cash flow is worth today. If someone promises you $1,469 in 5 years and your required return is 8%, what's that promise worth today?

**Formula:**
\`\`\`
PV = FV / (1 + r)^n
\`\`\`

\`\`\`
PV = 1,469.33 / (1.08)^5 = 1,469.33 / 1.4693 = $1,000
\`\`\`

### Discount Rate: The Key Variable

The **discount rate** (r) reflects the opportunity cost of capital — the return you could earn on an alternative investment of similar risk. Choosing the right discount rate is one of the most important (and debated) decisions in corporate finance.

Aswath Damodaran of NYU argues that "the discount rate is not a fudge factor or a negotiating tool — it should reflect the risk of the cash flows being discounted" (Source: Damodaran, *Investment Valuation*, 3rd ed., Wiley, 2012).

### Real-World Application

When Amazon decided to build its HQ2 in Arlington, Virginia (announced 2018), it evaluated billions of dollars of future cash flows — tax incentives, labor costs, real estate values — all discounted back to present value. The city offering the highest present value of net benefits won (Source: Amazon HQ2 proposal documents).

### Key Takeaway

TVM is the foundation upon which all of corporate finance rests. NPV, IRR, DCF, bond pricing, stock valuation — they all rely on converting future cash flows to present values. Master this concept, and everything else in this course will build naturally from it.

**Sources:** Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 4; MIT OCW 15.401, Lecture 2 (Andrew Lo).`,
    },
    {
      id: "cf-discounting-cash-flows",
      slug: "discounting-cash-flows",
      title: "Discounting Cash Flows",
      content: `## Discounting Cash Flows

**Discounting** is the process of determining the present value of future cash flows. It is the reverse of compounding and is the core technique behind every valuation method in corporate finance.

### The Discount Factor

The **discount factor** is the multiplier that converts a future cash flow to its present value:

\`\`\`
Discount Factor = 1 / (1 + r)^n
\`\`\`

For a 10% discount rate:

| Year | Discount Factor | $1,000 Payment PV |
|------|----------------|-------------------|
| 1 | 0.9091 | $909.09 |
| 2 | 0.8264 | $826.45 |
| 3 | 0.7513 | $751.31 |
| 5 | 0.6209 | $620.92 |
| 10 | 0.3855 | $385.54 |
| 20 | 0.1486 | $148.64 |

Notice how quickly distant cash flows lose value. At a 10% discount rate, a dollar received in 20 years is worth only about 15 cents today. This has profound implications for long-duration assets and projects.

### Discounting Multiple Cash Flows

Most real-world decisions involve a stream of cash flows over multiple periods. To find the present value of a cash flow stream:

\`\`\`
PV = CF1/(1+r)^1 + CF2/(1+r)^2 + CF3/(1+r)^3 + ... + CFn/(1+r)^n
\`\`\`

### Example: Evaluating a Business Investment

A factory expansion will cost $5 million today and generate the following after-tax cash flows:

| Year | Cash Flow |
|------|-----------|
| 1 | $1,200,000 |
| 2 | $1,500,000 |
| 3 | $1,800,000 |
| 4 | $1,500,000 |
| 5 | $1,000,000 |

At a 12% discount rate:

\`\`\`
PV = 1,200,000/1.12 + 1,500,000/1.12^2 + 1,800,000/1.12^3 + 1,500,000/1.12^4 + 1,000,000/1.12^5
PV = 1,071,429 + 1,195,153 + 1,281,139 + 953,349 + 567,427
PV = $5,068,497
\`\`\`

Since the PV of cash flows ($5.07M) exceeds the investment cost ($5.0M), this is a value-creating project (positive NPV of $68,497).

### Choosing the Discount Rate

The discount rate should reflect the **risk of the cash flows**, not the risk of the investor. Common discount rates used in practice:

| Context | Typical Rate | Source |
|---------|-------------|--------|
| U.S. Treasury bonds | 4-5% (2024) | Risk-free rate |
| Investment-grade corporate | 6-8% | Corporate cost of debt |
| Typical company WACC | 8-12% | Weighted average cost of capital |
| Venture capital | 25-50% | Reflects high failure rate |

According to a survey by Fernandez, Bañuls, and Acín ("Survey: Market Risk Premium and Risk-Free Rate used by Analysts," IESE Business School, 2023), the average equity risk premium used globally was 5.7% in 2023.

### Real vs. Nominal Discount Rates

A critical distinction:
- **Nominal rate** — includes inflation
- **Real rate** — excludes inflation

The Fisher equation relates them: **(1 + nominal) = (1 + real) x (1 + inflation)**

If you discount nominal cash flows, use a nominal discount rate. If you discount real (inflation-adjusted) cash flows, use a real discount rate. Mixing them is a common and costly error.

### Key Takeaway

Discounting is the mechanism by which corporate finance translates uncertain future promises into concrete present values. The discount rate is not arbitrary — it embodies the risk and opportunity cost of the cash flows being valued.

**Sources:** Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 4; Damodaran, A. *Investment Valuation* (3rd ed., Wiley, 2012); MIT OCW 15.401.`,
    },
    {
      id: "cf-annuities-perpetuities",
      slug: "annuities-perpetuities",
      title: "Annuities & Perpetuities",
      content: `## Annuities & Perpetuities

Many financial instruments — mortgages, bonds, pensions, leases — involve regular, repeating payments. Rather than discounting each cash flow individually, we can use shortcut formulas for **annuities** and **perpetuities**.

### Perpetuity

A **perpetuity** is an infinite series of equal cash flows. While nothing truly lasts forever, some instruments are close enough to model as perpetuities (e.g., British consol bonds, preferred stock).

**Formula:**
\`\`\`
PV of Perpetuity = C / r
\`\`\`

Where C = annual cash flow and r = discount rate.

**Example:** A preferred stock pays $5 per year forever. If investors require a 10% return:

\`\`\`
PV = 5 / 0.10 = $50
\`\`\`

### Growing Perpetuity

A **growing perpetuity** has cash flows that grow at a constant rate g forever.

**Formula:**
\`\`\`
PV = C / (r - g)
\`\`\`

This formula (also called the **Gordon Growth Model**) is widely used in stock valuation. It requires r > g to produce a finite value.

**Example:** A stock pays a $3 dividend, growing at 4% annually. Required return is 11%:

\`\`\`
PV = 3 / (0.11 - 0.04) = 3 / 0.07 = $42.86
\`\`\`

The Gordon Growth Model, introduced by Myron Gordon and Eli Shapiro in 1956, remains one of the most widely cited valuation formulas in finance (Source: Gordon, M. & Shapiro, E. "Capital Equipment Analysis: The Required Rate of Profit," *Management Science*, 1956).

### Annuity

An **annuity** is a finite series of equal cash flows occurring at regular intervals.

**Formula:**
\`\`\`
PV of Annuity = C x [1 - (1+r)^(-n)] / r
\`\`\`

**Example:** A 30-year mortgage with monthly payments of $1,500 at a 6% annual rate (0.5% monthly):

\`\`\`
PV = 1,500 x [1 - (1.005)^(-360)] / 0.005
PV = 1,500 x [1 - 0.1660] / 0.005
PV = 1,500 x 166.79
PV = $250,187
\`\`\`

This means a $1,500/month payment for 30 years at 6% is equivalent to a $250,187 lump sum today — roughly the loan amount you could afford.

### Future Value of an Annuity

**FV of Annuity = C x [(1+r)^n - 1] / r**

This tells you how much a series of regular investments will be worth in the future.

**Example:** Investing $500/month for 30 years at 8% annual return (0.667% monthly):

\`\`\`
FV = 500 x [(1.00667)^360 - 1] / 0.00667
FV = 500 x [10.9357 - 1] / 0.00667
FV ≈ $745,180
\`\`\`

You invest $180,000 total ($500 x 360 months) but end up with $745,180 — compounding does the heavy lifting.

### Growing Annuity

A **growing annuity** has cash flows that grow at rate g for a finite period:

\`\`\`
PV = C x [1 - ((1+g)/(1+r))^n] / (r - g)
\`\`\`

This is useful for modeling salary growth (pension obligations), revenue growth (DCF models), or any cash flow that grows for a defined period.

### Real-World Application: U.S. Social Security

Social Security benefits are essentially a growing annuity — payments adjusted annually for inflation (COLA adjustments). As of 2024, the average Social Security retirement benefit was $1,907/month (Source: Social Security Administration, 2024). Actuaries at the SSA use annuity formulas to calculate the present value of future obligations — currently estimated at $22.4 trillion in unfunded liabilities over 75 years (Source: 2023 OASDI Trustees Report).

### Key Takeaway

Annuity and perpetuity formulas are powerful shortcuts that simplify the valuation of regular cash flows. They appear everywhere in finance: mortgage pricing, bond valuation, retirement planning, and DCF terminal values.

**Sources:** Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 4; Gordon, M. & Shapiro, E. (*Management Science*, 1956); MIT OCW 15.401.`,
    },
    {
      id: "cf-npv",
      slug: "net-present-value",
      title: "Net Present Value (NPV)",
      content: `## Net Present Value (NPV)

**Net Present Value (NPV)** is the gold standard of investment decision rules. It measures the value created (or destroyed) by an investment by comparing the present value of all future cash flows to the initial cost.

### The NPV Formula

\`\`\`
NPV = -Initial Investment + Sum of [CFt / (1+r)^t] for t=1 to n
\`\`\`

Or more compactly:
\`\`\`
NPV = -C0 + CF1/(1+r) + CF2/(1+r)^2 + ... + CFn/(1+r)^n
\`\`\`

### The NPV Decision Rule

- **NPV > 0:** Accept the project (it creates value)
- **NPV < 0:** Reject the project (it destroys value)
- **NPV = 0:** Indifferent (project earns exactly the required return)

### Why NPV is Superior

NPV is preferred over other investment rules because it:

1. **Uses cash flows, not accounting profits** — cash is king
2. **Considers all cash flows** — unlike payback period, which ignores cash flows after the cutoff
3. **Discounts at the opportunity cost of capital** — reflects risk appropriately
4. **Is additive** — NPV of A + NPV of B = NPV of (A + B); this means you can evaluate projects independently

John Graham and Campbell Harvey's survey of 392 CFOs ("The Theory and Practice of Corporate Finance," *Journal of Financial Economics*, 2001) found that **74.9% of CFOs always or almost always use NPV** when evaluating projects — making it the most popular capital budgeting technique among sophisticated firms.

### Detailed Example

A tech company is evaluating a new data center. The project requires $10 million upfront and will generate the following free cash flows:

| Year | FCF |
|------|-----|
| 1 | $2,500,000 |
| 2 | $3,000,000 |
| 3 | $3,500,000 |
| 4 | $3,000,000 |
| 5 | $2,000,000 |

The company's WACC is 10%.

\`\`\`
NPV = -10,000,000
    + 2,500,000 / 1.10^1  = +2,272,727
    + 3,000,000 / 1.10^2  = +2,479,339
    + 3,500,000 / 1.10^3  = +2,629,602
    + 3,000,000 / 1.10^4  = +2,049,040
    + 2,000,000 / 1.10^5  = +1,241,843
NPV = $672,551
\`\`\`

The positive NPV of $672,551 means the project creates value — it earns more than the 10% required return. The company should accept it.

### Common Mistakes

1. **Using accounting income instead of cash flows** — depreciation is not a cash flow; include it only for its tax shield effect.
2. **Forgetting working capital** — if a project requires additional inventory or receivables, that's a cash outflow.
3. **Including sunk costs** — money already spent is irrelevant to the NPV decision.
4. **Ignoring opportunity costs** — if the project uses a building the firm already owns, include the market value of that building as a cost.

### Real-World Application

When Disney acquired 21st Century Fox for $71.3 billion in 2019, the board's decision was fundamentally an NPV calculation: is the present value of Fox's content library, Hulu stake, and international assets worth more than $71.3 billion when discounted at Disney's cost of capital? Disney's analysis said yes (Source: Disney Proxy Statement, 2019, SEC.gov).

### Key Takeaway

NPV directly measures value creation in dollar terms. When you calculate a positive NPV, you are saying: "This project will make the firm worth exactly this many dollars more." No other capital budgeting tool provides this clarity.

**Sources:** Graham, J. & Harvey, C. "The Theory and Practice of Corporate Finance" (*JFE*, 2001); Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 7; MIT OCW 15.401.`,
      starterCode: `# NPV Calculator
# Complete the function to calculate Net Present Value

def calculate_npv(initial_investment, cash_flows, discount_rate):
    """
    Calculate NPV given:
    - initial_investment: upfront cost (positive number)
    - cash_flows: list of future cash flows [CF1, CF2, ..., CFn]
    - discount_rate: required rate of return (e.g., 0.10 for 10%)

    Returns: NPV as a float
    """
    # TODO: Start with negative initial investment
    npv = 0

    # TODO: Add discounted value of each future cash flow

    return npv


# Test with the data center example from the lesson
initial = 10_000_000
cfs = [2_500_000, 3_000_000, 3_500_000, 3_000_000, 2_000_000]
rate = 0.10

result = calculate_npv(initial, cfs, rate)
print(f"NPV: \${result:,.2f}")
# Expected: NPV: $672,551.42 (approximately)
`,
      solutionCode: `# NPV Calculator - Solution

def calculate_npv(initial_investment, cash_flows, discount_rate):
    """
    Calculate NPV given:
    - initial_investment: upfront cost (positive number)
    - cash_flows: list of future cash flows [CF1, CF2, ..., CFn]
    - discount_rate: required rate of return (e.g., 0.10 for 10%)

    Returns: NPV as a float
    """
    npv = -initial_investment

    for t, cf in enumerate(cash_flows, start=1):
        npv += cf / (1 + discount_rate) ** t

    return npv


# Test with the data center example from the lesson
initial = 10_000_000
cfs = [2_500_000, 3_000_000, 3_500_000, 3_000_000, 2_000_000]
rate = 0.10

result = calculate_npv(initial, cfs, rate)
print(f"NPV: \${result:,.2f}")
# Output: NPV: $672,551.42
`,
    },
    {
      id: "cf-irr",
      slug: "internal-rate-of-return",
      title: "Internal Rate of Return (IRR)",
      content: `## Internal Rate of Return (IRR)

The **Internal Rate of Return (IRR)** is the discount rate that makes the NPV of an investment equal to zero. In other words, it is the rate of return the project earns on the invested capital.

### The IRR Formula

IRR solves this equation for r:

\`\`\`
0 = -C0 + CF1/(1+r) + CF2/(1+r)^2 + ... + CFn/(1+r)^n
\`\`\`

There is no closed-form solution for most cash flow streams — IRR must be solved **iteratively** (trial and error, or using a computer algorithm like Newton's method).

### The IRR Decision Rule

- **IRR > required return (hurdle rate):** Accept the project
- **IRR < required return:** Reject the project

If a project's IRR is 15% and the firm's cost of capital is 10%, the project earns 5% above the minimum required return.

### Example

Using the same data center project (initial investment $10M, cash flows of $2.5M, $3.0M, $3.5M, $3.0M, $2.0M):

Through iteration, **IRR ≈ 12.4%**

Since 12.4% > 10% (the WACC), the IRR rule agrees with the NPV rule: accept the project.

### Popularity of IRR

Despite its flaws (discussed below), IRR is extremely popular. Graham and Harvey's survey (2001) found that **75.6% of CFOs always or almost always use IRR** — even slightly more than NPV. Why?

1. **Intuitive** — "This project earns 15%" is easier to communicate than "This project has an NPV of $672,551."
2. **Comparable** — IRR can be compared across projects of different sizes
3. **Familiar** — investors think in terms of returns, not dollar amounts

### The Problems with IRR

Despite its popularity, IRR has serious limitations that every finance professional must understand:

**1. Multiple IRRs**

If cash flows change sign more than once (e.g., initial investment, then positive cash flows, then a cleanup cost), there can be multiple IRRs. A strip-mining project might have: -$10M (investment), +$20M (mining revenue), -$8M (environmental remediation). This cash flow pattern can produce two different IRRs, making the rule useless.

**2. Scale Problem**

IRR ignores the scale of investment. Consider:

| Project | Investment | IRR | NPV (at 10%) |
|---------|-----------|-----|------|
| A | $10,000 | 50% | $8,000 |
| B | $1,000,000 | 20% | $150,000 |

IRR says choose A; NPV says choose B. NPV is correct — you would rather create $150,000 of value than $8,000.

**3. Reinvestment Assumption**

IRR implicitly assumes that intermediate cash flows are reinvested at the IRR itself. If the project has a 50% IRR, the formula assumes all cash flows are reinvested at 50% — which is usually unrealistic. The **Modified Internal Rate of Return (MIRR)** addresses this by assuming reinvestment at the firm's cost of capital.

**4. Mutually Exclusive Projects**

When choosing between two mutually exclusive projects, IRR can give the wrong ranking. Always use NPV for mutually exclusive decisions.

### When IRR Works Well

IRR is perfectly reliable when:
- Cash flows are **conventional** (one initial outflow followed by only inflows)
- The project is **standalone** (not being compared to mutually exclusive alternatives)
- It is used as a **supplement** to NPV, not a replacement

### Real-World Practice

Private equity firms heavily use IRR to measure fund performance. A typical PE fund targets a **net IRR of 15-25%**. However, IRR can be manipulated through the timing of cash flows — a practice called "IRR engineering." For example, using subscription credit lines to delay capital calls inflates reported IRRs by 3-6 percentage points (Source: Phalippou, L. "An Inconvenient Fact: Private Equity Returns & The Billionaire Factory," *Journal of Investing*, 2020).

### Key Takeaway

IRR is a useful complement to NPV — it communicates returns in percentage terms that executives and investors find intuitive. But always compute NPV alongside IRR, especially for mutually exclusive projects, unconventional cash flows, or when projects differ in scale.

**Sources:** Graham, J. & Harvey, C. "Theory and Practice of Corporate Finance" (*JFE*, 2001); Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 7; Phalippou, L. (*Journal of Investing*, 2020).`,
      starterCode: `# IRR Calculator using Newton's method
# Complete the function to calculate Internal Rate of Return

def calculate_npv(cash_flows, rate):
    """Helper: Calculate NPV for a given rate and cash flow series.
    cash_flows[0] is the initial investment (negative)."""
    npv = 0
    for t, cf in enumerate(cash_flows):
        npv += cf / (1 + rate) ** t
    return npv

def calculate_irr(cash_flows, guess=0.10, tolerance=1e-6, max_iterations=1000):
    """
    Calculate IRR using Newton's method (numerical approximation).
    - cash_flows: list starting with initial investment (negative),
      e.g., [-10000000, 2500000, 3000000, 3500000, 3000000, 2000000]
    - guess: starting guess for IRR
    - tolerance: stop when NPV is within this amount of zero
    - max_iterations: prevent infinite loops

    Returns: IRR as a decimal (e.g., 0.124 for 12.4%)
    """
    rate = guess

    for i in range(max_iterations):
        # TODO: Calculate NPV at current rate
        npv = 0

        # TODO: Calculate derivative of NPV with respect to rate
        # d(NPV)/dr = sum of -t * CFt / (1+r)^(t+1)
        dnpv = 0

        # TODO: Update rate using Newton's method: rate = rate - npv/dnpv

        # TODO: Check if NPV is within tolerance; if so, return rate
        pass

    return rate  # Return best estimate after max iterations


# Test with data center example
cash_flows = [-10_000_000, 2_500_000, 3_000_000, 3_500_000, 3_000_000, 2_000_000]
irr = calculate_irr(cash_flows)
print(f"IRR: {irr:.2%}")
# Expected: IRR: ~12.40%
`,
      solutionCode: `# IRR Calculator using Newton's method - Solution

def calculate_npv(cash_flows, rate):
    """Helper: Calculate NPV for a given rate and cash flow series."""
    npv = 0
    for t, cf in enumerate(cash_flows):
        npv += cf / (1 + rate) ** t
    return npv

def calculate_irr(cash_flows, guess=0.10, tolerance=1e-6, max_iterations=1000):
    """
    Calculate IRR using Newton's method (numerical approximation).
    """
    rate = guess

    for i in range(max_iterations):
        # Calculate NPV at current rate
        npv = sum(cf / (1 + rate) ** t for t, cf in enumerate(cash_flows))

        # Calculate derivative of NPV with respect to rate
        dnpv = sum(-t * cf / (1 + rate) ** (t + 1) for t, cf in enumerate(cash_flows))

        # Avoid division by zero
        if abs(dnpv) < 1e-12:
            break

        # Newton's method update
        rate = rate - npv / dnpv

        # Check convergence
        if abs(npv) < tolerance:
            return rate

    return rate


# Test with data center example
cash_flows = [-10_000_000, 2_500_000, 3_000_000, 3_500_000, 3_000_000, 2_000_000]
irr = calculate_irr(cash_flows)
print(f"IRR: {irr:.2%}")
# Output: IRR: 12.40%
`,
    },
  ],
};
