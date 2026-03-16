import { Module } from "../types";

export const cyclicSortModule: Module = {
  id: "cyclic-sort",
  title: "Cyclic Sort",
  description:
    "Master the cyclic sort pattern for sorting numbers in a given range [1..n] in O(n) time without extra space. Perfect for finding missing numbers, duplicates, and other range-based problems.",
  lessons: [
    {
      id: "cyclic-sort-intro",
      slug: "cyclic-sort-intro",
      title: "Introduction to Cyclic Sort",
      content: `## The Cyclic Sort Pattern

The **cyclic sort** pattern is used to sort arrays containing numbers in a given range (typically [1..n]) in **O(n)** time with **O(1)** space complexity.

<!-- voice:section_check concept="cyclic sort basic idea" -->

### Why Cyclic Sort?

When given an array of n numbers in the range [1..n], we can use the values themselves as indices to place each number in its correct position. This achieves sorting in a single pass without extra space.

### How It Works

1. Iterate through the array
2. For each element, if it's not in its correct position (i.e., nums[i] != i + 1 for range [1..n]):
   - Swap it with the element at its correct position
   - Repeat until the current position has the correct element
3. Move to the next position

### Pattern Structure

~~~
for i from 0 to n-1:
    while nums[i] != i + 1 and nums[i] is in valid range:
        swap nums[i] with nums[nums[i] - 1]
~~~

<!-- voice:key_insight insight="Each number tells us exactly where it belongs — we use the value as an index to place it correctly" -->

### When to Use

- Array contains numbers in range [1..n] or [0..n-1]
- Finding missing numbers in a sequence
- Finding duplicate numbers
- Problems requiring O(n) time and O(1) space

### Complexity

- **Time:** O(n) — each element is swapped at most once into its correct position
- **Space:** O(1) — in-place sorting`,
    },
    {
      id: "find-missing-number",
      slug: "find-missing-number",
      title: "Find Missing Number",
      content: `## Find the Missing Number

<!-- voice:section_check concept="cyclic sort for missing number" -->

### Problem Statement

Given an array containing n distinct numbers taken from the range [0..n], find the one number that is missing from the array.

### Examples

~~~
Input:  [4, 0, 3, 1]
Output: 2
Explanation: The array should contain [0..4], missing 2
~~~

~~~
Input:  [8, 3, 5, 2, 4, 6, 0, 1]
Output: 7
~~~

### Approach

Use cyclic sort to place each number in its correct index (number i should be at index i). After sorting, the first index that doesn't match its value is the missing number.

<!-- voice:key_insight insight="After cyclic sort, index i should contain value i. The first mismatch reveals the missing number" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) — cyclic sort is linear
- **Space:** O(1) — in-place`,
      starterCode: `def find_missing_number(nums):
    """
    Find the missing number in range [0..n] from the array.
    
    Args:
        nums: List of n distinct integers from range [0..n] with one missing
    
    Returns:
        int: The missing number
    
    Example:
        >>> find_missing_number([4, 0, 3, 1])
        2
    """
    # TODO: Use cyclic sort to place numbers at correct indices
    # Hint: Number i should be at index i
    pass


# ─── Test Cases ───

# Standard case
print(find_missing_number([4, 0, 3, 1]))
# Expected: 2

# Larger range
print(find_missing_number([8, 3, 5, 2, 4, 6, 0, 1]))
# Expected: 7

# Missing 0
print(find_missing_number([1, 2, 3]))
# Expected: 0

# Missing last number
print(find_missing_number([0, 1, 2]))
# Expected: 3

# Single element, missing 0
print(find_missing_number([1]))
# Expected: 0

# Single element, missing 1
print(find_missing_number([0]))
# Expected: 1
`,
      solutionCode: `def find_missing_number(nums):
    """
    Find the missing number in range [0..n] from the array.
    
    Time Complexity: O(n) — cyclic sort
    Space Complexity: O(1) — in-place
    """
    i = 0
    n = len(nums)
    
    while i < n:
        correct_idx = nums[i]
        # If the number is in valid range and not in correct position, swap
        if correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Find first index that doesn't match its value
    for i in range(n):
        if nums[i] != i:
            return i
    
    # If all match, missing number is n
    return n


# ─── Test Cases ───
print(find_missing_number([4, 0, 3, 1]))
# Expected: 2

print(find_missing_number([8, 3, 5, 2, 4, 6, 0, 1]))
# Expected: 7

print(find_missing_number([1, 2, 3]))
# Expected: 0

print(find_missing_number([0, 1, 2]))
# Expected: 3

print(find_missing_number([1]))
# Expected: 0

print(find_missing_number([0]))
# Expected: 1
`,
    },
    {
      id: "find-all-missing-numbers",
      slug: "find-all-missing-numbers",
      title: "Find All Missing Numbers",
      content: `## Find All Missing Numbers

<!-- voice:section_check concept="multiple missing numbers with cyclic sort" -->

### Problem Statement

Given an array of n integers where each number is in range [1..n], find all numbers that are missing from the array. Each number appears exactly once or not at all.

### Examples

~~~
Input:  [2, 3, 1, 8, 2, 3, 5, 1]
Output: [4, 6, 7]
Explanation: Numbers 4, 6, 7 are missing from range [1..8]
~~~

~~~
Input:  [2, 4, 1, 2]
Output: [3]
~~~

### Approach

Use cyclic sort to place each number at its correct index (number i at index i-1). After sorting, indices that don't contain the expected number reveal all missing numbers.

<!-- voice:key_insight insight="After placing each number at index i-1, indices with wrong values correspond to missing numbers" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) — cyclic sort
- **Space:** O(1) excluding output — in-place sorting`,
      starterCode: `def find_missing_numbers(nums):
    """
    Find all missing numbers in range [1..n] from the array.
    
    Args:
        nums: List of integers in range [1..n]
    
    Returns:
        List of missing numbers
    
    Example:
        >>> find_missing_numbers([2, 3, 1, 8, 2, 3, 5, 1])
        [4, 6, 7]
    """
    # TODO: Use cyclic sort, then find indices where value != index + 1
    # Hint: Number i should be at index i-1
    pass


# ─── Test Cases ───

# Multiple missing
print(find_missing_numbers([2, 3, 1, 8, 2, 3, 5, 1]))
# Expected: [4, 6, 7]

# Single missing
print(find_missing_numbers([2, 4, 1, 2]))
# Expected: [3]

# No missing
print(find_missing_numbers([1, 2, 3, 4]))
# Expected: []

# All missing
print(find_missing_numbers([2, 2, 2, 2]))
# Expected: [1, 3, 4]

# Empty
print(find_missing_numbers([]))
# Expected: []
`,
      solutionCode: `def find_missing_numbers(nums):
    """
    Find all missing numbers in range [1..n] from the array.
    
    Time Complexity: O(n) — cyclic sort
    Space Complexity: O(1) excluding output — in-place
    """
    n = len(nums)
    i = 0
    
    # Cyclic sort: place number i at index i-1
    while i < n:
        correct_idx = nums[i] - 1
        # If in valid range and not in correct position, swap
        if 0 <= correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Find all indices where value != index + 1
    missing = []
    for i in range(n):
        if nums[i] != i + 1:
            missing.append(i + 1)
    
    return missing


# ─── Test Cases ───
print(find_missing_numbers([2, 3, 1, 8, 2, 3, 5, 1]))
# Expected: [4, 6, 7]

print(find_missing_numbers([2, 4, 1, 2]))
# Expected: [3]

print(find_missing_numbers([1, 2, 3, 4]))
# Expected: []

print(find_missing_numbers([2, 2, 2, 2]))
# Expected: [1, 3, 4]

print(find_missing_numbers([]))
# Expected: []
`,
    },
    {
      id: "find-duplicate-number",
      slug: "find-duplicate-number",
      title: "Find Duplicate Number",
      content: `## Find the Duplicate Number

<!-- voice:section_check concept="finding duplicates with cyclic sort" -->

### Problem Statement

Given an array containing n+1 integers where each integer is between 1 and n (inclusive), prove that at least one duplicate number must exist. Assume there is only one duplicate number, find it.

### Examples

~~~
Input:  [1, 4, 4, 3, 2]
Output: 4
~~~

~~~
Input:  [2, 1, 3, 3, 5, 4]
Output: 3
~~~

### Approach

Use cyclic sort. Since numbers are in range [1..n] and we have n+1 numbers, when trying to place each number at its correct index, we'll encounter a situation where the correct position already has the correct number — that's our duplicate.

<!-- voice:key_insight insight="When trying to place a number at its correct index, if that index already has the correct value, we've found our duplicate" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) — cyclic sort
- **Space:** O(1) — in-place`,
      starterCode: `def find_duplicate(nums):
    """
    Find the duplicate number in array of n+1 integers in range [1..n].
    
    Args:
        nums: List of n+1 integers in range [1..n] with exactly one duplicate
    
    Returns:
        int: The duplicate number
    
    Example:
        >>> find_duplicate([1, 4, 4, 3, 2])
        4
    """
    # TODO: Use cyclic sort, return number when we try to place at already-correct index
    # Hint: If nums[i] should go at index j but nums[j] already equals nums[i], it's a duplicate
    pass


# ─── Test Cases ───

# Standard case
print(find_duplicate([1, 4, 4, 3, 2]))
# Expected: 4

# Duplicate at beginning
print(find_duplicate([2, 1, 3, 3, 5, 4]))
# Expected: 3

# Duplicate is 1
print(find_duplicate([1, 1, 2, 3, 4]))
# Expected: 1

# Duplicate is last number
print(find_duplicate([1, 2, 3, 4, 4]))
# Expected: 4

# Small array
print(find_duplicate([1, 1]))
# Expected: 1
`,
      solutionCode: `def find_duplicate(nums):
    """
    Find the duplicate number in array of n+1 integers in range [1..n].
    
    Time Complexity: O(n) — cyclic sort
    Space Complexity: O(1) — in-place
    """
    i = 0
    
    while i < len(nums):
        if nums[i] != i + 1:
            correct_idx = nums[i] - 1
            # If the correct position already has the same value, it's a duplicate
            if nums[i] == nums[correct_idx]:
                return nums[i]
            # Otherwise, swap to place it correctly
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    return -1


# ─── Test Cases ───
print(find_duplicate([1, 4, 4, 3, 2]))
# Expected: 4

print(find_duplicate([2, 1, 3, 3, 5, 4]))
# Expected: 3

print(find_duplicate([1, 1, 2, 3, 4]))
# Expected: 1

print(find_duplicate([1, 2, 3, 4, 4]))
# Expected: 4

print(find_duplicate([1, 1]))
# Expected: 1
`,
    },
    {
      id: "find-all-duplicates",
      slug: "find-all-duplicates",
      title: "Find All Duplicates",
      content: `## Find All Duplicates

<!-- voice:section_check concept="finding all duplicates with cyclic sort" -->

### Problem Statement

Given an array of n integers where each number is in range [1..n], find all numbers that appear twice in the array.

### Examples

~~~
Input:  [3, 4, 4, 5, 5]
Output: [4, 5]
~~~

~~~
Input:  [5, 4, 7, 2, 3, 5, 3]
Output: [5, 3]
~~~

### Approach

Use cyclic sort. When trying to place a number at its correct index, if that position already contains the same number, we've found a duplicate. Add it to results and continue.

<!-- voice:key_insight insight="Same approach as finding one duplicate, but we collect all duplicates found during the sort" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — cyclic sort
- **Space:** O(1) excluding output — in-place`,
      starterCode: `def find_all_duplicates(nums):
    """
    Find all numbers that appear twice in the array.
    
    Args:
        nums: List of integers in range [1..n]
    
    Returns:
        List of duplicate numbers
    
    Example:
        >>> find_all_duplicates([3, 4, 4, 5, 5])
        [4, 5]
    """
    # TODO: Use cyclic sort, collect all duplicates found
    # Hint: Same as finding one duplicate, but keep track of all found
    pass


# ─── Test Cases ───

# Multiple duplicates
print(find_all_duplicates([3, 4, 4, 5, 5]))
# Expected: [4, 5]

# Duplicates in different positions
print(find_all_duplicates([5, 4, 7, 2, 3, 5, 3]))
# Expected: [5, 3]

# No duplicates
print(find_all_duplicates([1, 2, 3, 4]))
# Expected: []

# All duplicates
print(find_all_duplicates([1, 1, 2, 2, 3, 3]))
# Expected: [1, 2, 3]

# Single element appearing multiple times
print(find_all_duplicates([2, 2, 2, 2]))
# Expected: [2]
`,
      solutionCode: `def find_all_duplicates(nums):
    """
    Find all numbers that appear twice in the array.
    
    Time Complexity: O(n) — cyclic sort
    Space Complexity: O(1) excluding output — in-place
    """
    duplicates = []
    i = 0
    
    while i < len(nums):
        correct_idx = nums[i] - 1
        # If not in correct position
        if nums[i] != nums[correct_idx]:
            # Swap to place it correctly
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            # Already in correct position, move on
            i += 1
    
    # After sorting, duplicates will be at wrong positions
    for i in range(len(nums)):
        if nums[i] != i + 1:
            duplicates.append(nums[i])
    
    return duplicates


# ─── Test Cases ───
print(find_all_duplicates([3, 4, 4, 5, 5]))
# Expected: [4, 5]

print(find_all_duplicates([5, 4, 7, 2, 3, 5, 3]))
# Expected: [5, 3]

print(find_all_duplicates([1, 2, 3, 4]))
# Expected: []

print(find_all_duplicates([1, 1, 2, 2, 3, 3]))
# Expected: [1, 2, 3]

print(find_all_duplicates([2, 2, 2, 2]))
# Expected: [2]
`,
    },
    {
      id: "cyclic-sort-checkpoint",
      slug: "cyclic-sort-checkpoint",
      title: "Module Checkpoint: Cyclic Sort",
      content: `## Module Checkpoint: Cyclic Sort

<!-- voice:checkpoint_intro -->

Excellent work on the Cyclic Sort module! Let's verify your understanding.

### Quick Review

You learned:
- **Cyclic sort** for sorting range [1..n] in O(n) time
- Finding **missing numbers** using index-based placement
- Finding **duplicate numbers** during the sort
- Handling **multiple** missing/duplicate numbers

### Quiz

**Question 1:** What is the time complexity of cyclic sort?
- A) O(n log n) — like comparison sorts
- B) O(n²) — nested loops
- C) O(n) — each element swapped at most once
- D) O(1) — constant time

**Question 2:** In cyclic sort for range [1..n], where should number 5 be placed?
- A) At index 5
- B) At index 4
- C) At index 6
- D) At index 0

**Question 3:** What condition indicates we've found a duplicate during cyclic sort?
- A) When nums[i] == i
- B) When trying to place a number at an index that already has that value
- C) When the array is fully sorted
- D) When nums[i] > n

**Question 4:** True or False: Cyclic sort requires O(n) extra space.

**Question 5:** After cyclic sort on [0..n-1] range, how do we find the missing number?
- A) Sum all elements and subtract from expected sum
- B) Find the first index where nums[i] != i
- C) Look for the largest number
- D) Check the last index

### Voice Summary

Your coach will ask you to:
- Explain cyclic sort in your own words
- Walk through finding a missing number step by step
- Describe when cyclic sort is the right choice vs other sorting algorithms

**Great job mastering this efficient sorting pattern!**`,
    },
  ],
};
