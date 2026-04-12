import { Module } from "../types";

export const trieModule: Module = {
  id: "trie",
  title: "Trie (Prefix Tree)",
  description: "Master the Trie data structure for efficient string storage and retrieval. Learn to solve word search, autocomplete, and prefix-matching problems with optimal time complexity.",
  lessons: [
    {
      id: "trie-intro",
      slug: "trie-intro",
      title: "Introduction to Trie",
      content: `## The Trie (Prefix Tree) Pattern

A **Trie** (pronounced "try"), also known as a prefix tree, is a tree-like data structure used to store a dynamic set of strings. Unlike a hash table, no node stores the key associated with it — a node's *position in the tree* defines the prefix it represents.

<!-- voice:section_check concept="Trie basic concept" -->

\`\`\`concept
{ "title": "The Trie Mental Model", "variant": "mental-model", "content": "Think of a Trie as an autocomplete index. Each edge is a character. The path from the root to any node spells a prefix. The path to a marked node spells a complete word.\\n\\nInserting 'cat', 'car', and 'card' into a Trie creates a single shared path 'c → a', then branches: one branch ends at 't' (cat), the other continues 'r' (car) and then optionally 'd' (card). Every character is visited exactly once per operation — O(L) regardless of how many words are stored." }
\`\`\`

### Why Trie Over a Hash Table?

| Operation | Hash Table | Trie |
|-----------|------------|------|
| Insert | O(L) | O(L) |
| Search (exact) | O(L) avg | O(L) |
| **Prefix search** | **O(n × L)** | **O(L)** |
| Space | O(n × L) | O(n × L) — but shared prefixes reduce constant |

*L = length of string, n = number of strings stored*

The decisive advantage is **prefix search**: a hash table must scan every stored word to find matches for a prefix, while a Trie reaches the prefix node in O(L) and all continuations live in its subtree.

<!-- voice:key_insight insight="Trie shares common prefixes — 'cat' and 'car' share the 'ca' path, saving space and enabling efficient prefix operations" -->

---

### Trie Node Structure

Each node stores two things: a map of children (character → child node) and a flag marking whether this node is the **end of a complete word**.

\`\`\`playground
{ "title": "TrieNode — the building block", "language": "python", "code": "class TrieNode:\\n    def __init__(self):\\n        self.children = {}   # char -> TrieNode\\n        self.is_end = False  # True if a word ends here\\n\\nclass Trie:\\n    def __init__(self):\\n        self.root = TrieNode()\\n\\n# Visualise a freshly built trie\\ntrie = Trie()\\nprint(trie.root.children)   # {}\\nprint(trie.root.is_end)     # False", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Array vs Hash Map for children", "content": "When the alphabet is fixed and small (e.g. 26 lowercase letters), many implementations use \`children = [None] * 26\` with index \`ord(c) - ord('a')\`. This gives O(1) child lookup with no hash overhead, at the cost of 26 pointers per node. For larger or variable alphabets (Unicode, DNA), a \`dict\` is more memory-efficient." }
\`\`\`

---

### The Three Core Operations

\`\`\`tabs
{ "tabs": [
  { "label": "Insert", "icon": "➕", "content": "Walk the Trie character by character. If a child node for the current character does not exist, create one. After the last character, mark \`is_end = True\`.\\n\\n\`\`\`python\\ndef insert(self, word: str) -> None:\\n    node = self.root\\n    for char in word:\\n        if char not in node.children:\\n            node.children[char] = TrieNode()\\n        node = node.children[char]\\n    node.is_end = True\\n\`\`\`\\n\\n**Time:** O(L) — one node created or visited per character." },
  { "label": "Search", "icon": "🔍", "content": "Walk the Trie following each character. If any character is missing, return \`False\` immediately. After the last character, return whether the current node is marked as an end-of-word.\\n\\n\`\`\`python\\ndef search(self, word: str) -> bool:\\n    node = self.root\\n    for char in word:\\n        if char not in node.children:\\n            return False\\n        node = node.children[char]\\n    return node.is_end\\n\`\`\`\\n\\n**Key distinction:** \`search('app')\` returns \`False\` if only \`'apple'\` was inserted — the node exists but \`is_end\` is \`False\`." },
  { "label": "Starts With", "icon": "🔤", "content": "Same traversal as search, but we return \`True\` as soon as we've consumed the full prefix — we don't care whether it's a complete word.\\n\\n\`\`\`python\\ndef starts_with(self, prefix: str) -> bool:\\n    node = self.root\\n    for char in prefix:\\n        if char not in node.children:\\n            return False\\n        node = node.children[char]\\n    return True  # prefix path exists\\n\`\`\`\\n\\n**Use case:** Autocomplete — find the node for the user's typed prefix, then DFS/BFS from it to collect all completions." }
] }
\`\`\`

---

### Watching \`insert("apple")\` Step by Step

\`\`\`trace
{ "title": "Inserting 'apple' into an empty Trie", "language": "python", "code": "node = root\\nfor char in 'apple':\\n    if char not in node.children:\\n        node.children[char] = TrieNode()\\n    node = node.children[char]\\nnode.is_end = True", "frames": [
  { "line": 1, "vars": { "node": "root", "word": "'apple'" }, "note": "Start at root — root.children is empty" },
  { "line": 2, "vars": { "char": "'a'" }, "note": "First character: 'a' not in root.children" },
  { "line": 3, "vars": { "char": "'a'" }, "note": "Create new TrieNode for 'a', attach to root" },
  { "line": 4, "vars": { "node": "node['a']", "char": "'a'" }, "note": "Move to the 'a' node" },
  { "line": 2, "vars": { "char": "'p'" }, "note": "'p' not in node['a'].children" },
  { "line": 3, "vars": { "char": "'p'" }, "note": "Create 'p' node under 'a'" },
  { "line": 4, "vars": { "node": "node['p']", "char": "'p'" }, "note": "Move to 'p' node" },
  { "line": 2, "vars": { "char": "'p'" }, "note": "Second 'p' — same logic, new node" },
  { "line": 4, "vars": { "node": "node['p2']" }, "note": "Move to second 'p' node" },
  { "line": 2, "vars": { "char": "'l'" }, "note": "Create 'l' node" },
  { "line": 4, "vars": { "node": "node['l']" }, "note": "Move to 'l'" },
  { "line": 2, "vars": { "char": "'e'" }, "note": "Create 'e' node" },
  { "line": 4, "vars": { "node": "node['e']" }, "note": "Move to 'e' — end of word" },
  { "line": 6, "vars": { "node.is_end": "True" }, "note": "Mark is_end = True. Path root→a→p→p→l→e now represents 'apple'" }
], "speed": 900 }
\`\`\`

---

### Shared Prefix Visualisation: \`cat\`, \`car\`, \`card\`

\`\`\`algoviz
{ "title": "Trie storing 'cat', 'car', 'card'", "type": "tree", "data": ["root", "c", "a", "t*", "r*", "d*"],
  "frames": [
    { "highlight": [0], "label": "Root node — empty, no words yet", "stats": { "words": 0 } },
    { "highlight": [0, 1], "label": "Insert 'cat': create edge root→c", "stats": { "words": 0 } },
    { "highlight": [1, 2], "label": "Continue: c→a", "stats": { "words": 0 } },
    { "highlight": [2, 3], "label": "Continue: a→t, mark is_end=True ('cat' done)", "stats": { "words": 1 } },
    { "highlight": [2, 4], "label": "Insert 'car': 'c' and 'a' already exist — branch at 'a'→'r', mark is_end=True", "stats": { "words": 2 } },
    { "highlight": [4, 5], "label": "Insert 'card': 'c','a','r' already exist — extend 'r'→'d', mark is_end=True", "stats": { "words": 3 } },
    { "highlight": [1, 2], "label": "All three words share the 'c→a' path. Prefix search 'ca' costs O(2), not O(n).", "stats": { "shared_edges": 2, "total_edges": 5 } }
  ], "speed": 1000 }
\`\`\`

\`\`\`callout
{ "type": "success", "title": "Prefix sharing in action", "content": "Storing \`'cat'\`, \`'car'\`, and \`'card'\` creates **5 nodes total** — not 3 + 3 + 4 = 10. The shared \`c→a\` path is allocated once. The longer the common prefix set (e.g. a dictionary of English words), the greater the savings." }
\`\`\`

---

### When to Reach for a Trie

- **Word search in a 2D grid** (LeetCode 212 — Word Search II): insert all target words, DFS the grid, prune branches the moment the Trie path ends.
- **Autocomplete / type-ahead**: walk to the prefix node, then collect all \`is_end\` nodes in its subtree.
- **Spell checking**: if the word node is missing or \`is_end=False\`, suggest completions from the last valid prefix node.
- **IP routing (longest prefix match)**: traverse the Trie bit by bit, always tracking the deepest matching route.
- **Word frequency counting**: add a \`count\` field to each node; increment on every \`insert\` traversal.

---

### Complexity Reference

| | Time | Space |
|---|---|---|
| \`insert(word)\` | O(L) | O(L) new nodes in worst case |
| \`search(word)\` | O(L) | O(1) |
| \`starts_with(prefix)\` | O(L) | O(1) |
| Build trie (n words) | O(n × L) | O(n × L) worst case |

*L = length of word/prefix. Shared prefixes reduce the space constant in practice.*

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [
  {
    "question": "A Trie contains only the word 'apple'. What does \`search('app')\` return?",
    "options": ["True, because 'app' is a prefix of 'apple'", "False, because no word 'app' was inserted", "True, because the nodes for 'a','p','p' exist", "It raises a KeyError"],
    "answer": 1,
    "explanation": "\`search\` checks both that the traversal completes AND that \`is_end\` is True on the final node. The nodes for 'a','p','p' exist, but the 'p' node after the second 'p' has \`is_end = False\`. Use \`starts_with('app')\` if you only need prefix existence."
  },
  {
    "question": "You store 10,000 words all starting with 'inter' (interview, international, interpret…). How many nodes represent the shared prefix 'inter'?",
    "options": ["5 nodes (one per character, shared)", "50,000 nodes (5 per word)", "10,000 nodes (one per word)", "1 node storing the string 'inter'"],
    "answer": 0,
    "explanation": "A Trie stores one node per character along a shared path. All 10,000 words share the same 5 nodes for 'i→n→t→e→r'. This is the key space-saving property of prefix sharing."
  },
  {
    "question": "What is the time complexity of finding ALL words in a Trie that start with prefix P (length k), if there are m such words with average length L?",
    "options": ["O(k) — just reach the prefix node", "O(k + m × L) — reach prefix node then traverse the subtree", "O(n × L) — must scan all n stored words", "O(m) — just count matching words"],
    "answer": 1,
    "explanation": "Reaching the prefix node costs O(k). Collecting all m matching words requires traversing their subtree paths, each of length up to L, giving O(k + m × L) total. This is far better than the O(n × L) required when scanning all stored words with a hash table."
  },
  {
    "question": "Why does \`starts_with\` return True while \`search\` returns False for the same string, given the same Trie?",
    "options": ["\`starts_with\` uses a different traversal path", "\`search\` requires \`is_end = True\` on the last node; \`starts_with\` only requires the path exists", "\`starts_with\` is always True for non-empty strings", "\`search\` checks children; \`starts_with\` checks parents"],
    "answer": 1,
    "explanation": "Both operations traverse the Trie identically character by character. The only difference is the final check: \`search\` returns \`node.is_end\` (was a complete word inserted here?), while \`starts_with\` simply returns \`True\` — the path exists, so some word uses this prefix."
  }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "A Trie stores strings character by character; each node's position in the tree encodes a prefix — not the node's value.",
  "Prefix search is O(L) — Trie's decisive advantage over hash tables (O(n × L) for the same operation).",
  "Nodes store two things: a children map (char → TrieNode) and an is_end flag marking complete words.",
  "All three core operations — insert, search, starts_with — share the same O(L) traversal skeleton; they differ only in their final step.",
  "Common interview applications: Word Search II (grid DFS + Trie pruning), autocomplete, spell checking, and IP longest-prefix matching."
] }
\`\`\``,
    },
    {
      id: "implement-trie",
      slug: "implement-trie",
      title: "Implement Trie (Prefix Tree)",
      content: `## Implement Trie (Prefix Tree)

<!-- voice:section_check concept="Basic Trie implementation" -->

A **Trie** (pronounced "try") is a tree-based data structure where each path from root to a marked node spells out a stored word. Unlike a hash set, a Trie shares common prefixes — "apple" and "app" overlap for three nodes — making prefix queries O(L) instead of O(n · L).

\`\`\`concept
{ "title": "The Trie Mental Model", "variant": "mental-model", "content": "Think of a Trie as an autocomplete index baked into a tree. Every character you type narrows you down one edge. Reaching a node flagged is_end=True means a complete word lives here. Stopping early (is_end=False) means you've matched a prefix, not a full word. The root represents the empty string — every word starts there." }
\`\`\`

---

### Problem Statement

Implement the \`Trie\` class with three operations:

| Method | Signature | Returns |
|--------|-----------|---------|
| Constructor | \`Trie()\` | initializes the trie |
| Insert | \`insert(word: str) → None\` | stores \`word\` |
| Search | \`search(word: str) → bool\` | \`True\` if the exact word was inserted |
| Prefix check | \`startsWith(prefix: str) → bool\` | \`True\` if any stored word begins with \`prefix\` |

**Example walkthrough:**

\`\`\`
Operations:  insert("apple") → search("apple") → search("app") → startsWith("app") → insert("app") → search("app")
Outputs:     —               → True            → False          → True              → —              → True
\`\`\`

---

### Building the Structure

\`\`\`steps
{ "title": "Trie Construction: Three Steps", "steps": [ { "title": "1. Define the TrieNode", "content": "Each node holds two things:\\n- \`children\`: a dictionary mapping characters to child TrieNodes\\n- \`is_end\`: a boolean flag — \`True\` when this node is the last character of an inserted word\\n\\nThe root node is an empty TrieNode that represents the start of every word." }, { "title": "2. Insert a Word", "content": "Walk character by character from the root:\\n- If the child for the current character doesn't exist, **create it**.\\n- Move into that child.\\n- After the last character, **set \`is_end = True\`**.\\n\\nInserting \\"app\\" after \\"apple\\" only creates one new node (the 'p' node already exists from the 'apple' path)." }, { "title": "3. Search vs. startsWith", "content": "Both traverse the trie the same way — character by character from the root.\\n\\nThe **only difference** is what you check after the loop:\\n- \`search\`: return \`node.is_end\` — the word must end exactly here.\\n- \`startsWith\`: return \`True\` unconditionally — reaching the end of the prefix is enough.\\n\\nIf any character is missing from the tree, both return \`False\` immediately." } ] }
\`\`\`

---

### Algorithm Visualization

Watch how \`insert("apple")\`, \`insert("app")\`, \`search("app")\`, and \`startsWith("ap")\` execute on the same trie:

\`\`\`algoviz
{ "title": "Trie Operations on 'apple' and 'app'", "type": "tree", "data": ["root", "a", "p", "p", "l", "e"], "frames": [ { "highlight": [0], "label": "Start at root. Insert 'apple' — process 'a'", "stats": {"op": "insert", "word": "apple", "char": "a"} }, { "highlight": [1], "label": "Create node 'a', move down", "stats": {"op": "insert", "word": "apple", "char": "p"} }, { "highlight": [2], "label": "Create node 'p', move down", "stats": {"op": "insert", "word": "apple", "char": "p"} }, { "highlight": [3], "label": "Create node 'p', move down", "stats": {"op": "insert", "word": "apple", "char": "l"} }, { "highlight": [4], "label": "Create node 'l', move down", "stats": {"op": "insert", "word": "apple", "char": "e"} }, { "highlight": [5], "label": "Create node 'e', mark is_end=True. 'apple' inserted.", "stats": {"op": "insert", "word": "apple", "is_end": "True"} }, { "highlight": [0], "label": "Insert 'app' — start at root, traverse 'a'→'p'→'p'", "stats": {"op": "insert", "word": "app", "char": "a"} }, { "highlight": [3], "label": "All 3 nodes exist — just mark this 'p' node is_end=True. 'app' inserted.", "stats": {"op": "insert", "word": "app", "is_end": "True"} }, { "highlight": [0], "label": "search('app'): traverse a→p→p", "stats": {"op": "search", "word": "app"} }, { "highlight": [3], "label": "Reached end of 'app'. is_end=True → return True", "stats": {"op": "search", "result": "True"} }, { "highlight": [0], "label": "startsWith('ap'): traverse a→p", "stats": {"op": "startsWith", "prefix": "ap"} }, { "highlight": [2], "label": "Prefix 'ap' fully traversed. Return True (no is_end check).", "stats": {"op": "startsWith", "result": "True"} } ], "speed": 900 }
\`\`\`

---

### Implementation

\`\`\`tabs
{ "tabs": [ { "label": "Python", "icon": "🐍", "content": "\`\`\`python\\nclass TrieNode:\\n    def __init__(self):\\n        self.children = {}\\n        self.is_end = False\\n\\nclass Trie:\\n    def __init__(self):\\n        self.root = TrieNode()\\n\\n    def insert(self, word: str) -> None:\\n        node = self.root\\n        for char in word:\\n            if char not in node.children:\\n                node.children[char] = TrieNode()\\n            node = node.children[char]\\n        node.is_end = True\\n\\n    def search(self, word: str) -> bool:\\n        node = self.root\\n        for char in word:\\n            if char not in node.children:\\n                return False\\n            node = node.children[char]\\n        return node.is_end  # must land on a word boundary\\n\\n    def startsWith(self, prefix: str) -> bool:\\n        node = self.root\\n        for char in prefix:\\n            if char not in node.children:\\n                return False\\n            node = node.children[char]\\n        return True  # prefix matched — no is_end check\\n\`\`\`" }, { "label": "JavaScript", "icon": "🟨", "content": "\`\`\`javascript\\nclass TrieNode {\\n    constructor() {\\n        this.children = new Map();\\n        this.end = false;\\n    }\\n}\\n\\nclass Trie {\\n    constructor() {\\n        this.root = new TrieNode();\\n    }\\n\\n    insert(word) {\\n        let node = this.root;\\n        for (const char of word) {\\n            if (!node.children.has(char)) {\\n                node.children.set(char, new TrieNode());\\n            }\\n            node = node.children.get(char);\\n        }\\n        node.end = true;\\n    }\\n\\n    search(word) {\\n        let node = this.root;\\n        for (const char of word) {\\n            if (!node.children.has(char)) return false;\\n            node = node.children.get(char);\\n        }\\n        return node.end;\\n    }\\n\\n    startsWith(prefix) {\\n        let node = this.root;\\n        for (const char of prefix) {\\n            if (!node.children.has(char)) return false;\\n            node = node.children.get(char);\\n        }\\n        return true;\\n    }\\n}\\n\`\`\`" }, { "label": "Array (fixed alphabet)", "icon": "📦", "content": "Instead of a HashMap, each node can hold a fixed-size array of 26 slots (one per lowercase letter). This trades flexibility for speed and is common in competitive programming:\\n\\n\`\`\`python\\nclass TrieNode:\\n    def __init__(self):\\n        self.children = [None] * 26\\n        self.is_end = False\\n\\nclass Trie:\\n    def __init__(self):\\n        self.root = TrieNode()\\n\\n    def _index(self, char):\\n        return ord(char) - ord('a')\\n\\n    def insert(self, word):\\n        node = self.root\\n        for char in word:\\n            idx = self._index(char)\\n            if not node.children[idx]:\\n                node.children[idx] = TrieNode()\\n            node = node.children[idx]\\n        node.is_end = True\\n\\n    def search(self, word):\\n        node = self.root\\n        for char in word:\\n            idx = self._index(char)\\n            if not node.children[idx]:\\n                return False\\n            node = node.children[idx]\\n        return node.is_end\\n\\n    def startsWith(self, prefix):\\n        node = self.root\\n        for char in prefix:\\n            idx = self._index(char)\\n            if not node.children[idx]:\\n                return False\\n            node = node.children[idx]\\n        return True\\n\`\`\`\\n\\n**Trade-off:** fixed array wastes memory for sparse alphabets but avoids hash collisions." } ] }
\`\`\`

<!-- voice:key_insight insight="The only difference between search and startsWith is that search verifies we ended exactly at a word boundary (is_end=True)" -->

\`\`\`concept
{ "title": "search vs. startsWith — One Line Apart", "variant": "rule", "content": "Both methods share 100% of their traversal logic. The single distinguishing line:\\n\\n• search: \`return node.is_end\`\\n• startsWith: \`return True\`\\n\\nSearch requires you to have landed on a complete word. startsWith only requires you to have followed the full prefix path without falling off the tree. Internalise this and you'll never confuse them under pressure." }
\`\`\`

---

### Trace: search("app") vs startsWith("app") After Only Inserting "apple"

\`\`\`trace
{ "title": "Why search('app') returns False but startsWith('app') returns True", "language": "python", "code": "trie = Trie()\\ntrie.insert('apple')\\n\\n# search('app')\\nnode = trie.root\\nfor char in 'app':\\n    node = node.children[char]\\nresult = node.is_end  # False — 'app' node exists but is_end=False\\n\\n# startsWith('app')\\nnode = trie.root\\nfor char in 'app':\\n    node = node.children[char]\\nresult = True  # prefix found — return unconditionally", "frames": [ { "line": 1, "vars": {"trie": "Trie(root=TrieNode)"}, "note": "Trie initialised with empty root node." }, { "line": 2, "vars": {"trie": "Trie"}, "note": "insert('apple') creates nodes: root→a→p→p→l→e, marks 'e'.is_end=True" }, { "line": 5, "vars": {"node": "root", "char": ""}, "note": "Begin search('app') — start at root" }, { "line": 6, "vars": {"node": "a-node", "char": "a"}, "note": "char='a': child exists, move to 'a' node" }, { "line": 6, "vars": {"node": "p-node(1)", "char": "p"}, "note": "char='p': child exists, move to first 'p' node" }, { "line": 6, "vars": {"node": "p-node(2)", "char": "p"}, "note": "char='p': child exists, move to second 'p' node" }, { "line": 7, "vars": {"result": "False"}, "note": "node.is_end=False — 'app' node exists but was never marked as end-of-word. Return False." }, { "line": 10, "vars": {"node": "root"}, "note": "Begin startsWith('app') — start at root" }, { "line": 11, "vars": {"node": "p-node(2)", "char": "p"}, "note": "Same traversal: a→p→p all succeed" }, { "line": 12, "vars": {"result": "True"}, "note": "Prefix path exists in the tree — return True unconditionally. is_end is irrelevant." } ], "speed": 900 }
\`\`\`

---

### Complexity

| Operation | Time | Space |
|-----------|------|-------|
| \`insert(word)\` | O(L) | O(L) — up to L new nodes |
| \`search(word)\` | O(L) | O(1) — read-only traversal |
| \`startsWith(prefix)\` | O(L) | O(1) — read-only traversal |

*L = length of the word or prefix.*

\`\`\`callout
{ "type": "info", "title": "Why Trie beats HashSet for prefix queries", "content": "A HashSet gives O(1) \`insert\`/\`search\`, but \`startsWith\` requires scanning every stored word — O(n · L) worst case. The Trie's shared-prefix structure makes \`startsWith\` O(L) regardless of how many words are stored. This is the core interview justification for choosing a Trie." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Corner Cases & Interview Gotchas", "content": "**1. Searching an empty trie**\\nBoth \`search\` and \`startsWith\` safely return \`False\` — the root's children dictionary is empty, so the first character lookup fails immediately.\\n\\n**2. Inserting an empty string**\\nThe for-loop never executes. \`root.is_end\` gets set to \`True\`. \`search('')\` would then return \`True\`. Decide (and state) whether to guard against this based on problem constraints.\\n\\n**3. One word is a prefix of another**\\nThis is the exact scenario the \`is_end\` flag handles. 'app' and 'apple' share three nodes; only the third 'p' node (for 'app') and the 'e' node (for 'apple') get \`is_end=True\`.\\n\\n**4. Dictionary vs. fixed array**\\n- \`dict\` / \`Map\`: handles any Unicode, O(1) average lookup, slightly higher overhead.\\n- \`[None] * 26\` array: O(1) guaranteed, but only lowercase ASCII; wastes 26 pointers per node even for sparse branches.\\n\\n**5. Preprocessing optimization**\\nIf you receive a list of n words and need repeated O(k) lookups, inserting all words into a Trie first converts each future \`search\` from O(n · L) (linear scan) to O(k). State this explicitly when justifying your design choice to an interviewer." }
\`\`\`

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "After inserting only the word 'cat', what does search('ca') return?", "options": ["True — 'ca' is a prefix of 'cat'", "True — partial matches count", "False — 'ca' was never inserted as a complete word", "It raises a KeyError"], "answer": 2, "explanation": "search() requires the traversal to end on a node with is_end=True. The 'a' node exists but has is_end=False since 'ca' was never explicitly inserted. startsWith('ca') would return True." }, { "question": "What is the time complexity of startsWith(prefix) in a Trie?", "options": ["O(n) where n is the number of stored words", "O(n · L) where L is average word length", "O(L) where L is the length of the prefix", "O(1) using hashing"], "answer": 2, "explanation": "startsWith traverses exactly L edges — one per character in the prefix — regardless of how many words are stored. This is the key advantage over a HashSet." }, { "question": "You insert 'apple', then insert 'app'. How many total TrieNode objects exist (including root)?", "options": ["11 — one per character across both words", "6 — root + a + p + p + l + e", "7 — root + a + p + p(marked end) + p + l + e", "2 — one node per word"], "answer": 1, "explanation": "Both words share the path root→a→p→p. 'apple' adds l and e on top. That gives root(1) + a(1) + p(1) + p(1, now is_end=True for 'app') + l(1) + e(1) = 6 nodes total. No new nodes are created for 'app' since its path already exists." }, { "question": "Which single line separates the search() and startsWith() implementations?", "options": ["The for-loop condition", "The return statement after the loop — search returns node.is_end, startsWith returns True", "The initial node assignment", "startsWith checks len(prefix) > 0 first"], "answer": 1, "explanation": "Both methods share identical traversal logic. The sole difference is the final return: search() returns node.is_end to verify a complete word, while startsWith() returns True unconditionally because reaching the end of the prefix path is sufficient." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "A TrieNode needs only two fields: children (dict or fixed array) and is_end (bool).", "insert, search, and startsWith all run in O(L) time where L is the string length.", "search and startsWith share identical traversal — the only difference is whether you check is_end after the loop.", "Tries beat HashSets specifically on prefix queries: O(L) vs O(n·L).", "The is_end flag is what makes one word a complete word even when it is a prefix of another stored word." ] }
\`\`\``,
      starterCode: `class TrieNode:
    """Node in the Trie data structure."""
    def __init__(self):
        self.children = {}
        self.is_end = False


class Trie:
    """
    Implement a Trie with insert, search, and startsWith operations.
    
    Example:
        >>> trie = Trie()
        >>> trie.insert("apple")
        >>> trie.search("apple")
        True
        >>> trie.search("app")
        False
        >>> trie.startsWith("app")
        True
        >>> trie.insert("app")
        >>> trie.search("app")
        True
    """
    
    def __init__(self):
        # TODO: Initialize the Trie
        pass
    
    def insert(self, word):
        """Insert word into trie."""
        # TODO: Insert word character by character
        pass
    
    def search(self, word):
        """Return True if word is in trie."""
        # TODO: Search for complete word
        pass
    
    def startsWith(self, prefix):
        """Return True if any word starts with prefix."""
        # TODO: Check if prefix exists
        pass


# ─── Test Cases ───

trie = Trie()

# Insert and search
trie.insert("apple")
print(trie.search("apple"))    # Expected: True
print(trie.search("app"))      # Expected: False
print(trie.startsWith("app"))  # Expected: True

# Insert shorter word
trie.insert("app")
print(trie.search("app"))      # Expected: True

# Non-existent words
print(trie.search("apples"))   # Expected: False
print(trie.startsWith("xyz"))  # Expected: False

# Empty prefix
print(trie.startsWith(""))     # Expected: True
`,
      solutionCode: `class TrieNode:
    """Node in the Trie data structure."""
    def __init__(self):
        self.children = {}
        self.is_end = False


class Trie:
    """
    Implement a Trie with insert, search, and startsWith operations.
    
    Time Complexity:
        insert: O(L) where L is word length
        search: O(L)
        startsWith: O(L)
    Space Complexity:
        insert: O(L)
        search/startsWith: O(1)
    """
    
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        """Insert word into trie."""
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word):
        """Return True if word is in trie."""
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end
    
    def startsWith(self, prefix):
        """Return True if any word starts with prefix."""
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True


# Alternative with array for a-z (faster, less memory)
class TrieArray:
    """Trie implementation using array for 26 lowercase letters."""
    
    def __init__(self):
        self.root = [[None] * 26, False]  # [children, is_end]
    
    def _char_to_idx(self, char):
        return ord(char) - ord('a')
    
    def insert(self, word):
        node = self.root
        for char in word:
            idx = self._char_to_idx(char)
            if node[0][idx] is None:
                node[0][idx] = [[None] * 26, False]
            node = node[0][idx]
        node[1] = True
    
    def search(self, word):
        node = self.root
        for char in word:
            idx = self._char_to_idx(char)
            if node[0][idx] is None:
                return False
            node = node[0][idx]
        return node[1]
    
    def startsWith(self, prefix):
        node = self.root
        for char in prefix:
            idx = self._char_to_idx(char)
            if node[0][idx] is None:
                return False
            node = node[0][idx]
        return True


# ─── Test Cases ───
trie = Trie()

trie.insert("apple")
print(trie.search("apple"))    # Expected: True
print(trie.search("app"))      # Expected: False
print(trie.startsWith("app"))  # Expected: True

trie.insert("app")
print(trie.search("app"))      # Expected: True

print(trie.search("apples"))   # Expected: False
print(trie.startsWith("xyz"))  # Expected: False
print(trie.startsWith(""))     # Expected: True
`,
    },
    {
      id: "word-search-ii",
      slug: "word-search-ii",
      title: "Word Search II",
      content: `## Word Search II

Given an \`m × n\` board of characters and a list of strings \`words\`, return all words found on the board.

Each word must be built from **sequentially adjacent cells** (horizontal or vertical neighbors only). The same cell may not be used more than once within a single word.

\`\`\`callout
{ "type": "info", "title": "Pattern Fusion Problem", "content": "This is a deliberate combination of two patterns: **Trie** (prefix-indexed storage for all words at once) and **Backtracking DFS** (grid traversal). Neither pattern alone is sufficient at scale — the Trie makes the DFS efficient; the DFS makes the Trie actionable." }
\`\`\`

### Why the Brute Force Breaks Down

The obvious approach: run the Word Search I algorithm once per word.

- Per word: DFS from every cell, up to 4 directions, depth L → **O(m × n × 4^L)**
- For W words total: **O(W × m × n × 4^L)**
- With W = 10,000 words and a 12×12 board, this becomes billions of operations.

The wasted work: words sharing a prefix (like \`"oath"\` and \`"oat"\`) re-explore identical board paths repeatedly. We need a way to check all words simultaneously.

\`\`\`concept
{ "title": "The Shared-Prefix Insight", "variant": "mental-model", "content": "Build a Trie from all words first. Now each DFS path on the board corresponds to exactly one path in the Trie. Following the letter 'o' → 'a' → 't' on the board simultaneously advances progress toward every word beginning with 'oat'. The Trie prunes the DFS the instant no word can possibly match — you explore each prefix once, not once per word." }
\`\`\`

### Algorithm

\`\`\`steps
{
  "title": "Trie + Backtracking — Step by Step",
  "steps": [
    {
      "title": "Build the Trie from all words",
      "content": "Insert every word into a Trie. Each node stores its 26 children and a \`ref\` field: the word's index in the \`words\` array (or \`-1\` if no word ends at this node). Building costs **O(total characters across all words)**."
    },
    {
      "title": "Launch DFS from every board cell",
      "content": "For each cell \`(r, c)\`, start a DFS only if \`board[r][c]\` is a child of the Trie root — otherwise there's no word starting with that letter and we skip it entirely."
    },
    {
      "title": "Co-navigate the board and Trie together",
      "content": "At each step, move to a neighbor \`(nr, nc)\` only if \`board[nr][nc]\` exists as a child in the **current Trie node** — not just any adjacent cell. Mark the current cell \`'#'\` to prevent reuse within this path."
    },
    {
      "title": "Collect words at Trie end-nodes",
      "content": "When you reach a Trie node where \`ref != -1\`, you have found a word. Add \`words[ref]\` to results, then **immediately set \`node.ref = -1\`** — the same word might be reachable via other board paths, and this prevents duplicates without a separate visited set."
    },
    {
      "title": "Backtrack and optionally prune",
      "content": "After exploring all neighbors, restore \`board[r][c]\` to its original character. If the current Trie node now has no children, delete it from its parent — shrinking the Trie as words are found makes future DFS calls terminate earlier."
    }
  ]
}
\`\`\`

### Tracing the Example

\`\`\`
board = [
  ["o","a","a","n"],   // row 0: indices 0–3
  ["e","t","a","e"],   // row 1: indices 4–7
  ["i","h","k","r"],   // row 2: indices 8–11
  ["i","f","l","v"]    // row 3: indices 12–15
]
words = ["oath","pea","eat","rain"]   →   output: ["eat","oath"]
\`\`\`

\`\`\`algoviz
{
  "title": "Trie-guided DFS: Finding \\"eat\\" then \\"oath\\"",
  "type": "grid",
  "data": [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]],
  "frames": [
    { "highlight": [7], "label": "DFS from (1,3)='e' — Trie root has child 'e' (prefix of 'eat')", "stats": { "path": "e", "depth": 1 } },
    { "highlight": [7, 6], "label": "Move to (1,2)='a' — Trie node['e'] has child 'a'. Mark (1,3)='#'", "stats": { "path": "ea", "depth": 2 } },
    { "highlight": [7, 6, 5], "label": "Move to (1,1)='t' — Trie node['ea'] has child 't', ref != -1 → FOUND 'eat'! Set ref=-1.", "stats": { "path": "eat", "depth": 3, "found": "eat" } },
    { "highlight": [0], "label": "New DFS from (0,0)='o' — Trie root has child 'o' (prefix of 'oath')", "stats": { "path": "o", "depth": 1 } },
    { "highlight": [0, 1], "label": "Move to (0,1)='a' — valid Trie child. Mark (0,0)='#'", "stats": { "path": "oa", "depth": 2 } },
    { "highlight": [0, 1, 5], "label": "Move to (1,1)='t' — valid Trie child. Mark (0,1)='#'", "stats": { "path": "oat", "depth": 3 } },
    { "highlight": [0, 1, 5, 9], "label": "Move to (2,1)='h' — ref != -1 → FOUND 'oath'! 'pea' and 'rain' never match any path.", "stats": { "path": "oath", "depth": 4, "found": "oath" } }
  ],
  "speed": 900
}
\`\`\`

### Trie Structure for This Input

\`\`\`mermaid
graph TD
    ROOT --> |e| E["e"]
    ROOT --> |o| O["o"]
    ROOT --> |p| P["p"]
    ROOT --> |r| R["r"]
    E --> |a| EA["a"]
    EA --> |t| EAT["t ✓ eat"]
    O --> |a| OA["a"]
    OA --> |t| OAT["t"]
    OAT --> |h| OATH["h ✓ oath"]
    P --> |e| PE["e"]
    PE --> |a| PEA["a ✓ pea"]
    R --> |a| RA["a"]
    RA --> |i| RAI["i"]
    RAI --> |n| RAIN["n ✓ rain"]
    style EAT fill:#22c55e,color:#fff
    style OATH fill:#22c55e,color:#fff
    style PEA fill:#94a3b8,color:#fff
    style RAIN fill:#94a3b8,color:#fff
\`\`\`

Each DFS path on the board mirrors a path down this tree. Reaching a green node means the current board path spells a found word.

### Brute Force vs Optimal

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Brute Force — separate DFS per word",
    "code": "def findWords(board, words):\\n    rows, cols = len(board), len(board[0])\\n\\n    def dfs(word, i, r, c):\\n        if i == len(word): return True\\n        if not (0 <= r < rows and 0 <= c < cols): return False\\n        if board[r][c] != word[i]: return False\\n        tmp, board[r][c] = board[r][c], '#'\\n        found = any(dfs(word, i+1, r+dr, c+dc)\\n                    for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)])\\n        board[r][c] = tmp\\n        return found\\n\\n    result = []\\n    for word in words:           # O(W) outer loop — one full search per word\\n        for r in range(rows):\\n            for c in range(cols):\\n                if dfs(word, 0, r, c):\\n                    result.append(word)\\n                    break\\n    return result"
  },
  "after": {
    "label": "Trie + Backtracking — one DFS pass for all words",
    "code": "def findWords(board, words):\\n    # Build Trie: nested dicts, '#' marks word end\\n    trie = {}\\n    for word in words:\\n        node = trie\\n        for ch in word:\\n            node = node.setdefault(ch, {})\\n        node['#'] = word\\n\\n    rows, cols = len(board), len(board[0])\\n    result = []\\n\\n    def dfs(node, r, c):\\n        ch = board[r][c]\\n        if ch not in node: return     # Prune: no word matches this prefix\\n        nxt = node[ch]\\n        if '#' in nxt:                # Word found\\n            result.append(nxt.pop('#'))  # pop prevents duplicates\\n        board[r][c] = '%'             # Mark visited\\n        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:\\n            nr, nc = r+dr, c+dc\\n            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '%':\\n                dfs(nxt, nr, nc)\\n        board[r][c] = ch              # Restore\\n        if not nxt: del node[ch]      # Prune empty Trie node\\n\\n    for r in range(rows):             # One pass — covers ALL words\\n        for c in range(cols):\\n            dfs(trie, r, c)\\n    return result"
  }
}
\`\`\`

### Complexity

| | Time | Space |
|---|---|---|
| **Brute Force** | O(W × m×n × 4^L) | O(L) recursion stack |
| **Trie + DFS** | O(total chars) build + O(m×n × 4^L) search | O(total chars) Trie |

Where \`W\` = number of words, \`L\` = max word length, \`m×n\` = board dimensions.

The Trie bound is O(m×n × 4^L) **worst case**, but Trie pruning terminates branches far earlier — the moment no remaining word shares the current prefix, the DFS stops. In practice this is dramatically faster than the brute force.

\`\`\`callout
{ "type": "tip", "title": "The Shrinking Trie Optimization", "content": "The \`if not nxt: del node[ch]\` line in the optimal solution removes Trie nodes that have no remaining words beneath them. As the DFS finds words and prunes end-markers, the Trie shrinks. Later DFS calls on the same board cover fewer Trie paths — giving a concrete speedup when many words are found early." }
\`\`\`

\`\`\`quiz
{
  "title": "Word Search II — Check Your Understanding",
  "questions": [
    {
      "question": "Why do we build a Trie from all words before starting DFS on the board?",
      "options": [
        "To sort the words alphabetically before searching",
        "So one DFS path simultaneously advances progress on every word sharing that prefix",
        "Tries are always faster than hash sets for membership testing",
        "To verify the board has enough letters for each word before searching"
      ],
      "answer": 1,
      "explanation": "The Trie lets a single board traversal path simultaneously match every word sharing a common prefix. Without it, you run a full DFS per word — O(W × m×n × 4^L). With the Trie, one DFS pass covers all words."
    },
    {
      "question": "During DFS, we mark the current cell '#' and restore it afterward. What does the restore (backtrack) step accomplish?",
      "options": [
        "It signals to other DFS calls that this cell is permanently used",
        "It allows future DFS paths — starting from different cells — to use this cell in their words",
        "It removes the cell from the Trie after a word is found",
        "It resets the board to its initial state before the next word search"
      ],
      "answer": 1,
      "explanation": "Marking '#' prevents reuse within the current DFS path (one word cannot use the same cell twice). Restoring the original character when backtracking allows other DFS paths — starting from different root cells — to include this cell in their words."
    },
    {
      "question": "After finding a word at a Trie end-node, we remove its end-marker. Why not just add the word and continue?",
      "options": [
        "Removing it frees memory to stay within the space limit",
        "The same word can be found via multiple board paths, and removing the marker prevents duplicates in the result",
        "The Trie becomes invalid if end-markers are left in place after a match",
        "It signals to the DFS to stop exploring that branch entirely"
      ],
      "answer": 1,
      "explanation": "A word like 'eat' might be spelled at two different locations on the board. Both DFS paths would find the same Trie end-node. Removing the end-marker after the first find ensures the word appears in results only once — no separate visited-words set needed."
    },
    {
      "question": "What is the worst-case time complexity of the Trie + Backtracking solution (excluding Trie construction)?",
      "options": [
        "O(W × L) where W = number of words, L = max length",
        "O(m × n) since we visit each cell once",
        "O(m × n × 4^L) where L is the maximum word length",
        "O(m × n × W × L) because the Trie still checks each word at each cell"
      ],
      "answer": 2,
      "explanation": "The DFS starts from each of the m×n cells and at each step can branch in up to 4 directions for up to L levels deep — giving O(m × n × 4^L). The Trie prunes this heavily in practice, but the theoretical worst case remains the same. This is W times better than brute force."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Build the Trie once from all words — then a single DFS pass on the board simultaneously tracks progress toward every word via shared prefix paths.",
    "Co-navigate board and Trie: only move to a neighbor if it exists as a Trie child. Any mismatch prunes the entire subtree immediately.",
    "Mark cells '#' during DFS to enforce the no-reuse rule within one word path; restore on backtrack so other paths can use the cell.",
    "Remove a word's end-marker upon finding it to deduplicate results — the same word may be reachable via multiple board paths.",
    "Prune empty Trie nodes after backtracking — the Trie shrinks as words are found, making subsequent DFS calls faster in practice."
  ]
}
\`\`\``,
      starterCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None  # Store complete word at end node


def find_words(board, words):
    """
    Find all words from the list that exist on the board.
    
    Args:
        board: 2D list of characters
        words: List of strings to search for
    
    Returns:
        List of found words
    
    Example:
        >>> board = [
        ...     ["o","a","a","n"],
        ...     ["e","t","a","e"],
        ...     ["i","h","k","r"],
        ...     ["i","f","l","v"]
        ... ]
        >>> words = ["oath","pea","eat","rain"]
        >>> find_words(board, words)
        ["eat", "oath"]  (order may vary)
    """
    # TODO: Build Trie from words, then backtrack on board
    # Hint: Store complete word in Trie node to avoid string building
    pass


# ─── Test Cases ───

board = [
    ["o", "a", "a", "n"],
    ["e", "t", "a", "e"],
    ["i", "h", "k", "r"],
    ["i", "f", "l", "v"]
]
words = ["oath", "pea", "eat", "rain"]

print(find_words(board, words))
# Expected: ["eat", "oath"] (order may vary)

# Single word
board2 = [["a"]]
words2 = ["a"]
print(find_words(board2, words2))
# Expected: ["a"]

# No matches
board3 = [["a", "b"], ["c", "d"]]
words3 = ["xyz"]
print(find_words(board3, words3))
# Expected: []

# Words with common prefix
board4 = [["a", "b"], ["c", "d"]]
words4 = ["abc", "abd"]
print(find_words(board4, words4))
# Expected: []
`,
      solutionCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None  # Store complete word at end node


def find_words(board, words):
    """
    Find all words from the list that exist on the board.
    
    Time Complexity: O(m × n × 4^L) but pruned by Trie
    Space Complexity: O(total characters in words)
    """
    # Build Trie
    root = TrieNode()
    for word in words:
        node = root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.word = word  # Store word at end
    
    rows, cols = len(board), len(board[0])
    result = []
    
    def backtrack(r, c, parent):
        char = board[r][c]
        node = parent.children[char]
        
        # Check if we found a word
        if node.word is not None:
            result.append(node.word)
            node.word = None  # Avoid duplicates
        
        # Mark as visited
        board[r][c] = '#'
        
        # Explore neighbors
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                if board[nr][nc] in node.children:
                    backtrack(nr, nc, node)
        
        # Restore
        board[r][c] = char
        
        # Optimization: Remove leaf nodes
        if not node.children:
            parent.children.pop(char)
    
    # Start from each cell
    for r in range(rows):
        for c in range(cols):
            if board[r][c] in root.children:
                backtrack(r, c, root)
    
    return result


# ─── Test Cases ───
board = [
    ["o", "a", "a", "n"],
    ["e", "t", "a", "e"],
    ["i", "h", "k", "r"],
    ["i", "f", "l", "v"]
]
words = ["oath", "pea", "eat", "rain"]

result = find_words(board, words)
print(sorted(result))
# Expected: ["eat", "oath"]

board2 = [["a"]]
words2 = ["a"]
print(find_words(board2, words2))
# Expected: ["a"]

board3 = [["a", "b"], ["c", "d"]]
words3 = ["xyz"]
print(find_words(board3, words3))
# Expected: []
`,
    },
    {
      id: "design-word-data-structure",
      slug: "design-word-data-structure",
      title: "Design Add and Search Words Data Structure",
      content: `## Design Add and Search Words Data Structure

<!-- voice:section_check concept="Trie with wildcard search" -->

\`\`\`concept
{ "title": "Trie + DFS = Wildcard Search", "variant": "mental-model", "content": "A standard Trie gives you O(L) lookups for exact strings. Adding wildcard support means: when you hit a '.' you don't know which branch to take — so you try **all of them** via DFS. One branch returning \`True\` is enough to succeed.\\n\\nThink of it as: **exact characters = navigate deterministically; '.' = fork and explore all children.**" }
\`\`\`

### Problem Statement

Design a data structure supporting two operations:

| Method | Returns | Description |
|--------|---------|-------------|
| \`addWord(word)\` | \`void\` | Insert \`word\` into the structure |
| \`search(word)\` | \`bool\` | \`True\` if any stored word matches — \`.\` matches **any single letter** |

**Running example:**

\`\`\`
wd.addWord("bad")  →  b→a→d*
wd.addWord("dad")  →  d→a→d*
wd.addWord("mad")  →  m→a→d*

wd.search("pad")   →  False  (no 'p' at root)
wd.search("bad")   →  True   (exact match)
wd.search(".ad")   →  True   ('.' matches b, d, or m — all lead to valid "ad" suffix)
wd.search("b..")   →  True   (b → any → any, finds b→a→d)
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Dots Are Expensive", "content": "Each '.' multiplies work by up to 26×. With *d* dots in a length-L word, worst-case search is **O(26^d × L)**. A query like \`\\"....\\"\` (all wildcards) traverses the entire Trie. In practice, this is acceptable because most real queries have few wildcards." }
\`\`\`

### Algorithm

\`\`\`steps
{ "title": "Building the WordDictionary", "steps": [ { "title": "addWord — Standard Trie Insert", "content": "Walk the Trie character by character, creating a new \`TrieNode\` wherever a path is missing. Mark \`is_end = True\` on the final node.\\n\\n**Time:** O(L) — at most one new node per character." }, { "title": "search — Dispatch to DFS Helper", "content": "Call \`_dfs(word, index=0, node=root)\`. The helper handles both literal characters and wildcards recursively." }, { "title": "_dfs — Base Case", "content": "If \`index == len(word)\`: all characters consumed. Return \`node.is_end\` — are we at a valid word terminus?" }, { "title": "_dfs — Exact Character", "content": "If \`word[index] != '.'\`: check if the character exists as a child. If not, return \`False\` immediately (prune). If yes, recurse with \`index + 1\` and that child." }, { "title": "_dfs — Wildcard '.'", "content": "Iterate over **every child** of the current node. Recurse with \`index + 1\` for each. If **any** recursive call returns \`True\`, return \`True\` immediately. If all branches fail, return \`False\`." } ] }
\`\`\`

### Trace: search(".ad") on {bad, dad, mad}

\`\`\`trace
{ "title": "Tracing _dfs for search(\\".ad\\")", "language": "python", "code": "def _dfs(word, i, node):\\n    if i == len(word):\\n        return node.is_end\\n    ch = word[i]\\n    if ch == '.':\\n        for child in node.children.values():\\n            if _dfs(word, i + 1, child):\\n                return True\\n        return False\\n    if ch not in node.children:\\n        return False\\n    return _dfs(word, i + 1, node.children[ch])", "frames": [ { "line": 1, "vars": {"word": ".ad", "i": 0}, "note": "Enter _dfs at root. root.children = {b, d, m}" }, { "line": 4, "vars": {"ch": "."}, "note": "ch = '.'. This is a wildcard — must branch on all children." }, { "line": 5, "vars": {}, "note": "Enter dot-loop. First child to try: 'b'" }, { "line": 4, "vars": {"i": 1, "ch": "a"}, "note": "Recursive call at node_b. ch = 'a' — exact character check." }, { "line": 9, "vars": {}, "note": "'a' is in node_b.children. Recurse deeper: _dfs('.ad', 2, node_ba)" }, { "line": 4, "vars": {"i": 2, "ch": "d"}, "note": "At node_ba. ch = 'd' — check node_ba.children." }, { "line": 9, "vars": {}, "note": "'d' found. Recurse: _dfs('.ad', 3, node_bad)" }, { "line": 2, "vars": {"i": 3}, "note": "i == 3 == len('.ad'). Hit base case — check is_end." }, { "line": 3, "vars": {}, "note": "node_bad.is_end = True! 'bad' is a stored word.", "stdout": "True" }, { "line": 6, "vars": {}, "note": "True bubbles up through the dot-loop. Return True immediately — no need to try 'd' or 'm' branches.", "stdout": "True" } ], "speed": 900 }
\`\`\`

### Implementation

\`\`\`playground
{ "title": "WordDictionary — Python", "language": "python", "code": "class TrieNode:\\n    def __init__(self):\\n        self.children = {}\\n        self.is_end = False\\n\\nclass WordDictionary:\\n    def __init__(self):\\n        self.root = TrieNode()\\n\\n    def addWord(self, word: str) -> None:\\n        node = self.root\\n        for ch in word:\\n            if ch not in node.children:\\n                node.children[ch] = TrieNode()\\n            node = node.children[ch]\\n        node.is_end = True\\n\\n    def search(self, word: str) -> bool:\\n        return self._dfs(word, 0, self.root)\\n\\n    def _dfs(self, word: str, i: int, node: TrieNode) -> bool:\\n        if i == len(word):\\n            return node.is_end\\n        ch = word[i]\\n        if ch == '.':\\n            for child in node.children.values():\\n                if self._dfs(word, i + 1, child):\\n                    return True\\n            return False\\n        if ch not in node.children:\\n            return False\\n        return self._dfs(word, i + 1, node.children[ch])\\n\\n\\nwd = WordDictionary()\\nwd.addWord('bad')\\nwd.addWord('dad')\\nwd.addWord('mad')\\nprint(wd.search('pad'))   # False\\nprint(wd.search('bad'))   # True\\nprint(wd.search('.ad'))   # True\\nprint(wd.search('b..'))   # True", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "dict vs array[26] for children", "content": "Using \`children = {}\` (hash map) is idiomatic Python and memory-efficient when words share few characters. In Java/C++ interviews the \`children = new TrieNode[26]\` fixed-array approach is more common — it trades space (O(26 × nodes)) for guaranteed O(1) access without hash overhead." }
\`\`\`

### Complexity Summary

| Operation | Time | Space |
|-----------|------|-------|
| \`addWord(word)\` | O(L) | O(L) new nodes |
| \`search\` — no dots | O(L) | O(L) call stack |
| \`search\` — *d* dots | O(26^d × L) | O(L) call stack |

*L = word length, d = number of '.' wildcards*

\`\`\`collapse
{ "title": "Deep Dive: Iterative DFS to Avoid Recursion Limits", "content": "The recursive \`_dfs\` adds O(L) call-stack frames — Python's default limit is 1000. For very long words, an **iterative** approach using an explicit stack is safer:\\n\\n    def search(self, word: str) -> bool:\\n        stack = [(0, self.root)]\\n        while stack:\\n            i, node = stack.pop()\\n            if i == len(word):\\n                if node.is_end:\\n                    return True\\n                continue\\n            ch = word[i]\\n            if ch == '.':\\n                for child in node.children.values():\\n                    stack.append((i + 1, child))\\n            elif ch in node.children:\\n                stack.append((i + 1, node.children[ch]))\\n        return False\\n\\nSame worst-case complexity, but the stack lives on the heap rather than the call stack. The LIFO order mirrors recursive DFS exactly — you can verify this by tracing \`.ad\` through both versions." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "After addWord('cat') and addWord('car'), what does search('ca.') return?", "options": ["False — '.' only matches at the end of a word", "True — '.' matches 't' or 'r', both are valid word endings", "True — but only matches 'cat', not 'car'", "Error — '.' is not a valid search character"], "answer": 1, "explanation": "'.' matches any single letter at that position. After traversing 'c'→'a', the Trie has both 't' (is_end=True) and 'r' (is_end=True) as children. Either branch succeeds, so search returns True." }, { "question": "What is the time complexity of search('...') in a WordDictionary with words of max length L?", "options": ["O(L)", "O(N) where N is the number of stored words", "O(26^3 × L)", "O(N × L)"], "answer": 2, "explanation": "Three wildcard dots each branch up to 26 ways, giving 26^3 possible paths to explore. Each path descends at most L levels. This gives O(26^3 × L) — independent of N, because we're traversing the Trie structure, not iterating over stored words." }, { "question": "Why is a Trie preferred over a HashSet<String> for wildcard search?", "options": ["A HashSet cannot store strings", "A HashSet supports wildcards natively via regex", "A Trie allows prefix-aware DFS — exact characters prune dead branches immediately", "HashSet lookups are O(L) but Trie lookups are O(1)"], "answer": 2, "explanation": "With a HashSet you must compare the pattern against every stored word — O(N × L) per search call. A Trie lets you prune immediately when a literal character has no matching child, and wildcards only branch at nodes that actually exist in the Trie." }, { "question": "In the trace, when search('.ad') finds a match via the 'b' branch, what happens to the 'd' and 'm' branches?", "options": ["They are still explored to find all matches", "They are skipped — True is returned as soon as the first branch succeeds", "They throw an exception since the answer was already found", "They are explored in parallel"], "answer": 1, "explanation": "The dot-loop uses \`if _dfs(...): return True\`. Once 'bad' is found through the 'b' branch, True propagates immediately up the call stack without ever attempting the 'd' or 'm' branches. This short-circuit is an important constant-factor optimization." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "addWord is a standard Trie insert: O(L) time, O(L) space — identical to a basic Trie.", "search with '.' uses recursive DFS: try every child at each wildcard position.", "Each '.' multiplies branches by up to 26×; d dots gives O(26^d × L) worst-case — wildcards are costly.", "Exact-character steps prune aggressively — the exponential cost only manifests when '.' actually appears.", "An iterative DFS with an explicit (index, node) stack avoids Python's recursion limit for long words." ] }
\`\`\``,
      starterCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False


class WordDictionary:
    """
    Design a word dictionary that supports addWord and search with wildcards.
    
    Example:
        >>> wd = WordDictionary()
        >>> wd.addWord("bad")
        >>> wd.addWord("dad")
        >>> wd.addWord("mad")
        >>> wd.search("pad")
        False
        >>> wd.search("bad")
        True
        >>> wd.search(".ad")
        True
        >>> wd.search("b..")
        True
    """
    
    def __init__(self):
        # TODO: Initialize the data structure
        pass
    
    def addWord(self, word):
        """Add word to dictionary."""
        # TODO: Standard Trie insert
        pass
    
    def search(self, word):
        """
        Search for word in dictionary.
        '.' matches any single character.
        """
        # TODO: Trie search with backtracking for '.'
        pass


# ─── Test Cases ───

wd = WordDictionary()

# Add words
wd.addWord("bad")
wd.addWord("dad")
wd.addWord("mad")

# Exact search
print(wd.search("pad"))  # Expected: False
print(wd.search("bad"))  # Expected: True

# Wildcard search
print(wd.search(".ad"))  # Expected: True (matches bad, dad, mad)
print(wd.search("b.."))  # Expected: True (matches bad)
print(wd.search("..."))  # Expected: True (matches all 3-letter words)
print(wd.search("....")) # Expected: False (no 4-letter words)

# Edge cases
wd.addWord("a")
print(wd.search("."))    # Expected: True
print(wd.search("a"))    # Expected: True
`,
      solutionCode: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False


class WordDictionary:
    """
    Design a word dictionary that supports addWord and search with wildcards.
    
    Time Complexity:
        addWord: O(L)
        search: O(L) without dots, O(26^d × L) with d dots
    Space Complexity:
        addWord: O(L)
        search: O(L) for recursion stack
    """
    
    def __init__(self):
        self.root = TrieNode()
    
    def addWord(self, word):
        """Add word to dictionary."""
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word):
        """
        Search for word in dictionary.
        '.' matches any single character.
        """
        def backtrack(node, index):
            # Base case: all characters matched
            if index == len(word):
                return node.is_end
            
            char = word[index]
            
            if char == '.':
                # Try all possible children
                for child in node.children.values():
                    if backtrack(child, index + 1):
                        return True
                return False
            else:
                # Normal character match
                if char not in node.children:
                    return False
                return backtrack(node.children[char], index + 1)
        
        return backtrack(self.root, 0)


# Alternative: Iterative for non-wildcard, recursive for wildcard
class WordDictionaryOptimized:
    """Optimized version with separate methods."""
    
    def __init__(self):
        self.root = TrieNode()
    
    def addWord(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word):
        # Use DFS for wildcard search
        def dfs(node, i):
            if i == len(word):
                return node.is_end
            
            if word[i] == '.':
                for child in node.children.values():
                    if dfs(child, i + 1):
                        return True
                return False
            
            if word[i] not in node.children:
                return False
            return dfs(node.children[word[i]], i + 1)
        
        return dfs(self.root, 0)


# ─── Test Cases ───
wd = WordDictionary()

wd.addWord("bad")
wd.addWord("dad")
wd.addWord("mad")

print(wd.search("pad"))  # Expected: False
print(wd.search("bad"))  # Expected: True
print(wd.search(".ad"))  # Expected: True
print(wd.search("b.."))  # Expected: True
print(wd.search("..."))  # Expected: True
print(wd.search("....")) # Expected: False

wd.addWord("a")
print(wd.search("."))    # Expected: True
print(wd.search("a"))    # Expected: True
`,
    },
    {
      id: "trie-checkpoint",
      slug: "trie-checkpoint",
      title: "Module Checkpoint: Trie",
      content: `## Module Checkpoint: Trie

<!-- voice:checkpoint_intro -->

You've completed the Trie module — one of the most elegant data structures for string problems. Before moving on, let's consolidate everything you've learned across insert, search, prefix matching, Word Search II, and wildcard handling.

\`\`\`concept
{ "title": "The Trie Mental Model", "variant": "mental-model", "content": "A Trie is a tree where each path from root to a node spells a prefix. Every node represents one character, shared prefixes share nodes, and an \`is_end\` boolean marks where complete words terminate. All three core operations — insert, search, prefix check — run in **O(L)** time where L is the word or prefix length. The cost is independent of how many words are stored." }
\`\`\`

### Operations at a Glance

\`\`\`tabs
{ "tabs": [ { "label": "Insert", "icon": "➕", "content": "**Time:** O(L) &nbsp;|&nbsp; **Space:** O(L) worst case\\n\\nWalk from root one character at a time. If a child for the current character does not exist, create it. After processing all characters, set \`is_end = True\`.\\n\\n\`\`\`python\\ndef insert(self, word):\\n    node = self.root\\n    for char in word:\\n        if char not in node.children:\\n            node.children[char] = TrieNode()\\n        node = node.children[char]\\n    node.is_end = True\\n\`\`\`" }, { "label": "Search", "icon": "🔍", "content": "**Time:** O(L) &nbsp;|&nbsp; **Space:** O(1)\\n\\nFollow the path for every character. If any character is missing, return \`False\` immediately. After the last character, return \`node.is_end\` — this distinguishes *'app'* (a full word) from *'ap'* (prefix only).\\n\\n\`\`\`python\\ndef search(self, word):\\n    node = self.root\\n    for char in word:\\n        if char not in node.children:\\n            return False\\n        node = node.children[char]\\n    return node.is_end\\n\`\`\`" }, { "label": "Prefix Check", "icon": "🔤", "content": "**Time:** O(L) &nbsp;|&nbsp; **Space:** O(1)\\n\\nIdentical to search — except return \`True\` as soon as the path exists without checking \`is_end\`. This is the operation that gives Tries their edge over hash tables for autocomplete.\\n\\n\`\`\`python\\ndef starts_with(self, prefix):\\n    node = self.root\\n    for char in prefix:\\n        if char not in node.children:\\n            return False\\n        node = node.children[char]\\n    return True  # path exists = prefix found\\n\`\`\`" }, { "label": "Word Search II", "icon": "🗺️", "content": "**Pattern:** Build a Trie from all target words, then DFS + backtrack the grid.\\n\\nAt each DFS step, check whether the path so far exists as a Trie prefix. If it does not, **prune immediately** — no point continuing in that direction.\\n\\n**Why a Trie?** Without it you run a separate DFS for each of W words — O(W × 4^L) total. With a Trie, all words sharing a prefix share the same DFS traversal.\\n\\n**Key optimization:** After finding a complete word, set \`node.word = None\` to prevent duplicate results in later DFS branches." }, { "label": "Wildcard '.'", "icon": "🃏", "content": "**Pattern:** DFS over all children when \`'.'\` is encountered.\\n\\nFor each character in the query:\\n- Regular char → follow the single matching child\\n- \`'.'\` → recursively try **all** children of the current node\\n\\n\`\`\`python\\ndef _dfs(self, node, word, i):\\n    if i == len(word):\\n        return node.is_end\\n    c = word[i]\\n    if c == '.':\\n        return any(\\n            self._dfs(child, word, i + 1)\\n            for child in node.children.values()\\n        )\\n    if c not in node.children:\\n        return False\\n    return self._dfs(node.children[c], word, i + 1)\\n\`\`\`" } ] }
\`\`\`

### Tracing a Search

\`\`\`trace
{ "title": "search('ant') — Trie contains ['and', 'ant', 'do']", "language": "python", "code": "def search(self, word):\\n    node = self.root\\n    for char in word:\\n        if char not in node.children:\\n            return False\\n        node = node.children[char]\\n    return node.is_end", "frames": [ { "line": 2, "vars": { "word": "'ant'", "node": "root" }, "note": "Start at root. The Trie already has paths for 'and', 'ant', 'do'." }, { "line": 3, "vars": { "char": "'a'" }, "note": "First character: 'a'" }, { "line": 5, "vars": { "char": "'a'", "node": "→ 'a' node" }, "note": "'a' child exists — follow it" }, { "line": 3, "vars": { "char": "'n'" }, "note": "Second character: 'n'" }, { "line": 5, "vars": { "char": "'n'", "node": "→ 'n' node" }, "note": "'n' child exists under 'a' — shared by both 'and' and 'ant'" }, { "line": 3, "vars": { "char": "'t'" }, "note": "Third character: 't'" }, { "line": 5, "vars": { "char": "'t'", "node": "→ 't' node" }, "note": "'t' child exists under 'n' — this branch is for 'ant', not 'and'" }, { "line": 7, "vars": { "node.is_end": "True", "result": "True" }, "note": "All chars matched. is_end=True → 'ant' is a complete stored word." } ], "speed": 800 }
\`\`\`

### Knowledge Check

\`\`\`quiz
{ "title": "Trie Module Quiz", "questions": [ { "question": "What is the time complexity of searching for a word of length L in a Trie that stores N total words?", "options": [ "O(N) — must scan every stored word", "O(L) — traverse one node per character", "O(log N) — binary search the prefix tree", "O(1) — direct hash lookup" ], "answer": 1, "explanation": "A Trie search walks exactly one node per character in the word, regardless of how many words are stored. The cost is O(L) where L is the word length, not O(N). This is the core advantage over a linear scan or even a sorted word list." }, { "question": "What is the key advantage of a Trie over a hash table for string problems?", "options": [ "Faster insertion of individual words", "Efficient prefix operations such as starts_with and autocomplete", "Lower memory usage per word", "Built-in lexicographic sorting of all keys" ], "answer": 1, "explanation": "A hash table answers exact-match lookups in O(1), but cannot efficiently answer prefix queries like 'find all words starting with ap'. A Trie answers this in O(P) where P is the prefix length because the prefix path is physically encoded in the structure." }, { "question": "In Word Search II, why does using a single Trie outperform running a separate DFS for each target word?", "options": [ "A Trie uses less memory than storing each word individually", "Words sharing a common prefix share the same DFS traversal — overlapping work is done once", "The problem constraints explicitly require a Trie", "It produces shorter code" ], "answer": 1, "explanation": "Words like 'apple' and 'apply' share the prefix 'appl'. With a Trie, a single DFS path on the grid explores that prefix for both words simultaneously. Running a separate DFS per word repeats all this traversal, giving O(W × 4^L) instead of the shared-prefix saving." }, { "question": "When the wildcard search encounters a '.' character, what must the algorithm do?", "options": [ "Return True immediately because any character matches", "Skip the current character and advance the pattern pointer", "Recursively try every child of the current Trie node", "Backtrack to the previous character in the pattern" ], "answer": 2, "explanation": "Since '.' can match any single character, you cannot commit to one branch — you must try all children. If any branch leads to a valid complete match, return True. This is a DFS fan-out over all possible character continuations at that position." }, { "question": "What does Word Search II store at end nodes as an optimization, and why?", "options": [ "The depth of the node, to bound DFS recursion", "The complete word string, so results can be recorded without reconstructing the path", "The number of children, to prune branches early", "A back-pointer to the parent, for path reconstruction" ], "answer": 1, "explanation": "Storing the full word string at the end node means that when DFS reaches a match, it adds node.word directly to results without tracing back through the Trie. After recording the word, setting node.word = None prevents the same word from being added again by a different grid path." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Each Trie node holds a children map (char → node) and an is_end flag — every path from root spells a prefix or complete word.", "Insert, search, and prefix-check all run in O(L) time and O(1) extra space, independent of total words stored.", "Word Search II pairs a Trie with DFS backtracking — the Trie prunes grid paths the instant they diverge from every target word's prefix.", "Wildcard '.' requires fanning out DFS over all children; a regular character follows exactly one branch.", "Storing the complete word at end nodes is a standard optimization — it avoids path reconstruction and enables O(1) duplicate removal during Word Search II." ] }
\`\`\`

### Voice Summary

<!-- voice:checkpoint_summary -->

Your coach will ask you to walk through:

1. **Trie node structure** — what fields does each node hold, and why is the children map preferred over a fixed-size array?
2. **Insert vs. Search** — trace both operations on \`"app"\`, \`"apple"\`, and \`"apply"\` to show prefix sharing.
3. **Word Search II** — explain why the Trie prunes DFS and what happens when a word is found (the \`node.word = None\` trick).
4. **Wildcard handling** — why does \`'.'\` require recursion over all children instead of a single branch?

**You're mastering the Trie pattern!**`,
    },
  ],
};
