import { Module } from "../types";

export const lboModelModule: Module = {
  id: "fm-lbo",
  title: "LBO Model",
  description: "Build a leveraged buyout model from sources and uses through debt schedules, cash flow sweeps, and returns analysis.",
  lessons: [
    {
      id: "fm-lbo-sources-uses",
      slug: "lbo-sources-and-uses",
      title: "Sources & Uses Table",
      content: `## Sources & Uses Table

The Sources & Uses table is the blueprint of an LBO — it defines how the acquisition is funded and what the money is used for. Building it correctly is the essential first step because every other part of the LBO model (debt schedule, returns analysis) depends on the capital structure established here.

### Building the Uses Side

Calculate total capital required:

1. **Enterprise Value**: Entry multiple x LTM or NTM EBITDA. This is the price paid for the business.
2. **Transaction fees**: Advisory fees (1-2% of EV), legal, accounting. Typically 2-3% of EV combined.
3. **Financing fees**: Arrangement fees for debt facilities (1-3% of total debt). These are capitalized and amortized over the loan term.
4. **Refinancing of existing debt**: If the target has existing debt that must be repaid at close.
5. **Cash to balance sheet**: Minimum operating cash needed post-close (often 2-5% of revenue).

Total Uses = EV + Transaction Fees + Financing Fees + Refinancing + Cash to BS

### Building the Sources Side

Determine how to fund the total uses:

For each debt tranche, define the amount based on leverage multiples or absolute amounts. The sponsor equity is the residual — whatever the debt does not cover, equity must fund.

Typical LBO capital structure (2024 market):

| Source | Multiple of EBITDA | Rate | Terms |
|--------|-------------------|------|-------|
| Revolver | 1.0-2.0x (capacity) | SOFR + 250-350bp | Undrawn at close |
| Term Loan B | 3.0-4.0x | SOFR + 350-500bp | 1% annual amortization |
| Senior Notes | 1.0-2.0x | 7.0-10.0% fixed | Bullet maturity |
| Sponsor Equity | Residual | Target 20%+ IRR | 3-7 year hold |

### Key Metrics from the S&U Table

After completing the table, calculate and display:

- **Total leverage**: Total debt / EBITDA
- **Senior leverage**: Senior secured debt / EBITDA
- **Equity contribution %**: Sponsor equity / Total sources
- **Loan-to-value**: Total debt / Enterprise value
- **Interest coverage**: EBITDA / Total interest expense (Year 1)

These metrics must satisfy lender requirements. If leverage is too high, reduce debt and increase equity (which lowers returns). If leverage is too low, the sponsor is not maximizing returns.

### Sensitivity to Entry Price

The entry multiple is the most debated assumption. Show how the capital structure changes at different entry prices:

| Entry Multiple | EV | Total Debt (5.0x) | Equity Check | Equity % |
|---------------|-----|-------------------|-------------|----------|
| 8.0x | 800M | 500M | 340M | 40.5% |
| 9.0x | 900M | 500M | 440M | 46.8% |
| 10.0x | 1,000M | 500M | 540M | 51.9% |
| 11.0x | 1,100M | 500M | 640M | 55.7% |

Higher entry multiples require more equity (at constant debt levels), reducing potential returns.

### Key Takeaway

The Sources & Uses table establishes the financial architecture of the LBO. Every decision made here — leverage level, debt mix, equity contribution — determines the risk and return profile for the entire investment. Build it first, validate the metrics against market norms and lender requirements, and use it as the foundation for the rest of the model.`,
    },
    {
      id: "fm-lbo-debt-schedule",
      slug: "lbo-debt-schedule",
      title: "Debt Schedule",
      content: `## Debt Schedule

The debt schedule is the engine of an LBO model. It tracks every debt tranche from closing through exit — balances, interest payments, mandatory amortization, and optional prepayments. It creates the circularity that makes LBO models technically challenging but also what makes them dynamic and powerful.

### Structure for Each Debt Tranche

For each debt instrument, build these rows:

| Row | Calculation |
|-----|-------------|
| Beginning Balance | Prior period ending balance |
| (+) New Draws | Revolver draws if cash is short |
| (-) Mandatory Amortization | Scheduled principal payments |
| (-) Optional Prepayment | Cash sweep from excess cash flow |
| Ending Balance | Beginning + Draws - Mandatory - Optional |
| Average Balance | (Beginning + Ending) / 2 |
| Interest Rate | SOFR + spread (or fixed coupon) |
| Interest Expense | Average Balance x Interest Rate |

### Mandatory Amortization

Each debt tranche has a predefined amortization schedule:

- **Revolver**: No scheduled amortization (draw and repay as needed)
- **Term Loan A**: 5-10% per year, with the remainder at maturity
- **Term Loan B**: 1% per year (0.25% quarterly), bullet at maturity
- **Senior Notes**: 0% amortization, 100% due at maturity
- **Subordinated Notes**: 0% amortization, 100% due at maturity

### The Cash Sweep Mechanism

A cash sweep (also called excess cash flow sweep) uses available cash to make optional prepayments beyond mandatory amortization. The sweep follows the debt repayment waterfall — senior debt is repaid first.

**Cash available for sweep:**
\`\`\`
EBITDA
- Cash Interest Expense
- Cash Taxes
- Capital Expenditures
- Change in Working Capital
- Mandatory Debt Amortization
- Other Required Payments
= Excess Cash Flow

Cash Available for Sweep = Excess Cash Flow x Sweep Percentage
                          (typically 50-75% of excess cash flow)
\`\`\`

The remainder (25-50%) is retained as cash on the balance sheet.

**Sweep priority (waterfall):**
1. Revolver (repay drawn balance first)
2. Term Loan A (if outstanding)
3. Term Loan B
4. Senior Notes (if callable — check call schedule)
5. Subordinated Notes (if callable)

For each tranche, the sweep repayment cannot exceed the outstanding balance. Any excess flows to the next tranche in the waterfall.

### Revolver Mechanics

The revolver requires special logic because it can be drawn and repaid:

\`\`\`
If Cash Before Revolver < Minimum Cash Balance:
    Revolver Draw = Minimum Cash - Cash Before Revolver
Else:
    Revolver Repayment = MIN(Revolver Balance,
                             Cash Before Revolver - Minimum Cash)
\`\`\`

The revolver acts as a shock absorber — it prevents cash from going negative in lean years and is repaid when cash flow recovers.

### Interest Rate Mechanics

**Floating rate debt** (revolver, term loans):
Interest = Balance x (SOFR + Spread)
Include a SOFR floor if specified in the credit agreement.

**Fixed rate debt** (senior notes, high-yield bonds):
Interest = Balance x Fixed Coupon Rate

**PIK (Payment-In-Kind) debt**:
PIK Interest = Balance x PIK Rate
The interest is added to the principal balance instead of being paid in cash.
New Balance = Old Balance + PIK Interest

### The Circularity

The debt schedule creates circularity:
Interest expense affects net income, which affects cash flow, which affects debt repayment, which affects the debt balance, which affects interest expense.

Resolution: Enable iterative calculations (most common) or use the beginning balance for interest calculation (approximation).

### Key Takeaway

The debt schedule is the mechanical heart of an LBO model. It must correctly track mandatory amortization, implement the cash sweep waterfall, handle revolver draws and repayments, and calculate interest for each debt tranche. Getting the debt schedule right is essential because it directly determines how quickly debt is repaid — which is the primary driver of equity returns in most LBOs.`,
    },
    {
      id: "fm-lbo-cash-flow-sweep",
      slug: "cash-flow-sweep",
      title: "Cash Flow Sweep",
      content: `## Cash Flow Sweep

The cash flow sweep is the mechanism that channels excess cash flow toward debt repayment in an LBO. It is the bridge between the operating model (how much cash the business generates) and the debt schedule (how quickly debt is repaid). Building the sweep correctly is essential because debt paydown is typically the largest source of equity returns in an LBO.

### The Complete Cash Flow Waterfall

The cash flow waterfall determines, step by step, where each dollar of cash goes:

\`\`\`
EBITDA
- Cash Interest Expense (all tranches)
- Cash Taxes
= After-Tax Cash Flow

- Maintenance CapEx
- Growth CapEx
- Change in Working Capital
= Free Cash Flow Before Debt Service

- Mandatory Debt Amortization (scheduled payments)
= Cash Available for Sweep

x Sweep Percentage (per credit agreement, typically 50-75%)
= Cash Applied to Optional Debt Repayment

Remainder = Cash Added to Balance Sheet
\`\`\`

### Sweep Percentage Provisions

Most credit agreements specify what percentage of excess cash flow must be used for debt repayment. Common structures:

| Leverage Level | Required Sweep % |
|---------------|-----------------|
| Above 4.0x Debt/EBITDA | 75% of excess cash flow |
| 3.0x - 4.0x | 50% of excess cash flow |
| Below 3.0x | 25% of excess cash flow |

As leverage decreases, the company keeps more cash. This incentivizes rapid debt paydown in the early years while allowing the company to retain cash for reinvestment as leverage improves.

### Building the Sweep in the Model

The sweep is calculated in a specific order each period:

**Step 1**: Calculate free cash flow before debt service (from the operating model)

**Step 2**: Subtract mandatory amortization for each tranche

**Step 3**: Calculate cash available for sweep

**Step 4**: Apply the sweep percentage

**Step 5**: Allocate the sweep amount through the debt waterfall:

For each tranche (in priority order):
\`\`\`
Sweep to This Tranche = MIN(Remaining Sweep Amount,
                            Tranche Balance Before Sweep)
Remaining Sweep Amount = Remaining Sweep Amount - Sweep Applied
\`\`\`

Continue until the sweep amount is exhausted or all eligible debt is repaid.

**Step 6**: Calculate ending cash balance

\`\`\`
Ending Cash = Beginning Cash + Free Cash Flow
            - Mandatory Amortization - Sweep Payments
            +/- Revolver Draws/Repayments
\`\`\`

### Practical Modeling Tip: Build an Intermediate Table

Create a clear intermediate calculation table:

| Item | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|------|--------|--------|--------|--------|--------|
| EBITDA | 150 | 160 | 172 | 185 | 199 |
| (-) Cash Interest | (42) | (38) | (34) | (29) | (25) |
| (-) Cash Taxes | (22) | (25) | (29) | (33) | (37) |
| (-) CapEx | (30) | (32) | (34) | (37) | (40) |
| (-) Change in NWC | (5) | (5) | (6) | (6) | (7) |
| **Free Cash Flow** | **51** | **60** | **69** | **80** | **90** |
| (-) Mandatory Amort. | (6) | (6) | (6) | (6) | (6) |
| **Available for Sweep** | **45** | **54** | **63** | **74** | **84** |
| Sweep (75%) | (34) | (41) | (47) | (56) | (63) |
| **Cash Retained** | **11** | **13** | **16** | **18** | **21** |

### The Impact on Returns

The cash sweep is one of the most powerful drivers of LBO returns. Compare scenarios:

| Scenario | Debt Repaid Over 5 Years | Exit Equity | MOIC |
|----------|------------------------|-------------|------|
| No sweep (mandatory only) | 30M | 680M | 1.7x |
| 50% sweep | 160M | 810M | 2.0x |
| 75% sweep | 210M | 860M | 2.2x |
| 100% sweep | 270M | 920M | 2.3x |

More aggressive sweeps accelerate debt repayment and boost returns — but leave the company with less cash flexibility.

### Key Takeaway

The cash flow sweep is the primary mechanism through which LBO equity value is created over time. It systematically channels operating cash flow toward debt reduction, transferring value from lenders to equity holders. Building the sweep correctly — with proper waterfall priority, sweep percentage calculations, and revolver interaction — is what separates a basic LBO model from a professional one.`,
    },
    {
      id: "fm-lbo-returns-waterfall",
      slug: "returns-waterfall",
      title: "Returns Waterfall",
      content: `## Returns Waterfall

The returns waterfall is the final output of an LBO model — it calculates how much money the private equity sponsor makes (or loses) and attributes the return to its underlying sources. This is the page that the investment committee reviews when deciding whether to approve a deal.

### Exit Equity Calculation

At the end of the holding period:

\`\`\`
Exit Enterprise Value = Exit Year EBITDA x Exit Multiple
- Net Debt at Exit (Total Debt - Cash)
- Transaction Fees at Exit (1-2% of exit EV)
= Gross Equity Proceeds

- Management Equity (management's share of equity)
= Sponsor Equity Proceeds
\`\`\`

### Return Metrics

**MOIC (Multiple of Invested Capital):**
\`\`\`
MOIC = Total Equity Proceeds / Initial Equity Invested
\`\`\`
Includes any interim cash flows (dividend recaps, monitoring fees).

**IRR (Internal Rate of Return):**
The annualized return rate that makes NPV of all cash flows equal zero:
\`\`\`
0 = -Equity Invested
    + Interim CF1 / (1+IRR)^1
    + Interim CF2 / (1+IRR)^2
    + ...
    + Exit Proceeds / (1+IRR)^n
\`\`\`

### Return Attribution

Break down total return into its sources to understand what is driving value:

**Source 1: EBITDA Growth**
\`\`\`
Value from EBITDA Growth = (Exit EBITDA - Entry EBITDA) x Entry Multiple
\`\`\`
This captures value created by improving the business — revenue growth, margin expansion, operational efficiency.

**Source 2: Multiple Expansion**
\`\`\`
Value from Multiple Expansion = Entry EBITDA x (Exit Multiple - Entry Multiple)
\`\`\`
This captures value from selling at a higher multiple than you bought — often driven by market conditions, company repositioning, or size premium.

**Source 3: Debt Paydown**
\`\`\`
Value from Debt Paydown = Total Debt Repaid During Hold Period
\`\`\`
Every dollar of debt repaid transfers value from lenders to equity.

**Interaction Term:**
\`\`\`
Interaction = (Exit EBITDA - Entry EBITDA) x (Exit Multiple - Entry Multiple)
\`\`\`
This captures the combined effect of growth AND multiple expansion. It is typically included in the EBITDA growth attribution or shown separately.

**Verification:**
\`\`\`
Exit Equity - Entry Equity = EBITDA Growth Value
                            + Multiple Expansion Value
                            + Debt Paydown Value
                            + Interaction
                            - Fees and Transaction Costs
\`\`\`

### Example Return Attribution

| Source | Value Created | % of Total |
|--------|---------------|-----------|
| EBITDA Growth (100M to 140M at 10x) | 400M | 45% |
| Multiple Expansion (10x to 11x at 100M) | 100M | 11% |
| Debt Paydown | 250M | 28% |
| Interaction (40M x 1.0x) | 40M | 5% |
| Less: Fees | (50M) | (6%) |
| **Total Value Created** | **740M** | |
| Entry Equity | 400M | |
| **Exit Equity** | **1,140M** | |
| **MOIC** | **2.85x** | |

### Returns at Different Exit Points

Present returns across multiple exit years and multiples:

| | Exit at 8x | Exit at 9x | Exit at 10x | Exit at 11x |
|--|-----------|-----------|------------|------------|
| **Year 3** | 1.4x / 12% | 1.7x / 19% | 2.0x / 26% | 2.3x / 32% |
| **Year 4** | 1.6x / 12% | 1.9x / 17% | 2.2x / 22% | 2.5x / 26% |
| **Year 5** | 1.7x / 11% | 2.1x / 16% | 2.5x / 20% | 2.9x / 24% |
| **Year 6** | 1.9x / 11% | 2.3x / 15% | 2.7x / 18% | 3.1x / 21% |

Format: MOIC / IRR. This matrix shows the investment committee the full range of outcomes.

### What the Committee Looks For

When reviewing an LBO return analysis, the investment committee evaluates:

1. **Base case returns**: Does the deal meet the fund's return hurdle (typically 20%+ IRR, 2.0x+ MOIC)?
2. **Downside protection**: In the bear case, is the equity protected? Can the company service its debt?
3. **Return composition**: How dependent are returns on multiple expansion vs. operational improvement? (Operational improvement is more controllable)
4. **Exit visibility**: Is there a clear path to exit? Who are the likely buyers?
5. **Key risks**: What could go wrong, and how severe would the impact be?

### Key Takeaway

The returns waterfall is the culmination of the entire LBO model — it converts all the operating projections, debt mechanics, and exit assumptions into the metrics that determine whether a deal gets done. A clear, well-attributed returns analysis helps the investment committee understand not just the expected return but the sources and risks of that return.`,
    },
    {
      id: "fm-lbo-sensitivity",
      slug: "lbo-sensitivity-analysis",
      title: "LBO Sensitivity Analysis",
      content: `## LBO Sensitivity Analysis

In an LBO, sensitivity analysis is not a nice-to-have — it is the primary tool for understanding deal risk. Private equity investments are inherently uncertain: EBITDA may not grow as projected, the exit multiple may compress, and debt paydown may be slower than modeled. Sensitivity tables quantify these risks and help the investment committee make informed go/no-go decisions.

### The Core LBO Sensitivity Tables

**Table 1: Entry Multiple vs. Exit Multiple (IRR)**

This is the most important sensitivity table — it shows returns across a range of purchase prices and exit valuations:

| | Exit 8.0x | Exit 9.0x | Exit 10.0x | Exit 11.0x | Exit 12.0x |
|--|----------|----------|-----------|-----------|-----------|
| **Entry 8.0x** | 16.2% | 21.4% | 26.1% | 30.4% | 34.3% |
| **Entry 9.0x** | 11.8% | 16.5% | 20.8% | 24.7% | 28.3% |
| **Entry 10.0x** | 8.1% | 12.4% | 16.4% | 20.0% | 23.3% |
| **Entry 11.0x** | 4.9% | 9.0% | 12.7% | 16.1% | 19.3% |

The diagonal (entry = exit multiple) shows returns from EBITDA growth and debt paydown alone, with no multiple expansion. Below the diagonal, multiple compression destroys value. Above the diagonal, multiple expansion creates additional value.

**Table 2: Revenue Growth vs. EBITDA Margin (IRR)**

Shows how sensitive returns are to operational performance:

| | Margin 22% | Margin 24% | Margin 26% | Margin 28% |
|--|-----------|-----------|-----------|-----------|
| **Growth 3%** | 10.1% | 12.8% | 15.3% | 17.6% |
| **Growth 5%** | 13.4% | 16.1% | 18.6% | 20.9% |
| **Growth 7%** | 16.5% | 19.2% | 21.7% | 24.0% |
| **Growth 9%** | 19.4% | 22.1% | 24.6% | 26.9% |

This table shows how much the operating thesis matters — the difference between 3% and 9% revenue growth can be 10+ percentage points of IRR.

**Table 3: Entry Multiple vs. Leverage (MOIC)**

Shows how leverage amplifies or reduces returns:

| | 4.0x Leverage | 5.0x Leverage | 6.0x Leverage |
|--|-------------|-------------|-------------|
| **Entry 8.0x** | 2.4x | 2.8x | 3.3x |
| **Entry 9.0x** | 2.1x | 2.4x | 2.8x |
| **Entry 10.0x** | 1.9x | 2.1x | 2.4x |
| **Entry 11.0x** | 1.7x | 1.9x | 2.1x |

Higher leverage boosts returns when the deal goes well but increases risk if it does not.

### Scenario Analysis

Beyond mechanical sensitivity tables, build coherent scenarios:

**Bull Case:**
- Revenue grows 10% per year (market tailwinds, successful new products)
- EBITDA margin expands 200bp (cost optimization, operating leverage)
- Exit at 11x (premium to entry due to improved profile)
- Result: 3.2x MOIC, 28% IRR

**Base Case:**
- Revenue grows 6% per year (in-line with management plan)
- EBITDA margin stable (modest improvements offset by inflation)
- Exit at 10x (same as entry)
- Result: 2.3x MOIC, 20% IRR

**Bear Case:**
- Revenue grows 2% per year (economic slowdown, competitive pressure)
- EBITDA margin compresses 150bp (input cost inflation, pricing pressure)
- Exit at 8.5x (multiple compression due to lower growth)
- Result: 1.4x MOIC, 7% IRR

**Stress Case:**
- Revenue declines 5% in Year 1, flat in Year 2, slow recovery
- EBITDA margin compresses 300bp
- Exit at 7.0x
- Result: 0.8x MOIC, -5% IRR (loss on investment)
- Key question: Can the company still service its debt? If not, the loss could be total.

### Credit Analysis in Sensitivity

For the stress case, run credit metrics to ensure the company can survive:

| Metric | Year 1 | Year 2 | Year 3 | Covenant |
|--------|--------|--------|--------|----------|
| Total Leverage (Debt/EBITDA) | 6.8x | 6.5x | 6.0x | Max 7.0x |
| Interest Coverage (EBITDA/Interest) | 2.1x | 2.2x | 2.4x | Min 1.5x |
| Fixed Charge Coverage | 1.4x | 1.5x | 1.6x | Min 1.0x |
| Cash Balance | 25M | 18M | 22M | Min 10M |

If the stress case breaches covenants, the deal has significant downside risk. The investment committee will want to understand how likely the stress scenario is and what remediation options exist.

### Presenting Sensitivity Analysis

**Format guidelines:**
- Highlight the base case cell in each table
- Use conditional formatting (green for target returns, yellow for marginal, red for below threshold)
- Show both MOIC and IRR in separate tables (or combined with MOIC / IRR format)
- Include a narrative explaining the key risk factors and their likelihood

### Key Takeaway

Sensitivity analysis is where the LBO model delivers its most valuable output — not the point estimate of returns, but the range of possible outcomes and the factors that drive them. A deal that looks great in the base case but terrible in a realistic downside scenario is fundamentally different from one that delivers solid returns even under stress. The best investment decisions are made by understanding the full distribution of outcomes, not just the most likely one.`,
    },
  ],
};
