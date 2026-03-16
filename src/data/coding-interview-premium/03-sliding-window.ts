import { Module } from "../types";

export const slidingWindowModule: Module = {
  id: "sliding-window",
  title: "Sliding Window",
  description:
    "Master the sliding window technique for efficient processing of arrays and strings. Ideal for substring/subarray problems, reducing time complexity from O(n²) to O(n) or O(n log n).",
  lessons: [
    {
      id: "sliding-window-intro",
      slug: "sliding-window-intro",
      title: "Introduction to Sliding Window",
      content: `## The Sliding Window Pattern

The **sliding window** technique is used to process arrays or strings by maintaining a subset of elements (the "window") that satisfies certain conditions, then sliding this window across the data.

<!-- voice:section_check concept="sliding window basic concept" -->

### Why Sliding Window?

\`\`\`mermaid
graph LR
    subgraph "Array: [2, 1, 5, 1, 3, 2]"
        A["2"] --- B["1"] --- C["5"] --- D["1"] --- E["3"] --- F["2"]
    end
    W1["window k=3"] -.->|"step 1"| A
    W2["window k=3"] -.->|"step 2"| B
    W3["window k=3"] -.->|"step 3"| C
    style W1 fill:#6366f1,color:#fff
    style W2 fill:#818cf8,color:#fff
    style W3 fill:#a5b4fc,color:#fff
\`\`\`

Many problems require finding a **contiguous subarray or substring** that optimizes some criteria (maximum sum, specific character count, etc.). A naive approach would check all possible subarrays — O(n²) or worse. Sliding window reduces this to O(n) by reusing computations.

### Window Types

| Type | Description | When to Use |
|------|-------------|-------------|
| **Fixed Size** | Window has constant size k | Find max sum of k consecutive elements |
| **Dynamic Size** | Window expands/contracts based on conditions | Smallest subarray with sum ≥ target |
| **Two Windows** | Track two windows simultaneously | Longest substring with at most k distinct characters |

<!-- voice:key_insight insight="The key insight is that adjacent subarrays overlap significantly — sliding window avoids recomputing the overlapping portion" -->

### Pattern Structure

~~~
1. Initialize window boundaries (left = 0, right = 0)
2. Expand window by moving right pointer
3. When window violates condition, contract by moving left pointer
4. Track optimal window throughout
5. Return result
~~~

### Complexity

- **Time:** O(n) — each element is visited at most twice (once by right, once by left).
- **Space:** O(1) or O(k) — depends on what you track within the window.`,
    },
    {
      id: "max-sum-subarray-size-k",
      slug: "max-sum-subarray-size-k",
      title: "Maximum Sum Subarray of Size K",
      content: `## Maximum Sum Subarray of Size K

<!-- voice:section_check concept="fixed-size sliding window" -->

### Problem Statement

Given an array of integers and a number k, find the **maximum sum** of any contiguous subarray of size k.

### Examples

~~~
Input:  [2, 1, 5, 1, 3, 2], k = 3
Output: 9
Explanation: Subarray [5, 1, 3] has maximum sum 9
~~~

~~~
Input:  [2, 3, 4, 1, 5], k = 2
Output: 7
Explanation: Subarray [3, 4] has maximum sum 7
~~~

### Approach

**Brute Force:** Calculate sum of every subarray of size k — O(n × k).

**Sliding Window:**
1. Calculate sum of first k elements (initial window)
2. Slide window: add new element on right, subtract element leaving on left
3. Track maximum sum seen

<!-- voice:key_insight insight="When sliding the window, we only need to add the new element and subtract the leaving element — O(1) per slide" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) — single pass through array.
- **Space:** O(1) — only tracking current sum and max.`,
      starterCode: `def max_sum_subarray(arr, k):
    """
    Find maximum sum of any contiguous subarray of size k.
    
    Args:
        arr: List of integers
        k: Size of subarray
    
    Returns:
        int: Maximum sum of any k-length subarray
    
    Example:
        >>> max_sum_subarray([2, 1, 5, 1, 3, 2], 3)
        9
    """
    # TODO: Use sliding window of fixed size k
    # Hint: Calculate first window sum, then slide and update
    pass


# ─── Test Cases ───

# Standard case
print(max_sum_subarray([2, 1, 5, 1, 3, 2], 3))
# Expected: 9

# Different array
print(max_sum_subarray([2, 3, 4, 1, 5], 2))
# Expected: 7

# Single element windows
print(max_sum_subarray([1, 4, 2, 10], 1))
# Expected: 10

# Entire array as window
print(max_sum_subarray([1, 2, 3, 4], 4))
# Expected: 10

# Negative numbers included
print(max_sum_subarray([-1, 2, 3, -2, 5], 3))
# Expected: 6
`,
      solutionCode: `def max_sum_subarray(arr, k):
    """
    Find maximum sum of any contiguous subarray of size k.
    
    Time Complexity: O(n) — single pass
    Space Complexity: O(1) — only tracking sums
    """
    if k > len(arr) or k <= 0:
        return 0
    
    # Calculate sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide window: remove leftmost, add new right element
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i - k] + arr[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum


# ─── Test Cases ───
print(max_sum_subarray([2, 1, 5, 1, 3, 2], 3))
# Expected: 9

print(max_sum_subarray([2, 3, 4, 1, 5], 2))
# Expected: 7

print(max_sum_subarray([1, 4, 2, 10], 1))
# Expected: 10

print(max_sum_subarray([1, 2, 3, 4], 4))
# Expected: 10

print(max_sum_subarray([-1, 2, 3, -2, 5], 3))
# Expected: 6
`,
    },
    {
      id: "smallest-subarray-sum",
      slug: "smallest-subarray-sum",
      title: "Smallest Subarray with Given Sum",
      content: `## Smallest Subarray with a Given Sum

<!-- voice:section_check concept="dynamic-size sliding window" -->

### Problem Statement

Given an array of positive integers and a target sum S, find the **length** of the smallest contiguous subarray whose sum is greater than or equal to S. Return 0 if no such subarray exists.

### Examples

~~~
Input:  [2, 1, 5, 2, 3, 2], S = 7
Output: 2
Explanation: Subarray [5, 2] has sum 7 and length 2
~~~

~~~
Input:  [2, 1, 5, 2, 8], S = 7
Output: 1
Explanation: Single element [8] has sum ≥ 7
~~~

### Approach

**Dynamic Sliding Window:**
1. Expand window by moving right pointer until sum ≥ S
2. Once condition met, shrink from left to find minimum length
3. Track minimum length throughout
4. Repeat until right reaches end

<!-- voice:key_insight insight="Expand until condition is met, then shrink to find the minimum — this gives O(n) time for what seems like O(n²)" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — each element visited at most twice.
- **Space:** O(1) — only tracking sum and lengths.`,
      starterCode: `def smallest_subarray_with_sum(arr, s):
    """
    Find length of smallest subarray with sum >= s.
    
    Args:
        arr: List of positive integers
        s: Target sum
    
    Returns:
        int: Minimum length of subarray with sum >= s, or 0 if none exists
    
    Example:
        >>> smallest_subarray_with_sum([2, 1, 5, 2, 3, 2], 7)
        2
    """
    # TODO: Use dynamic sliding window
    # Hint: Expand until sum >= s, then shrink to find minimum
    pass


# ─── Test Cases ───

# Standard case
print(smallest_subarray_with_sum([2, 1, 5, 2, 3, 2], 7))
# Expected: 2

# Single element solution
print(smallest_subarray_with_sum([2, 1, 5, 2, 8], 7))
# Expected: 1

# Entire array needed
print(smallest_subarray_with_sum([1, 2, 3, 4, 5], 15))
# Expected: 5

# No solution possible
print(smallest_subarray_with_sum([1, 2, 3], 10))
# Expected: 0

# Single element meets target
print(smallest_subarray_with_sum([5], 5))
# Expected: 1
`,
      solutionCode: `def smallest_subarray_with_sum(arr, s):
    """
    Find length of smallest subarray with sum >= s.
    
    Time Complexity: O(n) — each element visited at most twice
    Space Complexity: O(1) — only tracking window state
    """
    min_length = float('inf')
    window_sum = 0
    window_start = 0
    
    for window_end in range(len(arr)):
        # Expand window by adding current element
        window_sum += arr[window_end]
        
        # Shrink window while condition is satisfied
        while window_sum >= s:
            min_length = min(min_length, window_end - window_start + 1)
            window_sum -= arr[window_start]
            window_start += 1
    
    return min_length if min_length != float('inf') else 0


# ─── Test Cases ───
print(smallest_subarray_with_sum([2, 1, 5, 2, 3, 2], 7))
# Expected: 2

print(smallest_subarray_with_sum([2, 1, 5, 2, 8], 7))
# Expected: 1

print(smallest_subarray_with_sum([1, 2, 3, 4, 5], 15))
# Expected: 5

print(smallest_subarray_with_sum([1, 2, 3], 10))
# Expected: 0

print(smallest_subarray_with_sum([5], 5))
# Expected: 1
`,
    },
    {
      id: "longest-substring-k-distinct",
      slug: "longest-substring-k-distinct",
      title: "Longest Substring with K Distinct Characters",
      content: `## Longest Substring with K Distinct Characters

<!-- voice:section_check concept="hash map with sliding window" -->

### Problem Statement

Given a string, find the **length** of the longest substring containing **no more than K distinct characters**.

### Examples

~~~
Input:  String = "araaci", K = 2
Output: 4
Explanation: "araa" has 2 distinct characters (a, r) and length 4
~~~

~~~
Input:  String = "araaci", K = 1
Output: 2
Explanation: "aa" is the longest substring with 1 distinct character
~~~

### Approach

1. Use a hash map to track character frequencies in the current window
2. Expand window by moving right pointer
3. When distinct characters exceed K, shrink from left until valid again
4. Track maximum valid window length

<!-- voice:key_insight insight="Use a hash map to count character frequencies — this lets us know exactly when we violate the K distinct constraint" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — each character visited at most twice.
- **Space:** O(k) — hash map holds at most k+1 characters.`,
      starterCode: `def longest_substring_k_distinct(s, k):
    """
    Find length of longest substring with at most k distinct characters.
    
    Args:
        s: Input string
        k: Maximum number of distinct characters allowed
    
    Returns:
        int: Length of longest valid substring
    
    Example:
        >>> longest_substring_k_distinct("araaci", 2)
        4
    """
    # TODO: Use sliding window with hash map for character counts
    # Hint: Track character frequencies, shrink when distinct count > k
    pass


# ─── Test Cases ───

# Standard case
print(longest_substring_k_distinct("araaci", 2))
# Expected: 4

# K = 1
print(longest_substring_k_distinct("araaci", 1))
# Expected: 2

# Longer string
print(longest_substring_k_distinct("cbbebi", 3))
# Expected: 5 ("cbbeb" or "bbebi")

# K >= distinct chars in string
print(longest_substring_k_distinct("abc", 5))
# Expected: 3

# Empty string
print(longest_substring_k_distinct("", 2))
# Expected: 0
`,
      solutionCode: `def longest_substring_k_distinct(s, k):
    """
    Find length of longest substring with at most k distinct characters.
    
    Time Complexity: O(n) — each character visited at most twice
    Space Complexity: O(k) — hash map holds at most k+1 characters
    """
    if k == 0 or not s:
        return 0
    
    char_frequency = {}
    max_length = 0
    window_start = 0
    
    for window_end in range(len(s)):
        # Add current character to frequency map
        right_char = s[window_end]
        char_frequency[right_char] = char_frequency.get(right_char, 0) + 1
        
        # Shrink window while we have more than k distinct characters
        while len(char_frequency) > k:
            left_char = s[window_start]
            char_frequency[left_char] -= 1
            if char_frequency[left_char] == 0:
                del char_frequency[left_char]
            window_start += 1
        
        # Update max length
        max_length = max(max_length, window_end - window_start + 1)
    
    return max_length


# ─── Test Cases ───
print(longest_substring_k_distinct("araaci", 2))
# Expected: 4

print(longest_substring_k_distinct("araaci", 1))
# Expected: 2

print(longest_substring_k_distinct("cbbebi", 3))
# Expected: 5

print(longest_substring_k_distinct("abc", 5))
# Expected: 3

print(longest_substring_k_distinct("", 2))
# Expected: 0
`,
    },
    {
      id: "fruits-into-baskets",
      slug: "fruits-into-baskets",
      title: "Fruits Into Baskets",
      content: `## Fruits Into Baskets (Longest Subarray with 2 Distinct)

<!-- voice:section_check concept="practical application of sliding window" -->

### Problem Statement

You are visiting a farm with a single row of fruit trees. Each tree produces a type of fruit. You have **two baskets**, and each basket can only hold **one type of fruit**. Starting from any tree, pick exactly one fruit from every tree while moving to the right, until you cannot pick more.

Find the **maximum number of fruits** you can pick.

### Examples

~~~
Input:  Fruit = ['A', 'B', 'C', 'A', 'C']
Output: 3
Explanation: Pick ['C', 'A', 'C'] — two types (A and C), length 3
~~~

~~~
Input:  Fruit = ['A', 'B', 'C', 'B', 'B', 'C']
Output: 5
Explanation: Pick ['B', 'C', 'B', 'B', 'C'] — two types (B and C), length 5
~~~

### Approach

This is equivalent to finding the **longest subarray with at most 2 distinct elements**.

Use sliding window with a frequency map:
1. Expand window until we have more than 2 types
2. Shrink from left until we have 2 types again
3. Track maximum window size

<!-- voice:key_insight insight="This problem maps directly to 'longest substring with K distinct' where K=2" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — single pass through trees.
- **Space:** O(1) — at most 3 types in the map (2 valid + 1 being removed).`,
      starterCode: `def max_fruits_in_baskets(fruits):
    """
    Find maximum number of fruits that can be collected with 2 baskets.
    Each basket holds one type of fruit.
    
    Args:
        fruits: List of characters representing fruit types
    
    Returns:
        int: Maximum fruits that can be collected
    
    Example:
        >>> max_fruits_in_baskets(['A', 'B', 'C', 'A', 'C'])
        3
    """
    # TODO: Find longest subarray with at most 2 distinct elements
    # Hint: Same pattern as longest substring with k distinct, where k=2
    pass


# ─── Test Cases ───

# Standard case
print(max_fruits_in_baskets(['A', 'B', 'C', 'A', 'C']))
# Expected: 3

# Better collection possible
print(max_fruits_in_baskets(['A', 'B', 'C', 'B', 'B', 'C']))
# Expected: 5

# All same type
print(max_fruits_in_baskets(['A', 'A', 'A', 'A']))
# Expected: 4

# Two types throughout
print(max_fruits_in_baskets(['A', 'B', 'A', 'B', 'A']))
# Expected: 5

# Single tree
print(max_fruits_in_baskets(['A']))
# Expected: 1
`,
      solutionCode: `def max_fruits_in_baskets(fruits):
    """
    Find maximum number of fruits that can be collected with 2 baskets.
    Each basket holds one type of fruit.
    
    Time Complexity: O(n) — single pass
    Space Complexity: O(1) — at most 3 types tracked
    """
    basket = {}  # fruit_type -> count
    max_fruits = 0
    window_start = 0
    
    for window_end in range(len(fruits)):
        # Add current fruit to basket
        fruit = fruits[window_end]
        basket[fruit] = basket.get(fruit, 0) + 1
        
        # Shrink while we have more than 2 types
        while len(basket) > 2:
            left_fruit = fruits[window_start]
            basket[left_fruit] -= 1
            if basket[left_fruit] == 0:
                del basket[left_fruit]
            window_start += 1
        
        # Update max
        max_fruits = max(max_fruits, window_end - window_start + 1)
    
    return max_fruits


# ─── Test Cases ───
print(max_fruits_in_baskets(['A', 'B', 'C', 'A', 'C']))
# Expected: 3

print(max_fruits_in_baskets(['A', 'B', 'C', 'B', 'B', 'C']))
# Expected: 5

print(max_fruits_in_baskets(['A', 'A', 'A', 'A']))
# Expected: 4

print(max_fruits_in_baskets(['A', 'B', 'A', 'B', 'A']))
# Expected: 5

print(max_fruits_in_baskets(['A']))
# Expected: 1
`,
    },
    {
      id: "sliding-window-checkpoint",
      slug: "sliding-window-checkpoint",
      title: "Module Checkpoint: Sliding Window",
      content: `## Module Checkpoint: Sliding Window

<!-- voice:checkpoint_intro -->

Excellent work on the Sliding Window module! Let's test your understanding.

### Quick Review

You mastered:
- **Fixed-size windows** for subarray sum problems
- **Dynamic windows** for variable-length problems
- Using **hash maps** to track window contents
- Recognizing when sliding window applies

### Quiz

**Question 1:** What is the time complexity of sliding window problems?
- A) O(n²) — checking all subarrays
- B) O(n log n) — requires sorting
- C) O(n) — each element visited at most twice
- D) O(1) — constant time

**Question 2:** In a fixed-size sliding window, what do you do when moving the window?
- A) Recalculate the entire window sum
- B) Add the new element and subtract the leaving element
- C) Sort the window contents
- D) Reset and start over

**Question 3:** When should you shrink a dynamic sliding window?
- A) When the window is smaller than target size
- B) When the window violates the problem constraint
- C) At every step
- D) Never — only expand

**Question 4:** True or False: Sliding window can only be used on sorted arrays.

**Question 5:** What data structure helps track distinct characters in a substring window?
- A) Array
- B) Stack
- C) Hash map / dictionary
- D) Queue

### Voice Summary

Your coach will ask you to explain:
- What's the difference between fixed and dynamic sliding windows?
- Why is sliding window O(n) when it seems like we're checking many subarrays?
- Give an example of a problem that CAN'T be solved with sliding window.

**Great progress — you're building powerful pattern recognition!**`,
    },
  ],
};
