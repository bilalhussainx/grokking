import { Module } from "../types";

export const graphsModule: Module = {
  id: "graphs",
  title: "Graphs",
  description: "Learn graph representations, implement BFS and DFS traversals, and solve shortest path problems with Dijkstra's algorithm.",
  lessons: [
    {
      id: "graphs-representations",
      slug: "graph-representations",
      title: "Graph Representations",
      content: `## Graph Representations

A **graph** consists of **vertices** (nodes) and **edges** (connections). Graphs model networks, maps, social connections, dependencies, and more.

\`\`\`concept
{
  "title": "Graphs Everywhere",
  "variant": "analogy",
  "content": "Think of a city metro map: each station is a vertex and each direct track between two stations is an edge. The entire map is a graph that tells you how to travel. Social networks, the internet, and even your file system are all graphs hiding in plain sight."
}
\`\`\`

### Types of Graphs

| Type | Description |
|------|-------------|
| **Directed** | Edges have direction (A → B) |
| **Undirected** | Edges are bidirectional |
| **Weighted** | Edges have associated costs |
| **Unweighted** | All edges have equal cost |

### Representation Options

**Adjacency List** — For each vertex, store a list of neighbors. Best for sparse graphs.

\`\`\`playground
{
  "title": "Adjacency List in Python",
  "language": "python",
  "code": "graph = {\\n    'A': ['B', 'C'],\\n    'B': ['A', 'D'],\\n    'C': ['A', 'D'],\\n    'D': ['B', 'C']\\n}\\n\\n# Quick check: neighbors of A\\nprint('Neighbors of A:', graph['A'])\\n\\n# Add a new edge A-D in O(1)\\ngraph['A'].append('D')\\ngraph['D'].append('A')\\nprint('After adding A-D:', graph)",
  "runnable": true
}
\`\`\`

**Adjacency Matrix** — A 2D matrix where \`matrix[i][j] = 1\` if there is an edge from i to j. Best for dense graphs.

\`\`\`algoviz
{
  "title": "Same Graph: List vs Matrix",
  "type": "array",
  "data": [
    ["A", "B", "C", "D"],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0]
  ],
  "frames": [
    { "highlight": [1], "label": "Row A: edges to B and C", "stats": {"row": "A", "edges": 2} },
    { "highlight": [2], "label": "Row B: edges to A and D", "stats": {"row": "B", "edges": 2} },
    { "highlight": [3], "label": "Row C: edges to A and D", "stats": {"row": "C", "edges": 2} },
    { "highlight": [4], "label": "Row D: edges to B and C", "stats": {"row": "D", "edges": 2} }
  ],
  "speed": 1000
}
\`\`\`

### Comparison

| Operation | Adjacency List | Adjacency Matrix |
|-----------|----------------|------------------|
| **Space** | O(V + E) | O(V²) |
| **Check edge** | O(degree) | O(1) |
| **Find neighbors** | O(1) | O(V) |
| **Add edge** | O(1) | O(1) |

\`\`\`callout
{
  "type": "tip",
  "title": "Rule of Thumb",
  "content": "Use an adjacency list when E ≪ V² (sparse graphs) and an adjacency matrix when E ≈ V² (dense graphs). For social networks (sparse) pick the list; for a chessboard (dense) pick the matrix."
}
\`\`\`

\`\`\`quiz
{
  "title": "Pick the Right Representation",
  "questions": [
    {
      "question": "You have 10 000 users and each follows ~50 others. Best representation?",
      "options": ["Adjacency list", "Adjacency matrix", "Edge list", "Incidence matrix"],
      "answer": 0,
      "explanation": "Sparse graph: 10 000 × 50 edges ≪ 10 000². List saves memory and gives fast neighbor iteration."
    },
    {
      "question": "You need to check if an edge exists billions of times per second. Best choice?",
      "options": ["Adjacency list", "Adjacency matrix", "Hash-map of edges", "Both are equal"],
      "answer": 1,
      "explanation": "Matrix lookup is O(1) regardless of degree; list lookup is O(degree) and becomes a bottleneck."
    },
    {
      "question": "Adding a new vertex is asymptotically cheaper in which structure?",
      "options": ["Adjacency list", "Adjacency matrix", "Same cost", "Impossible in both"],
      "answer": 0,
      "explanation": "List appends an empty array in O(1); matrix must resize a V×V grid, costing O(V²)."
    }
  ]
}
\`\`\`

### Problem

Build a Graph class that supports both representations and can convert between them.

\`\`\`fillblank
{
  "title": "Starter: List → Matrix",
  "prompt": "Complete the method that returns an adjacency matrix for the stored list.",
  "language": "python",
  "template": "class Graph:\\n    def __init__(self, vertices):\\n        self.vertices = vertices\\n        self.adj_list = {v: [] for v in vertices}\\n\\n    def add_edge(self, u, v):\\n        self.adj_list[u].append(v)\\n        self.adj_list[v].append(u)  # undirected\\n\\n    def to_matrix(self):\\n        n = len(self.vertices)\\n        matrix = [[0]*n for _ in range(n)]\\n        idx = {v: i for i, v in enumerate(self.vertices)}\\n        for v in self.vertices:\\n            for neighbor in self.adj_list[v]:\\n                matrix[___][___] = 1  # fill blanks\\n        return matrix",
  "blanks": [
    { "answer": "idx[v]", "hint": "row index for vertex v" },
    { "answer": "idx[neighbor]", "hint": "column index for neighbor" }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Adjacency lists shine for sparse graphs and neighbor iteration; matrices excel at fast edge existence checks.",
    "Space cost: list O(V+E) vs matrix O(V²); time cost: neighbor lookup O(1) vs O(V), edge check O(degree) vs O(1).",
    "Choose the representation that matches your algorithm’s hot path: traversal → list, heavy edge queries → matrix."
  ]
}
\`\`\``,
      starterCode: `class Graph:
    def __init__(self):
        self.adj_list = {}

    def add_vertex(self, v):
        # TODO: Add a vertex to the graph
        pass

    def add_edge(self, v1, v2):
        # TODO: Add an undirected edge
        pass

    def get_neighbors(self, v):
        # TODO: Return list of neighbors
        pass

    def has_edge(self, v1, v2):
        # TODO: Return True if edge exists
        pass

    def to_adjacency_matrix(self):
        # TODO: Convert to adjacency matrix
        # Return (matrix, vertex_list) tuple
        pass

# Test cases
g = Graph()
for v in ['A', 'B', 'C', 'D']:
    g.add_vertex(v)
g.add_edge('A', 'B')
g.add_edge('A', 'C')
g.add_edge('B', 'D')
g.add_edge('C', 'D')

print(g.get_neighbors('A'))     # Expected: ['B', 'C']
print(g.has_edge('A', 'B'))     # Expected: True
print(g.has_edge('A', 'D'))     # Expected: False

matrix, vertices = g.to_adjacency_matrix()
print(f"Vertices: {vertices}")
for row in matrix:
    print(row)
`,
      solutionCode: `class Graph:
    def __init__(self):
        self.adj_list = {}

    def add_vertex(self, v):
        if v not in self.adj_list:
            self.adj_list[v] = []

    def add_edge(self, v1, v2):
        if v1 in self.adj_list and v2 in self.adj_list:
            self.adj_list[v1].append(v2)
            self.adj_list[v2].append(v1)

    def get_neighbors(self, v):
        return self.adj_list.get(v, [])

    def has_edge(self, v1, v2):
        return v2 in self.adj_list.get(v1, [])

    def to_adjacency_matrix(self):
        vertices = sorted(self.adj_list.keys())
        index = {v: i for i, v in enumerate(vertices)}
        n = len(vertices)
        matrix = [[0] * n for _ in range(n)]
        for v in vertices:
            for neighbor in self.adj_list[v]:
                matrix[index[v]][index[neighbor]] = 1
        return matrix, vertices

# Test cases
g = Graph()
for v in ['A', 'B', 'C', 'D']:
    g.add_vertex(v)
g.add_edge('A', 'B')
g.add_edge('A', 'C')
g.add_edge('B', 'D')
g.add_edge('C', 'D')

print(g.get_neighbors('A'))     # Expected: ['B', 'C']
print(g.has_edge('A', 'B'))     # Expected: True
print(g.has_edge('A', 'D'))     # Expected: False

matrix, vertices = g.to_adjacency_matrix()
print(f"Vertices: {vertices}")
for row in matrix:
    print(row)
`,
    },
    {
      id: "graphs-bfs",
      slug: "graph-bfs",
      title: "Breadth-First Search",
      content: `## Breadth-First Search (BFS)

BFS explores a graph **level by level**, visiting all neighbors of a node before moving to their neighbors. It uses a **queue** to maintain the order.

\`\`\`mermaid
graph LR
    A["A (1)"] --> B["B (2)"]
    A --> C["C (2)"]
    B --> D["D (3)"]
    B --> E["E (3)"]
    C --> F["F (3)"]
    style A fill:#4ade80
    style B fill:#60a5fa
    style C fill:#60a5fa
    style D fill:#f59e0b
    style E fill:#f59e0b
    style F fill:#f59e0b
\`\`\`

### Properties

- Finds the **shortest path** in unweighted graphs
- Time: O(V + E)
- Space: O(V) for the queue and visited set

### Algorithm

1. Start from source, add to queue, mark visited
2. While queue is not empty:
   - Dequeue a vertex
   - Process it
   - Enqueue all unvisited neighbors, mark them visited

### Applications

- Shortest path in unweighted graphs
- Level-order tree traversal
- Finding connected components
- Web crawling

### Problem

Implement BFS traversal and shortest path finding in an unweighted graph.`,
      starterCode: `from collections import deque

def bfs_traversal(graph, start):
    # TODO: Return list of vertices in BFS order
    pass

def bfs_shortest_path(graph, start, end):
    # TODO: Return shortest path as list of vertices
    # Return empty list if no path exists
    pass

# Test graph
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

print(bfs_traversal(graph, 'A'))
# Expected: ['A', 'B', 'C', 'D', 'E', 'F']

print(bfs_shortest_path(graph, 'A', 'F'))
# Expected: ['A', 'C', 'F']

print(bfs_shortest_path(graph, 'D', 'F'))
# Expected: ['D', 'B', 'E', 'F']

print(bfs_shortest_path(graph, 'A', 'Z'))
# Expected: []
`,
      solutionCode: `from collections import deque

def bfs_traversal(graph, start):
    visited = set([start])
    queue = deque([start])
    result = []
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return result

def bfs_shortest_path(graph, start, end):
    if start == end:
        return [start]
    visited = set([start])
    queue = deque([(start, [start])])
    while queue:
        vertex, path = queue.popleft()
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                new_path = path + [neighbor]
                if neighbor == end:
                    return new_path
                visited.add(neighbor)
                queue.append((neighbor, new_path))
    return []

# Test graph
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

print(bfs_traversal(graph, 'A'))
# Expected: ['A', 'B', 'C', 'D', 'E', 'F']

print(bfs_shortest_path(graph, 'A', 'F'))
# Expected: ['A', 'C', 'F']

print(bfs_shortest_path(graph, 'D', 'F'))
# Expected: ['D', 'B', 'E', 'F']

print(bfs_shortest_path(graph, 'A', 'Z'))
# Expected: []
`,
    },
    {
      id: "graphs-dfs",
      slug: "graph-dfs",
      title: "Depth-First Search",
      content: `## Depth-First Search (DFS)

Depth-First Search explores a graph by going **as deep as possible** along each branch before backtracking. It uses a **stack** (or recursion) to remember where to return when it hits a dead end.

\`\`\`algoviz
{
  "title": "DFS Traversal Order",
  "type": "tree",
  "data": [
    {"id": "A", "label": "A", "children": ["B", "C"]},
    {"id": "B", "label": "B", "children": ["D", "E"]},
    {"id": "C", "label": "C", "children": ["F"]},
    {"id": "D", "label": "D", "children": []},
    {"id": "E", "label": "E", "children": []},
    {"id": "F", "label": "F", "children": []}
  ],
  "frames": [
    {"highlight": ["A"], "label": "Start at A", "stats": {"stack": ["A"], "visited": ["A"]}},
    {"highlight": ["B"], "label": "Go deep to B", "stats": {"stack": ["A", "B"], "visited": ["A", "B"]}},
    {"highlight": ["D"], "label": "Go deeper to D", "stats": {"stack": ["A", "B", "D"], "visited": ["A", "B", "D"]}},
    {"highlight": ["B"], "label": "Backtrack from D", "stats": {"stack": ["A", "B"], "visited": ["A", "B", "D"]}},
    {"highlight": ["E"], "label": "Explore E", "stats": {"stack": ["A", "B", "E"], "visited": ["A", "B", "D", "E"]}},
    {"highlight": ["A"], "label": "Backtrack to A", "stats": {"stack": ["A"], "visited": ["A", "B", "D", "E"]}},
    {"highlight": ["C"], "label": "Explore C", "stats": {"stack": ["A", "C"], "visited": ["A", "B", "C", "D", "E"]}},
    {"highlight": ["F"], "label": "Go deep to F", "stats": {"stack": ["A", "C", "F"], "visited": ["A", "B", "C", "D", "E", "F"]}}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`concept
{
  "title": "DFS Mental Model",
  "variant": "mental-model",
  "content": "Imagine DFS as a brave explorer with a ball of string. The explorer walks down paths as far as possible, unwinding the string. When they hit a dead end, they follow the string back to the last intersection and try a different path. The string is the stack — it remembers the path back."
}
\`\`\`

### Properties

- **Time:** O(V + E) — visits every vertex and edge once
- **Space:** O(V) — stack can hold all vertices in worst case
- **Does NOT guarantee shortest path** — finds *a* path, not necessarily the shortest

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "BFS for Shortest Path",
    "code": "BFS finds shortest path in unweighted graphs\\nbecause it explores level by level"
  },
  "after": {
    "label": "DFS for Path Finding",
    "code": "DFS finds *some* path quickly\\nbut it might be longer than necessary"
  }
}
\`\`\`

### Two Ways to Implement DFS

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Recursive DFS",
      "icon": "🔄",
      "content": "\`\`\`python\\ndef dfs_recursive(graph, vertex, visited=None):\\n    if visited is None:\\n        visited = set()\\n    \\n    visited.add(vertex)\\n    print(vertex)  # Process vertex\\n    \\n    for neighbor in graph[vertex]:\\n        if neighbor not in visited:\\n            dfs_recursive(graph, neighbor, visited)\\n    \\n    return visited\\n\\n# Usage\\ngraph = {'A': ['B', 'C'], 'B': ['D', 'E'], 'C': ['F']}\\ndfs_recursive(graph, 'A')\\n\`\`\`"
    },
    {
      "label": "Iterative DFS",
      "icon": "🥞",
      "content": "\`\`\`python\\ndef dfs_iterative(graph, start):\\n    visited = set()\\n    stack = [start]\\n    \\n    while stack:\\n        vertex = stack.pop()\\n        \\n        if vertex not in visited:\\n            visited.add(vertex)\\n            print(vertex)  # Process vertex\\n            \\n            # Add neighbors to stack (reverse order for same order as recursive)\\n            for neighbor in reversed(graph[vertex]):\\n                if neighbor not in visited:\\n                    stack.append(neighbor)\\n    \\n    return visited\\n\\n# Usage\\ngraph = {'A': ['B', 'C'], 'B': ['D', 'E'], 'C': ['F']}\\ndfs_iterative(graph, 'A')\\n\`\`\`"
    }
  ]
}
\`\`\`

### Real-World Applications

DFS powers many everyday algorithms:

\`\`\`steps
{
  "title": "DFS in Action",
  "steps": [
    {
      "title": "🔍 Maze Solving",
      "content": "DFS explores each corridor until it hits a wall, then backtracks to the last intersection — perfect for finding *any* exit from a maze."
    },
    {
      "title": "📊 Topological Sorting",
      "content": "Used in build systems and course prerequisites to determine the order of tasks when some depend on others."
    },
    {
      "title": "🔄 Cycle Detection",
      "content": "In dependency graphs, DFS can detect circular dependencies that would cause infinite loops or deadlocks."
    },
    {
      "title": "🏝️ Connected Components",
      "content": "Social networks use DFS to find groups of friends — all people reachable from one person form a connected component."
    }
  ]
}
\`\`\`

### Practice: Cycle Detection

Let's use DFS to detect cycles in a directed graph. A cycle exists if we visit a node that's already in our current recursion stack.

\`\`\`playground
{
  "title": "Detect Cycles with DFS",
  "language": "python",
  "code": "def has_cycle(graph):\\n    visited = set()\\n    rec_stack = set()  # Current recursion path\\n    \\n    def dfs(vertex):\\n        if vertex in rec_stack:  # Found a cycle!\\n            return True\\n        if vertex in visited:    # Already processed this branch\\n            return False\\n        \\n        visited.add(vertex)\\n        rec_stack.add(vertex)\\n        \\n        for neighbor in graph.get(vertex, []):\\n            if dfs(neighbor):\\n                return True\\n        \\n        rec_stack.remove(vertex)\\n        return False\\n    \\n    # Check all vertices (graph might be disconnected)\\n    for vertex in graph:\\n        if dfs(vertex):\\n            return True\\n    return False\\n\\n# Test cases\\ntest_graphs = [\\n    {'A': ['B'], 'B': ['C'], 'C': ['A']},  # Cycle A->B->C->A\\n    {'A': ['B'], 'B': ['C'], 'C': []},     # No cycle\\n    {'A': ['B', 'C'], 'B': ['D'], 'C': ['B'], 'D': ['A']}  # Cycle\\n]\\n\\nfor i, g in enumerate(test_graphs, 1):\\n    print(f\\"Graph {i}: {has_cycle(g)}\\")",
  "runnable": true
}
\`\`\`

### Quick Check

\`\`\`quiz
{
  "title": "DFS Understanding Check",
  "questions": [
    {
      "question": "What's the primary data structure DFS uses?",
      "options": ["Queue", "Stack", "Priority Queue", "Hash Table"],
      "answer": 1,
      "explanation": "DFS uses a stack (either explicitly or via recursion) to remember the path and backtrack when needed."
    },
    {
      "question": "In a complete binary tree with 7 nodes, what's the maximum depth of the DFS recursion stack?",
      "options": ["3", "4", "7", "1"],
      "answer": 0,
      "explanation": "A complete binary tree with 7 nodes has 3 levels (root at level 1, leaves at level 3), so the maximum recursion depth is 3."
    },
    {
      "question": "Why doesn't DFS guarantee the shortest path in unweighted graphs?",
      "options": ["It's too slow", "It explores depth-first, not level-by-level", "It uses too much memory", "It skips nodes"],
      "answer": 1,
      "explanation": "DFS goes deep first and might find a longer path to the target before discovering a shorter one that exists at a shallower level."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "DFS explores as deep as possible before backtracking, using a stack for memory",
    "Time complexity is O(V + E), space is O(V) in worst case",
    "Choose DFS when you need any path quickly, topological order, or cycle detection",
    "Recursive implementation is elegant but can hit recursion limits on deep graphs",
    "DFS does NOT find shortest paths — use BFS for that in unweighted graphs"
  ]
}
\`\`\``,
      starterCode: `def dfs_recursive(graph, start, visited=None):
    # TODO: Return list of vertices in DFS order (recursive)
    pass

def dfs_iterative(graph, start):
    # TODO: Return list of vertices in DFS order (iterative with stack)
    pass

def has_cycle(graph):
    # TODO: Detect cycle in a directed graph
    # graph is a dict of vertex -> list of neighbors (directed)
    pass

# Test undirected graph
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

print(dfs_recursive(graph, 'A'))
# One valid output: ['A', 'B', 'D', 'E', 'F', 'C']

print(dfs_iterative(graph, 'A'))
# One valid output: ['A', 'C', 'F', 'E', 'B', 'D']

# Test cycle detection (directed graph)
dag = {'A': ['B', 'C'], 'B': ['D'], 'C': ['D'], 'D': []}
print(has_cycle(dag))  # Expected: False

cyclic = {'A': ['B'], 'B': ['C'], 'C': ['A']}
print(has_cycle(cyclic))  # Expected: True
`,
      solutionCode: `def dfs_recursive(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    result = [start]
    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            result.extend(dfs_recursive(graph, neighbor, visited))
    return result

def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    result = []
    while stack:
        vertex = stack.pop()
        if vertex not in visited:
            visited.add(vertex)
            result.append(vertex)
            for neighbor in reversed(graph.get(vertex, [])):
                if neighbor not in visited:
                    stack.append(neighbor)
    return result

def has_cycle(graph):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {v: WHITE for v in graph}

    def dfs(v):
        color[v] = GRAY
        for neighbor in graph.get(v, []):
            if color.get(neighbor, WHITE) == GRAY:
                return True
            if color.get(neighbor, WHITE) == WHITE and dfs(neighbor):
                return True
        color[v] = BLACK
        return False

    for vertex in graph:
        if color[vertex] == WHITE:
            if dfs(vertex):
                return True
    return False

# Test undirected graph
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

print(dfs_recursive(graph, 'A'))
# One valid output: ['A', 'B', 'D', 'E', 'F', 'C']

print(dfs_iterative(graph, 'A'))
# One valid output: ['A', 'C', 'F', 'E', 'B', 'D']

# Test cycle detection (directed graph)
dag = {'A': ['B', 'C'], 'B': ['D'], 'C': ['D'], 'D': []}
print(has_cycle(dag))  # Expected: False

cyclic = {'A': ['B'], 'B': ['C'], 'C': ['A']}
print(has_cycle(cyclic))  # Expected: True
`,
    },
    {
      id: "graphs-shortest-path",
      slug: "shortest-path",
      title: "Shortest Path (Dijkstra)",
      content: `## Shortest Path — Dijkstra's Algorithm

\`\`\`concept
{
  "title": "Dijkstra's Algorithm",
  "variant": "mental-model",
  "content": "Think of Dijkstra's algorithm as a cautious explorer with a map. It always moves to the nearest unvisited city first, records the shortest known distance to every neighbor, and never revisits a city once its optimal distance is locked in. This greedy strategy guarantees the shortest paths—provided no road has a negative length."
}
\`\`\`

Dijkstra's algorithm finds the shortest path from a source to **all other vertices** in a **weighted graph with non-negative edge weights**. It is the foundation of modern GPS routing, network packet forwarding, and flight-schedule search.

### How the Algorithm Works

\`\`\`steps
{
  "title": "Dijkstra Step-by-Step",
  "steps": [
    {
      "title": "1. Initialize",
      "content": "Set \`dist[src] = 0\` and every other distance to ∞. Push \`(0, src)\` into a min-heap."
    },
    {
      "title": "2. Extract-Min",
      "content": "Pop the vertex \`u\` with the smallest tentative distance from the heap."
    },
    {
      "title": "3. Relax Neighbors",
      "content": "For every edge \`(u, v, w)\`, if \`dist[u] + w < dist[v]\`, update \`dist[v]\` and push \`(dist[v], v)\` into the heap."
    },
    {
      "title": "4. Repeat",
      "content": "Continue until the heap is empty. Each extraction finalizes one vertex’s shortest distance."
    }
  ]
}
\`\`\`

### Live Execution on a Tiny Graph

\`\`\`algoviz
{
  "title": "Dijkstra on a 5-Node Graph",
  "type": "array",
  "data": ["A:0", "B:∞", "C:∞", "D:∞", "E:∞"],
  "frames": [
    { "highlight": [0], "label": "Start at A with distance 0", "stats": { "curr": "A", "done": 0 } },
    { "highlight": [1, 2], "label": "Relax B(4) and C(2)", "stats": { "curr": "A", "done": 1 } },
    { "highlight": [2], "label": "Pick C(2), relax D(5)", "stats": { "curr": "C", "done": 2 } },
    { "highlight": [1], "label": "Pick B(4), relax E(7)", "stats": { "curr": "B", "done": 3 } },
    { "highlight": [3], "label": "Pick D(5), no updates", "stats": { "curr": "D", "done": 4 } },
    { "highlight": [4], "label": "Pick E(7), all done", "stats": { "curr": "E", "done": 5 } }
  ],
  "speed": 1000
}
\`\`\`

### Implementation (Binary-Heap Version)

\`\`\`playground
{
  "title": "Dijkstra in Python",
  "language": "python",
  "runnable": true,
  "code": "import heapq\\n\\ndef dijkstra(graph, src):\\n    \\"\\"\\"\\n    graph: dict {u: [(v, w), ...]}\\n    returns: dict of shortest distances from src\\n    \\"\\"\\"\\n    dist = {v: float('inf') for v in graph}\\n    dist[src] = 0\\n    heap = [(0, src)]\\n    \\n    while heap:\\n        d, u = heapq.heappop(heap)\\n        if d > dist[u]:          # stale entry\\n            continue\\n        for v, w in graph[u]:\\n            nd = d + w\\n            if nd < dist[v]:\\n                dist[v] = nd\\n                heapq.heappush(heap, (nd, v))\\n    return dist\\n\\n# ---- demo ----\\ngraph = {\\n    'A': [('B', 4), ('C', 2)],\\n    'B': [('E', 3)],\\n    'C': [('D', 3), ('E', 5)],\\n    'D': [],\\n    'E': []\\n}\\nprint(dijkstra(graph, 'A'))"
}
\`\`\`

### Complexity & Data-Structure Trade-Offs

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Binary Heap",
      "content": "**Time:** O((V + E) log V)  \\n**Space:** O(V)  \\nBest general-purpose choice for sparse graphs."
    },
    {
      "label": "Fibonacci Heap",
      "content": "**Time:** O(E + V log V)  \\n**Space:** O(V)  \\nTheoretically faster decrease-key, but larger constant factors."
    },
    {
      "label": "Array Scan",
      "content": "**Time:** O(V²)  \\n**Space:** O(V)  \\nSimpler code, competitive for **dense** graphs (E ≈ V²)."
    }
  ]
}
\`\`\`

### Limitations You Must Remember

\`\`\`callout
{
  "type": "warning",
  "title": "Negative Weights Break Dijkstra",
  "content": "The algorithm assumes every edge weight is non-negative. A single negative edge can invalidate the greedy choice and produce wrong answers. For graphs with negative weights, use Bellman-Ford instead."
}
\`\`\`

### Quick Knowledge Check

\`\`\`quiz
{
  "title": "Dijkstra Checkpoint",
  "questions": [
    {
      "question": "Which data structure is most commonly used to achieve O((V + E) log V) time?",
      "options": ["Stack", "Binary heap", "Hash table", "Disjoint-set"],
      "answer": 1,
      "explanation": "A binary min-heap lets us extract the closest unvisited vertex in logarithmic time."
    },
    {
      "question": "What happens if the graph contains a negative edge?",
      "options": ["The algorithm runs slower", "The algorithm may give incorrect distances", "The algorithm still works but needs two passes", "Nothing—performance improves"],
      "answer": 1,
      "explanation": "Dijkstra locks in a vertex once it is finalized; a later negative edge could offer a shorter path that is never considered."
    },
    {
      "question": "After Dijkstra finishes, how many times has each vertex been finalized?",
      "options": ["0", "1", "Up to V", "Up to E"],
      "answer": 1,
      "explanation": "Each vertex is extracted from the priority queue exactly once, marking its shortest distance as final."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Dijkstra greedily processes the closest unvisited vertex, guaranteeing optimal distances when all weights are non-negative.",
    "With a binary heap the runtime is O((V + E) log V) and memory overhead is O(V).",
    "Negative edges invalidate the greedy choice; use Bellman-Ford for those graphs.",
    "The same framework (distance array + priority queue) underlies modern shortest-path engines in maps, networks, and games."
  ]
}
\`\`\``,
      starterCode: `import heapq

def dijkstra(graph, start):
    # TODO: Return dict of shortest distances from start to all vertices
    # graph format: {vertex: [(neighbor, weight), ...]}
    pass

def shortest_path(graph, start, end):
    # TODO: Return (distance, path) for shortest path from start to end
    pass

# Test graph (weighted, undirected)
graph = {
    'A': [('B', 4), ('C', 2)],
    'B': [('A', 4), ('D', 3), ('E', 1)],
    'C': [('A', 2), ('D', 4), ('F', 5)],
    'D': [('B', 3), ('C', 4), ('E', 2)],
    'E': [('B', 1), ('D', 2), ('F', 3)],
    'F': [('C', 5), ('E', 3)]
}

print(dijkstra(graph, 'A'))
# Expected: {'A': 0, 'B': 4, 'C': 2, 'D': 6, 'E': 5, 'F': 7}

dist, path = shortest_path(graph, 'A', 'F')
print(f"Distance: {dist}")  # Expected: 7
print(f"Path: {path}")      # Expected: ['A', 'C', 'F'] or equivalent
`,
      solutionCode: `import heapq

def dijkstra(graph, start):
    distances = {v: float('inf') for v in graph}
    distances[start] = 0
    pq = [(0, start)]

    while pq:
        dist, vertex = heapq.heappop(pq)
        if dist > distances[vertex]:
            continue
        for neighbor, weight in graph.get(vertex, []):
            new_dist = dist + weight
            if new_dist < distances[neighbor]:
                distances[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))

    return distances

def shortest_path(graph, start, end):
    distances = {v: float('inf') for v in graph}
    distances[start] = 0
    previous = {v: None for v in graph}
    pq = [(0, start)]

    while pq:
        dist, vertex = heapq.heappop(pq)
        if vertex == end:
            break
        if dist > distances[vertex]:
            continue
        for neighbor, weight in graph.get(vertex, []):
            new_dist = dist + weight
            if new_dist < distances[neighbor]:
                distances[neighbor] = new_dist
                previous[neighbor] = vertex
                heapq.heappush(pq, (new_dist, neighbor))

    # Reconstruct path
    path = []
    curr = end
    while curr is not None:
        path.append(curr)
        curr = previous[curr]
    path.reverse()

    if distances[end] == float('inf'):
        return float('inf'), []
    return distances[end], path

# Test graph (weighted, undirected)
graph = {
    'A': [('B', 4), ('C', 2)],
    'B': [('A', 4), ('D', 3), ('E', 1)],
    'C': [('A', 2), ('D', 4), ('F', 5)],
    'D': [('B', 3), ('C', 4), ('E', 2)],
    'E': [('B', 1), ('D', 2), ('F', 3)],
    'F': [('C', 5), ('E', 3)]
}

print(dijkstra(graph, 'A'))
# Expected: {'A': 0, 'B': 4, 'C': 2, 'D': 6, 'E': 5, 'F': 7}

dist, path = shortest_path(graph, 'A', 'F')
print(f"Distance: {dist}")  # Expected: 7
print(f"Path: {path}")      # Expected: ['A', 'C', 'F'] or equivalent
`,
    },
  ],
};
