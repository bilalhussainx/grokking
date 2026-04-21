import { Module } from "../types";

export const primitiveTypesModule: Module = {
  id: "ap-csa-primitive-types",
  title: "Primitive Types",
  description: "Understand how Java (and Python) store basic data -- integers, doubles, booleans, and how type casting works.",
  lessons: [
    {
      id: "ap-csa-primitive-intro",
      slug: "primitive-intro",
      title: "Variables and Primitive Types",
      content: `## Variables and Primitive Types

<!-- voice:key_insight -->

In AP Computer Science A, you learn Java -- a **statically typed** language where you must declare a variable's type before using it. We will show Java concepts side-by-side with Python equivalents so you can practice in our Python IDE.

### Java vs. Python: Declaring Variables

**Java:**
\`\`\`java
int age = 17;
double gpa = 3.85;
boolean isEnrolled = true;
String name = "Alice";
\`\`\`

**Python equivalent:**
\`\`\`python
age = 17           # int
gpa = 3.85         # float
is_enrolled = True  # bool
name = "Alice"     # str
\`\`\`

### Java's Primitive Types

| Java Type | Size | Range | Python Equivalent |
|-----------|------|-------|-------------------|
| \`int\` | 32 bits | -2.1B to 2.1B | \`int\` (unlimited) |
| \`double\` | 64 bits | ~15 decimal digits | \`float\` |
| \`boolean\` | 1 bit | true/false | \`bool\` |
| \`char\` | 16 bits | Single character | \`str\` (length 1) |

### Key Difference: Static vs. Dynamic Typing

In **Java**, the type is fixed at declaration. You cannot put a string into an \`int\` variable.

In **Python**, variables can hold any type and even change types (dynamic typing).

### Integer Division: A Common AP Trap

**Java:** \`7 / 2\` gives \`3\` (integer division when both operands are \`int\`)
**Python:** \`7 / 2\` gives \`3.5\`, but \`7 // 2\` gives \`3\`

This is a frequently tested concept on the AP exam!

### Analogy: Types Are Like Containers

Java types are like specific containers -- a milk carton can only hold milk. Python is like a universal container that can hold anything.

### Deeper Reading
- AP CSA Unit 1: Primitive Types (College Board)
- *Think Java* by Allen Downey, Chapter 2

### Reflection Questions
1. Why does Java require you to declare variable types?
2. What happens in Java if you assign a decimal to an \`int\` variable?
3. When would integer division be useful in a program?`,
    },
    {
      id: "ap-csa-casting-operations",
      slug: "casting-operations",
      title: "Type Casting and Arithmetic",
      content: `## Type Casting and Arithmetic

### Type Casting in Java

Sometimes you need to convert between types. Java has two kinds:

**Widening (automatic)** -- smaller type to larger type (safe):
\`\`\`java
int x = 5;
double y = x;  // 5 becomes 5.0 automatically
\`\`\`

**Narrowing (manual)** -- larger type to smaller type (you must explicitly cast):
\`\`\`java
double pi = 3.14159;
int rounded = (int) pi;  // 3 (truncates, does NOT round)
\`\`\`

<!-- voice:key_insight -->

**Casting truncates, it does NOT round!** \`(int) 3.99\` gives \`3\`, not \`4\`.

### Python Equivalents

\`\`\`python
x = 5
y = float(x)     # 5.0
pi = 3.14159
rounded = int(pi)  # 3 (also truncates)
\`\`\`

### Arithmetic Operators (Same in Both Languages)

| Operator | Java | Python |
|----------|------|--------|
| Addition | \`+\` | \`+\` |
| Subtraction | \`-\` | \`-\` |
| Multiplication | \`*\` | \`*\` |
| Division | \`/\` | \`/\` (float) or \`//\` (int) |
| Modulo | \`%\` | \`%\` |

### Compound Assignment

Java: \`x += 5;\` means \`x = x + 5;\`
Python: \`x += 5\` (same thing, no semicolon)

Also: \`-=\`, \`*=\`, \`/=\`, \`%=\`

### The \`++\` and \`--\` Operators (Java Only)

Java has \`x++\` (increment) and \`x--\` (decrement). Python does not -- you use \`x += 1\` instead.

### Deeper Reading
- AP CSA: Integer overflow and type promotion rules
- Oracle Java Tutorials: "Primitive Data Types"

### Reflection Questions
1. What is the result of \`(int) 7.9\` in Java?
2. Why is widening considered "safe" but narrowing is not?
3. What does \`17 % 5\` evaluate to?`,
    },
    {
      id: "ap-csa-primitive-exercise",
      slug: "primitive-exercise",
      title: "Practice: Primitive Types",
      content: `## Practice: Primitive Types

Practice the concepts from Unit 1 -- type conversion, arithmetic, and integer division.

### Your Task

Complete these functions that mirror common AP CSA exam problems.`,
      starterCode: `def integer_division_results(a, b):
    """Simulate Java integer division behavior.
    Return a tuple: (integer_division, float_division, remainder)

    Example: integer_division_results(17, 5) -> (3, 3.4, 2)
    """
    # TODO: Use // for integer division, / for float, % for remainder
    pass

def truncate(value):
    """Simulate Java's (int) cast -- truncate toward zero.
    Works for both positive and negative numbers.

    Example: truncate(3.7) -> 3, truncate(-3.7) -> -3
    """
    # TODO: Use int() which truncates toward zero
    pass

def swap_values(a, b):
    """Swap two values using only arithmetic (no temp variable).
    Return the swapped values as a tuple.

    Example: swap_values(5, 10) -> (10, 5)
    """
    # TODO: Use addition and subtraction to swap
    pass

def celsius_to_fahrenheit(celsius):
    """Convert Celsius to Fahrenheit.
    Formula: F = C * 9/5 + 32
    Return the result as an integer (truncated, like Java int division).

    Example: celsius_to_fahrenheit(100) -> 212
    """
    # TODO: Apply the formula and truncate
    pass

# Tests
print(integer_division_results(17, 5))    # Expected: (3, 3.4, 2)
print(truncate(3.7))                       # Expected: 3
print(truncate(-3.7))                      # Expected: -3
print(swap_values(5, 10))                  # Expected: (10, 5)
print(celsius_to_fahrenheit(100))          # Expected: 212
print(celsius_to_fahrenheit(0))            # Expected: 32
`,
      solutionCode: `def integer_division_results(a, b):
    """Simulate Java integer division behavior."""
    return (a // b, a / b, a % b)

def truncate(value):
    """Simulate Java's (int) cast -- truncate toward zero."""
    return int(value)

def swap_values(a, b):
    """Swap two values using only arithmetic."""
    a = a + b
    b = a - b
    a = a - b
    return (a, b)

def celsius_to_fahrenheit(celsius):
    """Convert Celsius to Fahrenheit, truncated to integer."""
    return int(celsius * 9 / 5 + 32)

# Tests
print(integer_division_results(17, 5))    # Expected: (3, 3.4, 2)
print(truncate(3.7))                       # Expected: 3
print(truncate(-3.7))                      # Expected: -3
print(swap_values(5, 10))                  # Expected: (10, 5)
print(celsius_to_fahrenheit(100))          # Expected: 212
print(celsius_to_fahrenheit(0))            # Expected: 32
`,
    },
    {
      id: "ap-csa-primitive-checkpoint",
      slug: "primitive-checkpoint",
      title: "Checkpoint: Primitive Types",
      content: `## Checkpoint: Primitive Types

<!-- voice:section_check -->

### Question 1
In Java, what is the result of \`int x = 7 / 2;\`?

<details>
<summary>Show Answer</summary>

**3**. When both operands are integers, Java performs integer division (truncates the decimal).
</details>

### Question 2
What is the difference between \`(int) 4.9\` and \`Math.round(4.9)\` in Java?

<details>
<summary>Show Answer</summary>

\`(int) 4.9\` = **4** (truncation -- just drops the decimal). \`Math.round(4.9)\` = **5** (rounds to nearest integer).
</details>

### Question 3
Why does Python not need type declarations like Java does?

<details>
<summary>Show Answer</summary>

Python uses **dynamic typing** -- the interpreter figures out the type at runtime based on the assigned value. Java uses **static typing** -- the compiler checks types before the program runs, catching type errors earlier.
</details>

### Question 4
What is the value of \`10 % 3\`?

<details>
<summary>Show Answer</summary>

**1**. The modulo operator returns the remainder: 10 divided by 3 = 3 remainder 1.
</details>

### Question 5
In Java, what happens if you write \`int x = 2147483647 + 1;\`?

<details>
<summary>Show Answer</summary>

**Integer overflow.** The value wraps around to -2147483648. Java integers have a fixed size (32 bits), so they cannot represent values beyond their range. Python integers do not overflow because they can grow to any size.
</details>

### Solid Start!
You have mastered the fundamentals of types and arithmetic. Next up: working with objects.`,
    },
  ],
};
