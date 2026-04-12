import { Module } from "../types";

export const backtrackingModule: Module = {
  id: "backtracking",
  title: "Backtracking",
  description: "Master the Backtracking pattern for solving constraint satisfaction problems. Learn to explore all possible solutions systematically, prune invalid paths early, and solve complex problems like N-Queens, Combination Sum, and Word Search.",
  lessons: [
    {
      id: "backtracking-intro",
      slug: "backtracking-intro",
      title: "Introduction to Backtracking",
      content: `## The Backtracking Pattern

Imagine solving a maze. You walk down a path, hit a dead end, turn around, and try a different route. You don't restart from scratch — you back up to the last fork where you still had unexplored options. This is the essence of **backtracking**.

Backtracking is a systematic technique for solving problems by incrementally building candidates and abandoning paths that cannot lead to a valid solution. The moment a constraint is violated, the algorithm reverses the last choice and tries the next option.

\`\`\`concept
{ "title": "Backtracking = DFS + State Restoration", "variant": "mental-model", "content": "Backtracking is depth-first search on a decision tree with one critical addition: pruning. At each node you make a choice, recurse deeper, and when you return — whether you found a solution or hit a dead end — you undo that choice before trying the next one. The same mutable state object is reused throughout; restoring it after each branch is what makes the whole thing work." }
\`\`\`

<!-- voice:section_check concept="Backtracking basic concept" -->

---

## The Three-Step Rhythm

Every backtracking solution follows the same cycle:

\`\`\`steps
{ "title": "Choose → Explore → Unchoose", "steps": [ { "title": "Choose", "content": "Pick one option from the available choices at the current decision point and add it to your current state (path)." }, { "title": "Explore", "content": "Recursively continue building the solution from the updated state. This is where the DFS descends deeper into the decision tree." }, { "title": "Unchoose (Backtrack)", "content": "Undo the choice made in step 1, restoring the state to what it was before that choice. This is the defining step — it lets the same state object be reused for the next choice without allocating anything new." } ] }
\`\`\`

## The Universal Template

\`\`\`python
def backtrack(state, choices):
    if is_solution(state):           # Base case: complete valid solution
        result.append(state.copy())  # Always copy — state is mutated!
        return
    
    for choice in choices:
        if is_valid(state, choice):  # Pruning: skip impossible branches
            make_choice(state, choice)
            backtrack(new_state, new_choices)
            undo_choice(state, choice)   # Restore state — the backtrack step
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Always copy before storing", "content": "When you reach a solution, append **\`state.copy()\`** — not \`state\` itself. The state object is mutated at every step. If you store a direct reference, every entry in your results list will reflect the final (empty) state by the time execution finishes." }
\`\`\`

<!-- voice:key_insight insight="Backtracking = DFS + state restoration — explore a path, and if it fails, undo the last choice and try another" -->

---

## Tracing the Algorithm

Let's watch backtracking generate all subsets of \`[1, 2]\`. The \`path\` list is built up and torn down as the tree is explored:

\`\`\`trace
{ "title": "Generate all subsets of [1, 2]", "language": "python", "code": "def backtrack(start, path):\\n    result.append(path[:])\\n    for i in range(start, len(nums)):\\n        path.append(nums[i])\\n        backtrack(i + 1, path)\\n        path.pop()\\n\\nnums = [1, 2]\\nresult = []\\nbacktrack(0, [])", "frames": [ { "line": 2, "vars": { "start": 0, "path": "[]" }, "note": "Record [] — the empty set is always a valid subset", "stdout": "result = [[]]" }, { "line": 4, "vars": { "start": 0, "path": "[]", "i": 0 }, "note": "Loop i=0: choose nums[0]=1" }, { "line": 4, "vars": { "start": 0, "path": "[1]", "i": 0 }, "note": "Append 1 to path, then recurse with start=1" }, { "line": 2, "vars": { "start": 1, "path": "[1]" }, "note": "Record [1] as a valid subset", "stdout": "result = [[], [1]]" }, { "line": 4, "vars": { "start": 1, "path": "[1]", "i": 1 }, "note": "Loop i=1: choose nums[1]=2, append, recurse" }, { "line": 2, "vars": { "start": 2, "path": "[1, 2]" }, "note": "Record [1, 2] as a valid subset", "stdout": "result = [[], [1], [1, 2]]" }, { "line": 6, "vars": { "start": 1, "path": "[1]", "i": 1 }, "note": "Backtrack: pop 2. Path restored to [1]. Inner loop done." }, { "line": 6, "vars": { "start": 0, "path": "[]", "i": 0 }, "note": "Backtrack: pop 1. Path restored to []. Outer loop continues." }, { "line": 4, "vars": { "start": 0, "path": "[2]", "i": 1 }, "note": "Loop i=1: choose nums[1]=2, append, recurse" }, { "line": 2, "vars": { "start": 2, "path": "[2]" }, "note": "Record [2] as a valid subset", "stdout": "result = [[], [1], [1, 2], [2]]" }, { "line": 6, "vars": { "start": 0, "path": "[]", "i": 1 }, "note": "Backtrack: pop 2. All branches exhausted — done!" } ], "speed": 900 }
\`\`\`

The recursive calls form a tree. Every node is a \`backtrack()\` invocation; every edge is one choice:

\`\`\`mermaid
graph TD
    A["backtrack(0, [])
    record []"] --> B["backtrack(1, [1])
    record [1]"]
    A --> C["backtrack(2, [2])
    record [2]"]
    B --> D["backtrack(2, [1,2])
    record [1,2]"]
    style A fill:#6366f1,color:#fff
    style B fill:#6366f1,color:#fff
    style C fill:#22c55e,color:#fff
    style D fill:#22c55e,color:#fff
\`\`\`

---

## The Four Key Components

\`\`\`tabs
{ "tabs": [ { "label": "State / Path", "icon": "🗺️", "content": "**What decisions have been made so far.**\\n\\nThis is your current partial solution — often a list, grid, or string built up incrementally. After every recursive call returns, the state must look exactly as it did before that call.\\n\\n*Example in N-Queens:* the column index of the queen placed in each row so far." }, { "label": "Choices", "icon": "🔀", "content": "**What options are available at this step.**\\n\\nThe set of moves you can make from the current state. This set typically shrinks as the state grows.\\n\\n*Example in Combination Sum:* all candidates with index ≥ the current start index (to avoid reuse)." }, { "label": "Constraints", "icon": "🚧", "content": "**Rules that filter out invalid choices — the pruning logic.**\\n\\nThe earlier you apply constraints, the more subtrees you cut. Move constraint checks *before* the recursive call, not after.\\n\\n*Example in Sudoku:* a digit is invalid if it already appears in the same row, column, or 3×3 box." }, { "label": "Goal / Base Case", "icon": "🏁", "content": "**The condition that identifies a complete solution.**\\n\\nWhen the state represents a valid, complete answer, record a copy and return immediately — don't recurse further.\\n\\n*Example in Permutations:* the goal is reached when \`len(path) == len(nums)\`." } ] }
\`\`\`

---

## Pruning: The Performance Multiplier

Without pruning, backtracking is brute-force enumeration. With good pruning it becomes practical:

\`\`\`callout
{ "type": "info", "title": "Prune before recursing, not after", "content": "Check constraints *before* making the recursive call. Checking after (or only at the base case) still produces correct results but wastes time descending into branches that are already doomed.\\n\\n**Best case:** if candidates are sorted, a single \`break\` when \`candidates[i] > remaining\` skips every larger candidate in one instruction." }
\`\`\`

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "No pruning — checks after descent", "code": "def backtrack(start, path, remaining):\\n    if remaining == 0:\\n        result.append(path[:])\\n        return\\n    if remaining < 0:  # Too late — already recursed\\n        return\\n    for i in range(start, len(candidates)):\\n        path.append(candidates[i])\\n        backtrack(i, path, remaining - candidates[i])\\n        path.pop()" }, "after": { "label": "Pruning — checks before descent", "code": "def backtrack(start, path, remaining):\\n    if remaining == 0:\\n        result.append(path[:])\\n        return\\n    for i in range(start, len(candidates)):\\n        if candidates[i] > remaining:  # Prune here — sorted array\\n            break                       # All remaining are also > remaining\\n        path.append(candidates[i])\\n        backtrack(i, path, remaining - candidates[i])\\n        path.pop()" } }
\`\`\`

---

## When to Use Backtracking

Look for these signals in problem statements:

| Signal phrase | Representative problems |
|---|---|
| "Generate all combinations / permutations" | Subsets, Combination Sum, Permutations |
| "Find all valid arrangements" | N-Queens, Generate Parentheses |
| "Solve the puzzle" | Sudoku Solver, Crossword fill |
| "All paths" in grid or graph | Word Search, Rat in a Maze |
| "Partition" with constraints | Palindrome Partitioning, Restore IP Addresses |

\`\`\`callout
{ "type": "warning", "title": "Backtracking vs Dynamic Programming", "content": "Both explore subproblems recursively, but:\\n- **Backtracking** enumerates *all* valid solutions (or any one), restoring state after each branch.\\n- **Dynamic Programming** solves *overlapping* subproblems once and caches results.\\n\\nIf the problem asks to **count** or **optimize** (not enumerate), DP is likely faster. If it asks to **list** all solutions or has no overlapping substructure, reach for backtracking." }
\`\`\`

## Complexity

- **Time:** Typically O(k^n) where k is the branching factor (choices per step) and n is the solution depth. Pruning reduces constant factors dramatically but does not change the worst-case asymptotic bound.
- **Space:** O(n) on the recursion call stack (maximum depth n) plus O(n) for the current path. Result storage is additional and depends on output size.

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "In the backtracking template, why must you call \`undo_choice(state, choice)\` after the recursive call returns?", "options": [ "To free heap memory allocated during recursion", "To restore the shared state so the next loop iteration starts from the same clean baseline", "To signal to the caller that this branch failed", "To prevent the recursion from going infinitely deep" ], "answer": 1, "explanation": "Backtracking reuses a single mutable state object. After exploring one branch you undo the last choice so the *same* state can be handed to the next choice in the for loop. Without the undo, each iteration would build on the previous choice instead of branching independently from the same point." }, { "question": "You're solving Word Search: find if a target word exists in a 2-D character grid. What are the 'choices' at each backtracking step?", "options": [ "All characters in the grid", "The target word itself", "The 4 adjacent cells (up, down, left, right) from the current cell", "Whether the current cell has been visited before" ], "answer": 2, "explanation": "At each step the choices are the neighboring cells you could move to next. The current cell position and word index form the state; the constraint is that the neighbor must match the next character in the word and must not already be in the current path (no revisiting)." }, { "question": "What is pruning in backtracking, and when should it happen?", "options": [ "Removing duplicate results after all recursion completes", "Checking constraints *before* the recursive call to skip branches that cannot lead to a valid solution", "Memoizing previously computed states to avoid recomputation", "Sorting choices so the most promising one is tried first" ], "answer": 1, "explanation": "Pruning detects invalid partial states *before* descending further. Checking after recursing (or only at the base case) is correct but wasteful — you've already paid the cost of exploring a doomed branch. Checking before, especially with a sorted candidate list that allows an early \`break\`, can cut exponential work to something practical." }, { "question": "Generating all permutations of n distinct elements has what worst-case time complexity?", "options": [ "O(n²)", "O(2^n)", "O(n! × n)", "O(n log n)" ], "answer": 2, "explanation": "There are n! permutations and copying each one into results costs O(n), giving O(n! × n). The decision tree's branching factor starts at n, then n−1, then n−2, … which multiplies out to n!. This is why backtracking is practical only when good pruning cuts the actual search space far below the worst-case bound." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Backtracking is DFS on a decision tree: Choose → Explore → Unchoose. The undo step is what separates it from plain recursion.", "Every backtracking problem has four components: state (partial solution), choices (available moves), constraints (what to prune), and goal (base case).", "Prune *before* recursing — checking constraints early avoids descending into entire subtrees that cannot yield valid solutions.", "Time complexity is typically O(k^n) in the worst case; pruning reduces constants dramatically but not the asymptotic bound.", "Spot backtracking problems by these keywords: 'all combinations', 'all permutations', 'all valid arrangements', 'all paths', 'solve the puzzle'." ] }
\`\`\``,
    },
    {
      id: "n-queens",
      slug: "n-queens",
      title: "N-Queens Problem",
      content: `## N-Queens Problem

\`\`\`concept
{ "title": "Row-by-Row DFS on a Decision Tree", "variant": "mental-model", "content": "Assign one queen per row — this eliminates same-row conflicts by design. At each row, try every column. If placing a queen would share a column or diagonal with an earlier queen, skip it immediately. If no column works, backtrack to the previous row and try its next option. You are doing depth-first search on a tree of partial board configurations, pruning entire subtrees the moment a constraint is violated." }
\`\`\`

Place N queens on an N×N chessboard so that no two queens threaten each other. Queens attack along rows, columns, and both diagonals. The key structural observation: **exactly one queen must occupy each row**, so the problem reduces to assigning a safe column to each row in sequence.

**Example (n = 4):** Two distinct solutions exist.

\`\`\`
Solution 1     Solution 2
. Q . .        . . Q .
. . . Q        Q . . .
Q . . .        . . . Q
. . Q .        . Q . .
\`\`\`

\`\`\`algoviz
{
  "title": "4-Queens: Tracing the Backtracking Search",
  "type": "grid",
  "data": [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
  "frames": [
    { "highlight": [], "label": "Empty 4×4 board — place queens one row at a time", "stats": { "row": 0, "placed": 0 } },
    { "highlight": [1], "label": "Row 0: place queen at col 1 ✓", "stats": { "row": 0, "col": 1, "placed": 1 } },
    { "highlight": [1, 4], "label": "Row 1, col 0: anti-diagonal conflict with (0,1) — SKIP", "stats": { "row": 1, "col": 0, "status": "conflict" } },
    { "highlight": [1, 6], "label": "Row 1, col 2: diagonal conflict with (0,1) — SKIP", "stats": { "row": 1, "col": 2, "status": "conflict" } },
    { "highlight": [1, 7], "label": "Row 1: col 3 is safe — place queen ✓", "stats": { "row": 1, "col": 3, "placed": 2 } },
    { "highlight": [1, 7, 8], "label": "Row 2: col 0 is safe — place queen ✓", "stats": { "row": 2, "col": 0, "placed": 3 } },
    { "highlight": [1, 7, 8, 14], "label": "Row 3: col 2 is safe — SOLUTION FOUND!", "stats": { "row": 3, "col": 2, "placed": 4, "solutions": 1 } }
  ],
  "speed": 900
}
\`\`\`

---

### The Three Conflict Conditions

For any candidate **(row, col)**, check three independent invariants before placing:

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Same Column",
      "icon": "↕",
      "content": "Two queens conflict if they have the **same \`col\` value**.\\n\\nTrack occupied columns in a set: \`cols\`.\\n\\n**Check:** \`col in cols\`\\n\\n**Example:** queens at (0,2) and (3,2) both occupy column 2."
    },
    {
      "label": "Main Diagonal ↘",
      "icon": "↘",
      "content": "Queens on the same **top-left → bottom-right diagonal** share the same value of \`row − col\`.\\n\\nTrack in set: \`diags\`.\\n\\n**Check:** \`(row - col) in diags\`\\n\\n**Example:** (0,1) gives key **−1**. (2,3) also gives **−1** — conflict!"
    },
    {
      "label": "Anti-Diagonal ↙",
      "icon": "↙",
      "content": "Queens on the same **top-right → bottom-left diagonal** share the same value of \`row + col\`.\\n\\nTrack in set: \`anti_diags\`.\\n\\n**Check:** \`(row + col) in anti_diags\`\\n\\n**Example:** (0,3) gives key **3**. (2,1) also gives **3** — conflict!"
    }
  ]
}
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "O(1) Safety Check with Three Sets", "content": "Scanning the board for conflicts costs O(n) per candidate. Using three hash sets — one per constraint type — reduces each check to O(1). Add values when placing a queen, remove them when backtracking." }
\`\`\`

---

### Algorithm Walkthrough

\`\`\`steps
{
  "title": "N-Queens Backtracking",
  "steps": [
    { "title": "Base Case", "content": "If \`row == n\`, all n queens have been placed without conflict. Convert the 2D board to a list of strings and append to \`results\`." },
    { "title": "Try Each Column", "content": "Iterate \`col\` from 0 to n−1. Skip immediately if \`col in cols\`, or \`(row−col) in diags\`, or \`(row+col) in anti_diags\`." },
    { "title": "Place the Queen", "content": "Set \`board[row][col] = 'Q'\`. Add \`col\` → \`cols\`, \`row−col\` → \`diags\`, \`row+col\` → \`anti_diags\`." },
    { "title": "Recurse", "content": "Call \`backtrack(row + 1)\`. This explores every valid configuration that extends the current partial board." },
    { "title": "Undo — Critical Step", "content": "After the recursive call returns, reset \`board[row][col] = '.'\` and remove \`col\`, \`row−col\`, and \`row+col\` from their respective sets. This restores the state for the next candidate column in the loop." }
  ]
}
\`\`\`

---

### Naive vs. Optimised Safety Check

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naive: O(n) board scan per candidate",
    "code": "def is_safe(board, row, col, n):\\n    # Check column above\\n    for i in range(row):\\n        if board[i][col] == 'Q':\\n            return False\\n    # Check upper-left diagonal\\n    i, j = row - 1, col - 1\\n    while i >= 0 and j >= 0:\\n        if board[i][j] == 'Q':\\n            return False\\n        i -= 1; j -= 1\\n    # Check upper-right diagonal\\n    i, j = row - 1, col + 1\\n    while i >= 0 and j < n:\\n        if board[i][j] == 'Q':\\n            return False\\n        i -= 1; j += 1\\n    return True"
  },
  "after": {
    "label": "Optimal: O(1) check with hash sets",
    "code": "# Initialise once outside backtrack:\\n# cols, diags, anti_diags = set(), set(), set()\\n\\ndef backtrack(row):\\n    if row == n:\\n        results.append([''.join(r) for r in board])\\n        return\\n    for col in range(n):\\n        if col in cols or (row-col) in diags or (row+col) in anti_diags:\\n            continue          # O(1) — no scanning\\n        # Place\\n        cols.add(col)\\n        diags.add(row - col)\\n        anti_diags.add(row + col)\\n        board[row][col] = 'Q'\\n        backtrack(row + 1)\\n        # Undo — restore all three sets\\n        board[row][col] = '.'\\n        cols.remove(col)\\n        diags.remove(row - col)\\n        anti_diags.remove(row + col)"
  }
}
\`\`\`

\`\`\`playground
{
  "title": "N-Queens Solver — try n = 1, 4, 5, 6",
  "language": "python",
  "code": "def solve_n_queens(n):\\n    results = []\\n    cols, diags, anti_diags = set(), set(), set()\\n    board = [['.' ] * n for _ in range(n)]\\n\\n    def backtrack(row):\\n        if row == n:\\n            results.append([''.join(r) for r in board])\\n            return\\n        for col in range(n):\\n            if col in cols or (row - col) in diags or (row + col) in anti_diags:\\n                continue\\n            cols.add(col)\\n            diags.add(row - col)\\n            anti_diags.add(row + col)\\n            board[row][col] = 'Q'\\n            backtrack(row + 1)\\n            board[row][col] = '.'\\n            cols.remove(col)\\n            diags.remove(row - col)\\n            anti_diags.remove(row + col)\\n\\n    backtrack(0)\\n    return results\\n\\nn = 4\\nsolutions = solve_n_queens(n)\\nprint(str(len(solutions)) + ' solution(s) for n=' + str(n))\\nfor s in solutions:\\n    for row in s:\\n        print(row)\\n    print()",
  "runnable": true
}
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "The Undo Step Is Non-Negotiable", "content": "Forgetting to remove values from the conflict sets means decisions from one branch leak into sibling branches. Your safety check silently rejects valid placements, producing wrong or incomplete results. Always restore all three sets after every recursive call." }
\`\`\`

---

### Complexity

| | Bound | Reasoning |
|---|---|---|
| **Time** | O(n!) | n choices for row 0, ≤ n−1 for row 1 (one column blocked), and so on. Diagonal pruning reduces practical runtime significantly. |
| **Space** | O(n²) | O(n²) for the board + O(n) for the three sets + O(n) recursion stack depth |

\`\`\`collapse
{ "title": "Deep Dive: How Many Solutions Exist?", "content": "The number of distinct N-Queens solutions grows rapidly with n:\\n\\n| n | Solutions |\\n|---|---|\\n| 1 | 1 |\\n| 4 | 2 |\\n| 5 | 10 |\\n| 6 | 4 |\\n| 8 | 92 |\\n| 10 | 724 |\\n\\nNote n=6 has fewer solutions than n=5 — the growth is irregular, not monotone. For n=1 the trivial single-cell solution is valid. The OEIS sequence A000170 tracks these counts. For interview purposes, knowing n=4 yields 2 and n=8 yields 92 is a useful sanity-check." }
\`\`\`

---

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Why does the N-Queens algorithm fix exactly one queen per row, rather than freely exploring all (row, col) positions?",
      "options": [
        "Rows are easier to iterate than columns in most languages",
        "Since no two queens can share a row and there are n queens and n rows, exactly one queen per row is structurally required — this eliminates an entire dimension of conflicts before any search begins",
        "The chessboard is square, so rows and columns are interchangeable",
        "Iterating by row avoids the need for a visited array"
      ],
      "answer": 1,
      "explanation": "n queens on an n×n board with no two sharing a row means exactly one queen per row by the pigeonhole principle. Committing to this structure reduces each decision from O(n²) board positions down to O(n) column choices, drastically shrinking the search tree."
    },
    {
      "question": "Queens are at positions (1, 4) and (3, 6). Which conflict set detects their attack?",
      "options": [
        "cols — both share column 4",
        "anti_diags — row + col = 5 for (1,4) and 9 for (3,6), so no conflict there",
        "diags — row − col = −3 for (1,4) and −3 for (3,6), so they share a main diagonal",
        "No conflict — they are on different rows, columns, and diagonals"
      ],
      "answer": 2,
      "explanation": "(1,4): row − col = 1 − 4 = −3. (3,6): row − col = 3 − 6 = −3. Both queens share diagonal key −3, meaning they lie on the same top-left → bottom-right diagonal and attack each other. The anti-diagonal keys (5 vs 9) and columns (4 vs 6) are different."
    },
    {
      "question": "After a recursive call to backtrack(row + 1) returns, which of the following correctly describes what must be undone?",
      "options": [
        "Only board[row][col] needs to be reset to '.'",
        "Only the cols set needs to be updated — diagonals are recalculated on every call",
        "board[row][col] must be reset AND col, (row−col), and (row+col) must each be removed from their respective sets",
        "Nothing — the recursive call restores its own state before returning"
      ],
      "answer": 2,
      "explanation": "Placing a queen at (row, col) modifies four pieces of state: board[row][col], cols, diags, and anti_diags. All four must be undone. The recursive call only manages state for rows > current row — it never touches the current row's placements."
    },
    {
      "question": "What is the worst-case time complexity of the N-Queens backtracking algorithm?",
      "options": [
        "O(n²) — one pass per cell of the n×n board",
        "O(2ⁿ) — each cell is either occupied or empty",
        "O(n!) — up to n column choices per row, cascading across n rows",
        "O(n³) — three constraint checks multiplied by n rows and n columns"
      ],
      "answer": 2,
      "explanation": "Row 0 has n column candidates, row 1 has at most n−1 (one column is occupied), row 2 has at most n−2, and so on — yielding O(n × (n−1) × (n−2) × … × 1) = O(n!). Diagonal pruning reduces average-case runtime well below this bound, but n! is the theoretical upper limit."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Fix one queen per row — this structural constraint eliminates row conflicts before the search begins and reduces the branching factor from O(n²) to O(n) per step.",
    "Three O(1) hash sets replace O(n) board scans: track col for column conflicts, (row−col) for main-diagonal conflicts, and (row+col) for anti-diagonal conflicts.",
    "The undo phase must remove all three set entries AND reset the board cell — forgetting any one of them corrupts the constraint state for sibling branches.",
    "Time complexity is O(n!); space is O(n²) for the board plus O(n) for the sets and recursion stack.",
    "N-Queens is the canonical constraint-placement backtracking template — the same place → recurse → undo skeleton applies directly to Sudoku Solver, Word Search, and Knight's Tour."
  ]
}
\`\`\``,
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

Combination Sum is a pure backtracking problem: no greedy shortcut exists, and dynamic programming can tell you *whether* a combination exists but not enumerate them all. You need to **systematically explore** every candidate, decide to include or skip it, and undo that decision when the path fails.

\`\`\`concept
{ "title": "The Choose-Explore-Unchoose Loop", "variant": "mental-model", "content": "Every backtracking solution follows three steps in a tight loop:\\n\\n1. **Choose** — pick a candidate and add it to your current path\\n2. **Explore** — recurse deeper with the updated state\\n3. **Unchoose** — remove the candidate and restore state before trying the next option\\n\\nThe *unchoose* step is what people forget. Without it, decisions from one branch contaminate every branch that follows — and you get silently wrong output that passes some tests." }
\`\`\`

### Problem Statement

Given an array of **distinct** integers \`candidates\` and a target integer \`target\`, return all unique combinations where the chosen numbers sum to \`target\`. The **same number may be used unlimited times**.

| Input | Output |
|-------|--------|
| \`candidates = [2,3,6,7], target = 7\` | \`[[2,2,3],[7]]\` |
| \`candidates = [2,3,5], target = 8\` | \`[[2,2,2,2],[2,3,3],[3,5]]\` |

### Building the Algorithm

\`\`\`steps
{ "title": "Combination Sum: Backtracking Blueprint", "steps": [ { "title": "Sort the candidates first", "content": "Sorting enables a critical pruning optimization: when \`candidates[i] > remaining\`, every subsequent candidate is also too large. A single \`break\` exits the loop entirely — eliminating entire subtrees of the search.\\n\\n\`\`\`python\\ncandidates.sort()  # O(k log k), worth it\\n\`\`\`" }, { "title": "Define the recursive state", "content": "The backtracking function carries three pieces of state:\\n- \`start\` — the index to begin from (prevents duplicates like \`[2,3]\` and \`[3,2]\`)\\n- \`path\` — the current combination being built\\n- \`remaining\` — how much more sum we need\\n\\n\`\`\`python\\ndef backtrack(start, path, remaining):\\n\`\`\`" }, { "title": "Base case: success", "content": "When \`remaining == 0\`, the current path sums exactly to target. **Snapshot** it and return — do not store a reference to \`path\` directly.\\n\\n\`\`\`python\\nif remaining == 0:\\n    result.append(list(path))  # list() creates a snapshot copy!\\n    return\\n\`\`\`" }, { "title": "Choose, explore, unchoose", "content": "Iterate from \`start\` onward. Pass \`i\` (not \`i+1\`) to allow reuse of the same element:\\n\\n\`\`\`python\\nfor i in range(start, len(candidates)):\\n    if candidates[i] > remaining:\\n        break                                  # prune!\\n    path.append(candidates[i])                # choose\\n    backtrack(i, path, remaining - candidates[i])  # explore (i, not i+1)\\n    path.pop()                                # unchoose\\n\`\`\`" } ] }
\`\`\`

### Execution Trace: \`candidates = [2,3,6,7], target = 7\`

\`\`\`trace
{ "title": "Combination Sum — Step-by-Step Execution", "language": "python", "code": "def combinationSum(candidates, target):\\n    candidates.sort()\\n    result = []\\n    def backtrack(start, path, remaining):\\n        if remaining == 0:\\n            result.append(list(path))\\n            return\\n        for i in range(start, len(candidates)):\\n            if candidates[i] > remaining:\\n                break\\n            path.append(candidates[i])\\n            backtrack(i, path, remaining - candidates[i])\\n            path.pop()\\n    backtrack(0, [], target)\\n    return result", "frames": [ { "line": 2, "vars": { "candidates": "[2,3,6,7]", "target": 7 }, "note": "Sort candidates — enables break (not just continue) when any candidate exceeds remaining" }, { "line": 14, "vars": { "start": 0, "path": "[]", "remaining": 7 }, "note": "Initial call: try all combinations from index 0 that sum to 7" }, { "line": 11, "vars": { "i": 0, "path": "[]", "remaining": 7 }, "note": "candidates[0]=2 ≤ 7 → choose 2. Recurse with same start=0 (reuse allowed!)" }, { "line": 11, "vars": { "i": 0, "path": "[2]", "remaining": 5 }, "note": "candidates[0]=2 ≤ 5 → choose 2 again. Building [2,2]." }, { "line": 11, "vars": { "i": 1, "path": "[2,2]", "remaining": 3 }, "note": "candidates[1]=3 ≤ 3 → choose 3. Building [2,2,3]." }, { "line": 5, "vars": { "path": "[2,2,3]", "remaining": 0 }, "note": "remaining == 0 ✓  Snapshot [2,2,3] and return.", "stdout": "result = [[2,2,3]]" }, { "line": 13, "vars": { "path": "[2,2]", "remaining": 3 }, "note": "Unchoose: path.pop() removes 3. Restored to [2,2], try next candidate." }, { "line": 9, "vars": { "i": 2, "path": "[2,2]", "remaining": 3 }, "note": "candidates[2]=6 > remaining=3 → BREAK. Entire tail pruned (6 and 7 both too large)." }, { "line": 11, "vars": { "i": 3, "path": "[]", "remaining": 7 }, "note": "After exhausting paths starting with 2 and 3, reach candidates[3]=7." }, { "line": 5, "vars": { "path": "[7]", "remaining": 0 }, "note": "remaining == 0 ✓  Snapshot [7] and return. Search complete.", "stdout": "result = [[2,2,3],[7]]" } ], "speed": 900 }
\`\`\`

### The Critical Bug: Forgetting to Unchoose

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Broken — choices leak across branches", "code": "def backtrack(start, path, remaining):\\n    if remaining == 0:\\n        result.append(list(path))\\n        return\\n    for i in range(start, len(candidates)):\\n        if candidates[i] > remaining:\\n            break\\n        path.append(candidates[i])\\n        backtrack(i, path, remaining - candidates[i])\\n        # BUG: path.pop() is missing!\\n        # Choices from one branch bleed into the next" }, "after": { "label": "Correct — clean state restoration", "code": "def backtrack(start, path, remaining):\\n    if remaining == 0:\\n        result.append(list(path))\\n        return\\n    for i in range(start, len(candidates)):\\n        if candidates[i] > remaining:\\n            break\\n        path.append(candidates[i])                 # choose\\n        backtrack(i, path, remaining - candidates[i])  # explore\\n        path.pop()                                  # unchoose ← required!" } }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Always snapshot with list(path) — never store a reference", "content": "Notice \`result.append(list(path))\` — not \`result.append(path)\`. The \`path\` list is mutated (appended and popped) throughout every recursive call. Storing a reference means all your results point to the **same object**, which will be empty by the time the function returns. \`list(path)\` creates an independent copy at that exact moment." }
\`\`\`

### Reuse vs No-Reuse vs Permutations

\`\`\`tabs
{ "tabs": [ { "label": "Combination Sum (reuse)", "icon": "♻️", "content": "Pass \`i\` to allow choosing the same candidate again on the next level:\\n\\n\`\`\`python\\nbacktrack(i, path, remaining - candidates[i])\\n\`\`\`\\n\\nThis is how \`[2,2,3]\` is built — candidate \`2\` at index 0 is chosen three times in a row." }, { "label": "Combination Sum II (no reuse)", "icon": "1️⃣", "content": "Pass \`i + 1\` to prevent reusing the same index. When the input contains duplicates, also skip repeated values in the loop:\\n\\n\`\`\`python\\nfor i in range(start, len(candidates)):\\n    if i > start and candidates[i] == candidates[i-1]:\\n        continue  # skip duplicate at same depth\\n    path.append(candidates[i])\\n    backtrack(i + 1, path, remaining - candidates[i])  # i+1, not i\\n    path.pop()\\n\`\`\`" }, { "label": "Permutations (order matters)", "icon": "🔀", "content": "Always start the inner loop from index 0, but track which indices are in use:\\n\\n\`\`\`python\\nfor i in range(len(candidates)):\\n    if used[i]: continue\\n    used[i] = True\\n    path.append(candidates[i])\\n    backtrack(path, used)\\n    path.pop()\\n    used[i] = False\\n\`\`\`\\n\\n\`[2,3]\` and \`[3,2]\` are distinct permutations — both are valid outputs." } ] }
\`\`\`

### Complexity

| | Analysis |
|---|---|
| **Time** | O(k^(T/m)) — k candidates, T = target, m = minimum candidate |
| **Space** | O(T/m) — maximum recursion depth is target ÷ smallest candidate |

The sort step is O(k log k) but dominated entirely by the backtracking cost. In practice, the \`break\` pruning means most subtrees are never visited — the actual runtime is far better than the theoretical worst case.

\`\`\`quiz
{ "title": "Combination Sum — Comprehension Check", "questions": [ { "question": "Why does the recursive call use \`backtrack(i, path, ...)\` instead of \`backtrack(i + 1, path, ...)\`?", "options": [ "Passing i allows the same candidate to be chosen again (reuse)", "It avoids an off-by-one error in the loop bounds", "It is needed to handle empty candidates arrays", "The start index tracks which element was last removed" ], "answer": 0, "explanation": "Passing \`i\` allows the recursion to choose \`candidates[i]\` again on the next level, enabling combinations like [2,2,3]. Passing \`i+1\` would mean each candidate could appear at most once — that is the Combination Sum II variant." }, { "question": "What happens if you remove \`path.pop()\` from the backtracking function?", "options": [ "The function throws an IndexError", "Earlier choices persist into later branches, corrupting all subsequent results", "The function runs faster but misses some combinations", "Only the first valid combination is returned" ], "answer": 1, "explanation": "Without \`path.pop()\`, the choices you made exploring one branch remain in \`path\` when the loop moves to the next candidate. The state is never restored, so each new branch starts from an already-polluted path and produces nonsense results." }, { "question": "Why does sorting candidates allow us to use \`break\` instead of \`continue\` for pruning?", "options": [ "Sorted arrays allow binary search for the remaining target", "In a sorted array, if candidates[i] > remaining, all subsequent candidates are also > remaining", "Sorting ensures candidates[0] is always the optimal first choice", "break and continue are equivalent in Python for loops" ], "answer": 1, "explanation": "If candidates are sorted in ascending order and \`candidates[i] > remaining\`, then \`candidates[i+1]\`, \`candidates[i+2]\`, etc. are all at least as large. None of them can work, so \`break\` exits the loop entirely. Without sorting, only \`continue\` (skip this one) would be safe." }, { "question": "For \`candidates = [2,3,6,7], target = 7\`, in what order does the algorithm discover the two solutions?", "options": [ "[7] is found first because 7 is a single-element solution", "[2,2,3] is found first because the algorithm explores depth-first from the smallest candidate", "Both are found simultaneously on separate recursive branches", "The order depends on whether candidates are sorted" ], "answer": 1, "explanation": "The algorithm explores depth-first, always trying the smallest remaining candidate first. It dives into the [2,2,2,...] branch immediately, finds [2,2,3] when remaining hits 0, then backtracks all the way up before eventually trying 7." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Every backtracking solution follows Choose → Explore → Unchoose. The path.pop() is not optional — missing it silently corrupts all future branches.", "Pass \`i\` to allow reuse of the same element; pass \`i+1\` to prevent it. This single change is the entire difference between Combination Sum I and II.", "Sort candidates first so that \`break\` (not just \`continue\`) can prune entire subtrees when a candidate exceeds the remaining target.", "Always snapshot with \`list(path)\` when adding to results — the path is mutated throughout and a raw reference will point to an empty list when the algorithm finishes.", "Time complexity is O(k^(T/m)) — exponential in theory, but sorting + break pruning eliminates most branches in practice." ] }
\`\`\``,
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

Given a string \`s\`, partition it such that **every substring in the partition is a palindrome**. Return all possible palindrome partitionings.

| Input | Output |
|-------|--------|
| \`"aab"\` | \`[["a","a","b"], ["aa","b"]]\` |
| \`"a"\` | \`[["a"]]\` |
| \`"racecar"\` | \`[["r","a","c","e","c","a","r"], ["racecar"], ...]\` |

Notice that \`"ab"\` never appears in any valid partition — because it is not a palindrome. The algorithm must prune such substrings early instead of going down dead-end paths.

\`\`\`concept
{ "title": "The Partition Decision Tree", "variant": "mental-model", "content": "Stand at index \`start\`. Your choice: where does the next palindromic slice end? Try \`end = start\`, then \`start+1\`, then \`start+2\`, and so on. Each time \`s[start..end]\` is a palindrome, you commit to that slice, add it to your path, and recurse from \`end+1\`. When \`start\` reaches the end of the string, your path is a complete valid partition — record it. Then **backtrack** (pop the slice) and try the next possible end. The tree has at most 2^n leaves (cut or don't at each gap), but non-palindrome branches are pruned immediately — this is what makes the search tractable." }
\`\`\`

### Approach: Choose → Explore → Unchoose

At every recursive call \`dfs(start)\`, loop over all possible ending positions \`end\`. If \`s[start:end+1]\` is a palindrome:

1. **Choose** — append the slice to \`path\`
2. **Explore** — recurse with \`dfs(end + 1)\`
3. **Unchoose** — \`path.pop()\` to restore state for the next candidate

The \`path.pop()\` step is what makes backtracking work. Without it, one branch's choices bleed into the next branch and every result is corrupted.

A key optimisation is to **precompute** a 2D boolean table \`dp[i][j]\` (True if \`s[i..j]\` is a palindrome) in O(n²) before starting the DFS. This converts each palindrome check from O(n) to O(1), amortised across the exponential number of branches.

\`\`\`algoviz
{ "title": "Tracing partition(\\"aab\\")", "type": "array", "data": ["a", "a", "b"], "frames": [ { "highlight": [0], "label": "dfs(0): try s[0:1]='a' — palindrome ✓. path=['a']", "stats": {"start": 0, "end": 0, "path": "['a']"} }, { "highlight": [1], "label": "dfs(1): try s[1:2]='a' — palindrome ✓. path=['a','a']", "stats": {"start": 1, "end": 1, "path": "['a','a']"} }, { "highlight": [2], "label": "dfs(2): try s[2:3]='b' — palindrome ✓. path=['a','a','b']", "stats": {"start": 2, "end": 2, "path": "['a','a','b']"} }, { "highlight": [0, 1, 2], "label": "dfs(3): start==n → record ['a','a','b'] ✓. Backtrack.", "stats": {"start": 3, "end": 3, "path": "RECORDED"} }, { "highlight": [1, 2], "label": "dfs(1): try s[1:3]='ab' — NOT palindrome ✗. Skip.", "stats": {"start": 1, "end": 2, "path": "['a']"} }, { "highlight": [0], "label": "Backtrack to dfs(0): pop 'a'. Try next end.", "stats": {"start": 0, "end": 0, "path": "[]"} }, { "highlight": [0, 1], "label": "dfs(0): try s[0:2]='aa' — palindrome ✓. path=['aa']", "stats": {"start": 0, "end": 1, "path": "['aa']"} }, { "highlight": [2], "label": "dfs(2): try s[2:3]='b' — palindrome ✓. Record ['aa','b'] ✓. Backtrack.", "stats": {"start": 2, "end": 2, "path": "RECORDED"} }, { "highlight": [0, 1, 2], "label": "dfs(0): try s[0:3]='aab' — NOT palindrome ✗. All branches exhausted.", "stats": {"start": 0, "end": 2, "path": "[]"} } ], "speed": 900 }
\`\`\`

### The Palindrome Precomputation Trick

The naive approach re-checks each substring from scratch during the DFS. Because the DFS visits exponentially many nodes, this repeated O(n) work adds up. The standard optimisation is to build the palindrome table once before the search begins.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Naive: O(n) palindrome check per DFS node", "code": "def is_palindrome(s, l, r):\\n    while l < r:\\n        if s[l] != s[r]:\\n            return False\\n        l += 1\\n        r -= 1\\n    return True\\n\\ndef dfs(start):\\n    for end in range(start, n):\\n        # Repeated O(n) work inside an exponential tree\\n        if is_palindrome(s, start, end):\\n            path.append(s[start:end + 1])\\n            dfs(end + 1)\\n            path.pop()" }, "after": { "label": "Optimised: O(n²) precompute → O(1) lookup per node", "code": "# Build table once before DFS — O(n^2) time and space\\ndp = [[True] * n for _ in range(n)]\\nfor i in range(n - 1, -1, -1):\\n    for j in range(i + 1, n):\\n        dp[i][j] = (s[i] == s[j]) and dp[i + 1][j - 1]\\n\\ndef dfs(start):\\n    for end in range(start, n):\\n        if dp[start][end]:   # O(1) — result already computed\\n            path.append(s[start:end + 1])\\n            dfs(end + 1)\\n            path.pop()" } }
\`\`\`

The recurrence \`dp[i][j] = (s[i] == s[j]) and dp[i+1][j-1]\` says: the full string is a palindrome if and only if the outer characters match **and** the inner substring is also a palindrome. Iterating \`i\` from \`n-1\` down to \`0\` ensures \`dp[i+1][j-1]\` is always ready before \`dp[i][j]\` needs it.

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`playground
{ "title": "Palindrome Partitioning — Full Solution", "language": "python", "code": "def partition(s):\\n    result = []\\n    n = len(s)\\n\\n    # Precompute palindrome table: dp[i][j] = True if s[i..j] is palindrome\\n    dp = [[True] * n for _ in range(n)]\\n    for i in range(n - 1, -1, -1):\\n        for j in range(i + 1, n):\\n            dp[i][j] = (s[i] == s[j]) and dp[i + 1][j - 1]\\n\\n    path = []\\n\\n    def dfs(start):\\n        if start == n:             # full string consumed — valid partition\\n            result.append(path[:])\\n            return\\n        for end in range(start, n):\\n            if dp[start][end]:     # O(1) palindrome check\\n                path.append(s[start:end + 1])\\n                dfs(end + 1)\\n                path.pop()         # backtrack — restore state\\n\\n    dfs(0)\\n    return result\\n\\nprint(partition('aab'))      # [['a', 'a', 'b'], ['aa', 'b']]\\nprint(partition('a'))        # [['a']]\\nprint(partition('racecar'))  # includes ['racecar'] and single-char split", "runnable": true }
\`\`\`

### Complexity

- **Time:** O(n × 2^n) — at most 2^n partition choices; recording each valid partition costs O(n) to copy the path
- **Space:** O(n²) for the DP table, plus O(n) for the recursion stack and current path

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "For input \\"aab\\", how many valid palindrome partitions does the function return?", "options": ["1 — only [\\"aab\\"] since the whole string isn't a palindrome anyway", "2 — [\\"a\\",\\"a\\",\\"b\\"] and [\\"aa\\",\\"b\\"]", "3 — includes [\\"a\\",\\"ab\\"] as well", "4 — every single-character arrangement counts separately"], "answer": 1, "explanation": "\\"aab\\" itself is not a palindrome so it cannot be a partition slice. The only valid partitions are [\\"a\\",\\"a\\",\\"b\\"] (three single-char palindromes) and [\\"aa\\",\\"b\\"] (\\"aa\\" is a palindrome, \\"b\\" is a palindrome). \\"ab\\" is not a palindrome so it is pruned immediately." }, { "question": "What happens if you remove the path.pop() call after the recursive dfs(end+1)?", "options": ["The recursion terminates correctly but returns duplicates", "The function raises an IndexError", "Slices from one branch leak into sibling branches, corrupting every subsequent result", "Only the last valid partition is recorded"], "answer": 2, "explanation": "path.pop() is the 'unchoose' step that restores shared mutable state after each recursive call. Without it, a slice appended for one DFS branch stays in path when the next branch starts — every subsequent partition accumulates invalid leftover slices." }, { "question": "In the DP recurrence dp[i][j] = (s[i]==s[j]) and dp[i+1][j-1], why must we iterate i from n-1 down to 0?", "options": ["To avoid division-by-zero in the index arithmetic", "Because dp[i][j] depends on dp[i+1][j-1], which must be filled before row i is processed", "To process longer substrings before shorter ones", "To match the DFS traversal direction"], "answer": 1, "explanation": "dp[i][j] reads from dp[i+1][j-1] — a row with a larger i index. By filling i from n-1 to 0, row i+1 is fully computed before row i needs it, guaranteeing correct dependency order." }, { "question": "What is the overall time complexity of the optimised solution?", "options": ["O(n²) — dominated by the DP precomputation", "O(2^n) — dominated by the number of partitions", "O(n × 2^n) — backtracking with O(n) path copy per leaf", "O(n³) — three nested loops"], "answer": 2, "explanation": "There are at most 2^n leaf nodes in the backtracking tree (cut or don't at each character gap). At each leaf, copying the path into results costs O(n). The DP precompute is O(n²) — dominated by the O(n × 2^n) backtracking phase." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "At each index, try every possible palindromic slice as the next partition — this forms a backtracking tree with at most 2^n leaves, pruning non-palindrome branches early.", "Precompute dp[i][j] in O(n²) before the DFS so each palindrome check costs O(1) instead of O(n) — this is the standard interview-level optimisation.", "The backtrack step (path.pop()) is not optional — it restores shared mutable state so each sibling branch starts from a clean slate.", "Overall complexity: O(n × 2^n) time, O(n²) space for the DP table plus O(n) for the recursion stack." ] }
\`\`\``,
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

Given an \`m×n\` grid of characters and a target \`word\`, return \`true\` if the word exists as a connected path through horizontally or vertically adjacent cells, without reusing the same cell twice.

This is the canonical backtracking problem on a 2D grid. The search space is every possible starting cell × every possible path — backtracking lets you prune dead ends the instant a character doesn't match.

\`\`\`concept
{ "title": "Mark, Explore, Restore", "variant": "mental-model", "content": "Backtracking on a grid follows three steps at every cell:\\n\\n1. **Mark** the cell visited (prevent revisiting it on *this* path)\\n2. **Explore** all 4 neighbors recursively\\n3. **Restore** the cell after — whether the recursion succeeded or failed\\n\\nThe restore step is what makes backtracking correct: it undoes the mark so that other starting positions can reuse this cell in a completely different path." }
\`\`\`

### Problem Walkthrough

**Board used throughout this lesson:**

\`\`\`
A  B  C  E
S  F  C  S
A  D  E  E
\`\`\`

- \`"ABCCED"\` → **true** — path \`(0,0)→(0,1)→(0,2)→(1,2)→(2,2)→(2,1)\`
- \`"SEE"\` → **true** — path \`(1,3)→(2,3)→(2,2)\`
- \`"ABCB"\` → **false** — would require reusing \`B\` at \`(0,1)\`

\`\`\`steps
{ "title": "DFS + Backtrack — Step by Step", "steps": [ { "title": "Scan for valid starting cells", "content": "Iterate every \`(i, j)\`. When \`board[i][j] == word[0]\`, launch a DFS from that cell. If any DFS returns \`true\`, short-circuit and return \`true\` immediately." }, { "title": "Guard: bounds + character match + not visited", "content": "At each recursive call with index \`k\`, check three things before continuing:\\n- \`(i, j)\` is within bounds\\n- \`board[i][j] == word[k]\`\\n- Cell hasn't been marked \`'#'\` on this path\\n\\nAny failure → return \`False\` immediately (pruning the branch)." }, { "title": "Mark the cell visited", "content": "Temporarily overwrite \`board[i][j]\` with the sentinel \`'#'\`. This is cheaper than a separate visited set — \`O(1)\` space per step instead of \`O(m×n)\`." }, { "title": "Recurse into 4 directions", "content": "Try \`(i+1,j)\`, \`(i-1,j)\`, \`(i,j+1)\`, \`(i,j-1)\` for index \`k+1\`. Chain them with \`or\` so the search short-circuits as soon as any direction finds the complete word." }, { "title": "Restore the cell (backtrack)", "content": "After the recursive call returns — success or failure — write the original character back: \`board[i][j] = temp\`. This is the backtrack. Other DFS paths starting elsewhere can now use this cell." }, { "title": "Base case: word fully matched", "content": "When \`k == len(word)\`, every character was matched in order. Return \`True\` immediately — the path is valid and complete." } ] }
\`\`\`

### Visualizing "SEE" on the Grid

\`\`\`algoviz
{ "title": "Tracing 'SEE' — DFS + Backtrack", "type": "grid", "data": [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "frames": [ { "highlight": [], "label": "Scan board for first char 'S'. Checking each cell left→right, top→bottom.", "stats": { "k": 0, "looking_for": "S" } }, { "highlight": [4], "label": "(1,0)='S' matches word[0]. Launch DFS — but neighbors don't continue 'E'. Dead end, restore.", "stats": { "k": 0, "cell": "(1,0)", "match": "S" } }, { "highlight": [7], "label": "(1,3)='S' matches word[0]. Mark '#'. Launch DFS for word[1]='E'.", "stats": { "k": 0, "cell": "(1,3)", "match": "S" } }, { "highlight": [7, 11], "label": "DFS(2,3,1): 'E' == word[1]. Mark '#'. Now seek word[2]='E'.", "stats": { "k": 1, "cell": "(2,3)", "match": "E" } }, { "highlight": [7, 11, 10], "label": "DFS(2,2,2): 'E' == word[2]. k=3 == len('SEE') → return True! Path found.", "stats": { "k": 2, "cell": "(2,2)", "match": "E", "result": "FOUND" } } ], "speed": 950 }
\`\`\`

### Python Implementation

\`\`\`playground
{ "title": "Word Search — Python", "language": "python", "code": "def exist(board, word):\\n    m, n = len(board), len(board[0])\\n\\n    def dfs(i, j, k):\\n        # Base case: all characters matched\\n        if k == len(word):\\n            return True\\n        # Prune: out of bounds, mismatch, or visited\\n        if i < 0 or i >= m or j < 0 or j >= n:\\n            return False\\n        if board[i][j] != word[k]:\\n            return False\\n\\n        # Mark visited with sentinel\\n        temp = board[i][j]\\n        board[i][j] = '#'\\n\\n        # Explore 4 directions\\n        found = (\\n            dfs(i + 1, j, k + 1) or\\n            dfs(i - 1, j, k + 1) or\\n            dfs(i, j + 1, k + 1) or\\n            dfs(i, j - 1, k + 1)\\n        )\\n\\n        # Restore (backtrack)\\n        board[i][j] = temp\\n        return found\\n\\n    return any(dfs(i, j, 0) for i in range(m) for j in range(n))\\n\\n\\nboard = [\\n    ['A','B','C','E'],\\n    ['S','F','C','S'],\\n    ['A','D','E','E']\\n]\\nprint(exist(board, 'ABCCED'))  # True\\nprint(exist(board, 'SEE'))     # True\\nprint(exist(board, 'ABCB'))    # False", "runnable": true }
\`\`\`

### In-Place Sentinel vs. Separate Visited Set

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Separate visited set — O(m×n) extra space", "code": "visited = set()\\n\\ndef dfs(i, j, k):\\n    if (i, j) in visited:\\n        return False\\n    visited.add((i, j))\\n\\n    # ... explore neighbors ...\\n\\n    visited.remove((i, j))  # backtrack\\n    return found" }, "after": { "label": "In-place sentinel — O(1) extra space per step", "code": "def dfs(i, j, k):\\n    temp = board[i][j]\\n    board[i][j] = '#'      # mark visited\\n\\n    # ... explore neighbors ...\\n\\n    board[i][j] = temp     # restore (backtrack)\\n    return found" } }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "The in-place trick mutates the input", "content": "If the caller expects the board unchanged after the call (e.g., in a multi-threaded context or when reusing the board across multiple queries), use a separate \`visited\` set instead. In an interview, mention this trade-off — interviewers often ask about it explicitly." }
\`\`\`

### Complexity

| | Complexity | Reason |
|---|---|---|
| **Time** | O(m × n × 4^L) | Up to m×n starting cells; each DFS branch has ≤4 choices per step over L steps |
| **Space** | O(L) | Recursion stack depth equals the word length |

\`\`\`collapse
{ "title": "Deep Dive: Why 4^L overstates the true cost", "content": "The real branching factor per step is closer to **3**, not 4. Once you enter cell \`(i,j)\` from a neighbor, that neighbor is marked \`'#'\`. So you can only continue in at most **3** new directions, not 4. The true worst-case is approximately **O(m × n × 3^L)** — still exponential, but meaningfully tighter. The 4^L figure is the theoretical ceiling assuming every neighbor is always available, which the sentinel marking prevents." }
\`\`\`

\`\`\`quiz
{ "title": "Word Search — Check Your Understanding", "questions": [ { "question": "What is the sole purpose of setting \`board[i][j] = '#'\` before the recursive call?", "options": [ "To signal that this cell is part of the final answer path", "To prevent the current DFS path from revisiting this cell", "To block all future DFS calls from every starting cell from using this cell", "To improve memory cache locality during recursion" ], "answer": 1, "explanation": "The sentinel marks the cell as visited *only for the current DFS path*. After the recursive call returns, the cell is restored — so other DFS paths (from different starting positions) can freely use it." }, { "question": "The board is 3×4 and the target word has length 6. What is the worst-case time complexity?", "options": [ "O(3 × 4 × 6)", "O(3 × 4 × 4^6)", "O(4^6)", "O(3 × 4 + 4^6)" ], "answer": 1, "explanation": "The formula is O(m × n × 4^L). Here m=3, n=4, L=6, giving O(12 × 4096). There are up to m×n starting positions, and each DFS can branch 4 ways at each of L depth levels." }, { "question": "What happens when \`board[i][j] != word[k]\` inside the DFS?", "options": [ "The cell is marked '#' and exploration continues to neighbors", "False is returned immediately, pruning the entire subtree rooted here", "The algorithm tries the remaining 3 directions before returning", "The outer loop moves on to the next starting cell" ], "answer": 1, "explanation": "A character mismatch is a constraint violation. Returning False immediately prunes every sub-path that would have started from this mismatch — this is the core efficiency gain of backtracking over naive exhaustive search." }, { "question": "You search for 'ABCCED' and it is found. After \`exist()\` returns True, what state is the board in?", "options": [ "Cells along the found path permanently contain '#'", "The board is identical to its state before the call", "Only the last matched cell retains '#'", "The board state is undefined — it depends on call order" ], "answer": 1, "explanation": "Every DFS call restores its cell before returning — including the calls that returned True. The restore step runs unconditionally after the recursive call, so the board is always left exactly as it was before \`exist()\` was called." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Word Search is DFS + backtracking: scan for word[0], recurse in 4 directions, prune on mismatch or out-of-bounds.", "The in-place sentinel ('\\\\#') marks cells visited for the current path and costs O(1) extra space — versus O(m×n) for a separate set.", "Always restore the cell after recursion (the backtrack step) — even on the success path — to avoid corrupting the board for other callers.", "Time complexity is O(m × n × 4^L); the practical branching factor is ~3 because the incoming direction is always already marked.", "The base case \`k == len(word)\` fires *after* the last character matches — check the index, not the character, at the top of DFS." ] }
\`\`\``,
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

You've worked through the full Backtracking pattern — from N-Queens to Word Search. This checkpoint verifies that the *why* behind each technique is as solid as the *how*.

\`\`\`concept
{
  "title": "The Backtracking Template",
  "variant": "mental-model",
  "content": "Every backtracking solution follows three steps, applied recursively:\\n\\n**Choose** — pick a candidate and add it to your current path.\\n\\n**Explore** — recurse deeper with that choice in place.\\n\\n**Unchoose** — remove the choice (restore state) before trying the next candidate.\\n\\nThe \`unchoose\` step is the one people forget — and it's the one that makes backtracking work. Without it, one branch's decisions leak into the next and corrupt future paths. When reviewing backtracking code, always check: *is state properly restored after each recursive call?*"
}
\`\`\`

### Problem-by-Problem Review

\`\`\`tabs
{
  "tabs": [
    {
      "label": "N-Queens",
      "icon": "♛",
      "content": "**Key insight:** Two queens in the same row always attack each other, so we place exactly one queen per row. This collapses the search space from O(n²) placements to O(n) per step.\\n\\n**Conflict check (O(1)):** Track three sets — \`cols\`, \`diag\` (row−col), \`anti\` (row+col). All cells on the same diagonal share the same row−col value; all cells on the same anti-diagonal share the same row+col value.\\n\\n**Pruning impact:** For n=8, brute force explores 40,320 permutations. Backtracking with hash sets visits ~15,720 nodes — a 61% reduction.\\n\\n\`\`\`python\\ndef backtrack(row):\\n    if row == n:\\n        result.append(snapshot(board))\\n        return\\n    for col in range(n):\\n        if col in cols or (row-col) in diag or (row+col) in anti:\\n            continue\\n        board[row][col] = 'Q'          # Choose\\n        cols.add(col); diag.add(row-col); anti.add(row+col)\\n        backtrack(row + 1)             # Explore\\n        board[row][col] = '.'          # Unchoose\\n        cols.discard(col); diag.discard(row-col); anti.discard(row+col)\\n\`\`\`"
    },
    {
      "label": "Combination Sum",
      "icon": "∑",
      "content": "**Key insight:** Sort candidates first, then recurse starting from the *current index* (not 0). This allows reuse of the same element while guaranteeing each combination is generated in non-decreasing order — no duplicates.\\n\\n**Sorting enables break-pruning:** Because the array is sorted, if \`candidates[i] > remaining\`, all subsequent candidates are also too large — so we \`break\` (not \`continue\`) and prune the entire remaining subtree.\\n\\n\`\`\`python\\ndef backtrack(start, path, remaining):\\n    if remaining == 0:\\n        result.append(path[:])\\n        return\\n    for i in range(start, len(candidates)):\\n        if candidates[i] > remaining:  # prune entire subtree\\n            break\\n        path.append(candidates[i])     # Choose\\n        backtrack(i, path, remaining - candidates[i])  # Explore (i, not i+1)\\n        path.pop()                     # Unchoose\\n\`\`\`"
    },
    {
      "label": "Palindrome Partitioning",
      "icon": "🔁",
      "content": "**Key insight:** At each position, try every possible end index for the current substring. If it's a palindrome, recurse on the remainder. The partition grows one valid slice at a time.\\n\\n**Two-pointer palindrome check** (O(length)):\\n\`\`\`python\\ndef is_palindrome(s, l, r):\\n    while l < r:\\n        if s[l] != s[r]: return False\\n        l += 1; r -= 1\\n    return True\\n\`\`\`\\n\\n**Template mapping:**\\n- **Choose:** extend \`end\` pointer to candidate substring \`s[start:end+1]\`\\n- **Explore:** if palindrome, recurse from \`end+1\`\\n- **Unchoose:** \`path.pop()\` before trying next \`end\`\\n\\nThis generates *all* valid partitions — not just one."
    },
    {
      "label": "Word Search",
      "icon": "🔍",
      "content": "**Key insight:** Mark visited cells in-place with \`'#'\` during the choose step — this prevents revisiting the same cell in the current path without allocating a separate \`visited\` matrix. Restore the original character during unchoose.\\n\\n\`\`\`python\\ndef dfs(i, j, k):\\n    if k == len(word): return True\\n    if not (0 <= i < rows and 0 <= j < cols): return False\\n    if board[i][j] != word[k]: return False\\n\\n    tmp = board[i][j]\\n    board[i][j] = '#'               # Choose (mark visited)\\n    found = (dfs(i+1,j,k+1) or dfs(i-1,j,k+1) or\\n             dfs(i,j+1,k+1) or dfs(i,j-1,k+1))\\n    board[i][j] = tmp               # Unchoose (restore)\\n    return found\\n\`\`\`\\n\\n\`'#'\` works as a sentinel because it won't match any letter in \`word\`, so any path that tries to revisit the cell automatically fails the \`board[i][j] != word[k]\` check."
    }
  ]
}
\`\`\`

### Visualizing 4-Queens: Backtracking in Action

\`\`\`algoviz
{
  "title": "4-Queens — Row-by-Row Placement with Backtracking",
  "type": "grid",
  "data": [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  "frames": [
    {
      "highlight": [],
      "label": "Empty 4×4 board. We place one queen per row, checking cols + diagonals.",
      "stats": { "row": 0, "queens": 0 }
    },
    {
      "highlight": [1],
      "label": "Row 0, col 1 — no conflicts. Choose: place queen. cols={1}, diag={-1}, anti={1}",
      "stats": { "row": 0, "col": 1, "queens": 1 }
    },
    {
      "highlight": [1, 7],
      "label": "Row 1, col 3 — col 0 blocked by anti-diag, col 2 blocked by diag. Col 3 is valid.",
      "stats": { "row": 1, "col": 3, "queens": 2 }
    },
    {
      "highlight": [1, 7, 8],
      "label": "Row 2, col 0 — no conflicts with existing queens. Place queen.",
      "stats": { "row": 2, "col": 0, "queens": 3 }
    },
    {
      "highlight": [1, 7, 8, 14],
      "label": "Row 3, col 2 — valid! All 4 queens placed without conflict. Solution found.",
      "stats": { "row": 3, "col": 2, "queens": 4 }
    },
    {
      "highlight": [1, 7, 8],
      "label": "Unchoose: remove queen from (3,2). Try remaining columns in row 3...",
      "stats": { "row": 3, "backtrack": true, "queens": 3 }
    },
    {
      "highlight": [1, 7],
      "label": "No valid columns remain in row 3. Backtrack to row 2, unchoose (2,0). Continue search.",
      "stats": { "row": 2, "backtrack": true, "queens": 2 }
    }
  ],
  "speed": 900
}
\`\`\`

### Knowledge Check

\`\`\`quiz
{
  "title": "Backtracking Module Quiz",
  "questions": [
    {
      "question": "What is the key operation that distinguishes backtracking from plain DFS?",
      "options": [
        "Sorting the input before recursing",
        "Undoing the last choice after each recursive call",
        "Using a queue instead of the call stack",
        "Always exploring the leftmost branch first"
      ],
      "answer": 1,
      "explanation": "The 'unchoose' (state restoration) step is what makes backtracking work. Without it, one branch's decisions leak into the next. When reviewing any backtracking solution, this is the first thing to verify: does state get properly restored after each recursive call?"
    },
    {
      "question": "In N-Queens, why do we place exactly one queen per row?",
      "options": [
        "To reduce the search space — it limits candidate placements per step",
        "Queens in the same row always attack each other",
        "The problem constraints explicitly require it",
        "Both A and B — same-row queens conflict AND it prunes O(n²) placements down to O(n)"
      ],
      "answer": 3,
      "explanation": "Both reasons apply simultaneously. Two queens in the same row always attack each other (making any such placement invalid), AND restricting to one queen per row collapses the candidate space from O(n²) to O(n) per recursive call — a major pruning win before we even apply column/diagonal checks."
    },
    {
      "question": "In Combination Sum, why is sorting the candidates array useful?",
      "options": [
        "Sorting prevents duplicate candidates from appearing in results",
        "Sorted arrays are faster to index into",
        "It enables break-pruning: if candidates[i] > remaining, all subsequent candidates are also too large",
        "It has no real effect — sorting is purely cosmetic"
      ],
      "answer": 2,
      "explanation": "Sorting enables \`if candidates[i] > remaining: break\` — because the array is sorted, once one candidate exceeds what's left, every subsequent candidate will too. We can break the entire loop and prune the rest of the subtree, not just skip one element with \`continue\`."
    },
    {
      "question": "In Word Search, what is the purpose of setting board[i][j] = '#' during DFS?",
      "options": [
        "To mark the path taken for visual debugging output",
        "To track the current cell as visited without allocating a separate visited matrix",
        "To signal the last matched character in the target word",
        "To indicate cells that are permanently blocked"
      ],
      "answer": 1,
      "explanation": "'#' acts as an in-place sentinel. It prevents re-visiting the same cell in the current path (satisfying the 'each cell used at most once' constraint) while costing zero extra space. The original value is restored during the unchoose step, so other paths can still use this cell."
    },
    {
      "question": "What is the typical time complexity class of backtracking solutions?",
      "options": [
        "O(n) — linear in input size",
        "O(n log n) — same as comparison-based sorting",
        "Exponential — O(kⁿ) or O(n!) depending on branching factor",
        "O(1) — pruning makes the actual work constant"
      ],
      "answer": 2,
      "explanation": "Backtracking explores an exponential decision tree. Typical complexities are O(n!) for permutations, O(2ⁿ) for subsets, and O(kⁿ) for k choices per step. Pruning reduces the constant factor dramatically — sometimes by orders of magnitude — but doesn't change the worst-case complexity class."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The backtracking template is always Choose → Explore → Unchoose. The unchoose step is the one people miss — and the one that breaks everything when absent.",
    "Pruning is what separates backtracking from brute-force DFS. Detect constraint violations early and skip entire subtrees rather than just individual candidates.",
    "N-Queens: one queen per row + three O(1) hash sets (cols, diagonals, anti-diagonals) reduces n=8 search from 40,320 to ~15,720 nodes.",
    "Combination Sum: sort first to enable break-pruning; recurse from the current index (not 0) to allow reuse without duplicates.",
    "Word Search: overwrite cells with '#' in-place as a zero-cost visited tracker; restore during unchoose so other paths remain unaffected.",
    "Recognition signal: if the problem asks for 'all valid combinations/arrangements/solutions' with constraints that can eliminate branches early — reach for backtracking."
  ]
}
\`\`\``,
    },
  ],
};
