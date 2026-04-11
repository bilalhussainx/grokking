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

Memoization is an optimization technique within dynamic programming that caches the results of expensive function calls and returns the cached result when the same inputs occur again. It transforms exponential-time recursive solutions into polynomial-time ones by ensuring each subproblem is solved only once.

\`\`\`concept
{
  "title": "Memoization as a Mental Model",
  "variant": "mental-model",
  "content": "Think of memoization like a chef keeping a chalkboard of dishes already prepared. When an order comes in, the chef first checks the board: if the dish is already cooked, it's served immediately. Only if it's not on the board does the chef cook it—and then writes the result so future identical orders are instant. This 'check board → cook → write result' loop is exactly what your recursive function does with its cache."
}
\`\`\`

### When to Use DP

A problem is ripe for memoization when it exhibits:

1. **Optimal substructure** – the optimal solution can be constructed from optimal solutions to subproblems.
2. **Overlapping subproblems** – the same subproblems are solved multiple times in a naïve recursion.

\`\`\`quiz
{
  "title": "Spot the Overlapping Subproblems",
  "questions": [
    {
      "question": "Which problem does NOT have overlapping subproblems?",
      "options": ["Fibonacci numbers", "Binary search on a sorted array", "Climbing stairs (1 or 2 steps)", "Coin change"],
      "answer": 1,
      "explanation": "Binary search splits the search space in half each time and never revisits the same index, so no overlap occurs."
    },
    {
      "question": "In the Fibonacci recursion tree for fib(5), how many distinct subproblems exist?",
      "options": ["5", "6", "7", "8"],
      "answer": 1,
      "explanation": "The distinct subproblems are fib(0)…fib(5), i.e. 6 unique values, even though the naïve tree recomputes some of them multiple times."
    },
    {
      "question": "Memoization reduces time complexity by trading what for speed?",
      "options": ["CPU cores", "Memory space", "Code clarity", "Language features"],
      "answer": 1,
      "explanation": "We store previously computed results in a cache, so we pay extra space to save time."
    }
  ]
}
\`\`\`

### Memoization Pattern

The top-down template is a three-line addition to any naïve recursion:

\`\`\`python
def solve(args, memo={}):
    if args in memo:               # 1. check cache
        return memo[args]
    # base case handling
    result = ...                   # 2. recursive computation
    memo[args] = result            # 3. store before return
    return result
\`\`\`

\`\`\`playground
{
  "title": "Memoized Fibonacci",
  "language": "python",
  "code": "def fib(n, memo={}):\\n    if n in memo:\\n        return memo[n]\\n    if n <= 1:\\n        return n\\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\\n    return memo[n]\\n\\nprint(fib(10))  # 55\\nprint(fib(50))  # 12586269025 (instant)",
  "runnable": true
}
\`\`\`

### Overlapping Subproblems in Action

\`\`\`algoviz
{
  "title": "Naïve vs Memoized Fibonacci",
  "type": "tree",
  "data": ["fib(5)", "fib(4)", "fib(3)", "fib(3)", "fib(2)", "fib(2)", "fib(1)", "fib(2)", "fib(1)", "fib(1)", "fib(0)"],
  "frames": [
    { "highlight": [0], "label": "call fib(5)", "stats": {"cache hits":0} },
    { "highlight": [1,2], "label": "spawn fib(4) & fib(3)", "stats": {"cache hits":0} },
    { "highlight": [3,4], "label": "fib(4) spawns fib(3) & fib(2) — fib(3) already seen!", "stats": {"cache hits":1} },
    { "highlight": [5,6], "label": "fib(3) (second) spawns fib(2) & fib(1)", "stats": {"cache hits":1} },
    { "highlight": [7], "label": "fib(2) (third) — now cached, skipped recomputation", "stats": {"cache hits":2} }
  ],
  "speed": 1000
}
\`\`\`

Yellow nodes are recomputed multiple times without memoization; with memoization each distinct subproblem is evaluated once.

### Classic Problem: Climbing Stairs

You are climbing a staircase with \`n\` steps. Each time you can climb 1 or 2 steps. How many distinct ways can you reach the top?

\`\`\`
climb(1) -> 1
climb(2) -> 2
climb(3) -> 3  (1+1+1, 1+2, 2+1)
climb(4) -> 5  (1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2)
\`\`\`

\`\`\`trace
{
  "title": "climb(4) with memoization",
  "language": "python",
  "code": "def climb(n, memo={}):\\n    if n in memo:\\n        return memo[n]\\n    if n == 0: return 1\\n    if n == 1: return 1\\n    memo[n] = climb(n-1, memo) + climb(n-2, memo)\\n    return memo[n]\\n\\nprint(climb(4))",
  "frames": [
    { "line": 2, "vars": {"n":4,"memo":{}}, "note": "miss", "stdout": "" },
    { "line": 7, "vars": {"n":4,"memo":{}}, "note": "recurse to climb(3)", "stdout": "" },
    { "line": 7, "vars": {"n":3,"memo":{}}, "note": "recurse to climb(2)", "stdout": "" },
    { "line": 7, "vars": {"n":2,"memo":{"1":1,"0":1}}, "note": "base case hit", "stdout": "" },
    { "line": 8, "vars": {"n":3,"memo":{"1":1,"0":1,"2":2}}, "note": "store climb(2)", "stdout": "" },
    { "line": 8, "vars": {"n":4,"memo":{"1":1,"0":1,"2":2,"3":3}}, "note": "store climb(3)", "stdout": "" },
    { "line": 8, "vars": {"n":4,"memo":{"1":1,"0":1,"2":2,"3":3,"4":5}}, "note": "store climb(4)", "stdout": "5" }
  ],
  "speed": 800
}
\`\`\`

### Complexity

| Approach | Time | Space (extra) |
|----------|------|---------------|
| Naïve recursion | O(2^n) | O(n) call stack |
| Memoized (top-down) | O(n) | O(n) cache + O(n) call stack |

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Naïve (exponential)",
    "code": "def fib(n):\\n    if n <= 1:\\n        return n\\n    return fib(n-1) + fib(n-2)\\n\\n# fib(50) → minutes"
  },
  "after": {
    "label": "Memoized (linear)",
    "code": "def fib(n, memo={}):\\n    if n in memo:\\n        return memo[n]\\n    if n <= 1:\\n        return n\\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\\n    return memo[n]\\n\\n# fib(50) → instant"
  }
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Memoization turns exponential-time recursive algorithms into linear-time ones by caching subproblem results.",
    "It is a top-down approach: start with the original problem and recurse down, storing answers as you return.",
    "Space overhead is O(subproblem count) for the cache plus the recursion stack; always weigh this against the speed gain.",
    "Implementation is usually a three-line addition: check cache → recurse → store result."
  ]
}
\`\`\``,
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

