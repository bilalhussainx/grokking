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

\`\`\`concept
{
  "title": "BFS Mental Model",
  "variant": "mental-model",
  "content": "Imagine water rippling outward from a stone dropped in a pond. BFS explores the tree the same way: every node at distance k from the root is discovered before any node at distance k+1. The queue is your \\"frontier\\" of ripples."
}
\`\`\`

### How It Works

\`\`\`steps
{
  "title": "BFS Algorithm Steps",
  "steps": [
    {
      "title": "1. Seed the queue",
      "content": "Push the root node into an empty queue."
    },
    {
      "title": "2. Snapshot the level",
      "content": "Record current queue size — this is the exact count of nodes at the current depth."
    },
    {
      "title": "3. Drain the level",
      "content": "Loop level_size times: dequeue a node, process it, enqueue its left then right child (if they exist)."
    },
    {
      "title": "4. Repeat",
      "content": "When the queue empties, every level has been processed in order."
    }
  ]
}
\`\`\`

\`\`\`algoviz
{
  "title": "BFS on a sample tree",
  "type": "tree",
  "data": [1, 2, 3, 4, 5, 6],
  "frames": [
    { "highlight": [0], "label": "Level 0: queue [1]", "stats": {"level": 0} },
    { "highlight": [1, 2], "label": "Level 1: queue [2, 3]", "stats": {"level": 1} },
    { "highlight": [3, 4, 5], "label": "Level 2: queue [4, 5, 6]", "stats": {"level": 2} }
  ],
  "speed": 1000
}
\`\`\`

### BFS vs DFS

|  | BFS | DFS |
|---|---|---|
| **Data structure** | Queue (FIFO) | Stack / Recursion (LIFO) |
| **Traversal order** | Level by level | Branch by branch |
| **Best for** | Shortest path, level-order problems | Path-finding, backtracking |
| **Space** | O(w) where w is max width | O(h) where h is height |

\`\`\`callout
{
  "type": "tip",
  "title": "Space Complexity Intuition",
  "content": "In the worst case the queue holds an entire level. For a complete binary tree that’s ⌈n/2⌉ nodes at the bottom level, so O(n) space is possible; sparse trees can be far better."
}
\`\`\`

### When to Use Tree BFS

- You need to process nodes **level by level**.
- You need the **minimum depth** or shortest path from root.
- You need per-level aggregations (averages, sums, zigzag ordering).

### Tree Representation

We use the standard \`TreeNode\` class and build trees from arrays via level-order insertion (LeetCode style). \`None\` values represent missing nodes.

\`\`\`playground
{
  "title": "Build & BFS a tree",
  "language": "python",
  "code": "from collections import deque\\n\\nclass TreeNode:\\n    def __init__(self, val=0, left=None, right=None):\\n        self.val, self.left, self.right = val, left, right\\n\\ndef bfs(root):\\n    if not root: return []\\n    q, out = deque([root]), []\\n    while q:\\n        level_size = len(q)\\n        level = []\\n        for _ in range(level_size):\\n            node = q.popleft()\\n            level.append(node.val)\\n            if node.left:  q.append(node.left)\\n            if node.right: q.append(node.right)\\n        out.append(level)\\n    return out\\n\\n# Build tree [1,2,3,4,5,6]\\nroot = TreeNode(1)\\nroot.left, root.right = TreeNode(2), TreeNode(3)\\nroot.left.left, root.left.right = TreeNode(4), TreeNode(5)\\nroot.right.right = TreeNode(6)\\n\\nprint(\\"Level-order:\\", bfs(root))",
  "runnable": true
}
\`\`\`

### Complexity

BFS touches every node once: **O(n)** time and **O(w)** space, where *w* is the maximum width of the tree (≤ n/2 for complete binary trees).

\`\`\`quiz
{
  "title": "Check your understanding",
  "questions": [
    {
      "question": "Which data structure guarantees level-by-level visitation?",
      "options": ["Stack", "Priority Queue", "Queue", "Deque"],
      "answer": 2,
      "explanation": "A FIFO queue enforces the order: all nodes enqueued earlier (i.e., at shallower depths) are dequeued first."
    },
    {
      "question": "In a complete binary tree with 15 nodes, what is the worst-case queue size during BFS?",
      "options": ["1", "4", "8", "15"],
      "answer": 2,
      "explanation": "The bottom level holds 8 nodes (level 3, 2³ = 8), so the queue peaks at 8."
    },
    {
      "question": "BFS is preferable to DFS when you need:",
      "options": ["Any path from root to leaf", "Lexicographically smallest path", "Shortest path in terms of edges", "Post-order traversal"],
      "answer": 2,
      "explanation": "Because BFS explores by increasing distance, the first time it reaches a target node is via the shortest edge path."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "BFS = level-order traversal using a queue.",
    "Time O(n), space O(w) where w is max level width.",
    "Use BFS for shortest-path or per-level tasks; use DFS for deep-path or backtracking tasks."
  ]
}
\`\`\``,
    },
    {
      id: "tree-bfs-level-order",
      slug: "level-order-traversal",
      title: "Binary Tree Level Order Traversal",
      content: `## Binary Tree Level Order Traversal

### Problem Statement

Given the root of a binary tree, return its **level order traversal** as a list of lists, where each inner list contains the values of nodes at that level.

\`\`\`concept
{"title": "Level Order = Breadth-First Search", "variant": "mental-model", "content": "Level order traversal is simply BFS on a tree. Instead of exploring one branch to the bottom (DFS), you explore all neighbors at the present depth before moving on to nodes at the next depth. A queue guarantees the left-to-right order within each level."}
\`\`\`

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

\`\`\`algoviz
{"title": "Visual Walk-through on Example 1", "type": "tree", "data": [1,2,3,4,5,null,6], "frames": [
  {"highlight": [0], "label": "Queue: [1]  →  output [[1]]", "stats": {"level": 0}},
  {"highlight": [1,2], "label": "Queue: [2,3]  →  output [[1],[2,3]]", "stats": {"level": 1}},
  {"highlight": [3,4,5], "label": "Queue: [4,5,6]  →  output [[1],[2,3],[4,5,6]]", "stats": {"level": 2}}
], "speed": 900}
\`\`\`

### Approach

We use an iterative queue-based BFS:

1. Start with the root in the queue.
2. While the queue is not empty:
   - Record the current queue size = number of nodes at this level.
   - Dequeue exactly that many nodes, collecting their values.
   - Enqueue their left and right children (if any).

\`\`\`steps
{"title": "Step-by-step Algorithm", "steps": [
  {"title": "Initialize", "content": "Create an empty result list and a queue containing just the root node."},
  {"title": "Process Level", "content": "While queue is not empty:\\n- Let \`level_size = len(queue)\`\\n- Create an empty \`level_nodes\` list"},
  {"title": "Dequeue & Collect", "content": "Loop \`level_size\` times:\\n- \`node = queue.popleft()\`\\n- Append \`node.val\` to \`level_nodes\`\\n- Enqueue \`node.left\` if it exists\\n- Enqueue \`node.right\` if it exists"},
  {"title": "Store Level", "content": "Append \`level_nodes\` to the final result and repeat."}
]}
\`\`\`

\`\`\`playground
{"title": "Python Implementation", "language": "python", "code": "from collections import deque\\n\\nclass TreeNode:\\n    def __init__(self, val=0, left=None, right=None):\\n        self.val, self.left, self.right = val, left, right\\n\\ndef level_order(root):\\n    if not root:\\n        return []\\n    result = []\\n    queue = deque([root])\\n    while queue:\\n        level_size = len(queue)\\n        level = []\\n        for _ in range(level_size):\\n            node = queue.popleft()\\n            level.append(node.val)\\n            if node.left:\\n                queue.append(node.left)\\n            if node.right:\\n                queue.append(node.right)\\n        result.append(level)\\n    return result\\n\\n# ---- test ----\\nroot = TreeNode(1)\\nroot.left = TreeNode(2, TreeNode(4), TreeNode(5))\\nroot.right = TreeNode(3, None, TreeNode(6))\\nprint(level_order(root))  # [[1], [2, 3], [4, 5, 6]]", "runnable": true}
\`\`\`

### Complexity

- **Time:** O(n) — each node is enqueued and dequeued exactly once.  
- **Space:** O(w) where w is the maximum width of the tree. For a complete binary tree the last level holds ≈ n/2 nodes, so worst-case space is O(n).

\`\`\`quiz
{"title": "Check Your Understanding", "questions": [
  {"question": "Why is a queue the ideal data structure for level order traversal?", "options": ["It allows backtracking", "It processes nodes in FIFO order matching left-to-right level requirements", "It uses less memory than a stack", "It supports recursion"], "answer": 1, "explanation": "FIFO order ensures that nodes are dequeued in the same left-to-right sequence they were discovered at each depth."},
  {"question": "What is the maximum number of nodes the queue can hold for a perfect binary tree of height h?", "options": ["h", "2^h", "2^(h-1)", "2^h - 1"], "answer": 2, "explanation": "The last level contains 2^(h-1) nodes, which is the widest level and therefore the max queue size."},
  {"question": "How does level order traversal differ from pre-order DFS?", "options": ["Level order uses a stack; pre-order uses a queue", "Level order visits siblings before children; pre-order visits children before siblings", "They are identical except for naming", "Level order is recursive; pre-order is iterative"], "answer": 1, "explanation": "Level order (BFS) exhausts an entire depth before descending, whereas pre-order DFS goes deep along one branch before backtracking."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Level order traversal is BFS on a tree, naturally implemented with a queue.", "Time complexity is O(n) since every node is visited once.", "Space complexity is O(w) where w is the max tree width (≤ n).", "Recording queue length at the start of each level lets you group nodes correctly into sub-lists."]}
\`\`\``,
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

\`\`\`concept
{
  "title": "Reverse Level Order vs Standard Level Order",
  "variant": "mental-model",
  "content": "Standard level order: top-down, left-to-right → [[1], [2,3], [4,5,6]]\\nReverse level order: bottom-up, left-to-right → [[4,5,6], [2,3], [1]]\\n\\nKey insight: collect levels normally, then reverse the outer list once at the end. This keeps the O(n) time while only adding O(1) extra work."
}
\`\`\`

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

### Approach

- Perform a standard level-order traversal using a queue.
- Instead of appending each level to the end of the result, insert it at the **beginning** (or simply reverse the result at the end).
- Using a deque and \`appendleft\` is efficient for this.

\`\`\`steps
{
  "title": "Step-by-step Algorithm",
  "steps": [
    {
      "title": "1. Start BFS from root",
      "content": "Enqueue root node. Result list is empty."
    },
    {
      "title": "2. Process one full level",
      "content": "For each node at current level, dequeue, record value, enqueue its children."
    },
    {
      "title": "3. Prepend level to result",
      "content": "Instead of result.append(level), do result.appendleft(level) (or insert(0, level))."
    },
    {
      "title": "4. Repeat until queue empty",
      "content": "When queue is empty, every level has been processed in reverse order."
    }
  ]
}
\`\`\`

\`\`\`algoviz
{
  "title": "Reverse Level Order on Sample Tree",
  "type": "tree",
  "data": [1, 2, 3, 4, 5, null, 6],
  "frames": [
    { "highlight": [0], "label": "Queue: [1] → prepend [1] to result", "stats": { "level": 1 } },
    { "highlight": [1, 2], "label": "Queue: [2,3] → prepend [2,3] to result", "stats": { "level": 2 } },
    { "highlight": [3, 4, 5], "label": "Queue: [4,5,6] → prepend [4,5,6] to result", "stats": { "level": 3 } },
    { "highlight": [], "label": "Queue: [] → done", "stats": { "result": "[[4,5,6], [2,3], [1]]" } }
  ],
  "speed": 1000
}
\`\`\`

### Complexity

- **Time:** O(n) — every node is visited exactly once.
- **Space:** O(n) — the queue and the result list each store up to n items.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Standard Level Order",
    "code": "from collections import deque\\n\\ndef level_order(root):\\n    if not root:\\n        return []\\n    q, out = deque([root]), []\\n    while q:\\n        level = []\\n        for _ in range(len(q)):\\n            node = q.popleft()\\n            level.append(node.val)\\n            if node.left:  q.append(node.left)\\n            if node.right: q.append(node.right)\\n        out.append(level)\\n    return out"
  },
  "after": {
    "label": "Reverse Level Order",
    "code": "from collections import deque\\n\\ndef reverse_level_order(root):\\n    if not root:\\n        return []\\n    q, out = deque([root]), deque()\\n    while q:\\n        level = []\\n        for _ in range(len(q)):\\n            node = q.popleft()\\n            level.append(node.val)\\n            if node.left:  q.append(node.left)\\n            if node.right: q.append(node.right)\\n        out.appendleft(level)   # only change\\n    return list(out)"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "What is the primary extra cost of reversing level order vs standard level order?",
      "options": ["O(n) extra time", "O(n) extra space", "O(1) extra time", "O(log n) extra time"],
      "answer": 2,
      "explanation": "Reversing the final list or using appendleft adds only O(1) extra work; both traversals still visit each node once."
    },
    {
      "question": "If a tree has k levels, how many times is each node inserted into the result list?",
      "options": ["Once", "Twice", "k times", "height times"],
      "answer": 0,
      "explanation": "Each node’s value is collected exactly once, inside its level list; only the level lists are reordered."
    },
    {
      "question": "Which data structure best supports efficient ‘prepend’ of a whole level?",
      "options": ["Python list", "collections.deque", "set", "heap"],
      "answer": 1,
      "explanation": "deque’s appendleft is O(1) for individual items and accepts any iterable in one call, making it ideal for prepending a level."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Try It: Reverse Level Order",
  "language": "python",
  "code": "from collections import deque\\n\\nclass Node:\\n    def __init__(self, val, left=None, right=None):\\n        self.val = val\\n        self.left = left\\n        self.right = right\\n\\ndef reverse_level_order(root):\\n    # TODO: implement here\\n    pass\\n\\n# ---- test ----\\ntree = Node(1,\\n            Node(2, Node(4), Node(5)),\\n            Node(3, None, Node(6)))\\nprint(reverse_level_order(tree))  # expected: [[4,5,6], [2,3], [1]]",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Collect levels with standard BFS, then reverse the outer list or prepend each level for O(n) total time.",
    "deque.appendleft(level) is the cleanest Python idiom; converting to list at the end keeps the interface simple.",
    "Space remains O(n) for queue + result; no extra passes are needed beyond the single traversal."
  ]
}
\`\`\``,
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

\`\`\`concept
{"title": "What is Zigzag Traversal?", "variant": "mental-model", "content": "Zigzag traversal is a twist on standard level-order BFS. Instead of always reading left-to-right, we alternate the direction at each level: left-to-right, then right-to-left, then left-to-right again — like a snake weaving through the tree."}
\`\`\`

### Problem Statement

Given the root of a binary tree, return its **zigzag level order traversal**. The first level is traversed left-to-right, the second right-to-left, the third left-to-right, and so on.

\`\`\`algoviz
{"title": "Zigzag in Action", "type": "tree", "data": [1,2,3,4,5,6,7], "frames": [
  {"highlight": [0], "label": "Level 0: left→right → [1]", "stats": {"level": 0, "dir": "L→R"}},
  {"highlight": [1,2], "label": "Level 1: right←left → [3,2]", "stats": {"level": 1, "dir": "R←L"}},
  {"highlight": [3,4,5,6], "label": "Level 2: left→right → [4,5,6,7]", "stats": {"level": 2, "dir": "L→R"}}
], "speed": 1000}
\`\`\`

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

### Two Classic Implementations

\`\`\`tabs
{"tabs": [
  {"label": "Queue + Reverse", "icon": "🔄", "content": "**Idea**: collect nodes normally, then reverse every other level.\\n\\n\`\`\`python\\nfrom collections import deque\\n\\ndef zigzagQueue(root):\\n    if not root: return []\\n    q = deque([root])\\n    res, left_to_right = [], True\\n    while q:\\n        level = []\\n        for _ in range(len(q)):\\n            node = q.popleft()\\n            level.append(node.val)\\n            if node.left:  q.append(node.left)\\n            if node.right: q.append(node.right)\\n        if not left_to_right:\\n            level.reverse()\\n        res.append(level)\\n        left_to_right = not left_to_right\\n    return res\\n\`\`\`\\n\\n*Time*: O(n) — each node visited once.  \\n*Space*: O(w) where w is max width (worst-case O(n))."},
  {"label": "Deque (No Reverse)", "icon": "⚡", "content": "**Idea**: use \`deque\` and insert values at front or back based on direction.\\n\\n\`\`\`python\\nfrom collections import deque\\n\\ndef zigzagDeque(root):\\n    if not root: return []\\n    q = deque([root])\\n    res, left_to_right = [], True\\n    while q:\\n        level = deque()\\n        for _ in range(len(q)):\\n            node = q.popleft()\\n            if left_to_right:\\n                level.append(node.val)      # tail\\n            else:\\n                level.appendleft(node.val)  # head\\n            if node.left:  q.append(node.left)\\n            if node.right: q.append(node.right)\\n        res.append(list(level))\\n        left_to_right = not left_to_right\\n    return res\\n\`\`\`\\n\\n*Same complexity*, but avoids explicit \`reverse()\` call."}
]}
\`\`\`

\`\`\`callout
{"type": "tip", "title": "Direction Flag Trick", "content": "Use a simple boolean \`left_to_right\` that flips after every level.  Even indices (0, 2, 4…) are left→right; odd indices are right←left.  This keeps the code tiny and branch-free except for the insertion order."}
\`\`\`

### Complexity

- **Time:** O(n) — every node is processed exactly once.  
- **Space:** O(w) — at most the width of the widest level (≤ n).

\`\`\`quiz
{"title": "Zigzag Mastery Check", "questions": [
  {"question": "In the deque-based solution, why do we use \`appendleft\` on right-to-left levels?", "options": ["To keep children in left-to-right order", "To avoid reversing the list later", "To reduce memory usage", "To speed up child enqueue"], "answer": 1, "explanation": "\`appendleft\` inserts at the front, so the collected values naturally appear in right-to-left order without an extra reversal step."},
  {"question": "What is the worst-case space complexity for a complete binary tree?", "options": ["O(log n)", "O(n)", "O(n/2)", "O(1)"], "answer": 1, "explanation": "The last level of a complete tree holds ~n/2 nodes, so the queue stores O(n) elements in the worst case."},
  {"question": "Does zigzag traversal change the order in which children are enqueued?", "options": ["Yes, we enqueue right child first on odd levels", "No, children are always enqueued left then right", "Only when using stacks", "Only when using recursion"], "answer": 1, "explanation": "The tree is still traversed left-to-right; only the *output* order per level changes."}
]}
\`\`\`

\`\`\`playground
{"title": "Try It Yourself", "language": "python", "code": "from collections import deque\\n\\nclass Node:\\n    def __init__(self, val, left=None, right=None):\\n        self.val, self.left, self.right = val, left, right\\n\\ndef zigzag(root):\\n    # Your implementation here\\n    pass\\n\\n# ---- test case ----\\nroot = Node(1,\\n            Node(2, Node(4), Node(5)),\\n            Node(3, Node(6), Node(7)))\\nprint(zigzag(root))  # expected: [[1], [3,2], [4,5,6,7]]", "runnable": true}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Zigzag = BFS + alternating direction flag.", "Two mainstream implementations: queue+reverse (simpler) vs deque+insert (faster).", "Time O(n), space O(w) — same bounds as vanilla level-order traversal.", "Direction flag keeps code short; flip it after every level.", "Always enqueue children left-to-right; only the *collection* order changes."]}
\`\`\``,
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

\`\`\`concept
{
  "title": "Level Averages Intuition",
  "variant": "mental-model",
  "content": "Think of level averages like taking a 'snapshot' of each horizontal slice of the tree. BFS naturally processes nodes level by level, so we can compute statistics (sum, count) for each snapshot before moving to the next level. The queue ensures we process all nodes at depth d before any node at depth d+1."
}
\`\`\`

### Approach

The key insight is to use BFS with a **level-by-level** processing strategy. Instead of processing nodes one at a time, we process **entire levels** at once:

1. Use a queue to track nodes at the current level
2. For each level: sum all values, count nodes, compute average
3. Add children to queue for the next level

\`\`\`algoviz
{
  "title": "Level Averages Algorithm",
  "type": "tree",
  "data": [1, 2, 3, 4, 5, 6, 7],
  "frames": [
    {"highlight": [0], "label": "Level 0: Process node 1, sum=1, count=1, avg=1.0", "stats": {"level": 0, "sum": 1, "count": 1}},
    {"highlight": [1, 2], "label": "Level 1: Process nodes 2,3, sum=5, count=2, avg=2.5", "stats": {"level": 1, "sum": 5, "count": 2}},
    {"highlight": [3, 4, 5, 6], "label": "Level 2: Process nodes 4,5,6,7, sum=22, count=4, avg=5.5", "stats": {"level": 2, "sum": 22, "count": 4}}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`steps
{
  "title": "Algorithm Steps",
  "steps": [
    {
      "title": "Initialize",
      "content": "Create a queue with the root node, and an empty results list"
    },
    {
      "title": "Process Each Level",
      "content": "While queue is not empty:\\n- Get the number of nodes at current level (queue size)\\n- Initialize level_sum = 0\\n- Process all nodes at this level"
    },
    {
      "title": "Compute Average",
      "content": "For each node at current level:\\n- Add its value to level_sum\\n- Add its children to queue for next level\\n- Calculate average = level_sum / node_count\\n- Add to results"
    }
  ]
}
\`\`\`

### Implementation

\`\`\`playground
{
  "title": "Level Averages Solution",
  "language": "python",
  "code": "from collections import deque\\nfrom typing import List, Optional\\n\\nclass TreeNode:\\n    def __init__(self, val=0, left=None, right=None):\\n        self.val = val\\n        self.left = left\\n        self.right = right\\n\\ndef find_level_averages(root: Optional[TreeNode]) -> List[float]:\\n    if not root:\\n        return []\\n    \\n    result = []\\n    queue = deque([root])\\n    \\n    while queue:\\n        level_size = len(queue)\\n        level_sum = 0\\n        \\n        for _ in range(level_size):\\n            node = queue.popleft()\\n            level_sum += node.val\\n            \\n            if node.left:\\n                queue.append(node.left)\\n            if node.right:\\n                queue.append(node.right)\\n        \\n        result.append(level_sum / level_size)\\n    \\n    return result\\n\\n# Test the solution\\nroot = TreeNode(1)\\nroot.left = TreeNode(2)\\nroot.right = TreeNode(3)\\nroot.left.left = TreeNode(4)\\nroot.left.right = TreeNode(5)\\nroot.right.left = TreeNode(6)\\nroot.right.right = TreeNode(7)\\n\\nprint(find_level_averages(root))  # Output: [1.0, 2.5, 5.5]",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Level Averages Quiz",
  "questions": [
    {
      "question": "What is the time complexity of finding level averages?",
      "options": ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      "answer": 0,
      "explanation": "Each node is visited exactly once, giving O(n) time complexity."
    },
    {
      "question": "Why do we need to track level_size before processing a level?",
      "options": ["To know when to stop", "To process nodes level-by-level", "To calculate the average", "To avoid infinite loops"],
      "answer": 1,
      "explanation": "level_size tells us how many nodes are at the current level, ensuring we process them together before moving to the next level."
    },
    {
      "question": "What is the space complexity in the worst case?",
      "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      "answer": 2,
      "explanation": "In the worst case (completely unbalanced tree), the queue could hold O(n) nodes at the last level."
    }
  ]
}
\`\`\`

### Complexity Analysis

- **Time:** O(n) - Each node is visited exactly once
- **Space:** O(n) - Queue can hold up to n/2 nodes at the last level in a complete binary tree

\`\`\`callout
{
  "type": "tip",
  "title": "Optimization Tip",
  "content": "Instead of summing all values then dividing, you can maintain a running average using the formula: new_avg = (old_avg * (count-1) + new_value) / count. This avoids potential integer overflow for large sums."
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Level averages require processing nodes level-by-level, making BFS the natural choice",
    "Track level_size before processing to ensure you handle all nodes at the current level together",
    "Time complexity is O(n) as each node is visited once, space is O(n) for the queue",
    "This pattern extends to other level-based statistics like maximums, minimums, or sums"
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "What is a Leaf Node?",
  "variant": "rule",
  "content": "A leaf node has NO children — both left and right pointers are null. A node with only one child is NOT a leaf, even if it looks like an \\"endpoint\\" on paper."
}
\`\`\`

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

### Why BFS is Perfect Here

\`\`\`concept
{
  "title": "BFS vs DFS for Minimum Depth",
  "variant": "insight",
  "content": "BFS explores level-by-level, so the **first leaf we pop** is guaranteed to be at the minimum depth. DFS might dive down a long branch first and waste work."
}
\`\`\`

### Step-by-Step BFS Algorithm

\`\`\`steps
{
  "title": "BFS Recipe",
  "steps": [
    {
      "title": "1. Start at the root",
      "content": "If root is null → depth 0. Otherwise enqueue (root, depth=1)."
    },
    {
      "title": "2. Dequeue front",
      "content": "Check if current node is a leaf (both children null). If yes, return its depth immediately."
    },
    {
      "title": "3. Enqueue children",
      "content": "If left exists → enqueue (left, depth+1). Same for right."
    },
    {
      "title": "4. Repeat",
      "content": "Keep dequeuing until queue is empty. First leaf wins."
    }
  ]
}
\`\`\`

### Live Execution on Example 1

\`\`\`algoviz
{
  "title": "BFS on Tree 1 → 2,3 → 4,5",
  "type": "tree",
  "data": [1, 2, 3, 4, 5],
  "frames": [
    { "highlight": [0], "label": "enqueue (1,1)", "stats": {"queue":"[(1,1)]"} },
    { "highlight": [0], "label": "dequeue (1,1) – not a leaf", "stats": {"queue":"[(2,2),(3,2)]"} },
    { "highlight": [2], "label": "dequeue (3,2) – LEAF FOUND", "stats": {"queue":"[(2,2)]"} }
  ],
  "speed": 1000
}
\`\`\`

### Python Implementation

\`\`\`playground
{
  "title": "Minimum Depth – BFS",
  "language": "python",
  "code": "from collections import deque\\n\\ndef min_depth(root):\\n    if not root:\\n        return 0\\n    q = deque([(root, 1)])\\n    while q:\\n        node, depth = q.popleft()\\n        # Leaf check\\n        if not node.left and not node.right:\\n            return depth\\n        if node.left:\\n            q.append((node.left, depth + 1))\\n        if node.right:\\n            q.append((node.right, depth + 1))\\n\\n# ---- Driver ----\\nclass Node:\\n    def __init__(self, val, left=None, right=None):\\n        self.val, self.left, self.right = val, left, right\\n\\nroot = Node(1, Node(2, Node(4), Node(5)), Node(3))\\nprint(min_depth(root))  # expected 2",
  "runnable": true
}
\`\`\`

### Complexity

- **Time:** O(n) worst-case (every node might be visited).  
- **Space:** O(w) where w is the maximum width of the tree; for a complete tree w ≈ n/2 → O(n).

\`\`\`callout
{
  "type": "tip",
  "title": "Early Exit Wins",
  "content": "Because we return as soon as the first leaf is met, the **average** running time is often much less than O(n), especially on wide, shallow trees."
}
\`\`\`

### Quick Check

\`\`\`quiz
{
  "title": "Spot the Minimum Depth",
  "questions": [
    {
      "question": "Tree: 5 → 3 → 1 (straight line). Minimum depth?",
      "options": ["1", "2", "3"],
      "answer": 2,
      "explanation": "Leaf is 1 at depth 3, but the root itself is depth 1 and has only one child, so the path must continue. Correct depth is 3."
    },
    {
      "question": "In BFS, when do we first know the minimum depth?",
      "options": ["When queue is empty", "When we enqueue the first leaf", "When we dequeue the first leaf", "After visiting all nodes"],
      "answer": 2,
      "explanation": "The instant we dequeue a node with no children, we have the shortest path."
    },
    {
      "question": "Space complexity of BFS on a complete binary tree with n nodes?",
      "options": ["O(log n)", "O(n)", "O(1)", "O(h)"],
      "answer": 1,
      "explanation": "Bottom level holds n/2 nodes → O(n) queue size."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use BFS for shortest-path-to-leaf problems; first leaf dequeued gives the answer.",
    "Always check both children are null before declaring a leaf.",
    "Time O(n), space O(w) — early exit often beats DFS in practice."
  ]
}
\`\`\``,
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
