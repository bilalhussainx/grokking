import { Module } from "../types";

export const compsModule: Module = {
  id: "ib-comps",
  title: "Comparable Companies & Precedent Transactions",
  description:
    "Learn market-based valuation through trading comparables and precedent transaction analysis.",
  lessons: [
    {
      id: "ib-comps-selecting",
      slug: "selecting-comps",
      title: "Selecting Comparable Companies",
      content: `## Selecting Comparable Companies

Comparable company analysis ("comps" or "trading comps") values a company by comparing it to similar publicly traded companies. The premise is simple: similar companies should trade at similar valuation multiples. The challenge lies in defining "similar."

### Why Comps Matter

Comps provide a **market-based anchor** for valuation. While a DCF estimates intrinsic value based on projected cash flows, comps tell you what the market is actually paying for similar businesses right now. When the two approaches diverge significantly, it forces a productive conversation about whether the market is right or the DCF assumptions need adjustment.

### The Selection Criteria

Selecting the right peer group is the most critical step. Use these filters in order of importance:

**1. Industry and Business Model**
The company should operate in the same industry and have a similar business model. A SaaS company should be compared to other SaaS companies, not to hardware manufacturers, even if both are in "technology." Specifically consider:
- Revenue model (subscription vs. transaction vs. licensing)
- Customer type (enterprise vs. consumer vs. SMB)
- End market (healthcare IT vs. fintech vs. cybersecurity)

**2. Size**
Companies of similar size tend to have similar growth profiles, market access, and risk characteristics. Size metrics include:
- Revenue (most common)
- Enterprise value
- Market capitalization
- EBITDA

A general rule: the comparables should be within 0.5x to 2.0x the size of the target company. A \$500M revenue company should not be compared to a \$50B revenue company.

**3. Growth Rate**
High-growth companies trade at higher multiples than slow-growth companies, even within the same industry. Group companies by growth rate — a 30% revenue growth company should be compared to other 30% growers, not 5% growers.

**4. Profitability and Margins**
Companies with higher margins typically command higher multiples. An enterprise software company with 80% gross margins and 30% EBITDA margins should not be directly compared to a services company with 40% gross margins and 10% EBITDA margins without adjusting for the difference.

**5. Geography**
Companies in different geographies face different regulatory environments, tax rates, and market dynamics. US companies are typically compared to other US companies, though global peers are sometimes included.

### Building the Comp Set

A typical comp set includes **8-15 companies**. Here is the process:

1. Start with industry classification (GICS codes, SIC codes, or analyst coverage universe)
2. Screen for size, growth, and profitability
3. Read each company's business description to verify relevance
4. Remove outliers (companies in the middle of a turnaround, recently IPO'd with unusual metrics, etc.)
5. Group into "primary comps" (most similar) and "secondary comps" (somewhat similar)

### Sources for Finding Comps

| Source | Description |
|--------|-------------|
| Capital IQ / FactSet | Database screening by industry, size, and financials |
| Equity research reports | Analysts identify peers in their coverage |
| Company filings | "Competition" section of 10-K filings |
| Prior deal precedents | Which companies were compared in recent transactions |
| Industry conferences | Companies presenting at the same conference are often peers |

### The "No Perfect Comp" Reality

No two companies are identical. Every comp set involves trade-offs. The key is to be transparent about the limitations:
- "Company X is a close comp on business model but is 3x larger"
- "Company Y matches on size and growth but has a different customer base"

Document these nuances so that readers understand the judgment calls behind your analysis.

### Key Takeaway

Selecting comps is an exercise in informed judgment, not mechanical screening. The best analysts understand their target company deeply enough to identify peers that share the most relevant characteristics — and to explain why certain companies were included or excluded. A sloppy comp set undermines the entire analysis.`,
    },
    {
      id: "ib-comps-key-multiples",
      slug: "key-multiples",
      title: "Key Multiples: EV/EBITDA, P/E, and More",
      content: `## Key Multiples: EV/EBITDA, P/E, and More

Valuation multiples are ratios that relate a company's value to a financial metric. They compress complex financial information into a single, comparable number. Understanding which multiples to use — and when — is essential for any investment banking analyst.

### Enterprise Value vs. Equity Value Multiples

The first distinction is whether a multiple measures **enterprise value** (value to all capital providers) or **equity value** (value to shareholders only):

| Enterprise Value Multiples | Equity Value Multiples |
|---------------------------|----------------------|
| EV / Revenue | P / E (Price to Earnings) |
| EV / EBITDA | P / B (Price to Book) |
| EV / EBIT | PEG Ratio |
| EV / Unlevered FCF | Dividend Yield |

**Critical rule**: The numerator and denominator must be consistent. Enterprise value multiples use pre-interest metrics (revenue, EBITDA, EBIT). Equity value multiples use post-interest metrics (net income, book equity). Mixing them (e.g., EV / Net Income) produces meaningless results.

### EV / EBITDA — The Workhorse Multiple

EV/EBITDA is the most widely used multiple in investment banking for several reasons:

- **Capital structure neutral**: Because EBITDA is pre-interest, it allows comparison of companies with different leverage levels
- **Depreciation neutral**: By adding back D&A, it removes differences in asset age and depreciation policy
- **Proxy for cash flow**: EBITDA approximates operating cash flow (before working capital changes and CapEx)

Typical ranges by industry:

| Industry | EV/EBITDA Range |
|----------|----------------|
| Software/SaaS | 15-30x |
| Technology hardware | 8-15x |
| Healthcare/Pharma | 10-20x |
| Consumer staples | 10-15x |
| Industrials | 7-12x |
| Utilities | 8-12x |
| Retail | 6-10x |
| Energy | 4-8x |

### EV / Revenue

Used when companies are unprofitable or have very different margin profiles. Common for:
- Early-stage SaaS companies with negative EBITDA
- Biotech companies with no revenue (use EV / pipeline value instead)
- Hypergrowth companies where revenue is the best proxy for scale

### P/E Ratio (Price / Earnings per Share)

The most familiar multiple to public market investors. P/E is intuitive — "you are paying X years' worth of earnings." However, P/E is distorted by:
- Capital structure (highly levered companies have lower earnings per share)
- Tax differences across jurisdictions
- Non-recurring items that inflate or depress earnings

Use **forward P/E** (based on next year's estimated earnings) rather than trailing P/E for better comparability.

### PEG Ratio (P/E / Growth Rate)

The PEG ratio adjusts P/E for growth:
- PEG < 1.0 suggests the stock may be undervalued relative to its growth
- PEG > 1.0 suggests the stock may be overvalued relative to its growth

Peter Lynch popularized this metric, but it has limitations — it assumes a linear relationship between P/E and growth, which does not always hold.

### Industry-Specific Multiples

Some industries use specialized multiples:

| Industry | Multiple | Rationale |
|----------|----------|-----------|
| Real estate | Price / FFO | FFO adjusts for depreciation on real assets |
| Banks | Price / Tangible Book | Book value is the core asset for banks |
| Insurance | Price / Book | Similar to banks |
| Media/Telecom | EV / Subscribers | Subscriber count drives value |
| Oil & Gas | EV / EBITDAX | Adjusts for exploration expense |
| SaaS | EV / ARR | Annual recurring revenue captures subscription value |

### Calendarization

When companies have different fiscal year-ends, you must **calendarize** their financial data to a common date. If Company A's fiscal year ends in December and Company B's ends in June, use the last twelve months (LTM) data to create an apples-to-apples comparison.

### Key Takeaway

Multiples are shortcuts, not substitutes for deep analysis. EV/EBITDA is the default in most situations, but the right multiple depends on the industry, the company's profitability, and the question you are trying to answer. Always use consistent metrics (enterprise vs. equity), calendarize when needed, and understand what drives multiple differences within your comp set.`,
    },
    {
      id: "ib-comps-spreading",
      slug: "spreading-comps",
      title: "Spreading Comps",
      content: `## Spreading Comps

"Spreading comps" is the process of compiling financial data and valuation multiples for your selected comparable companies into a standardized table. This is one of the most common tasks for investment banking analysts and associates, and doing it well requires precision, consistency, and attention to detail.

### The Comps Table Structure

A standard comps output table includes these columns:

| Category | Data Points |
|----------|-------------|
| **Company info** | Name, ticker, stock price, shares outstanding |
| **Market data** | Market cap, enterprise value, 52-week high/low |
| **Operating metrics** | Revenue, EBITDA, EBIT, net income (LTM and forward) |
| **Growth** | Revenue growth (LTM, NTM, 2-year forward) |
| **Margins** | Gross margin, EBITDA margin, net margin |
| **Multiples** | EV/Revenue, EV/EBITDA, P/E (LTM and forward) |
| **Returns** | ROIC, ROE |
| **Summary stats** | Mean, median, 25th/75th percentile for each metric |

### Step-by-Step Process

**Step 1: Gather Market Data**

For each company, collect:
- Current share price (as of a specific date — all comps must use the same date)
- Basic and diluted shares outstanding
- Market capitalization = Share price x Diluted shares
- Net debt = Total debt - Cash and equivalents
- Enterprise value = Market cap + Net debt + Minority interest + Preferred stock - Associates/JVs

**Step 2: Compile Financial Data**

Pull financial data from public filings (10-K, 10-Q) or financial databases:
- **LTM (Last Twelve Months)**: Use the most recent annual data adjusted for interim periods
- **NTM (Next Twelve Months)**: Use consensus analyst estimates

LTM calculation when the fiscal year does not align with the calendar year:
LTM = Annual data + Recent stub period - Prior year stub period

Example: For LTM as of Q3 2025:
LTM Revenue = FY2024 Revenue + Q1-Q3 2025 Revenue - Q1-Q3 2024 Revenue

**Step 3: Normalize Earnings**

Adjust for non-recurring items to make comparisons fair:
- Add back restructuring charges
- Remove gains/losses on asset sales
- Adjust for litigation settlements
- Normalize stock-based compensation treatment

Document every adjustment so the analysis is auditable.

**Step 4: Calculate Multiples**

With clean enterprise values and normalized financials:
- EV / LTM Revenue, EV / NTM Revenue
- EV / LTM EBITDA, EV / NTM EBITDA
- LTM P/E, NTM P/E

**Step 5: Calculate Summary Statistics**

For each multiple, calculate:
- **Mean**: Simple average (can be skewed by outliers)
- **Median**: Middle value (more robust to outliers)
- **25th and 75th percentile**: Shows the range of "normal"

The median is generally preferred over the mean because a single outlier (a company trading at 50x EBITDA in a group of 10x companies) can distort the average significantly.

### Applying Multiples to the Target

Once you have the comp set statistics, apply them to the target company:

Implied Enterprise Value = Target's EBITDA x Median EV/EBITDA from comps
Implied Equity Value = Implied EV - Net Debt
Implied Share Price = Implied Equity Value / Diluted Shares

Always present a range (using 25th and 75th percentile multiples) rather than a single point estimate.

### Common Pitfalls

1. **Stale data**: Using a mix of dates for share prices across comps
2. **Inconsistent EV calculations**: Some analysts forget minority interest or preferred stock
3. **Not calendarizing**: Comparing a March fiscal year to a December fiscal year without adjustment
4. **Ignoring SBC**: Stock-based compensation treatment varies; decide whether to include or exclude it from EBITDA, and be consistent
5. **Cherry-picking**: Including or excluding comps to support a pre-determined conclusion

### Key Takeaway

Spreading comps is a mechanical process, but the quality lies in the details — consistent date alignment, proper LTM calculations, appropriate normalizing adjustments, and transparent documentation. A well-spread comp table is a powerful tool; a sloppy one is misleading.`,
    },
    {
      id: "ib-comps-precedent-transactions",
      slug: "precedent-transactions",
      title: "Precedent Transactions Analysis",
      content: `## Precedent Transactions Analysis

Precedent transaction analysis (also called "deal comps" or "precedents") values a company by examining the prices paid in comparable past M&A transactions. While trading comps tell you what the market values a company at today, precedents tell you what acquirers have actually paid to buy similar companies.

### Why Precedents Differ from Trading Comps

Precedent transaction multiples are almost always **higher** than trading comps for the same set of companies. The difference is the **control premium** — the extra amount an acquirer pays above the current stock price to gain control of the company.

Control premiums typically range from **20-40%** above the pre-deal share price. They reflect:
- The value of strategic synergies (cost savings, revenue growth)
- The ability to change management and strategy
- Competitive pressure from other bidders
- The seller's negotiating leverage

### Selecting Precedent Transactions

The criteria for selecting precedent transactions differ from trading comps:

**1. Transaction Type**
Include only transactions comparable to the one being contemplated:
- If you are advising on a full acquisition, include full acquisitions (not minority investments)
- If the target is being sold to a financial sponsor (PE firm), focus on LBO precedents
- If the buyer is a strategic acquirer, focus on strategic transactions

**2. Industry Match**
Same industry logic as trading comps — the target should be in the same or adjacent industry.

**3. Transaction Size**
Focus on deals of similar size. A \$500M acquisition is not comparable to a \$50B megamerger because deal dynamics, buyer pools, and financing structures differ.

**4. Time Period**
More recent transactions are more relevant because market conditions change. Best practice:
- Primary precedents: Last 3-5 years
- Extended precedents: Last 5-10 years (if needed for a larger sample)
- Flag any transactions that occurred during unusual market conditions (e.g., COVID-era discounts, 2021 frothy multiples)

**5. Geography**
Regional deal dynamics matter. US transactions may not be directly comparable to European or Asian deals due to regulatory, tax, and market differences.

### Data Sources for Precedent Transactions

| Source | Description |
|--------|-------------|
| Capital IQ / Bloomberg | Transaction databases with deal details |
| Merger proxy statements | SEC filings with detailed deal terms |
| Equity research reports | Analysts discuss deal comps in M&A commentary |
| Press releases | Initial announcement details |
| SDC Platinum (Refinitiv) | Comprehensive M&A database |

### Key Metrics to Collect

For each transaction:
- Announcement date and closing date
- Acquirer and target names
- Transaction value (enterprise value paid)
- Payment form (cash, stock, or mix)
- Premium paid (to pre-deal share price)
- Key multiples: EV/Revenue, EV/EBITDA at the time of the deal
- Strategic rationale (synergies, market expansion, etc.)

### Presenting Precedent Transactions

The output table typically includes:

| Date | Target | Acquirer | EV (\$M) | EV/Rev | EV/EBITDA | Premium |
|------|--------|----------|---------|--------|-----------|---------|
| 2024 | Co A | Buyer X | 2,500 | 3.5x | 12.0x | 30% |
| 2024 | Co B | Buyer Y | 1,800 | 2.8x | 10.5x | 25% |
| 2023 | Co C | Buyer Z | 3,200 | 4.0x | 14.0x | 35% |

Summary statistics (mean, median) are calculated and applied to the target company, just as with trading comps.

### Limitations

- **Stale data**: Market conditions 5 years ago may not reflect today's environment
- **Incomplete information**: Not all deal terms are publicly disclosed
- **Small sample sizes**: In niche industries, there may be only 3-5 relevant transactions
- **Synergy distortion**: Different buyers may pay different premiums based on their unique synergy expectations

### Key Takeaway

Precedent transactions provide the most market-relevant data point for M&A valuations because they reflect what real buyers actually paid. However, they require careful selection and context — every deal has unique circumstances that influenced the price. The best analyses combine precedents with trading comps and DCF to triangulate a defensible valuation range.`,
    },
    {
      id: "ib-comps-football-field",
      slug: "football-field",
      title: "The Football Field Chart",
      content: `## The Football Field Chart

The football field chart (also called a valuation summary chart or "gridiron") is one of the most iconic outputs in investment banking. It presents the results of multiple valuation methodologies on a single page, showing the range of values each method implies. It is typically the last page in a valuation section and often the one that gets the most attention from clients.

### What It Looks Like

A football field chart is a horizontal bar chart where:
- Each row represents a different valuation methodology
- The bar spans from the low to the high of each method's range
- A marker indicates the midpoint or base case
- All bars are plotted on the same horizontal axis (share price or enterprise value)

Visually:

\`\`\`
                    $20   $30   $40   $50   $60
DCF Analysis        |---[====|====]---|
Trading Comps            |--[===|==]--|
Precedent Trans.              |--[====|=====]----|
52-Week Range        |----[=|=====]--------|
LBO Analysis              |--[==|===]----|
\`\`\`

The overlapping region across all methods represents the **valuation consensus** — the range where multiple approaches agree.

### Methodologies Typically Included

| Method | What It Shows |
|--------|---------------|
| **DCF Analysis** | Intrinsic value based on projected cash flows |
| **Trading Comps** | Market-implied value based on peer multiples |
| **Precedent Transactions** | Acquisition-implied value based on deal comps |
| **LBO Analysis** | Value a financial sponsor would pay for target returns |
| **52-Week Trading Range** | Where the stock has actually traded |
| **Analyst Price Targets** | Where equity research analysts see the stock |

### Building the Chart

**Step 1: Run Each Valuation**
Complete the full analysis for each methodology. The football field chart is a summary — it cannot be built until the underlying work is done.

**Step 2: Define the Range for Each Method**

For the DCF, the range comes from the sensitivity table:
- Low: WACC high end, growth rate low end
- Mid: Base case assumptions
- High: WACC low end, growth rate high end

For trading comps:
- Low: 25th percentile multiple applied to target financials
- Mid: Median multiple
- High: 75th percentile multiple

For precedent transactions:
- Low: 25th percentile deal multiple
- Mid: Median deal multiple
- High: 75th percentile deal multiple

For LBO analysis:
- Low: Higher target IRR assumption (e.g., 25% IRR)
- Mid: Base case IRR (e.g., 20%)
- High: Lower target IRR (e.g., 15%)

**Step 3: Convert to Common Units**
All methods must be expressed in the same units — typically either share price or enterprise value. This requires the equity bridge:

Enterprise Value → subtract net debt → Equity Value → divide by diluted shares → Share Price

**Step 4: Create the Chart**
Use a stacked bar chart in Excel or similar software. Format consistently:
- All bars the same height
- Color-coded by methodology
- Midpoint clearly marked
- Current share price shown as a vertical reference line

### Interpreting the Football Field

The power of the football field is in the **convergence**. If DCF, comps, and precedents all point to a share price range of 35 to 45 dollars, you have a strong basis for your valuation opinion. If the DCF says 25 dollars and precedents say 55 dollars, you need to explain the divergence and take a view on which methodology is most relevant.

Common patterns:
- **Precedents above comps**: Normal — control premium explains the difference
- **DCF above comps**: The market may be undervaluing the company, or your DCF assumptions are too aggressive
- **LBO below everything**: Expected — financial sponsors need a discount to generate their target returns
- **52-week range very wide**: The stock has been volatile; consider which part of the range was driven by company-specific vs. market factors

### Presentation Tips

- **Lead with the methodology you believe is most relevant** for this specific situation
- **Explain divergences** — do not hope the audience will not notice
- **Use the overlap zone** to anchor your valuation recommendation
- **Include a one-line description** of key assumptions under each bar (e.g., "DCF: WACC 9-11%, Terminal Growth 2-3%")
- **Highlight the current share price** so the audience can immediately see if the stock is undervalued or overvalued relative to your analysis

### Key Takeaway

The football field chart is the synthesis of all your valuation work. It acknowledges that no single method produces the "right" answer and instead presents a range informed by multiple perspectives. The quality of the chart depends entirely on the rigor of the underlying analyses — a pretty chart built on sloppy models is worthless. But a well-constructed football field is one of the most persuasive tools in an investment banker's arsenal.`,
    },
  ],
};
