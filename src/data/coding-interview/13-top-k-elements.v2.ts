import { Module } from "../types";

export const topKElementsModule: Module = {
  id: "top-k-elements",
  title: "Top K Elements",
  description: "Use heaps to efficiently find the top, bottom, or most frequent K elements in a dataset.",
  lessons: [
    {
      id: "top-k-elements-intro",
      slug: "top-k-elements-intro",
      title: "Introduction to Top K Elements",
      content: `# Top K Elements Pattern

The **Top K Elements** pattern uses a heap to efficiently find the K largest, smallest, or most frequent elements without fully sorting the data.

## Core Idea

To find the **K largest** elements, maintain a **min-heap of size K**. As you scan through the data:
- If the heap has fewer than K elements, push the current element.
- If the current element is larger than the heap's minimum (root), pop the root and push the current element.

After processing all elements, the heap contains exactly the K largest. The heap root is the Kth largest.

\`\`\`concept
{
  "title": "Heap Selection Logic",
  "variant": "mental-model",
  "content": "Think of the min-heap as a \\"VIP club\\" with exactly K spots. New elements can only enter if they're \\"cooler\\" (larger) than the least cool person currently inside. This ensures only the top K elements remain."
}
\`\`\`

\`\`\`algoviz
{
  "title": "Finding Top 3 Elements",
  "type": "array",
  "data": [8, 3, 10, 5, 2, 7, 9],
  "frames": [
    {"highlight": [0], "label": "Start with empty heap", "stats": {"heap": "[]", "k": 3}},
    {"highlight": [0], "label": "Push 8 (heap < K)", "stats": {"heap": "[8]", "k": 3}},
    {"highlight": [1], "label": "Push 3 (heap < K)", "stats": {"heap": "[3, 8]", "k": 3}},
    {"highlight": [2], "label": "Push 10 (heap < K)", "stats": {"heap": "[3, 8, 10]", "k": 3}},
    {"highlight": [3], "label": "5 > 3? Replace 3 with 5", "stats": {"heap": "[5, 8, 10]", "k": 3}},
    {"highlight": [4], "label": "2 < 5? Skip", "stats": {"heap": "[5, 8, 10]", "k": 3}},
    {"highlight": [5], "label": "7 > 5? Replace 5 with 7", "stats": {"heap": "[7, 8, 10]", "k": 3}},
    {"highlight": [6], "label": "9 > 7? Replace 7 with 9", "stats": {"heap": "[8, 9, 10]", "k": 3}}
  ],
  "speed": 1000
}
\`\`\`

## Why Not Just Sort?

Sorting costs O(n log n). A heap-based approach costs O(n log K). When K is much smaller than n, this is a significant improvement. For example, finding the top 10 elements in a million-element array: sorting does ~20 million comparisons, while the heap approach does ~200,000.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Full Sort Approach",
    "code": "# O(n log n) time\\ndef top_k_sort(arr, k):\\n    arr.sort()  # Sorts entire array\\n    return arr[-k:]  # Take last k elements\\n\\n# 1M elements: ~20M comparisons"
  },
  "after": {
    "label": "Heap Approach",
    "code": "# O(n log k) time\\ndef top_k_heap(arr, k):\\n    heap = []\\n    for num in arr:\\n        if len(heap) < k:\\n            heapq.heappush(heap, num)\\n        elif num > heap[0]:\\n            heapq.heapreplace(heap, num)\\n    return heap\\n\\n# 1M elements, k=10: ~200K comparisons"
  }
}
\`\`\`

## Python heapq Module

\`\`\`python
import heapq

# K smallest elements (direct)
heapq.nsmallest(k, iterable)

# K largest elements
heapq.nlargest(k, iterable)

# Manual min-heap operations
heapq.heappush(heap, val)
heapq.heappop(heap)        # removes smallest
heap[0]                     # peek at smallest
\`\`\`

For K largest using a min-heap manually, \`heapq.nlargest\` is convenient, but understanding the manual approach is essential for interviews.

\`\`\`playground
{
  "title": "Heap Operations Practice",
  "language": "python",
  "code": "import heapq\\n\\ndef find_top_k_students(scores, k):\\n    \\"\\"\\"\\n    Find top k students by score.\\n    scores: list of (name, score) tuples\\n    \\"\\"\\"\\n    # Your code here\\n    pass\\n\\n# Test data\\nscores = [\\n    (\\"Alice\\", 95), (\\"Bob\\", 87), (\\"Carol\\", 92),\\n    (\\"David\\", 88), (\\"Eve\\", 96), (\\"Frank\\", 85)\\n]\\n\\n# Expected: Top 3 students by score\\nprint(find_top_k_students(scores, 3))",
  "runnable": true
}
\`\`\`

## Pattern Variations

- **K largest:** Use min-heap of size K.
- **K smallest:** Use max-heap of size K (negate values in Python).
- **K most frequent:** Count frequencies first, then use a heap on the counts.
- **K closest:** Use max-heap on distances, keeping K smallest distances.

\`\`\`quiz
{
  "title": "Heap Selection Strategy",
  "questions": [
    {
      "question": "To find the K smallest elements, which heap should you use?",
      "options": ["Min-heap of size K", "Max-heap of size K", "Min-heap of size N", "Max-heap of size N"],
      "answer": 1,
      "explanation": "Use a max-heap of size K. The largest element in your K candidates is at the root, so you can efficiently remove it when you find a smaller element."
    },
    {
      "question": "What's the time complexity of finding top K elements using a heap?",
      "options": ["O(N log N)", "O(N log K)", "O(N + K)", "O(K log N)"],
      "answer": 1,
      "explanation": "O(N log K) - you process N elements, and each heap operation (push/pop) takes O(log K) time since the heap size is at most K."
    },
    {
      "question": "When is heap approach significantly better than sorting?",
      "options": ["When K > N/2", "When K << N", "When K = N", "Always better"],
      "answer": 1,
      "explanation": "When K is much smaller than N (K << N), the O(N log K) heap approach is significantly faster than O(N log N) sorting."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use min-heap of size K for finding K largest/most frequent elements",
    "Heap approach gives O(N log K) vs O(N log N) for full sorting",
    "Python's heapq module provides both manual operations and convenience functions",
    "For K smallest elements, use max-heap (negate values in Python)",
    "The heap root always contains the Kth largest/smallest element"
  ]
}
\`\`\``,
    },
    {
      id: "top-k-numbers",
      slug: "top-k-numbers",
      title: "Top K Numbers",
      content: `# Top K Numbers

## Problem Statement

Given an unsorted array of numbers, find the **K largest numbers** in it. Return them in any order.

\`\`\`concept
{
  "title": "The Min-Heap Insight",
  "variant": "mental-model",
  "content": "Imagine you're a bouncer at an exclusive club that only allows K people inside. You always keep the shortest person at the door. When someone taller arrives, you remove the shortest person and let the taller one in. This way, you always have the K tallest people inside — without ever sorting everyone by height."
}
\`\`\`

## Examples

**Example 1:**
\`\`\`
Input: nums = [3, 1, 5, 12, 2, 11], k = 3
Output: [5, 12, 11]
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [5, 12, 11, -1, 12], k = 3
Output: [12, 11, 12]
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [1, 2, 3], k = 2
Output: [2, 3]
\`\`\`

## Approach

Use a **min-heap of size K**:

1. Push the first K elements onto the min-heap.
2. For each remaining element, if it is greater than the heap's root (the smallest of the K largest so far), replace the root.
3. The heap now holds the K largest elements.

The min-heap ensures the smallest of the top-K is always accessible at the root. Any element smaller than the root is guaranteed not to be in the top K.

\`\`\`algoviz
{
  "title": "Finding Top 3 from [3, 1, 5, 12, 2, 11]",
  "type": "array",
  "data": [3, 1, 5, 12, 2, 11],
  "frames": [
    {"highlight": [0, 1, 2], "label": "Build initial heap with first 3 elements", "stats": {"heap": "[1, 3, 5]", "action": "initialize"}},
    {"highlight": [3], "label": "12 > 1 (root)? Yes → replace", "stats": {"heap": "[3, 12, 5]", "action": "replace"}},
    {"highlight": [4], "label": "2 > 3? No → skip", "stats": {"heap": "[3, 12, 5]", "action": "skip"}},
    {"highlight": [5], "label": "11 > 3? Yes → replace", "stats": {"heap": "[5, 12, 11]", "action": "replace"}}
  ],
  "speed": 1000
}
\`\`\`

**Time Complexity:** O(n log K) — each of the n elements may trigger a heap push/pop of O(log K).  
**Space Complexity:** O(K) for the heap.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Naïve: Sort & Slice",
    "code": "def top_k(nums, k):\\n    return sorted(nums, reverse=True)[:k]\\n# O(n log n) time, O(n) space"
  },
  "after": {
    "label": "Heap Strategy",
    "code": "import heapq\\ndef top_k(nums, k):\\n    heap = nums[:k]\\n    heapq.heapify(heap)\\n    for x in nums[k:]:\\n        if x > heap[0]:\\n            heapq.heapreplace(heap, x)\\n    return heap\\n# O(n log k) time, O(k) space"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Heap Behavior Check",
  "questions": [
    {
      "question": "After processing [10, 7, 15, 3, 8] with k=3, what does the min-heap contain?",
      "options": ["[7, 8, 10]", "[3, 7, 8]", "[8, 10, 15]", "[7, 10, 15]"],
      "answer": 0,
      "explanation": "The heap keeps the three largest values seen so far: 7, 8, 10 (with 7 at the root)."
    },
    {
      "question": "If k equals the array length, what is the time complexity?",
      "options": ["O(n log n)", "O(n log k)", "O(n)", "O(k log n)"],
      "answer": 0,
      "explanation": "When k = n we heapify the entire array and effectively perform a heap-sort, yielding O(n log n)."
    },
    {
      "question": "Why prefer a min-heap over a max-heap for top-K largest?",
      "options": ["Min-heap gives direct access to the Kth largest", "Max-heap can't store K elements", "Min-heap uses less memory", "Max-heap is slower"],
      "answer": 0,
      "explanation": "The min-heap root is the smallest of the K largest, making eviction decisions constant-time."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Top K Largest",
  "language": "python",
  "code": "import heapq\\n\\ndef top_k(nums, k):\\n    \\"\\"\\"Return the k largest numbers in any order.\\"\\"\\"\\n    if k == 0:\\n        return []\\n    # Build a min-heap with the first k elements\\n    heap = nums[:k]\\n    heapq.heapify(heap)\\n    # Replace smaller roots with larger newcomers\\n    for x in nums[k:]:\\n        if x > heap[0]:          # current smallest of top-k\\n            heapq.heapreplace(heap, x)\\n    return heap\\n\\n# ---- Test ----\\nprint(top_k([3, 1, 5, 12, 2, 11], 3))\\nprint(top_k([5, 12, 11, -1, 12], 3))\\nprint(top_k([1, 2, 3], 2))",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "A min-heap of size K efficiently tracks the K largest values seen so far.",
    "Each element triggers at most one O(log K) heap operation, giving O(N log K) total time.",
    "Space usage is O(K), making the algorithm streaming-friendly.",
    "The same pattern (with a max-heap) finds the K smallest elements."
  ]
}
\`\`\``,
      starterCode: `import heapq

def find_k_largest(nums, k):
    # TODO: Return the k largest numbers
    pass

# Test cases
print(find_k_largest([3, 1, 5, 12, 2, 11], 3))
# Expected: [5, 12, 11]

print(find_k_largest([5, 12, 11, -1, 12], 3))
# Expected: [12, 11, 12]

print(find_k_largest([1, 2, 3], 2))
# Expected: [2, 3]
`,
      solutionCode: `import heapq

def find_k_largest(nums, k):
    min_heap = []

    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)

    return list(min_heap)

# Test cases
print(find_k_largest([3, 1, 5, 12, 2, 11], 3))
# Expected: [5, 12, 11]

print(find_k_largest([5, 12, 11, -1, 12], 3))
# Expected: [12, 11, 12]

print(find_k_largest([1, 2, 3], 2))
# Expected: [2, 3]
`,
    },
    {
      id: "top-k-kth-smallest",
      slug: "top-k-kth-smallest",
      title: "Kth Smallest Number",
      content: `# Kth Smallest Number

## Problem Statement

Given an unsorted array and a number K, find the **Kth smallest** element in the array.

## Examples

**Example 1:**
\`\`\`
Input: nums = [1, 5, 12, 2, 11, 5], k = 3
Output: 5
Explanation: Sorted: [1, 2, 5, 5, 11, 12], 3rd smallest = 5
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [7, 10, 4, 3, 20, 15], k = 4
Output: 10
Explanation: Sorted: [3, 4, 7, 10, 15, 20], 4th smallest = 10
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [1, 2, 3], k = 1
Output: 1
\`\`\`

## Approach

\`\`\`concept
{
  "title": "Max-Heap Intuition",
  "variant": "mental-model",
  "content": "Imagine you're a bouncer at an exclusive club that only allows K people inside. Your job is to keep track of the K smallest people who've shown up. You always know who the largest person in your club is (the root of the max-heap), and whenever someone smaller arrives, you kick out the largest person and let the newcomer in. After everyone has shown up, the largest person remaining in your club is exactly the Kth smallest person overall."
}
\`\`\`

The most efficient approach uses a **max-heap of size K**:

1. Push the first K elements onto the heap (negated for Python's min-heap)
2. For each remaining element, if it's smaller than the heap's root, replace the root
3. After processing all elements, the root is the Kth smallest

\`\`\`algoviz
{
  "title": "Max-Heap Algorithm Visualization",
  "type": "array",
  "data": [1, 5, 12, 2, 11, 5],
  "frames": [
    {"highlight": [0, 1, 2], "label": "Initialize heap with first 3 elements: [1, 5, 12]", "stats": {"heap": "[12, 5, 1]", "k": 3}},
    {"highlight": [3], "label": "Process element 2: smaller than heap root (12), replace it", "stats": {"heap": "[5, 2, 1]", "k": 3}},
    {"highlight": [4], "label": "Process element 11: larger than heap root (5), skip it", "stats": {"heap": "[5, 2, 1]", "k": 3}},
    {"highlight": [5], "label": "Process element 5: equal to heap root (5), no change needed", "stats": {"heap": "[5, 2, 1]", "k": 3}},
    {"highlight": [1], "label": "Final result: heap root is 5, the 3rd smallest element", "stats": {"result": 5, "k": 3}}
  ],
  "speed": 1000
}
\`\`\`

## Implementation

\`\`\`playground
{
  "title": "Kth Smallest Implementation",
  "language": "python",
  "code": "import heapq\\n\\ndef find_kth_smallest(nums, k):\\n    # Use max-heap by negating values\\n    max_heap = []\\n    \\n    # Add first k elements\\n    for i in range(k):\\n        heapq.heappush(max_heap, -nums[i])\\n    \\n    # Process remaining elements\\n    for i in range(k, len(nums)):\\n        if nums[i] < -max_heap[0]:  # Current element is smaller than largest in heap\\n            heapq.heappop(max_heap)\\n            heapq.heappush(max_heap, -nums[i])\\n    \\n    return -max_heap[0]\\n\\n# Test the implementation\\ntest_cases = [\\n    ([1, 5, 12, 2, 11, 5], 3),\\n    ([7, 10, 4, 3, 20, 15], 4),\\n    ([1, 2, 3], 1)\\n]\\n\\nfor nums, k in test_cases:\\n    result = find_kth_smallest(nums, k)\\n    print(f\\"Array: {nums}, k={k} -> {result}\\")",
  "runnable": true
}
\`\`\`

## Complexity Analysis

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Naive Sorting Approach",
    "code": "def find_kth_smallest_sort(nums, k):\\n    nums.sort()  # Sort entire array\\n    return nums[k-1]  # O(n log n) time"
  },
  "after": {
    "label": "Max-Heap Approach",
    "code": "def find_kth_smallest_heap(nums, k):\\n    max_heap = []\\n    for i in range(k):\\n        heapq.heappush(max_heap, -nums[i])\\n    \\n    for i in range(k, len(nums)):\\n        if nums[i] < -max_heap[0]:\\n            heapq.heappop(max_heap)\\n            heapq.heappush(max_heap, -nums[i])\\n    \\n    return -max_heap[0]  # O(n log k) time"
  }
}
\`\`\`

**Time Complexity:** O(n log K) - Each of n elements might involve a heap operation
**Space Complexity:** O(K) - Only storing K elements in the heap

\`\`\`callout
{
  "type": "tip",
  "title": "When to Use Each Approach",
  "content": "Use the max-heap approach when K is small relative to n (K << n). If K is close to n (like finding the 2nd largest element), sorting might be simpler. For very large datasets where K is small, the heap approach saves significant memory and time."
}
\`\`\`

## Common Pitfalls

\`\`\`steps
{
  "title": "Avoid These Mistakes",
  "steps": [
    {
      "title": "Forgetting to Negate Values",
      "content": "Python's \`heapq\` only implements min-heaps. To simulate a max-heap, you must negate values when pushing and negate again when popping."
    },
    {
      "title": "Off-by-One Errors",
      "content": "Remember that Kth smallest means index K-1 in a sorted array, not index K. Also ensure your heap size never exceeds K."
    },
    {
      "title": "Handling Duplicates",
      "content": "The algorithm naturally handles duplicates. If multiple elements have the same value as the Kth smallest, any of them is a valid answer."
    }
  ]
}
\`\`\`

## Practice Quiz

\`\`\`quiz
{
  "title": "Test Your Understanding",
  "questions": [
    {
      "question": "What is the time complexity of finding the Kth smallest element using a max-heap?",
      "options": ["O(n)", "O(n log n)", "O(n log k)", "O(k log n)"],
      "answer": 2,
      "explanation": "We process n elements, and each heap operation takes O(log k) time, resulting in O(n log k) overall complexity."
    },
    {
      "question": "Why do we negate values when using Python's heapq for this problem?",
      "options": ["To handle negative numbers", "To simulate a max-heap", "To improve performance", "To handle duplicates"],
      "answer": 1,
      "explanation": "Python's heapq only provides min-heap functionality. By negating values, we can simulate a max-heap where the largest element is always at the root."
    },
    {
      "question": "For the array [3, 1, 4, 1, 5, 9, 2, 6], what is the 4th smallest element?",
      "options": ["3", "4", "5", "2"],
      "answer": 0,
      "explanation": "Sorted array: [1, 1, 2, 3, 4, 5, 6, 9]. The 4th smallest element is at index 3, which is 3."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use a max-heap of size K to efficiently find the Kth smallest element in O(n log k) time",
    "Python's heapq requires negating values to simulate a max-heap",
    "This approach is optimal when K is much smaller than n, saving both time and space",
    "The same technique works for finding the Kth largest element by using a min-heap instead"
  ]
}
\`\`\``,
      starterCode: `import heapq

def find_kth_smallest(nums, k):
    # TODO: Return the kth smallest element
    pass

# Test cases
print(find_kth_smallest([1, 5, 12, 2, 11, 5], 3))
# Expected: 5

print(find_kth_smallest([7, 10, 4, 3, 20, 15], 4))
# Expected: 10

print(find_kth_smallest([1, 2, 3], 1))
# Expected: 1
`,
      solutionCode: `import heapq

def find_kth_smallest(nums, k):
    max_heap = []

    for num in nums:
        heapq.heappush(max_heap, -num)
        if len(max_heap) > k:
            heapq.heappop(max_heap)

    return -max_heap[0]

# Test cases
print(find_kth_smallest([1, 5, 12, 2, 11, 5], 3))
# Expected: 5

print(find_kth_smallest([7, 10, 4, 3, 20, 15], 4))
# Expected: 10

print(find_kth_smallest([1, 2, 3], 1))
# Expected: 1
`,
    },
    {
      id: "top-k-closest-points",
      slug: "top-k-closest-points",
      title: "K Closest Points to Origin",
      content: `# K Closest Points to Origin

\`\`\`concept
{"title": "The Squared-Distance Trick", "variant": "insight", "content": "Skip the expensive sqrt() call. Since √(x² + y²) preserves ordering, comparing x² + y² is enough to decide which point is closer. This keeps everything in integer arithmetic and avoids floating-point error."}
\`\`\`

## Problem Statement

Given an array of 2-D points, return the **K closest points** to the origin (0, 0).  
Distance is Euclidean, but order inside the answer does **not** matter.

**Input:**  
\`points = [[x1,y1], [x2,y2], …]\`  
\`k\` – positive integer ≤ number of points

**Output:**  
Any list containing exactly \`k\` of those points that are nearest to (0, 0).

## Examples

**Example 1**  
Input: \`points = [[1,2],[1,3]], k = 1\`  
Output: \`[[1,2]]\`  
Explanation:  
- dist([1,2]) = 1² + 2² = 5  
- dist([1,3]) = 1² + 3² = 10  
Closest is \`[1,2]\`.

**Example 2**  
Input: \`points = [[3,3],[5,-1],[-2,4]], k = 2\`  
Output: \`[[3,3],[-2,4]]\` (or any permutation)  
Distances: 18, 26, 20 → two smallest are 18 and 20.

\`\`\`algoviz
{"title": "Max-Heap Walk-Through (k = 2)", "type": "array", "data": ["[3,3] d=18","[5,-1] d=26","[-2,4] d=20"],
 "frames": [
  {"highlight":[0],"label":"push [3,3] d=18","stats":{"heapSize":1}},
  {"highlight":[1],"label":"push [5,-1] d=26","stats":{"heapSize":2}},
  {"highlight":[2],"label":"push [-2,4] d=20 → pop 26","stats":{"heapSize":2}},
  {"highlight":[0,2],"label":"final heap holds closest 2","stats":{"heapSize":2}}
 ], "speed": 900}
\`\`\`

## Approach — Max-Heap of Size K

1. Build a **max-heap** that keeps the *k smallest* distances seen so far.
2. For each point compute \`d = x² + y²\`.
3. Push \`(-d, point)\` onto the heap (negated so Python’s \`heapq\` behaves as a max-heap).
4. If heap length exceeds \`k\`, pop the largest (farthest) item.
5. After the scan, the heap contains exactly the K closest points.

**Complexities**  
- Time: \`O(n log k)\` – each of \`n\` points does one push/pop on a heap of size ≤ \`k\`.  
- Space: \`O(k)\` – heap stores at most \`k\` entries.

\`\`\`compare
{"variant": "good-bad",
 "before": {"label":"Sorting all points (simple but slower)","code":"points.sort(key=lambda p: p[0]**2 + p[1]**2)\\nreturn points[:k]  # O(n log n)"},
 "after": {"label":"Max-heap of size k (optimal)","code":"import heapq\\nheap = []\\nfor x, y in points:\\n    d = x*x + y*y\\n    heapq.heappush(heap, (-d, [x,y]))\\n    if len(heap) > k:\\n        heapq.heappop(heap)\\nreturn [pt for (_, pt) in heap]  # O(n log k)"}}
\`\`\`

\`\`\`playground
{"title":"Try it live","language":"python","code":"import heapq\\ndef k_closest(points, k):\\n    max_heap = []\\n    for x, y in points:\\n        d2 = x*x + y*y\\n        heapq.heappush(max_heap, (-d2, [x, y]))\\n        if len(max_heap) > k:\\n            heapq.heappop(max_heap)\\n    return [pt for (_, pt) in max_heap]\\n\\n# ---- test ----\\npts = [[3,3],[5,-1],[-2,4]]\\nprint(k_closest(pts, 2))  # expected e.g. [[3,3], [-2,4]]","runnable":true}
\`\`\`

\`\`\`quiz
{"title":"Check your understanding","questions":[
{"question":"Why do we store *negative* distance in the heap?","options":["To save memory","To turn Python’s min-heap into a max-heap","To avoid integer overflow","To simplify the comparator"],"answer":1,"explanation":"Negating the distance lets the smallest negative number (largest positive distance) sit at the root, so heapq.heappop removes the farthest point."},
{"question":"What is the time complexity if k ≈ n (e.g., n/2)?","options":["O(n)","O(n log n)","O(n log k)","O(k log n)"],"answer":2,"explanation":"Even when k is large, O(n log k) is still better than the O(n log n) full-sort approach."},
{"question":"Which edge-case must be handled explicitly in code?","options":["Duplicate points","k = 0","Points on the origin","All of the above"],"answer":3,"explanation":"All occur in real interviews: duplicates don’t break the algo but need correct counting; k=0 should return []; origin points have d=0 and must be kept when they fall inside the closest k."}
]}
\`\`\`

\`\`\`takeaways
{"title":"Key Takeaways","items":["Compare squared distances—skip the sqrt for speed and precision.","Maintain a size-k max-heap to achieve O(n log k) runtime.","Negate values to turn Python’s min-heap into a max-heap effortlessly.","Pattern applies to any ‘top-K’ or ‘bottom-K’ question by flipping the comparator."]}
\`\`\``,
      starterCode: `import heapq

def k_closest_points(points, k):
    # TODO: Return the k closest points to the origin
    pass

# Test cases
print(k_closest_points([[1,2],[1,3]], 1))
# Expected: [[1, 2]]

print(k_closest_points([[3,3],[5,-1],[-2,4]], 2))
# Expected: [[3, 3], [-2, 4]] (order may vary)
`,
      solutionCode: `import heapq

def k_closest_points(points, k):
    max_heap = []

    for point in points:
        dist = point[0] ** 2 + point[1] ** 2
        heapq.heappush(max_heap, (-dist, point))
        if len(max_heap) > k:
            heapq.heappop(max_heap)

    return [item[1] for item in max_heap]

# Test cases
print(k_closest_points([[1,2],[1,3]], 1))
# Expected: [[1, 2]]

print(k_closest_points([[3,3],[5,-1],[-2,4]], 2))
# Expected: [[3, 3], [-2, 4]] (order may vary)
`,
    },
    {
      id: "top-k-frequent-numbers",
      slug: "top-k-frequent-numbers",
      title: "Top K Frequent Numbers",
      content: `# Top K Frequent Numbers

## Problem Statement

Given an unsorted array of numbers, find the **K most frequently occurring** numbers. If two numbers have the same frequency, either can be chosen.

## Examples

**Example 1:**
\`\`\`
Input: nums = [1, 3, 5, 12, 11, 12, 11], k = 2
Output: [12, 11]
Explanation: 12 appears 2x, 11 appears 2x, rest appear 1x.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [5, 12, 11, 3, 11], k = 2
Output: [11, 5] or [11, 12] or [11, 3]
Explanation: 11 appears 2x (must be included), rest appear 1x (pick any).
\`\`\`

## Approach

The heap-based solution follows a two-phase pattern: first aggregate, then select.

\`\`\`concept
{
  "title": "Two-Phase Pattern",
  "variant": "mental-model",
  "content": "Think of this as a voting system:\\n\\n1. **Tally Phase**: Count how many votes (occurrences) each candidate (number) receives\\n2. **Selection Phase**: Pick the top K winners from all candidates\\n\\nThe heap acts as a \\"VIP lounge\\" that only holds K members at a time, automatically ejecting the least popular when full."
}
\`\`\`

### Phase 1: Frequency Counting
Build a hash map to count occurrences of each element.

### Phase 2: Min-Heap Selection
Use a min-heap of size K to track the most frequent elements:

\`\`\`algoviz
{
  "title": "Heap Selection Process",
  "type": "array",
  "data": [1, 3, 5, 12, 11, 12, 11],
  "frames": [
    {"highlight": [0], "label": "Count frequencies: {1:1, 3:1, 5:1, 12:2, 11:2}", "stats": {"heap_size": 0}},
    {"highlight": [3, 5], "label": "Add 12 (freq=2) to heap", "stats": {"heap_size": 1}},
    {"highlight": [4, 6], "label": "Add 11 (freq=2) to heap", "stats": {"heap_size": 2}},
    {"highlight": [0], "label": "Skip 1 (freq=1) - less frequent than heap min", "stats": {"heap_min": 2}},
    {"highlight": [1], "label": "Skip 3 (freq=1) - less frequent than heap min", "stats": {"heap_min": 2}},
    {"highlight": [2], "label": "Skip 5 (freq=1) - less frequent than heap min", "stats": {"heap_min": 2}}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Common Mistake: Max-Heap Confusion",
  "content": "Don't use a max-heap for top K problems! A min-heap of size K lets you efficiently remove the smallest element when full, ensuring you keep only the K most frequent elements."
}
\`\`\`

## Implementation

\`\`\`playground
{
  "title": "Top K Frequent Elements",
  "language": "python",
  "code": "import heapq\\nfrom collections import Counter\\n\\ndef top_k_frequent(nums, k):\\n    # Phase 1: Count frequencies\\n    freq_map = Counter(nums)\\n    \\n    # Phase 2: Use min-heap to track top K\\n    heap = []\\n    \\n    for num, freq in freq_map.items():\\n        heapq.heappush(heap, (freq, num))\\n        \\n        # Keep heap size at most K\\n        if len(heap) > k:\\n            heapq.heappop(heap)\\n    \\n    # Extract results\\n    result = []\\n    while heap:\\n        result.append(heapq.heappop(heap)[1])\\n    \\n    return result\\n\\n# Test\\nprint(top_k_frequent([1, 3, 5, 12, 11, 12, 11], 2))",
  "runnable": true
}
\`\`\`

## Complexity Analysis

**Time Complexity:** O(n + d log K) where d is the number of distinct elements.

**Space Complexity:** O(d) for the frequency map + O(K) for the heap.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naive Sorting Approach",
    "code": "# Count frequencies, then sort all by frequency\\nfreq_map = Counter(nums)\\nsorted_items = sorted(freq_map.items(), key=lambda x: x[1], reverse=True)\\nreturn [item[0] for item in sorted_items[:k]]"
  },
  "after": {
    "label": "Heap-Based Approach",
    "code": "# Count frequencies, use min-heap of size K\\nfreq_map = Counter(nums)\\nheap = []\\nfor num, freq in freq_map.items():\\n    heapq.heappush(heap, (freq, num))\\n    if len(heap) > k:\\n        heapq.heappop(heap)\\nreturn [item[1] for item in heap]"
  }
}
\`\`\`

## Alternative: Bucket Sort Approach

When frequencies are bounded by array length, we can achieve O(n) time:

\`\`\`collapse
{
  "title": "Deep Dive: O(n) Bucket Sort Solution",
  "content": "\`\`\`python\\ndef top_k_frequent_bucket(nums, k):\\n    # Count frequencies\\n    freq_map = Counter(nums)\\n    \\n    # Create buckets by frequency\\n    max_freq = max(freq_map.values())\\n    buckets = [[] for _ in range(max_freq + 1)]\\n    \\n    for num, freq in freq_map.items():\\n        buckets[freq].append(num)\\n    \\n    # Collect top K from highest frequency\\n    result = []\\n    for freq in range(max_freq, 0, -1):\\n        for num in buckets[freq]:\\n            result.append(num)\\n            if len(result) == k:\\n                return result\\n    return result\\n\`\`\`\\n\\nThis approach is optimal when you need guaranteed O(n) performance and frequencies are bounded."
}
\`\`\`

## Practice

\`\`\`quiz
{
  "title": "Top K Frequent Elements Quiz",
  "questions": [
    {
      "question": "Why use a min-heap instead of a max-heap for top K frequent elements?",
      "options": ["Min-heaps are faster", "Min-heaps maintain size K efficiently", "Max-heaps can't handle frequencies", "Min-heaps use less memory"],
      "answer": 1,
      "explanation": "A min-heap of size K allows us to efficiently remove the least frequent element when the heap exceeds size K, ensuring we keep only the most frequent elements."
    },
    {
      "question": "What's the time complexity when K equals the number of unique elements?",
      "options": ["O(n)", "O(n log n)", "O(n log K)", "O(n + K)"],
      "answer": 1,
      "explanation": "When K equals the number of unique elements, we effectively sort all elements by frequency, resulting in O(n log n) time complexity."
    },
    {
      "question": "In the heap approach, what determines when we remove an element?",
      "options": ["When frequency is less than K", "When heap size exceeds K", "When we find a duplicate", "When frequency equals K"],
      "answer": 1,
      "explanation": "We remove the smallest frequency element when the heap size exceeds K to maintain only the K most frequent elements."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use a min-heap of size K to efficiently track top K frequent elements",
    "Two-phase approach: count frequencies first, then select top K",
    "Time complexity is O(n + d log K) where d is number of unique elements",
    "Bucket sort can achieve O(n) time when frequencies are bounded",
    "Min-heap approach is most practical for interview settings"
  ]
}
\`\`\``,
      starterCode: `import heapq
from collections import Counter

def find_k_frequent(nums, k):
    # TODO: Return the k most frequently occurring numbers
    pass

# Test cases
print(find_k_frequent([1, 3, 5, 12, 11, 12, 11], 2))
# Expected: [12, 11] (order may vary)

print(find_k_frequent([5, 12, 11, 3, 11], 2))
# Expected: [11, <any other>] (11 must be included)
`,
      solutionCode: `import heapq
from collections import Counter

def find_k_frequent(nums, k):
    freq = Counter(nums)
    min_heap = []

    for num, count in freq.items():
        heapq.heappush(min_heap, (count, num))
        if len(min_heap) > k:
            heapq.heappop(min_heap)

    return [item[1] for item in min_heap]

# Test cases
print(find_k_frequent([1, 3, 5, 12, 11, 12, 11], 2))
# Expected: [12, 11] (order may vary)

print(find_k_frequent([5, 12, 11, 3, 11], 2))
# Expected: [11, <any other>] (11 must be included)
`,
    },
    {
      id: "top-k-sort-chars-frequency",
      slug: "top-k-sort-chars-frequency",
      title: "Sort Characters By Frequency",
      content: `# Sort Characters By Frequency

\`\`\`concept
{"title": "The Core Insight", "variant": "insight", "content": "This problem is a \\"Top All Elements\\" variation: instead of picking the top K, we sort every character by its frequency. A max-heap gives us the highest-frequency character in O(log d) time, letting us build the result string character-by-character."}
\`\`\`

## Problem Statement

Given a string, sort its characters in **decreasing order of frequency**.  
If two characters have the same frequency, their relative order does **not** matter.

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`"programming"\` | \`"ggrrmmpaoin"\` | \`g,r,m\` each appear 2×, then the singles |
| \`"aab"\` | \`"aab"\` | \`a\` appears 2×, \`b\` 1× |
| \`"tree"\` | \`"eert"\` or \`"eetr"\` | \`e\` appears 2×, \`t\` and \`r\` 1× |

\`\`\`algoviz
{"title": "Heap in Action on \\"tree\\"", "type": "array", "data": [["e",2],["t",1],["r",1]],
 "frames": [
   {"highlight":[0], "label":"Pop (e,2) → append 'ee'", "stats":{"heapSize":3}},
   {"highlight":[1], "label":"Pop (t,1) → append 't'", "stats":{"heapSize":2}},
   {"highlight":[2], "label":"Pop (r,1) → append 'r'", "stats":{"heapSize":1}}
 ], "speed": 900}
\`\`\`

## Approach

1. Count character frequencies with a hash map.
2. Push \`(-frequency, char)\` into a max-heap (Python’s \`heapq\` is min-heap by default).
3. Repeatedly pop the heap and append \`char * frequency\` to the result.

\`\`\`playground
{"title": "Python Implementation", "language": "python", "code": "import heapq\\nfrom collections import Counter\\n\\ndef frequencySort(s: str) -> str:\\n    # 1. Count\\n    freq = Counter(s)  # {'e':2, 't':1, 'r':1} for \\"tree\\"\\n    \\n    # 2. Build max-heap (negate frequency)\\n    max_heap = []\\n    for ch, cnt in freq.items():\\n        heapq.heappush(max_heap, (-cnt, ch))\\n    \\n    # 3. Pop & build result\\n    res = []\\n    while max_heap:\\n        neg_cnt, ch = heapq.heappop(max_heap)\\n        res.append(ch * (-neg_cnt))\\n    return ''.join(res)\\n\\nprint(frequencySort(\\"tree\\"))  # eetr", "runnable": true}
\`\`\`

\`\`\`compare
{"variant": "good-bad", "before": {"label": "Sorting the items list (O(d log d))", "code": "items = sorted(freq.items(), key=lambda x: -x[1])\\nres = ''.join(ch*cnt for ch,cnt in items)"}, "after": {"label": "Heap approach (O(d log d) same bound)", "code": "heap = [(-cnt,ch) for ch,cnt in freq.items()]\\nheapq.heapify(heap)\\nres = []\\nwhile heap:\\n    neg_cnt,ch = heapq.heappop(heap)\\n    res.append(ch*(-neg_cnt))"}}
\`\`\`

## Complexity

| Step | Time | Space |
|------|------|-------|
| Counting | O(n) | O(d) |
| Heapify | O(d) | O(d) |
| Pop all | O(d log d) | — |
| **Total** | **O(n + d log d)** | **O(d)** |

For lowercase English letters, \`d ≤ 26\`, so \`d log d\` is effectively constant.

\`\`\`quiz
{"title": "Quick Check", "questions": [
  {"question": "Why do we negate the frequency when pushing into Python’s heapq?", "options": ["To simulate a max-heap", "To avoid negative counts", "Python requires integers"], "answer": 0, "explanation": "heapq is a min-heap; negating turns the smallest negative into the largest positive frequency."},
  {"question": "What is the worst-case heap size for lowercase English input?", "options": ["26", "n", "log n"], "answer": 0, "explanation": "Only 26 distinct letters can appear, so the heap never exceeds 26 elements."},
  {"question": "If the string length n=10^6 and all characters are unique, what dominates the runtime?", "options": ["Counting O(n)", "Heap operations O(n log n)", "String concatenation O(n^2)"], "answer": 1, "explanation": "With d=n distinct characters, heapify + n pops give O(n log n) time."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Use a max-heap to stream characters from highest to lowest frequency.",
  "Negate counts when using Python’s min-heap heapq.",
  "Overall complexity is O(n + d log d); for bounded alphabet it’s effectively O(n)."
]}
\`\`\``,
      starterCode: `import heapq
from collections import Counter

def sort_by_frequency(s):
    # TODO: Sort characters by frequency in decreasing order
    pass

# Test cases
print(sort_by_frequency("programming"))
# Expected: "ggrrmmpaoin" or similar (high-freq chars first)

print(sort_by_frequency("aab"))
# Expected: "aab"

print(sort_by_frequency("tree"))
# Expected: "eert" or "eetr"
`,
      solutionCode: `import heapq
from collections import Counter

def sort_by_frequency(s):
    freq = Counter(s)

    # Max-heap on frequency
    max_heap = []
    for char, count in freq.items():
        heapq.heappush(max_heap, (-count, char))

    result = []
    while max_heap:
        count, char = heapq.heappop(max_heap)
        result.append(char * (-count))

    return "".join(result)

# Test cases
print(sort_by_frequency("programming"))
# Expected: "ggrrmmpaoin" or similar (high-freq chars first)

print(sort_by_frequency("aab"))
# Expected: "aab"

print(sort_by_frequency("tree"))
# Expected: "eert" or "eetr"
`,
    },
  ],
};
