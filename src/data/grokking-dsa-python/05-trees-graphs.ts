import { Module } from "../types";

export const treesGraphsModule: Module = {
  id: "trees-graphs",
  title: "Trees & Graphs",
  description:
    "Understand binary trees, master DFS and BFS traversals, and learn how graphs generalize trees. These structures power databases, file systems, social networks, and navigation systems.",
  lessons: [
    // ─── Lesson 1: Binary Trees Fundamentals ───
    {
      id: "binary-trees-fundamentals",
      slug: "binary-trees-fundamentals",
      title: "Binary Trees Fundamentals",
      content: `## What Is a Tree?

A **tree** is a hierarchical data structure where each node has zero or more children. Unlike arrays and linked lists (which are linear), trees branch out — making them perfect for representing hierarchies like file systems, organizational charts, and decision processes.

A **binary tree** is a tree where each node has **at most two children**: a left child and a right child.

\`\`\`
        1           ← root
       / \\
      2   3         ← children of 1
     / \\   \\
    4   5   6       ← leaves (no children)
\`\`\`

<!-- voice:section_check concept="binary tree = each node has at most 2 children" -->

\`\`\`mermaid
graph TB
    R["1 (root)"] --> L["2 (left child)"]
    R --> Ri["3 (right child)"]
    L --> LL["4 (leaf)"]
    L --> LR["5 (leaf)"]
    Ri --> RR["6 (leaf)"]
    style R fill:#42a5f5,stroke:#333
    style LL fill:#66bb6a,stroke:#333
    style LR fill:#66bb6a,stroke:#333
    style RR fill:#66bb6a,stroke:#333
\`\`\`

## Tree Terminology

| Term | Meaning |
|------|---------|
| **Root** | The topmost node (no parent) |
| **Leaf** | A node with no children |
| **Parent/Child** | A node and its direct descendants |
| **Depth** | Distance from root to a node (root = depth 0) |
| **Height** | Longest path from a node to a leaf |
| **Subtree** | A node and all its descendants |

## Building a Binary Tree in Python

\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Build the tree from the diagram above
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)
root.right.right = TreeNode(6)

# Or nest it:
root = TreeNode(1,
    TreeNode(2, TreeNode(4), TreeNode(5)),
    TreeNode(3, None, TreeNode(6))
)
\`\`\`

## Java Comparison

\`\`\`java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

TreeNode root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
\`\`\`

<!-- voice:key_insight insight="Trees are recursive — every subtree is itself a tree. This makes recursion the natural tool for tree problems." -->

## DFS Traversals: Three Flavors

**Depth-First Search (DFS)** visits nodes by going as deep as possible before backtracking. There are three orders, differing only in WHEN you process the current node:

\`\`\`python
def inorder(node):      # Left → Root → Right
    if not node:
        return
    inorder(node.left)
    print(node.val)     # Process HERE (between left and right)
    inorder(node.right)

def preorder(node):     # Root → Left → Right
    if not node:
        return
    print(node.val)     # Process HERE (before children)
    preorder(node.left)
    preorder(node.right)

def postorder(node):    # Left → Right → Root
    if not node:
        return
    postorder(node.left)
    postorder(node.right)
    print(node.val)     # Process HERE (after children)
\`\`\`

**For the tree [1,2,3,4,5,None,6]:**
- **Inorder:** 4, 2, 5, 1, 3, 6 (BSTs give sorted order!)
- **Preorder:** 1, 2, 4, 5, 3, 6 (copy a tree)
- **Postorder:** 4, 5, 2, 6, 3, 1 (delete a tree, calculate size)

<!-- voice:section_check concept="three DFS traversals differ in when you process the node" -->

## Try It Yourself

Implement inorder traversal (returning a list) and a function to calculate the height of a binary tree.
`,
      starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def inorder_traversal(root):
    """
    Return the inorder traversal of a binary tree as a list.
    Inorder: Left → Root → Right

    Args:
        root: Root TreeNode

    Returns:
        List of values in inorder sequence

    Example:
        Tree:    1
                / \\
               2   3
        >>> inorder_traversal(root)
        [2, 1, 3]
    """
    # TODO: Use recursion — traverse left, add current, traverse right
    # Base case: if root is None, return empty list
    pass


def tree_height(root):
    """
    Calculate the height of a binary tree.
    Height = number of edges on the longest root-to-leaf path.
    An empty tree has height -1. A single node has height 0.

    Args:
        root: Root TreeNode

    Returns:
        Integer height

    Example:
        Tree:    1
                / \\
               2   3
              /
             4
        >>> tree_height(root)
        2
    """
    # TODO: Recursively find height of left and right subtrees
    # Height = 1 + max(left_height, right_height)
    pass


# ─── Test Cases ───
# Do not modify below this line

root1 = TreeNode(1, TreeNode(2), TreeNode(3))
print(inorder_traversal(root1))
# Expected: [2, 1, 3]

root2 = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))
print(inorder_traversal(root2))
# Expected: [4, 2, 5, 1, 3]

print(inorder_traversal(None))
# Expected: []

print(tree_height(root1))
# Expected: 1

root3 = TreeNode(1, TreeNode(2, TreeNode(4)), TreeNode(3))
print(tree_height(root3))
# Expected: 2

print(tree_height(None))
# Expected: -1

print(tree_height(TreeNode(42)))
# Expected: 0
`,
      solutionCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def inorder_traversal(root):
    """
    Return the inorder traversal of a binary tree.

    Time Complexity: O(n) — visit every node once
    Space Complexity: O(n) — result list + O(h) recursion stack
    """
    if not root:
        return []
    return inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right)


def tree_height(root):
    """
    Calculate the height of a binary tree.

    Time Complexity: O(n) — visit every node once
    Space Complexity: O(h) — recursion stack depth = height
    """
    if not root:
        return -1
    return 1 + max(tree_height(root.left), tree_height(root.right))


# ─── Test Cases ───
# Do not modify below this line

root1 = TreeNode(1, TreeNode(2), TreeNode(3))
print(inorder_traversal(root1))
# Expected: [2, 1, 3]

root2 = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))
print(inorder_traversal(root2))
# Expected: [4, 2, 5, 1, 3]

print(inorder_traversal(None))
# Expected: []

print(tree_height(root1))
# Expected: 1

root3 = TreeNode(1, TreeNode(2, TreeNode(4)), TreeNode(3))
print(tree_height(root3))
# Expected: 2

print(tree_height(None))
# Expected: -1

print(tree_height(TreeNode(42)))
# Expected: 0
`,
    },

    // ─── Lesson 2: BFS / Level-Order Traversal ───
    {
      id: "bfs-level-order",
      slug: "bfs-level-order",
      title: "BFS & Level-Order Traversal",
      content: `## Breadth-First Search on Trees

While DFS goes deep first, **BFS** explores all nodes at the current depth before moving deeper. On trees, this gives us **level-order traversal** — visiting nodes level by level, left to right.

\`\`\`
Tree:       1
           / \\
          2   3
         / \\   \\
        4   5   6

Level order: [1], [2, 3], [4, 5, 6]
\`\`\`

<!-- voice:section_check concept="BFS visits nodes level by level using a queue" -->
## The Algorithm

BFS uses a **queue**. Process one level at a time by tracking the number of nodes at each level:

\`\`\`python
from collections import deque

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
\`\`\`

**Key trick:** Before processing each level, record \`len(queue)\` — that tells you exactly how many nodes belong to the current level.

<!-- voice:key_insight insight="The level_size = len(queue) trick separates BFS results into distinct levels" -->

## Java Version

\`\`\`java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;

    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> level = new ArrayList<>();

        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
    }
    return result;
}
\`\`\`

## DFS vs BFS: When to Use Which

| | DFS | BFS |
|---|-----|-----|
| **Data structure** | Stack (or recursion) | Queue |
| **Explores** | Deep first | Wide first |
| **Best for** | Path finding, backtracking | Shortest path, level-order |
| **Space** | O(h) — height of tree | O(w) — width of tree |
| **Tree example** | Inorder/preorder/postorder | Level-order |

<!-- voice:section_check concept="DFS uses stack/recursion, BFS uses queue" -->

## BFS Variations

- **Level-order traversal** — visit each level left to right
- **Zigzag traversal** — alternate left-to-right and right-to-left
- **Right side view** — last node of each level
- **Average of levels** — mean value per level

All use the same BFS template, just change what you do with each level.

## Try It Yourself

Implement level-order traversal and a function that finds the maximum value at each level.
`,
      starterCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def level_order(root):
    """
    Return the level-order traversal as a list of lists.
    Each inner list contains the values at that depth level.

    Args:
        root: Root TreeNode

    Returns:
        List of lists, one per level

    Example:
        Tree:    1
                / \\
               2   3
              / \\
             4   5
        >>> level_order(root)
        [[1], [2, 3], [4, 5]]
    """
    # TODO: Use a queue (deque)
    # Track level_size = len(queue) at the start of each level
    # Process that many nodes, adding their children to the queue
    pass


def max_per_level(root):
    """
    Find the maximum value at each level of the tree.

    Args:
        root: Root TreeNode

    Returns:
        List of maximum values, one per level

    Example:
        Tree:    1
                / \\
               2   3
              / \\
             4   5
        >>> max_per_level(root)
        [1, 3, 5]
    """
    # TODO: Use level-order traversal and track the max at each level
    pass


# ─── Test Cases ───
# Do not modify below this line

root = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))
print(level_order(root))
# Expected: [[1], [2, 3], [4, 5]]

