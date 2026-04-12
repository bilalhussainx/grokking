import { Module } from "../types";

export const bitwiseXORModule: Module = {
  id: "bitwise-xor",
  title: "Bitwise XOR",
  description: "Master the Bitwise XOR pattern for finding single numbers, swapping without temporary variables, and solving unique bit manipulation problems efficiently.",
  lessons: [
    {
      id: "bitwise-xor-intro",
      slug: "bitwise-xor-intro",
      title: "Introduction to Bitwise XOR",
      content: `## The Bitwise XOR Pattern

XOR — "exclusive or" — is the operator that returns **1 when exactly one input is 1**, and 0 otherwise. That single rule cascades into properties that feel like magic once you see them.

\`\`\`concept
{ "title": "XOR as a Difference Detector", "variant": "mental-model", "content": "XOR asks: are these two bits *different*? If yes → 1. If no (both 0 or both 1) → 0. At the integer level, XOR applies this bit-by-bit across the entire number. Two identical numbers cancel to zero; two different numbers produce their bit-level difference." }
\`\`\`

### The Truth Table

| A | B | A ^ B |
|---|---|-------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

A concrete example at the byte level:

\`\`\`
  0101  (5)
^ 0110  (6)
------
  0011  (3)
\`\`\`

### Three Properties That Drive Everything

\`\`\`tabs
{ "tabs": [
  { "label": "x ^ x = 0", "icon": "🔄", "content": "Any number XOR'd with itself is 0.\\n\\n\`\`\`\\n  1010  (10)\\n^ 1010  (10)\\n------\\n  0000  (0)\\n\`\`\`\\n\\n**Why it matters:** pairs cancel out. XOR a list of numbers where everything appears twice and you get zero — only the unpaired value survives." },
  { "label": "x ^ 0 = x", "icon": "🪞", "content": "Any number XOR'd with zero is itself.\\n\\n\`\`\`\\n  1010  (10)\\n^ 0000  (0)\\n------\\n  1010  (10)\\n\`\`\`\\n\\n**Why it matters:** zero is the identity element for XOR, just like 0 is for addition. You can freely inject zeros into an XOR chain without changing the result." },
  { "label": "Commutative & Associative", "icon": "🔀", "content": "Order and grouping don't matter:\\n- \`a ^ b = b ^ a\` (commutative)\\n- \`(a ^ b) ^ c = a ^ (b ^ c)\` (associative)\\n\\n**Why it matters:** you can XOR a sequence in any order and get the same result. This is what allows the cancellation trick to work regardless of how duplicates are arranged in the input." }
] }
\`\`\`

\`\`\`concept
{ "title": "The Cancellation Principle", "variant": "insight", "content": "Combine all three properties and you get the master insight: XOR a sequence of numbers and any value that appears an *even* number of times cancels to 0. Only values appearing an *odd* number of times survive. This is the engine behind every XOR interview problem." }
\`\`\`

### Application 1 — Finding the Single Number

Given \`[4, 1, 2, 1, 2]\`, every number appears twice except 4. XOR the entire array:

\`\`\`algoviz
{ "title": "Single Number — XOR Reduction", "type": "array", "data": [4, 1, 2, 1, 2], "frames": [
  { "highlight": [], "label": "result = 0 (identity element)", "stats": { "result": 0 } },
  { "highlight": [0], "label": "result ^= 4  →  0 ^ 4 = 4", "stats": { "result": 4 } },
  { "highlight": [1], "label": "result ^= 1  →  4 ^ 1 = 5", "stats": { "result": 5 } },
  { "highlight": [2], "label": "result ^= 2  →  5 ^ 2 = 7", "stats": { "result": 7 } },
  { "highlight": [3], "label": "result ^= 1  →  7 ^ 1 = 6  (the 1 pair cancels)", "stats": { "result": 6 } },
  { "highlight": [4], "label": "result ^= 2  →  6 ^ 2 = 4  (the 2 pair cancels)", "stats": { "result": 4 } }
], "speed": 900 }
\`\`\`

The code is a single pass, O(1) space:

\`\`\`playground
{ "title": "Single Number", "language": "python", "runnable": true, "code": "def single_number(nums):\\n    result = 0\\n    for num in nums:\\n        result ^= num\\n    return result\\n\\n# All pairs cancel; only the lone value survives\\nprint(single_number([4, 1, 2, 1, 2]))   # 4\\nprint(single_number([2, 2, 1]))          # 1\\nprint(single_number([1]))               # 1" }
\`\`\`

### Application 2 — In-Place Swap (No Temp Variable)

XOR can swap two variables without allocating a third. Each step stores a "hybrid" that encodes both values.

\`\`\`trace
{ "title": "XOR Swap — Step by Step", "language": "python", "code": "a = 5   # 0101\\nb = 3   # 0011\\n\\na = a ^ b   # step 1: a holds the hybrid\\nb = a ^ b   # step 2: cancel b out of hybrid → get original a\\na = a ^ b   # step 3: cancel a out of hybrid → get original b", "frames": [
  { "line": 1, "vars": { "a": "5 (0101)", "b": "?" }, "note": "Initialise a = 5" },
  { "line": 2, "vars": { "a": "5 (0101)", "b": "3 (0011)" }, "note": "Initialise b = 3" },
  { "line": 4, "vars": { "a": "6 (0110)", "b": "3 (0011)" }, "note": "a = 5^3 = 6 — hybrid encoding both values" },
  { "line": 5, "vars": { "a": "6 (0110)", "b": "5 (0101)" }, "note": "b = 6^3 = 5 — hybrid ^ b cancels b, leaving original a" },
  { "line": 6, "vars": { "a": "3 (0011)", "b": "5 (0101)" }, "note": "a = 6^5 = 3 — hybrid ^ a cancels a, leaving original b. Swap complete!" }
], "speed": 1000 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "XOR Swap — A Practical Caveat", "content": "The XOR swap is a classic interview topic, but the Wikipedia article on the XOR swap algorithm notes it is 'primarily a novelty' with 'almost no cases where it provides benefit over the standard technique.' Modern CPUs have an XCHG instruction; compilers often emit equivalent code from the temp-variable form. Use it to demonstrate XOR properties — not in production code." }
\`\`\`

### When to Reach for XOR

\`\`\`steps
{ "title": "Recognising an XOR Problem", "steps": [
  { "title": "Look for the 'one odd one out' structure", "content": "If the problem says every element appears **twice** (or 2k times) except one, XOR is almost certainly the intended O(1)-space solution." },
  { "title": "Check whether pairing/cancellation helps", "content": "Problems involving a missing number in a range \`[1..n]\` can XOR the array against \`1 ^ 2 ^ ... ^ n\`. Pairs cancel; the survivor is the missing number." },
  { "title": "Two single numbers — use bit isolation", "content": "When two numbers appear once and all others appear twice, XOR the full array to get \`a ^ b\`, then isolate any set bit (e.g., \`diff & -diff\`) to split numbers into two groups and XOR each group separately." },
  { "title": "Bit toggling / masking", "content": "XOR with a mask flips specific bits: \`x ^ 1\` flips the LSB, \`x ^ 0xFF\` flips the low byte. Useful for encoding/decoding and cryptographic building blocks." }
] }
\`\`\`

### Complexity

| Metric | Value |
|--------|-------|
| Time | O(n) — single pass through the array |
| Space | O(1) — only a single accumulator variable |

This is optimal: you cannot find the single number faster than reading all elements, and XOR does it without any hash map or sort.

\`\`\`quiz
{ "title": "Check Your XOR Intuition", "questions": [
  {
    "question": "What does the expression \`7 ^ 7\` evaluate to?",
    "options": ["7", "0", "14", "1"],
    "answer": 1,
    "explanation": "x ^ x = 0 for any x. Each bit in 7 (0111) XOR'd with the same bit in 7 yields 0 in every position, so the result is 0."
  },
  {
    "question": "You XOR the list [3, 5, 3, 4, 4]. What is the result?",
    "options": ["3", "4", "5", "0"],
    "answer": 2,
    "explanation": "3^3 = 0 and 4^4 = 0. The 0s contribute nothing (x^0 = x), leaving only 5. Commutative + associative properties let us reorder freely."
  },
  {
    "question": "After the XOR swap sequence \`a ^= b; b ^= a; a ^= b;\`, what has happened?",
    "options": ["Both a and b are set to 0", "a and b are unchanged", "The values of a and b are swapped", "a becomes a+b"],
    "answer": 2,
    "explanation": "Step 1 stores a hybrid (a^b) in a. Step 2 XORs the hybrid with b, cancelling b and leaving the original a in b. Step 3 XORs the hybrid with the new b (original a), cancelling a and leaving original b in a."
  },
  {
    "question": "Which property makes XOR suitable for finding a missing number in [1..n] by XOR-ing with the array?",
    "options": ["x ^ 0 = x only", "x ^ x = 0 and x ^ 0 = x together (cancellation)", "XOR is faster than addition", "XOR works only on positive integers"],
    "answer": 1,
    "explanation": "XOR the full range 1..n against the array elements. Numbers that appear in both cancel to 0 (x^x=0); the number present only in the range but absent from the array survives (x^0=x)."
  }
] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "XOR's core identity: x ^ x = 0 and x ^ 0 = x. Together they mean even-count duplicates cancel, leaving only odd-count values.",
  "The single-number pattern is O(n) time, O(1) space — XOR the entire array and all paired elements vanish.",
  "The XOR swap encodes both values into one variable (the hybrid), then uses XOR again to extract each original — no extra register needed.",
  "Because XOR is commutative and associative, you can XOR elements in any order and the result is the same.",
  "XOR swap is a novelty / interview concept; in practice, compilers and CPU exchange instructions handle swaps more efficiently."
] }
\`\`\``,
    },
    {
      id: "single-number",
      slug: "single-number",
      title: "Single Number",
      content: `## Single Number (All Others Appear Twice)

<!-- voice:section_check concept="XOR for finding single number" -->

Given a non-empty array of integers where **every element appears twice except for one**, find that single element.

**Constraint:** O(n) time, O(1) space — no hash maps allowed.

\`\`\`concept
{ "title": "The XOR Cancellation Law", "variant": "mental-model", "content": "XOR has two properties that make this problem trivial:\\n\\n**a ^ a = 0** — any number XOR'd with itself becomes zero (pairs cancel)\\n\\n**a ^ 0 = a** — any number XOR'd with zero stays the same (the lone number survives)\\n\\nXOR is also commutative and associative, so order doesn't matter. XOR every element together and all duplicates annihilate each other, leaving only the single number." }
\`\`\`

### Walking Through the Example

Take \`[4, 1, 2, 1, 2]\`. Watch what happens as we XOR from left to right:

\`\`\`algoviz
{ "title": "XOR Cancellation on [4, 1, 2, 1, 2]", "type": "array", "data": [4, 1, 2, 1, 2], "frames": [ { "highlight": [0], "label": "Start: result = 0 ^ 4 = 4", "stats": { "result": 4 } }, { "highlight": [1], "label": "result = 4 ^ 1 = 5", "stats": { "result": 5 } }, { "highlight": [2], "label": "result = 5 ^ 2 = 7", "stats": { "result": 7 } }, { "highlight": [3], "label": "result = 7 ^ 1 = 6  ← first 1 cancels", "stats": { "result": 6 } }, { "highlight": [4], "label": "result = 6 ^ 2 = 4  ← first 2 cancels. Only 4 remains!", "stats": { "result": 4 } } ], "speed": 900 }
\`\`\`

The math collapses as: \`4 ^ (1^1) ^ (2^2) = 4 ^ 0 ^ 0 = 4\`.

### The Solution

\`\`\`trace
{ "title": "Line-by-line trace on [2, 2, 1]", "language": "python", "code": "def singleNumber(nums):\\n    result = 0\\n    for n in nums:\\n        result ^= n\\n    return result", "frames": [ { "line": 2, "vars": { "result": 0 }, "note": "Initialise accumulator to 0 (identity for XOR)" }, { "line": 3, "vars": { "result": 0, "n": 2 }, "note": "First iteration: n = 2" }, { "line": 4, "vars": { "result": 2, "n": 2 }, "note": "0 ^ 2 = 2" }, { "line": 3, "vars": { "result": 2, "n": 2 }, "note": "Second iteration: n = 2 again" }, { "line": 4, "vars": { "result": 0, "n": 2 }, "note": "2 ^ 2 = 0 — the pair cancels!" }, { "line": 3, "vars": { "result": 0, "n": 1 }, "note": "Third iteration: n = 1" }, { "line": 4, "vars": { "result": 1, "n": 1 }, "note": "0 ^ 1 = 1 — the single number survives" }, { "line": 5, "vars": { "result": 1 }, "note": "Return 1 ✓" } ], "speed": 800 }
\`\`\`

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Hash Map — O(n) space", "code": "def singleNumber(nums):\\n    count = {}\\n    for n in nums:\\n        count[n] = count.get(n, 0) + 1\\n    for k, v in count.items():\\n        if v == 1:\\n            return k" }, "after": { "label": "XOR — O(1) space", "code": "def singleNumber(nums):\\n    result = 0\\n    for n in nums:\\n        result ^= n\\n    return result" } }
\`\`\`

Both run in O(n) time, but the XOR approach uses only a single integer — no dictionary, no allocation.

### Complexity

| | Complexity |
|---|---|
| **Time** | O(n) — one pass through the array |
| **Space** | O(1) — only the \`result\` variable |

\`\`\`callout
{ "type": "tip", "title": "Why XOR and not AND/OR?", "content": "AND and OR don't have the cancellation property. \`a OR a = a\` (duplicates don't zero out). \`a AND a = a\` (same problem). Only XOR satisfies \`a ^ a = 0\`, which is the exact property needed to eliminate pairs." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "What is the result of XOR-ing all elements in [7, 3, 5, 3, 7]?", "options": ["0", "3", "5", "7"], "answer": 2, "explanation": "7 ^ 7 = 0, 3 ^ 3 = 0, leaving 5. XOR all: 7^3^5^3^7 = (7^7)^(3^3)^5 = 0^0^5 = 5." }, { "question": "Which XOR property ensures pairs vanish?", "options": ["a ^ 0 = a", "a ^ a = 0", "a ^ b = b ^ a", "a ^ b ^ a = b"], "answer": 1, "explanation": "a ^ a = 0 is the cancellation law. Any number XOR'd with itself produces zero, eliminating the pair." }, { "question": "If you XOR the same number three times (a ^ a ^ a), what do you get?", "options": ["0", "a", "2a", "3a"], "answer": 1, "explanation": "a ^ a = 0, then 0 ^ a = a. XOR-ing an odd number of times leaves the value; an even number of times yields 0." }, { "question": "What is the time complexity of the XOR single-number solution?", "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"], "answer": 2, "explanation": "We make exactly one pass through the n-element array, giving O(n) time and O(1) space." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "XOR every element together — duplicate pairs cancel to 0, and the lone number survives via a ^ 0 = a.", "The solution is a single accumulator variable: O(n) time, O(1) space — no hash maps needed.", "XOR is commutative and associative, so the order of elements in the array doesn't affect the result.", "This pattern generalises: Single Number III (two unique values) uses XOR + a rightmost-set-bit partition to separate the two survivors." ] }
\`\`\``,
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

Given an array where exactly **two** elements appear once and all others appear twice, find both unique numbers in O(n) time and O(1) space — no hash maps or sets allowed.

| Input | Output |
|-------|--------|
| \`[2, 1, 3, 2]\` | \`[1, 3]\` |
| \`[1, 4, 2, 1, 3, 5, 6, 2, 3, 5]\` | \`[4, 6]\` |

\`\`\`concept
{ "title": "Why XOR Alone Isn't Enough", "variant": "mental-model", "content": "XOR-ing all elements cancels every duplicate (x ^ x = 0), leaving n1 ^ n2 — the combined XOR of both single numbers. But you can't extract n1 and n2 from their XOR directly. The key insight: since n1 ≠ n2, at least one bit in n1 ^ n2 is 1, meaning they DIFFER at that position. Use that bit to split the array into two independent single-number sub-problems." }
\`\`\`

### The Partition Strategy

Find any bit that is **1** in \`n1 ^ n2\` — that bit differs between n1 and n2. Use it to split the entire array into two buckets:

- **Bucket A:** numbers with that bit **set** → contains one of the unique numbers, plus matched pairs
- **Bucket B:** numbers with that bit **unset** → contains the other unique number, plus matched pairs

XOR each bucket independently. Pairs cancel to zero, leaving one unique number exposed per bucket.

\`\`\`callout
{ "type": "info", "title": "Rightmost Set Bit — One-Line Trick", "content": "Instead of a while-loop, use \`rightmost_bit = n1xn2 & (-n1xn2)\`. In two's complement, \`-x\` flips all bits and adds 1, so \`x & (-x)\` isolates the lowest set bit in a single operation." }
\`\`\`

### Algorithm

\`\`\`steps
{ "title": "Two Single Numbers — O(n) / O(1)", "steps": [ { "title": "XOR All Elements → Get n1 ^ n2", "content": "Pass through the array XOR-ing everything. Duplicates cancel (x ^ x = 0), leaving the combined XOR of both unique numbers.\\n\\n\`\`\`python\\nn1xn2 = 0\\nfor num in nums:\\n    n1xn2 ^= num\\n# n1xn2 now holds n1 XOR n2\\n\`\`\`" }, { "title": "Isolate a Differing Bit", "content": "Since n1 ≠ n2, \`n1xn2 ≠ 0\`. Extract the rightmost set bit — this marks a position where n1 and n2 differ:\\n\\n\`\`\`python\\nrightmost_bit = n1xn2 & (-n1xn2)  # isolates lowest 1-bit\\n\`\`\`" }, { "title": "Partition and XOR Each Group", "content": "Make a second pass. Route each number into one of two accumulators based on whether the differing bit is set. Pairs cancel within each group, leaving one unique number per group:\\n\\n\`\`\`python\\nnum1, num2 = 0, 0\\nfor num in nums:\\n    if num & rightmost_bit:\\n        num1 ^= num\\n    else:\\n        num2 ^= num\\nreturn [num1, num2]\\n\`\`\`" } ] }
\`\`\`

### Algorithm Visualization

Tracing \`[2, 1, 3, 2]\`: XOR all → \`n1xn2 = 2\` (binary \`10\`). Rightmost set bit = \`2\` (bit 1). Now partition every element by that bit:

\`\`\`algoviz
{ "title": "Partitioning [2, 1, 3, 2] on bit position 1", "type": "array", "data": [2, 1, 3, 2], "frames": [ { "highlight": [0, 1, 2, 3], "label": "XOR all: 2^1^3^2 = 2 (binary 10). Rightmost set bit = 2.", "stats": { "n1xn2": 2, "bit_mask": 2 } }, { "highlight": [0], "label": "2 = 10₂ → bit 1 is SET → Group A. num1 = 0^2 = 2", "stats": { "num1": 2, "num2": 0 } }, { "highlight": [1], "label": "1 = 01₂ → bit 1 NOT SET → Group B. num2 = 0^1 = 1", "stats": { "num1": 2, "num2": 1 } }, { "highlight": [2], "label": "3 = 11₂ → bit 1 is SET → Group A. num1 = 2^3 = 1", "stats": { "num1": 1, "num2": 1 } }, { "highlight": [3], "label": "2 = 10₂ → bit 1 is SET → Group A. num1 = 1^2 = 3", "stats": { "num1": 3, "num2": 1 } }, { "highlight": [], "label": "Done! num1 = 3, num2 = 1 → Answer: [1, 3] ✓", "stats": { "num1": 3, "num2": 1 } } ], "speed": 900 }
\`\`\`

### Complete Solution

\`\`\`playground
{ "title": "Two Single Numbers", "language": "python", "code": "from typing import List\\n\\nclass Solution:\\n    def singleNumber(self, nums: List[int]) -> List[int]:\\n        # Step 1: XOR all — duplicates cancel, leaving n1 ^ n2\\n        n1xn2 = 0\\n        for num in nums:\\n            n1xn2 ^= num\\n\\n        # Step 2: isolate rightmost differing bit (two's complement trick)\\n        rightmost_bit = n1xn2 & (-n1xn2)\\n\\n        # Step 3: partition on that bit and XOR each group\\n        num1, num2 = 0, 0\\n        for num in nums:\\n            if num & rightmost_bit:\\n                num1 ^= num\\n            else:\\n                num2 ^= num\\n\\n        return [num1, num2]\\n\\nsol = Solution()\\nprint(sol.singleNumber([2, 1, 3, 2]))                       # [3, 1]\\nprint(sol.singleNumber([1, 4, 2, 1, 3, 5, 6, 2, 3, 5]))    # [4, 6]", "runnable": true }
\`\`\`

### Check Your Understanding

\`\`\`quiz
{ "title": "Two Single Numbers — Quiz", "questions": [ { "question": "For input [3, 5, 3, 4], what is n1xn2 after XOR-ing all elements?", "options": ["0", "1", "5", "7"], "answer": 1, "explanation": "Duplicates cancel: 3^3 = 0. Remaining: 5^4 = 101₂ ^ 100₂ = 001₂ = 1. So n1xn2 = 1." }, { "question": "With n1xn2 = 1 (binary 001), which group does 5 (binary 101) fall into?", "options": ["Group A — bit 0 is SET in 5, so num1 ^= 5", "Group B — bit 0 is NOT SET in 5, so num2 ^= 5", "Both groups — 5 contributes to each", "Neither — odd numbers are skipped"], "answer": 0, "explanation": "The rightmost set bit of n1xn2=1 is bit 0. 5 in binary is 101. 5 & 1 = 1 ≠ 0, so 5 goes to Group A." }, { "question": "Why is n1xn2 always non-zero when there are exactly two single numbers?", "options": ["XOR always produces a positive result", "n1 ≠ n2 guarantees they differ in at least one bit, making n1^n2 ≠ 0", "The array length is always even", "XOR with zero is undefined for negative numbers"], "answer": 1, "explanation": "If n1 = n2, then n1^n2 = 0. But the problem guarantees two *different* single numbers, so n1 ≠ n2, which means n1^n2 must be non-zero." }, { "question": "What is the time and space complexity of this two-pass XOR solution?", "options": ["O(n log n) time, O(1) space", "O(n) time, O(n) space", "O(n) time, O(1) space", "O(n²) time, O(1) space"], "answer": 2, "explanation": "Exactly two linear scans through the array gives O(n) time. We use only a fixed number of integer variables regardless of input size — O(1) space." } ] }
\`\`\`

### Complexity

| | Bound | Reason |
|-|-------|--------|
| **Time** | O(n) | Two passes through the array |
| **Space** | O(1) | Only integer variables — no auxiliary data structures |

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "XOR-ing all elements cancels every duplicate and leaves n1 ^ n2 — the combined XOR of both unique numbers.", "A set bit in n1 ^ n2 marks a position where n1 and n2 differ; use it as a partition key to split the problem into two independent single-number problems.", "The rightmost set bit shortcut: \`x & (-x)\` isolates the lowest 1-bit in O(1) using two's complement arithmetic.", "Both passes are O(n) and use only constant space — the full solution is O(n) time, O(1) space with no hash structures needed." ] }
\`\`\``,
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

Given a binary matrix representing an image, the task is to **flip each row horizontally** (reverse it), then **invert every bit** (0 → 1, 1 → 0). What looks like two separate passes can be collapsed into one using a property of XOR.

**Example walkthrough:**

| Step | Row 0 | Row 1 | Row 2 |
|------|-------|-------|-------|
| Input | [1, 0, 1] | [1, 1, 0] | [0, 1, 1] |
| After flip | [1, 0, 1] | [0, 1, 1] | [1, 1, 0] |
| After invert | [0, 1, 0] | [1, 0, 0] | [0, 0, 1] |

<!-- voice:key_insight insight="XOR with 1 inverts a bit: 0^1=1, 1^1=0. Combine flip and invert in one operation." -->

\`\`\`concept
{ "title": "XOR with 1 Is Branch-Free Bit Inversion", "variant": "mental-model", "content": "XOR obeys: 0 ^ 1 = 1 and 1 ^ 1 = 0. This makes it a perfect bitwise NOT for single bits. Instead of writing \`if bit == 0: bit = 1 else: bit = 0\`, you write \`bit ^= 1\` — one instruction, no branch, no condition." }
\`\`\`

### The One-Pass Optimization

The naive approach flips first (reverse the row), then inverts every element — two separate O(m) sweeps. We can fuse them into a **single two-pointer pass**.

Consider any symmetric pair at indices \`i\` and \`j = len(row) − 1 − i\` as the pointers close inward:

- **If \`row[i] != row[j]\`** — say \`(0, 1)\`: swapping → \`(1, 0)\`, then inverting each → \`(0, 1)\`. Back to the original. **The operations cancel. Do nothing.**
- **If \`row[i] == row[j]\`** — say \`(1, 1)\`: swapping changes nothing (same value), so only the invert matters. **Apply \`^= 1\` to both.**

\`\`\`concept
{ "title": "Flip + Invert Fuse Into One Scan", "variant": "insight", "content": "Mirror pairs that DIFFER cancel each other — skip them. Mirror pairs that MATCH need only the invert step — XOR both with 1. The result is a single O(m/2) scan per row instead of two O(m) passes, while producing identical output." }
\`\`\`

### Algorithm Steps

\`\`\`steps
{ "title": "Optimized One-Pass Algorithm", "steps": [ { "title": "Process each row independently", "content": "Rows are independent — iterate over them. All edits are in-place; no extra matrix is needed." }, { "title": "Set up two inward pointers", "content": "For each row set \`i = 0\` and \`j = len(row) - 1\`. These march toward each other until they meet or cross." }, { "title": "Skip differing mirror pairs", "content": "If \`row[i] != row[j]\`, the flip and invert cancel each other out. Advance both pointers without changing anything." }, { "title": "Invert matching mirror pairs", "content": "If \`row[i] == row[j]\`, swapping changes nothing (identical values), so apply only the invert: \`row[i] ^= 1\` and \`row[j] ^= 1\`." }, { "title": "Handle the middle element of odd-length rows", "content": "When \`i == j\`, the element has no mirror partner. The condition \`row[i] == row[j]\` is trivially true, so it gets XOR'd with 1 — correctly applying just the invert." } ] }
\`\`\`

### Execution Trace

Tracing row \`[1, 1, 0]\` (Row 1 of the example) through the optimized code:

\`\`\`trace
{ "title": "Tracing [1, 1, 0] → [1, 0, 0]", "language": "python", "code": "row = [1, 1, 0]\\ni, j = 0, len(row) - 1\\nwhile i <= j:\\n    if row[i] == row[j]:\\n        row[i] ^= 1\\n        row[j] ^= 1\\n    i += 1\\n    j -= 1", "frames": [ { "line": 1, "vars": { "row": [1, 1, 0] }, "note": "Start: row = [1, 1, 0]" }, { "line": 2, "vars": { "row": [1, 1, 0], "i": 0, "j": 2 }, "note": "Pointers initialized at both ends" }, { "line": 3, "vars": { "row": [1, 1, 0], "i": 0, "j": 2 }, "note": "i=0 ≤ j=2 — enter loop" }, { "line": 4, "vars": { "row": [1, 1, 0], "i": 0, "j": 2 }, "note": "row[0]=1, row[2]=0 — they DIFFER, skip XOR block" }, { "line": 7, "vars": { "row": [1, 1, 0], "i": 1, "j": 1 }, "note": "Advance: i→1, j→1. Pointers meet at middle." }, { "line": 3, "vars": { "row": [1, 1, 0], "i": 1, "j": 1 }, "note": "i=1 ≤ j=1 — continue loop" }, { "line": 4, "vars": { "row": [1, 1, 0], "i": 1, "j": 1 }, "note": "row[1]=1, row[1]=1 — SAME! Apply XOR." }, { "line": 5, "vars": { "row": [1, 0, 0], "i": 1, "j": 1 }, "note": "row[1] ^= 1 → 1 ^ 1 = 0. Middle inverted." }, { "line": 7, "vars": { "row": [1, 0, 0], "i": 2, "j": 0 }, "note": "Advance: i→2, j→0. i > j — exit loop." } ], "speed": 750 }
\`\`\`

Row \`[1, 1, 0]\` becomes \`[1, 0, 0]\` — matches the expected output.

### Naive vs Optimized

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Naive: Two Separate Passes", "code": "def flipAndInvert(image):\\n    for row in image:\\n        # Pass 1: reverse the row\\n        row.reverse()\\n        # Pass 2: invert every element\\n        for i in range(len(row)):\\n            row[i] ^= 1\\n    return image\\n# Correct, but two full O(m) sweeps per row" }, "after": { "label": "Optimized: Single Two-Pointer Pass", "code": "def flipAndInvert(image):\\n    for row in image:\\n        i, j = 0, len(row) - 1\\n        while i <= j:\\n            if row[i] == row[j]:  # same → invert both\\n                row[i] ^= 1\\n                row[j] ^= 1\\n            # different → operations cancel, skip\\n            i += 1\\n            j -= 1\\n    return image\\n# Same O(n*m) class, ~half the operations in practice" } }
\`\`\`

### Full Solution

\`\`\`playground
{ "title": "Flip and Invert Image", "language": "python", "code": "from typing import List\\n\\nclass Solution:\\n    def flipAndInvertImage(self, image: List[List[int]]) -> List[List[int]]:\\n        for row in image:\\n            i, j = 0, len(row) - 1\\n            while i <= j:\\n                if row[i] == row[j]:   # same → invert both in place\\n                    row[i] ^= 1\\n                    row[j] ^= 1\\n                # if different, flip+invert cancel — do nothing\\n                i += 1\\n                j -= 1\\n        return image\\n\\n# Verify all three rows\\nimage = [[1, 0, 1], [1, 1, 0], [0, 1, 1]]\\nprint(Solution().flipAndInvertImage(image))\\n# Expected: [[0, 1, 0], [1, 0, 0], [0, 0, 1]]", "runnable": true }
\`\`\`

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Knowledge Check

\`\`\`quiz
{ "title": "Flip and Invert Image", "questions": [ { "question": "What does \`bit ^= 1\` do to a binary value?", "options": ["Always sets the bit to 0", "Always sets the bit to 1", "Flips the bit: 0 becomes 1 and 1 becomes 0", "Shifts the bit one position to the left"], "answer": 2, "explanation": "XOR with 1 is a branch-free bit inverter: 0^1=1 and 1^1=0. It is equivalent to logical NOT for single-bit values." }, { "question": "In the optimized one-pass approach, what happens when \`row[i] != row[j]\`?", "options": ["Both bits are XOR'd with 1", "The bits are swapped but not inverted", "Nothing — flip and invert cancel each other out", "Both bits are set to 0"], "answer": 2, "explanation": "If mirror elements differ (e.g. 0 and 1), flipping swaps them to (1, 0), then inverting each gives (0, 1) — identical to the original. The two operations cancel, so no action is needed." }, { "question": "What is the time complexity of the optimized solution for an n-row, m-column matrix?", "options": ["O(n)", "O(m)", "O(n × m)", "O(n × m²)"], "answer": 2, "explanation": "Every cell is visited at most once across both pointers. The constant factor is roughly half that of the naive approach (m/2 iterations per row instead of m), but the asymptotic class remains O(n × m)." }, { "question": "Why does the middle element of an odd-length row still get inverted in the optimized code?", "options": ["A special \`if i == j\` branch handles it separately", "The condition \`row[i] == row[j]\` is trivially true when i equals j, triggering the XOR", "The middle element is skipped and inverted in a second pass", "The while loop exits before reaching the middle element"], "answer": 1, "explanation": "When the two pointers meet (i == j), they both point to the same element. \`row[i] == row[j]\` is always true in this case, so the code applies \`^= 1\` to that element — correctly inverting the middle bit without any extra branch." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "\`bit ^= 1\` is a branch-free, single-instruction bit inverter — prefer it over any conditional toggle.", "Flip (reverse) and invert (XOR with 1) cancel each other for mirror pairs that differ; only matching pairs need action.", "The two-pointer fusion reduces the constant factor to ~m/2 operations per row without changing the O(n × m) asymptotic complexity.", "Space is O(1) — all edits are in-place; no extra matrix is allocated.", "This pattern — fusing two linear passes into one by analyzing cancellation — generalises to other two-step in-place transformations." ] }
\`\`\``,
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

Great work completing the Bitwise XOR module. Before moving on, let's consolidate everything you've learned — from the core identities to the clever tricks they unlock.

---

\`\`\`concept
{ "title": "The Two Laws of XOR", "variant": "mental-model", "content": "Every XOR trick you learned this module flows from exactly two identities:\\n\\n**Law 1:** \`x ^ x = 0\` — a number XORed with itself cancels to zero.\\n**Law 2:** \`x ^ 0 = x\` — a number XORed with zero is unchanged.\\n\\nBecause XOR is also **commutative** (\`a ^ b = b ^ a\`) and **associative** (\`(a ^ b) ^ c = a ^ (b ^ c)\`), you can freely reorder terms — which is why duplicate numbers cancel regardless of where they appear in an array." }
\`\`\`

---

### What You Covered This Module

\`\`\`tabs
{ "tabs": [
  {
    "label": "Single Number",
    "icon": "1️⃣",
    "content": "**Problem:** Every element appears twice except one. Find it in O(n) time, O(1) space.\\n\\n**Key insight:** XOR all elements together. Duplicates cancel (\`x ^ x = 0\`), leaving only the lone value.\\n\\n\`\`\`python\\ndef single_number(nums):\\n    result = 0\\n    for n in nums:\\n        result ^= n\\n    return result\\n\`\`\`\\n\\n**Example:** \`[4, 1, 2, 1, 2]\`\\n→ \`4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1^1) ^ (2^2) = 4 ^ 0 ^ 0 = 4\` ✓"
  },
  {
    "label": "Two Single Numbers",
    "icon": "2️⃣",
    "content": "**Problem:** Two elements appear once, all others appear twice. Find both.\\n\\n**Key insight:**\\n1. XOR everything → get \`x ^ y\` (the two singles XORed)\\n2. Find any bit that is \`1\` in \`x ^ y\` — that bit *differs* between x and y\\n3. Use that bit to partition the array into two groups; XOR each group independently\\n\\n\`\`\`python\\ndef two_single_numbers(nums):\\n    n1xn2 = 0\\n    for n in nums:\\n        n1xn2 ^= n\\n    rightmost_bit = n1xn2 & (-n1xn2)  # isolate lowest set bit\\n    num1, num2 = 0, 0\\n    for n in nums:\\n        if n & rightmost_bit:\\n            num1 ^= n\\n        else:\\n            num2 ^= n\\n    return num1, num2\\n\`\`\`"
  },
  {
    "label": "Flip & Invert",
    "icon": "🔄",
    "content": "**XOR with 1 flips a bit.** XOR with 0 preserves it.\\n\\nThis is why \`x ^ 1\` toggles the least significant bit, and why XOR is used to invert image pixels:\\n\\n\`\`\`python\\ndef flip_and_invert(image):\\n    for row in image:\\n        lo, hi = 0, len(row) - 1\\n        while lo <= hi:\\n            row[lo], row[hi] = row[hi] ^ 1, row[lo] ^ 1\\n            lo += 1\\n            hi -= 1\\n    return image\\n\`\`\`\\n\\nThe in-place swap is handled with XOR, and the inversion is \`^ 1\` on each bit."
  },
  {
    "label": "Swap Without Temp",
    "icon": "🔀",
    "content": "**Three XOR operations swap two values without any temporary variable:**\\n\\n\`\`\`python\\nx ^= y   # x = x ^ y\\ny ^= x   # y = y ^ (x ^ y) = x\\nx ^= y   # x = (x ^ y) ^ x = y\\n\`\`\`\\n\\nStep by step with \`x=5, y=6\`:\\n- After step 1: \`x = 5^6 = 3\`, \`y = 6\`\\n- After step 2: \`y = 6 ^ 3 = 5\` ← y now holds original x\\n- After step 3: \`x = 3 ^ 5 = 6\` ← x now holds original y\\n\\n**Why it works:** storing \`x ^ y\` lets you reconstruct either original value given the other."
  }
] }
\`\`\`

---

\`\`\`algoviz
{ "title": "Single Number: XOR Cancellation Visualized", "type": "array", "data": [4, 1, 2, 1, 2], "frames": [ { "highlight": [], "label": "Start: result = 0", "stats": { "result": 0, "step": "init" } }, { "highlight": [0], "label": "result ^= 4 → 0 ^ 4 = 4", "stats": { "result": 4, "step": "0 ^ 4" } }, { "highlight": [1], "label": "result ^= 1 → 4 ^ 1 = 5", "stats": { "result": 5, "step": "4 ^ 1" } }, { "highlight": [2], "label": "result ^= 2 → 5 ^ 2 = 7", "stats": { "result": 7, "step": "5 ^ 2" } }, { "highlight": [3], "label": "result ^= 1 → 7 ^ 1 = 6 (first 1 partially cancelled)", "stats": { "result": 6, "step": "7 ^ 1" } }, { "highlight": [4], "label": "result ^= 2 → 6 ^ 2 = 4 (second 2 cancelled). Done!", "stats": { "result": 4, "step": "6 ^ 2 = 4 ✓" } } ], "speed": 900 }
\`\`\`

---

### Knowledge Check

\`\`\`quiz
{ "title": "Bitwise XOR Module Quiz", "questions": [ { "question": "What is the result of x ^ x for any integer x?", "options": ["x", "0", "1", "2x"], "answer": 1, "explanation": "x ^ x = 0 always. Every bit is XORed with itself: 0^0=0 and 1^1=0, so all bits zero out. This is the cancellation property that makes duplicate-finding possible." }, { "question": "What is the result of x ^ 0 for any integer x?", "options": ["0", "1", "x", "-x"], "answer": 2, "explanation": "x ^ 0 = x always. XOR with 0 preserves every bit unchanged: 0^0=0 and 1^0=1. This is the identity property of XOR." }, { "question": "When finding two single numbers using XOR, what does XORing all array elements give you?", "options": ["The first single number", "The second single number", "num1 ^ num2 (both singles XORed together)", "0"], "answer": 2, "explanation": "All duplicates cancel via x^x=0, leaving only num1 ^ num2. You then use any set bit in this result to partition the array into two groups, each containing exactly one of the two singles." }, { "question": "XOR is commutative and associative. What practical consequence does this have?", "options": ["You can only XOR numbers in sorted order", "Duplicates cancel regardless of their position in the array", "XOR only works on positive integers", "XOR results depend on the order of operands"], "answer": 1, "explanation": "Because a^b = b^a (commutative) and (a^b)^c = a^(b^c) (associative), you can mentally reorder any sequence. Duplicates always end up adjacent after reordering, so they cancel — no matter where they appear in the original input." }, { "question": "How do you invert (flip) a single bit using XOR?", "options": ["XOR with 0", "XOR with 1", "XOR with itself", "XOR is not capable of inverting bits"], "answer": 1, "explanation": "x ^ 1 flips the bit: 0^1=1 and 1^1=0. This is used in the Flip and Invert Image problem — each pixel (0 or 1) is toggled by XORing with 1. XOR with 0 preserves the bit; XOR with itself always gives 0." } ] }
\`\`\`

---

\`\`\`collapse
{ "title": "Deep Dive: Why the Rightmost Set Bit Partitions Two Singles", "content": "When you XOR all elements and get \`n1xn2 = num1 ^ num2\`, any bit that is \`1\` in the result marks a position where num1 and num2 differ.\\n\\nTo isolate the **rightmost** such bit, use the two's complement trick:\\n\\n\`\`\`python\\nrightmost_bit = n1xn2 & (-n1xn2)\\n\`\`\`\\n\\n\`-n1xn2\` in two's complement flips all bits and adds 1. AND-ing with the original preserves only the lowest set bit.\\n\\n**Why does partitioning work?** Every duplicated number appears in *both* groups (once per group) and cancels. But num1 goes into one group and num2 into the other — because they differ at that bit. XORing each group independently isolates one single number per group." }
\`\`\`

---

### Voice Summary

<!-- voice:checkpoint_summary -->

Your coach will ask you to explain:

1. **The two XOR identities** — and why they allow duplicate cancellation
2. **Two Single Numbers walkthrough** — how the rightmost-set-bit partition separates the two unknowns
3. **Real-world applications** — swapping without a temp variable, bit flipping, image inversion

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "x ^ x = 0 (cancellation) and x ^ 0 = x (identity) — all XOR tricks reduce to these two laws", "XOR is commutative and associative, so duplicates cancel regardless of array order — O(n) time, O(1) space", "To find two single numbers: XOR everything to get num1^num2, then isolate any differing bit to partition the array", "XOR with 1 flips a bit; XOR with 0 preserves it — enabling in-place inversion and the no-temp-variable swap", "The in-place swap (x^=y; y^=x; x^=y) works because x^y stored in one register lets you reconstruct either original" ] }
\`\`\`

**You've mastered the Bitwise XOR pattern — one of the most elegant tools in the interview toolkit.**`,
    },
  ],
};
