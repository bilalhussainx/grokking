import { Module } from "../types";

export const fundamentalAnalysisModule: Module = {
  id: "sm-fundamental",
  title: "Fundamental Analysis",
  description:
    "Learn to evaluate companies by reading financial statements, analyzing valuation ratios, and identifying competitive moats.",
  lessons: [
    {
      id: "sm-fundamental-statements",
      slug: "reading-financial-statements",
      title: "Reading Financial Statements",
      content: `## Reading Financial Statements

Financial statements are the report card of a business. They tell you how much money a company makes, how much it owns and owes, and how cash moves through the business. Learning to read financial statements is the most important skill in fundamental investing — it is how you separate great businesses from mediocre ones.

### The Three Core Financial Statements

Every publicly traded company files financial statements with the SEC on a quarterly (10-Q) and annual (10-K) basis. The three core statements are:

**1. Income Statement (Profit & Loss)**

The income statement shows revenue, expenses, and profit over a period of time (quarter or year). Read it top to bottom:

| Line Item | What It Tells You |
|-----------|-------------------|
| **Revenue (Sales)** | How much the company earned from selling goods/services |
| **Cost of Goods Sold (COGS)** | Direct costs to produce what was sold |
| **Gross Profit** | Revenue minus COGS — shows pricing power |
| **Operating Expenses (OpEx)** | SG&A, R&D, depreciation — overhead costs |
| **Operating Income (EBIT)** | Profit from core operations |
| **Interest Expense** | Cost of debt financing |
| **Pre-Tax Income** | Operating income minus interest and other items |
| **Net Income** | The bottom line — profit after all expenses and taxes |

**Key ratios to calculate:**
- Gross margin = Gross Profit / Revenue
- Operating margin = Operating Income / Revenue
- Net margin = Net Income / Revenue

Higher margins generally indicate a more profitable, competitive business.

**2. Balance Sheet**

The balance sheet shows what a company owns (assets), owes (liabilities), and the residual value belonging to shareholders (equity) at a single point in time.

The fundamental equation: **Assets = Liabilities + Shareholders' Equity**

Key items to examine:
- **Cash and equivalents**: Liquidity buffer
- **Accounts receivable**: Money owed by customers (is it growing faster than revenue? Warning sign)
- **Inventory**: Goods not yet sold (is it piling up? Another warning)
- **Total debt**: Short-term and long-term borrowings
- **Shareholders' equity**: Book value of the company

**3. Cash Flow Statement**

The cash flow statement shows actual cash coming in and going out, organized into three sections:

- **Operating activities**: Cash from running the business (starts with net income, adjusts for non-cash items and working capital changes)
- **Investing activities**: Cash spent on or received from investments (CapEx, acquisitions, asset sales)
- **Financing activities**: Cash from or paid to capital providers (debt issuance/repayment, stock issuance/buybacks, dividends)

**The most important number**: Free Cash Flow = Operating Cash Flow - Capital Expenditures. This is the cash available to return to shareholders or reinvest in the business.

### Where to Find Financial Statements

- **SEC EDGAR** (edgar.sec.gov): The official source for all US public company filings
- **Company investor relations page**: Usually has a clean presentation of financials
- **Financial data providers**: Yahoo Finance, Google Finance, Macrotrends, Finviz
- **Brokerage platforms**: Most provide financial data within their research tools

### Red Flags to Watch For

- Revenue growing but cash flow declining (earnings quality issue)
- Accounts receivable growing faster than revenue (customers not paying)
- Inventory growing faster than sales (products not selling)
- Increasing debt without corresponding growth in operations
- Frequent "one-time" charges that seem to recur every year
- Large gap between net income and operating cash flow

### Key Takeaway

Financial statements tell the story of a business in numbers. The income statement shows profitability, the balance sheet shows financial health, and the cash flow statement shows cash reality. Reading all three together — and tracking how they change over time — gives you the information you need to evaluate whether a company is a good investment.`,
    },
    {
      id: "sm-fundamental-ratios",
      slug: "valuation-ratios",
      title: "Valuation Ratios: P/E, P/B, PEG",
      content: `## Valuation Ratios: P/E, P/B, PEG

Valuation ratios help you determine whether a stock is cheap, fairly priced, or expensive relative to the company's financial performance. A great company can be a poor investment if you pay too much for it. Valuation ratios are the tools that help you assess price relative to value.

### Price-to-Earnings Ratio (P/E)

The P/E ratio is the most widely used valuation metric:

**P/E = Stock Price / Earnings Per Share (EPS)**

Or equivalently: P/E = Market Capitalization / Net Income

A P/E of 20 means investors are paying 20 dollars for every 1 dollar of annual earnings. It also means that, at current earnings levels, it would take 20 years to "earn back" your purchase price.

**Types of P/E:**
- **Trailing P/E**: Based on the last 12 months of actual earnings
- **Forward P/E**: Based on analyst estimates for the next 12 months of earnings
- **Shiller P/E (CAPE)**: Based on the average of 10 years of inflation-adjusted earnings

**What P/E tells you:**

| P/E Range | Typical Interpretation |
|-----------|----------------------|
| < 10 | Potentially undervalued, or market expects declining earnings |
| 10-20 | Fairly valued for mature companies |
| 20-30 | Premium valuation, market expects strong growth |
| 30-50 | High growth expectations priced in |
| > 50 | Very high expectations or speculative |

**Limitations:** P/E can be misleading for companies with negative earnings (undefined P/E), cyclical earnings (low P/E at peak, high at trough), or significant non-cash charges that distort net income.

### Price-to-Book Ratio (P/B)

**P/B = Stock Price / Book Value Per Share**

Book value is shareholders' equity divided by shares outstanding — essentially the accounting value of the company. A P/B of 1.0 means the stock trades at its book value.

**When P/B is useful:**
- Financial companies (banks, insurance) where book value closely relates to the value of assets
- Asset-heavy businesses (utilities, real estate)
- Cyclical companies where earnings are volatile but book value is stable

**When P/B is less useful:**
- Technology and service companies where intellectual property and brand value are not reflected on the balance sheet
- Companies with significant intangible assets

### PEG Ratio

**PEG = P/E Ratio / Earnings Growth Rate**

The PEG ratio adjusts the P/E for growth. A company with a P/E of 30 and 30% growth has a PEG of 1.0 — the same as a company with a P/E of 15 and 15% growth.

| PEG | Interpretation |
|-----|---------------|
| < 1.0 | Potentially undervalued relative to growth |
| 1.0 | Fairly valued — growth justifies the P/E |
| > 1.0 | Potentially overvalued relative to growth |
| > 2.0 | Expensive — high P/E not justified by growth |

**Limitations:** PEG assumes a linear relationship between P/E and growth, which does not always hold. It also depends heavily on which growth estimate you use (historical vs. projected, 1-year vs. 5-year).

### Other Important Ratios

**EV/EBITDA**: Enterprise value divided by EBITDA. Useful for comparing companies with different capital structures. Discussed in detail in the investment banking course.

**Price-to-Sales (P/S)**: Market cap divided by revenue. Useful for unprofitable companies where P/E is undefined. Common for SaaS and high-growth tech companies.

**Price-to-Free-Cash-Flow (P/FCF)**: Market cap divided by free cash flow. More reliable than P/E because cash flow is harder to manipulate than earnings.

**Dividend Yield**: Annual dividend per share divided by stock price. Relevant for income-focused investors.

### Comparing Ratios

Always compare ratios within the same industry and against historical averages:

| Sector | Typical P/E | Typical P/B |
|--------|------------|------------|
| Technology | 25-40 | 5-15 |
| Healthcare | 20-30 | 3-8 |
| Financials | 10-15 | 1-2 |
| Utilities | 15-20 | 1.5-2.5 |
| Consumer Staples | 20-25 | 3-8 |
| Energy | 8-15 | 1-3 |

A P/E of 15 is cheap for a tech stock but expensive for a utility. Context matters.

### Key Takeaway

No single ratio tells the full story. P/E is the starting point, but you should always look at multiple ratios and understand what drives them. A "cheap" stock (low P/E) might be cheap for good reasons — declining business, management issues, or competitive threats. A "expensive" stock (high P/E) might be worth it if growth justifies the premium. Ratios are screening tools, not investment decisions.`,
    },
    {
      id: "sm-fundamental-earnings",
      slug: "earnings-reports",
      title: "Understanding Earnings Reports",
      content: `## Understanding Earnings Reports

Earnings season is the most important recurring event in the stock market. Four times a year, publicly traded companies report their financial results, and the market reacts — sometimes dramatically. Understanding how to read and interpret earnings reports is essential for any investor who holds individual stocks.

### What an Earnings Report Contains

A quarterly earnings report typically includes:

**1. The Press Release**
A summary document highlighting key metrics. This is what most investors read first and what the media covers. It includes:
- Revenue (total and by segment)
- Earnings per share (EPS) — both GAAP and non-GAAP (adjusted)
- Key operating metrics specific to the industry
- Forward guidance (management's outlook for the next quarter or year)
- Notable events (acquisitions, restructuring, new products)

**2. The 10-Q Filing (SEC)**
The official quarterly report filed with the SEC. It includes complete financial statements, management discussion and analysis (MD&A), and detailed disclosures. It is more comprehensive than the press release but less accessible.

**3. The Earnings Call**
A live conference call (usually with a webcast) where management presents results and takes questions from analysts. The Q&A session is often more informative than the prepared remarks because analysts probe on specific concerns.

### The Beat/Miss Framework

Wall Street revolves around **expectations**. Before each earnings report, analysts publish estimates for revenue, EPS, and other key metrics. The consensus estimate is the average of these forecasts.

| Outcome | Market Reaction |
|---------|----------------|
| Beat on revenue AND EPS | Typically positive, especially with raised guidance |
| Beat on EPS, miss on revenue | Mixed — cost cutting can boost EPS without real growth |
| Miss on both | Typically negative |
| Beat expectations but lower guidance | Often negative — the market cares more about the future |

**The critical insight:** Stock prices are driven by surprises, not absolutes. A company can report record revenue and see its stock drop if the results were below expectations. Conversely, a company reporting a loss can see its stock rise if the loss was smaller than expected.

### Key Metrics to Focus On

**Revenue growth** — The most important top-line metric. Is the company growing? Is growth accelerating or decelerating? Organic growth (excluding acquisitions) is more valuable than acquired growth.

**Earnings per share (EPS)** — The bottom-line metric. Compare GAAP EPS (the official number) with adjusted EPS (which excludes non-recurring items). A large gap between the two warrants investigation.

**Operating margins** — Are margins expanding (improving efficiency), stable, or compressing (rising costs, pricing pressure)?

**Free cash flow** — Cash is king. A company can report positive earnings but negative cash flow if it is burning through working capital or over-investing. Watch for persistent gaps between net income and free cash flow.

**Forward guidance** — Management's outlook for the coming quarter or year. Guidance often matters more than the current quarter's results because investors are pricing the future, not the past.

### Reading Between the Lines

**Watch for non-GAAP adjustments:** Companies increasingly report "adjusted" metrics that exclude stock-based compensation, restructuring charges, and other items. Some adjustments are reasonable; others are aggressive. If adjusted EPS is consistently much higher than GAAP EPS, investigate what is being excluded.

**Listen to the earnings call tone:** Is management confident or cautious? Are they providing specific guidance or being vague? How do they respond to tough analyst questions? Evasive answers can be a red flag.

**Track guidance revisions:** Companies that consistently beat and raise guidance are typically better investments than those that consistently miss and lower guidance.

### How to Use Earnings Reports

1. **Before the report**: Know the consensus estimates and what the market expects
2. **Read the press release**: Focus on revenue, EPS, and guidance relative to expectations
3. **Listen to the earnings call**: Pay attention to the Q&A section
4. **Do not react emotionally**: Post-earnings moves can be overreactions in both directions
5. **Update your thesis**: Does the report change your fundamental view of the company?

### Key Takeaway

Earnings reports are the quarterly checkup on your investment thesis. They tell you whether the company is executing its strategy and whether reality matches expectations. The most valuable skill is not predicting whether a company will beat or miss — it is understanding what the report reveals about the company's trajectory and whether the stock price reflects that trajectory accurately.`,
    },
    {
      id: "sm-fundamental-moats",
      slug: "competitive-moats",
      title: "Competitive Moats (Buffett's Framework)",
      content: `## Competitive Moats (Buffett's Framework)

Warren Buffett popularized the concept of an "economic moat" — a sustainable competitive advantage that protects a company's profits from competitors, much like a moat protects a castle from invaders. Identifying companies with wide moats is central to long-term value investing because moats allow companies to maintain high returns on capital for decades.

### What is an Economic Moat?

An economic moat is a structural advantage that makes it difficult for competitors to take market share or erode profitability. Without a moat, any profitable business will attract competition until profits are competed away. With a moat, a company can earn above-average returns for an extended period.

As Buffett said: "The key to investing is determining the competitive advantage of any given company and, above all, the durability of that advantage."

### The Five Types of Moats

**1. Brand Power**
A strong brand allows a company to charge premium prices. Consumers choose Coca-Cola over generic cola, Nike over unbranded sneakers, and Apple over commodity phones — and they pay more to do so.

**Test:** Can the company raise prices without losing significant customers? If yes, it has brand pricing power.

**Examples:** Apple, Coca-Cola, Louis Vuitton, Starbucks, Disney

**2. Network Effects**
A product or service becomes more valuable as more people use it. This creates a self-reinforcing cycle: more users attract more users, making it nearly impossible for competitors to catch up.

**Test:** Would the product be significantly less useful if half the users left? If yes, it benefits from network effects.

**Examples:** Visa/Mastercard (merchant and cardholder networks), Meta (social graph), Microsoft Office (workplace standard), Airbnb (host and guest ecosystem)

**3. Cost Advantages (Economies of Scale)**
When a company can produce goods or services at a lower cost than competitors — often due to scale, proprietary processes, or access to cheaper resources — it has a cost moat. Competitors cannot profitably match its prices.

**Test:** Can the company sustain lower prices than competitors while still earning attractive returns? If yes, it has a cost advantage.

**Examples:** Walmart (purchasing power and distribution scale), Amazon (logistics infrastructure), GEICO (low-cost direct distribution)

**4. Switching Costs**
When it is difficult, costly, or time-consuming for customers to switch to a competitor, the company has a switching cost moat. This locks in revenue and makes customers "sticky."

**Test:** Would a customer face significant pain, cost, or risk by switching to a competitor? If yes, switching costs are present.

**Examples:** Microsoft (enterprise software deeply embedded in workflows), Oracle (mission-critical databases), Intuit (tax data and financial history), EHR systems (patient data migration)

**5. Regulatory / Legal Barriers**
Government licenses, patents, and regulatory approvals can create moats that are nearly impossible for competitors to replicate.

**Test:** Do competitors face legal or regulatory barriers to entering the market? If yes, the company has a regulatory moat.

**Examples:** Pharmaceutical patents, utility monopolies, bank charters, spectrum licenses

### Moat Width and Durability

Not all moats are equal. Buffett distinguishes between:

| Moat Type | Width | Durability |
|-----------|-------|-----------|
| **Wide moat** | Strong competitive advantage across multiple dimensions | 15-20+ years |
| **Narrow moat** | Meaningful advantage but vulnerable to disruption | 5-10 years |
| **No moat** | Commodity business with little differentiation | Constantly eroding |

A wide moat company (like Visa) has multiple reinforcing advantages — network effects, brand, switching costs, and regulatory barriers. A narrow moat company might have brand recognition but face increasing competition from lower-cost alternatives.

### Signs of an Eroding Moat

Watch for these warning signals:
- Declining pricing power (forced to discount to maintain volume)
- Market share losses to new entrants or substitutes
- Falling return on invested capital (ROIC) over time
- Increased customer churn or shorter contract durations
- Technological disruption changing the competitive landscape

### Applying Moat Analysis to Investing

When evaluating a potential investment:
1. Identify the company's primary moat source(s)
2. Assess the width — how strong is the advantage?
3. Evaluate durability — what could erode the moat over 10-20 years?
4. Check the financials — wide moats should show up as consistently high ROIC, stable or expanding margins, and strong free cash flow generation
5. Consider valuation — even a wide-moat company can be overpriced

### Key Takeaway

Economic moats are the single most important qualitative factor in long-term investing. A company with a wide, durable moat can compound wealth for decades because competitors cannot easily erode its profitability. When you invest in a moated business at a reasonable price, time is your ally — the moat keeps working for you year after year.`,
    },
    {
      id: "sm-fundamental-intrinsic-value",
      slug: "intrinsic-value",
      title: "Calculating Intrinsic Value",
      content: `## Calculating Intrinsic Value

Intrinsic value is the estimated true worth of a company based on its fundamentals — its cash flows, growth prospects, and risk profile. It is independent of the current stock price, which is driven by market sentiment and short-term factors. The core principle of value investing is simple: buy stocks trading below their intrinsic value and sell (or avoid) those trading above it.

### The Concept

As Warren Buffett defines it: "Intrinsic value is the discounted value of the cash that can be taken out of a business during its remaining life."

The stock market sets a price every day. Sometimes that price reflects intrinsic value accurately. Sometimes the market overreacts to bad news and prices a stock below its true worth (buying opportunity). Sometimes the market gets euphoric and prices a stock above its true worth (time to be cautious).

Your job as a fundamental investor is to estimate intrinsic value independently and act when the market price diverges significantly from it.

### Method 1: Discounted Cash Flow (Simplified)

The most theoretically rigorous approach:

1. **Estimate future free cash flows** for the next 10 years
2. **Calculate a terminal value** for all cash flows beyond year 10
3. **Discount everything back** to today using an appropriate rate (typically 10% for stocks, representing your required return)
4. **Sum the present values** to get total intrinsic value
5. **Divide by shares outstanding** to get per-share intrinsic value

**Simplified example:**
- Current free cash flow: \$5 per share
- Expected growth: 8% per year for 10 years
- Terminal growth: 3% after year 10
- Discount rate: 10%

Year 1 FCF: \$5.40 (5 x 1.08), discounted: \$4.91
Year 2 FCF: \$5.83, discounted: \$4.82
...and so on for 10 years

Terminal value: Year 10 FCF x (1.03) / (0.10 - 0.03), discounted back

This produces an intrinsic value estimate. If the stock trades significantly below this number, it may be undervalued.

### Method 2: Earnings Power Value

A simpler approach that values the company based on its current earnings power without assuming growth:

\`\`\`
Earnings Power Value = Adjusted Earnings / Cost of Capital
\`\`\`

If a company earns \$10 per share in normalized earnings and your required return is 10%, the earnings power value is \$100 per share. Any growth on top of that is bonus.

This approach is conservative — it tells you what the company is worth if it never grows. If the stock trades below this level, you are getting growth for free.

### Method 3: Asset-Based Valuation

For asset-heavy companies or distressed situations:

\`\`\`
Intrinsic Value = Fair Market Value of Assets - Total Liabilities
\`\`\`

This is essentially a liquidation analysis. It sets a floor for what the company is worth if it closed its doors and sold everything. For most operating companies, the going-concern value (from DCF or earnings power) exceeds the asset value.

### The Margin of Safety

Benjamin Graham, the father of value investing, introduced the concept of the **margin of safety**: always buy at a significant discount to your estimated intrinsic value.

Why? Because your estimate of intrinsic value is inherently uncertain. You might be wrong about growth rates, margins, or the competitive environment. Buying at a discount provides a buffer against errors.

| Margin of Safety | When to Apply |
|-----------------|---------------|
| 10-15% | High-quality, predictable businesses |
| 20-30% | Average quality or moderate uncertainty |
| 30-50% | High uncertainty, turnaround situations |

If you estimate a stock is worth \$100, a 30% margin of safety means you would only buy at \$70 or below.

### Practical Approach for Individual Investors

You do not need a complex DCF model. A practical framework:

1. **Estimate normalized earnings**: What will this company earn in a normal year, 3-5 years from now?
2. **Apply a reasonable P/E multiple**: Based on the company's growth rate, quality, and industry norms
3. **Calculate future price**: Normalized EPS x P/E multiple
4. **Discount to present**: Divide by (1.10)^years to account for your required return
5. **Compare to current price**: Is the current price below your estimate with a margin of safety?

**Example:**
- Estimated EPS in 5 years: \$8.00
- Reasonable P/E for this quality company: 18x
- Estimated price in 5 years: \$144
- Discounted at 10%: \$144 / 1.61 = \$89.44
- Current stock price: \$72
- Margin of safety: 19% below estimated intrinsic value

This stock appears undervalued with an adequate margin of safety.

### Key Takeaway

Intrinsic value calculation is not about precision — it is about having a rational framework for making buy and sell decisions. Your estimate will always be imperfect, which is why the margin of safety is essential. The goal is not to calculate intrinsic value to the penny but to develop a reasonable range and act when the market price falls well below it.`,
    },
  ],
};
