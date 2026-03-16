import { Module } from "../types";

export const graphsModule: Module = {
  id: "ds-graphs",
  title: "Graphs",
  description: "Master graph representations, traversals, cycle detection, shortest paths, and union-find for interview success.",
  lessons: [
    {
      id: "graphs-intro",
      slug: "graphs-intro",
      title: "Intro to Graphs",
      content: `## Intro to Graphs

Graphs are one of the most versatile data structures in computer science. They model relationships between objects — social networks, road maps, dependency chains, web pages, and countless other domains. Graph problems are among the most common and challenging in coding interviews.

### What Is a Graph?

A graph \`G = (V, E)\` consists of **vertices** (nodes) and **edges** (connections between nodes). The number of vertices is often written as \`|V|\` and the number of edges as \`|E|\`.

### Directed vs. Undirected

- **Undirected graph**: Edges have no direction. If A connects to B, then B connects to A. Think of Facebook friendships — the relationship is mutual.
- **Directed graph (digraph)**: Edges have direction. An edge from A to B does NOT imply an edge from B to A. Think of Twitter follows — you can follow someone without them following you back.

### Weighted vs. Unweighted

- **Unweighted**: All edges are equal. Finding the shortest path means fewest edges.
- **Weighted**: Each edge has a cost or distance. Finding the shortest path means minimizing total weight. Road networks are a classic example — edges have distances in miles or kilometers.

### Key Terminology

| Term | Definition |
|------|-----------|
| **Degree** | Number of edges connected to a vertex. In directed graphs: in-degree (incoming) and out-degree (outgoing). |
| **Path** | A sequence of vertices connected by edges. |
| **Cycle** | A path that starts and ends at the same vertex. |
| **Connected** | An undirected graph where every vertex is reachable from every other vertex. |
| **DAG** | Directed Acyclic Graph — a directed graph with no cycles. Critical for topological sorting. |
| **Tree** | A connected, acyclic undirected graph. A tree with n nodes always has exactly n-1 edges. |
| **Bipartite** | A graph whose vertices can be divided into two sets such that every edge connects a vertex in one set to a vertex in the other. |

### Density

- **Sparse graph**: \`|E|\` is close to \`|V|\`. Most real-world graphs (social networks, road maps) are sparse.
- **Dense graph**: \`|E|\` is close to \`|V|^2\`. Fully connected networks approach this.

This distinction matters because it determines which representation and algorithms are most efficient.

### Common Graph Problems in Interviews

1. **Traversal**: BFS and DFS — the foundation of almost every graph problem.
2. **Shortest path**: Dijkstra, Bellman-Ford, BFS on unweighted graphs.
3. **Cycle detection**: Required for dependency resolution and deadlock detection.
4. **Topological sort**: Ordering tasks with dependencies (course prerequisites, build systems).
5. **Connected components**: Counting groups, union-find problems.
6. **Minimum spanning tree**: Kruskal's and Prim's algorithms.

### Interview Tips

- Always clarify: Is the graph directed or undirected? Weighted or unweighted? Can there be cycles? Can there be disconnected components?
- Most graph problems reduce to BFS or DFS with some bookkeeping on top.
- If you see "shortest path" in an unweighted graph, think BFS. If weighted with non-negative weights, think Dijkstra.`,
    },
    {
      id: "graphs-representations",
      slug: "graph-representations",
      title: "Graph Representations",
      content: `## Graph Representations

Before you can solve graph problems, you need to represent the graph in code. The two standard representations are **adjacency lists** and **adjacency matrices**. Choosing the right one affects both performance and code complexity.

### Adjacency List

An adjacency list maps each vertex to a list of its neighbors. In Python, use a dictionary of lists:

\`\`\`python
# Undirected graph
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
}

# Weighted directed graph
graph = {
    'A': [('B', 5), ('C', 3)],
    'B': [('D', 2)],
    'C': [('D', 7)],
    'D': []
}
\`\`\`

**Pros**: Space-efficient for sparse graphs — O(|V| + |E|). Iterating over neighbors is fast.
**Cons**: Checking if a specific edge exists is O(degree) in the worst case.

### Adjacency Matrix

An adjacency matrix is a 2D array where \`matrix[i][j]\` indicates whether an edge exists from vertex i to vertex j (and its weight, if applicable).

\`\`\`python
# 4 vertices (0-3), unweighted
matrix = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0]
]
\`\`\`

**Pros**: O(1) edge lookup. Simple implementation. Works well for dense graphs.
**Cons**: O(|V|^2) space regardless of edge count. Iterating over neighbors is O(|V|).

### Trade-off Summary

| Operation | Adjacency List | Adjacency Matrix |
|-----------|---------------|-----------------|
| Space | O(V + E) | O(V^2) |
| Check edge exists | O(degree) | O(1) |
| Get all neighbors | O(degree) | O(V) |
| Add edge | O(1) | O(1) |
| Best for | Sparse graphs | Dense graphs |

### Edge List

A third representation — a simple list of \`(u, v, weight)\` tuples. Used primarily for algorithms like Kruskal's MST that iterate over all edges. Not great for neighbor lookups.

### Building from Input

Interview problems often give you edges as a list of pairs. You need to build the graph yourself:

\`\`\`python
from collections import defaultdict

def build_graph(n, edges, directed=False):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        if not directed:
            graph[v].append(u)
    return graph
\`\`\`

### When to Use Which

- **90% of interview problems**: Use an adjacency list. Most graphs are sparse, and you almost always need to iterate over neighbors.
- **Matrix/grid problems**: The grid itself IS the adjacency structure. No need to build an explicit graph.
- **Dense graph or need O(1) edge check**: Use an adjacency matrix.

### Interview Tips

- Use \`defaultdict(list)\` to avoid KeyError when adding edges.
- For weighted graphs, store tuples: \`graph[u].append((v, weight))\`.
- Always ask if edges are 0-indexed or 1-indexed.`,
    },
    {
      id: "graphs-bfs-dfs",
      slug: "bfs-dfs-patterns",
      title: "BFS & DFS Patterns",
      content: `## BFS & DFS Patterns

Breadth-First Search and Depth-First Search are the two fundamental graph traversal algorithms. Nearly every graph problem in interviews builds on one of these two patterns.

### BFS — Level by Level

BFS explores all neighbors at the current depth before moving to the next depth level. It uses a **queue** (FIFO).

**Template:**
\`\`\`python
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
\`\`\`

**When to use BFS:**
- **Shortest path in unweighted graph** — BFS guarantees the first time you reach a node is via the shortest path.
- **Level-order traversal** — process nodes level by level (e.g., binary tree level order).
- **Minimum steps/moves** — any "minimum number of moves" problem on an unweighted structure.

### DFS — Go Deep First

DFS explores as far as possible along one branch before backtracking. It uses a **stack** (explicit or via recursion).

**Template (iterative):**
\`\`\`python
def dfs(graph, start):
    visited = set()
    stack = [start]
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                stack.append(neighbor)
\`\`\`

**When to use DFS:**
- **Path existence** — is there ANY path between two nodes?
- **Cycle detection** — track the recursion stack.
- **Topological sort** — process nodes in dependency order.
- **Connected components** — count distinct groups.
- **Backtracking problems** — permutations, combinations, Sudoku.

### BFS vs DFS Decision Guide

| Need | Use |
|------|-----|
| Shortest path (unweighted) | BFS |
| Minimum moves/steps | BFS |
| Level-order processing | BFS |
| Any path / reachability | DFS |
| Cycle detection | DFS |
| Topological sort | DFS |
| Exhaustive search | DFS |

### Common Pitfall

Forgetting to mark a node as visited BEFORE adding it to the queue (BFS) causes duplicate processing and potentially infinite loops. Always add to visited when enqueueing, not when dequeueing.

Implement both BFS and DFS on an adjacency list graph, plus shortest path with BFS.`,
      starterCode: `from collections import deque, defaultdict

def bfs(graph: dict, start: str) -> list[str]:
    """
    Perform BFS traversal on a graph starting from 'start'.
    Return the list of nodes in BFS order.

    Time: O(V + E), Space: O(V)
    """
    # TODO: Initialize visited set with start node
    # TODO: Initialize queue with start node
    # TODO: While queue is not empty:
    #   - Dequeue a node, add to result
    #   - For each unvisited neighbor, mark visited and enqueue
    # TODO: Return result list
    pass


def dfs(graph: dict, start: str) -> list[str]:
    """
    Perform DFS traversal on a graph starting from 'start'.
    Return the list of nodes in DFS order (iterative).

    Time: O(V + E), Space: O(V)
    """
    # TODO: Initialize visited set
    # TODO: Initialize stack with start node
    # TODO: While stack is not empty:
    #   - Pop a node; if visited, skip
    #   - Mark visited, add to result
    #   - Push unvisited neighbors onto stack
    # TODO: Return result list
    pass


def shortest_path_bfs(graph: dict, start: str, end: str) -> list[str]:
    """
    Find the shortest path from start to end in an unweighted graph.
    Return the path as a list of nodes, or empty list if no path.

    Time: O(V + E), Space: O(V)
    """
    # TODO: BFS with parent tracking
    # TODO: Use a dict to record how you reached each node
    # TODO: When end is found, backtrack through parents to build path
    pass


# Build a sample graph
graph = defaultdict(list)
edges = [('A','B'), ('A','C'), ('B','D'), ('B','E'),
         ('C','F'), ('E','F'), ('D','G'), ('F','G')]
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)

# Test cases
print(bfs(graph, 'A'))
# ['A', 'B', 'C', 'D', 'E', 'F', 'G']  (order may vary per level)

print(dfs(graph, 'A'))
# ['A', 'C', 'F', 'G', 'D', 'B', 'E']  (order depends on stack)

print(shortest_path_bfs(graph, 'A', 'G'))
# ['A', 'B', 'D', 'G']  (one valid shortest path)
`,
      solutionCode: `from collections import deque, defaultdict

def bfs(graph: dict, start: str) -> list[str]:
    """
    Perform BFS traversal on a graph starting from 'start'.
    Return the list of nodes in BFS order.

    Time: O(V + E), Space: O(V)
    """
    visited = set([start])
    queue = deque([start])
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return result


def dfs(graph: dict, start: str) -> list[str]:
    """
    Perform DFS traversal on a graph starting from 'start'.
    Return the list of nodes in DFS order (iterative).

    Time: O(V + E), Space: O(V)
    """
    visited = set()
    stack = [start]
    result = []

    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        result.append(node)
        # Push neighbors in reverse for consistent left-to-right DFS
        for neighbor in reversed(graph[node]):
            if neighbor not in visited:
                stack.append(neighbor)

    return result


def shortest_path_bfs(graph: dict, start: str, end: str) -> list[str]:
    """
    Find the shortest path from start to end in an unweighted graph.
    Return the path as a list of nodes, or empty list if no path.

    Time: O(V + E), Space: O(V)
    """
    if start == end:
        return [start]

    visited = set([start])
    queue = deque([start])
    parent = {start: None}

    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = node
                if neighbor == end:
                    # Reconstruct path by backtracking through parents
                    path = []
                    current = end
                    while current is not None:
                        path.append(current)
                        current = parent[current]
                    return path[::-1]
                queue.append(neighbor)

    return []  # No path found


# Build a sample graph
graph = defaultdict(list)
edges = [('A','B'), ('A','C'), ('B','D'), ('B','E'),
         ('C','F'), ('E','F'), ('D','G'), ('F','G')]
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)

# Test cases
print(bfs(graph, 'A'))
# ['A', 'B', 'C', 'D', 'E', 'F', 'G']  (order may vary per level)

print(dfs(graph, 'A'))
# ['A', 'B', 'D', 'G', 'F', 'C', 'E']  (order depends on stack)

print(shortest_path_bfs(graph, 'A', 'G'))
# ['A', 'B', 'D', 'G']  (one valid shortest path)
`,
    },
    {
      id: "graphs-cycles",
      slug: "detecting-cycles",
      title: "Detecting Cycles",
      content: `## Detecting Cycles

Cycle detection is essential for dependency resolution, deadlock detection, and validating DAGs. The approach differs significantly between undirected and directed graphs.

### Cycles in Undirected Graphs

In an undirected graph, a cycle exists if during DFS you encounter a visited node that is NOT the parent of the current node.

**Why parent matters**: In an undirected graph, every edge creates a "back link." When we traverse from A to B, B's neighbor list includes A. Without parent tracking, we'd falsely detect A as a cycle.

**Algorithm**: DFS with parent tracking. For each neighbor of the current node, if it's visited and not the parent, we found a cycle.

### Cycles in Directed Graphs — The Coloring Method

Directed graphs need a different approach because back-edges have directional meaning. The standard technique uses **three colors**:

- **WHITE (0)**: Unvisited
- **GRAY (1)**: Currently being processed (on the recursion stack)
- **BLACK (2)**: Fully processed (all descendants explored)

A cycle exists if and only if we encounter a **GRAY** node during DFS. A gray node means we've found a back edge — a path from a node back to one of its ancestors in the DFS tree.

**Why not just "visited"?** In a directed graph, reaching a BLACK node is fine — it means we've found a cross edge or forward edge, not a cycle. Only reaching a node still on the recursion stack (GRAY) indicates a cycle.

### Topological Sort Connection

A directed graph has a valid topological ordering if and only if it has NO cycles (it's a DAG). So cycle detection in directed graphs is equivalent to checking if topological sort is possible.

### Applications

- **Build systems**: Detect circular dependencies between modules.
- **Course prerequisites**: Check if a valid course order exists.
- **Deadlock detection**: Find circular wait conditions.
- **Package managers**: Detect circular package dependencies.

### Complexity

Both algorithms run in O(V + E) time and O(V) space — the same as a standard DFS traversal.

### Interview Tips

- For undirected graphs, always ask: "Can there be self-loops?" If so, handle them as immediate cycles.
- For directed graphs, the coloring method is the standard approach. Memorize the three-color pattern.
- If asked to FIND the cycle (not just detect it), track the path during DFS and extract the cycle when a back edge is found.

Implement cycle detection for a directed graph using the three-color approach.`,
      starterCode: `def has_cycle_directed(n: int, edges: list[list[int]]) -> bool:
    """
    Detect if a directed graph has a cycle.
    n = number of nodes (0 to n-1), edges = list of [from, to].

    Uses the three-color (WHITE/GRAY/BLACK) DFS approach.
    Time: O(V + E), Space: O(V)
    """
    # TODO: Build adjacency list from edges
    # TODO: Initialize color array: 0 = WHITE, 1 = GRAY, 2 = BLACK
    # TODO: Define DFS function that:
    #   - Colors current node GRAY
    #   - For each neighbor:
    #     - If GRAY: cycle found, return True
    #     - If WHITE: recurse; if cycle found, propagate True
    #   - Colors current node BLACK
    #   - Returns False (no cycle from this node)
    # TODO: Call DFS for each WHITE node (handles disconnected graphs)
    pass


def find_cycle_directed(n: int, edges: list[list[int]]) -> list[int]:
    """
    Find and return one cycle in a directed graph, or empty list if none.
    Returns the cycle as a list of nodes.

    Time: O(V + E), Space: O(V)
    """
    # TODO: Build adjacency list
    # TODO: Use three-color DFS with path tracking
    # TODO: When a GRAY node is found, extract the cycle from the path
    pass


# Test cases
print(has_cycle_directed(4, [[0,1],[1,2],[2,3]]))
# False — linear chain, no cycle

print(has_cycle_directed(4, [[0,1],[1,2],[2,0],[2,3]]))
# True — cycle: 0 -> 1 -> 2 -> 0

print(has_cycle_directed(3, [[0,1],[0,2],[1,2]]))
# False — DAG, no cycle

print(find_cycle_directed(4, [[0,1],[1,2],[2,0],[2,3]]))
# [0, 1, 2] or similar cycle representation

print(find_cycle_directed(4, [[0,1],[1,2],[2,3]]))
# [] — no cycle
`,
      solutionCode: `def has_cycle_directed(n: int, edges: list[list[int]]) -> bool:
    """
    Detect if a directed graph has a cycle.
    n = number of nodes (0 to n-1), edges = list of [from, to].

    Uses the three-color (WHITE/GRAY/BLACK) DFS approach.
    Time: O(V + E), Space: O(V)
    """
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)

    # 0 = WHITE (unvisited), 1 = GRAY (in progress), 2 = BLACK (done)
    color = [0] * n

    def dfs(node: int) -> bool:
        color[node] = 1  # Mark as GRAY (on recursion stack)
        for neighbor in graph[node]:
            if color[neighbor] == 1:
                return True  # Back edge — cycle found!
            if color[neighbor] == 0:
                if dfs(neighbor):
                    return True
        color[node] = 2  # Mark as BLACK (fully processed)
        return False

    # Check all nodes (graph may be disconnected)
    for node in range(n):
        if color[node] == 0:
            if dfs(node):
                return True
    return False


def find_cycle_directed(n: int, edges: list[list[int]]) -> list[int]:
    """
    Find and return one cycle in a directed graph, or empty list if none.
    Returns the cycle as a list of nodes.

    Time: O(V + E), Space: O(V)
    """
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)

    color = [0] * n
    path = []  # Current DFS path

    def dfs(node: int) -> list[int]:
        color[node] = 1
        path.append(node)

        for neighbor in graph[node]:
            if color[neighbor] == 1:
                # Found a cycle — extract it from the path
                cycle_start = path.index(neighbor)
                return path[cycle_start:]
            if color[neighbor] == 0:
                result = dfs(neighbor)
                if result:
                    return result

        path.pop()
        color[node] = 2
        return []

    for node in range(n):
        if color[node] == 0:
            result = dfs(node)
            if result:
                return result
    return []


# Test cases
print(has_cycle_directed(4, [[0,1],[1,2],[2,3]]))
# False — linear chain, no cycle

print(has_cycle_directed(4, [[0,1],[1,2],[2,0],[2,3]]))
# True — cycle: 0 -> 1 -> 2 -> 0

print(has_cycle_directed(3, [[0,1],[0,2],[1,2]]))
# False — DAG, no cycle

print(find_cycle_directed(4, [[0,1],[1,2],[2,0],[2,3]]))
# [0, 1, 2] or similar cycle representation

print(find_cycle_directed(4, [[0,1],[1,2],[2,3]]))
# [] — no cycle
`,
    },
    {
      id: "graphs-dijkstra",
      slug: "dijkstras-algorithm",
      title: "Dijkstra's Algorithm",
      content: `## Dijkstra's Algorithm

Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph with **non-negative edge weights**. It is one of the most important algorithms in computer science and a favorite in interviews.

### The Core Idea

Dijkstra's works by greedily selecting the unvisited vertex with the smallest known distance, then updating its neighbors' distances. It uses a **priority queue** (min-heap) to efficiently select the next closest vertex.

### Algorithm Steps

1. Set distance to source = 0, all others = infinity.
2. Add source to the priority queue as (distance=0, node=source).
3. While the priority queue is not empty:
   - Pop the vertex with the smallest distance.
   - If already visited, skip (we found a shorter path earlier).
   - Mark as visited.
   - For each neighbor, calculate new distance through current vertex.
   - If new distance < known distance, update and add to priority queue.

### Why Non-Negative Weights Only?

Dijkstra's greedy approach assumes that once a vertex is finalized (popped from the heap), no shorter path to it exists. A negative edge could invalidate a previously finalized vertex. For graphs with negative weights, use Bellman-Ford instead.

### Complexity

- **Time**: O((V + E) log V) with a binary heap. Each vertex is extracted once (O(V log V)), and each edge is relaxed once (O(E log V)).
- **Space**: O(V) for the distance array and priority queue.

### Common Variations

- **Single target**: Stop as soon as the target is popped from the heap. The distance is guaranteed to be optimal.
- **Path reconstruction**: Maintain a parent/predecessor dictionary. When the target is reached, backtrack through parents.
- **Multiple sources**: Run Dijkstra from each source, or add all sources to the initial heap with distance 0.

### When to Use Dijkstra vs. BFS

| Scenario | Algorithm |
|----------|-----------|
| Unweighted graph | BFS (simpler, O(V+E)) |
| Non-negative weights | Dijkstra |
| Negative weights, no negative cycles | Bellman-Ford |
| All-pairs shortest path | Floyd-Warshall |

### Interview Tips

- Python's \`heapq\` module provides a min-heap. Push tuples like \`(distance, node)\` and they sort by distance automatically.
- The "lazy deletion" approach (skip nodes already visited when popped) is simpler than decrease-key and works perfectly in interviews.
- If the interviewer says "weights are all 1," just use BFS — no need for Dijkstra.

Implement Dijkstra's algorithm with path reconstruction.`,
      starterCode: `import heapq
from collections import defaultdict

def dijkstra(graph: dict, start: str) -> tuple[dict, dict]:
    """
    Find shortest distances from start to all other vertices.
    graph: adjacency list where graph[u] = [(v, weight), ...]
    Returns (distances, parents) where:
      - distances[v] = shortest distance from start to v
      - parents[v] = previous node on shortest path to v

    Time: O((V + E) log V), Space: O(V)
    """
    # TODO: Initialize distances dict: all nodes = infinity, start = 0
    # TODO: Initialize parents dict: all nodes = None
    # TODO: Create min-heap with (0, start)
    # TODO: Create visited set
    # TODO: While heap is not empty:
    #   - Pop (dist, node) with smallest distance
    #   - If already visited, skip
    #   - Mark visited
    #   - For each (neighbor, weight):
    #     - new_dist = dist + weight
    #     - If new_dist < distances[neighbor], update and push to heap
    # TODO: Return (distances, parents)
    pass


def reconstruct_path(parents: dict, start: str, end: str) -> list[str]:
    """
    Reconstruct shortest path from start to end using parent pointers.
    Returns list of nodes from start to end, or empty list if no path.
    """
    # TODO: Backtrack from end to start using parents dict
    # TODO: Reverse the path
    pass


# Build a weighted graph
graph = defaultdict(list)
weighted_edges = [
    ('A', 'B', 4), ('A', 'C', 2), ('B', 'D', 3),
    ('B', 'E', 1), ('C', 'B', 1), ('C', 'D', 5),
    ('D', 'E', 2), ('E', 'F', 3), ('D', 'F', 6)
]
for u, v, w in weighted_edges:
    graph[u].append((v, w))

# Test cases
distances, parents = dijkstra(graph, 'A')
print(distances)
# {'A': 0, 'C': 2, 'B': 3, 'D': 6, 'E': 4, 'F': 7}

print(reconstruct_path(parents, 'A', 'F'))
# ['A', 'C', 'B', 'E', 'F']

print(reconstruct_path(parents, 'A', 'D'))
# ['A', 'C', 'B', 'D']
`,
      solutionCode: `import heapq
from collections import defaultdict

def dijkstra(graph: dict, start: str) -> tuple[dict, dict]:
    """
    Find shortest distances from start to all other vertices.
    graph: adjacency list where graph[u] = [(v, weight), ...]
    Returns (distances, parents) where:
      - distances[v] = shortest distance from start to v
      - parents[v] = previous node on shortest path to v

    Time: O((V + E) log V), Space: O(V)
    """
    distances = {start: 0}
    parents = {start: None}
    visited = set()
    heap = [(0, start)]

    while heap:
        dist, node = heapq.heappop(heap)

        if node in visited:
            continue  # Already found a shorter path
        visited.add(node)

        for neighbor, weight in graph[node]:
            new_dist = dist + weight
            if new_dist < distances.get(neighbor, float('inf')):
                distances[neighbor] = new_dist
                parents[neighbor] = node
                heapq.heappush(heap, (new_dist, neighbor))

    return distances, parents


def reconstruct_path(parents: dict, start: str, end: str) -> list[str]:
    """
    Reconstruct shortest path from start to end using parent pointers.
    Returns list of nodes from start to end, or empty list if no path.
    """
    if end not in parents:
        return []  # No path exists

    path = []
    current = end
    while current is not None:
        path.append(current)
        current = parents[current]
    return path[::-1]


# Build a weighted graph
graph = defaultdict(list)
weighted_edges = [
    ('A', 'B', 4), ('A', 'C', 2), ('B', 'D', 3),
    ('B', 'E', 1), ('C', 'B', 1), ('C', 'D', 5),
    ('D', 'E', 2), ('E', 'F', 3), ('D', 'F', 6)
]
for u, v, w in weighted_edges:
    graph[u].append((v, w))

# Test cases
distances, parents = dijkstra(graph, 'A')
print(distances)
# {'A': 0, 'C': 2, 'B': 3, 'D': 6, 'E': 4, 'F': 7}

print(reconstruct_path(parents, 'A', 'F'))
# ['A', 'C', 'B', 'E', 'F']

print(reconstruct_path(parents, 'A', 'D'))
# ['A', 'C', 'B', 'D']
`,
    },
    {
      id: "graphs-union-find",
      slug: "union-find-disjoint-set",
      title: "Union-Find (Disjoint Set)",
      content: `## Union-Find (Disjoint Set)

Union-Find is a data structure that tracks elements partitioned into disjoint (non-overlapping) sets. It supports two operations efficiently: **find** (which set does an element belong to?) and **union** (merge two sets). It is the go-to structure for connected component problems.

### Core Operations

- **find(x)**: Return the "representative" (root) of the set containing x.
- **union(x, y)**: Merge the sets containing x and y.
- **connected(x, y)**: Check if x and y are in the same set (same root).

### Naive Implementation

Without optimizations, union-find can degrade to O(n) per operation (a tall, skinny tree). Two optimizations make it nearly O(1) amortized:

### Optimization 1: Path Compression

During \`find(x)\`, make every node on the path point directly to the root. This flattens the tree dramatically.

\`\`\`python
def find(self, x):
    if self.parent[x] != x:
        self.parent[x] = self.find(self.parent[x])  # Path compression
    return self.parent[x]
\`\`\`

### Optimization 2: Union by Rank

When merging two sets, attach the shorter tree under the taller tree. This keeps trees balanced. The "rank" is an upper bound on tree height.

\`\`\`python
def union(self, x, y):
    root_x, root_y = self.find(x), self.find(y)
    if root_x == root_y:
        return False  # Already connected
    if self.rank[root_x] < self.rank[root_y]:
        root_x, root_y = root_y, root_x
    self.parent[root_y] = root_x
    if self.rank[root_x] == self.rank[root_y]:
        self.rank[root_x] += 1
    return True
\`\`\`

### Amortized Complexity

With both optimizations, each operation takes O(alpha(n)) amortized time, where alpha is the inverse Ackermann function — effectively O(1) for all practical input sizes.

### Classic Applications

1. **Number of connected components**: Start with n components. Each successful union reduces count by 1.
2. **Detect cycle in undirected graph**: For each edge (u, v), if find(u) == find(v), adding this edge creates a cycle.
3. **Kruskal's MST**: Sort edges by weight, greedily add edges that connect different components.
4. **Accounts merge**: Group accounts with common emails.
5. **Redundant connection**: Find the edge that creates a cycle.

### Interview Tips

- Union-Find is often the cleanest solution for "connected components" or "grouping" problems.
- If a problem says "merge groups" or "are these in the same group," think Union-Find.
- Always implement both path compression AND union by rank. Interviewers expect both.
- Track the component count for problems that ask "how many groups."

Implement a complete UnionFind class with both optimizations.`,
      starterCode: `class UnionFind:
    """
    Disjoint Set Union (Union-Find) with path compression
    and union by rank.

    Time per operation: O(alpha(n)) amortized ~ O(1)
    Space: O(n)
    """

    def __init__(self, n: int):
        """Initialize n elements (0 to n-1), each in its own set."""
        # TODO: Initialize parent array where parent[i] = i
        # TODO: Initialize rank array with all zeros
        # TODO: Track the number of connected components
        pass

    def find(self, x: int) -> int:
        """Find the root representative of x's set with path compression."""
        # TODO: If x is not its own parent, recursively find root
        # TODO: Apply path compression: point x directly to root
        # TODO: Return root
        pass

    def union(self, x: int, y: int) -> bool:
        """
        Merge the sets containing x and y.
        Returns True if merge happened, False if already in same set.
        Uses union by rank to keep trees balanced.
        """
        # TODO: Find roots of x and y
        # TODO: If same root, return False (already connected)
        # TODO: Attach smaller-rank tree under larger-rank tree
        # TODO: If ranks equal, increment the new root's rank
        # TODO: Decrement component count
        # TODO: Return True
        pass

    def connected(self, x: int, y: int) -> bool:
        """Check if x and y are in the same set."""
        # TODO: Compare roots
        pass

    def count(self) -> int:
        """Return the number of disjoint sets."""
        # TODO: Return component count
        pass


# Test cases
uf = UnionFind(7)
print(uf.count())           # 7 — each element is its own set

uf.union(0, 1)
uf.union(1, 2)
print(uf.connected(0, 2))   # True — 0-1-2 are in the same set
print(uf.connected(0, 3))   # False

uf.union(3, 4)
uf.union(5, 6)
print(uf.count())           # 3 — sets: {0,1,2}, {3,4}, {5,6}

uf.union(2, 4)
print(uf.count())           # 2 — sets: {0,1,2,3,4}, {5,6}
print(uf.connected(0, 4))   # True

# Cycle detection using Union-Find
def has_cycle_undirected(n: int, edges: list[list[int]]) -> bool:
    """Detect cycle in an undirected graph using Union-Find."""
    # TODO: Create UnionFind with n nodes
    # TODO: For each edge, if union returns False, cycle exists
    pass

print(has_cycle_undirected(4, [[0,1],[1,2],[2,3]]))      # False
print(has_cycle_undirected(4, [[0,1],[1,2],[2,3],[3,0]])) # True
`,
      solutionCode: `class UnionFind:
    """
    Disjoint Set Union (Union-Find) with path compression
    and union by rank.

    Time per operation: O(alpha(n)) amortized ~ O(1)
    Space: O(n)
    """

    def __init__(self, n: int):
        """Initialize n elements (0 to n-1), each in its own set."""
        self.parent = list(range(n))  # Each node is its own parent
        self.rank = [0] * n           # Initial rank is 0
        self.components = n           # Each element starts as its own set

    def find(self, x: int) -> int:
        """Find the root representative of x's set with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]

    def union(self, x: int, y: int) -> bool:
        """
        Merge the sets containing x and y.
        Returns True if merge happened, False if already in same set.
        Uses union by rank to keep trees balanced.
        """
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return False  # Already in the same set

        # Union by rank: attach smaller tree under larger tree
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x  # Ensure root_x has higher rank
        self.parent[root_y] = root_x

        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1

        self.components -= 1
        return True

    def connected(self, x: int, y: int) -> bool:
        """Check if x and y are in the same set."""
        return self.find(x) == self.find(y)

    def count(self) -> int:
        """Return the number of disjoint sets."""
        return self.components


# Test cases
uf = UnionFind(7)
print(uf.count())           # 7 — each element is its own set

uf.union(0, 1)
uf.union(1, 2)
print(uf.connected(0, 2))   # True — 0-1-2 are in the same set
print(uf.connected(0, 3))   # False

uf.union(3, 4)
uf.union(5, 6)
print(uf.count())           # 3 — sets: {0,1,2}, {3,4}, {5,6}

uf.union(2, 4)
print(uf.count())           # 2 — sets: {0,1,2,3,4}, {5,6}
print(uf.connected(0, 4))   # True

# Cycle detection using Union-Find
def has_cycle_undirected(n: int, edges: list[list[int]]) -> bool:
    """Detect cycle in an undirected graph using Union-Find."""
    uf = UnionFind(n)
    for u, v in edges:
        if not uf.union(u, v):
            return True  # u and v already connected — cycle!
    return False

print(has_cycle_undirected(4, [[0,1],[1,2],[2,3]]))      # False
print(has_cycle_undirected(4, [[0,1],[1,2],[2,3],[3,0]])) # True
`,
    },
  ],
};
