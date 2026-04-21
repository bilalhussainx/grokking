import { Module } from "../types";

export const stacksQueuesModule: Module = {
  id: "stacks-queues",
  title: "Stacks & Queues",
  description: "Understand stack and queue data structures, implement them from scratch, and solve classic problems using these fundamental tools.",
  lessons: [
    {
      id: "stacks-queues-stack",
      slug: "stack-implementation",
      title: "Stack Implementation",
      content: `## Stack

A **stack** is a Last-In-First-Out (LIFO) data structure. Think of a stack of plates: you can only add or remove from the top.

### Operations

| Operation | Description | Time |
|-----------|-------------|------|
| \`push(val)\` | Add to top | O(1) |
| \`pop()\` | Remove from top | O(1) |
| \`peek()\` | View top element | O(1) |
| \`is_empty()\` | Check if empty | O(1) |

### Stack vs Queue

\`\`\`mermaid
graph TD
    subgraph "Stack: LIFO"
    S3["top: 3"] --> S2["2"] --> S1["1"]
    P1["push(4)"] -.->|"add to top"| S3
    S3 -.->|"pop() = 3"| P2["remove from top"]
    end
    subgraph "Queue: FIFO"
    Q1["front: 1"] --> Q2["2"] --> Q3["3"]
    E1["enqueue(4)"] -.->|"add to back"| Q3
    Q1 -.->|"dequeue() = 1"| D1["remove from front"]
    end
\`\`\`

### Applications

- Function call stack (recursion)
- Undo/redo operations
- Expression evaluation and parsing
- Backtracking algorithms (DFS)
- Balanced parentheses checking

### Problem

Implement a stack and use it to check if a string of brackets is balanced.

\`\`\`
is_balanced("({[]})") -> True
is_balanced("([)]")   -> False
is_balanced("")        -> True
\`\`\``,
      starterCode: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, val):
        # TODO: Add val to the top
        pass

    def pop(self):
        # TODO: Remove and return top element
        pass

    def peek(self):
        # TODO: Return top element without removing
        pass

    def is_empty(self):
        # TODO: Return True if stack is empty
        pass

    def size(self):
        # TODO: Return number of elements
        pass

def is_balanced(s):
    # TODO: Use a stack to check if brackets are balanced
    # Handle: (), [], {}
    pass

# Test stack
stack = Stack()
stack.push(1)
stack.push(2)
stack.push(3)
print(stack.peek())      # Expected: 3
print(stack.pop())       # Expected: 3
print(stack.size())      # Expected: 2
print(stack.is_empty())  # Expected: False

# Test balanced brackets
print(is_balanced("({[]})"))   # Expected: True
print(is_balanced("([)]"))     # Expected: False
print(is_balanced(""))         # Expected: True
print(is_balanced("((()))"))   # Expected: True
print(is_balanced("("))        # Expected: False
`,
      solutionCode: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, val):
        self.items.append(val)

    def pop(self):
        if self.is_empty():
            return None
        return self.items.pop()

    def peek(self):
        if self.is_empty():
            return None
        return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)

def is_balanced(s):
    stack = Stack()
    matching = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in '([{':
            stack.push(ch)
        elif ch in ')]}':
            if stack.is_empty() or stack.pop() != matching[ch]:
                return False
    return stack.is_empty()

# Test stack
stack = Stack()
stack.push(1)
stack.push(2)
stack.push(3)
print(stack.peek())      # Expected: 3
print(stack.pop())       # Expected: 3
print(stack.size())      # Expected: 2
print(stack.is_empty())  # Expected: False

# Test balanced brackets
print(is_balanced("({[]})"))   # Expected: True
print(is_balanced("([)]"))     # Expected: False
print(is_balanced(""))         # Expected: True
print(is_balanced("((()))"))   # Expected: True
print(is_balanced("("))        # Expected: False
`,
    },
    {
      id: "stacks-queues-queue",
      slug: "queue-implementation",
      title: "Queue Implementation",
      content: `## Queue

A **queue** is a First-In-First-Out (FIFO) data structure. Think of a line at a store: the first person in line is the first served.

### Operations

| Operation | Description | Time |
|-----------|-------------|------|
| \`enqueue(val)\` | Add to back | O(1) |
| \`dequeue()\` | Remove from front | O(1)* |
| \`peek()\` | View front element | O(1) |
| \`is_empty()\` | Check if empty | O(1) |

*O(1) amortized with a circular buffer or linked list implementation.

### Types of Queues

- **Simple Queue** — FIFO
- **Circular Queue** — Wraps around to reuse space
- **Priority Queue** — Elements dequeued by priority, not arrival order
- **Deque** — Double-ended, allows insert/remove at both ends

### Problem

Implement a queue using two stacks. This is a classic interview question.

\`\`\`
q = QueueWithStacks()
q.enqueue(1)
q.enqueue(2)
q.enqueue(3)
q.dequeue()  -> 1
q.dequeue()  -> 2
q.enqueue(4)
q.dequeue()  -> 3
\`\`\``,
      starterCode: `class QueueWithStacks:
    def __init__(self):
        self.stack_in = []
        self.stack_out = []

    def enqueue(self, val):
        # TODO: Add to the back of the queue
        pass

    def dequeue(self):
        # TODO: Remove and return front element
        pass

    def peek(self):
        # TODO: View front element without removing
        pass

    def is_empty(self):
        # TODO: Return True if queue is empty
        pass

# Test cases
q = QueueWithStacks()
q.enqueue(1)
q.enqueue(2)
q.enqueue(3)
print(q.dequeue())   # Expected: 1
print(q.peek())      # Expected: 2
print(q.dequeue())   # Expected: 2
q.enqueue(4)
print(q.dequeue())   # Expected: 3
print(q.dequeue())   # Expected: 4
print(q.is_empty())  # Expected: True
`,
      solutionCode: `class QueueWithStacks:
    def __init__(self):
        self.stack_in = []
        self.stack_out = []

    def enqueue(self, val):
        self.stack_in.append(val)

    def _transfer(self):
        if not self.stack_out:
            while self.stack_in:
                self.stack_out.append(self.stack_in.pop())

    def dequeue(self):
        self._transfer()
        if self.stack_out:
            return self.stack_out.pop()
        return None

    def peek(self):
        self._transfer()
        if self.stack_out:
            return self.stack_out[-1]
        return None

    def is_empty(self):
        return len(self.stack_in) == 0 and len(self.stack_out) == 0

# Test cases
q = QueueWithStacks()
q.enqueue(1)
q.enqueue(2)
q.enqueue(3)
print(q.dequeue())   # Expected: 1
print(q.peek())      # Expected: 2
print(q.dequeue())   # Expected: 2
q.enqueue(4)
print(q.dequeue())   # Expected: 3
print(q.dequeue())   # Expected: 4
print(q.is_empty())  # Expected: True
`,
    },
    {
      id: "stacks-queues-minstack",
      slug: "min-stack",
      title: "Min Stack & Monotonic Queue",
      content: `## Min Stack & Monotonic Queue

### Problem 1: Min Stack

Design a stack that supports \`push\`, \`pop\`, \`peek\`, and retrieving the **minimum element** — all in O(1) time.

\`\`\`
ms = MinStack()
ms.push(3)
ms.push(5)
ms.get_min()  -> 3
ms.push(1)
ms.get_min()  -> 1
ms.pop()
ms.get_min()  -> 3
\`\`\`

**Key Insight**: Maintain a second stack that tracks the minimum at each level.

### Problem 2: Sliding Window Maximum

Given an array and window size k, return the maximum value in each window as it slides from left to right. Use a **monotonic deque** for O(n) total time.

\`\`\`
sliding_max([1, 3, -1, -3, 5, 3, 6, 7], 3) -> [3, 3, 5, 5, 6, 7]
\`\`\``,
      starterCode: `from collections import deque

class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        # TODO: Push val and update min tracking
        pass

    def pop(self):
        # TODO: Pop and update min tracking
        pass

    def peek(self):
        # TODO: Return top element
        pass

    def get_min(self):
        # TODO: Return minimum element in O(1)
        pass

def sliding_window_max(nums, k):
    # TODO: Return list of max values for each window of size k
    # Use a monotonic deque
    pass

# Test MinStack
ms = MinStack()
ms.push(3)
ms.push(5)
print(ms.get_min())  # Expected: 3
ms.push(1)
print(ms.get_min())  # Expected: 1
ms.pop()
print(ms.get_min())  # Expected: 3
print(ms.peek())     # Expected: 5

# Test Sliding Window Maximum
print(sliding_window_max([1, 3, -1, -3, 5, 3, 6, 7], 3))
# Expected: [3, 3, 5, 5, 6, 7]
print(sliding_window_max([1, -1], 1))
# Expected: [1, -1]
print(sliding_window_max([4, 3, 2, 1], 2))
# Expected: [4, 3, 2]
`,
      solutionCode: `from collections import deque

class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)

    def pop(self):
        if self.stack:
            val = self.stack.pop()
            if val == self.min_stack[-1]:
                self.min_stack.pop()
            return val
        return None

    def peek(self):
        return self.stack[-1] if self.stack else None

    def get_min(self):
        return self.min_stack[-1] if self.min_stack else None

def sliding_window_max(nums, k):
    dq = deque()  # stores indices
    result = []
    for i in range(len(nums)):
        # Remove elements outside the window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        # Remove smaller elements from the back
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        dq.append(i)
        # Start recording once we have a full window
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result

# Test MinStack
ms = MinStack()
ms.push(3)
ms.push(5)
print(ms.get_min())  # Expected: 3
ms.push(1)
print(ms.get_min())  # Expected: 1
ms.pop()
print(ms.get_min())  # Expected: 3
print(ms.peek())     # Expected: 5

# Test Sliding Window Maximum
print(sliding_window_max([1, 3, -1, -3, 5, 3, 6, 7], 3))
# Expected: [3, 3, 5, 5, 6, 7]
print(sliding_window_max([1, -1], 1))
# Expected: [1, -1]
print(sliding_window_max([4, 3, 2, 1], 2))
# Expected: [4, 3, 2]
`,
    },
  ],
};
