import { Module } from "../types";

export const dynamicProgrammingModule: Module = {
  id: "dynamic-programming",
  title: "Dynamic Programming",
  description:
    "Master dynamic programming through memoization and tabulation, solving classic optimization and counting problems.",
  lessons: [
    {
      id: "dp-intro",
      slug: "dp-intro",
      title: "Introduction to Dynamic Programming",
      content: `# Dynamic Programming

**Dynamic Programming (DP)** is an optimization technique for problems that have two key properties:

1. **Overlapping Subproblems:** The same smaller problems are solved repeatedly.
2. **Optimal Substructure:** The optimal solution to the problem can be built from optimal solutions to its subproblems.

## Two Approaches

### Top-Down (Memoization)
Write the recursive solution naturally, then cache results to avoid recomputation:

\`\`\`python
memo = {}
def fib(n):
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]
\`\`\`

### Bottom-Up (Tabulation)
Build a table from the smallest subproblems up to the desired answer:

\`\`\`python
def fib(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
\`\`\`

## How to Identify DP Problems

Ask yourself:
- Can I break the problem into smaller versions of itself?
- Do subproblems overlap (same inputs computed multiple times)?
- Does the problem ask for an optimum (min/max), count of ways, or feasibility?

Common categories include: knapsack variants, string problems (LCS, edit distance), sequence problems (LIS), grid traversals, and counting problems.

## DP Problem-Solving Framework

1. **Define the state:** What does \`dp[i]\` (or \`dp[i][j]\`) represent?
2. **Find the recurrence:** How does \`dp[i]\` relate to smaller subproblems?
3. **Set base cases:** What are the trivially solvable cases?
4. **Determine the iteration order:** Process states so dependencies are resolved first.
5. **Optimize space** if possible (often only the last row or two are needed).`,
    },
    {
      id: "dp-knapsack",
      slug: "dp-knapsack",
      title: "0/1 Knapsack",
      content: `# 0/1 Knapsack

## Problem Statement

Given \`n\` items, each with a **weight** and a **profit**, and a knapsack with maximum capacity \`W\`, find the maximum profit you can achieve. Each item can be included at most once (0/1 choice).

## Examples

**Example 1:**
\`\`\`
Input: profits = [1, 6, 10, 16], weights = [1, 2, 3, 5], capacity = 7
Output: 22
Explanation: Take items with weights 2 and 5 (profits 6 + 16 = 22).
\`\`\`

**Example 2:**
\`\`\`
Input: profits = [1, 2, 3], weights = [4, 5, 1], capacity = 4
Output: 3
Explanation: Only the item with weight 1 fits, or the item with weight 4. Best profit is 3.
\`\`\`

## Approach

**State:** \`dp[i][w]\` = maximum profit using items 0..i with capacity w.

**Recurrence:**
- Exclude item i: \`dp[i][w] = dp[i-1][w]\`
- Include item i (if it fits): \`dp[i][w] = dp[i-1][w - weights[i]] + profits[i]\`
- Take the maximum of both choices.

**Base case:** \`dp[0][w] = profits[0]\` if \`weights[0] <= w\`, else 0.

**Space optimization:** Since each row only depends on the previous row, you can use a 1D array and iterate capacity in reverse.

**Time Complexity:** O(n * W).
**Space Complexity:** O(W) with the optimized 1D approach.`,
      starterCode: `def knapsack(profits, weights, capacity):
    # TODO: Return maximum profit within the given capacity
    pass

# Test cases
print(knapsack([1, 6, 10, 16], [1, 2, 3, 5], 7))
# Expected: 22

print(knapsack([1, 2, 3], [4, 5, 1], 4))
# Expected: 3
`,
      solutionCode: `def knapsack(profits, weights, capacity):
    n = len(profits)
    dp = [0] * (capacity + 1)

    # Initialize for the first item
    for w in range(capacity + 1):
        if weights[0] <= w:
            dp[w] = profits[0]

    # Process remaining items
    for i in range(1, n):
        # Traverse capacity in reverse to avoid using same item twice
        for w in range(capacity, -1, -1):
            if weights[i] <= w:
                dp[w] = max(dp[w], dp[w - weights[i]] + profits[i])

    return dp[capacity]

# Test cases
print(knapsack([1, 6, 10, 16], [1, 2, 3, 5], 7))
# Expected: 22

print(knapsack([1, 2, 3], [4, 5, 1], 4))
# Expected: 3
`,
    },
    {
      id: "dp-lcs",
      slug: "dp-lcs",
      title: "Longest Common Subsequence",
      content: `# Longest Common Subsequence

## Problem Statement

Given two strings \`s1\` and \`s2\`, find the length of their **longest common subsequence** (LCS). A subsequence is a sequence derived by deleting zero or more characters without changing the order of remaining characters.

## Examples

**Example 1:**
\`\`\`
Input: s1 = "abdca", s2 = "cbda"
Output: 3
Explanation: LCS is "bda" (length 3).
\`\`\`

**Example 2:**
\`\`\`
Input: s1 = "passport", s2 = "ppsspt"
Output: 5
Explanation: LCS is "psspt" (length 5).
\`\`\`

**Example 3:**
\`\`\`
Input: s1 = "abc", s2 = "def"
Output: 0
Explanation: No common characters.
\`\`\`

## Approach

**State:** \`dp[i][j]\` = length of LCS of \`s1[0..i-1]\` and \`s2[0..j-1]\`.

**Recurrence:**
- If \`s1[i-1] == s2[j-1]\`: characters match, \`dp[i][j] = 1 + dp[i-1][j-1]\`.
- Otherwise: skip one character from either string, \`dp[i][j] = max(dp[i-1][j], dp[i][j-1])\`.

**Base case:** \`dp[0][j] = 0\` and \`dp[i][0] = 0\` (empty string has LCS of 0 with anything).

Build the table row by row. The answer is \`dp[len(s1)][len(s2)]\`.

**Time Complexity:** O(m * n) where m and n are the string lengths.
**Space Complexity:** O(m * n), reducible to O(min(m, n)) with row optimization.`,
      starterCode: `def longest_common_subsequence(s1, s2):
    # TODO: Return the length of the longest common subsequence
    pass

# Test cases
print(longest_common_subsequence("abdca", "cbda"))
# Expected: 3

print(longest_common_subsequence("passport", "ppsspt"))
# Expected: 5

print(longest_common_subsequence("abc", "def"))
# Expected: 0
`,
      solutionCode: `def longest_common_subsequence(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]

# Test cases
print(longest_common_subsequence("abdca", "cbda"))
# Expected: 3

print(longest_common_subsequence("passport", "ppsspt"))
# Expected: 5

print(longest_common_subsequence("abc", "def"))
# Expected: 0
`,
    },
    {
      id: "dp-lis",
      slug: "dp-lis",
      title: "Longest Increasing Subsequence",
      content: `# Longest Increasing Subsequence

## Problem Statement

Given an integer array, find the length of the **longest strictly increasing subsequence**.

## Examples

**Example 1:**
\`\`\`
Input: [4, 2, 3, 6, 10, 1, 12]
Output: 5
Explanation: [2, 3, 6, 10, 12] is the LIS.
\`\`\`

**Example 2:**
\`\`\`
Input: [10, 9, 2, 5, 3, 7, 101, 18]
Output: 4
Explanation: [2, 3, 7, 101] or [2, 3, 7, 18] or [2, 5, 7, 101] etc.
\`\`\`

**Example 3:**
\`\`\`
Input: [7, 7, 7, 7]
Output: 1
Explanation: All elements are equal, so LIS has length 1.
\`\`\`

## Approach

**State:** \`dp[i]\` = length of the longest increasing subsequence ending at index \`i\`.

**Recurrence:** For each \`j < i\`, if \`nums[j] < nums[i]\`, then \`dp[i] = max(dp[i], dp[j] + 1)\`. This means we can extend any increasing subsequence ending at \`j\` by appending \`nums[i]\`.

**Base case:** \`dp[i] = 1\` for all i (each element alone is a subsequence of length 1).

The answer is \`max(dp)\`.

There is also an O(n log n) approach using binary search with a "tails" array, but the O(n^2) DP approach is more intuitive and commonly expected in interviews.

**Time Complexity:** O(n^2).
**Space Complexity:** O(n).`,
      starterCode: `def longest_increasing_subsequence(nums):
    # TODO: Return the length of the longest increasing subsequence
    pass

# Test cases
print(longest_increasing_subsequence([4, 2, 3, 6, 10, 1, 12]))
# Expected: 5

print(longest_increasing_subsequence([10, 9, 2, 5, 3, 7, 101, 18]))
# Expected: 4

print(longest_increasing_subsequence([7, 7, 7, 7]))
# Expected: 1
`,
      solutionCode: `def longest_increasing_subsequence(nums):
    if not nums:
        return 0

    n = len(nums)
    dp = [1] * n

    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)

    return max(dp)

# Test cases
print(longest_increasing_subsequence([4, 2, 3, 6, 10, 1, 12]))
# Expected: 5

print(longest_increasing_subsequence([10, 9, 2, 5, 3, 7, 101, 18]))
# Expected: 4

print(longest_increasing_subsequence([7, 7, 7, 7]))
# Expected: 1
`,
    },
    {
      id: "dp-coin-change",
      slug: "dp-coin-change",
      title: "Coin Change",
      content: `# Coin Change

## Problem Statement

Given an array of coin denominations and a target amount, find the **minimum number of coins** needed to make that amount. If the amount cannot be made, return \`-1\`. You have an unlimited supply of each coin denomination.

## Examples

**Example 1:**
\`\`\`
Input: coins = [1, 5, 10, 25], amount = 36
Output: 3
Explanation: 25 + 10 + 1 = 36 (3 coins).
\`\`\`

**Example 2:**
\`\`\`
Input: coins = [1, 3, 4], amount = 6
Output: 2
Explanation: 3 + 3 = 6 (2 coins).
\`\`\`

**Example 3:**
\`\`\`
Input: coins = [2], amount = 3
Output: -1
Explanation: Cannot make 3 with only denomination 2.
\`\`\`

## Approach

**State:** \`dp[a]\` = minimum number of coins to make amount \`a\`.

**Recurrence:** For each coin \`c\` in the denomination set:
\`dp[a] = min(dp[a], dp[a - c] + 1)\` if \`a - c >= 0\`.

**Base case:** \`dp[0] = 0\` (zero coins needed for amount 0). Initialize all other entries to infinity.

Iterate amounts from 1 to the target, trying each coin at each amount. This is an **unbounded knapsack** variant since each coin can be used multiple times.

**Time Complexity:** O(amount * len(coins)).
**Space Complexity:** O(amount).`,
      starterCode: `def coin_change(coins, amount):
    # TODO: Return minimum number of coins to make the amount, or -1 if impossible
    pass

# Test cases
print(coin_change([1, 5, 10, 25], 36))
# Expected: 3

print(coin_change([1, 3, 4], 6))
# Expected: 2

print(coin_change([2], 3))
# Expected: -1
`,
      solutionCode: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a and dp[a - coin] != float('inf'):
                dp[a] = min(dp[a], dp[a - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1

# Test cases
print(coin_change([1, 5, 10, 25], 36))
# Expected: 3

print(coin_change([1, 3, 4], 6))
# Expected: 2

print(coin_change([2], 3))
# Expected: -1
`,
    },
    {
      id: "dp-climbing-stairs",
      slug: "dp-climbing-stairs",
      title: "Climbing Stairs",
      content: `# Climbing Stairs

## Problem Statement

You are climbing a staircase with \`n\` steps. Each time you can climb either **1 step** or **2 steps**. In how many distinct ways can you reach the top?

## Examples

**Example 1:**
\`\`\`
Input: n = 2
Output: 2
Explanation: (1+1) or (2). Two ways.
\`\`\`

**Example 2:**
\`\`\`
Input: n = 4
Output: 5
Explanation: (1+1+1+1), (1+1+2), (1+2+1), (2+1+1), (2+2). Five ways.
\`\`\`

**Example 3:**
\`\`\`
Input: n = 1
Output: 1
\`\`\`

## Approach

**State:** \`dp[i]\` = number of distinct ways to reach step \`i\`.

**Recurrence:** To reach step \`i\`, you either came from step \`i-1\` (took 1 step) or step \`i-2\` (took 2 steps):
\`dp[i] = dp[i-1] + dp[i-2]\`

This is exactly the Fibonacci sequence! \`dp[1] = 1, dp[2] = 2, dp[3] = 3, dp[4] = 5, ...\`

**Base cases:** \`dp[1] = 1\` (one way: single step), \`dp[2] = 2\` (two ways: 1+1 or 2).

Since each state depends only on the previous two, you can optimize space to O(1) by keeping just two variables.

**Time Complexity:** O(n).
**Space Complexity:** O(1) with the two-variable optimization.`,
      starterCode: `def climb_stairs(n):
    # TODO: Return the number of distinct ways to climb n stairs
    pass

# Test cases
print(climb_stairs(2))
# Expected: 2

print(climb_stairs(4))
# Expected: 5

print(climb_stairs(1))
# Expected: 1

print(climb_stairs(5))
# Expected: 8
`,
      solutionCode: `def climb_stairs(n):
    if n <= 2:
        return n

    prev2 = 1  # ways to reach step 1
    prev1 = 2  # ways to reach step 2

    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current

    return prev1

# Test cases
print(climb_stairs(2))
# Expected: 2

print(climb_stairs(4))
# Expected: 5

print(climb_stairs(1))
# Expected: 1

print(climb_stairs(5))
# Expected: 8
`,
    },
  ],
};
