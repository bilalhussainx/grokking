import { Module } from "../types";

export const dynamicProgrammingModule: Module = {
  id: "dynamic-programming",
  title: "Dynamic Programming",
  description: "Master the Dynamic Programming pattern for 0/1 Knapsack and related problems. Learn to solve optimization problems by breaking them down into overlapping subproblems with memoization and tabulation.",
  lessons: [
    {
      id: "dynamic-programming-intro",
      slug: "dynamic-programming-intro",
      title: "Introduction to Dynamic Programming",
      content: `## The Dynamic Programming Pattern

**Dynamic Programming (DP)** transforms exponential-time recursive solutions into polynomial-time algorithms by recognizing two structural properties: **overlapping subproblems** and **optimal substructure**.

\`\`\`concept
{ "title": "DP: Recursion with a Memory", "variant": "mental-model", "content": "Dynamic Programming = solve the problem recursively + remember every answer you compute. When you encounter a subproblem you've already solved, look it up instead of recomputing it. This single insight collapses exponential work into polynomial work." }
\`\`\`

### Why Plain Recursion Fails

Consider Fibonacci: \`fib(5)\` calls \`fib(4)\` and \`fib(3)\`. But \`fib(4)\` also calls \`fib(3)\`. That same subtree gets computed twice — and the redundancy explodes exponentially as n grows. Naive recursive Fibonacci runs in **O(2ⁿ)** time.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Naive Recursion — O(2ⁿ)", "code": "def fib(n):\\n    if n <= 1:\\n        return n\\n    return fib(n-1) + fib(n-2)\\n\\n# fib(5) recomputes fib(3) twice,\\n# fib(2) three times, fib(1) five times.\\n# Work doubles with every increment of n." }, "after": { "label": "Memoized — O(n)", "code": "def fib(n, memo={}):\\n    if n in memo:\\n        return memo[n]   # Cache hit — no recomputation\\n    if n <= 1:\\n        return n\\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\\n    return memo[n]\\n\\n# Each unique n is computed exactly once.\\n# O(n) time, O(n) space." } }
\`\`\`

### Two Implementation Approaches

Every DP problem can be solved either **top-down** (recursion + cache) or **bottom-up** (iterative table). They produce identical results with the same asymptotic complexity.

\`\`\`tabs
{ "tabs": [ { "label": "Top-Down (Memoization)", "icon": "🔽", "content": "**Start from the goal, recurse downward, cache every result.**\\n\\n\`\`\`python\\ndef fib(n, memo={}):\\n    if n in memo:\\n        return memo[n]\\n    if n <= 1:\\n        return n\\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\\n    return memo[n]\\n\`\`\`\\n\\n**Pros:**\\n- Natural to write — mirrors the problem's recursive definition\\n- Only computes subproblems you actually reach\\n- Easy to derive from brute-force solution\\n\\n**Cons:**\\n- Recursion stack overhead\\n- Python hits recursion limits for large n (default limit: 1000)" }, { "label": "Bottom-Up (Tabulation)", "icon": "🔼", "content": "**Start from base cases, build the solution table upward iteratively.**\\n\\n\`\`\`python\\ndef fib(n):\\n    if n <= 1:\\n        return n\\n    dp = [0] * (n + 1)\\n    dp[1] = 1\\n    for i in range(2, n + 1):\\n        dp[i] = dp[i-1] + dp[i-2]\\n    return dp[n]\\n\`\`\`\\n\\n**Pros:**\\n- No recursion stack — handles arbitrarily large n\\n- Cache-friendly memory access patterns\\n- Space-optimizable: keep only last two values → O(1) space\\n\\n**Cons:**\\n- Must determine evaluation order upfront\\n- Computes all subproblems even if some aren't needed" }, { "label": "Which to Use?", "icon": "⚖️", "content": "| Situation | Prefer |\\n|-----------|--------|\\n| Subproblem space is sparse | Top-Down |\\n| All subproblems are needed | Bottom-Up |\\n| Worried about stack depth | Bottom-Up |\\n| Deriving solution in an interview | Top-Down |\\n| Need space optimization | Bottom-Up |\\n\\n**Interview strategy:** Start top-down — it's easier to derive from the brute-force recursive structure. Once you have the recurrence, convert to bottom-up if the interviewer asks for space optimization." } ] }
\`\`\`

### Visualizing Bottom-Up: Fibonacci for n = 6

Each cell is filled exactly once using the two cells before it. Watch the pattern of dependency.

\`\`\`algoviz
{ "title": "Fibonacci Tabulation — dp[i] = dp[i-1] + dp[i-2]", "type": "array", "data": [0, 1, 1, 2, 3, 5, 8], "frames": [ { "highlight": [0], "label": "Base case: dp[0] = 0", "stats": {"i": 0, "value": 0} }, { "highlight": [1], "label": "Base case: dp[1] = 1", "stats": {"i": 1, "value": 1} }, { "highlight": [0, 1, 2], "label": "dp[2] = dp[1] + dp[0] = 1 + 0 = 1", "stats": {"i": 2, "value": 1} }, { "highlight": [1, 2, 3], "label": "dp[3] = dp[2] + dp[1] = 1 + 1 = 2", "stats": {"i": 3, "value": 2} }, { "highlight": [2, 3, 4], "label": "dp[4] = dp[3] + dp[2] = 2 + 1 = 3", "stats": {"i": 4, "value": 3} }, { "highlight": [3, 4, 5], "label": "dp[5] = dp[4] + dp[3] = 3 + 2 = 5", "stats": {"i": 5, "value": 5} }, { "highlight": [4, 5, 6], "label": "dp[6] = dp[5] + dp[4] = 5 + 3 = 8 ✓ Answer", "stats": {"i": 6, "value": 8} } ], "speed": 800 }
\`\`\`

---

## The 0/1 Knapsack Pattern

The **0/1 Knapsack** is the archetypal DP problem and the template for a large family of interview questions: subset sum, partition equal subset, target sum, coin change, and more.

**Problem:** Given n items each with a weight and value, and a knapsack of capacity W, find the maximum value achievable without exceeding W. Each item is either taken (1) or left (0) — no fractions allowed.

**State definition:** \`dp[i][c]\` = maximum value using the first i items with remaining capacity c.

**Recurrence — at each item i and capacity c, you have exactly two choices:**

\`\`\`
dp[i][c] = max(
    dp[i-1][c],                              # Skip item i — capacity unchanged
    values[i] + dp[i-1][c - weights[i]]      # Take item i — reduce capacity
)
# Only take item i if weights[i] <= c
\`\`\`

**Base case:** \`dp[0][c] = 0\` for all c (zero items → zero value).

The table builds from the top-left, each cell depending only on the row above — which is why a 1D rolling array can reduce space from O(n × W) to O(W).

\`\`\`callout
{ "type": "info", "title": "How to Spot the 0/1 Knapsack Pattern", "content": "Look for all four of these signals:\\n\\n- A **set of items** each with two attributes (weight/value, cost/benefit, time/profit)\\n- A **capacity constraint** (budget, weight limit, target sum)\\n- Each item can be **used at most once** (the '0/1' part)\\n- Asked for **maximum/minimum** value, or whether a target is **achievable**\\n\\nIf you see all four, reach for the 0/1 Knapsack template immediately." }
\`\`\`

**Complexity summary:**

| Approach | Time | Space |
|----------|------|-------|
| Brute force (all subsets) | O(2ⁿ) | O(n) |
| DP — full table | O(n × W) | O(n × W) |
| DP — rolling 1D array | O(n × W) | O(W) |

---

## When to Apply Dynamic Programming

DP requires **both** of these conditions simultaneously:

1. **Overlapping subproblems** — the naive recursive solution recomputes identical sub-answers multiple times
2. **Optimal substructure** — the globally optimal solution is composed of locally optimal subproblem solutions

If only property 2 holds → use a **greedy** algorithm (faster). DP is reserved for problems where greedy fails because earlier choices depend on later ones.

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "What is the time complexity of naive (no memoization) recursive Fibonacci for fib(n)?", "options": ["O(n)", "O(n log n)", "O(2ⁿ)", "O(n²)"], "answer": 2, "explanation": "Without memoization, fib(n) spawns two recursive calls, each spawning two more. The call tree is a near-complete binary tree of depth n, giving O(2ⁿ) total calls. Memoization collapses this to O(n) by computing each unique value exactly once." }, { "question": "In the 0/1 Knapsack recurrence, what does choosing dp[i-1][c] (without adding values[i]) represent?", "options": ["Taking item i and reducing capacity by weights[i]", "Skipping item i and keeping the full capacity c", "Taking all items from 1 to i-1", "Resetting the knapsack to empty"], "answer": 1, "explanation": "dp[i-1][c] carries over the best value achievable from the first (i-1) items at the same capacity c — meaning we decided NOT to include item i. The capacity is unchanged because we didn't pick up anything." }, { "question": "Which property is required for greedy algorithms but NOT for dynamic programming?", "options": ["Overlapping subproblems", "Optimal substructure", "Greedy choice property", "Polynomial state space"], "answer": 2, "explanation": "The greedy choice property — making a locally optimal choice at each step leads to a globally optimal solution — is what distinguishes greedy from DP. DP explores all valid choices via the recurrence; greedy commits to one. Both require optimal substructure." }, { "question": "You have a DP table dp[n+1][W+1] for 0/1 Knapsack. How can you reduce space to O(W)?", "options": ["Process items in random order and discard the table", "Use a 1D array of size W+1 and iterate capacity in reverse for each item", "Use a 1D array and iterate capacity forward for each item", "Use two 1D arrays and alternate between them"], "answer": 1, "explanation": "Because dp[i][c] only depends on row i-1, you can overwrite a single 1D array in-place. The key is iterating capacity from W down to weights[i] — this ensures you're reading values from the 'previous item' state, not the current one being updated. Forward iteration would let you pick the same item multiple times (which is the unbounded knapsack variant)." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["DP = recursion + memory: store every computed subproblem result to eliminate redundant recomputation", "Two equivalent strategies: top-down (memoization, recursive) and bottom-up (tabulation, iterative) — same complexity, different tradeoffs", "The 0/1 Knapsack recurrence dp[i][c] = max(skip item i, take item i) is the template for a large family of interview problems", "DP requires BOTH overlapping subproblems AND optimal substructure — if greedy works, prefer it", "Space can be optimized from O(n × W) to O(W) in Knapsack-style problems using a 1D rolling array with reverse iteration" ] }
\`\`\``,
    },
    {
      id: "zero-one-knapsack",
      slug: "zero-one-knapsack",
      title: "0/1 Knapsack Problem",
      content: `## 0/1 Knapsack Problem

<!-- voice:section_check concept="Classic DP problem" -->

### Problem Statement

Given integer arrays \`weights\` and \`values\` (one entry per item) and an integer \`capacity\`, return the **maximum total value** you can achieve by selecting items whose combined weight does not exceed \`capacity\`.

**The 0/1 constraint:** each item is either taken (1) or skipped (0) — no partial selections, no duplicates.

| Example | weights | values | capacity | Output | Selection |
|---------|---------|--------|----------|--------|-----------|
| 1 | [1, 2, 3] | [6, 10, 12] | 5 | **22** | indices 1+2: w=2+3, v=10+12 |
| 2 | [1, 3, 4, 5] | [1, 4, 5, 7] | 7 | **9** | indices 1+2: w=3+4, v=4+5 |

\`\`\`concept
{ "title": "The Skip-or-Take Decision", "variant": "mental-model", "content": "Every subproblem dp[i][c] answers: what is the best value achievable using items 0..i with at most capacity c?\\n\\nFor item i, exactly two choices exist:\\n\\n**Skip it:** Exclude item i entirely. Carry forward dp[i-1][c].\\n\\n**Take it** (only when weights[i] ≤ c): Add values[i] to the best solution with remaining capacity — values[i] + dp[i-1][c - weights[i]].\\n\\nPick whichever is larger. This binary choice — take (1) or skip (0) — is precisely where the name '0/1 Knapsack' comes from." }
\`\`\`

### Three Approaches to the Same Recurrence

All three approaches implement identical logic; they differ only in whether subproblems are solved on demand (top-down) or precomputed in order (bottom-up).

\`\`\`tabs
{ "tabs": [ { "label": "Recursion", "icon": "🔁", "content": "Explore all 2ⁿ combinations by branching at each item. Correct but exponential:\\n\\n    def solve(i, c):\\n        if i == n or c == 0:\\n            return 0\\n        if weights[i] > c:        # item doesn't fit\\n            return solve(i + 1, c)\\n        skip = solve(i + 1, c)\\n        take = values[i] + solve(i + 1, c - weights[i])\\n        return max(skip, take)\\n\\n**Problem:** Overlapping subproblems — the same \`(i, c)\` pair is recomputed an exponential number of times.\\n\\n**Complexity:** Time O(2ⁿ), Space O(n) call stack." }, { "label": "Memoization", "icon": "📝", "content": "Cache each \`(i, c)\` result. Every unique subproblem is solved exactly once:\\n\\n    memo = {}\\n    def solve(i, c):\\n        if i == n or c == 0:\\n            return 0\\n        if (i, c) in memo:\\n            return memo[(i, c)]\\n        if weights[i] > c:\\n            result = solve(i + 1, c)\\n        else:\\n            result = max(\\n                solve(i + 1, c),\\n                values[i] + solve(i + 1, c - weights[i])\\n            )\\n        memo[(i, c)] = result\\n        return result\\n\\nThere are n × (W+1) unique \`(i, c)\` pairs — after caching, each is computed in O(1).\\n\\n**Complexity:** Time O(n × W), Space O(n × W) for the cache." }, { "label": "Tabulation", "icon": "📊", "content": "Fill a 2D table bottom-up. Row i depends only on row i-1:\\n\\n    dp = [[0] * (W + 1) for _ in range(n + 1)]\\n    for i in range(1, n + 1):\\n        for c in range(W + 1):\\n            if weights[i-1] > c:\\n                dp[i][c] = dp[i-1][c]\\n            else:\\n                dp[i][c] = max(\\n                    dp[i-1][c],\\n                    values[i-1] + dp[i-1][c - weights[i-1]]\\n                )\\n    return dp[n][W]\\n\\nAnswer lives at \`dp[n][W]\`.\\n\\n**Complexity:** Time O(n × W), Space O(n × W)." }, { "label": "Space-Optimized", "icon": "⚡", "content": "Since row i only reads row i-1, compress to a single 1D array. **Sweep right-to-left** so \`dp[c - weights[i]]\` still reflects the previous item's row:\\n\\n    dp = [0] * (W + 1)\\n    for i in range(n):\\n        for c in range(W, weights[i] - 1, -1):\\n            dp[c] = max(dp[c],\\n                        values[i] + dp[c - weights[i]])\\n    return dp[W]\\n\\n**Why right-to-left?** A left-to-right sweep updates \`dp[c - weights[i]]\` before we read it for larger c — effectively counting item i multiple times (unbounded knapsack). Right-to-left prevents this.\\n\\n**Complexity:** Time O(n × W), Space O(W) ✓" } ] }
\`\`\`

### Tracing the Algorithm Step by Step

Watch the \`dp\` array evolve as each item is processed. Input: \`weights=[1,2,3]\`, \`values=[6,10,12]\`, \`capacity=5\`.

\`\`\`trace
{ "title": "Space-Optimized Knapsack — Execution Trace", "language": "python", "code": "# weights=[1,2,3], values=[6,10,12], capacity=5\\ndp = [0, 0, 0, 0, 0, 0]\\n\\n# item 0 (w=1, v=6)\\nfor c in range(5, 0, -1):\\n    dp[c] = max(dp[c], 6 + dp[c - 1])\\n\\n# item 1 (w=2, v=10)\\nfor c in range(5, 1, -1):\\n    dp[c] = max(dp[c], 10 + dp[c - 2])\\n\\n# item 2 (w=3, v=12)\\nfor c in range(5, 2, -1):\\n    dp[c] = max(dp[c], 12 + dp[c - 3])\\n\\nprint(dp[5])", "frames": [ { "line": 2, "vars": { "dp": "[0, 0, 0, 0, 0, 0]" }, "note": "Initialize: dp[c] = 0 for all capacities. No items considered yet." }, { "line": 6, "vars": { "dp": "[0, 6, 6, 6, 6, 6]" }, "note": "After item 0 (w=1, v=6), sweep c=5→1: any capacity ≥ 1 can hold this item for value 6." }, { "line": 10, "vars": { "dp": "[0, 6, 10, 16, 16, 16]" }, "note": "After item 1 (w=2, v=10), sweep c=5→2: dp[2]=10 (item 1 alone), dp[3..5]=16 (items 0+1 combined)." }, { "line": 14, "vars": { "dp": "[0, 6, 10, 16, 18, 22]" }, "note": "After item 2 (w=3, v=12), sweep c=5→3: dp[5]=22 = v[1]+v[2] = 10+12 at total weight 2+3=5." }, { "line": 16, "vars": { "dp": "[0, 6, 10, 16, 18, 22]" }, "note": "Return dp[5] = 22. Optimal: take items at indices 1 and 2.", "stdout": "22" } ], "speed": 800 }
\`\`\`

### Complexity

| Approach | Time | Space |
|---|---|---|
| Naive Recursion | O(2ⁿ) | O(n) |
| Memoization | O(n × W) | O(n × W) |
| Tabulation | O(n × W) | O(n × W) |
| **Space-Optimized** | **O(n × W)** | **O(W)** |

*n = number of items, W = knapsack capacity*

\`\`\`quiz
{ "title": "0/1 Knapsack Check", "questions": [ { "question": "What does dp[i][c] represent in the 2D tabulation approach?", "options": ["The weight of the i-th item when capacity is c", "The max value using the first i items with exactly c weight consumed", "The max value achievable using the first i items with at most capacity c available", "The count of items selected from the first i items"], "answer": 2, "explanation": "dp[i][c] stores the best value using any subset of the first i items without exceeding capacity c. 'At most c' — not 'exactly c' — is key: the knapsack need not be filled to the brim." }, { "question": "In the space-optimized 1D version, why must the inner loop sweep from high capacity down to weights[i]?", "options": ["To avoid index-out-of-bounds errors on the dp array", "To match the row-by-row direction of the 2D table", "To ensure dp[c - weights[i]] still reflects the state before item i was considered, preventing double-counting", "To improve CPU cache performance on modern hardware"], "answer": 2, "explanation": "When computing dp[c] = max(dp[c], values[i] + dp[c - weights[i]]), the lookup dp[c - weights[i]] must represent the world before item i. Right-to-left guarantees smaller indices haven't been updated yet in this pass. A left-to-right sweep would let item i contribute to dp[c - weights[i]] and then again to dp[c] — effectively turning 0/1 knapsack into unbounded knapsack." }, { "question": "What is the time complexity of the memoization and tabulation solutions?", "options": ["O(n log W)", "O(n²)", "O(2ⁿ)", "O(n × W)"], "answer": 3, "explanation": "There are exactly n × (W+1) unique subproblems — one per (item index, capacity) pair. Each is resolved in O(1) via the recurrence. Total: O(n × W). This is the fundamental improvement over naive recursion's O(2ⁿ)." }, { "question": "Given weights=[2,3], values=[4,5], capacity=5, what is the maximum achievable value?", "options": ["4", "5", "9", "10"], "answer": 2, "explanation": "Taking both items: total weight = 2+3 = 5 ≤ 5 (fits), total value = 4+5 = 9. Taking only item 0 gives 4; only item 1 gives 5. The combined selection is optimal at 9." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The recurrence is a binary choice per item: skip it (inherit dp[i-1][c]) or take it (add values[i] + dp[i-1][c-weights[i]]) — whichever is larger.", "Both memoization and tabulation reach O(n × W) time by caching the n × W unique (item, capacity) subproblems instead of recomputing them.", "Space reduces from O(n × W) to O(W) by compressing the 2D table to a single 1D array that is overwritten each iteration.", "The right-to-left inner sweep is the single most critical implementation detail — it enforces the 0/1 constraint in the space-optimized version.", "The knapsack framework generalizes directly: unbounded knapsack uses a left-to-right sweep; subset-sum is the same recurrence with values equal to weights." ] }
\`\`\``,
      starterCode: `def knapsack(weights, values, capacity):
    """
    Solve 0/1 Knapsack problem.
    
    Args:
        weights: List of item weights
        values: List of item values
        capacity: int, maximum weight capacity
    
    Returns:
        int: Maximum achievable value
    
    Example:
        >>> knapsack([1, 2, 3], [6, 10, 12], 5)
        22
        >>> knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7)
        9
    """
    # TODO: Implement 0/1 Knapsack with space optimization
    # Hint: Use 1D dp array, iterate capacity backwards
    pass


# ─── Test Cases ───

# Standard case
print(knapsack([1, 2, 3], [6, 10, 12], 5))
# Expected: 22

# Example from above
print(knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7))
# Expected: 9

# Cannot take any item
print(knapsack([3, 4, 5], [10, 20, 30], 2))
# Expected: 0

# Can take all items
print(knapsack([1, 2, 3], [10, 20, 30], 6))
# Expected: 60

# Single item fits
print(knapsack([2], [10], 5))
# Expected: 10

# Single item doesn't fit
print(knapsack([5], [10], 3))
# Expected: 0
`,
      solutionCode: `def knapsack(weights, values, capacity):
    """
    Solve 0/1 Knapsack problem with space optimization.
    
    Time Complexity: O(n × capacity)
    Space Complexity: O(capacity)
    """
    n = len(weights)
    
    # dp[c] = max value achievable with capacity c
    dp = [0] * (capacity + 1)
    
    for i in range(n):
        # Iterate backwards to avoid using updated values
        for c in range(capacity, weights[i] - 1, -1):
            # Option 1: Skip item i -> dp[c] stays same
            # Option 2: Take item i -> values[i] + dp[c - weights[i]]
            dp[c] = max(dp[c], values[i] + dp[c - weights[i]])
    
    return dp[capacity]


# Full 2D solution for clarity
def knapsack_2d(weights, values, capacity):
    """
    2D DP solution showing the complete state.
    """
    n = len(weights)
    
    # dp[i][c] = max value using first i items with capacity c
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for c in range(capacity + 1):
            # Skip item i-1
            dp[i][c] = dp[i-1][c]
            
            # Take item i-1 if possible
            if weights[i-1] <= c:
                dp[i][c] = max(dp[i][c], 
                               values[i-1] + dp[i-1][c - weights[i-1]])
    
    return dp[n][capacity]


# ─── Test Cases ───
print(knapsack([1, 2, 3], [6, 10, 12], 5))
# Expected: 22

print(knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7))
# Expected: 9

print(knapsack([3, 4, 5], [10, 20, 30], 2))
# Expected: 0

print(knapsack([1, 2, 3], [10, 20, 30], 6))
# Expected: 60

print(knapsack([2], [10], 5))
# Expected: 10

print(knapsack([5], [10], 3))
# Expected: 0
`,
    },
    {
      id: "equal-subset-sum-partition",
      slug: "equal-subset-sum-partition",
      title: "Equal Subset Sum Partition",
      content: `## Equal Subset Sum Partition

<!-- voice:section_check concept="Subset sum variation" -->

Given a set of positive numbers, determine if it can be partitioned into two subsets such that the sum of elements in both subsets is equal.

| Example | Array | Total Sum | Target | Result |
|---------|-------|-----------|--------|--------|
| 1 | [1, 2, 3, 4] | 10 | 5 | **true** — [1, 4] and [2, 3] |
| 2 | [1, 1, 3, 4, 7] | 16 | 8 | **true** — [1, 3, 4] and [1, 7] |
| 3 | [2, 3, 4, 6] | 15 | — | **false** — odd total, impossible |

\`\`\`concept
{ "title": "The Core Reduction", "variant": "insight", "content": "If total sum is odd, return false immediately — you can't split an odd number into two equal integer halves. If even, you only need to find ONE subset summing to total/2. The second subset is automatically the complement and must also sum to total/2. This transforms 'can we partition?' into 'can we reach sum S using some subset?' — a classic 0/1 Knapsack reachability problem." }
\`\`\`

### Why This Is 0/1 Knapsack

In 0/1 Knapsack each item is taken or left — exactly once. Here, each number is either **in** the first subset (taken) or **in** the second (left). The recurrence maps directly:

\`\`\`
dp[i][s] = can we achieve sum s using the first i elements?

dp[i][s] = dp[i-1][s]                        ← skip element i
          OR dp[i-1][s - nums[i-1]]           ← include element i (if s ≥ nums[i-1])
\`\`\`

Base cases: \`dp[i][0] = True\` for all \`i\` (empty subset sums to 0). \`dp[0][s > 0] = False\` (no elements, no positive sum).

\`\`\`steps
{ "title": "Algorithm Blueprint", "steps": [ { "title": "Compute total sum and parity check", "content": "Sum all elements. If \`total % 2 != 0\`, return \`False\` immediately — an odd sum can never be evenly split. This single check rules out Example 3 above before any DP work." }, { "title": "Set target = total // 2", "content": "We now search for any subset summing to exactly \`target\`. If found, the remaining elements form the complementary subset (also summing to \`target\`)." }, { "title": "Build the DP table", "content": "Create \`dp[0..n][0..target]\` of booleans.\\n\\n- Initialize \`dp[i][0] = True\` for all rows (empty subset)\\n- Fill row by row: \`dp[i][s] = dp[i-1][s] or (s >= nums[i-1] and dp[i-1][s-nums[i-1]])\`" }, { "title": "Return dp[n][target]", "content": "The bottom-right relevant cell answers: can all n elements produce a subset summing to target?" } ] }
\`\`\`

### Tracing the Space-Optimized Solution

The 2D table compresses to a single 1D array. The key trick: iterate \`s\` **right-to-left** so that \`dp[s - num]\` still reflects a state *without* the current element (preserving the 0/1 constraint).

\`\`\`trace
{ "title": "Trace: canPartition([1, 2, 3, 4])", "language": "python", "code": "def canPartition(nums):\\n    total = sum(nums)\\n    if total % 2 != 0:\\n        return False\\n    target = total // 2\\n    dp = [False] * (target + 1)\\n    dp[0] = True\\n    for num in nums:\\n        for s in range(target, num - 1, -1):\\n            dp[s] = dp[s] or dp[s - num]\\n    return dp[target]", "frames": [ { "line": 2, "vars": { "total": 10 }, "note": "Sum all elements: 1+2+3+4=10" }, { "line": 5, "vars": { "target": 5 }, "note": "Target = 10 // 2 = 5" }, { "line": 7, "vars": { "dp": "[T,F,F,F,F,F]" }, "note": "dp[0]=True: empty subset always sums to 0" }, { "line": 9, "vars": { "num": 1, "dp": "[T,T,F,F,F,F]" }, "note": "After num=1: sum 1 now reachable (dp[1] = dp[0])" }, { "line": 9, "vars": { "num": 2, "dp": "[T,T,T,T,F,F]" }, "note": "After num=2: sums 2 and 3 now reachable" }, { "line": 9, "vars": { "num": 3, "dp": "[T,T,T,T,T,T]" }, "note": "After num=3: dp[5] = dp[2] = True — target reached!" }, { "line": 9, "vars": { "num": 4, "dp": "[T,T,T,T,T,T]" }, "note": "After num=4: no change needed, dp[5] already True" }, { "line": 11, "vars": { "return": "True" }, "note": "dp[target] = dp[5] = True — partition exists" } ], "speed": 900 }
\`\`\`

### Implementation: Three Approaches

\`\`\`tabs
{ "tabs": [ { "label": "Top-Down (Memo)", "icon": "🔁", "content": "\`\`\`python\\ndef canPartition(nums):\\n    total = sum(nums)\\n    if total % 2 != 0:\\n        return False\\n    target = total // 2\\n    memo = {}\\n\\n    def dp(i, remaining):\\n        if remaining == 0:\\n            return True\\n        if i == 0 or remaining < 0:\\n            return False\\n        if (i, remaining) in memo:\\n            return memo[(i, remaining)]\\n        # Skip nums[i-1] OR take it\\n        result = dp(i-1, remaining) or dp(i-1, remaining - nums[i-1])\\n        memo[(i, remaining)] = result\\n        return result\\n\\n    return dp(len(nums), target)\\n\`\`\`\\n\\n**Time:** O(n × target) — each \`(i, remaining)\` state computed at most once\\n\\n**Space:** O(n × target) for the memo table + O(n) call stack depth" }, { "label": "Bottom-Up (Tabulation)", "icon": "📊", "content": "\`\`\`python\\ndef canPartition(nums):\\n    total = sum(nums)\\n    if total % 2 != 0:\\n        return False\\n    target = total // 2\\n    n = len(nums)\\n    # dp[i][s] = can first i elements reach sum s\\n    dp = [[False] * (target + 1) for _ in range(n + 1)]\\n    for i in range(n + 1):\\n        dp[i][0] = True        # empty subset always valid\\n    for i in range(1, n + 1):\\n        for s in range(1, target + 1):\\n            dp[i][s] = dp[i-1][s]  # skip\\n            if s >= nums[i-1]:\\n                dp[i][s] = dp[i][s] or dp[i-1][s - nums[i-1]]  # take\\n    return dp[n][target]\\n\`\`\`\\n\\n**Time:** O(n × target) &nbsp; **Space:** O(n × target)" }, { "label": "Space-Optimised 1D", "icon": "⚡", "content": "\`\`\`python\\ndef canPartition(nums):\\n    total = sum(nums)\\n    if total % 2 != 0:\\n        return False\\n    target = total // 2\\n    dp = [False] * (target + 1)\\n    dp[0] = True\\n    for num in nums:\\n        # Right-to-left: ensures each element used at most once\\n        for s in range(target, num - 1, -1):\\n            dp[s] = dp[s] or dp[s - num]\\n    return dp[target]\\n\`\`\`\\n\\n**Time:** O(n × target) &nbsp; **Space:** O(target) — optimal\\n\\nIterating right-to-left is the 0/1 constraint in disguise: \`dp[s - num]\` still reflects a world without the current element." } ] }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Right-to-Left Is Not Optional", "content": "If you iterate \`s\` left-to-right in the 1D version, \`dp[s - num]\` may already incorporate the current element — counting it twice and turning this into an **unbounded** knapsack. Always iterate \`for s in range(target, num - 1, -1)\` for 0/1 problems." }
\`\`\`

### Complexity Summary

| Approach | Time | Space |
|----------|------|-------|
| Top-Down (memoization) | O(n × sum/2) | O(n × sum/2) + stack |
| Bottom-Up (tabulation) | O(n × sum/2) | O(n × sum/2) |
| Space-Optimized 1D | O(n × sum/2) | **O(sum/2)** |

Note: this complexity is *pseudo-polynomial* — it depends on the numeric value of \`sum\`, not just the array length \`n\`.

<!-- voice:key_insight insight="If total sum is even, we just need to find if a subset exists with sum = total/2 — this transforms to knapsack where capacity = total/2" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "Given nums = [2, 3, 4, 6], what is the FIRST reason we can immediately return false?", "options": ["No single element equals sum/2", "Total sum 15 is odd — equal partition is impossible", "The array has an even number of elements", "The largest element 6 exceeds half the sum"], "answer": 1, "explanation": "Total = 2+3+4+6 = 15, which is odd. You cannot split 15 into two equal integer halves, so we return false before any DP work begins." }, { "question": "In the space-optimised 1D solution, why must we iterate s from target DOWN to num (right-to-left)?", "options": ["To avoid index-out-of-bounds errors on dp[s - num]", "Processing larger sums first is algorithmically faster", "So dp[s - num] still reflects a state without the current element, enforcing each element is used at most once", "The iteration direction does not affect correctness"], "answer": 2, "explanation": "Left-to-right would update dp[s - num] before dp[s] reads it during the same pass, effectively using the current element twice (unbounded knapsack). Right-to-left guarantees dp[s - num] is the pre-update value — the 0/1 constraint." }, { "question": "For nums = [1, 5, 11, 5], what is the target sum we search for, and is the answer true or false?", "options": ["Target = 22, false", "Target = 11, true", "Target = 10, false", "Target = 11, false"], "answer": 1, "explanation": "Total = 1+5+11+5 = 22. Target = 22/2 = 11. The subset [11] sums to 11, and the complement [1, 5, 5] also sums to 11. Answer: true." }, { "question": "What is the time complexity of all three DP approaches (top-down, bottom-up, space-optimised)?", "options": ["O(n²)", "O(2ⁿ) for memoization, O(n × sum) for tabulation", "O(n × sum) for all three", "O(n log sum)"], "answer": 2, "explanation": "All three DP approaches fill or explore the same O(n × sum/2) state space. The space-optimised version reduces memory from O(n × sum) to O(sum) but does not change the time complexity." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Odd total sum → immediately return false. This eliminates a large class of inputs before any DP work.", "Equal partition reduces to: 'does any subset sum to total/2?' — a 0/1 Knapsack reachability problem.", "The recurrence dp[i][s] = dp[i-1][s] OR dp[i-1][s-nums[i]] mirrors the skip/take choice from classic knapsack.", "Compress the 2D table to O(sum) space with a 1D array — but always iterate right-to-left to enforce the 0/1 constraint.", "Time complexity O(n × sum) is pseudo-polynomial: it grows with the numeric value of sum, not just array length n." ] }
\`\`\``,
      starterCode: `def can_partition(nums):
    """
    Determine if array can be partitioned into two equal sum subsets.
    
    Args:
        nums: List of positive integers
    
    Returns:
        bool: True if equal partition possible
    
    Example:
        >>> can_partition([1, 2, 3, 4])
        True
        >>> can_partition([1, 1, 3, 4, 7])
        True
        >>> can_partition([2, 3, 4, 6])
        False
    """
    # TODO: Transform to subset sum problem (variation of knapsack)
    # Hint: Check if sum is even, then find subset with sum = total/2
    pass


# ─── Test Cases ───

# Can partition
print(can_partition([1, 2, 3, 4]))
# Expected: True

# Can partition
print(can_partition([1, 1, 3, 4, 7]))
# Expected: True

# Cannot partition
print(can_partition([2, 3, 4, 6]))
# Expected: False

# Odd sum
print(can_partition([1, 2, 3]))
# Expected: False (sum=6, wait that's even... try [1,2,5] sum=8 but no partition)

# Actually odd sum
print(can_partition([1, 2, 5]))
# Expected: False (sum=8, no valid partition)

# Single element
print(can_partition([1]))
# Expected: False (can't partition single element)

# Two equal elements
print(can_partition([5, 5]))
# Expected: True
`,
      solutionCode: `def can_partition(nums):
    """
    Determine if array can be partitioned into two equal sum subsets.
    
    Time Complexity: O(n × sum)
    Space Complexity: O(sum)
    """
    total = sum(nums)
    
    # If total is odd, can't partition equally
    if total % 2 != 0:
        return False
    
    target = total // 2
    
    # dp[s] = can we achieve sum s?
    dp = [False] * (target + 1)
    dp[0] = True  # Sum 0 is always achievable
    
    for num in nums:
        # Iterate backwards to avoid reuse
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
    
    return dp[target]


# Alternative: Set-based approach
def can_partition_set(nums):
    """
    Alternative using set to track achievable sums.
    """
    total = sum(nums)
    
    if total % 2 != 0:
        return False
    
    target = total // 2
    possible_sums = {0}
    
    for num in nums:
        new_sums = set()
        for s in possible_sums:
            if s + num == target:
                return True
            new_sums.add(s + num)
        possible_sums = possible_sums.union(new_sums)
    
    return target in possible_sums


# ─── Test Cases ───
print(can_partition([1, 2, 3, 4]))
# Expected: True

print(can_partition([1, 1, 3, 4, 7]))
# Expected: True

print(can_partition([2, 3, 4, 6]))
# Expected: False

print(can_partition([1, 2, 5]))
# Expected: False

print(can_partition([1]))
# Expected: False

print(can_partition([5, 5]))
# Expected: True
`,
    },
    {
      id: "subset-sum-problem",
      slug: "subset-sum-problem",
      title: "Subset Sum Problem",
      content: `## Subset Sum Problem

<!-- voice:section_check concept="Classic subset sum" -->

Given a set of positive integers and a target \`S\`, determine whether any subset of the numbers sums **exactly** to \`S\`. Unlike Knapsack, there are no profit values — only the question: *can we reach this sum?*

| Input | S | Output | Explanation |
|-------|---|--------|-------------|
| \`[1, 2, 3, 7]\` | 6 | \`true\` | \`{1, 2, 3}\` sums to 6 |
| \`[1, 3, 4, 8]\` | 6 | \`false\` | No subset sums to 6 |
| \`[2, 3, 7, 8, 10]\` | 11 | \`true\` | \`{3, 8}\` sums to 11 |

\`\`\`concept
{ "title": "Subset Sum Is 0/1 Knapsack in Disguise", "variant": "mental-model", "content": "Map each number to an item whose weight equals its value. The knapsack capacity is S. We don't care about maximizing profit — we only need to know if the knapsack can be filled to exactly capacity S. Every 0/1 Knapsack recurrence and table-filling trick applies directly." }
\`\`\`

### The Recurrence

For each number \`nums[i]\` and each candidate sum \`s\`, we face the same binary choice as Knapsack:

- **Skip** \`nums[i]\`: \`dp[i][s] = dp[i-1][s]\`
- **Include** \`nums[i]\`: \`dp[i][s] = dp[i-1][s - nums[i]]\` (only valid when \`nums[i] ≤ s\`)

\`\`\`
dp[i][s] = dp[i-1][s]  OR  dp[i-1][s - nums[i]]
           ↑ skip             ↑ include
\`\`\`

Either path to \`true\` is enough — hence **OR** instead of **max**. This is the key difference from 0/1 Knapsack.

**Base cases:**
- \`dp[i][0] = true\` for all \`i\` — the empty subset always sums to 0
- \`dp[0][s] = false\` for \`s > 0\` — zero items can't produce any positive sum

<!-- voice:key_insight insight="This is exactly the knapsack pattern — can we select items (numbers) to exactly fill capacity (target sum)?" -->

### Tracing the Algorithm

Let's trace the space-optimized 1D version on \`nums = [1, 2, 3, 7]\`, \`S = 6\`. The array \`dp[s]\` is \`true\` if sum \`s\` is reachable from numbers seen so far.

\`\`\`trace
{ "title": "Subset Sum on [1, 2, 3, 7], S=6", "language": "python", "code": "def subset_sum(nums, S):\\n    dp = [False] * (S + 1)\\n    dp[0] = True\\n    for num in nums:\\n        for s in range(S, num - 1, -1):\\n            dp[s] = dp[s] or dp[s - num]\\n    return dp[S]\\n\\nnums = [1, 2, 3, 7]\\nprint(subset_sum(nums, 6))", "frames": [ { "line": 3, "vars": { "dp": "[T,F,F,F,F,F,F]" }, "note": "Base case: only sum 0 is reachable (via the empty subset)" }, { "line": 4, "vars": { "num": 1, "dp": "[T,F,F,F,F,F,F]" }, "note": "Processing num=1 — iterate s from 6 down to 1" }, { "line": 6, "vars": { "num": 1, "s": 1, "dp": "[T,T,F,F,F,F,F]" }, "note": "dp[1] = dp[1] OR dp[0] = True → sum 1 reachable via {1}" }, { "line": 4, "vars": { "num": 2, "dp": "[T,T,F,F,F,F,F]" }, "note": "Processing num=2 — iterate s from 6 down to 2" }, { "line": 6, "vars": { "num": 2, "s": 3, "dp": "[T,T,T,T,F,F,F]" }, "note": "dp[3]=dp[1]=True ({1,2}=3), dp[2]=dp[0]=True ({2}=2)" }, { "line": 4, "vars": { "num": 3, "dp": "[T,T,T,T,F,F,F]" }, "note": "Processing num=3 — iterate s from 6 down to 3" }, { "line": 6, "vars": { "num": 3, "s": 6, "dp": "[T,T,T,T,T,T,T]" }, "note": "dp[6] = dp[3] = True → {1,2,3} sums to 6! ✓  Also sets dp[5] ({2,3}) and dp[4] ({1,3})" }, { "line": 4, "vars": { "num": 7, "dp": "[T,T,T,T,T,T,T]" }, "note": "num=7 > S=6, inner loop range(6, 6, -1) is empty — no updates" }, { "line": 7, "vars": { "dp": "[T,T,T,T,T,T,T]" }, "note": "Return dp[6] = True", "stdout": "True" } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why iterate right to left?", "content": "When computing \`dp[s]\`, we read \`dp[s - num]\` — which must reflect the state *before* including \`num\` in this round. Iterating **right to left** guarantees that smaller indices haven't been updated yet for the current \`num\`. Iterating left to right would let the same number be counted multiple times, turning the 0/1 problem into the unbounded knapsack variant." }
\`\`\`

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Three Implementations

\`\`\`tabs
{ "tabs": [ { "label": "Memoization (Top-Down)", "icon": "🔼", "content": "\`\`\`python\\ndef subset_sum(nums, S):\\n    n = len(nums)\\n    memo = {}\\n\\n    def dp(i, remaining):\\n        if remaining == 0:\\n            return True\\n        if i == 0 or remaining < 0:\\n            return False\\n        if (i, remaining) in memo:\\n            return memo[(i, remaining)]\\n        # Skip or include nums[i-1]\\n        result = (dp(i - 1, remaining) or\\n                  dp(i - 1, remaining - nums[i - 1]))\\n        memo[(i, remaining)] = result\\n        return result\\n\\n    return dp(n, S)\\n\`\`\`\\n\\n**Time:** O(n × S) — at most n×S unique \`(i, remaining)\` pairs\\n\\n**Space:** O(n × S) for the memo table + O(n) call stack depth" }, { "label": "Tabulation (Bottom-Up)", "icon": "🔽", "content": "\`\`\`python\\ndef subset_sum(nums, S):\\n    n = len(nums)\\n    dp = [[False] * (S + 1) for _ in range(n + 1)]\\n\\n    # Base case: empty subset reaches sum 0\\n    for i in range(n + 1):\\n        dp[i][0] = True\\n\\n    for i in range(1, n + 1):\\n        for s in range(1, S + 1):\\n            dp[i][s] = dp[i - 1][s]          # skip\\n            if nums[i - 1] <= s:\\n                dp[i][s] = (dp[i][s] or\\n                            dp[i - 1][s - nums[i - 1]])\\n\\n    return dp[n][S]\\n\`\`\`\\n\\n**Time:** O(n × S)\\n\\n**Space:** O(n × S) — the full 2D table. Reducible to O(S) with the 1D trick." }, { "label": "Space-Optimized (1D)", "icon": "⚡", "content": "\`\`\`python\\ndef subset_sum(nums, S):\\n    dp = [False] * (S + 1)\\n    dp[0] = True\\n\\n    for num in nums:\\n        # Right-to-left prevents reusing the same number\\n        for s in range(S, num - 1, -1):\\n            dp[s] = dp[s] or dp[s - num]\\n\\n    return dp[S]\\n\`\`\`\\n\\n**Time:** O(n × S)\\n\\n**Space:** O(S) — optimal\\n\\nThis is the production version: the inner loop iterates right-to-left so each number is included at most once per pass." } ] }
\`\`\`

### Complexity Summary

| Approach | Time | Space |
|----------|------|-------|
| Brute force (enumerate all subsets) | O(2ⁿ) | O(n) |
| Memoization | O(n × S) | O(n × S) |
| Tabulation (2D) | O(n × S) | O(n × S) |
| Tabulation (1D, space-optimized) | O(n × S) | **O(S)** |

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "The 0/1 Knapsack recurrence uses \`max(skip, include)\`. The Subset Sum recurrence uses \`skip OR include\`. Why OR instead of max?", "options": [ "Because subset numbers can be negative, making max unreliable", "Subset Sum is a decision problem — any single path to true is enough; we don't rank solutions", "Because OR is faster to compute than max on modern hardware", "Because we iterate right to left, which requires boolean logic" ], "answer": 1, "explanation": "Subset Sum asks 'does a valid subset exist?' — it's a yes/no question. A single True path (skip or include) is sufficient, so logical OR captures this correctly. Knapsack asks 'what is the maximum profit?' — an optimization problem where we must compare both choices and take the better one." }, { "question": "In the space-optimized 1D solution, the inner loop runs \`for s in range(S, num - 1, -1)\`. What bug appears if you change this to \`for s in range(num, S + 1)\`?", "options": [ "Index out of bounds when s - num < 0", "The same number can be included multiple times, solving unbounded knapsack instead", "The base case dp[0] = True gets overwritten", "The loop terminates before reaching dp[S]" ], "answer": 1, "explanation": "Left-to-right iteration updates dp[s - num] before dp[s] reads it. If dp[s - num] was already updated in the same num-pass, we effectively include num more than once. For example, with num=3 and dp[3]=True, a left-to-right pass would set dp[6]=True from dp[3], then dp[9] from dp[6] — counting 3 twice, three times, etc." }, { "question": "What is dp[0][s] for any s > 0 in the 2D tabulation table, and why?", "options": [ "true — the empty subset technically has sum 0, which is ≤ any positive s", "false — with zero items available, no positive sum is reachable", "Undefined — we only ever read rows 1 through n", "true if s ≤ nums[0], false otherwise" ], "answer": 1, "explanation": "Row 0 represents considering zero items. The only achievable sum with no items is 0 itself (the empty subset). dp[0][0] = true (base case), and dp[0][s] = false for all s > 0. Every other row in the table builds on this foundation." }, { "question": "nums = [1, 3, 4, 8], S = 6 returns false. Which pair of sums immediately below and above 6 ARE reachable?", "options": [ "5 via {1, 4} and 7 via {3, 4}", "6 is unreachable so the nearest reachable sums are 4 and 8", "5 via {1, 4} and 8 via {1, 3, 4}", "3 via {3} and 8 via {8}" ], "answer": 0, "explanation": "{1, 4} = 5 and {3, 4} = 7 are the closest reachable sums straddling the target. The integer 6 has a gap in the reachable set for this input — no combination of 1, 3, 4, 8 adds to exactly 6. This illustrates why DP gives a definitive false: after filling the entire table, dp[4][6] remains false." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Subset Sum is 0/1 Knapsack where each number's weight equals its value and the goal is to exactly fill capacity S — no profit values needed.", "The recurrence dp[i][s] = dp[i-1][s] OR dp[i-1][s - nums[i]] uses OR (not max) because we need existence, not optimality.", "Time complexity is O(n × S) with both memoization and tabulation; space can be reduced to O(S) with a 1D array.", "In the 1D optimization, always iterate s from high to low — left-to-right iteration allows the same number to be reused, accidentally solving the unbounded knapsack variant instead.", "The base case dp[i][0] = true for all i is fundamental: the empty subset always achieves sum 0, anchoring the entire table." ] }
\`\`\``,
      starterCode: `def subset_sum(nums, target):
    """
    Determine if a subset with given target sum exists.
    
    Args:
        nums: List of positive integers
        target: int, target sum
    
    Returns:
        bool: True if subset with target sum exists
    
    Example:
        >>> subset_sum([1, 2, 3, 7], 6)
        True
        >>> subset_sum([1, 3, 4, 8], 6)
        False
        >>> subset_sum([2, 3, 7, 8, 10], 11)
        True
    """
    # TODO: Apply knapsack pattern to find subset sum
    # Hint: dp[s] = can we achieve sum s?
    pass


# ─── Test Cases ───

# Subset exists
print(subset_sum([1, 2, 3, 7], 6))
# Expected: True

# No subset
print(subset_sum([1, 3, 4, 8], 6))
# Expected: False

# Another subset exists
print(subset_sum([2, 3, 7, 8, 10], 11))
# Expected: True

# Target is 0 (empty subset)
print(subset_sum([1, 2, 3], 0))
# Expected: True

# Single element matches
print(subset_sum([5], 5))
# Expected: True

# Single element doesn't match
print(subset_sum([5], 3))
# Expected: False

# Larger target
print(subset_sum([3, 34, 4, 12, 5, 2], 9))
# Expected: True (4 + 5 = 9)
`,
      solutionCode: `def subset_sum(nums, target):
    """
    Determine if a subset with given target sum exists.
    
    Time Complexity: O(n × target)
    Space Complexity: O(target)
    """
    # dp[s] = can we achieve sum s?
    dp = [False] * (target + 1)
    dp[0] = True  # Sum 0 is always achievable (empty subset)
    
    for num in nums:
        # Iterate backwards to avoid reuse
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
    
    return dp[target]


# Alternative: Recursive with memoization
def subset_sum_recursive(nums, target):
    """
    Top-down recursive solution.
    """
    memo = {}
    
    def helper(idx, remaining):
        if remaining == 0:
            return True
        if idx >= len(nums) or remaining < 0:
            return False
        
        if (idx, remaining) in memo:
            return memo[(idx, remaining)]
        
        # Include current or skip
        result = helper(idx + 1, remaining - nums[idx]) or                  helper(idx + 1, remaining)
        
        memo[(idx, remaining)] = result
        return result
    
    return helper(0, target)


# ─── Test Cases ───
print(subset_sum([1, 2, 3, 7], 6))
# Expected: True

print(subset_sum([1, 3, 4, 8], 6))
# Expected: False

print(subset_sum([2, 3, 7, 8, 10], 11))
# Expected: True

print(subset_sum([1, 2, 3], 0))
# Expected: True

print(subset_sum([5], 5))
# Expected: True

print(subset_sum([5], 3))
# Expected: False

print(subset_sum([3, 34, 4, 12, 5, 2], 9))
# Expected: True
`,
    },
    {
      id: "minimum-subset-sum-difference",
      slug: "minimum-subset-sum-difference",
      title: "Minimum Subset Sum Difference",
      content: `## Minimum Subset Sum Difference

<!-- voice:section_check concept="Optimization variation of subset sum" -->

### Problem Statement

Given a set of positive numbers, partition the set into two subsets S1 and S2 such that the **absolute difference** of their sums is as small as possible. Return this minimum difference.

| Input | Output | Best Partition |
|-------|--------|----------------|
| \`[1, 2, 3, 9]\` | \`3\` | \`{1,2,3}\` (sum=6) vs \`{9}\` (sum=9) |
| \`[1, 2, 7, 1, 5]\` | \`0\` | \`{1,2,5}\` (sum=8) vs \`{7,1}\` (sum=8) |
| \`[1, 3, 100, 4]\` | \`92\` | \`{1,3,4}\` (sum=8) vs \`{100}\` (sum=100) |

\`\`\`concept
{ "title": "The Core Mathematical Insight", "variant": "mental-model", "content": "Let S = total sum. If one subset achieves sum S1, the other gets S2 = S − S1.\\n\\nDifference = |S1 − S2| = |S1 − (S − S1)| = |2·S1 − S|\\n\\nThis expression is minimized when S1 is as **close to S/2** as possible.\\n\\nSo the problem reduces to: use 0/1 Knapsack DP to find all achievable sums up to ⌊S/2⌋, then pick the largest one. The answer is S − 2·(best S1)." }
\`\`\`

<!-- voice:key_insight insight="We want S1 close to S/2 — iterate through achievable sums and find the one closest to half of total" -->

### Reducing to Subset Sum DP

\`\`\`steps
{ "title": "Algorithm — Four Steps", "steps": [ { "title": "Compute S and set the target", "content": "Sum all elements to get S. Set \`target = S // 2\`. We only need to track achievable sums in the range \`[0, target]\` — anything larger would swap which subset is the 'bigger' one." }, { "title": "Build the boolean DP array", "content": "Create \`dp[0..target]\` where \`dp[j] = True\` means sum \`j\` is achievable by some subset.\\n\\nInitialize \`dp[0] = True\` (the empty subset always achieves sum 0). All other entries start \`False\`." }, { "title": "Fill DP with 0/1 Knapsack traversal", "content": "For each number, iterate \`j\` from \`target\` **down to** the number's value:\\n\\n\`\`\`\\ndp[j] = dp[j] or dp[j − num]\\n\`\`\`\\n\\nRight-to-left traversal ensures each element is considered at most once." }, { "title": "Scan for the best S1, compute the answer", "content": "Scan from \`target\` down to 0. The **first** index \`j\` where \`dp[j] = True\` is the largest achievable sum ≤ S/2.\\n\\nMinimum difference = S − 2·j" } ] }
\`\`\`

### Visualizing the DP Table — \`[1, 2, 3, 9]\`

Total S = 15, target = 7. The array shows \`dp[0..7]\` after each element is processed:

\`\`\`algoviz
{ "title": "DP Reachability Table for [1, 2, 3, 9]", "type": "array", "data": [1, 0, 0, 0, 0, 0, 0, 0], "frames": [ { "highlight": [0], "label": "Init: dp[0]=true — empty subset achieves sum 0", "stats": { "num": "—", "S": 15, "target": 7 } }, { "highlight": [0, 1], "label": "num=1: dp[1]=dp[0]=true → subset {1} achieves sum 1", "stats": { "num": 1, "S": 15, "target": 7 } }, { "highlight": [0, 1, 2, 3], "label": "num=2: dp[2] and dp[3] become true → subsets {2} and {1,2}", "stats": { "num": 2, "S": 15, "target": 7 } }, { "highlight": [0, 1, 2, 3, 4, 5, 6], "label": "num=3: dp[4..6] become true → adding 3 to each existing sum", "stats": { "num": 3, "S": 15, "target": 7 } }, { "highlight": [0, 1, 2, 3, 4, 5, 6], "label": "num=9: 9 > target=7, no new entries added in [0..7]", "stats": { "num": 9, "S": 15, "target": 7 } }, { "highlight": [6], "label": "Best S1 = 6 (largest true index ≤ 7). Answer = 15 − 2×6 = 3 ✓", "stats": { "S1": 6, "S2": 9, "answer": 3 } } ], "speed": 950 }
\`\`\`

### Code

<!-- voice:exercise_intro difficulty="hard" hints_available="3" -->

\`\`\`playground
{ "title": "Minimum Subset Sum Difference", "language": "python", "runnable": true, "code": "def min_subset_sum_difference(nums):\\n    S = sum(nums)\\n    target = S // 2\\n\\n    # dp[j] = True if sum j is achievable by some subset\\n    dp = [False] * (target + 1)\\n    dp[0] = True\\n\\n    for num in nums:\\n        # Right-to-left: 0/1 knapsack (each element used at most once)\\n        for j in range(target, num - 1, -1):\\n            dp[j] = dp[j] or dp[j - num]\\n\\n    # Find largest achievable sum <= S/2\\n    for s1 in range(target, -1, -1):\\n        if dp[s1]:\\n            s2 = S - s1\\n            return s2 - s1  # equivalent to S - 2*s1\\n\\n    return S  # unreachable for non-empty input\\n\\n\\nprint(min_subset_sum_difference([1, 2, 3, 9]))    # 3\\nprint(min_subset_sum_difference([1, 2, 7, 1, 5])) # 0\\nprint(min_subset_sum_difference([1, 3, 100, 4]))  # 92" }
\`\`\`

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Brute Force — O(2^n)", "code": "def min_diff_brute(nums, n, s1, s2):\\n    if n == 0:\\n        return abs(s1 - s2)\\n    # Try placing nums[n-1] into either subset\\n    return min(\\n        min_diff_brute(nums, n-1, s1 + nums[n-1], s2),\\n        min_diff_brute(nums, n-1, s1, s2 + nums[n-1])\\n    )\\n\\ndef solve(nums):\\n    return min_diff_brute(nums, len(nums), 0, 0)" }, "after": { "label": "DP Tabulation — O(n × S/2)", "code": "def min_subset_sum_difference(nums):\\n    S = sum(nums)\\n    target = S // 2\\n    dp = [False] * (target + 1)\\n    dp[0] = True\\n    for num in nums:\\n        for j in range(target, num - 1, -1):\\n            dp[j] = dp[j] or dp[j - num]\\n    for s1 in range(target, -1, -1):\\n        if dp[s1]:\\n            return (S - s1) - s1\\n    return S" } }
\`\`\`

### Complexity

| Approach | Time | Space |
|----------|------|-------|
| Brute Force | O(2ⁿ) | O(n) stack |
| Top-down Memoization | O(n × S) | O(n × S) |
| **Bottom-up Tabulation** | **O(n × S/2)** | **O(S/2)** |

\`\`\`callout
{ "type": "warning", "title": "Why Right-to-Left Inner Loop?", "content": "If you traverse left-to-right, \`dp[j − num]\` may already reflect the **current** item being added — meaning the same item could be counted twice. Right-to-left ensures we always look at state from *before* the current item was processed. This is the defining difference between 0/1 Knapsack (right-to-left) and Unbounded Knapsack (left-to-right)." }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why Only Track Up to S/2?", "content": "S1 and S2 are symmetric. If S1 > S/2, then S2 < S/2, and swapping labels gives an equivalent but smaller S1. Capping the target at S//2 eliminates redundant states and cuts memory in half — without changing the answer." }
\`\`\`

### Self-Check

\`\`\`quiz
{ "title": "Minimum Subset Sum Difference", "questions": [ { "question": "For input [3, 9, 7, 3], S = 22. What target value does the DP array run up to?", "options": ["22", "11", "10", "9"], "answer": 1, "explanation": "target = S // 2 = 22 // 2 = 11. We only track achievable sums in [0, 11]. Anything above S/2 is symmetric to a sum below it." }, { "question": "After filling the DP table for [3, 9, 7, 3], the largest achievable sum ≤ 11 is 10 (via subset {3, 7}). What is the minimum difference?", "options": ["2", "4", "0", "3"], "answer": 0, "explanation": "S1 = 10, S2 = 22 − 10 = 12. Difference = S − 2·S1 = 22 − 2·10 = 2." }, { "question": "What happens if you traverse the inner loop left-to-right instead of right-to-left?", "options": ["The algorithm becomes slower", "Items can be reused — it solves an Unbounded Knapsack variant instead", "The DP table size doubles", "Nothing changes since dp is boolean"], "answer": 1, "explanation": "Left-to-right means dp[j − num] already reflects the current item being included, so it can contribute multiple times. Right-to-left uses the pre-update state, enforcing the 0/1 constraint." }, { "question": "For a single-element array [42], what should the algorithm return?", "options": ["42", "0", "21", "84"], "answer": 0, "explanation": "S = 42, target = 21. Only dp[0] is ever true (42 > 21, so num=42 never updates the table). Best S1 = 0, so answer = S − 2·0 = 42. One element must go in each 'subset' — one gets 42, one gets 0." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Reframe the objective: minimize |S1 − S2| = |2·S1 − S|, so find S1 as close to S/2 as possible.", "The problem is a direct Subset Sum DP: build a boolean reachability array of size S/2 + 1.", "Right-to-left inner traversal enforces the 0/1 constraint — each element used at most once.", "After filling the table, scan from target down to 0; the first true entry gives the optimal S1.", "Tabulation reduces space from O(n × S) to O(S/2) compared to full memoization, with the same O(n × S) time." ] }
\`\`\``,
      starterCode: `def min_subset_sum_difference(nums):
    """
    Find minimum difference between two subset sums.
    
    Args:
        nums: List of positive integers
    
    Returns:
        int: Minimum possible difference
    
    Example:
        >>> min_subset_sum_difference([1, 2, 3, 9])
        3
        >>> min_subset_sum_difference([1, 2, 7, 1, 5])
        0
        >>> min_subset_sum_difference([1, 3, 100, 4])
        92
    """
    # TODO: Find subset sum closest to total/2
    # Hint: Find achievable sums up to total/2, closest to half minimizes diff
    pass


# ─── Test Cases ───

# Standard case
print(min_subset_sum_difference([1, 2, 3, 9]))
# Expected: 3

# Can partition equally
print(min_subset_sum_difference([1, 2, 7, 1, 5]))
# Expected: 0

# Large difference
print(min_subset_sum_difference([1, 3, 100, 4]))
# Expected: 92

# Two elements
print(min_subset_sum_difference([1, 2]))
# Expected: 1

# Equal elements
print(min_subset_sum_difference([5, 5, 5, 5]))
# Expected: 0

# Single element
print(min_subset_sum_difference([10]))
# Expected: 10 (one subset empty)

# All ones
print(min_subset_sum_difference([1, 1, 1, 1, 1]))
# Expected: 1 (sum=5, best split 2 and 3)
`,
      solutionCode: `def min_subset_sum_difference(nums):
    """
    Find minimum difference between two subset sums.
    
    Time Complexity: O(n × sum)
    Space Complexity: O(sum)
    """
    total = sum(nums)
    n = len(nums)
    target = total // 2
    
    # dp[s] = can we achieve sum s?
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
    
    # Find largest s <= target that is achievable
    for s in range(target, -1, -1):
        if dp[s]:
            # s is sum of one subset, (total - s) is sum of other
            # Difference = (total - s) - s = total - 2s
            return total - 2 * s
    
    return total  # Should not reach here


# Alternative: Track all possible sums
def min_subset_sum_difference_set(nums):
    """
    Alternative using set to track possible sums.
    """
    total = sum(nums)
    possible_sums = {0}
    
    for num in nums:
        new_sums = set()
        for s in possible_sums:
            new_sums.add(s + num)
        possible_sums = possible_sums.union(new_sums)
    
    min_diff = float('inf')
    for s in possible_sums:
        diff = abs(total - 2 * s)
        min_diff = min(min_diff, diff)
    
    return min_diff


# ─── Test Cases ───
print(min_subset_sum_difference([1, 2, 3, 9]))
# Expected: 3

print(min_subset_sum_difference([1, 2, 7, 1, 5]))
# Expected: 0

print(min_subset_sum_difference([1, 3, 100, 4]))
# Expected: 92

print(min_subset_sum_difference([1, 2]))
# Expected: 1

print(min_subset_sum_difference([5, 5, 5, 5]))
# Expected: 0

print(min_subset_sum_difference([10]))
# Expected: 10

print(min_subset_sum_difference([1, 1, 1, 1, 1]))
# Expected: 1
`,
    },
    {
      id: "count-of-subset-sum",
      slug: "count-of-subset-sum",
      title: "Count of Subset Sum",
      content: `## Count of Subset Sum

<!-- voice:section_check concept="Counting variation of subset sum" -->

You've already solved **Subset Sum** — deciding *whether* any subset sums to a target. Now the question shifts: *how many* subsets achieve that sum?

The structure stays the same. Only one thing changes: the DP operation.

\`\`\`concept
{ "title": "The One-Word Swap That Changes Everything", "variant": "insight", "content": "Boolean Subset Sum asks: can ANY subset sum to S? It uses OR — one successful path is enough.\\n\\nCount of Subset Sum asks: HOW MANY subsets sum to S? It uses + — every successful path contributes 1 to the total.\\n\\nSame recurrence skeleton. Same traversal order. One operator swap." }
\`\`\`

---

### Problem Statement

Given a set of positive integers and a target sum \`S\`, return the number of subsets whose elements sum to exactly \`S\`. Each element may be used at most once per subset.

**Examples:**

| Input | S | Answer | Subsets |
|-------|---|--------|---------|
| \`[1, 1, 2, 3]\` | 4 | **3** | \`{1ₐ, 3}\`, \`{1ᵦ, 3}\`, \`{1ₐ, 1ᵦ, 2}\` |
| \`[2, 3, 5, 6, 8, 10]\` | 10 | **3** | \`{2,3,5}\`, \`{2,8}\`, \`{10}\` |
| \`[1, 2, 7, 1, 5]\` | 9 | **3** | \`{2,7}\`, \`{1ₐ,2,1ᵦ,5}\`, \`{1ᵦ,2,1ₐ,5}\` |

\`\`\`callout
{ "type": "info", "title": "Duplicates Count as Distinct Elements", "content": "When the input has duplicates (e.g., two 1s), each occurrence is a separate element. Using the first 1 with 3 and using the second 1 with 3 are two distinct subsets — even though they produce the same multiset of values. This is why [1,1,2,3] with S=4 yields 3, not 2." }
\`\`\`

---

### The Recurrence: OR Becomes +

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Subset Sum — Boolean", "code": "# Can any subset sum to s?\\nif nums[i] <= s:\\n    dp[i][s] = dp[i-1][s] or dp[i-1][s - nums[i]]\\nelse:\\n    dp[i][s] = dp[i-1][s]\\n\\n# Base: dp[any][0] = True\\n# (empty subset exists)" }, "after": { "label": "Count of Subset Sum", "code": "# How many subsets sum to s?\\nif nums[i] <= s:\\n    dp[i][s] = dp[i-1][s] + dp[i-1][s - nums[i]]\\nelse:\\n    dp[i][s] = dp[i-1][s]\\n\\n# Base: dp[any][0] = 1\\n# (exactly one empty subset)" } }
\`\`\`

The base case shifts too: \`True\` becomes \`1\` — there is exactly **one** way to sum to zero (choose nothing).

---

### Tracing the Algorithm

Let's trace \`nums = [1, 1, 2, 3]\`, \`S = 4\` with the 1D space-optimized DP.

\`\`\`trace
{ "title": "count_subsets([1, 1, 2, 3], S=4)", "language": "python", "code": "def count_subsets(nums, S):\\n    dp = [0] * (S + 1)\\n    dp[0] = 1\\n    for num in nums:\\n        for s in range(S, num - 1, -1):\\n            dp[s] += dp[s - num]\\n    return dp[S]", "frames": [ { "line": 2, "vars": { "dp": "[0, 0, 0, 0, 0]" }, "note": "Initialize all counts to 0" }, { "line": 3, "vars": { "dp": "[1, 0, 0, 0, 0]" }, "note": "Base case: 1 way to reach sum=0 (the empty subset)" }, { "line": 4, "vars": { "num": 1, "dp": "[1, 0, 0, 0, 0]" }, "note": "Outer loop: process num=1 (first occurrence)" }, { "line": 6, "vars": { "num": 1, "s": 1, "dp": "[1, 1, 0, 0, 0]" }, "note": "dp[1] += dp[0] = 1. One subset {1} now sums to 1." }, { "line": 4, "vars": { "num": 1, "dp": "[1, 1, 0, 0, 0]" }, "note": "Outer loop: process num=1 (second occurrence — distinct element)" }, { "line": 6, "vars": { "num": 1, "s": 2, "dp": "[1, 2, 1, 0, 0]" }, "note": "s=2: dp[2]+=dp[1]=1 → 1. s=1: dp[1]+=dp[0]=1 → 2. Now two distinct ways to reach sum=1." }, { "line": 4, "vars": { "num": 2, "dp": "[1, 2, 1, 0, 0]" }, "note": "Outer loop: process num=2" }, { "line": 6, "vars": { "num": 2, "s": 4, "dp": "[1, 2, 2, 2, 1]" }, "note": "s=4: dp[4]+=dp[2]=1. s=3: dp[3]+=dp[1]=2. s=2: dp[2]+=dp[0]=1 → 2." }, { "line": 4, "vars": { "num": 3, "dp": "[1, 2, 2, 2, 1]" }, "note": "Outer loop: process num=3" }, { "line": 6, "vars": { "num": 3, "s": 4, "dp": "[1, 2, 2, 3, 3]" }, "note": "s=4: dp[4]+=dp[1]=2 → dp[4]=3. s=3: dp[3]+=dp[0]=1 → dp[3]=3." }, { "line": 7, "vars": { "dp[4]": 3 }, "note": "Return dp[4] = 3 subsets sum to 4", "stdout": "3" } ], "speed": 700 }
\`\`\`

---

### Full Solution

<!-- voice:exercise_intro difficulty="hard" hints_available="3" -->

\`\`\`playground
{ "title": "Count of Subset Sum — Tabulation", "language": "python", "code": "def count_subsets(nums, S):\\n    \\"\\"\\"\\n    Count subsets summing to S using 1D tabulation.\\n    Time: O(n * S)  |  Space: O(S)\\n    \\"\\"\\"\\n    dp = [0] * (S + 1)\\n    dp[0] = 1  # one way to make sum 0: the empty subset\\n\\n    for num in nums:\\n        # Right-to-left: prevents counting the same element twice\\n        for s in range(S, num - 1, -1):\\n            dp[s] += dp[s - num]\\n\\n    return dp[S]\\n\\n\\nprint(count_subsets([1, 1, 2, 3], 4))          # 3\\nprint(count_subsets([1, 2, 7, 1, 5], 9))       # 3\\nprint(count_subsets([2, 3, 5, 6, 8, 10], 10))  # 3", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Loop Direction Is Not Optional", "content": "The inner loop must go **high to low** (\`range(S, num-1, -1)\`).\\n\\nIf you loop low to high, \`dp[s - num]\` may already reflect the current element being included — turning a 0/1 knapsack into an unbounded one. You would overcount every subset containing \`num\`, as if you could use it unlimited times." }
\`\`\`

---

### Quiz

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "What single change converts boolean Subset Sum into Count of Subset Sum?", "options": ["Change the loop from right-to-left to left-to-right", "Replace OR with + and initialize dp[0]=1 instead of True", "Add an extra dimension to the dp array", "Change the recurrence from bottom-up to top-down"], "answer": 1, "explanation": "The recurrence skeleton is identical. Swapping OR for + means every valid path adds 1 to the count instead of short-circuiting. The base case also shifts: True → 1, because there is exactly one empty subset." }, { "question": "For nums=[1,1,2,3] and S=4, why is the answer 3 and not 2?", "options": ["You can reuse the same value multiple times", "The two instances of 1 are treated as distinct elements", "Only contiguous subsets are counted", "4 is always achievable in 3 ways for arrays of this length"], "answer": 1, "explanation": "Each occurrence of 1 is a separate element — index 0 and index 1. Pairing element-0 (1) with 3 and pairing element-1 (1) with 3 are two different selections, so both are counted independently." }, { "question": "What is dp[0] initialized to and why?", "options": ["0, because no elements have been processed yet", "1, because there is exactly one way to form sum 0 (the empty subset)", "n, one count per input element", "S, to represent all possible target sums"], "answer": 1, "explanation": "The empty subset has a sum of 0, and there is exactly one empty subset. dp[0]=1 seeds the counting so that every 'include' step propagates this 1 forward into larger sums." }, { "question": "What are the time and space complexities of the 1D DP solution?", "options": ["O(n²) time and O(n) space", "O(n × S) time and O(n × S) space", "O(n × S) time and O(S) space", "O(S²) time and O(n) space"], "answer": 2, "explanation": "The outer loop iterates n times (one per element) and the inner loop iterates at most S times, giving O(n × S) time. Replacing the 2D table with a single array of size S+1 reduces space to O(S)." } ] }
\`\`\`

---

### Where This Fits in the DP Family

<!-- voice:key_insight insight="Instead of OR (any way works), use PLUS (count all ways) — same structure, different operation" -->

\`\`\`collapse
{ "title": "Deep Dive: The 0/1 Knapsack Recurrence Skeleton", "content": "Every 0/1 Knapsack variant follows one skeleton:\\n\\n    dp[i][s] = combine( skip(dp[i-1][s]), include(dp[i-1][s - weight[i]]) )\\n\\nWhat differs between variants:\\n\\n| Variant | combine | base dp[i][0] |\\n|---------|---------|---------------|\\n| 0/1 Knapsack (max value) | max | 0 |\\n| Subset Sum (exists?) | or | True |\\n| Count of Subsets | + | 1 |\\n| Min-difference partition | min | 0 or inf |\\n\\nOnce you identify what you are accumulating and what the neutral starting value is, you can derive the correct DP for any variant without memorizing separate solutions. Ask: 'What does one successful path contribute to the answer?'" }
\`\`\`

---

### Complexity

- **Time:** O(n × S) — n elements, each scanned across S possible sums
- **Space:** O(S) — 1D array, space-optimized from the naive O(n × S) 2D table

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["Swap OR → + (and True → 1 in the base case) to turn Subset Sum into a counting problem", "dp[0] = 1 seeds the count: exactly one empty subset forms sum 0", "Traverse the inner loop right-to-left to enforce the 0/1 constraint (each element used at most once)", "Duplicate input values are distinct elements — each independently contributes to the subset count", "Time O(n × S), Space O(S) with the 1D space-optimized approach"] }
\`\`\``,
      starterCode: `def count_subsets(nums, target):
    """
    Count number of subsets with given target sum.
    
    Args:
        nums: List of positive integers
        target: int, target sum
    
    Returns:
        int: Number of subsets with target sum
    
    Example:
        >>> count_subsets([1, 1, 2, 3], 4)
        3
        >>> count_subsets([1, 2, 7, 1, 5], 9)
        3
        >>> count_subsets([2, 3, 5, 6, 8, 10], 10)
        3
    """
    # TODO: Count ways to achieve target sum (not just check if possible)
    # Hint: dp[s] = number of ways to achieve sum s
    pass


# ─── Test Cases ───

# Standard case
print(count_subsets([1, 1, 2, 3], 4))
# Expected: 3

# With duplicates
print(count_subsets([1, 2, 7, 1, 5], 9))
# Expected: 3

# Multiple combinations
print(count_subsets([2, 3, 5, 6, 8, 10], 10))
# Expected: 3

# Target is 0 (empty subset counts as 1 way)
print(count_subsets([1, 2, 3], 0))
# Expected: 1

# No valid subsets
print(count_subsets([1, 2, 3], 10))
# Expected: 0

# Single element matches
print(count_subsets([5], 5))
# Expected: 1

# All elements match
print(count_subsets([2, 3, 5], 10))
# Expected: 1
`,
      solutionCode: `def count_subsets(nums, target):
    """
    Count number of subsets with given target sum.
    
    Time Complexity: O(n × target)
    Space Complexity: O(target)
    """
    # dp[s] = number of ways to achieve sum s
    dp = [0] * (target + 1)
    dp[0] = 1  # One way to achieve sum 0: empty subset
    
    for num in nums:
        # Iterate backwards to avoid reuse
        for s in range(target, num - 1, -1):
            dp[s] += dp[s - num]
    
    return dp[target]


# Alternative: Recursive with memoization
def count_subsets_recursive(nums, target):
    """
    Top-down recursive solution.
    """
    memo = {}
    
    def helper(idx, remaining):
        if remaining == 0:
            return 1
        if idx >= len(nums) or remaining < 0:
            return 0
        
        if (idx, remaining) in memo:
            return memo[(idx, remaining)]
        
        # Include current + skip current
        include = helper(idx + 1, remaining - nums[idx])
        skip = helper(idx + 1, remaining)
        
        result = include + skip
        memo[(idx, remaining)] = result
        return result
    
    return helper(0, target)


# 2D solution for clarity
def count_subsets_2d(nums, target):
    """
    2D DP solution showing complete state.
    """
    n = len(nums)
    # dp[i][s] = number of ways to achieve sum s using first i elements
    dp = [[0] * (target + 1) for _ in range(n + 1)]
    
    # Base case: one way to achieve sum 0 (empty subset)
    for i in range(n + 1):
        dp[i][0] = 1
    
    for i in range(1, n + 1):
        for s in range(target + 1):
            # Skip current element
            dp[i][s] = dp[i-1][s]
            
            # Include current element if possible
            if s >= nums[i-1]:
                dp[i][s] += dp[i-1][s - nums[i-1]]
    
    return dp[n][target]


# ─── Test Cases ───
print(count_subsets([1, 1, 2, 3], 4))
# Expected: 3

print(count_subsets([1, 2, 7, 1, 5], 9))
# Expected: 3

print(count_subsets([2, 3, 5, 6, 8, 10], 10))
# Expected: 3

print(count_subsets([1, 2, 3], 0))
# Expected: 1

print(count_subsets([1, 2, 3], 10))
# Expected: 0

print(count_subsets([5], 5))
# Expected: 1

print(count_subsets([2, 3, 5], 10))
# Expected: 1
`,
    },
    {
      id: "dynamic-programming-checkpoint",
      slug: "dynamic-programming-checkpoint",
      title: "Module Checkpoint: Dynamic Programming",
      content: `## Module Checkpoint: Dynamic Programming

<!-- voice:checkpoint_intro -->

You've worked through one of the most powerful algorithmic patterns in computer science. Before moving on, let's consolidate everything you learned — from the two core DP properties to five distinct knapsack variants.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "DP requires overlapping subproblems AND optimal substructure — both, not just one",
    "Top-down (memoization) = recursion + cache; Bottom-up (tabulation) = iterative DP table",
    "0/1 Knapsack: dp[i][c] = max value using first i items with capacity c",
    "Equal Subset Sum reduces to Subset Sum with target = totalSum / 2 (only if sum is even)",
    "Count of Subset Sum uses addition (+) where boolean Subset Sum uses OR — small change, big difference",
    "Space-optimized knapsack uses a 1D array iterated right-to-left to prevent reusing items"
  ]
}
\`\`\`

---

### The Five DP Variants — Side by Side

\`\`\`tabs
{
  "tabs": [
    {
      "label": "0/1 Knapsack",
      "icon": "🎒",
      "content": "**Goal:** Maximize value without exceeding weight capacity W.\\n\\n**State:** \`dp[i][c]\` = max value using first \`i\` items with capacity \`c\`\\n\\n**Recurrence:**\\n\`\`\`\\nif wt[i] > c:\\n    dp[i][c] = dp[i-1][c]            # skip — can't fit\\nelse:\\n    dp[i][c] = max(\\n        dp[i-1][c],                   # skip item\\n        val[i] + dp[i-1][c - wt[i]]  # pick item\\n    )\\n\`\`\`\\n\\n**Complexity:** Time O(n·W), Space O(n·W) → O(W) with 1D optimization"
    },
    {
      "label": "Subset Sum",
      "icon": "✅",
      "content": "**Goal:** Does any subset sum to target \`S\`? (True/False answer)\\n\\n**State:** \`dp[i][s]\` = True if some subset of first \`i\` items sums to \`s\`\\n\\n**Recurrence:**\\n\`\`\`\\nif nums[i] > s:\\n    dp[i][s] = dp[i-1][s]\\nelse:\\n    dp[i][s] = dp[i-1][s] or dp[i-1][s - nums[i]]\\n\`\`\`\\n\\n**Key distinction:** Uses \`OR\` — we only care whether any path exists, not how many. This is the boolean skeleton all other variants build on."
    },
    {
      "label": "Equal Partition",
      "icon": "⚖️",
      "content": "**Goal:** Split the array into two subsets with equal sums.\\n\\n**Reduction steps:**\\n1. Compute \`total = sum(nums)\`\\n2. If \`total\` is odd → return \`False\` immediately (impossible)\\n3. Otherwise: run Subset Sum with \`target = total // 2\`\\n\\n**Why it works:** If S1 + S2 = total and S1 = S2, then both equal \`total / 2\`.\\n\\nThis problem is Subset Sum in disguise — the insight is just recognizing the transformation."
    },
    {
      "label": "Min Subset Diff",
      "icon": "📉",
      "content": "**Goal:** Partition into two subsets to minimize \`|S1 - S2|\`.\\n\\n**Key insight:** \`|S1 - S2| = |total - 2·S1|\`. Minimize by making S1 as close to \`total / 2\` as possible.\\n\\n**Steps:**\\n1. Fill a boolean DP table for all achievable sums up to \`total // 2\`\\n2. Find the largest \`s ≤ total // 2\` where \`dp[s]\` is True\\n3. Answer = \`total - 2·s\`\\n\\n**Extends Subset Sum:** instead of asking if \`total/2\` is reachable, find the *closest* reachable value."
    },
    {
      "label": "Count Subsets",
      "icon": "🔢",
      "content": "**Goal:** Count how many distinct subsets sum to target \`S\`.\\n\\n**State:** \`dp[i][s]\` = number of subsets of first \`i\` items that sum to \`s\`\\n\\n**Recurrence:**\\n\`\`\`\\nif nums[i] > s:\\n    dp[i][s] = dp[i-1][s]\\nelse:\\n    dp[i][s] = dp[i-1][s] + dp[i-1][s - nums[i]]\\n\`\`\`\\n\\n**Critical shift:** Replace \`OR\` with \`+\`. Every valid path contributes 1 to the count — we accumulate all ways rather than just checking existence."
    }
  ]
}
\`\`\`

---

### Recurrence in Action

Watch the 0/1 Knapsack DP table fill row by row. Items: Book (val=4, wt=3), Pen (val=5, wt=1), Lamp (val=3, wt=2). Capacity W=4.

\`\`\`trace
{
  "title": "0/1 Knapsack — DP Table Fill",
  "language": "python",
  "code": "items = [(4, 3), (5, 1), (3, 2)]  # (val, wt)\\nW = 4\\ndp = [[0] * (W + 1) for _ in range(len(items) + 1)]\\n\\nfor i in range(1, len(items) + 1):\\n    val, wt = items[i - 1]\\n    for c in range(W + 1):\\n        if wt > c:\\n            dp[i][c] = dp[i-1][c]\\n        else:\\n            dp[i][c] = max(dp[i-1][c], val + dp[i-1][c - wt])\\n\\nprint(dp[len(items)][W])  # 9",
  "frames": [
    { "line": 3, "vars": { "dp": "4x5 zeros" }, "note": "Base case: 0 items or 0 capacity → max value = 0" },
    { "line": 6, "vars": { "i": 1, "val": 4, "wt": 3 }, "note": "Row 1 — processing Book (val=4, wt=3)" },
    { "line": 9, "vars": { "i": 1, "c": 2, "dp[1][2]": 0 }, "note": "c=2 < wt=3: can't fit Book — copy 0 from row above" },
    { "line": 11, "vars": { "i": 1, "c": 3, "dp[1][3]": 4 }, "note": "c=3 = wt: max(dp[0][3]=0, 4 + dp[0][0]=4) = 4 ✓" },
    { "line": 11, "vars": { "i": 1, "c": 4, "dp[1][4]": 4 }, "note": "c=4 > wt: max(dp[0][4]=0, 4 + dp[0][1]=4) = 4" },
    { "line": 6, "vars": { "i": 2, "val": 5, "wt": 1 }, "note": "Row 2 — processing Pen (val=5, wt=1)" },
    { "line": 11, "vars": { "i": 2, "c": 1, "dp[2][1]": 5 }, "note": "max(dp[1][1]=0, 5 + dp[1][0]=5) = 5 ✓" },
    { "line": 11, "vars": { "i": 2, "c": 4, "dp[2][4]": 9 }, "note": "max(dp[1][4]=4, 5 + dp[1][3]=9) = 9 — Pen + Book!" },
    { "line": 6, "vars": { "i": 3, "val": 3, "wt": 2 }, "note": "Row 3 — processing Lamp (val=3, wt=2)" },
    { "line": 11, "vars": { "i": 3, "c": 3, "dp[3][3]": 8 }, "note": "max(dp[2][3]=5, 3 + dp[2][1]=8) = 8 — Lamp + Pen" },
    { "line": 11, "vars": { "i": 3, "c": 4, "dp[3][4]": 9 }, "note": "max(dp[2][4]=9, 3 + dp[2][2]=8) = 9 — Pen+Book still best" },
    { "line": 13, "vars": {}, "stdout": "9", "note": "Final answer: max value = 9 (Pen + Book, total weight = 1+3 = 4)" }
  ],
  "speed": 900
}
\`\`\`

---

### The Space Optimization Explained

\`\`\`collapse
{
  "title": "Deep Dive: Why Right-to-Left in 1D Knapsack",
  "content": "Compressing \`dp[i][c]\` into a single array \`dp[c]\` cuts space from O(n·W) to O(W). But the iteration direction is non-negotiable.\\n\\n**The danger with left-to-right:**\\n\`\`\`python\\n# WRONG for 0/1 Knapsack\\nfor c in range(wt, W + 1):  # small c overwritten first\\n    dp[c] = max(dp[c], val + dp[c - wt])  # dp[c-wt] already updated this round!\\n\`\`\`\\nWhen we compute \`dp[c]\`, the value \`dp[c - wt]\` has already been updated with the current item. That means we're reading a state where the item was already picked — allowing the same item twice. This silently converts 0/1 Knapsack into Unbounded Knapsack.\\n\\n**Right-to-left preserves the 0/1 constraint:**\\n\`\`\`python\\n# CORRECT for 0/1 Knapsack\\nfor c in range(W, wt - 1, -1):  # large c first\\n    dp[c] = max(dp[c], val + dp[c - wt])  # dp[c-wt] still from previous item's row\\n\`\`\`\\nBy processing larger capacities first, when we reach \`dp[c - wt]\` it hasn't been touched this round — it still holds the value from the *previous item's* computation.\\n\\n**Mnemonic:** Right-to-left = read before you write. You always consume the old value before overwriting it.\\n\\n**Note:** For Unbounded Knapsack (where items can be reused), left-to-right is actually correct for the same reason — you *want* to reuse the updated state."
}
\`\`\`

---

### Checkpoint Quiz

\`\`\`quiz
{
  "title": "Dynamic Programming Checkpoint",
  "questions": [
    {
      "question": "What two properties must a problem have for Dynamic Programming to apply?",
      "options": [
        "Sorting and binary search",
        "Overlapping subproblems and optimal substructure",
        "Recursion and iteration",
        "Arrays and hash maps"
      ],
      "answer": 1,
      "explanation": "DP requires both overlapping subproblems (the same subproblems recur many times, so caching pays off) and optimal substructure (the optimal solution is composed of optimal solutions to subproblems). Greedy algorithms also have optimal substructure but do NOT have overlapping subproblems — that's a key distinction."
    },
    {
      "question": "In the 0/1 Knapsack DP table, what does dp[i][c] represent?",
      "options": [
        "Whether item i fits in capacity c",
        "The weight of item i",
        "Maximum value achievable using the first i items with capacity c",
        "The number of ways to fill exactly capacity c with i items"
      ],
      "answer": 2,
      "explanation": "dp[i][c] = the maximum value achievable by choosing from the first i items with a weight limit of c. This state definition is the foundation of the solution — every DP problem requires you to define precisely what the table cell stores before you can write the recurrence."
    },
    {
      "question": "For Equal Subset Sum Partition, what check must come BEFORE running any DP?",
      "options": [
        "Check if all numbers are even",
        "Check if the total sum is even",
        "Check if the array length is even",
        "Check if any single element equals the total sum"
      ],
      "answer": 1,
      "explanation": "If the total sum is odd, it's mathematically impossible to split it into two equal integer halves — return false immediately. This O(n) early exit avoids running an O(n·S) DP on an impossible input and is expected in any complete interview answer."
    },
    {
      "question": "In the space-optimized 1D 0/1 Knapsack, in which direction must you iterate over capacity?",
      "options": [
        "Left-to-right (0 to W)",
        "Right-to-left (W down to wt)",
        "Either direction gives the same result",
        "1D optimization is impossible — a 2D table is always required"
      ],
      "answer": 1,
      "explanation": "Right-to-left (W down to the item's weight). Left-to-right would cause dp[c - wt] to already be updated with the current item when we read it, allowing the item to be picked multiple times. Going right-to-left guarantees dp[c - wt] still holds its value from the previous item's row when we read it."
    },
    {
      "question": "In Count of Subset Sum, what operation replaces the boolean OR used in plain Subset Sum?",
      "options": [
        "AND — accumulate only matching subsets",
        "MAX — keep the highest count path",
        "Addition (+) — sum all valid paths",
        "MIN — find the minimum number of subsets needed"
      ],
      "answer": 2,
      "explanation": "Addition (+). In Subset Sum, dp[s] is True if ANY path reaches s. In Count of Subset Sum, dp[s] counts HOW MANY distinct paths reach s — replacing OR with + accumulates every valid way. This seemingly small operator change transforms a reachability problem into a counting problem."
    }
  ]
}
\`\`\`

---

### Voice Summary

<!-- voice:checkpoint_voice_prompt -->

Your coach will ask you to explain:

1. **The 0/1 Knapsack recurrence** — both the "pick" and "skip" branches, and what each cell in the DP table represents
2. **How Equal Subset Sum reduces to Subset Sum** — the transformation step and why an odd total sum is an immediate no
3. **Why we iterate right-to-left** in the space-optimized version — and what silently breaks if you go left-to-right
4. **How Count of Subset Sum differs from plain Subset Sum** — the operator change and what it means for what the table stores

\`\`\`callout
{
  "type": "success",
  "title": "You're mastering Dynamic Programming!",
  "content": "DP is the pattern that separates strong candidates from exceptional ones in coding interviews. The ability to define a clear state, write a correct recurrence, and optimize space puts you in the top tier. Review any variant that felt shaky, then move on to the next module."
}
\`\`\``,
    },
  ],
};
