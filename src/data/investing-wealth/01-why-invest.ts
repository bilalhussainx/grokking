import { Module } from "../types";

export const whyInvestModule: Module = {
  id: "iw-why-invest",
  title: "Why Invest?",
  description:
    "Understand why investing is essential for wealth building, how inflation erodes purchasing power, and the fundamental difference between saving and investing. Resources: Vanguard Research, Investopedia, A Random Walk Down Wall Street by Burton Malkiel.",
  lessons: [
    {
      id: "iw-saving-vs-investing",
      slug: "saving-vs-investing",
      title: "Saving vs Investing: The Critical Difference",
      content: `## Saving vs Investing: The Critical Difference

<!-- voice:key_insight insight="Saving preserves capital; investing grows it. Understanding the distinction is the first step toward building real wealth." -->

Most people conflate saving and investing. They are not the same thing, and confusing them is one of the costliest financial mistakes you can make.

### Saving: Capital Preservation

Saving means setting money aside in a low-risk, easily accessible vehicle -- a savings account, money market fund, or certificate of deposit (CD). The goal is **capital preservation**. Your \\\$10,000 stays \\\$10,000 (plus modest interest).

As of 2024, high-yield savings accounts offer roughly 4.5-5.0% APY. That sounds decent -- until you factor in inflation.

### The Inflation Problem

The U.S. Bureau of Labor Statistics reports average annual inflation of approximately 3.2% since 1926. In some decades it has been much higher -- the 1970s saw inflation exceed 13%. Here is what inflation does to your savings:

| Time Period | \\$100,000 in Savings (2% return) | Purchasing Power (3% inflation) | Real Value |
|-------------|-----------------------------------|--------------------------------|------------|
| 10 years | \\$121,899 | Eroded by ~26% | ~\\$90,000 |
| 20 years | \\$148,595 | Eroded by ~45% | ~\\$82,000 |
| 30 years | \\$181,136 | Eroded by ~59% | ~\\$74,000 |

Even when your nominal balance grows, your **real purchasing power** declines if returns do not outpace inflation. This is why Coach Morgan calls savings accounts "slow-motion wealth destruction."

### Investing: Capital Growth

Investing means deploying money into assets -- stocks, bonds, real estate, funds -- that carry higher risk but offer the potential for returns that **exceed inflation**. The S&P 500 has returned an average of approximately 10.3% per year (nominal) since 1926, or roughly 7% after inflation, according to data compiled by NYU Stern professor Aswath Damodaran.

That same \\\$100,000 invested in a diversified stock portfolio:

| Time Period | \\$100,000 at 7% Real Return |
|-------------|------------------------------|
| 10 years | \\$196,715 |
| 20 years | \\$386,968 |
| 30 years | \\$761,226 |

The difference between saving and investing over 30 years: **\\$74,000 vs \\$761,000**. That is not a rounding error -- it is a fundamentally different financial outcome.

<!-- voice:section_check concept="saving vs investing distinction" -->

### When to Save vs When to Invest

Both have their place:

**Save when:**
- You need the money within 1-2 years
- You are building an emergency fund (3-6 months of expenses)
- The money is earmarked for a specific short-term purchase

**Invest when:**
- Your time horizon is 5+ years
- You have already built an emergency fund
- You are building long-term wealth (retirement, financial independence)

### The Cost of Waiting

Vanguard research shows that for every decade you delay investing, you roughly need to double your monthly contribution to reach the same retirement goal. A 25-year-old needs to invest about \\$300/month to reach \\$1 million by 65 at 8% returns. A 35-year-old needs \\$670. A 45-year-old needs \\$1,500.

### Key Takeaway

Saving is necessary for stability. Investing is necessary for wealth. If you only save, inflation quietly eats your purchasing power. If you invest with a long time horizon and diversified strategy, compound returns build wealth that savings accounts simply cannot match.

> "The biggest risk is not losing money. The biggest risk is running out of time." -- Coach Morgan

*Resources: Vanguard Principles for Investing Success, NYU Stern Historical Returns Database, Investopedia Saving vs Investing Guide.*`,
    },
    {
      id: "iw-risk-and-return",
      slug: "risk-and-return",
      title: "Risk and Return: The Fundamental Tradeoff",
      content: `## Risk and Return: The Fundamental Tradeoff

<!-- voice:key_insight insight="Higher potential returns always come with higher risk. Understanding this tradeoff is the foundation of every investment decision." -->

In investing, there is no free lunch. Every asset class sits somewhere on the risk-return spectrum, and understanding where -- and why -- is essential before you invest a single dollar.

### What Is Investment Risk?

Risk is the possibility that your actual returns will differ from your expected returns. It comes in several flavors:

| Risk Type | Description | Example |
|-----------|-------------|---------|
| **Market risk** | Broad market declines | S&P 500 drops 37% in 2008 |
| **Inflation risk** | Returns fail to outpace inflation | Bonds yielding 2% during 4% inflation |
| **Liquidity risk** | Cannot sell quickly without loss | Real estate during a market freeze |
| **Concentration risk** | Too much in one asset | Enron employees with 100% company stock |
| **Sequence risk** | Bad returns early in retirement | 30% drop in first year of withdrawals |

### The Risk-Return Spectrum

Historical data from 1926-2023 (Ibbotson Associates, via Morningstar) shows a clear pattern:

| Asset Class | Avg Annual Return | Worst Single Year | Best Single Year |
|------------|-------------------|-------------------|------------------|
| Treasury Bills | ~3.3% | ~0% | ~14.7% |
| Government Bonds | ~5.2% | -14.9% | 45.5% |
| Corporate Bonds | ~5.9% | -8.1% | 42.6% |
| Large-Cap Stocks (S&P 500) | ~10.3% | -43.1% (1931) | 54.0% (1933) |
| Small-Cap Stocks | ~11.8% | -58.0% | 142.9% |

<!-- voice:section_check concept="risk-return tradeoff" -->

The pattern is unmistakable: assets with higher average returns experience larger swings. This is the **equity risk premium** -- the extra return investors demand for tolerating volatility.

### Volatility Is Not the Same as Loss

This is one of the most misunderstood concepts in investing. A stock portfolio that drops 30% in a year has experienced **volatility**. It only becomes a **loss** if you sell. The S&P 500 has recovered from every single downturn in its history -- including the Great Depression, the 2008 financial crisis, and the 2020 COVID crash. Recovery times vary, but the pattern holds.

Warren Buffett captured this perfectly:

> "The stock market is a device for transferring money from the impatient to the patient."

### Your Risk Tolerance vs Your Risk Capacity

**Risk tolerance** is psychological -- how much volatility can you stomach without panicking and selling?

**Risk capacity** is financial -- how much can you actually afford to lose given your time horizon, income stability, and financial obligations?

A 28-year-old with a stable job and 37 years until retirement has high risk capacity even if their risk tolerance is low. A 62-year-old three years from retirement has low risk capacity regardless of tolerance.

### The Risk of Playing It Too Safe

Paradoxically, the "safest" option -- keeping everything in savings -- carries its own risk: **inflation risk**. Over 30 years, a pure-savings strategy virtually guarantees that your purchasing power erodes. The real risk is not short-term volatility; it is long-term inadequacy.

### Key Takeaway

Risk and return are inseparable. The goal is not to eliminate risk but to take **appropriate risk** given your time horizon, financial situation, and goals. Understand what kinds of risk you face, and do not confuse short-term volatility with permanent loss.

> "Risk is not knowing what you are doing." -- Warren Buffett

*Resources: Morningstar Ibbotson SBBI Yearbook, Vanguard Investor Questionnaire, Investopedia Risk-Return Tradeoff.*`,
    },
    {
      id: "iw-power-of-compounding",
      slug: "power-of-compounding-investments",
      title: "The Power of Compounding in Investments",
      content: `## The Power of Compounding in Investments

<!-- voice:key_insight insight="Compound growth is exponential, not linear. Time in the market is the single most powerful variable an investor controls." -->

You may have encountered compound interest in the context of savings accounts. In investing, the same principle operates on a dramatically larger scale -- because investment returns compound on returns, dividends reinvest into more shares, and the growth curve steepens with every passing year.

### How Compounding Works in Stocks

When you invest in a stock index fund, you earn returns in two ways: **price appreciation** (the stock price goes up) and **dividends** (companies distribute a share of profits). If you reinvest those dividends -- buying more shares -- those new shares also earn returns, which also produce dividends, which also buy more shares. This is the compounding engine.

### The S&P 500: A Case Study

According to data from NYU Stern, \\$1,000 invested in the S&P 500 at the start of 1950:

| Year | Value (dividends reinvested) | Value (no reinvestment) |
|------|------------------------------|------------------------|
| 1960 | \\$3,243 | \\$2,107 |
| 1980 | \\$23,174 | \\$8,127 |
| 2000 | \\$442,536 | \\$89,034 |
| 2023 | \\$2,485,516 | \\$301,476 |

Dividend reinvestment accounts for over **80% of total returns** over this period. The compounding effect is not a minor enhancement -- it is the majority of long-term wealth creation.

<!-- voice:section_check concept="compound growth in equity markets" -->

### Warren Buffett's Snowball

Warren Buffett, who began investing at age 11 and is now worth over \\$130 billion, famously describes compounding as a snowball:

> "Life is like a snowball. All you need is wet snow and a really long hill."

The "wet snow" is a reasonable rate of return. The "long hill" is time. What most people miss is that over 97% of Buffett's wealth was accumulated after his 65th birthday. The early decades built the snowball; the later decades unleashed the exponential curve.

| Buffett's Age | Approximate Net Worth |
|---------------|----------------------|
| 30 | \\$1 million |
| 40 | \\$25 million |
| 50 | \\$67 million |
| 60 | \\$3.8 billion |
| 70 | \\$36 billion |
| 80 | \\$47 billion |
| 93 | \\$130+ billion |

### The Math of Starting Early

Consider two investors, each earning 8% annual returns:

**Investor A** invests \\$500/month from age 22 to 32 (10 years), then stops. Total invested: \\$60,000.

**Investor B** invests \\$500/month from age 32 to 62 (30 years). Total invested: \\$180,000.

At age 62:
- **Investor A**: ~\\$1,010,000
- **Investor B**: ~\\$745,000

Investor A invested one-third as much money but ended up with more, because those extra 10 years of compounding at the front end created an insurmountable head start.

### Practical Implication

The most important investment decision you can make is not *what* to invest in -- it is *when* to start. Every year of delay costs you exponentially more than the previous one.

### Key Takeaway

Compounding is the most powerful force in investing. It rewards consistency and patience above all else. Reinvest dividends, start as early as possible, and let time do the heavy lifting. The hill matters more than the snowball.

> "The first rule of compounding: never interrupt it unnecessarily." -- Charlie Munger

*Resources: NYU Stern Historical Returns Data, Berkshire Hathaway Annual Letters, Vanguard Compounding Calculator.*`,
    },
    {
      id: "iw-asset-classes-overview",
      slug: "asset-classes-overview",
      title: "Asset Classes: The Building Blocks",
      content: `## Asset Classes: The Building Blocks

<!-- voice:key_insight insight="Every investment portfolio is assembled from a handful of core asset classes. Understanding what each one does -- and when -- is the key to intelligent allocation." -->

Before you invest a dollar, you need to understand the raw materials. Every investment portfolio is built from a few fundamental asset classes, each with distinct characteristics, risk profiles, and roles.

### The Four Core Asset Classes

| Asset Class | What You Own | Risk Level | Expected Return | Role in Portfolio |
|------------|-------------|-----------|-----------------|-------------------|
| **Stocks (Equities)** | Fractional ownership in companies | High | 8-10% long-term | Growth engine |
| **Bonds (Fixed Income)** | Loans to governments or corporations | Low-Medium | 3-5% long-term | Stability, income |
| **Real Estate** | Property or REITs | Medium-High | 7-10% long-term | Income, inflation hedge |
| **Cash & Equivalents** | Savings, CDs, money market | Very Low | 2-4% | Liquidity, safety net |

### Stocks: The Growth Engine

When you buy a share of stock, you own a tiny piece of a company. If the company grows its profits, your share becomes more valuable. Stocks have historically been the highest-returning major asset class -- the S&P 500 has averaged approximately 10.3% annually since 1926.

But that return comes with volatility. In 2008, the S&P 500 fell 37%. In 2020, it dropped 34% in a single month before recovering. Stocks reward patience and punish panic.

**Sub-categories:**
- Large-cap (Apple, Microsoft) -- more stable
- Mid-cap -- moderate growth potential
- Small-cap -- higher growth potential, more volatility
- International developed (Europe, Japan)
- Emerging markets (China, India, Brazil) -- highest growth potential, highest risk

### Bonds: The Stabilizer

When you buy a bond, you are lending money to a government or corporation in exchange for regular interest payments and the return of your principal at maturity. Bonds are less volatile than stocks but offer lower returns.

**Sub-categories:**
- U.S. Treasury bonds -- backed by the U.S. government, essentially risk-free
- Municipal bonds -- issued by state/local governments, often tax-exempt
- Corporate bonds -- issued by companies, higher yield, higher risk
- High-yield ("junk") bonds -- issued by lower-rated companies, highest yield and risk

<!-- voice:section_check concept="core asset classes" -->

### Real Estate

Real estate generates returns through **rental income** and **property appreciation**. You can invest directly (buying property) or indirectly through Real Estate Investment Trusts (REITs), which trade like stocks.

According to the National Association of Realtors, U.S. median home prices have appreciated roughly 5-6% annually over the long term. Add rental income, and total returns can rival stocks -- but with significant illiquidity and management overhead.

### Cash and Equivalents

Cash is king for liquidity and short-term needs. It includes high-yield savings accounts, money market funds, and short-term CDs. The returns barely keep pace with inflation, but cash plays a critical role: it is your emergency reserve and your "dry powder" for buying opportunities during market downturns.

### Alternative Asset Classes

Beyond the four core categories, experienced investors may allocate small portions to:

- **Commodities** (gold, oil, agricultural products)
- **Cryptocurrencies** (highly speculative, extreme volatility)
- **Private equity** (investing in non-public companies)
- **Collectibles** (art, wine, vintage cars -- illiquid and subjective)

For most investors, these are seasoning, not the main course.

### Key Takeaway

Every portfolio is built from stocks, bonds, real estate, and cash. Each asset class serves a distinct purpose -- growth, stability, income, or liquidity. Understanding these building blocks allows you to construct a portfolio that matches your goals and risk tolerance.

> "Do not put all your eggs in one basket -- but also make sure you have the right baskets." -- Coach Morgan

*Resources: Vanguard Asset Class Overview, Morningstar Asset Class Returns, Investopedia Guide to Asset Classes.*`,
    },
    {
      id: "iw-checkpoint-1",
      slug: "iw-checkpoint-1",
      title: "Checkpoint: Why Invest?",
      content: `## Module 1 Checkpoint

<!-- voice:section_check concept="module 1 review" -->

Excellent work completing the first module. Before we dive into the stock market, let us verify your understanding of the core investment principles.

---

### Question 1 (Multiple Choice)

What is the primary reason savings accounts are insufficient for long-term wealth building?

- A) Banks charge high fees on savings accounts
- B) Savings account interest rates typically fail to outpace inflation
- C) The FDIC does not insure savings accounts
- D) Savings accounts have annual contribution limits

<details>
<summary>Answer</summary>

**B) Savings account interest rates typically fail to outpace inflation.** Over long periods, inflation erodes purchasing power faster than most savings accounts can grow it. This is why investing -- with returns that historically exceed inflation -- is essential for wealth building.
</details>

---

### Question 2 (Multiple Choice)

The S&P 500 has averaged approximately what annual return since 1926?

- A) 5.3%
- B) 7.3%
- C) 10.3%
- D) 15.3%

<details>
<summary>Answer</summary>

**C) 10.3% (nominal).** After adjusting for inflation, the real return is approximately 7%. This data comes from NYU Stern's historical returns database.
</details>

---

### Question 3 (Short Answer)

Explain the difference between risk tolerance and risk capacity. Why might they point toward different investment strategies?

<details>
<summary>Sample Answer</summary>

Risk tolerance is psychological -- it measures how much volatility you can emotionally handle without panic-selling. Risk capacity is financial -- it measures how much loss you can objectively afford given your time horizon, income stability, and obligations. A young professional with a stable job might have high risk capacity (decades until retirement) but low risk tolerance (anxiety about market drops). Ideally, education increases risk tolerance to align with risk capacity, but the two should both factor into asset allocation decisions.
</details>

---

### Question 4 (Application)

Two investors both start with \\$0 and earn 8% annually. Investor A contributes \\$400/month for 10 years (ages 25-35), then stops. Investor B contributes \\$400/month for 25 years (ages 35-60). Who has more at age 60, and why?

<details>
<summary>Sample Answer</summary>

Investor A will likely have more despite investing for only 10 years and contributing less total money. Investor A's contributions had 25-35 additional years to compound after contributions stopped, giving those early dollars an enormous compounding runway. Investor B started later, and even 25 years of contributions cannot overcome the head start that Investor A's early compounding provided. This demonstrates that time in the market matters more than the total amount invested.
</details>

---

### Question 5 (Multiple Choice)

Which asset class has historically provided the highest average annual returns over long periods?

- A) Government bonds
- B) Corporate bonds
- C) Large-cap stocks
- D) Small-cap stocks

<details>
<summary>Answer</summary>

**D) Small-cap stocks**, with approximately 11.8% average annual returns since 1926, slightly outperforming large-cap stocks (~10.3%). However, small-cap stocks also exhibit the highest volatility, consistent with the risk-return tradeoff.
</details>

---

You have completed Module 1. In Module 2, we will explore the stock market -- how it works, what drives prices, and how to read the numbers that matter.`,
    },
  ],
};
