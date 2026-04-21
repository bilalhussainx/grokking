import { Module } from "../types";

export const capitalStructureModule: Module = {
  id: "cf-capital",
  title: "Capital Structure",
  description: "Understand how companies choose between debt and equity financing, the Modigliani-Miller theorem, and the trade-offs that determine optimal capital structure.",
  lessons: [
    {
      id: "cf-debt-vs-equity",
      slug: "debt-vs-equity",
      title: "Debt vs. Equity Financing",
      content: `## Debt vs. Equity Financing

When a company needs to raise capital, it has two fundamental options: **debt** (borrowing) or **equity** (selling ownership). This choice — the **capital structure decision** — has profound implications for risk, return, control, and taxes.

### Debt Financing

Debt is a contractual obligation to repay borrowed funds plus interest. Key characteristics:

| Feature | Debt |
|---------|------|
| Claim on assets | Senior (paid before equity) |
| Payments | Fixed (interest + principal) |
| Tax treatment | Interest is tax-deductible |
| Control | No voting rights for lenders |
| Default | Failure to pay triggers bankruptcy |

Types of corporate debt:
- **Bank loans** — term loans and revolving credit facilities
- **Corporate bonds** — publicly traded debt securities
- **Commercial paper** — short-term unsecured debt
- **Convertible bonds** — debt that can convert to equity

### Equity Financing

Equity represents ownership in the company. Key characteristics:

| Feature | Equity |
|---------|--------|
| Claim on assets | Residual (paid last) |
| Payments | Discretionary (dividends) |
| Tax treatment | Dividends are NOT tax-deductible |
| Control | Voting rights for shareholders |
| Default | Cannot default on equity |

Types of equity:
- **Common stock** — voting shares with residual claim
- **Preferred stock** — fixed dividends, senior to common
- **Retained earnings** — internally generated equity

### The Tax Advantage of Debt

The single most important feature of debt in corporate finance is the **tax shield**. Because interest payments are tax-deductible, debt effectively costs less after taxes.

\`\`\`
After-tax cost of debt = Pre-tax cost x (1 - Tax Rate)
\`\`\`

Example: If a company borrows at 6% and the corporate tax rate is 25%:
\`\`\`
After-tax cost = 6% x (1 - 0.25) = 4.5%
\`\`\`

The government effectively subsidizes 25% of the interest cost. At the current U.S. corporate tax rate of 21%, the interest tax shield is worth approximately 21 cents per dollar of interest paid.

### Real-World Example: Apple's Debt Strategy

Despite holding over $150 billion in cash (as of 2020), Apple issued billions in bonds. Why? Because of the tax arbitrage:

- Apple's cash was largely held overseas (pre-2017 tax reform)
- Borrowing in the U.S. at 2-3% rates, after the tax shield, cost effectively ~1.6-2.4%
- This was cheaper than repatriating overseas cash, which would have triggered a 35% tax rate

Between 2013-2019, Apple issued over $100 billion in bonds while simultaneously sitting on massive cash reserves — a seemingly paradoxical but financially optimal strategy (Source: Apple 10-K filings, SEC.gov).

### The Trade-Off

More debt means:
- **Benefit:** Greater tax shield, potentially higher returns to equity
- **Cost:** Higher bankruptcy risk, financial distress costs, loss of financial flexibility

This trade-off is at the heart of capital structure theory and will be formalized in the next lesson with the Modigliani-Miller theorem.

### Pecking Order Theory

Stewart Myers and Nicholas Majluf (1984) proposed that companies prefer financing sources in this order:
1. **Internal funds** (retained earnings) — no issuance costs, no information asymmetry
2. **Debt** — lower information costs than equity
3. **Equity** — last resort, because issuing equity signals that management thinks the stock is overvalued

Empirical evidence largely supports the pecking order. Graham and Harvey (2001) found that 73% of CFOs consider financial flexibility their most important concern when making capital structure decisions.

### Key Takeaway

The choice between debt and equity is not just a financing decision — it affects the company's risk profile, tax bill, governance, and strategic flexibility. Understanding this trade-off is essential for every corporate finance decision.

**Sources:** Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 14-16; Myers, S. & Majluf, N. "Corporate Financing and Investment Decisions" (*JFE*, 1984); Graham & Harvey (*JFE*, 2001).`,
    },
    {
      id: "cf-modigliani-miller",
      slug: "modigliani-miller",
      title: "Modigliani-Miller Theorem",
      content: `## The Modigliani-Miller Theorem

The **Modigliani-Miller (M&M) theorem** is one of the most important results in all of finance. Published in 1958 by Franco Modigliani and Merton Miller, it earned them Nobel Prizes in Economics (1985 and 1990, respectively).

### M&M Proposition I (No Taxes): Capital Structure Irrelevance

In a perfect market (no taxes, no bankruptcy costs, no transaction costs, no information asymmetry), **the value of a firm is independent of its capital structure**.

\`\`\`
V_Levered = V_Unlevered
\`\`\`

In other words, whether a firm finances itself with 100% equity, 100% debt, or any mix, its total value remains the same. Slicing the pie differently does not change the size of the pie.

**The Pizza Analogy:** Cutting a pizza into 6 slices vs. 8 slices does not change the total amount of pizza. Similarly, dividing a firm's cash flows between debt and equity holders does not change the total value of those cash flows.

### The Intuition

If a levered firm were worth more than an identical unlevered firm, investors could replicate the leverage themselves (by borrowing personally) and buy the cheaper unlevered firm. This arbitrage would eliminate any price difference. Therefore, in equilibrium, leverage cannot create value.

### M&M Proposition II: Cost of Equity Rises with Leverage

While the total value is unchanged, the **cost of equity increases linearly with leverage**:

\`\`\`
r_E = r_U + (D/E) x (r_U - r_D)
\`\`\`

Where:
- r_E = cost of equity
- r_U = cost of capital for an unlevered firm
- r_D = cost of debt
- D/E = debt-to-equity ratio

As a firm takes on more debt, equity becomes riskier (because debt holders are paid first), so equity investors demand a higher return. The WACC stays constant because the increase in equity cost exactly offsets the benefit of cheaper debt.

### M&M with Taxes

In the real world, interest is tax-deductible. M&M (1963) showed that with corporate taxes:

\`\`\`
V_Levered = V_Unlevered + Tax Rate x Debt
\`\`\`

The tax shield creates real value. At a 21% tax rate, every $1 of permanent debt creates $0.21 of value. This implies firms should use as much debt as possible — clearly unrealistic, which leads us to the trade-off theory.

### Why M&M Matters

M&M might seem like a purely academic exercise — "In a world that doesn't exist, capital structure doesn't matter." But its real contribution is showing us **why capital structure DOES matter** in the real world:

1. **Taxes** — interest tax shields create real value
2. **Bankruptcy costs** — too much debt leads to costly financial distress
3. **Agency costs** — debt disciplines managers but can also cause underinvestment
4. **Information asymmetry** — capital structure signals management's private information

As Merton Miller himself said: "The M&M propositions tell you where to look for reasons why capital structure matters — in the deviations from the assumptions" (Source: Miller, M. "The Modigliani-Miller Propositions After Thirty Years," *Journal of Economic Perspectives*, 1988).

### Real-World Implications

The theorem explains why:
- **Highly profitable firms** (Apple, Google) can afford low leverage — they don't need the tax shield as badly
- **Stable cash flow firms** (utilities, telecoms) use high leverage — predictable revenues support debt service
- **Private equity** uses extreme leverage — the tax shield is a core value driver in LBOs

### Key Takeaway

M&M provides the theoretical foundation for all capital structure analysis. By understanding the perfect-market result, we can then systematically analyze which real-world frictions — taxes, bankruptcy costs, agency problems, information asymmetry — make capital structure matter for specific companies.

**Sources:** Modigliani, F. & Miller, M. "The Cost of Capital, Corporation Finance and the Theory of Investment" (*AER*, 1958); Miller, M. "The Modigliani-Miller Propositions After Thirty Years" (*JEP*, 1988); Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 14.`,
    },
    {
      id: "cf-wacc",
      slug: "wacc",
      title: "Weighted Average Cost of Capital (WACC)",
      content: `## Weighted Average Cost of Capital (WACC)

The **Weighted Average Cost of Capital (WACC)** is the blended rate of return required by all of a firm's capital providers — both debt and equity holders. It is the discount rate used in DCF analysis and the hurdle rate for investment decisions.

### The WACC Formula

\`\`\`
WACC = (E/V) x r_E + (D/V) x r_D x (1 - T)
\`\`\`

Where:
- E = Market value of equity
- D = Market value of debt
- V = E + D (total capital)
- r_E = Cost of equity
- r_D = Cost of debt
- T = Corporate tax rate

### Calculating Each Component

**Cost of Equity (r_E)** — typically estimated using the **Capital Asset Pricing Model (CAPM)**:

\`\`\`
r_E = r_f + Beta x (r_m - r_f)
\`\`\`

Where:
- r_f = Risk-free rate (10-year Treasury yield, ~4.5% in 2024)
- Beta = Sensitivity to market risk (from regression analysis)
- r_m - r_f = Equity risk premium (~5-7%)

**Cost of Debt (r_D)** — the yield-to-maturity on the company's outstanding bonds, or the interest rate on new borrowings.

**Tax Rate (T)** — the marginal corporate tax rate (21% in the U.S. since the 2017 Tax Cuts and Jobs Act).

### Detailed Example

Calculate WACC for a company with:
- Market cap: $800M (equity)
- Debt outstanding: $200M
- Cost of equity: 12%
- Pre-tax cost of debt: 5%
- Tax rate: 25%

\`\`\`
E/V = 800 / 1,000 = 0.80
D/V = 200 / 1,000 = 0.20

WACC = 0.80 x 12% + 0.20 x 5% x (1 - 0.25)
WACC = 9.6% + 0.75%
WACC = 10.35%
\`\`\`

### What WACC Represents

WACC represents the **opportunity cost of capital** for the firm as a whole. It answers: "What return must our investments earn to satisfy all our capital providers?" If a project earns a return above WACC, it creates value. Below WACC, it destroys value.

### WACC in Practice

According to Damodaran's annual survey of global WACC estimates (damodaran.com, January 2024):

| Sector | Median WACC |
|--------|------------|
| Technology | 10.5% |
| Healthcare | 9.8% |
| Utilities | 6.2% |
| Consumer Staples | 8.1% |
| Energy | 9.4% |
| Financial Services | 8.7% |

The variation reflects differences in business risk (captured in beta) and capital structure (debt ratios).

### Common Mistakes in WACC Calculation

1. **Using book value instead of market value** — WACC weights should reflect market values, not balance sheet values
2. **Forgetting the tax shield** — the cost of debt must be multiplied by (1 - T)
3. **Using the wrong beta** — if the company's leverage changes, beta must be relevered
4. **Static WACC** — if capital structure is expected to change significantly, use a time-varying WACC or APV method instead
5. **Applying a company-wide WACC to all projects** — high-risk projects should use a higher discount rate than low-risk ones

### When NOT to Use WACC

WACC assumes a **constant capital structure** over the projection period. If leverage is expected to change significantly (as in an LBO), use the **Adjusted Present Value (APV)** method instead:

\`\`\`
APV = Value of unlevered firm + PV of tax shields
\`\`\`

### Key Takeaway

WACC is the central discount rate in corporate finance. Getting it right requires careful estimation of the cost of equity (via CAPM), cost of debt, and the market-value capital structure weights. A 1% error in WACC can shift a DCF valuation by 10-15%, so precision matters.

**Sources:** Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 12-13; Damodaran, A. "Cost of Capital by Sector" (damodaran.com, 2024); MIT OCW 15.401.`,
    },
    {
      id: "cf-optimal-capital-structure",
      slug: "optimal-capital-structure",
      title: "Optimal Capital Structure",
      content: `## Optimal Capital Structure

Is there a "perfect" mix of debt and equity? The **optimal capital structure** is the debt-to-equity ratio that maximizes firm value (or equivalently, minimizes WACC). Finding it requires balancing the tax benefits of debt against the costs of financial distress.

### The Trade-Off Theory

The **trade-off theory** posits that the optimal capital structure balances:

**Benefits of debt:**
- Tax shield (interest deductibility)
- Discipline on management (reduces free cash flow waste)
- Lower agency costs of equity

**Costs of debt:**
- Direct bankruptcy costs (legal fees, administrative costs — typically 3-4% of firm value)
- Indirect bankruptcy costs (lost customers, suppliers, employees — potentially 10-20% of firm value)
- Agency costs of debt (asset substitution, underinvestment)
- Loss of financial flexibility

\`\`\`
V_Levered = V_Unlevered + PV(Tax Shield) - PV(Financial Distress Costs)
\`\`\`

### The Optimal Point

As a firm increases leverage:

1. **Low leverage:** Tax shield benefits dominate. WACC decreases, firm value increases.
2. **Moderate leverage:** Marginal benefit of tax shield begins to be offset by increasing probability of distress.
3. **Optimal leverage:** The point where the marginal benefit of the tax shield exactly equals the marginal cost of financial distress.
4. **Excessive leverage:** Distress costs dominate. WACC rises, firm value falls.

### What Research Shows

Empirical research provides guidance on optimal leverage by industry:

| Industry | Typical D/E Ratio | Rationale |
|----------|------------------|-----------|
| Utilities | 1.0-2.0x | Stable, regulated cash flows |
| Real Estate | 1.5-3.0x | Hard assets as collateral |
| Technology | 0-0.3x | Volatile cash flows, high growth |
| Pharmaceuticals | 0.2-0.5x | Patent cliff risk |
| Airlines | 1.5-3.0x | Capital-intensive, but volatile |
| Banks | 8-12x | Regulated, deposit-funded |

Graham (2000) estimated that the typical large U.S. firm uses **only about 50-60% of the debt capacity** suggested by the trade-off theory, leaving significant "tax money on the table" (Source: Graham, J. "How Big Are the Tax Benefits of Debt?" *Journal of Finance*, 2000).

### Financial Distress: A Real Cost

The costs of financial distress go far beyond legal fees. When Lehman Brothers collapsed in September 2008:

- The bankruptcy process took over **3 years** and cost over **$2 billion** in legal and administrative fees alone
- Counterparties lost confidence across the entire financial system
- Customers, suppliers, and employees all suffered losses
- The broader economic damage was estimated at hundreds of billions of dollars

(Source: Valukas, A. "Lehman Brothers Examiner's Report," U.S. Bankruptcy Court, 2010)

### Factors Determining Optimal Leverage

Companies with these characteristics can support more debt:
- **Tangible assets** — provide collateral (real estate, utilities)
- **Stable cash flows** — reduce default probability (consumer staples)
- **Low growth** — less need for financial flexibility (mature industries)
- **High profitability** — bigger tax shield benefit
- **Low volatility** — reduces probability of distress

Companies with these characteristics should use less debt:
- **Intangible assets** — hard to liquidate (tech, pharma)
- **Volatile revenues** — high default risk (airlines, commodities)
- **High growth** — need flexibility for investment
- **High R&D spending** — volatile returns

### Credit Ratings and Capital Structure

Companies actively manage their capital structure to maintain a target credit rating. According to S&P Global (2023), the median debt-to-EBITDA ratio for:
- AAA-rated firms: 0.5x
- A-rated firms: 1.5x
- BBB-rated firms: 2.5x
- BB-rated firms: 3.5x

Most large firms target investment grade (BBB- or above) to maintain access to the bond market at reasonable rates.

### Key Takeaway

The optimal capital structure is company-specific and depends on the trade-off between tax benefits and distress costs. There is no universal "right" answer, but the framework — maximize the difference between tax shield value and distress costs — provides a rigorous way to think about the debt-equity choice.

**Sources:** Graham, J. "How Big Are the Tax Benefits of Debt?" (*JF*, 2000); Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 16; S&P Global Ratings, "Corporate Criteria" (2023).`,
    },
    {
      id: "cf-leverage-risk",
      slug: "leverage-and-financial-risk",
      title: "Leverage & Financial Risk",
      content: `## Leverage & Financial Risk

**Financial leverage** amplifies both returns and risk. Understanding how leverage affects a firm's risk profile is essential for capital structure decisions, credit analysis, and equity valuation.

### How Leverage Amplifies Returns

Consider two identical firms — Firm U (unlevered) and Firm L (levered) — each with $1,000 in total assets and the same operating income:

**Firm U (100% equity):**
- Assets: $1,000, Equity: $1,000, Debt: $0

**Firm L (50% debt at 5% interest):**
- Assets: $1,000, Equity: $500, Debt: $500

| Scenario | EBIT | Firm U ROE | Firm L ROE |
|----------|------|-----------|-----------|
| Bad | $50 | 5.0% | 5.0% |
| Normal | $100 | 10.0% | 15.0% |
| Good | $150 | 15.0% | 25.0% |

In the normal scenario, Firm L earns 15% ROE vs. Firm U's 10% — leverage boosts returns. But in the bad scenario, both earn 5% ROE. And if EBIT falls to $25:

- Firm U ROE = 2.5%
- Firm L ROE = 0% (all operating income goes to interest)

If EBIT drops below $25, Firm L cannot cover its interest and faces financial distress while Firm U remains solvent.

### Measuring Leverage

Several ratios measure the degree of financial leverage:

| Ratio | Formula | Interpretation |
|-------|---------|----------------|
| **Debt-to-Equity** | Total Debt / Equity | Leverage relative to equity base |
| **Debt-to-Capital** | Debt / (Debt + Equity) | Debt as % of total capital |
| **Interest Coverage** | EBIT / Interest Expense | How many times earnings cover interest |
| **Debt/EBITDA** | Total Debt / EBITDA | Years of EBITDA to repay debt |
| **Net Debt/EBITDA** | (Debt - Cash) / EBITDA | Leverage net of cash |

### Operating vs. Financial Leverage

**Operating leverage** comes from fixed operating costs (rent, salaries, depreciation). A company with high fixed costs and low variable costs has high operating leverage — its profits are highly sensitive to revenue changes.

**Financial leverage** comes from fixed financial obligations (debt interest).

**Total leverage = Operating leverage x Financial leverage**

Companies with high operating leverage should generally use less financial leverage, and vice versa. Airlines have both high operating leverage (fixed fleet costs) and high financial leverage (aircraft leases and debt), which explains their extreme cyclicality — seven major U.S. airlines have filed for bankruptcy since 2001 (Source: Airlines for America, industry data).

### Degree of Financial Leverage (DFL)

\`\`\`
DFL = % Change in EPS / % Change in EBIT
    = EBIT / (EBIT - Interest)
\`\`\`

A DFL of 2.0 means that if EBIT increases by 10%, EPS increases by 20% — and if EBIT decreases by 10%, EPS decreases by 20%.

### The Leverage Effect on Beta

Leverage increases the equity beta (systematic risk) of a firm:

\`\`\`
Beta_Levered = Beta_Unlevered x [1 + (1 - T) x (D/E)]
\`\`\`

This is the **Hamada equation** (1972). It shows that as D/E increases, equity beta rises, which increases the cost of equity via CAPM.

Example: A firm with unlevered beta of 0.8, D/E of 1.0, and 25% tax rate:
\`\`\`
Beta_L = 0.8 x [1 + (1 - 0.25) x 1.0] = 0.8 x 1.75 = 1.40
\`\`\`

Leverage nearly doubled the equity beta, reflecting the increased risk that equity holders bear.

### Real-World Example: The 2020 Leverage Stress Test

COVID-19 provided a natural experiment in leverage risk. Companies entering the pandemic with high leverage suffered disproportionately:

- **Hertz** (Debt/EBITDA ~4.5x): Filed for bankruptcy in May 2020
- **J.C. Penney** (Debt/EBITDA ~5.8x): Filed for bankruptcy in May 2020
- **Chesapeake Energy** (Debt/EBITDA ~8.0x): Filed for bankruptcy in June 2020

Meanwhile, conservatively leveraged companies like Apple (Debt/EBITDA ~1.0x) and Microsoft (Debt/EBITDA ~0.8x) not only survived but thrived, making acquisitions and returning capital to shareholders during the downturn (Source: Company 10-K filings, SEC.gov; Bloomberg).

### Key Takeaway

Leverage is a double-edged sword. It amplifies returns in good times but can be fatal in bad times. The optimal amount of leverage depends on the stability of cash flows, the nature of assets, and the company's competitive position. Always analyze leverage ratios alongside business fundamentals.

**Sources:** Hamada, R. "The Effect of the Firm's Capital Structure on the Systematic Risk of Common Stocks" (*JF*, 1972); Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 14-16; MIT OCW 15.401.`,
    },
  ],
};
