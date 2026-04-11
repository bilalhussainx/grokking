import { Module } from "../types";

export const topologicalSortModule: Module = {
  id: "topological-sort",
  title: "Topological Sort",
  description: "Learn Kahn's algorithm for ordering tasks with dependencies, detecting cycles, and finding all valid orderings in DAGs.",
  lessons: [
    {
      id: "topological-sort-intro",
      slug: "topological-sort-intro",
      title: "Introduction to Topological Sort",
      content: `# Topological Sort

**Topological sorting** produces a linear ordering of vertices in a **Directed Acyclic Graph (DAG)** such that for every edge u → v, vertex u appears before vertex v. It is the natural way to schedule tasks that have dependencies.

\`\`\`concept
{
  "title": "What is Topological Sort?",
  "variant": "mental-model",
  "content": "Think of topological sort as creating a 'to-do list' for a graph. Just like you must put on socks before shoes, topological sort ensures that every dependency (edge) is satisfied before the dependent task (vertex) appears in the final order."
}
\`\`\`

## Kahn's Algorithm (BFS-based)

The most common approach for interviews is **Kahn's algorithm**, which uses in-degree counting and a queue:

1. **Compute in-degrees:** For each node, count how many edges point to it.
2. **Initialize queue:** Add all nodes with in-degree 0 (no dependencies).
3. **Process the queue:**
   - Pop a node, add it to the sorted output.
   - For each neighbor the node points to, decrement its in-degree.
   - If a neighbor's in-degree becomes 0, add it to the queue.
4. **Check for cycles:** If the sorted output contains all nodes, the graph is a valid DAG. If not, there is a cycle.

\`\`\`algoviz
{
  "title": "Kahn's Algorithm in Action",
  "type": "array",
  "data": [0, 1, 2, 3, 4, 5],
  "frames": [
    {"highlight": [0, 1], "label": "Initial: nodes 0 and 1 have in-degree 0", "stats": {"queue": "[0, 1]", "sorted": "[]"}},
    {"highlight": [0], "label": "Process node 0, add to sorted", "stats": {"queue": "[1]", "sorted": "[0]"}},
    {"highlight": [1, 2], "label": "Process node 1, nodes 2,3 now have in-degree 0", "stats": {"queue": "[2, 3]", "sorted": "[0, 1]"}},
    {"highlight": [2], "label": "Process node 2", "stats": {"queue": "[3]", "sorted": "[0, 1, 2]"}},
    {"highlight": [3], "label": "Process node 3", "stats": {"queue": "[4, 5]", "sorted": "[0, 1, 2, 3]"}},
    {"highlight": [4], "label": "Process node 4", "stats": {"queue": "[5]", "sorted": "[0, 1, 2, 3, 4]"}},
    {"highlight": [5], "label": "Process node 5, complete!", "stats": {"queue": "[]", "sorted": "[0, 1, 2, 3, 4, 5]"}}
  ],
  "speed": 1000
}
\`\`\`

## Python Implementation

\`\`\`playground
{
  "title": "Topological Sort Implementation",
  "language": "python",
  "code": "from collections import deque, defaultdict\\n\\ndef topological_sort(vertices, edges):\\n    in_degree = {i: 0 for i in range(vertices)}\\n    graph = defaultdict(list)\\n    \\n    for u, v in edges:\\n        graph[u].append(v)\\n        in_degree[v] += 1\\n\\n    queue = deque([v for v in in_degree if in_degree[v] == 0])\\n    sorted_order = []\\n    \\n    while queue:\\n        node = queue.popleft()\\n        sorted_order.append(node)\\n        \\n        for neighbor in graph[node]:\\n            in_degree[neighbor] -= 1\\n            if in_degree[neighbor] == 0:\\n                queue.append(neighbor)\\n\\n    return sorted_order if len(sorted_order) == vertices else []\\n\\n# Test with a simple DAG\\nvertices = 6\\nedges = [(0, 2), (0, 3), (1, 2), (1, 4), (2, 3), (3, 4), (3, 5)]\\nresult = topological_sort(vertices, edges)\\nprint(f\\"Topological order: {result}\\")",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Understanding Topological Sort",
  "questions": [
    {
      "question": "What happens if a graph contains a cycle?",
      "options": ["The algorithm returns an empty list", "The algorithm returns a partial ordering", "The algorithm throws an error", "The algorithm still works but returns a random order"],
      "answer": 0,
      "explanation": "Kahn's algorithm detects cycles by checking if all vertices were processed. If the sorted order length is less than the total vertices, it indicates a cycle exists, and the algorithm returns an empty list."
    },
    {
      "question": "What is the time complexity of Kahn's algorithm?",
      "options": ["O(V²)", "O(V + E)", "O(V × E)", "O(E log V)"],
      "answer": 1,
      "explanation": "Kahn's algorithm processes each vertex and edge exactly once, resulting in O(V + E) time complexity, where V is the number of vertices and E is the number of edges."
    },
    {
      "question": "Which nodes are added to the queue initially?",
      "options": ["All nodes with out-degree 0", "All nodes with in-degree 0", "The first node in the graph", "Randomly selected nodes"],
      "answer": 1,
      "explanation": "Nodes with in-degree 0 have no dependencies, so they can be processed first. These nodes are added to the queue initially."
    }
  ]
}
\`\`\`

## Key Points

- A DAG always has at least one valid topological ordering.
- A graph with a cycle has **no** valid topological ordering.
- Multiple valid orderings may exist if nodes at the same level have no mutual dependencies.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Common Mistake: Not checking for cycles",
    "code": "def topological_sort_no_cycle_check(vertices, edges):\\n    # ... build graph ...\\n    queue = deque([v for v in in_degree if in_degree[v] == 0])\\n    sorted_order = []\\n    \\n    while queue:\\n        node = queue.popleft()\\n        sorted_order.append(node)\\n        # ... process neighbors ...\\n    \\n    return sorted_order  # Always returns something, even with cycles!"
  },
  "after": {
    "label": "Correct: Always validate the result",
    "code": "def topological_sort(vertices, edges):\\n    # ... build graph ...\\n    queue = deque([v for v in in_degree if in_degree[v] == 0])\\n    sorted_order = []\\n    \\n    while queue:\\n        node = queue.popleft()\\n        sorted_order.append(node)\\n        # ... process neighbors ...\\n    \\n    # Critical: Check if we processed all vertices\\n    return sorted_order if len(sorted_order) == vertices else []"
  }
}
\`\`\`

## When to Use

- Task scheduling with prerequisites
- Build systems (compile order)
- Course prerequisite planning
- Any problem involving dependency resolution

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Topological sort only works on Directed Acyclic Graphs (DAGs)",
    "Kahn's algorithm uses in-degree counting and BFS with O(V + E) complexity",
    "Cycle detection is built-in: if result length < vertices, a cycle exists",
    "Multiple valid orderings are possible for the same DAG",
    "Always use the cycle check to validate your result"
  ]
}
\`\`\``,
    },
    {
      id: "topo-sort-basic",
      slug: "topo-sort-basic",
      title: "Topological Sort",
      content: `# Topological Sort

## Problem Statement

Given a number of tasks labeled from 0 to \`n-1\` and a list of dependency pairs \`[a, b]\` meaning task \`a\` must be done before task \`b\`, find a valid ordering of all tasks. If multiple valid orderings exist, return any one.

\`\`\`concept
{
  "title": "What is a Topological Sort?",
  "variant": "mental-model",
  "content": "Think of topological sort as getting dressed in the morning: you must put on socks before shoes, but you can choose whether to wear a shirt or pants first. The algorithm finds one valid sequence where every dependency is satisfied before the task that needs it."
}
\`\`\`

## Examples

**Example 1:**
\`\`\`
Input: tasks = 4, prerequisites = [[3,2],[3,0],[2,0],[2,1]]
Output: [3, 2, 0, 1] or [3, 2, 1, 0]
Explanation: Task 3 has no prerequisites. Task 2 depends on 3. Tasks 0 and 1 depend on 2.
\`\`\`

**Example 2:**
\`\`\`
Input: tasks = 3, prerequisites = [[0,1],[1,2]]
Output: [0, 1, 2]
\`\`\`

\`\`\`algoviz
{
  "title": "Kahn's Algorithm Step-by-Step",
  "type": "array",
  "data": [0, 1, 2, 3],
  "frames": [
    { "highlight": [3], "label": "Start with in-degree 0: task 3", "stats": {"queue": "[3]", "order": "[]"} },
    { "highlight": [2], "label": "Process 3 → reduce in-degree of 2 to 0", "stats": {"queue": "[2]", "order": "[3]"} },
    { "highlight": [0, 1], "label": "Process 2 → reduce in-degree of 0,1 to 0", "stats": {"queue": "[0,1]", "order": "[3,2]"} },
    { "highlight": [], "label": "Process 0 → no dependents", "stats": {"queue": "[1]", "order": "[3,2,0]"} },
    { "highlight": [], "label": "Process 1 → complete", "stats": {"queue": "[]", "order": "[3,2,0,1]"} }
  ],
  "speed": 1000
}
\`\`\`

## Approach

Apply Kahn's algorithm directly:

1. Build an adjacency list and in-degree map from the prerequisite pairs.
2. Start with all tasks that have in-degree 0.
3. Process the queue: for each completed task, reduce the in-degree of its dependents. When a dependent reaches in-degree 0, it is ready.
4. Return the processing order.

\`\`\`trace
{
  "title": "Kahn's Algorithm Execution Trace",
  "language": "python",
  "code": "from collections import deque, defaultdict\\n\\ndef topological_sort(n, prerequisites):\\n    # Build graph and in-degree count\\n    graph = defaultdict(list)\\n    in_degree = [0] * n\\n    \\n    for a, b in prerequisites:\\n        graph[a].append(b)\\n        in_degree[b] += 1\\n    \\n    # Find all nodes with in-degree 0\\n    queue = deque([i for i in range(n) if in_degree[i] == 0])\\n    result = []\\n    \\n    while queue:\\n        node = queue.popleft()\\n        result.append(node)\\n        \\n        # Reduce in-degree for all neighbors\\n        for neighbor in graph[node]:\\n            in_degree[neighbor] -= 1\\n            if in_degree[neighbor] == 0:\\n                queue.append(neighbor)\\n    \\n    return result if len(result) == n else []",
  "frames": [
    { "line": 4, "vars": {"n": 4, "prerequisites": "[[3,2],[3,0],[2,0],[2,1]]"}, "note": "Initialize data structures", "stdout": "" },
    { "line": 7, "vars": {"graph": "defaultdict(list)", "in_degree": "[0,0,0,0]"}, "note": "Building graph from prerequisites", "stdout": "" },
    { "line": 14, "vars": {"graph": "{3:[2,0], 2:[0,1]}", "in_degree": "[2,1,1,0]"}, "note": "Graph built - task 3 has no dependencies", "stdout": "" },
    { "line": 17, "vars": {"queue": "deque([3])", "result": "[]"}, "note": "Start with in-degree 0 nodes", "stdout": "" },
    { "line": 20, "vars": {"node": 3, "queue": "deque([])", "result": "[3]"}, "note": "Process task 3", "stdout": "" },
    { "line": 25, "vars": {"in_degree": "[1,0,0,0]"}, "note": "Reduced in-degrees of 2 and 0", "stdout": "" },
    { "line": 17, "vars": {"queue": "deque([2])"}, "note": "Task 2 now has in-degree 0", "stdout": "" }
  ],
  "speed": 800
}
\`\`\`

**Time Complexity:** O(V + E) where V is number of tasks and E is number of dependencies.
**Space Complexity:** O(V + E) for the graph and in-degree map.

\`\`\`quiz
{
  "title": "Topological Sort Fundamentals",
  "questions": [
    {
      "question": "What type of graph can be topologically sorted?",
      "options": ["Any directed graph", "Only DAGs (Directed Acyclic Graphs)", "Any undirected graph", "Only complete graphs"],
      "answer": 1,
      "explanation": "Topological sorting is only possible for DAGs. If a graph contains a cycle, no valid ordering exists where all dependencies are satisfied."
    },
    {
      "question": "In Kahn's algorithm, what does in-degree represent?",
      "options": ["Number of outgoing edges", "Number of incoming edges", "Total edges in the graph", "Number of nodes processed"],
      "answer": 1,
      "explanation": "In-degree counts how many edges point TO a node, representing how many prerequisites must be completed before that task can start."
    },
    {
      "question": "If Kahn's algorithm produces an ordering with fewer than n elements, what does this indicate?",
      "options": ["The algorithm is incomplete", "There are multiple valid orderings", "The graph contains a cycle", "The input was invalid"],
      "answer": 2,
      "explanation": "When the result length is less than n, it means some nodes couldn't be processed due to cyclic dependencies - the graph has a cycle."
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Cycle Detection",
  "content": "Always check if the result length equals the number of tasks. If it's shorter, your graph contains a cycle and no valid ordering exists!"
}
\`\`\`

\`\`\`playground
{
  "title": "Try Topological Sort",
  "language": "python",
  "code": "from collections import deque, defaultdict\\n\\ndef topological_sort(n, prerequisites):\\n    # Build graph and in-degree count\\n    graph = defaultdict(list)\\n    in_degree = [0] * n\\n    \\n    for a, b in prerequisites:\\n        graph[a].append(b)\\n        in_degree[b] += 1\\n    \\n    # Find all nodes with in-degree 0\\n    queue = deque([i for i in range(n) if in_degree[i] == 0])\\n    result = []\\n    \\n    while queue:\\n        node = queue.popleft()\\n        result.append(node)\\n        \\n        # Reduce in-degree for all neighbors\\n        for neighbor in graph[node]:\\n            in_degree[neighbor] -= 1\\n            if in_degree[neighbor] == 0:\\n                queue.append(neighbor)\\n    \\n    return result if len(result) == n else []\\n\\n# Test with different inputs\\ntest_cases = [\\n    (4, [[3,2],[3,0],[2,0],[2,1]]),\\n    (3, [[0,1],[1,2]]),\\n    (2, [[0,1],[1,0]])  # Cycle case\\n]\\n\\nfor n, prereqs in test_cases:\\n    result = topological_sort(n, prereqs)\\n    print(f\\"n={n}, prereqs={prereqs}\\")\\n    print(f\\"Result: {result}\\")\\n    print()",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Topological sort finds a valid ordering where all dependencies are satisfied before dependent tasks",
    "Kahn's algorithm uses in-degree counting and processes nodes with no prerequisites first",
    "Time complexity is O(V + E) - optimal for this problem",
    "Always verify the result length equals n to detect cycles",
    "Multiple valid orderings may exist - Kahn's gives one valid solution"
  ]
}
\`\`\``,
      starterCode: `from collections import deque, defaultdict

def topological_sort(tasks, prerequisites):
    # TODO: Return a valid topological ordering of tasks
    pass

# Test cases
print(topological_sort(4, [[3,2],[3,0],[2,0],[2,1]]))
# Expected: [3, 2, 0, 1] or [3, 2, 1, 0]

print(topological_sort(3, [[0,1],[1,2]]))
# Expected: [0, 1, 2]
`,
      solutionCode: `from collections import deque, defaultdict

def topological_sort(tasks, prerequisites):
    in_degree = {i: 0 for i in range(tasks)}
    graph = defaultdict(list)

    for parent, child in prerequisites:
        graph[parent].append(child)
        in_degree[child] += 1

    queue = deque([node for node in in_degree if in_degree[node] == 0])
    sorted_order = []

    while queue:
        node = queue.popleft()
        sorted_order.append(node)
        for child in graph[node]:
            in_degree[child] -= 1
            if in_degree[child] == 0:
                queue.append(child)

    if len(sorted_order) != tasks:
        return []  # Cycle detected

    return sorted_order

# Test cases
print(topological_sort(4, [[3,2],[3,0],[2,0],[2,1]]))
# Expected: [3, 2, 0, 1] or [3, 2, 1, 0]

print(topological_sort(3, [[0,1],[1,2]]))
# Expected: [0, 1, 2]
`,
    },
    {
      id: "topo-sort-can-schedule",
      slug: "topo-sort-can-schedule",
      title: "Tasks Scheduling",
      content: `# Tasks Scheduling

Given a number of tasks and a list of prerequisite pairs, determine if it is possible to schedule **all** tasks. In other words, check if the dependency graph contains a cycle.

\`\`\`concept
{
  "title": "Topological Sort & DAGs",
  "variant": "mental-model",
  "content": "Topological sort is a linear ordering of vertices in a directed graph such that for every directed edge u → v, u comes before v in the ordering. This is only possible if the graph is a Directed Acyclic Graph (DAG) — no directed cycles. Kahn's algorithm is a BFS-based method that repeatedly removes nodes with zero incoming edges to produce such an ordering."
}
\`\`\`

## Examples

**Example 1:**
\`\`\`
Input: tasks = 3, prerequisites = [[0,1],[1,2]]
Output: True
Explanation: Linear chain 0→1→2, no cycle.
\`\`\`

**Example 2:**
\`\`\`
Input: tasks = 3, prerequisites = [[0,1],[1,2],[2,0]]
Output: False
Explanation: Cycle exists: 0→1→2→0.
\`\`\`

**Example 3:**
\`\`\`
Input: tasks = 6, prerequisites = [[2,5],[0,5],[0,4],[1,4],[3,2],[1,3]]
Output: True
\`\`\`

## Approach

Run Kahn's algorithm and check if all tasks end up in the sorted order:

1. Build the graph and compute in-degrees.
2. Process nodes with in-degree 0 via a queue.
3. Count how many nodes get processed.
4. If the count equals the total number of tasks, all tasks can be scheduled (no cycle). Otherwise, a cycle exists.

A cycle prevents some nodes from ever reaching in-degree 0, so they never enter the queue.

\`\`\`algoviz
{
  "title": "Kahn's Algorithm on Example 2",
  "type": "array",
  "data": [0, 1, 2],
  "frames": [
    { "highlight": [0], "label": "Start with in-degree 0 nodes", "stats": { "queue": "[0]", "processed": 0 } },
    { "highlight": [1], "label": "Process 0, reduce in-degree of 1", "stats": { "queue": "[1]", "processed": 1 } },
    { "highlight": [2], "label": "Process 1, reduce in-degree of 2", "stats": { "queue": "[2]", "processed": 2 } },
    { "highlight": [], "label": "Process 2, reduce in-degree of 0 → now 0 again", "stats": { "queue": "[0]", "processed": 3 } },
    { "highlight": [], "label": "Cycle detected: 0 already processed", "stats": { "queue": "[]", "processed": 3 } }
  ],
  "speed": 1000
}
\`\`\`

**Time Complexity:** O(V + E)  
**Space Complexity:** O(V + E)

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "What does it mean if Kahn's algorithm finishes with fewer than V nodes processed?",
      "options": [
        "The graph is a DAG",
        "The graph has a cycle",
        "The graph is undirected",
        "The algorithm is incorrect"
      ],
      "answer": 1,
      "explanation": "If the processed count < V, some nodes were never reachable with in-degree 0, indicating a cycle."
    },
    {
      "question": "Which data structure is central to Kahn's algorithm?",
      "options": ["Stack", "Priority Queue", "Queue", "Deque"],
      "answer": 2,
      "explanation": "A FIFO queue holds all current in-degree 0 nodes ready to be processed next."
    },
    {
      "question": "How many valid topological orders can a DAG have?",
      "options": [
        "Exactly one",
        "At most one",
        "Zero or more",
        "One or more"
      ],
      "answer": 3,
      "explanation": "A DAG has at least one valid order if it is acyclic; many DAGs admit multiple valid orderings."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Implement Task Scheduling",
  "language": "python",
  "code": "from collections import deque, defaultdict\\n\\ndef can_schedule(tasks, prerequisites):\\n    graph = defaultdict(list)\\n    in_degree = [0] * tasks\\n    \\n    # Build graph and in-degree count\\n    for u, v in prerequisites:\\n        graph[u].append(v)\\n        in_degree[v] += 1\\n    \\n    queue = deque([i for i in range(tasks) if in_degree[i] == 0])\\n    processed = 0\\n    \\n    while queue:\\n        node = queue.popleft()\\n        processed += 1\\n        for neighbor in graph[node]:\\n            in_degree[neighbor] -= 1\\n            if in_degree[neighbor] == 0:\\n                queue.append(neighbor)\\n    \\n    return processed == tasks\\n\\n# Quick test\\nprint(can_schedule(3, [[0,1],[1,2]]))  # True\\nprint(can_schedule(3, [[0,1],[1,2],[2,0]]))  # False",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Topological sort only works on Directed Acyclic Graphs (DAGs).",
    "Kahn's algorithm uses BFS and in-degree counting to produce a valid ordering.",
    "If the algorithm processes fewer than V nodes, the graph contains a cycle.",
    "Time and space complexity are both O(V + E), optimal for this problem."
  ]
}
\`\`\``,
      starterCode: `from collections import deque, defaultdict

def can_schedule(tasks, prerequisites):
    # TODO: Return True if all tasks can be scheduled, False if cycle exists
    pass

# Test cases
print(can_schedule(3, [[0,1],[1,2]]))
# Expected: True

print(can_schedule(3, [[0,1],[1,2],[2,0]]))
# Expected: False

print(can_schedule(6, [[2,5],[0,5],[0,4],[1,4],[3,2],[1,3]]))
# Expected: True
`,
      solutionCode: `from collections import deque, defaultdict

def can_schedule(tasks, prerequisites):
    in_degree = {i: 0 for i in range(tasks)}
    graph = defaultdict(list)

    for parent, child in prerequisites:
        graph[parent].append(child)
        in_degree[child] += 1

    queue = deque([node for node in in_degree if in_degree[node] == 0])
    count = 0

    while queue:
        node = queue.popleft()
        count += 1
        for child in graph[node]:
            in_degree[child] -= 1
            if in_degree[child] == 0:
                queue.append(child)

    return count == tasks

# Test cases
print(can_schedule(3, [[0,1],[1,2]]))
# Expected: True

print(can_schedule(3, [[0,1],[1,2],[2,0]]))
# Expected: False

print(can_schedule(6, [[2,5],[0,5],[0,4],[1,4],[3,2],[1,3]]))
# Expected: True
`,
    },
    {
      id: "topo-sort-order",
      slug: "topo-sort-order",
      title: "Tasks Scheduling Order",
      content: `# Tasks Scheduling Order

## Problem Statement

Given a number of tasks and prerequisite pairs, find the **execution order** of all tasks. If tasks cannot all be scheduled (cycle exists), return an empty list.

This is the same as basic topological sort but with explicit cycle detection and an empty-list return for invalid inputs.

## Examples

**Example 1:**
\`\`\`
Input: tasks = 6, prerequisites = [[2,5],[0,5],[0,4],[1,4],[3,2],[1,3]]
Output: [0, 1, 3, 2, 4, 5] (one valid ordering)
\`\`\`

**Example 2:**
\`\`\`
Input: tasks = 3, prerequisites = [[0,1],[1,2],[2,0]]
Output: [] (cycle detected)
\`\`\`

\`\`\`concept
{
  "title": "Topological Sort is Only for DAGs",
  "variant": "rule",
  "content": "Topological ordering exists only in Directed Acyclic Graphs (DAGs). If any directed cycle is present, no valid ordering can satisfy all dependencies. Kahn's algorithm detects this automatically: if the final order contains fewer nodes than the graph, a cycle exists."
}
\`\`\`

## Approach

Standard Kahn's algorithm with the cycle check:

1. Build adjacency list and in-degree counts.
2. Initialize queue with all in-degree-0 nodes.
3. Process the queue, building the sorted order and decrementing neighbor in-degrees.
4. If the sorted order has fewer nodes than the total task count, return an empty list (cycle detected).

This combines the scheduling feasibility check with the ordering output in a single pass.

**Time Complexity:** O(V + E).  
**Space Complexity:** O(V + E).

\`\`\`algoviz
{
  "title": "Kahn's Algorithm on tasks=6",
  "type": "array",
  "data": [0, 1, 2, 3, 4, 5],
  "frames": [
    { "highlight": [0,1], "label": "Start with in-degree 0: 0,1", "stats": {"queue":"[0,1]","order":"[]"} },
    { "highlight": [0], "label": "Pop 0, append to order, reduce neighbors", "stats": {"queue":"[1]","order":"[0]"} },
    { "highlight": [1,3], "label": "Pop 1, append, reduce 3 & 4", "stats": {"queue":"[3]","order":"[0,1]"} },
    { "highlight": [3], "label": "Pop 3, append, reduce 2", "stats": {"queue":"[2]","order":"[0,1,3]"} },
    { "highlight": [2], "label": "Pop 2, append, reduce 4 & 5", "stats": {"queue":"[4]","order":"[0,1,3,2]"} },
    { "highlight": [4], "label": "Pop 4, append, reduce 5", "stats": {"queue":"[5]","order":"[0,1,3,2,4]"} },
    { "highlight": [5], "label": "Pop 5, append, queue empty", "stats": {"queue":"[]","order":"[0,1,3,2,4,5]"} }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Multiple Valid Orders",
  "content": "Most DAGs admit many valid topological orders. Kahn's output depends on the queue discipline (FIFO gives one arbitrary order). If you need the lexicographically smallest order, replace the queue with a min-heap."
}
\`\`\`

\`\`\`quiz
{
  "title": "Quick Check: Kahn's Invariants",
  "questions": [
    {
      "question": "When can a node first enter Kahn's queue?",
      "options": ["As soon as it is created", "When its in-degree becomes 0", "When it has the smallest ID", "Only after all its neighbors are processed"],
      "answer": 1,
      "explanation": "Nodes are enqueued only when their in-degree drops to 0, meaning all their prerequisites have been scheduled."
    },
    {
      "question": "How do we detect a cycle at the end?",
      "options": ["Check if the queue is empty", "Check if the topological list length < total vertices", "Check if any in-degree is still positive", "Run DFS again"],
      "answer": 1,
      "explanation": "If the final order contains fewer vertices than the graph, some nodes (those in cycles) were never enqueued."
    },
    {
      "question": "What is the worst-case time complexity?",
      "options": ["O(V^2)", "O(V+E)", "O(E log V)", "O(V log E)"],
      "answer": 1,
      "explanation": "Each vertex and edge is processed once: O(V) to initialize in-degrees and O(E) to relax edges during BFS."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Implement Kahn's with Cycle Check",
  "language": "python",
  "code": "from collections import deque, defaultdict\\n\\ndef schedule_order(tasks, prerequisites):\\n    adj = defaultdict(list)\\n    in_degree = [0] * tasks\\n    \\n    # Build graph and in-degrees\\n    for u, v in prerequisites:\\n        adj[u].append(v)\\n        in_degree[v] += 1\\n    \\n    q = deque([i for i in range(tasks) if in_degree[i] == 0])\\n    order = []\\n    \\n    while q:\\n        node = q.popleft()\\n        order.append(node)\\n        for nei in adj[node]:\\n            in_degree[nei] -= 1\\n            if in_degree[nei] == 0:\\n                q.append(nei)\\n    \\n    return order if len(order) == tasks else []\\n\\n# --- test ---\\nprint(schedule_order(6, [[2,5],[0,5],[0,4],[1,4],[3,2],[1,3]]))\\nprint(schedule_order(3, [[0,1],[1,2],[2,0]]))",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Kahn's algorithm produces a valid task order in O(V+E) time and space.",
    "Cycle detection is built-in: fewer processed nodes than total implies a cycle.",
    "Replace the FIFO queue with a min-heap to obtain lexicographically smallest orders.",
    "The same framework applies to course scheduling, build systems, and data pipelines."
  ]
}
\`\`\``,
      starterCode: `from collections import deque, defaultdict

def find_scheduling_order(tasks, prerequisites):
    # TODO: Return task execution order, or [] if cycle exists
    pass

# Test cases
print(find_scheduling_order(6, [[2,5],[0,5],[0,4],[1,4],[3,2],[1,3]]))
# Expected: [0, 1, 3, 2, 4, 5] (or another valid ordering)

print(find_scheduling_order(3, [[0,1],[1,2],[2,0]]))
# Expected: []
`,
      solutionCode: `from collections import deque, defaultdict

def find_scheduling_order(tasks, prerequisites):
    in_degree = {i: 0 for i in range(tasks)}
    graph = defaultdict(list)

    for parent, child in prerequisites:
        graph[parent].append(child)
        in_degree[child] += 1

    queue = deque([node for node in in_degree if in_degree[node] == 0])
    sorted_order = []

    while queue:
        node = queue.popleft()
        sorted_order.append(node)
        for child in graph[node]:
            in_degree[child] -= 1
            if in_degree[child] == 0:
                queue.append(child)

    if len(sorted_order) != tasks:
        return []

    return sorted_order

# Test cases
print(find_scheduling_order(6, [[2,5],[0,5],[0,4],[1,4],[3,2],[1,3]]))
# Expected: [0, 1, 3, 2, 4, 5] (or another valid ordering)

print(find_scheduling_order(3, [[0,1],[1,2],[2,0]]))
# Expected: []
`,
    },
    {
      id: "topo-sort-all-orders",
      slug: "topo-sort-all-orders",
      title: "All Tasks Scheduling Orders",
      content: `# All Tasks Scheduling Orders

## Problem Statement

Given a number of tasks and prerequisite pairs, find **all possible valid orderings** of the tasks.

\`\`\`concept
{"title": "Why \\"All\\" Orderings Matter", "variant": "insight", "content": "Many real-world pipelines (build systems, course curricula, data-ETL) admit more than one valid run order. Enumerating every legal sequence lets you pick the one that optimizes secondary goals such as machine utilization, human availability, or cache locality."}
\`\`\`

## Examples

**Example 1:**
\`\`\`
Input: tasks = 3, prerequisites = [[0,1],[1,2]]
Output: [[0, 1, 2]]
Explanation: Only one valid ordering exists.
\`\`\`

**Example 2:**
\`\`\`
Input: tasks = 4, prerequisites = [[3,2],[3,0],[2,0],[2,1]]
Output: [[3,2,0,1],[3,2,1,0]]
Explanation: After task 3 and 2, tasks 0 and 1 can be done in either order.
\`\`\`

## Approach

Use **backtracking** with Kahn's algorithm:

1. At each step, identify all nodes with in-degree 0 (the "sources").
2. For each source, choose it as the next task in the ordering, decrement in-degrees of its neighbors, and recurse.
3. After the recursive call, backtrack: restore in-degrees and remove the source from the current ordering.
4. When all tasks are in the ordering, record it as a valid result.

This explores all valid topological orderings by branching at each point where multiple sources are available.

\`\`\`trace
{"title": "Backtracking on Example 2", "language": "python", "code": "def allOrders(n, edges):\\n    adj = [[] for _ in range(n)]\\n    indeg = [0]*n\\n    for u,v in edges:\\n        adj[u].append(v)\\n        indeg[v] += 1\\n    path, res = [], []\\n    def dfs():\\n        if len(path) == n:\\n            res.append(path.copy())\\n            return\\n        # try every current source\\n        for x in range(n):\\n            if indeg[x] == 0 and x not in path:\\n                # choose\\n                path.append(x)\\n                for y in adj[x]:\\n                    indeg[y] -= 1\\n                # explore\\n                dfs()\\n                # un-choose\\n                path.pop()\\n                for y in adj[x]:\\n                    indeg[y] += 1\\n    dfs()\\n    return res\\n\\nprint(allOrders(4, [[3,2],[3,0],[2,0],[2,1]]))", "frames": [{"line": 1, "vars": {"n": 4, "edges": [[3,2],[3,0],[2,0],[2,1]], "adj": [[],[],[0,1],[2,0]], "indeg": [1,1,1,0]}, "note": "initial state"}, {"line": 10, "vars": {"path": [], "x": 3}, "note": "only source is 3"}, {"line": 12, "vars": {"path": [3], "indeg": [0,1,1,0]}, "stdout": ""}, {"line": 15, "vars": {"x": 2}, "note": "after 3, 2 becomes source"}, {"line": 12, "vars": {"path": [3,2], "indeg": [0,0,1,0]}, "stdout": ""}, {"line": 15, "vars": {"x": 0}, "note": "0 and 1 both sources now"}, {"line": 12, "vars": {"path": [3,2,0], "indeg": [0,0,1,0]}, "stdout": ""}, {"line": 10, "vars": {"path": [3,2,0,1]}, "note": "complete order found", "stdout": ""}, {"line": 19, "vars": {"path": [3,2]}, "note": "backtrack to try 1 before 0"}, {"line": 15, "vars": {"x": 1}, "note": "choose 1 next"}, {"line": 12, "vars": {"path": [3,2,1,0]}, "note": "second order found", "stdout": ""}], "speed": 700}
\`\`\`

\`\`\`compare
{"variant": "good-bad", "before": {"label": "Naïve idea: generate every permutation", "code": "from itertools import permutations\\ndef allOrders(n, edges):\\n    def valid(order):\\n        pos = {v:i for i,v in enumerate(order)}\\n        for u,v in edges:\\n            if pos[u] > pos[v]:\\n                return False\\n        return True\\n    return [p for p in permutations(range(n)) if valid(p)]"}, "after": {"label": "Backtracking with pruning", "code": "def allOrders(n, edges):\\n    adj = [[] for _ in range(n)]\\n    indeg = [0]*n\\n    for u,v in edges:\\n        adj[u].append(v); indeg[v] += 1\\n    res, path = [], []\\n    def dfs():\\n        if len(path) == n:\\n            res.append(path.copy()); return\\n        for x in range(n):\\n            if indeg[x] == 0 and x not in path:\\n                path.append(x)\\n                for y in adj[x]: indeg[y] -= 1\\n                dfs()\\n                path.pop()\\n                for y in adj[x]: indeg[y] += 1\\n    dfs()\\n    return res"}}
\`\`\`

\`\`\`quiz
{"title": "Quick Check", "questions": [{"question": "In the backtracking step, why do we restore in-degrees?", "options": ["To keep the graph unchanged for the next branch", "To save memory", "To detect cycles"], "answer": 0, "explanation": "Each branch must see the original in-degrees so that later sources are computed correctly."}, {"question": "How many valid orderings can a DAG with V vertices have in the worst case?", "options": ["V", "V²", "V!"], "answer": 2, "explanation": "An edge-less graph allows any permutation, giving V! orderings."}, {"question": "Which operation dominates the time complexity?", "options": ["Backtracking recursion", "In-degree updates", "Output formatting"], "answer": 0, "explanation": "The recursion tree can have V! leaves, each costing O(E) work."}]}
\`\`\`

**Time Complexity:** O(V! * E) in the worst case — the number of valid orderings can be factorial.  
**Space Complexity:** O(V! * V) for storing all orderings.

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Branch on sources, not on every vertex, to prune the search space early.", "Backtracking needs both in-degree restoration and path removal to stay correct.", "Factorial output size is unavoidable; optimize for early pruning, not for output size."]}
\`\`\``,
      starterCode: `from collections import defaultdict, deque

def all_topological_sorts(tasks, prerequisites):
    # TODO: Return all valid topological orderings
    result = []
    return result

# Test cases
print(all_topological_sorts(3, [[0,1],[1,2]]))
# Expected: [[0, 1, 2]]

print(all_topological_sorts(4, [[3,2],[3,0],[2,0],[2,1]]))
# Expected: [[3, 2, 0, 1], [3, 2, 1, 0]]
`,
      solutionCode: `from collections import defaultdict, deque

def all_topological_sorts(tasks, prerequisites):
    in_degree = {i: 0 for i in range(tasks)}
    graph = defaultdict(list)

    for parent, child in prerequisites:
        graph[parent].append(child)
        in_degree[child] += 1

    result = []

    def backtrack(current_order, in_deg):
        # Find all current sources (in-degree 0)
        sources = [node for node in range(tasks) if in_deg[node] == 0 and node not in current_order]

        if not sources:
            if len(current_order) == tasks:
                result.append(list(current_order))
            return

        for source in sources:
            current_order.append(source)
            # Decrement in-degrees
            for child in graph[source]:
                in_deg[child] -= 1

            backtrack(current_order, in_deg)

            # Backtrack
            current_order.pop()
            for child in graph[source]:
                in_deg[child] += 1

    backtrack([], dict(in_degree))
    return result

# Test cases
print(all_topological_sorts(3, [[0,1],[1,2]]))
# Expected: [[0, 1, 2]]

print(all_topological_sorts(4, [[3,2],[3,0],[2,0],[2,1]]))
# Expected: [[3, 2, 0, 1], [3, 2, 1, 0]]
`,
    },
    {
      id: "topo-sort-course-schedule",
      slug: "topo-sort-course-schedule",
      title: "Course Schedule",
      content: `# Course Schedule

\`\`\`concept
{
  "title": "Prerequisite Direction Matters",
  "variant": "rule",
  "content": "In the input pair \`[a, b]\`, course \`b\` is the prerequisite for course \`a\`. Therefore the directed edge is **b → a**. Mis-reading this direction is the #1 source of WA (Wrong Answer) submissions."
}
\`\`\`

## Problem Statement

You have \`numCourses\` courses labeled \`0 … numCourses-1\` and a list of prerequisite pairs.  
Pair \`[a, b]\` means “to take course \`a\` you must first finish course \`b\`”.  
Return \`True\` if you can finish every course, otherwise \`False\` (cycle detected).

## Examples

| Input | Expected | Why |
|-------|----------|-----|
| \`numCourses = 2\`, \`prerequisites = [[1, 0]]\` | \`True\` | 0 → 1, no cycle |
| \`numCourses = 2\`, \`prerequisites = [[1, 0], [0, 1]]\` | \`False\` | 0 ↔ 1 cycle |
| \`numCourses = 4\`, \`prerequisites = [[1,0],[2,1],[3,2]]\` | \`True\` | 0→1→2→3, linear chain |

\`\`\`algoviz
{
  "title": "Kahn's BFS on Example 3",
  "type": "array",
  "data": [0, 1, 2, 3],
  "frames": [
    { "highlight": [0], "label": "Queue starts with course 0 (in-degree 0)", "stats": {"queue":"[0]","processed":0} },
    { "highlight": [0,1], "label": "Pop 0, decrement 1's in-degree → 0, enqueue 1", "stats": {"queue":"[1]","processed":1} },
    { "highlight": [1,2], "label": "Pop 1, decrement 2's in-degree → 0, enqueue 2", "stats": {"queue":"[2]","processed":2} },
    { "highlight": [2,3], "label": "Pop 2, decrement 3's in-degree → 0, enqueue 3", "stats": {"queue":"[3]","processed":3} },
    { "highlight": [3], "label": "Pop 3, nothing left. All 4 processed ⇒ no cycle", "stats": {"queue":"[]","processed":4} }
  ],
  "speed": 1000
}
\`\`\`

## Kahn’s Algorithm Template

1. Build adjacency list and in-degree array.  
2. Enqueue every node whose in-degree is 0.  
3. While queue not empty  
   - Pop node \`u\`, append to topo order.  
   - For each neighbor \`v\` of \`u\`:  
     – \`in_degree[v] -= 1\`  
     – If \`in_degree[v] == 0\`: enqueue \`v\`  
4. If \`len(topo_order) == numCourses\` ⇒ DAG ⇒ return \`True\`  
   Else ⇒ cycle ⇒ return \`False\`

\`\`\`playground
{
  "title": "Cycle-Safe Course Scheduler",
  "language": "python",
  "code": "from collections import deque\\n\\ndef can_finish(numCourses: int, prerequisites: list[list[int]]) -> bool:\\n    adj = [[] for _ in range(numCourses)]\\n    indeg = [0] * numCourses\\n    \\n    # build graph: b -> a\\n    for a, b in prerequisites:\\n        adj[b].append(a)\\n        indeg[a] += 1\\n    \\n    q = deque([i for i in range(numCourses) if indeg[i] == 0])\\n    processed = 0\\n    \\n    while q:\\n        u = q.popleft()\\n        processed += 1\\n        for v in adj[u]:\\n            indeg[v] -= 1\\n            if indeg[v] == 0:\\n                q.append(v)\\n    \\n    return processed == numCourses\\n\\n# quick test\\nprint(can_finish(4, [[1,0],[2,1],[3,2]]))  # True\\nprint(can_finish(2, [[1,0],[0,1]]))        # False",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "If the final topo list contains exactly \`numCourses-1\` nodes, what does that imply?",
      "options": ["Graph is a DAG", "Graph has at least one cycle", "Kahn’s algorithm failed", "Need to run DFS to be sure"],
      "answer": 1,
      "explanation": "Missing one node means its in-degree never reached 0, so it sits on a cycle."
    },
    {
      "question": "Which data structure is fundamental to Kahn’s algorithm?",
      "options": ["Max-heap", "Queue", "Stack", "Disjoint-set"],
      "answer": 1,
      "explanation": "A queue (FIFO) holds all current zero in-degree nodes for BFS processing."
    },
    {
      "question": "Time complexity for Kahn’s on a graph with V vertices and E edges is:",
      "options": ["O(V²)", "O(V+E)", "O(E log V)", "O(V log E)"],
      "answer": 1,
      "explanation": "Each vertex and edge is processed once: O(V+E)."
    }
  ]
}
\`\`\`

## Complexities

- **Time:** O(V + E) — every node & edge touched once.  
- **Auxiliary Space:** O(V) — in-degree array + queue + topo list.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Direction of prerequisite pairs is critical: [a,b] ⇒ edge b→a.",
    "Kahn’s algorithm doubles as an easy cycle detector for DAGs.",
    "If the final topo order length ≠ numCourses, a cycle exists.",
    "BFS + queue keeps the implementation iterative and stack-overflow safe."
  ]
}
\`\`\``,
      starterCode: `from collections import deque, defaultdict

def can_finish(num_courses, prerequisites):
    # TODO: Return True if all courses can be completed
    # Note: [a, b] means b must be taken before a
    pass

# Test cases
print(can_finish(2, [[1, 0]]))
# Expected: True

print(can_finish(2, [[1, 0], [0, 1]]))
# Expected: False

print(can_finish(4, [[1, 0], [2, 1], [3, 2]]))
# Expected: True
`,
      solutionCode: `from collections import deque, defaultdict

def can_finish(num_courses, prerequisites):
    in_degree = {i: 0 for i in range(num_courses)}
    graph = defaultdict(list)

    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1

    queue = deque([node for node in in_degree if in_degree[node] == 0])
    count = 0

    while queue:
        node = queue.popleft()
        count += 1
        for child in graph[node]:
            in_degree[child] -= 1
            if in_degree[child] == 0:
                queue.append(child)

    return count == num_courses

# Test cases
print(can_finish(2, [[1, 0]]))
# Expected: True

print(can_finish(2, [[1, 0], [0, 1]]))
# Expected: False

print(can_finish(4, [[1, 0], [2, 1], [3, 2]]))
# Expected: True
`,
    },
  ],
};
