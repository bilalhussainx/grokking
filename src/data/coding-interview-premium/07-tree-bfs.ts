import { Module } from "../types";

export const treeBFSModule: Module = {
  id: "tree-bfs",
  title: "Tree BFS",
  description:
    "Master Breadth-First Search (BFS) for tree problems. Learn level-by-level traversal techniques for solving tree problems efficiently.",
  lessons: [
    {
      id: "tree-bfs-intro",
      slug: "tree-bfs-intro",
      title: "Introduction to Tree BFS",
      content: `## The Tree BFS Pattern

**Breadth-First Search (BFS)** is a tree traversal pattern that explores nodes level by level, visiting all nodes at the current depth before moving to nodes at the next depth level.

<!-- voice:section_check concept="BFS basic concept" -->

### Why BFS?

BFS is ideal for:
- Finding the **shortest path** in an unweighted tree
- Processing nodes **level by level**
- Finding **minimum depth**
- Problems involving **level-order information**

### How BFS Works

1. Start with root node in a queue
2. While queue is not empty:
   - Process all nodes at current level (queue size = nodes in level)
   - For each node, add its children to the queue
3. Repeat until all levels processed

### Pattern Structure

~~~
queue = deque([root])

while queue:
    level_size = len(queue)
    
    for _ in range(level_size):
        node = queue.popleft()
        # Process node
        
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
~~~

<!-- voice:key_insight insight="BFS uses a queue to ensure we process all nodes at depth d before any node at depth d+1" -->

### BFS Level-by-Level Traversal

\`\`\`mermaid
graph TD
    A["1 (Level 0)"] --> B["2 (Level 1)"]
    A --> C["3 (Level 1)"]
    B --> D["4 (Level 2)"]
    B --> E["5 (Level 2)"]
    C --> F["6 (Level 2)"]
    C --> G["7 (Level 2)"]
    style A fill:#339af0,color:#fff
    style B fill:#51cf66,color:#fff
    style C fill:#51cf66,color:#fff
    style D fill:#ffd93d,color:#000
    style E fill:#ffd93d,color:#000
    style F fill:#ffd93d,color:#000
    style G fill:#ffd93d,color:#000
\`\`\`

> **Queue state per level:** Level 0: \`[1]\` -> Level 1: \`[2, 3]\` -> Level 2: \`[4, 5, 6, 7]\`. The queue size at each level tells you exactly how many nodes to process before moving on.

### Complexity

- **Time:** O(n) — visit each node once
- **Space:** O(w) — where w is the maximum width of the tree`,
    },
    {
      id: "binary-tree-level-order",
      slug: "binary-tree-level-order",
      title: "Binary Tree Level Order Traversal",
      content: `## Binary Tree Level Order Traversal

<!-- voice:section_check concept="classic BFS pattern" -->

### Problem Statement

Given the root of a binary tree, return the level order traversal of its nodes' values (from left to right, level by level).

### Examples

~~~
Input:  root = [3, 9, 20, null, null, 15, 7]
         3
        / \\
       9  20
         /  \\
        15   7
Output: [[3], [9, 20], [15, 7]]
~~~

### Approach

Use BFS with a queue:
1. Start with root in queue
2. For each level, record queue size (number of nodes in this level)
3. Process each node in current level, adding its children to queue
4. Store values for each level separately

<!-- voice:key_insight insight="The queue size at the start of each level tells us exactly how many nodes are in that level" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) — visit each node
- **Space:** O(w) — queue holds at most one level`,
      starterCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def level_order(root):
    """
    Return level order traversal of binary tree.
    
    Args:
        root: TreeNode, root of the binary tree
    
    Returns:
        List of lists, where each inner list contains values of one level
    
    Example:
        >>> root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
        >>> level_order(root)
        [[3], [9, 20], [15, 7]]
    """
    # TODO: Use BFS with queue, track level size
    # Hint: Use queue size at start of each level to know how many nodes to process
    pass


# ─── Test Cases ───

# Standard tree
root1 = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(level_order(root1))
# Expected: [[3], [9, 20], [15, 7]]

# Single node
root2 = TreeNode(1)
print(level_order(root2))
# Expected: [[1]]

# Empty tree
print(level_order(None))
# Expected: []

# Left-skewed tree
root3 = TreeNode(1, TreeNode(2, TreeNode(3)))
print(level_order(root3))
# Expected: [[1], [2], [3]]

# Right-skewed tree
root4 = TreeNode(1, None, TreeNode(2, None, TreeNode(3)))
print(level_order(root4))
# Expected: [[1], [2], [3]]
`,
      solutionCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def level_order(root):
    """
    Return level order traversal of binary tree.
    
    Time Complexity: O(n) — visit each node
    Space Complexity: O(w) — queue holds max width
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result


# ─── Test Cases ───
root1 = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(level_order(root1))
# Expected: [[3], [9, 20], [15, 7]]

root2 = TreeNode(1)
print(level_order(root2))
# Expected: [[1]]

print(level_order(None))
# Expected: []

root3 = TreeNode(1, TreeNode(2, TreeNode(3)))
print(level_order(root3))
# Expected: [[1], [2], [3]]

root4 = TreeNode(1, None, TreeNode(2, None, TreeNode(3)))
print(level_order(root4))
# Expected: [[1], [2], [3]]
`,
    },
    {
      id: "reverse-level-order",
      slug: "reverse-level-order",
      title: "Reverse Level Order Traversal",
      content: `## Reverse Level Order Traversal

<!-- voice:section_check concept="BFS with reversed result" -->

### Problem Statement

Given a binary tree, return the bottom-up level order traversal of its nodes' values (from leaf to root, left to right).

### Examples

~~~
Input:  root = [3, 9, 20, null, null, 15, 7]
         3
        / \\
       9  20
         /  \\
        15   7
Output: [[15, 7], [9, 20], [3]]
~~~

### Approach

Do standard BFS level order, but insert each level at the beginning of the result list (or reverse at the end).

Alternative: Use a deque and appendleft for O(1) insertion at front.

<!-- voice:key_insight insight="Same BFS as level order, just reverse the order of levels in the result" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) — visit each node
- **Space:** O(w) — for queue`,
      starterCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def reverse_level_order(root):
    """
    Return bottom-up level order traversal.
    
    Args:
        root: TreeNode, root of the binary tree
    
    Returns:
        List of lists, levels ordered from leaf to root
    
    Example:
        >>> root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
        >>> reverse_level_order(root)
        [[15, 7], [9, 20], [3]]
    """
    # TODO: Do level order, reverse result (or insert at front)
    # Hint: Can use insert(0, level) or reverse at the end
    pass


# ─── Test Cases ───

# Standard tree
root1 = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(reverse_level_order(root1))
# Expected: [[15, 7], [9, 20], [3]]

# Single node
root2 = TreeNode(1)
print(reverse_level_order(root2))
# Expected: [[1]]

# Empty tree
print(reverse_level_order(None))
# Expected: []

# Complete binary tree
root3 = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3, TreeNode(6), TreeNode(7)))
print(reverse_level_order(root3))
# Expected: [[4, 5, 6, 7], [2, 3], [1]]
`,
      solutionCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def reverse_level_order(root):
    """
    Return bottom-up level order traversal.
    
    Time Complexity: O(n) — visit each node
    Space Complexity: O(w) — queue storage
    """
    if not root:
        return []
    
    result = deque()
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.appendleft(current_level)
    
    return list(result)


# ─── Test Cases ───
root1 = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(reverse_level_order(root1))
# Expected: [[15, 7], [9, 20], [3]]

root2 = TreeNode(1)
print(reverse_level_order(root2))
# Expected: [[1]]

print(reverse_level_order(None))
# Expected: []

root3 = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3, TreeNode(6), TreeNode(7)))
print(reverse_level_order(root3))
# Expected: [[4, 5, 6, 7], [2, 3], [1]]
`,
    },
    {
      id: "zigzag-traversal",
      slug: "zigzag-traversal",
      title: "Zigzag Traversal",
      content: `## Zigzag Traversal

<!-- voice:section_check concept="alternating level directions" -->

### Problem Statement

Given a binary tree, return the zigzag level order traversal of its nodes' values (alternate left-to-right and right-to-left for each level).

### Examples

~~~
Input:  root = [3, 9, 20, null, null, 15, 7]
         3
        / \\
       9  20
         /  \\
        15   7
Output: [[3], [20, 9], [15, 7]]
~~~

### Approach

Do standard BFS level order. Keep track of level number. For even levels (0-indexed), reverse the level values before adding to result.

<!-- voice:key_insight insight="Track the level index; if it's odd, reverse the current level before adding to results" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — visit each node, reversing adds O(w) per level
- **Space:** O(w) — queue storage`,
      starterCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def zigzag_level_order(root):
    """
    Return zigzag level order traversal.
    
    Args:
        root: TreeNode, root of the binary tree
    
    Returns:
        List of lists, alternating left-to-right and right-to-left
    
    Example:
        >>> root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
        >>> zigzag_level_order(root)
        [[3], [20, 9], [15, 7]]
    """
    # TODO: BFS level order, reverse every other level
    # Hint: Use a flag or level index to determine direction
    pass


# ─── Test Cases ───

# Standard tree
root1 = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(zigzag_level_order(root1))
# Expected: [[3], [20, 9], [15, 7]]

# Single node
root2 = TreeNode(1)
print(zigzag_level_order(root2))
# Expected: [[1]]

# Empty tree
print(zigzag_level_order(None))
# Expected: []

# Larger tree
root3 = TreeNode(1,
    TreeNode(2, TreeNode(4), TreeNode(5)),
    TreeNode(3, TreeNode(6), TreeNode(7)))
print(zigzag_level_order(root3))
# Expected: [[1], [3, 2], [4, 5, 6, 7]]
`,
      solutionCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def zigzag_level_order(root):
    """
    Return zigzag level order traversal.
    
    Time Complexity: O(n) — visit each node
    Space Complexity: O(w) — queue storage
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = True
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        if not left_to_right:
            current_level.reverse()
        
        result.append(current_level)
        left_to_right = not left_to_right
    
    return result


# ─── Test Cases ───
root1 = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(zigzag_level_order(root1))
# Expected: [[3], [20, 9], [15, 7]]

root2 = TreeNode(1)
print(zigzag_level_order(root2))
# Expected: [[1]]

print(zigzag_level_order(None))
# Expected: []

root3 = TreeNode(1,
    TreeNode(2, TreeNode(4), TreeNode(5)),
    TreeNode(3, TreeNode(6), TreeNode(7)))
print(zigzag_level_order(root3))
# Expected: [[1], [3, 2], [4, 5, 6, 7]]
`,
    },
    {
      id: "level-averages",
      slug: "level-averages",
      title: "Level Averages",
      content: `## Level Averages in a Binary Tree

<!-- voice:section_check concept="computing per-level statistics" -->

### Problem Statement

Given a binary tree, return the average value of nodes on each level.

### Examples

~~~
Input:  root = [3, 9, 20, null, null, 15, 7]
         3
        / \\
       9  20
         /  \\
        15   7
Output: [3.0, 14.5, 11.0]
Explanation: Level 0: 3, Level 1: (9+20)/2 = 14.5, Level 2: (15+7)/2 = 11.0
~~~

### Approach

Use BFS to traverse level by level. For each level, sum all node values and divide by number of nodes in that level.

<!-- voice:key_insight insight="BFS naturally gives us nodes level by level — just compute average for each level" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) — visit each node
- **Space:** O(w) — queue storage`,
      starterCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def find_level_averages(root):
    """
    Return average value of nodes on each level.
    
    Args:
        root: TreeNode, root of the binary tree
    
    Returns:
        List of floats, average for each level
    
    Example:
        >>> root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
        >>> find_level_averages(root)
        [3.0, 14.5, 11.0]
    """
    # TODO: BFS level order, compute average for each level
    # Hint: Sum values and divide by level size
    pass


# ─── Test Cases ───

# Standard tree
root1 = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(find_level_averages(root1))
# Expected: [3.0, 14.5, 11.0]

# Single node
root2 = TreeNode(1)
print(find_level_averages(root2))
# Expected: [1.0]

# Empty tree
print(find_level_averages(None))
# Expected: []

# All same values
root3 = TreeNode(5, TreeNode(5), TreeNode(5))
print(find_level_averages(root3))
# Expected: [5.0, 5.0]
`,
      solutionCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def find_level_averages(root):
    """
    Return average value of nodes on each level.
    
    Time Complexity: O(n) — visit each node
    Space Complexity: O(w) — queue storage
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level_sum = 0
        
        for _ in range(level_size):
            node = queue.popleft()
            level_sum += node.val
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_sum / level_size)
    
    return result


# ─── Test Cases ───
root1 = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(find_level_averages(root1))
# Expected: [3.0, 14.5, 11.0]

root2 = TreeNode(1)
print(find_level_averages(root2))
# Expected: [1.0]

print(find_level_averages(None))
# Expected: []

root3 = TreeNode(5, TreeNode(5), TreeNode(5))
print(find_level_averages(root3))
# Expected: [5.0, 5.0]
`,
    },
    {
      id: "minimum-depth",
      slug: "minimum-depth",
      title: "Minimum Depth",
      content: `## Minimum Depth of Binary Tree

<!-- voice:section_check concept="BFS for shortest path" -->

### Problem Statement

Given a binary tree, find its minimum depth. The minimum depth is the number of nodes along the shortest path from the root down to the nearest leaf node.

### Examples

~~~
Input:  root = [3, 9, 20, null, null, 15, 7]
         3
        / \\
       9  20
         /  \\
        15   7
Output: 2
Explanation: Shortest path is 3 -> 9
~~~

~~~
Input:  root = [2, null, 3, null, 4, null, 5, null, 6]
         2
          \\
           3
            \\
             4
              \\
               5
                \\
                 6
Output: 5
~~~

### Approach

Use BFS and return the depth of the first leaf node encountered. BFS is optimal here because it finds the shortest path first.

<!-- voice:key_insight insight="BFS finds the shortest path to a leaf first — stop as soon as we hit a leaf node" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) worst case, but often less since we stop at first leaf
- **Space:** O(w) — queue storage`,
      starterCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def min_depth(root):
    """
    Find minimum depth of binary tree.
    
    Args:
        root: TreeNode, root of the binary tree
    
    Returns:
        int: Minimum depth
    
    Example:
        >>> root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
        >>> min_depth(root)
        2
    """
    # TODO: BFS, return depth when first leaf is found
    # Hint: A leaf has no left and no right child
    pass


# ─── Test Cases ───

# Standard tree
root1 = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(min_depth(root1))
# Expected: 2

# Skewed right
root2 = TreeNode(2, None, TreeNode(3, None, TreeNode(4, None, TreeNode(5, None, TreeNode(6)))))
print(min_depth(root2))
# Expected: 5

# Single node
root3 = TreeNode(1)
print(min_depth(root3))
# Expected: 1

# Empty tree
print(min_depth(None))
# Expected: 0

# Left skewed
root4 = TreeNode(1, TreeNode(2, TreeNode(3)))
print(min_depth(root4))
# Expected: 3
`,
      solutionCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def min_depth(root):
    """
    Find minimum depth of binary tree.
    
    Time Complexity: O(n) worst case
    Space Complexity: O(w) — queue storage
    """
    if not root:
        return 0
    
    queue = deque([(root, 1)])
    
    while queue:
        node, depth = queue.popleft()
        
        # Check if this is a leaf node
        if not node.left and not node.right:
            return depth
        
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))
    
    return 0


# ─── Test Cases ───
root1 = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(min_depth(root1))
# Expected: 2

root2 = TreeNode(2, None, TreeNode(3, None, TreeNode(4, None, TreeNode(5, None, TreeNode(6)))))
print(min_depth(root2))
# Expected: 5

root3 = TreeNode(1)
print(min_depth(root3))
# Expected: 1

print(min_depth(None))
# Expected: 0

root4 = TreeNode(1, TreeNode(2, TreeNode(3)))
print(min_depth(root4))
# Expected: 3
`,
    },
    {
      id: "tree-bfs-checkpoint",
      slug: "tree-bfs-checkpoint",
      title: "Module Checkpoint: Tree BFS",
      content: `## Module Checkpoint: Tree BFS

<!-- voice:checkpoint_intro -->

Great job on the Tree BFS module! Let's verify your understanding.

### Quick Review

You learned:
- **BFS traversal** using a queue
- **Level order** traversal
- **Reverse level order** traversal
- **Zigzag** (alternating) traversal
- Finding **minimum depth** with BFS

### Quiz

**Question 1:** What data structure is used for BFS?
- A) Stack
- B) Queue
- C) Heap
- D) Array

**Question 2:** What is the time complexity of BFS on a tree with n nodes?
- A) O(log n)
- B) O(n)
- C) O(n²)
- D) O(n log n)

**Question 3:** Why is BFS preferred for finding minimum depth?
- A) It uses less memory than DFS
- B) It finds the shortest path to a leaf first
- C) It's easier to implement
- D) It works on all tree types

**Question 4:** True or False: BFS processes nodes depth by depth, not level by level.

**Question 5:** In zigzag traversal, when do we reverse a level?
- A) Every level
- B) Every other level (odd-indexed levels)
- C) Only the last level
- D) Never

### Voice Summary

Your coach will ask you to:
- Explain how BFS differs from DFS
- Walk through a level order traversal
- Describe when BFS is the better choice for a tree problem

**You're building strong tree traversal skills!**`,
    },
  ],
};
