import { Module } from "../types";

export const module6: Module = {
  id: "financial-modeling",
  title: "Financial Modeling in Excel",
  description: "Build 3-statement financial models, DCF valuation, scenario analysis with Data Tables, Goal Seek, Solver, and the best practices used by investment banks",
  lessons: [
    {
      id: "financial-modeling",
      slug: "financial-modeling",
      title: "Financial Modeling & Scenario Analysis",
      content: `# Financial Modeling in Excel

Financial models are decision machines. A good model answers "what happens to profit if revenue drops 20%?" in seconds. Investment banks, private equity, and corporate finance teams all run on Excel models.

---

\`\`\`concept
{
  "title": "The Golden Rule of Financial Models",
  "variant": "mental-model",
  "content": "Hard-code nothing twice. Every assumption (growth rate, margin, tax rate) lives in one place — a dedicated assumptions section with clear labels. All calculations reference those cells. Change one assumption → entire model updates. This is why models use =B3*assumptions!C5 rather than =B3*0.25. When the tax rate changes, you change one cell, not hunt through 40 formulas."
}
\`\`\`

---

## Model Structure Best Practices

\`\`\`
--- Tab organization ---
Cover     → Title, date, author, version, disclaimer
Inputs    → All assumptions in one place (NEVER hardcode in calculations)
Income Statement (P&L)
Balance Sheet
Cash Flow Statement
Valuation  → DCF, multiples
Scenarios  → Scenario Manager or Data Table outputs
Charts     → Visualization of key outputs

--- Cell color conventions (industry standard) ---
Blue font on white background  = hardcoded inputs (change these)
Black font on white background = formulas (don't touch)
Green font                     = links from other files
Orange shading                 = outputs / key metrics

--- Formula discipline ---
• One formula per row, consistent across columns
• No circular references (except for working capital iterations)
• Name critical assumption cells (Ctrl+F3): GrowthRate, TaxRate, WACC
\`\`\`

## Income Statement Model

\`\`\`
Assumptions tab:
Revenue Growth   | FY2024: 15% | FY2025: 12% | FY2026: 10%
Gross Margin     | 65%         | 66%          | 67%
EBITDA Margin    | 22%         | 23%          | 24%
D&A (% of Rev)   | 3%          | 3%           | 3%
Tax Rate         | 21%         | 21%          | 21%

Income Statement:
                        FY2024    FY2025    FY2026
Revenue             = Prior * (1 + Growth)
COGS                = Revenue * (1 - GrossMargin)
Gross Profit        = Revenue - COGS
Operating Expenses  = Revenue * OpexPct  [hardcoded in Inputs]
EBITDA              = Gross Profit - OpEx
D&A                 = Revenue * DA_Pct
EBIT                = EBITDA - D&A
Interest Expense    = Debt * InterestRate
EBT                 = EBIT - Interest
Taxes               = EBT * TaxRate
Net Income          = EBT - Taxes

Key ratios (calculated automatically):
Gross Margin %    = Gross Profit / Revenue
EBITDA Margin %   = EBITDA / Revenue
Net Margin %      = Net Income / Revenue
\`\`\`

## DCF Valuation

\`\`\`
--- Free Cash Flow projection (5 years) ---
Free Cash Flow = EBIT * (1 - TaxRate) + D&A - CapEx - ΔWorkingCapital

Year:          1         2         3         4         5
EBIT:          $50M      $58M      $67M      $75M      $82M
Tax-adjusted:  $39.5M    $45.8M    $52.9M    $59.3M    $64.8M
+ D&A:         $15M      $17M      $20M      $22M      $25M
- CapEx:       $20M      $23M      $26M      $29M      $32M
- ΔWC:         $5M       $6M       $7M       $7M       $8M
FCF:           $29.5M    $33.8M    $39.9M    $45.3M    $49.8M

--- Discount to present value ---
WACC: 10% (from Inputs tab)

PV of FCF = FCF / (1 + WACC)^Year
=NPV(WACC, FCF1:FCF5)    → Excel NPV function does this

--- Terminal Value (Gordon Growth Model) ---
Terminal Value = FCF_Year5 * (1 + g) / (WACC - g)
where g = long-term growth rate (2-3%)

PV of Terminal Value = TV / (1 + WACC)^5

--- Enterprise Value ---
EV = PV of FCFs + PV of Terminal Value
Equity Value = EV - Net Debt (Total Debt - Cash)
Price per Share = Equity Value / Shares Outstanding

--- Sensitivity table (WACC vs Terminal Growth Rate) ---
=DATA TABLE: Row input = WACC, Column input = g
→ See how stock price changes across 25 combinations
\`\`\`

## Scenario Analysis Tools

\`\`\`
--- What-If Analysis: Data Table ---
One-variable table (how does NPV change with different growth rates?):
1. Set up column of inputs: 5%, 8%, 10%, 12%, 15%
2. Reference formula in cell one row up and one column right of inputs
3. Select input range + formula cell
4. Data → What-If Analysis → Data Table → Column input = growth rate cell

Two-variable table (NPV vs WACC and growth):
→ Row inputs = WACC values, Column inputs = growth rates
→ Formula cell at intersection
→ Data Table with both Row and Column inputs

--- Goal Seek: Reverse calculation ---
"What revenue growth do we need to hit \$50M net income?"
1. Data → What-If Analysis → Goal Seek
2. Set cell: Net Income cell
3. To value: 50,000,000
4. By changing cell: Revenue Growth assumption
→ Excel back-solves iteratively

--- Scenario Manager ---
Save multiple named scenarios with different assumption sets:
Scenarios: Base Case, Bull Case (20% growth), Bear Case (5% growth)
Data → What-If Analysis → Scenario Manager → Add
→ Switch scenarios to see full model instantly
→ Summary report: shows all scenarios side by side

--- Solver: Optimize multiple variables ---
Example: Maximize NPV subject to:
• Total CapEx ≤ \$100M
• Headcount growth ≤ 50%
• Debt/EBITDA ≤ 3x
Data → Solver → Set objective (NPV) → set constraints
→ Finds optimal allocation across divisions
\`\`\`

\`\`\`takeaways
["Hard-code assumptions once in an Inputs tab — all calculations reference that single source of truth.", "Color convention: blue font = input, black = formula — anyone opening the model knows what to change.", "NPV() in Excel discounts cash flows, but use it carefully — the timing convention is end-of-period.", "Two-variable Data Table builds a 25-cell sensitivity grid in seconds — every DCF should have WACC vs terminal growth.", "Goal Seek solves 'what input do I need to achieve this output?' — reverse engineering targets.", "Scenario Manager stores multiple assumption sets — toggle Base/Bull/Bear without overwriting anything."]
\`\`\`
`,
    },
  ],
};
