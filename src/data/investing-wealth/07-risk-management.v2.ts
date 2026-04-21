import { Module } from "../types";

export const riskManagementModule: Module = {
  id: "iw-risk-management",
  title: "Risk Management & Diversification",
  description: "Learn the science of diversification, asset allocation strategies, rebalancing, and behavioral pitfalls that destroy investor returns. Resources: Modern Portfolio Theory (Markowitz), Vanguard Asset Allocation Research, Thinking Fast and Slow by Daniel Kahneman.",
  lessons: [
    {
      id: "iw-diversification",
      slug: "diversification-science",
      title: "The Science of Diversification",
      content: `## The Science of Diversification

<!-- voice:key_insight insight="Diversification is the only free lunch in investing. It reduces risk without proportionally reducing expected returns -- and the math proves it." -->

In 1952, a 25-year-old Ph.D. student named Harry Markowitz published a paper titled "Portfolio Selection" in the Journal of Finance. It introduced **Modern Portfolio Theory (MPT)** and eventually won him the Nobel Prize. The core insight was revolutionary: the risk of a portfolio depends not just on the risk of each individual asset, but on how those assets move relative to each other.

### Correlation: The Key Concept

**Correlation** measures how two assets move in relation to each other, on a scale from -1 to +1:

| Correlation | Meaning | Example |
|-------------|---------|---------|
| +1.0 | Move in perfect lockstep | Two S&P 500 index funds |
| +0.5 | Generally move together | U.S. stocks and international stocks |
| 0.0 | No relationship | Stocks and weather |
| -0.5 | Generally move opposite | Stocks and Treasury bonds (historically) |
| -1.0 | Move in perfect opposition | Rare in practice |

The magic of diversification happens when you combine assets with low or negative correlations. When one zigs, the other zags, smoothing your overall portfolio returns.

### Real-World Diversification

Consider a portfolio of just U.S. stocks vs a diversified portfolio:

| Year | S&P 500 | International Stocks | Bonds | 60/30/10 Blend |
|------|---------|---------------------|-------|----------------|
| 2008 | -37.0% | -43.4% | +5.2% | -26.1% |
| 2009 | +26.5% | +31.8% | +5.9% | +22.7% |
| 2022 | -18.1% | -16.0% | -13.0% | -16.7% |

In most years, the diversified blend experiences smaller losses during downturns while capturing most of the upside.

<!-- voice:section_check concept="correlation and diversification benefits" -->

### How Many Stocks Is Enough?

Research by Elton and Gruber (1977) showed that portfolio risk decreases rapidly as you add stocks:

| Number of Stocks | Portfolio Risk (Standard Deviation) |
|------------------|-------------------------------------|
| 1 | 49.2% |
| 5 | 27.0% |
| 10 | 23.2% |
| 20 | 21.7% |
| 30 | 20.9% |
| 500+ (index) | 19.2% |

The biggest risk reduction comes from going from 1 stock to about 20-30 stocks. Beyond that, adding more stocks provides diminishing benefits. An index fund gives you maximum diversification automatically.

### Diversification Across Asset Classes

Within-stock diversification is not enough. True portfolio diversification means spreading across **asset classes**:

- U.S. stocks (large, mid, small cap)
- International stocks (developed + emerging markets)
- Bonds (government + corporate)
- Real estate (REITs)
- Cash equivalents

Each asset class responds differently to economic conditions. Stocks thrive during growth, bonds during recessions, real estate during inflation, and cash during deflation.

### What Diversification Cannot Do

Diversification reduces **unsystematic risk** (risk specific to one company or sector) but cannot eliminate **systematic risk** (market-wide risk). When the entire market crashes, all correlated assets fall together. The 2008 financial crisis and 2020 COVID crash affected virtually every asset class simultaneously, though to different degrees.

### Key Takeaway

Diversification is not optional -- it is the mathematically proven method for reducing portfolio risk without sacrificing expected returns. The easiest way to achieve it: own a total market index fund (stocks), a total bond market fund (bonds), and an international fund (global exposure).

> "Diversification is protection against ignorance. It makes little sense if you know what you are doing." -- Warren Buffett (who also admits most investors should just buy index funds)

*Resources: Harry Markowitz, "Portfolio Selection" (Journal of Finance, 1952), Vanguard Asset Allocation Model, Investopedia Diversification Guide.*`,
    },
    {
      id: "iw-asset-allocation-rebalancing",
      slug: "asset-allocation-rebalancing",
      title: "Asset Allocation & Rebalancing",
      content: `## Asset Allocation & Rebalancing

<!-- voice:key_insight insight="Asset allocation -- how you divide your money among stocks, bonds, and other assets -- determines roughly 90% of your portfolio's return variability. It is the most important investment decision you make." -->

A landmark 1986 study by Brinson, Hood, and Beebower (updated in 1991) analyzed 91 large pension funds over a decade. Their finding: **asset allocation explained approximately 91.5% of the variation in portfolio returns.** Individual stock selection and market timing explained less than 9%.

### Model Portfolios by Risk Tolerance

| Profile | Stocks | Bonds | Expected Return | Max Drawdown |
|---------|--------|-------|-----------------|-------------|
| Conservative | 30% | 70% | ~6-7% | ~-15% |
| Moderate | 50% | 50% | ~7-8% | ~-22% |
| Balanced | 60% | 40% | ~8-9% | ~-27% |
| Growth | 80% | 20% | ~9-10% | ~-35% |
| Aggressive | 100% | 0% | ~10-11% | ~-43% |

Your ideal allocation depends on your time horizon, risk tolerance, and financial goals. A 25-year-old saving for retirement in 40 years can afford to be aggressive. A 60-year-old five years from retirement should be moderate or conservative.

### Target-Date Funds: Autopilot Allocation

Target-date funds (e.g., Vanguard Target Retirement 2055) automatically adjust your allocation as you age. They start aggressive (90%+ stocks) and gradually shift toward bonds as the target date approaches. This "glide path" is ideal for investors who want a set-it-and-forget-it approach.

Vanguard's target-date funds charge approximately 0.12% in fees and handle all rebalancing automatically.

<!-- voice:section_check concept="asset allocation importance and model portfolios" -->

### Why Rebalancing Matters

Over time, your portfolio drifts from its target allocation as different assets grow at different rates. If stocks surge, your 60/40 portfolio might become 75/25 -- taking on more risk than you intended.

**Rebalancing** means selling some of what has grown and buying more of what has lagged to return to your target allocation. It sounds counterintuitive (selling winners and buying losers), but it enforces a disciplined buy-low, sell-high behavior.

### Rebalancing Methods

**Calendar rebalancing:** Check and rebalance at fixed intervals (annually or semi-annually). Simple and effective.

**Threshold rebalancing:** Rebalance whenever any asset class drifts more than 5% from its target. For example, if your stock target is 60% and it reaches 65%, you rebalance.

Vanguard research shows that annual or semi-annual rebalancing is sufficient. More frequent rebalancing incurs unnecessary transaction costs and taxes with minimal benefit.

### Tax-Efficient Rebalancing

In taxable accounts, selling appreciated assets triggers capital gains taxes. Minimize this by:

1. **Rebalancing with new contributions** -- direct new money into underweight asset classes
2. **Rebalancing in tax-advantaged accounts** (401k, IRA) where there are no tax consequences
3. **Tax-loss harvesting** -- selling losers to offset gains from rebalancing

### Key Takeaway

Choose an asset allocation that matches your time horizon and risk tolerance, then rebalance annually. This simple discipline -- combined with low-cost index funds -- outperforms the vast majority of complex, expensive strategies.

> "The asset allocation decision is the most important decision you will make as an investor. Everything else is noise." -- Coach Morgan

*Resources: Brinson, Hood & Beebower (1986), "Determinants of Portfolio Performance," Vanguard Target-Date Fund Methodology, Bogleheads Asset Allocation Guide.*`,
    },
    {
      id: "iw-behavioral-pitfalls",
      slug: "behavioral-pitfalls",
      title: "Behavioral Pitfalls That Destroy Returns",
      content: `## Behavioral Pitfalls That Destroy Returns

<!-- voice:key_insight insight="The average stock fund investor earned 6.81% annually over 20 years while the S&P 500 returned 9.65%. The gap is not fees -- it is behavior." -->

DALBAR's annual Quantitative Analysis of Investor Behavior consistently finds that the average investor significantly underperforms the very funds they invest in. Over the 20-year period ending 2023, the average equity fund investor earned approximately 6.81% while the S&P 500 returned 9.65%. That 2.84% annual gap compounds into a massive wealth difference.

The reason: **behavioral errors**. Human psychology is wired for survival, not investing. The same instincts that kept our ancestors alive on the savannah sabotage our portfolios.

### The Big Five Behavioral Traps

**1. Loss Aversion**

Nobel laureate Daniel Kahneman's research showed that people feel the pain of losses roughly 2x more intensely than the pleasure of equivalent gains. A \\$10,000 loss hurts twice as much as a \\$10,000 gain feels good. This makes investors sell during downturns (crystallizing losses) and hold losing positions too long (hoping to "break even").

**2. Recency Bias**

We overweight recent events. After a bull market, investors pile in expecting more gains. After a crash, they sell expecting more losses. This creates the devastating pattern of buying high and selling low.

**3. Herd Mentality**

When everyone is buying (dot-com bubble, crypto mania), we feel safe following the crowd. When everyone is panicking (2008, March 2020), we feel compelled to flee. The crowd is usually wrong at extremes.

<!-- voice:section_check concept="behavioral investing pitfalls" -->

**4. Overconfidence**

Studies by Brad Barber and Terrance Odean at UC Davis found that individual investors who traded most frequently earned the lowest returns. Men traded 45% more than women and earned 1.4% less per year. Overconfidence in one's stock-picking or market-timing ability is inversely correlated with actual performance.

**5. Anchoring**

Investors anchor to irrelevant reference points -- the price they paid for a stock, an all-time high, a round number. These anchors have no bearing on a stock's future value but heavily influence buying and selling decisions.

### The Solution: Systems Over Willpower

You cannot eliminate behavioral biases. But you can design systems that prevent them from destroying your returns:

| Trap | System/Solution |
|------|----------------|
| Loss aversion | Automate investments; do not check portfolio daily |
| Recency bias | Write an Investment Policy Statement and follow it |
| Herd mentality | Stick to index funds; ignore financial media |
| Overconfidence | Use index funds; stop picking individual stocks |
| Anchoring | Base decisions on fundamentals, not purchase price |

### The Investment Policy Statement

Write a one-page document that specifies:
- Your target asset allocation
- When you will rebalance (e.g., annually)
- What you will do during a market crash (nothing, or buy more)
- What you will NOT do (panic sell, chase trends, time the market)

Sign it. Tape it to your monitor. Read it every time you feel the urge to deviate.

### Key Takeaway

Your biggest investment risk is not the market -- it is yourself. The gap between fund returns and investor returns is almost entirely behavioral. Build automated systems, follow a written plan, and resist the urge to "do something" when markets swing wildly.

> "The investor's chief problem -- and even his worst enemy -- is likely to be himself." -- Benjamin Graham

*Resources: DALBAR Quantitative Analysis of Investor Behavior, Thinking Fast and Slow by Daniel Kahneman, Barber & Odean "Trading is Hazardous to Your Wealth" (2000).*`,
    },
    {
      id: "iw-checkpoint-7",
      slug: "iw-checkpoint-7",
      title: "Checkpoint: Risk Management & Diversification",
      content: `## Module 7 Checkpoint

<!-- voice:section_check concept="risk management and diversification review" -->

Managing risk is how you keep the wealth you build. Let us test your understanding.

---

### Question 1 (Multiple Choice)

According to the Brinson, Hood, and Beebower study, what percentage of portfolio return variability is explained by asset allocation?

- A) About 50%
- B) About 70%
- C) About 91.5%
- D) About 99%

<details>
<summary>Answer</summary>

**C) About 91.5%.** Their landmark 1986 study found that asset allocation explained approximately 91.5% of return variability across 91 pension funds. Stock selection and market timing together explained less than 9%.
</details>

---

### Question 2 (Short Answer)

What is the difference between unsystematic risk and systematic risk? Which can diversification eliminate?

<details>
<summary>Sample Answer</summary>

Unsystematic risk is specific to a single company or sector (e.g., a CEO scandal, a product recall). Systematic risk affects the entire market (e.g., a recession, a pandemic). Diversification effectively eliminates unsystematic risk by spreading across many companies and sectors. It cannot eliminate systematic risk -- when the whole market crashes, diversified portfolios still lose value, though typically less than concentrated ones.
</details>

---

### Question 3 (Multiple Choice)

According to DALBAR, the average equity fund investor earned approximately what annual return over 20 years, compared to the S&P 500's ~9.65%?

- A) 9.65% (matched the index)
- B) 8.50%
- C) 6.81%
- D) 4.25%

<details>
<summary>Answer</summary>

**C) 6.81%.** The 2.84% annual gap is almost entirely due to behavioral errors -- buying high, selling low, and trading too frequently. This gap compounds into hundreds of thousands of dollars of lost wealth over a career.
</details>

---

### Question 4 (Application)

Your portfolio target is 70% stocks / 30% bonds. After a strong stock market year, your portfolio is now 82% stocks / 18% bonds. What should you do, and why?

<details>
<summary>Sample Answer</summary>

You should rebalance back to 70/30 by selling some stocks and buying bonds. This serves two purposes: (1) it returns your portfolio to a risk level consistent with your plan, and (2) it enforces buy-low, sell-high discipline -- you are selling stocks after they have risen and buying bonds while they are relatively cheap. In tax-advantaged accounts, rebalance directly. In taxable accounts, consider directing new contributions into bonds to minimize taxable events.
</details>

---

### Question 5 (Multiple Choice)

Which behavioral bias causes investors to feel the pain of losses approximately twice as intensely as the pleasure of equivalent gains?

- A) Recency bias
- B) Anchoring
- C) Herd mentality
- D) Loss aversion

<details>
<summary>Answer</summary>

**D) Loss aversion.** Identified by Daniel Kahneman and Amos Tversky, loss aversion explains why investors are more likely to panic-sell during downturns than to buy during dips. The emotional weight of losses disproportionately drives behavior.
</details>

---

You have completed Module 7. Time for the capstone: building your actual investment portfolio.`,
    },
  ],
};
