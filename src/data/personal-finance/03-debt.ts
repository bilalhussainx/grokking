import { Module } from "../types";

export const debtModule: Module = {
  id: "pf-debt",
  title: "Debt Management",
  description:
    "Understand the different types of debt, how credit works, and strategies to eliminate debt efficiently. Resources: Investopedia, Dave Ramsey, Experian, Khan Academy.",
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

**Auto loans** can be acceptable if the vehicle is necessary for earning income and the payment is reasonable (under 10% of take-home pay, with a loan term of 4 years or less). A \\\$15,000 reliable used car financed at 5% is very different from a \\\$60,000 luxury vehicle at 7%.

**Student loans** become bad debt when the degree does not increase earning potential enough to justify the cost. Borrowing \\\$200,000 for a degree leading to a \\\$35,000 salary is a poor return on investment.

### The Interest Rate Test

A simple framework: if the interest rate on the debt is **lower** than the return you could earn investing that money, the debt may be worth carrying. For example:

- Mortgage at 3.5% while the stock market averages 8-10%? The math favors keeping the mortgage and investing extra cash.
- Credit card at 22%? No investment reliably returns 22%. Pay this off immediately.

### Real-World Example: The Debt Spectrum

Consider three friends who each borrow \\\$30,000:

**Alex** borrows for a home down payment supplement via a 5% personal loan. The home appreciates 4% annually. Over 10 years, the property gains \\\$60,000+ in value. The loan cost about \\\$8,000 in interest. **Net positive.**

**Jordan** borrows for a master's degree at 6% interest. The degree increases salary from \\\$50,000 to \\\$75,000. The extra \\\$25,000/year easily covers the loan. **Net positive.**

**Taylor** borrows via credit cards at 22% APR for furniture, vacations, and dining. The items are consumed or depreciated. Minimum payments stretch the payoff to 15+ years with \\\$40,000+ in interest. **Net negative.**

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

### What Is a Credit Score?

Credit scores range from 300 to 850 (FICO model). Higher is better:

| Range | Rating | Impact |
|-------|--------|--------|
| 800-850 | Exceptional | Best rates on everything |
| 740-799 | Very Good | Excellent rates, easy approvals |
| 670-739 | Good | Favorable rates, most loans approved |
| 580-669 | Fair | Higher rates, some denials |
| 300-579 | Poor | Difficulty getting approved, very high rates |

The average FICO score in the US is approximately 715 (as of 2023, per Experian).

### The Five Factors

Your FICO score is calculated from five weighted factors:

| Factor | Weight | What It Measures |
|--------|--------|-----------------|
| **Payment history** | 35% | Do you pay on time? Even one 30-day late payment can drop your score 50-100 points |
| **Credit utilization** | 30% | How much of your available credit are you using? Keep below 30%, ideally below 10% |
| **Length of credit history** | 15% | How long have your accounts been open? Older is better |
| **Credit mix** | 10% | Do you have different types of credit? (cards, auto, mortgage, student loans) |
| **New credit inquiries** | 10% | How many new accounts or applications recently? Too many signals risk |

### Credit Utilization Deep Dive

Credit utilization is the ratio of your balance to your credit limit:

\`\`\`
Utilization = Balance / Credit Limit x 100
\`\`\`

**Example:** You have a credit card with a \\\$10,000 limit and a \\\$2,500 balance. Your utilization is 25%.

- **0-9%**: Excellent impact on score
- **10-29%**: Good
- **30-49%**: Fair — hurting your score
- **50%+**: Poor — significantly damaging

**Pro tip:** Utilization is typically measured on your statement closing date, not your due date. Paying your balance before the statement closes can show lower utilization to the bureaus.

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

### Real-World Example: Score Impact

Sarah has a 750 credit score. She is shopping for a \\\$300,000 30-year fixed mortgage.

| Credit Score | Estimated APR | Monthly Payment | Total Interest Paid |
|-------------|--------------|----------------|-------------------|
| 750+ | 6.5% | \\\$1,896 | \\\$382,560 |
| 680 | 7.1% | \\\$2,014 | \\\$425,040 |
| 620 | 7.8% | \\\$2,155 | \\\$475,800 |

The difference between a 750 and 620 score costs **\\\$93,240 over the life of the loan**. Your credit score is literally worth tens of thousands of dollars.

### How to Improve Your Credit Score

1. **Pay every bill on time** — Set up autopay for at least the minimum
2. **Lower utilization** — Pay down balances or request credit limit increases
3. **Keep old accounts open** — Even if you do not use them, the age helps
4. **Limit hard inquiries** — Only apply for credit when you truly need it
5. **Dispute errors** — File disputes online through each bureau's website

### Key Takeaway

Your credit score is one of the most consequential numbers in your financial life. It is built on five factors you can control, and the difference between a good and poor score can cost you six figures over a lifetime. Check your credit report annually, pay on time, and keep utilization low.

*Resources: AnnualCreditReport.com, MyFICO.com, Experian Credit Education, Khan Academy Credit.*`,
    },
    {
      id: "pf-avalanche-vs-snowball",
      slug: "avalanche-vs-snowball",
      title: "Debt Avalanche vs Debt Snowball",
      content: `## Debt Avalanche vs Debt Snowball

When you have multiple debts, the order in which you pay them off matters. The two most popular repayment strategies are the **debt avalanche** (mathematically optimal) and the **debt snowball** (psychologically optimal). Both work — the best choice depends on your personality.

### The Debt Avalanche Method

**Strategy:** Pay minimum on all debts. Direct all extra money to the debt with the **highest interest rate**. Once that is paid off, roll the payment to the next highest rate.

**Example — Four debts, \\\$500/month extra to throw at debt:**

| Debt | Balance | APR | Minimum |
|------|---------|-----|---------|
| Credit Card A | \\\$5,000 | 22% | \\\$100 |
| Credit Card B | \\\$2,000 | 18% | \\\$50 |
| Car Loan | \\\$12,000 | 6% | \\\$250 |
| Student Loan | \\\$25,000 | 5% | \\\$280 |

**Avalanche order:** Credit Card A (22%) first, then Credit Card B (18%), then Car Loan (6%), then Student Loan (5%).

You direct \\\$500 extra to Credit Card A (\\\$600/month total). Once it is paid off in about 9 months, you redirect that \\\$600 to Credit Card B, creating a \\\$650/month payment. And so on.

**Pros:** Minimizes total interest paid. Mathematically, this is the cheapest way out of debt.
**Cons:** If the highest-rate debt has a large balance, it may take a long time to see the first debt eliminated.

### The Debt Snowball Method

**Strategy:** Pay minimum on all debts. Direct all extra money to the debt with the **smallest balance**. Once that is paid off, roll the payment to the next smallest.

**Using the same debts:**

**Snowball order:** Credit Card B (\\\$2,000) first, then Credit Card A (\\\$5,000), then Car Loan (\\\$12,000), then Student Loan (\\\$25,000).

You direct \\\$500 extra to Credit Card B (\\\$550/month total). It is paid off in about 4 months — a quick win! Then you redirect that \\\$550 to Credit Card A, and so on.

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

Using the example above with \\\$500/month extra:

| Method | Total Interest Paid | Time to Debt-Free | First Debt Eliminated |
|--------|--------------------|--------------------|----------------------|
| Avalanche | \\\$5,120 | 38 months | 9 months |
| Snowball | \\\$5,680 | 39 months | 4 months |

The avalanche saves \\\$560 in interest and finishes one month sooner. But the snowball provides a psychological victory 5 months earlier.

### Real-World Example: The Psychology Factor

Marcus had \\\$38,000 in debt across six accounts. He tried the avalanche method for four months but felt demoralized — his largest high-interest debt barely budged. He switched to the snowball method and paid off his smallest debt (\\\$800 store credit card) in six weeks. The rush of crossing a debt off his list motivated him to attack the next one. Eighteen months later, Marcus was debt-free.

The mathematically perfect plan you abandon is worse than the suboptimal plan you complete.

### A Hybrid Approach

Some financial advisors recommend a hybrid:

1. **First**, pay off any debt under \\\$500 regardless of interest rate (quick win).
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

Both methods share a critical requirement: paying **more** than the minimum. Minimum payments are designed to maximize interest revenue for the lender. On a \\\$10,000 credit card at 20% APR with minimum payments (2% of balance), payoff takes over 30 years and costs \\\$16,000+ in interest.

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

Student loan debt in the United States totals over \\\$1.77 trillion, held by approximately 43.5 million borrowers (Federal Reserve, 2023). The average borrower owes around \\\$37,000. Understanding your repayment options is essential for managing this debt effectively.

### Federal vs Private Student Loans

| Feature | Federal Loans | Private Loans |
|---------|--------------|--------------|
| Interest rates | Fixed, set by Congress | Fixed or variable, set by lender |
| Income-driven plans | Yes | No |
| Forgiveness programs | Yes (PSLF, IDR forgiveness) | No |
| Deferment/forbearance | Generous options | Limited |
| Bankruptcy discharge | Very difficult | Very difficult |
| Current rates (2024) | 5.50% (undergrad) | 4-14% (varies by credit) |

**Rule #1:** Always know whether your loans are federal or private. This determines your options.

### Federal Repayment Plans

**Standard Repayment:** Fixed payments over 10 years. Highest monthly payment but lowest total interest.

**Graduated Repayment:** Payments start low and increase every two years. Same 10-year term. Good for those expecting rising income.

**Extended Repayment:** Payments over 25 years. Lower monthly payment but significantly more interest.

**Income-Driven Repayment (IDR):** Monthly payments based on a percentage of discretionary income. Four types exist:

| Plan | Payment | Forgiveness After |
|------|---------|------------------|
| SAVE (newest) | 5-10% of discretionary income | 20-25 years |
| PAYE | 10% of discretionary income | 20 years |
| IBR | 10-15% of discretionary income | 20-25 years |
| ICR | 20% of discretionary income | 25 years |

After the forgiveness period, remaining balance is forgiven (but may be taxed as income under current law).

### Public Service Loan Forgiveness (PSLF)

If you work full-time for a qualifying employer (government, nonprofit), you can receive loan forgiveness after **120 qualifying payments** (10 years) on an IDR plan. The forgiven amount is **not taxed**.

Requirements:
- Federal Direct Loans only
- Full-time employment at a qualifying organization
- 120 qualifying payments (do not need to be consecutive)
- Must be on an IDR plan

**Real-World Example:** Aisha is a public school teacher with \\\$60,000 in federal loans. On the SAVE plan, her payment is \\\$250/month. After 10 years of payments totaling \\\$30,000, her remaining balance of approximately \\\$42,000 is forgiven tax-free through PSLF. Without PSLF, she would have paid over \\\$72,000 total.

### Refinancing: When It Makes Sense

Refinancing replaces your existing loans with a new private loan at a (hopefully) lower interest rate.

**Refinance when:**
- You have high-interest private loans AND good credit (700+)
- You have stable, high income and do not need federal protections
- You can reduce your rate by 1%+ and maintain a reasonable term

**Do NOT refinance when:**
- Your loans are federal and you may need IDR, deferment, or PSLF
- Your credit score is low (you will not get a better rate)
- You are uncertain about income stability

**Warning:** Refinancing federal loans into private loans permanently eliminates all federal protections and forgiveness options.

### Aggressive Payoff Strategies

If you want to eliminate student loans fast:

1. **Pay more than the minimum** — Specify that extra payments go to **principal**, not future payments
2. **Use the avalanche method** — Target the highest-rate loan first
3. **Refinance high-rate loans** — If it makes sense per the criteria above
4. **Employer assistance** — Some employers offer student loan repayment benefits (up to \\\$5,250/year tax-free through 2025)
5. **Side income** — Dedicate freelance or gig income entirely to loans

### The Forgiveness vs Payoff Decision

| Factor | Pursue Forgiveness | Pay Off Aggressively |
|--------|-------------------|---------------------|
| Loan balance | Very high relative to income | Manageable relative to income |
| Career path | Public service / nonprofit | Private sector |
| Timeline | Can commit 10-25 years | Want debt-free ASAP |
| Risk tolerance | Comfortable with program rules | Prefer certainty |

### Key Takeaway

Student loans are complex, but you have options. Federal borrowers should explore IDR plans and PSLF before aggressive payoff. Private loan holders should consider refinancing if rates can be lowered. The worst strategy is ignoring the debt and making only minimum payments for decades.

*Resources: StudentAid.gov, Federal Student Aid Loan Simulator, NerdWallet Student Loan Refinancing, The PSLF Help Tool.*`,
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

### Fixed-Rate Mortgages

A fixed-rate mortgage locks in your interest rate for the entire loan term. Your payment never changes.

**Example:** \\\$300,000 loan at 6.5% fixed for 30 years
- Monthly payment: \\\$1,896 (principal + interest)
- Total paid over 30 years: \\\$682,633
- Total interest: \\\$382,633

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

**Example:** \\\$300,000 loan, 5/1 ARM starting at 5.5%
- Years 1-5: \\\$1,703/month
- Year 6+: Adjusts based on index (could go up to 7-8% or higher)

**Pros:**
- Lower initial payments
- Good if you plan to sell or refinance before the adjustment period
- Rate caps limit how much the rate can increase per adjustment and over the life of the loan

**Cons:**
- Payment uncertainty after the fixed period
- If rates rise significantly, payments can increase dramatically
- Harder to budget long-term

### 15-Year vs 30-Year: The Trade-Off

| Feature | 15-Year | 30-Year |
|---------|---------|---------|
| Monthly payment | Higher | Lower |
| Interest rate | Typically 0.5-1% lower | Higher |
| Total interest paid | Much less | Much more |
| Flexibility | Less (locked into higher payment) | More (can always pay extra) |

**Example on \\\$300,000 loan:**
- 30-year at 6.5%: \\\$1,896/month, \\\$382,633 total interest
- 15-year at 5.8%: \\\$2,511/month, \\\$151,937 total interest

The 15-year mortgage costs \\\$615 more per month but saves **\\\$230,696** in interest.

### Understanding Amortization

Amortization is the process of paying off a loan through regular payments. Here is the critical insight: **in the early years, most of your payment goes to interest, not principal.**

**Year 1 of a \\\$300,000, 30-year, 6.5% mortgage:**
- Monthly payment: \\\$1,896
- Month 1 interest: \\\$1,625 (85.7% of payment!)
- Month 1 principal: \\\$271 (14.3%)

**Year 15 (halfway through):**
- Monthly payment: \\\$1,896 (same)
- Month 180 interest: \\\$1,091 (57.5%)
- Month 180 principal: \\\$805 (42.5%)

**Year 28 (near the end):**
- Monthly payment: \\\$1,896 (same)
- Month 336 interest: \\\$288 (15.2%)
- Month 336 principal: \\\$1,608 (84.8%)

This front-loading of interest is why extra principal payments in the early years are so powerful — they reduce the balance that future interest is calculated on.

### The Down Payment Decision

| Down Payment | Amount on \\\$400K Home | PMI Required? | Monthly Savings |
|-------------|----------------------|--------------|----------------|
| 3% | \\\$12,000 | Yes | N/A (baseline) |
| 10% | \\\$40,000 | Yes | ~\\\$160/month less |
| 20% | \\\$80,000 | No | ~\\\$340/month less + no PMI |

**PMI (Private Mortgage Insurance)** is required when the down payment is less than 20%. It typically costs 0.5-1% of the loan amount annually and protects the *lender*, not you.

### Real-World Strategy: Extra Payments

Making one extra mortgage payment per year on a 30-year loan typically reduces the term by 4-5 years and saves tens of thousands in interest. You can achieve this by paying biweekly instead of monthly (26 half-payments = 13 full payments per year).

### Key Takeaway

A mortgage is a powerful tool for homeownership, but the details matter enormously. Understand the difference between fixed and adjustable rates, use amortization awareness to your advantage, and aim for 20% down to avoid PMI. The right mortgage structure can save you hundreds of thousands of dollars.

*Resources: Investopedia Mortgage Guide, Bankrate Mortgage Calculator, Khan Academy Housing, Consumer Financial Protection Bureau (CFPB).*`,
    },
  ],
};
