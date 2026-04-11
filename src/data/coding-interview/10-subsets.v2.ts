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

\`\`\`concept
{
  "title": "What is a Subset?",
  "variant": "mental-model",
  "content": "A set B is a subset of set A if every element of B is also an element of A. The empty set {} is a subset of every set, and every set is a subset of itself. For n elements, there are exactly 2^n possible subsets."
}
\`\`\`

## Core Idea

Start with an empty set. For each new element, take every existing subset and create a copy that includes the new element. Append these new subsets to the list.

\`\`\`algoviz
{
  "title": "BFS Subset Generation",
  "type": "array",
  "data": [1, 2, 3],
  "frames": [
    { "highlight": [], "label": "Start with empty subset: [[]]", "stats": {"subsets": 1} },
    { "highlight": [0], "label": "Process element 1: add to all existing subsets", "stats": {"subsets": 2} },
    { "highlight": [0, 1], "label": "Process element 2: add to all existing subsets", "stats": {"subsets": 4} },
    { "highlight": [0, 1, 2, 3], "label": "Process element 3: add to all existing subsets", "stats": {"subsets": 8} }
  ],
  "speed": 1000
}
\`\`\`

This naturally produces all 2^n subsets of n elements.

\`\`\`playground
{
  "title": "Generate All Subsets",
  "language": "python",
  "code": "def generate_subsets(nums):\\n    subsets = [[]]\\n    \\n    for num in nums:\\n        # For each existing subset, create a new subset with current number\\n        new_subsets = []\\n        for subset in subsets:\\n            new_subset = subset + [num]\\n            new_subsets.append(new_subset)\\n        subsets.extend(new_subsets)\\n    \\n    return subsets\\n\\n# Test with [1, 2, 3]\\nresult = generate_subsets([1, 2, 3])\\nprint(f\\"Total subsets: {len(result)}\\")\\nfor i, subset in enumerate(result):\\n    print(f\\"{i+1}: {subset}\\")",
  "runnable": true
}
\`\`\`

## Handling Duplicates

When the input contains duplicates, sort it first. When processing a duplicate element, only extend the subsets that were added in the previous round (not all existing subsets). This prevents generating duplicate subsets.

\`\`\`trace
{
  "title": "Subsets with Duplicates",
  "language": "python",
  "code": "def subsets_with_duplicates(nums):\\n    nums.sort()\\n    subsets = [[]]\\n    start_index = 0\\n    \\n    for i in range(len(nums)):\\n        # If current number is same as previous, only extend subsets added in last round\\n        if i > 0 and nums[i] == nums[i-1]:\\n            start = start_index\\n        else:\\n            start = 0\\n        \\n        start_index = len(subsets)\\n        \\n        for j in range(start, len(subsets)):\\n            new_subset = subsets[j] + [nums[i]]\\n            subsets.append(new_subset)\\n    \\n    return subsets\\n\\nprint(subsets_with_duplicates([1, 2, 2]))",
  "frames": [
    { "line": 2, "vars": {"nums": "[1, 2, 2]", "subsets": "[[]]"}, "note": "Start with empty subset", "stdout": "" },
    { "line": 4, "vars": {"i": 0, "start": 0, "start_index": 0}, "note": "Processing first 1", "stdout": "" },
    { "line": 14, "vars": {"j": 0, "new_subset": "[1]"}, "note": "Add [1] to subsets", "stdout": "" },
    { "line": 4, "vars": {"i": 1, "start": 0, "start_index": 2}, "note": "Processing first 2", "stdout": "" },
    { "line": 14, "vars": {"j": 0, "new_subset": "[2]", "j": 1, "new_subset": "[1, 2]"}, "note": "Add [2] and [1,2]", "stdout": "" },
    { "line": 4, "vars": {"i": 2, "start": 2, "start_index": 4}, "note": "Processing duplicate 2 - only extend recent subsets", "stdout": "" }
  ],
  "speed": 1200
}
\`\`\`

## Handling Permutations

For permutations, instead of appending the new element only at the end, insert it at every possible position within each existing permutation. This yields n! results for n distinct elements.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Subsets (append only)",
    "code": "# For subsets, just append\\nnew_subset = subset + [num]"
  },
  "after": {
    "label": "Permutations (insert everywhere)",
    "code": "# For permutations, insert at every position\\nfor i in range(len(perm) + 1):\\n    new_perm = perm[:i] + [num] + perm[i:]"
  }
}
\`\`\`

## When to Use This Pattern

- Generate all subsets or combinations
- Generate all permutations
- Generate strings with specific constraints (e.g., balanced parentheses)
- Any problem requiring exhaustive enumeration of possibilities

\`\`\`quiz
{
  "title": "Subsets Pattern Mastery",
  "questions": [
    {
      "question": "How many subsets will be generated for a set with 4 distinct elements?",
      "options": ["8", "12", "16", "24"],
      "answer": 2,
      "explanation": "For n distinct elements, there are exactly 2^n subsets. For 4 elements: 2^4 = 16 subsets."
    },
    {
      "question": "When handling duplicates, why do we only extend subsets from the previous round?",
      "options": ["To save memory", "To prevent duplicate subsets", "To speed up execution", "To reduce recursion depth"],
      "answer": 1,
      "explanation": "When processing a duplicate element, extending only the recently added subsets prevents generating identical subsets that would differ only in the order of duplicate elements."
    },
    {
      "question": "What's the key difference between generating subsets and permutations?",
      "options": ["Subsets use BFS, permutations use DFS", "Subsets append elements, permutations insert at all positions", "Subsets are slower than permutations", "Subsets need sorting, permutations don't"],
      "answer": 1,
      "explanation": "For subsets, we simply append the new element. For permutations, we insert the new element at every possible position in each existing permutation."
    }
  ]
}
\`\`\`

## Complexity Note

Since the number of subsets is 2^n and permutations is n!, these algorithms are inherently exponential. The pattern itself is optimal — the output size dominates.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The BFS approach builds subsets iteratively by extending existing subsets with each new element",
    "For n elements, this generates exactly 2^n subsets",
    "With duplicates: sort first, then only extend subsets from the previous round when processing duplicates",
    "For permutations: insert new elements at all positions, not just append",
    "Time complexity is O(2^n) for subsets and O(n!) for permutations — optimal given output size"
  ]
}
\`\`\``,
    },
    {
      id: "subsets-basic",
      slug: "subsets-basic",
      title: "Subsets",
      content: `# Subsets

## Problem Statement

Given a set of **distinct** integers, return all possible subsets (the power set). The solution must not contain duplicate subsets.

\`\`\`concept
{
  "title": "Power Set Intuition",
  "variant": "mental-model",
  "content": "Think of building a power set like creating every possible playlist from a library of songs. For each song, you have two choices: include it or skip it. With n songs, you get 2ⁿ unique playlists. This binary choice is why the power set always has 2ⁿ elements."
}
\`\`\`

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

\`\`\`algoviz
{
  "title": "BFS Subset Generation",
  "type": "array",
  "data": [[], [1], [3], [1,3]],
  "frames": [
    {"highlight": [0], "label": "Start with empty subset", "stats": {"subsets": 1, "current": 1}},
    {"highlight": [0,1], "label": "Add 1 to all existing subsets", "stats": {"subsets": 2, "current": 3}},
    {"highlight": [2,3], "label": "Add 3 to all existing subsets", "stats": {"subsets": 4, "current": 3}},
    {"highlight": [0,1,2,3], "label": "Final power set", "stats": {"subsets": 4, "current": null}}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`steps
{
  "title": "BFS Algorithm Walkthrough",
  "steps": [
    {
      "title": "Initialize",
      "content": "Start with \`subsets = [[]]\` — just the empty subset"
    },
    {
      "title": "Process each number",
      "content": "For \`num\` in \`nums\`:\\n1. Create \`new_subsets = []\`\\n2. For each \`subset\` in \`subsets\`:\\n   - Append \`subset + [num]\` to \`new_subsets\`\\n3. Extend \`subsets\` with \`new_subsets\`"
    },
    {
      "title": "Return result",
      "content": "After processing all numbers, \`subsets\` contains the complete power set"
    }
  ]
}
\`\`\`

**Time Complexity:** O(n * 2^n) — there are 2^n subsets, each up to length n.
**Space Complexity:** O(n * 2^n) for storing all subsets.

\`\`\`playground
{
  "title": "Implement Subsets",
  "language": "python",
  "code": "def subsets(nums):\\n    subsets = [[]]  # Start with empty subset\\n    \\n    for num in nums:\\n        # For each existing subset, create new subset with current number\\n        new_subsets = []\\n        for subset in subsets:\\n            new_subset = subset + [num]\\n            new_subsets.append(new_subset)\\n        \\n        # Add all new subsets to our collection\\n        subsets.extend(new_subsets)\\n    \\n    return subsets\\n\\n# Test with example\\nprint(subsets([1, 3]))\\nprint(subsets([1, 5, 3]))",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Subset Generation Quiz",
  "questions": [
    {
      "question": "If the input array has 4 elements, how many subsets will be generated?",
      "options": ["8", "12", "16", "32"],
      "answer": 2,
      "explanation": "The power set always has 2^n elements. For 4 elements, that's 2^4 = 16 subsets."
    },
    {
      "question": "What's the space complexity of storing all subsets for an array of length n?",
      "options": ["O(2^n)", "O(n * 2^n)", "O(n^2)", "O(n!)"],
      "answer": 1,
      "explanation": "We store 2^n subsets, and each subset can be up to length n, so total space is O(n * 2^n)."
    },
    {
      "question": "In the BFS approach, when processing the 3rd element, how many existing subsets do we start with?",
      "options": ["2", "3", "4", "8"],
      "answer": 2,
      "explanation": "After processing 2 elements, we have 2^2 = 4 subsets. When processing the 3rd element, we start with these 4 existing subsets."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "BFS subset generation builds the power set iteratively without recursion",
    "Each element doubles the number of subsets by adding itself to all existing subsets",
    "Time complexity is O(n * 2^n) due to 2^n subsets each requiring up to O(n) operations",
    "This approach naturally handles the constraint of no duplicate subsets when input elements are distinct"
  ]
}
\`\`\``,
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

Given a collection of numbers that **might contain duplicates**, return all possible **unique subsets** (the power set).

\`\`\`concept
{
  "title": "Why duplicates break the simple BFS recipe",
  "variant": "insight",
  "content": "The standard BFS subset builder adds every element to every existing subset. With duplicates, the same subset can be produced multiple times (e.g., two 3's both extend [] → [3]). The fix is to **treat consecutive duplicates as a group** and only extend the subsets that were **newly created in the previous round**, preventing redundant paths."
}
\`\`\`

## Examples

**Example 1**  
Input: \`[1, 3, 3]\`  
Output: \`[[], [1], [3], [1,3], [3,3], [1,3,3]]\`

**Example 2**  
Input: \`[1, 5, 3, 3]\`  
Output: \`[[], [1], [3], [1,3], [3,3], [1,3,3], [5], [1,5], [3,5], [1,3,5], [3,3,5], [1,3,3,5]]\`

## Algorithm — Sorted BFS with Start Index

1. Sort the array so duplicates sit next to each other.
2. Initialize \`subsets = [ [] ]\`.
3. Let \`start = 0\` (index where **new** subsets of the current round begin).
4. For each index \`i\` and value \`num\`:
   - If \`num == nums[i-1]\` (duplicate), set \`start = previous_round_start\`.
   - Else reset \`start = 0\`.
   - Take every subset in \`subsets[start .. end]\` and append \`num\` to it.
   - Push these new subsets back into \`subsets\`.
   - Save the index where this round started for the next duplicate check.

\`\`\`algoviz
{
  "title": "Step-by-step on [1,3,3]",
  "type": "array",
  "data": [1, 3, 3],
  "frames": [
    { "highlight": [], "label": "Start with [[]]", "stats": {"start":0,"subsets":1} },
    { "highlight": [0], "label": "Extend all with 1 → [[],[1]]", "stats": {"start":0,"subsets":2} },
    { "highlight": [1], "label": "First 3: extend all → [[],[1],[3],[1,3]]", "stats": {"start":0,"subsets":4} },
    { "highlight": [2], "label": "Second 3: only extend last 2 → +[3,3],[1,3,3]", "stats": {"start":2,"subsets":6} }
  ],
  "speed": 900
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naïve BFS (duplicates in output)",
    "code": "subsets = [[]]\\nfor num in nums:\\n    for s in subsets:\\n        subsets.append(s + [num])\\n# [[],[1],[3],[1,3],[3],[1,3],[3,3],[1,3,3]] ❌"
  },
  "after": {
    "label": "Controlled start index",
    "code": "subsets = [[]]\\nstart = 0\\nfor i,num in enumerate(nums):\\n    if i>0 and num==nums[i-1]:\\n        start = prev_start\\n    else:\\n        start = 0\\n    prev_start = len(subsets)\\n    for j in range(start, prev_start):\\n        subsets.append(subsets[j] + [num])\\n# [[],[1],[3],[1,3],[3,3],[1,3,3]] ✅"
  }
}
\`\`\`

## Complexity

- **Time:** O(n · 2ⁿ) in the worst case (all elements unique).  
- **Space:** O(n · 2ⁿ) to store the power set.

\`\`\`quiz
{
  "title": "Check your understanding",
  "questions": [
    {
      "question": "Why must we sort the input first?",
      "options": [
        "To reduce time complexity",
        "To group duplicates together so we can control extension",
        "To make the output lexicographic",
        "Sorting is optional"
      ],
      "answer": 1,
      "explanation": "Adjacent duplicates let us detect when we should limit the extension window, preventing duplicate subsets."
    },
    {
      "question": "In the loop, what does the variable \`start\` represent?",
      "options": [
        "The first index of the current number",
        "The first subset index we are allowed to extend in this round",
        "The length of the subsets list before the round",
        "The index of the previous duplicate"
      ],
      "answer": 1,
      "explanation": "\`start\` is the left boundary of the window of subsets that may be extended with the current element."
    },
    {
      "question": "If the input were [2,2,2], how many distinct subsets would be generated?",
      "options": ["3", "4", "6", "8"],
      "answer": 1,
      "explanation": "[[],[2],[2,2],[2,2,2]] — only 4 unique subsets exist."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Implement unique subsets",
  "language": "python",
  "code": "def subsetsWithDup(nums):\\n    nums.sort()\\n    subsets = [[]]\\n    start = 0\\n    for i, num in enumerate(nums):\\n        if i > 0 and num == nums[i-1]:\\n            start = prev_start\\n        else:\\n            start = 0\\n        prev_start = len(subsets)\\n        for j in range(start, prev_start):\\n            subsets.append(subsets[j] + [num])\\n    return subsets\\n\\n# ---- test ----\\nprint(subsetsWithDup([1,3,3]))",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Sort the array so duplicates become adjacent.",
    "Use a start index to restrict which subsets are extended when you encounter a duplicate.",
    "This keeps the BFS flavour while guaranteeing uniqueness.",
    "Time and space remain O(n·2ⁿ) because the power set itself is exponential."
  ]
}
\`\`\``,
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

\`\`\`concept
{"title": "What is a Permutation?", "variant": "mental-model", "content": "A permutation is an ordered arrangement of elements. Unlike subsets, order matters: [1,2,3] and [3,2,1] are different permutations of the same set. For n distinct items, there are exactly n! unique permutations."}
\`\`\`

## Problem Statement

Given a set of **distinct** numbers, return **all possible orderings** (permutations).

**Examples**

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

## BFS-Style Generation

Instead of recursion, build permutations layer by layer:

1. Start with the first element: \`[[1]]\`
2. For each new element, **insert it at every possible position** in every existing permutation
3. Repeat until all elements are placed

\`\`\`algoviz
{"title": "Building Permutations for [1,2,3]", "type": "array", "data": [1,2,3],
 "frames": [
  {"highlight": [0], "label": "Start with [[1]]", "stats": {"perms": 1}},
  {"highlight": [0,1], "label": "Insert 2 at index 0 → [2,1]", "stats": {"perms": 2}},
  {"highlight": [0,1], "label": "Insert 2 at index 1 → [1,2]", "stats": {"perms": 2}},
  {"highlight": [0,1,2], "label": "Insert 3 into [2,1] at 0 → [3,2,1]", "stats": {"perms": 6}},
  {"highlight": [0,1,2], "label": "Insert 3 into [2,1] at 1 → [2,3,1]", "stats": {"perms": 6}},
  {"highlight": [0,1,2], "label": "Insert 3 into [2,1] at 2 → [2,1,3]", "stats": {"perms": 6}}
 ],
 "speed": 900}
\`\`\`

\`\`\`steps
{"title": "Iterative Algorithm", "steps": [
  {"title": "Initialize", "content": "Start with a list containing one empty permutation: \`[[]]\`"},
  {"title": "For each number", "content": "Create new permutations by inserting the number at every index (0 … current length) of each existing permutation"},
  {"title": "Replace list", "content": "Set the current list to these new permutations and continue with the next number"},
  {"title": "Return", "content": "After processing all numbers, the list holds all n! permutations"}
]}
\`\`\`

\`\`\`playground
{"title": "Iterative Permutations", "language": "python", "code": "from typing import List\\n\\ndef permute(nums: List[int]) -> List[List[int]]:\\n    perms = [[]]                      # start with empty permutation\\n    for num in nums:\\n        next_perms = []\\n        for p in perms:\\n            for i in range(len(p) + 1):\\n                next_perms.append(p[:i] + [num] + p[i:])\\n        perms = next_perms\\n    return perms\\n\\nprint(permute([1,2,3]))", "runnable": true}
\`\`\`

## Complexity

- **Time:** O(n · n!) — we generate n! permutations, each of length n  
- **Space:** O(n · n!) — storing all permutations

\`\`\`quiz
{"title": "Check Your Understanding", "questions": [
  {"question": "How many permutations exist for the set {4,5,6}?", "options": ["3", "6", "9", "27"], "answer": 1, "explanation": "3! = 6 distinct orderings."},
  {"question": "In the iterative approach, where is the new element inserted?", "options": ["Only at the end", "Only at the beginning", "At every possible index", "At random positions"], "answer": 2, "explanation": "Inserting at every index ensures all orderings are created."},
  {"question": "What is the time complexity of generating all permutations of n distinct elements?", "options": ["O(n²)", "O(n!)", "O(n · n!)", "O(2ⁿ)"], "answer": 2, "explanation": "We produce n! permutations, each of length n, so total work is O(n · n!)."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Permutations are ordered arrangements; for n distinct items there are n! of them",
  "BFS-style generation inserts each new element at every possible position in existing partial permutations",
  "The iterative method avoids recursion while still producing all orderings in O(n · n!) time"
]}
\`\`\``,
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

\`\`\`concept
{
  "title": "Decision Points = 2^k Outcomes",
  "variant": "insight",
  "content": "Every alphabetic character doubles the number of possible strings. With k letters you get 2^k permutations—classic subsets thinking applied to case flipping."
}
\`\`\`

## Problem Statement

Given a string, generate every permutation that can be created by independently choosing either lowercase or uppercase for each **letter**. Digits and symbols stay fixed.

**Examples**  
Input: \`"ab7c"\`  
Output: \`["ab7c", "Ab7c", "aB7c", "AB7c", "ab7C", "Ab7C", "aB7C", "AB7C"]\` (8 strings)

Input: \`"12"\`  
Output: \`["12"]\` (no letters ⇒ 2⁰ = 1 string)

## BFS-Style Generation Walk-through

We treat the string as a sequence of decision slots. Whenever we meet a letter we **branch**, appending both case variants to the current pool.

\`\`\`algoviz
{
  "title": "Building Permutations for \\"a1b\\"",
  "type": "array",
  "data": ["a1b"],
  "frames": [
    { "highlight": [0], "label": "Start with original string", "stats": { "queueSize": 1 } },
    { "highlight": [0], "label": "Position 0: letter 'a' → branch", "stats": { "queueSize": 2 } },
    { "highlight": [0, 1], "label": "Position 1: digit '1' → skip", "stats": { "queueSize": 2 } },
    { "highlight": [0, 1], "label": "Position 2: letter 'b' → branch both", "stats": { "queueSize": 4 } }
  ],
  "speed": 900
}
\`\`\`

## Complexity

- **Time:** O(n · 2ᵏ) where k = #letters and n = string length  
- **Space:** O(n · 2ᵏ) to store all strings

k can be ≤ n, so worst-case time is exponential in the **letter count**, not the full length.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Recursive DFS (explicit stack)",
    "code": "def letter_case_permutation(s):\\n    res = []\\n    def dfs(i, path):\\n        if i == len(s):\\n            res.append(path)\\n            return\\n        if s[i].isalpha():\\n            dfs(i + 1, path + s[i].lower())\\n            dfs(i + 1, path + s[i].upper())\\n        else:\\n            dfs(i + 1, path + s[i])\\n    dfs(0, \\"\\")\\n    return res"
  },
  "after": {
    "label": "Iterative BFS (queue)",
    "code": "from collections import deque\\n\\ndef letter_case_permutation(s):\\n    q = deque([\\"\\"])\\n    for ch in s:\\n        sz = len(q)\\n        for _ in range(sz):\\n            cur = q.popleft()\\n            if ch.isalpha():\\n                q.append(cur + ch.lower())\\n                q.append(cur + ch.upper())\\n            else:\\n                q.append(cur + ch)\\n    return list(q)"
  }
}
\`\`\`

## Edge-Case Checklist

1. Empty string → \`[""]\`  
2. Only digits → \`[original]\`  
3. Unicode letters work if you rely on \`.isalpha()\` / \`.lower()\` / \`.upper()\`  
4. Length > 20 with many letters ⇒ millions of strings—watch memory

\`\`\`quiz
{
  "title": "Quick Sanity Check",
  "questions": [
    {
      "question": "How many permutations will \\"xyz\\" produce?",
      "options": ["3", "6", "8", "9"],
      "answer": 2,
      "explanation": "3 letters ⇒ 2³ = 8 permutations."
    },
    {
      "question": "What happens to a non-letter character during generation?",
      "options": ["Skipped entirely", "Copied once per branch", "Randomly changed", "Lower-cased"],
      "answer": 1,
      "explanation": "Digits/symbols are appended unchanged to every active partial string."
    },
    {
      "question": "Which statement best explains the time complexity?",
      "options": ["O(n²)", "O(n · 2ᵏ)", "O(2ⁿ)", "O(k log n)"],
      "answer": 1,
      "explanation": "We build 2ᵏ strings, each of length n, hence O(n · 2ᵏ)."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Try It: Generate Permutations",
  "language": "python",
  "code": "from collections import deque\\n\\ndef letter_case_permutation(s: str):\\n    q = deque([\\"\\"])\\n    for ch in s:\\n        sz = len(q)\\n        for _ in range(sz):\\n            cur = q.popleft()\\n            if ch.isalpha():\\n                q.append(cur + ch.lower())\\n                q.append(cur + ch.upper())\\n            else:\\n                q.append(cur + ch)\\n    return list(q)\\n\\n# ---- test ----\\nprint(letter_case_permutation(\\"a1b\\"))\\nprint(letter_case_permutation(\\"12\\"))",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Each letter doubles the state space → 2ᵏ total strings.",
    "Non-letters are passive: they ride along without branching.",
    "BFS queue mirrors subset generation: grow the frontier one character at a time.",
    "Complexity is exponential in the count of letters, not the full string length."
  ]
}
\`\`\``,
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

Given a number \`n\`, generate **all** strings containing \`n\` pairs of balanced parentheses.

\`\`\`concept
{
  "title": "What makes parentheses \\"balanced\\"?",
  "variant": "rule",
  "content": "A string is balanced when:\\n1. Every opening \`(\` has a matching closing \`)\`\\n2. At every prefix, \`#(\` ≥ \`#)\`\\n3. Total \`#(\` = \`#)\` = n\\n\\nThink of it like a ledger: you can't close more than you've opened."
}
\`\`\`

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

## BFS Generation Strategy

We treat each partial string as a **state** defined by:
- The string built so far
- \`open\` = how many \`(\` used
- \`close\` = how many \`)\` used

\`\`\`steps
{
  "title": "BFS State Expansion",
  "steps": [
    {
      "title": "Start State",
      "content": "Empty string, \`open = 0\`, \`close = 0\`"
    },
    {
      "title": "Add '(' if possible",
      "content": "If \`open < n\`, append \`(\` and enqueue new state with \`open + 1\`"
    },
    {
      "title": "Add ')' if valid",
      "content": "If \`close < open\`, append \`)\` and enqueue with \`close + 1\`"
    },
    {
      "title": "Terminate",
      "content": "When \`open == close == n\`, save the string"
    }
  ]
}
\`\`\`

The constraint \`close < open\` is the **guard** that keeps every prefix valid—exactly like ensuring you never over-close a bank account.

\`\`\`algoviz
{
  "title": "BFS Tree for n = 3",
  "type": "tree",
  "data": [
    {"id":"root","label":"\\"\\" 0,0"},
    {"id":"l1","label":"\\"(\\" 1,0"},
    {"id":"r1","label":"\\"()\\" 1,1"},
    {"id":"l2","label":"\\"((\\" 2,0"},
    {"id":"r2","label":"\\"(()\\" 2,1"},
    {"id":"l3","label":"\\"(((\\" 3,0"},
    {"id":"r3","label":"\\"((()\\" 3,1"},
    {"id":"l4","label":"\\"((())\\" 3,2"},
    {"id":"r4","label":"\\"((()))\\" 3,3"},
    {"id":"l5","label":"\\"(()\\" 2,1"},
    {"id":"r5","label":"\\"(()()\\" 2,2"},
    {"id":"l6","label":"\\"(())\\" 2,2"},
    {"id":"r6","label":"\\"(())()\\" 2,3"},
    {"id":"l7","label":"\\"()(\\" 2,1"},
    {"id":"r7","label":"\\"()()\\" 2,2"}
  ],
  "frames": [
    {"highlight":["root"],"label":"Seed empty string","stats":{"queue":1}},
    {"highlight":["l1"],"label":"Add '('","stats":{"queue":1}},
    {"highlight":["l2","r1"],"label":"Expand '(' → '((', '()'","stats":{"queue":2}},
    {"highlight":["l3","r2","l7"],"label":"Continue level by level","stats":{"queue":3}},
    {"highlight":["r4","r6"],"label":"Collect when open=close=3","stats":{"results":2}}
  ],
  "speed": 1000
}
\`\`\`

## Implementation

\`\`\`playground
{
  "title": "Python BFS Generator",
  "language": "python",
  "code": "from collections import deque\\n\\ndef generate_parentheses(n: int) -> list[str]:\\n    queue = deque([(\\"\\", 0, 0)])   # (string, open, close)\\n    res = []\\n    while queue:\\n        s, o, c = queue.popleft()\\n        if o == c == n:\\n            res.append(s)\\n            continue\\n        if o < n:\\n            queue.append((s + \\"(\\", o + 1, c))\\n        if c < o:\\n            queue.append((s + \\")\\", o, c + 1))\\n    return res\\n\\nprint(generate_parentheses(3))",
  "runnable": true
}
\`\`\`

## Complexity Analysis

\`\`\`callout
{
  "type": "info",
  "title": "Catalan Numbers",
  "content": "The number of valid strings is the n-th Catalan number:\\nC(n) = (1/(n+1)) * (2n choose n) ≈ 4^n / (n^(3/2)√π)\\nHence we cannot beat Ω(C(n)) time—every valid string must be emitted."
}
\`\`\`

- **Time:** O(C(n) · n) — emit each of C(n) strings of length 2n  
- **Space:** O(n · C(n)) — queue holds at most one complete level, but each string consumes O(n) space

\`\`\`quiz
{
  "title": "Quick Checks",
  "questions": [
    {
      "question": "For n = 4, how many valid strings exist?",
      "options": ["12", "14", "16", "18"],
      "answer": 1,
      "explanation": "C(4) = 14. You can verify by running the code above with n=4."
    },
    {
      "question": "Which state will **never** appear in the BFS queue?",
      "options": ["(, 1,0", ")(, 1,1", "(()), 2,2", "(()(, 3,1"],
      "answer": 1,
      "explanation": ")( violates the prefix rule: at the second character we have more ) than (."
    },
    {
      "question": "If we switch to DFS recursion, what is the maximum call-stack depth?",
      "options": ["n", "2n", "C(n)", "n²"],
      "answer": 1,
      "explanation": "Each recursive call appends one character; the longest path builds a string of length 2n."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "BFS explores states level-by-level, guaranteeing shortest partial strings first.",
    "The guard condition close < open prunes invalid branches instantly.",
    "Output count is governed by Catalan numbers, so generation is inherently exponential."
  ]
}
\`\`\``,
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
