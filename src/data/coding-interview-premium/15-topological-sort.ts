import { Module } from "../types";

export const topologicalSortModule: Module = {
  id: "topological-sort",
  title: "Topological Sort",
  description: "Master the Topological Sort pattern for ordering tasks with dependencies using Kahn's algorithm and DFS. Essential for scheduling, prerequisite problems, and detecting cycles in directed graphs.",
  lessons: [
    {
      id: "topological-sort-intro",
      slug: "topological-sort-intro",
      title: "Introduction to Topological Sort",
      content: `## The Topological Sort Pattern

**Topological Sort** orders the vertices of a directed acyclic graph (DAG) such that for every directed edge u → v, vertex u appears before v in the ordering. Every valid topological sort is a linearization of a partial order — and crucially, multiple valid orderings can exist for the same graph.

\`\`\`concept
{ "title": "Topological Sort", "variant": "mental-model", "content": "Think of it as scheduling. You have a set of tasks where some tasks can only begin after others finish. Topological sort finds a linear sequence that respects every dependency — if task A must come before task B, A always appears earlier in the output. If no such sequence exists, there's a cycle: a deadlock." }
\`\`\`

<!-- voice:section_check concept="Topological Sort basic concept" -->

\`\`\`mermaid
graph LR
    A[A] --> C[C]
    A --> B[B]
    B --> D[D]
    C --> D
    D --> E[E]
    subgraph "One valid topological order"
        direction LR
        O1["A"] ~~~ O2["B"] ~~~ O3["C"] ~~~ O4["D"] ~~~ O5["E"]
    end
\`\`\`

Notice that A → B → C → D → E is **one** valid ordering. A → C → B → D → E is another. Both respect every edge constraint — this non-uniqueness is a defining property of topological sort.

---

### Why Topological Sort?

Whenever a problem involves ordering items that have dependencies, you need topological sort. The pattern-matching signal is explicit in the problem statement: look for words like **"prerequisites"**, **"dependencies"**, **"before/after"**, or **"ordering"**. When you see those, your instinct should immediately flag this pattern.

Real-world examples where this matters:
- Course scheduling — take Algorithms before taking Advanced Algorithms
- Build systems — compile modules in dependency order (Makefile, Webpack)
- Package managers — \`npm install\` and \`pip\` resolve install order via topological sort
- OS deadlock detection — a cycle means a deadlock; no cycle means a valid execution order

---

### Kahn's Algorithm (BFS Approach)

Kahn's algorithm is the preferred approach for most interview problems. It's iterative (not recursive), memory-efficient, and cycle detection falls out naturally — no extra bookkeeping needed.

\`\`\`steps
{ "title": "Kahn's Algorithm — Step by Step", "steps": [ { "title": "Compute in-degrees", "content": "For every edge u → v, increment \`in_degree[v]\` by 1. The in-degree of a node is the count of incoming edges — equivalently, the number of unsatisfied prerequisites." }, { "title": "Seed the queue with in-degree 0 nodes", "content": "Any node with \`in_degree == 0\` has no prerequisites. It's safe to process immediately. Add all such nodes to a queue." }, { "title": "Process the queue", "content": "Pop a node from the queue, append it to \`result\`. For each of its neighbors, decrement their in-degree by 1. If a neighbor's in-degree reaches 0, enqueue it — all its prerequisites are now satisfied." }, { "title": "Detect cycles", "content": "If \`len(result) == total_vertices\`, you have a valid topological order. If \`len(result) < total_vertices\`, some nodes were never enqueued — they're part of a cycle and never reached in-degree 0. Return empty to signal impossibility." } ] }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why cycle detection is free in Kahn's", "content": "Nodes in a cycle always have at least one incoming edge from another cycle node, so their in-degree never drops to 0. They never enter the queue. You just compare \`len(result)\` to \`total_vertices\` at the end — no extra tracking required. This is one of the cleanest properties of Kahn's algorithm." }
\`\`\`

---

### Implementation

\`\`\`playground
{ "title": "Kahn's Algorithm — Python", "language": "python", "runnable": true, "code": "from collections import deque, defaultdict\\n\\ndef topological_sort(vertices, edges):\\n    # Build adjacency list and compute in-degrees\\n    graph = defaultdict(list)\\n    in_degree = {i: 0 for i in range(vertices)}\\n\\n    for u, v in edges:\\n        graph[u].append(v)\\n        in_degree[v] += 1\\n\\n    # Seed queue with all zero-in-degree nodes\\n    queue = deque([v for v in range(vertices) if in_degree[v] == 0])\\n    result = []\\n\\n    while queue:\\n        vertex = queue.popleft()\\n        result.append(vertex)\\n\\n        for neighbor in graph[vertex]:\\n            in_degree[neighbor] -= 1\\n            if in_degree[neighbor] == 0:\\n                queue.append(neighbor)\\n\\n    # Cycle check: unprocessed nodes means a cycle exists\\n    if len(result) != vertices:\\n        return []  # Cycle detected\\n\\n    return result\\n\\n# Example: 5 vertices, edges representing A->C, A->B, B->D, C->D, D->E\\nedges = [(0,2),(0,1),(1,3),(2,3),(3,4)]\\nprint(topological_sort(5, edges))  # [0, 1, 2, 3, 4] or [0, 2, 1, 3, 4]\\n" }
\`\`\`

<!-- voice:key_insight insight="Vertices with in-degree 0 have no dependencies — they can be processed first. Remove them and update their neighbors' in-degrees." -->

---

### Trace: Walking Through the Example

\`\`\`trace
{ "title": "Kahn's on graph: 0→1, 0→2, 1→3, 2→3, 3→4", "language": "python", "code": "in_degree = {0:0, 1:1, 2:1, 3:2, 4:1}\\nqueue = deque([0])\\nresult = []\\n\\n# Step 1: pop 0, process neighbors 1 and 2\\nresult = [0]\\nin_degree = {1:0, 2:0, 3:2, 4:1}\\nqueue = deque([1, 2])\\n\\n# Step 2: pop 1, process neighbor 3\\nresult = [0, 1]\\nin_degree = {2:0, 3:1, 4:1}\\nqueue = deque([2])\\n\\n# Step 3: pop 2, process neighbor 3 → in_degree[3] hits 0\\nresult = [0, 1, 2]\\nin_degree = {3:0, 4:1}\\nqueue = deque([3])\\n\\n# Step 4: pop 3, process neighbor 4\\nresult = [0, 1, 2, 3]\\nin_degree = {4:0}\\nqueue = deque([4])\\n\\n# Step 5: pop 4, no neighbors\\nresult = [0, 1, 2, 3, 4]\\nqueue = deque([])\\n\\n# len(result) == 5 == vertices → no cycle", "frames": [ { "line": 1, "vars": { "in_degree": "{0:0,1:1,2:1,3:2,4:1}", "queue": "[0]", "result": "[]" }, "note": "Initial state: only node 0 has in-degree 0" }, { "line": 3, "vars": { "vertex": "0", "in_degree": "{1:0,2:0,3:2,4:1}", "queue": "[1,2]", "result": "[0]" }, "note": "Pop 0, decrement neighbors 1 and 2 — both hit 0 and join queue" }, { "line": 5, "vars": { "vertex": "1", "in_degree": "{2:0,3:1,4:1}", "queue": "[2]", "result": "[0,1]" }, "note": "Pop 1, decrement neighbor 3 — still has in-degree 1 (waits for node 2)" }, { "line": 7, "vars": { "vertex": "2", "in_degree": "{3:0,4:1}", "queue": "[3]", "result": "[0,1,2]" }, "note": "Pop 2, decrement node 3 — in-degree reaches 0, joins queue" }, { "line": 9, "vars": { "vertex": "3", "in_degree": "{4:0}", "queue": "[4]", "result": "[0,1,2,3]" }, "note": "Pop 3, decrement node 4 — joins queue" }, { "line": 11, "vars": { "vertex": "4", "in_degree": "{}", "queue": "[]", "result": "[0,1,2,3,4]" }, "note": "Pop 4, no outgoing edges. len(result)==5==vertices → valid order, no cycle" } ], "speed": 900 }
\`\`\`

---

### Kahn's vs. DFS — When Each Shines

\`\`\`tabs
{ "tabs": [ { "label": "Kahn's (BFS)", "icon": "🔢", "content": "**Preferred for most interview problems.**\\n\\n- Iterative — no recursion stack overflow risk\\n- Cycle detection is implicit: check \`len(result) == vertices\`\\n- Naturally models the 'what's available to process next?' dependency story\\n- Easier to extend for problems requiring parallel execution time\\n\\n**Use when:** the problem is about ordering, scheduling, or checking if dependencies can be satisfied." }, { "label": "DFS", "icon": "🌲", "content": "**Valid alternative, preferred when graph traversal is already in play.**\\n\\n- Recursive (or explicit stack)\\n- Cycle detection requires explicit 3-state tracking: \`UNVISITED\`, \`IN_PROGRESS\`, \`DONE\`\\n- A back edge (reaching an \`IN_PROGRESS\` node) signals a cycle\\n- Output is built by pushing to a stack post-recursion, then reversing\\n\\n**Use when:** the problem already involves DFS for another reason, or you need to find strongly connected components alongside topological order." }, { "label": "Cycle Detection Comparison", "icon": "🔄", "content": "| Approach | Cycle Detection Mechanism | Extra State Needed? |\\n|----------|--------------------------|--------------------|\\n| Kahn's (BFS) | \`len(result) < vertices\` at end | No — falls out naturally |\\n| DFS | Back edge = node still \`IN_PROGRESS\` | Yes — 3-color state per node |\\n\\nKahn's is simpler because the cycle check is a single comparison. DFS requires careful state management — easy to get wrong under interview pressure." } ] }
\`\`\`

---

### Complexity

\`\`\`callout
{ "type": "info", "title": "Time & Space Complexity", "content": "**Time: O(V + E)** — every vertex is enqueued and dequeued once (O(V)), and every edge is examined once when decrementing in-degrees (O(E)).\\n\\n**Space: O(V + E)** — O(V+E) for the adjacency list, O(V) for the in-degree array, result list, and queue.\\n\\nThis is optimal: you must look at every vertex and every edge at least once to produce a valid ordering." }
\`\`\`

---

### When to Reach for This Pattern

\`\`\`callout
{ "type": "tip", "title": "Pattern Recognition Checklist", "content": "Before writing any code, ask yourself:\\n\\n1. Are there **items** (courses, tasks, nodes) with **dependencies** (prerequisites, must-come-before)?\\n2. Can I model items as nodes and dependencies as directed edges?\\n3. Does the problem ask for **a valid order**, **whether an order exists**, or **cycle detection**?\\n\\nIf yes to all three → Topological Sort. Keywords: *prerequisites*, *dependencies*, *ordering*, *before/after*, *schedule*, *compile order*." }
\`\`\`

Common problem categories:
- **Course Schedule I/II** — can all courses be completed? What order?
- **Alien Dictionary** — infer character ordering from sorted word list
- **Task Scheduling** — minimum time given parallelism constraints
- **Build Systems / Dependency Resolution** — ordering source files or packages

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "In Kahn's algorithm, you start by adding all nodes with in-degree 0 to the queue. Why these nodes specifically?", "options": ["They have the highest number of outgoing edges", "They have no prerequisites — nothing blocks them from being processed first", "They are guaranteed to appear last in the topological order", "They have the fewest neighbors to update"], "answer": 1, "explanation": "In-degree 0 means no incoming edges — no unsatisfied dependencies. These nodes are the 'entry points' of the graph: nothing needs to happen before them, so they can be scheduled first." }, { "question": "After running Kahn's algorithm, you find that len(result) == 4 but the graph has 6 vertices. What does this tell you?", "options": ["The topological order is [0,1,2,3] and the remaining 2 nodes are isolated", "The graph has a cycle — 2 nodes were never enqueued because their in-degree never reached 0", "You need to run the algorithm again with a different starting node", "The graph is disconnected and you need to handle each component separately"], "answer": 1, "explanation": "Nodes in a cycle always have at least one incoming edge from another cycle node, so their in-degree never drops to 0. They never enter the queue. A result shorter than total vertices is the definitive signal that a cycle exists." }, { "question": "Which of the following problems is NOT a topological sort problem?", "options": ["Determine if all university courses can be completed given prerequisite constraints", "Find the shortest path between two nodes in a weighted graph", "Order the compilation of source files based on import dependencies", "Detect if a set of project tasks creates a circular dependency"], "answer": 1, "explanation": "Shortest path in a weighted graph is Dijkstra's or Bellman-Ford territory. The other three are all dependency/ordering problems — classic topological sort. Topological sort works on unweighted DAGs and cannot handle cycles or edge weights on its own." }, { "question": "What is the time complexity of Kahn's algorithm on a graph with V vertices and E edges?", "options": ["O(V²)", "O(E log V)", "O(V + E)", "O(V · E)"], "answer": 2, "explanation": "O(V + E): each vertex is enqueued and dequeued exactly once — O(V). Each edge is visited exactly once when we decrement in-degrees of neighbors — O(E). Total: O(V + E), which is optimal since you must examine every vertex and edge at least once." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Topological sort linearizes a DAG so every edge u→v has u before v — multiple valid orderings can exist for the same graph.", "Kahn's algorithm (BFS + in-degrees) is preferred for interviews: iterative, clean cycle detection via a single length comparison.", "Cycle detection is implicit in Kahn's: nodes in a cycle never reach in-degree 0 and never enter the queue — check len(result) < V at the end.", "Pattern signal: words like 'prerequisites', 'dependencies', 'before/after', or 'schedule' in a problem description.", "Time and space are both O(V + E) — optimal, since every vertex and edge must be visited at least once." ] }
\`\`\``,
    },
    {
      id: "task-scheduling",
      slug: "task-scheduling",
      title: "Task Scheduling (Valid Order)",
      content: `## Task Scheduling (Valid Order)

<!-- voice:section_check concept="Detecting valid task ordering" -->

### Problem Statement

There are \`n\` tasks labeled \`0\` to \`n-1\`. Some tasks have prerequisites — they can't start until another finishes. Given \`n\` and a list of prerequisite pairs \`[a, b]\` (meaning task \`b\` must complete before task \`a\` can begin), determine if it is possible to finish all tasks.

| Input | Output | Why |
|-------|--------|-----|
| n=2, prerequisites=[[1,0]] | \`true\` | Task 0 → Task 1 is a valid order |
| n=2, prerequisites=[[1,0],[0,1]] | \`false\` | Circular dependency: 0 needs 1, 1 needs 0 |

\`\`\`concept
{ "title": "Cycles Make Scheduling Impossible", "variant": "mental-model", "content": "A dependency graph with a cycle has no valid starting point. If Task A requires B, B requires C, and C requires A, none can ever begin. Topological sort answers a deeper question than 'what order?' — it answers 'does a valid order exist at all?' Kahn's algorithm reveals cycles as a natural side effect: cyclic nodes never reach indegree 0, so they never enter the processing queue." }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Pattern Recognition", "content": "Keywords like **prerequisites**, **dependencies**, **before/after**, and **ordering** in a problem are strong signals for topological sort. This problem is really asking: is this dependency graph a DAG (Directed Acyclic Graph)?" }
\`\`\`

### Kahn's Algorithm

\`\`\`steps
{ "title": "Kahn's Algorithm for Cycle Detection", "steps": [ { "title": "Build the Graph + Indegree Array", "content": "For each prerequisite pair \`[a, b]\`, add edge \`b → a\` in the adjacency list and increment \`indegree[a]\`.\\n\\n**Why indegree?** A node's indegree counts how many tasks must finish before it can start. Indegree 0 means 'ready to process immediately.'" }, { "title": "Seed the Queue", "content": "Add all nodes with \`indegree == 0\` to a queue. These tasks have no prerequisites — they are free to process right now." }, { "title": "BFS Processing", "content": "While the queue is non-empty:\\n1. Dequeue a task, increment a \`processed\` counter\\n2. For each neighbor (a task that depended on this one), decrement their indegree\\n3. If a neighbor's indegree reaches 0, enqueue it — all its prerequisites are now done" }, { "title": "The Cycle Check (Free!)", "content": "If \`processed == n\`: every task was processed — **no cycle**, return \`true\`.\\n\\nIf \`processed < n\`: some tasks were never reachable because their indegree never hit 0 — they are trapped in a cycle, return \`false\`.\\n\\nCycle detection falls out of the algorithm for free. It is not an extra step." } ] }
\`\`\`

### Trace: Algorithm on a Concrete Example

\`\`\`trace
{ "title": "Kahn's — n=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]", "language": "python", "code": "from collections import deque\\n\\ndef can_finish(n, prerequisites):\\n    graph = [[] for _ in range(n)]\\n    indegree = [0] * n\\n    for a, b in prerequisites:\\n        graph[b].append(a)\\n        indegree[a] += 1\\n    queue = deque(i for i in range(n) if indegree[i] == 0)\\n    processed = 0\\n    while queue:\\n        task = queue.popleft()\\n        processed += 1\\n        for nbr in graph[task]:\\n            indegree[nbr] -= 1\\n            if indegree[nbr] == 0:\\n                queue.append(nbr)\\n    return processed == n", "frames": [ { "line": 4, "vars": { "n": 4, "graph": "[[], [], [], []]", "indegree": "[0, 0, 0, 0]" }, "note": "Initialize empty adjacency list and zero indegrees for all 4 tasks" }, { "line": 6, "vars": { "graph": "[[1, 2], [3], [3], []]", "indegree": "[0, 1, 1, 2]" }, "note": "After building graph: task 0 has no prerequisites (indegree 0). Task 3 needs both 1 and 2 (indegree 2)." }, { "line": 9, "vars": { "queue": "deque([0])", "processed": 0 }, "note": "Only task 0 has indegree 0 — seed the queue with just task 0" }, { "line": 11, "vars": { "task": 0, "processed": 1, "indegree": "[0, 0, 0, 2]", "queue": "deque([1, 2])" }, "note": "Process task 0. Neighbors 1 and 2 both drop to indegree 0 — both join queue" }, { "line": 11, "vars": { "task": 1, "processed": 2, "indegree": "[0, 0, 0, 1]", "queue": "deque([2])" }, "note": "Process task 1. Neighbor 3 drops to indegree 1 — still waiting on task 2" }, { "line": 11, "vars": { "task": 2, "processed": 3, "indegree": "[0, 0, 0, 0]", "queue": "deque([3])" }, "note": "Process task 2. Neighbor 3 finally reaches indegree 0 — joins queue" }, { "line": 11, "vars": { "task": 3, "processed": 4, "queue": "deque([])" }, "note": "Process task 3. Queue is now empty." }, { "line": 18, "vars": { "processed": 4, "n": 4 }, "note": "processed == n → return True. All tasks can finish." } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "The Cyclic Case: prerequisites=[[1,0],[0,1]]", "content": "With n=2:\\n- indegree = [1, 1] — both tasks are waiting on each other\\n- Queue starts **empty** — nothing has indegree 0\\n- The while loop never executes: processed = 0\\n- \`processed (0) < n (2)\` → return **false**\\n\\nNeither task can ever begin. Kahn's gets stuck and the count check catches it." }
\`\`\`

### Kahn's vs DFS: Which to Use?

\`\`\`tabs
{ "tabs": [ { "label": "Kahn's Algorithm", "icon": "🔄", "content": "**BFS-based, iterative**\\n\\n\`\`\`python\\nfrom collections import deque\\n\\ndef can_finish(n, prerequisites):\\n    graph = [[] for _ in range(n)]\\n    indegree = [0] * n\\n    for a, b in prerequisites:\\n        graph[b].append(a)\\n        indegree[a] += 1\\n    queue = deque(i for i in range(n) if indegree[i] == 0)\\n    processed = 0\\n    while queue:\\n        task = queue.popleft()\\n        processed += 1\\n        for nbr in graph[task]:\\n            indegree[nbr] -= 1\\n            if indegree[nbr] == 0:\\n                queue.append(nbr)\\n    return processed == n\\n\`\`\`\\n\\n**Advantages:**\\n- Cycle detection is built-in — just check \`processed == n\`\\n- Iterative, no recursion → no stack overflow risk on large graphs\\n- The indegree metaphor maps directly to \\"how many prerequisites remain\\"\\n- Generally easier to reason about in interviews for dependency problems" }, { "label": "DFS (3-Color)", "icon": "🌊", "content": "**Recursive with explicit cycle tracking**\\n\\n\`\`\`python\\ndef can_finish(n, prerequisites):\\n    graph = [[] for _ in range(n)]\\n    for a, b in prerequisites:\\n        graph[b].append(a)\\n    # 0 = unvisited, 1 = visiting, 2 = done\\n    state = [0] * n\\n\\n    def dfs(node):\\n        if state[node] == 1: return False  # back-edge = cycle\\n        if state[node] == 2: return True   # already fully explored\\n        state[node] = 1\\n        for nbr in graph[node]:\\n            if not dfs(nbr):\\n                return False\\n        state[node] = 2\\n        return True\\n\\n    return all(dfs(i) for i in range(n))\\n\`\`\`\\n\\n**Advantages:**\\n- Cycle detection is explicit — the \`visiting\` state catches back-edges directly\\n- Natural when DFS traversal is already part of your solution\\n- Useful when you need to identify which nodes form the cycle" }, { "label": "Head-to-Head", "icon": "⚖️", "content": "| | Kahn's (BFS) | DFS (3-color) |\\n|---|---|---|\\n| **Cycle detection** | Built-in (processed < n) | Explicit visiting state |\\n| **Style** | Iterative | Recursive |\\n| **Stack overflow risk** | None | Yes, on deep graphs |\\n| **Time** | O(V + E) | O(V + E) |\\n| **Space** | O(V + E) | O(V + E) call stack |\\n| **Interview preference** | ✅ Recommended for dependency problems | ✅ Valid and equally correct |\\n\\n**Rule of thumb:** Choose Kahn's when the problem is about dependencies and ordering. Choose DFS when you're already traversing the graph for another reason and want cycle detection along the way." } ] }
\`\`\`

### Full Solution

\`\`\`playground
{ "title": "Task Scheduling — Kahn's Algorithm (Runnable)", "language": "python", "code": "from collections import deque\\n\\ndef can_finish(n: int, prerequisites: list) -> bool:\\n    \\"\\"\\"\\n    Returns True if all n tasks can be completed given prerequisites.\\n    Uses Kahn's algorithm: O(V+E) time, O(V+E) space.\\n    \\"\\"\\"\\n    graph = [[] for _ in range(n)]\\n    indegree = [0] * n\\n\\n    for a, b in prerequisites:\\n        graph[b].append(a)  # b must come before a\\n        indegree[a] += 1\\n\\n    # Start with tasks that have no prerequisites\\n    queue = deque(i for i in range(n) if indegree[i] == 0)\\n    processed = 0\\n\\n    while queue:\\n        task = queue.popleft()\\n        processed += 1\\n        for neighbor in graph[task]:\\n            indegree[neighbor] -= 1\\n            if indegree[neighbor] == 0:\\n                queue.append(neighbor)\\n\\n    return processed == n\\n\\n\\n# Test cases\\nprint(can_finish(2, [[1, 0]]))                    # True\\nprint(can_finish(2, [[1, 0], [0, 1]]))            # False (cycle)\\nprint(can_finish(4, [[1,0],[2,0],[3,1],[3,2]]))   # True\\nprint(can_finish(3, [[1,0],[2,1],[0,2]]))          # False (cycle: 0->1->2->0)", "runnable": true }
\`\`\`

### Complexity

| | Complexity | Explanation |
|---|---|---|
| **Time** | O(V + E) | Each node enqueued/dequeued once O(V); each edge visited once when decrementing indegrees O(E) |
| **Space** | O(V + E) | Adjacency list O(E), indegree array O(V), BFS queue O(V) |

Where V = n tasks, E = number of prerequisite pairs.

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "In Kahn's algorithm for n=3 with prerequisites=[[0,1],[1,2],[2,0]], what happens when you try to seed the initial queue?", "options": ["Queue is seeded with all 3 nodes since they each have one prerequisite", "Queue starts empty because every node has indegree 1 — none are free to start", "Queue is seeded with node 0 because it appears first", "Queue is seeded with node 2 because it has the lowest indegree"], "answer": 1, "explanation": "Each task waits on exactly one other: task 0 waits on 2, task 1 waits on 0, task 2 waits on 1. All three have indegree 1. The queue starts empty, the while loop never runs, and processed=0 < n=3 — Kahn's correctly returns false." }, { "question": "Why does Kahn's algorithm detect cycles without extra logic?", "options": ["It explicitly tracks visited and visiting states like DFS does", "Cyclic nodes never reach indegree 0, so they never enter the queue and are never counted in processed", "It uses a stack instead of a queue to reverse the order", "It counts the number of edges and compares to the number of nodes"], "answer": 1, "explanation": "Nodes in a cycle all depend on each other. None of them can reach indegree 0 while cycle members still exist. They are permanently excluded from the BFS queue. At the end, processed < n reveals they exist — no extra tracking needed. As one source puts it: 'cycle detection isn't an extra step, it falls out of the algorithm for free.'" }, { "question": "What is the time complexity of Kahn's algorithm on a graph with V nodes and E edges?", "options": ["O(V²)", "O(V log V + E)", "O(V + E)", "O(E log V)"], "answer": 2, "explanation": "Each of the V nodes is enqueued and dequeued at most once (O(V)). Each of the E edges is processed once when decrementing neighbor indegrees (O(E)). Total: O(V + E), identical to standard BFS on a graph." }, { "question": "When would you prefer DFS cycle detection over Kahn's algorithm?", "options": ["When the graph is very large and you need less memory", "When you are already performing DFS traversal for another reason and want cycle detection along the way", "When the problem guarantees no cycles exist", "When the number of edges is much larger than the number of nodes"], "answer": 1, "explanation": "Both approaches run in O(V+E). Kahn's is generally preferred for dependency/ordering problems because it maps naturally to the metaphor. DFS is the better fit when your solution is already graph-traversal-centric and you want cycle detection as a byproduct, or when you need to explicitly identify which nodes form the cycle." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Task scheduling is a cycle detection problem: a valid ordering exists if and only if the dependency graph contains no cycles (it is a DAG).", "Kahn's cycle detection is free — if processed < n after BFS completes, the missing nodes are trapped in a cycle with permanent indegree > 0.", "Both Kahn's (BFS) and DFS with 3-color tracking solve this in O(V+E) time and O(V+E) space. Kahn's is preferred when the dependency metaphor is central to the problem.", "Keywords to flag topological sort: prerequisites, dependencies, ordering, before/after, scheduling.", "If the BFS queue ever contains more than one node simultaneously, multiple valid orderings exist — useful context for follow-up questions about unique orderings." ] }
\`\`\``,
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

Given \`n\` tasks labeled \`0\` to \`n-1\` and a list of prerequisite pairs, return **a valid ordering** to complete all tasks. If multiple valid orderings exist, return any one. If it is impossible (cycle exists), return an empty list.

This is the natural extension of cycle detection: instead of just asking "can we schedule?" we ask "in what order?"

\`\`\`concept
{ "title": "From Detection to Construction", "variant": "mental-model", "content": "Cycle detection tells you yes/no. Order construction tells you how. Kahn's algorithm gives you both for free — the order in which nodes exit the queue IS the topological order. If the queue empties before all tasks are processed, a cycle exists and the answer is []." }
\`\`\`

---

### Examples

**Example 1 — valid schedule:**

\`\`\`
n = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
Output: [0, 1, 2, 3]  or  [0, 2, 1, 3]
\`\`\`

- Task \`0\` has no prerequisites → goes first
- Tasks \`1\` and \`2\` both depend only on \`0\` → either can go second
- Task \`3\` depends on both \`1\` and \`2\` → must go last

**Example 2 — impossible (cycle):**

\`\`\`
n = 2, prerequisites = [[1,0],[0,1]]
Output: []
\`\`\`

Both tasks depend on each other. Neither can ever reach in-degree 0.

---

### Algorithm Walkthrough

\`\`\`steps
{ "title": "Kahn's Algorithm — Return the Order", "steps": [ { "title": "Build the graph and in-degree array", "content": "Parse each \`[a, b]\` pair as edge \`b → a\` (b must complete before a). Track how many prerequisites each task has in an \`inDegree[]\` array.\\n\\n\`\`\`\\nn=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]\\n\\nGraph:  0→[1,2],  1→[3],  2→[3]\\nDegree: [0, 1, 1, 2]\\n\`\`\`" }, { "title": "Seed the queue with in-degree 0 nodes", "content": "Any task with \`inDegree = 0\` has no prerequisites — it can start immediately. Push all such tasks into a queue.\\n\\n\`\`\`\\nqueue = [0]   (only task 0 has in-degree 0)\\norder = []\\n\`\`\`" }, { "title": "Process the queue and collect the order", "content": "While the queue is non-empty:\\n1. Dequeue a task → append it to \`order\`\\n2. For each neighbor (dependent task), decrement their in-degree\\n3. If a neighbor's in-degree reaches 0, enqueue it\\n\\n\`\`\`\\nDequeue 0 → order=[0], decrement 1 and 2\\n  inDegree now: [0,0,0,2]\\nDequeue 1 → order=[0,1], decrement 3\\n  inDegree now: [0,0,0,1]\\nDequeue 2 → order=[0,1,2], decrement 3\\n  inDegree now: [0,0,0,0]\\nDequeue 3 → order=[0,1,2,3]\\n\`\`\`" }, { "title": "Check completeness", "content": "If \`len(order) == n\`, all tasks were processed — return \`order\`.\\nIf \`len(order) < n\`, some tasks were never reachable (stuck in a cycle) — return \`[]\`.\\n\\n\`\`\`\\nlen(order) = 4 == n = 4  ✓  → return [0,1,2,3]\\n\`\`\`" } ] }
\`\`\`

---

### Visual Execution

\`\`\`algoviz
{ "title": "Kahn's Algorithm on n=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]", "type": "array", "data": [0, 1, 2, 2], "frames": [ { "highlight": [], "label": "Initial in-degrees: task 0→0, task 1→1, task 2→1, task 3→2", "stats": { "inDegree[0]": 0, "inDegree[1]": 1, "inDegree[2]": 1, "inDegree[3]": 2, "queue": "[0]", "order": "[]" } }, { "highlight": [0], "label": "Dequeue task 0 → add to order. Decrement neighbors 1 and 2.", "stats": { "inDegree[0]": 0, "inDegree[1]": 0, "inDegree[2]": 0, "inDegree[3]": 2, "queue": "[1, 2]", "order": "[0]" } }, { "highlight": [1], "label": "Dequeue task 1 → add to order. Decrement neighbor 3.", "stats": { "inDegree[0]": 0, "inDegree[1]": 0, "inDegree[2]": 0, "inDegree[3]": 1, "queue": "[2]", "order": "[0, 1]" } }, { "highlight": [2], "label": "Dequeue task 2 → add to order. Decrement neighbor 3 → reaches 0, enqueue.", "stats": { "inDegree[0]": 0, "inDegree[1]": 0, "inDegree[2]": 0, "inDegree[3]": 0, "queue": "[3]", "order": "[0, 1, 2]" } }, { "highlight": [3], "label": "Dequeue task 3 → add to order. Queue empty. len(order)=4 == n=4 ✓", "stats": { "inDegree[0]": 0, "inDegree[1]": 0, "inDegree[2]": 0, "inDegree[3]": 0, "queue": "[]", "order": "[0, 1, 2, 3]" } } ], "speed": 900 }
\`\`\`

---

### Implementation

\`\`\`playground
{ "title": "Task Scheduling — Return Valid Order", "language": "python", "runnable": true, "code": "from collections import deque\\nfrom typing import List\\n\\ndef find_order(n: int, prerequisites: List[List[int]]) -> List[int]:\\n    # Build adjacency list and in-degree array\\n    graph = [[] for _ in range(n)]\\n    in_degree = [0] * n\\n\\n    for task, prereq in prerequisites:\\n        graph[prereq].append(task)\\n        in_degree[task] += 1\\n\\n    # Seed queue with all tasks that have no prerequisites\\n    queue = deque(i for i in range(n) if in_degree[i] == 0)\\n    order = []\\n\\n    while queue:\\n        task = queue.popleft()\\n        order.append(task)\\n        for dependent in graph[task]:\\n            in_degree[dependent] -= 1\\n            if in_degree[dependent] == 0:\\n                queue.append(dependent)\\n\\n    # If order contains all tasks, no cycle exists\\n    return order if len(order) == n else []\\n\\n# Test cases\\nprint(find_order(4, [[1,0],[2,0],[3,1],[3,2]]))  # [0,1,2,3] or [0,2,1,3]\\nprint(find_order(2, [[1,0],[0,1]]))              # [] (cycle)\\nprint(find_order(1, []))                          # [0]" }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Cycle Detection Falls Out for Free", "content": "You do NOT need a separate cycle-detection pass. If \`len(order) < n\` at the end, the missing tasks are exactly the ones stuck in a cycle — their in-degree never reached 0. This is one of the most elegant properties of Kahn's algorithm." }
\`\`\`

---

### Cycle Case — What Happens?

\`\`\`trace
{ "title": "Cyclic input: n=2, prerequisites=[[1,0],[0,1]]", "language": "python", "code": "graph = [[1], [0]]\\nin_degree = [1, 1]\\nqueue = deque()  # EMPTY — no task has in-degree 0\\norder = []\\n# while loop never executes\\nreturn []  # len(order)=0 != n=2", "frames": [ { "line": 1, "vars": { "graph": "[[1],[0]]", "in_degree": "[1,1]" }, "note": "Both tasks have in-degree 1 — neither can start" }, { "line": 2, "vars": { "queue": "deque([])" }, "note": "Queue is empty from the start — the loop never runs" }, { "line": 3, "vars": { "order": "[]" }, "note": "order stays empty. len([]) = 0 ≠ 2, so return []" } ], "speed": 900 }
\`\`\`

---

### Complexity

| | Complexity | Why |
|---|---|---|
| **Time** | O(V + E) | Each node dequeued once (V), each edge decrements once (E) |
| **Space** | O(V + E) | Adjacency list (E) + in-degree array + queue + output (all O(V)) |

Where V = number of tasks, E = number of prerequisite pairs.

---

### Cycle Detection vs. Order Return — Side by Side

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Cycle detection only (returns bool)", "code": "def can_finish(n, prerequisites):\\n    graph = [[] for _ in range(n)]\\n    in_degree = [0] * n\\n    for a, b in prerequisites:\\n        graph[b].append(a)\\n        in_degree[a] += 1\\n    queue = deque(i for i in range(n) if in_degree[i] == 0)\\n    count = 0\\n    while queue:\\n        node = queue.popleft()\\n        count += 1\\n        for nb in graph[node]:\\n            in_degree[nb] -= 1\\n            if in_degree[nb] == 0:\\n                queue.append(nb)\\n    return count == n" }, "after": { "label": "Return the order (one extra list)", "code": "def find_order(n, prerequisites):\\n    graph = [[] for _ in range(n)]\\n    in_degree = [0] * n\\n    for a, b in prerequisites:\\n        graph[b].append(a)\\n        in_degree[a] += 1\\n    queue = deque(i for i in range(n) if in_degree[i] == 0)\\n    order = []               # ← only addition\\n    while queue:\\n        node = queue.popleft()\\n        order.append(node)   # ← collect instead of count\\n        for nb in graph[node]:\\n            in_degree[nb] -= 1\\n            if in_degree[nb] == 0:\\n                queue.append(nb)\\n    return order if len(order) == n else []" } }
\`\`\`

The only structural difference is collecting nodes into \`order\` rather than incrementing a counter. The cycle-detection logic is identical.

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "After running Kahn's algorithm on n=4 with prerequisites=[[1,0],[2,0],[3,1],[3,2]], the output order is [0,1,2,3]. Is [0,2,1,3] also a valid answer?", "options": ["No — there is exactly one valid topological order", "Yes — any order where each task appears after all its prerequisites is valid", "Yes — but only if we process the queue in reverse", "No — we must always process lower-numbered tasks first"], "answer": 1, "explanation": "Topological sort is not unique. Both [0,1,2,3] and [0,2,1,3] satisfy the constraints: 0 before 1, 0 before 2, 1 before 3, 2 before 3. The problem explicitly asks to return any valid ordering." }, { "question": "You run Kahn's algorithm on n=5 tasks and the resulting order list has length 3. What does this tell you?", "options": ["Three tasks were completed successfully", "Two tasks are involved in a cycle and could never reach in-degree 0", "The algorithm has a bug — it should always return all n tasks", "You need to run a second BFS pass for the remaining tasks"], "answer": 1, "explanation": "If len(order) < n, it means some tasks' in-degrees never reached 0. Those tasks are stuck in a dependency cycle. The correct return value is [] (impossible)." }, { "question": "What is the time complexity of Kahn's algorithm for topological sort?", "options": ["O(V²)", "O(V log V)", "O(V + E)", "O(E log E)"], "answer": 2, "explanation": "Each of the V nodes is enqueued and dequeued exactly once. Each of the E edges is processed exactly once when decrementing in-degrees. Total: O(V + E)." }, { "question": "Why do we initialize the queue with all nodes that have in-degree 0?", "options": ["To minimize memory usage", "These are the only nodes that can be processed without completing a prerequisite first", "In-degree 0 nodes are always the highest-priority tasks", "BFS requires a non-empty starting set"], "answer": 1, "explanation": "A task with in-degree 0 has no prerequisites — it is immediately schedulable. Tasks with in-degree > 0 must wait until their prerequisites are completed (and their in-degree decremented to 0)." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Kahn's algorithm returns the topological order directly — the queue dequeue sequence IS the valid task ordering.", "Cycle detection is automatic: if len(order) < n at the end, return []. No extra logic needed.", "Multiple valid orderings can exist; return any one unless the problem specifies constraints (e.g., lexicographically smallest).", "The only difference from cycle-detection-only is collecting dequeued nodes into an output list.", "Time and space are both O(V + E) — linear in the size of the graph." ] }
\`\`\``,
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

The standard topological sort finds *one* valid ordering. This problem asks for *all* of them — that shift from "find any" to "find all" is the cue to reach for backtracking.

\`\`\`concept
{ "title": "Backtracking over the Topological Order Space", "variant": "mental-model", "content": "At every step, multiple tasks may have in-degree 0 — any one of them is a legal next choice. Backtracking treats those choices as branches in a decision tree: pick a candidate, recurse deeper, then undo the pick and try the next candidate. Every path through the tree that places all n tasks is a valid topological ordering." }
\`\`\`

### Problem Statement

Given \`n\` tasks labeled \`0\` to \`n-1\` and prerequisite pairs \`[a, b]\` meaning **b must finish before a**, return every valid ordering of all tasks that satisfies all prerequisites.

\`\`\`tabs
{ "tabs": [ { "label": "Example 1 — Rigid Chain", "icon": "🔗", "content": "**Input:** n = 3, prerequisites = [[0,1],[1,2]]\\n\\nEdges: 1 → 0 and 2 → 1. The ordering is fully determined:\\n\\n\`\`\`\\n2 → 1 → 0\\n\`\`\`\\n\\n**Output:** \`[[2, 1, 0]]\` — only one valid order exists." }, { "label": "Example 2 — Independent Branch", "icon": "🌿", "content": "**Input:** n = 4, prerequisites = [[1,0],[2,0]]\\n\\nBoth tasks 1 and 2 depend on 0, but neither depends on the other. Task 3 is fully free:\\n\\n\`\`\`\\n  1\\n /\\n0      3 (independent)\\n \\\\\\n  2\\n\`\`\`\\n\\n**Output:** \`[[0,1,2,3], [0,2,1,3]]\` — tasks 1 and 2 can swap positions." } ] }
\`\`\`

### Algorithm

\`\`\`steps
{ "title": "Backtracking Topological Sort", "steps": [ { "title": "Build the graph and compute in-degrees", "content": "Create an adjacency list \`adj[b] = [tasks that depend on b]\` and an \`in_degree[i]\` array counting prerequisites per task.\\n\\nFor each pair \`[a, b]\`: \`adj[b].append(a)\` and \`in_degree[a] += 1\`." }, { "title": "Collect all tasks with in-degree 0", "content": "These are the candidates that can legally go next. In a DAG at least one always exists. When multiple tasks share in-degree 0, each one represents a separate branch to explore." }, { "title": "For each candidate: place it, recurse, then undo", "content": "For every task \`t\` where \`in_degree[t] == 0\` and it hasn't been placed yet:\\n1. Append \`t\` to the current path\\n2. For each task \`dep\` that depends on \`t\`, decrement \`in_degree[dep]\`\\n3. Recurse into \`backtrack(path)\`\\n4. Pop \`t\`; restore \`in_degree[dep]\` for each dependent" }, { "title": "Base case — all tasks placed", "content": "When \`len(path) == n\`, append a copy of \`path\` to the results list. Every task has been placed in a dependency-respecting order." } ] }
\`\`\`

### Visualising the State Progression

The animation below traces Example 1 (rigid chain 2 → 1 → 0). The data array shows in-degrees \`[in_deg_0, in_deg_1, in_deg_2]\`; highlighted cells are the in-degree-0 candidates at each step.

\`\`\`algoviz
{ "title": "In-degree state as tasks are picked (n=3, chain 2→1→0)", "type": "array", "data": [1, 1, 0], "frames": [ { "highlight": [2], "label": "Initial in-degrees: [1, 1, 0]. Only task 2 has in-degree 0 — sole candidate.", "stats": { "path": "[]", "available": "task 2" } }, { "highlight": [1], "label": "Place task 2. Decrement in-degree of task 1 (its dependent). Task 1 drops to 0.", "stats": { "path": "[2]", "available": "task 1" } }, { "highlight": [0], "label": "Place task 1. Decrement in-degree of task 0. Task 0 drops to 0.", "stats": { "path": "[2, 1]", "available": "task 0" } }, { "highlight": [], "label": "Place task 0 — path is full. Save [2, 1, 0] to results. No backtracking needed: only one branch existed.", "stats": { "path": "[2, 1, 0]", "available": "none" } } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "When branching actually fires", "content": "In Example 2, after placing task 0 the in-degree of **both** tasks 1 and 2 drops to 0 simultaneously. Backtracking tries task 1 first (path → [0,1,2,3]), then backtracks and tries task 2 first (path → [0,2,1,3]). That symmetric exploration is exactly why the approach is exhaustive." }
\`\`\`

### Implementation

\`\`\`playground
{ "title": "All Topological Orders — Backtracking", "language": "python", "code": "from collections import defaultdict\\n\\ndef all_topological_orders(n, prerequisites):\\n    adj = defaultdict(list)\\n    in_degree = [0] * n\\n\\n    for a, b in prerequisites:   # b must precede a\\n        adj[b].append(a)\\n        in_degree[a] += 1\\n\\n    results = []\\n    scheduled = [False] * n      # O(1) 'already placed' lookup\\n\\n    def backtrack(path):\\n        if len(path) == n:\\n            results.append(list(path))\\n            return\\n\\n        for task in range(n):\\n            if in_degree[task] == 0 and not scheduled[task]:\\n                # --- choose ---\\n                scheduled[task] = True\\n                path.append(task)\\n                for dep in adj[task]:\\n                    in_degree[dep] -= 1\\n\\n                backtrack(path)\\n\\n                # --- undo ---\\n                path.pop()\\n                scheduled[task] = False\\n                for dep in adj[task]:\\n                    in_degree[dep] += 1\\n\\n    backtrack([])\\n    return results\\n\\n# Rigid chain\\nprint(all_topological_orders(3, [[0,1],[1,2]]))\\n# [[2, 1, 0]]\\n\\n# Independent parallel branch\\nprint(all_topological_orders(4, [[1,0],[2,0]]))\\n# [[0, 1, 2, 3], [0, 2, 1, 3], ...]", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why a scheduled[] array, not task not in path?", "content": "Checking \`task not in path\` on a list is O(V) per iteration, making the inner loop O(V²). A boolean \`scheduled\` array gives O(1) membership tests. Alternatively you can set \`in_degree[task] = -1\` after placing it (and restore it on undo), eliminating the extra array entirely — both patterns are accepted in interviews." }
\`\`\`

### Complexity

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Find ONE ordering (Kahn's / DFS)", "code": "Time:  O(V + E)\\nSpace: O(V + E)\\n\\nEach node and edge is visited exactly once.\\nSuitable for scheduling, build systems, CI pipelines." }, "after": { "label": "Find ALL orderings (backtracking)", "code": "Time:  O(V! × E)  ← worst case\\nSpace: O(V + E)    ← recursion stack + graph\\n\\nExponential: an edge-free graph has V! orderings.\\nOnly practical for small V (≤ ~8 in contests)." } }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Why the worst case is O(V! × E)", "content": "In a graph with no edges every permutation of V tasks is a valid topological order — that's V! results. For each result the backtracking path visits every edge twice (once to decrement in-degrees, once to restore them), giving V! × E total operations.\\n\\nPrerequisite edges prune the search tree aggressively. A rigid chain 0→1→2→…→(V-1) collapses the tree to a single path regardless of V. The exponential blowup only materialises on nearly-unconstrained graphs, which is why interview variants stay small (n ≤ 6 or n ≤ 8)." }
\`\`\`

### Knowledge Check

\`\`\`quiz
{ "title": "All Tasks Scheduling Orders", "questions": [ { "question": "After placing a task in the current path, what state must the backtracking step restore before trying the next candidate?", "options": [ "The adjacency list of the placed task", "The in-degrees of every task that depends on the placed task", "The total count of tasks remaining", "The entire in-degree array from scratch" ], "answer": 1, "explanation": "Only the dependents' in-degrees are affected when a task is placed. Restoring exactly those values lets the algorithm correctly evaluate a different next choice without recomputing everything." }, { "question": "For n = 5 tasks with zero prerequisite edges, how many valid orderings exist?", "options": ["10", "25", "120", "3125"], "answer": 2, "explanation": "With no constraints, every permutation is valid. 5! = 120. This is precisely why the worst-case time complexity is O(V! × E) — edge-free graphs generate every permutation of V tasks." }, { "question": "What signals that the backtracking has reached a dead end (no valid extension) mid-path?", "options": [ "The recursion depth exceeds n", "No task with in-degree 0 remains but the path is incomplete", "The path contains a repeated task", "The scheduled[] array is all True" ], "answer": 1, "explanation": "If no in-degree-0 task is available and the path isn't full, the remaining tasks form a cycle — no valid completion exists from this branch. The backtracking naturally handles this by skipping the recursive call (the for-loop finds no eligible candidate) and unwinding." }, { "question": "What is the key algorithmic difference between finding one topological order and finding all of them?", "options": [ "BFS vs DFS traversal strategy", "Using a min-heap instead of a queue for candidate selection", "Backtracking to explore every valid branch instead of committing to the first candidate", "Sorting the adjacency lists before processing" ], "answer": 2, "explanation": "Kahn's algorithm and DFS both greedily commit to one candidate per step, producing one valid ordering. Backtracking defers that commitment — it tries a candidate, recurses, then un-tries it to let other candidates be explored, producing all valid orderings." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Shift from 'find one' to 'find all' by replacing greedy selection with backtracking: try every in-degree-0 candidate, recurse, then undo.", "The state to restore is precise: only decrement/increment the in-degrees of tasks that directly depend on the placed task.", "Worst-case time is O(V! × E) — exponential and only feasible for small V; heavy prerequisite edges prune the search tree dramatically.", "A boolean scheduled[] array (or in_degree sentinel value) gives O(1) 'already placed' checks, avoiding the O(V) cost of list membership tests." ] }
\`\`\``,
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
      content: `## Alien Dictionary

<!-- voice:section_check concept="Deriving character order from words" -->

The alien dictionary problem is a canonical topological sort application: given words sorted in an unknown alphabet, **reverse-engineer the character ordering** by reading constraints off adjacent word pairs.

\`\`\`concept
{ "title": "The Core Insight", "variant": "mental-model", "content": "Each pair of adjacent sorted words gives you exactly one ordering constraint. Find the first character where the two words differ — that character in word1 comes before its counterpart in word2. Collect all such directed edges, then topological sort to recover the full alphabet. If a cycle emerges, no valid ordering exists." }
\`\`\`

### Problem Statement

You are given a list of strings \`words\` sorted lexicographically by an alien language's rules. **Derive the character ordering of that language.** Return an empty string if the ordering is invalid (cycle detected or impossible prefix ordering).

\`\`\`tabs
{ "tabs": [
  { "label": "Example 1", "icon": "✅", "content": "**Input:** \`words = [\\"wrt\\", \\"wrf\\", \\"er\\", \\"ett\\", \\"rftt\\"]\`\\n\\n**Output:** \`\\"wertf\\"\`\\n\\n| Pair | First diff | Edge |\\n|------|-----------|------|\\n| wrt → wrf | t vs f | t → f |\\n| wrt → er | w vs e | w → e |\\n| er → ett | r vs t | r → t |\\n| ett → rftt | e vs r | e → r |\\n\\nOrdering: w → e → r → t → f" },
  { "label": "Example 2", "icon": "✅", "content": "**Input:** \`words = [\\"z\\", \\"x\\"]\`\\n\\n**Output:** \`\\"zx\\"\`\\n\\nSingle constraint: z vs x → **z before x**." },
  { "label": "Cycle / Invalid", "icon": "❌", "content": "**Input:** \`words = [\\"z\\", \\"x\\", \\"z\\"]\`\\n\\n**Output:** \`\\"\\"\`\\n\\n- z → x (from pair 1)\\n- x → z (from pair 2)\\n\\nThese two edges form a **cycle** — no valid ordering exists, return \`\\"\\"\`.\\n\\n**Also invalid:** \`[\\"abc\\", \\"ab\\"]\` — \\"abc\\" cannot appear before \\"ab\\" in sorted order (longer word is a prefix of shorter). Return \`\\"\\"\` immediately." }
] }
\`\`\`

### Algorithm: Two Phases

\`\`\`steps
{ "title": "Graph Construction + Kahn's Algorithm", "steps": [
  { "title": "Seed in-degrees for all characters", "content": "Every unique character across all words starts with \`in_degree = 0\`. This ensures isolated characters (ones with no ordering constraints) are still included in the output.\\n\\n\`\`\`python\\nin_degree = Counter({c: 0 for word in words for c in word})\\n\`\`\`" },
  { "title": "Check the prefix edge case first", "content": "Before zipping characters, check if word1 is longer than word2 and word1 starts with word2 — e.g., \`[\\"abc\\", \\"ab\\"]\`. This is impossible in any valid sorted list. Return \`''\` immediately.\\n\\n\`\`\`python\\nif len(word1) > len(word2) and word1.startswith(word2):\\n    return ''\\n\`\`\`" },
  { "title": "Extract the first-differing-character edge", "content": "Zip word1 and word2 character by character. The **first mismatch** gives one directed edge. Stop there — subsequent characters reveal nothing from lexicographic order alone.\\n\\n\`\`\`python\\nfor c1, c2 in zip(word1, word2):\\n    if c1 != c2:\\n        if c2 not in adjacency_list[c1]:  # avoid duplicate edges\\n            adjacency_list[c1].add(c2)\\n            in_degree[c2] += 1\\n        break  # only first diff matters!\\n\`\`\`" },
  { "title": "BFS from zero-in-degree nodes (Kahn's)", "content": "Seed the queue with every character whose \`in_degree == 0\`. Pop one, append to result, decrement all its neighbors' in-degrees, enqueue any that hit 0.\\n\\n\`\`\`python\\nq = deque([c for c in in_degree if in_degree[c] == 0])\\nresult = []\\nwhile q:\\n    c = q.popleft()\\n    result.append(c)\\n    for nei in adjacency_list[c]:\\n        in_degree[nei] -= 1\\n        if in_degree[nei] == 0:\\n            q.append(nei)\\n\`\`\`" },
  { "title": "Cycle detection — it's automatic", "content": "If the graph has a cycle, those nodes can never reach \`in_degree == 0\`, so they never enter the queue. Simply compare result length to the number of unique characters.\\n\\n\`\`\`python\\nreturn ''.join(result) if len(result) == len(in_degree) else ''\\n\`\`\`\\n\\nThis is one of Kahn's cleanest properties — **cycle detection falls out of the algorithm for free**, with no extra bookkeeping." }
] }
\`\`\`

### Visualizing the Constraint Graph

For \`words = ["wrt", "wrf", "er", "ett", "rftt"]\`, building the graph gives:

\`\`\`mermaid
graph LR
  w -->|"wrt→er"| e
  e -->|"er→ett"| r
  r -->|"er→ett"| t
  t -->|"wrt→wrf"| f
\`\`\`

In-degrees after graph construction: \`{w:0, e:1, r:1, t:1, f:1}\`

Kahn's BFS processes nodes in the order their in-degrees hit zero: **w → e → r → t → f** → \`"wertf"\`.

### The Prefix Edge Case

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Bug: missing prefix check", "code": "# words = [\\"abc\\", \\"ab\\"]\\nword1, word2 = \\"abc\\", \\"ab\\"\\n\\n# zip stops at len(word2)=2, comparing \\"ab\\" with \\"ab\\"\\nfor c1, c2 in zip(word1, word2):\\n    if c1 != c2:\\n        # edge found — but no chars differ here!\\n        break\\n# Falls through with NO edge added.\\n# Algorithm returns \\"abc\\" as valid — WRONG.\\n# \\"ab\\" cannot legally appear after \\"abc\\" in sorted order." }, "after": { "label": "Fix: check prefix before zipping", "code": "# words = [\\"abc\\", \\"ab\\"]\\nword1, word2 = \\"abc\\", \\"ab\\"\\n\\n# Guard BEFORE the zip loop\\nif len(word1) > len(word2) and word1.startswith(word2):\\n    return ''  # impossible ordering — caught immediately\\n\\nfor c1, c2 in zip(word1, word2):\\n    if c1 != c2:\\n        adjacency_list[c1].add(c2)\\n        in_degree[c2] += 1\\n        break" } }
\`\`\`

### Full Solution

\`\`\`playground
{ "title": "Alien Dictionary — Complete Implementation", "language": "python", "runnable": true, "code": "from collections import defaultdict, Counter, deque\\nfrom typing import List\\n\\ndef alien_alphabet(words: List[str]) -> str:\\n    # Step 1: Seed in-degree for every unique character\\n    in_degree = Counter({c: 0 for word in words for c in word})\\n    adjacency_list = defaultdict(set)\\n\\n    # Step 2: Build directed graph from adjacent word pairs\\n    for i in range(len(words) - 1):\\n        word1, word2 = words[i], words[i + 1]\\n\\n        # Critical: longer prefix of shorter word is always invalid\\n        if len(word1) > len(word2) and word1.startswith(word2):\\n            return ''\\n\\n        for c1, c2 in zip(word1, word2):\\n            if c1 != c2:\\n                if c2 not in adjacency_list[c1]:  # no duplicate edges\\n                    adjacency_list[c1].add(c2)\\n                    in_degree[c2] += 1\\n                break  # only first differing char gives a valid constraint\\n\\n    # Step 3: Kahn's algorithm — BFS from zero in-degree nodes\\n    q = deque([c for c in in_degree if in_degree[c] == 0])\\n    result = []\\n\\n    while q:\\n        c = q.popleft()\\n        result.append(c)\\n        for neighbor in adjacency_list[c]:\\n            in_degree[neighbor] -= 1\\n            if in_degree[neighbor] == 0:\\n                q.append(neighbor)\\n\\n    # Step 4: Cycle check — if result is shorter, a cycle exists\\n    return ''.join(result) if len(result) == len(in_degree) else ''\\n\\n\\n# Test all cases\\nprint(alien_alphabet([\\"wrt\\", \\"wrf\\", \\"er\\", \\"ett\\", \\"rftt\\"]))  # \\"wertf\\"\\nprint(alien_alphabet([\\"z\\", \\"x\\"]))                           # \\"zx\\"\\nprint(alien_alphabet([\\"z\\", \\"x\\", \\"z\\"]))                      # \\"\\" (cycle)\\nprint(alien_alphabet([\\"abc\\", \\"ab\\"]))                        # \\"\\" (invalid prefix)" }
\`\`\`

### Complexity

| Dimension | Bound | Reasoning |
|-----------|-------|-----------|
| **Time** | O(C) | C = total characters in all words — each char processed at most once during graph build and BFS |
| **Space** | O(1) | At most 26 nodes and 26² edges for a fixed English alphabet |

\`\`\`callout
{ "type": "info", "title": "Why O(1) space — and when it isn't", "content": "The O(1) space claim holds only because we're bounded by a 26-letter English alphabet. If the problem used Unicode or a general symbol set, space would be O(V + E) where V = unique characters and E = ordering edges. Always clarify the alphabet size in an interview." }
\`\`\`

### Quiz

\`\`\`quiz
{ "title": "Test Your Understanding", "questions": [
  { "question": "Words ['apple', 'app'] appear in this order in the alien dictionary. What should your algorithm do?", "options": ["Add no edge — the words share a common prefix", "Extract edge 'l' → nothing, skip to next pair", "Return '' immediately — this ordering is impossible", "Continue normally, zip stops naturally at len('app')"], "answer": 2, "explanation": "'apple' is longer than 'app' and starts with 'app'. In any valid sorted list the shorter word must precede the longer one when one is a prefix of the other. 'apple' appearing first is impossible — return '' before any graph work." },
  { "question": "After Kahn's algorithm, your result has 4 characters but in_degree tracks 5 unique characters. What happened?", "options": ["A bug in initialization — one character was missed", "One character appeared only once and was skipped", "A cycle exists — those nodes never reached in-degree 0", "The input had conflicting constraints that cancelled out"], "answer": 2, "explanation": "Kahn's only processes nodes that reach in_degree == 0. If a cycle exists, the nodes in the cycle are perpetually waiting on each other — they never enter the queue. Result shorter than unique-char count is Kahn's cycle signal." },
  { "question": "Why do we break after finding the first differing character in a word pair?", "options": ["To prevent IndexError on unequal-length words", "Only the first mismatch yields a valid ordering constraint from lexicographic order", "To bring time complexity down from O(C²) to O(C)", "To avoid overwriting edges already added by earlier pairs"], "answer": 1, "explanation": "Lexicographic ordering is determined solely by the first point of difference. 'wrt' before 'wrf' tells us t < f. The characters after position 2 could be in any order — we can infer nothing about them from this pair." },
  { "question": "What is the correct time complexity for this full solution?", "options": ["O(N × M) where N = words, M = average length", "O(26²) because there are at most 26² possible edges", "O(C) where C = total characters across all words", "O(N log N) due to the sorting property of the input"], "answer": 2, "explanation": "Every character is visited a constant number of times: once during in-degree initialization, at most once during graph construction, and once during BFS. Total work is proportional to C. The 26²=676 bound describes worst-case space, not time." }
] }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Pattern-matching cue for interviews", "content": "Alien Dictionary = Course Schedule but with **letters as nodes** and **adjacent word comparisons as prerequisite rules**. Whenever you see 'derive an ordering from relative positions of items', the chain is always: extract directed edges → topological sort → cycle check → done." }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Compare adjacent word pairs to extract character ordering edges — only the FIRST differing character per pair yields a valid constraint.",
  "Always guard against the prefix edge case: if word1 is longer and starts with word2, return '' before touching the graph.",
  "Kahn's algorithm detects cycles for free: if result length ≠ number of unique characters, a cycle prevented some nodes from ever reaching in-degree 0.",
  "Time: O(C) where C is total characters across all words. Space: O(1) for a fixed 26-letter alphabet.",
  "This problem is structurally identical to Course Schedule — the only difference is how you build the directed graph from the input."
] }
\`\`\``,
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

Great work completing the Topological Sort module. Before moving on, let's consolidate what you've built — and make sure the core ideas are solid enough to retrieve under interview pressure.

\`\`\`concept
{ "title": "The Topological Sort Pattern at a Glance", "variant": "mental-model", "content": "Topological sort answers one question: given a set of tasks with dependencies, what order can we complete them in? A valid ordering exists if and only if the dependency graph is a DAG (Directed Acyclic Graph). The moment a cycle appears, no valid ordering is possible — and Kahn's algorithm tells you this for free, without any extra bookkeeping." }
\`\`\`

---

### What You Mastered This Module

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Kahn's Algorithm",
      "icon": "🔁",
      "content": "**BFS-based topological sort using in-degrees.**\\n\\n1. Compute in-degree (number of incoming edges) for every node.\\n2. Enqueue all nodes with in-degree 0 — they have no unmet dependencies.\\n3. Process nodes from the queue: for each neighbor, decrement its in-degree. If it hits 0, enqueue it.\\n4. After processing: if result length equals total nodes → valid order found. Otherwise → cycle detected.\\n\\n**Cycle detection is free** — nodes stuck in a cycle never reach in-degree 0, so they're never enqueued."
    },
    {
      "label": "Cycle Detection",
      "icon": "🔄",
      "content": "**How Kahn's detects cycles without extra tracking:**\\n\\nIf a cycle exists (e.g., A→B→A), both A and B start with in-degree ≥ 1. Neither enters the queue. The result list ends up shorter than the total node count.\\n\\n\`\`\`\\nif len(result) != total_nodes:\\n    return \\"Cycle detected\\"\\n\`\`\`\\n\\nThis is one of the cleanest properties of Kahn's — the DFS approach requires explicit state tracking (unvisited / visiting / visited), but Kahn's gets it for free from the in-degree accounting."
    },
    {
      "label": "All Orderings",
      "icon": "🌿",
      "content": "**Finding every valid topological order uses backtracking.**\\n\\nAt each step, all nodes currently at in-degree 0 are candidates. You pick one, recurse with that node added to the path and its neighbors' in-degrees decremented, then **undo** (backtrack) and try the next candidate.\\n\\nThis exhaustive search is exponential in the worst case — but the pattern is the same backtracking template used across combinatorial search problems."
    },
    {
      "label": "Alien Dictionary",
      "icon": "🔤",
      "content": "**Graph construction from sorted word lists.**\\n\\nCompare adjacent words character by character. The first position where they differ gives you a directed edge: the character in the earlier word comes before the character in the later word in the alien alphabet.\\n\\nEdge case: if word A is a prefix of word B but appears *after* B in the list, the input is invalid (return \`\\"\\"\`).\\n\\nOnce the graph is built, a standard Kahn's run gives you the character ordering — or reports a cycle (impossible ordering)."
    }
  ]
}
\`\`\`

---

### Kahn's Algorithm — Cycle Detection Visualized

The two-course cycle is the canonical "impossible schedule" example. Watch what happens to in-degrees when every node is stuck waiting:

\`\`\`algoviz
{
  "title": "Cycle vs. No Cycle: In-Degree Progression",
  "type": "array",
  "data": [1, 1, 0, 0],
  "frames": [
    { "highlight": [], "label": "Initial in-degrees: [A=1, B=1, C=0, D=0]. Nodes C and D have no dependencies — enqueue them.", "stats": { "queue": "C, D", "processed": 0 } },
    { "highlight": [2], "label": "Process C → decrement A's in-degree: A=0. Enqueue A.", "stats": { "queue": "D, A", "processed": 1 } },
    { "highlight": [3], "label": "Process D → decrement B's in-degree: B=0. Enqueue B.", "stats": { "queue": "A, B", "processed": 2 } },
    { "highlight": [0], "label": "Process A → no outgoing edges.", "stats": { "queue": "B", "processed": 3 } },
    { "highlight": [1], "label": "Process B → no outgoing edges. Result length = 4 = total nodes. ✅ No cycle.", "stats": { "queue": "", "processed": 4 } }
  ],
  "speed": 900
}
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "The Cycle Case", "content": "If the graph were A→B→A (both in-degree 1), the queue starts **empty**. Nothing is ever processed. \`len(result) = 0 ≠ 2\`. Cycle confirmed. This is why the final length check is non-negotiable — never skip it." }
\`\`\`

---

### Checkpoint Quiz

\`\`\`quiz
{
  "title": "Topological Sort — Module Quiz",
  "questions": [
    {
      "question": "What does the in-degree of a node represent in a topological sort context?",
      "options": [
        "The number of outgoing edges from that node",
        "The number of incoming edges (unmet dependencies)",
        "The total degree (in + out) of the node",
        "The node's position in the final ordering"
      ],
      "answer": 1,
      "explanation": "In-degree counts incoming edges — i.e., how many other nodes must be processed before this one. Kahn's algorithm starts with nodes whose in-degree is 0, meaning they have no unmet dependencies."
    },
    {
      "question": "In Kahn's algorithm, which nodes enter the queue first?",
      "options": [
        "Nodes with the highest in-degree",
        "Nodes with the lowest numeric label",
        "Nodes with in-degree 0",
        "Nodes selected at random to break ties"
      ],
      "answer": 2,
      "explanation": "Nodes with in-degree 0 have no unmet prerequisites — they can be processed immediately. Any other starting point would violate the dependency ordering."
    },
    {
      "question": "After running Kahn's algorithm, your result list has 4 nodes but the graph has 5. What does this tell you?",
      "options": [
        "The graph is valid and the algorithm terminated early",
        "One node had no edges and was ignored",
        "There is a cycle involving the missing node(s)",
        "The adjacency list was built incorrectly"
      ],
      "answer": 2,
      "explanation": "If result.length < total nodes, the missing nodes are part of a cycle. Cyclic nodes never reach in-degree 0, so they're never enqueued or processed. This is Kahn's built-in cycle detection."
    },
    {
      "question": "In the Alien Dictionary problem, you compare 'abc' and 'ab' (in that order). What should you return?",
      "options": [
        "Add edge a → b",
        "Add edge c → b",
        "Return empty string — the input is invalid",
        "Skip this pair — no ordering can be derived"
      ],
      "answer": 2,
      "explanation": "'abc' appears before 'ab' in the sorted list, but 'ab' is a prefix of 'abc'. A longer word appearing before its prefix violates any valid lexicographic ordering, so the input is impossible. Return \\"\\"."
    },
    {
      "question": "Which technique is used to find ALL valid topological orderings of a graph?",
      "options": [
        "Dynamic programming over subsets",
        "Greedy selection of the minimum in-degree node",
        "Backtracking — try each in-degree-0 node, recurse, then undo",
        "Binary search on the adjacency list"
      ],
      "answer": 2,
      "explanation": "At each step, all current in-degree-0 nodes are valid candidates. Backtracking tries each one, recurses to build the rest of the ordering, then undoes the choice to explore alternatives. This exhausts all valid orderings."
    }
  ]
}
\`\`\`

---

### Voice Summary Challenge

<!-- voice:checkpoint_summary -->

Your coach will ask you to explain one or more of the following — speak clearly and concretely:

\`\`\`steps
{
  "title": "Topics Your Coach Will Probe",
  "steps": [
    {
      "title": "Explain Kahn's Algorithm step by step",
      "content": "Walk through the algorithm from scratch: compute in-degrees → enqueue zero-in-degree nodes → process queue (decrement neighbors, enqueue new zeros) → check final count. Give a concrete 3-node example."
    },
    {
      "title": "Detect a cycle in a dependency graph",
      "content": "Describe what happens to in-degrees when a cycle exists. Explain why cyclic nodes never reach the queue and how comparing \`len(result)\` to \`total_nodes\` catches the cycle without extra tracking."
    },
    {
      "title": "Derive character ordering from sorted words",
      "content": "Explain how to build the graph from adjacent word pairs, why only the first differing character gives an edge, and what to do when a longer word appears before its own prefix."
    },
    {
      "title": "Find all valid topological orderings",
      "content": "Describe the backtracking template: at each step collect all in-degree-0 nodes as candidates, choose one, recurse, then undo the choice (restore in-degrees, remove from path). Contrast with Kahn's single-ordering run."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "In-degree = number of unmet dependencies. In-degree 0 = ready to process.",
    "Kahn's algorithm detects cycles for free: if result.length < total nodes, a cycle exists.",
    "Kahn's (iterative BFS) is preferred in interviews over DFS — simpler to reason about and no recursion stack.",
    "Alien Dictionary reduces to graph construction + Kahn's. The key edge case is a longer word appearing before its prefix.",
    "Finding all valid orderings requires backtracking — try every in-degree-0 candidate, recurse, undo.",
    "If the problem says 'prerequisites', 'dependencies', 'ordering', or 'before/after' — think topological sort immediately."
  ]
}
\`\`\`

**You've mastered the Topological Sort pattern.** The problems in this category share the same skeleton regardless of how the dependencies are dressed up — build the directed graph, run Kahn's, check the count.`,
    },
  ],
};
