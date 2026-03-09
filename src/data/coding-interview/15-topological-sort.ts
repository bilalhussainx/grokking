import { Module } from "../types";

export const topologicalSortModule: Module = {
  id: "topological-sort",
  title: "Topological Sort",
  description:
    "Learn Kahn's algorithm for ordering tasks with dependencies, detecting cycles, and finding all valid orderings in DAGs.",
  lessons: [
    {
      id: "topological-sort-intro",
      slug: "topological-sort-intro",
      title: "Introduction to Topological Sort",
      content: `# Topological Sort

**Topological sorting** produces a linear ordering of vertices in a **Directed Acyclic Graph (DAG)** such that for every edge u → v, vertex u appears before vertex v. It is the natural way to schedule tasks that have dependencies.

## Kahn's Algorithm (BFS-based)

The most common approach for interviews is **Kahn's algorithm**, which uses in-degree counting and a queue:

1. **Compute in-degrees:** For each node, count how many edges point to it.
2. **Initialize queue:** Add all nodes with in-degree 0 (no dependencies).
3. **Process the queue:**
   - Pop a node, add it to the sorted output.
   - For each neighbor the node points to, decrement its in-degree.
   - If a neighbor's in-degree becomes 0, add it to the queue.
4. **Check for cycles:** If the sorted output contains all nodes, the graph is a valid DAG. If not, there is a cycle.

## Python Skeleton

\`\`\`python
from collections import deque, defaultdict

def topological_sort(vertices, edges):
    in_degree = {i: 0 for i in range(vertices)}
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1

    queue = deque([v for v in in_degree if in_degree[v] == 0])
    sorted_order = []
    while queue:
        node = queue.popleft()
        sorted_order.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return sorted_order if len(sorted_order) == vertices else []
\`\`\`

## Key Points

- A DAG always has at least one valid topological ordering.
- A graph with a cycle has **no** valid topological ordering.
- Multiple valid orderings may exist if nodes at the same level have no mutual dependencies.

## When to Use

- Task scheduling with prerequisites
- Build systems (compile order)
- Course prerequisite planning
- Any problem involving dependency resolution`,
    },
    {
      id: "topo-sort-basic",
      slug: "topo-sort-basic",
      title: "Topological Sort",
      content: `# Topological Sort

## Problem Statement

Given a number of tasks labeled from 0 to \`n-1\` and a list of dependency pairs \`[a, b]\` meaning task \`a\` must be done before task \`b\`, find a valid ordering of all tasks. If multiple valid orderings exist, return any one.

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

## Approach

Apply Kahn's algorithm directly:

1. Build an adjacency list and in-degree map from the prerequisite pairs.
2. Start with all tasks that have in-degree 0.
3. Process the queue: for each completed task, reduce the in-degree of its dependents. When a dependent reaches in-degree 0, it is ready.
4. Return the processing order.

**Time Complexity:** O(V + E) where V is number of tasks and E is number of dependencies.
**Space Complexity:** O(V + E) for the graph and in-degree map.`,
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

## Problem Statement

Given a number of tasks and a list of prerequisite pairs, determine if it is possible to schedule **all** tasks. In other words, check if the dependency graph contains a cycle.

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

**Time Complexity:** O(V + E).
**Space Complexity:** O(V + E).`,
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

## Approach

Standard Kahn's algorithm with the cycle check:

1. Build adjacency list and in-degree counts.
2. Initialize queue with all in-degree-0 nodes.
3. Process the queue, building the sorted order and decrementing neighbor in-degrees.
4. If the sorted order has fewer nodes than the total task count, return an empty list (cycle detected).

This combines the scheduling feasibility check with the ordering output in a single pass.

**Time Complexity:** O(V + E).
**Space Complexity:** O(V + E).`,
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

**Time Complexity:** O(V! * E) in the worst case — the number of valid orderings can be factorial.
**Space Complexity:** O(V! * V) for storing all orderings.`,
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

## Problem Statement

There are \`numCourses\` courses labeled from 0 to \`numCourses - 1\`. You are given prerequisite pairs where \`[a, b]\` means you must complete course \`b\` before course \`a\`. Determine if it is possible to finish all courses.

## Examples

**Example 1:**
\`\`\`
Input: numCourses = 2, prerequisites = [[1, 0]]
Output: True
Explanation: Take course 0 first, then course 1.
\`\`\`

**Example 2:**
\`\`\`
Input: numCourses = 2, prerequisites = [[1, 0], [0, 1]]
Output: False
Explanation: Circular dependency: 0 requires 1 and 1 requires 0.
\`\`\`

**Example 3:**
\`\`\`
Input: numCourses = 4, prerequisites = [[1,0],[2,1],[3,2]]
Output: True
Explanation: Linear chain 0→1→2→3.
\`\`\`

## Approach

This is a direct application of cycle detection via topological sort. Note the **prerequisite direction**: \`[a, b]\` means b → a (b must come before a), so the edge goes from b to a.

1. Build the graph: for each \`[a, b]\`, add edge b → a.
2. Run Kahn's algorithm.
3. If all courses are processed, return True. Otherwise, a cycle exists and return False.

This is essentially the "Tasks Scheduling" problem with a different edge direction convention. Pay careful attention to which element is the prerequisite and which is the dependent.

**Time Complexity:** O(V + E).
**Space Complexity:** O(V + E).`,
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
