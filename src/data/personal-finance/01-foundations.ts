import { Module } from "../types";

export const foundationsModule: Module = {
  id: "pf-foundations",
  title: "Foundations of Personal Finance",
  description:
    "Understand the core concepts that underpin all personal finance decisions — income, expenses, net worth, the time value of money, and goal setting. Resources: Khan Academy Personal Finance, The Wealthy Barber by David Chilton, Investopedia.",
  lessons: [
    {
      id: "pf-what-is-personal-finance",
      slug: "what-is-personal-finance",
      title: "What is Personal Finance?",
      content: `## What is Personal Finance?

Personal finance is the practice of managing your money to achieve your life goals. It encompasses every financial decision you make — from daily spending to long-term investing. Unlike corporate finance or public finance, personal finance is about **you**: your income, your expenses, your future.

### Why Personal Finance Matters

According to a 2023 Bankrate survey, 57% of American adults cannot cover a \\\$1,000 emergency expense from savings. Financial literacy is not taught in most schools, leaving millions to learn through costly mistakes. Understanding personal finance gives you the tools to:

- **Avoid debt traps** that consume decades of income
- **Build wealth** systematically over time
- **Protect yourself** against unexpected financial shocks
- **Achieve freedom** to make life choices without money being the constraint

### The Five Pillars of Personal Finance

Personal finance is built on five interconnected pillars:

| Pillar | What It Covers | Key Question |
|--------|---------------|--------------|
| **Earning** | Salary, side income, passive income | How do I maximize my income? |
| **Spending** | Budgets, needs vs wants, lifestyle | Where does my money go? |
| **Saving** | Emergency funds, short-term goals | Am I prepared for the unexpected? |
| **Investing** | Stocks, bonds, real estate, retirement | How do I grow my wealth? |
| **Protecting** | Insurance, estate planning, taxes | How do I keep what I have built? |

### The Personal Finance Lifecycle

Your financial priorities shift as you move through life stages:

**Stage 1 — Early Career (20s):** Build an emergency fund, pay off high-interest debt, start investing early. Even small amounts matter because of compound interest (which we will cover in Lesson 4).

**Stage 2 — Mid Career (30s-40s):** Maximize retirement contributions, consider homeownership, protect your family with insurance, and invest consistently.

**Stage 3 — Peak Earning (50s):** Catch up on retirement savings if needed, pay off your mortgage, begin estate planning.

**Stage 4 — Retirement (60s+):** Draw down investments strategically, manage healthcare costs, and transfer wealth to the next generation.

### Real-World Example: The Latte Factor

David Bach popularized the concept of the "Latte Factor" — small daily expenses that add up over time. A \\\$5 daily coffee habit costs \\\$1,825 per year. Invested at 7% annual returns over 30 years, that money would grow to approximately \\\$172,000. This is not about depriving yourself of coffee; it is about being **intentional** with every dollar.

### Common Misconceptions

**"I do not earn enough to worry about personal finance."** Personal finance is actually *more* important when income is limited. Every dollar must work harder.

**"I will start investing when I am older."** Time is your greatest asset in investing. Starting at 25 instead of 35 can mean the difference of hundreds of thousands of dollars at retirement (we will prove this mathematically in Module 5).

**"Rich people do not budget."** Most self-made millionaires are meticulous about tracking their money. Thomas Stanley's research in *The Millionaire Next Door* found that the majority of millionaires live below their means.

### Your Financial Snapshot

Before diving deeper, take stock of where you are right now. Ask yourself:

1. Do I know my monthly income after taxes?
2. Do I know where every dollar goes each month?
3. Do I have any savings set aside for emergencies?
4. Am I contributing to any retirement account?
5. Do I have any debt? What are the interest rates?

If you cannot answer these questions confidently, that is completely normal — and exactly why you are here.

### Key Takeaway

Personal finance is not about being wealthy; it is about being intentional. By understanding the five pillars and where you are in the financial lifecycle, you can make informed decisions that compound into life-changing results over time.

> "The goal is not to be rich. The goal is to have options." — Chris Rock

*Resources: Khan Academy Personal Finance, Investopedia Personal Finance Guide, The Wealthy Barber by David Chilton.*`,
    },
    {
      id: "pf-income-expenses-net-worth",
      slug: "income-expenses-net-worth",
      title: "Income vs Expenses vs Net Worth",
      content: `## Income vs Expenses vs Net Worth

Understanding the relationship between income, expenses, and net worth is the foundation of all financial planning. These three concepts form the basic equation of personal wealth.

### Income: Money Coming In

Income is any money you receive. It comes in several forms:

| Income Type | Examples | Tax Treatment |
|-------------|----------|---------------|
| **Earned income** | Salary, wages, freelancing | Taxed at ordinary rates |
| **Investment income** | Dividends, interest, capital gains | Often taxed at lower rates |
| **Passive income** | Rental properties, royalties | Varies by source |
| **Transfer income** | Social Security, gifts, inheritance | Special rules apply |

Your **gross income** is the total before taxes and deductions. Your **net income** (take-home pay) is what actually hits your bank account. Always plan your budget around net income, not gross.

### Expenses: Money Going Out

Expenses fall into two categories:

**Fixed expenses** stay relatively constant each month — rent/mortgage, car payments, insurance premiums, loan payments. These are your financial commitments.

**Variable expenses** fluctuate — groceries, entertainment, dining out, clothing, utilities. These are where you have the most control.

A third, often overlooked category is **periodic expenses** — things that hit once or twice a year like car registration, annual subscriptions, holiday gifts, or property taxes. Many people forget to budget for these and get blindsided.

### The Wealth Equation

At its core, building wealth follows a simple formula:

\`\`\`
Wealth = (Income - Expenses) x Time x Rate of Return
\`\`\`

If you earn \\\$4,000/month and spend \\\$3,800, you save \\\$200. If you earn \\\$4,000 and spend \\\$3,000, you save \\\$1,000. The second scenario does not require earning more — it requires spending less. **The gap between income and expenses is everything.**

### Net Worth: The True Scorecard

Net worth is the single most important number in personal finance:

\`\`\`
Net Worth = Total Assets - Total Liabilities
\`\`\`

**Assets** are things you own that have value: cash, investments, retirement accounts, real estate, vehicles.

**Liabilities** are what you owe: credit card debt, student loans, mortgage balance, car loans.

### Real-World Example: Calculating Net Worth

Consider two people, both age 30:

| | **Person A** | **Person B** |
|--|-------------|-------------|
| Salary | \\\$80,000 | \\\$50,000 |
| Savings account | \\\$2,000 | \\\$15,000 |
| Retirement account | \\\$5,000 | \\\$40,000 |
| Car value | \\\$25,000 | \\\$8,000 |
| Credit card debt | \\\$12,000 | \\\$0 |
| Student loans | \\\$45,000 | \\\$10,000 |
| Car loan | \\\$20,000 | \\\$0 |
| **Net Worth** | **-\\\$45,000** | **+\\\$53,000** |

Person A earns 60% more but has a negative net worth. Person B earns less but is \\\$98,000 ahead in net worth. **Income is not wealth. Net worth is wealth.**

### Tracking Your Net Worth

Track your net worth monthly or quarterly. Use a simple spreadsheet or apps like Mint, Personal Capital, or YNAB. The number itself matters less than the **trend** — is it going up over time?

### The Savings Rate

Your savings rate is the percentage of income you save:

\`\`\`
Savings Rate = (Income - Expenses) / Income x 100
\`\`\`

Most financial advisors recommend saving at least 20% of gross income. The FIRE (Financial Independence, Retire Early) community targets 50% or higher. Even 10% is a strong start.

### Key Takeaway

Income pays the bills, but the gap between income and expenses determines whether you build wealth or accumulate debt. Track your net worth as your financial scorecard — it tells the truth that income alone cannot.

> "It is not your salary that makes you rich; it is your spending habits." — Charles A. Jaffe

*Resources: Investopedia Net Worth Calculator, Khan Academy Personal Finance, The Wealthy Barber by David Chilton.*`,
    },
    {
      id: "pf-time-value-of-money",
      slug: "time-value-of-money",
      title: "The Time Value of Money",
      content: `## The Time Value of Money

The time value of money (TVM) is arguably the single most important concept in all of finance. It states that **a dollar today is worth more than a dollar tomorrow**. This principle underpins every financial decision, from savings accounts to mortgages to retirement planning.

### Why Money Has a Time Value

Three forces make money today more valuable than money in the future:

1. **Opportunity cost**: Money in hand can be invested to earn returns. A dollar today, invested at 7%, becomes \\\$1.07 in one year.
2. **Inflation**: The purchasing power of money erodes over time. What costs \\\$100 today might cost \\\$103 next year.
3. **Uncertainty**: A promised future payment carries risk — the payer might default, circumstances might change.

### Present Value and Future Value

The two core TVM calculations are:

**Future Value (FV)** — What will my money be worth later?

\`\`\`
FV = PV x (1 + r)^n

Where:
PV = Present Value (amount today)
r  = Interest rate per period
n  = Number of periods
\`\`\`

**Example:** You invest \\\$1,000 at 5% annual interest for 10 years.

\`\`\`
FV = 1,000 x (1.05)^10 = 1,000 x 1.6289 = \$1,628.89
\`\`\`

Your money grew by \\\$628.89 without you doing anything.

**Present Value (PV)** — What is a future amount worth today?

\`\`\`
PV = FV / (1 + r)^n
\`\`\`

**Example:** Someone offers you \\\$10,000 five years from now. If you can earn 6% elsewhere, what is that offer worth today?

\`\`\`
PV = 10,000 / (1.06)^5 = 10,000 / 1.3382 = \$7,472.58
\`\`\`

That future \\\$10,000 is only worth \\\$7,472.58 in today's dollars.

### Real-World Application: Lottery Winnings

When someone wins a \\\$100 million lottery, they are offered a choice: take roughly \\\$60 million as a lump sum today, or receive \\\$100 million paid out over 30 years. Why is the lump sum so much less? Because of the time value of money. The lottery commission calculates that \\\$60 million invested today would grow to \\\$100 million over 30 years.

### The Rule of 72

A quick mental shortcut for estimating how long it takes money to double:

\`\`\`
Years to double = 72 / Interest Rate
\`\`\`

| Interest Rate | Years to Double |
|--------------|----------------|
| 3% | 24 years |
| 6% | 12 years |
| 8% | 9 years |
| 10% | 7.2 years |
| 12% | 6 years |

At 8% returns (close to the historical stock market average), your money doubles roughly every 9 years. Start with \\\$10,000 at age 25, and by age 61 it has doubled 4 times: \\\$10K becomes \\\$20K, then \\\$40K, then \\\$80K, then \\\$160K — without adding a single dollar.

### TVM and Daily Decisions

The time value of money applies to everyday choices:

- **Paying off a 20% credit card** is equivalent to earning a guaranteed 20% return on your money.
- **Delaying a purchase** by 30 days and investing the money earns a small but real return.
- **Negotiating salary** matters enormously because higher income invested over decades compounds dramatically.

### Discount Rates in Real Life

Banks, businesses, and governments use TVM constantly. When a company evaluates a new project, it discounts future cash flows to present value using a discount rate. If the present value of future profits exceeds the cost, the project is approved. This is called **Net Present Value (NPV)** analysis.

### Key Takeaway

Every financial decision involves trading money across time. Understanding that a dollar today is worth more than a dollar tomorrow — and knowing how to calculate exactly how much more — is the foundation of smart financial decision-making.

> "The most powerful force in the universe is compound interest." — Attributed to Albert Einstein (though likely apocryphal, the sentiment stands)

*Resources: Khan Academy Time Value of Money, Investopedia TVM Guide, MIT OpenCourseWare Finance Theory.*`,
    },
    {
      id: "pf-compound-interest",
      slug: "compound-interest",
      title: "Compound Interest: The 8th Wonder",
      content: `## Compound Interest: The 8th Wonder

Compound interest is what happens when your interest earns interest. It is the mechanism that turns small, consistent investments into substantial wealth over time — and the same force that makes debt spiral out of control.

### Simple vs Compound Interest

**Simple interest** is calculated only on the original principal:

\`\`\`
Simple Interest = Principal x Rate x Time
\$1,000 at 5% for 10 years = \$1,000 x 0.05 x 10 = \$500
Total: \$1,500
\`\`\`

**Compound interest** is calculated on the principal PLUS accumulated interest:

\`\`\`
Compound Interest = Principal x (1 + Rate)^Time
\$1,000 at 5% for 10 years = \$1,000 x (1.05)^10 = \$1,628.89
Total: \$1,628.89
\`\`\`

The difference is \\\$128.89 over 10 years. That seems modest, but watch what happens as we extend the timeline and increase the numbers.

### The Compounding Snowball

Consider \\\$10,000 invested at 8% annual return:

| Year | Simple Interest | Compound Interest | Difference |
|------|----------------|-------------------|------------|
| 10 | \\\$18,000 | \\\$21,589 | \\\$3,589 |
| 20 | \\\$26,000 | \\\$46,610 | \\\$20,610 |
| 30 | \\\$34,000 | \\\$100,627 | \\\$66,627 |
| 40 | \\\$42,000 | \\\$217,245 | \\\$175,245 |

After 40 years, compound interest produces **five times more** than simple interest. The growth is exponential, not linear — it accelerates over time.

### Compounding Frequency Matters

Interest can compound annually, quarterly, monthly, or even daily. More frequent compounding means faster growth:

| Frequency | \\\$10,000 at 6% after 20 years |
|-----------|-------------------------------|
| Annually | \\\$32,071 |
| Quarterly | \\\$32,620 |
| Monthly | \\\$33,102 |
| Daily | \\\$33,198 |

The difference between annual and daily compounding on this example is about \\\$1,127. For larger balances, this gap becomes significant.

### Real-World Example: Two Friends

**Sarah** starts investing \\\$200/month at age 25 and stops at age 35 (10 years of contributions = \\\$24,000 total invested). She then lets it grow untouched.

**Michael** starts investing \\\$200/month at age 35 and continues until age 65 (30 years of contributions = \\\$72,000 total invested).

Assuming 8% annual returns, at age 65:
- **Sarah's account**: approximately \\\$427,000
- **Michael's account**: approximately \\\$300,000

Sarah invested one-third as much money but ended up with more. That is the power of starting early — she gave her money 10 extra years to compound.

### The Dark Side: Compound Interest on Debt

The same force that builds wealth can destroy it. Credit card debt at 20% APR compounds against you:

- \\\$5,000 balance, minimum payments only (2% of balance)
- Time to pay off: approximately **45 years**
- Total paid: approximately **\\\$28,000** — more than five times the original balance

This is why Dave Ramsey calls debt an "emergency" — compound interest working against you is devastating.

### The Three Levers of Compounding

You control three variables:

1. **Amount invested**: More principal = more compounding fuel
2. **Rate of return**: Higher returns accelerate growth (but carry more risk)
3. **Time**: The most powerful lever — and the only one you cannot get back

### Practical Application: The Retirement Math

If you want \\\$1 million at age 65 with 8% average returns:
- Start at age 25: invest \\\$286/month
- Start at age 35: invest \\\$671/month
- Start at age 45: invest \\\$1,698/month

Every decade of delay more than doubles the required monthly investment.

### Key Takeaway

Compound interest rewards patience and punishes procrastination. Start investing as early as possible, even if the amounts are small. Time is the ingredient that makes compounding magical — and it is the one resource you can never recover.

> "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it."

*Resources: Khan Academy Compound Interest, Investopedia Compound Interest Calculator, The Wealthy Barber by David Chilton.*`,
    },
    {
      id: "pf-financial-goals",
      slug: "financial-goals",
      title: "Setting Financial Goals (SMART Framework)",
      content: `## Setting Financial Goals (SMART Framework)

Without clear goals, personal finance is just arithmetic. Goals give purpose to every dollar you save, invest, and spend. The SMART framework transforms vague financial wishes into actionable plans.

### Why Most People Fail at Financial Goals

A 2022 study by Fidelity Investments found that while 78% of Americans say saving money is important, only 32% have a written financial plan. The gap between intention and action is enormous because most people set goals like:

- "I want to save more money"
- "I should invest"
- "I need to get out of debt"

These are wishes, not goals. They lack specificity, deadlines, and measurement criteria.

### The SMART Framework

SMART is an acronym for five criteria that transform wishes into achievable goals:

| Letter | Stands For | Financial Example |
|--------|-----------|-------------------|
| **S** | Specific | "Save for a 6-month emergency fund" |
| **M** | Measurable | "Save \\\$15,000 total" |
| **A** | Achievable | "Save \\\$500/month from current income" |
| **R** | Relevant | "Protect my family from job loss" |
| **T** | Time-bound | "Complete by December 2026" |

**Bad goal:** "Save more money."
**SMART goal:** "Save \\\$15,000 in an emergency fund by December 2026 by automatically transferring \\\$500/month from my checking account to a high-yield savings account."

### The Three Time Horizons

Organize your financial goals by timeframe:

**Short-term (0-2 years):**
- Build a \\\$1,000 starter emergency fund
- Pay off a specific credit card
- Save for a vacation or purchase

**Medium-term (2-10 years):**
- Save a home down payment
- Pay off student loans
- Build a fully funded emergency fund (3-6 months of expenses)

**Long-term (10+ years):**
- Retire by age 60 with \\\$1.2 million
- Pay off your mortgage
- Fund children's college education

### Real-World Example: The Goal Cascade

Meet Priya, a 28-year-old software engineer earning \\\$75,000/year (about \\\$4,800/month after taxes):

**Priya's SMART Goals:**

1. **Immediate (3 months):** Save \\\$1,000 starter emergency fund by putting aside \\\$334/month
2. **Short-term (12 months):** Pay off \\\$3,600 credit card by paying \\\$300/month above minimum
3. **Medium-term (3 years):** Save \\\$30,000 home down payment by investing \\\$833/month in a high-yield savings account
4. **Long-term (32 years):** Retire at 60 with \\\$1.5M by contributing \\\$400/month to 401(k) with employer match

Priya does not tackle all goals simultaneously with equal intensity. She uses **goal sequencing** — once the emergency fund is complete, that \\\$334/month redirects to the credit card. Once the card is paid off, that \\\$300 redirects to the down payment fund.

### Prioritizing Goals: The Waterfall Method

When you cannot fund every goal at once, use this priority order:

1. **Employer 401(k) match** — This is free money. Always capture the full match first.
2. **High-interest debt** (above 7%) — Paying this off is a guaranteed return equal to the interest rate.
3. **Emergency fund** — Financial stability foundation.
4. **Medium-term goals** — Down payment, car fund, etc.
5. **Additional retirement** — Max out IRA, then 401(k).
6. **Low-interest debt** (below 4%) — Can be paid on schedule while investing.

### Tracking and Adjusting

Goals are not "set and forget." Review them quarterly:

- **On track?** Great — keep going.
- **Behind schedule?** Adjust the timeline, increase contributions, or cut expenses.
- **Life changed?** (new job, marriage, baby) Revise goals to match your new reality.

Use tools like spreadsheets, YNAB, or Mint to track progress. Visualization helps — many people use a "thermometer" chart that fills up as they approach their target.

### The Psychology of Goal Setting

Research by Dr. Gail Matthews at Dominican University found that people who write down their goals are 42% more likely to achieve them. Additional strategies:

- **Automate**: Set up automatic transfers on payday so saving happens before spending.
- **Celebrate milestones**: Reward yourself (modestly) at 25%, 50%, 75% marks.
- **Find accountability**: Share goals with a partner, friend, or financial advisor.

### Key Takeaway

Financial goals are the bridge between where you are and where you want to be. Use the SMART framework to make goals specific and actionable, organize them by time horizon, and review them regularly. The act of writing down and tracking goals dramatically increases your chances of achieving them.

> "A goal without a plan is just a wish." — Antoine de Saint-Exupery

*Resources: Khan Academy Personal Finance, Dave Ramsey's Baby Steps, Fidelity Goal Planning Tools, YNAB Goal Tracking.*`,
    },
  ],
};
