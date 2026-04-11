import { Module } from "../types";

export const sortingModule: Module = {
  id: "sorting-algorithms",
  title: "Sorting Algorithms",
  description: "Implement and compare classic sorting algorithms: bubble sort, selection sort, merge sort, and quicksort.",
  lessons: [
    {
      id: "sorting-bubble-selection",
      slug: "bubble-selection-sort",
      title: "Bubble Sort & Selection Sort",
      content: `## Bubble Sort & Selection Sort

These are the simplest sorting algorithms. They are easy to understand but inefficient for large datasets.

\`\`\`concept
{"title": "Why O(n²) Matters", "variant": "insight", "content": "For n = 1,000, an O(n²) algorithm performs ~1 million operations. On a 3 GHz CPU that's still only 0.3 ms, but at n = 10,000 the same algorithm needs ~30 ms. The quadratic growth quickly becomes the bottleneck."}
\`\`\`

### Bubble Sort

Repeatedly swap adjacent elements if they are in the wrong order. After each pass, the largest unsorted element "bubbles" to its correct position.

- **Time:** O(n²) average and worst, O(n) best (already sorted with early exit)
- **Space:** O(1)
- **Stable:** Yes

\`\`\`algoviz
{"title": "Bubble Sort in Action", "type": "array", "data": [64, 34, 25, 12, 22, 11, 90],
 "frames": [
   {"highlight": [0,1], "label": "Compare 64 & 34 → swap", "stats": {"pass": 1, "swaps": 1}},
   {"highlight": [1,2], "label": "Compare 64 & 25 → swap", "stats": {"pass": 1, "swaps": 2}},
   {"highlight": [2,3], "label": "Compare 64 & 12 → swap", "stats": {"pass": 1, "swaps": 3}},
   {"highlight": [3,4], "label": "Compare 64 & 22 → swap", "stats": {"pass": 1, "swaps": 4}},
   {"highlight": [4,5], "label": "Compare 64 & 11 → swap", "stats": {"pass": 1, "swaps": 5}},
   {"highlight": [5,6], "label": "Compare 64 & 90 → no swap", "stats": {"pass": 1, "swaps": 5}},
   {"highlight": [0,1], "label": "Second pass begins", "stats": {"pass": 2, "swaps": 5}},
   {"highlight": [4,5], "label": "Early exit: no swaps this pass → sorted!", "stats": {"pass": 2, "swaps": 0}}
 ],
 "speed": 600}
\`\`\`

### Selection Sort

Find the minimum element in the unsorted portion and swap it to the front. Repeat for each position.

- **Time:** O(n²) in all cases
- **Space:** O(1)
- **Stable:** No (in basic implementation)

\`\`\`algoviz
{"title": "Selection Sort in Action", "type": "array", "data": [64, 25, 12, 22, 11],
 "frames": [
   {"highlight": [0,4], "label": "Scan entire array for min", "stats": {"i": 0, "min_idx": 4}},
   {"highlight": [0,4], "label": "Swap 64 ↔ 11", "stats": {"i": 0, "swaps": 1}},
   {"highlight": [1,4], "label": "Scan remaining for min", "stats": {"i": 1, "min_idx": 2}},
   {"highlight": [1,2], "label": "Swap 25 ↔ 12", "stats": {"i": 1, "swaps": 2}},
   {"highlight": [2,4], "label": "Scan remaining for min", "stats": {"i": 2, "min_idx": 4}},
   {"highlight": [2,4], "label": "Swap 22 ↔ 11", "stats": {"i": 2, "swaps": 3}}
 ],
 "speed": 700}
\`\`\`

\`\`\`compare
{"variant": "good-bad", "before": {"label": "Bubble Sort (many swaps)", "code": "def bubble_once(arr):\\n    for i in range(len(arr)-1):\\n        if arr[i] > arr[i+1]:\\n            arr[i], arr[i+1] = arr[i+1], arr[i]\\n    # up to n-1 swaps per pass"},
"after": {"label": "Selection Sort (≤ n-1 swaps)", "code": "def selection_once(arr):\\n    min_idx = 0\\n    for i in range(1, len(arr)):\\n        if arr[i] < arr[min_idx]:\\n            min_idx = i\\n    arr[0], arr[min_idx] = arr[min_idx], arr[0]\\n    # exactly 1 swap per pass"}}
\`\`\`

### Choosing a Sorting Algorithm

\`\`\`mermaid
flowchart TD
    Start["Need to sort?"] --> Size{"n < 20?"}
    Size -->|Yes| Simple["Insertion/Selection Sort<br/>O(n squared), simple"]
    Size -->|No| Stable{"Need stable sort?"}
    Stable -->|Yes| Merge["Merge Sort<br/>O(n log n), O(n) space"]
    Stable -->|No| Space{"Memory constrained?"}
    Space -->|Yes| Quick["Quick Sort<br/>O(n log n) avg, in-place"]
    Space -->|No| Merge2["Merge Sort<br/>O(n log n) guaranteed"]
    style Simple fill:#4ade80,color:#000
    style Merge fill:#60a5fa,color:#000
    style Quick fill:#f59e0b,color:#000
    style Merge2 fill:#60a5fa,color:#000
\`\`\`

\`\`\`quiz
{"title": "Quick Check: Bubble vs Selection", "questions": [
  {"question": "Which algorithm guarantees at most n-1 swaps total?", "options": ["Bubble Sort", "Selection Sort", "Both", "Neither"], "answer": 1, "explanation": "Selection Sort performs exactly one swap per pass, totaling ≤ n-1 swaps. Bubble Sort may swap every comparison."},
  {"question": "An array is already sorted. Which algorithm can finish in O(n) time?", "options": ["Bubble Sort with early-exit optimization", "Selection Sort", "Neither", "Both"], "answer": 0, "explanation": "Optimized Bubble Sort detects no swaps and exits early; Selection Sort always scans the remainder."},
  {"question": "You need a stable sort and have only 10 elements. Which is suitable?", "options": ["Bubble Sort", "Selection Sort", "Both", "Neither"], "answer": 0, "explanation": "Bubble Sort is stable; basic Selection Sort is not."}
]}
\`\`\`

### When to Use

- Very small datasets (< 20 elements)
- Teaching and understanding sorting concepts
- When simplicity is more important than performance

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Bubble Sort is stable and can reach O(n) on nearly-sorted data with early-exit optimization", "Selection Sort always does O(n²) comparisons but only O(n) swaps—useful when writes are expensive", "Both are in-place (O(1) space) and easy to implement, but scale poorly beyond tiny inputs"]}
\`\`\``,
      starterCode: `def bubble_sort(arr):
    # TODO: Sort arr in-place using bubble sort
    # Optimization: stop early if no swaps in a pass
    pass

def selection_sort(arr):
    # TODO: Sort arr in-place using selection sort
    pass

# Test cases
arr1 = [64, 34, 25, 12, 22, 11, 90]
bubble_sort(arr1)
print(f"Bubble sort: {arr1}")
# Expected: [11, 12, 22, 25, 34, 64, 90]

arr2 = [64, 34, 25, 12, 22, 11, 90]
selection_sort(arr2)
print(f"Selection sort: {arr2}")
# Expected: [11, 12, 22, 25, 34, 64, 90]

# Edge cases
arr3 = [1]
bubble_sort(arr3)
print(f"Single element: {arr3}")  # Expected: [1]

arr4 = [5, 4, 3, 2, 1]
bubble_sort(arr4)
print(f"Reverse sorted: {arr4}")  # Expected: [1, 2, 3, 4, 5]

arr5 = [1, 2, 3, 4, 5]
bubble_sort(arr5)
print(f"Already sorted: {arr5}")  # Expected: [1, 2, 3, 4, 5]
`,
      solutionCode: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break

def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

# Test cases
arr1 = [64, 34, 25, 12, 22, 11, 90]
bubble_sort(arr1)
print(f"Bubble sort: {arr1}")
# Expected: [11, 12, 22, 25, 34, 64, 90]

arr2 = [64, 34, 25, 12, 22, 11, 90]
selection_sort(arr2)
print(f"Selection sort: {arr2}")
# Expected: [11, 12, 22, 25, 34, 64, 90]

# Edge cases
arr3 = [1]
bubble_sort(arr3)
print(f"Single element: {arr3}")  # Expected: [1]

arr4 = [5, 4, 3, 2, 1]
bubble_sort(arr4)
print(f"Reverse sorted: {arr4}")  # Expected: [1, 2, 3, 4, 5]

arr5 = [1, 2, 3, 4, 5]
bubble_sort(arr5)
print(f"Already sorted: {arr5}")  # Expected: [1, 2, 3, 4, 5]
`,
    },
    {
      id: "sorting-merge",
      slug: "merge-sort",
      title: "Merge Sort",
      content: `## Merge Sort

**Merge sort** is a divide-and-conquer algorithm that:

1. **Divide** the array into two halves
2. **Recursively sort** each half
3. **Merge** the two sorted halves

\`\`\`concept
{
  "title": "Divide & Conquer Mental Model",
  "variant": "mental-model",
  "content": "Think of merge sort like organizing a messy pile of papers:\\n\\n1. **Divide**: Split the pile in half repeatedly until you have single sheets\\n2. **Conquer**: Each single sheet is already \\"sorted\\"\\n3. **Combine**: Merge pairs back together, always keeping them in order\\n\\nThe key insight: merging two *already sorted* stacks is fast - you just compare the top sheets and pick the smaller one!"
}
\`\`\`

### Properties

- **Time:** O(n log n) in all cases (best, average, worst)
- **Space:** O(n) for the temporary merge arrays
- **Stable:** Yes — preserves relative order of equal elements

### Why O(n log n)?

- We divide log n times (each level halves the problem)
- At each level, we do O(n) work to merge
- Total: O(n log n)

\`\`\`algoviz
{
  "title": "Merge Sort in Action",
  "type": "array",
  "data": [38, 27, 43, 3, 9, 82, 10],
  "frames": [
    {"highlight": [0,1,2,3,4,5,6], "label": "Original array", "stats": {"level": 0}},
    {"highlight": [0,1,2,3], "label": "Split left half", "stats": {"level": 1}},
    {"highlight": [4,5,6], "label": "Split right half", "stats": {"level": 1}},
    {"highlight": [0,1], "label": "Split [38,27]", "stats": {"level": 2}},
    {"highlight": [2,3], "label": "Split [43,3]", "stats": {"level": 2}},
    {"highlight": [0], "label": "Single element [38]", "stats": {"level": 3}},
    {"highlight": [1], "label": "Single element [27]", "stats": {"level": 3}},
    {"highlight": [0,1], "label": "Merge [27,38]", "stats": {"level": 3}},
    {"highlight": [2,3], "label": "Merge [3,43]", "stats": {"level": 3}},
    {"highlight": [0,1,2,3], "label": "Merge [3,27,38,43]", "stats": {"level": 2}},
    {"highlight": [4,5], "label": "Split [9,82]", "stats": {"level": 2}},
    {"highlight": [6], "label": "Single element [10]", "stats": {"level": 2}},
    {"highlight": [4,5,6], "label": "Merge [9,10,82]", "stats": {"level": 2}},
    {"highlight": [0,1,2,3,4,5,6], "label": "Final merge [3,9,10,27,38,43,82]", "stats": {"level": 0}}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`trace
{
  "title": "Counting Inversions During Merge",
  "language": "python",
  "code": "def merge_sort_count(arr, left, right):\\n    if left >= right:\\n        return 0\\n    \\n    mid = (left + right) // 2\\n    inv_count = 0\\n    \\n    # Count inversions in left and right halves\\n    inv_count += merge_sort_count(arr, left, mid)\\n    inv_count += merge_sort_count(arr, mid + 1, right)\\n    \\n    # Count split inversions during merge\\n    inv_count += merge(arr, left, mid, right)\\n    \\n    return inv_count\\n\\ndef merge(arr, left, mid, right):\\n    left_arr = arr[left:mid + 1]\\n    right_arr = arr[mid + 1:right + 1]\\n    \\n    i = j = 0\\n    k = left\\n    inv_count = 0\\n    \\n    while i < len(left_arr) and j < len(right_arr):\\n        if left_arr[i] <= right_arr[j]:\\n            arr[k] = left_arr[i]\\n            i += 1\\n        else:\\n            arr[k] = right_arr[j]\\n            j += 1\\n            # All remaining elements in left_arr are greater\\n            inv_count += len(left_arr) - i\\n        k += 1\\n    \\n    # Copy remaining elements\\n    while i < len(left_arr):\\n        arr[k] = left_arr[i]\\n        i += 1\\n        k += 1\\n    \\n    while j < len(right_arr):\\n        arr[k] = right_arr[j]\\n        j += 1\\n        k += 1\\n    \\n    return inv_count\\n\\n# Test\\narr = [5, 3, 2, 4, 1]\\nprint(f\\"Original: {arr}\\")\\ninversions = merge_sort_count(arr, 0, len(arr) - 1)\\nprint(f\\"Sorted: {arr}\\")\\nprint(f\\"Inversions: {inversions}\\")",
  "frames": [
    {"line": 1, "vars": {"arr": [5, 3, 2, 4, 1], "left": 0, "right": 4}, "note": "Starting with full array", "stdout": ""},
    {"line": 2, "vars": {"left": 0, "right": 4}, "note": "Not base case, continue", "stdout": ""},
    {"line": 4, "vars": {"mid": 2}, "note": "Split at index 2", "stdout": ""},
    {"line": 7, "vars": {"inv_count": 0}, "note": "Process left half [5,3,2]", "stdout": ""},
    {"line": 8, "vars": {"inv_count": 2}, "note": "Left half done, 2 inversions found", "stdout": ""},
    {"line": 11, "vars": {"inv_count": 2}, "note": "Process right half [4,1]", "stdout": ""},
    {"line": 12, "vars": {"inv_count": 3}, "note": "Right half done, 1 more inversion", "stdout": ""},
    {"line": 15, "vars": {"inv_count": 3}, "note": "Merge halves and count split inversions", "stdout": ""},
    {"line": 16, "vars": {"inv_count": 8}, "note": "Found 5 split inversions", "stdout": ""},
    {"line": 17, "vars": {"inv_count": 8}, "note": "Return total count", "stdout": "Original: [5, 3, 2, 4, 1]\\nSorted: [1, 2, 3, 4, 5]\\nInversions: 8"}
  ],
  "speed": 800
}
\`\`\`

### Problem

Implement merge sort and count the number of inversions during the merge step. An inversion is a pair (i, j) where i < j but arr[i] > arr[j].

\`\`\`fillblank
{
  "title": "Merge Sort Implementation",
  "prompt": "Complete the merge sort implementation below. Fill in the missing parts to correctly sort the array.",
  "language": "python",
  "template": "def merge_sort(arr, left, right):\\n    if left ___ right:\\n        return\\n    \\n    mid = ___\\n    merge_sort(arr, left, mid)\\n    merge_sort(arr, mid + 1, right)\\n    merge(arr, left, mid, right)\\n\\ndef merge(arr, left, mid, right):\\n    left_arr = arr[left:mid + 1]\\n    right_arr = arr[mid + 1:right + 1]\\n    \\n    i = j = 0\\n    k = left\\n    \\n    while i < len(left_arr) and j < len(right_arr):\\n        if left_arr[i] ___ right_arr[j]:\\n            arr[k] = left_arr[i]\\n            i += 1\\n        else:\\n            arr[k] = right_arr[j]\\n            j += 1\\n        k += 1\\n    \\n    # Copy remaining elements\\n    while i < len(left_arr):\\n        arr[k] = left_arr[i]\\n        i += 1\\n        k += 1\\n    \\n    while j < len(right_arr):\\n        arr[k] = right_arr[j]\\n        j += 1\\n        k += 1",
  "blanks": [
    {"answer": ">=", "hint": "Base case: when to stop dividing?"},
    {"answer": "(left + right) // 2", "hint": "How to find the middle index?"},
    {"answer": "<=", "hint": "Which element should go first for stability?"}
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Merge Sort Understanding Check",
  "questions": [
    {
      "question": "Why does merge sort always have O(n log n) time complexity?",
      "options": [
        "Because it uses recursion",
        "Because it divides the problem log n times and does O(n) work at each level",
        "Because it needs to compare every pair of elements",
        "Because it creates temporary arrays"
      ],
      "answer": 1,
      "explanation": "Merge sort divides the array in half log n times (creating log n levels), and at each level it does O(n) work to merge the subarrays, resulting in O(n log n) total time."
    },
    {
      "question": "What is the main disadvantage of merge sort compared to quicksort?",
      "options": [
        "It's not stable",
        "It has worse time complexity",
        "It requires O(n) extra space",
        "It's harder to implement"
      ],
      "answer": 2,
      "explanation": "Merge sort requires O(n) additional space for the temporary arrays used during merging, while quicksort can be implemented with only O(log n) space for the recursion stack."
    },
    {
      "question": "When counting inversions during merge sort, when do we find a new inversion?",
      "options": [
        "When elements in left array are smaller",
        "When elements in right array are smaller than remaining left elements",
        "When arrays are perfectly balanced",
        "At the base case of recursion"
      ],
      "answer": 1,
      "explanation": "When an element from the right array is placed before an element from the left array, all remaining elements in the left array form inversions with this right array element."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Merge sort guarantees O(n log n) time complexity in all cases through divide-and-conquer",
    "It requires O(n) extra space but is stable, preserving the order of equal elements",
    "The merge step can be extended to count inversions efficiently",
    "While consistent, merge sort can be slower than quicksort in practice due to extra memory usage"
  ]
}
\`\`\``,
      starterCode: `def merge_sort(arr):
    # TODO: Sort arr using merge sort, return sorted array
    pass

def merge(left, right):
    # TODO: Merge two sorted arrays into one
    pass

def count_inversions(arr):
    # TODO: Return (sorted_array, inversion_count)
    pass

# Test merge sort
print(merge_sort([38, 27, 43, 3, 9, 82, 10]))
# Expected: [3, 9, 10, 27, 38, 43, 82]

print(merge_sort([5, 4, 3, 2, 1]))
# Expected: [1, 2, 3, 4, 5]

print(merge_sort([1]))
# Expected: [1]

# Test inversion counting
_, inv = count_inversions([2, 4, 1, 3, 5])
print(f"Inversions: {inv}")  # Expected: 3

_, inv = count_inversions([5, 4, 3, 2, 1])
print(f"Inversions: {inv}")  # Expected: 10
`,
      solutionCode: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

def count_inversions(arr):
    if len(arr) <= 1:
        return arr[:], 0
    mid = len(arr) // 2
    left, left_inv = count_inversions(arr[:mid])
    right, right_inv = count_inversions(arr[mid:])
    merged = []
    inversions = left_inv + right_inv
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            inversions += len(left) - i
            j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged, inversions

# Test merge sort
print(merge_sort([38, 27, 43, 3, 9, 82, 10]))
# Expected: [3, 9, 10, 27, 38, 43, 82]

print(merge_sort([5, 4, 3, 2, 1]))
# Expected: [1, 2, 3, 4, 5]

print(merge_sort([1]))
# Expected: [1]

# Test inversion counting
_, inv = count_inversions([2, 4, 1, 3, 5])
print(f"Inversions: {inv}")  # Expected: 3

_, inv = count_inversions([5, 4, 3, 2, 1])
print(f"Inversions: {inv}")  # Expected: 10
`,
    },
    {
      id: "sorting-quick",
      slug: "quick-sort",
      title: "Quick Sort",
      content: `## Quick Sort

**Quick sort** is a divide-and-conquer algorithm that:

1. Choose a **pivot** element
2. **Partition** the array: elements smaller than pivot go left, larger go right
3. **Recursively sort** the left and right partitions

\`\`\`concept
{
  "title": "Divide-and-Conquer Mental Model",
  "variant": "mental-model",
  "content": "Think of quick sort like organizing a messy room: pick one item (pivot) as reference, move everything smaller to the left pile and larger to the right pile. Then repeat this process on each pile until everything is perfectly organized."
}
\`\`\`

\`\`\`steps
{
  "title": "Quick Sort in Action",
  "steps": [
    {
      "title": "Choose Pivot",
      "content": "Select an element as pivot (commonly last element in Lomuto scheme)"
    },
    {
      "title": "Partition",
      "content": "Rearrange array so elements < pivot are left, elements > pivot are right"
    },
    {
      "title": "Recursively Sort",
      "content": "Apply quick sort to left and right partitions independently"
    }
  ]
}
\`\`\`

\`\`\`algoviz
{
  "title": "Quick Sort Visualization",
  "type": "array",
  "data": [64, 34, 25, 12, 22, 11, 90],
  "frames": [
    {"highlight": [0,1,2,3,4,5,6], "label": "Initial array", "stats": {"pivot": 90}},
    {"highlight": [0,1,2,3,4,5], "label": "Choose pivot=90 (last element)", "stats": {"i": -1}},
    {"highlight": [0,1,2,3,4,5], "label": "Partition: move elements < 90 left", "stats": {"i": 5}},
    {"highlight": [0,1,2,3,4,5], "label": "Swap pivot to final position", "stats": {"pivot_idx": 5}},
    {"highlight": [0,1,2,3,4], "label": "Recursively sort left partition", "stats": {"size": 5}},
    {"highlight": [6], "label": "Recursively sort right partition (empty)", "stats": {"size": 1}}
  ],
  "speed": 1000
}
\`\`\`

### Properties

- **Time:** O(n log n) average, O(n²) worst case
- **Space:** O(log n) for recursion stack
- **Stable:** No
- **In-place:** Yes

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Worst Case (O(n²))",
    "code": "// Already sorted array\\n[1, 2, 3, 4, 5, 6, 7]\\n// Pivot always last element\\n// Creates highly unbalanced partitions"
  },
  "after": {
    "label": "Average Case (O(n log n))",
    "code": "// Random array\\n[6, 3, 1, 7, 2, 5, 4]\\n// Balanced partitions\\n// ~log n levels of recursion"
  }
}
\`\`\`

### Quick Sort vs Merge Sort

| | Quick Sort | Merge Sort |
|-|-----------|------------|
| Average time | O(n log n) | O(n log n) |
| Worst time | O(n²) | O(n log n) |
| Space | O(log n) | O(n) |
| Stable | No | Yes |
| In-place | Yes | No |

\`\`\`callout
{
  "type": "tip",
  "title": "When to Use Quick Sort",
  "content": "Quick sort is preferred when:\\n- Memory is limited (in-place)\\n- Average-case performance matters more than worst-case\\n- Cache performance is important (good locality of reference)\\n- You can afford occasional O(n²) operations"
}
\`\`\`

### Problem

Implement quicksort with the Lomuto partition scheme.

\`\`\`fillblank
{
  "title": "Implement Lomuto Partition",
  "prompt": "Complete the partition function that places the pivot in its correct position",
  "language": "python",
  "template": "def partition(arr, low, high):\\n    pivot = arr[high]\\n    i = low - 1\\n    \\n    for j in range(low, high):\\n        if arr[j] <= pivot:\\n            i += 1\\n            arr[i], arr[j] = ___\\n    \\n    arr[i + 1], arr[high] = ___\\n    return ___",
  "blanks": [
    {"answer": "arr[j], arr[i]"},
    {"answer": "arr[high], arr[i + 1]"},
    {"answer": "i + 1"}
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Quick Sort Implementation",
  "language": "python",
  "code": "def quick_sort(arr, low=0, high=None):\\n    if high is None:\\n        high = len(arr) - 1\\n    \\n    if low < high:\\n        # Partition and get pivot index\\n        pi = partition(arr, low, high)\\n        \\n        # Recursively sort left and right\\n        quick_sort(arr, low, pi - 1)\\n        quick_sort(arr, pi + 1, high)\\n    \\n    return arr\\n\\ndef partition(arr, low, high):\\n    pivot = arr[high]\\n    i = low - 1\\n    \\n    for j in range(low, high):\\n        if arr[j] <= pivot:\\n            i += 1\\n            arr[i], arr[j] = arr[j], arr[i]\\n    \\n    arr[i + 1], arr[high] = arr[high], arr[i + 1]\\n    return i + 1\\n\\n# Test the implementation\\ntest_array = [64, 34, 25, 12, 22, 11, 90]\\nprint(\\"Original:\\", test_array)\\nquick_sort(test_array)\\nprint(\\"Sorted:\\", test_array)",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Quick Sort Understanding",
  "questions": [
    {
      "question": "Why does quick sort have O(n²) worst-case time complexity?",
      "options": [
        "Because it uses too much memory",
        "Because pivot selection can create unbalanced partitions",
        "Because it needs to scan the array multiple times",
        "Because recursion depth is O(n)"
      ],
      "answer": 1,
      "explanation": "When the pivot consistently creates highly unbalanced partitions (e.g., always picking the smallest/largest element), the recursion becomes O(n) levels deep, leading to O(n²) total comparisons."
    },
    {
      "question": "What is the space complexity of quick sort?",
      "options": [
        "O(n) for the auxiliary array",
        "O(1) constant space",
        "O(log n) for the recursion stack",
        "O(n log n) for temporary storage"
      ],
      "answer": 2,
      "explanation": "Quick sort uses O(log n) space for the recursion stack in the average case, making it very space-efficient compared to merge sort's O(n) space requirement."
    },
    {
      "question": "Which statement about quick sort's stability is correct?",
      "options": [
        "Quick sort is stable because it preserves relative order",
        "Quick sort is not stable due to swapping during partitioning",
        "Quick sort can be made stable with extra memory",
        "Stability depends on the pivot selection method"
      ],
      "answer": 1,
      "explanation": "Quick sort is inherently unstable because the partitioning step can change the relative order of equal elements when swapping them across the pivot."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Quick sort uses divide-and-conquer with pivot-based partitioning",
    "Average case O(n log n) but worst case O(n²) with poor pivot choices",
    "Space-efficient O(log n) and in-place, but not stable",
    "Lomuto partition scheme places pivot in final sorted position",
    "Performance heavily depends on pivot selection strategy"
  ]
}
\`\`\``,
      starterCode: `import random

def quick_sort(arr):
    # TODO: Sort arr in-place using quicksort
    _quick_sort(arr, 0, len(arr) - 1)

def _quick_sort(arr, low, high):
    # TODO: Recursive quicksort helper
    pass

def partition(arr, low, high):
    # TODO: Partition using last element as pivot
    # Return final position of pivot
    pass

# Test cases
arr1 = [10, 7, 8, 9, 1, 5]
quick_sort(arr1)
print(f"Quick sort: {arr1}")
# Expected: [1, 5, 7, 8, 9, 10]

arr2 = [64, 34, 25, 12, 22, 11, 90]
quick_sort(arr2)
print(f"Quick sort: {arr2}")
# Expected: [11, 12, 22, 25, 34, 64, 90]

arr3 = [5, 4, 3, 2, 1]
quick_sort(arr3)
print(f"Reverse: {arr3}")
# Expected: [1, 2, 3, 4, 5]

arr4 = [1]
quick_sort(arr4)
print(f"Single: {arr4}")  # Expected: [1]
`,
      solutionCode: `import random

def quick_sort(arr):
    _quick_sort(arr, 0, len(arr) - 1)

def _quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        _quick_sort(arr, low, pi - 1)
        _quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# Test cases
arr1 = [10, 7, 8, 9, 1, 5]
quick_sort(arr1)
print(f"Quick sort: {arr1}")
# Expected: [1, 5, 7, 8, 9, 10]

arr2 = [64, 34, 25, 12, 22, 11, 90]
quick_sort(arr2)
print(f"Quick sort: {arr2}")
# Expected: [11, 12, 22, 25, 34, 64, 90]

arr3 = [5, 4, 3, 2, 1]
quick_sort(arr3)
print(f"Reverse: {arr3}")
# Expected: [1, 2, 3, 4, 5]

arr4 = [1]
quick_sort(arr4)
print(f"Single: {arr4}")  # Expected: [1]
`,
    },
  ],
};
