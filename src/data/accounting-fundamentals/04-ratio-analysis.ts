import { Module } from "../types";

export const ratioAnalysisModule: Module = {
  id: "acct-ratios",
  title: "Financial Ratio Analysis",
  description:
    "Learn to evaluate company performance using liquidity, profitability, leverage, and efficiency ratios — culminating in the DuPont decomposition framework. Resources: Penman (2013) Financial Statement Analysis, CFA Institute, Damodaran Online.",
  lessons: [
    {
      id: "acct-ratios-liquidity",
      slug: "liquidity-ratios",
      title: "Liquidity Ratios",
      content: `## Liquidity Ratios

Liquidity ratios measure a company's ability to meet its short-term obligations as they come due. They answer the question: **Can this business pay its bills?**

### Why Liquidity Matters

A profitable company can still fail if it runs out of cash. Lehman Brothers reported \\\$4 billion in net income in 2007 — and filed for bankruptcy in September 2008 when it could not meet its short-term obligations. Liquidity is the lifeblood of business survival (Berk & DeMarzo, 2020, *Corporate Finance*, Pearson).

### Current Ratio

\`\`\`
Current Ratio = Current Assets / Current Liabilities
\`\`\`

The most widely used liquidity metric. A ratio above 1.0 indicates the company has more current assets than current liabilities. Industry norms vary significantly:

| Industry | Typical Current Ratio |
|----------|---------------------|
| Manufacturing | 1.5 - 2.0 |
| Retail | 1.0 - 1.5 |
| Technology | 2.0 - 3.0 |
| Utilities | 0.5 - 1.0 |

A very high current ratio (above 3.0) may indicate the company is not using its assets efficiently — excess inventory or uncollected receivables can inflate the ratio without improving actual liquidity.

### Quick Ratio (Acid Test)

\`\`\`
Quick Ratio = (Cash + Short-term Investments + Accounts Receivable) / Current Liabilities
\`\`\`

This is a stricter test that excludes inventory and prepaid expenses — assets that may take time to convert to cash. A quick ratio above 1.0 is generally considered healthy. The acid test was developed by credit analysts who recognized that inventory-heavy companies could have misleading current ratios (Horrigan, 1968, *A Short History of Financial Ratio Analysis*, The Accounting Review).

### Cash Ratio

\`\`\`
Cash Ratio = (Cash + Short-term Investments) / Current Liabilities
\`\`\`

The most conservative liquidity measure — it considers only the most liquid assets. Few companies maintain a cash ratio above 1.0 because holding excessive cash earns below-market returns.

### Working Capital and the Cash Conversion Cycle

Beyond static ratios, the **cash conversion cycle (CCC)** measures how many days it takes to convert inventory purchases into cash receipts:

\`\`\`
CCC = Days Inventory Outstanding + Days Sales Outstanding - Days Payable Outstanding
\`\`\`

A shorter CCC indicates more efficient cash management. Amazon famously operates with a negative CCC — it collects from customers before paying suppliers (Amazon 10-K, 2023, SEC EDGAR).

### Interpreting Liquidity Ratios

Liquidity ratios must be analyzed in context:
- **Trend analysis** — is liquidity improving or deteriorating over time?
- **Peer comparison** — how does the company compare to industry averages?
- **Quality of current assets** — are receivables collectible? Is inventory sellable?

Research by Beaver (1966, *Financial Ratios as Predictors of Failure*, Journal of Accounting Research) demonstrated that the cash flow-to-debt ratio was the single best predictor of corporate bankruptcy — outperforming all other individual ratios in a landmark study of 79 failed firms.

### Key Takeaway

Liquidity ratios are your early warning system. They reveal whether a company can survive the short term, regardless of its long-term profitability. Always examine multiple liquidity metrics together rather than relying on any single ratio.

*References: Berk & DeMarzo (2020), Corporate Finance (Pearson); Horrigan (1968), The Accounting Review; Beaver (1966), Journal of Accounting Research; Amazon 10-K FY2023.*`,
      starterCode: `# Liquidity Ratio Calculator
# Calculate key liquidity ratios from balance sheet data

def calculate_liquidity_ratios(
    cash: float,
    short_term_investments: float,
    accounts_receivable: float,
    inventory: float,
    prepaid_expenses: float,
    current_liabilities: float
) -> dict:
    """
    Calculate the three main liquidity ratios.

    Returns a dict with:
    - current_ratio
    - quick_ratio
    - cash_ratio
    """
    # TODO: Calculate current assets
    current_assets = 0

    # TODO: Calculate current ratio
    current_ratio = 0

    # TODO: Calculate quick ratio (exclude inventory and prepaid)
    quick_ratio = 0

    # TODO: Calculate cash ratio
    cash_ratio = 0

    return {
        "current_ratio": round(current_ratio, 2),
        "quick_ratio": round(quick_ratio, 2),
        "cash_ratio": round(cash_ratio, 2),
    }


# Test with sample data
result = calculate_liquidity_ratios(
    cash=50000,
    short_term_investments=20000,
    accounts_receivable=80000,
    inventory=60000,
    prepaid_expenses=10000,
    current_liabilities=100000
)
print(result)
# Expected: {'current_ratio': 2.2, 'quick_ratio': 1.5, 'cash_ratio': 0.7}`,
      solutionCode: `# Liquidity Ratio Calculator
# Calculate key liquidity ratios from balance sheet data

def calculate_liquidity_ratios(
    cash: float,
    short_term_investments: float,
    accounts_receivable: float,
    inventory: float,
    prepaid_expenses: float,
    current_liabilities: float
) -> dict:
    """
    Calculate the three main liquidity ratios.

    Returns a dict with:
    - current_ratio
    - quick_ratio
    - cash_ratio
    """
    # Calculate current assets
    current_assets = cash + short_term_investments + accounts_receivable + inventory + prepaid_expenses

    # Calculate current ratio
    current_ratio = current_assets / current_liabilities

    # Calculate quick ratio (exclude inventory and prepaid)
    quick_assets = cash + short_term_investments + accounts_receivable
    quick_ratio = quick_assets / current_liabilities

    # Calculate cash ratio
    cash_ratio = (cash + short_term_investments) / current_liabilities

    return {
        "current_ratio": round(current_ratio, 2),
        "quick_ratio": round(quick_ratio, 2),
        "cash_ratio": round(cash_ratio, 2),
    }


# Test with sample data
result = calculate_liquidity_ratios(
    cash=50000,
    short_term_investments=20000,
    accounts_receivable=80000,
    inventory=60000,
    prepaid_expenses=10000,
    current_liabilities=100000
)
print(result)
# Expected: {'current_ratio': 2.2, 'quick_ratio': 1.5, 'cash_ratio': 0.7}`,
    },
    {
      id: "acct-ratios-profitability",
      slug: "profitability-ratios",
      title: "Profitability Ratios",
      content: `## Profitability Ratios

Profitability ratios measure how effectively a company generates profit relative to its revenue, assets, or equity. They answer the question: **Is this business creating value?**

### Gross Profit Margin

\`\`\`
Gross Margin = (Revenue - COGS) / Revenue
\`\`\`

Gross margin shows how much profit remains after covering the direct cost of goods or services sold. It reflects pricing power, production efficiency, and supply chain management.

**Industry benchmarks (2023 median):**
| Industry | Gross Margin |
|----------|-------------|
| Software/SaaS | 70-85% |
| Pharmaceuticals | 65-80% |
| Retail (grocery) | 25-35% |
| Manufacturing | 30-45% |

A declining gross margin over time is a red flag — it may indicate rising input costs, competitive pricing pressure, or a shift toward lower-margin products (Palepu, Healy & Peek, 2019, *Business Analysis and Valuation*, Cengage).

### Operating Profit Margin

\`\`\`
Operating Margin = Operating Income / Revenue
\`\`\`

Also called EBIT margin, this measures profitability after all operating costs (COGS + SG&A + R&D + depreciation). It isolates the efficiency of core operations from financing and tax effects.

### Net Profit Margin

\`\`\`
Net Margin = Net Income / Revenue
\`\`\`

The "bottom line" — how much of every revenue dollar the company keeps after all expenses, interest, and taxes. Net margin varies dramatically by industry and business model.

### Return on Assets (ROA)

\`\`\`
ROA = Net Income / Average Total Assets
\`\`\`

ROA measures how efficiently a company uses its assets to generate profit. It is particularly useful for comparing companies within capital-intensive industries. Average total assets = (Beginning Assets + Ending Assets) / 2.

### Return on Equity (ROE)

\`\`\`
ROE = Net Income / Average Stockholders' Equity
\`\`\`

ROE measures the return generated for shareholders. It is the single most important profitability metric for equity investors. High ROE can result from genuine operating excellence or from high financial leverage — a distinction that the DuPont analysis (Lesson 5) addresses.

Research by Fama & French (1992, *The Cross-Section of Expected Stock Returns*, Journal of Finance) found that ROE and book-to-market ratios are among the strongest predictors of stock returns — more predictive than beta alone.

### Earnings Quality Considerations

Not all profits are created equal. Analysts distinguish between:
- **Recurring earnings** — from ongoing core operations (high quality)
- **Non-recurring items** — one-time gains/losses, restructuring charges (low quality)

Penman (2013, *Financial Statement Analysis and Security Valuation*, McGraw-Hill) argues that "core operating income" — stripped of non-recurring items — is a better predictor of future performance than reported net income.

### Comparing Across Companies

When comparing profitability ratios across companies:
- Use the same time period
- Adjust for different accounting methods (e.g., LIFO vs FIFO inventory)
- Consider the industry context — a 5% net margin is excellent in grocery but poor in software
- Examine trends over 3-5 years rather than a single snapshot

### Key Takeaway

Profitability ratios reveal whether a business model is sustainable. Start with gross margin to assess the core product, then move to operating margin for operational efficiency, and finally net margin and ROE for overall shareholder returns.

*References: Palepu, Healy & Peek (2019), Business Analysis and Valuation (Cengage); Fama & French (1992), Journal of Finance; Penman (2013), Financial Statement Analysis (McGraw-Hill).*`,
      starterCode: `# Profitability Ratio Calculator

def calculate_profitability_ratios(
    revenue: float,
    cogs: float,
    operating_income: float,
    net_income: float,
    total_assets_begin: float,
    total_assets_end: float,
    equity_begin: float,
    equity_end: float
) -> dict:
    """
    Calculate key profitability ratios.

    Returns a dict with:
    - gross_margin (as percentage)
    - operating_margin (as percentage)
    - net_margin (as percentage)
    - roa (as percentage)
    - roe (as percentage)
    """
    # TODO: Calculate gross margin
    gross_margin = 0

    # TODO: Calculate operating margin
    operating_margin = 0

    # TODO: Calculate net margin
    net_margin = 0

    # TODO: Calculate ROA using average total assets
    roa = 0

    # TODO: Calculate ROE using average equity
    roe = 0

    return {
        "gross_margin": round(gross_margin, 2),
        "operating_margin": round(operating_margin, 2),
        "net_margin": round(net_margin, 2),
        "roa": round(roa, 2),
        "roe": round(roe, 2),
    }


# Test: Microsoft-like figures (simplified)
result = calculate_profitability_ratios(
    revenue=211900,
    cogs=65900,
    operating_income=88500,
    net_income=72400,
    total_assets_begin=364840,
    total_assets_end=411976,
    equity_begin=166542,
    equity_end=206223
)
print(result)
# Expected approximately: gross_margin ~68.89, operating_margin ~41.77,
# net_margin ~34.17, roa ~18.64, roe ~38.84`,
      solutionCode: `# Profitability Ratio Calculator

def calculate_profitability_ratios(
    revenue: float,
    cogs: float,
    operating_income: float,
    net_income: float,
    total_assets_begin: float,
    total_assets_end: float,
    equity_begin: float,
    equity_end: float
) -> dict:
    """
    Calculate key profitability ratios.

    Returns a dict with:
    - gross_margin (as percentage)
    - operating_margin (as percentage)
    - net_margin (as percentage)
    - roa (as percentage)
    - roe (as percentage)
    """
    # Calculate gross margin
    gross_margin = ((revenue - cogs) / revenue) * 100

    # Calculate operating margin
    operating_margin = (operating_income / revenue) * 100

    # Calculate net margin
    net_margin = (net_income / revenue) * 100

    # Calculate ROA using average total assets
    avg_assets = (total_assets_begin + total_assets_end) / 2
    roa = (net_income / avg_assets) * 100

    # Calculate ROE using average equity
    avg_equity = (equity_begin + equity_end) / 2
    roe = (net_income / avg_equity) * 100

    return {
        "gross_margin": round(gross_margin, 2),
        "operating_margin": round(operating_margin, 2),
        "net_margin": round(net_margin, 2),
        "roa": round(roa, 2),
        "roe": round(roe, 2),
    }


# Test: Microsoft-like figures (simplified)
result = calculate_profitability_ratios(
    revenue=211900,
    cogs=65900,
    operating_income=88500,
    net_income=72400,
    total_assets_begin=364840,
    total_assets_end=411976,
    equity_begin=166542,
    equity_end=206223
)
print(result)`,
    },
    {
      id: "acct-ratios-leverage",
      slug: "leverage-ratios",
      title: "Leverage Ratios",
      content: `## Leverage Ratios

Leverage ratios (also called solvency ratios) measure the extent to which a company uses debt to finance its operations. They answer the question: **How risky is this company's capital structure?**

### Why Leverage Matters

Debt is a double-edged sword. It amplifies returns when times are good — but amplifies losses when times are bad. The 2008 financial crisis demonstrated the catastrophic effects of excessive leverage: Lehman Brothers had a leverage ratio of approximately 30:1 (30 dollars of debt for every dollar of equity) when it collapsed (Financial Crisis Inquiry Commission, 2011).

### Debt-to-Equity Ratio

\`\`\`
Debt-to-Equity = Total Liabilities / Total Stockholders' Equity
\`\`\`

This is the primary leverage metric. A ratio of 1.0 means the company uses equal parts debt and equity. Higher ratios indicate greater reliance on debt financing.

| Industry | Typical D/E Ratio |
|----------|------------------|
| Utilities | 1.0 - 2.0 (capital-intensive, stable cash flows) |
| Technology | 0.2 - 0.5 (asset-light) |
| Financial services | 5.0 - 15.0 (leverage is the business model) |
| Manufacturing | 0.5 - 1.5 |

### Debt-to-Assets Ratio

\`\`\`
Debt-to-Assets = Total Liabilities / Total Assets
\`\`\`

This shows the percentage of assets financed by debt. A ratio of 0.60 means 60% of assets are debt-financed. The remaining 40% is financed by equity.

### Interest Coverage Ratio (Times Interest Earned)

\`\`\`
Interest Coverage = EBIT / Interest Expense
\`\`\`

This measures how easily a company can pay interest on outstanding debt. A ratio below 1.5 is a serious warning sign — the company barely earns enough to cover interest payments. Credit rating agencies use this ratio extensively: S&P considers interest coverage below 2.0 to be speculative grade (S&P Global Ratings, 2023).

### Debt Service Coverage Ratio

\`\`\`
DSCR = Net Operating Income / Total Debt Service
\`\`\`

Where total debt service = interest payments + principal repayments. Lenders require a DSCR above 1.2 for most commercial loans. A DSCR below 1.0 means the company cannot cover its debt obligations from operating income.

### The Modigliani-Miller Theorem

In a seminal 1958 paper, Franco Modigliani and Merton Miller proved that in a frictionless market (no taxes, no bankruptcy costs), capital structure is irrelevant — a company's value is determined solely by its operating cash flows, not how it is financed. However, in the real world, the tax deductibility of interest creates a "tax shield" that makes debt cheaper than equity, while bankruptcy costs create a limit. The optimal capital structure balances these two forces (Modigliani & Miller, 1958, *The Cost of Capital, Corporation Finance and the Theory of Investment*, American Economic Review).

### Financial Leverage and Risk

Higher leverage increases both the expected return and the risk for equity holders:

\`\`\`
ROE = ROA + (ROA - Interest Rate) * (Debt / Equity)
\`\`\`

If ROA > interest rate, more debt increases ROE. If ROA < interest rate, more debt *decreases* ROE. This is why leverage is beneficial in expansions but devastating in recessions.

### Credit Ratings and Leverage

Moody's and S&P assign credit ratings based heavily on leverage metrics. A company's rating directly affects its borrowing cost:

| Rating | Typical D/E | Spread Over Treasuries |
|--------|------------|----------------------|
| AAA | 0.1 - 0.3 | 0.5-1.0% |
| A | 0.5 - 1.0 | 1.0-2.0% |
| BBB | 1.0 - 2.0 | 2.0-3.5% |
| BB (Junk) | 2.0+ | 4.0-6.0%+ |

### Key Takeaway

Leverage ratios reveal the financial risk embedded in a company's capital structure. Moderate leverage can enhance returns, but excessive leverage creates fragility. Always pair leverage analysis with interest coverage to assess whether the company can service its debt.

*References: Modigliani & Miller (1958), American Economic Review; Financial Crisis Inquiry Commission (2011); S&P Global Ratings Methodology (2023); Berk & DeMarzo (2020), Corporate Finance (Pearson).*`,
      starterCode: `# Leverage Ratio Calculator

def calculate_leverage_ratios(
    total_liabilities: float,
    total_equity: float,
    total_assets: float,
    ebit: float,
    interest_expense: float
) -> dict:
    """
    Calculate key leverage ratios.

    Returns a dict with:
    - debt_to_equity
    - debt_to_assets
    - interest_coverage
    """
    # TODO: Calculate debt-to-equity ratio
    debt_to_equity = 0

    # TODO: Calculate debt-to-assets ratio
    debt_to_assets = 0

    # TODO: Calculate interest coverage ratio
    # Handle case where interest_expense is 0
    interest_coverage = 0

    return {
        "debt_to_equity": round(debt_to_equity, 2),
        "debt_to_assets": round(debt_to_assets, 2),
        "interest_coverage": round(interest_coverage, 2),
    }


# Test
result = calculate_leverage_ratios(
    total_liabilities=290000,
    total_equity=62000,
    total_assets=352000,
    ebit=88500,
    interest_expense=2000
)
print(result)
# Expected: {'debt_to_equity': 4.68, 'debt_to_assets': 0.82, 'interest_coverage': 44.25}`,
      solutionCode: `# Leverage Ratio Calculator

def calculate_leverage_ratios(
    total_liabilities: float,
    total_equity: float,
    total_assets: float,
    ebit: float,
    interest_expense: float
) -> dict:
    """
    Calculate key leverage ratios.

    Returns a dict with:
    - debt_to_equity
    - debt_to_assets
    - interest_coverage
    """
    # Calculate debt-to-equity ratio
    debt_to_equity = total_liabilities / total_equity

    # Calculate debt-to-assets ratio
    debt_to_assets = total_liabilities / total_assets

    # Calculate interest coverage ratio
    # Handle case where interest_expense is 0
    if interest_expense == 0:
        interest_coverage = float('inf')
    else:
        interest_coverage = ebit / interest_expense

    return {
        "debt_to_equity": round(debt_to_equity, 2),
        "debt_to_assets": round(debt_to_assets, 2),
        "interest_coverage": round(interest_coverage, 2),
    }


# Test
result = calculate_leverage_ratios(
    total_liabilities=290000,
    total_equity=62000,
    total_assets=352000,
    ebit=88500,
    interest_expense=2000
)
print(result)`,
    },
    {
      id: "acct-ratios-efficiency",
      slug: "efficiency-ratios",
      title: "Efficiency Ratios",
      content: `## Efficiency Ratios

Efficiency ratios (also called activity or turnover ratios) measure how effectively a company utilizes its assets and manages its liabilities. They answer the question: **How well is this company using its resources?**

### Asset Turnover

\`\`\`
Asset Turnover = Revenue / Average Total Assets
\`\`\`

This measures how many dollars of revenue are generated for each dollar of assets. Higher is better — it indicates the company is extracting more revenue from its asset base.

The asset turnover ratio varies dramatically by industry. Grocery retailers (high volume, low margin) often exceed 2.5x, while utilities (capital-intensive, regulated) may be below 0.3x. This inverse relationship between margin and turnover is a fundamental principle of business strategy (Penman, 2013, *Financial Statement Analysis*, McGraw-Hill).

### Inventory Turnover

\`\`\`
Inventory Turnover = COGS / Average Inventory
\`\`\`

This measures how many times inventory is sold and replaced during a period. Higher turnover means faster-moving inventory.

**Days Inventory Outstanding (DIO):**
\`\`\`
DIO = 365 / Inventory Turnover
\`\`\`

DIO converts the ratio into a number of days, which is more intuitive. Walmart's DIO is approximately 40 days, meaning inventory sits on shelves for about 40 days before being sold. By contrast, Boeing's DIO can exceed 300 days due to the nature of aircraft manufacturing (respective 10-K filings, SEC EDGAR).

### Receivables Turnover

\`\`\`
Receivables Turnover = Net Credit Sales / Average Accounts Receivable
\`\`\`

This measures how quickly the company collects payments from customers.

**Days Sales Outstanding (DSO):**
\`\`\`
DSO = 365 / Receivables Turnover
\`\`\`

A DSO of 30 means the company collects its receivables in about 30 days on average. Rising DSO may indicate deteriorating credit quality or collection problems.

### Payables Turnover

\`\`\`
Payables Turnover = COGS / Average Accounts Payable
\`\`\`

**Days Payable Outstanding (DPO):**
\`\`\`
DPO = 365 / Payables Turnover
\`\`\`

A higher DPO means the company takes longer to pay its suppliers — which preserves cash but may strain supplier relationships.

### Cash Conversion Cycle

The CCC combines the three turnover metrics:
\`\`\`
CCC = DIO + DSO - DPO
\`\`\`

This is the number of days between paying suppliers for inventory and receiving cash from customers. A negative CCC — as seen at Amazon and Dell — means the company is funded by its working capital cycle rather than by external financing (Shin & Soenen, 1998, *Efficiency of Working Capital Management*, Financial Practice and Education).

### Fixed Asset Turnover

\`\`\`
Fixed Asset Turnover = Revenue / Average Net Fixed Assets
\`\`\`

This measures how efficiently the company uses its property, plant, and equipment. It is particularly important in capital-intensive industries like airlines, telecom, and manufacturing.

### Interpreting Efficiency Ratios

Efficiency ratios are most meaningful when compared:
- **Over time** — are ratios improving or declining?
- **Against peers** — how does the company compare to industry averages?
- **Against the business model** — a luxury brand should not be compared to a discount retailer

Research by Deloof (2003, *Does Working Capital Management Affect Profitability?*, Journal of Business Finance & Accounting) found a statistically significant negative relationship between the cash conversion cycle and profitability — companies that manage working capital more efficiently tend to be more profitable.

### Key Takeaway

Efficiency ratios reveal how well management converts assets into revenue and manages the working capital cycle. A company can be profitable on paper but inefficient in practice — and efficiency ratios expose that gap.

*References: Penman (2013), Financial Statement Analysis (McGraw-Hill); Shin & Soenen (1998), Financial Practice and Education; Deloof (2003), Journal of Business Finance & Accounting; SEC EDGAR 10-K filings.*`,
      starterCode: `# Efficiency Ratio Calculator

def calculate_efficiency_ratios(
    revenue: float,
    cogs: float,
    avg_total_assets: float,
    avg_inventory: float,
    avg_accounts_receivable: float,
    avg_accounts_payable: float
) -> dict:
    """
    Calculate key efficiency ratios and the cash conversion cycle.

    Returns a dict with:
    - asset_turnover
    - inventory_turnover
    - dio (days inventory outstanding)
    - dso (days sales outstanding)
    - dpo (days payable outstanding)
    - cash_conversion_cycle
    """
    # TODO: Calculate asset turnover
    asset_turnover = 0

    # TODO: Calculate inventory turnover and DIO
    inventory_turnover = 0
    dio = 0

    # TODO: Calculate receivables turnover and DSO
    receivables_turnover = 0
    dso = 0

    # TODO: Calculate payables turnover and DPO
    payables_turnover = 0
    dpo = 0

    # TODO: Calculate cash conversion cycle
    ccc = 0

    return {
        "asset_turnover": round(asset_turnover, 2),
        "inventory_turnover": round(inventory_turnover, 2),
        "dio": round(dio, 1),
        "dso": round(dso, 1),
        "dpo": round(dpo, 1),
        "cash_conversion_cycle": round(ccc, 1),
    }


# Test
result = calculate_efficiency_ratios(
    revenue=500000,
    cogs=300000,
    avg_total_assets=400000,
    avg_inventory=50000,
    avg_accounts_receivable=60000,
    avg_accounts_payable=40000
)
print(result)
# Expected: asset_turnover=1.25, inventory_turnover=6.0, dio=60.8,
# dso=43.8, dpo=48.7, cash_conversion_cycle=55.9`,
      solutionCode: `# Efficiency Ratio Calculator

def calculate_efficiency_ratios(
    revenue: float,
    cogs: float,
    avg_total_assets: float,
    avg_inventory: float,
    avg_accounts_receivable: float,
    avg_accounts_payable: float
) -> dict:
    """
    Calculate key efficiency ratios and the cash conversion cycle.

    Returns a dict with:
    - asset_turnover
    - inventory_turnover
    - dio (days inventory outstanding)
    - dso (days sales outstanding)
    - dpo (days payable outstanding)
    - cash_conversion_cycle
    """
    # Calculate asset turnover
    asset_turnover = revenue / avg_total_assets

    # Calculate inventory turnover and DIO
    inventory_turnover = cogs / avg_inventory
    dio = 365 / inventory_turnover

    # Calculate receivables turnover and DSO
    receivables_turnover = revenue / avg_accounts_receivable
    dso = 365 / receivables_turnover

    # Calculate payables turnover and DPO
    payables_turnover = cogs / avg_accounts_payable
    dpo = 365 / payables_turnover

    # Calculate cash conversion cycle
    ccc = dio + dso - dpo

    return {
        "asset_turnover": round(asset_turnover, 2),
        "inventory_turnover": round(inventory_turnover, 2),
        "dio": round(dio, 1),
        "dso": round(dso, 1),
        "dpo": round(dpo, 1),
        "cash_conversion_cycle": round(ccc, 1),
    }


# Test
result = calculate_efficiency_ratios(
    revenue=500000,
    cogs=300000,
    avg_total_assets=400000,
    avg_inventory=50000,
    avg_accounts_receivable=60000,
    avg_accounts_payable=40000
)
print(result)`,
    },
    {
      id: "acct-ratios-dupont",
      slug: "dupont-analysis",
      title: "DuPont Analysis",
      content: `## DuPont Analysis

DuPont Analysis is a framework that decomposes Return on Equity (ROE) into three component ratios, revealing the drivers of shareholder returns. Developed by the DuPont Corporation in the 1920s, it remains one of the most widely used tools in financial analysis.

### The Three-Component DuPont Model

\`\`\`
ROE = Net Profit Margin × Asset Turnover × Equity Multiplier
\`\`\`

Or equivalently:
\`\`\`
ROE = (Net Income / Revenue) × (Revenue / Avg Assets) × (Avg Assets / Avg Equity)
\`\`\`

Notice that Revenue cancels from the first two terms, and Assets cancels from the second and third, collapsing to:
\`\`\`
ROE = Net Income / Avg Equity
\`\`\`

The decomposition is algebraically identical to ROE — but it separates ROE into three distinct sources of return.

### The Three Drivers

**1. Net Profit Margin** (Net Income / Revenue)
- Measures operational efficiency and pricing power
- Improved by reducing costs, raising prices, or improving product mix
- "How much profit does each dollar of revenue generate?"

**2. Asset Turnover** (Revenue / Average Total Assets)
- Measures asset utilization efficiency
- Improved by generating more revenue without proportionally increasing assets
- "How effectively do assets generate revenue?"

**3. Equity Multiplier** (Average Total Assets / Average Stockholders' Equity)
- Measures financial leverage
- Higher multiplier = more debt relative to equity
- "How much leverage is used to amplify returns?"

### Strategic Implications

Different business strategies emphasize different DuPont components:

| Strategy | Margin | Turnover | Leverage |
|----------|--------|----------|----------|
| Luxury brand (LVMH) | High | Low | Moderate |
| Discount retailer (Walmart) | Low | High | Moderate |
| Bank (JPMorgan) | Moderate | Low | Very High |
| Tech (Apple) | High | Moderate | Moderate |

Soliman (2008, *The Use of DuPont Analysis by Market Participants*, The Accounting Review) found that changes in asset turnover and profit margin provide incremental information about future profitability beyond what aggregate ROE reveals. Analysts who use DuPont decomposition make significantly better earnings forecasts.

### The Five-Component Extended DuPont Model

The extended model further decomposes margin and adds a tax and interest dimension:

\`\`\`
ROE = Tax Burden × Interest Burden × EBIT Margin × Asset Turnover × Equity Multiplier
\`\`\`

Where:
- Tax Burden = Net Income / EBT (how much the government takes)
- Interest Burden = EBT / EBIT (how much creditors take)
- EBIT Margin = EBIT / Revenue (operating efficiency)

This five-factor model, popularized by Nissim & Penman (2001, *Ratio Analysis and Equity Valuation*, Review of Accounting Studies), separates operating performance from financing decisions and tax effects.

### Practical Example

Consider two companies with identical 15% ROE:

**Company A (Luxury):**
- Margin: 15% × Turnover: 0.5× × Multiplier: 2.0× = 15% ROE

**Company B (Retail):**
- Margin: 3% × Turnover: 2.5× × Multiplier: 2.0× = 15% ROE

Same ROE, completely different business models. Company A earns high margins on fewer sales; Company B earns thin margins on high volume. An investor who looks only at ROE misses this critical distinction.

### Trend Analysis

DuPont analysis is most powerful when applied over time. If ROE is rising:
- Is it because margins are improving? (positive — operational improvement)
- Is it because leverage is increasing? (potentially risky)
- Is it because turnover is improving? (positive — better asset utilization)

### Key Takeaway

DuPont Analysis transforms a single number (ROE) into a strategic story. By decomposing ROE into margin, turnover, and leverage, it reveals whether shareholder returns come from operational excellence, efficient asset use, or financial risk-taking.

> "You can have a high return on equity by having high margins, high turnover, or high leverage. Only the first two are truly desirable." — DuPont Corporation internal memo, 1920s

*References: Soliman (2008), The Accounting Review; Nissim & Penman (2001), Review of Accounting Studies; Penman (2013), Financial Statement Analysis (McGraw-Hill).*`,
      starterCode: `# DuPont Analysis Calculator

def dupont_analysis(
    net_income: float,
    revenue: float,
    avg_total_assets: float,
    avg_equity: float
) -> dict:
    """
    Perform 3-component DuPont decomposition of ROE.

    Returns a dict with:
    - net_profit_margin (percentage)
    - asset_turnover (times)
    - equity_multiplier (times)
    - roe_decomposed (percentage, product of all three)
    - roe_direct (percentage, net_income / avg_equity)
    """
    # TODO: Calculate net profit margin
    net_profit_margin = 0

    # TODO: Calculate asset turnover
    asset_turnover = 0

    # TODO: Calculate equity multiplier
    equity_multiplier = 0

    # TODO: Calculate ROE via decomposition
    roe_decomposed = 0

    # TODO: Calculate ROE directly for verification
    roe_direct = 0

    return {
        "net_profit_margin": round(net_profit_margin, 2),
        "asset_turnover": round(asset_turnover, 2),
        "equity_multiplier": round(equity_multiplier, 2),
        "roe_decomposed": round(roe_decomposed, 2),
        "roe_direct": round(roe_direct, 2),
    }


# Test: Two companies with same ROE, different strategies
luxury = dupont_analysis(15000, 100000, 200000, 100000)
retail = dupont_analysis(15000, 500000, 200000, 100000)

print("Luxury brand:", luxury)
print("Retail chain:", retail)
# Both should show roe ~15%, but different margin/turnover profiles`,
      solutionCode: `# DuPont Analysis Calculator

def dupont_analysis(
    net_income: float,
    revenue: float,
    avg_total_assets: float,
    avg_equity: float
) -> dict:
    """
    Perform 3-component DuPont decomposition of ROE.

    Returns a dict with:
    - net_profit_margin (percentage)
    - asset_turnover (times)
    - equity_multiplier (times)
    - roe_decomposed (percentage, product of all three)
    - roe_direct (percentage, net_income / avg_equity)
    """
    # Calculate net profit margin
    net_profit_margin = (net_income / revenue) * 100

    # Calculate asset turnover
    asset_turnover = revenue / avg_total_assets

    # Calculate equity multiplier
    equity_multiplier = avg_total_assets / avg_equity

    # Calculate ROE via decomposition (margin * turnover * multiplier)
    roe_decomposed = (net_profit_margin / 100) * asset_turnover * equity_multiplier * 100

    # Calculate ROE directly for verification
    roe_direct = (net_income / avg_equity) * 100

    return {
        "net_profit_margin": round(net_profit_margin, 2),
        "asset_turnover": round(asset_turnover, 2),
        "equity_multiplier": round(equity_multiplier, 2),
        "roe_decomposed": round(roe_decomposed, 2),
        "roe_direct": round(roe_direct, 2),
    }


# Test: Two companies with same ROE, different strategies
luxury = dupont_analysis(15000, 100000, 200000, 100000)
retail = dupont_analysis(15000, 500000, 200000, 100000)

print("Luxury brand:", luxury)
print("Retail chain:", retail)`,
    },
  ],
};
