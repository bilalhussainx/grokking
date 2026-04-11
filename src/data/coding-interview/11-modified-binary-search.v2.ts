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

Binary search is one of the most fundamental algorithms in computer science. It searches a sorted collection in O(log n) time by repeatedly halving the search space.

\`\`\`concept
{
  "title": "Binary Search Core Insight",
  "variant": "mental-model",
  "content": "Think of binary search as a game of 'hot or cold' where you always get perfect feedback. Each comparison tells you exactly which half of the remaining space to eliminate, guaranteeing you discard 50% of candidates every iteration."
}
\`\`\`

## Classic Binary Search

\`\`\`playground
{
  "title": "Classic Binary Search Implementation",
  "language": "python",
  "code": "def binary_search(arr, target):\\n    lo, hi = 0, len(arr) - 1\\n    while lo <= hi:\\n        mid = lo + (hi - lo) // 2\\n        if arr[mid] == target:\\n            return mid\\n        elif arr[mid] < target:\\n            lo = mid + 1\\n        else:\\n            hi = mid - 1\\n    return -1\\n\\n# Test it out\\nsorted_array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]\\nprint(f\\"Searching for 7 in {sorted_array}\\")\\nprint(f\\"Result: index {binary_search(sorted_array, 7)}\\")\\nprint(f\\"Searching for 6 (not present)\\")\\nprint(f\\"Result: {binary_search(sorted_array, 6)}\\")",
  "runnable": true
}
\`\`\`

## Why "Modified"?

Many real problems present sorted data with a twist:
- The array might be **sorted but rotated** (e.g., \`[4,5,6,1,2,3]\`).
- You need to find a **boundary** (smallest element >= target) rather than an exact match.
- The array size is **unknown** (conceptually infinite).
- The sort order might be **ascending or descending**, and you don't know which.

Each variation requires adjusting how you compare and which half you discard, but the core idea remains: eliminate half the search space each step.

\`\`\`algoviz
{
  "title": "Rotated Array Search Visualization",
  "type": "array",
  "data": [4, 5, 6, 7, 0, 1, 2, 3],
  "frames": [
    {"highlight": [0, 7], "label": "Initial search: lo=0, hi=7, mid=3 (value=7)", "stats": {"lo": 0, "hi": 7, "mid": 3}},
    {"highlight": [4, 7], "label": "Right half is unsorted, must search left", "stats": {"lo": 4, "hi": 7, "mid": 5}},
    {"highlight": [4, 5], "label": "Found target 0 in left sorted portion", "stats": {"lo": 4, "hi": 5, "mid": 4}}
  ],
  "speed": 1000
}
\`\`\`

## Key Principles

1. **Identify the sorted half.** In rotated arrays, one half is always sorted. Compare \`arr[lo]\` with \`arr[mid]\` to determine which half.
2. **Adjust boundary conditions.** For "ceiling" or "floor" problems, track the best candidate and continue searching.
3. **Expand bounds dynamically.** For unbounded search, start with a small range and double it until the target is within range.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naive Approach",
    "code": "# Don't do this - O(n) time\\ndef find_in_rotated(arr, target):\\n    for i, val in enumerate(arr):\\n        if val == target:\\n            return i\\n    return -1"
  },
  "after": {
    "label": "Modified Binary Search",
    "code": "# O(log n) time\\ndef find_in_rotated(arr, target):\\n    lo, hi = 0, len(arr) - 1\\n    while lo <= hi:\\n        mid = lo + (hi - lo) // 2\\n        if arr[mid] == target:\\n            return mid\\n        \\n        # Left half is sorted\\n        if arr[lo] <= arr[mid]:\\n            if arr[lo] <= target < arr[mid]:\\n                hi = mid - 1\\n            else:\\n                lo = mid + 1\\n        # Right half is sorted\\n        else:\\n            if arr[mid] < target <= arr[hi]:\\n                lo = mid + 1\\n            else:\\n                hi = mid - 1\\n    return -1"
  }
}
\`\`\`

## When to Use

- Any problem involving search in a sorted (or mostly sorted) collection
- Finding insertion points, boundaries, or extremes
- Problems with O(log n) time requirements on sorted data

\`\`\`quiz
{
  "title": "Modified Binary Search Fundamentals",
  "questions": [
    {
      "question": "In a rotated sorted array [7, 8, 9, 1, 2, 3, 4, 5, 6], which half is guaranteed to be sorted when mid = 4 (value = 2)?",
      "options": ["Left half [7, 8, 9, 1]", "Right half [3, 4, 5, 6]", "Neither half is sorted", "Both halves are sorted"],
      "answer": 1,
      "explanation": "Since arr[lo] = 7 > arr[mid] = 2, the left half is not sorted. In a rotated array, if one half isn't sorted, the other must be. The right half [3, 4, 5, 6] is sorted."
    },
    {
      "question": "What is the time complexity of modified binary search on a rotated array?",
      "options": ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
      "answer": 1,
      "explanation": "Modified binary search maintains the O(log n) time complexity of classic binary search by still eliminating half the search space in each iteration, just with different comparison logic."
    },
    {
      "question": "When searching for the 'ceiling' of a target (smallest element ≥ target), what should you do when arr[mid] < target?",
      "options": ["Update result and search left", "Update result and search right", "Don't update result, search left", "Don't update result, search right"],
      "answer": 3,
      "explanation": "When arr[mid] < target, mid is not a valid ceiling candidate. Since we need something ≥ target, we must search the right half for a larger value."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Modified binary search maintains O(log n) time complexity while handling variations like rotation, unknown bounds, and boundary searches",
    "The key insight is identifying which half of the array is sorted to make the correct elimination decision",
    "Always track the best candidate found so far when searching for boundaries rather than exact matches",
    "For unbounded arrays, exponentially expand the search range until the target is bracketed, then apply binary search"
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "The Order-Agnostic Insight",
  "variant": "mental-model",
  "content": "Binary search doesn't care about absolute order—it only needs *consistent* order. By checking the first and last elements once, we can flip our comparison logic to match the array's direction. This single check turns a 'direction-specific' algorithm into a universal one."
}
\`\`\`

1. Determine the sort order by comparing \`arr[0]\` with \`arr[-1]\`:
   - If \`arr[0] < arr[-1]\`, it is ascending.
   - Otherwise, it is descending.
2. Perform standard binary search, but flip the comparison direction based on the sort order.

In ascending order, if \`arr[mid] < target\`, move right. In descending order, if \`arr[mid] < target\`, move left. This single check handles both cases.

\`\`\`algoviz
{
  "title": "Visual Walk-through on [15, 10, 8, 3, 1]",
  "type": "array",
  "data": [15, 10, 8, 3, 1],
  "frames": [
    { "highlight": [0, 4], "label": "Order check: 15 > 1 → descending", "stats": {"l":0,"r":4,"target":10} },
    { "highlight": [2], "label": "mid = 2, arr[2] = 8 < 10 → search left half", "stats": {"l":0,"r":4,"mid":2} },
    { "highlight": [0, 2], "label": "New range [0, 2]", "stats": {"l":0,"r":2} },
    { "highlight": [1], "label": "mid = 1, arr[1] = 10 == target → found!", "stats": {"l":0,"r":2,"mid":1} }
  ],
  "speed": 1000
}
\`\`\`

**Time Complexity:** O(log n)  
**Space Complexity:** O(1)

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Two Separate Searches",
    "code": "def asc_bin_search(arr, target):\\n    ...  # classic ascending logic\\n\\ndef desc_bin_search(arr, target):\\n    ...  # classic descending logic\\n\\nif arr[0] < arr[-1]:\\n    return asc_bin_search(arr, target)\\nelse:\\n    return desc_bin_search(arr, target)"
  },
  "after": {
    "label": "Order-Agnostic Single Loop",
    "code": "def order_agnostic_search(arr, target):\\n    asc = arr[0] < arr[-1]\\n    l, r = 0, len(arr) - 1\\n    while l <= r:\\n        mid = (l + r) // 2\\n        if arr[mid] == target:\\n            return mid\\n        if asc and arr[mid] < target or not asc and arr[mid] > target:\\n            l = mid + 1\\n        else:\\n            r = mid - 1\\n    return -1"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "After determining the array is in descending order, which half do we discard if \`arr[mid] < target\`?",
      "options": ["Left half", "Right half", "Either half", "Cannot determine"],
      "answer": 0,
      "explanation": "In descending order, smaller values are on the right. If \`arr[mid] < target\`, the target must be to the left of mid."
    },
    {
      "question": "What is the extra cost of making binary search order-agnostic?",
      "options": ["O(log n)", "O(1)", "O(n)", "O(n log n)"],
      "answer": 1,
      "explanation": "We pay only a single comparison to decide order—constant time."
    },
    {
      "question": "Which comparison pair is safest for order detection when the array might have duplicate endpoints?",
      "options": ["arr[0] vs arr[1]", "arr[0] vs arr[-1]", "arr[mid] vs target", "arr[l] vs arr[r]"],
      "answer": 1,
      "explanation": "Endpoints still reveal global order even when interior duplicates exist."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Try It Yourself",
  "language": "python",
  "code": "def order_agnostic_search(arr, target):\\n    \\"\\"\\"Return index of target in ascending OR descending array.\\"\\"\\"\\n    # 1. Detect order\\n    asc = arr[0] < arr[-1]\\n    l, r = 0, len(arr) - 1\\n    while l <= r:\\n        mid = (l + r) // 2\\n        if arr[mid] == target:\\n            return mid\\n        # 2. Choose direction based on order\\n        if asc and arr[mid] < target or not asc and arr[mid] > target:\\n            l = mid + 1\\n        else:\\n            r = mid - 1\\n    return -1\\n\\n# ---- test ----\\nprint(order_agnostic_search([1, 3, 8, 10, 15], 10))  # 3\\nprint(order_agnostic_search([15, 10, 8, 3, 1], 10))  # 1\\nprint(order_agnostic_search([4, 6, 10], 5))          # -1",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "A single O(1) comparison adapts binary search to either ascending or descending data.",
    "The rest of the algorithm remains identical—only the comparison direction flips.",
    "This technique keeps the optimal O(log n) time and O(1) space of classic binary search."
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "What is a Ceiling?",
  "variant": "mental-model",
  "content": "Think of the ceiling as the \\"just-enough\\" element — the smallest value in the array that can \\"cover\\" your target. If the target is already present, that exact element is its own ceiling. If not, you want the next bigger neighbor. Visually, imagine placing the target on the number line; the ceiling is the first array element you meet when moving right."
}
\`\`\`

## Examples

- **Example 1:**  
  Input: \`arr = [1, 3, 8, 10, 15]\`, \`target = 4\`  
  Output: \`2\` (because \`arr[2] = 8\` is the smallest value ≥ 4)

- **Example 2:**  
  Input: \`arr = [1, 3, 8, 10, 15]\`, \`target = 8\`  
  Output: \`2\` (exact match)

- **Example 3:**  
  Input: \`arr = [1, 3, 8, 10, 15]\`, \`target = 16\`  
  Output: \`-1\` (no element ≥ 16)

## Approach

We tweak ordinary binary search to **remember the best candidate** seen so far.

1. Initialize \`lo = 0\`, \`hi = n - 1\`, and \`ceiling_idx = -1\`.
2. While \`lo ≤ hi\`:
   - Compute \`mid = lo + (hi - lo) // 2\`.
   - If \`arr[mid] == target\`:  
     ✅ Exact hit; return \`mid\` immediately.
   - Else if \`arr[mid] < target\`:  
     Discard left half: \`lo = mid + 1\`.
   - Else (\`arr[mid] > target\`):  
     This element is a **potential ceiling**; record it: \`ceiling_idx = mid\`.  
     Then shrink right half: \`hi = mid - 1\`.
3. When the loop ends, \`ceiling_idx\` holds the answer (still \`-1\` if nothing qualified).

\`\`\`algoviz
{
  "title": "Finding Ceiling of 4 in [1,3,8,10,15]",
  "type": "array",
  "data": [1, 3, 8, 10, 15],
  "frames": [
    { "highlight": [0,1,2,3,4], "label": "start: lo=0, hi=4, ceiling_idx=-1" },
    { "highlight": [2], "label": "mid=2, arr[2]=8 > 4 → candidate! ceiling_idx=2, hi=1" },
    { "highlight": [0,1], "label": "lo=0, hi=1, mid=0, arr[0]=1 < 4 → lo=1" },
    { "highlight": [1], "label": "lo=1, hi=1, mid=1, arr[1]=3 < 4 → lo=2" },
    { "highlight": [2], "label": "loop ends, ceiling_idx=2 is answer", "stats": {"ceiling_idx": 2} }
  ],
  "speed": 900
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Insertion-Point Insight",
  "content": "When the loop terminates, \`lo\` equals the insertion point — the index where Python’s \`bisect_left\` would place the target. That index is exactly the ceiling position **if** it is within bounds. Our algorithm above explicitly tracks \`ceiling_idx\`, but an alternative one-liner is simply \`return lo if lo < n else -1\` after the loop."
}
\`\`\`

## Edge Cases to Remember

- All elements smaller than target → return \`-1\`.
- All elements larger than target → first element is ceiling.
- Empty array → return \`-1\`.

\`\`\`quiz
{
  "title": "Quick Check",
  "questions": [
    {
      "question": "For \`arr = [2, 4, 6, 8]\`, what is the ceiling index of \`5\`?",
      "options": ["1", "2", "3", "-1"],
      "answer": 1,
      "explanation": "arr[2]=6 is the smallest element ≥ 5, so index 2 is returned."
    },
    {
      "question": "If the target is larger than every element, what should the algorithm return?",
      "options": ["last index", "-1", "0", "undefined"],
      "answer": 1,
      "explanation": "No element satisfies ≥ target, so we return -1."
    },
    {
      "question": "What is the time complexity of this algorithm?",
      "options": ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      "answer": 1,
      "explanation": "Binary search halves the search space each step → O(log n)."
    }
  ]
}
\`\`\`

## Complexity

- **Time:** O(log n) — binary search.  
- **Space:** O(1) — only a few variables.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Ceiling search is classic binary search plus a candidate tracker.",
    "When you find an element ≥ target, save it and keep searching left for a smaller candidate.",
    "Loop exit gives the insertion point; validate bounds before using it.",
    "Same pattern extends to floor, closest pair, and other boundary variants."
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "What is a Rotated Array?",
  "variant": "mental-model",
  "content": "Imagine taking a sorted deck of cards, cutting it at some random point, and swapping the two halves. The result is still partially ordered - you just need to find where the 'cut' happened. This is exactly what a rotated sorted array is: a sorted array where a prefix has been moved to the end."
}
\`\`\`

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

\`\`\`algoviz
{
  "title": "Binary Search on Rotated Array",
  "type": "array",
  "data": [4, 5, 6, 7, 0, 1, 2],
  "frames": [
    {"highlight": [0, 6], "label": "Initial: lo=0, hi=6, mid=3", "stats": {"lo": 0, "hi": 6, "mid": 3}},
    {"highlight": [0, 3], "label": "Left half sorted [4,7], target 0 not in range", "stats": {"lo": 4, "hi": 6}},
    {"highlight": [4, 6], "label": "Search right half: lo=4, hi=6, mid=5", "stats": {"lo": 4, "hi": 6, "mid": 5}},
    {"highlight": [4, 5], "label": "Right half sorted [1,2], target 0 not in range", "stats": {"lo": 4, "hi": 4}},
    {"highlight": [4], "label": "Found target 0 at index 4!", "stats": {"result": 4}}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`trace
{
  "title": "Step-by-Step Execution",
  "language": "python",
  "code": "def search_rotated(arr, target):\\n    lo, hi = 0, len(arr) - 1\\n    \\n    while lo <= hi:\\n        mid = (lo + hi) // 2\\n        \\n        if arr[mid] == target:\\n            return mid\\n        \\n        # Left half is sorted\\n        if arr[lo] <= arr[mid]:\\n            if arr[lo] <= target < arr[mid]:\\n                hi = mid - 1  # Target in left half\\n            else:\\n                lo = mid + 1  # Target in right half\\n        # Right half is sorted\\n        else:\\n            if arr[mid] < target <= arr[hi]:\\n                lo = mid + 1  # Target in right half\\n            else:\\n                hi = mid - 1  # Target in left half\\n    \\n    return -1\\n\\n# Test with example\\narr = [4, 5, 6, 7, 0, 1, 2]\\ntarget = 0\\nresult = search_rotated(arr, target)\\nprint(f\\"Target {target} found at index: {result}\\")",
  "frames": [
    {"line": 1, "vars": {"arr": "[4,5,6,7,0,1,2]", "target": 0}, "note": "Initialize search boundaries", "stdout": ""},
    {"line": 4, "vars": {"lo": 0, "hi": 6, "mid": 3}, "note": "First iteration: mid=3, arr[3]=7", "stdout": ""},
    {"line": 7, "vars": {"lo": 0, "hi": 6, "mid": 3}, "note": "arr[3] != 0, continue", "stdout": ""},
    {"line": 10, "vars": {"lo": 0, "hi": 6, "mid": 3}, "note": "Left half sorted: 4 <= 7", "stdout": ""},
    {"line": 11, "vars": {"lo": 0, "hi": 6, "mid": 3}, "note": "Target 0 not in [4,7), search right", "stdout": ""},
    {"line": 12, "vars": {"lo": 4, "hi": 6}, "note": "Update lo to mid+1", "stdout": ""},
    {"line": 4, "vars": {"lo": 4, "hi": 6, "mid": 5}, "note": "Second iteration: mid=5, arr[5]=1", "stdout": ""},
    {"line": 18, "vars": {"lo": 4, "hi": 6, "mid": 5}, "note": "Right half sorted: 1 <= 2", "stdout": ""},
    {"line": 19, "vars": {"lo": 4, "hi": 6, "mid": 5}, "note": "Target 0 not in (1,2], search left", "stdout": ""},
    {"line": 21, "vars": {"lo": 4, "hi": 4}, "note": "Update hi to mid-1", "stdout": ""},
    {"line": 4, "vars": {"lo": 4, "hi": 4, "mid": 4}, "note": "Third iteration: mid=4, arr[4]=0", "stdout": ""},
    {"line": 6, "vars": {"result": 4}, "note": "Found target! Return index 4", "stdout": "Target 0 found at index: 4"}
  ],
  "speed": 800
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "In the array [10,15,1,3,8], which half is sorted when mid=2?",
      "options": ["Left half [10,15]", "Right half [1,3,8]", "Both halves", "Neither half"],
      "answer": 0,
      "explanation": "The left half [10,15] is sorted because 10 <= 15. The right half [1,3,8] is also sorted, but the algorithm checks left half first when arr[lo] <= arr[mid]."
    },
    {
      "question": "What happens if the target equals arr[mid]?",
      "options": ["Search left half", "Search right half", "Return mid immediately", "Continue searching"],
      "answer": 2,
      "explanation": "The algorithm returns mid immediately when arr[mid] == target, as we've found our answer."
    },
    {
      "question": "Why must at least one half always be sorted in a rotated array?",
      "options": ["Because rotation preserves order", "Because no duplicates exist", "Because it's a binary search requirement", "Because the array was originally sorted"],
      "answer": 3,
      "explanation": "Since the array was originally sorted before rotation, any rotation will leave at least one half properly sorted when you split at mid."
    }
  ]
}
\`\`\`

**Time Complexity:** O(log n)  
**Space Complexity:** O(1)

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "At least one half of any rotated sorted array is always properly sorted",
    "Compare endpoints to determine which half is sorted: arr[lo] <= arr[mid] for left half",
    "Once you identify the sorted half, check if target falls within its range",
    "This modified binary search maintains O(log n) time complexity",
    "The algorithm works because rotation doesn't destroy the sorted property entirely"
  ]
}
\`\`\``,
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

