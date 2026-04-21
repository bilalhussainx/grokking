import { Module } from "../types";

export const variablesAndDataTypesModule: Module = {
  id: "variables-and-data-types",
  title: "Variables, Data Types & Operators",
  description: "Master Python's core data types — integers, floats, strings, booleans — and how to store, name, and operate on values.",
  lessons: [
    {
      id: "variables-and-assignment",
      slug: "variables-and-assignment",
      title: "Variables and Assignment",
      content: `# Variables and Assignment

Every program needs to remember things — a user's name, a score, a temperature reading. In Python, **variables** are how you give names to values so you can use them later.

In this lesson you'll learn how to create variables, why Python's type system is surprisingly flexible, and the naming conventions professional Python developers follow every day.

---

## What Is a Variable?

Think of your computer's memory as a giant row of labeled boxes. A variable is just a **label** you stick on one of those boxes so you can find the value inside it later.

\`\`\`concept
{ "title": "Variables Are Labels, Not Boxes", "variant": "mental-model", "content": "In Python, a variable doesn't store a value directly — it points to an object in memory. When you write \`age = 25\`, you're saying: 'create the integer object 25 in memory, and let the name \`age\` point to it.' This distinction matters when you start working with lists and objects later." }
\`\`\`

The assignment operator \`=\` does two things at once:
1. Creates (or updates) a name
2. Points that name at a value

\`\`\`python
name = "Aisha"   # name now points to the string "Aisha"
score = 100      # score now points to the integer 100
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "= is NOT equals", "content": "In Python (and most programming languages), \`=\` means **assign**, not **compare**. To check if two values are equal, you use \`==\`. Writing \`age = 25\` sets age to 25. Writing \`age == 25\` asks 'is age equal to 25?'" }
\`\`\`

---

## Your First Variables

Let's run a live example and see variables in action.

\`\`\`playground
{ "title": "Creating and Using Variables", "language": "python", "code": "# Assign some variables\\nname = \\"Aisha\\"\\nage = 22\\nheight = 1.68\\nis_student = True\\n\\n# Print them\\nprint(name)\\nprint(age)\\nprint(height)\\nprint(is_student)\\n\\n# Variables can be used in expressions\\nyears_until_30 = 30 - age\\nprint(\\"Years until 30:\\", years_until_30)", "runnable": true }
\`\`\`

Hit **Run** and watch Python evaluate each line top-to-bottom. Notice that you can use \`age\` in the expression \`30 - age\` because by then Python already knows what \`age\` is.

---

## How Assignment Executes Step by Step

Here is exactly what Python does when it processes three assignment statements:

\`\`\`trace
{ "title": "Variable Assignment Walkthrough", "language": "python", "code": "city = \\"Lagos\\"\\npopulation = 15000000\\nslogan = city + \\" is growing\\"", "frames": [ { "line": 1, "vars": {}, "note": "Python sees the string literal 'Lagos' and creates it in memory. The name \`city\` is bound to it.", "stdout": "" }, { "line": 2, "vars": { "city": "\\"Lagos\\"" }, "note": "Python creates the integer 15000000 and binds the name \`population\` to it.", "stdout": "" }, { "line": 3, "vars": { "city": "\\"Lagos\\"", "population": "15000000" }, "note": "Python looks up \`city\` (finds \\"Lagos\\"), concatenates with \\" is growing\\", creates the new string, and binds \`slogan\` to it.", "stdout": "" } ], "speed": 900 }
\`\`\`

---

## Dynamic Typing — Python's Superpower

In languages like Java or C, you must declare what *type* a variable holds before using it:

\`\`\`java
// Java (not Python!)
int score = 100;
String name = "Aisha";
\`\`\`

Python takes a different approach: **you never write the type**. Python figures it out from the value itself.

\`\`\`concept
{ "title": "Dynamic Typing", "variant": "rule", "content": "In Python, types belong to **values**, not to variable names. The same variable name can point to an integer today and a string tomorrow. Python determines the type at runtime, not compile time. Use \`type()\` to inspect what type a value has." }
\`\`\`

\`\`\`playground
{ "title": "Dynamic Typing in Action", "language": "python", "code": "# Python infers the type from the value\\nx = 42\\nprint(type(x))   # <class 'int'>\\n\\nx = 3.14\\nprint(type(x))   # <class 'float'>\\n\\nx = \\"hello\\"\\nprint(type(x))   # <class 'str'>\\n\\nx = True\\nprint(type(x))   # <class 'bool'>\\n\\n# All perfectly valid Python!\\nprint(\\"Final value of x:\\", x)", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "The 4 Core Types You'll Use Most", "content": "- **int** — whole numbers: \`0\`, \`42\`, \`-7\`\\n- **float** — decimal numbers: \`3.14\`, \`-0.5\`, \`1.0\`\\n- **str** — text (always in quotes): \`\\"hello\\"\`, \`'world'\`\\n- **bool** — true/false: \`True\`, \`False\` (capital first letter!)" }
\`\`\`

---

## Naming Rules and Conventions

Python enforces certain naming **rules** — break them and your code won't run. Beyond rules, the Python community follows **conventions** — break them and your code will still run, but other developers will raise an eyebrow.

\`\`\`tabs
{ "tabs": [ { "label": "Rules (enforced)", "icon": "🚨", "content": "Python will raise a **SyntaxError** if you break these:\\n\\n| Rule | Example |\\n|------|---------|\\n| Must start with a letter or underscore | \`_count\`, \`name\` ✅ | \\n| Can contain letters, digits, underscores | \`user_1\`, \`total2\` ✅ |\\n| **Cannot** start with a digit | \`1score\` ❌ |\\n| **Cannot** contain spaces or hyphens | \`my-score\`, \`my score\` ❌ |\\n| **Cannot** use reserved keywords | \`for = 5\`, \`if = 10\` ❌ |\\n\\nReserved keywords include: \`if\`, \`else\`, \`for\`, \`while\`, \`def\`, \`class\`, \`import\`, \`return\`, \`True\`, \`False\`, \`None\`." }, { "label": "Conventions (community)", "icon": "✅", "content": "Python developers follow [PEP 8](https://peps.python.org/pep-0008/) — the official style guide:\\n\\n| Convention | Example |\\n|------------|---------|\\n| Use **snake_case** for variable names | \`user_age\`, \`total_score\` ✅ |\\n| Use descriptive names | \`user_age\` > \`ua\` or \`x\` |\\n| Constants in ALL_CAPS | \`MAX_RETRIES = 3\` ✅ |\\n| Avoid single letters (except loop counters) | \`n = 5\` ❌ → \`count = 5\` ✅ |\\n\\n**snake_case** means: all lowercase, words separated by underscores." }, { "label": "Good vs Bad Names", "icon": "👀", "content": "\`\`\`python\\n# ❌ Hard to read — what does this mean?\\nx = 22\\ny = 1.75\\nz = x * (y ** 2)\\n\\n# ✅ Self-documenting code\\nage = 22\\nheight_meters = 1.75\\nbmi = age * (height_meters ** 2)  # (simplified for demo)\\n\`\`\`\\n\\nGood variable names make code readable without comments. Aim for names that tell the reader *what the value represents*." } ] }
\`\`\`

---

## Multiple Assignment Patterns

Python lets you assign variables in several compact ways beyond the basic \`name = value\`.

\`\`\`steps
{ "title": "Assignment Patterns You Should Know", "steps": [ { "title": "Basic Assignment", "content": "The standard form — one value, one name:\\n\\n\`\`\`python\\nscore = 0\\n\`\`\`" }, { "title": "Multiple Variables, Same Value", "content": "Assign the same value to several names at once:\\n\\n\`\`\`python\\nx = y = z = 0\\nprint(x, y, z)  # 0 0 0\\n\`\`\`\\n\\nUseful for initializing several counters to zero." }, { "title": "Tuple Unpacking (Multiple Assignment)", "content": "Assign multiple values in a single line by listing them on both sides:\\n\\n\`\`\`python\\nfirst, last, age = \\"Aisha\\", \\"Khan\\", 22\\nprint(first)  # Aisha\\nprint(last)   # Khan\\nprint(age)    # 22\\n\`\`\`\\n\\nThe number of names on the left **must match** the number of values on the right." }, { "title": "Swapping Variables", "content": "Python's multiple assignment makes swapping trivial — no temporary variable needed:\\n\\n\`\`\`python\\na = 10\\nb = 20\\na, b = b, a   # swap!\\nprint(a, b)   # 20 10\\n\`\`\`\\n\\nIn other languages this typically requires three lines with a temp variable." } ] }
\`\`\`

\`\`\`playground
{ "title": "Practice All Assignment Patterns", "language": "python", "code": "# Pattern 1: Basic\\ngreeting = \\"Hello, World!\\"\\nprint(greeting)\\n\\n# Pattern 2: Same value to multiple names\\nlives = score = 0\\nprint(\\"Lives:\\", lives, \\"Score:\\", score)\\n\\n# Pattern 3: Tuple unpacking\\nfirst_name, last_name, age = \\"Bilal\\", \\"Hussain\\", 28\\nprint(first_name, last_name, \\"—\\", age, \\"years old\\")\\n\\n# Pattern 4: Swap without a temp variable\\na = \\"cat\\"\\nb = \\"dog\\"\\nprint(\\"Before swap:\\", a, b)\\na, b = b, a\\nprint(\\"After swap: \\", a, b)", "runnable": true }
\`\`\`

---

## Fill in the Blanks

Time to write some Python yourself. Complete the code below:

\`\`\`fillblank
{ "title": "Assign and Use Variables", "prompt": "Create a variable called \`city_name\` set to \\"Tokyo\\", a variable \`population\` set to 14000000, and print them both.", "language": "python", "template": "___ = \\"Tokyo\\"\\n___ = 14000000\\nprint(city_name, population)", "blanks": [ { "answer": "city_name", "hint": "The variable should be named city_name (snake_case)" }, { "answer": "population", "hint": "The variable should be named population" } ] }
\`\`\`

---

## Common Beginner Mistakes

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Common Mistakes", "code": "# Using a variable before assigning it\\nprint(score)         # NameError: name 'score' is not defined\\n\\n# Starting a name with a digit\\n2fast = True         # SyntaxError\\n\\n# Confusing = with ==\\nif age = 18:         # SyntaxError\\n    print(\\"adult\\")\\n\\n# Using camelCase (valid but non-Pythonic)\\nuserAge = 25         # works, but not idiomatic Python" }, "after": { "label": "Correct Approach", "code": "# Always assign before using\\nscore = 0\\nprint(score)         # 0 — works!\\n\\n# Start names with a letter or underscore\\nfast_mode = True     # valid\\n\\n# Use == for comparison\\nif age == 18:        # correct\\n    print(\\"adult\\")\\n\\n# Use snake_case like everyone else\\nuser_age = 25        # Pythonic ✅" } }
\`\`\`

---

## Quiz

\`\`\`quiz
{ "title": "Variables and Assignment", "questions": [ { "question": "What does the \`=\` operator do in Python?", "options": [ "Checks if two values are equal", "Assigns a value to a variable name", "Declares a variable's type", "Adds two numbers together" ], "answer": 1, "explanation": "In Python, \`=\` is the assignment operator. It binds a name to a value. To check equality, you use \`==\`." }, { "question": "Which of the following is a valid Python variable name?", "options": [ "2nd_place", "my-score", "first_name", "class" ], "answer": 2, "explanation": "\`first_name\` is valid: it starts with a letter and uses only letters and underscores. \`2nd_place\` starts with a digit, \`my-score\` contains a hyphen, and \`class\` is a reserved keyword." }, { "question": "What will \`type(3.14)\` return in Python?", "options": [ "<class 'int'>", "<class 'double'>", "<class 'float'>", "<class 'decimal'>" ], "answer": 2, "explanation": "Python uses \`float\` (not \`double\` or \`decimal\`) for decimal numbers. \`3.14\` is a float literal, so \`type(3.14)\` returns \`<class 'float'>\`." }, { "question": "What does this code print?\\n\\n\`\`\`python\\na, b = 10, 20\\na, b = b, a\\nprint(a, b)\\n\`\`\`", "options": [ "10 20", "20 10", "10 10", "SyntaxError" ], "answer": 1, "explanation": "Python's multiple assignment evaluates the right side first (b=20, a=10), then assigns: a gets 20, b gets 10. This is the classic Pythonic swap." }, { "question": "Which naming style does Python's PEP 8 recommend for variable names?", "options": [ "camelCase (e.g. userName)", "PascalCase (e.g. UserName)", "UPPER_CASE (e.g. USER_NAME)", "snake_case (e.g. user_name)" ], "answer": 3, "explanation": "PEP 8 — Python's official style guide — recommends snake_case for variable and function names. UPPER_CASE is reserved for constants." } ] }
\`\`\`

---

## Key Takeaways

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Use \`=\` to assign a value to a variable name. Python creates or updates the binding immediately.", "Python is dynamically typed — you never declare types. The same name can point to an int, then a string, then a bool.", "Variable names must start with a letter or underscore, contain only letters/digits/underscores, and cannot be Python keywords.", "Follow PEP 8: use snake_case for variable names (e.g. \`user_age\`, not \`userAge\`).", "Multiple assignment lets you unpack values in one line: \`first, last = \\"Ada\\", \\"Lovelace\\"\` — and swap without a temp variable: \`a, b = b, a\`." ] }
\`\`\`

---

**Up next:** Now that you know how to store values, the next lesson dives into the four core data types — integers, floats, strings, and booleans — and what you can do with each one.`,
      starterCode: `# Variables and Assignment Exercise
# Practice declaring variables, dynamic typing, snake_case naming, and multiple assignment

# TODO 1: Declare a variable called 'student_name' and assign your name to it


# TODO 2: Declare a variable called 'student_age' and assign an integer value


# TODO 3: Declare a variable called 'gpa' and assign a float value (e.g. 3.75)


# TODO 4: Declare a variable called 'is_enrolled' and assign a boolean value


# TODO 5: Use multiple assignment to declare three variables in one line:
#         'course_one', 'course_two', 'course_three' with string values


# TODO 6: Use multiple assignment to set 'x', 'y', 'z' all equal to 0 in one line


# --- Do not modify below this line ---
print(f"Name: {student_name}")
print(f"Age: {student_age}, Type: {type(student_age).__name__}")
print(f"GPA: {gpa}, Type: {type(gpa).__name__}")
print(f"Enrolled: {is_enrolled}, Type: {type(is_enrolled).__name__}")
print(f"Courses: {course_one}, {course_two}, {course_three}")
print(f"x={x}, y={y}, z={z}")
`,
      solutionCode: `# Variables and Assignment Exercise — Solution
# Practice declaring variables, dynamic typing, snake_case naming, and multiple assignment

# TODO 1: Declare a variable called 'student_name' and assign your name to it
student_name = "Alex"

# TODO 2: Declare a variable called 'student_age' and assign an integer value
student_age = 20

# TODO 3: Declare a variable called 'gpa' and assign a float value (e.g. 3.75)
gpa = 3.75

# TODO 4: Declare a variable called 'is_enrolled' and assign a boolean value
is_enrolled = True

# TODO 5: Use multiple assignment to declare three variables in one line:
#         'course_one', 'course_two', 'course_three' with string values
course_one, course_two, course_three = "Math", "Physics", "CS"

# TODO 6: Use multiple assignment to set 'x', 'y', 'z' all equal to 0 in one line
x = y = z = 0

# --- Do not modify below this line ---
print(f"Name: {student_name}")
print(f"Age: {student_age}, Type: {type(student_age).__name__}")
print(f"GPA: {gpa}, Type: {type(gpa).__name__}")
print(f"Enrolled: {is_enrolled}, Type: {type(is_enrolled).__name__}")
print(f"Courses: {course_one}, {course_two}, {course_three}")
print(f"x={x}, y={y}, z={z}")
`,
    },
    {
      id: "numeric-types",
      slug: "numeric-types",
      title: "Numbers: int, float, and complex",
      content: `# Numbers: int, float, and complex

Numbers are the foundation of nearly every program ever written — from counting loop iterations to calculating interest rates, modeling physics, and training neural networks. Python makes working with numbers feel natural, but there are important distinctions between numeric types that every programmer needs to understand deeply.

In this lesson you'll learn the three numeric types Python provides, all arithmetic operators, how integer division works, and how to convert between types safely.

---

## The Three Numeric Types

Python has three built-in numeric types. Most everyday programming uses only the first two.

\`\`\`tabs
{ "tabs": [
  {
    "label": "int",
    "icon": "🔢",
    "content": "**Integers** are whole numbers — positive, negative, or zero. No decimal point.\\n\\n\`\`\`python\\nage = 25\\ntemperature = -10\\npopulation = 8_000_000_000  # underscores for readability\\nzero = 0\\n\`\`\`\\n\\nPython integers have **unlimited precision** — they can be as large as your memory allows. Unlike C or Java, there's no overflow at 2³¹ or 2⁶³."
  },
  {
    "label": "float",
    "icon": "🔡",
    "content": "**Floats** represent real numbers with a decimal point. Internally stored as 64-bit IEEE 754 doubles.\\n\\n\`\`\`python\\nprice = 19.99\\ngravity = 9.81\\npi = 3.14159\\nnegative = -0.5\\nsci = 1.5e10   # scientific notation: 1.5 × 10^10\\n\`\`\`\\n\\nFloats trade precision for range. They can represent numbers as large as ~1.8 × 10³⁰⁸, but are only accurate to about **15–17 significant digits**."
  },
  {
    "label": "complex",
    "icon": "🌀",
    "content": "**Complex numbers** have a real and imaginary part. Written with \`j\` (not \`i\`) for the imaginary unit.\\n\\n\`\`\`python\\nz = 3 + 4j\\nw = complex(2, -1)  # 2 - 1j\\nprint(z.real)   # 3.0\\nprint(z.imag)   # 4.0\\n\`\`\`\\n\\nUsed in signal processing, electrical engineering, and scientific computing. Beginners rarely need them, but Python supports them natively."
  }
] }
\`\`\`

You can always check a value's type with \`type()\`:

\`\`\`python
print(type(42))       # <class 'int'>
print(type(3.14))     # <class 'float'>
print(type(2 + 3j))   # <class 'complex'>
\`\`\`

---

## Arithmetic Operators

Python gives you seven arithmetic operators. Six of them you've seen on a calculator — the seventh (\`//\`) is Python-specific and extremely useful.

| Operator | Name | Example | Result |
|----------|------|---------|--------|
| \`+\` | Addition | \`7 + 3\` | \`10\` |
| \`-\` | Subtraction | \`7 - 3\` | \`4\` |
| \`*\` | Multiplication | \`7 * 3\` | \`21\` |
| \`/\` | True Division | \`7 / 3\` | \`2.3333...\` |
| \`//\` | Floor Division | \`7 // 3\` | \`2\` |
| \`%\` | Modulo | \`7 % 3\` | \`1\` |
| \`**\` | Exponentiation | \`7 ** 3\` | \`343\` |

\`\`\`concept
{ "title": "True Division Always Returns a Float", "variant": "rule", "content": "In Python 3, the \`/\` operator ALWAYS returns a float, even when dividing two integers perfectly. \`10 / 2\` gives \`5.0\`, not \`5\`. If you need an integer result, use \`//\` (floor division)." }
\`\`\`

---

## Floor Division and Modulo — The Inseparable Pair

Floor division (\`//\`) and modulo (\`%\`) are two sides of the same coin. Together they let you decompose a number into a quotient and remainder.

\`\`\`concept
{ "title": "The Division Algorithm", "variant": "mental-model", "content": "For any two numbers a and b (b ≠ 0):\\n\\na = (a // b) × b + (a % b)\\n\\nExample: 17 = (17 // 5) × 5 + (17 % 5) = 3 × 5 + 2 = 17 ✓\\n\\nThis always holds. Use it to verify your calculations." }
\`\`\`

**Real-world uses of modulo:**
- Check if a number is even: \`n % 2 == 0\`
- Wrap around (clock arithmetic): \`hour = (current + offset) % 24\`
- Extract digits: \`last_digit = n % 10\`
- Distribute items into buckets: \`bucket = item_id % num_buckets\`

\`\`\`trace
{ "title": "Tracing Floor Division and Modulo", "language": "python", "code": "a = 17\\nb = 5\\n\\nquotient = a // b\\nremainder = a % b\\n\\ncheck = quotient * b + remainder\\nprint(check)", "frames": [
  { "line": 1, "vars": { "a": 17 }, "note": "Assign a = 17" },
  { "line": 2, "vars": { "a": 17, "b": 5 }, "note": "Assign b = 5" },
  { "line": 4, "vars": { "a": 17, "b": 5, "quotient": 3 }, "note": "17 // 5 = 3 (how many full groups of 5 fit in 17?)" },
  { "line": 5, "vars": { "a": 17, "b": 5, "quotient": 3, "remainder": 2 }, "note": "17 % 5 = 2 (what's left over after removing full groups?)" },
  { "line": 7, "vars": { "a": 17, "b": 5, "quotient": 3, "remainder": 2, "check": 17 }, "note": "3 × 5 + 2 = 17 ✓  The division algorithm holds." },
  { "line": 8, "vars": { "a": 17, "b": 5, "quotient": 3, "remainder": 2, "check": 17 }, "note": "Print 17", "stdout": "17" }
], "speed": 900 }
\`\`\`

---

## Operator Precedence

Python follows standard mathematical precedence — the same PEMDAS/BODMAS rules you learned in school.

\`\`\`concept
{ "title": "Precedence Order (Highest → Lowest)", "variant": "rule", "content": "1. \`**\` (exponentiation — right-associative!)\\n2. Unary \`+x\`, \`-x\`\\n3. \`*\`, \`/\`, \`//\`, \`%\`\\n4. \`+\`, \`-\`\\n\\nWhen in doubt, use parentheses. \`(2 + 3) * 4\` is clearer than relying on readers to remember precedence." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Exponentiation Is Right-Associative", "content": "\`2 ** 3 ** 2\` evaluates as \`2 ** (3 ** 2)\` = \`2 ** 9\` = \`512\`, NOT \`(2 ** 3) ** 2\` = \`64\`.\\n\\nAlmost every other operator is left-associative. Exponentiation is the exception — always use parentheses when chaining \`**\`." }
\`\`\`

---

## Type Conversion

Python is **strongly typed** — it won't silently coerce types behind your back. But you can explicitly convert between numeric types using built-in functions.

\`\`\`steps
{ "title": "Converting Between Numeric Types", "steps": [
  { "title": "int() — Convert to Integer", "content": "\`int()\` truncates floats toward zero (does NOT round).\\n\\n\`\`\`python\\nint(3.9)   # → 3  (not 4!)\\nint(3.1)   # → 3\\nint(-3.9)  # → -3 (toward zero, not -4)\\nint('42')  # → 42 (string to int works too)\\n\`\`\`" },
  { "title": "float() — Convert to Float", "content": "\`float()\` widens an integer to a float, or parses a string.\\n\\n\`\`\`python\\nfloat(5)      # → 5.0\\nfloat('3.14') # → 3.14\\nfloat('inf')  # → inf (positive infinity)\\n\`\`\`" },
  { "title": "Automatic Widening", "content": "When you mix int and float in an expression, Python **automatically widens** the int to float — no data loss possible.\\n\\n\`\`\`python\\n3 + 1.5   # → 4.5 (int widened to float)\\n10 / 2    # → 5.0 (always float, even with int operands)\\n10 // 2   # → 5   (stays int when both operands are int)\\n\`\`\`" },
  { "title": "round() — Round a Float", "content": "\`round(number, ndigits)\` rounds to \`ndigits\` decimal places.\\n\\n\`\`\`python\\nround(3.14159, 2)  # → 3.14\\nround(2.5)         # → 2  (banker's rounding!)\\nround(3.5)         # → 4\\n\`\`\`\\n\\n⚠️ Python uses **banker's rounding** (round half to even). \`round(0.5)\` → \`0\`, \`round(1.5)\` → \`2\`." }
] }
\`\`\`

---

## Try It: Arithmetic Explorer

Run this playground to experiment with all the operators. Modify the values and see what happens.

\`\`\`playground
{ "title": "Arithmetic Explorer", "language": "python", "code": "# Explore all arithmetic operators\\na = 17\\nb = 5\\n\\nprint(f\\"a = {a}, b = {b}\\")\\nprint(f\\"Addition:       {a} + {b} = {a + b}\\")\\nprint(f\\"Subtraction:    {a} - {b} = {a - b}\\")\\nprint(f\\"Multiplication: {a} * {b} = {a * b}\\")\\nprint(f\\"True division:  {a} / {b} = {a / b}\\")\\nprint(f\\"Floor division: {a} // {b} = {a // b}\\")\\nprint(f\\"Modulo:         {a} % {b} = {a % b}\\")\\nprint(f\\"Exponent:       {a} ** {b} = {a ** b}\\")\\n\\n# Try a practical example: convert seconds to hours, minutes, seconds\\ntotal_seconds = 3725\\nhours   = total_seconds // 3600\\nminutes = (total_seconds % 3600) // 60\\nseconds = total_seconds % 60\\nprint(f\\"\\\\n{total_seconds} seconds = {hours}h {minutes}m {seconds}s\\")", "runnable": true }
\`\`\`

---

## Visualizing Integer Arithmetic

Let's watch floor division and modulo work step by step on an array of values.

\`\`\`algoviz
{ "title": "Modulo: Distributing 8 Items into 3 Buckets", "type": "array", "data": [0, 1, 2, 3, 4, 5, 6, 7], "frames": [
  { "highlight": [], "label": "8 items (indices 0-7). We want to assign each to bucket 0, 1, or 2 using item % 3.", "stats": { "formula": "item % 3" } },
  { "highlight": [0], "label": "Item 0: 0 % 3 = 0 → Bucket 0", "stats": { "item": 0, "bucket": 0 } },
  { "highlight": [1], "label": "Item 1: 1 % 3 = 1 → Bucket 1", "stats": { "item": 1, "bucket": 1 } },
  { "highlight": [2], "label": "Item 2: 2 % 3 = 2 → Bucket 2", "stats": { "item": 2, "bucket": 2 } },
  { "highlight": [3], "label": "Item 3: 3 % 3 = 0 → Bucket 0 (wraps around!)", "stats": { "item": 3, "bucket": 0 } },
  { "highlight": [4], "label": "Item 4: 4 % 3 = 1 → Bucket 1", "stats": { "item": 4, "bucket": 1 } },
  { "highlight": [5], "label": "Item 5: 5 % 3 = 2 → Bucket 2", "stats": { "item": 5, "bucket": 2 } },
  { "highlight": [6], "label": "Item 6: 6 % 3 = 0 → Bucket 0", "stats": { "item": 6, "bucket": 0 } },
  { "highlight": [7], "label": "Item 7: 7 % 3 = 1 → Bucket 1. Pattern: 0,1,2,0,1,2,0,1", "stats": { "item": 7, "bucket": 1 } }
], "speed": 800 }
\`\`\`

This modulo pattern is fundamental to hash tables, round-robin scheduling, and cyclic data structures.

---

## Floating-Point Precision

Before you trust every float calculation, there's a critical gotcha to understand.

\`\`\`callout
{ "type": "danger", "title": "Floats Are Not Exact", "content": "Try this in Python:\\n\\n\`\`\`python\\n0.1 + 0.2 == 0.3  # False!\\nprint(0.1 + 0.2)  # 0.30000000000000004\\n\`\`\`\\n\\nThis is NOT a Python bug. It's a consequence of binary floating-point representation (IEEE 754). The number 0.1 cannot be represented exactly in binary — just like 1/3 cannot be written exactly in decimal.\\n\\n**Fix:** Use \`round()\` for display, or \`math.isclose()\` for comparisons:\\n\`\`\`python\\nimport math\\nmath.isclose(0.1 + 0.2, 0.3)  # True\\n\`\`\`" }
\`\`\`

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Dangerous — float equality", "code": "price = 0.1 + 0.2\\nif price == 0.3:\\n    print('Correct price!')\\n# This never prints — the comparison is False" }, "after": { "label": "Safe — use round() or math.isclose()", "code": "import math\\n\\nprice = 0.1 + 0.2\\n\\n# Option 1: round for display/storage\\nif round(price, 10) == round(0.3, 10):\\n    print('Correct price!')  # Works!\\n\\n# Option 2: math.isclose for calculations\\nif math.isclose(price, 0.3):\\n    print('Correct price!')  # Works!" } }
\`\`\`

---

## Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the Time Converter", "prompt": "Fill in the blanks to extract hours, minutes, and seconds from a total number of seconds.", "language": "python", "template": "total = 9045\\n\\nhours   = total ___ 3600\\nminutes = (total ___ 3600) ___ 60\\nseconds = total ___ 60\\n\\nprint(f\\"{hours}h {minutes}m {seconds}s\\")  # 2h 30m 45s", "blanks": [
  { "answer": "//", "hint": "How many complete 3600-second blocks fit in total?" },
  { "answer": "%", "hint": "What's left over after removing full hours?" },
  { "answer": "//", "hint": "How many complete 60-second blocks fit in the remaining seconds?" },
  { "answer": "%", "hint": "What's left over after removing full minutes?" }
] }
\`\`\`

---

## Practice Playground

\`\`\`playground
{ "title": "Number Practice: Real-World Problems", "language": "python", "code": "# --- Problem 1: Is a year a leap year? ---\\n# A year is a leap year if divisible by 4,\\n# EXCEPT centuries must be divisible by 400.\\nyear = 2024\\nis_leap = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)\\nprint(f\\"{year} is a leap year: {is_leap}\\")\\n\\n# --- Problem 2: Celsius to Fahrenheit ---\\ncelsius = 100.0\\nfahrenheit = (celsius * 9 / 5) + 32\\nprint(f\\"{celsius}°C = {fahrenheit}°F\\")\\n\\n# --- Problem 3: Compound interest (1 year, monthly compounding) ---\\nprincipal = 1000\\nrate = 0.05        # 5% annual\\nn = 12             # compounding periods per year\\nt = 1              # years\\namount = principal * (1 + rate / n) ** (n * t)\\nprint(f\\"\\\\\${principal} at {rate*100}% for {t} year(s) = \\\\\${amount:.2f}\\")\\n\\n# --- Try it yourself: change the values above! ---", "runnable": true }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Numbers: int, float, and complex", "questions": [
  {
    "question": "What does \`7 / 2\` return in Python 3?",
    "options": ["3", "3.5", "3.0", "4"],
    "answer": 1,
    "explanation": "In Python 3, \`/\` always performs true division and always returns a float. \`7 / 2\` = \`3.5\`. To get an integer result, use \`7 // 2\` = \`3\`."
  },
  {
    "question": "What is \`17 % 5\`?",
    "options": ["3", "2", "1", "0"],
    "answer": 1,
    "explanation": "17 = 3 × 5 + 2. The modulo operator returns the remainder after floor division. 17 // 5 = 3, and 3 × 5 = 15, so 17 - 15 = 2."
  },
  {
    "question": "What does \`int(3.9)\` return?",
    "options": ["4", "3.0", "3", "4.0"],
    "answer": 2,
    "explanation": "int() truncates toward zero — it removes the decimal part entirely without rounding. int(3.9) = 3, and int(-3.9) = -3 (not -4)."
  },
  {
    "question": "Which expression evaluates to \`True\`?",
    "options": ["0.1 + 0.2 == 0.3", "type(10 / 2) == int", "2 ** 3 ** 2 == 512", "int(7 / 2) == 3.5"],
    "answer": 2,
    "explanation": "2 ** 3 ** 2 = 2 ** (3 ** 2) = 2 ** 9 = 512. Exponentiation is right-associative. The others: 0.1 + 0.2 ≠ 0.3 due to float precision; 10/2 returns 5.0 (float); int(7/2) = 3 (int), not 3.5."
  },
  {
    "question": "What is the result of \`10 // 3 * 3 + 10 % 3\`?",
    "options": ["10", "9", "11", "3"],
    "answer": 0,
    "explanation": "Following the division algorithm: a = (a // b) × b + (a % b). With a=10, b=3: (10 // 3) × 3 + (10 % 3) = 3 × 3 + 1 = 9 + 1 = 10. This always reconstructs the original number."
  }
] }
\`\`\`

---

\`\`\`collapse
{ "title": "Deep Dive: How Python Stores Integers", "content": "## Arbitrary Precision Integers\\n\\nUnlike most languages, Python integers are not fixed at 32 or 64 bits. They're objects that can grow to any size. Python uses a variable-length representation internally — small integers fit in a machine word, but large ones allocate as much memory as needed.\\n\\n\`\`\`python\\nbig = 2 ** 1000\\nprint(big)  # A 302-digit number — no overflow!\\n\`\`\`\\n\\nThis is why Python is popular for cryptography and number theory: you can work with 2048-bit keys directly without needing a bignum library.\\n\\n## CPython Integer Caching\\n\\nCPython (the standard Python implementation) caches small integers in the range **-5 to 256**. This means:\\n\\n\`\`\`python\\na = 100\\nb = 100\\na is b   # True — same object in memory!\\n\\nx = 1000\\ny = 1000\\nx is y   # False — different objects\\n\`\`\`\\n\\nNever use \`is\` to compare integers. Always use \`==\`.\\n\\n## IEEE 754 Double Precision\\n\\nPython floats use 64-bit IEEE 754 doubles:\\n- 1 sign bit\\n- 11 exponent bits (range: ~10⁻³⁰⁸ to ~10³⁰⁸)\\n- 52 mantissa bits (~15–17 significant decimal digits)\\n\\nThe \`sys.float_info\` object exposes these limits:\\n\\n\`\`\`python\\nimport sys\\nprint(sys.float_info.max)       # ~1.8e308\\nprint(sys.float_info.epsilon)   # ~2.2e-16 (smallest distinguishable increment from 1.0)\\n\`\`\`" }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Python has three numeric types: int (unlimited precision whole numbers), float (64-bit decimal numbers), and complex (real + imaginary).",
  "The \`/\` operator always returns a float in Python 3. Use \`//\` for integer (floor) division.",
  "Modulo \`%\` returns the remainder. Combined with \`//\`, they satisfy: a = (a // b) × b + (a % b).",
  "Exponentiation \`**\` is right-associative: \`2 ** 3 ** 2\` = \`2 ** 9\` = 512, not 64.",
  "int() truncates toward zero — it does not round. float(5) = 5.0. Mixing int and float in an expression auto-widens to float.",
  "Floats have limited precision due to binary representation. Never use == to compare floats directly — use round() or math.isclose()."
] }
\`\`\``,
    },
    {
      id: "strings-intro",
      slug: "strings-intro",
      title: "Strings: Creating and Basic Operations",
      content: `# Strings: Creating and Basic Operations

Text is everywhere in programming — usernames, messages, file paths, error alerts. In Python, all of that text lives in a **string**. Strings are one of Python's most-used data types, and mastering them early will pay off in every project you ever build.

By the end of this lesson you'll be able to create strings three different ways, join and repeat them, and measure their length — the core toolkit for working with text in Python.

---

## What Is a String?

\`\`\`concept
{ "title": "Strings: Sequences of Characters", "variant": "mental-model", "content": "Think of a Python string as a row of labelled boxes, where each box holds exactly one character — a letter, digit, space, or symbol. The whole row is the string. You can look at any individual box (indexing), count all the boxes (len), or chain two rows end-to-end (concatenation), but you can never swap one character for another inside an existing row — strings are immutable." }
\`\`\`

A **string** is Python's way of storing text. Technically it's a sequence of Unicode characters, which means Python strings can hold letters from any writing system in the world — English, Arabic, Chinese, emoji, and more.

---

## Creating Strings: Three Quoting Styles

Python gives you three ways to wrap text in quotes. All three produce a string — the choice depends on what's *inside* your text.

\`\`\`tabs
{ "tabs": [
  { "label": "Single Quotes", "icon": "✏️", "content": "Use single quotes for simple strings with no apostrophes:\\n\\n\`\`\`python\\ngreeting = 'Hello, world!'\\nlanguage = 'Python'\\n\`\`\`\\n\\nQuick to type, great for short values." },
  { "label": "Double Quotes", "icon": "📝", "content": "Use double quotes when your text contains an apostrophe:\\n\\n\`\`\`python\\nmessage = \\"It's a great day to learn Python!\\"\\nname = \\"O'Brien\\"\\n\`\`\`\\n\\nAvoids escaping the apostrophe with a backslash." },
  { "label": "Triple Quotes", "icon": "📄", "content": "Use triple quotes (''' or \\"\\"\\") for multi-line text:\\n\\n\`\`\`python\\npoem = \\"\\"\\"\\nRoses are red,\\nViolets are blue,\\nPython is awesome,\\nAnd so are you.\\n\\"\\"\\"\\n\\nprint(poem)\\n\`\`\`\\n\\nThe newlines are preserved exactly as written — no \\\\n needed." }
] }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Single vs Double — Python Doesn't Care", "content": "'hello' and \\"hello\\" are identical strings. Pick whichever avoids escaping characters inside your text. Many teams use double quotes by default (matching JSON), others use single — just be consistent." }
\`\`\`

---

## Your First String Playground

Run the cell below to see all three quoting styles in action:

\`\`\`playground
{ "title": "Creating Strings Three Ways", "language": "python", "code": "# Single quotes\\nfirst_name = 'Ada'\\n\\n# Double quotes — apostrophe inside, no problem\\nfact = \\"Python's strings are immutable.\\"\\n\\n# Triple quotes — spans multiple lines\\nhaiku = \\"\\"\\"\\nCode flows like water\\nVariables hold the rain\\nStrings carry the words\\n\\"\\"\\"\\n\\nprint(first_name)\\nprint(fact)\\nprint(haiku)", "runnable": true }
\`\`\`

---

## Concatenation: Joining Strings with \`+\`

The \`+\` operator **concatenates** (joins) two strings end-to-end, creating a brand-new string.

\`\`\`python
first = "Hello"
second = "World"
result = first + ", " + second + "!"
print(result)   # Hello, World!
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "You Cannot Add a String and a Number", "content": "Python will raise a TypeError if you try \`\\"Score: \\" + 42\`. You must convert the number first: \`\\"Score: \\" + str(42)\`. This is a very common beginner error!" }
\`\`\`

Let's trace exactly what happens when Python evaluates a concatenation:

\`\`\`trace
{ "title": "Tracing String Concatenation", "language": "python", "code": "first = \\"Hello\\"\\ngreeting = first + \\", \\" + \\"Python!\\"\\nprint(greeting)", "frames": [
  { "line": 1, "vars": { "first": "Hello" }, "note": "Assign the string 'Hello' to first", "stdout": "" },
  { "line": 2, "vars": { "first": "Hello", "greeting": "Hello, Python!" }, "note": "Python evaluates left-to-right: 'Hello' + ', ' → 'Hello, ', then + 'Python!' → 'Hello, Python!'. A new string object is created.", "stdout": "" },
  { "line": 3, "vars": { "first": "Hello", "greeting": "Hello, Python!" }, "note": "print() sends greeting to stdout", "stdout": "Hello, Python!" }
], "speed": 900 }
\`\`\`

---

## Repetition: Repeating Strings with \`*\`

The \`*\` operator repeats a string a given number of times:

\`\`\`python
laugh = "ha"
print(laugh * 3)    # hahaha

divider = "-" * 20
print(divider)      # --------------------
\`\`\`

This is handy for building separators, banners, and simple patterns without typing the same character over and over.

---

## Measuring Length with \`len()\`

\`len()\` is a built-in Python function that returns the number of characters in a string — including spaces and punctuation.

\`\`\`python
word = "Python"
print(len(word))      # 6

sentence = "Hi there!"
print(len(sentence))  # 9  (the space and ! both count)
\`\`\`

\`\`\`concept
{ "title": "len() Counts Everything", "variant": "rule", "content": "len() counts every character: letters, digits, spaces, punctuation, and even emoji. 'cat' has length 3. 'cat ' (with a trailing space) has length 4. This catches many beginners off guard when comparing strings or validating input length." }
\`\`\`

See how indexing, length, and character positions relate visually:

\`\`\`algoviz
{ "title": "String Characters and Their Positions", "type": "array", "data": ["P","y","t","h","o","n"], "frames": [
  { "highlight": [], "label": "The string 'Python' has 6 characters", "stats": { "len": 6 } },
  { "highlight": [0], "label": "Index 0 → 'P' (indexing starts at zero)", "stats": { "index": 0, "char": "P" } },
  { "highlight": [1], "label": "Index 1 → 'y'", "stats": { "index": 1, "char": "y" } },
  { "highlight": [2], "label": "Index 2 → 't'", "stats": { "index": 2, "char": "t" } },
  { "highlight": [3], "label": "Index 3 → 'h'", "stats": { "index": 3, "char": "h" } },
  { "highlight": [4], "label": "Index 4 → 'o'", "stats": { "index": 4, "char": "o" } },
  { "highlight": [5], "label": "Index 5 → 'n' — last index is always len-1", "stats": { "index": 5, "char": "n" } },
  { "highlight": [0,1,2,3,4,5], "label": "len('Python') = 6 total characters", "stats": { "len": 6 } }
], "speed": 800 }
\`\`\`

---

## Immutability: Strings Don't Change In Place

This is the single most important string concept for beginners to internalize:

\`\`\`concept
{ "title": "Strings Are Immutable", "variant": "insight", "content": "Once a string is created in memory, its characters are frozen. Operations like concatenation or case conversion never modify the original — they always produce a brand-new string. If you want a variable to hold the updated text, you must reassign it: \`name = name + ' Jr.'\`" }
\`\`\`

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Common Mistake — forgetting to reassign", "code": "name = \\"Alice\\"\\nname + \\" Smith\\"   # Creates a new string...\\nprint(name)        # Still prints 'Alice'! The new string was discarded." }, "after": { "label": "Correct — capture the new string", "code": "name = \\"Alice\\"\\nname = name + \\" Smith\\"   # Reassign to keep the result\\nprint(name)               # Prints 'Alice Smith'" } }
\`\`\`

---

## Putting It All Together

\`\`\`playground
{ "title": "Strings in Action — Name Badge Generator", "language": "python", "code": "# Build a simple name badge using concatenation, repetition, and len()\\n\\nfirst_name = 'Jordan'\\nlast_name = 'Rivera'\\nrole = 'Python Student'\\n\\nfull_name = first_name + ' ' + last_name\\nbadge_width = len(full_name) + 4   # padding on each side\\n\\nborder = '*' * badge_width\\nblank = '* ' + ' ' * (badge_width - 4) + ' *'\\n\\nprint(border)\\nprint(blank)\\nprint('* ' + full_name + ' *')\\nprint('* ' + role.center(badge_width - 4) + ' *')\\nprint(blank)\\nprint(border)", "runnable": true }
\`\`\`

Try changing \`first_name\` and \`last_name\` — the badge adjusts automatically because we used \`len()\` to compute the width dynamically.

---

## Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the String Operations", "prompt": "Fill in the blanks so each line produces the expected output.", "language": "python", "template": "# 1. Concatenate two words with a space between them\\nresult = 'Good' ___ ' ' ___ 'morning'\\nprint(result)   # Good morning\\n\\n# 2. Repeat a dash 10 times\\nline = '---' ___\\nprint(line)     # expects 30 dashes\\n\\n# 3. Get the length of the word\\nword = 'Python'\\nprint(___(word))  # 6", "blanks": [
  { "answer": "+", "hint": "Concatenation operator" },
  { "answer": "+", "hint": "Same operator again to chain three strings" },
  { "answer": "* 10", "hint": "Repetition operator followed by the count" },
  { "answer": "len", "hint": "Built-in function that counts characters" }
] }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Strings Quiz", "questions": [
  {
    "question": "What does Python print when you run: \`print('ha' * 3)\`?",
    "options": ["ha ha ha", "hahaha", "ha3", "Error"],
    "answer": 1,
    "explanation": "The * operator repeats the string the specified number of times, concatenating copies directly without any separator. 'ha' * 3 produces 'hahaha'."
  },
  {
    "question": "A developer writes: \`title = 'Python'\` then \`title + ' Guide'\` on the next line, but does NOT reassign the result. What is the value of \`title\` afterwards?",
    "options": ["'Python Guide'", "'Python'", "None", "It raises a TypeError"],
    "answer": 1,
    "explanation": "Strings are immutable. The expression \`title + ' Guide'\` creates a brand-new string object, but since the result isn't assigned back to \`title\` (or any variable), it's immediately discarded. \`title\` still holds 'Python'."
  },
  {
    "question": "What is the length of the string \`'Hello!'\`?",
    "options": ["5", "6", "7", "4"],
    "answer": 1,
    "explanation": "len() counts every character including punctuation. H-e-l-l-o-! is 6 characters, so len('Hello!') returns 6."
  },
  {
    "question": "Which of the following will cause a TypeError in Python?",
    "options": ["'Age: ' + str(25)", "'25' + '30'", "'Age: ' + 25", "'Year: ' * 2"],
    "answer": 2,
    "explanation": "You cannot use + to concatenate a string and an integer directly. Python requires both operands of + to be the same type. The fix is to convert the integer first: 'Age: ' + str(25)."
  },
  {
    "question": "Which quoting style is BEST for a string that contains an apostrophe, like \`It's raining\`?",
    "options": ["Single quotes: 'It's raining'", "Double quotes: \\"It's raining\\"", "No quotes — Python auto-detects", "Parentheses: (It's raining)"],
    "answer": 1,
    "explanation": "Double quotes let you include an apostrophe (single quote) inside the string without escaping it. Using single quotes would end the string at the apostrophe and cause a SyntaxError."
  }
] }
\`\`\`

---

## Deep Dive: Why Immutability?

\`\`\`collapse
{ "title": "Deep Dive: Why Are Python Strings Immutable?", "content": "**Safety and performance** are the two big reasons.\\n\\nBecause strings can't change, Python can safely reuse the same string object in memory when two variables hold identical text — a technique called *string interning*. This saves RAM and makes equality checks very fast.\\n\\nImmutability also makes strings **hashable**, meaning they can be used as dictionary keys and set members. Mutable objects (like lists) can't be hashed because their contents could change after insertion, breaking the data structure.\\n\\nFinally, immutability prevents bugs in concurrent programs: if multiple threads read the same string, there's no risk of one thread mutating it while another is reading it.\\n\\nThe trade-off is that building strings in a loop with \`+=\` creates many temporary objects. For heavy string assembly, Python developers use \`''.join(list_of_parts)\` which is far more efficient." }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Create strings with single quotes, double quotes, or triple quotes — all produce the same string type; choose based on what's inside.",
  "The + operator concatenates strings end-to-end; both operands must be strings (use str() to convert numbers first).",
  "The * operator repeats a string a given number of times — perfect for separators and patterns.",
  "len() returns the total character count, including spaces and punctuation.",
  "Strings are immutable: operations always create a new string — reassign the variable if you want to keep the result."
] }
\`\`\``,
      starterCode: `# String Operations Practice
# Complete each TODO to practice creating and manipulating strings

# TODO 1: Create a greeting using single quotes and store it in \`greeting\`
greeting = 

# TODO 2: Create your name using double quotes and store it in \`name\`
name = 

# TODO 3: Create a multi-line address using triple quotes and store it in \`address\`
# It should span at least 2 lines (e.g., street on line 1, city on line 2)
address = 

# TODO 4: Concatenate \`greeting\` and \`name\` with a space between them
# Store the result in \`full_greeting\`
full_greeting = 

# TODO 5: Repeat the string "Ha" 3 times and store it in \`laughing\`
laughing = 

# TODO 6: Print the length of \`full_greeting\` using len()
print("Length of greeting:", )

# TODO 7: Print all five variables
print(greeting)
print(name)
print(address)
print(full_greeting)
print(laughing)`,
      solutionCode: `# String Operations Practice
# Complete each TODO to practice creating and manipulating strings

# Single quotes for a simple string
greeting = 'Hello'

# Double quotes work exactly the same way
name = "Alice"

# Triple quotes allow strings that span multiple lines
address = """123 Main Street
Springfield, USA"""

# Concatenate with + (add a space string in between)
full_greeting = greeting + " " + name

# Repeat a string with * ("Ha" repeated 3 times -> "HaHaHa")
laughing = "Ha" * 3

# len() returns the number of characters in the string
print("Length of greeting:", len(full_greeting))  # "Hello Alice" = 11

# Print all variables to verify
print(greeting)       # Hello
print(name)           # Alice
print(address)        # 123 Main Street\\nSpringfield, USA
print(full_greeting)  # Hello Alice
print(laughing)       # HaHaHa`,
    },
    {
      id: "booleans-and-none",
      slug: "booleans-and-none",
      title: "Booleans and None",
      content: `# Booleans and None

Every program needs to make decisions. Should we show an error message? Has the user logged in? Is this number bigger than that one? At the heart of every decision in Python is a **boolean** — a value that is either \`True\` or \`False\`. Pair that with the special value \`None\`, and you have the two most fundamental tools for controlling program logic.

This lesson builds your instincts for boolean thinking — not just memorizing syntax, but understanding *why* these values work the way they do.

---

## What Is a Boolean?

A **boolean** is a data type with exactly two possible values: \`True\` and \`False\`. Notice the capital letters — Python is case-sensitive, and \`true\` (lowercase) would cause a \`NameError\`.

\`\`\`python
is_logged_in = True
has_errors = False

print(type(is_logged_in))   # <class 'bool'>
print(type(has_errors))     # <class 'bool'>
\`\`\`

Booleans aren't just abstract — they're the result of asking Python a yes/no question using **comparison operators**.

\`\`\`concept
{ "title": "Booleans Are Answers to Questions", "variant": "mental-model", "content": "Think of a boolean as Python's answer to a yes/no question. When you write \`5 > 3\`, Python evaluates the question and answers \`True\`. When you write \`5 > 10\`, it answers \`False\`. Every comparison you write is a question — the boolean is the answer." }
\`\`\`

---

## Comparison Operators

Comparison operators compare two values and always return a boolean.

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| \`==\` | Equal to | \`5 == 5\` | \`True\` |
| \`!=\` | Not equal to | \`5 != 3\` | \`True\` |
| \`<\` | Less than | \`3 < 5\` | \`True\` |
| \`>\` | Greater than | \`5 > 10\` | \`False\` |
| \`<=\` | Less than or equal | \`5 <= 5\` | \`True\` |
| \`>=\` | Greater than or equal | \`6 >= 7\` | \`False\` |

\`\`\`callout
{ "type": "warning", "title": "== vs = (Common Beginner Mistake)", "content": "\`=\` is **assignment** — it stores a value in a variable (\`x = 5\`).\\n\`==\` is **comparison** — it asks a question (\`x == 5\` → \`True\` or \`False\`).\\nWriting \`if x = 5:\` is a syntax error. Python enforces this distinction." }
\`\`\`

Try every comparison operator yourself:

\`\`\`playground
{ "title": "Comparison Operators in Action", "language": "python", "code": "age = 18\\nprice = 29.99\\npassword = \\"hello123\\"\\n\\n# Numeric comparisons\\nprint(age == 18)       # Is age exactly 18?\\nprint(age >= 21)       # Is age 21 or older?\\nprint(price < 30)      # Is price under $30?\\nprint(price != 25.00)  # Is price not $25?\\n\\n# String comparisons (alphabetical order)\\nprint(\\"apple\\" < \\"banana\\")   # True — 'a' comes before 'b'\\nprint(\\"cat\\" == \\"Cat\\")       # False — case matters!\\n\\n# Try your own:\\nmy_score = 85\\npassing_score = 70\\nprint(my_score > passing_score)  # Did you pass?", "runnable": true }
\`\`\`

---

## Watching a Comparison Evaluate

Here's exactly what Python does, step by step, when it evaluates a comparison chain:

\`\`\`trace
{ "title": "Tracing: Is a student eligible for an exam?", "language": "python", "code": "age = 17\\ngrade = 11\\nhas_id = True\\n\\nage_ok = age >= 16\\ngrade_ok = grade >= 10\\neligible = age_ok and grade_ok and has_id\\nprint(eligible)", "frames": [ { "line": 1, "vars": {}, "note": "Start — no variables yet", "stdout": "" }, { "line": 1, "vars": { "age": 17 }, "note": "age is assigned 17", "stdout": "" }, { "line": 2, "vars": { "age": 17, "grade": 11 }, "note": "grade is assigned 11", "stdout": "" }, { "line": 3, "vars": { "age": 17, "grade": 11, "has_id": true }, "note": "has_id is assigned True", "stdout": "" }, { "line": 5, "vars": { "age": 17, "grade": 11, "has_id": true, "age_ok": true }, "note": "17 >= 16 → True, stored in age_ok", "stdout": "" }, { "line": 6, "vars": { "age": 17, "grade": 11, "has_id": true, "age_ok": true, "grade_ok": true }, "note": "11 >= 10 → True, stored in grade_ok", "stdout": "" }, { "line": 7, "vars": { "age": 17, "grade": 11, "has_id": true, "age_ok": true, "grade_ok": true, "eligible": true }, "note": "True and True and True → True", "stdout": "" }, { "line": 8, "vars": { "age": 17, "grade": 11, "has_id": true, "age_ok": true, "grade_ok": true, "eligible": true }, "note": "print() outputs the result", "stdout": "True" } ], "speed": 900 }
\`\`\`

---

## Logical Operators: Combining Booleans

Real programs rarely ask just one question. You need to combine conditions: "Is the user logged in *and* does she have admin rights?" This is where **logical operators** come in.

\`\`\`tabs
{ "tabs": [ { "label": "and", "icon": "🔗", "content": "## \`and\` — Both must be True\\n\\n\`A and B\` is \`True\` only when **both** A and B are \`True\`.\\n\\n\`\`\`python\\nis_adult = True\\nhas_ticket = True\\ncan_enter = is_adult and has_ticket   # True\\n\\nis_adult = True\\nhas_ticket = False\\ncan_enter = is_adult and has_ticket   # False — missing ticket\\n\`\`\`\\n\\n**Truth table:**\\n\\n| A | B | A and B |\\n|---|---|--------|\\n| True | True | **True** |\\n| True | False | False |\\n| False | True | False |\\n| False | False | False |" }, { "label": "or", "icon": "🔀", "content": "## \`or\` — At least one must be True\\n\\n\`A or B\` is \`True\` when **either** A or B (or both) is \`True\`.\\n\\n\`\`\`python\\nhas_cash = False\\nhas_card = True\\ncan_pay = has_cash or has_card   # True — card works!\\n\\nhas_cash = False\\nhas_card = False\\ncan_pay = has_cash or has_card   # False — no payment method\\n\`\`\`\\n\\n**Truth table:**\\n\\n| A | B | A or B |\\n|---|---|-------|\\n| True | True | True |\\n| True | False | **True** |\\n| False | True | **True** |\\n| False | False | False |" }, { "label": "not", "icon": "🔄", "content": "## \`not\` — Flips True to False (and vice versa)\\n\\n\`not A\` reverses the boolean value.\\n\\n\`\`\`python\\nis_raining = True\\ngo_outside = not is_raining   # False\\n\\nis_raining = False\\ngo_outside = not is_raining   # True\\n\`\`\`\\n\\nUseful for writing readable conditions:\\n\\n\`\`\`python\\n# Without not:\\nif logged_in == False:\\n    print('Please log in')\\n\\n# With not (more Pythonic):\\nif not logged_in:\\n    print('Please log in')\\n\`\`\`" } ] }
\`\`\`

\`\`\`playground
{ "title": "Logical Operators Practice", "language": "python", "code": "# Scenario: Movie ticket pricing\\nage = 14\\nis_student = True\\nis_member = False\\n\\n# Child discount (under 13) OR student discount\\ngets_discount = (age < 13) or is_student\\nprint('Gets discount:', gets_discount)   # True\\n\\n# Full price: adult AND not a member\\npays_full = (age >= 18) and (not is_member)\\nprint('Pays full price:', pays_full)     # False (not adult)\\n\\n# VIP: member AND adult\\nis_vip = is_member and (age >= 18)\\nprint('Is VIP:', is_vip)                 # False\\n\\n# Try changing age to 25, is_member to True — what changes?", "runnable": true }
\`\`\`

---

## Short-Circuit Evaluation

Python is lazy with logical operators — in a good way. It stops evaluating as soon as the result is certain.

\`\`\`concept
{ "title": "Short-Circuit Evaluation", "variant": "insight", "content": "With \`and\`: if the first condition is \`False\`, Python skips the second — the result is already \`False\` no matter what.\\n\\nWith \`or\`: if the first condition is \`True\`, Python skips the second — the result is already \`True\` no matter what.\\n\\nThis matters for performance and for avoiding errors (e.g., checking if a list is non-empty before accessing its first element)." }
\`\`\`

\`\`\`python
# Safe pattern using short-circuit
items = []
# Without short-circuit: items[0] would crash on empty list
# With 'and' short-circuit: items is checked first
first_item = len(items) > 0 and items[0]
print(first_item)  # False (stopped at len check, never touched items[0])
\`\`\`

---

## The \`None\` Type

\`None\` is Python's way of representing **the absence of a value** — not zero, not an empty string, but *nothing at all*.

\`\`\`python
result = None         # No value yet
print(result)         # None
print(type(result))   # <class 'NoneType'>
\`\`\`

\`None\` appears in two common situations:

\`\`\`steps
{ "title": "When Does None Appear?", "steps": [ { "title": "Uninitialized Variables", "content": "When you want to declare a variable but don't have a value yet:\\n\\n\`\`\`python\\nuser_name = None    # Will be set after login\\napi_response = None # Will be set after network call\\n\`\`\`\\n\\nThis is cleaner than using \`0\` or \`\\"\\"\` as placeholders — \`None\` explicitly signals 'no value yet.'" }, { "title": "Functions That Return Nothing", "content": "When a function doesn't have a \`return\` statement (or has a bare \`return\`), Python automatically returns \`None\`:\\n\\n\`\`\`python\\ndef greet(name):\\n    print(f'Hello, {name}!')   # No return statement\\n\\nresult = greet('Alice')   # Prints: Hello, Alice!\\nprint(result)             # None\\n\`\`\`" }, { "title": "Checking for None", "content": "Always use \`is\` (not \`==\`) to check for \`None\`. This is a Python best practice:\\n\\n\`\`\`python\\ndata = None\\n\\n# Correct way:\\nif data is None:\\n    print('No data available')\\n\\nif data is not None:\\n    print('Processing:', data)\\n\\n# Works but not idiomatic:\\nif data == None:\\n    print('Avoid this style')\\n\`\`\`" } ] }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "None is Falsy", "content": "In a boolean context, \`None\` behaves like \`False\`. So \`if result:\` will skip the block if \`result\` is \`None\`. This makes None-checking very concise:\\n\\n\`\`\`python\\nresult = None\\nif not result:\\n    print('Nothing here yet')  # This runs\\n\`\`\`" }
\`\`\`

---

## Truthiness and Falsiness

Python doesn't require you to use only \`True\`/\`False\` in conditions — many values have inherent truthiness.

\`\`\`python
# These are all "falsy" — treated as False in boolean context
print(bool(0))        # False
print(bool(0.0))      # False
print(bool(""))       # False — empty string
print(bool([]))       # False — empty list
print(bool(None))     # False

# These are all "truthy" — treated as True
print(bool(1))        # True
print(bool(-5))       # True — any non-zero number
print(bool("hi"))     # True — any non-empty string
print(bool([1,2]))    # True — any non-empty list
\`\`\`

This is why you'll often see \`if username:\` instead of \`if username != "":\` — they mean the same thing, but the first is more Pythonic.

---

## Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the Boolean Logic", "prompt": "Fill in the blanks to make the conditions work correctly.", "language": "python", "template": "score = 78\\npassing = 60\\n\\n# Check if score is at or above passing\\npassed = score ___ passing\\n\\n# Check if NOT passed\\nfailed = ___ passed\\n\\n# Check if score is between 70 and 89 (inclusive)\\nis_b_grade = score >= 70 ___ score <= 89\\n\\nprint(passed, failed, is_b_grade)", "blanks": [ { "answer": ">=", "hint": "greater than or equal to" }, { "answer": "not", "hint": "logical negation operator" }, { "answer": "and", "hint": "both conditions must be true" } ] }
\`\`\`

---

## Visualizing Boolean Logic

Think of \`and\` like a series circuit — electricity only flows if both switches are on. \`or\` is a parallel circuit — electricity flows if either switch is on.

\`\`\`algoviz
{ "title": "How 'and' Evaluates Step by Step", "type": "array", "data": [true, true, false], "frames": [ { "highlight": [0], "label": "Check condition 1: is_adult = True", "stats": { "condition": 1, "result": "True" } }, { "highlight": [0, 1], "label": "True so far — check condition 2: has_ticket = True", "stats": { "condition": 2, "result": "True" } }, { "highlight": [0, 1, 2], "label": "True so far — check condition 3: is_verified = False", "stats": { "condition": 3, "result": "False" } }, { "highlight": [2], "label": "One False breaks the chain — final result: False", "stats": { "final": "False" } } ], "speed": 1000 }
\`\`\`

---

## Putting It All Together

\`\`\`playground
{ "title": "Build a Login Validator", "language": "python", "code": "# Simple login validator using all we've learned\\n\\nusername = \\"alice\\"\\npassword = \\"secret123\\"\\nmax_attempts = 3\\nattempts_used = 2\\n\\n# Check credentials\\ncorrect_username = username == \\"alice\\"\\ncorrect_password = password == \\"secret123\\"\\ncredentials_ok = correct_username and correct_password\\n\\n# Check if attempts remain\\nattempts_remaining = max_attempts - attempts_used\\ncan_try = attempts_remaining > 0\\n\\n# Final decision\\ncan_login = credentials_ok and can_try\\n\\nprint('Username correct:', correct_username)\\nprint('Password correct:', correct_password)\\nprint('Attempts left:', attempts_remaining)\\nprint('Can login:', can_login)\\n\\n# None for optional data\\nlast_login = None\\nif last_login is None:\\n    print('First time logging in!')\\nelse:\\n    print('Last login:', last_login)\\n\\n# Try changing password to 'wrong' — what happens?", "runnable": true }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Booleans and None", "questions": [ { "question": "What does \`10 != 10\` evaluate to?", "options": ["True", "False", "None", "Error"], "answer": 1, "explanation": "\`!=\` means 'not equal to'. Since 10 equals 10, the answer to 'are they not equal?' is False." }, { "question": "Which of the following is NOT falsy in Python?", "options": ["0", "\\"\\"", "None", "\\"False\\""], "answer": 3, "explanation": "The string \`\\"False\\"\` is a non-empty string, so it is truthy. \`0\`, \`\\"\\"\` (empty string), and \`None\` are all falsy." }, { "question": "What does \`True and False or True\` evaluate to?", "options": ["True", "False", "None", "Error"], "answer": 0, "explanation": "\`and\` has higher precedence than \`or\`. So it evaluates as \`(True and False) or True\` → \`False or True\` → \`True\`." }, { "question": "What is the correct way to check if a variable \`x\` is None?", "options": ["x == None", "x is None", "x === None", "x = None"], "answer": 1, "explanation": "Python best practice is \`x is None\` because \`None\` is a singleton — there's only one None object. \`is\` checks identity (same object), while \`==\` checks equality. Both work, but \`is None\` is the idiomatic Python style." }, { "question": "A function has no return statement. What does it return?", "options": ["0", "False", "None", "An error is raised"], "answer": 2, "explanation": "In Python, any function without an explicit return statement (or with a bare \`return\`) automatically returns \`None\`." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Booleans have exactly two values: \`True\` and \`False\` (capitalized). They are the result of comparisons and logical operations.", "Comparison operators (\`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`) compare two values and return a boolean.", "\`and\` requires both sides to be True; \`or\` requires at least one side to be True; \`not\` flips the value.", "Python short-circuits: with \`and\`, if the first value is False, the second is never evaluated; with \`or\`, if the first is True, the second is skipped.", "\`None\` represents the absence of a value — not zero, not empty string, but 'no value at all.' Use \`is None\` to check for it.", "Many values are truthy or falsy: \`0\`, \`\\"\\"\`, \`[]\`, and \`None\` are all falsy. Non-zero numbers, non-empty strings, and non-empty collections are truthy." ] }
\`\`\``,
      starterCode: `# Booleans and None Exercise
# Practice using True/False, comparison operators, logical operators, and None

def check_eligibility(age, has_id, score):
    """
    Determine if a person is eligible for a program.
    Requirements:
      - Must be 18 or older
      - Must have a valid ID
      - Score must be greater than 70
    
    Return True if ALL conditions are met, False otherwise.
    """
    # TODO: Use comparison and logical operators to check all three conditions
    # Hint: use 'and' to combine conditions
    pass


def describe_value(val):
    """
    Return a string describing the value:
      - If val is None, return "no value"
      - If val is True, return "yes"
      - If val is False, return "no"
    """
    # TODO: Check if val is None first (use 'is None'),
    # then check True/False
    pass


def is_teen_or_senior(age):
    """
    Return True if age is between 13 and 17 (inclusive) OR 65 or older.
    Return False otherwise.
    """
    # TODO: Use comparison operators and 'or' to check both ranges
    pass


# --- Test your functions ---
print(check_eligibility(20, True, 85))   # Expected: True
print(check_eligibility(16, True, 85))   # Expected: False (too young)
print(check_eligibility(20, False, 85))  # Expected: False (no ID)
print(check_eligibility(20, True, 65))   # Expected: False (low score)

print(describe_value(None))   # Expected: no value
print(describe_value(True))   # Expected: yes
print(describe_value(False))  # Expected: no

print(is_teen_or_senior(15))  # Expected: True
print(is_teen_or_senior(70))  # Expected: True
print(is_teen_or_senior(30))  # Expected: False
`,
      solutionCode: `# Booleans and None Exercise — Solution

def check_eligibility(age, has_id, score):
    """
    Determine if a person is eligible for a program.
    Requirements:
      - Must be 18 or older
      - Must have a valid ID
      - Score must be greater than 70
    
    Return True if ALL conditions are met, False otherwise.
    """
    # All three conditions must be True, so we combine them with 'and'
    return age >= 18 and has_id and score > 70


def describe_value(val):
    """
    Return a string describing the value:
      - If val is None, return "no value"
      - If val is True, return "yes"
      - If val is False, return "no"
    """
    # Check for None first using 'is None' (preferred over == for None)
    if val is None:
        return "no value"
    elif val:  # True
        return "yes"
    else:       # False
        return "no"


def is_teen_or_senior(age):
    """
    Return True if age is between 13 and 17 (inclusive) OR 65 or older.
    Return False otherwise.
    """
    # Either condition being True is enough, so we use 'or'
    is_teen = age >= 13 and age <= 17
    is_senior = age >= 65
    return is_teen or is_senior


# --- Test your functions ---
print(check_eligibility(20, True, 85))   # True  — all conditions met
print(check_eligibility(16, True, 85))   # False — age < 18
print(check_eligibility(20, False, 85))  # False — no ID
print(check_eligibility(20, True, 65))   # False — score not > 70

print(describe_value(None))   # no value
print(describe_value(True))   # yes
print(describe_value(False))  # no

print(is_teen_or_senior(15))  # True  — teen range
print(is_teen_or_senior(70))  # True  — senior range
print(is_teen_or_senior(30))  # False — neither
`,
    },
    {
      id: "type-conversion",
      slug: "type-conversion",
      title: "Type Conversion and the type() Function",
      content: `# Type Conversion and the \`type()\` Function

Every value in Python has a type — but types are not destiny. Python gives you tools to inspect what type a value is, and to convert between types when you need to. This lesson covers both.

By the end, you'll be able to confidently handle one of the most common beginner bugs: the \`TypeError\` that appears when you try to add a number to a string typed in by the user.

---

\`\`\`concept
{ "title": "Type Conversion in One Sentence", "variant": "mental-model", "content": "Type conversion is the process of taking a value of one data type and producing an equivalent value of a different data type — either automatically (by Python) or manually (by you, the programmer)." }
\`\`\`

---

## Two Flavors of Conversion

Python performs type conversions in two distinct ways. Knowing which is which will save you from subtle bugs.

\`\`\`tabs
{ "tabs": [
  {
    "label": "Implicit (Automatic)",
    "icon": "🤖",
    "content": "Python silently upgrades types to **prevent data loss**.\\n\\n\`\`\`python\\nx = 5      # int\\ny = 2.0    # float\\nresult = x + y   # Python converts x to float first\\nprint(result)    # 7.0  (float, not int)\\nprint(type(result))  # <class 'float'>\\n\`\`\`\\n\\nPython promotes \`int → float\` because converting the other way would lose the decimal part. It always converts toward the *more precise* type."
  },
  {
    "label": "Explicit (Manual)",
    "icon": "🧑‍💻",
    "content": "You control the conversion with built-in functions:\\n\\n| Function | Converts to | Example |\\n|----------|-------------|-------|\\n| \`int()\` | Integer | \`int(3.9)\` → \`3\` |\\n| \`float()\` | Float | \`float(7)\` → \`7.0\` |\\n| \`str()\` | String | \`str(42)\` → \`'42'\` |\\n| \`bool()\` | Boolean | \`bool(0)\` → \`False\` |\\n\\nExplicit conversion is also called **type casting**."
  }
] }
\`\`\`

---

## The \`type()\` Function

Before converting anything, it's useful to *know* what type you're working with. That's exactly what \`type()\` does.

\`\`\`python
print(type(42))        # <class 'int'>
print(type(3.14))      # <class 'float'>
print(type("hello"))   # <class 'str'>
print(type(True))      # <class 'bool'>
\`\`\`

The return value is a **class object**, not a plain string. You can use it in comparisons:

\`\`\`python
x = 100
if type(x) == int:
    print("x is an integer")
\`\`\`

But for type-checking in practice, there's a better tool — \`isinstance()\` — which we'll cover shortly.

---

## Explicit Conversion: The Four Core Functions

\`\`\`steps
{ "title": "Converting Between Types", "steps": [
  {
    "title": "int() — Convert to Integer",
    "content": "\`int()\` converts floats, strings containing digits, and booleans to an integer.\\n\\n\`\`\`python\\nint(9.99)    # → 9   (truncates, does NOT round)\\nint('42')    # → 42\\nint(True)    # → 1\\nint(False)   # → 0\\n\`\`\`\\n\\n**Watch out:** \`int()\` truncates floats — it throws away everything after the decimal point. \`int(9.99)\` is \`9\`, not \`10\`."
  },
  {
    "title": "float() — Convert to Float",
    "content": "\`float()\` converts integers and numeric strings to floating-point numbers.\\n\\n\`\`\`python\\nfloat(7)      # → 7.0\\nfloat('3.14') # → 3.14\\nfloat(True)   # → 1.0\\n\`\`\`"
  },
  {
    "title": "str() — Convert to String",
    "content": "\`str()\` converts almost anything to its string representation.\\n\\n\`\`\`python\\nstr(100)    # → '100'\\nstr(3.14)   # → '3.14'\\nstr(True)   # → 'True'\\n\`\`\`\\n\\nThis is essential when you need to concatenate numbers with text:\\n\\n\`\`\`python\\nage = 25\\nprint('You are ' + str(age) + ' years old.')\\n\`\`\`"
  },
  {
    "title": "bool() — Convert to Boolean",
    "content": "\`bool()\` converts a value to \`True\` or \`False\`.\\n\\nPython's rule: **zero and empty are \`False\`; everything else is \`True\`.**\\n\\n\`\`\`python\\nbool(0)    # → False\\nbool(1)    # → True\\nbool(-5)   # → True  (any non-zero number)\\nbool('')   # → False  (empty string)\\nbool('hi') # → True\\nbool(None) # → False\\n\`\`\`"
  }
] }
\`\`\`

---

## Watch the Execution — Step by Step

This trace follows a short program that converts user input (simulated as a string) into a number and performs arithmetic.

\`\`\`trace
{ "title": "Converting a String to a Number", "language": "python", "code": "raw = \\"42\\"\\nprint(type(raw))\\nnum = int(raw)\\nprint(type(num))\\nresult = num + 8\\nprint(result)", "frames": [
  { "line": 1, "vars": { "raw": "\\"42\\"" }, "note": "raw is assigned the string '42'", "stdout": "" },
  { "line": 2, "vars": { "raw": "\\"42\\"" }, "note": "type() reveals raw is a str", "stdout": "<class 'str'>" },
  { "line": 3, "vars": { "raw": "\\"42\\"", "num": 42 }, "note": "int() creates a NEW integer value 42. raw is still '42'", "stdout": "<class 'str'>" },
  { "line": 4, "vars": { "raw": "\\"42\\"", "num": 42 }, "note": "type() confirms num is now int", "stdout": "<class 'str'>\\n<class 'int'>" },
  { "line": 5, "vars": { "raw": "\\"42\\"", "num": 42, "result": 50 }, "note": "Adding two ints: 42 + 8 = 50", "stdout": "<class 'str'>\\n<class 'int'>" },
  { "line": 6, "vars": { "raw": "\\"42\\"", "num": 42, "result": 50 }, "note": "Final output printed", "stdout": "<class 'str'>\\n<class 'int'>\\n50" }
], "speed": 900 }
\`\`\`

Notice that on line 3, \`raw\` **still holds** \`"42"\` after \`int(raw)\` is called. This brings us to the single most common misconception about type casting.

---

\`\`\`callout
{ "type": "warning", "title": "Misconception: Type Casting Does NOT Change the Original Variable", "content": "\`int(a)\` does not modify \`a\`. It creates a **new value** converted to int. The original variable stays exactly as it was.\\n\\n\`\`\`python\\na = '99'\\nint(a)       # creates a new int — but we didn't save it!\\nprint(type(a))  # still <class 'str'>\\n\\na = int(a)   # NOW a is reassigned — this changes a's type\\nprint(type(a))  # <class 'int'>\\n\`\`\`\\n\\nIf you want the variable to change type, you must **reassign** it." }
\`\`\`

---

## Run It Yourself

Try modifying the conversions — experiment with values that cause errors, like \`int('hello')\`.

\`\`\`playground
{ "title": "Explore Type Conversion", "language": "python", "code": "# --- Implicit conversion ---\\nresult = 5 + 2.0\\nprint('5 + 2.0 =', result, '| type:', type(result))\\n\\n# --- Explicit conversion ---\\na = '123'\\nprint('Before:', a, type(a))\\na = int(a)\\nprint('After:  ', a, type(a))\\n\\n# --- int() truncates, not rounds ---\\nprint('int(9.99) =', int(9.99))\\n\\n# --- bool() truthy/falsy ---\\nfor val in [0, 1, -3, '', 'hi', None]:\\n    print(f'bool({repr(val)}) =', bool(val))", "runnable": true }
\`\`\`

---

## \`type()\` vs \`isinstance()\` — Which Should You Use?

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Fragile: using type() for checking", "code": "def process(value):\\n    if type(value) == int:\\n        print('Got an int')\\n\\n# Works for plain int\\nprocess(42)\\n\\n# Fails for bool — even though bool IS a subtype of int!\\nprocess(True)   # prints nothing" }, "after": { "label": "Robust: using isinstance()", "code": "def process(value):\\n    if isinstance(value, int):\\n        print('Got an int (or subtype)')\\n\\n# Works for plain int\\nprocess(42)\\n\\n# Also works for bool (bool is a subclass of int)\\nprocess(True)   # prints 'Got an int (or subtype)'" } }
\`\`\`

\`isinstance(value, SomeType)\` returns \`True\` if the value is an instance of that type **or any of its subclasses**. Because \`bool\` is a subclass of \`int\` in Python, \`isinstance(True, int)\` is \`True\`. The \`type()\` equality check misses this relationship.

**Rule of thumb:** use \`type()\` when you need to *display* a type; use \`isinstance()\` when you need to *check* a type.

---

## Real World: Handling \`input()\`

The most important practical use of type conversion is fixing a bug that every Python beginner hits:

\`\`\`python
age = input("Enter your age: ")  # input() ALWAYS returns a string
print(age + 1)  # TypeError: can only concatenate str (not "int") to str
\`\`\`

\`input()\` always returns a string, even if the user typed a number. You must convert it explicitly:

\`\`\`playground
{ "title": "The input() Pattern", "language": "python", "code": "# Simulate what input() returns (a string)\\nraw_age = '25'\\n\\n# Without conversion — this would crash:\\n# print(raw_age + 1)  # TypeError!\\n\\n# With conversion:\\nage = int(raw_age)\\nnext_birthday = age + 1\\nprint(f'You are {age}. Next year you will be {next_birthday}.')\\n\\n# float works the same way for decimal input:\\nraw_height = '1.75'\\nheight = float(raw_height)\\nprint(f'Height in cm: {height * 100}')", "runnable": true }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the Age Calculator", "prompt": "Fix this program so it reads a user's birth year (as a string) and prints their approximate age. Use type conversion where needed.", "language": "python", "template": "birth_year_str = '1998'\\nbirth_year = ___(birth_year_str)\\ncurrent_year = 2026\\nage = current_year - birth_year\\nprint('Approximate age: ' + ___(age))", "blanks": [
  { "answer": "int", "hint": "Convert the string to a whole number" },
  { "answer": "str", "hint": "Convert the result back to string so you can concatenate it" }
] }
\`\`\`

---

## Check Your Understanding

\`\`\`quiz
{ "title": "Type Conversion Quiz", "questions": [
  {
    "question": "What does \`int(7.9)\` return in Python?",
    "options": ["8", "7", "7.9", "TypeError"],
    "answer": 1,
    "explanation": "int() truncates (cuts off) the decimal portion — it does NOT round. So int(7.9) gives 7, not 8."
  },
  {
    "question": "After running \`x = '50'\` then \`int(x)\`, what is the type of \`x\`?",
    "options": ["int", "float", "str", "NoneType"],
    "answer": 2,
    "explanation": "int(x) creates a NEW integer value but does NOT modify x. The variable x still holds the string '50'. To change x, you must write x = int(x)."
  },
  {
    "question": "Which function should you prefer for type-checking when inheritance might be involved?",
    "options": ["type()", "isinstance()", "str()", "id()"],
    "answer": 1,
    "explanation": "isinstance() is preferred because it returns True for the type AND any of its subclasses. For example, isinstance(True, int) returns True because bool is a subclass of int, whereas type(True) == int returns False."
  },
  {
    "question": "What does the \`input()\` function always return, regardless of what the user types?",
    "options": ["int", "float", "str", "The matching type for what was typed"],
    "answer": 2,
    "explanation": "input() always returns a string (str). If you need a number, you must explicitly convert it using int() or float()."
  },
  {
    "question": "Which of the following evaluates to \`False\` when passed to \`bool()\`?",
    "options": ["bool(-1)", "bool('0')", "bool(0)", "bool(0.1)"],
    "answer": 2,
    "explanation": "bool(0) is False. In Python, zero values and empty containers are falsy. Note that bool('0') is True — it's a non-empty string, even though it contains the character '0'."
  }
] }
\`\`\`

---

\`\`\`collapse
{ "title": "Deep Dive: What bool() Considers Falsy", "content": "Python has a precise list of values that are considered **falsy** (evaluate to \`False\` in a boolean context):\\n\\n- Numeric zero: \`0\`, \`0.0\`, \`0j\`\\n- Empty sequences: \`''\`, \`[]\`, \`()\`, \`b''\`\\n- Empty collections: \`{}\`, \`set()\`\\n- \`None\`\\n- \`False\` itself\\n\\n**Everything else is truthy.** This is why \`bool('0')\` is \`True\` — the string \`'0'\` has one character, so it is non-empty.\\n\\nThis matters beyond just \`bool()\` — any value can be used directly in an \`if\` condition, and Python applies the same truthiness rules:\\n\\n\`\`\`python\\nname = ''\\nif name:       # same as if bool(name):\\n    print('Hello,', name)\\nelse:\\n    print('No name provided')   # this runs\\n\`\`\`" }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Python has two conversion types: implicit (automatic, e.g. int + float → float) and explicit (manual, using int(), float(), str(), bool()).",
  "int() truncates floats — it does NOT round. int(9.9) → 9.",
  "Type casting functions like int(x) create a NEW value. To change the variable itself, reassign: x = int(x).",
  "type() returns the class of an object. Use it to display types; use isinstance() to check them (it handles subclasses correctly).",
  "input() always returns a string — always convert with int() or float() before doing math with user input."
] }
\`\`\``,
      starterCode: `# Type Conversion and the type() Function
# Practice converting between types and inspecting them at runtime

def analyze_and_convert(value):
    """
    Given any value, return a dict with:
    - 'original_type': the type name as a string (e.g. 'int', 'float')
    - 'is_numeric': True if value is an int or float, False otherwise
    - 'as_string': the value converted to a string
    - 'as_float': the value converted to float, or None if not possible
    """
    result = {}

    # TODO 1: Store the type name of \`value\` as a string (e.g. 'int', not <class 'int'>)
    # Hint: use type() and .__name__
    result['original_type'] = None

    # TODO 2: Set 'is_numeric' to True if value is an int or float, False otherwise
    # Hint: use isinstance() with a tuple of types
    result['is_numeric'] = None

    # TODO 3: Convert value to a string and store it
    result['as_string'] = None

    # TODO 4: Try to convert value to float.
    # Store the float if successful, or None if a ValueError is raised.
    result['as_float'] = None

    return result


def summarize_list(items):
    """
    Given a mixed list, return a dict with counts of each type:
    - 'int_count'
    - 'float_count'
    - 'str_count'
    - 'bool_count'
    - 'other_count'
    """
    counts = {'int_count': 0, 'float_count': 0, 'str_count': 0, 'bool_count': 0, 'other_count': 0}

    for item in items:
        # TODO 5: Use isinstance() checks to increment the correct counter.
        # Important: check bool BEFORE int — bool is a subclass of int!
        pass

    return counts


# --- Quick smoke-test (you can modify these) ---
if __name__ == '__main__':
    print(analyze_and_convert(42))
    print(analyze_and_convert(3.14))
    print(analyze_and_convert('123'))
    print(analyze_and_convert('hello'))
    print()
    print(summarize_list([1, 2.5, 'hi', True, None, 'world', 7]))
`,
      solutionCode: `# Type Conversion and the type() Function — Solution

def analyze_and_convert(value):
    """
    Given any value, return a dict with:
    - 'original_type': the type name as a string (e.g. 'int', 'float')
    - 'is_numeric': True if value is an int or float, False otherwise
    - 'as_string': the value converted to a string
    - 'as_float': the value converted to float, or None if not possible
    """
    result = {}

    # type(value).__name__ gives the plain string name of the type
    result['original_type'] = type(value).__name__

    # isinstance() accepts a tuple of types to check against multiple at once
    result['is_numeric'] = isinstance(value, (int, float))

    # str() converts any value to its string representation
    result['as_string'] = str(value)

    # Attempt the conversion; catch ValueError for non-numeric strings
    try:
        result['as_float'] = float(value)
    except (ValueError, TypeError):
        result['as_float'] = None

    return result


def summarize_list(items):
    """
    Given a mixed list, return a dict with counts of each type:
    - 'int_count'
    - 'float_count'
    - 'str_count'
    - 'bool_count'
    - 'other_count'
    """
    counts = {'int_count': 0, 'float_count': 0, 'str_count': 0, 'bool_count': 0, 'other_count': 0}

    for item in items:
        # bool must come before int: isinstance(True, int) is True in Python,
        # so checking bool first ensures booleans are counted separately.
        if isinstance(item, bool):
            counts['bool_count'] += 1
        elif isinstance(item, int):
            counts['int_count'] += 1
        elif isinstance(item, float):
            counts['float_count'] += 1
        elif isinstance(item, str):
            counts['str_count'] += 1
        else:
            counts['other_count'] += 1

    return counts


# --- Expected output ---
# analyze_and_convert(42)      -> {'original_type': 'int',   'is_numeric': True,  'as_string': '42',    'as_float': 42.0}
# analyze_and_convert(3.14)    -> {'original_type': 'float', 'is_numeric': True,  'as_string': '3.14',  'as_float': 3.14}
# analyze_and_convert('123')   -> {'original_type': 'str',   'is_numeric': False, 'as_string': '123',   'as_float': 123.0}
# analyze_and_convert('hello') -> {'original_type': 'str',   'is_numeric': False, 'as_string': 'hello', 'as_float': None}
#
# summarize_list([1, 2.5, 'hi', True, None, 'world', 7])
#   -> {'int_count': 2, 'float_count': 1, 'str_count': 2, 'bool_count': 1, 'other_count': 1}
if __name__ == '__main__':
    print(analyze_and_convert(42))
    print(analyze_and_convert(3.14))
    print(analyze_and_convert('123'))
    print(analyze_and_convert('hello'))
    print()
    print(summarize_list([1, 2.5, 'hi', True, None, 'world', 7]))
`,
    },
    {
      id: "user-input",
      slug: "user-input",
      title: "Reading User Input with input()",
      content: `# Reading User Input with \`input()\`

So far, your programs have worked entirely with values you typed directly into the code. But real programs talk *with* users — they ask questions, wait for answers, and then act on what they receive. Python's built-in \`input()\` function is the gateway between your program and the keyboard.

In this lesson you'll learn exactly what \`input()\` does, why its return value surprises many beginners, and how to convert that value so you can use it in calculations.

---

## How \`input()\` Works

When Python encounters \`input()\`, it does three things:

1. **Prints a prompt** (optional text you supply) to the terminal
2. **Pauses** and waits for the user to type something and press Enter
3. **Returns** whatever the user typed — as a string

\`\`\`concept
{ "title": "input() Always Returns a String", "variant": "rule", "content": "No matter what the user types — a number, a date, a single letter — input() wraps it in quotes and hands it back as a str. This is the single most important fact about input()." }
\`\`\`

Here is the simplest possible usage:

\`\`\`python
name = input("What is your name? ")
print("Hello,", name)
\`\`\`

The string \`"What is your name? "\` is the **prompt** — it appears on the same line where the cursor blinks. The trailing space before the closing quote is a style convention: it keeps the user's typed text from bumping into the question.

---

## Watching \`input()\` in Action

The trace below walks through a program step by step. Imagine the user types \`Alice\` when prompted.

\`\`\`trace
{ "title": "Tracing input() execution", "language": "python", "code": "name = input(\\"What is your name? \\")\\ngreeting = \\"Hello, \\" + name + \\"!\\"\\nprint(greeting)", "frames": [ { "line": 1, "vars": {}, "note": "Program pauses here. Terminal shows: What is your name? ", "stdout": "What is your name? " }, { "line": 1, "vars": { "name": "\\"Alice\\"" }, "note": "User typed Alice and pressed Enter. name now holds the string 'Alice'.", "stdout": "What is your name? Alice" }, { "line": 2, "vars": { "name": "\\"Alice\\"", "greeting": "\\"Hello, Alice!\\"" }, "note": "String concatenation builds the greeting.", "stdout": "" }, { "line": 3, "vars": { "name": "\\"Alice\\"", "greeting": "\\"Hello, Alice!\\"" }, "note": "print() outputs the greeting.", "stdout": "Hello, Alice!" } ], "speed": 900 }
\`\`\`

---

## The String Trap

Here is where almost every beginner gets caught. Run this mentally — what do you expect?

\`\`\`python
age = input("How old are you? ")
next_year = age + 1
print("Next year you will be", next_year)
\`\`\`

If you guessed the program would print something like \`Next year you will be 22\`, you'll be surprised: **Python raises a \`TypeError\`**.

\`\`\`callout
{ "type": "danger", "title": "TypeError: can only concatenate str (not \\"int\\") to str", "content": "Because input() returns a string, \`age\` holds \`\\"21\\"\`, not \`21\`. You cannot add an integer to a string. Python refuses and throws a TypeError." }
\`\`\`

The fix is **type conversion** — wrapping the call to \`input()\` with \`int()\` or \`float()\`:

\`\`\`python
age = int(input("How old are you? "))   # converts "21" → 21
next_year = age + 1
print("Next year you will be", next_year)
\`\`\`

Now \`age\` is a proper integer and arithmetic works.

---

## Type Conversion at a Glance

\`\`\`tabs
{ "tabs": [ { "label": "int()", "icon": "🔢", "content": "Use \`int()\` when you need a **whole number** — counts, ages, indices, years.\\n\\n\`\`\`python\\nquantity = int(input(\\"How many items? \\"))\\ntotal = quantity * 4.99\\nprint(\\"Total: $\\", total)\\n\`\`\`\\n\\n\`int()\` will raise \`ValueError\` if the user types a decimal like \`3.5\` or text like \`three\`. Validate input in production code." }, { "label": "float()", "icon": "📐", "content": "Use \`float()\` when you need a **decimal number** — prices, temperatures, measurements.\\n\\n\`\`\`python\\ntemperature = float(input(\\"Enter temperature in Celsius: \\"))\\nfahrenheit = (temperature * 9 / 5) + 32\\nprint(fahrenheit, \\"°F\\")\\n\`\`\`\\n\\n\`float()\` accepts both \`\\"3.14\\"\` and \`\\"3\\"\` (converts to \`3.0\`), making it more flexible than \`int()\`." }, { "label": "str (default)", "icon": "🔤", "content": "You don't need to convert if you're working with **text** — names, cities, answers.\\n\\n\`\`\`python\\ncity = input(\\"Enter your city: \\")\\nprint(\\"Welcome from\\", city)\\n\`\`\`\\n\\nSince input() already returns a string, calling \`str()\` on it is redundant. Just use the value directly." } ] }
\`\`\`

---

## Try It: Your First Interactive Program

Run the playground below. Type any values you like when prompted.

\`\`\`playground
{ "title": "Rectangle Area Calculator", "language": "python", "code": "# Ask the user for dimensions\\nwidth = float(input(\\"Enter the width: \\"))\\nheight = float(input(\\"Enter the height: \\"))\\n\\n# Calculate\\narea = width * height\\nperimeter = 2 * (width + height)\\n\\n# Report\\nprint(\\"\\\\n--- Rectangle Report ---\\")\\nprint(\\"Width   :\\", width)\\nprint(\\"Height  :\\", height)\\nprint(\\"Area    :\\", area)\\nprint(\\"Perimeter:\\", perimeter)", "runnable": true }
\`\`\`

Notice that without \`float()\`, you wouldn't be able to multiply \`width * height\` — both would still be strings.

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the Temperature Converter", "prompt": "Fill in the blanks so the program reads a Celsius temperature from the user, converts it to Fahrenheit, and prints the result.", "language": "python", "template": "celsius = ___(input(\\"Enter temperature in Celsius: \\"))\\nfahrenheit = (celsius * 9 / 5) + 32\\nprint(\\"In Fahrenheit:\\", ___)", "blanks": [ { "answer": "float", "hint": "Temperature can be a decimal — which conversion function handles decimals?" }, { "answer": "fahrenheit", "hint": "What variable holds the converted result?" } ] }
\`\`\`

---

## A Closer Look: What Type Did I Get?

You can always check the type of a variable with the built-in \`type()\` function. This is a powerful debugging trick:

\`\`\`python
raw = input("Enter a number: ")   # User types 42
print(type(raw))                  # <class 'str'>

converted = int(raw)
print(type(converted))            # <class 'int'>
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Debug with type()", "content": "When you're unsure whether a value is a string or a number, wrap it in \`type()\` and print it. You'll see \`<class 'str'>\`, \`<class 'int'>\`, or \`<class 'float'>\` — no more guessing." }
\`\`\`

---

## Common Mistakes & How to Fix Them

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Broken — missing conversion", "code": "score = input(\\"Enter your score: \\")\\ndouble = score * 2\\nprint(double)\\n# User types 50 → prints '5050' not 100\\n# str * int repeats the string!" }, "after": { "label": "Fixed — convert first", "code": "score = int(input(\\"Enter your score: \\"))\\ndouble = score * 2\\nprint(double)\\n# User types 50 → prints 100 ✓" } }
\`\`\`

The "broken" version actually *runs* without an error — \`\\"50\\" * 2\` is legal Python (it repeats the string to produce \`\\"5050\\"\`). This silent wrong answer is more dangerous than a crash, because you might not notice.

---

## Knowledge Check

\`\`\`quiz
{ "title": "Quiz: Reading User Input", "questions": [ { "question": "What type does input() always return?", "options": ["int", "float", "str", "depends on what the user types"], "answer": 2, "explanation": "input() always returns a str (string), regardless of what the user types. Even if the user types 42, Python hands it back as the string '42'." }, { "question": "A user types 7.5 when prompted. Which conversion function should you use to do arithmetic with it?", "options": ["int()", "float()", "str()", "No conversion needed"], "answer": 1, "explanation": "float() converts a string like '7.5' to the decimal 7.5. int() would raise a ValueError on '7.5' because it contains a decimal point." }, { "question": "What will the following code print if the user types 3?\\n\\nside = input('Side length: ')\\nprint(side * 4)", "options": ["12", "3333", "TypeError", "ValueError"], "answer": 1, "explanation": "Because input() returns a string and side is never converted, side * 4 repeats the string '3' four times, producing '3333'. To get 12 you'd need int(input(...))." }, { "question": "Which line correctly reads a whole-number age from the user?", "options": ["age = input(int('How old are you? '))", "age = int(input('How old are you? '))", "age = input('How old are you? ', int)", "age = (input('How old are you?')).int()"], "answer": 1, "explanation": "The correct pattern is int(input(prompt)): first call input() to get the string, then wrap the whole call in int() to convert it." } ] }
\`\`\`

---

## Putting It All Together

Here is a complete mini-project that uses everything from this lesson — prompting, conversion, and arithmetic:

\`\`\`playground
{ "title": "Tip Calculator", "language": "python", "code": "print(\\"=== Tip Calculator ===\\")\\n\\nbill = float(input(\\"Enter the bill amount: $\\"))\\npeople = int(input(\\"Number of people splitting: \\"))\\ntip_percent = float(input(\\"Tip percentage (e.g. 18): \\"))\\n\\ntip_total = bill * (tip_percent / 100)\\ngrand_total = bill + tip_total\\nper_person = grand_total / people\\n\\nprint(\\"\\\\n--- Summary ---\\")\\nprint(f\\"Bill:        \\\\\${bill:.2f}\\")\\nprint(f\\"Tip ({tip_percent}%):  \\\\\${tip_total:.2f}\\")\\nprint(f\\"Grand Total: \\\\\${grand_total:.2f}\\")\\nprint(f\\"Per Person:  \\\\\${per_person:.2f}\\")", "runnable": true }
\`\`\`

Every value from the user is immediately converted — \`float\` for money amounts, \`int\` for the head count. Without those conversions, none of the arithmetic would work.

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "input(prompt) prints a prompt, pauses execution, and returns whatever the user types as a string.", "input() ALWAYS returns str — even if the user types a number.", "Use int(input(...)) for whole numbers and float(input(...)) for decimals before doing arithmetic.", "Forgetting to convert leads to silent bugs (string repetition) or loud crashes (TypeError) — both are bad.", "Use type() to inspect a variable's type whenever you're unsure what you're working with." ] }
\`\`\``,
      starterCode: `# Exercise: Simple Calculator with User Input
# Practice reading input and converting types for calculations

# TODO: Ask the user to enter the first number
# Use input() with a helpful prompt like "Enter first number: "
first = 

# TODO: Ask the user to enter the second number
second = 

# TODO: Convert both inputs to floats so we can do math
# Remember: input() always returns a string!
first = 
second = 

# TODO: Calculate the sum, difference, product, and quotient
sum_result = 
diff_result = 
prod_result = 
quot_result = 

# TODO: Print each result on its own line with a label
# Example output:
# Sum: 15.0
# Difference: 5.0
# Product: 50.0
# Quotient: 2.0
`,
      solutionCode: `# Exercise: Simple Calculator with User Input
# Practice reading input and converting types for calculations

# Read the first number from the user
# input() returns a string, so we convert it to float immediately
first = float(input("Enter first number: "))

# Read the second number from the user
second = float(input("Enter second number: "))

# Perform all four basic arithmetic operations
sum_result = first + second
diff_result = first - second
prod_result = first * second
quot_result = first / second

# Display each result with a descriptive label
print("Sum:", sum_result)
print("Difference:", diff_result)
print("Product:", prod_result)
print("Quotient:", quot_result)
`,
    },
    {
      id: "variables-checkpoint",
      slug: "variables-checkpoint",
      title: "Checkpoint: Variables and Types Practice",
      content: `# Checkpoint: Variables and Types Practice

You've learned the building blocks — variables, data types, operators, and type conversion. Now it's time to **put them to work**. In this checkpoint you'll build two small but real programs: a **unit converter** and a **tip calculator**. By the end, you'll have written code that takes input, does math with mixed types, and formats output cleanly.

---

## What You're Building

| Project | Skills Used |
|---|---|
| Unit Converter (km → miles, °C → °F) | \`float\`, arithmetic operators, \`round()\`, \`str()\` |
| Tip Calculator | \`float\`, \`int\`, division, type conversion, \`print()\` formatting |

Both projects fit in under 10 lines each — but every line will exercise something important.

---

\`\`\`concept
{ "title": "Checkpoint Mindset", "variant": "mental-model", "content": "A checkpoint isn't a test you pass or fail — it's a stress test for your mental model. If something breaks, that's the point. The error message is your teacher. Read it, fix it, move on stronger." }
\`\`\`

---

## Part 1 — Unit Converter

### The Goal

Convert kilometers to miles and Celsius to Fahrenheit using fixed conversion formulas:

- **km → miles:** multiply by \`0.621371\`
- **°C → °F:** multiply by \`9/5\`, then add \`32\`

### Step-by-Step Walkthrough

\`\`\`steps
{ "title": "Building the Unit Converter", "steps": [ { "title": "Store the input values", "content": "Decide what values to convert. Use \`float\` since distances and temperatures can be decimals:\\n\\n\`\`\`python\\nkm = 10.0\\ncelsius = 100.0\\n\`\`\`" }, { "title": "Apply the conversion formulas", "content": "Multiply and add using Python's arithmetic operators:\\n\\n\`\`\`python\\nmiles = km * 0.621371\\nfahrenheit = (celsius * 9/5) + 32\\n\`\`\`\\n\\nNotice the parentheses — they enforce order of operations, just like in math." }, { "title": "Round the results", "content": "Raw floats can produce many decimal places. Use \`round(value, digits)\` to keep it readable:\\n\\n\`\`\`python\\nmiles = round(km * 0.621371, 2)\\nfahrenheit = round((celsius * 9/5) + 32, 2)\\n\`\`\`" }, { "title": "Print a clean output", "content": "Combine strings and numbers using \`str()\` conversion:\\n\\n\`\`\`python\\nprint(str(km) + \\" km = \\" + str(miles) + \\" miles\\")\\nprint(str(celsius) + \\"°C = \\" + str(fahrenheit) + \\"°F\\")\\n\`\`\`\\n\\nOr use an f-string (with escaped dollar signs for safety):\\n\\n\`\`\`python\\nprint(f\\"{km} km = {miles} miles\\")\\nprint(f\\"{celsius}°C = {fahrenheit}°F\\")\\n\`\`\`" } ] }
\`\`\`

Now run it yourself:

\`\`\`playground
{ "title": "Unit Converter", "language": "python", "code": "# Unit Converter\\n# Try changing the values below!\\n\\nkm = 10.0\\ncelsius = 100.0\\n\\n# Convert km to miles\\nmiles = round(km * 0.621371, 2)\\n\\n# Convert Celsius to Fahrenheit\\nfahrenheit = round((celsius * 9 / 5) + 32, 2)\\n\\n# Print results\\nprint(str(km) + \\" km = \\" + str(miles) + \\" miles\\")\\nprint(str(celsius) + \\"C = \\" + str(fahrenheit) + \\"F\\")", "runnable": true }
\`\`\`

**Challenge:** Change \`km\` to \`42.195\` (a marathon!) and \`celsius\` to \`37\` (body temperature). What do you get?

---

## Tracing the Type Conversions

Let's watch what happens to types as the unit converter runs line by line:

\`\`\`trace
{ "title": "Type Flow Through the Unit Converter", "language": "python", "code": "km = 10.0\\nmiles_raw = km * 0.621371\\nmiles = round(miles_raw, 2)\\nresult = str(km) + \\" km = \\" + str(miles) + \\" miles\\"\\nprint(result)", "frames": [ { "line": 1, "vars": { "km": "10.0 (float)" }, "note": "km is assigned a float literal (the .0 makes it float, not int)", "stdout": "" }, { "line": 2, "vars": { "km": "10.0 (float)", "miles_raw": "6.21371 (float)" }, "note": "float * float = float. Python keeps the type consistent.", "stdout": "" }, { "line": 3, "vars": { "km": "10.0 (float)", "miles_raw": "6.21371 (float)", "miles": "6.21 (float)" }, "note": "round() returns a float here — it keeps the decimal type.", "stdout": "" }, { "line": 4, "vars": { "km": "10.0 (float)", "miles": "6.21 (float)", "result": "\\"10.0 km = 6.21 miles\\" (str)" }, "note": "str() converts both floats to strings so we can concatenate with +", "stdout": "" }, { "line": 5, "vars": {}, "note": "print() outputs the final string", "stdout": "10.0 km = 6.21 miles" } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "You cannot add a string and a number directly", "content": "Python is **strongly typed** — it will raise a \`TypeError\` if you try \`\\"Distance: \\" + 10.0\`. You must explicitly convert: \`\\"Distance: \\" + str(10.0)\`. This is a feature, not a bug — it prevents silent data corruption." }
\`\`\`

---

## Part 2 — Tip Calculator

### The Goal

Given a restaurant bill amount and a tip percentage, calculate:
1. The tip amount
2. The total bill
3. The split per person (if dining with a group)

\`\`\`playground
{ "title": "Tip Calculator", "language": "python", "code": "# Tip Calculator\\n\\nbill = 85.50          # float: the bill before tip\\ntip_percent = 18      # int: tip percentage\\nnum_people = 4        # int: splitting the bill\\n\\n# Calculate tip and total\\ntip_amount = bill * (tip_percent / 100)\\ntotal = bill + tip_amount\\nper_person = total / num_people\\n\\n# Round to 2 decimal places\\ntip_amount = round(tip_amount, 2)\\ntotal = round(total, 2)\\nper_person = round(per_person, 2)\\n\\nprint(\\"Bill:        $\\" + str(bill))\\nprint(\\"Tip (18%):   $\\" + str(tip_amount))\\nprint(\\"Total:       $\\" + str(total))\\nprint(\\"Per person:  $\\" + str(per_person))", "runnable": true }
\`\`\`

**Challenges to try:**
- Change \`tip_percent\` to \`20\` — what does the total become?
- Change \`num_people\` to \`1\` — what happens to \`per_person\`?
- What if \`bill = 0\`? Try it — Python handles it gracefully.

---

## The Type Conversion Trap

Here's a classic beginner mistake. Can you spot the bug?

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Broken — TypeError", "code": "tip_percent = \\"18\\"  # stored as a string!\\nbill = 85.50\\n\\n# This crashes: can't multiply float by string\\ntip_amount = bill * (tip_percent / 100)" }, "after": { "label": "Fixed — explicit conversion", "code": "tip_percent = \\"18\\"  # still a string input\\nbill = 85.50\\n\\n# Convert to int BEFORE doing math\\ntip_amount = bill * (int(tip_percent) / 100)" } }
\`\`\`

This matters in the real world because **user input always arrives as a string**. When you read data from a form, a file, or a command prompt, Python gives it to you as \`str\`. You must convert it to \`int\` or \`float\` before doing arithmetic.

\`\`\`callout
{ "type": "insight", "title": "Typecasting creates a copy — it doesn't change the original", "content": "When you write \`int(tip_percent)\`, you get a **new integer value** — the variable \`tip_percent\` still holds \`\\"18\\"\` (a string). To actually change the variable, reassign it: \`tip_percent = int(tip_percent)\`. This surprises many beginners who expect \`int(x)\` to modify \`x\` in place." }
\`\`\`

---

## Fill-in-the-Blanks Practice

\`\`\`fillblank
{ "title": "Complete the Tip Calculator", "prompt": "Fill in the blanks to complete this tip calculator. The bill is stored as a string (simulating user input) and needs to be converted before math.", "language": "python", "template": "# Bill comes in as a string from user input\\nbill_str = \\"65.00\\"\\ntip_percent = 15\\n\\n# Convert bill to a float for arithmetic\\nbill = ___(bill_str)\\n\\n# Calculate the tip amount\\ntip = bill * (tip_percent / ___)\\n\\n# Round to 2 decimal places\\ntip = round(tip, ___)\\n\\nprint(\\"Tip: $\\" + ___(tip))", "blanks": [ { "answer": "float", "hint": "Which function converts a string like '65.00' to a decimal number?" }, { "answer": "100", "hint": "To convert a percentage to a decimal, divide by what number?" }, { "answer": "2", "hint": "We want 2 decimal places for currency" }, { "answer": "str", "hint": "To concatenate a number with a string using +, you need to convert it first" } ] }
\`\`\`

---

## Visualizing Variable Reassignment

One of the biggest misconceptions: does changing \`y\` affect \`x\` after \`x = y\`?

\`\`\`algoviz
{ "title": "Variable Independence — Immutable Types", "type": "array", "data": [42, 42, 99], "frames": [ { "highlight": [0], "label": "y = 42: y holds the value 42", "stats": { "y": 42 } }, { "highlight": [0, 1], "label": "x = y: x gets a COPY of y's value (42). No link is created.", "stats": { "y": 42, "x": 42 } }, { "highlight": [2], "label": "y = 99: y is reassigned to 99. x is NOT affected.", "stats": { "y": 99, "x": 42 } } ], "speed": 1000 }
\`\`\`

For numbers and strings (immutable types), \`x = y\` copies the value. After that, \`x\` and \`y\` are independent. This is different from mutable types like lists — but that's a topic for a future module.

---

## Common Type Errors — Decoded

\`\`\`tabs
{ "tabs": [ { "label": "TypeError", "icon": "🔴", "content": "**What it looks like:**\\n\`\`\`\\nTypeError: can only concatenate str (not \\"float\\") to str\\n\`\`\`\\n\\n**What it means:** You tried to use \`+\` between a string and a number.\\n\\n**How to fix:**\\n\`\`\`python\\n# Wrong\\nprint(\\"Total: \\" + 10.5)\\n\\n# Right\\nprint(\\"Total: \\" + str(10.5))\\n\`\`\`" }, { "label": "ValueError", "icon": "🟡", "content": "**What it looks like:**\\n\`\`\`\\nValueError: could not convert string to float: 'abc'\\n\`\`\`\\n\\n**What it means:** You called \`float()\` or \`int()\` on a string that doesn't contain a valid number.\\n\\n**How to fix:**\\n\`\`\`python\\n# This crashes\\nbill = float(\\"abc\\")\\n\\n# Make sure the string is actually a number\\nbill = float(\\"85.50\\")   # works fine\\n\`\`\`" }, { "label": "NameError", "icon": "🟠", "content": "**What it looks like:**\\n\`\`\`\\nNameError: name 'total' is not defined\\n\`\`\`\\n\\n**What it means:** You used a variable before assigning it a value.\\n\\n**How to fix:**\\n\`\`\`python\\n# Wrong — using before defining\\nprint(total)\\ntotal = bill + tip\\n\\n# Right — define first, use after\\ntotal = bill + tip\\nprint(total)\\n\`\`\`" }, { "label": "ZeroDivisionError", "icon": "🔵", "content": "**What it looks like:**\\n\`\`\`\\nZeroDivisionError: division by zero\\n\`\`\`\\n\\n**What it means:** You divided by \`0\` or a variable holding \`0\`.\\n\\n**Common scenario in tip calculator:**\\n\`\`\`python\\nnum_people = 0\\nper_person = total / num_people  # crashes!\\n\`\`\`\\n\\n**Quick fix for now:** Make sure \`num_people\` is at least \`1\`. Later modules will teach you how to validate input properly." } ] }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Variables and Types — Checkpoint Quiz", "questions": [ { "question": "What will \`type(7 / 2)\` return in Python 3?", "options": [ "<class 'int'>", "<class 'float'>", "<class 'str'>", "TypeError" ], "answer": 1, "explanation": "In Python 3, the \`/\` operator always returns a float, even when dividing two integers. \`7 / 2\` gives \`3.5\`, which is a float. Use \`//\` if you want integer (floor) division." }, { "question": "What happens when you run this code?\\n\\n\`\`\`python\\nx = 10\\ny = x\\nx = 99\\nprint(y)\\n\`\`\`", "options": [ "Prints 99 because y is linked to x", "Prints 10 because y copied x's value at assignment time", "Raises a NameError", "Prints None" ], "answer": 1, "explanation": "When you write \`y = x\`, Python copies the value of \`x\` (which was \`10\`) into \`y\`. Integers are immutable, so \`y\` holds its own independent copy. Reassigning \`x = 99\` has no effect on \`y\`." }, { "question": "Which of these will raise a TypeError?", "options": [ "str(42) + \\" items\\"", "float(\\"3.14\\") + 1", "\\"Price: \\" + 9.99", "int(\\"100\\") * 2" ], "answer": 2, "explanation": "Python is strongly typed and will not implicitly convert \`9.99\` (float) to a string for concatenation. You must write \`\\"Price: \\" + str(9.99)\` explicitly. The other options all work because the types involved are compatible." }, { "question": "You write \`tip_percent = int(\\"18\\")\`. What is the type of \`tip_percent\` after this line?", "options": [ "str, because it started as a string", "int, because int() converts and returns a new integer", "float, because percentages are decimals", "NoneType" ], "answer": 1, "explanation": "\`int(\\"18\\")\` creates a new integer value and assigns it to \`tip_percent\`. After this line, \`tip_percent\` is \`18\` as an integer. Python's dynamic typing means the variable's type is determined by whatever value it currently holds — and reassigning with \`int()\` changes it to \`int\`." }, { "question": "What does \`round(6.21371, 2)\` return?", "options": [ "6", "6.2", "6.21", "6.214" ], "answer": 2, "explanation": "\`round(number, ndigits)\` rounds to the specified number of decimal places. \`round(6.21371, 2)\` keeps 2 decimal places and returns \`6.21\`." } ] }
\`\`\`

---

## Putting It Together — Full Combined Program

Here's both projects combined into one clean script. Read through it, then modify it to add a new conversion:

\`\`\`playground
{ "title": "Unit Converter + Tip Calculator", "language": "python", "code": "# ============================================\\n# UNIT CONVERTER\\n# ============================================\\n\\nkm = 42.195          # Marathon distance\\ncelsius = 37.0       # Body temperature\\n\\nmiles = round(km * 0.621371, 2)\\nfahrenheit = round((celsius * 9 / 5) + 32, 2)\\n\\nprint(\\"=== Unit Converter ===\\")\\nprint(str(km) + \\" km  ->  \\" + str(miles) + \\" miles\\")\\nprint(str(celsius) + \\"C   ->  \\" + str(fahrenheit) + \\"F\\")\\n\\nprint(\\"\\")\\n\\n# ============================================\\n# TIP CALCULATOR\\n# ============================================\\n\\nbill = 85.50\\ntip_percent = 18\\nnum_people = 4\\n\\ntip_amount = round(bill * (tip_percent / 100), 2)\\ntotal = round(bill + tip_amount, 2)\\nper_person = round(total / num_people, 2)\\n\\nprint(\\"=== Tip Calculator ===\\")\\nprint(\\"Bill:       $\\" + str(bill))\\nprint(\\"Tip (18%):  $\\" + str(tip_amount))\\nprint(\\"Total:      $\\" + str(total))\\nprint(\\"Per person: $\\" + str(per_person))", "runnable": true }
\`\`\`

**Extension challenges:**
1. Add a kg → pounds conversion (\`1 kg = 2.20462 lbs\`)
2. Change \`tip_percent\` to \`20\` and see how the output changes
3. What happens if you set \`bill = 0\`? Is the output sensible?

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Variables store values — they are named memory locations, not math equations. Reassigning one variable never automatically changes another.", "Python is dynamically typed — the type is determined by the value assigned, not by any declaration. \`x = 10\` makes x an int; \`x = 10.0\` makes it a float.", "Type conversion is explicit and non-destructive — \`int(a)\` returns a new integer; \`a\` is unchanged unless you write \`a = int(a)\`.", "You cannot mix incompatible types with operators — \`'hello' + 5\` raises a TypeError. Use \`str()\`, \`int()\`, or \`float()\` to convert first.", "Real programs constantly move data between types — string input from users must be converted before arithmetic, and numbers must be converted to strings before concatenation." ] }
\`\`\`

---

## What's Next?

You've just written real programs that convert real units and calculate real bills. These same patterns — store a value, do math on it, convert types, print output — appear in every Python program you'll ever write.

In the next module, you'll add **control flow**: \`if\` statements and loops that let your programs make decisions and repeat actions. The unit converter and tip calculator will get smarter.`,
      starterCode: `# Checkpoint: Variables and Types Practice
# Build a unit converter and tip calculator

# ─── PART 1: Unit Converter ───────────────────────────────────────────────────

# TODO: Create a variable \`celsius\` and assign it the value 100
celsius = None

# TODO: Convert celsius to fahrenheit using the formula: (C * 9/5) + 32
# Store the result in a variable called \`fahrenheit\`
fahrenheit = None

# TODO: Print the result using an f-string:
# Expected output: "100°C = 212.0°F"
print()

# TODO: Create a variable \`miles\` and assign it the value 26.2
miles = None

# TODO: Convert miles to kilometers (1 mile = 1.60934 km)
# Store the result in \`kilometers\`, rounded to 2 decimal places using round()
kilometers = None

# TODO: Print the result using an f-string:
# Expected output: "26.2 miles = 42.16 km"
print()


# ─── PART 2: Tip Calculator ────────────────────────────────────────────────────

# TODO: Create a variable \`bill_amount\` and assign it 47.50 (a float)
bill_amount = None

# TODO: Create a variable \`tip_percent\` and assign it 18 (an integer)
tip_percent = None

# TODO: Calculate the tip amount
# Hint: convert tip_percent to a decimal by dividing by 100
tip_amount = None

# TODO: Calculate the total bill (bill + tip)
total = None

# TODO: Print the breakdown using f-strings:
# Expected output:
#   Bill:  $47.50
#   Tip:   $8.55
#   Total: $56.05
print()
print()
print()


# ─── PART 3: Type Conversion ──────────────────────────────────────────────────

# TODO: The variable below is a string. Convert it to a float and store in \`price\`.
price_str = "9.99"
price = None

# TODO: Calculate a 10% discount on \`price\` and store in \`discounted\`
discounted = None

# TODO: Convert \`discounted\` to an integer (truncates decimals) and store in \`discounted_int\`
discounted_int = None

# TODO: Print both values and their types:
# Expected output:
#   Discounted price: 8.991  <class 'float'>
#   As integer:       8      <class 'int'>
print()
print()
`,
      solutionCode: `# Checkpoint: Variables and Types Practice
# Build a unit converter and tip calculator

# ─── PART 1: Unit Converter ───────────────────────────────────────────────────

# Assign the temperature in Celsius
celsius = 100

# Convert to Fahrenheit: multiply by 9/5, then add 32
fahrenheit = (celsius * 9/5) + 32

# f-string interpolates the variable values directly into the string
print(f"{celsius}°C = {fahrenheit}°F")   # 100°C = 212.0°F

# Marathon distance in miles
miles = 26.2

# 1 mile = 1.60934 km; round() limits decimal places
kilometers = round(miles * 1.60934, 2)

print(f"{miles} miles = {kilometers} km")  # 26.2 miles = 42.16 km


# ─── PART 2: Tip Calculator ────────────────────────────────────────────────────

bill_amount = 47.50   # float — dollars and cents
tip_percent = 18      # int — whole-number percentage

# Dividing by 100 converts the integer percentage to a decimal multiplier
tip_amount = round(bill_amount * (tip_percent / 100), 2)

total = round(bill_amount + tip_amount, 2)

# :.2f format specifier ensures exactly 2 decimal places are shown
print(f"Bill:  \\\${bill_amount:.2f}")   # Bill:  $47.50
print(f"Tip:   \\\${tip_amount:.2f}")    # Tip:   $8.55
print(f"Total: \\\${total:.2f}")         # Total: $56.05


# ─── PART 3: Type Conversion ──────────────────────────────────────────────────

price_str = "9.99"

# float() converts a string to a floating-point number
price = float(price_str)

# Calculate 10% discount
discounted = price * 0.90

# int() truncates (drops) the decimal — it does NOT round
discounted_int = int(discounted)

# type() returns the runtime type of any value
print(f"Discounted price: {discounted}  {type(discounted)}")   # 8.991  <class 'float'>
print(f"As integer:       {discounted_int}      {type(discounted_int)}")  # 8      <class 'int'>
`,
    },
  ],
};
