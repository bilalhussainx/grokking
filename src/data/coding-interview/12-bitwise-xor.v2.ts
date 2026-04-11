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
      content: `# Bitwise XOR: The Self-Canceling Operator

\`\`\`concept
{"title": "XOR in One Sentence", "variant": "mental-model", "content": "XOR is a bit-level \\"odd-parity detector\\": it outputs 1 only when the number of 1-bits in a position is odd.  That single idea explains every super-power you’re about to see."}
\`\`\`

The XOR (\`^\`) operator is the Swiss-army knife of low-level programming interviews.  It runs in a single CPU cycle, needs no extra RAM, and—once you internalize four algebraic rules—lets you solve problems that stump candidates who reach instinctively for hash tables.

---

## The Four Algebraic Rules That Matter

| Property | Math | What it means in code |
|---|---|---|
| **Self-inverse** | \`a ^ a = 0\` | XOR-ing identical values *cancels* them. |
| **Identity** | \`a ^ 0 = a\` | Zero is a no-op. |
| **Commutative** | \`a ^ b = b ^ a\` | Order is irrelevant. |
| **Associative** | \`(a ^ b) ^ c = a ^ (b ^ c)\` | Parentheses are irrelevant. |

\`\`\`callout
{"type": "tip", "title": "Memory Hook", "content": "Think of XOR as a *toggle switch*.  Flipping twice returns you to the original state—exactly like a light switch."}
\`\`\`

---

## Instant Interview Win: Unique Number in O(1) Space

Given an array where every element appears **twice** except one, XOR-ing everything cancels the pairs and reveals the singleton.

\`\`\`playground
{"title": "Find the Lonely Integer", "language": "python", "code": "def find_single(nums):\\n    acc = 0\\n    for n in nums:\\n        acc ^= n\\n    return acc\\n\\nprint(find_single([2, 3, 2, 4, 3]))  # → 4", "runnable": true}
\`\`\`

\`\`\`algoviz
{"title": "How the pairs cancel", "type": "array", "data": [2, 3, 2, 4, 3],
 "frames": [
   {"highlight": [0], "label": "acc = 0 ^ 2 = 2", "stats": {"acc": 2}},
   {"highlight": [1], "label": "acc = 2 ^ 3 = 1", "stats": {"acc": 1}},
   {"highlight": [2], "label": "acc = 1 ^ 2 = 3  (first pair cancels)", "stats": {"acc": 3}},
   {"highlight": [3], "label": "acc = 3 ^ 4 = 7", "stats": {"acc": 7}},
   {"highlight": [4], "label": "acc = 7 ^ 3 = 4  (second pair cancels)", "stats": {"acc": 4}}
 ], "speed": 900}
\`\`\`

---

## Bitwise Toolbox (Python Cheatsheet)

| Operator | One-liner Effect |
|---|---|
| \`n & 1\` | Extract lowest bit (odd test) |
| \`n & (n-1)\` | Clear lowest set bit |
| \`n ^ (-n)\` | Isolate rightmost set bit (two’s-complement trick) |
| \`a ^= b; b ^= a; a ^= b\` | Swap without temp variable |

\`\`\`compare
{"variant": "before-after", "before": {"label": "Classic swap", "code": "tmp = a\\na   = b\\nb   = tmp"}, "after": {"label": "XOR swap", "code": "a ^= b\\nb ^= a\\na ^= b"}}
\`\`\`

---

## When to Reach for XOR in Interviews

1. **Unique / missing element** (exactly one duplicate parity).
2. **Toggle / flip bits** without branching.
3. **Checksum or parity** of a data stream.
4. **Encryption-lite** (re-apply same key to decrypt).
5. **Space-constrained environments** (embedded, constant-extra-memory problems).

\`\`\`quiz
{"title": "Quick Sanity Check", "questions": [
  {"question": "What is the outcome of \`a ^ a ^ b\`?", "options": ["0", "a", "b", "undefined"], "answer": 2, "explanation": "By self-inverse, \`a ^ a = 0\`; by identity, \`0 ^ b = b\`."},
  {"question": "Which statement is **always** true for any integer x?", "options": ["x ^ 1 == ~x", "x ^ x == 0", "x ^ (-1) == x+1", "x ^ 0 == 0"], "answer": 1, "explanation": "Self-inverse property guarantees \`x ^ x = 0\`."},
  {"question": "Why does the XOR swap trick avoid overflow?", "options": ["It uses bitwise ops only", "It masks carries", "It allocates extra bits", "It does not work for negatives"], "answer": 0, "explanation": "No arithmetic addition/subtraction means no carry bits and thus no overflow."}
]}
\`\`\`

---

## Key Takeaways

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "XOR outputs 1 when the count of 1-bits is odd—nothing more, nothing less.",
  "Four algebraic rules (self-inverse, identity, commutative, associative) unlock every interview pattern.",
  "The ‘canceling pairs’ trick gives O(n) time and O(1) space for the classic ‘lonely integer’ problem.",
  "XOR swap, parity checks, and toggles are one-liners that save both time and RAM.",
  "When you see *twice* vs *once* constraints, think XOR first—hash tables second."
]}
\`\`\``,
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
**Space Complexity:** O(1).