Given a sorted array of **distinct** elements that has been rotated, find the **minimum element**. The array was originally sorted in ascending order.

\`\`\`concept
{
  "title": "What is a Rotated Sorted Array?",
  "variant": "mental-model",
  "content": "Imagine taking a sorted array and \\"spinning\\" it like a wheel. The smallest element becomes the new starting point. Visually: [1,2,3,4,5] → rotate 2 steps right → [4,5,1,2,3]. The minimum is now hidden somewhere in the middle instead of at index 0."
}
\`\`\`

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

\`\`\`algoviz
{
  "title": "Binary Search on [4,5,6,7,0,1,2]",
  "type": "array",
  "data": [4,5,6,7,0,1,2],
  "frames": [
    {"highlight": [0,6], "label": "lo=0, hi=6. arr[0]=4 < arr[6]=2? No → rotated.", "stats": {"lo":0,"hi":6,"mid":3}},
    {"highlight": [4,6], "label": "mid=3, arr[3]=7 > arr[6]=2 → min in right half. lo=4.", "stats": {"lo":4,"hi":6,"mid":3}},
    {"highlight": [4,6], "label": "lo=4, hi=6. arr[4]=0 < arr[6]=2 → not rotated in this range.", "stats": {"lo":4,"hi":6,"mid":5}},
    {"highlight": [4,4], "label": "hi=mid=5 → new mid=4. arr[4]=0 ≤ arr[6]=2 → hi=4.", "stats": {"lo":4,"hi":4,"mid":4}},
    {"highlight": [4], "label": "lo == hi → found minimum: arr[4]=0.", "stats": {"ans":0}}
  ],
  "speed": 1000
}
\`\`\`

**Time Complexity:** O(log n)  
**Space Complexity:** O(1)

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Why do we compare arr[mid] with arr[hi] instead of arr[lo]?",
      "options": [
        "It avoids extra boundary checks",
        "It guarantees we move toward the break point",
        "Both are equivalent; this is just convention",
        "It handles duplicates better"
      ],
      "answer": 1,
      "explanation": "Comparing to arr[hi] tells us whether the break (minimum) lies to the right or left, ensuring we always shrink toward the pivot."
    },
    {
      "question": "What happens if the array is not rotated at all?",
      "options": [
        "Algorithm returns -1",
        "Algorithm returns arr[0] immediately",
        "Algorithm still performs log n steps",
        "Algorithm crashes"
      ],
      "answer": 1,
      "explanation": "The first check \`if arr[lo] < arr[hi]\` detects no rotation and returns arr[lo] in O(1) time."
    },
    {
      "question": "For the array [2,3,4,5,1], which half will we discard first?",
      "options": [
        "Left half",
        "Right half",
        "Cannot determine",
        "Both halves are kept"
      ],
      "answer": 0,
      "explanation": "mid=2, arr[mid]=4 > arr[hi]=1 → minimum is in the right half, so we discard the left."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Implement the Algorithm",
  "language": "python",
  "code": "def find_min(nums):\\n    lo, hi = 0, len(nums) - 1\\n    while lo < hi:\\n        if nums[lo] < nums[hi]:          # already sorted\\n            return nums[lo]\\n        mid = (lo + hi) // 2\\n        if nums[mid] > nums[hi]:         # pivot on right\\n            lo = mid + 1\\n        else:                            # pivot at mid or left\\n            hi = mid\\n    return nums[lo]\\n\\n# Test cases\\nprint(find_min([4,5,6,1,2,3]))  # 1\\nprint(find_min([3,1,2]))        # 1\\nprint(find_min([1,2,3,4,5]))    # 1",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "A rotated sorted array is two sorted sub-arrays concatenated; the minimum sits at their junction.",
    "Binary search locates the junction in O(log n) time by comparing the middle element with the rightmost.",
    "Always set hi = mid (not mid - 1) because mid itself might be the minimum.",
    "The algorithm gracefully handles the non-rotated case in constant time."
  ]
}
\`\`\``,
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

