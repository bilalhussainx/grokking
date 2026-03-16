import { Module } from "../types";

export const indexFundsEtfsModule: Module = {
  id: "iw-index-funds-etfs",
  title: "Index Funds & ETFs",
  description:
    "Discover why index funds have become the dominant investment vehicle, understand the difference between mutual funds and ETFs, and learn the data behind why most active managers underperform. Resources: A Random Walk Down Wall Street by Burton Malkiel, Bogle's Common Sense on Mutual Funds, Vanguard Research.",
  lessons: [
    {
      id: "iw-index-fund-revolution",
      slug: "index-fund-revolution",
      title: "The Index Fund Revolution",
      content: `## The Index Fund Revolution

<!-- voice:key_insight insight="Jack Bogle's creation of the first index fund in 1976 is arguably the most important financial innovation of the 20th century. It democratized investing and eliminated the need to pick stocks." -->

In 1976, John C. "Jack" Bogle founded the Vanguard Group and launched the First Index Investment Trust -- the world's first index mutual fund available to individual investors. Wall Street mocked it as "Bogle's Folly." Today, index funds hold over \\$11 trillion in assets and have fundamentally changed how the world invests.

### What Is an Index Fund?

An index fund is a mutual fund or ETF designed to replicate the performance of a specific market index. Instead of a team of analysts picking stocks, the fund simply buys all (or a representative sample) of the stocks in the index.

| Index | What It Tracks | Number of Stocks |
|-------|---------------|-----------------|
| S&P 500 | 500 largest U.S. companies | 500 |
| Total Stock Market | Entire U.S. stock market | ~4,000 |
| Total International | Non-U.S. developed + emerging | ~8,000 |
| Total Bond Market | U.S. investment-grade bonds | ~10,000 |

### Why Index Funds Win

The data is overwhelming. The S&P Dow Jones SPIVA Scorecard tracks how actively managed funds perform against their benchmark index. The results are devastating for active management:

**Percentage of actively managed U.S. large-cap funds that underperformed the S&P 500:**
- Over 1 year: ~60%
- Over 5 years: ~80%
- Over 15 years: ~92%
- Over 20 years: ~95%

That means over 20 years, only about 5% of professional fund managers beat the index. And the few who do beat it in one period rarely repeat in the next.

<!-- voice:section_check concept="why index funds outperform most active managers" -->

### The Cost Advantage

The primary reason index funds win is **fees**. The average actively managed mutual fund charges about 0.60-1.00% per year in expense ratios. Index funds charge 0.03-0.20%.

That difference seems tiny but compounds massively:

| Investment | Annual Fee | Value of \\$100,000 after 30 years (8% gross return) |
|-----------|-----------|-----------------------------------------------------|
| Index fund | 0.04% | \\$983,000 |
| Active fund | 0.80% | \\$811,000 |
| Active fund with sales load | 1.20% | \\$728,000 |

The fee difference costs the active fund investor **\\$172,000 to \\$255,000** over 30 years on a \\$100,000 investment. Warren Buffett has called fees "the termites of investing."

### The Bogle Philosophy

Jack Bogle distilled his investment philosophy into a few principles:

1. **Keep costs low** -- every dollar in fees is a dollar not compounding
2. **Diversify broadly** -- own the entire market, not individual stocks
3. **Stay the course** -- do not try to time the market
4. **Simplicity wins** -- a three-fund portfolio beats most complex strategies

### The Three-Fund Portfolio

Many Bogleheads (followers of Bogle's philosophy) use a simple three-fund portfolio:

1. **U.S. Total Stock Market Index** (e.g., VTI or VTSAX)
2. **International Stock Market Index** (e.g., VXUS or VTIAX)
3. **U.S. Total Bond Market Index** (e.g., BND or VBTLX)

That is it. Three funds, rebalanced annually, with rock-bottom fees. It outperforms the vast majority of complex, expensive strategies.

### Key Takeaway

Index funds are not a compromise. They are the empirically validated, mathematically superior approach for the vast majority of investors. Low costs, broad diversification, and time in the market beat stock-picking and market-timing for all but the most skilled (or lucky) professionals.

> "Don't look for the needle in the haystack. Just buy the haystack." -- Jack Bogle

*Resources: A Random Walk Down Wall Street by Burton Malkiel, The Little Book of Common Sense Investing by Jack Bogle, SPIVA U.S. Scorecard (S&P Dow Jones Indices).*`,
    },
    {
      id: "iw-etf-vs-mutual-fund",
      slug: "etf-vs-mutual-fund",
      title: "ETFs vs Mutual Funds",
      content: `## ETFs vs Mutual Funds

<!-- voice:key_insight insight="ETFs and mutual funds are both baskets of securities. The difference is in how you buy them, how they are taxed, and how they are priced -- not in what they hold." -->

Exchange-Traded Funds (ETFs) and mutual funds are often confused or treated as fundamentally different products. In reality, they are two wrappers for the same underlying investments. Understanding the differences helps you choose the right vehicle for your situation.

### How They Differ

| Feature | Mutual Fund | ETF |
|---------|------------|-----|
| **Trading** | Once per day, at closing price | Throughout the day, like a stock |
| **Minimum investment** | Often \\$1,000-\\$3,000 | Price of one share (sometimes \\$1 with fractional shares) |
| **Expense ratios** | Generally higher | Generally lower |
| **Tax efficiency** | Less efficient (capital gains distributions) | More efficient (in-kind creation/redemption) |
| **Automatic investing** | Easy (set up recurring purchases) | Harder (must place manual orders) |
| **Purchase method** | Buy from fund company directly | Buy through a brokerage account |

### Tax Efficiency: Why ETFs Have an Edge

This is the single biggest structural advantage of ETFs. When mutual fund investors sell shares, the fund must sell securities to raise cash -- potentially triggering capital gains taxes for all remaining shareholders, even those who did not sell.

ETFs use an "in-kind" creation/redemption process that avoids this problem. Authorized participants exchange baskets of securities directly, so the ETF rarely needs to sell holdings and generate taxable events.

In a taxable brokerage account, this difference can save you 0.5-1.0% per year in tax drag.

<!-- voice:section_check concept="ETF vs mutual fund mechanics" -->

### When to Choose a Mutual Fund

- Your 401(k) or employer plan only offers mutual funds (most do)
- You want automatic dollar-cost averaging with recurring purchases
- You invest at Vanguard, Fidelity, or Schwab and their mutual funds have identical expense ratios to ETFs
- You have enough to meet the minimum investment

### When to Choose an ETF

- You invest in a taxable brokerage account (tax efficiency matters)
- You want intraday trading flexibility
- You do not have the minimum for the equivalent mutual fund
- You want access to niche markets (specific sectors, commodities, international)

### Vanguard's Unique Structure

Vanguard has a patented structure where their mutual funds and ETFs are different share classes of the same fund. This means Vanguard mutual funds are nearly as tax-efficient as ETFs -- a unique advantage that expires as the patent lapses.

### Popular Index Funds and Their ETF Equivalents

| Category | Vanguard Mutual Fund | Vanguard ETF | Expense Ratio |
|----------|---------------------|-------------|---------------|
| U.S. Total Stock | VTSAX | VTI | 0.03% |
| S&P 500 | VFIAX | VOO | 0.03% |
| International | VTIAX | VXUS | 0.07% |
| Total Bond | VBTLX | BND | 0.03% |

### The Bottom Line on Costs

The difference between a 0.03% and a 0.04% expense ratio is negligible. Do not spend hours optimizing for basis points. The far more important decisions are: (1) investing in low-cost index funds at all, (2) maintaining proper asset allocation, and (3) not selling during downturns.

### Key Takeaway

ETFs and mutual funds are tools, not religions. For most long-term investors, the choice between them is less important than the choice to invest in low-cost index funds in the first place. Use whichever is most convenient and cost-effective for your accounts.

> "The best investment vehicle is the one you will actually use consistently." -- Coach Morgan

*Resources: Investopedia ETF vs Mutual Fund, Vanguard Fund Comparison Tool, Morningstar Fund Screener.*`,
    },
    {
      id: "iw-checkpoint-4",
      slug: "iw-checkpoint-4",
      title: "Checkpoint: Index Funds & ETFs",
      content: `## Module 4 Checkpoint

<!-- voice:section_check concept="index funds and ETFs review" -->

Index funds and ETFs are the workhorses of modern investing. Let us confirm your understanding.

---

### Question 1 (Multiple Choice)

Over 20 years, what percentage of actively managed U.S. large-cap funds underperform the S&P 500 index?

- A) About 50%
- B) About 75%
- C) About 85%
- D) About 95%

<details>
<summary>Answer</summary>

**D) About 95%.** According to the SPIVA Scorecard, approximately 95% of actively managed large-cap funds underperform their benchmark index over 20 years. The primary reason is fees -- higher costs eat into returns year after year.
</details>

---

### Question 2 (Multiple Choice)

Why are ETFs generally more tax-efficient than mutual funds?

- A) ETFs pay no taxes at all
- B) ETFs use an in-kind creation/redemption process that avoids triggering capital gains
- C) ETF dividends are tax-free
- D) ETFs are exempt from SEC regulations

<details>
<summary>Answer</summary>

**B) ETFs use an in-kind creation/redemption process.** When mutual fund investors redeem shares, the fund must sell securities and potentially distribute taxable capital gains to all shareholders. ETFs avoid this by exchanging baskets of securities directly with authorized participants.
</details>

---

### Question 3 (Short Answer)

What is the "three-fund portfolio," and why is it recommended by Bogleheads?

<details>
<summary>Sample Answer</summary>

The three-fund portfolio consists of: (1) a U.S. total stock market index fund, (2) an international stock market index fund, and (3) a U.S. total bond market index fund. It is recommended because it provides broad diversification across the entire global market at minimal cost, requires only annual rebalancing, and historically outperforms the vast majority of more complex and expensive strategies.
</details>

---

### Question 4 (Application)

An investor has \\$100,000 and is choosing between an index fund (0.04% expense ratio) and an actively managed fund (0.80% expense ratio). Both earn 8% gross returns. How much more does the index fund investor have after 30 years?

<details>
<summary>Sample Answer</summary>

The index fund (0.04%) grows to approximately \\$983,000. The active fund (0.80%) grows to approximately \\$811,000. The difference is approximately \\$172,000 -- entirely due to fees. This illustrates why Buffett calls fees "the termites of investing."
</details>

---

### Question 5 (Multiple Choice)

Who founded Vanguard and created the first index fund available to individual investors?

- A) Warren Buffett
- B) Benjamin Graham
- C) John C. "Jack" Bogle
- D) Peter Lynch

<details>
<summary>Answer</summary>

**C) John C. "Jack" Bogle.** Bogle launched the First Index Investment Trust in 1976. Wall Street mocked it as "Bogle's Folly," but it became the foundation of a revolution that now manages over \\$11 trillion in index fund assets.
</details>

---

You have completed Module 4. Next up: real estate -- another major asset class with unique characteristics and opportunities.`,
    },
  ],
};