\`\`\`concept
{
  "title": "XOR Cancellation Magic",
  "variant": "mental-model",
  "content": "Think of XOR as a \\"toggle switch\\": each bit flips when XORed with 1 and stays the same when XORed with 0. When you XOR a number with itself, it's like flipping a switch twice — you end up where you started (0). The single number never gets \\"flipped back\\", so it remains in the final result."
}
\`\`\`

\`\`\`algoviz
{
  "title": "XOR in Action on [5, 3, 5]",
  "type": "array",
  "data": [5, 3, 5],
  "frames": [
    { "highlight": [0], "label": "Start with 0, XOR with 5 → 5", "stats": {"result": 5} },
    { "highlight": [1], "label": "5 ^ 3 = 6 (binary 110)", "stats": {"result": 6} },
    { "highlight": [2], "label": "6 ^ 5 = 3 (binary 011)", "stats": {"result": 3} }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Hash Set (O(n) time, O(n) space)",
    "code": "def singleNumber(nums):\\n    seen = set()\\n    for n in nums:\\n        if n in seen:\\n            seen.remove(n)\\n        else:\\n            seen.add(n)\\n    return seen.pop()"
  },
  "after": {
    "label": "XOR Trick (O(n) time, O(1) space)",
    "code": "def singleNumber(nums):\\n    unique = 0\\n    for n in nums:\\n        unique ^= n\\n    return unique"
  }
}
\`\`\`

\`\`\`trace
{
  "title": "Step-by-step XOR Trace",
  "language": "python",
  "code": "def singleNumber(nums):\\n    unique = 0\\n    for n in nums:\\n        unique ^= n\\n        print(f\\"After XOR with {n}: {unique}\\")\\n    return unique\\n\\nsingleNumber([4, 1, 2, 1, 2])",
  "frames": [
    { "line": 2, "vars": {"unique": 0}, "stdout": "" },
    { "line": 3, "vars": {"n": 4, "unique": 4}, "stdout": "After XOR with 4: 4\\n" },
    { "line": 3, "vars": {"n": 1, "unique": 5}, "stdout": "After XOR with 1: 5\\n" },
    { "line": 3, "vars": {"n": 2, "unique": 7}, "stdout": "After XOR with 2: 7\\n" },
    { "line": 3, "vars": {"n": 1, "unique": 6}, "stdout": "After XOR with 1: 6\\n" },
    { "line": 3, "vars": {"n": 2, "unique": 4}, "stdout": "After XOR with 2: 4\\n" },
    { "line": 4, "vars": {"unique": 4}, "stdout": "" }
  ],
  "speed": 800
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your XOR Intuition",
  "questions": [
    {
      "question": "What is the result of 7 ^ 7 ^ 3 ^ 3 ^ 9?",
      "options": ["0", "9", "18", "undefined"],
      "answer": 1,
      "explanation": "Pairs (7,7) and (3,3) cancel to 0, leaving 9 ^ 0 = 9."
    },
    {
      "question": "If the array were [2, 2, 2], what would XORing all elements yield?",
      "options": ["0", "2", "4", "6"],
      "answer": 1,
      "explanation": "2 ^ 2 = 0, then 0 ^ 2 = 2. Only an even number of duplicates cancels completely."
    },
    {
      "question": "Which property lets us ignore the order of elements?",
      "options": ["Associativity", "Commutativity", "Distributivity", "Transitivity"],
      "answer": 1,
      "explanation": "Commutativity means a ^ b = b ^ a, so we can XOR in any order."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Try It Yourself",
  "language": "python",
  "code": "def singleNumber(nums):\\n    unique = 0\\n    for n in nums:\\n        unique ^= n\\n    return unique\\n\\n# Change the list below and hit Run\\nprint(singleNumber([5, 5, 8, 9, 8]))",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "XORing duplicates cancels them to 0 because x ^ x = 0.",
    "The remaining unique element surfaces since x ^ 0 = x.",
    "Single pass and constant space make this the optimal solution.",
    "Works only when every other element appears exactly twice."
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "XOR Superpower",
  "variant": "mental-model",
  "content": "XOR is a bitwise magician: it makes identical numbers vanish (x ^ x = 0) while preserving the unique ones (x ^ 0 = x). When you XOR all numbers in our array, every duplicate pair cancels out, leaving only the XOR of the two unique numbers."
}
\`\`\`

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

The key insight is that we can use XOR properties to separate the two unique numbers. Here's the step-by-step strategy:

1. XOR all numbers. The result is \`a ^ b\` where \`a\` and \`b\` are the two unique numbers.
2. Find any set bit in this XOR result. This bit is set in one of \`a\` or \`b\` but not both.
3. Use that bit to partition all numbers into two groups.
4. XOR each group separately to find the unique numbers.

\`\`\`algoviz
{
  "title": "XOR Magic in Action",
  "type": "array",
  "data": [1, 4, 2, 1, 3, 5, 6, 2, 3, 5],
  "frames": [
    { "highlight": [0], "label": "Start: xor = 0", "stats": {"xor": 0} },
    { "highlight": [0,1], "label": "xor = 0 ^ 1 = 1", "stats": {"xor": 1} },
    { "highlight": [0,1,2], "label": "xor = 1 ^ 4 = 5", "stats": {"xor": 5} },
    { "highlight": [0,1,2,3], "label": "xor = 5 ^ 2 = 7", "stats": {"xor": 7} },
    { "highlight": [0,1,2,3,4], "label": "xor = 7 ^ 1 = 6", "stats": {"xor": 6} },
    { "highlight": [0,1,2,3,4,5], "label": "xor = 6 ^ 3 = 5", "stats": {"xor": 5} },
    { "highlight": [0,1,2,3,4,5,6], "label": "xor = 5 ^ 5 = 0", "stats": {"xor": 0} },
    { "highlight": [0,1,2,3,4,5,6,7], "label": "xor = 0 ^ 6 = 6", "stats": {"xor": 6} },
    { "highlight": [0,1,2,3,4,5,6,7,8], "label": "xor = 6 ^ 2 = 4", "stats": {"xor": 4} },
    { "highlight": [0,1,2,3,4,5,6,7,8,9], "label": "xor = 4 ^ 3 = 7", "stats": {"xor": 7} },
    { "highlight": [0,1,2,3,4,5,6,7,8,9], "label": "Final: xor = 7 ^ 5 = 2", "stats": {"xor": 2} }
  ],
  "speed": 1000
}
\`\`\`

The trick to find the rightmost set bit: \`diff_bit = xor_result & (-xor_result)\`.

\`\`\`trace
{
  "title": "Finding the Two Unique Numbers",
  "language": "python",
  "code": "def find_two_single_numbers(nums):\\n    # Step 1: XOR all numbers\\n    xor_all = 0\\n    for num in nums:\\n        xor_all ^= num\\n    \\n    # Step 2: Find rightmost set bit\\n    diff_bit = xor_all & (-xor_all)\\n    \\n    # Step 3: Partition into two groups\\n    group1 = group2 = 0\\n    for num in nums:\\n        if num & diff_bit:\\n            group1 ^= num\\n        else:\\n            group2 ^= num\\n    \\n    return [group1, group2]\\n\\n# Test with example\\nnums = [1, 4, 2, 1, 3, 5, 6, 2, 3, 5]\\nresult = find_two_single_numbers(nums)\\nprint(f\\"Unique numbers: {result}\\")",
  "frames": [
    { "line": 1, "vars": {"nums": [1, 4, 2, 1, 3, 5, 6, 2, 3, 5]}, "note": "Starting with array", "stdout": "" },
    { "line": 4, "vars": {"xor_all": 0}, "note": "Initialize XOR result", "stdout": "" },
    { "line": 5, "vars": {"xor_all": 2}, "note": "After XORing all numbers", "stdout": "" },
    { "line": 8, "vars": {"diff_bit": 2}, "note": "Found differentiating bit", "stdout": "" },
    { "line": 11, "vars": {"group1": 4, "group2": 6}, "note": "Partitioned and XORed groups", "stdout": "" },
    { "line": 16, "vars": {}, "note": "Returning result", "stdout": "Unique numbers: [4, 6]\\n" }
  ],
  "speed": 800
}
\`\`\`

**Time Complexity:** O(n) — two passes.
**Space Complexity:** O(1).

\`\`\`quiz
{
  "title": "Test Your XOR Understanding",
  "questions": [
    {
      "question": "Why does XORing all numbers cancel out duplicates?",
      "options": ["XOR is commutative", "XOR has self-inverse property: x ^ x = 0", "XOR is associative", "XOR preserves bits"],
      "answer": 1,
      "explanation": "The self-inverse property x ^ x = 0 means identical numbers cancel out when XORed together."
    },
    {
      "question": "What does xor_result & (-xor_result) give us?",
      "options": ["The leftmost set bit", "All set bits", "The rightmost set bit", "The complement"],
      "answer": 2,
      "explanation": "This bit manipulation trick isolates the rightmost set bit, which helps partition numbers into two groups."
    },
    {
      "question": "After partitioning by a set bit, what guarantees each group has one unique number?",
      "options": ["The bit differs between the two unique numbers", "XOR is commutative", "Duplicates always pair up", "The array length is even"],
      "answer": 0,
      "explanation": "Since we chose a bit that differs between the two unique numbers, they must fall into different groups."
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Bit Manipulation Trick",
  "content": "The expression \`x & (-x)\` is a classic bit hack that isolates the rightmost set bit. It works because in two's complement representation, -x equals ~x + 1, which flips all bits after the rightmost set bit."
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "XOR's self-inverse property (x ^ x = 0) makes it perfect for finding unique elements",
    "When two unique numbers exist, their XOR reveals bits where they differ",
    "Partitioning by a differing bit separates the unique numbers into different groups",
    "This technique achieves O(n) time and O(1) space complexity"
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "Bitwise Complement vs. 1's Complement",
  "variant": "mental-model",
  "content": "The bitwise complement operation flips every significant bit of a number. This is equivalent to the 1's complement in binary arithmetic. Unlike 2's complement (used for negative numbers), this operation simply inverts each bit without adding 1, making it perfect for XOR-based solutions."
}
\`\`\`

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

\`\`\`trace
{
  "title": "Finding Complement of 10",
  "language": "python",
  "code": "def find_complement(n):\\n    # Step 1: Count bits\\n    bit_count = 0\\n    temp = n\\n    while temp > 0:\\n        bit_count += 1\\n        temp >>= 1\\n    \\n    # Step 2: Create mask\\n    mask = (1 << bit_count) - 1\\n    \\n    # Step 3: XOR to flip bits\\n    return n ^ mask\\n\\n# Test with n = 10\\nresult = find_complement(10)\\nprint(f\\"Complement of 10 is: {result}\\")",
  "frames": [
    {"line": 1, "vars": {"n": 10, "bit_count": 0, "temp": 10}, "note": "n = 10 (binary: 1010)", "stdout": ""},
    {"line": 6, "vars": {"n": 10, "bit_count": 1, "temp": 5}, "note": "First iteration: temp = 5", "stdout": ""},
    {"line": 6, "vars": {"n": 10, "bit_count": 2, "temp": 2}, "note": "Second iteration: temp = 2", "stdout": ""},
    {"line": 6, "vars": {"n": 10, "bit_count": 3, "temp": 1}, "note": "Third iteration: temp = 1", "stdout": ""},
    {"line": 6, "vars": {"n": 10, "bit_count": 4, "temp": 0}, "note": "Fourth iteration: temp = 0, done", "stdout": ""},
    {"line": 10, "vars": {"n": 10, "bit_count": 4, "mask": 15}, "note": "mask = (1 << 4) - 1 = 15 (1111)", "stdout": ""},
    {"line": 13, "vars": {"n": 10, "mask": 15, "result": 5}, "note": "10 ^ 15 = 5 (0101)", "stdout": "Complement of 10 is: 5"}
  ],
  "speed": 800
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naive String Approach",
    "code": "def complement_naive(n):\\n    # Convert to binary string\\n    binary = bin(n)[2:]\\n    \\n    # Flip each bit manually\\n    flipped = ''\\n    for bit in binary:\\n        if bit == '0':\\n            flipped += '1'\\n        else:\\n            flipped += '0'\\n    \\n    # Convert back to integer\\n    return int(flipped, 2)"
  },
  "after": {
    "label": "Optimized XOR Approach",
    "code": "def find_complement(n):\\n    if n == 0:\\n        return 1\\n    \\n    # Find number of bits\\n    bit_length = n.bit_length()\\n    \\n    # Create mask and XOR\\n    mask = (1 << bit_length) - 1\\n    return n ^ mask"
  }
}
\`\`\`

**Time Complexity:** O(b) where b is the number of bits.
**Space Complexity:** O(1).

\`\`\`quiz
{
  "title": "Complement Fundamentals",
  "questions": [
    {
      "question": "What is the bitwise complement of 7 (binary: 111)?",
      "options": ["0", "1", "2", "4"],
      "answer": 0,
      "explanation": "7 in binary is 111. Flipping all bits gives 000, which is 0 in decimal."
    },
    {
      "question": "Why do we use XOR with a mask of all 1s to find the complement?",
      "options": ["XOR is faster than other operations", "1 ^ 1 = 0 and 0 ^ 1 = 1", "It preserves the original value", "It handles negative numbers"],
      "answer": 1,
      "explanation": "XOR with 1 flips bits because 1 ^ 1 = 0 and 0 ^ 1 = 1, which is exactly what we need for complement."
    },
    {
      "question": "For the number 12 (binary: 1100), what mask should we use?",
      "options": ["7 (0111)", "15 (1111)", "3 (0011)", "31 (11111)"],
      "answer": 1,
      "explanation": "12 requires 4 bits (1100), so we need a 4-bit mask of all 1s: 15 (1111)."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Complement Calculator",
  "language": "python",
  "code": "def find_complement(n):\\n    \\"\\"\\"Find the bitwise complement of a positive integer.\\"\\"\\"\\n    if n == 0:\\n        return 1\\n    \\n    # Calculate number of bits needed\\n    bit_length = n.bit_length()\\n    \\n    # Create mask of all 1s with same length\\n    mask = (1 << bit_length) - 1\\n    \\n    # XOR to flip all bits\\n    return n ^ mask\\n\\n# Test the function\\ntest_numbers = [1, 2, 5, 8, 10, 15, 16, 31]\\n\\nfor num in test_numbers:\\n    comp = find_complement(num)\\n    print(f\\"Number: {num:2d}, Binary: {num:>5b}, Complement: {comp:2d}, Binary: {comp:>5b}\\")",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The bitwise complement flips all significant bits of a number (0→1, 1→0)",
    "XOR with a mask of all 1s efficiently computes the complement: n ^ ((1 << bits) - 1)",
    "The mask must have the same bit length as the original number to avoid flipping leading zeros",
    "This technique runs in O(b) time where b is the number of bits, using O(1) space"
  ]
}
\`\`\``,
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

