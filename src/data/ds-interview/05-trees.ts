import { Module } from "../types";

export const treesModule: Module = {
  id: "ds-trees",
  title: "Trees",
  description: "Master binary trees, BSTs, traversals, and classic tree interview problems from LCA to serialization.",
  lessons: [
    {
      id: "trees-intro",
      slug: "intro-to-trees",
      title: "Intro to Trees",
      content: `## Intro to Trees

Trees are hierarchical data structures that appear in nearly every coding interview. Understanding tree terminology and the distinction between different tree types is essential before tackling tree problems.

### Core Terminology

- **Node**: An element in the tree containing a value and references to children.
- **Root**: The topmost node with no parent.
- **Leaf**: A node with no children.
- **Edge**: A connection between a parent and child.
- **Depth**: Number of edges from the root to a node.
- **Height**: Number of edges on the longest path from a node to a leaf.
- **Subtree**: A node and all its descendants.

### Binary Trees vs Binary Search Trees

A **binary tree** is any tree where each node has at most two children (left and right). There are no ordering constraints on the values.

A **binary search tree (BST)** adds an ordering invariant: for every node, all values in its left subtree are less than the node's value, and all values in its right subtree are greater. This invariant enables O(h) search, where h is the tree's height.

### Balanced vs Unbalanced

A **balanced** tree keeps its height at O(log n). Common self-balancing trees include AVL trees and Red-Black trees. In interviews, you rarely implement self-balancing, but you must recognize that an unbalanced BST can degrade to O(n) for all operations (essentially a linked list).

| Tree Type | Search | Insert | Delete |
|-----------|--------|--------|--------|
| BST (balanced) | O(log n) | O(log n) | O(log n) |
| BST (unbalanced) | O(n) | O(n) | O(n) |
| Binary Tree | O(n) | O(n) | O(n) |

### Node Representation in Python

\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
\`\`\`

### Interview Tips

1. Always clarify: Is it a BST or just a binary tree? The approach changes dramatically.
2. Most tree problems are naturally recursive — think about what each node needs from its children.
3. Base case is almost always \`if not node: return ...\`
4. Consider both recursive and iterative solutions — interviewers may ask for both.

In this exercise, build a BST from a list of values and implement basic size and height calculations.`,
      starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def insert_bst(root: TreeNode, val: int) -> TreeNode:
    """
    Insert a value into a BST and return the root.
    If root is None, create a new node.

    Time: O(h), Space: O(h) for recursion
    """
    # TODO: Base case — if root is None, return new TreeNode(val)
    # TODO: If val < root.val, recurse left
    # TODO: If val > root.val, recurse right
    # TODO: Return root
    pass


def tree_height(root: TreeNode) -> int:
    """
    Return the height of the tree (edges on longest root-to-leaf path).
    An empty tree has height -1, a single node has height 0.
    """
    # TODO: Base case — None returns -1
    # TODO: Recursively get left and right heights
    # TODO: Return 1 + max(left_height, right_height)
    pass


def tree_size(root: TreeNode) -> int:
    """Return the total number of nodes in the tree."""
    # TODO: Base case — None returns 0
    # TODO: Return 1 + size(left) + size(right)
    pass


# Test cases — build BST from list
values = [5, 3, 7, 1, 4, 6, 8]
root = None
for v in values:
    root = insert_bst(root, v)

print(tree_size(root))    # 7
print(tree_height(root))  # 2

# Unbalanced case
root2 = None
for v in [1, 2, 3, 4, 5]:
    root2 = insert_bst(root2, v)

print(tree_size(root2))    # 5
print(tree_height(root2))  # 4
`,
      solutionCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def insert_bst(root: TreeNode, val: int) -> TreeNode:
    """
    Insert a value into a BST and return the root.
    If root is None, create a new node.

    Time: O(h), Space: O(h) for recursion
    """
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert_bst(root.left, val)
    elif val > root.val:
        root.right = insert_bst(root.right, val)
    return root


def tree_height(root: TreeNode) -> int:
    """
    Return the height of the tree (edges on longest root-to-leaf path).
    An empty tree has height -1, a single node has height 0.
    """
    if not root:
        return -1
    return 1 + max(tree_height(root.left), tree_height(root.right))


def tree_size(root: TreeNode) -> int:
    """Return the total number of nodes in the tree."""
    if not root:
        return 0
    return 1 + tree_size(root.left) + tree_size(root.right)


# Test cases — build BST from list
values = [5, 3, 7, 1, 4, 6, 8]
root = None
for v in values:
    root = insert_bst(root, v)

print(tree_size(root))    # 7
print(tree_height(root))  # 2

# Unbalanced case
root2 = None
for v in [1, 2, 3, 4, 5]:
    root2 = insert_bst(root2, v)

print(tree_size(root2))    # 5
print(tree_height(root2))  # 4
`,
    },
    {
      id: "trees-traversals",
      slug: "binary-tree-traversals",
      title: "Binary Tree Traversals",
      content: `## Binary Tree Traversals

Tree traversals are the bread and butter of tree problems. Every tree question builds on your ability to visit nodes in a specific order. You need to know four traversal orders and be comfortable implementing each both recursively and iteratively.

### The Four Traversals

**Inorder (Left, Root, Right)**: Visits nodes in sorted order for a BST. This is the most commonly tested traversal because of the BST connection.

**Preorder (Root, Left, Right)**: Visits the root before its children. Useful for copying/serializing a tree — the first element is always the root.

**Postorder (Left, Right, Root)**: Visits children before the parent. Used when you need to process children before making a decision at the parent (e.g., calculating subtree sums, deleting a tree).

**Level-order (BFS)**: Visits nodes level by level using a queue. Essential for problems like "right side view," "zigzag traversal," or "maximum width."

### Recursive vs Iterative

Recursive traversals are elegant and easy to write, but they use O(h) stack space and can overflow on deep trees. Iterative versions use an explicit stack and are preferred in production code.

**Iterative inorder** uses a stack and a \`current\` pointer:
1. Push all left children onto the stack.
2. Pop a node, process it, then move to its right child.
3. Repeat until the stack is empty and current is None.

**Level-order** uses a queue (\`collections.deque\`):
1. Start with the root in the queue.
2. For each level, process all nodes at the current level.
3. Add their children to the queue for the next level.

### When to Use Which

| Traversal | Use Case |
|-----------|----------|
| Inorder | BST sorted order, kth smallest |
| Preorder | Serialize tree, copy tree |
| Postorder | Delete tree, subtree calculations |
| Level-order | Level-by-level processing, shortest path in tree |

### Interview Tips

- If asked for "iterative inorder," practice the stack-based approach until it is automatic.
- Level-order with level grouping (returning a list of lists) is extremely common.
- Morris traversal achieves O(1) space for inorder/preorder but is rarely required in interviews.

Implement all four traversals. Return values as lists.`,
      starterCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def inorder_recursive(root: TreeNode) -> list[int]:
    """Inorder traversal: Left, Root, Right."""
    # TODO: Base case — empty node returns []
    # TODO: Recursively traverse left, append root, traverse right
    pass


def inorder_iterative(root: TreeNode) -> list[int]:
    """Inorder traversal using an explicit stack."""
    # TODO: Use a stack and a current pointer
    # TODO: Push all left children, then pop and process,
    #       then move to right child
    pass


def preorder_iterative(root: TreeNode) -> list[int]:
    """Preorder traversal: Root, Left, Right using a stack."""
    # TODO: Push root onto stack
    # TODO: Pop, process, push right then left (so left is processed first)
    pass


def level_order(root: TreeNode) -> list[list[int]]:
    """
    Level-order traversal returning a list of lists,
    where each inner list contains values at that level.
    """
    # TODO: Use a deque, process level by level
    # TODO: For each level, record the size, process that many nodes
    # TODO: Append children for the next level
    pass


# Build test tree:
#        4
#       / \\
#      2   6
#     / \\ / \\
#    1  3 5  7
root = TreeNode(4)
root.left = TreeNode(2, TreeNode(1), TreeNode(3))
root.right = TreeNode(6, TreeNode(5), TreeNode(7))

print(inorder_recursive(root))   # [1, 2, 3, 4, 5, 6, 7]
print(inorder_iterative(root))   # [1, 2, 3, 4, 5, 6, 7]
print(preorder_iterative(root))  # [4, 2, 1, 3, 6, 5, 7]
print(level_order(root))         # [[4], [2, 6], [1, 3, 5, 7]]
`,
      solutionCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def inorder_recursive(root: TreeNode) -> list[int]:
    """Inorder traversal: Left, Root, Right."""
    if not root:
        return []
    return inorder_recursive(root.left) + [root.val] + inorder_recursive(root.right)


def inorder_iterative(root: TreeNode) -> list[int]:
    """Inorder traversal using an explicit stack."""
    result = []
    stack = []
    current = root

    while current or stack:
        # Push all left children
        while current:
            stack.append(current)
            current = current.left
        # Pop and process
        current = stack.pop()
        result.append(current.val)
        # Move to right subtree
        current = current.right

    return result


def preorder_iterative(root: TreeNode) -> list[int]:
    """Preorder traversal: Root, Left, Right using a stack."""
    if not root:
        return []
    result = []
    stack = [root]

    while stack:
        node = stack.pop()
        result.append(node.val)
        # Push right first so left is processed first
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)

    return result


def level_order(root: TreeNode) -> list[list[int]]:
    """
    Level-order traversal returning a list of lists,
    where each inner list contains values at that level.
    """
    if not root:
        return []
    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)
        level_vals = []
        for _ in range(level_size):
            node = queue.popleft()
            level_vals.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level_vals)

    return result


# Build test tree:
#        4
#       / \\
#      2   6
#     / \\ / \\
#    1  3 5  7
root = TreeNode(4)
root.left = TreeNode(2, TreeNode(1), TreeNode(3))
root.right = TreeNode(6, TreeNode(5), TreeNode(7))

print(inorder_recursive(root))   # [1, 2, 3, 4, 5, 6, 7]
print(inorder_iterative(root))   # [1, 2, 3, 4, 5, 6, 7]
print(preorder_iterative(root))  # [4, 2, 1, 3, 6, 5, 7]
print(level_order(root))         # [[4], [2, 6], [1, 3, 5, 7]]
`,
    },
    {
      id: "trees-bst-ops",
      slug: "bst-operations-validation",
      title: "BST Operations & Validation",
      content: `## BST Operations & Validation

The BST invariant — left subtree values < node < right subtree values — enables efficient search, insert, and delete. Understanding these operations and how to validate the BST property is fundamental.

### Search in a BST

BST search is elegant: compare the target with the current node, then go left or right. This eliminates half the remaining tree at each step, giving O(h) time.

\`\`\`
Search for 4 in BST rooted at 5:
5 → go left → 3 → go right → 4 → found!
\`\`\`

### Insert into a BST

Insertion follows the same path as search. When you reach a None position, that is where the new node goes. The tree structure determines the insertion point — you never need to shift elements like in an array.

### Delete from a BST

Deletion has three cases:
1. **Leaf node**: Simply remove it.
2. **One child**: Replace the node with its child.
3. **Two children**: Find the **inorder successor** (smallest node in right subtree), copy its value to the current node, then delete the successor.

The two-children case is the tricky one. The inorder successor is always a node with at most one child (it has no left child by definition), so deleting it reduces to case 1 or 2.

### Validating BST Property

A common mistake is checking only \`node.left.val < node.val < node.right.val\`. This misses violations deeper in the tree. The correct approach passes a valid range \`(min_val, max_val)\` down the recursion:

- The root can be anything: range is \`(-inf, +inf)\`.
- Left child must be in \`(min_val, parent.val)\`.
- Right child must be in \`(parent.val, max_val)\`.

If any node falls outside its range, the tree is not a valid BST.

### Complexity

All three operations are O(h) where h is the height. For a balanced BST, h = O(log n). For a skewed BST, h = O(n).

### Interview Tips

- Deletion is the most commonly asked BST operation — practice the three cases until they are automatic.
- "Validate BST" is a top-20 interview question. The range-based approach is clean and correct.
- Inorder traversal of a valid BST produces sorted output — this is an alternative validation method.

Implement BST search, delete, and validation.`,
      starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def search_bst(root: TreeNode, target: int) -> TreeNode:
    """
    Search for a value in BST. Return the node if found, None otherwise.
    Time: O(h)
    """
    # TODO: Base case — root is None or root.val == target
    # TODO: Go left if target < root.val, else go right
    pass


def delete_bst(root: TreeNode, key: int) -> TreeNode:
    """
    Delete a node with the given key from BST. Return the new root.

    Three cases:
    1. Leaf — remove it
    2. One child — replace with child
    3. Two children — replace with inorder successor
    """
    # TODO: Search for the node
    # TODO: Handle three deletion cases
    # TODO: For two children, find min in right subtree,
    #       copy its value, then delete the successor
    pass


def is_valid_bst(root: TreeNode) -> bool:
    """
    Validate whether a binary tree satisfies BST property.
    Use min/max range approach.
    """
    # TODO: Define helper with (node, min_val, max_val) parameters
    # TODO: Check node.val is within (min_val, max_val)
    # TODO: Recurse on left with updated max, right with updated min
    pass


# Helper to build BST
def insert_bst(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert_bst(root.left, val)
    elif val > root.val:
        root.right = insert_bst(root.right, val)
    return root


def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)


# Test cases
root = None
for v in [5, 3, 7, 1, 4, 6, 8]:
    root = insert_bst(root, v)

print(search_bst(root, 4).val)   # 4
print(search_bst(root, 9))       # None

root = delete_bst(root, 3)
print(inorder(root))  # [1, 4, 5, 6, 7, 8]

root = delete_bst(root, 5)
print(inorder(root))  # [1, 4, 6, 7, 8]

print(is_valid_bst(root))  # True

# Invalid BST
bad = TreeNode(5, TreeNode(1), TreeNode(4, TreeNode(3), TreeNode(6)))
print(is_valid_bst(bad))  # False
`,
      solutionCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def search_bst(root: TreeNode, target: int) -> TreeNode:
    """
    Search for a value in BST. Return the node if found, None otherwise.
    Time: O(h)
    """
    if not root or root.val == target:
        return root
    if target < root.val:
        return search_bst(root.left, target)
    return search_bst(root.right, target)


def delete_bst(root: TreeNode, key: int) -> TreeNode:
    """
    Delete a node with the given key from BST. Return the new root.

    Three cases:
    1. Leaf — remove it
    2. One child — replace with child
    3. Two children — replace with inorder successor
    """
    if not root:
        return None

    if key < root.val:
        root.left = delete_bst(root.left, key)
    elif key > root.val:
        root.right = delete_bst(root.right, key)
    else:
        # Found the node to delete
        # Case 1 & 2: No left child or no right child
        if not root.left:
            return root.right
        if not root.right:
            return root.left
        # Case 3: Two children — find inorder successor
        successor = root.right
        while successor.left:
            successor = successor.left
        root.val = successor.val
        root.right = delete_bst(root.right, successor.val)

    return root


def is_valid_bst(root: TreeNode) -> bool:
    """
    Validate whether a binary tree satisfies BST property.
    Use min/max range approach.
    """
    def helper(node, min_val, max_val):
        if not node:
            return True
        if node.val <= min_val or node.val >= max_val:
            return False
        return (helper(node.left, min_val, node.val) and
                helper(node.right, node.val, max_val))

    return helper(root, float('-inf'), float('inf'))


# Helper to build BST
def insert_bst(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert_bst(root.left, val)
    elif val > root.val:
        root.right = insert_bst(root.right, val)
    return root


def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)


# Test cases
root = None
for v in [5, 3, 7, 1, 4, 6, 8]:
    root = insert_bst(root, v)

print(search_bst(root, 4).val)   # 4
print(search_bst(root, 9))       # None

root = delete_bst(root, 3)
print(inorder(root))  # [1, 4, 5, 6, 7, 8]

root = delete_bst(root, 5)
print(inorder(root))  # [1, 4, 6, 7, 8]

print(is_valid_bst(root))  # True

# Invalid BST
bad = TreeNode(5, TreeNode(1), TreeNode(4, TreeNode(3), TreeNode(6)))
print(is_valid_bst(bad))  # False
`,
    },
    {
      id: "trees-lca",
      slug: "lowest-common-ancestor",
      title: "Lowest Common Ancestor",
      content: `## Lowest Common Ancestor

The Lowest Common Ancestor (LCA) of two nodes p and q is the deepest node that is an ancestor of both. LCA problems appear frequently in interviews and have different solutions depending on whether the tree is a BST or a general binary tree.

### LCA in a BST — O(h)

The BST property makes this elegant. Starting from the root:
- If both p and q are less than the current node, LCA is in the left subtree.
- If both are greater, LCA is in the right subtree.
- Otherwise, the current node is the split point — it is the LCA.

This works because the LCA is the first node where p and q diverge to different subtrees (or one of them equals the current node).

### LCA in a Binary Tree — O(n)

Without BST ordering, we need to search the entire tree. The classic recursive approach:
1. If the current node is None, return None.
2. If the current node is p or q, return it.
3. Recursively search left and right subtrees.
4. If both return non-None, the current node is the LCA.
5. If only one returns non-None, propagate that result up.

The key insight: if p is in the left subtree and q is in the right subtree (or vice versa), the current node must be their LCA.

### Why This Works

Consider any node in the tree. Exactly one of these is true:
- Both p and q are in its left subtree (LCA is deeper left).
- Both are in its right subtree (LCA is deeper right).
- One is in each subtree, or one equals the current node (current node is LCA).

The recursion naturally finds the deepest node where the targets "split."

### Edge Cases

- p or q might not exist in the tree — the basic algorithm assumes they do. If existence is not guaranteed, use a modified version that tracks whether both were found.
- p might be an ancestor of q (or vice versa) — the algorithm handles this correctly because we return immediately when we find p or q.

### Complexity

| Version | Time | Space |
|---------|------|-------|
| BST LCA | O(h) | O(h) recursive / O(1) iterative |
| Binary Tree LCA | O(n) | O(n) worst case |

Implement both BST LCA and general binary tree LCA.`,
      starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def lca_bst(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    """
    Find LCA in a BST. Both p and q are guaranteed to exist.

    Approach: Use BST property to find the split point.
    Time: O(h), Space: O(1) iterative
    """
    # TODO: Walk down the tree iteratively
    # TODO: If both values < root, go left
    # TODO: If both values > root, go right
    # TODO: Otherwise, current node is LCA
    pass


def lca_binary_tree(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    """
    Find LCA in a general binary tree. Both p and q exist in the tree.

    Approach: Recursive — find where p and q split.
    Time: O(n), Space: O(n)
    """
    # TODO: Base case — None or current is p or q
    # TODO: Recurse left and right
    # TODO: If both return non-None, current is LCA
    # TODO: Otherwise return whichever is non-None
    pass


# Build BST:
#        6
#       / \\
#      2   8
#     / \\ / \\
#    0  4 7  9
#      / \\
#     3   5
root = TreeNode(6)
root.left = TreeNode(2, TreeNode(0), TreeNode(4, TreeNode(3), TreeNode(5)))
root.right = TreeNode(8, TreeNode(7), TreeNode(9))

p, q = root.left, root.left.right  # nodes 2 and 4
print(lca_bst(root, p, q).val)     # 2

p, q = root.left, root.right       # nodes 2 and 8
print(lca_bst(root, p, q).val)     # 6

# General binary tree LCA (same tree)
p, q = root.left.right.left, root.left.right.right  # nodes 3 and 5
print(lca_binary_tree(root, p, q).val)  # 4

p, q = root.left.right.left, root.right.right  # nodes 3 and 9
print(lca_binary_tree(root, p, q).val)  # 6
`,
      solutionCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def lca_bst(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    """
    Find LCA in a BST. Both p and q are guaranteed to exist.

    Approach: Use BST property to find the split point.
    Time: O(h), Space: O(1) iterative
    """
    current = root
    while current:
        if p.val < current.val and q.val < current.val:
            current = current.left
        elif p.val > current.val and q.val > current.val:
            current = current.right
        else:
            return current
    return None


def lca_binary_tree(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    """
    Find LCA in a general binary tree. Both p and q exist in the tree.

    Approach: Recursive — find where p and q split.
    Time: O(n), Space: O(n)
    """
    # Base case
    if not root or root == p or root == q:
        return root

    left = lca_binary_tree(root.left, p, q)
    right = lca_binary_tree(root.right, p, q)

    # If both sides found something, current node is LCA
    if left and right:
        return root
    # Otherwise, return whichever side found something
    return left if left else right


# Build BST:
#        6
#       / \\
#      2   8
#     / \\ / \\
#    0  4 7  9
#      / \\
#     3   5
root = TreeNode(6)
root.left = TreeNode(2, TreeNode(0), TreeNode(4, TreeNode(3), TreeNode(5)))
root.right = TreeNode(8, TreeNode(7), TreeNode(9))

p, q = root.left, root.left.right  # nodes 2 and 4
print(lca_bst(root, p, q).val)     # 2

p, q = root.left, root.right       # nodes 2 and 8
print(lca_bst(root, p, q).val)     # 6

# General binary tree LCA (same tree)
p, q = root.left.right.left, root.left.right.right  # nodes 3 and 5
print(lca_binary_tree(root, p, q).val)  # 4

p, q = root.left.right.left, root.right.right  # nodes 3 and 9
print(lca_binary_tree(root, p, q).val)  # 6
`,
    },
    {
      id: "trees-serialize",
      slug: "serialize-deserialize-tree",
      title: "Serialize & Deserialize",
      content: `## Serialize & Deserialize a Binary Tree

Serialization converts a tree to a string so it can be stored or transmitted. Deserialization reconstructs the tree from that string. This is a classic hard-level interview question that tests your understanding of tree structure and traversal order.

### Why It Matters

In real systems, you need to save trees to disk, send them over a network, or store them in a database. The challenge is preserving the exact tree structure — not just the values but also the shape, including where null children are.

### Approach 1: Preorder with Null Markers

Use preorder traversal and mark null nodes with a sentinel (like "N" or "#"):

\`\`\`
Tree:     1
         / \\
        2   3
           / \\
          4   5

Serialized: "1,2,N,N,3,4,N,N,5,N,N"
\`\`\`

**Serialization**: Visit each node in preorder. Write the value, or "N" for null.

**Deserialization**: Read values one by one. Each value becomes a node. "N" means null. Recursively build left subtree, then right subtree. The preorder sequence guarantees the first value is the root.

### Approach 2: Level-Order (BFS)

Use BFS and record null children explicitly:

\`\`\`
Serialized: "1,2,3,N,N,4,5,N,N,N,N"
\`\`\`

**Serialization**: BFS traversal, writing each node's value or "N" for null children.

**Deserialization**: Read the root, then use a queue. For each node in the queue, read two values (left and right children). Add non-null children to the queue.

### Which Approach to Use

Both work. Preorder is more natural for recursive thinking. BFS is more intuitive visually. In interviews, pick whichever you can implement more cleanly.

### Edge Cases

- Empty tree: serialize as "" or "N", deserialize back to None.
- Single node: "1,N,N" for preorder.
- Negative values: make sure your delimiter does not conflict with minus signs.
- Very deep trees: iterative BFS avoids stack overflow.

### Complexity

Both approaches: O(n) time and O(n) space for serialization and deserialization.

Implement serialize and deserialize using the preorder approach.`,
      starterCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def serialize(root: TreeNode) -> str:
    """
    Serialize a binary tree to a comma-separated string.
    Use preorder traversal with 'N' for null nodes.

    Example: tree [1,2,3,null,null,4,5] -> "1,2,N,N,3,4,N,N,5,N,N"
    """
    # TODO: Base case — if node is None, return "N"
    # TODO: Return root.val + "," + serialize(left) + "," + serialize(right)
    pass


def deserialize(data: str) -> TreeNode:
    """
    Deserialize a string back into a binary tree.

    Approach: Split by comma, use an iterator/index to read values
    in preorder and recursively build the tree.
    """
    # TODO: Split data by comma into a list
    # TODO: Use an iterator (or index list) to track position
    # TODO: Define recursive helper:
    #   - Read next value
    #   - If "N", return None
    #   - Create node, recurse for left and right
    pass


def level_order_display(root: TreeNode) -> list:
    """Helper to display tree as level-order list for verification."""
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        node = queue.popleft()
        if node:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(None)
    # Remove trailing Nones
    while result and result[-1] is None:
        result.pop()
    return result


# Test cases
#     1
#    / \\
#   2   3
#      / \\
#     4   5
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3, TreeNode(4), TreeNode(5))

s = serialize(root)
print(s)  # "1,2,N,N,3,4,N,N,5,N,N"

restored = deserialize(s)
print(level_order_display(restored))  # [1, 2, 3, None, None, 4, 5]

# Empty tree
print(serialize(None))                          # "N"
print(deserialize("N"))                          # None

# Single node
print(serialize(TreeNode(42)))                   # "42,N,N"
print(level_order_display(deserialize("42,N,N")))  # [42]
`,
      solutionCode: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def serialize(root: TreeNode) -> str:
    """
    Serialize a binary tree to a comma-separated string.
    Use preorder traversal with 'N' for null nodes.

    Example: tree [1,2,3,null,null,4,5] -> "1,2,N,N,3,4,N,N,5,N,N"
    """
    if not root:
        return "N"
    return str(root.val) + "," + serialize(root.left) + "," + serialize(root.right)


def deserialize(data: str) -> TreeNode:
    """
    Deserialize a string back into a binary tree.

    Approach: Split by comma, use an iterator to read values
    in preorder and recursively build the tree.
    """
    tokens = iter(data.split(","))

    def build():
        val = next(tokens)
        if val == "N":
            return None
        node = TreeNode(int(val))
        node.left = build()
        node.right = build()
        return node

    return build()


def level_order_display(root: TreeNode) -> list:
    """Helper to display tree as level-order list for verification."""
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        node = queue.popleft()
        if node:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(None)
    # Remove trailing Nones
    while result and result[-1] is None:
        result.pop()
    return result


# Test cases
#     1
#    / \\
#   2   3
#      / \\
#     4   5
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3, TreeNode(4), TreeNode(5))

s = serialize(root)
print(s)  # "1,2,N,N,3,4,N,N,5,N,N"

restored = deserialize(s)
print(level_order_display(restored))  # [1, 2, 3, None, None, 4, 5]

# Empty tree
print(serialize(None))                          # "N"
print(deserialize("N"))                          # None

# Single node
print(serialize(TreeNode(42)))                   # "42,N,N"
print(level_order_display(deserialize("42,N,N")))  # [42]
`,
    },
    {
      id: "trees-balanced",
      slug: "balanced-bst-problems",
      title: "Balanced BST Problems",
      content: `## Balanced BST Problems

Balanced trees are critical for maintaining O(log n) operations. Two classic interview problems test your understanding: checking if a tree is height-balanced, and converting a sorted array into a balanced BST.

### What Is a Balanced Tree?

A binary tree is **height-balanced** if, for every node, the heights of its left and right subtrees differ by at most 1. This is the AVL balance condition.

### Checking Balance — O(n)

The naive approach computes height at every node, giving O(n log n). The optimal approach computes height bottom-up and short-circuits on imbalance:

1. Define a function that returns the height if balanced, or -1 if unbalanced.
2. Recursively check left and right subtrees.
3. If either returns -1 (unbalanced), propagate -1 up immediately.
4. If the height difference exceeds 1, return -1.
5. Otherwise, return the actual height.

This visits each node exactly once for O(n) time.

### Sorted Array to Balanced BST

Given a sorted array, construct a height-balanced BST. The approach uses the same idea as binary search:

1. The middle element becomes the root (this ensures balance).
2. Recursively build the left subtree from elements before the middle.
3. Recursively build the right subtree from elements after the middle.

This produces a tree with minimal height. For n elements, the height is floor(log2(n)).

### Why Middle Element?

Choosing the middle element puts roughly n/2 nodes on each side, guaranteeing balance. If you chose any other element, one side would be larger, potentially leading to imbalance.

### Sorted Linked List to BST

A harder variant uses a sorted linked list instead of an array. Since you cannot index into a linked list in O(1), you either:
- Convert to array first (O(n) space), or
- Use the "inorder simulation" technique: advance a list pointer during inorder construction.

### Complexity

| Problem | Time | Space |
|---------|------|-------|
| Check balanced | O(n) | O(h) |
| Sorted array to BST | O(n) | O(n) for tree + O(log n) recursion |

### Interview Tips

- The "return -1 for unbalanced" pattern is clean and efficient — much better than computing height separately.
- Sorted array to BST is often a follow-up to "validate BST" or "inorder traversal."
- Always verify your BST output with an inorder traversal — it should match the sorted input.

Implement both: check if balanced, and convert sorted array to BST.`,
      starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def is_balanced(root: TreeNode) -> bool:
    """
    Check if a binary tree is height-balanced.
    A tree is balanced if for every node, the height difference
    between left and right subtrees is at most 1.

    Time: O(n), Space: O(h)
    """
    # TODO: Define helper that returns height if balanced, -1 if not
    # TODO: Base case — None has height 0 (or -1 depending on convention)
    # TODO: If left or right returns -1, propagate -1
    # TODO: If abs(left - right) > 1, return -1
    # TODO: Otherwise return 1 + max(left, right)
    pass


def sorted_array_to_bst(nums: list[int]) -> TreeNode:
    """
    Convert a sorted array into a height-balanced BST.

    Approach: Pick middle element as root, recurse on halves.
    Time: O(n), Space: O(n)
    """
    # TODO: Base case — empty array returns None
    # TODO: Find middle index
    # TODO: Create root with middle element
    # TODO: Recursively build left from nums[:mid]
    # TODO: Recursively build right from nums[mid+1:]
    pass


def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)


def get_height(root):
    if not root:
        return 0
    return 1 + max(get_height(root.left), get_height(root.right))


# Test cases — check balanced
balanced = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))
print(is_balanced(balanced))  # True

unbalanced = TreeNode(1, TreeNode(2, TreeNode(3, TreeNode(4), None), None), None)
print(is_balanced(unbalanced))  # False

# Test cases — sorted array to BST
bst = sorted_array_to_bst([-10, -3, 0, 5, 9])
print(inorder(bst))       # [-10, -3, 0, 5, 9]
print(is_balanced(bst))   # True
print(get_height(bst))    # 3 (height of tree with 5 nodes)

bst2 = sorted_array_to_bst([1, 2, 3, 4, 5, 6, 7])
print(inorder(bst2))      # [1, 2, 3, 4, 5, 6, 7]
print(is_balanced(bst2))  # True
print(get_height(bst2))   # 3
`,
      solutionCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def is_balanced(root: TreeNode) -> bool:
    """
    Check if a binary tree is height-balanced.
    A tree is balanced if for every node, the height difference
    between left and right subtrees is at most 1.

    Time: O(n), Space: O(h)
    """
    def check_height(node):
        if not node:
            return 0
        left_h = check_height(node.left)
        if left_h == -1:
            return -1
        right_h = check_height(node.right)
        if right_h == -1:
            return -1
        if abs(left_h - right_h) > 1:
            return -1
        return 1 + max(left_h, right_h)

    return check_height(root) != -1


def sorted_array_to_bst(nums: list[int]) -> TreeNode:
    """
    Convert a sorted array into a height-balanced BST.

    Approach: Pick middle element as root, recurse on halves.
    Time: O(n), Space: O(n)
    """
    if not nums:
        return None
    mid = len(nums) // 2
    root = TreeNode(nums[mid])
    root.left = sorted_array_to_bst(nums[:mid])
    root.right = sorted_array_to_bst(nums[mid + 1:])
    return root


def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)


def get_height(root):
    if not root:
        return 0
    return 1 + max(get_height(root.left), get_height(root.right))


# Test cases — check balanced
balanced = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))
print(is_balanced(balanced))  # True

unbalanced = TreeNode(1, TreeNode(2, TreeNode(3, TreeNode(4), None), None), None)
print(is_balanced(unbalanced))  # False

# Test cases — sorted array to BST
bst = sorted_array_to_bst([-10, -3, 0, 5, 9])
print(inorder(bst))       # [-10, -3, 0, 5, 9]
print(is_balanced(bst))   # True
print(get_height(bst))    # 3 (height of tree with 5 nodes)

bst2 = sorted_array_to_bst([1, 2, 3, 4, 5, 6, 7])
print(inorder(bst2))      # [1, 2, 3, 4, 5, 6, 7]
print(is_balanced(bst2))  # True
print(get_height(bst2))   # 3
`,
    },
  ],
};
