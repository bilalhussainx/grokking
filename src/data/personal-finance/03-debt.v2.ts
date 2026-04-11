import { Module } from "../types";

export const debtModule: Module = {
  id: "pf-debt",
  title: "Debt Management",
  description: "Understand the different types of debt, how credit works, and strategies to eliminate debt efficiently. Resources: Investopedia, Dave Ramsey, Experian, Khan Academy.",
  lessons: [
    {
      id: "pf-good-vs-bad-debt",
      slug: "good-vs-bad-debt",
      title: "Good Debt vs Bad Debt",
      content: `## Good Debt vs Bad Debt

Not all debt is created equal. Some debt can be a strategic tool for building wealth, while other debt erodes your financial health. Understanding the difference is crucial for making smart borrowing decisions.

### Defining Good Debt

Good debt is borrowing that **increases your net worth or earning potential** over time. It is an investment that pays for itself.

| Good Debt | Why It Can Be Good |
|-----------|-------------------|
| **Mortgage** | Real estate typically appreciates; you build equity instead of paying rent |
| **Student loans** | Education increases lifetime earning potential (on average, college graduates earn 75% more than high school graduates, per Georgetown CEW) |
| **Business loans** | Funds a venture that can generate returns exceeding the loan cost |
| **Real estate investment loans** | Rental income can exceed mortgage payments, building passive income |

### Defining Bad Debt

Bad debt is borrowing to purchase **depreciating assets or consumable goods** — things that lose value or are gone before the debt is repaid.

| Bad Debt | Why It Is Harmful |
|----------|------------------|
| **Credit card debt** | Average APR of 20-25%; the items purchased lose value immediately |
| **Payday loans** | Effective APR of 400%+; designed to trap borrowers in cycles |
| **Car loans on expensive vehicles** | Cars depreciate 20-30% in year one; financing luxury vehicles amplifies the loss |
| **Vacation on credit** | The trip ends, but the payments continue for months or years |
| **Retail store credit** | High interest rates (25-30% APR) for purchases that go on sale next month |

### The Gray Area

Some debt falls in between:

**Auto loans** can be acceptable if the vehicle is necessary for earning income and the payment is reasonable (under 10% of take-home pay, with a loan term of 4 years or less). A \\$15,000 reliable used car financed at 5% is very different from a \\$60,000 luxury vehicle at 7%.

**Student loans** become bad debt when the degree does not increase earning potential enough to justify the cost. Borrowing \\$200,000 for a degree leading to a \\$35,000 salary is a poor return on investment.

### The Interest Rate Test

A simple framework: if the interest rate on the debt is **lower** than the return you could earn investing that money, the debt may be worth carrying. For example:

- Mortgage at 3.5% while the stock market averages 8-10%? The math favors keeping the mortgage and investing extra cash.
- Credit card at 22%? No investment reliably returns 22%. Pay this off immediately.

### Real-World Example: The Debt Spectrum

Consider three friends who each borrow \\$30,000:

**Alex** borrows for a home down payment supplement via a 5% personal loan. The home appreciates 4% annually. Over 10 years, the property gains \\$60,000+ in value. The loan cost about \\$8,000 in interest. **Net positive.**

**Jordan** borrows for a master's degree at 6% interest. The degree increases salary from \\$50,000 to \\$75,000. The extra \\$25,000/year easily covers the loan. **Net positive.**

**Taylor** borrows via credit cards at 22% APR for furniture, vacations, and dining. The items are consumed or depreciated. Minimum payments stretch the payoff to 15+ years with \\$40,000+ in interest. **Net negative.**

### The Debt-to-Income Ratio

Lenders use the debt-to-income (DTI) ratio to assess your borrowing health:

\`\`\`
DTI = Monthly Debt Payments / Gross Monthly Income x 100
\`\`\`

- **Under 20%**: Healthy
- **20-36%**: Manageable but watch closely
- **36-43%**: Stressed — difficulty getting new loans
- **Over 43%**: Danger zone — most lenders will not approve new debt

### Key Takeaway

Debt is a tool — like fire, it can warm your house or burn it down. Good debt is borrowed at reasonable rates to acquire appreciating assets or increase earning power. Bad debt is borrowed at high rates for depreciating or consumable goods. Before borrowing, always ask: "Will this debt make me wealthier or poorer over time?"

> "Some debts are fun when you are acquiring them, but none are fun when you set about retiring them." — Ogden Nash

*Resources: Investopedia Good Debt vs Bad Debt, Dave Ramsey's Total Money Makeover, Khan Academy Credit and Debt.*`,
    },
    {
      id: "pf-credit-scores",
      slug: "credit-scores",
      title: "Credit Scores & Credit Reports",
      content: `## Credit Scores & Credit Reports

Your credit score is a three-digit number that summarizes your creditworthiness. It affects your ability to borrow money, the interest rates you pay, and even your ability to rent an apartment or get certain jobs. Understanding how it works gives you the power to improve it.

\`\`\`concept
{
  "title": "What Is a Credit Score?",
  "variant": "mental-model",
  "content": "Think of your credit score as a financial report card that lenders use to predict how likely you are to repay borrowed money. Just like a GPA summarizes your academic performance, your credit score summarizes your credit behavior in one number ranging from 300-850."
}
\`\`\`

### Credit Score Ranges & Impact

| Range | Rating | Impact |
|-------|--------|--------|
| 800-850 | Exceptional | Best rates on everything |
| 740-799 | Very Good | Excellent rates, easy approvals |
| 670-739 | Good | Favorable rates, most loans approved |
| 580-669 | Fair | Higher rates, some denials |
| 300-579 | Poor | Difficulty getting approved, very high rates |

The average FICO score in the US is approximately 715 (as of 2023, per Experian).

### The Five Factors That Build Your Score

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Payment History (35%)",
      "content": "**The Most Important Factor**\\n\\n- Measures whether you pay bills on time\\n- Even one 30-day late payment can drop your score 50-100 points\\n- Stays on your report for 7 years from the first missed payment\\n\\n**Pro tip:** Set up autopay for at least the minimum payment to never miss a due date."
    },
    {
      "label": "Credit Utilization (30%)",
      "content": "**Your Debt-to-Credit Ratio**\\n\\n- Formula: Balance ÷ Credit Limit × 100\\n- Keep below 30%, ideally below 10%\\n- Measured on statement closing date, not due date\\n\\n**Example:** $2,500 balance on $10,000 limit = 25% utilization"
    },
    {
      "label": "Length of History (15%)",
      "content": "**Time Builds Trust**\\n\\n- Average age of all your credit accounts\\n- Older accounts help your score more\\n- Closing old accounts can hurt your score\\n\\n**Keep old cards open** even if you rarely use them."
    },
    {
      "label": "Credit Mix (10%)",
      "content": "**Diversity Matters**\\n\\n- Shows you can handle different types of credit\\n- Includes credit cards, auto loans, mortgages, student loans\\n- Don't open accounts just for mix - it's the least important factor"
    },
    {
      "label": "New Credit (10%)",
      "content": "**Recent Activity**\\n\\n- Too many applications signal financial stress\\n- Hard inquiries stay for 2 years but only affect score for 1 year\\n- Rate shopping for mortgages/auto loans counts as one inquiry if within 14-45 days"
    }
  ]
}
\`\`\`

### Credit Utilization Deep Dive

Credit utilization is the ratio of your balance to your credit limit:

\`\`\`
Utilization = Balance / Credit Limit x 100
\`\`\`

**Example:** You have a credit card with a $10,000 limit and a $2,500 balance. Your utilization is 25%.

| Utilization Range | Impact on Score |
|------------------|-----------------|
| 0-9% | Excellent |
| 10-29% | Good |
| 30-49% | Fair — hurting your score |
| 50%+ | Poor — significantly damaging |

**Pro tip:** Utilization is typically measured on your statement closing date, not your due date. Paying your balance before the statement closes can show lower utilization to the bureaus.

\`\`\`quiz
{
  "title": "Test Your Credit Knowledge",
  "questions": [
    {
      "question": "Which factor has the biggest impact on your credit score?",
      "options": ["Credit utilization", "Payment history", "Length of credit history", "Credit mix"],
      "answer": 1,
      "explanation": "Payment history accounts for 35% of your FICO score, making it the most important factor. Even one late payment can significantly damage your score."
    },
    {
      "question": "What's the recommended maximum credit utilization ratio?",
      "options": ["50%", "30%", "10%", "No limit"],
      "answer": 1,
      "explanation": "Experts recommend keeping your credit utilization below 30%, with under 10% being ideal for the highest scores."
    },
    {
      "question": "How long does a late payment stay on your credit report?",
      "options": ["1 year", "3 years", "7 years", "10 years"],
      "answer": 2,
      "explanation": "Late payments remain on your credit report for 7 years from the date of the first missed payment, though their impact lessens over time."
    }
  ]
}
\`\`\`

### Credit Reports: The Full Picture

Your credit report is the detailed record behind your score. It is maintained by three bureaus: **Experian**, **Equifax**, and **TransUnion**. Your report includes:

- Every credit account (open and closed)
- Payment history for each account
- Balances and credit limits
- Hard inquiries (loan/credit applications)
- Public records (bankruptcies, liens)
- Personal information (name, address, employers)

### Checking Your Credit Report

You are entitled to **one free credit report per year** from each bureau at **AnnualCreditReport.com** (the only government-authorized source). Review your reports for:

- Accounts you do not recognize (possible identity theft)
- Incorrect balances or late payments
- Outdated negative information (most negatives fall off after 7 years)

\`\`\`callout
{
  "type": "warning",
  "title": "Beware of Imposter Sites",
  "content": "Only use AnnualCreditReport.com for your free reports. Many sites with similar names try to sell you services or collect your personal information. The government-authorized site will never ask for payment information for your free annual reports."
}
\`\`\`

### Real-World Example: Score Impact

Sarah has a 750 credit score. She is shopping for a $300,000 30-year fixed mortgage.

| Credit Score | Estimated APR | Monthly Payment | Total Interest Paid |
|-------------|--------------|----------------|-------------------|
| 750+ | 6.5% | $1,896 | $382,560 |
| 680 | 7.1% | $2,014 | $425,040 |
| 620 | 7.8% | $2,155 | $475,800 |

The difference between a 750 and 620 score costs **$93,240 over the life of the loan**. Your credit score is literally worth tens of thousands of dollars.

\`\`\`calculator
{
  "type": "loan",
  "title": "See How Your Score Affects Your Mortgage",
  "inputs": [
    { "id": "principal", "label": "Loan Amount", "default": 300000, "min": 50000, "max": 1000000, "prefix": "$" },
    { "id": "score", "label": "Credit Score", "default": 750, "min": 300, "max": 850 }
  ]
}
\`\`\`

### How to Improve Your Credit Score

1. **Pay every bill on time** — Set up autopay for at least the minimum
2. **Lower utilization** — Pay down balances or request credit limit increases
3. **Keep old accounts open** — Even if you do not use them, the age helps
4. **Limit hard inquiries** — Only apply for credit when you truly need it
5. **Dispute errors** — File disputes online through each bureau's website

\`\`\`callout
{
  "type": "tip",
  "title": "Quick Wins for Your Score",
  "content": "1. Pay down credit card balances before your statement closes to show lower utilization\\n2. Ask for credit limit increases (but don't use the extra credit)\\n3. Become an authorized user on a family member's old, well-managed account\\n4. Use a secured credit card if you need to build credit from scratch"
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Your credit score is one of the most consequential numbers in your financial life, potentially worth six figures over a lifetime",
    "Payment history (35%) and credit utilization (30%) make up nearly two-thirds of your FICO score",
    "Check your credit reports annually at AnnualCreditReport.com for errors and fraud",
    "Keep credit utilization below 30% and pay every bill on time for the biggest score improvements",
    "The difference between good and poor credit can cost you $93,000+ on a typical mortgage"
  ]
}
\`\`\``,
    },
    {
      id: "pf-avalanche-vs-snowball",
      slug: "avalanche-vs-snowball",
      title: "Debt Avalanche vs Debt Snowball",
      content: `## Debt Avalanche vs Debt Snowball

When you have multiple debts, the order in which you pay them off matters. The two most popular repayment strategies are the **debt avalanche** (mathematically optimal) and the **debt snowball** (psychologically optimal). Both work — the best choice depends on your personality.

### The Debt Avalanche Method

**Strategy:** Pay minimum on all debts. Direct all extra money to the debt with the **highest interest rate**. Once that is paid off, roll the payment to the next highest rate.

**Example — Four debts, \\$500/month extra to throw at debt:**

| Debt | Balance | APR | Minimum |
|------|---------|-----|---------|
| Credit Card A | \\$5,000 | 22% | \\$100 |
| Credit Card B | \\$2,000 | 18% | \\$50 |
| Car Loan | \\$12,000 | 6% | \\$250 |
| Student Loan | \\$25,000 | 5% | \\$280 |

**Avalanche order:** Credit Card A (22%) first, then Credit Card B (18%), then Car Loan (6%), then Student Loan (5%).

You direct \\$500 extra to Credit Card A (\\$600/month total). Once it is paid off in about 9 months, you redirect that \\$600 to Credit Card B, creating a \\$650/month payment. And so on.

**Pros:** Minimizes total interest paid. Mathematically, this is the cheapest way out of debt.
**Cons:** If the highest-rate debt has a large balance, it may take a long time to see the first debt eliminated.

### The Debt Snowball Method

**Strategy:** Pay minimum on all debts. Direct all extra money to the debt with the **smallest balance**. Once that is paid off, roll the payment to the next smallest.

**Using the same debts:**

**Snowball order:** Credit Card B (\\$2,000) first, then Credit Card A (\\$5,000), then Car Loan (\\$12,000), then Student Loan (\\$25,000).

You direct \\$500 extra to Credit Card B (\\$550/month total). It is paid off in about 4 months — a quick win! Then you redirect that \\$550 to Credit Card A, and so on.

**Pros:** Quick wins build motivation. Research published in the *Harvard Business Review* found that people who pay off small debts first are more likely to eliminate all their debt.
**Cons:** You pay more in total interest because higher-rate debts accrue interest longer.

\`\`\`mermaid
graph TD
    A[Debt Repayment Strategy] --> B[Snowball Method]
    A --> C[Avalanche Method]
    B --> B1[Pay smallest balance first]
    B --> B2[Builds motivation]
    B1 --> B3[Quick wins]
    C --> C1[Pay highest interest first]
    C --> C2[Saves more money]
    C1 --> C3[Mathematically optimal]
\`\`\`

### Head-to-Head Comparison

Using the example above with \\$500/month extra:

| Method | Total Interest Paid | Time to Debt-Free | First Debt Eliminated |
|--------|--------------------|--------------------|----------------------|
| Avalanche | \\$5,120 | 38 months | 9 months |
| Snowball | \\$5,680 | 39 months | 4 months |

The avalanche saves \\$560 in interest and finishes one month sooner. But the snowball provides a psychological victory 5 months earlier.

### Real-World Example: The Psychology Factor

Marcus had \\$38,000 in debt across six accounts. He tried the avalanche method for four months but felt demoralized — his largest high-interest debt barely budged. He switched to the snowball method and paid off his smallest debt (\\$800 store credit card) in six weeks. The rush of crossing a debt off his list motivated him to attack the next one. Eighteen months later, Marcus was debt-free.

The mathematically perfect plan you abandon is worse than the suboptimal plan you complete.

### A Hybrid Approach

Some financial advisors recommend a hybrid:

1. **First**, pay off any debt under \\$500 regardless of interest rate (quick win).
2. **Then**, switch to the avalanche method for remaining debts.
3. **If motivation drops**, knock out the next smallest balance for a psychological boost.

### Which Should You Choose?

| Choose Avalanche If... | Choose Snowball If... |
|------------------------|----------------------|
| You are disciplined and motivated by math | You need quick wins to stay motivated |
| Your highest-rate debt is not the largest | You have several small debts to eliminate |
| You hate paying unnecessary interest | You have tried and failed to pay off debt before |
| You are analytical by nature | You are emotional about money |

### The Real Enemy: Minimum Payments

Both methods share a critical requirement: paying **more** than the minimum. Minimum payments are designed to maximize interest revenue for the lender. On a \\$10,000 credit card at 20% APR with minimum payments (2% of balance), payoff takes over 30 years and costs \\$16,000+ in interest.

### Key Takeaway

Both the avalanche and snowball methods work. The avalanche saves money; the snowball builds momentum. Choose the method that matches your personality, or use a hybrid. The only losing strategy is paying only minimums and hoping the debt disappears.

> "The paid-off mortgage has replaced the BMW as the status symbol of choice." — Dave Ramsey

*Resources: Dave Ramsey's Debt Snowball, Investopedia Debt Avalanche, Harvard Business Review debt repayment study, Unbury.Me (free debt payoff calculator).*`,
    },
    {
      id: "pf-student-loans",
      slug: "student-loans",
      title: "Student Loans: Repayment Strategies",
      content: `## Student Loans: Repayment Strategies

Student-loan debt in the United States totals **$1.77 trillion**, held by about **43.5 million borrowers**.  
The average balance is **$37,000**—roughly the price of a new car, but with no trade-in option.

\`\`\`concept
{"title": "Rule #1", "variant": "rule", "content": "Always know whether your loans are federal or private. This single fact determines every option you have."}
\`\`\`

### Federal vs. Private: Know the Line in the Sand

| Feature | Federal Loans | Private Loans |
|---------|--------------|--------------|
| Interest rates | Fixed by Congress (2024: 5.50 % undergrad) | 4–14 % (credit-based, can be variable) |
| Income-driven plans | ✅ Yes | ❌ No |
| Forgiveness programs | ✅ PSLF, IDR forgiveness | ❌ No |
| Deferment / forbearance | Generous, built-in | Limited, lender decides |
| Bankruptcy discharge | Practically impossible | Practically impossible |

\`\`\`quiz
{"title": "Quick Check: Federal vs. Private", "questions": [
  {"question": "Which loans can be placed on an Income-Driven Repayment (IDR) plan?", "options": ["Only federal loans", "Only private loans", "Both", "Neither"], "answer": 0, "explanation": "IDR plans are a federal-only benefit; private lenders do not offer them."},
  {"question": "What happens to federal protections if you refinance federal loans with a private lender?", "options": ["They transfer to the new lender", "They are permanently lost", "They pause for 12 months", "They become optional"], "answer": 1, "explanation": "Refinancing federal → private is a one-way door: once you leave the federal system, you cannot return."},
  {"question": "Which balance is most likely to be eligible for Public Service Loan Forgiveness?", "options": ["$20 k private loan at 8 %", "$55 k federal Direct loan", "$30 k Parent PLUS loan in parent's name", "$15 k federal Perkins loan held by the school"], "answer": 1, "explanation": "Only Direct loans in the borrower's name qualify; private and most Perkins loans do not."}
]}
\`\`\`

### Federal Repayment Plans in One Glance

\`\`\`tabs
{"tabs": [
  {"label": "Standard", "content": "**10-year fixed schedule.**\\n- Highest monthly payment\\n- Least total interest\\n- Automatically assigned if you do nothing"},
  {"label": "Graduated", "content": "**10-year schedule, payments rise every 2 years.**\\n- Good when you expect promotions / raises\\n- More interest than Standard"},
  {"label": "Extended", "content": "**25-year schedule.**\\n- Needs ≥ $30 k balance\\n- Payment can be fixed or graduated\\n- Much more interest overall"},
  {"label": "IDR Family", "content": "**Payments = % of discretionary income.**\\n- SAVE, PAYE, IBR, ICR\\n- 20-25-year forgiveness (taxable)\\n- 10-year forgiveness if you add PSLF"}
]}
\`\`\`

\`\`\`callout
{"type": "warning", "title": "Interest Never Sleeps", "content": "On IDR plans, payments may be lower than monthly interest—your balance can grow even while you pay. Forgiveness can still make this worthwhile, but run the numbers first."}
\`\`\`

### Public Service Loan Forgiveness (PSLF): The 10-Year Shortcut

Work full-time for government or any 501(c)(3) nonprofit, make **120 qualifying payments** on an IDR plan, and the remaining balance is wiped out **tax-free**.

\`\`\`steps
{"title": "PSLF Checklist", "steps": [
  {"title": "1. Confirm Loan Type", "content": "Only **Direct** loans qualify. Older FFEL or Perkins loans must be consolidated into a Direct Consolidation loan first."},
  {"title": "2. Pick an IDR Plan", "content": "SAVE, PAYE, IBR, or ICR—whichever gives the lowest payment."},
  {"title": "3. Certify Employment Yearly", "content": "Use the **PSLF Help Tool** on StudentAid.gov to generate a form for each employer, signed by HR."},
  {"title": "4. Track Payments", "content": "FedLoan (now MOHELA) counts qualifying payments. Keep your own spreadsheet as backup."},
  {"title": "5. Apply After 120", "content": "Submit the final PSLF form; forgiveness typically processes within 3–6 months."}
]}
\`\`\`

\`\`\`trace
{"title": "Aisha’s PSLF Walk-Through", "language": "python", "code": "# Aisha: public-school teacher, $60 k federal Direct loans at 5.5 %\\n# SAVE plan: 10 % of discretionary income → $250 / mo\\nbalance = 60_000\\nrate = 0.055 / 12          # monthly rate\\npayment = 250\\nmonths = 0\\ntotal_paid = 0\\n\\nwhile months < 120:        # 10 years of PSLF\\n    interest = balance * rate\\n    balance += interest - payment\\n    total_paid += payment\\n    months += 1\\n\\nprint(f\\"Paid \\\\\${total_paid:,.0f}; ~\\\\\${balance:,.0f} forgiven\\")\\n# Output: Paid $30,000; ~$42,000 forgiven (tax-free)", "frames": [
  {"line": 1, "vars": {"balance": 60000, "months": 0, "total_paid": 0}, "note": "Starting balance", "stdout": ""},
  {"line": 9, "vars": {"months": 1, "balance": 60025, "total_paid": 250}, "note": "Interest accrues faster than payment", "stdout": ""},
  {"line": 9, "vars": {"months": 120, "balance": 42038, "total_paid": 30000}, "note": "After 120 payments", "stdout": "Paid $30,000; ~$42,000 forgiven"}
]}
\`\`\`

### Refinancing: The Double-Edged Sword

Refinancing **replaces** your existing loan(s) with a new **private** loan. You keep the debt, but the terms change.

\`\`\`compare
{"variant": "good-bad", "before": {"label": "Refinance WHEN", "code": "- High-interest PRIVATE loans\\n- Credit score ≥ 700\\n- Stable income\\n- Can drop rate by ≥ 1 %\\n- No need for IDR / PSLF"}, "after": {"label": "Do NOT refinance WHEN", "code": "- Loans are federal and you may need:\\n  – Income-driven payments\\n  – Deferment / forbearance\\n  – PSLF or IDR forgiveness\\n- Credit score < 650\\n- Income uncertain"}}
\`\`\`

\`\`\`callout
{"type": "danger", "title": "One-Way Door", "content": "Once federal loans become private, you cannot re-enter the federal system. There is no \\"undo\\" button."}
\`\`\`

### Aggressive Payoff Playbook

1. **Target the highest-rate loan first** (avalanche).  
2. **Tell your servicer** extra money goes to **principal**, not “next month’s payment.”  
3. **Refinance high-rate private loans** only if the above criteria are met.  
4. **Tap employer assistance**—up to **$5,250/year** is tax-free through 2025.  
5. **Funnel side-gig income** straight to loans.

\`\`\`calculator
{"type": "loan", "title": "Avalanche vs Minimum-Only", "inputs": [
  {"id": "principal", "label": "Loan balance", "default": 35000, "min": 1000, "max": 200000, "prefix": "$"},
  {"id": "rate", "label": "Interest rate", "default": 7, "min": 3, "max": 15, "suffix": "%"},
  {"id": "extra", "label": "Extra payment/month", "default": 200, "min": 0, "max": 2000, "prefix": "$"}
]}
\`\`\`

### Forgiveness vs. Aggressive Payoff: Decision Matrix

| Factor | Consider Forgiveness | Pay Off Aggressively |
|--------|----------------------|----------------------|
| **Loan balance** | > 1.5× annual income | < 1× annual income |
| **Career** | Government / nonprofit | Private sector |
| **Income trend** | Flat or modest raises | Rapid raises / high ceiling |
| **Risk tolerance** | Comfortable with 10-25 yr plan | Hates debt, wants certainty |

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Federal loans = options (IDR, PSLF); private loans = few safety nets.",
  "PSLF can erase tens of thousands tax-free in 10 years—certify employment annually.",
  "Refinancing federal loans is irreversible; only do it if you will never need IDR or forgiveness.",
  "Paying extra is useless if you don’t specify “apply to principal.”",
  "Use the Federal Loan Simulator (StudentAid.gov) every year—life changes, and so should your plan."
]}
\`\`\``,
    },
    {
      id: "pf-mortgages",
      slug: "mortgages",
      title: "Mortgages: Fixed vs Variable & Amortization",
      content: `## Mortgages: Fixed vs Variable & Amortization

For most people, a mortgage is the largest financial commitment they will ever make. Understanding how mortgages work — the types, the math, and the hidden costs — empowers you to make a decision worth hundreds of thousands of dollars.

### What Is a Mortgage?

A mortgage is a loan used to purchase real estate, where the property itself serves as collateral. If you stop paying, the lender can foreclose and take the property. Key terms:

- **Principal:** The amount borrowed
- **Interest:** The cost of borrowing
- **Term:** Length of the loan (typically 15 or 30 years)
- **Down payment:** The upfront cash you pay (typically 3-20% of the purchase price)
- **Escrow:** Account that holds money for property taxes and insurance

\`\`\`concept
{
  "title": "The Mortgage Time Machine",
  "variant": "mental-model",
  "content": "Think of a mortgage as renting money to buy a house, but with a twist: you're slowly buying the money itself through interest. The longer you 'rent' the money, the more expensive it becomes. A 30-year mortgage at 6% interest means you'll pay more in interest than the original house price!"
}
\`\`\`

### Fixed-Rate Mortgages

A fixed-rate mortgage locks in your interest rate for the entire loan term. Your payment never changes.

**Pros:**
- Predictable payments — easy to budget
- Protected from rising interest rates
- Most popular choice (90%+ of mortgages are fixed-rate)

**Cons:**
- Higher initial rate compared to ARMs
- If rates drop significantly, you need to refinance to benefit
- You pay more interest in the early years (see amortization below)

### Adjustable-Rate Mortgages (ARMs)

An ARM starts with a lower fixed rate for an introductory period, then adjusts periodically based on a market index.

**Common ARM structures:**
- **5/1 ARM:** Fixed for 5 years, then adjusts annually
- **7/1 ARM:** Fixed for 7 years, then adjusts annually
- **10/1 ARM:** Fixed for 10 years, then adjusts annually

**Pros:**
- Lower initial payments
- Good if you plan to sell or refinance before the adjustment period
- Rate caps limit how much the rate can increase per adjustment and over the life of the loan

**Cons:**
- Payment uncertainty after the fixed period
- If rates rise significantly, payments can increase dramatically
- Harder to budget long-term

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "5/1 ARM at 5.5%",
    "code": "Years 1-5: $1,703/month\\nYear 6: Rate adjusts to 7.5%\\nNew payment: $2,098/month (+$395)\\nYear 7: Rate adjusts to 8.5%\\nNew payment: $2,307/month (+$604 total)"
  },
  "after": {
    "label": "30-Year Fixed at 6.5%",
    "code": "Years 1-30: $1,896/month\\nNo changes, ever\\nTotal predictability\\nSame payment in year 1 and year 30"
  }
}
\`\`\`

### 15-Year vs 30-Year: The Trade-Off

| Feature | 15-Year | 30-Year |
|---------|---------|---------|
| Monthly payment | Higher | Lower |
| Interest rate | Typically 0.5-1% lower | Higher |
| Total interest paid | Much less | Much more |
| Flexibility | Less (locked into higher payment) | More (can always pay extra) |

The 15-year mortgage costs more per month but can save **hundreds of thousands** in interest.

### Understanding Amortization

Amortization is the process of paying off a loan through regular payments. Here is the critical insight: **in the early years, most of your payment goes to interest, not principal.**

\`\`\`algoviz
{
  "title": "Amortization: Where Your Payment Goes",
  "type": "array",
  "data": [1625, 271, 1591, 305, 1091, 805, 288, 1608],
  "frames": [
    {"highlight": [0, 1], "label": "Month 1: $1,625 interest (85.7%), $271 principal (14.3%)", "stats": {"payment": 1896, "balance": 299729}},
    {"highlight": [2, 3], "label": "Month 60: $1,591 interest (84%), $305 principal (16%)", "stats": {"payment": 1896, "balance": 280123}},
    {"highlight": [4, 5], "label": "Month 180: $1,091 interest (57.5%), $805 principal (42.5%)", "stats": {"payment": 1896, "balance": 189234}},
    {"highlight": [6, 7], "label": "Month 336: $288 interest (15.2%), $1,608 principal (84.8%)", "stats": {"payment": 1896, "balance": 37256}}
  ],
  "speed": 1200
}
\`\`\`

This front-loading of interest is why extra principal payments in the early years are so powerful — they reduce the balance that future interest is calculated on.

### The Down Payment Decision

| Down Payment | Amount on \\$400K Home | PMI Required? | Monthly Savings |
|-------------|----------------------|--------------|----------------|
| 3% | \\$12,000 | Yes | N/A (baseline) |
| 10% | \\$40,000 | Yes | ~\\$160/month less |
| 20% | \\$80,000 | No | ~\\$340/month less + no PMI |

**PMI (Private Mortgage Insurance)** is required when the down payment is less than 20%. It typically costs 0.5-1% of the loan amount annually and protects the *lender*, not you.

\`\`\`calculator
{
  "type": "loan",
  "title": "Mortgage Payment Calculator",
  "inputs": [
    {"id": "p", "label": "Home Price", "default": 400000, "min": 100000, "max": 2000000, "prefix": "$"},
    {"id": "d", "label": "Down Payment %", "default": 20, "min": 3, "max": 50, "suffix": "%"},
    {"id": "r", "label": "Interest Rate", "default": 6.5, "min": 2, "max": 10, "suffix": "%"},
    {"id": "t", "label": "Loan Term", "default": 30, "min": 15, "max": 30, "suffix": " years"}
  ]
}
\`\`\`

### Real-World Strategy: Extra Payments

Making one extra mortgage payment per year on a 30-year loan typically reduces the term by 4-5 years and saves tens of thousands in interest. You can achieve this by paying biweekly instead of monthly (26 half-payments = 13 full payments per year).

\`\`\`quiz
{
  "title": "Mortgage Mastery Quiz",
  "questions": [
    {
      "question": "Which mortgage type protects you from rising interest rates?",
      "options": ["5/1 ARM", "7/1 ARM", "Fixed-rate mortgage", "Interest-only loan"],
      "answer": 2,
      "explanation": "Fixed-rate mortgages lock in your interest rate for the entire loan term, protecting you from market fluctuations."
    },
    {
      "question": "In year 1 of a 30-year mortgage, approximately what percentage of your payment goes toward principal?",
      "options": ["50%", "25%", "10-15%", "75%"],
      "answer": 2,
      "explanation": "During the first year, roughly 85-90% of your payment goes toward interest, leaving only 10-15% for principal reduction."
    },
    {
      "question": "What's the primary benefit of making extra principal payments in the early years?",
      "options": ["Lower monthly payment", "Reduced interest over the life of the loan", "Elimination of PMI", "Tax benefits"],
      "answer": 1,
      "explanation": "Extra principal payments reduce your loan balance faster, which means less interest accrues over time, potentially saving tens of thousands."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Fixed-rate mortgages provide payment stability but start with higher rates than ARMs",
    "ARMs can save money short-term but carry the risk of significantly higher payments later",
    "15-year mortgages build equity faster and save massive amounts in interest compared to 30-year loans",
    "In early years, most of your payment goes to interest — extra principal payments are most powerful early in the loan",
    "A 20% down payment eliminates PMI and can save hundreds per month"
  ]
}
\`\`\``,
    },
  ],
};
