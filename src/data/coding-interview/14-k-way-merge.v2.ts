import { Module } from "../types";

export const kWayMergeModule: Module = {
  id: "k-way-merge",
  title: "K-Way Merge",
  description: "Merge K sorted collections efficiently using a min-heap for O(N log K) performance.",
  lessons: [
    {
      id: "k-way-merge-intro",
      slug: "k-way-merge-intro",
      title: "Introduction to K-Way Merge",
      content: `# K-Way Merge Pattern

The **K-Way Merge** pattern efficiently merges K sorted lists (or arrays) into a single sorted output. It extends the classic merge-two-sorted-lists idea to an arbitrary number of lists.

\`\`\`concept
{
  "title": "What is K-Way Merge?",
  "variant": "mental-model",
  "content": "Think of K-Way Merge as a tournament bracket where K sorted lists compete. Instead of comparing every head element each time (which would be slow), we use a min-heap as a \\"smart scoreboard\\" that always tells us the smallest current element in O(log K) time."
}
\`\`\`

## Core Idea

Maintain a **min-heap** containing one element from each list (along with which list it came from and its index within that list):

1. Initialize the heap with the first element of each list.
2. Pop the smallest element from the heap — this is the next element in the merged output.
3. If the popped element's list has more elements, push the next element from that list onto the heap.
4. Repeat until the heap is empty.

\`\`\`algoviz
{
  "title": "Heap Evolution During K-Way Merge",
  "type": "array",
  "data": [[1,4,7], [2,5,8], [3,6,9]],
  "frames": [
    {"highlight": [0,0,0], "label": "Push first element from each list: 1, 2, 3", "stats": {"heap_size": 3}},
    {"highlight": [0,0,1], "label": "Pop 1 → output [1], push 4 from list 0", "stats": {"heap_size": 3}},
    {"highlight": [0,1,1], "label": "Pop 2 → output [1,2], push 5 from list 1", "stats": {"heap_size": 3}},
    {"highlight": [0,1,2], "label": "Pop 3 → output [1,2,3], push 6 from list 2", "stats": {"heap_size": 3}}
  ],
  "speed": 1000
}
\`\`\`

## Why a Heap?

With K lists, the naive approach of scanning all K heads to find the minimum takes O(K) per element, giving O(N*K) total. A min-heap reduces the "find minimum" step to O(log K), giving O(N log K) total — a major improvement when K is large.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naive Scan (O(N·K))",
    "code": "# Scan all K heads each time\\ndef naive_merge(lists):\\n    result = []\\n    while any(l for l in lists):\\n        min_val, min_idx = None, -1\\n        for i, lst in enumerate(lists):\\n            if lst and (min_val is None or lst[0] < min_val):\\n                min_val, min_idx = lst[0], i\\n        result.append(min_val)\\n        lists[min_idx].pop(0)\\n    return result"
  },
  "after": {
    "label": "Heap-Based (O(N log K))",
    "code": "# Heap gives min in O(log K)\\ndef merge_k_sorted(lists):\\n    heap = []\\n    for i, lst in enumerate(lists):\\n        if lst:\\n            heapq.heappush(heap, (lst[0], i, 0))\\n    result = []\\n    while heap:\\n        val, i, j = heapq.heappop(heap)\\n        result.append(val)\\n        if j + 1 < len(lists[i]):\\n            heapq.heappush(heap, (lists[i][j+1], i, j+1))\\n    return result"
  }
}
\`\`\`

## Python Implementation

\`\`\`playground
{
  "title": "K-Way Merge in Action",
  "language": "python",
  "code": "import heapq\\n\\ndef merge_k_sorted(lists):\\n    \\"\\"\\"\\n    Merge K sorted lists into one sorted list.\\n    Each element in heap: (value, list_index, element_index)\\n    \\"\\"\\"\\n    min_heap = []\\n    \\n    # Initialize heap with first element of each list\\n    for i, lst in enumerate(lists):\\n        if lst:\\n            heapq.heappush(min_heap, (lst[0], i, 0))\\n    \\n    result = []\\n    while min_heap:\\n        val, list_idx, elem_idx = heapq.heappop(min_heap)\\n        result.append(val)\\n        \\n        # If there are more elements in the same list, push next one\\n        if elem_idx + 1 < len(lists[list_idx]):\\n            next_val = lists[list_idx][elem_idx + 1]\\n            heapq.heappush(min_heap, (next_val, list_idx, elem_idx + 1))\\n    \\n    return result\\n\\n# Test with sample data\\nlists = [\\n    [1, 4, 7],\\n    [2, 5, 8],\\n    [3, 6, 9]\\n]\\nprint(\\"Input lists:\\", lists)\\nprint(\\"Merged result:\\", merge_k_sorted(lists))",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "What is the time complexity of K-Way Merge using a min-heap?",
      "options": ["O(N·K)", "O(N log K)", "O(N²)", "O(K log N)"],
      "answer": 1,
      "explanation": "With a min-heap we perform N extractions, each costing O(log K), for total O(N log K)."
    },
    {
      "question": "Why do we store (value, list_index, element_index) tuples in the heap?",
      "options": [
        "To break ties when values are equal",
        "To know which list to take the next element from",
        "To reduce memory usage",
        "To speed up heap operations"
      ],
      "answer": 1,
      "explanation": "After popping an element we need to know which list it came from so we can push that list's next element."
    },
    {
      "question": "What happens if one of the input lists is empty?",
      "options": [
        "The algorithm crashes",
        "We skip it during initialization",
        "We insert a sentinel value",
        "We merge the remaining lists normally"
      ],
      "answer": 1,
      "explanation": "The initialization loop only pushes non-empty lists, so empty lists are naturally ignored."
    }
  ]
}
\`\`\`

## When to Use

- Merging K sorted arrays, linked lists, or streams
- Finding the Kth smallest across multiple sorted sources
- Problems involving sorted matrices (row-sorted or fully sorted)
- Finding ranges that span multiple sorted lists

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "K-Way Merge generalizes two-way merge to K sorted inputs",
    "Min-heap reduces per-element cost from O(K) to O(log K)",
    "Overall complexity: O(N log K) time, O(K) space",
    "Store tuple (value, list_idx, elem_idx) in heap to track source",
    "Core pattern: init heap → pop min → push next from same list"
  ]
}
\`\`\``,
    },
    {
      id: "k-way-merge-sorted-lists",
      slug: "k-way-merge-sorted-lists",
      title: "Merge K Sorted Lists",
      content: `# Merge K Sorted Lists

## Problem Statement

Given K sorted arrays, merge them into a **single sorted array**.

## Examples

**Example 1:**
\`\`\`
Input: [[2, 6, 8], [3, 6, 7], [1, 3, 4]]
Output: [1, 2, 3, 3, 4, 6, 6, 7, 8]
\`\`\`

**Example 2:**
\`\`\`
Input: [[5, 8, 9], [1, 7]]
Output: [1, 5, 7, 8, 9]
\`\`\`

\`\`\`concept
{
  "title": "Why a Min-Heap?",
  "variant": "mental-model",
  "content": "Think of the min-heap as a \\"smart funnel\\" that always knows which of the K lists has the smallest next element. Instead of scanning all K lists every time (O(K)), the heap gives you the minimum in O(log K) time. This is the key insight that transforms a naive O(N·K) solution into the optimal O(N log K) algorithm."
}
\`\`\`

## Approach

Use a min-heap to always extract the globally smallest element:

1. Push the first element of each array onto the heap as a tuple \`(value, array_index, element_index)\`.
2. Pop the smallest element and append it to the result.
3. If the array from which that element came has a next element, push it onto the heap.
4. Continue until the heap is empty.

The heap always has at most K elements, so each push/pop is O(log K). With N total elements, the overall complexity is O(N log K).

\`\`\`algoviz
{
  "title": "Heap Evolution: [[2,6,8], [3,6,7], [1,3,4]]",
  "type": "array",
  "data": [1, 2, 3, 3, 4, 6, 6, 7, 8],
  "frames": [
    { "highlight": [], "label": "Initial: push 2,3,1 → heap [1,3,2]", "stats": {"heapSize":3} },
    { "highlight": [0], "label": "Pop 1 → push 3 → heap [2,3,3]", "stats": {"heapSize":3} },
    { "highlight": [0,1], "label": "Pop 2 → push 6 → heap [3,3,6]", "stats": {"heapSize":3} },
    { "highlight": [0,1,2], "label": "Pop 3 → push 6 → heap [3,6,6]", "stats": {"heapSize":3} },
    { "highlight": [0,1,2,3], "label": "Pop 3 → push 4 → heap [4,6,6]", "stats": {"heapSize":3} },
    { "highlight": [0,1,2,3,4], "label": "Pop 4 → no next → heap [6,6]", "stats": {"heapSize":2} },
    { "highlight": [0,1,2,3,4,5], "label": "Pop 6 → push 7 → heap [6,7]", "stats": {"heapSize":2} },
    { "highlight": [0,1,2,3,4,5,6], "label": "Pop 6 → push 8 → heap [7,8]", "stats": {"heapSize":2} },
    { "highlight": [0,1,2,3,4,5,6,7], "label": "Pop 7 → no next → heap [8]", "stats": {"heapSize":1} },
    { "highlight": [0,1,2,3,4,5,6,7,8], "label": "Pop 8 → done", "stats": {"heapSize":0} }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`playground
{
  "title": "K-Way Merge in Python",
  "language": "python",
  "code": "import heapq\\n\\ndef merge_k_sorted(lists):\\n    min_heap = []\\n    # push first element of each list\\n    for i, lst in enumerate(lists):\\n        if lst:\\n            heapq.heappush(min_heap, (lst[0], i, 0))\\n    \\n    result = []\\n    while min_heap:\\n        val, list_idx, elem_idx = heapq.heappop(min_heap)\\n        result.append(val)\\n        # if there is a next element in the same list, push it\\n        if elem_idx + 1 < len(lists[list_idx]):\\n            next_val = lists[list_idx][elem_idx + 1]\\n            heapq.heappush(min_heap, (next_val, list_idx, elem_idx + 1))\\n    return result\\n\\n# quick test\\nprint(merge_k_sorted([[2,6,8], [3,6,7], [1,3,4]]))",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "What is the maximum size of the min-heap during the algorithm?",
      "options": ["N", "K", "log K", "N log K"],
      "answer": 1,
      "explanation": "The heap stores at most one entry per list, so its size never exceeds K."
    },
    {
      "question": "If each of K lists has M elements, what is the total time complexity?",
      "options": ["O(K·M)", "O(K·M log K)", "O(K·M log M)", "O(K²·M)"],
      "answer": 1,
      "explanation": "Total elements N = K·M. Each of the N elements is extracted once at O(log K) cost, yielding O(K·M log K)."
    },
    {
      "question": "Why do we store array_index and element_index in the heap tuple?",
      "options": ["To break ties on equal values", "To know where to fetch the next element", "To reduce space usage", "To speed up heap operations"],
      "answer": 1,
      "explanation": "After popping (val, i, j) we need to know both which list i and which position j to take the next element from."
    }
  ]
}
\`\`\`

**Time Complexity:** O(N log K) where N is total number of elements.  
**Space Complexity:** O(K) for the heap + O(N) for the result.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "A min-heap lets us find the global minimum among K sorted heads in O(log K) time.",
    "We never store more than K pointers in the heap, giving O(K) auxiliary space.",
    "The algorithm generalizes the classic two-list merge; the heap replaces the single comparison.",
    "Total cost is O(N log K) — optimal for comparison-based merging of K lists."
  ]
}
\`\`\``,
      starterCode: `import heapq

def merge_k_sorted_lists(lists):
    # TODO: Merge K sorted arrays into one sorted array
    result = []
    return result

# Test cases
print(merge_k_sorted_lists([[2, 6, 8], [3, 6, 7], [1, 3, 4]]))
# Expected: [1, 2, 3, 3, 4, 6, 6, 7, 8]

print(merge_k_sorted_lists([[5, 8, 9], [1, 7]]))
# Expected: [1, 5, 7, 8, 9]
`,
      solutionCode: `import heapq

def merge_k_sorted_lists(lists):
    min_heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(min_heap, (lst[0], i, 0))

    result = []
    while min_heap:
        val, list_idx, elem_idx = heapq.heappop(min_heap)
        result.append(val)
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(min_heap, (next_val, list_idx, elem_idx + 1))

    return result

# Test cases
print(merge_k_sorted_lists([[2, 6, 8], [3, 6, 7], [1, 3, 4]]))
# Expected: [1, 2, 3, 3, 4, 6, 6, 7, 8]

print(merge_k_sorted_lists([[5, 8, 9], [1, 7]]))
# Expected: [1, 5, 7, 8, 9]
`,
    },
    {
      id: "k-way-merge-kth-smallest",
      slug: "k-way-merge-kth-smallest",
      title: "Kth Smallest Number in M Sorted Lists",
      content: `# Kth Smallest Number in M Sorted Lists

## Problem Statement

Given **M sorted lists**, find the **Kth smallest** number among all elements across all lists.

\`\`\`concept
{
  "title": "Why not just concatenate & sort?",
  "variant": "insight",
  "content": "Concatenating all lists and sorting costs O(N log N) where N is the total number of elements. When K ≪ N, we can do O(K log M) work instead by stopping as soon as we’ve seen K items."
}
\`\`\`

## Examples

**Example 1**  
Input: \`lists = [[2, 6, 8], [3, 6, 7], [1, 3, 4]]\`, \`k = 5\`  
Output: \`4\`  
Merged order: \`[1, 2, 3, 3, 4, 6, 6, 7, 8]\`

**Example 2**  
Input: \`lists = [[1, 5, 9], [2, 4, 8]]\`, \`k = 3\`  
Output: \`4\`  
Merged order: \`[1, 2, 4, 5, 8, 9]\`

\`\`\`algoviz
{
  "title": "Heap evolution for Example 1 (k=5)",
  "type": "array",
  "data": [2, 3, 1],
  "frames": [
    { "highlight": [2], "label": "init: push (2,0,0)", "stats": {"k":1} },
    { "highlight": [1], "label": "pop 1 → push 3", "stats": {"k":2} },
    { "highlight": [0], "label": "pop 2 → push 6", "stats": {"k":3} },
    { "highlight": [1], "label": "pop 3 → push 6", "stats": {"k":4} },
    { "highlight": [2], "label": "pop 3 → push 4", "stats": {"k":5} }
  ],
  "speed": 1000
}
\`\`\`

## Approach

Use **K-way merge** with a min-heap, but **terminate early** after K extractions.

1. Seed the heap with the first element of every list (plus list & index metadata).
2. Repeat K times:
   - Pop the smallest item.  
   - If its list has a next element, push that next element.
3. The Kth popped value is the answer.

\`\`\`steps
{
  "title": "Algorithm Steps",
  "steps": [
    { "title": "1. Heap Initialization", "content": "Insert tuple \`(value, list_idx, element_idx)\` for the first item of each list. Complexity: O(M log M) once." },
    { "title": "2. K Extractions", "content": "Pop the heap K times. Each pop costs O(log M). After a pop, if the originating list still has elements, push the next one." },
    { "title": "3. Early Termination", "content": "Stop as soon as the Kth pop finishes. No need to merge the entire N elements." }
  ]
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naive Concatenate + Sort",
    "code": "flat = []\\nfor lst in lists:\\n    flat.extend(lst)\\nflat.sort()\\nreturn flat[k-1]  # O(N log N)"
  },
  "after": {
    "label": "K-way Min-Heap",
    "code": "heap = []\\nfor i, lst in enumerate(lists):\\n    heappush(heap, (lst[0], i, 0))\\nfor _ in range(k):\\n    val, i, j = heappop(heap)\\n    if j+1 < len(lists[i]):\\n        heappush(heap, (lists[i][j+1], i, j+1))\\nreturn val  # O(K log M)"
  }
}
\`\`\`

## Complexities

| Metric | Value | Interpretation |
|--------|-------|----------------|
| Time | O(K log M) | K pops/inserts on a heap of size ≤ M |
| Space | O(M) | Heap holds at most one entry per list |

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "If M=100 and K=10, the heap approach is roughly how many times faster than sorting all N elements?",
      "options": ["10×", "log M times", "N/(K log M) times", "K times"],
      "answer": 2,
      "explanation": "Sorting is O(N log N); heap is O(K log M). When K≪N the speed-up factor is roughly N/(K log M)."
    },
    {
      "question": "What is the maximum size of the priority queue during execution?",
      "options": ["K", "M", "N", "K+M"],
      "answer": 1,
      "explanation": "At most one element per list is ever in the heap, so size ≤ M."
    },
    {
      "question": "Which operation dominates the time complexity?",
      "options": ["List concatenation", "Heap pop", "Heap push", "Both heap pop & push"],
      "answer": 3,
      "explanation": "Each of the K iterations does one pop and possibly one push, both O(log M)."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Python Implementation",
  "language": "python",
  "code": "import heapq\\n\\ndef kth_smallest(lists, k):\\n    # edge case\\n    if not lists or k <= 0:\\n        return None\\n    \\n    # min-heap entries: (value, list index, element index)\\n    heap = []\\n    for i, lst in enumerate(lists):\\n        if lst:\\n            heapq.heappush(heap, (lst[0], i, 0))\\n    \\n    # extract-min k times\\n    for _ in range(k):\\n        if not heap:\\n            return None  # k larger than total elements\\n        val, i, j = heapq.heappop(heap)\\n        if j + 1 < len(lists[i]):\\n            heapq.heappush(heap, (lists[i][j+1], i, j+1))\\n    \\n    return val\\n\\n# quick test\\nlists = [[2, 6, 8], [3, 6, 7], [1, 3, 4]]\\nprint(kth_smallest(lists, 5))  # -> 4",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "A min-heap lets us simulate a full merge while looking at only O(K log M) elements.",
    "Early termination as soon as the Kth pop finishes saves work when K ≪ N.",
    "Keep tuple (value, list index, element index) in the heap so you can push the next element from the same list."
  ]
}
\`\`\``,
      starterCode: `import heapq

def find_kth_smallest(lists, k):
    # TODO: Find the kth smallest element across all sorted lists
    pass

# Test cases
print(find_kth_smallest([[2, 6, 8], [3, 6, 7], [1, 3, 4]], 5))
# Expected: 4

print(find_kth_smallest([[1, 5, 9], [2, 4, 8]], 3))
# Expected: 4
`,
      solutionCode: `import heapq

def find_kth_smallest(lists, k):
    min_heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(min_heap, (lst[0], i, 0))

    count = 0
    while min_heap:
        val, list_idx, elem_idx = heapq.heappop(min_heap)
        count += 1
        if count == k:
            return val
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(min_heap, (next_val, list_idx, elem_idx + 1))

    return -1

# Test cases
print(find_kth_smallest([[2, 6, 8], [3, 6, 7], [1, 3, 4]], 5))
# Expected: 4

print(find_kth_smallest([[1, 5, 9], [2, 4, 8]], 3))
# Expected: 4
`,
    },
    {
      id: "k-way-merge-sorted-matrix",
      slug: "k-way-merge-sorted-matrix",
      title: "Kth Smallest Number in a Sorted Matrix",
      content: `# Kth Smallest Number in a Sorted Matrix

## Problem Statement

Given an N × N matrix where **every row** and **every column** is sorted in ascending order, return the **Kth smallest** element among all N² entries.

\`\`\`concept
{
  "title": "What “Kth smallest” really means",
  "variant": "rule",
  "content": "Duplicates count.  If the flattened list is [1,2,2,3] then the 3rd smallest is 2, not 3."
}
\`\`\`

## Examples

**Example 1**  
Input:  
\`\`\`
matrix = [[ 1,  5,  9],
          [10, 11, 13],
          [12, 13, 15]],   k = 8
\`\`\`  
Output: \`13\`  
Flattened & sorted: \`[1,5,9,10,11,12,13,13,15]\` → 8th element is \`13\`.

**Example 2**  
Input:  
\`\`\`
matrix = [[1,3],
          [2,4]],   k = 3
\`\`\`  
Output: \`3\`

## K-Way Merge Solution

Treat each **row** as a pre-sorted stream.  Maintain a min-heap of the current “head” of every stream.

\`\`\`steps
{
  "title": "Heap algorithm step-by-step",
  "steps": [
    {
      "title": "1. Seed the heap",
      "content": "Push the first element of every row: \`(value, rowIndex, 0)\`.\\nHeap size ≤ N."
    },
    {
      "title": "2. Pop & Advance",
      "content": "Repeat K times:\\n- Pop the smallest tuple \`(v,r,c)\`.\\n- If \`c+1 < N\`, push \`(matrix[r][c+1], r, c+1)\`.\\nThe Kth pop’s \`v\` is the answer."
    },
    {
      "title": "3. Complexity",
      "content": "- Time: O(K log N) — K extractions from a heap of size ≤ N.\\n- Space: O(N) — at most one entry per row lives in the heap."
    }
  ]
}
\`\`\`

\`\`\`algoviz
{
  "title": "Heap state while solving Example 1 (k=8)",
  "type": "array",
  "data": [1,5,9,10,11,12,13,13,15],
  "frames": [
    {"highlight":[0], "label":"init: push row-0 head 1","stats":{"heap":"[1,10,12]","pops":0}},
    {"highlight":[0], "label":"pop 1 → push 5","stats":{"heap":"[5,10,12]","pops":1}},
    {"highlight":[1], "label":"pop 5 → push 9","stats":{"heap":"[9,10,12]","pops":2}},
    {"highlight":[2], "label":"pop 9 → row 0 exhausted","stats":{"heap":"[10,12]","pops":3}},
    {"highlight":[3], "label":"pop 10 → push 11","stats":{"heap":"[11,12]","pops":4}},
    {"highlight":[4], "label":"pop 11 → push 13","stats":{"heap":"[12,13]","pops":5}},
    {"highlight":[5], "label":"pop 12 → push 13","stats":{"heap":"[13,13]","pops":6}},
    {"highlight":[6], "label":"pop 13 (1st) → push 15","stats":{"heap":"[13,15]","pops":7}},
    {"highlight":[6], "label":"pop 13 (2nd) → k=8 answer","stats":{"heap":"[15]","pops":8}}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`playground
{
  "title": "Python implementation",
  "language": "python",
  "runnable": true,
  "code": "import heapq\\n\\ndef kth_smallest(matrix, k):\\n    n = len(matrix)\\n    heap = []\\n    # seed with (value, row, col)\\n    for r in range(n):\\n        heapq.heappush(heap, (matrix[r][0], r, 0))\\n    \\n    for _ in range(k):\\n        val, r, c = heapq.heappop(heap)\\n        if c + 1 < n:\\n            heapq.heappush(heap, (matrix[r][c+1], r, c+1))\\n    return val\\n\\n# ---- test ----\\nmat = [[1,5,9],[10,11,13],[12,13,15]]\\nprint(kth_smallest(mat, 8))  # 13"
}
\`\`\`

## Trade-off: Heap vs Binary-Search on Value

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Min-Heap (K-Way)",
      "content": "**When k is small relative to N²**  \\n- Time: O(K log N)  \\n- Space: O(N)  \\n- Straightforward, leverages K-way merge pattern."
    },
    {
      "label": "Binary-Search on Value",
      "content": "**When k is large (close to N²)**  \\n- Time: O(N log(max-min))  \\n- Space: O(1)  \\n- Count ≤ mid via staircase walk from corner.  \\n- Faster asymptotically when K ≈ N²."
    }
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Check your understanding",
  "questions": [
    {
      "question": "In the heap solution, what dictates the maximum size of the heap?",
      "options": ["K", "N", "N²", "log N"],
      "answer": 1,
      "explanation": "We store at most one element per row, so size ≤ N."
    },
    {
      "question": "If k = N², the heap approach does roughly how much work?",
      "options": ["O(N²)", "O(N² log N)", "O(N log N)", "O(N)"],
      "answer": 1,
      "explanation": "K = N² pops, each costing O(log N) → O(N² log N)."
    },
    {
      "question": "Why can’t we simply sort the flattened matrix?",
      "options": ["It gives wrong order", "It is forbidden by problem", "It is slower: O(N² log N²)", "Heap uses less code"],
      "answer": 2,
      "explanation": "Flatten-then-sort is O(N² log N²) = O(N² log N), strictly worse than the heap method when k ≪ N²."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Rows + columns sorted ⇒ each row is a sorted stream; K-way merge applies directly.",
    "Heap stores (value, row, col); after each pop, push the next element in that row.",
    "Time O(K log N), space O(N) — optimal when k is small.",
    "For k ≈ N², consider binary-search on value for O(N log(max-min)) instead."
  ]
}
\`\`\``,
      starterCode: `import heapq

def kth_smallest_in_matrix(matrix, k):
    # TODO: Find the kth smallest element in the sorted matrix
    pass

# Test cases
print(kth_smallest_in_matrix([[1,5,9],[10,11,13],[12,13,15]], 8))
# Expected: 13

print(kth_smallest_in_matrix([[1,3],[2,4]], 3))
# Expected: 3
`,
      solutionCode: `import heapq

def kth_smallest_in_matrix(matrix, k):
    n = len(matrix)
    min_heap = []

    # Push the first element of each row
    for i in range(min(n, k)):
        heapq.heappush(min_heap, (matrix[i][0], i, 0))

    count = 0
    while min_heap:
        val, row, col = heapq.heappop(min_heap)
        count += 1
        if count == k:
            return val
        if col + 1 < len(matrix[row]):
            heapq.heappush(min_heap, (matrix[row][col + 1], row, col + 1))

    return -1

# Test cases
print(kth_smallest_in_matrix([[1,5,9],[10,11,13],[12,13,15]], 8))
# Expected: 13

print(kth_smallest_in_matrix([[1,3],[2,4]], 3))
# Expected: 3
`,
    },
    {
      id: "k-way-merge-smallest-range",
      slug: "k-way-merge-smallest-range",
      title: "Smallest Number Range",
      content: `# Smallest Number Range

Given \`M\` sorted lists, find the **smallest range** \`[a, b]\` such that at least one number from each list falls within the range.  
If multiple ranges have the same size, return the one with the smaller starting value.

\`\`\`concept
{
  "title": "What “smallest range” really means",
  "variant": "insight",
  "content": "We want the shortest interval that still ‘touches’ every list.  Shorter interval ⇒ smaller (b – a).  Tie-breaker: the interval that starts earlier wins."
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Brute-force idea (don’t do this)",
    "code": "ranges = []\\nfor every possible a, b:\\n    if each list has ≥1 value in [a,b]:\\n        ranges.append([a,b])\\nreturn min(ranges, key=lambda r: (r[1]-r[0], r[0]))"
  },
  "after": {
    "label": "K-way merge with min-heap (O(N log M))",
    "code": "min-heap ← first item of each list\\ncur_max ← max of those items\\nbest ← [heap_min, cur_max]\\n\\nwhile every list still has items:\\n    pop smallest x from heap\\n    push next item from x’s list\\n    update cur_max\\n    if new range is smaller → update best"
  }
}
\`\`\`

## Walk-through on the first example

Lists = \`[[1,5,8], [4,12], [7,8,10]]\`

\`\`\`algoviz
{
  "title": "Heap state while scanning",
  "type": "array",
  "data": [1, 4, 7],
  "frames": [
    { "highlight": [0], "label": "init: heap=[1,4,7], max=7, range=[1,7]", "stats": { "range": "[1,7]", "size": 6 } },
    { "highlight": [1], "label": "pop 1 → push 5; heap=[4,5,7], max=7, range=[4,7]", "stats": { "range": "[4,7]", "size": 3 } },
    { "highlight": [0], "label": "pop 4 → push 12; heap=[5,7,12], max=12, range=[5,12]", "stats": { "range": "[5,12]", "size": 7 } },
    { "highlight": [0], "label": "pop 5 → push 8; heap=[7,8,12], max=12, range=[7,12]", "stats": { "range": "[7,12]", "size": 5 } },
    { "highlight": [0], "label": "pop 7 → push 8; heap=[8,8,12], max=12, range=[8,12]", "stats": { "range": "[8,12]", "size": 4 } },
    { "highlight": [0], "label": "pop 8 (L3 exhausted) → STOP", "stats": {} }
  ],
  "speed": 900
}
\`\`\`

The smallest range seen was \`[4,7]\` (size 3).

## Implementation template

\`\`\`playground
{
  "title": "Python skeleton",
  "language": "python",
  "code": "import heapq\\n\\ndef smallest_range(lists):\\n    min_heap = []\\n    cur_max = -float('inf')\\n    \\n    # 1. seed the heap\\n    for i, lst in enumerate(lists):\\n        val = lst[0]\\n        heapq.heappush(min_heap, (val, i, 0))\\n        cur_max = max(cur_max, val)\\n    \\n    best = [min_heap[0][0], cur_max]\\n    \\n    # 2. advance the minimum\\n    while True:\\n        val, list_idx, elem_idx = heapq.heappop(min_heap)\\n        \\n        # exhausted one list → done\\n        if elem_idx + 1 == len(lists[list_idx]):\\n            break\\n        \\n        next_val = lists[list_idx][elem_idx + 1]\\n        heapq.heappush(min_heap, (next_val, list_idx, elem_idx + 1))\\n        cur_max = max(cur_max, next_val)\\n        \\n        # update best\\n        if cur_max - min_heap[0][0] < best[1] - best[0]:\\n            best = [min_heap[0][0], cur_max]\\n        elif cur_max - min_heap[0][0] == best[1] - best[0] and min_heap[0][0] < best[0]:\\n            best = [min_heap[0][0], cur_max]\\n    \\n    return best\\n\\n# quick test\\nprint(smallest_range([[1,5,8],[4,12],[7,8,10]]))  # expected [4,7]",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Check your understanding",
  "questions": [
    {
      "question": "Why do we stop as soon as any list is exhausted?",
      "options": [
        "The heap becomes empty",
        "We can no longer guarantee coverage of every list",
        "Python’s heapq requires it",
        "The range size would become negative"
      ],
      "answer": 1,
      "explanation": "Once a list has no more elements to offer, we can’t ‘cover’ it in any future interval, so continuing is pointless."
    },
    {
      "question": "What is the max size of the heap during the algorithm?",
      "options": ["M", "N", "log M", "M²"],
      "answer": 0,
      "explanation": "We hold exactly one entry per list, so the heap never exceeds M elements."
    },
    {
      "question": "If every list has length L, what is the exact number of heap operations?",
      "options": ["M", "M·L", "M·L·log M", "M + L"],
      "answer": 2,
      "explanation": "Each of the M·L elements is pushed and popped once, and each operation is O(log M)."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use a min-heap to always extend the smallest current endpoint.",
    "Track the running global maximum to compute the current range in O(1) time.",
    "Terminate when any list runs out—coverage is impossible afterwards.",
    "Complexity: O(N log M) time, O(M) space, where N is total elements and M is number of lists."
  ]
}
\`\`\``,
      starterCode: `import heapq

def find_smallest_range(lists):
    # TODO: Find smallest range covering at least one element from each list
    pass

# Test cases
print(find_smallest_range([[1,5,8],[4,12],[7,8,10]]))
# Expected: [4, 7]

print(find_smallest_range([[1,9],[4,12],[7,10,16]]))
# Expected: [4, 7]
`,
      solutionCode: `import heapq

def find_smallest_range(lists):
    min_heap = []
    current_max = float('-inf')

    # Initialize heap with first element of each list
    for i, lst in enumerate(lists):
        heapq.heappush(min_heap, (lst[0], i, 0))
        current_max = max(current_max, lst[0])

    best_range = [float('-inf'), float('inf')]

    while len(min_heap) == len(lists):
        current_min, list_idx, elem_idx = heapq.heappop(min_heap)

        # Update best range if current is smaller
        if current_max - current_min < best_range[1] - best_range[0]:
            best_range = [current_min, current_max]

        # Push next element from the same list
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(min_heap, (next_val, list_idx, elem_idx + 1))
            current_max = max(current_max, next_val)
        else:
            break  # One list exhausted, can't cover all lists

    return best_range

# Test cases
print(find_smallest_range([[1,5,8],[4,12],[7,8,10]]))
# Expected: [4, 7]

print(find_smallest_range([[1,9],[4,12],[7,10,16]]))
# Expected: [4, 7]
`,
    },
    {
      id: "k-way-merge-k-pairs-largest-sums",
      slug: "k-way-merge-k-pairs-largest-sums",
      title: "K Pairs with Largest Sums",
      content: `# K Pairs with Largest Sums

## Problem Statement

Given two sorted arrays in **descending order**, find **K pairs** (one element from each array) with the **largest sums**. Return the pairs sorted by their sum in descending order.

\`\`\`concept
{
  "title": "Why a Max-Heap Works Here",
  "variant": "insight",
  "content": "Because both arrays are already sorted descending, the largest possible sum is always at the root of a heap that tracks candidate pairs. Each time we pop the current maximum, we only need to consider its two immediate neighbors (i+1,j) and (i,j+1) as the next candidates — no need to scan the entire grid."
}
\`\`\`

## Examples

**Example 1:**
\`\`\`
Input: nums1 = [9, 8, 2], nums2 = [6, 3, 1], k = 3
Output: [[9,6],[8,6],[9,3]]
Explanation: Sums = 15, 14, 12. These are the 3 largest pair sums.
\`\`\`

**Example 2:**
\`\`\`
Input: nums1 = [5, 2, 1], nums2 = [2, -1], k = 3
Output: [[5,2],[5,-1],[2,2]]
Explanation: Sums = 7, 4, 4.
\`\`\`

\`\`\`algoviz
{
  "title": "Heap Evolution for Example 1",
  "type": "array",
  "data": [[9,6],[8,6],[9,3],[8,3],[9,1],[2,6]],
  "frames": [
    { "highlight": [0], "label": "Start: push (9,6) sum 15", "stats": {"heapSize":1,"visited":1} },
    { "highlight": [0,1], "label": "Pop 15 → push (8,6) 14 & (9,3) 12", "stats": {"heapSize":2,"visited":2} },
    { "highlight": [0,1,2], "label": "Pop 14 → push (8,3) 11", "stats": {"heapSize":2,"visited":3} },
    { "highlight": [0,1,2], "label": "Pop 12 → done, K=3 reached", "stats": {"heapSize":1,"visited":4} }
  ],
  "speed": 1000
}
\`\`\`

## Approach

Since both arrays are sorted in descending order, the largest sum is \`nums1[0] + nums2[0]\`. The next largest must involve either \`nums1[1] + nums2[0]\` or \`nums1[0] + nums2[1]\`.

Use a **max-heap** (negate sums for Python):

1. Push \`(-(nums1[0]+nums2[0]), 0, 0)\` to start.
2. Pop the largest sum pair. Add the pair to results.
3. Push the two neighbors: \`(i+1, j)\` and \`(i, j+1)\` if not already visited.
4. Use a set to track visited index pairs to avoid duplicates.
5. Repeat K times.

\`\`\`trace
{
  "title": "Step-by-step Trace on Example 1",
  "language": "python",
  "code": "import heapq\\nnums1 = [9,8,2]; nums2 = [6,3,1]; k = 3\\nheap = [(-15, 0, 0)]  # sum, i, j\\nvisited = {(0,0)}\\nout = []\\nwhile heap and len(out) < k:\\n    s, i, j = heapq.heappop(heap)\\n    out.append([nums1[i], nums2[j]])\\n    for di, dj in [(1,0),(0,1)]:\\n        ni, nj = i+di, j+dj\\n        if ni < len(nums1) and nj < len(nums2) and (ni,nj) not in visited:\\n            visited.add((ni,nj))\\n            heapq.heappush(heap, (-(nums1[ni]+nums2[nj]), ni, nj))\\nprint(out)",
  "frames": [
    { "line": 3, "vars": {"heap":[{"s":-15,"i":0,"j":0}],"visited":"{(0,0)}","out":[]}, "stdout": "" },
    { "line": 6, "vars": {"s":-15,"i":0,"j":0}, "stdout": "" },
    { "line": 7, "vars": {"out":[[9,6]]}, "stdout": "" },
    { "line": 10, "vars": {"heap":[{"s":-14,"i":1,"j":0},{"s":-12,"i":0,"j":1}]}, "stdout": "" },
    { "line": 6, "vars": {"s":-14,"i":1,"j":0}, "stdout": "" },
    { "line": 7, "vars": {"out":[[9,6],[8,6]]}, "stdout": "" },
    { "line": 6, "vars": {"s":-12,"i":0,"j":1}, "stdout": "" },
    { "line": 7, "vars": {"out":[[9,6],[8,6],[9,3]]}, "stdout": "[[9, 6], [8, 6], [9, 3]]\\n" }
  ],
  "speed": 900
}
\`\`\`

**Time Complexity:** O(K log K) — at most K elements in the heap.  
**Space Complexity:** O(K) for the heap and visited set.

\`\`\`quiz
{
  "title": "Checkpoint: K Pairs with Largest Sums",
  "questions": [
    {
      "question": "Why do we use a max-heap instead of sorting all pairs?",
      "options": ["All pairs may be O(N²)", "Heaps are faster than sorting", "We only need top K", "Both A and C"],
      "answer": 3,
      "explanation": "Generating all pairs is O(N²) memory and time; the heap lets us extract just the K largest efficiently."
    },
    {
      "question": "What prevents the same index pair from being pushed twice?",
      "options": ["The heap property", "A visited set", "Descending order", "Python's heapq"],
      "answer": 1,
      "explanation": "We maintain a set of (i,j) tuples we have already enqueued."
    },
    {
      "question": "If k > len(nums1)*len(nums2), the algorithm will:",
      "options": ["Crash","Return all possible pairs","Enter infinite loop","Raise IndexError"],
      "answer": 1,
      "explanation": "The loop stops when the heap is empty, so it simply returns every valid pair."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Try it: tweak arrays and K",
  "language": "python",
  "code": "import heapq\\ndef k_largest_pairs(nums1, nums2, k):\\n    if not nums1 or not nums2 or k <= 0:\\n        return []\\n    heap = []\\n    visited = set()\\n    heapq.heappush(heap, (-(nums1[0]+nums2[0]), 0, 0))\\n    visited.add((0,0))\\n    out = []\\n    while heap and len(out) < k:\\n        s, i, j = heapq.heappop(heap)\\n        out.append([nums1[i], nums2[j]])\\n        for di, dj in [(1,0),(0,1)]:\\n            ni, nj = i+di, j+dj\\n            if ni < len(nums1) and nj < len(nums2) and (ni,nj) not in visited:\\n                visited.add((ni,nj))\\n                heapq.heappush(heap, (-(nums1[ni]+nums2[nj]), ni, nj))\\n    return out\\n\\n# Edit these values and hit Run\\nprint(k_largest_pairs([10,9,2],[8,1,0],5))",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "A max-heap lets us extract the K largest pair sums without ever materializing the full O(N²) grid.",
    "Track visited (i,j) indices to avoid duplicate candidates.",
    "Time is O(K log K) and space is O(K), making it ideal when K ≪ N².",
    "The same pattern extends to K largest sums of 3+ sorted arrays by pushing neighbors along each dimension."
  ]
}
\`\`\``,
      starterCode: `import heapq

def k_pairs_largest_sums(nums1, nums2, k):
    # TODO: Find k pairs with largest sums from two descending-sorted arrays
    result = []
    return result

# Test cases
print(k_pairs_largest_sums([9, 8, 2], [6, 3, 1], 3))
# Expected: [[9, 6], [8, 6], [9, 3]]

print(k_pairs_largest_sums([5, 2, 1], [2, -1], 3))
# Expected: [[5, 2], [5, -1], [2, 2]]
`,
      solutionCode: `import heapq

def k_pairs_largest_sums(nums1, nums2, k):
    if not nums1 or not nums2:
        return []

    result = []
    visited = set()
    # Max-heap: negate the sum
    max_heap = [(-( nums1[0] + nums2[0]), 0, 0)]
    visited.add((0, 0))

    while max_heap and len(result) < k:
        neg_sum, i, j = heapq.heappop(max_heap)
        result.append([nums1[i], nums2[j]])

        # Push (i+1, j)
        if i + 1 < len(nums1) and (i + 1, j) not in visited:
            heapq.heappush(max_heap, (-(nums1[i+1] + nums2[j]), i + 1, j))
            visited.add((i + 1, j))

        # Push (i, j+1)
        if j + 1 < len(nums2) and (i, j + 1) not in visited:
            heapq.heappush(max_heap, (-(nums1[i] + nums2[j+1]), i, j + 1))
            visited.add((i, j + 1))

    return result

# Test cases
print(k_pairs_largest_sums([9, 8, 2], [6, 3, 1], 3))
# Expected: [[9, 6], [8, 6], [9, 3]]

print(k_pairs_largest_sums([5, 2, 1], [2, -1], 3))
# Expected: [[5, 2], [5, -1], [2, 2]]
`,
    },
  ],
};
