import { Module } from "../types";

export const complexityModule: Module = {
  id: "complexity-analysis",
  title: "Complexity Analysis",
  description:
    "Understand Big-O notation, time and space complexity analysis, and learn to benchmark and optimize algorithm performance.",
  lessons: [
    {
      id: "complexity-intro",
      slug: "complexity-intro",
      title: "Introduction to Complexity Analysis",
      content: `## Complexity Analysis

**Complexity analysis** is the study of how an algorithm's resource usage (time and memory) grows as the input size increases. It is the foundation of algorithm design — before you can choose between approaches, you need a way to compare them.

### Big-O Notation

Big-O describes the **upper bound** of growth. When we say an algorithm is O(n²), we mean its running time grows at most quadratically with the input size.

| Notation | Name | Example |
|----------|------|---------|
| O(1) | Constant | Hash table lookup |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Linear search |
| O(n log n) | Linearithmic | Merge sort |
| O(n²) | Quadratic | Bubble sort |
| O(2ⁿ) | Exponential | Recursive Fibonacci |
| O(n!) | Factorial | Permutation generation |

### Time vs. Space

- **Time complexity** — how many operations does the algorithm perform?
- **Space complexity** — how much extra memory does it allocate?

There is often a **time-space tradeoff**: you can speed up an algorithm by using more memory (caching, hash tables) or reduce memory by accepting slower execution.

### Rules of Thumb

1. **Drop constants**: O(3n) → O(n)
2. **Drop lower-order terms**: O(n² + n) → O(n²)
3. **Consider the worst case** unless stated otherwise
4. **Amortized analysis** accounts for occasional expensive operations averaged over many cheap ones (e.g., dynamic array resizing)

### Growth Rate Comparison

\`\`\`mermaid
graph TD
    subgraph "Growth Rates as n increases"
    A["n = 10"] --> B["O(1) = 1"]
    A --> C["O(log n) = 3"]
    A --> D["O(n) = 10"]
    A --> E["O(n log n) = 33"]
    A --> F["O(n squared) = 100"]
    A --> G["O(2 to the n) = 1024"]
    end
    style B fill:#4ade80,color:#000
    style C fill:#86efac,color:#000
    style D fill:#fde047,color:#000
    style E fill:#fdba74,color:#000
    style F fill:#f87171,color:#fff
    style G fill:#dc2626,color:#fff
\`\`\`

### Why This Matters

Every data structure and algorithm in this course will be analyzed through the lens of Big-O. Choosing the right data structure often comes down to understanding which operations need to be fast and what trade-offs you are willing to make.`,
    },
    {
      id: "complexity-analyzer",
      slug: "complexity-analyzer",
      title: "Complexity Analyzer",
      content: `## Complexity Analyzer

### Problem Statement

Write a function \`analyze_complexity(operations)\` that takes a list of operation descriptions and returns the overall Big-O complexity.

Each operation is a string: \`"O(1)"\`, \`"O(log n)"\`, \`"O(n)"\`, \`"O(n log n)"\`, \`"O(n^2)"\`, \`"O(2^n)"\`.

If operations are **sequential** (one after another), the overall complexity is the maximum. Your function receives a list of sequential operations and should return the dominant complexity.

### Examples

\`\`\`
Input:  ["O(n)", "O(1)", "O(n)"]
Output: "O(n)"

Input:  ["O(n^2)", "O(n)", "O(n log n)"]
Output: "O(n^2)"

Input:  ["O(1)", "O(log n)"]
Output: "O(log n)"
\`\`\`

### Approach

Define an ordering of complexities and return the maximum from the input list.

### Complexity

- **Time:** O(k) where k is the number of operations
- **Space:** O(1)`,
      starterCode: `def analyze_complexity(operations):
    # TODO: Return the dominant Big-O complexity from the list
    # Hint: define a ranking of complexities, then find the max
    pass

# Test cases
print(analyze_complexity(["O(n)", "O(1)", "O(n)"]))            # Expected: "O(n)"
print(analyze_complexity(["O(n^2)", "O(n)", "O(n log n)"]))    # Expected: "O(n^2)"
print(analyze_complexity(["O(1)", "O(log n)"]))                 # Expected: "O(log n)"
print(analyze_complexity(["O(2^n)", "O(n^2)", "O(n)"]))        # Expected: "O(2^n)"
print(analyze_complexity(["O(1)"]))                             # Expected: "O(1)"
`,
      solutionCode: `def analyze_complexity(operations):
    ranking = {
        "O(1)": 0,
        "O(log n)": 1,
        "O(n)": 2,
        "O(n log n)": 3,
        "O(n^2)": 4,
        "O(2^n)": 5,
    }
    max_rank = -1
    max_op = operations[0]
    for op in operations:
        if ranking.get(op, -1) > max_rank:
            max_rank = ranking[op]
            max_op = op
    return max_op

# Test cases
print(analyze_complexity(["O(n)", "O(1)", "O(n)"]))            # Expected: "O(n)"
print(analyze_complexity(["O(n^2)", "O(n)", "O(n log n)"]))    # Expected: "O(n^2)"
print(analyze_complexity(["O(1)", "O(log n)"]))                 # Expected: "O(log n)"
print(analyze_complexity(["O(2^n)", "O(n^2)", "O(n)"]))        # Expected: "O(2^n)"
print(analyze_complexity(["O(1)"]))                             # Expected: "O(1)"
`,
    },
    {
      id: "complexity-benchmarking",
      slug: "complexity-benchmarking",
      title: "Benchmarking Algorithms",
      content: `## Benchmarking Algorithms

### Problem Statement

Write a function \`benchmark(func, sizes)\` that measures how many operations a given function performs for different input sizes, returning a list of \`(size, count)\` tuples.

The function \`func\` accepts a size \`n\` and returns the number of operations it performed. Your job is to call it for each size and compute the **growth ratio** between consecutive sizes to empirically determine the complexity class.

Write a second function \`detect_complexity(ratios)\` that takes a list of growth ratios and classifies the algorithm as \`"O(n)"\`, \`"O(n^2)"\`, or \`"O(n log n)"\`.

### Examples

\`\`\`
# A linear function: operations = 3*n
benchmark(lambda n: 3*n, [100, 200, 400])
# Returns: [(100, 300), (200, 600), (400, 1200)]
# Ratios: [2.0, 2.0] → O(n)

# A quadratic function: operations = n*n
benchmark(lambda n: n*n, [100, 200, 400])
# Returns: [(100, 10000), (200, 40000), (400, 160000)]
# Ratios: [4.0, 4.0] → O(n^2)
\`\`\`

### Complexity

- **Time:** O(k) where k = len(sizes)
- **Space:** O(k)`,
      starterCode: `def benchmark(func, sizes):
    # TODO: Call func for each size, return list of (size, operation_count)
    pass

def compute_ratios(results):
    # TODO: Given [(size, count), ...], compute ratios between consecutive counts
    pass

def detect_complexity(ratios):
    # TODO: Based on average ratio, classify as "O(n)", "O(n^2)", or "O(n log n)"
    # Hint: ratio ~2 means linear, ~4 means quadratic, between means n log n
    pass

# Test cases
linear_results = benchmark(lambda n: 3 * n, [100, 200, 400, 800])
print(linear_results)
ratios = compute_ratios(linear_results)
print(f"Ratios: {ratios}")
print(f"Complexity: {detect_complexity(ratios)}")  # Expected: "O(n)"

print()

quad_results = benchmark(lambda n: n * n, [100, 200, 400, 800])
print(quad_results)
ratios = compute_ratios(quad_results)
print(f"Ratios: {ratios}")
print(f"Complexity: {detect_complexity(ratios)}")  # Expected: "O(n^2)"
`,
      solutionCode: `def benchmark(func, sizes):
    return [(size, func(size)) for size in sizes]

def compute_ratios(results):
    ratios = []
    for i in range(1, len(results)):
        prev_count = results[i - 1][1]
        curr_count = results[i][1]
        if prev_count > 0:
            ratios.append(curr_count / prev_count)
    return ratios

def detect_complexity(ratios):
    avg_ratio = sum(ratios) / len(ratios)
    if avg_ratio < 2.5:
        return "O(n)"
    elif avg_ratio < 3.5:
        return "O(n log n)"
    else:
        return "O(n^2)"

# Test cases
linear_results = benchmark(lambda n: 3 * n, [100, 200, 400, 800])
print(linear_results)
ratios = compute_ratios(linear_results)
print(f"Ratios: {ratios}")
print(f"Complexity: {detect_complexity(ratios)}")  # Expected: "O(n)"

print()

quad_results = benchmark(lambda n: n * n, [100, 200, 400, 800])
print(quad_results)
ratios = compute_ratios(quad_results)
print(f"Ratios: {ratios}")
print(f"Complexity: {detect_complexity(ratios)}")  # Expected: "O(n^2)"
`,
    },
    {
      id: "complexity-space-optimization",
      slug: "space-optimization",
      title: "Space Optimization",
      content: `## Space Optimization

### Problem Statement

The Fibonacci sequence is a classic example where naive recursion uses O(2ⁿ) time and O(n) stack space. Memoization brings time to O(n) but still uses O(n) space for the cache.

Implement three versions of Fibonacci and compare their space usage:

1. \`fib_memo(n)\` — top-down with memoization, O(n) space
2. \`fib_table(n)\` — bottom-up tabulation, O(n) space
3. \`fib_optimized(n)\` — bottom-up with only two variables, O(1) space

Each function should return the n-th Fibonacci number (0-indexed: fib(0)=0, fib(1)=1, fib(2)=1, ...).

### Examples

\`\`\`
fib_memo(10)      → 55
fib_table(10)     → 55
fib_optimized(10) → 55

fib_optimized(0) → 0
fib_optimized(1) → 1
fib_optimized(50) → 12586269025
\`\`\`

### Key Insight

When a DP recurrence only looks back a fixed number of steps, you can reduce space from O(n) to O(1) by keeping only the needed previous values.

### Complexity

| Version | Time | Space |
|---------|------|-------|
| Memoized | O(n) | O(n) |
| Tabulated | O(n) | O(n) |
| Optimized | O(n) | O(1) |`,
      starterCode: `def fib_memo(n, memo=None):
    # TODO: Fibonacci with memoization (top-down)
    pass

def fib_table(n):
    # TODO: Fibonacci with tabulation (bottom-up, O(n) space)
    pass

def fib_optimized(n):
    # TODO: Fibonacci with O(1) space
    pass

# Test cases
for func_name, func in [("memo", fib_memo), ("table", fib_table), ("optimized", fib_optimized)]:
    print(f"fib_{func_name}(0) = {func(0)}")    # Expected: 0
    print(f"fib_{func_name}(1) = {func(1)}")    # Expected: 1
    print(f"fib_{func_name}(10) = {func(10)}")  # Expected: 55
    print(f"fib_{func_name}(20) = {func(20)}")  # Expected: 6765
    print()
`,
      solutionCode: `def fib_memo(n, memo=None):
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

def fib_table(n):
    if n <= 1:
        return n
    table = [0] * (n + 1)
    table[1] = 1
    for i in range(2, n + 1):
        table[i] = table[i - 1] + table[i - 2]
    return table[n]

def fib_optimized(n):
    if n <= 1:
        return n
    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    return prev1

# Test cases
for func_name, func in [("memo", fib_memo), ("table", fib_table), ("optimized", fib_optimized)]:
    print(f"fib_{func_name}(0) = {func(0)}")    # Expected: 0
    print(f"fib_{func_name}(1) = {func(1)}")    # Expected: 1
    print(f"fib_{func_name}(10) = {func(10)}")  # Expected: 55
    print(f"fib_{func_name}(20) = {func(20)}")  # Expected: 6765
    print()
`,
    },
  ],
};
