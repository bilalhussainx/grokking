import { Module } from "../types";

export const subsetsModule: Module = {
  id: "subsets",
  title: "Subsets",
  description: "Master the Subsets pattern for generating combinations, permutations, and subsets using BFS/DFS. Essential for problems involving combinations, permutations, and exploring all possible configurations.",
  lessons: [
    {
      id: "subsets-intro",
      slug: "subsets-intro",
      title: "Introduction to Subsets",
      content: `## The Subsets Pattern

The **Subsets** pattern solves a whole family of problems: generate all subsets, all combinations of size k, all permutations, and every other "explore all configurations" challenge. Two roads lead there — **BFS (iterative)** and **DFS/backtracking (recursive)** — and knowing both gives you flexibility on interview day.

\`\`\`concept
{ "title": "The Core Mental Model", "variant": "mental-model", "content": "Every element in your input poses a binary choice: **include it** or **exclude it**. If you have n elements, you have 2^n possible answers (the power set). Both BFS and DFS are just different ways of systematically making those binary choices without missing any." }
\`\`\`

### Why This Pattern Comes Up So Often

Any problem phrased as "find all ___" where the blank involves a subset of your input is a candidate:

- All subsets / power set
- All combinations that sum to a target
- All permutations of a string
- All valid bracket strings
- String permutations by swapping case

\`\`\`callout
{ "type": "info", "title": "Interview Signal", "content": "The moment you see **'all possible'**, **'every combination'**, or **'enumerate'** in a problem, reach for the Subsets pattern. The question is just whether you need BFS (iterative) or DFS (backtracking)." }
\`\`\`

---

## Two Approaches, One Idea

\`\`\`tabs
{
  "tabs": [
    {
      "label": "BFS — Iterative",
      "icon": "🌊",
      "content": "**Start with one empty subset, then grow it layer by layer.**\\n\\nFor each new number, take every subset that already exists and create a new copy with the number appended.\\n\\n\`\`\`python\\ndef subsets_bfs(nums):\\n    result = [[]]          # seed: the empty subset\\n    for num in nums:\\n        n = len(result)\\n        for i in range(n):     # only iterate over existing subsets\\n            result.append(result[i] + [num])\\n    return result\\n\`\`\`\\n\\n**Why \`range(n)\` and not \`range(len(result))\`?** You capture \`len(result)\` *before* the inner loop runs so you don't iterate over subsets you're adding in the same pass.\\n\\n**Trace on \`[1, 2, 3]\`:**\\n\\n| After processing | result |\\n|---|---|\\n| (start) | \`[[]]\` |\\n| 1 | \`[[], [1]]\` |\\n| 2 | \`[[], [1], [2], [1,2]]\` |\\n| 3 | \`[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]\` |"
    },
    {
      "label": "DFS — Backtracking",
      "icon": "🌳",
      "content": "**Explore one path fully, then undo the last choice and try another.**\\n\\nAt each call, snapshot the current subset, then extend it one element at a time.\\n\\n\`\`\`python\\ndef subsets_dfs(nums):\\n    result = []\\n\\n    def backtrack(start, current):\\n        result.append(list(current))   # snapshot\\n        for i in range(start, len(nums)):\\n            current.append(nums[i])    # choose\\n            backtrack(i + 1, current)  # explore\\n            current.pop()              # un-choose\\n\\n    backtrack(0, [])\\n    return result\\n\`\`\`\\n\\n**The \`list(current)\` copy is critical.** If you append \`current\` directly you'll capture a reference that mutates as recursion unwinds — a classic Python gotcha.\\n\\n**DFS call tree on \`[1, 2, 3]\`:**\\n\`\`\`\\nbacktrack(0, [])\\n  → append [] → choose 1 → backtrack(1, [1])\\n      → append [1] → choose 2 → backtrack(2, [1,2])\\n          → append [1,2] → choose 3 → backtrack(3, [1,2,3])\\n              → append [1,2,3] (leaf)\\n          → pop 3\\n          → (end of loop)\\n      → pop 2 → choose 3 → backtrack(3, [1,3])\\n          → append [1,3] (leaf)\\n      → pop 3\\n  → pop 1 → choose 2 → ... (continues)\\n\`\`\`"
    },
    {
      "label": "When to Use Each",
      "icon": "⚖️",
      "content": "| Situation | Prefer |\\n|---|---|\\n| You need *all* subsets / power set | Either (BFS is slightly more readable) |\\n| Combination sum (add constraints mid-path) | **DFS** — prune early |\\n| Permutations (order matters) | **DFS** — need \`visited\` array |\\n| Duplicates in input | **DFS** — sort first, skip consecutive dupes |\\n| You want to process subsets level by level | **BFS** |\\n\\n**Rule of thumb:** If you need to prune branches (\\"stop if sum > target\\"), DFS is cleaner. If you just need the full power set, BFS is just as good and often easier to explain in an interview."
    }
  ]
}
\`\`\`

---

## Visualizing BFS Growth

Watch how every new element exactly doubles the current result set:

\`\`\`algoviz
{
  "title": "BFS Subset Expansion — nums = [1, 2, 3]",
  "type": "array",
  "data": [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]],
  "frames": [
    { "highlight": [0], "label": "Start: only the empty subset", "stats": { "num": "—", "subsets": 1 } },
    { "highlight": [0, 1], "label": "Process 1 → copy [] → append 1 → get [1]", "stats": { "num": 1, "subsets": 2 } },
    { "highlight": [0, 1, 2, 3], "label": "Process 2 → copy [], [1] → get [2], [1,2]", "stats": { "num": 2, "subsets": 4 } },
    { "highlight": [0, 1, 2, 3, 4, 5, 6, 7], "label": "Process 3 → copy all 4 → get [3],[1,3],[2,3],[1,2,3]", "stats": { "num": 3, "subsets": 8 } }
  ],
  "speed": 900
}
\`\`\`

\`\`\`concept
{ "title": "The Doubling Law", "variant": "insight", "content": "Each element processed by BFS exactly doubles the result set — every existing subset is copied and extended. After n elements you have 2^n subsets. This is why both time and space complexity are O(2^n)." }
\`\`\`

---

## Complexity

| | Subsets | Permutations |
|---|---|---|
| **Time** | O(2ⁿ) — 2ⁿ subsets, each copied in O(n) | O(n! × n) — n! permutations, each O(n) to build |
| **Space** | O(2ⁿ) to store output | O(n!) to store output |
| **Recursion depth** | O(n) | O(n) |

\`\`\`callout
{ "type": "warning", "title": "These complexities are unavoidable", "content": "O(2^n) and O(n!) are not inefficiencies in your algorithm — they're lower bounds dictated by the *size of the output*. You literally cannot do better because you have to produce all 2^n (or n!) results. The goal is to avoid doing *extra* work beyond that bound." }
\`\`\`

---

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "You call subsets_bfs([1, 2, 3]). How many subsets does it return?",
      "options": ["3", "6", "8", "9"],
      "answer": 2,
      "explanation": "For n=3 elements, BFS produces 2^3 = 8 subsets: [], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]."
    },
    {
      "question": "In the DFS backtracking template, why do we write \`result.append(list(current))\` instead of \`result.append(current)\`?",
      "options": [
        "list() is faster than direct append",
        "current is a generator, not a list",
        "Without copying, all appended references point to the same mutating list",
        "list() deduplicates elements before appending"
      ],
      "answer": 2,
      "explanation": "current is mutated throughout the recursion (elements are appended and popped). Appending the reference directly means every entry in result points to the same object, which ends up empty after all backtracking unwinds. list(current) takes a snapshot at that moment in time."
    },
    {
      "question": "In the BFS approach, why does the inner loop use \`for i in range(n)\` (where n = len(result) captured before the loop) rather than \`for i in range(len(result))\`?",
      "options": [
        "range(n) is O(1) while range(len(result)) is O(n)",
        "To avoid iterating over subsets added during the current pass",
        "len(result) raises an error inside a for-loop",
        "Both are equivalent — it's just a style preference"
      ],
      "answer": 1,
      "explanation": "If you used range(len(result)) you'd keep iterating as new subsets are appended inside the loop, causing infinite growth. Capturing n first freezes the boundary: only process subsets that existed before this element was considered."
    },
    {
      "question": "Which approach handles 'combination sum' problems (where you stop exploring if the running sum exceeds the target) more naturally?",
      "options": [
        "BFS, because it builds subsets level by level",
        "DFS/backtracking, because you can prune branches mid-recursion",
        "Both are equally suitable",
        "Neither — you need dynamic programming for that"
      ],
      "answer": 1,
      "explanation": "DFS lets you check a condition at each recursive call and return early (prune) before the subtree is fully explored. BFS generates complete subsets before you can evaluate them, making early termination impossible."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Every element presents a binary include/exclude choice — the power set has exactly 2^n elements for an n-element input.",
    "BFS (iterative): seed with [[]], then for each number copy every existing subset and append the number. Capture len(result) before the inner loop to avoid runaway growth.",
    "DFS (backtracking): snapshot current at each call, then choose/recurse/un-choose for each remaining element. Always copy the list on append.",
    "Use DFS when you need pruning (combination sum, duplicates) or order matters (permutations). BFS is fine for plain power-set generation.",
    "O(2^n) time and space for subsets, O(n! × n) for permutations — these are output-size lower bounds, not algorithmic inefficiencies."
  ]
}
\`\`\``,
    },
    {
      id: "generate-all-subsets",
      slug: "generate-all-subsets",
      title: "Generate All Subsets",
      content: `## Generate All Subsets

<!-- voice:section_check concept="BFS/DFS for subset generation" -->

### Problem Statement

Given a set of **distinct integers**, return all possible subsets — the **power set**.

**Constraint:** The solution set must not contain duplicate subsets.

| Input | Output |
|-------|--------|
| \`[1, 2, 3]\` | \`[[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]\` |
| \`[0]\` | \`[[], [0]]\` |

---

\`\`\`concept
{ "title": "The Binary Choice Mental Model", "variant": "mental-model", "content": "For every element in the input, you face exactly one binary decision: **include it** or **exclude it** from the current subset. With n elements and 2 choices per element, the total number of subsets is always **2ⁿ**. Visualize a binary decision tree with depth n — each root-to-leaf path represents one complete subset, and each leaf holds one answer." }
\`\`\`

---

### Approach 1 — BFS (Iterative)

Start with \`result = [[]]\`. For each number, snapshot the current list and append that number to every existing subset, then extend \`result\` with those new subsets.

Each pass through the loop **doubles** the result size: 1 → 2 → 4 → 8 subsets.

\`\`\`steps
{ "title": "BFS Walkthrough: [1, 2, 3]", "steps": [ { "title": "Initialize", "content": "Start with one empty subset:\\n\\n\`result = [[]]\`\\n\\n1 subset total." }, { "title": "Process element 1", "content": "Snapshot existing subsets: \`[[]]\`\\n\\nAppend 1 to each snapshot subset:\\n- \`[]\` → \`[1]\`\\n\\n\`result = [[], [1]]\` — **2 subsets**" }, { "title": "Process element 2", "content": "Snapshot existing subsets: \`[[], [1]]\`\\n\\nAppend 2 to each:\\n- \`[]\` → \`[2]\`\\n- \`[1]\` → \`[1, 2]\`\\n\\n\`result = [[], [1], [2], [1, 2]]\` — **4 subsets**" }, { "title": "Process element 3", "content": "Snapshot existing subsets: \`[[], [1], [2], [1, 2]]\`\\n\\nAppend 3 to each:\\n- \`[]\` → \`[3]\`\\n- \`[1]\` → \`[1, 3]\`\\n- \`[2]\` → \`[2, 3]\`\\n- \`[1, 2]\` → \`[1, 2, 3]\`\\n\\n\`result = [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]\` — **8 subsets**" } ] }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Snapshot the length before the inner loop", "content": "Without capturing \`n = len(result)\` before iterating, the loop processes newly appended subsets mid-pass — each number gets added multiple times and duplicates appear. Always iterate over indices \`0..n-1\` from the snapshot, not the live length." }
\`\`\`

---

### Approach 2 — DFS (Backtracking)

At each index, make the **exclude** choice (recurse without modifying \`current\`), then the **include** choice (append, recurse, pop). Reaching the end of the array is the base case — record the snapshot.

\`\`\`trace
{ "title": "DFS Trace: subsets([1, 2])", "language": "python", "code": "nums = [1, 2]\\nresult = []\\ncurrent = []\\n\\ndef backtrack(i):\\n    if i == len(nums):\\n        result.append(current[:])\\n        return\\n    # Exclude nums[i]\\n    backtrack(i + 1)\\n    # Include nums[i]\\n    current.append(nums[i])\\n    backtrack(i + 1)\\n    current.pop()\\n\\nbacktrack(0)", "frames": [ { "line": 5, "vars": { "i": 0, "current": "[]", "result": "[]" }, "note": "Enter backtrack(0). i < len(nums), so not the base case. Two choices for nums[0]=1." }, { "line": 9, "vars": { "i": 0, "current": "[]", "result": "[]" }, "note": "EXCLUDE 1: recurse without touching current." }, { "line": 5, "vars": { "i": 1, "current": "[]", "result": "[]" }, "note": "Enter backtrack(1). Two choices for nums[1]=2." }, { "line": 9, "vars": { "i": 1, "current": "[]", "result": "[]" }, "note": "EXCLUDE 2: recurse." }, { "line": 6, "vars": { "i": 2, "current": "[]", "result": "[]" }, "note": "Base case! i == len(nums). Snapshot current and record it." }, { "line": 7, "vars": { "i": 2, "current": "[]", "result": "[[]]" }, "note": "Appended [] — the all-exclude path." }, { "line": 11, "vars": { "i": 1, "current": "[2]", "result": "[[]]" }, "note": "Back at i=1. INCLUDE 2: append 2, recurse." }, { "line": 7, "vars": { "i": 2, "current": "[2]", "result": "[[], [2]]" }, "note": "Base case: record [2]. Then pop 2 — current restored to []." }, { "line": 11, "vars": { "i": 0, "current": "[1]", "result": "[[], [2]]" }, "note": "Back at i=0. INCLUDE 1: append 1, recurse into backtrack(1)." }, { "line": 9, "vars": { "i": 1, "current": "[1]", "result": "[[], [2]]" }, "note": "At i=1 again. EXCLUDE 2: recurse." }, { "line": 7, "vars": { "i": 2, "current": "[1]", "result": "[[], [2], [1]]" }, "note": "Base case: record [1]." }, { "line": 11, "vars": { "i": 1, "current": "[1, 2]", "result": "[[], [2], [1]]" }, "note": "INCLUDE 2: append 2, recurse." }, { "line": 7, "vars": { "i": 2, "current": "[1, 2]", "result": "[[], [2], [1], [1, 2]]" }, "note": "Base case: record [1,2]. All 2² = 4 subsets found. Pop restores state." } ], "speed": 900 }
\`\`\`

---

### BFS vs DFS — Side by Side

\`\`\`compare
{ "variant": "before-after", "before": { "label": "BFS — Iterative", "code": "def subsets_bfs(nums):\\n    result = [[]]\\n    for num in nums:\\n        n = len(result)      # snapshot!\\n        for i in range(n):\\n            result.append(result[i] + [num])\\n    return result" }, "after": { "label": "DFS — Backtracking", "code": "def subsets_dfs(nums):\\n    result = []\\n    current = []\\n\\n    def backtrack(i):\\n        if i == len(nums):\\n            result.append(current[:])\\n            return\\n        backtrack(i + 1)          # exclude\\n        current.append(nums[i])\\n        backtrack(i + 1)          # include\\n        current.pop()             # undo\\n\\n    backtrack(0)\\n    return result" } }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Which approach to learn first?", "content": "**BFS** is simpler to code under pressure and easier to trace on paper — great for the basic subset problem. **DFS backtracking** is more powerful: it extends directly to Subsets II (with duplicates), Combination Sum, Permutations, and Palindrome Partitioning. Learn BFS to understand the doubling pattern; master DFS for interview flexibility." }
\`\`\`

---

### Complexity

Both approaches must build every subset, so neither can do better than the size of the output itself.

| | Time | Space |
|---|---|---|
| BFS | O(n × 2ⁿ) | O(n × 2ⁿ) |
| DFS | O(n × 2ⁿ) | O(n × 2ⁿ) output + O(n) call stack |

There are 2ⁿ subsets, each up to length n, so storing them all requires **O(n × 2ⁿ)**. The DFS recursion adds O(n) stack depth but that is dominated by the output size.

<!-- voice:key_insight insight="Each element doubles the result size — for n elements, there are 2^n subsets" -->

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "How many subsets does the input [1, 2, 3, 4] produce?", "options": ["8", "12", "16", "24"], "answer": 2, "explanation": "With n = 4 distinct elements, the power set has 2⁴ = 16 subsets. Each element independently doubles the count: 1 → 2 → 4 → 8 → 16." }, { "question": "In BFS, why must you snapshot \`n = len(result)\` before the inner loop?", "options": ["To avoid an index out of bounds error", "To prevent the loop from processing newly appended subsets in the same iteration", "To improve time complexity from O(n²) to O(n)", "To ensure subsets are returned in sorted order"], "answer": 1, "explanation": "Without snapshotting, the loop also processes the new subsets being appended mid-pass, causing each number to be added multiple times and introducing duplicates." }, { "question": "In DFS backtracking, what does \`current.pop()\` accomplish?", "options": ["It removes the element permanently from nums", "It undoes the include decision so the next branch starts with a clean current", "It marks the current index as visited", "It signals the base case has been reached"], "answer": 1, "explanation": "Backtracking requires undoing the last choice before exploring a sibling branch. After recursing with nums[i] included, pop() restores \`current\` to its pre-include state. Without this, every later subset would wrongly carry earlier elements." }, { "question": "What is the exact time complexity of generating all subsets?", "options": ["O(2ⁿ)", "O(n × 2ⁿ)", "O(n²)", "O(n!)"], "answer": 1, "explanation": "There are 2ⁿ subsets and each requires O(n) work to copy into the result (average subset length is n/2, worst case n). This gives O(n × 2ⁿ). Merely counting subsets would be O(2ⁿ), but building and storing them costs the extra factor of n." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "For n distinct elements, there are exactly 2ⁿ subsets — one per binary include/exclude decision sequence.", "BFS iteratively doubles the result set for each new element by snapshotting the list size before each inner loop.", "DFS backtracking explores an implicit binary decision tree; always pop() after the include-branch to restore shared state.", "Both approaches have O(n × 2ⁿ) time and space — this is unavoidable since the output itself has that size.", "The DFS template extends directly to harder variants: Subsets II (duplicates), Combination Sum, and Permutations — master it first." ] }
\`\`\``,
      starterCode: `def find_subsets(nums):
    """
    Generate all subsets of a given set of distinct integers.
    
    Args:
        nums: List of distinct integers
    
    Returns:
        List of lists, all possible subsets
    
    Example:
        >>> find_subsets([1, 2, 3])
        [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]
    """
    # TODO: Use BFS or DFS to generate all subsets
    # Hint: Start with empty subset, add each number to existing subsets
    pass


# ─── Test Cases ───

# Standard case
print(find_subsets([1, 2, 3]))
# Expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]

# Single element
print(find_subsets([0]))
# Expected: [[], [0]]

# Empty array
print(find_subsets([]))
# Expected: [[]]

# Two elements
print(find_subsets([1, 2]))
# Expected: [[], [1], [2], [1, 2]]

# Negative numbers
print(find_subsets([-1, 0, 1]))
# Expected: [[], [-1], [0], [1], [-1, 0], [-1, 1], [0, 1], [-1, 0, 1]]
`,
      solutionCode: `def find_subsets(nums):
    """
    Generate all subsets of a given set of distinct integers.
    
    Time Complexity: O(n × 2^n) — 2^n subsets, each up to size n
    Space Complexity: O(n × 2^n) — store all subsets
    """
    subsets = [[]]  # Start with empty subset
    
    for num in nums:
        # For each existing subset, create a new subset with current number
        n = len(subsets)
        for i in range(n):
            new_subset = subsets[i] + [num]
            subsets.append(new_subset)
    
    return subsets


# ─── Test Cases ───
print(find_subsets([1, 2, 3]))
# Expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]

print(find_subsets([0]))
# Expected: [[], [0]]

print(find_subsets([]))
# Expected: [[]]

print(find_subsets([1, 2]))
# Expected: [[], [1], [2], [1, 2]]

print(find_subsets([-1, 0, 1]))
# Expected: [[], [-1], [0], [1], [-1, 0], [-1, 1], [0, 1], [-1, 0, 1]]
`,
    },
    {
      id: "subsets-with-duplicates",
      slug: "subsets-with-duplicates",
      title: "Subsets With Duplicates",
      content: `## Subsets With Duplicates

<!-- voice:section_check concept="Handling duplicates in subset generation" -->

### Problem Statement

Given a collection of integers that might contain duplicates, return all possible subsets (the power set).

The solution set must **not** contain duplicate subsets.

**Example:**
\`\`\`
Input:  [1, 2, 2]
Output: [[], [1], [2], [1,2], [2,2], [1,2,2]]
\`\`\`

Although \`2\` appears twice in the input, \`[2]\` and \`[1,2]\` each appear only once in the output — while \`[2,2]\` and \`[1,2,2]\` are correctly generated.

---

\`\`\`concept
{ "title": "Why Sorting Unlocks Duplicate Handling", "variant": "mental-model", "content": "Sorting groups identical elements together. Once grouped, detecting a duplicate mid-loop takes a single comparison: nums[i] == nums[i-1]. Without sorting, duplicates could appear anywhere, making detection expensive. Sort once → detect duplicates in O(1) per element." }
\`\`\`

### The Duplicate-Skip Rule

<!-- voice:key_insight insight="Sort first, then only add current duplicate to subsets that were created using the previous duplicate" -->

\`\`\`concept
{ "title": "The Duplicate-Skip Rule", "variant": "rule", "content": "During backtracking, when iterating siblings at the same recursion depth: if i > index AND nums[i] == nums[i-1], skip nums[i]. This blocks generating two identical subsets with the same prefix — but only fires for repeated siblings at the same depth, so the first occurrence is always explored." }
\`\`\`

---

### Algorithm Walk-Through

\`\`\`steps
{ "title": "Subsets With Duplicates — Step by Step", "steps": [ { "title": "Sort the array", "content": "Sort \`nums\` so all duplicates are adjacent. \`[1, 2, 2]\` makes duplication trivially detectable; unsorted \`[2, 1, 2]\` would not." }, { "title": "Define backtrack(index, current)", "content": "At each call, immediately append a **copy** of \`current\` to \`result\` — this records the subset for the current path. Then iterate \`i\` from \`index\` to \`len(nums)-1\`." }, { "title": "Apply the skip guard before including", "content": "Before including \`nums[i]\`, check:\\n\`\`\`\\nif i > index and nums[i] == nums[i-1]:\\n    continue\\n\`\`\`\\nThe \`i > index\` part is critical — it allows the *first* occurrence at each level to be included, only pruning later duplicates at the same depth." }, { "title": "Recurse, then backtrack", "content": "Append \`nums[i]\`, recurse with \`backtrack(i+1, current)\`, then pop \`nums[i]\`. The pop restores state so other branches explore cleanly." } ] }
\`\`\`

---

### Execution Trace on [1, 2, 2]

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`trace
{ "title": "Backtracking trace — nums = [1, 2, 2]", "language": "python", "code": "def subsets_with_dup(nums):\\n    nums.sort()\\n    result = []\\n    def backtrack(index, current):\\n        result.append(current[:])\\n        for i in range(index, len(nums)):\\n            if i > index and nums[i] == nums[i-1]:\\n                continue\\n            current.append(nums[i])\\n            backtrack(i + 1, current)\\n            current.pop()\\n    backtrack(0, [])\\n    return result", "frames": [ { "line": 2, "vars": { "nums": "[1, 2, 2]" }, "note": "Sort complete — duplicates now adjacent" }, { "line": 5, "vars": { "index": 0, "current": "[]" }, "note": "backtrack(0, []) — record empty subset", "stdout": "result = [[]]" }, { "line": 9, "vars": { "i": 0, "nums[i]": 1 }, "note": "i=0: include 1, recurse" }, { "line": 5, "vars": { "index": 1, "current": "[1]" }, "note": "backtrack(1, [1]) — record [1]", "stdout": "result = [[], [1]]" }, { "line": 9, "vars": { "i": 1, "nums[i]": 2 }, "note": "i=1: include first 2, recurse" }, { "line": 5, "vars": { "index": 2, "current": "[1, 2]" }, "note": "backtrack(2, [1,2]) — record [1,2]", "stdout": "result = [[], [1], [1,2]]" }, { "line": 9, "vars": { "i": 2, "nums[i]": 2 }, "note": "i=2, i>index? (2>2)? NO — include second 2" }, { "line": 5, "vars": { "index": 3, "current": "[1, 2, 2]" }, "note": "backtrack(3, [1,2,2]) — record [1,2,2], loop ends", "stdout": "result = [[], [1], [1,2], [1,2,2]]" }, { "line": 7, "vars": { "i": 2, "index": 1 }, "note": "Back at depth=1, i=2: i>index (2>1) AND nums[2]==nums[1] → SKIP duplicate branch", "stdout": "Pruned: would have duplicated [1,2] and [1,2,2]" }, { "line": 9, "vars": { "i": 1, "index": 0 }, "note": "Back at depth=0, i=1: include first 2 at top level, recurse" }, { "line": 5, "vars": { "index": 1, "current": "[2]" }, "note": "backtrack(1, [2]) — record [2]", "stdout": "result = [[], [1], [1,2], [1,2,2], [2]]" }, { "line": 5, "vars": { "index": 2, "current": "[2, 2]" }, "note": "backtrack(2, [2,2]) — record [2,2]", "stdout": "result = [[], [1], [1,2], [1,2,2], [2], [2,2]]" }, { "line": 7, "vars": { "i": 2, "index": 0 }, "note": "Back at depth=0, i=2: i>index (2>0) AND nums[2]==nums[1] → SKIP — prevents duplicate [2] at top level", "stdout": "Final: [[], [1], [1,2], [1,2,2], [2], [2,2]]" } ], "speed": 900 }
\`\`\`

---

### What Breaks Without the Guard?

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "No skip guard — produces duplicate subsets", "code": "def subsets_bad(nums):\\n    nums.sort()\\n    result = []\\n    def backtrack(index, current):\\n        result.append(current[:])\\n        for i in range(index, len(nums)):\\n            # Missing duplicate check!\\n            current.append(nums[i])\\n            backtrack(i + 1, current)\\n            current.pop()\\n    backtrack(0, [])\\n    return result\\n\\n# [1,2,2] yields 10 items:\\n# [[], [1], [1,2], [1,2,2], [1,2], [1,2,2],\\n#  [2], [2,2], [2], [2,2]]\\n# [1,2], [1,2,2], [2], [2,2] each appear TWICE" }, "after": { "label": "With skip guard — exactly 6 unique subsets", "code": "def subsets_with_dup(nums):\\n    nums.sort()\\n    result = []\\n    def backtrack(index, current):\\n        result.append(current[:])\\n        for i in range(index, len(nums)):\\n            if i > index and nums[i] == nums[i-1]:\\n                continue  # skip duplicate sibling\\n            current.append(nums[i])\\n            backtrack(i + 1, current)\\n            current.pop()\\n    backtrack(0, [])\\n    return result\\n\\n# [1,2,2] yields exactly 6:\\n# [[], [1], [1,2], [1,2,2], [2], [2,2]]" } }
\`\`\`

---

\`\`\`callout
{ "type": "warning", "title": "The Off-by-One That Trips Everyone Up", "content": "The guard must be \`i > index\`, NOT \`i > 0\`. Using \`i > 0\` would skip the first occurrence of a duplicate at every recursion level — you would never generate \`[2]\` or \`[2,2]\` at all. The condition \`i > index\` means: only skip this value if we have already explored it as a sibling **at the current depth**. First occurrence at any depth always proceeds." }
\`\`\`

---

### BFS Iterative Alternative

\`\`\`collapse
{ "title": "Deep Dive: BFS Approach with Start Pointer", "content": "The iterative BFS approach tracks a \`start\` index pointing to which subsets were added in the **previous** round. When a duplicate is encountered, only those subsets are extended:\\n\\n\`\`\`python\\ndef subsets_with_dup_bfs(nums):\\n    nums.sort()\\n    result = [[]]\\n    start = 0\\n    for i, num in enumerate(nums):\\n        if i > 0 and nums[i] == nums[i - 1]:\\n            # Duplicate: only extend subsets from the previous round\\n            new = [s + [num] for s in result[start:]]\\n        else:\\n            start = len(result)\\n            new = [s + [num] for s in result]\\n        result.extend(new)\\n    return result\\n\`\`\`\\n\\n**Trace on \`[1, 2, 2]\`:**\\n\\n| Step | num | Action | result |\\n|------|-----|--------|--------|\\n| 0 | — | init | \`[[]]\` |\\n| 1 | 1 | extend all (start=0) | \`[[], [1]]\`, start→2 |\\n| 2 | 2 | extend all (start=2) | \`[[], [1], [2], [1,2]]\`, start→2 |\\n| 3 | 2 (dup) | extend only \`result[2:]\` | adds \`[2,2], [1,2,2]\` |\\n\\nFinal: \`[[], [1], [2], [1,2], [2,2], [1,2,2]]\`\\n\\nSame asymptotic complexity as DFS. Choose whichever mental model you find clearer in the interview." }
\`\`\`

---

### Complexity

| | Complexity | Reason |
|---|---|---|
| **Time** | O(n × 2^n) | Up to 2^n subsets; copying each costs O(n) |
| **Space** | O(n × 2^n) | Storing all subsets; O(n) recursion depth |

Duplicates reduce the actual subset count, but the worst-case bound (all distinct elements) remains O(n × 2^n).

---

### Knowledge Check

\`\`\`quiz
{ "title": "Subsets With Duplicates", "questions": [ { "question": "Given \`nums = [1, 2, 2]\`, how many unique subsets should the solution return?", "options": ["4", "6", "8", "10"], "answer": 1, "explanation": "The 6 unique subsets are: [], [1], [2], [1,2], [2,2], [1,2,2]. Without the skip guard, the same backtracking on [1,2,2] produces 10 entries with [1,2], [1,2,2], [2], and [2,2] each duplicated." }, { "question": "Why must we sort \`nums\` before backtracking?", "options": ["Sorting improves time complexity from O(2^n) to O(n log n)", "Sorting groups duplicates adjacently so nums[i] == nums[i-1] detects them in O(1)", "Sorted arrays are required for the recursion to terminate correctly", "Sorting ensures output subsets appear in lexicographic order"], "answer": 1, "explanation": "Sorting is purely for duplicate detection — it groups identical values so a single adjacent comparison suffices. It does not change the asymptotic complexity of subset generation." }, { "question": "In the guard \`if i > index and nums[i] == nums[i-1]: continue\`, what does \`i > index\` protect against?", "options": ["Skipping the very first occurrence of a duplicate value at each recursion depth", "Preventing an index-out-of-bounds error when accessing nums[i-1]", "Ensuring the recursion terminates when the array is exhausted", "Blocking the result list from growing beyond 2^n entries"], "answer": 0, "explanation": "\`i > index\` ensures we only skip a value when it has already appeared as a sibling at the current recursion depth. Without it, changing to \`i > 0\` would skip the first occurrence everywhere — so \`[2]\` and \`[2,2]\` would never be generated." }, { "question": "What is the time complexity of this algorithm?", "options": ["O(n²)", "O(2^n)", "O(n × 2^n)", "O(n!)"], "answer": 2, "explanation": "There are at most 2^n subsets (all elements distinct worst case). Copying each subset into the result list costs O(n), yielding O(n × 2^n) overall. The sort costs O(n log n) which is dominated." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Sort the array first — this groups duplicates adjacently and enables O(1) detection during backtracking.", "The skip guard \`if i > index and nums[i] == nums[i-1]: continue\` prunes duplicate sibling branches at each recursion depth.", "\`i > index\` (not \`i > 0\`) is critical: it blocks redundant siblings but always allows the first occurrence at any depth.", "Time and space are both O(n × 2^n) — sorting and pruning only eliminate duplicate paths, not the fundamental exponential count.", "The BFS iterative alternative uses a \`start\` pointer to track which subsets were added last round, extending only those when a duplicate is encountered." ] }
\`\`\``,
      starterCode: `def find_subsets_with_duplicates(nums):
    """
    Generate all subsets when input may contain duplicates.
    
    Args:
        nums: List of integers (may contain duplicates)
    
    Returns:
        List of lists, all unique subsets
    
    Example:
        >>> find_subsets_with_duplicates([1, 2, 2])
        [[], [1], [2], [1, 2], [2, 2], [1, 2, 2]]
    """
    # TODO: Generate subsets avoiding duplicates
    # Hint: Sort first, then carefully handle consecutive duplicates
    pass


# ─── Test Cases ───

# With duplicates
print(find_subsets_with_duplicates([1, 2, 2]))
# Expected: [[], [1], [2], [1, 2], [2, 2], [1, 2, 2]]

# All duplicates
print(find_subsets_with_duplicates([1, 1, 1]))
# Expected: [[], [1], [1, 1], [1, 1, 1]]

# No duplicates
print(find_subsets_with_duplicates([1, 2, 3]))
# Expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]

# Empty
print(find_subsets_with_duplicates([]))
# Expected: [[]]

# Single element
print(find_subsets_with_duplicates([5]))
# Expected: [[], [5]]
`,
      solutionCode: `def find_subsets_with_duplicates(nums):
    """
    Generate all subsets when input may contain duplicates.
    
    Time Complexity: O(n × 2^n)
    Space Complexity: O(n × 2^n)
    """
    nums.sort()  # Sort to group duplicates
    subsets = [[]]
    
    start_index = 0
    end_index = 0
    
    for i in range(len(nums)):
        start_index = 0
        
        # If current element is a duplicate, only add to subsets created in previous step
        if i > 0 and nums[i] == nums[i - 1]:
            start_index = end_index + 1
        
        end_index = len(subsets) - 1
        
        # Add current number to appropriate subsets
        for j in range(start_index, len(subsets)):
            new_subset = subsets[j] + [nums[i]]
            subsets.append(new_subset)
    
    return subsets


# ─── Test Cases ───
print(find_subsets_with_duplicates([1, 2, 2]))
# Expected: [[], [1], [2], [1, 2], [2, 2], [1, 2, 2]]

print(find_subsets_with_duplicates([1, 1, 1]))
# Expected: [[], [1], [1, 1], [1, 1, 1]]

print(find_subsets_with_duplicates([1, 2, 3]))
# Expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]

print(find_subsets_with_duplicates([]))
# Expected: [[]]

print(find_subsets_with_duplicates([5]))
# Expected: [[], [5]]
`,
    },
    {
      id: "permutations",
      slug: "permutations",
      title: "Permutations",
      content: `## Permutations

<!-- voice:section_check concept="Generating all permutations" -->

### Problem Statement

Given a collection of **distinct integers**, return all possible permutations.

| Input | Output |
|-------|--------|
| \`[1, 2, 3]\` | \`[[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]\` |
| \`[0, 1]\` | \`[[0,1], [1,0]]\` |

\`\`\`concept
{ "title": "Why n! Permutations?", "variant": "mental-model", "content": "Order matters in permutations. For n distinct elements: at position 0 you have n choices, at position 1 you have (n-1) remaining choices, and so on down to 1. Multiply them: n × (n-1) × … × 1 = n!. For [1,2,3] that's 3! = 6. The critical insight: unlike combinations where [1,2] == [2,1], permutations treat them as distinct — so we must always loop from index 0 and track which elements are already used." }
\`\`\`

### Two Approaches

**BFS:** Start with an empty permutation. For each new number, insert it at every possible position in all existing permutations — building up one layer at a time.

**DFS (Backtracking):** At each position, try every unused number. After exploring a branch, restore state (pop + unmark) and try the next choice — the classic *choose → explore → unchoose* cycle.

### Combination vs Permutation — The Code Difference

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Combination (order doesn't matter)", "code": "# Advance start index — never go backwards\\nfor i in range(start, n):\\n    path.append(nums[i])\\n    dfs(i + 1, path)  # only forward\\n    path.pop()\\n\\n# [1,2] == [2,1] so we never revisit earlier indices\\n# No used[] array needed" }, "after": { "label": "Permutation (order matters)", "code": "# Always loop from 0 — skip used elements\\nfor i in range(n):\\n    if used[i]: continue\\n    used[i] = True\\n    path.append(nums[i])\\n    dfs(path)          # restart from 0 each time\\n    path.pop()         # unchoose\\n    used[i] = False    # unmark\\n\\n# [1,2] != [2,1] — both are valid, used[] prevents repeats" } }
\`\`\`

<!-- voice:key_insight insight="For n distinct elements, there are n! permutations — at position i, we have (n-i) choices remaining" -->

### DFS Backtracking — Traced on [1, 2]

\`\`\`trace
{ "title": "DFS Trace: permute([1, 2])", "language": "python", "code": "def permute(nums):\\n    result = []\\n    used = [False] * len(nums)\\n\\n    def dfs(path):\\n        if len(path) == len(nums):\\n            result.append(path[:])\\n            return\\n        for i in range(len(nums)):\\n            if used[i]:\\n                continue\\n            used[i] = True\\n            path.append(nums[i])\\n            dfs(path)\\n            path.pop()\\n            used[i] = False\\n\\n    dfs([])\\n    return result", "frames": [ { "line": 18, "vars": { "nums": "[1,2]", "path": "[]", "used": "[F,F]", "result": "[]" }, "note": "Entry point: call dfs([]) with empty path" }, { "line": 9, "vars": { "i": "0", "path": "[]", "used": "[F,F]" }, "note": "Loop begins. i=0, used[0]=False → pick nums[0]=1" }, { "line": 13, "vars": { "i": "0", "path": "[1]", "used": "[T,F]" }, "note": "Choose 1: mark used[0]=True, append 1 to path" }, { "line": 14, "vars": { "path": "[1]", "used": "[T,F]" }, "note": "Recurse into dfs([1])" }, { "line": 9, "vars": { "i": "1", "path": "[1]", "used": "[T,F]" }, "note": "Inner loop: i=0 is used → skip. i=1, pick nums[1]=2" }, { "line": 13, "vars": { "i": "1", "path": "[1,2]", "used": "[T,T]" }, "note": "Choose 2: path length now equals nums length" }, { "line": 7, "vars": { "path": "[1,2]", "result": "[[1,2]]" }, "note": "Base case! len(path)==2. Append copy [1,2] to result." }, { "line": 15, "vars": { "path": "[1]", "used": "[T,F]" }, "note": "Backtrack: pop 2, set used[1]=False" }, { "line": 15, "vars": { "path": "[]", "used": "[F,F]" }, "note": "Backtrack again: pop 1, set used[0]=False. Back at root." }, { "line": 9, "vars": { "i": "1", "path": "[]", "used": "[F,F]" }, "note": "Root loop continues: i=1, used[1]=False → pick nums[1]=2" }, { "line": 13, "vars": { "i": "1", "path": "[2]", "used": "[F,T]" }, "note": "Choose 2: mark used[1]=True. Inner loop picks 1 next." }, { "line": 7, "vars": { "path": "[2,1]", "result": "[[1,2],[2,1]]" }, "note": "Base case! Append [2,1]. All 2! = 2 permutations found." } ], "speed": 900 }
\`\`\`

### BFS Approach (Alternative)

\`\`\`collapse
{ "title": "Deep Dive: BFS Insertion Method", "content": "**Algorithm:** Insert each new number at every valid index in every existing permutation.\\n\\n**Walkthrough with [1, 2, 3]:**\\n\\n- Start: \`[[]]\`\\n- Insert 1: \`[[1]]\`\\n- Insert 2 into \`[1]\` at positions 0 and 1:\\n  - → \`[2,1]\`, \`[1,2]\`\\n- Insert 3 into each of \`[2,1]\` and \`[1,2]\` at 3 positions each:\\n  - \`[3,2,1]\`, \`[2,3,1]\`, \`[2,1,3]\`\\n  - \`[3,1,2]\`, \`[1,3,2]\`, \`[1,2,3]\`\\n  - All 6 permutations produced.\\n\\n**Trade-off:** BFS avoids recursion depth but allocates many intermediate lists at each step. DFS backtracking reuses a single \`path\` array throughout and is preferred in interviews for clarity and memory efficiency." }
\`\`\`

### Complete Solutions

\`\`\`tabs
{ "tabs": [ { "label": "Python (DFS)", "icon": "🐍", "content": "\`\`\`python\\ndef permute(nums):\\n    result = []\\n    used = [False] * len(nums)\\n\\n    def dfs(path):\\n        if len(path) == len(nums):\\n            result.append(path[:])  # snapshot — path is mutated!\\n            return\\n        for i in range(len(nums)):\\n            if used[i]:\\n                continue\\n            used[i] = True\\n            path.append(nums[i])\\n            dfs(path)\\n            path.pop()        # unchoose\\n            used[i] = False   # unmark\\n\\n    dfs([])\\n    return result\\n\`\`\`" }, { "label": "Python (BFS)", "icon": "🔄", "content": "\`\`\`python\\ndef permute(nums):\\n    perms = [[]]\\n    for num in nums:\\n        new_perms = []\\n        for perm in perms:\\n            for i in range(len(perm) + 1):\\n                new_perm = perm[:i] + [num] + perm[i:]\\n                new_perms.append(new_perm)\\n        perms = new_perms\\n    return perms\\n\`\`\`" }, { "label": "JavaScript", "icon": "📜", "content": "\`\`\`javascript\\nfunction permute(nums) {\\n    const result = [];\\n    const used = new Array(nums.length).fill(false);\\n\\n    function dfs(path) {\\n        if (path.length === nums.length) {\\n            result.push([...path]); // spread = snapshot\\n            return;\\n        }\\n        for (let i = 0; i < nums.length; i++) {\\n            if (used[i]) continue;\\n            used[i] = true;\\n            path.push(nums[i]);\\n            dfs(path);\\n            path.pop();\\n            used[i] = false;\\n        }\\n    }\\n\\n    dfs([]);\\n    return result;\\n}\\n\`\`\`" } ] }
\`\`\`

### Complexity

| | Time | Space | Notes |
|---|---|---|---|
| **DFS (Backtracking)** | O(n × n!) | O(n × n!) | O(n) extra for recursion stack |
| **BFS (Insertion)** | O(n × n!) | O(n × n!) | No stack; builds intermediate lists |

\`\`\`callout
{ "type": "info", "title": "Why O(n × n!)?", "content": "There are n! permutations and each has length n. Copying each permutation to the result at the base case takes O(n) time, giving O(n × n!) total. Space is the same — we store all n! permutations each of size n. Compare to subsets (O(n × 2ⁿ)) and combinations C(n,k) × k — permutations grow the fastest." }
\`\`\`

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "What is the essential code difference between DFS for combinations and DFS for permutations?", "options": ["Permutations use a start index that advances; combinations loop from 0 with used[]", "Permutations loop from 0 with a used[] array; combinations advance a start index to avoid revisiting", "Permutations only work on sorted arrays; combinations work on unsorted arrays", "Combinations use used[]; permutations use a start index"], "answer": 1, "explanation": "In permutations, order matters — [1,2] and [2,1] are different — so we always loop from index 0 and skip elements via a used[] array. In combinations, [1,2] == [2,1], so we only move forward by advancing 'start', and no used[] is needed." }, { "question": "How many permutations does [1, 2, 3, 4] produce?", "options": ["8", "16", "24", "12"], "answer": 2, "explanation": "4! = 4 × 3 × 2 × 1 = 24. For each of the 4 positions there are (4 - position) choices remaining, and multiplying all choices gives n!." }, { "question": "What must happen immediately after the recursive dfs() call returns in the backtracking template?", "options": ["Append the current path to the result list", "Re-mark the current element as used", "Pop the last element from path AND unmark it in used[]", "Nothing — Python's scoping handles cleanup automatically"], "answer": 2, "explanation": "The 'unchoose' step is critical: path.pop() removes the element we added, and used[i] = False restores the boolean. Without this, subsequent branches would see a corrupted path and produce wrong or duplicate permutations." }, { "question": "Why must we write \`result.append(path[:])\` instead of \`result.append(path)\` at the base case?", "options": ["path[:] is evaluated at constant time while path is O(n)", "path is a single list mutated throughout recursion; path[:] saves an independent copy at that moment", "path[:] filters out duplicate elements automatically", "append() treats list arguments as references only when sliced"], "answer": 1, "explanation": "path is one shared list. After the base case appends it and recursion continues, path will be popped and repopulated for other branches. Without the copy (path[:] or list(path)), every entry in result would point to the same object and end up empty. Always snapshot mutable state at the base case." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["Permutations loop from index 0 every time and use a used[] boolean array to skip already-chosen elements — unlike combinations which advance a start index.", "The backtracking mantra is choose → explore → unchoose: append, recurse, then pop and unmark used[].", "For n distinct elements there are n! permutations; both time and space complexity are O(n × n!).", "Always copy the path at the base case (path[:] or [...path]) — the single shared list is mutated by backtracking so appending the reference gives wrong results.", "DFS backtracking reuses one path array throughout; BFS insertion is iterative but allocates many intermediate lists at each step."] }
\`\`\``,
      starterCode: `def find_permutations(nums):
    """
    Generate all permutations of a collection of distinct integers.
    
    Args:
        nums: List of distinct integers
    
    Returns:
        List of lists, all permutations
    
    Example:
        >>> find_permutations([1, 2, 3])
        [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
    """
    # TODO: Use BFS or DFS to generate all permutations
    # Hint: BFS: insert new number at every position
    # Hint: DFS: use backtracking with used[] array
    pass


# ─── Test Cases ───

# Standard case
print(find_permutations([1, 2, 3]))
# Expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]

# Two elements
print(find_permutations([0, 1]))
# Expected: [[0, 1], [1, 0]]

# Single element
print(find_permutations([1]))
# Expected: [[1]]

# Empty
print(find_permutations([]))
# Expected: [[]]

# Four elements
print(len(find_permutations([1, 2, 3, 4])))
# Expected: 24 (4!)
`,
      solutionCode: `def find_permutations(nums):
    """
    Generate all permutations using BFS approach.
    
    Time Complexity: O(n × n!)
    Space Complexity: O(n × n!)
    """
    permutations = [[]]  # Start with empty permutation
    
    for num in nums:
        new_permutations = []
        
        # Insert num at every possible position in each existing permutation
        for perm in permutations:
            for i in range(len(perm) + 1):
                new_perm = perm[:i] + [num] + perm[i:]
                new_permutations.append(new_perm)
        
        permutations = new_permutations
    
    return permutations


# Alternative DFS solution
def find_permutations_dfs(nums):
    """
    Generate all permutations using DFS/backtracking.
    """
    def backtrack(current, used):
        if len(current) == len(nums):
            result.append(list(current))
            return
        
        for i in range(len(nums)):
            if not used[i]:
                used[i] = True
                current.append(nums[i])
                backtrack(current, used)
                current.pop()
                used[i] = False
    
    result = []
    backtrack([], [False] * len(nums))
    return result


# ─── Test Cases ───
print(find_permutations([1, 2, 3]))
# Expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]

print(find_permutations([0, 1]))
# Expected: [[0, 1], [1, 0]]

print(find_permutations([1]))
# Expected: [[1]]

print(find_permutations([]))
# Expected: [[]]

print(len(find_permutations([1, 2, 3, 4])))
# Expected: 24
`,
    },
    {
      id: "string-permutations-case",
      slug: "string-permutations-case",
      title: "String Permutations by Changing Case",
      content: `## String Permutations by Changing Case

Given a string, find all permutations by changing the case of each alphabetic character. Non-alphabetic characters (digits, symbols) remain unchanged.

**Examples:**

| Input | Alphabetic chars | Count | Output |
|-------|-----------------|-------|--------|
| \`"ad52"\` | a, d → N=2 | 2² = **4** | \`["ad52", "Ad52", "aD52", "AD52"]\` |
| \`"ab7c"\` | a, b, c → N=3 | 2³ = **8** | \`["ab7c", "Ab7c", "aB7c", "AB7c", "ab7C", "Ab7C", "aB7C", "AB7C"]\` |

The digit \`7\` in \`"ab7c"\` contributes zero branches — only the 3 letters matter.

\`\`\`concept
{ "title": "Each Alphabetic Character Is a Binary Branch", "variant": "mental-model", "content": "Every alphabetic character presents exactly two choices: keep it lowercase, or flip it uppercase. Non-alphabetic characters have no choice — they stay fixed. This is structurally identical to the Subsets pattern: instead of 'include or exclude an element', you're deciding 'lower or upper' for each letter. With N alphabetic characters, the result always contains exactly 2^N permutations." }
\`\`\`

### BFS Expansion Strategy

Start with the original string. Process characters left to right. When you hit an alphabetic character, **double** the current result list: clone every existing permutation and flip that character's case in each clone. Skip non-alphabetic characters entirely.

\`\`\`steps
{ "title": "BFS Walkthrough on \\"ad52\\"", "steps": [ { "title": "Initialise", "content": "Seed the result list with the original string:\\n\\n\`\`\`\\npermutations = [\\"ad52\\"]\\n\`\`\`" }, { "title": "i = 0 → char 'a' (alphabetic)", "content": "Snapshot \`n = 1\`. Loop \`j\` from 0 to n−1:\\n\\n- \`j=0\`: take \`\\"ad52\\"\`, flip index 0: \`'a' → 'A'\`, append \`\\"Ad52\\"\`\\n\\n\`\`\`\\npermutations = [\\"ad52\\", \\"Ad52\\"]\\n\`\`\`\\n\\nList size: 1 → **2**" }, { "title": "i = 1 → char 'd' (alphabetic)", "content": "Snapshot \`n = 2\`. Loop \`j\` from 0 to 1:\\n\\n- \`j=0\`: take \`\\"ad52\\"\`, flip \`'d' → 'D'\` → append \`\\"aD52\\"\`\\n- \`j=1\`: take \`\\"Ad52\\"\`, flip \`'d' → 'D'\` → append \`\\"AD52\\"\`\\n\\n\`\`\`\\npermutations = [\\"ad52\\", \\"Ad52\\", \\"aD52\\", \\"AD52\\"]\\n\`\`\`\\n\\nList size: 2 → **4**" }, { "title": "i = 2, 3 → chars '5', '2' (digits)", "content": "\`'5'.isalpha()\` → False. \`'2'.isalpha()\` → False.\\n\\nSkip both. List stays at 4 entries." }, { "title": "Return", "content": "\`\`\`\\n[\\"ad52\\", \\"Ad52\\", \\"aD52\\", \\"AD52\\"]\\n\`\`\`\\n\\n2 alphabetic chars → 2² = 4 permutations. ✓" } ] }
\`\`\`

\`\`\`algoviz
{ "title": "Permutation List Expansion — \\"ad52\\"", "type": "array", "data": ["ad52", "Ad52", "aD52", "AD52"], "frames": [ { "highlight": [0], "label": "Init: only the original string is in the list", "stats": { "step": "init", "size": 1 } }, { "highlight": [1], "label": "Process 'a' (i=0): clone 'ad52', flip 'a'→'A' → append 'Ad52'", "stats": { "step": "i=0", "size": 2 } }, { "highlight": [2, 3], "label": "Process 'd' (i=1): clone both existing strings, flip 'd'→'D' → two new entries", "stats": { "step": "i=1", "size": 4 } }, { "highlight": [0, 1, 2, 3], "label": "Skip '5' and '2' (digits). All 4 permutations complete.", "stats": { "step": "done", "size": 4 } } ], "speed": 900 }
\`\`\`

### Python Solution

\`\`\`python
def find_letter_case_string_permutations(s):
    permutations = [s]

    for i in range(len(s)):
        if s[i].isalpha():
            n = len(permutations)      # snapshot BEFORE inner loop
            for j in range(n):
                chs = list(permutations[j])
                chs[i] = chs[i].swapcase()
                permutations.append(''.join(chs))

    return permutations
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "The Snapshot Trap", "content": "If you write \`for j in range(len(permutations)):\` without capturing \`n\` first, the loop bound grows each iteration. You'll process strings you just appended — those already have the character toggled, so toggling again either restores the original (creating duplicates) or sends the loop runaway. Always freeze \`n = len(permutations)\` before the inner loop." }
\`\`\`

### Complexity

| | Value | Why |
|-|-------|-----|
| **Time** | O(N × 2^N) | 2^N permutations, each costs O(N) to copy and modify |
| **Space** | O(N × 2^N) | Storing all 2^N permutations of length N |

*N = count of alphabetic characters only. Digits and symbols don't branch.*

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "How many permutations does find_letter_case_string_permutations(\\"a1B2c\\") return?", "options": ["4", "6", "8", "10"], "answer": 2, "explanation": "\\"a1B2c\\" contains 3 alphabetic characters: a, B, and c. Using 2^N = 2^3 = 8. The digits '1' and '2' are non-alphabetic and contribute no branches." }, { "question": "Why is \`n = len(permutations)\` captured before the inner for-j loop?", "options": ["To avoid IndexError on the outer for-i loop", "To prevent the inner loop from processing newly-appended strings in the same pass", "To improve runtime by caching the list length", "Python requires it — len() on a mutated list raises an exception"], "answer": 1, "explanation": "Without the snapshot, the inner loop processes strings you just appended. Those strings already have the character toggled for this round, so toggling again would restore the original — producing duplicates. The snapshot freezes the generation to branch from." }, { "question": "Which existing pattern most closely describes this problem?", "options": ["Sliding Window — shrink/expand a range over the string", "Two Pointers — converge from both ends toward the middle", "Subsets — make a binary decision per element", "Merge Intervals — detect and merge overlapping ranges"], "answer": 2, "explanation": "Each alphabetic character is a binary branch (lower | upper), exactly like the include/exclude decision in the Subsets pattern. The result size of 2^N directly mirrors the number of subsets of N elements." }, { "question": "What does find_letter_case_string_permutations(\\"123\\") return?", "options": ["[] — empty list, no alpha chars to branch on", "[\\"123\\"] — a list containing only the original string", "[\\"123\\", \\"123\\"] — the original string duplicated", "Raises a ValueError for digit-only input"], "answer": 1, "explanation": "There are zero alphabetic characters, so the inner if-branch never executes. The function returns its initial list [\\"123\\"] unchanged. This is consistent with 2^0 = 1." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["Map to the Subsets pattern: each alphabetic character is a binary branch (lower | upper), producing 2^N total permutations.", "BFS expansion: start with the original string; for each alpha char, clone every existing permutation with that position's case flipped and append the clone.", "Always snapshot n = len(permutations) before the inner loop — iterating over a live growing list produces duplicates.", "Non-alphabetic characters (digits, symbols) contribute zero branches and appear unchanged in every permutation.", "Time and space are both O(N × 2^N) where N counts only the alphabetic characters in the input string."] }
\`\`\``,
      starterCode: `def find_case_permutations(s):
    """
    Find all permutations of a string by changing case of alphabetic characters.
    
    Args:
        s: String to permute
    
    Returns:
        List of strings, all case permutations
    
    Example:
        >>> find_case_permutations("ad52")
        ['ad52', 'Ad52', 'aD52', 'AD52']
    """
    # TODO: Generate all case permutations using BFS
    # Hint: For each letter, double the permutations with upper and lower case
    pass


# ─── Test Cases ───

# Standard case
print(find_case_permutations("ad52"))
# Expected: ['ad52', 'Ad52', 'aD52', 'AD52']

# Three letters
print(find_case_permutations("ab7c"))
# Expected: ['ab7c', 'Ab7c', 'aB7c', 'AB7c', 'ab7C', 'Ab7C', 'aB7C', 'AB7C']

# No letters
print(find_case_permutations("123"))
# Expected: ['123']

# Single letter
print(find_case_permutations("a"))
# Expected: ['a', 'A']

# Empty string
print(find_case_permutations(""))
# Expected: ['']
`,
      solutionCode: `def find_case_permutations(s):
    """
    Find all permutations of a string by changing case of alphabetic characters.
    
    Time Complexity: O(n × 2^k) where k is number of letters
    Space Complexity: O(n × 2^k)
    """
    permutations = [""]
    
    for char in s:
        new_permutations = []
        
        for perm in permutations:
            if char.isalpha():
                # Add both lowercase and uppercase versions
                new_permutations.append(perm + char.lower())
                new_permutations.append(perm + char.upper())
            else:
                # Non-alphabetic: just append as-is
                new_permutations.append(perm + char)
        
        permutations = new_permutations
    
    return permutations


# ─── Test Cases ───
print(find_case_permutations("ad52"))
# Expected: ['ad52', 'Ad52', 'aD52', 'AD52']

print(find_case_permutations("ab7c"))
# Expected: ['ab7c', 'Ab7c', 'aB7c', 'AB7c', 'ab7C', 'Ab7C', 'aB7C', 'AB7C']

print(find_case_permutations("123"))
# Expected: ['123']

print(find_case_permutations("a"))
# Expected: ['a', 'A']

print(find_case_permutations(""))
# Expected: ['']
`,
    },
    {
      id: "balanced-parentheses",
      slug: "balanced-parentheses",
      title: "Balanced Parentheses",
      content: `## Balanced Parentheses

<!-- voice:section_check concept="Generating balanced parentheses" -->

### Problem Statement

Given \`n\`, generate all combinations of **well-formed (balanced)** parentheses with \`n\` pairs.

| n | Output |
|---|--------|
| 2 | \`["(())", "()()"]\` |
| 3 | \`["((()))", "(()())", "(())()", "()(())", "()()()"]\` |

---

\`\`\`concept
{ "title": "The Two Pruning Rules", "variant": "mental-model", "content": "Build the string one character at a time, left to right. At each position exactly two choices exist — place '(' or ')' — but only under strict conditions:\\n\\n- Place '(' only when open_count < n  (budget not exhausted)\\n- Place ')' only when close_count < open_count  (won't exceed unmatched opens)\\n\\nThese two rules guarantee every completed string is valid by construction, eliminating the need to check validity after the fact." }
\`\`\`

---

### Why Backtracking?

This is a **constrained generation** problem — produce every valid arrangement without enumerating invalid ones first. Backtracking lets us build the string character by character and **prune illegal branches before they grow**, reducing work from 2^(2n) naive candidates down to exactly the Catalan number C(n) of valid strings.

\`\`\`concept
{ "title": "Catalan Numbers", "variant": "insight", "content": "The count of valid n-pair strings is the nth Catalan number: C(n) = (2n choose n) / (n+1).\\n\\nn=2 → C(2) = 2\\nn=3 → C(3) = 5\\nn=4 → C(4) = 14\\nn=5 → C(5) = 42\\n\\nCatalan numbers grow as ~4^n / n^(3/2), which is why the complexity is O(n × 4^n / √n) — not the exponential 2^(2n) of brute force." }
\`\`\`

---

### Algorithm Design

\`\`\`steps
{ "title": "DFS with Pruning", "steps": [ { "title": "Define recursive state", "content": "Each call tracks three values:\\n- \`s\` — the string built so far\\n- \`op\` — number of \`(\` placed\\n- \`cl\` — number of \`)\` placed\\n\\nInitial call: \`dfs('', 0, 0)\`" }, { "title": "Base case", "content": "When \`len(s) == 2 * n\`, all n pairs have been placed. The string is valid **by construction** (the pruning rules guaranteed it), so append to results and return." }, { "title": "Branch 1 — place '('", "content": "If \`op < n\`: recurse with \`dfs(s + '(', op + 1, cl)\`.\\n\\nThis spends one unit of your opening-paren budget." }, { "title": "Branch 2 — place ')'", "content": "If \`cl < op\`: recurse with \`dfs(s + ')', op, cl + 1)\`.\\n\\nThis closes the most recent unmatched \`(\`. Only valid when at least one \`(\` is waiting for its match." }, { "title": "No explicit undo needed", "content": "We pass \`s + '('\` (a new string), not a mutated shared buffer. Because Python strings are immutable, each recursive call gets its own prefix — the 'backtrack' step is implicit." } ] }
\`\`\`

---

### Execution Trace (n = 2)

\`\`\`trace
{ "title": "DFS Trace — n = 2", "language": "python", "code": "def generate(n):\\n    result = []\\n    def dfs(s, op, cl):\\n        if len(s) == 2 * n:\\n            result.append(s)\\n            return\\n        if op < n:\\n            dfs(s + '(', op + 1, cl)\\n        if cl < op:\\n            dfs(s + ')', op, cl + 1)\\n    dfs('', 0, 0)\\n    return result", "frames": [ { "line": 3, "vars": {"s": "", "op": 0, "cl": 0, "n": 2}, "note": "Initial call — empty string, no parens placed" }, { "line": 7, "vars": {"s": "", "op": 0, "cl": 0}, "note": "op(0) < n(2) → budget available, place '('" }, { "line": 3, "vars": {"s": "(", "op": 1, "cl": 0}, "note": "Placed '(' — recurse deeper" }, { "line": 7, "vars": {"s": "(", "op": 1, "cl": 0}, "note": "op(1) < n(2) → can still place '('" }, { "line": 3, "vars": {"s": "((", "op": 2, "cl": 0}, "note": "Placed '(' — open budget exhausted (op == n)" }, { "line": 9, "vars": {"s": "((", "op": 2, "cl": 0}, "note": "op == n, skip '(' branch; cl(0) < op(2) → place ')'" }, { "line": 3, "vars": {"s": "(()", "op": 2, "cl": 1}, "note": "Placed ')' — one unmatched '(' remains" }, { "line": 9, "vars": {"s": "(()", "op": 2, "cl": 1}, "note": "cl(1) < op(2) → place final ')'" }, { "line": 4, "vars": {"s": "(())", "op": 2, "cl": 2}, "note": "len(4) == 2*2 → base case! First valid string.", "stdout": "result = ['(())']" }, { "line": 9, "vars": {"s": "(", "op": 1, "cl": 0}, "note": "Backtrack to '(' — try ')' branch: cl(0) < op(1)" }, { "line": 3, "vars": {"s": "()", "op": 1, "cl": 1}, "note": "Placed ')' — explore subtree from '()'" }, { "line": 7, "vars": {"s": "()", "op": 1, "cl": 1}, "note": "op(1) < n(2) → place '('" }, { "line": 3, "vars": {"s": "()(" , "op": 2, "cl": 1}, "note": "Placed '(' — open budget exhausted again" }, { "line": 9, "vars": {"s": "()(", "op": 2, "cl": 1}, "note": "cl(1) < op(2) → place final ')'" }, { "line": 4, "vars": {"s": "()()", "op": 2, "cl": 2}, "note": "Second valid string found!", "stdout": "result = ['(())', '()()']" } ], "speed": 900 }
\`\`\`

---

### Implementation

\`\`\`playground
{ "title": "Balanced Parentheses — Python", "language": "python", "code": "def generate_parentheses(n):\\n    result = []\\n\\n    def dfs(s, op, cl):\\n        # Base case: placed all n pairs\\n        if len(s) == 2 * n:\\n            result.append(s)\\n            return\\n        # Branch 1: add '(' while budget remains\\n        if op < n:\\n            dfs(s + '(', op + 1, cl)\\n        # Branch 2: add ')' only if it won't exceed open count\\n        if cl < op:\\n            dfs(s + ')', op, cl + 1)\\n\\n    dfs('', 0, 0)\\n    return result\\n\\nprint(generate_parentheses(2))  # ['(())', '()()']\\nprint(generate_parentheses(3))  # 5 combinations\\nprint(len(generate_parentheses(4)))  # 14 = C(4)", "runnable": true }
\`\`\`

---

### Complexity Analysis

\`\`\`tabs
{ "tabs": [ { "label": "Time", "icon": "⏱️", "content": "**O(n × 4^n / √n)**\\n\\nExact output count is the Catalan number C(n) ≈ 4^n / (n^(3/2) × √π). Each valid string has length 2n, so total work is proportional to **n × C(n)**.\\n\\n| n | C(n) | Strings × Length |\\n|---|------|------------------|\\n| 2 | 2 | 2 × 4 = 8 |\\n| 3 | 5 | 5 × 6 = 30 |\\n| 4 | 14 | 14 × 8 = 112 |\\n| 5 | 42 | 42 × 10 = 420 |" }, { "label": "Space", "icon": "🧠", "content": "**O(n × 4^n / √n)** for the result list — same magnitude as time.\\n\\nThe recursion **call stack** reaches at most depth 2n (one frame per character placed), adding only **O(n)** auxiliary space.\\n\\nNote: the immutable-string approach (\`s + '('\`) creates many short-lived string objects. A mutable buffer + explicit backtrack would reduce allocations at the cost of more complex code." }, { "label": "vs Brute Force", "icon": "🔍", "content": "Brute force generates all 2^(2n) binary strings, then filters. For n=4 that's 256 candidates to check.\\n\\nBacktracking visits only **C(n) = 14** valid states for n=4 — the pruning rules cut branches before they grow.\\n\\nThe key insight: we never build a prefix that is already invalid, so **no wasted work occurs**." } ] }
\`\`\`

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "In the DFS for balanced parentheses, under what condition can you place a ')'?", "options": ["close_count < n", "close_count < open_count", "open_count == n", "the string length is even"], "answer": 1, "explanation": "You can only place ')' when close_count < open_count. This ensures every ')' has a matching '(' to its left, maintaining balance at every prefix. Placing ')' when close_count >= open_count would create an unmatched closing paren." }, { "question": "For n=4, how many valid balanced parenthesis strings exist?", "options": ["8", "12", "14", "16"], "answer": 2, "explanation": "The answer is the 4th Catalan number: C(4) = (8 choose 4) / 5 = 70 / 5 = 14. Catalan numbers grow roughly as 4^n / n^(3/2), explaining the O(n × 4^n / √n) complexity." }, { "question": "Why does passing \`s + '('\` (a new string) eliminate the need for an explicit backtrack step?", "options": ["It's faster than list.append/pop", "Python strings are immutable so the parent call's \`s\` is never modified", "The recursion depth is lower with strings", "It avoids stack overflow"], "answer": 1, "explanation": "Python strings are immutable. \`s + '('\` allocates a brand-new string object; the caller's \`s\` is unchanged. When the callee returns, there's nothing to undo. If you used a mutable list, you'd need to explicitly pop the last element after each recursive call to restore state." }, { "question": "What is the maximum recursion depth for this algorithm given n pairs?", "options": ["n", "2n", "n²", "C(n)"], "answer": 1, "explanation": "Each recursive call places exactly one character. The completed string has length 2n, so the deepest path through the recursion tree is exactly 2n frames deep — O(n) stack space regardless of how many valid strings exist." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Two pruning rules drive the algorithm: add '(' only when open_count < n, add ')' only when close_count < open_count.", "Every string added to the result is valid by construction — no post-hoc validation needed.", "Output count equals the nth Catalan number C(n); time and space are both O(n × 4^n / √n).", "Immutable string concatenation makes the 'undo' step implicit — simpler code at the cost of extra allocations vs a mutable buffer approach.", "This pattern generalizes to any 'generate all valid sequences under local constraints' problem: define state, prune aggressively, collect at base case." ] }
\`\`\``,
      starterCode: `def generate_balanced_parentheses(n):
    """
    Generate all combinations of well-formed parentheses.
    
    Args:
        n: int, number of pairs of parentheses
    
    Returns:
        List of strings, all valid combinations
    
    Example:
        >>> generate_balanced_parentheses(2)
        ['(())', '()()']
    """
    # TODO: Use DFS with open/close count constraints
    # Hint: Add '(' if open < n, add ')' if close < open
    pass


# ─── Test Cases ───

# n=2
print(generate_balanced_parentheses(2))
# Expected: ['(())', '()()']

# n=3
print(generate_balanced_parentheses(3))
# Expected: ['((()))', '(()())', '(())()', '()(())', '()()()']

# n=1
print(generate_balanced_parentheses(1))
# Expected: ['()']

# Check count for n=4 (Catalan number C4 = 14)
print(len(generate_balanced_parentheses(4)))
# Expected: 14
`,
      solutionCode: `def generate_balanced_parentheses(n):
    """
    Generate all combinations of well-formed parentheses.
    
    Time Complexity: O(n × 4^n / √n) — Catalan number
    Space Complexity: O(n × 4^n / √n)
    """
    def backtrack(current, open_count, close_count):
        # Base case: used all parentheses
        if len(current) == 2 * n:
            result.append(current)
            return
        
        # Can add '(' if we haven't used all n
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        
        # Can add ')' if it won't exceed open count
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    
    result = []
    backtrack("", 0, 0)
    return result


# ─── Test Cases ───
print(generate_balanced_parentheses(2))
# Expected: ['(())', '()()']

print(generate_balanced_parentheses(3))
# Expected: ['((()))', '(()())', '(())()', '()(())', '()()()']

print(generate_balanced_parentheses(1))
# Expected: ['()']

print(len(generate_balanced_parentheses(4)))
# Expected: 14
`,
    },
    {
      id: "subsets-checkpoint",
      slug: "subsets-checkpoint",
      title: "Module Checkpoint: Subsets",
      content: `## Module Checkpoint: Subsets

<!-- voice:checkpoint_intro -->

Great work completing the Subsets module! Before moving on, let's consolidate everything you've learned and make sure the patterns are locked in.

\`\`\`concept
{ "title": "The Subsets Pattern: Core Insight", "variant": "mental-model", "content": "Every subsets/combinations/permutations problem is a tree traversal in disguise. Each node represents a partial solution, each edge is a choice (include or exclude an element), and the leaves are your final answers. Backtracking is just DFS on this decision tree — explore a path, record the result, undo the last choice, try the next branch." }
\`\`\`

---

### What You Mastered This Module

\`\`\`tabs
{
  "tabs": [
    {
      "label": "BFS Subsets",
      "icon": "🌊",
      "content": "**Iterative approach — build subsets level by level.**\\n\\nStart with \`[[]]\`. For each element, take every existing subset and append the new element to create new subsets.\\n\\n\`\`\`python\\ndef subsets(nums):\\n    result = [[]]\\n    for num in nums:\\n        result += [s + [num] for s in result]\\n    return result\\n\`\`\`\\n\\nFor \`[1, 2, 3]\`:\\n- After \`1\`: \`[[], [1]]\`\\n- After \`2\`: \`[[], [1], [2], [1,2]]\`\\n- After \`3\`: \`[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]\`\\n\\n**Time:** O(n × 2ⁿ) — we process each of the 2ⁿ subsets, each of length up to n."
    },
    {
      "label": "DFS / Backtracking",
      "icon": "🌲",
      "content": "**Recursive approach — include or exclude each element.**\\n\\n\`\`\`python\\ndef subsets(nums):\\n    res = []\\n    def backtrack(start, path):\\n        res.append(list(path))\\n        for i in range(start, len(nums)):\\n            path.append(nums[i])\\n            backtrack(i + 1, path)\\n            path.pop()  # undo choice\\n    backtrack(0, [])\\n    return res\\n\`\`\`\\n\\nThe \`path.pop()\` is the backtrack step — it undoes the last choice so you can explore the next branch."
    },
    {
      "label": "Handling Duplicates",
      "icon": "🔁",
      "content": "**Sort first, then skip duplicate elements at the same recursion depth.**\\n\\n\`\`\`python\\ndef subsetsWithDup(nums):\\n    nums.sort()  # critical first step\\n    res = []\\n    def backtrack(start, path):\\n        res.append(list(path))\\n        for i in range(start, len(nums)):\\n            if i > start and nums[i] == nums[i-1]:\\n                continue  # skip duplicate at same level\\n            path.append(nums[i])\\n            backtrack(i + 1, path)\\n            path.pop()\\n    backtrack(0, [])\\n    return res\\n\`\`\`\\n\\nThe guard \`i > start and nums[i] == nums[i-1]\` only skips duplicates at the **same level** of the tree, not across levels."
    },
    {
      "label": "Permutations",
      "icon": "🔀",
      "content": "**Order matters → loop from 0, track visited elements.**\\n\\n\`\`\`python\\ndef permute(nums):\\n    res = []\\n    used = [False] * len(nums)\\n    def backtrack(path):\\n        if len(path) == len(nums):\\n            res.append(list(path))\\n            return\\n        for i in range(len(nums)):\\n            if used[i]:\\n                continue\\n            used[i] = True\\n            path.append(nums[i])\\n            backtrack(path)\\n            path.pop()\\n            used[i] = False\\n    backtrack([])\\n    return res\\n\`\`\`\\n\\nn distinct elements → **n!** permutations. For \`[1,2,3]\` that's 6 permutations."
    },
    {
      "label": "Balanced Parentheses",
      "icon": "🔤",
      "content": "**Constraint-based generation — prune invalid branches early.**\\n\\n\`\`\`python\\ndef generateParenthesis(n):\\n    res = []\\n    def backtrack(s, open_count, close_count):\\n        if len(s) == 2 * n:\\n            res.append(s)\\n            return\\n        if open_count < n:\\n            backtrack(s + '(', open_count + 1, close_count)\\n        if close_count < open_count:  # key constraint\\n            backtrack(s + ')', open_count, close_count + 1)\\n    backtrack('', 0, 0)\\n    return res\\n\`\`\`\\n\\nThe constraint \`close_count < open_count\` ensures we only add \`)\` when there's a matching \`(\` to close."
    }
  ]
}
\`\`\`

---

### Complexity Quick Reference

| Problem | Time | Space | Why |
|---------|------|-------|-----|
| Subsets | O(n × 2ⁿ) | O(n × 2ⁿ) | 2ⁿ subsets, each up to n elements |
| Permutations | O(n × n!) | O(n × n!) | n! permutations, each length n |
| Combinations (k) | O(k × C(n,k)) | O(k) | C(n,k) results, each length k |
| Balanced Parens | O(4ⁿ / √n) | O(n) | Catalan number growth |
| Subsets w/ Dups | O(n × 2ⁿ) | O(n × 2ⁿ) | Same as subsets, sort adds O(n log n) |

\`\`\`concept
{ "title": "Combination vs Permutation: The One Question", "variant": "rule", "content": "Before writing any code, ask: **Does order matter?**\\n\\n- Order does NOT matter → Combination / Subset → move index forward (\`start = i+1\`), no visited array needed\\n- Order DOES matter → Permutation → loop from 0 every time, need a \`visited[]\` array to track used elements\\n\\n[1,2] and [2,1] are the same combination but different permutations." }
\`\`\`

---

\`\`\`algoviz
{
  "title": "BFS Subset Generation: [1, 2, 3]",
  "type": "array",
  "data": [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]],
  "frames": [
    { "highlight": [0], "label": "Start: result = [[]]", "stats": { "element": "—", "new_subsets": 0 } },
    { "highlight": [0, 1], "label": "Add element 1: copy [] → [1]. Result now has 2 subsets.", "stats": { "element": 1, "new_subsets": 1 } },
    { "highlight": [0, 1, 2, 3], "label": "Add element 2: copy [] → [2], copy [1] → [1,2]. Result now has 4 subsets.", "stats": { "element": 2, "new_subsets": 2 } },
    { "highlight": [0, 1, 2, 3, 4, 5, 6, 7], "label": "Add element 3: generate 4 more subsets by appending 3 to each existing subset.", "stats": { "element": 3, "new_subsets": 4 } }
  ],
  "speed": 900
}
\`\`\`

---

\`\`\`quiz
{
  "title": "Subsets Module: Knowledge Check",
  "questions": [
    {
      "question": "A set has n distinct elements. How many unique subsets does it have?",
      "options": ["n!", "2ⁿ", "n²", "n(n-1)/2"],
      "answer": 1,
      "explanation": "Each element has exactly 2 choices — include or exclude — giving 2 × 2 × ... × 2 = 2ⁿ total subsets. For example, [1,2,3] has 2³ = 8 subsets including the empty set."
    },
    {
      "question": "In the BFS (iterative) subsets approach, what happens when processing each new element?",
      "options": [
        "Remove elements from existing subsets",
        "Add the current element to all existing subsets to create new subsets",
        "Sort all subsets alphabetically",
        "Generate subsets randomly and deduplicate"
      ],
      "answer": 1,
      "explanation": "At each step we take a snapshot of all current subsets and append the new element to each one, doubling the total count. This is why we go from k subsets to 2k subsets after each element."
    },
    {
      "question": "When generating permutations of n distinct elements, how many total permutations exist?",
      "options": ["2ⁿ", "n!", "n²", "2n"],
      "answer": 1,
      "explanation": "Permutations care about order: n choices for position 1, n-1 for position 2, etc. giving n × (n-1) × ... × 1 = n!. For [1,2,3] that's 3! = 6 permutations."
    },
    {
      "question": "What is the MOST important first step when generating subsets from input that may contain duplicates?",
      "options": [
        "Use a hash set to store results",
        "Sort the input array first",
        "Always start backtracking from index 1",
        "Convert the array to a set first"
      ],
      "answer": 1,
      "explanation": "Sorting groups duplicate values adjacent to each other. Then the guard \`if i > start and nums[i] == nums[i-1]: continue\` can detect and skip duplicates at the same recursion level. Without sorting, duplicates would be scattered and impossible to skip systematically."
    },
    {
      "question": "In the balanced parentheses generator, under what condition can you add a closing ')' character?",
      "options": [
        "At any time, as long as the string isn't full",
        "Only if close_count < open_count",
        "Only as the very last character",
        "Only if open_count equals n"
      ],
      "answer": 1,
      "explanation": "You can only add ')' when there are more open parens than close parens so far — i.e., there's an unmatched '(' to close. This constraint prunes all invalid branches early and is what makes the generation efficient."
    },
    {
      "question": "What is the key structural difference between the backtracking template for combinations vs permutations?",
      "options": [
        "Combinations use a stack; permutations use a queue",
        "Combinations pass i+1 to the next call; permutations loop from 0 with a visited array",
        "Combinations track visited elements; permutations do not",
        "There is no structural difference"
      ],
      "answer": 1,
      "explanation": "Combinations move the start index forward (i+1) to avoid reusing elements and to enforce that [1,2] == [2,1]. Permutations always loop from 0 because order matters, but use a visited[] boolean array to avoid using the same element twice in one permutation."
    }
  ]
}
\`\`\`

---

\`\`\`concept
{ "title": "The Backtracking Contract", "variant": "insight", "content": "Every backtracking solution must honour the choose → explore → unchoose contract:\\n\\n1. **Choose**: Add an element to your current path\\n2. **Explore**: Recurse deeper with the updated path\\n3. **Unchoose**: Remove the element (pop) to restore state for the next branch\\n\\nForgetting to \`pop()\` after recursion is the #1 bug in backtracking code — your path accumulates garbage from previous branches and every result comes out wrong." }
\`\`\`

---

### Voice Summary Prompts

<!-- voice:checkpoint_summary -->

Your coach will walk through these with you. Prepare to explain:

1. **Walk through BFS subset generation** for \`[1, 2]\` — what does \`result\` look like after each element?
2. **Explain duplicate handling** — why must you sort first, and what does the \`i > start\` guard do that \`i > 0\` would not?
3. **Generate valid parentheses** for \`n = 2\` out loud — trace which branches get pruned and why.
4. **Compare complexities** — why is the time for permutations (n!) so much larger than subsets (2ⁿ) for large n?

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "A set of n distinct elements has exactly 2ⁿ subsets — each element has an include/exclude binary choice.",
    "BFS builds subsets iteratively by doubling the result set at each step; DFS/backtracking explores the same decision tree recursively.",
    "For duplicates: sort the input first, then skip \`nums[i] == nums[i-1]\` when \`i > start\` to avoid duplicate subsets at the same tree level.",
    "Permutations (n!) grow far faster than subsets (2ⁿ) — for n=10, that's 1024 vs 3,628,800.",
    "The backtracking contract is always: choose → explore → unchoose. Forgetting \`pop()\` is the most common bug.",
    "Ask 'does order matter?' before coding — yes → permutation template (visited array, loop from 0); no → combination template (start index, no visited array)."
  ]
}
\`\`\`

**You're mastering the Subsets pattern — on to the next module!**`,
    },
  ],
};