\`\`\`concept
{"title": "Tabulation as Iterative Table-Building", "variant": "mental-model", "content": "Think of tabulation like building a brick wall: you lay the first row (base cases), then each new row depends only on the bricks already placed below it. No scaffolding (recursion) needed — just steady, upward progress."}
\`\`\`

### Pattern

\`\`\`playground
{"title": "Fibonacci Tabulation Template", "language": "python", "code": "def fib_tab(n: int) -> int:\\n    if n < 2:\\n        return n\\n    dp = [0] * (n + 1)      # 1. table\\n    dp[0], dp[1] = 0, 1     # 2. base cases\\n    for i in range(2, n + 1):\\n        dp[i] = dp[i-1] + dp[i-2]  # 3. recurrence\\n    return dp[n]\\n\\nprint(f\\"fib(8) = {fib_tab(8)}\\")", "runnable": true}
\`\`\`

\`\`\`steps
{"title": "How Tabulation Works", "steps": [{"title": "1. Allocate a table", "content": "Create an array (or matrix) large enough to hold every subproblem answer, indexed by the problem size."}, {"title": "2. Seed base cases", "content": "Fill the smallest subproblems directly — the iterative equivalent of recursion base cases."}, {"title": "3. Iterate upward", "content": "Use a loop to fill entries in a predictable order, ensuring every dependency is already computed."}, {"title": "4. Return final cell", "content": "The last entry written is the answer to the original problem."}]}
\`\`\`

### Memoization vs Tabulation

| | Memoization | Tabulation |
|-|-------------|------------|
| Direction | Top-down | Bottom-up |
| Recursion | Yes | No |
| Stack overflow risk | Yes | No |
| Computes | Only needed subproblems | All subproblems |
| Space optimization | Harder | Easier |

\`\`\`compare
{"variant": "before-after", "before": {"label": "Memoization (Top-Down)", "code": "def fib(n, memo={}):\\n    if n in memo:\\n        return memo[n]\\n    if n < 2:\\n        return n\\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\\n    return memo[n]"}, "after": {"label": "Tabulation (Bottom-Up)", "code": "def fib(n):\\n    if n < 2:\\n        return n\\n    dp = [0]*(n+1)\\n    dp[0], dp[1] = 0, 1\\n    for i in range(2, n+1):\\n        dp[i] = dp[i-1] + dp[i-2]\\n    return dp[n]"}}
\`\`\`

### Problem: Fibonacci & Coin Change

Implement Fibonacci using tabulation, then solve the coin change problem: given coins and an amount, find the minimum number of coins needed.

\`\`\`
coin_change([1, 5, 10, 25], 30) -> 2 (25 + 5)
coin_change([1, 3, 4], 6) -> 2 (3 + 3)
coin_change([2], 3) -> -1 (impossible)
\`\`\`

\`\`\`algoviz
{"title": "Coin-Change Table Walk-Through (amount=6, coins=[1,3,4])", "type": "array", "data": [0, 1, 2, 1, 1, 2, 2], "frames": [{"highlight": [0], "label": "dp[0]=0 (base case: 0 coins needed for 0¢)", "stats": {"amount": 0}}, {"highlight": [1], "label": "dp[1]=1 (use one 1¢ coin)", "stats": {"amount": 1}}, {"highlight": [2], "label": "dp[2]=2 (two 1¢ coins)", "stats": {"amount": 2}}, {"highlight": [3], "label": "dp[3]=1 (one 3¢ coin beats three 1¢)", "stats": {"amount": 3}}, {"highlight": [4], "label": "dp[4]=1 (one 4¢ coin)", "stats": {"amount": 4}}, {"highlight": [5], "label": "dp[5]=2 (4¢+1¢)", "stats": {"amount": 5}}, {"highlight": [6], "label": "dp[6]=2 (3¢+3¢)", "stats": {"amount": 6}}], "speed": 1000}
\`\`\`

\`\`\`playground
{"title": "Coin-Change Bottom-Up", "language": "python", "code": "def coin_change(coins, amount):\\n    dp = [float('inf')] * (amount + 1)\\n    dp[0] = 0                       # base case\\n    for a in range(1, amount + 1):  # build up\\n        for c in coins:\\n            if a - c >= 0:\\n                dp[a] = min(dp[a], dp[a - c] + 1)\\n    return dp[amount] if dp[amount] != float('inf') else -1\\n\\nprint(coin_change([1, 3, 4], 6))  # -> 2\\nprint(coin_change([2], 3))        # -> -1", "runnable": true}
\`\`\`

\`\`\`quiz
{"title": "Check Your Tabulation Intuition", "questions": [{"question": "Which statement is TRUE about tabulation?", "options": ["It uses recursion to fill the table", "It computes subproblems on demand", "It fills the table iteratively from smallest to largest", "It cannot be space-optimized"], "answer": 2, "explanation": "Tabulation iterates from the base cases upward, guaranteeing every dependency is already solved."}, {"question": "For coin-change, what does dp[a] represent?", "options": ["The largest coin used so far", "The minimum coins needed to make amount a", "The number of ways to make amount a", "The total value of coins used"], "answer": 1, "explanation": "dp[a] stores the minimum coin count for amount a, built from smaller sub-amounts."}, {"question": "Why might tabulation outperform memoization for large inputs?", "options": ["It skips unnecessary subproblems", "It avoids recursion overhead and stack-overflow risk", "It uses hash maps instead of arrays", "It requires less memory"], "answer": 1, "explanation": "Iterative table-filling removes function-call overhead and deep-recursion danger."}]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Tabulation fills a table iteratively from base cases upward, avoiding recursion.", "It systematically computes all subproblems, giving predictable O(n) time and often better constant factors.", "Space optimization is easier: sometimes only the last row or two needs to be kept.", "Choose tabulation when the input size is large or recursion depth is a concern."]}
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

\`\`\`concept
{"title": "Two Classic DP Patterns", "variant": "mental-model", "content": "Both 0/1 Knapsack and LCS share the same blueprint:\\n1. Define a 2-D table whose indices represent sub-problem choices\\n2. Express the global optimum as a recurrence over smaller sub-problems\\n3. Fill the table bottom-up, re-using already computed results\\nMaster these two and you can recognize dozens of interview problems built on the same skeleton."}
\`\`\`

---

### Problem 1: 0/1 Knapsack

You have \`n\` items, each with a weight and a value, and a single knapsack that can carry at most capacity \`W\`.  
Goal: pick a subset of items whose total weight ≤ \`W\` and total value is maximized.  
Each item may be taken **at most once** (0/1 choice).

\`\`\`algoviz
{"title": "Filling the DP table for weights=[1,3,4,5], values=[1,4,5,7], W=7", "type": "array", "data": [[0,0,0,0,0,0,0,0],[0,1,1,1,1,1,1,1],[0,1,1,4,5,5,5,5],[0,1,1,4,5,6,6,9],[0,1,1,4,5,7,8,9]], "frames": [{"highlight":[0],"label":"Row 0: no items → value 0","stats":{"i":0,"w":7}},{"highlight":[1],"label":"Row 1: item 0 (w=1,v=1) can fit everywhere","stats":{"i":1,"w":7}},{"highlight":[2],"label":"Row 2: item 1 (w=3,v=4). Best at w=3..6 is 4","stats":{"i":2,"w":6}},{"highlight":[3],"label":"Row 3: item 2 (w=4,v=5). Best at w=4 is 5, w=7 is 9","stats":{"i":3,"w":7}},{"highlight":[4],"label":"Row 4: item 3 (w=5,v=7). Final max value = 9","stats":{"i":4,"w":7}}], "speed": 900}
\`\`\`

#### Recurrence

Let \`dp[i][w]\` be the best value achievable with the first \`i\` items and capacity \`w\`.

- If we **skip** item \`i-1\`: \`dp[i-1][w]\`  
- If we **take** item \`i-1\` (and \`w ≥ weight[i-1]\`): \`dp[i-1][w-weight[i-1]] + value[i-1]\`

Therefore  
\`dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i-1]] + value[i-1])\`

\`\`\`playground
{"title": "0/1 Knapsack bottom-up", "language": "python", "code": "def knapsack(weights, values, W):\\n    n = len(weights)\\n    dp = [[0]*(W+1) for _ in range(n+1)]\\n    for i in range(1, n+1):\\n        wt, val = weights[i-1], values[i-1]\\n        for w in range(W+1):\\n            if wt <= w:\\n                dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt] + val)\\n            else:\\n                dp[i][w] = dp[i-1][w]\\n    return dp[n][W]\\n\\nprint(knapsack([1,3,4,5], [1,4,5,7], 7))  # → 9", "runnable": true}
\`\`\`

#### Complexity

- Time: \`O(n·W)\` — pseudo-polynomial (depends on numeric value of capacity)  
- Space: \`O(n·W)\` table; reducible to \`O(W)\` with rolling rows

\`\`\`callout
{"type": "warning", "title": "NP-hard does not mean \\"skip DP\\"", "content": "Knapsack is NP-hard, yet the DP above easily handles n≈10³ and W≈10⁵ in under a second. \\"Hardness\\" matters when W is huge or you need the exact optimum for millions of items — not for typical interview sizes."}
\`\`\`

---

### Problem 2: Longest Common Subsequence (LCS)

Given two strings \`A\` (length \`n\`) and \`B\` (length \`m\`), find the length of their longest **subsequence** present in both (order preserved, not necessarily contiguous).

\`\`\`compare
{"variant": "good-bad", "before": {"label": "Brute idea", "code": "Generate every subsequence of A (2ⁿ) and check membership in B\\n→ O(2ⁿ · m) — hopeless for n>20"}, "after": {"label": "DP idea", "code": "Build table dp[i][j] = LCS of A[:i] and B[:j]\\n→ O(n·m) time, O(n·m) space (can drop to O(min(n,m)))"}}
\`\`\`

#### Recurrence

\`dp[i][j]\` = LCS length of prefixes \`A[0..i-1]\` and \`B[0..j-1]\`

- If \`A[i-1] == B[j-1]\`: the chars match → extend previous best by 1  
  \`dp[i][j] = dp[i-1][j-1] + 1\`  
- Else: skip one char from either string  
  \`dp[i][j] = max(dp[i-1][j], dp[i][j-1])\`

\`\`\`trace
{"title": "LCS of \\"ABCBDAB\\" and \\"BDCAB\\"", "language": "python", "code": "A, B = \\"ABCBDAB\\", \\"BDCAB\\"\\nn, m = len(A), len(B)\\ndp = [[0]*(m+1) for _ in range(n+1)]\\nfor i in range(1, n+1):\\n    for j in range(1, m+1):\\n        if A[i-1] == B[j-1]:\\n            dp[i][j] = dp[i-1][j-1] + 1\\n        else:\\n            dp[i][j] = max(dp[i-1][j], dp[i][j-1])\\nprint(dp[n][m])  # 4", "frames": [{"line":5,"vars":{"i":1,"j":1,"A":"ABCBDAB","B":"BDCAB"},"note":"A[0]='A' != B[0]='B' → max(0,0)=0","stdout":""},{"line":5,"vars":{"i":2,"j":1,"j_curr":1},"note":"A[1]='B' == B[0]='B' → 1","stdout":""},{"line":5,"vars":{"i":4,"j":3},"note":"A[3]='B' == B[2]='C'? No → max(2,2)=2","stdout":""},{"line":5,"vars":{"i":7,"j":5},"note":"Final cell dp[7][5]=4","stdout":"4\\n"}], "speed": 700}
\`\`\`

#### Reconstructing the actual subsequence

Walk backwards from \`dp[n][m]\`:

1. If \`A[i-1] == B[j-1]\`: this char is part of LCS — record it, move ↖  
2. Else move to the larger of ↑ or ←

\`\`\`playground
{"title": "LCS length + reconstruction", "language": "python", "code": "def lcs_with_string(A, B):\\n    n, m = len(A), len(B)\\n    dp = [[0]*(m+1) for _ in range(n+1)]\\n    # fill length table\\n    for i in range(1, n+1):\\n        for j in range(1, m+1):\\n            dp[i][j] = dp[i-1][j-1]+1 if A[i-1]==B[j-1] else max(dp[i-1][j], dp[i][j-1])\\n    # reconstruct\\n    i, j = n, m\\n    sub = []\\n    while i>0 and j>0:\\n        if A[i-1]==B[j-1]:\\n            sub.append(A[i-1]); i-=1; j-=1\\n        elif dp[i-1][j] >= dp[i][j-1]: i-=1\\n        else: j-=1\\n    return ''.join(reversed(sub))\\n\\nprint(lcs_with_string(\\"ABCBDAB\\", \\"BDCAB\\"))  # → BCAB", "runnable": true}
\`\`\`

#### Complexity

- Time: \`O(n·m)\`  
- Space: \`O(n·m)\` full table; \`O(min(n,m))\` with rolling array if you only need the length

---

### Quick comparison

| Dimension        | 0/1 Knapsack                     | LCS                              |
|------------------|----------------------------------|----------------------------------|
| State            | \`dp[i][w]\`                       | \`dp[i][j]\`                       |
| State meaning    | best value, first i items, cap w | LCS length of prefixes i,j       |
| Recurrence       | max(skip, take)                  | if match: diag+1; else max(up,left) |
| Time complexity  | \`O(n·W)\`                         | \`O(n·m)\`                         |
| Space (opt)      | \`O(W)\`                           | \`O(min(n,m))\`                    |

\`\`\`quiz
{"title": "Check your understanding", "questions": [{"question":"In 0/1 Knapsack the entry dp[i][w] can be smaller than dp[i-1][w].","options":["True — skipping an item may lower the value","False — values only stay equal or increase"],"answer":1,"explanation":"Skipping never hurts; dp[i][w] is at least dp[i-1][w]."},{"question":"Which statement about LCS is correct?","options":["A contiguous substring is always a subsequence","A subsequence is always a contiguous substring","They are identical concepts"],"answer":0,"explanation":"Contiguous is a special case of subsequence; LCS allows gaps."},{"question":"The DP for 0/1 Knapsack is called ‘pseudo-polynomial’ because","options":["It is exponential in the number of items","Its runtime depends on the numeric value of W","It uses polynomial extra space"],"answer":1,"explanation":"Runtime is polynomial in the value of W, not its input bit length."}]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Both problems use a 2-D table where indices represent choices (items & capacity vs. string prefixes)", "Recurrences decide between ‘include current element’ or ‘skip it’, exploiting optimal substructure", "Table filling is O(n·W) for Knapsack and O(n·m) for LCS; space can be compressed with rolling arrays", "Recognizing these patterns lets you solve dozens of interview variants (target sum, edit distance, etc.)"]}
\`\`\``,
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

