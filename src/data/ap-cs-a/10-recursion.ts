import { Module } from "../types";

export const recursionModule: Module = {
  id: "ap-csa-recursion",
  title: "Recursion",
  description:
    "Understand recursive thinking -- base cases, recursive calls, and how recursion compares to iteration.",
  lessons: [
    {
      id: "ap-csa-base-recursive-case",
      slug: "base-and-recursive-case",
      title: "Base Case and Recursive Case",
      content: `## Base Case and Recursive Case

<!-- voice:section_check concept="every recursive function needs a base case to stop" -->
## A Function That Calls Itself

Picture a set of Russian nesting dolls. You open the outermost doll and find a smaller one inside. You open that one and find an even smaller one. You keep going until you reach the tiniest doll that does not open -- that is your **base case**.

**Recursion** is when a function calls itself to solve a smaller version of the same problem. Every recursive function has two essential parts:

1. **Base case** -- the condition that stops the recursion (the smallest doll)
2. **Recursive case** -- the function calls itself with a simpler input (opening the next doll)

### Factorial: The Classic Example

The factorial of 5 is \`5 * 4 * 3 * 2 * 1 = 120\`. Notice the pattern: \`5! = 5 * 4!\`. Each factorial is defined in terms of a smaller factorial.

\`\`\`python
def factorial(n):
    if n <= 1:          # Base case: 0! = 1, 1! = 1
        return 1
    return n * factorial(n - 1)  # Recursive case

print(factorial(5))  # 120
\`\`\`

### How It Unfolds

\`\`\`
factorial(5)
  = 5 * factorial(4)
  = 5 * 4 * factorial(3)
  = 5 * 4 * 3 * factorial(2)
  = 5 * 4 * 3 * 2 * factorial(1)
  = 5 * 4 * 3 * 2 * 1
  = 120
\`\`\`

Each call waits for the next one to return before it can finish. The calls stack up like a tower of plates -- last in, first out.

<!-- voice:key_insight insight="Without a base case, a recursive function calls itself forever and crashes with a stack overflow. The base case is not optional -- it is the safety net that makes recursion work." -->

### What Goes Wrong Without a Base Case

\`\`\`python
def infinite(n):
    return n * infinite(n - 1)  # No base case!

# infinite(5) -> infinite(4) -> infinite(3) -> ... -> crash!
# Python raises: RecursionError: maximum recursion depth exceeded
\`\`\`

### Reflection Questions

1. What are the two essential parts of every recursive function?
2. Why does \`factorial(0)\` need to return 1?
3. What happens in memory when recursive calls stack up?

### Deeper Reading
- AP CSA Unit 10: Recursion
- *Grokking Algorithms* by Aditya Bhargava, Manning, 2016, Chapter 3`,
    },
    {
      id: "ap-csa-recursive-patterns",
      slug: "recursive-patterns",
      title: "Recursive Patterns: Fibonacci and Beyond",
      content: `## Recursive Patterns: Fibonacci and Beyond

<!-- voice:section_check concept="Fibonacci as a two-branch recursion pattern" -->
## More Than One Recursive Call

Some problems need more than one recursive call per step. The **Fibonacci sequence** is the classic example: each number is the sum of the two before it.

\`\`\`
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
fib(0) = 0
fib(1) = 1
fib(n) = fib(n-1) + fib(n-2)  for n >= 2
\`\`\`

\`\`\`python
def fibonacci(n):
    if n == 0:              # Base case 1
        return 0
    if n == 1:              # Base case 2
        return 1
    return fibonacci(n - 1) + fibonacci(n - 2)  # Two recursive calls

print(fibonacci(7))  # 13
\`\`\`

### The Hidden Cost

This simple Fibonacci function is elegant but slow. To compute \`fibonacci(5)\`, it computes \`fibonacci(3)\` twice and \`fibonacci(2)\` three times. The number of calls grows exponentially.

\`\`\`
fibonacci(5)
├── fibonacci(4)
│   ├── fibonacci(3)
│   │   ├── fibonacci(2) ← repeated
│   │   └── fibonacci(1)
│   └── fibonacci(2) ← repeated
└── fibonacci(3) ← repeated
    ├── fibonacci(2) ← repeated
    └── fibonacci(1)
\`\`\`

<!-- voice:key_insight insight="Naive recursive Fibonacci has exponential time complexity O(2^n). Each additional input roughly doubles the work. For n=40, it makes over a billion calls. This is why recursion sometimes needs optimization like memoization." -->

### Other Recursive Patterns

**Counting down:**
\`\`\`python
def countdown(n):
    if n <= 0:
        print("Go!")
        return
    print(n)
    countdown(n - 1)
\`\`\`

**Summing a list:**
\`\`\`python
def recursive_sum(lst):
    if len(lst) == 0:        # Base case: empty list
        return 0
    return lst[0] + recursive_sum(lst[1:])  # First element + sum of rest
\`\`\`

**Reversing a string:**
\`\`\`python
def reverse(s):
    if len(s) <= 1:          # Base case: empty or single char
        return s
    return reverse(s[1:]) + s[0]  # Reverse the rest, append first char
\`\`\`

### Reflection Questions

1. Why does Fibonacci need two base cases instead of one?
2. How many times is \`fibonacci(2)\` computed when you call \`fibonacci(6)\`?
3. Can you think of a way to avoid the repeated computation?

### Deeper Reading
- AP CSA Unit 10: Recursive Searching and Sorting
- *Introduction to Algorithms* by Cormen, Leiserson, Rivest, Stein (CLRS), MIT Press, 2022, Chapter 4`,
    },
    {
      id: "ap-csa-recursion-vs-iteration",
      slug: "recursion-vs-iteration",
      title: "Recursion vs. Iteration",
      content: `## Recursion vs. Iteration

<!-- voice:section_check concept="when to choose recursion over a loop" -->
## Two Ways to Repeat

Every recursive solution can be rewritten as an iterative one (using loops), and vice versa. So when should you use which?

### Side-by-Side: Factorial

**Recursive:**
\`\`\`python
def factorial_recursive(n):
    if n <= 1:
        return 1
    return n * factorial_recursive(n - 1)
\`\`\`

**Iterative:**
\`\`\`python
def factorial_iterative(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
\`\`\`

Both produce the same answer. The iterative version uses a loop; the recursive version uses the call stack.

### Side-by-Side: Fibonacci

**Recursive (slow):**
\`\`\`python
def fib_recursive(n):
    if n <= 1:
        return n
    return fib_recursive(n - 1) + fib_recursive(n - 2)
\`\`\`

**Iterative (fast):**
\`\`\`python
def fib_iterative(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
\`\`\`

<!-- voice:key_insight insight="Recursion shines when the problem has a naturally recursive structure -- trees, nested data, divide-and-conquer. For simple counting or accumulation, a loop is usually clearer and faster." -->

### When to Use Each

| Use Recursion When... | Use Iteration When... |
|----------------------|----------------------|
| The problem is naturally recursive (trees, fractals) | The problem is a simple count or accumulation |
| You need to explore branching paths (backtracking) | Memory is limited (recursion uses stack space) |
| The recursive solution is much clearer | Performance matters and recursion has redundant calls |
| Depth is bounded and small | The iterative solution is equally readable |

### The Call Stack

Each recursive call adds a **stack frame** to memory. Python limits this to about 1000 frames by default. If your recursion goes deeper than that, you get a \`RecursionError\`.

\`\`\`python
import sys
print(sys.getrecursionlimit())  # Usually 1000

# This will crash:
def deep(n):
    return deep(n + 1)
\`\`\`

### AP Exam Note

The AP CSA exam expects you to:
- Trace recursive calls step by step
- Identify base cases and recursive cases
- Convert between recursive and iterative solutions
- Recognize that recursive solutions can be inefficient without optimization

### Reflection Questions

1. Why is iterative Fibonacci O(n) while recursive Fibonacci is O(2^n)?
2. When would a recursive solution be worth the extra memory cost?
3. What is a stack overflow and what causes it?

### Deeper Reading
- AP CSA Unit 10: Recursion vs. Iteration
- *Structure and Interpretation of Computer Programs* by Abelson and Sussman, MIT Press, 1996, Section 1.2`,
    },
    {
      id: "ap-csa-recursion-exercise",
      slug: "recursion-exercise",
      title: "Practice: Recursion",
      content: `## Practice: Recursion

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

Implement recursive solutions to classic problems. Each function must use recursion -- no loops allowed.`,
      starterCode: `def power(base, exp):
    """Calculate base^exp using recursion.

    Example: power(2, 5) -> 32
    Hint: x^n = x * x^(n-1), and x^0 = 1
    """
    # TODO: Base case when exp is 0, recursive case multiplies
    pass

def count_digits(n):
    """Count the number of digits in a positive integer using recursion.

    Example: count_digits(4231) -> 4
    Hint: Remove the last digit with n // 10
    """
    # TODO: Base case when n < 10 (single digit), recurse on n // 10
    pass

def is_palindrome(s):
    """Check if a string is a palindrome using recursion.

    Example: is_palindrome("racecar") -> True
    Hint: Compare first and last characters, recurse on the middle
    """
    # TODO: Base case when length <= 1, compare ends and recurse
    pass

def flatten(lst):
    """Flatten a nested list using recursion.

    Example: flatten([1, [2, [3, 4], 5], 6]) -> [1, 2, 3, 4, 5, 6]
    Hint: Check if each element is a list; if so, recurse on it
    """
    # TODO: Build result by recursing into sublists
    pass

# Tests
print(power(2, 5))                              # Expected: 32
print(power(3, 0))                              # Expected: 1
print(count_digits(4231))                        # Expected: 4
print(count_digits(7))                           # Expected: 1
print(is_palindrome("racecar"))                  # Expected: True
print(is_palindrome("hello"))                    # Expected: False
print(flatten([1, [2, [3, 4], 5], 6]))          # Expected: [1, 2, 3, 4, 5, 6]
`,
      solutionCode: `def power(base, exp):
    """Calculate base^exp using recursion."""
    if exp == 0:
        return 1
    return base * power(base, exp - 1)

def count_digits(n):
    """Count the number of digits in a positive integer using recursion."""
    if n < 10:
        return 1
    return 1 + count_digits(n // 10)

def is_palindrome(s):
    """Check if a string is a palindrome using recursion."""
    if len(s) <= 1:
        return True
    if s[0] != s[-1]:
        return False
    return is_palindrome(s[1:-1])

def flatten(lst):
    """Flatten a nested list using recursion."""
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

# Tests
print(power(2, 5))                              # Expected: 32
print(power(3, 0))                              # Expected: 1
print(count_digits(4231))                        # Expected: 4
print(count_digits(7))                           # Expected: 1
print(is_palindrome("racecar"))                  # Expected: True
print(is_palindrome("hello"))                    # Expected: False
print(flatten([1, [2, [3, 4], 5], 6]))          # Expected: [1, 2, 3, 4, 5, 6]
`,
    },
    {
      id: "ap-csa-recursion-checkpoint",
      slug: "recursion-checkpoint",
      title: "Checkpoint: Recursion",
      content: `## Checkpoint: Recursion

Nice work completing the Recursion module -- and the entire AP CSA course!

<!-- voice:section_check concept="base case, recursive case, recursion vs iteration trade-offs" -->

### Question 1
What are the two essential parts of every recursive function?

<details>
<summary>Show Answer</summary>

1. **Base case** -- the condition that stops the recursion
2. **Recursive case** -- the function calls itself with a simpler input

Without the base case, the function runs forever and crashes.
</details>

### Question 2
What is the output?
\`\`\`python
def mystery(n):
    if n <= 0:
        return 0
    return n + mystery(n - 2)

print(mystery(7))
\`\`\`

<details>
<summary>Show Answer</summary>

**16** -- The call chain is: 7 + mystery(5) = 7 + 5 + mystery(3) = 7 + 5 + 3 + mystery(1) = 7 + 5 + 3 + 1 + mystery(-1) = 7 + 5 + 3 + 1 + 0 = 16.
</details>

### Question 3
Why is naive recursive Fibonacci so slow?

<details>
<summary>Show Answer</summary>

It recomputes the same values many times. \`fibonacci(5)\` computes \`fibonacci(3)\` twice and \`fibonacci(2)\` three times. The total calls grow exponentially -- O(2^n). The iterative version is O(n) because it computes each value once.
</details>

### Question 4
Convert this recursive function to an iterative one:
\`\`\`python
def sum_to(n):
    if n <= 0:
        return 0
    return n + sum_to(n - 1)
\`\`\`

<details>
<summary>Show Answer</summary>

\`\`\`python
def sum_to(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total
\`\`\`
</details>

### Question 5
When is recursion a better choice than iteration?

<details>
<summary>Show Answer</summary>

Recursion is preferred when the problem has a naturally recursive structure -- trees, nested data, divide-and-conquer algorithms, and backtracking. If the problem is simple counting or accumulation, a loop is usually clearer and more memory-efficient.
</details>

### Congratulations!
You have completed the AP Computer Science A course. You now have a solid foundation in object-oriented programming, data structures, and algorithmic thinking.`,
    },
  ],
};
