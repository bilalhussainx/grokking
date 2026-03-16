import { Module } from "../types";

export const foundationsModule: Module = {
  id: "fm-foundations",
  title: "Financial Modeling Foundations",
  description:
    "Learn the principles, design standards, and best practices that underpin every professional financial model.",
  lessons: [
    {
      id: "fm-foundations-what-is",
      slug: "what-is-financial-modeling",
      title: "What is Financial Modeling?",
      content: `## What is Financial Modeling?

A financial model is a mathematical representation of a company's financial performance, built in a spreadsheet or code, that projects future financial results based on assumptions about the business. Financial models are the analytical backbone of corporate finance — they drive decisions about acquisitions, investments, capital allocation, and strategic planning.

### Why Financial Models Matter

Financial models translate business strategy into numbers. They answer questions like:

- "What is this company worth?" (valuation models)
- "Should we acquire this target?" (merger models)
- "Can we afford this investment?" (capital budgeting models)
- "How will a recession affect our cash flow?" (scenario analysis)
- "What returns will this LBO generate?" (LBO models)

Without models, these decisions would be based on gut feeling. With models, they are based on structured analysis of assumptions and their financial implications.

### Types of Financial Models

| Model Type | Purpose | Primary Users |
|-----------|---------|---------------|
| **Three-statement model** | Project income, balance sheet, and cash flow | Everyone — foundation for all other models |
| **DCF model** | Estimate intrinsic value | Investment bankers, equity research |
| **LBO model** | Calculate leveraged buyout returns | Private equity, leveraged finance |
| **Merger model** | Analyze accretion/dilution from M&A | M&A teams, corporate development |
| **Operating model** | Detailed business driver projections | FP&A, corporate strategy |
| **Budget model** | Annual budget and variance tracking | FP&A, departmental managers |
| **IPO model** | Pricing and allocation analysis | ECM teams |
| **Real estate model** | Property cash flows and returns | Real estate investors, developers |
| **Project finance model** | Infrastructure/energy project cash flows | Project finance teams |
| **Credit model** | Assess borrower creditworthiness | Credit analysts, lending teams |

### The Modeling Workflow

Building a financial model follows a consistent workflow:

1. **Define the purpose**: What question does this model need to answer?
2. **Gather data**: Historical financials, industry benchmarks, management guidance
3. **Structure the model**: Design the layout, tabs, and flow of information
4. **Build historical financials**: Input and normalize 3-5 years of historical data
5. **Develop assumptions**: Revenue growth, margins, CapEx, working capital
6. **Project financial statements**: Income statement, balance sheet, cash flow
7. **Build supporting schedules**: Depreciation, debt, working capital
8. **Add valuation or returns analysis**: DCF, LBO, comps depending on purpose
9. **Stress test and check**: Run scenarios, verify the balance sheet balances
10. **Present and document**: Create clear outputs and assumption documentation

### Skills Required

Financial modeling requires a combination of:

- **Accounting knowledge**: How the three financial statements work and connect
- **Finance theory**: Valuation concepts, cost of capital, time value of money
- **Spreadsheet proficiency**: Advanced formulas, data tables, keyboard shortcuts
- **Business judgment**: Making reasonable assumptions about the future
- **Attention to detail**: Small errors compound into large problems
- **Communication**: Presenting model outputs clearly to decision-makers

### Spreadsheets vs. Code

Traditionally, financial models are built in Microsoft Excel. However, Python and other programming languages are increasingly used for:
- Automated data processing and model updates
- Complex simulations (Monte Carlo)
- Large datasets that exceed spreadsheet capacity
- Reproducible, version-controlled analysis

Most professionals use Excel for client-facing models and Python for internal analysis, data processing, and automation.

### Key Takeaway

Financial modeling is a skill, not a subject — it improves with practice. The best modelers combine technical precision with business intuition, building models that are not just mechanically correct but also grounded in realistic assumptions about how businesses actually work. Every model in this course builds on the foundations covered here.`,
    },
    {
      id: "fm-foundations-design",
      slug: "design-principles",
      title: "Model Design Principles",
      content: `## Model Design Principles

A well-designed financial model is not just accurate — it is understandable, auditable, and maintainable. The difference between a good model and a bad model is not the answer it produces but whether someone else can open it, understand it, and trust it. Design principles are the rules that make this possible.

### The Three Pillars of Good Model Design

**1. Transparency**
Every assumption and calculation should be visible and traceable. A reader should be able to follow the logic from inputs to outputs without guessing what any cell does.

- Separate inputs from calculations
- Label every row and section
- Document key assumptions with comments
- Avoid hiding rows, columns, or sheets

**2. Flexibility**
The model should be easy to update when assumptions change. A good model answers not just "what is the answer?" but "what if we change this assumption?"

- Centralize all inputs in a dedicated assumptions section
- Never hard-code numbers inside formulas
- Build sensitivity tables and scenario switches
- Design for reuse — the same model structure should work for different companies

**3. Integrity**
The model should produce correct results and alert you when something goes wrong.

- Include balance sheet checks on every period
- Add reasonableness checks (margins within historical range, growth rates realistic)
- Use error trapping to prevent divide-by-zero and circular reference crashes
- Test edge cases (zero revenue, negative income, extreme leverage)

### Model Layout

Professional models follow a consistent layout:

**Tab structure:**

| Tab | Content |
|-----|---------|
| **Cover** | Model name, date, version, author |
| **Assumptions** | All input assumptions in one place |
| **Income Statement** | Revenue through net income |
| **Balance Sheet** | Assets, liabilities, equity |
| **Cash Flow Statement** | Operating, investing, financing |
| **Supporting Schedules** | Depreciation, debt, working capital, tax |
| **Valuation** | DCF, comps, or returns analysis |
| **Sensitivity** | Data tables and scenario analysis |
| **Checks** | All model checks in one place |

**Within each tab:**
- Historical data on the left, projections on the right
- Time flows left to right (each column is a period)
- Calculations flow top to bottom
- Clear section headers with spacing between sections

### The "One Formula Per Row" Rule

Every cell in a row should contain the same formula (adjusted for the column reference). If you need a different formula for a specific period, create a separate row rather than embedding an exception in the middle of a row.

This rule is critical for auditability: if you verify one cell in a row, you have verified the entire row. If each cell has a different formula, you must check every cell individually.

### Input vs. Calculation Separation

**Inputs** (assumptions, hard-coded values) should be clearly distinguished from **calculations** (formulas). The standard approach:

- All inputs in a dedicated "Assumptions" tab
- Financial statement tabs contain only formulas that reference the Assumptions tab
- If an input must appear on a financial statement tab, format it distinctly (blue font)

This separation means you can change any assumption in one place and see the impact flow through the entire model automatically.

### Documentation

Every model should include:

1. **Version history**: Track changes, dates, and authors
2. **Assumption notes**: Why each key assumption was chosen
3. **Source citations**: Where historical data came from
4. **Known limitations**: What the model does NOT capture
5. **User guide**: How to update assumptions and interpret outputs

### Key Takeaway

Model design is not cosmetic — it is functional. A poorly designed model, no matter how sophisticated its formulas, is a liability: it cannot be audited, updated, or trusted. A well-designed model, even with simple analysis, is an asset: anyone can pick it up, understand it, and use it confidently. Invest time in design upfront, and the model will serve you and your team for months or years.`,
    },
    {
      id: "fm-foundations-color-coding",
      slug: "color-coding-standards",
      title: "Color Coding Standards",
      content: `## Color Coding Standards

Color coding is the visual language of financial modeling. It tells anyone who opens the model which cells are inputs (can be changed), which are formulas (should not be overwritten), and which link to other parts of the model. Consistent color coding transforms a spreadsheet of numbers into a navigable, auditable document.

### The Standard Color System

The investment banking industry has converged on a standard color coding scheme that is used at virtually every bank, PE firm, and advisory practice:

| Font Color | Meaning | What It Indicates |
|-----------|---------|-------------------|
| **Blue** | Hard-coded input | This cell contains a typed number (an assumption). It is safe to change. |
| **Black** | Formula/calculation | This cell contains a formula. Do NOT overwrite it with a hard-coded number. |
| **Green** | Link to another tab | This cell pulls data from a different worksheet in the same model. |
| **Red** | Error flag / check | This cell is a model check or error indicator. |
| **Gray** (or light font) | Historical data | Past actual data, not a projection. |

### Why Color Coding Matters

Without color coding, a model is a minefield. Imagine opening a 50-tab model with thousands of cells. How do you know which cells you can safely change? How do you know which cells contain formulas that will break if you type over them?

Color coding answers these questions instantly:
- See a blue cell? That is an assumption — change it to test a scenario.
- See a black cell? That is a formula — leave it alone.
- See a green cell? It links elsewhere — check the source if the number looks wrong.
- See a red cell? Something might be wrong — investigate.

### Applying Color Coding in Practice

**Method 1: Manual formatting**
Select cells and change the font color using the formatting toolbar. This is simple but tedious for large models.

**Method 2: Cell styles**
Create custom cell styles (Input, Calculation, Link, Check) and apply them with a single click. This is faster and ensures consistency.

**Method 3: Macros / add-ins**
Many banks use proprietary Excel add-ins that automatically format cells based on their content (input vs. formula vs. link). Tools like Macabacus and Capital IQ provide similar functionality.

### Beyond Font Color: Formatting Conventions

Professional models also use consistent number formatting:

| Data Type | Format | Example |
|-----------|--------|---------|
| Dollars (large) | Thousands or millions with one decimal | 1,234.5 |
| Percentages | One decimal place | 12.5% |
| Multiples | One decimal place with "x" | 8.5x |
| Shares | Millions with one decimal | 125.3 |
| Dates | Consistent format | Dec-25 or 12/31/25 |
| Negative numbers | Parentheses, not minus signs | (125.0) not -125.0 |

### Additional Formatting Best Practices

**Borders and shading:**
- Use light gray borders to separate sections
- Use subtotal and total lines with top borders
- Use light blue shading for input rows (in addition to blue font) for extra visibility
- Avoid heavy borders and bright colors that make the model look cluttered

**Font and size:**
- Use a single font throughout the model (Arial or Calibri are standard)
- Use a consistent font size (10 or 11 point for data, 11 or 12 for headers)
- Use bold for section headers and totals only

**Row and column widths:**
- Account names should be fully visible (no truncation)
- Number columns should be uniform width
- Leave a narrow column between the row labels and the first data column

### The Audit Trail

Color coding creates an audit trail. When reviewing a model:

1. Start with the **blue cells** — these are the assumptions driving everything
2. Check that **black cells** contain sensible formulas
3. Verify that **green cells** link to the correct source
4. Review **red checks** — everything should pass

This systematic review process is only possible when the model is consistently color-coded.

### Key Takeaway

Color coding is not optional in professional financial modeling — it is a requirement. It communicates the structure and logic of your model at a glance, prevents accidental errors, and enables efficient auditing. Apply the standard color scheme from the first cell you type, and maintain it throughout the entire model. It takes minimal extra time but dramatically increases the model's usability and trustworthiness.`,
    },
    {
      id: "fm-foundations-linking",
      slug: "linking-statements",
      title: "Linking Financial Statements",
      content: `## Linking Financial Statements

The three financial statements — Income Statement, Balance Sheet, and Cash Flow Statement — do not exist in isolation. They are deeply interconnected, and a financial model must capture these linkages accurately. When you change a revenue assumption, the effect should cascade automatically through all three statements and supporting schedules. This interconnectedness is what makes a financial model powerful.

### The Statement Linkages

**Income Statement to Cash Flow Statement:**
Net income is the starting point of the operating section of the cash flow statement. Non-cash items from the income statement (depreciation, amortization, stock-based compensation) are added back because they reduced net income but did not use cash.

**Income Statement to Balance Sheet:**
Net income flows into retained earnings (shareholders' equity). Revenue drives accounts receivable. Cost of goods sold drives inventory and accounts payable. Depreciation reduces the net book value of PP&E.

**Balance Sheet to Cash Flow Statement:**
Changes in balance sheet accounts drive cash flow:
- Increase in accounts receivable = cash outflow (collected less than recorded as revenue)
- Increase in inventory = cash outflow (bought more than sold)
- Increase in accounts payable = cash inflow (received goods but have not paid yet)
- Capital expenditures increase PP&E on the balance sheet and appear as investing cash outflow
- Debt issuances and repayments change balance sheet debt and appear as financing cash flows

**Cash Flow Statement back to Balance Sheet:**
The ending cash balance from the cash flow statement equals the cash line on the balance sheet. This closes the loop.

### The Linking Order

Build and link statements in this order to avoid circularity issues:

1. **Income Statement (partial)**: Revenue through EBIT
2. **Working Capital Schedule**: Ties to income statement drivers
3. **PP&E / Depreciation Schedule**: Ties to CapEx assumptions
4. **Cash Flow Statement (partial)**: Operating and investing sections
5. **Debt Schedule**: Calculate interest expense
6. **Income Statement (complete)**: Add interest expense, taxes, net income
7. **Cash Flow Statement (complete)**: Add financing section
8. **Balance Sheet**: Connect all schedules; cash is the final plug

### The Cash Plug

In a properly linked model, cash is the **balancing item** (the "plug") that makes the balance sheet balance. The logic:

Total Assets = Total Liabilities + Equity

If you have correctly modeled all other balance sheet items, the cash balance should equal:
Cash = Total Liabilities + Equity - All Other Assets

Alternatively, cash is simply the beginning cash balance plus the net change in cash from the cash flow statement.

If your balance sheet does not balance, one or more linkages is broken. The balance sheet check is your primary diagnostic tool.

### Handling Circularity

The three-statement model inherently creates a circular reference:

Interest expense depends on the debt balance, which depends on cash available for debt repayment, which depends on net income, which depends on interest expense.

**Solutions:**

1. **Iterative calculations**: Enable iterative calculations in your spreadsheet settings (most common approach)
2. **Prior-period approximation**: Calculate interest on the beginning-of-period debt balance instead of the average. This is slightly less accurate but avoids circularity entirely.
3. **Circular reference switch**: Create a toggle that breaks the circularity for debugging, then re-enables it for the final model.

### Common Linking Errors

| Error | Symptom | Fix |
|-------|---------|-----|
| Net income not flowing to retained earnings | Balance sheet does not balance | Link retained earnings = prior + net income - dividends |
| Cash flow changes not updating cash balance | Cash on BS does not match CF statement | Cash = beginning balance + net change from CFS |
| Working capital not connected to IS drivers | Unrealistic working capital levels | Tie AR to revenue, inventory to COGS, AP to COGS |
| Depreciation missing from PP&E schedule | PP&E growing without bound | PP&E = beginning + CapEx - depreciation |
| Interest expense not tied to debt schedule | Interest is static, not dynamic | Interest = average debt balance x interest rate |

### Key Takeaway

Linking the three financial statements is the mechanical core of financial modeling. Every item on the balance sheet should be driven by something — a revenue assumption, a days-based working capital calculation, a debt schedule, or a retained earnings formula. When the linkages are correct, changing a single assumption in your model propagates through all three statements automatically, giving you a dynamic, living representation of the business.`,
    },
    {
      id: "fm-foundations-error-checking",
      slug: "error-checking",
      title: "Error Checking",
      content: `## Error Checking

Financial models drive billion-dollar decisions. An error in a model is not just embarrassing — it can lead to overpaying for an acquisition, mispricing a security, or making a disastrous capital allocation decision. Error checking is the discipline that catches mistakes before they have consequences.

### Types of Model Errors

**Formula errors**: Wrong cell references, incorrect operators, missing parentheses, or hard-coded numbers in formula rows. These are the most common and most dangerous errors because they silently produce wrong answers.

**Logic errors**: The formula works correctly but implements the wrong logic. For example, adding working capital changes when they should be subtracted, or using the wrong sign convention for cash flows.

**Assumption errors**: The inputs are unreasonable — projecting 50% growth for a mature company, or using a tax rate of 5% for a US corporation. The formulas work correctly, but the inputs produce unrealistic results.

**Structural errors**: The model architecture is flawed — circular references crash, balance sheet does not balance, or cash flow statement does not reconcile to the balance sheet.

### The Error Checking Framework

Build checks systematically across four levels:

**Level 1: Balance Sheet Check**
The most fundamental check. On every projection period:

Balance Check = Total Assets - (Total Liabilities + Shareholders' Equity)

This should equal zero (or within a rounding tolerance of 0.01). Display this prominently on every financial statement tab and on a dedicated Checks tab. Use conditional formatting: green if zero, red if non-zero.

**Level 2: Cash Flow Reconciliation**
Verify that the change in cash on the cash flow statement matches the change in the cash balance on the balance sheet:

CFS Check = (Ending Cash on BS) - (Beginning Cash on BS) - (Net Change in Cash on CFS)

This should also equal zero.

**Level 3: Reasonableness Checks**
Flag values that fall outside expected ranges:

| Check | Reasonable Range | Concern If |
|-------|-----------------|------------|
| Revenue growth | -5% to 30% | Outside range |
| Gross margin | Industry-specific | Deviates > 5% from historical |
| EBITDA margin | Industry-specific | Deviates > 5% from historical |
| CapEx / Revenue | 2-15% | Outside historical range |
| Tax rate | 20-30% (US) | Below 15% or above 35% |
| Debt / EBITDA | 0-6x | Above 7x |
| Interest coverage | > 1.5x | Below 1.5x |
| Cash balance | > 0 | Negative in any period |

**Level 4: Cross-Checks**
Verify internal consistency across model components:

- Does the depreciation schedule's ending PP&E match the balance sheet?
- Does the debt schedule's ending balance match the balance sheet?
- Does the tax calculation's effective rate match the assumed rate?
- Does the working capital schedule tie to the balance sheet items?

### The Checks Tab

Create a dedicated "Checks" tab that consolidates all model checks in one place:

\`\`\`
=== MODEL CHECKS ===

Balance Sheet Check (each period):    PASS / FAIL
Cash Flow Reconciliation:             PASS / FAIL
Revenue Growth Range:                 PASS / FAIL
Margin Reasonableness:                PASS / FAIL
Leverage Covenant:                    PASS / FAIL
Interest Coverage:                    PASS / FAIL
Cash Positive:                        PASS / FAIL

OVERALL STATUS:                       ALL CHECKS PASS
\`\`\`

Use a single master check cell: =IF(AND(all checks pass), "ALL CHECKS PASS", "ERRORS DETECTED"). This cell should be visible on the model's cover page.

### Preventing Errors

Prevention is better than detection:

1. **Build incrementally**: Complete one section, check it, then move to the next. Do not build the entire model and check at the end.
2. **Use consistent formulas**: One formula per row. If a formula changes mid-row, you have introduced a potential error.
3. **Trace precedents and dependents**: Use spreadsheet tools to verify cell references are correct.
4. **Peer review**: Have a colleague review your model independently. Fresh eyes catch errors that you have become blind to.
5. **Stress test**: Run extreme assumptions (zero revenue, maximum leverage) and verify the model behaves sensibly.

### The Cost of Errors

Real-world modeling errors have had serious consequences:
- London Whale (JPMorgan, 2012): A spreadsheet error contributed to \$6 billion in trading losses
- Reinhart-Rogoff (2013): An Excel error in an influential economics paper affected policy debates
- Numerous M&A and IPO errors have led to mispriced deals, litigation, and career consequences

### Key Takeaway

Error checking is not a step at the end of model building — it is a continuous discipline embedded in every phase of construction. Build checks as you build formulas. Review checks every time you make a change. And always assume there is an error you have not found yet — that healthy paranoia is what keeps models reliable and reputations intact.`,
    },
  ],
};
