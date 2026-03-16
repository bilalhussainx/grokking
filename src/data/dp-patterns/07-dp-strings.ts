import { Module } from "../types";

export const dpStringsModule: Module = {
  id: "dp-strings-pattern",
  title: "DP on Strings & Sequences",
  description:
    "Solve advanced DP problems on strings including edit distance, interleaving, and pattern matching.",
  lessons: [
    {
      id: "dp-strings-intro",
      slug: "dp-strings-intro",
      title: "Introduction to DP on Strings",
      content: `## DP on Strings & Sequences

This module covers advanced dynamic programming problems that don't fit neatly into the previous patterns but frequently appear in interviews. They share a common trait: operating on **strings or sequences** with complex state transitions.

### Common Themes

- **Edit operations** — insert, delete, replace characters
- **Interleaving** — can two strings form a third?
- **Pattern matching** — does a string match a pattern with wildcards?
- **Optimization on sequences** — egg dropping, alternating subsequences

### General Approach

1. Define the **state** clearly (usually indices into one or two strings).
2. Identify the **transitions** (what choices do you have at each state?).
3. Determine the **base cases** (empty strings, single characters).
4. Choose **top-down or bottom-up** based on complexity.

### Problems in This Module

1. **Edit Distance** — min operations to transform one string to another
2. **String Interleaving** — can s3 be formed by interleaving s1 and s2?
3. **Longest Alternating Subsequence** — longest up-down or down-up subsequence
4. **Egg Dropping Problem** — min trials to find critical floor
5. **Regular Expression Matching** — match with '.' and '*'`,
    },
    {
      id: "dp-edit-distance",
      slug: "edit-distance",
      title: "Edit Distance",
      content: `## Edit Distance (Levenshtein Distance)

### Problem Statement

Given two strings \`s1\` and \`s2\`, find the **minimum number of operations** (insert, delete, replace) to transform \`s1\` into \`s2\`.

### Examples

\`\`\`
Input:  s1 = "horse", s2 = "ros"
Output: 3
Explanation: horse → rorse (replace h→r) → rose (delete r) → ros (delete e)
\`\`\`

\`\`\`
Input:  s1 = "intention", s2 = "execution"
Output: 5
\`\`\`

### Approach

\`dp[i][j]\` = min operations to convert \`s1[0..i-1]\` to \`s2[0..j-1]\`.

- If \`s1[i-1] == s2[j-1]\`: \`dp[i][j] = dp[i-1][j-1]\` (no operation)
- Else: \`dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\`
  - \`dp[i-1][j]\` = delete from s1
  - \`dp[i][j-1]\` = insert into s1
  - \`dp[i-1][j-1]\` = replace

### Complexity

- **Time:** O(n × m)
- **Space:** O(n × m), reducible to O(m)`,
      starterCode: `def edit_distance(s1, s2):
    # TODO: find minimum edit distance
    pass

# Test cases
print(edit_distance("horse", "ros"))            # Expected: 3
print(edit_distance("intention", "execution"))  # Expected: 5
print(edit_distance("", "abc"))                  # Expected: 3
`,
      solutionCode: `def edit_distance(s1, s2):
    n, m = len(s1), len(s2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]

    # Base cases
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],      # delete
                    dp[i][j - 1],      # insert
                    dp[i - 1][j - 1]   # replace
                )

    return dp[n][m]

# Test cases
print(edit_distance("horse", "ros"))            # Expected: 3
print(edit_distance("intention", "execution"))  # Expected: 5
print(edit_distance("", "abc"))                  # Expected: 3
`,
    },
    {
      id: "dp-string-interleaving",
      slug: "string-interleaving",
      title: "String Interleaving",
      content: `## String Interleaving

### Problem Statement

Given three strings \`s1\`, \`s2\`, and \`s3\`, determine if \`s3\` is formed by an **interleaving** of \`s1\` and \`s2\`. An interleaving preserves the relative order of characters from each string.

### Examples

\`\`\`
Input:  s1 = "aab", s2 = "axy", s3 = "aaxaby"
Output: True
\`\`\`

\`\`\`
Input:  s1 = "aab", s2 = "axy", s3 = "abaaxy"
Output: False
\`\`\`

### Approach

\`dp[i][j]\` = True if \`s3[0..i+j-1]\` can be formed by interleaving \`s1[0..i-1]\` and \`s2[0..j-1]\`.

- If \`s1[i-1] == s3[i+j-1]\`: \`dp[i][j] |= dp[i-1][j]\`
- If \`s2[j-1] == s3[i+j-1]\`: \`dp[i][j] |= dp[i][j-1]\`

### Complexity

- **Time:** O(n × m)
- **Space:** O(n × m), reducible to O(m)`,
      starterCode: `def is_interleave(s1, s2, s3):
    # TODO: check if s3 is an interleaving of s1 and s2
    pass

# Test cases
print(is_interleave("aab", "axy", "aaxaby"))   # Expected: True
print(is_interleave("aab", "axy", "abaaxy"))   # Expected: False
print(is_interleave("", "", ""))                 # Expected: True
`,
      solutionCode: `def is_interleave(s1, s2, s3):
    n, m = len(s1), len(s2)
    if n + m != len(s3):
        return False

    dp = [[False] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = True

    # Fill first column (using s1 only)
    for i in range(1, n + 1):
        dp[i][0] = dp[i - 1][0] and s1[i - 1] == s3[i - 1]

    # Fill first row (using s2 only)
    for j in range(1, m + 1):
        dp[0][j] = dp[0][j - 1] and s2[j - 1] == s3[j - 1]

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            k = i + j - 1
            dp[i][j] = (dp[i - 1][j] and s1[i - 1] == s3[k]) or \\
                        (dp[i][j - 1] and s2[j - 1] == s3[k])

    return dp[n][m]

# Test cases
print(is_interleave("aab", "axy", "aaxaby"))   # Expected: True
print(is_interleave("aab", "axy", "abaaxy"))   # Expected: False
print(is_interleave("", "", ""))                 # Expected: True
`,
    },
    {
      id: "dp-alternating-subsequence",
      slug: "longest-alternating-subsequence",
      title: "Longest Alternating Subsequence",
      content: `## Longest Alternating Subsequence

### Problem Statement

Given an array of integers, find the length of the **longest alternating subsequence** (LAS). A subsequence is alternating if its elements alternate between increasing and decreasing: \`a[0] < a[1] > a[2] < a[3] > ...\` or \`a[0] > a[1] < a[2] > a[3] < ...\`

### Examples

\`\`\`
Input:  [1, 5, 4]
Output: 3
Explanation: [1, 5, 4] — goes up then down
\`\`\`

\`\`\`
Input:  [1, 2, 3, 4]
Output: 2
Explanation: [1, 4] or any pair — only one direction change
\`\`\`

\`\`\`
Input:  [3, 5, 6, 2, 5, 4, 19, 5, 6, 7, 12]
Output: 7
\`\`\`

### Approach

Track two states:
- \`up[i]\` = LAS ending at \`i\` with last move going **up**
- \`down[i]\` = LAS ending at \`i\` with last move going **down**

For each pair \`(j, i)\`:
- If \`nums[i] > nums[j]\`: \`up[i] = max(up[i], down[j] + 1)\`
- If \`nums[i] < nums[j]\`: \`down[i] = max(down[i], up[j] + 1)\`

### Complexity

- **Time:** O(n) with greedy, O(n²) with DP
- **Space:** O(1) with greedy`,
      starterCode: `def las(nums):
    # TODO: find length of longest alternating subsequence
    pass

# Test cases
print(las([1, 5, 4]))                            # Expected: 3
print(las([1, 2, 3, 4]))                          # Expected: 2
print(las([3, 5, 6, 2, 5, 4, 19, 5, 6, 7, 12]))  # Expected: 7
`,
      solutionCode: `def las(nums):
    if len(nums) < 2:
        return len(nums)

    # Greedy O(n) approach
    up = 1    # length of LAS ending with an up move
    down = 1  # length of LAS ending with a down move

    for i in range(1, len(nums)):
        if nums[i] > nums[i - 1]:
            up = down + 1
        elif nums[i] < nums[i - 1]:
            down = up + 1

    return max(up, down)

# Test cases
print(las([1, 5, 4]))                            # Expected: 3
print(las([1, 2, 3, 4]))                          # Expected: 2
print(las([3, 5, 6, 2, 5, 4, 19, 5, 6, 7, 12]))  # Expected: 7
`,
    },
    {
      id: "dp-egg-dropping",
      slug: "egg-dropping",
      title: "Egg Dropping Problem",
      content: `## Egg Dropping Problem

### Problem Statement

Given \`k\` eggs and a building with \`n\` floors, find the **minimum number of trials** needed to determine the **critical floor** (the highest floor from which an egg can be dropped without breaking), in the **worst case**.

### Examples

\`\`\`
Input:  eggs = 1, floors = 10
Output: 10
Explanation: Must try every floor from bottom up
\`\`\`

\`\`\`
Input:  eggs = 2, floors = 10
Output: 4
Explanation: Try floors 4, 7, 9, 10 (optimal strategy)
\`\`\`

### Approach

\`dp[k][n]\` = min trials with \`k\` eggs and \`n\` floors.

For each floor \`x\` we drop from:
- **Egg breaks:** Check below → \`dp[k-1][x-1]\`
- **Egg survives:** Check above → \`dp[k][n-x]\`
- **Worst case:** \`1 + max(dp[k-1][x-1], dp[k][n-x])\`

Optimize with binary search on the split point.

### Complexity

- **Time:** O(k × n × log n) with binary search optimization
- **Space:** O(k × n)`,
      starterCode: `def egg_drop(eggs, floors):
    # TODO: find minimum trials in worst case
    pass

# Test cases
print(egg_drop(1, 10))   # Expected: 10
print(egg_drop(2, 10))   # Expected: 4
print(egg_drop(2, 6))    # Expected: 3
`,
      solutionCode: `def egg_drop(eggs, floors):
    # dp[k][n] = min trials with k eggs and n floors
    dp = [[0] * (floors + 1) for _ in range(eggs + 1)]

    # Base cases
    for n in range(1, floors + 1):
        dp[1][n] = n  # 1 egg: must try every floor

    for k in range(1, eggs + 1):
        dp[k][0] = 0  # 0 floors: 0 trials
        dp[k][1] = 1  # 1 floor: 1 trial

    for k in range(2, eggs + 1):
        for n in range(2, floors + 1):
            dp[k][n] = float('inf')
            # Binary search for optimal floor
            lo, hi = 1, n
            while lo <= hi:
                mid = (lo + hi) // 2
                breaks = dp[k - 1][mid - 1]
                survives = dp[k][n - mid]
                worst = 1 + max(breaks, survives)
                dp[k][n] = min(dp[k][n], worst)
                if breaks < survives:
                    lo = mid + 1
                elif breaks > survives:
                    hi = mid - 1
                else:
                    break

    return dp[eggs][floors]

# Test cases
print(egg_drop(1, 10))   # Expected: 10
print(egg_drop(2, 10))   # Expected: 4
print(egg_drop(2, 6))    # Expected: 3
`,
    },
    {
      id: "dp-regex-matching",
      slug: "regex-matching",
      title: "Regular Expression Matching",
      content: `## Regular Expression Matching

### Problem Statement

Implement regular expression matching with support for \`'.'\` (matches any single character) and \`'*'\` (matches zero or more of the preceding element). The match must cover the **entire** string.

### Examples

\`\`\`
Input:  s = "aa", p = "a"
Output: False
\`\`\`

\`\`\`
Input:  s = "aa", p = "a*"
Output: True  (a* matches "aa")
\`\`\`

\`\`\`
Input:  s = "ab", p = ".*"
Output: True  (.* matches any string)
\`\`\`

### Approach

\`dp[i][j]\` = True if \`s[0..i-1]\` matches \`p[0..j-1]\`.

Key transitions:
1. If \`p[j-1] == s[i-1]\` or \`p[j-1] == '.'\`: \`dp[i][j] = dp[i-1][j-1]\`
2. If \`p[j-1] == '*'\`:
   - Zero occurrences: \`dp[i][j] = dp[i][j-2]\`
   - One+ occurrences (if \`p[j-2]\` matches \`s[i-1]\`): \`dp[i][j] = dp[i-1][j]\`

### Complexity

- **Time:** O(n × m)
- **Space:** O(n × m)`,
      starterCode: `def is_match(s, p):
    # TODO: implement regex matching with '.' and '*'
    pass

# Test cases
print(is_match("aa", "a"))       # Expected: False
print(is_match("aa", "a*"))      # Expected: True
print(is_match("ab", ".*"))      # Expected: True
print(is_match("aab", "c*a*b"))  # Expected: True
`,
      solutionCode: `def is_match(s, p):
    n, m = len(s), len(p)
    dp = [[False] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = True

    # Handle patterns like a*, a*b*, a*b*c* that can match empty string
    for j in range(2, m + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 2]

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if p[j - 1] == '.' or p[j - 1] == s[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            elif p[j - 1] == '*':
                # Zero occurrences of preceding element
                dp[i][j] = dp[i][j - 2]
                # One or more occurrences
                if p[j - 2] == '.' or p[j - 2] == s[i - 1]:
                    dp[i][j] = dp[i][j] or dp[i - 1][j]

    return dp[n][m]

# Test cases
print(is_match("aa", "a"))       # Expected: False
print(is_match("aa", "a*"))      # Expected: True
print(is_match("ab", ".*"))      # Expected: True
print(is_match("aab", "c*a*b"))  # Expected: True
`,
    },
  ],
};
