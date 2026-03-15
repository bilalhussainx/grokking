import { Module } from "../types";

export const stacksQueuesModule: Module = {
  id: "stacks-queues",
  title: "Stacks & Queues",
  description:
    "Master LIFO and FIFO data structures, learn the monotonic stack pattern for next-greater-element problems, and use queues for BFS — the foundation of graph traversal.",
  lessons: [
    // ─── Lesson 1: Stacks — LIFO ───
    {
      id: "stacks-lifo",
      slug: "stacks-lifo",
      title: "Stacks: Last In, First Out",
      content: `## Think of a Stack of Plates

A **stack** is exactly what it sounds like — a stack of plates. You can only add to the **top** and remove from the **top**. The last plate you put on is the first one you take off: **LIFO** (Last In, First Out).

\`\`\`
Push 1, Push 2, Push 3:
    ┌───┐
    │ 3 │  ← top (most recently added)
    ├───┤
    │ 2 │
    ├───┤
    │ 1 │  ← bottom (first added)
    └───┘

Pop → returns 3
Pop → returns 2
Pop → returns 1
\`\`\`

<!-- voice:section_check concept="stack is LIFO — last in, first out" -->
## Stack in Python

Python lists work perfectly as stacks:

\`\`\`python
stack = []

# Push: append to end — O(1)
stack.append(1)
stack.append(2)
stack.append(3)

# Peek: look at top without removing — O(1)
print(stack[-1])   # 3

# Pop: remove from end — O(1)
top = stack.pop()  # 3
print(stack)       # [1, 2]

# Check if empty
print(len(stack) == 0)  # False
\`\`\`

| Operation | Method | Time |
|-----------|--------|------|
| Push | \`stack.append(x)\` | O(1) |
| Pop | \`stack.pop()\` | O(1) |
| Peek | \`stack[-1]\` | O(1) |
| Is empty | \`len(stack) == 0\` | O(1) |
| Size | \`len(stack)\` | O(1) |

## Java Comparison

\`\`\`java
import java.util.Stack;

Stack<Integer> stack = new Stack<>();
stack.push(1);
stack.push(2);
int top = stack.peek();  // 2
int removed = stack.pop();  // 2
boolean empty = stack.isEmpty();

// Modern Java prefers ArrayDeque as a stack:
Deque<Integer> stack2 = new ArrayDeque<>();
stack2.push(1);  // addFirst
stack2.pop();    // removeFirst
\`\`\`

<!-- voice:key_insight insight="In Python, use list as a stack — append() is push, pop() is pop, [-1] is peek" -->

## Classic Problem: Valid Parentheses

Given a string of brackets, check if every opening bracket has a matching closing bracket in the correct order.

\`\`\`python
def is_valid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}

    for char in s:
        if char in '([{':
            stack.append(char)
        elif char in ')]}':
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()

    return len(stack) == 0
\`\`\`

**Why a stack?** Opening brackets must be matched in **reverse order** — the most recent open bracket must close first. That's exactly LIFO behavior.

<!-- voice:section_check concept="matching brackets is a stack problem" -->

## Where Stacks Show Up

- **Function call stack** — when a function calls another function, the caller waits on the stack
- **Undo/Redo** — each action is pushed; undo pops the last action
- **Browser back button** — visited pages are on a stack
- **Expression evaluation** — parsing math expressions with operators and parentheses
- **DFS (Depth-First Search)** — explicitly or via recursion (which uses the call stack)

## Try It Yourself

Implement the valid parentheses checker and a function that reverses a string using a stack.
`,
      starterCode: `def is_valid_parentheses(s):
    """
    Check if a string of brackets is valid.
    Every opening bracket must have a matching closing bracket in correct order.

    Args:
        s: String containing only '(', ')', '{', '}', '[', ']'

    Returns:
        True if valid, False otherwise

    Example:
        >>> is_valid_parentheses("([]){}")
        True
        >>> is_valid_parentheses("([)]")
        False
    """
    # TODO: Use a stack (list)
    # Push opening brackets, pop and match for closing brackets
    pass


def reverse_string_stack(s):
    """
    Reverse a string using a stack.

    Args:
        s: Input string

    Returns:
        Reversed string

    Example:
        >>> reverse_string_stack("hello")
        'olleh'
    """
    # TODO: Push all characters onto a stack, then pop them all off
    pass


# ─── Test Cases ───
# Do not modify below this line

print(is_valid_parentheses("()"))
# Expected: True

print(is_valid_parentheses("()[]{}"))
# Expected: True

print(is_valid_parentheses("(]"))
# Expected: False

print(is_valid_parentheses("([)]"))
# Expected: False

print(is_valid_parentheses("{[]}"))
# Expected: True

print(is_valid_parentheses(""))
# Expected: True

print(reverse_string_stack("hello"))
# Expected: olleh

print(reverse_string_stack("a"))
# Expected: a

print(reverse_string_stack(""))
# Expected: (empty string)
`,
      solutionCode: `def is_valid_parentheses(s):
    """
    Check if a string of brackets is valid.

    Time Complexity: O(n) — single pass through the string
    Space Complexity: O(n) — stack can hold up to n/2 opening brackets
    """
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}

    for char in s:
        if char in '([{':
            stack.append(char)
        elif char in ')]}':
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()

    return len(stack) == 0


def reverse_string_stack(s):
    """
    Reverse a string using a stack.

    Time Complexity: O(n) — push all, pop all
    Space Complexity: O(n) — stack holds all characters
    """
    stack = list(s)
    result = []
    while stack:
        result.append(stack.pop())
    return ''.join(result)
    # Alternative (Pythonic): return s[::-1]


# ─── Test Cases ───
# Do not modify below this line

print(is_valid_parentheses("()"))
# Expected: True

print(is_valid_parentheses("()[]{}"))
# Expected: True

print(is_valid_parentheses("(]"))
# Expected: False

print(is_valid_parentheses("([)]"))
# Expected: False

print(is_valid_parentheses("{[]}"))
# Expected: True

print(is_valid_parentheses(""))
# Expected: True

print(reverse_string_stack("hello"))
# Expected: olleh

print(reverse_string_stack("a"))
# Expected: a

print(reverse_string_stack(""))
# Expected: (empty string)
`,
    },

    // ─── Lesson 2: Queues — FIFO ───
    {
      id: "queues-fifo",
      slug: "queues-fifo",
      title: "Queues: First In, First Out",
      content: `## Think of a Line at a Store

A **queue** works like a real-world line: the first person to arrive is the first one served. **FIFO** — First In, First Out.

\`\`\`
Enqueue 1, 2, 3:
    Front → [1] [2] [3] ← Back

Dequeue → returns 1 (first in line)
    Front → [2] [3] ← Back
\`\`\`

<!-- voice:section_check concept="queue is FIFO — first in, first out" -->
## Queue in Python: Use deque

**Do NOT use a regular list as a queue.** Removing from the front of a list is O(n) because every element shifts. Python's \`collections.deque\` gives O(1) operations on both ends.

\`\`\`python
from collections import deque

queue = deque()

# Enqueue: add to the back — O(1)
queue.append(1)
queue.append(2)
queue.append(3)

# Dequeue: remove from the front — O(1)
front = queue.popleft()  # 1
print(queue)  # deque([2, 3])

# Peek at front — O(1)
print(queue[0])  # 2

# Size
print(len(queue))  # 2
\`\`\`

| Operation | deque Method | Time | list Method | Time |
|-----------|-------------|------|-------------|------|
| Enqueue (back) | \`append(x)\` | O(1) | \`append(x)\` | O(1) |
| Dequeue (front) | \`popleft()\` | O(1) | \`pop(0)\` | **O(n)** |
| Peek front | \`queue[0]\` | O(1) | \`list[0]\` | O(1) |

<!-- voice:key_insight insight="Always use collections.deque for queues in Python — list.pop(0) is O(n), deque.popleft() is O(1)" -->

## Java Comparison

\`\`\`java
import java.util.LinkedList;
import java.util.Queue;

Queue<Integer> queue = new LinkedList<>();
queue.offer(1);        // enqueue
queue.offer(2);
int front = queue.peek();   // peek: 1
int removed = queue.poll();  // dequeue: 1
\`\`\`

## Stack vs Queue

| Feature | Stack (LIFO) | Queue (FIFO) |
|---------|-------------|-------------|
| Add | Push (top) | Enqueue (back) |
| Remove | Pop (top) | Dequeue (front) |
| Real-world | Stack of plates, undo | Line at store, printer |
| Algorithm | DFS, backtracking | BFS, level-order |

## BFS: The Queue's Killer App

Breadth-First Search uses a queue to explore nodes level by level. You'll use this extensively in the Trees & Graphs module.

\`\`\`python
from collections import deque

def bfs_preview(graph, start):
    """Visit nodes level by level using a queue."""
    visited = set()
    queue = deque([start])
    visited.add(start)

    while queue:
        node = queue.popleft()
        print(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
\`\`\`

<!-- voice:section_check concept="BFS uses a queue to process nodes level by level" -->

## Try It Yourself

Implement a recent-calls counter using a queue and a function to generate binary numbers from 1 to n using a queue.
`,
      starterCode: `from collections import deque


def recent_counter():
    """
    Create a function that counts how many requests were made in the last 3000ms.

    Returns:
        A function ping(t) where t is the current timestamp in ms.
        ping(t) returns how many pings happened in [t-3000, t].

    Example:
        >>> ping = recent_counter()
        >>> ping(1)      # 1 request in [−2999, 1]
        1
        >>> ping(100)    # 2 requests in [−2900, 100]
        2
        >>> ping(3001)   # 3 requests in [1, 3001]
        3
        >>> ping(3002)   # 3 requests in [2, 3002] — ping(1) dropped
        3
    """
    # TODO: Create a deque to store timestamps
    # In the ping function, add t to the queue, then remove old timestamps
    # Return the queue length
    queue = deque()

    def ping(t):
        # TODO: Add t, remove entries older than t - 3000, return count
        pass

    return ping


def generate_binary(n):
    """
    Generate binary representations of numbers 1 through n using a queue.

    Args:
        n: Positive integer

    Returns:
        List of binary strings from "1" to binary(n)

    Example:
        >>> generate_binary(5)
        ['1', '10', '11', '100', '101']

    Hint: Start with "1" in the queue. For each number, dequeue it,
    then enqueue it+"0" and it+"1". The dequeued values are your results.
    """
    # TODO: Use a queue-based approach (BFS-like)
    pass


# ─── Test Cases ───
# Do not modify below this line

ping = recent_counter()
print(ping(1))
# Expected: 1

print(ping(100))
# Expected: 2

print(ping(3001))
# Expected: 3

print(ping(3002))
# Expected: 3

print(generate_binary(5))
# Expected: ['1', '10', '11', '100', '101']

print(generate_binary(1))
# Expected: ['1']

print(generate_binary(3))
# Expected: ['1', '10', '11']
`,
      solutionCode: `from collections import deque


def recent_counter():
    """
    Count requests in the last 3000ms using a queue.

    Time Complexity per ping: O(1) amortized — each element enqueued/dequeued at most once
    Space Complexity: O(W) — where W is the window size (max elements in 3000ms)
    """
    queue = deque()

    def ping(t):
        queue.append(t)
        while queue[0] < t - 3000:
            queue.popleft()
        return len(queue)

    return ping


def generate_binary(n):
    """
    Generate binary representations using a queue (BFS approach).

    Time Complexity: O(n) — generate n numbers
    Space Complexity: O(n) — queue and result list
    """
    if n <= 0:
        return []

    result = []
    queue = deque(["1"])

    for _ in range(n):
        current = queue.popleft()
        result.append(current)
        queue.append(current + "0")
        queue.append(current + "1")

    return result


# ─── Test Cases ───
# Do not modify below this line

ping = recent_counter()
print(ping(1))
# Expected: 1

print(ping(100))
# Expected: 2

print(ping(3001))
# Expected: 3

print(ping(3002))
# Expected: 3

print(generate_binary(5))
# Expected: ['1', '10', '11', '100', '101']

print(generate_binary(1))
# Expected: ['1']

print(generate_binary(3))
# Expected: ['1', '10', '11']
`,
    },

    // ─── Lesson 3: Monotonic Stack ───
    {
      id: "monotonic-stack",
      slug: "monotonic-stack",
      title: "Monotonic Stack",
      content: `## The Next Greater Element Pattern

A **monotonic stack** maintains elements in sorted order (either always increasing or always decreasing). It is the go-to technique for "next greater element" and "next smaller element" problems.

<!-- voice:section_check concept="monotonic stack keeps elements in sorted order" -->
## The Problem

Given an array, for each element find the **next greater element** — the first element to its right that is larger.

\`\`\`
Input:  [2, 1, 2, 4, 3]
Output: [4, 2, 4, -1, -1]

Explanation:
  2 → next greater is 4
  1 → next greater is 2
  2 → next greater is 4
  4 → no greater element → -1
  3 → no greater element → -1
\`\`\`

## Brute Force: O(n^2)

For each element, scan right until you find a larger one:

\`\`\`python
# Slow — don't do this
def next_greater_brute(nums):
    result = [-1] * len(nums)
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[j] > nums[i]:
                result[i] = nums[j]
                break
    return result
\`\`\`

## Monotonic Stack Solution: O(n)

The key insight: process elements from **right to left** and maintain a stack of candidates for "next greater." Pop any candidates smaller than the current element — they can never be the answer for anything further left.

\`\`\`python
def next_greater(nums):
    result = [-1] * len(nums)
    stack = []  # Stores values, decreasing from bottom to top

    for i in range(len(nums) - 1, -1, -1):
        # Pop elements smaller than current — they're useless
        while stack and stack[-1] <= nums[i]:
            stack.pop()

        # If stack is non-empty, top is the next greater
        if stack:
            result[i] = stack[-1]

        # Push current element as a candidate
        stack.append(nums[i])

    return result
\`\`\`

<!-- voice:key_insight insight="A monotonic stack processes elements in O(n) because each element is pushed and popped at most once" -->

## Walk Through

\`\`\`
nums = [2, 1, 2, 4, 3]
Processing right to left:

i=4, num=3: stack=[], push 3. stack=[3], result[4]=-1
i=3, num=4: pop 3 (<=4), stack=[], push 4. stack=[4], result[3]=-1
i=2, num=2: stack=[4], top=4>2. result[2]=4, push 2. stack=[4,2]
i=1, num=1: stack=[4,2], top=2>1. result[1]=2, push 1. stack=[4,2,1]
i=0, num=2: pop 1 (<=2), pop 2 (<=2), stack=[4], top=4>2. result[0]=4

Result: [4, 2, 4, -1, -1]  ✓
\`\`\`

## Java Version

\`\`\`java
public int[] nextGreater(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = n - 1; i >= 0; i--) {
        while (!stack.isEmpty() && stack.peek() <= nums[i]) {
            stack.pop();
        }
        if (!stack.isEmpty()) {
            result[i] = stack.peek();
        }
        stack.push(nums[i]);
    }
    return result;
}
\`\`\`

<!-- voice:section_check concept="each element is pushed and popped at most once" -->

## Variations

| Problem | Stack Type | Direction |
|---------|-----------|-----------|
| Next greater element | Decreasing | Right to left |
| Next smaller element | Increasing | Right to left |
| Previous greater element | Decreasing | Left to right |
| Daily temperatures | Decreasing (indices) | Left to right |

## Try It Yourself

Implement next_greater_element and a daily temperatures variant.
`,
      starterCode: `def next_greater_element(nums):
    """
    For each element, find the next greater element to its right.
    If none exists, use -1.

    Args:
        nums: List of integers

    Returns:
        List of next greater elements

    Example:
        >>> next_greater_element([2, 1, 2, 4, 3])
        [4, 2, 4, -1, -1]

    Must be O(n) — use a monotonic stack.
    """
    # TODO: Process right to left
    # Maintain a decreasing stack
    # Pop elements <= current, peek for the answer, push current
    pass


def daily_temperatures(temperatures):
    """
    Given daily temperatures, find how many days you have to wait
    for a warmer day. If no warmer day, use 0.

    Args:
        temperatures: List of daily temperatures

    Returns:
        List of days to wait

    Example:
        >>> daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73])
        [1, 1, 4, 2, 1, 1, 0, 0]
    """
    # TODO: Use a stack of INDICES (not values)
    # Process left to right; when you find a warmer day, pop and record the difference
    pass


# ─── Test Cases ───
# Do not modify below this line

print(next_greater_element([2, 1, 2, 4, 3]))
# Expected: [4, 2, 4, -1, -1]

print(next_greater_element([5, 4, 3, 2, 1]))
# Expected: [-1, -1, -1, -1, -1]

print(next_greater_element([1, 2, 3, 4, 5]))
# Expected: [2, 3, 4, 5, -1]

print(daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]))
# Expected: [1, 1, 4, 2, 1, 1, 0, 0]

print(daily_temperatures([30, 30, 30]))
# Expected: [0, 0, 0]

print(daily_temperatures([30, 20, 10]))
# Expected: [0, 0, 0]
`,
      solutionCode: `def next_greater_element(nums):
    """
    For each element, find the next greater element to its right.

    Time Complexity: O(n) — each element pushed and popped at most once
    Space Complexity: O(n) — stack and result array
    """
    n = len(nums)
    result = [-1] * n
    stack = []

    for i in range(n - 1, -1, -1):
        while stack and stack[-1] <= nums[i]:
            stack.pop()
        if stack:
            result[i] = stack[-1]
        stack.append(nums[i])

    return result


def daily_temperatures(temperatures):
    """
    Find how many days until a warmer temperature.

    Time Complexity: O(n) — each index pushed and popped at most once
    Space Complexity: O(n) — stack of indices
    """
    n = len(temperatures)
    result = [0] * n
    stack = []  # Stack of indices

    for i in range(n):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_idx = stack.pop()
            result[prev_idx] = i - prev_idx
        stack.append(i)

    return result


# ─── Test Cases ───
# Do not modify below this line

print(next_greater_element([2, 1, 2, 4, 3]))
# Expected: [4, 2, 4, -1, -1]

print(next_greater_element([5, 4, 3, 2, 1]))
# Expected: [-1, -1, -1, -1, -1]

print(next_greater_element([1, 2, 3, 4, 5]))
# Expected: [2, 3, 4, 5, -1]

print(daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]))
# Expected: [1, 1, 4, 2, 1, 1, 0, 0]

print(daily_temperatures([30, 30, 30]))
# Expected: [0, 0, 0]

print(daily_temperatures([30, 20, 10]))
# Expected: [0, 0, 0]
`,
    },

    // ─── Lesson 4: Module Checkpoint ───
    {
      id: "stacks-queues-checkpoint",
      slug: "stacks-queues-checkpoint",
      title: "Module Checkpoint: Stacks & Queues",
      content: `## Fantastic Work!

You've completed the Stacks & Queues module. These two data structures are the building blocks for DFS (stacks) and BFS (queues) — the two fundamental graph traversal algorithms you'll learn next.

<!-- voice:section_check concept="module recap" -->
## What You've Mastered

1. **Stacks (LIFO)** — push/pop from top, bracket matching, undo operations
2. **Queues (FIFO)** — enqueue/dequeue, deque for O(1) operations, BFS foundation
3. **Monotonic Stack** — O(n) next-greater-element pattern

## Quick Quiz

**Question 1:** Which data structure would you use to implement an "Undo" feature?

A) Queue
B) Stack
C) Array
D) Set

**Question 2:** Why should you use \`collections.deque\` instead of a list for a queue in Python?

A) deque uses less memory
B) deque.popleft() is O(1), list.pop(0) is O(n)
C) deque supports more operations
D) Lists cannot be used as queues at all

**Question 3:** In a monotonic decreasing stack, what happens when you encounter an element larger than the stack's top?

A) Push it and continue
B) Pop elements until the stack top is larger, then push
C) Ignore the element
D) Clear the entire stack

**Question 4:** Given the string \`"([{]}"\`, trace through the valid parentheses algorithm step by step. At which character does it detect the mismatch?

**Question 5:** A monotonic stack processes n elements. What is the total number of push and pop operations across the entire algorithm?

A) O(n^2) — each element may cause many pops
B) O(n) — each element is pushed and popped at most once
C) O(n log n) — similar to sorting
D) It depends on the input

## Voice Summary

Explain to your voice coach: when would you use a stack vs a queue? Give one real-world example and one algorithm example for each.
`,
    },
  ],
};
