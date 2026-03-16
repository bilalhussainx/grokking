import { Module } from "../types";

export const bitwiseXORModule: Module = {
  id: "bitwise-xor",
  title: "Bitwise XOR",
  description:
    "Master the Bitwise XOR pattern for finding single numbers, swapping without temporary variables, and solving unique bit manipulation problems efficiently.",
  lessons: [
    {
      id: "bitwise-xor-intro",
      slug: "bitwise-xor-intro",
      title: "Introduction to Bitwise XOR",
      content: `## The Bitwise XOR Pattern

**Bitwise XOR (\\^)** is a powerful operator with unique properties that make it ideal for solving specific problems like finding single numbers and swapping values.

<!-- voice:section_check concept="XOR basic properties" -->

### XOR Properties

| Property | Description |
|----------|-------------|
| **x ^ x = 0** | Any number XOR itself equals 0 |
| **x ^ 0 = x** | Any number XOR 0 equals itself |
| **Commutative** | a ^ b = b ^ a |
| **Associative** | (a ^ b) ^ c = a ^ (b ^ c) |

### Common XOR Patterns

~~~
# Find single number (all others appear twice)
result = 0
for num in nums:
    result ^= num
# result is the single number

# Swap two numbers without temp variable
a = a ^ b
b = a ^ b  # b = (a ^ b) ^ b = a
a = a ^ b  # a = (a ^ b) ^ a = b
~~~

### XOR Truth Table

| A | B | A ^ B |
|---|---|-------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

<!-- voice:key_insight insight="XOR cancels out pairs: a ^ a = 0. This makes it perfect for finding single numbers when all others appear twice." -->

### When to Use XOR

- Finding single number (all others appear twice)
- Finding two single numbers
- Swapping without temporary variable
- Bit manipulation problems
- Finding missing number in sequence

### Complexity

- **Time:** O(n) for single pass
- **Space:** O(1) — no extra space needed`,
    },
    {
      id: "single-number",
      slug: "single-number",
      title: "Single Number",
      content: `## Single Number (All Others Appear Twice)

<!-- voice:section_check concept="XOR for finding single number" -->

### Problem Statement

Given a non-empty array of integers where every element appears twice except for one, find that single one.

**Note:** Your algorithm should have linear runtime complexity and use only constant extra space.

### Examples

~~~
Input: [4, 1, 2, 1, 2]
Output: 4
Explanation: 4 appears once, 1 and 2 appear twice
~~~

~~~
Input: [2, 2, 1]
Output: 1
~~~

### Approach

Use XOR properties:
- a ^ a = 0 (cancels out pairs)
- a ^ 0 = a (keeps single number)
- XOR all numbers together, pairs cancel out, leaving the single number

<!-- voice:key_insight insight="XOR all numbers: pairs become 0, single number remains: (4^1^2^1^2) = 4^(1^1)^(2^2) = 4^0^0 = 4" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) — single pass
- **Space:** O(1) — only result variable`,
      starterCode: `def find_single_number(nums):
    """
    Find the single number that appears only once.
    All other numbers appear exactly twice.
    
    Args:
        nums: List of integers where every element appears twice except one
    
    Returns:
        int: The single number
    
    Example:
        >>> find_single_number([4, 1, 2, 1, 2])
        4
    """
    # TODO: Use XOR to find the single number
    # Hint: XOR all elements together, pairs will cancel out
    pass


# ─── Test Cases ───

# Standard case
print(find_single_number([4, 1, 2, 1, 2]))
# Expected: 4

# Simple case
print(find_single_number([2, 2, 1]))
# Expected: 1

# Single element
print(find_single_number([1]))
# Expected: 1

# Larger case
print(find_single_number([1, 3, 1, 2, 4, 3, 2]))
# Expected: 4

# Negative numbers
print(find_single_number([-1, -2, -1]))
# Expected: -2
`,
      solutionCode: `def find_single_number(nums):
    """
    Find the single number that appears only once.
    All other numbers appear exactly twice.
    
    Time Complexity: O(n) — single pass
    Space Complexity: O(1) — only result variable
    """
    result = 0
    for num in nums:
        result ^= num
    return result


# ─── Test Cases ───
print(find_single_number([4, 1, 2, 1, 2]))
# Expected: 4

print(find_single_number([2, 2, 1]))
# Expected: 1

print(find_single_number([1]))
# Expected: 1

print(find_single_number([1, 3, 1, 2, 4, 3, 2]))
# Expected: 4

print(find_single_number([-1, -2, -1]))
# Expected: -2
`,
    },
    {
      id: "two-single-numbers",
      slug: "two-single-numbers",
      title: "Two Single Numbers",
      content: `## Two Single Numbers

<!-- voice:section_check concept="XOR for finding two single numbers" -->

### Problem Statement

Given an array of numbers where exactly two elements appear once and all others appear twice, find those two single numbers.

### Examples

~~~
Input: [1, 4, 2, 1, 3, 5, 6, 2, 3, 5]
Output: [4, 6]
Explanation: 4 and 6 appear once, all others appear twice
~~~

~~~
Input: [2, 1, 3, 2]
Output: [1, 3]
~~~

### Approach

1. XOR all numbers to get combined result: \\\`x ^ y\\\`
2. Find any bit position where the two numbers differ (rightmost set bit)
3. Partition numbers into two groups based on that bit
4. XOR each group separately to find each single number

<!-- voice:key_insight insight="The XOR of all numbers gives x ^ y. Any set bit in this result means x and y differ at that position — use it to separate them" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — two passes through array
- **Space:** O(1) — constant extra space`,
      starterCode: `def find_two_single_numbers(nums):
    """
    Find two numbers that appear only once.
    All other numbers appear exactly twice.
    
    Args:
        nums: List of integers where exactly two elements appear once
    
    Returns:
        List of two integers, the single numbers
    
    Example:
        >>> find_two_single_numbers([1, 4, 2, 1, 3, 5, 6, 2, 3, 5])
        [4, 6]  # or [6, 4]
    """
    # TODO: Use XOR to find the two single numbers
    # Hint: 1) XOR all to get x ^ y, 2) Find rightmost set bit, 3) Partition and XOR
    pass


# ─── Test Cases ───

# Standard case
print(find_two_single_numbers([1, 4, 2, 1, 3, 5, 6, 2, 3, 5]))
# Expected: [4, 6] or [6, 4]

# Simple case
print(find_two_single_numbers([2, 1, 3, 2]))
# Expected: [1, 3] or [3, 1]

# Four elements
print(find_two_single_numbers([1, 2, 1, 3]))
# Expected: [2, 3] or [3, 2]

# With negative numbers
print(find_two_single_numbers([-1, -2, -1, 3, 2, 3]))
# Expected: [-2, 2] or [2, -2]
`,
      solutionCode: `def find_two_single_numbers(nums):
    """
    Find two numbers that appear only once.
    All other numbers appear exactly twice.
    
    Time Complexity: O(n) — two passes through array
    Space Complexity: O(1) — constant extra space
    """
    # Step 1: XOR all numbers to get x ^ y
    xor_all = 0
    for num in nums:
        xor_all ^= num
    
    # Step 2: Find rightmost set bit in xor_all
    # This is where x and y differ
    rightmost_set_bit = xor_all & -xor_all
    
    # Step 3: Partition numbers and XOR each group
    num1, num2 = 0, 0
    for num in nums:
        if num & rightmost_set_bit:
            num1 ^= num
        else:
            num2 ^= num
    
    return [num1, num2]


# ─── Test Cases ───
print(find_two_single_numbers([1, 4, 2, 1, 3, 5, 6, 2, 3, 5]))
# Expected: [4, 6] or [6, 4]

print(find_two_single_numbers([2, 1, 3, 2]))
# Expected: [1, 3] or [3, 1]

print(find_two_single_numbers([1, 2, 1, 3]))
# Expected: [2, 3] or [3, 2]

print(find_two_single_numbers([-1, -2, -1, 3, 2, 3]))
# Expected: [-2, 2] or [2, -2]
`,
    },
    {
      id: "flip-invert-image",
      slug: "flip-invert-image",
      title: "Flip and Invert Image",
      content: `## Flip and Invert Image

<!-- voice:section_check concept="Bitwise operations for image manipulation" -->

### Problem Statement

Given a binary matrix representing an image (0 = black, 1 = white), flip the image horizontally, then invert it.

**Flip horizontally:** Reverse each row
**Invert:** Replace 0 with 1 and 1 with 0

### Examples

~~~
Input: [[1, 0, 1], [1, 1, 0], [0, 1, 1]]
Flip:   [[1, 0, 1], [0, 1, 1], [1, 1, 0]]
Invert: [[0, 1, 0], [1, 0, 0], [0, 0, 1]]
Output: [[0, 1, 0], [1, 0, 0], [0, 0, 1]]
~~~

### Approach

1. For each row, reverse it (flip)
2. For each element, XOR with 1 (invert)

Optimization: Flip and invert in one pass using XOR.

<!-- voice:key_insight insight="XOR with 1 inverts a bit: 0^1=1, 1^1=0. Combine flip and invert in one operation." -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n × m) where n = rows, m = columns
- **Space:** O(1) — in-place modification (or O(n×m) for new matrix)`,
      starterCode: `def flip_and_invert_image(image):
    """
    Flip an image horizontally and then invert it.
    
    Args:
        image: 2D list of 0s and 1s
    
    Returns:
        2D list, flipped and inverted image
    
    Example:
        >>> flip_and_invert_image([[1, 0, 1], [1, 1, 0], [0, 1, 1]])
        [[0, 1, 0], [1, 0, 0], [0, 0, 1]]
    """
    # TODO: Flip each row horizontally, then invert (0->1, 1->0)
    # Hint: Use XOR (^ 1) to invert bits
    pass


# ─── Test Cases ───

# Standard case
print(flip_and_invert_image([[1, 0, 1], [1, 1, 0], [0, 1, 1]]))
# Expected: [[0, 1, 0], [1, 0, 0], [0, 0, 1]]

# Single row
print(flip_and_invert_image([[1, 1, 0, 0]]))
# Expected: [[1, 1, 0, 0]]

# 2x2 image
print(flip_and_invert_image([[1, 0], [0, 1]]))
# Expected: [[1, 0], [0, 1]]

# All same
print(flip_and_invert_image([[1, 1, 1], [0, 0, 0]]))
# Expected: [[0, 0, 0], [1, 1, 1]]

# Single element
print(flip_and_invert_image([[1]]))
# Expected: [[0]]
`,
      solutionCode: `def flip_and_invert_image(image):
    """
    Flip an image horizontally and then invert it.
    
    Time Complexity: O(n × m) where n = rows, m = columns
    Space Complexity: O(1) if in-place, O(n×m) for new matrix
    """
    if not image:
        return []
    
    rows = len(image)
    cols = len(image[0])
    
    result = []
    for row in image:
        # Flip (reverse) and invert (^ 1) in one step
        new_row = [pixel ^ 1 for pixel in reversed(row)]
        result.append(new_row)
    
    return result


# Alternative: In-place solution
def flip_and_invert_image_inplace(image):
    """
    Flip and invert image in-place.
    """
    for row in image:
        left, right = 0, len(row) - 1
        while left <= right:
            # Swap and invert in one operation
            # XOR with 1 inverts the bit
            row[left], row[right] = row[right] ^ 1, row[left] ^ 1
            left += 1
            right -= 1
    return image


# ─── Test Cases ───
print(flip_and_invert_image([[1, 0, 1], [1, 1, 0], [0, 1, 1]]))
# Expected: [[0, 1, 0], [1, 0, 0], [0, 0, 1]]

print(flip_and_invert_image([[1, 1, 0, 0]]))
# Expected: [[1, 1, 0, 0]]

print(flip_and_invert_image([[1, 0], [0, 1]]))
# Expected: [[1, 0], [0, 1]]

print(flip_and_invert_image([[1, 1, 1], [0, 0, 0]]))
# Expected: [[0, 0, 0], [1, 1, 1]]

print(flip_and_invert_image([[1]]))
# Expected: [[0]]
`,
    },
    {
      id: "bitwise-xor-checkpoint",
      slug: "bitwise-xor-checkpoint",
      title: "Module Checkpoint: Bitwise XOR",
      content: `## Module Checkpoint: Bitwise XOR

<!-- voice:checkpoint_intro -->

Great work on the Bitwise XOR module! Let's verify your understanding.

### Quick Review

You learned:
- **XOR properties**: x ^ x = 0, x ^ 0 = x
- Finding **single number** when all others appear twice
- Finding **two single numbers** using bit manipulation
- **Flip and invert** image using XOR

### Quiz

**Question 1:** What is the result of x ^ x?
- A) x
- B) 0
- C) 1
- D) 2x

**Question 2:** What is the result of x ^ 0?
- A) 0
- B) 1
- C) x
- D) -x

**Question 3:** When finding two single numbers, what does XOR of all numbers give us?
- A) The first single number
- B) The second single number
- C) x ^ y (both numbers XORed together)
- D) 0

**Question 4:** True or False: XOR is commutative and associative.

**Question 5:** How do you invert a bit using XOR?
- A) XOR with 0
- B) XOR with 1
- C) XOR with itself
- D) Cannot invert with XOR

### Voice Summary

Your coach will ask you to:
- Explain XOR properties and why they help find single numbers
- Walk through finding two single numbers step by step
- Describe real-world applications of XOR

**You're mastering the Bitwise XOR pattern!**`,
    },
  ],
};
