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

## Core Idea

Maintain a **min-heap** containing one element from each list (along with which list it came from and its index within that list):

1. Initialize the heap with the first element of each list.
2. Pop the smallest element from the heap — this is the next element in the merged output.
3. If the popped element's list has more elements, push the next element from that list onto the heap.
4. Repeat until the heap is empty.

## Why a Heap?

With K lists, the naive approach of scanning all K heads to find the minimum takes O(K) per element, giving O(N*K) total. A min-heap reduces the "find minimum" step to O(log K), giving O(N log K) total — a major improvement when K is large.

## Python Implementation Sketch

\`\`\`python
import heapq

def merge_k_sorted(lists):
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
\`\`\`

## When to Use

- Merging K sorted arrays, linked lists, or streams
- Finding the Kth smallest across multiple sorted sources
- Problems involving sorted matrices (row-sorted or fully sorted)
- Finding ranges that span multiple sorted lists`,
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

## Approach

Use a min-heap to always extract the globally smallest element:

1. Push the first element of each array onto the heap as a tuple \`(value, array_index, element_index)\`.
2. Pop the smallest element and append it to the result.
3. If the array from which that element came has a next element, push it onto the heap.
4. Continue until the heap is empty.

The heap always has at most K elements, so each push/pop is O(log K). With N total elements, the overall complexity is O(N log K).

**Time Complexity:** O(N log K) where N is total number of elements.
**Space Complexity:** O(K) for the heap + O(N) for the result.`,
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

Given M sorted lists, find the **Kth smallest** number among all elements across all lists.

## Examples

**Example 1:**
\`\`\`
Input: lists = [[2, 6, 8], [3, 6, 7], [1, 3, 4]], k = 5
Output: 4
Explanation: Merged sorted = [1, 2, 3, 3, 4, 6, 6, 7, 8], 5th = 4.
\`\`\`

**Example 2:**
\`\`\`
Input: lists = [[1, 5, 9], [2, 4, 8]], k = 3
Output: 4
Explanation: Merged = [1, 2, 4, 5, 8, 9], 3rd = 4.
\`\`\`

## Approach

Use the K-way merge technique but stop after popping K elements:

1. Initialize the min-heap with the first element from each list.
2. Pop from the heap K times. Each pop gives the next smallest element overall.
3. The Kth popped element is the answer.

There is no need to merge the entire set of lists — early termination after K pops saves work when K is small relative to N.

**Time Complexity:** O(K log M) — K heap pops, each O(log M).
**Space Complexity:** O(M) for the heap.`,
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

Given an N x N matrix where each **row** and each **column** is sorted in ascending order, find the **Kth smallest** element.

## Examples

**Example 1:**
\`\`\`
Input: matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8
Output: 13
Explanation: Sorted elements: [1,5,9,10,11,12,13,13,15], 8th = 13.
\`\`\`

**Example 2:**
\`\`\`
Input: matrix = [[1,3],[2,4]], k = 3
Output: 3
Explanation: Sorted: [1,2,3,4], 3rd = 3.
\`\`\`

## Approach

Treat each row as a sorted list and apply K-way merge:

1. Push the first element of each row onto a min-heap: \`(value, row, col)\`.
2. Pop from the heap K times. After each pop, if the same row has a next column, push that element.
3. The Kth pop is the answer.

Since columns are also sorted, an alternative binary search approach exists, but the heap approach is more intuitive and directly applies the K-way merge pattern.

**Time Complexity:** O(K log N) — at most K pops from a heap of size N.
**Space Complexity:** O(N) for the heap.`,
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

## Problem Statement

Given M sorted lists, find the **smallest range** [a, b] such that at least one number from each list falls within the range. If multiple ranges have the same size, return the one with the smaller starting value.

## Examples

**Example 1:**
\`\`\`
Input: [[1,5,8],[4,12],[7,8,10]]
Output: [4, 7]
Explanation: Range [4,7] includes 5 from list 1, 4 from list 2, 7 from list 3.
\`\`\`

**Example 2:**
\`\`\`
Input: [[1,9],[4,12],[7,10,16]]
Output: [4, 7]
\`\`\`

## Approach

Use a min-heap with simultaneous tracking of the current maximum:

1. Push the first element of each list into the min-heap. Track the current maximum among these elements.
2. The range is \`[heap_min, current_max]\`. Record it if it is the smallest seen.
3. Pop the minimum element. Push the next element from that same list. Update the current maximum if the new element is larger.
4. Repeat until one list is exhausted (once any list runs out, you can no longer cover all lists).

The key insight: the min-heap gives you the smallest current element, and tracking the maximum separately gives you the range. Advancing the minimum element is the only way to potentially shrink the range.

**Time Complexity:** O(N log M) where N is total elements and M is number of lists.
**Space Complexity:** O(M) for the heap.`,
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

## Approach

Since both arrays are sorted in descending order, the largest sum is \`nums1[0] + nums2[0]\`. The next largest must involve either \`nums1[1] + nums2[0]\` or \`nums1[0] + nums2[1]\`.

Use a **max-heap** (negate sums for Python):

1. Push \`(-(nums1[0]+nums2[0]), 0, 0)\` to start.
2. Pop the largest sum pair. Add the pair to results.
3. Push the two neighbors: \`(i+1, j)\` and \`(i, j+1)\` if not already visited.
4. Use a set to track visited index pairs to avoid duplicates.
5. Repeat K times.

**Time Complexity:** O(K log K) — at most K elements in the heap.
**Space Complexity:** O(K) for the heap and visited set.`,
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
