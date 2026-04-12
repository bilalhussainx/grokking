import { Module } from "../types";

export const treeBFSModule: Module = {
  id: "tree-bfs",
  title: "Tree Breadth First Search",
  description: "Learn level-order traversal using queues — process trees level by level for a variety of problems.",
  lessons: [
    {
      id: "tree-bfs-intro",
      slug: "tree-bfs-intro",
      title: "Introduction to Tree BFS",
      content: `## Tree Breadth First Search (BFS)

**Breadth First Search** on a tree visits nodes **level by level**, starting from the root. It uses a **queue** to track which nodes to visit next.

### How It Works

1. Start by pushing the root into a queue.
2. While the queue is not empty:
   a. Record the current queue size — this is the number of nodes at the current level.
   b. Process all nodes at this level: for each node, dequeue it, process it, and enqueue its children.
3. After processing all nodes at a level, move to the next.

### BFS vs DFS

| | BFS | DFS |
|---|-----|-----|
| **Data structure** | Queue (FIFO) | Stack / Recursion (LIFO) |
| **Traversal order** | Level by level | Branch by branch |
| **Best for** | Shortest path, level-order problems | Path-finding, backtracking |
| **Space** | O(w) where w is max width | O(h) where h is height |

### When to Use Tree BFS

- You need to process nodes **level by level**.
- You need the **minimum depth** or shortest path from root.
- You need per-level aggregations (averages, sums, zigzag ordering).

### Tree Representation

In our problems, we define a \`TreeNode\` class and build trees from arrays using level-order insertion (similar to how LeetCode represents trees). \`None\` values in the array represent missing nodes.

### Complexity

BFS visits every node once: **O(n)** time, **O(w)** space where w is the maximum width of the tree (at most n/2 for a complete binary tree).

\`\`\`mermaid
graph TD
    R["1"] --> L["2"]
    R --> Ri["3"]
    L --> LL["4"]
    L --> LR["5"]
    Ri --> RR["6"]
    subgraph Queue["Queue processes level by level"]
        Q1["Level 0: [1]"]
        Q2["Level 1: [2, 3]"]
        Q3["Level 2: [4, 5, 6]"]
    end
    Q1 --> Q2 --> Q3
\`\`\`

\`\`\`mermaid
graph TD
    A["Push root to queue"] --> B{"Queue empty?"}
    B -->|"No"| C["level_size = len queue"]
    C --> D["Process level_size nodes"]
    D --> E["Dequeue node, enqueue children"]
    E --> F["Repeat for all in level"]
    F --> B
    B -->|"Yes"| G["Done: all levels processed"]
\`\`\``,
    },
    {
      id: "tree-bfs-level-order",
      slug: "level-order-traversal",
      title: "Binary Tree Level Order Traversal",
      content: `## Binary Tree Level Order Traversal

### Problem Statement

Given the root of a binary tree, return its **level order traversal** as a list of lists, where each inner list contains the values of nodes at that level.

### Examples

\`\`\`
Input:       1
           /   \\
          2     3
         / \\     \\
        4   5     6

Output: [[1], [2, 3], [4, 5, 6]]
\`\`\`

\`\`\`
Input:       12
           /    \\
          7      1
         /      / \\
        9     10   5

Output: [[12], [7, 1], [9, 10, 5]]
\`\`\`

\`\`\`
Input:  1
Output: [[1]]
\`\`\`

### Approach Hints

- Use a queue. Start with the root.
- At each level, note the queue size, then dequeue exactly that many nodes, collecting their values.
- Enqueue children of each dequeued node.

### Complexity

- **Time:** O(n)
- **Space:** O(n) — queue can hold up to n/2 nodes.`,
      starterCode: `from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def build_tree(values):
    """Build tree from level-order list. None means no node."""
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

def level_order(root):
    # TODO: return list of lists for each level
    pass

# Test cases
print(level_order(build_tree([1, 2, 3, 4, 5, None, 6])))
# Expected: [[1], [2, 3], [4, 5, 6]]

print(level_order(build_tree([12, 7, 1, 9, None, 10, 5])))
# Expected: [[12], [7, 1], [9, 10, 5]]

print(level_order(build_tree([1])))
# Expected: [[1]]
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

def level_order(root):
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

# Test cases
print(level_order(build_tree([1, 2, 3, 4, 5, None, 6])))
# Expected: [[1], [2, 3], [4, 5, 6]]

print(level_order(build_tree([12, 7, 1, 9, None, 10, 5])))
# Expected: [[12], [7, 1], [9, 10, 5]]

print(level_order(build_tree([1])))
# Expected: [[1]]
`,
    },
    {
      id: "tree-bfs-reverse-level",
      slug: "reverse-level-order",
      title: "Reverse Level Order Traversal",
      content: `## Reverse Level Order Traversal

### Problem Statement

Given the root of a binary tree, return the **reverse level order traversal** — the bottom level first, then the second-to-bottom, and so on up to the root level.

### Examples

\`\`\`
Input:       1
           /   \\
          2     3
         / \\     \\
        4   5     6

Output: [[4, 5, 6], [2, 3], [1]]
\`\`\`

\`\`\`
Input:       12
           /    \\
          7      1
         /      / \\
        9     10   5

Output: [[9, 10, 5], [7, 1], [12]]
\`\`\`

\`\`\`
Input:  5
Output: [[5]]
\`\`\`

### Approach Hints

- Perform a standard level-order traversal.
- Instead of appending each level to the end of the result, insert it at the **beginning** (or simply reverse the result at the end).
- Using a deque and \`appendleft\` is efficient for this.

### Complexity

- **Time:** O(n)
- **Space:** O(n)`,
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

def reverse_level_order(root):
    # TODO: return levels from bottom to top
    pass

# Test cases
print(reverse_level_order(build_tree([1, 2, 3, 4, 5, None, 6])))
# Expected: [[4, 5, 6], [2, 3], [1]]

print(reverse_level_order(build_tree([12, 7, 1, 9, None, 10, 5])))
# Expected: [[9, 10, 5], [7, 1], [12]]

print(reverse_level_order(build_tree([5])))
# Expected: [[5]]
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

def reverse_level_order(root):
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

# Test cases
print(reverse_level_order(build_tree([1, 2, 3, 4, 5, None, 6])))
# Expected: [[4, 5, 6], [2, 3], [1]]

print(reverse_level_order(build_tree([12, 7, 1, 9, None, 10, 5])))
# Expected: [[9, 10, 5], [7, 1], [12]]

print(reverse_level_order(build_tree([5])))
# Expected: [[5]]
`,
    },
    {
      id: "tree-bfs-zigzag",
      slug: "zigzag-traversal",
      title: "Zigzag Traversal",
      content: `## Zigzag Traversal

### Problem Statement

Given the root of a binary tree, return its **zigzag level order traversal**. The first level is traversed left-to-right, the second right-to-left, the third left-to-right, and so on.

### Examples

\`\`\`
Input:       1
           /   \\
          2     3
         / \\   / \\
        4   5 6   7

Output: [[1], [3, 2], [4, 5, 6, 7]]
\`\`\`

\`\`\`
Input:       12
           /    \\
          7      1
         /      / \\
        9     10   5
              /
             20

Output: [[12], [1, 7], [9, 10, 5], [20]]
\`\`\`

\`\`\`
Input:  1
Output: [[1]]
\`\`\`

### Approach Hints

- Perform standard BFS level by level.
- Use a boolean flag that alternates between levels.
- On even levels (0, 2, 4...), collect values left-to-right.
- On odd levels (1, 3, 5...), collect values right-to-left (or collect normally and reverse).

### Complexity

- **Time:** O(n)
- **Space:** O(n)`,
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

def zigzag_traversal(root):
    # TODO: return zigzag level order traversal
    pass

# Test cases
print(zigzag_traversal(build_tree([1, 2, 3, 4, 5, 6, 7])))
# Expected: [[1], [3, 2], [4, 5, 6, 7]]

print(zigzag_traversal(build_tree([12, 7, 1, 9, None, 10, 5, None, None, 20])))
# Expected: [[12], [1, 7], [9, 10, 5], [20]]

print(zigzag_traversal(build_tree([1])))
# Expected: [[1]]
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

def zigzag_traversal(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    left_to_right = True
    while queue:
        level_size = len(queue)
        current_level = deque()
        for _ in range(level_size):
            node = queue.popleft()
            if left_to_right:
                current_level.append(node.val)
            else:
                current_level.appendleft(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(list(current_level))
        left_to_right = not left_to_right
    return result

# Test cases
print(zigzag_traversal(build_tree([1, 2, 3, 4, 5, 6, 7])))
# Expected: [[1], [3, 2], [4, 5, 6, 7]]

print(zigzag_traversal(build_tree([12, 7, 1, 9, None, 10, 5, None, None, 20])))
# Expected: [[12], [1, 7], [9, 10, 5], [20]]

print(zigzag_traversal(build_tree([1])))
# Expected: [[1]]
`,
    },
    {
      id: "tree-bfs-level-averages",
      slug: "level-averages",
      title: "Level Averages",
      content: `## Level Averages in a Binary Tree

### Problem Statement

Given the root of a binary tree, return a list containing the **average value** of the nodes at each level.

### Examples

\`\`\`
Input:       1
           /   \\
          2     3
         / \\   / \\
        4   5 6   7

Output: [1.0, 2.5, 5.5]
Explanation: Level 0: avg(1)=1.0, Level 1: avg(2,3)=2.5, Level 2: avg(4,5,6,7)=5.5
\`\`\`

\`\`\`
Input:       12
           /    \\
          7      1
         /      / \\
        9     10   5

Output: [12.0, 4.0, 8.0]
\`\`\`

\`\`\`
Input:  5
Output: [5.0]
\`\`\`

### Approach Hints

- Standard BFS, but at each level compute the sum and divide by the count.
- Collect the average for each level into the result.

\`\`\`mermaid
graph TD
    R["1"] --> L["2"]
    R --> Ri["3"]
    L --> LL["4"]
    L --> LR["5"]
    Ri --> RL["6"]
    Ri --> RR["7"]
    subgraph Averages["Level Averages"]
        AV0["Level 0: avg 1 = 1.0"]
        AV1["Level 1: avg 2,3 = 2.5"]
        AV2["Level 2: avg 4,5,6,7 = 5.5"]
    end
    AV0 --> AV1 --> AV2
\`\`\`

### Complexity

- **Time:** O(n)
- **Space:** O(n)`,
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

def level_averages(root):
    # TODO: return list of averages per level
    pass

# Test cases
print(level_averages(build_tree([1, 2, 3, 4, 5, 6, 7])))
# Expected: [1.0, 2.5, 5.5]

print(level_averages(build_tree([12, 7, 1, 9, None, 10, 5])))
# Expected: [12.0, 4.0, 8.0]

print(level_averages(build_tree([5])))
# Expected: [5.0]
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

def level_averages(root):
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

# Test cases
print(level_averages(build_tree([1, 2, 3, 4, 5, 6, 7])))
# Expected: [1.0, 2.5, 5.5]

print(level_averages(build_tree([12, 7, 1, 9, None, 10, 5])))
# Expected: [12.0, 4.0, 8.0]

print(level_averages(build_tree([5])))
# Expected: [5.0]
`,
    },
    {
      id: "tree-bfs-min-depth",
      slug: "minimum-depth",
      title: "Minimum Depth of Binary Tree",
      content: `## Minimum Depth of Binary Tree

### Problem Statement

Given the root of a binary tree, find its **minimum depth**. The minimum depth is the number of nodes along the shortest path from the root to the **nearest leaf node**.

### Examples

\`\`\`
Input:       1
           /   \\
          2     3
         / \\
        4   5

Output: 2
Explanation: Shortest path is 1 -> 3 (2 nodes).
\`\`\`

\`\`\`
Input:       12
           /    \\
          7      1
               / \\
             10   5

Output: 2
Explanation: Shortest path is 12 -> 7 (leaf).
\`\`\`

\`\`\`
Input:  1
Output: 1
\`\`\`

### Approach Hints

- BFS is ideal here because it processes level by level.
- The **first leaf node** encountered during BFS is at the minimum depth.
- A leaf node is a node with no left and no right child.
- Return the depth as soon as you find the first leaf.

### Complexity

- **Time:** O(n) worst case, but often much faster (stops early).
- **Space:** O(n) for the queue.`,
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

def min_depth(root):
    # TODO: find minimum depth using BFS
    pass

# Test cases
print(min_depth(build_tree([1, 2, 3, 4, 5])))            # Expected: 2
print(min_depth(build_tree([12, 7, 1, None, None, 10, 5])))  # Expected: 2
print(min_depth(build_tree([1])))                          # Expected: 1
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

def min_depth(root):
    if not root:
        return 0
    queue = deque([root])
    depth = 0
    while queue:
        depth += 1
        level_size = len(queue)
        for _ in range(level_size):
            node = queue.popleft()
            # If this is a leaf node, return current depth
            if not node.left and not node.right:
                return depth
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    return depth

# Test cases
print(min_depth(build_tree([1, 2, 3, 4, 5])))            # Expected: 2
print(min_depth(build_tree([12, 7, 1, None, None, 10, 5])))  # Expected: 2
print(min_depth(build_tree([1])))                          # Expected: 1
`,
    },
  ],
};
