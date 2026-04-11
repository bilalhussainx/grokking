import { Module } from "../types";

export const complexityModule: Module = {
  id: "complexity-analysis",
  title: "Complexity Analysis",
  description: "Understand Big-O notation, time and space complexity analysis, and learn to benchmark and optimize algorithm performance.",
  lessons: [
    {
      id: "complexity-intro",
      slug: "complexity-intro",
      title: "Introduction to Complexity Analysis",
      content: `## Complexity Analysis

**Complexity analysis** is the study of how an algorithm's resource usage (time and memory) grows as the input size increases. It is the foundation of algorithm design — before you can choose between approaches, you need a way to compare them.

\`\`\`concept
{
  "title": "Complexity Analysis as a Universal Yardstick",
  "variant": "mental-model",
  "content": "Think of Big-O as a \\"zoom lens\\" that removes machine-specific noise (CPU speed, language, compiler) and lets you see only how an algorithm behaves as the problem gets huge. Two programmers on opposite sides of the planet can agree that O(n log n) beats O(n²) without ever running a benchmark."
}
\`\`\`

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

\`\`\`algoviz
{
  "title": "Growth Rates at a Glance",
  "type": "array",
  "data": [1, 3, 10, 33, 100, 1024, 3628800],
  "frames": [
    { "highlight": [0], "label": "n = 10, O(1) = 1", "stats": {"n": 10} },
    { "highlight": [1], "label": "O(log n) ≈ 3.32", "stats": {"n": 10} },
    { "highlight": [2], "label": "O(n) = 10", "stats": {"n": 10} },
    { "highlight": [3], "label": "O(n log n) ≈ 33", "stats": {"n": 10} },
    { "highlight": [4], "label": "O(n²) = 100", "stats": {"n": 10} },
    { "highlight": [5], "label": "O(2ⁿ) = 1024", "stats": {"n": 10} },
    { "highlight": [6], "label": "O(n!) = 3 628 800", "stats": {"n": 10} }
  ],
  "speed": 900
}
\`\`\`

### Time vs. Space

- **Time complexity** — how many operations does the algorithm perform?
- **Space complexity** — how much extra memory does it allocate?

There is often a **time-space tradeoff**: you can speed up an algorithm by using more memory (caching, hash tables) or reduce memory by accepting slower execution.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Time Focus",
      "icon": "⏱️",
      "content": "When response latency matters (real-time systems, UI rendering), prioritize time-optimal algorithms even if they allocate extra memory. Example: a game engine caches pre-computed lighting at the cost of RAM to keep 60 fps."
    },
    {
      "label": "Space Focus",
      "icon": "💾",
      "content": "On memory-constrained devices (embedded sensors, micro-controllers), pick in-place algorithms. Example: selection sort uses O(1) extra space while merge sort needs O(n) buffer, so the simpler sort wins when RAM is measured in kilobytes."
    }
  ]
}
\`\`\`

### Rules of Thumb

1. **Drop constants**: O(3n) → O(n)
2. **Drop lower-order terms**: O(n² + n) → O(n²)
3. **Consider the worst case** unless stated otherwise
4. **Amortized analysis** accounts for occasional expensive operations averaged over many cheap ones (e.g., dynamic array resizing)

\`\`\`quiz
{
  "title": "Quick Complexity Check",
  "questions": [
    {
      "question": "Simplify 5n log n + 2n + 7",
      "options": ["O(n)", "O(n log n)", "O(n²)", "O(5n log n)"],
      "answer": 1,
      "explanation": "Drop constants (5, 2, 7) and lower-order term (2n) to leave the dominant term n log n."
    },
    {
      "question": "Which complexity grows fastest as n → ∞?",
      "options": ["O(n!)", "O(2ⁿ)", "O(n²)", "O(n log n)"],
      "answer": 0,
      "explanation": "Factorial dwarfs exponential: for n = 10, 10! = 3 628 800 while 2¹⁰ = 1024."
    },
    {
      "question": "An algorithm always runs in 250 ms on any input. Its complexity is:",
      "options": ["O(n)", "O(1)", "O(250)", "Unknown without input size"],
      "answer": 1,
      "explanation": "Constant time means the runtime does not grow with input size, so O(1)."
    }
  ]
}
\`\`\`

### Why This Matters

Every data structure and algorithm in this course will be analyzed through the lens of Big-O. Choosing the right data structure often comes down to understanding which operations need to be fast and what trade-offs you are willing to make.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Big-O gives an upper-bound growth rate independent of hardware or language.",
    "Keep only the dominant term and drop constants when expressing complexity.",
    "Time and space complexities can conflict—decide which resource is your bottleneck.",
    "Amortized analysis smooths out occasional expensive operations to give a realistic average cost."
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "Sequential Operations: The Dominant Complexity Rule",
  "variant": "rule",
  "content": "When operations execute one after another (sequentially), the overall complexity is determined by the most expensive operation. This is because the total time is the sum of individual times, and the dominant term overshadows all others as n grows large. For example, O(n²) + O(n) + O(log n) simplifies to O(n²) since n² grows fastest."
}
\`\`\`

\`\`\`algoviz
{
  "title": "Finding the Dominant Complexity",
  "type": "array",
  "data": ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)", "O(2^n)"],
  "frames": [
    { "highlight": [0], "label": "Start with first complexity: O(1)" },
    { "highlight": [0, 1], "label": "Compare O(1) vs O(log n): O(log n) wins" },
    { "highlight": [1, 2], "label": "Compare O(log n) vs O(n): O(n) wins" },
    { "highlight": [2, 3], "label": "Compare O(n) vs O(n log n): O(n log n) wins" },
    { "highlight": [3, 4], "label": "Compare O(n log n) vs O(n²): O(n²) wins" },
    { "highlight": [4, 5], "label": "Compare O(n²) vs O(2ⁿ): O(2ⁿ) wins - exponential dominates all" }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`quiz
{
  "title": "Dominant Complexity Quiz",
  "questions": [
    {
      "question": "What is the dominant complexity among O(n), O(n log n), and O(n²)?",
      "options": ["O(n)", "O(n log n)", "O(n²)", "All equal"],
      "answer": 2,
      "explanation": "O(n²) grows fastest as n increases, making it the dominant complexity."
    },
    {
      "question": "If you have operations O(2ⁿ) and O(n!), which dominates?",
      "options": ["O(2ⁿ)", "O(n!)", "They are equal", "Depends on n"],
      "answer": 1,
      "explanation": "O(n!) grows faster than O(2ⁿ) for n ≥ 4, making factorial the dominant complexity."
    },
    {
      "question": "What is the overall complexity of O(log n) + O(n) + O(1)?",
      "options": ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
      "answer": 1,
      "explanation": "Among O(log n), O(n), and O(1), O(n) grows fastest and dominates the overall complexity."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Implement the Complexity Analyzer",
  "language": "python",
  "code": "def analyze_complexity(operations):\\n    \\"\\"\\"\\n    Given a list of Big-O complexities, return the dominant one.\\n    Operations are sequential - we take the maximum complexity.\\n    \\"\\"\\"\\n    # Define complexity ordering (lower index = less complex)\\n    complexity_order = {\\n        \\"O(1)\\": 0,\\n        \\"O(log n)\\": 1,\\n        \\"O(n)\\": 2,\\n        \\"O(n log n)\\": 3,\\n        \\"O(n^2)\\": 4,\\n        \\"O(2^n)\\": 5\\n    }\\n    \\n    # Find the operation with highest complexity\\n    max_complexity = operations[0]\\n    for op in operations[1:]:\\n        if complexity_order[op] > complexity_order[max_complexity]:\\n            max_complexity = op\\n    \\n    return max_complexity\\n\\n# Test cases\\nprint(analyze_complexity([\\"O(n)\\", \\"O(1)\\", \\"O(n)\\"]))\\nprint(analyze_complexity([\\"O(n^2)\\", \\"O(n)\\", \\"O(n log n)\\"]))\\nprint(analyze_complexity([\\"O(1)\\", \\"O(log n)\\"]))",
  "runnable": true
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Complexity Ordering Mnemonic",
  "content": "Remember the growth order: **1 < log n < n < n log n < n² < 2ⁿ**. A helpful way to think about it: constant time is best, logarithmic is great (dividing problem), linear is good, linearithmic is okay (sorting), quadratic is concerning (nested loops), and exponential is terrible (avoid at all costs)."
}
\`\`\`

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

\`\`\`concept
{
  "title": "Why Benchmark When We Have Big-O?",
  "variant": "insight",
  "content": "Big-O tells us theoretical growth, but benchmarking reveals real-world behavior. An O(N) algorithm with a huge constant factor can be slower than an O(N²) algorithm for practical input sizes. Benchmarking bridges the gap between theory and practice by measuring actual operation counts or execution times."
}
\`\`\`

\`\`\`algoviz
{
  "title": "Growth Ratio Patterns",
  "type": "array",
  "data": [100, 200, 400, 800],
  "frames": [
    {"highlight": [0,1], "label": "Linear: ratio = 2.0 (200/100)", "stats": {"ratio": 2.0}},
    {"highlight": [1,2], "label": "Linear: ratio = 2.0 (400/200)", "stats": {"ratio": 2.0}},
    {"highlight": [2,3], "label": "Linear: ratio = 2.0 (800/400)", "stats": {"ratio": 2.0}}
  ],
  "speed": 1000
}
\`\`\`

### Examples

\`\`\`playground
{
  "title": "Linear vs Quadratic Benchmarking",
  "language": "python",
  "code": "def benchmark(func, sizes):\\n    results = []\\n    for n in sizes:\\n        count = func(n)\\n        results.append((n, count))\\n    return results\\n\\ndef detect_complexity(ratios):\\n    avg_ratio = sum(ratios) / len(ratios)\\n    if abs(avg_ratio - 2.0) < 0.5:\\n        return \\"O(n)\\"\\n    elif abs(avg_ratio - 4.0) < 1.0:\\n        return \\"O(n^2)\\"\\n    elif 2.0 < avg_ratio < 3.0:\\n        return \\"O(n log n)\\"\\n    return \\"Unknown\\"\\n\\n# Test linear: operations = 3*n\\nlinear_results = benchmark(lambda n: 3*n, [100, 200, 400])\\nprint(\\"Linear results:\\", linear_results)\\n\\n# Calculate ratios for linear\\nlinear_ratios = []\\nfor i in range(1, len(linear_results)):\\n    ratio = linear_results[i][1] / linear_results[i-1][1]\\n    linear_ratios.append(ratio)\\n\\nprint(\\"Linear ratios:\\", linear_ratios)\\nprint(\\"Linear complexity:\\", detect_complexity(linear_ratios))",
  "runnable": true
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Growth Ratio Thresholds",
  "content": "When input size doubles:\\n- **O(n)**: operations double (ratio ≈ 2.0)\\n- **O(n²)**: operations quadruple (ratio ≈ 4.0)\\n- **O(n log n)**: operations slightly more than double (ratio ≈ 2.1-2.3)\\n\\nThese thresholds work because log(2n) = log(n) + log(2), so n log(2n) = n(log(n) + log(2)) = n log(n) + n log(2)"
}
\`\`\`

### Understanding Growth Ratios

The key insight is that when we double the input size, different complexity classes exhibit predictable growth patterns:

\`\`\`steps
{
  "title": "Analyzing Growth Patterns",
  "steps": [
    {
      "title": "Measure Operations",
      "content": "Run the function with exponentially increasing input sizes (e.g., 100, 200, 400, 800). This makes growth patterns more visible."
    },
    {
      "title": "Calculate Ratios",
      "content": "For each consecutive pair of results, divide the larger operation count by the smaller one. This gives you the growth ratio."
    },
    {
      "title": "Classify Complexity",
      "content": "Use the average ratio to determine the complexity class. Ratios cluster around specific values for each complexity."
    }
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Benchmarking Complexity Detection",
  "questions": [
    {
      "question": "If doubling input size always doubles operations, what's the complexity?",
      "options": ["O(1)", "O(n)", "O(n²)", "O(n log n)"],
      "answer": 1,
      "explanation": "A consistent 2x growth ratio when input doubles indicates linear time complexity O(n)."
    },
    {
      "question": "You benchmark a function and get ratios [2.8, 2.9, 3.1]. What's likely complexity?",
      "options": ["O(n)", "O(n²)", "O(n log n)", "O(2^n)"],
      "answer": 2,
      "explanation": "Ratios between 2 and 3 suggest O(n log n) complexity, as log(n) grows slowly with n."
    },
    {
      "question": "Why use exponentially increasing input sizes for benchmarking?",
      "options": ["Easier to code", "Faster to run", "Reveals growth patterns", "Uses less memory"],
      "answer": 2,
      "explanation": "Exponential growth in input size makes the asymptotic behavior more apparent and easier to measure."
    }
  ]
}
\`\`\`

### Implementation Complete

\`\`\`playground
{
  "title": "Complete Benchmarking Solution",
  "language": "python",
  "code": "def benchmark(func, sizes):\\n    \\"\\"\\"Measure operations for different input sizes.\\"\\"\\"\\n    return [(n, func(n)) for n in sizes]\\n\\ndef detect_complexity(ratios):\\n    \\"\\"\\"Classify complexity from growth ratios.\\"\\"\\"\\n    if not ratios:\\n        return \\"Unknown\\"\\n    \\n    avg = sum(ratios) / len(ratios)\\n    \\n    if abs(avg - 2.0) < 0.3:\\n        return \\"O(n)\\"\\n    elif abs(avg - 4.0) < 0.8:\\n        return \\"O(n^2)\\"\\n    elif 2.0 < avg < 3.0:\\n        return \\"O(n log n)\\"\\n    else:\\n        return f\\"Unknown (ratio: {avg:.2f})\\"\\n\\n# Test all complexity classes\\ntest_cases = [\\n    (\\"O(n)\\", lambda n: 5*n + 100),\\n    (\\"O(n^2)\\", lambda n: n*n + 10*n),\\n    (\\"O(n log n)\\", lambda n: n * (n.bit_length() - 1))\\n]\\n\\nsizes = [100, 200, 400, 800]\\n\\nfor expected, func in test_cases:\\n    results = benchmark(func, sizes)\\n    ratios = [results[i][1] / results[i-1][1] for i in range(1, len(results))]\\n    detected = detect_complexity(ratios)\\n    \\n    print(f\\"\\\\n{expected} function:\\")\\n    print(f\\"Results: {results}\\")\\n    print(f\\"Ratios: {[f'{r:.2f}' for r in ratios]}\\")\\n    print(f\\"Detected: {detected} {'✓' if detected == expected else '✗'}\\")",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Benchmarking measures actual operation counts to empirically determine complexity",
    "Growth ratios reveal complexity: ~2x for O(n), ~4x for O(n²), ~2.1-2.3x for O(n log n)",
    "Use exponentially increasing input sizes to make growth patterns visible",
    "Real-world performance can differ from theoretical Big-O due to constant factors"
  ]
}
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

\`\`\`concept
{
  "title": "The Space Optimization Insight",
  "variant": "insight",
  "content": "When a DP recurrence only looks back a fixed number of steps (like Fibonacci's F(n) = F(n-1) + F(n-2)), you can reduce space from O(n) to O(1) by keeping only the needed previous values. This works because you never need the entire history—just the last k states."
}
\`\`\`

\`\`\`algoviz
{
  "title": "Visualizing Space Usage",
  "type": "array",
  "data": [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55],
  "frames": [
    { "highlight": [0, 1], "label": "fib_optimized: only store prev=0, curr=1", "stats": {"space": 2} },
    { "highlight": [1, 2], "label": "Update: prev=1, curr=1", "stats": {"space": 2} },
    { "highlight": [2, 3], "label": "Update: prev=1, curr=2", "stats": {"space": 2} },
    { "highlight": [3, 4], "label": "Update: prev=2, curr=3", "stats": {"space": 2} },
    { "highlight": [4, 5], "label": "Update: prev=3, curr=5", "stats": {"space": 2} },
    { "highlight": [9, 10], "label": "Final step: prev=34, curr=55", "stats": {"space": 2} }
  ],
  "speed": 600
}
\`\`\`

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Tabulation (O(n) space)",
    "code": "def fib_table(n):\\n    if n < 2:\\n        return n\\n    dp = [0] * (n + 1)  # O(n) array\\n    dp[1] = 1\\n    for i in range(2, n + 1):\\n        dp[i] = dp[i-1] + dp[i-2]\\n    return dp[n]"
  },
  "after": {
    "label": "Optimized (O(1) space)",
    "code": "def fib_optimized(n):\\n    if n < 2:\\n        return n\\n    prev, curr = 0, 1      # O(1) variables\\n    for _ in range(2, n + 1):\\n        prev, curr = curr, prev + curr\\n    return curr"
  }
}
\`\`\`

\`\`\`trace
{
  "title": "Step-by-step: fib_optimized(6)",
  "language": "python",
  "code": "def fib_optimized(n):\\n    if n < 2:\\n        return n\\n    prev, curr = 0, 1\\n    for _ in range(2, n + 1):\\n        prev, curr = curr, prev + curr\\n    return curr\\n\\nprint(fib_optimized(6))",
  "frames": [
    { "line": 2, "vars": {"n": 6}, "note": "n >= 2, enter loop", "stdout": "" },
    { "line": 4, "vars": {"prev": 0, "curr": 1}, "note": "initial state", "stdout": "" },
    { "line": 5, "vars": {"prev": 1, "curr": 1}, "note": "i=2", "stdout": "" },
    { "line": 5, "vars": {"prev": 1, "curr": 2}, "note": "i=3", "stdout": "" },
    { "line": 5, "vars": {"prev": 2, "curr": 3}, "note": "i=4", "stdout": "" },
    { "line": 5, "vars": {"prev": 3, "curr": 5}, "note": "i=5", "stdout": "" },
    { "line": 5, "vars": {"prev": 5, "curr": 8}, "note": "i=6", "stdout": "" },
    { "line": 6, "vars": {"prev": 5, "curr": 8}, "note": "return 8", "stdout": "8\\n" }
  ],
  "speed": 700
}
\`\`\`

\`\`\`quiz
{
  "title": "Space Optimization Check",
  "questions": [
    {
      "question": "Which version keeps the call-stack depth at O(1)?",
      "options": ["fib_memo", "fib_table", "fib_optimized", "none"],
      "answer": 2,
      "explanation": "Only the iterative optimized version avoids recursion entirely, so its call-stack depth is constant."
    },
    {
      "question": "If the recurrence needed the last 5 values instead of 2, the minimal space would be:",
      "options": ["O(1)", "O(5)", "O(log n)", "O(n)"],
      "answer": 1,
      "explanation": "You would store exactly 5 variables, which is still O(1) in Big-O terms because 5 is a constant."
    },
    {
      "question": "Why can't we apply this trick to memoized DFS on a tree?",
      "options": ["Trees are recursive", "We need random access", "Visit order is unpredictable", "All of the above"],
      "answer": 2,
      "explanation": "Unlike Fibonacci, tree DFS may revisit arbitrary earlier nodes, so we can't discard the cache predictably."
    }
  ]
}
\`\`\`

### Key Insight

When a DP recurrence only looks back a fixed number of steps, you can reduce space from O(n) to O(1) by keeping only the needed previous values.

### Complexity

| Version | Time | Space |
|---------|------|-------|
| Memoized | O(n) | O(n) |
| Tabulated | O(n) | O(n) |
| Optimized | O(n) | O(1) |

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Space optimization is possible when the recurrence relation has a fixed look-back window.",
    "Iterative bottom-up solutions can be trimmed to store only the necessary previous states.",
    "Big-O treats any constant number of variables as O(1), no matter how large the constant is.",
    "Always verify that discarding older states does not break correctness for your specific problem."
  ]
}
\`\`\``,
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
