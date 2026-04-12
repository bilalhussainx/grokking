import { Module } from "../types";

export const knapsackModule: Module = {
  id: "knapsack-pattern",
  title: "0/1 Knapsack Pattern",
  description: "Learn the 0/1 Knapsack pattern and apply it to subset selection problems where each item can be included or excluded.",
  lessons: [
    {
      id: "knapsack-intro",
      slug: "knapsack-intro",
      title: "Introduction to 0/1 Knapsack",
      content: `## New to Dynamic Programming? Start Here!

### What is Dynamic Programming?

**Dynamic programming (DP)** is a problem-solving technique where you break a big problem into smaller overlapping pieces, solve each piece once, and save the results so you never redo the same work. That is the entire idea.

Here is a real-world analogy. Imagine you are packing a backpack for a hike, and you can only carry 10 kg. You have a tent (4 kg, very useful), a book (1 kg, nice to have), food (3 kg, essential), and a guitar (5 kg, fun but heavy). You cannot take everything, so you need to figure out the best combination that fits within your weight limit and gives you the most value. That is exactly the kind of problem dynamic programming solves.

Instead of trying every possible combination from scratch (which gets very slow as you add more items), DP builds up the answer step by step, reusing work it has already done.

### A Quick Note on Big-O Notation

Throughout this course, you will see notation like **O(n)** or **O(n x C)**. This is called **Big-O notation**, and it describes how the running time or memory usage of an algorithm grows as the input gets larger.

- **O(1)** means constant time -- no matter how big the input, it takes the same amount of time (like looking up a value by index in a list).
- **O(n)** means linear time -- if you double the input size, the time roughly doubles (like scanning through a list once).
- **O(n^2)** means quadratic time -- if you double the input, the time roughly quadruples (like comparing every pair in a list).
- **O(n x C)** means the time depends on two things: the number of items (n) and the capacity (C).

You do not need to master Big-O right now. Just think of it as a shorthand for "how fast does this get slower as the problem gets bigger?"

### Visual Walkthrough: How the 2D Table Works

Before we dive into formulas, let us see how DP actually works with a tiny example. Suppose you have 3 items and a backpack that holds 4 kg:

\`\`\`
Item 1: weight = 1 kg, profit = $2
Item 2: weight = 2 kg, profit = $3
Item 3: weight = 3 kg, profit = $4
Capacity: 4 kg
\`\`\`

We build a table where rows represent "how many items we are considering" and columns represent "how much capacity we have left." Each cell answers: "What is the best profit I can get with these items and this capacity?"

\`\`\`
            Capacity -->
            0    1    2    3    4
          +----+----+----+----+----+
0 items   |  0 |  0 |  0 |  0 |  0 |   (no items = no profit)
          +----+----+----+----+----+
Item 1    |  0 |  2 |  2 |  2 |  2 |   (only item 1 available)
(w=1,p=2) +----+----+----+----+----+
Item 2    |  0 |  2 |  3 |  5 |  5 |   (items 1 and 2 available)
(w=2,p=3) +----+----+----+----+----+
Item 3    |  0 |  2 |  3 |  5 |  6 |   (all 3 items available)
(w=3,p=4) +----+----+----+----+----+
                                 ^
                          Answer: $6
                    (take items 1 + 3: weight = 4, profit = 2 + 4 = 6)
\`\`\`

**How to read it:** Look at the cell for Item 3, capacity 4. We ask: "Should I include item 3 (weight 3, profit $4)?" If yes, we use 3 kg of capacity and gain $4, plus whatever the best was for the remaining 1 kg using items 1-2 (which is $2). So including gives $4 + $2 = $6. If we skip item 3, we keep the best from items 1-2 at capacity 4, which is $5. Since $6 > $5, we include item 3.

That is the entire logic of DP: at each step, decide "include or skip?" and pick the better option.

### Key Vocabulary

Before we continue, here are a few terms that will appear throughout:

- **Subproblem**: A smaller version of the original problem (e.g., "best profit using only the first 2 items with capacity 3").
- **Recurrence relation**: A formula that defines each subproblem in terms of even smaller subproblems.
- **Memoization**: Saving (caching) the results of subproblems so you do not solve them again. Think of it like writing answers on sticky notes.
- **Tabulation**: Filling in a table from the bottom up instead of using recursion. This is the approach shown in the visual above.
- **Base case**: The simplest subproblem that you can answer directly without further work (e.g., "0 items = 0 profit").

---

## The 0/1 Knapsack Pattern

The **0/1 Knapsack** is one of the most fundamental dynamic programming patterns. It models problems where you must choose a subset of items (each used at most once) to maximize or minimize some objective, subject to a capacity constraint.

### Decision Tree for 0/1 Knapsack

\`\`\`mermaid
graph TD
    R["Item 1: Include?"] -->|Yes| A["Remaining capacity - w1"]
    R -->|No| B["Remaining capacity unchanged"]
    A --> C["Item 2: Include?"]
    B --> D["Item 2: Include?"]
    C -->|Yes| E["Subproblem: fewer items, less capacity"]
    C -->|No| F["Subproblem: fewer items, same capacity"]
    D -->|Yes| G["Subproblem: fewer items, less capacity"]
    D -->|No| H["Subproblem: fewer items, same capacity"]
    style R fill:#6366f1,color:#fff
    style A fill:#4ade80
    style B fill:#f59e0b
\`\`\`

### When to Recognize This Pattern

Look for these signals:
- You have a **set of items**, each with a value and a cost/weight.
- Each item can be **included or excluded** (no fractions — hence "0/1").
- There is a **constraint** (capacity, budget, target sum) you must respect.
- You want to **maximize value**, **minimize cost**, or **count combinations**.

### The Template

Almost every 0/1 Knapsack problem can be solved with this recurrence:

\`\`\`
dp[i][c] = max(
    dp[i-1][c],                        # exclude item i
    profit[i] + dp[i-1][c - weight[i]]  # include item i
)
\`\`\`

**Base cases:** \`dp[0][c] = 0\` for all \`c\`, and \`dp[i][0] = 0\` for all \`i\`.

### Two Approaches

| Approach | Description | Pros |
|----------|-------------|------|
| **Top-Down (Memoization)** | Recursion + cache | Easier to write, only solves needed subproblems |
| **Bottom-Up (Tabulation)** | Fill a 2D table iteratively | No recursion overhead, easier to optimize space |

### Space Optimization

Since each row only depends on the previous row, you can reduce space from O(n×C) to O(C) by using a single 1D array and iterating capacity **in reverse**:

\`\`\`python
dp = [0] * (capacity + 1)
for i in range(n):
    for c in range(capacity, weights[i] - 1, -1):
        dp[c] = max(dp[c], profits[i] + dp[c - weights[i]])
\`\`\`

### Problems in This Module

1. **0/1 Knapsack** — the classic problem
2. **Equal Subset Sum Partition** — can you split an array into two equal-sum halves?
3. **Subset Sum** — does a subset exist that sums to a target?
4. **Minimum Subset Sum Difference** — minimize the difference between two subset sums
5. **Count of Subset Sum** — how many subsets sum to a target?

### Recommended Resources

If you are new to dynamic programming, these resources are excellent starting points:

- [Reducible: "What is Dynamic Programming?" (YouTube)](https://www.youtube.com/watch?v=oBt53YbR9Kk) -- A beginner-friendly visual explanation of DP concepts.
- [3Blue1Brown (YouTube)](https://www.youtube.com/c/3blue1brown) -- Beautiful math visualizations that build intuition for algorithmic thinking.
- [NeetCode: Dynamic Programming playlist (YouTube)](https://www.youtube.com/playlist?list=PLot-Xpze53lcvx_yhUmAFcDiGawJvdkR8) -- Step-by-step walkthroughs of common DP problems.
- [FreeCodeCamp: Dynamic Programming for Beginners](https://www.freecodecamp.org/news/demystifying-dynamic-programming-24fbdb831d3a/) -- A written tutorial that starts from zero.`,
    },
    {
      id: "knapsack-classic",
      slug: "knapsack-classic",
      title: "0/1 Knapsack",
      content: `## 0/1 Knapsack

### Problem Statement

Given two arrays \`profits\` and \`weights\` of length \`n\`, and an integer \`capacity\`, find the **maximum profit** achievable by selecting items such that the total weight does not exceed \`capacity\`. Each item can be selected **at most once**.

### Examples

\`\`\`
Input:  profits = [1, 6, 10, 16], weights = [1, 2, 3, 5], capacity = 7
Output: 22
Explanation: Select items with weights 2 and 5 → profits 6 + 16 = 22
\`\`\`

\`\`\`
Input:  profits = [1, 6, 10, 16], weights = [1, 2, 3, 5], capacity = 6
Output: 17
Explanation: Select items with weights 1 and 5 → profits 1 + 16 = 17
\`\`\`

### Approach

1. Create a 2D table \`dp[i][c]\` = max profit using items \`0..i-1\` with capacity \`c\`.
2. For each item, decide: include it (if it fits) or exclude it.
3. Take the maximum of both choices.

### Recurrence

\`\`\`
dp[i][c] = max(dp[i-1][c], profits[i-1] + dp[i-1][c - weights[i-1]])
\`\`\`

### Complexity

- **Time:** O(n × capacity)
- **Space:** O(n × capacity), reducible to O(capacity)`,
      starterCode: `def solve_knapsack(profits, weights, capacity):
    # TODO: implement using dynamic programming (bottom-up)
    pass

# Test cases
print(solve_knapsack([1, 6, 10, 16], [1, 2, 3, 5], 7))   # Expected: 22
print(solve_knapsack([1, 6, 10, 16], [1, 2, 3, 5], 6))   # Expected: 17
print(solve_knapsack([1, 2, 3], [1, 1, 1], 2))            # Expected: 5
`,
      solutionCode: `def solve_knapsack(profits, weights, capacity):
    n = len(profits)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for c in range(1, capacity + 1):
            # Exclude item i
            dp[i][c] = dp[i - 1][c]
            # Include item i (if it fits)
            if weights[i - 1] <= c:
                dp[i][c] = max(dp[i][c], profits[i - 1] + dp[i - 1][c - weights[i - 1]])

    return dp[n][capacity]

# Test cases
print(solve_knapsack([1, 6, 10, 16], [1, 2, 3, 5], 7))   # Expected: 22
print(solve_knapsack([1, 6, 10, 16], [1, 2, 3, 5], 6))   # Expected: 17
print(solve_knapsack([1, 2, 3], [1, 1, 1], 2))            # Expected: 5
`,
    },
    {
      id: "knapsack-equal-partition",
      slug: "equal-subset-sum-partition",
      title: "Equal Subset Sum Partition",
      content: `## Equal Subset Sum Partition

### Problem Statement

Given an array of positive integers \`nums\`, determine if it can be partitioned into **two subsets** with **equal sum**.

### Examples

\`\`\`
Input:  [1, 5, 11, 5]
Output: True
Explanation: [1, 5, 5] and [11] both sum to 11
\`\`\`

\`\`\`
Input:  [1, 2, 3, 5]
Output: False
Explanation: No way to split into two equal-sum subsets
\`\`\`

### Approach

1. If total sum is **odd**, return False immediately.
2. Otherwise, the problem reduces to: can we find a subset that sums to \`total // 2\`?
3. This is a **Subset Sum** problem — a direct application of 0/1 Knapsack.

### Recurrence

\`\`\`
dp[i][s] = dp[i-1][s] OR dp[i-1][s - nums[i-1]]
\`\`\`

\`dp[i][s]\` is True if we can form sum \`s\` using items \`0..i-1\`.

### Complexity

- **Time:** O(n × sum/2)
- **Space:** O(sum/2) with 1D optimization`,
      starterCode: `def can_partition(nums):
    # TODO: implement using 0/1 knapsack pattern
    pass

# Test cases
print(can_partition([1, 5, 11, 5]))   # Expected: True
print(can_partition([1, 2, 3, 5]))    # Expected: False
print(can_partition([1, 1, 1, 1]))    # Expected: True
`,
      solutionCode: `def can_partition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False

    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True

    for num in nums:
        # Traverse in reverse to avoid using the same item twice
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]

    return dp[target]

# Test cases
print(can_partition([1, 5, 11, 5]))   # Expected: True
print(can_partition([1, 2, 3, 5]))    # Expected: False
print(can_partition([1, 1, 1, 1]))    # Expected: True
`,
    },
    {
      id: "knapsack-subset-sum",
      slug: "subset-sum",
      title: "Subset Sum",
      content: `## Subset Sum

### Problem Statement

Given an array of non-negative integers \`nums\` and an integer \`target\`, determine if there exists a **subset** whose elements sum to \`target\`.

### Examples

\`\`\`
Input:  nums = [1, 2, 3, 7], target = 6
Output: True
Explanation: Subset [1, 2, 3] sums to 6
\`\`\`

\`\`\`
Input:  nums = [1, 2, 7, 1, 5], target = 10
Output: True
Explanation: Subset [2, 7, 1] sums to 10
\`\`\`

\`\`\`
Input:  nums = [1, 3, 4, 8], target = 6
Output: False
\`\`\`

### Approach

This is the boolean variant of 0/1 Knapsack:
- **Items** = the numbers in the array
- **Capacity** = the target sum
- Instead of maximizing profit, we check if we can **exactly fill** the capacity

### Recurrence

\`\`\`
dp[s] = dp[s] OR dp[s - nums[i]]
\`\`\`

### Complexity

- **Time:** O(n × target)
- **Space:** O(target) with 1D optimization`,
      starterCode: `def subset_sum(nums, target):
    # TODO: implement using 0/1 knapsack pattern
    pass

# Test cases
print(subset_sum([1, 2, 3, 7], 6))      # Expected: True
print(subset_sum([1, 2, 7, 1, 5], 10))  # Expected: True
print(subset_sum([1, 3, 4, 8], 6))      # Expected: False
`,
      solutionCode: `def subset_sum(nums, target):
    dp = [False] * (target + 1)
    dp[0] = True

    for num in nums:
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]

    return dp[target]

# Test cases
print(subset_sum([1, 2, 3, 7], 6))      # Expected: True
print(subset_sum([1, 2, 7, 1, 5], 10))  # Expected: True
print(subset_sum([1, 3, 4, 8], 6))      # Expected: False
`,
    },
    {
      id: "knapsack-min-subset-diff",
      slug: "minimum-subset-sum-difference",
      title: "Minimum Subset Sum Difference",
      content: `## Minimum Subset Sum Difference

### Problem Statement

Given an array of positive integers, partition it into two subsets such that the **absolute difference** of their sums is **minimized**. Return that minimum difference.

### Examples

\`\`\`
Input:  [1, 6, 11, 5]
Output: 1
Explanation: Subsets [1, 5, 6] (sum=12) and [11] (sum=11) → diff = 1
\`\`\`

\`\`\`
Input:  [1, 2, 3, 9]
Output: 3
Explanation: Subsets [1, 2, 3] (sum=6) and [9] (sum=9) → diff = 3
\`\`\`

### Approach

1. Let \`S\` = total sum of all elements.
2. We want to find the largest sum \`s1 ≤ S/2\` achievable by a subset.
3. The other subset has sum \`s2 = S - s1\`.
4. Minimum difference = \`S - 2 * s1\`.
5. Use the Subset Sum approach to find all achievable sums up to \`S/2\`.

### Complexity

- **Time:** O(n × S/2)
- **Space:** O(S/2)`,
      starterCode: `def min_subset_sum_diff(nums):
    # TODO: implement using knapsack to find closest sum to total/2
    pass

# Test cases
print(min_subset_sum_diff([1, 6, 11, 5]))  # Expected: 1
print(min_subset_sum_diff([1, 2, 3, 9]))   # Expected: 3
print(min_subset_sum_diff([1, 2, 3]))       # Expected: 0
`,
      solutionCode: `def min_subset_sum_diff(nums):
    total = sum(nums)
    half = total // 2

    dp = [False] * (half + 1)
    dp[0] = True

    for num in nums:
        for s in range(half, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]

    # Find the largest achievable sum <= half
    for s in range(half, -1, -1):
        if dp[s]:
            return total - 2 * s

# Test cases
print(min_subset_sum_diff([1, 6, 11, 5]))  # Expected: 1
print(min_subset_sum_diff([1, 2, 3, 9]))   # Expected: 3
print(min_subset_sum_diff([1, 2, 3]))       # Expected: 0
`,
    },
    {
      id: "knapsack-count-subset-sum",
      slug: "count-of-subset-sum",
      title: "Count of Subset Sum",
      content: `## Count of Subset Sum

### Problem Statement

Given an array of non-negative integers \`nums\` and a target sum, count the **number of subsets** that sum to the target.

### Examples

\`\`\`
Input:  nums = [1, 1, 2, 3], target = 4
Output: 3
Explanation: {1,3}, {1,3}, {1,1,2} — three subsets sum to 4
\`\`\`

\`\`\`
Input:  nums = [1, 2, 7, 1, 5], target = 9
Output: 3
\`\`\`

### Approach

Instead of a boolean DP (can we reach sum?), use an **integer DP** (how many ways to reach sum?):

\`\`\`
dp[s] += dp[s - nums[i]]
\`\`\`

Initialize \`dp[0] = 1\` (one way to make sum 0: pick nothing).

### Complexity

- **Time:** O(n × target)
- **Space:** O(target)`,
      starterCode: `def count_subsets(nums, target):
    # TODO: implement counting variant of subset sum
    pass

# Test cases
print(count_subsets([1, 1, 2, 3], 4))      # Expected: 3
print(count_subsets([1, 2, 7, 1, 5], 9))   # Expected: 3
print(count_subsets([1, 2, 3], 6))          # Expected: 1
`,
      solutionCode: `def count_subsets(nums, target):
    dp = [0] * (target + 1)
    dp[0] = 1

    for num in nums:
        for s in range(target, num - 1, -1):
            dp[s] += dp[s - num]

    return dp[target]

# Test cases
print(count_subsets([1, 1, 2, 3], 4))      # Expected: 3
print(count_subsets([1, 2, 7, 1, 5], 9))   # Expected: 3
print(count_subsets([1, 2, 3], 6))          # Expected: 1
`,
    },
  ],
};
