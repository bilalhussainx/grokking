import { Module } from "../types";

export const arraysStringsModule: Module = {
  id: "arrays-strings",
  title: "Arrays & Strings",
  description:
    "Master array and string manipulation techniques including prefix sums, Kadane's algorithm, and the KMP string matching algorithm.",
  lessons: [
    {
      id: "arrays-strings-intro",
      slug: "arrays-strings-intro",
      title: "Introduction to Arrays & Strings",
      content: `## Arrays & Strings

Arrays and strings are the most fundamental data structures in computer science. Nearly every algorithm operates on sequential data at some level.

### Arrays

An array stores elements in **contiguous memory**, providing:

| Operation | Time |
|-----------|------|
| Access by index | O(1) |
| Search (unsorted) | O(n) |
| Insert at end | O(1) amortized |
| Insert at position | O(n) |
| Delete at position | O(n) |

### Key Techniques

**Sliding Window** — Maintain a window of elements as you scan. Useful for subarray problems (max sum of size k, longest substring without repeats).

**Two Pointers** — Use two indices moving in the same or opposite directions to avoid nested loops.

**Prefix Sums** — Precompute cumulative sums so that any subarray sum can be answered in O(1).

**Kadane's Algorithm** — Find the maximum subarray sum in O(n) using a clever single-pass approach.

### Strings

Strings are essentially character arrays with their own set of classic algorithms:

- **Pattern matching** — KMP, Rabin-Karp, Boyer-Moore
- **Palindrome detection** — Expand around center, Manacher's algorithm
- **Anagram/permutation checks** — Frequency counting

### Common Pitfalls

1. **Off-by-one errors** — The most common bug in array/string code
2. **Mutability** — In Python, strings are immutable; use lists for in-place modifications
3. **Unicode** — Real-world strings require awareness of multi-byte characters

In the following exercises, you will implement three powerful techniques that appear throughout algorithm design.`,
    },
    {
      id: "arrays-prefix-sum",
      slug: "prefix-sum-array",
      title: "Prefix Sum Array",
      content: `## Prefix Sum Array

### Problem Statement

Implement a \`PrefixSum\` class that preprocesses an array so that any **range sum query** (sum of elements from index \`left\` to \`right\`, inclusive) can be answered in O(1) time.

### Interface

- \`__init__(self, nums)\` — Build the prefix sum array in O(n)
- \`range_sum(self, left, right)\` — Return sum of nums[left..right] in O(1)

### Examples

\`\`\`
ps = PrefixSum([1, 2, 3, 4, 5])
ps.range_sum(0, 2)  → 6   (1+2+3)
ps.range_sum(1, 3)  → 9   (2+3+4)
ps.range_sum(0, 4)  → 15  (entire array)
ps.range_sum(3, 3)  → 4   (single element)
\`\`\`

### How It Works

Build an array \`prefix\` where \`prefix[i] = nums[0] + nums[1] + ... + nums[i-1]\` (with \`prefix[0] = 0\`).

Then: \`range_sum(left, right) = prefix[right + 1] - prefix[left]\`

### Complexity

- **Preprocessing:** O(n) time, O(n) space
- **Each query:** O(1) time`,
      starterCode: `class PrefixSum:
    def __init__(self, nums):
        # TODO: Build prefix sum array
        pass

    def range_sum(self, left, right):
        # TODO: Return sum of nums[left..right] in O(1)
        pass

# Test cases
ps = PrefixSum([1, 2, 3, 4, 5])
print(ps.range_sum(0, 2))  # Expected: 6
print(ps.range_sum(1, 3))  # Expected: 9
print(ps.range_sum(0, 4))  # Expected: 15
print(ps.range_sum(3, 3))  # Expected: 4
print(ps.range_sum(2, 4))  # Expected: 12

ps2 = PrefixSum([10, -3, 5, 8, -2])
print(ps2.range_sum(0, 4))  # Expected: 18
print(ps2.range_sum(1, 2))  # Expected: 2
`,
      solutionCode: `class PrefixSum:
    def __init__(self, nums):
        self.prefix = [0] * (len(nums) + 1)
        for i in range(len(nums)):
            self.prefix[i + 1] = self.prefix[i] + nums[i]

    def range_sum(self, left, right):
        return self.prefix[right + 1] - self.prefix[left]

# Test cases
ps = PrefixSum([1, 2, 3, 4, 5])
print(ps.range_sum(0, 2))  # Expected: 6
print(ps.range_sum(1, 3))  # Expected: 9
print(ps.range_sum(0, 4))  # Expected: 15
print(ps.range_sum(3, 3))  # Expected: 4
print(ps.range_sum(2, 4))  # Expected: 12

ps2 = PrefixSum([10, -3, 5, 8, -2])
print(ps2.range_sum(0, 4))  # Expected: 18
print(ps2.range_sum(1, 2))  # Expected: 2
`,
    },
    {
      id: "arrays-kadanes",
      slug: "kadanes-algorithm",
      title: "Kadane's Algorithm",
      content: `## Kadane's Algorithm — Maximum Subarray Sum

### Problem Statement

Given an array of integers (which may include negative numbers), find the **contiguous subarray** with the largest sum and return that sum.

### Examples

\`\`\`
Input:  [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6
Explanation: [4, -1, 2, 1] has the largest sum

Input:  [1, 2, 3, -2, 5]
Output: 9
Explanation: [1, 2, 3, -2, 5] — the entire array

Input:  [-1, -2, -3]
Output: -1
Explanation: [-1] — pick the least negative
\`\`\`

### Algorithm (Kadane's)

1. Track \`current_sum\` = max subarray ending at the current position.
2. Track \`max_sum\` = best seen so far.
3. At each element: \`current_sum = max(nums[i], current_sum + nums[i])\`.
4. Update \`max_sum = max(max_sum, current_sum)\`.

The key insight: if adding the current element to the running sum makes it worse than starting fresh from the current element, then start a new subarray.

### Complexity

- **Time:** O(n)
- **Space:** O(1)`,
      starterCode: `def max_subarray_sum(nums):
    # TODO: Implement Kadane's algorithm
    pass

# Test cases
print(max_subarray_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # Expected: 6
print(max_subarray_sum([1, 2, 3, -2, 5]))                    # Expected: 9
print(max_subarray_sum([-1, -2, -3]))                         # Expected: -1
print(max_subarray_sum([5]))                                   # Expected: 5
print(max_subarray_sum([-1, 3, -1, 3, -1]))                  # Expected: 5
`,
      solutionCode: `def max_subarray_sum(nums):
    current_sum = nums[0]
    max_sum = nums[0]
    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
    return max_sum

# Test cases
print(max_subarray_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # Expected: 6
print(max_subarray_sum([1, 2, 3, -2, 5]))                    # Expected: 9
print(max_subarray_sum([-1, -2, -3]))                         # Expected: -1
print(max_subarray_sum([5]))                                   # Expected: 5
print(max_subarray_sum([-1, 3, -1, 3, -1]))                  # Expected: 5
`,
    },
    {
      id: "arrays-kmp",
      slug: "kmp-string-matching",
      title: "KMP String Matching",
      content: `## KMP String Matching Algorithm

### Problem Statement

Implement the **Knuth-Morris-Pratt (KMP)** algorithm to find all occurrences of a pattern in a text string. Return a list of starting indices where the pattern is found.

### Examples

\`\`\`
Input:  text = "AABAACAADAABAABA", pattern = "AABA"
Output: [0, 9, 12]

Input:  text = "ABABABAB", pattern = "ABAB"
Output: [0, 2, 4]

Input:  text = "HELLO", pattern = "WORLD"
Output: []
\`\`\`

### How KMP Works

**Naive matching** re-scans from the start of the pattern after every mismatch — O(n*m).

**KMP** preprocesses the pattern to build a **failure function** (also called the LPS array — Longest Proper Prefix which is also a Suffix). When a mismatch occurs, the failure function tells us how far back in the pattern we can safely skip, avoiding redundant comparisons.

**Steps:**
1. Build the LPS array for the pattern
2. Use the LPS array to skip ahead on mismatches during the search

### Complexity

- **Preprocessing:** O(m) for the LPS array
- **Search:** O(n)
- **Total:** O(n + m)
- **Space:** O(m) for the LPS array`,
      starterCode: `def build_lps(pattern):
    # TODO: Build the Longest Proper Prefix-Suffix array
    pass

def kmp_search(text, pattern):
    # TODO: Use KMP to find all occurrences of pattern in text
    # Return list of starting indices
    pass

# Test cases
print(kmp_search("AABAACAADAABAABA", "AABA"))  # Expected: [0, 9, 12]
print(kmp_search("ABABABAB", "ABAB"))            # Expected: [0, 2, 4]
print(kmp_search("HELLO", "WORLD"))              # Expected: []
print(kmp_search("AAAAAA", "AA"))                # Expected: [0, 1, 2, 3, 4]
print(kmp_search("ABC", "ABC"))                  # Expected: [0]
`,
      solutionCode: `def build_lps(pattern):
    m = len(pattern)
    lps = [0] * m
    length = 0
    i = 1
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    return lps

def kmp_search(text, pattern):
    n, m = len(text), len(pattern)
    if m == 0:
        return []
    lps = build_lps(pattern)
    results = []
    i = 0  # index in text
    j = 0  # index in pattern
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
        if j == m:
            results.append(i - j)
            j = lps[j - 1]
        elif i < n and text[i] != pattern[j]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    return results

# Test cases
print(kmp_search("AABAACAADAABAABA", "AABA"))  # Expected: [0, 9, 12]
print(kmp_search("ABABABAB", "ABAB"))            # Expected: [0, 2, 4]
print(kmp_search("HELLO", "WORLD"))              # Expected: []
print(kmp_search("AAAAAA", "AA"))                # Expected: [0, 1, 2, 3, 4]
print(kmp_search("ABC", "ABC"))                  # Expected: [0]
`,
    },
  ],
};