\`\`\`concept
{"title": "Two-Step Transformation", "variant": "mental-model", "content": "Flipping and inverting a binary image is like looking in a mirror and then switching the colors. First, you reverse the order (mirror), then you toggle each pixel (invert). XOR with 1 is the perfect tool for the second step because it cleanly swaps 0↔1 in a single operation."}
\`\`\`

## Problem Statement

Given a binary matrix (2D list of 0s and 1s), first flip it **horizontally** (reverse each row), then **invert** it (flip 0 to 1 and 1 to 0). Return the resulting matrix.

## Visual Walk-through

\`\`\`algoviz
{"title": "Flip & Invert on [[1,1,0],[1,0,1],[0,0,0]]", "type": "grid", "data": [[1,1,0],[1,0,1],[0,0,0]], "frames": [
  {"highlight": [[0,0],[0,1],[0,2]], "label": "Start: row 0 = [1,1,0]"},
  {"highlight": [[0,2],[0,1],[0,0]], "label": "Flip row 0 → [0,1,1]"},
  {"highlight": [[0,0],[0,1],[0,2]], "label": "Invert row 0 → [1,0,0]"},
  {"highlight": [[1,0],[1,1],[1,2]], "label": "Flip row 1 → [1,0,1] (already palindrome)"},
  {"highlight": [[1,0],[1,1],[1,2]], "label": "Invert row 1 → [0,1,0]"},
  {"highlight": [[2,0],[2,1],[2,2]], "label": "Flip row 2 → [0,0,0] (already palindrome)"},
  {"highlight": [[2,0],[2,1],[2,2]], "label": "Invert row 2 → [1,1,1]"}
], "speed": 1000}
\`\`\`

## Examples

**Example 1:**
\`\`\`
Input:  [[1,1,0],[1,0,1],[0,0,0]]
Flip:   [[0,1,1],[1,0,1],[0,0,0]]
Invert: [[1,0,0],[0,1,0],[1,1,1]]
Output: [[1,0,0],[0,1,0],[1,1,1]]
\`\`\`

**Example 2:**
\`\`\`
Input:  [[1,0],[0,1]]
Flip:   [[0,1],[1,0]]
Invert: [[1,0],[0,1]]
Output: [[1,0],[0,1]]
\`\`\`

## Approach

For each row:
1. **Reverse** the row.
2. **XOR each element with 1** to invert it (since \`0 ^ 1 = 1\` and \`1 ^ 1 = 0\`).

These two operations can be combined: for a row of length \`n\`, swap elements from both ends and XOR each with 1. If the row has an odd length, the middle element just gets XOR'd in place.

\`\`\`playground
{"title": "In-place Flip & Invert", "language": "python", "code": "def flip_and_invert(A):\\n    for row in A:\\n        left, right = 0, len(row) - 1\\n        while left <= right:\\n            # swap and invert in one go\\n            row[left], row[right] = row[right] ^ 1, row[left] ^ 1\\n            left += 1\\n            right -= 1\\n    return A\\n\\n# quick test\\nprint(flip_and_invert([[1,1,0,0],[1,0,0,1],[0,1,1,1]]))", "runnable": true}
\`\`\`

\`\`\`callout
{"type": "tip", "title": "XOR Magic", "content": "Using \`^ 1\` is faster and clearer than an \`if\` statement. It works because:\\n- \`0 ^ 1 = 1\`\\n- \`1 ^ 1 = 0\`\\nSo XOR with 1 is exactly the invert operation we need."}
\`\`\`

This approach modifies the matrix in place with no extra space beyond the output.

**Time Complexity:** O(n × m) where n is rows and m is columns.  
**Space Complexity:** O(1) extra space (in-place modification).

## Edge-Case Check

\`\`\`quiz
{"title": "Quick Sanity Check", "questions": [
  {"question": "What happens to a single-element row \`[0]\`?", "options": ["stays [0]", "becomes [1]", "becomes []", "crashes"], "answer": 1, "explanation": "The lone element is simply XOR'd with 1, turning 0 into 1."},
  {"question": "Why can we safely swap \`row[left]\` and \`row[right]\` even when \`left == right\`?", "options": ["Python allows it", "XOR is commutative", "The element is XOR'd twice, canceling out", "We skip that index"], "answer": 2, "explanation": "When left == right, the element is XOR'd with 1 twice in the same statement, which is equivalent to XOR'ing with 0 (i.e., no change). But since we assign both sides, the net effect is still \`x ^ 1\`."},
  {"question": "Which property of XOR makes inversion possible in one operation?", "options": ["Associativity", "Commutativity", "Identity: x ^ 1 toggles the bit", "Distributivity"], "answer": 2, "explanation": "The key is that XOR with 1 flips the bit, giving us the invert operation for free."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["XOR with 1 is the fastest way to toggle a binary value.", "Combine flip & invert in a single two-pointer pass to save time and space.", "In-place modification keeps space at O(1).", "The same trick works for any binary matrix task requiring a horizontal mirror + color flip."]}
\`\`\``,
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

