import { Module } from "../types";

export const segmentTreeModule: Module = {
  id: "segment-tree",
  title: "Segment Tree",
  description: "Master the Segment Tree data structure for efficient range queries and updates. Learn to solve range sum, range maximum, and order statistic problems with O(log n) operations.",
  lessons: [
    {
      id: "segment-tree-intro",
      slug: "segment-tree-intro",
      title: "Introduction to Segment Tree",
      content: `## The Segment Tree Pattern

\`\`\`concept
{ "title": "Segment Tree: A Cache of Partial Answers", "variant": "mental-model", "content": "Think of a Segment Tree as pre-computing the answer to every possible sub-range before any query arrives. When you need sum([L..R]), you never touch individual elements — you combine at most 2·log n pre-cached nodes. This gives O(log n) for both range queries AND point updates, a balance that prefix sums can never achieve." }
\`\`\`

### Why Segment Tree?

When queries and updates are **interleaved** on the same array, no simple structure handles both efficiently:

| Operation | Naive Array | Prefix Sum | Segment Tree |
|-----------|:-----------:|:----------:|:------------:|
| Build | O(1) | O(n) | O(n) |
| Point Update | O(1) | O(n) | **O(log n)** |
| Range Query | O(n) | O(1) | **O(log n)** |

A prefix sum gives O(1) queries but rebuilding after every update costs O(n). A Segment Tree makes the trade: both operations run in O(log n).

\`\`\`callout
{ "type": "info", "title": "Only Need Queries? Use Prefix Sum.", "content": "If your array never changes after construction, a prefix sum array is simpler and answers range sum queries in O(1). Reach for a Segment Tree only when updates and queries are **both** frequent." }
\`\`\`

### Tree Structure and Build Visualised

For array \`[1, 3, 5, 7]\` the internal segment tree array (1-indexed) is:

\`tree = [_, 16, 4, 12, 1, 3, 5, 7]\`  — \`tree[1]\` is the root; children of node \`i\` are \`2i\` and \`2i+1\`.

\`\`\`algoviz
{ "title": "Build then Query sum([1..3]) on [1, 3, 5, 7]", "type": "array", "data": [16, 4, 12, 1, 3, 5, 7], "frames": [ { "highlight": [], "label": "Segment tree array (data[0] = tree[1] = root). Children of node i are 2i and 2i+1.", "stats": {"phase": "overview"} }, { "highlight": [3, 4, 5, 6], "label": "BUILD — Fill leaves (tree[4..7]) with arr[0..3] = [1, 3, 5, 7]", "stats": {"phase": "build"} }, { "highlight": [1, 3, 4], "label": "tree[2] = tree[4] + tree[5] = 1 + 3 = 4  (covers arr[0..1])", "stats": {"tree2": 4} }, { "highlight": [2, 5, 6], "label": "tree[3] = tree[6] + tree[7] = 5 + 7 = 12  (covers arr[2..3])", "stats": {"tree3": 12} }, { "highlight": [0, 1, 2], "label": "tree[1] = tree[2] + tree[3] = 4 + 12 = 16  (root, covers all)", "stats": {"tree1": 16} }, { "highlight": [0], "label": "QUERY sum([1..3]) — Root [0..3]: partial overlap with [1..3], recurse both children", "stats": {"phase": "query", "L": 1, "R": 3} }, { "highlight": [1], "label": "Left child [0..1]: partial overlap with [1..3] — recurse deeper", "stats": {} }, { "highlight": [3], "label": "Left-left [0..0]: end=0 < L=1 — no overlap, return 0", "stats": {"return": 0} }, { "highlight": [4], "label": "Left-right [1..1] ⊆ [1..3]: total overlap — return tree[5] = 3 ✓", "stats": {"return": 3} }, { "highlight": [2], "label": "Right child [2..3] ⊆ [1..3]: total overlap — return tree[3] = 12 ✓", "stats": {"return": 12} }, { "highlight": [0, 1, 2, 4], "label": "Done. Answer = 0 + 3 + 12 = 15. Only 4 of 7 nodes visited.", "stats": {"result": 15} } ], "speed": 900 }
\`\`\`

### Core Operations

\`\`\`steps
{ "title": "Three Operations You Must Know", "steps": [ { "title": "Build — O(n) total", "content": "Recurse down to each leaf, set it to the array value, then aggregate sums on the way back up.\\n\\n\`\`\`python\\ndef build(node, start, end):\\n    if start == end:\\n        tree[node] = arr[start]        # leaf\\n    else:\\n        mid = (start + end) // 2\\n        build(2*node,   start, mid)\\n        build(2*node+1, mid+1, end)\\n        tree[node] = tree[2*node] + tree[2*node+1]\\n\`\`\`\\n\\nAllocate \`tree = [0] * (4 * n)\` — safe for any value of n, including non-powers-of-two." }, { "title": "Query — O(log n)", "content": "Three mutually exclusive cases at every node:\\n\\n1. **No overlap** \`R < start or end < L\` → return 0 (identity for sum)\\n2. **Total overlap** \`L ≤ start and end ≤ R\` → return stored value immediately\\n3. **Partial overlap** → recurse both children, combine results\\n\\n\`\`\`python\\ndef query(node, start, end, L, R):\\n    if R < start or end < L:\\n        return 0            # no overlap\\n    if L <= start and end <= R:\\n        return tree[node]   # total overlap\\n    mid = (start + end) // 2\\n    left  = query(2*node,   start, mid, L, R)\\n    right = query(2*node+1, mid+1, end, L, R)\\n    return left + right\\n\`\`\`" }, { "title": "Update — O(log n)", "content": "Walk from root to the target leaf (depth ≈ log n), then re-aggregate each ancestor on the path back to the root.\\n\\n\`\`\`python\\ndef update(node, start, end, idx, val):\\n    if start == end:\\n        tree[node] = val    # update leaf\\n    else:\\n        mid = (start + end) // 2\\n        if idx <= mid:\\n            update(2*node,   start, mid, idx, val)\\n        else:\\n            update(2*node+1, mid+1, end, idx, val)\\n        tree[node] = tree[2*node] + tree[2*node+1]\\n\`\`\`\\n\\nOnly O(log n) ancestors are updated — sibling subtrees are never touched." } ] }
\`\`\`

### Query Execution Traced

\`\`\`trace
{ "title": "Tracing query(node=1, start=0, end=3, L=1, R=3) on tree=[16,4,12,1,3,5,7]", "language": "python", "code": "def query(node, start, end, L, R):\\n    if R < start or end < L:\\n        return 0\\n    if L <= start and end <= R:\\n        return tree[node]\\n    mid = (start + end) // 2\\n    left  = query(2*node,   start, mid,   L, R)\\n    right = query(2*node+1, mid+1, end, L, R)\\n    return left + right", "frames": [ { "line": 1, "vars": {"node": 1, "start": 0, "end": 3, "L": 1, "R": 3}, "note": "Root call — node 1 covers [0..3], query is [1..3]" }, { "line": 2, "vars": {"node": 1}, "note": "3 < 0? No. 3 < 1? No. Not no-overlap." }, { "line": 4, "vars": {"node": 1}, "note": "1 ≤ 0? No. Partial overlap — must recurse." }, { "line": 6, "vars": {"node": 1, "mid": 1}, "note": "mid = (0+3)//2 = 1" }, { "line": 7, "vars": {"node": 2, "start": 0, "end": 1, "L": 1, "R": 3}, "note": "Left child tree[2] covers [0..1] — partial overlap, recurse again" }, { "line": 2, "vars": {"node": 4, "start": 0, "end": 0}, "note": "Left-left: end=0 < L=1 → no overlap", "stdout": "node 4 → 0" }, { "line": 4, "vars": {"node": 5, "start": 1, "end": 1}, "note": "Left-right: 1 ≤ 1 and 1 ≤ 3 → total overlap!", "stdout": "node 5 → tree[5] = 3" }, { "line": 7, "vars": {"node": 3, "start": 2, "end": 3}, "note": "Right child tree[3] covers [2..3]: 1 ≤ 2 and 3 ≤ 3 → total overlap!", "stdout": "node 3 → tree[3] = 12" }, { "line": 9, "vars": {"left": 3, "right": 12, "result": 15}, "note": "Root combines: 0 + 3 + 12 = 15. Query complete.", "stdout": "Final answer: 15" } ], "speed": 900 }
\`\`\`

### Full Runnable Implementation

\`\`\`playground
{ "title": "Segment Tree — Range Sum with Point Updates", "language": "python", "code": "class SegmentTree:\\n    def __init__(self, arr):\\n        self.n = len(arr)\\n        self.arr = arr[:]\\n        self.tree = [0] * (4 * self.n)\\n        self._build(1, 0, self.n - 1)\\n\\n    def _build(self, node, start, end):\\n        if start == end:\\n            self.tree[node] = self.arr[start]\\n        else:\\n            mid = (start + end) // 2\\n            self._build(2 * node, start, mid)\\n            self._build(2 * node + 1, mid + 1, end)\\n            self.tree[node] = self.tree[2*node] + self.tree[2*node+1]\\n\\n    def query(self, L, R):\\n        return self._query(1, 0, self.n - 1, L, R)\\n\\n    def _query(self, node, start, end, L, R):\\n        if R < start or end < L:\\n            return 0\\n        if L <= start and end <= R:\\n            return self.tree[node]\\n        mid = (start + end) // 2\\n        return (self._query(2*node, start, mid, L, R) +\\n                self._query(2*node+1, mid+1, end, L, R))\\n\\n    def update(self, idx, val):\\n        self._update(1, 0, self.n - 1, idx, val)\\n\\n    def _update(self, node, start, end, idx, val):\\n        if start == end:\\n            self.arr[idx] = val\\n            self.tree[node] = val\\n        else:\\n            mid = (start + end) // 2\\n            if idx <= mid:\\n                self._update(2*node, start, mid, idx, val)\\n            else:\\n                self._update(2*node+1, mid+1, end, idx, val)\\n            self.tree[node] = self.tree[2*node] + self.tree[2*node+1]\\n\\n\\narr = [1, 3, 5, 7, 9, 11]\\nst = SegmentTree(arr)\\n\\nprint('Sum [0..5]:', st.query(0, 5))   # 36\\nprint('Sum [1..3]:', st.query(1, 3))   # 15 (3+5+7)\\n\\nst.update(1, 10)                       # change arr[1] from 3 to 10\\nprint('After update — Sum [1..3]:', st.query(1, 3))  # 22 (10+5+7)", "runnable": true }
\`\`\`

### When to Use

\`\`\`callout
{ "type": "tip", "title": "Segment Tree Use Cases", "content": "Reach for a Segment Tree when you see:\\n- **Range sum / min / max** with interleaved point updates\\n- **Frequency counting** over arbitrary ranges (e.g. count zeros in [L, R])\\n- **Range GCD / LCM / XOR** queries\\n- **Order statistics** — k-th smallest in a range (advanced)\\n- **Lazy propagation** — range updates instead of point updates (advanced)\\n\\nAny competitive-programming problem stating 'range query + update' on an array is a strong Segment Tree signal." }
\`\`\`

\`\`\`quiz
{ "title": "Segment Tree — Knowledge Check", "questions": [ { "question": "For a Segment Tree built over an n-element array, what array size should you allocate to guarantee correctness for any n?", "options": ["2n", "2n − 1", "4n", "n log n"], "answer": 2, "explanation": "Allocate 4n. A perfect binary tree with n leaves only needs 2n nodes, but for arbitrary n the recursive decomposition can occupy up to 4n positions. Using less risks out-of-bounds writes on non-power-of-two inputs." }, { "question": "During a range query [L, R], a Segment Tree node covering [start, end] returns its stored value immediately (without recursing) when:", "options": ["start equals end (it is a leaf)", "[start, end] and [L, R] have no overlap", "[start, end] is fully contained within [L, R]", "[L, R] is fully contained within [start, end]"], "answer": 2, "explanation": "Total overlap — [start, end] ⊆ [L, R] — means the stored aggregate is exactly the sub-answer needed. No recursion required. Partial overlap forces a split; no overlap returns the identity value (0 for sum)." }, { "question": "An array has n = 100,000 elements. You perform q = 50,000 queries and q = 50,000 point updates interleaved. What is the overall time complexity with a Segment Tree?", "options": ["O(n · q)", "O(n + q)", "O(n log n + q log n)", "O(q log q)"], "answer": 2, "explanation": "Building the tree costs O(n). Each query and each update costs O(log n). Total: O(n + 2q log n) = O(n log n + q log n). For n ≈ q this is O(n log n) — vastly better than the O(n · q) naive approach." }, { "question": "After calling update(idx, val) on a Segment Tree, which nodes are modified?", "options": ["Only the leaf node at idx", "All O(n) nodes in the tree", "The leaf at idx and all its ancestors up to the root", "The leaf at idx and its two immediate neighbours"], "answer": 2, "explanation": "The update path visits the root, walks down O(log n) levels to the target leaf, updates it, then re-aggregates each of the O(log n) ancestors on the way back. Sibling subtrees are never touched." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "A Segment Tree stores pre-computed aggregates at every level of a binary tree, enabling O(log n) for both range queries and point updates — unlike prefix sums (O(n) updates) or plain arrays (O(n) queries).", "Internal representation: 1-indexed array where node i has children 2i (left) and 2i+1 (right). Allocate 4n slots to be safe for any input size.", "Query has exactly three cases: no overlap → return identity; total overlap → return node value immediately; partial overlap → recurse both children and combine.", "Build runs in O(n) total; each query and update runs in O(log n). Space usage is O(n).", "The pattern generalises to any associative operation — min, max, GCD, XOR, product. Swapping the aggregation line is all that changes." ] }
\`\`\``,
    },
    {
      id: "range-sum-query-mutable",
      slug: "range-sum-query-mutable",
      title: "Range Sum Query - Mutable",
      content: `## Range Sum Query - Mutable

<!-- voice:section_check concept="Segment tree for sum queries" -->

The core tension: arrays that both **change** and need **fast range sums**. Solving one naively breaks the other.

\`\`\`concept
{ "title": "The Segment Tree Mental Model", "variant": "mental-model", "content": "A segment tree is a binary tree where each node stores the aggregate of a contiguous subarray. The root covers the whole array; each leaf covers one element. Any range [l, r] decomposes into at most O(log n) pre-computed nodes — so both range queries and point updates cost O(log n) regardless of array size." }
\`\`\`

### Problem Statement

Given integer array \`nums\`, implement two operations efficiently:

| Operation | Description |
|---|---|
| \`sumRange(left, right)\` | Return sum of elements from index \`left\` to \`right\`, inclusive |
| \`update(index, val)\` | Set \`nums[index] = val\` |

**Walkthrough example:**
\`\`\`
NumArray([1, 3, 5])
sumRange(0, 2) → 9    # 1 + 3 + 5
update(1, 2)           # nums becomes [1, 2, 5]
sumRange(0, 2) → 8    # 1 + 2 + 5
\`\`\`

### Why the Simpler Approaches Break Down

\`\`\`tabs
{ "tabs": [ { "label": "Brute Force", "icon": "🐢", "content": "**Loop over [left, right] on every query.**\\n\\n- \`sumRange\`: O(n) — linear scan each time\\n- \`update\`: O(1) — direct assignment\\n\\n**Problem:** With q queries on an n-element array, worst case is O(n × q). On 10 000 elements with 10 000 queries that's 100 million operations." }, { "label": "Prefix Sum", "icon": "📐", "content": "**Precompute cumulative sums so any range is O(1).**\\n\\n- \`sumRange(l, r)\`: O(1) — \`prefix[r+1] - prefix[l]\`\\n- \`update(i, val)\`: O(n) — rebuild the entire prefix array\\n\\n**Problem:** Works great when updates are rare. Falls apart with frequent writes — each update invalidates the whole prefix array." }, { "label": "Segment Tree", "icon": "🌳", "content": "**Binary tree where each internal node stores the sum of its children's range.**\\n\\n- \`sumRange(l, r)\`: O(log n) — at most 2 nodes visited per level\\n- \`update(i, val)\`: O(log n) — update leaf, recompute O(log n) ancestors\\n\\n**Best of both worlds:** Logarithmic for both operations regardless of query pattern." }, { "label": "BIT (Fenwick Tree)", "icon": "🔢", "content": "**Alternative with the same O(log n) complexity but less code.**\\n\\n- Smaller constant factor, cleaner implementation\\n- **Limitation:** Only works for *invertible* operations — sum and XOR yes, max and min no\\n\\nSegment trees generalize to any associative operation; BITs are the go-to for pure sum problems in competitive programming." } ] }
\`\`\`

### Building the Iterative Segment Tree

Store the entire tree in a flat array of size \`2n\`. Leaves occupy indices \`n\` to \`2n−1\`; internal nodes occupy \`1\` to \`n−1\`. Node \`i\`'s children are \`2i\` and \`2i+1\`; its parent is \`i // 2\`.

\`\`\`steps
{ "title": "Construction and Operations on [1, 3, 5]", "steps": [ { "title": "Allocate tree array of size 2n", "content": "For \`nums = [1, 3, 5]\`, \`n = 3\`. Create \`tree[0..5]\` (index 0 unused).\\n\\nLeaves will live at \`tree[3]\`, \`tree[4]\`, \`tree[5]\`." }, { "title": "Fill leaves from the input array", "content": "Copy \`nums[i]\` into \`tree[n + i]\`:\\n\\n\`\`\`\\ntree[3] = 1   # nums[0]\\ntree[4] = 3   # nums[1]\\ntree[5] = 5   # nums[2]\\n\`\`\`" }, { "title": "Build internal nodes bottom-up", "content": "Sweep \`i\` from \`n-1\` down to \`1\`. Each node sums its two children:\\n\\n\`\`\`\\ntree[2] = tree[4] + tree[5] = 3 + 5 = 8\\ntree[1] = tree[2] + tree[3] = 8 + 1 = 9\\n\`\`\`\\n\\nFinal tree: \`[_, 9, 8, 1, 3, 5]\` (index 0 unused)" }, { "title": "Point update: update(1, 2)", "content": "Find the leaf: \`pos = index + n = 1 + 3 = 4\`. Set it, then walk up to root recomputing each ancestor:\\n\\n\`\`\`\\ntree[4] = 2\\npos = 2 → tree[2] = tree[4] + tree[5] = 2 + 5 = 7\\npos = 1 → tree[1] = tree[2] + tree[3] = 7 + 1 = 8\\n\`\`\`\\n\\nTree is now \`[_, 8, 7, 1, 2, 5]\`" }, { "title": "Range query: sumRange(0, 2)", "content": "Translate to half-open tree-index range \`[l, r) = [3, 6)\`. Collect boundary nodes, halving inward:\\n\\n\`\`\`\\nl=3 (odd, right child)  → add tree[3]=1, l=4\\nr=6 (even)              → no action\\nhalve: l=2, r=3\\nl=2 (even)              → no action\\nr=3 (odd, right child)  → r=2, add tree[2]=7\\nhalve: l=1, r=1  → stop\\n\`\`\`\\n\\ntotal = 1 + 7 = **8** ✓" } ] }
\`\`\`

### Execution Trace: update(1, 2) → sumRange(0, 2)

\`\`\`trace
{ "title": "Segment tree update propagation and range query", "language": "python", "code": "def update(self, index, val):\\n    pos = index + self.n\\n    self.tree[pos] = val\\n    while pos > 1:\\n        pos //= 2\\n        self.tree[pos] = self.tree[2*pos] + self.tree[2*pos+1]\\n\\ndef sumRange(self, left, right):\\n    l = left + self.n\\n    r = right + self.n + 1\\n    total = 0\\n    while l < r:\\n        if l % 2 == 1:\\n            total += self.tree[l]\\n            l += 1\\n        if r % 2 == 1:\\n            r -= 1\\n            total += self.tree[r]\\n        l //= 2\\n        r //= 2\\n    return total", "frames": [ { "line": 2, "vars": { "index": 1, "val": 2, "pos": 4, "tree": "[_, 9, 8, 1, 3, 5]" }, "note": "Leaf for nums[1] is at pos = 1 + n = 4. Set tree[4] = 2." }, { "line": 5, "vars": { "pos": 2, "tree": "[_, 9, 7, 1, 2, 5]" }, "note": "pos = 4 // 2 = 2. Recompute: tree[2] = tree[4] + tree[5] = 2 + 5 = 7." }, { "line": 5, "vars": { "pos": 1, "tree": "[_, 8, 7, 1, 2, 5]" }, "note": "pos = 2 // 2 = 1. Recompute: tree[1] = tree[2] + tree[3] = 7 + 1 = 8. Done updating." }, { "line": 9, "vars": { "left": 0, "right": 2, "l": 3, "r": 6, "total": 0 }, "note": "sumRange(0, 2). Translate to half-open tree range [3, 6)." }, { "line": 12, "vars": { "l": 4, "r": 6, "total": 1 }, "note": "l=3 is odd (right child, not fully covered by parent). Absorb tree[3]=1, advance l=4." }, { "line": 18, "vars": { "l": 2, "r": 3, "total": 1 }, "note": "Both halved: l=2, r=3. l=2 is even — skip." }, { "line": 16, "vars": { "l": 2, "r": 2, "total": 8 }, "note": "r=3 is odd. r=2, absorb tree[2]=7. total=8. Halve: l=1, r=1. Loop ends.", "stdout": "8" } ], "speed": 900 }
\`\`\`

<!-- voice:key_insight insight="Use iterative segment tree for cleaner code — store tree in array where tree[i] is parent of tree[2i] and tree[2i+1]" -->

### Full Solution

\`\`\`playground
{ "title": "Range Sum Query - Mutable (Iterative Segment Tree)", "language": "python", "code": "class NumArray:\\n    def __init__(self, nums: list[int]):\\n        self.n = len(nums)\\n        self.tree = [0] * (2 * self.n)\\n        # Fill leaves\\n        for i in range(self.n):\\n            self.tree[self.n + i] = nums[i]\\n        # Build internal nodes bottom-up — O(n)\\n        for i in range(self.n - 1, 0, -1):\\n            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]\\n\\n    def update(self, index: int, val: int) -> None:\\n        pos = index + self.n\\n        self.tree[pos] = val\\n        while pos > 1:\\n            pos >>= 1\\n            self.tree[pos] = self.tree[2 * pos] + self.tree[2 * pos + 1]\\n\\n    def sumRange(self, left: int, right: int) -> int:\\n        l, r = left + self.n, right + self.n + 1\\n        total = 0\\n        while l < r:\\n            if l & 1:       # l is a right child — not covered by its parent\\n                total += self.tree[l]\\n                l += 1\\n            if r & 1:       # r-1 is a right child — grab before halving\\n                r -= 1\\n                total += self.tree[r]\\n            l >>= 1\\n            r >>= 1\\n        return total\\n\\n\\n# Verification\\nna = NumArray([1, 3, 5])\\nprint(na.sumRange(0, 2))   # 9\\nna.update(1, 2)\\nprint(na.sumRange(0, 2))   # 8", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why l & 1 instead of l % 2 == 1?", "content": "Both check whether l is odd — i.e., whether it is a right child in the tree. A right child is not fully covered by its parent's range (its parent also spans a left sibling outside the query), so the algorithm absorbs it directly rather than going up. The bitwise form is idiomatic in segment tree code and compiles to a single instruction." }
\`\`\`

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Naive prefix sum — O(n) update", "code": "class NumArray:\\n    def __init__(self, nums):\\n        self.nums = nums[:]\\n        self.prefix = [0] * (len(nums) + 1)\\n        for i, v in enumerate(nums):\\n            self.prefix[i+1] = self.prefix[i] + v\\n\\n    def update(self, index, val):\\n        # Must rebuild entire prefix array — O(n)\\n        self.nums[index] = val\\n        for i in range(len(self.nums)):\\n            self.prefix[i+1] = self.prefix[i] + self.nums[i]\\n\\n    def sumRange(self, left, right):\\n        return self.prefix[right+1] - self.prefix[left]" }, "after": { "label": "Segment tree — O(log n) both", "code": "class NumArray:\\n    def __init__(self, nums):\\n        self.n = len(nums)\\n        self.tree = [0] * (2 * self.n)\\n        for i in range(self.n):\\n            self.tree[self.n + i] = nums[i]\\n        for i in range(self.n - 1, 0, -1):\\n            self.tree[i] = self.tree[2*i] + self.tree[2*i+1]\\n\\n    def update(self, index, val):\\n        # Update leaf + O(log n) ancestors only\\n        pos = index + self.n\\n        self.tree[pos] = val\\n        while pos > 1:\\n            pos >>= 1\\n            self.tree[pos] = self.tree[2*pos] + self.tree[2*pos+1]\\n\\n    def sumRange(self, left, right):\\n        l, r = left + self.n, right + self.n + 1\\n        total = 0\\n        while l < r:\\n            if l & 1: total += self.tree[l]; l += 1\\n            if r & 1: r -= 1; total += self.tree[r]\\n            l >>= 1; r >>= 1\\n        return total" } }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Why the iterative query collects the right nodes", "content": "The query maintains a half-open interval \`[l, r)\` in tree-index space. At each step:\\n\\n- If \`l\` is **odd** (a right child), its parent also covers elements *to the left* of our query — so we cannot go up without over-counting. We absorb \`tree[l]\` directly and advance \`l\`.\\n- If \`r\` is **odd**, then \`r-1\` is a right child in the same situation — absorb \`tree[r-1]\` and retreat \`r\`.\\n- After handling boundaries, both \`l\` and \`r\` are even, so we safely move to the parent level by halving.\\n\\nThis shrinks the range by at least one level per iteration, terminating in O(log n) steps. At each level we visit at most 2 nodes — the classic '4 nodes per level' bound for segment tree queries." }
\`\`\`

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Knowledge Check

\`\`\`quiz
{ "title": "Segment Tree — Range Sum Query", "questions": [ { "question": "In an iterative segment tree with n elements, where are the leaves stored?", "options": ["Indices 0 to n-1", "Indices 1 to n", "Indices n to 2n-1", "Indices 2n to 4n-1"], "answer": 2, "explanation": "Leaves occupy tree[n] through tree[2n-1], where tree[n+i] = nums[i]. Internal nodes occupy indices 1 through n-1. Index 0 is deliberately unused so that parent-child relationships (children of i are 2i and 2i+1) work out cleanly." }, { "question": "After calling update(index, val), exactly how many nodes in the segment tree must be recomputed?", "options": ["1 — only the leaf", "n — the entire leaf level", "O(log n) — the leaf's ancestors up to the root", "O(n) — the whole tree"], "answer": 2, "explanation": "Only the ancestors of the updated leaf need recomputing. The tree has O(log n) levels, so the path from leaf to root visits O(log n) nodes. Every sibling and cousin is unaffected because no element in their subtree changed." }, { "question": "Why can a Binary Indexed Tree (Fenwick Tree) compute range sums but NOT range maximums?", "options": ["BITs do not support range queries at all", "Maximum is not an invertible operation — you cannot recover max(l, r) from max(0, r) and max(0, l-1)", "BITs require the array values to be non-negative", "BITs only work when n is a power of 2"], "answer": 1, "explanation": "BITs rely on the aggregate being invertible: for sums, prefix[r] - prefix[l-1] isolates the subrange. Maximum has no inverse — knowing the global max up to r and up to l-1 tells you nothing about the max strictly between l and r. Segment trees avoid this by storing the answer for every range explicitly." }, { "question": "What is the time complexity to build a segment tree from scratch on an array of n elements?", "options": ["O(n log n)", "O(n)", "O(log n)", "O(n^2)"], "answer": 1, "explanation": "Building fills n leaves (O(n)) then computes n-1 internal nodes in a single bottom-up pass (O(n)). Total is O(n). This is better than performing n individual point updates which would each cost O(log n) for a total of O(n log n)." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "A segment tree stores the array in a flat array of size 2n: leaves at n..2n-1, internal nodes at 1..n-1, with node i's children at 2i and 2i+1.", "Both point update and range query run in O(log n) — optimal when updates and range queries are both frequent.", "The iterative update walks from the leaf up to the root recomputing O(log n) ancestors; the query collects at most 2 boundary nodes per level as it halves inward.", "BITs (Fenwick Trees) match this complexity with less code for sum/XOR, but segment trees generalize to any associative operation (max, min, GCD) and support lazy propagation for range updates.", "Always build the tree bottom-up in O(n) — never initialize by performing n separate updates at O(n log n) total." ] }
\`\`\``,
      starterCode: `class NumArray:
    """
    Segment Tree implementation for range sum queries with updates.
    
    Example:
        >>> nums = NumArray([1, 3, 5])
        >>> nums.sumRange(0, 2)
        9
        >>> nums.update(1, 2)
        >>> nums.sumRange(0, 2)
        8
    """
    
    def __init__(self, nums):
        """Initialize with nums array."""
        # TODO: Build segment tree
        pass
    
    def update(self, index, val):
        """Update nums[index] to val."""
        # TODO: Update segment tree
        pass
    
    def sumRange(self, left, right):
        """Return sum of nums[left..right]."""
        # TODO: Query segment tree
        pass


# ─── Test Cases ───

# Basic operations
nums = NumArray([1, 3, 5])
print(nums.sumRange(0, 2))  # Expected: 9

nums.update(1, 2)
print(nums.sumRange(0, 2))  # Expected: 8

# Single element
nums2 = NumArray([5])
print(nums2.sumRange(0, 0))  # Expected: 5
nums2.update(0, 10)
print(nums2.sumRange(0, 0))  # Expected: 10

# Multiple updates
nums3 = NumArray([0, 9, 5, 7, 3])
print(nums3.sumRange(0, 4))  # Expected: 24
nums3.update(1, 1)
print(nums3.sumRange(0, 4))  # Expected: 16
nums3.update(2, 2)
print(nums3.sumRange(0, 2))  # Expected: 3
`,
      solutionCode: `class NumArray:
    """
    Segment Tree implementation for range sum queries with updates.
    
    Time Complexity:
        __init__: O(n)
        update: O(log n)
        sumRange: O(log n)
    Space Complexity: O(n)
    """
    
    def __init__(self, nums):
        self.n = len(nums)
        # Use 4*n size for safety (max nodes in segment tree)
        self.tree = [0] * (4 * self.n)
        self.nums = nums
        if self.n > 0:
            self._build(0, 0, self.n - 1, nums)
    
    def _build(self, node, start, end, nums):
        """Build segment tree recursively."""
        if start == end:
            self.tree[node] = nums[start]
        else:
            mid = (start + end) // 2
            self._build(2 * node + 1, start, mid, nums)
            self._build(2 * node + 2, mid + 1, end, nums)
            self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def update(self, index, val):
        """Update nums[index] to val."""
        self._update(0, 0, self.n - 1, index, val)
    
    def _update(self, node, start, end, idx, val):
        """Update segment tree recursively."""
        if start == end:
            self.tree[node] = val
        else:
            mid = (start + end) // 2
            if start <= idx <= mid:
                self._update(2 * node + 1, start, mid, idx, val)
            else:
                self._update(2 * node + 2, mid + 1, end, idx, val)
            self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def sumRange(self, left, right):
        """Return sum of nums[left..right]."""
        return self._query(0, 0, self.n - 1, left, right)
    
    def _query(self, node, start, end, L, R):
        """Query sum over range [L, R]."""
        # No overlap
        if R < start or end < L:
            return 0
        # Total overlap
        if L <= start and end <= R:
            return self.tree[node]
        # Partial overlap
        mid = (start + end) // 2
        left_sum = self._query(2 * node + 1, start, mid, L, R)
        right_sum = self._query(2 * node + 2, mid + 1, end, L, R)
        return left_sum + right_sum


# Iterative Segment Tree (more efficient)
class NumArrayIterative:
    """Iterative segment tree implementation."""
    
    def __init__(self, nums):
        n = len(nums)
        self.n = n
        # Size to next power of 2
        self.size = 1
        while self.size < n:
            self.size *= 2
        
        # Tree has 2*size elements
        self.tree = [0] * (2 * self.size)
        
        # Copy nums to leaves
        for i in range(n):
            self.tree[self.size + i] = nums[i]
        
        # Build tree
        for i in range(self.size - 1, 0, -1):
            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]
    
    def update(self, index, val):
        # Update leaf
        i = self.size + index
        self.tree[i] = val
        
        # Propagate up
        i //= 2
        while i >= 1:
            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]
            i //= 2
    
    def sumRange(self, left, right):
        # Convert to leaf indices
        l = self.size + left
        r = self.size + right
        res = 0
        
        while l <= r:
            if l % 2 == 1:  # l is right child
                res += self.tree[l]
                l += 1
            if r % 2 == 0:  # r is left child
                res += self.tree[r]
                r -= 1
            l //= 2
            r //= 2
        
        return res


# ─── Test Cases ───
nums = NumArray([1, 3, 5])
print(nums.sumRange(0, 2))  # Expected: 9

nums.update(1, 2)
print(nums.sumRange(0, 2))  # Expected: 8

nums2 = NumArray([5])
print(nums2.sumRange(0, 0))  # Expected: 5
nums2.update(0, 10)
print(nums2.sumRange(0, 0))  # Expected: 10

nums3 = NumArray([0, 9, 5, 7, 3])
print(nums3.sumRange(0, 4))  # Expected: 24
nums3.update(1, 1)
print(nums3.sumRange(0, 4))  # Expected: 16
nums3.update(2, 2)
print(nums3.sumRange(0, 2))  # Expected: 3
`,
    },
    {
      id: "range-maximum-query",
      slug: "range-maximum-query",
      title: "Range Maximum Query",
      content: `## Range Maximum Query

<!-- voice:section_check concept="Segment tree for max queries" -->

### Problem Statement

Given an integer array \`nums\`, handle multiple queries:
1. \`query(left, right)\`: Return maximum element between indices left and right inclusive
2. \`update(index, val)\`: Update element at index to val

### Examples

~~~
Input:
["SegTree", "query", "update", "query"]
[[[1, 3, 5, 7, 9]], [0, 4], [2, 10], [0, 4]]

Output:
[null, 9, null, 10]

Explanation:
SegTree st = new SegTree([1, 3, 5, 7, 9])
st.query(0, 4)     # max([1,3,5,7,9]) = 9
st.update(2, 10)   # nums = [1, 3, 10, 7, 9]
st.query(0, 4)     # max([1,3,10,7,9]) = 10
~~~

### Approach

**Segment Tree for Maximum:**
- Same structure as sum segment tree
- Internal nodes store max of children instead of sum
- Query returns max over range

**Changes from Sum Segment Tree:**
- Merge operation: max(left, right) instead of left + right
- Base case for no overlap: -infinity instead of 0

<!-- voice:key_insight insight="Segment tree can aggregate any associative operation — max, min, gcd, sum — just change the merge function" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Build:** O(n)
- **Query:** O(log n)
- **Update:** O(log n)
- **Space:** O(n)`,
      starterCode: `class SegTreeMax:
    """
    Segment Tree for range maximum queries with updates.
    
    Example:
        >>> st = SegTreeMax([1, 3, 5, 7, 9])
        >>> st.query(0, 4)
        9
        >>> st.update(2, 10)
        >>> st.query(0, 4)
        10
    """
    
    def __init__(self, nums):
        """Initialize with nums array."""
        # TODO: Build max segment tree
        pass
    
    def update(self, index, val):
        """Update nums[index] to val."""
        # TODO: Update max segment tree
        pass
    
    def query(self, left, right):
        """Return max of nums[left..right]."""
        # TODO: Query max segment tree
        pass


# ─── Test Cases ───

# Basic operations
st = SegTreeMax([1, 3, 5, 7, 9])
print(st.query(0, 4))  # Expected: 9
print(st.query(0, 2))  # Expected: 5
print(st.query(3, 4))  # Expected: 9

st.update(2, 10)
print(st.query(0, 4))  # Expected: 10
print(st.query(0, 2))  # Expected: 10

# Single element
st2 = SegTreeMax([5])
print(st2.query(0, 0))  # Expected: 5
st2.update(0, 100)
print(st2.query(0, 0))  # Expected: 100

# Decreasing array
st3 = SegTreeMax([9, 7, 5, 3, 1])
print(st3.query(0, 4))  # Expected: 9
print(st3.query(2, 4))  # Expected: 5
st3.update(4, 10)
print(st3.query(2, 4))  # Expected: 10
`,
      solutionCode: `class SegTreeMax:
    """
    Segment Tree for range maximum queries with updates.
    
    Time Complexity:
        __init__: O(n)
        update: O(log n)
        query: O(log n)
    Space Complexity: O(n)
    """
    
    def __init__(self, nums):
        self.n = len(nums)
        self.tree = [float('-inf')] * (4 * self.n)
        if self.n > 0:
            self._build(0, 0, self.n - 1, nums)
    
    def _build(self, node, start, end, nums):
        """Build max segment tree."""
        if start == end:
            self.tree[node] = nums[start]
        else:
            mid = (start + end) // 2
            self._build(2 * node + 1, start, mid, nums)
            self._build(2 * node + 2, mid + 1, end, nums)
            self.tree[node] = max(self.tree[2 * node + 1], self.tree[2 * node + 2])
    
    def update(self, index, val):
        """Update nums[index] to val."""
        self._update(0, 0, self.n - 1, index, val)
    
    def _update(self, node, start, end, idx, val):
        """Update max segment tree."""
        if start == end:
            self.tree[node] = val
        else:
            mid = (start + end) // 2
            if start <= idx <= mid:
                self._update(2 * node + 1, start, mid, idx, val)
            else:
                self._update(2 * node + 2, mid + 1, end, idx, val)
            self.tree[node] = max(self.tree[2 * node + 1], self.tree[2 * node + 2])
    
    def query(self, left, right):
        """Return max of nums[left..right]."""
        return self._query(0, 0, self.n - 1, left, right)
    
    def _query(self, node, start, end, L, R):
        """Query max over range [L, R]."""
        # No overlap
        if R < start or end < L:
            return float('-inf')
        # Total overlap
        if L <= start and end <= R:
            return self.tree[node]
        # Partial overlap
        mid = (start + end) // 2
        left_max = self._query(2 * node + 1, start, mid, L, R)
        right_max = self._query(2 * node + 2, mid + 1, end, L, R)
        return max(left_max, right_max)


# Generic segment tree (works for any associative operation)
class SegTree:
    """Generic segment tree with custom operation."""
    
    def __init__(self, nums, op, default):
        """
        Args:
            nums: Array of values
            op: Binary operation (e.g., max, min, lambda x,y: x+y)
            default: Identity for op (e.g., -inf for max, 0 for sum)
        """
        self.n = len(nums)
        self.op = op
        self.default = default
        self.tree = [default] * (4 * self.n)
        if self.n > 0:
            self._build(0, 0, self.n - 1, nums)
    
    def _build(self, node, start, end, nums):
        if start == end:
            self.tree[node] = nums[start]
        else:
            mid = (start + end) // 2
            self._build(2 * node + 1, start, mid, nums)
            self._build(2 * node + 2, mid + 1, end, nums)
            self.tree[node] = self.op(self.tree[2 * node + 1], self.tree[2 * node + 2])
    
    def update(self, index, val):
        self._update(0, 0, self.n - 1, index, val)
    
    def _update(self, node, start, end, idx, val):
        if start == end:
            self.tree[node] = val
        else:
            mid = (start + end) // 2
            if start <= idx <= mid:
                self._update(2 * node + 1, start, mid, idx, val)
            else:
                self._update(2 * node + 2, mid + 1, end, idx, val)
            self.tree[node] = self.op(self.tree[2 * node + 1], self.tree[2 * node + 2])
    
    def query(self, left, right):
        return self._query(0, 0, self.n - 1, left, right)
    
    def _query(self, node, start, end, L, R):
        if R < start or end < L:
            return self.default
        if L <= start and end <= R:
            return self.tree[node]
        mid = (start + end) // 2
        left_val = self._query(2 * node + 1, start, mid, L, R)
        right_val = self._query(2 * node + 2, mid + 1, end, L, R)
        return self.op(left_val, right_val)


# ─── Test Cases ───
st = SegTreeMax([1, 3, 5, 7, 9])
print(st.query(0, 4))  # Expected: 9
print(st.query(0, 2))  # Expected: 5
print(st.query(3, 4))  # Expected: 9

st.update(2, 10)
print(st.query(0, 4))  # Expected: 10
print(st.query(0, 2))  # Expected: 10

st2 = SegTreeMax([5])
print(st2.query(0, 0))  # Expected: 5
st2.update(0, 100)
print(st2.query(0, 0))  # Expected: 100

st3 = SegTreeMax([9, 7, 5, 3, 1])
print(st3.query(0, 4))  # Expected: 9
print(st3.query(2, 4))  # Expected: 5
st3.update(4, 10)
print(st3.query(2, 4))  # Expected: 10
`,
    },
    {
      id: "count-of-smaller-numbers",
      slug: "count-of-smaller-numbers",
      title: "Count of Smaller Numbers After Self",
      content: `## Count of Smaller Numbers After Self

<!-- voice:section_check concept="Segment tree for counting/inversion problems" -->

### Problem Statement

Given an integer array \`nums\`, return a new array \`counts\` where \`counts[i]\` is the number of smaller elements to the right of \`nums[i]\`.

### Examples

~~~
Input: nums = [5, 2, 6, 1]
Output: [2, 1, 1, 0]
Explanation:
- 5: elements smaller to right are [2, 1] → count = 2
- 2: elements smaller to right are [1] → count = 1
- 6: elements smaller to right are [1] → count = 1
- 1: no elements to right → count = 0
~~~

~~~
Input: nums = [-1, -1]
Output: [0, 0]
~~~

### Approach

**Segment Tree for Frequency Counting:**
1. Coordinate compression: Map values to [0, n-1] range
2. Process array from right to left
3. For each element:
   - Query segment tree for count of elements < current
   - Update segment tree: increment count at current value

**Alternative: Fenwick Tree / Binary Indexed Tree** — more space efficient

<!-- voice:key_insight insight="Process right-to-left and use segment tree to count how many of each value we've seen — query sum over [0, current-1]" -->

<!-- voice:exercise_intro difficulty="hard" hints_available="3" -->

### Complexity

- **Coordinate compression:** O(n log n)
- **Query/Update:** O(log n) each
- **Total:** O(n log n) time, O(n) space`,
      starterCode: `def count_smaller(nums):
    """
    Return count of smaller elements to the right of each element.
    
    Args:
        nums: List of integers
    
    Returns:
        List of counts
    
    Example:
        >>> count_smaller([5, 2, 6, 1])
        [2, 1, 1, 0]
        >>> count_smaller([-1, -1])
        [0, 0]
    """
    # TODO: Use segment tree with coordinate compression
    # Hint: Compress values, then process right-to-left
    pass


# ─── Test Cases ───

# Standard case
print(count_smaller([5, 2, 6, 1]))
# Expected: [2, 1, 1, 0]

# All same elements
print(count_smaller([-1, -1]))
# Expected: [0, 0]

# Increasing sequence
print(count_smaller([1, 2, 3, 4]))
# Expected: [0, 0, 0, 0]

# Decreasing sequence
print(count_smaller([4, 3, 2, 1]))
# Expected: [3, 2, 1, 0]

# Single element
print(count_smaller([1]))
# Expected: [0]

# Empty array
print(count_smaller([]))
# Expected: []

# With duplicates
print(count_smaller([2, 0, 1]))
# Expected: [2, 0, 0]
`,
      solutionCode: `class SegmentTree:
    """Segment tree for sum queries."""
    def __init__(self, size):
        self.n = size
        self.tree = [0] * (4 * size)
    
    def update(self, index, delta=1):
        """Add delta at index."""
        self._update(0, 0, self.n - 1, index, delta)
    
    def _update(self, node, start, end, idx, delta):
        if start == end:
            self.tree[node] += delta
        else:
            mid = (start + end) // 2
            if idx <= mid:
                self._update(2 * node + 1, start, mid, idx, delta)
            else:
                self._update(2 * node + 2, mid + 1, end, idx, delta)
            self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def query(self, left, right):
        """Sum over range [left, right]."""
        if left > right:
            return 0
        return self._query(0, 0, self.n - 1, left, right)
    
    def _query(self, node, start, end, L, R):
        if R < start or end < L:
            return 0
        if L <= start and end <= R:
            return self.tree[node]
        mid = (start + end) // 2
        return self._query(2 * node + 1, start, mid, L, R) + \\
               self._query(2 * node + 2, mid + 1, end, L, R)


def count_smaller(nums):
    """
    Return count of smaller elements to the right of each element.
    
    Time Complexity: O(n log n)
    Space Complexity: O(n)
    """
    if not nums:
        return []
    
    # Coordinate compression
    sorted_unique = sorted(set(nums))
    rank = {v: i for i, v in enumerate(sorted_unique)}
    
    # Process right to left
    st = SegmentTree(len(sorted_unique))
    result = []
    
    for num in reversed(nums):
        r = rank[num]
        # Count elements with rank < r (smaller values)
        count = st.query(0, r - 1)
        result.append(count)
        # Add current element
        st.update(r)
    
    # Reverse to get original order
    return result[::-1]


# Alternative: Fenwick Tree (Binary Indexed Tree)
class FenwickTree:
    """Fenwick Tree for sum queries."""
    def __init__(self, size):
        self.n = size
        self.tree = [0] * (size + 1)
    
    def update(self, index, delta=1):
        """Add delta at index (0-indexed)."""
        i = index + 1  # Fenwick tree is 1-indexed
        while i <= self.n:
            self.tree[i] += delta
            i += i & -i
    
    def query(self, index):
        """Sum of [0, index] (0-indexed)."""
        if index < 0:
            return 0
        i = index + 1
        res = 0
        while i > 0:
            res += self.tree[i]
            i -= i & -i
        return res


def count_smaller_fenwick(nums):
    """Fenwick tree implementation (more concise)."""
    if not nums:
        return []
    
    # Coordinate compression
    sorted_unique = sorted(set(nums))
    rank = {v: i for i, v in enumerate(sorted_unique)}
    
    ft = FenwickTree(len(sorted_unique))
    result = []
    
    for num in reversed(nums):
        r = rank[num]
        count = ft.query(r - 1)
        result.append(count)
        ft.update(r)
    
    return result[::-1]


# ─── Test Cases ───
print(count_smaller([5, 2, 6, 1]))
# Expected: [2, 1, 1, 0]

print(count_smaller([-1, -1]))
# Expected: [0, 0]

print(count_smaller([1, 2, 3, 4]))
# Expected: [0, 0, 0, 0]

print(count_smaller([4, 3, 2, 1]))
# Expected: [3, 2, 1, 0]

print(count_smaller([1]))
# Expected: [0]

print(count_smaller([]))
# Expected: []

print(count_smaller([2, 0, 1]))
# Expected: [2, 0, 0]
`,
    },
    {
      id: "segment-tree-checkpoint",
      slug: "segment-tree-checkpoint",
      title: "Module Checkpoint: Segment Tree",
      content: `## Module Checkpoint: Segment Tree

<!-- voice:checkpoint_intro -->

Great work on the Segment Tree module! Let's verify your understanding.

### Quick Review

You learned:
- **Segment Tree structure**: Complete binary tree storing range aggregates
- **Build:** O(n) recursive construction
- **Query:** O(log n) range queries
- **Update:** O(log n) point updates
- **Range Maximum Query:** Same structure, different aggregation
- **Count Smaller:** Coordinate compression + frequency counting

### Quiz

**Question 1:** What is the time complexity of a range query in a segment tree?
- A) O(1)
- B) O(log n)
- C) O(n)
- D) O(n log n)

**Question 2:** What is the space complexity of a segment tree?
- A) O(n)
- B) O(4n) typically
- C) O(log n)
- D) O(1)

**Question 3:** Why do we use coordinate compression in the "Count of Smaller Numbers" problem?
- A) To make the code shorter
- B) To handle negative numbers and large ranges
- C) To sort the array
- D) It's not necessary

**Question 4:** True or False: Segment trees can only be used for sum queries.

**Question 5:** What is the key difference between sum and max segment trees?
- A) Nothing, they're the same
- B) The merge operation (sum vs max) and identity value (0 vs -inf)
- C) The tree structure is different
- D) Query time complexity differs

### Voice Summary

Your coach will ask you to:
- Explain segment tree structure and operations
- Walk through a range query example
- Explain coordinate compression
- Compare segment tree with prefix sums

**You're mastering the Segment Tree pattern!**`,
    },
  ],
};
