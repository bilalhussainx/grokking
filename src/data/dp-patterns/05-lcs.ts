import { Module } from "../types";

export const lcsModule: Module = {
  id: "lcs-pattern",
  title: "Longest Common Substring Pattern",
  description:
    "Master the LCS family of problems: longest common substring, subsequence, edit operations, and increasing subsequences.",
  lessons: [
    {
      id: "lcs-intro",
      slug: "lcs-pattern-intro",
      title: "Introduction to the LCS Pattern",
      content: `## The Longest Common Substring / Subsequence Pattern

This pattern covers problems where you compare **two sequences** and find commonalities, differences, or transformations between them. The core idea is a 2D DP table where rows represent characters of one string and columns represent characters of the other.

### The Template

\`\`\`python
dp = [[0] * (m + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    for j in range(1, m + 1):
        if s1[i-1] == s2[j-1]:
            dp[i][j] = 1 + dp[i-1][j-1]
        else:
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])  # subsequence
            # OR dp[i][j] = 0  # substring (reset)
\`\`\`

### Substring vs Subsequence

| | Substring | Subsequence |
|--|-----------|-------------|
| Contiguous? | Yes | No |
| On mismatch | Reset to 0 | Take max of neighbors |
| Result location | Max value anywhere in table | Bottom-right corner |

### Problems in This Module

1. Longest Common Substring
2. Longest Common Subsequence
3. Minimum Deletions & Insertions to Transform
4. Longest Increasing Subsequence
5. Maximum Sum Increasing Subsequence
6. Shortest Common Supersequence`,
    },
    {
      id: "lcs-substring",
      slug: "longest-common-substring",
      title: "Longest Common Substring",
      content: `## Longest Common Substring

### Problem Statement

Given two strings \`s1\` and \`s2\`, find the length of the **longest common substring** (contiguous characters).

### Examples

\`\`\`
Input:  s1 = "abdca", s2 = "cbda"
Output: 2
Explanation: "bd" is the longest common substring
\`\`\`

\`\`\`
Input:  s1 = "passport", s2 = "ppsspt"
Output: 3
Explanation: "ssp" is common
\`\`\`

### Approach

\`dp[i][j]\` = length of common substring ending at \`s1[i-1]\` and \`s2[j-1]\`.
- If \`s1[i-1] == s2[j-1]\`: \`dp[i][j] = 1 + dp[i-1][j-1]\`
- Else: \`dp[i][j] = 0\` (must be contiguous)

Track the maximum value in the entire table.

### Complexity

- **Time:** O(n × m)
- **Space:** O(n × m), reducible to O(m)`,
      starterCode: `def longest_common_substring(s1, s2):
    # TODO: find length of longest common substring
    pass

# Test cases
print(longest_common_substring("abdca", "cbda"))        # Expected: 2
print(longest_common_substring("passport", "ppsspt"))   # Expected: 3
print(longest_common_substring("abc", "def"))            # Expected: 0
`,
      solutionCode: `def longest_common_substring(s1, s2):
    n, m = len(s1), len(s2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    max_len = 0

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
                max_len = max(max_len, dp[i][j])

    return max_len

# Test cases
print(longest_common_substring("abdca", "cbda"))        # Expected: 2
print(longest_common_substring("passport", "ppsspt"))   # Expected: 3
print(longest_common_substring("abc", "def"))            # Expected: 0
`,
    },
    {
      id: "lcs-subsequence",
      slug: "longest-common-subsequence",
      title: "Longest Common Subsequence",
      content: `## Longest Common Subsequence

### Problem Statement

Given two strings \`s1\` and \`s2\`, find the length of the **longest common subsequence** (characters don't need to be contiguous).

### Examples

\`\`\`
Input:  s1 = "abcde", s2 = "ace"
Output: 3
Explanation: LCS is "ace"
\`\`\`

\`\`\`
Input:  s1 = "abdca", s2 = "cbda"
Output: 3
Explanation: LCS is "bda"
\`\`\`

### Approach

\`dp[i][j]\` = LCS length of \`s1[0..i-1]\` and \`s2[0..j-1]\`.
- If \`s1[i-1] == s2[j-1]\`: \`dp[i][j] = 1 + dp[i-1][j-1]\`
- Else: \`dp[i][j] = max(dp[i-1][j], dp[i][j-1])\`

### Complexity

- **Time:** O(n × m)
- **Space:** O(n × m), reducible to O(m)`,
      starterCode: `def lcs(s1, s2):
    # TODO: find length of longest common subsequence
    pass

# Test cases
print(lcs("abcde", "ace"))     # Expected: 3
print(lcs("abdca", "cbda"))    # Expected: 3
print(lcs("abc", "def"))       # Expected: 0
`,
      solutionCode: `def lcs(s1, s2):
    n, m = len(s1), len(s2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[n][m]

# Test cases
print(lcs("abcde", "ace"))     # Expected: 3
print(lcs("abdca", "cbda"))    # Expected: 3
print(lcs("abc", "def"))       # Expected: 0
`,
    },
    {
      id: "lcs-min-deletions-insertions",
      slug: "min-deletions-insertions",
      title: "Minimum Deletions & Insertions to Transform",
      content: `## Minimum Deletions & Insertions to Transform

### Problem Statement

Given two strings \`s1\` and \`s2\`, find the minimum number of **deletions** from \`s1\` and **insertions** into \`s1\` to transform it into \`s2\`.

### Examples

\`\`\`
Input:  s1 = "abc", s2 = "fbc"
Output: 1 deletion, 1 insertion
Explanation: Delete 'a', insert 'f'
\`\`\`

\`\`\`
Input:  s1 = "abdca", s2 = "cbda"
Output: 2 deletions, 1 insertion
\`\`\`

### Approach

Use LCS to find the common foundation:
- **Deletions** = \`len(s1) - LCS\`
- **Insertions** = \`len(s2) - LCS\`
- **Total operations** = deletions + insertions

### Complexity

- **Time:** O(n × m)
- **Space:** O(n × m)`,
      starterCode: `def min_operations(s1, s2):
    # TODO: return (deletions, insertions) to transform s1 to s2
    pass

# Test cases
print(min_operations("abc", "fbc"))      # Expected: (1, 1)
print(min_operations("abdca", "cbda"))   # Expected: (2, 1)
print(min_operations("abc", "abc"))      # Expected: (0, 0)
`,
      solutionCode: `def min_operations(s1, s2):
    n, m = len(s1), len(s2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    lcs_len = dp[n][m]
    deletions = n - lcs_len
    insertions = m - lcs_len
    return (deletions, insertions)

# Test cases
print(min_operations("abc", "fbc"))      # Expected: (1, 1)
print(min_operations("abdca", "cbda"))   # Expected: (2, 1)
print(min_operations("abc", "abc"))      # Expected: (0, 0)
`,
    },
    {
      id: "lcs-lis",
      slug: "longest-increasing-subsequence",
      title: "Longest Increasing Subsequence",
      content: `## Longest Increasing Subsequence (LIS)

### Problem Statement

Given an array of integers, find the length of the **longest strictly increasing subsequence**.

### Examples

\`\`\`
Input:  [4, 2, 3, 6, 10, 1, 12]
Output: 5
Explanation: [2, 3, 6, 10, 12]
\`\`\`

\`\`\`
Input:  [10, 9, 2, 5, 3, 7, 101, 18]
Output: 4
Explanation: [2, 3, 7, 101] or [2, 5, 7, 101]
\`\`\`

### Two Approaches

**1. DP — O(n²):** \`dp[i]\` = LIS ending at index \`i\`.

**2. Binary Search — O(n log n):** Maintain a "tails" array and use binary search to find the insertion point.

### Complexity

- **DP:** O(n²) time, O(n) space
- **Binary Search:** O(n log n) time, O(n) space`,
      starterCode: `def lis(nums):
    # TODO: find length of longest increasing subsequence
    pass

# Test cases
print(lis([4, 2, 3, 6, 10, 1, 12]))         # Expected: 5
print(lis([10, 9, 2, 5, 3, 7, 101, 18]))    # Expected: 4
print(lis([0, 1, 0, 3, 2, 3]))              # Expected: 4
`,
      solutionCode: `from bisect import bisect_left

def lis(nums):
    if not nums:
        return 0

    # O(n log n) approach using binary search
    tails = []

    for num in nums:
        pos = bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num

    return len(tails)

# Test cases
print(lis([4, 2, 3, 6, 10, 1, 12]))         # Expected: 5
print(lis([10, 9, 2, 5, 3, 7, 101, 18]))    # Expected: 4
print(lis([0, 1, 0, 3, 2, 3]))              # Expected: 4
`,
    },
    {
      id: "lcs-max-sum-lis",
      slug: "max-sum-increasing-subsequence",
      title: "Maximum Sum Increasing Subsequence",
      content: `## Maximum Sum Increasing Subsequence

### Problem Statement

Given an array of integers, find the **maximum sum** of an increasing subsequence.

### Examples

\`\`\`
Input:  [4, 1, 2, 6, 10, 1, 12]
Output: 32
Explanation: [1, 2, 6, 10, 12] → sum = 31? Actually [4, 6, 10, 12] = 32
\`\`\`

\`\`\`
Input:  [3, 4, 5, 1]
Output: 12
Explanation: [3, 4, 5] → sum = 12
\`\`\`

### Approach

Similar to LIS but track sums instead of lengths:
\`dp[i]\` = max sum of increasing subsequence ending at index \`i\`.

For each \`j < i\` where \`nums[j] < nums[i]\`:
\`dp[i] = max(dp[i], dp[j] + nums[i])\`

### Complexity

- **Time:** O(n²)
- **Space:** O(n)`,
      starterCode: `def max_sum_lis(nums):
    # TODO: find maximum sum increasing subsequence
    pass

# Test cases
print(max_sum_lis([4, 1, 2, 6, 10, 1, 12]))  # Expected: 32
print(max_sum_lis([3, 4, 5, 1]))               # Expected: 12
print(max_sum_lis([-1, 2, 3]))                  # Expected: 5
`,
      solutionCode: `def max_sum_lis(nums):
    n = len(nums)
    dp = nums[:]  # each element is a subsequence of length 1

    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + nums[i])

    return max(dp)

# Test cases
print(max_sum_lis([4, 1, 2, 6, 10, 1, 12]))  # Expected: 32
print(max_sum_lis([3, 4, 5, 1]))               # Expected: 12
print(max_sum_lis([-1, 2, 3]))                  # Expected: 5
`,
    },
    {
      id: "lcs-scs",
      slug: "shortest-common-supersequence",
      title: "Shortest Common Supersequence",
      content: `## Shortest Common Supersequence

### Problem Statement

Given two strings \`s1\` and \`s2\`, find the length of the **shortest string** that has both \`s1\` and \`s2\` as subsequences.

### Examples

\`\`\`
Input:  s1 = "abcf", s2 = "bdcf"
Output: 5
Explanation: "abdcf" contains both as subsequences
\`\`\`

\`\`\`
Input:  s1 = "dynamic", s2 = "programming"
Output: 15
\`\`\`

### Approach

The SCS length = \`len(s1) + len(s2) - LCS(s1, s2)\`

The LCS characters appear once in the supersequence; all other characters from both strings are added.

### Complexity

- **Time:** O(n × m) for LCS
- **Space:** O(n × m)`,
      starterCode: `def scs_length(s1, s2):
    # TODO: find length of shortest common supersequence
    pass

# Test cases
print(scs_length("abcf", "bdcf"))             # Expected: 5
print(scs_length("dynamic", "programming"))   # Expected: 15
print(scs_length("abc", "abc"))                # Expected: 3
`,
      solutionCode: `def scs_length(s1, s2):
    n, m = len(s1), len(s2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    lcs_len = dp[n][m]
    return n + m - lcs_len

# Test cases
print(scs_length("abcf", "bdcf"))             # Expected: 5
print(scs_length("dynamic", "programming"))   # Expected: 15
print(scs_length("abc", "abc"))                # Expected: 3
`,
    },
  ],
};
