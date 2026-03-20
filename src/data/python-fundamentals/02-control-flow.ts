import { Module } from "../types";

export const controlFlowModule: Module = {
  id: "control-flow",
  title: "Control Flow",
  description:
    "Master if/elif/else statements and comparison operators to make your programs make decisions.",
  lessons: [
    {
      id: "control-flow-intro",
      slug: "control-flow-intro",
      title: "Conditional Statements",
      content: `## Making Decisions with if/elif/else

Programs need to make decisions. Python uses \`if\`, \`elif\` (else if), and \`else\` to choose which code to run based on conditions.

### Basic Syntax

\`\`\`python
age = 18
if age >= 18:
    print("You can vote!")
elif age >= 16:
    print("Almost there!")
else:
    print("Too young to vote.")
\`\`\`

**Important:** Python uses **indentation** (4 spaces) to define code blocks, not curly braces.

### How if/elif/else Works

\`\`\`mermaid
flowchart TD
    A[Start] --> B{if condition}
    B -->|True| C[Run if block]
    B -->|False| D{elif condition}
    D -->|True| E[Run elif block]
    D -->|False| F{More elif?}
    F -->|Yes| D
    F -->|No| G{else exists?}
    G -->|Yes| H[Run else block]
    G -->|No| I[Skip all]
    C --> J[Continue program]
    E --> J
    H --> J
    I --> J
\`\`\`

### Comparison Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| \`==\` | Equal to | \`5 == 5\` -> \`True\` |
| \`!=\` | Not equal to | \`5 != 3\` -> \`True\` |
| \`>\` | Greater than | \`5 > 3\` -> \`True\` |
| \`<\` | Less than | \`3 < 5\` -> \`True\` |
| \`>=\` | Greater or equal | \`5 >= 5\` -> \`True\` |
| \`<=\` | Less or equal | \`3 <= 5\` -> \`True\` |

### Logical Operators

Combine conditions with \`and\`, \`or\`, and \`not\`:

\`\`\`python
age = 25
has_license = True

if age >= 16 and has_license:
    print("You can drive!")

if not has_license:
    print("Get a license first!")
\`\`\`

### The \`in\` Operator

Check if a value exists in a sequence:

\`\`\`python
if "a" in "hello":    # False
if 3 in [1, 2, 3]:    # True
\`\`\`

### Key Points

- You can have as many \`elif\` blocks as you need
- \`else\` is optional and catches everything not matched above
- Conditions are evaluated **top to bottom** — the first match wins`,
    },
    {
      id: "control-flow-grade-calc",
      slug: "grade-calculator",
      title: "Grade Calculator",
      content: `## Grade Calculator

Build a function that converts a numeric score into a letter grade.

### Grading Scale

| Score Range | Grade |
|------------|-------|
| 90-100 | A |
| 80-89 | B |
| 70-79 | C |
| 60-69 | D |
| Below 60 | F |

### Hints

- Use \`if/elif/else\` to check score ranges
- Check from highest to lowest (or lowest to highest)
- Handle edge cases: what if the score is negative or over 100?

### Example

\`\`\`python
get_grade(95)  # "A"
get_grade(73)  # "C"
get_grade(45)  # "F"
\`\`\``,
      starterCode: `def get_grade(score):
    """Convert a numeric score (0-100) to a letter grade.
    If score is out of range, return 'Invalid score'."""
    # TODO: Handle invalid scores (below 0 or above 100)
    # TODO: Use if/elif/else to return the correct grade
    pass

def get_grade_with_modifier(score):
    """Like get_grade but adds + or - modifiers.
    90-100: A, 87-89: B+, 83-86: B, 80-82: B-,
    77-79: C+, 73-76: C, 70-72: C-, 67-69: D+,
    63-66: D, 60-62: D-, below 60: F
    No modifier for A or F."""
    # TODO: Determine base grade and modifier
    pass

def pass_or_fail(scores):
    """Given a list of scores, return a list of 'Pass' or 'Fail' for each.
    60 or above is 'Pass', below 60 is 'Fail'."""
    # TODO: Loop through scores and build result list
    pass

# Test cases
print(get_grade(95))
# Expected: A

print(get_grade(83))
# Expected: B

print(get_grade(71))
# Expected: C

print(get_grade(65))
# Expected: D

print(get_grade(45))
# Expected: F

print(get_grade(-5))
# Expected: Invalid score

print(get_grade(105))
# Expected: Invalid score

print(get_grade_with_modifier(95))
# Expected: A

print(get_grade_with_modifier(88))
# Expected: B+

print(get_grade_with_modifier(81))
# Expected: B-

print(get_grade_with_modifier(72))
# Expected: C-

print(pass_or_fail([85, 59, 60, 100, 45]))
# Expected: ['Pass', 'Fail', 'Pass', 'Pass', 'Fail']`,
      solutionCode: `def get_grade(score):
    """Convert a numeric score (0-100) to a letter grade.
    If score is out of range, return 'Invalid score'."""
    if score < 0 or score > 100:
        return "Invalid score"
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

def get_grade_with_modifier(score):
    """Like get_grade but adds + or - modifiers."""
    if score < 0 or score > 100:
        return "Invalid score"
    if score >= 90:
        return "A"
    elif score < 60:
        return "F"
    else:
        grades = {8: "B", 7: "C", 6: "D"}
        tens = score // 10
        ones = score % 10
        base = grades[tens]
        if ones >= 7:
            return base + "+"
        elif ones >= 3:
            return base
        else:
            return base + "-"

def pass_or_fail(scores):
    """Given a list of scores, return a list of 'Pass' or 'Fail' for each.
    60 or above is 'Pass', below 60 is 'Fail'."""
    result = []
    for score in scores:
        if score >= 60:
            result.append("Pass")
        else:
            result.append("Fail")
    return result

# Test cases
print(get_grade(95))
# Expected: A

print(get_grade(83))
# Expected: B

print(get_grade(71))
# Expected: C

print(get_grade(65))
# Expected: D

print(get_grade(45))
# Expected: F

print(get_grade(-5))
# Expected: Invalid score

print(get_grade(105))
# Expected: Invalid score

print(get_grade_with_modifier(95))
# Expected: A

print(get_grade_with_modifier(88))
# Expected: B+

print(get_grade_with_modifier(81))
# Expected: B-

print(get_grade_with_modifier(72))
# Expected: C-

print(pass_or_fail([85, 59, 60, 100, 45]))
# Expected: ['Pass', 'Fail', 'Pass', 'Pass', 'Fail']`,
    },
    {
      id: "control-flow-leap-year",
      slug: "leap-year-checker",
      title: "Leap Year Checker",
      content: `## Leap Year Checker

A classic programming exercise that tests your understanding of nested conditionals.

### Rules for Leap Years

A year is a leap year if:
1. It is divisible by 4, **AND**
2. It is NOT divisible by 100, **UNLESS**
3. It is also divisible by 400

### Examples

| Year | Leap Year? | Reason |
|------|-----------|--------|
| 2024 | Yes | Divisible by 4, not by 100 |
| 1900 | No | Divisible by 100, but not 400 |
| 2000 | Yes | Divisible by 400 |
| 2023 | No | Not divisible by 4 |

### Hints

- Use the modulus operator \`%\` to check divisibility
- You can combine conditions with \`and\`, \`or\`
- Think about the order of your checks carefully`,
      starterCode: `def is_leap_year(year):
    """Return True if the year is a leap year, False otherwise."""
    # TODO: Implement the leap year rules
    pass

def next_leap_year(year):
    """Return the next leap year AFTER the given year."""
    # TODO: Start from year + 1 and keep checking until you find one
    pass

def count_leap_years(start, end):
    """Count the number of leap years between start and end (inclusive)."""
    # TODO: Loop through the range and count leap years
    pass

# Test cases
print(is_leap_year(2024))
# Expected: True

print(is_leap_year(1900))
# Expected: False

print(is_leap_year(2000))
# Expected: True

print(is_leap_year(2023))
# Expected: False

print(next_leap_year(2023))
# Expected: 2024

print(next_leap_year(2024))
# Expected: 2028

print(count_leap_years(2000, 2024))
# Expected: 7`,
      solutionCode: `def is_leap_year(year):
    """Return True if the year is a leap year, False otherwise."""
    if year % 400 == 0:
        return True
    if year % 100 == 0:
        return False
    if year % 4 == 0:
        return True
    return False

def next_leap_year(year):
    """Return the next leap year AFTER the given year."""
    year += 1
    while not is_leap_year(year):
        year += 1
    return year

def count_leap_years(start, end):
    """Count the number of leap years between start and end (inclusive)."""
    count = 0
    for year in range(start, end + 1):
        if is_leap_year(year):
            count += 1
    return count

# Test cases
print(is_leap_year(2024))
# Expected: True

print(is_leap_year(1900))
# Expected: False

print(is_leap_year(2000))
# Expected: True

print(is_leap_year(2023))
# Expected: False

print(next_leap_year(2023))
# Expected: 2024

print(next_leap_year(2024))
# Expected: 2028

print(count_leap_years(2000, 2024))
# Expected: 7`,
    },
    {
      id: "control-flow-fizzbuzz",
      slug: "fizzbuzz",
      title: "FizzBuzz",
      content: `## FizzBuzz

FizzBuzz is one of the most famous programming challenges. It is simple but tests your understanding of conditionals and the modulus operator.

### The Rules

For numbers from 1 to n:
- If the number is divisible by **3**, print \`"Fizz"\`
- If the number is divisible by **5**, print \`"Buzz"\`
- If divisible by **both 3 and 5**, print \`"FizzBuzz"\`
- Otherwise, print the number itself

### Example Output (1-15)

\`\`\`
1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz
\`\`\`

### Common Mistake

Check for divisibility by **both 3 and 5 first** (the \`FizzBuzz\` case). If you check for 3 first, you will print \`"Fizz"\` for 15 and never reach the combined case.

### Hints

- Use \`%\` (modulus) to check divisibility
- Order of conditions matters!`,
      starterCode: `def fizzbuzz(n):
    """Return a list of FizzBuzz results from 1 to n (inclusive)."""
    # TODO: Loop from 1 to n
    # Check divisibility by both 3 AND 5 first
    # Then check 3, then 5, then just the number
    pass

def custom_fizzbuzz(n, fizz_num, buzz_num, fizz_word, buzz_word):
    """A customizable FizzBuzz. Instead of 3/5 and Fizz/Buzz,
    use the provided numbers and words."""
    # TODO: Same logic as fizzbuzz but with custom parameters
    pass

# Test cases
print(fizzbuzz(15))
# Expected: [1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz']

print(fizzbuzz(5))
# Expected: [1, 2, 'Fizz', 4, 'Buzz']

print(custom_fizzbuzz(10, 2, 5, "Foo", "Bar"))
# Expected: [1, 'Foo', 3, 'Foo', 'Bar', 'Foo', 7, 'Foo', 9, 'FooBar']`,
      solutionCode: `def fizzbuzz(n):
    """Return a list of FizzBuzz results from 1 to n (inclusive)."""
    result = []
    for i in range(1, n + 1):
        if i % 3 == 0 and i % 5 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(i)
    return result

def custom_fizzbuzz(n, fizz_num, buzz_num, fizz_word, buzz_word):
    """A customizable FizzBuzz. Instead of 3/5 and Fizz/Buzz,
    use the provided numbers and words."""
    result = []
    for i in range(1, n + 1):
        if i % fizz_num == 0 and i % buzz_num == 0:
            result.append(fizz_word + buzz_word)
        elif i % fizz_num == 0:
            result.append(fizz_word)
        elif i % buzz_num == 0:
            result.append(buzz_word)
        else:
            result.append(i)
    return result

# Test cases
print(fizzbuzz(15))
# Expected: [1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz']

print(fizzbuzz(5))
# Expected: [1, 2, 'Fizz', 4, 'Buzz']

print(custom_fizzbuzz(10, 2, 5, "Foo", "Bar"))
# Expected: [1, 'Foo', 3, 'Foo', 'Bar', 'Foo', 7, 'Foo', 9, 'FooBar']`,
    },
  ],
};
