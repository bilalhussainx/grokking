import { Module } from "../types";

export const dcfModelModule: Module = {
  id: "fm-dcf",
  title: "DCF Model",
  description:
    "Build a complete DCF valuation model from revenue build to equity bridge.",
  lessons: [
    {
      id: "fm-dcf-revenue-build",
      slug: "revenue-build",
      title: "Revenue Build",
      content: `## Revenue Build

The revenue build is the foundation of a DCF model. It translates business assumptions — unit volumes, pricing, market growth, customer count — into projected revenue figures. The quality of your DCF depends directly on the quality of your revenue projections, making this the section that deserves the most analytical rigor.

### Approaches by Business Type

Different business models require different revenue build approaches:

**Product-Based Business (Manufacturing, Consumer Goods)**
\`\`\`
Revenue = Units Sold x Average Selling Price (ASP)
\`\`\`
Project units based on market demand, capacity, and market share. Project ASP based on pricing trends, competition, and inflation.

**Subscription/SaaS Business**
\`\`\`
Revenue = Beginning Subscribers + New Subscribers - Churned Subscribers
         x Average Revenue Per User (ARPU)
\`\`\`
Or using the ARR framework:
\`\`\`
Ending ARR = Beginning ARR + New ARR + Expansion ARR - Churned ARR
\`\`\`
Key metrics: Net Revenue Retention (NRR), Gross Churn, Customer Acquisition Cost (CAC).

**Retail Business**
\`\`\`
Revenue = Same-Store Sales + New Store Revenue
Same-Store Sales = Prior Year Revenue x (1 + Same-Store Growth)
New Store Revenue = New Stores Opened x Revenue per New Store
\`\`\`

**Financial Services (Bank)**
\`\`\`
Net Interest Income = Average Earning Assets x Net Interest Margin
Fee Income = Transaction Volume x Fee per Transaction
\`\`\`

### Multi-Segment Revenue Build

Most companies have multiple revenue streams. Build each segment separately:

| Segment | Year 1 | Growth | Year 2 | Growth | Year 3 |
|---------|--------|--------|--------|--------|--------|
| Hardware | 800 | 3% | 824 | 2% | 840 |
| Software | 400 | 15% | 460 | 12% | 515 |
| Services | 200 | 8% | 216 | 7% | 231 |
| **Total** | **1,400** | | **1,500** | | **1,587** |

This approach is more defensible because each segment has its own growth logic. It also allows you to model margin differences across segments.

### Validating Revenue Projections

Always cross-check your revenue projections against:

**Top-down analysis**: Total Addressable Market x Expected Market Share. If your projection implies market share growing from 5% to 30% in 5 years, that is probably unrealistic.

**Consensus estimates**: How do your projections compare to analyst forecasts? Material differences need justification.

**Management guidance**: Has management provided revenue guidance or targets? Models should at least acknowledge this benchmark.

**Historical growth rates**: What has the company's actual growth been? Projects that assume a dramatic acceleration or deceleration need strong supporting evidence.

**Capacity constraints**: Can the company physically deliver this much revenue? Do they have enough manufacturing capacity, employees, or infrastructure?

### Deceleration Curves

High-growth companies rarely maintain their growth rates indefinitely. Model realistic deceleration:

| Year | Revenue | Growth Rate |
|------|---------|------------|
| Historical | 500 | 25% |
| Year 1 | 613 | 22% |
| Year 2 | 735 | 20% |
| Year 3 | 862 | 17% |
| Year 4 | 993 | 15% |
| Year 5 | 1,123 | 13% |
| Terminal | | 2.5% |

The key is to create a believable bridge from current growth to the terminal growth rate (typically 2-3%).

### Key Takeaway

The revenue build is where financial modeling meets business analysis. A great revenue build is not just a growth rate plugged into a spreadsheet — it is a bottoms-up construction based on business drivers, validated against top-down market data, and stress-tested for reasonableness. This is the section where the most time should be invested because every other line item in the model depends on it.`,
    },
    {
      id: "fm-dcf-operating-model",
      slug: "operating-model",
      title: "Operating Model",
      content: `## Operating Model

The operating model translates revenue projections into profitability by modeling costs, expenses, and margins. It sits between the revenue build and the free cash flow projection, and its quality determines whether your DCF produces a realistic valuation or a fantasy.

### Modeling Cost of Goods Sold (COGS)

COGS represents the direct costs of producing the goods or services sold. Projection approaches:

**Percentage of revenue (most common):**
Projected COGS = Revenue x COGS Margin Assumption

Analyze historical COGS as a percentage of revenue. If the company has been at 60% consistently, project 60% unless there is a specific reason for change (economies of scale, input cost changes, product mix shift).

**Driver-based (more detailed):**
Break COGS into components:
- Raw materials: Volume x Unit material cost (adjusted for commodity prices)
- Direct labor: Headcount x Average cost per employee
- Manufacturing overhead: Fixed portion + Variable portion (% of revenue)

### Modeling Operating Expenses

**SG&A (Selling, General & Administrative)**
SG&A includes sales salaries and commissions, marketing, rent, corporate overhead, and administrative costs.

Projection approach:
- Identify the fixed and variable components
- Variable expenses (sales commissions): Percentage of revenue
- Fixed expenses (corporate overhead): Grow with inflation or headcount
- Semi-fixed (office rent): Step-function increases with growth

**R&D (Research & Development)**
For technology and pharmaceutical companies, R&D is a critical expense. Project as:
- Percentage of revenue (common: 10-20% for tech companies)
- Or absolute dollar amount based on planned projects and headcount

**Depreciation & Amortization**
- Depreciation: From the PP&E / depreciation schedule (based on CapEx and asset lives)
- Amortization: From the intangibles schedule (amortization of acquired intangibles)

### Operating Leverage

A critical concept in the operating model: **operating leverage** is the degree to which a company's operating income changes relative to a change in revenue.

High operating leverage means a large portion of costs are fixed. When revenue grows, these fixed costs are spread over more units, causing margins to expand. When revenue declines, margins compress rapidly.

| Business Type | Operating Leverage | Margin Behavior |
|--------------|-------------------|-----------------|
| Software/SaaS | Very high | Margins expand significantly with scale |
| Manufacturing | Moderate to high | Some margin expansion with volume |
| Services | Low to moderate | Margins relatively stable |
| Retail | Low | Thin margins, limited leverage |

Model operating leverage by separating fixed and variable costs and projecting them independently.

### Building the Operating Model

| Line Item | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|-----------|--------|--------|--------|--------|--------|
| Revenue | 1,000 | 1,120 | 1,243 | 1,355 | 1,457 |
| COGS (60%) | (600) | (672) | (746) | (813) | (874) |
| **Gross Profit** | **400** | **448** | **497** | **542** | **583** |
| SG&A (18%) | (180) | (202) | (224) | (244) | (262) |
| R&D (12%) | (120) | (134) | (149) | (163) | (175) |
| D&A | (40) | (44) | (48) | (52) | (55) |
| **EBIT** | **60** | **68** | **76** | **84** | **91** |
| EBIT Margin | 6.0% | 6.1% | 6.1% | 6.2% | 6.2% |

### Margin Trajectory

One of the most important decisions in the operating model is the margin trajectory. Three options:

**Margin expansion**: Company is scaling, and operating leverage drives improving margins. Common for growth-stage companies moving toward profitability.

**Stable margins**: Company is mature, and margins fluctuate within a narrow band. Common for established businesses in competitive industries.

**Margin compression**: Company faces increasing competition, input cost inflation, or needs to invest heavily to maintain market position.

Your margin assumptions should be supported by specific operating drivers, not arbitrary choices.

### Key Takeaway

The operating model converts top-line growth into bottom-line profitability. The best operating models separate fixed and variable costs, capture operating leverage, and project margins based on identifiable business drivers rather than arbitrary assumptions. Always compare your projected margins to historical performance, peer benchmarks, and management guidance to ensure they are grounded in reality.`,
    },
    {
      id: "fm-dcf-fcf-projection",
      slug: "fcf-projection",
      title: "Free Cash Flow Projection",
      content: `## Free Cash Flow Projection

Free cash flow (FCF) is the cash a business generates after funding its operations and maintaining its asset base. It is the number you actually discount in a DCF — not revenue, not EBITDA, not net income. Projecting FCF correctly is the critical bridge between the operating model and the valuation.

### Unlevered Free Cash Flow Formula

\`\`\`
UFCF = EBIT x (1 - Tax Rate)       [NOPAT]
     + Depreciation & Amortization  [Non-cash add-back]
     - Capital Expenditures         [Investment in fixed assets]
     - Change in Net Working Capital [Cash tied up in operations]
\`\`\`

Each component requires careful projection:

### Projecting Each Component

**NOPAT (Net Operating Profit After Tax)**
Start with EBIT from the operating model and apply the tax rate. Use the marginal tax rate (statutory rate), not the effective rate, because we want the tax on operating income specifically. For US companies, use approximately 25%.

Note: We tax EBIT, not EBT, because UFCF is a pre-financing metric. The tax benefit of interest (the interest tax shield) is captured in WACC, not in the cash flows.

**Depreciation & Amortization**
D&A comes from the depreciation schedule. It was already deducted from EBIT as a non-cash expense, so we add it back to get actual cash flow. D&A typically grows in proportion to the capital base (PP&E and intangible assets).

**Capital Expenditures**
CapEx represents cash spent on long-term assets. Common projection methods:

| Method | Formula | When to Use |
|--------|---------|-------------|
| % of revenue | CapEx = Revenue x CapEx % | Stable businesses |
| Maintenance + growth | CapEx = Maintenance CapEx + Growth CapEx | Distinguishing investment types |
| Management guidance | Specific dollar amounts | When available |

For DCF terminal value purposes, maintenance CapEx should approximately equal depreciation (the company maintains its asset base without net growth).

**Change in Net Working Capital**
Working capital changes are driven by the growth of the business:

\`\`\`
Change in NWC = (AR + Inventory + Other CA) - (AP + Accrued Expenses + Other CL)
               current period minus prior period
\`\`\`

For a growing company, NWC typically increases each year (more revenue means more receivables and inventory), consuming cash. Model each component using the days-based approach (DSO, DIO, DPO).

### The FCF Projection Table

| Item | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|------|--------|--------|--------|--------|--------|
| EBIT | 150 | 170 | 192 | 215 | 238 |
| Tax (25%) | (38) | (43) | (48) | (54) | (60) |
| **NOPAT** | **113** | **128** | **144** | **161** | **179** |
| D&A | 60 | 65 | 70 | 75 | 80 |
| CapEx | (80) | (85) | (90) | (95) | (100) |
| Change in NWC | (12) | (13) | (14) | (15) | (16) |
| **UFCF** | **81** | **95** | **110** | **126** | **143** |

### FCF Conversion and Quality

**FCF Conversion** = Free Cash Flow / EBITDA or Free Cash Flow / Net Income

This ratio measures how efficiently the company converts accounting profits into actual cash. High-quality businesses typically convert 80-100% of EBITDA into FCF. Lower conversion may indicate:
- Heavy CapEx requirements
- Growing working capital needs
- Frequent one-time cash charges
- Accounting earnings that do not translate to cash

### Common FCF Projection Mistakes

1. **Using net income instead of NOPAT**: Net income is after interest, making it a levered metric
2. **Forgetting NWC changes**: Especially for fast-growing companies, NWC growth can consume significant cash
3. **Projecting CapEx below depreciation indefinitely**: This implies the asset base is shrinking
4. **Not adjusting the terminal year**: In the terminal year, CapEx should equal depreciation and NWC changes should be minimal
5. **Inconsistent tax rates**: Use the marginal rate on EBIT for NOPAT, not the company's effective rate which includes interest deductions

### Key Takeaway

Free cash flow projection is where the operating model meets valuation reality. UFCF represents the actual cash the business generates for all capital providers — it is the number you discount in a DCF. Getting it right requires careful treatment of each component: NOPAT, D&A, CapEx, and working capital changes. Every component should be individually projected and cross-checked for reasonableness.`,
      starterCode: `# DCF Model - Free Cash Flow Projection
# Build an unlevered FCF projection from operating assumptions

def project_ufcf(revenue_base, revenue_growth_rates, ebit_margin,
                 tax_rate, da_pct_revenue, capex_pct_revenue,
                 nwc_pct_revenue):
    """
    Project Unlevered Free Cash Flow for each year.

    Args:
        revenue_base: Year 0 revenue
        revenue_growth_rates: list of annual growth rates
        ebit_margin: EBIT as % of revenue (constant or list)
        tax_rate: marginal tax rate
        da_pct_revenue: D&A as % of revenue
        capex_pct_revenue: CapEx as % of revenue
        nwc_pct_revenue: NWC as % of revenue

    Returns:
        list of dicts with: revenue, ebit, nopat, da, capex,
        change_nwc, ufcf for each projected year
    """
    # TODO: For each year:
    # 1. Calculate revenue from growth rate
    # 2. Calculate EBIT from margin
    # 3. Calculate NOPAT = EBIT * (1 - tax_rate)
    # 4. Calculate D&A = revenue * da_pct
    # 5. Calculate CapEx = revenue * capex_pct
    # 6. Calculate NWC = revenue * nwc_pct
    # 7. Change in NWC = current NWC - prior NWC
    # 8. UFCF = NOPAT + D&A - CapEx - Change in NWC
    pass


def calculate_dcf_value(ufcf_list, wacc, terminal_growth,
                        net_debt, shares):
    """
    Calculate enterprise value and equity value per share.

    Args:
        ufcf_list: list of projected UFCF values
        wacc: weighted average cost of capital
        terminal_growth: perpetuity growth rate
        net_debt: total debt minus cash
        shares: diluted shares outstanding
    """
    # TODO: Discount each UFCF, calculate terminal value,
    # sum for enterprise value, subtract net debt for equity
    pass


# Test
projections = project_ufcf(
    revenue_base=1000,
    revenue_growth_rates=[0.10, 0.09, 0.08, 0.07, 0.06],
    ebit_margin=0.20,
    tax_rate=0.25,
    da_pct_revenue=0.05,
    capex_pct_revenue=0.07,
    nwc_pct_revenue=0.12,
)

if projections:
    print("=== UFCF Projections ===")
    for i, p in enumerate(projections):
        print(f"Year {i+1}: Rev={p['revenue']:.0f} "
              f"UFCF={p['ufcf']:.0f}")
`,
      solutionCode: `# DCF Model - Free Cash Flow Projection - Solution

def project_ufcf(revenue_base, revenue_growth_rates, ebit_margin,
                 tax_rate, da_pct_revenue, capex_pct_revenue,
                 nwc_pct_revenue):
    results = []
    prior_nwc = revenue_base * nwc_pct_revenue
    current_revenue = revenue_base

    for i, growth in enumerate(revenue_growth_rates):
        current_revenue = current_revenue * (1 + growth)
        margin = ebit_margin[i] if isinstance(ebit_margin, list) else ebit_margin
        ebit = current_revenue * margin
        nopat = ebit * (1 - tax_rate)
        da = current_revenue * da_pct_revenue
        capex = current_revenue * capex_pct_revenue
        current_nwc = current_revenue * nwc_pct_revenue
        change_nwc = current_nwc - prior_nwc
        ufcf = nopat + da - capex - change_nwc

        results.append({
            "year": i + 1,
            "revenue": current_revenue,
            "ebit": ebit,
            "nopat": nopat,
            "da": da,
            "capex": capex,
            "nwc": current_nwc,
            "change_nwc": change_nwc,
            "ufcf": ufcf,
        })
        prior_nwc = current_nwc

    return results


def calculate_dcf_value(ufcf_list, wacc, terminal_growth,
                        net_debt, shares):
    # Discount projected cash flows
    pv_fcfs = 0
    for i, ufcf in enumerate(ufcf_list):
        pv_fcfs += ufcf / (1 + wacc) ** (i + 1)

    # Terminal value (Gordon Growth)
    terminal_fcf = ufcf_list[-1] * (1 + terminal_growth)
    terminal_value = terminal_fcf / (wacc - terminal_growth)
    pv_terminal = terminal_value / (1 + wacc) ** len(ufcf_list)

    enterprise_value = pv_fcfs + pv_terminal
    equity_value = enterprise_value - net_debt
    price_per_share = equity_value / shares

    return {
        "pv_fcfs": pv_fcfs,
        "terminal_value": terminal_value,
        "pv_terminal": pv_terminal,
        "enterprise_value": enterprise_value,
        "equity_value": equity_value,
        "price_per_share": price_per_share,
        "tv_pct": pv_terminal / enterprise_value * 100,
    }


# Test
projections = project_ufcf(
    revenue_base=1000,
    revenue_growth_rates=[0.10, 0.09, 0.08, 0.07, 0.06],
    ebit_margin=0.20,
    tax_rate=0.25,
    da_pct_revenue=0.05,
    capex_pct_revenue=0.07,
    nwc_pct_revenue=0.12,
)

print("=== UFCF Projections ===")
for p in projections:
    print(f"Year {p['year']}: Rev={p['revenue']:.0f} "
          f"EBIT={p['ebit']:.0f} UFCF={p['ufcf']:.0f}")

ufcf_values = [p["ufcf"] for p in projections]
dcf = calculate_dcf_value(
    ufcf_values, wacc=0.10, terminal_growth=0.025,
    net_debt=200, shares=100
)
print(f"\\n=== DCF Valuation ===")
print(f"PV of FCFs: {dcf['pv_fcfs']:.0f}")
print(f"PV of Terminal Value: {dcf['pv_terminal']:.0f}")
print(f"Enterprise Value: {dcf['enterprise_value']:.0f}")
print(f"Equity Value: {dcf['equity_value']:.0f}")
print(f"Price Per Share: {dcf['price_per_share']:.2f}")
print(f"TV as % of EV: {dcf['tv_pct']:.1f}%")
`,
    },
    {
      id: "fm-dcf-wacc-model",
      slug: "wacc-model",
      title: "WACC Model",
      content: `## WACC Model

The WACC model calculates the discount rate for your DCF. It combines the cost of equity (what shareholders require) with the after-tax cost of debt (what lenders charge) into a single blended rate. Because WACC has an outsized impact on valuation — a 1% change can swing enterprise value by 15-25% — it deserves careful, well-documented calculation.

### The Complete WACC Calculation

**Step 1: Cost of Equity via CAPM**

Re = Rf + Beta x ERP + Size Premium (optional)

| Input | Source | Typical Value |
|-------|--------|---------------|
| Risk-free rate (Rf) | 10-year US Treasury yield | 3.5-5.0% |
| Equity risk premium (ERP) | Duff & Phelps or Damodaran | 5.0-7.0% |
| Beta | Bloomberg, Capital IQ, regression | 0.6-1.8 |
| Size premium | Duff & Phelps (for small companies) | 0-4.0% |

**Beta estimation:**
1. Pull the raw (levered) beta of comparable public companies
2. Unlever each beta: Beta_U = Beta_L / (1 + (1-T) x D/E)
3. Calculate the median unlevered beta
4. Re-lever at the target company's capital structure: Beta_L = Beta_U x (1 + (1-T) x D/E)

**Step 2: Cost of Debt**

The pre-tax cost of debt should reflect what the company would pay to borrow today:

| Source | Method |
|--------|--------|
| Publicly traded bonds | Yield to maturity |
| Credit rating | Risk-free rate + credit spread for that rating |
| Bank loan terms | Interest rate on recent loan facilities |
| Weighted average | If multiple instruments, weight by market value |

After-tax cost of debt = Pre-tax cost of debt x (1 - Tax Rate)

**Step 3: Capital Structure Weights**

Use market values:
- Equity weight (E/V) = Market capitalization / (Market cap + Market value of debt)
- Debt weight (D/V) = Market value of debt / (Market cap + Market value of debt)

For private companies, estimate market value of equity using comparable company multiples, and use book value of debt as an approximation of market value.

### WACC Sensitivity

Because WACC has such a large impact on valuation, always present a range:

| Scenario | WACC | Enterprise Value |
|----------|------|-----------------|
| Low (favorable) | 8.0% | 2,450 |
| Base case | 9.5% | 1,980 |
| High (conservative) | 11.0% | 1,640 |

The range from low to high WACC can change enterprise value by 30-50%. This reinforces why DCF results should always be presented as ranges, not point estimates.

### Country Risk Premium

For companies operating in emerging markets, add a **country risk premium** to the cost of equity:

Re = Rf + Beta x ERP + Country Risk Premium

Country risk premiums are published by Damodaran and range from near zero (developed markets) to 5-10% (frontier markets). They reflect additional risks from political instability, currency volatility, and weaker legal systems.

### Common WACC Mistakes

1. **Using book value weights instead of market value**: Book value does not reflect the current cost of capital
2. **Using the company's effective tax rate**: Use the marginal tax rate for the after-tax cost of debt
3. **Not re-levering beta**: If you use a comparable company's beta, you must adjust it for the target's capital structure
4. **Mixing nominal and real rates**: If cash flows are nominal (include inflation), WACC must also be nominal
5. **Using a single beta source**: Different databases report different betas; check 2-3 sources and use judgment

### Key Takeaway

The WACC model is a structured, multi-step calculation that requires careful selection of inputs from market data and comparable companies. Because it has such a large impact on valuation, every input should be documented and defensible. Present WACC as a range rather than a single number, and always include sensitivity analysis showing how valuation changes across WACC scenarios.`,
    },
    {
      id: "fm-dcf-terminal-equity",
      slug: "terminal-value-equity-bridge",
      title: "Terminal Value & Equity Bridge",
      content: `## Terminal Value & Equity Bridge

The terminal value and equity bridge are the final two steps that transform your DCF analysis into an actionable valuation. Terminal value captures all value beyond the forecast period, and the equity bridge converts enterprise value into what shareholders actually own.

### Terminal Value: Two Approaches

**Perpetuity Growth Method:**
\`\`\`
Terminal Value = UFCF(n) x (1 + g) / (WACC - g)
\`\`\`

Where UFCF(n) is the final projected year's free cash flow and g is the perpetuity growth rate.

Critical terminal year adjustments:
- CapEx should approximately equal depreciation (company maintains but does not aggressively grow its asset base)
- Working capital changes should be minimal (tied to the terminal growth rate, not a higher projection-period growth rate)
- Margins should be sustainable (not at cyclical peaks or troughs)
- Revenue growth should be at the terminal rate (do not project 15% growth in year 5 and then use 2.5% for terminal value without a transition)

**Exit Multiple Method:**
\`\`\`
Terminal Value = Terminal Year EBITDA x Exit EV/EBITDA Multiple
\`\`\`

The exit multiple is typically based on current comparable company multiples. The assumption is that the market will value the company at a similar multiple when you "exit" the investment at the end of the forecast period.

### Cross-Checking Terminal Value

Always calculate terminal value using both methods and compare:

| Method | Terminal Value | Implied EV | Implied Multiple / Growth |
|--------|---------------|------------|--------------------------|
| Perpetuity Growth (2.5%) | 1,900 | 2,650 | Implied multiple: 11.9x |
| Exit Multiple (12x EBITDA) | 1,920 | 2,670 | Implied growth: 2.6% |

If the two methods produce similar results, your assumptions are consistent. If they diverge significantly, investigate which set of assumptions is more reasonable.

### Terminal Value as a Percentage of Enterprise Value

Terminal value typically represents 60-80% of total enterprise value. If it represents more than 85%, your near-term cash flow projections may be too low (or your terminal assumptions too aggressive). If less than 50%, your near-term projections may be overly optimistic.

### The Equity Bridge

The equity bridge converts enterprise value into equity value per share:

\`\`\`
Enterprise Value (Sum of PV of FCFs + PV of Terminal Value)
- Total Debt
+ Cash and Cash Equivalents
- Minority Interest (at market value)
- Preferred Stock (at market or liquidation value)
+ Equity Investments / Associates (at market value)
- Unfunded Pension Liabilities (if material)
- Capital Lease Obligations (if not already in debt)
= Equity Value

Equity Value / Diluted Shares Outstanding = Implied Share Price
\`\`\`

### Diluted Share Count

Use the **treasury stock method** to calculate diluted shares:

1. Start with basic shares outstanding
2. Add shares from in-the-money stock options:
   - Assume options are exercised (add shares)
   - Assume the company receives exercise proceeds
   - Assume proceeds buy back shares at the current market price
   - Net addition = Options shares - Shares repurchased
3. Add shares from restricted stock units (RSUs): full share count
4. Add shares from convertible securities (if in-the-money)

### Presenting the DCF Output

A professional DCF output includes:

**Summary page:**
- Key assumptions table (revenue growth, margins, WACC, terminal growth)
- Bridge from enterprise value to equity value per share
- Comparison to current market price
- Upside/downside percentage

**Sensitivity tables:**
- WACC vs. Terminal Growth Rate (primary)
- WACC vs. Exit Multiple (secondary)
- Revenue Growth vs. EBIT Margin (operational sensitivity)

**Implied metrics:**
- Implied terminal year EV/EBITDA (from perpetuity growth)
- Implied perpetuity growth rate (from exit multiple)
- Terminal value as percentage of enterprise value

### The Final Sanity Check

Before presenting your DCF, verify:

| Check | Expected |
|-------|----------|
| Terminal value as % of EV | 60-80% |
| Implied terminal EV/EBITDA | Within comparable company range |
| Implied perpetuity growth | 2-3% for developed market companies |
| Terminal CapEx vs. D&A | Approximately equal |
| DCF value vs. current market | Explainable difference |
| WACC range is reasonable | 7-13% for most companies |

### Key Takeaway

The terminal value and equity bridge are where the DCF culminates in a specific value. Terminal value typically dominates the result, so its assumptions deserve extra scrutiny — cross-check between methods, verify implied metrics, and always present sensitivity analysis. The equity bridge must be precise — a missed debt item or incorrect share count can throw off the per-share value by a meaningful amount. Together, these steps produce the final DCF output that drives investment decisions.`,
    },
  ],
};
