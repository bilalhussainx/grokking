import { Module } from "../types";

export const stringsInDepthModule: Module = {
  id: "strings-in-depth",
  title: "String Manipulation in Depth",
  description: "Explore Python's powerful string operations: indexing, slicing, formatting, and the most useful built-in string methods.",
  lessons: [
    {
      id: "string-indexing-slicing",
      slug: "string-indexing-slicing",
      title: "String Indexing and Slicing",
      content: `# String Indexing and Slicing

Every character in a Python string lives at a numbered address — its **index**. Once you know how to read those addresses, you can pinpoint any character or carve out any substring in a single, readable expression. This lesson walks you from individual-character access all the way to the powerful \`[start:stop:step]\` slice syntax — the same tool professionals use to parse log files, preprocess NLP text, and scrape HTML.

---

## Part 1 — Indexing: Addressing Individual Characters

Python strings are **ordered sequences**. The string \`"Python"\` is just six characters stored in a fixed order, each with its own numeric index.

\`\`\`concept
{ "title": "Zero-Based Indexing", "variant": "mental-model", "content": "Python starts counting at 0, not 1. Think of the index as the number of steps from the front door. 'P' is 0 steps away (you're already there). 'y' is 1 step away. The last character is always at index len(s) - 1." }
\`\`\`

### Positive and Negative Indices

Python gives every character **two valid addresses**: a positive index from the left, and a negative index from the right.

\`\`\`algoviz
{ "title": "Indices of 'Python' — positive (top) and negative (bottom)", "type": "array", "data": ["P", "y", "t", "h", "o", "n"], "frames": [ { "highlight": [0], "label": "Index 0 → 'P'  |  Index -6 → 'P' (same slot, two names)", "stats": {"positive": 0, "negative": -6} }, { "highlight": [1], "label": "Index 1 → 'y'  |  Index -5 → 'y'", "stats": {"positive": 1, "negative": -5} }, { "highlight": [2], "label": "Index 2 → 't'  |  Index -4 → 't'", "stats": {"positive": 2, "negative": -4} }, { "highlight": [3], "label": "Index 3 → 'h'  |  Index -3 → 'h'", "stats": {"positive": 3, "negative": -3} }, { "highlight": [4], "label": "Index 4 → 'o'  |  Index -2 → 'o'", "stats": {"positive": 4, "negative": -2} }, { "highlight": [5], "label": "Index 5 → 'n'  |  Index -1 → 'n' (last character is always -1)", "stats": {"positive": 5, "negative": -1} } ], "speed": 900 }
\`\`\`

The rule for negative indices: \`negative_index = positive_index - len(string)\`. So for a 6-character string, index \`5\` and index \`-1\` are the same slot.

\`\`\`playground
{ "title": "Try It: Positive and Negative Indexing", "language": "python", "code": "word = \\"Python\\"\\n\\n# Positive indexing\\nprint(word[0])   # First character\\nprint(word[2])   # Third character\\nprint(word[5])   # Last character\\n\\n# Negative indexing (count from the right)\\nprint(word[-1])  # Last character\\nprint(word[-2])  # Second-to-last\\nprint(word[-6])  # Same as word[0]\\n\\n# Experimenting with your own string\\nname = \\"Alice\\"\\nprint(name[0], name[-1])  # First and last", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "IndexError: Out-of-Range Indexing", "content": "Accessing an index that doesn't exist raises an \`IndexError\`. For \`\\"Python\\"\` (length 6), valid positive indices are 0–5. \`word[6]\` or \`word[-7]\` will crash. Slicing, however, handles out-of-range gracefully — more on that below." }
\`\`\`

---

## Part 2 — Slicing: Extracting Substrings

Indexing gives you one character. **Slicing** gives you a range of characters — a substring — using the syntax \`s[start:stop:step]\`.

\`\`\`concept
{ "title": "The Slicing Rule: start is inclusive, stop is exclusive", "variant": "rule", "content": "s[start:stop] extracts characters at positions start, start+1, ..., stop-1. The character AT stop is NEVER included. Think of stop as a fence post: you collect everything up to the fence, but not the fence itself." }
\`\`\`

### Anatomy of a Slice

| Part | Default | Meaning |
|------|---------|---------|
| \`start\` | \`0\` | First index to include |
| \`stop\` | \`len(s)\` | First index to **exclude** |
| \`step\` | \`1\` | Gap between selected indices |

Let's trace exactly what happens when Python evaluates \`s[1:4]\` on \`"Python"\`:

\`\`\`trace
{ "title": "Tracing s[1:4] on 'Python'", "language": "python", "code": "s = \\"Python\\"\\nstart = 1\\nend = 4\\nresult = s[start:end]\\nprint(result)", "frames": [ { "line": 1, "vars": {"s": "Python"}, "note": "Bind the string 'Python' to s." }, { "line": 2, "vars": {"s": "Python", "start": 1}, "note": "start = 1, pointing at 'y'." }, { "line": 3, "vars": {"s": "Python", "start": 1, "end": 4}, "note": "end = 4, pointing PAST 'h' (exclusive boundary)." }, { "line": 4, "vars": {"s": "Python", "start": 1, "end": 4, "result": "yth"}, "note": "Collect indices 1 ('y'), 2 ('t'), 3 ('h'). Stop before index 4." }, { "line": 5, "vars": {"s": "Python", "start": 1, "end": 4, "result": "yth"}, "note": "Print the new string 'yth'. Original s is unchanged.", "stdout": "yth" } ], "speed": 950 }
\`\`\`

### Omitting Parts of the Slice

\`\`\`tabs
{ "tabs": [ { "label": "Omit start", "icon": "⬅️", "content": "When you omit \`start\`, Python uses **0** — the very beginning.\\n\\n\`\`\`python\\ns = \\"Python\\"\\nprint(s[:3])   # 'Pyt' — indices 0, 1, 2\\nprint(s[:1])   # 'P'   — just the first character\\nprint(s[:])    # 'Python' — full copy of the string\\n\`\`\`\\n\\nUseful for getting a **prefix** of a string." }, { "label": "Omit stop", "icon": "➡️", "content": "When you omit \`stop\`, Python goes **all the way to the end**.\\n\\n\`\`\`python\\ns = \\"Python\\"\\nprint(s[3:])   # 'hon' — from index 3 to the end\\nprint(s[-2:])  # 'on'  — last two characters\\n\`\`\`\\n\\nUseful for getting a **suffix** or trimming a known-length prefix." }, { "label": "Use step", "icon": "🔢", "content": "The optional \`step\` controls how many indices to skip between picks.\\n\\n\`\`\`python\\ns = \\"Python\\"\\nprint(s[::2])    # 'Pto'  — every 2nd character\\nprint(s[::1])    # 'Python' — same as s[:]\\nprint(s[::-1])   # 'nohtyP' — reverse the string!\\nprint(s[1:5:2])  # 'yh'   — indices 1, 3\\n\`\`\`\\n\\nA step of **-1** is the classic Python idiom to **reverse** a string." }, { "label": "Negative indices in slices", "icon": "⬆️", "content": "You can mix positive and negative indices freely:\\n\\n\`\`\`python\\ns = \\"Python\\"\\nprint(s[-4:-1])  # 'tho' — from 4th-last up to (not including) last\\nprint(s[-3:])    # 'hon' — last three characters\\nprint(s[:-2])    # 'Pyth' — everything except the last two\\n\`\`\`\\n\\nNegative indices count from the **right**, so \`-1\` is the last character." } ] }
\`\`\`

\`\`\`playground
{ "title": "Experiment: All Forms of Slicing", "language": "python", "code": "s = \\"Hello, World!\\"\\n\\n# Basic slices\\nprint(s[0:5])    # 'Hello'\\nprint(s[7:12])   # 'World'\\nprint(s[-6:-1])  # 'World'\\n\\n# Omitting parts\\nprint(s[:5])     # 'Hello' (omit start)\\nprint(s[7:])     # 'World!' (omit stop)\\nprint(s[:])      # Full copy\\n\\n# Using step\\nprint(s[::2])    # Every other character\\nprint(s[::-1])   # Reversed string\\n\\n# Out-of-bounds slicing (no error!)\\nprint(s[0:999])  # Just returns the whole string gracefully", "runnable": true }
\`\`\`

---

## Part 3 — Immutability: Slices Create, Never Modify

This is the single most important rule about strings in Python:

\`\`\`concept
{ "title": "Strings Are Immutable", "variant": "insight", "content": "You cannot change a character inside an existing string. Slicing and indexing always return a **new** string — the original is untouched. Attempting \`s[0] = 'J'\` raises a TypeError. To 'change' a string, build a new one from its parts." }
\`\`\`

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "TypeError — trying to mutate in place", "code": "name = \\"Python\\"\\nname[0] = \\"J\\"   # TypeError!\\n# TypeError: 'str' object does not support item assignment" }, "after": { "label": "Correct — build a new string from slices", "code": "name = \\"Python\\"\\nnew_name = \\"J\\" + name[1:]   # 'Jython'\\nprint(new_name)   # Jython\\nprint(name)       # Python — unchanged!" } }
\`\`\`

Notice that \`name[1:]\` extracts everything from index 1 onward. The original \`name\` is never touched. This immutability makes strings safe to share and predictable to reason about.

---

## Part 4 — Real-World Practice

### Parsing a Log Timestamp

Many log files embed timestamps at a fixed position. Slicing lets you extract fields without any library:

\`\`\`playground
{ "title": "Real World: Parse a Log Line", "language": "python", "code": "# Log line format: \\"2026-04-13 14:32:07 ERROR Connection refused\\"\\nlog = \\"2026-04-13 14:32:07 ERROR Connection refused\\"\\n\\nyear  = log[0:4]\\nmonth = log[5:7]\\nday   = log[8:10]\\ntime  = log[11:19]\\nlevel = log[20:25].strip()\\nmsg   = log[26:]\\n\\nprint(f\\"Date: {year}-{month}-{day}\\")\\nprint(f\\"Time: {time}\\")\\nprint(f\\"Level: {level}\\")\\nprint(f\\"Message: {msg}\\")", "runnable": true }
\`\`\`

### Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the Slicing Expressions", "prompt": "Fill in the blanks so each slice returns the expected result from \`s = \\"DataScience\\"\`.", "language": "python", "template": "s = \\"DataScience\\"\\n\\n# 1. Extract 'Data' (indices 0-3)\\nprint(s[___:___])\\n\\n# 2. Extract 'Science' (from index 4 to end)\\nprint(s[___:])\\n\\n# 3. Extract every second character from the whole string\\nprint(s[::___])\\n\\n# 4. Reverse the string\\nprint(s[::-1])", "blanks": [ { "answer": "0", "hint": "Start at the very beginning." }, { "answer": "4", "hint": "The end index is exclusive, so stop just past 'a' at index 3." }, { "answer": "4", "hint": "Where does 'Science' begin?" }, { "answer": "2", "hint": "Skip every other character — what step value does that?" }, { "answer": "-1", "hint": "A step of -1 walks backwards through the string." } ] }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "String Indexing and Slicing Quiz", "questions": [ { "question": "Given \`s = \\"abcdef\\"\`, what does \`s[2]\` return?", "options": ["'a'", "'b'", "'c'", "'d'"], "answer": 2, "explanation": "Python uses zero-based indexing. Index 0 is 'a', index 1 is 'b', index 2 is 'c'." }, { "question": "Given \`s = \\"abcdef\\"\`, what does \`s[1:4]\` return?", "options": ["'abc'", "'bcd'", "'bcde'", "'abcd'"], "answer": 1, "explanation": "s[1:4] includes indices 1, 2, 3 — that is 'b', 'c', 'd'. The stop index 4 is excluded." }, { "question": "Given \`s = \\"Hello\\"\`, what is \`s[-1]\`?", "options": ["'H'", "'e'", "'l'", "'o'"], "answer": 3, "explanation": "Negative index -1 always refers to the last character. 'Hello' has 5 characters; index -1 is 'o'." }, { "question": "What happens when you run \`s = \\"Hi\\"; s[0] = \\"J\\"\`?", "options": ["s becomes 'Ji'", "Python ignores the assignment silently", "A TypeError is raised because strings are immutable", "A ValueError is raised"], "answer": 2, "explanation": "Python strings are immutable. You cannot assign to a character position. The correct approach is to build a new string: \`s = 'J' + s[1:]\`." }, { "question": "Given \`s = \\"Python\\"\`, what does \`s[::-1]\` return?", "options": ["'Python'", "'nohtyP'", "'Pytho'", "'ython'"], "answer": 1, "explanation": "A step of -1 traverses the string from right to left, effectively reversing it. \`s[::-1]\` returns 'nohtyP'." }, { "question": "Given \`s = \\"abcdef\\"\`, what does \`s[2:100]\` return?", "options": ["An IndexError", "'cdef'", "'abcde'", "An empty string"], "answer": 1, "explanation": "Unlike indexing, slicing gracefully handles out-of-range stop values. Python simply returns as much of the string as exists — from index 2 to the end: 'cdef'." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Python strings use zero-based indexing: the first character is at index 0, the last at index -1.", "Positive indices count from the left; negative indices count from the right — both address the same slots.", "The slice syntax is s[start:stop:step]: start is inclusive, stop is exclusive, step controls the gap.", "Omitting start defaults to 0, omitting stop defaults to len(s), omitting step defaults to 1.", "s[::-1] reverses a string — a standard Python idiom.", "Strings are immutable: slicing creates a new string; you cannot modify characters in place.", "Out-of-bounds slicing never raises an error — Python adjusts silently. Out-of-bounds indexing raises IndexError." ] }
\`\`\``,
      starterCode: `# String Indexing and Slicing Practice
# Work through each TODO to master string access patterns

text = "Hello, World!"

# TODO 1: Access the first character using positive indexing
first_char = None

# TODO 2: Access the last character using negative indexing
last_char = None

# TODO 3: Extract the word "Hello" using slicing (characters 0-4)
hello = None

# TODO 4: Extract the word "World" using slicing
world = None

# TODO 5: Reverse the entire string using a step slice
reversed_text = None

# TODO 6: Extract every other character from the full string
every_other = None

# TODO 7: Extract "World!" using negative indexing in your slice
world_neg = None

# --- Do not modify below this line ---
print(f"First char: {first_char}")        # H
print(f"Last char: {last_char}")          # !
print(f"Hello: {hello}")                  # Hello
print(f"World: {world}")                  # World
print(f"Reversed: {reversed_text}")       # !dlroW ,olleH
print(f"Every other: {every_other}")      # Hlo ol!
print(f"World (neg): {world_neg}")        # World!
`,
      solutionCode: `# String Indexing and Slicing — Complete Solution

text = "Hello, World!"

# Positive index: 0 is the first character
first_char = text[0]          # 'H'

# Negative index: -1 is the last character
last_char = text[-1]          # '!'

# Slice [start:stop] — stop is exclusive, so [0:5] gives indices 0,1,2,3,4
hello = text[0:5]             # 'Hello'

# 'World' starts at index 7 and ends at index 11 (inclusive), so stop=12
world = text[7:12]            # 'World'

# Slice with step -1 reverses the string: [start:stop:step]
# Omitting start and stop means "the whole string"
reversed_text = text[::-1]    # '!dlroW ,olleH'

# Step of 2 skips every other character
every_other = text[::2]       # 'Hlo ol!'

# Negative index in slice: -6 points to 'W' (6 chars from the end)
world_neg = text[-6:]         # 'World!'

# --- Output ---
print(f"First char: {first_char}")        # H
print(f"Last char: {last_char}")          # !
print(f"Hello: {hello}")                  # Hello
print(f"World: {world}")                  # World
print(f"Reversed: {reversed_text}")       # !dlroW ,olleH
print(f"Every other: {every_other}")      # Hlo ol!
print(f"World (neg): {world_neg}")        # World!
`,
    },
    {
      id: "string-methods",
      slug: "string-methods",
      title: "Essential String Methods",
      content: `# Essential String Methods

Strings in Python are more than just text — they come loaded with a powerful toolkit of built-in methods that let you transform, search, split, and assemble text with a single function call. In this lesson you'll master the methods you'll reach for every single day as a Python programmer.

\`\`\`concept
{ "title": "Methods vs Functions", "variant": "mental-model", "content": "A method is a function that belongs to an object. You call it with dot notation: \`string.method()\`. String methods never modify the original string — they always return a new one. Strings in Python are immutable." }
\`\`\`

---

## The Anatomy of a String Method Call

\`\`\`
\\"  hello, world  \\".strip().upper()
 ^                   ^       ^
 the string       method   chained method
\`\`\`

You can chain methods left to right — each method runs on the result of the previous one. This is one of Python's most readable patterns.

---

## Case Methods: \`upper()\`, \`lower()\`, \`capitalize()\`, \`title()\`

These four methods transform how characters are cased. None of them take arguments.

| Method | What it does | Example |
|---|---|---|
| \`.upper()\` | All characters → uppercase | \`"hello"\` → \`"HELLO"\` |
| \`.lower()\` | All characters → lowercase | \`"HELLO"\` → \`"hello"\` |
| \`.capitalize()\` | First char uppercase, rest lowercase | \`"hELLO"\` → \`"Hello"\` |
| \`.title()\` | First char of **each word** uppercase | \`"hello world"\` → \`"Hello World"\` |

\`\`\`playground
{ "title": "Case Methods in Action", "language": "python", "code": "name = \\"  alice SMITH  \\"\\n\\nprint(name.upper())       # All caps\\nprint(name.lower())       # All lowercase\\nprint(name.strip())       # Remove surrounding spaces first\\nprint(name.strip().title())  # Clean, then title-case\\n\\n# Real-world use: normalize user input before comparing\\nuser_input = \\"YES\\"\\nif user_input.lower() == \\"yes\\":\\n    print(\\"User agreed!\\")", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Always normalize before comparing", "content": "When checking user input or data from files, call \`.lower()\` or \`.upper()\` on both sides of the comparison so \`\\"Yes\\"\`, \`\\"YES\\"\`, and \`\\"yes\\"\` all match." }
\`\`\`

---

## Whitespace Methods: \`strip()\`, \`lstrip()\`, \`rstrip()\`

Real-world data is messy. Strings from user input, files, or APIs often carry extra spaces, newlines (\`\\n\`), or tabs (\`\\t\`) at the edges. The strip family removes them.

\`\`\`tabs
{ "tabs": [ { "label": "strip()", "icon": "✂️", "content": "Removes whitespace from **both** ends.\\n\\n\`\`\`python\\n\\"  hello  \\".strip()   # → 'hello'\\n\\"\\\\n\\\\thello\\\\n\\".strip() # → 'hello'\\n\`\`\`\\n\\nYou can also pass a string of characters to remove:\\n\`\`\`python\\n\\"###title###\\".strip(\\"#\\")  # → 'title'\\n\`\`\`" }, { "label": "lstrip()", "icon": "⬅️", "content": "Removes whitespace from the **left** (start) only.\\n\\n\`\`\`python\\n\\"  hello  \\".lstrip()  # → 'hello  '\\n\`\`\`" }, { "label": "rstrip()", "icon": "➡️", "content": "Removes whitespace from the **right** (end) only.\\n\\n\`\`\`python\\n\\"  hello  \\".rstrip()  # → '  hello'\\n\`\`\`\\n\\nCommonly used when reading lines from a file:\\n\`\`\`python\\nfor line in open(\\"data.txt\\"):\\n    line = line.rstrip(\\"\\\\n\\")  # remove trailing newline\\n\`\`\`" } ] }
\`\`\`

---

## Searching: \`find()\`, \`index()\`, \`count()\`

These methods let you locate substrings or count their occurrences.

\`\`\`concept
{ "title": "find() vs index()", "variant": "rule", "content": "\`find()\` returns \`-1\` when the substring is not found. \`index()\` raises a \`ValueError\`. Use \`find()\` when absence is expected and you want to handle it gracefully; use \`index()\` when absence is a bug." }
\`\`\`

\`\`\`trace
{ "title": "Tracing find() Step by Step", "language": "python", "code": "sentence = \\"the cat sat on the mat\\"\\npos = sentence.find(\\"cat\\")\\nprint(pos)\\n\\nnot_found = sentence.find(\\"dog\\")\\nprint(not_found)\\n\\ncount = sentence.count(\\"at\\")\\nprint(count)", "frames": [ { "line": 1, "vars": { "sentence": "\\"the cat sat on the mat\\"" }, "note": "String assigned to variable", "stdout": "" }, { "line": 2, "vars": { "sentence": "\\"the cat sat on the mat\\"", "pos": "?" }, "note": "Python scans left-to-right for 'cat'", "stdout": "" }, { "line": 3, "vars": { "sentence": "\\"the cat sat on the mat\\"", "pos": 4 }, "note": "'cat' starts at index 4 — printed", "stdout": "4" }, { "line": 5, "vars": { "sentence": "\\"the cat sat on the mat\\"", "pos": 4, "not_found": "?" }, "note": "'dog' is not in the string", "stdout": "4" }, { "line": 6, "vars": { "sentence": "\\"the cat sat on the mat\\"", "pos": 4, "not_found": -1 }, "note": "find() returns -1 on failure", "stdout": "4\\n-1" }, { "line": 8, "vars": { "sentence": "\\"the cat sat on the mat\\"", "pos": 4, "not_found": -1, "count": 3 }, "note": "'at' appears in c**at**, s**at**, m**at** — 3 times", "stdout": "4\\n-1\\n3" } ], "speed": 900 }
\`\`\`

---

## Checking Boundaries: \`startswith()\` and \`endswith()\`

These are your go-to methods for checking file extensions, URL prefixes, command prefixes, and more. They return \`True\` or \`False\`.

\`\`\`python
filename = "report_2024.pdf"

filename.endswith(".pdf")      # True
filename.endswith(".csv")      # False
filename.startswith("report")  # True

# You can pass a tuple to check multiple options at once:
filename.endswith((".pdf", ".docx", ".txt"))  # True — matches .pdf
\`\`\`

\`\`\`playground
{ "title": "File Type Filter", "language": "python", "code": "files = [\\n    \\"budget.xlsx\\",\\n    \\"notes.txt\\",\\n    \\"photo.jpg\\",\\n    \\"report.pdf\\",\\n    \\"data.csv\\",\\n    \\"image.png\\"\\n]\\n\\nimage_files = [f for f in files if f.endswith((\\".jpg\\", \\".png\\", \\".gif\\"))]\\ndoc_files   = [f for f in files if f.endswith((\\".pdf\\", \\".txt\\", \\".xlsx\\"))]\\n\\nprint(\\"Images:\\", image_files)\\nprint(\\"Documents:\\", doc_files)", "runnable": true }
\`\`\`

---

## Transform: \`replace()\`

\`replace(old, new)\` returns a new string with every occurrence of \`old\` swapped for \`new\`. Pass a third argument to limit how many replacements happen.

\`\`\`python
text = "I like cats. Cats are great. I have two cats."

text.replace("cats", "dogs")
# → "I like dogs. Cats are great. I have two dogs."
# Note: case-sensitive! "Cats" was not replaced.

text.replace("cats", "dogs", 1)
# → "I like dogs. Cats are great. I have two cats."
# Only the first match replaced.
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "replace() is case-sensitive", "content": "\`\\"Hello\\".replace(\\"hello\\", \\"Hi\\")\` returns \`\\"Hello\\"\` unchanged. To do case-insensitive replacement, lower the string first, or use the \`re\` module for regex-powered replacement." }
\`\`\`

---

## Split and Join: The Dynamic Duo

\`split()\` and \`join()\` are inverses of each other. Together they let you shuttle text between string form and list form.

\`\`\`steps
{ "title": "How split() and join() Work Together", "steps": [ { "title": "split() — string → list", "content": "\`.split(separator)\` breaks a string into a list at every occurrence of the separator.\\n\\n\`\`\`python\\n\\"alice,bob,carol\\".split(\\",\\")  # ['alice', 'bob', 'carol']\\n\\"one two three\\".split()      # ['one', 'two', 'three'] (any whitespace)\\n\`\`\`\\n\\nWith no argument, \`split()\` splits on any whitespace and discards empty strings — great for cleaning messy input." }, { "title": "Process the list", "content": "Once you have a list, you can sort it, filter it, transform individual items, or slice it:\\n\\n\`\`\`python\\nwords = \\"the quick brown fox\\".split()\\nwords.sort()\\n# ['brown', 'fox', 'quick', 'the']\\n\`\`\`" }, { "title": "join() — list → string", "content": "\`.join(iterable)\` glues a list of strings back together with the calling string as the separator.\\n\\n\`\`\`python\\nwords = ['brown', 'fox', 'quick', 'the']\\n\\", \\".join(words)   # 'brown, fox, quick, the'\\n\\" | \\".join(words)  # 'brown | fox | quick | the'\\n\\"\\".join(words)     # 'brownfoxquickthe'\\n\`\`\`\\n\\n**Note:** \`join()\` is called on the separator, not the list. This is the one part that trips beginners up." } ] }
\`\`\`

\`\`\`algoviz
{ "title": "Visualizing split() on a CSV line", "type": "array", "data": ["alice", ",", "30", ",", "engineer", ",", "london"], "frames": [ { "highlight": [], "label": "Start: raw CSV string 'alice,30,engineer,london'", "stats": { "sep": "\\",\\"", "result": "[]" } }, { "highlight": [1], "label": "Found separator ',' at position 1 — cut here", "stats": { "sep": "\\",\\"", "result": "[\\"alice\\"]" } }, { "highlight": [3], "label": "Found separator ',' at position 3 — cut again", "stats": { "sep": "\\",\\"", "result": "[\\"alice\\", \\"30\\"]" } }, { "highlight": [5], "label": "Found separator ',' at position 5 — cut again", "stats": { "sep": "\\",\\"", "result": "[\\"alice\\", \\"30\\", \\"engineer\\"]" } }, { "highlight": [6], "label": "End of string — collect last piece", "stats": { "sep": "\\",\\"", "result": "[\\"alice\\", \\"30\\", \\"engineer\\", \\"london\\"]" } } ], "speed": 900 }
\`\`\`

\`\`\`playground
{ "title": "split() + join() Pipeline", "language": "python", "code": "# Parse a CSV line, clean up names, re-export\\ncsv_line = \\"  Alice  ,  Bob  ,  Carol  \\"\\n\\n# Step 1: split on comma\\nparts = csv_line.split(\\",\\")\\nprint(\\"After split:\\", parts)\\n\\n# Step 2: strip each name\\nclean = [name.strip() for name in parts]\\nprint(\\"After strip:\\", clean)\\n\\n# Step 3: join back with ' | ' separator\\nresult = \\" | \\".join(clean)\\nprint(\\"Final:\\", result)\\n\\n# Bonus: count unique words in a sentence\\nsentence = \\"to be or not to be that is the question\\"\\nwords = sentence.split()\\nunique = set(words)\\nprint(f\\"\\\\n{len(words)} words, {len(unique)} unique\\")", "runnable": true }
\`\`\`

---

## Quick Reference: Other Useful Methods

| Method | Returns | Example |
|---|---|---|
| \`.isdigit()\` | \`True\` if all chars are digits | \`"123".isdigit()\` → \`True\` |
| \`.isalpha()\` | \`True\` if all chars are letters | \`"abc".isalpha()\` → \`True\` |
| \`.isspace()\` | \`True\` if all chars are whitespace | \`"   ".isspace()\` → \`True\` |
| \`.zfill(width)\` | Pads with leading zeros | \`"42".zfill(5)\` → \`"00042"\` |
| \`.center(width)\` | Centers in a field of spaces | \`"hi".center(10)\` → \`"    hi    "\` |
| \`.swapcase()\` | Flips case of every char | \`"Hello".swapcase()\` → \`"hELLO"\` |

\`\`\`collapse
{ "title": "Deep Dive: How find() handles optional start/end arguments", "content": "\`find(sub, start, end)\` accepts optional \`start\` and \`end\` index arguments, so you can search within a slice of the string without creating a new string object.\\n\\n\`\`\`python\\ntext = \\"cat and cat and cat\\"\\n\\ntext.find(\\"cat\\")        # 0  — first match from the beginning\\ntext.find(\\"cat\\", 1)     # 8  — search from index 1 onward\\ntext.find(\\"cat\\", 9)     # 16 — search from index 9 onward\\ntext.find(\\"cat\\", 17)    # -1 — no match after index 17\\n\`\`\`\\n\\nThis is useful when you want to find all non-overlapping occurrences with a loop:\\n\\n\`\`\`python\\ntext = \\"abcabcabc\\"\\nstart = 0\\npositions = []\\nwhile True:\\n    pos = text.find(\\"abc\\", start)\\n    if pos == -1:\\n        break\\n    positions.append(pos)\\n    start = pos + 1\\nprint(positions)  # [0, 3, 6]\\n\`\`\`" }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the String Pipeline", "prompt": "Write a function that takes a messy comma-separated string of names and returns them cleaned, sorted, and joined with ' and '.", "language": "python", "template": "def clean_names(raw):\\n    parts = raw.___(___)\\n    cleaned = [name.___() for name in parts]\\n    cleaned.___()\\n    return ___.join(cleaned)\\n\\nprint(clean_names(\\" alice , BOB,  carol \\"))\\n# Expected: 'Alice and Bob and Carol'", "blanks": [ { "answer": "split", "hint": "Break the string into a list at each comma" }, { "answer": "\\",\\"", "hint": "The separator character is a comma" }, { "answer": "strip().title", "hint": "Remove spaces AND fix capitalization — chain two methods" }, { "answer": "sort", "hint": "Sort the list in place alphabetically" }, { "answer": "\\" and \\"", "hint": "This is the string you call join() ON — the separator between names" } ] }
\`\`\`

---

## Quiz

\`\`\`quiz
{ "title": "Essential String Methods", "questions": [ { "question": "What does \`\\"  hello  \\".strip()\` return?", "options": ["\\"  hello  \\"", "\\"hello\\"", "\\"hello  \\"", "\\"  hello\\""], "answer": 1, "explanation": "strip() removes whitespace from both the left and right ends of the string, leaving just 'hello'." }, { "question": "Which method would you use to check if a filename ends with '.jpg' or '.png'?", "options": ["find()", "endswith()", "index()", "count()"], "answer": 1, "explanation": "endswith() returns True or False and accepts a tuple of suffixes to match against, making it perfect for file extension checks." }, { "question": "What is the output of \`\\"a-b-c\\".split(\\"-\\")\`?", "options": ["\\"a b c\\"", "['a', '-', 'b', '-', 'c']", "['a', 'b', 'c']", "('a', 'b', 'c')"], "answer": 2, "explanation": "split(\\"-\\") breaks the string at every hyphen and returns a list of the pieces between them: ['a', 'b', 'c']." }, { "question": "What does \`find()\` return when the substring is NOT found?", "options": ["None", "False", "0", "-1"], "answer": 3, "explanation": "find() returns -1 on failure. This is different from index(), which raises a ValueError. Checking \`if s.find(x) != -1\` is a safe pattern." }, { "question": "What is the correct way to join a list \`words = ['hi', 'there']\` with a space?", "options": ["words.join(\\" \\")", "\\" \\".join(words)", "join(words, \\" \\")", "words.join()"], "answer": 1, "explanation": "join() is called on the separator string, not the list. The syntax is separator.join(iterable), so \\" \\".join(words) gives 'hi there'." }, { "question": "What does \`\\"Hello World\\".lower().replace(\\"world\\", \\"python\\")\` return?", "options": ["\\"Hello Python\\"", "\\"hello World\\"", "\\"hello python\\"", "\\"Hello world\\""], "answer": 2, "explanation": "lower() first turns the string into 'hello world', then replace() finds 'world' (lowercase) and swaps it for 'python', giving 'hello python'." } ] }
\`\`\`

---

## Putting It All Together

Here's a realistic mini-program combining several methods at once:

\`\`\`playground
{ "title": "Build a Hashtag Normalizer", "language": "python", "code": "def normalize_hashtags(raw_input):\\n    \\"\\"\\"\\n    Take a messy user-typed string of hashtags and return\\n    a clean, deduplicated, sorted list in lowercase.\\n\\n    Input:  '  #Python , #coding, #PYTHON, #webdev  '\\n    Output: ['#coding', '#python', '#webdev']\\n    \\"\\"\\"\\n    # 1. Strip outer whitespace, then split on commas\\n    tags = raw_input.strip().split(\\",\\")\\n\\n    # 2. For each tag: strip spaces, lowercase, ensure it starts with #\\n    cleaned = []\\n    for tag in tags:\\n        tag = tag.strip().lower()\\n        if not tag.startswith(\\"#\\"):\\n            tag = \\"#\\" + tag\\n        cleaned.append(tag)\\n\\n    # 3. Remove duplicates (via set) then sort\\n    unique_sorted = sorted(set(cleaned))\\n    return unique_sorted\\n\\n\\nraw = \\"  #Python , #coding, #PYTHON, #webdev, coding  \\"\\nresult = normalize_hashtags(raw)\\nprint(result)\\nprint(\\", \\".join(result))", "runnable": true }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "String methods return new strings — the original is never changed (strings are immutable).", "Use .lower() or .upper() to normalize strings before comparing or searching.", ".strip() is your first line of defense against messy input data.", "split() breaks a string into a list; join() reassembles a list into a string — they are inverses.", "find() returns -1 on failure; index() raises ValueError — choose based on whether absence is expected.", "startswith() and endswith() accept tuples so you can check multiple prefixes/suffixes at once.", "Methods can be chained: \`s.strip().lower().replace('x', 'y')\` is idiomatic Python." ] }
\`\`\``,
      starterCode: `# String Methods Practice
# You are building a simple contact card formatter.
# Complete each function using the appropriate string method.

def format_name(name):
    # TODO: Return the name in UPPERCASE
    pass

def clean_input(user_input):
    # TODO: Remove leading/trailing whitespace from user_input
    pass

def get_initials(full_name):
    # TODO: Split full_name into words, then join the first letter
    # of each word with a '.' separator
    # e.g. "john doe" -> "j.d"
    pass

def censor_word(sentence, word):
    # TODO: Replace the given word in sentence with '***'
    pass

def find_domain(email):
    # TODO: Find the index of '@' in the email string
    # Return the substring after '@'
    # e.g. "user@gmail.com" -> "gmail.com"
    pass

def is_valid_email(email):
    # TODO: Return True if email starts with a letter (a-z or A-Z)
    # AND ends with '.com' or '.org'
    # Hint: use startswith() with a tuple and endswith() with a tuple
    pass

# --- Test your functions ---
print(format_name("  alice smith  ".strip()))  # Expected: ALICE SMITH
print(clean_input("   hello world   "))         # Expected: hello world
print(get_initials("jane mary doe"))            # Expected: j.m.d
print(censor_word("I love pizza", "love"))     # Expected: I *** pizza
print(find_domain("user@gmail.com"))            # Expected: gmail.com
print(is_valid_email("hello@example.com"))      # Expected: True
print(is_valid_email("123@bad.net"))            # Expected: False
`,
      solutionCode: `# String Methods Practice — Solution

def format_name(name):
    # upper() converts all characters to uppercase
    return name.upper()

def clean_input(user_input):
    # strip() removes leading and trailing whitespace
    return user_input.strip()

def get_initials(full_name):
    # split() breaks the string into a list of words
    words = full_name.split()
    # Extract first letter of each word using a list comprehension
    initials = [word[0] for word in words]
    # join() combines the list into a single string with '.' between each letter
    return ".".join(initials)

def censor_word(sentence, word):
    # replace() substitutes every occurrence of word with '***'
    return sentence.replace(word, "***")

def find_domain(email):
    # find() returns the index of the first occurrence of '@'
    at_index = email.find("@")
    # Slice the string from one position after '@' to the end
    return email[at_index + 1:]

def is_valid_email(email):
    # startswith() accepts a tuple of prefixes to check against
    valid_start = email.startswith(
        ("a","b","c","d","e","f","g","h","i","j","k","l","m",
         "n","o","p","q","r","s","t","u","v","w","x","y","z",
         "A","B","C","D","E","F","G","H","I","J","K","L","M",
         "N","O","P","Q","R","S","T","U","V","W","X","Y","Z")
    )
    # endswith() accepts a tuple of suffixes to check against
    valid_end = email.endswith((".com", ".org"))
    return valid_start and valid_end

# --- Test your functions ---
print(format_name("  alice smith  ".strip()))  # ALICE SMITH
print(clean_input("   hello world   "))         # hello world
print(get_initials("jane mary doe"))            # j.m.d
print(censor_word("I love pizza", "love"))     # I *** pizza
print(find_domain("user@gmail.com"))            # gmail.com
print(is_valid_email("hello@example.com"))      # True
print(is_valid_email("123@bad.net"))            # False
`,
    },
    {
      id: "string-formatting",
      slug: "string-formatting",
      title: "String Formatting: f-strings and format()",
      content: `# String Formatting: f-strings and format()

Every useful program eventually needs to present data in human-readable form — a price tag, a leaderboard entry, a progress report. Python gives you three tools for embedding values into strings, each from a different era of the language. By the end of this lesson you will know when to reach for each one and how to control exactly how numbers and text are displayed.

\`\`\`concept
{ "title": "What Is String Formatting?", "variant": "mental-model", "content": "String formatting is the process of building a final string from a template plus data. Think of the template as a form with blank fields, and formatting as filling those fields with real values at runtime. Python evaluates each placeholder expression, converts the result to text, and splices it into the surrounding string — all in one step." }
\`\`\`

---

## Three Approaches, One Goal

Python's formatting story spans three decades of the language. All three approaches produce the same output; they differ in readability, power, and age.

\`\`\`tabs
{ "tabs": [ { "label": "f-strings (Python 3.6+)", "content": "**The modern, recommended approach.** Prefix the string with \`f\` and embed any Python expression directly inside curly braces.\\n\\n\`\`\`python\\nname = 'Alice'\\nage = 30\\nprint(f'Hello, {name}! You are {age} years old.')\\n# Hello, Alice! You are 30 years old.\\n\`\`\`\\n\\nYou are not limited to bare variable names — any expression works:\\n\\n\`\`\`python\\nprint(f'Next year: {age + 1}')\\nprint(f'Uppercase: {name.upper()}')\\nprint(f'Is adult: {age >= 18}')\\n\`\`\`\\n\\nf-strings are evaluated at runtime, at the point where the literal appears. They are also the **fastest** of the three methods." }, { "label": ".format() (Python 2.6+)", "content": "**The object-oriented approach.** Call \`.format()\` on a template string; use \`{}\` as positional or named placeholders.\\n\\n\`\`\`python\\nname = 'Alice'\\nage = 30\\n\\n# Positional (order matters)\\nprint('Hello, {}! You are {} years old.'.format(name, age))\\n\\n# Named (order-independent, more readable)\\nprint('Hello, {name}! Age: {age}'.format(name=name, age=age))\\n\\n# Indexed (reuse the same argument)\\nprint('{0} greeted {1}. {1} waved back.'.format('Alice', 'Bob'))\\n\`\`\`\\n\\nUseful when the template is stored in a variable or loaded from a config file — f-strings cannot be built from runtime strings." }, { "label": "% formatting (legacy)", "content": "**The oldest approach**, inherited from C's \`printf\`. Uses \`%s\`, \`%d\`, \`%f\` type codes as placeholders.\\n\\n\`\`\`python\\nname = 'Alice'\\nage = 30\\nprint('Hello, %s! You are %d years old.' % (name, age))\\n\\nprice = 9.99\\nprint('Price: $%.2f' % price)  # 2 decimal places\\n\`\`\`\\n\\nYou will encounter this in legacy codebases written before Python 3.6. The format codes are type-specific and error-prone — passing the wrong type raises a \`TypeError\`.\\n\\n**Write new code with f-strings.** Only learn % formatting for reading, not writing." } ] }
\`\`\`

---

## f-strings Under the Hood

When Python encounters an f-string, it scans for \`{\` and \`}\` delimiters, evaluates each enclosed expression in the current scope, converts the result to a string, and inserts it. The surrounding characters are copied verbatim.

\`\`\`trace
{ "title": "How Python Evaluates an f-string", "language": "python", "code": "name = 'Alice'\\nscore = 98.5\\nmsg = f'Hi {name}, score: {score:.1f}'\\nprint(msg)", "frames": [ { "line": 1, "vars": {"name": "'Alice'"}, "note": "The string 'Alice' is assigned to name." }, { "line": 2, "vars": {"name": "'Alice'", "score": 98.5}, "note": "The float 98.5 is assigned to score." }, { "line": 3, "vars": {"name": "'Alice'", "score": 98.5, "msg": "'Hi Alice, score: 98.5'"}, "note": "Python finds two placeholders: {name} evaluates to 'Alice', and {score:.1f} evaluates score and rounds to 1 decimal place giving '98.5'. Both are inserted into the template." }, { "line": 4, "vars": {"name": "'Alice'", "score": 98.5, "msg": "'Hi Alice, score: 98.5'"}, "note": "The formatted string is passed to print().", "stdout": "Hi Alice, score: 98.5" } ], "speed": 900 }
\`\`\`

Try extending the example — notice that expressions like method calls and arithmetic work seamlessly:

\`\`\`playground
{ "title": "f-string Expressions", "language": "python", "code": "name = 'Alice'\\nage = 30\\npi = 3.14159\\n\\n# Simple variable\\nprint(f'Hello, {name}!')\\n\\n# Arithmetic inside {}\\nprint(f'Next year you will be {age + 1}.')\\n\\n# Method call inside {}\\nprint(f'Uppercase: {name.upper()}')\\n\\n# Conditional expression\\nstatus = 'adult' if age >= 18 else 'minor'\\nprint(f'Status: {status}')\\n\\n# Numeric format spec: 3 decimal places\\nprint(f'Pi approx: {pi:.3f}')", "runnable": true }
\`\`\`

---

## The Format Specification Mini-Language

Both f-strings and \`.format()\` share a powerful **format spec** syntax. You write it after a colon inside the placeholder:

\`\`\`
{value : [[fill] align] [width] [.precision] [type]}
\`\`\`

| Symbol | What it does | Example |
|--------|-------------|---------|
| \`<\` | Left-align | \`{name:<15}\` |
| \`>\` | Right-align | \`{name:>15}\` |
| \`^\` | Center | \`{name:^15}\` |
| \`fill\` | Pad character (before align symbol) | \`{name:-^15}\` |
| \`width\` | Minimum total field width | \`{n:10}\` |
| \`.precision\` | Decimal places for floats | \`{price:.2f}\` |
| \`f\` | Float type | \`{price:8.2f}\` |
| \`d\` | Integer type | \`{n:d}\` |
| \`x\` | Hexadecimal | \`{n:x}\` |
| \`b\` | Binary | \`{n:b}\` |
| \`e\` | Scientific notation | \`{x:.3e}\` |

\`\`\`callout
{ "type": "tip", "title": "Remember the Alignment Arrows", "content": "The symbols < > ^ look like arrows pointing in the direction the text goes:\\n- \`<\` text pushed left (left-aligned, space on the right)\\n- \`>\` text pushed right (right-aligned, space on the left)\\n- \`^\` text centered (space on both sides)\\n\\nThe number after specifies the total field width in characters." }
\`\`\`

\`\`\`playground
{ "title": "Alignment and Precision in Action", "language": "python", "code": "# --- Text alignment ---\\nname = 'Alice'\\nprint(f'|{name:<15}|')   # left-align in 15 chars\\nprint(f'|{name:>15}|')   # right-align\\nprint(f'|{name:^15}|')   # center\\nprint(f'|{name:-^15}|')  # center, fill gaps with dashes\\n\\n# --- Float precision and width ---\\nprice = 1234.5678\\nprint(f'Price: {price:.2f}')      # 2 decimal places\\nprint(f'Price: {price:10.2f}')    # width 10, 2 decimals, right-aligned\\nprint(f'Price: {price:010.2f}')   # zero-padded\\n\\n# --- Integer bases ---\\nn = 255\\nprint(f'Decimal: {n:d}')\\nprint(f'Hex:     {n:x}')   # lowercase hex\\nprint(f'Binary:  {n:b}')\\n\\n# --- Scientific notation ---\\ntiny = 0.000012345\\nprint(f'Sci: {tiny:.3e}')", "runnable": true }
\`\`\`

---

## .format() Uses the Same Spec

Every format spec that works in an f-string works identically in \`.format()\`:

\`\`\`python
# f-string
print(f'{"Alice":^15}')

# .format() — same spec, same output
print('{:^15}'.format('Alice'))
\`\`\`

The \`.format()\` approach becomes essential when the template is not a literal — for example, when it is read from a database, a config file, or passed in as a function argument.

---

## % Formatting vs. f-strings

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "% formatting (avoid in new code)", "code": "name = 'Bob'\\nscore = 95.678\\nrank = 3\\n\\n# Type codes are separate from the data\\nmsg = 'Player %s scored %.1f pts (rank #%d)' % (name, score, rank)\\nprint(msg)" }, "after": { "label": "f-string (prefer)", "code": "name = 'Bob'\\nscore = 95.678\\nrank = 3\\n\\n# Expression and format spec live together\\nmsg = f'Player {name} scored {score:.1f} pts (rank #{rank})'\\nprint(msg)" } }
\`\`\`

The f-string version is shorter, the values are co-located with their placeholders, and Python can report exactly which placeholder caused a \`TypeError\` — with \`%\` formatting you just get a cryptic tuple mismatch.

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Build an f-string", "prompt": "Complete the f-string so it prints exactly: Name: Alice, Age: 30", "language": "python", "template": "name = 'Alice'\\nage = 30\\nmessage = f'Name: ___, Age: ___'\\nprint(message)", "blanks": [ { "answer": "{name}", "hint": "Wrap the variable name in curly braces" }, { "answer": "{age}", "hint": "Same pattern as the first blank" } ] }
\`\`\`

\`\`\`fillblank
{ "title": "Format Spec: Width and Precision", "prompt": "Format the float \`pi\` so it is right-aligned in a total field of 8 characters with exactly 2 decimal places. Expected output: '    3.14'", "language": "python", "template": "pi = 3.14159\\nresult = f'{pi:___}'\\nprint(result)", "blanks": [ { "answer": "8.2f", "hint": "Combine: width (8), then dot-precision (.2), then type character for float (f)" } ] }
\`\`\`

---

## Quiz

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "Which syntax correctly embeds a variable \`city\` in a formatted string using an f-string?", "options": [ "f'Welcome to $(city)'", "f'Welcome to {city}'", "'Welcome to {city}'.format()", "f'Welcome to %s' % city" ], "answer": 1, "explanation": "f-strings use plain curly braces {city}. The $ syntax comes from shell scripting. Option C is valid .format() syntax but the argument is missing. Option D mixes f-string prefix with % syntax, which is a SyntaxError." }, { "question": "What does the format spec \`{value:>10.2f}\` produce for value = 3.14159?", "options": [ "The string '3.14' with no padding", "The string '      3.14' (right-aligned in a field of 10 characters, 2 decimal places)", "The string '3.14      ' (left-aligned)", "A SyntaxError because > is not a valid alignment symbol" ], "answer": 1, "explanation": "> means right-align, 10 is the minimum field width, .2 means 2 decimal places, and f means float. 3.14159 rounds to 3.14 (4 chars), padded with 6 spaces on the left to reach width 10." }, { "question": "When is \`.format()\` a better choice than an f-string?", "options": [ "When formatting floats with more than 3 decimal places", "When the template string is stored in a variable or loaded from a config file", "When you need to reference the same variable twice", "When the code must run on Python 2" ], "answer": 1, "explanation": "f-strings require the string to be a literal written in the source code — you cannot write a template as a variable and then prefix it with f at call time. .format() can be called on any string object, including one read from a database or config file." }, { "question": "What is the output of \`f'{text:^11}'\` when \`text = 'hello'\`?", "options": [ "'hello      ' (left-aligned, 6 trailing spaces)", "'   hello   ' (centered, 3 spaces on each side)", "'      hello' (right-aligned, 6 leading spaces)", "'hello' (no change — width 11 has no effect on a 5-char string)" ], "answer": 1, "explanation": "'hello' is 5 characters. Field width is 11, leaving 6 spaces to distribute. With centering (^), Python puts 3 on the left and 3 on the right, giving '   hello   '." }, { "question": "Which of the following prints the integer 255 in binary using an f-string?", "options": [ "f'{255:hex}'", "f'{255:bin}'", "f'{255:b}'", "f'{255:0b}'" ], "answer": 2, "explanation": "The format type character for binary is b (a single letter, not the word 'bin'). So f'{255:b}' prints '11111111'. The word 'bin' is not a valid type code and raises a ValueError." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "f-strings (f'...') are the modern standard: embed any Python expression directly in {curly braces}, evaluated at runtime.", ".format() is the right tool when the template comes from a variable or external source, not a string literal in your source code.", "% formatting is legacy — read it in old code, but write new code with f-strings.", "Format specs share the same syntax in both f-strings and .format(): {value:[[fill]align][width][.precision][type]}.", "Alignment symbols act like arrows: < pushes text left, > pushes text right, ^ centers it — the number after sets the field width.", "Precision (.2f) sets decimal places; width (10) sets minimum field width; fill characters (0, -) pad the empty space." ] }
\`\`\``,
      starterCode: `# String Formatting Exercise
# Practice f-strings, .format(), and % formatting

# TODO 1: Use an f-string to greet a user.
# Given: name = "Alice", age = 30
# Expected output: "Hello, Alice! You are 30 years old."
name = "Alice"
age = 30
greeting = ""  # TODO: write f-string here
print(greeting)

# TODO 2: Use .format() to display a product and price.
# Given: product = "Coffee", price = 3.5
# Expected output: "Item: Coffee | Price: $3.50"
product = "Coffee"
price = 3.5
line = ""  # TODO: use .format() with two placeholders
print(line)

# TODO 3: Use % formatting to display a percentage score.
# Given: score = 0.8765
# Expected output: "Score: 87.65%"
score = 0.8765
result = ""  # TODO: use % formatting
print(result)

# TODO 4: Use an f-string with alignment to print a formatted table.
# Print each row so the name is left-aligned in 10 chars
# and the score is right-aligned in 6 chars with 1 decimal place.
# Expected output (3 rows):
#   Alice          98.5
#   Bob            73.2
#   Charlie        85.0
students = [("Alice", 98.5), ("Bob", 73.2), ("Charlie", 85.0)]
for student_name, student_score in students:
    pass  # TODO: print formatted row using f-string
`,
      solutionCode: `# String Formatting Exercise — Solution

# 1. f-string: embed variables directly with {}
name = "Alice"
age = 30
greeting = f"Hello, {name}! You are {age} years old."
print(greeting)
# Output: Hello, Alice! You are 30 years old.

# 2. .format(): positional or keyword placeholders
#    :.2f controls decimal precision
product = "Coffee"
price = 3.5
line = "Item: {} | Price: \${:.2f}".format(product, price)
print(line)
# Output: Item: Coffee | Price: $3.50

# 3. % formatting: %f for floats, %.2f for 2 decimal places
#    Multiply by 100 to convert fraction to percentage
score = 0.8765
result = "Score: %.2f%%" % (score * 100)
print(result)
# Output: Score: 87.65%

# 4. Alignment in f-strings:
#    {value:<10}  — left-align in 10-char field
#    {value:>6.1f} — right-align float with 1 decimal in 6-char field
students = [("Alice", 98.5), ("Bob", 73.2), ("Charlie", 85.0)]
for student_name, student_score in students:
    print(f"{student_name:<10} {student_score:>6.1f}")
# Output:
#   Alice          98.5
#   Bob            73.2
#   Charlie        85.0
`,
    },
    {
      id: "string-immutability",
      slug: "string-immutability",
      title: "String Immutability and Memory",
      content: `# String Immutability and Memory

What really happens in memory when you write \`name = "Alice"\` and then \`name = name.upper()\`? Most beginners assume the string *changes* — but Python doesn't work that way. Understanding *why* unlocks faster code, fewer bugs, and a much clearer mental model of how Python manages objects.

---

\`\`\`concept
{ "title": "Strings Are Frozen at Birth", "variant": "mental-model", "content": "In Python, a string object is like a carved stone tablet. Once created, its bytes never change. Every operation that looks like it 'modifies' a string secretly creates a brand-new tablet and points your variable at that new one. The old tablet stays in memory until Python's garbage collector cleans it up." }
\`\`\`

## Seeing Immutability in Action

Python's built-in \`id()\` function returns a unique number for every object in memory — think of it as each object's address on the street. Watch what happens when we perform a "modification":

\`\`\`playground
{ "title": "Tracking Object Identity with id()", "language": "python", "code": "name = \\"alice\\"\\nprint(f\\"Original: '{name}', id = {id(name)}\\")\\n\\n# .upper() looks like it modifies the string...\\nname = name.upper()\\nprint(f\\"After .upper(): '{name}', id = {id(name)}\\")\\n\\n# The id changed! A brand-new string object was created.\\n# Let's verify the original is truly gone from this variable:\\noriginal = \\"alice\\"\\nmodified = original.upper()\\nprint(f\\"\\\\noriginal still: '{original}', id = {id(original)}\\")\\nprint(f\\"modified: '{modified}', id = {id(modified)}\\")\\nprint(f\\"Same object? {original is modified}\\")", "runnable": true }
\`\`\`

Notice that \`original\` is **untouched** even after calling \`.upper()\`. The method returned a new string; it never touched the bytes of \`original\`.

### What Happens When You Try to Change a Character?

Since strings are immutable, Python will flat-out refuse any attempt at direct character assignment:

\`\`\`trace
{ "title": "TypeError: Strings Reject Item Assignment", "language": "python", "code": "word = \\"hello\\"\\nprint(word[0])\\nword[0] = \\"H\\"", "frames": [ { "line": 1, "vars": { "word": "hello" }, "note": "A new string object 'hello' is created in memory. \`word\` points to it.", "stdout": "" }, { "line": 2, "vars": { "word": "hello" }, "note": "Indexing reads byte at position 0 — perfectly fine, strings support reading.", "stdout": "h" }, { "line": 3, "vars": { "word": "hello" }, "note": "Python sees an item assignment on a string. This is forbidden — strings have no __setitem__. A TypeError is raised immediately.", "stdout": "TypeError: 'str' object does not support item assignment" } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Assignment ≠ Mutation", "content": "Writing \`s = s + '!'\` does NOT mutate the string \`s\` points to. It creates a new string object \`'hello!'\` and makes \`s\` point to the new one. The original object \`'hello'\` still exists in memory briefly before garbage collection. Rebinding a variable and mutating an object are two completely different operations." }
\`\`\`

---

## The Memory Cost of Concatenation in Loops

Because every \`+\` creates a new string, doing this inside a loop is secretly expensive. Each iteration allocates a fresh block of memory, copies all previous characters into it, then appends the new ones.

\`\`\`algoviz
{ "title": "Concatenation in a Loop — New Object Each Time", "type": "array", "data": ["H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d"], "frames": [ { "highlight": [0], "label": "Iteration 1: result = '' + 'H' → new object 'H' (1 byte allocated)", "stats": { "iteration": 1, "bytes_copied": 0, "total_chars": 1 } }, { "highlight": [0, 1], "label": "Iteration 2: result = 'H' + 'e' → new object 'He' (copy 1 + append 1 = 2 bytes allocated)", "stats": { "iteration": 2, "bytes_copied": 1, "total_chars": 2 } }, { "highlight": [0, 1, 2], "label": "Iteration 3: result = 'He' + 'l' → new object 'Hel' (copy 2 + append 1 = 3 bytes allocated)", "stats": { "iteration": 3, "bytes_copied": 2, "total_chars": 3 } }, { "highlight": [0, 1, 2, 3, 4], "label": "Iteration 5: copy 4 chars + append 1 each time. Total copies so far: 0+1+2+3+4 = 10", "stats": { "iteration": 5, "bytes_copied": 10, "total_chars": 5 } }, { "highlight": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "label": "Iteration 11: By the end, total bytes copied = 0+1+2+…+10 = 55. This is O(n²) work!", "stats": { "iteration": 11, "bytes_copied": 55, "total_chars": 11 } } ], "speed": 1000 }
\`\`\`

The fix is \`str.join()\` — it inspects all the pieces **first**, allocates exactly the right amount of memory once, then writes everything in a single pass.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Slow: O(n²) copies", "code": "words = [\\"Python\\", \\"is\\", \\"fast\\"]\\nresult = \\"\\"\\nfor word in words:\\n    result = result + word + \\" \\"\\n# Each += creates a new string object\\nprint(result.strip())" }, "after": { "label": "Fast: O(n) single allocation", "code": "words = [\\"Python\\", \\"is\\", \\"fast\\"]\\nresult = \\" \\".join(words)\\n# join() inspects all parts first,\\n# allocates memory once, writes once\\nprint(result)" } }
\`\`\`

\`\`\`playground
{ "title": "Benchmark: + vs join() for Large Strings", "language": "python", "code": "import time\\n\\nwords = [\\"word\\"] * 10000\\n\\n# Method 1: concatenation in loop\\nstart = time.time()\\nresult = \\"\\"\\nfor w in words:\\n    result = result + w\\ntime_concat = time.time() - start\\n\\n# Method 2: join\\nstart = time.time()\\nresult2 = \\"\\".join(words)\\ntime_join = time.time() - start\\n\\nprint(f\\"Concatenation: {time_concat:.4f}s\\")\\nprint(f\\"join():        {time_join:.4f}s\\")\\nprint(f\\"join() is ~{time_concat / max(time_join, 0.0001):.0f}x faster\\")", "runnable": true }
\`\`\`

---

## String Interning: When Python Shares Objects

Python has a memory optimization called **interning**: for certain strings — especially short ones and strings that look like valid Python identifiers — Python reuses the same object rather than creating duplicates.

\`\`\`concept
{ "title": "Interning: One Stone Tablet, Many Variables", "variant": "analogy", "content": "Imagine a library where every book is unique. If 1,000 students all need the exact same textbook, the library doesn't print 1,000 copies — it hands everyone a ticket pointing to the same shelf. Interned strings work the same way: multiple variables that hold the same short string value may all point to a single object in memory." }
\`\`\`

\`\`\`playground
{ "title": "Exploring String Interning with \`is\`", "language": "python", "code": "# Short identifier-like strings are often interned automatically\\na = \\"hello\\"\\nb = \\"hello\\"\\nprint(f\\"a is b: {a is b}\\")  # Likely True — same object in memory\\nprint(f\\"id(a): {id(a)}, id(b): {id(b)}\\")\\n\\n# Strings with spaces are usually NOT interned automatically\\nx = \\"hello world\\"\\ny = \\"hello world\\"\\nprint(f\\"\\\\nx is y: {x is y}\\")  # Often False — separate objects\\nprint(f\\"x == y: {x == y}\\")    # Still True — same value\\n\\n# You can manually intern any string with sys.intern()\\nimport sys\\np = sys.intern(\\"hello world\\")\\nq = sys.intern(\\"hello world\\")\\nprint(f\\"\\\\nAfter sys.intern — p is q: {p is q}\\")", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Use == Not \`is\` to Compare Strings", "content": "Because interning is an implementation detail (not guaranteed by the language spec), never rely on \`is\` to check if two strings have the same value. Always use \`==\`. The \`is\` operator checks object identity (same memory address), not equality. This is one of Python's most common beginner pitfalls." }
\`\`\`

---

## Why Immutability Is Actually a Feature

Immutability isn't just a constraint — it enables capabilities that mutable strings couldn't have.

\`\`\`tabs
{ "tabs": [ { "label": "Dict Keys", "icon": "🔑", "content": "### Strings as Dictionary Keys\\n\\nBecause a string's content can never change, Python can compute its **hash value once** and cache it forever.\\n\\n\`\`\`python\\nphone_book = {\\n    \\"Alice\\": \\"555-1234\\",\\n    \\"Bob\\":   \\"555-5678\\",\\n}\\n# O(1) lookup — hash(\\"Alice\\") is always the same\\nprint(phone_book[\\"Alice\\"])\\n\`\`\`\\n\\nIf strings were mutable, someone could change \`\\"Alice\\"\` after insertion and Python would search the wrong hash bucket — the key would be permanently lost. Immutability is what makes string-keyed dicts reliable." }, { "label": "Thread Safety", "icon": "🔒", "content": "### No Locks Needed\\n\\nIn multi-threaded programs, mutable shared data needs locks to prevent race conditions. Strings sidestep this entirely:\\n\\n\`\`\`python\\nimport threading\\n\\nshared = \\"read-only data\\"\\n\\ndef worker(name):\\n    # Safe: we can read shared from any thread simultaneously.\\n    # No thread can corrupt another thread's view of the string.\\n    print(f\\"{name} sees: {shared}\\")\\n\\nt1 = threading.Thread(target=worker, args=(\\"T1\\",))\\nt2 = threading.Thread(target=worker, args=(\\"T2\\",))\\nt1.start(); t2.start()\\nt1.join(); t2.join()\\n\`\`\`\\n\\nBecause no thread can mutate a string, there is no race condition to guard against." }, { "label": "Predictability", "icon": "🐛", "content": "### Easier to Debug\\n\\nWith mutable objects, a string passed to a function might come back changed:\\n\\n\`\`\`python\\n# This CANNOT happen with Python strings:\\ndef sneaky(s):\\n    s[0] = 'Z'  # TypeError — Python forbids this\\n    return s\\n\\noriginal = \\"Alice\\"\\nresult = sneaky(original)\\n# original is guaranteed unchanged — no defensive copying needed\\nprint(original)  # Always 'Alice'\\n\`\`\`\\n\\nYou never need to defensively copy a string before passing it somewhere. What you pass in is what stays unchanged." } ] }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "String Immutability — Complete the Code", "prompt": "Fix the code below so that \`greeting\` ends up as \`'HELLO, WORLD!'\`. Remember: string methods return new strings — you must capture the result.", "language": "python", "template": "greeting = \\"hello, world!\\"\\ngreeting = greeting.___()\\nprint(greeting)  # Should print: HELLO, WORLD!", "blanks": [ { "answer": "upper", "hint": "Which string method converts all characters to uppercase?" } ] }
\`\`\`

\`\`\`fillblank
{ "title": "Efficient String Building", "prompt": "Complete the function to build a comma-separated string from a list of names using the most memory-efficient approach.", "language": "python", "template": "def join_names(names):\\n    return ___.join(names)\\n\\nprint(join_names([\\"Alice\\", \\"Bob\\", \\"Carol\\"]))\\n# Expected: Alice,Bob,Carol", "blanks": [ { "answer": "\\",\\"", "hint": "What string do you want between each name? Use join() on the separator." } ] }
\`\`\`

---

## Quiz: Test Your Understanding

\`\`\`quiz
{ "title": "String Immutability and Memory", "questions": [ { "question": "What does this code print?\\n\\n\`\`\`python\\ns = \\"hello\\"\\nt = s\\ns = s.upper()\\nprint(t)\\n\`\`\`", "options": ["HELLO", "hello", "TypeError", "None"], "answer": 1, "explanation": "s.upper() creates a brand-new string 'HELLO' and rebinds s to it. The variable t still points to the original 'hello' object, which was never mutated. Immutability guarantees t is unaffected." }, { "question": "Why can strings be used as dictionary keys in Python?", "options": ["Because strings support __hash__ from the dict protocol", "Because strings are immutable, so their hash value never changes after creation", "Because Python internally converts string keys to integers", "Because all objects in Python can be dictionary keys"], "answer": 1, "explanation": "Immutability is the key property. A hash value is computed from the string's content. If the content could change, the hash could change, breaking the dict's ability to find the value. Because strings can't change, their hash is stable forever." }, { "question": "What is the time complexity of building a string by concatenation in a loop (e.g., result = result + char for each char in a list of n chars)?", "options": ["O(n)", "O(n log n)", "O(n²)", "O(1)"], "answer": 2, "explanation": "Each concatenation copies all previously accumulated characters into a new object. For n characters, the total bytes copied is 0 + 1 + 2 + … + (n-1) = n(n-1)/2, which is O(n²). Using str.join() reduces this to O(n) because memory is allocated once." }, { "question": "Which statement about string interning is correct?", "options": ["All Python strings are automatically interned regardless of content", "Interning means two variables with the same string value always point to the same object", "Python may intern short, identifier-like strings to save memory, but this is an implementation detail", "You must call sys.intern() for any string you want to use as a dict key"], "answer": 2, "explanation": "Interning is a CPython implementation detail, not a language guarantee. Python automatically interns some strings (short ones, identifier-like ones), but not all. You can force interning with sys.intern(). Never rely on 'is' for string value comparison — use '==' instead." } ] }
\`\`\`

---

## Deep Dive: How CPython Optimizes Small Concatenations

\`\`\`collapse
{ "title": "Deep Dive: CPython's In-Place Concatenation Shortcut", "content": "The rule 'concatenation always creates a new object' has a nuance in CPython (the standard Python interpreter).\\n\\nIf the string being concatenated has a **reference count of exactly 1** — meaning only one variable points to it — CPython may resize the string's memory block in place rather than allocating a new one. This is an internal optimization.\\n\\n\`\`\`python\\nimport sys\\n\\ns = \\"hello\\"\\nprint(sys.getrefcount(s))  # > 1 because getrefcount itself holds a reference\\n\\n# When CPython sees s += ' world' and s has refcount 1,\\n# it may skip the full copy. But this is NOT guaranteed.\\n\`\`\`\\n\\n**What this means for you:**\\n- For a few concatenations, the optimizer often helps you.\\n- For concatenations in a large loop, the optimizer can't always kick in (especially if the string is referenced elsewhere), and you get the full O(n²) behavior.\\n- \`str.join()\` is always the safe, explicit, and portable choice for building strings from many pieces.\\n\\nBottom line: understand the optimization exists, but write code that is correct regardless of it." }
\`\`\`

---

## Summary

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Python strings are immutable — their bytes can never be changed after creation. Any 'modification' creates a new string object in memory.", "Reassigning a variable (s = s.upper()) is NOT mutation — it rebinds the variable to a new object. The original string is unchanged.", "Concatenation in a loop is O(n²) because each step copies all previous characters. Prefer str.join() for O(n) single-allocation building.", "Immutability makes strings hashable, enabling reliable use as dictionary keys and set elements with O(1) lookup.", "Python may intern short, identifier-like strings so multiple variables share one object — but always use == (not is) for value comparison." ] }
\`\`\``,
    },
    {
      id: "multiline-and-raw-strings",
      slug: "multiline-and-raw-strings",
      title: "Multiline Strings and Raw Strings",
      content: `## Multiline Strings and Raw Strings

Content generation failed. Please retry.`,
    },
    {
      id: "strings-checkpoint",
      slug: "strings-checkpoint",
      title: "Checkpoint: String Processing Exercises",
      content: `## Checkpoint: String Processing Exercises

Content generation failed. Please retry.`,
    },
  ],
};