print(level_order(None))
# Expected: []

print(level_order(TreeNode(42)))
# Expected: [[42]]

print(max_per_level(root))
# Expected: [1, 3, 5]

root2 = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(max_per_level(root2))
# Expected: [3, 20, 15]

print(max_per_level(None))
# Expected: []
`,
      solutionCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def level_order(root):
    """
    Return the level-order traversal as a list of lists.

    Time Complexity: O(n) — visit every node once
    Space Complexity: O(n) — queue holds at most one full level
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


def max_per_level(root):
    """
    Find the maximum value at each level.

    Time Complexity: O(n) — visit every node once
    Space Complexity: O(n) — queue + result
    """
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)
        level_max = float('-inf')

        for _ in range(level_size):
            node = queue.popleft()
            level_max = max(level_max, node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        result.append(level_max)

    return result


# ─── Test Cases ───
# Do not modify below this line

root = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))
print(level_order(root))
# Expected: [[1], [2, 3], [4, 5]]

print(level_order(None))
# Expected: []

print(level_order(TreeNode(42)))
# Expected: [[42]]

print(max_per_level(root))
# Expected: [1, 3, 5]

root2 = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(max_per_level(root2))
# Expected: [3, 20, 15]

print(max_per_level(None))
# Expected: []
`,
    },

    // ─── Lesson 3: Graph Basics & BFS/DFS ───
    {
      id: "graph-basics-bfs-dfs",
      slug: "graph-basics-bfs-dfs",
      title: "Graph Basics & BFS/DFS",
      content: `## From Trees to Graphs

A tree is actually a special case of a **graph** — a graph with no cycles and a single root. Graphs are more general: any node can connect to any other node, cycles are allowed, and there's no hierarchy.

\`\`\`
Tree (special graph):       General graph:
      A                     A --- B
     / \\                    |   / |
    B   C                   |  /  |
   / \\                      | /   |
  D   E                    C --- D
\`\`\`

<!-- voice:section_check concept="graphs generalize trees — any node can connect to any other" -->

\`\`\`mermaid
graph LR
    subgraph "Directed Graph"
        DA["A"] -->|""| DB["B"]
        DA -->|""| DC["C"]
        DB -->|""| DD["D"]
        DC -->|""| DD
    end
    subgraph "Undirected Graph"
        UA["A"] ---|""| UB["B"]
        UA ---|""| UC["C"]
        UB ---|""| UD["D"]
        UC ---|""| UD
        UB ---|""| UC
    end
    style DA fill:#42a5f5,stroke:#333
    style UA fill:#66bb6a,stroke:#333
\`\`\`

## Graph Terminology

| Term | Meaning |
|------|---------|
| **Vertex/Node** | A point in the graph |
| **Edge** | A connection between two vertices |
| **Directed** | Edges have a direction (A->B is not B->A) |
| **Undirected** | Edges go both ways |
| **Weighted** | Edges have costs/distances |
| **Cycle** | A path that starts and ends at the same node |
| **Connected** | Every node is reachable from every other node |

## Representing Graphs

### Adjacency List (most common)

\`\`\`python
# Undirected graph
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'C', 'D'],
    'C': ['A', 'B', 'D'],
    'D': ['B', 'C'],
}

# Using defaultdict for dynamic construction
from collections import defaultdict
graph = defaultdict(list)
edges = [('A','B'), ('A','C'), ('B','C'), ('B','D'), ('C','D')]
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)  # Remove this line for directed graphs
\`\`\`

### Java Adjacency List

\`\`\`java
Map<String, List<String>> graph = new HashMap<>();
graph.put("A", Arrays.asList("B", "C"));
graph.put("B", Arrays.asList("A", "C", "D"));
// ... etc
\`\`\`

<!-- voice:key_insight insight="Adjacency lists are the default graph representation — they use O(V + E) space and support efficient neighbor iteration" -->

## BFS on Graphs

Same as tree BFS, but we need a **visited set** to avoid infinite loops in cycles:

\`\`\`python
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order
\`\`\`

## DFS on Graphs

\`\`\`python
def dfs(graph, start):
    visited = set()
    order = []

    def explore(node):
        visited.add(node)
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                explore(neighbor)

    explore(start)
    return order
\`\`\`

<!-- voice:section_check concept="graphs need a visited set to handle cycles" -->

## BFS Finds Shortest Path (Unweighted)

In an unweighted graph, BFS naturally finds the shortest path:

\`\`\`python
def shortest_path(graph, start, end):
    if start == end:
        return [start]

    visited = set([start])
    queue = deque([(start, [start])])

    while queue:
        node, path = queue.popleft()
        for neighbor in graph[node]:
            if neighbor == end:
                return path + [neighbor]
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))

    return []  # No path found
\`\`\`

**Why BFS finds shortest paths:** It explores all nodes at distance 1 first, then distance 2, then distance 3, etc. The first time it reaches the target is guaranteed to be via the shortest path.

## Try It Yourself

Implement BFS traversal and a function to check if a path exists between two nodes.
`,
      starterCode: `from collections import deque


def bfs_traversal(graph, start):
    """
    Perform BFS on a graph and return the traversal order.

    Args:
        graph: Adjacency list (dict mapping node to list of neighbors)
        start: Starting node

    Returns:
        List of nodes in BFS order

    Example:
        >>> graph = {'A': ['B', 'C'], 'B': ['A', 'D'], 'C': ['A'], 'D': ['B']}
        >>> bfs_traversal(graph, 'A')
        ['A', 'B', 'C', 'D']
    """
    # TODO: Use a queue and a visited set
    # Enqueue start, mark as visited
    # While queue is not empty: dequeue, add to result, enqueue unvisited neighbors
    pass


def has_path(graph, start, end):
    """
    Check if there is a path from start to end in the graph.

    Args:
        graph: Adjacency list (dict)
        start: Starting node
        end: Target node

    Returns:
        True if a path exists, False otherwise

    Example:
        >>> graph = {'A': ['B'], 'B': ['C'], 'C': [], 'D': []}
        >>> has_path(graph, 'A', 'C')
        True
        >>> has_path(graph, 'A', 'D')
        False
    """
    # TODO: Use BFS or DFS to check reachability
    pass


# ─── Test Cases ───
# Do not modify below this line

graph1 = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C'],
}
print(bfs_traversal(graph1, 'A'))
# Expected: ['A', 'B', 'C', 'D']

graph2 = {'X': ['Y'], 'Y': ['X']}
print(bfs_traversal(graph2, 'X'))
# Expected: ['X', 'Y']

graph3 = {
    'A': ['B'],
    'B': ['C'],
    'C': [],
    'D': [],
}
print(has_path(graph3, 'A', 'C'))
# Expected: True

print(has_path(graph3, 'A', 'D'))
# Expected: False

print(has_path(graph3, 'C', 'A'))
# Expected: False

print(has_path(graph1, 'A', 'D'))
# Expected: True
`,
      solutionCode: `from collections import deque


def bfs_traversal(graph, start):
    """
    Perform BFS on a graph.

    Time Complexity: O(V + E) — visit every vertex and edge once
    Space Complexity: O(V) — visited set and queue
    """
    visited = set([start])
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order


def has_path(graph, start, end):
    """
    Check if a path exists from start to end using BFS.

    Time Complexity: O(V + E) — worst case visits entire graph
    Space Complexity: O(V) — visited set
    """
    if start == end:
        return True

    visited = set([start])
    queue = deque([start])

    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor == end:
                return True
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return False


# ─── Test Cases ───
# Do not modify below this line

graph1 = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C'],
}
print(bfs_traversal(graph1, 'A'))
# Expected: ['A', 'B', 'C', 'D']

graph2 = {'X': ['Y'], 'Y': ['X']}
print(bfs_traversal(graph2, 'X'))
# Expected: ['X', 'Y']

graph3 = {
    'A': ['B'],
    'B': ['C'],
    'C': [],
    'D': [],
}
print(has_path(graph3, 'A', 'C'))
# Expected: True

print(has_path(graph3, 'A', 'D'))
# Expected: False

print(has_path(graph3, 'C', 'A'))
# Expected: False

print(has_path(graph1, 'A', 'D'))
# Expected: True
`,
    },

    // ─── Lesson 4: Module Checkpoint ───
    {
      id: "trees-graphs-checkpoint",
      slug: "trees-graphs-checkpoint",
      title: "Module Checkpoint: Trees & Graphs",
      content: `## Outstanding Progress!

You've completed the Trees & Graphs module — arguably the most important module for coding interviews. Trees and graphs appear in 25-30% of interview questions.

<!-- voice:section_check concept="module recap" -->
## What You've Mastered

1. **Binary Tree structure** — TreeNode with val, left, right; recursive thinking
2. **DFS Traversals** — inorder (sorted BST), preorder (copy), postorder (delete)
3. **BFS / Level-Order** — queue-based, level_size trick for separating levels
4. **Graph Representation** — adjacency list, directed vs undirected
5. **Graph BFS/DFS** — visited set to handle cycles, shortest path with BFS

## Quick Quiz

**Question 1:** Which DFS traversal visits nodes in sorted order on a Binary Search Tree?

A) Preorder
B) Inorder
C) Postorder
D) Level-order

**Question 2:** What data structure does BFS use?

A) Stack
B) Queue
C) Priority queue
D) Hash map

**Question 3:** Why does graph BFS/DFS need a "visited" set, but tree BFS/DFS does not?

A) Trees have more nodes
B) Trees have no cycles, so you can never revisit a node
C) Graphs are always larger
D) Trees don't have edges

**Question 4:** You need to find the shortest path between two cities in a road network where all roads have equal length. Which algorithm should you use and why?

**Question 5:** A binary tree has n nodes. What is the time and space complexity of level-order traversal?

A) Time O(n), Space O(n)
B) Time O(n log n), Space O(n)
C) Time O(n), Space O(log n)
D) Time O(n^2), Space O(n)

## Voice Summary

Explain to your voice coach the difference between DFS and BFS, including:
- What data structure each uses
- The order in which they visit nodes
- When you'd choose one over the other
`,
    },
  ],
};
