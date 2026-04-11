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

\`\`\`concept
{"title": "What is a Stack?", "variant": "mental-model", "content": "A stack is a Last-In-First-Out (LIFO) data structure. Picture a cafeteria plate dispenser: the last plate you push down becomes the first one the next person grabs. Operations happen only at the top—no cutting in line."}
\`\`\`

### Core Operations

| Operation | Description | Time |
|-----------|-------------|------|
| \`push(val)\` | Add to top | O(1) |
| \`pop()\` | Remove from top | O(1) |
| \`peek()\` | View top element | O(1) |
| \`is_empty()\` | Check if empty | O(1) |

\`\`\`tabs
{"tabs": [
{"label": "Array-based", "content": "\`\`\`python\\nclass ArrayStack:\\n    def __init__(self, capacity=100):\\n        self._data = [None] * capacity\\n        self._top = -1\\n    \\n    def push(self, val):\\n        if self._top == len(self._data) - 1:\\n            raise OverflowError('Stack full')\\n        self._top += 1\\n        self._data[self._top] = val\\n    \\n    def pop(self):\\n        if self.is_empty():\\n            raise IndexError('Stack empty')\\n        val = self._data[self._top]\\n        self._top -= 1\\n        return val\\n    \\n    def peek(self):\\n        if self.is_empty():\\n            raise IndexError('Stack empty')\\n        return self._data[self._top]\\n    \\n    def is_empty(self):\\n        return self._top == -1\\n\`\`\`"},
{"label": "Linked-list-based", "content": "\`\`\`python\\nclass Node:\\n    def __init__(self, val, nxt=None):\\n        self.val = val\\n        self.next = nxt\\n\\nclass LinkedStack:\\n    def __init__(self):\\n        self._top = None\\n    \\n    def push(self, val):\\n        self._top = Node(val, self._top)\\n    \\n    def pop(self):\\n        if self.is_empty():\\n            raise IndexError('Stack empty')\\n        val = self._top.val\\n        self._top = self._top.next\\n        return val\\n    \\n    def peek(self):\\n        if self.is_empty():\\n            raise IndexError('Stack empty')\\n        return self._top.val\\n    \\n    def is_empty(self):\\n        return self._top is None\\n\`\`\`"}
]}
\`\`\`

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

### Problem: Balanced Brackets

Implement a stack and use it to check if a string of brackets is balanced.

\`\`\`
is_balanced("({[]})") -> True
is_balanced("([)]")   -> False
is_balanced("")        -> True
\`\`\`

\`\`\`playground
{"title": "Balanced Brackets Checker", "language": "python", "runnable": true, "code": "def is_balanced(s: str) -> bool:\\n    stack = []\\n    pairs = {'(': ')', '[': ']', '{': '}'}\\n    \\n    for ch in s:\\n        if ch in pairs:          # opening bracket\\n            stack.append(ch)\\n        elif ch in pairs.values():  # closing bracket\\n            if not stack or pairs[stack.pop()] != ch:\\n                return False\\n    return not stack\\n\\n# Test cases\\nprint(is_balanced(\\"({[]})\\"))  # True\\nprint(is_balanced(\\"([)]\\"))    # False\\nprint(is_balanced(\\"\\"))        # True\\nprint(is_balanced(\\"((\\"))      # False"}
\`\`\`

\`\`\`trace
{"title": "Tracing is_balanced('({[]})')", "language": "python", "code": "def is_balanced(s: str) -> bool:\\n    stack = []\\n    pairs = {'(': ')', '[': ']', '{': '}'}\\n    \\n    for ch in s:\\n        if ch in pairs:          # opening bracket\\n            stack.append(ch)\\n        elif ch in pairs.values():  # closing bracket\\n            if not stack or pairs[stack.pop()] != ch:\\n                return False\\n    return not stack\\n\\nis_balanced('({[]})')", "frames": [
{"line": 1, "vars": {"s": "({[]})", "stack": [], "pairs": {"(": ")", "[": "]", "{": "}"}}, "note": "Start with empty stack"},
{"line": 5, "vars": {"ch": "(", "stack": []}, "note": "Push opening parenthesis"},
{"line": 6, "vars": {"stack": ["("]}, "note": "Stack now contains '('"},
{"line": 5, "vars": {"ch": "{", "stack": ["("]}, "note": "Push opening brace"},
{"line": 6, "vars": {"stack": ["(", "{"]}, "note": "Stack now contains '(', '{'"},
{"line": 5, "vars": {"ch": "[", "stack": ["(", "{"]}, "note": "Push opening bracket"},
{"line": 6, "vars": {"stack": ["(", "{", "["]}, "note": "Stack now contains '(', '{', '['"},
{"line": 5, "vars": {"ch": "]", "stack": ["(", "{", "["]}, "note": "Closing bracket matches top '['"},
{"line": 9, "vars": {"stack": ["(", "{"]}, "note": "Pop '[' and verify match"},
{"line": 5, "vars": {"ch": "}", "stack": ["(", "{"]}, "note": "Closing brace matches top '{'"},
{"line": 9, "vars": {"stack": ["("]}, "note": "Pop '{' and verify match"},
{"line": 5, "vars": {"ch": ")", "stack": ["("]}, "note": "Closing parenthesis matches top '('"},
{"line": 9, "vars": {"stack": []}, "note": "Pop '(' and verify match"},
{"line": 11, "vars": {"stack": []}, "note": "Stack empty → balanced"}
], "speed": 800}
\`\`\`

\`\`\`quiz
{"title": "Stack Operations Check", "questions": [
{"question": "What is the time complexity of a standard stack push operation?", "options": ["O(n)", "O(1)", "O(log n)", "O(n²)"], "answer": 1, "explanation": "push only touches the top pointer, a constant-time action."},
{"question": "Which sequence of operations empties a stack that initially contains [1, 2, 3] (top at right)?", "options": ["pop, pop, pop", "push(4), pop, pop", "peek, pop, pop", "pop, push(4), pop"], "answer": 0, "explanation": "Three pops remove 3, 2, 1, leaving the stack empty."},
{"question": "Why is a linked-list stack immune to overflow?", "options": ["It resizes automatically", "It uses less memory", "It has no fixed capacity", "It is slower"], "answer": 2, "explanation": "Nodes are allocated on demand, so the structure grows until memory is exhausted rather than hitting a preset limit."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Stacks enforce LIFO order: last element pushed is first popped.", "All primary operations—push, pop, peek—run in O(1) time.", "Array-backed stacks are fast but risk overflow; linked-list versions grow dynamically at the cost of extra pointer memory.", "Balanced-brackets is the canonical interview problem showcasing stack usage."]}
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

\`\`\`concept
{
  "title": "FIFO Mental Model",
  "variant": "mental-model",
  "content": "Imagine a conveyor belt at an airport check-in:\\n- Luggage is placed at the back (enqueue)\\n- Luggage is removed from the front (dequeue)\\n- The order is preserved — your bag can't jump ahead of bags that arrived earlier\\n- This strict ordering is what makes queues predictable and reliable"
}
\`\`\`

### Core Operations

| Operation | Description | Time |
|-----------|-------------|------|
| \`enqueue(val)\` | Add to back | O(1) |
| \`dequeue()\` | Remove from front | O(1)* |
| \`peek()\` | View front element | O(1) |
| \`is_empty()\` | Check if empty | O(1) |

*O(1) amortized with a circular buffer or linked list implementation.

\`\`\`callout
{
  "type": "info",
  "title": "Amortized O(1) Explained",
  "content": "While most operations are constant time, some array-based implementations may occasionally need to resize or shift elements. These rare O(n) operations are spread out (amortized) over many O(1) operations, giving us an average of O(1) time per operation."
}
\`\`\`

### Implementation Trade-offs

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Linked List",
      "content": "**Pros:**\\n- True O(1) enqueue/dequeue\\n- Dynamic sizing\\n- No wasted space\\n\\n**Cons:**\\n- Extra memory for pointers\\n- Cache performance penalty\\n\\n\`\`\`python\\nclass Node:\\n    def __init__(self, val):\\n        self.val = val\\n        self.next = None\\n\\nclass Queue:\\n    def __init__(self):\\n        self.head = None\\n        self.tail = None\\n    \\n    def enqueue(self, val):\\n        node = Node(val)\\n        if self.tail:\\n            self.tail.next = node\\n        self.tail = node\\n        if not self.head:\\n            self.head = node\\n    \\n    def dequeue(self):\\n        if not self.head:\\n            return None\\n        val = self.head.val\\n        self.head = self.head.next\\n        if not self.head:\\n            self.tail = None\\n        return val\\n\`\`\`"
    },
    {
      "label": "Circular Array",
      "content": "**Pros:**\\n- Cache-friendly\\n- No pointer overhead\\n- Predictable memory\\n\\n**Cons:**\\n- Fixed capacity\\n- Slightly complex index math\\n\\n\`\`\`python\\nclass CircularQueue:\\n    def __init__(self, capacity):\\n        self.data = [None] * capacity\\n        self.front = 0\\n        self.rear = 0\\n        self.size = 0\\n        self.capacity = capacity\\n    \\n    def enqueue(self, val):\\n        if self.size == self.capacity:\\n            raise OverflowError(\\"Queue full\\")\\n        self.data[self.rear] = val\\n        self.rear = (self.rear + 1) % self.capacity\\n        self.size += 1\\n    \\n    def dequeue(self):\\n        if self.size == 0:\\n            return None\\n        val = self.data[self.front]\\n        self.front = (self.front + 1) % self.capacity\\n        self.size -= 1\\n        return val\\n\`\`\`"
    }
  ]
}
\`\`\`

### Types of Queues

- **Simple Queue** — FIFO
- **Circular Queue** — Wraps around to reuse space
- **Priority Queue** — Elements dequeued by priority, not arrival order
- **Deque** — Double-ended, allows insert/remove at both ends

### Classic Problem: Queue Using Two Stacks

This is a favorite interview question that tests your understanding of both data structures.

\`\`\`steps
{
  "title": "Two-Stack Queue Strategy",
  "steps": [
    {
      "title": "The Insight",
      "content": "Use two stacks as pipes:\\n- **Inbox**: Where we push new elements (enqueue)\\n- **Outbox**: Where we pop elements (dequeue)\\n\\nWhen outbox is empty, pour everything from inbox to outbox — this reverses the order exactly once, giving us FIFO behavior."
    },
    {
      "title": "Enqueue Operation",
      "content": "Simply push onto the inbox stack.\\n\\n\`\`\`python\\ndef enqueue(self, val):\\n    self.inbox.append(val)\\n\`\`\`\\n\\nTime: O(1)"
    },
    {
      "title": "Dequeue Operation",
      "content": "If outbox is empty, pop everything from inbox and push to outbox. Then pop from outbox.\\n\\n\`\`\`python\\ndef dequeue(self):\\n    if not self.outbox:\\n        while self.inbox:\\n            self.outbox.append(self.inbox.pop())\\n    return self.outbox.pop() if self.outbox else None\\n\`\`\`\\n\\nTime: O(n) worst case, but O(1) amortized"
    }
  ]
}
\`\`\`

\`\`\`algoviz
{
  "title": "Two-Stack Queue in Action",
  "type": "array",
  "data": [1, 2, 3],
  "frames": [
    { "highlight": [], "label": "Initial state: inbox=[1,2,3], outbox=[]", "stats": {"inbox_size": 3, "outbox_size": 0} },
    { "highlight": [0], "label": "dequeue(): Transfer inbox to outbox", "stats": {"inbox_size": 0, "outbox_size": 3} },
    { "highlight": [2], "label": "Pop from outbox: returns 1 (FIFO order!)", "stats": {"result": 1, "outbox_size": 2} },
    { "highlight": [], "label": "enqueue(4): Push to inbox", "stats": {"inbox": [4], "outbox_size": 2} },
    { "highlight": [1], "label": "dequeue(): Pop from outbox: returns 2", "stats": {"result": 2, "outbox_size": 1} }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`playground
{
  "title": "Implement Queue with Two Stacks",
  "language": "python",
  "code": "class QueueWithStacks:\\n    def __init__(self):\\n        self.inbox = []\\n        self.outbox = []\\n    \\n    def enqueue(self, val):\\n        # TODO: Implement enqueue\\n        pass\\n    \\n    def dequeue(self):\\n        # TODO: Implement dequeue\\n        pass\\n    \\n    def peek(self):\\n        # TODO: Implement peek\\n        pass\\n    \\n    def is_empty(self):\\n        # TODO: Implement is_empty\\n        pass\\n\\n# Test your implementation\\nq = QueueWithStacks()\\nq.enqueue(1)\\nq.enqueue(2)\\nq.enqueue(3)\\nprint(q.dequeue())  # Expected: 1\\nprint(q.dequeue())  # Expected: 2\\nq.enqueue(4)\\nprint(q.dequeue())  # Expected: 3\\nprint(q.dequeue())  # Expected: 4",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Queue Fundamentals",
  "questions": [
    {
      "question": "What is the time complexity of enqueue and dequeue operations in an efficient queue implementation?",
      "options": ["O(n) for both", "O(1) for both", "O(1) enqueue, O(n) dequeue", "O(n) enqueue, O(1) dequeue"],
      "answer": 1,
      "explanation": "Both enqueue and dequeue are O(1) in efficient implementations using linked lists or circular arrays."
    },
    {
      "question": "In a circular queue with capacity 5, if front=2 and rear=4, what are the indices after enqueue(42)?",
      "options": ["front=2, rear=0", "front=2, rear=5", "front=3, rear=4", "front=2, rear=0"],
      "answer": 0,
      "explanation": "After inserting at index 4, rear moves to (4+1) % 5 = 0 due to the circular wrap-around."
    },
    {
      "question": "Why does the two-stack queue implementation work correctly?",
      "options": ["Stacks are faster than queues", "Two reversals cancel out, preserving FIFO order", "It uses more memory", "It reduces time complexity"],
      "answer": 1,
      "explanation": "Transferring from inbox to outbox reverses the order once. Combined with the natural LIFO of stacks, this gives us FIFO behavior."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Queues enforce FIFO ordering — first in, first out",
    "Core operations (enqueue, dequeue, peek) are O(1) in efficient implementations",
    "Linked lists offer dynamic sizing; circular arrays provide cache efficiency",
    "Two stacks can implement a queue because double reversal preserves order",
    "Circular queues reuse space by wrapping indices around"
  ]
}
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

\`\`\`concept
{"title": "Min Stack", "variant": "mental-model", "content": "A Min Stack is a regular stack that carries a \\"mirror\\" of itself: a second stack that only remembers the current minimum. Every push updates the mirror if the new value is smaller; every pop removes from the mirror when the outgoing value equals the current minimum. The result: every operation—push, pop, top, getMin—runs in O(1) time."}
\`\`\`

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

\`\`\`steps
{"title": "Two-Stack Implementation", "steps": [
  {"title": "1. Data members", "content": "Keep two lists:\\n- \`main\`: holds every pushed value\\n- \`min\`: holds the minimum *at that depth*"},
  {"title": "2. Push logic", "content": "Append \`x\` to \`main\`.<br>If \`min\` is empty **or** \`x ≤ min[-1]\`, also append \`x\` to \`min\`."},
  {"title": "3. Pop logic", "content": "Pop from \`main\`.<br>If the popped value equals \`min[-1]\`, pop from \`min\` as well."},
  {"title": "4. Queries", "content": "- \`top()\` → \`main[-1]\`<br>- \`getMin()\` → \`min[-1]\`<br>Both O(1)."}
]}
\`\`\`

\`\`\`playground
{"title": "MinStack in Python", "language": "python", "code": "class MinStack:\\n    def __init__(self):\\n        self.main = []\\n        self.min = []\\n\\n    def push(self, x):\\n        self.main.append(x)\\n        if not self.min or x <= self.min[-1]:\\n            self.min.append(x)\\n\\n    def pop(self):\\n        val = self.main.pop()\\n        if val == self.min[-1]:\\n            self.min.pop()\\n\\n    def top(self):\\n        return self.main[-1]\\n\\n    def getMin(self):\\n        return self.min[-1]\\n\\n# Demo\\nms = MinStack()\\nfor v in [3, 5, 1]:\\n    ms.push(v)\\n    print(\\"push\\", v, \\"min =\\", ms.getMin())\\nms.pop()\\nprint(\\"after pop, min =\\", ms.getMin())", "runnable": true}
\`\`\`

\`\`\`quiz
{"title": "Check your Min-Stack knowledge", "questions": [
  {"question": "After pushing 4, 2, 6, 2, 1 in order, what does the min-stack contain (top on right)?", "options": ["[4,2,1]", "[4,2,2,1]", "[1]", "[4,2,1,1]"], "answer": 1, "explanation": "We push to min only when the value ≤ current minimum: 4 (push), 2 (push), 6 (skip), 2 (push), 1 (push) → min-stack = [4,2,2,1]."},
  {"question": "What is the space complexity of the two-stack MinStack?", "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"], "answer": 2, "explanation": "In the worst case (monotonically decreasing input) every element is duplicated in the min stack, so total space is O(n)."},
  {"question": "Which operation below could break O(1) time if implemented naïvely?", "options": ["push", "pop", "getMin", "All stay O(1)"], "answer": 3, "explanation": "With the two-stack technique all four operations remain O(1); no scanning is ever required."}
]}
\`\`\`

### Problem 2: Sliding Window Maximum

Given an array and window size \`k\`, return the maximum value in each window as it slides from left to right.  
Target: **O(n)** total time.

\`\`\`
sliding_max([1, 3, -1, -3, 5, 3, 6, 7], 3) ➞ [3, 3, 5, 5, 6, 7]
\`\`\`

\`\`\`concept
{"title": "Monotonic Deque", "variant": "insight", "content": "A deque (double-ended queue) can be kept in **strictly decreasing order** of values. Indices whose elements are too small and fall out of the current window are discarded from the ends. The front always holds the window’s maximum, giving O(1) access. Each index is pushed and popped at most once → overall O(n)."}
\`\`\`

\`\`\`algoviz
{"title": "Deque in action (k = 3)", "type": "array", "data": [1, 3, -1, -3, 5, 3, 6, 7], "frames": [
  {"highlight": [0], "label": "i=0 push 1", "stats": {"deque": "[0]", "out": "[]"}},
  {"highlight": [0, 1], "label": "i=1 pop 0 (1<3), push 1", "stats": {"deque": "[1]", "out": "[]"}},
  {"highlight": [1, 2], "label": "i=2 push 2 (-1<3), output 3", "stats": {"deque": "[1,2]", "out": "[3]"}},
  {"highlight": [2, 3], "label": "i=3 evict 1 (out of window), push 3", "stats": {"deque": "[1,2,3]", "out": "[3]"}},
  {"highlight": [3], "label": "i=4 pop 1,2,3 (all <5), push 4", "stats": {"deque": "[4]", "out": "[3,3,5]"}}
], "speed": 1000}
\`\`\`

\`\`\`compare
{"variant": "before-after", "before": {"label": "Naïve O(n·k)", "code": "def sliding_max_brute(arr, k):\\n    n = len(arr)\\n    out = []\\n    for i in range(n - k + 1):\\n        out.append(max(arr[i:i+k]))\\n    return out"}, "after": {"label": "Monotonic deque O(n)", "code": "from collections import deque\\ndef sliding_max(arr, k):\\n    q = deque()\\n    out = []\\n    for i, x in enumerate(arr):\\n        while q and arr[q[-1]] <= x:\\n            q.pop()          # remove losers\\n        q.append(i)\\n        if q[0] == i - k:      # out of window\\n            q.popleft()\\n        if i >= k - 1:\\n            out.append(arr[q[0]])\\n    return out"}}
\`\`\`

\`\`\`playground
{"title": "Try it live", "language": "python", "code": "from collections import deque\\n\\ndef sliding_max(arr, k):\\n    q = deque()\\n    out = []\\n    for i, x in enumerate(arr):\\n        while q and arr[q[-1]] <= x:\\n            q.pop()\\n        q.append(i)\\n        if q[0] == i - k:\\n            q.popleft()\\n        if i >= k - 1:\\n            out.append(arr[q[0]])\\n    return out\\n\\nprint(sliding_max([1, 3, -1, -3, 5, 3, 6, 7], 3))\\nprint(sliding_max([9, 8, 7, 6, 5], 2))", "runnable": true}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Min Stack adds O(1) minimum queries by keeping a parallel stack of minimums.",
  "Monotonic structures (stack/deque) discard obsolete entries early, guaranteeing amortized O(1) work per element.",
  "Sliding-window maximum is the canonical use-case for a monotonic deque; each index enters and exits the deque once, yielding O(n) total time."
]}
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
