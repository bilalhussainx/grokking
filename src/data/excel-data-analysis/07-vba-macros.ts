import { Module } from "../types";

export const module7: Module = {
  id: "vba-macros",
  title: "VBA Macros & Automation",
  description: "Record and write VBA macros, automate repetitive tasks, build custom functions, create user forms, and protect/distribute Excel workbooks",
  lessons: [
    {
      id: "vba-macros",
      slug: "vba-macros",
      title: "VBA Macros & Excel Automation",
      content: `# VBA Macros & Excel Automation

VBA (Visual Basic for Applications) turns Excel into a programmable application. A 2-hour weekly report becomes a 10-second macro. Complex data processing that would take hundreds of formulas becomes 20 lines of code.

---

\`\`\`concept
{
  "title": "When to Use VBA vs Formulas vs Power Query",
  "variant": "practical",
  "content": "Power Query: use when you're cleaning and reshaping source data — it's maintainable and auto-refreshable. Formulas: use when you need calculated values that live in cells and react to input changes. VBA: use when you need to interact with the workbook itself (format on button click, send emails, open files, create sheets dynamically) or when a task has complex conditional logic that Power Query and formulas can't express cleanly."
}
\`\`\`

---

## Recording & Running Macros

\`\`\`
--- Record a macro ---
Developer tab → Record Macro → Name it → choose shortcut → OK
→ Perform your actions (formatting, copy-paste, etc.)
→ Stop Recording

--- View the recorded code ---
Developer → Visual Basic → Find your macro in a Module
→ VBA records literal cell references — refactor to make it dynamic

--- Run a macro ---
• Keyboard shortcut (set when recording)
• Developer → Macros → Run
• Button: Insert → Shapes → right-click → Assign Macro
• Form control button: Developer → Insert → Button → Assign Macro
\`\`\`

## VBA Fundamentals

\`\`\`vba
' --- Variables and types ---
Dim revenue As Double
Dim customerName As String
Dim rowCount As Long    ' Use Long not Integer (avoids overflow)
Dim isActive As Boolean
Dim today As Date

revenue = 1500000.5
customerName = "Acme Corp"
today = Date

' --- Objects: Workbook, Worksheet, Range ---
Dim wb As Workbook
Dim ws As Worksheet
Dim rng As Range

Set wb = ThisWorkbook                          ' current workbook
Set ws = wb.Sheets("Sales")                    ' by name
Set ws = wb.Sheets(1)                          ' by index
Set rng = ws.Range("A1:D100")                 ' specific range
Set rng = ws.Range(ws.Cells(1,1), ws.Cells(100,4))  ' Cells(row, col)

' --- Read and write cell values ---
Dim val As Variant
val = ws.Cells(2, 1).Value                    ' read
ws.Cells(2, 1).Value = "Hello"               ' write
ws.Range("B2").Formula = "=SUM(A1:A10)"      ' write formula

' --- Loop through rows ---
Dim lastRow As Long
lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row  ' find last filled row

Dim i As Long
For i = 2 To lastRow    ' start at 2 to skip header
    Dim amount As Double
    amount = ws.Cells(i, 3).Value
    If amount > 10000 Then
        ws.Cells(i, 4).Value = "High"
        ws.Cells(i, 4).Interior.Color = RGB(144, 238, 144)  ' light green
    ElseIf amount > 5000 Then
        ws.Cells(i, 4).Value = "Medium"
    Else
        ws.Cells(i, 4).Value = "Low"
    End If
Next i
\`\`\`

## Practical Automation Examples

\`\`\`vba
' --- Auto-format a report ---
Sub FormatSalesReport()
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets("Sales")

    ' Clear existing formatting:
    ws.Cells.ClearFormats

    ' Header row:
    With ws.Rows(1)
        .Font.Bold = True
        .Interior.Color = RGB(31, 73, 125)    ' dark blue
        .Font.Color = RGB(255, 255, 255)       ' white text
    End With

    ' AutoFit columns:
    ws.Columns.AutoFit

    ' Add borders to data range:
    Dim lastRow As Long
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    ws.Range("A1:F" & lastRow).Borders.LineStyle = xlContinuous

    MsgBox "Report formatted! " & lastRow - 1 & " rows processed."
End Sub

' --- Create a new sheet for each region ---
Sub CreateRegionSheets()
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets("Master")

    Dim regions As Variant
    regions = Array("North", "South", "East", "West")

    Dim r As Variant
    For Each r In regions
        ' Delete if exists:
        On Error Resume Next
        Application.DisplayAlerts = False
        ThisWorkbook.Sheets(CStr(r)).Delete
        Application.DisplayAlerts = True
        On Error GoTo 0

        ' Create new sheet:
        Dim newWs As Worksheet
        Set newWs = ThisWorkbook.Sheets.Add(After:=ThisWorkbook.Sheets(ThisWorkbook.Sheets.Count))
        newWs.Name = CStr(r)

        ' Filter and copy data for this region:
        ws.AutoFilterMode = False
        ws.Range("A:F").AutoFilter Field:=3, Criteria1:=CStr(r)
        ws.Range("A:F").SpecialCells(xlCellTypeVisible).Copy newWs.Range("A1")
        ws.AutoFilterMode = False
    Next r

    MsgBox "Region sheets created!"
End Sub

' --- Export each sheet as separate PDF ---
Sub ExportSheetsPDF()
    Dim ws As Worksheet
    Dim savePath As String
    savePath = ThisWorkbook.Path & "\"

    For Each ws In ThisWorkbook.Sheets
        ws.ExportAsFixedFormat Type:=xlTypePDF, _
            Filename:=savePath & ws.Name & "_" & Format(Date, "YYYY-MM-DD") & ".pdf"
    Next ws

    MsgBox "PDFs saved to: " & savePath
End Sub
\`\`\`

## Custom Functions (UDFs)

\`\`\`vba
' User Defined Functions — use in cells just like built-in functions

' --- Business day calculation ---
Function BusinessDays(startDate As Date, endDate As Date) As Long
    Dim d As Date
    Dim count As Long
    count = 0
    For d = startDate To endDate
        If Weekday(d, vbMonday) <= 5 Then  ' Monday=1, Friday=5
            count = count + 1
        End If
    Next d
    BusinessDays = count
End Function
' Usage: =BusinessDays(A2, B2)

' --- Categorize revenue ---
Function RevenueCategory(amount As Double) As String
    Select Case amount
        Case Is > 1000000: RevenueCategory = "Enterprise"
        Case Is > 100000:  RevenueCategory = "Mid-Market"
        Case Is > 10000:   RevenueCategory = "SMB"
        Case Else:         RevenueCategory = "Micro"
    End Select
End Function
' Usage: =RevenueCategory(C2)

' --- Regex match (requires reference to Microsoft VBScript Regular Expressions) ---
Function RegexMatch(str As String, pattern As String) As String
    Dim re As Object
    Set re = CreateObject("VBScript.RegExp")
    re.Pattern = pattern
    re.Global = False
    If re.Test(str) Then
        RegexMatch = re.Execute(str)(0).Value
    Else
        RegexMatch = ""
    End If
End Function
' Usage: =RegexMatch(A2, "\\d{5}")  → extracts first 5-digit zip code
\`\`\`

\`\`\`takeaways
["Record a macro first, then read and refactor the code — recording shows you the object model syntax.", "Cells(row, col) is more flexible than Range('A1') — loop row/col numbers instead of hardcoding addresses.", "ws.Cells(ws.Rows.Count, 1).End(xlUp).Row finds the last filled row dynamically — never hardcode row numbers.", "On Error Resume Next before potentially-failing operations, then On Error GoTo 0 to restore error handling.", "UDFs appear in Excel's formula autocomplete — they're the best way to add domain-specific logic to cells.", "ExportAsFixedFormat creates PDFs from any sheet — automate monthly report distribution with one button."]
\`\`\`
`,
    },
  ],
};
