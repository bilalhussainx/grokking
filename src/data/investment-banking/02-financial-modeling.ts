import { Module } from "../types";

export const modelingModule: Module = {
  id: "ib-modeling",
  title: "Financial Modeling Essentials",
  description:
    "Build the core three-statement financial model used in every investment banking transaction.",
  lessons: [
    {
      id: "ib-modeling-three-statement",
      slug: "three-statement-model",
      title: "The Three-Statement Model",
      content: `## The Three-Statement Model

The three-statement model is the foundation of all financial modeling in investment banking. It links the **Income Statement**, **Balance Sheet**, and **Cash Flow Statement** into a single, dynamic model that projects a company's financial future. Every DCF, LBO, and merger model builds on top of this foundation.

### Why Three Statements?

Each statement captures a different dimension of financial performance:

| Statement | Measures | Time Frame |
|-----------|----------|------------|
| **Income Statement** | Profitability | A period (quarter/year) |
| **Balance Sheet** | Financial position | A point in time |
| **Cash Flow Statement** | Cash generation | A period (quarter/year) |

A company can be profitable but cash-poor (if it extends generous payment terms to customers). It can generate cash but have a weak balance sheet (if it carries too much debt). You need all three statements to form a complete picture.

### The Linkages

The magic of a three-statement model lies in how the statements connect:

**Income Statement flows to Balance Sheet:**
- Net income flows into retained earnings (shareholders' equity)
- Depreciation reduces the net book value of PP&E (property, plant, and equipment)
- Interest expense relates to the debt balance

**Income Statement flows to Cash Flow Statement:**
- Net income is the starting point of the cash flow statement
- Non-cash items (depreciation, amortization, stock-based compensation) are added back

**Balance Sheet flows to Cash Flow Statement:**
- Changes in working capital accounts (receivables, inventory, payables) appear in operating cash flow
- Capital expenditures (changes in PP&E) appear in investing cash flow
- Debt issuances and repayments appear in financing cash flow

**Cash Flow Statement flows back to Balance Sheet:**
- The ending cash balance on the cash flow statement equals the cash line on the balance sheet

### Model Structure

A well-built three-statement model typically has these tabs:

1. **Assumptions** — All key inputs in one place (growth rates, margins, CapEx assumptions)
2. **Income Statement** — Revenue through net income
3. **Balance Sheet** — Assets, liabilities, and equity
4. **Cash Flow Statement** — Operating, investing, and financing activities
5. **Supporting Schedules** — Depreciation schedule, debt schedule, working capital schedule

### Building Order

Always build in this order:
1. Income Statement (revenue through EBIT)
2. Balance Sheet — working capital and PP&E sections
3. Cash Flow Statement — operating and investing sections
4. Debt Schedule — interest expense feeds back to Income Statement
5. Complete the Income Statement (interest expense through net income)
6. Complete the Balance Sheet (debt balances, retained earnings, cash as plug)

### Key Takeaway

The three-statement model is circular by design — the debt schedule drives interest expense, which affects net income, which affects cash flow, which determines how much debt can be repaid. Building it in the right order and managing circularity properly is what separates competent modelers from beginners.`,
      starterCode: `# Three-Statement Model - Basic Framework
# Build a simplified three-statement model

class ThreeStatementModel:
    def __init__(self, revenue, cogs_pct, opex_pct, tax_rate,
                 depreciation, capex, interest_rate, beginning_debt):
        self.revenue = revenue
        self.cogs_pct = cogs_pct
        self.opex_pct = opex_pct
        self.tax_rate = tax_rate
        self.depreciation = depreciation
        self.capex = capex
        self.interest_rate = interest_rate
        self.beginning_debt = beginning_debt

    def income_statement(self):
        """Calculate Income Statement line items.
        Returns dict with: revenue, cogs, gross_profit,
        opex, ebitda, depreciation, ebit,
        interest_expense, ebt, taxes, net_income"""
        # TODO: Calculate each line item
        pass

    def cash_flow_statement(self, net_income, depreciation,
                            change_in_wc, capex, debt_repayment):
        """Calculate Cash Flow Statement.
        Returns dict with: operating_cf, investing_cf,
        financing_cf, net_change_in_cash"""
        # TODO: Calculate each section
        pass

    def balance_sheet_check(self, total_assets, total_liabilities,
                            total_equity):
        """Verify the balance sheet balances.
        Returns True if Assets = Liabilities + Equity"""
        # TODO: Implement the balance check
        pass


# Test the model
model = ThreeStatementModel(
    revenue=1000, cogs_pct=0.60, opex_pct=0.15,
    tax_rate=0.25, depreciation=50, capex=80,
    interest_rate=0.05, beginning_debt=500
)

income = model.income_statement()
if income:
    print("=== Income Statement ===")
    for key, val in income.items():
        print(f"  {key}: {val:,.1f}")
`,
      solutionCode: `# Three-Statement Model - Solution

class ThreeStatementModel:
    def __init__(self, revenue, cogs_pct, opex_pct, tax_rate,
                 depreciation, capex, interest_rate, beginning_debt):
        self.revenue = revenue
        self.cogs_pct = cogs_pct
        self.opex_pct = opex_pct
        self.tax_rate = tax_rate
        self.depreciation = depreciation
        self.capex = capex
        self.interest_rate = interest_rate
        self.beginning_debt = beginning_debt

    def income_statement(self):
        cogs = self.revenue * self.cogs_pct
        gross_profit = self.revenue - cogs
        opex = self.revenue * self.opex_pct
        ebitda = gross_profit - opex
        ebit = ebitda - self.depreciation
        interest_expense = self.beginning_debt * self.interest_rate
        ebt = ebit - interest_expense
        taxes = max(ebt * self.tax_rate, 0)
        net_income = ebt - taxes
        return {
            "revenue": self.revenue,
            "cogs": cogs,
            "gross_profit": gross_profit,
            "opex": opex,
            "ebitda": ebitda,
            "depreciation": self.depreciation,
            "ebit": ebit,
            "interest_expense": interest_expense,
            "ebt": ebt,
            "taxes": taxes,
            "net_income": net_income,
        }

    def cash_flow_statement(self, net_income, depreciation,
                            change_in_wc, capex, debt_repayment):
        operating_cf = net_income + depreciation - change_in_wc
        investing_cf = -capex
        financing_cf = -debt_repayment
        net_change = operating_cf + investing_cf + financing_cf
        return {
            "operating_cf": operating_cf,
            "investing_cf": investing_cf,
            "financing_cf": financing_cf,
            "net_change_in_cash": net_change,
        }

    def balance_sheet_check(self, total_assets, total_liabilities,
                            total_equity):
        return abs(total_assets - (total_liabilities + total_equity)) < 0.01


model = ThreeStatementModel(
    revenue=1000, cogs_pct=0.60, opex_pct=0.15,
    tax_rate=0.25, depreciation=50, capex=80,
    interest_rate=0.05, beginning_debt=500
)

income = model.income_statement()
print("=== Income Statement ===")
for key, val in income.items():
    print(f"  {key}: {val:,.1f}")

cf = model.cash_flow_statement(
    net_income=income["net_income"],
    depreciation=income["depreciation"],
    change_in_wc=20, capex=80, debt_repayment=50
)
print("\\n=== Cash Flow Statement ===")
for key, val in cf.items():
    print(f"  {key}: {val:,.1f}")
`,
    },
    {
      id: "ib-modeling-revenue-forecast",
      slug: "revenue-forecasting",
      title: "Revenue Forecasting",
      content: `## Revenue Forecasting

Revenue is the single most important line item in a financial model. Every other projection — costs, margins, cash flows, valuation — depends on your revenue forecast. Getting it right (or at least directionally correct) is the foundation of credible analysis.

### Top-Down vs. Bottom-Up Approaches

There are two fundamental approaches to forecasting revenue, and the best models use both as cross-checks:

**Top-Down Approach**
Start with the total addressable market (TAM) and work down:
1. Total market size (in dollars or units)
2. Company's market share
3. Market share growth or decline assumptions
4. Implied revenue

This approach is useful for high-level estimates and for companies where market dynamics are the primary driver.

**Bottom-Up Approach**
Start with the company's specific revenue drivers and build up:
1. Number of customers or units sold
2. Average revenue per customer (ARPU) or average selling price (ASP)
3. Growth in each driver
4. Implied revenue

This approach is more granular and is preferred when you have detailed operational data.

### Revenue Build by Segment

Most companies report revenue by segment, geography, or product line. A robust model forecasts each segment separately because growth rates and margins often differ:

| Segment | Year 1 | Growth | Year 2 | Growth | Year 3 |
|---------|--------|--------|--------|--------|--------|
| Product A | 500 | 10% | 550 | 8% | 594 |
| Product B | 300 | 15% | 345 | 12% | 386 |
| Services | 200 | 5% | 210 | 5% | 221 |
| **Total** | **1,000** | | **1,105** | | **1,201** |

### Key Revenue Drivers to Model

Depending on the industry, different drivers matter:

- **SaaS companies**: Number of subscribers, ARPU, churn rate, expansion revenue
- **Retail**: Same-store sales growth, new store openings, revenue per square foot
- **Manufacturing**: Units shipped, average selling price, capacity utilization
- **Banks**: Net interest margin, loan volume, fee income
- **Subscription media**: Subscribers, average revenue per user, advertising revenue

### Historical Analysis

Before projecting forward, analyze historical performance:

1. **Revenue growth rates** — Calculate year-over-year growth for at least 3-5 years
2. **Seasonality** — Many businesses have seasonal patterns (e.g., retail peaks in Q4)
3. **Organic vs. inorganic** — Separate growth from acquisitions vs. organic growth
4. **One-time items** — Identify and normalize for unusual events

### Sanity Checks

Always stress-test your revenue forecast:

- Is the implied market share realistic? (Growing from 5% to 50% in 3 years is usually not credible)
- How does growth compare to industry benchmarks?
- Does the growth rate decelerate over time? (High growth typically does not sustain indefinitely)
- Are management's guidance and analyst consensus materially different from your forecast?

### Key Takeaway

Revenue forecasting is part science, part art. The science is in the historical analysis, segment-level modeling, and driver-based calculations. The art is in the assumptions about growth trajectories, market dynamics, and competitive positioning. Always document your assumptions clearly and build scenarios (bull, base, bear) to capture the range of outcomes.`,
      starterCode: `# Revenue Forecasting Model
# Build a segment-level revenue forecast

def forecast_revenue(segments, years=5):
    """
    Forecast revenue for multiple segments over N years.

    Args:
        segments: list of dicts with keys:
            - name: segment name
            - base_revenue: Year 0 revenue
            - growth_rates: list of annual growth rates
        years: number of years to forecast

    Returns:
        dict mapping segment name to list of projected revenues
    """
    # TODO: For each segment, project revenue using growth rates
    # If growth_rates has fewer entries than years,
    # use the last rate for remaining years
    pass


def calculate_cagr(beginning_value, ending_value, years):
    """Calculate Compound Annual Growth Rate."""
    # TODO: CAGR = (ending/beginning)^(1/years) - 1
    pass


# Test data
segments = [
    {
        "name": "Software Licenses",
        "base_revenue": 500,
        "growth_rates": [0.15, 0.12, 0.10, 0.08, 0.06],
    },
    {
        "name": "Cloud Services",
        "base_revenue": 200,
        "growth_rates": [0.30, 0.25, 0.20, 0.18, 0.15],
    },
    {
        "name": "Maintenance",
        "base_revenue": 300,
        "growth_rates": [0.03, 0.03, 0.02, 0.02, 0.02],
    },
]

projections = forecast_revenue(segments, years=5)
if projections:
    for name, values in projections.items():
        print(f"{name}: {[round(v, 1) for v in values]}")
`,
      solutionCode: `# Revenue Forecasting Model - Solution

def forecast_revenue(segments, years=5):
    result = {}
    for seg in segments:
        revenues = []
        current = seg["base_revenue"]
        rates = seg["growth_rates"]
        for y in range(years):
            rate = rates[y] if y < len(rates) else rates[-1]
            current = current * (1 + rate)
            revenues.append(current)
        result[seg["name"]] = revenues
    return result


def calculate_cagr(beginning_value, ending_value, years):
    if beginning_value <= 0 or years <= 0:
        return None
    return (ending_value / beginning_value) ** (1 / years) - 1


segments = [
    {
        "name": "Software Licenses",
        "base_revenue": 500,
        "growth_rates": [0.15, 0.12, 0.10, 0.08, 0.06],
    },
    {
        "name": "Cloud Services",
        "base_revenue": 200,
        "growth_rates": [0.30, 0.25, 0.20, 0.18, 0.15],
    },
    {
        "name": "Maintenance",
        "base_revenue": 300,
        "growth_rates": [0.03, 0.03, 0.02, 0.02, 0.02],
    },
]

projections = forecast_revenue(segments, years=5)
total_by_year = [0] * 5
for name, values in projections.items():
    print(f"{name}: {[round(v, 1) for v in values]}")
    for i, v in enumerate(values):
        total_by_year[i] += v

print(f"\\nTotal: {[round(v, 1) for v in total_by_year]}")

# Calculate CAGR for each segment
for seg in segments:
    vals = projections[seg["name"]]
    cagr = calculate_cagr(seg["base_revenue"], vals[-1], 5)
    print(f"{seg['name']} 5-year CAGR: {cagr:.1%}")
`,
    },
    {
      id: "ib-modeling-working-capital",
      slug: "working-capital",
      title: "Working Capital Modeling",
      content: `## Working Capital Modeling

Working capital is the lifeblood of a company's day-to-day operations. In financial modeling, accurately projecting working capital is essential because changes in working capital directly impact free cash flow — and therefore, valuation.

### What is Working Capital?

**Net Working Capital (NWC)** = Current Assets - Current Liabilities

More specifically, **operating working capital** focuses on the items directly tied to business operations:

| Current Assets | Current Liabilities |
|---------------|-------------------|
| Accounts Receivable | Accounts Payable |
| Inventory | Accrued Expenses |
| Prepaid Expenses | Deferred Revenue |

We exclude cash and short-term debt because these are typically modeled separately (cash is often the "plug" in the model, and debt has its own schedule).

### Why Working Capital Matters for Cash Flow

The income statement records revenue when it is earned, not when cash is collected. Working capital adjustments bridge this gap:

- **Accounts Receivable increases** mean the company recorded revenue but has not yet collected cash — this is a **use** of cash
- **Inventory increases** mean the company spent cash buying or producing goods that have not yet been sold — a **use** of cash
- **Accounts Payable increases** mean the company received goods or services but has not yet paid — a **source** of cash

The formula is: **Change in NWC = Prior Period NWC - Current Period NWC**

A negative change (NWC increased) represents a cash outflow. A positive change (NWC decreased) represents a cash inflow.

### The Days-Based Approach

The most common method for projecting working capital is the **days-based approach**, which ties each working capital item to a relevant income statement driver:

**Days Sales Outstanding (DSO)** = (Accounts Receivable / Revenue) x 365
- Measures how quickly a company collects from customers
- Higher DSO = slower collection = more cash tied up

**Days Inventory Outstanding (DIO)** = (Inventory / COGS) x 365
- Measures how long inventory sits before being sold
- Higher DIO = more cash tied up in unsold goods

**Days Payable Outstanding (DPO)** = (Accounts Payable / COGS) x 365
- Measures how long a company takes to pay suppliers
- Higher DPO = more favorable for cash flow

**Cash Conversion Cycle (CCC)** = DSO + DIO - DPO

The cash conversion cycle tells you how many days it takes a company to convert its investments in inventory and other resources into cash flows from sales. A lower CCC is generally better.

### Modeling Working Capital

To project working capital items:

1. Calculate historical DSO, DIO, and DPO for at least 3 years
2. Identify trends — are days metrics stable, improving, or deteriorating?
3. Make assumptions for the projection period (often based on historical averages or management guidance)
4. Calculate projected balances:
   - Projected AR = (Projected Revenue x Assumed DSO) / 365
   - Projected Inventory = (Projected COGS x Assumed DIO) / 365
   - Projected AP = (Projected COGS x Assumed DPO) / 365

### Industry Benchmarks

Working capital needs vary dramatically by industry:

| Industry | Typical DSO | Typical DIO | Typical DPO |
|----------|------------|------------|------------|
| Software/SaaS | 50-80 | N/A | 30-45 |
| Retail | 5-10 | 40-80 | 30-50 |
| Manufacturing | 40-60 | 60-120 | 40-70 |
| Healthcare | 50-70 | 30-60 | 40-60 |

### Key Takeaway

Working capital modeling translates the accrual-based income statement into cash reality. Small errors in working capital assumptions compound over a multi-year projection and can materially impact your DCF valuation. Always analyze historical trends, benchmark against peers, and sensitize your assumptions.`,
    },
    {
      id: "ib-modeling-debt-schedule",
      slug: "debt-schedule",
      title: "The Debt Schedule",
      content: `## The Debt Schedule

The debt schedule is one of the most technically demanding components of a financial model. It tracks all borrowings — their balances, interest payments, and repayment schedules — and creates the circular reference that makes the three-statement model truly dynamic.

### Why a Debt Schedule Matters

Debt directly impacts three critical areas:

1. **Interest expense** on the Income Statement (reduces pre-tax income)
2. **Debt balances** on the Balance Sheet (affects leverage ratios)
3. **Debt repayments and issuances** on the Cash Flow Statement (financing activities)

Without a proper debt schedule, your model cannot accurately capture these interactions.

### Structure of a Debt Schedule

A typical debt schedule includes these rows for each debt instrument:

| Row | Description |
|-----|-------------|
| Beginning Balance | Debt outstanding at start of period |
| New Borrowings | Any new debt issued during the period |
| Mandatory Repayments | Scheduled principal payments (amortization) |
| Optional Repayments | Additional paydowns from excess cash (cash sweep) |
| Ending Balance | Beginning + New - Mandatory - Optional |
| Average Balance | (Beginning + Ending) / 2 |
| Interest Rate | Stated rate (fixed or floating) |
| Interest Expense | Average Balance x Interest Rate |

### Types of Debt Instruments

Investment bankers model several types of debt, each with different terms:

**Revolving Credit Facility (Revolver)**
- Works like a corporate credit card — draw down and repay as needed
- Typically used to cover short-term cash needs
- Usually the first debt tranche in a model
- Interest on drawn amount plus commitment fee on undrawn portion

**Term Loan A**
- Amortizing loan with scheduled principal payments (e.g., 5-10% per year)
- Lower interest rate than Term Loan B
- Typically held by commercial banks

**Term Loan B**
- Minimal amortization (typically 1% per year)
- Bullet payment at maturity
- Higher interest rate than Term Loan A
- Typically held by institutional investors (CLOs, hedge funds)

**Senior Notes / High-Yield Bonds**
- No amortization — entire principal due at maturity
- Fixed interest rate (coupon)
- Publicly traded or privately placed

**Subordinated / Mezzanine Debt**
- Junior to all other debt in the capital structure
- Highest interest rate to compensate for higher risk
- May include PIK (payment-in-kind) interest, which accrues rather than being paid in cash

### The Circularity Problem

The debt schedule creates a **circular reference** in your model:

1. Interest expense depends on the average debt balance
2. The debt balance depends on how much debt is repaid
3. Debt repayment depends on available cash flow
4. Cash flow depends on net income
5. Net income depends on interest expense (back to step 1)

Most modelers resolve this using an iterative calculation setting in their spreadsheet software or by using the prior period's debt balance for interest calculations (a reasonable approximation).

### Cash Sweep Mechanics

A **cash sweep** is an optional debt repayment mechanism where excess cash flow is used to pay down debt beyond the mandatory amortization. The typical sweep order follows the debt waterfall:

1. Revolver paydown first (most expensive variable-rate debt)
2. Term Loan A paydown
3. Term Loan B paydown
4. Senior Notes (if callable)

Cash available for sweep = Free Cash Flow - Mandatory Amortization - Minimum Cash Balance

### Key Takeaway

The debt schedule is where modeling gets real — it introduces circularity, requires careful logic for repayment waterfalls, and directly drives interest expense and leverage ratios. Mastering the debt schedule is a prerequisite for building LBO models and restructuring analyses.`,
    },
    {
      id: "ib-modeling-model-checks",
      slug: "model-checks",
      title: "Model Checks and Best Practices",
      content: `## Model Checks and Best Practices

A financial model is only useful if it is correct. In investment banking, models drive billion-dollar decisions, so errors are not just embarrassing — they can be career-ending. Building robust checks into your model is not optional; it is a professional requirement.

### The Balance Sheet Check

The single most important check in any three-statement model is whether the balance sheet balances:

**Total Assets = Total Liabilities + Shareholders' Equity**

This check should appear on every projection period and should be prominently displayed (often with conditional formatting — green if balanced, red if not). If the balance sheet does not balance, something is wrong in your model, and you must fix it before proceeding.

### Common Model Checks

Build a dedicated "Checks" tab or section with these tests:

| Check | Formula | Expected |
|-------|---------|----------|
| Balance sheet balances | Assets - (Liab + Equity) | 0 |
| Cash never goes negative | MIN(Cash balance across periods) | > 0 |
| Revenue growth is reasonable | MAX(Year-over-year growth) | < 50% (industry dependent) |
| Margins are within range | EBITDA margin each year | Historically consistent |
| Debt covenants met | Leverage ratio, interest coverage | Within covenant limits |
| Depreciation < CapEx | Depr / CapEx ratio | < 1.0 for growing companies |
| Tax rate is reasonable | Effective tax rate | 20-30% for US companies |

### Color Coding Standards

Investment banks follow strict color-coding conventions that make models readable and auditable:

| Color | Usage |
|-------|-------|
| **Blue** | Hard-coded inputs and assumptions |
| **Black** | Formulas and calculations |
| **Green** | Links to other tabs or worksheets |
| **Red** | Error checks or warning flags |

Following these conventions is non-negotiable at most banks. When a VP or MD opens your model, they should immediately know which cells are assumptions (blue) versus calculations (black).

### Structural Best Practices

**One formula per row**: Every cell in a row should contain the same formula (adjusted for column). If you need a different formula, start a new row. This makes auditing straightforward — check one cell, and you have checked the entire row.

**No hard-coded numbers in formulas**: Every assumption should live in a clearly labeled input cell. Never bury an assumption inside a formula like \`=Revenue * 0.35\`. Instead, create a "Gross Margin %" input cell and reference it.

**Flow left to right, top to bottom**: Historical data on the left, projections on the right. Supporting schedules should flow logically from the main statements.

**Label everything**: Every row, every section, every tab should have clear labels. Someone unfamiliar with your model should be able to navigate it without explanation.

### Stress Testing

Beyond formula checks, stress-test your model's logic:

1. **Zero revenue test**: Set revenue to zero. Does the model still function? Do cash flows behave correctly?
2. **Extreme growth test**: Set growth to 50%+. Do margins stay realistic? Does working capital scale appropriately?
3. **Negative income test**: If the company loses money, does the tax calculation handle losses correctly (no negative taxes)?
4. **High leverage test**: Load the company with debt. Does the cash sweep logic work? Does the revolver draw correctly?

### Common Errors

Watch for these frequent mistakes:

- **Sign errors**: Mixing up positive and negative conventions for cash flows
- **Circular reference crashes**: Model spiraling due to unresolved circularity
- **Stale links**: References pointing to the wrong cell after inserting rows/columns
- **Unit mismatches**: Mixing millions and thousands in the same model
- **Off-by-one errors**: Referencing the wrong period (beginning vs. ending balance)

### Key Takeaway

Model integrity is not a nice-to-have — it is the baseline expectation. Build checks as you go, not after the fact. Follow color coding and structural conventions religiously. And always remember: a model that gives the wrong answer with perfect formatting is worse than useless — it is dangerous.`,
      starterCode: `# Financial Model Checker
# Build a suite of model validation checks

def check_balance_sheet(total_assets, total_liabilities, total_equity,
                        tolerance=0.01):
    """Check if balance sheet balances within tolerance.
    Returns (passes: bool, difference: float)"""
    # TODO: Check if Assets = Liabilities + Equity
    pass


def check_cash_positive(cash_balances):
    """Check that cash never goes negative.
    Returns (passes: bool, min_cash: float, problem_period: int or None)"""
    # TODO: Find if any period has negative cash
    pass


def check_growth_reasonable(revenues, max_growth=0.50):
    """Check year-over-year revenue growth is reasonable.
    Returns (passes: bool, max_growth_found: float, period: int or None)"""
    # TODO: Calculate YoY growth and flag if any exceed max
    pass


def check_margins_consistent(ebitda_margins, historical_avg,
                             max_deviation=0.10):
    """Check EBITDA margins don't deviate too far from historical.
    Returns (passes: bool, max_deviation_found: float)"""
    # TODO: Compare each margin to historical average
    pass


def run_all_checks(model_data):
    """Run all checks and return summary report."""
    # TODO: Call each check function, collect results,
    # and print a summary
    pass


# Test data
test_data = {
    "total_assets": [1000, 1100, 1250],
    "total_liabilities": [600, 650, 730],
    "total_equity": [400, 450, 520],
    "cash_balances": [50, 30, -10, 25],
    "revenues": [500, 575, 690, 800],
    "ebitda_margins": [0.25, 0.27, 0.24, 0.35],
    "historical_ebitda_margin": 0.26,
}

run_all_checks(test_data)
`,
      solutionCode: `# Financial Model Checker - Solution

def check_balance_sheet(total_assets, total_liabilities, total_equity,
                        tolerance=0.01):
    diff = total_assets - (total_liabilities + total_equity)
    return (abs(diff) <= tolerance, diff)


def check_cash_positive(cash_balances):
    min_cash = min(cash_balances)
    if min_cash < 0:
        period = cash_balances.index(min_cash)
        return (False, min_cash, period)
    return (True, min_cash, None)


def check_growth_reasonable(revenues, max_growth=0.50):
    max_found = 0
    max_period = None
    for i in range(1, len(revenues)):
        growth = (revenues[i] - revenues[i - 1]) / revenues[i - 1]
        if growth > max_found:
            max_found = growth
            max_period = i
    passes = max_found <= max_growth
    return (passes, max_found, max_period if not passes else None)


def check_margins_consistent(ebitda_margins, historical_avg,
                             max_deviation=0.10):
    max_dev = 0
    for m in ebitda_margins:
        dev = abs(m - historical_avg)
        if dev > max_dev:
            max_dev = dev
    return (max_dev <= max_deviation, max_dev)


def run_all_checks(model_data):
    print("=== Financial Model Checks ===\\n")

    # Balance sheet checks
    for i in range(len(model_data["total_assets"])):
        ok, diff = check_balance_sheet(
            model_data["total_assets"][i],
            model_data["total_liabilities"][i],
            model_data["total_equity"][i],
        )
        status = "PASS" if ok else "FAIL"
        print(f"  BS Balance (Period {i}): {status} (diff: {diff:.2f})")

    # Cash check
    ok, min_c, period = check_cash_positive(model_data["cash_balances"])
    status = "PASS" if ok else "FAIL"
    msg = f"  Cash Positive: {status} (min: {min_c:.1f})"
    if period is not None:
        msg += f" in period {period}"
    print(msg)

    # Growth check
    ok, max_g, period = check_growth_reasonable(model_data["revenues"])
    status = "PASS" if ok else "FAIL"
    print(f"  Revenue Growth: {status} (max: {max_g:.1%})")

    # Margin check
    ok, max_d = check_margins_consistent(
        model_data["ebitda_margins"],
        model_data["historical_ebitda_margin"],
    )
    status = "PASS" if ok else "FAIL"
    print(f"  Margin Consistency: {status} (max dev: {max_d:.1%})")


test_data = {
    "total_assets": [1000, 1100, 1250],
    "total_liabilities": [600, 650, 730],
    "total_equity": [400, 450, 520],
    "cash_balances": [50, 30, -10, 25],
    "revenues": [500, 575, 690, 800],
    "ebitda_margins": [0.25, 0.27, 0.24, 0.35],
    "historical_ebitda_margin": 0.26,
}

run_all_checks(test_data)
`,
    },
  ],
};
