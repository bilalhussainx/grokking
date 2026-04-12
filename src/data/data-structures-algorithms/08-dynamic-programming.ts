import { Module } from "../types";

export const dynamicProgrammingModule: Module = {
  id: "dynamic-programming",
  title: "Dynamic Programming",
  description: "Master dynamic programming through memoization, tabulation, and classic problems like knapsack, longest common subsequence, and coin change.",
  lessons: [
    {
      id: "dp-memoization",
      slug: "dp-memoization",
      title: "Memoization (Top-Down)",
      content: `## Memoization — Top-Down Dynamic Programming

**Memoization** is a technique where you cache the results of expensive function calls and return the cached result when the same inputs occur again.

### When to Use DP

A problem has **optimal substructure** and **overlapping subproblems** when:
1. The optimal solution can be constructed from optimal solutions to subproblems
2. The same subproblems are solved multiple times

### Memoization Pattern

\`\`\`python
def solve(n, memo={}):
    if n in memo:
        return memo[n]
    # base cases
    # recursive computation
    memo[n] = result
    return result
\`\`\`

### Overlapping Subproblems: Fibonacci

\`\`\`mermaid
graph TD
    F5["fib(5)"] --> F4["fib(4)"]
    F5 --> F3a["fib(3)"]
    F4 --> F3b["fib(3)"]
    F4 --> F2a["fib(2)"]
    F3a --> F2b["fib(2)"]
    F3a --> F1a["fib(1)"]
    F3b --> F2c["fib(2)"]
    F3b --> F1b["fib(1)"]
    style F3a fill:#f59e0b,color:#000
    style F3b fill:#f59e0b,color:#000
    style F2a fill:#ef4444,color:#fff
    style F2b fill:#ef4444,color:#fff
    style F2c fill:#ef4444,color:#fff
\`\`\`

*Yellow/red nodes are computed multiple times without memoization. DP caches them so each is computed only once.*

### Problem: Climbing Stairs

You are climbing a staircase with \`n\` steps. Each time you can climb 1 or 2 steps. How many distinct ways can you reach the top?

\`\`\`
climb(1) -> 1
climb(2) -> 2
climb(3) -> 3  (1+1+1, 1+2, 2+1)
climb(4) -> 5  (1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2)
\`\`\`

### Complexity

- **Without memo:** O(2^n) — exponential
- **With memo:** O(n) — each subproblem solved once`,
      starterCode: `def climb_stairs_naive(n):
    # TODO: Naive recursive solution (exponential)
    pass

def climb_stairs_memo(n, memo=None):
    # TODO: Memoized solution (linear)
    pass

def grid_paths(m, n, memo=None):
    # TODO: Count unique paths in an m x n grid
    # Can only move right or down
    # Use memoization
    pass

# Test climbing stairs
print(climb_stairs_naive(5))   # Expected: 8
print(climb_stairs_memo(5))    # Expected: 8
print(climb_stairs_memo(10))   # Expected: 89
print(climb_stairs_memo(30))   # Expected: 1346269

# Test grid paths
print(grid_paths(3, 3))   # Expected: 6
print(grid_paths(3, 7))   # Expected: 28
print(grid_paths(1, 1))   # Expected: 1
`,
      solutionCode: `def climb_stairs_naive(n):
    if n <= 1:
        return 1
    return climb_stairs_naive(n - 1) + climb_stairs_naive(n - 2)

def climb_stairs_memo(n, memo=None):
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n <= 1:
        return 1
    memo[n] = climb_stairs_memo(n - 1, memo) + climb_stairs_memo(n - 2, memo)
    return memo[n]

def grid_paths(m, n, memo=None):
    if memo is None:
        memo = {}
    if (m, n) in memo:
        return memo[(m, n)]
    if m == 1 or n == 1:
        return 1
    memo[(m, n)] = grid_paths(m - 1, n, memo) + grid_paths(m, n - 1, memo)
    return memo[(m, n)]

# Test climbing stairs
print(climb_stairs_naive(5))   # Expected: 8
print(climb_stairs_memo(5))    # Expected: 8
print(climb_stairs_memo(10))   # Expected: 89
print(climb_stairs_memo(30))   # Expected: 1346269

# Test grid paths
print(grid_paths(3, 3))   # Expected: 6
print(grid_paths(3, 7))   # Expected: 28
print(grid_paths(1, 1))   # Expected: 1
`,
    },
    {
      id: "dp-tabulation",
      slug: "dp-tabulation",
      title: "Tabulation (Bottom-Up)",
      content: `## Tabulation — Bottom-Up Dynamic Programming

**Tabulation** builds a table from the smallest subproblems up to the desired answer. Unlike memoization (top-down), tabulation (bottom-up) avoids recursion and its stack overhead.

### Pattern

\`\`\`python
def solve(n):
    dp = [base_values]
    for i in range(start, n+1):
        dp[i] = combine(dp[smaller_subproblems])
    return dp[n]
\`\`\`

### Memoization vs Tabulation

| | Memoization | Tabulation |
|-|-------------|------------|
| Direction | Top-down | Bottom-up |
| Recursion | Yes | No |
| Stack overflow risk | Yes | No |
| Computes | Only needed subproblems | All subproblems |
| Space optimization | Harder | Easier |

### Top-Down vs Bottom-Up

\`\`\`mermaid
flowchart LR
    subgraph "Top-Down (Memoization)"
    TD1["Start: fib(5)"] --> TD2["Recurse down"]
    TD2 --> TD3["Hit base case"]
    TD3 --> TD4["Cache & return up"]
    end
    subgraph "Bottom-Up (Tabulation)"
    BU1["Start: dp[0]=0, dp[1]=1"] --> BU2["Build dp[2]"]
    BU2 --> BU3["Build dp[3]"]
    BU3 --> BU4["... dp[n] = answer"]
    end
    style TD1 fill:#6366f1,color:#fff
    style BU1 fill:#4ade80,color:#000
    style TD4 fill:#6366f1,color:#fff
    style BU4 fill:#4ade80,color:#000
\`\`\`

### Problem: Fibonacci & Coin Change

Implement Fibonacci using tabulation, then solve the coin change problem: given coins and an amount, find the minimum number of coins needed.

\`\`\`
coin_change([1, 5, 10, 25], 30) -> 2 (25 + 5)
coin_change([1, 3, 4], 6) -> 2 (3 + 3)
coin_change([2], 3) -> -1 (impossible)
\`\`\``,
      starterCode: `def fib_tabulation(n):
    # TODO: Compute n-th Fibonacci using tabulation
    pass

def coin_change(coins, amount):
    # TODO: Return minimum coins needed, or -1 if impossible
    pass

# Test Fibonacci
print(fib_tabulation(0))   # Expected: 0
print(fib_tabulation(1))   # Expected: 1
print(fib_tabulation(10))  # Expected: 55
print(fib_tabulation(20))  # Expected: 6765

# Test coin change
print(coin_change([1, 5, 10, 25], 30))  # Expected: 2
print(coin_change([1, 3, 4], 6))         # Expected: 2
print(coin_change([2], 3))               # Expected: -1
print(coin_change([1], 0))               # Expected: 0
print(coin_change([1, 2, 5], 11))        # Expected: 3
`,
      solutionCode: `def fib_tabulation(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] + 1 < dp[i]:
                dp[i] = dp[i - coin] + 1
    return dp[amount] if dp[amount] != float('inf') else -1

# Test Fibonacci
print(fib_tabulation(0))   # Expected: 0
print(fib_tabulation(1))   # Expected: 1
print(fib_tabulation(10))  # Expected: 55
print(fib_tabulation(20))  # Expected: 6765

# Test coin change
print(coin_change([1, 5, 10, 25], 30))  # Expected: 2
print(coin_change([1, 3, 4], 6))         # Expected: 2
print(coin_change([2], 3))               # Expected: -1
print(coin_change([1], 0))               # Expected: 0
print(coin_change([1, 2, 5], 11))        # Expected: 3
`,
    },
    {
      id: "dp-classic-1",
      slug: "dp-knapsack-lcs",
      title: "Knapsack & LCS",
      content: `## Classic DP: 0/1 Knapsack & Longest Common Subsequence

### Problem 1: 0/1 Knapsack

Given items with weights and values, and a knapsack capacity, find the maximum value you can carry. Each item can be used at most once.

\`\`\`
weights = [1, 3, 4, 5]
values  = [1, 4, 5, 7]
capacity = 7
Answer: 9 (items with weight 3 and 4, values 4 + 5)
\`\`\`

**Recurrence:** \`dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])\`

### Problem 2: Longest Common Subsequence (LCS)

Find the length of the longest subsequence common to two strings.

\`\`\`
LCS("ABCBDAB", "BDCAB") -> 4 ("BCAB")
LCS("ABC", "DEF") -> 0
\`\`\`

**Recurrence:**
- If chars match: \`dp[i][j] = dp[i-1][j-1] + 1\`
- If not: \`dp[i][j] = max(dp[i-1][j], dp[i][j-1])\``,
      starterCode: `def knapsack(weights, values, capacity):
    # TODO: Return maximum value achievable
    pass

def lcs(s1, s2):
    # TODO: Return length of longest common subsequence
    pass

def lcs_string(s1, s2):
    # TODO: Return the actual LCS string (not just length)
    pass

# Test knapsack
print(knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7))   # Expected: 9
print(knapsack([2, 3, 4, 5], [3, 4, 5, 6], 5))    # Expected: 7
print(knapsack([10], [100], 5))                     # Expected: 0

# Test LCS
print(lcs("ABCBDAB", "BDCAB"))     # Expected: 4
print(lcs("ABC", "DEF"))            # Expected: 0
print(lcs("AGGTAB", "GXTXAYB"))    # Expected: 4

# Test LCS string
print(lcs_string("ABCBDAB", "BDCAB"))   # Expected: "BCAB" or similar
print(lcs_string("AGGTAB", "GXTXAYB"))  # Expected: "GTAB" or similar
`,
      solutionCode: `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i - 1][w]
            if weights[i - 1] <= w:
                dp[i][w] = max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])
    return dp[n][capacity]

def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]

def lcs_string(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    # Backtrack to find the string
    result = []
    i, j = m, n
    while i > 0 and j > 0:
        if s1[i - 1] == s2[j - 1]:
            result.append(s1[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return ''.join(reversed(result))

# Test knapsack
print(knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7))   # Expected: 9
print(knapsack([2, 3, 4, 5], [3, 4, 5, 6], 5))    # Expected: 7
print(knapsack([10], [100], 5))                     # Expected: 0

# Test LCS
print(lcs("ABCBDAB", "BDCAB"))     # Expected: 4
print(lcs("ABC", "DEF"))            # Expected: 0
print(lcs("AGGTAB", "GXTXAYB"))    # Expected: 4

# Test LCS string
print(lcs_string("ABCBDAB", "BDCAB"))   # Expected: "BCAB" or similar
print(lcs_string("AGGTAB", "GXTXAYB"))  # Expected: "GTAB" or similar
`,
    },
    {
      id: "dp-classic-2",
      slug: "dp-lis-edit-distance",
      title: "LIS & Edit Distance",
      content: `## Classic DP: Longest Increasing Subsequence & Edit Distance

### Problem 1: Longest Increasing Subsequence (LIS)

Find the length of the longest strictly increasing subsequence.

\`\`\`
LIS([10, 9, 2, 5, 3, 7, 101, 18]) -> 4  ([2, 3, 7, 18] or [2, 5, 7, 101])
LIS([0, 1, 0, 3, 2, 3]) -> 4  ([0, 1, 2, 3])
\`\`\`

**O(n^2) approach:** \`dp[i]\` = length of LIS ending at index i.
For each j < i: if \`arr[j] < arr[i]\`, then \`dp[i] = max(dp[i], dp[j] + 1)\`

### Problem 2: Edit Distance (Levenshtein Distance)

Find the minimum number of operations (insert, delete, replace) to transform one string into another.

\`\`\`
edit_distance("kitten", "sitting") -> 3
edit_distance("", "abc") -> 3
\`\`\`

**Recurrence:**
- If chars match: \`dp[i][j] = dp[i-1][j-1]\`
- If not: \`dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\`
  - (delete, insert, replace)`,
      starterCode: `def longest_increasing_subsequence(arr):
    # TODO: Return length of LIS
    pass

def lis_sequence(arr):
    # TODO: Return the actual LIS (not just length)
    pass

def edit_distance(s1, s2):
    # TODO: Return minimum edit distance
    pass

# Test LIS
print(longest_increasing_subsequence([10, 9, 2, 5, 3, 7, 101, 18]))
# Expected: 4

print(longest_increasing_subsequence([0, 1, 0, 3, 2, 3]))
# Expected: 4

print(longest_increasing_subsequence([7, 7, 7, 7]))
# Expected: 1

# Test LIS sequence
print(lis_sequence([10, 9, 2, 5, 3, 7, 101, 18]))
# Expected: [2, 3, 7, 18] or [2, 5, 7, 18] or similar

# Test edit distance
print(edit_distance("kitten", "sitting"))  # Expected: 3
print(edit_distance("", "abc"))             # Expected: 3
print(edit_distance("abc", "abc"))          # Expected: 0
print(edit_distance("horse", "ros"))        # Expected: 3
`,
      solutionCode: `def longest_increasing_subsequence(arr):
    if not arr:
        return 0
    n = len(arr)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

def lis_sequence(arr):
    if not arr:
        return []
    n = len(arr)
    dp = [1] * n
    parent = [-1] * n
    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                parent[i] = j
    # Find the index of max LIS length
    max_idx = 0
    for i in range(n):
        if dp[i] > dp[max_idx]:
            max_idx = i
    # Backtrack
    result = []
    idx = max_idx
    while idx != -1:
        result.append(arr[idx])
        idx = parent[idx]
    return list(reversed(result))

def edit_distance(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]

# Test LIS
print(longest_increasing_subsequence([10, 9, 2, 5, 3, 7, 101, 18]))
# Expected: 4

print(longest_increasing_subsequence([0, 1, 0, 3, 2, 3]))
# Expected: 4

print(longest_increasing_subsequence([7, 7, 7, 7]))
# Expected: 1

# Test LIS sequence
print(lis_sequence([10, 9, 2, 5, 3, 7, 101, 18]))
# Expected: [2, 3, 7, 18] or similar

# Test edit distance
print(edit_distance("kitten", "sitting"))  # Expected: 3
print(edit_distance("", "abc"))             # Expected: 3
print(edit_distance("abc", "abc"))          # Expected: 0
print(edit_distance("horse", "ros"))        # Expected: 3
`,
    },
  ],
};
