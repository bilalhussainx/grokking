import { Module } from "../types";

export const module3: Module = {
  id: "advanced-formulas",
  title: "Advanced Formulas: OFFSET, INDIRECT & Array Functions",
  description: "Dynamic ranges with OFFSET and INDIRECT, array formulas, LET, LAMBDA, XLOOKUP, and building formula-driven models",
  lessons: [
    {
      id: "advanced-formulas",
      slug: "advanced-formulas",
      title: "Advanced Formulas & Dynamic Arrays",
      content: `# Advanced Excel Formulas

Beyond VLOOKUP lies a world of formulas that adapt to data, eliminate helper columns, and replace hundreds of manual steps with a single cell.

---

\`\`\`concept
{
  "title": "Excel's Calculation Engine",
  "variant": "mental-model",
  "content": "Excel formulas are a functional programming language. Every cell is a pure function of its inputs — change an input and outputs cascade through the workbook. Advanced formulas exploit this: OFFSET creates ranges that expand automatically, INDIRECT builds references from text so you can switch datasets with a dropdown, and dynamic array functions (FILTER, SORT, UNIQUE) spill results across cells without pressing Ctrl+Shift+Enter."
}
\`\`\`

---

## XLOOKUP — The VLOOKUP Replacement

\`\`\`
XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])

Advantages over VLOOKUP:
• Looks left (VLOOKUP only looks right)
• Returns multiple columns at once
• Has built-in "not found" handling (no IFERROR wrapping needed)
• Exact match by default (VLOOKUP defaults to approximate)

=XLOOKUP(A2, Products[SKU], Products[Price], "Not found")
→ Returns price for SKU in A2; "Not found" if missing

=XLOOKUP(A2, Products[SKU], Products[[Price]:[Stock]], "Not found")
→ Returns BOTH Price and Stock columns (spills horizontally)

=XLOOKUP(A2, Products[SKU], Products[Price], , -1)
→ match_mode=-1: exact or next smaller (for tax brackets, shipping tiers)

=XLOOKUP(1, (Region=A2)*(Month=B2), Sales)
→ Multi-condition lookup using Boolean array multiplication
\`\`\`

## Dynamic Arrays: FILTER, SORT, UNIQUE

\`\`\`
These functions SPILL — they write results to neighboring cells automatically.
No Ctrl+Shift+Enter, no helper columns.

--- FILTER: Extract rows matching a condition ---
=FILTER(Sales, Sales[Region]="North", "No data")
→ Returns all rows where Region = "North"
→ Shows "No data" if nothing matches

=FILTER(Sales, (Sales[Region]="North") * (Sales[Month]="Jan"))
→ AND condition: Region=North AND Month=Jan
→ * means AND, + means OR in Boolean array logic

=FILTER(Sales, (Sales[Amount]>1000) + (Sales[Priority]="High"))
→ OR condition: Amount > 1000 OR Priority = High

--- SORT & SORTBY ---
=SORT(Products[Name])
→ Alphabetical sort of product names

=SORTBY(Sales, Sales[Amount], -1)
→ Sort sales table by Amount, descending (-1)

=SORTBY(Sales, Sales[Region], 1, Sales[Amount], -1)
→ First sort by Region ascending, then by Amount descending

--- UNIQUE: Deduplicate a list ---
=UNIQUE(Sales[Region])
→ Returns distinct regions (dynamic — updates as data changes)

=UNIQUE(Sales[[Region]:[Product]], TRUE)
→ Unique combinations of Region + Product

--- Combine them: Top 5 products by revenue ---
=TAKE(SORTBY(Products[Name], Products[Revenue], -1), 5)
→ Top 5 product names by revenue
\`\`\`

## OFFSET: Dynamic Named Ranges

\`\`\`
OFFSET(reference, rows, cols, [height], [width])
→ Returns a range offset from a starting point
→ Height/width can be calculated — the range grows with data

--- Dynamic range that expands with new rows ---
Data starts at A1 header, data from A2:
=OFFSET(A1, 1, 0, COUNTA(A:A)-1, 1)
→ Returns A2:A(n) where n = number of filled rows
→ As you add data, the range expands automatically

--- Last 30 days of data ---
=OFFSET(A1, COUNTA(A:A)-30, 0, 30, 3)
→ Returns the last 30 rows, 3 columns wide

--- Use in chart data source ---
Name: LastMonth
Refers to: =OFFSET(Sheet1!\$B\$1, COUNTA(Sheet1!\$A:\$A)-31, 0, 30, 1)
→ Chart always shows last 30 days without manual updates
\`\`\`

## INDIRECT: Reference from Text

\`\`\`
INDIRECT(ref_text) — converts a text string into a live cell reference
→ Dangerous but powerful: makes references dynamic at the cost of volatility

--- Select data from different sheets with a dropdown ---
Dropdown in A1: "North" / "South" / "East"
=SUM(INDIRECT(A1 & "!B2:B100"))
→ If A1 = "North", sums North!B2:B100
→ Change dropdown → formula reads different sheet

--- Dynamic named range selection ---
Named ranges: Jan_Sales, Feb_Sales, Mar_Sales
A1 = "Feb"
=SUM(INDIRECT(A1 & "_Sales"))
→ Sums Feb_Sales dynamically

--- Build column reference from number ---
=INDIRECT("R1C" & MATCH("Revenue", Headers, 0), FALSE)
→ R1C1 notation: finds "Revenue" column and returns that cell
\`\`\`

## LET & LAMBDA: Formula Functions

\`\`\`
--- LET: Name intermediate calculations (like variables) ---
Without LET (repeated calculation):
=IF(SUMPRODUCT((Orders[Customer]=A2)*Orders[Revenue]) > 10000,
   SUMPRODUCT((Orders[Customer]=A2)*Orders[Revenue]) * 0.1, 0)

With LET:
=LET(
  customer_revenue, SUMPRODUCT((Orders[Customer]=A2)*Orders[Revenue]),
  IF(customer_revenue > 10000, customer_revenue * 0.1, 0)
)
→ Calculate once, use multiple times
→ Faster + readable

--- LAMBDA: Create custom reusable functions ---
=LAMBDA(principal, rate, years, principal * (1 + rate)^years)
→ Compound interest formula, reusable

Save as named formula "CompoundInterest":
=CompoundInterest(10000, 0.07, 10)
→ Returns 19671.51

--- LAMBDA with recursion (factorial): ---
Factorial = LAMBDA(n, IF(n <= 1, 1, n * Factorial(n-1)))
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "You need to look up a price from a table where the key column is to the RIGHT of the return column. Which function should you use?",
      "options": [
        "VLOOKUP with col_index_num = -1",
        "INDEX + MATCH",
        "XLOOKUP (it can look in any direction)",
        "OFFSET + MATCH"
      ],
      "answer": 2,
      "explanation": "VLOOKUP can only look to the right — the key must be in the leftmost column. XLOOKUP has no such restriction: the lookup_array and return_array are specified separately, so the return column can be anywhere (left, right, or same column). INDEX+MATCH also works but requires two nested functions."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["XLOOKUP replaces VLOOKUP, INDEX/MATCH, and HLOOKUP — use it for all new lookups.", "Dynamic array functions (FILTER, SORT, UNIQUE) spill automatically — no Ctrl+Shift+Enter needed.", "OFFSET creates ranges whose size is calculated — perfect for charts that update automatically.", "INDIRECT converts text to references — powerful for multi-sheet models but recalculates on every change (use sparingly).", "LET names intermediate values in a formula — eliminates redundant calculations and improves readability.", "LAMBDA creates custom named functions — use for repeated business logic (compound interest, tax brackets, etc.)."]
\`\`\`
`,
    },
  ],
};
