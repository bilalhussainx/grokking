import { Module } from "../types";

export const loopsModule: Module = {
  id: "loops",
  title: "Loops",
  description:
    "Master for loops, while loops, range(), and loop control with break and continue.",
  lessons: [
    {
      id: "loops-intro",
      slug: "loops-intro",
      title: "Introduction to Loops",
      content: `## Loops — Repeating Actions

Loops let you execute code repeatedly. Python has two main loop types: \`for\` and \`while\`.

### The for Loop

Use \`for\` when you know how many times to iterate (or when iterating over a collection):

\`\`\`python
# Loop over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Loop with range
for i in range(5):      # 0, 1, 2, 3, 4
    print(i)

for i in range(2, 6):   # 2, 3, 4, 5
    print(i)

for i in range(0, 10, 2):  # 0, 2, 4, 6, 8
    print(i)
\`\`\`

### The while Loop

Use \`while\` when you do not know how many iterations you need:

\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

**Warning:** Always ensure the loop condition eventually becomes \`False\`, or you get an infinite loop!

### break and continue

| Keyword | Effect |
|---------|--------|
| \`break\` | Exit the loop immediately |
| \`continue\` | Skip to the next iteration |

\`\`\`python
for i in range(10):
    if i == 5:
        break        # Stops at 5
    if i % 2 == 0:
        continue     # Skips even numbers
    print(i)         # Prints: 1, 3
\`\`\`

### enumerate() — Index + Value

\`\`\`python
fruits = ["apple", "banana", "cherry"]
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
\`\`\`

### Nested Loops

\`\`\`python
for i in range(3):
    for j in range(3):
        print(f"({i},{j})", end=" ")
    print()  # New line after inner loop
\`\`\`

In the next lessons, you will put these building blocks into practice.`,
    },
    {
      id: "loops-sum-numbers",
      slug: "sum-of-numbers",
      title: "Sum of Numbers",
      content: `## Sum of Numbers

Practice using loops to accumulate values. You will write functions that calculate various sums.

### The Accumulator Pattern

\`\`\`python
total = 0           # Initialize accumulator
for num in numbers:
    total += num    # Add each element
# total now holds the sum
\`\`\`

### Hints

- \`range(1, n+1)\` gives you numbers 1 through n
- You can add conditions inside loops to sum only certain numbers
- For factorial: multiply instead of adding`,
      starterCode: `def sum_range(start, end):
    """Return the sum of all integers from start to end (inclusive)."""
    # TODO: Use a loop or the range function to sum numbers
    pass

def sum_even(n):
    """Return the sum of all even numbers from 1 to n (inclusive)."""
    # TODO: Loop through range, only add even numbers
    pass

def factorial(n):
    """Return n! (n factorial). 0! = 1."""
    # TODO: Multiply numbers from 1 to n
    pass

def sum_digits(number):
    """Return the sum of all digits in the number.
    Handle negative numbers by using absolute value."""
    # TODO: Use modulus and integer division to extract digits
    pass

# Test cases
print(sum_range(1, 5))
# Expected: 15

print(sum_range(3, 7))
# Expected: 25

print(sum_even(10))
# Expected: 30

print(sum_even(7))
# Expected: 12

print(factorial(5))
# Expected: 120

print(factorial(0))
# Expected: 1

print(sum_digits(1234))
# Expected: 10

print(sum_digits(-456))
# Expected: 15`,
      solutionCode: `def sum_range(start, end):
    """Return the sum of all integers from start to end (inclusive)."""
    total = 0
    for i in range(start, end + 1):
        total += i
    return total

def sum_even(n):
    """Return the sum of all even numbers from 1 to n (inclusive)."""
    total = 0
    for i in range(1, n + 1):
        if i % 2 == 0:
            total += i
    return total

def factorial(n):
    """Return n! (n factorial). 0! = 1."""
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

def sum_digits(number):
    """Return the sum of all digits in the number.
    Handle negative numbers by using absolute value."""
    number = abs(number)
    total = 0
    while number > 0:
        total += number % 10
        number //= 10
    return total

# Test cases
print(sum_range(1, 5))
# Expected: 15

print(sum_range(3, 7))
# Expected: 25

print(sum_even(10))
# Expected: 30

print(sum_even(7))
# Expected: 12

print(factorial(5))
# Expected: 120

print(factorial(0))
# Expected: 1

print(sum_digits(1234))
# Expected: 10

print(sum_digits(-456))
# Expected: 15`,
    },
    {
      id: "loops-multiplication-table",
      slug: "multiplication-table",
      title: "Multiplication Table",
      content: `## Multiplication Table

Use nested loops to generate formatted multiplication tables.

### Nested Loop Pattern

\`\`\`python
for row in range(1, 4):
    for col in range(1, 4):
        print(row * col, end="\\t")
    print()  # newline after each row
\`\`\`

Output:
\`\`\`
1   2   3
2   4   6
3   6   9
\`\`\`

### Hints

- Use \`end="\\t"\` to separate columns with tabs
- Use \`f-string\` formatting to align columns: \`f"{value:4d}"\`
- Think about which values go on rows vs. columns`,
      starterCode: `def multiplication_table(n):
    """Return a string representing an n x n multiplication table.
    Each row is on a new line, values separated by tabs."""
    # TODO: Use nested loops to build the table string
    pass

def times_table_for(number, up_to=12):
    """Return a list of strings like ['3 x 1 = 3', '3 x 2 = 6', ...]"""
    # TODO: Loop from 1 to up_to and format each line
    pass

def find_in_table(n, target):
    """Find all pairs (i, j) where i * j == target,
    with 1 <= i <= n and 1 <= j <= n.
    Return a list of tuples [(i, j), ...]"""
    # TODO: Use nested loops to find all pairs
    pass

# Test cases
print(multiplication_table(3))
# Expected:
# 1\t2\t3
# 2\t4\t6
# 3\t6\t9

print(times_table_for(5, 5))
# Expected: ['5 x 1 = 5', '5 x 2 = 10', '5 x 3 = 15', '5 x 4 = 20', '5 x 5 = 25']

print(find_in_table(5, 12))
# Expected: [(3, 4), (4, 3)]

print(find_in_table(10, 24))
# Expected: [(3, 8), (4, 6), (6, 4), (8, 3)]`,
      solutionCode: `def multiplication_table(n):
    """Return a string representing an n x n multiplication table.
    Each row is on a new line, values separated by tabs."""
    rows = []
    for i in range(1, n + 1):
        row_values = []
        for j in range(1, n + 1):
            row_values.append(str(i * j))
        rows.append("\\t".join(row_values))
    return "\\n".join(rows)

def times_table_for(number, up_to=12):
    """Return a list of strings like ['3 x 1 = 3', '3 x 2 = 6', ...]"""
    result = []
    for i in range(1, up_to + 1):
        result.append(f"{number} x {i} = {number * i}")
    return result

def find_in_table(n, target):
    """Find all pairs (i, j) where i * j == target,
    with 1 <= i <= n and 1 <= j <= n.
    Return a list of tuples [(i, j), ...]"""
    pairs = []
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            if i * j == target:
                pairs.append((i, j))
    return pairs

# Test cases
print(multiplication_table(3))
# Expected:
# 1\t2\t3
# 2\t4\t6
# 3\t6\t9

print(times_table_for(5, 5))
# Expected: ['5 x 1 = 5', '5 x 2 = 10', '5 x 3 = 15', '5 x 4 = 20', '5 x 5 = 25']

print(find_in_table(5, 12))
# Expected: [(3, 4), (4, 3)]

print(find_in_table(10, 24))
# Expected: [(3, 8), (4, 6), (6, 4), (8, 3)]`,
    },
    {
      id: "loops-pattern-printing",
      slug: "pattern-printing",
      title: "Pattern Printing",
      content: `## Pattern Printing

Pattern printing is a great way to build intuition for nested loops. You will create various shapes using characters.

### Example: Right Triangle

\`\`\`python
for i in range(1, 5):
    print("*" * i)
\`\`\`
Output:
\`\`\`
*
**
***
****
\`\`\`

### Hints

- \`"*" * n\` repeats the character n times
- \`" " * n\` creates n spaces for alignment
- Think about how many spaces and stars each row needs
- For centered patterns, calculate leading spaces`,
      starterCode: `def right_triangle(n):
    """Print a right triangle of height n using '*'.
    Example for n=4:
    *
    **
    ***
    ****
    """
    # TODO: Use a loop and string repetition
    pass

def inverted_triangle(n):
    """Print an inverted right triangle of height n.
    Example for n=4:
    ****
    ***
    **
    *
    """
    # TODO: Start from n stars and decrease
    pass

def pyramid(n):
    """Print a centered pyramid of height n.
    Example for n=4:
       *
      ***
     *****
    *******
    """
    # TODO: Calculate spaces and stars for each row
    pass

def diamond(n):
    """Print a diamond shape. n is the half-height (widest row has 2n-1 stars).
    Example for n=3:
      *
     ***
    *****
     ***
      *
    """
    # TODO: Upper half (pyramid) + lower half (inverted)
    pass

# Test cases
print("Right Triangle (4):")
right_triangle(4)
# Expected:
# *
# **
# ***
# ****

print("\\nInverted Triangle (4):")
inverted_triangle(4)
# Expected:
# ****
# ***
# **
# *

print("\\nPyramid (4):")
pyramid(4)
# Expected:
#    *
#   ***
#  *****
# *******

print("\\nDiamond (3):")
diamond(3)
# Expected:
#   *
#  ***
# *****
#  ***
#   *`,
      solutionCode: `def right_triangle(n):
    """Print a right triangle of height n using '*'."""
    for i in range(1, n + 1):
        print("*" * i)

def inverted_triangle(n):
    """Print an inverted right triangle of height n."""
    for i in range(n, 0, -1):
        print("*" * i)

def pyramid(n):
    """Print a centered pyramid of height n."""
    for i in range(1, n + 1):
        spaces = " " * (n - i)
        stars = "*" * (2 * i - 1)
        print(spaces + stars)

def diamond(n):
    """Print a diamond shape. n is the half-height (widest row has 2n-1 stars)."""
    # Upper half including middle
    for i in range(1, n + 1):
        spaces = " " * (n - i)
        stars = "*" * (2 * i - 1)
        print(spaces + stars)
    # Lower half
    for i in range(n - 1, 0, -1):
        spaces = " " * (n - i)
        stars = "*" * (2 * i - 1)
        print(spaces + stars)

# Test cases
print("Right Triangle (4):")
right_triangle(4)
# Expected:
# *
# **
# ***
# ****

print("\\nInverted Triangle (4):")
inverted_triangle(4)
# Expected:
# ****
# ***
# **
# *

print("\\nPyramid (4):")
pyramid(4)
# Expected:
#    *
#   ***
#  *****
# *******

print("\\nDiamond (3):")
diamond(3)
# Expected:
#   *
#  ***
# *****
#  ***
#   *`,
    },
  ],
};
