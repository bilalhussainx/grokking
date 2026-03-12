import { Module } from "../types";

export const fileHandlingModule: Module = {
  id: "file-handling",
  title: "File Handling",
  description:
    "Learn to read and write files in Python. Since we are in a browser, we simulate file I/O with string processing.",
  lessons: [
    {
      id: "file-intro",
      slug: "file-io-intro",
      title: "Introduction to File I/O",
      content: `## File I/O in Python

File handling lets your programs read data from files and write results back. In real Python, you use the \`open()\` function.

### Reading a File

\`\`\`python
# Real Python (for reference)
with open("data.txt", "r") as file:
    content = file.read()          # Read entire file
    # or
    lines = file.readlines()       # Read as list of lines
    # or
    for line in file:              # Read line by line
        print(line.strip())
\`\`\`

### Writing a File

\`\`\`python
with open("output.txt", "w") as file:
    file.write("Hello, World!\\n")
    file.write("Second line\\n")
\`\`\`

### The \`with\` Statement

The \`with\` block automatically closes the file when you are done — even if an error occurs. Always use \`with\` for file operations.

### File Modes

| Mode | Description |
|------|-------------|
| \`"r"\` | Read (default) |
| \`"w"\` | Write (creates or overwrites) |
| \`"a"\` | Append (adds to end) |
| \`"r+"\` | Read and write |

### In This Course

Since we run code in a browser, we will **simulate** file I/O by processing multi-line strings. The skills transfer directly to real file handling:

\`\`\`python
# Simulated "file content" as a string
file_content = """Name,Age,City
Alice,30,New York
Bob,25,London"""

# Process it the same way you would a file
lines = file_content.strip().split("\\n")
for line in lines:
    print(line)
\`\`\`

### Common String Methods for File Processing

- \`s.strip()\` — remove leading/trailing whitespace and newlines
- \`s.split("\\n")\` — split into lines
- \`s.split(",")\` — split by comma (CSV parsing)
- \`"\\n".join(lines)\` — combine lines back together`,
    },
    {
      id: "file-csv-parser",
      slug: "csv-parser",
      title: "CSV Parser",
      content: `## CSV Parser

CSV (Comma-Separated Values) is one of the most common data formats. Build a parser that reads CSV data and converts it into structured Python data.

### CSV Format

\`\`\`
Name,Age,City
Alice,30,New York
Bob,25,London
\`\`\`

The first line is usually the **header** (column names). Each subsequent line is a **row** of data.

### Hints

- Split the string into lines with \`.split("\\n")\`
- Split each line by commas with \`.split(",")\`
- Use the header row to create dictionary keys
- Handle edge cases: empty lines, extra whitespace`,
      starterCode: `def parse_csv(csv_string):
    """Parse a CSV string into a list of dictionaries.
    First row is the header. Return list of dicts where
    keys are column names and values are cell values."""
    # TODO: Split into lines, extract headers, build dicts
    pass

def csv_to_table(csv_string):
    """Convert CSV string to a formatted table string.
    Align columns by padding to the widest value in each column.
    Example output:
    Name   | Age | City
    -------|-----|--------
    Alice  | 30  | New York
    """
    # TODO: Parse CSV, find max width per column, format
    pass

def filter_csv(csv_string, column, value):
    """Filter CSV rows where the given column equals the value.
    Return a new CSV string (with header) containing only matching rows."""
    # TODO: Parse, filter, rebuild CSV string
    pass

# Test cases
csv_data = """Name,Age,City
Alice,30,New York
Bob,25,London
Charlie,35,Paris"""

records = parse_csv(csv_data)
print(records)
# Expected: [{'Name': 'Alice', 'Age': '30', 'City': 'New York'}, {'Name': 'Bob', 'Age': '25', 'City': 'London'}, {'Name': 'Charlie', 'Age': '35', 'City': 'Paris'}]

print(records[0]["Name"])
# Expected: Alice

print(records[1]["City"])
# Expected: London

table = csv_to_table(csv_data)
print(table)
# Expected (formatted table with aligned columns):
# Name    | Age | City
# --------|-----|----------
# Alice   | 30  | New York
# Bob     | 25  | London
# Charlie | 35  | Paris

filtered = filter_csv(csv_data, "City", "London")
print(filtered)
# Expected:
# Name,Age,City
# Bob,25,London`,
      solutionCode: `def parse_csv(csv_string):
    """Parse a CSV string into a list of dictionaries."""
    lines = csv_string.strip().split("\\n")
    if len(lines) < 2:
        return []
    headers = lines[0].split(",")
    records = []
    for line in lines[1:]:
        if line.strip() == "":
            continue
        values = line.split(",")
        record = {}
        for i, header in enumerate(headers):
            record[header.strip()] = values[i].strip() if i < len(values) else ""
        records.append(record)
    return records

def csv_to_table(csv_string):
    """Convert CSV string to a formatted table string."""
    lines = csv_string.strip().split("\\n")
    if not lines:
        return ""
    # Parse all rows
    rows = []
    for line in lines:
        rows.append([cell.strip() for cell in line.split(",")])
    # Find max width for each column
    num_cols = len(rows[0])
    widths = [0] * num_cols
    for row in rows:
        for i, cell in enumerate(row):
            if len(cell) > widths[i]:
                widths[i] = len(cell)
    # Format header
    header = " | ".join(cell.ljust(widths[i]) for i, cell in enumerate(rows[0]))
    separator = "-|-".join("-" * widths[i] for i in range(num_cols))
    # Format data rows
    data_lines = []
    for row in rows[1:]:
        data_lines.append(" | ".join(cell.ljust(widths[i]) for i, cell in enumerate(row)))
    return header + "\\n" + separator + "\\n" + "\\n".join(data_lines)

def filter_csv(csv_string, column, value):
    """Filter CSV rows where the given column equals the value.
    Return a new CSV string (with header) containing only matching rows."""
    lines = csv_string.strip().split("\\n")
    if not lines:
        return ""
    headers = [h.strip() for h in lines[0].split(",")]
    col_index = headers.index(column)
    result_lines = [lines[0]]
    for line in lines[1:]:
        cells = [c.strip() for c in line.split(",")]
        if cells[col_index] == value:
            result_lines.append(line)
    return "\\n".join(result_lines)

# Test cases
csv_data = """Name,Age,City
Alice,30,New York
Bob,25,London
Charlie,35,Paris"""

records = parse_csv(csv_data)
print(records)
# Expected: [{'Name': 'Alice', 'Age': '30', 'City': 'New York'}, {'Name': 'Bob', 'Age': '25', 'City': 'London'}, {'Name': 'Charlie', 'Age': '35', 'City': 'Paris'}]

print(records[0]["Name"])
# Expected: Alice

print(records[1]["City"])
# Expected: London

table = csv_to_table(csv_data)
print(table)
# Expected (formatted table with aligned columns):
# Name    | Age | City
# --------|-----|----------
# Alice   | 30  | New York
# Bob     | 25  | London
# Charlie | 35  | Paris

filtered = filter_csv(csv_data, "City", "London")
print(filtered)
# Expected:
# Name,Age,City
# Bob,25,London`,
    },
    {
      id: "file-log-analyzer",
      slug: "log-analyzer",
      title: "Log Analyzer",
      content: `## Log Analyzer

Parse and analyze log entries. Logs are a common data source in real-world programming.

### Log Format

\`\`\`
2024-01-15 10:30:00 INFO User logged in
2024-01-15 10:31:15 ERROR Database connection failed
2024-01-15 10:32:00 WARNING Memory usage high
\`\`\`

Each line has: date, time, level, and message.

### Hints

- Split each line by spaces to extract fields
- The message is everything after the third space
- Use dictionaries to count log levels
- Parse dates as strings (no datetime module needed)`,
      starterCode: `def parse_log(log_string):
    """Parse a log string into a list of dictionaries.
    Each dict has keys: 'date', 'time', 'level', 'message'."""
    # TODO: Split into lines, parse each line
    pass

def count_by_level(log_string):
    """Count log entries by level.
    Return a dict like {'INFO': 3, 'ERROR': 1, 'WARNING': 2}."""
    # TODO: Parse logs and count each level
    pass

def filter_by_level(log_string, level):
    """Return only log entries matching the given level.
    Return as a list of dictionaries."""
    # TODO: Parse and filter
    pass

def error_summary(log_string):
    """Return a summary of ERROR entries.
    Return a list of strings: 'date time: message' for each error."""
    # TODO: Filter for ERROR level and format output
    pass

# Test cases
logs = """2024-01-15 10:30:00 INFO User logged in
2024-01-15 10:31:15 ERROR Database connection failed
2024-01-15 10:32:00 WARNING Memory usage high
2024-01-15 10:33:00 INFO File uploaded successfully
2024-01-15 10:34:00 ERROR Disk space critical
2024-01-15 10:35:00 INFO User logged out"""

entries = parse_log(logs)
print(entries[0])
# Expected: {'date': '2024-01-15', 'time': '10:30:00', 'level': 'INFO', 'message': 'User logged in'}

print(entries[1])
# Expected: {'date': '2024-01-15', 'time': '10:31:15', 'level': 'ERROR', 'message': 'Database connection failed'}

print(count_by_level(logs))
# Expected: {'INFO': 3, 'ERROR': 2, 'WARNING': 1}

errors = filter_by_level(logs, "ERROR")
print(len(errors))
# Expected: 2
print(errors[0]["message"])
# Expected: Database connection failed

print(error_summary(logs))
# Expected: ['2024-01-15 10:31:15: Database connection failed', '2024-01-15 10:34:00: Disk space critical']`,
      solutionCode: `def parse_log(log_string):
    """Parse a log string into a list of dictionaries.
    Each dict has keys: 'date', 'time', 'level', 'message'."""
    entries = []
    for line in log_string.strip().split("\\n"):
        if not line.strip():
            continue
        parts = line.split(" ", 3)
        entries.append({
            'date': parts[0],
            'time': parts[1],
            'level': parts[2],
            'message': parts[3] if len(parts) > 3 else "",
        })
    return entries

def count_by_level(log_string):
    """Count log entries by level.
    Return a dict like {'INFO': 3, 'ERROR': 1, 'WARNING': 2}."""
    entries = parse_log(log_string)
    counts = {}
    for entry in entries:
        level = entry['level']
        counts[level] = counts.get(level, 0) + 1
    return counts

def filter_by_level(log_string, level):
    """Return only log entries matching the given level.
    Return as a list of dictionaries."""
    entries = parse_log(log_string)
    return [e for e in entries if e['level'] == level]

def error_summary(log_string):
    """Return a summary of ERROR entries.
    Return a list of strings: 'date time: message' for each error."""
    errors = filter_by_level(log_string, "ERROR")
    return [f"{e['date']} {e['time']}: {e['message']}" for e in errors]

# Test cases
logs = """2024-01-15 10:30:00 INFO User logged in
2024-01-15 10:31:15 ERROR Database connection failed
2024-01-15 10:32:00 WARNING Memory usage high
2024-01-15 10:33:00 INFO File uploaded successfully
2024-01-15 10:34:00 ERROR Disk space critical
2024-01-15 10:35:00 INFO User logged out"""

entries = parse_log(logs)
print(entries[0])
# Expected: {'date': '2024-01-15', 'time': '10:30:00', 'level': 'INFO', 'message': 'User logged in'}

print(entries[1])
# Expected: {'date': '2024-01-15', 'time': '10:31:15', 'level': 'ERROR', 'message': 'Database connection failed'}

print(count_by_level(logs))
# Expected: {'INFO': 3, 'ERROR': 2, 'WARNING': 1}

errors = filter_by_level(logs, "ERROR")
print(len(errors))
# Expected: 2
print(errors[0]["message"])
# Expected: Database connection failed

print(error_summary(logs))
# Expected: ['2024-01-15 10:31:15: Database connection failed', '2024-01-15 10:34:00: Disk space critical']`,
    },
    {
      id: "file-data-formatter",
      slug: "data-formatter",
      title: "Data Formatter",
      content: `## Data Formatter

Build utilities to convert data between different text formats: CSV, JSON-like strings, and plain text tables.

### Formats

- **CSV**: Comma-separated values with header row
- **Key-Value**: Lines like \`key: value\`
- **Table**: Aligned columns with borders

### Hints

- Each format has its own parsing and generation logic
- Reuse your CSV parser from the previous lesson
- Think about what information each format needs`,
      starterCode: `def csv_to_key_value(csv_string):
    """Convert CSV data to key-value format.
    Each record becomes a block separated by blank lines.
    Example output:
    Name: Alice
    Age: 30
    City: New York

    Name: Bob
    Age: 25
    City: London
    """
    # TODO: Parse CSV headers and rows, format as key-value pairs
    pass

def key_value_to_dict(kv_string):
    """Parse a key-value string (single record) into a dictionary.
    Input format: 'Name: Alice\\nAge: 30\\nCity: New York'"""
    # TODO: Split by newlines, split each line by ': '
    pass

def dict_to_csv(records):
    """Convert a list of dictionaries to CSV string.
    Use the keys of the first dict as headers."""
    # TODO: Extract headers, format rows
    pass

def format_report(title, data, columns):
    """Create a formatted text report.
    title: report title
    data: list of dictionaries
    columns: list of column names to include

    Output format:
    === REPORT TITLE ===
    Col1    | Col2   | Col3
    --------|--------|--------
    val1    | val2   | val3
    ========================
    Total records: N
    """
    # TODO: Build the formatted report string
    pass

# Test cases
csv_data = """Name,Age,City
Alice,30,New York
Bob,25,London"""

print(csv_to_key_value(csv_data))
# Expected:
# Name: Alice
# Age: 30
# City: New York
#
# Name: Bob
# Age: 25
# City: London

kv = "Name: Alice\\nAge: 30\\nCity: New York"
print(key_value_to_dict(kv))
# Expected: {'Name': 'Alice', 'Age': '30', 'City': 'New York'}

records = [
    {"Name": "Alice", "Age": "30", "City": "New York"},
    {"Name": "Bob", "Age": "25", "City": "London"}
]
print(dict_to_csv(records))
# Expected:
# Name,Age,City
# Alice,30,New York
# Bob,25,London

print(format_report("Employee List", records, ["Name", "Age", "City"]))
# Expected:
# === Employee List ===
# Name  | Age | City
# ------|-----|----------
# Alice | 30  | New York
# Bob   | 25  | London
# =====================
# Total records: 2`,
      solutionCode: `def csv_to_key_value(csv_string):
    """Convert CSV data to key-value format."""
    lines = csv_string.strip().split("\\n")
    headers = [h.strip() for h in lines[0].split(",")]
    blocks = []
    for line in lines[1:]:
        if not line.strip():
            continue
        values = [v.strip() for v in line.split(",")]
        pairs = []
        for i, header in enumerate(headers):
            val = values[i] if i < len(values) else ""
            pairs.append(f"{header}: {val}")
        blocks.append("\\n".join(pairs))
    return "\\n\\n".join(blocks)

def key_value_to_dict(kv_string):
    """Parse a key-value string (single record) into a dictionary."""
    result = {}
    for line in kv_string.strip().split("\\n"):
        if ": " in line:
            key, value = line.split(": ", 1)
            result[key.strip()] = value.strip()
    return result

def dict_to_csv(records):
    """Convert a list of dictionaries to CSV string."""
    if not records:
        return ""
    headers = list(records[0].keys())
    lines = [",".join(headers)]
    for record in records:
        row = [str(record.get(h, "")) for h in headers]
        lines.append(",".join(row))
    return "\\n".join(lines)

def format_report(title, data, columns):
    """Create a formatted text report."""
    # Calculate column widths
    widths = {col: len(col) for col in columns}
    for record in data:
        for col in columns:
            val = str(record.get(col, ""))
            if len(val) > widths[col]:
                widths[col] = len(val)

    # Build header
    header_line = " | ".join(col.ljust(widths[col]) for col in columns)
    separator = "-|-".join("-" * widths[col] for col in columns)
    total_width = len(header_line)

    lines = []
    lines.append(f"=== {title} ===")
    lines.append(header_line)
    lines.append(separator)

    for record in data:
        row = " | ".join(str(record.get(col, "")).ljust(widths[col]) for col in columns)
        lines.append(row)

    lines.append("=" * total_width)
    lines.append(f"Total records: {len(data)}")

    return "\\n".join(lines)

# Test cases
csv_data = """Name,Age,City
Alice,30,New York
Bob,25,London"""

print(csv_to_key_value(csv_data))
# Expected:
# Name: Alice
# Age: 30
# City: New York
#
# Name: Bob
# Age: 25
# City: London

kv = "Name: Alice\\nAge: 30\\nCity: New York"
print(key_value_to_dict(kv))
# Expected: {'Name': 'Alice', 'Age': '30', 'City': 'New York'}

records = [
    {"Name": "Alice", "Age": "30", "City": "New York"},
    {"Name": "Bob", "Age": "25", "City": "London"}
]
print(dict_to_csv(records))
# Expected:
# Name,Age,City
# Alice,30,New York
# Bob,25,London

print(format_report("Employee List", records, ["Name", "Age", "City"]))
# Expected:
# === Employee List ===
# Name  | Age | City
# ------|-----|----------
# Alice | 30  | New York
# Bob   | 25  | London
# =====================
# Total records: 2`,
    },
  ],
};
