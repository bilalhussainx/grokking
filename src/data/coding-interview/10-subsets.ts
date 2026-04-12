import { Module } from "../types";

export const subsetsModule: Module = {
  id: "subsets",
  title: "Subsets",
  description: "Master the Subsets pattern using BFS-based generation to enumerate subsets, permutations, and combinatorial structures.",
  lessons: [
    {
      id: "subsets-intro",
      slug: "subsets-intro",
      title: "Introduction to Subsets",
      content: `# Subsets Pattern

The **Subsets** pattern (also called **BFS-based enumeration**) builds all subsets iteratively by extending previously generated subsets one element at a time. It is a versatile technique for problems involving combinations, permutations, and constrained generation.

## Core Idea

Start with an empty set. For each new element, take every existing subset and create a copy that includes the new element. Append these new subsets to the list.

\`\`\`
Start: [[]]
Add 1: [[], [1]]
Add 2: [[], [1], [2], [1,2]]
Add 3: [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
\`\`\`

This naturally produces all 2^n subsets of n elements.

## Handling Duplicates

When the input contains duplicates, sort it first. When processing a duplicate element, only extend the subsets that were added in the previous round (not all existing subsets). This prevents generating duplicate subsets.

## Handling Permutations

For permutations, instead of appending the new element only at the end, insert it at every possible position within each existing permutation. This yields n! results for n distinct elements.

## When to Use This Pattern

- Generate all subsets or combinations
- Generate all permutations
- Generate strings with specific constraints (e.g., balanced parentheses)
- Any problem requiring exhaustive enumeration of possibilities

## Complexity Note

Since the number of subsets is 2^n and permutations is n!, these algorithms are inherently exponential. The pattern itself is optimal — the output size dominates.`,
    },
    {
      id: "subsets-basic",
      slug: "subsets-basic",
      title: "Subsets",
      content: `# Subsets

## Problem Statement

Given a set of **distinct** integers, return all possible subsets (the power set). The solution must not contain duplicate subsets.

## Examples

**Example 1:**
\`\`\`
Input: [1, 3]
Output: [[], [1], [3], [1, 3]]
\`\`\`

**Example 2:**
\`\`\`
Input: [1, 5, 3]
Output: [[], [1], [5], [1,5], [3], [1,3], [5,3], [1,5,3]]
\`\`\`

## Approach

Use BFS-style iterative generation:

1. Start with a list containing just the empty subset: \`[[]]\`.
2. For each number in the input:
   - Take every existing subset.
   - Create a new subset by appending the current number.
   - Add all new subsets to the list.
3. Return the complete list.

This is straightforward and avoids recursion. Each element doubles the number of subsets.

**Time Complexity:** O(n * 2^n) — there are 2^n subsets, each up to length n.
**Space Complexity:** O(n * 2^n) for storing all subsets.`,
      starterCode: `def find_subsets(nums):
    # TODO: Return all subsets of the input list
    subsets = []
    return subsets

# Test cases
print(find_subsets([1, 3]))
# Expected: [[], [1], [3], [1, 3]]

print(find_subsets([1, 5, 3]))
# Expected: [[], [1], [5], [1, 5], [3], [1, 3], [5, 3], [1, 5, 3]]
`,
      solutionCode: `def find_subsets(nums):
    subsets = [[]]
    for num in nums:
        new_subsets = []
        for subset in subsets:
            new_subsets.append(subset + [num])
        subsets.extend(new_subsets)
    return subsets

# Test cases
print(find_subsets([1, 3]))
# Expected: [[], [1], [3], [1, 3]]

print(find_subsets([1, 5, 3]))
# Expected: [[], [1], [5], [1, 5], [3], [1, 3], [5, 3], [1, 5, 3]]
`,
    },
    {
      id: "subsets-duplicates",
      slug: "subsets-duplicates",
      title: "Subsets With Duplicates",
      content: `# Subsets With Duplicates

## Problem Statement

Given a set of numbers that **may contain duplicates**, find all distinct subsets.

## Examples

**Example 1:**
\`\`\`
Input: [1, 3, 3]
Output: [[], [1], [3], [1,3], [3,3], [1,3,3]]
\`\`\`

**Example 2:**
\`\`\`
Input: [1, 5, 3, 3]
Output: [[], [1], [3], [1,3], [3,3], [1,3,3], [5], [1,5], [3,5], [1,3,5], [3,3,5], [1,3,3,5]]
\`\`\`

## Approach

1. **Sort** the input so duplicates are adjacent.
2. Start with \`[[]]\`.
3. For each element:
   - If it is the **same as the previous element**, only extend the subsets that were newly added in the previous iteration (not all subsets).
   - If it is different, extend all existing subsets as normal.
4. Track the start index of newly added subsets from the previous round.

This avoids generating duplicate subsets because a duplicate element only combines with subsets that already contain its predecessor.

**Time Complexity:** O(n * 2^n) in the worst case.
**Space Complexity:** O(n * 2^n) for all subsets.`,
      starterCode: `def find_subsets_with_duplicates(nums):
    # TODO: Return all distinct subsets
    subsets = []
    return subsets

# Test cases
print(find_subsets_with_duplicates([1, 3, 3]))
# Expected: [[], [1], [3], [1, 3], [3, 3], [1, 3, 3]]

print(find_subsets_with_duplicates([1, 5, 3, 3]))
# Expected: [[], [1], [3], [1, 3], [3, 3], [1, 3, 3], [5], [1, 5], [3, 5], [1, 3, 5], [3, 3, 5], [1, 3, 3, 5]]
`,
      solutionCode: `def find_subsets_with_duplicates(nums):
    nums.sort()
    subsets = [[]]
    start_index = 0

    for i in range(len(nums)):
        # If current is duplicate, only extend subsets added last round
        if i > 0 and nums[i] == nums[i - 1]:
            begin = start_index
        else:
            begin = 0

        start_index = len(subsets)
        new_subsets = []
        for j in range(begin, len(subsets)):
            new_subsets.append(subsets[j] + [nums[i]])
        subsets.extend(new_subsets)

    return subsets

# Test cases
print(find_subsets_with_duplicates([1, 3, 3]))
# Expected: [[], [1], [3], [1, 3], [3, 3], [1, 3, 3]]

print(find_subsets_with_duplicates([1, 5, 3, 3]))
# Expected: [[], [1], [3], [1, 3], [3, 3], [1, 3, 3], [5], [1, 5], [3, 5], [1, 3, 5], [3, 3, 5], [1, 3, 3, 5]]
`,
    },
    {
      id: "subsets-permutations",
      slug: "subsets-permutations",
      title: "Permutations",
      content: `# Permutations

## Problem Statement

Given a set of **distinct** numbers, find all permutations.

## Examples

**Example 1:**
\`\`\`
Input: [1, 3, 5]
Output: [[1,3,5],[1,5,3],[3,1,5],[3,5,1],[5,1,3],[5,3,1]]
\`\`\`

**Example 2:**
\`\`\`
Input: [1, 2]
Output: [[1,2],[2,1]]
\`\`\`

## Approach

Use BFS-style generation, but instead of appending the element only at the end, **insert it at every possible position** in each existing permutation:

1. Start with the first element: \`[[1]]\`.
2. For the next element (e.g., 3), take each existing permutation and insert 3 at every index:
   - \`[1]\` → \`[3,1]\`, \`[1,3]\`
3. For the next element (e.g., 5), insert 5 at positions 0, 1, 2 in each length-2 permutation.
4. Continue until all elements are placed.

This builds all n! permutations without recursion.

**Time Complexity:** O(n * n!) — n! permutations, each of length n.
**Space Complexity:** O(n * n!) for storing all permutations.

The iterative approach is clean and avoids managing recursion state, though the recursive backtracking approach works equally well.`,
      starterCode: `def find_permutations(nums):
    # TODO: Return all permutations of the input list
    result = []
    return result

# Test cases
print(find_permutations([1, 3, 5]))
# Expected: [[1,3,5],[1,5,3],[3,1,5],[3,5,1],[5,1,3],[5,3,1]]

print(find_permutations([1, 2]))
# Expected: [[1, 2], [2, 1]]
`,
      solutionCode: `def find_permutations(nums):
    result = [[]]

    for num in nums:
        new_perms = []
        for perm in result:
            for i in range(len(perm) + 1):
                new_perm = list(perm)
                new_perm.insert(i, num)
                new_perms.append(new_perm)
        result = new_perms

    return result

# Test cases
print(find_permutations([1, 3, 5]))
# Expected: [[5,3,1],[5,1,3],[3,5,1],[1,5,3],[3,1,5],[1,3,5]]

print(find_permutations([1, 2]))
# Expected: [[2, 1], [1, 2]]
`,
    },
    {
      id: "subsets-string-case-permutations",
      slug: "subsets-string-case-permutations",
      title: "String Permutations by Changing Case",
      content: `# String Permutations by Changing Case

## Problem Statement

Given a string, find all permutations of it by changing the case of individual letters. Non-letter characters remain unchanged.

## Examples

**Example 1:**
\`\`\`
Input: "ab7c"
Output: ["ab7c", "Ab7c", "aB7c", "AB7c", "ab7C", "Ab7C", "aB7C", "AB7C"]
\`\`\`

**Example 2:**
\`\`\`
Input: "a1b"
Output: ["a1b", "A1b", "a1B", "A1B"]
\`\`\`

**Example 3:**
\`\`\`
Input: "12"
Output: ["12"]
\`\`\`

## Approach

This is a variation of the subsets pattern applied to characters:

1. Start with the original string in the result list.
2. Iterate through each character:
   - If the character is a letter, take every existing string in the result and create a copy with that character's case flipped.
   - If the character is a digit, skip it — no branching.
3. Return the complete list.

This mirrors subset generation: each letter character is a "decision point" where you branch into two possibilities (lowercase and uppercase).

**Time Complexity:** O(n * 2^L) where L is the number of letters in the string.
**Space Complexity:** O(n * 2^L) for all case permutations.`,
      starterCode: `def letter_case_permutation(s):
    # TODO: Return all case permutations of the string
    result = []
    return result

# Test cases
print(letter_case_permutation("ab7c"))
# Expected: ["ab7c", "Ab7c", "aB7c", "AB7c", "ab7C", "Ab7C", "aB7C", "AB7C"]

print(letter_case_permutation("a1b"))
# Expected: ["a1b", "A1b", "a1B", "A1B"]

print(letter_case_permutation("12"))
# Expected: ["12"]
`,
      solutionCode: `def letter_case_permutation(s):
    result = [list(s)]

    for i in range(len(s)):
        if s[i].isalpha():
            n = len(result)
            for j in range(n):
                new_str = list(result[j])
                new_str[i] = new_str[i].swapcase()
                result.append(new_str)

    return ["".join(r) for r in result]

# Test cases
print(letter_case_permutation("ab7c"))
# Expected: ["ab7c", "Ab7c", "aB7c", "AB7c", "ab7C", "Ab7C", "aB7C", "AB7C"]

print(letter_case_permutation("a1b"))
# Expected: ["a1b", "A1b", "a1B", "A1B"]

print(letter_case_permutation("12"))
# Expected: ["12"]
`,
    },
    {
      id: "subsets-balanced-parentheses",
      slug: "subsets-balanced-parentheses",
      title: "Balanced Parentheses",
      content: `# Balanced Parentheses

## Problem Statement

Given a number \`n\`, generate all strings containing \`n\` pairs of balanced parentheses.

## Examples

**Example 1:**
\`\`\`
Input: n = 2
Output: ["(())", "()()"]
\`\`\`

**Example 2:**
\`\`\`
Input: n = 3
Output: ["((()))", "(()())", "(())()", "()(())", "()()()"]
\`\`\`

## Approach

Use BFS-style generation with two counters: the number of open parentheses used and the number of close parentheses used.

1. Start with an empty string and counts \`open=0, close=0\`.
2. Use a queue. For each partial string:
   - If \`open < n\`, add \`(\` and increment open count.
   - If \`close < open\`, add \`)\` and increment close count. (We can only close if there is an unmatched open.)
3. When both open and close reach n, the string is complete — add it to results.

The constraint \`close < open\` ensures every generated string is valid. This is essentially a constrained subset generation where each position chooses between \`(\` and \`)\`.

**Time Complexity:** O(4^n / sqrt(n)) — the nth Catalan number bounds the count of valid strings.
**Space Complexity:** O(n * C(n)) where C(n) is the nth Catalan number.`,
      starterCode: `from collections import deque

def generate_parentheses(n):
    # TODO: Return all valid combinations of n pairs of parentheses
    result = []
    return result

# Test cases
print(generate_parentheses(2))
# Expected: ["(())", "()()"]

print(generate_parentheses(3))
# Expected: ["((()))", "(()())", "(())()", "()(())", "()()()"]
`,
      solutionCode: `from collections import deque

def generate_parentheses(n):
    result = []
    queue = deque()
    queue.append(("", 0, 0))  # (current_string, open_count, close_count)

    while queue:
        current, open_count, close_count = queue.popleft()

        if open_count == n and close_count == n:
            result.append(current)
            continue

        if open_count < n:
            queue.append((current + "(", open_count + 1, close_count))

        if close_count < open_count:
            queue.append((current + ")", open_count, close_count + 1))

    return result

# Test cases
print(generate_parentheses(2))
# Expected: ["(())", "()()"]

print(generate_parentheses(3))
# Expected: ["((()))", "(()())", "(())()", "()(())", "()()()"]
`,
    },
  ],
};
