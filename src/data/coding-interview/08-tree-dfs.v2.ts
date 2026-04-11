import { Module } from "../types";

export const treeDFSModule: Module = {
  id: "tree-dfs",
  title: "Tree Depth First Search",
  description: "Explore recursive and iterative DFS techniques for solving path-based tree problems.",
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

\`\`\`concept
{
  "title": "DFS Mental Model: The Explorer",
  "variant": "mental-model",
  "content": "Imagine DFS as an explorer with a rope who always chooses the leftmost unexplored path. They tie the rope at each junction (recursive call) and only return when they hit a dead end (null node). The order in which they 'tag' each tree node determines the traversal type: pre-order tags before descending, in-order tags between left and right, and post-order tags after both children are explored."
}
\`\`\`

\`\`\`algoviz
{
  "title": "DFS Traversal Orders on a Sample Tree",
  "type": "tree",
  "data": [
    {"id": 1, "value": 1, "left": 2, "right": 3},
    {"id": 2, "value": 2, "left": 4, "right": 5},
    {"id": 3, "value": 3, "left": 6, "right": 7},
    {"id": 4, "value": 4, "left": null, "right": null},
    {"id": 5, "value": 5, "left": null, "right": null},
    {"id": 6, "value": 6, "left": null, "right": null},
    {"id": 7, "value": 7, "left": null, "right": null}
  ],
  "frames": [
    {"highlight": [1], "label": "Pre-order: visit root first", "stats": {"order": "pre", "output": "1"}},
    {"highlight": [2], "label": "Pre-order: root done, go left", "stats": {"order": "pre", "output": "1,2"}},
    {"highlight": [4], "label": "Pre-order: left child first", "stats": {"order": "pre", "output": "1,2,4"}},
    {"highlight": [4], "label": "Backtrack to 2", "stats": {"order": "pre", "output": "1,2,4"}},
    {"highlight": [5], "label": "Pre-order: right child next", "stats": {"order": "pre", "output": "1,2,4,5"}},
    {"highlight": [3], "label": "Backtrack to 1, go right", "stats": {"order": "pre", "output": "1,2,4,5,3"}},
    {"highlight": [6], "label": "Pre-order: left child of 3", "stats": {"order": "pre", "output": "1,2,4,5,3,6"}},
    {"highlight": [7], "label": "Pre-order: right child of 3", "stats": {"order": "pre", "output": "1,2,4,5,3,6,7"}}
  ],
  "speed": 1000
}
\`\`\`

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

\`\`\`trace
{
  "title": "Tracing Pre-order DFS",
  "language": "python",
  "code": "def preorder(node):\\n    if not node:\\n        return []\\n    out = [node.val]          # visit root\\n    out += preorder(node.left)   # go left\\n    out += preorder(node.right)  # go right\\n    return out\\n\\n# build tree:    1\\n#               / \\\\\\n#              2   3\\nroot = TreeNode(1)\\nroot.left = TreeNode(2)\\nroot.right = TreeNode(3)\\nprint(preorder(root))",
  "frames": [
    {"line": 1, "vars": {"node": "TreeNode(1)"}, "note": "Enter preorder(1)", "stdout": ""},
    {"line": 2, "vars": {"node": "TreeNode(1)"}, "note": "Node not None", "stdout": ""},
    {"line": 4, "vars": {"node": "TreeNode(1)", "out": "[1]"}, "note": "Add 1 to output", "stdout": ""},
    {"line": 5, "vars": {"node": "TreeNode(2)"}, "note": "Recurse left to 2", "stdout": ""},
    {"line": 4, "vars": {"node": "TreeNode(2)", "out": "[2]"}, "note": "Add 2 to output", "stdout": ""},
    {"line": 5, "vars": {"node": "None"}, "note": "Left of 2 is None", "stdout": ""},
    {"line": 6, "vars": {"node": "None"}, "note": "Right of 2 is None", "stdout": ""},
    {"line": 7, "vars": {"node": "TreeNode(2)", "out": "[2]"}, "note": "Return from 2", "stdout": ""},
    {"line": 6, "vars": {"node": "TreeNode(3)"}, "note": "Recurse right to 3", "stdout": ""},
    {"line": 4, "vars": {"node": "TreeNode(3)", "out": "[3]"}, "note": "Add 3 to output", "stdout": ""},
    {"line": 7, "vars": {"node": "TreeNode(1)", "out": "[1,2,3]"}, "note": "Return final list", "stdout": "[1, 2, 3]"}
  ],
  "speed": 800
}
\`\`\`

### When to Use Tree DFS

- **Path problems:** Find if a path exists with a certain sum, collect all paths, etc.
- **Subtree problems:** Check properties of subtrees.
- **Sequence matching:** Verify if a root-to-leaf path matches a given sequence.

\`\`\`quiz
{
  "title": "Quick Check: DFS Orders",
  "questions": [
    {
      "question": "Which traversal order would you use to delete a binary tree safely (children before parent)?",
      "options": ["Pre-order", "In-order", "Post-order"],
      "answer": 2,
      "explanation": "Post-order ensures you delete children before their parent, preventing dangling references."
    },
    {
      "question": "For a BST, which order produces values in ascending sorted sequence?",
      "options": ["Pre-order", "In-order", "Post-order"],
      "answer": 1,
      "explanation": "In-order visits left subtree, then root, then right subtree—exactly the sorted order for a BST."
    },
    {
      "question": "If the recursion depth exceeds Python’s limit, which tweak keeps the same traversal order?",
      "options": ["Switch to BFS", "Use an explicit stack (iterative DFS)", "Shuffle child order"],
      "answer": 1,
      "explanation": "An explicit stack mimics the call stack and avoids recursion-depth limits while preserving DFS order."
    }
  ]
}
\`\`\`

### Recursive vs Iterative

Most DFS tree problems are naturally expressed recursively. Each recursive call represents going one level deeper. The call stack acts as an implicit stack. For iterative DFS, use an explicit stack.

### Complexity

- **Time:** O(n) — visit every node once.
- **Space:** O(h) — where h is the tree height (recursion depth). For a balanced tree h = log n, for a skewed tree h = n.

\`\`\`callout
{
  "type": "warning",
  "title": "Watch the Stack!",
  "content": "On skewed trees (like a linked list), recursive DFS can hit recursion-depth limits. In production systems or languages with shallow stacks, prefer an iterative version for very deep trees."
}
\`\`\`

### Tree Representation

We use the same \`TreeNode\` class and \`build_tree\` helper as in BFS problems, building from a level-order array.

\`\`\`playground
{
  "title": "Build & Traverse a Tree",
  "language": "python",
  "code": "class TreeNode:\\n    def __init__(self, val=0, left=None, right=None):\\n        self.val, self.left, self.right = val, left, right\\n\\ndef build_tree(arr, i=0):\\n    if i >= len(arr) or arr[i] is None:\\n        return None\\n    root = TreeNode(arr[i])\\n    root.left = build_tree(arr, 2*i+1)\\n    root.right = build_tree(arr, 2*i+2)\\n    return root\\n\\ndef preorder(node):\\n    return [node.val] + preorder(node.left) + preorder(node.right) if node else []\\n\\ntree = build_tree([1,2,3,4,5,6,7])\\nprint(\\"Pre-order:\\", preorder(tree))",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "DFS dives deep before backtracking; order of 'processing' the node yields pre-, in-, or post-order.",
    "Recursive DFS is elegant and mirrors tree structure; iterative DFS uses an explicit stack to avoid recursion limits.",
    "Time is always O(n); space is O(h) where h ranges from log n (balanced) to n (skewed).",
    "Choose traversal order to match the problem: pre for copying, in for BST sorting, post for cleanup."
  ]
}
\`\`\``,
    },
    {
      id: "tree-dfs-path-sum",
      slug: "path-sum",
      title: "Binary Tree Path Sum",
      content: `## Binary Tree Path Sum

### Problem Statement

Given the root of a binary tree and a target sum, determine if the tree has a **root-to-leaf path** such that adding up all the values along the path equals the target sum.

A **leaf** is a node with no children.

\`\`\`concept
{
  "title": "Root-to-Leaf Path Sum",
  "variant": "mental-model",
  "content": "Think of each path as a running total. As you traverse from root to leaf, subtract the current node's value from the remaining target. When you hit a leaf, check if the remaining target matches the leaf's value — if yes, you've found a valid path!"
}
\`\`\`

### Examples

\`\`\`
Input:  target = 10
            1
           / \\
          2   3
         / \\   \\
        4   5   6
Output: True
Explanation: Path 1 -> 3 -> 6 = 10
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

### DFS Approach

The key insight is to use **Depth-First Search** to explore every root-to-leaf path. At each node, we subtract its value from the remaining target sum, then recursively check if either subtree can complete the path.

\`\`\`steps
{
  "title": "Recursive DFS Algorithm",
  "steps": [
    {
      "title": "Base Case: Leaf Check",
      "content": "If current node is a leaf (no children), check if its value equals the remaining target sum. If yes, return True."
    },
    {
      "title": "Recursive Case: Explore Subtrees",
      "content": "Subtract current node's value from target. Recursively check left and right subtrees with the new target. Return True if either subtree finds a valid path."
    },
    {
      "title": "Edge Case: Empty Tree",
      "content": "If the tree is empty (root is None), return False since no paths exist."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Path Sum Implementation",
  "language": "python",
  "code": "class TreeNode:\\n    def __init__(self, val=0, left=None, right=None):\\n        self.val = val\\n        self.left = left\\n        self.right = right\\n\\ndef has_path_sum(root, target_sum):\\n    if not root:\\n        return False\\n    \\n    # Check if we're at a leaf node\\n    if not root.left and not root.right:\\n        return root.val == target_sum\\n    \\n    # Recursively check left and right subtrees\\n    remaining_sum = target_sum - root.val\\n    return (has_path_sum(root.left, remaining_sum) or \\n            has_path_sum(root.right, remaining_sum))\\n\\n# Test the implementation\\nroot = TreeNode(1)\\nroot.left = TreeNode(2)\\nroot.right = TreeNode(3)\\nroot.left.left = TreeNode(4)\\nroot.left.right = TreeNode(5)\\nroot.right.right = TreeNode(6)\\n\\nprint(has_path_sum(root, 10))  # True: 1->3->6",
  "runnable": true
}
\`\`\`

### Algorithm Visualization

Let's trace through the first example where target = 10:

\`\`\`algoviz
{
  "title": "DFS Traversal for Target 10",
  "type": "tree",
  "data": [
    {"id": "1", "value": 1, "left": "2", "right": "3"},
    {"id": "2", "value": 2, "left": "4", "right": "5"},
    {"id": "3", "value": 3, "left": null, "right": "6"},
    {"id": "4", "value": 4, "left": null, "right": null},
    {"id": "5", "value": 5, "left": null, "right": null},
    {"id": "6", "value": 6, "left": null, "right": null}
  ],
  "frames": [
    {"highlight": ["1"], "label": "Start at root: remaining = 10 - 1 = 9", "stats": {"remaining": 9}},
    {"highlight": ["2"], "label": "Go left: remaining = 9 - 2 = 7", "stats": {"remaining": 7}},
    {"highlight": ["4"], "label": "Go left to leaf: 4 != 7, backtrack", "stats": {"remaining": 7}},
    {"highlight": ["5"], "label": "Go right to leaf: 5 != 7, backtrack", "stats": {"remaining": 7}},
    {"highlight": ["3"], "label": "Go right from root: remaining = 9 - 3 = 6", "stats": {"remaining": 6}},
    {"highlight": ["6"], "label": "Go right to leaf: 6 == 6, FOUND!", "stats": {"remaining": 6}}
  ],
  "speed": 1000
}
\`\`\`

### Complexity Analysis

\`\`\`concept
{
  "title": "Time & Space Complexity",
  "variant": "insight",
  "content": "Time: O(n) - we visit each node at most once. Space: O(h) - recursion stack depth equals tree height. For balanced trees h = log(n), but for skewed trees h = n."
}
\`\`\`

### Common Pitfalls

\`\`\`callout
{
  "type": "warning",
  "title": "Watch for These Mistakes",
  "content": "1. Forgetting to check if a node is a leaf before comparing values\\n2. Not handling the empty tree case (root = None)\\n3. Using addition instead of subtraction (subtracting is cleaner)\\n4. Returning too early - need to check both left and right subtrees"
}
\`\`\`

### Practice Quiz

\`\`\`quiz
{
  "title": "Test Your Understanding",
  "questions": [
    {
      "question": "In the recursive solution, what should be the base case?",
      "options": ["When target sum reaches 0", "When we reach a leaf node", "When we reach any node", "When the tree is empty"],
      "answer": 1,
      "explanation": "The base case occurs when we reach a leaf node (no children). We then check if the leaf's value equals the remaining target sum."
    },
    {
      "question": "What's the time complexity of the DFS approach?",
      "options": ["O(log n)", "O(n log n)", "O(n)", "O(n²)"],
      "answer": 2,
      "explanation": "We visit each node at most once, giving us O(n) time complexity where n is the number of nodes."
    },
    {
      "question": "For a completely unbalanced tree (like a linked list), what's the space complexity?",
      "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      "answer": 2,
      "explanation": "In the worst case, the recursion stack can go as deep as the height of the tree, which is O(n) for a completely unbalanced tree."
    }
  ]
}
\`\`\`

### Key Takeaways

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "DFS is the natural choice for exploring all root-to-leaf paths",
    "Subtract node values from target as you traverse down the tree",
    "Only check for equality at leaf nodes, not at every node",
    "Time complexity is O(n) and space complexity is O(h) where h is tree height"
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

\`\`\`concept
{
  "title": "Root-to-Leaf Path",
  "variant": "rule",
  "content": "A root-to-leaf path starts at the root node and follows edges down to a leaf node (a node with no children). We must collect every such path whose node values sum to the target."
}
\`\`\`

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

### DFS with Backtracking

We traverse the tree depth-first while maintaining a **current path** and a **remaining target**. At each node:

1. Append the node's value to the path and subtract it from the remaining target.
2. If we reach a **leaf** and the remaining target is zero, store a **copy** of the current path.
3. Recurse on both children.
4. **Backtrack**: remove the node's value from the path before returning to the caller.

\`\`\`trace
{
  "title": "DFS Backtracking on target = 23",
  "language": "python",
  "code": "def all_paths(root, target):\\n    res = []\\n    def dfs(node, rem, path):\\n        if not node:\\n            return\\n        path.append(node.val)\\n        rem -= node.val\\n        if not node.left and not node.right and rem == 0:\\n            res.append(path.copy())\\n        dfs(node.left, rem, path)\\n        dfs(node.right, rem, path)\\n        path.pop()  # backtrack\\n    dfs(root, target, [])\\n    return res",
  "frames": [
    { "line": 1, "vars": {"root": "12", "target": 23}, "note": "start", "stdout": "" },
    { "line": 5, "vars": {"node": "12", "rem": 23, "path": []}, "note": "visit 12", "stdout": "" },
    { "line": 6, "vars": {"path": "[12]", "rem": 11}, "note": "add 12", "stdout": "" },
    { "line": 8, "vars": {}, "note": "not leaf", "stdout": "" },
    { "line": 10, "vars": {"node": "7", "rem": 11, "path": "[12]"}, "note": "go left", "stdout": "" },
    { "line": 6, "vars": {"path": "[12,7]", "rem": 4}, "note": "add 7", "stdout": "" },
    { "line": 10, "vars": {"node": "4", "rem": 4, "path": "[12,7]"}, "note": "go left", "stdout": "" },
    { "line": 6, "vars": {"path": "[12,7,4]", "rem": 0}, "note": "add 4", "stdout": "" },
    { "line": 9, "vars": {}, "note": "leaf & rem==0 → save", "stdout": "" },
    { "line": 13, "vars": {"path": "[12,7]"}, "note": "backtrack 4", "stdout": "" }
  ],
  "speed": 800
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Copy the Path, Not the Reference",
  "content": "Always append \`path.copy()\` to the result list. If you append \`path\` directly, later backtracking will mutate the saved reference and give wrong answers."
}
\`\`\`

### Complexity Analysis

- **Time:** O(N · H) where N is the number of nodes and H is the tree height. We visit each node once, but each time we find a valid path we spend O(H) to copy it.
- **Space:** O(H) for the recursion stack plus O(N · H) to store all output paths. In the worst case (skewed tree) H = N.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Forgot to backtrack",
    "code": "def dfs(node, rem, path):\\n    if not node:\\n        return\\n    path.append(node.val)\\n    rem -= node.val\\n    if not node.left and not node.right and rem == 0:\\n        res.append(path.copy())\\n    dfs(node.left, rem, path)\\n    dfs(node.right, rem, path)\\n    # missing path.pop() → path keeps growing"
  },
  "after": {
    "label": "Correct backtracking",
    "code": "def dfs(node, rem, path):\\n    if not node:\\n        return\\n    path.append(node.val)\\n    rem -= node.val\\n    if not node.left and not node.right and rem == 0:\\n        res.append(path.copy())\\n    dfs(node.left, rem, path)\\n    dfs(node.right, rem, path)\\n    path.pop()  # restore state"
  }
}
\`\`\`

### Try It

\`\`\`playground
{
  "title": "Implement all_paths",
  "language": "python",
  "code": "class Node:\\n    def __init__(self, val, left=None, right=None):\\n        self.val = val\\n        self.left = left\\n        self.right = right\\n\\ndef all_paths(root, target):\\n    # TODO: return list of paths\\n    pass\\n\\n# ---- test ----\\ntree = Node(12, Node(7, Node(4)), Node(1, Node(10), Node(5)))\\nprint(all_paths(tree, 23))  # expect [[12,7,4], [12,1,10]]",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "When do we save a path to the result list?",
      "options": [
        "Whenever we reach a node whose value equals the remaining target",
        "Only when we reach a leaf and the remaining target is zero",
        "Only when we reach a leaf",
        "At every node"
      ],
      "answer": 1,
      "explanation": "We must satisfy two conditions: the node is a leaf (no children) AND the remaining target after subtracting the leaf's value is zero."
    },
    {
      "question": "Why is \`path.pop()\` necessary?",
      "options": [
        "To free memory",
        "To restore the path to its state before the current recursive call",
        "To avoid infinite recursion",
        "To copy the path"
      ],
      "answer": 1,
      "explanation": "After exploring both subtrees we must undo the append so the parent caller sees the correct path for its own continuation."
    },
    {
      "question": "What is the worst-case space complexity of the algorithm?",
      "options": ["O(H)", "O(N)", "O(N·H)", "O(N²)"],
      "answer": 2,
      "explanation": "We store O(H) frames on the call stack plus up to O(N) paths each of length O(H), giving O(N·H) total space."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use DFS with backtracking to explore every root-to-leaf path.",
    "Maintain a mutable path list and a remaining target sum.",
    "Save a copy of the path only at valid leaves.",
    "Backtrack by popping the current node before returning to the parent."
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

Given a binary tree where each node contains a single digit (0-9), each root-to-leaf path represents a number. For example, the path 1 → 2 → 3 represents the number 123. Find the **total sum** of all root-to-leaf path numbers.

\`\`\`concept
{
  "title": "Path Number Formation",
  "variant": "mental-model",
  "content": "Think of each path as building a number digit-by-digit. As you traverse from root to leaf, you shift the existing number left by one decimal place (multiply by 10) and add the current node's digit. This is exactly how you'd build a number reading digits left-to-right."
}
\`\`\`

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

### DFS Approach

The key insight is to use **Depth-First Search** to explore each root-to-leaf path while maintaining the current number formed by the path.

\`\`\`steps
{
  "title": "Recursive DFS Strategy",
  "steps": [
    {
      "title": "Start at root with current number = 0",
      "content": "Begin traversal at the root node. Initialize current path number as 0."
    },
    {
      "title": "Update current number",
      "content": "At each node, update current number: \`current = current * 10 + node.val\`"
    },
    {
      "title": "Check for leaf node",
      "content": "If current node is a leaf (no left or right children), add current number to total sum."
    },
    {
      "title": "Recurse on children",
      "content": "If not a leaf, recursively process left and right subtrees with the updated current number."
    }
  ]
}
\`\`\`

\`\`\`algoviz
{
  "title": "DFS Traversal on Example Tree",
  "type": "tree",
  "data": [1, 7, 9, null, null, 2, 9],
  "frames": [
    {"highlight": [0], "label": "Start at root (1), current = 0*10+1 = 1", "stats": {"current": 1}},
    {"highlight": [1], "label": "Move to node 7, current = 1*10+7 = 17", "stats": {"current": 17}},
    {"highlight": [1], "label": "Leaf node 17 reached, add 17 to sum", "stats": {"sum": 17}},
    {"highlight": [2], "label": "Backtrack to node 9, current = 1*10+9 = 19", "stats": {"current": 19}},
    {"highlight": [5], "label": "Move to node 2, current = 19*10+2 = 192", "stats": {"current": 192}},
    {"highlight": [5], "label": "Leaf node 192 reached, add 192 to sum", "stats": {"sum": 209}},
    {"highlight": [6], "label": "Move to node 9, current = 19*10+9 = 199", "stats": {"current": 199}},
    {"highlight": [6], "label": "Leaf node 199 reached, add 199 to sum", "stats": {"sum": 408}}
  ],
  "speed": 1000
}
\`\`\`

### Implementation

\`\`\`playground
{
  "title": "Recursive DFS Solution",
  "language": "python",
  "code": "class TreeNode:\\n    def __init__(self, val=0, left=None, right=None):\\n        self.val = val\\n        self.left = left\\n        self.right = right\\n\\ndef sumPathNumbers(root):\\n    def dfs(node, current_num):\\n        if not node:\\n            return 0\\n        \\n        # Update current number\\n        current_num = current_num * 10 + node.val\\n        \\n        # Check if leaf node\\n        if not node.left and not node.right:\\n            return current_num\\n        \\n        # Recurse on left and right subtrees\\n        left_sum = dfs(node.left, current_num)\\n        right_sum = dfs(node.right, current_num)\\n        \\n        return left_sum + right_sum\\n    \\n    return dfs(root, 0)\\n\\n# Test with first example\\nroot = TreeNode(1)\\nroot.left = TreeNode(7)\\nroot.right = TreeNode(9)\\nroot.right.left = TreeNode(2)\\nroot.right.right = TreeNode(9)\\n\\nprint(f\\"Sum of path numbers: {sumPathNumbers(root)}\\")  # Output: 408",
  "runnable": true
}
\`\`\`

### Complexity Analysis

\`\`\`callout
{
  "type": "info",
  "title": "Complexity Summary",
  "content": "**Time Complexity:** O(n) where n is the number of nodes — we visit each node exactly once.\\n\\n**Space Complexity:** O(h) where h is the height of the tree — this represents the maximum recursion depth (call stack usage)."
}
\`\`\`

### Iterative DFS Alternative

For extremely deep trees, an iterative approach using an explicit stack can prevent stack overflow:

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Recursive DFS",
    "code": "def dfs(node, current_num):\\n    if not node:\\n        return 0\\n    current_num = current_num * 10 + node.val\\n    if not node.left and not node.right:\\n        return current_num\\n    return dfs(node.left, current_num) + dfs(node.right, current_num)"
  },
  "after": {
    "label": "Iterative DFS",
    "code": "def sumPathNumbers(root):\\n    if not root:\\n        return 0\\n    \\n    stack = [(root, root.val)]\\n    total = 0\\n    \\n    while stack:\\n        node, current_num = stack.pop()\\n        \\n        if not node.left and not node.right:\\n            total += current_num\\n        \\n        if node.right:\\n            stack.append((node.right, current_num * 10 + node.right.val))\\n        if node.left:\\n            stack.append((node.left, current_num * 10 + node.left.val))\\n    \\n    return total"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Path Sum Concepts",
  "questions": [
    {
      "question": "Why do we multiply the current number by 10 at each node?",
      "options": ["To handle negative numbers", "To shift digits left for concatenation", "To prevent overflow", "To convert to string"],
      "answer": 1,
      "explanation": "Multiplying by 10 shifts the existing digits left by one decimal place, making room for the new digit to be added (concatenated) at the end."
    },
    {
      "question": "When do we add a number to the total sum?",
      "options": ["At every node", "Only at leaf nodes", "Only at root node", "At nodes with two children"],
      "answer": 1,
      "explanation": "We only add to the total when we reach a leaf node (node with no children), as this represents a complete root-to-leaf path."
    },
    {
      "question": "What's the space complexity advantage of iterative DFS over recursive DFS?",
      "options": ["Better time complexity", "Uses heap instead of call stack", "Requires less memory per node", "No advantage"],
      "answer": 1,
      "explanation": "Iterative DFS uses an explicit stack on the heap, which typically has more available space than the program's call stack, reducing stack overflow risk for deep trees."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use DFS to explore all root-to-leaf paths naturally",
    "Build path numbers by multiplying current value by 10 and adding node's digit",
    "Only add to total when reaching leaf nodes",
    "Both recursive and iterative DFS have O(n) time and O(h) space complexity",
    "Iterative DFS can prevent stack overflow in very deep trees"
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

\`\`\`concept
{
  "title": "What Makes a Valid Root-to-Leaf Path?",
  "variant": "mental-model",
  "content": "A valid root-to-leaf path must:\\n1. Start at the root node\\n2. End at a leaf node (no children)\\n3. Match the sequence exactly, step by step\\n4. Have no leftover sequence elements when reaching the leaf\\n\\nThink of it like navigating a maze with a specific set of directions — you must follow them perfectly from entrance to exit."
}
\`\`\`

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

### DFS Approach

The key insight is to use DFS while tracking our position in the sequence. At each step, we verify the current node's value matches the expected sequence element.

\`\`\`steps
{
  "title": "DFS Algorithm Steps",
  "steps": [
    {
      "title": "Start at root with index 0",
      "content": "Begin DFS at the root node, with sequence index = 0"
    },
    {
      "title": "Check value match",
      "content": "If current node value ≠ sequence[index], return False"
    },
    {
      "title": "Check completion",
      "content": "If at a leaf AND index is last element, return True"
    },
    {
      "title": "Check premature end",
      "content": "If at a leaf BUT index < last element, return False"
    },
    {
      "title": "Recurse on children",
      "content": "Recursively check left and right subtrees with index + 1"
    }
  ]
}
\`\`\`

\`\`\`trace
{
  "title": "Tracing sequence [1, 9, 9]",
  "language": "python",
  "code": "def has_path(root, sequence, index=0):\\n    if not root:\\n        return False\\n    \\n    # Check if current node matches sequence\\n    if index >= len(sequence) or root.val != sequence[index]:\\n        return False\\n    \\n    # Check if we're at a leaf and at the end of sequence\\n    if not root.left and not root.right:\\n        return index == len(sequence) - 1\\n    \\n    # Recurse on children\\n    return (has_path(root.left, sequence, index + 1) or \\n            has_path(root.right, sequence, index + 1))",
  "frames": [
    {
      "line": 1,
      "vars": {"root.val": 1, "sequence": "[1, 9, 9]", "index": 0},
      "note": "Start at root, matches sequence[0]",
      "stdout": ""
    },
    {
      "line": 10,
      "vars": {"root.val": 1, "sequence": "[1, 9, 9]", "index": 0},
      "note": "Not a leaf, continue to children",
      "stdout": ""
    },
    {
      "line": 13,
      "vars": {"root.val": 9, "sequence": "[1, 9, 9]", "index": 1},
      "note": "Right child matches sequence[1]",
      "stdout": ""
    },
    {
      "line": 13,
      "vars": {"root.val": 9, "sequence": "[1, 9, 9]", "index": 2},
      "note": "Right child matches sequence[2]",
      "stdout": ""
    },
    {
      "line": 10,
      "vars": {"root.val": 9, "sequence": "[1, 9, 9]", "index": 2},
      "note": "Leaf node reached at sequence end - SUCCESS!",
      "stdout": "True"
    }
  ],
  "speed": 1000
}
\`\`\`

### Implementation

\`\`\`playground
{
  "title": "Path With Given Sequence",
  "language": "python",
  "code": "class TreeNode:\\n    def __init__(self, val=0, left=None, right=None):\\n        self.val = val\\n        self.left = left\\n        self.right = right\\n\\ndef has_path(root, sequence):\\n    \\"\\"\\"\\n    Check if tree contains a root-to-leaf path matching the sequence.\\n    \\"\\"\\"\\n    if not root:\\n        return False\\n    \\n    def dfs(node, index):\\n        # Base case: empty node\\n        if not node:\\n            return False\\n        \\n        # Check if current node matches sequence at index\\n        if index >= len(sequence) or node.val != sequence[index]:\\n            return False\\n        \\n        # Check if we're at a leaf node\\n        if not node.left and not node.right:\\n            return index == len(sequence) - 1\\n        \\n        # Recursively check left and right subtrees\\n        return dfs(node.left, index + 1) or dfs(node.right, index + 1)\\n    \\n    return dfs(root, 0)\\n\\n# Test the implementation\\nroot = TreeNode(1)\\nroot.left = TreeNode(7)\\nroot.right = TreeNode(9)\\nroot.right.left = TreeNode(2)\\nroot.right.right = TreeNode(9)\\n\\nprint(has_path(root, [1, 9, 9]))  # True\\nprint(has_path(root, [1, 9, 2]))  # True\\nprint(has_path(root, [1, 7]))     # False (not a leaf)\\nprint(has_path(root, [1, 9, 9, 9]))  # False (too long)",
  "runnable": true
}
\`\`\`

### Complexity Analysis

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Time Complexity",
      "content": "**O(N)** where N is the number of nodes in the tree.\\n\\nIn the worst case, we visit every node once. The sequence comparison is O(1) per node since we're just checking if \`node.val == sequence[index]\`.\\n\\nFor balanced trees: O(N)\\nFor skewed trees: O(N)"
    },
    {
      "label": "Space Complexity",
      "content": "**O(H)** where H is the height of the tree.\\n\\nThis represents the maximum depth of the recursion call stack.\\n\\n- Balanced tree: O(log N)\\n- Skewed tree: O(N)\\n\\nThe iterative DFS version also uses O(H) space for the explicit stack."
    }
  ]
}
\`\`\`

### Common Pitfalls

\`\`\`callout
{
  "type": "warning",
  "title": "Watch Out for These Mistakes",
  "content": "1. **Forgetting to check if it's a leaf**: Make sure you verify that you've reached a leaf node before declaring success.\\n\\n2. **Not checking sequence bounds**: Always verify \`index < len(sequence)\` before accessing \`sequence[index]\`.\\n\\n3. **Returning True too early**: Don't return True just because you matched the last element — ensure you're actually at a leaf node.\\n\\n4. **Ignoring path length mismatch**: A path that matches values but has wrong length (too short/long) should return False."
}
\`\`\`

\`\`\`quiz
{
  "title": "Path Sequence Mastery",
  "questions": [
    {
      "question": "For sequence [1, 2, 3] to be valid, what MUST be true?",
      "options": [
        "The tree has exactly 3 nodes",
        "There's a path with values 1, 2, 3 in order",
        "There's a root-to-leaf path with values 1, 2, 3",
        "Any path in the tree contains 1, 2, 3"
      ],
      "answer": 2,
      "explanation": "The sequence must match a complete root-to-leaf path, not just any path or sequence of values."
    },
    {
      "question": "What happens if we reach a leaf but haven't reached the end of the sequence?",
      "options": [
        "Return True - we found a path",
        "Return False - path is too short",
        "Continue searching other branches",
        "Backtrack to parent node"
      ],
      "answer": 1,
      "explanation": "If we're at a leaf but haven't consumed the entire sequence, the path is too short and we return False."
    },
    {
      "question": "In a balanced tree with 1000 nodes, what's the space complexity?",
      "options": [
        "O(1) - constant space",
        "O(log 1000) - height of tree",
        "O(1000) - all nodes",
        "O(500) - half the nodes"
      ],
      "answer": 1,
      "explanation": "For a balanced tree, the height is log₂(N), so space complexity is O(log N) ≈ O(10) for 1000 nodes."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "DFS is the natural choice for path validation problems in trees",
    "Track both position in sequence and current node during traversal",
    "Success requires reaching a leaf AND consuming the entire sequence",
    "Time complexity is O(N), space is O(H) where H is tree height",
    "Always verify bounds and leaf status before returning results"
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

\`\`\`concept
{
  "title": "What counts as a valid path?",
  "variant": "rule",
  "content": "A valid path must:\\n1. Move strictly downward (parent → child)\\n2. Start at any node\\n3. End at any descendant node\\n4. Sum exactly to the target value\\n\\nExample: target = 6\\n    3\\n   / \\\\\\n  1   4\\n / \\\\\\n5   2\\n\\nValid paths: [1,5] and [3,1,2] both sum to 6"
}
\`\`\`

### Examples

\`\`\`algoviz
{
  "title": "Example: target = 6",
  "type": "tree",
  "data": [3, 1, 4, 5, 2, null, null],
  "frames": [
    {"highlight": [0], "label": "Start at root (3)", "stats": {"current_sum": 3}},
    {"highlight": [1], "label": "Move to node 1", "stats": {"current_sum": 4}},
    {"highlight": [3], "label": "Path [3,1,5] = 9", "stats": {"current_sum": 9}},
    {"highlight": [4], "label": "Path [1,2] = 3", "stats": {"current_sum": 3}},
    {"highlight": [0,1,4], "label": "Found: [3,1,2] = 6 ✓", "stats": {"paths_found": 1}},
    {"highlight": [1,3], "label": "Found: [1,5] = 6 ✓", "stats": {"paths_found": 2}}
  ],
  "speed": 1000
}
\`\`\`

### Brute Force Approach

The straightforward solution considers **every node as a potential starting point** and explores all downward paths:

\`\`\`trace
{
  "title": "Brute Force DFS Trace",
  "language": "python",
  "code": "def count_paths(root, target):\\n    def count_from_node(node, target):\\n        if not node:\\n            return 0\\n        count = 0\\n        if node.val == target:\\n            count += 1\\n        count += count_from_node(node.left, target - node.val)\\n        count += count_from_node(node.right, target - node.val)\\n        return count\\n    \\n    if not root:\\n        return 0\\n    return (count_from_node(root, target) + \\n            count_paths(root.left, target) + \\n            count_paths(root.right, target))",
  "frames": [
    {"line": 1, "vars": {"root": "Node(3)", "target": 6}, "note": "Start at root node 3"},
    {"line": 3, "vars": {"node": "Node(3)", "target": 6}, "note": "count_from_node(3, 6)"},
    {"line": 6, "vars": {"node.val": 3, "count": 0}, "note": "3 ≠ 6, continue"},
    {"line": 8, "vars": {"count": 0}, "note": "Check left subtree (1)"},
    {"line": 9, "vars": {"count": 0}, "note": "Check right subtree (4)"},
    {"line": 13, "vars": {"count": 0}, "note": "Recurse on left child (1)"},
    {"line": 14, "vars": {"count": 1}, "note": "Found path [3,1,2] = 6"}
  ],
  "speed": 800
}
\`\`\`

**Time Complexity:** O(n²) — for each of n nodes, we potentially scan all descendants  
**Space Complexity:** O(h) — recursion stack depth

### Optimized Prefix Sum Approach

We can achieve **O(n) time** using a hash map to track prefix sums from the root:

\`\`\`concept
{
  "title": "Prefix Sum Insight",
  "variant": "mental-model",
  "content": "Think of the path from root to current node as a running total. If we store all prefix sums we've seen, we can check if (current_sum - target) exists in our map. This tells us there's a path ending at the current node that sums to target.\\n\\nExample: target = 6\\nPath: [3,1,2] → prefix sums: [3, 4, 6]\\nAt node 2: current_sum = 6\\nCheck: 6 - 6 = 0 → if 0 is in our map, we found a path!"
}
\`\`\`

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Brute Force (O(n²))",
    "code": "def count_paths(root, target):\\n    def count_from_node(node, remaining):\\n        if not node:\\n            return 0\\n        count = 0\\n        if node.val == remaining:\\n            count += 1\\n        count += count_from_node(node.left, remaining - node.val)\\n        count += count_from_node(node.right, remaining - node.val)\\n        return count\\n    \\n    if not root:\\n        return 0\\n    return (count_from_node(root, target) + \\n            count_paths(root.left, target) + \\n            count_paths(root.right, target))"
  },
  "after": {
    "label": "Optimized (O(n))",
    "code": "def count_paths(root, target):\\n    def dfs(node, current_sum):\\n        if not node:\\n            return 0\\n        \\n        current_sum += node.val\\n        # Check if there's a path ending here\\n        count = prefix_sums.get(current_sum - target, 0)\\n        \\n        # Update prefix sums\\n        prefix_sums[current_sum] = prefix_sums.get(current_sum, 0) + 1\\n        \\n        # Recurse on children\\n        count += dfs(node.left, current_sum)\\n        count += dfs(node.right, current_sum)\\n        \\n        # Backtrack\\n        prefix_sums[current_sum] -= 1\\n        if prefix_sums[current_sum] == 0:\\n            del prefix_sums[current_sum]\\n        \\n        return count\\n    \\n    prefix_sums = {0: 1}  # Base case: sum of 0\\n    return dfs(root, 0)"
  }
}
\`\`\`

### Implementation Details

\`\`\`playground
{
  "title": "Complete Solution",
  "language": "python",
  "code": "class TreeNode:\\n    def __init__(self, val=0, left=None, right=None):\\n        self.val = val\\n        self.left = left\\n        self.right = right\\n\\ndef count_paths(root, target):\\n    def dfs(node, current_sum):\\n        if not node:\\n            return 0\\n        \\n        current_sum += node.val\\n        # Check if there's a valid path ending at current node\\n        count = prefix_sums.get(current_sum - target, 0)\\n        \\n        # Update prefix sums for this path\\n        prefix_sums[current_sum] = prefix_sums.get(current_sum, 0) + 1\\n        \\n        # Explore all paths through current node\\n        count += dfs(node.left, current_sum)\\n        count += dfs(node.right, current_sum)\\n        \\n        # Backtrack: remove current sum from prefix sums\\n        prefix_sums[current_sum] -= 1\\n        if prefix_sums[current_sum] == 0:\\n            del prefix_sums[current_sum]\\n        \\n        return count\\n    \\n    # Initialize with 0 sum having frequency 1 (handles paths starting from root)\\n    prefix_sums = {0: 1}\\n    return dfs(root, 0)\\n\\n# Test with example\\ntree = TreeNode(3, \\n        TreeNode(1, TreeNode(5), TreeNode(2)), \\n        TreeNode(4))\\nprint(f\\"Paths summing to 6: {count_paths(tree, 6)}\\")",
  "runnable": true
}
\`\`\`

### Complexity Analysis

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Time Complexity: O(n) — each node visited exactly once",
    "Space Complexity: O(h) — recursion stack + hash map (h = tree height)",
    "Prefix sum technique transforms O(n²) to O(n) by avoiding redundant calculations",
    "Hash map tracks running sums from root to current node",
    "Backtracking ensures correct prefix sum counts at each level"
  ]
}
\`\`\`

### Practice Quiz

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "In the optimized solution, what does the hash map store?",
      "options": ["All node values", "Prefix sums and their frequencies", "Target sums", "Path counts"],
      "answer": 1,
      "explanation": "The hash map stores prefix sums (running totals from root) and how many times each sum has occurred."
    },
    {
      "question": "Why do we initialize prefix_sums with {0: 1}?",
      "options": ["To handle empty trees", "To count paths starting from root", "For base case recursion", "To avoid KeyError"],
      "answer": 1,
      "explanation": "Initializing with {0: 1} allows us to detect paths that sum to target starting from the root node."
    },
    {
      "question": "What's the worst-case space complexity for a skewed tree?",
      "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      "answer": 2,
      "explanation": "For a skewed tree, height h = n, so space complexity becomes O(n) for both recursion stack and hash map."
    }
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
