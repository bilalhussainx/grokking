import { Module } from "../types";

export const foundationsModule: Module = {
  id: "pf-foundations",
  title: "Foundations of Personal Finance",
  description: "Understand the core concepts that underpin all personal finance decisions — income, expenses, net worth, the time value of money, and goal setting. Resources: Khan Academy Personal Finance, The Wealthy Barber by David Chilton, Investopedia.",
  lessons: [
    {
      id: "pf-what-is-personal-finance",
      slug: "what-is-personal-finance",
      title: "What is Personal Finance?",
      content: `## What is Personal Finance?

Personal finance is the practice of managing your money to achieve your life goals. It encompasses every financial decision you make — from daily spending to long-term investing. Unlike corporate finance or public finance, personal finance is about **you**: your income, your expenses, your future.

\`\`\`concept
{
  "title": "Why This Matters",
  "variant": "mental-model",
  "content": "According to a 2023 Bankrate survey, 57% of American adults cannot cover a $1,000 emergency expense from savings. Financial literacy is not taught in most schools, leaving millions to learn through costly mistakes. This course changes that."
}
\`\`\`

### The Five Pillars of Personal Finance

Personal finance is built on five interconnected pillars. Every financial decision you make falls into one of these categories:

\`\`\`steps
{
  "title": "The Five Pillars",
  "steps": [
    {
      "title": "Earning",
      "content": "How do you maximize your income?\\n\\nThis includes salary negotiation, career development, side hustles, and passive income streams. Your earning power is your **financial engine** — everything else depends on it.\\n\\n**Key question:** Am I earning what I'm worth, and how can I increase my income?"
    },
    {
      "title": "Spending",
      "content": "Where does your money actually go?\\n\\nThis covers budgeting, needs vs wants, and lifestyle design. Most people have no idea where 30-40% of their money goes each month.\\n\\n**Key question:** Can I tell you where every dollar went last month?"
    },
    {
      "title": "Saving",
      "content": "Are you prepared for the unexpected?\\n\\nEmergency funds, short-term savings goals, and building a financial buffer. This is your **defense** — the foundation that prevents one bad month from becoming a financial disaster.\\n\\n**Key question:** Could I survive 3-6 months without income?"
    },
    {
      "title": "Investing",
      "content": "How do you grow your wealth over time?\\n\\nStocks, bonds, real estate, retirement accounts. Investing is how you make your money work **for you** instead of just sitting in a bank account losing value to inflation.\\n\\n**Key question:** Is my money growing faster than inflation?"
    },
    {
      "title": "Protecting",
      "content": "How do you keep what you've built?\\n\\nInsurance, estate planning, tax optimization. This is the pillar most people ignore until disaster strikes — and then it's too late.\\n\\n**Key question:** What happens to my finances if something goes wrong?"
    }
  ]
}
\`\`\`

### The Personal Finance Lifecycle

Your financial priorities shift as you move through life stages:

\`\`\`mermaid
graph LR
    A["20s: Build Foundation"] --> B["30s-40s: Grow & Protect"]
    B --> C["50s: Maximize & Catch Up"]
    C --> D["60s+: Harvest & Transfer"]

    style A fill:#06b6d4,color:#fff,stroke:none
    style B fill:#8b5cf6,color:#fff,stroke:none
    style C fill:#f59e0b,color:#fff,stroke:none
    style D fill:#10b981,color:#fff,stroke:none
\`\`\`

\`\`\`tabs
{
  "tabs": [
    {
      "label": "20s",
      "icon": "🚀",
      "content": "**Priority: Build the foundation**\\n\\n- Build a starter emergency fund ($1,000)\\n- Pay off high-interest debt aggressively\\n- Start investing — even $50/month matters enormously because of compound interest\\n- Develop your earning power through skills and career moves\\n\\n**Why this matters now:** Time is your greatest asset. $100/month invested at age 25 becomes ~$350,000 by age 65 at 8% returns."
    },
    {
      "label": "30s-40s",
      "icon": "📈",
      "content": "**Priority: Grow and protect**\\n\\n- Maximize retirement contributions (401k, IRA)\\n- Consider homeownership (if it makes financial sense in your market)\\n- Get proper insurance (life, disability, umbrella)\\n- Invest consistently — this is your peak compounding decade\\n\\n**Why this matters now:** These are typically your highest earning years. What you do here determines your retirement timeline."
    },
    {
      "label": "50s",
      "icon": "⚡",
      "content": "**Priority: Maximize and catch up**\\n\\n- Take advantage of 'catch-up' contribution limits ($7,500 extra to 401k)\\n- Pay off your mortgage if possible\\n- Begin estate planning\\n- Shift investments toward more conservative allocation\\n\\n**Why this matters now:** You're in the home stretch. Every extra dollar invested now has 10-15 years to compound."
    },
    {
      "label": "60s+",
      "icon": "🌴",
      "content": "**Priority: Harvest and transfer**\\n\\n- Draw down investments strategically (minimize tax impact)\\n- Manage healthcare costs (Medicare, supplemental insurance)\\n- Execute estate plan — transfer wealth to next generation\\n- Enjoy the freedom your earlier decisions created\\n\\n**Why this matters now:** Smart withdrawal strategies can save tens of thousands in taxes over retirement."
    }
  ]
}
\`\`\`

### The Latte Factor: Small Decisions, Big Impact

\`\`\`callout
{
  "type": "concept",
  "title": "The Latte Factor (David Bach)",
  "content": "A $5 daily coffee habit costs $1,825/year. Invested at 7% annual returns over 30 years, that money would grow to approximately $172,000. This isn't about depriving yourself of coffee — it's about being intentional with every dollar."
}
\`\`\`

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "See the Latte Factor in Action",
  "inputs": [
    { "id": "p", "label": "Daily Spending", "default": 5, "min": 1, "max": 50, "prefix": "$" },
    { "id": "r", "label": "Annual Return", "default": 7, "min": 1, "max": 15, "suffix": "%" },
    { "id": "t", "label": "Years", "default": 30, "min": 1, "max": 50, "suffix": " years" }
  ]
}
\`\`\`

### Common Misconceptions

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Common Myths",
    "code": "I don't earn enough to worry about finance\\nI'll start investing when I'm older\\nRich people don't budget\\nI need to be a math genius\\nInvesting is just gambling",
    "language": "plaintext"
  },
  "after": {
    "label": "Reality",
    "code": "Lower income = every dollar matters MORE\\nStarting at 25 vs 35 = hundreds of thousands difference\\nMost millionaires are meticulous about tracking money\\nBasic arithmetic is all you need\\nInvesting is evidence-based wealth building",
    "language": "plaintext"
  }
}
\`\`\`

### Your Financial Snapshot

Before diving deeper, honestly assess where you stand:

\`\`\`quiz
{
  "title": "Financial Self-Assessment",
  "questions": [
    {
      "question": "Which of these is the MOST important number in personal finance?",
      "options": ["Your salary", "Your net worth", "Your credit score", "Your savings account balance"],
      "answer": 1,
      "explanation": "Net worth (assets minus liabilities) is the true scorecard. A high salary with high debt means negative net worth. We'll deep-dive into this in the next lesson."
    },
    {
      "question": "If you invest $100/month starting at age 25 at 8% returns, approximately how much will you have at 65?",
      "options": ["$48,000", "$100,000", "$175,000", "$350,000"],
      "answer": 3,
      "explanation": "Thanks to compound interest, $100/month for 40 years at 8% grows to roughly $350,000. You only contributed $48,000 — the rest is compound growth. This is why starting early matters so much."
    },
    {
      "question": "What is the 'Latte Factor'?",
      "options": ["A coffee-based investment strategy", "The idea that small daily expenses compound into large amounts over time", "A tax deduction for food expenses", "A type of compound interest"],
      "answer": 1,
      "explanation": "The Latte Factor (coined by David Bach) illustrates how small, recurring expenses — like a daily $5 coffee — add up to massive amounts over decades, especially when you consider the opportunity cost of not investing that money."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Personal finance rests on five pillars: Earning, Spending, Saving, Investing, and Protecting",
    "Your financial priorities shift with each life stage — start where you are",
    "Small daily decisions compound into enormous differences over decades",
    "Income is not wealth — the gap between income and spending is what matters",
    "The single most powerful force in finance is time (through compound interest)"
  ]
}
\`\`\`

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

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Earned Income",
      "icon": "💼",
      "content": "**Salary, wages, freelancing, tips**\\n\\nThis is what most people think of as 'income.' It's taxed at ordinary income rates (the highest tax rates).\\n\\n**Key insight:** Earned income is limited by your time. There are only so many hours you can work. This is why the other income types matter — they're not time-bound."
    },
    {
      "label": "Investment Income",
      "icon": "📊",
      "content": "**Dividends, interest, capital gains**\\n\\nMoney your money earns for you. Often taxed at lower rates than earned income (long-term capital gains max at 20% vs up to 37% for earned income).\\n\\n**Key insight:** This is the income type that makes wealth self-sustaining. Once your investments generate enough to cover expenses, you've achieved financial independence."
    },
    {
      "label": "Passive Income",
      "icon": "🏠",
      "content": "**Rental properties, royalties, business ownership**\\n\\nIncome that requires minimal ongoing effort (though it usually requires significant upfront effort or capital).\\n\\n**Key insight:** True passive income is rare — most 'passive' income sources require some maintenance. But they scale differently than trading time for money."
    },
    {
      "label": "Transfer Income",
      "icon": "🎁",
      "content": "**Social Security, gifts, inheritance**\\n\\nMoney received without exchange of goods or services. Special tax rules apply to each type.\\n\\n**Key insight:** Don't build your financial plan around expected inheritances or windfalls. Treat these as bonuses, not foundations."
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Gross vs Net — A Critical Distinction",
  "content": "Your gross income is the total before taxes and deductions. Your net income (take-home pay) is what actually hits your bank account. ALWAYS budget around net income, not gross. A $75,000 salary might only be $4,800/month after taxes, benefits, and retirement contributions."
}
\`\`\`

### The Wealth Equation

\`\`\`concept
{
  "title": "The Fundamental Wealth Formula",
  "variant": "mental-model",
  "content": "Wealth = (Income - Expenses) x Time x Rate of Return\\n\\nYou control all four variables. But the gap between income and expenses — your savings rate — is the most impactful one to optimize."
}
\`\`\`

If you earn \\$4,000/month and spend \\$3,800, you save \\$200. If you earn \\$4,000 and spend \\$3,000, you save \\$1,000. The second scenario doesn't require earning more — it requires spending less. **The gap is everything.**

### Net Worth: The True Scorecard

\`\`\`concept
{
  "title": "Net Worth Formula",
  "variant": "mental-model",
  "content": "Net Worth = Total Assets - Total Liabilities\\n\\nAssets: cash, investments, retirement accounts, real estate, vehicles\\nLiabilities: credit cards, student loans, mortgage, car loans"
}
\`\`\`

### The Tale of Two People

This example will change how you think about money:

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Person A — $80K salary",
    "code": "Savings account:     $2,000\\nRetirement account:  $5,000\\nCar value:          $25,000\\nCredit card debt:   -$12,000\\nStudent loans:      -$45,000\\nCar loan:           -$20,000\\n────────────────────────────\\nNET WORTH:          -$45,000"
  },
  "after": {
    "label": "Person B — $50K salary",
    "code": "Savings account:    $15,000\\nRetirement account: $40,000\\nCar value:           $8,000\\nCredit card debt:        $0\\nStudent loans:      -$10,000\\nCar loan:                $0\\n────────────────────────────\\nNET WORTH:          +$53,000"
  }
}
\`\`\`

\`\`\`concept
{
  "title": "Income ≠ Wealth",
  "variant": "insight",
  "content": "Person A earns 60% more but has a net worth that is $98,000 LESS. The person with the higher salary bought the expensive car (with a loan), carried credit card debt, and didn't prioritize retirement savings. Income is vanity. Net worth is sanity."
}
\`\`\`

### The Savings Rate

Your savings rate is the most actionable metric in personal finance:

\`\`\`playground
{
  "title": "Calculate Your Savings Rate",
  "language": "javascript",
  "code": "// Try changing these numbers to your own\\nconst monthlyIncome = 4000;  // after taxes\\nconst monthlyExpenses = 3200;\\n\\nconst monthlySavings = monthlyIncome - monthlyExpenses;\\nconst savingsRate = (monthlySavings / monthlyIncome * 100).toFixed(1);\\nconst annualSavings = monthlySavings * 12;\\n\\nconsole.log(\\"Monthly savings: $\\" + monthlySavings);\\nconsole.log(\\"Savings rate: \\" + savingsRate + \\"%\\");\\nconsole.log(\\"Annual savings: $\\" + annualSavings);\\n\\n// How long to build a 6-month emergency fund?\\nconst emergencyTarget = monthlyExpenses * 6;\\nconst monthsToEmergencyFund = Math.ceil(emergencyTarget / monthlySavings);\\nconsole.log(\\"\\\\n6-month emergency fund target: $\\" + emergencyTarget);\\nconsole.log(\\"Months to reach it: \\" + monthsToEmergencyFund);",
  "runnable": true
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Savings Rate Benchmarks",
  "content": "Most financial advisors recommend saving at least 20% of gross income. The FIRE (Financial Independence, Retire Early) community targets 50%+. But even 10% is a strong start — the key is to start and increase over time."
}
\`\`\`

\`\`\`quiz
{
  "title": "Test Your Understanding",
  "questions": [
    {
      "question": "Person A earns $100K but spends $95K. Person B earns $60K but spends $40K. Who is building wealth faster?",
      "options": ["Person A — higher income", "Person B — higher savings rate", "They're equal", "Can't determine without knowing investments"],
      "answer": 1,
      "explanation": "Person B saves $20,000/year (33% savings rate) vs Person A's $5,000/year (5% savings rate). Person B is building wealth 4x faster despite earning 40% less. The savings RATE matters more than the income amount."
    },
    {
      "question": "Your net worth is -$15,000. Which action has the BIGGEST impact?",
      "options": ["Get a 5% raise", "Pay off a $12,000 credit card at 22% APR", "Start investing $200/month", "Switch to a cheaper phone plan"],
      "answer": 1,
      "explanation": "Paying off the credit card eliminates $2,640/year in interest charges AND improves net worth by $12,000. The 22% guaranteed 'return' from eliminating debt beats any realistic investment return."
    },
    {
      "question": "Why is net worth a better measure of financial health than income?",
      "options": ["It's easier to calculate", "It includes all assets and debts", "It's required for taxes", "It's what banks care about most"],
      "answer": 1,
      "explanation": "Net worth provides a complete picture by subtracting what you owe from what you own. Someone with high income but high debt might have negative net worth, while someone with modest income but low debt and good savings could have positive net worth."
    }
  ]
}
\`\`\`

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "See How Your Savings Rate Grows Over Time",
  "inputs": [
    { "id": "monthly", "label": "Monthly Savings", "default": 1000, "min": 100, "max": 10000, "prefix": "$" },
    { "id": "rate", "label": "Annual Return", "default": 7, "min": 1, "max": 15, "suffix": "%" },
    { "id": "years", "label": "Years", "default": 20, "min": 1, "max": 40, "suffix": " years" }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Always budget around NET income (take-home pay), never gross",
    "The gap between income and expenses determines wealth — not income alone",
    "Net worth is the true financial scorecard: Assets minus Liabilities",
    "Track your savings rate monthly — it's the most actionable metric you have",
    "Paying off high-interest debt is mathematically equivalent to a guaranteed high-return investment"
  ]
}
\`\`\`

> "It is not your salary that makes you rich; it is your spending habits." — Charles A. Jaffe`,
    },
    {
      id: "pf-time-value-of-money",
      slug: "time-value-of-money",
      title: "The Time Value of Money",
      content: `## The Time Value of Money

The time value of money (TVM) is arguably the single most important concept in all of finance. It states that **a dollar today is worth more than a dollar tomorrow**. This principle underpins every financial decision, from savings accounts to mortgages to retirement planning.

\`\`\`concept
{
  "title": "Core Principle",
  "variant": "mental-model",
  "content": "A dollar today is worth more than a dollar tomorrow — because today's dollar can be invested to earn returns, because inflation erodes purchasing power, and because the future is uncertain."
}
\`\`\`

### Why Money Has a Time Value

\`\`\`steps
{
  "title": "The Three Forces",
  "steps": [
    {
      "title": "Opportunity Cost",
      "content": "Money in hand can be invested to earn returns. A dollar today, invested at 7%, becomes $1.07 in one year.\\n\\n**Think of it this way:** If someone offers you $100 today or $100 next year, taking it today and investing it means you'd have $107 next year. The $100-next-year option cost you $7 in missed growth."
    },
    {
      "title": "Inflation",
      "content": "The purchasing power of money erodes over time. At 3% inflation, what costs $100 today will cost $103 next year.\\n\\n**Real-world impact:** $1,000 in a checking account earning 0% interest loses about $30 in purchasing power every year. Your money is actually shrinking if it's not growing."
    },
    {
      "title": "Uncertainty (Risk)",
      "content": "A promised future payment carries risk — the payer might default, circumstances might change, or you might need the money before then.\\n\\n**This is why:** Banks charge interest on loans, bonds pay yields, and 'a bird in hand is worth two in the bush.'"
    }
  ]
}
\`\`\`

### Present Value and Future Value

These are the two core TVM calculations. Master them and you can evaluate any financial decision.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Future Value",
      "icon": "📈",
      "content": "**What will my money be worth later?**\\n\\n\`\`\`\\nFV = PV × (1 + r)^n\\n\\nPV = Present Value (amount today)\\nr  = Interest rate per period\\nn  = Number of periods\\n\`\`\`\\n\\n**Example:** You invest $1,000 at 5% annual interest for 10 years.\\n\\n\`\`\`\\nFV = 1,000 × (1.05)^10\\nFV = 1,000 × 1.6289\\nFV = $1,628.89\\n\`\`\`\\n\\nYour money grew by $628.89 without you doing anything."
    },
    {
      "label": "Present Value",
      "icon": "📉",
      "content": "**What is a future amount worth today?**\\n\\n\`\`\`\\nPV = FV / (1 + r)^n\\n\`\`\`\\n\\n**Example:** Someone offers you $10,000 five years from now. If you can earn 6% elsewhere, what is that offer worth today?\\n\\n\`\`\`\\nPV = 10,000 / (1.06)^5\\nPV = 10,000 / 1.3382\\nPV = $7,472.58\\n\`\`\`\\n\\nThat future $10,000 is only worth $7,472.58 in today's dollars. You'd need $7,472.58 today, invested at 6%, to have $10,000 in five years."
    }
  ]
}
\`\`\`

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Compound Interest Calculator",
  "inputs": [
    { "id": "principal", "label": "Initial Investment", "default": 1000, "min": 0, "max": 1000000, "prefix": "$" },
    { "id": "rate", "label": "Annual Interest Rate", "default": 7, "min": 0, "max": 20, "suffix": "%" },
    { "id": "years", "label": "Years to Grow", "default": 10, "min": 1, "max": 50, "suffix": " years" }
  ]
}
\`\`\`

### The Rule of 72

\`\`\`concept
{
  "title": "The Rule of 72",
  "variant": "rule",
  "content": "Years to double your money = 72 ÷ Interest Rate\\n\\nAt 6% → doubles in 12 years\\nAt 8% → doubles in 9 years\\nAt 10% → doubles in 7.2 years\\nAt 12% → doubles in 6 years"
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "The Rule of 72 In Action",
  "content": "At 8% returns (close to the historical stock market average), your money doubles every 9 years. Start with $10,000 at age 25: $10K → $20K (age 34) → $40K (age 43) → $80K (age 52) → $160K (age 61). That's $160,000 from a single $10,000 investment, without adding another dollar."
}
\`\`\`

### Real-World Application: Lottery Winnings

\`\`\`callout
{
  "type": "info",
  "title": "Why the Lump Sum is Always Less",
  "content": "When someone wins a $100 million lottery, they're offered ~$60 million lump sum or $100 million over 30 years. Why the huge difference? The lottery commission calculates that $60 million invested today would grow to $100 million over 30 years. They're applying TVM — and most financial advisors recommend the lump sum because YOU can invest it and potentially beat their assumed rate of return."
}
\`\`\`

### TVM in Daily Decisions

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Without TVM Thinking",
    "code": "Pay minimum on credit card\\nDelay investing until later\\nTake the payment plan\\nIgnore inflation"
  },
  "after": {
    "label": "With TVM Thinking",
    "code": "Pay off 20% card = guaranteed 20% return\\nStart investing now = decades more compounding\\nCalculate true cost of financing\\nInvest to beat inflation"
  }
}
\`\`\`

\`\`\`algoviz
{
  "title": "Compound Growth Visualization",
  "type": "array",
  "data": [1000, 1070, 1145, 1225, 1311, 1403, 1501, 1606, 1719, 1839, 1968],
  "frames": [
    { "highlight": [0], "label": "Year 0: $1,000 initial investment", "stats": { "year": 0, "value": 1000 } },
    { "highlight": [1], "label": "Year 1: $1,070 (7% growth)", "stats": { "year": 1, "value": 1070 } },
    { "highlight": [2], "label": "Year 2: $1,145 (interest on interest)", "stats": { "year": 2, "value": 1145 } },
    { "highlight": [5], "label": "Year 5: $1,403 (40% total growth)", "stats": { "year": 5, "value": 1403 } },
    { "highlight": [10], "label": "Year 10: $1,968 (97% total growth)", "stats": { "year": 10, "value": 1968 } }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`quiz
{
  "title": "Time Value of Money",
  "questions": [
    {
      "question": "You can receive $10,000 today or $12,000 in two years. If you can earn 8% annually, which is better?",
      "options": ["$10,000 today", "$12,000 in two years", "They're exactly equal", "Need more information"],
      "answer": 1,
      "explanation": "$10,000 today invested at 8% for 2 years = $10,000 × (1.08)² = $11,664. The $12,000 in 2 years has a present value of $12,000 / (1.08)² = $10,288. The $12,000 future option is worth more ($10,288 > $10,000)."
    },
    {
      "question": "Using the Rule of 72, how long does it take to double your money at 6% interest?",
      "options": ["6 years", "8 years", "12 years", "15 years"],
      "answer": 2,
      "explanation": "72 ÷ 6 = 12 years. This is a quick mental math shortcut that's surprisingly accurate for compound growth estimates."
    },
    {
      "question": "Which of these is NOT a reason money has a time value?",
      "options": ["Opportunity cost of investing", "Inflation erodes purchasing power", "Money gets physically damaged over time", "Future payments carry uncertainty/risk"],
      "answer": 2,
      "explanation": "The three drivers of TVM are opportunity cost, inflation, and uncertainty. Physical deterioration of currency is not a factor — money doesn't 'wear out' in any meaningful financial sense."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "A dollar today is worth more than a dollar tomorrow — this is the foundation of all finance",
    "Future Value tells you what today's money becomes; Present Value tells you what future money is worth now",
    "The Rule of 72: divide 72 by the interest rate to estimate doubling time",
    "Every financial decision is a trade-off across time — TVM helps you make that trade-off rationally",
    "Three forces drive TVM: opportunity cost, inflation, and uncertainty"
  ]
}
\`\`\`

> "The most powerful force in the universe is compound interest." — Attributed to Albert Einstein`,
    },
    {
      id: "pf-compound-interest",
      slug: "compound-interest",
      title: "Compound Interest: The 8th Wonder",
      content: `## Compound Interest: The 8th Wonder

Compound interest is what happens when your interest earns interest. It's the mechanism that turns small, consistent investments into substantial wealth — and the same force that makes debt spiral out of control.

### Simple vs Compound Interest

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Simple Interest",
    "code": "Interest = Principal x Rate x Time\\n\\n$1,000 at 5% for 10 years:\\n$1,000 x 0.05 x 10 = $500\\n\\nTotal: $1,500\\n\\n(Interest calculated on original\\n principal only — linear growth)"
  },
  "after": {
    "label": "Compound Interest",
    "code": "Total = Principal x (1 + Rate)^Time\\n\\n$1,000 at 5% for 10 years:\\n$1,000 x (1.05)^10 = $1,628.89\\n\\nTotal: $1,628.89\\n\\n(Interest calculated on principal\\n + accumulated interest — exponential!)"
  }
}
\`\`\`

The difference is \\$128.89 over 10 years. That seems modest. But watch what happens as we extend the timeline:

\`\`\`algoviz
{
  "title": "The Compounding Snowball — See It Grow",
  "type": "array",
  "data": [10000, 10800, 11664, 12597, 13605, 14693, 15869, 17138, 18509, 19990, 21589, 23316, 25181, 27196, 29372, 31722, 34260, 37001, 39961, 43158, 46611, 50340, 54367, 58716, 63413, 68486, 73965, 79882, 86273, 93175, 100629, 108679, 117374, 126764, 136905, 147857, 159686, 172461, 186258, 201159],
  "frames": [
    { "highlight": [0, 1], "label": "Year 1: $10,000 grows to $10,800", "stats": {"year": 1, "balance": 10800} },
    { "highlight": [0, 5], "label": "Year 5: Balance reaches $14,693", "stats": {"year": 5, "balance": 14693} },
    { "highlight": [0, 10], "label": "Year 10: $21,589 (more than double)", "stats": {"year": 10, "balance": 21589} },
    { "highlight": [0, 20], "label": "Year 20: $46,611 (nearly 5x original)", "stats": {"year": 20, "balance": 46611} },
    { "highlight": [0, 30], "label": "Year 30: $100,629 (10x original!) — compound wins", "stats": {"year": 30, "balance": 100629} }
  ],
  "speed": 1000
}
\`\`\`

After 30 years, compound interest produces **10 times more** than simple interest. The growth is exponential, not linear — it accelerates over time.

### The Story That Changes Everything

\`\`\`concept
{
  "title": "Sarah vs Michael — The $103,000 Head Start",
  "variant": "mental-model",
  "content": "Sarah invests $200/month from age 25 to 35, then STOPS. Total invested: $24,000.\\nMichael invests $200/month from age 35 to 65, never stopping. Total invested: $72,000.\\n\\nAt 8% returns, age 65:\\n• Sarah: ~$427,000 (from just $24,000!)\\n• Michael: ~$300,000 (from $72,000)\\n\\nSarah invested ONE-THIRD as much money but ended up with MORE. She gave her money 10 extra years to compound."
}
\`\`\`

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Sarah vs Michael — Run the Numbers",
  "inputs": [
    { "id": "p", "label": "Monthly Investment", "default": 200, "min": 0, "max": 1000, "prefix": "$" },
    { "id": "r", "label": "Annual Return", "default": 8, "min": 0, "max": 15, "suffix": "%" },
    { "id": "t1", "label": "Sarah's Investing Years", "default": 10, "min": 1, "max": 40, "suffix": " years" },
    { "id": "t2", "label": "Michael's Investing Years", "default": 30, "min": 1, "max": 40, "suffix": " years" }
  ]
}
\`\`\`

### The Dark Side: Compound Interest on Debt

\`\`\`callout
{
  "type": "warning",
  "title": "Compounding Works Against You Too",
  "content": "A $5,000 credit card balance at 20% APR with minimum payments only:\\n• Time to pay off: approximately 45 YEARS\\n• Total paid: approximately $28,000\\n• That's more than 5x the original balance\\n\\nThis is why Dave Ramsey calls debt an 'emergency' — compound interest working against you is devastating."
}
\`\`\`

### The Three Levers of Compounding

\`\`\`steps
{
  "title": "What You Control",
  "steps": [
    {
      "title": "Amount Invested (Principal)",
      "content": "More fuel = bigger fire. Even small increases matter because they compound.\\n\\nIncreasing from $200/month to $300/month (just $100 more) at 8% over 30 years adds an extra **$150,000** to your final balance."
    },
    {
      "title": "Rate of Return",
      "content": "Higher returns accelerate growth — but carry more risk.\\n\\n$10,000 over 30 years at:\\n- 6%: $57,435\\n- 8%: $100,627\\n- 10%: $174,494\\n\\nThe difference between 6% and 10% is **3x** the final amount. This is why asset allocation matters."
    },
    {
      "title": "Time (The Most Powerful Lever)",
      "content": "Time is the only lever you can never get back.\\n\\nTo reach $1 million at 65 with 8% returns:\\n- Start at 25: invest $286/month\\n- Start at 35: invest $671/month\\n- Start at 45: invest $1,698/month\\n\\nEvery decade of delay more than DOUBLES the required investment."
    }
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Compound Interest Mastery",
  "questions": [
    {
      "question": "What is the key difference between simple and compound interest?",
      "options": ["Simple interest uses higher rates", "Compound interest calculates interest on interest", "Simple interest compounds more frequently", "There is no practical difference"],
      "answer": 1,
      "explanation": "Compound interest calculates interest on the principal PLUS previously accumulated interest. This creates exponential growth instead of linear growth."
    },
    {
      "question": "Why did Sarah end up with more than Michael despite investing less?",
      "options": ["She got a higher interest rate", "She invested more per month", "She gave her money 10 more years to compound", "She used a different type of account"],
      "answer": 2,
      "explanation": "Sarah's money had 40 years to compound (ages 25-65) vs Michael's 30 years (ages 35-65). Those 10 extra years of compounding more than made up for her smaller total contributions."
    },
    {
      "question": "A $5,000 credit card at 20% APR with minimum payments costs approximately $28,000 total. What does this illustrate?",
      "options": ["Credit cards are a scam", "Minimum payments are calculated incorrectly", "Compound interest works against you on debt just as powerfully as it works for you on investments", "You should never use credit cards"],
      "answer": 2,
      "explanation": "Compound interest is a neutral force — it multiplies whatever direction it's applied in. On investments, it builds wealth. On debt, it compounds against you. The lesson isn't to avoid credit cards, but to never carry a balance."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Compound interest = interest earning interest = exponential growth",
    "Starting 10 years earlier can matter more than investing 3x as much money",
    "The three levers: amount invested, rate of return, and TIME (the most powerful)",
    "Compound interest on debt is equally devastating — pay off high-interest debt first",
    "Every decade of delay roughly doubles the monthly investment needed to reach the same goal"
  ]
}
\`\`\`

> "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it."

*Resources: Khan Academy Compound Interest, Investopedia Compound Interest Calculator, The Wealthy Barber by David Chilton.*`,
    },
    {
      id: "pf-financial-goals",
      slug: "financial-goals",
      title: "Setting Financial Goals (SMART Framework)",
      content: `## Setting Financial Goals (SMART Framework)

Without clear goals, personal finance is just arithmetic. Goals give purpose to every dollar you save, invest, and spend. The SMART framework transforms vague financial wishes into actionable plans.

\`\`\`callout
{
  "type": "info",
  "title": "The Intention-Action Gap",
  "content": "A 2022 Fidelity study found that 78% of Americans say saving money is important, but only 32% have a written financial plan. This lesson closes that gap by giving you a framework that actually works."
}
\`\`\`

### Wishes vs Goals

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Vague Wishes",
    "code": "I want to save more money\\nI should invest\\nI need to get out of debt\\nI'll start saving eventually\\nI want to be rich"
  },
  "after": {
    "label": "SMART Goals",
    "code": "Save $15,000 emergency fund by Dec 2026\\nInvest $500/month in index funds starting Jan\\nPay off $3,600 credit card in 12 months\\nAutomate $200/month transfer starting Friday\\nReach $500K net worth by age 45"
  }
}
\`\`\`

### The SMART Framework

\`\`\`steps
{
  "title": "Building a SMART Financial Goal",
  "steps": [
    {
      "title": "S — Specific",
      "content": "**Bad:** 'Save more money'\\n**Good:** 'Save for a 6-month emergency fund'\\n\\nA specific goal answers: What exactly am I trying to achieve? Why does it matter? What does success look like?"
    },
    {
      "title": "M — Measurable",
      "content": "**Bad:** 'Save a lot'\\n**Good:** 'Save $15,000 total'\\n\\nA measurable goal has a number attached. You can track progress: Am I at $3,000 of $15,000? That's 20% done."
    },
    {
      "title": "A — Achievable",
      "content": "**Bad:** 'Save $5,000/month on a $4,000 salary'\\n**Good:** 'Save $500/month from current income'\\n\\nThe goal should stretch you but not break you. An impossible goal becomes demotivating."
    },
    {
      "title": "R — Relevant",
      "content": "**Bad:** 'Save for a boat' (when you have credit card debt at 22%)\\n**Good:** 'Pay off high-interest debt to stop losing $2,640/year to interest'\\n\\nThe goal should align with your current financial reality and priorities."
    },
    {
      "title": "T — Time-bound",
      "content": "**Bad:** 'Save $15,000 someday'\\n**Good:** 'Save $15,000 by December 2026'\\n\\nA deadline creates urgency. Without one, 'someday' becomes 'never.' It also lets you calculate: $15,000 ÷ 18 months = $833/month."
    }
  ]
}
\`\`\`

### The Three Time Horizons

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Short-term (0-2 years)",
      "icon": "🎯",
      "content": "- Build a $1,000 starter emergency fund\\n- Pay off a specific credit card\\n- Save for a vacation or large purchase\\n- Build 1 month of expense buffer\\n\\n**Where to keep this money:** High-yield savings account (4-5% APY). You need quick access and zero risk."
    },
    {
      "label": "Medium-term (2-10 years)",
      "icon": "🏠",
      "content": "- Save a home down payment ($30K-60K+)\\n- Pay off student loans\\n- Build a fully funded emergency fund (3-6 months expenses)\\n- Save for starting a business\\n\\n**Where to keep this money:** Mix of high-yield savings and conservative investments (bond funds, CDs). Some growth, low risk."
    },
    {
      "label": "Long-term (10+ years)",
      "icon": "🌅",
      "content": "- Retire by age 60 with $1.2M\\n- Pay off your mortgage\\n- Fund children's college education\\n- Achieve financial independence\\n\\n**Where to keep this money:** Diversified investment portfolio (stock index funds, bonds). You have time to ride out market volatility."
    }
  ]
}
\`\`\`

### Real-World Example: Goal Sequencing

\`\`\`collapse
{
  "title": "Deep Dive: Priya's Goal Cascade",
  "content": "Priya, 28, software engineer, $75K salary ($4,800/month after taxes):\\n\\n1. Immediate (3 months): $1,000 emergency fund → $334/month\\n2. Short-term (12 months): Pay off $3,600 credit card → $300/month above minimum\\n3. Medium-term (3 years): $30K home down payment → $833/month\\n4. Long-term (32 years): Retire at 60 with $1.5M → $400/month to 401(k)\\n\\nKey: She doesn't tackle all goals equally. When the emergency fund is done, that $334/month redirects to the credit card. When the card is paid off, that $300/month redirects to the down payment. This is goal sequencing."
}
\`\`\`

### Prioritizing: The Waterfall Method

When you can't fund every goal at once, use this priority order:

1. **Employer 401(k) match** — This is free money (100% return). Always capture the full match.
2. **High-interest debt** (above 7%) — Guaranteed return equal to the interest rate.
3. **Emergency fund** — Financial stability foundation.
4. **Medium-term goals** — Down payment, car fund, etc.
5. **Additional retirement** — Max out IRA, then 401(k).
6. **Low-interest debt** (below 4%) — Pay on schedule while investing.

\`\`\`callout
{
  "type": "tip",
  "title": "The Science of Goal Achievement",
  "content": "Research by Dr. Gail Matthews (Dominican University) found that people who WRITE DOWN their goals are 42% more likely to achieve them. Three amplifiers: (1) Automate — set up transfers on payday, (2) Celebrate milestones at 25/50/75%, (3) Find accountability — share goals with someone."
}
\`\`\`

\`\`\`playground
{
  "title": "Build Your Goal Plan",
  "language": "javascript",
  "code": "// Customize these to your situation\\nconst monthlyIncome = 4800;  // after taxes\\nconst monthlyExpenses = 3500;\\nconst availableForGoals = monthlyIncome - monthlyExpenses;\\n\\n// Define your goals\\nconst goals = [\\n  { name: 'Emergency Fund', target: 6000, priority: 1 },\\n  { name: 'Credit Card Payoff', target: 3600, priority: 2 },\\n  { name: 'Home Down Payment', target: 30000, priority: 3 },\\n];\\n\\nconsole.log('Monthly available for goals: $' + availableForGoals);\\nconsole.log('─'.repeat(50));\\n\\nlet remaining = availableForGoals;\\nfor (const goal of goals.sort((a,b) => a.priority - b.priority)) {\\n  const monthsNeeded = Math.ceil(goal.target / remaining);\\n  console.log(\\n    '\\\\n' + goal.priority + '. ' + goal.name +\\n    '\\\\n   Target: $' + goal.target.toLocaleString() +\\n    '\\\\n   Monthly allocation: $' + remaining +\\n    '\\\\n   Time to complete: ' + monthsNeeded + ' months' +\\n    '\\\\n   (Then this $' + remaining + '/mo redirects to next goal)'\\n  );\\n}"
}
\`\`\`

\`\`\`quiz
{
  "title": "Goal Setting Mastery",
  "questions": [
    {
      "question": "Which of these is a SMART financial goal?",
      "options": ["Save more money this year", "Be debt-free someday", "Save $500/month for 24 months to build a $12,000 emergency fund", "Invest when I can afford it"],
      "answer": 2,
      "explanation": "This goal is Specific ($12K emergency fund), Measurable ($500/month), Achievable (defined monthly amount), Relevant (financial security), and Time-bound (24 months)."
    },
    {
      "question": "In the Waterfall Method, what should you fund FIRST?",
      "options": ["Emergency fund", "High-interest debt payoff", "Employer 401(k) match", "Home down payment"],
      "answer": 2,
      "explanation": "The employer 401(k) match is effectively a 50-100% guaranteed return on your money. No other option beats free money. Always capture the full match before anything else."
    },
    {
      "question": "What is 'goal sequencing'?",
      "options": ["Setting goals in alphabetical order", "Completing one goal before starting the next, redirecting freed-up cash flow", "Having multiple savings accounts", "Setting only one goal at a time"],
      "answer": 1,
      "explanation": "Goal sequencing means focusing your resources on one priority at a time. When a goal is complete, the monthly cash flow that was going toward it redirects to the next goal, creating a snowball effect."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) turn wishes into plans",
    "Organize goals into short-term (0-2yr), medium-term (2-10yr), and long-term (10yr+)",
    "Use the Waterfall Method: 401k match → high-interest debt → emergency fund → everything else",
    "Goal sequencing creates a snowball effect — freed-up cash flow cascades to the next priority",
    "Writing down goals makes you 42% more likely to achieve them — automation makes it nearly certain"
  ]
}
\`\`\`

> "A goal without a plan is just a wish." — Antoine de Saint-Exupery

*Resources: Khan Academy Personal Finance, Dave Ramsey's Baby Steps, Fidelity Goal Planning Tools, YNAB Goal Tracking.*`,
    },
  ],
};
