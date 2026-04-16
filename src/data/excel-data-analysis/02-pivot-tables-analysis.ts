import { Module } from "../types";

export const module2: Module = {
  id: "pivot-tables-analysis",
  title: "Pivot Tables, Power Query & Advanced Analysis",
  description: "Pivot tables from beginner to advanced, Power Query for ETL, dynamic arrays, and building executive dashboards",
  lessons: [
    {
      id: "pivot-tables",
      slug: "pivot-tables",
      title: "Pivot Tables: Instant Business Analysis",
      content: `# Pivot Tables: Excel's Most Powerful Feature

A pivot table can summarize 100,000 rows into a business answer in 30 seconds. This is the skill that makes Excel analysts valuable.

---

## Building a Pivot Table

\`\`\`concept
{
  "title": "The Pivot Table Mental Model",
  "variant": "mental-model",
  "content": "A pivot table has four areas: Rows (what to group by on rows), Columns (what to group by on columns), Values (what to calculate — sum/count/average), Filters (top-level filter). Think of it as: 'For each [Row], for each [Column], compute [Value], filtered by [Filter].' You can drag fields between areas instantly — the table recalculates."
}
\`\`\`

---

## Building a Sales Analysis

\`\`\`excel
' Source data structure (in Sheet1):
' Date | Product | Region | Salesperson | Units | Revenue

' Step 1: Select data → Insert → PivotTable → New Sheet

' Step 2: Drag fields:
' Rows:    Region, Product
' Columns: Quarter (from Date — Group dates by quarter)
' Values:  Revenue (Sum), Units (Sum)
' Filters: Year

' Step 3: Format values → Value Field Settings:
' Number Format → Currency ($)
' Show Values As → % of Grand Total (for market share)

' Calculated Field (custom formula in pivot):
' Insert → Calculated Field → Name: "Avg Revenue Per Unit"
' Formula: = Revenue / Units

' ===== Pivot Table Tips =====

' Refresh data (after source changes):
' Right-click → Refresh

' Show items with no data:
' Field Settings → Layout → Show items with no data

' Sort by value:
' Click dropdown on row label → Sort by → Sum of Revenue

' Filter top 10:
' Click dropdown → Value Filters → Top 10
\`\`\`

## Power Query: ETL Without Code

\`\`\`excel
' Power Query (Get & Transform) — import, clean, reshape data

' Access: Data tab → Get Data

' Common transformations:
' 1. Remove duplicates
' 2. Filter rows (e.g., remove cancelled orders)
' 3. Split columns by delimiter
' 4. Merge queries (JOIN tables)
' 5. Unpivot columns → rows
' 6. Add custom column with formula

' Example: clean a messy CSV
' - Get Data → From Text/CSV → navigate to file
' - Detect data types → Change Type → Using Locale
' - Remove rows with null CustomerID
' - Trim all text columns: Transform → Format → Trim
' - Split [FullName] by delimiter (space): Split Column → By Delimiter
' - Rename [Column1] to [FirstName], [Column2] to [LastName]
' - Add custom column [RevenuePerUnit] = [Revenue] / [Units]
' - Load to → Table in Sheet1

' EVERY step is recorded in the M code (Query Settings → Advanced Editor)
' You can edit M code directly for complex transformations
\`\`\`

## Dynamic Arrays (Excel 365)

\`\`\`excel
' Dynamic arrays automatically spill into adjacent cells
' No more Ctrl+Shift+Enter!

' SORT:
=SORT(A2:C100, 3, -1)   ' Sort range by column 3, descending

' FILTER:
=FILTER(A2:C100, B2:B100="Electronics")
=FILTER(A2:C100, (B2:B100="Electronics") * (C2:C100>1000))
' * = AND in array logic, + = OR

' UNIQUE:
=UNIQUE(A2:A100)         ' Unique values
=UNIQUE(A2:C100, FALSE, TRUE)  ' Unique rows (3rd arg TRUE = only unique, not first occurrence)

' SEQUENCE:
=SEQUENCE(10)            ' [1,2,...,10]
=SEQUENCE(5, 3, 0, 10)   ' 5 rows × 3 cols, start 0, step 10

' Combining dynamic arrays:
=SORT(UNIQUE(FILTER(A2:C100, B2:B100="Electronics")), 3, -1)
' Filter Electronics, deduplicate, sort by col 3 descending

' Reference a spill range with #:
=SUM(A2#)   ' Sum the entire spill from A2
\`\`\`

## Excel Dashboard Design

\`\`\`compare
{
  "title": "Dashboard Best Practices",
  "items": [
    {
      "name": "One screen, one story",
      "description": "Dashboards should answer ONE question at a glance. 'Sales performance vs target this quarter.' Not everything. Not a wall of charts."
    },
    {
      "name": "Choose charts correctly",
      "description": "Line: trends over time. Bar: compare categories. Scatter: correlation. Pie: ONLY for part-to-whole with < 5 slices. Avoid 3D charts — they distort proportions."
    },
    {
      "name": "Use slicers for interactivity",
      "description": "Insert → Slicer. Connect slicer to multiple pivot tables. One click filters the entire dashboard. Far better than dropdown filters."
    },
    {
      "name": "Highlight key numbers",
      "description": "KPI boxes at the top: total revenue, % vs target, top region. Large font, color-coded (green/red). Viewers read top-to-bottom."
    },
    {
      "name": "Conditional formatting",
      "description": "Home → Conditional Formatting → Color Scales or Icon Sets. Makes patterns visible instantly without the viewer reading numbers. Heat maps for time × category data."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Pivot tables: drag Region to Rows, Quarter to Columns, Revenue to Values — instant cross-tab analysis", "Group dates in pivot tables: right-click on date field → Group → select Month/Quarter/Year", "Power Query records every transformation step — refresh reruns the entire pipeline automatically", "Dynamic array FILTER: =FILTER(range, condition1 * condition2) — * means AND, + means OR", "Slicers connect to multiple pivot tables: right-click slicer → Report Connections → select all pivots", "Show Values As: % of Grand Total, % of Row Total, Running Total — instant market share/YTD analysis"]
\`\`\`
`,
    },
  ],
};
