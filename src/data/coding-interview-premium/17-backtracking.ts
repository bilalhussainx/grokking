import { Module } from "../types";

export const backtrackingModule: Module = {
  id: "backtracking",
  title: "Backtracking",
  description:
    "Master the Backtracking pattern for solving constraint satisfaction problems. Learn to explore all possible solutions systematically, prune invalid paths early, and solve complex problems like N-Queens, Combination Sum, and Word Search.",
  lessons: [
    {
      id: "backtracking-intro",
      slug: "backtracking-intro",
      title: "Introduction to Backtracking",
      content: `## The Backtracking Pattern

**Backtracking** is a systematic way of trying out different sequences of decisions until a solution is found. It's essentially a depth-first search (DFS) through the space of possible choices.

<!-- voice:section_check concept="Backtracking basic concept" -->

### Why Backtracking?

When a problem requires:
1. **Exploring all possible configurations** — finding all solutions or any valid solution
2. **Constraint satisfaction** — solutions must meet specific constraints
3. **Sequential decisions** — each choice affects future options

### The Backtracking Template

~~~
def backtrack(state, choices):
    if is_solution(state):
        add_to_results(state)
        return
    
    for choice in choices:
        if is_valid(state, choice):
            make_choice(state, choice)
            backtrack(new_state, new_choices)
            undo_choice(state, choice)  # Backtrack!
~~~

### Key Components

1. **Path/State**: Current configuration of choices made
2. **Choices**: Available options at current step
3. **Constraints**: Rules that determine valid choices
4. **Goal**: Condition that makes a complete solution

<!-- voice:key_insight insight="Backtracking = DFS + state restoration — explore a path, and if it fails, undo the last choice and try another" -->

### Pruning (Optimization)

Stop exploring paths that cannot lead to a valid solution:
- Check constraints before recursing
- Skip invalid choices early
- Use heuristics to prioritize promising paths

### When to Use

- N-Queens, Sudoku solvers
- Combination/permutation problems
- Path finding in grids (Word Search)
- Subset generation with constraints
- Graph coloring

### Complexity

- **Time:** Often exponential O(k^n) where k is branching factor
- **Space:** O(n) for recursion stack (where n is solution depth)`,
    },
    {
      id: "n-queens",
      slug: "n-queens",
      title: "N-Queens Problem",
      content: `## N-Queens Problem

<!-- voice:section_check concept="Classic backtracking problem" -->

### Problem Statement

Place 'n' queens on an n×n chessboard such that no two queens threaten each other. Return all distinct solutions.

**Note:** Queens threaten each other if they share the same row, column, or diagonal.

### Examples

~~~
Input: n = 4
Output: [
  [".Q..","...Q","Q...","..Q."],
  ["..Q.","Q...","...Q",".Q.."]
]
Explanation: There are 2 distinct solutions for 4 queens.
~~~

~~~
Input: n = 1
Output: [["Q"]]
~~~

### Approach

Place queens one row at a time (or one column at a time):
1. For current row, try each column position
2. Check if position is safe (no conflicts with placed queens)
3. If safe, place queen and recurse to next row
4. If all queens placed, add to solutions
5. Backtrack: remove queen and try next position

**Safety Check:** A position (r, c) is safe if:
- No queen in column c
- No queen on diagonal (r + c) is constant
- No queen on anti-diagonal (r - c) is constant

<!-- voice:key_insight insight="Place one queen per row — this reduces the branching factor and ensures no two queens share a row" -->

<!-- voice:exercise_intro difficulty="hard" hints_available="3" -->

### Complexity

- **Time:** O(n!) — n choices for first row, n-1 for second, etc.
- **Space:** O(n) for recursion stack and board state`,
      starterCode: `def solve_n_queens(n):
    """
    Return all distinct solutions to the N-Queens problem.
    
    Args:
        n: int, board size and number of queens
    
    Returns:
        List of solutions, each solution is a list of strings representing the board
    
    Example:
        >>> solve_n_queens(4)
        [['.Q..', '...Q', 'Q...', '..Q.'], ['..Q.', 'Q...', '...Q', '.Q..']]
    """
    # TODO: Use backtracking to place queens one row at a time
    # Hint: Check columns and diagonals for conflicts
    pass


# ─── Test Cases ───

# n = 1
print(solve_n_queens(1))
# Expected: [['Q']]

# n = 4
print(solve_n_queens(4))
# Expected: 2 solutions (as shown above)

# n = 2 (no solution)
print(solve_n_queens(2))
# Expected: []

# n = 3 (no solution)
print(solve_n_queens(3))
# Expected: []

# Check count for n = 5
print(len(solve_n_queens(5)))
# Expected: 10
`,
      solutionCode: `def solve_n_queens(n):
    """
    Return all distinct solutions to the N-Queens problem.
    
    Time Complexity: O(n!) — n choices for first row, n-1 for second, etc.
    Space Complexity: O(n) for recursion stack
    """
    def is_safe(row, col):
        # Check column
        for r in range(row):
            if board[r] == col:
                return False
        
        # Check diagonal (r + c is constant)
        for r in range(row):
            if board[r] + r == col + row:
                return False
        
        # Check anti-diagonal (r - c is constant)
        for r in range(row):
            if board[r] - r == col - row:
                return False
        
        return True
    
    def backtrack(row):
        if row == n:
            # All queens placed, create board representation
            solution = []
            for c in board:
                row_str = ['.'] * n
                row_str[c] = 'Q'
                solution.append(''.join(row_str))
            results.append(solution)
            return
        
        for col in range(n):
            if is_safe(row, col):
                board[row] = col
                backtrack(row + 1)
                board[row] = -1  # Backtrack
    
    board = [-1] * n  # board[i] = column of queen in row i
    results = []
    backtrack(0)
    return results


# Alternative using sets for O(1) conflict checking
def solve_n_queens_optimized(n):
    """
    Optimized version using sets for O(1) safety checks.
    """
    def backtrack(row):
        if row == n:
            solution = []
            for c in board:
                row_str = ['.'] * n
                row_str[c] = 'Q'
                solution.append(''.join(row_str))
            results.append(solution)
            return
        
        for col in range(n):
            # Check using sets: diagonal = row + col, anti-diagonal = row - col
            if col not in cols and (row + col) not in diagonals and (row - col) not in anti_diagonals:
                cols.add(col)
                diagonals.add(row + col)
                anti_diagonals.add(row - col)
                board.append(col)
                
                backtrack(row + 1)
                
                # Backtrack
                board.pop()
                cols.remove(col)
                diagonals.remove(row + col)
                anti_diagonals.remove(row - col)
    
    cols = set()
    diagonals = set()
    anti_diagonals = set()
    board = []
    results = []
    backtrack(0)
    return results


# ─── Test Cases ───
print(solve_n_queens(1))
# Expected: [['Q']]

print(solve_n_queens(4))
# Expected: 2 solutions

print(solve_n_queens(2))
# Expected: []

print(solve_n_queens(3))
# Expected: []

print(len(solve_n_queens(5)))
# Expected: 10
`,
    },
    {
      id: "combination-sum",
      slug: "combination-sum",
      title: "Combination Sum",
      content: `## Combination Sum

<!-- voice:section_check concept="Backtracking with target sum" -->

### Problem Statement

Given an array of distinct integers \`candidates\` and a target integer \`target\`, return a list of all unique combinations of \`candidates\` where the chosen numbers sum to \`target\`. You may use the same number unlimited times.

### Examples

~~~
Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]
Explanation: 2+2+3=7 and 7=7
~~~

~~~
Input: candidates = [2,3,5], target = 8
Output: [[2,2,2,2],[2,3,3],[3,5]]
~~~

### Approach

Use backtracking with these choices:
1. For each candidate, decide to include it (can reuse) or skip it
2. Track remaining target sum
3. If target reaches 0, we found a valid combination
4. If target < 0 or no more candidates, backtrack

**Key optimization:** Sort candidates and only consider candidates from current index onward (to avoid duplicates like [2,3] and [3,2]).

<!-- voice:key_insight insight="Sort first, then at each step only consider candidates from current position onward — this avoids duplicate combinations" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(k^(target/min)) where k is number of candidates
- **Space:** O(target/min) for recursion stack`,
      starterCode: `def combination_sum(candidates, target):
    """
    Return all unique combinations where numbers sum to target.
    Each number can be used unlimited times.
    
    Args:
        candidates: List of distinct integers
        target: int, target sum
    
    Returns:
        List of lists, each list is a valid combination
    
    Example:
        >>> combination_sum([2,3,6,7], 7)
        [[2, 2, 3], [7]]
        >>> combination_sum([2,3,5], 8)
        [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
    """
    # TODO: Use backtracking to find all combinations
    # Hint: Sort first, start from current index to allow reuse
    pass


# ─── Test Cases ───

# Standard case
print(combination_sum([2, 3, 6, 7], 7))
# Expected: [[2, 2, 3], [7]]

# Multiple combinations
print(combination_sum([2, 3, 5], 8))
# Expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]]

# Single element solution
print(combination_sum([2], 1))
# Expected: []

# Multiple same elements
print(combination_sum([2, 3], 6))
# Expected: [[2, 2, 2], [3, 3]]

# Large target with small candidate
print(combination_sum([1], 3))
# Expected: [[1, 1, 1]]

# No solution
print(combination_sum([4, 5], 3))
# Expected: []
`,
      solutionCode: `def combination_sum(candidates, target):
    """
    Return all unique combinations where numbers sum to target.
    
    Time Complexity: O(k^(target/min)) where k is number of candidates
    Space Complexity: O(target/min) for recursion stack
    """
    def backtrack(start, remaining, current):
        if remaining == 0:
            results.append(list(current))
            return
        
        if remaining < 0:
            return
        
        for i in range(start, len(candidates)):
            # Include candidates[i] and stay at i (can reuse)
            current.append(candidates[i])
            backtrack(i, remaining - candidates[i], current)
            current.pop()  # Backtrack
    
    candidates.sort()  # Sort to handle duplicates properly
    results = []
    backtrack(0, target, [])
    return results


# Alternative: Pre-check to avoid unnecessary recursion
def combination_sum_pruned(candidates, target):
    """
    Pruned version that stops early if candidate > remaining.
    """
    def backtrack(start, remaining, current):
        if remaining == 0:
            results.append(list(current))
            return
        
        for i in range(start, len(candidates)):
            # Pruning: stop if candidate exceeds remaining
            if candidates[i] > remaining:
                break
            
            current.append(candidates[i])
            backtrack(i, remaining - candidates[i], current)
            current.pop()
    
    candidates.sort()
    results = []
    backtrack(0, target, [])
    return results


# ─── Test Cases ───
print(combination_sum([2, 3, 6, 7], 7))
# Expected: [[2, 2, 3], [7]]

print(combination_sum([2, 3, 5], 8))
# Expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]]

print(combination_sum([2], 1))
# Expected: []

print(combination_sum([2, 3], 6))
# Expected: [[2, 2, 2], [3, 3]]

print(combination_sum([1], 3))
# Expected: [[1, 1, 1]]

print(combination_sum([4, 5], 3))
# Expected: []
`,
    },
    {
      id: "palindrome-partitioning",
      slug: "palindrome-partitioning",
      title: "Palindrome Partitioning",
      content: `## Palindrome Partitioning

<!-- voice:section_check concept="Backtracking with string partitioning" -->

### Problem Statement

Given a string \`s\`, partition \`s\` such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of \`s\`.

### Examples

~~~
Input: s = "aab"
Output: [["a","a","b"],["aa","b"]]
~~~

~~~
Input: s = "a"
Output: [["a"]]
~~~

~~~
Input: s = "racecar"
Output: Multiple solutions including ["r","a","c","e","c","a","r"], ["racecar"], etc.
~~~

### Approach

At each position, try all possible substrings starting there:
1. For position \`start\`, try ending at \`start\`, \`start+1\`, ..., \`end\`
2. If substring s[start:end+1] is a palindrome, add to current path
3. Recurse on remaining substring
4. Backtrack and try longer substring

**Palindrome check:** Two pointers comparing characters from both ends.

<!-- voice:key_insight insight="At each position, extend the substring one character at a time — if it forms a palindrome, add it and recurse on the rest" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n × 2^n) — n positions, at each we can either cut or not
- **Space:** O(n) for recursion stack and current path`,
      starterCode: `def partition_palindromes(s):
    """
    Return all possible palindrome partitioning of string s.
    
    Args:
        s: String to partition
    
    Returns:
        List of lists, each inner list is a valid palindrome partition
    
    Example:
        >>> partition_palindromes("aab")
        [['a', 'a', 'b'], ['aa', 'b']]
        >>> partition_palindromes("a")
        [['a']]
    """
    # TODO: Use backtracking to try all partitions
    # Hint: Check if substring is palindrome, if yes, recurse on rest
    pass


# ─── Test Cases ───

# Standard case
print(partition_palindromes("aab"))
# Expected: [['a', 'a', 'b'], ['aa', 'b']]

# Single character
print(partition_palindromes("a"))
# Expected: [['a']]

# All same characters
print(partition_palindromes("aaa"))
# Expected: [['a','a','a'], ['a','aa'], ['aa','a'], ['aaa']]

# No palindrome longer than 1
print(partition_palindromes("abc"))
# Expected: [['a', 'b', 'c']]

# Complex palindrome
print(partition_palindromes("racecar"))
# Should include ['racecar'] and ['r','a','c','e','c','a','r']

# Empty string
print(partition_palindromes(""))
# Expected: [[]]
`,
      solutionCode: `def partition_palindromes(s):
    """
    Return all possible palindrome partitioning of string s.
    
    Time Complexity: O(n × 2^n)
    Space Complexity: O(n) for recursion stack
    """
    def is_palindrome(start, end):
        """Check if s[start:end+1] is a palindrome."""
        while start < end:
            if s[start] != s[end]:
                return False
            start += 1
            end -= 1
        return True
    
    def backtrack(start, current):
        if start >= len(s):
            results.append(list(current))
            return
        
        for end in range(start, len(s)):
            if is_palindrome(start, end):
                current.append(s[start:end+1])
                backtrack(end + 1, current)
                current.pop()  # Backtrack
    
    results = []
    backtrack(0, [])
    return results


# Optimized with memoization
def partition_palindromes_dp(s):
    """
    Optimized using DP to precompute palindrome table.
    """
    n = len(s)
    
    # dp[i][j] = True if s[i:j+1] is palindrome
    dp = [[False] * n for _ in range(n)]
    
    # Single characters are palindromes
    for i in range(n):
        dp[i][i] = True
    
    # Fill DP table
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if length == 2:
                dp[i][j] = (s[i] == s[j])
            else:
                dp[i][j] = (s[i] == s[j] and dp[i+1][j-1])
    
    def backtrack(start, current):
        if start >= n:
            results.append(list(current))
            return
        
        for end in range(start, n):
            if dp[start][end]:
                current.append(s[start:end+1])
                backtrack(end + 1, current)
                current.pop()
    
    results = []
    backtrack(0, [])
    return results


# ─── Test Cases ───
print(partition_palindromes("aab"))
# Expected: [['a', 'a', 'b'], ['aa', 'b']]

print(partition_palindromes("a"))
# Expected: [['a']]

print(partition_palindromes("aaa"))
# Expected: 4 solutions

print(partition_palindromes("abc"))
# Expected: [['a', 'b', 'c']]

print(partition_palindromes("racecar"))
# Includes ['racecar'] and single character partition

print(partition_palindromes(""))
# Expected: [[]]
`,
    },
    {
      id: "word-search",
      slug: "word-search",
      title: "Word Search (Grid)",
      content: `## Word Search

<!-- voice:section_check concept="Backtracking on 2D grid" -->

### Problem Statement

Given an m×n grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid. The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring). The same letter cell may not be used more than once.

### Examples

~~~
Input: board = [
  ["A","B","C","E"],
  ["S","F","C","S"],
  ["A","D","E","E"]
], word = "ABCCED"
Output: true
~~~

~~~
Input: board = [
  ["A","B","C","E"],
  ["S","F","C","S"],
  ["A","D","E","E"]
], word = "SEE"
Output: true
~~~

~~~
Input: word = "ABCB"
Output: false (can't reuse 'B')
~~~

### Approach

1. Find all positions where the first character of word matches
2. From each starting position, do DFS/backtracking:
   - Match current character
   - Mark cell as visited (temporarily modify board or use visited set)
   - Recurse to 4 adjacent cells for next character
   - Unmark cell (backtrack)
3. If all characters matched, return true

<!-- voice:key_insight insight="Mark cells as visited by temporarily changing them to a special character — this saves space compared to a visited set" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(m × n × 4^L) where L is word length (4 directions at each step)
- **Space:** O(L) for recursion stack`,
      starterCode: `def exist(board, word):
    """
    Return true if word exists in the grid.
    
    Args:
        board: 2D list of characters
        word: String to search for
    
    Returns:
        bool: True if word exists in grid
    
    Example:
        >>> board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]
        >>> exist(board, "ABCCED")
        True
        >>> exist(board, "SEE")
        True
        >>> exist(board, "ABCB")
        False
    """
    # TODO: Use backtracking to search for word in grid
    # Hint: Mark visited cells by temporarily changing their value
    pass


# ─── Test Cases ───

board = [
    ["A", "B", "C", "E"],
    ["S", "F", "C", "S"],
    ["A", "D", "E", "E"]
]

# Word exists
print(exist(board, "ABCCED"))
# Expected: True

# Word exists (different path)
print(exist(board, "SEE"))
# Expected: True

# Word doesn't exist (reuse not allowed)
print(exist(board, "ABCB"))
# Expected: False

# Single cell match
print(exist([["A"]], "A"))
# Expected: True

# Single cell no match
print(exist([["A"]], "B"))
# Expected: False

# Empty word
print(exist(board, ""))
# Expected: True

# Longer word than board
print(exist([["A"]], "AB"))
# Expected: False
`,
      solutionCode: `def exist(board, word):
    """
    Return true if word exists in the grid.
    
    Time Complexity: O(m × n × 4^L) where L is word length
    Space Complexity: O(L) for recursion stack
    """
    if not board or not board[0]:
        return False
    if not word:
        return True
    
    rows, cols = len(board), len(board[0])
    
    def backtrack(r, c, index):
        # Base case: all characters matched
        if index == len(word):
            return True
        
        # Check bounds and character match
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return False
        if board[r][c] != word[index]:
            return False
        
        # Mark as visited
        temp = board[r][c]
        board[r][c] = '#'  # Use special character
        
        # Try all 4 directions
        found = (backtrack(r + 1, c, index + 1) or
                 backtrack(r - 1, c, index + 1) or
                 backtrack(r, c + 1, index + 1) or
                 backtrack(r, c - 1, index + 1))
        
        # Backtrack: restore cell
        board[r][c] = temp
        
        return found
    
    # Try starting from each cell that matches first character
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0]:
                if backtrack(r, c, 0):
                    return True
    
    return False


# Alternative with visited set
def exist_visited_set(board, word):
    """
    Alternative using explicit visited set.
    """
    if not board or not board[0]:
        return False
    
    rows, cols = len(board), len(board[0])
    visited = set()
    
    def backtrack(r, c, index):
        if index == len(word):
            return True
        if (r, c) in visited:
            return False
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return False
        if board[r][c] != word[index]:
            return False
        
        visited.add((r, c))
        
        found = (backtrack(r + 1, c, index + 1) or
                 backtrack(r - 1, c, index + 1) or
                 backtrack(r, c + 1, index + 1) or
                 backtrack(r, c - 1, index + 1))
        
        visited.remove((r, c))
        return found
    
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0]:
                if backtrack(r, c, 0):
                    return True
    
    return False


# ─── Test Cases ───
board = [
    ["A", "B", "C", "E"],
    ["S", "F", "C", "S"],
    ["A", "D", "E", "E"]
]

print(exist(board, "ABCCED"))
# Expected: True

print(exist(board, "SEE"))
# Expected: True

print(exist(board, "ABCB"))
# Expected: False

print(exist([["A"]], "A"))
# Expected: True

print(exist([["A"]], "B"))
# Expected: False

print(exist(board, ""))
# Expected: True

print(exist([["A"]], "AB"))
# Expected: False
`,
    },
    {
      id: "backtracking-checkpoint",
      slug: "backtracking-checkpoint",
      title: "Module Checkpoint: Backtracking",
      content: `## Module Checkpoint: Backtracking

<!-- voice:checkpoint_intro -->

Great work on the Backtracking module! Let's verify your understanding.

### Quick Review

You learned:
- **Backtracking template**: Choose → Explore → Unchoose
- **N-Queens**: Place one queen per row, check diagonals/columns
- **Combination Sum**: Sort and start from current index to allow reuse
- **Palindrome Partitioning**: Extend substring, check palindrome, recurse
- **Word Search**: Mark visited cells, explore 4 directions

### Quiz

**Question 1:** What is the key operation that distinguishes backtracking from regular DFS?
- A) Sorting the input
- B) Undoing the last choice (backtracking)
- C) Using a queue instead of stack
- D) Always exploring left first

**Question 2:** In N-Queens, why do we place only one queen per row?
- A) To reduce the search space
- B) Queens in same row would attack each other
- C) The problem requires it
- D) Both A and B

**Question 3:** True or False: In Combination Sum, we sort the candidates first to avoid duplicate combinations.

**Question 4:** In Word Search, what is the purpose of marking a cell with '#'?
- A) To make the board look nice
- B) To track visited cells without extra space
- C) To indicate the end of the word
- D) To sort the board

**Question 5:** What is the time complexity of backtracking solutions typically?
- A) O(n)
- B) O(n log n)
- C) Exponential (O(k^n) or similar)
- D) Constant

### Voice Summary

Your coach will ask you to:
- Explain the backtracking template (choose, explore, unchoose)
- Walk through placing queens on a 4×4 board
- Explain how to avoid duplicate combinations
- Trace through a Word Search example

**You're mastering the Backtracking pattern!**`,
    },
  ],
};
