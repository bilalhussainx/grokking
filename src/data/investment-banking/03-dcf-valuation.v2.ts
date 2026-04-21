import { Module } from "../types";

export const dcfModule: Module = {
  id: "ib-dcf",
  title: "DCF Valuation",
  description: "Master the discounted cash flow methodology — from unlevered free cash flow to terminal value and sensitivity analysis.",
  lessons: [
    {
      id: "ib-dcf-unlevered-fcf",
      slug: "unlevered-free-cash-flow",
      title: "Unlevered Free Cash Flow",
      content: `## Unlevered Free Cash Flow

Unlevered Free Cash Flow (UFCF) is the cash a business generates that is available to **all** capital providers — both debt holders and equity holders. It is the foundation of the DCF valuation method and the single most important number in enterprise valuation.

### Why "Unlevered"?

The term "unlevered" means the cash flow is calculated **before** any debt payments. This is critical because a DCF values the entire enterprise (debt + equity), not just the equity. By using unlevered cash flows, we can value the business independent of its capital structure and then subtract net debt at the end to arrive at equity value.

### The UFCF Formula

Starting from EBIT (Earnings Before Interest and Taxes):

\`\`\`
Unlevered Free Cash Flow =
    EBIT
  x (1 - Tax Rate)            → NOPAT (Net Operating Profit After Tax)
  + Depreciation & Amortization → Add back non-cash charges
  - Capital Expenditures         → Subtract investment in fixed assets
  - Change in Net Working Capital → Subtract cash tied up in operations
\`\`\`

Let's walk through each component:

**EBIT x (1 - Tax Rate) = NOPAT**
We tax EBIT (not EBT) because we want the tax expense as if the company had no debt. The interest tax shield is captured in the discount rate (WACC), not in the cash flows. This avoids double-counting.

**Plus: Depreciation & Amortization (D&A)**
D&A is a non-cash expense that was already deducted to arrive at EBIT. Since it does not represent an actual cash outflow, we add it back. Note that D&A does provide a real tax benefit, which is captured in the NOPAT calculation.

**Minus: Capital Expenditures (CapEx)**
CapEx represents cash spent on property, plant, equipment, and other long-term assets. This is a real cash outflow that is necessary to maintain and grow the business. CapEx appears on the cash flow statement under investing activities.

**Minus: Change in Net Working Capital (NWC)**
As discussed in the working capital module, increases in NWC represent cash being absorbed by operations (more receivables, more inventory). Decreases in NWC release cash. The change in NWC is calculated as: Current Period NWC - Prior Period NWC.

### Worked Example

| Item | Amount |
|------|--------|
| Revenue | 1,000 |
| EBIT | 200 |
| Tax Rate | 25% |
| D&A | 50 |
| CapEx | 80 |
| Change in NWC | 15 |

UFCF = 200 x (1 - 0.25) + 50 - 80 - 15 = 150 + 50 - 80 - 15 = **105**

### UFCF vs. Levered Free Cash Flow

| Metric | Starts From | Deducts Interest? | Values |
|--------|------------|-------------------|--------|
| **Unlevered FCF** | EBIT | No | Enterprise (debt + equity) |
| **Levered FCF** | Net Income | Yes (already deducted) | Equity only |

In a DCF, we almost always use unlevered FCF discounted at WACC to arrive at enterprise value. Levered FCF discounted at the cost of equity is an alternative approach but is used less frequently.

### Common Mistakes

1. **Double-counting the tax shield**: If you use unlevered FCF, your discount rate (WACC) already accounts for the tax benefit of debt. Do not also subtract interest expense from cash flows.
2. **Forgetting NWC changes**: Especially for growing companies, increasing working capital can consume significant cash.
3. **Using net income instead of NOPAT**: Net income includes interest expense and is an equity-level metric, not an enterprise-level metric.
4. **Confusing signs**: An increase in NWC is a cash **outflow** (negative for UFCF), not an inflow.

### Key Takeaway

UFCF strips away capital structure effects and focuses on the pure operating cash generation of a business. It answers the question: "How much cash does this business produce for everyone who has a claim on it?" This makes it the right measure for enterprise valuation through DCF analysis.`,
    },
    {
      id: "ib-dcf-wacc",
      slug: "wacc-calculation",
      title: "WACC Calculation",
      content: `## WACC Calculation

The Weighted Average Cost of Capital (WACC) is the discount rate used in a DCF to convert future cash flows into present value. It represents the **blended cost of all capital sources** — both debt and equity — weighted by their proportions in the company's capital structure.

### The WACC Formula

\`\`\`
WACC = (E / V) x Re + (D / V) x Rd x (1 - T)
\`\`\`

Where:
- **E** = Market value of equity
- **D** = Market value of debt
- **V** = E + D (total firm value)
- **Re** = Cost of equity
- **Rd** = Cost of debt (pre-tax)
- **T** = Corporate tax rate

The (1 - T) factor on debt reflects the **tax shield** — interest payments are tax-deductible, making debt cheaper on an after-tax basis.

### Step 1: Cost of Equity (CAPM)

The most common method for estimating the cost of equity is the **Capital Asset Pricing Model (CAPM)**:

\`\`\`
Re = Rf + Beta x (Rm - Rf)
\`\`\`

| Variable | Description | Typical Source |
|----------|-------------|---------------|
| **Rf** | Risk-free rate | 10-year US Treasury yield |
| **Beta** | Systematic risk | Bloomberg, Capital IQ, regression analysis |
| **Rm - Rf** | Equity risk premium | Duff & Phelps, Damodaran (typically 5-7%) |

**Beta** measures how sensitive a stock is to market movements. A beta of 1.0 means the stock moves in line with the market. Above 1.0 means more volatile; below 1.0 means less volatile. For private companies, you use the **unlevered beta** of comparable public companies, then re-lever it to your target capital structure.

**Unlevering beta**: Beta_U = Beta_L / (1 + (1-T) x D/E)
**Re-levering beta**: Beta_L = Beta_U x (1 + (1-T) x D/E)

### Step 2: Cost of Debt

The cost of debt is the **yield to maturity** on the company's existing debt, or the rate at which the company could issue new debt today. Sources include:

- Yield on the company's publicly traded bonds
- Interest rate on recent bank loans
- Credit spread based on the company's credit rating plus the risk-free rate

For companies with multiple debt instruments, use a **weighted average** of the rates.

### Step 3: Capital Structure Weights

Use **market values**, not book values:

- **Equity**: Current share price x shares outstanding (market cap)
- **Debt**: Market value of outstanding bonds and loans (often approximated by book value for bank loans)

Some analysts use the **target capital structure** (where the company is heading) rather than the current structure, especially if the current structure is unusual (e.g., post-acquisition leverage).

### Worked Example

| Input | Value |
|-------|-------|
| Risk-free rate (Rf) | 4.0% |
| Equity risk premium | 6.0% |
| Levered beta | 1.2 |
| Cost of debt (pre-tax) | 5.5% |
| Tax rate | 25% |
| Market cap (E) | 800M |
| Debt (D) | 200M |

Cost of equity = 4.0% + 1.2 x 6.0% = **11.2%**
After-tax cost of debt = 5.5% x (1 - 0.25) = **4.125%**
WACC = (800/1000) x 11.2% + (200/1000) x 4.125% = 8.96% + 0.825% = **9.785%**

### Sensitivity

WACC is one of the most sensitive inputs in a DCF. A small change in WACC can swing valuation by 15-25%. Always present a sensitivity table showing how enterprise value changes across a range of WACC assumptions (e.g., 8% to 12% in 0.5% increments).

### Key Takeaway

WACC is not a single "right answer" — it is an informed estimate built from market data and judgment. The cost of equity (via CAPM) and cost of debt (via yields) are combined using market-value weights to produce a single discount rate that reflects the riskiness of the company's cash flows and the cost of its financing.`,
    },
    {
      id: "ib-dcf-terminal-value",
      slug: "terminal-value",
      title: "Terminal Value",
      content: `## Terminal Value

Terminal value represents the value of a company's cash flows **beyond the explicit forecast period**. In a typical 5-year DCF, terminal value often accounts for 60-80% of the total enterprise value. This makes it one of the most important — and most debated — components of any valuation.

### Why Terminal Value Exists

We cannot forecast individual cash flows forever. After 5-10 years of detailed projections, we need a single number that captures all future value from that point onward. Terminal value is that number.

### Two Methods for Calculating Terminal Value

**Method 1: Gordon Growth Model (Perpetuity Growth)**

\`\`\`
Terminal Value = FCF(n+1) / (WACC - g)
\`\`\`

Where:
- FCF(n+1) = Free cash flow in the first year after the forecast period
- WACC = Weighted average cost of capital
- g = Perpetual growth rate

The perpetual growth rate (g) is typically set between **2-3%**, approximating long-term GDP growth or inflation. Using a growth rate higher than GDP growth implies the company will eventually become larger than the entire economy — which is not realistic.

**FCF(n+1) = Final Year FCF x (1 + g)**

**Method 2: Exit Multiple Method**

\`\`\`
Terminal Value = Final Year EBITDA x Exit Multiple
\`\`\`

The exit multiple is based on current trading multiples for comparable companies (typically EV/EBITDA). If comparable companies trade at 10x EBITDA today, you might apply a similar multiple to the final year's projected EBITDA.

### Comparing the Two Methods

| Aspect | Gordon Growth | Exit Multiple |
|--------|--------------|---------------|
| Based on | Cash flow theory | Market-based valuation |
| Key assumption | Perpetual growth rate | Appropriate multiple |
| Sensitivity | Very sensitive to g and WACC | Sensitive to multiple choice |
| Common use | Primary method | Cross-check |

Best practice is to calculate terminal value using **both methods** and compare. If the two approaches produce materially different results, investigate why and determine which assumptions are more reasonable.

### Discounting Terminal Value

Terminal value is calculated as of the **last forecast year** and must be discounted back to the present:

\`\`\`
PV of Terminal Value = Terminal Value / (1 + WACC)^n
\`\`\`

Where n is the number of years in the forecast period.

### Worked Example

Assume:
- Year 5 FCF = 120M
- WACC = 10%
- Perpetual growth rate = 2.5%
- Year 5 EBITDA = 200M
- Exit EV/EBITDA multiple = 10x

**Gordon Growth:**
TV = 120 x (1.025) / (0.10 - 0.025) = 123 / 0.075 = **1,640M**

**Exit Multiple:**
TV = 200 x 10 = **2,000M**

The difference (1,640M vs. 2,000M) highlights the importance of cross-checking methods. The analyst would investigate whether the 10x multiple implies a growth rate higher than 2.5%, or whether the 2.5% growth rate is too conservative.

### Implied Growth Rate and Implied Multiple

You can back-solve between the two methods:

**Implied growth rate from exit multiple:**
g = WACC - FCF(n+1) / TV_exit_multiple

**Implied multiple from perpetuity growth:**
Implied multiple = TV_perpetuity / Final Year EBITDA

These cross-checks ensure your terminal value assumptions are internally consistent.

### Common Mistakes

1. **Growth rate exceeding WACC**: This makes the formula produce a negative terminal value — mathematically impossible for a going concern
2. **Growth rate too high**: Using 4-5% implies the company grows faster than the economy forever
3. **Inconsistent CapEx assumptions**: In the terminal year, CapEx should roughly equal D&A for a company growing at GDP rates
4. **Not discounting**: Forgetting to discount terminal value back to present

### Key Takeaway

Terminal value is the dominant driver of DCF valuation, which means your growth rate and exit multiple assumptions deserve extra scrutiny. Always use both methods as cross-checks, sanity-test the implied growth rate or implied multiple, and present sensitivities to help decision-makers understand the range of possible outcomes.`,
    },
    {
      id: "ib-dcf-sensitivity",
      slug: "sensitivity-tables",
      title: "Sensitivity Tables",
      content: `## Sensitivity Tables

A DCF produces a single point estimate of value, but every input is uncertain. Sensitivity tables (also called data tables) show how valuation changes as key assumptions vary, transforming a single number into a range of outcomes. They are the primary tool for communicating uncertainty in investment banking.

### Why Sensitivity Analysis Matters

Consider a DCF where you estimate enterprise value at 1.5 billion dollars. Your managing director will immediately ask: "What happens if growth is 1% lower?" or "What if WACC is 50 basis points higher?" Without a sensitivity table, you would need to manually adjust your model for each scenario. With one, all the answers are on a single page.

### The Standard Two-Variable Sensitivity Table

The most common format varies **two inputs simultaneously** and shows the resulting output in a matrix:

**WACC vs. Perpetual Growth Rate → Enterprise Value**

|  | g = 1.5% | g = 2.0% | g = 2.5% | g = 3.0% | g = 3.5% |
|--|----------|----------|----------|----------|----------|
| **WACC 8.0%** | 1,846 | 2,050 | 2,309 | 2,640 | 3,078 |
| **WACC 8.5%** | 1,671 | 1,843 | 2,050 | 2,309 | 2,640 |
| **WACC 9.0%** | 1,529 | 1,671 | 1,843 | 2,050 | 2,309 |
| **WACC 9.5%** | 1,410 | 1,529 | 1,671 | 1,843 | 2,050 |
| **WACC 10.0%** | 1,308 | 1,410 | 1,529 | 1,671 | 1,843 |

The base case (highlighted in a real model) might be WACC 9.0% and g = 2.5%, yielding 1,843. But the table shows the range spans from 1,308 to 3,078 — a factor of 2.4x difference depending on assumptions.

### Common Sensitivity Pairs

| Table | Variable 1 | Variable 2 | Output |
|-------|-----------|-----------|--------|
| 1 | WACC | Terminal growth rate | Enterprise value |
| 2 | WACC | Exit EBITDA multiple | Enterprise value |
| 3 | Revenue growth | EBITDA margin | Enterprise value |
| 4 | Entry price | Exit multiple | IRR (for LBOs) |
| 5 | Revenue growth | Terminal growth rate | Implied share price |

### Building Effective Sensitivity Tables

**Choose meaningful ranges.** Your ranges should span the plausible range of outcomes — not absurdly wide or trivially narrow. For WACC, plus or minus 1-2% from your base case is typical. For growth rates, plus or minus 1-1.5%.

**Highlight the base case.** Use bold text, a border, or shading to make it immediately clear which cell represents your primary estimate.

**Include implied metrics.** If your table shows enterprise value, add a row below showing the implied share price or the implied EV/EBITDA multiple for context.

**Show the delta.** Some analysts add a column or row showing the percentage change from the base case, making it easy to see sensitivity magnitude.

### Scenario Analysis vs. Sensitivity Analysis

Sensitivity analysis varies one or two inputs mechanically. **Scenario analysis** tells a story — it defines coherent sets of assumptions that represent different futures:

| Scenario | Revenue Growth | Margin | CapEx | WACC | EV |
|----------|---------------|--------|-------|------|-----|
| Bull case | 12% | 28% | Low | 8.5% | 2,200 |
| Base case | 8% | 25% | Normal | 9.5% | 1,600 |
| Bear case | 3% | 20% | High | 11.0% | 950 |

Scenarios are more realistic because they link assumptions logically (in a recession, growth is lower AND margins are compressed AND risk premiums are higher). Sensitivity tables vary inputs independently, which can produce unrealistic combinations.

### Presenting to Clients

When presenting valuation to a client or investment committee:

1. Lead with the base case and methodology
2. Show the sensitivity table to demonstrate the range
3. Discuss which scenarios are most relevant given current market conditions
4. Use the "football field" chart (horizontal bar chart) to show how different valuation methods produce different ranges

### Key Takeaway

Sensitivity analysis acknowledges that valuation is inherently uncertain. The goal is not to produce a single "correct" number but to define a defensible range and understand which assumptions drive the most value creation or destruction. A well-built sensitivity table is the most powerful single page in any valuation presentation.`,
    },
    {
      id: "ib-dcf-common-mistakes",
      slug: "dcf-common-mistakes",
      title: "Common DCF Mistakes",
      content: `## Common DCF Mistakes

The DCF is the most theoretically grounded valuation method, but it is also the easiest to get wrong. Small errors in methodology or assumptions can produce valuations that are off by 30-50% or more. Learning to identify and avoid these mistakes is what separates competent analysts from exceptional ones.

### Mistake 1: Mismatching Cash Flows and Discount Rates

This is the most fundamental error in DCF analysis. The rule is simple:

- **Unlevered free cash flow** (to the firm) must be discounted at **WACC**
- **Levered free cash flow** (to equity) must be discounted at the **cost of equity**

If you discount unlevered cash flows at the cost of equity, you will undervalue the company (the discount rate is too high). If you discount levered cash flows at WACC, you will overvalue it (the discount rate is too low). This mismatch is surprisingly common, especially in models that have been edited by multiple people.

### Mistake 2: Unrealistic Terminal Growth Rate

The terminal growth rate should approximate long-term nominal GDP growth (2-3% in developed economies). Common errors include:

- **Using the company's current growth rate** (15%) as the terminal rate — this implies the company eventually becomes larger than the entire economy
- **Using real GDP growth** instead of nominal — forget to add inflation
- **Using zero** — implies the company's cash flows never grow, which ignores inflation

A good sanity check: calculate the implied terminal year EBITDA multiple from your perpetuity growth rate. If it implies 20x EBITDA for a mature industrial company, something is wrong.

### Mistake 3: Inconsistent Terminal Year Assumptions

In the terminal year, the company should look like a **steady-state mature business**. This means:

- CapEx should approximately equal depreciation (the company is maintaining, not aggressively expanding)
- Working capital changes should be modest
- Margins should be sustainable, not at cyclical peaks
- Revenue growth should have decelerated to the terminal rate

A common mistake is projecting aggressive growth and high margins through Year 5, then slapping a 2.5% terminal growth rate on Year 6 cash flows. The jump from 15% growth to 2.5% growth creates an unrealistic cliff that distorts valuation.

### Mistake 4: Double-Counting the Tax Shield

In a WACC-based DCF:
- The tax benefit of debt is captured in WACC through the (1 - T) factor on the cost of debt
- Cash flows should be calculated as if the company were **all-equity financed** (NOPAT)

If you also deduct interest expense from cash flows AND use WACC as the discount rate, you are counting the tax shield twice. This error consistently overvalues companies.

### Mistake 5: Wrong Mid-Year Convention

Cash flows do not arrive on December 31st — they are earned throughout the year. The **mid-year convention** adjusts discount factors to reflect this:

- Without mid-year: Discount factor for Year 1 = 1 / (1 + WACC)^1
- With mid-year: Discount factor for Year 1 = 1 / (1 + WACC)^0.5

Forgetting the mid-year convention typically undervalues the company by 3-5%, depending on the discount rate and projection length.

### Mistake 6: Ignoring Net Working Capital Changes

Growing companies require increasing working capital — more inventory, more receivables. Forgetting to model NWC changes overstates free cash flow because it assumes the company can grow revenue without investing in operations.

For a company growing at 10% with NWC equal to 15% of revenue, the annual NWC increase consumes 1.5% of revenue in cash — a meaningful drag on free cash flow.

### Mistake 7: Using the Wrong Share Count

When converting enterprise value to equity value per share, use the **diluted share count**, not the basic share count. Diluted shares include the effect of stock options, warrants, restricted stock units, and convertible securities.

The treasury stock method (TSM) is the standard approach: assume in-the-money options are exercised, the company receives the exercise proceeds, and buys back shares at the current price. The net increase in shares is the dilutive effect.

### Mistake 8: Circular Reference Panic

If your model has a debt schedule (where interest depends on the debt balance, which depends on cash flow, which depends on interest), you have a circular reference. This is **normal and expected** in a three-statement model. Solutions include:

- Enable iterative calculations in your spreadsheet settings
- Use a copy-paste macro to break the circularity
- Approximate with prior-period balance for interest calculation

Do NOT remove the circularity by hard-coding interest expense — this breaks the model's dynamic behavior.

### The Quality Checklist

Before presenting any DCF, verify:

- [ ] Cash flows and discount rate are consistent (UFCF with WACC or LFCF with Ke)
- [ ] Terminal growth rate is 2-3% (developed markets)
- [ ] Terminal year CapEx is close to depreciation
- [ ] NWC changes are modeled
- [ ] Mid-year convention is applied consistently
- [ ] Diluted share count is used for per-share value
- [ ] Sensitivity tables are included for WACC and terminal value assumptions
- [ ] Implied metrics (exit multiple, growth rate) are sanity-checked

### Key Takeaway

Most DCF errors stem from a few common sources: mismatching cash flows and discount rates, unrealistic terminal assumptions, and forgetting working capital. A disciplined approach — building the model methodically, cross-checking implied metrics, and running sensitivities — catches these errors before they reach a client or investment committee.`,
    },
  ],
};
