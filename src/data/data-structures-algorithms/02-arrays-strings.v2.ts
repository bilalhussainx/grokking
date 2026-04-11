import { Module } from "../types";

export const arraysStringsModule: Module = {
  id: "arrays-strings",
  title: "Arrays & Strings",
  description: "Master array and string manipulation techniques including prefix sums, Kadane's algorithm, and the KMP string matching algorithm.",
  lessons: [
    {
      id: "arrays-strings-intro",
      slug: "arrays-strings-intro",
      title: "Introduction to Arrays & Strings",
      content: `## Arrays & Strings

Arrays and strings are the most fundamental data structures in computer science. Nearly every algorithm operates on sequential data at some level.

### Arrays

An array stores elements in **contiguous memory**, providing O(1) access to any element by index.

\`\`\`algoviz
{
  "title": "Array Memory Layout",
  "type": "array",
  "data": [42, 17, 93, 8, 55],
  "frames": [
    {"highlight": [0], "label": "Index 0 contains value 42", "stats": {"index": 0, "value": 42}},
    {"highlight": [2], "label": "Index 2 contains value 93", "stats": {"index": 2, "value": 93}},
    {"highlight": [4], "label": "Index 4 contains value 55", "stats": {"index": 4, "value": 55}}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`concept
{
  "title": "Array Access Time Complexity",
  "variant": "insight",
  "content": "Arrays provide O(1) random access because elements are stored in contiguous memory. The memory address of any element can be calculated directly: address = base_address + (index × element_size). This is why arrays are the foundation for most other data structures."
}
\`\`\`

| Operation | Time | Explanation |
|-----------|------|-------------|
| Access by index | O(1) | Direct memory address calculation |
| Search (unsorted) | O(n) | Must check each element sequentially |
| Insert at end | O(1) amortized | Dynamic arrays may need to resize |
| Insert at position | O(n) | Must shift all subsequent elements |
| Delete at position | O(n) | Must shift all subsequent elements |

### Key Techniques

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Sliding Window",
      "content": "Maintain a window of elements as you scan. Perfect for subarray problems:\\n\\n- **Fixed window**: Max sum of size k\\n- **Variable window**: Longest substring without repeats\\n- **Time complexity**: O(n) with single pass"
    },
    {
      "label": "Two Pointers",
      "content": "Use two indices moving in the same or opposite directions:\\n\\n- **Same direction**: Find pairs with specific sum\\n- **Opposite directions**: Binary search, palindrome check\\n- **Benefit**: Avoids nested loops, reduces O(n²) to O(n)"
    },
    {
      "label": "Prefix Sums",
      "content": "Precompute cumulative sums for O(1) range queries:\\n\\n\`\`\`python\\nprefix[i] = sum(arr[0:i+1])\\nsum(arr[l:r]) = prefix[r] - prefix[l-1]\\n\`\`\`\\n\\nEssential for range sum queries and subarray problems."
    }
  ]
}
\`\`\`

\`\`\`concept
{
  "title": "Kadane's Algorithm",
  "variant": "mental-model",
  "content": "Find maximum subarray sum in O(n) by asking: 'Should I start a new subarray here, or extend the previous one?' At each position, track:\\n\\n1. max_ending_here = max(arr[i], max_ending_here + arr[i])\\n2. max_so_far = max(max_so_far, max_ending_here)\\n\\nThis elegant approach never needs to look back more than one element."
}
\`\`\`

\`\`\`algoviz
{
  "title": "Dynamic Array Resize",
  "type": "array",
  "data": [1, 2, 3, 4],
  "frames": [
    {"highlight": [], "label": "Initial array: size=4, capacity=4", "stats": {"size": 4, "capacity": 4}},
    {"highlight": [], "label": "append(5): Need more space!", "stats": {"action": "append", "value": 5}},
    {"highlight": [], "label": "Allocate new array with capacity=8", "stats": {"new_capacity": 8}},
    {"highlight": [0, 1, 2, 3], "label": "Copy existing elements", "stats": {"copied": 4}},
    {"highlight": [0, 1, 2, 3, 4], "label": "Add new element: size=5, capacity=8", "stats": {"final_size": 5, "final_capacity": 8}}
  ],
  "speed": 1200
}
\`\`\`

### Strings

Strings are essentially character arrays with their own set of classic algorithms:

- **Pattern matching** — KMP, Rabin-Karp, Boyer-Moore
- **Palindrome detection** — Expand around center, Manacher's algorithm  
- **Anagram/permutation checks** — Frequency counting

\`\`\`playground
{
  "title": "String Pattern Matching",
  "language": "python",
  "code": "def naive_search(text, pattern):\\n    \\"\\"\\"Naive O(n*m) pattern matching\\"\\"\\"\\n    n, m = len(text), len(pattern)\\n    matches = []\\n    \\n    for i in range(n - m + 1):\\n        j = 0\\n        while j < m and text[i + j] == pattern[j]:\\n            j += 1\\n        if j == m:\\n            matches.append(i)\\n    \\n    return matches\\n\\n# Test the function\\ntext = \\"ABABDABACDABABCABAB\\"\\npattern = \\"ABABCABAB\\"\\nprint(f\\"Text: {text}\\")\\nprint(f\\"Pattern: {pattern}\\")\\nprint(f\\"Matches at indices: {naive_search(text, pattern)}\\")",
  "runnable": true
}
\`\`\`

### Common Pitfalls

\`\`\`callout
{
  "type": "warning",
  "title": "Watch Out for These Traps",
  "content": "1. **Off-by-one errors**: The most common bug in array/string code. Always double-check your loop bounds.\\n\\n2. **Mutability matters**: In Python, strings are immutable. Use lists for in-place modifications.\\n\\n3. **Unicode complexity**: Real-world strings require awareness of multi-byte characters. What looks like one character might be multiple bytes."
}
\`\`\`

\`\`\`quiz
{
  "title": "Array Fundamentals Check",
  "questions": [
    {
      "question": "Why do arrays provide O(1) access time?",
      "options": [
        "They use hashing",
        "Elements are stored in contiguous memory",
        "They use binary search",
        "They are sorted by default"
      ],
      "answer": 1,
      "explanation": "Arrays store elements in contiguous memory locations, allowing direct address calculation: base_address + (index × element_size)."
    },
    {
      "question": "What is the time complexity of inserting an element at the beginning of an array?",
      "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      "answer": 2,
      "explanation": "Inserting at the beginning requires shifting all existing elements one position to the right, which takes O(n) time."
    },
    {
      "question": "Which technique would you use to find the maximum sum of any subarray efficiently?",
      "options": [
        "Binary search",
        "Sliding window",
        "Kadane's algorithm",
        "Merge sort"
      ],
      "answer": 2,
      "explanation": "Kadane's algorithm finds the maximum subarray sum in O(n) time by maintaining the maximum sum ending at each position."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Arrays provide O(1) random access but O(n) insertion/deletion in the middle",
    "Sliding window, two pointers, and prefix sums are essential array techniques",
    "Kadane's algorithm solves maximum subarray problems in O(n) time",
    "Strings are character arrays with specialized algorithms for pattern matching",
    "Watch for off-by-one errors and remember string immutability in Python"
  ]
}
\`\`\``,
    },
    {
      id: "arrays-prefix-sum",
      slug: "prefix-sum-array",
      title: "Prefix Sum Array",
      content: `## Prefix Sum Array

\`\`\`concept
{"title": "The Prefix Sum Trick", "variant": "mental-model", "content": "Think of the prefix sum array as a running receipt: every entry stores the total spent so far. To know how much you spent between any two shopping trips, you subtract the two receipts—no need to re-add every item."}
\`\`\`

### Problem Statement

Implement a \`PrefixSum\` class that preprocesses an array so that any **range sum query** (sum of elements from index \`left\` to \`right\`, inclusive) can be answered in O(1) time.

### Interface

- \`__init__(self, nums)\` — Build the prefix sum array in O(n)  
- \`range_sum(self, left, right)\` — Return sum of nums[left..right] in O(1)

### Examples

\`\`\`
ps = PrefixSum([1, 2, 3, 4, 5])
ps.range_sum(0, 2)  → 6   (1+2+3)
ps.range_sum(1, 3)  → 9   (2+3+4)
ps.range_sum(0, 4)  → 15  (entire array)
ps.range_sum(3, 3)  → 4   (single element)
\`\`\`

\`\`\`algoviz
{"title": "Building the Prefix Array", "type": "array", "data": [1, 2, 3, 4, 5], "frames": [
  {"highlight": [0], "label": "prefix[0] = 0 (sentinel)", "stats": {"i": 0}},
  {"highlight": [0], "label": "prefix[1] = prefix[0] + nums[0] = 0 + 1 = 1", "stats": {"i": 1}},
  {"highlight": [0, 1], "label": "prefix[2] = prefix[1] + nums[1] = 1 + 2 = 3", "stats": {"i": 2}},
  {"highlight": [0, 1, 2], "label": "prefix[3] = 3 + 3 = 6", "stats": {"i": 3}},
  {"highlight": [0, 1, 2, 3], "label": "prefix[4] = 6 + 4 = 10", "stats": {"i": 4}},
  {"highlight": [0, 1, 2, 3, 4], "label": "prefix[5] = 10 + 5 = 15", "stats": {"i": 5}}
], "speed": 600}
\`\`\`

### How It Works

Build an array \`prefix\` where \`prefix[i] = nums[0] + nums[1] + ... + nums[i-1]\` (with \`prefix[0] = 0\`).  
Then: \`range_sum(left, right) = prefix[right + 1] - prefix[left]\`

\`\`\`trace
{"title": "Query in Action: range_sum(1, 3)", "language": "python", "code": "prefix = [0, 1, 3, 6, 10, 15]\\nleft = 1\\nright = 3\\nanswer = prefix[right + 1] - prefix[left]\\nprint(answer)", "frames": [
  {"line": 1, "vars": {"prefix": [0, 1, 3, 6, 10, 15]}, "note": "pre-built array", "stdout": ""},
  {"line": 2, "vars": {"left": 1}, "note": "", "stdout": ""},
  {"line": 3, "vars": {"right": 3}, "note": "", "stdout": ""},
  {"line": 4, "vars": {"answer": 9}, "note": "10 - 1 = 9", "stdout": ""},
  {"line": 5, "vars": {}, "note": "", "stdout": "9\\\\n"}
], "speed": 700}
\`\`\`

### Complexity

- **Preprocessing:** O(n) time, O(n) space  
- **Each query:** O(1) time

\`\`\`quiz
{"title": "Check Your Understanding", "questions": [
  {"question": "What does prefix[0] store in the standard implementation?", "options": ["Sum of first element", "Zero (sentinel)", "Sum of entire array", "Undefined"], "answer": 1, "explanation": "prefix[0] is set to 0 so that the difference formula works even when left=0."},
  {"question": "How many prefix sums must be computed to answer 100 range queries on one array?", "options": ["100", "n", "1", "n + 100"], "answer": 1, "explanation": "You build the prefix array once (O(n)) and reuse it for every O(1) query."},
  {"question": "Which operation is NOT associative and therefore unsuitable for a prefix array?", "options": ["Addition", "Multiplication", "Minimum", "Division"], "answer": 3, "explanation": "Division is not associative: (a / b) / c ≠ a / (b / c). Prefix arrays need associativity."}
]}
\`\`\`

\`\`\`playground
{"title": "Implement PrefixSum", "language": "python", "runnable": true, "code": "class PrefixSum:\\n    def __init__(self, nums):\\n        \\"\\"\\"Build prefix array in O(n)\\"\\"\\"\\n        self.prefix = [0]  # sentinel\\n        # TODO: fill the rest\\n\\n    def range_sum(self, left, right):\\n        \\"\\"\\"Return sum nums[left..right] in O(1)\\"\\"\\"\\n        # TODO: one-line formula\\n\\n# Quick tests\\nps = PrefixSum([3, -2, 4, 8])\\nprint(ps.range_sum(0, 2))  # expected 5\\nprint(ps.range_sum(1, 3))  # expected 10"}
\`\`\`

\`\`\`callout
{"type": "tip", "title": "Off-by-One Insurance", "content": "Always draw a small example on paper first: write indices, the original array, and the prefix row. The correct subtraction becomes obvious and you avoid the most common bug."}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Prefix arrays trade O(n) extra space for O(1) range-sum queries.",
  "The sentinel prefix[0]=0 unifies the formula for every range, including those starting at index 0.",
  "The technique generalizes to any associative operator (XOR, product, min, etc.)."
]}
\`\`\``,
      starterCode: `class PrefixSum:
    def __init__(self, nums):
        # TODO: Build prefix sum array
        pass

    def range_sum(self, left, right):
        # TODO: Return sum of nums[left..right] in O(1)
        pass

# Test cases
ps = PrefixSum([1, 2, 3, 4, 5])
print(ps.range_sum(0, 2))  # Expected: 6
print(ps.range_sum(1, 3))  # Expected: 9
print(ps.range_sum(0, 4))  # Expected: 15
print(ps.range_sum(3, 3))  # Expected: 4
print(ps.range_sum(2, 4))  # Expected: 12

ps2 = PrefixSum([10, -3, 5, 8, -2])
print(ps2.range_sum(0, 4))  # Expected: 18
print(ps2.range_sum(1, 2))  # Expected: 2
`,
      solutionCode: `class PrefixSum:
    def __init__(self, nums):
        self.prefix = [0] * (len(nums) + 1)
        for i in range(len(nums)):
            self.prefix[i + 1] = self.prefix[i] + nums[i]

    def range_sum(self, left, right):
        return self.prefix[right + 1] - self.prefix[left]

# Test cases
ps = PrefixSum([1, 2, 3, 4, 5])
print(ps.range_sum(0, 2))  # Expected: 6
print(ps.range_sum(1, 3))  # Expected: 9
print(ps.range_sum(0, 4))  # Expected: 15
print(ps.range_sum(3, 3))  # Expected: 4
print(ps.range_sum(2, 4))  # Expected: 12

ps2 = PrefixSum([10, -3, 5, 8, -2])
print(ps2.range_sum(0, 4))  # Expected: 18
print(ps2.range_sum(1, 2))  # Expected: 2
`,
    },
    {
      id: "arrays-kadanes",
      slug: "kadanes-algorithm",
      title: "Kadane's Algorithm",
      content: `## Kadane's Algorithm — Maximum Subarray Sum

### Problem Statement

Given an array of integers (which may include negative numbers), find the **contiguous subarray** with the largest sum and return that sum.

### Examples

\`\`\`
Input:  [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6
Explanation: [4, -1, 2, 1] has the largest sum

Input:  [1, 2, 3, -2, 5]
Output: 9
Explanation: [1, 2, 3, -2, 5] — the entire array

Input:  [-1, -2, -3]
Output: -1
Explanation: [-1] — pick the least negative
\`\`\`

\`\`\`concept
{
  "title": "The Core Insight",
  "variant": "mental-model",
  "content": "At each position, ask: \\"Am I better off extending the current streak, or starting fresh from this element?\\" This single greedy choice, repeated across the array, guarantees the global optimum."
}
\`\`\`

### Algorithm (Kadane's)

1. Track \`current_sum\` = max subarray ending at the current position.
2. Track \`max_sum\` = best seen so far.
3. At each element: \`current_sum = max(nums[i], current_sum + nums[i])\`.
4. Update \`max_sum = max(max_sum, current_sum)\`.

The key insight: if adding the current element to the running sum makes it worse than starting fresh from the current element, then start a new subarray.

\`\`\`algoviz
{
  "title": "Kadane's in Action on [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
  "type": "array",
  "data": [-2, 1, -3, 4, -1, 2, 1, -5, 4],
  "frames": [
    {"highlight": [0], "label": "i=0: cur=-2, best=-2", "stats": {"cur": -2, "best": -2}},
    {"highlight": [1], "label": "i=1: cur=max(1,-1)=1, best=1", "stats": {"cur": 1, "best": 1}},
    {"highlight": [2], "label": "i=2: cur=max(-3,-2)=-2, best=1", "stats": {"cur": -2, "best": 1}},
    {"highlight": [3], "label": "i=3: cur=max(4,2)=4, best=4", "stats": {"cur": 4, "best": 4}},
    {"highlight": [4], "label": "i=4: cur=max(-1,3)=3, best=4", "stats": {"cur": 3, "best": 4}},
    {"highlight": [5], "label": "i=5: cur=max(2,5)=5, best=5", "stats": {"cur": 5, "best": 5}},
    {"highlight": [6], "label": "i=6: cur=max(1,6)=6, best=6", "stats": {"cur": 6, "best": 6}},
    {"highlight": [7], "label": "i=7: cur=max(-5,1)=1, best=6", "stats": {"cur": 1, "best": 6}},
    {"highlight": [8], "label": "i=8: cur=max(4,5)=5, best=6", "stats": {"cur": 5, "best": 6}}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Brute-force (O(n²))",
    "code": "max_sum = -inf\\nfor i in range(n):\\n    cur = 0\\n    for j in range(i, n):\\n        cur += nums[j]\\n        max_sum = max(max_sum, cur)"
  },
  "after": {
    "label": "Kadane's (O(n))",
    "code": "max_sum = cur_sum = nums[0]\\nfor i in range(1, n):\\n    cur_sum = max(nums[i], cur_sum + nums[i])\\n    max_sum = max(max_sum, cur_sum)"
  }
}
\`\`\`

### Complexity

- **Time:** O(n) — single left-to-right pass
- **Space:** O(1) — only two scalars regardless of input size

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "If every number is negative, Kadane's algorithm returns:",
      "options": ["0 (empty subarray)", "The largest single element", "Undefined behavior", "The sum of the entire array"],
      "answer": 1,
      "explanation": "Standard Kadane's initializes best to the first element, so it correctly picks the least-negative value."
    },
    {
      "question": "Which invariant holds after processing index i?",
      "options": ["cur_sum is the best sum of any subarray", "cur_sum is the best sum ending at i", "max_sum is the sum of the last element", "cur_sum ≥ max_sum"],
      "answer": 1,
      "explanation": "cur_sum (max_ending_here) stores the optimal sum for a subarray that must end at the current position."
    },
    {
      "question": "Kadane's runs in O(n) because:",
      "options": ["It uses divide & conquer", "It performs constant work per element", "It sorts the array first", "It memoizes all subarrays"],
      "answer": 1,
      "explanation": "A single scan with O(1) updates at each step yields linear total time."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Try It: Kadane's Algorithm",
  "language": "python",
  "code": "def kadane(arr):\\n    if not arr:\\n        return 0\\n    cur = best = arr[0]\\n    for x in arr[1:]:\\n        cur = max(x, cur + x)\\n        best = max(best, cur)\\n    return best\\n\\n# ---- test cases ----\\nprint(kadane([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # 6\\nprint(kadane([1, 2, 3, -2, 5]))                # 9\\nprint(kadane([-1, -2, -3]))                    # -1",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Kadane's scans once, keeping only the best subarray ending at the current index and the global best.",
    "Greedy choice—extend or restart—works because optimal subarrays build only on prior optimal subarrays.",
    "O(n) time and O(1) space make it the canonical solution to the maximum subarray problem."
  ]
}
\`\`\``,
      starterCode: `def max_subarray_sum(nums):
    # TODO: Implement Kadane's algorithm
    pass

# Test cases
print(max_subarray_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # Expected: 6
print(max_subarray_sum([1, 2, 3, -2, 5]))                    # Expected: 9
print(max_subarray_sum([-1, -2, -3]))                         # Expected: -1
print(max_subarray_sum([5]))                                   # Expected: 5
print(max_subarray_sum([-1, 3, -1, 3, -1]))                  # Expected: 5
`,
      solutionCode: `def max_subarray_sum(nums):
    current_sum = nums[0]
    max_sum = nums[0]
    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
    return max_sum

# Test cases
print(max_subarray_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # Expected: 6
print(max_subarray_sum([1, 2, 3, -2, 5]))                    # Expected: 9
print(max_subarray_sum([-1, -2, -3]))                         # Expected: -1
print(max_subarray_sum([5]))                                   # Expected: 5
print(max_subarray_sum([-1, 3, -1, 3, -1]))                  # Expected: 5
`,
    },
    {
      id: "arrays-kmp",
      slug: "kmp-string-matching",
      title: "KMP String Matching",
      content: `## KMP String Matching Algorithm

### Problem Statement

Implement the **Knuth-Morris-Pratt (KMP)** algorithm to find all occurrences of a pattern in a text string. Return a list of starting indices where the pattern is found.

### Examples

\`\`\`
Input:  text = "AABAACAADAABAABA", pattern = "AABA"
Output: [0, 9, 12]

Input:  text = "ABABABAB", pattern = "ABAB"
Output: [0, 2, 4]

Input:  text = "HELLO", pattern = "WORLD"
Output: []
\`\`\`

### How KMP Works

**Naive matching** re-scans from the start of the pattern after every mismatch — O(n*m).

**KMP** preprocesses the pattern to build a **failure function** (also called the LPS array — Longest Proper Prefix which is also a Suffix). When a mismatch occurs, the failure function tells us how far back in the pattern we can safely skip, avoiding redundant comparisons.

\`\`\`concept
{
  "title": "The LPS Array Insight",
  "variant": "insight",
  "content": "The LPS array stores the length of the longest proper prefix that is also a suffix for each position in the pattern. This tells us exactly how much we can skip ahead when a mismatch occurs, because we already know these characters match!"
}
\`\`\`

**Steps:**
1. Build the LPS array for the pattern
2. Use the LPS array to skip ahead on mismatches during the search

\`\`\`steps
{
  "title": "Building the LPS Array",
  "steps": [
    {
      "title": "Initialize LPS[0] = 0",
      "content": "The first character has no proper prefix, so LPS[0] is always 0."
    },
    {
      "title": "Use two pointers",
      "content": "Maintain \`len\` (length of current matching prefix) and \`i\` (current position). Start with len = 0, i = 1."
    },
    {
      "title": "Match case",
      "content": "If pattern[i] == pattern[len], increment both and set LPS[i] = len."
    },
    {
      "title": "Mismatch case",
      "content": "If pattern[i] != pattern[len] and len > 0, set len = LPS[len-1]. If len == 0, set LPS[i] = 0 and increment i."
    }
  ]
}
\`\`\`

\`\`\`trace
{
  "title": "LPS Array Construction for 'AABAAB'",
  "language": "python",
  "code": "def build_lps(pattern):\\n    lps = [0] * len(pattern)\\n    length = 0  # length of previous longest prefix suffix\\n    i = 1\\n    \\n    while i < len(pattern):\\n        if pattern[i] == pattern[length]:\\n            length += 1\\n            lps[i] = length\\n            i += 1\\n        else:\\n            if length != 0:\\n                length = lps[length - 1]\\n            else:\\n                lps[i] = 0\\n                i += 1\\n    return lps\\n\\npattern = \\"AABAAB\\"\\nlps = build_lps(pattern)\\nprint(f\\"Pattern: {pattern}\\")\\nprint(f\\"LPS:     {lps}\\")",
  "frames": [
    {"line": 1, "vars": {"pattern": "AABAAB"}, "note": "Starting with pattern 'AABAAB'", "stdout": ""},
    {"line": 2, "vars": {"lps": "[0, 0, 0, 0, 0, 0]"}, "note": "Initialize LPS array with zeros", "stdout": ""},
    {"line": 4, "vars": {"length": 0, "i": 1}, "note": "Start with i=1, length=0", "stdout": ""},
    {"line": 8, "vars": {"i": 1, "length": 1, "lps": "[0, 1, 0, 0, 0, 0]"}, "note": "pattern[1]='A' matches pattern[0]='A'", "stdout": ""},
    {"line": 8, "vars": {"i": 2, "length": 2, "lps": "[0, 1, 2, 0, 0, 0]"}, "note": "pattern[2]='B' matches pattern[1]='A'? No!", "stdout": ""},
    {"line": 13, "vars": {"length": 0}, "note": "length becomes 0 due to mismatch", "stdout": ""},
    {"line": 16, "vars": {"i": 3, "lps": "[0, 1, 0, 1, 0, 0]"}, "note": "pattern[3]='A' matches pattern[0]='A'", "stdout": ""},
    {"line": 8, "vars": {"i": 4, "length": 1, "lps": "[0, 1, 0, 1, 2, 0]"}, "note": "pattern[4]='A' matches pattern[1]='A'", "stdout": ""},
    {"line": 8, "vars": {"i": 5, "length": 2, "lps": "[0, 1, 0, 1, 2, 3]"}, "note": "pattern[5]='B' matches pattern[2]='B'", "stdout": ""},
    {"line": 20, "vars": {"lps": "[0, 1, 0, 1, 2, 3]"}, "note": "Final LPS array", "stdout": "Pattern: AABAAB\\nLPS:     [0, 1, 0, 1, 2, 3]"}
  ],
  "speed": 1000
}
\`\`\`

### Complexity

- **Preprocessing:** O(m) for the LPS array
- **Search:** O(n)
- **Total:** O(n + m)
- **Space:** O(m) for the LPS array

\`\`\`quiz
{
  "title": "KMP Algorithm Understanding",
  "questions": [
    {
      "question": "What does the LPS array represent in KMP?",
      "options": ["Longest Palindromic Substring", "Longest Proper Prefix which is also Suffix", "Longest Pattern Sequence", "Longest Prefix Sum"],
      "answer": 1,
      "explanation": "LPS stands for Longest Proper Prefix which is also Suffix. It tells us how much we can skip when a mismatch occurs."
    },
    {
      "question": "Why is KMP more efficient than naive string matching?",
      "options": ["It uses hashing", "It avoids re-examining matched characters", "It sorts the text first", "It uses binary search"],
      "answer": 1,
      "explanation": "KMP avoids re-examining characters that have already been matched by using the LPS array to determine optimal shifts."
    },
    {
      "question": "What is the time complexity of KMP algorithm?",
      "options": ["O(n*m)", "O(n log m)", "O(n + m)", "O(m log n)"],
      "answer": 2,
      "explanation": "KMP has linear time complexity O(n + m) where n is text length and m is pattern length, including preprocessing."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Implement KMP String Matching",
  "language": "python",
  "code": "def kmp_search(text, pattern):\\n    if not pattern or not text:\\n        return []\\n    \\n    # Build LPS array\\n    lps = build_lps(pattern)\\n    \\n    # Search using LPS\\n    result = []\\n    i = 0  # index for text\\n    j = 0  # index for pattern\\n    \\n    while i < len(text):\\n        if text[i] == pattern[j]:\\n            i += 1\\n            j += 1\\n            \\n            if j == len(pattern):\\n                result.append(i - j)\\n                j = lps[j - 1]\\n        else:\\n            if j != 0:\\n                j = lps[j - 1]\\n            else:\\n                i += 1\\n    \\n    return result\\n\\ndef build_lps(pattern):\\n    lps = [0] * len(pattern)\\n    length = 0\\n    i = 1\\n    \\n    while i < len(pattern):\\n        if pattern[i] == pattern[length]:\\n            length += 1\\n            lps[i] = length\\n            i += 1\\n        else:\\n            if length != 0:\\n                length = lps[length - 1]\\n            else:\\n                lps[i] = 0\\n                i += 1\\n    return lps\\n\\n# Test the implementation\\ntext = \\"AABAACAADAABAABA\\"\\npattern = \\"AABA\\"\\nprint(f\\"Text: {text}\\")\\nprint(f\\"Pattern: {pattern}\\")\\nprint(f\\"Matches at indices: {kmp_search(text, pattern)}\\")",
  "runnable": true
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "When to Use KMP",
  "content": "KMP excels when you need to search for the same pattern multiple times in different texts, or when you have a large text and want guaranteed O(n+m) performance. For one-off searches with short patterns, the overhead of building the LPS array might not be worth it."
}
\`\`\``,
      starterCode: `def build_lps(pattern):
    # TODO: Build the Longest Proper Prefix-Suffix array
    pass

def kmp_search(text, pattern):
    # TODO: Use KMP to find all occurrences of pattern in text
    # Return list of starting indices
    pass

# Test cases
print(kmp_search("AABAACAADAABAABA", "AABA"))  # Expected: [0, 9, 12]
print(kmp_search("ABABABAB", "ABAB"))            # Expected: [0, 2, 4]
print(kmp_search("HELLO", "WORLD"))              # Expected: []
print(kmp_search("AAAAAA", "AA"))                # Expected: [0, 1, 2, 3, 4]
print(kmp_search("ABC", "ABC"))                  # Expected: [0]
`,
      solutionCode: `def build_lps(pattern):
    m = len(pattern)
    lps = [0] * m
    length = 0
    i = 1
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    return lps

def kmp_search(text, pattern):
    n, m = len(text), len(pattern)
    if m == 0:
        return []
    lps = build_lps(pattern)
    results = []
    i = 0  # index in text
    j = 0  # index in pattern
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
        if j == m:
            results.append(i - j)
            j = lps[j - 1]
        elif i < n and text[i] != pattern[j]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    return results

# Test cases
print(kmp_search("AABAACAADAABAABA", "AABA"))  # Expected: [0, 9, 12]
print(kmp_search("ABABABAB", "ABAB"))            # Expected: [0, 2, 4]
print(kmp_search("HELLO", "WORLD"))              # Expected: []
print(kmp_search("AAAAAA", "AA"))                # Expected: [0, 1, 2, 3, 4]
print(kmp_search("ABC", "ABC"))                  # Expected: [0]
`,
    },
  ],
};
