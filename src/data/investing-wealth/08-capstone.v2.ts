import { Module } from "../types";

export const capstonePortfolioModule: Module = {
  id: "iw-capstone",
  title: "Capstone: Build Your Portfolio",
  description: "Synthesize everything you have learned into an actionable investment plan. Design your personal portfolio, set up accounts, and establish the habits that build lifelong wealth.",
  lessons: [
    {
      id: "iw-your-investment-plan",
      slug: "your-investment-plan",
      title: "Designing Your Investment Plan",
      content: `## Designing Your Investment Plan

<!-- voice:key_insight insight="An investment plan is not a wish list. It is a written, specific, actionable document that removes emotion from the equation and keeps you on track for decades." -->

You now have the knowledge. You understand compounding, asset classes, index funds, retirement accounts, real estate, diversification, and behavioral pitfalls. The final step is assembling it all into a personal investment plan.

### Step 1: Define Your Goals

Every investment decision flows from your goals. Write down:

| Goal | Amount Needed | Time Horizon | Priority |
|------|--------------|-------------|----------|
| Emergency fund | 3-6 months expenses | 0-6 months | Highest |
| House down payment | \\$60,000 | 3-5 years | High |
| Children's education | \\$200,000 | 15-18 years | Medium |
| Retirement | \\$2,000,000 | 25-40 years | Highest |
| Financial independence | \\$1,500,000 | 10-20 years | High |

### Step 2: Choose Your Asset Allocation

Based on your time horizon and risk tolerance:

| Time Horizon | Suggested Allocation |
|-------------|---------------------|
| 0-3 years | 100% cash/short-term bonds |
| 3-5 years | 30% stocks / 70% bonds |
| 5-10 years | 60% stocks / 40% bonds |
| 10-20 years | 80% stocks / 20% bonds |
| 20+ years | 90% stocks / 10% bonds |

### Step 3: Select Your Funds

For most investors, a three-fund portfolio is optimal:

| Fund | Ticker (Vanguard) | Expense Ratio | Role |
|------|-------------------|---------------|------|
| U.S. Total Stock Market | VTI (ETF) / VTSAX (mutual fund) | 0.03% | Domestic growth |
| Total International Stock | VXUS (ETF) / VTIAX (mutual fund) | 0.07% | Global diversification |
| Total Bond Market | BND (ETF) / VBTLX (mutual fund) | 0.03% | Stability, income |

Fidelity and Schwab offer equivalent funds at similar or lower costs (Fidelity FZROX has a 0.00% expense ratio).

<!-- voice:section_check concept="investment plan construction steps" -->

### Step 4: Set Up Your Accounts

Follow the optimal order:

1. **401(k)** -- Contribute at least enough to get the full employer match
2. **Roth IRA** -- Open at Vanguard, Fidelity, or Schwab. Contribute up to \\$7,000/year (2024)
3. **Increase 401(k)** -- Aim for the \\$23,000 max (2024)
4. **Taxable brokerage** -- After maxing tax-advantaged accounts, invest additional savings here

### Step 5: Automate Everything

Set up automatic contributions on payday. Money you never see is money you never spend. Most brokerages allow automatic recurring investments into specific funds.

### Step 6: Write Your Investment Policy Statement

This is your personal investment constitution. A simple template:

*"I invest [X]% in U.S. stocks, [Y]% in international stocks, and [Z]% in bonds using low-cost index funds. I rebalance annually on [month]. During market downturns, I will continue investing and will NOT sell. I will review this plan annually and adjust only for major life changes."*

### Key Takeaway

The best investment plan is one you will actually follow. Keep it simple, automate it, write it down, and then leave it alone. The greatest enemy of a good plan is the constant temptation to change it.

> "Plans are nothing; planning is everything." -- Dwight D. Eisenhower

*Resources: Bogleheads Investment Plan Template, Vanguard Account Setup Guide, Fidelity Automatic Investing Tools.*`,
    },
    {
      id: "iw-common-mistakes",
      slug: "common-investing-mistakes",
      title: "The 10 Most Costly Investing Mistakes",
      content: `## The 10 Most Costly Investing Mistakes

<!-- voice:key_insight insight="Most investing failures are not caused by bad luck or bad markets. They are caused by predictable, avoidable mistakes that this course has prepared you to dodge." -->

Before we close the course, let us catalog the mistakes that destroy the most wealth. These are not theoretical -- they are the traps that catch millions of real investors every year.

### Mistake 1: Not Starting

The single costliest mistake. Every year you delay investing costs you exponentially more than the last. A 25-year-old who invests \\$500/month for 40 years at 8% accumulates approximately \\$1.75 million. A 35-year-old investing the same amount has only \\$745,000. The 10-year delay cost over \\$1 million.

### Mistake 2: Trying to Time the Market

JP Morgan Asset Management found that if you missed just the 10 best days in the S&P 500 over a 20-year period (2003-2022), your returns dropped from 9.8% annually to 5.6%. Six of the 10 best days occurred within two weeks of the 10 worst days. If you sell during a crash, you almost certainly miss the recovery.

### Mistake 3: Paying High Fees

A 1% fee difference on a \\$500,000 portfolio over 25 years costs approximately \\$350,000 in lost growth. Always check expense ratios. If you are paying more than 0.20% for a broad market index fund, you are overpaying.

### Mistake 4: Chasing Performance

Morningstar data consistently shows that last year's top-performing fund is rarely next year's. Investors who chase "hot" funds buy after the gains have already occurred and sell after the losses.

### Mistake 5: Ignoring Tax Efficiency

Holding tax-inefficient investments (bonds, REITs, actively managed funds) in taxable accounts instead of tax-advantaged accounts can cost 0.5-1.0% annually in unnecessary taxes.

<!-- voice:section_check concept="common investing mistakes" -->

### Mistake 6: Concentration Risk

Employees of Enron, Bear Stearns, and Lehman Brothers who held company stock in their retirement accounts lost everything when those companies collapsed. Never hold more than 5-10% of your portfolio in any single stock, including your employer's.

### Mistake 7: Emotional Decision-Making

In March 2020, the S&P 500 dropped 34% in five weeks. Investors who panic-sold locked in those losses. Those who held (or bought more) saw the market recover to new highs within months.

### Mistake 8: Neglecting to Rebalance

A portfolio that starts 60/40 and drifts to 80/20 during a bull market is taking on significantly more risk than intended. Annual rebalancing maintains your risk profile.

### Mistake 9: No Emergency Fund

Without 3-6 months of expenses in cash, unexpected costs force you to sell investments -- often at the worst possible time.

### Mistake 10: Waiting for the "Perfect" Time

There is no perfect time to invest. Dollar-cost averaging (investing a fixed amount on a regular schedule) removes the timing decision entirely and has been shown to produce results within 2-3% of even a perfectly timed lump sum investment.

### Key Takeaway

The path to investment success is surprisingly boring: invest early, invest regularly, keep costs low, diversify broadly, and do not panic. Avoid these 10 mistakes, and you are already ahead of the vast majority of investors.

> "Successful investing is about managing risk, not avoiding it." -- Benjamin Graham

*Resources: JP Morgan Guide to the Markets, Morningstar Fund Performance Persistence Study, DALBAR Investor Behavior Analysis.*`,
    },
    {
      id: "iw-capstone-final",
      slug: "iw-capstone-final",
      title: "Final Assessment: Build Your Portfolio",
      content: `## Final Assessment: Build Your Portfolio

<!-- voice:section_check concept="capstone final assessment" -->

Congratulations on completing the Investing & Wealth Building course. This final assessment asks you to synthesize everything you have learned into a real investment plan.

---

### Question 1 (Portfolio Design)

You are 30 years old, earn \\$85,000/year, have \\$15,000 in savings, \\$8,000 in credit card debt (19% APR), and your employer offers a 401(k) with a 50% match on the first 6% of salary. Design your financial action plan for the next 12 months in priority order.

<details>
<summary>Sample Answer</summary>

1. **Contribute 6% to 401(k)** to capture the full employer match (\\$5,100/year from you, \\$2,550 from employer = instant 50% return)
2. **Attack credit card debt aggressively** -- \\$8,000 at 19% is costing \\$127/month in interest. Redirect all available funds after 401(k) match to eliminate this within 6-8 months.
3. **Build emergency fund** to \\$12,000-15,000 (3 months of expenses) in a high-yield savings account.
4. **Open a Roth IRA** and begin contributing (up to \\$7,000/year).
5. **Increase 401(k) contributions** toward the \\$23,000 max as cash flow allows.
</details>

---

### Question 2 (Asset Allocation)

Design a portfolio for a 30-year-old with moderate-aggressive risk tolerance, 35 years until retirement. Specify the percentage allocation and specific fund recommendations.

<details>
<summary>Sample Answer</summary>

**Target allocation: 85% stocks / 15% bonds**

- 55% U.S. Total Stock Market (VTI or VTSAX) -- broad domestic exposure
- 30% Total International Stock (VXUS or VTIAX) -- global diversification
- 15% Total Bond Market (BND or VBTLX) -- stability and income

Rebalance annually. As retirement approaches, gradually shift toward 60/40 or use a target-date fund (e.g., Vanguard Target Retirement 2060).
</details>

---

### Question 3 (Scenario Analysis)

The market drops 35% in a single month (like March 2020). Your \\$200,000 portfolio is now worth \\$130,000. Your co-workers are all selling. What do you do, and why?

<details>
<summary>Sample Answer</summary>

**Do nothing -- or buy more.** The S&P 500 has recovered from every downturn in history. Selling during a 35% crash locks in losses and almost certainly means missing the recovery (6 of the 10 best market days occur within two weeks of the 10 worst days). My Investment Policy Statement says I will not sell during downturns. If I have cash available, this is actually an excellent buying opportunity -- I am purchasing the same assets at a 35% discount. The key behavioral insight: volatility is not loss. It only becomes loss if I sell.
</details>

---

### Question 4 (Fee Analysis)

Your 401(k) offers two S&P 500 funds: Fund A (0.04% expense ratio) and Fund B (0.75% expense ratio). You plan to invest \\$500/month for 30 years at 8% gross returns. Calculate the approximate ending balance of each.

<details>
<summary>Sample Answer</summary>

**Fund A (0.04%):** Net return ~7.96%. After 30 years: approximately \\$735,000.
**Fund B (0.75%):** Net return ~7.25%. After 30 years: approximately \\$625,000.

The fee difference costs approximately **\\$110,000** over 30 years. This is why Coach Morgan insists that fees are the one variable entirely within your control -- and one of the most impactful.
</details>

---

### Question 5 (Reflection)

What is the single most important thing you learned in this course, and how will you apply it to your financial life starting this week?

<details>
<summary>Discussion Points</summary>

There is no single right answer, but strong responses typically reference one of these insights:
- The power of starting early (compound growth is exponential)
- The importance of low-cost index funds over stock-picking
- The need for a written Investment Policy Statement to combat behavioral biases
- The optimal order of operations for retirement account contributions
- The understanding that volatility is not loss -- only selling during downturns creates permanent loss

The key is specificity: not "I will invest more" but "I will set up automatic \\$200/month contributions to a Roth IRA at Vanguard this Saturday."
</details>

---

### Course Complete

You now have the knowledge and framework to build wealth systematically over a lifetime. The difference between knowing and doing is everything. Open that brokerage account. Set up automatic investments. Write your Investment Policy Statement. Start today.

> "The best time to plant a tree was 20 years ago. The second best time is now." -- Chinese Proverb

*Thank you for completing Investing & Wealth Building with Coach Morgan.*`,
    },
  ],
};
