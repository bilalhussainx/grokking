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

\`\`\`concept
{
  "title": "The 401(k) Advantage",
  "variant": "mental-model",
  "content": "Think of a 401(k) as a tax-shielded rocket for your retirement savings. Traditional 401(k) contributions reduce your taxable income today (you pay less tax now), while Roth 401(k) contributions use after-tax dollars but create tax-free income in retirement. Both versions protect your investment growth from taxes while the money remains in the account."
}
\`\`\`

\`\`\`callout
{
  "type": "info",
  "title": "2026 Contribution Limits",
  "content": "Employee elective deferral limit: $24,500/year (under age 50)\\nCatch-up contribution: Additional $8,000/year (age 50+)\\nSpecial catch-up (ages 60-63): $11,250/year\\nTotal contribution limit (employee + employer): $70,000/year"
}
\`\`\`

### Traditional 401(k) vs Roth 401(k)

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Traditional 401(k)",
    "code": "Contributions: Pre-tax (reduces taxable income now)\\nGrowth: Tax-deferred\\nWithdrawals: Taxed as ordinary income\\nBest if: You expect lower tax rate in retirement\\nRMDs: Required at age 73"
  },
  "after": {
    "label": "Roth 401(k)",
    "code": "Contributions: After-tax (no tax break now)\\nGrowth: Tax-free\\nWithdrawals: Tax-free in retirement\\nBest if: You expect higher tax rate in retirement\\nRMDs: No longer required (SECURE Act 2.0)"
  }
}
\`\`\`

**Rule of thumb:** If you are early in your career and in a low tax bracket, Roth is often better. If you are in your peak earning years and a high bracket, Traditional saves more in taxes now.

### Employer Matching: Free Money

Many employers match your contributions up to a certain percentage. Common structures:

- **Dollar-for-dollar up to 3%**: Contribute 3% of salary, employer adds 3%
- **50 cents per dollar up to 6%**: Contribute 6%, employer adds 3%
- **Dollar-for-dollar up to 6%**: Contribute 6%, employer adds 6% (generous)

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Employer Match Impact Calculator",
  "inputs": [
    { "id": "salary", "label": "Annual Salary", "default": 70000, "min": 30000, "max": 300000, "prefix": "$" },
    { "id": "match", "label": "Employer Match %", "default": 4, "min": 0, "max": 10, "suffix": "%" },
    { "id": "contribution", "label": "Your Contribution %", "default": 4, "min": 0, "max": 25, "suffix": "%" },
    { "id": "rate", "label": "Annual Return %", "default": 8, "min": 0, "max": 12, "suffix": "%" },
    { "id": "years", "label": "Years Until Retirement", "default": 30, "min": 5, "max": 50, "suffix": "years" }
  ]
}
\`\`\`

**Example:** You earn \\$70,000 and your employer matches dollar-for-dollar up to 4%.

- You contribute 4%: \\$2,800/year
- Employer matches: \\$2,800/year
- **Total annual contribution: \\$5,600**
- The match is an **instant 100% return** on your contribution

**Not capturing the full match is literally leaving free money on the table.** This should be your first investment priority, even before paying off moderate-interest debt.

### Vesting Schedules

While your own contributions are always 100% yours, employer contributions may vest over time:

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Immediate Vesting",
      "content": "**How it works:** Employer match is yours right away\\n**Best for:** Employees who might change jobs soon\\n**Example:** You get 100% of employer contributions immediately"
    },
    {
      "label": "Cliff Vesting",
      "content": "**How it works:** 0% vested until a set date, then 100%\\n**Common period:** 3 years\\n**Risk:** Leave before cliff date, lose all employer contributions"
    },
    {
      "label": "Graded Vesting",
      "content": "**How it works:** Gradual increase over time\\n**Common schedule:** 20% per year over 5 years\\n**Example:** After 2 years, you keep 40% of employer contributions"
    }
  ]
}
\`\`\`

If you leave the company before fully vesting, you forfeit the unvested employer contributions. This is important to consider when evaluating job changes.

### Real-World Example: The Match Makes Millionaires

Consider Emma, age 25, earning \\$60,000 with a 4% match:

- Emma contributes 4% (\\$2,400/year)
- Employer matches 4% (\\$2,400/year)
- Total: \\$4,800/year at 8% average return
- **At age 65: approximately \\$1,295,000**

Without the match (just her \\$2,400/year): approximately \\$647,000. The employer match doubled her retirement wealth.

\`\`\`algoviz
{
  "title": "401(k) Growth with vs without Employer Match",
  "type": "array",
  "data": [2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 5600, 6000],
  "frames": [
    { "highlight": [0], "label": "Year 1: $2,400 contribution", "stats": {"with_match": 4800, "without_match": 2400} },
    { "highlight": [1], "label": "Year 5: $4,000 contribution", "stats": {"with_match": 8000, "without_match": 4000} },
    { "highlight": [3], "label": "Year 10: $6,000 contribution", "stats": {"with_match": 12000, "without_match": 6000} },
    { "highlight": [5], "label": "Final: 30+ years of doubling effect", "stats": {"with_match": 1295000, "without_match": 647000} }
  ],
  "speed": 1000
}
\`\`\`

### Investment Choices Within a 401(k)

Most plans offer:
- **Target-date funds**: "Set and forget" option that auto-adjusts allocation (recommended for most)
- **Index funds**: Low-cost S&P 500, total market, bond funds
- **Actively managed funds**: Higher fees, historically lower performance
- **Company stock**: Usually risky to overweight (remember Enron)

**Recommendation:** If your plan offers a low-cost target-date fund or S&P 500 index fund, start there. Avoid funds with expense ratios above 0.50%.

### Common Mistakes

\`\`\`quiz
{
  "title": "401(k) Mistakes to Avoid",
  "questions": [
    {
      "question": "Which of these is the most costly 401(k) mistake?",
      "options": [
        "Not diversifying investments",
        "Not contributing enough to get the full employer match",
        "Choosing high-fee funds",
        "Not rebalancing annually"
      ],
      "answer": 1,
      "explanation": "Not getting the full employer match is literally leaving free money on the table - an instant 100% return you're missing out on."
    },
    {
      "question": "What should you do with your 401(k) when changing jobs?",
      "options": [
        "Cash it out and spend it",
        "Leave it with your old employer",
        "Roll it over to an IRA or your new employer's 401(k)",
        "Stop contributing forever"
      ],
      "answer": 2,
      "explanation": "Rolling over preserves the tax advantages and avoids early withdrawal penalties. Cashing out triggers taxes and a 10% penalty if you're under 59.5."
    },
    {
      "question": "At what income level does the employer match become less valuable?",
      "options": [
        "Never - it's always free money",
        "Above $100,000",
        "Above $200,000",
        "Only for very high earners above $500,000"
      ],
      "answer": 0,
      "explanation": "The employer match is always valuable free money regardless of your income level. It's an immediate 100% return on your contribution."
    }
  ]
}
\`\`\`

### Key Takeaways

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "A 401(k) with employer matching is the closest thing to free money in personal finance - contribute at least enough to capture the full match from day one",
    "Choose between Traditional (tax break now) vs Roth (tax-free later) based on your current vs expected future tax bracket",
    "Your contributions are always 100% vested, but employer contributions may have vesting schedules - consider this when changing jobs",
    "Stick with low-cost index funds or target-date funds, and avoid funds with expense ratios above 0.50%",
    "Never cash out when changing jobs - roll your 401(k) to an IRA or new employer's plan to preserve tax advantages"
  ]
}
\`\`\`

*Resources: IRS 401(k) Contribution Limits, Investopedia 401(k) Guide, Fidelity 401(k) Resource Center, NerdWallet 401(k) Calculator.*`,
    },
    {
      id: "pf-iras",
      slug: "iras-traditional-vs-roth",
      title: "IRAs: Traditional vs Roth",
      content: `## IRAs: Traditional vs Roth

An Individual Retirement Account (IRA) is a tax-advantaged account you open on your own (not through an employer). IRAs complement your 401(k) and provide additional retirement savings capacity with unique tax benefits.

\`\`\`concept
{
  "title": "The IRA Time-Travel Trade-off",
  "variant": "mental-model",
  "content": "Think of IRAs as a choice between two time machines:\\n\\n**Traditional IRA**: You get a tax break TODAY (deduction) but pay taxes LATER (on withdrawals). It's like borrowing money from your future self.\\n\\n**Roth IRA**: You pay taxes TODAY (no deduction) but get tax-free money LATER (on withdrawals). It's like prepaying for a first-class retirement ticket.\\n\\nThe key question: Do you believe your tax rate will be higher now or in retirement?"
}
\`\`\`

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

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Roth vs Traditional: 40-Year Impact Calculator",
  "inputs": [
    { "id": "p", "label": "Annual Contribution", "default": 7000, "min": 1000, "max": 20000, "prefix": "$" },
    { "id": "r", "label": "Annual Return", "default": 8, "min": 3, "max": 12, "suffix": "%" },
    { "id": "y", "label": "Years to Retirement", "default": 40, "min": 10, "max": 50, "suffix": " years" },
    { "id": "t", "label": "Retirement Tax Rate", "default": 22, "min": 10, "max": 37, "suffix": "%" }
  ]
}
\`\`\`

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

\`\`\`steps
{
  "title": "Backdoor Roth IRA Strategy",
  "steps": [
    {
      "title": "Step 1: Open Traditional IRA",
      "content": "Contribute up to the annual limit ($7,000 for 2024) to a **non-deductible** Traditional IRA. This means you don't claim the tax deduction."
    },
    {
      "title": "Step 2: Wait (Optional)",
      "content": "Some advisors recommend waiting a short period (days to weeks) to avoid the 'step transaction doctrine' scrutiny, though the IRS has not officially required a waiting period."
    },
    {
      "title": "Step 3: Convert to Roth",
      "content": "Convert the Traditional IRA balance to a Roth IRA. If there are no gains, you owe zero taxes on the conversion. Any gains will be taxed as ordinary income."
    },
    {
      "title": "Step 4: File Form 8606",
      "content": "Report the non-deductible contribution and conversion on IRS Form 8606 to establish your 'basis' and avoid double taxation."
    }
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Traditional vs Roth IRA Knowledge Check",
  "questions": [
    {
      "question": "Sarah is 28 years old, earns $65,000/year, and expects her income to increase significantly over her career. Which IRA type is likely better for her?",
      "options": ["Traditional IRA", "Roth IRA", "Both are equally good", "Neither - she should only use a 401(k)"],
      "answer": 1,
      "explanation": "A Roth IRA is typically better for young workers in lower tax brackets who expect higher income in the future. She pays taxes now at her current low rate and gets tax-free withdrawals later when she might be in a higher bracket."
    },
    {
      "question": "Mike is 55, in the 32% tax bracket, and expects to retire in a 12% tax bracket. He needs a tax deduction this year. Which IRA should he choose?",
      "options": ["Roth IRA", "Traditional IRA", "Backdoor Roth IRA", "Taxable brokerage account"],
      "answer": 1,
      "explanation": "Traditional IRA is better here. He gets a valuable tax deduction now at 32%, and will pay taxes later at 12% in retirement. This arbitrage saves him significant money."
    },
    {
      "question": "Which statement about IRA income limits is CORRECT for 2024?",
      "options": ["Anyone can contribute to a Roth IRA regardless of income", "Traditional IRA contributions are phased out at $200,000 for singles", "Roth IRA contributions phase out between $146,000-$161,000 for single filers", "Traditional IRA deductibility has no income limits"],
      "answer": 2,
      "explanation": "Roth IRA contributions phase out for single filers with MAGI between $146,000-$161,000 in 2024. Traditional IRA contributions have no income limits, but deductibility phases out if covered by an employer plan."
    }
  ]
}
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

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Roth IRAs are powerful for young investors — decades of tax-free growth can add hundreds of thousands to your retirement",
    "Traditional IRAs work best when you need a tax break now and expect lower taxes in retirement",
    "Income limits exist for Roth contributions, but the backdoor Roth strategy provides a legal workaround",
    "After capturing your employer 401(k) match, prioritize maxing out a Roth IRA before increasing 401(k) contributions",
    "Open your IRA at a low-cost provider like Fidelity, Vanguard, or Schwab to minimize fees and maximize returns"
  ]
}
\`\`\``,
    },
    {
      id: "pf-power-of-early-investing",
      slug: "power-of-early-investing",
      title: "The Power of Early Investing: Age 25 vs 35",
      content: `## The Power of Early Investing: Age 25 vs 35

The single most important factor in investment success is not what you invest in or how much you earn — it is **when you start**. Starting 10 years earlier can be worth hundreds of thousands of dollars, even if you invest less money in total.

\`\`\`concept
{"title": "Compound Interest: The Eighth Wonder", "variant": "mental-model", "content": "Compound interest is when your money earns returns, and then those returns earn their own returns. Think of it as a snowball rolling downhill — it starts small but grows exponentially larger as it picks up more snow. The earlier you start, the bigger your snowball becomes because it has more time to accumulate mass."}
\`\`\`

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

\`\`\`calculator
{"type": "compound-interest", "title": "See the Power for Yourself", "inputs": [{"id": "p", "label": "Annual Investment", "default": 5000, "min": 1000, "max": 20000, "prefix": "$"}, {"id": "r", "label": "Annual Return Rate", "default": 8, "min": 4, "max": 12, "suffix": "%"}, {"id": "start_age", "label": "Start Age", "default": 25, "min": 20, "max": 50}, {"id": "end_age", "label": "Stop Contributing At", "default": 35, "min": 25, "max": 65}]}
\`\`\`

### Why the Math Works

Emily's \\$50,000 had 40 years to compound (from age 25 to 65). Larry's \\$150,000 had less time — his earliest dollars had 30 years, his latest had just 1 year.

Year-by-year, Emily's portfolio:
- Age 35 (stops contributing): \\$78,227
- Age 45 (10 years of growth, no new money): \\$168,907
- Age 55 (20 years of growth): \\$364,722
- Age 65 (30 years of growth): **\\$787,176**

The last 10 years alone added \\$422,454 — more than the prior 30 years combined. This is exponential growth in action.

\`\`\`algoviz
{"title": "Emily's Portfolio Growth Over 40 Years", "type": "array", "data": [78227, 168907, 364722, 787176], "frames": [{"highlight": [0], "label": "Age 35: Stops contributing with $78,227", "stats": {"years_growing": 0}}, {"highlight": [1], "label": "Age 45: 10 years growth → $168,907", "stats": {"years_growing": 10}}, {"highlight": [2], "label": "Age 55: 20 years growth → $364,722", "stats": {"years_growing": 20}}, {"highlight": [3], "label": "Age 65: 30 years growth → $787,176", "stats": {"years_growing": 30}}], "speed": 1200}
\`\`\`

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

\`\`\`callout
{"type": "warning", "title": "The Hidden Cost of Procrastination", "content": "Every year you delay investing, you're not just missing one year of contributions — you're losing that year's ability to compound for decades. A 25-year-old who delays just one year (waiting until 26) needs to invest about \\\\$320/month instead of \\\\$286/month to reach the same \\\\$1 million goal by age 65. That's an extra \\\\$16,320 over their lifetime for just one year of procrastination."}
\`\`\`

### "But I Cannot Afford to Invest Right Now"

The most common objection from young people is that they do not have enough money. But starting small is far better than not starting:

- \\$50/month starting at age 22 at 8% = **\\$227,000** at age 65
- \\$200/month starting at age 35 at 8% = **\\$226,000** at age 65

Fifty dollars a month started 13 years earlier matches four times the contribution started later.

\`\`\`quiz
{"title": "Test Your Understanding of Early Investing", "questions": [{"question": "If Emily invests \\\\$5,000/year for 10 years starting at age 25, and Larry invests \\\\$5,000/year for 30 years starting at age 35, who has more money at age 65 with 8% annual returns?", "options": ["Larry has more because he invested 3x as much money", "Emily has more because her money compounded for longer", "They have approximately the same amount", "It depends on market conditions"], "answer": 1, "explanation": "Emily ends up with \\\\$787,176 vs Larry's \\\\$611,729. Her money had 40 years to compound vs Larry's maximum of 30 years, demonstrating that time in the market beats total contributions."}, {"question": "How much more must a 45-year-old invest monthly compared to a 25-year-old to reach \\\\$1 million by age 65 at 8% returns?", "options": ["About 2x more", "About 4x more", "About 6x more", "About the same"], "answer": 2, "explanation": "A 45-year-old must invest \\\\$1,698/month vs a 25-year-old's \\\\$286/month — nearly 6 times more per month, totaling \\\\$270,240 extra over their lifetime."}, {"question": "What happens to \\\\$1,000 invested at 7% annual return if invested at age 25 vs age 35?", "options": ["The 25-year-old's investment grows to about \\\\$7,600", "The 25-year-old's investment grows to about \\\\$15,000", "Both grow to the same amount", "The 35-year-old's investment grows larger"], "answer": 1, "explanation": "\\\\$1,000 invested at age 25 at 7% grows to approximately \\\\$14,974 by age 65, while the same \\\\$1,000 invested at 35 grows to only \\\\$7,612 — less than half."}]}
\`\`\`

### What If You Are Starting Late?

If you are reading this at 40 or 50, do not despair. You cannot change the past, but you can:

1. **Maximize contributions now** — Take full advantage of catch-up contributions (\\$7,500 extra in 401(k) after age 50)
2. **Reduce expenses aggressively** — Free up more capital to invest
3. **Consider working a few extra years** — Each additional year adds contributions and growth while shortening retirement
4. **Avoid panic** — Do not take excessive risk trying to "catch up." A disciplined approach still works.

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Time is the most powerful variable in investing — starting at 25 vs 35 can be worth hundreds of thousands", "Compound interest creates exponential growth — your returns earn their own returns", "Small amounts invested early can outperform larger amounts invested later", "Every year of delay significantly increases the monthly savings needed to reach retirement goals", "Even if you're starting late, beginning today is still better than waiting longer"]}
\`\`\`

### The Takeaway That Changes Lives

If you are in your 20s and reading this, you hold an asset more valuable than any stock: time. Even tiny amounts invested now will compound into life-changing sums. Start today — not tomorrow, not next month, not when you "have enough."

If you are older, start now anyway. The second-best time to plant a tree is today.

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

- **Employee contribution:** 6.2% of wages (up to $176,100 in 2025)
- **Employer contribution:** 6.2% (matching)
- **Self-employed:** 12.4% (both halves)
- **Medicare addition:** 1.45% each (employee and employer) — no income cap

These taxes fund current retirees' benefits. It is a pay-as-you-go system, not an individual savings account. Your contributions do not sit in a personal account waiting for you.

\`\`\`concept
{
  "title": "The Pay-As-You-Go System",
  "variant": "mental-model",
  "content": "Think of Social Security like a water bucket brigade: today's workers (bucket carriers) fill the bucket with taxes, and that water immediately flows to today's retirees. Your bucket isn't stored for later — it's part of a continuous flow. When you retire, the next generation will carry buckets for you."
}
\`\`\`

### Eligibility: Earning Your Credits

You need **40 credits** (roughly 10 years of work) to qualify for retirement benefits. In 2025, you earn one credit for each $1,810 in wages, up to 4 credits per year.

\`\`\`quiz
{
  "title": "Check Your Understanding: Credits",
  "questions": [
    {
      "question": "If you earn $7,240 in 2025, how many Social Security credits do you earn?",
      "options": ["1 credit", "2 credits", "4 credits", "8 credits"],
      "answer": 2,
      "explanation": "$7,240 ÷ $1,810 = 4 credits exactly. You can earn a maximum of 4 credits per year regardless of how much more you earn."
    },
    {
      "question": "What is the minimum number of years you typically need to work to qualify for retirement benefits?",
      "options": ["5 years", "10 years", "15 years", "20 years"],
      "answer": 1,
      "explanation": "You need 40 credits, and you can earn up to 4 credits per year, so 40 ÷ 4 = 10 years minimum."
    },
    {
      "question": "If the earnings requirement per credit increases next year, what happens?",
      "options": ["You need more total credits", "You need fewer total credits", "You need more earnings per credit", "Nothing changes"],
      "answer": 2,
      "explanation": "The 40-credit requirement stays constant, but the dollar amount needed per credit typically increases with inflation."
    }
  ]
}
\`\`\`

### How Your Benefit Is Calculated

Social Security calculates your benefit based on your **highest 35 years of earnings** (adjusted for inflation):

1. **Average Indexed Monthly Earnings (AIME):** Your top 35 earning years, averaged monthly
2. **Primary Insurance Amount (PIA):** A formula applied to AIME that determines your benefit

The formula is progressive — it replaces a higher percentage of income for lower earners:
- 90% of the first $1,174 of AIME
- 32% of AIME between $1,174 and $7,078
- 15% of AIME above $7,078

**Implication:** If you worked fewer than 35 years, zeros are averaged in, reducing your benefit. Working a few extra years to replace those zeros can significantly boost your payment.

### When to Claim: The Age Decision

| Claiming Age | Benefit Level | Monthly Example |
|-------------|--------------|----------------|
| 62 (earliest) | 70% of full benefit | $1,400 |
| 67 (full retirement age for those born 1960+) | 100% of full benefit | $2,000 |
| 70 (maximum) | 124% of full benefit | $2,480 |

**Each year you delay** past full retirement age (up to 70) increases your benefit by approximately 8% — one of the best guaranteed returns available.

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Break-Even Calculator: Claim at 62 vs 67",
  "inputs": [
    { "id": "monthly62", "label": "Monthly benefit at 62", "default": 1400, "min": 500, "max": 3000, "prefix": "$" },
    { "id": "monthly67", "label": "Monthly benefit at 67", "default": 2000, "min": 700, "max": 4000, "prefix": "$" },
    { "id": "rate", "label": "Discount rate (inflation)", "default": 2, "min": 0, "max": 5, "suffix": "%" }
  ]
}
\`\`\`

### Real-World Example: The Break-Even Analysis

Should you claim at 62 or wait until 67?

**Claim at 62 ($1,400/month):** By age 67, you have collected $84,000 in benefits. But your benefit stays at $1,400/month forever.

**Claim at 67 ($2,000/month):** You received nothing from 62-67, so you start $84,000 "behind." But at $600/month more, you recoup the difference in about 12 years (by age 79). After that, every month is $600 more than you would have received.

If you live past 79 (the average American lives to about 78-80), waiting pays off. If you live to 85, waiting generates approximately $43,000 more total. If you live to 90, it is $79,000 more.

### Spousal and Survivor Benefits

**Spousal benefit:** A non-working or lower-earning spouse can receive up to 50% of the higher earner's benefit at full retirement age.

**Survivor benefit:** When one spouse dies, the surviving spouse receives the higher of the two benefits (at full retirement age). This makes delaying the higher earner's benefit especially valuable — it maximizes the survivor benefit.

\`\`\`callout
{
  "type": "tip",
  "title": "Couples Strategy: Coordinate Your Claims",
  "content": "The higher-earning spouse should consider delaying until 70 to maximize both their own benefit and the survivor benefit. The lower-earning spouse might claim earlier to provide income while waiting."
}
\`\`\`

### The Solvency Question

The Social Security Trust Fund is projected to be depleted around 2033 (per the 2023 Trustees Report). After that, incoming payroll taxes would cover approximately **77% of promised benefits**.

This does not mean Social Security disappears. It means benefits may be reduced, taxes may increase, the retirement age may rise, or some combination. Most experts believe the program will be modified, not eliminated. Plan conservatively: assume you will receive 75-80% of your projected benefit.

### Social Security Is Not Enough

The average Social Security retirement benefit in 2024 is approximately **$1,907/month** ($22,884/year). For most people, this replaces only 30-40% of pre-retirement income. The standard recommendation is to replace 70-80% of pre-retirement income in retirement.

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

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Social Security replaces only 30-40% of pre-retirement income — you'll need additional savings",
    "Delaying benefits from 67 to 70 increases monthly payments by 24% (8% per year)",
    "Working fewer than 35 years means zeros are averaged into your benefit calculation",
    "The Trust Fund may only cover 77% of benefits after 2033 — plan conservatively",
    "Check your earnings record annually at SSA.gov to ensure accuracy"
  ]
}
\`\`\``,
    },
    {
      id: "pf-retirement-calculator",
      slug: "retirement-calculator-walkthrough",
      title: "Retirement Planning Calculator Walkthrough",
      content: `## Retirement Planning Calculator Walkthrough

All the concepts from this module — 401(k)s, IRAs, compound interest, Social Security — come together in a retirement plan. This lesson walks through a complete retirement calculation step by step, helping you build your own plan.

\`\`\`concept
{
  "title": "The Four Questions of Retirement Planning",
  "variant": "mental-model",
  "content": "Every retirement plan answers four questions:\\n\\n1. **How much will I need?** (Your retirement number)\\n2. **How much will I have?** (Projected savings)\\n3. **What is the gap?** (Shortfall or surplus)\\n4. **How do I close the gap?** (Action plan)\\n\\nThink of it like GPS for your financial journey — you need to know your destination, current location, distance remaining, and the best route to get there."
}
\`\`\`

### Step 1: Estimate Retirement Expenses

Most financial planners use the **80% rule** — you will need about 80% of your pre-retirement income in retirement. Some expenses decrease (commuting, work clothes, payroll taxes) while others increase (healthcare, travel, hobbies).

\`\`\`calculator
{
  "type": "retirement",
  "title": "Estimate Your Retirement Expenses",
  "inputs": [
    { "id": "current_income", "label": "Current Annual Income", "default": 75000, "min": 0, "max": 500000, "prefix": "$" },
    { "id": "replacement_rate", "label": "Income Replacement %", "default": 80, "min": 60, "max": 100, "suffix": "%" },
    { "id": "inflation_rate", "label": "Expected Inflation", "default": 3, "min": 1, "max": 6, "suffix": "%" },
    { "id": "years_to_retirement", "label": "Years Until Retirement", "default": 35, "min": 5, "max": 50, "suffix": " years" }
  ]
}
\`\`\`

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

\`\`\`algoviz
{
  "title": "Nadia's Retirement Savings Growth",
  "type": "array",
  "data": [25000, 300, 300, 200],
  "frames": [
    { "highlight": [0], "label": "Starting balance: $25,000", "stats": {"age": 30, "balance": 25000} },
    { "highlight": [1,2,3], "label": "Monthly contributions: $800 total", "stats": {"monthly": 800, "annual": 9600} },
    { "highlight": [0], "label": "After 35 years at 8% return", "stats": {"final_balance": 2125000, "growth": 2100000} }
  ],
  "speed": 1000
}
\`\`\`

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

\`\`\`quiz
{
  "title": "Test Your Retirement Planning Knowledge",
  "questions": [
    {
      "question": "If you need $40,000 annually from your retirement savings, what should your target retirement number be using the 4% rule?",
      "options": ["$400,000", "$800,000", "$1,000,000", "$1,600,000"],
      "answer": 2,
      "explanation": "Using the 4% rule: $40,000 ÷ 0.04 = $1,000,000. This is the amount you need to save to safely withdraw $40,000 per year."
    },
    {
      "question": "Which factor has the MOST impact on your final retirement balance?",
      "options": ["Starting early with contributions", "Getting 1% higher returns", "Working 2 extra years", "Increasing contributions by 10%"],
      "answer": 0,
      "explanation": "Time is the most powerful factor due to compound interest. Starting 10 years earlier typically has a greater impact than small increases in returns or contributions."
    },
    {
      "question": "If inflation averages 4% instead of 3%, how does this affect your retirement number?",
      "options": ["It decreases by 25%", "It stays the same", "It increases", "It decreases slightly"],
      "answer": 2,
      "explanation": "Higher inflation means your future expenses will be higher in nominal dollars, so you need to save more to maintain the same purchasing power."
    }
  ]
}
\`\`\`

### Recommended Retirement Calculators

| Calculator | Best Feature | URL |
|-----------|-------------|-----|
| Fidelity | Simple, visual, accounts for Social Security | fidelity.com/calculators |
| Vanguard | Detailed Monte Carlo simulation | vanguard.com/retirement |
| NerdWallet | Quick estimate with tax considerations | nerdwallet.com/calculator |
| FireCalc | Uses historical data (not assumptions) | firecalc.com |
| cFIREsim | Advanced FIRE community tool | cfiresim.com |

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Beginner",
      "content": "**Start with Fidelity or NerdWallet calculators**\\n\\n- Simple 5-10 minute inputs\\n- Basic projections with Social Security\\n- Good for initial estimates\\n- Mobile-friendly interfaces"
    },
    {
      "label": "Intermediate",
      "content": "**Try Vanguard or Schwab calculators**\\n\\n- Monte Carlo simulations\\n- Multiple scenario testing\\n- Detailed tax considerations\\n- Account for different account types"
    },
    {
      "label": "Advanced",
      "content": "**Use FireCalc or cFIREsim**\\n\\n- Historical data analysis\\n- Sequence of returns risk\\n- Early retirement scenarios\\n- Custom withdrawal strategies"
    }
  ]
}
\`\`\`

### Real-World Tips

**Run the calculation annually.** Your income, expenses, and market conditions change. Update your inputs each year.

**Use conservative assumptions.** Better to plan for 6-7% returns and be pleasantly surprised than to assume 10% and fall short.

**Do not forget healthcare.** Before Medicare kicks in at 65, healthcare costs can be \\$1,000-2,000/month. If you retire early, budget for this.

**Plan for longevity.** Plan to age 90-95, not 80. Running out of money at 85 is a disaster with no fix.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Retirement planning follows a systematic 4-question framework: need, have, gap, and action",
    "The 4% rule provides a reliable method to calculate your target retirement number",
    "Starting early with consistent contributions leverages compound interest effectively",
    "Always adjust for inflation when calculating future expenses",
    "Run sensitivity analysis to test your plan against different scenarios",
    "Revisit and update your retirement calculations annually"
  ]
}
\`\`\`

> "Retirement is not the end of the road. It is the beginning of the open highway." — Unknown

*Resources: Fidelity Retirement Calculator, Vanguard Retirement Nest Egg Calculator, IRS Retirement Plan Limits, The 4% Rule (Trinity Study).*`,
    },
  ],
};
