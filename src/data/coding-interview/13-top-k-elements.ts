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

## Why Not Just Sort?

Sorting costs O(n log n). A heap-based approach costs O(n log K). When K is much smaller than n, this is a significant improvement. For example, finding the top 10 elements in a million-element array: sorting does ~20 million comparisons, while the heap approach does ~200,000.

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

## Pattern Variations

- **K largest:** Use min-heap of size K.
- **K smallest:** Use max-heap of size K (negate values in Python).
- **K most frequent:** Count frequencies first, then use a heap on the counts.
- **K closest:** Use max-heap on distances, keeping K smallest distances.`,
    },
    {
      id: "top-k-numbers",
      slug: "top-k-numbers",
      title: "Top K Numbers",
      content: `# Top K Numbers

## Problem Statement

Given an unsorted array of numbers, find the **K largest numbers** in it. Return them in any order.

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

**Time Complexity:** O(n log K) — each of the n elements may trigger a heap push/pop of O(log K).
**Space Complexity:** O(K) for the heap.`,
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

Use a **max-heap of size K** (negate values for Python's min-heap):

1. Push the first K elements (negated) onto the heap.
2. For each remaining element, if it is **smaller** than the heap's root (the largest of the K smallest so far), replace the root.
3. After processing all elements, the root of the heap (negated back) is the Kth smallest.

Alternatively, use a min-heap of all elements and pop K times, but that uses O(n) space instead of O(K).

**Time Complexity:** O(n log K).
**Space Complexity:** O(K).`,
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

## Problem Statement

Given an array of 2D points, find the **K closest points** to the origin (0, 0). Use Euclidean distance. Return the points in any order.

## Examples

**Example 1:**
\`\`\`
Input: points = [[1,2],[1,3]], k = 1
Output: [[1,2]]
Explanation: Distance of [1,2] = sqrt(5), [1,3] = sqrt(10). Closest is [1,2].
\`\`\`

**Example 2:**
\`\`\`
Input: points = [[3,3],[5,-1],[-2,4]], k = 2
Output: [[3,3],[-2,4]]
Explanation: Distances: sqrt(18), sqrt(26), sqrt(20). Two closest: [3,3] and [-2,4].
\`\`\`

## Approach

Use a **max-heap of size K** based on distance:

1. For each point, compute squared distance (no need for sqrt since we only compare).
2. Push \`(-distance, point)\` onto the heap (negated for max-heap behavior).
3. If heap size exceeds K, pop the farthest point.
4. The remaining K points are the closest.

We use squared distance to avoid floating-point issues and unnecessary computation. The relative ordering is preserved since sqrt is monotonic.

**Time Complexity:** O(n log K).
**Space Complexity:** O(K).`,
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

1. **Count frequencies** using a hash map.
2. **Use a min-heap of size K** on the frequencies:
   - Push each unique number with its frequency.
   - If the heap exceeds size K, pop the element with the smallest frequency.
3. The heap contains the K most frequent elements.

This is a two-phase approach: first aggregate, then select. The heap selection phase is what makes it efficient compared to sorting the entire frequency table.

**Time Complexity:** O(n + d log K) where d is the number of distinct elements.
**Space Complexity:** O(d) for the frequency map + O(K) for the heap.`,
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

## Problem Statement

Given a string, sort its characters in **decreasing order of frequency**. If two characters have the same frequency, their order relative to each other does not matter.

## Examples

**Example 1:**
\`\`\`
Input: "programming"
Output: "ggrrmmpaoin" (g:2, r:2, m:2 come first, then singles)
\`\`\`

**Example 2:**
\`\`\`
Input: "aab"
Output: "aab"
\`\`\`

**Example 3:**
\`\`\`
Input: "tree"
Output: "eert" or "eetr"
\`\`\`

## Approach

1. **Count character frequencies** with a hash map or Counter.
2. **Build a max-heap** of \`(-frequency, character)\` tuples (negated for max-heap behavior).
3. **Pop from the heap** and append each character repeated by its frequency to build the result string.

This is essentially a "Top All Elements" variation — we want all characters sorted by frequency rather than selecting just K.

An alternative approach: sort the frequency items directly. But the heap approach generalizes well and is consistent with the pattern.

**Time Complexity:** O(n log d) where d is the number of distinct characters (at most 26 for lowercase English).
**Space Complexity:** O(d) for the frequency map and heap.`,
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
