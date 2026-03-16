import { Module } from "../types";

export const fibonacciModule: Module = {
  id: "fibonacci-pattern",
  title: "Fibonacci Numbers Pattern",
  description:
    "Recognize and solve problems where each state depends on the previous one or two states — the Fibonacci pattern family.",
  lessons: [
    {
      id: "fibonacci-intro",
      slug: "fibonacci-pattern-intro",
      title: "Introduction to the Fibonacci Pattern",
      content: `## The Fibonacci Pattern

The **Fibonacci pattern** covers problems where the solution for a given state depends on the solutions of **one or two previous states**. This creates a linear chain of dependencies that can be solved with simple DP or even constant-space variables.

### When to Recognize This Pattern

- The problem has a **linear sequence** of states (steps, indices, positions).
- Each state depends on a **fixed number of previous states** (usually 1-3).
- The recurrence looks like: \`f(n) = f(n-1) + f(n-2)\` or similar.

### The Template

\`\`\`python
# General Fibonacci-style DP
prev2, prev1 = base_case_0, base_case_1
for i in range(2, n + 1):
    curr = combine(prev1, prev2)  # e.g., prev1 + prev2
    prev2, prev1 = prev1, curr
return prev1
\`\`\`

### Space Optimization

Since each state only depends on a constant number of previous states, you can always optimize from O(n) space to **O(1)** by keeping only the last 2-3 values.

### Problems in This Module

1. **Fibonacci Numbers** — the classic sequence
2. **Staircase** — ways to climb n steps
3. **Number Factors** — ways to express n as a sum of factors
4. **Minimum Jumps to Reach End** — min jumps across an array
5. **House Thief** — max loot without robbing adjacent houses`,
    },
    {
      id: "fibonacci-numbers",
      slug: "fibonacci-numbers",
      title: "Fibonacci Numbers",
      content: `## Fibonacci Numbers

### Problem Statement

Compute the \`n\`th Fibonacci number where \`F(0) = 0\`, \`F(1) = 1\`, and \`F(n) = F(n-1) + F(n-2)\`.

### Examples

\`\`\`
Input: 5    Output: 5   (0, 1, 1, 2, 3, 5)
Input: 7    Output: 13  (0, 1, 1, 2, 3, 5, 8, 13)
Input: 10   Output: 55
\`\`\`

### Three Approaches

1. **Naive Recursion** — O(2^n) time, O(n) space — exponential, unusable for large n
2. **Memoization** — O(n) time, O(n) space — cache results
3. **Bottom-Up with O(1) space** — just track prev two values

### Complexity

- **Time:** O(n)
- **Space:** O(1) with space-optimized approach`,
      starterCode: `def fibonacci(n):
    # TODO: implement with O(1) space
    pass

# Test cases
print(fibonacci(5))    # Expected: 5
print(fibonacci(7))    # Expected: 13
print(fibonacci(10))   # Expected: 55
print(fibonacci(0))    # Expected: 0
`,
      solutionCode: `def fibonacci(n):
    if n <= 1:
        return n

    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        curr = prev1 + prev2
        prev2, prev1 = prev1, curr

    return prev1

# Test cases
print(fibonacci(5))    # Expected: 5
print(fibonacci(7))    # Expected: 13
print(fibonacci(10))   # Expected: 55
print(fibonacci(0))    # Expected: 0
`,
    },
    {
      id: "fibonacci-staircase",
      slug: "climbing-stairs",
      title: "Staircase (Climbing Stairs)",
      content: `## Staircase (Climbing Stairs)

### Problem Statement

You are climbing a staircase with \`n\` steps. Each time you can climb **1, 2, or 3** steps. How many **distinct ways** can you reach the top?

### Examples

\`\`\`
Input: 3    Output: 4
Ways: {1+1+1, 1+2, 2+1, 3}
\`\`\`

\`\`\`
Input: 4    Output: 7
Ways: {1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2, 1+3, 3+1}
\`\`\`

### Approach

This is a Fibonacci variant with three terms:
\`\`\`
dp[n] = dp[n-1] + dp[n-2] + dp[n-3]
\`\`\`

Base cases: \`dp[0] = 1, dp[1] = 1, dp[2] = 2\`

### Complexity

- **Time:** O(n)
- **Space:** O(1) with three variables`,
      starterCode: `def count_ways(n):
    # TODO: count ways to climb n stairs (1, 2, or 3 steps at a time)
    pass

# Test cases
print(count_ways(3))   # Expected: 4
print(count_ways(4))   # Expected: 7
print(count_ways(5))   # Expected: 13
`,
      solutionCode: `def count_ways(n):
    if n <= 1:
        return 1
    if n == 2:
        return 2

    a, b, c = 1, 1, 2
    for _ in range(3, n + 1):
        total = a + b + c
        a, b, c = b, c, total

    return c

# Test cases
print(count_ways(3))   # Expected: 4
print(count_ways(4))   # Expected: 7
print(count_ways(5))   # Expected: 13
`,
    },
    {
      id: "fibonacci-number-factors",
      slug: "number-factors",
      title: "Number Factors",
      content: `## Number Factors

### Problem Statement

Given a number \`n\`, count the number of ways to express it as a **sum of 1, 3, and 4**.

### Examples

\`\`\`
Input: 4    Output: 4
Ways: {1+1+1+1, 1+3, 3+1, 4}
\`\`\`

\`\`\`
Input: 5    Output: 6
Ways: {1+1+1+1+1, 1+1+3, 1+3+1, 3+1+1, 1+4, 4+1}
\`\`\`

### Approach

\`\`\`
dp[n] = dp[n-1] + dp[n-3] + dp[n-4]
\`\`\`

Base cases: \`dp[0] = 1, dp[1] = 1, dp[2] = 1, dp[3] = 2\`

### Complexity

- **Time:** O(n)
- **Space:** O(n), can be optimized to O(1) with 4 variables`,
      starterCode: `def count_factors(n):
    # TODO: count ways to express n as sum of 1, 3, and 4
    pass

# Test cases
print(count_factors(4))   # Expected: 4
print(count_factors(5))   # Expected: 6
print(count_factors(6))   # Expected: 9
`,
      solutionCode: `def count_factors(n):
    if n <= 2:
        return 1
    if n == 3:
        return 2

    dp = [0] * (n + 1)
    dp[0] = dp[1] = dp[2] = 1
    dp[3] = 2

    for i in range(4, n + 1):
        dp[i] = dp[i - 1] + dp[i - 3] + dp[i - 4]

    return dp[n]

# Test cases
print(count_factors(4))   # Expected: 4
print(count_factors(5))   # Expected: 6
print(count_factors(6))   # Expected: 9
`,
    },
    {
      id: "fibonacci-min-jumps",
      slug: "minimum-jumps",
      title: "Minimum Jumps to Reach End",
      content: `## Minimum Jumps to Reach End

### Problem Statement

Given an array of non-negative integers where each element represents the **maximum jump length** from that position, find the **minimum number of jumps** to reach the last index. Assume you can always reach the end.

### Examples

\`\`\`
Input:  [2, 1, 1, 1, 4]
Output: 3
Explanation: Jump 2→1→1→4 (indices 0→1→2→3 or 0→2→3→4)
\`\`\`

\`\`\`
Input:  [1, 1, 3, 6, 9, 3, 0, 1, 3]
Output: 4
\`\`\`

### Approach — Greedy (Optimal)

Track the farthest reachable position and jump boundaries:
1. At each step, update the farthest you can reach.
2. When you reach the current jump boundary, increment jumps.

### Complexity

- **Time:** O(n)
- **Space:** O(1)`,
      starterCode: `def min_jumps(arr):
    # TODO: find minimum jumps to reach the end
    pass

# Test cases
print(min_jumps([2, 1, 1, 1, 4]))              # Expected: 3
print(min_jumps([1, 1, 3, 6, 9, 3, 0, 1, 3]))  # Expected: 4
print(min_jumps([2, 3, 1, 1, 4]))               # Expected: 2
`,
      solutionCode: `def min_jumps(arr):
    n = len(arr)
    if n <= 1:
        return 0

    jumps = 0
    current_end = 0
    farthest = 0

    for i in range(n - 1):
        farthest = max(farthest, i + arr[i])

        if i == current_end:
            jumps += 1
            current_end = farthest

            if current_end >= n - 1:
                break

    return jumps

# Test cases
print(min_jumps([2, 1, 1, 1, 4]))              # Expected: 3
print(min_jumps([1, 1, 3, 6, 9, 3, 0, 1, 3]))  # Expected: 4
print(min_jumps([2, 3, 1, 1, 4]))               # Expected: 2
`,
    },
    {
      id: "fibonacci-house-thief",
      slug: "house-thief",
      title: "House Thief (House Robber)",
      content: `## House Thief (House Robber)

### Problem Statement

A thief plans to rob houses along a street. Each house has a certain amount of money. Adjacent houses have connected security systems — if two **adjacent** houses are broken into, the alarm triggers. Find the **maximum amount** the thief can rob without triggering the alarm.

### Examples

\`\`\`
Input:  [2, 5, 1, 3, 6, 2, 4]
Output: 15
Explanation: Rob houses with amounts 5 + 6 + 4 = 15
\`\`\`

\`\`\`
Input:  [2, 10, 14, 8, 1]
Output: 18
Explanation: Rob houses with amounts 2 + 14 + 1 = 17? No — 10 + 8 = 18 ✓
\`\`\`

### Approach

Classic Fibonacci-style DP:
\`\`\`
dp[i] = max(dp[i-1], nums[i] + dp[i-2])
\`\`\`

At each house: either skip it (take \`dp[i-1]\`) or rob it (take \`nums[i] + dp[i-2]\`).

### Complexity

- **Time:** O(n)
- **Space:** O(1) with two variables`,
      starterCode: `def house_thief(houses):
    # TODO: find max money without robbing adjacent houses
    pass

# Test cases
print(house_thief([2, 5, 1, 3, 6, 2, 4]))  # Expected: 15
print(house_thief([2, 10, 14, 8, 1]))       # Expected: 18
print(house_thief([6, 7, 1, 30, 8, 2, 4]))  # Expected: 41
`,
      solutionCode: `def house_thief(houses):
    if not houses:
        return 0
    if len(houses) == 1:
        return houses[0]

    prev2, prev1 = 0, houses[0]
    for i in range(1, len(houses)):
        curr = max(prev1, houses[i] + prev2)
        prev2, prev1 = prev1, curr

    return prev1

# Test cases
print(house_thief([2, 5, 1, 3, 6, 2, 4]))  # Expected: 15
print(house_thief([2, 10, 14, 8, 1]))       # Expected: 18
print(house_thief([6, 7, 1, 30, 8, 2, 4]))  # Expected: 41
`,
    },
  ],
};
