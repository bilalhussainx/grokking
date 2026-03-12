import { Module } from "../types";

export const sortingModule: Module = {
  id: "sorting-algorithms",
  title: "Sorting Algorithms",
  description:
    "Implement and compare classic sorting algorithms: bubble sort, selection sort, merge sort, and quicksort.",
  lessons: [
    {
      id: "sorting-bubble-selection",
      slug: "bubble-selection-sort",
      title: "Bubble Sort & Selection Sort",
      content: `## Bubble Sort & Selection Sort

These are the simplest sorting algorithms. They are easy to understand but inefficient for large datasets.

### Bubble Sort

Repeatedly swap adjacent elements if they are in the wrong order. After each pass, the largest unsorted element "bubbles" to its correct position.

- **Time:** O(n^2) average and worst, O(n) best (already sorted with early exit)
- **Space:** O(1)
- **Stable:** Yes

### Selection Sort

Find the minimum element in the unsorted portion and swap it to the front. Repeat for each position.

- **Time:** O(n^2) in all cases
- **Space:** O(1)
- **Stable:** No (in basic implementation)

### When to Use

- Very small datasets (< 20 elements)
- Teaching and understanding sorting concepts
- When simplicity is more important than performance

### Problem

Implement both algorithms and compare their behavior.`,
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

### Properties

- **Time:** O(n log n) in all cases (best, average, worst)
- **Space:** O(n) for the temporary merge arrays
- **Stable:** Yes — preserves relative order of equal elements

### Why O(n log n)?

- We divide log n times (each level halves the problem)
- At each level, we do O(n) work to merge
- Total: O(n log n)

### Problem

Implement merge sort and count the number of inversions during the merge step. An inversion is a pair (i, j) where i < j but arr[i] > arr[j].`,
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

### Properties

- **Time:** O(n log n) average, O(n^2) worst case
- **Space:** O(log n) for recursion stack
- **Stable:** No
- **In-place:** Yes

### Quick Sort vs Merge Sort

| | Quick Sort | Merge Sort |
|-|-----------|------------|
| Average time | O(n log n) | O(n log n) |
| Worst time | O(n^2) | O(n log n) |
| Space | O(log n) | O(n) |
| Stable | No | Yes |
| In-place | Yes | No |

### Problem

Implement quicksort with the Lomuto partition scheme.`,
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
