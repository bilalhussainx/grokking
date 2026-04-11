import { Module } from "../types";

export const treesModule: Module = {
  id: "trees",
  title: "Trees",
  description: "Build binary search trees, master tree traversals, understand AVL self-balancing, and solve classic tree interview problems.",
  lessons: [
    {
      id: "trees-bst",
      slug: "binary-search-tree",
      title: "Binary Search Tree",
      content: `## Binary Search Tree (BST)

A **Binary Search Tree** is a binary tree where every node obeys a strict ordering rule:

- All keys in the **left subtree** are **less** than the node's key  
- All keys in the **right subtree** are **greater** than the node's key  
- Both subtrees are themselves BSTs

\`\`\`concept
{"title": "BST Ordering Rule", "variant": "mental-model", "content": "Think of each node as a pivot: everything to its left is smaller, everything to its right is larger. This single rule makes the entire tree a sorted index—no duplicates, no ambiguity."}
\`\`\`

\`\`\`algoviz
{"title": "Visual BST Example", "type": "tree", "data": [8,3,10,1,6,14,4,7,13], "frames": [
  {"highlight": [0], "label": "Root 8: left < 8 < right", "stats": {"depth": 0}},
  {"highlight": [1,2], "label": "3 < 8 and 10 > 8", "stats": {"depth": 1}},
  {"highlight": [3,4,7], "label": "1 < 3, 6 > 3, 14 > 10", "stats": {"depth": 2}},
  {"highlight": [6,8], "label": "4 < 6, 7 > 6, 13 < 14", "stats": {"depth": 3}}
], "speed": 1000}
\`\`\`

### Complexity Snapshot (Balanced vs. Worst-Case)

| Operation | Balanced | Degenerate (Linked-List) |
|-----------|----------|--------------------------|
| Search    | O(log n) | O(n) |
| Insert    | O(log n) | O(n) |
| Delete    | O(log n) | O(n) |
| Min/Max   | O(log n) | O(n) |

\`\`\`callout
{"type": "warning", "title": "Unbalanced = Performance Trap", "content": "Inserting sorted data [1,2,3,4,5] produces a right-skewed chain. The tree still satisfies BST rules, but search degrades to linear scan. Self-balancing variants (AVL, Red-Black) prevent this."}
\`\`\`

### Core Operations Walk-Through

\`\`\`steps
{"title": "Building a BST from Scratch", "steps": [
  {"title": "1. Insert", "content": "Start at root. If new key < current, go left; else go right. Repeat until you hit null—attach new node there."},
  {"title": "2. Search", "content": "Same path logic as insert. If you reach null, key absent; if you match, return node."},
  {"title": "3. Find Min/Max", "content": "Min: follow left children until null. Max: follow right children until null."},
  {"title": "4. In-Order Traversal", "content": "Left → Root → Right. Because of BST ordering, this yields keys in ascending sorted order in O(n) time."}
]}
\`\`\`

\`\`\`playground
{"title": "BST Insert & Search", "language": "python", "code": "class Node:\\n    def __init__(self, key):\\n        self.key = key\\n        self.left = None\\n        self.right = None\\n\\nclass BST:\\n    def __init__(self):\\n        self.root = None\\n\\n    def insert(self, key):\\n        self.root = self._insert(self.root, key)\\n\\n    def _insert(self, node, key):\\n        if node is None:\\n            return Node(key)\\n        if key < node.key:\\n            node.left = self._insert(node.left, key)\\n        elif key > node.key:\\n            node.right = self._insert(node.right, key)\\n        return node\\n\\n    def search(self, key):\\n        return self._search(self.root, key)\\n\\n    def _search(self, node, key):\\n        if node is None or node.key == key:\\n            return node\\n        if key < node.key:\\n            return self._search(node.left, key)\\n        return self._search(node.right, key)\\n\\n# Quick demo\\nbst = BST()\\nfor val in [8,3,10,1,6,14,4,7,13]:\\n    bst.insert(val)\\nprint(\\"Search 6:\\", bst.search(6) is not None)\\nprint(\\"Search 99:\\", bst.search(99) is not None)", "runnable": true}
\`\`\`

### Deletion: The Tricky Part

Deleting a node has **three distinct cases**:

1. **Leaf** — snip it off (set parent pointer to null)  
2. **One child** — splice it out (parent points to grandchild)  
3. **Two children** — find **in-order successor** (smallest in right subtree), copy its key into the node to delete, then recursively delete the successor (which now falls into case 1 or 2)

\`\`\`trace
{"title": "Deleting Node with Two Children", "language": "python", "code": "def delete(root, key):\\n    if not root:\\n        return None\\n    if key < root.key:\\n        root.left = delete(root.left, key)\\n    elif key > root.key:\\n        root.right = delete(root.right, key)\\n    else:  # found\\n        if not root.left:          # case 0/1\\n            return root.right\\n        if not root.right:         # case 1\\n            return root.left\\n        # case 2: two children\\n        succ = min_node(root.right)\\n        root.key = succ.key\\n        root.right = delete(root.right, succ.key)\\n    return root\\n\\ndef min_node(node):\\n    while node.left:\\n        node = node.left\\n    return node", "frames": [
  {"line": 1, "vars": {"root": "8", "key": "6"}, "note": "Start delete(6)", "stdout": ""},
  {"line": 3, "vars": {"root": "8"}, "note": "6 < 8 → go left", "stdout": ""},
  {"line": 4, "vars": {"root": "3"}, "note": "Now at node 3", "stdout": ""},
  {"line": 5, "vars": {"root": "3"}, "note": "6 > 3 → go right", "stdout": ""},
  {"line": 7, "vars": {"root": "6"}, "note": "Found node 6", "stdout": ""},
  {"line": 11, "vars": {"root": "6"}, "note": "Has both children", "stdout": ""},
  {"line": 15, "vars": {"succ": "7"}, "note": "Successor is 7", "stdout": ""},
  {"line": 16, "vars": {"root.key": "7"}, "note": "Copy 7 into node", "stdout": ""},
  {"line": 17, "vars": {}, "note": "Delete original 7", "stdout": ""}
], "speed": 900}
\`\`\`

\`\`\`quiz
{"title": "BST Quick Check", "questions": [
  {"question": "In-order traversal of any BST produces:", "options": ["random order", "descending order", "ascending order", "level order"], "answer": 2, "explanation": "Left < Root < Right guarantees ascending sequence."},
  {"question": "Worst-case height of a basic BST with n nodes is:", "options": ["O(log n)", "O(n)", "O(n log n)", "O(1)"], "answer": 1, "explanation": "Inserting sorted data creates a linked-list-like chain of height n."},
  {"question": "When deleting a node with two children, we replace its key with the:", "options": ["predecessor (max of left)", "successor (min of right)", "parent", "root"], "answer": 1, "explanation": "The in-order successor is the smallest node larger than the one being deleted, preserving BST order."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "BSTs embed a sorted order: left < root < right.",
  "Balanced BSTs give O(log n) search/insert/delete; unbalanced ones degrade to O(n).",
  "In-order traversal outputs keys in ascending order in O(n) time.",
  "Deletion requires handling three cases—leaf, one child, or two children (use successor).",
  "Real-world systems use self-balancing variants (AVL, Red-Black, B-trees) to guarantee logarithmic performance."
]}
\`\`\``,
      starterCode: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        # TODO: Insert val maintaining BST property
        pass

    def search(self, val):
        # TODO: Return True if val exists
        pass

    def delete(self, val):
        # TODO: Delete val from the BST
        pass

    def find_min(self):
        # TODO: Return the minimum value
        pass

    def inorder(self):
        # TODO: Return sorted list via in-order traversal
        pass

# Test cases
bst = BST()
for v in [5, 3, 7, 1, 4, 6, 8]:
    bst.insert(v)
print(bst.inorder())    # Expected: [1, 3, 4, 5, 6, 7, 8]
print(bst.search(4))    # Expected: True
print(bst.search(9))    # Expected: False
print(bst.find_min())   # Expected: 1
bst.delete(3)
print(bst.inorder())    # Expected: [1, 4, 5, 6, 7, 8]
bst.delete(5)
print(bst.inorder())    # Expected: [1, 4, 6, 7, 8]
`,
      solutionCode: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        self.root = self._insert(self.root, val)

    def _insert(self, node, val):
        if not node:
            return TreeNode(val)
        if val < node.val:
            node.left = self._insert(node.left, val)
        elif val > node.val:
            node.right = self._insert(node.right, val)
        return node

    def search(self, val):
        return self._search(self.root, val)

    def _search(self, node, val):
        if not node:
            return False
        if val == node.val:
            return True
        elif val < node.val:
            return self._search(node.left, val)
        else:
            return self._search(node.right, val)

    def delete(self, val):
        self.root = self._delete(self.root, val)

    def _delete(self, node, val):
        if not node:
            return None
        if val < node.val:
            node.left = self._delete(node.left, val)
        elif val > node.val:
            node.right = self._delete(node.right, val)
        else:
            if not node.left:
                return node.right
            if not node.right:
                return node.left
            successor = node.right
            while successor.left:
                successor = successor.left
            node.val = successor.val
            node.right = self._delete(node.right, successor.val)
        return node

    def find_min(self):
        if not self.root:
            return None
        curr = self.root
        while curr.left:
            curr = curr.left
        return curr.val

    def inorder(self):
        result = []
        self._inorder(self.root, result)
        return result

    def _inorder(self, node, result):
        if node:
            self._inorder(node.left, result)
            result.append(node.val)
            self._inorder(node.right, result)

# Test cases
bst = BST()
for v in [5, 3, 7, 1, 4, 6, 8]:
    bst.insert(v)
print(bst.inorder())    # Expected: [1, 3, 4, 5, 6, 7, 8]
print(bst.search(4))    # Expected: True
print(bst.search(9))    # Expected: False
print(bst.find_min())   # Expected: 1
bst.delete(3)
print(bst.inorder())    # Expected: [1, 4, 5, 6, 7, 8]
bst.delete(5)
print(bst.inorder())    # Expected: [1, 4, 6, 7, 8]
`,
    },
    {
      id: "trees-traversals",
      slug: "tree-traversals",
      title: "Tree Traversals",
      content: `## Tree Traversals

\`\`\`concept
{"title": "What is a Tree Traversal?", "variant": "mental-model", "content": "Tree traversal is the systematic process of visiting each node in a tree exactly once. Think of it as choosing a route through a maze: different paths (algorithms) will reveal the 'treasures' (node values) in different orders. The path you pick depends on what you want to do with the data."}
\`\`\`

| Traversal | Order | Use Case |
|-----------|-------|----------|
| **In-order** | Left, Root, Right | Sorted output from BST |
| **Pre-order** | Root, Left, Right | Copying/serializing a tree |
| **Post-order** | Left, Right, Root | Deleting a tree, expression eval |
| **Level-order** | Level by level (BFS) | Level-based processing |

\`\`\`algoviz
{"title": "Traversal Orders on a Sample Tree", "type": "tree", "data": [1,2,3,4,5,null,6], "frames": [
  {"highlight": [1], "label": "Pre-order: visit root first", "stats": {"step": 1}},
  {"highlight": [2], "label": "Pre-order: then left subtree", "stats": {"step": 2}},
  {"highlight": [4], "label": "Pre-order: continue left", "stats": {"step": 3}},
  {"highlight": [5], "label": "Pre-order: right child of 2", "stats": {"step": 4}},
  {"highlight": [3], "label": "Pre-order: right subtree", "stats": {"step": 5}},
  {"highlight": [6], "label": "Pre-order: final node", "stats": {"step": 6}}
], "speed": 1000}
\`\`\`

\`\`\`tabs
{"tabs": [
  {"label": "In-order", "content": "\`\`\`python\\ndef in_order(node):\\n    if not node: return\\n    in_order(node.left)   # 1. Left\\n    visit(node)           # 2. Root\\n    in_order(node.right)  # 3. Right\\n\`\`\`\\nProduces sorted sequence for BSTs."},
  {"label": "Pre-order", "content": "\`\`\`python\\ndef pre_order(node):\\n    if not node: return\\n    visit(node)           # 1. Root\\n    pre_order(node.left)  # 2. Left\\n    pre_order(node.right) # 3. Right\\n\`\`\`\\nUseful for creating a deep copy of the tree."},
  {"label": "Post-order", "content": "\`\`\`python\\ndef post_order(node):\\n    if not node: return\\n    post_order(node.left)  # 1. Left\\n    post_order(node.right) # 2. Right\\n    visit(node)            # 3. Root\\n\`\`\`\\nRequired when freeing nodes (children before parent)."},
  {"label": "Level-order", "content": "\`\`\`python\\nfrom collections import deque\\n\\ndef level_order(root):\\n    if not root: return\\n    q = deque([root])\\n    while q:\\n        node = q.popleft()\\n        visit(node)\\n        if node.left:  q.append(node.left)\\n        if node.right: q.append(node.right)\\n\`\`\`\\nVisits nodes top-to-bottom, left-to-right."}
]}
\`\`\`

\`\`\`callout
{"type": "info", "title": "Complexity Cheat-Sheet", "content": "All four traversals visit each node exactly once:\\n- **Time**: O(N)\\n- **DFS space** (in/pre/post): O(H) recursion stack, where H = tree height\\n- **BFS space** (level-order): O(W) queue width, where W = max nodes on any level"}
\`\`\`

### Problem

Given a binary tree, implement all four traversals. Return each as a list of values.

\`\`\`
        1
       / \\
      2   3
     / \\   \\
    4   5   6

In-order:    [4, 2, 5, 1, 3, 6]
Pre-order:   [1, 2, 4, 5, 3, 6]
Post-order:  [4, 5, 2, 6, 3, 1]
Level-order: [1, 2, 3, 4, 5, 6]
\`\`\`

\`\`\`playground
{"title": "Implement All Traversals", "language": "python", "code": "from collections import deque\\n\\nclass Node:\\n    def __init__(self, val, left=None, right=None):\\n        self.val = val\\n        self.left = left\\n        self.right = right\\n\\ndef in_order(root):\\n    # TODO: Left -> Root -> Right\\n    pass\\n\\ndef pre_order(root):\\n    # TODO: Root -> Left -> Right\\n    pass\\n\\ndef post_order(root):\\n    # TODO: Left -> Right -> Root\\n    pass\\n\\ndef level_order(root):\\n    # TODO: use a queue\\n    pass\\n\\n# ---- test on sample tree ----\\nroot = Node(1,\\n            Node(2, Node(4), Node(5)),\\n            Node(3, None, Node(6)))\\n\\nprint('In:', in_order(root))\\nprint('Pre:', pre_order(root))\\nprint('Post:', post_order(root))\\nprint('Level:', level_order(root))", "runnable": true}
\`\`\`

\`\`\`quiz
{"title": "Quick Check", "questions": [
  {"question": "Which traversal gives sorted output for a BST?", "options": ["Pre-order", "In-order", "Post-order", "Level-order"], "answer": 1, "explanation": "In-order visits Left, Root, Right, which for a BST yields ascending order."},
  {"question": "What is the space complexity of recursive DFS traversals?", "options": ["O(N)", "O(log N)", "O(H)", "O(1)"], "answer": 2, "explanation": "The recursion stack holds at most H frames, where H is the tree height."},
  {"question": "Which traversal is best suited to delete a tree?", "options": ["Pre-order", "In-order", "Post-order", "Level-order"], "answer": 2, "explanation": "Post-order deletes children before their parent, avoiding dangling pointers."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["In-order produces sorted order for BSTs", "Pre-order is ideal for copying/serializing trees", "Post-order ensures children are processed before parents", "Level-order uses a queue and consumes O(W) memory", "All traversals run in O(N) time because every node is visited once"]}
\`\`\``,
      starterCode: `from collections import deque

class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def inorder(root):
    # TODO: Return in-order traversal as list
    pass

def preorder(root):
    # TODO: Return pre-order traversal as list
    pass

def postorder(root):
    # TODO: Return post-order traversal as list
    pass

def level_order(root):
    # TODO: Return level-order traversal as list
    pass

# Build test tree
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)
root.right.right = TreeNode(6)

print(inorder(root))      # Expected: [4, 2, 5, 1, 3, 6]
print(preorder(root))     # Expected: [1, 2, 4, 5, 3, 6]
print(postorder(root))    # Expected: [4, 5, 2, 6, 3, 1]
print(level_order(root))  # Expected: [1, 2, 3, 4, 5, 6]
`,
      solutionCode: `from collections import deque

class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)

def preorder(root):
    if not root:
        return []
    return [root.val] + preorder(root.left) + preorder(root.right)

def postorder(root):
    if not root:
        return []
    return postorder(root.left) + postorder(root.right) + [root.val]

def level_order(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        node = queue.popleft()
        result.append(node.val)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return result

# Build test tree
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)
root.right.right = TreeNode(6)

print(inorder(root))      # Expected: [4, 2, 5, 1, 3, 6]
print(preorder(root))     # Expected: [1, 2, 4, 5, 3, 6]
print(postorder(root))    # Expected: [4, 5, 2, 6, 3, 1]
print(level_order(root))  # Expected: [1, 2, 3, 4, 5, 6]
`,
    },
    {
      id: "trees-avl",
      slug: "avl-tree",
      title: "AVL Tree",
      content: `## AVL Tree

An **AVL tree** is a self-balancing BST where the height difference between left and right subtrees of any node is at most 1. When an insertion or deletion violates this property, **rotations** restore balance.

\`\`\`concept
{
  "title": "AVL Invariant",
  "variant": "rule",
  "content": "For every node, |height(left) - height(right)| ≤ 1. This balance factor (-1, 0, or 1) guarantees O(log n) height and operation cost."
}
\`\`\`

### Balance Factor

\`balance(node) = height(left) - height(right)\`

- If balance > 1: left-heavy, needs right rotation(s)
- If balance < -1: right-heavy, needs left rotation(s)

\`\`\`trace
{
  "title": "Insert 1 → 2 → 3 and watch imbalance grow",
  "language": "python",
  "code": "class Node:\\n    def __init__(self, key):\\n        self.key, self.left, self.right, self.h = key, None, None, 1\\n\\ndef height(n): return n.h if n else 0\\n\\ndef update(n):\\n    n.h = 1 + max(height(n.left), height(n.right))\\n\\ndef insert(root, key):\\n    if not root: return Node(key)\\n    if key < root.key: root.left = insert(root.left, key)\\n    else: root.right = insert(root.right, key)\\n    update(root)\\n    return root\\n\\nroot = None\\nfor v in [1,2,3]:\\n    root = insert(root, v)\\n    print(f'after {v}: height={root.h}, balance={height(root.left)-height(root.right)}')",
  "frames": [
    {"line": 10, "vars": {"root": "None", "v": 1}, "stdout": "after 1: height=1, balance=0\\n"},
    {"line": 10, "vars": {"root": "Node(1)", "v": 2}, "stdout": "after 2: height=2, balance=-1\\n"},
    {"line": 10, "vars": {"root": "Node(1)", "v": 3}, "stdout": "after 3: height=3, balance=-2 ← violates AVL!\\n"}
  ],
  "speed": 1000
}
\`\`\`

### Rotations

| Case | Rotation |
|------|----------|
| Left-heavy, left child left-heavy | Right rotation |
| Right-heavy, right child right-heavy | Left rotation |
| Left-heavy, left child right-heavy | Left-Right rotation |
| Right-heavy, right child left-heavy | Right-Left rotation |

\`\`\`algoviz
{
  "title": "Single Right Rotation (LL Case)",
  "type": "tree",
  "data": [3, 2, 1, null, null, null, null],
  "frames": [
    {"highlight": [1], "label": "Node 3 is left-heavy (balance=2)", "stats": {"bal": 2}},
    {"highlight": [2], "label": "Left child 2 is also left-heavy → LL case", "stats": {"bal": 1}},
    {"highlight": [1, 2], "label": "Right-rotate around 3", "stats": {"action": "rotateRight(3)"}},
    {"highlight": [2], "label": "New root 2; heights restored", "stats": {"bal": 0}}
  ],
  "speed": 800
}
\`\`\`

### Complexity

All operations remain **O(log n)** guaranteed, unlike a plain BST which can degrade to **O(n)**.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Plain BST after sorted insert 1-2-3-4-5",
    "code": "    1\\n     \\\\\\n      2\\n       \\\\\\n        3\\n         \\\\\\n          4\\n           \\\\\\n            5\\nheight = 5, search = O(n)"
  },
  "after": {
    "label": "AVL after same inserts (rotations applied)",
    "code": "      2\\n    /   \\\\\\n   1     4\\n        / \\\\\\n       3   5\\nheight = 3, search = O(log n)"
  }
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Balance factor ∈ {-1,0,1} keeps height ≤ 1.44 log n",
    "Rotations are local; only the deepest unbalanced ancestor is fixed",
    "AVL gives faster lookups than Red-Black but may rotate more on updates",
    "Used in database indexes where reads dominate writes"
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your AVL Intuition",
  "questions": [
    {
      "question": "After inserting 7 into the AVL tree with root 5 (left child 3, right child 8), which node is the deepest unbalanced ancestor?",
      "options": ["3", "5", "8", "7"],
      "answer": 1,
      "explanation": "Insertion happens at 8’s right; 8’s balance becomes -1 and 5’s balance becomes -2, so 5 is the deepest unbalanced node."
    },
    {
      "question": "Which rotation fixes the RR case?",
      "options": ["Right rotation", "Left rotation", "Left-Right rotation", "Right-Left rotation"],
      "answer": 1,
      "explanation": "RR means right-heavy with right child also right-heavy → single left rotation on the root."
    },
    {
      "question": "What is the worst-case height of an AVL tree with n nodes?",
      "options": ["log₂ n", "1.44 log₂ n", "2 log₂ n", "n"],
      "answer": 1,
      "explanation": "Tight analysis shows height ≤ 1.44 log₂(n+2), tighter than Red-Black’s 2 log₂ n."
    }
  ]
}
\`\`\``,
      starterCode: `class AVLNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.height = 1

class AVLTree:
    def __init__(self):
        self.root = None

    def height(self, node):
        return node.height if node else 0

    def balance_factor(self, node):
        return self.height(node.left) - self.height(node.right) if node else 0

    def rotate_right(self, y):
        # TODO: Perform right rotation
        pass

    def rotate_left(self, x):
        # TODO: Perform left rotation
        pass

    def insert(self, val):
        self.root = self._insert(self.root, val)

    def _insert(self, node, val):
        # TODO: Insert and rebalance
        pass

    def inorder(self):
        result = []
        self._inorder(self.root, result)
        return result

    def _inorder(self, node, result):
        if node:
            self._inorder(node.left, result)
            result.append(node.val)
            self._inorder(node.right, result)

# Test: insert sorted values (would break a plain BST)
avl = AVLTree()
for v in [1, 2, 3, 4, 5, 6, 7]:
    avl.insert(v)
print(avl.inorder())  # Expected: [1, 2, 3, 4, 5, 6, 7]
print(f"Root: {avl.root.val}")  # Should NOT be 1 (balanced)
print(f"Root height: {avl.root.height}")  # Expected: 3
`,
      solutionCode: `class AVLNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.height = 1

class AVLTree:
    def __init__(self):
        self.root = None

    def height(self, node):
        return node.height if node else 0

    def balance_factor(self, node):
        return self.height(node.left) - self.height(node.right) if node else 0

    def update_height(self, node):
        node.height = 1 + max(self.height(node.left), self.height(node.right))

    def rotate_right(self, y):
        x = y.left
        t = x.right
        x.right = y
        y.left = t
        self.update_height(y)
        self.update_height(x)
        return x

    def rotate_left(self, x):
        y = x.right
        t = y.left
        y.left = x
        x.right = t
        self.update_height(x)
        self.update_height(y)
        return y

    def insert(self, val):
        self.root = self._insert(self.root, val)

    def _insert(self, node, val):
        if not node:
            return AVLNode(val)
        if val < node.val:
            node.left = self._insert(node.left, val)
        elif val > node.val:
            node.right = self._insert(node.right, val)
        else:
            return node

        self.update_height(node)
        balance = self.balance_factor(node)

        # Left Left
        if balance > 1 and val < node.left.val:
            return self.rotate_right(node)
        # Right Right
        if balance < -1 and val > node.right.val:
            return self.rotate_left(node)
        # Left Right
        if balance > 1 and val > node.left.val:
            node.left = self.rotate_left(node.left)
            return self.rotate_right(node)
        # Right Left
        if balance < -1 and val < node.right.val:
            node.right = self.rotate_right(node.right)
            return self.rotate_left(node)

        return node

    def inorder(self):
        result = []
        self._inorder(self.root, result)
        return result

    def _inorder(self, node, result):
        if node:
            self._inorder(node.left, result)
            result.append(node.val)
            self._inorder(node.right, result)

# Test: insert sorted values (would break a plain BST)
avl = AVLTree()
for v in [1, 2, 3, 4, 5, 6, 7]:
    avl.insert(v)
print(avl.inorder())  # Expected: [1, 2, 3, 4, 5, 6, 7]
print(f"Root: {avl.root.val}")  # Should NOT be 1 (balanced)
print(f"Root height: {avl.root.height}")  # Expected: 3
`,
    },
    {
      id: "trees-problems",
      slug: "tree-problems",
      title: "Tree Problems",
      content: `## Tree Problems

Binary trees appear in nearly every technical interview. These three classic problems—maximum depth, lowest common ancestor, and BST validation—cover the essential patterns you'll reuse again and again.

\`\`\`concept
{"title": "Tree Thinking Checklist", "variant": "mental-model", "content": "Before you code:\\n1. Identify the traversal order (pre/in/post or level?)\\n2. Decide what information each subtree must return\\n3. Check if the problem needs parent pointers or can be solved top-down\\n4. For BSTs, remember the invariant: left < root ≤ right"}
\`\`\`

### Problem 1: Maximum Depth

Find the height of a binary tree—the number of nodes along the longest root-to-leaf path.

\`\`\`algoviz
{"title": "Max Depth on Sample Tree", "type": "tree", "data": [3,9,20,null,null,15,7], "frames": [
  {"highlight": [0], "label": "Start at root (depth 1)", "stats": {"depth": 1}},
  {"highlight": [1], "label": "Left subtree: depth(9) = 1", "stats": {"depth": 1}},
  {"highlight": [2], "label": "Right subtree: explore 20", "stats": {"depth": 1}},
  {"highlight": [5], "label": "Left of 20: depth(15) = 1", "stats": {"depth": 1}},
  {"highlight": [6], "label": "Right of 20: depth(7) = 1", "stats": {"depth": 1}},
  {"highlight": [2], "label": "depth(20) = max(1,1)+1 = 2", "stats": {"depth": 2}},
  {"highlight": [0], "label": "depth(3) = max(1,2)+1 = 3", "stats": {"depth": 3}}
], "speed": 1000}
\`\`\`

The recursive rule is trivial but powerful:  
\`depth(node) = max(depth(left), depth(right)) + 1\`

\`\`\`playground
{"title": "Max Depth—Try It", "language": "python", "code": "class Node:\\n    def __init__(self, val, left=None, right=None):\\n        self.val, self.left, self.right = val, left, right\\n\\ndef max_depth(root):\\n    # base case\\n    if not root:\\n        return 0\\n    # recursive case\\n    return max(max_depth(root.left), max_depth(root.right)) + 1\\n\\n# ---- test ----\\ntree = Node(3,\\n            Node(9),\\n            Node(20, Node(15), Node(7)))\\nprint(max_depth(tree))  # expected 3", "runnable": true}
\`\`\`

Time complexity: **O(n)**—every node is visited once.  
Space complexity: **O(h)** where *h* is tree height (call-stack).

### Problem 2: Lowest Common Ancestor in a BST

Given two node values, find the deepest node that is an ancestor of both.

\`\`\`steps
{"title": "LCA Decision Rules", "steps": [
  {"title": "Both targets < current", "content": "LCA must be in the **left** subtree—recurse left."},
  {"title": "Both targets > current", "content": "LCA must be in the **right** subtree—recurse right."},
  {"title": "Values split current node", "content": "Current node is the **split point**—return it immediately."}
]}
\`\`\`

\`\`\`trace
{"title": "Finding LCA(2,8) in a BST", "language": "python", "code": "def lca_bst(root, p, q):\\n    while root:\\n        if p < root.val and q < root.val:\\n            root = root.left\\n        elif p > root.val and q > root.val:\\n            root = root.right\\n        else:\\n            return root.val\\n    return None", "frames": [
  {"line": 2, "vars": {"root.val": 6, "p": 2, "q": 8}, "note": "2<6 and 8>6 → split → return 6"},
  {"line": 8, "stdout": "6\\n"}
], "speed": 800}
\`\`\`

The algorithm runs in **O(log n)** average time for balanced BSTs and **O(n)** worst-case if the tree is skewed.

\`\`\`quiz
{"title": "LCA Quick Check", "questions": [
  {"question": "In a BST with root 10, where would you search for LCA(3, 14)?", "options": ["Left subtree only", "Right subtree only", "Stay at 10—it's the split node", "Need more info"], "answer": 2, "explanation": "3 < 10 and 14 > 10, so 10 is the split point and thus the LCA."},
  {"question": "What’s the worst-case time to find LCA in a BST?", "options": ["O(log n)", "O(n)", "O(h²)", "O(1)"], "answer": 1, "explanation": "If the tree degenerates into a linked list, you may traverse every node."},
  {"question": "Why can’t we use the BST rule in a plain binary tree?", "options": ["No ordering property", "Too many nulls", "Needs parent pointers", "Stack overflow"], "answer": 0, "explanation": "Without the ordering guarantee, we can’t decide left vs right based on values alone."}
]}
\`\`\`

### Problem 3: Validate BST

Is the given binary tree a legal BST? The trick is to carry a **valid range** (min, max) as you recurse.

\`\`\`compare
{"variant": "good-bad", "before": {"label": "Wrong—only check immediate children", "code": "def is_bst(root):\\n    if not root:\\n        return True\\n    left_ok = not root.left or root.left.val < root.val\\n    right_ok = not root.right or root.right.val >= root.val\\n    return left_ok and right_ok and is_bst(root.left) and is_bst(root.right)"}, "after": {"label": "Correct—track global range", "code": "def is_bst(root, lo=float('-inf'), hi=float('inf')):\\n    if not root:\\n        return True\\n    if not (lo < root.val < hi):\\n        return False\\n    return (is_bst(root.left, lo, root.val) and\\n            is_bst(root.right, root.val, hi))"}}
\`\`\`

\`\`\`playground
{"title": "Validate This Tree", "language": "python", "code": "class Node:\\n    def __init__(self, val, left=None, right=None):\\n        self.val, self.left, self.right = val, left, right\\n\\ndef is_bst(root, lo=float('-inf'), hi=float('inf')):\\n    if not root:\\n        return True\\n    if not (lo < root.val < hi):\\n        return False\\n    return is_bst(root.left, lo, root.val) and is_bst(root.right, root.val, hi)\\n\\n# ---- test ----\\ngood = Node(5, Node(3, Node(1), Node(4)), Node(7, Node(6), Node(8)))\\nbad  = Node(5, Node(3, Node(4), Node(1)), Node(7))  # 4 is in wrong place\\nprint(is_bst(good))  # True\\nprint(is_bst(bad))   # False", "runnable": true}
\`\`\`

Time complexity: **O(n)**—each node is checked once.  
Space complexity: **O(h)** for the recursion stack.

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Max depth = 1 + max(left depth, right depth)—simple post-order pattern.",
  "LCA in BST exploits ordering: go left/right until values split.",
  "Validate BST with range tracking—never trust only local parent-child checks.",
  "All three problems run in O(n) time and O(h) space—memorize these bounds for interviews."
]}
\`\`\``,
      starterCode: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def max_depth(root):
    # TODO: Return the maximum depth of the tree
    pass

def lowest_common_ancestor(root, p, q):
    # TODO: Return LCA value for BST
    pass

def is_valid_bst(root):
    # TODO: Return True if tree is a valid BST
    pass

# Test max_depth
root = TreeNode(3)
root.left = TreeNode(9)
root.right = TreeNode(20)
root.right.left = TreeNode(15)
root.right.right = TreeNode(7)
print(max_depth(root))    # Expected: 3
print(max_depth(None))    # Expected: 0

# Test LCA
bst_root = TreeNode(6)
bst_root.left = TreeNode(2)
bst_root.right = TreeNode(8)
bst_root.left.left = TreeNode(0)
bst_root.left.right = TreeNode(4)
bst_root.right.left = TreeNode(7)
bst_root.right.right = TreeNode(9)
print(lowest_common_ancestor(bst_root, 2, 8))  # Expected: 6
print(lowest_common_ancestor(bst_root, 2, 4))  # Expected: 2

# Test valid BST
print(is_valid_bst(bst_root))  # Expected: True
invalid = TreeNode(5)
invalid.left = TreeNode(1)
invalid.right = TreeNode(3)  # 3 < 5, invalid right child
print(is_valid_bst(invalid))   # Expected: False
`,
      solutionCode: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

def lowest_common_ancestor(root, p, q):
    if not root:
        return None
    if p < root.val and q < root.val:
        return lowest_common_ancestor(root.left, p, q)
    if p > root.val and q > root.val:
        return lowest_common_ancestor(root.right, p, q)
    return root.val

def is_valid_bst(root):
    def validate(node, low, high):
        if not node:
            return True
        if node.val <= low or node.val >= high:
            return False
        return validate(node.left, low, node.val) and validate(node.right, node.val, high)
    return validate(root, float('-inf'), float('inf'))

# Test max_depth
root = TreeNode(3)
root.left = TreeNode(9)
root.right = TreeNode(20)
root.right.left = TreeNode(15)
root.right.right = TreeNode(7)
print(max_depth(root))    # Expected: 3
print(max_depth(None))    # Expected: 0

# Test LCA
bst_root = TreeNode(6)
bst_root.left = TreeNode(2)
bst_root.right = TreeNode(8)
bst_root.left.left = TreeNode(0)
bst_root.left.right = TreeNode(4)
bst_root.right.left = TreeNode(7)
bst_root.right.right = TreeNode(9)
print(lowest_common_ancestor(bst_root, 2, 8))  # Expected: 6
print(lowest_common_ancestor(bst_root, 2, 4))  # Expected: 2

# Test valid BST
print(is_valid_bst(bst_root))  # Expected: True
invalid = TreeNode(5)
invalid.left = TreeNode(1)
invalid.right = TreeNode(3)  # 3 < 5, invalid right child
print(is_valid_bst(invalid))   # Expected: False
`,
    },
  ],
};
