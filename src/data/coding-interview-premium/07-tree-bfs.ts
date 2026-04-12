import { Module } from "../types";

export const treeBFSModule: Module = {
  id: "tree-bfs",
  title: "Tree BFS",
  description: "Master Breadth-First Search (BFS) for tree problems. Learn level-by-level traversal techniques for solving tree problems efficiently.",
  lessons: [
    {
      id: "tree-bfs-intro",
      slug: "tree-bfs-intro",
      title: "Introduction to Tree BFS",
      content: `## The Tree BFS Pattern

**Breadth-First Search (BFS)** explores a tree level by level — visiting every node at depth *d* before any node at depth *d+1*. This single guarantee is what makes BFS the right tool whenever the answer depends on *which level* a node lives on.

\`\`\`concept
{ "title": "BFS: The Level-by-Level Promise", "variant": "mental-model", "content": "BFS treats a tree like a building: you fully explore floor 0 (the root) before stepping onto floor 1, floor 1 before floor 2, and so on. A queue enforces this order automatically — nodes you add now get processed after everyone already waiting in line." }
\`\`\`

<!-- voice:section_check concept="BFS basic concept" -->

### Why BFS?

BFS shines whenever the problem has a **level-based structure**. Learn to spot the signals:

| Problem hint | Why BFS wins |
|---|---|
| "shortest path" / "minimum depth" | BFS finds the shallowest matching node first |
| "level order" / "row by row" | BFS groups nodes by depth naturally |
| "nodes at depth k" | Process exactly *k* iterations of the outer loop |
| "right side view" | Take the last node popped from each level batch |

\`\`\`concept
{ "title": "BFS vs DFS: The Core Trade-off", "variant": "analogy", "content": "BFS is like exploring a city neighborhood by neighborhood before driving to the next town. DFS is like taking one highway all the way to the coast before doubling back. Use BFS when proximity (depth) matters; use DFS when you need to follow a complete path to its end." }
\`\`\`

### How BFS Works — Step by Step

\`\`\`steps
{ "title": "BFS Algorithm", "steps": [ { "title": "Seed the queue with the root", "content": "Initialize a \`deque\` containing only the root node. The queue is your frontier — the boundary between explored and unexplored territory." }, { "title": "Snapshot the level size", "content": "Read \`level_size = len(queue)\` **before** the inner loop. This number tells you exactly how many nodes belong to the current level. Children appended during processing belong to the *next* level." }, { "title": "Drain one full level", "content": "Loop \`level_size\` times. Each iteration: \`popleft()\` a node, process it, then \`append\` its left and right children (if they exist). Children join the back of the queue — they won't be touched until the next outer iteration." }, { "title": "Repeat until the queue is empty", "content": "When the queue drains completely, every node has been visited exactly once in level order. The outer \`while\` loop terminates naturally." } ] }
\`\`\`

### Watch the Queue Change — Live Traversal

\`\`\`algoviz
{ "title": "BFS Level-by-Level on a 7-Node Tree", "type": "tree", "data": [1, 2, 3, 4, 5, 6, 7], "frames": [ { "highlight": [0], "label": "Initialize: enqueue root (1). Queue → [1]", "stats": { "level": 0, "queue_size": 1 } }, { "highlight": [0], "label": "Level 0 — pop node 1, enqueue children 2 and 3. Queue → [2, 3]", "stats": { "level": 0, "queue_size": 2 } }, { "highlight": [1], "label": "Level 1 — pop node 2, enqueue children 4 and 5. Queue → [3, 4, 5]", "stats": { "level": 1, "queue_size": 3 } }, { "highlight": [2], "label": "Level 1 — pop node 3, enqueue children 6 and 7. Queue → [4, 5, 6, 7]", "stats": { "level": 1, "queue_size": 4 } }, { "highlight": [3, 4, 5, 6], "label": "Level 2 — pop 4, 5, 6, 7 one by one. All leaves, no children to enqueue. Queue → []", "stats": { "level": 2, "queue_size": 0 } } ], "speed": 900 }
\`\`\`

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

> **Queue state per level:** Level 0: \`[1]\` → Level 1: \`[2, 3]\` → Level 2: \`[4, 5, 6, 7]\`. The queue size at each level tells you exactly how many nodes to process before moving on.

<!-- voice:key_insight insight="BFS uses a queue to ensure we process all nodes at depth d before any node at depth d+1" -->

### The Pattern Template

Every BFS tree problem fits this skeleton. Memorise it:

\`\`\`playground
{ "title": "BFS Template — Python", "language": "python", "code": "from collections import deque\\n\\ndef bfs(root):\\n    if not root:\\n        return []\\n\\n    result = []\\n    queue = deque([root])\\n\\n    while queue:\\n        level_size = len(queue)   # snapshot BEFORE inner loop\\n        current_level = []\\n\\n        for _ in range(level_size):\\n            node = queue.popleft()\\n            current_level.append(node.val)  # process node\\n\\n            if node.left:\\n                queue.append(node.left)\\n            if node.right:\\n                queue.append(node.right)\\n\\n        result.append(current_level)\\n\\n    return result\\n# Input: [1, 2, 3, 4, 5, 6, 7]\\n# Output: [[1], [2, 3], [4, 5, 6, 7]]", "runnable": false }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "The level_size Snapshot Trap", "content": "Never write \`for _ in range(len(queue))\` directly — Python re-evaluates \`len(queue)\` each iteration, and since you're appending children inside the loop, the queue keeps growing. You'd accidentally process next-level nodes inside the current-level loop, breaking the level-by-level guarantee. Always snapshot: \`level_size = len(queue)\` before the loop." }
\`\`\`

### Complexity

| | Complexity | Reason |
|---|---|---|
| **Time** | O(n) | Every node is enqueued and dequeued exactly once |
| **Space** | O(w) | Queue holds at most one full level; *w* = max width of the tree |

\`\`\`collapse
{ "title": "Deep Dive: Why space is O(w), not O(n)", "content": "The queue holds **one level at a time**. In a perfect binary tree of height *h*, the bottom level has 2^h nodes — roughly *n/2* of all nodes. So worst-case space is O(n/2) = O(n), but we write it as O(w) because it depends on the tree's shape, not just its size.\\n\\n- **Balanced tree:** w ≈ n/2 → O(n) space\\n- **Skewed tree (linked list shape):** w = 1 → O(1) space\\n- **Bushy tree:** somewhere in between\\n\\nThis contrasts with DFS, whose stack depth is O(h) — O(log n) for balanced, O(n) for skewed." }
\`\`\`

### Check Your Understanding

\`\`\`quiz
{ "title": "Tree BFS Fundamentals", "questions": [ { "question": "What data structure is at the heart of BFS, and why?", "options": ["Stack — because recursion implicitly uses a call stack", "Queue (FIFO) — because we process nodes in the order they were discovered", "Min-heap — because we want to visit the smallest nodes first", "Hash map — because we need O(1) visited lookups"], "answer": 1, "explanation": "BFS relies on a FIFO queue. Adding children to the back and removing from the front ensures nodes are processed in the exact order they were discovered — which produces the level-by-level guarantee." }, { "question": "Why do we capture \`level_size = len(queue)\` before the inner loop instead of using \`len(queue)\` directly in the range?", "options": ["Python deques don't support len() inside for-loop headers", "The inner loop appends children, which would grow the queue and pull next-level nodes into the current pass", "It's a micro-optimization with no functional difference", "To allow early termination when a target node is found"], "answer": 1, "explanation": "During the inner loop we append child nodes. Without snapshotting the size first, \`range(len(queue))\` grows with each append — next-level nodes would be processed in the same iteration as current-level nodes, destroying the level-by-level structure." }, { "question": "For a perfect binary tree with n nodes, what is the worst-case space complexity of BFS?", "options": ["O(log n) — equal to the tree height", "O(n) — the last level alone holds ~n/2 nodes", "O(1) — the queue is reused each level", "O(n log n) — because of the nested loops"], "answer": 1, "explanation": "The queue holds at most one full level at a time. In a perfect binary tree the bottom level contains 2^h ≈ n/2 nodes, so worst-case space is O(n). We often write it as O(w) where w is maximum width to make the shape-dependence explicit." }, { "question": "Which of the following problems is BFS LEAST suited for?", "options": ["Finding the minimum depth of a binary tree", "Returning nodes level by level", "Finding all root-to-leaf paths", "Returning the rightmost node at each level"], "answer": 2, "explanation": "Finding all root-to-leaf paths requires tracking the complete path from root to the current node — a natural fit for DFS, which follows one branch at a time and backtracks. BFS processes nodes level by level and doesn't maintain per-path state efficiently." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["BFS visits every node at depth d before any node at depth d+1 — the queue enforces this automatically.", "Always snapshot level_size = len(queue) before the inner loop; never re-evaluate inside it.", "Time complexity is O(n); space complexity is O(w) where w is the maximum width of the tree.", "Reach for BFS when the problem involves level order, shortest path, minimum depth, or per-level aggregation.", "Every BFS tree problem fits the same template: seed queue → while not empty → snapshot size → inner for-loop → append children."] }
\`\`\``,
    },
    {
      id: "binary-tree-level-order",
      slug: "binary-tree-level-order",
      title: "Binary Tree Level Order Traversal",
      content: `## Binary Tree Level Order Traversal

<!-- voice:section_check concept="classic BFS pattern" -->

Given the root of a binary tree, return the **level order traversal** of its nodes' values — left to right, level by level.

\`\`\`
Input:
         3
        / \\
       9  20
         /  \\
        15   7

Output: [[3], [9, 20], [15, 7]]
\`\`\`

\`\`\`concept
{ "title": "BFS = Explore Width Before Depth", "variant": "mental-model", "content": "Imagine dropping a stone into a pond. The ripples spread outward in rings — each ring is a level. BFS does exactly this: it fully explores every node at distance k from the root before touching any node at distance k+1. A queue enforces this order because it processes nodes FIFO — whatever was added first (the current level's children) comes out first." }
\`\`\`

---

## The Core Trick: Snapshot the Queue Size

The challenge with level order traversal is knowing *when one level ends and the next begins*. Both levels share the same queue — so how do you tell them apart?

<!-- voice:key_insight insight="The queue size at the start of each level tells us exactly how many nodes are in that level" -->

\`\`\`concept
{ "title": "Freeze the Level Boundary", "variant": "insight", "content": "At the start of each iteration, snapshot n = len(queue). This is the exact number of nodes in the current level. Process exactly n nodes, enqueue their children, then move on. By the time you've processed those n nodes, the queue contains only the next level." }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why len(queue) works", "content": "When you enter a level, all nodes already in the queue belong to that level — children added during this loop belong to the *next* level. Capturing \`n = len(queue)\` before the inner loop freezes this boundary permanently." }
\`\`\`

---

## Algorithm Walkthrough

\`\`\`algoviz
{ "title": "Level Order Traversal — step by step", "type": "tree", "data": { "val": 3, "left": { "val": 9, "left": null, "right": null }, "right": { "val": 20, "left": { "val": 15, "left": null, "right": null }, "right": { "val": 7, "left": null, "right": null } } }, "frames": [ { "highlight": [0], "label": "Init: enqueue root (3). Queue = [3]", "stats": { "level": 0, "queue": "[3]", "result": "[]" } }, { "highlight": [0], "label": "Level 0: n=1. Dequeue 3, enqueue children 9 and 20. level=[3]", "stats": { "level": 0, "queue": "[9, 20]", "result": "[[3]]" } }, { "highlight": [1, 2], "label": "Level 1: n=2. Dequeue 9 (no children), dequeue 20 (enqueue 15, 7). level=[9,20]", "stats": { "level": 1, "queue": "[15, 7]", "result": "[[3],[9,20]]" } }, { "highlight": [3, 4], "label": "Level 2: n=2. Dequeue 15 and 7 (both leaves). level=[15,7]", "stats": { "level": 2, "queue": "[]", "result": "[[3],[9,20],[15,7]]" } }, { "highlight": [], "label": "Queue empty — done! Result: [[3],[9,20],[15,7]]", "stats": { "level": "-", "queue": "[]", "result": "[[3],[9,20],[15,7]]" } } ], "speed": 900 }
\`\`\`

---

## Implementation

\`\`\`tabs
{ "tabs": [ { "label": "Python", "icon": "🐍", "content": "\`\`\`python\\nfrom collections import deque\\nfrom typing import Optional, List\\n\\nclass Solution:\\n    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:\\n        if not root:\\n            return []\\n        \\n        result = []\\n        queue = deque([root])\\n        \\n        while queue:\\n            level = []\\n            n = len(queue)          # snapshot current level size\\n            \\n            for _ in range(n):\\n                node = queue.popleft()\\n                level.append(node.val)\\n                if node.left:\\n                    queue.append(node.left)\\n                if node.right:\\n                    queue.append(node.right)\\n            \\n            result.append(level)\\n        \\n        return result\\n\`\`\`" }, { "label": "TypeScript", "icon": "🔷", "content": "\`\`\`typescript\\nfunction levelOrder(root: TreeNode | null): number[][] {\\n    if (!root) return [];\\n    \\n    const result: number[][] = [];\\n    const queue: TreeNode[] = [root];\\n    \\n    while (queue.length > 0) {\\n        const level: number[] = [];\\n        const n = queue.length;        // snapshot current level size\\n        \\n        for (let i = 0; i < n; i++) {\\n            const node = queue.shift()!;\\n            level.push(node.val);\\n            if (node.left)  queue.push(node.left);\\n            if (node.right) queue.push(node.right);\\n        }\\n        \\n        result.push(level);\\n    }\\n    \\n    return result;\\n}\\n\`\`\`" }, { "label": "Java", "icon": "☕", "content": "\`\`\`java\\npublic List<List<Integer>> levelOrder(TreeNode root) {\\n    List<List<Integer>> result = new ArrayList<>();\\n    if (root == null) return result;\\n    \\n    Queue<TreeNode> queue = new LinkedList<>();\\n    queue.offer(root);\\n    \\n    while (!queue.isEmpty()) {\\n        List<Integer> level = new ArrayList<>();\\n        int n = queue.size();           // snapshot current level size\\n        \\n        for (int i = 0; i < n; i++) {\\n            TreeNode node = queue.poll();\\n            level.add(node.val);\\n            if (node.left  != null) queue.offer(node.left);\\n            if (node.right != null) queue.offer(node.right);\\n        }\\n        \\n        result.add(level);\\n    }\\n    \\n    return result;\\n}\\n\`\`\`" } ] }
\`\`\`

---

## Trace Through the Code

\`\`\`trace
{ "title": "Execution trace — root=[3,9,20,null,null,15,7]", "language": "python", "code": "queue = deque([root])\\nresult = []\\nwhile queue:\\n    n = len(queue)\\n    level = []\\n    for _ in range(n):\\n        node = queue.popleft()\\n        level.append(node.val)\\n        if node.left: queue.append(node.left)\\n        if node.right: queue.append(node.right)\\n    result.append(level)", "frames": [ { "line": 1, "vars": { "queue": "[Node(3)]", "result": "[]" }, "note": "Seed queue with root" }, { "line": 3, "vars": { "queue": "[Node(3)]", "result": "[]" }, "note": "Queue is non-empty — enter loop" }, { "line": 4, "vars": { "n": 1, "queue": "[Node(3)]" }, "note": "Snapshot: 1 node at level 0" }, { "line": 6, "vars": { "node": "Node(3)", "level": "[3]", "queue": "[Node(9), Node(20)]" }, "note": "Dequeue 3, enqueue children 9 and 20" }, { "line": 9, "vars": { "result": "[[3]]" }, "note": "Append level=[3] to result" }, { "line": 4, "vars": { "n": 2, "queue": "[Node(9), Node(20)]" }, "note": "Snapshot: 2 nodes at level 1" }, { "line": 6, "vars": { "node": "Node(9)", "level": "[9]", "queue": "[Node(20)]" }, "note": "Dequeue 9 — no children" }, { "line": 6, "vars": { "node": "Node(20)", "level": "[9, 20]", "queue": "[Node(15), Node(7)]" }, "note": "Dequeue 20, enqueue 15 and 7" }, { "line": 9, "vars": { "result": "[[3], [9, 20]]" }, "note": "Append level=[9,20]" }, { "line": 4, "vars": { "n": 2, "queue": "[Node(15), Node(7)]" }, "note": "Snapshot: 2 nodes at level 2" }, { "line": 6, "vars": { "level": "[15, 7]", "queue": "[]" }, "note": "Dequeue 15 and 7 — both leaves" }, { "line": 9, "vars": { "result": "[[3], [9, 20], [15, 7]]" }, "note": "Done! Queue empty, loop exits" } ], "speed": 900 }
\`\`\`

---

## Complexity

| | Complexity | Why |
|---|---|---|
| **Time** | O(n) | Every node is enqueued and dequeued exactly once |
| **Space** | O(w) | Queue holds at most one full level; max width w ≤ n/2 for a complete tree |

\`\`\`callout
{ "type": "info", "title": "Space is O(n) in the worst case", "content": "For a complete binary tree, the last level alone can contain ⌈n/2⌉ nodes. So worst-case space is O(n) — but we express it as O(w) (max width) because that's tighter and more accurately describes the relationship to tree shape, not just node count." }
\`\`\`

---

## BFS vs DFS for Level Order

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "DFS (wrong tool)", "code": "# Works, but awkward — must track depth manually\\ndef levelOrder_dfs(root):\\n    result = []\\n    def dfs(node, depth):\\n        if not node: return\\n        if depth == len(result):\\n            result.append([])   # create new level bucket\\n        result[depth].append(node.val)\\n        dfs(node.left,  depth + 1)\\n        dfs(node.right, depth + 1)\\n    dfs(root, 0)\\n    return result" }, "after": { "label": "BFS (right tool)", "code": "# Natural — queue order IS level order\\ndef levelOrder_bfs(root):\\n    if not root: return []\\n    result, queue = [], deque([root])\\n    while queue:\\n        level, n = [], len(queue)\\n        for _ in range(n):\\n            node = queue.popleft()\\n            level.append(node.val)\\n            if node.left:  queue.append(node.left)\\n            if node.right: queue.append(node.right)\\n        result.append(level)\\n    return result" } }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: The BFS Template — Reusing This Pattern", "content": "The \`n = len(queue)\` snapshot is the **universal BFS level template**. You'll reuse it verbatim in:\\n\\n- **Zigzag traversal** (LeetCode 103) — flip direction each level\\n- **Right side view** (LeetCode 199) — take the last node per level\\n- **Average of levels** (LeetCode 637) — sum within the inner loop, divide by n\\n- **Maximum width of tree** (LeetCode 662) — track index arithmetic per level\\n- **Minimum depth** (LeetCode 111) — return as soon as you see a leaf\\n\\nAll five variants plug directly into the same skeleton. Once you own this template, every level-based tree problem becomes a small modification." }
\`\`\`

---

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

## Practice Problem

Now implement it yourself. Return the level order traversal as a list of lists.

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "Why do we capture \`n = len(queue)\` before the inner for-loop?", "options": [ "To avoid an off-by-one error in the outer while loop", "To know exactly how many nodes belong to the current level before children are added", "Because len(queue) changes during iteration and would skip nodes", "To satisfy a Python requirement about deque mutation" ], "answer": 1, "explanation": "At the moment we snapshot n, the queue contains exactly the nodes at the current level. As we process them we enqueue their children — mixing next-level nodes in. By looping exactly n times we process only current-level nodes, keeping levels cleanly separated." }, { "question": "What is the space complexity of BFS level order traversal?", "options": [ "O(log n) — only one path from root to leaf is stored", "O(h) — proportional to tree height", "O(w) — proportional to maximum width (up to O(n) for a complete tree)", "O(n²) — because we store a list of lists" ], "answer": 2, "explanation": "The queue holds at most one level at a time. For a complete binary tree the widest level (the last) contains ⌈n/2⌉ nodes, so worst-case queue size is O(n). We write O(w) to capture the relationship to tree shape." }, { "question": "For root = [1, 2, 3, 4, 5], what does levelOrder return?", "options": [ "[[1, 2, 3, 4, 5]]", "[[1], [2, 3], [4, 5]]", "[[1], [2], [3], [4], [5]]", "[[4, 5], [2, 3], [1]]" ], "answer": 1, "explanation": "The tree looks like: 1 at level 0; 2 and 3 at level 1; 4 and 5 (children of 2) at level 2. BFS visits level by level, so the result is [[1], [2,3], [4,5]]." }, { "question": "Which data structure is essential for BFS and why?", "options": [ "Stack — because we need LIFO to process the deepest node first", "Queue — because FIFO ensures we finish all nodes at the current level before their children", "Priority Queue — to process nodes by value order", "Hash Map — to track which nodes have been visited" ], "answer": 1, "explanation": "A queue's FIFO property is what makes BFS work. When we enqueue children, they go to the back — behind all remaining current-level nodes. A stack would give DFS behaviour instead." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "BFS uses a queue (FIFO) to guarantee level-by-level processing — nodes enqueued later (children) are processed after all current-level nodes.", "Snapshot \`n = len(queue)\` at the start of each level to know exactly how many nodes belong there — this is the universal BFS level template.", "Time complexity is O(n) — every node is enqueued and dequeued once. Space is O(w) where w is the maximum tree width (up to O(n)).", "The same inner-loop template powers zigzag traversal, right-side view, level averages, and minimum depth — learn the skeleton once, adapt for every variant." ] }
\`\`\``,
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

\`\`\`concept
{ "title": "Reverse Level Order = BFS + Flip", "variant": "mental-model", "content": "Reverse level order is identical to standard BFS — collect nodes level by level using a queue. The only twist: instead of appending each level to the back of your result, you prepend it to the front (or collect all levels normally and reverse at the end). Same O(N) traversal, same queue machinery — just one extra step." }
\`\`\`

### Problem Statement

Given a binary tree, return the **bottom-up** level order traversal of its nodes' values — from the deepest level up to the root, left to right within each level.

\`\`\`
Input:
        3
       / \\
      9  20
        /  \\
       15   7

Output: [[15, 7], [9, 20], [3]]
\`\`\`

\`\`\`concept
{ "title": "Why Interviewers Love This Problem", "variant": "insight", "content": "This problem tests whether you can adapt a known algorithm (BFS) by modifying its output — not its traversal logic. Recognizing that the traversal itself is unchanged, and only the result ordering differs, is the key insight that separates fast solvers from those who overthink it." }
\`\`\`

### The Algorithm

\`\`\`steps
{ "title": "Reverse Level Order — Step by Step", "steps": [ { "title": "Initialize queue and result", "content": "Push the root into a queue. Create an empty \`result\` deque. Handle the edge case: if root is \`None\`, return \`[]\`." }, { "title": "BFS level by level", "content": "While the queue is non-empty, snapshot its current size — that is how many nodes belong to the current level. Dequeue each node, record its value, and enqueue its left and right children (if they exist)." }, { "title": "Prepend each level to the front", "content": "After processing one complete level, use \`result.appendleft(level)\` to insert it at the front of the result in O(1). Alternatively, \`result.insert(0, level)\` works but costs O(L) per insertion." }, { "title": "Return result", "content": "When the queue empties, all levels have been collected in reverse order. Return \`list(result)\`. The deepest level is at index 0, the root level is last." } ] }
\`\`\`

\`\`\`algoviz
{ "title": "BFS — Watching Levels Build Bottom-Up", "type": "tree", "data": [3, 9, 20, null, null, 15, 7], "frames": [ { "highlight": [0], "label": "Start: queue = [3], result = []", "stats": { "queue": "[3]", "result": "[]" } }, { "highlight": [0], "label": "Dequeue 3, enqueue children 9 and 20 → prepend [3] to front", "stats": { "queue": "[9, 20]", "result": "[[3]]" } }, { "highlight": [1, 2], "label": "Dequeue 9 (no children), dequeue 20 → enqueue 15 and 7 → prepend [9, 20]", "stats": { "queue": "[15, 7]", "result": "[[9,20],[3]]" } }, { "highlight": [5, 6], "label": "Dequeue 15 and 7 (both leaves, no children) → prepend [15, 7]", "stats": { "queue": "[]", "result": "[[15,7],[9,20],[3]]" } }, { "highlight": [5, 6], "label": "Queue empty — return [[15,7],[9,20],[3]]", "stats": { "queue": "[]", "result": "[[15,7],[9,20],[3]]" } } ], "speed": 900 }
\`\`\`

### Two Ways to Flip the Result

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Simple: collect levels normally, reverse at end", "code": "from collections import deque\\n\\ndef levelOrderBottom(root):\\n    if not root:\\n        return []\\n    result = []\\n    queue = deque([root])\\n    while queue:\\n        level_size = len(queue)\\n        level = []\\n        for _ in range(level_size):\\n            node = queue.popleft()\\n            level.append(node.val)\\n            if node.left:\\n                queue.append(node.left)\\n            if node.right:\\n                queue.append(node.right)\\n        result.append(level)      # append to back\\n    return result[::-1]           # one extra O(L) reverse pass" }, "after": { "label": "Optimal: deque with appendleft — O(1) front insertion", "code": "from collections import deque\\n\\ndef levelOrderBottom(root):\\n    if not root:\\n        return []\\n    result = deque()              # result is also a deque\\n    queue = deque([root])\\n    while queue:\\n        level_size = len(queue)\\n        level = []\\n        for _ in range(level_size):\\n            node = queue.popleft()\\n            level.append(node.val)\\n            if node.left:\\n                queue.append(node.left)\\n            if node.right:\\n                queue.append(node.right)\\n        result.appendleft(level)  # O(1) prepend — no shifting\\n    return list(result)" } }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "appendleft vs insert(0, x)", "content": "Python's \`list.insert(0, x)\` must shift every existing element one position right — that is O(L) per call, where L is the current list length. \`deque.appendleft\` is O(1) because a deque keeps a pointer to both ends. For this problem the difference is minor, but knowing it signals strong Python fluency in an interview." }
\`\`\`

### Execution Trace

\`\`\`trace
{ "title": "Tracing levelOrderBottom on [3, 9, 20, null, null, 15, 7]", "language": "python", "code": "from collections import deque\\n\\ndef levelOrderBottom(root):\\n    if not root:\\n        return []\\n    result = deque()\\n    queue = deque([root])\\n    while queue:\\n        level_size = len(queue)\\n        level = []\\n        for _ in range(level_size):\\n            node = queue.popleft()\\n            level.append(node.val)\\n            if node.left: queue.append(node.left)\\n            if node.right: queue.append(node.right)\\n        result.appendleft(level)\\n    return list(result)", "frames": [ { "line": 4, "vars": { "queue": "deque([Node(3)])", "result": "deque([])" }, "note": "Root is not None — proceed" }, { "line": 9, "vars": { "level_size": 1, "level": "[]" }, "note": "Level 0 has 1 node" }, { "line": 12, "vars": { "node": "Node(3)", "level": "[3]", "queue": "deque([Node(9), Node(20)])" }, "note": "Dequeue 3, enqueue children 9 and 20" }, { "line": 16, "vars": { "result": "deque([[3]])" }, "note": "Prepend [3] — it goes to the front" }, { "line": 9, "vars": { "level_size": 2, "level": "[]" }, "note": "Level 1 has 2 nodes" }, { "line": 12, "vars": { "node": "Node(9)", "level": "[9]", "queue": "deque([Node(20)])" }, "note": "Dequeue 9 — no children to enqueue" }, { "line": 12, "vars": { "node": "Node(20)", "level": "[9, 20]", "queue": "deque([Node(15), Node(7)])" }, "note": "Dequeue 20, enqueue children 15 and 7" }, { "line": 16, "vars": { "result": "deque([[9,20],[3]])" }, "note": "Prepend [9,20] in front of [3]" }, { "line": 9, "vars": { "level_size": 2, "level": "[]" }, "note": "Level 2 has 2 nodes (both leaves)" }, { "line": 12, "vars": { "node": "Node(15)", "level": "[15]", "queue": "deque([Node(7)])" }, "note": "Dequeue 15 — leaf, no children" }, { "line": 12, "vars": { "node": "Node(7)", "level": "[15, 7]", "queue": "deque([])" }, "note": "Dequeue 7 — leaf, queue now empty" }, { "line": 16, "vars": { "result": "deque([[15,7],[9,20],[3]])" }, "note": "Prepend [15,7] — queue exhausted after this" }, { "line": 17, "vars": { "return": "[[15,7],[9,20],[3]]" }, "note": "Convert deque to list and return" } ], "speed": 800 }
\`\`\`

### Complexity

| | Time | Space |
|---|---|---|
| Traversal | O(N) — every node visited exactly once | O(W) — queue holds at most one level (W = max width) |
| Result | O(N) — all node values stored | O(N) — total across all levels |

\`\`\`callout
{ "type": "info", "title": "O(W) queue, O(N) total", "content": "The BFS queue holds at most one level at a time. For a balanced binary tree the bottom level has roughly N/2 nodes, so worst-case queue space is O(N). The result list stores all N values regardless. Both the naive and deque approaches have the same asymptotic complexity — the deque only saves constant-factor work on insertions." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "What is the minimum change needed to convert a standard level-order BFS into reverse level-order traversal?", "options": ["Use a stack instead of a queue for the traversal", "Reverse the order of the collected levels before returning", "Process right children before left children", "Use post-order DFS instead of BFS"], "answer": 1, "explanation": "The BFS traversal itself is completely unchanged — same queue, same level-by-level processing, same left-before-right child enqueue order. You only need to reverse the collected levels: either prepend each new level to the front, or reverse the full result list at the end." }, { "question": "For a complete binary tree with 15 nodes (4 levels), what is the peak number of nodes in the BFS queue during traversal?", "options": ["4", "7", "8", "15"], "answer": 2, "explanation": "In a complete binary tree with 4 levels (heights 0–3), the bottom level holds 8 nodes (2^3). The queue peaks when it holds all nodes of the widest level simultaneously — that is 8 for this tree. Queue space is O(W) where W is the maximum width." }, { "question": "What advantage does deque.appendleft(x) have over list.insert(0, x)?", "options": ["It preserves the original traversal order", "It avoids copying the result deque", "It runs in O(1) rather than O(L) where L is the current length", "It automatically handles None nodes"], "answer": 2, "explanation": "Python's list.insert(0, x) must shift every existing element one position to the right, costing O(L). deque.appendleft runs in O(1) because a deque (doubly-ended queue) stores pointers to both ends — prepending only updates the head pointer, no shifting required." }, { "question": "Given the tree [1, 2, 3, 4, 5] (level-order input, so 4 and 5 are children of 2), what is the correct reverse level order output?", "options": ["[[1], [2, 3], [4, 5]]", "[[4, 5], [2, 3], [1]]", "[[5, 4], [3, 2], [1]]", "[[4, 5], [3, 2], [1]]"], "answer": 1, "explanation": "BFS always processes children left-to-right, so the bottom level is [4, 5] (not [5, 4]). Node 3 has no children. Level order top-down is [[1], [2, 3], [4, 5]], so reversed it becomes [[4, 5], [2, 3], [1]]." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Reverse level order is standard BFS with one change: prepend each level to the result front, or collect normally and reverse at the end.", "The traversal itself is unchanged — same queue, same left-to-right child order.", "Time complexity is O(N) — every node is visited exactly once.", "Queue space is O(W) where W is the maximum width; total space including output is O(N).", "Use collections.deque with appendleft for O(1) front insertion over list.insert(0, x) which costs O(L)." ] }
\`\`\``,
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

Zigzag traversal is level-order traversal with a twist: each level flips its reading direction. Level 0 goes left→right, level 1 goes right→left, level 2 goes left→right, and so on — like a snake weaving through the tree.

\`\`\`concept
{ "title": "The Zigzag Mental Model", "variant": "analogy", "content": "Think of a stadium doing a wave. Row 1 raises hands left-to-right, row 2 right-to-left, row 3 left-to-right. Each row of seats is a tree level; the direction alternates every row. BFS gives you each row in order — you just decide which way to read it before writing it down." }
\`\`\`

### Problem Statement

Given a binary tree, return the zigzag level order traversal of its nodes' values. Alternate the direction for each level: even-indexed levels (0, 2, 4…) go **left → right**, odd-indexed levels (1, 3, 5…) go **right → left**.

\`\`\`
Input:  root = [3, 9, 20, null, null, 15, 7]

         3          ← level 0: left→right  → [3]
        / \\
       9  20        ← level 1: right→left  → [20, 9]
         /  \\
        15   7      ← level 2: left→right  → [15, 7]

Output: [[3], [20, 9], [15, 7]]
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why Not Just Enqueue in Reverse?", "content": "A common mistake is to enqueue children right-before-left on odd levels. This breaks future levels because enqueue order determines what children get processed next. Always enqueue left-then-right regardless — only change how you *record* the level's values." }
\`\`\`

### Algorithm Walkthrough

\`\`\`steps
{ "title": "BFS with Level Reversal", "steps": [ { "title": "Initialize the queue", "content": "Push root into a deque. Set \`level_index = 0\`.\\n\\n\`\`\`python\\nfrom collections import deque\\nqueue = deque([root])\\nresult = []\\nlevel_index = 0\\n\`\`\`" }, { "title": "Process one level at a time", "content": "Snapshot the current queue size — this is exactly the number of nodes at this level. Use a \`for\` loop over that count, not a \`while\`, so you don't bleed into the next level.\\n\\n\`\`\`python\\nwhile queue:\\n    level_size = len(queue)\\n    current_level = []\\n    for _ in range(level_size):\\n        node = queue.popleft()\\n        current_level.append(node.val)\\n        if node.left:  queue.append(node.left)\\n        if node.right: queue.append(node.right)\\n\`\`\`" }, { "title": "Reverse odd-indexed levels", "content": "After collecting a level's values left-to-right, flip the list if \`level_index\` is odd. This is O(w) per level where w is the level width — dominated by the O(n) traversal anyway.\\n\\n\`\`\`python\\n    if level_index % 2 == 1:\\n        current_level.reverse()\\n    result.append(current_level)\\n    level_index += 1\\n\`\`\`" }, { "title": "Return the result", "content": "After the while loop, \`result\` holds all levels in zigzag order.\\n\\n\`\`\`python\\nreturn result\\n\`\`\`" } ] }
\`\`\`

### Visualising the Execution

The animation below runs the algorithm on \`[3, 9, 20, null, null, 15, 7]\`. Watch the queue snapshot at each level and note when the reversal fires.

\`\`\`algoviz
{ "title": "Zigzag BFS — step by step", "type": "tree", "data": { "val": 3, "left": { "val": 9, "left": null, "right": null }, "right": { "val": 20, "left": { "val": 15, "left": null, "right": null }, "right": { "val": 7, "left": null, "right": null } } }, "frames": [ { "highlight": [0], "label": "Level 0: dequeue 3. Enqueue children 9, 20.", "stats": { "level": 0, "direction": "L→R", "queue": "[9, 20]", "collected": "[3]" } }, { "highlight": [1, 2], "label": "Level 1: dequeue 9 then 20. Enqueue 20's children (15, 7).", "stats": { "level": 1, "direction": "R→L (reverse after)", "queue": "[15, 7]", "collected": "[9, 20] → reversed → [20, 9]" } }, { "highlight": [3, 4], "label": "Level 2: dequeue 15 then 7. No children to enqueue.", "stats": { "level": 2, "direction": "L→R", "queue": "[]", "collected": "[15, 7]" } } ], "speed": 900 }
\`\`\`

### Two Approaches Compared

Both approaches solve the problem in O(n) time, but they differ in *when* the zigzag order is established.

\`\`\`tabs
{ "tabs": [ { "label": "Approach 1 — Reverse after collect", "icon": "🔄", "content": "Collect the full level left-to-right (same as regular BFS), then call \`.reverse()\` on odd levels.\\n\\n\`\`\`python\\nfrom collections import deque\\n\\ndef zigzag_level_order(root):\\n    if not root:\\n        return []\\n    result, queue = [], deque([root])\\n    level_index = 0\\n    while queue:\\n        level_size = len(queue)\\n        current_level = []\\n        for _ in range(level_size):\\n            node = queue.popleft()\\n            current_level.append(node.val)\\n            if node.left:  queue.append(node.left)\\n            if node.right: queue.append(node.right)\\n        if level_index % 2 == 1:\\n            current_level.reverse()\\n        result.append(current_level)\\n        level_index += 1\\n    return result\\n\`\`\`\\n\\n**Pros:** Easiest to understand; directly extends the standard level-order template.\\n\\n**Cons:** \`.reverse()\` allocates a reversed copy per odd level (minor overhead)." }, { "label": "Approach 2 — Deque insert-at-front", "icon": "⚡", "content": "Use a \`deque\` for each level. On L→R levels append to the right; on R→L levels append to the **left** (front). No reversal step needed.\\n\\n\`\`\`python\\nfrom collections import deque\\n\\ndef zigzag_level_order(root):\\n    if not root:\\n        return []\\n    result, queue = [], deque([root])\\n    left_to_right = True\\n    while queue:\\n        level_size = len(queue)\\n        current_level = deque()\\n        for _ in range(level_size):\\n            node = queue.popleft()\\n            if left_to_right:\\n                current_level.append(node.val)       # add to right\\n            else:\\n                current_level.appendleft(node.val)   # add to left\\n            if node.left:  queue.append(node.left)\\n            if node.right: queue.append(node.right)\\n        result.append(list(current_level))\\n        left_to_right = not left_to_right\\n    return result\\n\`\`\`\\n\\n**Pros:** Builds zigzag order in one pass; O(1) per insertion.\\n\\n**Cons:** Slightly less obvious; requires converting deque → list at the end." } ] }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Interview Recommendation", "content": "Lead with Approach 1 — it's an obvious extension of the standard BFS template your interviewer already knows. Mention Approach 2 as an optimisation if asked about avoiding extra allocations. Naming the deque \`appendleft\` trick specifically signals deep knowledge." }
\`\`\`

### Complexity Analysis

| | Time | Space |
|---|---|---|
| **Traversal** | O(n) — every node visited exactly once | O(w) — queue holds at most one full level |
| **Reversal (Approach 1)** | O(w) extra per odd level, O(n) total | O(w) for the reversed copy |
| **Deque insert (Approach 2)** | O(1) per node | O(w) for the level deque |

where **n** = total nodes, **w** = maximum level width (O(n) in a complete tree's last row).

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "In the BFS-with-reversal approach, why must children always be enqueued left-before-right even on odd (right-to-left) levels?", "options": ["Enqueue order determines which children appear in the result first", "Enqueue order determines the BFS processing order for the *next* level", "The queue only supports FIFO for left children", "Reversing the enqueue order would corrupt the queue's internal state"], "answer": 1, "explanation": "The queue controls the order in which nodes are *dequeued* on the next level. If you enqueue right-before-left to 'fix' an odd level, you've corrupted the natural left-to-right order for all subsequent even levels. Always enqueue left→right and handle direction only when recording values." }, { "question": "Using the deque approach, what does \`current_level.appendleft(node.val)\` achieve for a right-to-left level?", "options": ["It reverses the deque in place", "It inserts the value at the front, so nodes encountered left-first appear at the right of the final list", "It pops the last element and replaces it", "It enqueues the node's children in reverse order"], "answer": 1, "explanation": "BFS dequeues nodes left-to-right (9 before 20 at level 1). On a right-to-left level we want 20 before 9 in the output. By prepending each node as it's dequeued, the last node dequeued (rightmost) ends up at the front — giving us right-to-left order without a separate reversal pass." }, { "question": "What is the space complexity of the output list itself (not counting the queue)?", "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"], "answer": 2, "explanation": "The output contains every node's value exactly once across all level lists, so it requires O(n) space regardless of approach." }, { "question": "For the tree [1, 2, 3, 4, 5, 6, 7], what is the correct zigzag output?", "options": ["[[1], [2,3], [4,5,6,7]]", "[[1], [3,2], [4,5,6,7]]", "[[1], [3,2], [7,6,5,4]]", "[[1], [2,3], [7,6,5,4]]"], "answer": 1, "explanation": "Level 0 (index 0, L→R): [1]. Level 1 (index 1, R→L): nodes are 2 and 3 collected L→R, reversed → [3, 2]. Level 2 (index 2, L→R): nodes 4,5,6,7 collected L→R, no reversal → [4,5,6,7]. Final: [[1],[3,2],[4,5,6,7]]." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Zigzag traversal = standard BFS + reverse every odd-indexed level. Build on your existing level-order template.", "Always enqueue children left-then-right regardless of level direction — queue order drives the *next* level's processing.", "The deque appendleft trick builds each level in the correct order in one pass, trading subtlety for a minor allocation saving.", "Time is O(n) and space is O(w) — identical to regular level-order traversal; the reversal adds no asymptotic cost.", "In interviews, state the approach explicitly: 'I'll do level-order BFS and reverse the collected values on odd levels' — this proves you understand *why*, not just that you memorised the trick." ] }
\`\`\``,
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

\`\`\`concept
{ "title": "The Level-Snapshot Pattern", "variant": "mental-model", "content": "BFS uses a queue that naturally holds all nodes of one level at a time. The key insight: capture \`level_size = len(queue)\` BEFORE you start processing — this freezes the count for the current level even as you enqueue next-level children into the same queue." }
\`\`\`

### Problem Statement

Given the root of a binary tree, return an array of the **average value** of nodes at each level, from top to bottom.

\`\`\`
Input:  root = [3, 9, 20, null, null, 15, 7]

         3          ← Level 0: avg = 3/1   = 3.0
        / \\
       9  20        ← Level 1: avg = 29/2  = 14.5
         /  \\
        15   7      ← Level 2: avg = 22/2  = 11.0

Output: [3.0, 14.5, 11.0]
\`\`\`

\`\`\`concept
{ "title": "Why BFS and Not DFS?", "variant": "insight", "content": "DFS visits node 15 before node 20 — it dives deep before finishing a level, so you'd never know when a level ends without extra bookkeeping. BFS's FIFO queue guarantees every level-k node is processed before any level-(k+1) node, making per-level aggregation effortless." }
\`\`\`

### Algorithm Walkthrough

The BFS queue state at each stage, with all 5 nodes in BFS discovery order \`[3, 9, 20, 15, 7]\`:

\`\`\`algoviz
{ "title": "Queue Processing — Level by Level", "type": "array", "data": [3, 9, 20, 15, 7], "frames": [ { "highlight": [0], "label": "Start: queue = [3]. Level 0 has 1 node. Dequeue 3, enqueue children 9 and 20.", "stats": { "level": 0, "level_sum": 3, "level_size": 1, "avg": "3.0" } }, { "highlight": [1, 2], "label": "Level 1 snapshot: queue = [9, 20]. level_size = 2. Process both nodes.", "stats": { "level": 1, "level_sum": "9+20=29", "level_size": 2, "avg": "—" } }, { "highlight": [1], "label": "Dequeue 9 (leaf). level_sum = 9. No children to enqueue.", "stats": { "level": 1, "level_sum": 9, "level_size": 2, "avg": "—" } }, { "highlight": [2], "label": "Dequeue 20. level_sum = 29. Enqueue children 15 and 7. Append 29/2 = 14.5.", "stats": { "level": 1, "level_sum": 29, "level_size": 2, "avg": "14.5" } }, { "highlight": [3, 4], "label": "Level 2 snapshot: queue = [15, 7]. level_size = 2. Process both leaf nodes. Append 22/2 = 11.0.", "stats": { "level": 2, "level_sum": "15+7=22", "level_size": 2, "avg": "11.0" } } ], "speed": 900 }
\`\`\`

### Implementation

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Missing snapshot — WRONG", "code": "while queue:\\n    level_sum = 0\\n    level_size = 0\\n    # BUG: len(queue) shrinks as we popleft\\n    # and grows as we append children —\\n    # this loop never terminates correctly\\n    while queue:          # can't tell when a level ends\\n        node = queue.popleft()\\n        level_sum += node.val\\n        level_size += 1\\n        if node.left: queue.append(node.left)\\n        if node.right: queue.append(node.right)\\n    result.append(level_sum / level_size)" }, "after": { "label": "Snapshot before loop — CORRECT", "code": "while queue:\\n    level_size = len(queue)  # snapshot current level count\\n    level_sum = 0\\n\\n    for _ in range(level_size):  # process exactly this many\\n        node = queue.popleft()\\n        level_sum += node.val\\n        if node.left: queue.append(node.left)\\n        if node.right: queue.append(node.right)\\n\\n    result.append(level_sum / level_size)" } }
\`\`\`

\`\`\`playground
{ "title": "averageOfLevels — Python", "language": "python", "runnable": true, "code": "from collections import deque\\n\\nclass TreeNode:\\n    def __init__(self, val=0, left=None, right=None):\\n        self.val = val\\n        self.left = left\\n        self.right = right\\n\\ndef averageOfLevels(root):\\n    if not root:\\n        return []\\n\\n    result = []\\n    queue = deque([root])\\n\\n    while queue:\\n        level_size = len(queue)   # snapshot\\n        level_sum = 0\\n\\n        for _ in range(level_size):\\n            node = queue.popleft()\\n            level_sum += node.val\\n            if node.left:  queue.append(node.left)\\n            if node.right: queue.append(node.right)\\n\\n        result.append(level_sum / level_size)\\n\\n    return result\\n\\n# Build tree: [3, 9, 20, null, null, 15, 7]\\nroot = TreeNode(3)\\nroot.left = TreeNode(9)\\nroot.right = TreeNode(20)\\nroot.right.left = TreeNode(15)\\nroot.right.right = TreeNode(7)\\n\\nprint(averageOfLevels(root))  # [3.0, 14.5, 11.0]" }
\`\`\`

### Execution Trace

\`\`\`trace
{ "title": "Tracing averageOfLevels on [3, 9, 20, null, null, 15, 7]", "language": "python", "code": "result = []\\nqueue = deque([root])      # root.val = 3\\n\\n# --- Level 0 ---\\nlevel_size = len(queue)    # 1\\nlevel_sum = 0\\nnode = queue.popleft()     # val = 3\\nlevel_sum += node.val      # 3\\nqueue.append(node.left)    # enqueue 9\\nqueue.append(node.right)   # enqueue 20\\nresult.append(3 / 1)       # [3.0]\\n\\n# --- Level 1 ---\\nlevel_size = len(queue)    # 2\\nlevel_sum = 0\\nnode = queue.popleft()     # val = 9 (no children)\\nlevel_sum += node.val      # 9\\nnode = queue.popleft()     # val = 20\\nlevel_sum += node.val      # 29\\nqueue.append(node.left)    # enqueue 15\\nqueue.append(node.right)   # enqueue 7\\nresult.append(29 / 2)      # [3.0, 14.5]\\n\\n# --- Level 2 ---\\nlevel_size = len(queue)    # 2\\nlevel_sum = 0\\nnode = queue.popleft()     # val = 15 (leaf)\\nlevel_sum += node.val      # 15\\nnode = queue.popleft()     # val = 7 (leaf)\\nlevel_sum += node.val      # 22\\nresult.append(22 / 2)      # [3.0, 14.5, 11.0]", "frames": [ { "line": 2, "vars": { "queue": "[3]", "result": "[]" }, "note": "Queue initialized with root" }, { "line": 5, "vars": { "level_size": 1, "level_sum": 0 }, "note": "Snapshot: 1 node at level 0" }, { "line": 9, "vars": { "queue": "[9, 20]", "level_sum": 3 }, "note": "Process node 3, enqueue its children" }, { "line": 11, "vars": { "result": "[3.0]" }, "note": "Level 0 done", "stdout": "Level 0 avg: 3.0" }, { "line": 14, "vars": { "level_size": 2, "level_sum": 0 }, "note": "Snapshot: 2 nodes at level 1" }, { "line": 17, "vars": { "queue": "[20]", "level_sum": 9 }, "note": "Process node 9 — leaf, no children" }, { "line": 21, "vars": { "queue": "[15, 7]", "level_sum": 29 }, "note": "Process node 20, enqueue 15 and 7" }, { "line": 22, "vars": { "result": "[3.0, 14.5]" }, "note": "Level 1 done", "stdout": "Level 1 avg: 14.5" }, { "line": 25, "vars": { "level_size": 2, "level_sum": 0 }, "note": "Snapshot: 2 nodes at level 2" }, { "line": 30, "vars": { "queue": "[]", "level_sum": 22 }, "note": "Both leaf nodes processed" }, { "line": 31, "vars": { "result": "[3.0, 14.5, 11.0]" }, "note": "Level 2 done — queue empty, loop exits", "stdout": "Level 2 avg: 11.0" } ], "speed": 800 }
\`\`\`

### Complexity

| | Complexity | Reason |
|---|---|---|
| **Time** | O(n) | Every node is enqueued and dequeued exactly once |
| **Space** | O(w) | Queue holds at most one full level; \`w\` = maximum width |

\`\`\`callout
{ "type": "info", "title": "What Is Maximum Width?", "content": "For a **complete binary tree**, the widest level holds ⌈n/2⌉ nodes, so O(w) = O(n). For a **skewed tree** (every node has only one child), the queue never exceeds 1 node, so O(w) = O(1). In the worst case, space is O(n)." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Related Level-Order Problems", "content": "Once you can compute level averages, the same BFS template solves a whole family of problems by swapping only the aggregation step:\\n\\n| Problem | Aggregation change |\\n|---|---|\\n| **Max of each level** (LC 515) | Track running \`max\` instead of sum |\\n| **Min of each level** | Track running \`min\` |\\n| **Level sums** (LC 1161) | Return sum, not sum/size |\\n| **Right side view** (LC 199) | Record only the *last* node per level |\\n| **Level order traversal** (LC 102) | Collect all values per level into a list |\\n\\nThe queue management — snapshot, for-loop, enqueue children — never changes." }
\`\`\`

\`\`\`quiz
{ "title": "Level Averages — Check Your Understanding", "questions": [ { "question": "Why must \`level_size = len(queue)\` be captured BEFORE the inner for-loop begins?", "options": ["len() is O(n) and is too slow inside the loop", "The queue grows as children are enqueued during the loop; the snapshot tells us exactly how many nodes belong to the current level", "Python's deque doesn't support len() inside a while loop", "It avoids an IndexError when the queue is empty"], "answer": 1, "explanation": "During the inner loop we append next-level children to the same queue. Without a snapshot, len(queue) would change mid-loop, causing us to accidentally process next-level nodes as if they belonged to the current level." }, { "question": "The input tree has a single root node with no children (val = 7). What does the function return?", "options": ["[]", "[0.0]", "[7.0]", "None"], "answer": 2, "explanation": "There is exactly one level containing one node. level_size = 1, level_sum = 7, average = 7/1 = 7.0. The function returns [7.0]." }, { "question": "You need to solve LeetCode 515 — 'Find Largest Value in Each Tree Row'. Using the same BFS template, what is the ONLY line that changes?", "options": ["Replace \`queue = deque([root])\` with \`stack = [root]\`", "Replace \`result.append(level_sum / level_size)\` with \`result.append(level_max)\`", "Add a \`visited\` set and check it before enqueueing children", "Change the for-loop to a while-loop"], "answer": 1, "explanation": "The queue setup, the level snapshot, and the child-enqueueing logic are identical. The only change is the aggregation: instead of accumulating a sum and dividing, you track the running maximum across nodes at each level." }, { "question": "What happens if you pass \`root = None\` to this implementation?", "options": ["It raises a TypeError on queue.popleft()", "It enters an infinite loop because the while condition is never False", "It immediately returns [] due to the early guard", "It returns [0.0]"], "answer": 2, "explanation": "The first line of the function checks \`if not root: return []\`. A None input hits this guard immediately and returns an empty list before the queue is ever created." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Snapshot \`level_size = len(queue)\` before the inner for-loop — children added during processing belong to the next level, not the current one", "BFS's FIFO guarantee means all level-k nodes are processed before any level-(k+1) node, making per-level aggregation natural", "Time is O(n) — each node enters and leaves the queue exactly once; space is O(w) where w is the maximum level width", "The level-snapshot template is reusable: swap the aggregation (sum/max/min/last) to solve a whole family of BFS tree problems" ] }
\`\`\``,
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

The minimum depth of a binary tree is the number of nodes along the **shortest path** from the root down to the nearest **leaf node** — a node with no children at all.

\`\`\`concept
{ "title": "Why BFS, Not DFS?", "variant": "mental-model", "content": "DFS dives deep before exploring siblings — it might traverse an entire branch of depth 10 before discovering a leaf at depth 2 on the other side. BFS explores level by level, so the very first leaf it encounters is guaranteed to be the shallowest. This is the core reason BFS is optimal for minimum-depth problems." }
\`\`\`

### Problem Statement

Given a binary tree, return the **minimum depth** — the number of nodes along the shortest root-to-leaf path.

\`\`\`callout
{ "type": "warning", "title": "Leaf node definition", "content": "A leaf has **no children** — both \`left\` and \`right\` are null. A node with only one child is NOT a leaf. This is the key trap in the skewed-tree test case." }
\`\`\`

### Two Key Examples

\`\`\`tabs
{ "tabs": [
  { "label": "Balanced Tree", "icon": "🌲", "content": "\`\`\`\\n     3\\n    / \\\\\\n   9  20\\n     /  \\\\\\n    15   7\\n\`\`\`\\n\\n**Input:** \`[3, 9, 20, null, null, 15, 7]\`  \\n**Output:** \`2\`  \\n**Path:** 3 → 9 (node 9 is a leaf with no children)\\n\\nBFS reaches node 9 at depth 2 — the left branch is shallower than the right, and BFS finds it first." },
  { "label": "Skewed Tree", "icon": "📐", "content": "\`\`\`\\n2\\n \\\\\\n  3\\n   \\\\\\n    4\\n     \\\\\\n      5\\n       \\\\\\n        6\\n\`\`\`\\n\\n**Input:** \`[2, null, 3, null, 4, null, 5, null, 6]\`  \\n**Output:** \`5\`  \\n**Why:** Node 2 has a right child — it is NOT a leaf. BFS must descend all 5 levels before hitting leaf 6." }
] }
\`\`\`

### BFS Execution — Level by Level

\`\`\`algoviz
{ "title": "Minimum Depth BFS on [3, 9, 20, null, null, 15, 7]", "type": "tree", "data": [3, 9, 20, null, null, 15, 7], "frames": [ { "highlight": [0], "label": "Initialize: enqueue root (3) with depth 1.", "stats": { "depth": 1, "queue": "[(3,1)]" } }, { "highlight": [0], "label": "Dequeue 3. Has children 9 and 20 — not a leaf. Enqueue both at depth 2.", "stats": { "depth": 1, "queue": "[(9,2),(20,2)]" } }, { "highlight": [1], "label": "Dequeue 9. No left child, no right child — LEAF FOUND at depth 2. Return 2.", "stats": { "depth": 2, "queue": "[(20,2)]" } } ], "speed": 1000 }
\`\`\`

### Solution

The implementation pairs each node with its current depth in the queue, so we can return immediately on the first leaf without counting levels externally.

\`\`\`trace
{ "title": "Tracing minDepth on [3, 9, 20, null, null, 15, 7]", "language": "python", "code": "from collections import deque\\n\\ndef minDepth(root):\\n    if not root:\\n        return 0\\n    queue = deque([(root, 1)])\\n    while queue:\\n        node, depth = queue.popleft()\\n        if not node.left and not node.right:\\n            return depth\\n        if node.left:\\n            queue.append((node.left, depth + 1))\\n        if node.right:\\n            queue.append((node.right, depth + 1))", "frames": [ { "line": 4, "vars": { "root": "Node(3)", "queue": "[(Node(3),1)]" }, "note": "Root exists. Initialize queue with (root, depth=1)." }, { "line": 7, "vars": { "node": "Node(3)", "depth": 1, "queue": "[]" }, "note": "Dequeue first item: node=3, depth=1." }, { "line": 8, "vars": { "node": "Node(3)" }, "note": "Node 3 has left child (9) and right child (20) — not a leaf. Skip return." }, { "line": 10, "vars": { "queue": "[(Node(9),2)]" }, "note": "Node 3 has a left child. Enqueue (9, depth+1=2)." }, { "line": 12, "vars": { "queue": "[(Node(9),2),(Node(20),2)]" }, "note": "Node 3 has a right child. Enqueue (20, depth+1=2)." }, { "line": 7, "vars": { "node": "Node(9)", "depth": 2, "queue": "[(Node(20),2)]" }, "note": "Dequeue next: node=9, depth=2." }, { "line": 9, "vars": { "node": "Node(9)" }, "note": "Node 9: left=null, right=null → LEAF! Return 2.", "stdout": "2" } ], "speed": 900 }
\`\`\`

### The One-Child Trap

\`\`\`concept
{ "title": "One Child ≠ Leaf", "variant": "rule", "content": "If a node has exactly one child, it is an internal node, not a leaf. The condition \`not node.left and not node.right\` must be strictly true. In the skewed tree [2, null, 3, …], node 2 has a right child, so BFS enqueues that child and continues — it does NOT return depth 1." }
\`\`\`

### Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(n) worst case | Every node visited at most once (skewed tree hits every node) |
| **Space** | O(w) | Queue holds at most one full level; w = maximum level width |

\`\`\`callout
{ "type": "success", "title": "Early-exit advantage", "content": "In practice, BFS exits the moment it finds the shallowest leaf — often visiting far fewer than n nodes. A DFS approach must explore every path and compare all leaf depths, with no early exit. For wide, balanced trees BFS wins significantly in the best case." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "For the skewed tree [2, null, 3, null, 4, null, 5, null, 6], why does BFS return depth 5 and not 1?", "options": [ "BFS always returns the maximum depth of the tree", "Node 2 has a right child, so it is not a leaf", "BFS processes right children before left children", "The tree has more than 3 nodes" ], "answer": 1, "explanation": "A leaf node must have no children at all. Node 2 has a right child (node 3), so the leaf condition fails. BFS enqueues the right child and continues descending until it reaches node 6, which has zero children." }, { "question": "What is the space complexity of the BFS minimum-depth solution?", "options": [ "O(n) always, because all nodes may be enqueued", "O(h) where h is the tree height", "O(w) where w is the maximum width of any single level", "O(log n) for balanced trees only" ], "answer": 2, "explanation": "The queue stores nodes level by level and never holds more than the widest level at once. For a balanced tree the widest level can be O(n/2) ≈ O(n), but when the shallowest leaf is near the root the queue stays very small. O(w) captures this correctly." }, { "question": "Which condition correctly identifies a leaf node in the BFS loop?", "options": [ "node.left is None", "node.right is None", "node.left is None and node.right is None", "node.val == 0" ], "answer": 2, "explanation": "A leaf has no children at all — both left AND right must be null. Checking only one side would misclassify nodes that have exactly one child (like the root of the skewed-tree example) as leaves, causing an incorrect early return." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Minimum depth = node count on the shortest root-to-leaf path; a leaf has zero children.", "BFS is optimal: exploring level by level guarantees the first leaf found is the shallowest — return immediately.", "The one-child trap is the main edge case: a node with exactly one child is NOT a leaf.", "Time complexity is O(n) worst case; space complexity is O(w) for the queue where w is the maximum level width.", "Pairing each queued node with its depth avoids a separate level-counting loop and simplifies the code." ] }
\`\`\``,
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

Great work completing the Tree BFS module. Before you move on, let's solidify what you've built — from the core queue mechanism to the traversal variants you can now reach for in an interview.

---

### What You Covered

In this module you learned five techniques, all built on the same queue-driven foundation:

| Technique | Key Idea |
|---|---|
| **Level order traversal** | Process all nodes at depth *d* before depth *d+1* |
| **Reverse level order** | Same traversal, reverse the final result array |
| **Zigzag traversal** | Alternate append direction each level |
| **Minimum depth** | BFS guarantees the first leaf found is the shallowest |
| **Right side view** | Capture the last node processed at each level |

---

\`\`\`algoviz
{
  "title": "BFS Level-by-Level — Watch the Queue",
  "type": "tree",
  "data": [1, 2, 3, 4, 5, 6, 7],
  "frames": [
    { "highlight": [0], "label": "Enqueue root (1). Queue: [1]", "stats": { "queue": "[1]", "level": 0 } },
    { "highlight": [0], "label": "Dequeue 1 → output. Enqueue children 2, 3. Queue: [2,3]", "stats": { "queue": "[2,3]", "level": 1 } },
    { "highlight": [1, 2], "label": "Dequeue 2 → output. Enqueue 4, 5. Queue: [3,4,5]", "stats": { "queue": "[3,4,5]", "level": 1 } },
    { "highlight": [1, 2], "label": "Dequeue 3 → output. Enqueue 6, 7. Queue: [4,5,6,7]", "stats": { "queue": "[4,5,6,7]", "level": 2 } },
    { "highlight": [3, 4, 5, 6], "label": "Dequeue 4,5,6,7 → output. Queue empty. Done!", "stats": { "queue": "[]", "level": "done" } }
  ],
  "speed": 900
}
\`\`\`

\`\`\`concept
{
  "title": "BFS vs DFS — The Core Trade-off",
  "variant": "mental-model",
  "content": "BFS explores neighbors before going deeper — like ripples spreading from a stone. DFS dives as deep as possible first — like following a path until it dead-ends.\\n\\n**BFS wins when:** you need the shortest path, earliest-found leaf, or level-grouped results.\\n**DFS wins when:** you need path existence, subtree properties, or you're constrained on memory (BFS holds an entire level in the queue at peak)."
}
\`\`\`

---

\`\`\`quiz
{
  "title": "Tree BFS — Module Quiz",
  "questions": [
    {
      "question": "Which data structure is fundamental to BFS traversal?",
      "options": [
        "Stack — LIFO, so we backtrack before going wide",
        "Queue — FIFO, so earlier nodes are processed before later ones",
        "Min-Heap — always processes smallest nodes first",
        "Array — random access makes level grouping easy"
      ],
      "answer": 1,
      "explanation": "BFS relies on a Queue (FIFO). Nodes are enqueued when discovered and dequeued in the order they arrived — this guarantees level-by-level processing. A stack would give you DFS, not BFS."
    },
    {
      "question": "What is the time complexity of BFS on a binary tree with n nodes?",
      "options": [
        "O(log n) — because the tree is height-balanced",
        "O(n) — each node is enqueued and dequeued exactly once",
        "O(n²) — we compare every node with every other node",
        "O(n log n) — each level requires a sort step"
      ],
      "answer": 1,
      "explanation": "O(n). Every node is visited exactly once — enqueued once and dequeued once. No node is skipped and none is revisited. Space complexity is O(n) in the worst case (last level of a full binary tree can hold n/2 nodes)."
    },
    {
      "question": "Why is BFS the right choice for finding minimum depth of a binary tree?",
      "options": [
        "BFS uses less memory than DFS in all cases",
        "BFS finds the shallowest leaf first and can return immediately",
        "BFS is simpler to implement than recursive DFS",
        "BFS guarantees processing leaves before internal nodes"
      ],
      "answer": 1,
      "explanation": "BFS explores level by level, so the very first leaf it encounters is guaranteed to be at the minimum depth. It can return that answer immediately without scanning the whole tree. DFS must visit every path and compare depths — O(n) work with no early exit."
    },
    {
      "question": "In zigzag level order traversal, when do you reverse the collection direction?",
      "options": [
        "Every level — always alternate left-to-right and right-to-left",
        "Every other level — odd-indexed levels are reversed",
        "Only the last level — to create the visual zig at the bottom",
        "Never — the output order comes from reversing the queue itself"
      ],
      "answer": 1,
      "explanation": "Zigzag reverses direction on every other level. Level 0 (root) goes left→right, level 1 goes right→left, level 2 goes left→right, etc. A common implementation collects each level normally, then appends to the front instead of the back for odd-indexed levels."
    },
    {
      "question": "What is the space complexity of BFS on a perfect binary tree with n nodes?",
      "options": [
        "O(log n) — proportional to tree height",
        "O(1) — BFS processes nodes in-place",
        "O(n) — the last level alone can hold ~n/2 nodes in the queue",
        "O(n²) — we store each level's nodes separately"
      ],
      "answer": 2,
      "explanation": "O(n). In a perfect binary tree, the last level has ⌈n/2⌉ nodes. At peak, the BFS queue holds the entire last level simultaneously. This contrasts with DFS, which only holds O(h) = O(log n) frames on the call stack for a balanced tree."
    }
  ]
}
\`\`\`

---

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "DFS for minimum depth — must explore every path",
    "code": "def minDepth(root):\\n    if not root:\\n        return 0\\n    if not root.left:\\n        return 1 + minDepth(root.right)\\n    if not root.right:\\n        return 1 + minDepth(root.left)\\n    return 1 + min(minDepth(root.left), minDepth(root.right))\\n# Visits EVERY node even when the answer is at depth 2"
  },
  "after": {
    "label": "BFS for minimum depth — stops at first leaf",
    "code": "from collections import deque\\ndef minDepth(root):\\n    if not root:\\n        return 0\\n    queue = deque([(root, 1)])\\n    while queue:\\n        node, depth = queue.popleft()\\n        if not node.left and not node.right:\\n            return depth   # First leaf = minimum depth\\n        if node.left:\\n            queue.append((node.left, depth + 1))\\n        if node.right:\\n            queue.append((node.right, depth + 1))\\n# Returns as soon as the shallowest leaf is found"
  }
}
\`\`\`

---

### Voice Summary Challenge

<!-- voice:checkpoint_summary -->

Your coach will ask you to explain three things without looking at your notes:

1. **The queue mechanism** — walk through a 3-level tree step by step, narrating what enters and exits the queue at each level.
2. **BFS vs DFS trade-off** — give a concrete tree problem where you'd pick BFS and one where you'd pick DFS, and explain why.
3. **Zigzag traversal** — describe the change you make to standard level-order to produce zigzag output.

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "BFS uses a queue (FIFO) to guarantee level-by-level processing — enqueue children of every dequeued node.",
    "Time complexity is O(n); space complexity peaks at O(n) when the widest level (often the last) fills the queue.",
    "BFS finds minimum depth optimally: the first leaf discovered is always the shallowest — return immediately.",
    "Zigzag traversal is standard BFS with an alternating flag: append to the front on odd-indexed levels, the back on even-indexed levels.",
    "All five module patterns (level order, reverse, zigzag, min depth, right side view) share the same queue skeleton — master the template, adapt the detail."
  ]
}
\`\`\``,
    },
  ],
};
