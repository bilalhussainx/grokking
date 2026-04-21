import { Module } from "../types";

export const lboModule: Module = {
  id: "ib-lbo",
  title: "Leveraged Buyout (LBO) Analysis",
  description: "Understand LBO mechanics — how private equity firms use debt to acquire companies and generate returns.",
  lessons: [
    {
      id: "ib-lbo-what-is-lbo",
      slug: "what-is-an-lbo",
      title: "What is an LBO?",
      content: `## What is an LBO?

A leveraged buyout (LBO) is the acquisition of a company using a significant amount of borrowed money (debt) to fund the purchase price. The acquired company's assets and cash flows serve as collateral and repayment source for the debt. LBOs are the primary transaction type for private equity firms.

### The Basic Concept

Imagine buying a house for 500,000 dollars. You put down 100,000 dollars (20%) and take a mortgage for 400,000 dollars (80%). Over time, you use rental income to pay down the mortgage. After five years, you sell the house for 700,000 dollars. Your profit is not just the 200,000 dollar appreciation — it is amplified because you only invested 100,000 dollars of your own money.

An LBO works the same way, but at a corporate scale:

| House Analogy | LBO Equivalent |
|--------------|----------------|
| Your down payment | Equity from the PE fund |
| Mortgage | Leveraged loans and bonds |
| Rental income | Company's free cash flow |
| Selling the house | Exiting the investment (sale, IPO) |

### Why Leverage Amplifies Returns

The magic of an LBO is the amplification effect of debt. Consider two scenarios for buying a $1 billion company:

**All-Equity Purchase:**
- Invest: $1B equity
- Sell for $1.5B after 5 years
- Profit: $500M
- Return: 50% total, approximately 8.4% IRR

**LBO (60% debt, 40% equity):**
- Invest: $400M equity, $600M debt
- Company pays down $200M of debt over 5 years
- Sell for $1.5B, repay remaining $400M debt
- Equity proceeds: $1.1B
- Profit: $700M on $400M invested
- Return: 175% total, approximately 22.4% IRR

The leverage amplified the return from 8.4% to 22.4% — without any difference in the company's operating performance.

### The Three Value Creation Levers

PE firms create value in an LBO through three mechanisms:

**1. Debt Paydown (De-leveraging)**
As the company generates free cash flow, it repays debt. Each dollar of debt repaid transfers value from lenders to equity holders. This is the most predictable source of returns.

**2. EBITDA Growth**
If the PE firm can grow the company's EBITDA through revenue growth, margin expansion, or operational improvements, the enterprise value at exit will be higher. Common strategies include:
- Cost cutting and operational efficiency
- Add-on acquisitions (buy-and-build strategy)
- Revenue initiatives and market expansion
- Management team upgrades

**3. Multiple Expansion**
If the exit EV/EBITDA multiple is higher than the entry multiple, additional value is created. This can happen because the company is now larger, faster-growing, more diversified, or simply because market conditions have improved.

### Ideal LBO Candidates

Not every company is suitable for an LBO. The best candidates have:

- **Stable, predictable cash flows** — needed to service debt payments
- **Low capital expenditure requirements** — more cash available for debt repayment
- **Strong market position** — provides pricing power and revenue stability
- **Tangible assets** — can be used as collateral for borrowings
- **Operational improvement opportunities** — margin expansion potential
- **Clear exit path** — identifiable buyers or IPO potential

### The Risks

Leverage amplifies returns in both directions. If the company underperforms:
- Debt payments still must be made regardless of cash flow
- The company may violate debt covenants, triggering default
- In severe cases, the equity investment can be wiped out entirely

The 2008 financial crisis demonstrated this risk dramatically, as many pre-crisis LBOs (particularly in retail and media) ended in bankruptcy.

### Key Takeaway

An LBO is fundamentally about using Other People's Money to amplify equity returns. The PE firm contributes 30-50% equity, borrows the rest, uses the target's cash flows to repay debt, and exits at a higher value. Understanding this basic mechanic is the starting point for building LBO models and evaluating private equity opportunities.`,
    },
    {
      id: "ib-lbo-model-structure",
      slug: "lbo-model-structure",
      title: "LBO Model Structure",
      content: `## LBO Model Structure

An LBO model is a financial model that simulates a leveraged buyout from entry to exit. It is more complex than a standard three-statement model because it layers debt financing mechanics, ownership economics, and return calculations on top of operating projections. Understanding the model architecture before building is essential.

### The Model Architecture

A complete LBO model has these major sections (often as separate tabs):

| Tab/Section | Purpose |
|------------|---------|
| **Transaction Summary** | Purchase price, Sources & Uses, ownership structure |
| **Operating Model** | Revenue, EBITDA, and cash flow projections (5-7 years) |
| **Debt Schedule** | Each tranche of debt: balances, interest, repayment |
| **Cash Flow Waterfall** | How cash flows from operations to debt repayment |
| **Returns Analysis** | IRR, MOIC, and attribution at various exit scenarios |
| **Sensitivity Tables** | Key output sensitivities (entry price, growth, exit multiple) |

### The Flow of the Model

The model flows in a specific sequence:

1. **Set the entry price** — typically expressed as an EV/EBITDA multiple (e.g., 10x LTM EBITDA)
2. **Determine the capital structure** — how much debt vs. equity funds the purchase
3. **Project operating performance** — revenue growth, margins, CapEx, working capital
4. **Build the debt schedule** — mandatory amortization, optional prepayments, interest expense
5. **Calculate free cash flow to equity** — what is left after debt service
6. **Model the exit** — apply an exit multiple to terminal year EBITDA
7. **Calculate returns** — IRR and MOIC based on equity invested and equity received at exit

### Key Assumptions

Every LBO model requires these core assumptions:

**Entry Assumptions:**
- Purchase price (usually EV/EBITDA multiple)
- Transaction fees (advisory, financing, legal — typically 2-4% of EV)
- Minimum cash balance on the balance sheet

**Financing Assumptions:**
- Debt-to-EBITDA leverage (typically 4-6x total debt/EBITDA)
- Interest rates for each debt tranche
- Amortization schedules
- Cash sweep percentage (what portion of excess cash goes to debt repayment)

**Operating Assumptions:**
- Revenue growth rate (year-by-year)
- EBITDA margin (stable, expanding, or declining)
- Capital expenditure as a percentage of revenue
- Working capital changes
- Management equity incentive pool (typically 5-15% of equity)

**Exit Assumptions:**
- Hold period (typically 3-7 years, with 5 as base case)
- Exit EV/EBITDA multiple (often assumed equal to entry multiple as base case)

### The Circular Reference in LBO Models

Like the three-statement model, LBO models contain circularity:

Cash flow depends on interest expense, which depends on debt balances, which depend on debt repayment, which depends on cash flow.

The standard approach is to enable iterative calculations or use the prior period's debt balance for interest calculation.

### Building Order

1. Sources & Uses table (determines the capital structure)
2. Operating model (revenue through EBITDA)
3. Free cash flow before debt service
4. Debt schedule (mandatory amortization)
5. Cash sweep logic (optional prepayments)
6. Interest expense (feeds back to operating model)
7. Exit analysis and returns calculation

### Quick Check: Does the Math Work?

Before building a full model, experienced bankers do a "back of the envelope" LBO check:

- Entry at 10x EBITDA of $100M = $1B purchase price
- 6x debt ($600M), 4x equity ($400M)
- Assume EBITDA grows to $130M over 5 years
- Assume $150M of debt repaid from cash flow
- Exit at 10x: $1.3B EV - $450M remaining debt = $850M equity
- MOIC: $850M / $400M = 2.1x
- IRR: approximately 16%

This quick math tells you whether a full model is worth building.

### Key Takeaway

An LBO model is a purpose-built machine for answering one question: "What returns can a private equity firm generate by buying this company with leverage?" The model structure reflects this purpose — it starts with the purchase, layers on debt, projects operations, and calculates returns at exit. Mastering this structure is essential for anyone in PE, leveraged finance, or M&A advisory.`,
    },
    {
      id: "ib-lbo-sources-uses",
      slug: "sources-and-uses",
      title: "Sources & Uses",
      content: `## Sources & Uses

The Sources & Uses table is the starting point of every LBO model. It answers two fundamental questions: "How much money is needed to complete the transaction?" (Uses) and "Where does that money come from?" (Sources). The total sources must always equal total uses — if they do not, the deal cannot close.

### The Uses Side

Uses represent everything the buyer needs to pay for:

| Use | Description | Typical Amount |
|-----|-------------|---------------|
| **Enterprise Value** | Purchase price for the company | Based on entry multiple |
| **Refinancing of Existing Debt** | Pay off the target's current debt | Per the target's balance sheet |
| **Transaction Fees** | Advisory, legal, accounting | 1-3% of EV |
| **Financing Fees** | Debt arrangement and commitment fees | 2-4% of total debt |
| **Cash to Balance Sheet** | Minimum cash for operations post-close | Company specific |

**Example:**
- Enterprise Value (10x $100M EBITDA): $1,000M
- Refinance existing debt: $200M
- Transaction fees: $25M
- Financing fees: $15M
- Cash to balance sheet: $10M
- **Total Uses: $1,250M**

### The Sources Side

Sources represent the capital used to fund the acquisition:

| Source | Description | Typical Range |
|--------|-------------|---------------|
| **Revolving Credit Facility** | Usually undrawn at close | 1-2x EBITDA capacity |
| **Term Loan A** | Senior secured, amortizing | 1-2x EBITDA |
| **Term Loan B** | Senior secured, minimal amortization | 2-3x EBITDA |
| **Senior Notes** | Unsecured bonds | 1-2x EBITDA |
| **Subordinated Notes** | Junior bonds, higher rate | 0.5-1x EBITDA |
| **Mezzanine Debt** | Hybrid debt/equity | 0-1x EBITDA |
| **Sponsor Equity** | PE firm's cash contribution | 30-50% of total |
| **Management Rollover** | Existing management reinvests | 5-15% of equity |

**Example (continuing from above):**
- Revolver: $0 (undrawn)
- Term Loan B: $300M (3.0x EBITDA)
- Senior Notes: $250M (2.5x EBITDA)
- Subordinated Notes: $100M (1.0x EBITDA)
- Sponsor equity: $540M
- Management rollover: $60M
- **Total Sources: $1,250M**

### Key Metrics from Sources & Uses

Once the table is complete, calculate these critical metrics:

**Total Leverage** = Total Debt / EBITDA
In our example: ($300M + $250M + $100M) / $100M = **6.5x**

**Senior Leverage** = Senior Debt / EBITDA
($300M + $250M) / $100M = **5.5x**

**Equity Contribution** = Total Equity / Total Sources
($540M + $60M) / $1,250M = **48%**

**Loan-to-Value (LTV)** = Total Debt / Enterprise Value
$650M / $1,000M = **65%**

### Sizing the Debt

Debt capacity is constrained by several factors:

1. **Leverage covenants**: Lenders typically cap total leverage at 5-7x EBITDA
2. **Interest coverage**: EBITDA / Interest Expense should exceed 2.0x
3. **Fixed charge coverage**: (EBITDA - CapEx) / (Interest + Mandatory Amortization) should exceed 1.0x
4. **Market conditions**: Credit markets fluctuate — more debt is available in "hot" markets

The PE firm's equity check is the **residual** — whatever the debt markets will not fund, the sponsor must cover with equity.

### Sources = Uses: The Balancing Act

If total sources exceed total uses, reduce the equity contribution or reduce debt (preferable if leverage is already high). If total uses exceed total sources, either raise more debt (if the market will bear it), increase the equity contribution, or renegotiate the purchase price.

In practice, the purchase price and capital structure are negotiated simultaneously. The PE firm models various debt levels to find the structure that maximizes returns while maintaining comfortable coverage ratios.

### Key Takeaway

The Sources & Uses table is the financial blueprint of an LBO. It defines the capital structure that will determine the company's risk profile and the sponsor's potential returns for the next 3-7 years. Every number in the rest of the LBO model flows from this starting point, so getting it right is non-negotiable.`,
    },
    {
      id: "ib-lbo-debt-tranches",
      slug: "debt-tranches",
      title: "Debt Tranches and the Capital Structure",
      content: `## Debt Tranches and the Capital Structure

In an LBO, the debt is not a single loan — it is structured in multiple **tranches** (layers), each with different terms, interest rates, and priority in repayment. Understanding the capital structure waterfall is essential for modeling debt service and assessing risk.

### The Capital Structure Waterfall

Debt tranches are arranged in a priority hierarchy called the **capital structure waterfall**. In the event of default or bankruptcy, senior debt gets paid first, and equity gets paid last:

\`\`\`
Highest Priority (Lowest Risk, Lowest Return)
┌──────────────────────────────────┐
│   Revolving Credit Facility      │  Senior Secured
├──────────────────────────────────┤
│   Term Loan A                    │  Senior Secured
├──────────────────────────────────┤
│   Term Loan B                    │  Senior Secured
├──────────────────────────────────┤
│   Senior Unsecured Notes         │  Senior Unsecured
├──────────────────────────────────┤
│   Subordinated Notes             │  Junior
├──────────────────────────────────┤
│   Mezzanine / PIK Notes         │  Junior / Hybrid
├──────────────────────────────────┤
│   Preferred Equity               │  Quasi-Equity
├──────────────────────────────────┤
│   Common Equity (Sponsor + Mgmt) │  Residual
└──────────────────────────────────┘
Lowest Priority (Highest Risk, Highest Return)
\`\`\`

### Detailed Tranche Characteristics

**Revolving Credit Facility (Revolver)**

| Feature | Detail |
|---------|--------|
| Size | 1-2x EBITDA |
| Rate | SOFR + 200-350 bps |
| Maturity | 5-6 years |
| Amortization | None (draw/repay as needed) |
| Security | First lien on all assets |
| Use | Working capital, short-term liquidity |

The revolver is typically undrawn at closing. It serves as a safety net — if the company needs cash for seasonal working capital or unexpected expenses, it can draw on the revolver and repay later.

**Term Loan B (TLB)**

| Feature | Detail |
|---------|--------|
| Size | 2-4x EBITDA |
| Rate | SOFR + 300-500 bps |
| Maturity | 6-7 years |
| Amortization | 1% per year (minimal) |
| Security | First lien on all assets |
| Prepayment | Usually at par after 6-12 months |

TLBs are the workhorse of LBO financing. They are large, have minimal amortization (99% due at maturity), and are broadly syndicated to institutional investors (CLOs, loan funds).

**Senior Notes (High-Yield Bonds)**

| Feature | Detail |
|---------|--------|
| Size | 1-3x EBITDA |
| Rate | 6-10% fixed coupon |
| Maturity | 7-10 years |
| Amortization | None (bullet maturity) |
| Security | Unsecured |
| Prepayment | Non-call for 3-5 years, then declining premium |

High-yield bonds provide additional leverage beyond what senior secured lenders will offer. They carry higher rates because they are unsecured — in a bankruptcy, senior secured lenders get paid first.

**Mezzanine / PIK Notes**

| Feature | Detail |
|---------|--------|
| Size | 0.5-1.5x EBITDA |
| Rate | 10-15% (often PIK) |
| Maturity | 8-10 years |
| Amortization | None |
| Security | Unsecured, subordinated |

PIK (Payment-In-Kind) interest accrues and is added to the principal balance rather than being paid in cash. This preserves cash flow for senior debt repayment. PIK rates are higher because the lender faces both credit risk and the time value of not receiving current cash payments.

### Pricing Debt: Spreads Over Benchmarks

Floating-rate debt (revolvers and term loans) is priced as a spread over a benchmark rate:

**Rate = SOFR + Credit Spread**

SOFR (Secured Overnight Financing Rate) replaced LIBOR as the standard benchmark. The credit spread (measured in basis points, where 100 bps = 1%) reflects the riskiness of the borrower.

Many loan agreements include a **SOFR floor** — a minimum benchmark rate (e.g., 0.75%). If SOFR drops below the floor, the borrower pays the floor rate plus the spread.

### Covenants

Debt agreements include **covenants** — contractual restrictions that protect lenders:

**Maintenance covenants** (tested quarterly):
- Maximum leverage ratio (Total Debt / EBITDA)
- Minimum interest coverage ratio (EBITDA / Interest Expense)
- Minimum fixed charge coverage

**Incurrence covenants** (tested only when the company takes a specific action):
- Restrictions on additional debt
- Restrictions on dividends to equity holders
- Limitations on asset sales

Term Loan B and high-yield bonds typically have **covenant-lite** structures with incurrence covenants only. The revolver usually has maintenance covenants.

### Key Takeaway

The capital structure is a deliberate layering of risk and return. Senior secured debt is cheap but limited in amount. Each successive layer adds leverage but at a higher cost. The PE sponsor's job is to find the optimal structure — enough debt to amplify returns, but not so much that the company cannot service it. Understanding each tranche's mechanics is essential for building accurate LBO models and evaluating credit risk.`,
    },
    {
      id: "ib-lbo-returns",
      slug: "irr-and-moic",
      title: "Returns: IRR & MOIC",
      content: `## Returns: IRR & MOIC

Private equity returns are measured by two primary metrics: Internal Rate of Return (IRR) and Multiple of Invested Capital (MOIC). Understanding both — including their strengths, limitations, and how they interact — is essential for evaluating LBO investments and structuring deals.

### MOIC (Multiple of Invested Capital)

MOIC is the simplest return metric:

\`\`\`
MOIC = Total Cash Received / Total Cash Invested
\`\`\`

A 2.5x MOIC means the investor received 2.5 dollars for every 1 dollar invested. The profit multiple is MOIC minus 1 (so 1.5x profit on the original investment).

**Strengths:**
- Simple to understand and communicate
- Not sensitive to timing assumptions
- Easy to calculate

**Limitations:**
- Does not account for the time value of money
- A 2.0x return in 2 years is very different from 2.0x in 7 years
- Does not capture interim cash flows (dividends, recapitalizations)

### IRR (Internal Rate of Return)

IRR is the discount rate that makes the net present value (NPV) of all cash flows equal to zero. It accounts for both the magnitude and timing of cash flows.

\`\`\`
0 = -Investment + CF1/(1+IRR)^1 + CF2/(1+IRR)^2 + ... + CFn/(1+IRR)^n
\`\`\`

IRR is the annualized return rate that, when applied to discount all future cash flows, exactly offsets the initial investment.

**Strengths:**
- Accounts for time value of money
- Allows comparison across investments with different time horizons
- Industry standard for PE performance measurement

**Limitations:**
- Can be gamed by shortening hold periods (a 2.0x in 1 year is a 100% IRR)
- Assumes cash flows are reinvested at the IRR rate (which may be unrealistic)
- Can produce multiple solutions for non-conventional cash flow patterns

### The Relationship Between IRR and MOIC

IRR and MOIC are mathematically related through time:

| MOIC | 3-Year IRR | 5-Year IRR | 7-Year IRR |
|------|-----------|-----------|-----------|
| 1.5x | 14.5% | 8.4% | 6.0% |
| 2.0x | 26.0% | 14.9% | 10.4% |
| 2.5x | 35.7% | 20.1% | 14.0% |
| 3.0x | 44.2% | 24.6% | 17.0% |
| 3.5x | 51.8% | 28.5% | 19.6% |

Notice that the same MOIC produces dramatically different IRRs depending on the hold period. This is why PE firms care about both metrics.

### Target Returns

| Fund Type | Target IRR | Target MOIC |
|-----------|-----------|------------|
| Large-cap buyout | 15-20% | 2.0-2.5x |
| Mid-market buyout | 20-25% | 2.5-3.0x |
| Growth equity | 25-35% | 3.0-4.0x |
| Distressed / turnaround | 25-30%+ | 2.0-3.0x |

### Calculating Exit Equity Value

The exit equity value in an LBO is:

\`\`\`
Exit Enterprise Value = Exit Year EBITDA x Exit Multiple
- Net Debt at Exit (remaining debt - cash)
- Transaction costs at exit
= Exit Equity Value
\`\`\`

MOIC = Exit Equity Value / Initial Equity Invested
IRR = The rate that solves: Initial Equity x (1 + IRR)^n = Exit Equity

### Return Attribution

Sophisticated LBO analyses break down the total return into its three sources:

1. **Leverage effect** — Return from debt paydown
2. **Operational improvement** — Return from EBITDA growth
3. **Multiple expansion** — Return from buying at a lower multiple and selling at a higher one

Example attribution for a 2.5x MOIC:
- 0.5x from debt paydown (20% of value creation)
- 0.7x from EBITDA growth (28% of value creation)
- 0.3x from multiple expansion (12% of value creation)
- 1.0x = return of initial capital (40%)

### Dividend Recapitalization

PE firms sometimes take a **dividend recap** — the portfolio company takes on additional debt and uses the proceeds to pay a dividend to the PE sponsor. This:
- Returns cash to the sponsor before exit, reducing equity at risk
- Boosts IRR dramatically (money comes back sooner)
- May not significantly change MOIC
- Increases the company's leverage and risk

### Key Takeaway

MOIC tells you how much money you made. IRR tells you how fast you made it. Together, they provide a complete picture of LBO performance. The best investments deliver high multiples in short time periods, but in practice there is often a trade-off — holding longer may increase MOIC while decreasing IRR. Understanding this dynamic is central to private equity investment decision-making.`,
      starterCode: `# LBO Returns Calculator
# Calculate IRR and MOIC for leveraged buyout scenarios

def calculate_moic(equity_invested, equity_at_exit):
    """Calculate Multiple of Invested Capital."""
    # TODO: MOIC = equity_at_exit / equity_invested
    pass


def calculate_irr(equity_invested, equity_at_exit, hold_years,
                  interim_cashflows=None):
    """Calculate IRR using iterative approximation.
    interim_cashflows: list of (year, amount) tuples for dividends/recaps
    """
    # TODO: Use bisection method to find the rate where NPV = 0
    # NPV = -equity_invested + sum(cf/(1+r)^t) + equity_at_exit/(1+r)^n
    pass


def lbo_returns(entry_ebitda, entry_multiple, exit_multiple,
                ebitda_growth_rate, hold_years, leverage_multiple,
                equity_pct, debt_paydown_pct):
    """
    Full LBO returns calculation.

    Args:
        entry_ebitda: EBITDA at acquisition
        entry_multiple: EV/EBITDA entry multiple
        exit_multiple: EV/EBITDA exit multiple
        ebitda_growth_rate: annual EBITDA growth
        hold_years: investment holding period
        leverage_multiple: total debt / EBITDA at entry
        equity_pct: equity as % of total sources
        debt_paydown_pct: % of initial debt repaid by exit
    """
    # TODO: Calculate entry EV, equity invested, exit EV,
    # remaining debt, exit equity, then MOIC and IRR
    pass


# Test scenarios
print("=== Base Case ===")
result = lbo_returns(
    entry_ebitda=100, entry_multiple=10.0,
    exit_multiple=10.0, ebitda_growth_rate=0.05,
    hold_years=5, leverage_multiple=6.0,
    equity_pct=0.40, debt_paydown_pct=0.40
)
if result:
    print(f"  MOIC: {result['moic']:.2f}x")
    print(f"  IRR: {result['irr']:.1%}")
`,
      solutionCode: `# LBO Returns Calculator - Solution

def calculate_moic(equity_invested, equity_at_exit):
    if equity_invested <= 0:
        return None
    return equity_at_exit / equity_invested


def calculate_irr(equity_invested, equity_at_exit, hold_years,
                  interim_cashflows=None):
    if interim_cashflows is None:
        interim_cashflows = []

    def npv(rate):
        val = -equity_invested
        for year, cf in interim_cashflows:
            val += cf / (1 + rate) ** year
        val += equity_at_exit / (1 + rate) ** hold_years
        return val

    low, high = -0.5, 5.0
    for _ in range(200):
        mid = (low + high) / 2
        if npv(mid) > 0:
            low = mid
        else:
            high = mid
    return (low + high) / 2


def lbo_returns(entry_ebitda, entry_multiple, exit_multiple,
                ebitda_growth_rate, hold_years, leverage_multiple,
                equity_pct, debt_paydown_pct):
    # Entry
    entry_ev = entry_ebitda * entry_multiple
    equity_invested = entry_ev * equity_pct
    initial_debt = entry_ev * (1 - equity_pct)

    # Exit
    exit_ebitda = entry_ebitda * (1 + ebitda_growth_rate) ** hold_years
    exit_ev = exit_ebitda * exit_multiple
    remaining_debt = initial_debt * (1 - debt_paydown_pct)
    exit_equity = exit_ev - remaining_debt

    # Returns
    moic = calculate_moic(equity_invested, exit_equity)
    irr = calculate_irr(equity_invested, exit_equity, hold_years)

    return {
        "entry_ev": entry_ev,
        "equity_invested": equity_invested,
        "initial_debt": initial_debt,
        "exit_ebitda": exit_ebitda,
        "exit_ev": exit_ev,
        "remaining_debt": remaining_debt,
        "exit_equity": exit_equity,
        "moic": moic,
        "irr": irr,
    }


# Test scenarios
print("=== Base Case ===")
result = lbo_returns(
    entry_ebitda=100, entry_multiple=10.0,
    exit_multiple=10.0, ebitda_growth_rate=0.05,
    hold_years=5, leverage_multiple=6.0,
    equity_pct=0.40, debt_paydown_pct=0.40
)
print(f"  MOIC: {result['moic']:.2f}x")
print(f"  IRR: {result['irr']:.1%}")

print("\\n=== Bull Case (Multiple Expansion) ===")
result2 = lbo_returns(
    entry_ebitda=100, entry_multiple=10.0,
    exit_multiple=12.0, ebitda_growth_rate=0.08,
    hold_years=5, leverage_multiple=6.0,
    equity_pct=0.40, debt_paydown_pct=0.50
)
print(f"  MOIC: {result2['moic']:.2f}x")
print(f"  IRR: {result2['irr']:.1%}")

print("\\n=== Bear Case ===")
result3 = lbo_returns(
    entry_ebitda=100, entry_multiple=10.0,
    exit_multiple=8.0, ebitda_growth_rate=0.02,
    hold_years=5, leverage_multiple=6.0,
    equity_pct=0.40, debt_paydown_pct=0.25
)
print(f"  MOIC: {result3['moic']:.2f}x")
print(f"  IRR: {result3['irr']:.1%}")
`,
    },
  ],
};
