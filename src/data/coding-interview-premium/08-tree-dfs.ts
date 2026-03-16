import { Module } from "../types";

export const treeDFSModule: Module = {
  id: "tree-dfs",
  title: "Tree DFS",
  description:
    "Master Depth-First Search (DFS) for tree problems. Learn recursive and iterative approaches for path-finding, sum problems, and tree traversal patterns.",
  lessons: [
    {
      id: "tree-dfs-intro",
      slug: "tree-dfs-intro",
      title: "Introduction to Tree DFS",
      content: `## The Tree DFS Pattern

**Depth-First Search (DFS)** is a tree traversal pattern that explores as far as possible along each branch before backtracking. DFS is often implemented recursively.

<!-- voice:section_check concept="DFS basic concept" -->

### DFS Variants

| Variant | Order | Use Case |
|---------|-------|----------|
| **Pre-order** | Root → Left → Right | Creating copies, serialization |
| **In-order** | Left → Root → Right | BST traversal (gives sorted order) |
| **Post-order** | Left → Right → Root | Deletion, bottom-up calculations |

### How DFS Works

**Recursive Approach:**
~~~
function dfs(node):
    if not node:
        return
    
    # Pre-order: process node here
    dfs(node.left)
    # In-order: process node here  
    dfs(node.right)
    # Post-order: process node here
~~~

<!-- voice:key_insight insight="DFS naturally follows the recursive structure of trees — solve for children first, then combine results" -->

### When to Use DFS vs BFS

- **Use DFS** for: Path problems, all paths, tree properties, problems requiring backtracking
- **Use BFS** for: Shortest path, level-order processing, minimum depth

### Complexity

- **Time:** O(n) — visit each node once
- **Space:** O(h) — recursion stack, where h is tree height (O(log n) balanced, O(n) skewed)`,
    },
    {
      id: "binary-tree-path-sum",
      slug: "binary-tree-path-sum",
      title: "Binary Tree Path Sum",
      content: `## Binary Tree Path Sum

<!-- voice:section_check concept="DFS for path existence" -->

### Problem Statement

Given a binary tree and a target sum, determine if the tree has a root-to-leaf path such that adding up all the values along the path equals the target sum.

### Examples

~~~
Input:  root = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], targetSum = 22
             5
            / \\
           4   8
          /   / \\
         11  13  4
        / \\       \\
       7   2       1
Output: True
Explanation: Path 5 -> 4 -> 11 -> 2 sums to 22
~~~

### Approach

Use DFS recursively. At each node, subtract node value from remaining sum. When reaching a leaf, check if remaining sum equals node value.

<!-- voice:key_insight insight="Pass the remaining sum down the recursion; at leaf, check if remaining sum equals node value" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) — visit nodes until path found
- **Space:** O(h) — recursion stack`,
      starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def has_path_sum(root, target_sum):
    """
    Determine if tree has a root-to-leaf path with given sum.
    
    Args:
        root: TreeNode, root of binary tree
        target_sum: int, target path sum
    
    Returns:
        bool: True if path with target sum exists
    
    Example:
        >>> root = TreeNode(5, TreeNode(4, TreeNode(11, TreeNode(7), TreeNode(2))), TreeNode(8, TreeNode(13), TreeNode(4, None, TreeNode(1))))
        >>> has_path_sum(root, 22)
        True
    """
    # TODO: DFS, subtract node value from sum, check at leaf
    # Hint: At leaf, check if node.val == remaining sum
    pass


# ─── Test Cases ───

# Standard tree with path
root1 = TreeNode(5,
    TreeNode(4, TreeNode(11, TreeNode(7), TreeNode(2))),
    TreeNode(8, TreeNode(13), TreeNode(4, None, TreeNode(1))))
print(has_path_sum(root1, 22))
# Expected: True

# No path exists
print(has_path_sum(root1, 100))
# Expected: False

# Single node matches
root2 = TreeNode(5)
print(has_path_sum(root2, 5))
# Expected: True

# Single node doesn't match
print(has_path_sum(root2, 10))
# Expected: False

# Empty tree
print(has_path_sum(None, 0))
# Expected: False
`,
      solutionCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def has_path_sum(root, target_sum):
    """
    Determine if tree has a root-to-leaf path with given sum.
    
    Time Complexity: O(n) — may visit all nodes
    Space Complexity: O(h) — recursion stack
    """
    if not root:
        return False
    
    # Check if leaf node
    if not root.left and not root.right:
        return root.val == target_sum
    
    # Recursively check left and right subtrees with reduced sum
    remaining = target_sum - root.val
    return has_path_sum(root.left, remaining) or has_path_sum(root.right, remaining)


# ─── Test Cases ───
root1 = TreeNode(5,
    TreeNode(4, TreeNode(11, TreeNode(7), TreeNode(2))),
    TreeNode(8, TreeNode(13), TreeNode(4, None, TreeNode(1))))
print(has_path_sum(root1, 22))
# Expected: True

print(has_path_sum(root1, 100))
# Expected: False

root2 = TreeNode(5)
print(has_path_sum(root2, 5))
# Expected: True

print(has_path_sum(root2, 10))
# Expected: False

print(has_path_sum(None, 0))
# Expected: False
`,
    },
    {
      id: "all-paths-for-sum",
      slug: "all-paths-for-sum",
      title: "All Paths for a Sum",
      content: `## All Paths for a Sum

<!-- voice:section_check concept="DFS for finding all paths" -->

### Problem Statement

Given a binary tree and a target sum, find all root-to-leaf paths where each path's sum equals the target sum.

### Examples

~~~
Input:  root = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], targetSum = 22
             5
            / \\
           4   8
          /   / \\
         11  13  4
        / \\    / \\
       7   2  5   1
Output: [[5, 4, 11, 2], [5, 8, 4, 5]]
~~~

### Approach

Use DFS with backtracking:
1. Maintain current path as you traverse
2. At leaf nodes with matching sum, add a copy of path to results
3. Backtrack by removing current node before returning

<!-- voice:key_insight insight="Use backtracking: add node to path when recursing down, remove when backtracking up" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n²) worst case — visit n nodes, copying path of length n
- **Space:** O(n²) — store all paths`,
      starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def find_paths(root, target_sum):
    """
    Find all root-to-leaf paths with given sum.
    
    Args:
        root: TreeNode, root of binary tree
        target_sum: int, target path sum
    
    Returns:
        List of lists, each inner list is a path with target sum
    
    Example:
        >>> root = TreeNode(5, TreeNode(4, TreeNode(11, TreeNode(7), TreeNode(2))), TreeNode(8, TreeNode(13), TreeNode(4, TreeNode(5), TreeNode(1))))
        >>> find_paths(root, 22)
        [[5, 4, 11, 2], [5, 8, 4, 5]]
    """
    # TODO: DFS with backtracking to find all paths
    # Hint: Maintain current path, add copy to results at matching leaves
    pass


# ─── Test Cases ───

# Multiple paths
root1 = TreeNode(5,
    TreeNode(4, TreeNode(11, TreeNode(7), TreeNode(2))),
    TreeNode(8, TreeNode(13), TreeNode(4, TreeNode(5), TreeNode(1))))
print(find_paths(root1, 22))
# Expected: [[5, 4, 11, 2], [5, 8, 4, 5]]

# Single path
root2 = TreeNode(1, TreeNode(2), TreeNode(3))
print(find_paths(root2, 3))
# Expected: [[1, 2]]

# No paths
print(find_paths(root2, 10))
# Expected: []

# Single node matches
root3 = TreeNode(5)
print(find_paths(root3, 5))
# Expected: [[5]]

# Empty tree
print(find_paths(None, 0))
# Expected: []
`,
      solutionCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def find_paths(root, target_sum):
    """
    Find all root-to-leaf paths with given sum.
    
    Time Complexity: O(n²) — visit n nodes, copy paths
    Space Complexity: O(n²) — store all paths
    """
    def dfs(node, remaining, current_path, result):
        if not node:
            return
        
        # Add current node to path
        current_path.append(node.val)
        
        # Check if leaf and sum matches
        if not node.left and not node.right and node.val == remaining:
            result.append(list(current_path))  # Add copy
        else:
            # Continue DFS
            dfs(node.left, remaining - node.val, current_path, result)
            dfs(node.right, remaining - node.val, current_path, result)
        
        # Backtrack
        current_path.pop()
    
    result = []
    dfs(root, target_sum, [], result)
    return result


# ─── Test Cases ───
root1 = TreeNode(5,
    TreeNode(4, TreeNode(11, TreeNode(7), TreeNode(2))),
    TreeNode(8, TreeNode(13), TreeNode(4, TreeNode(5), TreeNode(1))))
print(find_paths(root1, 22))
# Expected: [[5, 4, 11, 2], [5, 8, 4, 5]]

root2 = TreeNode(1, TreeNode(2), TreeNode(3))
print(find_paths(root2, 3))
# Expected: [[1, 2]]

print(find_paths(root2, 10))
# Expected: []

root3 = TreeNode(5)
print(find_paths(root3, 5))
# Expected: [[5]]

print(find_paths(None, 0))
# Expected: []
`,
    },
    {
      id: "sum-of-path-numbers",
      slug: "sum-of-path-numbers",
      title: "Sum of Path Numbers",
      content: `## Sum of Path Numbers

<!-- voice:section_check concept="DFS for calculating path values" -->

### Problem Statement

Given a binary tree where each node contains a digit (0-9), each root-to-leaf path represents a number. Find the total sum of all root-to-leaf numbers.

### Examples

~~~
Input:  root = [1, 2, 3]
           1
          / \\
         2   3
Output: 25
Explanation: Paths are 12 and 13. Sum = 12 + 13 = 25
~~~

~~~
Input:  root = [4, 9, 0, 5, 1]
           4
          / \\
         9   0
        / \\
       5   1
Output: 1026
Explanation: Paths are 495, 491, and 40. Sum = 495 + 491 + 40 = 1026
~~~

### Approach

DFS with accumulating number. At each node, current_number = previous_number * 10 + node.val. At leaf, add to total sum.

<!-- voice:key_insight insight="Build the number as you traverse: new_number = current * 10 + node.val" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — visit each node
- **Space:** O(h) — recursion stack`,
      starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def sum_numbers(root):
    """
    Find sum of all root-to-leaf path numbers.
    
    Args:
        root: TreeNode, root of binary tree with digit nodes
    
    Returns:
        int: Sum of all path numbers
    
    Example:
        >>> root = TreeNode(1, TreeNode(2), TreeNode(3))
        >>> sum_numbers(root)
        25
    """
    # TODO: DFS, accumulate number, add at leaf
    # Hint: Pass current number down, at leaf add to total
    pass


# ─── Test Cases ───

# Two leaf paths
root1 = TreeNode(1, TreeNode(2), TreeNode(3))
print(sum_numbers(root1))
# Expected: 25

# Multiple paths
root2 = TreeNode(4, TreeNode(9, TreeNode(5), TreeNode(1)), TreeNode(0))
print(sum_numbers(root2))
# Expected: 1026

# Single node
root3 = TreeNode(5)
print(sum_numbers(root3))
# Expected: 5

# Empty tree
print(sum_numbers(None))
# Expected: 0

# Deep tree
root4 = TreeNode(1, TreeNode(2, TreeNode(3)))
print(sum_numbers(root4))
# Expected: 123
`,
      solutionCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def sum_numbers(root):
    """
    Find sum of all root-to-leaf path numbers.
    
    Time Complexity: O(n) — visit each node
    Space Complexity: O(h) — recursion stack
    """
    def dfs(node, current_number):
        if not node:
            return 0
        
        # Build current path number
        current_number = current_number * 10 + node.val
        
        # If leaf, return the number
        if not node.left and not node.right:
            return current_number
        
        # Sum from both subtrees
        return dfs(node.left, current_number) + dfs(node.right, current_number)
    
    return dfs(root, 0)


# ─── Test Cases ───
root1 = TreeNode(1, TreeNode(2), TreeNode(3))
print(sum_numbers(root1))
# Expected: 25

root2 = TreeNode(4, TreeNode(9, TreeNode(5), TreeNode(1)), TreeNode(0))
print(sum_numbers(root2))
# Expected: 1026

root3 = TreeNode(5)
print(sum_numbers(root3))
# Expected: 5

print(sum_numbers(None))
# Expected: 0

root4 = TreeNode(1, TreeNode(2, TreeNode(3)))
print(sum_numbers(root4))
# Expected: 123
`,
    },
    {
      id: "path-with-sequence",
      slug: "path-with-sequence",
      title: "Path With Given Sequence",
      content: `## Path With Given Sequence

<!-- voice:section_check concept="DFS for sequence matching" -->

### Problem Statement

Given a binary tree and a sequence of numbers, determine if there is a root-to-leaf path that matches the given sequence exactly.

### Examples

~~~
Input:  root = [1, 2, 3, 4, 5], sequence = [1, 2, 5]
             1
            / \\
           2   3
          / \\
         4   5
Output: True
Explanation: Path 1 -> 2 -> 5 matches sequence
~~~

~~~
Input:  sequence = [1, 3, 5]
Output: False
Explanation: No path matches this sequence
~~~

### Approach

DFS while tracking position in sequence:
1. Current node value must match sequence at current index
2. At leaf, must have matched entire sequence
3. Recurse left and right with index + 1

<!-- voice:key_insight insight="Track the index in the sequence as you DFS; all paths must match sequence elements in order" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — may visit all nodes
- **Space:** O(h) — recursion stack`,
      starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def find_sequence(root, sequence):
    """
    Determine if a root-to-leaf path matches the given sequence.
    
    Args:
        root: TreeNode, root of binary tree
        sequence: List of integers to match
    
    Returns:
        bool: True if matching path exists
    
    Example:
        >>> root = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))
        >>> find_sequence(root, [1, 2, 5])
        True
    """
    # TODO: DFS, match sequence[index] at each step
    # Hint: At leaf, check if index matches last sequence element
    pass


# ─── Test Cases ───

# Matching sequence exists
root1 = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))
print(find_sequence(root1, [1, 2, 5]))
# Expected: True

# No matching sequence
print(find_sequence(root1, [1, 3, 5]))
# Expected: False

# Sequence longer than any path
print(find_sequence(root1, [1, 2, 4, 6]))
# Expected: False

# Empty sequence (only valid if tree is empty)
print(find_sequence(root1, []))
# Expected: False

# Single element matches
root2 = TreeNode(5)
print(find_sequence(root2, [5]))
# Expected: True
`,
      solutionCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def find_sequence(root, sequence):
    """
    Determine if a root-to-leaf path matches the given sequence.
    
    Time Complexity: O(n) — may visit all nodes
    Space Complexity: O(h) — recursion stack
    """
    def dfs(node, index):
        if not node:
            return False
        
        # Check if current node matches sequence at index
        if index >= len(sequence) or node.val != sequence[index]:
            return False
        
        # Check if leaf and matched entire sequence
        if not node.left and not node.right:
            return index == len(sequence) - 1
        
        # Continue searching in subtrees
        return dfs(node.left, index + 1) or dfs(node.right, index + 1)
    
    if not sequence:
        return root is None
    
    return dfs(root, 0)


# ─── Test Cases ───
root1 = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))
print(find_sequence(root1, [1, 2, 5]))
# Expected: True

print(find_sequence(root1, [1, 3, 5]))
# Expected: False

print(find_sequence(root1, [1, 2, 4, 6]))
# Expected: False

print(find_sequence(root1, []))
# Expected: False

root2 = TreeNode(5)
print(find_sequence(root2, [5]))
# Expected: True
`,
    },
    {
      id: "count-paths-for-sum",
      slug: "count-paths-for-sum",
      title: "Count Paths for a Sum",
      content: `## Count Paths for a Sum

<!-- voice:section_check concept="DFS counting paths from any node" -->

### Problem Statement

Given a binary tree, count the number of paths that sum to a given target. The path does not need to start at the root or end at a leaf, but must go downwards (traveling only from parent to child nodes).

### Examples

~~~
Input:  root = [10, 5, -3, 3, 2, null, 11, 3, -2, null, 1], targetSum = 8
             10
            /  \\
           5   -3
          / \\     \\
         3   2    11
        / \\   \\
       3  -2   1
Output: 3
Explanation: Paths that sum to 8:
- 5 -> 3
- 5 -> 2 -> 1
- -3 -> 11
~~~

### Approach

For each node, consider it as the start of a path and DFS to find all downward paths that sum to target. Use prefix sum technique for O(n) solution, or brute force O(n²).

<!-- voice:key_insight insight="Either check all paths from each node (O(n²)), or use prefix sums with hash map (O(n))" -->

<!-- voice:exercise_intro difficulty="hard" hints_available="3" -->

### Complexity

- **Time:** O(n²) for brute force, O(n) with prefix sums
- **Space:** O(h) for recursion, O(n) for prefix sum map`,
      starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def count_paths(root, target_sum):
    """
    Count paths that sum to target (can start at any node, go downward).
    
    Args:
        root: TreeNode, root of binary tree
        target_sum: int, target path sum
    
    Returns:
        int: Number of paths with target sum
    
    Example:
        >>> root = TreeNode(10, TreeNode(5, TreeNode(3, TreeNode(3), TreeNode(-2)), TreeNode(2, None, TreeNode(1))), TreeNode(-3, None, TreeNode(11)))
        >>> count_paths(root, 8)
        3
    """
    # TODO: For each node, DFS to find paths starting from it
    # Hint: Can start from any node, must go downward
    pass


# ─── Test Cases ───

# Multiple paths
root1 = TreeNode(10,
    TreeNode(5,
        TreeNode(3, TreeNode(3), TreeNode(-2)),
        TreeNode(2, None, TreeNode(1))),
    TreeNode(-3, None, TreeNode(11)))
print(count_paths(root1, 8))
# Expected: 3

# Single path
root2 = TreeNode(1, TreeNode(2), TreeNode(3))
print(count_paths(root2, 3))
# Expected: 2 (1+2 and just 3)

# No paths
print(count_paths(root2, 10))
# Expected: 0

# Negative numbers included
root3 = TreeNode(-1, TreeNode(-2), TreeNode(3, TreeNode(1)))
print(count_paths(root3, -3))
# Expected: 1

# Empty tree
print(count_paths(None, 0))
# Expected: 0
`,
      solutionCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def count_paths(root, target_sum):
    """
    Count paths that sum to target (can start at any node, go downward).
    
    Time Complexity: O(n²) — visit n nodes, each DFS is O(n)
    Space Complexity: O(h) — recursion stack
    """
    def count_from_node(node, remaining):
        """Count paths starting from given node with remaining sum."""
        if not node:
            return 0
        
        count = 0
        if node.val == remaining:
            count += 1
        
        # Continue in both subtrees with reduced sum
        count += count_from_node(node.left, remaining - node.val)
        count += count_from_node(node.right, remaining - node.val)
        
        return count
    
    def dfs(node):
        """DFS to try every node as starting point."""
        if not node:
            return 0
        
        # Paths starting from current node + paths in subtrees
        return (count_from_node(node, target_sum) +
                dfs(node.left) +
                dfs(node.right))
    
    return dfs(root)


# ─── Test Cases ───
root1 = TreeNode(10,
    TreeNode(5,
        TreeNode(3, TreeNode(3), TreeNode(-2)),
        TreeNode(2, None, TreeNode(1))),
    TreeNode(-3, None, TreeNode(11)))
print(count_paths(root1, 8))
# Expected: 3

root2 = TreeNode(1, TreeNode(2), TreeNode(3))
print(count_paths(root2, 3))
# Expected: 2

print(count_paths(root2, 10))
# Expected: 0

root3 = TreeNode(-1, TreeNode(-2), TreeNode(3, TreeNode(1)))
print(count_paths(root3, -3))
# Expected: 1

print(count_paths(None, 0))
# Expected: 0
`,
    },
    {
      id: "tree-dfs-checkpoint",
      slug: "tree-dfs-checkpoint",
      title: "Module Checkpoint: Tree DFS",
      content: `## Module Checkpoint: Tree DFS

<!-- voice:checkpoint_intro -->

Excellent work on the Tree DFS module! Let's verify your understanding.

### Quick Review

You learned:
- **DFS traversal** patterns (pre-order, in-order, post-order)
- Finding **path sums** and all paths with target sum
- **Backtracking** for path enumeration
- Building **path numbers** from root to leaf
- **Counting paths** from any node

### Quiz

**Question 1:** What is the space complexity of recursive DFS?
- A) O(1)
- B) O(n)
- C) O(h) where h is tree height
- D) O(n²)

**Question 2:** In which DFS order do we process the node before its children?
- A) Post-order
- B) In-order
- C) Pre-order
- D) Level-order

**Question 3:** What technique do we use when finding "all paths" to avoid incorrect results?
- A) Dynamic programming
- B) Backtracking
- C) Memoization
- D) Greedy approach

**Question 4:** True or False: DFS is always better than BFS for tree problems.

**Question 5:** When counting paths from any node, what is the brute force time complexity?
- A) O(n)
- B) O(n log n)
- C) O(n²)
- D) O(2^n)

### Voice Summary

Your coach will ask you to:
- Compare DFS and BFS for different tree problems
- Walk through finding all paths with a target sum
- Explain when to use each DFS traversal order

**You're building excellent tree problem-solving skills!**`,
    },
  ],
};
