import { Module } from "../types";

export const capstoneModule: Module = {
  id: "capstone",
  title: "Capstone: Putting It Together",
  description:
    "Combine everything you've learned across arrays, hash maps, linked lists, stacks, queues, trees, and graphs. Solve multi-pattern problems and build a mini-project that ties it all together.",
  lessons: [
    // ─── Lesson 1: Pattern Recognition ───
    {
      id: "pattern-recognition",
      slug: "pattern-recognition",
      title: "Pattern Recognition: Choosing the Right Tool",
      content: `## The Hardest Part Isn't Coding — It's Choosing

In a real interview or project, nobody tells you "use a hash map here." You see a problem and must recognize WHICH data structure and pattern to apply. This lesson is a decision framework.

<!-- voice:section_check concept="the real skill is matching problems to patterns" -->

\`\`\`mermaid
graph TD
    START["What does the problem need?"] -->|"O(1) lookup?"| HASH["Hash Map / Set"]
    START -->|"Sorted data?"| SORTED["Two Pointers / Binary Search"]
    START -->|"Contiguous subarray?"| WINDOW["Sliding Window"]
    START -->|"LIFO ordering?"| STACK["Stack"]
    START -->|"FIFO / level-by-level?"| QUEUE["Queue / BFS"]
    START -->|"Hierarchy or paths?"| TREE["Tree DFS / Graph BFS"]
    START -->|"Next greater/smaller?"| MONO["Monotonic Stack"]
    style START fill:#42a5f5,stroke:#333
    style HASH fill:#66bb6a,stroke:#333
    style SORTED fill:#66bb6a,stroke:#333
    style WINDOW fill:#66bb6a,stroke:#333
    style STACK fill:#f9a825,stroke:#333
    style QUEUE fill:#f9a825,stroke:#333
    style TREE fill:#ef5350,stroke:#333
    style MONO fill:#ef5350,stroke:#333
\`\`\`

## The Decision Tree

Ask yourself these questions in order:

### 1. Do I need O(1) lookup by key?
**Yes** -> **Hash Map (dict)** or **Set**
- Looking up if something exists? -> Set
- Looking up a value by key? -> Dict
- Counting occurrences? -> Dict with counting pattern
- Finding complement/pair? -> Dict with complement pattern

### 2. Is the data sorted (or should I sort it)?
**Yes** -> **Two Pointers** or **Binary Search**
- Find a pair summing to target? -> Two pointers (both ends)
- Remove duplicates? -> Two pointers (slow/fast)
- Search for a value? -> Binary search

### 3. Do I need a contiguous subarray/substring?
**Yes** -> **Sliding Window**
- Fixed-size window? -> Fixed sliding window
- Variable-size (condition-based)? -> Expanding/shrinking window

### 4. Do I need to process in a specific order?
- **Last-in-first-out (undo, matching)?** -> **Stack**
- **First-in-first-out (level-by-level)?** -> **Queue**
- **Next greater/smaller element?** -> **Monotonic Stack**

### 5. Is it a tree or graph problem?
- **Explore all paths / any path?** -> **DFS** (recursion or stack)
- **Shortest path / level-by-level?** -> **BFS** (queue)
- **Hierarchy/parent-child?** -> **Tree**
- **Connections/relationships?** -> **Graph**

<!-- voice:key_insight insight="Pattern recognition is a skill you build through practice — the more problems you solve, the faster you recognize the pattern" -->

## Practice: Match the Problem

| Problem | Best Pattern | Why |
|---------|-------------|-----|
| Find if array has duplicate | Set | O(1) membership check |
| Find pair summing to target (unsorted) | Hash map complement | Need O(1) lookup for complement |
| Find pair summing to target (sorted) | Two pointers | Sorted = use both ends |
| Maximum sum of k consecutive elements | Sliding window | Fixed-size contiguous subarray |
| Valid parentheses | Stack | Match most recent open bracket |
| Shortest path in maze | BFS | Unweighted shortest path |
| Check if linked list has cycle | Fast/slow pointers | O(1) space cycle detection |
| Frequency of characters | Hash map counting | Count occurrences |
| Tree diameter | DFS (postorder) | Need subtree heights |
| Next warmer temperature | Monotonic stack | "Next greater" pattern |

## Java: Same Patterns, Different API

\`\`\`java
// The patterns are identical — only the API changes
// Hash Map: Python dict → Java HashMap
// Set: Python set → Java HashSet
// Stack: Python list → Java ArrayDeque
// Queue: Python deque → Java LinkedList/ArrayDeque
// Sorting: Python sorted() → Java Arrays.sort()
\`\`\`

<!-- voice:section_check concept="same patterns across languages" -->

## Try It Yourself

Solve two problems that require you to identify the correct pattern — no hints about which data structure to use.
`,
      starterCode: `def longest_consecutive_sequence(nums):
    """
    Find the length of the longest consecutive sequence.
    Elements do NOT need to be adjacent in the input array.

    Args:
        nums: List of integers (unsorted, may have duplicates)

    Returns:
        Length of longest consecutive sequence

    Example:
        >>> longest_consecutive_sequence([100, 4, 200, 1, 3, 2])
        4  # The sequence is [1, 2, 3, 4]

    Think: What data structure gives O(1) lookup?
    Think: How do you find the START of a sequence?
    Must be O(n) time.
    """
    # TODO: Choose the right data structure and pattern
    # No sorting allowed (that would be O(n log n))
    pass


def subarray_sum_equals_k(nums, k):
    """
    Count the number of contiguous subarrays whose sum equals k.

    Args:
        nums: List of integers (can be negative)
        k: Target sum

    Returns:
        Number of subarrays with sum == k

    Example:
        >>> subarray_sum_equals_k([1, 1, 1], 2)
        2  # [1,1] starting at index 0 and [1,1] starting at index 1

    Think: What is a prefix sum?
    Think: If prefix_sum[j] - prefix_sum[i] == k, what does that mean?
    Think: This is a variation of which classic pattern?
    """
    # TODO: Use prefix sums + the complement pattern
    pass


# ─── Test Cases ───
# Do not modify below this line

print(longest_consecutive_sequence([100, 4, 200, 1, 3, 2]))
# Expected: 4

print(longest_consecutive_sequence([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]))
# Expected: 9

print(longest_consecutive_sequence([]))
# Expected: 0

print(longest_consecutive_sequence([1]))
# Expected: 1

print(subarray_sum_equals_k([1, 1, 1], 2))
# Expected: 2

print(subarray_sum_equals_k([1, 2, 3], 3))
# Expected: 2

print(subarray_sum_equals_k([1, -1, 0], 0))
# Expected: 3
`,
      solutionCode: `def longest_consecutive_sequence(nums):
    """
    Find the length of the longest consecutive sequence.

    Pattern: Set for O(1) lookup + smart iteration
    Key insight: Only start counting from the BEGINNING of a sequence
    (when num-1 is NOT in the set).

    Time Complexity: O(n) — each element visited at most twice
    Space Complexity: O(n) — set storage
    """
    if not nums:
        return 0

    num_set = set(nums)
    longest = 0

    for num in num_set:
        # Only start counting if num is the START of a sequence
        if num - 1 not in num_set:
            current = num
            length = 1
            while current + 1 in num_set:
                current += 1
                length += 1
            longest = max(longest, length)

    return longest


def subarray_sum_equals_k(nums, k):
    """
    Count subarrays with sum equal to k.

    Pattern: Prefix sum + complement (hash map)
    Key insight: If prefix_sum[j] - prefix_sum[i] == k,
    then the subarray from i+1 to j sums to k.
    So we need prefix_sum[i] == prefix_sum[j] - k (the complement).

    Time Complexity: O(n) — single pass
    Space Complexity: O(n) — hash map of prefix sums
    """
    count = 0
    prefix_sum = 0
    prefix_counts = {0: 1}  # Base case: empty prefix

    for num in nums:
        prefix_sum += num
        complement = prefix_sum - k
        if complement in prefix_counts:
            count += prefix_counts[complement]
        prefix_counts[prefix_sum] = prefix_counts.get(prefix_sum, 0) + 1

    return count


# ─── Test Cases ───
# Do not modify below this line

print(longest_consecutive_sequence([100, 4, 200, 1, 3, 2]))
# Expected: 4

print(longest_consecutive_sequence([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]))
# Expected: 9

print(longest_consecutive_sequence([]))
# Expected: 0

print(longest_consecutive_sequence([1]))
# Expected: 1

print(subarray_sum_equals_k([1, 1, 1], 2))
# Expected: 2

print(subarray_sum_equals_k([1, 2, 3], 3))
# Expected: 2

print(subarray_sum_equals_k([1, -1, 0], 0))
# Expected: 3
`,
    },

    // ─── Lesson 2: Multi-Pattern Problem Solving ───
    {
      id: "multi-pattern-problems",
      slug: "multi-pattern-problems",
      title: "Multi-Pattern Problem Solving",
      content: `## Combining Patterns

Real problems often require combining two or more patterns. This lesson tackles problems that use multiple data structures together.

<!-- voice:section_check concept="complex problems combine multiple patterns" -->

## Example: Top K Frequent Elements

Given an array, return the k most frequent elements.

This combines:
1. **Hash map counting** — count frequencies
2. **Sorting or heap** — find top k

\`\`\`python
def top_k_frequent(nums, k):
    # Step 1: Count frequencies (hash map)
    freq = {}
    for num in nums:
        freq[num] = freq.get(num, 0) + 1

    # Step 2: Sort by frequency (or use a heap)
    sorted_items = sorted(freq.keys(), key=lambda x: freq[x], reverse=True)

    return sorted_items[:k]

print(top_k_frequent([1,1,1,2,2,3], 2))  # [1, 2]
\`\`\`

## Example: Group Anagrams

Given a list of strings, group anagrams together.

This combines:
1. **Sorting** (or counting) — to create a canonical form
2. **Hash map** — to group strings by canonical form

\`\`\`python
def group_anagrams(strs):
    groups = {}
    for s in strs:
        key = ''.join(sorted(s))  # Canonical form
        if key not in groups:
            groups[key] = []
        groups[key].append(s)
    return list(groups.values())

print(group_anagrams(["eat","tea","tan","ate","nat","bat"]))
# [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
\`\`\`

<!-- voice:key_insight insight="When a problem feels complex, break it into sub-problems and apply a known pattern to each" -->

## Java: Same Combinations

\`\`\`java
// Group Anagrams in Java
public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> groups = new HashMap<>();
    for (String s : strs) {
        char[] chars = s.toCharArray();
        Arrays.sort(chars);
        String key = new String(chars);
        groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(groups.values());
}
\`\`\`

## Problem-Solving Strategy

1. **Understand the problem** — restate it, identify inputs/outputs, edge cases
2. **Identify the pattern(s)** — use the decision tree from the previous lesson
3. **Plan before coding** — write pseudo-code or draw a diagram
4. **Implement step by step** — don't try to write the whole solution at once
5. **Test with examples** — trace through your code with the given examples
6. **Analyze complexity** — state time and space complexity

<!-- voice:section_check concept="break complex problems into sub-problems" -->

## Try It Yourself

Two multi-pattern problems: group anagrams and find the k closest points to origin.
`,
      starterCode: `def group_anagrams(strs):
    """
    Group strings that are anagrams of each other.

    Args:
        strs: List of lowercase strings

    Returns:
        List of groups (each group is a list of anagram strings)

    Example:
        >>> group_anagrams(["eat","tea","tan","ate","nat","bat"])
        [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]

    Patterns used: Sorting + Hash Map grouping
    """
    # TODO: For each string, create a sorted version as the key
    # Group strings with the same sorted key
    pass


def k_closest_points(points, k):
    """
    Find the k closest points to the origin (0, 0).
    Distance formula: sqrt(x^2 + y^2), but comparing x^2+y^2 is sufficient.

    Args:
        points: List of [x, y] coordinates
        k: Number of closest points to return

    Returns:
        List of k closest points (any order)

    Example:
        >>> k_closest_points([[1,3],[-2,2],[5,8],[0,1]], 2)
        [[-2,2],[0,1]]  # or [[0,1],[-2,2]]

    Patterns used: Sorting (by distance) or Heap
    """
    # TODO: Calculate distance for each point, sort, return first k
    pass


# ─── Test Cases ───
# Do not modify below this line

result = group_anagrams(["eat","tea","tan","ate","nat","bat"])
# Sort each group and sort groups for consistent comparison
sorted_result = sorted([sorted(g) for g in result])
print(sorted_result)
# Expected: [['bat'], ['ate', 'eat', 'tea'], ['nat', 'tan']]

print(group_anagrams([""]))
# Expected: [['']]

print(group_anagrams(["a"]))
# Expected: [['a']]

result2 = k_closest_points([[1,3],[-2,2],[5,8],[0,1]], 2)
# Sort for consistent output
print(sorted(result2))
# Expected: [[-2, 2], [0, 1]]

print(sorted(k_closest_points([[3,3],[5,-1],[-2,4]], 2)))
# Expected: [[-2, 4], [3, 3]]
`,
      solutionCode: `def group_anagrams(strs):
    """
    Group anagram strings together.

    Pattern: Sorting (canonical form) + Hash Map (grouping)
    Time Complexity: O(n * k log k) — n strings, each sorted in O(k log k)
    Space Complexity: O(n * k) — storing all strings in groups
    """
    groups = {}
    for s in strs:
        key = ''.join(sorted(s))
        if key not in groups:
            groups[key] = []
        groups[key].append(s)
    return list(groups.values())


def k_closest_points(points, k):
    """
    Find k closest points to origin.

    Pattern: Sorting by computed key
    Time Complexity: O(n log n) — sorting
    Space Complexity: O(n) — sorted copy
    Alternative: Use a max-heap of size k for O(n log k)
    """
    points.sort(key=lambda p: p[0] ** 2 + p[1] ** 2)
    return points[:k]


# ─── Test Cases ───
# Do not modify below this line

result = group_anagrams(["eat","tea","tan","ate","nat","bat"])
# Sort each group and sort groups for consistent comparison
sorted_result = sorted([sorted(g) for g in result])
print(sorted_result)
# Expected: [['bat'], ['ate', 'eat', 'tea'], ['nat', 'tan']]

print(group_anagrams([""]))
# Expected: [['']]

print(group_anagrams(["a"]))
# Expected: [['a']]

result2 = k_closest_points([[1,3],[-2,2],[5,8],[0,1]], 2)
# Sort for consistent output
print(sorted(result2))
# Expected: [[-2, 2], [0, 1]]

print(sorted(k_closest_points([[3,3],[5,-1],[-2,4]], 2)))
# Expected: [[-2, 4], [3, 3]]
`,
    },

    // ─── Lesson 3: Mini-Project: Social Network ───
    {
      id: "mini-project-social-network",
      slug: "mini-project-social-network",
      title: "Mini-Project: Social Network Analyzer",
      content: `## Build Something Real

Time to combine everything into a mini-project. You'll build a **Social Network Analyzer** that uses arrays, hash maps, sets, and graphs to answer real questions about a social network.

<!-- voice:section_check concept="combining all data structures in one project" -->

## The Scenario

You're building analytics for a social network. Each user has an ID and a name. Users can follow each other (directed graph). You need to answer questions like:
- Who are the most connected users?
- Can user A reach user B through friend chains?
- What are the "friend groups" (connected components)?
- Who should the platform recommend as friends?

## The Data Model

\`\`\`python
# Users: dict mapping user_id -> name
users = {
    1: "Alice", 2: "Bob", 3: "Charlie",
    4: "Diana", 5: "Eve", 6: "Frank"
}

# Friendships: list of (user1, user2) — bidirectional
friendships = [
    (1, 2), (1, 3), (2, 3),  # Alice-Bob-Charlie triangle
    (4, 5),                    # Diana-Eve pair
    # Frank (6) has no friends
]
\`\`\`

## What You'll Implement

1. **Build adjacency list** from friendship pairs (graph representation)
2. **Find most popular user** (most connections — hash map counting)
3. **Suggest friends** (friends of friends who aren't already your friends — set operations)
4. **Find friend groups** (connected components — BFS/DFS)

This project touches every module:
- **Arrays** — input data, result lists
- **Hash Maps** — user lookup, counting connections
- **Sets** — friend-of-friend filtering, visited tracking
- **Queues** — BFS for connected components
- **Graphs** — the social network itself

<!-- voice:key_insight insight="Real projects combine multiple data structures — knowing when to use each one is the mark of a strong programmer" -->

## Java: Same Architecture

\`\`\`java
// The same concepts in Java
Map<Integer, String> users = new HashMap<>();
Map<Integer, List<Integer>> graph = new HashMap<>();
// BFS with Queue<Integer>, visited with Set<Integer>
// Friend suggestions with Set intersection/difference
\`\`\`

<!-- voice:section_check concept="social network is a graph problem" -->

## Try It Yourself

Implement the four functions below to build a complete social network analyzer.
`,
      starterCode: `from collections import deque


def build_graph(friendships):
    """
    Build an adjacency list from a list of friendship pairs.
    Friendships are bidirectional.

    Args:
        friendships: List of (user1, user2) tuples

    Returns:
        Dict mapping each user to a list of their friends

    Example:
        >>> build_graph([(1,2), (2,3)])
        {1: [2], 2: [1, 3], 3: [2]}
    """
    # TODO: Create a dict, add both directions for each friendship
    pass


def most_popular(graph):
    """
    Find the user with the most friends.

    Args:
        graph: Adjacency list (dict mapping user to friend list)

    Returns:
        User ID with the most connections, or None if graph is empty

    Example:
        >>> most_popular({1: [2,3], 2: [1], 3: [1]})
        1
    """
    # TODO: Find the key with the longest value list
    pass


def suggest_friends(graph, user):
    """
    Suggest friends for a user: friends-of-friends who aren't already friends.
    Don't suggest the user themselves.

    Args:
        graph: Adjacency list
        user: User ID to suggest friends for

    Returns:
        Sorted list of suggested user IDs

    Example:
        >>> graph = {1: [2], 2: [1, 3], 3: [2]}
        >>> suggest_friends(graph, 1)
        [3]  # 3 is a friend of 2 (who is a friend of 1)
    """
    # TODO: Get friends, get friends-of-friends, subtract current friends and self
    # Hint: Use sets for efficient difference/union
    pass


def find_friend_groups(graph, all_users):
    """
    Find all friend groups (connected components).
    Users with no friends are their own group.

    Args:
        graph: Adjacency list
        all_users: List of all user IDs (including those with no friends)

    Returns:
        List of groups, where each group is a sorted list of user IDs

    Example:
        >>> graph = {1: [2], 2: [1, 3], 3: [2], 4: [5], 5: [4], 6: []}
        >>> find_friend_groups(graph, [1,2,3,4,5,6])
        [[1, 2, 3], [4, 5], [6]]
    """
    # TODO: Use BFS to find connected components
    # Keep a visited set; for each unvisited user, BFS to find the component
    pass


# ─── Test Cases ───
# Do not modify below this line

friendships = [(1,2), (1,3), (2,3), (4,5)]
graph = build_graph(friendships)
print(sorted(graph[1]))
# Expected: [2, 3]
print(sorted(graph[2]))
# Expected: [1, 3]

print(most_popular(graph))
# Expected: 1 (or 2 or 3 — all have 2 friends; 1 appears first)

print(suggest_friends(graph, 4))
# Expected: [1, 3]  (friends of 5's friend 2... wait, 5 is only friends with 4)
# Actually: 4's friends = [5], 5's friends = [4]. No suggestions.
# Let's use a richer graph:

rich_graph = build_graph([(1,2), (1,3), (2,4), (3,4), (5,6)])
print(suggest_friends(rich_graph, 1))
# Expected: [4]  (4 is friend of 2 and 3, who are friends of 1)

print(suggest_friends(rich_graph, 5))
# Expected: []  (6's only friend is 5, no new suggestions)

groups = find_friend_groups(rich_graph, [1,2,3,4,5,6,7])
sorted_groups = sorted([sorted(g) for g in groups])
print(sorted_groups)
# Expected: [[1, 2, 3, 4], [5, 6], [7]]
`,
      solutionCode: `from collections import deque


def build_graph(friendships):
    """
    Build an adjacency list from friendship pairs.

    Time Complexity: O(E) — process each edge once
    Space Complexity: O(V + E) — adjacency list
    """
    graph = {}
    for u, v in friendships:
        if u not in graph:
            graph[u] = []
        if v not in graph:
            graph[v] = []
        graph[u].append(v)
        graph[v].append(u)
    return graph


def most_popular(graph):
    """
    Find the user with the most friends.

    Time Complexity: O(V) — check each user
    Space Complexity: O(1)
    """
    if not graph:
        return None

    best_user = None
    max_friends = -1
    for user, friends in graph.items():
        if len(friends) > max_friends:
            max_friends = len(friends)
            best_user = user
    return best_user


def suggest_friends(graph, user):
    """
    Suggest friends-of-friends who aren't already friends.

    Time Complexity: O(F * F') — F = friends, F' = avg friends-of-friends
    Space Complexity: O(F + F') — sets for current friends and suggestions
    """
    if user not in graph:
        return []

    my_friends = set(graph[user])
    suggestions = set()

    for friend in my_friends:
        if friend in graph:
            for fof in graph[friend]:
                if fof != user and fof not in my_friends:
                    suggestions.add(fof)

    return sorted(suggestions)


def find_friend_groups(graph, all_users):
    """
    Find connected components using BFS.

    Time Complexity: O(V + E) — BFS visits each vertex and edge once
    Space Complexity: O(V) — visited set + queue
    """
    visited = set()
    groups = []

    for user in all_users:
        if user not in visited:
            # BFS to find the entire connected component
            group = []
            queue = deque([user])
            visited.add(user)

            while queue:
                node = queue.popleft()
                group.append(node)

                if node in graph:
                    for neighbor in graph[node]:
                        if neighbor not in visited:
                            visited.add(neighbor)
                            queue.append(neighbor)

            groups.append(sorted(group))

    return groups


# ─── Test Cases ───
# Do not modify below this line

friendships = [(1,2), (1,3), (2,3), (4,5)]
graph = build_graph(friendships)
print(sorted(graph[1]))
# Expected: [2, 3]
print(sorted(graph[2]))
# Expected: [1, 3]

print(most_popular(graph))
# Expected: 1 (or 2 or 3 — all have 2 friends; 1 appears first)

print(suggest_friends(graph, 4))
# Expected: [1, 3]  (friends of 5's friend 2... wait, 5 is only friends with 4)
# Actually: 4's friends = [5], 5's friends = [4]. No suggestions.
# Let's use a richer graph:

rich_graph = build_graph([(1,2), (1,3), (2,4), (3,4), (5,6)])
print(suggest_friends(rich_graph, 1))
# Expected: [4]  (4 is friend of 2 and 3, who are friends of 1)

print(suggest_friends(rich_graph, 5))
# Expected: []  (6's only friend is 5, no new suggestions)

groups = find_friend_groups(rich_graph, [1,2,3,4,5,6,7])
sorted_groups = sorted([sorted(g) for g in groups])
print(sorted_groups)
# Expected: [[1, 2, 3, 4], [5, 6], [7]]
`,
    },

    // ─── Lesson 4: Module Checkpoint ───
    {
      id: "capstone-checkpoint",
      slug: "capstone-checkpoint",
      title: "Course Checkpoint: Final Review",
      content: `## Congratulations!

You've completed **Grokking Data Structures in Python**. You now have a solid foundation in the core data structures and patterns used in coding interviews and real-world software engineering.

<!-- voice:section_check concept="course completion review" -->
## What You've Built

Over 6 modules, you mastered:

| Module | Key Data Structures | Key Patterns |
|--------|-------------------|-------------|
| Arrays & Strings | List, String | Two pointers, sliding window |
| Hash Maps & Sets | Dict, Set | Counting, complement, membership |
| Linked Lists | ListNode | Three-pointer reversal, fast/slow |
| Stacks & Queues | Stack (list), Queue (deque) | Valid brackets, monotonic stack, BFS |
| Trees & Graphs | TreeNode, Adjacency list | DFS traversals, BFS, shortest path |
| Capstone | All of the above | Pattern recognition, multi-pattern |

## Quick Quiz — Comprehensive

**Question 1:** You have a list of 1 million integers and need to find if any value appears more than once. What is the most time-efficient approach?

A) Sort and check adjacent elements — O(n log n)
B) Use nested loops to check all pairs — O(n^2)
C) Add elements to a set, check for duplicates — O(n)
D) Use binary search on each element — O(n log n)

**Question 2:** Which data structure would you choose for implementing a "recently viewed items" feature that shows the last 10 pages visited?

A) Hash map
B) Stack
C) Queue (bounded deque)
D) Binary tree

**Question 3:** A binary tree has 1000 nodes. What is the maximum possible height? What is the minimum possible height?

**Question 4:** You need to find the shortest path in a maze. The maze is a 2D grid where 0 = open and 1 = wall. Which algorithm do you use and why?

**Question 5:** Write pseudocode (no real code needed) for solving this problem:

"Given a list of file paths like ['/a/b/c', '/a/b/d', '/a/e', '/f'], build a tree structure representing the directory hierarchy."

What data structures would you use?

## Voice Summary

This is your final voice summary. Explain to your coach:

1. Your **three favorite patterns** from the course and when you'd use each
2. The difference between **DFS and BFS** — give a real-world analogy
3. When you'd choose a **hash map vs a sorted array** for fast lookups
4. One thing that **surprised you** or **changed how you think** about data structures

## What's Next?

Now that you have the fundamentals, consider:
- **Grokking Coding Interview** — apply these patterns to 50+ interview problems
- **System Design** — learn how these data structures scale to millions of users
- **Dynamic Programming** — the next level of algorithmic thinking

Keep practicing — the patterns get more natural with every problem you solve.
`,
    },
  ],
};
