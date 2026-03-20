import { Module } from "../types";

export const functionsModule: Module = {
  id: "functions",
  title: "Functions",
  description:
    "Learn to define reusable blocks of code with def, parameters, return values, and understand variable scope.",
  lessons: [
    {
      id: "functions-intro",
      slug: "functions-intro",
      title: "Introduction to Functions",
      content: `## Functions — Reusable Code Blocks

A **function** is a named block of code that performs a specific task. Functions help you organize code, avoid repetition, and make programs easier to read.

### Defining a Function

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

message = greet("Alice")
print(message)  # Hello, Alice!
\`\`\`

### Function Call Flow

\`\`\`mermaid
flowchart LR
    A[Caller Code] -->|Pass arguments| B[Function receives parameters]
    B --> C[Execute function body]
    C --> D[Compute result]
    D -->|Return value| E[Caller receives result]
    E --> F[Continue caller code]
\`\`\`

### Anatomy of a Function

\`\`\`python
def function_name(param1, param2):   # definition line
    """Docstring: explains what the function does."""
    # function body
    result = param1 + param2
    return result                     # return value
\`\`\`

### Parameters vs Arguments

- **Parameters** are the names in the function definition
- **Arguments** are the values you pass when calling the function

### Default Parameters

\`\`\`python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))            # Hello, Alice!
print(greet("Alice", "Hey"))     # Hey, Alice!
\`\`\`

### Multiple Return Values

Python can return multiple values as a tuple:

\`\`\`python
def min_max(numbers):
    return min(numbers), max(numbers)

lo, hi = min_max([3, 1, 4, 1, 5])
print(lo, hi)  # 1 5
\`\`\`

### Variable Scope

Variables defined inside a function are **local** — they do not exist outside:

\`\`\`python
def my_func():
    x = 10  # local variable
    return x

# print(x)  # NameError! x is not defined here
\`\`\`

### Key Takeaway

Functions are the first step toward writing clean, maintainable code. Every program you write from now on should use functions to organize logic.`,
    },
    {
      id: "functions-temp-converter",
      slug: "temperature-converter",
      title: "Temperature Converter",
      content: `## Temperature Converter

Build a set of functions to convert temperatures between Celsius, Fahrenheit, and Kelvin.

### Conversion Formulas

| From | To | Formula |
|------|----|---------|
| Celsius | Fahrenheit | F = C * 9/5 + 32 |
| Fahrenheit | Celsius | C = (F - 32) * 5/9 |
| Celsius | Kelvin | K = C + 273.15 |
| Kelvin | Celsius | C = K - 273.15 |

### Hints

- Round results to 2 decimal places using \`round(value, 2)\`
- Reuse your functions: to go from Fahrenheit to Kelvin, convert F->C then C->K
- Use default parameters where they make sense`,
      starterCode: `def celsius_to_fahrenheit(celsius):
    """Convert Celsius to Fahrenheit. Round to 2 decimal places."""
    # TODO: Apply the formula F = C * 9/5 + 32
    pass

def fahrenheit_to_celsius(fahrenheit):
    """Convert Fahrenheit to Celsius. Round to 2 decimal places."""
    # TODO: Apply the formula C = (F - 32) * 5/9
    pass

def celsius_to_kelvin(celsius):
    """Convert Celsius to Kelvin. Round to 2 decimal places."""
    # TODO: K = C + 273.15
    pass

def convert_temperature(value, from_unit, to_unit):
    """Convert a temperature from one unit to another.
    Units are 'C', 'F', or 'K'. Round to 2 decimal places.
    If units are the same, return the value unchanged."""
    # TODO: Handle all 9 combinations (C->F, C->K, F->C, F->K, K->C, K->F, same)
    # Hint: Convert everything to Celsius first, then to target unit
    pass

# Test cases
print(celsius_to_fahrenheit(100))
# Expected: 212.0

print(celsius_to_fahrenheit(0))
# Expected: 32.0

print(fahrenheit_to_celsius(212))
# Expected: 100.0

print(fahrenheit_to_celsius(32))
# Expected: 0.0

print(celsius_to_kelvin(0))
# Expected: 273.15

print(convert_temperature(100, "C", "F"))
# Expected: 212.0

print(convert_temperature(212, "F", "K"))
# Expected: 373.15

print(convert_temperature(0, "K", "C"))
# Expected: -273.15

print(convert_temperature(72, "F", "C"))
# Expected: 22.22`,
      solutionCode: `def celsius_to_fahrenheit(celsius):
    """Convert Celsius to Fahrenheit. Round to 2 decimal places."""
    return round(celsius * 9 / 5 + 32, 2)

def fahrenheit_to_celsius(fahrenheit):
    """Convert Fahrenheit to Celsius. Round to 2 decimal places."""
    return round((fahrenheit - 32) * 5 / 9, 2)

def celsius_to_kelvin(celsius):
    """Convert Celsius to Kelvin. Round to 2 decimal places."""
    return round(celsius + 273.15, 2)

def convert_temperature(value, from_unit, to_unit):
    """Convert a temperature from one unit to another.
    Units are 'C', 'F', or 'K'. Round to 2 decimal places."""
    if from_unit == to_unit:
        return value
    # First convert to Celsius
    if from_unit == "C":
        celsius = value
    elif from_unit == "F":
        celsius = (value - 32) * 5 / 9
    elif from_unit == "K":
        celsius = value - 273.15
    # Then convert from Celsius to target
    if to_unit == "C":
        result = celsius
    elif to_unit == "F":
        result = celsius * 9 / 5 + 32
    elif to_unit == "K":
        result = celsius + 273.15
    return round(result, 2)

# Test cases
print(celsius_to_fahrenheit(100))
# Expected: 212.0

print(celsius_to_fahrenheit(0))
# Expected: 32.0

print(fahrenheit_to_celsius(212))
# Expected: 100.0

print(fahrenheit_to_celsius(32))
# Expected: 0.0

print(celsius_to_kelvin(0))
# Expected: 273.15

print(convert_temperature(100, "C", "F"))
# Expected: 212.0

print(convert_temperature(212, "F", "K"))
# Expected: 373.15

print(convert_temperature(0, "K", "C"))
# Expected: -273.15

print(convert_temperature(72, "F", "C"))
# Expected: 22.22`,
    },
    {
      id: "functions-palindrome",
      slug: "palindrome-checker",
      title: "Palindrome Checker",
      content: `## Palindrome Checker

A **palindrome** reads the same forwards and backwards. Examples: "racecar", "madam", "level".

### Approach

1. Normalize the string (lowercase, remove non-alphanumeric characters)
2. Compare the string with its reverse
3. Or use two pointers: compare first and last characters, moving inward

### Hints

- \`s.lower()\` converts to lowercase
- \`s[::-1]\` reverses a string
- \`s.isalnum()\` checks if a character is alphanumeric
- Use a loop or list comprehension to filter characters`,
      starterCode: `def is_palindrome(s):
    """Check if a string is a palindrome.
    Ignore case and non-alphanumeric characters."""
    # TODO: Clean the string (lowercase, keep only letters/digits)
    # Then compare with its reverse
    pass

def longest_palindrome(s):
    """Find the longest palindromic substring in s.
    If there are ties, return the first one found."""
    # TODO: Check all substrings, track the longest palindrome
    pass

def make_palindrome(s):
    """Return the minimum characters to append to the END of s
    to make it a palindrome. Return the full palindrome string."""
    # TODO: Find how much of the beginning of s is already
    # a mirror of the end, then append what's needed
    pass

# Test cases
print(is_palindrome("racecar"))
# Expected: True

print(is_palindrome("hello"))
# Expected: False

print(is_palindrome("A man a plan a canal Panama"))
# Expected: True

print(is_palindrome("Was it a car or a cat I saw"))
# Expected: True

print(longest_palindrome("babad"))
# Expected: bab

print(longest_palindrome("cbbd"))
# Expected: bb

print(make_palindrome("race"))
# Expected: racecar

print(make_palindrome("abc"))
# Expected: abcba`,
      solutionCode: `def is_palindrome(s):
    """Check if a string is a palindrome.
    Ignore case and non-alphanumeric characters."""
    cleaned = ""
    for ch in s.lower():
        if ch.isalnum():
            cleaned += ch
    return cleaned == cleaned[::-1]

def longest_palindrome(s):
    """Find the longest palindromic substring in s.
    If there are ties, return the first one found."""
    if len(s) == 0:
        return ""
    best = s[0]
    for i in range(len(s)):
        for j in range(i + 1, len(s) + 1):
            sub = s[i:j]
            if sub == sub[::-1] and len(sub) > len(best):
                best = sub
    return best

def make_palindrome(s):
    """Return the minimum characters to append to the END of s
    to make it a palindrome. Return the full palindrome string."""
    if s == s[::-1]:
        return s
    for i in range(len(s)):
        suffix = s[i:]
        if suffix == suffix[::-1]:
            prefix = s[:i]
            return s + prefix[::-1]
    return s + s[-2::-1]

# Test cases
print(is_palindrome("racecar"))
# Expected: True

print(is_palindrome("hello"))
# Expected: False

print(is_palindrome("A man a plan a canal Panama"))
# Expected: True

print(is_palindrome("Was it a car or a cat I saw"))
# Expected: True

print(longest_palindrome("babad"))
# Expected: bab

print(longest_palindrome("cbbd"))
# Expected: bb

print(make_palindrome("race"))
# Expected: racecar

print(make_palindrome("abc"))
# Expected: abcba`,
    },
    {
      id: "functions-fibonacci",
      slug: "fibonacci-sequence",
      title: "Fibonacci Sequence",
      content: `## Fibonacci Sequence

The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the two preceding ones:

\`\`\`
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
\`\`\`

### Definition

\`\`\`
fib(0) = 0
fib(1) = 1
fib(n) = fib(n-1) + fib(n-2) for n >= 2
\`\`\`

### Approaches

1. **Recursive** — elegant but slow for large n (exponential time)
2. **Iterative** — use a loop with two variables (linear time)
3. **Memoized** — cache results to avoid repeated work

### Hints

- For the iterative approach, keep track of the previous two values
- Use tuple unpacking for clean swaps: \`a, b = b, a + b\``,
      starterCode: `def fibonacci(n):
    """Return the nth Fibonacci number (0-indexed).
    fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2, ..."""
    # TODO: Use an iterative approach with two variables
    pass

def fibonacci_sequence(n):
    """Return a list of the first n Fibonacci numbers."""
    # TODO: Build a list of Fibonacci numbers
    pass

def is_fibonacci(num):
    """Return True if num is a Fibonacci number, False otherwise."""
    # TODO: Generate Fibonacci numbers until you reach or exceed num
    pass

def fibonacci_sum_even(limit):
    """Return the sum of all even Fibonacci numbers less than limit."""
    # TODO: Generate Fibonacci numbers, sum the even ones
    pass

# Test cases
print(fibonacci(0))
# Expected: 0

print(fibonacci(1))
# Expected: 1

print(fibonacci(10))
# Expected: 55

print(fibonacci_sequence(8))
# Expected: [0, 1, 1, 2, 3, 5, 8, 13]

print(is_fibonacci(8))
# Expected: True

print(is_fibonacci(10))
# Expected: False

print(is_fibonacci(0))
# Expected: True

print(fibonacci_sum_even(100))
# Expected: 44`,
      solutionCode: `def fibonacci(n):
    """Return the nth Fibonacci number (0-indexed).
    fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2, ..."""
    if n <= 0:
        return 0
    if n == 1:
        return 1
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

def fibonacci_sequence(n):
    """Return a list of the first n Fibonacci numbers."""
    if n <= 0:
        return []
    if n == 1:
        return [0]
    result = [0, 1]
    for i in range(2, n):
        result.append(result[-1] + result[-2])
    return result

def is_fibonacci(num):
    """Return True if num is a Fibonacci number, False otherwise."""
    if num < 0:
        return False
    a, b = 0, 1
    while a < num:
        a, b = b, a + b
    return a == num

def fibonacci_sum_even(limit):
    """Return the sum of all even Fibonacci numbers less than limit."""
    total = 0
    a, b = 0, 1
    while a < limit:
        if a % 2 == 0:
            total += a
        a, b = b, a + b
    return total

# Test cases
print(fibonacci(0))
# Expected: 0

print(fibonacci(1))
# Expected: 1

print(fibonacci(10))
# Expected: 55

print(fibonacci_sequence(8))
# Expected: [0, 1, 1, 2, 3, 5, 8, 13]

print(is_fibonacci(8))
# Expected: True

print(is_fibonacci(10))
# Expected: False

print(is_fibonacci(0))
# Expected: True

print(fibonacci_sum_even(100))
# Expected: 44`,
    },
  ],
};
