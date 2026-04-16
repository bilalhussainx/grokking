import { Module } from "../types";

export const module4: Module = {
  id: "charts-dashboards",
  title: "Charts, Visualizations & Dashboard Design",
  description: "Choose the right chart type, build interactive dashboards with slicers and form controls, sparklines, conditional formatting, and data storytelling principles",
  lessons: [
    {
      id: "charts-dashboards",
      slug: "charts-dashboards",
      title: "Charts & Dashboard Design",
      content: `# Excel Charts & Dashboard Design

A great dashboard communicates in seconds. A bad one makes people open a spreadsheet and do mental arithmetic. The difference is chart choice, layout discipline, and knowing which Excel features to combine.

---

\`\`\`concept
{
  "title": "The Dashboard Design Principle",
  "variant": "mental-model",
  "content": "Dashboards answer a question. Before building, write the question: 'Is our sales team on track to hit Q4 targets by region?' Every chart, number, and filter should help answer that and nothing else. Remove anything that doesn't serve the question. Most bad dashboards fail because they show everything available rather than the one thing decision-makers need."
}
\`\`\`

---

## Choosing the Right Chart

\`\`\`compare
{
  "title": "Chart Type Decision Guide",
  "items": [
    {
      "name": "Bar / Column Chart",
      "description": "Compare quantities across categories. Use bar (horizontal) when category labels are long. Use column (vertical) for time series. Never use 3D — it distorts proportions."
    },
    {
      "name": "Line Chart",
      "description": "Show trends over time. Works best with 3+ data points per series. If you have fewer, use column instead — a line implies continuous change between points."
    },
    {
      "name": "Scatter Plot",
      "description": "Show relationship between two numeric variables (correlation). Add a trendline to make the relationship explicit. Never use to compare categories."
    },
    {
      "name": "Waterfall Chart",
      "description": "Show how components build up to or subtract from a total. Perfect for profit/loss bridges, budget variance, and cash flow. Built into Excel 2016+."
    },
    {
      "name": "Combo Chart",
      "description": "Two chart types on one chart with two Y-axes. Classic: bars for revenue (left axis) + line for margin % (right axis). Use sparingly — two axes require explanation."
    },
    {
      "name": "Sparklines",
      "description": "Tiny in-cell charts (line, bar, win/loss) that show trend without taking up space. Insert → Sparklines. Best for tables with many rows needing trend context."
    }
  ]
}
\`\`\`

## Interactive Slicers & Timelines

\`\`\`
Slicers make pivot tables and charts filterable with one click — no dropdown menus.

--- Add a slicer ---
1. Click inside a PivotTable
2. Insert → Slicer → Select fields (Region, Product Category, Rep)
3. Click slicer buttons → PivotTable filters immediately
4. Connect one slicer to multiple PivotTables:
   Right-click slicer → Report Connections → check all tables

--- Timeline slicer (date filtering) ---
1. Data must have a proper Date column (not text)
2. Insert → Timeline → Select date field
3. Filter by: Days / Months / Quarters / Years with one click
4. Drag timeline handles to narrow the date range

--- Slicer design tips ---
• Align slicers to the top or left panel — not scattered across the sheet
• Format → columns: 3-4 for a Region slicer, 1-2 for a long product list
• Match slicer style to your dashboard color scheme (right-click → Slicer Style)
\`\`\`

## Dynamic Dashboard with Form Controls

\`\`\`
Form controls (not ActiveX) work across Windows and Mac without macros.

--- Combo Box (dropdown that drives formulas) ---
1. Developer tab → Insert → Form Controls → Combo Box
2. Right-click → Format Control:
   Input range: list of options (e.g., D1:D5 with region names)
   Cell link: F1 (writes the selected index: 1, 2, 3...)
3. Use INDEX to convert the number back:
   =INDEX(D1:D5, F1)  → returns the region name
4. Use in SUMIF/XLOOKUP:
   =SUMIF(Sales[Region], INDEX(D1:D5,F1), Sales[Revenue])

--- Scroll Bar (drives a "top N" or date offset) ---
1. Developer tab → Insert → Form Controls → Scroll Bar
2. Format Control: Min=1, Max=12, Cell link=G1
3. =OFFSET(A1, G1-1, 0, 10, 3)
   → Scrolls through 10-row window as user drags the bar

--- Check Box (toggle series on/off) ---
Cell link = H1 (returns TRUE/FALSE)
Chart series value: =IF(H1, RevenueData, NA())
→ NA() hides the series from chart
\`\`\`

## Conditional Formatting as Data Visualization

\`\`\`
--- Data Bars (in-cell bar chart) ---
Select column → Home → Conditional Formatting → Data Bars
→ Each cell shows a proportional bar — instant visual ranking
→ Solid fill (not gradient) is more readable

--- Color Scales (heat map) ---
3-color scale: Red (lowest) → Yellow (middle) → Green (highest)
Use for: geographic performance tables, correlation matrices

--- Icon Sets (status indicators) ---
Traffic lights, arrows, or checkmarks based on thresholds
Custom rule: >100% target = green checkmark, 80-100% = yellow, <80% = red X
Format → Icon Sets → Reverse order if needed

--- Highlight exceptions automatically ---
=AND(B2<TARGET, MONTH(A2)=MONTH(TODAY()))
→ Highlights cells below target only in the current month

--- Duplicate detection ---
=COUNTIF(\$A\$2:\$A\$100, A2)>1
→ Highlights any value that appears more than once
\`\`\`

## Dashboard Layout Principles

\`\`\`
--- Grid alignment ---
• Hold Alt while moving charts/shapes → snaps to cell grid
• Use Arrange → Align tools to align multiple objects
• Keep consistent margins: 1 cell border around every element

--- Color palette ---
• 2-3 primary colors max
• Use tints (60%, 40%, 20%) for hierarchy, not new colors
• One accent color for the "most important" metric
• Gray for labels, axes, and secondary data

--- Typography ---
• Title: 14-16pt bold → what question does this dashboard answer?
• Section headers: 11-12pt bold
• Data labels: 9-10pt, gray not black (black is too heavy)
• KPI numbers: 20-24pt — the metric is the hero

--- KPI card layout ---
| METRIC NAME    |
| BIG NUMBER     |
| ▲ +X% vs last |

Use no charts for top-line numbers — let the number speak.
Use sparkline next to the number to show 30-day trend.
\`\`\`

\`\`\`takeaways
["Always write the dashboard's question before building — every element should serve that question.", "Slicers are more intuitive than filter dropdowns — connect one slicer to multiple PivotTables for synchronized filtering.", "Form Controls (not ActiveX) work on both Windows and Mac without macros — use Combo Box + INDEX for user-driven formulas.", "Data bars and icon sets make tables self-annotating — no chart needed for simple rankings or status.", "Alt + drag snaps to the cell grid — keep chart sizes and positions consistent across your dashboard.", "Use sparklines for trend in tables rather than a full line chart — they communicate trend without stealing real estate."]
\`\`\`
`,
    },
  ],
};
