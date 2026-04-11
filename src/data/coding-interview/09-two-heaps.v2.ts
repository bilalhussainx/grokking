import { Module } from "../types";

export const twoHeapsModule: Module = {
  id: "two-heaps",
  title: "Two Heaps",
  description: "Learn to use a max-heap and min-heap in tandem to efficiently track medians and optimize selection problems.",
  lessons: [
    {
      id: "two-heaps-intro",
      slug: "two-heaps-intro",
      title: "Introduction to Two Heaps",
      content: `# Two Heaps Pattern

The **Two Heaps** pattern uses a max-heap and a min-heap together to efficiently partition a dataset into two halves. This is particularly powerful when you need to repeatedly find the median or balance elements around a central value.

\`\`\`concept
{
  "title": "Two Heaps Mental Model",
  "variant": "mental-model",
  "content": "Think of two heaps as a see-saw that stays perfectly balanced. The max-heap holds the 'left side' (smaller numbers) with the largest of these at the top. The min-heap holds the 'right side' (larger numbers) with the smallest of these at the top. By keeping them balanced, the median is always just one or two peeks away."
}
\`\`\`

## Why Two Heaps?

Imagine you receive a continuous stream of numbers and need to report the median at any time. Sorting after every insertion would cost O(n log n). With two heaps, each insertion and median query costs only O(log n).

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Brute Force Approach",
    "code": "numbers = []\\n\\ndef add_num(num):\\n    numbers.append(num)\\n    numbers.sort()  # O(n log n)\\n\\ndef find_median():\\n    n = len(numbers)\\n    if n % 2 == 0:\\n        return (numbers[n//2-1] + numbers[n//2]) / 2\\n    return numbers[n//2]"
  },
  "after": {
    "label": "Two Heaps Approach",
    "code": "import heapq\\nmax_heap = []  # negated values\\nmin_heap = []\\n\\ndef add_num(num):\\n    if not max_heap or num <= -max_heap[0]:\\n        heapq.heappush(max_heap, -num)\\n    else:\\n        heapq.heappush(min_heap, num)\\n    # Rebalance if needed\\n    if len(max_heap) > len(min_heap) + 1:\\n        heapq.heappush(min_heap, -heapq.heappop(max_heap))\\n    elif len(min_heap) > len(max_heap):\\n        heapq.heappush(max_heap, -heapq.heappop(min_heap))\\n\\ndef find_median():\\n    if len(max_heap) > len(min_heap):\\n        return -max_heap[0]\\n    return (-max_heap[0] + min_heap[0]) / 2"
  }
}
\`\`\`

## How It Works

- **Max-Heap (left half):** Stores the smaller half of the numbers. The top element is the largest of the small numbers.
- **Min-Heap (right half):** Stores the larger half. The top element is the smallest of the large numbers.

By keeping these two heaps balanced (sizes differ by at most 1), the median is always at the top of one or both heaps.

\`\`\`algoviz
{
  "title": "Two Heaps in Action",
  "type": "array",
  "data": [3, 1, 5, 2, 8, 7],
  "frames": [
    {"highlight": [0], "label": "Insert 3 → max_heap", "stats": {"max_heap": [3], "min_heap": []}},
    {"highlight": [0, 1], "label": "Insert 1 → max_heap", "stats": {"max_heap": [3, 1], "min_heap": []}},
    {"highlight": [0, 1, 2], "label": "Insert 5 → min_heap", "stats": {"max_heap": [3, 1], "min_heap": [5]}},
    {"highlight": [0, 1, 2, 3], "label": "Insert 2 → max_heap", "stats": {"max_heap": [3, 2, 1], "min_heap": [5]}},
    {"highlight": [0, 1, 2, 3, 4], "label": "Insert 8 → min_heap", "stats": {"max_heap": [3, 2, 1], "min_heap": [5, 8]}},
    {"highlight": [0, 1, 2, 3, 4, 5], "label": "Insert 7 → min_heap", "stats": {"max_heap": [3, 2, 1], "min_heap": [5, 7, 8]}}
  ],
  "speed": 1000
}
\`\`\`

## Python Implementation Notes

Python's \`heapq\` module only provides a min-heap. To simulate a max-heap, **negate the values** when pushing and popping:

\`\`\`playground
{
  "title": "Max-Heap Simulation",
  "language": "python",
  "code": "import heapq\\n\\n# Create a max-heap by negating values\\nmax_heap = []\\n\\n# Insert values\\nvalues = [3, 1, 4, 1, 5, 9]\\nfor v in values:\\n    heapq.heappush(max_heap, -v)\\n    print(f\\"After inserting {v}: max_heap tops = {[-x for x in max_heap]}\\")\\n\\nprint(\\"\\\\\\\\nPopping from max-heap:\\")\\nwhile max_heap:\\n    top = -heapq.heappop(max_heap)\\n    print(f\\"Popped: {top}, remaining: {[-x for x in max_heap]}\\")",
  "runnable": true
}
\`\`\`

## When to Use This Pattern

- Finding the running median of a data stream
- Balancing two groups to minimize difference
- Problems requiring quick access to both the maximum of a lower set and the minimum of an upper set

The key insight is that by maintaining two sorted halves via heaps, you get O(log n) insertions and O(1) median lookups — far better than re-sorting each time.

\`\`\`quiz
{
  "title": "Two Heaps Fundamentals",
  "questions": [
    {
      "question": "In a two-heaps structure, where is the median when both heaps have equal size?",
      "options": ["The top of max-heap", "The top of min-heap", "Average of both tops", "Cannot determine"],
      "answer": 2,
      "explanation": "When both heaps have equal size, the median is the average of the max-heap's top (largest of smaller half) and min-heap's top (smallest of larger half)."
    },
    {
      "question": "Why do we negate values when using Python's heapq for a max-heap?",
      "options": ["heapq only supports negative numbers", "To reverse the ordering", "For memory efficiency", "To avoid collisions"],
      "answer": 1,
      "explanation": "heapq only provides min-heap functionality. By negating values, we reverse the ordering so that the smallest negative value corresponds to the largest positive value."
    },
    {
      "question": "After inserting a new number, the max-heap has 5 elements and min-heap has 3. What's the next step?",
      "options": ["Move top from max-heap to min-heap", "Move top from min-heap to max-heap", "Do nothing", "Rebalance both heaps"],
      "answer": 0,
      "explanation": "The heaps must differ by at most 1 in size. Since max-heap has 2 more elements, we move its top to the min-heap to rebalance."
    }
  ]
}
\`\`\`

\`\`\`steps
{
  "title": "Building a Median Finder",
  "steps": [
    {
      "title": "Initialize Two Heaps",
      "content": "Create an empty max-heap (using negated values) and an empty min-heap. These will store the lower and upper halves of your data."
    },
    {
      "title": "Insert New Numbers",
      "content": "For each new number, decide which heap to insert into:\\n- If number ≤ max-heap top (or max-heap is empty) → max-heap\\n- Otherwise → min-heap"
    },
    {
      "title": "Rebalance Heaps",
      "content": "After insertion, ensure heaps differ by at most 1:\\n- If max-heap has >1 more element than min-heap → move max-heap top to min-heap\\n- If min-heap has more elements than max-heap → move min-heap top to max-heap"
    },
    {
      "title": "Find Median",
      "content": "To get the median:\\n- If max-heap has more elements → return its top\\n- If equal size → return average of both tops"
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Two heaps provide O(log n) insertion and O(1) median lookup by maintaining balanced sorted halves",
    "Max-heap stores smaller half, min-heap stores larger half; sizes differ by at most 1",
    "Python's heapq requires value negation to simulate max-heap behavior",
    "Rebalancing after each insertion is crucial for maintaining correct median calculation",
    "This pattern is ideal for streaming data where you need real-time median tracking"
  ]
}
\`\`\``,
    },
    {
      id: "two-heaps-median-stream",
      slug: "two-heaps-median-stream",
      title: "Find the Median of a Number Stream",
      content: `# Find the Median of a Number Stream

## Problem Statement

Design a class that supports two operations:

1. **\`insert_num(num)\`** — Add a number to the data structure.
2. **\`find_median()\`** — Return the median of all numbers inserted so far.

If the count of numbers is even, the median is the average of the two middle numbers.

\`\`\`concept
{
  "title": "Median Definition",
  "variant": "rule",
  "content": "For an ordered list:\\n• Odd count: median = middle element\\n• Even count: median = average of two middle elements\\n\\nExample: [1,3,4,5] → median = (3+4)/2 = 3.5"
}
\`\`\`

## Examples

**Example 1:**
\`\`\`
insert_num(3), insert_num(1), find_median() → 2.0
insert_num(5), find_median() → 3.0
insert_num(4), find_median() → 3.5
\`\`\`

**Example 2:**
\`\`\`
insert_num(8), find_median() → 8.0
insert_num(2), find_median() → 5.0
\`\`\`

## Two-Heap Approach

The key insight is to maintain two heaps that split the data stream into a "lower half" and an "upper half":

- **Max-heap** (\`lower\`) stores the smaller half, with the largest value at the root
- **Min-heap** (\`upper\`) stores the larger half, with the smallest value at the root

\`\`\`algoviz
{
  "title": "Heap Evolution: Insert 3,1,5,4",
  "type": "array",
  "data": [3, 1, 5, 4],
  "frames": [
    {"highlight": [0], "label": "Insert 3 → lower=[3], upper=[]", "stats": {"median": 3.0}},
    {"highlight": [0,1], "label": "Insert 1 → lower=[1], upper=[3]", "stats": {"median": 2.0}},
    {"highlight": [0,1,2], "label": "Insert 5 → lower=[1,3], upper=[5]", "stats": {"median": 3.0}},
    {"highlight": [0,1,2,3], "label": "Insert 4 → lower=[1,3], upper=[4,5]", "stats": {"median": 3.5}}
  ],
  "speed": 1000
}
\`\`\`

### Insertion Algorithm

1. **Route the number**: If \`num ≤ lower.peek()\`, push to \`lower\`; else push to \`upper\`
2. **Rebalance**: Ensure size difference ≤ 1 by moving the root of the larger heap to the smaller one
3. **Maintain invariant**: All elements in \`lower\` ≤ all elements in \`upper\`

\`\`\`trace
{
  "title": "Inserting 3,1,5,4 Step-by-Step",
  "language": "python",
  "code": "import heapq\\n\\nclass MedianFinder:\\n    def __init__(self):\\n        self.lower = []  # max-heap (negated values)\\n        self.upper = []  # min-heap\\n    \\n    def insert_num(self, num):\\n        # Route to appropriate heap\\n        if not self.lower or num <= -self.lower[0]:\\n            heapq.heappush(self.lower, -num)\\n        else:\\n            heapq.heappush(self.upper, num)\\n        \\n        # Rebalance if needed\\n        if len(self.lower) > len(self.upper) + 1:\\n            heapq.heappush(self.upper, -heapq.heappop(self.lower))\\n        elif len(self.upper) > len(self.lower):\\n            heapq.heappush(self.lower, -heapq.heappop(self.upper))\\n    \\n    def find_median(self):\\n        if len(self.lower) > len(self.upper):\\n            return float(-self.lower[0])\\n        return (-self.lower[0] + self.upper[0]) / 2\\n\\nmf = MedianFinder()\\nfor x in [3,1,5,4]:\\n    mf.insert_num(x)\\n    print(f\\"After inserting {x}: median = {mf.find_median()}\\")",
  "frames": [
    {"line": 9, "vars": {"num": 3, "lower": [], "upper": []}, "note": "First insertion", "stdout": ""},
    {"line": 10, "vars": {"num": 3, "lower": [-3], "upper": []}, "note": "Pushed to lower", "stdout": ""},
    {"line": 18, "vars": {"lower": [-3], "upper": []}, "note": "No rebalance needed", "stdout": ""},
    {"line": 9, "vars": {"num": 1, "lower": [-3], "upper": []}, "note": "Second insertion", "stdout": ""},
    {"line": 10, "vars": {"num": 1, "lower": [-3, -1], "upper": []}, "note": "1 ≤ 3 → push to lower", "stdout": ""},
    {"line": 17, "vars": {"lower": [-1], "upper": [3]}, "note": "Rebalance: move -3 to upper", "stdout": ""},
    {"line": 9, "vars": {"num": 5, "lower": [-1], "upper": [3]}, "note": "Third insertion", "stdout": ""},
    {"line": 12, "vars": {"num": 5, "lower": [-1], "upper": [3, 5]}, "note": "5 > 1 → push to upper", "stdout": ""},
    {"line": 19, "vars": {"lower": [-3, -1], "upper": [5]}, "note": "Rebalance: move 3 to lower", "stdout": ""},
    {"line": 9, "vars": {"num": 4, "lower": [-3, -1], "upper": [5]}, "note": "Fourth insertion", "stdout": ""},
    {"line": 12, "vars": {"num": 4, "lower": [-3, -1], "upper": [4, 5]}, "note": "4 > 3 → push to upper", "stdout": ""},
    {"line": 21, "vars": {"lower": [-3, -1], "upper": [4, 5]}, "note": "Sizes differ by 0 → no rebalance", "stdout": "After inserting 3: median = 3.0\\nAfter inserting 1: median = 2.0\\nAfter inserting 5: median = 3.0\\nAfter inserting 4: median = 3.5\\n"}
  ],
  "speed": 900
}
\`\`\`

### Median Retrieval

- **Odd total**: The larger heap's root is the median
- **Even total**: Average the two roots

\`\`\`quiz
{
  "title": "Two-Heap Median Logic",
  "questions": [
    {
      "question": "After inserting several numbers, lower has 4 elements and upper has 3. What is the median?",
      "options": ["Average of both roots", "Root of lower", "Root of upper", "Cannot determine"],
      "answer": 1,
      "explanation": "When the total count is odd (7), the median is simply the root of the larger heap (lower in this case)."
    },
    {
      "question": "Why do we negate values when using Python's heapq for the max-heap?",
      "options": ["heapq only supports min-heaps", "Negation makes numbers smaller", "It's faster", "To avoid duplicates"],
      "answer": 0,
      "explanation": "Python's heapq module only implements min-heap. By negating values, we simulate a max-heap where the largest negative value (smallest number) is at the root."
    },
    {
      "question": "What's the maximum allowed size difference between the two heaps?",
      "options": ["0", "1", "2", "No limit"],
      "answer": 1,
      "explanation": "We maintain the invariant that the size difference between heaps is at most 1. This ensures O(1) median retrieval."
    }
  ]
}
\`\`\`

## Complexity Analysis

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Naive Approach",
    "code": "class NaiveMedian:\\n    def __init__(self):\\n        self.nums = []\\n    \\n    def insert_num(self, num):\\n        self.nums.append(num)  # O(1)\\n    \\n    def find_median(self):\\n        self.nums.sort()       # O(n log n)\\n        n = len(self.nums)\\n        if n % 2:\\n            return self.nums[n//2]\\n        return (self.nums[n//2-1] + self.nums[n//2]) / 2"
  },
  "after": {
    "label": "Two-Heap Approach",
    "code": "class TwoHeapMedian:\\n    def __init__(self):\\n        self.lower = []  # max-heap\\n        self.upper = []  # min-heap\\n    \\n    def insert_num(self, num):\\n        # O(log n) insertion + rebalance\\n        if not self.lower or num <= -self.lower[0]:\\n            heapq.heappush(self.lower, -num)\\n        else:\\n            heapq.heappush(self.upper, num)\\n        \\n        # Rebalance heaps\\n        if len(self.lower) > len(self.upper) + 1:\\n            heapq.heappush(self.upper, -heapq.heappop(self.lower))\\n        elif len(self.upper) > len(self.lower):\\n            heapq.heappush(self.lower, -heapq.heappop(self.upper))\\n    \\n    def find_median(self):\\n        # O(1) retrieval\\n        if len(self.lower) > len(self.upper):\\n            return float(-self.lower[0])\\n        return (-self.lower[0] + self.upper[0]) / 2"
  }
}
\`\`\`

**Time Complexity:** O(log n) per insertion, O(1) per median query  
**Space Complexity:** O(n) for storing all elements

\`\`\`playground
{
  "title": "Interactive Median Finder",
  "language": "python",
  "code": "import heapq\\n\\nclass MedianFinder:\\n    def __init__(self):\\n        self.lower = []  # max-heap (negated)\\n        self.upper = []  # min-heap\\n    \\n    def insert_num(self, num):\\n        if not self.lower or num <= -self.lower[0]:\\n            heapq.heappush(self.lower, -num)\\n        else:\\n            heapq.heappush(self.upper, num)\\n        \\n        # Rebalance\\n        if len(self.lower) > len(self.upper) + 1:\\n            heapq.heappush(self.upper, -heapq.heappop(self.lower))\\n        elif len(self.upper) > len(self.lower):\\n            heapq.heappush(self.lower, -heapq.heappop(self.upper))\\n    \\n    def find_median(self):\\n        if len(self.lower) > len(self.upper):\\n            return float(-self.lower[0])\\n        return (-self.lower[0] + self.upper[0]) / 2\\n\\n# Test with your own sequence\\nmf = MedianFinder()\\ntest_numbers = [8, 2, 9, 1, 5, 7, 3, 6, 4]\\n\\nfor num in test_numbers:\\n    mf.insert_num(num)\\n    median = mf.find_median()\\n    print(f\\"After inserting {num}: median = {median}\\")",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Two heaps split the data stream into lower and upper halves for O(1) median access",
    "Max-heap (lower) stores smaller values; min-heap (upper) stores larger values",
    "Maintain size balance: heap sizes differ by at most 1",
    "Insertion is O(log n) due to heap operations; median retrieval is O(1)",
    "Python's heapq requires negation to simulate max-heap behavior"
  ]
}
\`\`\``,
      starterCode: `import heapq

class MedianFinder:
    def __init__(self):
        self.max_heap = []  # lower half (store negated)
        self.min_heap = []  # upper half

    def insert_num(self, num):
        # TODO: Insert num into the correct heap and rebalance
        pass

    def find_median(self):
        # TODO: Return the current median
        pass

# Test cases
mf = MedianFinder()
mf.insert_num(3)
mf.insert_num(1)
print(mf.find_median())  # Expected: 2.0
mf.insert_num(5)
print(mf.find_median())  # Expected: 3.0
mf.insert_num(4)
print(mf.find_median())  # Expected: 3.5
`,
      solutionCode: `import heapq

class MedianFinder:
    def __init__(self):
        self.max_heap = []  # lower half (store negated)
        self.min_heap = []  # upper half

    def insert_num(self, num):
        if not self.max_heap or num <= -self.max_heap[0]:
            heapq.heappush(self.max_heap, -num)
        else:
            heapq.heappush(self.min_heap, num)

        # Rebalance: max_heap can have at most 1 extra element
        if len(self.max_heap) > len(self.min_heap) + 1:
            heapq.heappush(self.min_heap, -heapq.heappop(self.max_heap))
        elif len(self.min_heap) > len(self.max_heap):
            heapq.heappush(self.max_heap, -heapq.heappop(self.min_heap))

    def find_median(self):
        if len(self.max_heap) == len(self.min_heap):
            return (-self.max_heap[0] + self.min_heap[0]) / 2.0
        return -self.max_heap[0] / 1.0

# Test cases
mf = MedianFinder()
mf.insert_num(3)
mf.insert_num(1)
print(mf.find_median())  # Expected: 2.0
mf.insert_num(5)
print(mf.find_median())  # Expected: 3.0
mf.insert_num(4)
print(mf.find_median())  # Expected: 3.5
`,
    },
    {
      id: "two-heaps-sliding-window-median",
      slug: "two-heaps-sliding-window-median",
      title: "Sliding Window Median",
      content: `# Sliding Window Median

## Problem Statement

Given an array of numbers and a window size \`k\`, find the median of each sliding window as it moves from left to right across the array.

\`\`\`concept
{
  "title": "What makes this hard?",
  "variant": "insight",
  "content": "Unlike the streaming median problem, we must *remove* elements that fall outside the window. Python's heapq has no efficient removal, so we use 'lazy deletion' — mark items for removal and only purge them when they surface at a heap's root."
}
\`\`\`

## Examples

**Example 1:**
\`\`\`
Input: nums = [1, 2, -1, 3, 5], k = 3
Output: [1.0, 2.0, 3.0]
Explanation: Window [1,2,-1] → median 1, Window [2,-1,3] → median 2, Window [-1,3,5] → median 3
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
Output: [1.0, -1.0, -1.0, 3.0, 5.0, 6.0]
\`\`\`

\`\`\`algoviz
{
  "title": "Window sliding over nums = [1,3,-1,-3,5,3,6,7], k=3",
  "type": "array",
  "data": [1, 3, -1, -3, 5, 3, 6, 7],
  "frames": [
    { "highlight": [0, 1, 2], "label": "Window [1,3,-1] → median 1.0", "stats": { "median": 1.0 } },
    { "highlight": [1, 2, 3], "label": "Window [3,-1,-3] → median -1.0", "stats": { "median": -1.0 } },
    { "highlight": [2, 3, 4], "label": "Window [-1,-3,5] → median -1.0", "stats": { "median": -1.0 } },
    { "highlight": [3, 4, 5], "label": "Window [-3,5,3] → median 3.0", "stats": { "median": 3.0 } },
    { "highlight": [4, 5, 6], "label": "Window [5,3,6] → median 5.0", "stats": { "median": 5.0 } },
    { "highlight": [5, 6, 7], "label": "Window [3,6,7] → median 6.0", "stats": { "median": 6.0 } }
  ],
  "speed": 1000
}
\`\`\`

## Approach

This extends the median-of-a-stream idea but adds element removal:

1. Use two heaps (max-heap for lower half, min-heap for upper half) as before.
2. For each window position, insert the new element and remove the element leaving the window.
3. Since \`heapq\` doesn't support efficient removal, use **lazy deletion**: track elements to remove in a hash map, and clean them up only when they appear at the top of a heap.
4. After insertion and removal, rebalance the heaps and compute the median.

\`\`\`trace
{
  "title": "Lazy-deletion two-heap trace on [1,2,-1,3,5], k=3",
  "language": "python",
  "code": "from heapq import heappush, heappop\\nimport collections\\n\\ndef median_sliding_window(nums, k):\\n    max_lo = []          # negative values for max-heap\\n    min_hi = []\\n    to_remove = collections.defaultdict(int)\\n    out = []\\n\\n    def rebalance():\\n        while max_lo and to_remove.get(-max_lo[0][0], 0) > 0:\\n            val, idx = heappop(max_lo)\\n            to_remove[-val] -= 1\\n        while min_hi and to_remove.get(min_hi[0][0], 0) > 0:\\n            val, idx = heappop(min_hi)\\n            to_remove[val] -= 1\\n        # size invariant\\n        while len(max_lo) > len(min_hi) + 1:\\n            v, i = heappop(max_lo)\\n            heappush(min_hi, (-v, i))\\n        while len(min_hi) > len(max_lo):\\n            v, i = heappop(min_hi)\\n            heappush(max_lo, (-v, i))\\n\\n    for i, x in enumerate(nums):\\n        # insert\\n        if max_lo and x <= -max_lo[0][0]:\\n            heappush(max_lo, (-x, i))\\n        else:\\n            heappush(min_hi, (x, i))\\n        rebalance()\\n        # remove out-of-window\\n        start = i - k\\n        if start >= 0:\\n            val = nums[start]\\n            to_remove[val] += 1\\n            if max_lo and val <= -max_lo[0][0]:\\n                pass  # will be lazily removed from max_lo\\n            else:\\n                pass  # will be lazily removed from min_hi\\n            rebalance()\\n        # median\\n        if i >= k - 1:\\n            if k % 2:\\n                out.append(float(-max_lo[0][0]))\\n            else:\\n                out.append((-max_lo[0][0] + min_hi[0][0]) / 2.0)\\n    return out",
  "frames": [
    { "line": 8, "vars": { "i": 0, "x": 1, "max_lo": [], "min_hi": [], "to_remove": {} }, "note": "Insert 1", "stdout": "" },
    { "line": 9, "vars": { "i": 0, "x": 1, "max_lo": [[-1, 0]], "min_hi": [], "to_remove": {} }, "note": "Rebalance → max_lo gets 1", "stdout": "" },
    { "line": 22, "vars": { "i": 2, "x": -1, "max_lo": [[-1, 0], [-3, 2]], "min_hi": [[3, 1]], "to_remove": {} }, "note": "Window complete, median 1.0", "stdout": "1.0\\n" },
    { "line": 25, "vars": { "i": 3, "x": 3, "max_lo": [[-1, 0]], "min_hi": [[3, 3]], "to_remove": {"1": 1} }, "note": "Lazily mark 1 for removal", "stdout": "1.0\\n" }
  ],
  "speed": 900
}
\`\`\`

**Time Complexity:** O(n log k) — each element is inserted and removed once.  
**Space Complexity:** O(k) for the heaps plus O(n) for the removal tracker.

The tricky part is the rebalancing logic when elements are lazily deleted — you must account for "pending removals" in each heap's effective size.

\`\`\`quiz
{
  "title": "Check your understanding",
  "questions": [
    {
      "question": "Why do we use lazy deletion instead of immediately removing an element from the middle of a heap?",
      "options": [
        "Heapq provides a fast remove-by-index method",
        "Immediate removal would break the heap property",
        "Heaps only support pop-from-root efficiently",
        "Python dictionaries cannot track removals"
      ],
      "answer": 2,
      "explanation": "Heaps are structured for O(log n) pop of the root, not arbitrary elements. Lazy deletion defers cleanup until the unwanted element reaches the top."
    },
    {
      "question": "After inserting the new element and before computing the median, what must be true about the sizes of the two heaps?",
      "options": [
        "max_lo can be at most 1 larger than min_hi",
        "min_hi must be larger than max_lo",
        "Both heaps must have exactly k//2 elements",
        "Their sizes can differ by any amount"
      ],
      "answer": 0,
      "explanation": "We rebalance so that max_lo (the lower half) has either the same count as min_hi or exactly one more, guaranteeing the median is at the root of max_lo for odd k."
    },
    {
      "question": "In the worst case, how many elements can the removal dictionary hold?",
      "options": [
        "O(k)",
        "O(n)",
        "O(log k)",
        "O(1)"
      ],
      "answer": 1,
      "explanation": "Every element could be marked for removal before any lazy cleanup occurs, giving an O(n) worst-case footprint for the tracker."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Two heaps still give O(log k) median queries, but sliding windows require *removals*.",
    "Lazy deletion uses a hash map to postpone cleanup until the unwanted item surfaces at a heap root.",
    "Rebalancing must account for both pending removals and the size invariant (max_lo ≤ min_hi + 1).",
    "Overall complexity: O(n log k) time, O(k) heap space, plus O(n) removal tracking."
  ]
}
\`\`\``,
      starterCode: `import heapq
from collections import defaultdict

def sliding_window_median(nums, k):
    # TODO: Return list of medians for each window of size k
    result = []
    return result

# Test cases
print(sliding_window_median([1, 2, -1, 3, 5], 3))
# Expected: [1.0, 2.0, 3.0]

print(sliding_window_median([1, 3, -1, -3, 5, 3, 6, 7], 3))
# Expected: [1.0, -1.0, -1.0, 3.0, 5.0, 6.0]
`,
      solutionCode: `import heapq
from collections import defaultdict

def sliding_window_median(nums, k):
    result = []
    max_heap = []  # lower half (negated)
    min_heap = []  # upper half
    to_remove = defaultdict(int)

    def get_median():
        if k % 2 == 1:
            return -max_heap[0] / 1.0
        return (-max_heap[0] + min_heap[0]) / 2.0

    def rebalance():
        # max_heap should have equal or one more element than min_heap
        if len(max_heap) - len(min_heap) > 1:
            heapq.heappush(min_heap, -heapq.heappop(max_heap))
        elif len(min_heap) > len(max_heap):
            heapq.heappush(max_heap, -heapq.heappop(min_heap))

    def clean_top(heap, is_max):
        while heap:
            val = -heap[0] if is_max else heap[0]
            if to_remove[val] > 0:
                to_remove[val] -= 1
                heapq.heappop(heap)
            else:
                break

    # Initialize with first k elements
    for i in range(k):
        heapq.heappush(max_heap, -nums[i])
    # Move the larger half to min_heap
    for _ in range(k // 2):
        heapq.heappush(min_heap, -heapq.heappop(max_heap))

    result.append(get_median())

    for i in range(k, len(nums)):
        out_val = nums[i - k]
        in_val = nums[i]

        # Mark element to remove
        to_remove[out_val] += 1

        # Determine which heap the outgoing element belongs to
        balance = -1 if out_val <= -max_heap[0] else 1  # -1 if from max_heap

        # Insert new element
        if max_heap and in_val <= -max_heap[0]:
            heapq.heappush(max_heap, -in_val)
            balance += 1
        else:
            heapq.heappush(min_heap, in_val)
            balance -= 1

        # Rebalance based on net effect
        if balance < 0:  # max_heap lost one net
            heapq.heappush(max_heap, -heapq.heappop(min_heap))
        elif balance > 0:  # min_heap lost one net
            heapq.heappush(min_heap, -heapq.heappop(max_heap))

        # Lazy cleanup
        clean_top(max_heap, True)
        clean_top(min_heap, False)

        result.append(get_median())

    return result

# Test cases
print(sliding_window_median([1, 2, -1, 3, 5], 3))
# Expected: [1.0, 2.0, 3.0]

print(sliding_window_median([1, 3, -1, -3, 5, 3, 6, 7], 3))
# Expected: [1.0, -1.0, -1.0, 3.0, 5.0, 6.0]
`,
    },
    {
      id: "two-heaps-maximize-capital",
      slug: "two-heaps-maximize-capital",
      title: "Maximize Capital",
      content: `# Maximize Capital

## Problem Statement

You are given a set of projects. Each project \`i\` has a **capital requirement** \`capital[i]\` (minimum money needed to start it) and a **profit** \`profits[i]\` (net gain upon completion). Starting with initial capital \`W\`, you can select at most \`k\` projects to maximize your total capital.

After completing a project, its profit is added to your total capital, potentially unlocking more projects.

\`\`\`concept
{
  "title": "Two-Heap Insight",
  "variant": "insight",
  "content": "The key insight is that we need two different orderings: projects by capital requirement (to find what's affordable) and projects by profit (to pick the best). A single data structure can't efficiently answer both questions, so we use two heaps in tandem."
}
\`\`\`

## Examples

**Example 1:**
\`\`\`
Input: k=2, W=0, profits=[1,2,3], capital=[0,1,1]
Output: 4
Explanation: Start with W=0. Pick project 0 (needs 0, profit 1) → W=1.
Pick project 2 (needs 1, profit 3) → W=4.
\`\`\`

**Example 2:**
\`\`\`
Input: k=3, W=0, profits=[1,2,3], capital=[0,1,2]
Output: 6
Explanation: Pick all three projects in order: 0→1→2, total = 0+1+2+3 = 6.
\`\`\`

## Approach

Use two heaps:
1. **Min-heap on capital:** Store all projects sorted by their capital requirement.
2. **Max-heap on profit:** Store all currently affordable projects sorted by profit.

For each of the \`k\` rounds:
1. Move all projects from the min-heap whose capital requirement ≤ current \`W\` into the max-heap.
2. Pick the most profitable project from the max-heap.
3. Add its profit to \`W\`.

If the max-heap is empty at any round, stop early — no affordable projects remain.

\`\`\`algoviz
{
  "title": "Two-Heap Algorithm in Action",
  "type": "array",
  "data": ["W=0", "Projects: [(0,1), (1,2), (1,3)]"],
  "frames": [
    {"highlight": [0], "label": "Start with W=0", "stats": {"capital": 0, "round": 0}},
    {"highlight": [1], "label": "Min-heap by capital: [(0,1), (1,2), (1,3)]", "stats": {"capital": 0, "round": 0}},
    {"highlight": [0], "label": "Move (0,1) to max-heap, pick profit 1", "stats": {"capital": 1, "round": 1}},
    {"highlight": [1], "label": "Max-heap: [(2), (3)] from affordable projects", "stats": {"capital": 1, "round": 1}},
    {"highlight": [0], "label": "Pick profit 3, W becomes 4", "stats": {"capital": 4, "round": 2}}
  ],
  "speed": 1000
}
\`\`\`

**Time Complexity:** O(n log n + k log n) for heap operations.  
**Space Complexity:** O(n) for the two heaps.

\`\`\`quiz
{
  "title": "Two-Heap Strategy Check",
  "questions": [
    {
      "question": "Why use a min-heap for capital requirements?",
      "options": ["To find the most profitable project", "To efficiently find affordable projects as capital grows", "To sort projects by profit", "To reduce space complexity"],
      "answer": 1,
      "explanation": "A min-heap on capital lets us efficiently extract all projects that become affordable as our capital increases, without rescanning the entire list each time."
    },
    {
      "question": "What happens if the max-heap becomes empty during execution?",
      "options": ["Continue with next round", "Stop early - no more projects can be done", "Restart from beginning", "Use the min-heap instead"],
      "answer": 1,
      "explanation": "An empty max-heap means no projects are currently affordable with available capital, so we must terminate early."
    },
    {
      "question": "Why is the greedy strategy of always picking the most profitable project optimal?",
      "options": ["Because profits are pure gains that increase capital", "Because it minimizes risk", "Because it balances capital and profit", "Because it reduces time complexity"],
      "answer": 0,
      "explanation": "Since profits are pure gains that only increase our capital (unlocking more projects), always choosing the highest profit maximizes our final capital."
    }
  ]
}
\`\`\`

\`\`\`steps
{
  "title": "Implementing the Two-Heap Solution",
  "steps": [
    {
      "title": "Step 1: Prepare the data",
      "content": "Combine profits and capital into project tuples and build a min-heap based on capital requirements. This gives us O(1) access to the project with the smallest capital requirement."
    },
    {
      "title": "Step 2: Main selection loop",
      "content": "For each of the k rounds: First, transfer all newly affordable projects from the capital min-heap to the profit max-heap. Then select the most profitable project from the max-heap."
    },
    {
      "title": "Step 3: Early termination",
      "content": "If at any point the profit max-heap is empty after transferring affordable projects, terminate early - no more projects can be completed with current capital."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Maximize Capital Implementation",
  "language": "python",
  "code": "import heapq\\n\\ndef maximize_capital(k, w, profits, capital):\\n    # Create min-heap of (capital_required, profit)\\n    capital_heap = []\\n    for i in range(len(profits)):\\n        heapq.heappush(capital_heap, (capital[i], profits[i]))\\n    \\n    # Max-heap for profits (use negative values)\\n    profit_heap = []\\n    \\n    for _ in range(k):\\n        # Move affordable projects to profit heap\\n        while capital_heap and capital_heap[0][0] <= w:\\n            cap, prof = heapq.heappop(capital_heap)\\n            heapq.heappush(profit_heap, -prof)  # negative for max-heap\\n        \\n        if not profit_heap:\\n            break\\n        \\n        # Pick most profitable project\\n        w += -heapq.heappop(profit_heap)\\n    \\n    return w\\n\\n# Test with example 1\\nprint(maximize_capital(2, 0, [1,2,3], [0,1,1]))  # Expected: 4",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Two heaps solve the dual ordering problem: min-heap for capital requirements, max-heap for profits",
    "Greedy selection is optimal because profits are pure gains that only increase available capital",
    "Time complexity O(n log n + k log n) comes from heap operations, space complexity is O(n)",
    "Early termination when profit heap is empty handles cases where capital is insufficient for remaining projects"
  ]
}
\`\`\``,
      starterCode: `import heapq

def find_maximum_capital(capital, profits, k, initial_capital):
    # TODO: Return the maximum capital after selecting at most k projects
    pass

# Test cases
print(find_maximum_capital([0, 1, 1], [1, 2, 3], 2, 0))
# Expected: 4

print(find_maximum_capital([0, 1, 2], [1, 2, 3], 3, 0))
# Expected: 6
`,
      solutionCode: `import heapq

def find_maximum_capital(capital, profits, k, initial_capital):
    n = len(capital)
    # Min-heap: (capital_required, index)
    min_capital_heap = []
    for i in range(n):
        heapq.heappush(min_capital_heap, (capital[i], i))

    # Max-heap for profits of affordable projects (store negated)
    max_profit_heap = []
    current_capital = initial_capital

    for _ in range(k):
        # Move all affordable projects to profit heap
        while min_capital_heap and min_capital_heap[0][0] <= current_capital:
            cap, idx = heapq.heappop(min_capital_heap)
            heapq.heappush(max_profit_heap, -profits[idx])

        if not max_profit_heap:
            break  # No affordable projects

        # Pick the most profitable project
        current_capital += -heapq.heappop(max_profit_heap)

    return current_capital

# Test cases
print(find_maximum_capital([0, 1, 1], [1, 2, 3], 2, 0))
# Expected: 4

print(find_maximum_capital([0, 1, 2], [1, 2, 3], 3, 0))
# Expected: 6
`,
    },
    {
      id: "two-heaps-next-interval",
      slug: "two-heaps-next-interval",
      title: "Next Interval",
      content: `# Next Interval

## Problem Statement

Given an array of intervals where each interval is \`[start, end]\`, for each interval find the index of the **next interval** — the interval whose start is greater than or equal to the current interval's end. If no such interval exists, return \`-1\` for that position.

\`\`\`concept
{
  "title": "What is a \\"Next Interval\\"?",
  "variant": "mental-model",
  "content": "Think of intervals as train schedules. The \\"next interval\\" is the earliest departing train that leaves *after* your current train arrives. You're looking for the smallest \`start_j\` that is ≥ your \`end_i\`."
}
\`\`\`

## Examples

**Example 1:**
\`\`\`
Input: intervals = [[2,3],[3,4],[5,6]]
Output: [1, 2, -1]
Explanation: Next for [2,3] is [3,4] (index 1). Next for [3,4] is [5,6] (index 2). No next for [5,6].
\`\`\`

**Example 2:**
\`\`\`
Input: intervals = [[3,4],[1,5],[4,6]]
Output: [2, -1, -1]
Explanation: Next for [3,4] is [4,6]. No interval starts at 5 or later for [1,5] or at 6+ for [4,6].
\`\`\`

## Approach

Use two max-heaps:
1. **Max-heap on start:** Stores (start_value, original_index). We process from the largest start downward.
2. **Max-heap on end:** Stores (end_value, original_index).

Process intervals by largest end value first. For each interval (popped from the end-heap), pop from the start-heap until the top start is the smallest that is still ≥ current end. Record that as the next interval. Push back the last valid candidate so it can serve subsequent queries.

\`\`\`steps
{
  "title": "Two-Heap Algorithm Walkthrough",
  "steps": [
    {
      "title": "Build the heaps",
      "content": "Create two max-heaps:\\n- **startHeap**: (start_i, index_i) for every interval\\n- **endHeap**: (end_i, index_i) for every interval"
    },
    {
      "title": "Process largest end first",
      "content": "Pop from **endHeap** to get the interval with the current largest \`end\` value. This guarantees we handle intervals in descending end order."
    },
    {
      "title": "Find minimal valid start",
      "content": "While **startHeap**'s top start ≥ current end, pop and keep the *last* valid candidate. Push that candidate back so later intervals can reuse it."
    },
    {
      "title": "Record result",
      "content": "The last valid candidate’s index is the next interval. If none exists, record -1."
    }
  ]
}
\`\`\`

\`\`\`algoviz
{
  "title": "Heap Evolution on [[2,3],[3,4],[5,6]]",
  "type": "array",
  "data": [[2,3],[3,4],[5,6]],
  "frames": [
    {
      "highlight": [0,1,2],
      "label": "Initial heaps built",
      "stats": { "endHeap": "[[3,0],[4,1],[6,2]]", "startHeap": "[[2,0],[3,1],[5,2]]" }
    },
    {
      "highlight": [2],
      "label": "Pop [5,6] from endHeap",
      "stats": { "endHeap": "[[3,0],[4,1]]", "startHeap": "[[2,0],[3,1],[5,2]]" }
    },
    {
      "highlight": [],
      "label": "No start ≥ 6 → result[2] = -1",
      "stats": { "result": "[_,_,-1]" }
    },
    {
      "highlight": [1],
      "label": "Pop [3,4] from endHeap",
      "stats": { "endHeap": "[[3,0]]", "startHeap": "[[2,0],[3,1],[5,2]]" }
    },
    {
      "highlight": [2],
      "label": "Pop [5,2] from startHeap (5 ≥ 4), keep it",
      "stats": { "result": "[_,2,-1]" }
    },
    {
      "highlight": [0],
      "label": "Pop [2,3] from endHeap",
      "stats": { "endHeap": "[]", "startHeap": "[[2,0],[3,1],[5,2]]" }
    },
    {
      "highlight": [1],
      "label": "Pop [3,1] from startHeap (3 ≥ 3), keep it",
      "stats": { "result": "[1,2,-1]" }
    }
  ],
  "speed": 1000
}
\`\`\`

**Time Complexity:** O(n log n) for heap operations.  
**Space Complexity:** O(n) for heaps and the result array.

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Why do we process intervals by largest end first?",
      "options": [
        "To guarantee we always have the smallest valid start candidate available",
        "To minimize heap size",
        "To avoid duplicate indices",
        "To satisfy the problem’s output order"
      ],
      "answer": 0,
      "explanation": "Largest-end-first ensures that any start we pop from the start-heap is the minimal valid candidate for the current end, because we discard larger starts that are still ≥ current end."
    },
    {
      "question": "What happens if we forget to push the last valid start candidate back into the start-heap?",
      "options": [
        "The algorithm still works but becomes O(n²)",
        "Later intervals may incorrectly receive -1",
        "The heaps become unbalanced",
        "Nothing; it is an optimization only"
      ],
      "answer": 1,
      "explanation": "Without pushing the candidate back, subsequent intervals with smaller ends lose access to that start, potentially causing false negatives."
    },
    {
      "question": "Which heap operation dominates the overall time complexity?",
      "options": [
        "Heapify on initialization",
        "Pop from end-heap",
        "Pop from start-heap inside the while loop",
        "Push back the valid candidate"
      ],
      "answer": 2,
      "explanation": "In the worst case every interval is popped from the start-heap once per end-heap pop, yielding O(n log n) total cost."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Implement Next Interval",
  "language": "python",
  "code": "import heapq\\n\\ndef find_next_interval(intervals):\\n    n = len(intervals)\\n    result = [-1] * n\\n    \\n    # Max-heaps (stored as negative for min-heap simulation)\\n    start_heap = []\\n    end_heap = []\\n    \\n    for i in range(n):\\n        s, e = intervals[i]\\n        heapq.heappush(start_heap, (-s, i))\\n        heapq.heappush(end_heap, (-e, i))\\n    \\n    # Process intervals by largest end\\n    while end_heap:\\n        neg_end, idx = heapq.heappop(end_heap)\\n        cur_end = -neg_end\\n        \\n        # Find minimal start >= cur_end\\n        last_valid = None\\n        while start_heap and -start_heap[0][0] >= cur_end:\\n            last_valid = heapq.heappop(start_heap)\\n        \\n        if last_valid:\\n            result[idx] = last_valid[1]\\n            # Push the candidate back for future use\\n            heapq.heappush(start_heap, last_valid)\\n    \\n    return result\\n\\n# Quick test\\nprint(find_next_interval([[2,3],[3,4],[5,6]]))  # Expected: [1, 2, -1]",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Two heaps let you efficiently match intervals by simultaneously tracking largest ends and largest starts.",
    "Processing largest end first ensures the start-heap pop sequence yields the minimal valid candidate.",
    "Always return the last valid candidate to the heap so subsequent queries can reuse it.",
    "Overall complexity is O(n log n) time and O(n) space — optimal for this problem."
  ]
}
\`\`\``,
      starterCode: `import heapq

def find_next_interval(intervals):
    # TODO: Return a list where result[i] is the index of the next interval for intervals[i]
    n = len(intervals)
    result = [-1] * n
    return result

# Test cases
print(find_next_interval([[2,3],[3,4],[5,6]]))
# Expected: [1, 2, -1]

print(find_next_interval([[3,4],[1,5],[4,6]]))
# Expected: [2, -1, -1]
`,
      solutionCode: `import heapq

def find_next_interval(intervals):
    n = len(intervals)
    result = [-1] * n

    # Max-heaps (negate for max behavior)
    start_heap = []  # (-start, index)
    end_heap = []    # (-end, index)

    for i, interval in enumerate(intervals):
        heapq.heappush(start_heap, (-interval[0], i))
        heapq.heappush(end_heap, (-interval[1], i))

    while end_heap:
        end_val, end_idx = heapq.heappop(end_heap)
        end_val = -end_val

        # Find the interval with the smallest start >= end_val
        candidate = None
        while start_heap and -start_heap[0][0] >= end_val:
            candidate = heapq.heappop(start_heap)

        if candidate is not None:
            result[end_idx] = candidate[1]
            # Push candidate back — it might be the answer for other intervals too
            heapq.heappush(start_heap, candidate)

    return result

# Test cases
print(find_next_interval([[2,3],[3,4],[5,6]]))
# Expected: [1, 2, -1]

print(find_next_interval([[3,4],[1,5],[4,6]]))
# Expected: [2, -1, -1]
`,
    },
    {
      id: "two-heaps-kth-largest-stream",
      slug: "two-heaps-kth-largest-stream",
      title: "Kth Largest Element in a Stream",
      content: `# Kth Largest Element in a Stream

\`\`\`concept
{ "title": "The Min-Heap Insight", "variant": "mental-model", "content": "Imagine a VIP list that only has room for k names. Every time a new celebrity shows up, you compare them to the least-important person on the list. If the newcomer is more famous, they bump the weakest name off. The person at the bottom of that list is automatically the k-th most famous overall — no need to scan the whole crowd." }
\`\`\`

## Problem Statement

Design a class that takes an integer \`k\` and an initial list of numbers. It should support an \`add(val)\` method that adds a new value and returns the kth largest element in the current collection.

## Examples

**Example 1:**
\`\`\`
KthLargest(3, [4, 5, 8, 2])
add(3) → 4   (sorted: [2,3,4,5,8], 3rd largest = 4)
add(5) → 5   (sorted: [2,3,4,5,5,8], 3rd largest = 5)
add(10) → 5  (sorted: [2,3,4,5,5,8,10], 3rd largest = 5)
\`\`\`

**Example 2:**
\`\`\`
KthLargest(1, [])
add(3) → 3
add(5) → 5
add(2) → 5
\`\`\`

## Approach

Use a **min-heap of size k**. The top of this min-heap is always the kth largest element.

1. Initialize by adding all numbers and keeping only the k largest.
2. On \`add(val)\`:
   - If the heap has fewer than k elements, push val.
   - If val > heap top, pop the top and push val (val displaces the smallest of the top-k).
   - Return the heap top.

This works because a min-heap of size k naturally keeps the k largest seen values, with the smallest of those k at the root — which is exactly the kth largest overall.

**Time Complexity:** O(log k) per add call.  
**Space Complexity:** O(k) for the heap.

\`\`\`algoviz
{ "title": "Heap Evolution for k = 3", "type": "array", "data": [4, 5, 8],
  "frames": [
    { "highlight": [], "label": "initial nums = [4,5,8], k=3 → heap = [4,5,8]" },
    { "highlight": [0], "label": "add(3): 3 ≤ 4 → ignore, heap unchanged, return 4" },
    { "highlight": [0], "label": "add(5): 5 > 4 → pop 4, push 5 → heap = [5,5,8], return 5" },
    { "highlight": [0], "label": "add(10): 10 > 5 → pop 5, push 10 → heap = [5,8,10], return 5" }
  ],
  "speed": 1000 }
\`\`\`

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Naïve: sort every time", "code": "class KthLargest:\\n    def __init__(self, k, nums):\\n        self.k = k\\n        self.nums = nums\\n    def add(self, val):\\n        self.nums.append(val)\\n        self.nums.sort()          # O(N log N) each call\\n        return self.nums[-self.k]" },
  "after": { "label": "Heap: keep only k winners", "code": "import heapq\\nclass KthLargest:\\n    def __init__(self, k, nums):\\n        self.k = k\\n        self.h = []\\n        for n in nums:\\n            self.add(n)           # reuse logic below\\n    def add(self, val):\\n        if len(self.h) < self.k:\\n            heapq.heappush(self.h, val)\\n        elif val > self.h[0]:\\n            heapq.heapreplace(self.h, val)\\n        return self.h[0]          # O(log k) per call" } }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Intuition", "questions": [
  { "question": "Why use a min-heap instead of a max-heap?", "options": ["Min-heap keeps the k largest naturally", "Max-heap is slower", "Min-heap uses less memory"], "answer": 0, "explanation": "The root of a size-k min-heap is the smallest among the k largest values — exactly the kth largest." },
  { "question": "What happens when the heap already has k elements and the new value is smaller than the current root?", "options": ["We push it anyway", "We discard it immediately", "We replace the root with it"], "answer": 1, "explanation": "The newcomer can't break into the top-k, so we ignore it and the heap stays unchanged." },
  { "question": "If k = 1, what does the heap contain after every add?", "options": ["The single largest value seen so far", "The smallest value", "All values"], "answer": 0, "explanation": "A size-1 min-heap keeps only the maximum element seen; its root is the 1st largest." }
] }
\`\`\`

\`\`\`playground
{ "title": "Implement KthLargest", "language": "python", "code": "import heapq\\n\\nclass KthLargest:\\n    def __init__(self, k: int, nums: list[int]):\\n        # your code here\\n        pass\\n    \\n    def add(self, val: int) -> int:\\n        # your code here\\n        return 0\\n\\n# quick test\\nk = KthLargest(3, [4, 5, 8, 2])\\nprint(k.add(3))  # expected 4\\nprint(k.add(5))  # expected 5\\nprint(k.add(10)) # expected 5", "runnable": true }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "A min-heap of fixed size k is the canonical structure for streaming kth-largest queries.",
  "Each add costs O(log k) time and O(k) space — independent of how many numbers have been seen.",
  "The root of the heap is the answer; no extra scans or sorting needed."
] }
\`\`\``,
      starterCode: `import heapq

class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.heap = []
        # TODO: Initialize the heap with the k largest from nums

    def add(self, val):
        # TODO: Add val and return the kth largest element
        pass

# Test cases
kl = KthLargest(3, [4, 5, 8, 2])
print(kl.add(3))   # Expected: 4
print(kl.add(5))   # Expected: 5
print(kl.add(10))  # Expected: 5

kl2 = KthLargest(1, [])
print(kl2.add(3))  # Expected: 3
print(kl2.add(5))  # Expected: 5
print(kl2.add(2))  # Expected: 5
`,
      solutionCode: `import heapq

class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.heap = []
        for num in nums:
            heapq.heappush(self.heap, num)
            if len(self.heap) > k:
                heapq.heappop(self.heap)

    def add(self, val):
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]

# Test cases
kl = KthLargest(3, [4, 5, 8, 2])
print(kl.add(3))   # Expected: 4
print(kl.add(5))   # Expected: 5
print(kl.add(10))  # Expected: 5

kl2 = KthLargest(1, [])
print(kl2.add(3))  # Expected: 3
print(kl2.add(5))  # Expected: 5
print(kl2.add(2))  # Expected: 5
`,
    },
  ],
};