\`\`\`concept
{"title": "Two Classic DP Patterns", "variant": "mental-model", "content": "Both LIS and Edit Distance follow the same DP blueprint: build a table where each cell answers a smaller version of the original question. The art is choosing the right sub-problem definition—ending index for LIS, prefix lengths for Edit Distance—and writing the recurrence that bridges neighboring cells."}
\`\`\`

---

### Problem 1: Longest Increasing Subsequence (LIS)

Find the length of the longest strictly increasing subsequence (elements keep original order but need not be contiguous).

\`\`\`
LIS([10, 9, 2, 5, 3, 7, 101, 18]) → 4  # [2, 3, 7, 18] or [2, 5, 7, 101]
LIS([0, 1, 0, 3, 2, 3]) → 4            # [0, 1, 2, 3]
\`\`\`

#### O(n²) DP Idea

Let \`dp[i]\` = length of the LIS that **must end at index i**.

For every earlier index \`j < i\`:
- If \`arr[j] < arr[i]\` we can extend that subsequence:  
  \`dp[i] = max(dp[i], dp[j] + 1)\`

\`\`\`algoviz
{"title": "LIS DP on [10, 9, 2, 5]", "type": "array", "data": [10, 9, 2, 5],
 "frames": [
  {"highlight": [0], "label": "i=0: dp[0]=1 (base)", "stats": {"i": 0, "dp[0]": 1}},
  {"highlight": [1], "label": "i=1: 9<10 → dp[1]=dp[0]+1=2", "stats": {"i": 1, "dp[1]": 2}},
  {"highlight": [2], "label": "i=2: 2 smaller than all → dp[2]=1", "stats": {"i": 2, "dp[2]": 1}},
  {"highlight": [3], "label": "i=3: 5 can extend dp[2] → dp[3]=2", "stats": {"i": 3, "dp[3]": 2}}
 ], "speed": 700}
\`\`\`

The answer is \`max(dp)\` because the best subsequence may end anywhere.

\`\`\`playground
{"title": "O(n²) LIS Template", "language": "python", "code": "def lis(nums):\\n    n = len(nums)\\n    dp = [1] * n\\n    for i in range(n):\\n        for j in range(i):\\n            if nums[j] < nums[i]:\\n                dp[i] = max(dp[i], dp[j] + 1)\\n    return max(dp)\\n\\nprint(lis([10, 9, 2, 5, 3, 7, 101, 18]))  # 4", "runnable": true}
\`\`\`

\`\`\`callout
{"type": "tip", "title": "Can we do better?", "content": "Yes! A patience-sorting style algorithm with binary search drops the time to O(n log n) and space to O(n). For interviews, mention the n² version first—it's clearer—then wow them with the upgrade."}
\`\`\`

---

### Problem 2: Edit Distance (Levenshtein Distance)

Minimum single-character edits (insert, delete, replace) to turn string \`s\` into string \`t\`.

\`\`\`
edit_distance("kitten", "sitting") → 3
edit_distance("", "abc") → 3
\`\`\`

#### 2-D DP Definition

Let \`dp[i][j]\` = min edits to transform \`s[0..i-1]\` into \`t[0..j-1]\`.

Recurrence:
- If \`s[i-1] == t[j-1]\`:  
  \`dp[i][j] = dp[i-1][j-1]\`  (no new cost)
- Else:  
  \`dp[i][j] = 1 + min(\`  
  &nbsp;&nbsp;\`dp[i-1][j],   # delete from s\`  
  &nbsp;&nbsp;\`dp[i][j-1],   # insert into s\`  
  &nbsp;&nbsp;\`dp[i-1][j-1]  # replace\`  
  \`)\`

\`\`\`trace
{"title": "Editing \\"kitten\\" → \\"sitting\\"", "language": "python", "code": "def edit_distance(s, t):\\n    m, n = len(s), len(t)\\n    dp = [[0]*(n+1) for _ in range(m+1)]\\n    # base: empty strings\\n    for i in range(m+1): dp[i][0] = i\\n    for j in range(n+1): dp[0][j] = j\\n    # fill table\\n    for i in range(1, m+1):\\n        for j in range(1, n+1):\\n            if s[i-1] == t[j-1]:\\n                dp[i][j] = dp[i-1][j-1]\\n            else:\\n                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\\n    return dp[m][n]\\n\\nprint(edit_distance(\\"kitten\\", \\"sitting\\"))  # 3", "frames": [
  {"line": 4, "vars": {"s": "kitten", "t": "sitting", "m": 6, "n": 7}, "note": "initialize first row/col"},
  {"line": 10, "vars": {"i": 1, "j": 1, "s[i-1]": "k", "t[j-1]": "s"}, "note": "replace k→s, cost 1"},
  {"line": 10, "vars": {"i": 6, "j": 7, "dp[5][6]": 2, "dp[6][6]": 3}, "note": "final cell dp[6][7]=3"}
], "speed": 800}
\`\`\`

Complexities: O(m·n) time, O(m·n) space (can be trimmed to O(min(m, n)) if you only need the number, not the path).

\`\`\`quiz
{"title": "Quick Check", "questions": [
  {"question": "In the LIS recurrence, what does dp[i] represent?", "options": ["Length of any increasing subsequence inside i", "Length of the LIS that ends exactly at index i", "Length of the LIS starting from index i", "Total number of increasing subsequences"], "answer": 1, "explanation": "We pin the subsequence to end at i so earlier indices can extend it."},
  {"question": "Which edit-operation set is NOT part of the standard Levenshtein distance?", "options": ["Insert", "Delete", "Replace", "Transpose"], "answer": 3, "explanation": "Transpose (swap adjacent chars) is a different variant, not in vanilla Levenshtein."},
  {"question": "For Edit Distance, why do we initialize dp[i][0] = i?", "options": ["i characters need to be inserted", "i characters need to be deleted to match empty t", "Base case for recursion depth", "Avoid index errors"], "answer": 1, "explanation": "Turning a prefix of length i into an empty string requires i deletions."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Define dp[i] as the best value *ending at* i for sequence problems like LIS; take max (or min) across all endings for the final answer.",
  "Define dp[i][j] on *prefix lengths* for string-to-string problems; build a 2-D table and fill with a nested loop.",
  "Both classics showcase the same DP recipe: characterize sub-problems, write a recurrence, implement with loops or memoization, then optimize if needed."
]}
\`\`\``,
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
