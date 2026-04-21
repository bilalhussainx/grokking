import { Module } from "../types";

export const triesAdvancedModule: Module = {
  id: "ds-tries",
  title: "Tries & Advanced Structures",
  description: "Build tries from scratch, solve word search and autocomplete, then master segment trees, Fenwick trees, and DS selection strategy.",
  lessons: [
    {
      id: "tries-intro",
      slug: "tries-intro",
      title: "Intro to Tries",
      content: `## Intro to Tries

A trie (pronounced "try") is a tree-like data structure for storing strings where each node represents a character. Tries excel at prefix-based operations — checking if any word starts with a given prefix is O(m) where m is the prefix length, regardless of how many words are stored.

### Why Tries?

Consider storing a dictionary of 100,000 words and answering "does any word start with 'pre'?" A hash set would require checking every word — O(n). A trie answers in O(3) — just walk down three nodes.

### Structure

Each node contains:
- A dictionary of children (character -> child node).
- A boolean flag marking whether this node is the end of a complete word.

\`\`\`
Words: "cat", "car", "card", "dog"

Root
|-- c
|   +-- a
|       |-- t*
|       +-- r*
|           +-- d*
+-- d
    +-- o
        +-- g*

(* marks end of word)
\`\`\`

### Key Operations

| Operation | Time | Description |
|-----------|------|-------------|
| Insert | O(m) | Add a word of length m |
| Search | O(m) | Check if exact word exists |
| startsWith | O(m) | Check if any word has this prefix |
| Delete | O(m) | Remove a word |

### Comparison with Hash Sets

| Feature | Hash Set | Trie |
|---------|----------|------|
| Exact lookup | O(1) avg | O(m) |
| Prefix search | O(n) | O(m) |
| Autocomplete | O(n) | O(m + k) |
| Sorted iteration | O(n log n) | O(n) natural |
| Space | O(n * m) | Shared prefixes save space |

### When to Use Tries

- **Autocomplete / type-ahead**: Find all words starting with a prefix.
- **Spell checking**: Suggest corrections by exploring nearby trie paths.
- **IP routing**: Longest prefix matching in network routers.
- **Word games**: Scrabble, Boggle — quickly validate partial words.
- **Counting distinct prefixes**: Each trie node represents a unique prefix.

### Memory Considerations

A naive trie with 26 children per node wastes memory for sparse nodes. In practice, use a dictionary (hash map) for children. This gives O(1) child access while only storing existing children.

### Interview Frequency

Tries appear frequently at FAANG companies. The most common problems are: implement a trie, word search II (trie + backtracking on a grid), and design autocomplete. Understanding the trie structure unlocks all of these.

### Key Insight

A trie is essentially a deterministic finite automaton (DFA) for a set of strings. Walking the trie from root to a node traces out a prefix. This mental model helps you see when a trie is the right tool.`,
    },
    {
      id: "tries-implementation",
      slug: "trie-implementation",
      title: "Implementing a Trie",
      content: `## Implementing a Trie

Building a trie from scratch is one of the most commonly asked data structure implementation problems. The code is surprisingly short once you understand the structure.

### TrieNode Design

Each node needs two things:
1. **children**: A dictionary mapping characters to child TrieNodes.
2. **is_end**: A boolean indicating whether a complete word ends at this node.

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
\`\`\`

### Insert

To insert a word, walk through the trie character by character. If a character node doesn't exist, create it. After processing all characters, mark the last node as a word ending.

### Search

Walk through the trie character by character. If at any point the next character doesn't exist in children, the word is not in the trie. If you reach the end, check \`is_end\` — the path might be a prefix of another word but not a complete word itself.

### StartsWith (Prefix Search)

Identical to search, but you don't need to check \`is_end\`. If you can walk the entire prefix without a dead end, at least one word has this prefix.

### Delete (Bonus)

Deletion is trickier. You need to walk to the word's end, unmark \`is_end\`, then potentially clean up nodes that are no longer part of any word. A recursive approach works well — if a node has no children and is not a word ending, it can be removed.

### Complexity Analysis

- **Time**: All operations are O(m) where m is the word/prefix length.
- **Space**: O(N * M) in the worst case, where N is the number of words and M is the average word length. In practice, shared prefixes reduce this significantly.

### Implementation Tips

- Use \`dict\` for children (not a fixed-size array) — cleaner code and memory-efficient.
- The root node is always empty — it represents the empty string prefix.
- For counting words with a prefix, store a count at each node instead of just a boolean.

Implement a complete Trie class with insert, search, and startsWith.`,
      starterCode: `class TrieNode:
    def __init__(self):
        self.children = {}   # char -> TrieNode
        self.is_end = False  # True if a complete word ends here


class Trie:
    """
    Prefix tree supporting insert, search, and startsWith.
    All operations run in O(m) time where m is the word length.
    """

    def __init__(self):
        """Initialize the trie with an empty root node."""
        # TODO: Create root TrieNode
        pass

    def insert(self, word: str) -> None:
        """
        Insert a word into the trie.
        Time: O(m), Space: O(m) worst case
        """
        # TODO: Start at root
        # TODO: For each character in word:
        #   - If char not in current node's children, create new TrieNode
        #   - Move to the child node
        # TODO: Mark the final node as end of word
        pass

    def search(self, word: str) -> bool:
        """
        Return True if the exact word is in the trie.
        Time: O(m)
        """
        # TODO: Walk the trie character by character
        # TODO: If any character is missing, return False
        # TODO: At the end, return whether this node is marked as word end
        pass

    def starts_with(self, prefix: str) -> bool:
        """
        Return True if any word in the trie starts with the given prefix.
        Time: O(m)
        """
        # TODO: Walk the trie character by character
        # TODO: If any character is missing, return False
        # TODO: If we reach the end of prefix, return True
        pass

    def count_with_prefix(self, prefix: str) -> int:
        """
        Count how many words in the trie start with the given prefix.
        Time: O(m + k) where k is the number of nodes in the subtree
        """
        # TODO: Navigate to the prefix end node
        # TODO: DFS to count all is_end nodes in the subtree
        pass


# Test cases
trie = Trie()
trie.insert("apple")
trie.insert("app")
trie.insert("application")
trie.insert("bat")
trie.insert("ball")

print(trie.search("apple"))       # True
print(trie.search("app"))         # True
print(trie.search("ap"))          # False — prefix, not a word
print(trie.search("banana"))      # False

print(trie.starts_with("app"))    # True
print(trie.starts_with("ba"))     # True
print(trie.starts_with("cat"))    # False

print(trie.count_with_prefix("app"))  # 3 — apple, app, application
print(trie.count_with_prefix("ba"))   # 2 — bat, ball
print(trie.count_with_prefix("z"))    # 0
`,
      solutionCode: `class TrieNode:
    def __init__(self):
        self.children = {}   # char -> TrieNode
        self.is_end = False  # True if a complete word ends here


class Trie:
    """
    Prefix tree supporting insert, search, and startsWith.
    All operations run in O(m) time where m is the word length.
    """

    def __init__(self):
        """Initialize the trie with an empty root node."""
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        """
        Insert a word into the trie.
        Time: O(m), Space: O(m) worst case
        """
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def search(self, word: str) -> bool:
        """
        Return True if the exact word is in the trie.
        Time: O(m)
        """
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end

    def starts_with(self, prefix: str) -> bool:
        """
        Return True if any word in the trie starts with the given prefix.
        Time: O(m)
        """
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True

    def count_with_prefix(self, prefix: str) -> int:
        """
        Count how many words in the trie start with the given prefix.
        Time: O(m + k) where k is the number of nodes in the subtree
        """
        node = self.root
        for char in prefix:
            if char not in node.children:
                return 0
            node = node.children[char]

        # DFS to count all word endings in this subtree
        count = 0
        stack = [node]
        while stack:
            current = stack.pop()
            if current.is_end:
                count += 1
            for child in current.children.values():
                stack.append(child)
        return count


# Test cases
trie = Trie()
trie.insert("apple")
trie.insert("app")
trie.insert("application")
trie.insert("bat")
trie.insert("ball")

print(trie.search("apple"))       # True
print(trie.search("app"))         # True
print(trie.search("ap"))          # False — prefix, not a word
print(trie.search("banana"))      # False

print(trie.starts_with("app"))    # True
print(trie.starts_with("ba"))     # True
print(trie.starts_with("cat"))    # False

print(trie.count_with_prefix("app"))  # 3 — apple, app, application
print(trie.count_with_prefix("ba"))   # 2 — bat, ball
print(trie.count_with_prefix("z"))    # 0
`,
    },
    {
      id: "tries-word-search",
      slug: "word-search-autocomplete",
      title: "Word Search & Autocomplete",
      content: `## Word Search & Autocomplete

One of the most powerful applications of tries is building autocomplete systems. Given a prefix, you need to return all words that start with it — ranked by some criteria like frequency or alphabetical order. This is the backbone of search bars, IDE intellisense, and phone keyboards.

### The Autocomplete Pattern

1. **Navigate** to the trie node representing the prefix.
2. **Explore** all paths from that node using DFS/BFS.
3. **Collect** every complete word found (nodes where \`is_end == True\`).
4. **Rank** the results by frequency, recency, or alphabetical order.

### Building the Prefix

The first step is identical to \`starts_with\` — walk the trie along the prefix characters. If the prefix doesn't exist, return an empty list immediately.

### Collecting All Words from a Node

From the prefix node, perform DFS. At each step, build up the current word by appending characters. When you reach an \`is_end\` node, add the complete word to results.

### Optimization: Top-K Results

In practice, autocomplete only needs the top K results. You can:
- **Early termination**: Stop DFS after collecting K results (works for alphabetical order since trie DFS is naturally alphabetical).
- **Priority queue**: If ranking by frequency, store frequency at each word-end node and use a heap.
- **Precomputed lists**: At each node, store the top-K words in its subtree. Trades space for O(1) query time.

### Word Search on a Grid

A related problem is "Word Search II" (LeetCode 212): given a grid of characters and a list of words, find all words that can be formed by tracing adjacent cells. The optimal approach:

1. Insert all target words into a trie.
2. DFS from each cell in the grid.
3. At each step, check if the current path matches a trie prefix. If not, prune the search.
4. When a complete word is found (\`is_end\`), add it to results.

The trie prunes invalid paths early, avoiding redundant exploration.

### Interview Tips

- Always clarify: case-sensitive? Should results be sorted? Is there a limit on results?
- For autocomplete, the trie approach is O(p + k) where p is prefix length and k is the number of matching words — much better than scanning all words.
- The word search grid problem is a FAANG favorite. Practice the trie + backtracking combo.

Implement a trie-based autocomplete system.`,
      starterCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.word = None  # Store the complete word at end nodes


class AutoComplete:
    """
    Trie-based autocomplete system.
    Insert words, then query suggestions by prefix.
    """

    def __init__(self):
        # TODO: Create root TrieNode
        pass

    def insert(self, word: str) -> None:
        """Insert a word into the autocomplete trie."""
        # TODO: Walk the trie, create nodes as needed
        # TODO: Mark end node and store the complete word
        pass

    def suggest(self, prefix: str, max_results: int = 5) -> list[str]:
        """
        Return up to max_results words that start with prefix.
        Results are in alphabetical order.

        Time: O(p + k) where p = prefix length, k = results collected
        """
        # TODO: Navigate to the prefix node
        # TODO: If prefix doesn't exist, return []
        # TODO: DFS from prefix node to collect words
        # TODO: Stop after max_results
        pass

    def _dfs_collect(self, node, results: list[str], max_results: int) -> None:
        """DFS helper to collect words from a subtree."""
        # TODO: If node is end of word, add to results
        # TODO: If results is full, return
        # TODO: Visit children in sorted order (alphabetical)
        # TODO: Recurse into each child
        pass


# Test cases
ac = AutoComplete()
words = ["apple", "app", "application", "apply", "apt",
         "bat", "batch", "bath", "ball", "balance"]
for w in words:
    ac.insert(w)

print(ac.suggest("app"))
# ['app', 'apple', 'application', 'apply']

print(ac.suggest("ba", 3))
# ['balance', 'ball', 'bat']

print(ac.suggest("bat"))
# ['bat', 'batch', 'bath']

print(ac.suggest("xyz"))
# []

print(ac.suggest("app", 2))
# ['app', 'apple']
`,
      solutionCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.word = None  # Store the complete word at end nodes


class AutoComplete:
    """
    Trie-based autocomplete system.
    Insert words, then query suggestions by prefix.
    """

    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        """Insert a word into the autocomplete trie."""
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
        node.word = word

    def suggest(self, prefix: str, max_results: int = 5) -> list[str]:
        """
        Return up to max_results words that start with prefix.
        Results are in alphabetical order.

        Time: O(p + k) where p = prefix length, k = results collected
        """
        # Navigate to the prefix node
        node = self.root
        for char in prefix:
            if char not in node.children:
                return []
            node = node.children[char]

        # DFS to collect all words from this subtree
        results = []
        self._dfs_collect(node, results, max_results)
        return results

    def _dfs_collect(self, node, results: list[str], max_results: int) -> None:
        """DFS helper to collect words from a subtree."""
        if len(results) >= max_results:
            return

        if node.is_end:
            results.append(node.word)

        # Visit children in sorted (alphabetical) order
        for char in sorted(node.children.keys()):
            if len(results) >= max_results:
                return
            self._dfs_collect(node.children[char], results, max_results)


# Test cases
ac = AutoComplete()
words = ["apple", "app", "application", "apply", "apt",
         "bat", "batch", "bath", "ball", "balance"]
for w in words:
    ac.insert(w)

print(ac.suggest("app"))
# ['app', 'apple', 'application', 'apply']

print(ac.suggest("ba", 3))
# ['balance', 'ball', 'bat']

print(ac.suggest("bat"))
# ['bat', 'batch', 'bath']

print(ac.suggest("xyz"))
# []

print(ac.suggest("app", 2))
# ['app', 'apple']
`,
    },
    {
      id: "tries-segment-tree",
      slug: "segment-trees",
      title: "Segment Trees",
      content: `## Segment Trees

A segment tree is a binary tree structure that allows efficient range queries and point updates on an array. It answers questions like "what is the sum (or min, or max) of elements from index l to r?" in O(log n) time, while also supporting updates in O(log n).

### The Problem

Given an array, we need to:
1. **Query**: Find the sum of elements in range [l, r].
2. **Update**: Change the value at index i.

| Approach | Query | Update |
|----------|-------|--------|
| Brute force | O(n) | O(1) |
| Prefix sum | O(1) | O(n) |
| **Segment tree** | **O(log n)** | **O(log n)** |

Segment trees provide the best balance when both operations are frequent.

### How It Works

The segment tree is a complete binary tree stored in an array. For an input array of size n:
- **Leaf nodes** store individual array elements.
- **Internal nodes** store the aggregate (sum, min, max) of their children's ranges.
- **Root** stores the aggregate of the entire array.

For a sum segment tree on \`[1, 3, 5, 7, 9, 11]\`:
\`\`\`
              36 [0-5]
           /          \\
       9 [0-2]      27 [3-5]
       /    \\       /     \\
   4 [0-1]  5[2] 16[3-4]  11[5]
   / \\           / \\
  1   3         7   9
\`\`\`

### Building the Tree

Build bottom-up: fill leaves with array values, then compute each internal node as the sum of its children. The tree array needs 4*n space to safely hold all nodes.

### Range Query

To query [l, r], start at the root and recursively:
- If current range is completely inside [l, r], return this node's value.
- If current range is completely outside [l, r], return 0 (identity for sum).
- Otherwise, split and query both children, combining results.

### Point Update

To update index i, walk from root to the leaf at index i, updating each node along the path. Each internal node recalculates as the sum of its children.

### Applications

- **Range sum / min / max queries** with updates.
- **Count of elements in a range** satisfying a condition.
- **Lazy propagation** for range updates (advanced).

### Interview Tips

- Segment trees are less common in interviews than BFS/DFS, but they appear at Google and competitive programming-heavy companies.
- If you see "range query + update," segment tree (or Fenwick tree) is the right tool.
- The 1-indexed array representation simplifies the math: children of node i are 2i and 2i+1.

Implement a segment tree supporting range sum queries and point updates.`,
      starterCode: `class SegmentTree:
    """
    Segment Tree for range sum queries and point updates.

    Build: O(n)
    Query: O(log n)
    Update: O(log n)
    Space: O(n)
    """

    def __init__(self, nums: list[int]):
        """Build the segment tree from the input array."""
        # TODO: Store array length
        # TODO: Allocate tree array of size 4 * n
        # TODO: Call recursive build function
        pass

    def _build(self, node: int, start: int, end: int) -> None:
        """Recursively build the tree."""
        # TODO: If leaf (start == end), store nums[start]
        # TODO: Otherwise, build left and right children
        # TODO: Set current node = left child + right child
        pass

    def update(self, index: int, value: int) -> None:
        """Update nums[index] to value."""
        # TODO: Call recursive update starting from root
        pass

    def _update(self, node: int, start: int, end: int, index: int, value: int) -> None:
        """Recursively update the tree."""
        # TODO: If leaf, update value
        # TODO: Otherwise, recurse into the correct child
        # TODO: Recalculate current node from children
        pass

    def query(self, left: int, right: int) -> int:
        """Return sum of elements in range [left, right] inclusive."""
        # TODO: Call recursive query starting from root
        pass

    def _query(self, node: int, start: int, end: int, left: int, right: int) -> int:
        """Recursively query the range sum."""
        # TODO: If completely outside range, return 0
        # TODO: If completely inside range, return node value
        # TODO: Otherwise, split and combine children
        pass


# Test cases
nums = [1, 3, 5, 7, 9, 11]
st = SegmentTree(nums)

print(st.query(0, 5))   # 36  (sum of entire array)
print(st.query(1, 3))   # 15  (3 + 5 + 7)
print(st.query(2, 4))   # 21  (5 + 7 + 9)

st.update(3, 10)         # Change 7 -> 10
print(st.query(1, 3))   # 18  (3 + 5 + 10)
print(st.query(0, 5))   # 39  (1 + 3 + 5 + 10 + 9 + 11)

st.update(0, 5)          # Change 1 -> 5
print(st.query(0, 2))   # 13  (5 + 3 + 5)
`,
      solutionCode: `class SegmentTree:
    """
    Segment Tree for range sum queries and point updates.

    Build: O(n)
    Query: O(log n)
    Update: O(log n)
    Space: O(n)
    """

    def __init__(self, nums: list[int]):
        """Build the segment tree from the input array."""
        self.n = len(nums)
        self.nums = nums
        self.tree = [0] * (4 * self.n)
        if self.n > 0:
            self._build(1, 0, self.n - 1)

    def _build(self, node: int, start: int, end: int) -> None:
        """Recursively build the tree."""
        if start == end:
            self.tree[node] = self.nums[start]
            return
        mid = (start + end) // 2
        self._build(2 * node, start, mid)
        self._build(2 * node + 1, mid + 1, end)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]

    def update(self, index: int, value: int) -> None:
        """Update nums[index] to value."""
        self._update(1, 0, self.n - 1, index, value)

    def _update(self, node: int, start: int, end: int, index: int, value: int) -> None:
        """Recursively update the tree."""
        if start == end:
            self.tree[node] = value
            return
        mid = (start + end) // 2
        if index <= mid:
            self._update(2 * node, start, mid, index, value)
        else:
            self._update(2 * node + 1, mid + 1, end, index, value)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]

    def query(self, left: int, right: int) -> int:
        """Return sum of elements in range [left, right] inclusive."""
        return self._query(1, 0, self.n - 1, left, right)

    def _query(self, node: int, start: int, end: int, left: int, right: int) -> int:
        """Recursively query the range sum."""
        if right < start or end < left:
            return 0  # Completely outside
        if left <= start and end <= right:
            return self.tree[node]  # Completely inside
        mid = (start + end) // 2
        left_sum = self._query(2 * node, start, mid, left, right)
        right_sum = self._query(2 * node + 1, mid + 1, end, left, right)
        return left_sum + right_sum


# Test cases
nums = [1, 3, 5, 7, 9, 11]
st = SegmentTree(nums)

print(st.query(0, 5))   # 36  (sum of entire array)
print(st.query(1, 3))   # 15  (3 + 5 + 7)
print(st.query(2, 4))   # 21  (5 + 7 + 9)

st.update(3, 10)         # Change 7 -> 10
print(st.query(1, 3))   # 18  (3 + 5 + 10)
print(st.query(0, 5))   # 39  (1 + 3 + 5 + 10 + 9 + 11)

st.update(0, 5)          # Change 1 -> 5
print(st.query(0, 2))   # 13  (5 + 3 + 5)
`,
    },
    {
      id: "tries-fenwick",
      slug: "fenwick-trees",
      title: "Fenwick Trees (Binary Indexed Trees)",
      content: `## Fenwick Trees (Binary Indexed Trees)

A Fenwick Tree (also called a Binary Indexed Tree or BIT) solves the same problem as a segment tree — range sum queries with point updates — but with a much simpler implementation. It uses a clever bit manipulation trick to achieve O(log n) for both operations.

### Why Fenwick Trees?

Segment trees work great but require a lot of code. Fenwick trees achieve the same O(log n) complexity for prefix sums and updates with about half the code and half the memory. The trade-off: Fenwick trees only naturally support **prefix** queries (sum from index 0 to i), though range queries can be derived from two prefix queries.

### The Key Insight

The Fenwick tree stores partial sums. Each index i is responsible for a range of elements determined by the **lowest set bit** of i. This bit trick is computed as \`i & (-i)\` (also written as \`i & ~(i - 1)\`).

For index i in binary:
- \`i & (-i)\` gives the lowest set bit.
- Index i stores the sum of \`i & (-i)\` consecutive elements ending at i.

### How Update Works

To add a value at index i, update index i and all ancestors:
\`\`\`python
while i <= n:
    tree[i] += delta
    i += i & (-i)  # Move to parent
\`\`\`

### How Query Works

To get the prefix sum from 1 to i, accumulate values going down:
\`\`\`python
total = 0
while i > 0:
    total += tree[i]
    i -= i & (-i)  # Move to predecessor
\`\`\`

### Range Query

To get the sum from l to r:
\`\`\`
sum(l, r) = prefix(r) - prefix(l - 1)
\`\`\`

### Fenwick vs. Segment Tree

| Feature | Fenwick Tree | Segment Tree |
|---------|-------------|-------------|
| Code complexity | Very simple | Moderate |
| Space | O(n) | O(4n) |
| Point update | O(log n) | O(log n) |
| Prefix query | O(log n) | O(log n) |
| Range update | Possible with tricks | Native with lazy propagation |
| Min/Max queries | Not naturally supported | Supported |
| Constants | Smaller | Larger |

### Important: 1-Indexed

Fenwick trees are conventionally **1-indexed** because the bit trick \`i & (-i)\` doesn't work at index 0. The tree array has size n+1, with index 0 unused.

### Applications

- **Prefix sum queries** with frequent updates.
- **Counting inversions** in an array.
- **Range frequency queries** (how many elements in [l, r] are less than k).
- **Competitive programming** — preferred over segment trees when applicable due to simpler code.

Implement a Fenwick Tree with update and prefix sum query.`,
      starterCode: `class FenwickTree:
    """
    Binary Indexed Tree (Fenwick Tree) for prefix sum queries
    and point updates. Uses 1-based indexing internally.

    Build: O(n log n)
    Update: O(log n)
    Query: O(log n)
    Space: O(n)
    """

    def __init__(self, nums: list[int]):
        """Build a Fenwick tree from the input array (0-indexed)."""
        # TODO: Store length
        # TODO: Create tree array of size n+1 (1-indexed), filled with 0
        # TODO: Insert each element using update
        pass

    def update(self, index: int, delta: int) -> None:
        """
        Add delta to element at index (0-indexed input).
        Time: O(log n)
        """
        # TODO: Convert to 1-indexed
        # TODO: While index <= n:
        #   - Add delta to tree[index]
        #   - Move to parent: index += index & (-index)
        pass

    def _prefix_sum(self, index: int) -> int:
        """
        Return sum of elements from index 0 to index (0-indexed input).
        Time: O(log n)
        """
        # TODO: Convert to 1-indexed
        # TODO: Accumulate while index > 0:
        #   - Add tree[index] to total
        #   - Move to predecessor: index -= index & (-index)
        pass

    def range_sum(self, left: int, right: int) -> int:
        """
        Return sum of elements in range [left, right] (0-indexed, inclusive).
        Time: O(log n)
        """
        # TODO: Use prefix sums: prefix(right) - prefix(left - 1)
        pass


# Test cases
nums = [1, 3, 5, 7, 9, 11]
ft = FenwickTree(nums)

print(ft._prefix_sum(5))     # 36  (sum of all elements)
print(ft.range_sum(1, 3))    # 15  (3 + 5 + 7)
print(ft.range_sum(2, 4))    # 21  (5 + 7 + 9)

ft.update(3, 3)               # Add 3 to index 3: 7 -> 10
print(ft.range_sum(1, 3))    # 18  (3 + 5 + 10)
print(ft._prefix_sum(5))     # 39  (total is now 39)

ft.update(0, 4)               # Add 4 to index 0: 1 -> 5
print(ft.range_sum(0, 2))    # 13  (5 + 3 + 5)
`,
      solutionCode: `class FenwickTree:
    """
    Binary Indexed Tree (Fenwick Tree) for prefix sum queries
    and point updates. Uses 1-based indexing internally.

    Build: O(n log n)
    Update: O(log n)
    Query: O(log n)
    Space: O(n)
    """

    def __init__(self, nums: list[int]):
        """Build a Fenwick tree from the input array (0-indexed)."""
        self.n = len(nums)
        self.tree = [0] * (self.n + 1)  # 1-indexed
        # Build by inserting each element
        for i, val in enumerate(nums):
            self.update(i, val)

    def update(self, index: int, delta: int) -> None:
        """
        Add delta to element at index (0-indexed input).
        Time: O(log n)
        """
        index += 1  # Convert to 1-indexed
        while index <= self.n:
            self.tree[index] += delta
            index += index & (-index)  # Move to parent

    def _prefix_sum(self, index: int) -> int:
        """
        Return sum of elements from index 0 to index (0-indexed input).
        Time: O(log n)
        """
        index += 1  # Convert to 1-indexed
        total = 0
        while index > 0:
            total += self.tree[index]
            index -= index & (-index)  # Move to predecessor
        return total

    def range_sum(self, left: int, right: int) -> int:
        """
        Return sum of elements in range [left, right] (0-indexed, inclusive).
        Time: O(log n)
        """
        right_sum = self._prefix_sum(right)
        left_sum = self._prefix_sum(left - 1) if left > 0 else 0
        return right_sum - left_sum


# Test cases
nums = [1, 3, 5, 7, 9, 11]
ft = FenwickTree(nums)

print(ft._prefix_sum(5))     # 36  (sum of all elements)
print(ft.range_sum(1, 3))    # 15  (3 + 5 + 7)
print(ft.range_sum(2, 4))    # 21  (5 + 7 + 9)

ft.update(3, 3)               # Add 3 to index 3: 7 -> 10
print(ft.range_sum(1, 3))    # 18  (3 + 5 + 10)
print(ft._prefix_sum(5))     # 39  (total is now 39)

ft.update(0, 4)               # Add 4 to index 0: 1 -> 5
print(ft.range_sum(0, 2))    # 13  (5 + 3 + 5)
`,
    },
    {
      id: "tries-summary",
      slug: "when-to-use-which-ds",
      title: "When to Use Which Data Structure",
      content: `## When to Use Which Data Structure

After studying arrays, hash tables, linked lists, stacks, queues, trees, heaps, graphs, tries, segment trees, and Fenwick trees, the biggest interview skill is knowing **which structure to reach for** when you see a new problem. This lesson gives you a decision framework.

### The Decision Tree

**Step 1: What operation dominates?**

- **Fast lookup by key** -> Hash Table (dict/set)
- **Fast lookup by index** -> Array
- **Sorted order needed** -> BST or sorted array
- **FIFO processing** -> Queue
- **LIFO / undo / matching** -> Stack
- **Priority-based processing** -> Heap
- **Prefix matching** -> Trie
- **Range queries with updates** -> Segment Tree or Fenwick Tree
- **Relationships between entities** -> Graph
- **Dynamic grouping / merging** -> Union-Find

### Quick Reference Table

| Problem Pattern | Best Structure | Time |
|----------------|---------------|------|
| Two Sum / frequency count | Hash Map | O(n) |
| Top K elements | Heap | O(n log k) |
| Valid parentheses / nesting | Stack | O(n) |
| BFS shortest path | Queue + Graph | O(V+E) |
| LRU Cache | Hash Map + Doubly Linked List | O(1) |
| Prefix search / autocomplete | Trie | O(m) |
| Range sum with updates | Segment Tree / Fenwick | O(log n) |
| Detect cycle | DFS (Graph) or Union-Find | O(V+E) |
| Shortest path (weighted) | Heap + Graph (Dijkstra) | O((V+E)log V) |
| Merge intervals | Sort + Array | O(n log n) |
| Sliding window max | Deque (monotonic) | O(n) |
| Connected components | Union-Find or DFS | O(V+E) |
| Level-order traversal | Queue + Tree | O(n) |
| Kth smallest in BST | BST in-order | O(H + k) |

### Common Combinations

Many interview problems require combining two structures:

1. **Hash Map + Heap**: "Top K frequent elements" — count with hash map, extract with heap.
2. **Hash Map + Doubly Linked List**: LRU cache — O(1) lookup and O(1) eviction.
3. **Trie + DFS**: Word search on a grid — trie prunes the search space.
4. **Graph + Heap**: Dijkstra's algorithm — heap selects the next closest vertex.
5. **Stack + Hash Map**: Next greater element — stack for monotonic order, hash map for results.
6. **Union-Find + Sorting**: Kruskal's MST — sort edges, union-find for cycle detection.

### Red Flags in Problem Statements

| Phrase | Think |
|--------|-------|
| "Find if exists" | Hash Set |
| "Find all pairs" | Hash Map or Two Pointers |
| "Shortest path" | BFS or Dijkstra |
| "All permutations / combinations" | DFS Backtracking |
| "Maximum / minimum in range" | Segment Tree or Monotonic Deque |
| "Starting with prefix" | Trie |
| "Connected / grouped" | Union-Find or DFS |
| "Schedule / order tasks" | Topological Sort (Graph) |
| "Sliding window" | Deque or Two Pointers |
| "Kth largest/smallest" | Heap |

### Space-Time Trade-off Summary

| Structure | Lookup | Insert | Delete | Space | Notes |
|-----------|--------|--------|--------|-------|-------|
| Array | O(1) idx, O(n) val | O(n) | O(n) | O(n) | Best cache performance |
| Hash Table | O(1) avg | O(1) avg | O(1) avg | O(n) | Unordered |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(n) | Ordered |
| Heap | O(1) top | O(log n) | O(log n) | O(n) | Only top element fast |
| Trie | O(m) | O(m) | O(m) | O(N*M) | m = key length |
| Segment Tree | O(log n) | O(log n) | - | O(n) | Range queries |
| Union-Find | O(a(n)) | O(a(n)) | - | O(n) | Nearly O(1) |

### Final Interview Strategy

1. **Read the problem carefully** — identify the core operations needed.
2. **Consider constraints** — n up to 10^5 needs O(n log n) or better. n up to 10^7 needs O(n).
3. **Match patterns** — use the tables above to narrow down candidates.
4. **Verify** — mentally trace through examples with your chosen structure.
5. **Optimize** — can you combine structures for better performance?

Mastering this selection process is what separates candidates who solve problems quickly from those who struggle with the approach. Practice identifying the right structure before jumping into code.`,
    },
  ],
};
