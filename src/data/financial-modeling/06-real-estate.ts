import { Module } from "../types";

export const realEstateModule: Module = {
  id: "fm-real-estate",
  title: "Real Estate Financial Modeling",
  description: "Build real estate financial models for property cash flow analysis, development pro formas, and investment returns.",
  lessons: [
    {
      id: "fm-real-estate-property-cf",
      slug: "property-cash-flow-model",
      title: "Property Cash Flow Model",
      content: `## Property Cash Flow Model

Real estate financial modeling follows different conventions than corporate modeling, with its own terminology, metrics, and structure. The property cash flow model is the foundation — it projects a property's income and expenses to determine its net operating income, cash flow, and value.

### The Property Cash Flow Structure

Real estate cash flows follow a standardized waterfall:

| Line Item | Description |
|-----------|-------------|
| **Gross Potential Rent (GPR)** | Total rent if 100% occupied at market rates |
| **(-) Vacancy & Credit Loss** | Estimated lost rent from unoccupied units and non-payment |
| **= Effective Gross Income (EGI)** | Actual collected rent |
| **(+) Other Income** | Parking, laundry, late fees, storage, pet fees |
| **= Total Revenue** | All property income |
| **(-) Operating Expenses** | Property taxes, insurance, maintenance, management, utilities |
| **= Net Operating Income (NOI)** | The key metric — income before debt service |
| **(-) Debt Service** | Mortgage principal and interest payments |
| **= Cash Flow Before Tax** | Cash available to the equity investor |
| **(-) Income Taxes** | Federal and state taxes on real estate income |
| **= Cash Flow After Tax** | Net cash flow to the investor |

### Projecting Revenue

**Gross Potential Rent (GPR)**
Calculate for each unit type:
\`\`\`
GPR = Number of Units x Monthly Rent x 12
\`\`\`

For multi-tenant properties, calculate per-tenant:
\`\`\`
Tenant Rent = Leased Square Feet x Annual Rent per Square Foot
\`\`\`

Grow rent annually based on market conditions (typically 2-4% per year for stable markets).

**Vacancy and Credit Loss**
Expressed as a percentage of GPR:
- Stabilized residential: 3-7%
- Stabilized office: 5-15% (market dependent)
- Stabilized retail: 5-10%
- Stabilized industrial: 3-5%

**Other Income**
Ancillary revenue streams vary by property type:
- Residential: Parking ($50-200/month/space), laundry, storage, pet fees
- Office: Parking, conference room fees, tenant improvement reimbursements
- Retail: Percentage rent (rent tied to tenant sales), Common Area Maintenance (CAM) reimbursements

### Projecting Expenses

Operating expenses are categorized as:

**Fixed expenses** (do not vary with occupancy):
- Real estate taxes (largest single expense, typically 1-3% of property value annually)
- Insurance (0.2-0.5% of property value)

**Variable expenses** (vary with occupancy or usage):
- Utilities (partially or fully paid by tenants in some structures)
- Repairs and maintenance (1-3% of property value)
- Property management fees (3-8% of EGI)
- Landscaping, snow removal
- Turnover costs (painting, cleaning between tenants)

**Reserve for replacements**: An annual reserve for major capital items (roof, HVAC, elevators). Typically 2-5% of EGI or a fixed per-unit amount. This is technically a capital expense but is often included in the operating budget as a reserve.

### The Operating Expense Ratio

\`\`\`
Operating Expense Ratio = Total Operating Expenses / EGI
\`\`\`

Typical ranges by property type:

| Property Type | Expense Ratio |
|---------------|---------------|
| Apartment | 35-50% |
| Office (full-service) | 40-55% |
| Office (NNN lease) | 10-20% |
| Industrial (NNN) | 10-20% |
| Retail (NNN) | 15-25% |

NNN (Triple Net) leases shift most expenses to the tenant, resulting in lower expense ratios for the landlord.

### Multi-Year Projection

Project the cash flow for 5-10 years with annual growth assumptions:

| Item | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|------|--------|--------|--------|--------|--------|
| GPR | 1,200 | 1,236 | 1,273 | 1,311 | 1,351 |
| Vacancy (5%) | (60) | (62) | (64) | (66) | (68) |
| Other Income | 48 | 49 | 51 | 52 | 54 |
| **EGI** | **1,188** | **1,224** | **1,261** | **1,298** | **1,337** |
| OpEx (40%) | (475) | (489) | (504) | (519) | (535) |
| **NOI** | **713** | **734** | **757** | **779** | **802** |

### Key Takeaway

The property cash flow model is the backbone of all real estate analysis. NOI is the single most important number because it drives property valuation (through cap rates), debt sizing (through DSCR), and investor returns. A well-built property model projects each revenue and expense line item individually, with documented growth assumptions, producing a reliable multi-year cash flow forecast.`,
    },
    {
      id: "fm-real-estate-cap-rates",
      slug: "cap-rates-noi",
      title: "Cap Rates & NOI",
      content: `## Cap Rates & NOI

The capitalization rate (cap rate) is the most fundamental valuation metric in real estate. It represents the relationship between a property's net operating income and its market value. Understanding cap rates is essential for evaluating investment opportunities, comparing properties, and determining fair market value.

### The Cap Rate Formula

\`\`\`
Cap Rate = Net Operating Income (NOI) / Property Value
\`\`\`

Or rearranged to solve for value:
\`\`\`
Property Value = NOI / Cap Rate
\`\`\`

A property with 500,000 dollars of annual NOI and a 6% cap rate is worth:
500,000 / 0.06 = 8,333,333 dollars

### What the Cap Rate Represents

The cap rate is the **unlevered yield** on a real estate investment — the annual return you would earn if you bought the property with all cash (no mortgage). It is analogous to the earnings yield (E/P ratio) in stock investing.

A lower cap rate means a higher price relative to income (more expensive). A higher cap rate means a lower price relative to income (cheaper). This is the same inverse relationship as P/E ratios in stocks.

### Cap Rate Ranges by Property Type and Market

| Property Type | Primary Markets | Secondary Markets | Tertiary Markets |
|--------------|----------------|-------------------|-----------------|
| Class A Multifamily | 4.0-5.0% | 5.0-6.0% | 6.0-7.5% |
| Class A Office | 5.0-6.5% | 6.5-8.0% | 7.5-9.0% |
| Industrial/Logistics | 4.5-5.5% | 5.5-6.5% | 6.5-8.0% |
| Grocery-Anchored Retail | 5.5-6.5% | 6.5-7.5% | 7.5-9.0% |
| Hotels | 6.0-8.0% | 7.5-9.5% | 8.5-11.0% |
| Self-Storage | 5.0-6.0% | 6.0-7.0% | 7.0-8.5% |

### What Drives Cap Rates

**Risk**: Higher-risk properties have higher cap rates. A Class C apartment building in a declining neighborhood has a higher cap rate (higher yield) than a Class A building in a thriving city because it has more risk (vacancy, tenant quality, maintenance costs, depreciation).

**Growth**: Properties with strong expected NOI growth trade at lower cap rates. Investors accept a lower current yield because they expect the income to grow. This is identical to why growth stocks trade at higher P/E ratios.

**Interest rates**: Cap rates generally move in the same direction as interest rates. When rates rise, the spread between cap rates and borrowing costs narrows, making properties less attractive at existing prices, which pushes cap rates up (prices down).

**Supply and demand**: In markets with strong demand and limited new supply, cap rates compress. In oversupplied markets, cap rates expand.

### Going-In vs. Exit Cap Rate

**Going-in cap rate**: NOI at acquisition divided by the purchase price. This is the yield at the time you buy.

**Exit cap rate**: Projected NOI at sale divided by the assumed sale price. This is the yield the next buyer will demand.

**Convention**: Exit cap rates are typically assumed to be 25-75 basis points higher than going-in cap rates. This reflects the assumption that the property will be older and less desirable when you sell it, requiring a higher yield to attract a buyer.

If you buy at a 5.5% cap rate and sell at a 6.0% cap rate, the higher exit cap rate partially offsets NOI growth in determining your sale price:
- Entry: NOI 500K / 5.5% = 9.09M
- Exit (Year 5, 3% NOI growth): NOI 580K / 6.0% = 9.66M

### Cap Rate Compression and Expansion

**Compression** (falling cap rates): Property values rise faster than NOI. This happened broadly from 2010-2022 as interest rates fell. Investors who bought early in this period benefited from both NOI growth and cap rate compression.

**Expansion** (rising cap rates): Property values fall or rise slower than NOI. This happened in 2022-2023 when interest rates rose sharply. Even properties with growing NOI saw values stagnate or decline as cap rates expanded.

### Limitations of the Cap Rate

- It is a static measure (one year's NOI, current price) and does not capture future growth
- It ignores capital expenditure needs (two properties with the same NOI may have very different CapEx requirements)
- It does not account for financing (leverage can dramatically change returns)
- It can be manipulated by deferring maintenance or inflating short-term occupancy

For these reasons, cap rates should be used alongside other metrics (IRR, cash-on-cash return, equity multiple) for a complete investment analysis.

### Key Takeaway

The cap rate is the universal language of real estate valuation. It allows you to compare properties across types, markets, and sizes on a standardized basis. Lower cap rates imply lower risk and higher prices; higher cap rates imply higher risk and lower prices. Understanding what drives cap rates — and how they relate to interest rates, growth, and risk — is essential for making informed real estate investment decisions.`,
    },
    {
      id: "fm-real-estate-development",
      slug: "development-pro-forma",
      title: "Development Pro Forma",
      content: `## Development Pro Forma

A development pro forma models the financial feasibility of building a new property from the ground up. It answers the fundamental question: "Is this development project worth doing?" Unlike an acquisition model (which evaluates an existing property), a development model must account for construction costs, timing, financing during construction, and the risk of building something that does not yet exist.

### Structure of a Development Pro Forma

The development pro forma has three major sections:

**Section 1: Development Costs**

| Cost Category | Typical % of Total | Description |
|--------------|-------------------|-------------|
| Land acquisition | 15-30% | Purchase price of the site |
| Hard costs | 50-65% | Construction (structure, systems, finishes) |
| Soft costs | 15-25% | Architecture, engineering, permits, legal, insurance |
| Financing costs | 5-10% | Interest during construction, loan fees |
| Developer fee | 3-5% | Profit margin built into the budget |
| Contingency | 5-10% | Buffer for cost overruns |

**Detailed hard cost breakdown (example: multifamily):**
- Site work and demolition
- Foundation and structure
- Exterior envelope (facade, windows, roofing)
- Mechanical, electrical, plumbing (MEP)
- Interior finishes (flooring, cabinets, fixtures)
- Common areas and amenities (lobby, gym, pool)
- Parking (structured or surface)

**Section 2: Operating Pro Forma (Stabilized)**

Project the property's income and expenses once fully leased:
- Gross Potential Rent
- Vacancy and credit loss
- Other income
- Operating expenses
- Net Operating Income

This is the same property cash flow model discussed earlier, projected for the stabilized (fully occupied) year.

**Section 3: Returns Analysis**

Compare total development costs to stabilized value to determine if the project is financially feasible:

\`\`\`
Development Yield = Stabilized NOI / Total Development Cost
\`\`\`

If the development yield exceeds the market cap rate, the project creates value. The difference between the development yield and market cap rate represents the developer's **profit margin** (often called "development spread" or "margin on cost").

Example:
- Total development cost: 20 million
- Stabilized NOI: 1.4 million
- Development yield: 1.4M / 20M = 7.0%
- Market cap rate for comparable stabilized properties: 5.5%
- Implied stabilized value: 1.4M / 5.5% = 25.45 million
- Developer profit: 25.45M - 20M = 5.45 million (27.3% return on cost)

### The Development Timeline

Unlike acquisitions (which close in weeks), development projects take 2-4 years:

| Phase | Duration | Key Activities |
|-------|----------|---------------|
| Pre-development | 6-12 months | Land acquisition, zoning, design, permits |
| Construction | 12-24 months | Building the project |
| Lease-up | 6-18 months | Marketing and filling the building with tenants |
| Stabilization | Month 30-48 | Property reaches target occupancy |

### Construction Financing

Development projects use specialized financing:

**Construction loan**: Short-term loan (2-3 years) that funds the building process. Funds are drawn in stages as construction progresses (called "draws"). Interest is charged only on the drawn amount. Upon completion, the construction loan is repaid with a permanent loan.

**Permanent loan (takeout)**: Long-term mortgage (5-30 years) secured by the completed, stabilized property. The permanent loan repays the construction loan and provides long-term financing.

**Equity**: The developer typically contributes 20-35% of total costs as equity. Institutional investors (pension funds, insurance companies) may co-invest as equity partners.

### Key Feasibility Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Development yield | Stabilized NOI / Total cost | 100-200bp above market cap rate |
| Return on cost | NOI / Total cost | > Market cap rate |
| Profit margin | (Stabilized value - Cost) / Cost | > 15-20% |
| Construction cost per unit | Total hard cost / Units | Market-competitive |
| Rent per square foot | Annual rent / Rentable SF | At or above market |

### Key Takeaway

Development pro formas are fundamentally about the spread between what it costs to build and what the completed property is worth. If the development yield significantly exceeds the market cap rate, the project creates value and is worth pursuing. If the spread is thin, the risk of cost overruns or slower-than-expected lease-up may eliminate the profit. The discipline of rigorous cost estimation and conservative revenue projections is what separates profitable developments from money-losing ones.`,
    },
    {
      id: "fm-real-estate-dscr",
      slug: "debt-service-coverage",
      title: "Debt Service Coverage Ratio (DSCR)",
      content: `## Debt Service Coverage Ratio (DSCR)

The Debt Service Coverage Ratio is the most important metric for real estate lenders. It measures whether a property's income is sufficient to cover its debt obligations. DSCR determines how much a lender is willing to lend and whether a property can safely support its mortgage payments.

### The DSCR Formula

\`\`\`
DSCR = Net Operating Income (NOI) / Annual Debt Service
\`\`\`

Where Annual Debt Service = Total annual mortgage payments (principal + interest)

A DSCR of 1.25x means the property generates 25% more income than needed to cover its debt payments. A DSCR of 1.0x means the property barely covers its debt — no margin for error.

### What Lenders Require

| Property Type | Minimum DSCR | Typical DSCR |
|--------------|-------------|-------------|
| Multifamily (agency) | 1.20-1.25x | 1.25-1.50x |
| Multifamily (conventional) | 1.25x | 1.30-1.50x |
| Office | 1.25-1.30x | 1.35-1.60x |
| Retail | 1.25-1.35x | 1.40-1.60x |
| Industrial | 1.20-1.25x | 1.30-1.50x |
| Hotel | 1.40-1.50x | 1.50-1.80x |

Higher-risk property types require higher DSCR minimums because their income is more volatile.

### How DSCR Constrains Leverage

DSCR and Loan-to-Value (LTV) work together to determine maximum loan size:

**LTV approach**: Maximum loan = Property Value x Maximum LTV (typically 65-75%)

**DSCR approach**: Maximum loan = NOI / (Minimum DSCR x Debt Constant)

Where the Debt Constant = Annual debt service per dollar of loan (depends on interest rate and amortization period).

The lender uses **whichever approach produces the smaller loan** — the more conservative constraint binds.

**Example:**
- Property value: 10 million
- NOI: 650,000
- Maximum LTV: 70%
- Minimum DSCR: 1.25x
- Interest rate: 6.5%, 30-year amortization
- Annual debt constant: 7.58% (monthly P&I factor x 12)

LTV constraint: 10M x 70% = 7.0M maximum loan
DSCR constraint: 650,000 / (1.25 x 0.0758) = 6.87M maximum loan

The DSCR constraint is more restrictive, so the maximum loan is 6.87 million.

### DSCR Stress Testing

Lenders stress-test DSCR under adverse scenarios:

| Scenario | NOI Impact | Resulting DSCR |
|----------|-----------|---------------|
| Base case | No change | 1.35x |
| 10% rent decline | NOI drops 15% | 1.15x |
| 5% vacancy increase | NOI drops 8% | 1.24x |
| Combined stress | NOI drops 20% | 1.08x |
| Interest rate rise (+200bp) | Debt service increases | 1.15x |

If DSCR falls below 1.0x under realistic stress scenarios, the property cannot safely support the requested loan amount.

### DSCR Over Time

In a properly structured deal, DSCR should improve over time as NOI grows (from rent increases) while debt service remains fixed (for fixed-rate loans) or grows more slowly:

| Year | NOI | Debt Service | DSCR |
|------|-----|-------------|------|
| 1 | 650K | 482K | 1.35x |
| 3 | 689K | 482K | 1.43x |
| 5 | 731K | 482K | 1.52x |
| 10 | 847K | 482K | 1.76x |

This improving DSCR provides increasing safety margin over time.

### DSCR Covenants

Many commercial real estate loans include DSCR covenants:
- **Minimum DSCR**: If DSCR falls below a threshold (e.g., 1.10x), the borrower may trigger a cash sweep, lockbox, or default event
- **Cash management trigger**: At 1.15-1.20x DSCR, excess cash may be swept into a lender-controlled account
- **Default trigger**: At 1.0-1.05x DSCR, the lender may accelerate the loan

### Key Takeaway

DSCR is the gatekeeper of real estate debt. It determines how much you can borrow, whether your loan is performing, and how much cushion exists for adverse scenarios. When underwriting a real estate investment, always calculate DSCR first — it constrains your capital structure and defines the risk profile of the investment. A property with strong, growing NOI and a comfortable DSCR is a lower-risk investment than one operating at the edge of its debt capacity.`,
    },
    {
      id: "fm-real-estate-irr",
      slug: "irr-equity-multiple",
      title: "IRR & Equity Multiple",
      content: `## IRR & Equity Multiple

Real estate investment returns are measured primarily by two metrics: Internal Rate of Return (IRR) and Equity Multiple. Together, they capture both the magnitude and the timing of returns, providing a complete picture of investment performance.

### The Equity Multiple

\`\`\`
Equity Multiple = Total Cash Distributions / Total Equity Invested
\`\`\`

An equity multiple of 2.0x means the investor received 2 dollars for every 1 dollar invested (1 dollar of profit plus the return of the original investment).

Total cash distributions include:
- Annual cash flow distributions (cash flow after debt service)
- Return of initial capital
- Profit from property sale

**Example:**
- Equity invested: 3 million
- Annual cash distributions over 5 years: 200K per year = 1 million total
- Sale proceeds to equity (after debt repayment): 5 million
- Total distributions: 6 million
- Equity Multiple: 6M / 3M = **2.0x**

### IRR Calculation

IRR accounts for the **time value** of receiving cash flows. It is the discount rate that makes the NPV of all cash flows equal to zero.

Using the same example:

| Year | Cash Flow |
|------|-----------|
| 0 | -3,000,000 (investment) |
| 1 | +200,000 |
| 2 | +200,000 |
| 3 | +200,000 |
| 4 | +200,000 |
| 5 | +5,200,000 (200K distribution + 5M sale proceeds) |

IRR = approximately **15.3%**

### Target Returns by Strategy

| Strategy | Target IRR | Target Equity Multiple | Risk Level |
|----------|-----------|----------------------|-----------|
| **Core** | 6-9% | 1.3-1.6x | Low |
| **Core-Plus** | 8-12% | 1.5-1.8x | Low-moderate |
| **Value-Add** | 12-18% | 1.7-2.2x | Moderate |
| **Opportunistic** | 18-25%+ | 2.0-3.0x+ | High |
| **Development** | 20-30%+ | 2.0-3.5x+ | Highest |

**Core**: Stabilized, high-quality properties with minimal risk (Class A in top markets)
**Core-Plus**: Stabilized with minor improvement opportunities
**Value-Add**: Properties requiring renovation, repositioning, or operational improvement
**Opportunistic**: Development, distressed acquisitions, major repositioning
**Development**: Building from the ground up

### The Cash-on-Cash Return

An intermediate return metric that measures annual income yield on invested equity:

\`\`\`
Cash-on-Cash Return = Annual Cash Flow After Debt Service / Equity Invested
\`\`\`

Year 1 example: 200,000 / 3,000,000 = **6.7%**

Cash-on-cash is useful for comparing income-producing properties but does not capture appreciation or equity buildup from principal paydown.

### Components of Real Estate Return

Real estate returns come from four sources:

**1. Cash flow (income return)**: Annual distributions from NOI minus debt service. Typically 4-8% per year for stabilized properties.

**2. Appreciation**: Increase in property value over time, captured at sale. Driven by NOI growth and cap rate compression.

**3. Principal paydown (amortization)**: As the mortgage is repaid, the equity position grows. The lender's claim shrinks and the owner's equity increases.

**4. Tax benefits**: Depreciation deductions reduce taxable income below actual cash flow. This is a unique advantage of real estate investing. A property may generate 200,000 in cash flow but only 50,000 in taxable income (after depreciation), providing significant tax savings.

### Sensitivity Analysis

Present returns across key variables:

| Exit Cap Rate | 5.0% | 5.5% | 6.0% | 6.5% |
|--------------|-------|-------|-------|-------|
| **IRR** | 19.8% | 16.5% | 13.5% | 10.8% |
| **Equity Multiple** | 2.3x | 2.1x | 1.9x | 1.7x |

| NOI Growth | 2% | 3% | 4% | 5% |
|-----------|-----|-----|-----|-----|
| **IRR** | 12.1% | 14.3% | 16.5% | 18.7% |
| **Equity Multiple** | 1.8x | 2.0x | 2.1x | 2.3x |

### The Waterfall Distribution

In partnership structures, profits are typically distributed through a waterfall that rewards the sponsor (GP) for achieving return targets:

| Tier | Return Hurdle | LP Share | GP Share |
|------|-------------|----------|----------|
| Return of capital | 0% | 100% | 0% |
| Preferred return | 0-8% | 100% | 0% |
| Tier 1 | 8-12% | 80% | 20% |
| Tier 2 | 12-15% | 70% | 30% |
| Tier 3 | 15%+ | 60% | 40% |

This structure aligns incentives — the sponsor earns a larger share of profits only by exceeding return targets.

### Key Takeaway

IRR and equity multiple are the two essential return metrics in real estate investing. The equity multiple tells you how much money you made. IRR tells you how fast you made it. Together with cash-on-cash yield and sensitivity analysis, they provide the complete picture needed to evaluate real estate investments and compare opportunities across different strategies and risk profiles.`,
    },
  ],
};
