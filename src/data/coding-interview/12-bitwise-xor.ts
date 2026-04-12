import { Module } from "../types";

export const bitwiseXORModule: Module = {
  id: "bitwise-xor",
  title: "Bitwise XOR",
  description: "Leverage XOR properties to solve problems involving unique elements, bit manipulation, and binary transformations.",
  lessons: [
    {
      id: "bitwise-xor-intro",
      slug: "bitwise-xor-intro",
      title: "Introduction to Bitwise XOR",
      content: `# Bitwise XOR

The XOR (exclusive or) operator is a powerful tool for solving certain classes of problems with O(1) extra space. Understanding its properties unlocks elegant solutions.

## Key Properties of XOR

1. **Self-inverse:** \`a ^ a = 0\` — XOR-ing a number with itself gives zero.
2. **Identity:** \`a ^ 0 = a\` — XOR-ing with zero returns the original number.
3. **Commutative:** \`a ^ b = b ^ a\` — order does not matter.
4. **Associative:** \`(a ^ b) ^ c = a ^ (b ^ c)\` — grouping does not matter.

## The Classic Application

If you XOR all numbers in an array where every number appears **twice** except one, the pairs cancel out (property 1), leaving only the unique number:

\`\`\`python
def find_single(nums):
    result = 0
    for n in nums:
        result ^= n
    return result
\`\`\`

For \`[2, 3, 2, 4, 3]\`: \`2^3^2^4^3 = (2^2)^(3^3)^4 = 0^0^4 = 4\`.

## Bit Manipulation Basics in Python

- \`&\` (AND): both bits must be 1
- \`|\` (OR): at least one bit must be 1
- \`^\` (XOR): exactly one bit must be 1
- \`~\` (NOT): flip all bits
- \`<<\` (left shift): multiply by 2
- \`>>\` (right shift): divide by 2
- \`n & 1\`: check if the last bit is 1 (odd check)
- \`n & (n-1)\`: clear the lowest set bit

## When to Use XOR

- Finding unique/non-duplicate elements
- Computing complements
- Toggling bits
- Swapping values without a temporary variable: \`a ^= b; b ^= a; a ^= b\``,
    },
    {
      id: "bitwise-xor-single-number",
      slug: "bitwise-xor-single-number",
      title: "Single Number",
      content: `# Single Number

## Problem Statement

Given a non-empty array of integers where every element appears **twice** except for one, find that single element. Solve it in O(n) time with O(1) extra space.

## Examples

**Example 1:**
\`\`\`
Input: [2, 1, 4, 1, 2]
Output: 4
\`\`\`

**Example 2:**
\`\`\`
Input: [7, 9, 7]
Output: 9
\`\`\`

**Example 3:**
\`\`\`
Input: [1]
Output: 1
\`\`\`

## Approach

XOR all elements together. Since \`a ^ a = 0\` and \`a ^ 0 = a\`, all pairs cancel out, leaving only the unique element.

This works because:
- XOR is commutative and associative, so the order of operations does not matter.
- Every duplicate pair XORs to 0.
- The remaining element XORs with 0 to produce itself.

No sorting, no hash maps, no extra space needed.

**Time Complexity:** O(n) — single pass.
**Space Complexity:** O(1).`,
      starterCode: `def find_single_number(nums):
    # TODO: Find the number that appears only once
    pass

# Test cases
print(find_single_number([2, 1, 4, 1, 2]))
# Expected: 4

print(find_single_number([7, 9, 7]))
# Expected: 9

print(find_single_number([1]))
# Expected: 1
`,
      solutionCode: `def find_single_number(nums):
    result = 0
    for num in nums:
        result ^= num
    return result

# Test cases
print(find_single_number([2, 1, 4, 1, 2]))
# Expected: 4

print(find_single_number([7, 9, 7]))
# Expected: 9

print(find_single_number([1]))
# Expected: 1
`,
    },
    {
      id: "bitwise-xor-two-single-numbers",
      slug: "bitwise-xor-two-single-numbers",
      title: "Two Single Numbers",
      content: `# Two Single Numbers

## Problem Statement

Given an array where every element appears **twice** except for **two** elements that appear only once, find those two unique elements.

## Examples

**Example 1:**
\`\`\`
Input: [1, 4, 2, 1, 3, 5, 6, 2, 3, 5]
Output: [4, 6] (order may vary)
\`\`\`

**Example 2:**
\`\`\`
Input: [2, 1, 3, 2]
Output: [1, 3]
\`\`\`

## Approach

1. XOR all numbers. The result is \`a ^ b\` where \`a\` and \`b\` are the two unique numbers.
2. Find any set bit in this XOR result. This bit is set in one of \`a\` or \`b\` but not both (since their XOR produced a 1 at that position).
3. Use that bit to partition all numbers into two groups:
   - Group 1: numbers with that bit set.
   - Group 2: numbers without that bit set.
4. XOR each group separately. Each group contains one unique number plus pairs that cancel out.

The trick to find the rightmost set bit: \`diff_bit = xor_result & (-xor_result)\`.

**Time Complexity:** O(n) — two passes.
**Space Complexity:** O(1).`,
      starterCode: `def find_two_single_numbers(nums):
    # TODO: Find the two numbers that appear only once
    pass

# Test cases
print(find_two_single_numbers([1, 4, 2, 1, 3, 5, 6, 2, 3, 5]))
# Expected: [4, 6] (order may vary)

print(find_two_single_numbers([2, 1, 3, 2]))
# Expected: [1, 3] (order may vary)
`,
      solutionCode: `def find_two_single_numbers(nums):
    # Step 1: XOR all numbers to get a ^ b
    xor_all = 0
    for num in nums:
        xor_all ^= num

    # Step 2: Find a distinguishing bit (rightmost set bit)
    diff_bit = xor_all & (-xor_all)

    # Step 3: Partition and XOR each group
    num1, num2 = 0, 0
    for num in nums:
        if num & diff_bit:
            num1 ^= num
        else:
            num2 ^= num

    return [num1, num2]

# Test cases
print(find_two_single_numbers([1, 4, 2, 1, 3, 5, 6, 2, 3, 5]))
# Expected: [4, 6] (order may vary)

print(find_two_single_numbers([2, 1, 3, 2]))
# Expected: [1, 3] (order may vary)
`,
    },
    {
      id: "bitwise-xor-complement",
      slug: "bitwise-xor-complement",
      title: "Complement of Base 10 Number",
      content: `# Complement of Base 10 Number

## Problem Statement

Given a positive integer \`n\`, find its **bitwise complement**. The complement flips all bits in the binary representation of the number (only considering the significant bits, not leading zeros).

## Examples

**Example 1:**
\`\`\`
Input: 8 (binary: 1000)
Output: 7 (binary: 0111)
\`\`\`

**Example 2:**
\`\`\`
Input: 10 (binary: 1010)
Output: 5 (binary: 0101)
\`\`\`

**Example 3:**
\`\`\`
Input: 1 (binary: 1)
Output: 0 (binary: 0)
\`\`\`

## Approach

To flip all bits of a number, XOR it with a mask of all 1s that has the same number of bits.

1. Count the number of bits in \`n\` by finding \`bit_count = floor(log2(n)) + 1\` or by shifting.
2. Create a mask: \`(1 << bit_count) - 1\`. For 8 (4 bits), the mask is \`1111 = 15\`.
3. Return \`n ^ mask\`. This flips every significant bit.

Why XOR with all 1s works: \`1 ^ 1 = 0\` and \`0 ^ 1 = 1\`, so XOR with 1 flips the bit.

**Time Complexity:** O(b) where b is the number of bits.
**Space Complexity:** O(1).`,
      starterCode: `def bitwise_complement(n):
    # TODO: Return the complement of n (flip all significant bits)
    pass

# Test cases
print(bitwise_complement(8))
# Expected: 7

print(bitwise_complement(10))
# Expected: 5

print(bitwise_complement(1))
# Expected: 0
`,
      solutionCode: `def bitwise_complement(n):
    if n == 0:
        return 1

    # Count number of bits
    bit_count = 0
    temp = n
    while temp > 0:
        bit_count += 1
        temp >>= 1

    # Create mask of all 1s with same bit length
    mask = (1 << bit_count) - 1

    return n ^ mask

# Test cases
print(bitwise_complement(8))
# Expected: 7

print(bitwise_complement(10))
# Expected: 5

print(bitwise_complement(1))
# Expected: 0
`,
    },
    {
      id: "bitwise-xor-flip-invert",
      slug: "bitwise-xor-flip-invert",
      title: "Flip and Invert an Image",
      content: `# Flip and Invert an Image

## Problem Statement

Given a binary matrix (2D list of 0s and 1s), first flip it **horizontally** (reverse each row), then **invert** it (flip 0 to 1 and 1 to 0). Return the resulting matrix.

## Examples

**Example 1:**
\`\`\`
Input: [[1,1,0],[1,0,1],[0,0,0]]
Flip:  [[0,1,1],[1,0,1],[0,0,0]]
Invert:[[1,0,0],[0,1,0],[1,1,1]]
Output:[[1,0,0],[0,1,0],[1,1,1]]
\`\`\`

**Example 2:**
\`\`\`
Input: [[1,0],[0,1]]
Flip:  [[0,1],[1,0]]
Invert:[[1,0],[0,1]]
Output:[[1,0],[0,1]]
\`\`\`

## Approach

For each row:
1. **Reverse** the row.
2. **XOR each element with 1** to invert it (since \`0 ^ 1 = 1\` and \`1 ^ 1 = 0\`).

These two operations can be combined: for a row of length \`n\`, swap elements from both ends and XOR each with 1. If the row has an odd length, the middle element just gets XOR'd in place.

This approach modifies the matrix in place with no extra space beyond the output.

**Time Complexity:** O(n * m) where n is rows and m is columns.
**Space Complexity:** O(1) extra space (in-place modification).`,
      starterCode: `def flip_and_invert_image(matrix):
    # TODO: Flip horizontally and invert the binary matrix
    pass

# Test cases
print(flip_and_invert_image([[1,1,0],[1,0,1],[0,0,0]]))
# Expected: [[1,0,0],[0,1,0],[1,1,1]]

print(flip_and_invert_image([[1,0],[0,1]]))
# Expected: [[1,0],[0,1]]
`,
      solutionCode: `def flip_and_invert_image(matrix):
    for row in matrix:
        n = len(row)
        for i in range((n + 1) // 2):
            # Swap and invert simultaneously
            row[i], row[n - 1 - i] = row[n - 1 - i] ^ 1, row[i] ^ 1

    return matrix

# Test cases
print(flip_and_invert_image([[1,1,0],[1,0,1],[0,0,0]]))
# Expected: [[1,0,0],[0,1,0],[1,1,1]]

print(flip_and_invert_image([[1,0],[0,1]]))
# Expected: [[1,0],[0,1]]
`,
    },
    {
      id: "bitwise-xor-count-set-bits",
      slug: "bitwise-xor-count-set-bits",
      title: "Count Set Bits",
      content: `# Count Set Bits

## Problem Statement

Given a non-negative integer, count the number of **1-bits** (set bits) in its binary representation. This is also known as the **Hamming weight** or **population count**.

## Examples

**Example 1:**
\`\`\`
Input: 13 (binary: 1101)
Output: 3
\`\`\`

**Example 2:**
\`\`\`
Input: 255 (binary: 11111111)
Output: 8
\`\`\`

**Example 3:**
\`\`\`
Input: 0
Output: 0
\`\`\`

## Approach

**Method 1: Simple shift and count**
Repeatedly check the last bit with \`n & 1\`, then right-shift \`n\`. Count until \`n\` becomes 0.

**Method 2: Brian Kernighan's trick**
The expression \`n & (n - 1)\` clears the lowest set bit of \`n\`. Repeat until \`n\` is 0, counting each iteration. This runs in O(k) where k is the number of set bits (potentially faster than O(b)).

How it works: Subtracting 1 from \`n\` flips all bits from the rightmost set bit onward. AND-ing with the original clears that lowest set bit while preserving everything above it.

Example: \`12 & 11 = 1100 & 1011 = 1000\` (cleared the bit at position 2).

**Time Complexity:** O(k) where k is the number of set bits (Brian Kernighan) or O(b) for the shift method.
**Space Complexity:** O(1).`,
      starterCode: `def count_set_bits(n):
    # TODO: Count the number of 1-bits in n
    pass

# Test cases
print(count_set_bits(13))
# Expected: 3

print(count_set_bits(255))
# Expected: 8

print(count_set_bits(0))
# Expected: 0

print(count_set_bits(1))
# Expected: 1
`,
      solutionCode: `def count_set_bits(n):
    count = 0
    while n:
        n &= (n - 1)  # Clear the lowest set bit
        count += 1
    return count

# Test cases
print(count_set_bits(13))
# Expected: 3

print(count_set_bits(255))
# Expected: 8

print(count_set_bits(0))
# Expected: 0

print(count_set_bits(1))
# Expected: 1
`,
    },
  ],
};
