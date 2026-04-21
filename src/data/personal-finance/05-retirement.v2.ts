import { Module } from "../types";

export const retirementModule: Module = {
  id: "pf-retirement",
  title: "Retirement Planning",
  description: "Plan for retirement using tax-advantaged accounts, employer matching, and the power of early investing. Resources: IRS.gov, Investopedia, Fidelity Retirement Planning, Khan Academy.",
  lessons: [
    {
      id: "pf-401k-employer-matching",
      slug: "401k-employer-matching",
      title: "401(k) & Employer Matching",
      content: `## 401(k) & Employer Matching

A 401(k) is an employer-sponsored retirement savings plan that offers tax advantages and, in many cases, free money through employer matching. It is the most powerful retirement tool available to American workers.

### How a 401(k) Works

Your employer sets up the plan with a financial institution. You elect to contribute a percentage of each paycheck, and the money is invested in a menu of funds (typically mutual funds and target-date funds).

**Key features for 2024:**
- **Contribution limit:** \\$23,000/year (under age 50)
- **Catch-up contribution:** Additional \\$7,500/year (age 50+)
- **Total limit (employee + employer):** \\$69,000/year
- **Vesting:** Employer contributions may vest over 1-6 years

### Traditional 401(k) vs Roth 401(k)

| Feature | Traditional 401(k) | Roth 401(k) |
|---------|-------------------|-------------|
| Contributions | Pre-tax (reduces taxable income now) | After-tax (no tax break now) |
| Growth | Tax-deferred | Tax-free |
| Withdrawals in retirement | Taxed as ordinary income | Tax-free |
| Best if you expect... | Lower tax rate in retirement | Higher tax rate in retirement |
| RMDs at 73? | Yes | No (as of SECURE Act 2.0) |

**Rule of thumb:** If you are early in your career and in a low tax bracket, Roth is often better. If you are in your peak earning years and a high bracket, Traditional saves more in taxes now.

### Employer Matching: Free Money

Many employers match your contributions up to a certain percentage. Common structures:

- **Dollar-for-dollar up to 3%**: Contribute 3% of salary, employer adds 3%
- **50 cents per dollar up to 6%**: Contribute 6%, employer adds 3%
- **Dollar-for-dollar up to 6%**: Contribute 6%, employer adds 6% (generous)

**Example:** You earn \\$70,000 and your employer matches dollar-for-dollar up to 4%.

- You contribute 4%: \\$2,800/year
- Employer matches: \\$2,800/year
- **Total annual contribution: \\$5,600**
- The match is an **instant 100% return** on your contribution

**Not capturing the full match is literally leaving free money on the table.** This should be your first investment priority, even before paying off moderate-interest debt.

### Vesting Schedules

While your own contributions are always 100% yours, employer contributions may vest over time:

| Type | How It Works |
|------|-------------|
| Immediate vesting | Employer match is yours right away |
| Cliff vesting | 0% vested until a set date (e.g., 3 years), then 100% |
| Graded vesting | Gradual increase (e.g., 20% per year over 5 years) |

If you leave the company before fully vesting, you forfeit the unvested employer contributions. This is important to consider when evaluating job changes.

### Real-World Example: The Match Makes Millionaires

Consider Emma, age 25, earning \\$60,000 with a 4% match:

- Emma contributes 4% (\\$2,400/year)
- Employer matches 4% (\\$2,400/year)
- Total: \\$4,800/year at 8% average return
- **At age 65: approximately \\$1,295,000**

Without the match (just her \\$2,400/year): approximately \\$647,000. The employer match doubled her retirement wealth.

Now consider if Emma increases her contribution to the maximum (\\$23,000/year):
- Total with match: \\$25,400/year at 8%
- **At age 65: approximately \\$6,852,000**

### Investment Choices Within a 401(k)

Most plans offer:
- **Target-date funds**: "Set and forget" option that auto-adjusts allocation (recommended for most)
- **Index funds**: Low-cost S&P 500, total market, bond funds
- **Actively managed funds**: Higher fees, historically lower performance
- **Company stock**: Usually risky to overweight (remember Enron)

**Recommendation:** If your plan offers a low-cost target-date fund or S&P 500 index fund, start there. Avoid funds with expense ratios above 0.50%.

### Common Mistakes

1. **Not contributing enough to get the full match** — This is mistake #1
2. **Leaving money in the default option** (often a money market fund earning 2%)
3. **Taking early withdrawals** — 10% penalty + income tax before age 59.5
4. **Cashing out when changing jobs** — Roll it to an IRA instead
5. **Not increasing contributions with raises** — Bump your percentage annually

### Key Takeaway

A 401(k) with employer matching is the closest thing to free money in personal finance. Contribute at least enough to capture the full match from day one. Choose low-cost index funds or target-date funds, increase contributions with each raise, and never cash out when changing jobs.

*Resources: IRS 401(k) Contribution Limits, Investopedia 401(k) Guide, Fidelity 401(k) Resource Center, NerdWallet 401(k) Calculator.*`,
    },
    {
      id: "pf-iras",
      slug: "iras-traditional-vs-roth",
      title: "IRAs: Traditional vs Roth",
      content: `## IRAs: Traditional vs Roth

An Individual Retirement Account (IRA) is a tax-advantaged account you open on your own (not through an employer). IRAs complement your 401(k) and provide additional retirement savings capacity with unique tax benefits.

### The Two Main Types

| Feature | Traditional IRA | Roth IRA |
|---------|----------------|----------|
| Contribution limit (2024) | \\$7,000 (\\$8,000 if 50+) | \\$7,000 (\\$8,000 if 50+) |
| Tax deduction now? | Yes (if eligible) | No |
| Tax on withdrawals | Taxed as income | Tax-free |
| Tax on growth | Tax-deferred | Tax-free |
| Required withdrawals at 73? | Yes | No |
| Early withdrawal penalty | 10% before 59.5 | Contributions can be withdrawn anytime; earnings penalized before 59.5 |
| Income limits to contribute? | No limit to contribute (deduction phases out) | Yes — phases out at higher incomes |

### Traditional IRA: Tax Break Now

With a Traditional IRA, you may deduct your contributions from your taxable income today, reducing your tax bill. The money grows tax-deferred, and you pay taxes when you withdraw in retirement.

**Best for:**
- People who expect to be in a lower tax bracket in retirement
- Those who need a tax deduction this year
- People without access to a Roth 401(k)

**Deduction phase-outs (2024):** If you or your spouse has an employer retirement plan, the deduction phases out at higher incomes (\\$77,000-\\$87,000 for single filers, \\$123,000-\\$143,000 for married filing jointly).

### Roth IRA: Tax Break Later

With a Roth IRA, you contribute after-tax money — no deduction today. But the payoff is enormous: all growth and withdrawals in retirement are **completely tax-free**. Additionally, you never have to take Required Minimum Distributions (RMDs).

**Best for:**
- Young workers in low tax brackets now who expect higher future income
- Anyone who values tax-free income in retirement
- Those who want flexibility (contributions can be withdrawn anytime without penalty)
- Estate planning (no RMDs means the account can grow untouched and pass to heirs)

**Income limits (2024):** Roth IRA contributions phase out at MAGI of \\$146,000-\\$161,000 (single) or \\$230,000-\\$240,000 (married filing jointly).

### Real-World Example: The Power of Tax-Free Growth

Miguel, age 25, contributes \\$7,000/year to a Roth IRA for 40 years at 8% average return.

- Total contributions: \\$280,000
- Account value at 65: approximately **\\$1,958,000**
- Tax on withdrawal: **\\$0**

If Miguel had used a Traditional IRA with identical contributions and returns:
- Account value at 65: approximately \\$1,958,000 (same)
- Tax on withdrawal (assuming 22% bracket): approximately **\\$430,760**
- After-tax value: approximately **\\$1,527,240**

The Roth advantage: approximately **\\$430,000** more in after-tax retirement income.

### The Backdoor Roth IRA

If your income exceeds the Roth IRA limits, you can use the "backdoor" strategy:

1. Contribute to a Traditional IRA (non-deductible)
2. Convert the Traditional IRA to a Roth IRA
3. Pay tax on any gains between contribution and conversion (usually minimal if done quickly)

This is a legal strategy used by high-income earners. Consult a tax professional to navigate the pro-rata rule if you have existing Traditional IRA balances.

\`\`\`mermaid
graph TD
    A{Employer match available?}
    A -->|Yes| B[Contribute to 401k up to match]
    B --> C[Then max out Roth IRA]
    A -->|No| D[Start with Roth IRA]
    D --> E[Then contribute to taxable account]
    C --> F[Then max out remaining 401k]
\`\`\`

### Where to Open an IRA

The best IRA providers offer no-fee accounts, low-cost index funds, and excellent customer service:

| Provider | Minimum | Index Fund Expenses | Notable Feature |
|----------|---------|--------------------|----|
| Fidelity | \\$0 | 0.015% (FZROX) | Zero-fee index funds |
| Vanguard | \\$0 | 0.03% (VTI/VTSAX) | Pioneer of index investing |
| Schwab | \\$0 | 0.03% (SWTSX) | Excellent customer service |

### IRA vs 401(k): Use Both

The optimal strategy for most workers:

1. **Contribute to 401(k) up to employer match** (free money)
2. **Max out Roth IRA** (\\$7,000/year)
3. **Go back and max out 401(k)** (\\$23,000/year)
4. **If capacity remains**, consider taxable brokerage account

### Key Takeaway

IRAs are essential supplements to employer retirement plans. The Roth IRA is particularly powerful for young investors — tax-free growth over decades creates an enormous tax advantage. Open one at a low-cost provider, automate your contributions, and prioritize it after capturing your employer 401(k) match.

*Resources: IRS IRA Contribution Limits, Investopedia Roth vs Traditional IRA, Bogleheads IRA Guide, Fidelity IRA Comparison.*`,
    },
    {
      id: "pf-power-of-early-investing",
      slug: "power-of-early-investing",
      title: "The Power of Early Investing: Age 25 vs 35",
      content: `## The Power of Early Investing: Age 25 vs 35

The single most important factor in investment success is not what you invest in or how much you earn — it is **when you start**. Starting 10 years earlier can be worth hundreds of thousands of dollars, even if you invest less money in total.

### The Classic Comparison

This example has been used by financial educators for decades because it is so powerful:

**Early Emily** starts investing \\$5,000/year at age 25 and stops at age 35 (10 years of contributions).
**Late Larry** starts investing \\$5,000/year at age 35 and continues until age 65 (30 years of contributions).

Both earn 8% average annual return.

| | Early Emily | Late Larry |
|--|------------|-----------|
| Starts investing | Age 25 | Age 35 |
| Stops contributing | Age 35 | Age 65 |
| Years of contributions | 10 | 30 |
| Total invested | \\$50,000 | \\$150,000 |
| Value at age 65 | **\\$787,176** | **\\$611,729** |

Emily invested **one-third as much money** but ended up with **\\$175,000 more**. Those first 10 years of compounding are extraordinarily valuable because they have the longest time to grow.

### Why the Math Works

Emily's \\$50,000 had 40 years to compound (from age 25 to 65). Larry's \\$150,000 had less time — his earliest dollars had 30 years, his latest had just 1 year.

Year-by-year, Emily's portfolio:
- Age 35 (stops contributing): \\$78,227
- Age 45 (10 years of growth, no new money): \\$168,907
- Age 55 (20 years of growth): \\$364,722
- Age 65 (30 years of growth): **\\$787,176**

The last 10 years alone added \\$422,454 — more than the prior 30 years combined. This is exponential growth in action.

### Real-World Data: S&P 500 Historical Returns

Using actual historical returns (1984-2024) rather than assumed 8%:

\\$10,000 invested in the S&P 500 (with dividends reinvested):
- In 1984 (40 years): approximately **\\$1,180,000**
- In 1994 (30 years): approximately **\\$267,000**
- In 2004 (20 years): approximately **\\$67,000**
- In 2014 (10 years): approximately **\\$33,000**

Each decade of delay cost a staggering amount of growth.

### The Cost of Waiting: A Different Perspective

Another way to see the penalty for delay — how much extra you must invest monthly to reach \\$1,000,000 by age 65 at 8% returns:

| Starting Age | Monthly Investment | Total Invested | Cost of Delay |
|-------------|-------------------|----------------|--------------|
| 25 | \\$286 | \\$137,280 | — |
| 30 | \\$436 | \\$182,280 | +\\$45,000 |
| 35 | \\$671 | \\$241,560 | +\\$104,280 |
| 40 | \\$1,052 | \\$315,600 | +\\$178,320 |
| 45 | \\$1,698 | \\$407,520 | +\\$270,240 |
| 50 | \\$2,890 | \\$520,200 | +\\$382,920 |

Waiting from 25 to 45 means investing nearly **6 times more per month** and **3 times more total money** to reach the same goal.

### "But I Cannot Afford to Invest Right Now"

The most common objection from young people is that they do not have enough money. But starting small is far better than not starting:

- \\$50/month starting at age 22 at 8% = **\\$227,000** at age 65
- \\$200/month starting at age 35 at 8% = **\\$226,000** at age 65

Fifty dollars a month started 13 years earlier matches four times the contribution started later.

### What If You Are Starting Late?

If you are reading this at 40 or 50, do not despair. You cannot change the past, but you can:

1. **Maximize contributions now** — Take full advantage of catch-up contributions (\\$7,500 extra in 401(k) after age 50)
2. **Reduce expenses aggressively** — Free up more capital to invest
3. **Consider working a few extra years** — Each additional year adds contributions and growth while shortening retirement
4. **Avoid panic** — Do not take excessive risk trying to "catch up." A disciplined approach still works.

### The Takeaway That Changes Lives

If you are in your 20s and reading this, you hold an asset more valuable than any stock: time. Even tiny amounts invested now will compound into life-changing sums. Start today — not tomorrow, not next month, not when you "have enough."

If you are older, start now anyway. The second-best time to plant a tree is today.

### Key Takeaway

Time is the most powerful variable in investing. Starting at 25 instead of 35 can be worth hundreds of thousands of dollars, even with smaller contributions. The cost of delay is measured not in missed deposits but in lost decades of compound growth.

> "The best time to start investing was yesterday. The second best time is today."

*Resources: Investopedia Compound Interest Calculator, Vanguard Retirement Nest Egg Calculator, Khan Academy Compound Growth, NerdWallet Retirement Calculator.*`,
    },
    {
      id: "pf-social-security",
      slug: "social-security-basics",
      title: "Social Security Basics",
      content: `## Social Security Basics

Social Security is a federal program that provides retirement income, disability benefits, and survivor benefits. For many Americans, it represents a significant portion of retirement income. Understanding how it works helps you plan more effectively.

### How Social Security Works

Social Security is funded through payroll taxes — FICA (Federal Insurance Contributions Act):

- **Employee contribution:** 6.2% of wages (up to \\$168,600 in 2024)
- **Employer contribution:** 6.2% (matching)
- **Self-employed:** 12.4% (both halves)
- **Medicare addition:** 1.45% each (employee and employer) — no income cap

These taxes fund current retirees' benefits. It is a pay-as-you-go system, not an individual savings account. Your contributions do not sit in a personal account waiting for you.

### Eligibility: Earning Your Credits

You need **40 credits** (roughly 10 years of work) to qualify for retirement benefits. In 2024, you earn one credit for each \\$1,730 in wages, up to 4 credits per year.

### How Your Benefit Is Calculated

Social Security calculates your benefit based on your **highest 35 years of earnings** (adjusted for inflation):

1. **Average Indexed Monthly Earnings (AIME):** Your top 35 earning years, averaged monthly
2. **Primary Insurance Amount (PIA):** A formula applied to AIME that determines your benefit

The formula is progressive — it replaces a higher percentage of income for lower earners:
- 90% of the first \\$1,174 of AIME
- 32% of AIME between \\$1,174 and \\$7,078
- 15% of AIME above \\$7,078

**Implication:** If you worked fewer than 35 years, zeros are averaged in, reducing your benefit. Working a few extra years to replace those zeros can significantly boost your payment.

### When to Claim: The Age Decision

| Claiming Age | Benefit Level | Monthly Example |
|-------------|--------------|----------------|
| 62 (earliest) | 70% of full benefit | \\$1,400 |
| 67 (full retirement age for those born 1960+) | 100% of full benefit | \\$2,000 |
| 70 (maximum) | 124% of full benefit | \\$2,480 |

**Each year you delay** past full retirement age (up to 70) increases your benefit by approximately 8% — one of the best guaranteed returns available.

### Real-World Example: The Break-Even Analysis

Should you claim at 62 or wait until 67?

**Claim at 62 (\\$1,400/month):** By age 67, you have collected \\$84,000 in benefits. But your benefit stays at \\$1,400/month forever.

**Claim at 67 (\\$2,000/month):** You received nothing from 62-67, so you start \\$84,000 "behind." But at \\$600/month more, you recoup the difference in about 12 years (by age 79). After that, every month is \\$600 more than you would have received.

If you live past 79 (the average American lives to about 78-80), waiting pays off. If you live to 85, waiting generates approximately \\$43,000 more total. If you live to 90, it is \\$79,000 more.

### Spousal and Survivor Benefits

**Spousal benefit:** A non-working or lower-earning spouse can receive up to 50% of the higher earner's benefit at full retirement age.

**Survivor benefit:** When one spouse dies, the surviving spouse receives the higher of the two benefits (at full retirement age). This makes delaying the higher earner's benefit especially valuable — it maximizes the survivor benefit.

### The Solvency Question

The Social Security Trust Fund is projected to be depleted around 2033 (per the 2023 Trustees Report). After that, incoming payroll taxes would cover approximately **77% of promised benefits**.

This does not mean Social Security disappears. It means benefits may be reduced, taxes may increase, the retirement age may rise, or some combination. Most experts believe the program will be modified, not eliminated. Plan conservatively: assume you will receive 75-80% of your projected benefit.

### Social Security Is Not Enough

The average Social Security retirement benefit in 2024 is approximately **\\$1,907/month** (\\$22,884/year). For most people, this replaces only 30-40% of pre-retirement income. The standard recommendation is to replace 70-80% of pre-retirement income in retirement.

\`\`\`
Social Security: 30-40%
401(k) / IRA: 30-40%
Other savings / pension: 0-20%
Gap: ???
\`\`\`

**Social Security is a foundation, not a retirement plan.** You need personal savings and investments to fill the gap.

### Checking Your Estimated Benefit

Create an account at **SSA.gov/myaccount** to see:
- Your complete earnings record
- Your estimated benefit at ages 62, 67, and 70
- Your qualifying credits

Review your earnings record for accuracy — if an employer reported incorrect wages, it could reduce your benefit.

### Key Takeaway

Social Security provides a guaranteed, inflation-adjusted income floor in retirement, but it was never designed to be your only income source. Understand your estimated benefit, consider delaying to age 67 or 70 if possible, and build personal savings to supplement it.

*Resources: SSA.gov, Social Security Administration Benefit Calculator, Investopedia Social Security Guide, AARP Social Security Resource Center.*`,
    },
    {
      id: "pf-retirement-calculator",
      slug: "retirement-calculator-walkthrough",
      title: "Retirement Planning Calculator Walkthrough",
      content: `## Retirement Planning Calculator Walkthrough

All the concepts from this module — 401(k)s, IRAs, compound interest, Social Security — come together in a retirement plan. This lesson walks through a complete retirement calculation step by step, helping you build your own plan.

### The Four Questions of Retirement Planning

1. **How much will I need?** (Your retirement number)
2. **How much will I have?** (Projected savings)
3. **What is the gap?** (Shortfall or surplus)
4. **How do I close the gap?** (Action plan)

### Step 1: Estimate Retirement Expenses

Most financial planners use the **80% rule** — you will need about 80% of your pre-retirement income in retirement. Some expenses decrease (commuting, work clothes, payroll taxes) while others increase (healthcare, travel, hobbies).

**Example: Nadia, age 30, earns \\$75,000/year**

- Current income: \\$75,000
- 80% replacement: \\$60,000/year in today's dollars
- Monthly need: \\$5,000

But we need to adjust for inflation. At 3% inflation over 35 years:
- \\$60,000 in today's dollars = approximately \\$169,000 in future dollars at age 65

### Step 2: Calculate Your Retirement Number

How much savings do you need to generate your target income? The **4% rule** (from the Trinity Study by Cooley, Hubbard, and Walz) suggests that you can withdraw 4% of your portfolio in year one and adjust for inflation each year with a high probability of not running out of money over 30 years.

\`\`\`
Retirement Number = Annual Need / 0.04
\`\`\`

Using Nadia's \\$60,000/year (in today's dollars):
\`\`\`
Retirement Number = $60,000 / 0.04 = $1,500,000
\`\`\`

But wait — Social Security will cover some of this. If Nadia expects \\$24,000/year from Social Security (in today's dollars):
\`\`\`
Amount needed from savings = $60,000 - $24,000 = $36,000/year
Adjusted Retirement Number = $36,000 / 0.04 = $900,000
\`\`\`

Nadia needs approximately **\\$900,000** in retirement savings (in today's dollars, assuming Social Security covers the rest).

### Step 3: Project Your Current Trajectory

Now calculate what Nadia is on track to accumulate:

**Current situation:**
- Age: 30
- Current retirement savings: \\$25,000
- Monthly 401(k) contribution: \\$300 (4% of salary)
- Employer match: \\$300 (4% match)
- Monthly Roth IRA contribution: \\$200
- Total monthly investment: \\$800
- Assumed return: 8%

**Projection to age 65 (35 years):**

Existing \\$25,000 growing at 8% for 35 years:
\`\`\`
$25,000 x (1.08)^35 = $369,525
\`\`\`

New contributions of \\$800/month at 8% for 35 years:
\`\`\`
$800 x [((1.0067)^420 - 1) / 0.0067] = approximately $1,756,000
\`\`\`

**Total projected at 65: approximately \\$2,125,000**

### Step 4: Assess the Gap

| | Amount |
|--|--------|
| Retirement number needed | \\$900,000 |
| Projected savings | \\$2,125,000 |
| **Surplus** | **\\$1,225,000** |

Nadia is actually ahead of schedule. This means she could potentially retire earlier, increase her lifestyle in retirement, or reduce contributions if needed for other goals.

### Step 5: Sensitivity Analysis

What if assumptions change?

| Scenario | Impact |
|----------|--------|
| Returns are 6% instead of 8% | Projected savings drop to ~\\$1,200,000 (still sufficient) |
| Nadia stops contributing for 5 years | Projected drops by ~\\$350,000 |
| Inflation averages 4% instead of 3% | Retirement number increases to ~\\$1,050,000 |
| Social Security is cut by 25% | Need increases to ~\\$1,050,000 |

Even in a pessimistic scenario (lower returns + Social Security cuts), Nadia is still on track because she started at 30.

### Recommended Retirement Calculators

| Calculator | Best Feature | URL |
|-----------|-------------|-----|
| Fidelity | Simple, visual, accounts for Social Security | fidelity.com/calculators |
| Vanguard | Detailed Monte Carlo simulation | vanguard.com/retirement |
| NerdWallet | Quick estimate with tax considerations | nerdwallet.com/calculator |
| FireCalc | Uses historical data (not assumptions) | firecalc.com |
| cFIREsim | Advanced FIRE community tool | cfiresim.com |

### Real-World Tips

**Run the calculation annually.** Your income, expenses, and market conditions change. Update your inputs each year.

**Use conservative assumptions.** Better to plan for 6-7% returns and be pleasantly surprised than to assume 10% and fall short.

**Do not forget healthcare.** Before Medicare kicks in at 65, healthcare costs can be \\$1,000-2,000/month. If you retire early, budget for this.

**Plan for longevity.** Plan to age 90-95, not 80. Running out of money at 85 is a disaster with no fix.

### Key Takeaway

Retirement planning is not guesswork — it is math. Estimate your expenses, calculate your number, project your trajectory, and close any gap by increasing contributions or adjusting timelines. Start the calculation now, revisit it annually, and let compound growth do the heavy lifting.

> "Retirement is not the end of the road. It is the beginning of the open highway." — Unknown

*Resources: Fidelity Retirement Calculator, Vanguard Retirement Nest Egg Calculator, IRS Retirement Plan Limits, The 4% Rule (Trinity Study).*`,
    },
  ],
};
