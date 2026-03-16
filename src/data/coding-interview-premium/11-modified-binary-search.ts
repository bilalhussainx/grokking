import { Module } from "../types";

export const modifiedBinarySearchModule: Module = {
  id: "modified-binary-search",
  title: "Modified Binary Search",
  description:
    "Master the Modified Binary Search pattern for searching in rotated arrays, finding boundaries, and solving search variations. Essential for interview problems involving sorted arrays with twists.",
  lessons: [
    {
      id: "modified-binary-search-intro",
      slug: "modified-binary-search-intro",
      title: "Introduction to Modified Binary Search",
      content: `## The Modified Binary Search Pattern

The **Modified Binary Search** pattern adapts the classic binary search algorithm to handle variations like rotated arrays, finding boundaries, and searching in special conditions.

<!-- voice:section_check concept="Modified Binary Search basics" -->

### Why Modified Binary Search?

Standard binary search requires a fully sorted array. Many problems present:
- **Rotated sorted arrays**: Array was sorted then rotated
- **Finding boundaries**: First/last occurrence of a value
- **Unknown length**: Array size is unknown (infinite array)
- **Order-agnostic**: Don't know if ascending or descending

### Classic Binary Search Template

~~~
left, right = 0, len(arr) - 1

while left <= right:
    mid = left + (right - left) // 2
    
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        left = mid + 1
    else:
        right = mid - 1

return -1
~~~

### Key Modifications

| Variation | Modification |
|-----------|-------------|
| **Order-agnostic** | Compare arr[0] with arr[-1] to determine order |
| **Rotated array** | Determine which half is sorted, check if target is there |
| **Find boundary** | Don't return immediately on match, continue searching |
| **Infinite array** | Use exponential search to find bounds first |

<!-- voice:key_insight insight="The key to modified binary search is determining which half contains the answer, even when the array isn't fully sorted" -->

### Complexity

- **Time:** O(log n) for most variations
- **Space:** O(1) — iterative approach`,
    },
    {
      id: "order-agnostic-binary-search",
      slug: "order-agnostic-binary-search",
      title: "Order-Agnostic Binary Search",
      content: `## Order-Agnostic Binary Search

<!-- voice:section_check concept="Binary search without knowing order" -->

### Problem Statement

Given a sorted array, search for a target. The array could be sorted in ascending or descending order.

### Examples

~~~
Input: arr = [4, 6, 10], target = 10
Output: 2
Explanation: Array is ascending
~~~

~~~
Input: arr = [10, 6, 4], target = 10
Output: 0
Explanation: Array is descending
~~~

### Approach

1. First determine if array is ascending or descending by comparing first and last elements
2. Apply standard binary search with appropriate comparison

<!-- voice:key_insight insight="Compare arr[0] with arr[-1]: if arr[0] < arr[-1], it's ascending; otherwise descending" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(log n)
- **Space:** O(1)`,
      starterCode: `def order_agnostic_binary_search(arr, target):
    """
    Binary search when array order (asc/desc) is unknown.
    
    Args:
        arr: Sorted array (ascending or descending)
        target: Value to search for
    
    Returns:
        int: Index of target, or -1 if not found
    
    Example:
        >>> order_agnostic_binary_search([4, 6, 10], 10)
        2
        >>> order_agnostic_binary_search([10, 6, 4], 10)
        0
    """
    # TODO: Determine order, then apply appropriate binary search
    # Hint: Compare arr[0] and arr[-1] to determine if ascending
    pass


# ─── Test Cases ───

# Ascending order
print(order_agnostic_binary_search([1, 2, 3, 4, 5, 6, 7], 5))
# Expected: 4

# Descending order
print(order_agnostic_binary_search([10, 8, 6, 4, 2], 6))
# Expected: 2

# Target not found
print(order_agnostic_binary_search([1, 2, 3], 10))
# Expected: -1

# Single element
print(order_agnostic_binary_search([5], 5))
# Expected: 0

# Two elements ascending
print(order_agnostic_binary_search([1, 3], 3))
# Expected: 1

# Two elements descending
print(order_agnostic_binary_search([5, 3], 5))
# Expected: 0
`,
      solutionCode: `def order_agnostic_binary_search(arr, target):
    """
    Binary search when array order (asc/desc) is unknown.
    
    Time Complexity: O(log n)
    Space Complexity: O(1)
    """
    if not arr:
        return -1
    
    # Determine if array is ascending or descending
    is_ascending = arr[0] < arr[-1]
    
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        
        if is_ascending:
            # Standard binary search for ascending
            if arr[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        else:
            # Reversed binary search for descending
            if arr[mid] < target:
                right = mid - 1
            else:
                left = mid + 1
    
    return -1


# ─── Test Cases ───
print(order_agnostic_binary_search([1, 2, 3, 4, 5, 6, 7], 5))
# Expected: 4

print(order_agnostic_binary_search([10, 8, 6, 4, 2], 6))
# Expected: 2

print(order_agnostic_binary_search([1, 2, 3], 10))
# Expected: -1

print(order_agnostic_binary_search([5], 5))
# Expected: 0

print(order_agnostic_binary_search([1, 3], 3))
# Expected: 1

print(order_agnostic_binary_search([5, 3], 5))
# Expected: 0
`,
    },
    {
      id: "search-rotated-array",
      slug: "search-rotated-array",
      title: "Search in Rotated Array",
      content: `## Search in Rotated Sorted Array

<!-- voice:section_check concept="Binary search in rotated array" -->

### Problem Statement

Given a sorted array that has been rotated at some pivot point, search for a target value.

**Note:** Array contains distinct elements.

### Examples

~~~
Input: arr = [10, 15, 1, 3, 8], target = 15
Output: 1
Explanation: Original sorted array [1, 3, 8, 10, 15] was rotated at 10
~~~

~~~
Input: arr = [4, 5, 7, 9, 10, -1, 2], target = -1
Output: 5
~~~

### Approach

In a rotated sorted array, at least one half is always sorted:
1. Calculate mid
2. Determine which half is sorted (compare arr[left] with arr[mid])
3. Check if target lies in the sorted half
4. If yes, search there; otherwise search the other half

<!-- voice:key_insight insight="In a rotated sorted array, one half is always sorted — determine which half and if target is in it" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(log n)
- **Space:** O(1)`,
      starterCode: `def search_rotated_array(arr, target):
    """
    Search for target in a rotated sorted array with distinct elements.
    
    Args:
        arr: Rotated sorted array with distinct elements
        target: Value to search for
    
    Returns:
        int: Index of target, or -1 if not found
    
    Example:
        >>> search_rotated_array([10, 15, 1, 3, 8], 15)
        1
    """
    # TODO: Binary search determining which half is sorted
    # Hint: Check if left half is sorted, then check if target is in range
    pass


# ─── Test Cases ───

# Standard rotated array
print(search_rotated_array([10, 15, 1, 3, 8], 15))
# Expected: 1

# Target in second half
print(search_rotated_array([4, 5, 7, 9, 10, -1, 2], -1))
# Expected: 5

# Not rotated
print(search_rotated_array([1, 2, 3, 4, 5], 3))
# Expected: 2

# Target not found
print(search_rotated_array([10, 15, 1, 3, 8], 20))
# Expected: -1

# Single element
print(search_rotated_array([5], 5))
# Expected: 0

# Two elements rotated
print(search_rotated_array([2, 1], 1))
# Expected: 1
`,
      solutionCode: `def search_rotated_array(arr, target):
    """
    Search for target in a rotated sorted array with distinct elements.
    
    Time Complexity: O(log n)
    Space Complexity: O(1)
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        
        # Determine which half is sorted
        if arr[left] <= arr[mid]:
            # Left half is sorted
            if arr[left] <= target < arr[mid]:
                # Target in left half
                right = mid - 1
            else:
                # Target in right half
                left = mid + 1
        else:
            # Right half is sorted
            if arr[mid] < target <= arr[right]:
                # Target in right half
                left = mid + 1
            else:
                # Target in left half
                right = mid - 1
    
    return -1


# ─── Test Cases ───
print(search_rotated_array([10, 15, 1, 3, 8], 15))
# Expected: 1

print(search_rotated_array([4, 5, 7, 9, 10, -1, 2], -1))
# Expected: 5

print(search_rotated_array([1, 2, 3, 4, 5], 3))
# Expected: 2

print(search_rotated_array([10, 15, 1, 3, 8], 20))
# Expected: -1

print(search_rotated_array([5], 5))
# Expected: 0

print(search_rotated_array([2, 1], 1))
# Expected: 1
`,
    },
    {
      id: "find-minimum-rotated",
      slug: "find-minimum-rotated",
      title: "Find Minimum in Rotated Array",
      content: `## Find Minimum in Rotated Sorted Array

<!-- voice:section_check concept="Finding minimum in rotated array" -->

### Problem Statement

Find the minimum element in a sorted array that has been rotated.

### Examples

~~~
Input: [10, 15, 1, 3, 8]
Output: 1
~~~

~~~
Input: [4, 5, 7, 9, 10, -1, 2]
Output: -1
~~~

### Approach

The minimum element is the only element smaller than its previous element.

Binary search approach:
1. If array not rotated (arr[0] < arr[-1]), return arr[0]
2. At mid, check if it's the minimum (smaller than previous)
3. If arr[mid] > arr[right], minimum is in right half
4. Otherwise, minimum is in left half (including mid)

<!-- voice:key_insight insight="The minimum is in the unsorted half — if arr[mid] > arr[right], right half is unsorted, so minimum is there" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(log n)
- **Space:** O(1)`,
      starterCode: `def find_minimum_rotated(arr):
    """
    Find the minimum element in a rotated sorted array.
    
    Args:
        arr: Rotated sorted array
    
    Returns:
        int: Minimum element
    
    Example:
        >>> find_minimum_rotated([10, 15, 1, 3, 8])
        1
    """
    # TODO: Binary search to find minimum
    # Hint: Check if array is not rotated first; otherwise find unsorted half
    pass


# ─── Test Cases ───

# Standard rotated
print(find_minimum_rotated([10, 15, 1, 3, 8]))
# Expected: 1

# Rotated at different point
print(find_minimum_rotated([4, 5, 7, 9, 10, -1, 2]))
# Expected: -1

# Not rotated
print(find_minimum_rotated([1, 2, 3, 4, 5]))
# Expected: 1

# Single element
print(find_minimum_rotated([5]))
# Expected: 5

# Two elements
print(find_minimum_rotated([2, 1]))
# Expected: 1

# Rotated once
print(find_minimum_rotated([3, 1, 2]))
# Expected: 1
`,
      solutionCode: `def find_minimum_rotated(arr):
    """
    Find the minimum element in a rotated sorted array.
    
    Time Complexity: O(log n)
    Space Complexity: O(1)
    """
    if not arr:
        return None
    
    left, right = 0, len(arr) - 1
    
    # Array not rotated
    if arr[left] < arr[right]:
        return arr[left]
    
    while left < right:
        mid = left + (right - left) // 2
        
        # Check if mid is the minimum
        if mid > 0 and arr[mid] < arr[mid - 1]:
            return arr[mid]
        
        # Determine which half contains minimum
        if arr[mid] > arr[right]:
            # Minimum is in right half
            left = mid + 1
        else:
            # arr[mid] < arr[right], minimum is in left half (including mid)
            # Note: can't be mid+1 to right since arr[mid] <= arr[right]
            right = mid
    
    return arr[left]


# ─── Test Cases ───
print(find_minimum_rotated([10, 15, 1, 3, 8]))
# Expected: 1

print(find_minimum_rotated([4, 5, 7, 9, 10, -1, 2]))
# Expected: -1

print(find_minimum_rotated([1, 2, 3, 4, 5]))
# Expected: 1

print(find_minimum_rotated([5]))
# Expected: 5

print(find_minimum_rotated([2, 1]))
# Expected: 1

print(find_minimum_rotated([3, 1, 2]))
# Expected: 1
`,
    },
    {
      id: "find-number-infinite-array",
      slug: "find-number-infinite-array",
      title: "Find Number in Infinite Array",
      content: `## Find Number in Sorted Infinite Array

<!-- voice:section_check concept="Exponential search in infinite array" -->

### Problem Statement

Given a sorted array of infinite numbers (you don't know the size), search for a target value.

**Assumption:** Array is sorted in ascending order.

### Examples

~~~
Input: Infinite array [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...], target = 7
Output: 6 (index of 7)
~~~

### Approach

1. **Exponential Search**: Start with bound = 1, double until arr[bound] > target
2. Once bounds are found, perform standard binary search in that range

<!-- voice:key_insight insight="Use exponential search to find bounds (O(log p) where p is position), then binary search in that range" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(log p) where p is the position of the target
- **Space:** O(1)`,
      starterCode: `def search_infinite_array(arr, target):
    """
    Search for target in a sorted infinite array.
    
    Args:
        arr: Sorted array (treated as infinite)
        target: Value to search for
    
    Returns:
        int: Index of target, or -1 if not found
    
    Example:
        >>> search_infinite_array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 7)
        6
    """
    # TODO: Use exponential search to find bounds, then binary search
    # Hint: Start with bound=1, double until arr[bound] >= target
    pass


# ─── Test Cases ───

# Standard case (finite array used for testing)
print(search_infinite_array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 7))
# Expected: 6

# Target at beginning
print(search_infinite_array([1, 2, 3, 4, 5], 1))
# Expected: 0

# Target at end
print(search_infinite_array([1, 2, 3, 4, 5], 5))
# Expected: 4

# Target not found
print(search_infinite_array([1, 2, 3, 4, 5], 10))
# Expected: -1

# Single element
print(search_infinite_array([5], 5))
# Expected: 0

# Larger array
print(search_infinite_array(list(range(1, 101)), 50))
# Expected: 49
`,
      solutionCode: `def search_infinite_array(arr, target):
    """
    Search for target in a sorted infinite array.
    
    Time Complexity: O(log p) where p is the position of target
    Space Complexity: O(1)
    """
    # First, find the bounds using exponential search
    bound = 1
    
    # Double bound until we exceed target or array bounds
    while bound < len(arr) and arr[bound] < target:
        bound *= 2
    
    # Binary search between bound/2 and min(bound, len(arr)-1)
    left = bound // 2
    right = min(bound, len(arr) - 1)
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1


# ─── Test Cases ───
print(search_infinite_array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 7))
# Expected: 6

print(search_infinite_array([1, 2, 3, 4, 5], 1))
# Expected: 0

print(search_infinite_array([1, 2, 3, 4, 5], 5))
# Expected: 4

print(search_infinite_array([1, 2, 3, 4, 5], 10))
# Expected: -1

print(search_infinite_array([5], 5))
# Expected: 0

print(search_infinite_array(list(range(1, 101)), 50))
# Expected: 49
`,
    },
    {
      id: "modified-binary-search-checkpoint",
      slug: "modified-binary-search-checkpoint",
      title: "Module Checkpoint: Modified Binary Search",
      content: `## Module Checkpoint: Modified Binary Search

<!-- voice:checkpoint_intro -->

Excellent work on the Modified Binary Search module! Let's verify your understanding.

### Quick Review

You learned:
- **Order-agnostic** binary search
- Searching in **rotated sorted arrays**
- Finding **minimum in rotated arrays**
- **Exponential search** for infinite arrays

### Quiz

**Question 1:** In a rotated sorted array, which half is always sorted?
- A) Left half
- B) Right half
- C) At least one half
- D) Neither half

**Question 2:** What is the time complexity of exponential search?
- A) O(n)
- B) O(log n)
- C) O(log p) where p is position of target
- D) O(n log n)

**Question 3:** To determine if an array is ascending or descending, we compare:
- A) First two elements
- B) First and last elements
- C) Middle two elements
- D) All elements

**Question 4:** True or False: In a rotated sorted array with distinct elements, we can always determine which half contains the target.

**Question 5:** If arr[mid] > arr[right] in a rotated sorted array, where is the minimum?
- A) In the left half
- B) In the right half (including mid+1 to right)
- C) At arr[mid]
- D) Cannot determine

### Voice Summary

Your coach will ask you to:
- Walk through searching in a rotated array
- Explain exponential search and when to use it
- Find the minimum in a rotated sorted array
- Compare standard vs modified binary search

**You're mastering the Modified Binary Search pattern!**`,
    },
  ],
};
