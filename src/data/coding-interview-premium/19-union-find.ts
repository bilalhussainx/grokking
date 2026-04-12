import { Module } from "../types";

export const unionFindModule: Module = {
  id: "union-find",
  title: "Union Find (Disjoint Set)",
  description: "Master the Union Find pattern for tracking connected components, detecting cycles, and solving dynamic connectivity problems. Essential for graph algorithms and network analysis.",
  lessons: [
    {
      id: "union-find-intro",
      slug: "union-find-intro",
      title: "Introduction to Union Find",
      content: `## The Union Find (Disjoint Set) Pattern

Union Find — also called **Disjoint Set Union (DSU)** — is a data structure that manages a collection of elements partitioned into non-overlapping subsets, supporting efficient merging and membership queries. It's the engine behind cycle detection, Kruskal's MST, and dynamic connectivity.

\`\`\`concept
{ "title": "The Core Mental Model", "variant": "analogy", "content": "Imagine tracking friend groups at school. Each person starts in their own group. When two people become friends, their groups merge. To check if Alice and Bob are in the same group, you trace each back to their group's 'representative' (root). If they share the same root — they're connected. Union Find automates exactly this, for millions of elements, in near-constant time." }
\`\`\`

<!-- voice:section_check concept="Union Find basic concept" -->

---

## Why Union Find?

Use Union Find when you need to:

1. **Track connected components** in a graph
2. **Check if two elements are connected** (same set)
3. **Merge two groups** (union operation)
4. **Detect cycles** in undirected graphs — the moment \`union(u, v)\` finds that \`find(u) == find(v)\`, a cycle exists

| Operation | Description | Optimized Complexity |
|-----------|-------------|----------------------|
| \`find(x)\` | Get root/representative of \`x\`'s set | O(α(n)) ≈ O(1) |
| \`union(x, y)\` | Merge the sets containing \`x\` and \`y\` | O(α(n)) ≈ O(1) |
| \`connected(x, y)\` | Check if \`x\` and \`y\` share a root | O(α(n)) ≈ O(1) |

*α(n) is the inverse Ackermann function — grows so slowly it's effectively constant for any practical input.*

---

## Building the Structure Step by Step

\`\`\`steps
{ "title": "Implementing Union Find", "steps": [ { "title": "Initialize: every element is its own root", "content": "Create a \`parent\` array where \`parent[i] = i\`. Each element is its own representative — n singleton sets.\\n\\n\`\`\`python\\ndef __init__(self, n):\\n    self.parent = list(range(n))  # [0, 1, 2, 3, 4]\\n    self.rank = [0] * n           # All ranks start at 0\\n\`\`\`" }, { "title": "Find: trace up to the root", "content": "Follow parent pointers until you reach a node that is its own parent. That node is the set's representative.\\n\\n\`\`\`python\\ndef find(self, x):\\n    if self.parent[x] != x:\\n        self.parent[x] = self.find(self.parent[x])  # Path compression\\n    return self.parent[x]\\n\`\`\`\\n\\n**Path compression** flattens the tree during every \`find\` call — future queries go directly to root." }, { "title": "Union: merge two sets by rank", "content": "Find both roots. If they differ, attach the shallower tree under the deeper one (union by rank) to keep trees flat.\\n\\n\`\`\`python\\ndef union(self, x, y):\\n    px, py = self.find(x), self.find(y)\\n    if px == py:\\n        return False  # Already same set — edge would create a cycle!\\n    if self.rank[px] < self.rank[py]:\\n        px, py = py, px\\n    self.parent[py] = px\\n    if self.rank[px] == self.rank[py]:\\n        self.rank[px] += 1\\n    return True\\n\`\`\`" } ] }
\`\`\`

---

## Visualizing Union Operations

Watch how sets merge as we process edges on 5 nodes:

\`\`\`algoviz
{ "title": "Union Find: merging {0,1}, {2,3}, then {1,2}", "type": "array", "data": [0, 1, 2, 3, 4], "frames": [ { "highlight": [], "label": "Initial: parent = [0,1,2,3,4]. Every node is its own root.", "stats": { "sets": 5 } }, { "highlight": [0, 1], "label": "union(0,1): find(0)=0, find(1)=1. Different roots → parent[1]=0", "stats": { "sets": 4, "parent[1]": 0 } }, { "highlight": [2, 3], "label": "union(2,3): find(2)=2, find(3)=3. Different roots → parent[3]=2", "stats": { "sets": 3, "parent[3]": 2 } }, { "highlight": [1, 2], "label": "union(1,2): find(1)→parent[1]=0 (root=0). find(2)=2. Different → parent[2]=0", "stats": { "sets": 2, "parent[2]": 0 } }, { "highlight": [0, 1, 2, 3], "label": "Now find(3): 3→parent[3]=2→parent[2]=0. Path compressed: parent[3] set to 0.", "stats": { "sets": 2, "connected(0,3)": "true" } } ], "speed": 900 }
\`\`\`

---

## The Two Optimizations That Make It Fast

\`\`\`tabs
{ "tabs": [ { "label": "Path Compression", "icon": "🗜️", "content": "**Without path compression**, \`find\` on a chain of n nodes costs O(n) — you walk every link.\\n\\n**With path compression**, after the first \`find(x)\`, every node along the path points directly to the root. All future finds on those nodes cost O(1).\\n\\n\`\`\`\\nBefore find(4):          After find(4):\\n0                        0\\n└─ 1                     ├─ 1\\n   └─ 2                  ├─ 2\\n      └─ 3               ├─ 3\\n         └─ 4            └─ 4\\n\`\`\`\\n\\nImplemented as the single recursive line:\\n\`\`\`python\\nself.parent[x] = self.find(self.parent[x])\\n\`\`\`" }, { "label": "Union by Rank", "icon": "⚖️", "content": "**Without union by rank**, naively merging sets can degrade into a chain (O(n) per find).\\n\\n**Union by rank** always attaches the shorter tree under the taller one, bounding tree height at O(log n) — and with path compression, O(α(n)) amortized.\\n\\n\`\`\`\\nBad merge (chain grows):    Good merge (rank controls height):\\n0 ← 1 ← 2 ← 3              0\\n                            ├─ 1\\n                            └─ 2\\n                               └─ 3\\n\`\`\`\\n\\nThe \`rank\` array tracks tree height. Only increment when two equal-rank roots merge — the new root's rank increases by 1." }, { "label": "Combined Effect", "icon": "⚡", "content": "Used together, path compression and union by rank achieve **amortized O(α(n))** per operation.\\n\\nα(n) is the inverse Ackermann function. For n = 2^65536 (vastly larger than atoms in the universe), α(n) = 5. In practice: **treat it as O(1)**.\\n\\n| Strategy | Find complexity |\\n|---|---|\\n| Naive (no optimizations) | O(n) worst case |\\n| Union by rank only | O(log n) |\\n| Path compression only | O(log n) amortized |\\n| **Both together** | **O(α(n)) ≈ O(1) amortized** |" } ] }
\`\`\`

<!-- voice:key_insight insight="With both optimizations, Union Find achieves amortized O(α(n)) time — effectively constant for any practical input size" -->

---

## Tracing a Complete Example

\`\`\`trace
{ "title": "Trace: find(3) with path compression on chain 3→2→1→0", "language": "python", "code": "parent = [0, 0, 1, 2]  # chain: 3→2→1→0\\n\\ndef find(x):\\n    if parent[x] != x:\\n        parent[x] = find(parent[x])\\n    return parent[x]\\n\\nresult = find(3)", "frames": [ { "line": 5, "vars": { "x": 3, "parent": "[0,0,1,2]" }, "note": "find(3): parent[3]=2, not self → recurse" }, { "line": 5, "vars": { "x": 2, "parent": "[0,0,1,2]" }, "note": "find(2): parent[2]=1, not self → recurse" }, { "line": 5, "vars": { "x": 1, "parent": "[0,0,1,2]" }, "note": "find(1): parent[1]=0, not self → recurse" }, { "line": 6, "vars": { "x": 0, "parent": "[0,0,1,2]" }, "note": "find(0): parent[0]=0 → base case, return 0" }, { "line": 5, "vars": { "x": 1, "parent": "[0,0,1,2]" }, "note": "Back in find(1): parent[1] = find(0) = 0. Compress!" }, { "line": 5, "vars": { "x": 2, "parent": "[0,0,0,2]" }, "note": "Back in find(2): parent[2] = find(1) = 0. Compress!" }, { "line": 5, "vars": { "x": 3, "parent": "[0,0,0,2]" }, "note": "Back in find(3): parent[3] = find(2) = 0. Compress!" }, { "line": 8, "vars": { "result": 0, "parent": "[0,0,0,0]" }, "note": "All nodes now point directly to root 0. Next find is O(1)." } ], "speed": 1000 }
\`\`\`

---

## When to Reach for Union Find

\`\`\`callout
{ "type": "tip", "title": "Pattern Recognition", "content": "Reach for Union Find when the problem involves:\\n- **Edge list** inputs (not adjacency list) — natural fit for processing edges one by one\\n- **Incrementally adding connections** — dynamic connectivity, not static graph traversal\\n- **Cycle detection** — if \`find(u) == find(v)\` before \`union(u, v)\`, you've found a cycle\\n- **Connected components** — count distinct roots at the end\\n- **Kruskal's MST** — sort edges by weight, union if different components\\n\\n**Prefer DFS/BFS** when you need to traverse a path or visit nodes in a specific order. Union Find only tracks *membership*, not *routes*." }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Complexity Summary", "content": "- **Find:** O(α(n)) amortized — effectively O(1)\\n- **Union:** O(α(n)) amortized — effectively O(1)\\n- **Space:** O(n) for parent and rank arrays\\n- **Build (n unions):** O(n · α(n)) ≈ O(n) total" }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Union Find Fundamentals", "questions": [ { "question": "You call union(3, 5) and find(3) == find(5) before the union. What does this tell you?", "options": ["3 and 5 are already in the same connected component", "3 and 5 have equal rank", "Path compression has already run", "The union will fail due to a rank conflict"], "answer": 0, "explanation": "If find(3) == find(5), both nodes share the same root — they're already in the same set. In cycle detection, this means adding edge (3,5) would create a cycle, since a path already exists between them." }, { "question": "What does 'path compression' do during a find(x) call?", "options": ["It deletes intermediate nodes from the tree", "It rebalances the tree using rank information", "It makes every visited node point directly to the root", "It merges two sets more efficiently"], "answer": 2, "explanation": "Path compression redirects each node visited during find to point directly to the root. This flattens the tree so future find calls on those nodes skip directly to the root in O(1)." }, { "question": "After initializing UnionFind(5), what is parent[3]?", "options": ["0", "3", "-1", "None"], "answer": 1, "explanation": "During initialization, every element is its own representative: parent[i] = i for all i. So parent[3] = 3, meaning node 3 is the root of its own singleton set." }, { "question": "Why does union by rank attach the smaller tree under the larger?", "options": ["To minimize the total number of nodes", "To prevent the rank array from overflowing", "To keep tree height bounded so find operations stay fast", "To ensure path compression works correctly"], "answer": 2, "explanation": "Union by rank bounds tree height at O(log n). Without it, naive unions can create chains of length n, making find O(n). By always merging the shorter tree under the taller one, we control depth and keep operations efficient." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Union Find tracks which elements belong to the same connected component using a parent array — each set is identified by its root element.", "find(x) returns the root of x's set; union(x, y) merges x's and y's sets. connected(x, y) is just find(x) == find(y).", "Path compression flattens the tree during find, making all future finds on those nodes O(1).", "Union by rank always attaches the shorter tree under the taller one, bounding tree height and preventing O(n) degradation.", "Combined, both optimizations give O(α(n)) ≈ O(1) amortized time — effectively constant for any real-world input size.", "Cycle detection is trivial: if find(u) == find(v) before you call union(u, v), adding edge (u, v) creates a cycle." ] }
\`\`\``,
    },
    {
      id: "number-of-provinces",
      slug: "number-of-provinces",
      title: "Number of Provinces",
      content: `## Number of Provinces

<!-- voice:section_check concept="Counting connected components" -->

\`\`\`concept
{ "title": "Province = Connected Component", "variant": "mental-model", "content": "A province is exactly a connected component in the graph. Two cities belong to the same province if and only if you can travel between them through direct or indirect connections. Union Find tracks these components dynamically — each union call merges two provinces, and the final count of distinct roots is your answer." }
\`\`\`

### Problem Statement

Given \`n\` cities and an \`n×n\` adjacency matrix \`isConnected\`, where \`isConnected[i][j] = 1\` means city \`i\` and city \`j\` are directly connected — find the total number of **provinces** (maximal groups of transitively connected cities).

| Input | Output | Why |
|-------|--------|-----|
| \`[[1,1,0],[1,1,0],[0,0,1]]\` | \`2\` | Cities 0 & 1 form one province; city 2 is isolated |
| \`[[1,0,0],[0,1,0],[0,0,1]]\` | \`3\` | Every city is its own province |

\`\`\`callout
{ "type": "info", "title": "Adjacency Matrix Symmetry", "content": "The matrix is symmetric: if \`isConnected[i][j] = 1\` then \`isConnected[j][i] = 1\`. You only need to scan the **upper triangle** (\`j > i\`) to avoid processing each undirected edge twice." }
\`\`\`

### Tracing the Algorithm

Watch how the parent array evolves as we process \`isConnected = [[1,1,0],[1,1,0],[0,0,1]]\`. The array represents \`parent[city]\` — each city's root.

\`\`\`algoviz
{ "title": "Parent Array Evolution — isConnected = [[1,1,0],[1,1,0],[0,0,1]]", "type": "array", "data": [0, 1, 2], "frames": [ { "highlight": [0, 1, 2], "label": "Init: parent = [0, 1, 2]. Each city is its own root. 3 isolated provinces.", "stats": { "provinces": 3, "step": "initialize" } }, { "highlight": [0, 1], "label": "isConnected[0][1] = 1 → union(0, 1). find(0)=0, find(1)=1 — different roots. Set parent[0] = 1. Provinces: 3 → 2.", "stats": { "provinces": 2, "step": "union(0,1)" } }, { "highlight": [0, 2], "label": "isConnected[0][2] = 0 → skip. No merge.", "stats": { "provinces": 2, "step": "skip (0,2)" } }, { "highlight": [1, 2], "label": "isConnected[1][2] = 0 → skip. No merge.", "stats": { "provinces": 2, "step": "skip (1,2)" } }, { "highlight": [1, 2], "label": "Done. parent = [1, 1, 2]. Distinct roots: {1, 2} → answer = 2 provinces.", "stats": { "provinces": 2, "step": "complete" } } ], "speed": 900 }
\`\`\`

### Step-by-Step Approach

\`\`\`steps
{ "title": "Union Find — Number of Provinces", "steps": [ { "title": "Initialize Union Find", "content": "Create \`parent[i] = i\` and \`rank[i] = 0\` for all \`n\` cities. Set \`count = n\` — every city starts as its own province. This \`count\` variable is the key: we decrement it on every successful merge." }, { "title": "Scan the Upper Triangle", "content": "Iterate \`i\` from \`0\` to \`n-1\` and \`j\` from \`i+1\` to \`n-1\`. Because the matrix is symmetric, \`j > i\` ensures each undirected edge is visited exactly once." }, { "title": "Union Connected Cities", "content": "When \`isConnected[i][j] == 1\`, call \`union(i, j)\`. Inside union: find both roots. If they differ, attach the shorter tree under the taller one (union by rank) and decrement \`count\`." }, { "title": "Return count", "content": "After the full scan, \`count\` holds the number of remaining connected components — return it directly. No need to iterate roots at the end." } ] }
\`\`\`

### Implementation

\`\`\`playground
{ "title": "Number of Provinces — Union Find with Path Compression + Union by Rank", "language": "python", "code": "class Solution:\\n    def findCircleNum(self, isConnected: list[list[int]]) -> int:\\n        n = len(isConnected)\\n        parent = list(range(n))\\n        rank = [0] * n\\n        count = n  # start: each city is its own province\\n\\n        def find(x: int) -> int:\\n            if parent[x] != x:\\n                parent[x] = find(parent[x])  # path compression\\n            return parent[x]\\n\\n        def union(x: int, y: int) -> None:\\n            nonlocal count\\n            rx, ry = find(x), find(y)\\n            if rx == ry:\\n                return  # same province, nothing to merge\\n            if rank[rx] < rank[ry]:\\n                rx, ry = ry, rx\\n            parent[ry] = rx\\n            if rank[rx] == rank[ry]:\\n                rank[rx] += 1\\n            count -= 1  # two provinces merged into one\\n\\n        for i in range(n):\\n            for j in range(i + 1, n):  # upper triangle only\\n                if isConnected[i][j] == 1:\\n                    union(i, j)\\n\\n        return count\\n\\n\\nsol = Solution()\\nprint(sol.findCircleNum([[1,1,0],[1,1,0],[0,0,1]]))  # 2\\nprint(sol.findCircleNum([[1,0,0],[0,1,0],[0,0,1]]))  # 3\\nprint(sol.findCircleNum([[1,1,0],[1,1,1],[0,1,1]]))  # 1", "runnable": true }
\`\`\`

### Complexity

- **Time:** O(n² · α(n)) — we visit all n² entries in the upper triangle; each \`union\`/\`find\` runs in near-constant O(α(n)) with path compression and union by rank.
- **Space:** O(n) for the \`parent\` and \`rank\` arrays.

\`\`\`collapse
{ "title": "Deep Dive: Why α(n) and Not O(log n)?", "content": "With **path compression** alone, \`find\` is O(log n) amortized. Adding **union by rank** tightens this to O(log* n) (iterated logarithm). Combining both yields O(α(n)) — the inverse Ackermann function — proved by Tarjan (1975). For any realistic input size, α(n) ≤ 4, making each operation effectively O(1). This is why Union Find is described as 'practically linear' despite the theoretical bound being slightly super-linear." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "For isConnected = [[1,1,0],[1,1,0],[0,0,1]], how many union calls actually merge two different components (i.e., decrement the province count)?", "options": ["0", "1", "2", "3"], "answer": 1, "explanation": "Only union(0, 1) merges distinct components — province count drops from 3 to 2. The entries at [0][2] and [1][2] are both 0, so those pairs are never even passed to union." }, { "question": "Why do we scan only j > i instead of all (i, j) pairs in the matrix?", "options": ["To reduce space complexity from O(n²) to O(n)", "The matrix is symmetric — scanning j > i visits each undirected edge exactly once", "The diagonal entries are always 1 and would corrupt the count", "Union Find requires edges in sorted order"], "answer": 1, "explanation": "isConnected is symmetric: isConnected[i][j] == isConnected[j][i]. Scanning the full matrix calls union(i, j) and union(j, i) for every edge. The second call is harmless (they're already in the same component) but wastes time. Restricting to j > i is the cleaner approach." }, { "question": "What does the \`count\` variable represent after each successful union call?", "options": ["The number of edges processed so far", "The number of remaining distinct provinces", "The depth of the tallest tree in Union Find", "The number of cities not yet visited"], "answer": 1, "explanation": "count starts at n (n isolated provinces). Every time union merges two previously separate components, count decrements by 1. When all edges are processed, count holds exactly the number of remaining connected components." }, { "question": "If all n cities form one fully connected graph (every entry is 1), what is the answer?", "options": ["n", "n − 1", "1", "0"], "answer": 2, "explanation": "All cities belong to one connected component, so there is exactly 1 province. Union Find will perform n−1 successful merges (count goes from n down to 1), and the remaining value is 1." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["Provinces are connected components — Union Find counts them directly by tracking distinct roots via a \`count\` variable decremented on each successful merge.", "Scan only the upper triangle (j > i) of the adjacency matrix; the matrix is symmetric so the full scan would double-process every edge.", "Decrement \`count\` inside \`union\` when two different roots merge — this avoids a second pass over all nodes to count roots at the end.", "Path compression + union by rank delivers O(α(n)) per operation; the full solution is O(n² · α(n)), effectively O(n²) in practice.", "The pattern — initialize count = n, union connected pairs, return count — applies to any connected-components problem given as an adjacency matrix."] }
\`\`\``,
      starterCode: `class UnionFind:
    """Union Find with path compression and union by rank."""
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n  # Number of connected components
    
    def find(self, x):
        # TODO: Implement find with path compression
        pass
    
    def union(self, x, y):
        # TODO: Implement union with union by rank
        pass


def find_circle_num(is_connected):
    """
    Return the number of provinces (connected components).
    
    Args:
        is_connected: n×n matrix where is_connected[i][j] = 1 if cities i and j are connected
    
    Returns:
        int: Number of provinces
    
    Example:
        >>> find_circle_num([[1,1,0],[1,1,0],[0,0,1]])
        2
        >>> find_circle_num([[1,0,0],[0,1,0],[0,0,1]])
        3
    """
    # TODO: Use Union Find to count connected components
    pass


# ─── Test Cases ───

# Two provinces
is_connected1 = [
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 1]
]
print(find_circle_num(is_connected1))
# Expected: 2

# Three separate provinces
is_connected2 = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]
print(find_circle_num(is_connected2))
# Expected: 3

# One big province
is_connected3 = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
]
print(find_circle_num(is_connected3))
# Expected: 1

# Larger example
is_connected4 = [
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1]
]
print(find_circle_num(is_connected4))
# Expected: 2 (provinces: {0,3} and {1,2})
`,
      solutionCode: `class UnionFind:
    """Union Find with path compression and union by rank."""
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n  # Number of connected components
    
    def find(self, x):
        """Find root with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        """Union by rank."""
        px, py = self.find(x), self.find(y)
        if px == py:
            return
        
        # Attach smaller rank tree under larger rank tree
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        
        self.count -= 1


def find_circle_num(is_connected):
    """
    Return the number of provinces (connected components).
    
    Time Complexity: O(n² × α(n))
    Space Complexity: O(n)
    """
    n = len(is_connected)
    uf = UnionFind(n)
    
    for i in range(n):
        for j in range(i + 1, n):  # Only need upper triangle
            if is_connected[i][j] == 1:
                uf.union(i, j)
    
    return uf.count


# Alternative: Count unique roots
def find_circle_num_alt(is_connected):
    """Alternative: count unique roots at the end."""
    n = len(is_connected)
    uf = UnionFind(n)
    
    for i in range(n):
        for j in range(i + 1, n):
            if is_connected[i][j] == 1:
                uf.union(i, j)
    
    # Count unique roots
    provinces = set()
    for i in range(n):
        provinces.add(uf.find(i))
    
    return len(provinces)


# ─── Test Cases ───
is_connected1 = [
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 1]
]
print(find_circle_num(is_connected1))
# Expected: 2

is_connected2 = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]
print(find_circle_num(is_connected2))
# Expected: 3

is_connected3 = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
]
print(find_circle_num(is_connected3))
# Expected: 1

is_connected4 = [
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1]
]
print(find_circle_num(is_connected4))
# Expected: 2
`,
    },
    {
      id: "redundant-connection",
      slug: "redundant-connection",
      title: "Redundant Connection",
      content: `## Redundant Connection

<!-- voice:section_check concept="Cycle detection with Union Find" -->

A tree with **n nodes** has exactly **n − 1 edges**. The moment you add one more edge to a tree, you create a cycle. This problem gives you that graph — n nodes plus one extra edge — and asks you to identify which edge is the intruder.

### Problem Statement

You are given a graph that started as a tree with \`n\` nodes (labeled 1 to n), with **one additional edge** added. The added edge connects two different vertices that were not previously directly connected.

The graph is represented as \`edges\` where \`edges[i] = [ui, vi]\`. Return the redundant edge that, if removed, leaves a valid tree. If multiple answers exist, return the one that **appears last** in \`edges\`.

\`\`\`concept
{ "title": "The Cycle Detection Insight", "variant": "mental-model", "content": "Union-Find reduces cycle detection to a single membership query: 'Are u and v already in the same connected component?' If yes — adding edge [u, v] would create a cycle. The elegance is that you never need to trace the actual path; component membership is enough." }
\`\`\`

### Examples

| Input | Output | Why |
|-------|--------|-----|
| \`[[1,2],[1,3],[2,3]]\` | \`[2,3]\` | Edge [2,3] closes the cycle 1→2→3→1 |
| \`[[1,2],[2,3],[3,4],[1,4],[1,5]]\` | \`[1,4]\` | Edge [1,4] closes the cycle 1→2→3→4→1 |

### Approach: Union Find for Cycle Detection

\`\`\`steps
{ "title": "Union Find Cycle Detection Algorithm", "steps": [ { "title": "Initialize: Each node is its own set", "content": "Create a \`parent\` array where \`parent[i] = i\` for all nodes. Each node starts as its own root — n isolated components." }, { "title": "Process each edge [u, v]", "content": "For every edge in the input, call \`find(u)\` and \`find(v)\` to get the root representative of each node's component." }, { "title": "Cycle check: same root?", "content": "If \`find(u) == find(v)\`, both nodes already belong to the same connected component. Adding this edge creates a cycle — **this is the redundant edge**." }, { "title": "Union if different roots", "content": "If roots differ, merge the two components by calling \`union(u, v)\`. Use **union by rank** to keep trees shallow and operations near O(1)." }, { "title": "Return the last cycle-forming edge", "content": "Process all edges in order. The problem guarantees exactly one redundant edge, so the first edge that fails the cycle check is the answer." } ] }
\`\`\`

### Visualizing the Algorithm

Let's trace through \`edges = [[1,2],[1,3],[2,3]]\`:

\`\`\`algoviz
{ "title": "Processing edges: [[1,2],[1,3],[2,3]]", "type": "array", "data": ["[1,2]", "[1,3]", "[2,3]"], "frames": [ { "highlight": [0], "label": "Process [1,2]: find(1)=1, find(2)=2 → different roots → UNION. Components: {1,2}, {3}", "stats": { "edge": "[1,2]", "find(1)": 1, "find(2)": 2, "action": "union" } }, { "highlight": [1], "label": "Process [1,3]: find(1)=1, find(3)=3 → different roots → UNION. Components: {1,2,3}", "stats": { "edge": "[1,3]", "find(1)": 1, "find(3)": 3, "action": "union" } }, { "highlight": [2], "label": "Process [2,3]: find(2)=1, find(3)=1 → SAME ROOT! Cycle detected → return [2,3]", "stats": { "edge": "[2,3]", "find(2)": 1, "find(3)": 1, "action": "CYCLE!" } } ], "speed": 900 }
\`\`\`

### Implementation

\`\`\`tabs
{ "tabs": [ { "label": "Python", "icon": "🐍", "content": "\`\`\`python\\nclass Solution:\\n    def findRedundantConnection(self, edges: list[list[int]]) -> list[int]:\\n        n = len(edges)\\n        parent = list(range(n + 1))\\n        rank = [0] * (n + 1)\\n\\n        def find(x: int) -> int:\\n            if parent[x] != x:\\n                parent[x] = find(parent[x])  # path compression\\n            return parent[x]\\n\\n        def union(x: int, y: int) -> bool:\\n            rx, ry = find(x), find(y)\\n            if rx == ry:\\n                return False  # already connected — cycle!\\n            if rank[rx] < rank[ry]:\\n                rx, ry = ry, rx\\n            parent[ry] = rx\\n            if rank[rx] == rank[ry]:\\n                rank[rx] += 1\\n            return True\\n\\n        for u, v in edges:\\n            if not union(u, v):\\n                return [u, v]\\n        return []\\n\`\`\`" }, { "label": "JavaScript", "icon": "🟨", "content": "\`\`\`javascript\\nvar findRedundantConnection = function(edges) {\\n    const n = edges.length;\\n    const parent = Array.from({ length: n + 1 }, (_, i) => i);\\n    const rank = new Array(n + 1).fill(0);\\n\\n    function find(x) {\\n        if (parent[x] !== x) {\\n            parent[x] = find(parent[x]); // path compression\\n        }\\n        return parent[x];\\n    }\\n\\n    function union(x, y) {\\n        let rx = find(x), ry = find(y);\\n        if (rx === ry) return false; // cycle!\\n        if (rank[rx] < rank[ry]) [rx, ry] = [ry, rx];\\n        parent[ry] = rx;\\n        if (rank[rx] === rank[ry]) rank[rx]++;\\n        return true;\\n    }\\n\\n    for (const [u, v] of edges) {\\n        if (!union(u, v)) return [u, v];\\n    }\\n    return [];\\n};\\n\`\`\`" }, { "label": "C++", "icon": "⚙️", "content": "\`\`\`cpp\\nclass Solution {\\npublic:\\n    vector<int> parent, rnk;\\n\\n    int find(int x) {\\n        if (parent[x] != x)\\n            parent[x] = find(parent[x]); // path compression\\n        return parent[x];\\n    }\\n\\n    bool unite(int x, int y) {\\n        int rx = find(x), ry = find(y);\\n        if (rx == ry) return false; // cycle!\\n        if (rnk[rx] < rnk[ry]) swap(rx, ry);\\n        parent[ry] = rx;\\n        if (rnk[rx] == rnk[ry]) rnk[rx]++;\\n        return true;\\n    }\\n\\n    vector<int> findRedundantConnection(vector<vector<int>>& edges) {\\n        int n = edges.size();\\n        parent.resize(n + 1);\\n        rnk.resize(n + 1, 0);\\n        iota(parent.begin(), parent.end(), 0);\\n\\n        for (auto& e : edges)\\n            if (!unite(e[0], e[1]))\\n                return e;\\n        return {};\\n    }\\n};\\n\`\`\`" } ] }
\`\`\`

### Execution Trace (Python)

Let's step through the second example: \`edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]\`

\`\`\`trace
{ "title": "Tracing edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]", "language": "python", "code": "parent = [0,1,2,3,4,5]\\nfor u, v in edges:\\n    if not union(u, v):\\n        return [u, v]", "frames": [ { "line": 2, "vars": { "u": 1, "v": 2, "parent": "[0,1,2,3,4,5]" }, "note": "find(1)=1, find(2)=2 — different. Union: parent[2]=1", "stdout": "" }, { "line": 2, "vars": { "u": 2, "v": 3, "parent": "[0,1,1,3,4,5]" }, "note": "find(2)→parent[2]=1. find(3)=3. Different. Union: parent[3]=1", "stdout": "" }, { "line": 2, "vars": { "u": 3, "v": 4, "parent": "[0,1,1,1,4,5]" }, "note": "find(3)→1. find(4)=4. Different. Union: parent[4]=1", "stdout": "" }, { "line": 2, "vars": { "u": 1, "v": 4, "parent": "[0,1,1,1,1,5]" }, "note": "find(1)=1. find(4)→parent[4]=1. SAME ROOT! Cycle detected!", "stdout": "" }, { "line": 3, "vars": { "u": 1, "v": 4 }, "note": "union returns False — return [1, 4]", "stdout": "[1, 4]" } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why return the LAST cycle-forming edge?", "content": "The problem guarantees exactly one redundant edge, but the constraint 'return the answer that occurs last in edges' matters if you imagine multiple valid answers. In this problem there's always exactly one answer, but the Union-Find approach naturally handles this: the first edge where \`find(u) == find(v)\` is guaranteed to be the unique redundant edge by the problem's construction." }
\`\`\`

### Complexity Analysis

| Metric | Complexity | Explanation |
|--------|-----------|-------------|
| **Time** | O(n · α(n)) ≈ O(n) | α(n) is the inverse Ackermann function — effectively constant for all practical inputs |
| **Space** | O(n) | \`parent\` and \`rank\` arrays of size n+1 |

\`\`\`collapse
{ "title": "Deep Dive: Why not DFS instead?", "content": "DFS can also detect cycles by tracking visited nodes and the parent of each node during traversal. The trade-off:\\n\\n**DFS approach:**\\n- Time: O(n) — visit every node once\\n- Space: O(n) — recursion stack + visited set\\n- Intuitive but verbose: you must track parent nodes to avoid false positives from undirected edges\\n- Harder to extend to dynamic graphs (edges added one at a time)\\n\\n**Union-Find approach:**\\n- Same asymptotic complexity\\n- Naturally online: each edge is processed independently, no need to restart\\n- Simpler to implement correctly — no parent tracking confusion\\n- Reusable: the same Union-Find structure serves Kruskal's MST, number of connected components, etc.\\n\\nFor this specific problem, Union-Find wins on clarity and reusability." }
\`\`\`

### Knowledge Check

\`\`\`quiz
{ "title": "Redundant Connection — Knowledge Check", "questions": [ { "question": "Given edges = [[1,2],[2,3],[3,1]], which edge is returned as redundant?", "options": ["[1,2]", "[2,3]", "[3,1]", "None — no cycle exists"], "answer": 2, "explanation": "[3,1] is returned because it's processed last. When we try to union 3 and 1, find(3) and find(1) both resolve to the same root (1), indicating they're already connected via 1→2→3." }, { "question": "What does it mean when find(u) == find(v) before calling union(u, v)?", "options": ["u and v are the same node", "u and v are already in the same connected component", "u and v have the same rank", "u and v are both root nodes"], "answer": 1, "explanation": "find() returns the root representative of a node's component. If find(u) == find(v), both nodes share the same root — meaning they're already connected by some path. Adding another edge between them creates a cycle." }, { "question": "Why do we use 'union by rank' in the implementation?", "options": ["To make the parent array smaller", "To keep trees balanced and prevent O(n) find operations", "To ensure the redundant edge is returned correctly", "To avoid path compression conflicts"], "answer": 1, "explanation": "Without rank-based merging, the parent tree can degenerate into a chain (O(n) height), making find() O(n). Union by rank always attaches the shorter tree under the taller one, keeping tree height O(log n). Combined with path compression, this achieves the near-constant α(n) amortized time." }, { "question": "For n nodes and n edges (one more than a tree needs), how many redundant edges will Union-Find detect?", "options": ["0", "1", "2", "It depends on the graph structure"], "answer": 1, "explanation": "A tree with n nodes has exactly n-1 edges. Adding exactly one edge creates exactly one cycle, which means exactly one edge will cause find(u) == find(v) during the scan. The problem guarantees this structure." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Cycle detection with Union-Find reduces to a membership query: if find(u) == find(v) before union, adding edge [u,v] creates a cycle.", "Union by rank + path compression achieves O(α(n)) ≈ O(1) amortized per operation — making the full algorithm O(n) for n edges.", "Union-Find is naturally online — it processes edges one at a time without restarting, making it ideal for dynamic graph problems.", "The problem's 'return the last edge' constraint is satisfied automatically: process edges in order, return the first one that triggers a cycle detection.", "This pattern generalizes: any problem asking 'does adding this edge create a cycle?' can be solved with the same find-before-union check." ] }
\`\`\``,
      starterCode: `class UnionFind:
    """Union Find with path compression."""
    def __init__(self, n):
        self.parent = list(range(n + 1))  # 1-indexed
    
    def find(self, x):
        # TODO: Find with path compression
        pass
    
    def union(self, x, y):
        # TODO: Union two sets
        pass


def find_redundant_connection(edges):
    """
    Find the redundant edge that creates a cycle.
    
    Args:
        edges: List of [u, v] edges (1-indexed nodes)
    
    Returns:
        List [u, v] of the redundant edge
    
    Example:
        >>> find_redundant_connection([[1,2],[1,3],[2,3]])
        [2, 3]
        >>> find_redundant_connection([[1,2],[2,3],[3,4],[1,4],[1,5]])
        [1, 4]
    """
    # TODO: Use Union Find to detect cycle
    pass


# ─── Test Cases ───

# Basic cycle
edges1 = [[1, 2], [1, 3], [2, 3]]
print(find_redundant_connection(edges1))
# Expected: [2, 3]

# Larger cycle
edges2 = [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]
print(find_redundant_connection(edges2))
# Expected: [1, 4]

# Multiple possible answers (return last)
edges3 = [[1, 2], [2, 3], [3, 1], [1, 4]]
print(find_redundant_connection(edges3))
# Expected: [3, 1] (creates cycle 1-2-3-1)

# Simple triangle
edges4 = [[1, 2], [2, 3], [1, 3]]
print(find_redundant_connection(edges4))
# Expected: [1, 3]
`,
      solutionCode: `class UnionFind:
    """Union Find with path compression."""
    def __init__(self, n):
        self.parent = list(range(n + 1))  # 1-indexed
    
    def find(self, x):
        """Find root with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        """Union two sets."""
        px, py = self.find(x), self.find(y)
        if px != py:
            self.parent[py] = px


def find_redundant_connection(edges):
    """
    Find the redundant edge that creates a cycle.
    
    Time Complexity: O(n × α(n)) ≈ O(n)
    Space Complexity: O(n)
    """
    n = len(edges)
    uf = UnionFind(n)
    
    for u, v in edges:
        # If already connected, this edge creates a cycle
        if uf.find(u) == uf.find(v):
            return [u, v]
        uf.union(u, v)
    
    return []  # Should not reach here for valid input


# Alternative: Union by rank
def find_redundant_connection_optimized(edges):
    """Optimized with union by rank."""
    n = len(edges)
    parent = list(range(n + 1))
    rank = [0] * (n + 1)
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False
        
        if rank[px] < rank[py]:
            px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]:
            rank[px] += 1
        return True
    
    for u, v in edges:
        if not union(u, v):
            return [u, v]
    
    return []


# ─── Test Cases ───
edges1 = [[1, 2], [1, 3], [2, 3]]
print(find_redundant_connection(edges1))
# Expected: [2, 3]

edges2 = [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]
print(find_redundant_connection(edges2))
# Expected: [1, 4]

edges3 = [[1, 2], [2, 3], [3, 1], [1, 4]]
print(find_redundant_connection(edges3))
# Expected: [3, 1]

edges4 = [[1, 2], [2, 3], [1, 3]]
print(find_redundant_connection(edges4))
# Expected: [1, 3]
`,
    },
    {
      id: "number-of-islands-ii",
      slug: "number-of-islands-ii",
      title: "Number of Islands II",
      content: `## Number of Islands II

<!-- voice:section_check concept="Dynamic connectivity with Union Find" -->

Union Find shines when the problem is **incremental** — you're not given a static graph to analyze, but a series of events that *build* the graph one piece at a time. Number of Islands II is the canonical example: land appears one cell at a time, and after each addition you must report the current island count.

\`\`\`concept
{ "title": "Dynamic Connectivity", "variant": "mental-model", "content": "Static connectivity asks: 'are these nodes connected right now?' Dynamic connectivity asks: 'as I keep adding edges, how does the component structure evolve?' Union Find answers the dynamic question in near-constant time per event — no need to re-scan the whole graph after each change." }
\`\`\`

### Problem Statement

Given an empty \`m × n\` binary grid (all water), process a list of \`positions\`. Each position turns a water cell into land. After **each** addition, return the current number of islands.

An island is a maximal group of \`1\`s connected horizontally or vertically.

\`\`\`
Input:  m = 3, n = 3
        positions = [[0,0], [0,1], [1,2], [2,1]]
Output: [1, 1, 2, 3]
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why this is hard without Union Find", "content": "A naive approach rescans the entire grid with BFS/DFS after each \`addLand\` call — O(m×n) per call, O(k×m×n) total. For a 1000×1000 grid with 10 000 operations that's 10 **billion** cell visits. Union Find reduces each operation to amortized O(α(m×n)) — effectively constant." }
\`\`\`

### The Core Insight

Every time you plant land on a water cell:

1. **Count goes up by 1** — you created a new, isolated island.
2. **Check 4 neighbours.** For each neighbour that is already land and belongs to a *different* island: **union** the two components and **count goes down by 1**.

The net result after processing all neighbours is the correct island count — no re-scanning required.

\`\`\`concept
{ "title": "Island Counter Trick", "variant": "insight", "content": "Start each new land cell with count += 1 (it's its own island). Then for every successful union with a land neighbour, count -= 1. You never have to iterate the whole grid; the counter stays accurate incrementally." }
\`\`\`

### Step-by-Step Algorithm

\`\`\`steps
{ "title": "Union Find for Number of Islands II", "steps": [ { "title": "Initialise Union Find", "content": "Create a \`parent\` dictionary (or flat array). Nothing is land yet, so no entries exist. Track a running \`count = 0\`." }, { "title": "Process each position (r, c)", "content": "If \`(r, c)\` is already land (duplicate), skip — but still append the current count to the result. Otherwise, add it to Union Find: \`parent[(r,c)] = (r,c)\`, increment \`count\`." }, { "title": "Check 4 neighbours", "content": "For each of the four directions (up, down, left, right), compute \`(nr, nc)\`. If \`(nr, nc)\` is within bounds **and** is already land (i.e., exists in \`parent\`), call \`union((r,c), (nr,nc))\`." }, { "title": "Inside union — merge and decrement", "content": "Find both roots. If they differ, attach one tree under the other (union by rank), then \`count -= 1\`. If they are already in the same component, do nothing." }, { "title": "Record result", "content": "Append the current \`count\` to the result list. Repeat for every position." } ] }
\`\`\`

### Visualising the Execution

\`\`\`algoviz
{ "title": "Island Count After Each addLand", "type": "array", "data": [1, 1, 2, 3], "frames": [ { "highlight": [0], "label": "Add [0,0] — no land neighbours → new island", "stats": { "position": "[0,0]", "delta": "+1", "islands": 1 } }, { "highlight": [1], "label": "Add [0,1] — neighbour [0,0] is land → union → -1", "stats": { "position": "[0,1]", "delta": "+1-1", "islands": 1 } }, { "highlight": [2], "label": "Add [1,2] — no land neighbours → new island", "stats": { "position": "[1,2]", "delta": "+1", "islands": 2 } }, { "highlight": [3], "label": "Add [2,1] — no land neighbours → new island", "stats": { "position": "[2,1]", "delta": "+1", "islands": 3 } } ], "speed": 1000 }
\`\`\`

Grid state after each step:

| Step | Grid | Islands |
|------|------|---------|
| Add [0,0] | \`1 0 0 / 0 0 0 / 0 0 0\` | **1** |
| Add [0,1] | \`1 1 0 / 0 0 0 / 0 0 0\` | **1** (merged) |
| Add [1,2] | \`1 1 0 / 0 0 1 / 0 0 0\` | **2** |
| Add [2,1] | \`1 1 0 / 0 0 1 / 0 1 0\` | **3** |

### Brute Force vs Union Find

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Brute Force — BFS rescan after each add  O(k × m×n)", "code": "def numIslands2_brute(m, n, positions):\\n    grid = [[0]*n for _ in range(m)]\\n    result = []\\n    for r, c in positions:\\n        grid[r][c] = 1\\n        # Full BFS/DFS scan every time\\n        visited = set()\\n        count = 0\\n        for i in range(m):\\n            for j in range(n):\\n                if grid[i][j] == 1 and (i,j) not in visited:\\n                    count += 1\\n                    stack = [(i, j)]\\n                    while stack:\\n                        x, y = stack.pop()\\n                        if (x,y) in visited: continue\\n                        visited.add((x,y))\\n                        for dx,dy in [(0,1),(0,-1),(1,0),(-1,0)]:\\n                            if 0<=x+dx<m and 0<=y+dy<n:\\n                                if grid[x+dx][y+dy]==1:\\n                                    stack.append((x+dx,y+dy))\\n        result.append(count)\\n    return result" }, "after": { "label": "Union Find — Incremental  O(k × α(m×n))", "code": "def numIslands2(m, n, positions):\\n    parent, rank = {}, {}\\n    count = 0\\n    result = []\\n\\n    def find(x):\\n        if parent[x] != x:\\n            parent[x] = find(parent[x])  # path compression\\n        return parent[x]\\n\\n    def union(x, y):\\n        nonlocal count\\n        px, py = find(x), find(y)\\n        if px == py: return\\n        if rank.get(px,0) < rank.get(py,0):\\n            px, py = py, px\\n        parent[py] = px\\n        if rank.get(px,0) == rank.get(py,0):\\n            rank[px] = rank.get(px,0) + 1\\n        count -= 1\\n\\n    for r, c in positions:\\n        if (r,c) not in parent:\\n            parent[(r,c)] = (r,c)\\n            count += 1\\n            for dr,dc in [(0,1),(0,-1),(1,0),(-1,0)]:\\n                nr, nc = r+dr, c+dc\\n                if (nr,nc) in parent:\\n                    union((r,c),(nr,nc))\\n        result.append(count)\\n    return result" } }
\`\`\`

### Full Solution

\`\`\`playground
{ "title": "Number of Islands II", "language": "python", "code": "class UnionFind:\\n    def __init__(self):\\n        self.parent = {}\\n        self.rank   = {}\\n        self.count  = 0\\n\\n    def add(self, x):\\n        \\"\\"\\"Add a new isolated node.\\"\\"\\"\\n        if x not in self.parent:\\n            self.parent[x] = x\\n            self.rank[x]   = 0\\n            self.count    += 1\\n\\n    def find(self, x):\\n        \\"\\"\\"Path-compressed find.\\"\\"\\"\\n        if self.parent[x] != x:\\n            self.parent[x] = self.find(self.parent[x])\\n        return self.parent[x]\\n\\n    def union(self, x, y):\\n        \\"\\"\\"Union by rank — returns True if a merge happened.\\"\\"\\"\\n        px, py = self.find(x), self.find(y)\\n        if px == py:\\n            return False\\n        if self.rank[px] < self.rank[py]:\\n            px, py = py, px\\n        self.parent[py] = px\\n        if self.rank[px] == self.rank[py]:\\n            self.rank[px] += 1\\n        self.count -= 1\\n        return True\\n\\n\\ndef numIslands2(m, n, positions):\\n    uf = UnionFind()\\n    result = []\\n    for r, c in positions:\\n        if (r, c) not in uf.parent:      # skip duplicate adds\\n            uf.add((r, c))\\n            for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:\\n                nr, nc = r + dr, c + dc\\n                if 0 <= nr < m and 0 <= nc < n and (nr, nc) in uf.parent:\\n                    uf.union((r, c), (nr, nc))\\n        result.append(uf.count)\\n    return result\\n\\n\\n# --- Tests ---\\nprint(numIslands2(3, 3, [[0,0],[0,1],[1,2],[2,1]]))  # [1, 1, 2, 3]\\nprint(numIslands2(1, 1, [[0,0]]))                    # [1]\\nprint(numIslands2(2, 2, [[0,0],[1,1],[0,1],[1,0]]))  # [1, 2, 1, 1]", "runnable": true }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Handling Duplicate Positions", "content": "LeetCode 305 guarantees no duplicates, but real interview variants (as seen at Uber, 2026) often extend the problem with duplicate \`addLand\` calls.\\n\\nThe fix is a one-liner: check \`if (r, c) not in parent\` before doing any work. Crucially, you must **still** append the current count even when you skip — the result array must have one entry per input position regardless.\\n\\n\`\`\`python\\nfor r, c in positions:\\n    if (r, c) not in uf.parent:   # <-- guard\\n        uf.add((r, c))\\n        # ... union with neighbours ...\\n    result.append(uf.count)        # always append\\n\`\`\`\\n\\nA common bug is \`return\`-ing or \`continue\`-ing past the append, which produces a result array shorter than \`positions\`." }
\`\`\`

### Complexity

| | Time | Space |
|---|---|---|
| Per \`addLand\` operation | O(α(m×n)) ≈ O(1) | — |
| Total for k positions | **O(k × α(m×n))** | **O(m×n)** |

α is the inverse Ackermann function — it grows so slowly it never exceeds 4 for any real-world input, making each Union Find operation effectively constant.

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "You add a land cell with 3 land neighbours, all belonging to 3 different islands. What is the net change to the island count?", "options": ["count increases by 1", "count stays the same", "count decreases by 1", "count decreases by 2"], "answer": 3, "explanation": "New land = +1. Three successful unions = -3. Net: 1 - 3 = -2. The cell bridges three previously separate islands into one, so the count drops by 2 overall." }, { "question": "A new land cell has 2 land neighbours that are already in the SAME island. What happens to count?", "options": ["count increases by 1", "count stays the same", "count decreases by 1", "count decreases by 2"], "answer": 0, "explanation": "New land = +1. The two union calls both find the same root, so neither decrements the count (union only decrements when two distinct components merge). Net change: +1. The new cell is absorbed into the existing island." }, { "question": "Why is Union Find (disjoint set) more efficient here than re-running BFS/DFS after each addLand?", "options": ["BFS/DFS cannot handle grid graphs", "Union Find processes each addition in O(α(mn)) ≈ O(1), while BFS/DFS rescans the entire O(mn) grid each time", "Union Find uses O(1) space", "BFS/DFS would give an incorrect count with path compression"], "answer": 1, "explanation": "BFS/DFS costs O(m×n) per addLand call — O(k×m×n) total. Union Find with path compression and union by rank costs O(k×α(m×n)) total, which is essentially O(k). For a 1000×1000 grid with 10 000 calls that's ~10 billion vs ~10 000 operations." }, { "question": "What is the correct time complexity of the Union Find solution when processing k positions on an m×n grid?", "options": ["O(k × log(mn))", "O(k × mn)", "O(k × α(mn))", "O(k²)"], "answer": 2, "explanation": "With both path compression and union by rank, each find/union runs in amortized O(α(mn)) where α is the inverse Ackermann function. Over k operations the total is O(k × α(mn)). Log complexity would arise from union by rank alone without path compression." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Use Union Find for problems where connectivity must be tracked *incrementally* — each event adds or removes edges rather than giving you the whole graph up front.", "The island counter trick: +1 for each new land cell, -1 for each successful union. Never iterate the entire grid again.", "Guard against duplicate positions by checking \`if node not in parent\` before adding, but always append the count for every input position.", "Path compression + union by rank gives amortized O(α(n)) ≈ O(1) per operation, making the total complexity O(k × α(m×n)) — near-linear in the number of operations.", "Real interview extensions (Uber 2026) add bridge operations or query functions — the same Union Find structure handles them without structural changes." ] }
\`\`\``,
      starterCode: `class UnionFind:
    """Union Find for 2D grid."""
    def __init__(self, size):
        self.parent = list(range(size))
        self.rank = [0] * size
        self.count = 0  # Number of islands (connected components)
    
    def find(self, x):
        # TODO: Find with path compression
        pass
    
    def union(self, x, y):
        # TODO: Union by rank, update count
        pass


def num_islands2(m, n, positions):
    """
    Return number of islands after each addLand operation.
    
    Args:
        m: int, number of rows
        n: int, number of columns
        positions: List of [r, c] positions to turn into land
    
    Returns:
        List of integers, island count after each operation
    
    Example:
        >>> num_islands2(3, 3, [[0,0],[0,1],[1,2],[2,1]])
        [1, 1, 2, 3]
    """
    # TODO: Use Union Find for dynamic connectivity
    # Hint: Convert 2D coordinates to 1D index
    pass


# ─── Test Cases ───

# Example from problem
print(num_islands2(3, 3, [[0, 0], [0, 1], [1, 2], [2, 1]]))
# Expected: [1, 1, 2, 3]

# Single cell
print(num_islands2(1, 1, [[0, 0]]))
# Expected: [1]

# All positions connect
print(num_islands2(3, 3, [[0, 0], [0, 1], [1, 0], [1, 1]]))
# Expected: [1, 1, 1, 1]

# All separate islands
print(num_islands2(3, 3, [[0, 0], [0, 2], [2, 0], [2, 2]]))
# Expected: [1, 2, 3, 4]

# Duplicate position (should be ignored)
print(num_islands2(3, 3, [[0, 0], [0, 0], [0, 1]]))
# Expected: [1, 1, 1]
`,
      solutionCode: `class UnionFind:
    """Union Find for 2D grid."""
    def __init__(self, size):
        self.parent = list(range(size))
        self.rank = [0] * size
        self.count = 0  # Number of islands (connected components)
    
    def find(self, x):
        """Find root with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        """Union by rank."""
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        
        self.count -= 1
        return True


def num_islands2(m, n, positions):
    """
    Return number of islands after each addLand operation.
    
    Time Complexity: O(k × α(m×n)) where k = len(positions)
    Space Complexity: O(m × n)
    """
    def index(r, c):
        """Convert 2D coordinates to 1D index."""
        return r * n + c
    
    uf = UnionFind(m * n)
    grid = [[0] * n for _ in range(m)]
    result = []
    
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    for r, c in positions:
        # Skip if already land
        if grid[r][c] == 1:
            result.append(uf.count)
            continue
        
        # Add land
        grid[r][c] = 1
        uf.count += 1
        
        # Check neighbors
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                uf.union(index(r, c), index(nr, nc))
        
        result.append(uf.count)
    
    return result


# Alternative: Without full grid storage
def num_islands2_optimized(m, n, positions):
    """Optimized using set to track land cells."""
    def index(r, c):
        return r * n + c
    
    parent = {}
    rank = {}
    count = 0
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        nonlocal count
        px, py = find(x), find(y)
        if px == py:
            return
        
        if rank[px] < rank[py]:
            px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]:
            rank[px] += 1
        count -= 1
    
    result = []
    land = set()
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    for r, c in positions:
        if (r, c) in land:
            result.append(count)
            continue
        
        # Add new island
        land.add((r, c))
        idx = index(r, c)
        parent[idx] = idx
        rank[idx] = 0
        count += 1
        
        # Union with neighbors
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (nr, nc) in land:
                union(idx, index(nr, nc))
        
        result.append(count)
    
    return result


# ─── Test Cases ───
print(num_islands2(3, 3, [[0, 0], [0, 1], [1, 2], [2, 1]]))
# Expected: [1, 1, 2, 3]

print(num_islands2(1, 1, [[0, 0]]))
# Expected: [1]

print(num_islands2(3, 3, [[0, 0], [0, 1], [1, 0], [1, 1]]))
# Expected: [1, 1, 1, 1]

print(num_islands2(3, 3, [[0, 0], [0, 2], [2, 0], [2, 2]]))
# Expected: [1, 2, 3, 4]

print(num_islands2(3, 3, [[0, 0], [0, 0], [0, 1]]))
# Expected: [1, 1, 1]
`,
    },
    {
      id: "union-find-checkpoint",
      slug: "union-find-checkpoint",
      title: "Module Checkpoint: Union Find",
      content: `## Module Checkpoint: Union Find

<!-- voice:checkpoint_intro -->

You've worked through the full Union Find pattern — from raw data structure to three classic problem archetypes. This checkpoint consolidates everything before you move on.

\`\`\`concept
{ "title": "The Union Find Contract", "variant": "mental-model", "content": "Union Find answers one question in near-constant time: **are these two elements in the same group?** It maintains a \`parent[]\` array where each node points toward its root. \`find(x)\` chases pointers to the root; \`union(x, y)\` merges two roots. With **path compression** (re-point every node directly to root during find) and **union by rank** (attach the shorter tree under the taller), both operations run in amortized O(α(n)) — effectively O(1) for every real input you will encounter." }
\`\`\`

### Pattern Map: Three Problem Archetypes

\`\`\`tabs
{ "tabs": [
  {
    "label": "Number of Provinces",
    "icon": "🏘️",
    "content": "**Goal:** Count connected components in an adjacency matrix.\\n\\n**Key move:** For each edge \`(i, j)\` in the matrix, call \`union(i, j)\`. After processing all edges, every node that is its own root represents one province.\\n\\n\`\`\`python\\ncount = n\\nfor i in range(n):\\n    for j in range(i+1, n):\\n        if isConnected[i][j] == 1:\\n            if find(i) != find(j):\\n                union(i, j)\\n                count -= 1\\nreturn count\\n\`\`\`\\n\\n**Complexity:** O(n² · α(n)) — you visit every cell of the matrix once."
  },
  {
    "label": "Redundant Connection",
    "icon": "🔁",
    "content": "**Goal:** Find the last edge that creates a cycle in an undirected graph.\\n\\n**Key move:** Process edges one by one. **Before** calling \`union(u, v)\`, check \`find(u) == find(v)\`. If true, u and v already share a root — this edge closes a cycle and is the answer.\\n\\n\`\`\`python\\nfor u, v in edges:\\n    if find(u) == find(v):\\n        return [u, v]  # cycle detected\\n    union(u, v)\\n\`\`\`\\n\\n**Why it works:** Two nodes share a root only if they are already connected. Any new edge between them is redundant by definition."
  },
  {
    "label": "Number of Islands II",
    "icon": "🏝️",
    "content": "**Goal:** After each land-add operation on an m×n grid, report the running island count.\\n\\n**Key move:** Flatten 2D → 1D: \`id = row * cols + col\`. When you add a cell, increment count by 1 (new island), then check all 4 neighbours — each neighbour in a **different** component triggers a union and decrements the count.\\n\\n\`\`\`python\\nfor dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:\\n    nr, nc = r+dx, c+dy\\n    if in_bounds(nr, nc) and land[nr][nc]:\\n        if find(r*cols+c) != find(nr*cols+nc):\\n            union(r*cols+c, nr*cols+nc)\\n            count -= 1\\nresults.append(count)\\n\`\`\`\\n\\n**Index trick:** \`id = row * cols + col\` maps any grid cell to a unique integer for the parent array."
  }
] }
\`\`\`

### Path Compression in Action

Watch \`find(4)\` collapse a 5-node chain so every future lookup costs a single step:

\`\`\`trace
{ "title": "Path Compression: find(4) on chain 4→3→2→1→0", "language": "python", "code": "parent = [0, 0, 1, 2, 3]  # chain: 4->3->2->1->0\\n\\ndef find(x):\\n    if parent[x] != x:\\n        parent[x] = find(parent[x])  # compress here\\n    return parent[x]\\n\\nresult = find(4)", "frames": [
  { "line": 8, "vars": { "x": 4, "parent": "[0,0,1,2,3]" }, "note": "Calling find(4). parent[4]=3 ≠ 4, so we recurse down the chain." },
  { "line": 4, "vars": { "x": 3, "parent": "[0,0,1,2,3]" }, "note": "find(3): parent[3]=2 ≠ 3. Recurse." },
  { "line": 4, "vars": { "x": 2, "parent": "[0,0,1,2,3]" }, "note": "find(2): parent[2]=1 ≠ 2. Recurse." },
  { "line": 6, "vars": { "x": 0, "parent": "[0,0,1,2,3]" }, "note": "find(0): parent[0]=0 — this IS the root. Return 0 and begin unwinding.", "stdout": "root found: 0" },
  { "line": 5, "vars": { "x": 2, "parent": "[0,0,1,2,0]" }, "note": "Unwinding find(2): parent[2] = 0. Node 2 now points directly to root — skipping node 1." },
  { "line": 5, "vars": { "x": 3, "parent": "[0,0,0,2,0]" }, "note": "Unwinding find(3): parent[3] = 0. Node 3 now points directly to root." },
  { "line": 5, "vars": { "x": 4, "parent": "[0,0,0,0,0]" }, "note": "Unwinding find(4): parent[4] = 0. All five nodes now point directly to root 0.", "stdout": "result = 0" }
], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Three Common Bugs", "content": "**1. Comparing parents instead of roots:** Always call \`find(x)\` — never compare \`parent[x]\` and \`parent[y]\` directly. Path compression means a node's parent is not necessarily its root until compressed.\\n\\n**2. Off-by-one on 1-indexed problems:** LeetCode's Redundant Connection numbers nodes from 1. Initialize with \`n+1\` elements so index 0 is never a valid node and never aliases anything.\\n\\n**3. Wrong grid flattening constant:** \`id = row * cols + col\` — using \`rows\` instead of \`cols\` silently maps different cells to the same index on non-square grids." }
\`\`\`

### Checkpoint Quiz

\`\`\`quiz
{ "title": "Union Find: Verify Your Understanding", "questions": [
  {
    "question": "What is the amortized time complexity per operation when Union Find uses BOTH path compression and union by rank?",
    "options": ["O(n) — linear", "O(log n) — logarithmic", "O(α(n)) — inverse Ackermann, effectively constant", "O(1) — exactly constant in all cases"],
    "answer": 2,
    "explanation": "With both optimizations the amortized cost per operation is O(α(n)), where α is the inverse Ackermann function. α(n) ≤ 4 for every input size encountered in practice, so it behaves like O(1) — but technically it is not exactly O(1), which is why O(α(n)) is the precise answer."
  },
  {
    "question": "What does path compression do during a find(x) call?",
    "options": ["Removes cycles from the graph", "Makes every node on the path from x to root point directly to the root", "Sorts elements in the parent array by component size", "Reduces the total number of nodes in the structure"],
    "answer": 1,
    "explanation": "Path compression executes \`parent[x] = find(parent[x])\` recursively. Every node visited on the way to the root is re-pointed directly to that root. Future calls to find() on any of those nodes cost O(1)."
  },
  {
    "question": "In Redundant Connection, at what point do you detect that edge (u, v) creates a cycle?",
    "options": ["After calling union(u, v) and checking the rank array", "Before union — if find(u) == find(v), u and v are already in the same component", "By counting total edges and comparing to n−1", "By running BFS from u to check if v is already reachable"],
    "answer": 1,
    "explanation": "If find(u) == find(v) before the union call, both nodes already share a root — they are connected. Adding an edge between two already-connected nodes closes a cycle. This check is O(α(n)) and far more efficient than BFS/DFS for incremental edge-addition problems."
  },
  {
    "question": "True or False: Union Find only works correctly with 1-indexed nodes.",
    "options": ["True — the algorithm requires index 1 as its base case", "False — 0-indexed is equally valid; just initialize parent[i] = i for i in range(n)"],
    "answer": 1,
    "explanation": "The data structure is index-agnostic. 0-indexed is the Python default. 1-indexed (n+1 elements) is common for LeetCode problems where nodes are numbered from 1. The only requirement is internal consistency — your initialization and access must use the same index scheme."
  },
  {
    "question": "In Number of Islands II, why does the island count increase by 1 for each land addition but may decrease immediately after?",
    "options": ["It is an implementation bug that cancels out", "Each new land cell starts as its own island (+1), and each union with a neighbour in a different component merges two islands (−1)", "The grid physically shrinks when islands merge", "We count water cells, not land cells, so direction is reversed"],
    "answer": 1,
    "explanation": "A freshly added cell has no neighbours yet, so it is always a new island: count += 1. We then check all 4 cardinal neighbours. For each neighbour that already exists AND is in a different component, union() merges the two islands: count -= 1. A single addition can trigger multiple merges if it connects several isolated islands at once."
  }
] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Union Find tracks connected components using a parent[] array — find() locates the root, union() merges two roots.",
  "Path compression + union by rank together achieve amortized O(α(n)) per operation — effectively constant for any realistic input.",
  "Cycle detection: check find(u) == find(v) BEFORE calling union — if true, the edge is redundant.",
  "2D grid problems: flatten coordinates with id = row * cols + col to get a 1D index for the parent array.",
  "Dynamic connectivity (Islands II): +1 on every new cell, −1 on every successful union with a distinct neighbouring component."
] }
\`\`\`

**You've mastered the Union Find pattern. Next up: graph algorithms that build on connected components.**`,
    },
  ],
};
