import { Module } from "../types";

export const arraysStringsModule: Module = {
  id: "ds-arrays-strings",
  title: "Arrays & Strings",
  description: "Master fundamental array and string techniques that form the backbone of most coding interviews.",
  lessons: [
    {
      id: "ds-arrays-intro",
      slug: "intro-arrays-strings",
      title: "Intro to Arrays & Strings",
      content: `## Intro to Arrays & Strings

Arrays and strings are the most common data structures in coding interviews. Nearly every problem either directly uses them or converts input into one of these forms before processing.

### Why Arrays & Strings Matter

An **array** is a contiguous block of memory holding elements of the same type. This gives you O(1) random access by index — the fundamental operation that makes arrays so powerful.

A **string** in most languages is essentially an array of characters with extra methods. In Python, strings are **immutable**, meaning every modification creates a new string. This has important performance implications.

### Key Complexity Facts

| Operation | Array | Python List | String |
|-----------|-------|-------------|--------|
| Access by index | O(1) | O(1) | O(1) |
| Append | O(1)* | O(1)* | O(n) |
| Insert at i | O(n) | O(n) | O(n) |
| Search | O(n) | O(n) | O(n) |
| Slice [i:j] | O(j-i) | O(j-i) | O(j-i) |

*Amortized — occasionally O(n) when resizing is needed.

### The Two-Pointer Technique

The most fundamental array/string technique is **two pointers**. You maintain two indices and move them based on conditions. This converts many O(n^2) brute-force solutions into O(n).

**Common patterns:**
- **Opposite ends**: Start one pointer at the beginning, one at the end, and move inward (palindrome check, two-sum on sorted array).
- **Same direction**: Both pointers start at the beginning; a fast pointer explores while a slow pointer marks a boundary (remove duplicates, partition).

### Interview Tips

1. Always ask about **edge cases**: empty array, single element, all duplicates.
2. Ask if the array is **sorted** — this unlocks binary search and two-pointer approaches.
3. Consider whether you can **sort first** — O(n log n) sorting may simplify the problem.
4. For strings, ask about **character set** (ASCII? Unicode?) and **case sensitivity**.

In this exercise, implement the classic **two-sum** problem using a hash map for O(n) time, and also practice the two-pointer approach on a sorted array.`,
      starterCode: `def two_sum_hash(nums: list[int], target: int) -> list[int]:
    """
    Given an array of integers and a target sum, return indices
    of the two numbers that add up to the target.
    Assume exactly one solution exists.

    Approach: Use a hash map to store seen values.
    Time: O(n), Space: O(n)
    """
    # TODO: Create a dictionary to map value -> index
    # TODO: For each number, check if (target - num) is in the dict
    # TODO: If found, return the pair of indices
    # TODO: Otherwise, add current num and index to dict
    pass


def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    """
    Given a SORTED array, find two numbers that add up to target.
    Return their indices.

    Approach: Two pointers from opposite ends.
    Time: O(n), Space: O(1)
    """
    # TODO: Initialize left pointer at 0, right pointer at end
    # TODO: While left < right:
    #   - If sum == target, return indices
    #   - If sum < target, move left pointer right
    #   - If sum > target, move right pointer left
    pass


# Test cases
print(two_sum_hash([2, 7, 11, 15], 9))       # [0, 1]
print(two_sum_hash([3, 2, 4], 6))             # [1, 2]
print(two_sum_hash([3, 3], 6))                # [0, 1]

print(two_sum_sorted([1, 2, 7, 11, 15], 9))   # [0, 2]
print(two_sum_sorted([2, 3, 4], 6))            # [0, 2]
`,
      solutionCode: `def two_sum_hash(nums: list[int], target: int) -> list[int]:
    """
    Given an array of integers and a target sum, return indices
    of the two numbers that add up to the target.
    Assume exactly one solution exists.

    Approach: Use a hash map to store seen values.
    Time: O(n), Space: O(n)
    """
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # Should never reach here if exactly one solution exists


def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    """
    Given a SORTED array, find two numbers that add up to target.
    Return their indices.

    Approach: Two pointers from opposite ends.
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(nums) - 1
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1  # Need a larger sum
        else:
            right -= 1  # Need a smaller sum
    return []


# Test cases
print(two_sum_hash([2, 7, 11, 15], 9))       # [0, 1]
print(two_sum_hash([3, 2, 4], 6))             # [1, 2]
print(two_sum_hash([3, 3], 6))                # [0, 1]

print(two_sum_sorted([1, 2, 7, 11, 15], 9))   # [0, 2]
print(two_sum_sorted([2, 3, 4], 6))            # [0, 2]
`,
    },
    {
      id: "ds-inplace-array",
      slug: "in-place-array-manipulation",
      title: "In-Place Array Manipulation",
      content: `## In-Place Array Manipulation

In-place operations modify an array without allocating significant extra memory. Interviewers love these problems because they test your ability to manage state carefully within tight constraints.

### Why In-Place Matters

When an interviewer says "do it in O(1) extra space," they want you to rearrange elements within the existing array. This is common in problems involving:
- Removing duplicates from sorted arrays
- Moving zeros to the end
- Rotating arrays
- Partitioning (Dutch National Flag)

### The Read-Write Pointer Pattern

The most powerful in-place technique uses a **write pointer** that tracks where the next valid element should go, and a **read pointer** that scans through the array.

\`\`\`
[0, 1, 0, 3, 12]  →  [1, 3, 12, 0, 0]
 r                     w
 w
\`\`\`

The write pointer only advances when we place a valid element. The read pointer always advances.

### Dutch National Flag (3-Way Partition)

When you need to partition an array into three groups (like sorting an array of 0s, 1s, and 2s), use three pointers: low, mid, and high. Elements before low are group 1, between low and mid are group 2, and after high are group 3.

### Rotation Techniques

To rotate an array by k positions:
1. **Brute force**: Rotate one position k times — O(n*k)
2. **Extra array**: Copy to correct positions — O(n) time, O(n) space
3. **Reversal trick**: Reverse entire array, then reverse first k and last n-k — O(n) time, O(1) space

The reversal trick is elegant and a favorite in interviews.

### Common Pitfalls

- **Off-by-one errors**: Double-check your loop bounds when swapping.
- **Forgetting to handle k > n**: Always do k = k % n for rotation.
- **Not preserving relative order**: Some problems require stable partitioning.

In this exercise, implement move-zeros and array rotation in-place.`,
      starterCode: `def move_zeros(nums: list[int]) -> None:
    """
    Move all 0s to the end of the array while maintaining
    the relative order of non-zero elements. Modify in-place.

    Time: O(n), Space: O(1)
    """
    # TODO: Use a write pointer starting at 0
    # TODO: Scan with read pointer — when non-zero found,
    #       place it at write pointer position, advance write
    # TODO: Fill remaining positions with zeros
    pass


def rotate_array(nums: list[int], k: int) -> None:
    """
    Rotate array to the right by k steps. Modify in-place.
    Example: [1,2,3,4,5,6,7], k=3 → [5,6,7,1,2,3,4]

    Approach: Three reversals.
    Time: O(n), Space: O(1)
    """
    # TODO: Handle k > len(nums) with modulo
    # TODO: Implement a helper to reverse a subarray in-place
    # TODO: Reverse entire array
    # TODO: Reverse first k elements
    # TODO: Reverse remaining elements
    pass


def sort_colors(nums: list[int]) -> None:
    """
    Sort an array containing only 0, 1, and 2 in-place.
    (Dutch National Flag problem)

    Time: O(n), Space: O(1)
    """
    # TODO: Initialize low=0, mid=0, high=len(nums)-1
    # TODO: While mid <= high:
    #   - If nums[mid] == 0: swap with low, advance both
    #   - If nums[mid] == 1: just advance mid
    #   - If nums[mid] == 2: swap with high, decrement high
    pass


# Test cases
nums1 = [0, 1, 0, 3, 12]
move_zeros(nums1)
print(nums1)  # [1, 3, 12, 0, 0]

nums2 = [1, 2, 3, 4, 5, 6, 7]
rotate_array(nums2, 3)
print(nums2)  # [5, 6, 7, 1, 2, 3, 4]

nums3 = [2, 0, 2, 1, 1, 0]
sort_colors(nums3)
print(nums3)  # [0, 0, 1, 1, 2, 2]
`,
      solutionCode: `def move_zeros(nums: list[int]) -> None:
    """
    Move all 0s to the end of the array while maintaining
    the relative order of non-zero elements. Modify in-place.

    Time: O(n), Space: O(1)
    """
    write = 0
    # Move all non-zero elements to the front
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1
    # Fill the rest with zeros
    while write < len(nums):
        nums[write] = 0
        write += 1


def rotate_array(nums: list[int], k: int) -> None:
    """
    Rotate array to the right by k steps. Modify in-place.
    Example: [1,2,3,4,5,6,7], k=3 → [5,6,7,1,2,3,4]

    Approach: Three reversals.
    Time: O(n), Space: O(1)
    """
    n = len(nums)
    k = k % n  # Handle k > n

    def reverse(left: int, right: int) -> None:
        while left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1

    reverse(0, n - 1)      # Reverse entire array
    reverse(0, k - 1)      # Reverse first k elements
    reverse(k, n - 1)      # Reverse remaining elements


def sort_colors(nums: list[int]) -> None:
    """
    Sort an array containing only 0, 1, and 2 in-place.
    (Dutch National Flag problem)

    Time: O(n), Space: O(1)
    """
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # Don't advance mid — swapped element needs checking


# Test cases
nums1 = [0, 1, 0, 3, 12]
move_zeros(nums1)
print(nums1)  # [1, 3, 12, 0, 0]

nums2 = [1, 2, 3, 4, 5, 6, 7]
rotate_array(nums2, 3)
print(nums2)  # [5, 6, 7, 1, 2, 3, 4]

nums3 = [2, 0, 2, 1, 1, 0]
sort_colors(nums3)
print(nums3)  # [0, 0, 1, 1, 2, 2]
`,
    },
    {
      id: "ds-kmp",
      slug: "string-pattern-matching",
      title: "String Pattern Matching (KMP)",
      content: `## String Pattern Matching (KMP)

The Knuth-Morris-Pratt algorithm is one of the most elegant string matching algorithms. It finds all occurrences of a pattern in a text in O(n + m) time, where n is the text length and m is the pattern length.

### The Naive Approach Problem

The brute-force approach checks every position in the text as a potential starting point, giving O(n * m) time. For each mismatch, it backtracks the text pointer and starts over — wasting work already done.

### KMP's Key Insight

When a mismatch occurs, we already know some characters in the text (the ones that matched so far). KMP uses a **failure function** (also called the LPS array — Longest Proper Prefix that is also a Suffix) to skip unnecessary comparisons.

### Building the LPS Array

For pattern "ABABAC":
\`\`\`
Index:   0  1  2  3  4  5
Char:    A  B  A  B  A  C
LPS:     0  0  1  2  3  0
\`\`\`

At index 4, the longest prefix that's also a suffix of "ABABA" is "ABA" (length 3). So if we mismatch after "ABABA", we can skip ahead and continue matching from index 3 of the pattern.

### How KMP Search Works

1. Build the LPS array from the pattern.
2. Use two pointers: \`i\` for text, \`j\` for pattern.
3. If characters match, advance both.
4. If mismatch and j > 0, set j = lps[j-1] (don't move i).
5. If mismatch and j == 0, advance i.
6. If j reaches pattern length, we found a match.

### When to Use KMP

- Finding all occurrences of a substring
- Checking if a string is a rotation of another (concatenate string with itself, then search)
- Problems involving repeated patterns or periods

### Interview Reality

Most interviews won't ask you to implement KMP from scratch. However, understanding the LPS concept helps with many string problems. More commonly, you'll use Python's built-in \`str.find()\` or \`in\` operator, but knowing what's underneath impresses interviewers.

Implement the LPS array construction and the KMP search algorithm.`,
      starterCode: `def build_lps(pattern: str) -> list[int]:
    """
    Build the Longest Proper Prefix which is also Suffix (LPS) array.

    lps[i] = length of the longest proper prefix of pattern[0..i]
             that is also a suffix of pattern[0..i].

    Time: O(m), Space: O(m) where m = len(pattern)
    """
    # TODO: Initialize lps array of zeros with length = len(pattern)
    # TODO: Use two pointers: length (tracks current lps length) and i (starts at 1)
    # TODO: If pattern[i] == pattern[length], increment length, set lps[i], advance i
    # TODO: Else if length > 0, set length = lps[length - 1] (don't advance i)
    # TODO: Else set lps[i] = 0 and advance i
    pass


def kmp_search(text: str, pattern: str) -> list[int]:
    """
    Find all occurrences of pattern in text using KMP algorithm.
    Returns list of starting indices where pattern is found.

    Time: O(n + m), Space: O(m)
    """
    # TODO: Handle edge cases (empty pattern, pattern longer than text)
    # TODO: Build the LPS array
    # TODO: Use two pointers i (text) and j (pattern)
    # TODO: If match found (j == len(pattern)), record index, set j = lps[j-1]
    # TODO: Return list of all match positions
    pass


def is_rotation(s1: str, s2: str) -> bool:
    """
    Check if s2 is a rotation of s1.
    Example: "waterbottle" is a rotation of "erbottlewat"

    Trick: s2 is a rotation of s1 iff s2 is a substring of s1+s1
    """
    # TODO: Check lengths are equal
    # TODO: Use kmp_search on s1+s1 to find s2
    pass


# Test cases
print(build_lps("ABABAC"))              # [0, 0, 1, 2, 3, 0]
print(build_lps("AAAA"))                # [0, 1, 2, 3]

print(kmp_search("ABABDABACDABABCABAB", "ABABCABAB"))  # [10]
print(kmp_search("AAAAAA", "AA"))       # [0, 1, 2, 3, 4]

print(is_rotation("waterbottle", "erbottlewat"))  # True
print(is_rotation("hello", "lloeh"))              # False
`,
      solutionCode: `def build_lps(pattern: str) -> list[int]:
    """
    Build the Longest Proper Prefix which is also Suffix (LPS) array.

    lps[i] = length of the longest proper prefix of pattern[0..i]
             that is also a suffix of pattern[0..i].

    Time: O(m), Space: O(m) where m = len(pattern)
    """
    m = len(pattern)
    lps = [0] * m
    length = 0  # Length of previous longest prefix suffix
    i = 1

    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length > 0:
                # Don't advance i — try shorter prefix
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    return lps


def kmp_search(text: str, pattern: str) -> list[int]:
    """
    Find all occurrences of pattern in text using KMP algorithm.
    Returns list of starting indices where pattern is found.

    Time: O(n + m), Space: O(m)
    """
    if not pattern:
        return []
    if len(pattern) > len(text):
        return []

    lps = build_lps(pattern)
    results = []
    i = 0  # Pointer for text
    j = 0  # Pointer for pattern

    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1

        if j == len(pattern):
            # Found a match starting at index i - j
            results.append(i - j)
            j = lps[j - 1]  # Continue searching for more matches
        elif i < len(text) and text[i] != pattern[j]:
            if j > 0:
                j = lps[j - 1]  # Skip ahead using LPS
            else:
                i += 1

    return results


def is_rotation(s1: str, s2: str) -> bool:
    """
    Check if s2 is a rotation of s1.
    Example: "waterbottle" is a rotation of "erbottlewat"

    Trick: s2 is a rotation of s1 iff s2 is a substring of s1+s1
    """
    if len(s1) != len(s2):
        return False
    # s2 is a rotation of s1 iff s2 appears in s1 concatenated with itself
    doubled = s1 + s1
    return len(kmp_search(doubled, s2)) > 0


# Test cases
print(build_lps("ABABAC"))              # [0, 0, 1, 2, 3, 0]
print(build_lps("AAAA"))                # [0, 1, 2, 3]

print(kmp_search("ABABDABACDABABCABAB", "ABABCABAB"))  # [10]
print(kmp_search("AAAAAA", "AA"))       # [0, 1, 2, 3, 4]

print(is_rotation("waterbottle", "erbottlewat"))  # True
print(is_rotation("hello", "lloeh"))              # False
`,
    },
    {
      id: "ds-matrix-traversal",
      slug: "matrix-traversal",
      title: "Matrix Traversal",
      content: `## Matrix Traversal

Matrix problems appear frequently in interviews. They test your ability to navigate 2D space, handle boundaries correctly, and think about direction vectors.

### Representing a Matrix

A matrix is simply a list of lists. For an m x n matrix:
- \`matrix[i][j]\` accesses row i, column j
- Rows: 0 to m-1, Columns: 0 to n-1

### Direction Vectors

The key trick for matrix traversal is using **direction arrays**:

\`\`\`python
# 4 directions: up, down, left, right
dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]

# 8 directions (including diagonals)
dirs = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]
\`\`\`

### Spiral Order Traversal

This classic problem asks you to return all elements of a matrix in spiral order. The approach uses four boundaries (top, bottom, left, right) that shrink inward:

1. Traverse right along top row, then shrink top.
2. Traverse down along right column, then shrink right.
3. Traverse left along bottom row, then shrink bottom.
4. Traverse up along left column, then shrink left.

### Boundary Checking

The most common bug in matrix problems is going out of bounds. Always validate:
\`\`\`python
def is_valid(r, c, rows, cols):
    return 0 <= r < rows and 0 <= c < cols
\`\`\`

### DFS on a Matrix

Many matrix problems (number of islands, flood fill, word search) use DFS. Mark visited cells to avoid cycles — either use a separate visited set or modify the matrix in-place.

### Interview Tips

- Always clarify: Can I modify the matrix? (Affects whether you need a visited set.)
- Watch for the difference between m x n and n x n (square vs rectangular).
- Spiral traversal is a common follow-up to basic traversal questions.

Implement spiral order traversal and matrix rotation.`,
      starterCode: `def spiral_order(matrix: list[list[int]]) -> list[int]:
    """
    Return all elements of the matrix in spiral order.

    Example: [[1,2,3],[4,5,6],[7,8,9]] → [1,2,3,6,9,8,7,4,5]

    Time: O(m*n), Space: O(1) extra (excluding output)
    """
    # TODO: Handle empty matrix
    # TODO: Initialize top, bottom, left, right boundaries
    # TODO: While top <= bottom and left <= right:
    #   - Traverse right across top row
    #   - Traverse down right column
    #   - Traverse left across bottom row (if top <= bottom)
    #   - Traverse up left column (if left <= right)
    #   - Shrink boundaries after each direction
    pass


def rotate_matrix(matrix: list[list[int]]) -> None:
    """
    Rotate an n x n matrix 90 degrees clockwise in-place.

    Approach: Transpose then reverse each row.
    Time: O(n^2), Space: O(1)
    """
    # TODO: Transpose the matrix (swap matrix[i][j] with matrix[j][i])
    # TODO: Reverse each row
    pass


# Test cases
print(spiral_order([[1,2,3],[4,5,6],[7,8,9]]))
# [1, 2, 3, 6, 9, 8, 7, 4, 5]

print(spiral_order([[1,2,3,4],[5,6,7,8],[9,10,11,12]]))
# [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]

mat = [[1,2,3],[4,5,6],[7,8,9]]
rotate_matrix(mat)
print(mat)  # [[7,4,1],[8,5,2],[9,6,3]]
`,
      solutionCode: `def spiral_order(matrix: list[list[int]]) -> list[int]:
    """
    Return all elements of the matrix in spiral order.

    Example: [[1,2,3],[4,5,6],[7,8,9]] → [1,2,3,6,9,8,7,4,5]

    Time: O(m*n), Space: O(1) extra (excluding output)
    """
    if not matrix or not matrix[0]:
        return []

    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1

    while top <= bottom and left <= right:
        # Traverse right across top row
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        top += 1

        # Traverse down right column
        for row in range(top, bottom + 1):
            result.append(matrix[row][right])
        right -= 1

        # Traverse left across bottom row
        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])
            bottom -= 1

        # Traverse up left column
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])
            left += 1

    return result


def rotate_matrix(matrix: list[list[int]]) -> None:
    """
    Rotate an n x n matrix 90 degrees clockwise in-place.

    Approach: Transpose then reverse each row.
    Time: O(n^2), Space: O(1)
    """
    n = len(matrix)

    # Step 1: Transpose (swap across diagonal)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

    # Step 2: Reverse each row
    for row in matrix:
        row.reverse()


# Test cases
print(spiral_order([[1,2,3],[4,5,6],[7,8,9]]))
# [1, 2, 3, 6, 9, 8, 7, 4, 5]

print(spiral_order([[1,2,3,4],[5,6,7,8],[9,10,11,12]]))
# [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]

mat = [[1,2,3],[4,5,6],[7,8,9]]
rotate_matrix(mat)
print(mat)  # [[7,4,1],[8,5,2],[9,6,3]]
`,
    },
    {
      id: "ds-prefix-sum",
      slug: "prefix-sum-difference-arrays",
      title: "Prefix Sum & Difference Arrays",
      content: `## Prefix Sum & Difference Arrays

Prefix sums are one of the most useful preprocessing techniques in competitive programming and interviews. They turn range sum queries from O(n) to O(1) after an O(n) setup.

### The Prefix Sum Idea

Given array \`nums\`, build a prefix sum array where \`prefix[i] = sum(nums[0..i-1])\`:

\`\`\`
nums:   [3, 1, 4, 1, 5]
prefix: [0, 3, 4, 8, 9, 14]
\`\`\`

Now the sum of any subarray \`nums[i..j]\` is simply \`prefix[j+1] - prefix[i]\`. This is O(1) per query after O(n) preprocessing.

### Applications

1. **Subarray Sum Equals K**: Use a hash map to count prefix sums. If \`prefix[j] - prefix[i] = k\`, then the subarray \`nums[i..j-1]\` sums to k. Track counts of prefix sums seen so far.

2. **Range Sum Queries**: Build prefix sum once, answer unlimited queries in O(1) each.

3. **Equilibrium Index**: Find index where left sum equals right sum. Use total sum and running left sum.

### Difference Arrays

The **inverse** of prefix sums. Used when you need to apply many range updates efficiently.

To add value \`v\` to all elements in range \`[l, r]\`:
\`\`\`python
diff[l] += v
diff[r + 1] -= v
\`\`\`

After all updates, compute the prefix sum of the difference array to get the final values. Each range update is O(1) instead of O(n).

### 2D Prefix Sums

For matrix range sum queries, build a 2D prefix sum:
\`\`\`
prefix[i][j] = sum of all elements in submatrix from (0,0) to (i-1,j-1)
\`\`\`

Query for submatrix (r1,c1) to (r2,c2):
\`\`\`
prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1]
\`\`\`

### Interview Frequency

Prefix sum problems are extremely common at companies like Google, Meta, and Amazon. The "subarray sum equals k" variant alone appears in hundreds of interview reports.

Implement subarray sum equals k and range update with difference arrays.`,
      starterCode: `def subarray_sum_k(nums: list[int], k: int) -> int:
    """
    Count the number of contiguous subarrays that sum to k.

    Approach: Prefix sum + hash map.
    Time: O(n), Space: O(n)
    """
    # TODO: Initialize count = 0, running prefix_sum = 0
    # TODO: Use a dict to track frequency of each prefix_sum seen
    # TODO: Start with {0: 1} (empty prefix)
    # TODO: For each num, update prefix_sum
    # TODO: If (prefix_sum - k) exists in dict, add its count
    # TODO: Add current prefix_sum to dict
    pass


def range_update(length: int, updates: list[list[int]]) -> list[int]:
    """
    Given an array of zeros with given length, apply range updates.
    Each update is [start, end, value] — add value to all elements
    from index start to end (inclusive).

    Return the final array after all updates.

    Approach: Difference array.
    Time: O(n + u) where u = number of updates
    """
    # TODO: Create difference array of zeros
    # TODO: For each update [l, r, v]: diff[l] += v, diff[r+1] -= v
    # TODO: Compute prefix sum of diff array to get result
    pass


# Test cases
print(subarray_sum_k([1, 1, 1], 2))           # 2
print(subarray_sum_k([1, 2, 3], 3))           # 2
print(subarray_sum_k([1, -1, 0], 0))          # 3

print(range_update(5, [[1, 3, 2], [2, 4, 3], [0, 2, -2]]))
# [-2, 0, 3, 5, 3]
`,
      solutionCode: `def subarray_sum_k(nums: list[int], k: int) -> int:
    """
    Count the number of contiguous subarrays that sum to k.

    Approach: Prefix sum + hash map.
    Time: O(n), Space: O(n)
    """
    count = 0
    prefix_sum = 0
    # Map from prefix_sum value to how many times we've seen it
    seen = {0: 1}  # Empty prefix has sum 0

    for num in nums:
        prefix_sum += num
        # If (prefix_sum - k) was a previous prefix sum,
        # then the subarray between them sums to k
        if prefix_sum - k in seen:
            count += seen[prefix_sum - k]
        # Record this prefix sum
        seen[prefix_sum] = seen.get(prefix_sum, 0) + 1

    return count


def range_update(length: int, updates: list[list[int]]) -> list[int]:
    """
    Given an array of zeros with given length, apply range updates.
    Each update is [start, end, value] — add value to all elements
    from index start to end (inclusive).

    Return the final array after all updates.

    Approach: Difference array.
    Time: O(n + u) where u = number of updates
    """
    diff = [0] * (length + 1)  # Extra space for boundary

    for start, end, val in updates:
        diff[start] += val
        if end + 1 < len(diff):
            diff[end + 1] -= val

    # Compute prefix sum to get final array
    result = [0] * length
    running = 0
    for i in range(length):
        running += diff[i]
        result[i] = running

    return result


# Test cases
print(subarray_sum_k([1, 1, 1], 2))           # 2
print(subarray_sum_k([1, 2, 3], 3))           # 2
print(subarray_sum_k([1, -1, 0], 0))          # 3

print(range_update(5, [[1, 3, 2], [2, 4, 3], [0, 2, -2]]))
# [-2, 0, 3, 5, 3]
`,
    },
    {
      id: "ds-2d-techniques",
      slug: "2d-array-techniques",
      title: "2D Array Techniques",
      content: `## 2D Array Techniques

Beyond basic traversal, many interview problems require sophisticated 2D array techniques: searching in sorted matrices, flood fill, and island counting.

### Search in a Sorted Matrix

When a matrix has rows and columns sorted in ascending order, you can search in O(m + n) by starting from the **top-right corner** (or bottom-left):
- If target equals current: found it.
- If target is less: move left (eliminate column).
- If target is greater: move down (eliminate row).

This eliminates one row or column per step.

### Flood Fill (BFS/DFS on Grid)

Flood fill changes all connected cells of the same color starting from a given cell. It's the paint bucket tool in image editors. Use BFS or DFS:

1. Check if starting cell already has the target color (avoid infinite loop).
2. Use a queue (BFS) or recursion (DFS).
3. For each cell, change its color and add valid neighbors.

### Number of Islands

Given a grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.

**Approach**: Scan the grid. When you find a '1', increment count and DFS/BFS to mark all connected '1's as visited (change to '0' or use a visited set).

### Common Patterns

- **Layer-by-layer BFS**: Used for shortest path in unweighted grid, rotting oranges, etc. Process all cells at the current distance before moving to the next.
- **Multi-source BFS**: Start BFS from multiple cells simultaneously (e.g., rotting oranges starts from all rotten cells at once).

### Performance Note

For grid problems with m rows and n columns, time complexity is typically O(m * n) since you visit each cell at most once. Space is O(m * n) for the recursion stack or queue in the worst case.

Implement search in sorted matrix, flood fill, and number of islands.`,
      starterCode: `def search_sorted_matrix(matrix: list[list[int]], target: int) -> bool:
    """
    Search for target in a matrix where each row and column
    is sorted in ascending order.

    Time: O(m + n), Space: O(1)
    """
    # TODO: Start from top-right corner
    # TODO: If target < current, move left
    # TODO: If target > current, move down
    # TODO: If equal, return True
    pass


def flood_fill(image: list[list[int]], sr: int, sc: int, color: int) -> list[list[int]]:
    """
    Perform flood fill starting from (sr, sc) with new color.
    Change all connected cells with the same original color.

    Time: O(m * n), Space: O(m * n)
    """
    # TODO: Get original color at (sr, sc)
    # TODO: If original color == new color, return (avoid infinite loop)
    # TODO: DFS/BFS to change all connected same-color cells
    pass


def num_islands(grid: list[list[str]]) -> int:
    """
    Count number of islands in a grid of '1's and '0's.

    Time: O(m * n), Space: O(m * n)
    """
    # TODO: For each cell, if it's '1':
    #   - Increment island count
    #   - DFS to mark all connected '1's as '0' (visited)
    pass


# Test cases
matrix = [
    [1,  4,  7, 11],
    [2,  5,  8, 12],
    [3,  6,  9, 16],
    [10, 13, 14, 17]
]
print(search_sorted_matrix(matrix, 5))   # True
print(search_sorted_matrix(matrix, 20))  # False

image = [[1,1,1],[1,1,0],[1,0,1]]
print(flood_fill(image, 1, 1, 2))
# [[2,2,2],[2,2,0],[2,0,1]]

grid = [
    ["1","1","0","0","0"],
    ["1","1","0","0","0"],
    ["0","0","1","0","0"],
    ["0","0","0","1","1"]
]
print(num_islands(grid))  # 3
`,
      solutionCode: `def search_sorted_matrix(matrix: list[list[int]], target: int) -> bool:
    """
    Search for target in a matrix where each row and column
    is sorted in ascending order.

    Time: O(m + n), Space: O(1)
    """
    if not matrix or not matrix[0]:
        return False

    rows, cols = len(matrix), len(matrix[0])
    # Start from top-right corner
    r, c = 0, cols - 1

    while r < rows and c >= 0:
        if matrix[r][c] == target:
            return True
        elif matrix[r][c] > target:
            c -= 1  # Eliminate this column
        else:
            r += 1  # Eliminate this row

    return False


def flood_fill(image: list[list[int]], sr: int, sc: int, color: int) -> list[list[int]]:
    """
    Perform flood fill starting from (sr, sc) with new color.
    Change all connected cells with the same original color.

    Time: O(m * n), Space: O(m * n)
    """
    original = image[sr][sc]
    if original == color:
        return image  # No change needed — avoids infinite loop

    rows, cols = len(image), len(image[0])

    def dfs(r: int, c: int) -> None:
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if image[r][c] != original:
            return
        image[r][c] = color
        dfs(r - 1, c)
        dfs(r + 1, c)
        dfs(r, c - 1)
        dfs(r, c + 1)

    dfs(sr, sc)
    return image


def num_islands(grid: list[list[str]]) -> int:
    """
    Count number of islands in a grid of '1's and '0's.

    Time: O(m * n), Space: O(m * n)
    """
    if not grid or not grid[0]:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r: int, c: int) -> None:
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] != "1":
            return
        grid[r][c] = "0"  # Mark as visited
        dfs(r - 1, c)
        dfs(r + 1, c)
        dfs(r, c - 1)
        dfs(r, c + 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                dfs(r, c)  # Sink the entire island

    return count


# Test cases
matrix = [
    [1,  4,  7, 11],
    [2,  5,  8, 12],
    [3,  6,  9, 16],
    [10, 13, 14, 17]
]
print(search_sorted_matrix(matrix, 5))   # True
print(search_sorted_matrix(matrix, 20))  # False

image = [[1,1,1],[1,1,0],[1,0,1]]
print(flood_fill(image, 1, 1, 2))
# [[2,2,2],[2,2,0],[2,0,1]]

grid = [
    ["1","1","0","0","0"],
    ["1","1","0","0","0"],
    ["0","0","1","0","0"],
    ["0","0","0","1","1"]
]
print(num_islands(grid))  # 3
`,
    },
  ],
};
