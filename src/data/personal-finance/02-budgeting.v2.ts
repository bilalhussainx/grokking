import { Module } from "../types";

export const budgetingModule: Module = {
  id: "pf-budgeting",
  title: "Budgeting & Cash Flow",
  description: "Master the art of budgeting — learn popular frameworks, tools, and how to build an emergency fund. Resources: YNAB (You Need a Budget), Dave Ramsey, Mint, Khan Academy.",
  lessons: [
    {
      id: "pf-why-budgeting-matters",
      slug: "why-budgeting-matters",
      title: "Why Budgeting Matters",
      content: `## Why Budgeting Matters

A budget is a plan for your money. It tells every dollar where to go before the month begins, rather than wondering where it went after the month ends. Budgeting is not about restriction — it is about **intentionality**.

\`\`\`concept
{
  "title": "Budgeting as Intentionality",
  "variant": "mental-model",
  "content": "Think of budgeting like GPS for your money. Without it, you're driving blind — you might reach your destination by luck, but you'll probably get lost, waste fuel, and arrive stressed. A budget gives you turn-by-turn directions to your financial goals."
}
\`\`\`

### The Case for Budgeting

According to a 2023 survey by the National Foundation for Credit Counseling, only 40% of American adults follow a budget. Yet budgeting is consistently cited by financial planners as the single most impactful habit for building wealth.

Consider what happens without a budget:

- **Lifestyle creep**: As income rises, spending rises to match, leaving savings flat
- **Invisible spending**: Small recurring charges ($10 streaming services, $15 subscriptions) accumulate silently
- **Emergency vulnerability**: Without planned savings, any unexpected expense becomes a crisis
- **Debt accumulation**: Credit cards fill the gap between income and overspending

\`\`\`quiz
{
  "title": "The Hidden Cost of Small Expenses",
  "questions": [
    {
      "question": "If you have 5 subscription services costing $12.99 each, how much do you spend annually?",
      "options": ["$519.60", "$649.50", "$779.40", "$909.30"],
      "answer": 2,
      "explanation": "5 × $12.99 × 12 months = $779.40. Small monthly charges compound into significant annual expenses."
    },
    {
      "question": "Which of these is NOT a common consequence of budgeting?",
      "options": ["Reduced financial stress", "Increased awareness of spending", "More lifestyle creep", "Better goal prioritization"],
      "answer": 2,
      "explanation": "Budgeting prevents lifestyle creep by making spending visible and intentional, not promoting it."
    },
    {
      "question": "What percentage of American adults follow a budget according to 2023 data?",
      "options": ["25%", "40%", "55%", "70%"],
      "answer": 1,
      "explanation": "Only 40% of American adults follow a budget, leaving 60% without this fundamental financial tool."
    }
  ]
}
\`\`\`

### What a Budget Actually Does

A budget serves four critical functions:

| Function | How It Helps |
|----------|-------------|
| **Awareness** | Shows exactly where money goes each month |
| **Control** | Prevents overspending in any category |
| **Prioritization** | Ensures money flows to your goals first |
| **Stress reduction** | Eliminates financial anxiety and surprises |

### Real-World Example: The Subscription Audit

Jake, a 26-year-old marketing associate, assumed he spent about $50/month on subscriptions. When he actually listed them all:

- Netflix: $15.49
- Spotify: $10.99
- YouTube Premium: $13.99
- Adobe Creative Cloud: $54.99
- Gym membership: $49.99
- iCloud storage: $2.99
- Amazon Prime: $14.99
- Two forgotten apps: $9.98

**Actual total: $173.42/month** — nearly $2,100/year. After his budget audit, Jake canceled three services he rarely used, saving $960 annually. That money now goes to his Roth IRA.

\`\`\`steps
{
  "title": "Conduct Your Own Subscription Audit",
  "steps": [
    {
      "title": "Step 1: List All Subscriptions",
      "content": "Check your bank statements, credit cards, and PayPal for the last 3 months. Write down every recurring charge, even $0.99 ones."
    },
    {
      "title": "Step 2: Calculate Annual Costs",
      "content": "Multiply each monthly subscription by 12. For annual subscriptions, note the full amount. This reveals the true impact."
    },
    {
      "title": "Step 3: Evaluate Usage vs. Cost",
      "content": "For each service, ask: 'Did I use this last week? Does it provide $X worth of value monthly?' Be honest about actual usage."
    },
    {
      "title": "Step 4: Cancel Ruthlessly",
      "content": "Cancel anything you didn't use recently or doesn't justify its cost. You can always resubscribe later if you miss it."
    }
  ]
}
\`\`\`

### The Budgeting Mindset Shift

Many people resist budgeting because it feels restrictive. In reality, a budget is **liberating**. When you know your bills are paid, your savings goals are funded, and your retirement contributions are set, you can spend the remainder guilt-free.

Think of it this way: without a budget, every purchase triggers a question — "Can I afford this?" With a budget, you already know the answer.

\`\`\`concept
{
  "title": "The Liberation Framework",
  "variant": "insight",
  "content": "A budget transforms spending from anxiety ('Should I buy this?') to empowerment ('This money is specifically for enjoyment — spend it freely!'). When every dollar has a job, spending becomes intentional rather than stressful."
}
\`\`\`

### Cash Flow: Income Timing Matters

Budgeting is not just about amounts — it is about **timing**. If you are paid biweekly and your rent is due on the 1st, you need to plan which paycheck covers rent. A cash flow calendar maps out:

1. When income arrives
2. When fixed expenses are due
3. When variable spending occurs
4. When savings transfers happen

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "See How Small Savings Grow",
  "inputs": [
    { "id": "p", "label": "Monthly savings from budget cuts", "default": 100, "min": 10, "max": 500 },
    { "id": "r", "label": "Annual return rate (%)", "default": 7, "min": 1, "max": 12 },
    { "id": "t", "label": "Years invested", "default": 10, "min": 1, "max": 30 }
  ]
}
\`\`\`

### Getting Started: Three Steps

**Step 1:** Track every expense for one full month. Use your bank statements, credit card statements, and cash receipts. Categorize everything.

**Step 2:** Compare your spending to your income. Are you spending more than you earn? Where are the biggest categories?

**Step 3:** Create next month's plan *before* the month begins. Allocate every dollar of expected income to a category.

### Common Budgeting Mistakes

- **Being too restrictive**: Cutting entertainment to zero is unsustainable. Budget some "fun money."
- **Forgetting irregular expenses**: Car maintenance, gifts, annual subscriptions — plan for these.
- **Not adjusting**: A budget is a living document. Adjust monthly as needed.
- **Giving up after one bad month**: Perfection is not the goal. Progress is.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Restrictive Budget (Fails)",
    "code": "Rent: $1200\\nGroceries: $200\\nUtilities: $150\\nGas: $100\\nSavings: $500\\nFun Money: $0\\nTotal: $2150\\n\\nProblem: No entertainment budget leads to burnout and abandonment"
  },
  "after": {
    "label": "Balanced Budget (Succeeds)",
    "code": "Rent: $1200\\nGroceries: $300\\nUtilities: $150\\nGas: $100\\nSavings: $400\\nFun Money: $100\\nTotal: $2250\\n\\nSolution: Includes realistic spending for enjoyment, making it sustainable"
  }
}
\`\`\`

### Key Takeaway

Budgeting is the most fundamental financial habit. It transforms money from a source of stress into a tool you control. Start by tracking, then planning, then adjusting — the habit compounds over time just like interest.

> "A budget is telling your money where to go instead of wondering where it went." — Dave Ramsey

*Resources: YNAB Method, Dave Ramsey's EveryDollar, Khan Academy Budgeting, Mint Personal Finance.*`,
    },
    {
      id: "pf-50-30-20-rule",
      slug: "50-30-20-rule",
      title: "The 50/30/20 Rule",
      content: `## The 50/30/20 Rule

The 50/30/20 rule is one of the simplest and most popular budgeting frameworks. Introduced by Senator Elizabeth Warren and her daughter Amelia Warren Tyagi in the book *All Your Worth*, it divides your after-tax income into three categories.

### The Framework

| Category | Percentage | What It Covers |
|----------|-----------|---------------|
| **Needs** | 50% | Housing, food, transportation, insurance, minimum debt payments, utilities |
| **Wants** | 30% | Dining out, entertainment, hobbies, vacations, subscriptions, upgrades |
| **Savings/Debt** | 20% | Emergency fund, retirement contributions, extra debt payments, investments |

\`\`\`mermaid
graph TD
    A[Monthly Income After Tax] --> B[Needs 50%]
    A --> C[Wants 30%]
    A --> D[Savings 20%]
    B --> B1[Housing]
    B --> B2[Food & Groceries]
    B --> B3[Transportation]
    C --> C1[Entertainment]
    C --> C2[Dining Out]
    D --> D1[Emergency Fund]
    D --> D2[Retirement Contributions]
\`\`\`

### Applying the Rule

If your take-home pay is \\$4,000/month:

- **Needs (50%):** \\$2,000 — rent, groceries, car payment, insurance, utilities, phone
- **Wants (30%):** \\$1,200 — restaurants, Netflix, gym, concerts, shopping
- **Savings (20%):** \\$800 — 401(k), IRA, emergency fund, extra loan payments

### Distinguishing Needs from Wants

This is where most people struggle. The key question is: **Would your life be seriously disrupted without this?**

| Need | Want |
|------|------|
| Rent/mortgage | Upgrading to a nicer apartment |
| Basic groceries | Organic specialty items |
| Reliable transportation | A luxury car |
| Basic phone plan | Unlimited premium plan |
| Health insurance | Elective cosmetic procedures |

A \\$1,200/month apartment is a need. A \\$2,500/month luxury apartment in a trendy neighborhood is partially a want. Housing satisfies a need, but the premium you pay for location or amenities is a lifestyle choice.

### Real-World Example: Maria's Budget

Maria earns \\$5,500/month after taxes. Here is her 50/30/20 breakdown:

**Needs (50% = \\$2,750):**
- Rent: \\$1,400
- Groceries: \\$400
- Car payment + insurance: \\$450
- Utilities + phone: \\$200
- Health insurance: \\$150
- Minimum student loan payment: \\$150

**Wants (30% = \\$1,650):**
- Dining out: \\$400
- Entertainment: \\$200
- Clothing: \\$150
- Subscriptions: \\$50
- Hobbies: \\$200
- Travel savings: \\$400
- Miscellaneous: \\$250

**Savings/Debt (20% = \\$1,100):**
- 401(k) contribution: \\$500
- Roth IRA: \\$250
- Emergency fund: \\$200
- Extra student loan payment: \\$150

### When the Rule Does Not Fit

The 50/30/20 rule is a **guideline**, not a law. It may need adjustment in these situations:

**High cost-of-living areas:** In cities like San Francisco or New York, housing alone might consume 40% of income. You may need a 60/20/20 split temporarily.

**High-debt situations:** If you are aggressively paying off debt, consider a 50/20/30 split — 30% toward savings and debt repayment, 20% for wants.

**High-income earners:** If you earn \\$200,000/year, spending 30% on wants (\\$60,000) might be excessive. Consider a 50/20/30 split where 30% goes to savings/investing.

**Low-income households:** When needs exceed 50%, focus on covering essentials and saving even a small amount. Even 5% saved is progress.

### The Power of the 20%

The 20% savings allocation is where wealth building happens. At \\$4,000/month income, 20% is \\$800/month or \\$9,600/year. Invested at 7% average returns over 30 years, that becomes approximately \\$918,000. The 50/30/20 rule, followed consistently, can make you a millionaire.

### Adapting Over Time

As your income grows, resist the urge to scale up the "wants" category proportionally. Instead, keep wants spending flat and direct raises toward the savings category. This is how wealth acceleration works.

### Key Takeaway

The 50/30/20 rule provides a simple, balanced framework for budgeting. It ensures your needs are met, your lifestyle is enjoyable, and your future is funded. Start with these percentages and adjust based on your circumstances.

> "The 50/30/20 rule is the budget you can actually stick with because it does not ask you to stop living." — Elizabeth Warren, *All Your Worth*

*Resources: All Your Worth by Elizabeth Warren, Khan Academy Budgeting, NerdWallet 50/30/20 Calculator.*`,
    },
    {
      id: "pf-zero-based-budgeting",
      slug: "zero-based-budgeting",
      title: "Zero-Based Budgeting",
      content: `## Zero-Based Budgeting

Zero-based budgeting (ZBB) is a method where every dollar of income is assigned a specific job. At the end of your budget, income minus all allocations equals exactly zero. This does not mean you spend everything — it means every dollar is **planned**.

### How It Works

\`\`\`
Total Income - All Allocated Categories = $0
\`\`\`

If you earn \\$4,500/month, you create categories until all \\$4,500 is accounted for:

| Category | Amount |
|----------|--------|
| Rent | \\$1,200 |
| Groceries | \\$400 |
| Car payment | \\$350 |
| Utilities | \\$180 |
| Insurance | \\$200 |
| Gas | \\$120 |
| Dining out | \\$200 |
| Entertainment | \\$100 |
| Clothing | \\$75 |
| Subscriptions | \\$45 |
| 401(k) | \\$500 |
| Emergency fund | \\$300 |
| Roth IRA | \\$250 |
| Student loan extra | \\$200 |
| Miscellaneous | \\$150 |
| Gift fund | \\$50 |
| Car maintenance | \\$80 |
| Medical copays | \\$50 |
| Personal care | \\$50 |
| **Total** | **\\$4,500** |

The remaining balance is \\$0. Every dollar has a purpose.

### Zero-Based vs 50/30/20

| Feature | 50/30/20 | Zero-Based |
|---------|----------|------------|
| Granularity | Three buckets | Every dollar categorized |
| Flexibility | General guidelines | Specific allocations |
| Time to create | 5 minutes | 30-60 minutes |
| Best for | Beginners, simple finances | Detailed planners, variable income |
| Tracking effort | Low | High |

Many people start with 50/30/20 for simplicity, then graduate to zero-based budgeting for more control.

### Real-World Example: Variable Income

Zero-based budgeting is especially powerful for **irregular income** — freelancers, commission-based workers, gig economy participants. Here is how Taylor, a freelance graphic designer, handles it:

**Step 1:** List expenses in priority order (needs first, then wants, then goals):
1. Rent: \\$1,100
2. Groceries: \\$350
3. Utilities: \\$150
4. Health insurance: \\$400
5. Transportation: \\$100
6. Emergency fund: \\$200
7. Tax savings (30%): variable
8. Business expenses: \\$150
9. Entertainment: \\$150
10. Retirement: \\$300

**Step 2:** When income arrives, fund categories from the top down. In a \\$3,500 month, everything through category 7 gets funded. In a \\$5,000 month, everything gets funded plus extra to retirement. In a \\$2,500 month, categories 8-10 get reduced or paused.

This priority-based approach ensures essentials are always covered regardless of income variation.

### The Envelope System

A classic companion to zero-based budgeting is the **envelope system**, popularized by Dave Ramsey:

1. Create physical envelopes (or digital equivalents) for each variable spending category
2. Put the budgeted cash amount in each envelope at the start of the month
3. When an envelope is empty, spending in that category stops until next month

This method creates a tangible, visceral connection to spending. Many apps now offer digital envelope systems — YNAB is built entirely on this concept.

### Common ZBB Challenges

**"I forgot a category!"** Build a "miscellaneous" or "buffer" category of \\$50-100 for unexpected small expenses.

**"I went over in a category!"** Move money from another category. This is not failure — it is flexibility. Just make a conscious choice about which category gives up dollars.

**"It takes too long each month!"** The first month takes an hour. After three months, it takes 15 minutes because your categories stabilize.

### Month-End Reconciliation

At month's end, compare your budget to actual spending:

1. Which categories were over? Why?
2. Which categories were under? Can that money be redirected?
3. What categories need adjusting for next month?

This feedback loop makes each month's budget more accurate than the last.

### Key Takeaway

Zero-based budgeting gives every dollar a job, eliminating the "where did my money go?" problem entirely. It requires more effort than percentage-based methods but provides maximum control and awareness. Combined with the envelope system, it is one of the most effective budgeting approaches available.

> "Give every dollar a name before the month begins." — Dave Ramsey

*Resources: Dave Ramsey's EveryDollar App, YNAB (You Need a Budget), Investopedia Zero-Based Budgeting Guide.*`,
    },
    {
      id: "pf-budgeting-tools",
      slug: "budgeting-tools",
      title: "Budgeting Tools & Apps",
      content: `## Budgeting Tools & Apps

The best budget is one you actually use. Whether you prefer a simple spreadsheet or a full-featured app, the right tool makes budgeting sustainable. This lesson reviews the most popular options and helps you choose.

\`\`\`concept
{
  "title": "The Tool Paradox",
  "variant": "insight",
  "content": "Research shows that users who stick with ANY budgeting tool for 3+ months see 23% reduction in unnecessary spending. The perfect tool you abandon is worse than the imperfect one you use daily."
}
\`\`\`

### Option 1: Spreadsheets (Google Sheets / Excel)

**Best for:** People who want full control and customization.

A spreadsheet is the most flexible budgeting tool. You design the categories, formulas, and layout exactly as you want.

**Basic spreadsheet budget structure:**

| Column A: Category | Column B: Budgeted | Column C: Actual | Column D: Difference |
|---------------------|--------------------|-----------------|--------------------|
| Rent | \\$1,200 | \\$1,200 | \\$0 |
| Groceries | \\$400 | \\$437 | -\\$37 |
| Entertainment | \\$150 | \\$112 | +\\$38 |

**Pros:** Free, fully customizable, no data sharing with third parties, works offline.
**Cons:** Manual data entry, no automatic transaction imports, requires spreadsheet skills.

\`\`\`playground
{
  "title": "Build a Simple Budget Formula",
  "language": "javascript",
  "code": "// Simple budget tracker formula\\nfunction calculateDifference(budgeted, actual) {\\n  return actual - budgeted;\\n}\\n\\n// Example usage:\\nconst categories = [\\n  { name: \\"Rent\\", budgeted: 1200, actual: 1200 },\\n  { name: \\"Groceries\\", budgeted: 400, actual: 437 },\\n  { name: \\"Entertainment\\", budgeted: 150, actual: 112 }\\n];\\n\\ncategories.forEach(cat => {\\n  const diff = calculateDifference(cat.budgeted, cat.actual);\\n  console.log(\`\\\\\${cat.name}: \\\\$\\\\\${diff >= 0 ? '+' : ''}\\\\\${diff}\`);\\n});",
  "runnable": true
}
\`\`\`

### Option 2: YNAB (You Need a Budget)

**Best for:** Zero-based budgeters who want the envelope method digitally.

YNAB is built around four rules:
1. Give every dollar a job (zero-based budgeting)
2. Embrace your true expenses (plan for irregular costs)
3. Roll with the punches (adjust categories as needed)
4. Age your money (aim to spend last month's income this month)

**Cost:** \\$14.99/month or \\$99/year (34-day free trial).

**Pros:** Excellent philosophy-driven approach, bank sync available, powerful reporting, active community. According to YNAB, new users save an average of \\$600 in their first two months.

**Cons:** Paid subscription, learning curve, requires active engagement.

### Option 3: Mint (by Intuit)

**Best for:** People who want automatic tracking with minimal effort.

Mint automatically imports transactions from your bank accounts and credit cards, categorizes them, and shows spending trends.

**Pros:** Free, automatic transaction imports, bill reminders, credit score monitoring, visual dashboards.

**Cons:** Ad-supported, categorization requires correction sometimes, less proactive than YNAB (tracks spending after the fact rather than planning ahead).

**Note:** As of 2024, Mint transitioned to Credit Karma. Features may vary from the original Mint experience.

### Option 4: EveryDollar

**Best for:** Dave Ramsey followers who want simplicity.

EveryDollar is designed around Dave Ramsey's budgeting principles. The free version requires manual transaction entry. The premium version (\\$17.99/month) includes bank sync.

**Pros:** Clean, simple interface; drag-and-drop budget creation; integrates with Ramsey's debt payoff methods.
**Cons:** Premium is pricey for bank sync; limited reporting compared to YNAB.

### Option 5: Goodbudget

**Best for:** Couples who want to share an envelope budget.

Goodbudget is a digital envelope system designed for shared budgeting. Both partners can access the same envelopes from different devices.

**Pros:** Envelope-based, shared access, available on web and mobile, free tier available.
**Cons:** Free tier limited to 20 envelopes; no bank sync on free plan.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Manual Spreadsheet Budget",
    "code": "January 2024\\nRent: $1200 (budget) vs $1200 (actual) ✓\\nGroceries: $400 vs $437 ✗ (-$37)\\nEntertainment: $150 vs $112 ✓ (+$38)\\n\\nFebruary tracking: Haven't updated yet..."
  },
  "after": {
    "label": "YNAB Real-time Budget",
    "code": "Available to Budget: $0 (every dollar has a job)\\nGroceries envelope: $23 remaining (alert at 90%)\\nDining out: Fully funded for month\\nEmergency fund: Aging money = 31 days\\n\\nAuto-import keeps everything current"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Choose Your Budgeting Tool",
  "questions": [
    {
      "question": "You want zero-based budgeting with automatic bank sync and don't mind paying. Which tool fits best?",
      "options": ["Spreadsheet", "YNAB", "Mint", "EveryDollar free"],
      "answer": 1,
      "explanation": "YNAB specializes in zero-based budgeting and includes automatic bank sync, though it requires a paid subscription."
    },
    {
      "question": "You're budgeting with a partner and want shared access to digital envelopes. What's your best free option?",
      "options": ["YNAB", "Mint", "Goodbudget", "EveryDollar premium"],
      "answer": 2,
      "explanation": "Goodbudget offers shared envelope budgeting with a free tier (limited to 20 envelopes)."
    },
    {
      "question": "You prefer manual entry for increased awareness and want complete customization. Which should you choose?",
      "options": ["Mint", "YNAB", "Spreadsheet", "EveryDollar premium"],
      "answer": 2,
      "explanation": "Spreadsheets offer complete customization and manual entry while being free to use."
    }
  ]
}
\`\`\`

### How to Choose

Ask yourself these questions:

1. **Do I want to enter transactions manually or have them imported?** Manual entry increases awareness but requires discipline. Auto-import is convenient but can feel passive.

2. **Am I willing to pay?** If not, use a spreadsheet, Mint, or free tier of Goodbudget/EveryDollar.

3. **Do I budget with a partner?** YNAB and Goodbudget handle shared budgets well.

4. **How much time will I spend?** Spreadsheets and YNAB require weekly attention. Mint works with monthly check-ins.

\`\`\`steps
{
  "title": "Your 3-Month Tool Trial",
  "steps": [
    {
      "title": "Month 1: Pick and Setup",
      "content": "Choose the tool that feels most approachable. Set up your categories and enter one month of transactions. Don't worry about perfection."
    },
    {
      "title": "Month 2: Build the Habit",
      "content": "Check your budget weekly. Adjust categories as you learn your spending patterns. The goal is consistency, not accuracy."
    },
    {
      "title": "Month 3: Evaluate and Adjust",
      "content": "Review: Are you checking it regularly? Does it help you make spending decisions? If not, consider switching tools before giving up on budgeting entirely."
    }
  ]
}
\`\`\`

### The Best Tool Is the One You Use

A perfectly designed spreadsheet that you abandon in February is worse than a simple app you check weekly all year. Start with whatever feels most approachable, and upgrade as your habits strengthen.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "YNAB and EveryDollar excel at zero-based budgeting but require payment for full features",
    "Mint offers free automatic tracking but transitioned to Credit Karma in 2024",
    "Spreadsheets provide maximum control and privacy but demand more effort",
    "Goodbudget specializes in shared envelope budgeting for couples",
    "Consistency matters more than perfection—pick one tool and commit for 3 months"
  ]
}
\`\`\``,
    },
    {
      id: "pf-emergency-fund",
      slug: "emergency-fund",
      title: "Emergency Fund: The 3-6 Months Rule",
      content: `## Emergency Fund: The 3-6 Months Rule

An emergency fund is a dedicated savings reserve for unexpected expenses — job loss, medical bills, car repairs, or home emergencies. It is the financial shock absorber that keeps you from falling into debt when life throws a curveball.

\`\`\`concept
{
  "title": "Emergency Fund as Financial Shock Absorber",
  "variant": "mental-model",
  "content": "Think of your emergency fund as a financial airbag. Just as an airbag doesn't prevent accidents but prevents serious injury, an emergency fund doesn't prevent emergencies but prevents them from becoming financial disasters. It absorbs the impact so you can walk away intact."
}
\`\`\`

### Why You Need One

According to the Federal Reserve's 2023 Survey of Household Economics, 37% of Americans would struggle to cover a $400 emergency expense. Without an emergency fund, unexpected costs force people into:

- **Credit card debt** at 20%+ interest rates
- **Payday loans** at 400%+ APR
- **Borrowing from retirement** (with penalties and taxes)
- **Selling assets** at unfavorable times

An emergency fund is not optional — it is the foundation of financial stability.

### How Much Do You Need?

The standard recommendation is **3 to 6 months of essential expenses** (not income — expenses). Essential expenses include:

- Rent or mortgage
- Groceries
- Utilities
- Insurance premiums
- Transportation
- Minimum debt payments
- Medical costs

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Emergency Fund Calculator",
  "inputs": [
    { "id": "rent", "label": "Monthly Rent/Mortgage", "default": 1400, "min": 0, "max": 5000, "prefix": "$" },
    { "id": "groceries", "label": "Monthly Groceries", "default": 400, "min": 0, "max": 1000, "prefix": "$" },
    { "id": "utilities", "label": "Monthly Utilities", "default": 200, "min": 0, "max": 500, "prefix": "$" },
    { "id": "transport", "label": "Transportation", "default": 450, "min": 0, "max": 1000, "prefix": "$" },
    { "id": "insurance", "label": "Insurance", "default": 150, "min": 0, "max": 500, "prefix": "$" },
    { "id": "debt", "label": "Minimum Debt Payments", "default": 250, "min": 0, "max": 1000, "prefix": "$" }
  ]
}
\`\`\`

**Example calculation:**

| Essential Expense | Monthly Cost |
|-------------------|-------------|
| Rent | $1,400 |
| Groceries | $400 |
| Utilities | $200 |
| Car payment + insurance | $450 |
| Health insurance | $150 |
| Phone | $60 |
| Minimum debt payments | $250 |
| **Total** | **$2,910** |

- **3-month fund:** $8,730
- **6-month fund:** $17,460

### 3 Months vs 6 Months: Which Is Right?

| Situation | Recommended Target |
|-----------|-------------------|
| Dual-income household, stable jobs | 3 months |
| Single income, stable job | 4-5 months |
| Variable/freelance income | 6+ months |
| Single parent | 6 months |
| In a volatile industry | 6 months |
| Health issues or aging parents | 6 months |

Dave Ramsey recommends starting with a $1,000 "baby emergency fund" while paying off debt, then building to 3-6 months after debt is eliminated. This staged approach prevents emergency-fund building from competing with high-interest debt repayment.

### Where to Keep Your Emergency Fund

Your emergency fund needs to be **liquid** (easily accessible) and **safe** (not subject to market risk). The best options:

**High-Yield Savings Account (HYSA):** Currently offering 4-5% APY at online banks like Marcus (Goldman Sachs), Ally, or Capital One 360. This is the gold standard for emergency funds.

**Money Market Account:** Similar rates to HYSA, sometimes with check-writing privileges.

**NOT recommended:** Checking accounts (too easy to spend, low interest), CDs (locked up for a term), stocks (too volatile), under your mattress (no growth, risk of loss).

### Real-World Example: The Emergency Fund in Action

Lisa, age 32, had a 4-month emergency fund of $12,000 in a high-yield savings account. In March, three emergencies hit within two weeks:

1. Her car needed a $1,800 transmission repair
2. Her dog required emergency surgery: $2,200
3. She was laid off from her tech job

Without her emergency fund, Lisa would have put $4,000 on credit cards at 22% APR and panicked about rent. Instead, she paid the bills from savings and had 2.5 months of runway to find a new job. She found one in 6 weeks and immediately began rebuilding her fund.

### Building Your Emergency Fund: A Step-by-Step Plan

**Phase 1 — The Starter Fund ($1,000):**
- Timeline: 1-3 months
- Method: Cut one expense, sell unused items, redirect a small portion of each paycheck
- Purpose: Cover minor emergencies while you tackle other priorities

**Phase 2 — The Full Fund (3-6 months):**
- Timeline: 12-24 months (varies by income and savings rate)
- Method: Automate monthly transfers to HYSA
- Tip: Treat it like a bill — transfer on payday before you spend

**Phase 3 — Maintenance:**
- If you use the fund, rebuild it immediately
- As your expenses change (new rent, new car payment), adjust the target
- Once fully funded, redirect excess savings to investments

\`\`\`quiz
{
  "title": "Emergency Fund Knowledge Check",
  "questions": [
    {
      "question": "What percentage of Americans would struggle to cover a $400 emergency expense according to the Federal Reserve's 2023 survey?",
      "options": ["25%", "37%", "45%", "52%"],
      "answer": 1,
      "explanation": "The Federal Reserve's 2023 Survey of Household Economics found that 37% of Americans would struggle to cover a $400 emergency expense."
    },
    {
      "question": "When calculating your emergency fund target, you should base it on:",
      "options": ["Your gross monthly income", "Your monthly take-home pay", "Your essential monthly expenses", "Your total monthly spending"],
      "answer": 2,
      "explanation": "Emergency funds should be based on essential monthly expenses (housing, food, utilities, insurance, minimum debt payments), not income or total spending."
    },
    {
      "question": "Which of these is NOT a recommended place to keep your emergency fund?",
      "options": ["High-yield savings account", "Money market account", "Certificate of deposit (CD)", "Online savings account"],
      "answer": 2,
      "explanation": "CDs are not recommended because they lock up your money for a specific term, making it inaccessible when you need it most."
    }
  ]
}
\`\`\`

### The #1 Rule: Do Not Touch It for Non-Emergencies

An emergency fund is for true emergencies only. It is NOT for:
- A great deal on a vacation
- Black Friday shopping
- A concert you really want to attend
- "I will pay it back next month" (you will not)

Define your emergencies in advance: job loss, medical emergency, essential home/car repair, unexpected tax bill.

\`\`\`callout
{
  "type": "warning",
  "title": "Common Emergency Fund Mistake",
  "content": "The biggest mistake people make is rationalizing non-emergencies as emergencies. A sale on electronics, a wedding invitation, or 'I deserve a treat' are NOT emergencies. Write down what constitutes an emergency for YOU before you're tempted."
}
\`\`\`

### Key Takeaway

An emergency fund is the single most important financial safety net you can build. Start with $1,000, then build to 3-6 months of expenses in a high-yield savings account. Automate the process and protect the fund from non-emergency spending. When the inevitable crisis comes, you will be glad you prepared.

> "An emergency fund turns a crisis into an inconvenience." — Dave Ramsey

*Resources: Bankrate HYSA Comparison, Dave Ramsey's Baby Steps, Khan Academy Emergency Fund, NerdWallet Savings Calculator.*`,
    },
  ],
};
