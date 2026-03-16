import { Module } from "../types";

export const programmingFundamentalsModule: Module = {
  id: "ap-csp-programming",
  title: "Programming Fundamentals (Python)",
  description:
    "Learn to write programs in Python -- variables, conditionals, loops, functions, and basic input/output.",
  lessons: [
    {
      id: "ap-csp-variables-expressions",
      slug: "variables-expressions",
      title: "Variables and Expressions",
      content: `## Variables and Expressions

<!-- voice:key_insight -->

A **variable** is a named container for a value. An **expression** is a combination of values and operators that produces a result.

### Creating Variables

In Python, you create a variable by assigning a value with \`=\`:

\`\`\`python
score = 0
player_name = "Alex"
is_game_over = False
temperature = 72.5
\`\`\`

Python figures out the type automatically -- you never need to declare it.

### Arithmetic Expressions

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| \`+\` | Addition | \`3 + 4\` | \`7\` |
| \`-\` | Subtraction | \`10 - 3\` | \`7\` |
| \`*\` | Multiplication | \`5 * 6\` | \`30\` |
| \`/\` | Division | \`7 / 2\` | \`3.5\` |
| \`//\` | Integer division | \`7 // 2\` | \`3\` |
| \`%\` | Modulo (remainder) | \`7 % 2\` | \`1\` |
| \`**\` | Exponent | \`2 ** 8\` | \`256\` |

### String Operations

\`\`\`python
first = "Hello"
last = "World"
greeting = first + " " + last  # "Hello World" (concatenation)
repeated = "Ha" * 3            # "HaHaHa" (repetition)
\`\`\`

### Analogy: Variables Are Labeled Jars

Think of variables as jars on a shelf. Each jar has a label (the variable name) and contains something (the value). You can peek inside, replace what is there, or combine contents from multiple jars.

### Real-World Connection

When a shopping website calculates your total, it is using variables (\`price\`, \`quantity\`, \`tax_rate\`) and expressions (\`total = price * quantity * (1 + tax_rate)\`).

### Deeper Reading
- Python official tutorial: "An Informal Introduction to Python"
- AP CSP: Big Idea 3 -- Algorithms and Programming

### Reflection Questions
1. What is the difference between \`/\` and \`//\` in Python?
2. What happens if you try \`"hello" + 5\` in Python?
3. Why are meaningful variable names important?`,
    },
    {
      id: "ap-csp-conditionals",
      slug: "conditionals",
      title: "Making Decisions with Conditionals",
      content: `## Making Decisions with Conditionals

Programs need to make choices. **Conditional statements** let your code take different paths depending on whether a condition is true or false.

### The if Statement

\`\`\`python
age = 16

if age >= 18:
    print("You can vote!")
else:
    print("Not old enough to vote yet.")
\`\`\`

### Comparison Operators

| Operator | Meaning |
|----------|---------|
| \`==\` | Equal to |
| \`!=\` | Not equal to |
| \`<\` | Less than |
| \`>\` | Greater than |
| \`<=\` | Less than or equal to |
| \`>=\` | Greater than or equal to |

### if / elif / else Chains

\`\`\`python
grade = 85

if grade >= 90:
    print("A")
elif grade >= 80:
    print("B")
elif grade >= 70:
    print("C")
else:
    print("Below C")
\`\`\`

<!-- voice:key_insight -->

Python checks conditions **top to bottom** and runs the first block that matches. Once a match is found, all remaining \`elif\` and \`else\` blocks are skipped.

### Boolean Operators

Combine conditions with \`and\`, \`or\`, and \`not\`:

\`\`\`python
if age >= 13 and age <= 19:
    print("You are a teenager")

if not is_raining:
    print("Let's go outside!")
\`\`\`

### Analogy: Conditionals Are Like a Flowchart

Imagine a flowchart with diamond-shaped decision boxes. Each diamond asks a yes/no question and sends you down a different path.

### Deeper Reading
- Think Python, Chapter 5: "Conditionals and Recursion"

### Reflection Questions
1. What happens if two \`elif\` conditions are both true?
2. Can you have an \`if\` without an \`else\`?
3. What is the difference between \`=\` and \`==\`?`,
    },
    {
      id: "ap-csp-loops",
      slug: "loops",
      title: "Repeating with Loops",
      content: `## Repeating with Loops

**Loops** let you repeat a block of code multiple times without writing it out over and over.

### The for Loop

Use \`for\` when you know how many times to repeat:

\`\`\`python
for i in range(5):
    print(f"Iteration {i}")
# Prints 0, 1, 2, 3, 4

for name in ["Alice", "Bob", "Charlie"]:
    print(f"Hello, {name}!")
\`\`\`

### The while Loop

Use \`while\` when you want to repeat until a condition becomes false:

\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

<!-- voice:key_insight -->

**Watch out for infinite loops!** If the condition never becomes false, the program runs forever. Always make sure something inside the loop eventually changes the condition.

### Loop Patterns

**Accumulator pattern** -- build up a result:
\`\`\`python
total = 0
for num in [10, 20, 30, 40]:
    total += num
print(total)  # 100
\`\`\`

**Search pattern** -- find something:
\`\`\`python
names = ["Alice", "Bob", "Charlie"]
for name in names:
    if name == "Bob":
        print("Found Bob!")
        break
\`\`\`

### Analogy: Loops Are Like a Playlist on Repeat

A \`for\` loop is like playing a playlist from start to finish. A \`while\` loop is like repeating a song until you press stop.

### Deeper Reading
- AP CSP: Iteration and loops
- Python Tutor: visualize loop execution step-by-step

### Reflection Questions
1. When would you choose a \`while\` loop over a \`for\` loop?
2. What does \`break\` do inside a loop?
3. What is the accumulator pattern used for?`,
    },
    {
      id: "ap-csp-functions",
      slug: "functions",
      title: "Functions: Reusable Code Blocks",
      content: `## Functions: Reusable Code Blocks

A **function** is a named block of code that performs a specific task. Functions help you organize code, avoid repetition, and make programs easier to read.

### Defining and Calling Functions

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

message = greet("Alice")
print(message)  # Hello, Alice!
\`\`\`

### Parameters and Return Values

- **Parameters**: values that go INTO the function (inputs)
- **Return value**: the value that comes OUT of the function (output)

\`\`\`python
def calculate_area(length, width):
    area = length * width
    return area

result = calculate_area(5, 3)  # result = 15
\`\`\`

### Functions That Don't Return

If a function does not use \`return\`, it returns \`None\` by default:

\`\`\`python
def say_hello():
    print("Hello!")

x = say_hello()  # Prints "Hello!", x is None
\`\`\`

<!-- voice:key_insight -->

### Why Functions Matter

- **Abstraction**: Hide complexity behind a simple name
- **Reusability**: Write once, use many times
- **Testing**: Test one function at a time
- **Collaboration**: Different people can write different functions

### Analogy: Functions Are Like Recipes

A recipe has a name ("Chocolate Cake"), ingredients (parameters), and steps (the code). You can follow the same recipe many times with different ingredients.

### Deeper Reading
- AP CSP: Procedural abstraction
- Think Python, Chapter 3: "Functions"

### Reflection Questions
1. What is the difference between defining a function and calling it?
2. Can a function call another function?
3. What is abstraction, and why does it matter in programming?`,
    },
    {
      id: "ap-csp-programming-exercise",
      slug: "programming-exercise",
      title: "Practice: Programming Fundamentals",
      content: `## Practice: Programming Fundamentals

Time to put your Python skills together! Complete the exercises below.

### Your Task

Write several small functions that demonstrate variables, conditionals, loops, and functions working together.`,
      starterCode: `def is_even(n):
    """Return True if n is even, False otherwise.

    Example: is_even(4) -> True, is_even(7) -> False
    """
    # TODO: Use the modulo operator
    pass

def fizzbuzz(n):
    """Return a list of strings from 1 to n following FizzBuzz rules:
    - If divisible by 3 and 5: 'FizzBuzz'
    - If divisible by 3 only: 'Fizz'
    - If divisible by 5 only: 'Buzz'
    - Otherwise: the number as a string

    Example: fizzbuzz(5) -> ['1', '2', 'Fizz', '4', 'Buzz']
    """
    # TODO: Use a loop and conditionals
    pass

def sum_of_digits(n):
    """Return the sum of all digits in the absolute value of n.

    Example: sum_of_digits(123) -> 6, sum_of_digits(-456) -> 15
    """
    # TODO: Convert to string, iterate over characters
    pass

def find_max(numbers):
    """Return the largest number in the list without using built-in max().

    Example: find_max([3, 7, 2, 9, 1]) -> 9
    """
    # TODO: Use the loop-and-compare pattern
    pass

# Tests
print(is_even(4))          # Expected: True
print(is_even(7))          # Expected: False
print(fizzbuzz(5))         # Expected: ['1', '2', 'Fizz', '4', 'Buzz']
print(sum_of_digits(123))  # Expected: 6
print(find_max([3, 7, 2, 9, 1]))  # Expected: 9
`,
      solutionCode: `def is_even(n):
    """Return True if n is even, False otherwise."""
    return n % 2 == 0

def fizzbuzz(n):
    """Return a list of strings from 1 to n following FizzBuzz rules."""
    result = []
    for i in range(1, n + 1):
        if i % 3 == 0 and i % 5 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result

def sum_of_digits(n):
    """Return the sum of all digits in the absolute value of n."""
    total = 0
    for digit in str(abs(n)):
        total += int(digit)
    return total

def find_max(numbers):
    """Return the largest number in the list without using built-in max()."""
    largest = numbers[0]
    for num in numbers[1:]:
        if num > largest:
            largest = num
    return largest

# Tests
print(is_even(4))          # Expected: True
print(is_even(7))          # Expected: False
print(fizzbuzz(5))         # Expected: ['1', '2', 'Fizz', '4', 'Buzz']
print(sum_of_digits(123))  # Expected: 6
print(find_max([3, 7, 2, 9, 1]))  # Expected: 9
`,
    },
    {
      id: "ap-csp-programming-checkpoint",
      slug: "programming-checkpoint",
      title: "Checkpoint: Programming Fundamentals",
      content: `## Checkpoint: Programming Fundamentals

You have learned the core building blocks of programming! Let's review.

<!-- voice:section_check -->

### Question 1
What will the following code print?
\`\`\`python
x = 10
if x > 5:
    x = x + 1
if x > 10:
    x = x + 1
print(x)
\`\`\`

<details>
<summary>Show Answer</summary>

**12**. The first \`if\` runs (10 > 5), making x = 11. The second \`if\` also runs (11 > 10), making x = 12. Note: these are two separate \`if\` statements, not \`if/elif\`.
</details>

### Question 2
How many times will this loop execute?
\`\`\`python
for i in range(3, 10, 2):
    print(i)
\`\`\`

<details>
<summary>Show Answer</summary>

**4 times**, printing: 3, 5, 7, 9. The \`range(3, 10, 2)\` starts at 3, goes up to (but not including) 10, stepping by 2.
</details>

### Question 3
Write a function that takes a list of numbers and returns a new list containing only the even numbers.

<details>
<summary>Show Answer</summary>

\`\`\`python
def filter_evens(numbers):
    result = []
    for n in numbers:
        if n % 2 == 0:
            result.append(n)
    return result
\`\`\`
</details>

### Question 4
What is the difference between a parameter and an argument?

<details>
<summary>Show Answer</summary>

A **parameter** is the variable name in the function definition: \`def greet(name)\` -- \`name\` is the parameter. An **argument** is the actual value passed when calling: \`greet("Alice")\` -- \`"Alice"\` is the argument.
</details>

### Question 5
Why are functions considered a form of "abstraction"?

<details>
<summary>Show Answer</summary>

Functions hide the implementation details behind a simple name. A caller does not need to know HOW the function works, just WHAT it does. This simplifies complex programs by letting you think at a higher level.
</details>

### Excellent Progress!
You can now write real programs. Next up: algorithms -- the clever techniques that make programs efficient.`,
    },
  ],
};
