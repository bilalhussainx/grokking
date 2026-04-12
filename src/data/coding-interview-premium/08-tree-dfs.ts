import { Module } from "../types";

export const treeDFSModule: Module = {
  id: "tree-dfs",
  title: "Tree DFS",
  description: "Master Depth-First Search (DFS) for tree problems. Learn recursive and iterative approaches for path-finding, sum problems, and tree traversal patterns.",
  lessons: [
    {
      id: "tree-dfs-intro",
      slug: "tree-dfs-intro",
      title: "Introduction to Tree DFS",
      content: `## The Tree DFS Pattern

**Depth-First Search (DFS)** explores as far as possible along each branch before backtracking. It is the foundational traversal pattern behind dozens of tree interview problems — path sums, diameter, lowest common ancestor, and more.

\`\`\`concept
{ "title": "DFS = Explore Deep, Then Backtrack", "variant": "analogy", "content": "Picture yourself in a maze. DFS says: pick a corridor and walk until you hit a dead end, then backtrack to the last junction and try the next corridor. In a tree, each node is a junction — you commit fully to the left subtree before the right subtree ever gets explored." }
\`\`\`

<!-- voice:section_check concept="DFS basic concept" -->

### The Three Traversal Orders

Where you *process* a node relative to its children determines the traversal order. The recursive skeleton is identical — only the placement of the work changes.

\`\`\`mermaid
graph TD
    A["A"] --> B["B"]
    A --> C["C"]
    B --> D["D"]
    B --> E["E"]
    C --> F["F"]
    C --> G["G"]
    style A fill:#339af0,color:#fff
    style B fill:#51cf66,color:#fff
    style C fill:#ffd93d,color:#000
    style D fill:#ff6b6b,color:#fff
    style E fill:#ff6b6b,color:#fff
    style F fill:#cc5de8,color:#fff
    style G fill:#cc5de8,color:#fff
\`\`\`

\`\`\`tabs
{ "tabs": [ { "label": "Pre-order", "icon": "🌳", "content": "**Root → Left → Right**\\n\\nVisit sequence: **A → B → D → E → C → F → G**\\n\\n\`\`\`python\\ndef preorder(node):\\n    if not node:\\n        return\\n    print(node.val)       # process FIRST\\n    preorder(node.left)\\n    preorder(node.right)\\n\`\`\`\\n\\n**Use when:** copying a tree, serialization, prefix expression evaluation. The root is always output before its subtrees." }, { "label": "In-order", "icon": "🔢", "content": "**Left → Root → Right**\\n\\nVisit sequence: **D → B → E → A → F → C → G**\\n\\n\`\`\`python\\ndef inorder(node):\\n    if not node:\\n        return\\n    inorder(node.left)\\n    print(node.val)       # process IN MIDDLE\\n    inorder(node.right)\\n\`\`\`\\n\\n**Use when:** a BST must yield values in sorted ascending order. In-order on a valid BST is guaranteed to produce a sorted sequence." }, { "label": "Post-order", "icon": "🍂", "content": "**Left → Right → Root**\\n\\nVisit sequence: **D → E → B → F → G → C → A**\\n\\n\`\`\`python\\ndef postorder(node):\\n    if not node:\\n        return\\n    postorder(node.left)\\n    postorder(node.right)\\n    print(node.val)       # process LAST\\n\`\`\`\\n\\n**Use when:** bottom-up computation — you need both children's results before computing the parent's. Classic for tree deletion, height, and diameter problems." } ] }
\`\`\`

### Watching Pre-order DFS in Action

<!-- voice:key_insight insight="DFS naturally follows the recursive structure of trees — solve for children first, then combine results" -->

Step through how the recursion visits each node, committing to the left branch entirely before touching the right:

\`\`\`algoviz
{ "title": "Pre-order DFS: A → B → D → E → C → F → G", "type": "tree", "data": ["A","B","C","D","E","F","G"], "frames": [ { "highlight": [0], "label": "Visit root A — process it, then recurse left", "stats": { "result": "A" } }, { "highlight": [1], "label": "Recurse left from A → visit B", "stats": { "result": "A, B" } }, { "highlight": [3], "label": "Recurse left from B → visit D (leaf, both children null)", "stats": { "result": "A, B, D" } }, { "highlight": [4], "label": "Backtrack to B → recurse right, visit E (leaf)", "stats": { "result": "A, B, D, E" } }, { "highlight": [2], "label": "Backtrack to A → recurse right, visit C", "stats": { "result": "A, B, D, E, C" } }, { "highlight": [5], "label": "Recurse left from C → visit F (leaf)", "stats": { "result": "A, B, D, E, C, F" } }, { "highlight": [6], "label": "Backtrack to C → recurse right, visit G (leaf) — all nodes visited!", "stats": { "result": "A, B, D, E, C, F, G" } } ], "speed": 900 }
\`\`\`

### Recursive vs. Iterative DFS

The recursive approach maps directly to the tree structure and is preferred in interviews. The iterative version uses an explicit stack — useful when you need to avoid call-stack overflow on very deep trees.

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Recursive (clean, idiomatic)", "code": "def dfs_preorder(node):\\n    if not node:\\n        return\\n    print(node.val)           # pre-order\\n    dfs_preorder(node.left)\\n    dfs_preorder(node.right)\\n\\n# Space: O(h) via implicit call stack\\n# Fails with RecursionError on very deep trees" }, "after": { "label": "Iterative (explicit stack)", "code": "def dfs_preorder(root):\\n    if not root:\\n        return\\n    stack = [root]\\n    while stack:\\n        node = stack.pop()        # LIFO — last in, first out\\n        print(node.val)           # pre-order\\n        if node.right:            # push right FIRST\\n            stack.append(node.right)\\n        if node.left:             # so left is popped first\\n            stack.append(node.left)\\n\\n# Space: O(h) via explicit stack\\n# Safe for arbitrarily deep trees" } }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why push right before left in iterative DFS?", "content": "A stack is **LIFO** — the last item pushed is the first popped. Pushing the right child before the left child ensures the left child sits on top of the stack and is processed first, preserving the same left-to-right order as the recursive approach." }
\`\`\`

### DFS vs. BFS — When to Choose

| Scenario | Use | Why |
|----------|-----|-----|
| Path from root to leaf | **DFS** | Naturally follows one path at a time |
| All paths in a tree | **DFS** | Backtracking explores every branch |
| Tree height / diameter | **DFS** | Needs bottom-up post-order |
| Shortest path / minimum depth | **BFS** | Processes level by level |
| Level-order output | **BFS** | Visits nodes layer by layer |

### Complexity

| Dimension | Value | Reason |
|-----------|-------|--------|
| **Time** | O(n) | Every node visited exactly once |
| **Space (balanced)** | O(log n) | Recursion depth = tree height ≈ log₂ n |
| **Space (skewed)** | O(n) | Worst case: tree shaped like a linked list, h = n |

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "Which traversal order visits nodes in sorted ascending order for a valid Binary Search Tree?", "options": ["Pre-order (Root → Left → Right)", "In-order (Left → Root → Right)", "Post-order (Left → Right → Root)", "Level-order (BFS)"], "answer": 1, "explanation": "In-order traversal visits the left subtree (all smaller values) before the root, then the right subtree (all larger values). On a valid BST this produces a sorted ascending sequence." }, { "question": "You want to compute the height of a binary tree. Which traversal order is the most natural fit?", "options": ["Pre-order — process root first", "In-order — process root in the middle", "Post-order — process root last", "Any order works equally well"], "answer": 2, "explanation": "Height = 1 + max(height(left), height(right)). You need both children's heights before you can compute the parent's height — that is exactly the post-order pattern: children first, then parent." }, { "question": "A balanced binary tree has 1,023 nodes. What is the maximum depth of the recursion stack during DFS?", "options": ["1,023", "511", "10", "1"], "answer": 2, "explanation": "Space complexity is O(h) where h is the height. A balanced tree with n nodes has h ≈ log₂ n. log₂(1023) ≈ 10. So the recursion stack grows at most 10 frames deep, not 1,023." }, { "question": "In the iterative DFS implementation, if you push the LEFT child before the RIGHT child onto the stack, what traversal order results?", "options": ["Pre-order (same as recursive)", "Reverse pre-order (Root → Right → Left)", "In-order", "Post-order"], "answer": 1, "explanation": "Pushing left first means right sits on top of the stack (LIFO) and is popped first. The result is Root → Right → Left — a mirror of standard pre-order. To get standard left-to-right pre-order, always push right before left." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "DFS dives to the deepest node before backtracking — implemented naturally with recursion or an explicit stack.", "Pre / In / Post-order differ only in when the current node is processed relative to recursing into children.", "In-order on a BST produces sorted output; Post-order is the pattern for bottom-up computations.", "Time is always O(n) — every node is visited once. Space is O(h): O(log n) for balanced trees, O(n) worst case.", "When a problem involves paths, path sums, or combining results from subtrees — DFS is your default first instinct." ] }
\`\`\``,
    },
    {
      id: "binary-tree-path-sum",
      slug: "binary-tree-path-sum",
      title: "Binary Tree Path Sum",
      content: `## Binary Tree Path Sum

<!-- voice:section_check concept="DFS for path existence" -->

Given a binary tree and a target sum, determine if the tree has a **root-to-leaf path** such that adding up all values along the path equals the target sum.

\`\`\`concept
{ "title": "The Core Insight", "variant": "mental-model", "content": "Think of DFS as sending a messenger down every branch of the tree. Each time the messenger steps onto a node, they subtract that node's value from their remaining budget. When they reach a leaf with exactly 0 remaining — the path exists. Pass the *remaining* sum downward, not the accumulated sum." }
\`\`\`

### The Example Tree

\`\`\`
         5
        / \\
       4   8
      /   / \\
     11  13  4
    / \\       \\
   7   2       1
\`\`\`

Target sum = **22**. The winning path: \`5 → 4 → 11 → 2\`.

At every node we ask: *"Can this subtree produce a path that sums to exactly what's left?"*

\`\`\`algoviz
{ "title": "DFS Path Sum — Tracing remainingSum = 22", "type": "tree", "data": { "val": 5, "left": { "val": 4, "left": { "val": 11, "left": { "val": 7, "left": null, "right": null }, "right": { "val": 2, "left": null, "right": null } }, "right": null }, "right": { "val": 8, "left": { "val": 13, "left": null, "right": null }, "right": { "val": 4, "left": null, "right": { "val": 1, "left": null, "right": null } } } }, "frames": [ { "highlight": [0], "label": "Visit root (5). Remaining = 22 − 5 = 17. Not a leaf — recurse left and right.", "stats": { "node": 5, "remaining": 17 } }, { "highlight": [1], "label": "Visit node (4). Remaining = 17 − 4 = 13. Not a leaf — recurse left.", "stats": { "node": 4, "remaining": 13 } }, { "highlight": [3], "label": "Visit node (11). Remaining = 13 − 11 = 2. Not a leaf — recurse left and right.", "stats": { "node": 11, "remaining": 2 } }, { "highlight": [7], "label": "Visit leaf (7). Remaining = 2 − 7 = −5. Leaf but remaining ≠ 0 → false. Backtrack.", "stats": { "node": 7, "remaining": -5 } }, { "highlight": [8], "label": "Visit leaf (2). Remaining = 2 − 2 = 0. Leaf AND remaining = 0 → TRUE! Path found.", "stats": { "node": 2, "remaining": 0 } } ], "speed": 900 }
\`\`\`

### The Algorithm

\`\`\`steps
{ "title": "DFS Path Sum — Step by Step", "steps": [ { "title": "Base case: empty node", "content": "If \`root\` is \`null\`, return \`false\`. An empty tree (or an exhausted branch) can never satisfy a path sum." }, { "title": "Base case: leaf node", "content": "If the current node has **no children**, check whether \`node.val === remainingSum\`. This is the only place a valid path can end." }, { "title": "Recursive case: internal node", "content": "Subtract \`node.val\` from \`remainingSum\` and recurse into **both** children. If **either** subtree returns \`true\`, the whole call returns \`true\` (logical OR)." }, { "title": "Why OR, not AND?", "content": "We only need **one** valid path — not paths in every direction. The moment one branch succeeds, we short-circuit and propagate \`true\` upward." } ] }
\`\`\`

<!-- voice:key_insight insight="Pass the remaining sum down the recursion; at leaf, check if remaining sum equals node value" -->

### Solution Code

\`\`\`tabs
{ "tabs": [ { "label": "Python", "icon": "🐍", "content": "\`\`\`python\\nclass Solution:\\n    def hasPathSum(self, root, targetSum: int) -> bool:\\n        if not root:\\n            return False\\n        # Leaf check\\n        if not root.left and not root.right:\\n            return root.val == targetSum\\n        remaining = targetSum - root.val\\n        return (self.hasPathSum(root.left, remaining) or\\n                self.hasPathSum(root.right, remaining))\\n\`\`\`" }, { "label": "JavaScript", "icon": "🟨", "content": "\`\`\`javascript\\nvar hasPathSum = function(root, targetSum) {\\n    if (!root) return false;\\n    // Leaf check\\n    if (!root.left && !root.right) {\\n        return root.val === targetSum;\\n    }\\n    const remaining = targetSum - root.val;\\n    return hasPathSum(root.left, remaining)\\n        || hasPathSum(root.right, remaining);\\n};\\n\`\`\`" }, { "label": "Java", "icon": "☕", "content": "\`\`\`java\\npublic boolean hasPathSum(TreeNode root, int targetSum) {\\n    if (root == null) return false;\\n    // Leaf check\\n    if (root.left == null && root.right == null) {\\n        return root.val == targetSum;\\n    }\\n    int remaining = targetSum - root.val;\\n    return hasPathSum(root.left, remaining)\\n        || hasPathSum(root.right, remaining);\\n}\\n\`\`\`" } ] }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Leaf vs. Internal Node", "content": "The leaf check (\`!root.left && !root.right\`) is essential. Without it, you'd accept paths that end at internal nodes — which the problem explicitly forbids. A path **must** terminate at a leaf." }
\`\`\`

### Iterative Approach (Interview Bonus)

\`\`\`concept
{ "title": "Stack-based DFS", "variant": "insight", "content": "Push \`(node, remainingSum)\` pairs onto a stack. This avoids recursion overhead and is immune to stack-overflow on very deep, skewed trees. Same O(n) time and O(h) space — but explicit." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Iterative Implementation", "content": "\`\`\`python\\ndef hasPathSum(root, targetSum):\\n    if not root:\\n        return False\\n    stack = [(root, targetSum)]\\n    while stack:\\n        node, remaining = stack.pop()\\n        # Leaf with matching sum\\n        if not node.left and not node.right and node.val == remaining:\\n            return True\\n        r = remaining - node.val\\n        if node.right:\\n            stack.append((node.right, r))\\n        if node.left:\\n            stack.append((node.left, r))\\n    return False\\n\`\`\`\\n\\nNote: push **right** before **left** so the left branch is processed first (LIFO), matching the feel of the recursive version." }
\`\`\`

### Complexity Analysis

| | Complexity | Reason |
|---|---|---|
| **Time** | O(n) | Every node visited at most once |
| **Space** | O(h) | Recursion stack depth = tree height |
| Worst case space | O(n) | Completely skewed tree (h = n) |
| Best case space | O(log n) | Balanced tree (h = log n) |

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "What does the function return when it reaches a null node?", "options": ["true — null means the path ended cleanly", "false — a null node can never be part of a valid path", "targetSum — pass it back up", "0 — contribute nothing to the sum"], "answer": 1, "explanation": "Null means we ran off the edge of the tree without finding a leaf. No valid root-to-leaf path can end at null, so we return false." }, { "question": "For a balanced binary tree with n nodes, what is the space complexity of the recursive solution?", "options": ["O(n) always", "O(log n) — because height of a balanced tree is log n", "O(1) — tail recursion is optimized", "O(n²) — we explore every path"], "answer": 1, "explanation": "Space is O(h) where h is the tree height. For a balanced tree, h = log n. For a skewed tree, h = n, giving O(n) worst case." }, { "question": "Why do we use logical OR (\`||\`) rather than AND (\`&&\`) when combining recursive calls?", "options": ["AND would cause infinite recursion", "We need BOTH subtrees to have a valid path", "We only need ONE valid root-to-leaf path to exist", "OR is faster at runtime"], "answer": 2, "explanation": "The problem asks if ANY root-to-leaf path sums to the target. If the left subtree has a valid path, we're done — no need to search the right. OR short-circuits as soon as one branch succeeds." }, { "question": "Consider this tree: root=1, left=2. targetSum=1. What does hasPathSum return?", "options": ["true — root.val equals targetSum", "false — node 1 is not a leaf, so the path isn't complete", "true — path 1 exists as a single node", "Error — invalid tree"], "answer": 1, "explanation": "Node 1 has a left child (2), so it is NOT a leaf. The path must continue to a leaf. The only leaf is node 2, giving path sum 1+2=3 ≠ 1, so the answer is false." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Pass \`remainingSum\` (decreasing) downward — check \`node.val === remainingSum\` only at leaves, not internal nodes.", "Two base cases: null node → false; leaf node → check if val equals remaining sum.", "Use logical OR on recursive calls — one valid path is sufficient to return true.", "Time: O(n) since every node is visited once. Space: O(h) for the recursion stack — O(log n) balanced, O(n) worst case.", "The iterative stack approach using \`(node, remaining)\` pairs is equivalent and avoids deep recursion in skewed trees." ] }
\`\`\``,
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

Given a binary tree and a target sum, find **all root-to-leaf paths** where each path's node values sum exactly to the target.

**Example:** \`targetSum = 22\` — two valid paths exist in this tree:

\`\`\`mermaid
graph TD
    A["5"] --> B["4"]
    A --> C["8"]
    B --> D["11"]
    C --> E["13"]
    C --> F["4"]
    D --> G["7"]
    D --> H["2 ✓"]
    F --> I["5 ✓"]
    F --> J["1"]
    style H fill:#22c55e,color:#fff
    style I fill:#22c55e,color:#fff
\`\`\`

Output: \`[[5, 4, 11, 2], [5, 8, 4, 5]]\`

---

\`\`\`concept
{ "title": "DFS + Backtracking: Explore and Undo", "variant": "mental-model", "content": "Think of DFS path-finding like hiking with a notepad. Before stepping onto a trail fork, you write down your current position. You explore one branch completely, then erase back to that fork and explore the other. The 'erase' step is backtracking — and it's the key to collecting all valid paths without allocating a new list at every node." }
\`\`\`

\`\`\`steps
{ "title": "Algorithm: DFS with Backtracking", "steps": [ { "title": "Start DFS from root", "content": "Call \`dfs(node, path, remaining)\` with the root, an empty path list, and \`targetSum\` as the initial remaining value." }, { "title": "Visit the node — append and subtract", "content": "Append \`node.val\` to \`path\` and subtract it from \`remaining\`. \`remaining\` now represents how much more sum is needed to hit the target." }, { "title": "Check the leaf condition", "content": "If the current node is a leaf (no children) **and** \`remaining == 0\`, a valid path is found. Append a **copy** of \`path\` — \`list(path)\` — to results. This snapshot is critical: the shared \`path\` list will be mutated as we backtrack." }, { "title": "Recurse on both children", "content": "Call \`dfs\` on the left child, then the right child. Both calls share the same \`path\` list and see the updated \`remaining\`." }, { "title": "Backtrack — undo the visit", "content": "After both recursive calls return, call \`path.pop()\`. This removes the current node's value and restores \`path\` to its pre-visit state, ready for the next branch up the tree." } ] }
\`\`\`

<!-- voice:key_insight insight="Use backtracking: add node to path when recursing down, remove when backtracking up" -->

Now let's watch the algorithm trace the first valid path through the tree:

\`\`\`trace
{ "title": "Trace: Discovering [5, 4, 11, 2] (targetSum = 22)", "language": "python", "code": "def dfs(node, path, remaining):\\n    if not node:\\n        return\\n    path.append(node.val)\\n    remaining -= node.val\\n    if not node.left and not node.right and remaining == 0:\\n        results.append(list(path))\\n    dfs(node.left, path, remaining)\\n    dfs(node.right, path, remaining)\\n    path.pop()", "frames": [ { "line": 4, "vars": {"node.val": 5, "path": [], "remaining": 22}, "note": "Enter root node 5. Append to path." }, { "line": 5, "vars": {"node.val": 5, "path": [5], "remaining": 22}, "note": "Subtract 5. remaining = 17." }, { "line": 4, "vars": {"node.val": 4, "path": [5], "remaining": 17}, "note": "Recurse left to node 4. Append." }, { "line": 5, "vars": {"node.val": 4, "path": [5, 4], "remaining": 17}, "note": "Subtract 4. remaining = 13." }, { "line": 4, "vars": {"node.val": 11, "path": [5, 4], "remaining": 13}, "note": "Recurse left to node 11. Append." }, { "line": 5, "vars": {"node.val": 11, "path": [5, 4, 11], "remaining": 13}, "note": "Subtract 11. remaining = 2." }, { "line": 10, "vars": {"node.val": 11, "path": [5, 4, 11, 7], "remaining": -5}, "note": "Leaf 7: remaining = 2-7 = -5 ≠ 0. No match. Backtrack: pop 7." }, { "line": 4, "vars": {"node.val": 2, "path": [5, 4, 11], "remaining": 2}, "note": "Recurse right to leaf 2. Append." }, { "line": 5, "vars": {"node.val": 2, "path": [5, 4, 11, 2], "remaining": 2}, "note": "Subtract 2. remaining = 0!" }, { "line": 7, "vars": {"node.val": 2, "path": [5, 4, 11, 2], "remaining": 0}, "note": "Leaf node AND remaining == 0 → snapshot and store!", "stdout": "results = [[5, 4, 11, 2]]" }, { "line": 10, "vars": {"node.val": 2, "path": [5, 4, 11, 2], "remaining": 0}, "note": "Backtrack: pop 2. Path restored to [5, 4, 11]. DFS will continue right subtree next." } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Always copy the path — never store a reference", "content": "When you find a valid path, always store \`list(path)\`, never \`path\` itself. Since \`path\` is a shared mutable list that gets modified by \`pop()\` as DFS unwinds, storing a direct reference means every entry in results will point to the same empty list by the time DFS completes." }
\`\`\`

### Implementation

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Two common bugs", "code": "def dfs(node, path, remaining):\\n    if not node:\\n        return\\n    path.append(node.val)\\n    remaining -= node.val\\n    if not node.left and not node.right and remaining == 0:\\n        results.append(path)    # BUG 1: reference, not a copy\\n    dfs(node.left, path, remaining)\\n    dfs(node.right, path, remaining)\\n    # BUG 2: missing path.pop() — path grows forever" }, "after": { "label": "Correct DFS + backtrack", "code": "def dfs(node, path, remaining):\\n    if not node:\\n        return\\n    path.append(node.val)\\n    remaining -= node.val\\n    if not node.left and not node.right and remaining == 0:\\n        results.append(list(path))  # snapshot copy\\n    dfs(node.left, path, remaining)\\n    dfs(node.right, path, remaining)\\n    path.pop()                      # backtrack" } }
\`\`\`

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity Analysis

\`\`\`tabs
{ "tabs": [ { "label": "Time Complexity", "icon": "⏱️", "content": "**O(N²) worst case.**\\n\\nWe visit each of the N nodes exactly once — O(N). But when we find a valid path, we copy it into results at cost O(H) per copy (H = tree height). With K valid paths, copying costs O(K · H) total.\\n\\n| Tree shape | K | H | Total |\\n|---|---|---|---|\\n| Caterpillar (worst) | O(N) | O(N) | **O(N²)** |\\n| Balanced | O(N) | O(log N) | O(N log N) |\\n| Straight chain | O(1) | O(N) | O(N) |\\n\\nThe O(N²) worst case comes from caterpillar-shaped trees — a long spine where each node has exactly one leaf child." }, { "label": "Space Complexity", "icon": "💾", "content": "**O(N²) worst case.**\\n\\n- **Recursion stack:** O(H)\\n- **Current path list:** O(H)\\n- **Stored results:** K paths of up to length H = O(K · H)\\n\\nIn the caterpillar-tree worst case, K and H are both O(N), so the results array alone consumes O(N²) space.\\n\\nNote: the recursion stack and current path together are only O(H) — it's the output size that drives the quadratic bound." } ] }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "Why must \`path.pop()\` be called after both recursive calls return?", "options": [ "To free memory and prevent a stack overflow", "To undo the current node's addition before DFS moves to a sibling or parent branch", "To signal to the parent call that no valid path was found in this subtree", "To reset the remaining sum to its value before this node was visited" ], "answer": 1, "explanation": "path.pop() is the backtrack step. It removes the current node from the shared path list, restoring path to its state before this node was visited. Without it, the path would accumulate values from every branch rather than reflecting only the current root-to-node route." }, { "question": "Why do we write \`results.append(list(path))\` instead of \`results.append(path)\`?", "options": [ "list() is faster than slice notation for copying", "path is a set and must be converted to a list for JSON serialization", "path is a shared mutable list — storing a reference means all results reflect path's final state (empty) after DFS unwinds", "The results list only accepts list type, not other iterables" ], "answer": 2, "explanation": "path is one list object shared across all recursive calls. It's continuously modified by append and pop as DFS runs. Storing a reference with results.append(path) means every entry in results will point to the same list — which will be empty once DFS finishes. list(path) creates an independent snapshot at the exact moment a valid path is found." }, { "question": "What is the worst-case time complexity, and what tree shape causes it?", "options": [ "O(N) — we visit each node exactly once regardless of shape", "O(N log N) — balanced binary tree with height log N", "O(N²) — caterpillar tree where both K (valid paths) and H (height) are O(N)", "O(2^N) — exponential due to branching at each node" ], "answer": 2, "explanation": "O(N²) in the worst case. We visit N nodes (O(N)) and copy each valid path into results (O(H) per copy, K copies = O(K·H)). A caterpillar tree — a spine of N/2 nodes each with one leaf child — maximizes both K and H to O(N), yielding O(N²) total." }, { "question": "At which nodes do we check for a valid path and potentially record results?", "options": [ "Any node where the running sum equals targetSum", "Only the root node, before recursing", "Only leaf nodes (no children) where remaining equals 0", "Every node at depth greater than 1" ], "answer": 2, "explanation": "We only record a path at leaf nodes. A non-leaf node might have remaining == 0, but the problem requires root-to-leaf paths — we must keep traversing until we hit a node with no children. Stopping early would yield paths that don't extend to a leaf." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "DFS + backtracking: append node.val before recursing, then pop it after both recursive calls return — this keeps a single shared path list accurate at all times.", "Always store list(path) — a copy — when you find a valid path. Storing path directly gives you a reference to a list that will be empty once DFS unwinds.", "Only record results at leaf nodes (no left and no right child) where remaining == 0. Root-to-leaf means the path must reach a node with no children.", "Time and space complexity are both O(N²) worst case due to path copying, not O(N) — the output size dominates.", "The push-recurse-pop backtracking template applies broadly: any problem asking for all root-to-leaf paths, all paths summing to a target, or path enumeration in a graph uses the same structure." ] }
\`\`\``,
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

Each root-to-leaf path in this digit tree spells out a number — the root contributes the most significant digit, the leaf contributes the least. You can only read one digit at a time, top to bottom, so you build the number incrementally as you descend.

The key operation is a **decimal shift**: moving from a parent to a child pushes all collected digits one place to the left and appends the new digit.

\`\`\`concept
{
  "title": "The Decimal Shift Mental Model",
  "variant": "mental-model",
  "content": "Think of cur as a running odometer. Each time you step to a child node, you multiply by 10 (shift left) and add the child's digit:\\n\\n  cur = cur × 10 + node.val\\n\\nBy the time you reach a leaf, the odometer displays the complete path number. Example: root=1, left child=2 → 0×10+1=1, then 1×10+2=12."
}
\`\`\`

### Problem Statement

Given a binary tree where every node holds a single digit (0–9), each root-to-leaf path represents an integer. Return the **total sum** of all root-to-leaf numbers.

**Example 1 — tree \`[1, 2, 3]\`:**

\`\`\`
    1
   / \\
  2   3
\`\`\`

Paths: \`12\`, \`13\` → Sum = **25**

**Example 2 — tree \`[4, 9, 0, 5, 1]\`:**

\`\`\`
      4
     / \\
    9   0
   / \\
  5   1
\`\`\`

Paths: \`495\`, \`491\`, \`40\` → Sum = **1026**

### Visualising the Traversal

\`\`\`algoviz
{
  "title": "DFS on [1, 2, 3] — Accumulating Path Numbers",
  "type": "tree",
  "data": [1, 2, 3],
  "frames": [
    { "highlight": [0], "label": "Visit root node 1. cur = 0×10 + 1 = 1", "stats": { "cur": 1, "total": 0 } },
    { "highlight": [1], "label": "Go left → node 2. cur = 1×10 + 2 = 12", "stats": { "cur": 12, "total": 0 } },
    { "highlight": [1], "label": "Node 2 is a leaf — path number 12 is complete. Add to total.", "stats": { "cur": 12, "total": 12 } },
    { "highlight": [0], "label": "Backtrack to root. cur = 1 again for the right branch.", "stats": { "cur": 1, "total": 12 } },
    { "highlight": [2], "label": "Go right → node 3. cur = 1×10 + 3 = 13", "stats": { "cur": 13, "total": 12 } },
    { "highlight": [2], "label": "Node 3 is a leaf — path number 13 is complete. Add to total.", "stats": { "cur": 13, "total": 25 } },
    { "highlight": [0], "label": "All paths explored. Total = 12 + 13 = 25 ✓", "stats": { "cur": 0, "total": 25 } }
  ],
  "speed": 900
}
\`\`\`

### Algorithm

\`\`\`steps
{
  "title": "DFS Algorithm for Sum of Path Numbers",
  "steps": [
    {
      "title": "Start DFS with cur = 0",
      "content": "Call \`dfs(root, 0)\`. The second argument carries the accumulated number for this path. Starting at 0 means no digits have been collected yet — the first real digit will be added at the root."
    },
    {
      "title": "Update the running number at each node",
      "content": "Compute \`cur = cur * 10 + node.val\`. This shifts all previously collected digits one decimal place left and appends the current digit. Arriving at node 9 with cur=4: 4×10+9=49."
    },
    {
      "title": "Leaf node — return the complete path number",
      "content": "A leaf has no children (\`not node.left and not node.right\`). The value in \`cur\` is the finished path number. Return it so it bubbles up into the running total."
    },
    {
      "title": "Internal node — sum both subtrees",
      "content": "Return \`dfs(node.left, cur) + dfs(node.right, cur)\`. Both recursive calls receive the same \`cur\`, independently extending the partial number down each branch."
    },
    {
      "title": "Null node — return 0",
      "content": "If \`node\` is \`None\`, return 0. This base case handles missing children cleanly: adding 0 to the caller's sum has no effect, which is exactly right."
    }
  ]
}
\`\`\`

<!-- voice:key_insight insight="Build the number as you traverse: new_number = current * 10 + node.val" -->

### Common Mistake to Avoid

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Wrong — adds digit values, not path numbers",
    "code": "def dfs(node, total):\\n    if not node:\\n        return\\n    total += node.val       # Adds 1+2=3, not 12\\n    if not node.left and not node.right:\\n        result.append(total)\\n    dfs(node.left, total)\\n    dfs(node.right, total)\\n# For tree [1,2,3]: collects 3 and 4, returns 7 (WRONG)"
  },
  "after": {
    "label": "Correct — builds the decimal number with x10 shift",
    "code": "def dfs(node, cur):\\n    if not node:\\n        return 0\\n    cur = cur * 10 + node.val   # 0 -> 1 -> 12 or 0 -> 1 -> 13\\n    if not node.left and not node.right:\\n        return cur              # Leaf: return complete path number\\n    return dfs(node.left, cur) + dfs(node.right, cur)\\n# For tree [1,2,3]: returns 12 + 13 = 25 (CORRECT)"
  }
}
\`\`\`

### Full Implementation

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`playground
{
  "title": "Sum of Path Numbers — Run the Solution",
  "language": "python",
  "code": "class TreeNode:\\n    def __init__(self, val=0, left=None, right=None):\\n        self.val = val\\n        self.left = left\\n        self.right = right\\n\\nclass Solution:\\n    def sumNumbers(self, root):\\n        def dfs(node, cur):\\n            if not node:\\n                return 0\\n            cur = cur * 10 + node.val\\n            if not node.left and not node.right:\\n                return cur\\n            return dfs(node.left, cur) + dfs(node.right, cur)\\n        return dfs(root, 0)\\n\\n# Example 1: [1, 2, 3] -> expected 25\\nroot = TreeNode(1, TreeNode(2), TreeNode(3))\\nprint(Solution().sumNumbers(root))\\n\\n# Example 2: [4, 9, 0, 5, 1] -> expected 1026\\nroot2 = TreeNode(4)\\nroot2.left = TreeNode(9, TreeNode(5), TreeNode(1))\\nroot2.right = TreeNode(0)\\nprint(Solution().sumNumbers(root2))",
  "runnable": true
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Iterative Version for Deep Trees",
  "content": "Python's default recursion limit is ~1000. For a pathologically skewed tree, prefer an iterative stack:\\n\\n\`\`\`\\nstack = [(root, 0)]   # (node, cur)\\nwhile stack:\\n    node, cur = stack.pop()\\n    cur = cur * 10 + node.val\\n    if not node.left and not node.right:\\n        total += cur\\n    if node.right: stack.append((node.right, cur))\\n    if node.left:  stack.append((node.left, cur))\\n\`\`\`\\n\\nSame O(n) time and O(h) space — just trades the call stack for an explicit one."
}
\`\`\`

### Complexity

| | Complexity | Reason |
|---|---|---|
| **Time** | O(n) | Every node is visited exactly once |
| **Space** | O(h) | Recursion stack depth = tree height: O(log n) balanced, O(n) skewed |

### Knowledge Check

\`\`\`quiz
{
  "title": "Sum of Path Numbers — Check Your Understanding",
  "questions": [
    {
      "question": "When DFS visits node 9 with cur = 4, what does cur become after the update?",
      "options": ["4 + 9 = 13", "4 × 9 = 36", "4 × 10 + 9 = 49", "9"],
      "answer": 2,
      "explanation": "The formula is cur = cur × 10 + node.val. Multiplying by 10 shifts the existing digit one decimal place left (units → tens), then the new digit fills the units position. So 4 × 10 + 9 = 49, representing the partial path '49'."
    },
    {
      "question": "For tree [4, 9, 0, 5, 1], which calculation gives the correct sum of 1026?",
      "options": [
        "4+9+5=18, 4+9+1=14, 4+0=4 → sum 36",
        "495 + 491 + 40 = 1026",
        "45 + 41 + 40 = 126",
        "495 + 491 = 986"
      ],
      "answer": 1,
      "explanation": "The three root-to-leaf paths are 4→9→5 (path number 495), 4→9→1 (path number 491), and 4→0 (path number 40). The node 0 is a leaf because it has no children. Sum = 495 + 491 + 40 = 1026."
    },
    {
      "question": "Why does the DFS function return 0 for a null node?",
      "options": [
        "To avoid an AttributeError when accessing node.val on None",
        "Because null nodes contribute no path number — 0 leaves the caller's sum unchanged",
        "Both of the above",
        "To signal the parent that this branch had no valid paths"
      ],
      "answer": 2,
      "explanation": "Returning 0 serves two purposes simultaneously: it prevents crashing on None.val, and it adds nothing to the running total — both correct behaviours for a non-existent subtree."
    },
    {
      "question": "A perfectly balanced binary tree has 15 nodes. What is the space complexity of this DFS?",
      "options": ["O(15) = O(n)", "O(4) = O(log n)", "O(1)", "O(15 × 4) = O(n log n)"],
      "answer": 1,
      "explanation": "Space is O(h) where h is the tree height. For 15 nodes in a balanced tree, h = log₂(15) ≈ 4. The recursion stack holds at most h frames at any time — one per level from root to the current leaf."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The decimal-shift formula cur = cur × 10 + node.val builds the path number one digit at a time as you descend — multiply to shift left, add to append.",
    "Return cur at leaf nodes (complete path number) and 0 at null nodes; the caller sums both children's returns naturally.",
    "DFS is the right tool because it fully explores one root-to-leaf path before backtracking — matching the problem's structure exactly.",
    "Time is O(n) — every node visited once. Space is O(h): O(log n) for balanced trees, O(n) for skewed trees.",
    "The iterative version pairs each stack entry with its accumulated number — stack = [(node, cur)] — and avoids Python's recursion depth limit for extreme inputs."
  ]
}
\`\`\``,
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

You've seen DFS find path sums — now the target isn't a sum but an **exact ordered sequence**. Every node along the root-to-leaf path must match the sequence in position order. One mismatch anywhere means that path fails.

\`\`\`concept
{ "title": "Sequence Matching via Index Tracking", "variant": "mental-model", "content": "Carry an index into the sequence alongside the DFS. At each node, check sequence[index] == node.val. At a leaf, the path is valid only if index has reached the last position. Return early (false) on any mismatch — you never need to explore further down that branch." }
\`\`\`

---

### Problem Statement

Given a binary tree and a number sequence, determine whether the sequence appears as a **root-to-leaf path** in the tree. The match must be exact: same values, same order, from root all the way to a leaf node.

\`\`\`tabs
{ "tabs": [
  { "label": "Example 1 — Match", "icon": "✅", "content": "**Tree:**\\n\`\`\`\\n        1\\n       / \\\\\\n      2   3\\n     / \\\\\\n    4   5\\n\`\`\`\\n**Sequence:** \`[1, 2, 5]\`\\n\\n**Output:** \`True\`\\n\\nPath \`1 → 2 → 5\` hits a leaf and consumes the full sequence." },
  { "label": "Example 2 — No Match", "icon": "❌", "content": "**Same tree, different sequence:** \`[1, 3, 5]\`\\n\\n**Output:** \`False\`\\n\\nNode \`3\` is a child of \`1\`, but \`3\` has no child with value \`5\`. The path \`1 → 3\` ends at a leaf before the sequence is consumed." },
  { "label": "Edge Cases", "icon": "🔍", "content": "- **Sequence longer than any path:** returns \`False\` — sequence index will never reach its last element at any leaf.\\n- **Sequence shorter than path depth:** returns \`False\` — you'd hit a leaf before exhausting the sequence, so the index check fails.\\n- **Empty tree / null root:** returns \`False\` immediately.\\n- **Single-node tree, sequence = [val]:** returns \`True\` — root is also a leaf." }
] }
\`\`\`

---

### The Algorithm

\`\`\`steps
{ "title": "DFS Sequence Match — Step by Step", "steps": [
  { "title": "Guard: null node or value mismatch", "content": "If the current node is \`null\`, return \`False\`. If \`node.val != sequence[index]\`, return \`False\` immediately — no need to explore this subtree further." },
  { "title": "Guard: leaf with full sequence consumed", "content": "If the node is a leaf (\`left == null\` and \`right == null\`) **and** \`index == len(sequence) - 1\`, return \`True\`. Both conditions are required — reaching a leaf too early (index not at end) is a failure." },
  { "title": "Recurse on children", "content": "Call DFS on the left child with \`index + 1\`, and on the right child with \`index + 1\`. Return \`True\` if either returns \`True\`." }
] }
\`\`\`

---

### Algorithm Visualization

Watch DFS walk sequence \`[1, 2, 5]\` through the tree. Note how the branch \`1 → 2 → 4\` fails at the leaf (index = 2 but node = 4, not 5).

\`\`\`algoviz
{ "title": "DFS Tracing Sequence [1, 2, 5]", "type": "tree", "data": { "val": 1, "left": { "val": 2, "left": { "val": 4, "left": null, "right": null }, "right": { "val": 5, "left": null, "right": null } }, "right": { "val": 3, "left": null, "right": null } }, "frames": [
  { "highlight": ["root"], "label": "Visit node 1. sequence[0]=1 ✓. Not a leaf, recurse.", "stats": { "index": 0, "node": 1, "match": "✓" } },
  { "highlight": ["root.left"], "label": "Visit node 2. sequence[1]=2 ✓. Not a leaf, recurse.", "stats": { "index": 1, "node": 2, "match": "✓" } },
  { "highlight": ["root.left.left"], "label": "Visit node 4. sequence[2]=5 ≠ 4 ✗. Mismatch — prune this branch.", "stats": { "index": 2, "node": 4, "match": "✗" } },
  { "highlight": ["root.left.right"], "label": "Backtrack. Visit node 5. sequence[2]=5 ✓. Leaf reached and index at end — PATH FOUND!", "stats": { "index": 2, "node": 5, "match": "✓ LEAF" } }
], "speed": 900 }
\`\`\`

---

### Implementation

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Common mistake — leaf check is wrong", "code": "def find_path(node, seq, idx):\\n    if not node:\\n        return False\\n    if node.val != seq[idx]:\\n        return False\\n    # BUG: doesn't verify idx is at the last position\\n    if not node.left and not node.right:\\n        return True\\n    return (find_path(node.left, seq, idx+1) or\\n            find_path(node.right, seq, idx+1))" }, "after": { "label": "Correct — leaf AND full sequence consumed", "code": "def find_path(node, seq, idx):\\n    if not node:\\n        return False\\n    if node.val != seq[idx]:\\n        return False\\n    # Leaf check: must also be at the last sequence index\\n    if not node.left and not node.right:\\n        return idx == len(seq) - 1\\n    return (find_path(node.left, seq, idx+1) or\\n            find_path(node.right, seq, idx+1))" } }
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "The Off-By-One Trap", "content": "The buggy version returns \`True\` whenever any leaf is reached after a matching prefix — even if the sequence has more elements remaining. For \`sequence = [1, 2]\` on a 3-level tree, it would wrongly accept a path that matches \`[1, 2]\` then lands on a non-leaf node whose children continue. Always pair the leaf check with \`idx == len(seq) - 1\`." }
\`\`\`

---

### Execution Trace

\`\`\`trace
{ "title": "find_path(root, [1,2,5], 0)", "language": "python", "code": "def find_path(node, seq, idx):\\n    if not node:\\n        return False\\n    if node.val != seq[idx]:\\n        return False\\n    if not node.left and not node.right:\\n        return idx == len(seq) - 1\\n    return (find_path(node.left, seq, idx+1) or\\n            find_path(node.right, seq, idx+1))", "frames": [
  { "line": 1, "vars": { "node.val": 1, "idx": 0, "seq[idx]": 1 }, "note": "Root is not null" },
  { "line": 2, "vars": { "node.val": 1, "seq[0]": 1 }, "note": "1 == 1, no mismatch" },
  { "line": 4, "vars": { "left": 2, "right": 3 }, "note": "Root has children — not a leaf" },
  { "line": 5, "vars": { "call": "find_path(node=2, idx=1)" }, "note": "Recurse left" },
  { "line": 2, "vars": { "node.val": 2, "seq[1]": 2 }, "note": "2 == 2, still matching" },
  { "line": 5, "vars": { "call": "find_path(node=4, idx=2)" }, "note": "Recurse left to node 4" },
  { "line": 2, "vars": { "node.val": 4, "seq[2]": 5 }, "note": "4 ≠ 5 — mismatch, return False" },
  { "line": 5, "vars": { "call": "find_path(node=5, idx=2)" }, "note": "Backtrack, try right child" },
  { "line": 3, "vars": { "node.val": 5, "idx": 2, "len-1": 2 }, "note": "Leaf! idx==len(seq)-1 → return True", "stdout": "True" }
], "speed": 800 }
\`\`\`

---

### Complexity

| | Value | Reason |
|---|---|---|
| **Time** | O(N) | Every node visited at most once across all recursive calls |
| **Space** | O(H) | Recursion stack depth equals the tree height H; O(log N) balanced, O(N) skewed |

\`\`\`callout
{ "type": "info", "title": "Why O(H) space, not O(N)?", "content": "Unlike storing a full path list, this approach only needs the call stack — which is at most H frames deep at any time. DFS explores one branch fully before the next, so frames are reused. In a balanced tree H ≈ log N; worst case (linked-list tree) H = N." }
\`\`\`

---

### Knowledge Check

\`\`\`quiz
{ "title": "Path With Given Sequence", "questions": [
  { "question": "What two conditions must BOTH be true to return True from the DFS?", "options": ["Node value matches AND node has no right child", "Node is a leaf AND sequence index is at the last position", "Node is a leaf AND index equals 0", "Node value matches AND left child is null"], "answer": 1, "explanation": "A valid path needs the node to be a leaf (no children) AND the index to have consumed the entire sequence (idx == len(seq) - 1). Either condition alone is insufficient." },
  { "question": "You call find_path(root, [1, 2], 0) on this tree:\\n  1\\n / \\\\\\n2   3\\nWhat happens at node 3?", "options": ["Returns True — value mismatch is ignored at depth 1", "Returns False — 3 ≠ seq[1] which is 2", "Recurses further into node 3's children", "Returns True — node 3 is a leaf"], "answer": 1, "explanation": "At node 3 we check seq[1] == 2, but node.val == 3. Mismatch detected, return False immediately without exploring further." },
  { "question": "What is the worst-case space complexity and when does it occur?", "options": ["O(1) — DFS uses no extra memory", "O(log N) — always for binary trees", "O(N) — when the tree degenerates into a linked list", "O(N²) — two recursive calls per node"], "answer": 2, "explanation": "Space is O(H) where H is the tree height. In the worst case (every node has only one child, forming a chain), H = N, giving O(N) stack space." },
  { "question": "If the sequence has more elements than the longest root-to-leaf path, what does find_path return?", "options": ["Throws an IndexError on seq[idx]", "Returns True if values matched so far", "Returns False — idx never reaches len(seq)-1 at any leaf", "Returns None"], "answer": 2, "explanation": "Every leaf check requires idx == len(seq) - 1. If the sequence is longer than the path depth, idx will be less than len(seq)-1 at every leaf, so all leaf checks return False." }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Pass the sequence index as a parameter — it tracks how far into the sequence the current path has matched.",
  "Return False immediately on a value mismatch; you never need to recurse into a subtree with a wrong prefix.",
  "The leaf check must verify BOTH conditions: node is a leaf AND index has reached the last sequence position.",
  "Time complexity is O(N) because every node is visited at most once; space is O(H) for the recursion stack.",
  "This pattern extends naturally: swap value equality for any per-node predicate to match richer path conditions."
] }
\`\`\``,
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

Given a binary tree, count the number of paths that sum to a given target. The path does **not** need to start at the root or end at a leaf — but must travel **downward only** (parent → child).

\`\`\`concept
{ "title": "Any-Node Path Counting", "variant": "mental-model", "content": "Unlike root-to-leaf problems, any node can be a path start and any node can be a path end — as long as you only move downward. This changes the problem: you can no longer just track one running sum from the root. For each node, you must consider it as a potential new path origin." }
\`\`\`

### Example

\`\`\`
       10
      /  \\
     5   -3
    / \\     \\
   3   2    11
  / \\   \\
 3  -2   1
\`\`\`

Target = **8**. Three valid paths:
- **5 → 3** (sum = 8)
- **5 → 2 → 1** (sum = 8)
- **−3 → 11** (sum = 8)

\`\`\`algoviz
{ "title": "Tracing all 3 paths that sum to 8", "type": "tree", "data": [10, 5, -3, 3, 2, null, 11, 3, -2, null, 1], "frames": [ { "highlight": [0], "label": "Root (10): running sum from root = 10. No path ends here.", "stats": { "visiting": 10, "runningSum": 10, "pathsFound": 0 } }, { "highlight": [1], "label": "Node (5): running sum = 15. Check sub-paths starting here.", "stats": { "visiting": 5, "runningSum": 15, "pathsFound": 0 } }, { "highlight": [2], "label": "Node (3 left-left): 5+3=8 ✓  PATH 1 FOUND: 5→3", "stats": { "visiting": 3, "runningSum": 18, "pathsFound": 1 } }, { "highlight": [4], "label": "Node (2): 5+2=7, not a match yet.", "stats": { "visiting": 2, "runningSum": 17, "pathsFound": 1 } }, { "highlight": [10], "label": "Node (1): 5+2+1=8 ✓  PATH 2 FOUND: 5→2→1", "stats": { "visiting": 1, "runningSum": 18, "pathsFound": 2 } }, { "highlight": [3], "label": "Node (-3): move right subtree. Running sum from root = 7.", "stats": { "visiting": -3, "runningSum": 7, "pathsFound": 2 } }, { "highlight": [6], "label": "Node (11): -3+11=8 ✓  PATH 3 FOUND: -3→11", "stats": { "visiting": 11, "runningSum": 18, "pathsFound": 3 } } ], "speed": 900 }
\`\`\`

### Two Approaches

\`\`\`tabs
{ "tabs": [ { "label": "Brute Force O(n²)", "icon": "🔨", "content": "For **every node**, launch a fresh DFS treating that node as path start. Count all downward segments summing to target.\\n\\n\`\`\`python\\ndef count_paths(root, target):\\n    if not root:\\n        return 0\\n\\n    def dfs_from(node, remaining):\\n        if not node:\\n            return 0\\n        found = 1 if node.val == remaining else 0\\n        found += dfs_from(node.left,  remaining - node.val)\\n        found += dfs_from(node.right, remaining - node.val)\\n        return found\\n\\n    # Try every node as a path start\\n    return (dfs_from(root, target)\\n            + count_paths(root.left,  target)\\n            + count_paths(root.right, target))\\n\`\`\`\\n\\n**Time:** O(n²) worst case — each of n nodes spawns a downward DFS over its descendants.\\n\\n**Space:** O(h) recursion stack where h is the tree height." }, { "label": "Prefix Sum O(n)", "icon": "⚡", "content": "Track cumulative sums root → current node. If \`currentSum − target\` appeared earlier on this path, those prior nodes are valid path starts.\\n\\n\`\`\`python\\nfrom collections import defaultdict\\n\\ndef count_paths(root, target):\\n    prefix_counts = defaultdict(int)\\n    prefix_counts[0] = 1  # empty prefix: paths starting at root\\n\\n    def dfs(node, curr_sum):\\n        if not node:\\n            return 0\\n        curr_sum += node.val\\n        # Paths ending at this node whose sum == target\\n        found = prefix_counts[curr_sum - target]\\n        prefix_counts[curr_sum] += 1\\n        found += dfs(node.left,  curr_sum)\\n        found += dfs(node.right, curr_sum)\\n        prefix_counts[curr_sum] -= 1  # backtrack!\\n        return found\\n\\n    return dfs(root, 0)\\n\`\`\`\\n\\n**Time:** O(n) — single DFS pass, O(1) hash map lookups.\\n\\n**Space:** O(n) for the map + O(h) call stack." } ] }
\`\`\`

### Why the Prefix Sum Trick Works

\`\`\`concept
{ "title": "The Prefix Sum Key Insight", "variant": "analogy", "content": "Picture the root-to-current-node path as a number line. At every step you accumulate a running total. If your current total is S and some ancestor had total S−target, then the segment from that ancestor's child down to you sums to exactly target. The hash map counts how many ancestors have each prefix sum — so one O(1) lookup replaces a whole inner DFS." }
\`\`\`

\`\`\`trace
{ "title": "Prefix Sum: finding path −3 → 11 (target = 8)", "language": "python", "code": "prefix_counts = {0: 1}\\n# --- visit 10 ---\\ncurr_sum = 0 + 10            # = 10\\nfound += prefix_counts[10 - 8]  # lookup 2  → 0\\nprefix_counts[10] = 1\\n# --- visit -3 ---\\ncurr_sum = 10 + (-3)         # = 7\\nfound += prefix_counts[7 - 8]   # lookup -1 → 0\\nprefix_counts[7] = 1\\n# --- visit 11 ---\\ncurr_sum = 7 + 11            # = 18\\nfound += prefix_counts[18 - 8]  # lookup 10 → 1  PATH!\\nprefix_counts[18] = 1", "frames": [ { "line": 1, "vars": { "prefix_counts": "{0:1}", "curr_sum": 0, "found": 0 }, "note": "Seed the map: prefix sum 0 seen once (the 'before-root' empty path)." }, { "line": 3, "vars": { "prefix_counts": "{0:1}", "curr_sum": 10, "found": 0 }, "note": "Visit node 10. Running total becomes 10." }, { "line": 4, "vars": { "prefix_counts": "{0:1}", "curr_sum": 10, "found": 0 }, "note": "Look up 10−8=2. Not in map → 0. No path ends at 10." }, { "line": 5, "vars": { "prefix_counts": "{0:1, 10:1}", "curr_sum": 10, "found": 0 }, "note": "Record prefix sum 10 in the map before going deeper." }, { "line": 7, "vars": { "prefix_counts": "{0:1, 10:1}", "curr_sum": 7, "found": 0 }, "note": "Visit node −3. Running total = 10+(−3) = 7." }, { "line": 8, "vars": { "prefix_counts": "{0:1, 10:1}", "curr_sum": 7, "found": 0 }, "note": "Look up 7−8=−1. Not in map → 0." }, { "line": 9, "vars": { "prefix_counts": "{0:1, 7:1, 10:1}", "curr_sum": 7, "found": 0 }, "note": "Record prefix sum 7." }, { "line": 11, "vars": { "prefix_counts": "{0:1, 7:1, 10:1}", "curr_sum": 18, "found": 0 }, "note": "Visit node 11. Running total = 7+11 = 18." }, { "line": 12, "vars": { "prefix_counts": "{0:1, 7:1, 10:1}", "curr_sum": 18, "found": 1 }, "note": "Look up 18−8=10. prefix_counts[10]=1 → PATH FOUND: −3→11 sums to 8!" } ], "speed": 950 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Backtracking is Mandatory", "content": "After finishing both subtrees of a node, you must **decrement** \`prefix_counts[curr_sum]\` before returning. The map encodes prefix sums along the **current root-to-node path only**. Without the decrement, a left-branch sum leaks into the right branch, causing phantom path counts." }
\`\`\`

### Complexity Summary

| Approach | Time | Space |
|---|---|---|
| Brute force (nested DFS) | O(n²) | O(h) |
| Prefix sum (hash map) | O(n) | O(n) |

*h = tree height: O(log n) balanced, O(n) worst-case skewed tree.*

\`\`\`quiz
{ "title": "Count Paths for a Sum — Check Your Understanding", "questions": [ { "question": "Why do we initialize prefix_counts[0] = 1 before starting the DFS?", "options": [ "To avoid a KeyError on empty trees", "So that paths starting at the root are counted correctly — currentSum−target=0 should find this seed", "It prevents infinite recursion in the base case", "It is required by the defaultdict initialisation contract" ], "answer": 1, "explanation": "If the running sum from the root equals target at some node, we look up currentSum−target = 0. The seed of 1 at key 0 represents the 'before-root' prefix, ensuring root-started paths are counted." }, { "question": "What is the worst-case time complexity of the brute-force (nested DFS) approach?", "options": [ "O(n log n)", "O(n)", "O(n²)", "O(2ⁿ)" ], "answer": 2, "explanation": "The outer DFS visits all n nodes. For each node, the inner DFS visits all its descendants. On a skewed (linked-list-like) tree, that is n + (n−1) + … + 1 = O(n²) total work." }, { "question": "After recursing into both children of a node in the prefix-sum DFS, what should you do with the node's prefix sum entry?", "options": [ "Leave it — the next call will overwrite it", "Delete the key from the map entirely", "Decrement it by 1 to undo the current node's contribution", "Set it to 0 to reset for the next path" ], "answer": 2, "explanation": "Decrementing by 1 is the backtrack step. The map represents only the active root-to-current-node path. When you exit a node, it leaves the path, so its prefix sum count must be reduced by 1." }, { "question": "For the prefix-sum approach, what does prefix_counts[curr_sum − target] represent at any given node?", "options": [ "The number of nodes in the tree with value equal to curr_sum − target", "The number of ancestor nodes whose prefix sum equals curr_sum − target, meaning their next edge starts a valid path ending here", "The total number of paths found so far", "The depth of the current node in the tree" ], "answer": 1, "explanation": "Each ancestor with prefix sum S = curr_sum − target defines a valid path start: the segment from the node immediately after that ancestor down to the current node has sum curr_sum − S = target." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Any-node downward paths require treating every node as a potential path start — brute force does this with a double DFS in O(n²); the prefix-sum technique does it in a single O(n) pass.", "The prefix-sum key insight: if currentSum − target exists in the map, each of those ancestor prefix sums starts a valid path ending at the current node.", "Always seed prefix_counts[0] = 1 before the DFS to correctly count paths that begin at the root.", "Backtracking (decrementing the map entry on return) is non-negotiable — omitting it causes sibling-branch sums to bleed into each other.", "Space cost is O(n) for the hash map and O(h) for the call stack; on a skewed tree h = n, keeping overall space O(n)." ] }
\`\`\``,
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

You've completed every lesson in the Tree DFS module. This checkpoint consolidates the four patterns you practiced: the three traversal orders, path sum with recursion, backtracking for all-paths enumeration, and prefix-sum counting for paths from any node.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Pre-order",
      "icon": "🌱",
      "content": "**Root → Left → Right**\\n\\nThe node is processed *before* its subtrees. Use this when parent context must flow *down* to children — building a running path, passing a cumulative sum, or serializing a tree.\\n\\n\`\`\`python\\ndef preorder(node):\\n    if not node: return\\n    visit(node.val)        # root first\\n    preorder(node.left)\\n    preorder(node.right)\\n\`\`\`\\n\\n**Signature problems:** Path Sum, Sum Root to Leaf Numbers, Binary Tree Paths."
    },
    {
      "label": "In-order",
      "icon": "🔀",
      "content": "**Left → Root → Right**\\n\\nFor a BST, in-order produces nodes in *sorted ascending order*. Use when ordering or BST validation is the goal.\\n\\n\`\`\`python\\ndef inorder(node):\\n    if not node: return\\n    inorder(node.left)\\n    visit(node.val)        # root between children\\n    inorder(node.right)\\n\`\`\`\\n\\n**Signature problems:** Validate BST, Kth Smallest in BST, sorted merge."
    },
    {
      "label": "Post-order",
      "icon": "🍂",
      "content": "**Left → Right → Root**\\n\\nThe node is processed *after* both subtrees. Use when children's results must flow *up* to compute the parent's value.\\n\\n\`\`\`python\\ndef postorder(node):\\n    if not node: return\\n    postorder(node.left)\\n    postorder(node.right)\\n    visit(node.val)        # root last\\n\`\`\`\\n\\n**Signature problems:** Tree diameter, maximum path sum through a node, subtree height."
    },
    {
      "label": "Backtracking",
      "icon": "↩️",
      "content": "**Add on the way down, remove on the way back up.**\\n\\nWhen enumerating *all* root-to-leaf paths by mutating a shared list, the \`pop()\` undoes the choice so one branch's nodes never contaminate another branch's paths.\\n\\n\`\`\`python\\ndef allPaths(node, path, result):\\n    if not node: return\\n    path.append(node.val)              # choose\\n    if not node.left and not node.right:\\n        result.append(list(path))      # record complete path\\n    allPaths(node.left, path, result)\\n    allPaths(node.right, path, result)\\n    path.pop()                         # un-choose ← essential\\n\`\`\`\\n\\n**Forgetting \`pop()\` is the single most common DFS bug in interviews.**"
    }
  ]
}
\`\`\`

### Watching DFS Find a Path Sum

The tree below has the path **5 → 4 → 11** that sums to **20**. Watch the algorithm recurse and short-circuit as soon as it finds a valid leaf:

\`\`\`algoviz
{
  "title": "hasPathSum(root, target=20)",
  "type": "tree",
  "data": [5, 4, 8, 11],
  "frames": [
    { "highlight": [0], "label": "Visit node 5. Remaining = 20 − 5 = 15", "stats": { "node": 5, "remaining": 15 } },
    { "highlight": [1], "label": "Recurse left → node 4. Remaining = 15 − 4 = 11", "stats": { "node": 4, "remaining": 11 } },
    { "highlight": [3], "label": "Recurse left → node 11. Remaining = 11 − 11 = 0", "stats": { "node": 11, "remaining": 0 } },
    { "highlight": [3], "label": "Leaf reached! remaining == 0 → return True ✓  Right subtree (node 8) is never explored.", "stats": { "node": 11, "remaining": 0 } }
  ],
  "speed": 900
}
\`\`\`

\`\`\`concept
{ "title": "Space Complexity of Recursive DFS", "variant": "rule", "content": "Recursive DFS uses O(h) call-stack space, where h is the tree height. For a balanced tree h = O(log n); for a skewed tree (every node has exactly one child) h degrades to O(n). Time complexity is always O(n) — every node is visited exactly once." }
\`\`\`

### The Hardest Pattern: From O(n²) to O(n) for Path Sum III

LeetCode 437 asks you to count paths that equal a target sum where paths can *start anywhere* in the tree. The brute-force approach restarts a full DFS from every node. The optimal solution uses a running prefix-sum hash map — the exact same insight as the Two Sum hash-map trick.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Brute Force — O(n²)",
    "code": "def pathSum(root, target):\\n    def dfs(node, rem):\\n        if not node: return 0\\n        hit = 1 if node.val == rem else 0\\n        return (hit\\n                + dfs(node.left,  rem - node.val)\\n                + dfs(node.right, rem - node.val))\\n\\n    if not root: return 0\\n    # restart a fresh DFS from every node\\n    return (dfs(root, target)\\n            + pathSum(root.left,  target)\\n            + pathSum(root.right, target))"
  },
  "after": {
    "label": "Prefix Sum — O(n)",
    "code": "def pathSum(root, target):\\n    prefix = {0: 1}   # cumulative_sum -> frequency\\n\\n    def dfs(node, running):\\n        if not node: return 0\\n        running += node.val\\n        # paths ending here whose sum equals target\\n        count = prefix.get(running - target, 0)\\n        prefix[running] = prefix.get(running, 0) + 1\\n        count += dfs(node.left,  running)\\n        count += dfs(node.right, running)\\n        prefix[running] -= 1   # backtrack the map!\\n        return count\\n\\n    return dfs(root, 0)"
  }
}
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Backtrack the prefix map — same reason as path.pop()", "content": "The \`prefix[running] -= 1\` after both recursive calls is mandatory. Without it, prefix sums accumulated while exploring the left subtree will inflate counts when the right subtree is explored — the exact same contamination bug that \`path.pop()\` prevents in all-paths enumeration." }
\`\`\`

---

\`\`\`quiz
{
  "title": "Tree DFS — Module Check",
  "questions": [
    {
      "question": "What is the space complexity of recursive DFS on a tree with height h?",
      "options": ["O(1)", "O(n)", "O(h) where h is the tree height", "O(n²)"],
      "answer": 2,
      "explanation": "The recursion stack depth equals the tree height h, so space is O(h). For a balanced tree this is O(log n); for a skewed tree it degrades to O(n). The time complexity is always O(n) regardless of shape."
    },
    {
      "question": "Which traversal order processes a node before visiting either of its subtrees?",
      "options": ["Post-order", "In-order", "Pre-order", "Level-order"],
      "answer": 2,
      "explanation": "Pre-order (Root → Left → Right) visits the node first. This is the natural fit for top-down problems where parent context — like a running path or cumulative sum — must be established before descending into children."
    },
    {
      "question": "When collecting all root-to-leaf paths by mutating a shared list, why is path.pop() required after each recursive call?",
      "options": ["To save memory during traversal", "To satisfy Python list semantics", "To undo the choice so the current node does not appear in sibling paths", "To signal the base case to the caller"],
      "answer": 2,
      "explanation": "Backtracking removes the current node before the algorithm explores the next branch. Without pop(), nodes recorded during left-subtree exploration remain in the path list when the right subtree is explored, producing corrupt, overlapping paths."
    },
    {
      "question": "True or False: DFS is always a better choice than BFS for binary tree problems.",
      "options": ["True — DFS always uses less memory", "False — BFS is preferable for level-order, shortest-path, or nearest-to-root problems", "True — DFS has strictly lower time complexity than BFS", "False — BFS is always the better choice"],
      "answer": 1,
      "explanation": "Neither is universally superior. DFS is natural for path-finding, backtracking, and depth-dependent problems. BFS is preferable when you need level-by-level processing, the shortest path to a node, or the closest match to the root."
    },
    {
      "question": "In the brute-force solution for Path Sum III (paths starting from any node), what is the time complexity for a tree with n nodes?",
      "options": ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
      "answer": 2,
      "explanation": "The brute force tries each of the n nodes as a potential path start, running an O(n) DFS from each: O(n) × O(n) = O(n²). The prefix-sum approach eliminates the redundant restarts and reduces total work to O(n)."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "DFS time complexity is always O(n); space is O(h) — O(log n) for balanced trees, O(n) for skewed trees.",
    "Choose traversal order by direction of information flow: pre-order for top-down (path building, running sums), post-order for bottom-up (heights, subtree aggregation), in-order for BST ordering.",
    "Backtracking (path.pop()) prevents nodes from one branch contaminating sibling branches — the single most common DFS interview mistake.",
    "The O(n) prefix-sum solution for Path Sum III mirrors the Two Sum hash-map pattern and requires its own backtrack step on the map for the same reason path enumeration needs pop().",
    "Iterative and recursive DFS have identical time and space complexity; choose based on readability and stack-overflow risk for very deep trees."
  ]
}
\`\`\`

<!-- voice:summary_prompt -->

**Ready for your voice check?** Your coach will ask you to:
- Explain when you'd reach for DFS versus BFS on a tree problem and why
- Walk through the backtracking pattern for "find all paths with target sum" step by step
- Describe why the O(n) prefix-sum solution for Path Sum III also needs a backtrack step on the hash map

You've mastered one of the most versatile patterns in coding interviews — on to the next module!`,
    },
  ],
};
