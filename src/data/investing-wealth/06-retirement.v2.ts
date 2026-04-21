import { Module } from "../types";

export const retirementPlanningModule: Module = {
  id: "iw-retirement",
  title: "Retirement Planning (401k/IRA/Roth)",
  description: "Master the tax-advantaged retirement accounts that form the backbone of long-term wealth building -- 401(k)s, Traditional IRAs, Roth IRAs, and the strategies to maximize each. Resources: IRS Publication 590, Vanguard Retirement Research, Investopedia.",
  lessons: [
    {
      id: "iw-retirement-accounts",
      slug: "retirement-accounts-overview",
      title: "Retirement Accounts: 401(k), IRA, and Roth",
      content: `## Retirement Accounts: 401(k), IRA, and Roth

<!-- voice:key_insight insight="Tax-advantaged retirement accounts are the most powerful wealth-building tools available to ordinary investors. Understanding the differences between them can save you hundreds of thousands of dollars over a lifetime." -->

The U.S. tax code provides several accounts specifically designed for retirement savings. Each offers different tax advantages, contribution limits, and rules. Choosing the right accounts -- and using them correctly -- is one of the highest-impact financial decisions you will ever make.

### The Three Main Account Types

| Feature | Traditional 401(k) | Traditional IRA | Roth IRA |
|---------|-------------------|-----------------|----------|
| **Tax on contributions** | Pre-tax (reduces taxable income now) | Pre-tax (may be deductible) | After-tax (no deduction now) |
| **Tax on growth** | Tax-deferred | Tax-deferred | Tax-free |
| **Tax on withdrawals** | Taxed as ordinary income | Taxed as ordinary income | Tax-free (if qualified) |
| **2024 contribution limit** | \\$23,000 (\\$30,500 if 50+) | \\$7,000 (\\$8,000 if 50+) | \\$7,000 (\\$8,000 if 50+) |
| **Employer match** | Yes (if offered) | No | No |
| **Income limit to contribute** | None | None (but deduction phases out) | \\$161,000 single / \\$240,000 married |
| **Required Minimum Distributions** | Yes, starting at age 73 | Yes, starting at age 73 | No (during owner's lifetime) |

### The 401(k): Your First Priority

If your employer offers a 401(k) with a match, this is the single best investment available to you. An employer match is **free money**.

**Example:** Your employer matches 50% of contributions up to 6% of salary. You earn \\$80,000 and contribute 6% (\\$4,800). Your employer adds \\$2,400. That is an instant 50% return before your money even touches the market.

The 2024 maximum 401(k) contribution is \\$23,000 (\\$30,500 if you are 50 or older). Contributions reduce your taxable income dollar-for-dollar.

<!-- voice:section_check concept="retirement account types and employer match" -->

### Traditional vs Roth: The Tax Timing Decision

The core question: **Do you want to pay taxes now or later?**

- **Traditional (401k/IRA):** Pay taxes later, in retirement. Best if you expect to be in a **lower** tax bracket in retirement than you are now.
- **Roth (IRA or Roth 401k):** Pay taxes now, withdraw tax-free. Best if you expect to be in the **same or higher** tax bracket in retirement.

**The math:**

Assume you invest \\$7,000 in a 25% tax bracket with 8% returns over 30 years:

| Scenario | Traditional IRA | Roth IRA |
|----------|----------------|----------|
| Tax rate at contribution | 0% (deducted) | 25% |
| Amount invested | \\$7,000 | \\$5,250 (after paying \\$1,750 tax) |
| Value at 30 years | \\$70,507 | \\$52,880 |
| Tax at withdrawal (25%) | -\\$17,627 | \\$0 |
| **After-tax value** | **\\$52,880** | **\\$52,880** |

If the tax rate is the same, the result is identical. The Roth wins when your future tax rate is higher; the Traditional wins when it is lower.

### The Optimal Order of Operations

Financial planners generally recommend this priority sequence:

1. **401(k) up to the employer match** -- capture free money
2. **Pay off high-interest debt** (above 7%)
3. **Roth IRA to the max** (\\$7,000 for 2024)
4. **401(k) up to the max** (\\$23,000 for 2024)
5. **Taxable brokerage account** (after maxing tax-advantaged space)

### Key Takeaway

Tax-advantaged accounts are the foundation of retirement planning. Always capture your full employer match, understand the Traditional vs Roth tradeoff, and maximize contributions as your income allows. The tax savings compound over decades into hundreds of thousands of dollars.

> "Someone is sitting in the shade today because someone planted a tree a long time ago." -- Warren Buffett

*Resources: IRS Publication 590 (IRAs), IRS 401(k) Contribution Limits, Vanguard Retirement Planning Guide, Investopedia Roth vs Traditional Calculator.*`,
    },
    {
      id: "iw-retirement-math",
      slug: "retirement-math",
      title: "The Retirement Math: How Much Do You Need?",
      content: `## The Retirement Math: How Much Do You Need?

<!-- voice:key_insight insight="The 4% rule, developed from the Trinity Study, provides a data-backed framework for determining how much you need to save -- and how much you can safely withdraw in retirement." -->

The most common retirement question: "How much money do I actually need?" The answer requires understanding withdrawal rates, life expectancy, and the most influential retirement study ever conducted.

### The Trinity Study and the 4% Rule

In 1998, three professors at Trinity University (Philip Cooley, Carl Hubbard, and Daniel Walz) published a landmark study analyzing historical portfolio survival rates. Their finding: **a retiree who withdraws 4% of their portfolio in the first year of retirement, adjusted for inflation each subsequent year, has a high probability of not running out of money over 30 years.**

Using data from 1926 to 1995 (later updated through 2023):

| Withdrawal Rate | 30-Year Success Rate (60/40 portfolio) |
|----------------|---------------------------------------|
| 3% | ~100% |
| 4% | ~95% |
| 5% | ~76% |
| 6% | ~56% |

### Calculating Your Number

If 4% is the safe withdrawal rate, then you need **25 times your annual expenses** saved for retirement.

\\\`\\\`\\\`
Retirement Number = Annual Expenses x 25
\\\`\\\`\\\`

| Annual Expenses | Retirement Number |
|----------------|-------------------|
| \\$40,000 | \\$1,000,000 |
| \\$60,000 | \\$1,500,000 |
| \\$80,000 | \\$2,000,000 |
| \\$100,000 | \\$2,500,000 |

<!-- voice:section_check concept="4% rule and retirement number calculation" -->

### Working Backward: Monthly Savings Required

Once you know your target number, calculate the monthly savings needed to reach it:

Assuming 8% average annual returns and starting from \\$0:

| Target | Start at 25 | Start at 30 | Start at 35 | Start at 40 |
|--------|------------|------------|------------|------------|
| \\$1M | \\$286/mo | \\$436/mo | \\$671/mo | \\$1,051/mo |
| \\$1.5M | \\$429/mo | \\$654/mo | \\$1,007/mo | \\$1,576/mo |
| \\$2M | \\$572/mo | \\$872/mo | \\$1,342/mo | \\$2,101/mo |

Every decade of delay roughly doubles or triples the required monthly contribution. This is compounding working against procrastinators.

### Social Security: A Supplement, Not a Plan

The average Social Security retirement benefit in 2024 is approximately \\$1,907/month (\\$22,884/year). Maximum benefit at full retirement age is about \\$3,822/month.

Social Security was designed to replace about 40% of pre-retirement income for average earners. It was never intended as the sole retirement income source. Use it as a supplement to your investment portfolio, not a replacement.

### The FIRE Movement

The Financial Independence, Retire Early (FIRE) movement applies the 4% rule aggressively. By saving 50-70% of income and investing the difference, FIRE adherents aim to reach their retirement number in 10-15 years instead of 40.

**Example:** Someone earning \\$100,000 who spends only \\$30,000/year needs \\$750,000 to retire (\\$30,000 x 25). At a 70% savings rate, they invest \\$70,000/year and could reach \\$750,000 in about 8-9 years.

### Criticisms of the 4% Rule

The 4% rule has limitations:
- Based on historical U.S. returns (which may not repeat)
- Assumes a 30-year retirement (early retirees need a lower withdrawal rate)
- Does not account for variable spending (most retirees spend less as they age)
- Recent research suggests 3.3-3.5% may be more appropriate in low-return environments

### Key Takeaway

Know your number. Multiply your expected annual retirement expenses by 25 to find your target. Then work backward to determine how much you need to save each month. Start as early as possible -- time is the most valuable variable in this equation.

> "Retirement planning is not about guessing the future. It is about building enough margin that the future does not matter." -- Coach Morgan

*Resources: Trinity Study (Cooley, Hubbard, Walz, 1998), Vanguard Retirement Nest Egg Calculator, Social Security Administration Benefits Calculator, Mr. Money Mustache (FIRE Movement).*`,
    },
    {
      id: "iw-checkpoint-6",
      slug: "iw-checkpoint-6",
      title: "Checkpoint: Retirement Planning",
      content: `## Module 6 Checkpoint

<!-- voice:section_check concept="retirement planning review" -->

Retirement planning is the single highest-stakes application of everything you have learned. Let us verify your understanding.

---

### Question 1 (Multiple Choice)

What should always be your first investment priority if your employer offers a 401(k) match?

- A) Max out your Roth IRA
- B) Contribute enough to get the full employer match
- C) Pay off all debt first
- D) Invest in individual stocks

<details>
<summary>Answer</summary>

**B) Contribute enough to get the full employer match.** An employer match is free money -- typically 50-100% instant return on your contribution. No other investment offers a guaranteed return that high.
</details>

---

### Question 2 (Short Answer)

When does a Roth IRA mathematically beat a Traditional IRA?

<details>
<summary>Sample Answer</summary>

A Roth IRA beats a Traditional IRA when your tax rate in retirement is higher than your tax rate at the time of contribution. Since Roth contributions are taxed now but withdrawals are tax-free, the Roth wins if taxes rise. If tax rates are identical, the outcomes are mathematically equivalent. The Roth also has additional advantages: no Required Minimum Distributions during the owner's lifetime, and contributions (not gains) can be withdrawn penalty-free at any time.
</details>

---

### Question 3 (Multiple Choice)

According to the 4% rule, how much do you need saved to withdraw \\$60,000 per year in retirement?

- A) \\$600,000
- B) \\$1,000,000
- C) \\$1,500,000
- D) \\$2,400,000

<details>
<summary>Answer</summary>

**C) \\$1,500,000.** The formula is Annual Expenses x 25. \\$60,000 x 25 = \\$1,500,000. This portfolio, with a 4% initial withdrawal adjusted for inflation, has approximately a 95% chance of lasting 30 years based on historical data.
</details>

---

### Question 4 (Multiple Choice)

Social Security was designed to replace approximately what percentage of pre-retirement income for average earners?

- A) 20%
- B) 40%
- C) 60%
- D) 80%

<details>
<summary>Answer</summary>

**B) 40%.** Social Security was always intended as a supplement, not a complete retirement income source. The average benefit in 2024 is approximately \\$1,907/month.
</details>

---

### Question 5 (Application)

A 35-year-old wants to retire at 65 with \\$2 million. Assuming 8% average annual returns, approximately how much must they invest per month? What if they had started at 25?

<details>
<summary>Sample Answer</summary>

Starting at 35 with 30 years to retirement: approximately \\$1,342/month. Starting at 25 with 40 years to retirement: approximately \\$572/month. The 10-year delay more than doubles the required monthly savings -- from \\$572 to \\$1,342. Over the full period, the person who started at 35 invests \\$483,120 total, while the person who started at 25 invests \\$274,560. Starting early requires less sacrifice for the same result.
</details>

---

You have completed Module 6. In Module 7, we will cover risk management and diversification -- how to protect the wealth you are building.`,
    },
  ],
};
