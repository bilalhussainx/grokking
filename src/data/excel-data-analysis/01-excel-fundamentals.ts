import { Module } from "../types";

export const module1: Module = {
  id: "excel-fundamentals",
  title: "Excel Fundamentals & Essential Formulas",
  description: "Cell references, formula types, VLOOKUP vs XLOOKUP, IF logic, text functions, and the Excel mental model that makes everything else click",
  lessons: [
    {
      id: "excel-core-formulas",
      slug: "excel-core-formulas",
      title: "Excel Core: References, Lookups & Logic",
      content: `# Excel: The World's Most Used Data Tool

Over 1 billion people use Excel. Knowing it deeply separates data analysts from data entry clerks. These are the formulas that actually matter in business.

---

\`\`\`concept
{
  "title": "The Cell Reference Mental Model",
  "variant": "mental-model",
  "content": "Three reference types: A1 (relative — moves when copied), \$A\$1 (absolute — locked when copied), \$A1 / A\$1 (mixed — one axis locked). When to use which: relative for most formulas, absolute for constants/rates/lookup tables, mixed when filling down a table where the column or row should stay fixed."
}
\`\`\`

---

## Essential Lookup Functions

\`\`\`excel
' ===== XLOOKUP (Excel 365 / 2021) — replaces VLOOKUP =====

' Basic XLOOKUP:
=XLOOKUP(A2, Products!A:A, Products!C:C)
' Lookup A2 in column A of Products sheet, return column C

' With default value and match mode:
=XLOOKUP(A2, Products!A:A, Products!C:C, "Not found", 0, 1)
' 0 = exact match, 1 = sorted ascending approximate

' Return multiple columns at once:
=XLOOKUP(A2, Products!A:A, Products!B:D)
' Returns cols B, C, D in one formula (spills right)

' ===== VLOOKUP (legacy — exact match) =====
=VLOOKUP(A2, Products!A:C, 3, FALSE)
' Lookup A2 in first column of A:C range, return 3rd column
' FALSE = exact match (always use FALSE unless you need approximate)

' Common VLOOKUP mistake: the lookup value must be in the FIRST column
' XLOOKUP has no this restriction — can search any column

' ===== INDEX + MATCH (powerful combination) =====
=INDEX(Products!C:C, MATCH(A2, Products!A:A, 0))
' MATCH returns the row number where A2 is found
' INDEX returns the value at that row in column C
' More flexible than VLOOKUP: works left, works with unsorted data
\`\`\`

## Logic & Conditional Formulas

\`\`\`excel
' ===== IF and nested IFs =====
=IF(B2>1000, "High", "Low")

=IF(B2>1000, "High",
  IF(B2>500, "Medium", "Low"))

' Prefer IFS over nested IF (cleaner, no closing brackets mess):
=IFS(B2>1000, "High",
     B2>500,  "Medium",
     B2>100,  "Low",
     TRUE,    "Very Low")  ' TRUE = else

' ===== SUMIF / SUMIFS — conditional aggregation =====
=SUMIF(B:B, "Electronics", C:C)
' Sum column C where column B = "Electronics"

=SUMIFS(C:C, B:B, "Electronics", D:D, ">100")
' Sum C where B="Electronics" AND D>100

' ===== COUNTIF / COUNTIFS =====
=COUNTIF(A:A, "*apple*")    ' Count cells containing "apple" (wildcard *)
=COUNTIFS(B:B, "Active", C:C, ">="&DATE(2025,1,1))

' ===== AVERAGEIF =====
=AVERAGEIF(B:B, "Electronics", C:C)
\`\`\`

## Text Functions

\`\`\`excel
' Text manipulation — essential for data cleaning:

=LEFT(A2, 3)              ' First 3 characters
=RIGHT(A2, LEN(A2)-4)     ' Everything after first 4 chars
=MID(A2, 5, 3)            ' 3 chars starting at position 5
=LEN(A2)                  ' Length of string

=UPPER(A2)                ' ALL CAPS
=LOWER(A2)                ' all lowercase
=PROPER(A2)               ' First Letter Capitalized

=TRIM(A2)                 ' Remove leading/trailing spaces (common in CSV imports!)
=CLEAN(A2)                ' Remove non-printable characters

=CONCATENATE(A2, " ", B2) ' Old way
=A2 & " " & B2            ' Operator (same result)
=TEXTJOIN(", ", TRUE, A2:A10)  ' Join range with delimiter (skip blanks if TRUE)

' Extract numbers from text (common need):
=VALUE(TRIM(SUBSTITUTE(A2, "USD", "")))
' Remove "USD", trim spaces, convert to number

' FIND vs SEARCH:
=FIND("@", A2)     ' Case-sensitive, exact match
=SEARCH("@", A2)   ' Case-insensitive, supports wildcards

' Split text to columns via formula (Excel 365):
=TEXTSPLIT(A2, ",")          ' Split by comma (spills across cells)
=TEXTSPLIT(A2, ",", CHAR(10)) ' Split by comma AND newline
\`\`\`

## Date & Time Formulas

\`\`\`excel
' Date math — dates are numbers (days since 1900-01-01):
=TODAY()              ' Today's date
=NOW()                ' Current date and time
=DATE(2025, 12, 25)   ' Specific date

' Date parts:
=YEAR(A2)   =MONTH(A2)   =DAY(A2)
=WEEKDAY(A2, 2)   ' Day of week (1=Mon with mode 2)

' Date arithmetic:
=A2 + 30          ' 30 days later
=DATEDIF(A2, B2, "D")   ' Days between dates
=NETWORKDAYS(A2, B2)     ' Working days (excludes weekends)

' Format number as date: Ctrl+Shift+3 or Format Cells → Date
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "In =VLOOKUP(A2, B:E, 3, FALSE), what does FALSE mean and why is it important?",
      "options": [
        "Return FALSE if not found",
        "Exact match — only return a result if the lookup value is found exactly in the first column. If TRUE (approximate), VLOOKUP requires the column to be sorted and returns the largest value less than or equal to the lookup value, which gives wrong results on unsorted data.",
        "Search all columns",
        "Case-sensitive search"
      ],
      "answer": 1,
      "explanation": "FALSE (or 0) = exact match — the most common requirement. TRUE (or 1) = approximate match, designed for range lookups like tax brackets. Beginners often omit the 4th argument, which defaults to TRUE in some contexts, causing wrong results on unsorted data. Always explicitly write FALSE for exact lookups. In XLOOKUP, the match mode defaults to 0 (exact) — one of many improvements over VLOOKUP."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
