import { Module } from "../types";

export const arraysStringsModule: Module = {
  id: "arrays-strings",
  title: "Arrays & Strings",
  description:
    "Learn the fundamentals of sequential data storage, master Python lists and strings, and discover the sliding window and two-pointer patterns that appear in dozens of interview problems.",
  lessons: [
    // ─── Lesson 1: Arrays & Lists Fundamentals ───
    {
      id: "arrays-lists-fundamentals",
      slug: "arrays-lists-fundamentals",
      title: "Arrays & Lists Fundamentals",
      content: `## What Is an Array?

An **array** is the most basic data structure in computer science. It stores elements in a **contiguous block of memory**, one after another — like houses on a street where each house has an address (index).

In Python, the built-in \`list\` is a **dynamic array** — it resizes automatically as you add elements. In lower-level languages like C or Java, arrays have a fixed size.

<!-- voice:section_check concept="arrays store elements contiguously by index" -->
## Python Lists: Your Go-To Array

\`\`\`python
# Creating lists
nums = [10, 20, 30, 40, 50]
names = ["Alice", "Bob", "Charlie"]
empty = []

# Access by index: O(1) — instant
print(nums[0])    # 10  (first element)
print(nums[-1])   # 50  (last element)

# Modify by index: O(1)
nums[2] = 99
print(nums)       # [10, 20, 99, 40, 50]

# Length: O(1)
print(len(nums))  # 5
\`\`\`

## Key Operations & Their Costs

| Operation | Python Syntax | Time |
|-----------|--------------|------|
| Access by index | \`lst[i]\` | O(1) |
| Set by index | \`lst[i] = val\` | O(1) |
| Append to end | \`lst.append(val)\` | O(1) amortized |
| Insert at position | \`lst.insert(i, val)\` | O(n) |
| Delete by index | \`lst.pop(i)\` | O(n) |
| Delete from end | \`lst.pop()\` | O(1) |
| Search (unsorted) | \`val in lst\` | O(n) |
| Length | \`len(lst)\` | O(1) |

<!-- voice:key_insight insight="Appending is O(1) but inserting in the middle is O(n) because elements must shift" -->

## Java Equivalent

\`\`\`java
// Java uses ArrayList for dynamic arrays
import java.util.ArrayList;

ArrayList<Integer> nums = new ArrayList<>();
nums.add(10);       // append: O(1) amortized
nums.get(0);        // access: O(1)
nums.set(0, 99);    // modify: O(1)
nums.size();        // length: O(1)
\`\`\`

**Same concept, different syntax.** Python lists and Java ArrayLists are both dynamic arrays under the hood.

## Slicing: Python's Superpower

Python lets you extract sub-arrays with **slice notation**:

\`\`\`python
nums = [0, 1, 2, 3, 4, 5, 6, 7]

print(nums[2:5])    # [2, 3, 4]   — index 2 up to (not including) 5
print(nums[:3])     # [0, 1, 2]   — first 3 elements
print(nums[5:])     # [5, 6, 7]   — from index 5 to end
print(nums[::2])    # [0, 2, 4, 6] — every other element
print(nums[::-1])   # [7, 6, 5, 4, 3, 2, 1, 0] — reversed
\`\`\`

Slicing creates a **new list** and takes O(k) time where k is the slice size.

<!-- voice:section_check concept="slicing creates a new list" -->
## When to Use Arrays/Lists

- **Ordered collection** of items where index access matters
- **Iterating** through all elements (cache-friendly, fast)
- **Stack-like** operations (append/pop from end)
- When you need the **simplest** data structure that works

## Try It Yourself

The exercise below asks you to implement two fundamental array operations: reversing an array in-place and finding the maximum element.
`,
      starterCode: `def reverse_array(arr):
    """
    Reverse the array in-place (modify the original, don't create a new one).

    Args:
        arr: List of elements

    Returns:
        The same list, reversed in-place

    Example:
        >>> nums = [1, 2, 3, 4, 5]
        >>> reverse_array(nums)
        [5, 4, 3, 2, 1]
    """
    # TODO: Use two pointers (left and right) to swap elements
    # Hint: Start left at 0, right at len(arr) - 1, swap and move inward
    pass


def find_max(arr):
    """
    Find the maximum value in a non-empty list without using built-in max().

    Args:
        arr: Non-empty list of numbers

    Returns:
        The largest number in the list

    Example:
        >>> find_max([3, 1, 4, 1, 5, 9])
        9
    """
    # TODO: Track the largest value seen so far
    # Hint: Initialize with arr[0], then compare each element
    pass


# ─── Test Cases ───
# Do not modify below this line

nums = [1, 2, 3, 4, 5]
print(reverse_array(nums))
# Expected: [5, 4, 3, 2, 1]

print(reverse_array([42]))
# Expected: [42]

print(reverse_array([]))
# Expected: []

print(find_max([3, 1, 4, 1, 5, 9, 2, 6]))
# Expected: 9

print(find_max([-5, -1, -10]))
# Expected: -1
`,
      solutionCode: `def reverse_array(arr):
    """
    Reverse the array in-place (modify the original, don't create a new one).

    Time Complexity: O(n) — visit each element once
    Space Complexity: O(1) — only using two pointer variables
    """
    left = 0
    right = len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    return arr
    # Alternative (Pythonic): arr.reverse(); return arr


def find_max(arr):
    """
    Find the maximum value in a non-empty list without using built-in max().

    Time Complexity: O(n) — one pass through the array
    Space Complexity: O(1) — single variable
    """
    if not arr:
        return None
    current_max = arr[0]
    for num in arr[1:]:
        if num > current_max:
            current_max = num
    return current_max
    # Alternative (Pythonic): return max(arr)


# ─── Test Cases ───
# Do not modify below this line

nums = [1, 2, 3, 4, 5]
print(reverse_array(nums))
# Expected: [5, 4, 3, 2, 1]

print(reverse_array([42]))
# Expected: [42]

print(reverse_array([]))
# Expected: []

print(find_max([3, 1, 4, 1, 5, 9, 2, 6]))
# Expected: 9

print(find_max([-5, -1, -10]))
# Expected: -1
`,
    },

    // ─── Lesson 2: Strings as Arrays ───
    {
      id: "strings-as-arrays",
      slug: "strings-as-arrays",
      title: "Strings as Arrays",
      content: `## Strings Are Character Arrays

In Python, a string is an **immutable sequence of characters**. You can index into it, slice it, and iterate over it — just like a list. The key difference: **you cannot modify a string in place**.

\`\`\`python
s = "hello"
print(s[0])      # 'h'
print(s[-1])     # 'o'
print(s[1:4])    # 'ell'
print(len(s))    # 5

# This FAILS — strings are immutable:
# s[0] = 'H'  → TypeError
\`\`\`

<!-- voice:section_check concept="strings are immutable sequences" -->
## Working Around Immutability

Since you can't modify strings directly, the common patterns are:

### 1. Build a new string from a list

\`\`\`python
# Convert to list, modify, join back
chars = list("hello")    # ['h', 'e', 'l', 'l', 'o']
chars[0] = 'H'
result = ''.join(chars)  # "Hello"
\`\`\`

### 2. Use string concatenation (careful — O(n) per concat!)

\`\`\`python
# Building a string with += is O(n^2) total
result = ""
for char in "hello":
    result += char.upper()   # Each += creates a new string!
\`\`\`

### 3. The Pythonic way — list comprehension + join

\`\`\`python
# O(n) total — much better
result = ''.join([char.upper() for char in "hello"])
\`\`\`

<!-- voice:key_insight insight="Always build strings with list + join, never with += in a loop" -->

## Common String Methods

| Method | What It Does | Example |
|--------|-------------|---------|
| \`s.lower()\` | Lowercase | \`"Hi".lower() → "hi"\` |
| \`s.upper()\` | Uppercase | \`"Hi".upper() → "HI"\` |
| \`s.strip()\` | Remove whitespace | \`" hi ".strip() → "hi"\` |
| \`s.split(sep)\` | Split into list | \`"a,b,c".split(",") → ["a","b","c"]\` |
| \`sep.join(lst)\` | Join list into string | \`",".join(["a","b"]) → "a,b"\` |
| \`s.isalpha()\` | All alphabetic? | \`"abc".isalpha() → True\` |
| \`s.isdigit()\` | All digits? | \`"123".isdigit() → True\` |
| \`s.find(sub)\` | Find substring index | \`"hello".find("ll") → 2\` |

## Java Comparison

\`\`\`java
// Java strings are also immutable
String s = "hello";
char c = s.charAt(0);           // 'h'
String sub = s.substring(1, 4); // "ell"
int len = s.length();           // 5

// Use StringBuilder for efficient building
StringBuilder sb = new StringBuilder();
for (char ch : s.toCharArray()) {
    sb.append(Character.toUpperCase(ch));
}
String result = sb.toString();  // "HELLO"
\`\`\`

<!-- voice:section_check concept="use StringBuilder/list+join for efficient string building" -->

## The Palindrome Check — A Classic String Problem

A **palindrome** reads the same forwards and backwards: "racecar", "level", "madam".

\`\`\`python
def is_palindrome(s):
    s = s.lower()
    return s == s[::-1]
\`\`\`

Simple, but \`s[::-1]\` creates a new string (O(n) space). The two-pointer approach uses O(1) space — you'll implement it in the exercise.

## Try It Yourself

Implement a palindrome checker using two pointers and a function that checks if two strings are anagrams.
`,
      starterCode: `def is_palindrome(s):
    """
    Check if a string is a palindrome using two pointers (O(1) extra space).
    Ignore case. Only consider alphabetic characters.

    Args:
        s: Input string

    Returns:
        True if s is a palindrome, False otherwise

    Example:
        >>> is_palindrome("Racecar")
        True
        >>> is_palindrome("hello")
        False
    """
    # TODO: Use two pointers (left, right) moving inward
    # Skip non-alpha characters, compare lowercase
    pass


def is_anagram(s1, s2):
    """
    Check if two strings are anagrams (same characters, different order).

    Args:
        s1: First string
        s2: Second string

    Returns:
        True if s1 and s2 are anagrams

    Example:
        >>> is_anagram("listen", "silent")
        True
    """
    # TODO: Count character frequencies in each string and compare
    # Hint: Use a dictionary to count characters
    pass


# ─── Test Cases ───
# Do not modify below this line

print(is_palindrome("racecar"))
# Expected: True

print(is_palindrome("hello"))
# Expected: False

print(is_palindrome("A man a plan a canal Panama"))
# Expected: True

print(is_palindrome(""))
# Expected: True

print(is_anagram("listen", "silent"))
# Expected: True

print(is_anagram("hello", "world"))
# Expected: False

print(is_anagram("", ""))
# Expected: True
`,
      solutionCode: `def is_palindrome(s):
    """
    Check if a string is a palindrome using two pointers (O(1) extra space).
    Ignore case. Only consider alphabetic characters.

    Time Complexity: O(n) — single pass with two pointers
    Space Complexity: O(1) — no extra data structures
    """
    left = 0
    right = len(s) - 1
    while left < right:
        # Skip non-alpha characters
        while left < right and not s[left].isalpha():
            left += 1
        while left < right and not s[right].isalpha():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True


def is_anagram(s1, s2):
    """
    Check if two strings are anagrams (same characters, different order).

    Time Complexity: O(n) — count chars in both strings
    Space Complexity: O(k) — k unique characters
    """
    if len(s1) != len(s2):
        return False
    freq = {}
    for char in s1:
        freq[char] = freq.get(char, 0) + 1
    for char in s2:
        freq[char] = freq.get(char, 0) - 1
    for count in freq.values():
        if count != 0:
            return False
    return True
    # Alternative (Pythonic): return sorted(s1) == sorted(s2)  # O(n log n)


# ─── Test Cases ───
# Do not modify below this line

print(is_palindrome("racecar"))
# Expected: True

print(is_palindrome("hello"))
# Expected: False

print(is_palindrome("A man a plan a canal Panama"))
# Expected: True

print(is_palindrome(""))
# Expected: True

print(is_anagram("listen", "silent"))
# Expected: True

print(is_anagram("hello", "world"))
# Expected: False

print(is_anagram("", ""))
# Expected: True
`,
    },

    // ─── Lesson 3: Two Pointers & Sliding Window ───
    {
      id: "two-pointers-sliding-window",
      slug: "two-pointers-sliding-window",
      title: "Two Pointers & Sliding Window",
      content: `## Two Essential Array Patterns

Two of the most powerful techniques for array problems are the **two-pointer** and **sliding window** patterns. Once you recognize them, many O(n^2) problems become O(n).

<!-- voice:section_check concept="two pointers and sliding window reduce nested loops" -->
## Pattern 1: Two Pointers

Use two pointers when you need to find a pair or compare elements from both ends.

### Example: Pair Sum in Sorted Array

\`\`\`python
def pair_sum_sorted(nums, target):
    """Find two numbers in a SORTED array that add to target."""
    left = 0
    right = len(nums) - 1

    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1      # Need a bigger sum
        else:
            right -= 1     # Need a smaller sum

    return [-1, -1]
\`\`\`

**Why it works:** In a sorted array, moving \`left\` right increases the sum, and moving \`right\` left decreases it. This gives us a guided search instead of checking all pairs.

| Approach | Time | Space |
|----------|------|-------|
| Brute force (all pairs) | O(n^2) | O(1) |
| Two pointers (sorted) | O(n) | O(1) |

<!-- voice:key_insight insight="Two pointers on a sorted array turns O(n^2) pair search into O(n)" -->

## Pattern 2: Sliding Window

Use a sliding window when you need to find a **subarray** (contiguous chunk) that satisfies a condition.

### Example: Maximum Sum of Subarray of Size k

\`\`\`python
def max_subarray_sum(nums, k):
    """Find the maximum sum of any contiguous subarray of size k."""
    if len(nums) < k:
        return 0

    # Calculate the sum of the first window
    window_sum = sum(nums[:k])
    max_sum = window_sum

    # Slide the window: add the next element, remove the first
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)

    return max_sum
\`\`\`

**The key insight:** Instead of recalculating the sum from scratch for every position (O(n*k)), we **slide** the window by adding one element and removing another (O(1) per step).

## Java Equivalent (Two Pointers)

\`\`\`java
public int[] pairSumSorted(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return new int[]{left, right};
        else if (sum < target) left++;
        else right--;
    }
    return new int[]{-1, -1};
}
\`\`\`

<!-- voice:section_check concept="sliding window avoids recalculating from scratch" -->

## When to Use Which

| Pattern | Use When | Examples |
|---------|---------|---------|
| Two Pointers | Sorted array, find pair/triplet | Pair sum, container with most water |
| Sliding Window (fixed) | Subarray of fixed size k | Max sum of k elements, averages |
| Sliding Window (variable) | Subarray satisfying condition | Smallest subarray with sum >= target |

## Try It Yourself

Implement a sliding window solution to find the maximum sum subarray and a two-pointer approach to remove duplicates from a sorted array.
`,
      starterCode: `def max_subarray_sum(nums, k):
    """
    Find the maximum sum of any contiguous subarray of size k.

    Args:
        nums: List of integers
        k: Window size (positive integer)

    Returns:
        Maximum sum of any k consecutive elements, or 0 if len(nums) < k

    Example:
        >>> max_subarray_sum([2, 1, 5, 1, 3, 2], 3)
        9  # subarray [5, 1, 3]
    """
    # TODO: Use the sliding window pattern
    # 1. Calculate sum of first k elements
    # 2. Slide: add nums[i], subtract nums[i-k]
    # 3. Track the maximum sum
    pass


def remove_duplicates(nums):
    """
    Remove duplicates from a SORTED array in-place.
    Return the number of unique elements.
    The first k elements of nums should contain the unique values.

    Args:
        nums: Sorted list of integers (modified in place)

    Returns:
        Number of unique elements

    Example:
        >>> nums = [1, 1, 2, 2, 3]
        >>> k = remove_duplicates(nums)
        >>> print(k, nums[:k])
        3 [1, 2, 3]
    """
    # TODO: Use two pointers — slow (write position) and fast (read position)
    # Hint: When fast finds a new value, write it at slow and advance slow
    pass


# ─── Test Cases ───
# Do not modify below this line

print(max_subarray_sum([2, 1, 5, 1, 3, 2], 3))
# Expected: 9

print(max_subarray_sum([1, 2, 3, 4, 5], 2))
# Expected: 9

print(max_subarray_sum([5], 2))
# Expected: 0

nums1 = [1, 1, 2, 2, 3, 3, 4]
print(remove_duplicates(nums1), nums1[:4])
# Expected: 4 [1, 2, 3, 4]

nums2 = [1, 1, 1]
print(remove_duplicates(nums2), nums2[:1])
# Expected: 1 [1]
`,
      solutionCode: `def max_subarray_sum(nums, k):
    """
    Find the maximum sum of any contiguous subarray of size k.

    Time Complexity: O(n) — single pass after initial window
    Space Complexity: O(1) — only tracking sums
    """
    if len(nums) < k:
        return 0

    window_sum = sum(nums[:k])
    max_sum = window_sum

    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)

    return max_sum


def remove_duplicates(nums):
    """
    Remove duplicates from a SORTED array in-place.

    Time Complexity: O(n) — single pass
    Space Complexity: O(1) — in-place modification
    """
    if not nums:
        return 0

    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]

    return slow + 1


# ─── Test Cases ───
# Do not modify below this line

print(max_subarray_sum([2, 1, 5, 1, 3, 2], 3))
# Expected: 9

print(max_subarray_sum([1, 2, 3, 4, 5], 2))
# Expected: 9

print(max_subarray_sum([5], 2))
# Expected: 0

nums1 = [1, 1, 2, 2, 3, 3, 4]
print(remove_duplicates(nums1), nums1[:4])
# Expected: 4 [1, 2, 3, 4]

nums2 = [1, 1, 1]
print(remove_duplicates(nums2), nums2[:1])
# Expected: 1 [1]
`,
    },

    // ─── Lesson 4: Module Checkpoint ───
    {
      id: "arrays-strings-checkpoint",
      slug: "arrays-strings-checkpoint",
      title: "Module Checkpoint: Arrays & Strings",
      content: `## Great Progress!

You've completed the Arrays & Strings module. Let's review what you've learned and make sure it's solid before moving on.

<!-- voice:section_check concept="module recap" -->
## What You've Mastered

1. **Array Fundamentals** — O(1) index access, O(1) append, O(n) insert/delete
2. **Strings as Immutable Arrays** — list + join for efficient building, two-pointer palindrome checks
3. **Two Pointers** — O(n) pair finding in sorted arrays
4. **Sliding Window** — O(n) subarray problems by sliding instead of recalculating

These patterns are the foundation for 30-40% of coding interview problems.

## Quick Quiz

**Question 1:** What is the time complexity of inserting an element at the beginning of a Python list?

A) O(1)
B) O(log n)
C) O(n)
D) O(n^2)

**Question 2:** True or False: "Building a string with += in a loop is efficient in Python."

Explain why or why not, and what the better alternative is.

**Question 3:** You have a sorted array \`[1, 3, 5, 7, 9]\` and need to find if any two numbers sum to 12. Which approach is best?

A) Nested loops — check all pairs
B) Two pointers — start from both ends
C) Sliding window — fixed size subarray
D) Binary search each complement

**Question 4:** In the sliding window pattern for max subarray sum of size k, why do we add \`nums[i]\` and subtract \`nums[i - k]\`? What would happen if we recalculated the sum from scratch each time?

**Question 5:** What does this code output?

\`\`\`python
s = "hello"
chars = list(s)
chars[0] = 'H'
result = ''.join(chars)
print(result)
\`\`\`

A) \`hello\` (strings are immutable, change is ignored)
B) \`Hello\`
C) TypeError
D) \`H\`

## Voice Summary

Your voice coach will ask you to explain the two-pointer and sliding window patterns in your own words. Try to include:
- When you'd use each pattern
- How they improve time complexity
- A simple example for each
`,
    },
  ],
};
