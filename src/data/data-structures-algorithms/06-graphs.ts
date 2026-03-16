import { Module } from "../types";

export const graphsModule: Module = {
  id: "graphs",
  title: "Graphs",
  description:
    "Learn graph representations, implement BFS and DFS traversals, and solve shortest path problems with Dijkstra's algorithm.",
  lessons: [
    {
      id: "graphs-representations",
      slug: "graph-representations",
      title: "Graph Representations",
      content: `## Graph Representations

A **graph** consists of **vertices** (nodes) and **edges** (connections). Graphs model networks, maps, social connections, dependencies, and more.

### Types of Graphs

| Type | Description |
|------|-------------|
| **Directed** | Edges have direction (A -> B) |
| **Undirected** | Edges are bidirectional |
| **Weighted** | Edges have associated costs |
| **Unweighted** | All edges have equal cost |

### Representation Options

**Adjacency List** — For each vertex, store a list of neighbors. Best for sparse graphs.

\`\`\`
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
}
\`\`\`

**Adjacency Matrix** — A 2D matrix where \`matrix[i][j] = 1\` if there is an edge from i to j. Best for dense graphs.

### Comparison

| | Adjacency List | Adjacency Matrix |
|-|----------------|-----------------|
| Space | O(V + E) | O(V^2) |
| Check edge | O(degree) | O(1) |
| Find neighbors | O(1) | O(V) |
| Add edge | O(1) | O(1) |

### Problem

Build a Graph class that supports both representations and can convert between them.`,
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

DFS explores a graph by going **as deep as possible** along each branch before backtracking. It uses a **stack** (or recursion).

### Properties

- Time: O(V + E)
- Space: O(V) for the stack and visited set
- Does NOT guarantee shortest path

### Algorithm

1. Start from source, mark visited
2. For each unvisited neighbor, recursively visit it
3. Backtrack when no unvisited neighbors remain

### Applications

- Topological sorting
- Cycle detection
- Connected components
- Path finding (all paths, not necessarily shortest)
- Maze solving

### Problem

Implement DFS traversal (both recursive and iterative) and use DFS to detect cycles in a directed graph.`,
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

**Dijkstra's algorithm** finds the shortest path from a source to all other vertices in a **weighted graph with non-negative edge weights**.

### Algorithm

1. Initialize distances: source = 0, all others = infinity
2. Use a min-heap (priority queue) to always process the closest unvisited vertex
3. For each neighbor, if going through the current vertex gives a shorter path, update the distance
4. Continue until all vertices are processed

### Complexity

- **Time:** O((V + E) log V) with a binary heap
- **Space:** O(V)

### Limitations

- Does NOT work with negative edge weights (use Bellman-Ford instead)
- Greedy approach: once a vertex is finalized, its distance is optimal

### Problem

Implement Dijkstra's algorithm to find shortest distances and paths from a source vertex.`,
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
