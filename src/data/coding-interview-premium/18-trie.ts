import { Module } from "../types";

export const trieModule: Module = {
  id: "trie",
  title: "Trie (Prefix Tree)",
  description:
    "Master the Trie data structure for efficient string storage and retrieval. Learn to solve word search, autocomplete, and prefix-matching problems with optimal time complexity.",
  lessons: [
    {
      id: "trie-intro",
      slug: "trie-intro",
      title: "Introduction to Trie",
      content: `## The Trie (Prefix Tree) Pattern

A **Trie** (pronounced "try"), also known as a prefix tree, is a tree-like data structure used to store a dynamic set of strings where the keys are usually strings.

<!-- voice:section_check concept="Trie basic concept" -->

### Why Trie?

| Operation | Hash Table | Trie |
|-----------|------------|------|
| Insert | O(L) | O(L) |
| Search | O(L) | O(L) |
| Prefix Search | O(n × L) | O(L) |
| Space | O(n × L) | O(n × L) but shared prefixes |

*L = length of string, n = number of strings*

### Trie Node Structure

Each node contains:
- **Children**: Hash map or array of child nodes (char → node)
- **isEndOfWord**: Boolean indicating if this node marks the end of a word

~~~
class TrieNode:
    def __init__(self):
        self.children = {}  # char -> TrieNode
        self.is_end = False
~~~

### Basic Operations

**Insert a word:**
~~~
def insert(word):
    node = root
    for char in word:
        if char not in node.children:
            node.children[char] = TrieNode()
        node = node.children[char]
    node.is_end = True
~~~

**Search for a word:**
~~~
def search(word):
    node = root
    for char in word:
        if char not in node.children:
            return False
        node = node.children[char]
    return node.is_end
~~~

**Prefix search:**
~~~
def starts_with(prefix):
    node = root
    for char in prefix:
        if char not in node.children:
            return False
        node = node.children[char]
    return True  # Prefix exists
~~~

<!-- voice:key_insight insight="Trie shares common prefixes — 'cat' and 'car' share the 'ca' path, saving space and enabling efficient prefix operations" -->

### When to Use

- Word search in grid (Word Search II)
- Autocomplete/type-ahead features
- Spell checking
- IP routing (longest prefix match)
- Word frequency counting

### Complexity

- **Insert:** O(L) where L is word length
- **Search:** O(L)
- **Prefix search:** O(L)
- **Space:** O(n × L) but often less due to prefix sharing`,
    },
    {
      id: "implement-trie",
      slug: "implement-trie",
      title: "Implement Trie (Prefix Tree)",
      content: `## Implement Trie (Prefix Tree)

<!-- voice:section_check concept="Basic Trie implementation" -->

### Problem Statement

Implement the Trie class:
- \`Trie()\` initializes the trie object
- \`void insert(String word)\` inserts \`word\` into the trie
- \`boolean search(String word)\` returns \`true\` if \`word\` is in the trie
- \`boolean startsWith(String prefix)\` returns \`true\` if any word starts with \`prefix\`

### Examples

~~~
Input:
["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]

Output:
[null, null, true, false, true, null, true]

Explanation:
Trie trie = new Trie()
trie.insert("apple")
trie.search("apple")    # true
trie.search("app")      # false (not a complete word)
trie.startsWith("app")  # true (prefix exists)
trie.insert("app")
trie.search("app")      # true (now it's a complete word)
~~~

### Approach

1. **Node Structure**: Each node has children dictionary and is_end flag
2. **Insert**: Traverse/create nodes for each character, mark end
3. **Search**: Traverse for each character, return is_end at final node
4. **StartsWith**: Same as search but don't check is_end

<!-- voice:key_insight insight="The only difference between search and startsWith is that search verifies we ended exactly at a word boundary (is_end=True)" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Insert:** O(L) time, O(L) space
- **Search:** O(L) time, O(1) space
- **StartsWith:** O(L) time, O(1) space`,
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

<!-- voice:section_check concept="Trie + Backtracking combination" -->

### Problem Statement

Given an m×n \`board\` of characters and a list of strings \`words\`, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring). The same letter cell may not be used more than once in a word.

### Examples

~~~
Input: 
board = [
  ["o","a","a","n"],
  ["e","t","a","e"],
  ["i","h","k","r"],
  ["i","f","l","v"]
]
words = ["oath","pea","eat","rain"]

Output: ["eat","oath"]
~~~

### Approach

**Brute Force:** For each word, run Word Search → O(N × m × n × 4^L) — too slow!

**Optimal (Trie + Backtracking):**
1. Build a Trie from all words
2. From each cell on board, do DFS following Trie paths
3. When reaching a Trie node where is_end=True, found a word!
4. Remove word from Trie to avoid duplicates

<!-- voice:key_insight insight="Build a Trie from all words first — then each DFS path on the board corresponds to a path in the Trie. This reduces repeated work for words with common prefixes." -->

<!-- voice:exercise_intro difficulty="hard" hints_available="3" -->

### Complexity

- **Build Trie:** O(total characters in all words)
- **Search:** O(m × n × 4^L) worst case but pruned by Trie
- **Space:** O(total characters) for Trie`,
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

### Problem Statement

Design a data structure that supports adding new words and finding if a string matches any previously added string.

Implement the \`WordDictionary\` class:
- \`WordDictionary()\` initializes the object
- \`void addWord(word)\` adds \`word\` to the data structure
- \`bool search(word)\` returns \`true\` if there is any string in the data structure that matches \`word\`. \`word\` may contain dots \`.\` where dots can be matched with any letter.

### Examples

~~~
Input:
["WordDictionary","addWord","addWord","addWord","search","search","search","search"]
[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]

Output:
[null,null,null,null,false,true,true,true]

Explanation:
WordDictionary wordDictionary = new WordDictionary()
wordDictionary.addWord("bad")
wordDictionary.addWord("dad")
wordDictionary.addWord("mad")
wordDictionary.search("pad")  # false
wordDictionary.search("bad")  # true
wordDictionary.search(".ad")  # true (matches bad, dad, mad)
wordDictionary.search("b..")  # true (matches bad)
~~~

### Approach

Use a Trie with modified search that handles '.' wildcard:
- \`addWord\`: Standard Trie insert O(L)
- \`search\': When encountering '.', try ALL possible children recursively

<!-- voice:key_insight insight="The '.' wildcard requires backtracking — try every possible character at that position and see if any path leads to a valid word" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Add:** O(L) time, O(L) space
- **Search (no dots):** O(L) time
- **Search (with dots):** O(26^d × L) where d is number of dots`,
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

Great work on the Trie module! Let's verify your understanding.

### Quick Review

You learned:
- **Trie structure**: Nodes with children map and is_end flag
- **Basic operations**: Insert O(L), Search O(L), Prefix search O(L)
- **Word Search II**: Combine Trie + backtracking for efficient multi-word search
- **Wildcard search**: Backtracking when encountering '.'

### Quiz

**Question 1:** What is the time complexity of searching for a word in a Trie?
- A) O(n) where n is number of words
- B) O(L) where L is length of the word
- C) O(log n)
- D) O(1)

**Question 2:** What is the main advantage of Trie over hash table for strings?
- A) Faster insertion
- B) Efficient prefix operations
- C) Less memory usage
- D) Built-in sorting

**Question 3:** In Word Search II, why do we use a Trie instead of searching each word separately?
- A) To use less memory
- B) To share common prefixes and avoid repeated work
- C) Because the problem requires it
- D) To make the code shorter

**Question 4:** True or False: In the wildcard search problem, '.' matches exactly one character.

**Question 5:** What information do we store at Trie nodes for Word Search II optimization?
- A) The depth of the node
- B) The complete word (if it's an end node)
- C) The number of children
- D) Nothing special

### Voice Summary

Your coach will ask you to:
- Explain Trie node structure and operations
- Walk through inserting and searching in a Trie
- Explain how Trie optimizes Word Search II
- Describe how to handle wildcard '.' in search

**You're mastering the Trie pattern!**`,
    },
  ],
};
