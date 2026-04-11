import { Module } from "../types";

export const taxesModule: Module = {
  id: "pf-taxes",
  title: "Taxes & Tax Planning",
  description: "Understand how income tax works, key deductions and credits, capital gains, and tax-advantaged strategies. Resources: IRS.gov, TurboTax Education, Khan Academy, Investopedia Tax Guide.",
  lessons: [
    {
      id: "pf-income-tax-brackets",
      slug: "income-tax-brackets",
      title: "How Income Tax Works (Brackets & Marginal Rates)",
      content: `## How Income Tax Works: Brackets & Marginal Rates

Understanding how income tax actually works is one of the most important — and most misunderstood — concepts in personal finance. The #1 misconception is that moving into a higher tax bracket means all your income is taxed at the higher rate. It does not.

\`\`\`concept
{
  "title": "The Big Misconception",
  "variant": "mental-model",
  "content": "Think of tax brackets like filling buckets of water. Each bucket (bracket) has a different tax rate painted on it. You pour your income into the first bucket until it's full, then move to the next bucket. Only the water in each individual bucket gets taxed at that bucket's rate — not all the water you've poured so far."
}
\`\`\`

### The U.S. Federal Tax Brackets (2025, Single Filer)

| Taxable Income | Tax Rate |
|---------------|----------|
| \\$0 - \\$11,925 | 10% |
| \\$11,926 - \\$48,475 | 12% |
| \\$48,476 - \\$103,350 | 22% |
| \\$103,351 - \\$197,300 | 24% |
| \\$197,301 - \\$250,525 | 32% |
| \\$250,526 - \\$626,350 | 35% |
| Over \\$626,350 | 37% |

### Marginal vs Effective Tax Rate

The tax system is **progressive** — each bracket applies only to the income within that range, not all your income.

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Federal Tax Calculator",
  "inputs": [
    { "id": "income", "label": "Taxable Income", "default": 85000, "min": 0, "max": 1000000, "prefix": "$" },
    { "id": "filing", "label": "Filing Status", "default": "single", "type": "select", "options": ["single", "married"] }
  ]
}
\`\`\`

**Example: You earn \\$85,000 taxable income (single filer)**

| Income Range | Rate | Tax |
|-------------|------|-----|
| First \\$11,925 | 10% | \\$1,193 |
| \\$11,926 - \\$48,475 | 12% | \\$4,386 |
| \\$48,476 - \\$85,000 | 22% | \\$8,035 |
| **Total** | | **\\$13,614** |

- **Marginal rate:** 22% (the rate on your last dollar)
- **Effective rate:** 16.0% (\\$13,614 / \\$85,000)

You are "in the 22% bracket" but you pay only 16.0% overall. The common fear — "If I earn more, I will lose money to taxes" — is a myth. Only the income above each threshold is taxed at the higher rate.

\`\`\`quiz
{
  "title": "Test Your Understanding",
  "questions": [
    {
      "question": "If you move from the 12% bracket to the 22% bracket, what happens?",
      "options": ["All your income is now taxed at 22%", "Only the income above the bracket threshold is taxed at 22%", "You pay 22% on your first dollar of income", "Your effective rate becomes 22%"],
      "answer": 1,
      "explanation": "Only the income that falls within the 22% bracket is taxed at that rate. All income below that threshold is still taxed at the lower rates."
    },
    {
      "question": "What is your marginal tax rate?",
      "options": ["The average rate you pay on all your income", "The highest rate you pay on any portion of your income", "The lowest rate you pay on your first dollar", "Your effective rate plus 5%"],
      "answer": 1,
      "explanation": "Your marginal tax rate is the rate you pay on your last dollar of income — the highest bracket you reach."
    },
    {
      "question": "Which is typically higher: marginal rate or effective rate?",
      "options": ["Marginal rate", "Effective rate", "They're always equal", "It depends on your income level"],
      "answer": 0,
      "explanation": "Your marginal rate is always higher than or equal to your effective rate in a progressive tax system, because it's the highest rate you pay on any portion of income."
    }
  ]
}
\`\`\`

### Taxable Income vs Gross Income

Your **gross income** is everything you earn. Your **taxable income** is what is left after deductions:

\`\`\`
Gross Income
- Pre-tax deductions (401(k), HSA, health insurance premiums)
= Adjusted Gross Income (AGI)
- Standard Deduction OR Itemized Deductions
= Taxable Income
\`\`\`

**Standard Deduction (2025):**
- Single: \\$15,750
- Married filing jointly: \\$31,500
- Head of household: \\$23,500

So if you earn \\$85,000 gross and contribute \\$5,000 to a 401(k):
\`\`\`
$85,000 - $5,000 (401k) = $80,000 AGI
$80,000 - $15,750 (standard deduction) = $64,250 taxable income
\`\`\`

Your tax is calculated on \\$64,250, not \\$85,000. This is why pre-tax contributions (401(k), Traditional IRA, HSA) are so powerful — they reduce taxable income.

### Real-World Example: The Raise Fear

Raj earns \\$47,000 and is offered a raise to \\$52,000. He hesitates: "If I move into the 22% bracket, will I take home less?"

\`\`\`trace
{
  "title": "Raj's Raise Analysis",
  "language": "python",
  "code": "# Raj's tax situation before and after raise\\n# Assuming single filer, standard deduction only\\n\\ndef calculate_tax(taxable_income):\\n    tax = 0\\n    brackets = [11925, 48475, 103350, 197300, 250525, 626350]\\n    rates = [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37]\\n    \\n    remaining = taxable_income\\n    for i, (bracket, rate) in enumerate(zip(brackets + [float('inf')], rates)):\\n        if remaining <= 0:\\n            break\\n        taxable_at_this_rate = min(remaining, bracket if i == 0 else bracket - brackets[i-1])\\n        tax += taxable_at_this_rate * rate\\n        remaining -= taxable_at_this_rate\\n    \\n    return tax\\n\\n# Before raise\\nbefore_gross = 47000\\nbefore_taxable = before_gross - 15750  # standard deduction\\nbefore_tax = calculate_tax(before_taxable)\\n\\nprint(f\\"Before raise:\\")\\nprint(f\\"  Gross income: \\\\\${before_gross:,}\\")\\nprint(f\\"  Taxable income: \\\\\${before_taxable:,}\\")\\nprint(f\\"  Federal tax: \\\\\${before_tax:,.0f}\\")\\nprint(f\\"  After-tax income: \\\\\${before_gross - before_tax:,.0f}\\")\\n\\n# After raise\\nafter_gross = 52000\\nafter_taxable = after_gross - 15750\\nafter_tax = calculate_tax(after_taxable)\\n\\nprint(f\\"\\\\nAfter raise:\\")\\nprint(f\\"  Gross income: \\\\\${after_gross:,}\\")\\nprint(f\\"  Taxable income: \\\\\${after_taxable:,}\\")\\nprint(f\\"  Federal tax: \\\\\${after_tax:,.0f}\\")\\nprint(f\\"  After-tax income: \\\\\${after_gross - after_tax:,.0f}\\")\\n\\nprint(f\\"\\\\nNet gain from raise: \\\\\${(after_gross - after_tax) - (before_gross - before_tax):,.0f}\\")",
  "frames": [
    { "line": 3, "vars": {"before_gross": 47000, "before_taxable": 31250}, "note": "Starting scenario: $47k gross income" },
    { "line": 4, "vars": {"before_tax": 3620}, "note": "Tax on $31,250 taxable income" },
    { "line": 16, "vars": {"after_gross": 52000, "after_taxable": 36250}, "note": "After $5k raise: $52k gross income" },
    { "line": 17, "vars": {"after_tax": 4220}, "note": "Tax on $36,250 taxable income" },
    { "line": 25, "note": "Raj gains $4,400 after taxes - no bracket penalty!" }
  ]
}
\`\`\`

**Before raise (taxable income ~\\$31,250):**
- All income taxed at 10% and 12%
- Tax: approximately \\$3,620
- After tax: approximately \\$43,380

**After raise (taxable income ~\\$36,250):**
- First \\$11,925 at 10%, next \\$24,325 at 12% — same as before
- Additional \\$5,000 is entirely in the 12% bracket (below \\$48,475 threshold)
- Tax: approximately \\$4,220
- After tax: approximately \\$47,780

Raj takes home **\\$4,400 more** after taxes. There is no scenario where earning more puts you behind — the marginal system prevents that.

### State and Local Taxes

Federal tax is only part of the picture. Most states also levy income tax:

| State Tax Situation | Examples |
|--------------------|---------|
| No state income tax | Texas, Florida, Washington, Nevada, Wyoming, Tennessee, New Hampshire, Alaska, South Dakota |
| Flat rate | Illinois (4.95%), Colorado (4.40%), Michigan (4.25%) |
| Progressive brackets | California (up to 13.3%), New York (up to 10.9%), New Jersey (up to 10.75%) |

A high earner in California might have a combined marginal rate of 50%+ (37% federal + 13.3% state). A high earner in Texas pays 37% (federal only).

### FICA Taxes (Payroll Taxes)

In addition to income tax, you pay FICA:
- Social Security: 6.2% on first \\$176,100 (2025)
- Medicare: 1.45% on all income (plus 0.9% surtax on income above \\$200,000)

These are flat taxes — no brackets. They hit lower earners proportionally harder.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Tax brackets work like buckets: only income within each bracket is taxed at that rate",
    "Your marginal rate is what you pay on your last dollar; your effective rate is much lower",
    "Earning more never reduces your take-home pay due to tax brackets",
    "Pre-tax contributions (401k, HSA) reduce your taxable income, not just your tax bill",
    "Focus on your effective tax rate when planning, not your marginal rate"
  ]
}
\`\`\``,
    },
    {
      id: "pf-deductions-vs-credits",
      slug: "deductions-vs-credits",
      title: "Tax Deductions vs Tax Credits",
      content: `## Tax Deductions vs Tax Credits

Deductions and credits both reduce your tax bill, but they work in fundamentally different ways. Understanding the distinction helps you maximize your tax savings and make better financial decisions.

### The Key Difference

**Tax deduction:** Reduces your *taxable income*. The tax savings depends on your tax bracket.

**Tax credit:** Reduces your *tax bill dollar-for-dollar*. A \\$1,000 credit saves \\$1,000 regardless of your bracket.

**Example at the 22% bracket:**
- \\$1,000 deduction saves you \\$220 (22% of \\$1,000)
- \\$1,000 credit saves you \\$1,000

Credits are always more valuable than deductions of the same dollar amount.

### Common Tax Deductions

**Above-the-line deductions** (reduce AGI — available even if you take the standard deduction):
- Traditional IRA contributions (up to \\$7,000)
- HSA contributions (up to \\$4,150 individual / \\$8,300 family)
- Student loan interest (up to \\$2,500)
- Self-employment tax (50% deductible)
- Educator expenses (up to \\$300)

**Standard Deduction (2024):**
- Single: \\$14,600
- Married filing jointly: \\$29,200
- Age 65+ additional: \\$1,950 (single) or \\$1,550 (married, per person)

**Itemized Deductions** (use these instead of standard deduction if they total more):
- State and local taxes (SALT): up to \\$10,000
- Mortgage interest: on first \\$750,000 of mortgage debt
- Charitable contributions: up to 60% of AGI for cash donations
- Medical expenses: amounts exceeding 7.5% of AGI

**When to itemize:** Most taxpayers (about 87%) take the standard deduction since the 2017 Tax Cuts and Jobs Act nearly doubled it. Itemize only if your deductions exceed the standard deduction.

### Common Tax Credits

**Non-refundable credits** (can reduce your tax to zero but not below):
- Child and Dependent Care Credit: up to \\$3,000 for one child, \\$6,000 for two+
- Lifetime Learning Credit: up to \\$2,000/year for education expenses
- Saver's Credit: up to \\$1,000 (\\$2,000 married) for low-income retirement savers

**Refundable credits** (can result in a refund even if you owe no tax):
- Earned Income Tax Credit (EITC): up to \\$7,430 for qualifying low-income families (2024)
- Child Tax Credit: \\$2,000 per qualifying child (partially refundable up to \\$1,700)
- American Opportunity Tax Credit: up to \\$2,500/year per student for first 4 years of college (40% refundable)

### Real-World Example: Strategic Tax Planning

Consider Maya, single, earning \\$80,000 gross:

**Without tax planning:**
- AGI: \\$80,000
- Standard deduction: -\\$14,600
- Taxable income: \\$65,400
- Federal tax: approximately \\$9,780

**With tax planning:**
- Contributes \\$6,000 to Traditional 401(k): AGI drops to \\$74,000
- Contributes \\$4,150 to HSA: AGI drops to \\$69,850
- Standard deduction: -\\$14,600
- Taxable income: \\$55,250
- Federal tax: approximately \\$7,548
- Saver's Credit: -\\$200

**Tax savings: \\$2,232** — and she funded her retirement and healthcare simultaneously.

### HSA: The Triple Tax Advantage

The Health Savings Account (HSA) is the only account with triple tax benefits:

1. **Tax-deductible contributions** (reduces taxable income)
2. **Tax-free growth** (investments grow without tax)
3. **Tax-free withdrawals** (for qualified medical expenses)

Requirements: must be enrolled in a High-Deductible Health Plan (HDHP). 2024 limits: \\$4,150 individual, \\$8,300 family.

**Pro strategy:** Pay current medical expenses out of pocket, let HSA investments grow, and withdraw tax-free in retirement for any medical expenses.

### Above-the-Line vs Below-the-Line

| Type | Availability | Impact |
|------|-------------|--------|
| Above-the-line deductions | Everyone | Reduces AGI (affects many other calculations) |
| Standard deduction | Everyone (choose standard or itemized) | Reduces taxable income |
| Itemized deductions | Only if they exceed standard deduction | Reduces taxable income |
| Tax credits | Based on eligibility | Reduces tax owed directly |

Above-the-line deductions are especially valuable because they reduce AGI, which affects eligibility for many credits and deductions that phase out at higher AGI levels.

### Key Takeaway

Tax deductions reduce what is taxed; tax credits reduce the tax itself. Credits are more powerful dollar-for-dollar. Maximize above-the-line deductions (401(k), HSA, IRA) to lower your AGI, and claim every credit you qualify for. A few hours of tax planning can save thousands annually.

*Resources: IRS Publication 17, TurboTax Deductions and Credits Guide, Investopedia Tax Deduction vs Credit, H&R Block Tax Calculator.*`,
    },
    {
      id: "pf-capital-gains-tax",
      slug: "capital-gains-tax",
      title: "Capital Gains Tax (Short-Term vs Long-Term)",
      content: `## Capital Gains Tax: Short-Term vs Long-Term

When you sell an investment for more than you paid, the profit is called a capital gain. How it is taxed depends on how long you held the investment. This distinction can mean the difference between paying 0% and 37% tax on the same profit.

### The Two Types

**Short-term capital gains:** Assets held for one year or less. Taxed as ordinary income (your regular tax bracket: 10-37%).

**Long-term capital gains:** Assets held for more than one year. Taxed at preferential rates: 0%, 15%, or 20%.

### Long-Term Capital Gains Tax Rates (2024)

| Filing Status | 0% Rate | 15% Rate | 20% Rate |
|-------------|---------|----------|----------|
| Single | Up to \\$47,025 | \\$47,026 - \\$518,900 | Over \\$518,900 |
| Married filing jointly | Up to \\$94,050 | \\$94,051 - \\$583,750 | Over \\$583,750 |

**Key insight:** If your taxable income (including gains) is below \\$47,025 (single) or \\$94,050 (married), you pay **zero tax** on long-term capital gains.

### Real-World Example: The Holding Period Matters

Sarah buys 100 shares of a stock at \\$50/share (\\$5,000 total). The stock rises to \\$80/share (\\$8,000 total). Her gain is \\$3,000.

**If she sells after 11 months (short-term):**
- Taxed at her ordinary rate (let us say 22%)
- Tax: \\$3,000 x 22% = \\$660
- After-tax profit: \\$2,340

**If she waits one more month and sells after 13 months (long-term):**
- Taxed at long-term rate (let us say 15%)
- Tax: \\$3,000 x 15% = \\$450
- After-tax profit: \\$2,550

By waiting 30 days, Sarah saves \\$210. On larger gains, this difference is enormous.

### Capital Losses: Your Tax Shield

Capital losses offset capital gains dollar-for-dollar:
- First, short-term losses offset short-term gains
- Then, long-term losses offset long-term gains
- Net losses can offset up to **\\$3,000 of ordinary income** per year
- Remaining losses carry forward indefinitely to future years

**Example:** You have \\$10,000 in capital gains and \\$15,000 in capital losses.
- Offset: \\$10,000 gains - \\$10,000 losses = \\$0 taxable gains
- Remaining \\$5,000 loss: deduct \\$3,000 from ordinary income this year
- Carry forward \\$2,000 to next year

### Tax-Loss Harvesting

Tax-loss harvesting is the strategy of intentionally selling losing investments to realize losses that offset gains:

1. Sell an investment that has declined in value (realize the loss)
2. Use the loss to offset capital gains or ordinary income
3. Reinvest in a similar (but not identical) investment to maintain market exposure

**Example:** Your S&P 500 ETF (VOO) is down \\$5,000. Sell it, realize the \\$5,000 loss, and immediately buy a total market ETF (VTI) — similar exposure, not "substantially identical."

**The wash-sale rule:** You cannot buy a "substantially identical" security within 30 days before or after the sale, or the loss is disallowed.

### Net Investment Income Tax (NIIT)

High earners face an additional 3.8% Net Investment Income Tax on capital gains, dividends, and other investment income when Modified AGI exceeds:
- \\$200,000 (single)
- \\$250,000 (married filing jointly)

This means the top effective rate on long-term capital gains is actually 23.8% (20% + 3.8% NIIT).

### Strategies to Minimize Capital Gains Tax

1. **Hold investments for more than one year** — Qualify for lower long-term rates
2. **Use tax-advantaged accounts** — 401(k), IRA, Roth IRA shield gains from all taxes
3. **Tax-loss harvest** — Offset gains with losses
4. **Manage your taxable income** — If close to the 0% bracket threshold, consider realizing gains in low-income years
5. **Donate appreciated stock** — Avoid capital gains entirely and get a charitable deduction
6. **Step-up in basis at death** — Inherited assets receive a new cost basis, eliminating unrealized gains

### The Stepped-Up Basis

When you inherit an asset, your cost basis "steps up" to the market value on the date of death. If your parent bought stock at \\$10/share and it is worth \\$100/share when they pass, your basis is \\$100. If you sell at \\$100, you owe zero capital gains tax.

This is one of the most powerful (and controversial) features of the tax code, particularly for wealth transfer.

### Key Takeaway

The holding period determines whether you pay ordinary rates or preferential capital gains rates. Always consider the tax implications before selling investments. Hold for more than one year when possible, harvest losses strategically, and use tax-advantaged accounts for active trading.

*Resources: IRS Topic 409 Capital Gains and Losses, Investopedia Capital Gains Guide, TurboTax Capital Gains Calculator, Bogleheads Tax-Loss Harvesting Guide.*`,
    },
    {
      id: "pf-tax-advantaged-accounts",
      slug: "tax-advantaged-accounts",
      title: "Tax-Advantaged Accounts",
      content: `## Tax-Advantaged Accounts

Tax-advantaged accounts are special account types that offer tax benefits for specific purposes — retirement, healthcare, or education. Using them strategically can save you tens of thousands of dollars in taxes over your lifetime.

\`\`\`concept
{
  "title": "The Triple Tax Advantage",
  "variant": "mental-model",
  "content": "Think of tax-advantaged accounts as having three possible tax benefits:\\n\\n1. **Tax-deductible contributions** (money goes in pre-tax)\\n2. **Tax-free growth** (investments compound without annual taxes)\\n3. **Tax-free withdrawals** (money comes out tax-free)\\n\\nMost accounts offer 1-2 of these. The HSA is unique — it offers all three when used for medical expenses, making it the most tax-advantaged account available."
}
\`\`\`

### The Account Landscape

| Account | Tax Benefit | 2026 Limit | Purpose |
|---------|-----------|-----------|---------|
| 401(k) / 403(b) | Pre-tax or Roth | $24,500 | Retirement |
| Traditional IRA | Pre-tax (if eligible) | $7,500 | Retirement |
| Roth IRA | After-tax in, tax-free out | $7,500 | Retirement |
| HSA | Triple tax-free | $4,400 / $8,750 | Healthcare |
| 529 Plan | Tax-free growth + withdrawals | Varies by state | Education |
| FSA | Pre-tax | $3,200 | Healthcare (use it or lose it) |
| Coverdell ESA | Tax-free growth | $2,000/year | Education |

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Tax-Deferred",
      "content": "**Traditional 401(k) / IRA**\\n\\n- **Contributions:** Pre-tax (reduce current taxable income)\\n- **Growth:** Tax-deferred (no annual taxes)\\n- **Withdrawals:** Taxed as ordinary income\\n\\n**Best for:** High earners in peak earning years who expect lower tax rates in retirement"
    },
    {
      "label": "Tax-Free",
      "content": "**Roth 401(k) / IRA**\\n\\n- **Contributions:** After-tax (no current deduction)\\n- **Growth:** Tax-free\\n- **Withdrawals:** Tax-free (qualified distributions)\\n\\n**Best for:** Young professionals or those in lower tax brackets"
    },
    {
      "label": "Triple Tax-Free",
      "content": "**Health Savings Account (HSA)**\\n\\n- **Contributions:** Pre-tax (above the line deduction)\\n- **Growth:** Tax-free\\n- **Withdrawals:** Tax-free for medical expenses\\n\\n**Stealth retirement account:** After 65, non-medical withdrawals taxed like Traditional IRA"
    }
  ]
}
\`\`\`

### Priority Order for Tax-Advantaged Accounts

Financial planners generally recommend this order:

**Step 1: 401(k) up to employer match**
- Instant 50-100% return from the match
- Pre-tax contributions reduce current taxable income

**Step 2: Max out HSA (if eligible)**
- Triple tax advantage is unmatched
- Can be invested and used as a stealth retirement account
- Unused funds roll over indefinitely (unlike FSA)

**Step 3: Max out Roth IRA**
- Tax-free growth and withdrawals in retirement
- No Required Minimum Distributions
- Contributions (not earnings) can be withdrawn anytime

**Step 4: Max out 401(k) to the full limit**
- Additional tax-deferred or Roth growth up to $24,500

**Step 5: Taxable brokerage account**
- No contribution limits
- No special tax benefits (but long-term capital gains rates are preferential)

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "HSA Retirement Growth Calculator",
  "inputs": [
    { "id": "p", "label": "Annual Contribution", "default": 4150, "min": 0, "max": 8300, "prefix": "$" },
    { "id": "r", "label": "Annual Return", "default": 8, "min": 0, "max": 15, "suffix": "%" },
    { "id": "t", "label": "Years Until Retirement", "default": 35, "min": 5, "max": 50, "suffix": " years" }
  ]
}
\`\`\`

### The HSA as a Retirement Account

Many people overlook the HSA's retirement potential. After age 65, you can withdraw HSA funds for **any purpose** (not just medical) — you just pay income tax, making it identical to a Traditional IRA. But withdrawals for medical expenses remain tax-free at any age.

**Strategy:** Invest your HSA in index funds, pay current medical bills out of pocket, save receipts, and let the HSA grow for decades. By retirement, you may have a substantial tax-free pool for healthcare expenses.

**Example:** $4,400/year invested in an HSA from age 30 to 65 at 8% return = approximately **$810,000** — all available tax-free for medical expenses in retirement.

### 529 Plans: Tax-Free Education Savings

A 529 plan lets you save for education expenses with tax-free growth and withdrawals:

- **Contributions:** Not federally deductible, but 30+ states offer state tax deductions
- **Growth:** Tax-free
- **Withdrawals:** Tax-free for qualified education expenses (tuition, room, board, books)
- **Excess funds:** Can be transferred to another beneficiary or (as of 2024) rolled into a Roth IRA (up to $35,000 lifetime, subject to conditions)

\`\`\`quiz
{
  "title": "Tax-Advantaged Account Strategy",
  "questions": [
    {
      "question": "Which account offers a 'triple tax advantage' when used for medical expenses?",
      "options": ["Traditional 401(k)", "Roth IRA", "HSA", "529 Plan"],
      "answer": 2,
      "explanation": "HSAs offer tax-deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses — the only account with all three benefits."
    },
    {
      "question": "What's the first priority when investing in tax-advantaged accounts?",
      "options": ["Max out Roth IRA", "Contribute to 401(k) up to employer match", "Max out HSA", "Pay off high-interest debt"],
      "answer": 1,
      "explanation": "The employer match is free money with an instant 50-100% return, making it the highest priority before other tax-advantaged contributions."
    },
    {
      "question": "After age 65, how are HSA withdrawals for non-medical expenses taxed?",
      "options": ["Tax-free", "10% penalty plus income tax", "Income tax only (like Traditional IRA)", "20% capital gains rate"],
      "answer": 2,
      "explanation": "After 65, non-medical HSA withdrawals are taxed as ordinary income, similar to Traditional IRA withdrawals, with no penalty."
    }
  ]
}
\`\`\`

### Real-World Example: The Tax Alpha

Consider two investors, both earning $100,000 and investing $20,000/year for 30 years at 8%:

**Investor A (taxable brokerage only):**
- Annual capital gains taxes reduce effective return to ~6.5%
- After 30 years: approximately $1,680,000
- After selling (15% capital gains on profit): approximately $1,478,000

**Investor B (tax-advantaged accounts):**
- 401(k): $24,500/year (no annual taxes on growth)
- After 30 years: approximately $2,450,000
- Withdrawal over 30 years of retirement at ~20% effective rate: approximately $1,960,000 after tax

The tax advantage generated approximately **$480,000** in additional wealth over the same period.

### Common Mistakes with Tax-Advantaged Accounts

1. **Not contributing enough to get the full employer match** — Free money left on the table
2. **Leaving HSA money in cash** — Most HSAs allow investment after a threshold balance
3. **Ignoring the Roth IRA in your 20s** — When your tax bracket is lowest, Roth contributions are most valuable
4. **Cashing out 401(k) when changing jobs** — Triggers taxes plus 10% penalty before 59.5
5. **Using 529 funds for non-qualified expenses** — Triggers taxes plus 10% penalty on earnings

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Tax-advantaged accounts can add hundreds of thousands to your lifetime wealth through tax savings and faster compounding",
    "Follow the priority order: 401(k) match → HSA → Roth IRA → max 401(k) → taxable account",
    "HSA is the most tax-advantaged account available and can double as a retirement account after age 65",
    "529 plans offer tax-free education savings with new flexibility to roll excess funds into Roth IRAs",
    "Avoid common mistakes like missing employer matches, leaving HSA funds uninvested, or cashing out retirement accounts early"
  ]
}
\`\`\``,
    },
    {
      id: "pf-filing-taxes",
      slug: "filing-your-taxes",
      title: "Filing Your Taxes",
      content: `## Filing Your Taxes

Filing taxes is an annual obligation for most Americans, but it does not have to be stressful. Understanding the key forms, deadlines, and options turns tax season from a source of anxiety into a manageable process.

### Key Tax Documents

Before you file, gather these documents:

**Income documents:**
- **W-2:** Provided by your employer, showing wages and taxes withheld
- **1099-NEC:** Freelance/contract income (\\$600+)
- **1099-INT:** Bank interest earned (\\$10+)
- **1099-DIV:** Dividends received (\\$10+)
- **1099-B:** Proceeds from stock/investment sales
- **1099-G:** Unemployment compensation or state tax refunds
- **SSA-1099:** Social Security benefits received

**Deduction documents:**
- **1098:** Mortgage interest paid
- **1098-T:** Tuition paid (for education credits)
- **1098-E:** Student loan interest paid
- **Charitable receipts:** Donations over \\$250 need written acknowledgment
- **Medical expense records:** If itemizing

### Standard Deduction vs Itemized

For 2024, the standard deduction is:
- Single: \\$14,600
- Married filing jointly: \\$29,200
- Head of household: \\$21,900

**Itemize only if your deductions exceed these amounts.** Common scenarios where itemizing makes sense:
- Large mortgage interest payments
- Significant charitable donations
- High state/local taxes (capped at \\$10,000 SALT deduction)
- Major unreimbursed medical expenses (above 7.5% of AGI)

About 87% of taxpayers take the standard deduction.

### Filing Status Options

| Status | Who Qualifies | Impact |
|--------|-------------|--------|
| Single | Unmarried, no dependents | Standard brackets |
| Married filing jointly | Married couples | Wider brackets, highest standard deduction |
| Married filing separately | Married but filing apart | Narrow brackets, lose many credits |
| Head of household | Unmarried with a qualifying dependent | Better brackets than single |
| Qualifying surviving spouse | Widowed within past 2 years with dependent | Same benefits as married jointly |

**Married filing jointly** is almost always better than separately. Filing separately only makes sense in specific situations (student loan repayment plans, protecting from spouse's tax liability).

### How to File

**Option 1: Tax software (\\$0-150)**
- TurboTax, H&R Block, TaxAct, FreeTaxUSA
- Guided interview format walks you through each section
- E-filing with direct deposit is fastest (refund in 2-3 weeks)

**Option 2: Free File (income under \\$79,000)**
- IRS Free File program partners with tax software companies
- Available at irs.gov/freefile
- Completely free federal filing; state may also be free

**Option 3: Tax professional (\\$200-500+)**
- Best for complex situations: self-employment, rental properties, business income
- CPAs and Enrolled Agents can represent you before the IRS

**Option 4: VITA (Volunteer Income Tax Assistance)**
- Free in-person tax preparation for income under \\$64,000
- Operated by IRS-certified volunteers
- Find locations at irs.gov/vita

### Real-World Example: First-Time Filing

Jake, age 23, just started his first full-time job earning \\$55,000. His employer provides a W-2 showing:
- Gross wages: \\$55,000
- Federal tax withheld: \\$5,200
- State tax withheld: \\$2,100
- 401(k) contributions: \\$3,000 (already excluded from taxable wages on W-2)

Jake's tax calculation:
\`\`\`
W-2 wages: $52,000 (already reflects 401(k) deduction)
- Standard deduction: $14,600
= Taxable income: $37,400

Tax:
  10% on $11,600 = $1,160
  12% on $25,800 = $3,096
Total tax: $4,256

Federal withheld: $5,200
Refund: $5,200 - $4,256 = $944
\`\`\`

Jake files using FreeTaxUSA (free federal, \\$14.99 state) and receives his \\$944 refund via direct deposit in 16 days.

### Important Deadlines

| Date | What |
|------|------|
| January 31 | Employers must send W-2s; 1099s due |
| April 15 | Tax filing deadline (or next business day) |
| April 15 | IRA contribution deadline for prior year |
| October 15 | Extended filing deadline (if extension filed) |

**Filing an extension:** Form 4868 gives you until October 15 to file, but you must still **pay** estimated taxes by April 15 to avoid penalties.

### Withholding: Getting It Right

If you consistently receive large refunds (\\$2,000+), you are over-withholding — giving the government an interest-free loan. If you consistently owe, you may face underpayment penalties.

**Adjust your W-4** to get your withholding close to your actual liability. Use the IRS Tax Withholding Estimator at irs.gov/W4app.

### Key Takeaway

Filing taxes is a straightforward process for most people: gather your documents, choose the standard deduction (unless you have reason to itemize), and file electronically. Use free or low-cost software, file early to get your refund faster, and adjust your withholding so you are not giving the government a free loan.

*Resources: IRS.gov, IRS Free File, FreeTaxUSA, TurboTax Education Center, VITA Locator.*`,
    },
  ],
};
