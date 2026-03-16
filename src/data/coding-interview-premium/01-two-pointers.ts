import { Module } from "../types";

export const twoPointersModule: Module = {
  id: "two-pointers",
  title: "Two Pointers",
  description:
    "Master the two pointers technique to efficiently solve problems involving sorted arrays, pair searching, and in-place array manipulation. This pattern reduces time complexity from O(n²) to O(n).",
  lessons: [
    {
      id: "two-pointers-intro",
      slug: "two-pointers-intro",
      title: "Introduction to Two Pointers",
      content: `## The Two Pointers Pattern

The **two pointers** technique uses two reference points (usually indices) that move through a data structure—most often a sorted array—to find pairs or subarrays that satisfy a condition.

<!-- voice:section_check concept="two pointers basic idea" -->

### Why Two Pointers?

A naive approach to finding a pair of elements that meet some criterion typically involves nested loops, giving **O(n²)** time. Two pointers exploit **sorted order** to shrink the search space at every step, reducing time to **O(n)**.

### How It Works

\`\`\`mermaid
graph LR
    subgraph Sorted Array
        A["1"] --- B["3"] --- C["5"] --- D["7"] --- E["9"] --- F["11"]
    end
    L["left -->"] -.-> A
    R["<-- right"] -.-> F
    style L fill:#4ade80,color:#000
    style R fill:#f59e0b,color:#000
\`\`\`

1. Place one pointer at the **start** and one at the **end** of a sorted array.
2. Evaluate the current pair.
3. If the result is too small, move the left pointer right (increase the sum).
4. If the result is too large, move the right pointer left (decrease the sum).
5. Stop when the pointers meet or cross.

### Variants

| Variant | Description |
|---------|-------------|
| **Opposite-direction** | One pointer starts at each end; they walk toward each other. |
| **Same-direction** | Both pointers start at one end; a fast pointer moves ahead. |
| **Three pointers** | Extension for problems like the Dutch National Flag. |

<!-- voice:key_insight insight="Two pointers only works when the array is sorted or can be sorted without penalty" -->

### When to Reach for Two Pointers

- The input is **sorted** (or you can sort it without penalty).
- You need to find a **pair / triplet** that satisfies a sum or difference constraint.
- You need to **partition** an array in-place.

### Complexity

Most two-pointer solutions run in **O(n)** time and **O(1)** extra space, making them far superior to hash-map or brute-force alternatives when the input is already sorted.

In the following lessons you will apply this pattern to five classic problems of increasing difficulty.`,
    },
    {
      id: "pair-with-target-sum",
      slug: "pair-with-target-sum",
      title: "Pair with Target Sum",
      content: `## Pair with Target Sum

<!-- voice:section_check concept="opposite-direction two pointers" -->

### Problem Statement

Given a **sorted** array of integers and a target sum, find **two numbers** in the array that add up to the target. Return their **indices** as a list \`[i, j]\` where \`i < j\`. If no such pair exists, return \`[-1, -1]\`.

### Examples

~~~
Input:  arr = [1, 2, 3, 4, 6], target = 6
Output: [1, 3]
Explanation: arr[1] + arr[3] = 2 + 4 = 6
~~~

~~~
Input:  arr = [2, 5, 9, 11], target = 11
Output: [0, 2]
Explanation: arr[0] + arr[2] = 2 + 9 = 11
~~~

~~~
Input:  arr = [1, 2, 3], target = 7
Output: [-1, -1]
~~~

### Approach

Since the array is sorted, place one pointer at the start and one at the end.
- If the sum of the two pointed-to values equals the target, return the indices.
- If the sum is less than the target, move the left pointer right.
- If the sum is greater, move the right pointer left.

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) — each pointer moves at most n steps.
- **Space:** O(1) — no extra data structures.`,
      starterCode: `def pair_with_target_sum(arr, target):
    """
    Find two numbers in a sorted array that add up to target.
    
    Args:
        arr: Sorted list of integers
        target: Target sum
    
    Returns:
        List of two indices [i, j] where arr[i] + arr[j] == target,
        or [-1, -1] if no such pair exists
    
    Example:
        >>> pair_with_target_sum([1, 2, 3, 4, 6], 6)
        [1, 3]
    """
    # TODO: Use two pointers starting at opposite ends
    # Hint: Move pointers based on whether current sum is too small or too large
    pass


# ─── Test Cases ───
# Do not modify below this line

# Normal case
print(pair_with_target_sum([1, 2, 3, 4, 6], 6))
# Expected: [1, 3]

# Different target
print(pair_with_target_sum([2, 5, 9, 11], 11))
# Expected: [0, 2]

# No solution exists
print(pair_with_target_sum([1, 2, 3], 7))
# Expected: [-1, -1]

# Edge case: single element
print(pair_with_target_sum([5], 5))
# Expected: [-1, -1]
`,
      solutionCode: `def pair_with_target_sum(arr, target):
    """
    Find two numbers in a sorted array that add up to target.
    
    Time Complexity: O(n) — each pointer moves at most n steps
    Space Complexity: O(1) — no extra data structures
    """
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            # Sum is too small, need larger values → move left right
            left += 1
        else:
            # Sum is too large, need smaller values → move right left
            right -= 1
    
    return [-1, -1]


# ─── Test Cases ───
print(pair_with_target_sum([1, 2, 3, 4, 6], 6))
# Expected: [1, 3]

print(pair_with_target_sum([2, 5, 9, 11], 11))
# Expected: [0, 2]

print(pair_with_target_sum([1, 2, 3], 7))
# Expected: [-1, -1]

print(pair_with_target_sum([5], 5))
# Expected: [-1, -1]
`,
    },
    {
      id: "remove-duplicates",
      slug: "remove-duplicates",
      title: "Remove Duplicates",
      content: `## Remove Duplicates from Sorted Array

<!-- voice:section_check concept="same-direction two pointers" -->

### Problem Statement

Given a **sorted** array, remove all duplicate values **in-place** so that each element appears only once. Return the **new length** of the array. The first \`k\` elements of the array should hold the unique values.

### Examples

~~~
Input:  [2, 3, 3, 3, 6, 9, 9]
Output: 4
Array becomes: [2, 3, 6, 9, ...]
~~~

~~~
Input:  [2, 2, 2, 11]
Output: 2
Array becomes: [2, 11, ...]
~~~

### Approach

- Use a **slow** pointer to track the position where the next unique element should go.
- Use a **fast** pointer to scan through the array.
- Whenever the fast pointer finds a value different from the value at the slow pointer, advance the slow pointer and copy the new value there.

<!-- voice:key_insight insight="The slow pointer marks the boundary of unique elements; fast finds new unique values" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) — single pass through the array.
- **Space:** O(1) — everything is done in-place.`,
      starterCode: `def remove_duplicates(arr):
    """
    Remove duplicates from sorted array in-place.
    Return the new length of the array with unique elements.
    
    Args:
        arr: Sorted list of integers (modified in-place)
    
    Returns:
        int: Length of array with unique elements
    
    Example:
        >>> remove_duplicates([2, 3, 3, 3, 6, 9, 9])
        4
    """
    # TODO: Use slow and fast pointers
    # Hint: slow tracks unique elements, fast scans for new values
    pass


# ─── Test Cases ───

# Normal case with duplicates
arr1 = [2, 3, 3, 3, 6, 9, 9]
print(remove_duplicates(arr1))
# Expected: 4

# All same elements
arr2 = [2, 2, 2, 11]
print(remove_duplicates(arr2))
# Expected: 2

# No duplicates
arr3 = [1, 2, 3, 4]
print(remove_duplicates(arr3))
# Expected: 4

# Empty array
arr4 = []
print(remove_duplicates(arr4))
# Expected: 0
`,
      solutionCode: `def remove_duplicates(arr):
    """
    Remove duplicates from sorted array in-place.
    Return the new length of the array with unique elements.
    
    Time Complexity: O(n) — single pass through array
    Space Complexity: O(1) — in-place modification
    """
    if not arr:
        return 0
    
    # slow marks the last unique element found
    slow = 0
    
    # fast scans for next unique element
    for fast in range(1, len(arr)):
        if arr[fast] != arr[slow]:
            # Found a new unique element
            slow += 1
            arr[slow] = arr[fast]
    
    # Length is index + 1
    return slow + 1


# ─── Test Cases ───
arr1 = [2, 3, 3, 3, 6, 9, 9]
print(remove_duplicates(arr1))
# Expected: 4

arr2 = [2, 2, 2, 11]
print(remove_duplicates(arr2))
# Expected: 2

arr3 = [1, 2, 3, 4]
print(remove_duplicates(arr3))
# Expected: 4

arr4 = []
print(remove_duplicates(arr4))
# Expected: 0
`,
    },
    {
      id: "squaring-sorted-array",
      slug: "squaring-sorted-array",
      title: "Squaring a Sorted Array",
      content: `## Squaring a Sorted Array

<!-- voice:section_check concept="two pointers from both ends" -->

### Problem Statement

Given a sorted array of integers (which may contain negative numbers), return a **new array** containing the squares of each number, also **sorted in ascending order**.

### Examples

~~~
Input:  [-2, -1, 0, 2, 3]
Output: [0, 1, 4, 4, 9]
~~~

~~~
Input:  [-3, -1, 0, 1, 2]
Output: [0, 1, 1, 4, 9]
~~~

### Approach

A naive approach would be to square everything and sort — O(n log n).

Instead, notice that the **largest squares** come from either the far-left (most negative) or far-right (most positive) end.

Use two pointers starting at both ends. Compare absolute values, place the larger square at the **end** of the result array, and move that pointer inward.

<!-- voice:key_insight insight="The largest squared value always comes from one of the ends (most negative or most positive)" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — single pass.
- **Space:** O(n) — for the output array (required by the problem).`,
      starterCode: `def make_squares(arr):
    """
    Return a new array with squares of input array, sorted.
    
    Args:
        arr: Sorted list of integers (may contain negatives)
    
    Returns:
        List of squares in sorted order
    
    Example:
        >>> make_squares([-2, -1, 0, 2, 3])
        [0, 1, 4, 4, 9]
    """
    # TODO: Use two pointers from both ends
    # Hint: Fill result array from the end with larger squares first
    pass


# ─── Test Cases ───

# Mixed negative and positive
print(make_squares([-2, -1, 0, 2, 3]))
# Expected: [0, 1, 4, 4, 9]

# More negatives
print(make_squares([-3, -1, 0, 1, 2]))
# Expected: [0, 1, 1, 4, 9]

# All positive
print(make_squares([1, 2, 3]))
# Expected: [1, 4, 9]

# All negative
print(make_squares([-5, -3, -2]))
# Expected: [4, 9, 25]
`,
      solutionCode: `def make_squares(arr):
    """
    Return a new array with squares of input array, sorted.
    
    Time Complexity: O(n) — single pass with two pointers
    Space Complexity: O(n) — output array
    """
    n = len(arr)
    squares = [0] * n
    left, right = 0, n - 1
    highest_index = n - 1
    
    while left <= right:
        left_sq = arr[left] ** 2
        right_sq = arr[right] ** 2
        
        if left_sq > right_sq:
            # Larger square comes from left (negative number)
            squares[highest_index] = left_sq
            left += 1
        else:
            # Larger or equal square comes from right
            squares[highest_index] = right_sq
            right -= 1
        
        highest_index -= 1
    
    return squares


# ─── Test Cases ───
print(make_squares([-2, -1, 0, 2, 3]))
# Expected: [0, 1, 4, 4, 9]

print(make_squares([-3, -1, 0, 1, 2]))
# Expected: [0, 1, 1, 4, 9]

print(make_squares([1, 2, 3]))
# Expected: [1, 4, 9]

print(make_squares([-5, -3, -2]))
# Expected: [4, 9, 25]
`,
    },
    {
      id: "triplet-sum-to-zero",
      slug: "triplet-sum-to-zero",
      title: "Triplet Sum to Zero",
      content: `## Triplet Sum to Zero

<!-- voice:section_check concept="two pointers with sorting" -->

### Problem Statement

Given an array of unsorted integers, find **all unique triplets** that sum to zero. The solution must not contain duplicate triplets.

### Examples

~~~
Input:  [-3, 0, 1, 2, -1, 1, -2]
Output: [[-3, 1, 2], [-2, 0, 2], [-2, 1, 1], [-1, 0, 1]]
~~~

### Approach

1. **Sort** the array first.
2. Iterate through the array. For each element \`arr[i]\`, you need two numbers from the rest that sum to \`-arr[i]\`.
3. Use the **pair with target sum** pattern (two pointers) on the subarray to the right of \`i\`.
4. Skip duplicate values for \`i\` and for both pointers to avoid duplicate triplets.

<!-- voice:key_insight insight="Sort first, then use two pointers for each element to find pairs that complete the triplet" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n²) — for each element, a two-pointer scan takes O(n).
- **Space:** O(n) — for sorting (ignoring the output list).`,
      starterCode: `def search_triplets(arr):
    """
    Find all unique triplets in the array that sum to zero.
    
    Args:
        arr: List of integers (unsorted)
    
    Returns:
        List of unique triplets [a, b, c] where a + b + c == 0
    
    Example:
        >>> search_triplets([-3, 0, 1, 2, -1, 1, -2])
        [[-3, 1, 2], [-2, 0, 2], [-2, 1, 1], [-1, 0, 1]]
    """
    # TODO: Sort array, then for each element use two pointers to find pairs
    # Hint: Skip duplicates at each level to avoid duplicate triplets
    pass


# ─── Test Cases ───

# Standard case
print(search_triplets([-3, 0, 1, 2, -1, 1, -2]))
# Expected: [[-3, 1, 2], [-2, 0, 2], [-2, 1, 1], [-1, 0, 1]]

# Fewer elements
print(search_triplets([-5, 2, -1, -2, 3]))
# Expected: [[-5, 2, 3], [-2, -1, 3]]

# All zeros
print(search_triplets([0, 0, 0]))
# Expected: [[0, 0, 0]]

# No solution
print(search_triplets([1, 2, 3]))
# Expected: []
`,
      solutionCode: `def search_triplets(arr):
    """
    Find all unique triplets in the array that sum to zero.
    
    Time Complexity: O(n²) — sorting O(n log n) + two-pointer scan O(n²)
    Space Complexity: O(n) — for sorting
    """
    arr.sort()
    triplets = []
    
    for i in range(len(arr) - 2):
        # Skip duplicate values for the first element
        if i > 0 and arr[i] == arr[i - 1]:
            continue
        
        # Use two pointers to find pair that sums to -arr[i]
        left, right = i + 1, len(arr) - 1
        target = -arr[i]
        
        while left < right:
            total = arr[left] + arr[right]
            
            if total == target:
                triplets.append([arr[i], arr[left], arr[right]])
                left += 1
                right -= 1
                
                # Skip duplicates for second element
                while left < right and arr[left] == arr[left - 1]:
                    left += 1
                # Skip duplicates for third element
                while left < right and arr[right] == arr[right + 1]:
                    right -= 1
            elif total < target:
                left += 1
            else:
                right -= 1
    
    return triplets


# ─── Test Cases ───
print(search_triplets([-3, 0, 1, 2, -1, 1, -2]))
# Expected: [[-3, 1, 2], [-2, 0, 2], [-2, 1, 1], [-1, 0, 1]]

print(search_triplets([-5, 2, -1, -2, 3]))
# Expected: [[-5, 2, 3], [-2, -1, 3]]

print(search_triplets([0, 0, 0]))
# Expected: [[0, 0, 0]]

print(search_triplets([1, 2, 3]))
# Expected: []
`,
    },
    {
      id: "dutch-national-flag",
      slug: "dutch-national-flag",
      title: "Dutch National Flag",
      content: `## Dutch National Flag Problem

<!-- voice:section_check concept="three pointers technique" -->

### Problem Statement

Given an array containing only **0s, 1s, and 2s**, sort it **in-place** so that all 0s come first, then all 1s, then all 2s. You must do this in a single pass.

This is known as the Dutch National Flag problem, originally proposed by Edsger Dijkstra.

### Examples

~~~
Input:  [1, 0, 2, 1, 0]
Output: [0, 0, 1, 1, 2]
~~~

~~~
Input:  [2, 2, 0, 1, 2, 0]
Output: [0, 0, 1, 2, 2, 2]
~~~

### Approach

- Use **three pointers**: \`low\`, \`mid\`, and \`high\`.
- \`low\` tracks the boundary for 0s, \`high\` tracks the boundary for 2s, and \`mid\` scans the array.
- If \`arr[mid] == 0\`: swap with \`arr[low]\`, advance both \`low\` and \`mid\`.
- If \`arr[mid] == 1\`: just advance \`mid\`.
- If \`arr[mid] == 2\`: swap with \`arr[high]\`, decrement \`high\` (do not advance \`mid\` because the swapped value needs inspection).

<!-- voice:key_insight insight="Three pointers partition the array into four zones: 0s, 1s, unknown, and 2s" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — single pass.
- **Space:** O(1) — in-place swaps.`,
      starterCode: `def dutch_flag_sort(arr):
    """
    Sort array of 0s, 1s, and 2s in-place using Dutch National Flag algorithm.
    
    Args:
        arr: List containing only 0s, 1s, and 2s (modified in-place)
    
    Returns:
        None (array is modified in-place)
    
    Example:
        >>> arr = [1, 0, 2, 1, 0]
        >>> dutch_flag_sort(arr)
        >>> arr
        [0, 0, 1, 1, 2]
    """
    # TODO: Implement three-pointer Dutch National Flag algorithm
    # Hint: low tracks 0s boundary, high tracks 2s boundary, mid scans
    pass


# ─── Test Cases ───

# Standard case
arr1 = [1, 0, 2, 1, 0]
dutch_flag_sort(arr1)
print(arr1)
# Expected: [0, 0, 1, 1, 2]

# More 2s
arr2 = [2, 2, 0, 1, 2, 0]
dutch_flag_sort(arr2)
print(arr2)
# Expected: [0, 0, 1, 2, 2, 2]

# Already sorted
arr3 = [0, 0, 1, 1, 2, 2]
dutch_flag_sort(arr3)
print(arr3)
# Expected: [0, 0, 1, 1, 2, 2]

# All same
arr4 = [1, 1, 1]
dutch_flag_sort(arr4)
print(arr4)
# Expected: [1, 1, 1]
`,
      solutionCode: `def dutch_flag_sort(arr):
    """
    Sort array of 0s, 1s, and 2s in-place using Dutch National Flag algorithm.
    
    Time Complexity: O(n) — single pass through array
    Space Complexity: O(1) — in-place swaps
    
    Partition zones:
    [0, low) → all 0s
    [low, mid) → all 1s
    [mid, high] → unknown (to be processed)
    (high, end] → all 2s
    """
    low, mid, high = 0, 0, len(arr) - 1
    
    while mid <= high:
        if arr[mid] == 0:
            # Found a 0, move to low section
            arr[low], arr[mid] = arr[mid], arr[low]
            low += 1
            mid += 1
        elif arr[mid] == 1:
            # 1 is in correct position, just advance
            mid += 1
        else:  # arr[mid] == 2
            # Found a 2, move to high section
            # Don't advance mid — swapped value needs checking
            arr[mid], arr[high] = arr[high], arr[mid]
            high -= 1


# ─── Test Cases ───
arr1 = [1, 0, 2, 1, 0]
dutch_flag_sort(arr1)
print(arr1)
# Expected: [0, 0, 1, 1, 2]

arr2 = [2, 2, 0, 1, 2, 0]
dutch_flag_sort(arr2)
print(arr2)
# Expected: [0, 0, 1, 2, 2, 2]

arr3 = [0, 0, 1, 1, 2, 2]
dutch_flag_sort(arr3)
print(arr3)
# Expected: [0, 0, 1, 1, 2, 2]

arr4 = [1, 1, 1]
dutch_flag_sort(arr4)
print(arr4)
# Expected: [1, 1, 1]
`,
    },
    {
      id: "two-pointers-checkpoint",
      slug: "two-pointers-checkpoint",
      title: "Module Checkpoint: Two Pointers",
      content: `## Module Checkpoint: Two Pointers

<!-- voice:checkpoint_intro -->

Congratulations on completing the Two Pointers module! Let's review what you've learned.

### Quick Review

In this module, you mastered:
- The **opposite-direction** two pointers pattern (pair with target sum)
- The **same-direction** two pointers pattern (remove duplicates)
- Combining **sorting with two pointers** (triplet sum)
- The **three pointers** technique (Dutch National Flag)

### Quiz

**Question 1:** What is the time complexity of the two pointers technique on a sorted array?
- A) O(n²) — requires nested loops
- B) O(n log n) — requires sorting first  
- C) O(n) — each pointer moves at most n steps
- D) O(1) — constant time lookup

**Question 2:** In the "Pair with Target Sum" problem, when should you move the left pointer right?
- A) When the current sum equals the target
- B) When the current sum is less than the target
- C) When the current sum is greater than the target
- D) Always move both pointers simultaneously

**Question 3:** The Dutch National Flag problem uses how many pointers?
- A) 1 pointer
- B) 2 pointers
- C) 3 pointers
- D) 4 pointers

**Question 4:** True or False: The two pointers technique works on unsorted arrays without any preprocessing.

**Question 5:** In the "Remove Duplicates" problem, what does the 'slow' pointer track?
- A) The end of the array
- B) The last position of a unique element
- C) The middle of the array
- D) The count of duplicates found

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize the two pointers pattern in your own words. Think about:
- When is this technique most useful?
- What's the difference between opposite-direction and same-direction pointers?
- Can you describe the Dutch National Flag algorithm?

**Take your time and good luck!**`,
    },
  ],
};
