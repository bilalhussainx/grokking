import { Module } from "../types";

export const variablesAndTypesModule: Module = {
  id: "variables-and-types",
  title: "Variables & Data Types",
  description: "Learn how Python stores data — variables, strings, numbers, booleans, and how to convert between types.",
  lessons: [
    {
      id: "variables-intro",
      slug: "variables-intro",
      title: "Introduction to Variables",
      content: `## What Are Variables?

A **variable** is a name that refers to a value stored in your computer's memory. Think of it as a labeled box where you can put data.

### Creating Variables in Python

Python makes creating variables easy — just pick a name and use \`=\` to assign a value:

\`\`\`python
name = "Alice"
age = 25
height = 5.6
is_student = True
\`\`\`

Notice that you **do not** need to declare the type — Python figures it out automatically. This is called **dynamic typing**.

### Python's Core Data Types

| Type | Example | Description |
|------|---------|-------------|
| \`str\` | \`"hello"\` | Text (string) |
| \`int\` | \`42\` | Whole number |
| \`float\` | \`3.14\` | Decimal number |
| \`bool\` | \`True\` / \`False\` | Boolean (yes/no) |

### Checking a Variable's Type

Use the built-in \`type()\` function:

\`\`\`python
x = 42
print(type(x))  # <class 'int'>
\`\`\`

### Naming Rules

- Must start with a letter or underscore (\`_\`)
- Can contain letters, digits, and underscores
- Case-sensitive: \`Age\` and \`age\` are different variables
- Convention: use \`snake_case\` for variable names (e.g., \`first_name\`)

### Key Takeaway

Variables are the building blocks of every program. In the next lessons, you will practice working with strings, numbers, and type conversions.`,
    },
    {
      id: "variables-string-ops",
      slug: "string-operations",
      title: "String Operations",
      content: `## String Operations

Strings are sequences of characters enclosed in quotes. Python provides many powerful operations for working with text.

### Creating Strings

\`\`\`python
single = 'hello'
double = "hello"
multi_line = """This is
a multi-line string"""
\`\`\`

### Common String Operations

| Operation | Example | Result |
|-----------|---------|--------|
| Concatenation | \`"hi" + " there"\` | \`"hi there"\` |
| Repetition | \`"ha" * 3\` | \`"hahaha"\` |
| Length | \`len("hello")\` | \`5\` |
| Indexing | \`"hello"[0]\` | \`"h"\` |
| Slicing | \`"hello"[1:4]\` | \`"ell"\` |
| Upper | \`"hello".upper()\` | \`"HELLO"\` |
| Lower | \`"HELLO".lower()\` | \`"hello"\` |
| Strip | \`"  hi  ".strip()\` | \`"hi"\` |
| Replace | \`"hello".replace("l", "r")\` | \`"herro"\` |
| Find | \`"hello".find("ll")\` | \`2\` |

### F-Strings (Formatted Strings)

The modern way to embed variables inside strings:

\`\`\`python
name = "Alice"
age = 25
print(f"{name} is {age} years old")
\`\`\`

### Your Task

Complete the functions below to practice string operations.`,
      starterCode: `def greet(name):
    """Return a greeting string: 'Hello, <name>! Welcome aboard.'"""
    # TODO: Use an f-string to create the greeting
    pass

def extract_initials(full_name):
    """Given a full name like 'John Doe', return initials 'J.D.'"""
    # TODO: Split the name, take first letter of each part,
    # join with dots, and add a trailing dot
    pass

def censor_word(text, word):
    """Replace all occurrences of 'word' in 'text' with asterisks of the same length."""
    # TODO: Replace the word with '*' repeated len(word) times
    pass

def reverse_string(s):
    """Return the reverse of the string s."""
    # TODO: Use slicing to reverse the string
    pass

# Test cases
print(greet("Alice"))
# Expected: Hello, Alice! Welcome aboard.

print(extract_initials("John Doe"))
# Expected: J.D.

print(extract_initials("Ada Lovelace Byron"))
# Expected: A.L.B.

print(censor_word("I love cats and cats love me", "cats"))
# Expected: I love **** and **** love me

print(reverse_string("Python"))
# Expected: nohtyP`,
      solutionCode: `def greet(name):
    """Return a greeting string: 'Hello, <name>! Welcome aboard.'"""
    return f"Hello, {name}! Welcome aboard."

def extract_initials(full_name):
    """Given a full name like 'John Doe', return initials 'J.D.'"""
    parts = full_name.split()
    initials = ".".join(part[0].upper() for part in parts)
    return initials + "."

def censor_word(text, word):
    """Replace all occurrences of 'word' in 'text' with asterisks of the same length."""
    return text.replace(word, "*" * len(word))

def reverse_string(s):
    """Return the reverse of the string s."""
    return s[::-1]

# Test cases
print(greet("Alice"))
# Expected: Hello, Alice! Welcome aboard.

print(extract_initials("John Doe"))
# Expected: J.D.

print(extract_initials("Ada Lovelace Byron"))
# Expected: A.L.B.

print(censor_word("I love cats and cats love me", "cats"))
# Expected: I love **** and **** love me

print(reverse_string("Python"))
# Expected: nohtyP`,
    },
    {
      id: "variables-number-ops",
      slug: "number-operations",
      title: "Number Operations",
      content: `## Number Operations

Python supports integers (\`int\`) and floating-point numbers (\`float\`). Let's explore the arithmetic operations available.

### Arithmetic Operators

| Operator | Name | Example | Result |
|----------|------|---------|--------|
| \`+\` | Addition | \`5 + 3\` | \`8\` |
| \`-\` | Subtraction | \`5 - 3\` | \`2\` |
| \`*\` | Multiplication | \`5 * 3\` | \`15\` |
| \`/\` | Division | \`7 / 2\` | \`3.5\` |
| \`//\` | Floor Division | \`7 // 2\` | \`3\` |
| \`%\` | Modulus | \`7 % 2\` | \`1\` |
| \`**\` | Exponentiation | \`2 ** 3\` | \`8\` |

### Useful Built-in Functions

\`\`\`python
abs(-5)       # 5 (absolute value)
round(3.7)    # 4
round(3.14159, 2)  # 3.14
min(3, 1, 4)  # 1
max(3, 1, 4)  # 4
\`\`\`

### Integer vs Float

Division with \`/\` always returns a float. Use \`//\` for integer division:

\`\`\`python
10 / 3   # 3.3333...
10 // 3  # 3
\`\`\`

### Your Task

Complete the functions below that perform common number calculations.`,
      starterCode: `def calculate_circle_area(radius):
    """Calculate the area of a circle given its radius. Use pi = 3.14159"""
    # TODO: Area = pi * radius^2
    pass

def celsius_to_fahrenheit(celsius):
    """Convert Celsius to Fahrenheit. Formula: F = C * 9/5 + 32"""
    # TODO: Apply the formula
    pass

def is_even(number):
    """Return True if the number is even, False otherwise."""
    # TODO: Use the modulus operator
    pass

def digital_root(n):
    """Keep summing the digits of n until you get a single digit.
    Example: 493 -> 4+9+3 = 16 -> 1+6 = 7"""
    # TODO: Use a while loop and modulus/division to sum digits
    pass

# Test cases
print(calculate_circle_area(5))
# Expected: 78.53975

print(celsius_to_fahrenheit(0))
# Expected: 32.0

print(celsius_to_fahrenheit(100))
# Expected: 212.0

print(is_even(4))
# Expected: True

print(is_even(7))
# Expected: False

print(digital_root(493))
# Expected: 7

print(digital_root(9))
# Expected: 9`,
      solutionCode: `def calculate_circle_area(radius):
    """Calculate the area of a circle given its radius. Use pi = 3.14159"""
    pi = 3.14159
    return pi * radius ** 2

def celsius_to_fahrenheit(celsius):
    """Convert Celsius to Fahrenheit. Formula: F = C * 9/5 + 32"""
    return celsius * 9 / 5 + 32

def is_even(number):
    """Return True if the number is even, False otherwise."""
    return number % 2 == 0

def digital_root(n):
    """Keep summing the digits of n until you get a single digit.
    Example: 493 -> 4+9+3 = 16 -> 1+6 = 7"""
    while n >= 10:
        total = 0
        while n > 0:
            total += n % 10
            n //= 10
        n = total
    return n

# Test cases
print(calculate_circle_area(5))
# Expected: 78.53975

print(celsius_to_fahrenheit(0))
# Expected: 32.0

print(celsius_to_fahrenheit(100))
# Expected: 212.0

print(is_even(4))
# Expected: True

print(is_even(7))
# Expected: False

print(digital_root(493))
# Expected: 7

print(digital_root(9))
# Expected: 9`,
    },
    {
      id: "variables-type-conversion",
      slug: "type-conversion",
      title: "Type Conversion",
      content: `## Type Conversion

Sometimes you need to convert data from one type to another. Python provides built-in functions for this.

### Conversion Functions

| Function | Purpose | Example |
|----------|---------|---------|
| \`int()\` | Convert to integer | \`int("42")\` -> \`42\` |
| \`float()\` | Convert to float | \`float("3.14")\` -> \`3.14\` |
| \`str()\` | Convert to string | \`str(42)\` -> \`"42"\` |
| \`bool()\` | Convert to boolean | \`bool(0)\` -> \`False\` |

### Truthy and Falsy Values

In Python, some values are considered \`False\` when converted to boolean:

\`\`\`python
bool(0)      # False
bool(0.0)    # False
bool("")     # False
bool([])     # False (empty list)
bool(None)   # False
\`\`\`

Everything else is \`True\`.

### Common Pitfalls

\`\`\`python
# This works:
int("42")     # 42

# This crashes:
int("hello")  # ValueError!

# This truncates (does NOT round):
int(3.9)      # 3
\`\`\`

### Your Task

Complete the functions below to practice type conversion.`,
      starterCode: `def parse_user_input(input_string):
    """Given a string like '25', return the integer value.
    If the string cannot be converted, return -1."""
    # TODO: Try to convert to int using try/except
    pass

def format_price(cents):
    """Given a price in cents (integer), return a formatted string like '$12.50'"""
    # TODO: Convert cents to dollars (divide by 100), format as string
    pass

def truthy_count(values):
    """Given a list of values, count how many are truthy."""
    # TODO: Use bool() to test each value and count the truthy ones
    pass

def safe_divide(a, b):
    """Divide a by b. Return the result as a float rounded to 2 decimal places.
    If b is 0, return 'Cannot divide by zero'."""
    # TODO: Handle division by zero, round the result
    pass

# Test cases
print(parse_user_input("42"))
# Expected: 42

print(parse_user_input("hello"))
# Expected: -1

print(format_price(1250))
# Expected: $12.50

print(format_price(99))
# Expected: $0.99

print(truthy_count([1, 0, "", "hello", None, True, [], [1, 2]]))
# Expected: 4

print(safe_divide(10, 3))
# Expected: 3.33

print(safe_divide(10, 0))
# Expected: Cannot divide by zero`,
      solutionCode: `def parse_user_input(input_string):
    """Given a string like '25', return the integer value.
    If the string cannot be converted, return -1."""
    try:
        return int(input_string)
    except ValueError:
        return -1

def format_price(cents):
    """Given a price in cents (integer), return a formatted string like '$12.50'"""
    dollars = cents / 100
    return f"\${dollars:.2f}"

def truthy_count(values):
    """Given a list of values, count how many are truthy."""
    count = 0
    for v in values:
        if bool(v):
            count += 1
    return count

def safe_divide(a, b):
    """Divide a by b. Return the result as a float rounded to 2 decimal places.
    If b is 0, return 'Cannot divide by zero'."""
    if b == 0:
        return "Cannot divide by zero"
    return round(a / b, 2)

# Test cases
print(parse_user_input("42"))
# Expected: 42

print(parse_user_input("hello"))
# Expected: -1

print(format_price(1250))
# Expected: $12.50

print(format_price(99))
# Expected: $0.99

print(truthy_count([1, 0, "", "hello", None, True, [], [1, 2]]))
# Expected: 4

print(safe_divide(10, 3))
# Expected: 3.33

print(safe_divide(10, 0))
# Expected: Cannot divide by zero`,
    },
  ],
};
