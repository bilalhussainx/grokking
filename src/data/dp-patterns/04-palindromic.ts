import { Module } from "../types";

export const palindromicModule: Module = {
  id: "palindromic-pattern",
  title: "Palindromic Subsequence Pattern",
  description: "Master problems involving palindromic subsequences and substrings using interval DP techniques.",
  lessons: [
    {
      id: "palindromic-intro",
      slug: "palindromic-pattern-intro",
      title: "Introduction to Palindromic Subsequences",
      content: `## The Palindromic Subsequence Pattern

This pattern covers problems where you need to find, count, or transform palindromic subsequences or substrings. These problems typically use **interval DP** — building solutions for longer substrings from shorter ones.

### Key Concepts

- **Subsequence** — characters don't need to be contiguous (e.g., "ace" is a subsequence of "abcde")
- **Substring** — characters must be contiguous (e.g., "bcd" is a substring of "abcde")
- **Palindrome** — reads the same forwards and backwards

### The Template

Most palindromic problems use a 2D table \`dp[i][j]\` representing the substring from index \`i\` to \`j\`:

\`\`\`python
# Process all substrings by increasing length
for length in range(2, n + 1):
    for i in range(n - length + 1):
        j = i + length - 1
        if s[i] == s[j]:
            dp[i][j] = dp[i+1][j-1] + ...
        else:
            dp[i][j] = max(dp[i+1][j], dp[i][j-1])
\`\`\`

### When to Recognize This Pattern

- The problem involves **palindromes** (subsequences or substrings).
- You need to find the **longest**, **count**, or **minimum operations** related to palindromes.
- The recurrence compares **characters at both ends** of a range.`,
    },
    {
      id: "palindromic-lps",
      slug: "longest-palindromic-subsequence",
      title: "Longest Palindromic Subsequence",
      content: `## Longest Palindromic Subsequence

### Problem Statement

Given a string \`s\`, find the length of the **longest palindromic subsequence** (LPS).

### Examples

\`\`\`
Input:  "abdbca"
Output: 5
Explanation: LPS is "abdba"
\`\`\`

\`\`\`
Input:  "cddpd"
Output: 3
Explanation: LPS is "ddd"
\`\`\`

\`\`\`
Input:  "pqr"
Output: 1
Explanation: Any single character
\`\`\`

### Approach

\`dp[i][j]\` = length of LPS in \`s[i..j]\`.

If \`s[i] == s[j]\`: \`dp[i][j] = 2 + dp[i+1][j-1]\`
Otherwise: \`dp[i][j] = max(dp[i+1][j], dp[i][j-1])\`

### Complexity

- **Time:** O(n²)
- **Space:** O(n²), reducible to O(n)`,
      starterCode: `def lps(s):
    # TODO: find length of longest palindromic subsequence
    pass

# Test cases
print(lps("abdbca"))  # Expected: 5
print(lps("cddpd"))   # Expected: 3
print(lps("pqr"))     # Expected: 1
`,
      solutionCode: `def lps(s):
    n = len(s)
    dp = [[0] * n for _ in range(n)]

    # Every single character is a palindrome of length 1
    for i in range(n):
        dp[i][i] = 1

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                dp[i][j] = 2 + dp[i + 1][j - 1]
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])

    return dp[0][n - 1]

# Test cases
print(lps("abdbca"))  # Expected: 5
print(lps("cddpd"))   # Expected: 3
print(lps("pqr"))     # Expected: 1
`,
    },
    {
      id: "palindromic-substring",
      slug: "longest-palindromic-substring",
      title: "Longest Palindromic Substring",
      content: `## Longest Palindromic Substring

### Problem Statement

Given a string \`s\`, find the **longest palindromic substring**.

### Examples

\`\`\`
Input:  "babad"
Output: "bab" (or "aba")
\`\`\`

\`\`\`
Input:  "cbbd"
Output: "bb"
\`\`\`

### Approach

\`dp[i][j]\` = True if \`s[i..j]\` is a palindrome.

- Base: all single characters, and adjacent equal pairs.
- Transition: \`dp[i][j] = (s[i] == s[j]) and dp[i+1][j-1]\`
- Track the longest palindrome found.

**Alternative:** Expand Around Center — O(n²) time, O(1) space.

### Complexity

- **Time:** O(n²)
- **Space:** O(n²) for DP, O(1) for expand-around-center`,
      starterCode: `def longest_palindrome_substring(s):
    # TODO: find the longest palindromic substring
    pass

# Test cases
print(longest_palindrome_substring("babad"))   # Expected: "bab" or "aba"
print(longest_palindrome_substring("cbbd"))    # Expected: "bb"
print(longest_palindrome_substring("a"))       # Expected: "a"
`,
      solutionCode: `def longest_palindrome_substring(s):
    n = len(s)
    if n < 2:
        return s

    start, max_len = 0, 1

    def expand(left, right):
        nonlocal start, max_len
        while left >= 0 and right < n and s[left] == s[right]:
            if right - left + 1 > max_len:
                start = left
                max_len = right - left + 1
            left -= 1
            right += 1

    for i in range(n):
        expand(i, i)      # odd-length palindromes
        expand(i, i + 1)  # even-length palindromes

    return s[start:start + max_len]

# Test cases
print(longest_palindrome_substring("babad"))   # Expected: "bab" or "aba"
print(longest_palindrome_substring("cbbd"))    # Expected: "bb"
print(longest_palindrome_substring("a"))       # Expected: "a"
`,
    },
    {
      id: "palindromic-count",
      slug: "count-palindromic-substrings",
      title: "Count of Palindromic Substrings",
      content: `## Count of Palindromic Substrings

### Problem Statement

Given a string \`s\`, count the number of **palindromic substrings** in it.

### Examples

\`\`\`
Input:  "abc"
Output: 3
Explanation: "a", "b", "c"
\`\`\`

\`\`\`
Input:  "aaa"
Output: 6
Explanation: "a", "a", "a", "aa", "aa", "aaa"
\`\`\`

### Approach

Use expand-around-center for each possible center:
- For each index, expand for both odd and even length palindromes.
- Count each valid expansion.

### Complexity

- **Time:** O(n²)
- **Space:** O(1)`,
      starterCode: `def count_palindromic_substrings(s):
    # TODO: count all palindromic substrings
    pass

# Test cases
print(count_palindromic_substrings("abc"))    # Expected: 3
print(count_palindromic_substrings("aaa"))    # Expected: 6
print(count_palindromic_substrings("abba"))   # Expected: 6
`,
      solutionCode: `def count_palindromic_substrings(s):
    n = len(s)
    count = 0

    def expand(left, right):
        nonlocal count
        while left >= 0 and right < n and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1

    for i in range(n):
        expand(i, i)      # odd-length
        expand(i, i + 1)  # even-length

    return count

# Test cases
print(count_palindromic_substrings("abc"))    # Expected: 3
print(count_palindromic_substrings("aaa"))    # Expected: 6
print(count_palindromic_substrings("abba"))   # Expected: 6
`,
    },
    {
      id: "palindromic-min-deletions",
      slug: "minimum-deletions-palindrome",
      title: "Minimum Deletions for Palindrome",
      content: `## Minimum Deletions to Make a Palindrome

### Problem Statement

Given a string, find the **minimum number of characters** to delete to make it a palindrome.

### Examples

\`\`\`
Input:  "abdbca"
Output: 1
Explanation: Remove 'c' to get "abdba"
\`\`\`

\`\`\`
Input:  "cddpd"
Output: 2
Explanation: Remove 'c' and 'p' to get "ddd"
\`\`\`

### Approach

**Key Insight:** The minimum deletions = \`len(s) - LPS(s)\`

If the longest palindromic subsequence has length \`k\`, we need to delete \`n - k\` characters to make the entire string a palindrome.

### Complexity

- **Time:** O(n²) — computing LPS
- **Space:** O(n²)`,
      starterCode: `def min_deletions_palindrome(s):
    # TODO: find minimum deletions to make string a palindrome
    # Hint: use the LPS solution
    pass

# Test cases
print(min_deletions_palindrome("abdbca"))  # Expected: 1
print(min_deletions_palindrome("cddpd"))   # Expected: 2
print(min_deletions_palindrome("pqr"))     # Expected: 2
`,
      solutionCode: `def min_deletions_palindrome(s):
    n = len(s)
    # First find the Longest Palindromic Subsequence
    dp = [[0] * n for _ in range(n)]

    for i in range(n):
        dp[i][i] = 1

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                dp[i][j] = 2 + dp[i + 1][j - 1]
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])

    lps_length = dp[0][n - 1]
    return n - lps_length

# Test cases
print(min_deletions_palindrome("abdbca"))  # Expected: 1
print(min_deletions_palindrome("cddpd"))   # Expected: 2
print(min_deletions_palindrome("pqr"))     # Expected: 2
`,
    },
    {
      id: "palindromic-partitioning",
      slug: "palindromic-partitioning",
      title: "Palindromic Partitioning",
      content: `## Palindromic Partitioning

### Problem Statement

Given a string \`s\`, find the **minimum number of cuts** needed to partition it such that every substring is a palindrome.

### Examples

\`\`\`
Input:  "abcba"
Output: 0
Explanation: Already a palindrome
\`\`\`

\`\`\`
Input:  "aab"
Output: 1
Explanation: "aa" | "b"
\`\`\`

\`\`\`
Input:  "aabbc"
Output: 2
Explanation: "aa" | "bb" | "c"
\`\`\`

### Approach

1. Precompute \`is_palindrome[i][j]\` for all substrings.
2. \`dp[i]\` = min cuts for \`s[0..i]\`.
3. For each position \`i\`, try all \`j ≤ i\`: if \`s[j..i]\` is a palindrome, then \`dp[i] = min(dp[i], dp[j-1] + 1)\`.

### Complexity

- **Time:** O(n²)
- **Space:** O(n²)`,
      starterCode: `def min_palindrome_cuts(s):
    # TODO: find minimum cuts to partition into palindromes
    pass

# Test cases
print(min_palindrome_cuts("abcba"))   # Expected: 0
print(min_palindrome_cuts("aab"))     # Expected: 1
print(min_palindrome_cuts("aabbc"))   # Expected: 2
`,
      solutionCode: `def min_palindrome_cuts(s):
    n = len(s)
    if n <= 1:
        return 0

    # Precompute palindrome table
    is_pal = [[False] * n for _ in range(n)]
    for i in range(n):
        is_pal[i][i] = True
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                is_pal[i][j] = (length == 2) or is_pal[i + 1][j - 1]

    # dp[i] = min cuts for s[0..i]
    dp = list(range(n))  # worst case: cut every char

    for i in range(1, n):
        if is_pal[0][i]:
            dp[i] = 0
            continue
        for j in range(1, i + 1):
            if is_pal[j][i]:
                dp[i] = min(dp[i], dp[j - 1] + 1)

    return dp[n - 1]

# Test cases
print(min_palindrome_cuts("abcba"))   # Expected: 0
print(min_palindrome_cuts("aab"))     # Expected: 1
print(min_palindrome_cuts("aabbc"))   # Expected: 2
`,
    },
  ],
};
