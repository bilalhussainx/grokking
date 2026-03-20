import { Module } from "../types";

export const savingInvestingModule: Module = {
  id: "pf-saving",
  title: "Saving & Investing",
  description:
    "Transition from saving to investing — learn about asset classes, index funds, dollar-cost averaging, and building a portfolio. Resources: Investopedia, Bogleheads Wiki, Khan Academy, A Random Walk Down Wall Street by Burton Malkiel.",
  lessons: [
    {
      id: "pf-savings-accounts-cds",
      slug: "savings-accounts-cds",
      title: "Savings Accounts & CDs",
      content: `## Savings Accounts & CDs

Before you invest, you need a solid savings foundation. Savings accounts and certificates of deposit (CDs) are the safest places to park money you cannot afford to lose. They serve different purposes than investments.

### Savings Accounts

A savings account is a deposit account at a bank or credit union that pays interest on your balance. Your money is liquid — you can withdraw it anytime.

**Types of Savings Accounts:**

| Type | Typical APY (2024) | Features |
|------|-------------------|----------|
| Traditional (big bank) | 0.01-0.10% | Branch access, often low minimums |
| High-Yield (online) | 4.00-5.25% | No branches, FDIC insured, higher rates |
| Money Market Account | 3.50-5.00% | Check-writing, debit card, tiered rates |

The difference between a traditional and high-yield savings account is staggering. On a \\\$10,000 balance:
- Traditional (0.05% APY): \\\$5/year in interest
- High-Yield (5.00% APY): \\\$500/year in interest

**That is 100 times more** for the same FDIC-insured safety.

### FDIC Insurance

The Federal Deposit Insurance Corporation (FDIC) insures deposits up to **\\\$250,000 per depositor, per bank, per ownership category**. This means even if the bank fails, your money is guaranteed by the U.S. government. Credit unions have equivalent coverage through the NCUA.

### Certificates of Deposit (CDs)

A CD locks your money for a fixed term (3 months to 5 years) in exchange for a guaranteed interest rate. The longer the term, the higher the rate — typically.

**Current CD Landscape (2024):**

| Term | Typical APY |
|------|------------|
| 3 months | 4.50-5.00% |
| 6 months | 4.75-5.25% |
| 1 year | 4.50-5.00% |
| 2 years | 4.00-4.50% |
| 5 years | 3.75-4.25% |

**Early withdrawal penalty:** If you withdraw before the term ends, you pay a penalty — typically 3-6 months of interest. This is the trade-off for the guaranteed rate.

### CD Laddering Strategy

A CD ladder lets you earn higher rates while maintaining periodic liquidity:

1. Divide \\\$10,000 into five equal parts
2. Buy CDs of 1, 2, 3, 4, and 5-year terms (\\\$2,000 each)
3. When the 1-year CD matures, reinvest it in a new 5-year CD
4. Now you have a CD maturing every year, plus you earn the higher 5-year rates

This strategy balances the higher yields of long-term CDs with the flexibility of having money become available annually.

### Real-World Example: When to Use Which

**Emergency fund (\\\$15,000):** High-yield savings account. You need instant access.

**Known expense in 6 months (vacation \\\$3,000):** 6-month CD or HYSA. Lock in a rate if the CD pays more.

**Down payment in 2 years (\\\$40,000):** CD ladder or HYSA. The money must be safe and available on your timeline.

**Retirement in 30 years:** NOT a savings account or CD. Inflation will erode your purchasing power. This money needs to be invested (covered in next lessons).

### Savings vs Investing: The Key Distinction

| Feature | Savings | Investing |
|---------|---------|-----------|
| Risk | None (FDIC insured) | Market risk |
| Returns | 0-5% | 7-10% historical average |
| Liquidity | Immediate | May take days; may lose value |
| Best for | Short-term goals, emergency fund | Long-term goals (5+ years) |
| Inflation impact | May lose purchasing power | Historically outpaces inflation |

### The Inflation Problem

With inflation averaging 3% historically, a savings account earning 2% actually **loses** 1% in purchasing power per year. \\\$10,000 earning 2% grows to \\\$10,200, but if prices rose 3%, you need \\\$10,300 to buy the same goods. You are falling behind.

This is why savings accounts are for short-term needs and investing is for long-term wealth building.

### Key Takeaway

Savings accounts and CDs are essential for short-term goals and emergency funds — they provide safety, liquidity, and guaranteed returns. But they are not wealth-building tools. Use high-yield savings accounts (not traditional), consider CD ladders for medium-term goals, and recognize that money you will not need for 5+ years should be invested to outpace inflation.

*Resources: Bankrate Best Savings Rates, FDIC.gov, Investopedia CD Ladder Strategy, NerdWallet Savings Calculator.*`,
    },
    {
      id: "pf-intro-to-investing",
      slug: "intro-to-investing",
      title: "Introduction to Investing",
      content: `## Introduction to Investing

Investing is putting money to work with the expectation of earning a return over time. It is how ordinary people build wealth that savings alone cannot achieve. This lesson introduces the major asset classes and foundational concepts every investor needs.

### Why Invest?

The math is simple but powerful. Assume you save \\\$500/month for 30 years:

| Strategy | Annual Return | Result After 30 Years |
|----------|-------------|---------------------|
| Under the mattress | 0% | \\\$180,000 |
| Savings account | 2% | \\\$244,692 |
| Bond portfolio | 5% | \\\$416,129 |
| Stock market | 8% | \\\$745,180 |
| Aggressive growth | 10% | \\\$1,130,244 |

Same contribution, radically different outcomes. The difference is compounding returns.

### The Major Asset Classes

**Stocks (Equities):** Ownership shares in a company. When the company grows, your shares grow in value. Stocks also may pay **dividends** — a share of profits distributed to owners.

- Historical average return: 10% per year (S&P 500, before inflation)
- Risk: High short-term volatility; stocks can drop 30-50% in a crash
- Best for: Long-term growth (10+ year horizon)

**Bonds (Fixed Income):** Loans you make to governments or corporations. They pay regular interest and return your principal at maturity.

- Historical average return: 4-6% per year
- Risk: Lower than stocks, but sensitive to interest rate changes
- Best for: Stability, income, diversification

**Real Estate:** Property purchased for rental income, appreciation, or both.

- Historical average return: 8-12% (including rental income)
- Risk: Illiquid, high entry cost, management burden
- Best for: Diversification, passive income, inflation hedge

**Cash & Cash Equivalents:** Savings accounts, CDs, money market funds, Treasury bills.

- Historical average return: 1-3% (currently higher due to rate environment)
- Risk: Essentially none
- Best for: Short-term needs, emergency fund

\`\`\`mermaid
graph TD
    A[Investing] --> B[Stocks]
    A --> C[Bonds]
    A --> D[Index Funds]
    A --> E[Real Estate]
    B --> B1[Growth potential]
    C --> C1[Steady income]
    D --> D1[Diversified & low-cost]
    E --> E1[Tangible asset]
\`\`\`

### Stocks: A Closer Look

When you buy a share of Apple stock, you own a tiny piece of Apple Inc. If Apple earns more profit, launches successful products, and grows, your share becomes more valuable. You can profit in two ways:

1. **Capital appreciation**: The stock price goes up and you sell for more than you paid
2. **Dividends**: The company pays you a portion of its profits (typically quarterly)

### Bonds: A Closer Look

A bond is essentially an IOU. The U.S. government issues Treasury bonds, considered the safest investment in the world. Corporations issue bonds too, at higher interest rates because they carry more risk.

**Key bond terms:**
- **Face value (par):** The amount repaid at maturity (typically \\\$1,000)
- **Coupon rate:** The annual interest rate paid
- **Maturity date:** When the principal is returned
- **Yield:** The effective return based on the price you pay

### Risk and Return: The Fundamental Trade-Off

Higher expected returns come with higher risk. This is the iron law of investing:

\`\`\`
Treasury bills (lowest risk) → Government bonds → Corporate bonds → Large-cap stocks → Small-cap stocks → Individual stocks (highest risk)
\`\`\`

You cannot earn stock-like returns with bond-like risk. Anyone who promises otherwise is selling something.

### Real-World Example: The Long View

If you had invested \\\$10,000 in the S&P 500 in 1993 and left it untouched:
- By 2003 (10 years): approximately \\\$23,000
- By 2013 (20 years): approximately \\\$46,000
- By 2023 (30 years): approximately \\\$172,000

This includes the dot-com crash, the 2008 financial crisis, and the 2020 COVID crash. The market recovered every time.

### Getting Started

You do not need thousands of dollars to begin investing. Most brokerages (Fidelity, Schwab, Vanguard) have no minimums and offer fractional shares. You can buy \\\$50 of an S&P 500 index fund today.

The biggest risk is not investing at all — leaving your money in a savings account while inflation erodes its value year after year.

### Key Takeaway

Investing is not gambling — it is participating in economic growth. Start by understanding the asset classes, accept that short-term volatility is the price of long-term returns, and begin with whatever amount you can. Time in the market matters far more than timing the market.

> "The stock market is a device for transferring money from the impatient to the patient." — Warren Buffett

*Resources: Investopedia Beginner's Guide to Investing, Khan Academy Stocks and Bonds, A Random Walk Down Wall Street by Burton Malkiel.*`,
    },
    {
      id: "pf-index-funds-etfs",
      slug: "index-funds-etfs",
      title: "Index Funds & ETFs (Bogle's Philosophy)",
      content: `## Index Funds & ETFs: Bogle's Philosophy

John C. Bogle, founder of Vanguard Group, revolutionized investing with a simple idea: instead of trying to beat the market, just **own the entire market** at the lowest possible cost. This philosophy has made more people wealthy than any other investment strategy in history.

### What Is an Index Fund?

An index fund is a type of mutual fund or ETF designed to track a specific market index. Instead of a fund manager picking stocks, the fund simply holds all (or a representative sample of) the stocks in the index.

**Popular Index Funds:**

| Index | What It Tracks | Example Fund | Expense Ratio |
|-------|---------------|-------------|--------------|
| S&P 500 | 500 largest US companies | Vanguard VOO / Fidelity FXAIX | 0.03% |
| Total US Stock Market | ~4,000 US companies | Vanguard VTI / VTSAX | 0.03% |
| Total International | Non-US stocks | Vanguard VXUS | 0.07% |
| Total Bond Market | US investment-grade bonds | Vanguard BND | 0.03% |

### Mutual Funds vs ETFs

Both can track the same index, but they differ in structure:

| Feature | Index Mutual Fund | ETF |
|---------|------------------|-----|
| Trading | End of day (NAV price) | Throughout the day (like a stock) |
| Minimum investment | Often \\\$1,000-3,000 | Price of one share (or fractional) |
| Tax efficiency | Good | Slightly better |
| Automatic investing | Easy to automate | Requires manual purchase (usually) |
| Expense ratios | Very low | Very low |

For most investors, the differences are marginal. Pick whichever is more convenient with your brokerage.

### Why Index Funds Win

Bogle's insight was backed by decades of data: **most actively managed funds underperform their benchmark index** over the long term.

According to the SPIVA Scorecard (S&P Dow Jones Indices, 2023):
- Over 5 years: **87%** of large-cap fund managers underperformed the S&P 500
- Over 10 years: **90%** underperformed
- Over 20 years: **93%** underperformed

The few managers who outperform in one period rarely do so consistently. And you cannot identify them in advance.

### The Cost Advantage

Expense ratios are the annual fee charged by a fund, expressed as a percentage of assets. The difference between an active fund and an index fund is dramatic:

| Fund Type | Typical Expense Ratio | Fee on \\\$100,000 |
|-----------|---------------------|-----------------|
| Active mutual fund | 0.75-1.50% | \\\$750-1,500/year |
| Index fund (Vanguard) | 0.03-0.10% | \\\$30-100/year |

Over 30 years on a \\\$500,000 portfolio, the difference between a 1% fee and a 0.03% fee is approximately **\\\$300,000** in lost returns. Fees compound just like returns — but against you.

### Real-World Example: The Bet

In 2007, Warren Buffett made a public \\\$1 million bet that the S&P 500 index fund would outperform a basket of hedge funds over 10 years. By 2017, the S&P 500 fund had returned 125.8% cumulatively, while the hedge funds returned an average of 36%. Buffett won decisively, donating the winnings to charity.

### The Three-Fund Portfolio

Bogle recommended an elegantly simple portfolio:

1. **US Total Stock Market Index Fund** (e.g., VTI or VTSAX) — 60%
2. **International Stock Index Fund** (e.g., VXUS or VTIAX) — 20%
3. **US Total Bond Market Index Fund** (e.g., BND or VBTLX) — 20%

Adjust the stock/bond ratio based on your age and risk tolerance (more bonds as you approach retirement). This three-fund portfolio provides global diversification across thousands of stocks and bonds for under 0.05% in fees.

### Bogle's Core Principles

1. **Keep costs low** — Every dollar in fees is a dollar not compounding for you
2. **Diversify broadly** — Own the whole market, not individual stocks
3. **Stay the course** — Do not sell during market crashes; do not chase hot sectors
4. **Invest regularly** — Dollar-cost average (next lesson) regardless of market conditions
5. **Keep it simple** — You do not need 15 funds; three is enough

### Common Objections

**"Index funds are boring."** Yes — and that is the point. Boring is profitable.

**"I can pick winning stocks."** Statistically, you almost certainly cannot do it consistently. Even professionals fail 90%+ of the time over long periods.

**"What about the next Amazon?"** For every Amazon, there are thousands of stocks that went to zero. The index owns Amazon AND protects you from the losers.

### Key Takeaway

Index funds are the single most important innovation in personal investing. They offer broad diversification, rock-bottom costs, and market-matching returns that beat 90% of professionals over the long term. As Bogle said: "Do not look for the needle in the haystack. Just buy the haystack."

*Resources: The Little Book of Common Sense Investing by John Bogle, Bogleheads.org, Vanguard.com, SPIVA Scorecard by S&P Dow Jones Indices.*`,
    },
    {
      id: "pf-dollar-cost-averaging",
      slug: "dollar-cost-averaging",
      title: "Dollar-Cost Averaging",
      content: `## Dollar-Cost Averaging

Dollar-cost averaging (DCA) is the practice of investing a fixed amount of money at regular intervals, regardless of market conditions. It removes the impossible task of timing the market and turns investing into a disciplined, automatic habit.

### How It Works

Instead of investing a lump sum all at once, you spread your purchases over time:

**Example: Investing \\\$500/month in an S&P 500 index fund**

| Month | Price Per Share | Shares Bought |
|-------|----------------|---------------|
| January | \\\$50.00 | 10.0 |
| February | \\\$45.00 | 11.1 |
| March | \\\$40.00 | 12.5 |
| April | \\\$42.00 | 11.9 |
| May | \\\$48.00 | 10.4 |
| June | \\\$52.00 | 9.6 |

**Total invested:** \\\$3,000
**Total shares:** 65.5
**Average cost per share:** \\\$45.80
**Current value (at \\\$52):** \\\$3,406

Notice that your average cost (\\\$45.80) is lower than the simple average of the prices (\\\$46.17). This is because you automatically buy **more shares when prices are low** and fewer shares when prices are high.

### Why DCA Works Psychologically

The biggest enemy of investment returns is investor behavior. Dalbar's annual study consistently shows that the average investor significantly underperforms the market because they:

- **Buy high**: Get excited when markets are rising and pile in at the top
- **Sell low**: Panic when markets crash and sell at the bottom
- **Wait on the sidelines**: Hold cash waiting for the "right time" that never feels right

DCA eliminates these emotional decisions entirely. You invest the same amount on the same schedule regardless of headlines, market swings, or your feelings.

### DCA vs Lump Sum Investing

Research by Vanguard (2012) found that lump sum investing outperforms DCA about **two-thirds of the time**, because markets trend upward and investing earlier captures more growth. However:

- DCA wins one-third of the time (when markets decline after the lump sum)
- DCA produces **lower volatility** and **less regret risk**
- Most people do not have a lump sum — they earn and invest monthly (natural DCA)

The psychological benefit of DCA is substantial. If you invest \\\$60,000 as a lump sum and the market drops 20% next month, you have lost \\\$12,000 on paper and will likely panic. If you are DCA-ing \\\$5,000/month, a 20% drop means you buy next month's shares at a 20% discount.

### Real-World Example: The 2008 Financial Crisis

Imagine two investors starting in January 2007, each planning to invest \\\$60,000 in the S&P 500:

**Lump Sum Laura** invests all \\\$60,000 on January 1, 2007. By March 2009, her portfolio is worth about \\\$30,000 — a gut-wrenching 50% loss. Many investors in her position sold in panic.

**DCA Dan** invests \\\$1,000/month starting January 2007. By March 2009, he has invested \\\$27,000 and his portfolio is worth about \\\$19,000 — still painful, but he has been buying shares at deeply discounted prices throughout the crash.

By December 2012 (6 years in):
- Laura's portfolio: approximately \\\$85,000 (recovered and grown)
- Dan's portfolio: approximately \\\$90,000 (benefited from buying cheap shares during the crash)

Dan's DCA strategy outperformed because the crash allowed him to accumulate discounted shares.

### Setting Up DCA

The best DCA strategy is one you automate and forget:

1. **Choose a brokerage** — Fidelity, Schwab, or Vanguard
2. **Select your index fund** — S&P 500, Total Stock Market, or Target Date Fund
3. **Set up automatic investment** — Fixed amount on each payday
4. **Do not check daily** — Review quarterly at most

Most 401(k) plans are inherently DCA — you invest a fixed amount each paycheck. If your employer offers a 401(k), you are likely already dollar-cost averaging.

### When DCA Is Not Ideal

- **If you receive a large windfall** (inheritance, bonus) and have a long time horizon (20+ years), lump sum investing has better expected returns
- **If you are near retirement**, you may want to be more strategic about when and what you invest in
- **In a consistently rising market**, DCA leaves money uninvested that could be earning returns

### The Bottom Line: Time in Market > Timing the Market

A famous study by J.P. Morgan found that missing the 10 best days in the stock market over a 20-year period cut returns by more than half. And 7 of the 10 best days occurred within two weeks of the 10 worst days. If you are sitting on the sidelines during crashes, you miss the recoveries.

DCA keeps you invested through both, automatically.

### Key Takeaway

Dollar-cost averaging removes emotion from investing and harnesses volatility in your favor. It is not always mathematically optimal, but it is behaviorally optimal — and behavior is what determines real-world investment outcomes. Automate your investments and let time do the heavy lifting.

> "Far more money has been lost by investors preparing for corrections, or trying to anticipate corrections, than has been lost in corrections themselves." — Peter Lynch

*Resources: Investopedia DCA Guide, Vanguard Lump Sum vs DCA Study (2012), Khan Academy Investing, JL Collins' The Simple Path to Wealth.*`,
    },
    {
      id: "pf-risk-tolerance",
      slug: "risk-tolerance",
      title: "Risk Tolerance & Asset Allocation",
      content: `## Risk Tolerance & Asset Allocation

Asset allocation — how you divide your money among stocks, bonds, and other investments — is the single most important decision in investing. Studies by Brinson, Hood, and Beebower found that asset allocation explains over **90% of the variation** in portfolio returns over time.

### What Is Risk Tolerance?

Risk tolerance is your ability and willingness to endure investment losses in pursuit of higher returns. It has two components:

**Risk capacity** (objective): Can you financially afford to lose money? This depends on:
- Your age and time horizon
- Income stability
- Existing savings and safety nets
- Financial obligations (mortgage, dependents)

**Risk willingness** (subjective): Can you emotionally handle watching your portfolio drop 30%? This depends on your personality, experience, and sleep quality during market crashes.

Both matter. A 25-year-old with a stable job and no dependents has high risk capacity. But if they panic-sell every time the market dips 5%, their risk willingness is low.

### Asset Allocation Models

The classic approach varies the stock/bond mix based on risk tolerance:

| Profile | Stocks | Bonds | Expected Return | Max Drawdown |
|---------|--------|-------|----------------|-------------|
| Aggressive | 90% | 10% | 8-10% | -45% |
| Growth | 80% | 20% | 7-9% | -38% |
| Moderate | 60% | 40% | 6-7% | -28% |
| Conservative | 40% | 60% | 4-6% | -18% |
| Very Conservative | 20% | 80% | 3-5% | -10% |

**Max drawdown** is the worst peak-to-trough decline you might experience. An aggressive portfolio with 90% stocks could lose 45% in a severe crash (like 2008-2009).

### The Age-Based Rule of Thumb

A common starting point: **subtract your age from 110 to get your stock allocation.**

- Age 25: 110 - 25 = 85% stocks, 15% bonds
- Age 40: 110 - 40 = 70% stocks, 30% bonds
- Age 55: 110 - 55 = 55% stocks, 45% bonds
- Age 65: 110 - 65 = 45% stocks, 55% bonds

This is a guideline, not a rule. Adjust based on your specific risk tolerance, goals, and financial situation.

### Real-World Example: Two Portfolios in 2008

**Portfolio A (90/10 — Aggressive):**
- 2007 value: \\\$100,000
- 2008-2009 crash: dropped to \\\$55,000 (-45%)
- Recovery to \\\$100,000: took until 2012 (3 years)
- Value by 2023: approximately \\\$400,000

**Portfolio B (60/40 — Moderate):**
- 2007 value: \\\$100,000
- 2008-2009 crash: dropped to \\\$72,000 (-28%)
- Recovery to \\\$100,000: took until 2010 (1 year)
- Value by 2023: approximately \\\$280,000

Portfolio A ended with more money, but Portfolio B had a much smoother ride. If the Portfolio A investor panicked and sold at the bottom, they locked in a 45% loss and never recovered.

### Diversification: The Free Lunch

Harry Markowitz, Nobel Prize-winning economist, called diversification "the only free lunch in investing." By combining assets that do not move in perfect sync, you can reduce risk without proportionally reducing returns.

**Key diversification layers:**

1. **Across asset classes**: Stocks + bonds + real estate
2. **Within stocks**: Large-cap + small-cap + international + emerging markets
3. **Within bonds**: Government + corporate + international + varying maturities
4. **Across time**: Dollar-cost averaging (covered in previous lesson)

### Target Date Funds: The Simplest Solution

If asset allocation feels overwhelming, target date funds do it all automatically. You pick the fund matching your expected retirement year (e.g., "Vanguard Target Retirement 2055 Fund"), and the fund automatically adjusts its stock/bond mix as you approach retirement.

- **30 years from retirement**: ~90% stocks, 10% bonds
- **15 years from retirement**: ~70% stocks, 30% bonds
- **At retirement**: ~50% stocks, 50% bonds
- **In retirement**: Gradually shifts to ~30% stocks, 70% bonds

Expense ratios are typically 0.10-0.15% — extremely affordable for a fully managed, automatically rebalancing portfolio.

### Rebalancing

Over time, your portfolio drifts from its target allocation. If stocks have a great year, your 80/20 portfolio might become 88/12. Rebalancing means selling some stocks and buying bonds to restore the 80/20 target.

**Rebalancing methods:**
- **Calendar-based**: Rebalance once per year (simple, effective)
- **Threshold-based**: Rebalance when any asset class drifts more than 5% from target
- **Contribution-based**: Direct new contributions to underweight asset classes

### Key Takeaway

Asset allocation is the most important investment decision you will make. Determine your risk tolerance based on both capacity and willingness, choose an allocation that lets you sleep at night, diversify broadly, and rebalance periodically. If this feels complex, a single target-date fund can handle everything for minimal cost.

> "The essence of investment management is the management of risks, not the management of returns." — Benjamin Graham

*Resources: Bogleheads Asset Allocation Guide, Vanguard Target Retirement Funds, Investopedia Risk Tolerance Quiz, Khan Academy Portfolio Theory.*`,
    },
  ],
};
