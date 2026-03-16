import { Module } from "../types";

export const mcmModule: Module = {
  id: "mcm-pattern",
  title: "Matrix Chain Multiplication Pattern",
  description:
    "Learn the interval DP pattern through matrix chain multiplication and related partition problems.",
  lessons: [
    {
      id: "mcm-intro",
      slug: "mcm-pattern-intro",
      title: "Introduction to the MCM Pattern",
      content: `## The Matrix Chain Multiplication Pattern

The **MCM pattern** (also called **interval DP** or **partition DP**) applies to problems where you must find the optimal way to **split a range into two parts**, recursively solving each part and combining results.

### When to Recognize This Pattern

- You need to find the optimal way to **partition** or **merge** a sequence.
- The cost depends on **where you split**.
- The subproblems are **contiguous ranges** of the input.

### The Template

\`\`\`python
# dp[i][j] = optimal cost for the range [i, j]
for length in range(2, n + 1):
    for i in range(n - length + 1):
        j = i + length - 1
        dp[i][j] = float('inf')
        for k in range(i, j):  # try all split points
            cost = dp[i][k] + dp[k+1][j] + combine_cost(i, k, j)
            dp[i][j] = min(dp[i][j], cost)
\`\`\`

### Key Insight

Unlike other DP patterns where subproblems are defined by one index, MCM subproblems are defined by **two indices** (start and end of a range). This leads to O(n³) solutions.

### Problems in This Module

1. **Matrix Chain Multiplication** — minimize multiplication cost
2. **Burst Balloons** — maximize coins from bursting balloons
3. **Minimum Cost to Merge Stones** — merge piles optimally
4. **Boolean Parenthesization** — count ways to parenthesize for True`,
    },
    {
      id: "mcm-classic",
      slug: "matrix-chain-multiplication",
      title: "Matrix Chain Multiplication",
      content: `## Matrix Chain Multiplication

### Problem Statement

Given a chain of matrices with dimensions \`dims\` (where matrix \`i\` has dimensions \`dims[i-1] × dims[i]\`), find the **minimum number of scalar multiplications** needed to compute the product.

### Examples

\`\`\`
Input:  dims = [1, 2, 3, 4]
(Matrices: 1×2, 2×3, 3×4)
Output: 18
Explanation: (A1×A2)×A3 costs 1*2*3 + 1*3*4 = 6 + 12 = 18
\`\`\`

\`\`\`
Input:  dims = [10, 30, 5, 60]
Output: 4500
Explanation: A1×(A2×A3) costs 30*5*60 + 10*30*60 = 9000+18000=27000
             (A1×A2)×A3 costs 10*30*5 + 10*5*60 = 1500+3000=4500 ✓
\`\`\`

### Approach

\`dp[i][j]\` = min cost to multiply matrices \`i\` through \`j\`.
Try every split point \`k\` between \`i\` and \`j\`:
\`\`\`
dp[i][j] = min(dp[i][k] + dp[k+1][j] + dims[i-1]*dims[k]*dims[j])
\`\`\`

### Complexity

- **Time:** O(n³)
- **Space:** O(n²)`,
      starterCode: `def mcm(dims):
    # TODO: find minimum multiplication cost
    pass

# Test cases
print(mcm([1, 2, 3, 4]))       # Expected: 18
print(mcm([10, 30, 5, 60]))    # Expected: 4500
print(mcm([40, 20, 30, 10, 30]))  # Expected: 26000
`,
      solutionCode: `def mcm(dims):
    n = len(dims) - 1  # number of matrices
    dp = [[0] * n for _ in range(n)]

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1]
                dp[i][j] = min(dp[i][j], cost)

    return dp[0][n - 1]

# Test cases
print(mcm([1, 2, 3, 4]))       # Expected: 18
print(mcm([10, 30, 5, 60]))    # Expected: 4500
print(mcm([40, 20, 30, 10, 30]))  # Expected: 26000
`,
    },
    {
      id: "mcm-burst-balloons",
      slug: "burst-balloons",
      title: "Burst Balloons",
      content: `## Burst Balloons

### Problem Statement

Given \`n\` balloons with numbers on them, bursting balloon \`i\` earns \`nums[i-1] × nums[i] × nums[i+1]\` coins. After bursting, the adjacent balloons become neighbors. Find the **maximum coins** collectible.

### Examples

\`\`\`
Input:  [3, 1, 5, 8]
Output: 167
Explanation: Burst order: 1→5→3→8
  Burst 1: 3×1×5 = 15
  Burst 5: 3×5×8 = 120
  Burst 3: 1×3×8 = 24
  Burst 8: 1×8×1 = 8
  Total = 167
\`\`\`

### Approach — Reverse Thinking

Instead of thinking about which balloon to burst **first**, think about which to burst **last** in a range:
- \`dp[i][j]\` = max coins from bursting all balloons between \`i\` and \`j\` (exclusive)
- For each \`k\` in \`(i, j)\`, if balloon \`k\` is burst last:
  \`dp[i][j] = max(dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j])\`

Pad the array with 1s at both ends.

### Complexity

- **Time:** O(n³)
- **Space:** O(n²)`,
      starterCode: `def max_coins(nums):
    # TODO: find maximum coins from bursting balloons
    pass

# Test cases
print(max_coins([3, 1, 5, 8]))  # Expected: 167
print(max_coins([1, 5]))        # Expected: 10
`,
      solutionCode: `def max_coins(nums):
    # Pad with 1s
    balls = [1] + nums + [1]
    n = len(balls)
    dp = [[0] * n for _ in range(n)]

    for length in range(2, n):
        for i in range(n - length):
            j = i + length
            for k in range(i + 1, j):
                coins = balls[i] * balls[k] * balls[j]
                dp[i][j] = max(dp[i][j], dp[i][k] + dp[k][j] + coins)

    return dp[0][n - 1]

# Test cases
print(max_coins([3, 1, 5, 8]))  # Expected: 167
print(max_coins([1, 5]))        # Expected: 10
`,
    },
    {
      id: "mcm-merge-stones",
      slug: "minimum-cost-merge-stones",
      title: "Minimum Cost to Merge Stones",
      content: `## Minimum Cost to Merge Stones

### Problem Statement

There are \`n\` piles of stones in a row. Each turn, you merge **2 adjacent piles** into one. The cost of a merge is the **total number of stones** in the two piles. Find the **minimum total cost** to merge all piles into one.

### Examples

\`\`\`
Input:  [4, 1, 3, 2]
Output: 20
Explanation:
  Merge [1,3] → cost 4, piles = [4, 4, 2]
  Merge [4,2] → cost 6, piles = [4, 6]
  Merge [4,6] → cost 10, piles = [10]
  Total = 4 + 6 + 10 = 20
\`\`\`

### Approach

Use interval DP with prefix sums:
- \`dp[i][j]\` = min cost to merge piles \`i..j\` into one
- Try all split points: \`dp[i][j] = min(dp[i][k] + dp[k+1][j]) + sum(i..j)\`
- The \`sum(i..j)\` term is always added because the final merge always costs the total.

### Complexity

- **Time:** O(n³)
- **Space:** O(n²)`,
      starterCode: `def merge_stones(stones):
    # TODO: find minimum cost to merge all piles
    pass

# Test cases
print(merge_stones([4, 1, 3, 2]))    # Expected: 20
print(merge_stones([1, 2, 3, 4]))    # Expected: 19
print(merge_stones([3, 5]))           # Expected: 8
`,
      solutionCode: `def merge_stones(stones):
    n = len(stones)
    if n == 1:
        return 0

    # Prefix sums for range sum queries
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stones[i]

    dp = [[0] * n for _ in range(n)]

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            range_sum = prefix[j + 1] - prefix[i]
            for k in range(i, j):
                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k + 1][j] + range_sum)

    return dp[0][n - 1]

# Test cases
print(merge_stones([4, 1, 3, 2]))    # Expected: 20
print(merge_stones([1, 2, 3, 4]))    # Expected: 19
print(merge_stones([3, 5]))           # Expected: 8
`,
    },
    {
      id: "mcm-boolean-parenthesization",
      slug: "boolean-parenthesization",
      title: "Boolean Parenthesization",
      content: `## Boolean Parenthesization

### Problem Statement

Given a boolean expression with symbols \`T\` (True) and \`F\` (False), and operators \`&\` (AND), \`|\` (OR), \`^\` (XOR), count the number of ways to **parenthesize** the expression so that it evaluates to **True**.

### Examples

\`\`\`
Input:  symbols = "TFT", operators = "|&"
Output: 1
Explanation: Only (T|F)&T = T
\`\`\`

\`\`\`
Input:  symbols = "TTFT", operators = "|&^"
Output: 4
\`\`\`

### Approach

Use interval DP with two tables:
- \`true_dp[i][j]\` = ways to get True from symbols \`i..j\`
- \`false_dp[i][j]\` = ways to get False from symbols \`i..j\`

For each operator \`k\` between \`i\` and \`j\`, combine left and right counts using the operator's truth table.

### Complexity

- **Time:** O(n³)
- **Space:** O(n²)`,
      starterCode: `def count_eval(symbols, operators):
    # TODO: count ways to parenthesize for True
    pass

# Test cases
print(count_eval("TFT", "|&"))     # Expected: 1
print(count_eval("TTFT", "|&^"))   # Expected: 4
print(count_eval("TF", "^"))       # Expected: 1
`,
      solutionCode: `def count_eval(symbols, operators):
    n = len(symbols)
    true_dp = [[0] * n for _ in range(n)]
    false_dp = [[0] * n for _ in range(n)]

    # Base case: single symbols
    for i in range(n):
        true_dp[i][i] = 1 if symbols[i] == 'T' else 0
        false_dp[i][i] = 1 if symbols[i] == 'F' else 0

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            for k in range(i, j):
                op = operators[k]
                lt, lf = true_dp[i][k], false_dp[i][k]
                rt, rf = true_dp[k + 1][j], false_dp[k + 1][j]

                if op == '&':
                    true_dp[i][j] += lt * rt
                    false_dp[i][j] += lt * rf + lf * rt + lf * rf
                elif op == '|':
                    true_dp[i][j] += lt * rt + lt * rf + lf * rt
                    false_dp[i][j] += lf * rf
                elif op == '^':
                    true_dp[i][j] += lt * rf + lf * rt
                    false_dp[i][j] += lt * rt + lf * rf

    return true_dp[0][n - 1]

# Test cases
print(count_eval("TFT", "|&"))     # Expected: 1
print(count_eval("TTFT", "|&^"))   # Expected: 4
print(count_eval("TF", "^"))       # Expected: 1
`,
    },
  ],
};