Imagine a sorted array that stretches off into the horizon—you have no idea where it ends. Your mission: locate a target value without ever calling \`len()\`. If you overshoot, the array hands back a sentinel value (think \`float('inf')\`) instead of crashing.

We’ll simulate this mystery with a large sorted array wrapped in a gatekeeper that returns ∞ for any out-of-bounds peek.

**Examples**  
**Example 1**  
\`\`\`
Input: arr = [1, 3, 8, 10, 15, …], target = 15  
Output: 4
\`\`\`

**Example 2**  
\`\`\`
Input: arr = [2, 5, 7, 9, 10, 12, …], target = 7  
Output: 2
\`\`\`

\`\`\`concept
{
  "title": "Why classic binary search fails",
  "variant": "insight",
  "content": "Binary search needs both ends of the range up front. In an infinite array you don’t know the upper bound, so the first step must *discover* a valid high index before you can bisect."
}
\`\`\`

## Two-Phase Strategy

1. **Galloping phase**: Start with \`lo = 0\`, \`hi = 1\`. Keep doubling \`hi\` until the value at \`hi\` is ≥ target (or ∞).  
2. **Binary-search phase**: Run ordinary binary search inside the now-known range \`[lo, hi]\`.

Total cost: **O(log p)** where *p* is the index of the target—each doubling step and each bisection step both discard half the unknown space.

\`\`\`algoviz
{
  "title": "Galloping then binary search on [1,3,8,10,15,22,…], target = 15",
  "type": "array",
  "data": [1, 3, 8, 10, 15, 22, 30, 45, 60, 80],
  "frames": [
    {"highlight": [0], "label": "lo=0, hi=1, arr[1]=3 < 15 → double"},
    {"highlight": [0, 1], "label": "lo=1, hi=2, arr[2]=8 < 15 → double"},
    {"highlight": [0, 1, 2, 3], "label": "lo=2, hi=4, arr[4]=15 ≥ 15 → stop"},
    {"highlight": [2, 3, 4], "label": "binary search inside [2,4] → found at 4"}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`steps
{
  "title": "Algorithm Walk-through",
  "steps": [
    {
      "title": "Initialize",
      "content": "Set \`lo = 0\`, \`hi = 1\`. These are *candidate* bounds, not necessarily valid yet."
    },
    {
      "title": "Expand",
      "content": "While \`reader.get(hi) < target\`:\\n- \`lo = hi\`\\n- \`hi = hi * 2\`\\n\\nThis gallops ahead exponentially until the window is guaranteed to bracket the target."
    },
    {
      "title": "Binary search",
      "content": "Standard binary search on \`[lo, hi]\`.\\n\\nEach iteration cuts the range in half, giving the second logarithmic factor."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Python implementation",
  "language": "python",
  "code": "class ArrayReader:\\n    def __init__(self, arr):\\n        self.arr = arr\\n    def get(self, i):\\n        return self.arr[i] if i < len(self.arr) else float('inf')\\n\\ndef search_infinite(reader, target):\\n    lo, hi = 0, 1\\n    while reader.get(hi) < target:\\n        lo = hi\\n        hi <<= 1          # same as hi *= 2\\n\\n    # ordinary binary search\\n    while lo <= hi:\\n        mid = (lo + hi) // 2\\n        val = reader.get(mid)\\n        if val == target:\\n            return mid\\n        elif val < target:\\n            lo = mid + 1\\n        else:\\n            hi = mid - 1\\n    return -1\\n\\n# quick test\\nreader = ArrayReader([1,3,8,10,15,22,30,45,60])\\nprint(search_infinite(reader, 15))  # → 4",
  "runnable": true
}
\`\`\`

## Complexity Analysis

- **Time**: O(log p) — galloping takes Θ(log p) steps to reach index p, and binary search inside the final window also costs Θ(log p).  
- **Space**: O(1) — only a handful of variables regardless of array size.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Naïve linear scan",
    "code": "i = 0\\nwhile reader.get(i) < target:\\n    i += 1\\nif reader.get(i) == target:\\n    return i\\nreturn -1"
  },
  "after": {
    "label": "Exponential + binary search",
    "code": "# galloping\\nlo, hi = 0, 1\\nwhile reader.get(hi) < target:\\n    lo, hi = hi, hi*2\\n# binary search inside [lo, hi]\\n..."
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Check your understanding",
  "questions": [
    {
      "question": "If the target sits at index 63, how many galloping steps are needed before the binary-search phase begins?",
      "options": ["4", "5", "6", "7"],
      "answer": 1,
      "explanation": "Doubling sequence 1→2→4→8→16→32→64; 64 is the first ≥63, so 6 steps (hi starts at 1)."
    },
    {
      "question": "What happens if the array contains duplicate targets?",
      "options": ["Algorithm always returns the first index", "Algorithm may return any matching index", "Algorithm enters infinite loop", "Algorithm returns -1"],
      "answer": 1,
      "explanation": "Standard binary search on a non-unique sorted array yields *an* occurrence, not necessarily the leftmost or rightmost."
    },
    {
      "question": "Changing the initial \`hi\` from 1 to 0 would break the algorithm because:",
      "options": ["We could never advance", "hi*2 stays 0", "Both A and B", "Nothing breaks"],
      "answer": 2,
      "explanation": "With hi=0, doubling keeps hi=0, so the while condition never becomes false if the target is positive."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Unknown bounds → add an exponential ‘galloping’ phase to discover a valid window in O(log p).",
    "Once bounds are known, drop back to ordinary binary search; total cost stays logarithmic.",
    "Sentinel values (infinity) let you probe safely without length checks or exceptions."
  ]
}
\`\`\``,
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
