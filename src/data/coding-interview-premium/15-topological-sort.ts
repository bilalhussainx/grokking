import { Module } from "../types";

export const topologicalSortModule: Module = {
  id: "topological-sort",
  title: "Topological Sort",
  description:
    "Master the Topological Sort pattern for ordering tasks with dependencies using Kahn's algorithm and DFS. Essential for scheduling, prerequisite problems, and detecting cycles in directed graphs.",
  lessons: [
    {
      id: "topological-sort-intro",
      slug: "topological-sort-intro",
      title: "Introduction to Topological Sort",
      content: `## The Topological Sort Pattern

**Topological Sort** orders the vertices of a directed graph such that for every edge (u → v), vertex u comes before v in the ordering. It's used for scheduling tasks with dependencies.

\`\`\`mermaid
graph LR
    A[A] --> C[C]
    A --> B[B]
    B --> D[D]
    C --> D
    D --> E[E]
    subgraph "Topological Order"
        direction LR
        O1["A"] ~~~ O2["B"] ~~~ O3["C"] ~~~ O4["D"] ~~~ O5["E"]
    end
\`\`\`

<!-- voice:section_check concept="Topological Sort basic concept" -->

### Why Topological Sort?

When you have tasks with prerequisites:
- Course A requires Course B
- Job A must complete before Job B starts
- Package A depends on Package B

### Kahn's Algorithm (BFS Approach)

1. Calculate **in-degree** (number of incoming edges) for each vertex
2. Add all vertices with **in-degree 0** to a queue
3. While queue not empty:
   - Remove vertex from queue, add to result
   - For each neighbor, decrease in-degree by 1
   - If neighbor's in-degree becomes 0, add to queue
4. If result size < number of vertices, there's a cycle

~~~
from collections import deque, defaultdict

def topological_sort(vertices, edges):
    # Build graph and calculate in-degrees
    graph = defaultdict(list)
    in_degree = {i: 0 for i in range(vertices)}
    
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
    # Start with vertices having no dependencies
    queue = deque([v for v in range(vertices) if in_degree[v] == 0])
    result = []
    
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        
        for neighbor in graph[vertex]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # Check for cycle
    if len(result) != vertices:
        return []  # Cycle detected
    
    return result
~~~

<!-- voice:key_insight insight="Vertices with in-degree 0 have no dependencies — they can be processed first. Remove them and update their neighbors' in-degrees." -->

### When to Use

- Task scheduling with prerequisites
- Course schedule validation
- Detecting cycles in directed graphs
- Ordering compilation of source files
- Alien dictionary (verifying/changing)

### Complexity

- **Time:** O(V + E) — visit all vertices and edges once
- **Space:** O(V + E) — graph storage and queue`,
    },
    {
      id: "task-scheduling",
      slug: "task-scheduling",
      title: "Task Scheduling (Valid Order)",
      content: `## Task Scheduling (Valid Order)

<!-- voice:section_check concept="Detecting valid task ordering" -->

### Problem Statement

There are a total of \`n\` tasks you have to pick, labeled from \`0\` to \`n-1\`. Some tasks may have prerequisite tasks. Given the total number of tasks and a list of prerequisite pairs, determine if it is possible to finish all tasks.

### Examples

~~~
Input: n = 2, prerequisites = [[1, 0]]
Output: true
Explanation: To take task 1, you should first finish task 0. Valid order: [0, 1]
~~~

~~~
Input: n = 2, prerequisites = [[1, 0], [0, 1]]
Output: false
Explanation: Circular dependency! Cannot finish all tasks.
~~~

### Approach

This is a **cycle detection** problem in a directed graph:
1. Build adjacency list and calculate in-degrees
2. Use Kahn's algorithm (BFS)
3. If we can process all n tasks, return true
4. If result size < n, there's a cycle, return false

<!-- voice:key_insight insight="If there's a cycle in the dependency graph, it's impossible to finish all tasks — topological sort helps detect this" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(V + E) — build graph and process all nodes
- **Space:** O(V + E) — graph storage`,
      starterCode: `from collections import deque, defaultdict


def can_finish_tasks(n, prerequisites):
    """
    Determine if all tasks can be finished given prerequisites.
    
    Args:
        n: int, total number of tasks (0 to n-1)
        prerequisites: List of [task, prerequisite] pairs
    
    Returns:
        bool: True if all tasks can be finished, False otherwise
    
    Example:
        >>> can_finish_tasks(2, [[1, 0]])
        True
        >>> can_finish_tasks(2, [[1, 0], [0, 1]])
        False
    """
    # TODO: Use Kahn's algorithm to detect cycle
    # Hint: Build graph, calculate in-degrees, process nodes with in-degree 0
    pass


# ─── Test Cases ───

# Valid ordering
print(can_finish_tasks(2, [[1, 0]]))
# Expected: True

# Cycle detected
print(can_finish_tasks(2, [[1, 0], [0, 1]]))
# Expected: False

# Multiple prerequisites
print(can_finish_tasks(4, [[1, 0], [2, 1], [3, 2]]))
# Expected: True (linear chain)

# Complex valid case
print(can_finish_tasks(4, [[1, 0], [2, 0], [3, 1], [3, 2]]))
# Expected: True

# No prerequisites
print(can_finish_tasks(3, []))
# Expected: True

# Self-loop
print(can_finish_tasks(1, [[0, 0]]))
# Expected: False
`,
      solutionCode: `from collections import deque, defaultdict


def can_finish_tasks(n, prerequisites):
    """
    Determine if all tasks can be finished given prerequisites.
    
    Time Complexity: O(V + E) — process all vertices and edges
    Space Complexity: O(V + E) — graph storage
    """
    # Build adjacency list and in-degree count
    graph = defaultdict(list)
    in_degree = [0] * n
    
    for task, prereq in prerequisites:
        graph[prereq].append(task)
        in_degree[task] += 1
    
    # Start with tasks having no prerequisites
    queue = deque()
    for i in range(n):
        if in_degree[i] == 0:
            queue.append(i)
    
    processed = 0
    
    while queue:
        task = queue.popleft()
        processed += 1
        
        # Reduce in-degree for all dependent tasks
        for dependent in graph[task]:
            in_degree[dependent] -= 1
            if in_degree[dependent] == 0:
                queue.append(dependent)
    
    # If we processed all tasks, no cycle exists
    return processed == n


# Alternative: DFS with state tracking
def can_finish_tasks_dfs(n, prerequisites):
    """
    Alternative using DFS with 3 states: unvisited, visiting, visited.
    """
    # 0 = unvisited, 1 = visiting, 2 = visited
    state = [0] * n
    graph = defaultdict(list)
    
    for task, prereq in prerequisites:
        graph[prereq].append(task)
    
    def has_cycle(node):
        if state[node] == 1:  # Currently visiting — cycle detected
            return True
        if state[node] == 2:  # Already processed
            return False
        
        state[node] = 1  # Mark as visiting
        for neighbor in graph[node]:
            if has_cycle(neighbor):
                return True
        state[node] = 2  # Mark as visited
        return False
    
    for i in range(n):
        if state[i] == 0 and has_cycle(i):
            return False
    
    return True


# ─── Test Cases ───
print(can_finish_tasks(2, [[1, 0]]))
# Expected: True

print(can_finish_tasks(2, [[1, 0], [0, 1]]))
# Expected: False

print(can_finish_tasks(4, [[1, 0], [2, 1], [3, 2]]))
# Expected: True

print(can_finish_tasks(4, [[1, 0], [2, 0], [3, 1], [3, 2]]))
# Expected: True

print(can_finish_tasks(3, []))
# Expected: True

print(can_finish_tasks(1, [[0, 0]]))
# Expected: False
`,
    },
    {
      id: "task-scheduling-order",
      slug: "task-scheduling-order",
      title: "Task Scheduling Order (Return Order)",
      content: `## Task Scheduling Order (Return Order)

<!-- voice:section_check concept="Returning valid task ordering" -->

### Problem Statement

There are a total of \`n\` tasks you have to pick, labeled from \`0\` to \`n-1\`. Some tasks may have prerequisite tasks. Given the total number of tasks and a list of prerequisite pairs, return a valid ordering of tasks to finish all tasks. If multiple valid orderings exist, return any. If impossible, return empty list.

### Examples

~~~
Input: n = 4, prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]]
Output: [0, 1, 2, 3] or [0, 2, 1, 3]
Explanation: 
- Task 0 has no prerequisites
- Tasks 1 and 2 depend on task 0
- Task 3 depends on tasks 1 and 2
~~~

~~~
Input: n = 2, prerequisites = [[1, 0], [0, 1]]
Output: []
Explanation: Cycle detected, impossible to schedule
~~~

### Approach

Similar to cycle detection, but we return the topological order:
1. Build graph and calculate in-degrees
2. Use Kahn's algorithm to get topological order
3. Return the order if all tasks processed, else empty list

<!-- voice:key_insight insight="The order in which we process nodes with in-degree 0 gives us a valid topological ordering" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(V + E)
- **Space:** O(V + E)`,
      starterCode: `from collections import deque, defaultdict


def find_task_order(n, prerequisites):
    """
    Return a valid ordering of tasks to finish all tasks.
    
    Args:
        n: int, total number of tasks (0 to n-1)
        prerequisites: List of [task, prerequisite] pairs
    
    Returns:
        List of task IDs in valid order, or empty list if impossible
    
    Example:
        >>> find_task_order(4, [[1, 0], [2, 0], [3, 1], [3, 2]])
        [0, 1, 2, 3]  # or [0, 2, 1, 3]
        >>> find_task_order(2, [[1, 0], [0, 1]])
        []
    """
    # TODO: Return topological ordering of tasks
    # Hint: Same as cycle detection but collect the order
    pass


# ─── Test Cases ───

# Valid ordering
result = find_task_order(4, [[1, 0], [2, 0], [3, 1], [3, 2]])
print(result)
# Expected: [0, 1, 2, 3] or [0, 2, 1, 3]

# Cycle
print(find_task_order(2, [[1, 0], [0, 1]]))
# Expected: []

# Linear chain
result = find_task_order(4, [[1, 0], [2, 1], [3, 2]])
print(result)
# Expected: [0, 1, 2, 3] (only valid order)

# No prerequisites
result = find_task_order(3, [])
print(sorted(result) if result else [])
# Expected: [0, 1, 2] (any order valid)

# Single task
print(find_task_order(1, []))
# Expected: [0]

# Complex case
result = find_task_order(6, [[3, 0], [3, 1], [4, 1], [4, 2], [5, 3], [5, 4]])
print(result)
# Expected: Valid topological order
`,
      solutionCode: `from collections import deque, defaultdict


def find_task_order(n, prerequisites):
    """
    Return a valid ordering of tasks to finish all tasks.
    
    Time Complexity: O(V + E)
    Space Complexity: O(V + E)
    """
    # Build graph and calculate in-degrees
    graph = defaultdict(list)
    in_degree = [0] * n
    
    for task, prereq in prerequisites:
        graph[prereq].append(task)
        in_degree[task] += 1
    
    # Start with tasks having no prerequisites
    queue = deque()
    for i in range(n):
        if in_degree[i] == 0:
            queue.append(i)
    
    result = []
    
    while queue:
        task = queue.popleft()
        result.append(task)
        
        # Process all tasks that depend on current task
        for dependent in graph[task]:
            in_degree[dependent] -= 1
            if in_degree[dependent] == 0:
                queue.append(dependent)
    
    # Return order only if all tasks were processed
    return result if len(result) == n else []


# ─── Test Cases ───
result = find_task_order(4, [[1, 0], [2, 0], [3, 1], [3, 2]])
print(result)
# Expected: [0, 1, 2, 3] or [0, 2, 1, 3]

print(find_task_order(2, [[1, 0], [0, 1]]))
# Expected: []

result = find_task_order(4, [[1, 0], [2, 1], [3, 2]])
print(result)
# Expected: [0, 1, 2, 3]

result = find_task_order(3, [])
print(sorted(result) if result else [])
# Expected: [0, 1, 2]

print(find_task_order(1, []))
# Expected: [0]

result = find_task_order(6, [[3, 0], [3, 1], [4, 1], [4, 2], [5, 3], [5, 4]])
print(result)
# Expected: Valid order like [0, 1, 2, 3, 4, 5] or similar
`,
    },
    {
      id: "all-tasks-scheduling-orders",
      slug: "all-tasks-scheduling-orders",
      title: "All Tasks Scheduling Orders",
      content: `## All Tasks Scheduling Orders

<!-- voice:section_check concept="Generating all valid topological orders" -->

### Problem Statement

Given tasks (0 to n-1) and prerequisites, find all possible orderings of tasks that satisfy all prerequisites.

### Examples

~~~
Input: n = 3, prerequisites = [[0, 1], [1, 2]]
Output: [[2, 1, 0]]
Explanation: Only one valid order: 2 -> 1 -> 0
~~~

~~~
Input: n = 4, prerequisites = [[1, 0], [2, 0]]
Output: [[0, 1, 2, 3], [0, 2, 1, 3]]
Explanation: Tasks 1 and 2 both depend on 0, but are independent of each other
~~~

### Approach

Use **backtracking** with topological sort:
1. Calculate in-degrees for all tasks
2. At each step, choose any task with in-degree 0
3. Temporarily "remove" it (decrease in-degree of neighbors)
4. Recursively find all orderings
5. Backtrack (restore in-degrees)

<!-- voice:key_insight insight="At each step, any task with in-degree 0 can be next — use backtracking to explore all possibilities" -->

<!-- voice:exercise_intro difficulty="hard" hints_available="3" -->

### Complexity

- **Time:** O(V! × E) in worst case — can be exponential
- **Space:** O(V + E) — recursion stack and graph`,
      starterCode: `from collections import defaultdict


def find_all_task_orders(n, prerequisites):
    """
    Find all possible valid orderings of tasks.
    
    Args:
        n: int, total number of tasks (0 to n-1)
        prerequisites: List of [task, prerequisite] pairs
    
    Returns:
        List of all valid orderings (each ordering is a list)
    
    Example:
        >>> find_all_task_orders(3, [[0, 1], [1, 2]])
        [[2, 1, 0]]
        >>> find_all_task_orders(4, [[1, 0], [2, 0]])
        [[0, 1, 2, 3], [0, 2, 1, 3]]
    """
    # TODO: Use backtracking with topological sort
    # Hint: Try all tasks with in-degree 0 at each step, backtrack
    pass


# ─── Test Cases ───

# Single valid order
print(find_all_task_orders(3, [[0, 1], [1, 2]]))
# Expected: [[2, 1, 0]]

# Multiple valid orders
result = find_all_task_orders(4, [[1, 0], [2, 0]])
print(result)
# Expected: [[0, 1, 2, 3], [0, 2, 1, 3]] (order may vary)

# No prerequisites
result = find_all_task_orders(3, [])
print(len(result))
# Expected: 6 (3! permutations)

# Linear chain
print(find_all_task_orders(4, [[1, 0], [2, 1], [3, 2]]))
# Expected: [[0, 1, 2, 3]] (only one order)

# More complex
result = find_all_task_orders(6, [[3, 2], [3, 0], [5, 2], [5, 0]])
print(len(result))
# Expected: Multiple valid orders
`,
      solutionCode: `from collections import defaultdict


def find_all_task_orders(n, prerequisites):
    """
    Find all possible valid orderings of tasks.
    
    Time Complexity: O(V! × E) — exponential in worst case
    Space Complexity: O(V + E) — recursion and graph
    """
    # Build graph
    graph = defaultdict(list)
    in_degree = [0] * n
    
    for task, prereq in prerequisites:
        graph[prereq].append(task)
        in_degree[task] += 1
    
    result = []
    
    def backtrack(current_order, current_in_degree):
        # Base case: all tasks scheduled
        if len(current_order) == n:
            result.append(list(current_order))
            return
        
        # Try each task with in-degree 0
        for task in range(n):
            if current_in_degree[task] == 0:
                # Choose this task
                current_order.append(task)
                
                # Save state for backtracking
                saved_changes = []
                for dependent in graph[task]:
                    if current_in_degree[dependent] > 0:
                        current_in_degree[dependent] -= 1
                        saved_changes.append(dependent)
                
                # Mark as processed
                current_in_degree[task] = -1
                
                # Recurse
                backtrack(current_order, current_in_degree)
                
                # Backtrack: restore state
                current_in_degree[task] = 0
                for dependent in saved_changes:
                    current_in_degree[dependent] += 1
                current_order.pop()
    
    backtrack([], in_degree[:])
    return result


# ─── Test Cases ───
print(find_all_task_orders(3, [[0, 1], [1, 2]]))
# Expected: [[2, 1, 0]]

result = find_all_task_orders(4, [[1, 0], [2, 0]])
print(result)
# Expected: [[0, 1, 2, 3], [0, 2, 1, 3]]

result = find_all_task_orders(3, [])
print(len(result))
# Expected: 6

print(find_all_task_orders(4, [[1, 0], [2, 1], [3, 2]]))
# Expected: [[0, 1, 2, 3]]

result = find_all_task_orders(6, [[3, 2], [3, 0], [5, 2], [5, 0]])
print(len(result))
# Expected: Multiple orders
`,
    },
    {
      id: "alien-dictionary",
      slug: "alien-dictionary",
      title: "Alien Dictionary (Verifying/Changing)",
      content: `## Alien Dictionary (Verifying/Changing)

<!-- voice:section_check concept="Deriving character order from words" -->

### Problem Statement

There is a new alien language that uses the English alphabet. However, the order of the letters is unknown to you.

You are given a list of strings \`words\` from the dictionary, where the strings are sorted lexicographically by the rules of this new language.

Derive the order of letters in this language. Return empty string if invalid (cycle detected).

### Examples

~~~
Input: words = ["wrt", "wrf", "er", "ett", "rftt"]
Output: "wertf"
Explanation: 
- From "wrt" and "wrf": t comes before f
- From "wrt" and "er": w comes before e
- From "er" and "ett": r comes before t
- From "ett" and "rftt": e comes before r
~~~

~~~
Input: words = ["z", "x"]
Output: "zx"
~~~

~~~
Input: words = ["z", "x", "z"]
Output: ""
Explanation: Invalid order (cycle)
~~~

### Approach

1. **Build graph**: Compare adjacent words to find character ordering
   - First differing character gives an edge
   - If word A is prefix of word B and A is longer, invalid
2. **Topological sort**: Get ordering, check for cycles

<!-- voice:key_insight insight="Compare adjacent words to extract character ordering — the first differing character tells us which comes first" -->

<!-- voice:exercise_intro difficulty="hard" hints_available="3" -->

### Complexity

- **Time:** O(C) where C is total characters in all words
- **Space:** O(1) — at most 26 characters`,
      starterCode: `from collections import deque, defaultdict


def alien_order(words):
    """
    Derive the order of letters in alien dictionary.
    
    Args:
        words: List of strings sorted lexicographically in alien language
    
    Returns:
        str: Order of letters, or empty string if invalid
    
    Example:
        >>> alien_order(["wrt", "wrf", "er", "ett", "rftt"])
        "wertf"
        >>> alien_order(["z", "x"])
        "zx"
        >>> alien_order(["z", "x", "z"])
        ""
    """
    # TODO: Build graph from word comparisons, then topological sort
    # Hint: Compare adjacent words to find edges
    pass


# ─── Test Cases ───

# Standard case
print(alien_order(["wrt", "wrf", "er", "ett", "rftt"]))
# Expected: "wertf" (or any valid order)

# Simple case
print(alien_order(["z", "x"]))
# Expected: "zx"

# Cycle detected
print(alien_order(["z", "x", "z"]))
# Expected: ""

# Single word
result = alien_order(["abc"])
print(sorted(result))
# Expected: "abc" (letters in any order)

# All same prefix
print(alien_order(["abc", "ab"]))
# Expected: "" (invalid: longer word before shorter)

# Multiple valid orders possible
result = alien_order(["abc", "acd"])
print(result)
# Expected: valid order with b before c, a before c
`,
      solutionCode: `from collections import deque, defaultdict


def alien_order(words):
    """
    Derive the order of letters in alien dictionary.
    
    Time Complexity: O(C) where C is total characters
    Space Complexity: O(1) — at most 26 unique chars
    """
    # Step 1: Find all unique characters
    chars = set()
    for word in words:
        for c in word:
            chars.add(c)
    
    # Step 2: Build graph by comparing adjacent words
    graph = defaultdict(set)
    in_degree = {c: 0 for c in chars}
    
    for i in range(len(words) - 1):
        word1, word2 = words[i], words[i + 1]
        
        # Check for invalid case: word2 is prefix of word1
        if len(word1) > len(word2) and word1[:len(word2)] == word2:
            return ""
        
        # Find first differing character
        for j in range(min(len(word1), len(word2))):
            if word1[j] != word2[j]:
                c1, c2 = word1[j], word2[j]
                if c2 not in graph[c1]:
                    graph[c1].add(c2)
                    in_degree[c2] += 1
                break
    
    # Step 3: Topological sort (Kahn's algorithm)
    queue = deque()
    for c in chars:
        if in_degree[c] == 0:
            queue.append(c)
    
    result = []
    while queue:
        c = queue.popleft()
        result.append(c)
        
        for neighbor in graph[c]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # Check for cycle
    if len(result) != len(chars):
        return ""
    
    return "".join(result)


# ─── Test Cases ───
print(alien_order(["wrt", "wrf", "er", "ett", "rftt"]))
# Expected: "wertf"

print(alien_order(["z", "x"]))
# Expected: "zx"

print(alien_order(["z", "x", "z"]))
# Expected: ""

result = alien_order(["abc"])
print(sorted(result))
# Expected: "abc"

print(alien_order(["abc", "ab"]))
# Expected: ""

result = alien_order(["abc", "acd"])
print(result)
# Expected: Valid order
`,
    },
    {
      id: "topological-sort-checkpoint",
      slug: "topological-sort-checkpoint",
      title: "Module Checkpoint: Topological Sort",
      content: `## Module Checkpoint: Topological Sort

<!-- voice:checkpoint_intro -->

Great work on the Topological Sort module! Let's verify your understanding.

### Quick Review

You learned:
- **Kahn's Algorithm** (BFS) for topological sorting
- **Cycle detection** in directed graphs
- Finding **one valid ordering** of tasks
- Finding **all valid orderings** using backtracking
- **Alien Dictionary** problem — deriving order from sorted words

### Quiz

**Question 1:** What does in-degree represent in topological sort?
- A) Number of outgoing edges
- B) Number of incoming edges (dependencies)
- C) Number of vertices
- D) Number of edges

**Question 2:** In Kahn's algorithm, which vertices do we start with?
- A) Highest in-degree
- B) In-degree of 0 (no dependencies)
- C) Lowest value
- D) Random vertices

**Question 3:** What does it mean if topological sort produces fewer vertices than the graph has?
- A) The graph is valid
- B) There's a cycle in the graph
- C) Some vertices are missing
- D) Algorithm error

**Question 4:** True or False: Alien Dictionary problem can be solved by comparing all pairs of words.

**Question 5:** For finding all topological orderings, what technique do we use?
- A) Dynamic programming
- B) Backtracking
- C) Binary search
- D) Greedy algorithm

### Voice Summary

Your coach will ask you to:
- Explain Kahn's algorithm step by step
- Detect cycles in a dependency graph
- Derive character ordering from sorted words
- Explain the backtracking approach for all orderings

**You're mastering the Topological Sort pattern!**`,
    },
  ],
};
