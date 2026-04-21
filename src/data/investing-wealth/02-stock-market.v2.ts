import { Module } from "../types";

export const stockMarketModule: Module = {
  id: "iw-stock-market",
  title: "Stock Market Fundamentals",
  description: "Learn how the stock market works, what drives stock prices, how to read financial statements, and the difference between value and growth investing. Resources: The Intelligent Investor by Benjamin Graham, Investopedia, SEC Investor Education.",
  lessons: [
    {
      id: "iw-how-stock-market-works",
      slug: "how-stock-market-works",
      title: "How the Stock Market Works",
      content: `## How the Stock Market Works

<!-- voice:key_insight insight="The stock market is an auction house where millions of buyers and sellers negotiate prices for fractional ownership in companies -- every second of every trading day." -->

The stock market can seem intimidating, but at its core it operates on a simple principle: companies sell partial ownership to raise capital, and investors buy that ownership hoping to profit as the company grows.

### From IPO to Your Portfolio

When a company wants to raise money, it can issue shares through an **Initial Public Offering (IPO)**. The company works with investment banks to set an initial price and sell shares to institutional investors. After the IPO, shares trade on a stock exchange -- the **secondary market** -- where everyday investors like you can buy and sell.

Major U.S. exchanges include:
- **NYSE (New York Stock Exchange):** Founded 1792, the world's largest by market capitalization (~\\$27 trillion)
- **NASDAQ:** Founded 1971, technology-heavy (~\\$22 trillion)

### What Moves Stock Prices

Stock prices are determined by **supply and demand**. If more people want to buy a stock than sell it, the price rises. If more want to sell, it falls. But what drives that demand? Several factors:

| Factor | Impact | Example |
|--------|--------|---------|
| **Earnings** | Strong profits push prices up | Apple reporting record iPhone sales |
| **Interest rates** | Higher rates often lower stock prices | Fed rate hikes in 2022-2023 |
| **Economic data** | GDP, unemployment, consumer spending | Strong jobs report boosts market |
| **Investor sentiment** | Fear and greed drive short-term swings | COVID panic sell-off, March 2020 |
| **Industry trends** | Sector-specific developments | AI boom lifting tech stocks in 2023-2024 |

### Market Indices: The Scoreboard

You cannot buy "the stock market" directly, but indices track its performance:

- **S&P 500:** 500 large U.S. companies, widely considered the best benchmark for the U.S. market
- **Dow Jones Industrial Average (DJIA):** 30 large companies, price-weighted (less representative)
- **NASDAQ Composite:** All ~3,000+ stocks on the NASDAQ exchange, tech-heavy
- **Russell 2000:** 2,000 small-cap stocks, gauge of smaller company performance

<!-- voice:section_check concept="how stock markets operate" -->

### Bull Markets and Bear Markets

A **bull market** is a sustained period of rising prices (generally 20%+ from a recent low). A **bear market** is a sustained decline of 20%+ from a recent high.

Since 1926, the U.S. stock market has experienced roughly 26 bear markets. The average bear market lasts about 9.6 months. The average bull market lasts about 2.7 years. This asymmetry is critical: markets spend far more time rising than falling.

### Market Hours and Order Types

U.S. markets are open Monday-Friday, 9:30 AM - 4:00 PM Eastern. Key order types:

- **Market order:** Buy/sell immediately at the current price. Fast but price is not guaranteed.
- **Limit order:** Buy/sell only at a specific price or better. Price is guaranteed but execution is not.
- **Stop-loss order:** Sell automatically if price drops to a specified level. Protects against large losses.

### Key Takeaway

The stock market is a price-discovery mechanism where millions of participants collectively determine what companies are worth. Short-term prices are driven by sentiment and news. Long-term prices are driven by earnings and economic fundamentals. Understanding this distinction is the difference between gambling and investing.

> "In the short run, the market is a voting machine. In the long run, it is a weighing machine." -- Benjamin Graham, *The Intelligent Investor*

*Resources: SEC Investor.gov, The Intelligent Investor by Benjamin Graham, NYSE Historical Data, Investopedia Stock Market Basics.*`,
    },
    {
      id: "iw-reading-financial-statements",
      slug: "reading-financial-statements",
      title: "Reading Financial Statements",
      content: `## Reading Financial Statements

<!-- voice:key_insight insight="Financial statements are a company's report card. Learning to read them transforms you from a gambler into an informed investor." -->

Every publicly traded company in the United States is required by the SEC to publish financial statements quarterly (10-Q) and annually (10-K). These documents tell you whether a company is healthy, growing, or in trouble.

### The Three Core Financial Statements

**1. Income Statement (Profit & Loss)**

Shows revenue, expenses, and profit over a period. The bottom line: did the company make money?

| Line Item | What It Tells You |
|-----------|-------------------|
| **Revenue (Sales)** | How much the company sold |
| **Cost of Goods Sold (COGS)** | Direct costs of producing goods/services |
| **Gross Profit** | Revenue minus COGS |
| **Operating Expenses** | Overhead: salaries, rent, R&D, marketing |
| **Operating Income** | Gross profit minus operating expenses |
| **Net Income** | The bottom line after all expenses and taxes |

**2. Balance Sheet**

A snapshot of what the company owns and owes at a specific point in time.

\\\`\\\`\\\`
Assets = Liabilities + Shareholders' Equity
\\\`\\\`\\\`

- **Assets:** Cash, inventory, property, equipment, intellectual property
- **Liabilities:** Debts, accounts payable, obligations
- **Shareholders' Equity:** What is left after subtracting liabilities from assets -- the owners' stake

**3. Cash Flow Statement**

Tracks actual cash moving in and out. A company can show a profit on the income statement but still run out of cash. This statement reveals the truth.

Three sections: cash from **operations** (core business), **investing** (buying/selling assets), and **financing** (borrowing, issuing stock, paying dividends).

<!-- voice:section_check concept="three core financial statements" -->

### Key Metrics to Watch

| Metric | Formula | What It Means |
|--------|---------|---------------|
| **P/E Ratio** | Price / Earnings per Share | How much you pay per dollar of profit |
| **EPS** | Net Income / Shares Outstanding | Profit per share |
| **Debt-to-Equity** | Total Liabilities / Shareholders' Equity | How leveraged the company is |
| **ROE** | Net Income / Shareholders' Equity | How efficiently the company generates profit |
| **Free Cash Flow** | Operating Cash Flow - Capital Expenditures | Cash available for dividends, buybacks, growth |

### Real-World Example: Apple (FY 2023)

- Revenue: \\$383 billion
- Net Income: \\$97 billion
- P/E Ratio: ~29 (investors pay \\$29 for each \\$1 of earnings)
- ROE: ~172% (extraordinarily efficient use of equity)
- Free Cash Flow: ~\\$111 billion

Apple's financials show a hugely profitable company generating massive cash flow. The high P/E suggests investors expect continued growth -- they are willing to pay a premium.

### Red Flags to Watch For

- Revenue growing but cash flow declining (earnings may not be real)
- Debt growing faster than revenue
- Consistently negative free cash flow
- Frequent "one-time charges" that recur every year

### Key Takeaway

You do not need to be an accountant, but every investor should be able to read the income statement, balance sheet, and cash flow statement. These three documents tell you whether a company is genuinely healthy or merely performing financial theater.

> "Accounting is the language of business." -- Warren Buffett

*Resources: SEC EDGAR Database (free filings), Investopedia Financial Statements Guide, Warren Buffett's Berkshire Hathaway Annual Letters.*`,
    },
    {
      id: "iw-value-vs-growth",
      slug: "value-vs-growth-investing",
      title: "Value vs Growth Investing",
      content: `## Value vs Growth Investing

<!-- voice:key_insight insight="Value investors buy companies trading below their intrinsic worth. Growth investors buy companies expanding rapidly. Both work -- but they require different temperaments." -->

The debate between value and growth investing has defined stock market strategy for nearly a century. Understanding both approaches helps you decide which fits your personality and goals.

### Value Investing: Buying on Sale

Value investing was pioneered by **Benjamin Graham** and **David Dodd** at Columbia Business School in the 1930s. The premise: the market sometimes misprices stocks, and patient investors can buy excellent companies at a discount.

Value investors look for:
- Low P/E ratios (paying less per dollar of earnings)
- Low price-to-book ratios (stock price below the company's net asset value)
- High dividend yields
- Strong balance sheets with low debt
- Companies temporarily out of favor

**The most famous value investor:** Warren Buffett, Graham's student, who turned \\$10,000 in 1965 into over \\$130 billion through disciplined value investing at Berkshire Hathaway.

### Growth Investing: Betting on the Future

Growth investors buy companies with rapid revenue and earnings growth, even if the stock looks "expensive" by traditional metrics. They believe the company's future earnings will justify today's price.

Growth investors look for:
- Revenue growing 15%+ annually
- Expanding market share
- Innovative products or services
- High P/E ratios (accepted because earnings are expected to catch up)

**Iconic growth stocks:** Amazon traded at a P/E above 100 for years while reinvesting all profits into expansion. Investors who bought at those "expensive" valuations earned extraordinary returns.

### Historical Performance

| Period | Value Outperformance | Growth Outperformance |
|--------|---------------------|----------------------|
| 1927-2023 (full period) | Value has a slight edge overall | -- |
| 2007-2020 | -- | Growth dominated (especially tech) |
| 2022-2023 | Value rebounded during rate hikes | -- |

<!-- voice:section_check concept="value vs growth approaches" -->

Research by Eugene Fama and Kenneth French at the University of Chicago documented the "value premium" -- value stocks have historically outperformed growth stocks by approximately 4-5% annually over long periods. However, growth stocks dominated the 2010s so thoroughly that many questioned whether the value premium had disappeared.

### The Blended Approach

Most financial advisors recommend owning both:

- **Value stocks** provide stability, dividends, and downside protection
- **Growth stocks** provide upside potential and portfolio appreciation

A total stock market index fund like Vanguard's VTI automatically gives you both -- it holds every publicly traded U.S. stock, weighted by market capitalization.

### Which Fits You?

| Factor | Value Investor | Growth Investor |
|--------|---------------|-----------------|
| Temperament | Patient, contrarian | Optimistic, forward-looking |
| Time horizon | Long (5-10+ years) | Long (5-10+ years) |
| Risk tolerance | Moderate | Higher |
| Income preference | Dividends now | Capital gains later |

### Key Takeaway

Value and growth are not opposing philosophies -- they are complementary strategies. Value investing offers a margin of safety; growth investing captures innovation. The wisest approach for most investors is to hold both through diversified index funds and let the market sort out which style leads in any given decade.

> "Price is what you pay. Value is what you get." -- Warren Buffett

*Resources: The Intelligent Investor by Benjamin Graham, One Up on Wall Street by Peter Lynch, Fama-French Three-Factor Model Research Papers.*`,
    },
    {
      id: "iw-checkpoint-2",
      slug: "iw-checkpoint-2",
      title: "Checkpoint: Stock Market Fundamentals",
      content: `## Module 2 Checkpoint

<!-- voice:section_check concept="stock market fundamentals review" -->

Great progress. Let us make sure you have a solid grasp of stock market mechanics before moving into fixed income.

---

### Question 1 (Multiple Choice)

According to Benjamin Graham, what is the stock market in the long run?

- A) A voting machine
- B) A casino
- C) A weighing machine
- D) A prediction market

<details>
<summary>Answer</summary>

**C) A weighing machine.** Graham's famous quote: "In the short run, the market is a voting machine. In the long run, it is a weighing machine." Short-term prices reflect sentiment; long-term prices reflect fundamental value.
</details>

---

### Question 2 (Multiple Choice)

Which financial statement reveals whether a company's reported profits are backed by actual cash?

- A) Income statement
- B) Balance sheet
- C) Cash flow statement
- D) Shareholder letter

<details>
<summary>Answer</summary>

**C) Cash flow statement.** A company can report profits on its income statement through accounting choices while actually burning cash. The cash flow statement shows real money in and real money out.
</details>

---

### Question 3 (Short Answer)

What is the P/E ratio, and why might a high P/E ratio be justified for a growth company?

<details>
<summary>Sample Answer</summary>

The P/E (Price-to-Earnings) ratio measures how much investors pay per dollar of current earnings. A high P/E means investors are paying a premium, which is justified if the company's earnings are expected to grow rapidly. Amazon, for example, traded at P/E ratios above 100 for years because investors believed its aggressive reinvestment would produce massive future profits -- which it did.
</details>

---

### Question 4 (Multiple Choice)

On average, how long does a U.S. bear market last?

- A) About 3 months
- B) About 9.6 months
- C) About 2.5 years
- D) About 5 years

<details>
<summary>Answer</summary>

**B) About 9.6 months.** Bear markets are painful but historically short-lived compared to bull markets, which average about 2.7 years. This asymmetry favors long-term investors who stay the course.
</details>

---

### Question 5 (Application)

You are reviewing a company with growing revenue but declining free cash flow over three consecutive years. Should this concern you? Why or why not?

<details>
<summary>Sample Answer</summary>

Yes, this is a significant red flag. Growing revenue with declining free cash flow can indicate that the company is spending increasingly more to generate each dollar of revenue, that earnings quality is deteriorating, or that the company is relying on accounting methods that inflate reported profits while actual cash is shrinking. This pattern preceded the collapse of companies like Enron and WorldCom. An investor should investigate the cash flow statement closely before committing capital.
</details>

---

You have completed Module 2. Next, we will explore bonds and fixed income -- the stabilizing force in any well-constructed portfolio.`,
    },
  ],
};
