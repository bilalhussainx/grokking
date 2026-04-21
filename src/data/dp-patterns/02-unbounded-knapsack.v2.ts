import { Module } from "../types";

export const unboundedKnapsackModule: Module = {
  id: "unbounded-knapsack-pattern",
  title: "Unbounded Knapsack Pattern",
  description: "Learn the Unbounded Knapsack pattern where each item can be selected an unlimited number of times.",
  lessons: [
    {
      id: "unbounded-knapsack-intro",
      slug: "unbounded-knapsack-intro",
      title: "Introduction to Unbounded Knapsack",
      content: `## The Unbounded Knapsack Pattern

In the **0/1 Knapsack**, each item can be used at most once. In the **Unbounded Knapsack**, each item can be selected **unlimited times**. This small change alters the recurrence and the iteration direction.

### Key Difference from 0/1 Knapsack

| Feature | 0/1 Knapsack | Unbounded Knapsack |
|---------|-------------|-------------------|
| Item usage | At most once | Unlimited times |
| 1D iteration | **Reverse** order | **Forward** order |
| Recurrence | \`dp[i-1][c - w]\` | \`dp[i][c - w]\` |

### The Template

\`\`\`python
dp = [0] * (capacity + 1)
for i in range(n):
    for c in range(weights[i], capacity + 1):  # Forward!
        dp[c] = max(dp[c], profits[i] + dp[c - weights[i]])
\`\`\`

The forward iteration means we can re-use item \`i\` multiple times within the same pass.

### When to Recognize This Pattern

- You have items with values and weights/costs.
- Items can be selected **repeatedly**.
- Examples: coin change, rod cutting, buying items with unlimited stock.

### Problems in This Module

1. **Unbounded Knapsack** — maximize profit with unlimited items
2. **Rod Cutting** — cut a rod to maximize revenue
3. **Coin Change** — count ways to make change
4. **Minimum Coin Change** — fewest coins to make a sum
5. **Maximum Ribbon Cut** — maximize pieces of ribbon`,
    },
    {
      id: "unbounded-knapsack-classic",
      slug: "unbounded-knapsack-classic",
      title: "Unbounded Knapsack",
      content: `## Unbounded Knapsack

### Problem Statement

Given arrays \`profits\` and \`weights\`, and an integer \`capacity\`, find the **maximum profit** where each item can be selected **any number of times**.

### Examples

\`\`\`
Input:  profits = [15, 50, 60, 90], weights = [1, 3, 4, 5], capacity = 8
Output: 140
Explanation: Select item with weight 3 (profit 50) + item with weight 5 (profit 90) = 140
\`\`\`

\`\`\`
Input:  profits = [15, 50, 60, 90], weights = [1, 3, 4, 5], capacity = 6
Output: 100
Explanation: Select item with weight 3 twice → 50 + 50 = 100
\`\`\`

### Approach

Same as 0/1 Knapsack but iterate capacity **forward** to allow reusing items.

### Complexity

- **Time:** O(n × capacity)
- **Space:** O(capacity)`,
      starterCode: `def unbounded_knapsack(profits, weights, capacity):
    # TODO: implement unbounded knapsack (items can be reused)
    pass

# Test cases
print(unbounded_knapsack([15, 50, 60, 90], [1, 3, 4, 5], 8))   # Expected: 140
print(unbounded_knapsack([15, 50, 60, 90], [1, 3, 4, 5], 6))   # Expected: 100
`,
      solutionCode: `def unbounded_knapsack(profits, weights, capacity):
    dp = [0] * (capacity + 1)

    for i in range(len(profits)):
        for c in range(weights[i], capacity + 1):
            dp[c] = max(dp[c], profits[i] + dp[c - weights[i]])

    return dp[capacity]

# Test cases
print(unbounded_knapsack([15, 50, 60, 90], [1, 3, 4, 5], 8))   # Expected: 140
print(unbounded_knapsack([15, 50, 60, 90], [1, 3, 4, 5], 6))   # Expected: 100
`,
    },
    {
      id: "unbounded-rod-cutting",
      slug: "rod-cutting",
      title: "Rod Cutting",
      content: `## Rod Cutting

### Problem Statement

Given a rod of length \`n\` and an array \`prices\` where \`prices[i]\` is the price of a rod of length \`i+1\`, determine the **maximum revenue** obtainable by cutting the rod into pieces.

### Examples

\`\`\`
Input:  lengths = [1, 2, 3, 4, 5], prices = [2, 6, 7, 10, 13], rod_length = 5
Output: 14
Explanation: Two pieces of length 2 ($6) + one piece of length 1 ($2) = not optimal.
             Actually: lengths 2+3 → 6+7=13, or 2+2+1 → 6+6+2=14 ✓
\`\`\`

### Approach

This is exactly Unbounded Knapsack where:
- **Items** = rod pieces of different lengths
- **Weights** = piece lengths
- **Profits** = piece prices
- **Capacity** = total rod length

### Complexity

- **Time:** O(n × rod_length)
- **Space:** O(rod_length)`,
      starterCode: `def rod_cutting(lengths, prices, rod_length):
    # TODO: implement using unbounded knapsack pattern
    pass

# Test cases
print(rod_cutting([1, 2, 3, 4, 5], [2, 6, 7, 10, 13], 5))  # Expected: 14
print(rod_cutting([1, 2, 3, 4], [1, 5, 8, 9], 4))           # Expected: 10
`,
      solutionCode: `def rod_cutting(lengths, prices, rod_length):
    dp = [0] * (rod_length + 1)

    for i in range(len(lengths)):
        for l in range(lengths[i], rod_length + 1):
            dp[l] = max(dp[l], prices[i] + dp[l - lengths[i]])

    return dp[rod_length]

# Test cases
print(rod_cutting([1, 2, 3, 4, 5], [2, 6, 7, 10, 13], 5))  # Expected: 14
print(rod_cutting([1, 2, 3, 4], [1, 5, 8, 9], 4))           # Expected: 10
`,
    },
    {
      id: "unbounded-coin-change",
      slug: "coin-change-ways",
      title: "Coin Change (Count Ways)",
      content: `## Coin Change — Count Ways

### Problem Statement

Given an array of coin denominations and a total amount, count the **number of ways** to make change for the amount. You have an **infinite supply** of each coin.

### Examples

\`\`\`
Input:  coins = [1, 2, 5], amount = 5
Output: 4
Explanation: {5}, {2+2+1}, {2+1+1+1}, {1+1+1+1+1}
\`\`\`

\`\`\`
Input:  coins = [1, 2, 3], amount = 4
Output: 4
Explanation: {1+1+1+1}, {1+1+2}, {2+2}, {1+3}
\`\`\`

### Approach

Unbounded Knapsack counting variant:
- \`dp[s]\` = number of ways to make sum \`s\`
- For each coin, iterate forward: \`dp[s] += dp[s - coin]\`
- Process coins in outer loop to avoid counting permutations

### Complexity

- **Time:** O(coins × amount)
- **Space:** O(amount)`,
      starterCode: `def coin_change_ways(coins, amount):
    # TODO: count number of ways to make change
    pass

# Test cases
print(coin_change_ways([1, 2, 5], 5))   # Expected: 4
print(coin_change_ways([1, 2, 3], 4))   # Expected: 4
print(coin_change_ways([2, 5], 3))       # Expected: 0
`,
      solutionCode: `def coin_change_ways(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1  # one way to make 0: use no coins

    for coin in coins:
        for s in range(coin, amount + 1):
            dp[s] += dp[s - coin]

    return dp[amount]

# Test cases
print(coin_change_ways([1, 2, 5], 5))   # Expected: 4
print(coin_change_ways([1, 2, 3], 4))   # Expected: 4
print(coin_change_ways([2, 5], 3))       # Expected: 0
`,
    },
    {
      id: "unbounded-min-coin-change",
      slug: "minimum-coin-change",
      title: "Minimum Coin Change",
      content: `## Minimum Coin Change

### Problem Statement

Given an array of coin denominations and a total amount, find the **fewest number of coins** needed to make the amount. Return \`-1\` if it's not possible.

### Examples

\`\`\`
Input:  coins = [1, 5, 10, 25], amount = 30
Output: 2
Explanation: 25 + 5 = 30
\`\`\`

\`\`\`
Input:  coins = [1, 3, 4], amount = 6
Output: 2
Explanation: 3 + 3 = 6
\`\`\`

\`\`\`
Input:  coins = [2], amount = 3
Output: -1
\`\`\`

### Approach

Unbounded Knapsack minimization variant:
- \`dp[s]\` = minimum coins to make sum \`s\`
- Initialize \`dp[0] = 0\`, all others = infinity
- For each coin: \`dp[s] = min(dp[s], 1 + dp[s - coin])\`

### Complexity

- **Time:** O(coins × amount)
- **Space:** O(amount)`,
      starterCode: `def min_coins(coins, amount):
    # TODO: find minimum number of coins
    pass

# Test cases
print(min_coins([1, 5, 10, 25], 30))  # Expected: 2
print(min_coins([1, 3, 4], 6))        # Expected: 2
print(min_coins([2], 3))               # Expected: -1
`,
      solutionCode: `def min_coins(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for coin in coins:
        for s in range(coin, amount + 1):
            dp[s] = min(dp[s], 1 + dp[s - coin])

    return dp[amount] if dp[amount] != float('inf') else -1

# Test cases
print(min_coins([1, 5, 10, 25], 30))  # Expected: 2
print(min_coins([1, 3, 4], 6))        # Expected: 2
print(min_coins([2], 3))               # Expected: -1
`,
    },
    {
      id: "unbounded-max-ribbon-cut",
      slug: "maximum-ribbon-cut",
      title: "Maximum Ribbon Cut",
      content: `## Maximum Ribbon Cut

### Problem Statement

Given a ribbon of length \`n\` and an array of allowed cut lengths, find the **maximum number of pieces** the ribbon can be cut into. Return \`-1\` if it's not possible to cut the ribbon using the given lengths.

### Examples

\`\`\`
Input:  lengths = [2, 3, 5], total = 5
Output: 2
Explanation: 2 + 3 = 5 (2 pieces)
\`\`\`

\`\`\`
Input:  lengths = [2, 3], total = 7
Output: 3
Explanation: 2 + 2 + 3 = 7 (3 pieces)
\`\`\`

\`\`\`
Input:  lengths = [5, 7], total = 3
Output: -1
\`\`\`

### Approach

Unbounded Knapsack maximization:
- \`dp[l]\` = max pieces for ribbon of length \`l\`
- Initialize \`dp[0] = 0\`, others = \`-inf\`
- For each length: \`dp[l] = max(dp[l], 1 + dp[l - cut])\`

### Complexity

- **Time:** O(cuts × total)
- **Space:** O(total)`,
      starterCode: `def max_ribbon_cut(lengths, total):
    # TODO: find maximum number of ribbon pieces
    pass

# Test cases
print(max_ribbon_cut([2, 3, 5], 5))   # Expected: 2
print(max_ribbon_cut([2, 3], 7))      # Expected: 3
print(max_ribbon_cut([5, 7], 3))      # Expected: -1
`,
      solutionCode: `def max_ribbon_cut(lengths, total):
    dp = [float('-inf')] * (total + 1)
    dp[0] = 0

    for cut in lengths:
        for l in range(cut, total + 1):
            dp[l] = max(dp[l], 1 + dp[l - cut])

    return dp[total] if dp[total] > 0 else -1

# Test cases
print(max_ribbon_cut([2, 3, 5], 5))   # Expected: 2
print(max_ribbon_cut([2, 3], 7))      # Expected: 3
print(max_ribbon_cut([5, 7], 3))      # Expected: -1
`,
    },
  ],
};