\`\`\`concept
{
  "title": "What is Population Count?",
  "variant": "mental-model",
  "content": "Population count (popcount) is like counting occupied seats in a binary auditorium. Each bit is a seat: 1 means occupied, 0 means empty. The challenge is to tally up all occupied seats efficiently without checking every single seat if possible."
}
\`\`\`

### Method 1: Simple Shift and Count

Repeatedly check the last bit with \`n & 1\`, then right-shift \`n\`. Count until \`n\` becomes 0.

\`\`\`playground
{
  "title": "Shift and Count Implementation",
  "language": "python",
  "code": "def count_set_bits_shift(n: int) -> int:\\n    \\"\\"\\"Count set bits by shifting right until n becomes 0.\\"\\"\\"\\n    count = 0\\n    while n > 0:\\n        count += n & 1    # Check if LSB is set\\n        n >>= 1           # Shift right by 1\\n    return count\\n\\n# Test cases\\nprint(f\\"13 (1101): {count_set_bits_shift(13)} bits\\")\\nprint(f\\"255 (11111111): {count_set_bits_shift(255)} bits\\")\\nprint(f\\"0: {count_set_bits_shift(0)} bits\\")",
  "runnable": true
}
\`\`\`

### Method 2: Brian Kernighan's Trick

The expression \`n & (n - 1)\` clears the lowest set bit of \`n\`. Repeat until \`n\` is 0, counting each iteration. This runs in O(k) where k is the number of set bits.

\`\`\`trace
{
  "title": "Brian Kernighan's Algorithm in Action",
  "language": "python",
  "code": "def count_set_bits_kernighan(n: int) -> int:\\n    count = 0\\n    while n > 0:\\n        n &= n - 1  # Clear lowest set bit\\n        count += 1\\n    return count",
  "frames": [
    {
      "line": 1,
      "vars": {"n": 13, "count": 0},
      "note": "Starting with n = 13 (1101)",
      "stdout": ""
    },
    {
      "line": 3,
      "vars": {"n": 13, "count": 0},
      "note": "Entering loop, n > 0",
      "stdout": ""
    },
    {
      "line": 4,
      "vars": {"n": 12, "count": 0},
      "note": "n &= n - 1 → 1101 & 1100 = 1100 (12)",
      "stdout": ""
    },
    {
      "line": 5,
      "vars": {"n": 12, "count": 1},
      "note": "Increment count to 1",
      "stdout": ""
    },
    {
      "line": 3,
      "vars": {"n": 12, "count": 1},
      "note": "Still in loop",
      "stdout": ""
    },
    {
      "line": 4,
      "vars": {"n": 8, "count": 1},
      "note": "n &= n - 1 → 1100 & 1011 = 1000 (8)",
      "stdout": ""
    },
    {
      "line": 5,
      "vars": {"n": 8, "count": 2},
      "note": "Increment count to 2",
      "stdout": ""
    },
    {
      "line": 3,
      "vars": {"n": 8, "count": 2},
      "note": "Still in loop",
      "stdout": ""
    },
    {
      "line": 4,
      "vars": {"n": 0, "count": 2},
      "note": "n &= n - 1 → 1000 & 0111 = 0000 (0)",
      "stdout": ""
    },
    {
      "line": 5,
      "vars": {"n": 0, "count": 3},
      "note": "Increment count to 3",
      "stdout": ""
    },
    {
      "line": 6,
      "vars": {"n": 0, "count": 3},
      "note": "Return 3",
      "stdout": ""
    }
  ],
  "speed": 800
}
\`\`\`

\`\`\`concept
{
  "title": "How Brian Kernighan's Trick Works",
  "variant": "insight",
  "content": "Subtracting 1 from n flips all bits from the rightmost set bit onward. AND-ing with the original clears that lowest set bit while preserving everything above it. Example: 12 & 11 = 1100 & 1011 = 1000 (cleared the bit at position 2)."
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Shift Method (O(word_size))",
    "code": "def count_set_bits_shift(n):\\n    count = 0\\n    while n > 0:\\n        count += n & 1\\n        n >>= 1\\n    return count\\n\\n# For 32-bit numbers, always 32 iterations"
  },
  "after": {
    "label": "Kernighan's Method (O(k))",
    "code": "def count_set_bits_kernighan(n):\\n    count = 0\\n    while n > 0:\\n        n &= n - 1\\n        count += 1\\n    return count\\n\\n# Only k iterations where k is number of set bits"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Count Set Bits Quiz",
  "questions": [
    {
      "question": "What does the expression \`n & (n - 1)\` do?",
      "options": ["Adds 1 to n", "Clears the lowest set bit", "Sets all bits to 1", "Toggles all bits"],
      "answer": 1,
      "explanation": "\`n & (n - 1)\` clears the lowest set bit by flipping all bits from the rightmost set bit onward and AND-ing with the original."
    },
    {
      "question": "For the number 15 (1111), how many iterations does Kernighan's method take?",
      "options": ["1", "4", "8", "16"],
      "answer": 1,
      "explanation": "15 has 4 set bits, so Kernighan's method takes exactly 4 iterations to clear all bits."
    },
    {
      "question": "What is the time complexity of the shift method for a 32-bit integer?",
      "options": ["O(1)", "O(log n)", "O(32)", "O(n)"],
      "answer": 2,
      "explanation": "The shift method always processes all 32 bits, giving O(32) = O(1) time complexity."
    }
  ]
}
\`\`\`

**Time Complexity:** O(k) where k is the number of set bits (Brian Kernighan) or O(word_size) for the shift method.  
**Space Complexity:** O(1).

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Population count measures how many 1-bits are set in a binary number",
    "The shift method checks each bit sequentially, always taking O(word_size) time",
    "Brian Kernighan's trick clears the lowest set bit each iteration, running in O(k) time",
    "Kernighan's method is more efficient when the number has fewer set bits"
  ]
}
\`\`\``,
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
