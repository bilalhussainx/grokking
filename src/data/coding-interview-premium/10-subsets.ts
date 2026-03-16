import { Module } from "../types";

export const subsetsModule: Module = {
  id: "subsets",
  title: "Subsets",
  description:
    "Master the Subsets pattern for generating combinations, permutations, and subsets using BFS/DFS. Essential for problems involving combinations, permutations, and exploring all possible configurations.",
  lessons: [
    {
      id: "subsets-intro",
      slug: "subsets-intro",
      title: "Introduction to Subsets",
      content: `## The Subsets Pattern

The **Subsets** pattern is used to find all possible subsets, combinations, or permutations of a given set of elements. This pattern uses either **Breadth-First Search (BFS)** or **Depth-First Search (DFS)** to explore all possibilities.

<!-- voice:section_check concept="Subsets pattern basic concept" -->

### Why Subsets Pattern?

Many problems require exploring all possible combinations:
- Finding all subsets of a set
- Generating all permutations
- Finding combinations that sum to a target
- Generating valid parentheses

### BFS Approach (Iterative)

Start with empty set, then for each element, add it to all existing subsets:

~~~
subsets = [[]]  # start with empty set

for num in nums:
    n = len(subsets)
    for i in range(n):
        new_subset = subsets[i] + [num]
        subsets.append(new_subset)
~~~

### DFS Approach (Recursive)

Build subsets by making choices at each step:

~~~
def backtrack(start, current_subset):
    # Add current subset to result
    result.append(list(current_subset))
    
    for i in range(start, len(nums)):
        # Include nums[i]
        current_subset.append(nums[i])
        backtrack(i + 1, current_subset)
        # Exclude nums[i] (backtrack)
        current_subset.pop()
~~~

<!-- voice:key_insight insight="Every element doubles the number of subsets — each existing subset can either include or exclude the new element" -->

### When to Use

- Find all subsets/subsequences
- Generate permutations
- Combination sum problems
- String permutations by changing case
- Balanced parentheses

### Complexity

- **Time:** O(2^n) for subsets, O(n!) for permutations
- **Space:** O(2^n) or O(n!) to store results`,
    },
    {
      id: "generate-all-subsets",
      slug: "generate-all-subsets",
      title: "Generate All Subsets",
      content: `## Generate All Subsets

<!-- voice:section_check concept="BFS/DFS for subset generation" -->

### Problem Statement

Given a set of distinct integers, return all possible subsets (the power set).

**Note:** The solution set must not contain duplicate subsets.

### Examples

~~~
Input: [1, 2, 3]
Output: [[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]
~~~

~~~
Input: [0]
Output: [[], [0]]
~~~

### Approach

**BFS:** Start with empty subset. For each number, create new subsets by adding it to all existing subsets.

**DFS:** Use backtracking to explore include/exclude choices for each element.

<!-- voice:key_insight insight="Each element doubles the result size — for n elements, there are 2^n subsets" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n × 2^n) — 2^n subsets, each of size up to n
- **Space:** O(n × 2^n) — store all subsets`,
      starterCode: `def find_subsets(nums):
    """
    Generate all subsets of a given set of distinct integers.
    
    Args:
        nums: List of distinct integers
    
    Returns:
        List of lists, all possible subsets
    
    Example:
        >>> find_subsets([1, 2, 3])
        [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]
    """
    # TODO: Use BFS or DFS to generate all subsets
    # Hint: Start with empty subset, add each number to existing subsets
    pass


# ─── Test Cases ───

# Standard case
print(find_subsets([1, 2, 3]))
# Expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]

# Single element
print(find_subsets([0]))
# Expected: [[], [0]]

# Empty array
print(find_subsets([]))
# Expected: [[]]

# Two elements
print(find_subsets([1, 2]))
# Expected: [[], [1], [2], [1, 2]]

# Negative numbers
print(find_subsets([-1, 0, 1]))
# Expected: [[], [-1], [0], [1], [-1, 0], [-1, 1], [0, 1], [-1, 0, 1]]
`,
      solutionCode: `def find_subsets(nums):
    """
    Generate all subsets of a given set of distinct integers.
    
    Time Complexity: O(n × 2^n) — 2^n subsets, each up to size n
    Space Complexity: O(n × 2^n) — store all subsets
    """
    subsets = [[]]  # Start with empty subset
    
    for num in nums:
        # For each existing subset, create a new subset with current number
        n = len(subsets)
        for i in range(n):
            new_subset = subsets[i] + [num]
            subsets.append(new_subset)
    
    return subsets


# ─── Test Cases ───
print(find_subsets([1, 2, 3]))
# Expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]

print(find_subsets([0]))
# Expected: [[], [0]]

print(find_subsets([]))
# Expected: [[]]

print(find_subsets([1, 2]))
# Expected: [[], [1], [2], [1, 2]]

print(find_subsets([-1, 0, 1]))
# Expected: [[], [-1], [0], [1], [-1, 0], [-1, 1], [0, 1], [-1, 0, 1]]
`,
    },
    {
      id: "subsets-with-duplicates",
      slug: "subsets-with-duplicates",
      title: "Subsets With Duplicates",
      content: `## Subsets With Duplicates

<!-- voice:section_check concept="Handling duplicates in subset generation" -->

### Problem Statement

Given a collection of integers that might contain duplicates, return all possible subsets.

**Note:** The solution set must not contain duplicate subsets.

### Examples

~~~
Input: [1, 2, 2]
Output: [[], [1], [2], [1,2], [2,2], [1,2,2]]
~~~

### Approach

Sort the array first to group duplicates. When generating subsets, skip adding the current number to subsets that were created in previous iterations (those that don't include the previous duplicate).

Alternative: Track which subsets were added in the previous iteration and only add to those when encountering a duplicate.

<!-- voice:key_insight insight="Sort first, then only add current duplicate to subsets that were created using the previous duplicate" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n × 2^n) worst case
- **Space:** O(n × 2^n)`,
      starterCode: `def find_subsets_with_duplicates(nums):
    """
    Generate all subsets when input may contain duplicates.
    
    Args:
        nums: List of integers (may contain duplicates)
    
    Returns:
        List of lists, all unique subsets
    
    Example:
        >>> find_subsets_with_duplicates([1, 2, 2])
        [[], [1], [2], [1, 2], [2, 2], [1, 2, 2]]
    """
    # TODO: Generate subsets avoiding duplicates
    # Hint: Sort first, then carefully handle consecutive duplicates
    pass


# ─── Test Cases ───

# With duplicates
print(find_subsets_with_duplicates([1, 2, 2]))
# Expected: [[], [1], [2], [1, 2], [2, 2], [1, 2, 2]]

# All duplicates
print(find_subsets_with_duplicates([1, 1, 1]))
# Expected: [[], [1], [1, 1], [1, 1, 1]]

# No duplicates
print(find_subsets_with_duplicates([1, 2, 3]))
# Expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]

# Empty
print(find_subsets_with_duplicates([]))
# Expected: [[]]

# Single element
print(find_subsets_with_duplicates([5]))
# Expected: [[], [5]]
`,
      solutionCode: `def find_subsets_with_duplicates(nums):
    """
    Generate all subsets when input may contain duplicates.
    
    Time Complexity: O(n × 2^n)
    Space Complexity: O(n × 2^n)
    """
    nums.sort()  # Sort to group duplicates
    subsets = [[]]
    
    start_index = 0
    end_index = 0
    
    for i in range(len(nums)):
        start_index = 0
        
        # If current element is a duplicate, only add to subsets created in previous step
        if i > 0 and nums[i] == nums[i - 1]:
            start_index = end_index + 1
        
        end_index = len(subsets) - 1
        
        # Add current number to appropriate subsets
        for j in range(start_index, len(subsets)):
            new_subset = subsets[j] + [nums[i]]
            subsets.append(new_subset)
    
    return subsets


# ─── Test Cases ───
print(find_subsets_with_duplicates([1, 2, 2]))
# Expected: [[], [1], [2], [1, 2], [2, 2], [1, 2, 2]]

print(find_subsets_with_duplicates([1, 1, 1]))
# Expected: [[], [1], [1, 1], [1, 1, 1]]

print(find_subsets_with_duplicates([1, 2, 3]))
# Expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]

print(find_subsets_with_duplicates([]))
# Expected: [[]]

print(find_subsets_with_duplicates([5]))
# Expected: [[], [5]]
`,
    },
    {
      id: "permutations",
      slug: "permutations",
      title: "Permutations",
      content: `## Permutations

<!-- voice:section_check concept="Generating all permutations" -->

### Problem Statement

Given a collection of distinct integers, return all possible permutations.

### Examples

~~~
Input: [1, 2, 3]
Output: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
~~~

~~~
Input: [0, 1]
Output: [[0, 1], [1, 0]]
~~~

### Approach

**BFS:** Start with empty permutation. For each number, insert it at every possible position in existing permutations.

**DFS (Backtracking):** Build permutations by selecting each unused number at each position.

<!-- voice:key_insight insight="For n distinct elements, there are n! permutations — at position i, we have (n-i) choices" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n × n!) — n! permutations, each of size n
- **Space:** O(n × n!)`,
      starterCode: `def find_permutations(nums):
    """
    Generate all permutations of a collection of distinct integers.
    
    Args:
        nums: List of distinct integers
    
    Returns:
        List of lists, all permutations
    
    Example:
        >>> find_permutations([1, 2, 3])
        [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
    """
    # TODO: Use BFS or DFS to generate all permutations
    # Hint: BFS: insert new number at every position
    # Hint: DFS: use backtracking with used[] array
    pass


# ─── Test Cases ───

# Standard case
print(find_permutations([1, 2, 3]))
# Expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]

# Two elements
print(find_permutations([0, 1]))
# Expected: [[0, 1], [1, 0]]

# Single element
print(find_permutations([1]))
# Expected: [[1]]

# Empty
print(find_permutations([]))
# Expected: [[]]

# Four elements
print(len(find_permutations([1, 2, 3, 4])))
# Expected: 24 (4!)
`,
      solutionCode: `def find_permutations(nums):
    """
    Generate all permutations using BFS approach.
    
    Time Complexity: O(n × n!)
    Space Complexity: O(n × n!)
    """
    permutations = [[]]  # Start with empty permutation
    
    for num in nums:
        new_permutations = []
        
        # Insert num at every possible position in each existing permutation
        for perm in permutations:
            for i in range(len(perm) + 1):
                new_perm = perm[:i] + [num] + perm[i:]
                new_permutations.append(new_perm)
        
        permutations = new_permutations
    
    return permutations


# Alternative DFS solution
def find_permutations_dfs(nums):
    """
    Generate all permutations using DFS/backtracking.
    """
    def backtrack(current, used):
        if len(current) == len(nums):
            result.append(list(current))
            return
        
        for i in range(len(nums)):
            if not used[i]:
                used[i] = True
                current.append(nums[i])
                backtrack(current, used)
                current.pop()
                used[i] = False
    
    result = []
    backtrack([], [False] * len(nums))
    return result


# ─── Test Cases ───
print(find_permutations([1, 2, 3]))
# Expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]

print(find_permutations([0, 1]))
# Expected: [[0, 1], [1, 0]]

print(find_permutations([1]))
# Expected: [[1]]

print(find_permutations([]))
# Expected: [[]]

print(len(find_permutations([1, 2, 3, 4])))
# Expected: 24
`,
    },
    {
      id: "string-permutations-case",
      slug: "string-permutations-case",
      title: "String Permutations by Changing Case",
      content: `## String Permutations by Changing Case

<!-- voice:section_check concept="Generating case permutations" -->

### Problem Statement

Given a string, find all permutations by changing the case of its alphabetic characters. Each alphabetic character can be lowercase or uppercase. Non-alphabetic characters remain unchanged.

### Examples

~~~
Input: "ad52"
Output: ["ad52", "Ad52", "aD52", "AD52"]
~~~

~~~
Input: "ab7c"
Output: ["ab7c", "Ab7c", "aB7c", "AB7c", "ab7C", "Ab7C", "aB7C", "AB7C"]
~~~

### Approach

Similar to subsets pattern. For each alphabetic character, generate new permutations with both lowercase and uppercase versions.

<!-- voice:key_insight insight="Treat each alphabetic character as a choice: lowercase or uppercase — just like the subsets pattern" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n × 2^n) where n is number of alphabetic characters
- **Space:** O(n × 2^n)`,
      starterCode: `def find_case_permutations(s):
    """
    Find all permutations of a string by changing case of alphabetic characters.
    
    Args:
        s: String to permute
    
    Returns:
        List of strings, all case permutations
    
    Example:
        >>> find_case_permutations("ad52")
        ['ad52', 'Ad52', 'aD52', 'AD52']
    """
    # TODO: Generate all case permutations using BFS
    # Hint: For each letter, double the permutations with upper and lower case
    pass


# ─── Test Cases ───

# Standard case
print(find_case_permutations("ad52"))
# Expected: ['ad52', 'Ad52', 'aD52', 'AD52']

# Three letters
print(find_case_permutations("ab7c"))
# Expected: ['ab7c', 'Ab7c', 'aB7c', 'AB7c', 'ab7C', 'Ab7C', 'aB7C', 'AB7C']

# No letters
print(find_case_permutations("123"))
# Expected: ['123']

# Single letter
print(find_case_permutations("a"))
# Expected: ['a', 'A']

# Empty string
print(find_case_permutations(""))
# Expected: ['']
`,
      solutionCode: `def find_case_permutations(s):
    """
    Find all permutations of a string by changing case of alphabetic characters.
    
    Time Complexity: O(n × 2^k) where k is number of letters
    Space Complexity: O(n × 2^k)
    """
    permutations = [""]
    
    for char in s:
        new_permutations = []
        
        for perm in permutations:
            if char.isalpha():
                # Add both lowercase and uppercase versions
                new_permutations.append(perm + char.lower())
                new_permutations.append(perm + char.upper())
            else:
                # Non-alphabetic: just append as-is
                new_permutations.append(perm + char)
        
        permutations = new_permutations
    
    return permutations


# ─── Test Cases ───
print(find_case_permutations("ad52"))
# Expected: ['ad52', 'Ad52', 'aD52', 'AD52']

print(find_case_permutations("ab7c"))
# Expected: ['ab7c', 'Ab7c', 'aB7c', 'AB7c', 'ab7C', 'Ab7C', 'aB7C', 'AB7C']

print(find_case_permutations("123"))
# Expected: ['123']

print(find_case_permutations("a"))
# Expected: ['a', 'A']

print(find_case_permutations(""))
# Expected: ['']
`,
    },
    {
      id: "balanced-parentheses",
      slug: "balanced-parentheses",
      title: "Balanced Parentheses",
      content: `## Balanced Parentheses

<!-- voice:section_check concept="Generating balanced parentheses" -->

### Problem Statement

Given 'n', generate all combinations of well-formed (balanced) parentheses with n pairs.

### Examples

~~~
Input: n = 2
Output: ["(())", "()()"]
~~~

~~~
Input: n = 3
Output: ["((()))", "(()())", "(())()", "()(())", "()()()"]
~~~

### Approach

Use BFS/DFS with constraints:
- Can add '(' if count of open < n
- Can add ')' if count of close < count of open

<!-- voice:key_insight insight="To maintain balance: can always add '(' if we haven't used all; can add ')' only if it won't exceed '(' count" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n × 4^n / √n) — Catalan number C(n) combinations
- **Space:** O(n × 4^n / √n)`,
      starterCode: `def generate_balanced_parentheses(n):
    """
    Generate all combinations of well-formed parentheses.
    
    Args:
        n: int, number of pairs of parentheses
    
    Returns:
        List of strings, all valid combinations
    
    Example:
        >>> generate_balanced_parentheses(2)
        ['(())', '()()']
    """
    # TODO: Use DFS with open/close count constraints
    # Hint: Add '(' if open < n, add ')' if close < open
    pass


# ─── Test Cases ───

# n=2
print(generate_balanced_parentheses(2))
# Expected: ['(())', '()()']

# n=3
print(generate_balanced_parentheses(3))
# Expected: ['((()))', '(()())', '(())()', '()(())', '()()()']

# n=1
print(generate_balanced_parentheses(1))
# Expected: ['()']

# Check count for n=4 (Catalan number C4 = 14)
print(len(generate_balanced_parentheses(4)))
# Expected: 14
`,
      solutionCode: `def generate_balanced_parentheses(n):
    """
    Generate all combinations of well-formed parentheses.
    
    Time Complexity: O(n × 4^n / √n) — Catalan number
    Space Complexity: O(n × 4^n / √n)
    """
    def backtrack(current, open_count, close_count):
        # Base case: used all parentheses
        if len(current) == 2 * n:
            result.append(current)
            return
        
        # Can add '(' if we haven't used all n
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        
        # Can add ')' if it won't exceed open count
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    
    result = []
    backtrack("", 0, 0)
    return result


# ─── Test Cases ───
print(generate_balanced_parentheses(2))
# Expected: ['(())', '()()']

print(generate_balanced_parentheses(3))
# Expected: ['((()))', '(()())', '(())()', '()(())', '()()()']

print(generate_balanced_parentheses(1))
# Expected: ['()']

print(len(generate_balanced_parentheses(4)))
# Expected: 14
`,
    },
    {
      id: "subsets-checkpoint",
      slug: "subsets-checkpoint",
      title: "Module Checkpoint: Subsets",
      content: `## Module Checkpoint: Subsets

<!-- voice:checkpoint_intro -->

Great work on the Subsets module! Let's verify your understanding.

### Quick Review

You learned:
- **BFS approach**: Build subsets iteratively by adding each element
- **DFS/backtracking**: Recursive exploration with include/exclude
- Handling **duplicates** by sorting and careful iteration
- Generating **permutations** by inserting at all positions
- **Balanced parentheses** with constraint-based generation

### Quiz

**Question 1:** How many subsets does a set with n distinct elements have?
- A) n!
- B) 2^n
- C) n^2
- D) n(n-1)/2

**Question 2:** In the BFS subsets approach, what happens at each step?
- A) Remove elements from existing subsets
- B) Add the current element to all existing subsets
- C) Sort all subsets
- D) Randomly generate new subsets

**Question 3:** When generating permutations, how many permutations exist for n distinct elements?
- A) 2^n
- B) n!
- C) n^2
- D) 2n

**Question 4:** True or False: To handle duplicates in subset generation, we should sort the input first.

**Question 5:** For balanced parentheses generation, when can we add a ')' character?
- A) Always
- B) Only if count of ')' < count of '('
- C) Only at the end
- D) Never

### Voice Summary

Your coach will ask you to:
- Walk through generating subsets using BFS
- Explain how to handle duplicates in the input
- Generate valid parentheses for n=3
- Compare time complexity of subsets vs permutations

**You're mastering the Subsets pattern!**`,
    },
  ],
};
