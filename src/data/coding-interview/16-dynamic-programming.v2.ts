import { Module } from "../types";

export const dynamicProgrammingModule: Module = {
  id: "dynamic-programming",
  title: "Dynamic Programming",
  description: "Master dynamic programming through memoization and tabulation, solving classic optimization and counting problems.",
  lessons: [
    {
      id: "dp-intro",
      slug: "dp-intro",
      title: "Introduction to Dynamic Programming",
      content: `# Dynamic Programming

**Dynamic Programming (DP)** is an optimization technique for problems that have two key properties:

1. **Overlapping Subproblems:** The same smaller problems are solved repeatedly.
2. **Optimal Substructure:** The optimal solution to the problem can be built from optimal solutions to its subproblems.

\`\`\`concept
{
  "title": "The DP Paradox",
  "variant": "insight",
  "content": "Dynamic programming often feels like \\"adding memory to recursion\\" — you trade O(n) extra space to turn an exponential-time algorithm into a polynomial one. The magic is that you never recompute the same subproblem twice."
}
\`\`\`

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

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naive Recursion (Exponential)",
    "code": "def fib(n):\\n    if n <= 1:\\n        return n\\n    return fib(n-1) + fib(n-2)\\n\\n# fib(5) → 5\\n# Time: O(2^n) — recomputes fib(3) 2×, fib(2) 3×…"
  },
  "after": {
    "label": "DP with Memoization (Linear)",
    "code": "memo = {}\\ndef fib(n):\\n    if n <= 1:\\n        return n\\n    if n in memo:\\n        return memo[n]\\n    memo[n] = fib(n-1) + fib(n-2)\\n    return memo[n]\\n\\n# Time: O(n) Space: O(n)"
  }
}
\`\`\`

\`\`\`trace
{
  "title": "Memoization in Action – fib(5)",
  "language": "python",
  "code": "memo = {}\\ndef fib(n):\\n    if n <= 1:\\n        return n\\n    if n in memo:\\n        return memo[n]\\n    memo[n] = fib(n-1) + fib(n-2)\\n    return memo[n]\\n\\nprint(fib(5))",
  "frames": [
    { "line": 1, "vars": {"memo": {}}, "note": "empty cache", "stdout": "" },
    { "line": 7, "vars": {"n": 5, "memo": {}}, "note": "first call", "stdout": "" },
    { "line": 8, "vars": {"n": 4, "memo": {}}, "note": "descend left", "stdout": "" },
    { "line": 8, "vars": {"n": 3, "memo": {}}, "note": "descend left", "stdout": "" },
    { "line": 8, "vars": {"n": 2, "memo": {}}, "note": "descend left", "stdout": "" },
    { "line": 4, "vars": {"n": 2, "memo": {"2": 1}}, "note": "store fib(2)", "stdout": "" },
    { "line": 8, "vars": {"n": 3, "memo": {"2": 1}}, "note": "right child", "stdout": "" },
    { "line": 4, "vars": {"n": 3, "memo": {"2": 1, "3": 2}}, "note": "store fib(3)", "stdout": "" },
    { "line": 8, "vars": {"n": 4, "memo": {"2": 1, "3": 2}}, "note": "right child", "stdout": "" },
    { "line": 4, "vars": {"n": 4, "memo": {"2": 1, "3": 2, "4": 3}}, "note": "store fib(4)", "stdout": "" },
    { "line": 8, "vars": {"n": 5, "memo": {"2": 1, "3": 2, "4": 3}}, "note": "right child", "stdout": "" },
    { "line": 4, "vars": {"n": 5, "memo": {"2": 1, "3": 2, "4": 3, "5": 5}}, "note": "store fib(5)", "stdout": "5\\n" }
  ],
  "speed": 900
}
\`\`\`

## How to Identify DP Problems

Ask yourself:
- Can I break the problem into smaller versions of itself?
- Do subproblems overlap (same inputs computed multiple times)?
- Does the problem ask for an optimum (min/max), count of ways, or feasibility?

Common categories include: knapsack variants, string problems (LCS, edit distance), sequence problems (LIS), grid traversals, and counting problems.

\`\`\`quiz
{
  "title": "Spot the DP Problem",
  "questions": [
    {
      "question": "Which statement best signals that DP might apply?",
      "options": [
        "The input is a tree.",
        "The same sub-instance is solved many times.",
        "We need to sort the array first.",
        "A greedy choice is always safe."
      ],
      "answer": 1,
      "explanation": "Overlapping subproblems are the clearest DP indicator."
    },
    {
      "question": "A problem asks for the *minimum cost* to traverse an m×n grid. Which property must hold for DP to work?",
      "options": [
        "The grid must be square.",
        "Optimal paths must contain optimal sub-paths.",
        "All moves must have positive cost.",
        "You can only move right or down."
      ],
      "answer": 1,
      "explanation": "Optimal substructure guarantees that the best path to (i,j) is built from best paths to previous cells."
    },
    {
      "question": "You memoize a recursive function and the runtime stays exponential. The most likely cause is:",
      "options": [
        "Python dictionaries are slow.",
        "The recursion depth is too large.",
        "Subproblems are *not* overlapping.",
        "Base cases are missing."
      ],
      "answer": 2,
      "explanation": "Memoization only helps when identical subproblems repeat; otherwise the cache is never reused."
    }
  ]
}
\`\`\`

## DP Problem-Solving Framework

1. **Define the state:** What does \`dp[i]\` (or \`dp[i][j]\`) represent?
2. **Find the recurrence:** How does \`dp[i]\` relate to smaller subproblems?
3. **Set base cases:** What are the trivially solvable cases?
4. **Determine the iteration order:** Process states so dependencies are resolved first.
5. **Optimize space** if possible (often only the last row or two are needed).

\`\`\`steps
{
  "title": "From English to Code in 5 Steps",
  "steps": [
    {
      "title": "1. State Meaning",
      "content": "Write one plain sentence: \\"\`dp[i]\` is the maximum profit we can get using the first \`i\` items.\\" If you can't finish the sentence, you don't yet understand the subproblem."
    },
    {
      "title": "2. Recurrence Relation",
      "content": "Assume you already know the answer for all smaller indices. Express \`dp[i]\` as a function of those answers, e.g.:\\n\\n\`dp[i] = max(dp[i-1], dp[i-2] + profit[i])\`"
    },
    {
      "title": "3. Base Cases",
      "content": "Identify the smallest valid inputs. For Fibonacci: \`dp[0]=0, dp[1]=1\`. For knapsack with 0 items: \`dp[0]=0\`."
    },
    {
      "title": "4. Iteration Order",
      "content": "Tabulate so every right-hand side of the recurrence is already computed. Usually left→right, top→bottom, or diagonal."
    },
    {
      "title": "5. Space Optimization",
      "content": "Check if you only need the last 1–2 rows or a sliding window. Fibonacci only needs \`prev\` and \`curr\`, turning O(n) space into O(1)."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "DP applies when subproblems overlap and optimal substructure holds.",
    "Memoization (top-down) keeps the recursive structure; tabulation (bottom-up) removes it.",
    "Both approaches reduce time from exponential to polynomial by solving each subproblem once.",
    "Always define state, recurrence, base cases, and iteration order before coding.",
    "Space can often be shrunk from full table to a few variables once dependencies are understood."
  ]
}
\`\`\``,
    },
    {
      id: "dp-knapsack",
      slug: "dp-knapsack",
      title: "0/1 Knapsack",
      content: `# 0/1 Knapsack

\`\`\`concept
{
  "title": "What makes 0/1 Knapsack special?",
  "variant": "mental-model",
  "content": "Imagine you're packing for a hike. Each item has a weight and a value to you. You can either take the entire item or leave it — no breaking it in half. This 'all-or-nothing' choice is what the '0/1' means, and it's why greedy strategies (like picking by value-per-pound) can fail."
}
\`\`\`

## Problem Statement

Given \`n\` items, each with a **weight** and a **profit**, and a knapsack with maximum capacity \`W\`, find the maximum profit you can achieve. Each item can be included **at most once**.

\`\`\`quiz
{
  "title": "Quick sanity check",
  "questions": [
    {
      "question": "Why is the problem called '0/1' Knapsack?",
      "options": [
        "0 and 1 are the only valid profits",
        "Each item can be taken 0 or 1 times",
        "The knapsack capacity is binary"
      ],
      "answer": 1,
      "explanation": "The 0/1 label refers to the binary choice for every item: leave it (0) or take it entirely (1)."
    },
    {
      "question": "A greedy algorithm that repeatedly picks the item with the highest profit/weight ratio guarantees optimality for 0/1 Knapsack.",
      "options": [
        "True",
        "False"
      ],
      "answer": 1,
      "explanation": "Greedy fails here because we cannot take fractions. A high-ratio item might consume too much capacity, preventing a better combination of lighter items."
    },
    {
      "question": "Which property lets us apply dynamic programming?",
      "options": [
        "Overlapping subproblems & optimal substructure",
        "Items are sorted",
        "Weights are powers of two"
      ],
      "answer": 0,
      "explanation": "The best solution for capacity W either includes the current item or doesn't — both sub-problems reappear many times."
    }
  ]
}
\`\`\`

## Worked Example

**Input:**  
profits = [1, 6, 10, 16]  
weights = [1, 2, 3, 5]  
capacity = 7

**Goal:** Choose a subset with total weight ≤ 7 and maximum total profit.

\`\`\`algoviz
{
  "title": "DP table build-up (2D)",
  "type": "grid",
  "data": [
    [0, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 6, 7, 7, 7, 7, 7],
    [0, 1, 6, 10, 11, 16, 17, 17],
    [0, 1, 6, 10, 16, 16, 17, 22]
  ],
  "frames": [
    { "highlight": [0], "label": "Item 0 (wt 1, val 1) fits every capacity ≥ 1", "stats": {} },
    { "highlight": [1], "label": "Item 1 (wt 2, val 6): best of include/exclude", "stats": {} },
    { "highlight": [2], "label": "Item 2 (wt 3, val 10)", "stats": {} },
    { "highlight": [3], "label": "Item 3 (wt 5, val 16) → final answer 22", "stats": {} }
  ],
  "speed": 1200
}
\`\`\`

**Answer:** 22 (take items with weights 2 and 5, profits 6 + 16).

## Recurrence & Complexity

State: \`dp[i][w]\` = max profit using items \`0..i\` with capacity \`w\`.

Recurrence:
\`\`\`
dp[i][w] = max(
    dp[i-1][w],                                   // exclude item i
    dp[i-1][w - weights[i]] + profits[i]         // include item i if it fits
)
\`\`\`

Base case: \`dp[-1][*] = 0\` (no items).

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "2D DP (O(n·W) space)",
    "code": "dp = [[0]*(W+1) for _ in range(n)]\\nfor i in range(n):\\n    for w in range(W+1):\\n        if w < weights[i]:\\n            dp[i][w] = dp[i-1][w]\\n        else:\\n            dp[i][w] = max(dp[i-1][w],\\n                           dp[i-1][w-weights[i]] + profits[i])"
  },
  "after": {
    "label": "1D DP (O(W) space)",
    "code": "dp = [0]*(W+1)\\nfor i in range(n):\\n    for w in range(W, weights[i]-1, -1):\\n        dp[w] = max(dp[w],\\n                    dp[w-weights[i]] + profits[i])"
  }
}
\`\`\`

**Time:** O(n · W)  
**Space:** O(W) with 1D optimization.

\`\`\`callout
{
  "type": "warning",
  "title": "Reverse-order iteration required",
  "content": "When using the 1D array, always iterate capacity **backwards**. This prevents overwriting values that later iterations still need (earlier rows in the 2D view)."
}
\`\`\`

## Space-Optimized Implementation

\`\`\`playground
{
  "title": "1D bottom-up knapsack",
  "language": "python",
  "code": "def knapsack(profits, weights, W):\\n    n = len(profits)\\n    dp = [0] * (W + 1)\\n    for i in range(n):\\n        # go backwards to reuse previous row safely\\n        for w in range(W, weights[i] - 1, -1):\\n            dp[w] = max(dp[w], dp[w - weights[i]] + profits[i])\\n    return dp[W]\\n\\n# quick test\\nprint(knapsack([1, 6, 10, 16], [1, 2, 3, 5], 7))  # 22",
  "runnable": true
}
\`\`\`

## Trace of the Optimized Loop

\`\`\`trace
{
  "title": "Step-through for capacity = 7",
  "language": "python",
  "code": "profits = [1,6,10,16]\\nweights = [1,2,3,5]\\nW = 7\\ndp = [0]*8\\n\\nfor i in range(len(profits)):\\n    for w in range(W, weights[i]-1, -1):\\n        dp[w] = max(dp[w], dp[w-weights[i]] + profits[i])",
  "frames": [
    { "line": 1, "vars": { "i": 0, "w": 7, "dp": [0,1,1,1,1,1,1,1] }, "note": "item 0 (wt 1) updates every cell", "stdout": "" },
    { "line": 1, "vars": { "i": 1, "w": 7, "dp": [0,1,6,6,7,7,7,7] }, "note": "item 1 (wt 2) improves larger capacities", "stdout": "" },
    { "line": 1, "vars": { "i": 2, "w": 6, "dp": [0,1,6,10,11,16,17,17] }, "note": "item 2 (wt 3) adds new best 17 at w=6", "stdout": "" },
    { "line": 1, "vars": { "i": 3, "w": 7, "dp": [0,1,6,10,16,16,17,22] }, "note": "item 3 (wt 5) finally yields 22", "stdout": "" }
  ],
  "speed": 900
}
\`\`\`

## Key Takeaways

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "0/1 Knapsack is NP-complete, but DP solves it in pseudo-polynomial time O(n·W).",
    "State represents the best profit for a prefix of items and a given capacity.",
    "Space can be shrunk from O(n·W) to O(W) by iterating capacity in reverse.",
    "Greedy strategies (value/weight ordering) do **not** guarantee optimality here."
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "Subsequence vs. Substring",
  "variant": "mental-model",
  "content": "A **subsequence** maintains order but skips characters freely. A **substring** must stay contiguous. Example: in \\"ABCDE\\", \\"ACE\\" is a valid subsequence but not a substring, while \\"BCD\\" is both."
}
\`\`\`

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

\`\`\`algoviz
{
  "title": "Building the DP Table for \\"abdca\\" vs \\"cbda\\"",
  "type": "grid",
  "data": [
    ["", "c", "b", "d", "a"],
    ["", 0, 0, 0, 0],
    ["a", 0, 0, 0, 1],
    ["b", 0, 1, 1, 1],
    ["d", 0, 1, 2, 2],
    ["c", 1, 1, 2, 2],
    ["a", 1, 1, 2, 3]
  ],
  "frames": [
    { "highlight": [1, 1], "label": "Empty vs empty → 0", "stats": {"i": 0, "j": 0} },
    { "highlight": [2, 4], "label": "First 'a' matches last 'a' → 1", "stats": {"i": 1, "j": 4} },
    { "highlight": [3, 2], "label": "'b' matches 'b' → 1 + dp[2][1] = 1", "stats": {"i": 2, "j": 2} },
    { "highlight": [5, 3], "label": "'d' matches 'd' → 1 + dp[4][2] = 2", "stats": {"i": 4, "j": 3} },
    { "highlight": [6, 4], "label": "Final cell: LCS length = 3", "stats": {"i": 5, "j": 4} }
  ],
  "speed": 1000
}
\`\`\`

**Time Complexity:** O(m * n) where m and n are the string lengths.  
**Space Complexity:** O(m * n), reducible to O(min(m, n)) with row optimization.

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Which recurrence applies when s1[i-1] != s2[j-1]?",
      "options": ["dp[i][j] = 1 + dp[i-1][j-1]", "dp[i][j] = max(dp[i-1][j], dp[i][j-1])", "dp[i][j] = dp[i-1][j-1]", "dp[i][j] = 0"],
      "answer": 1,
      "explanation": "When characters don’t match we skip one character from either string and take the best result so far."
    },
    {
      "question": "What is the LCS length of \\"abcbdab\\" and \\"bdcaba\\"?",
      "options": ["3", "4", "5", "6"],
      "answer": 1,
      "explanation": "One longest subsequence is \\"bcab\\" (length 4); draw the 7×6 DP table to verify."
    },
    {
      "question": "How much space does the optimized two-row DP use for strings of length 500 and 800?",
      "options": ["O(500×800) = 400 000", "O(min(500,800)) = 500", "O(500+800) = 1300", "O(500²) = 250 000"],
      "answer": 1,
      "explanation": "Only the previous row is needed, so we keep two rows of the shorter string’s length."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "LCS Length in Python",
  "language": "python",
  "code": "def lcs(s1: str, s2: str) -> int:\\n    m, n = len(s1), len(s2)\\n    dp = [[0]*(n+1) for _ in range(m+1)]\\n    \\n    for i in range(1, m+1):\\n        for j in range(1, n+1):\\n            if s1[i-1] == s2[j-1]:\\n                dp[i][j] = 1 + dp[i-1][j-1]\\n            else:\\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\\n    \\n    return dp[m][n]\\n\\n# Quick tests\\nprint(lcs(\\"abdca\\", \\"cbda\\"))      # 3\\nprint(lcs(\\"passport\\", \\"ppsspt\\")) # 5\\nprint(lcs(\\"abc\\", \\"def\\"))         # 0",
  "runnable": true
}
\`\`\`

\`\`\`collapse
{
  "title": "Deep Dive: Reconstructing the Actual LCS",
  "content": "To print one valid LCS, walk backwards from \`dp[m][n]\`:\\n\\n1. If \`s1[i-1] == s2[j-1]\`, this character is part of the LCS—print it and move diagonally \`i--, j--\`.\\n2. Otherwise move to the larger of \`dp[i-1][j]\` or \`dp[i][j-1]\`.\\n\\nReverse the collected characters. Because multiple choices may have equal values, different paths can yield different but equally-long subsequences—hence the LCS itself is not unique, only its length is."
}
\`\`\``,
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

\`\`\`concept
{
  "title": "What is a Subsequence?",
  "variant": "mental-model",
  "content": "A subsequence is formed by deleting zero or more elements from an array without changing the order of the remaining elements. Unlike a substring, elements in a subsequence don't need to be contiguous. For example, in [4, 2, 3, 6], [2, 6] is a valid subsequence but [6, 2] is not because the order is preserved."
}
\`\`\`

## Approach 1: Dynamic Programming O(n²)

**State:** \`dp[i]\` = length of the longest increasing subsequence ending at index \`i\`.

**Recurrence:** For each \`j < i\`, if \`nums[j] < nums[i]\`, then \`dp[i] = max(dp[i], dp[j] + 1)\`. This means we can extend any increasing subsequence ending at \`j\` by appending \`nums[i]\`.

**Base case:** \`dp[i] = 1\` for all i (each element alone is a subsequence of length 1).

The answer is \`max(dp)\`.

\`\`\`trace
{
  "title": "DP Algorithm Trace on [10, 9, 2, 5, 3, 7, 101]",
  "language": "python",
  "code": "def lengthOfLIS(nums):\\n    n = len(nums)\\n    dp = [1] * n\\n    \\n    for i in range(n):\\n        for j in range(i):\\n            if nums[j] < nums[i]:\\n                dp[i] = max(dp[i], dp[j] + 1)\\n    \\n    return max(dp)\\n\\n# Test with example\\nnums = [10, 9, 2, 5, 3, 7, 101]\\nresult = lengthOfLIS(nums)\\nprint(f\\"LIS length: {result}\\")",
  "frames": [
    {"line": 2, "vars": {"n": 7, "nums": [10, 9, 2, 5, 3, 7, 101]}, "note": "Initialize dp array with all 1s", "stdout": ""},
    {"line": 4, "vars": {"i": 0, "dp": [1, 1, 1, 1, 1, 1, 1]}, "note": "Processing i=0 (value=10)", "stdout": ""},
    {"line": 4, "vars": {"i": 1, "dp": [1, 1, 1, 1, 1, 1, 1]}, "note": "Processing i=1 (value=9)", "stdout": ""},
    {"line": 4, "vars": {"i": 2, "dp": [1, 1, 1, 1, 1, 1, 1]}, "note": "Processing i=2 (value=2)", "stdout": ""},
    {"line": 4, "vars": {"i": 3, "dp": [1, 1, 1, 2, 1, 1, 1]}, "note": "i=3 (value=5): can extend subsequence ending at i=2", "stdout": ""},
    {"line": 4, "vars": {"i": 6, "dp": [1, 1, 1, 2, 2, 3, 4]}, "note": "Final dp array", "stdout": ""},
    {"line": 7, "vars": {"result": 4}, "note": "Return maximum value from dp", "stdout": "LIS length: 4"}
  ]
}
\`\`\`

## Approach 2: Optimized O(n log n) with Binary Search

The most efficient solution maintains a \`tails\` array where \`tails[k]\` stores the smallest ending element of all increasing subsequences of length \`k+1\` found so far.

\`\`\`concept
{
  "title": "The tails Array Intuition",
  "variant": "insight",
  "content": "The tails array doesn't store the actual LIS - it stores the best possible ending values for subsequences of different lengths. By keeping these values as small as possible, we maximize the chance of building longer subsequences in the future. This greedy approach works because a smaller ending value is easier to extend."
}
\`\`\`

\`\`\`algoviz
{
  "title": "Building tails array for [10, 9, 2, 5, 3, 7, 101]",
  "type": "array",
  "data": [10, 9, 2, 5, 3, 7, 101],
  "frames": [
    {"highlight": [0], "label": "Process 10: tails = [10]", "stats": {"tails_length": 1}},
    {"highlight": [1], "label": "Process 9: Replace 10 with 9, tails = [9]", "stats": {"tails_length": 1}},
    {"highlight": [2], "label": "Process 2: Replace 9 with 2, tails = [2]", "stats": {"tails_length": 1}},
    {"highlight": [3], "label": "Process 5: Extend, tails = [2, 5]", "stats": {"tails_length": 2}},
    {"highlight": [4], "label": "Process 3: Replace 5 with 3, tails = [2, 3]", "stats": {"tails_length": 2}},
    {"highlight": [5], "label": "Process 7: Extend, tails = [2, 3, 7]", "stats": {"tails_length": 3}},
    {"highlight": [6], "label": "Process 101: Extend, tails = [2, 3, 7, 101]", "stats": {"tails_length": 4}}
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "O(n log n) LIS Implementation",
  "language": "python",
  "code": "import bisect\\n\\ndef lengthOfLIS(nums):\\n    \\"\\"\\"\\n    Find length of longest increasing subsequence using binary search.\\n    Time: O(n log n), Space: O(n)\\n    \\"\\"\\"\\n    if not nums:\\n        return 0\\n    \\n    tails = []  # tails[i] = smallest ending of subsequence with length i+1\\n    \\n    for num in nums:\\n        # Find position where num should be inserted\\n        pos = bisect.bisect_left(tails, num)\\n        \\n        if pos == len(tails):\\n            # num is larger than all elements, extend the sequence\\n            tails.append(num)\\n        else:\\n            # Replace to maintain smallest possible ending\\n            tails[pos] = num\\n    \\n    return len(tails)\\n\\n# Test cases\\ntest_cases = [\\n    [4, 2, 3, 6, 10, 1, 12],\\n    [10, 9, 2, 5, 3, 7, 101, 18],\\n    [7, 7, 7, 7],\\n    [1, 3, 6, 7, 9, 4, 10, 5, 6]\\n]\\n\\nfor i, nums in enumerate(test_cases, 1):\\n    result = lengthOfLIS(nums)\\n    print(f\\"Test {i}: {nums}\\")\\n    print(f\\"LIS length: {result}\\")\\n    print()",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "LIS Algorithm Understanding",
  "questions": [
    {
      "question": "In the DP approach, what does dp[i] represent?",
      "options": ["The length of LIS starting at index i", "The length of LIS ending at index i", "The length of LIS that includes index i", "The maximum value in the subsequence ending at i"],
      "answer": 1,
      "explanation": "dp[i] stores the length of the longest increasing subsequence that ends at index i, meaning nums[i] must be the last element of that subsequence."
    },
    {
      "question": "Why do we replace elements in the tails array instead of just appending?",
      "options": ["To save memory", "To keep the smallest possible endings for future extensions", "To maintain the actual LIS sequence", "To reduce time complexity"],
      "answer": 1,
      "explanation": "By keeping the smallest possible ending values, we maximize the chance that future elements can extend existing subsequences, leading to longer subsequences."
    },
    {
      "question": "For the array [1, 2, 3, 0], what is the LIS length?",
      "options": ["1", "2", "3", "4"],
      "answer": 2,
      "explanation": "The longest increasing subsequence is [1, 2, 3] with length 3. The 0 cannot extend any existing subsequence."
    }
  ]
}
\`\`\`

**Time Complexity:** O(n²) for DP approach, O(n log n) for optimized approach.  
**Space Complexity:** O(n) for both approaches.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "LIS finds the longest subsequence (not necessarily contiguous) in strictly increasing order",
    "The O(n²) DP approach defines dp[i] as the LIS length ending at index i",
    "The O(n log n) approach uses a tails array with binary search for optimal efficiency",
    "The tails array stores smallest ending values, not the actual LIS sequence",
    "Both approaches are valuable - DP is more intuitive, while the optimized version handles larger inputs"
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "The Core Insight",
  "variant": "mental-model",
  "content": "Think of building a staircase where each step represents an amount from 0 to target. At each step, you ask: 'What's the cheapest way to reach here if I use one more coin?' The answer is always the minimum of all possible previous steps plus one coin."
}
\`\`\`

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

\`\`\`callout
{
  "type": "warning",
  "title": "Greedy Trap",
  "content": "A greedy approach (always picking the largest coin first) fails for many coin systems. For coins [1, 3, 4] and amount 6, greedy picks 4+1+1 (3 coins) while the optimal is 3+3 (2 coins)."
}
\`\`\`

## Dynamic Programming Approach

**State:** \`dp[a]\` = minimum number of coins to make amount \`a\`.

**Recurrence:** For each coin \`c\` in the denomination set:
\`dp[a] = min(dp[a], dp[a - c] + 1)\` if \`a - c >= 0\`.

**Base case:** \`dp[0] = 0\` (zero coins needed for amount 0). Initialize all other entries to infinity.

\`\`\`algoviz
{
  "title": "DP Table Construction for coins=[1,3,4], amount=6",
  "type": "array",
  "data": [0, 1, 2, 1, 1, 2, 2],
  "frames": [
    {"highlight": [0], "label": "Base case: dp[0] = 0", "stats": {"a": 0}},
    {"highlight": [1], "label": "a=1: use coin 1 → dp[1] = dp[0]+1 = 1", "stats": {"a": 1}},
    {"highlight": [2], "label": "a=2: use coin 1 → dp[2] = dp[1]+1 = 2", "stats": {"a": 2}},
    {"highlight": [3], "label": "a=3: min(dp[3-1]+1, dp[3-3]+1) = min(2,1) = 1", "stats": {"a": 3}},
    {"highlight": [4], "label": "a=4: min(dp[4-1]+1, dp[4-3]+1, dp[4-4]+1) = min(2,2,1) = 1", "stats": {"a": 4}},
    {"highlight": [5], "label": "a=5: min(dp[5-1]+1, dp[5-3]+1, dp[5-4]+1) = min(2,2,2) = 2", "stats": {"a": 5}},
    {"highlight": [6], "label": "a=6: min(dp[6-1]+1, dp[6-3]+1, dp[6-4]+1) = min(3,2,2) = 2", "stats": {"a": 6}}
  ],
  "speed": 1000
}
\`\`\`

Iterate amounts from 1 to the target, trying each coin at each amount. This is an **unbounded knapsack** variant since each coin can be used multiple times.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Tabulation (Bottom-Up)",
      "content": "\`\`\`python\\ndef coinChange(coins, amount):\\n    dp = [float('inf')] * (amount + 1)\\n    dp[0] = 0\\n    \\n    for a in range(1, amount + 1):\\n        for c in coins:\\n            if a - c >= 0:\\n                dp[a] = min(dp[a], dp[a - c] + 1)\\n    \\n    return dp[amount] if dp[amount] != float('inf') else -1\\n\`\`\`"
    },
    {
      "label": "Memoization (Top-Down)",
      "content": "\`\`\`python\\ndef coinChange(coins, amount):\\n    memo = {}\\n    \\n    def dfs(a):\\n        if a in memo:\\n            return memo[a]\\n        if a == 0:\\n            return 0\\n        if a < 0:\\n            return float('inf')\\n        \\n        min_coins = float('inf')\\n        for c in coins:\\n            result = dfs(a - c)\\n            if result != float('inf'):\\n                min_coins = min(min_coins, result + 1)\\n        \\n        memo[a] = min_coins\\n        return min_coins\\n    \\n    result = dfs(amount)\\n    return result if result != float('inf') else -1\\n\`\`\`"
    }
  ]
}
\`\`\`

**Time Complexity:** O(amount × len(coins))  
**Space Complexity:** O(amount)

\`\`\`quiz
{
  "title": "Coin Change Mastery Check",
  "questions": [
    {
      "question": "For coins=[2,5,7] and amount=11, what does dp[11] equal?",
      "options": ["2", "3", "4", "5"],
      "answer": 1,
      "explanation": "Optimal is 5+5+1 (but we don't have 1), so 7+2+2 = 3 coins. dp[11] = 3."
    },
    {
      "question": "Which approach avoids stack overflow for very large amounts?",
      "options": ["Memoization", "Tabulation", "Both equally", "Neither"],
      "answer": 1,
      "explanation": "Tabulation builds bottom-up iteratively without recursion, avoiding deep call stacks."
    },
    {
      "question": "What should dp be initialized to (except dp[0])?",
      "options": ["0", "-1", "infinity", "amount"],
      "answer": 2,
      "explanation": "We use infinity to represent 'unreachable' states, making min() updates work correctly."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Coin Change is an unbounded knapsack problem - each coin can be used multiple times",
    "Greedy fails; dynamic programming guarantees the optimal solution",
    "Both memoization and tabulation run in O(amount × coins) time and O(amount) space",
    "Tabulation is preferred for large amounts to avoid recursion depth issues",
    "The same DP pattern extends to other optimization problems like word break or perfect squares"
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "Why This Problem Matters",
  "variant": "insight",
  "content": "Climbing Stairs is the gateway DP problem: it hides the Fibonacci sequence in plain sight and teaches you to recognize that \\"number of ways\\" questions often have overlapping sub-problems. Once you see the pattern, you’ll spot it in interview questions about coin change, decode ways, and even house robber."
}
\`\`\`

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

\`\`\`algoviz
{
  "title": "Visualizing the Choices for n = 4",
  "type": "tree",
  "data": [1, 1, 2, 3, 5],
  "frames": [
    { "highlight": [0], "label": "Start at step 0", "stats": {} },
    { "highlight": [1], "label": "1 way to reach step 1", "stats": {} },
    { "highlight": [2], "label": "2 ways to reach step 2", "stats": {} },
    { "highlight": [3], "label": "3 ways to reach step 3", "stats": {} },
    { "highlight": [4], "label": "5 ways to reach step 4", "stats": {} }
  ],
  "speed": 1000
}
\`\`\`

## Approach

**State:** \`dp[i]\` = number of distinct ways to reach step \`i\`.

**Recurrence:** To reach step \`i\`, you either came from step \`i-1\` (took 1 step) or step \`i-2\` (took 2 steps):
\`dp[i] = dp[i-1] + dp[i-2]\`

This is exactly the Fibonacci sequence! \`dp[1] = 1, dp[2] = 2, dp[3] = 3, dp[4] = 5, ...\`

**Base cases:** \`dp[1] = 1\` (one way: single step), \`dp[2] = 2\` (two ways: 1+1 or 2).

Since each state depends only on the previous two, you can optimize space to O(1) by keeping just two variables.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "O(n) space tabulation",
    "code": "def climbStairs(n):\\n    if n <= 2:\\n        return n\\n    dp = [0]*(n+1)\\n    dp[1], dp[2] = 1, 2\\n    for i in range(3, n+1):\\n        dp[i] = dp[i-1] + dp[i-2]\\n    return dp[n]"
  },
  "after": {
    "label": "O(1) space iteration",
    "code": "def climbStairs(n):\\n    if n <= 2:\\n        return n\\n    prev2, prev1 = 1, 2\\n    for _ in range(3, n+1):\\n        curr = prev1 + prev2\\n        prev2, prev1 = prev1, curr\\n    return prev1"
  }
}
\`\`\`

\`\`\`trace
{
  "title": "Step-by-step for n = 5",
  "language": "python",
  "code": "def climbStairs(n):\\n    if n <= 2:\\n        return n\\n    prev2, prev1 = 1, 2\\n    for i in range(3, n+1):\\n        curr = prev1 + prev2\\n        prev2, prev1 = prev1, curr\\n        print(f'i={i}: curr={curr}, prev2={prev2}, prev1={prev1}')\\n    return prev1\\n\\nprint(climbStairs(5))",
  "frames": [
    { "line": 1, "vars": {"n": 5}, "stdout": "" },
    { "line": 2, "vars": {"n": 5}, "stdout": "" },
    { "line": 4, "vars": {"prev2": 1, "prev1": 2}, "stdout": "" },
    { "line": 5, "vars": {"i": 3, "curr": 3, "prev2": 2, "prev1": 3}, "stdout": "i=3: curr=3, prev2=2, prev1=3\\n" },
    { "line": 5, "vars": {"i": 4, "curr": 5, "prev2": 3, "prev1": 5}, "stdout": "i=3: curr=3, prev2=2, prev1=3\\ni=4: curr=5, prev2=3, prev1=5\\n" },
    { "line": 5, "vars": {"i": 5, "curr": 8, "prev2": 5, "prev1": 8}, "stdout": "i=3: curr=3, prev2=2, prev1=3\\ni=4: curr=5, prev2=3, prev1=5\\ni=5: curr=8, prev2=5, prev1=8\\n" },
    { "line": 6, "vars": {}, "stdout": "8\\n" }
  ],
  "speed": 800
}
\`\`\`

**Time Complexity:** O(n).  
**Space Complexity:** O(1) with the two-variable optimization.

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Which statement best explains why the recurrence is dp[i] = dp[i-1] + dp[i-2]?",
      "options": [
        "You add 1 and 2 to the previous counts.",
        "You can arrive at step i only from step i-1 or step i-2.",
        "Each step doubles the number of ways.",
        "It is an arbitrary choice that happens to work."
      ],
      "answer": 1,
      "explanation": "The last move is either a single step from i-1 or a double step from i-2; the total ways is the sum of those two disjoint sets of paths."
    },
    {
      "question": "If you can climb 1, 2, or 3 steps at a time, the new recurrence becomes:",
      "options": [
        "dp[i] = dp[i-1] + dp[i-2]",
        "dp[i] = dp[i-1] + dp[i-2] + dp[i-3]",
        "dp[i] = 3 * dp[i-1]",
        "dp[i] = dp[i-1] + 2"
      ],
      "answer": 1,
      "explanation": "You can arrive from i-1, i-2, or i-3, so the total ways is the sum of those three previous states."
    },
    {
      "question": "What is the space complexity of the optimal solution?",
      "options": ["O(n)", "O(log n)", "O(1)", "O(2^n)"],
      "answer": 2,
      "explanation": "Only the last two values are ever needed, so two variables suffice—constant space."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Try It: Climbing Stairs",
  "language": "python",
  "code": "def climb_stairs(n: int) -> int:\\n    # Write your O(n) time, O(1) space solution here\\n    pass\\n\\n# Test cases\\nfor k in [1, 3, 7, 10]:\\n    print(f'n={k} -> {climb_stairs(k)}')",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Counting problems with sequential choices often yield Fibonacci-style recurrences.",
    "Always verify base cases (n = 1, 2) before looping.",
    "Reduce space by keeping only the dependencies needed for the next step—here, just two variables.",
    "Recognizing this pattern unlocks similar interview questions (coin change, decode ways, house robber)."
  ]
}
\`\`\``,
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
