import { Module } from "../types";

export const unionFindModule: Module = {
  id: "union-find",
  title: "Union Find (Disjoint Set)",
  description:
    "Master the Union Find pattern for tracking connected components, detecting cycles, and solving dynamic connectivity problems. Essential for graph algorithms and network analysis.",
  lessons: [
    {
      id: "union-find-intro",
      slug: "union-find-intro",
      title: "Introduction to Union Find",
      content: `## The Union Find (Disjoint Set) Pattern

**Union Find** (also called Disjoint Set Union or DSU) is a data structure that tracks a set of elements partitioned into a number of disjoint (non-overlapping) subsets.

<!-- voice:section_check concept="Union Find basic concept" -->

### Why Union Find?

When you need to:
1. **Track connected components** in a graph
2. **Check if two elements are in the same set** (connected)
3. **Merge two sets** (union operation)
4. **Detect cycles** in undirected graphs

### Core Operations

| Operation | Description | Complexity |
|-----------|-------------|------------|
| \`find(x)\` | Find the root/representative of x | O(α(n)) ≈ O(1) |
| \`union(x, y)\` | Merge sets containing x and y | O(α(n)) ≈ O(1) |
| \`connected(x, y)\` | Check if x and y are in same set | O(α(n)) ≈ O(1) |

*α(n) is the inverse Ackermann function, effectively constant*

### Union Find Structure

Each element has:
- **parent[]**: Points to parent (root points to itself)
- **rank[]** or **size[]**: For union by rank/size optimization

~~~
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))  # Each node is its own parent
        self.rank = [0] * n           # For union by rank
    
    def find(self, x):
        # Path compression: point directly to root
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return  # Already in same set
        
        # Union by rank: attach smaller tree to larger
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
~~~

### Optimizations

1. **Path Compression**: During find, flatten the tree
2. **Union by Rank/Size**: Attach smaller tree to larger

<!-- voice:key_insight insight="With both optimizations, Union Find achieves amortized O(α(n)) time — effectively constant for any practical input size" -->

### When to Use

- Connected components in graphs
- Kruskal's MST algorithm
- Cycle detection in undirected graphs
- Percolation problems
- Equivalence relations

### Complexity

- **Find:** O(α(n)) amortized
- **Union:** O(α(n)) amortized
- **Space:** O(n)`,
    },
    {
      id: "number-of-provinces",
      slug: "number-of-provinces",
      title: "Number of Provinces",
      content: `## Number of Provinces

<!-- voice:section_check concept="Counting connected components" -->

### Problem Statement

There are \`n\` cities. Some of them are connected, while some are not. If city \`a\` is connected directly with city \`b\`, and city \`b\` is connected directly with city \`c\`, then city \`a\` is connected indirectly with city \`c\`.

A **province** is a group of directly or indirectly connected cities with no other cities outside the group.

Given an n×n matrix \`isConnected\` where \`isConnected[i][j] = 1\` if the ith city and jth city are directly connected, return the total number of provinces.

### Examples

~~~
Input: isConnected = [
  [1,1,0],
  [1,1,0],
  [0,0,1]
]
Output: 2
Explanation: Cities 0 and 1 are connected (province 1).
             City 2 is separate (province 2).
~~~

~~~
Input: isConnected = [
  [1,0,0],
  [0,1,0],
  [0,0,1]
]
Output: 3
Explanation: Each city is its own province.
~~~

### Approach

**Union Find:**
1. Initialize UnionFind with n cities
2. For each connection isConnected[i][j] == 1, union(i, j)
3. Count number of unique roots (provinces)

<!-- voice:key_insight insight="Each union operation merges two provinces — the number of provinces equals the number of distinct roots after processing all connections" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n² × α(n)) — check all n² entries, union-find is ~O(1)
- **Space:** O(n) for parent and rank arrays`,
      starterCode: `class UnionFind:
    """Union Find with path compression and union by rank."""
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n  # Number of connected components
    
    def find(self, x):
        # TODO: Implement find with path compression
        pass
    
    def union(self, x, y):
        # TODO: Implement union with union by rank
        pass


def find_circle_num(is_connected):
    """
    Return the number of provinces (connected components).
    
    Args:
        is_connected: n×n matrix where is_connected[i][j] = 1 if cities i and j are connected
    
    Returns:
        int: Number of provinces
    
    Example:
        >>> find_circle_num([[1,1,0],[1,1,0],[0,0,1]])
        2
        >>> find_circle_num([[1,0,0],[0,1,0],[0,0,1]])
        3
    """
    # TODO: Use Union Find to count connected components
    pass


# ─── Test Cases ───

# Two provinces
is_connected1 = [
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 1]
]
print(find_circle_num(is_connected1))
# Expected: 2

# Three separate provinces
is_connected2 = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]
print(find_circle_num(is_connected2))
# Expected: 3

# One big province
is_connected3 = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
]
print(find_circle_num(is_connected3))
# Expected: 1

# Larger example
is_connected4 = [
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1]
]
print(find_circle_num(is_connected4))
# Expected: 2 (provinces: {0,3} and {1,2})
`,
      solutionCode: `class UnionFind:
    """Union Find with path compression and union by rank."""
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n  # Number of connected components
    
    def find(self, x):
        """Find root with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        """Union by rank."""
        px, py = self.find(x), self.find(y)
        if px == py:
            return
        
        # Attach smaller rank tree under larger rank tree
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        
        self.count -= 1


def find_circle_num(is_connected):
    """
    Return the number of provinces (connected components).
    
    Time Complexity: O(n² × α(n))
    Space Complexity: O(n)
    """
    n = len(is_connected)
    uf = UnionFind(n)
    
    for i in range(n):
        for j in range(i + 1, n):  # Only need upper triangle
            if is_connected[i][j] == 1:
                uf.union(i, j)
    
    return uf.count


# Alternative: Count unique roots
def find_circle_num_alt(is_connected):
    """Alternative: count unique roots at the end."""
    n = len(is_connected)
    uf = UnionFind(n)
    
    for i in range(n):
        for j in range(i + 1, n):
            if is_connected[i][j] == 1:
                uf.union(i, j)
    
    # Count unique roots
    provinces = set()
    for i in range(n):
        provinces.add(uf.find(i))
    
    return len(provinces)


# ─── Test Cases ───
is_connected1 = [
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 1]
]
print(find_circle_num(is_connected1))
# Expected: 2

is_connected2 = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]
print(find_circle_num(is_connected2))
# Expected: 3

is_connected3 = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
]
print(find_circle_num(is_connected3))
# Expected: 1

is_connected4 = [
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1]
]
print(find_circle_num(is_connected4))
# Expected: 2
`,
    },
    {
      id: "redundant-connection",
      slug: "redundant-connection",
      title: "Redundant Connection",
      content: `## Redundant Connection

<!-- voice:section_check concept="Cycle detection with Union Find" -->

### Problem Statement

In this problem, a tree is an undirected graph that is connected and has no cycles.

You are given a graph that started as a tree with n nodes labeled from 1 to n, with one additional edge added. The added edge has two different vertices chosen from 1 to n, and was not an edge that already existed.

The graph is represented as a 2D array \`edges\` of length n where \`edges[i] = [ui, vi]\` indicates an edge between nodes ui and vi.

Return an edge that can be removed so that the result is a tree. If there are multiple answers, return the answer that occurs last in \`edges\`.

### Examples

~~~
Input: edges = [[1,2],[1,3],[2,3]]
Output: [2,3]
Explanation: Adding edge [2,3] creates a cycle: 1-2-3-1
~~~

~~~
Input: edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]
Output: [1,4]
Explanation: Adding edge [1,4] creates a cycle: 1-2-3-4-1
~~~

### Approach

**Union Find for Cycle Detection:**
1. Initially, each node is its own set
2. For each edge [u, v]:
   - If find(u) == find(v), adding this edge creates a cycle → this is our answer
   - Otherwise, union(u, v)
3. The first/last edge that creates a cycle is the redundant one

<!-- voice:key_insight insight="If two nodes are already connected, adding another edge between them creates a cycle — Union Find detects this instantly with the find operation" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n × α(n)) ≈ O(n)
- **Space:** O(n)`,
      starterCode: `class UnionFind:
    """Union Find with path compression."""
    def __init__(self, n):
        self.parent = list(range(n + 1))  # 1-indexed
    
    def find(self, x):
        # TODO: Find with path compression
        pass
    
    def union(self, x, y):
        # TODO: Union two sets
        pass


def find_redundant_connection(edges):
    """
    Find the redundant edge that creates a cycle.
    
    Args:
        edges: List of [u, v] edges (1-indexed nodes)
    
    Returns:
        List [u, v] of the redundant edge
    
    Example:
        >>> find_redundant_connection([[1,2],[1,3],[2,3]])
        [2, 3]
        >>> find_redundant_connection([[1,2],[2,3],[3,4],[1,4],[1,5]])
        [1, 4]
    """
    # TODO: Use Union Find to detect cycle
    pass


# ─── Test Cases ───

# Basic cycle
edges1 = [[1, 2], [1, 3], [2, 3]]
print(find_redundant_connection(edges1))
# Expected: [2, 3]

# Larger cycle
edges2 = [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]
print(find_redundant_connection(edges2))
# Expected: [1, 4]

# Multiple possible answers (return last)
edges3 = [[1, 2], [2, 3], [3, 1], [1, 4]]
print(find_redundant_connection(edges3))
# Expected: [3, 1] (creates cycle 1-2-3-1)

# Simple triangle
edges4 = [[1, 2], [2, 3], [1, 3]]
print(find_redundant_connection(edges4))
# Expected: [1, 3]
`,
      solutionCode: `class UnionFind:
    """Union Find with path compression."""
    def __init__(self, n):
        self.parent = list(range(n + 1))  # 1-indexed
    
    def find(self, x):
        """Find root with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        """Union two sets."""
        px, py = self.find(x), self.find(y)
        if px != py:
            self.parent[py] = px


def find_redundant_connection(edges):
    """
    Find the redundant edge that creates a cycle.
    
    Time Complexity: O(n × α(n)) ≈ O(n)
    Space Complexity: O(n)
    """
    n = len(edges)
    uf = UnionFind(n)
    
    for u, v in edges:
        # If already connected, this edge creates a cycle
        if uf.find(u) == uf.find(v):
            return [u, v]
        uf.union(u, v)
    
    return []  # Should not reach here for valid input


# Alternative: Union by rank
def find_redundant_connection_optimized(edges):
    """Optimized with union by rank."""
    n = len(edges)
    parent = list(range(n + 1))
    rank = [0] * (n + 1)
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False
        
        if rank[px] < rank[py]:
            px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]:
            rank[px] += 1
        return True
    
    for u, v in edges:
        if not union(u, v):
            return [u, v]
    
    return []


# ─── Test Cases ───
edges1 = [[1, 2], [1, 3], [2, 3]]
print(find_redundant_connection(edges1))
# Expected: [2, 3]

edges2 = [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]
print(find_redundant_connection(edges2))
# Expected: [1, 4]

edges3 = [[1, 2], [2, 3], [3, 1], [1, 4]]
print(find_redundant_connection(edges3))
# Expected: [3, 1]

edges4 = [[1, 2], [2, 3], [1, 3]]
print(find_redundant_connection(edges4))
# Expected: [1, 3]
`,
    },
    {
      id: "number-of-islands-ii",
      slug: "number-of-islands-ii",
      title: "Number of Islands II",
      content: `## Number of Islands II

<!-- voice:section_check concept="Dynamic connectivity with Union Find" -->

### Problem Statement

You are given an empty 2D binary grid \`grid\` of size m×n. The grid represents a map where \`0\` represents water and \`1\` represents land.

Initially, all cells are water (all 0s). We may perform an \`addLand\` operation which turns the water at position into land. You are given an array \`positions\` where \`positions[i] = [ri, ci]\` is the position to turn into land.

Return an array of integers representing the number of islands after each addLand operation.

An **island** is surrounded by water and formed by connecting adjacent lands horizontally or vertically.

### Examples

~~~
Input: m = 3, n = 3, positions = [[0,0],[0,1],[1,2],[2,1]]
Output: [1,1,2,3]

Explanation:
- Add [0,0]: 1 island
  1 0 0
  0 0 0
  0 0 0
- Add [0,1]: connects to [0,0], still 1 island
  1 1 0
  0 0 0
  0 0 0
- Add [1,2]: separate island, total 2
  1 1 0
  0 0 1
  0 0 0
- Add [2,1]: separate island, total 3
  1 1 0
  0 0 1
  0 1 0
~~~

### Approach

**Union Find for Dynamic Connectivity:**
1. Initialize UnionFind with m×n cells
2. For each position (r, c):
   - Mark as land
   - Check 4 neighbors, if land, union with current
   - Count decreases by 1 for each successful union
   - Record current island count

<!-- voice:key_insight insight="Start with count=1 for each new land, then decrement for each neighbor union — this tracks islands without re-scanning the entire grid" -->

<!-- voice:exercise_intro difficulty="hard" hints_available="3" -->

### Complexity

- **Time:** O(k × α(m×n)) where k is number of positions
- **Space:** O(m×n)`,
      starterCode: `class UnionFind:
    """Union Find for 2D grid."""
    def __init__(self, size):
        self.parent = list(range(size))
        self.rank = [0] * size
        self.count = 0  # Number of islands (connected components)
    
    def find(self, x):
        # TODO: Find with path compression
        pass
    
    def union(self, x, y):
        # TODO: Union by rank, update count
        pass


def num_islands2(m, n, positions):
    """
    Return number of islands after each addLand operation.
    
    Args:
        m: int, number of rows
        n: int, number of columns
        positions: List of [r, c] positions to turn into land
    
    Returns:
        List of integers, island count after each operation
    
    Example:
        >>> num_islands2(3, 3, [[0,0],[0,1],[1,2],[2,1]])
        [1, 1, 2, 3]
    """
    # TODO: Use Union Find for dynamic connectivity
    # Hint: Convert 2D coordinates to 1D index
    pass


# ─── Test Cases ───

# Example from problem
print(num_islands2(3, 3, [[0, 0], [0, 1], [1, 2], [2, 1]]))
# Expected: [1, 1, 2, 3]

# Single cell
print(num_islands2(1, 1, [[0, 0]]))
# Expected: [1]

# All positions connect
print(num_islands2(3, 3, [[0, 0], [0, 1], [1, 0], [1, 1]]))
# Expected: [1, 1, 1, 1]

# All separate islands
print(num_islands2(3, 3, [[0, 0], [0, 2], [2, 0], [2, 2]]))
# Expected: [1, 2, 3, 4]

# Duplicate position (should be ignored)
print(num_islands2(3, 3, [[0, 0], [0, 0], [0, 1]]))
# Expected: [1, 1, 1]
`,
      solutionCode: `class UnionFind:
    """Union Find for 2D grid."""
    def __init__(self, size):
        self.parent = list(range(size))
        self.rank = [0] * size
        self.count = 0  # Number of islands (connected components)
    
    def find(self, x):
        """Find root with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        """Union by rank."""
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        
        self.count -= 1
        return True


def num_islands2(m, n, positions):
    """
    Return number of islands after each addLand operation.
    
    Time Complexity: O(k × α(m×n)) where k = len(positions)
    Space Complexity: O(m × n)
    """
    def index(r, c):
        """Convert 2D coordinates to 1D index."""
        return r * n + c
    
    uf = UnionFind(m * n)
    grid = [[0] * n for _ in range(m)]
    result = []
    
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    for r, c in positions:
        # Skip if already land
        if grid[r][c] == 1:
            result.append(uf.count)
            continue
        
        # Add land
        grid[r][c] = 1
        uf.count += 1
        
        # Check neighbors
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                uf.union(index(r, c), index(nr, nc))
        
        result.append(uf.count)
    
    return result


# Alternative: Without full grid storage
def num_islands2_optimized(m, n, positions):
    """Optimized using set to track land cells."""
    def index(r, c):
        return r * n + c
    
    parent = {}
    rank = {}
    count = 0
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        nonlocal count
        px, py = find(x), find(y)
        if px == py:
            return
        
        if rank[px] < rank[py]:
            px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]:
            rank[px] += 1
        count -= 1
    
    result = []
    land = set()
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    for r, c in positions:
        if (r, c) in land:
            result.append(count)
            continue
        
        # Add new island
        land.add((r, c))
        idx = index(r, c)
        parent[idx] = idx
        rank[idx] = 0
        count += 1
        
        # Union with neighbors
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (nr, nc) in land:
                union(idx, index(nr, nc))
        
        result.append(count)
    
    return result


# ─── Test Cases ───
print(num_islands2(3, 3, [[0, 0], [0, 1], [1, 2], [2, 1]]))
# Expected: [1, 1, 2, 3]

print(num_islands2(1, 1, [[0, 0]]))
# Expected: [1]

print(num_islands2(3, 3, [[0, 0], [0, 1], [1, 0], [1, 1]]))
# Expected: [1, 1, 1, 1]

print(num_islands2(3, 3, [[0, 0], [0, 2], [2, 0], [2, 2]]))
# Expected: [1, 2, 3, 4]

print(num_islands2(3, 3, [[0, 0], [0, 0], [0, 1]]))
# Expected: [1, 1, 1]
`,
    },
    {
      id: "union-find-checkpoint",
      slug: "union-find-checkpoint",
      title: "Module Checkpoint: Union Find",
      content: `## Module Checkpoint: Union Find

<!-- voice:checkpoint_intro -->

Great work on the Union Find module! Let's verify your understanding.

### Quick Review

You learned:
- **Union Find structure**: parent[] array with path compression
- **Optimizations**: Path compression + union by rank = O(α(n)) time
- **Number of Provinces**: Counting connected components
- **Redundant Connection**: Cycle detection in graphs
- **Number of Islands II**: Dynamic connectivity tracking

### Quiz

**Question 1:** What is the amortized time complexity of Union Find operations with both optimizations?
- A) O(n)
- B) O(log n)
- C) O(α(n)) — effectively constant
- D) O(1)

**Question 2:** What does path compression do?
- A) Removes cycles from the graph
- B) Makes every node point directly to the root
- C) Sorts the elements
- D) Reduces the number of nodes

**Question 3:** In Redundant Connection, how do we detect a cycle?
- A) Check if the edge length is zero
- B) Check if find(u) == find(v) before union
- C) Count the number of edges
- D) Use BFS to find a path

**Question 4:** True or False: Union Find can only be used with 1-indexed nodes.

**Question 5:** In Number of Islands II, why does the island count start at 1 and decrease?
- A) It's a bug
- B) Each new land creates an island, but unions merge islands
- C) We count backwards
- D) The grid shrinks

### Voice Summary

Your coach will ask you to:
- Explain Union Find with path compression
- Walk through cycle detection in Redundant Connection
- Explain how to convert 2D coordinates for Union Find
- Describe the union by rank heuristic

**You're mastering the Union Find pattern!**`,
    },
  ],
};
