import { Module } from "../types";

export const treeDFSModule: Module = {
  id: "tree-dfs",
  title: "Tree Depth First Search",
  description:
    "Explore recursive and iterative DFS techniques for solving path-based tree problems.",
  lessons: [
    {
      id: "tree-dfs-intro",
      slug: "tree-dfs-intro",
      title: "Introduction to Tree DFS",
      content: `## Tree Depth First Search (DFS)

**Depth First Search** explores a tree by going as deep as possible along each branch before backtracking. There are three classic orderings:

### Traversal Orders

| Order | Visit Sequence | Common Use |
|-------|---------------|------------|
| **Pre-order** | Root, Left, Right | Create a copy of the tree, serialize |
| **In-order** | Left, Root, Right | Get sorted order from BST |
| **Post-order** | Left, Right, Root | Delete tree, evaluate expressions |

### Recursive Template

\`\`\`python
def dfs(node):
    if node is None:
        return
    # Pre-order: process node here
    dfs(node.left)
    # In-order: process node here
    dfs(node.right)
    # Post-order: process node here
\`\`\`

### When to Use Tree DFS

- **Path problems:** Find if a path exists with a certain sum, collect all paths, etc.
- **Subtree problems:** Check properties of subtrees.
- **Sequence matching:** Verify if a root-to-leaf path matches a given sequence.

### Recursive vs Iterative

Most DFS tree problems are naturally expressed recursively. Each recursive call represents going one level deeper. The call stack acts as an implicit stack. For iterative DFS, use an explicit stack.

### Complexity

- **Time:** O(n) — visit every node once.
- **Space:** O(h) — where h is the tree height (recursion depth). For a balanced tree h = log n, for a skewed tree h = n.

### Tree Representation

We use the same \`TreeNode\` class and \`build_tree\` helper as in BFS problems, building from a level-order array.`,
    },
    {
      id: "tree-dfs-path-sum",
      slug: "path-sum",
      title: "Binary Tree Path Sum",
      content: `## Binary Tree Path Sum

### Problem Statement

Given the root of a binary tree and a target sum, determine if the tree has a **root-to-leaf path** such that adding up all the values along the path equals the target sum.

A **leaf** is a node with no children.

### Examples

\`\`\`
Input:  target = 10
            1
           / \\
          2   3
         / \\   \\
        4   5   6
Output: True
Explanation: Path 1 -> 2 -> 4 = 7? No. Path 1 -> 3 -> 6 = 10? Yes!
\`\`\`

\`\`\`
Input:  target = 23
           12
          /  \\
         7    1
        /    / \\
       9   10   5
Output: True
Explanation: 12 -> 1 -> 10 = 23
\`\`\`

\`\`\`
Input:  target = 16
           12
          /  \\
         7    1
        /    / \\
       9   10   5
Output: False
\`\`\`

### Approach Hints

- Use recursion. At each node, subtract the node's value from the target.
- If you reach a leaf and the remaining target equals the leaf's value, return True.
- Otherwise, recursively check left and right subtrees.

### Complexity

- **Time:** O(n)
- **Space:** O(h) — recursion stack depth.`,
      starterCode: `from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def build_tree(values):
    if not values:
        return None
    root = TreeNode(values[0])
    queue = deque([root])
    i = 1
    while queue and i < len(values):
        node = queue.popleft()
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

def has_path_sum(root, target):
    # TODO: check if any root-to-leaf path sums to target
    pass

# Test cases
print(has_path_sum(build_tree([1, 2, 3, 4, 5, None, 6]), 10))
# Expected: True (path: 1 -> 3 -> 6)

print(has_path_sum(build_tree([12, 7, 1, 9, None, 10, 5]), 23))
# Expected: True (path: 12 -> 1 -> 10)

print(has_path_sum(build_tree([12, 7, 1, 9, None, 10, 5]), 16))
# Expected: False
`,
      solutionCode: `from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def build_tree(values):
    if not values:
        return None
    root = TreeNode(values[0])
    queue = deque([root])
    i = 1
    while queue and i < len(values):
        node = queue.popleft()
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

def has_path_sum(root, target):
    if not root:
        return False
    # If leaf node, check if remaining sum matches
    if not root.left and not root.right:
        return root.val == target
    # Recurse on children with reduced target
    return (has_path_sum(root.left, target - root.val) or
            has_path_sum(root.right, target - root.val))

# Test cases
print(has_path_sum(build_tree([1, 2, 3, 4, 5, None, 6]), 10))
# Expected: True (path: 1 -> 3 -> 6)

print(has_path_sum(build_tree([12, 7, 1, 9, None, 10, 5]), 23))
# Expected: True (path: 12 -> 1 -> 10)

print(has_path_sum(build_tree([12, 7, 1, 9, None, 10, 5]), 16))
# Expected: False
`,
    },
    {
      id: "tree-dfs-all-paths-sum",
      slug: "all-paths-for-sum",
      title: "All Paths for a Sum",
      content: `## All Paths for a Sum

### Problem Statement

Given the root of a binary tree and a target sum, find **all root-to-leaf paths** where the sum of the node values equals the target.

### Examples

\`\`\`
Input:  target = 23
           12
          /  \\
         7    1
        /    / \\
       4   10   5
Output: [[12, 7, 4], [12, 1, 10]]
\`\`\`

\`\`\`
Input:  target = 18
           12
          /  \\
         7    1
        /    / \\
       4   10   5
Output: [[12, 1, 5]]
\`\`\`

\`\`\`
Input:  target = 8
        1
       / \\
      3   5
     / \\
    2   4
Output: [[1, 3, 4]]
\`\`\`

### Approach Hints

- Use DFS with **backtracking**. Maintain a current path as you traverse.
- At each node, add it to the current path and reduce the target.
- If you reach a leaf and the remaining target equals the leaf's value, save a copy of the current path.
- After exploring both children, **remove** the current node from the path (backtrack).

### Complexity

- **Time:** O(n * log n) — visiting every node, and copying paths of length log n.
- **Space:** O(n * log n) — storing all paths.`,
      starterCode: `from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def build_tree(values):
    if not values:
        return None
    root = TreeNode(values[0])
    queue = deque([root])
    i = 1
    while queue and i < len(values):
        node = queue.popleft()
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

def find_paths(root, target):
    # TODO: find all root-to-leaf paths that sum to target
    pass

# Test cases
print(find_paths(build_tree([12, 7, 1, 4, None, 10, 5]), 23))
# Expected: [[12, 7, 4], [12, 1, 10]]

print(find_paths(build_tree([12, 7, 1, 4, None, 10, 5]), 18))
# Expected: [[12, 1, 5]]

print(find_paths(build_tree([1, 3, 5, 2, 4]), 8))
# Expected: [[1, 3, 4]]
`,
      solutionCode: `from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def build_tree(values):
    if not values:
        return None
    root = TreeNode(values[0])
    queue = deque([root])
    i = 1
    while queue and i < len(values):
        node = queue.popleft()
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

def find_paths(root, target):
    all_paths = []
    def dfs(node, remaining, current_path):
        if not node:
            return
        current_path.append(node.val)
        if not node.left and not node.right and node.val == remaining:
            all_paths.append(list(current_path))
        else:
            dfs(node.left, remaining - node.val, current_path)
            dfs(node.right, remaining - node.val, current_path)
        current_path.pop()  # backtrack
    dfs(root, target, [])
    return all_paths

# Test cases
print(find_paths(build_tree([12, 7, 1, 4, None, 10, 5]), 23))
# Expected: [[12, 7, 4], [12, 1, 10]]

print(find_paths(build_tree([12, 7, 1, 4, None, 10, 5]), 18))
# Expected: [[12, 1, 5]]

print(find_paths(build_tree([1, 3, 5, 2, 4]), 8))
# Expected: [[1, 3, 4]]
`,
    },
    {
      id: "tree-dfs-sum-path-numbers",
      slug: "sum-of-path-numbers",
      title: "Sum of Path Numbers",
      content: `## Sum of Path Numbers

### Problem Statement

Given a binary tree where each node contains a single digit (0-9), each root-to-leaf path represents a number. For example, the path 1 -> 2 -> 3 represents the number 123. Find the **total sum** of all root-to-leaf path numbers.

### Examples

\`\`\`
Input:       1
           /   \\
          7     9
              /   \\
             2     9

Path numbers: 17, 192, 199
Output: 408
\`\`\`

\`\`\`
Input:       1
           /   \\
          0     1
         /     / \\
        1     6   5

Path numbers: 101, 116, 115
Output: 332
\`\`\`

\`\`\`
Input:  5
Output: 5
\`\`\`

### Approach Hints

- Use DFS, passing down the "number so far" (multiply by 10 and add current digit).
- At each leaf, the accumulated number is a complete path number — add it to the total.
- Return the sum of left subtree paths + right subtree paths.

### Complexity

- **Time:** O(n)
- **Space:** O(h) — recursion depth.`,
      starterCode: `from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def build_tree(values):
    if not values:
        return None
    root = TreeNode(values[0])
    queue = deque([root])
    i = 1
    while queue and i < len(values):
        node = queue.popleft()
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

def sum_path_numbers(root):
    # TODO: find total sum of all root-to-leaf path numbers
    pass

# Test cases
print(sum_path_numbers(build_tree([1, 7, 9, None, None, 2, 9])))
# Expected: 408  (17 + 192 + 199)

print(sum_path_numbers(build_tree([1, 0, 1, 1, None, 6, 5])))
# Expected: 332  (101 + 116 + 115)

print(sum_path_numbers(build_tree([5])))
# Expected: 5
`,
      solutionCode: `from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def build_tree(values):
    if not values:
        return None
    root = TreeNode(values[0])
    queue = deque([root])
    i = 1
    while queue and i < len(values):
        node = queue.popleft()
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

def sum_path_numbers(root):
    def dfs(node, path_sum):
        if not node:
            return 0
        path_sum = path_sum * 10 + node.val
        if not node.left and not node.right:
            return path_sum
        return dfs(node.left, path_sum) + dfs(node.right, path_sum)
    return dfs(root, 0)

# Test cases
print(sum_path_numbers(build_tree([1, 7, 9, None, None, 2, 9])))
# Expected: 408  (17 + 192 + 199)

print(sum_path_numbers(build_tree([1, 0, 1, 1, None, 6, 5])))
# Expected: 332  (101 + 116 + 115)

print(sum_path_numbers(build_tree([5])))
# Expected: 5
`,
    },
    {
      id: "tree-dfs-path-sequence",
      slug: "path-with-given-sequence",
      title: "Path With Given Sequence",
      content: `## Path With Given Sequence

### Problem Statement

Given a binary tree and a number sequence, check if the sequence represents a valid **root-to-leaf path** in the tree.

### Examples

\`\`\`
Input:  sequence = [1, 9, 9]
            1
           / \\
          7   9
            /  \\
           2    9

Output: True
Explanation: Path 1 -> 9 -> 9 exists.
\`\`\`

\`\`\`
Input:  sequence = [1, 0, 7]
            1
           / \\
          0   1
         /   / \\
        1   6   5

Output: False
Explanation: Path 1 -> 0 -> 1 exists but sequence asks for [1, 0, 7].
\`\`\`

\`\`\`
Input:  sequence = [1, 1, 6]
            1
           / \\
          0   1
         /   / \\
        1   6   5

Output: True
Explanation: Path 1 -> 1 -> 6 exists.
\`\`\`

### Approach Hints

- Use DFS, tracking which index in the sequence you are currently matching.
- At each node, check if the node's value matches \`sequence[index]\`.
- If the values do not match, return False.
- If you reach a leaf and the index is at the last element, the sequence is valid.
- If you reach a leaf but there are remaining elements (or vice versa), return False.

### Complexity

- **Time:** O(n)
- **Space:** O(h) — recursion depth.`,
      starterCode: `from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def build_tree(values):
    if not values:
        return None
    root = TreeNode(values[0])
    queue = deque([root])
    i = 1
    while queue and i < len(values):
        node = queue.popleft()
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

def has_path_sequence(root, sequence):
    # TODO: check if sequence matches a root-to-leaf path
    pass

# Test cases
print(has_path_sequence(build_tree([1, 7, 9, None, None, 2, 9]), [1, 9, 9]))
# Expected: True

print(has_path_sequence(build_tree([1, 0, 1, 1, None, 6, 5]), [1, 0, 7]))
# Expected: False

print(has_path_sequence(build_tree([1, 0, 1, 1, None, 6, 5]), [1, 1, 6]))
# Expected: True
`,
      solutionCode: `from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def build_tree(values):
    if not values:
        return None
    root = TreeNode(values[0])
    queue = deque([root])
    i = 1
    while queue and i < len(values):
        node = queue.popleft()
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

def has_path_sequence(root, sequence):
    def dfs(node, idx):
        if not node:
            return False
        if idx >= len(sequence) or node.val != sequence[idx]:
            return False
        # If leaf node, check if we matched the entire sequence
        if not node.left and not node.right:
            return idx == len(sequence) - 1
        return dfs(node.left, idx + 1) or dfs(node.right, idx + 1)
    if not root:
        return len(sequence) == 0
    return dfs(root, 0)

# Test cases
print(has_path_sequence(build_tree([1, 7, 9, None, None, 2, 9]), [1, 9, 9]))
# Expected: True

print(has_path_sequence(build_tree([1, 0, 1, 1, None, 6, 5]), [1, 0, 7]))
# Expected: False

print(has_path_sequence(build_tree([1, 0, 1, 1, None, 6, 5]), [1, 1, 6]))
# Expected: True
`,
    },
    {
      id: "tree-dfs-count-paths-sum",
      slug: "count-paths-for-sum",
      title: "Count Paths for a Sum",
      content: `## Count Paths for a Sum

### Problem Statement

Given a binary tree and a target sum, find the **total number of paths** in the tree that sum to the target. A path can **start from any node** and end at any node going downward (from parent to child). The path does not need to start at the root or end at a leaf.

### Examples

\`\`\`
Input:  target = 11
            1
           / \\
          7   9
        / \\   \\
       6   5   2
             /  \\
            3    4
Output: 3
Explanation: Paths: 7->4? No. Let's trace: 7+5-1=11? Check all:
  7 -> 4? No (no node 4 under 5). Actually:
  Path 1: 7 -> (need to find). Correct paths summing to 11:
  7 + 4? There is no 4 under 7. Actually: the tree is
  1-7-6, 1-7-5, 1-9-2-3, 1-9-2-4
  Sums to 11: [1,7,5-2? No] Actually let me restate.
\`\`\`

Let me use cleaner examples:

\`\`\`
Input:  target = 12
           12
          /  \\
         7    1
        /    / \\
       4   10   5
Output: 3
Paths: [12], [7, 4+1? No: 7+4=11, not 12. Wait:
  12 alone = 12 (yes),  7+4=11 (no), 1+10=11+1=12? 1+10=11 (no).
  Hmm let me reconsider: just [12], and maybe other paths.
  Actually: 12 = 12. That's 1 path. Not a great example.
\`\`\`

\`\`\`
Input:  target = 11
            1
           / \\
          7   9
        / \\    \\
       6   5    2
Output: 2
Paths summing to 11: [7, (need 4? no)]. Actually:
  1+7+...? 1+7=8, need 3 more.
  Nope. Better example:
\`\`\`

\`\`\`
Input:  target = 8
            1
           / \\
          3   2
        / \\    \\
       4   2    6
Output: 2
Paths: [3, 2+3=5? Actually: 1+3+4=8 (yes), 2+6=8 (yes).
So paths are: [1,3,4] and [2,6]. Count = 2.
\`\`\`

\`\`\`
Input:  target = 7
           3
          / \\
         1   4
        / \\
       5   2
Output: 2
Paths: [3, 4] sums to 7. [1, (need 6)? no]. [3,1,2]=6 no. [5,1... going up? No, only downward.]
  Actually: [3,4]=7 (yes), [5,1... nope going parent-to-child only: 3->1->2=6, 3->1->5=9, 3->4=7, 1->5=6, 1->2=3, 5=5, 2=2, 4=4, 3=3]
  So just 3+4=7. Count = 1.
Let me fix: target = 6:
  paths: [1,5]=6 and [3,1,2]=6. Count = 2.
\`\`\`

\`\`\`
Input:  target = 6
           3
          / \\
         1   4
        / \\
       5   2
Output: 2
Explanation: [1,5] and [3,1,2] both sum to 6.
\`\`\`

\`\`\`
Input:  target = 5
         1
        / \\
       2   3
      /
     4
Output: 1
Explanation: Only path [1,2... need 2 more... 1+4? 1+2+... no downward: 1->2->4=7. 2+3=5? 3 is not child of 2.]
  Downward paths: 1=1, 1->2=3, 1->2->4=7, 1->3=4, 2=2, 2->4=6, 4=4, 3=3. None sum to 5.
  Hmm. Let me just use target = 3: 1->2=3 and 3 alone. Count = 2.
\`\`\`

\`\`\`
Input:  target = 3
         1
        / \\
       2   3
      /
     4
Output: 2
Explanation: Paths: [1,2] (1+2=3) and [3] (3=3).
\`\`\`

### Approach Hints

- For each node, consider it as a potential **starting point** of a path.
- From that node, try extending downward, tracking the running sum.
- If the running sum equals the target at any point, increment the count.
- Do this for every node in the tree (recurse on the tree, and at each node, run the "count from here" logic).
- Optimization: use a **prefix sum** hash map to avoid redundant computation.

### Complexity

- **Naive:** O(n^2) — for each of n nodes, scan downward (up to n steps).
- **Optimized with prefix sum:** O(n) time, O(h) space.`,
      starterCode: `from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def build_tree(values):
    if not values:
        return None
    root = TreeNode(values[0])
    queue = deque([root])
    i = 1
    while queue and i < len(values):
        node = queue.popleft()
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

def count_paths(root, target):
    # TODO: count all downward paths that sum to target
    pass

# Test cases
print(count_paths(build_tree([1, 3, 2, 4, 2, None, 6]), 8))
# Expected: 2  (paths: [1,3,4] and [2,6])

print(count_paths(build_tree([3, 1, 4, 5, 2]), 6))
# Expected: 2  (paths: [1,5] and [3,1,2])

print(count_paths(build_tree([1, 2, 3, 4]), 3))
# Expected: 2  (paths: [1,2] and [3])
`,
      solutionCode: `from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def build_tree(values):
    if not values:
        return None
    root = TreeNode(values[0])
    queue = deque([root])
    i = 1
    while queue and i < len(values):
        node = queue.popleft()
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

def count_paths(root, target):
    def dfs(node, prefix_sum, prefix_map):
        if not node:
            return 0
        prefix_sum += node.val
        # Count paths ending at this node
        count = prefix_map.get(prefix_sum - target, 0)
        # Update prefix sum map
        prefix_map[prefix_sum] = prefix_map.get(prefix_sum, 0) + 1
        # Recurse into children
        count += dfs(node.left, prefix_sum, prefix_map)
        count += dfs(node.right, prefix_sum, prefix_map)
        # Backtrack: remove current prefix sum
        prefix_map[prefix_sum] -= 1
        if prefix_map[prefix_sum] == 0:
            del prefix_map[prefix_sum]
        return count
    # prefix_map starts with {0: 1} to handle paths starting from root
    return dfs(root, 0, {0: 1})

# Test cases
print(count_paths(build_tree([1, 3, 2, 4, 2, None, 6]), 8))
# Expected: 2  (paths: [1,3,4] and [2,6])

print(count_paths(build_tree([3, 1, 4, 5, 2]), 6))
# Expected: 2  (paths: [1,5] and [3,1,2])

print(count_paths(build_tree([1, 2, 3, 4]), 3))
# Expected: 2  (paths: [1,2] and [3])
`,
    },
  ],
};
