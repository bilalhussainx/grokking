import { Module } from "../types";

export const module5: Module = {
  id: "power-query",
  title: "Power Query: Automated Data Cleaning & ETL",
  description: "Import, clean, reshape, and combine data from multiple sources automatically with Power Query — the Excel feature that replaces hours of manual data wrangling",
  lessons: [
    {
      id: "power-query",
      slug: "power-query",
      title: "Power Query ETL",
      content: `# Power Query: Excel's ETL Engine

Power Query records every cleaning step and replays them instantly when data refreshes. What took 2 hours of manual work every week becomes a one-click refresh.

---

\`\`\`concept
{
  "title": "Why Power Query Changes Everything",
  "variant": "mental-model",
  "content": "Before Power Query, data cleaning was destructive — you'd delete rows, reformat columns, and manually combine files, losing the original. Next week you'd repeat all of it. Power Query is non-destructive: it connects to the source, applies a recorded sequence of transformations, and outputs a clean table. Refresh the query → clean data in seconds. The source is never touched. This is the ETL (Extract, Transform, Load) pattern applied to Excel."
}
\`\`\`

---

## Connecting to Data Sources

\`\`\`
Data → Get Data → From...

Sources Power Query can connect to:
• Excel workbook (combine sheets, pull specific tables)
• CSV / Text / JSON / XML files
• Folder (combine multiple files automatically — most powerful)
• SQL Server, PostgreSQL, MySQL, Oracle
• SharePoint, OneDrive folders
• Web pages (table scraping)
• REST APIs (via Web connector)
• Azure, AWS, Google BigQuery

--- Connect to a folder (combine 12 monthly CSVs automatically) ---
Data → Get Data → From File → From Folder
→ Browse to folder containing Jan.csv, Feb.csv... Dec.csv
→ Power Query loads ALL files, adds a Source.Name column
→ Filter, clean, and combine → load to table
→ Add new month CSV to folder → Refresh → updated automatically
\`\`\`

## Essential Transformations

\`\`\`
--- Remove & filter ---
• Remove columns: right-click header → Remove
• Remove rows: Home → Remove Rows → Remove Top Rows / Remove Blank Rows / Remove Duplicates
• Filter: dropdown on column header (same as Excel but applied to source)
• Keep errors / remove errors: useful for data quality audits

--- Split Column ---
• By delimiter: "John Smith" → "John" | "Smith"
• By number of characters: fixed-width files
• By position: parse fixed-format strings

--- Pivot & Unpivot ---
Before (wide format):          After (tall/narrow format):
Month | North | South         Month | Region | Sales
Jan   | 1000  | 800      →    Jan   | North  | 1000
Feb   | 1200  | 900           Jan   | South  | 800

Select North + South columns → Transform → Unpivot Columns
→ Creates Attribute (region name) and Value (sales) columns
→ Tall format works with PivotTables and charts

--- Merge Queries (JOIN) ---
Home → Merge Queries:
• Left Outer: keep all rows from first table
• Inner Join: only rows matching in both tables
• Full Outer: all rows from both tables

Example: Merge Sales[CustomerID] with Customers[ID]
→ Adds customer name, region, segment to each sale row
→ Expand the merged column to show desired fields

--- Append Queries (UNION) ---
Combine rows from multiple queries (same columns):
Home → Append Queries → Add Jan, Feb, Mar queries
→ Stacks all rows into one table
\`\`\`

## Data Type & Cleaning Operations

\`\`\`
--- Fix data types (critical — wrong types break everything) ---
Right-click column header → Change Type:
• Dates stored as text → Date
• Numbers stored as text → Whole Number / Decimal
• "TRUE"/"FALSE" text → Logical

Auto-detect: Transform → Detect Data Type
(Review it — auto-detect sometimes gets it wrong)

--- Text cleaning ---
Transform → Format → Trim (removes leading/trailing spaces)
Transform → Format → Clean (removes non-printable characters)
Transform → Format → UPPER / LOWER / Proper Case

--- Replace values ---
Transform → Replace Values:
"N/A" → null (blank)
"United States" → "USA"
Right-click column → Replace Errors → 0 (replace error values)

--- Custom Column (calculated field) ---
Add Column → Custom Column → write M formula:
= [Revenue] - [Cost]                    → Profit
= if [Amount] > 1000 then "High" else "Low"  → Segment
= Date.Year([OrderDate])                → Year number
= Text.Split([FullName], " "){0}        → First name only
\`\`\`

## M Language Basics

\`\`\`
Power Query's underlying language is M (Mashup). Understanding it lets you
write transformations the GUI can't handle.

// Every query is a series of let...in steps:
let
    Source = Excel.CurrentWorkbook(){[Name="SalesTable"]}[Content],
    FilteredRows = Table.SelectRows(Source, each [Amount] > 0),
    AddedProfit = Table.AddColumn(FilteredRows, "Profit",
        each [Revenue] - [Cost], type number),
    SortedByDate = Table.Sort(AddedProfit, {{"Date", Order.Descending}})
in
    SortedByDate

// Common M functions:
Table.SelectRows(table, each [Column] = "Value")   // filter
Table.AddColumn(table, "NewCol", each [A] + [B])   // add column
Table.RemoveColumns(table, {"ColA", "ColB"})        // remove columns
Table.RenameColumns(table, {{"OldName", "NewName"}})
Table.Group(table, {"Category"}, {{"Total", each List.Sum([Amount])}})
Text.Contains([Name], "Corp")                       // text check
Date.From(DateTime.LocalNow())                      // today's date
\`\`\`

## Refresh & Automation

\`\`\`
--- Manual refresh ---
Data → Refresh All (refreshes all queries + PivotTables)
Query Properties → Refresh Every X minutes (for live data)

--- On-open refresh ---
Query Properties → Refresh data when opening the file
→ Data is always current when someone opens the workbook

--- Refresh only changed queries ---
Right-click specific query in Queries & Connections pane → Refresh
(Avoids refreshing slow sources unnecessarily)

--- Error handling in refresh ---
If source file moves: right-click query → Edit → change Source step
Query Dependencies: Data → Queries & Connections → right-click → Dependencies
→ Shows which queries feed which tables
\`\`\`

\`\`\`takeaways
["Power Query is non-destructive — it never modifies the source data, only the output table.", "Folder connector combines 12 monthly files automatically — add a new file, click Refresh.", "Unpivot transforms wide (column-per-category) data into tall (row-per-category) format needed by PivotTables.", "Merge Queries is SQL JOIN in Excel — combine Sales with Customers without VLOOKUP fragility.", "Fix data types first — text-formatted numbers break every aggregation downstream.", "Write custom M code (Add Column → Custom Column) for transformations the GUI doesn't support."]
\`\`\`
`,
    },
  ],
};
