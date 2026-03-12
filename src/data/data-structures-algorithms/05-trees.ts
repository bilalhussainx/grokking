import { Module } from "../types";

export const treesModule: Module = {
  id: "trees",
  title: "Trees",
  description:
    "Build binary search trees, master tree traversals, understand AVL self-balancing, and solve classic tree interview problems.",
  lessons: [
    {
      id: "trees-bst",
      slug: "binary-search-tree",
      title: "Binary Search Tree",
      content: `## Binary Search Tree (BST)

A **Binary Search Tree** is a binary tree where for every node:
- All values in the **left subtree** are less than the node's value
- All values in the **right subtree** are greater than the node's value

### Operations (Balanced)

| Operation | Time |
|-----------|------|
| Search | O(log n) |
| Insert | O(log n) |
| Delete | O(log n) |
| Min/Max | O(log n) |

### Problem

Implement a BST with insert, search, delete, find_min, find_max, and inorder traversal.

### Deletion Cases

1. **Leaf node** — Simply remove
2. **One child** — Replace with child
3. **Two children** — Replace with in-order successor (smallest in right subtree)`,
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

### The Four Traversals

| Traversal | Order | Use Case |
|-----------|-------|----------|
| **In-order** | Left, Root, Right | Sorted output from BST |
| **Pre-order** | Root, Left, Right | Copying/serializing a tree |
| **Post-order** | Left, Right, Root | Deleting a tree, expression eval |
| **Level-order** | Level by level (BFS) | Level-based processing |

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

### Rotations

| Case | Rotation |
|------|----------|
| Left-heavy, left child left-heavy | Right rotation |
| Right-heavy, right child right-heavy | Left rotation |
| Left-heavy, left child right-heavy | Left-Right rotation |
| Right-heavy, right child left-heavy | Right-Left rotation |

### Balance Factor

\`balance(node) = height(left) - height(right)\`

- If balance > 1: left-heavy, needs right rotation(s)
- If balance < -1: right-heavy, needs left rotation(s)

### Problem

Implement an AVL tree with self-balancing insert. After each insertion, the tree should remain balanced.

### Complexity

All operations remain O(log n) guaranteed, unlike a plain BST which can degrade to O(n).`,
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

### Problem 1: Maximum Depth

Find the maximum depth (height) of a binary tree.

\`\`\`
    3
   / \\
  9  20
    /  \\
   15   7

max_depth -> 3
\`\`\`

### Problem 2: Lowest Common Ancestor (BST)

Given a BST and two node values, find their lowest common ancestor.

\`\`\`
        6
       / \\
      2   8
     / \\ / \\
    0  4 7  9

LCA(2, 8) -> 6
LCA(2, 4) -> 2
\`\`\`

### Problem 3: Validate BST

Determine if a binary tree is a valid BST.

### Key Insights

- **Max depth**: Recursively compute max(left_depth, right_depth) + 1
- **LCA in BST**: If both values < node, go left. If both > node, go right. Otherwise, current node is LCA.
- **Validate BST**: Track valid range (min, max) at each node`,
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
