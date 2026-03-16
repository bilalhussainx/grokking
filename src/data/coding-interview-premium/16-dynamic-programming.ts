import { Module } from "../types";

export const dynamicProgrammingModule: Module = {
  id: "dynamic-programming",
  title: "Dynamic Programming",
  description:
    "Master the Dynamic Programming pattern for 0/1 Knapsack and related problems. Learn to solve optimization problems by breaking them down into overlapping subproblems with memoization and tabulation.",
  lessons: [
    {
      id: "dynamic-programming-intro",
      slug: "dynamic-programming-intro",
      title: "Introduction to Dynamic Programming",
      content: `## The Dynamic Programming Pattern

**Dynamic Programming (DP)** is a technique for solving optimization problems by breaking them down into simpler subproblems, solving each subproblem only once, and storing their solutions.

<!-- voice:section_check concept="Dynamic Programming basic concept" -->

### Why Dynamic Programming?

When a problem has:
1. **Overlapping subproblems** — same subproblems solved multiple times
2. **Optimal substructure** — optimal solution contains optimal solutions to subproblems

### Two Approaches

**1. Top-Down (Memoization):**
- Recursive approach
- Store solved subproblems in a table
- Solve on demand

~~~
def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]
~~~

**2. Bottom-Up (Tabulation):**
- Iterative approach
- Build solution from base cases up
- Often more space-efficient

~~~
def fib(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
~~~

<!-- voice:key_insight insight="DP is recursion with a memory — store solutions to avoid recomputing the same subproblems" -->

### 0/1 Knapsack Pattern

The classic 0/1 Knapsack problem forms the basis for many DP problems:
- Given weights and values of items
- Find maximum value with capacity constraint
- Each item can be taken 0 or 1 times

**Recurrence:**
~~~
dp[i][c] = max(
    dp[i-1][c],                    # Skip item i
    values[i] + dp[i-1][c-weights[i]]  # Take item i
)
~~~

### When to Use

- Optimization problems (max/min)
- Problems with constraints (capacity, count)
- Counting problems
- Problems asking "can we achieve X?"

### Complexity

- **Time:** Usually O(n × capacity) or O(n²)
- **Space:** Can often be optimized from O(n × capacity) to O(capacity)`,
    },
    {
      id: "zero-one-knapsack",
      slug: "zero-one-knapsack",
      title: "0/1 Knapsack Problem",
      content: `## 0/1 Knapsack Problem

<!-- voice:section_check concept="Classic DP problem" -->

### Problem Statement

Given two integer arrays \`weights\` and \`values\` representing items, and an integer \`capacity\` representing knapsack capacity, return the maximum value you can achieve without exceeding capacity.

Each item can be selected at most once (0/1 property).

### Examples

~~~
Input: weights = [1, 2, 3], values = [6, 10, 12], capacity = 5
Output: 22
Explanation: Select items with weights 2 and 3 (values 10 + 12 = 22)
~~~

~~~
Input: weights = [1, 3, 4, 5], values = [1, 4, 5, 7], capacity = 7
Output: 9
Explanation: Select items with weights 3 and 4 (values 4 + 5 = 9)
~~~

### Approach

**DP State:** \`dp[i][c]\` = max value using first i items with capacity c

**Recurrence:**
~~~
if weights[i] <= c:
    dp[i][c] = max(dp[i-1][c], values[i] + dp[i-1][c-weights[i]])
else:
    dp[i][c] = dp[i-1][c]  # Can't take this item
~~~

**Space Optimization:** Use 1D array since we only need previous row.

<!-- voice:key_insight insight="For each item, decide: skip it (use value from above) or take it (add value + best of remaining capacity)" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n × capacity) — n items, capacity states
- **Space:** O(capacity) — with space optimization`,
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

### Problem Statement

Given a set of positive numbers, determine if it can be partitioned into two subsets such that the sum of elements in both subsets is equal.

### Examples

~~~
Input: [1, 2, 3, 4]
Output: true
Explanation: Can be partitioned into [1, 4] and [2, 3], both sum to 5
~~~

~~~
Input: [1, 1, 3, 4, 7]
Output: true
Explanation: Can be partitioned into [1, 3, 4] and [1, 7], both sum to 8
~~~

~~~
Input: [2, 3, 4, 6]
Output: false
Explanation: Cannot partition into equal sum subsets
~~~

### Approach

1. Calculate total sum. If odd, return false (can't split equally)
2. Target sum for each subset = total_sum / 2
3. Problem becomes: Can we find a subset with sum = target?
4. This is a variation of 0/1 Knapsack!

**Recurrence:**
~~~
dp[i][s] = can we achieve sum s using first i elements?
dp[i][s] = dp[i-1][s] or dp[i-1][s-nums[i]]
~~~

<!-- voice:key_insight insight="If total sum is even, we just need to find if a subset exists with sum = total/2 — this transforms to knapsack where capacity = total/2" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n × sum) — n elements, sum/2 target
- **Space:** O(sum) — with space optimization`,
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

### Problem Statement

Given a set of positive numbers and a target sum \`S\`, determine if there exists a subset whose sum is equal to \`S\`.

### Examples

~~~
Input: nums = [1, 2, 3, 7], S = 6
Output: true
Explanation: Subset [1, 2, 3] sums to 6
~~~

~~~
Input: nums = [1, 3, 4, 8], S = 6
Output: false
Explanation: No subset sums to 6
~~~

~~~
Input: nums = [2, 3, 7, 8, 10], S = 11
Output: true
Explanation: Subset [3, 8] sums to 11
~~~

### Approach

Direct application of 0/1 Knapsack:
- Items = numbers
- Values not important (just finding if possible)
- Capacity = target sum S
- Weight of item = number itself

**Recurrence:**
~~~
dp[i][s] = dp[i-1][s] or dp[i-1][s-nums[i]]
~~~

<!-- voice:key_insight insight="This is exactly the knapsack pattern — can we select items (numbers) to exactly fill capacity (target sum)?" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n × S)
- **Space:** O(S)`,
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
        result = helper(idx + 1, remaining - nums[idx]) or \
                 helper(idx + 1, remaining)
        
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

Given a set of positive numbers, partition the set into two subsets such that the difference between subset sums is minimum. Return this minimum difference.

### Examples

~~~
Input: [1, 2, 3, 9]
Output: 3
Explanation: Can partition into [1, 2, 3] (sum=6) and [9] (sum=9)
             Difference = 9 - 6 = 3 (minimum possible)
~~~

~~~
Input: [1, 2, 7, 1, 5]
Output: 0
Explanation: Can partition into [1, 2, 5] and [7, 1], both sum to 8
~~~

~~~
Input: [1, 3, 100, 4]
Output: 92
Explanation: Best partition: [1, 3, 4]=8 and [100]=100, diff=92
~~~

### Approach

1. Total sum = S. We want to partition into S1 and S2 where S1 + S2 = S
2. Minimize |S1 - S2| = |S1 - (S - S1)| = |2×S1 - S|
3. Find S1 as close to S/2 as possible
4. Use DP to find all achievable sums up to S/2

<!-- voice:key_insight insight="We want S1 close to S/2 — iterate through achievable sums and find the one closest to half of total" -->

<!-- voice:exercise_intro difficulty="hard" hints_available="3" -->

### Complexity

- **Time:** O(n × sum)
- **Space:** O(sum)`,
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

### Problem Statement

Given a set of positive numbers and a target sum \`S\`, count the number of subsets whose sum is equal to \`S\`. (Each number can be used only once per subset.)

### Examples

~~~
Input: nums = [1, 1, 2, 3], S = 4
Output: 3
Explanation: Three subsets sum to 4: [1, 3], [1, 3] (using different 1s), [1, 1, 2]
~~~

~~~
Input: nums = [1, 2, 7, 1, 5], S = 9
Output: 3
Explanation: [2, 7], [1, 2, 1, 5] (using first 1), [1, 2, 1, 5] (using second 1)
~~~

~~~
Input: nums = [2, 3, 5, 6, 8, 10], S = 10
Output: 3
Explanation: [2, 3, 5], [2, 8], [10]
~~~

### Approach

Similar to subset sum but count instead of boolean:

**Recurrence:**
~~~
count[i][s] = count[i-1][s] + count[i-1][s-nums[i]]
              (skip)      +      (include)
~~~

<!-- voice:key_insight insight="Instead of OR (any way works), use PLUS (count all ways) — same structure, different operation" -->

<!-- voice:exercise_intro difficulty="hard" hints_available="3" -->

### Complexity

- **Time:** O(n × S)
- **Space:** O(S)`,
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

Great work on the Dynamic Programming module! Let's verify your understanding.

### Quick Review

You learned:
- **DP basics**: Overlapping subproblems, optimal substructure
- **Top-down vs Bottom-up** approaches
- **0/1 Knapsack** pattern and its variations
- **Equal Subset Sum Partition** — transforming to knapsack
- **Subset Sum** — boolean DP
- **Minimum Subset Sum Difference** — optimization
- **Count of Subset Sum** — counting DP

### Quiz

**Question 1:** What two properties must a problem have for DP to apply?
- A) Sorting and searching
- B) Overlapping subproblems and optimal substructure
- C) Recursion and iteration
- D) Arrays and linked lists

**Question 2:** In 0/1 Knapsack, what does dp[i][c] represent?
- A) Whether we can pick item i
- B) Max value using first i items with capacity c
- C) Weight of item i
- D) Number of ways to fill capacity c

**Question 3:** For Equal Subset Sum Partition, what do we check first?
- A) If all numbers are even
- B) If sum is even
- C) If array length is even
- D) If any number equals sum/2

**Question 4:** True or False: Space-optimized knapsack requires iterating capacity backwards.

**Question 5:** In Count of Subset Sum, what operation replaces the OR in subset sum?
- A) AND
- B) MAX
- C) PLUS (addition)
- D) MIN

### Voice Summary

Your coach will ask you to:
- Explain the 0/1 Knapsack recurrence relation
- Transform equal partition to subset sum
- Explain why we iterate backwards in space-optimized version
- Walk through a counting DP example

**You're mastering the Dynamic Programming pattern!**`,
    },
  ],
};
