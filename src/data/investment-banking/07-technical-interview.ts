import { Module } from "../types";

export const technicalInterviewModule: Module = {
  id: "ib-interview",
  title: "Technical Interview Preparation",
  description:
    "Master the most common technical questions asked in investment banking interviews — DCF walkthroughs, LBO mechanics, accounting, and more.",
  lessons: [
    {
      id: "ib-interview-dcf-walkthrough",
      slug: "walk-me-through-a-dcf",
      title: "Walk Me Through a DCF",
      content: `## Walk Me Through a DCF

"Walk me through a DCF" is arguably the most common technical question in investment banking interviews. Interviewers ask it because it tests your understanding of valuation theory, financial modeling, and your ability to communicate complex concepts clearly and concisely.

### The Framework Answer

A strong answer follows this structure (aim for 60-90 seconds):

**Step 1: Project Free Cash Flows**
"A DCF values a company based on the present value of its future free cash flows. First, I would project the company's unlevered free cash flows for 5-10 years. I start with EBIT, tax-affect it to get NOPAT, add back depreciation and amortization, subtract capital expenditures, and subtract changes in net working capital."

**Step 2: Calculate Terminal Value**
"Since I cannot project cash flows forever, I calculate a terminal value at the end of the projection period. I can use either the Gordon Growth Model — where I take the final year's FCF, grow it by the long-term growth rate, and divide by WACC minus the growth rate — or the exit multiple method, where I apply a market multiple like EV/EBITDA to the terminal year's EBITDA."

**Step 3: Discount to Present Value**
"I then discount all projected cash flows and the terminal value back to the present using the Weighted Average Cost of Capital, or WACC. WACC blends the cost of equity, calculated using CAPM, and the after-tax cost of debt, weighted by their proportions in the capital structure."

**Step 4: Calculate Equity Value**
"The sum of the discounted cash flows gives me the enterprise value. I then subtract net debt and any other non-equity claims to get equity value. Dividing by diluted shares outstanding gives me the implied share price."

### Follow-Up Questions and Strong Answers

**"Why do you use unlevered free cash flow?"**
"Because we are calculating enterprise value — the value to all capital providers, including both debt and equity holders. Unlevered FCF is calculated before interest payments, so it represents the cash available to everyone. If we used levered FCF, we would need to discount at the cost of equity instead of WACC."

**"What discount rate do you use?"**
"WACC — the Weighted Average Cost of Capital. It blends the cost of equity (from CAPM: risk-free rate plus beta times the equity risk premium) with the after-tax cost of debt, weighted by the target capital structure."

**"How do you calculate terminal value?"**
"Two methods. The perpetuity growth model divides the next year's FCF by the difference between WACC and the long-term growth rate — typically 2-3% to approximate GDP growth. The exit multiple method applies a comparable company multiple like EV/EBITDA to the terminal year's metric. I use both as cross-checks."

**"What is the biggest driver of value in a DCF?"**
"Terminal value — it typically represents 60-80% of the total enterprise value, which is why the terminal growth rate and exit multiple assumptions are so important. Small changes in these assumptions can swing the valuation by 20% or more."

**"When would a DCF not be appropriate?"**
"For companies with highly unpredictable cash flows — early-stage startups with no revenue, financial institutions where cash flows have a different meaning, or distressed companies where cash flows may be negative indefinitely. In those cases, asset-based or comparable approaches might be more appropriate."

**"Walk me through the bridge from enterprise value to equity value per share."**
"Start with enterprise value. Subtract total debt. Add cash and cash equivalents. Subtract minority interest. Subtract preferred stock. Add investments in associates. This gives equity value. Divide by fully diluted shares outstanding, using the treasury stock method for options and warrants, to get equity value per share."

### Common Mistakes in Interviews

1. **Rambling**: Keep your initial answer under 90 seconds. Details come in follow-ups.
2. **Confusing levered and unlevered FCF**: Know the difference cold.
3. **Forgetting the equity bridge**: Enterprise value is not equity value.
4. **Saying "the DCF gives us the right answer"**: A DCF gives an estimate. Say "implied value" not "the answer."
5. **Not knowing the numbers**: Have a sense of typical WACC ranges (8-12%), terminal growth rates (2-3%), and terminal value as percentage of total value (60-80%).

### Key Takeaway

The DCF walkthrough tests both technical knowledge and communication skills. Practice delivering a crisp, structured answer that flows logically from cash flow projection through terminal value to discounting and the equity bridge. Then be prepared for 3-5 follow-up questions that test depth. The best answers are clear, concise, and demonstrate genuine understanding rather than memorized scripts.`,
    },
    {
      id: "ib-interview-lbo-walkthrough",
      slug: "walk-me-through-an-lbo",
      title: "Walk Me Through an LBO",
      content: `## Walk Me Through an LBO

The LBO walkthrough is the second most common technical question in investment banking interviews. It tests your understanding of leverage, private equity mechanics, and how debt amplifies equity returns. Many candidates can walk through a DCF but stumble on the LBO — mastering it differentiates you.

### The Framework Answer

**Step 1: The Purchase**
"In a leveraged buyout, a financial sponsor — typically a private equity firm — acquires a company using a combination of debt and equity. The debt usually represents 60-70% of the purchase price, and the sponsor contributes 30-40% as equity. The purchase price is typically based on an EV/EBITDA multiple."

**Step 2: Operating the Business**
"Over a 3-7 year hold period, the company uses its free cash flow to service and pay down debt. The PE firm may also implement operational improvements to grow revenue and EBITDA, cut costs, or make add-on acquisitions to build value."

**Step 3: The Exit**
"At the end of the hold period, the sponsor exits the investment — typically by selling to another company, selling to another PE firm, or taking the company public through an IPO. The exit value is based on the terminal year EBITDA times an exit multiple."

**Step 4: Return Calculation**
"Returns are measured by MOIC and IRR. MOIC is the total equity proceeds divided by the initial equity investment. IRR is the annualized return rate. A typical PE buyout targets a 2.0-2.5x MOIC and a 20%+ IRR."

### Follow-Up Questions and Strong Answers

**"What makes a good LBO candidate?"**
"Stable and predictable cash flows — the company needs to reliably service its debt. Low capital expenditure requirements, so more cash is available for debt repayment. A strong market position that provides revenue stability. And ideally, operational improvement opportunities that the PE firm can execute to grow EBITDA."

**"Where do the returns come from in an LBO?"**
"Three sources. First, debt paydown — as the company repays debt, that value transfers from lenders to equity holders. This is the most reliable source. Second, EBITDA growth — if the company grows its earnings through revenue growth or margin improvement, the enterprise value at exit is higher. Third, multiple expansion — if the exit multiple is higher than the entry multiple, additional value is created."

**"Walk me through a paper LBO."**
"Say we buy a company for 10 times 100 million dollars of EBITDA, so 1 billion dollars enterprise value. We use 60% debt, which is 600 million, and 40% equity, which is 400 million. Over 5 years, EBITDA grows 5% per year to about 128 million. The company generates enough free cash flow to pay down 200 million of the 600 million in debt, leaving 400 million outstanding. At exit, we sell at 10 times the new EBITDA: 10 times 128 million equals 1.28 billion. Subtract 400 million of remaining debt, and equity proceeds are 880 million. MOIC is 880 over 400, which is 2.2 times. IRR is roughly 17%."

**"What is the impact of increasing leverage?"**
"More leverage amplifies returns in both directions. If the deal goes well, the equity return is higher because the sponsor invested less of its own capital. But if the company underperforms, the fixed debt payments become a burden — the company may breach covenants or even default, potentially wiping out the equity entirely."

**"How does an LBO set a floor for valuation?"**
"The LBO analysis tells you the maximum price a financial buyer can pay while still achieving their target returns. Since PE firms represent a large pool of potential acquirers, the LBO price effectively sets a floor — if the market prices the company below this level, a PE firm would step in and buy it."

**"What is a dividend recapitalization?"**
"A dividend recap is when the portfolio company takes on additional debt and uses the proceeds to pay a dividend to the PE sponsor. This allows the sponsor to take cash out of the deal before the full exit, which boosts IRR because money comes back sooner. It increases the company's leverage and risk, but it is a common tool for enhancing returns."

### The Paper LBO Quick Formula

For back-of-envelope calculations in an interview:

\`\`\`
Entry EV = Entry Multiple x EBITDA
Equity In = Entry EV x Equity %
Exit EBITDA = EBITDA x (1 + growth)^years
Exit EV = Exit Multiple x Exit EBITDA
Debt Remaining = Initial Debt - Cumulative Paydown
Equity Out = Exit EV - Debt Remaining
MOIC = Equity Out / Equity In
\`\`\`

Practice doing this in your head with round numbers until you can complete it in 60 seconds.

### Key Takeaway

The LBO walkthrough tests three things: your understanding of how leverage creates returns, your ability to do quick mental math, and your familiarity with private equity as an asset class. Practice the paper LBO repeatedly until the math is automatic, and be ready to discuss qualitative factors like ideal LBO characteristics and return attribution.`,
    },
    {
      id: "ib-interview-accounting",
      slug: "accounting-questions",
      title: "Accounting Questions",
      content: `## Accounting Questions

Accounting is the language of finance, and investment banking interviews test it rigorously. You do not need to be a CPA, but you must understand how the three financial statements work, how they connect, and how specific transactions flow through them. These questions separate candidates who have real financial literacy from those who have only memorized valuation formulas.

### Question 1: How Do the Three Financial Statements Link?

**Strong Answer:**
"Net income from the income statement flows to retained earnings on the balance sheet and is the starting point for the cash flow statement. Non-cash charges like depreciation are added back on the cash flow statement but reduce the net book value of assets on the balance sheet. Changes in working capital items on the balance sheet flow through the operating section of the cash flow statement. Capital expenditures increase PP&E on the balance sheet and appear as a cash outflow in the investing section. Debt issuances and repayments change the balance sheet and flow through financing activities. Finally, the net change in cash from the cash flow statement reconciles to the change in the cash line on the balance sheet."

### Question 2: Walk Me Through a 10-Dollar Increase in Depreciation

This is one of the most commonly asked accounting questions. Walk through the impact on each statement:

**Income Statement:**
- Depreciation increases by 10, reducing operating income by 10
- Pre-tax income decreases by 10
- Taxes decrease by 10 x Tax Rate (assume 25%: taxes decrease by 2.5)
- Net income decreases by 7.5

**Cash Flow Statement:**
- Net income decreases by 7.5
- Depreciation add-back increases by 10
- Net operating cash flow increases by 2.5

**Balance Sheet:**
- PP&E decreases by 10 (accumulated depreciation increases)
- Cash increases by 2.5 (from the cash flow statement)
- Total assets decrease by 7.5
- Retained earnings decrease by 7.5 (lower net income)
- Balance sheet balances: both sides decrease by 7.5

**The key insight:** Depreciation is a non-cash expense, so more depreciation actually increases cash flow by the amount of the tax savings (10 x 25% = 2.5).

### Question 3: Walk Me Through a 10-Dollar Increase in Revenue

**Income Statement:**
- Revenue increases by 10
- Assuming no incremental costs (pure flow-through scenario), pre-tax income increases by 10
- Taxes increase by 2.5 (at 25% rate)
- Net income increases by 7.5

**Cash Flow Statement:**
- Net income increases by 7.5
- If the revenue is collected in cash, no working capital impact
- If on credit, accounts receivable increases by 10, which is a use of cash of 10
- Net cash impact: either +7.5 (cash collected) or -2.5 (on credit)

**Balance Sheet:**
- If cash: Cash up 7.5, retained earnings up 7.5
- If credit: AR up 10, cash down 2.5, retained earnings up 7.5

### Question 4: What is Deferred Revenue?

"Deferred revenue is a liability on the balance sheet that represents cash the company has received for goods or services it has not yet delivered. For example, if a SaaS company receives a 12-month payment upfront, it records the full amount as deferred revenue and recognizes 1/12th as revenue each month. As it delivers the service, deferred revenue decreases and revenue increases."

### Question 5: What is the Difference Between Cash-Based and Accrual Accounting?

"Cash accounting records transactions when cash changes hands — revenue when cash is collected, expenses when cash is paid. Accrual accounting records transactions when they are earned or incurred, regardless of when cash moves. For example, under accrual accounting, revenue from a product shipped on December 28th is recorded in December, even if the customer does not pay until January. Accrual accounting is required by GAAP and IFRS and is what we use in financial modeling."

### Question 6: If You Could Only Look at One Financial Statement, Which Would You Choose?

**Strong Answer:**
"The cash flow statement. It tells me how much cash the company actually generated and how it was used — how much came from operations versus financing versus investing. It reconciles from net income, so I can back into profitability. And unlike the income statement, it is harder to manipulate because it tracks actual cash movements. That said, ideally you need all three statements for a complete picture."

### Practice Method

For each of these questions, practice:
1. Stating the answer crisply (30 seconds)
2. Walking through the three-statement impact (60 seconds)
3. Connecting it to a real-world context (15 seconds)

Do not memorize scripts — understand the logic so you can handle any variation.

### Key Takeaway

Accounting questions in IB interviews are not about obscure accounting rules — they are about demonstrating that you understand how financial statements work as an interconnected system. If you can walk through the three-statement impact of any transaction confidently and correctly, you will pass the accounting portion of any interview.`,
    },
    {
      id: "ib-interview-ev-bridge",
      slug: "enterprise-value-bridge",
      title: "Enterprise Value Bridge",
      content: `## Enterprise Value Bridge

The enterprise value (EV) bridge — also called the "equity value to enterprise value bridge" or "EV walk" — is a foundational concept in investment banking. It tests whether you understand the distinction between the value of the entire company (enterprise value) and the value belonging to shareholders (equity value).

### The Core Formula

\`\`\`
Enterprise Value = Equity Value + Net Debt + Minority Interest + Preferred Stock
\`\`\`

Or equivalently:

\`\`\`
Enterprise Value = Market Cap + Total Debt - Cash + Minority Interest + Preferred Stock
\`\`\`

And working backward:

\`\`\`
Equity Value = Enterprise Value - Net Debt - Minority Interest - Preferred Stock
\`\`\`

### Why the Bridge Matters

Enterprise value represents the total value of a company's core operations — what you would pay to acquire the entire business, including assuming its debts. Equity value represents only the shareholders' portion. Using the wrong metric leads to valuation errors.

The key rule: **Enterprise value pairs with pre-interest metrics (Revenue, EBITDA, EBIT, UFCF). Equity value pairs with post-interest metrics (Net Income, EPS, Book Value).**

### Walking Through Each Component

**Equity Value (Market Capitalization)**
Share price multiplied by diluted shares outstanding. This is what equity investors collectively believe the company is worth. Use diluted shares (including options and warrants via the treasury stock method) rather than basic shares.

**Plus: Total Debt**
All interest-bearing obligations — term loans, bonds, credit facilities, capital leases. We add debt because an acquirer must either assume or repay it. The company's cash flows must service this debt before equity holders get anything.

**Minus: Cash and Cash Equivalents**
We subtract cash because the acquirer effectively receives it when buying the company. If you buy a company for 1 billion dollars in enterprise value but it has 200 million in cash, you are really paying 800 million net — you immediately get the 200 million back.

**Plus: Minority Interest (Non-Controlling Interest)**
The portion of a subsidiary's equity owned by outside investors. We add it because the parent consolidates 100% of the subsidiary's revenue and EBITDA, so the enterprise value should reflect the full value including the minority's share.

**Plus: Preferred Stock**
Preferred stock has debt-like features (fixed dividends, priority over common stock) and is not included in equity value. We add it to enterprise value because it represents a claim that must be satisfied before common equity.

### Interview Questions and Answers

**"Why do you add debt to get from equity value to enterprise value?"**
"Because enterprise value represents the total cost of acquiring a business. When you buy a company, you either assume its debts or repay them. Either way, the debt is an additional cost beyond what you pay to equity holders. Adding debt reflects this total cost."

**"Why do you subtract cash?"**
"Cash is like getting a rebate. If a company has 100 million dollars in cash, the effective acquisition cost is reduced by 100 million because the acquirer can use that cash immediately. It is a non-operating asset that reduces the net cost of acquiring the business."

**"If a company uses 50 million dollars of cash to pay down 50 million dollars of debt, how does enterprise value change?"**
"Enterprise value does not change. Cash decreases by 50 million (which would increase EV) and debt decreases by 50 million (which would decrease EV). The two effects offset perfectly. This makes sense — paying off debt with cash does not change the fundamental value of the business."

**"A company issues 100 million dollars of debt and puts it in the bank. What happens to EV and equity value?"**
"Enterprise value is unchanged — debt increases by 100 million and cash increases by 100 million, netting to zero. Equity value is also unchanged initially, though over time the interest expense on the new debt would reduce earnings and equity value."

**"What about operating leases?"**
"Under current accounting standards (ASC 842/IFRS 16), operating leases are capitalized on the balance sheet as right-of-use assets and lease liabilities. Many analysts include operating lease liabilities in the EV bridge for consistency, since the corresponding expenses are included in EBITDA."

### The EV Walk for a Real Company

| Component | Amount |
|-----------|--------|
| Share Price x Diluted Shares | \$5,000M |
| + Total Debt | \$1,200M |
| - Cash and Equivalents | (\$300M) |
| + Minority Interest | \$50M |
| + Preferred Stock | \$0M |
| **= Enterprise Value** | **\$5,950M** |

### Key Takeaway

The EV bridge is simple in concept but critical in execution. Every M&A analysis, every valuation multiple, and every transaction price is built on this bridge. In interviews, the questions test whether you truly understand why each component is added or subtracted — not whether you have memorized the formula. If you understand the logic, you can handle any variation.`,
    },
    {
      id: "ib-interview-brain-teasers",
      slug: "brain-teasers",
      title: "Brain Teasers and Market Questions",
      content: `## Brain Teasers and Market Questions

Beyond technical finance questions, many investment banking interviews include brain teasers (to test logical thinking under pressure) and market questions (to test your awareness of financial markets and current events). These questions do not have a single "right" answer — interviewers are evaluating your thought process, composure, and intellectual curiosity.

### Brain Teasers

Brain teasers test your ability to structure ambiguous problems and think logically. The key is to **think out loud** — interviewers want to see your reasoning, not just your answer.

**"How many golf balls fit in a school bus?"**

Framework approach:
1. Estimate the interior volume of a school bus: roughly 2.5m x 2m x 7m = 35 cubic meters
2. Subtract space for seats (about 20%): 28 cubic meters usable
3. Convert to cubic centimeters: 28,000,000 cm cubed
4. A golf ball has a diameter of about 4.3 cm, so volume is roughly 42 cm cubed
5. Account for packing efficiency (about 64% for random packing): effective volume per ball is about 66 cm cubed
6. Estimate: 28,000,000 / 66 is approximately 425,000 golf balls

The exact number does not matter. What matters is that you structured the problem, made reasonable assumptions, and arrived at a defensible estimate.

**"How would you value a hot dog stand?"**

Framework approach:
1. Estimate revenue: 200 hot dogs per day at 5 dollars each = 1,000 dollars per day, or roughly 350,000 dollars per year (assuming 350 operating days)
2. Estimate costs: food costs (30%), labor (one employee at 40,000 dollars), rent/permit (15,000 dollars), other (10,000 dollars). Total costs roughly 170,000 dollars.
3. Estimated profit: approximately 180,000 dollars per year
4. Apply a small business multiple (3-5x earnings): valued at 540,000 to 900,000 dollars
5. Alternatively: asset-based approach — what is the stand and equipment worth? Probably 20,000 to 50,000 dollars. The DCF approach yields a much higher value, suggesting the earnings power of the location is the primary value driver.

**"How many gas stations are in the United States?"**

1. US population: approximately 330 million
2. Number of cars: roughly 280 million registered vehicles
3. Average fill-up frequency: once per week
4. Average gas station serves: maybe 1,000 fill-ups per week (busy stations more, rural less)
5. Estimate: 280 million weekly fill-ups / 1,000 per station = 280,000 gas stations
6. Actual answer: approximately 150,000 (our estimate is in the right ballpark, which is all that matters)

### Market Questions

Market questions test whether you follow financial news and can discuss it intelligently.

**"What is the 10-year Treasury yield today, and what does it mean?"**
You should know the approximate current yield and be able to discuss:
- Why it matters (risk-free rate for DCF, benchmark for credit markets)
- What is driving it (Fed policy, inflation expectations, fiscal deficits)
- What a rising or falling yield implies for valuations and deal activity

**"Tell me about a recent M&A deal you found interesting."**
Pick a deal from the last 3 months. Discuss:
- Who bought whom and for how much
- The strategic rationale
- The valuation multiple and whether it was fair
- Any interesting dynamics (competitive bidding, regulatory concerns, market reaction)

**"Where do you think the stock market is heading?"**
There is no right answer, but demonstrate structured thinking:
- Acknowledge the uncertainty
- Cite 2-3 specific factors you are watching (earnings growth, interest rates, geopolitics)
- Take a measured view ("I think we are in a range-bound market because..." is better than "it is definitely going up")
- Show you have a framework for thinking about it, not just an opinion

**"If you had a million dollars to invest, what would you do?"**
This tests your knowledge of asset classes and investment strategy:
- Discuss diversification (do not put it all in one stock)
- Mention your time horizon and risk tolerance
- Reference specific asset classes (equities, fixed income, alternatives)
- Show awareness of current market conditions

### How to Prepare

**For brain teasers:**
- Practice estimation problems daily (market sizing, Fermi problems)
- Always structure your approach before calculating
- Be comfortable saying "Let me think about this for a moment"
- Use round numbers to make mental math easier

**For market questions:**
- Read the Wall Street Journal or Financial Times daily (even just headlines)
- Follow 2-3 recent M&A deals in detail
- Know the approximate levels of: S&P 500, 10-year Treasury yield, Fed Funds rate, recent GDP growth
- Have an opinion on 1-2 market themes (AI impact, interest rate trajectory, sector rotations)

### Key Takeaway

Brain teasers and market questions are not designed to trick you — they are designed to see how you think. The best candidates demonstrate structured reasoning, intellectual curiosity, and composure under uncertainty. Prepare by practicing estimation problems, reading financial news daily, and developing informed views on current market dynamics. The goal is not to be right about everything — it is to be thoughtful about everything.`,
    },
  ],
};
