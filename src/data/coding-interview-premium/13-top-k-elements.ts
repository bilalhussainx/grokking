import { Module } from "../types";

export const topKElementsModule: Module = {
  id: "top-k-elements",
  title: "Top K Elements",
  description: "Master the Top K Elements pattern using heaps to efficiently find the K largest, smallest, or most frequent elements. Essential for optimization problems involving ranking and selection.",
  lessons: [
    {
      id: "top-k-elements-intro",
      slug: "top-k-elements-intro",
      title: "Introduction to Top K Elements",
      content: `## The Top K Elements Pattern

\`\`\`concept
{ "title": "The Min-Heap Bouncer", "variant": "mental-model", "content": "A min-heap of size K acts as a 'bouncer' with exactly K VIP spots. Each new element challenges the weakest VIP (the heap's minimum). If the challenger wins, the weakest is evicted and the challenger takes their spot. After scanning all elements, the K survivors are your answer." }
\`\`\`

When you need the top K elements from a dataset, the naive approach is to sort everything — O(n log n). But sorting is overkill: you don't need the entire list ordered, just K winners.

A heap gives you exactly what you need. By maintaining a **min-heap of size K** while scanning, each insertion or replacement costs O(log K). Process all n elements and your total time is **O(n log K)** — dramatically faster when K is much smaller than n.

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Sorting — O(n log n)", "code": "def find_k_largest_slow(nums, k):\\n    nums.sort(reverse=True)  # Sorts ALL n elements\\n    return nums[:k]          # Wastes work when k << n" }, "after": { "label": "Heap — O(n log k)", "code": "import heapq\\n\\ndef find_k_largest(nums, k):\\n    min_heap = []\\n    for num in nums:\\n        if len(min_heap) < k:\\n            heapq.heappush(min_heap, num)\\n        elif num > min_heap[0]:\\n            heapq.heapreplace(min_heap, num)\\n    return min_heap  # Maintains only k elements at a time" } }
\`\`\`

### Visualizing the Algorithm

Watch a **min-heap of size k=3** process \`[7, 10, 4, 3, 20, 15]\` step by step:

\`\`\`algoviz
{ "title": "Find K=3 Largest — Min-Heap Walkthrough", "type": "array", "data": [7, 10, 4, 3, 20, 15], "frames": [ { "highlight": [], "label": "Start: empty min-heap, k=3. Scan left to right.", "stats": { "heap": "[]", "heap_min": "—", "action": "init" } }, { "highlight": [0], "label": "7 → heap size (0) < k (3). Push unconditionally.", "stats": { "heap": "[7]", "heap_min": "7", "action": "push" } }, { "highlight": [1], "label": "10 → heap size (1) < k (3). Push unconditionally.", "stats": { "heap": "[7, 10]", "heap_min": "7", "action": "push" } }, { "highlight": [2], "label": "4 → heap size (2) < k (3). Push. Min-heap reorders: 4 floats to top.", "stats": { "heap": "[4, 10, 7]", "heap_min": "4", "action": "push" } }, { "highlight": [3], "label": "3 → heap is full & 3 ≤ heap_min (4). SKIP — can't be in top 3.", "stats": { "heap": "[4, 10, 7]", "heap_min": "4", "action": "skip" } }, { "highlight": [4], "label": "20 → 20 > heap_min (4). Evict 4, push 20. A larger element wins a spot!", "stats": { "heap": "[7, 10, 20]", "heap_min": "7", "action": "replace" } }, { "highlight": [5], "label": "15 → 15 > heap_min (7). Evict 7, push 15.", "stats": { "heap": "[10, 15, 20]", "heap_min": "10", "action": "replace" } }, { "highlight": [0, 1, 2, 3, 4, 5], "label": "Done! The 3 elements that survived are the 3 largest: [10, 15, 20].", "stats": { "heap": "[10, 15, 20]", "heap_min": "10", "action": "done" } } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Counter-intuitive: a min-heap finds the LARGEST elements", "content": "You use a **min-heap** to find the K **largest** elements. The minimum at the top is the weakest survivor — it's the one most at risk. Any incoming element that beats it earns a spot by evicting it. The K elements that outlast all challengers are the K largest." }
\`\`\`

### Three Flavors of the Pattern

\`\`\`tabs
{ "tabs": [ { "label": "K Largest", "icon": "⬆️", "content": "**Goal:** Find the K largest elements.\\n\\n**Tool:** Min-heap of size K\\n\\n**Rule:** Push if heap size < K. If new element > heap top, replace the top.\\n\\n\`\`\`python\\nimport heapq\\n\\ndef find_k_largest(nums, k):\\n    min_heap = []\\n    for num in nums:\\n        if len(min_heap) < k:\\n            heapq.heappush(min_heap, num)\\n        elif num > min_heap[0]:\\n            heapq.heapreplace(min_heap, num)\\n    return min_heap\\n\`\`\`\\n\\n**Why min-heap?** The smallest of the K winners sits at the top — it's the weakest survivor, first to be displaced by a stronger challenger." }, { "label": "K Smallest", "icon": "⬇️", "content": "**Goal:** Find the K smallest elements.\\n\\n**Tool:** Max-heap of size K — simulate in Python by negating values.\\n\\n**Rule:** Push if heap size < K. If new element < |heap top|, replace.\\n\\n\`\`\`python\\nimport heapq\\n\\ndef find_k_smallest(nums, k):\\n    max_heap = []  # negate to simulate max-heap\\n    for num in nums:\\n        if len(max_heap) < k:\\n            heapq.heappush(max_heap, -num)\\n        elif num < -max_heap[0]:\\n            heapq.heapreplace(max_heap, -num)\\n    return [-x for x in max_heap]\\n\`\`\`\\n\\n**Pattern flip:** The largest of the K smallest sits at the top as the weakest survivor — evicted whenever a smaller element appears." }, { "label": "K Most Frequent", "icon": "📊", "content": "**Goal:** Find the K most frequently occurring elements.\\n\\n**Tool:** Frequency map + min-heap of size K, keyed by frequency.\\n\\n\`\`\`python\\nimport heapq\\nfrom collections import Counter\\n\\ndef top_k_frequent(nums, k):\\n    freq_map = Counter(nums)  # {element: count}\\n    min_heap = []  # stores (frequency, element)\\n\\n    for elem, freq in freq_map.items():\\n        heapq.heappush(min_heap, (freq, elem))\\n        if len(min_heap) > k:\\n            heapq.heappop(min_heap)  # evict least frequent\\n\\n    return [elem for freq, elem in min_heap]\\n\\n# [1,1,1,2,2,3], k=2  →  [1, 2]\\n\`\`\`\\n\\n**Two-step pattern:** Always build the frequency map first, then run the heap pattern on (frequency, element) pairs so the heap compares by frequency." } ] }
\`\`\`

### When to Apply This Pattern

Look for these signals in a problem statement:

| Signal | Example |
|--------|---------|
| **"K largest / K smallest"** | Find the 3 largest numbers in a stream |
| **"Kth largest / Kth smallest"** | What is the 5th largest score? |
| **"K most / least frequent"** | Top 2 most common words in a document |
| **"K closest"** | K points nearest to the origin |
| **Real-time / streaming data** | Maintain a live top-10 leaderboard |

**Classic LeetCode problems using this exact pattern:**
- LC 215 — Kth Largest Element in an Array
- LC 347 — Top K Frequent Elements
- LC 973 — K Closest Points to Origin
- LC 703 — Kth Largest Element in a Stream

### Complexity Summary

| Approach | Time | Space |
|----------|------|-------|
| Sort then slice | O(n log n) | O(1) extra |
| **Heap — K largest/smallest** | **O(n log K)** | **O(K)** |
| **Heap — K most frequent** | **O(n log K)** | **O(n + K)** |

For n = 1,000,000 and K = 10: sorting costs ~20M operations; the heap costs ~33K. That's a **600× speedup** from one algorithmic choice.

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "You want the K largest elements. Which heap type and size do you maintain?", "options": ["Max-heap of size n", "Min-heap of size n", "Min-heap of size K", "Max-heap of size K"], "answer": 2, "explanation": "A min-heap of size K tracks the K largest seen so far. The heap's minimum is the weakest survivor — any new element larger than it earns a spot by displacing it." }, { "question": "Your min-heap (size K, full) has a top value of 8. You encounter a new element with value 5. What do you do?", "options": ["Push 5 and pop the top to maintain size K", "Replace the top (8) with 5", "Skip 5 — it cannot be in the K largest", "Rebuild the heap with 5 included"], "answer": 2, "explanation": "5 < heap_min (8), meaning 5 is smaller than all K elements currently in the heap. It has zero chance of being in the K largest, so skip it entirely." }, { "question": "For n = 10,000 elements and K = 10, approximately how many operations does the heap approach require compared to sorting?", "options": ["About the same — both are O(n log n)", "The heap uses ~4× fewer operations than sorting", "The heap uses ~100× fewer operations than sorting", "The heap is slower because heap operations are expensive"], "answer": 1, "explanation": "Sorting: O(n log n) ≈ 10,000 × 13.3 ≈ 133,000 ops. Heap: O(n log K) ≈ 10,000 × 3.3 ≈ 33,000 ops. That's roughly 4× fewer — the gap widens further as K stays small and n grows." }, { "question": "To find K most frequent elements using a heap, what values should be stored in the heap?", "options": ["Only the elements themselves, in order of appearance", "(frequency, element) pairs so the heap orders by frequency", "(element, index) pairs to track insertion order", "Only the frequencies, discarding the actual elements"], "answer": 1, "explanation": "The heap must compare by frequency, not by element value. Storing (frequency, element) tuples lets the min-heap evict the least-frequent element whenever the heap exceeds size K." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["A min-heap of size K finds the K largest elements in O(n log K) — far better than O(n log n) sorting when K << n.", "The heap acts as a bouncer: push freely until full, then only admit elements that beat the current minimum by evicting it.", "For K smallest, flip to a max-heap (negate values in Python) — same logic, opposite direction.", "For K most frequent: build a Counter/frequency map first, then run the heap pattern on (frequency, element) pairs.", "Space cost is O(K) — the heap never holds more than K elements, making this pattern highly memory-efficient for large datasets."] }
\`\`\``,
    },
    {
      id: "kth-largest-element",
      slug: "kth-largest-element",
      title: "Kth Largest Element in Array",
      content: `## Kth Largest Element in Array

<!-- voice:section_check concept="Min-heap for kth largest" -->

Given an integer array \`nums\` and an integer \`k\`, return the \`kth\` largest element in the array. Note that it is the \`kth\` largest element in **sorted order**, not the \`kth\` distinct element.

**Examples:**

| Input | k | Output | Reasoning |
|-------|---|--------|-----------|
| \`[3, 2, 1, 5, 6, 4]\` | 2 | \`5\` | Sorted: \`[1,2,3,4,5,6]\` → 2nd largest is 5 |
| \`[3, 2, 3, 1, 2, 4, 5, 5, 6]\` | 4 | \`4\` | 4th largest in the sorted array |

---

\`\`\`concept
{ "title": "The Min-Heap Insight", "variant": "mental-model", "content": "The kth largest element is the **smallest among the k largest elements**. A min-heap of size k naturally tracks exactly that: it holds the k biggest values seen so far, and its root is the smallest of those — your answer." }
\`\`\`

\`\`\`concept
{ "title": "Why Not Sort?", "variant": "rule", "content": "Sorting the entire array costs O(n log n). But you only care about k elements. By keeping a min-heap capped at size k, every insertion costs O(log k), giving you O(n log k) total — strictly better when k ≪ n." }
\`\`\`

---

### Algorithm Walkthrough

\`nums = [3, 2, 1, 5, 6, 4]\`, \`k = 2\`

\`\`\`algoviz
{
  "title": "Min-Heap of Size k=2 — processing [3,2,1,5,6,4]",
  "type": "array",
  "data": [3, 2, 1, 5, 6, 4],
  "frames": [
    { "highlight": [0], "label": "Push 3 → heap=[3]. Size 1 < k=2, no eviction.", "stats": { "heap": "[3]", "heap_min": "–" } },
    { "highlight": [1], "label": "Push 2 → heap=[2,3]. Size 2 = k, heap full.", "stats": { "heap": "[2,3]", "heap_min": "2" } },
    { "highlight": [2], "label": "1 ≤ heap_min(2), skip. Heap unchanged.", "stats": { "heap": "[2,3]", "heap_min": "2" } },
    { "highlight": [3], "label": "5 > heap_min(2) → evict 2, push 5. heap=[3,5]", "stats": { "heap": "[3,5]", "heap_min": "3" } },
    { "highlight": [4], "label": "6 > heap_min(3) → evict 3, push 6. heap=[5,6]", "stats": { "heap": "[5,6]", "heap_min": "5" } },
    { "highlight": [5], "label": "4 ≤ heap_min(5), skip. Heap unchanged.", "stats": { "heap": "[5,6]", "heap_min": "5" } },
    { "highlight": [], "label": "Done. heap root = 5 → the 2nd largest element!", "stats": { "heap": "[5,6]", "answer": "5" } }
  ],
  "speed": 900
}
\`\`\`

---

\`\`\`steps
{
  "title": "Implementation Steps",
  "steps": [
    { "title": "Create a min-heap", "content": "Initialize an empty min-heap. In Python, \`heapq\` is a min-heap by default — no configuration needed." },
    { "title": "Push elements, cap at k", "content": "For each number in \`nums\`:\\n- If heap size < k, push the number.\\n- Else if the number > heap root (current minimum of top-k), use \`heappushpop\` to evict the smallest and add the new number." },
    { "title": "Return the root", "content": "After all elements are processed, the heap contains the k largest elements. \`heap[0]\` is their minimum — that's the kth largest." }
  ]
}
\`\`\`

---

\`\`\`trace
{
  "title": "Step-by-step code trace — nums=[3,2,1,5,6,4], k=2",
  "language": "python",
  "code": "import heapq\\n\\ndef find_kth_largest(nums, k):\\n    heap = []\\n    for num in nums:\\n        if len(heap) < k:\\n            heapq.heappush(heap, num)\\n        elif num > heap[0]:\\n            heapq.heappushpop(heap, num)\\n    return heap[0]",
  "frames": [
    { "line": 4, "vars": { "heap": "[]", "num": "–" }, "note": "Start with empty heap" },
    { "line": 5, "vars": { "heap": "[]", "num": "3" }, "note": "Iterating: num=3" },
    { "line": 6, "vars": { "heap": "[]", "num": "3" }, "note": "len(heap)=0 < k=2 → push 3" },
    { "line": 7, "vars": { "heap": "[3]", "num": "2" }, "note": "num=2, len=1 < 2 → push 2" },
    { "line": 7, "vars": { "heap": "[2,3]", "num": "1" }, "note": "num=1, len=2 = k. Check: 1 > heap[0]=2? No → skip" },
    { "line": 8, "vars": { "heap": "[2,3]", "num": "5" }, "note": "num=5 > heap[0]=2 → heappushpop evicts 2, inserts 5" },
    { "line": 8, "vars": { "heap": "[3,5]", "num": "6" }, "note": "num=6 > heap[0]=3 → heappushpop evicts 3, inserts 6" },
    { "line": 8, "vars": { "heap": "[5,6]", "num": "4" }, "note": "num=4 > heap[0]=5? No → skip" },
    { "line": 9, "vars": { "heap": "[5,6]" }, "note": "Return heap[0] = 5 ✓", "stdout": "5" }
  ],
  "speed": 800
}
\`\`\`

---

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naive — Sort the whole array",
    "code": "def find_kth_largest(nums, k):\\n    nums.sort(reverse=True)\\n    return nums[k - 1]\\n# Time: O(n log n)  Space: O(1)\\n# Wasteful — sorts elements we never need"
  },
  "after": {
    "label": "Optimal — Min-heap of size k",
    "code": "import heapq\\n\\ndef find_kth_largest(nums, k):\\n    heap = []\\n    for num in nums:\\n        if len(heap) < k:\\n            heapq.heappush(heap, num)\\n        elif num > heap[0]:\\n            heapq.heappushpop(heap, num)\\n    return heap[0]\\n# Time: O(n log k)  Space: O(k)\\n# Only tracks the k elements that matter"
  }
}
\`\`\`

---

### Complexity

| | Value | Why |
|---|---|---|
| **Time** | O(n log k) | Process n elements; each heap op costs O(log k) |
| **Space** | O(k) | Heap holds at most k elements at any time |

\`\`\`callout
{ "type": "tip", "title": "QuickSelect Alternative", "content": "QuickSelect (a variant of QuickSort's partition step) finds the kth largest in **O(n) average time** and O(1) extra space. It's faster on average but has O(n²) worst-case and is more complex to implement correctly under interview time pressure. The heap solution is the safe, reliable choice for interviews." }
\`\`\`

---

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "You have nums = [7, 10, 4, 3, 20, 15] and k = 3. After processing all elements with a min-heap of size k=3, what does the heap contain?",
      "options": ["[4, 7, 10]", "[10, 15, 20]", "[7, 10, 15]", "[4, 10, 20]"],
      "answer": 1,
      "explanation": "The 3 largest elements in [7,10,4,3,20,15] are 10, 15, and 20. The min-heap stores these three, with 10 at the root. heap[0]=10 is the 3rd largest."
    },
    {
      "question": "Why do we use a MIN-heap (not a max-heap) to find the kth LARGEST element?",
      "options": [
        "A max-heap would give us the smallest elements instead",
        "A min-heap lets us quickly evict the smallest of our top-k candidates when a larger element arrives",
        "Python's heapq only supports min-heaps so we have no choice",
        "A min-heap uses less memory than a max-heap"
      ],
      "answer": 1,
      "explanation": "We keep exactly k elements in the heap. To decide whether a new element belongs in our top-k, we compare it against the current minimum (heap root). If it's larger, we swap. This requires fast access to the minimum — exactly what a min-heap provides."
    },
    {
      "question": "What is the time complexity of finding the kth largest element using the min-heap approach?",
      "options": ["O(k log n)", "O(n log n)", "O(n log k)", "O(n + k)"],
      "answer": 2,
      "explanation": "We iterate over all n elements once. For each element, a push or pushpop on the heap of size k costs O(log k). Total: O(n log k). This is better than sorting's O(n log n) when k ≪ n."
    },
    {
      "question": "nums = [1, 1, 1, 1, 1], k = 2. What does the function return?",
      "options": ["None", "2", "1", "0"],
      "answer": 2,
      "explanation": "The problem asks for the kth largest in sorted order, not the kth distinct. Sorted: [1,1,1,1,1]. The 2nd largest is 1. The heap correctly returns 1."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The kth largest element = the smallest element among the k largest — a min-heap of size k captures this directly.",
    "Time complexity is O(n log k): iterate all n elements, each heap operation costs O(log k). Better than O(n log n) sort when k is small.",
    "Space complexity is O(k): the heap never grows beyond k elements.",
    "Use heappushpop for efficiency — it pushes and pops in a single heap operation instead of two.",
    "QuickSelect gives O(n) average time but O(n²) worst case and is harder to implement correctly; the heap solution is the interview-safe choice."
  ]
}
\`\`\``,
      starterCode: `import heapq


def find_kth_largest(nums, k):
    """
    Find the kth largest element in an unsorted array.
    
    Args:
        nums: List of integers
        k: int, which largest element to find
    
    Returns:
        int: The kth largest element
    
    Example:
        >>> find_kth_largest([3, 2, 1, 5, 6, 4], 2)
        5
        >>> find_kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)
        4
    """
    # TODO: Use min-heap of size k to find kth largest
    # Hint: Heap will contain k largest elements, top is the kth largest
    pass


# ─── Test Cases ───

# Standard case
print(find_kth_largest([3, 2, 1, 5, 6, 4], 2))
# Expected: 5

# With duplicates
print(find_kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4))
# Expected: 4

# k=1 (largest element)
print(find_kth_largest([1, 2, 3, 4, 5], 1))
# Expected: 5

# k=n (smallest element)
print(find_kth_largest([1, 2, 3, 4, 5], 5))
# Expected: 1

# Single element
print(find_kth_largest([42], 1))
# Expected: 42

# All same elements
print(find_kth_largest([5, 5, 5, 5], 2))
# Expected: 5
`,
      solutionCode: `import heapq


def find_kth_largest(nums, k):
    """
    Find the kth largest element in an unsorted array.
    
    Time Complexity: O(n log k) — heap operations for n elements
    Space Complexity: O(k) — min-heap of size k
    """
    min_heap = []
    
    for num in nums:
        if len(min_heap) < k:
            heapq.heappush(min_heap, num)
        elif num > min_heap[0]:
            # Current num is larger than kth largest so far
            heapq.heapreplace(min_heap, num)
    
    # Top of min-heap is the kth largest
    return min_heap[0]


# Alternative using max-heap (negate all numbers)
def find_kth_largest_max_heap(nums, k):
    """
    Alternative using max-heap approach.
    """
    # Negate all numbers to simulate max-heap
    max_heap = [-num for num in nums]
    heapq.heapify(max_heap)
    
    # Pop k-1 largest elements
    for _ in range(k - 1):
        heapq.heappop(max_heap)
    
    # Next pop is kth largest
    return -heapq.heappop(max_heap)


# ─── Test Cases ───
print(find_kth_largest([3, 2, 1, 5, 6, 4], 2))
# Expected: 5

print(find_kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4))
# Expected: 4

print(find_kth_largest([1, 2, 3, 4, 5], 1))
# Expected: 5

print(find_kth_largest([1, 2, 3, 4, 5], 5))
# Expected: 1

print(find_kth_largest([42], 1))
# Expected: 42

print(find_kth_largest([5, 5, 5, 5], 2))
# Expected: 5
`,
    },
    {
      id: "kth-smallest-sorted-matrix",
      slug: "kth-smallest-sorted-matrix",
      title: "Kth Smallest Element in Sorted Matrix",
      content: `## Kth Smallest Element in Sorted Matrix

<!-- voice:section_check concept="Heap for kth smallest in sorted matrix" -->

Given an \`n × n\` matrix where every row and every column is sorted in ascending order, find the **kth smallest element** overall.

\`\`\`callout
{ "type": "info", "title": "Key Constraint", "content": "Rows and columns are each sorted, but elements across different rows can interleave. The last element of row 0 may be larger than the first element of row 2 — so you cannot simply index into the matrix." }
\`\`\`

### Examples

| Matrix | k | Sorted elements | Answer |
|--------|---|-----------------|--------|
| \`[[1,5,9],[10,11,13],[12,13,15]]\` | 8 | \`[1,5,9,10,11,12,13,13,15]\` | **13** |
| \`[[-5]]\` | 1 | \`[-5]\` | **-5** |

---

### Why a Heap?

\`\`\`concept
{ "title": "Sorted Matrix = k Merged Sorted Arrays", "variant": "analogy", "content": "Each row of the matrix is a sorted list. Finding the kth smallest across all rows is exactly the classic 'Merge K Sorted Lists' problem. A min-heap lets us always pull the globally smallest unprocessed element in O(log n) time — without fully sorting all n² values." }
\`\`\`

The heap maintains one candidate per row — always the smallest *remaining* element from that row. When you pop the global minimum, you push the next element from the same row, preserving the invariant. After **k pops**, you have the kth smallest.

---

### Algorithm Walkthrough

\`\`\`steps
{ "title": "Min-Heap Approach", "steps": [ { "title": "Seed the heap with row heads", "content": "Push \`(value, row, col)\` for every row's first element \`matrix[row][0]\`. The heap now has at most \`n\` entries." }, { "title": "Pop k−1 times", "content": "Each pop gives the current global minimum. After popping \`(val, r, c)\`, push \`(matrix[r][c+1], r, c+1)\` if column \`c+1\` exists — advancing that row's pointer." }, { "title": "The kth pop is the answer", "content": "The value returned by the kth \`heappop\` is the kth smallest element. No sorting needed beyond the heap order." } ] }
\`\`\`

---

### Step-by-Step Visualization

Matrix: \`[[1, 5, 9], [10, 11, 13], [12, 13, 15]]\`, k = 4

\`\`\`algoviz
{ "title": "Min-Heap Extraction (k=4)", "type": "array", "data": [1, 10, 12], "frames": [ { "highlight": [0], "label": "Initial heap: [(1,r0), (10,r1), (12,r2)]. Pop min = 1. Push next from row 0: 5.", "stats": { "pop": 1, "count": 1 } }, { "highlight": [0], "label": "Heap: [(5,r0), (10,r1), (12,r2)]. Pop min = 5. Push next from row 0: 9.", "stats": { "pop": 5, "count": 2 } }, { "highlight": [0], "label": "Heap: [(9,r0), (10,r1), (12,r2)]. Pop min = 9. Push next from row 0: row 0 exhausted — no push.", "stats": { "pop": 9, "count": 3 } }, { "highlight": [0], "label": "Heap: [(10,r1), (12,r2)]. Pop min = 10. This is the 4th pop → answer = 10.", "stats": { "pop": 10, "count": 4 } } ], "speed": 900 }
\`\`\`

---

### Python Implementation

\`\`\`playground
{ "title": "Kth Smallest in Sorted Matrix", "language": "python", "runnable": true, "code": "import heapq\\n\\ndef kth_smallest(matrix, k):\\n    n = len(matrix)\\n    # Seed heap with (value, row, col) for each row's first element\\n    heap = [(matrix[r][0], r, 0) for r in range(n)]\\n    heapq.heapify(heap)\\n\\n    count = 0\\n    while heap:\\n        val, r, c = heapq.heappop(heap)\\n        count += 1\\n        if count == k:\\n            return val\\n        if c + 1 < n:  # push next element from same row\\n            heapq.heappush(heap, (matrix[r][c + 1], r, c + 1))\\n\\n    return -1  # k out of range\\n\\n# Test\\nmatrix = [[1, 5, 9], [10, 11, 13], [12, 13, 15]]\\nprint(kth_smallest(matrix, 8))   # 13\\nprint(kth_smallest(matrix, 1))   # 1\\nprint(kth_smallest([[-5]], 1))   # -5\\n" }
\`\`\`

---

### Two Approaches Compared

\`\`\`tabs
{ "tabs": [ { "label": "Min-Heap (k-way merge)", "icon": "🏔️", "content": "**Time:** O(k log n) — k pops, each costs O(log n) for a heap of size n\\n\\n**Space:** O(n) — heap holds at most one element per row\\n\\n**Best when:** k is small relative to n². Naturally exploits the row+column sort structure.\\n\\n\`\`\`python\\nimport heapq\\n\\ndef kth_smallest(matrix, k):\\n    n = len(matrix)\\n    heap = [(matrix[r][0], r, 0) for r in range(n)]\\n    heapq.heapify(heap)\\n    for _ in range(k - 1):\\n        val, r, c = heapq.heappop(heap)\\n        if c + 1 < n:\\n            heapq.heappush(heap, (matrix[r][c+1], r, c+1))\\n    return heapq.heappop(heap)[0]\\n\`\`\`" }, { "label": "Max-Heap (global scan)", "icon": "📦", "content": "**Time:** O(n² log k) — scan all n² elements, heap size capped at k\\n\\n**Space:** O(k)\\n\\n**Best when:** you cannot exploit sorted structure (e.g., unsorted grid). For a *sorted* matrix the k-way merge is always faster.\\n\\n\`\`\`python\\nimport heapq\\n\\ndef kth_smallest_maxheap(matrix, k):\\n    heap = []  # max-heap via negation\\n    for row in matrix:\\n        for val in row:\\n            heapq.heappush(heap, -val)\\n            if len(heap) > k:\\n                heapq.heappop(heap)\\n    return -heap[0]\\n\`\`\`" }, { "label": "Binary Search on Value", "icon": "🔍", "content": "**Time:** O(n log(max−min)) — binary search the value range; each count step is O(n)\\n\\n**Space:** O(1)\\n\\n**Best when:** k is large (close to n²) and the value range is bounded. More complex to implement correctly in an interview.\\n\\n\`\`\`python\\ndef kth_smallest_bs(matrix, k):\\n    n = len(matrix)\\n    lo, hi = matrix[0][0], matrix[n-1][n-1]\\n    while lo < hi:\\n        mid = (lo + hi) // 2\\n        # Count elements <= mid using top-right traversal\\n        count, r, c = 0, 0, n - 1\\n        while r < n and c >= 0:\\n            if matrix[r][c] <= mid:\\n                count += c + 1\\n                r += 1\\n            else:\\n                c -= 1\\n        if count >= k:\\n            hi = mid\\n        else:\\n            lo = mid + 1\\n    return lo\\n\`\`\`" } ] }
\`\`\`

---

### Complexity Summary

| Approach | Time | Space | When to use |
|----------|------|-------|-------------|
| Min-heap (k-way merge) | O(k log n) | O(n) | k small, standard interview answer |
| Max-heap (global scan) | O(n² log k) | O(k) | Unsorted input |
| Binary search on value | O(n log V) | O(1) | k large, follow-up question |

\`\`\`callout
{ "type": "tip", "title": "Interview Strategy", "content": "Lead with the min-heap solution — it directly maps to the 'Merge K Sorted Lists' pattern the interviewer expects. Mention binary search as the O(1)-space follow-up if asked about memory optimization." }
\`\`\`

---

\`\`\`collapse
{ "title": "Deep Dive: Why the Heap Invariant Holds", "content": "At every point, the heap contains exactly one 'frontier' element per active row — the smallest element in that row that hasn't been popped yet. When you pop \`(val, r, c)\`, you advance row r's pointer to \`c+1\`. No smaller element from any other row can have been skipped, because each row's previous elements were already popped (they're smaller). This guarantees the kth pop is exactly the kth globally smallest element — no element can be overlooked.\\n\\nThis is identical to the invariant maintained in LeetCode #23 Merge K Sorted Lists." }
\`\`\`

---

### Check Your Understanding

\`\`\`quiz
{ "title": "Kth Smallest in Sorted Matrix", "questions": [ { "question": "What is the time complexity of the min-heap (k-way merge) approach for an n×n sorted matrix?", "options": ["O(n² log n)", "O(k log n)", "O(n log k)", "O(k log k)"], "answer": 1, "explanation": "The heap holds at most n elements (one per row). We perform k pop operations, each costing O(log n), giving O(k log n) total." }, { "question": "Why do we push \`(matrix[r][c+1], r, c+1)\` after popping \`(val, r, c)\`?", "options": ["To avoid revisiting the same row", "To maintain the invariant that the heap always contains the smallest remaining element from each active row", "To reset the heap after each extraction", "Because columns are unsorted"], "answer": 1, "explanation": "Advancing the column pointer keeps one frontier per row in the heap. This invariant guarantees the next pop always yields the global minimum among all unprocessed row-heads." }, { "question": "Which approach uses O(1) extra memory?", "options": ["Min-heap k-way merge", "Max-heap global scan", "Binary search on value", "All three use O(n) space"], "answer": 2, "explanation": "Binary search on value traverses the matrix in-place using two integer pointers (row, col) for counting, requiring no auxiliary data structure." }, { "question": "For a 300×300 matrix (n=300) with k=1, how many heap pops are needed with the min-heap approach?", "options": ["300", "90000", "1", "log(300)"], "answer": 2, "explanation": "We stop at the kth pop. With k=1 we pop exactly once, returning the top-left element matrix[0][0] which is the global minimum. O(k log n) = O(1 · log 300) ≈ O(8)." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "A sorted matrix with n rows is equivalent to k sorted lists — apply the k-way merge pattern with a min-heap of size n.", "Time complexity is O(k log n): k heap pops × O(log n) per pop. Space is O(n) for the heap.", "Seed the heap with every row's first element, then advance the row pointer on each pop.", "Binary search on the answer value achieves O(1) space and is useful when k ≈ n² — save it for the follow-up." ] }
\`\`\``,
      starterCode: `import heapq


def kth_smallest_matrix(matrix, k):
    """
    Find kth smallest element in a sorted n x n matrix.
    
    Args:
        matrix: n x n matrix where rows and columns are sorted
        k: int, which smallest element to find
    
    Returns:
        int: The kth smallest element
    
    Example:
        >>> kth_smallest_matrix([[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8)
        13
    """
    # TODO: Use min-heap to merge sorted rows
    # Hint: Start with first element of each row, track (value, row, col)
    pass


# ─── Test Cases ───

# Standard case
print(kth_smallest_matrix([[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8))
# Expected: 13

# Single element
print(kth_smallest_matrix([[-5]], 1))
# Expected: -5

# k=1 (smallest)
print(kth_smallest_matrix([[1, 2], [3, 4]], 1))
# Expected: 1

# k=n*n (largest)
print(kth_smallest_matrix([[1, 2], [3, 4]], 4))
# Expected: 4

# 2x2 matrix
print(kth_smallest_matrix([[1, 3], [2, 4]], 3))
# Expected: 3
`,
      solutionCode: `import heapq


def kth_smallest_matrix(matrix, k):
    """
    Find kth smallest element in a sorted n x n matrix.
    
    Time Complexity: O(k log n) — k heap operations, heap size n
    Space Complexity: O(n) — heap stores one element per row max
    """
    n = len(matrix)
    
    # Min-heap: (value, row, col)
    # Start with first element of each row
    min_heap = []
    for r in range(min(n, k)):  # Only need first k rows
        min_heap.append((matrix[r][0], r, 0))
    
    heapq.heapify(min_heap)
    
    # Pop k-1 smallest elements
    for _ in range(k - 1):
        val, row, col = heapq.heappop(min_heap)
        
        # Push next element from same row if exists
        if col + 1 < n:
            heapq.heappush(min_heap, (matrix[row][col + 1], row, col + 1))
    
    # kth smallest is at heap top
    return min_heap[0][0]


# Alternative: Binary Search approach (O(n log(max-min)))
def kth_smallest_binary_search(matrix, k):
    """
    Alternative using binary search on value range.
    """
    n = len(matrix)
    
    def count_less_equal(mid):
        """Count elements <= mid in sorted matrix."""
        count = 0
        row, col = n - 1, 0  # Start from bottom-left
        
        while row >= 0 and col < n:
            if matrix[row][col] <= mid:
                # All elements in this column up to row are <= mid
                count += row + 1
                col += 1
            else:
                row -= 1
        
        return count
    
    left, right = matrix[0][0], matrix[n-1][n-1]
    
    while left < right:
        mid = left + (right - left) // 2
        if count_less_equal(mid) < k:
            left = mid + 1
        else:
            right = mid
    
    return left


# ─── Test Cases ───
print(kth_smallest_matrix([[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8))
# Expected: 13

print(kth_smallest_matrix([[-5]], 1))
# Expected: -5

print(kth_smallest_matrix([[1, 2], [3, 4]], 1))
# Expected: 1

print(kth_smallest_matrix([[1, 2], [3, 4]], 4))
# Expected: 4

print(kth_smallest_matrix([[1, 3], [2, 4]], 3))
# Expected: 3
`,
    },
    {
      id: "k-closest-points-origin",
      slug: "k-closest-points-origin",
      title: "Find K Closest Points to Origin",
      content: `## Find K Closest Points to Origin

<!-- voice:section_check concept="Max-heap for k closest points" -->

Given an array of \`points\` where \`points[i] = [xi, yi]\` represents a point on the X-Y plane and an integer \`k\`, return the \`k\` closest points to the origin \`(0, 0)\`.

The Euclidean distance from any point \`(x, y)\` to the origin is \`sqrt(x² + y²)\`. You may return the answer in **any order** — only the set matters, not its sequence.

**Examples:**

| Input \`points\` | \`k\` | Output |
|---|---|---|
| \`[[1,3],[-2,2]]\` | 1 | \`[[-2,2]]\` — dist² 8 beats dist² 10 |
| \`[[3,3],[5,-1],[-2,4]]\` | 2 | \`[[3,3],[-2,4]]\` |

---

### The Core Insight

\`\`\`concept
{ "title": "Max-Heap as a Size-K Bouncer", "variant": "mental-model", "content": "Think of the max-heap as a bouncer maintaining an exclusive list of exactly k guests. Every new point knocks on the door and asks: 'Am I closer to the origin than the farthest person already inside?' If yes, the farthest is evicted and the newcomer takes their place.\\n\\nThe heap root is always the farthest of the current k candidates — a cheap O(1) comparison target for each new point. After all n points have been checked, whoever remains on the list is your answer." }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Skip the Square Root", "content": "Comparing sqrt(x² + y²) against sqrt(a² + b²) is identical to comparing x² + y² against a² + b². Since both sides are non-negative, the square root is order-preserving — so you never need to compute it. This avoids floating-point overhead on every comparison and is a standard interview technique." }
\`\`\`

---

### Approach Comparison

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Naive Sort — O(n log n)", "code": "def kClosest(points, k):\\n    # Sorts ALL n points — wasteful when k << n\\n    points.sort(key=lambda p: p[0]**2 + p[1]**2)\\n    return points[:k]" }, "after": { "label": "Max-Heap — O(n log k)", "code": "import heapq\\n\\ndef kClosest(points, k):\\n    heap = []  # max-heap via negated distances\\n    for x, y in points:\\n        dist = x*x + y*y\\n        heapq.heappush(heap, (-dist, [x, y]))\\n        if len(heap) > k:\\n            heapq.heappop(heap)  # evict farthest\\n    return [p for _, p in heap]" } }
\`\`\`

---

### Step-by-Step Algorithm

\`\`\`steps
{ "title": "Max-Heap Algorithm for K Closest Points", "steps": [ { "title": "Initialize an empty max-heap", "content": "The heap will hold at most \`k\` entries at any time. In Python, \`heapq\` is a min-heap by default — we negate the distance to simulate max-heap behavior." }, { "title": "For each point, compute squared distance", "content": "Calculate \`dist = x*x + y*y\`. No \`sqrt\` needed — squared distances preserve the same ordering for non-negative values." }, { "title": "Push (-dist, point) and check heap size", "content": "After pushing, if \`len(heap) > k\`, pop the root. The root holds \`-max_dist\`, so popping removes the **farthest** point and restores the heap to size k." }, { "title": "Return all points remaining in the heap", "content": "After processing all n points, the heap holds exactly the k closest points. Extract with \`[p for _, p in heap]\`. Order within the result doesn't matter." } ] }
\`\`\`

---

### Algorithm Trace: \`points = [[1,3],[-2,2],[3,3]]\`, \`k = 2\`

\`\`\`algoviz
{ "title": "Max-Heap Execution (k=2)", "type": "array", "data": [10, 8, 18], "frames": [ { "highlight": [], "label": "Compute squared distances: [1,3]→10, [-2,2]→8, [3,3]→18. Heap is empty.", "stats": { "heap_size": 0, "heap_max": "—" } }, { "highlight": [0], "label": "Point [1,3], dist²=10. Push (-10,[1,3]). Heap size=1 ≤ k=2, no eviction.", "stats": { "heap_size": 1, "heap_max": 10 } }, { "highlight": [1], "label": "Point [-2,2], dist²=8. Push (-8,[-2,2]). Heap size=2 = k=2, no eviction.", "stats": { "heap_size": 2, "heap_max": 10 } }, { "highlight": [2], "label": "Point [3,3], dist²=18. Push (-18,[3,3]). Heap size=3 > k=2 → pop root (dist=18). Evict [3,3].", "stats": { "heap_size": 2, "heap_max": 10 } }, { "highlight": [0, 1], "label": "All points processed. Heap contains [1,3] and [-2,2] — the 2 closest to origin.", "stats": { "heap_size": 2, "heap_max": 10 } } ], "speed": 900 }
\`\`\`

---

### Runnable Solution

\`\`\`playground
{ "title": "K Closest Points — Full Solution", "language": "python", "code": "import heapq\\nfrom typing import List\\n\\ndef kClosest(points: List[List[int]], k: int) -> List[List[int]]:\\n    heap = []  # stores (-dist_squared, [x, y])\\n    for x, y in points:\\n        dist = x * x + y * y\\n        heapq.heappush(heap, (-dist, [x, y]))\\n        if len(heap) > k:\\n            heapq.heappop(heap)  # remove farthest\\n    return [point for _, point in heap]\\n\\n# Test cases\\nprint(kClosest([[1, 3], [-2, 2]], 1))          # [[-2, 2]]\\nprint(kClosest([[3, 3], [5, -1], [-2, 4]], 2)) # [[3,3],[-2,4]] (any order)\\nprint(kClosest([[0, 1], [1, 0]], 2))           # both — equal distance", "runnable": true }
\`\`\`

---

### Complexity Analysis

| Approach | Time | Space | When to use |
|---|---|---|---|
| Sorting | O(n log n) | O(1) | k close to n, simple code |
| **Max-Heap** | **O(n log k)** | **O(k)** | k << n — the typical case |
| Quickselect | O(n) average, O(n²) worst | O(1) | When average-case speed is critical |

<!-- voice:key_insight insight="O(n log k) is dramatically faster than O(n log n) when k is small. For k=10 across a million points: log(10)≈3 vs log(1,000,000)=20 — nearly 7x fewer operations per point." -->

\`\`\`callout
{ "type": "info", "title": "Edge Cases to Handle in Interviews", "content": "- **k equals total points:** The heap never evicts — return the entire input.\\n- **Empty input:** Return \`[]\` immediately.\\n- **Duplicate distances:** Multiple points can be equidistant; all can validly appear.\\n- **Very large n, small k:** This is where the heap shines vs. sorting." }
\`\`\`

---

### Knowledge Check

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`quiz
{ "title": "K Closest Points — Check Your Understanding", "questions": [ { "question": "Why do we use a max-heap (not a min-heap) to find the k CLOSEST points?", "options": [ "A min-heap cannot store coordinate pairs", "We track the k smallest distances by always knowing — and evicting — the largest among them, which sits at the max-heap root", "A max-heap uses less memory for this problem", "We need the farthest point as the final answer" ], "answer": 1, "explanation": "The max-heap root is always the largest distance among the current k candidates. Each new point is compared against this maximum in O(1). If the new point is closer, we pop the root (evict the farthest) and push the new point. This invariant ensures the heap always holds the k closest points seen so far." }, { "question": "For the point (3, 4), what value should be pushed onto the max-heap?", "options": [ "5 (Euclidean distance)", "-5", "-25 (negated squared distance)", "25 (squared distance)" ], "answer": 2, "explanation": "Squared distance = 3² + 4² = 9 + 16 = 25. We push the NEGATED value (-25) because Python's heapq is a min-heap. The most-negative entry (-25 = largest distance) sits at the root, so popping it evicts the farthest point — simulating max-heap behavior." }, { "question": "What is the time complexity of the max-heap approach?", "options": [ "O(n)", "O(n log n)", "O(n log k)", "O(k log n)" ], "answer": 2, "explanation": "We process each of the n points exactly once. Each heap push/pop operates on a heap of at most k elements, costing O(log k). Total: O(n log k). This is strictly better than O(n log n) sorting whenever k < n." }, { "question": "Points A and B have squared distances 15 and 15. k = 1. Which is returned?", "options": [ "Always A (first encountered)", "Always B (last encountered)", "Either — both are valid answers since they're equidistant", "Neither — ties are undefined behavior" ], "answer": 2, "explanation": "The problem states you may return the answer in any order, and equidistant points are equally valid candidates. In practice the heap will keep whichever it received last (implementation-dependent), but either constitutes a correct answer." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Use a max-heap of size k — it holds the k closest points with the farthest at the root for O(1) eviction decisions.", "Always use squared distance (x² + y²) — sqrt is order-preserving on non-negatives so it never changes the comparison result.", "Time complexity is O(n log k), space is O(k) — dramatically better than O(n log n) sort when k << n.", "In Python: simulate max-heap by negating the key; in Java: pass a custom Comparator reversing distance order to PriorityQueue.", "Related patterns: Kth Largest Element (#215), Top K Frequent Elements (#347), K Closest Values to Target (#658) — all use the same size-k heap trick." ] }
\`\`\``,
      starterCode: `import heapq


def k_closest(points, k):
    """
    Find k closest points to origin.
    
    Args:
        points: List of [x, y] coordinates
        k: int, number of closest points to return
    
    Returns:
        List of [x, y] coordinates, k closest to origin
    
    Example:
        >>> k_closest([[1, 3], [-2, 2]], 1)
        [[-2, 2]]
        >>> k_closest([[3, 3], [5, -1], [-2, 4]], 2)
        [[3, 3], [-2, 4]]  # or [[-2, 4], [3, 3]]
    """
    # TODO: Use max-heap of size k to track k closest points
    # Hint: Store (-distance, point) for max-heap in Python
    pass


# ─── Test Cases ───

# Standard case
print(k_closest([[1, 3], [-2, 2]], 1))
# Expected: [[-2, 2]]

# Two closest from three
result = k_closest([[3, 3], [5, -1], [-2, 4]], 2)
print(sorted(result))  # Sort for consistent comparison
# Expected: [[-2, 4], [3, 3]] (sorted)

# k equals number of points
print(k_closest([[1, 1], [2, 2]], 2))
# Expected: [[1, 1], [2, 2]] (any order)

# All same distance
print(k_closest([[1, 1], [-1, 1], [1, -1], [-1, -1]], 2))
# Expected: Any 2 of the 4 points

# Single point
print(k_closest([[0, 0]], 1))
# Expected: [[0, 0]]
`,
      solutionCode: `import heapq


def k_closest(points, k):
    """
    Find k closest points to origin.
    
    Time Complexity: O(n log k) — n points, heap operations O(log k)
    Space Complexity: O(k) — max-heap of size k
    """
    # Max-heap: store (-distance, point) to simulate max-heap
    max_heap = []
    
    for x, y in points:
        # Use squared distance (same ordering, avoid sqrt)
        dist = x * x + y * y
        
        if len(max_heap) < k:
            # Negate distance for max-heap behavior
            heapq.heappush(max_heap, (-dist, [x, y]))
        elif dist < -max_heap[0][0]:
            # Current point is closer than farthest in heap
            heapq.heapreplace(max_heap, (-dist, [x, y]))
    
    # Extract points from heap
    return [point for (_, point) in max_heap]


# Alternative: Sort approach (O(n log n))
def k_closest_sort(points, k):
    """
    Alternative using sorting.
    """
    # Sort by squared distance
    points.sort(key=lambda p: p[0]**2 + p[1]**2)
    return points[:k]


# Alternative: QuickSelect approach (O(n) average)
def k_closest_quickselect(points, k):
    """
    Alternative using QuickSelect for O(n) average.
    """
    def dist_sq(p):
        return p[0]**2 + p[1]**2
    
    def partition(left, right, pivot_idx):
        pivot_dist = dist_sq(points[pivot_idx])
        # Move pivot to end
        points[pivot_idx], points[right] = points[right], points[pivot_idx]
        
        store_idx = left
        for i in range(left, right):
            if dist_sq(points[i]) < pivot_dist:
                points[store_idx], points[i] = points[i], points[store_idx]
                store_idx += 1
        
        # Move pivot to final place
        points[right], points[store_idx] = points[store_idx], points[right]
        return store_idx
    
    def select(left, right, k_smallest):
        if left == right:
            return
        
        pivot_idx = left + (right - left) // 2
        pivot_idx = partition(left, right, pivot_idx)
        
        if k_smallest == pivot_idx:
            return
        elif k_smallest < pivot_idx:
            select(left, pivot_idx - 1, k_smallest)
        else:
            select(pivot_idx + 1, right, k_smallest)
    
    select(0, len(points) - 1, k)
    return points[:k]


# ─── Test Cases ───
print(k_closest([[1, 3], [-2, 2]], 1))
# Expected: [[-2, 2]]

result = k_closest([[3, 3], [5, -1], [-2, 4]], 2)
print(sorted(result))
# Expected: [[-2, 4], [3, 3]] (sorted for comparison)

print(k_closest([[1, 1], [2, 2]], 2))
# Expected: [[1, 1], [2, 2]]

print(k_closest([[0, 0]], 1))
# Expected: [[0, 0]]
`,
    },
    {
      id: "top-k-frequent-elements",
      slug: "top-k-frequent-elements",
      title: "Top K Frequent Elements",
      content: `## Top K Frequent Elements

<!-- voice:section_check concept="Min-heap for top k frequent elements" -->

Given an array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. Order doesn't matter — only membership.

\`\`\`
Input:  nums = [1, 1, 1, 2, 2, 3],  k = 2
Output: [1, 2]   → 1 appears 3×, 2 appears 2×, 3 appears 1×

Input:  nums = [1],  k = 1
Output: [1]
\`\`\`

The instinctive approach — count frequencies, sort descending, take the first \`k\` — is correct but costs **O(n log n)**. Since we only need \`k\` winners, we can do far better.

\`\`\`concept
{ "title": "Why a Min-Heap, Not a Max-Heap?", "variant": "insight", "content": "To keep the k *most* frequent elements, maintain a min-heap capped at size k, ordered by frequency. The *minimum* frequency always sits at the root. The moment the heap exceeds k, pop the root — instantly evicting the least-frequent candidate in O(log k). A max-heap would have the wrong element at the root for eviction: you would need to search the whole structure to find the minimum." }
\`\`\`

### Algorithm

\`\`\`steps
{ "title": "Top K Frequent — Step by Step", "steps": [ { "title": "Build the frequency map", "content": "Scan \`nums\` once and count each element's occurrences with a hash map. This is O(n) time and O(n) space.\\n\\n\`\`\`python\\ncount = Counter(nums)  # {1: 3, 2: 2, 3: 1}\\n\`\`\`" }, { "title": "Stream elements into a min-heap of size k", "content": "For each \`(num, freq)\` pair, push \`(freq, num)\` onto the heap. Whenever the heap grows beyond \`k\`, pop — ejecting the element with the lowest frequency.\\n\\n\`\`\`python\\nfor num, freq in count.items():\\n    heapq.heappush(min_heap, (freq, num))\\n    if len(min_heap) > k:\\n        heapq.heappop(min_heap)\\n\`\`\`\\n\\nThe heap never holds more than \`k + 1\` elements, so each push/pop pair costs O(log k)." }, { "title": "Extract the result", "content": "After processing every element, the heap holds exactly the \`k\` most frequent. Pull the numbers out — order is irrelevant.\\n\\n\`\`\`python\\nreturn [num for freq, num in min_heap]\\n\`\`\`" } ] }
\`\`\`

### Execution Trace

Watch the heap evolve on \`nums = [1, 1, 1, 2, 2, 3]\`, \`k = 2\`:

\`\`\`trace
{ "title": "Heap State on [1,1,1,2,2,3], k=2", "language": "python", "code": "from collections import Counter\\nimport heapq\\n\\ndef topKFrequent(nums, k):\\n    count = Counter(nums)\\n    min_heap = []\\n    for num, freq in count.items():\\n        heapq.heappush(min_heap, (freq, num))\\n        if len(min_heap) > k:\\n            heapq.heappop(min_heap)\\n    return [num for freq, num in min_heap]", "frames": [ { "line": 5, "vars": { "count": "{1:3, 2:2, 3:1}", "min_heap": "[]" }, "note": "Counter scans nums in O(n) — element mapped to its frequency" }, { "line": 8, "vars": { "num": "1", "freq": "3", "min_heap": "[(3,1)]" }, "note": "Push (freq=3, num=1). Size 1 ≤ k=2 — no eviction" }, { "line": 8, "vars": { "num": "2", "freq": "2", "min_heap": "[(2,2),(3,1)]" }, "note": "Push (freq=2, num=2). Min root is (2,2). Size 2 = k — still no eviction" }, { "line": 8, "vars": { "num": "3", "freq": "1", "min_heap": "[(1,3),(2,2),(3,1)]" }, "note": "Push (freq=1, num=3). Size 3 > k=2 — eviction triggered!" }, { "line": 10, "vars": { "popped": "(1,3)", "min_heap": "[(2,2),(3,1)]" }, "note": "Pop root (freq=1, num=3). Element 3 is eliminated as the least frequent. Heap is back to size k" }, { "line": 11, "vars": { "result": "[1, 2]" }, "note": "Extract nums from remaining heap — elements 1 and 2 are the top-2 most frequent. Done." } ], "speed": 900 }
\`\`\`

### Heap vs Sorting

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Sort all frequencies — O(n log n)", "code": "# Sorts EVERY unique element. Wasteful when k << n.\\nfrequency_counter = Counter(nums)\\nsorted_items = sorted(\\n    frequency_counter.items(),\\n    key=lambda x: x[1],\\n    reverse=True\\n)\\nreturn [item[0] for item in sorted_items[:k]]" }, "after": { "label": "Min-heap of size k — O(n log k)", "code": "# Heap never grows beyond k+1. Evicts the weakest\\n# candidate immediately. Scales when k << n.\\ncount = Counter(nums)\\nmin_heap = []\\nfor num, freq in count.items():\\n    heapq.heappush(min_heap, (freq, num))\\n    if len(min_heap) > k:\\n        heapq.heappop(min_heap)\\nreturn [num for freq, num in min_heap]" } }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Python one-liner for interviews", "content": "Python's \`Counter\` exposes \`most_common(k)\` — it uses the same O(n log k) heap internally. Clean and idiomatic:\\n\\n\`\`\`python\\nreturn [num for num, _ in Counter(nums).most_common(k)]\\n\`\`\`\\n\\nMention the underlying heap logic when explaining your approach so the interviewer knows you understand the mechanism, not just the API." }
\`\`\`

### Complexity

| | Complexity | Why |
|---|---|---|
| **Time** | O(n log k) | O(n) counting + O(n log k) for n heap operations, each capped at O(log k) |
| **Space** | O(n + k) | Frequency map O(n) + heap O(k) |

When \`k = n\` this degrades to O(n log n) — a full sort. The gain is largest when \`k ≪ n\`, which is the common real-world case (top 10 results from a million items).

<!-- voice:key_insight insight="Use heapq.nlargest with key=frequency for a clean solution, or manually maintain a min-heap of size k" -->

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "Why is a min-heap used instead of a max-heap for this problem?", "options": ["A min-heap uses less memory", "The min-heap root holds the smallest frequency, so the least-frequent element can be evicted in O(log k)", "Python's heapq module only supports min-heaps", "A max-heap cannot store (frequency, element) tuples"], "answer": 1, "explanation": "When the heap exceeds size k, you need to remove the element with the *smallest* frequency — the weakest candidate. In a min-heap that element is always at the root, making removal O(log k). With a max-heap the smallest element could be buried anywhere, requiring a full O(k) search." }, { "question": "What is the time complexity of the heap-based approach?", "options": ["O(n log n)", "O(n log k)", "O(k log n)", "O(n + k)"], "answer": 1, "explanation": "Counting frequencies is O(n). We then push each unique element into a heap that is capped at size k — each push costs O(log k). Over n elements: O(n) + O(n log k) = O(n log k). This beats O(n log n) whenever k < n." }, { "question": "For nums = [4, 4, 4, 2, 2, 1] and k = 2, what is in the heap just before the return statement?", "options": ["[(1,1), (2,4)]", "[(2,2), (3,4)]", "[(1,1), (3,4)]", "[(2,4), (3,2)]"], "answer": 1, "explanation": "Frequencies: {4:3, 2:2, 1:1}. Push (3,4) → size 1. Push (2,2) → size 2. Push (1,1) → size 3 > k=2, pop min (1,1). Remaining: [(2,2),(3,4)]. These represent elements 2 (freq=2) and 4 (freq=3)." }, { "question": "Which of these is a common implementation mistake?", "options": ["Using Counter instead of a manual loop", "Using a max-heap and forgetting to cap it at size k", "Returning the heap directly without extracting element values", "Both B and C"], "answer": 3, "explanation": "Two common errors: (1) using a max-heap makes it expensive to find and remove the least-frequent element when the heap is full; (2) returning the heap structure (a list of (freq, num) tuples) instead of extracting just the nums. Both will fail test cases." } ] }
\`\`\`

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["Maintain a min-heap of size exactly k — pop the root whenever size exceeds k to evict the least-frequent element in O(log k)", "Time is O(n log k): O(n) to count frequencies + O(n log k) for heap operations. Beats O(n log n) sorting whenever k < n", "A min-heap works because the element to discard (minimum frequency) lives at the root — O(1) access, O(log k) removal", "Python shortcut: Counter(nums).most_common(k) is valid in interviews and uses the same heap internally", "The heap never exceeds k+1 elements, so heap space is O(k); the frequency map dominates at O(n)" ] }
\`\`\``,
      starterCode: `import heapq
from collections import Counter


def top_k_frequent(nums, k):
    """
    Find k most frequent elements.
    
    Args:
        nums: List of integers
        k: int, number of most frequent elements to return
    
    Returns:
        List of k most frequent elements
    
    Example:
        >>> top_k_frequent([1, 1, 1, 2, 2, 3], 2)
        [1, 2]
        >>> top_k_frequent([1], 1)
        [1]
    """
    # TODO: Count frequencies, then use min-heap to find top k
    # Hint: Use Counter for frequencies, then heap with (freq, num)
    pass


# ─── Test Cases ───

# Standard case
result = top_k_frequent([1, 1, 1, 2, 2, 3], 2)
print(sorted(result))  # Sort for consistent comparison
# Expected: [1, 2]

# Single element
print(top_k_frequent([1], 1))
# Expected: [1]

# All same frequency (any k elements valid)
result = top_k_frequent([1, 2, 3, 4], 2)
print(len(result))
# Expected: 2

# k equals unique elements
result = top_k_frequent([1, 1, 2, 2], 2)
print(sorted(result))
# Expected: [1, 2]

# More complex case
result = top_k_frequent([4, 1, -1, 2, -1, 2, 3], 2)
print(sorted(result))
# Expected: [-1, 2] (both appear twice)
`,
      solutionCode: `import heapq
from collections import Counter


def top_k_frequent(nums, k):
    """
    Find k most frequent elements.
    
    Time Complexity: O(n log k) — counting O(n), heap O(n log k)
    Space Complexity: O(n) — frequency map
    """
    # Count frequencies
    freq_map = Counter(nums)
    
    # Use min-heap of size k
    min_heap = []
    
    for num, freq in freq_map.items():
        if len(min_heap) < k:
            heapq.heappush(min_heap, (freq, num))
        elif freq > min_heap[0][0]:
            heapq.heapreplace(min_heap, (freq, num))
    
    # Extract elements
    return [num for (freq, num) in min_heap]


# Cleaner alternative using heapq.nlargest
def top_k_frequent_clean(nums, k):
    """
    Clean solution using heapq.nlargest.
    """
    freq_map = Counter(nums)
    # nlargest returns k elements with largest frequency
    return heapq.nlargest(k, freq_map.keys(), key=freq_map.get)


# Alternative using bucket sort (O(n) time)
def top_k_frequent_bucket(nums, k):
    """
    O(n) solution using bucket sort.
    """
    freq_map = Counter(nums)
    n = len(nums)
    
    # Buckets[i] contains elements with frequency i
    buckets = [[] for _ in range(n + 1)]
    
    for num, freq in freq_map.items():
        buckets[freq].append(num)
    
    # Collect from highest frequency bucket
    result = []
    for i in range(n, 0, -1):
        result.extend(buckets[i])
        if len(result) >= k:
            return result[:k]
    
    return result[:k]


# ─── Test Cases ───
result = top_k_frequent([1, 1, 1, 2, 2, 3], 2)
print(sorted(result))
# Expected: [1, 2]

print(top_k_frequent([1], 1))
# Expected: [1]

result = top_k_frequent([1, 2, 3, 4], 2)
print(len(result))
# Expected: 2

result = top_k_frequent([1, 1, 2, 2], 2)
print(sorted(result))
# Expected: [1, 2]

result = top_k_frequent([4, 1, -1, 2, -1, 2, 3], 2)
print(sorted(result))
# Expected: [-1, 2]
`,
    },
    {
      id: "top-k-elements-checkpoint",
      slug: "top-k-elements-checkpoint",
      title: "Module Checkpoint: Top K Elements",
      content: `## Module Checkpoint: Top K Elements

<!-- voice:checkpoint_intro -->

You've reached the end of the **Top K Elements** module. This pattern — using a bounded heap to avoid sorting the entire dataset — appears consistently in real interview rounds at companies across the industry. Let's confirm you can apply it fluently before moving on.

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "A min-heap of size k efficiently tracks the k largest elements in O(n log k) time and O(k) space — strictly better than O(n log n) sorting when k < n.", "A max-heap of size k tracks the k smallest or k closest elements; the root holds the eviction threshold and gets replaced whenever a better candidate arrives.", "Squared Euclidean distance (x² + y²) preserves the same ordering as true distance — skipping √ avoids floating-point overhead with no loss of correctness in K Closest Points.", "Top K Frequent Elements pairs a frequency Counter with a min-heap keyed on count: O(n log k) time, O(n) space.", "For Kth Smallest in a Sorted Matrix, seed the heap with the first element of each row (heap size = n rows), then pop k times for O(k log n) total." ] }
\`\`\`

### The Core Rule: Heap Type vs. Goal

\`\`\`concept
{ "title": "Heap Type Selection", "variant": "rule", "content": "To track the K LARGEST elements → use a MIN-heap of size k. The root is your eviction threshold: the smallest of your top-k candidates. Anything smaller gets immediately evicted.\\n\\nTo track the K SMALLEST elements → use a MAX-heap of size k. The root is the largest of your bottom-k candidates. Anything larger gets evicted.\\n\\nMemory hook: you always use the OPPOSITE heap from your goal, because the root is what you are willing to throw away." }
\`\`\`

### Algorithm in Action: Top 3 Largest from \`[7, 10, 4, 3, 20, 15]\`

Watch the min-heap maintain exactly k=3 candidates as it scans the array. The heap minimum is always the eviction threshold.

\`\`\`algoviz
{ "title": "Min-Heap of Size k=3 — Tracking Top 3 Largest", "type": "array", "data": [7, 10, 4, 3, 20, 15], "frames": [ { "highlight": [0], "label": "Push 7. Heap: [7]. Size 1 ≤ k=3 — no eviction.", "stats": { "heap": "[7]", "min": 7, "size": 1 } }, { "highlight": [1], "label": "Push 10. Heap: [7, 10]. Size 2 ≤ k — no eviction.", "stats": { "heap": "[7, 10]", "min": 7, "size": 2 } }, { "highlight": [2], "label": "Push 4. Heap: [4, 10, 7]. Size 3 = k. Heap is now full.", "stats": { "heap": "[4, 10, 7]", "min": 4, "size": 3 } }, { "highlight": [3], "label": "3 < min(4). Push 3 then pop 3 — heap unchanged. 3 can never be top-3.", "stats": { "heap": "[4, 10, 7]", "min": 4, "size": 3 } }, { "highlight": [4], "label": "20 > min(4). Push 20, evict 4. New threshold = 7.", "stats": { "heap": "[7, 10, 20]", "min": 7, "size": 3 } }, { "highlight": [5], "label": "15 > min(7). Push 15, evict 7. New threshold = 10.", "stats": { "heap": "[10, 15, 20]", "min": 10, "size": 3 } }, { "highlight": [0, 1, 2, 3, 4, 5], "label": "Scan complete. Heap contains exactly the top 3 largest: [10, 15, 20].", "stats": { "result": "[10, 15, 20]", "time": "O(n log k)" } } ], "speed": 900 }
\`\`\`

### Complexity Reference

| Problem | Heap Type | Time | Space |
|---|---|---|---|
| K Largest / K Smallest | Min / Max, size k | O(n log k) | O(k) |
| Kth Largest (single value) | Min-heap, size k | O(n log k) | O(k) |
| Top K Frequent Elements | Min-heap on counts | O(n log k) | O(n) |
| K Closest Points to Origin | Max-heap on dist² | O(n log k) | O(k) |
| Kth Smallest in Sorted Matrix | Min-heap on rows | O(k log n) | O(n) |

### Heap vs. Sort

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Sort Everything — O(n log n)", "code": "def top_k_sort(nums, k):\\n    nums.sort(reverse=True)  # sorts ALL n elements\\n    return nums[:k]\\n\\n# Simple, but sorts every element\\n# even when we only need k of them." }, "after": { "label": "Bounded Min-Heap — O(n log k)", "code": "import heapq\\n\\ndef top_k_heap(nums, k):\\n    heap = []\\n    for num in nums:           # O(n) iterations\\n        heapq.heappush(heap, num)\\n        if len(heap) > k:\\n            heapq.heappop(heap) # O(log k): heap stays size k\\n    return heap\\n\\n# When k << n the win is dramatic:\\n# k=10, n=1M → log k ≈ 3.3 vs log n ≈ 20" } }
\`\`\`

---

### Quiz

\`\`\`quiz
{ "title": "Top K Elements — Checkpoint Quiz", "questions": [ { "question": "What is the time complexity of finding the k largest elements in an array using a bounded heap?", "options": [ "O(n log n) — same as sorting the full array", "O(n log k) — n elements pushed, each heap op costs O(log k)", "O(k log n) — k pops from a heap of size n", "O(n) — linear scan with no comparisons" ], "answer": 1, "explanation": "Each of the n elements is pushed into, and possibly popped from, a heap maintained at size k. Both push and pop on a heap of size k cost O(log k), giving O(n log k) overall — strictly better than O(n log n) sorting whenever k < n." }, { "question": "To find the kth LARGEST element, which heap should you maintain during the scan?", "options": [ "Max-heap of size k — root holds the largest candidate", "Min-heap of size k — root is the kth largest threshold", "Max-heap of size n — sort everything then index k", "Min-heap of size n — smallest elements bubble up first" ], "answer": 1, "explanation": "A min-heap of size k holds the k largest elements seen so far. Its root — the minimum of those k — is exactly the kth largest. Any incoming number smaller than the root can never be in the top k, so it is immediately evicted." }, { "question": "In the K Closest Points to Origin problem, why is it valid to compare x² + y² instead of √(x² + y²)?", "options": [ "Square root is undefined when coordinates are negative", "The square-root function is monotonically increasing, so squared values preserve the same relative ordering", "We only need approximate distances, so exact values don't matter", "Heap operations do not support floating-point comparisons" ], "answer": 1, "explanation": "Because √ is strictly monotonically increasing, d1² < d2² if and only if d1 < d2. Comparing squared distances gives identical rankings. Skipping the sqrt avoids floating-point overhead with zero loss of correctness." }, { "question": "Which approach achieves O(n) time complexity for the Top K Frequent Elements problem?", "options": [ "Min-heap of size k on (count, element) pairs — O(n log k)", "Max-heap of all elements by frequency — O(n log n)", "Bucket sort on frequency values indexed 1 to n — O(n)", "Binary search on a sorted frequency list — O(n log n)" ], "answer": 2, "explanation": "Bucket sort creates n buckets indexed by frequency (1 to n). Placing each element takes O(n); scanning buckets from the highest frequency down and collecting k elements is also O(n). The min-heap approach is O(n log k) — better than naive sorting but not O(n)." }, { "question": "In the Kth Smallest Element in a Sorted Matrix problem, what is the initial heap size when using the row-based heap approach?", "options": [ "k — one slot per element we want to find", "n — one entry per row of the matrix", "n² — every element in the matrix", "log n — one entry per level of the implicit tree" ], "answer": 1, "explanation": "The standard approach seeds the min-heap with the smallest element from each of the n rows. This gives an initial heap of size n. Each pop-and-advance step costs O(log n), and we repeat k times for O(k log n) total — far better than heapifying the entire n² matrix." } ] }
\`\`\`

---

### Voice Summary

<!-- voice:checkpoint_summary -->

Your coach will ask you to explain:

1. **Why min-heap for k largest?** Walk through the eviction logic — what triggers a pop, and why the root is always the right candidate to remove.
2. **Kth Smallest in Sorted Matrix** — describe how you seed the heap and why you only need n entries, not n².
3. **Top K Frequent Elements** — explain the frequency map + heap combination and state its time and space complexity.
4. **When does O(n log k) beat O(n log n)?** Give a concrete example where the gap is large (e.g., k = 10, n = 1,000,000).

**You've mastered the Top K Elements pattern.** The bounded-heap insight — maintaining only what you need, evicting anything that can't qualify — is one of the most interview-transferable ideas in the entire DSA toolkit.`,
    },
  ],
};
