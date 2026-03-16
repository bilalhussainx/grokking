import { Module } from "../types";

export const booleanExpressionsModule: Module = {
  id: "ap-csa-boolean-expressions",
  title: "Boolean Expressions & Conditionals",
  description:
    "Master boolean logic, comparison operators, and if/else statements -- the decision-making core of programming.",
  lessons: [
    {
      id: "ap-csa-boolean-logic",
      slug: "boolean-logic",
      title: "Boolean Expressions and Logic",
      content: `## Boolean Expressions and Logic

<!-- voice:key_insight -->

A **boolean expression** evaluates to either \`true\` or \`false\`. These are the building blocks of decision-making in programs.

### Comparison Operators

| Operator | Java | Python | Meaning |
|----------|------|--------|---------|
| Equal | \`==\` | \`==\` | Are they equal? |
| Not equal | \`!=\` | \`!=\` | Are they different? |
| Less than | \`<\` | \`<\` | Is left smaller? |
| Greater than | \`>\` | \`>\` | Is left larger? |
| Less/equal | \`<=\` | \`<=\` | Smaller or equal? |
| Greater/equal | \`>=\` | \`>=\` | Larger or equal? |

### Logical Operators

| Logic | Java | Python | Meaning |
|-------|------|--------|---------|
| AND | \`&&\` | \`and\` | Both must be true |
| OR | \`\\|\\|\` | \`or\` | At least one true |
| NOT | \`!\` | \`not\` | Flips true/false |

### Truth Tables

**AND** -- both must be true:
| A | B | A AND B |
|---|---|---------|
| T | T | **T** |
| T | F | F |
| F | T | F |
| F | F | F |

**OR** -- at least one true:
| A | B | A OR B |
|---|---|--------|
| T | T | **T** |
| T | F | **T** |
| F | T | **T** |
| F | F | F |

### Short-Circuit Evaluation

Both Java and Python use **short-circuit evaluation**:
- \`false && anything\` -> \`false\` (skips second check)
- \`true || anything\` -> \`true\` (skips second check)

This matters when the second expression could cause an error!

### Analogy: Boolean Logic Is Like Qualifying for a Team

"You must be at least 14 years old **AND** pass the tryout." Both conditions must be true (AND). "You can enter with a ticket **OR** a membership card." Either one works (OR).

### Deeper Reading
- AP CSA Unit 3: Boolean Expressions and if Statements
- De Morgan's Laws in programming

### Reflection Questions
1. What is the result of \`true && false || true\`?
2. Why is short-circuit evaluation useful?
3. How would you express "x is between 1 and 10 inclusive" using boolean operators?`,
    },
    {
      id: "ap-csa-if-else",
      slug: "if-else-statements",
      title: "If/Else Statements",
      content: `## If/Else Statements

### Java vs. Python Syntax

**Java:**
\`\`\`java
if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else if (score >= 70) {
    grade = "C";
} else {
    grade = "F";
}
\`\`\`

**Python:**
\`\`\`python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
\`\`\`

<!-- voice:key_insight -->

### Key Differences
- Java uses \`{ }\` for blocks; Python uses indentation
- Java uses \`else if\`; Python uses \`elif\`
- Java requires \`( )\` around the condition; Python does not

### De Morgan's Laws (AP Exam Favorite!)

These laws help simplify boolean expressions:

- \`!(A && B)\` is the same as \`!A || !B\`
- \`!(A || B)\` is the same as \`!A && !B\`

**Example**: "NOT (sunny AND warm)" = "NOT sunny OR NOT warm"

In Python:
\`\`\`python
# These are equivalent:
not (x > 5 and y < 10)
(x <= 5) or (y >= 10)
\`\`\`

### Nested Conditionals

You can put if statements inside other if statements:
\`\`\`python
if age >= 16:
    if has_permit:
        print("You can drive with supervision")
    else:
        print("Get your permit first")
else:
    print("Too young to drive")
\`\`\`

### Deeper Reading
- AP CSA: De Morgan's Laws practice problems
- Boolean algebra fundamentals

### Reflection Questions
1. Simplify: \`not (temperature > 100 or humidity > 80)\`
2. When would you use nested if statements vs. elif chains?
3. What is the Python equivalent of Java's \`else if\`?`,
    },
    {
      id: "ap-csa-boolean-exercise",
      slug: "boolean-exercise",
      title: "Practice: Boolean Expressions",
      content: `## Practice: Boolean Expressions

Practice boolean logic, De Morgan's Laws, and conditional decision-making.`,
      starterCode: `def can_ride_roller_coaster(height_cm, age):
    """Determine if someone can ride a roller coaster.
    Requirements: at least 120 cm tall AND at least 8 years old.

    Return: "allowed", "too short", "too young", or "too short and too young"
    """
    # TODO: Use conditionals to check both requirements
    pass

def de_morgan_equivalent(x, y):
    """Demonstrate De Morgan's Laws.
    Return a tuple of two booleans that should always be equal:
    1. not (x and y)
    2. (not x) or (not y)

    Example: de_morgan_equivalent(True, False) -> (True, True)
    """
    # TODO: Compute both expressions and return them as a tuple
    pass

def classify_triangle(a, b, c):
    """Classify a triangle by its side lengths.
    - 'equilateral': all sides equal
    - 'isosceles': exactly two sides equal
    - 'scalene': no sides equal
    - 'not a triangle': if any side >= sum of other two

    Example: classify_triangle(3, 3, 3) -> 'equilateral'
    """
    # TODO: Check triangle validity first, then classify
    pass

def leap_year(year):
    """Determine if a year is a leap year.
    Rules: divisible by 4, EXCEPT centuries, UNLESS divisible by 400.

    Example: leap_year(2024) -> True, leap_year(1900) -> False
    """
    # TODO: Implement the leap year rules
    pass

# Tests
print(can_ride_roller_coaster(130, 10))    # Expected: allowed
print(can_ride_roller_coaster(110, 10))    # Expected: too short
print(can_ride_roller_coaster(130, 6))     # Expected: too young
print(de_morgan_equivalent(True, False))   # Expected: (True, True)
print(classify_triangle(3, 3, 3))          # Expected: equilateral
print(classify_triangle(3, 4, 5))          # Expected: scalene
print(leap_year(2024))                     # Expected: True
print(leap_year(1900))                     # Expected: False
print(leap_year(2000))                     # Expected: True
`,
      solutionCode: `def can_ride_roller_coaster(height_cm, age):
    """Determine if someone can ride a roller coaster."""
    tall_enough = height_cm >= 120
    old_enough = age >= 8
    if tall_enough and old_enough:
        return "allowed"
    elif not tall_enough and not old_enough:
        return "too short and too young"
    elif not tall_enough:
        return "too short"
    else:
        return "too young"

def de_morgan_equivalent(x, y):
    """Demonstrate De Morgan's Laws."""
    return (not (x and y), (not x) or (not y))

def classify_triangle(a, b, c):
    """Classify a triangle by its side lengths."""
    if a + b <= c or a + c <= b or b + c <= a:
        return "not a triangle"
    if a == b == c:
        return "equilateral"
    if a == b or b == c or a == c:
        return "isosceles"
    return "scalene"

def leap_year(year):
    """Determine if a year is a leap year."""
    if year % 400 == 0:
        return True
    if year % 100 == 0:
        return False
    if year % 4 == 0:
        return True
    return False

# Tests
print(can_ride_roller_coaster(130, 10))    # Expected: allowed
print(can_ride_roller_coaster(110, 10))    # Expected: too short
print(can_ride_roller_coaster(130, 6))     # Expected: too young
print(de_morgan_equivalent(True, False))   # Expected: (True, True)
print(classify_triangle(3, 3, 3))          # Expected: equilateral
print(classify_triangle(3, 4, 5))          # Expected: scalene
print(leap_year(2024))                     # Expected: True
print(leap_year(1900))                     # Expected: False
print(leap_year(2000))                     # Expected: True
`,
    },
    {
      id: "ap-csa-boolean-checkpoint",
      slug: "boolean-checkpoint",
      title: "Checkpoint: Boolean Expressions",
      content: `## Checkpoint: Boolean Expressions

<!-- voice:section_check -->

### Question 1
Apply De Morgan's Law to simplify: \`not (x > 0 and y > 0)\`

<details>
<summary>Show Answer</summary>

\`x <= 0 or y <= 0\`
</details>

### Question 2
What is short-circuit evaluation? Give an example where it prevents an error.

<details>
<summary>Show Answer</summary>

Short-circuit evaluation means the second operand is only evaluated if needed. Example: \`x != 0 and 10 / x > 2\` -- if x is 0, the first condition is False, so the division (which would cause an error) is never evaluated.
</details>

### Question 3
In Java, why does \`"hello" == "hello"\` sometimes return true and sometimes false?

<details>
<summary>Show Answer</summary>

Java may or may not reuse the same string object in memory (string interning). \`==\` checks memory location, not content. Use \`.equals()\` for reliable content comparison.
</details>

### Question 4
Write a boolean expression that checks if a number is a positive even number.

<details>
<summary>Show Answer</summary>

\`n > 0 and n % 2 == 0\`
</details>

### Question 5
What is the output?
\`\`\`python
x = 5
if x > 3:
    if x > 7:
        print("A")
    else:
        print("B")
else:
    print("C")
\`\`\`

<details>
<summary>Show Answer</summary>

**"B"**. x (5) is greater than 3 (enters outer if), but not greater than 7 (enters inner else).
</details>

### Nice Work!
Boolean logic is fundamental to every program. Next: loops and iteration.`,
    },
  ],
};
