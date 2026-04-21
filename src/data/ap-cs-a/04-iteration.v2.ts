import { Module } from "../types";

export const iterationModule: Module = {
  id: "ap-csa-iteration",
  title: "Iteration",
  description: "Master for loops, while loops, and nested loops -- with Java concepts and Python practice.",
  lessons: [
    {
      id: "ap-csa-while-loops",
      slug: "while-loops",
      title: "While Loops",
      content: `## While Loops

<!-- voice:key_insight -->

A **while loop** repeats a block of code as long as a condition remains true.

### Java vs. Python

**Java:**
\`\`\`java
int count = 0;
while (count < 5) {
    System.out.println(count);
    count++;
}
\`\`\`

**Python:**
\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

### Common While Loop Patterns

**Sentinel loop** -- repeat until a special value:
\`\`\`python
total = 0
num = int(input("Enter a number (-1 to stop): "))
while num != -1:
    total += num
    num = int(input("Enter a number (-1 to stop): "))
\`\`\`

**Validation loop** -- keep asking until valid input:
\`\`\`python
age = int(input("Enter your age: "))
while age < 0 or age > 150:
    print("Invalid age. Try again.")
    age = int(input("Enter your age: "))
\`\`\`

### Infinite Loop Danger

If the condition never becomes false, the loop runs forever:
\`\`\`python
# BAD -- infinite loop!
x = 1
while x > 0:
    x += 1  # x only gets bigger, never <= 0
\`\`\`

### Analogy: While Loops Are Like "Repeat Until Done"

Like washing dishes: "while there are dirty dishes, wash one." You keep going until the condition (dirty dishes exist) becomes false.

### Deeper Reading
- AP CSA Unit 4: Iteration
- Common loop patterns and idioms

### Reflection Questions
1. When would you use a while loop instead of a for loop?
2. How can you prevent infinite loops?
3. What is a sentinel value?`,
    },
    {
      id: "ap-csa-for-loops",
      slug: "for-loops",
      title: "For Loops and Nested Loops",
      content: `## For Loops and Nested Loops

### Java For Loop vs. Python

**Java traditional for loop:**
\`\`\`java
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
\`\`\`

**Python equivalent:**
\`\`\`python
for i in range(10):
    print(i)
\`\`\`

**Java enhanced for loop (for-each):**
\`\`\`java
int[] scores = {90, 85, 78, 92};
for (int score : scores) {
    System.out.println(score);
}
\`\`\`

**Python equivalent:**
\`\`\`python
scores = [90, 85, 78, 92]
for score in scores:
    print(score)
\`\`\`

### Nested Loops

<!-- voice:key_insight -->

A loop inside another loop. The inner loop completes all its iterations for each single iteration of the outer loop.

\`\`\`python
for row in range(3):
    for col in range(4):
        print(f"({row},{col})", end=" ")
    print()  # New line after each row
\`\`\`

Output:
\`\`\`
(0,0) (0,1) (0,2) (0,3)
(1,0) (1,1) (1,2) (1,3)
(2,0) (2,1) (2,2) (2,3)
\`\`\`

**How many times does the inner code run?** Outer iterations x Inner iterations = 3 x 4 = 12.

### String Traversal with Loops

\`\`\`python
word = "Hello"
for i in range(len(word)):
    print(f"Index {i}: {word[i]}")
\`\`\`

### Analogy: Nested Loops Are Like Clock Hands

The minute hand (inner loop) goes around 60 times for each 1 tick of the hour hand (outer loop). After 12 hours, the minute hand has made 720 trips.

### Deeper Reading
- AP CSA: Nested iteration patterns
- Loop complexity and counting iterations

### Reflection Questions
1. How many total iterations occur in a nested loop of 5 x 10?
2. What is the difference between \`break\` and \`continue\`?
3. When are nested loops necessary?`,
    },
    {
      id: "ap-csa-iteration-exercise",
      slug: "iteration-exercise",
      title: "Practice: Iteration",
      content: `## Practice: Iteration

Practice loops with these classic AP CSA-style problems.`,
      starterCode: `def sum_digits(n):
    """Sum all digits of a positive integer using a while loop.

    Example: sum_digits(1234) -> 10
    """
    # TODO: Repeatedly get last digit with % 10, remove it with // 10
    pass

def print_multiplication_table(n):
    """Return a list of strings representing an n x n multiplication table.

    Example: print_multiplication_table(3) ->
      ['1 2 3', '2 4 6', '3 6 9']
    """
    # TODO: Use nested loops
    pass

def collatz_steps(n):
    """Count steps in the Collatz sequence until n reaches 1.
    Rules: if n is even, n = n / 2; if odd, n = 3n + 1.

    Example: collatz_steps(6) -> 8 (6->3->10->5->16->8->4->2->1)
    """
    # TODO: Use a while loop
    pass

def string_pattern(n):
    """Return a list of strings forming a right triangle pattern.

    Example: string_pattern(4) -> ['*', '**', '***', '****']
    """
    # TODO: Use a loop to build each row
    pass

# Tests
print(sum_digits(1234))              # Expected: 10
print(print_multiplication_table(3)) # Expected: ['1 2 3', '2 4 6', '3 6 9']
print(collatz_steps(6))              # Expected: 8
print(string_pattern(4))            # Expected: ['*', '**', '***', '****']
`,
      solutionCode: `def sum_digits(n):
    """Sum all digits of a positive integer using a while loop."""
    total = 0
    while n > 0:
        total += n % 10
        n = n // 10
    return total

def print_multiplication_table(n):
    """Return a list of strings representing an n x n multiplication table."""
    rows = []
    for i in range(1, n + 1):
        row_parts = []
        for j in range(1, n + 1):
            row_parts.append(str(i * j))
        rows.append(' '.join(row_parts))
    return rows

def collatz_steps(n):
    """Count steps in the Collatz sequence until n reaches 1."""
    steps = 0
    while n != 1:
        if n % 2 == 0:
            n = n // 2
        else:
            n = 3 * n + 1
        steps += 1
    return steps

def string_pattern(n):
    """Return a list of strings forming a right triangle pattern."""
    return ['*' * i for i in range(1, n + 1)]

# Tests
print(sum_digits(1234))              # Expected: 10
print(print_multiplication_table(3)) # Expected: ['1 2 3', '2 4 6', '3 6 9']
print(collatz_steps(6))              # Expected: 8
print(string_pattern(4))            # Expected: ['*', '**', '***', '****']
`,
    },
    {
      id: "ap-csa-iteration-checkpoint",
      slug: "iteration-checkpoint",
      title: "Checkpoint: Iteration",
      content: `## Checkpoint: Iteration

<!-- voice:section_check -->

### Question 1
How many times does the following code print "Hello"?
\`\`\`python
for i in range(2):
    for j in range(3):
        print("Hello")
\`\`\`

<details>
<summary>Show Answer</summary>

**6 times**. Outer loop runs 2 times, inner loop runs 3 times each = 2 x 3 = 6.
</details>

### Question 2
What is the value of \`total\` after this code?
\`\`\`python
total = 0
x = 1
while x <= 100:
    total += x
    x += 1
\`\`\`

<details>
<summary>Show Answer</summary>

**5050**. This sums all integers from 1 to 100. (Gauss's formula: n(n+1)/2 = 100 * 101 / 2 = 5050)
</details>

### Question 3
Convert this Java for loop to Python:
\`\`\`java
for (int i = 10; i > 0; i -= 2) {
    System.out.println(i);
}
\`\`\`

<details>
<summary>Show Answer</summary>

\`\`\`python
for i in range(10, 0, -2):
    print(i)
\`\`\`
Prints: 10, 8, 6, 4, 2
</details>

### Question 4
What is the Collatz conjecture, and why is it interesting?

<details>
<summary>Show Answer</summary>

The Collatz conjecture states that the sequence (if even, divide by 2; if odd, multiply by 3 and add 1) will always eventually reach 1, no matter the starting number. It is interesting because despite its simplicity, nobody has been able to prove it mathematically -- it remains an open problem.
</details>

### Question 5
When would you choose a while loop over a for loop?

<details>
<summary>Show Answer</summary>

Use a **while loop** when you do not know how many iterations you need (e.g., reading until end of input, searching for a condition). Use a **for loop** when iterating a known number of times or through a collection.
</details>

### Excellent!
You have mastered iteration. Next: writing your own classes.`,
    },
  ],
};
