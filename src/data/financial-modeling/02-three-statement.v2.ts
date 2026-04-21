import { Module } from "../types";

export const threeStatementModule: Module = {
  id: "fm-three-statement",
  title: "Three-Statement Model",
  description: "Build a complete three-statement financial model — connecting income statement, balance sheet, and cash flow statement.",
  lessons: [
    {
      id: "fm-three-statement-income",
      slug: "income-statement-model",
      title: "Income Statement Model",
      content: `## Income Statement Model

The income statement is typically the first statement you build in a financial model because it drives many of the balance sheet and cash flow items. A well-built income statement model projects revenue, expenses, and profitability based on clearly defined assumptions that can be traced back to business fundamentals.

### Structure

The income statement flows from the top line (revenue) to the bottom line (net income):

| Line Item | Projection Method |
|-----------|-------------------|
| **Revenue** | Driver-based (volume x price, segment build, growth rate) |
| **Cost of Goods Sold** | Percentage of revenue or driver-based |
| **Gross Profit** | Revenue - COGS (formula) |
| **Selling, General & Administrative** | Percentage of revenue or fixed + variable |
| **Research & Development** | Percentage of revenue or fixed amount |
| **Depreciation & Amortization** | From depreciation schedule |
| **Other Operating Expenses** | Percentage of revenue or specific assumptions |
| **Operating Income (EBIT)** | Gross Profit - OpEx (formula) |
| **Interest Expense** | From debt schedule |
| **Interest Income** | Cash balance x interest rate |
| **Other Income/Expense** | Specific assumptions or zero |
| **Pre-Tax Income (EBT)** | EBIT - Interest + Other (formula) |
| **Income Tax Expense** | EBT x effective tax rate |
| **Net Income** | EBT - Taxes (formula) |

### Revenue Projection Methods

**Method 1: Growth rate approach**
The simplest method — apply a year-over-year growth rate to prior year revenue. Useful when you have limited operational data.

**Method 2: Segment build**
Project each business segment separately based on segment-specific drivers:
- Product A revenue = Units x Average Selling Price
- Product B revenue = Subscribers x Monthly ARPU x 12
- Service revenue = Billable hours x Hourly rate

Sum segment revenues for total revenue. This is more granular and defensible than a single growth rate.

**Method 3: Bottom-up driver approach**
Build revenue from fundamental business drivers:
- Retail: Number of stores x Revenue per store x Same-store growth
- SaaS: Beginning ARR + New ARR + Expansion - Churn
- Bank: Loan volume x Net interest margin + Fee income

### Expense Projection Methods

**Percentage of revenue**: The most common approach for COGS and variable operating expenses. Analyze historical margins and project forward.

**Fixed plus variable**: Some expenses have both fixed and variable components. For example, SG&A might include a fixed corporate overhead plus a variable sales commission (as a percentage of revenue).

**Zero-based**: Budget each expense item from scratch based on headcount, planned investments, etc. Most detailed but most time-consuming.

### Margin Analysis

Before projecting, analyze historical margins to understand trends:

| Metric | Year 1 | Year 2 | Year 3 | Assumption |
|--------|--------|--------|--------|-----------|
| Gross Margin | 62.0% | 63.5% | 64.2% | 64.5% (gradual improvement) |
| SG&A % of Revenue | 22.0% | 21.0% | 20.5% | 20.0% (operating leverage) |
| R&D % of Revenue | 12.0% | 12.5% | 13.0% | 13.0% (maintain investment) |
| EBIT Margin | 28.0% | 30.0% | 30.7% | 31.5% (margin expansion) |

### Common Modeling Decisions

**Stock-based compensation (SBC)**: Include in operating expenses (GAAP requires it) but consider adding a separate line to easily calculate both GAAP and non-GAAP metrics.

**D&A placement**: Some companies report D&A within COGS and/or operating expenses. Others show it as a separate line. Match the company's reporting format for consistency with historical data.

**Non-recurring items**: Exclude from projections. If a company had a one-time restructuring charge, do not project it forward. However, if "one-time" charges recur regularly, they may not be truly non-recurring.

### Key Takeaway

The income statement model translates business assumptions into financial outcomes. The quality of your income statement projections depends entirely on the quality of your underlying assumptions — revenue growth, margin trajectories, and expense leverage. Always ground your assumptions in historical analysis, management guidance, and industry benchmarks, and document the rationale for every key assumption.`,
    },
    {
      id: "fm-three-statement-balance-sheet",
      slug: "balance-sheet-model",
      title: "Balance Sheet Model",
      content: `## Balance Sheet Model

The balance sheet captures a company's financial position at a point in time — what it owns (assets), what it owes (liabilities), and the residual value to shareholders (equity). In a financial model, most balance sheet items are driven by income statement projections or dedicated supporting schedules.

### Structure

| Section | Key Items | Projection Driver |
|---------|-----------|-------------------|
| **Current Assets** | Cash, Accounts Receivable, Inventory, Prepaid Expenses | CFS plug, DSO, DIO, % of revenue |
| **Non-Current Assets** | PP&E, Intangibles, Goodwill, Investments | Depreciation schedule, specific assumptions |
| **Current Liabilities** | Accounts Payable, Accrued Expenses, Current Debt, Deferred Revenue | DPO, % of revenue, debt schedule |
| **Non-Current Liabilities** | Long-Term Debt, Deferred Tax, Pension Obligations | Debt schedule, specific assumptions |
| **Shareholders' Equity** | Common Stock, APIC, Retained Earnings, Treasury Stock | Share issuance, net income, dividends, buybacks |

### Projecting Key Balance Sheet Items

**Accounts Receivable**
Projected using Days Sales Outstanding (DSO):
Projected AR = (Projected Revenue x Assumed DSO) / 365

Analyze historical DSO trends. If DSO has been stable at 45 days, project 45 days forward. If DSO is trending upward (customers paying slower), this is a yellow flag worth investigating.

**Inventory**
Projected using Days Inventory Outstanding (DIO):
Projected Inventory = (Projected COGS x Assumed DIO) / 365

Rising DIO may indicate weakening demand or overproduction.

**Accounts Payable**
Projected using Days Payable Outstanding (DPO):
Projected AP = (Projected COGS x Assumed DPO) / 365

Higher DPO means the company is taking longer to pay suppliers — favorable for cash flow but potentially a sign of financial stress if pushed too far.

**PP&E (Property, Plant & Equipment)**
Projected using the PP&E rollforward:
Ending PP&E = Beginning PP&E + Capital Expenditures - Depreciation

CapEx is typically assumed as a percentage of revenue. Depreciation is calculated from the depreciation schedule.

**Goodwill and Intangibles**
Goodwill remains constant unless an impairment occurs or a new acquisition is made. Intangible assets decline each period by the amortization amount.

**Retained Earnings**
Retained Earnings = Beginning Balance + Net Income - Dividends

This is the primary link from the income statement to the balance sheet.

**Debt**
Projected from the debt schedule. Current portion of long-term debt (the amount due within 12 months) is classified as a current liability. The remainder is long-term.

### The Cash Line

In a properly structured model, cash is the **balancing variable**. It is calculated as:
Cash = Total Liabilities + Shareholders' Equity - All Non-Cash Assets

Or equivalently, cash is the ending cash from the cash flow statement.

If your model is correctly linked, the balance sheet will balance automatically because cash adjusts to absorb the difference. If the balance sheet does not balance, there is a linkage error somewhere.

### Common Balance Sheet Modeling Mistakes

1. **Forgetting to roll forward retained earnings**: Retained earnings must include net income each period
2. **Not linking depreciation to both the PP&E schedule and the income statement**: Depreciation appears in two places — make sure they match
3. **Classifying all debt as long-term**: The portion due within 12 months should be current
4. **Leaving goodwill at zero after modeling an acquisition**: Acquisition models generate goodwill
5. **Not tying deferred revenue to the revenue model**: For subscription businesses, deferred revenue is a critical balance sheet item

### Key Takeaway

The balance sheet is the anchor that keeps your model grounded. Every asset must be funded, every liability must be serviced, and the equation must always balance. By tying balance sheet items to income statement drivers (through DSO, DIO, DPO, and percentage-of-revenue assumptions), you create a model that responds dynamically to changes in business performance.`,
    },
    {
      id: "fm-three-statement-cash-flow",
      slug: "cash-flow-model",
      title: "Cash Flow Statement Model",
      content: `## Cash Flow Statement Model

The cash flow statement is the reality check of financial modeling. While the income statement reports accounting profits (which can be manipulated through accrual timing and non-cash charges), the cash flow statement tracks actual cash movements. It answers the most fundamental question: "Is the company generating or consuming cash?"

### The Three Sections

**Operating Activities (Cash from Operations)**

Starts with net income and adjusts for non-cash items and working capital changes:

| Item | Treatment |
|------|-----------|
| Net Income | Starting point |
| + Depreciation & Amortization | Add back (non-cash expense) |
| + Stock-Based Compensation | Add back (non-cash expense) |
| + Deferred Taxes | Add back change (non-cash timing difference) |
| +/- Changes in Working Capital | Adjust for accrual vs. cash timing |
| = Cash from Operations | |

Working capital adjustments:
- Increase in AR = Cash outflow (revenue recorded but not collected)
- Increase in Inventory = Cash outflow (cash spent on unsold goods)
- Increase in AP = Cash inflow (goods received but not yet paid for)
- Increase in Deferred Revenue = Cash inflow (cash collected for undelivered services)

**Investing Activities**

| Item | Typical Sign |
|------|-------------|
| Capital Expenditures (CapEx) | Negative (cash outflow) |
| Acquisitions | Negative |
| Proceeds from Asset Sales | Positive |
| Purchases of Investments | Negative |
| = Cash from Investing | |

**Financing Activities**

| Item | Typical Sign |
|------|-------------|
| Debt Issuance | Positive (cash inflow) |
| Debt Repayment | Negative (cash outflow) |
| Stock Issuance | Positive |
| Share Repurchases | Negative |
| Dividend Payments | Negative |
| = Cash from Financing | |

### Building the Cash Flow Model

**Step 1**: Start with net income from the income statement.

**Step 2**: Add back non-cash items. These come directly from other parts of your model:
- Depreciation: from the depreciation schedule
- Stock-based compensation: typically projected as a percentage of revenue
- Amortization of intangibles: from the intangibles schedule

**Step 3**: Calculate working capital changes. For each working capital item:
Change = Current Period Balance - Prior Period Balance

Remember the sign convention:
- Assets increasing = cash outflow (subtract)
- Assets decreasing = cash inflow (add)
- Liabilities increasing = cash inflow (add)
- Liabilities decreasing = cash outflow (subtract)

**Step 4**: Calculate investing activities. CapEx is typically projected as a percentage of revenue or as a specific dollar amount per year.

**Step 5**: Calculate financing activities from the debt schedule and equity assumptions:
- Debt repayment: mandatory amortization from the debt schedule
- New debt: if the company needs to borrow
- Dividends: projected based on payout ratio or fixed amount
- Share repurchases: based on management's capital return policy

**Step 6**: Sum all sections to get net change in cash:
Net Change = Operating CF + Investing CF + Financing CF

**Step 7**: Calculate ending cash:
Ending Cash = Beginning Cash + Net Change in Cash

This ending cash balance must equal the cash line on the balance sheet.

### Free Cash Flow Calculations

Two important subtotals often shown on or alongside the cash flow statement:

**Free Cash Flow to Firm (FCFF)** = Operating Cash Flow - CapEx
This is the cash available to all capital providers (debt and equity).

**Free Cash Flow to Equity (FCFE)** = FCFF - Debt Repayment + Debt Issuance - Interest (net of tax)
This is the cash available to equity shareholders.

### Key Takeaway

The cash flow statement is where the model comes together — it incorporates the income statement (net income), the balance sheet (working capital changes), and the supporting schedules (depreciation, debt, CapEx). Building it requires careful attention to sign conventions and inter-statement linkages. When the ending cash balance reconciles to the balance sheet, you know your model is internally consistent.`,
    },
    {
      id: "fm-three-statement-connecting",
      slug: "connecting-statements",
      title: "Connecting the Three Statements",
      content: `## Connecting the Three Statements

Building the three statements individually is the technical challenge. Connecting them into a single, dynamic, self-balancing model is the art. When connections are made correctly, changing a single assumption — like revenue growth — cascades through the entire model automatically, and the balance sheet always balances.

### The Complete Linkage Map

Here is every major connection between the three statements:

**From Income Statement to Balance Sheet:**
- Net Income adds to Retained Earnings
- Revenue drives Accounts Receivable (via DSO)
- COGS drives Inventory (via DIO) and Accounts Payable (via DPO)
- SG&A drives Accrued Expenses (percentage of SG&A)
- Tax Expense drives Taxes Payable and Deferred Tax balances
- D&A reduces net PP&E through accumulated depreciation
- SBC increases Additional Paid-In Capital (APIC)

**From Income Statement to Cash Flow Statement:**
- Net Income is the starting point of Operating Cash Flow
- D&A is added back as a non-cash adjustment
- SBC is added back as a non-cash adjustment
- Interest Expense affects interest paid (usually similar unless PIK)

**From Balance Sheet to Cash Flow Statement:**
- Change in AR appears in operating activities
- Change in Inventory appears in operating activities
- Change in AP appears in operating activities
- Change in Accrued Expenses appears in operating activities
- Change in Deferred Revenue appears in operating activities
- CapEx (change in gross PP&E) appears in investing activities
- Change in debt appears in financing activities
- Change in shares (buybacks/issuance) appears in financing activities

**From Cash Flow Statement to Balance Sheet:**
- Ending Cash = Beginning Cash + Net Cash Change (this closes the loop)

### Building the Connections Step by Step

**Connection 1: Retained Earnings**
\`\`\`
Retained Earnings = Prior Period RE + Net Income - Dividends
\`\`\`
This is the most important single link — it connects the income statement to the balance sheet.

**Connection 2: Working Capital**
For each working capital item, create a formula that ties the balance sheet amount to an income statement driver:
\`\`\`
AR = Revenue x DSO / 365
Inventory = COGS x DIO / 365
AP = COGS x DPO / 365
\`\`\`
Then calculate changes for the cash flow statement:
\`\`\`
Change in AR = Current AR - Prior AR
\`\`\`

**Connection 3: PP&E and Depreciation**
\`\`\`
Ending PP&E = Beginning PP&E + CapEx - Depreciation
\`\`\`
CapEx appears on the investing section of the cash flow statement. Depreciation appears on both the income statement (reducing EBIT) and the cash flow statement (added back as a non-cash item).

**Connection 4: Debt Schedule**
\`\`\`
Ending Debt = Beginning Debt + New Borrowings - Repayments
Interest Expense = Average Debt x Interest Rate
\`\`\`
Repayments appear in financing activities. Interest expense appears on the income statement.

**Connection 5: Cash (the plug)**
\`\`\`
Ending Cash = Beginning Cash + Operating CF + Investing CF + Financing CF
\`\`\`
This cash balance goes on the balance sheet. If everything is linked correctly, the balance sheet will balance.

### Testing the Connections

After connecting everything, run these tests:

1. **Balance sheet check**: Total Assets = Total Liabilities + Equity in every period
2. **Cash reconciliation**: BS cash change equals CFS total net change
3. **Revenue sensitivity**: Increase revenue by 10% and verify all statements update logically
4. **Zero revenue test**: Set revenue to zero and verify the model does not crash
5. **Trace a single change**: Change one assumption and follow its impact through all three statements manually

### The Debugging Process

When the balance sheet does not balance:

1. Start with the most recent period where it is out of balance
2. Check each section: Are total current assets correct? Total non-current assets? Total current liabilities? Total non-current liabilities? Total equity?
3. Narrow down which section contains the error
4. Within that section, check each line item against its source
5. Common culprits: retained earnings not updated, cash not connected to CFS, working capital items not flowing correctly, debt schedule not linked

### Key Takeaway

Connecting the three statements transforms three separate tables of numbers into a living, breathing financial model. The connections are the model's circulatory system — they ensure that every assumption flows through to its logical conclusion across all three statements. When the model is properly connected, it becomes a powerful tool for testing scenarios and making informed financial decisions.`,
    },
    {
      id: "fm-three-statement-balancing",
      slug: "balancing-cash-plug",
      title: "Balancing the Model: The Cash Plug",
      content: `## Balancing the Model: The Cash Plug

The moment of truth in building a three-statement model is when you check whether the balance sheet balances. If it does, your linkages are correct and the model is structurally sound. If it does not, you have a bug to find. The "cash plug" approach is the standard technique for ensuring balance, and understanding it is essential for model debugging.

### What is a "Plug"?

A plug is a line item that is calculated as the difference between two sides of an equation, forcing the equation to balance. In a three-statement model, **cash** is typically the plug:

\`\`\`
Cash = Total Liabilities + Total Equity - All Non-Cash Assets
\`\`\`

Alternatively (and more commonly in practice):

\`\`\`
Ending Cash = Beginning Cash + Net Change in Cash from CFS
\`\`\`

The second approach is preferred because it derives cash from the cash flow statement, which aggregates all cash movements from the other two statements. This creates a natural balance.

### Why Cash is the Plug

Cash is the logical plug because it absorbs the residual of all other activities:
- If the company generates more cash from operations than it spends on investments and debt, cash increases
- If the company spends more than it generates, cash decreases
- Cash is the one balance sheet item that does not have an independent projection formula — it is the result of everything else

### The Revolver as Secondary Plug

In many models (especially LBO models), the company has a revolving credit facility that acts as a secondary cash management tool:

- If cash would fall below a minimum threshold, the revolver is drawn to maintain the minimum
- If cash exceeds what is needed, the revolver is repaid
- The revolver acts as a buffer, preventing cash from going negative

The logic:

\`\`\`
If Cash Before Revolver > Minimum Cash:
    Revolver Draw = 0
    Revolver Repayment = min(Beginning Revolver Balance,
                             Cash Before Revolver - Minimum Cash)
Else:
    Revolver Draw = Minimum Cash - Cash Before Revolver
    Revolver Repayment = 0
\`\`\`

This creates an additional circularity (revolver interest depends on revolver balance, which depends on cash, which depends on interest), which is resolved through iterative calculations.

### When the Balance Sheet Does Not Balance

If your balance sheet shows an imbalance (Total Assets - Total Liabilities - Equity is not zero), follow this systematic debugging process:

**Step 1: Isolate the period**
Find the first period where the imbalance appears. The error likely originated in that period.

**Step 2: Check retained earnings**
The most common error. Verify:
\`\`\`
Retained Earnings = Prior RE + Net Income - Dividends Paid
\`\`\`
If net income is not flowing through, the entire balance sheet will be off by the net income amount.

**Step 3: Check cash**
Verify that cash on the balance sheet matches ending cash on the cash flow statement. If they differ, the CFS is not properly linked.

**Step 4: Check each section systematically**
For each balance sheet section (current assets, non-current assets, current liabilities, non-current liabilities, equity), compare the total to your expectations. Narrow down which section contains the discrepancy.

**Step 5: Trace individual line items**
Once you have identified the section, check each line item:
- Does the PP&E balance match the depreciation schedule?
- Does the debt balance match the debt schedule?
- Does the working capital schedule tie to the balance sheet?
- Are all non-cash CFS adjustments correct?

**Step 6: Check for common errors**
- Sign errors (adding when you should subtract)
- Missing items (forgot to include a balance sheet line)
- Double-counting (same item appears twice)
- Stale links (cell references pointing to wrong locations)

### The Balance Sheet Check Formula

Place this formula prominently in your model:

\`\`\`
Balance Check = Total Assets - Total Liabilities - Total Shareholders' Equity
\`\`\`

Format with conditional formatting:
- Green / "PASS" if the value is within 0.01 of zero
- Red / "FAIL" if the value exceeds 0.01

Include this check for every projection period, not just the first.

### Building a Balanced Model from the Start

The best approach is to check the balance after each major connection:

1. Build the income statement and connect retained earnings to the balance sheet — check balance
2. Connect working capital — check balance
3. Connect the depreciation schedule — check balance
4. Connect the debt schedule — check balance
5. Connect the cash flow statement — check balance

If you check after each step, you know exactly which connection introduced an error when one appears. If you wait until the end to check, you have to search the entire model.

### Key Takeaway

The cash plug is not a hack — it is the natural result of a properly linked model. Cash absorbs the residual of all other financial activities, making it the logical balancing item. When the balance sheet does not balance, the debugging process is systematic: isolate the period, check the major connections (retained earnings, cash, working capital, PP&E, debt), and trace individual line items until you find the broken link. Patience and methodical checking will always find the error.`,
    },
  ],
};
