import { Module } from "../types";

export const modifiedBinarySearchModule: Module = {
  id: "modified-binary-search",
  title: "Modified Binary Search",
  description: "Adapt the classic binary search algorithm to handle rotated arrays, unknown bounds, and find boundary elements.",
  lessons: [
    {
      id: "modified-binary-search-intro",
      slug: "modified-binary-search-intro",
      title: "Introduction to Modified Binary Search",
      content: `# Modified Binary Search

**Binary search** is one of the most fundamental algorithms in computer science. It searches a sorted collection in O(log n) time by repeatedly halving the search space.

## Classic Binary Search

\`\`\`python
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
\`\`\`

## Why "Modified"?

Many real problems present sorted data with a twist:
- The array might be **sorted but rotated** (e.g., \`[4,5,6,1,2,3]\`).
- You need to find a **boundary** (smallest element >= target) rather than an exact match.
- The array size is **unknown** (conceptually infinite).
- The sort order might be **ascending or descending**, and you don't know which.

Each variation requires adjusting how you compare and which half you discard, but the core idea remains: eliminate half the search space each step.

## Key Principles

1. **Identify the sorted half.** In rotated arrays, one half is always sorted. Compare \`arr[lo]\` with \`arr[mid]\` to determine which half.
2. **Adjust boundary conditions.** For "ceiling" or "floor" problems, track the best candidate and continue searching.
3. **Expand bounds dynamically.** For unbounded search, start with a small range and double it until the target is within range.

## When to Use

- Any problem involving search in a sorted (or mostly sorted) collection
- Finding insertion points, boundaries, or extremes
- Problems with O(log n) time requirements on sorted data`,
    },
    {
      id: "modified-bs-order-agnostic",
      slug: "modified-bs-order-agnostic",
      title: "Order-agnostic Binary Search",
      content: `# Order-agnostic Binary Search

## Problem Statement

Given a sorted array that could be in **ascending or descending** order, find the index of a given target. Return \`-1\` if the target is not found.

## Examples

**Example 1:**
\`\`\`
Input: arr = [1, 3, 8, 10, 15], target = 10
Output: 3
\`\`\`

**Example 2:**
\`\`\`
Input: arr = [15, 10, 8, 3, 1], target = 10
Output: 1
\`\`\`

**Example 3:**
\`\`\`
Input: arr = [4, 6, 10], target = 5
Output: -1
\`\`\`

## Approach

1. Determine the sort order by comparing \`arr[0]\` with \`arr[-1]\`:
   - If \`arr[0] < arr[-1]\`, it is ascending.
   - Otherwise, it is descending.
2. Perform standard binary search, but flip the comparison direction based on the sort order.

In ascending order, if \`arr[mid] < target\`, move right. In descending order, if \`arr[mid] < target\`, move left. This single check handles both cases.

**Time Complexity:** O(log n).
**Space Complexity:** O(1).`,
      starterCode: `def order_agnostic_binary_search(arr, target):
    # TODO: Search for target in a sorted array (ascending or descending)
    return -1

# Test cases
print(order_agnostic_binary_search([1, 3, 8, 10, 15], 10))
# Expected: 3

print(order_agnostic_binary_search([15, 10, 8, 3, 1], 10))
# Expected: 1

print(order_agnostic_binary_search([4, 6, 10], 5))
# Expected: -1
`,
      solutionCode: `def order_agnostic_binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    is_ascending = arr[lo] < arr[hi]

    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] == target:
            return mid

        if is_ascending:
            if arr[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        else:
            if arr[mid] > target:
                lo = mid + 1
            else:
                hi = mid - 1

    return -1

# Test cases
print(order_agnostic_binary_search([1, 3, 8, 10, 15], 10))
# Expected: 3

print(order_agnostic_binary_search([15, 10, 8, 3, 1], 10))
# Expected: 1

print(order_agnostic_binary_search([4, 6, 10], 5))
# Expected: -1
`,
    },
    {
      id: "modified-bs-ceiling",
      slug: "modified-bs-ceiling",
      title: "Ceiling of a Number",
      content: `# Ceiling of a Number

## Problem Statement

Given a sorted array in ascending order and a target number, find the index of the **smallest element that is greater than or equal to** the target. If no such element exists, return \`-1\`.

## Examples

**Example 1:**
\`\`\`
Input: arr = [1, 3, 8, 10, 15], target = 4
Output: 2 (arr[2] = 8 is the ceiling of 4)
\`\`\`

**Example 2:**
\`\`\`
Input: arr = [1, 3, 8, 10, 15], target = 8
Output: 2 (exact match)
\`\`\`

**Example 3:**
\`\`\`
Input: arr = [1, 3, 8, 10, 15], target = 16
Output: -1 (no element >= 16)
\`\`\`

## Approach

Modify binary search to track the best candidate:

1. Initialize \`lo = 0\`, \`hi = len(arr) - 1\`.
2. At each step, compute \`mid\`:
   - If \`arr[mid] == target\`, return \`mid\`.
   - If \`arr[mid] < target\`, the ceiling must be to the right: \`lo = mid + 1\`.
   - If \`arr[mid] > target\`, this could be the ceiling but a smaller one might exist to the left: \`hi = mid - 1\`.
3. When the loop ends, \`lo\` points to the ceiling index if \`lo < len(arr)\`.

The key insight is that when the loop exits, \`lo\` is the insertion point — the index where the target would be inserted to keep the array sorted. This is exactly the ceiling.

**Time Complexity:** O(log n).
**Space Complexity:** O(1).`,
      starterCode: `def search_ceiling(arr, target):
    # TODO: Find the index of the smallest element >= target
    return -1

# Test cases
print(search_ceiling([1, 3, 8, 10, 15], 4))
# Expected: 2

print(search_ceiling([1, 3, 8, 10, 15], 8))
# Expected: 2

print(search_ceiling([1, 3, 8, 10, 15], 16))
# Expected: -1
`,
      solutionCode: `def search_ceiling(arr, target):
    if target > arr[-1]:
        return -1

    lo, hi = 0, len(arr) - 1

    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1

    # lo is now the index of the smallest element >= target
    return lo

# Test cases
print(search_ceiling([1, 3, 8, 10, 15], 4))
# Expected: 2

print(search_ceiling([1, 3, 8, 10, 15], 8))
# Expected: 2

print(search_ceiling([1, 3, 8, 10, 15], 16))
# Expected: -1
`,
    },
    {
      id: "modified-bs-rotated-search",
      slug: "modified-bs-rotated-search",
      title: "Search in Rotated Sorted Array",
      content: `# Search in Rotated Sorted Array

## Problem Statement

Given a sorted array that has been rotated at some unknown pivot, find the index of a given target. Return \`-1\` if not found. The array has no duplicates.

A rotated array \`[4,5,6,7,0,1,2]\` was originally \`[0,1,2,4,5,6,7]\` rotated at index 4.

## Examples

**Example 1:**
\`\`\`
Input: arr = [4,5,6,7,0,1,2], target = 0
Output: 4
\`\`\`

**Example 2:**
\`\`\`
Input: arr = [10,15,1,3,8], target = 15
Output: 1
\`\`\`

**Example 3:**
\`\`\`
Input: arr = [4,5,6,7,0,1,2], target = 3
Output: -1
\`\`\`

## Approach

In a rotated sorted array, at least one half (left or right of mid) is always properly sorted. Use this to decide which half to search:

1. Compute \`mid\`. If \`arr[mid] == target\`, return \`mid\`.
2. Check if the **left half** is sorted (\`arr[lo] <= arr[mid]\`):
   - If target is within \`[arr[lo], arr[mid])\`, search left.
   - Otherwise, search right.
3. Else the **right half** must be sorted:
   - If target is within \`(arr[mid], arr[hi]]\`, search right.
   - Otherwise, search left.

The critical insight is that you can always determine which half is sorted by comparing endpoints, and then check if the target falls within that sorted range.

**Time Complexity:** O(log n).
**Space Complexity:** O(1).`,
      starterCode: `def search_rotated_array(arr, target):
    # TODO: Find target in a rotated sorted array
    return -1

# Test cases
print(search_rotated_array([4, 5, 6, 7, 0, 1, 2], 0))
# Expected: 4

print(search_rotated_array([10, 15, 1, 3, 8], 15))
# Expected: 1

print(search_rotated_array([4, 5, 6, 7, 0, 1, 2], 3))
# Expected: -1
`,
      solutionCode: `def search_rotated_array(arr, target):
    lo, hi = 0, len(arr) - 1

    while lo <= hi:
        mid = lo + (hi - lo) // 2

        if arr[mid] == target:
            return mid

        # Left half is sorted
        if arr[lo] <= arr[mid]:
            if arr[lo] <= target < arr[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        # Right half is sorted
        else:
            if arr[mid] < target <= arr[hi]:
                lo = mid + 1
            else:
                hi = mid - 1

    return -1

# Test cases
print(search_rotated_array([4, 5, 6, 7, 0, 1, 2], 0))
# Expected: 4

print(search_rotated_array([10, 15, 1, 3, 8], 15))
# Expected: 1

print(search_rotated_array([4, 5, 6, 7, 0, 1, 2], 3))
# Expected: -1
`,
    },
    {
      id: "modified-bs-rotated-minimum",
      slug: "modified-bs-rotated-minimum",
      title: "Minimum in Rotated Sorted Array",
      content: `# Minimum in Rotated Sorted Array

## Problem Statement

Given a sorted array of distinct elements that has been rotated, find the **minimum element**. The array was originally sorted in ascending order.

## Examples

**Example 1:**
\`\`\`
Input: [4, 5, 6, 1, 2, 3]
Output: 1
\`\`\`

**Example 2:**
\`\`\`
Input: [3, 1, 2]
Output: 1
\`\`\`

**Example 3:**
\`\`\`
Input: [1, 2, 3, 4, 5]
Output: 1 (not rotated)
\`\`\`

## Approach

The minimum element is the rotation pivot — the point where the ascending order breaks. Use binary search to find it:

1. If \`arr[lo] < arr[hi]\`, the array is not rotated in this range — \`arr[lo]\` is the minimum.
2. Compute \`mid\`:
   - If \`arr[mid] > arr[hi]\`, the minimum is in the right half (the "break" is to the right): \`lo = mid + 1\`.
   - Otherwise, the minimum is at \`mid\` or to the left: \`hi = mid\`.
3. When \`lo == hi\`, you have found the minimum.

Note: we set \`hi = mid\` (not \`mid - 1\`) because \`arr[mid]\` itself could be the minimum when \`arr[mid] <= arr[hi]\`.

**Time Complexity:** O(log n).
**Space Complexity:** O(1).`,
      starterCode: `def find_min_rotated(arr):
    # TODO: Find the minimum element in a rotated sorted array
    return -1

# Test cases
print(find_min_rotated([4, 5, 6, 1, 2, 3]))
# Expected: 1

print(find_min_rotated([3, 1, 2]))
# Expected: 1

print(find_min_rotated([1, 2, 3, 4, 5]))
# Expected: 1
`,
      solutionCode: `def find_min_rotated(arr):
    lo, hi = 0, len(arr) - 1

    while lo < hi:
        mid = lo + (hi - lo) // 2

        if arr[mid] > arr[hi]:
            # Minimum is in the right half
            lo = mid + 1
        else:
            # Minimum is at mid or in the left half
            hi = mid

    return arr[lo]

# Test cases
print(find_min_rotated([4, 5, 6, 1, 2, 3]))
# Expected: 1

print(find_min_rotated([3, 1, 2]))
# Expected: 1

print(find_min_rotated([1, 2, 3, 4, 5]))
# Expected: 1
`,
    },
    {
      id: "modified-bs-infinite-array",
      slug: "modified-bs-infinite-array",
      title: "Search in Sorted Infinite Array",
      content: `# Search in Sorted Infinite Array

## Problem Statement

Given a sorted array of unknown (conceptually infinite) size, find the index of a given target. You cannot use \`len()\` on the array. Instead, accessing an index beyond the array's bounds returns a very large sentinel value (e.g., \`float('inf')\`).

We simulate this with a large sorted array and a wrapper that returns infinity for out-of-bounds access.

## Examples

**Example 1:**
\`\`\`
Input: arr = [1, 3, 8, 10, 15, ...], target = 15
Output: 4
\`\`\`

**Example 2:**
\`\`\`
Input: arr = [2, 5, 7, 9, 10, 12, ...], target = 7
Output: 2
\`\`\`

## Approach

Since you don't know the bounds, first **find a range** where the target could exist, then apply binary search within that range.

1. Start with bounds \`lo = 0\`, \`hi = 1\`.
2. While \`arr[hi] < target\`, double the range: \`lo = hi\`, \`hi = hi * 2\`.
3. Once \`arr[hi] >= target\`, apply standard binary search between \`lo\` and \`hi\`.

The doubling step finds the correct range in O(log p) where p is the target's index. The subsequent binary search also takes O(log p). Total: O(log p).

**Time Complexity:** O(log p) where p is the position of the target.
**Space Complexity:** O(1).`,
      starterCode: `def search_infinite_array(reader, target):
    # reader.get(index) returns the element at index
    # or float('inf') if index is out of bounds
    # TODO: Find the target in the infinite sorted array
    return -1

class ArrayReader:
    def __init__(self, arr):
        self.arr = arr
    def get(self, index):
        if index >= len(self.arr):
            return float('inf')
        return self.arr[index]

# Test cases
reader1 = ArrayReader([1, 3, 8, 10, 15, 20, 35, 50, 72, 100])
print(search_infinite_array(reader1, 15))
# Expected: 4

reader2 = ArrayReader([2, 5, 7, 9, 10, 12, 18, 25])
print(search_infinite_array(reader2, 7))
# Expected: 2

print(search_infinite_array(reader2, 99))
# Expected: -1
`,
      solutionCode: `def search_infinite_array(reader, target):
    # Step 1: Find bounds by doubling
    lo, hi = 0, 1
    while reader.get(hi) < target:
        lo = hi
        hi *= 2

    # Step 2: Binary search within [lo, hi]
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        val = reader.get(mid)
        if val == target:
            return mid
        elif val < target:
            lo = mid + 1
        else:
            hi = mid - 1

    return -1

class ArrayReader:
    def __init__(self, arr):
        self.arr = arr
    def get(self, index):
        if index >= len(self.arr):
            return float('inf')
        return self.arr[index]

# Test cases
reader1 = ArrayReader([1, 3, 8, 10, 15, 20, 35, 50, 72, 100])
print(search_infinite_array(reader1, 15))
# Expected: 4

reader2 = ArrayReader([2, 5, 7, 9, 10, 12, 18, 25])
print(search_infinite_array(reader2, 7))
# Expected: 2

print(search_infinite_array(reader2, 99))
# Expected: -1
`,
    },
  ],
};
