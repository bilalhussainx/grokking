import { Module } from "../types";

export const mergerModelModule: Module = {
  id: "fm-merger",
  title: "Merger Model",
  description:
    "Build a merger model to analyze accretion/dilution, synergies, and purchase price allocation.",
  lessons: [
    {
      id: "fm-merger-accretion-dilution",
      slug: "accretion-dilution",
      title: "Accretion / Dilution Analysis",
      content: `## Accretion / Dilution Analysis

Accretion/dilution analysis is the central question in any merger model: will the acquisition increase or decrease the acquirer's earnings per share (EPS)? An accretive deal increases EPS — shareholders own a bigger pie. A dilutive deal decreases EPS — the acquirer paid more for the target's earnings than they are worth on a per-share basis. This analysis drives board decisions and is scrutinized by investors and analysts.

### The Basic Concept

Before a deal, the acquirer has its own EPS:
\`\`\`
Acquirer Standalone EPS = Acquirer Net Income / Acquirer Shares
\`\`\`

After the deal, the combined company has a new EPS:
\`\`\`
Pro Forma EPS = Combined Net Income / Combined Shares
\`\`\`

| Outcome | Definition | Market Reaction |
|---------|-----------|-----------------|
| **Accretive** | Pro Forma EPS > Standalone EPS | Generally positive |
| **Dilutive** | Pro Forma EPS < Standalone EPS | Generally negative |
| **Breakeven** | Pro Forma EPS = Standalone EPS | Neutral |

### What Drives Accretion/Dilution

The accretion/dilution outcome depends on the relationship between the **cost of the acquisition** and the **earnings acquired**:

**If the target's P/E is lower than the acquirer's P/E**, the deal is more likely to be accretive. The acquirer is buying earnings cheaply relative to its own valuation.

**If the target's P/E is higher than the acquirer's P/E**, the deal is more likely to be dilutive. The acquirer is overpaying for earnings relative to its own valuation.

**Payment method matters:**
- **Cash deals**: Accretive if the target's earnings yield (E/P) exceeds the acquirer's after-tax borrowing cost
- **Stock deals**: Accretive if the target's P/E is lower than the acquirer's P/E
- **Mixed deals**: Blended analysis

### Quick Accretion/Dilution Test

Before building a full model, do a quick test:

**For a 100% stock deal:**
\`\`\`
Accretive if: Target P/E < Acquirer P/E
Dilutive if: Target P/E > Acquirer P/E
\`\`\`

**For a 100% cash deal (debt-financed):**
\`\`\`
Accretive if: Target Earnings Yield > After-Tax Cost of Debt
Example: Target E/P = 8% (12.5x P/E), Borrowing cost = 5% x (1-25%) = 3.75%
This deal is accretive because 8% > 3.75%
\`\`\`

### The Full Accretion/Dilution Calculation

**Step 1: Calculate combined net income**
\`\`\`
Acquirer Net Income
+ Target Net Income
+ After-Tax Synergies
- After-Tax Transaction Costs (one-time)
- Incremental Interest Expense (if cash/debt deal) x (1 - Tax Rate)
- Amortization of Intangibles x (1 - Tax Rate)
+ Forgone Interest on Cash Used x (1 - Tax Rate)  [subtract this]
= Pro Forma Combined Net Income
\`\`\`

**Step 2: Calculate combined shares**
\`\`\`
Acquirer Shares Outstanding
+ New Shares Issued to Target Shareholders (if stock deal)
= Pro Forma Shares Outstanding
\`\`\`

**Step 3: Calculate accretion/dilution**
\`\`\`
Pro Forma EPS = Pro Forma Net Income / Pro Forma Shares
Accretion/(Dilution) = Pro Forma EPS - Standalone Acquirer EPS
Accretion/(Dilution) % = (Pro Forma EPS / Standalone EPS) - 1
\`\`\`

### Year 1 vs. Year 2 Analysis

Many deals are dilutive in Year 1 (due to transaction costs and integration expenses) but accretive in Year 2 and beyond (as synergies are realized). Always show both:

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Standalone EPS | \$5.00 | \$5.40 | \$5.83 |
| Pro Forma EPS | \$4.85 | \$5.60 | \$6.15 |
| Accretion / (Dilution) | (\$0.15) | \$0.20 | \$0.32 |
| Accretion / (Dilution) % | (3.0%) | 3.7% | 5.5% |

The board will want to see the breakeven year — when the deal turns from dilutive to accretive.

### Key Takeaway

Accretion/dilution analysis is the lens through which public company acquirers evaluate M&A transactions. An accretive deal creates immediate shareholder value; a dilutive deal requires a compelling strategic rationale to justify the near-term EPS reduction. The analysis is straightforward mechanically but requires careful attention to synergy timing, financing costs, and purchase price allocation adjustments.`,
    },
    {
      id: "fm-merger-pro-forma",
      slug: "pro-forma-income-statement",
      title: "Pro Forma Income Statement",
      content: `## Pro Forma Income Statement

The pro forma income statement combines the acquirer's and target's financials into a single statement, as if the two companies had always been one. It is the foundation of the merger model — every other analysis (accretion/dilution, returns, valuation) depends on getting the combined financials right.

### Building the Pro Forma Income Statement

| Line Item | Acquirer | Target | Adjustments | Pro Forma |
|-----------|----------|--------|-------------|-----------|
| Revenue | 5,000 | 1,200 | — | 6,200 |
| COGS | (3,000) | (720) | +50 synergy | (3,670) |
| **Gross Profit** | **2,000** | **480** | **+50** | **2,530** |
| SG&A | (800) | (240) | +80 synergy | (960) |
| R&D | (400) | (120) | — | (520) |
| D&A | (200) | (60) | (30) intangible amort | (290) |
| **EBIT** | **600** | **60** | **+100** | **760** |
| Interest Expense | (80) | (30) | (45) new debt | (155) |
| **EBT** | **520** | **30** | **+55** | **605** |
| Taxes (25%) | (130) | (8) | (14) | (151) |
| **Net Income** | **390** | **23** | **+41** | **454** |

### Key Adjustments

**1. Revenue synergies (if included)**
Cross-selling, pricing optimization, or access to new markets. Revenue synergies are harder to achieve and less certain, so many analyses exclude them or include them only in an upside scenario.

**2. Cost synergies**
Headcount reductions, facility consolidation, procurement savings, technology rationalization. These are more reliable and typically phased in over 1-3 years:
- Year 1: 25-50% of total synergies realized
- Year 2: 75-100% realized
- Year 3: 100% realized (run-rate)

**3. Incremental interest expense**
If the deal is funded with debt:
\`\`\`
New Interest = Acquisition Debt x Interest Rate
\`\`\`
This reduces combined EBT. The target's existing debt may also be refinanced at new terms.

**4. Amortization of acquired intangibles**
Purchase price allocation (PPA) creates intangible assets (customer relationships, technology, trade names) that must be amortized over their useful lives. This is a non-cash expense that reduces GAAP earnings but does not affect cash flow.

**5. Forgone interest on cash used**
If the acquirer uses cash from its balance sheet:
\`\`\`
Lost Interest Income = Cash Used x Acquirer's Investment Yield
\`\`\`

**6. Transaction costs**
Advisory, legal, regulatory, and integration costs are typically treated as one-time expenses in Year 1. Some models exclude them from the ongoing pro forma analysis and show them separately.

### Eliminating Inter-Company Transactions

If the acquirer and target have existing business relationships (one sells products to the other), these inter-company transactions must be eliminated in the pro forma. Otherwise, revenue is double-counted.

### Multi-Year Pro Forma

Build the pro forma for 3-5 years to show:
- Synergy phase-in (from partial to full realization)
- Integration cost phase-out
- Organic growth of the combined entity
- Debt amortization reducing interest expense over time

### Key Takeaway

The pro forma income statement is the combined P&L that shows what the merged entity will look like financially. Building it requires combining standalone financials with careful adjustments for synergies, financing costs, and purchase accounting effects. The quality of the pro forma depends on realistic synergy estimates and accurate purchase price allocation — both of which require deep understanding of both businesses.`,
    },
    {
      id: "fm-merger-synergy",
      slug: "synergy-modeling",
      title: "Synergy Modeling",
      content: `## Synergy Modeling

Synergies are the additional value created by combining two companies that neither could achieve independently. They are the primary justification for paying a premium in M&A transactions — the acquirer is betting that the combined entity is worth more than the sum of its parts. Accurately modeling synergies is critical because overstating them leads to overpaying, which is the number one cause of failed acquisitions.

### Types of Synergies

**Cost Synergies (more reliable, typically 60-80% of total)**

| Category | Source | Typical Range |
|----------|--------|---------------|
| Headcount reduction | Eliminating duplicate roles (two CFOs, two HR departments) | 20-30% of overlapping headcount |
| Facility consolidation | Closing redundant offices, plants, warehouses | Rent + operating costs of closed facilities |
| Procurement savings | Combined purchasing power for raw materials, services | 2-5% of combined procurement spend |
| Technology rationalization | Consolidating IT systems, eliminating duplicate software | 10-20% of combined IT spend |
| Corporate overhead | Consolidating public company costs, board fees, audit | Eliminate target's standalone costs |

**Revenue Synergies (less reliable, typically 20-40% of total)**

| Category | Source | Typical Range |
|----------|--------|---------------|
| Cross-selling | Selling acquirer's products to target's customers and vice versa | 1-5% of combined revenue |
| Pricing optimization | Raising prices due to reduced competition or improved market position | 1-3% price increase |
| Geographic expansion | Using one company's distribution to sell the other's products | Market-specific |
| Product bundling | Offering combined products at a premium | Market-specific |

### Synergy Phase-In

Synergies are rarely realized on Day 1. Model a realistic phase-in:

| Synergy Type | Year 1 | Year 2 | Year 3 (Run-Rate) |
|-------------|--------|--------|-------------------|
| **Headcount** | 50% | 90% | 100% |
| **Facilities** | 25% | 75% | 100% |
| **Procurement** | 30% | 70% | 100% |
| **Technology** | 10% | 50% | 100% |
| **Revenue synergies** | 10% | 40% | 75% |

Revenue synergies are phased in more slowly because they require market execution (selling to new customers takes time).

### Costs to Achieve Synergies

Realizing synergies costs money. Always model the **costs to achieve** alongside the synergies themselves:

| Cost Item | Typical Amount |
|-----------|---------------|
| Severance and retention | 1-2x annual salary per eliminated position |
| Facility closure costs | Lease termination, moving expenses |
| IT integration | System migration, data conversion |
| Rebranding | If the target brand is retired |
| Consulting fees | Integration planning and execution support |

**Rule of thumb**: Costs to achieve are typically 1-2 times the annual run-rate synergies. So if annual synergies are 100 million, expect 100 to 200 million in one-time integration costs.

### Net Present Value of Synergies

The NPV of synergies determines how much the acquirer can afford to pay as a premium:

\`\`\`
Gross Synergy Value = PV of all future annual synergies (at acquirer's WACC)
- PV of Costs to Achieve
= Net Synergy Value

Maximum Justifiable Premium = Net Synergy Value
\`\`\`

If net synergies are worth 500 million in present value, the acquirer should not pay more than a 500 million premium above the target's standalone value. In practice, acquirers typically share 30-50% of synergy value with target shareholders (through the premium) and retain 50-70% for their own shareholders.

### Synergy Sensitivity

Because synergy estimates are uncertain, present a range:

| Scenario | Annual Synergies | Costs to Achieve | NPV of Synergies |
|----------|-----------------|------------------|-----------------|
| Conservative | 80M | 120M | 450M |
| Base case | 120M | 150M | 700M |
| Aggressive | 160M | 180M | 950M |

Show how accretion/dilution changes at each synergy level.

### Key Takeaway

Synergies are the economic justification for paying a premium in M&A. Cost synergies are more predictable and should be modeled with specific, bottoms-up detail. Revenue synergies should be modeled conservatively and phased in slowly. Always include costs to achieve and present synergies as a range rather than a single number. The discipline of realistic synergy modeling is what separates value-creating acquisitions from value-destroying ones.`,
    },
    {
      id: "fm-merger-ppa",
      slug: "purchase-price-allocation",
      title: "Purchase Price Allocation",
      content: `## Purchase Price Allocation

Purchase Price Allocation (PPA) is the accounting process of assigning the acquisition purchase price to the target's identifiable assets and liabilities at their fair values. The difference between the purchase price and the net fair value of identifiable assets is recorded as **goodwill**. PPA affects the acquirer's balance sheet, income statement (through amortization), and accretion/dilution analysis.

### Why PPA Matters

When an acquirer buys a target, it often pays more than the book value of the target's net assets. PPA explains where that premium goes:

\`\`\`
Purchase Price (Equity Value)
= Fair Value of Tangible Assets
+ Fair Value of Identifiable Intangible Assets
+ Goodwill
- Fair Value of Liabilities Assumed
\`\`\`

Rearranging:
\`\`\`
Goodwill = Purchase Price
         - (Fair Value of Assets - Fair Value of Liabilities)
         = Purchase Price - Fair Value of Net Identifiable Assets
\`\`\`

### Identifiable Intangible Assets

Under ASC 805 (Business Combinations), the acquirer must identify and separately value intangible assets:

| Intangible Asset | Description | Typical Useful Life | Valuation Method |
|-----------------|-------------|--------------------|-----------------|
| **Customer relationships** | Value of existing customer base | 10-20 years | Multi-period excess earnings |
| **Technology / IP** | Proprietary technology, patents | 5-10 years | Relief from royalty |
| **Trade names / brands** | Brand value | 5-20 years (or indefinite) | Relief from royalty |
| **Non-compete agreements** | Value of seller agreeing not to compete | 2-5 years | With/without method |
| **Backlog** | Existing orders not yet fulfilled | < 1 year | Cost-to-complete method |
| **Favorable contracts** | Below-market leases, supply agreements | Contract term | Differential cash flow |

### The PPA Process

**Step 1: Determine the purchase price**
Total consideration = Cash paid + Stock issued + Debt assumed + Earnouts (fair value)

**Step 2: Identify and value tangible assets**
Revalue the target's tangible assets to fair value:
- Cash and receivables: Typically at book value
- Inventory: May be "stepped up" (written up to fair value)
- PP&E: May be revalued based on appraisals
- Investments: Mark to market value

**Step 3: Identify and value intangible assets**
Engage valuation specialists to value each identifiable intangible asset separately.

**Step 4: Value assumed liabilities**
Revalue the target's liabilities to fair value:
- Debt: Mark to market (may differ from book if interest rates have changed)
- Contingent liabilities: Record at fair value if probable

**Step 5: Calculate goodwill**
\`\`\`
Goodwill = Purchase Price - Fair Value of Net Identifiable Assets
\`\`\`

### Impact on the Merger Model

**Balance sheet**: Intangible assets appear on the combined balance sheet and are amortized over their useful lives. Goodwill is not amortized but is tested annually for impairment.

**Income statement**: Amortization of acquired intangibles reduces GAAP earnings (and therefore EPS). This makes the deal appear more dilutive on a GAAP basis. Many companies report "adjusted EPS" that adds back acquisition-related amortization.

**Tax impact**: In an asset deal (or 338(h)(10) election), the step-up in asset values creates tax-deductible amortization, generating real cash tax savings. In a stock deal without an election, there is no tax benefit from the step-up — the amortization reduces book income but not taxable income.

### Simplified PPA Example

| Item | Book Value | Fair Value | Adjustment |
|------|-----------|------------|------------|
| Cash | 50 | 50 | — |
| Accounts Receivable | 80 | 78 | (2) |
| Inventory | 60 | 65 | +5 |
| PP&E | 200 | 230 | +30 |
| Customer Relationships | — | 150 | +150 |
| Technology | — | 100 | +100 |
| Trade Name | — | 50 | +50 |
| **Total Assets** | **390** | **723** | **+333** |
| Accounts Payable | (40) | (40) | — |
| Debt | (100) | (102) | (2) |
| Deferred Tax Liability | — | (75) | (75) |
| **Net Identifiable Assets** | **250** | **506** | **+256** |
| **Purchase Price** | | **800** | |
| **Goodwill** | | **294** | |

### Key Takeaway

PPA is more than an accounting exercise — it directly affects the reported profitability of the combined company and therefore the accretion/dilution analysis. Large intangible asset write-ups create higher amortization, which depresses GAAP EPS. Understanding PPA allows you to model the acquisition's accounting impact accurately and explain the difference between GAAP and adjusted profitability.`,
    },
    {
      id: "fm-merger-outputs",
      slug: "merger-model-outputs",
      title: "Merger Model Outputs",
      content: `## Merger Model Outputs

The merger model produces several key outputs that the acquirer's board, the target's board, and their respective advisors use to evaluate the transaction. A professional merger model packages these outputs clearly and concisely, enabling informed decision-making by all parties.

### Output 1: Accretion/Dilution Summary

The headline output — presented prominently on the first page:

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Acquirer Standalone EPS | \$4.50 | \$4.86 | \$5.25 |
| Pro Forma EPS (GAAP) | \$4.35 | \$5.02 | \$5.55 |
| Accretion / (Dilution) | (\$0.15) | \$0.16 | \$0.30 |
| % Accretion / (Dilution) | (3.3%) | 3.3% | 5.7% |
| Pro Forma EPS (Adjusted) | \$4.65 | \$5.32 | \$5.85 |
| Adj. Accretion / (Dilution) | \$0.15 | \$0.46 | \$0.60 |
| Adj. % | 3.3% | 9.5% | 11.4% |

Show both GAAP and adjusted (excluding acquisition-related amortization) because boards evaluate both.

### Output 2: Contribution Analysis

Shows what percentage each company contributes to the combined entity:

| Metric | Acquirer | Target | Total |
|--------|----------|--------|-------|
| Revenue | 81% | 19% | 100% |
| EBITDA | 85% | 15% | 100% |
| Net Income | 89% | 11% | 100% |
| Equity Value | 83% | 17% | 100% |

If the target contributes 15% of EBITDA but receives 17% of the combined equity (based on the premium paid), the deal is more dilutive. If it contributes 15% but receives only 12%, the deal is more accretive.

### Output 3: Credit Impact

How does the acquisition affect the combined company's credit profile?

| Metric | Acquirer Standalone | Pro Forma (at Close) | Pro Forma (Year 3) |
|--------|--------------------|--------------------|-------------------|
| Total Debt / EBITDA | 1.5x | 3.2x | 2.4x |
| Interest Coverage | 10.0x | 5.5x | 7.0x |
| Net Debt / EBITDA | 1.0x | 2.8x | 1.9x |
| Credit Rating (est.) | A | BBB+ | A- |

If the acquisition significantly increases leverage, the acquirer's credit rating may be downgraded, increasing its borrowing costs across all existing and future debt.

### Output 4: Synergy Sensitivity

Show how accretion/dilution changes at different synergy levels:

| Synergies Realized | Year 1 Accretion | Year 2 Accretion | Breakeven Premium |
|-------------------|------------------|------------------|------------------|
| 0% (no synergies) | (8.2%) | (5.1%) | 0% |
| 50% of base case | (2.5%) | 1.5% | 18% |
| 100% of base case | 3.3% | 8.2% | 32% |
| 150% of base case | 9.1% | 14.8% | 45% |

This shows the board how dependent the deal economics are on synergy realization.

### Output 5: Exchange Ratio Analysis (for Stock Deals)

If the acquirer is paying with stock, the exchange ratio determines how many acquirer shares each target shareholder receives:

\`\`\`
Exchange Ratio = Offer Price per Target Share / Acquirer Share Price
\`\`\`

Show the implied ownership split:

| Metric | Acquirer Shareholders | Target Shareholders |
|--------|---------------------|-------------------|
| Pro Forma Ownership | 78% | 22% |
| Revenue Contribution | 81% | 19% |
| EBITDA Contribution | 85% | 15% |
| Net Income Contribution | 89% | 11% |

If target shareholders receive 22% ownership but contribute only 15% of EBITDA, acquirer shareholders are giving up more than they are getting.

### Output 6: Premium Analysis

Context for the price being offered:

| Benchmark | Target Price | Premium |
|-----------|-------------|---------|
| Current share price | \$45.00 | 33% |
| 30-day VWAP | \$43.50 | 38% |
| 52-week high | \$50.00 | 20% |
| Analyst consensus PT | \$48.00 | 25% |
| Comparable deal average | N/A | 30% average |

### Presenting to the Board

Board presentations typically include:

1. **Executive summary**: 1 page with deal terms, strategic rationale, and headline accretion/dilution
2. **Transaction overview**: Terms, consideration structure, timeline
3. **Strategic rationale**: Why this target, why now
4. **Valuation analysis**: Football field for the target
5. **Pro forma financial impact**: Accretion/dilution, credit impact, contribution analysis
6. **Synergy analysis**: Detailed synergy build with phase-in and costs to achieve
7. **Risk factors**: Integration risk, market risk, regulatory risk
8. **Fairness opinion** (if applicable): Independent opinion that the price is fair

### Key Takeaway

The merger model outputs transform complex financial analysis into decision-relevant information. The accretion/dilution analysis answers "Is this good for our shareholders?" The contribution analysis answers "Are we paying a fair share?" The credit analysis answers "Can we afford this?" And the synergy sensitivity answers "How dependent is the deal on execution?" Together, these outputs give the board the information they need to make one of the most consequential decisions in corporate finance.`,
    },
  ],
};
