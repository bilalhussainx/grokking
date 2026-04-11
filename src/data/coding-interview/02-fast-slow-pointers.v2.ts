import { Module } from "../types";

export const fastSlowPointersModule: Module = {
  id: "fast-slow-pointers",
  title: "Fast & Slow Pointers",
  description: "Master Floyd's cycle detection algorithm and the tortoise-and-hare technique for linked lists and number sequences.",
  lessons: [
    {
      id: "fast-slow-intro",
      slug: "fast-slow-pointers-intro",
      title: "Introduction to Fast & Slow Pointers",
      content: `## The Fast & Slow Pointers Pattern

Also known as the **Tortoise and Hare** algorithm (Floyd's cycle detection), this pattern uses two pointers that move at **different speeds** through a sequence.

\`\`\`concept
{
  "title": "Tortoise & Hare Mental Model",
  "variant": "mental-model",
  "content": "Picture two runners on a track:\\n- Tortoise moves 1 step per tick\\n- Hare moves 2 steps per tick\\n\\nIf the track is a straight line, the hare finishes first. If it's a circular track, the hare will eventually lap the tortoise. The moment they meet proves the circle exists."
}
\`\`\`

### Core Idea

- A **slow** pointer moves one step at a time.
- A **fast** pointer moves two steps at a time.
- If there is a **cycle**, the fast pointer will eventually catch up to the slow pointer inside the cycle.
- If there is **no cycle**, the fast pointer will reach the end.

\`\`\`algoviz
{
  "title": "Cycle Detection Walk-through",
  "type": "linkedlist",
  "data": [1, 2, 3, 4, 5],
  "frames": [
    { "highlight": [0], "label": "Both start at head (node 1)", "stats": { "slow": 0, "fast": 0 } },
    { "highlight": [1, 2], "label": "Slow→2, Fast→3 (2 steps)", "stats": { "slow": 1, "fast": 2 } },
    { "highlight": [2, 4], "label": "Slow→3, Fast→5 (2 steps)", "stats": { "slow": 2, "fast": 4 } },
    { "highlight": [3, 1], "label": "Slow→4, Fast wraps to 2", "stats": { "slow": 3, "fast": 1 } },
    { "highlight": [4, 3], "label": "Slow→5, Fast→4 — same node!", "stats": { "slow": 4, "fast": 3 } }
  ],
  "speed": 1000
}
\`\`\`

### Classic Applications

| Use Case | Description |
|----------|-------------|
| **Cycle detection** | Determine whether a linked list or sequence contains a loop. |
| **Cycle length** | Once inside the cycle, count steps until the slow pointer returns to the meeting point. |
| **Cycle start** | Reset one pointer to the head; move both at the same speed — they meet at the cycle start. |
| **Middle element** | When fast reaches the end, slow is at the middle. |
| **Happy number** | Digit-square sequences either reach 1 or loop — treat it as cycle detection. |

\`\`\`quiz
{
  "title": "Check Your Intuition",
  "questions": [
    {
      "question": "If the list length is n and has no cycle, how many total pointer moves occur?",
      "options": ["≈ n", "≈ 1.5 n", "≈ 2 n", "≈ 3 n"],
      "answer": 1,
      "explanation": "Fast moves 2 steps per slow's 1, so when slow has taken n/2 steps, fast has taken n steps and reaches the end. Total ≈ 1.5 n moves."
    },
    {
      "question": "Why can't we simply use a hash-set to detect cycles?",
      "options": ["Hash sets are slower", "Hash sets use O(n) extra space", "Hash sets can't handle loops", "Hash sets are deterministic"],
      "answer": 1,
      "explanation": "A hash-set gives O(n) time but also O(n) space. Fast & slow pointers achieve O(n) time with O(1) space — a key interview win."
    },
    {
      "question": "After the first meeting inside a cycle, how do you find the cycle's start node?",
      "options": ["Move both pointers one step until they meet again", "Reset one pointer to head and move both one step", "Count steps until slow returns to meeting spot", "Move fast twice as fast again"],
      "answer": 1,
      "explanation": "Reset one pointer to the head, then advance both one step at a time. The second meeting point is the cycle start — a mathematical consequence of the cycle length."
    }
  ]
}
\`\`\`

### Complexity

Most fast/slow pointer solutions run in **O(n)** time and **O(1)** space, avoiding the need for hash sets to detect revisited nodes.

\`\`\`playground
{
  "title": "Linked-List Cycle Detector",
  "language": "python",
  "code": "class ListNode:\\n    def __init__(self, val, nxt=None):\\n        self.val = val\\n        self.next = nxt\\n\\ndef has_cycle(head):\\n    slow = fast = head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow is fast:\\n            return True\\n    return False\\n\\n# Build list 1→2→3→4→5→3 (cycle)\\nnodes = [ListNode(i) for i in range(1, 6)]\\nfor i in range(4):\\n    nodes[i].next = nodes[i+1]\\nnodes[4].next = nodes[2]  # create cycle\\n\\nprint(has_cycle(nodes[0]))  # True",
  "runnable": true
}
\`\`\`

### Note on Implementation

Since we are running Python in the browser (Pyodide), we will simulate linked lists using arrays or simple \`ListNode\` classes defined inline. The algorithmic logic is identical.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Two pointers at speeds 1× and 2× detect cycles in O(n) time and O(1) space.",
    "If fast pointer hits null, no cycle exists; if pointers meet, a cycle is proven.",
    "The same pattern extends to finding cycle start, cycle length, middle element, and happy-number problems.",
    "Avoid hash-set solutions in interviews when O(1) space is possible — fast & slow is the expected answer."
  ]
}
\`\`\``,
    },
    {
      id: "fast-slow-linked-list-cycle",
      slug: "linked-list-cycle",
      title: "Linked List Cycle",
      content: `## Linked List Cycle Detection

### Problem Statement

Given the head of a singly linked list, determine whether the list contains a **cycle**. A cycle exists if some node's \`next\` pointer points back to a previously visited node.

We represent the linked list with a \`ListNode\` class and build it from an array plus a \`cycle_pos\` parameter indicating which index the tail connects back to (\`-1\` means no cycle).

### Examples

\`\`\`
Input:  nodes = [1, 2, 3, 4, 5, 6], cycle_pos = 2
Output: True
Explanation: Node 6 points back to node at index 2 (value 3), forming a cycle.
\`\`\`

\`\`\`
Input:  nodes = [2, 4, 6, 8], cycle_pos = -1
Output: False
Explanation: The list ends normally with no cycle.
\`\`\`

\`\`\`
Input:  nodes = [1, 2], cycle_pos = 0
Output: True
Explanation: Node 2 points back to head (index 0).
\`\`\`

### Floyd's Tortoise and Hare Algorithm

The key insight is simple: if there's a cycle, a fast runner (hare) will eventually lap a slow runner (tortoise). If there's no cycle, the hare will reach the end first.

\`\`\`concept
{
  "title": "Why Two Pointers Work",
  "variant": "mental-model",
  "content": "Imagine a circular track. If one runner moves twice as fast as another, they'll meet at the same spot after some laps. In a linked list, this same principle applies: if a cycle exists, the fast pointer (moving 2 steps) will eventually catch up to the slow pointer (moving 1 step). The meeting point proves the cycle exists."
}
\`\`\`

### Algorithm Walkthrough

\`\`\`steps
{
  "title": "Detecting a Cycle Step-by-Step",
  "steps": [
    {
      "title": "Initialize Pointers",
      "content": "Start both \`slow\` and \`fast\` pointers at the head of the linked list."
    },
    {
      "title": "Move Pointers",
      "content": "Move \`slow\` one step forward (\`slow = slow.next\`) and \`fast\` two steps forward (\`fast = fast.next.next\`)."
    },
    {
      "title": "Check for Meeting",
      "content": "If \`slow == fast\` at any point, a cycle exists. Return \`True\`."
    },
    {
      "title": "Check for End",
      "content": "If \`fast\` or \`fast.next\` becomes \`None\`, we've reached the end. Return \`False\`."
    }
  ]
}
\`\`\`

### Visual Execution

Let's trace through a concrete example with nodes \`[1, 2, 3, 4, 5]\` where node 5 connects back to node 3:

\`\`\`algoviz
{
  "title": "Cycle Detection in Action",
  "type": "linkedlist",
  "data": [
    {"value": 1, "next": 1},
    {"value": 2, "next": 2},
    {"value": 3, "next": 3},
    {"value": 4, "next": 4},
    {"value": 5, "next": 2}
  ],
  "frames": [
    {"highlight": [0, 0], "label": "Initial: slow=1, fast=1", "stats": {"slow": 1, "fast": 1}},
    {"highlight": [1, 2], "label": "Step 1: slow→2, fast→3", "stats": {"slow": 2, "fast": 3}},
    {"highlight": [2, 4], "label": "Step 2: slow→3, fast→5", "stats": {"slow": 3, "fast": 5}},
    {"highlight": [3, 2], "label": "Step 3: slow→4, fast→3", "stats": {"slow": 4, "fast": 3}},
    {"highlight": [4, 4], "label": "Step 4: slow→5, fast→5", "stats": {"slow": 5, "fast": 5}},
    {"highlight": [4, 4], "label": "CYCLE DETECTED! Both pointers meet at node 5", "stats": {"result": "True"}}
  ],
  "speed": 1000
}
\`\`\`

### Implementation

\`\`\`playground
{
  "title": "Linked List Cycle Detection",
  "language": "python",
  "code": "class ListNode:\\n    def __init__(self, val=0, next=None):\\n        self.val = val\\n        self.next = next\\n\\ndef has_cycle(head):\\n    if not head or not head.next:\\n        return False\\n    \\n    slow = fast = head\\n    \\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        \\n        if slow == fast:\\n            return True\\n    \\n    return False\\n\\n# Test the implementation\\n# Creating cycle: 1 -> 2 -> 3 -> 4 -> 5 -> 3 (cycle)\\nnode1 = ListNode(1)\\nnode2 = ListNode(2)\\nnode3 = ListNode(3)\\nnode4 = ListNode(4)\\nnode5 = ListNode(5)\\n\\nnode1.next = node2\\nnode2.next = node3\\nnode3.next = node4\\nnode4.next = node5\\nnode5.next = node3  # Creates cycle\\n\\nprint(f\\"Has cycle: {has_cycle(node1)}\\")\\n\\n# Creating no cycle: 1 -> 2 -> 3 -> None\\nnode_a = ListNode(1)\\nnode_b = ListNode(2)\\nnode_c = ListNode(3)\\n\\nnode_a.next = node_b\\nnode_b.next = node_c\\n\\nprint(f\\"Has cycle: {has_cycle(node_a)}\\")",
  "runnable": true
}
\`\`\`

### Test Your Understanding

\`\`\`quiz
{
  "title": "Cycle Detection Concepts",
  "questions": [
    {
      "question": "Why do we check both \`fast\` and \`fast.next\` in the while loop condition?",
      "options": ["To ensure we don't get a null pointer exception", "To make the algorithm faster", "To handle empty lists", "To detect the cycle start"],
      "answer": 0,
      "explanation": "We check both because \`fast.next.next\` would throw an error if \`fast.next\` is null. This prevents accessing a null pointer when there's no cycle."
    },
    {
      "question": "What happens if the fast pointer moves 3 steps instead of 2?",
      "options": ["The algorithm becomes O(log n)", "It might miss the cycle", "It will still work but may be less efficient", "Nothing changes"],
      "answer": 2,
      "explanation": "Moving 3 steps can still detect cycles, but the meeting point and number of iterations may differ. The 2-step approach is optimal and guaranteed to work."
    },
    {
      "question": "What's the maximum number of iterations needed to detect a cycle?",
      "options": ["O(n)", "O(n²)", "O(log n)", "O(√n)"],
      "answer": 0,
      "explanation": "In the worst case, the algorithm needs O(n) iterations. If there's a cycle, the pointers will meet within the cycle length. If no cycle, the fast pointer reaches the end in O(n) steps."
    }
  ]
}
\`\`\`

### Complexity Analysis

- **Time:** O(n) - We visit each node at most twice (once by slow, once by fast)
- **Space:** O(1) - We only use two pointers regardless of input size

\`\`\`callout
{
  "type": "tip",
  "title": "Space Efficiency",
  "content": "Unlike the hash set approach which requires O(n) space, Floyd's algorithm achieves O(1) space complexity. This makes it ideal for memory-constrained environments or when dealing with very large linked lists."
}
\`\`\`

### Beyond Detection: Finding the Cycle Start

Once we detect a cycle, we can find where it begins using a clever extension:

\`\`\`collapse
{
  "title": "Deep Dive: Finding the Cycle Start",
  "content": "After slow and fast meet, reset one pointer to the head and move both one step at a time. They'll meet at the cycle start. Here's why: if the cycle starts k nodes from the head, and the meeting point is m nodes into the cycle, then both pointers will need exactly (k-m) steps to reach the cycle start from their current positions."
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Floyd's algorithm uses two pointers moving at different speeds to detect cycles",
    "Time complexity is O(n) and space complexity is O(1)",
    "The algorithm works because in a cycle, the fast pointer will eventually catch up to the slow pointer",
    "Always check for null pointers when advancing the fast pointer",
    "This technique extends beyond linked lists to any sequence of iterated function values"
  ]
}
\`\`\``,
      starterCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def build_list(values, cycle_pos):
    if not values:
        return None
    head = ListNode(values[0])
    current = head
    nodes = [head]
    for v in values[1:]:
        node = ListNode(v)
        current.next = node
        current = node
        nodes.append(node)
    if cycle_pos >= 0:
        current.next = nodes[cycle_pos]
    return head

def has_cycle(head):
    # TODO: implement using fast & slow pointers
    pass

# Test cases
print(has_cycle(build_list([1, 2, 3, 4, 5, 6], 2)))  # Expected: True
print(has_cycle(build_list([2, 4, 6, 8], -1)))        # Expected: False
print(has_cycle(build_list([1, 2], 0)))                # Expected: True
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def build_list(values, cycle_pos):
    if not values:
        return None
    head = ListNode(values[0])
    current = head
    nodes = [head]
    for v in values[1:]:
        node = ListNode(v)
        current.next = node
        current = node
        nodes.append(node)
    if cycle_pos >= 0:
        current.next = nodes[cycle_pos]
    return head

def has_cycle(head):
    slow, fast = head, head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False

# Test cases
print(has_cycle(build_list([1, 2, 3, 4, 5, 6], 2)))  # Expected: True
print(has_cycle(build_list([2, 4, 6, 8], -1)))        # Expected: False
print(has_cycle(build_list([1, 2], 0)))                # Expected: True
`,
    },
    {
      id: "fast-slow-cycle-length",
      slug: "find-cycle-length",
      title: "Find Cycle Length",
      content: `## Find the Cycle Length

### Problem Statement

Given the head of a linked list that **contains a cycle**, find the **length** of the cycle (the number of nodes in the loop).

### Examples

\`\`\`
Input:  nodes = [1, 2, 3, 4, 5, 6], cycle_pos = 2
Output: 4
Explanation: The cycle is 3 -> 4 -> 5 -> 6 -> 3, which has 4 nodes.
\`\`\`

\`\`\`
Input:  nodes = [1, 2, 3], cycle_pos = 0
Output: 3
Explanation: The cycle is 1 -> 2 -> 3 -> 1, which has 3 nodes.
\`\`\`

\`\`\`
Input:  nodes = [10, 20], cycle_pos = 0
Output: 2
Explanation: 10 -> 20 -> 10 has 2 nodes in the cycle.
\`\`\`

### Approach

\`\`\`concept
{
  "title": "Cycle Length Detection Strategy",
  "variant": "mental-model",
  "content": "Once Floyd's algorithm confirms a cycle exists (pointers meet), finding its length is straightforward: freeze one pointer and march the other around the loop until they reunite. Each step equals one node in the cycle."
}
\`\`\`

\`\`\`steps
{
  "title": "Step-by-step Algorithm",
  "steps": [
    {
      "title": "1. Detect the cycle",
      "content": "Run the classic tortoise-and-hare race: slow moves 1 step, fast 2 steps. When they collide, a cycle exists and both are inside it."
    },
    {
      "title": "2. Freeze one pointer",
      "content": "Leave the slow pointer at the meeting spot; it will serve as our finish line."
    },
    {
      "title": "3. Count the loop",
      "content": "Move the fast pointer one node at a time, incrementing a counter each step. When fast equals slow again, counter equals cycle length."
    }
  ]
}
\`\`\`

\`\`\`algoviz
{
  "title": "Finding Cycle Length in Action",
  "type": "linkedlist",
  "data": [1, 2, 3, 4, 5, 6],
  "frames": [
    { "highlight": [0, 1], "label": "Initial: slow at 1, fast at 2", "stats": { "slow": 1, "fast": 2 } },
    { "highlight": [1, 3], "label": "Step 1: slow→2, fast→4", "stats": { "slow": 2, "fast": 4 } },
    { "highlight": [2, 5], "label": "Step 2: slow→3, fast→6", "stats": { "slow": 3, "fast": 6 } },
    { "highlight": [3, 2], "label": "Step 3: slow→4, fast→3 (cycle wrap)", "stats": { "slow": 4, "fast": 3 } },
    { "highlight": [4, 4], "label": "Step 4: slow→5, fast→5 (meeting)", "stats": { "slow": 5, "fast": 5 } },
    { "highlight": [5, 6], "label": "Freeze slow at 5, move fast→6", "stats": { "count": 1 } },
    { "highlight": [5, 2], "label": "fast→3 (count=2)", "stats": { "count": 2 } },
    { "highlight": [5, 3], "label": "fast→4 (count=3)", "stats": { "count": 3 } },
    { "highlight": [5, 4], "label": "fast→5 (count=4) → cycle length found", "stats": { "count": 4 } }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`playground
{
  "title": "Python Implementation",
  "language": "python",
  "code": "class Node:\\n    def __init__(self, val, nxt=None):\\n        self.val = val\\n        self.next = nxt\\n\\ndef cycle_length(head):\\n    slow = fast = head\\n    # 1. Detect cycle\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow is fast:  # cycle found\\n            break\\n    else:\\n        return 0  # no cycle\\n    # 2. & 3. Measure loop\\n    length = 0\\n    curr = slow\\n    while True:\\n        curr = curr.next\\n        length += 1\\n        if curr is slow:\\n            return length\\n\\n# Quick test\\nn3 = Node(3); n4 = Node(4); n5 = Node(5); n6 = Node(6)\\nn3.next = n4; n4.next = n5; n5.next = n6; n6.next = n3\\nprint(\\"Cycle length:\\", cycle_length(n3))  # 4",
  "runnable": true
}
\`\`\`

### Complexity

- **Time:** O(n) — each node is visited a constant number of times.  
- **Space:** O(1) — only two pointers regardless of input size.

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "After the first meeting, why can we move the fast pointer one step at a time instead of two?",
      "options": [
        "To avoid skipping nodes",
        "Because both pointers are now inside the cycle",
        "To save CPU cycles",
        "It is required by Floyd's proof"
      ],
      "answer": 1,
      "explanation": "Once both pointers are inside the cycle, moving either one step-by-step guarantees they will eventually meet again, giving an exact count of nodes in the loop."
    },
    {
      "question": "If the cycle has length L, how many steps does the frozen-pointer counting phase take?",
      "options": ["L-1", "L", "L+1", "2L"],
      "answer": 1,
      "explanation": "The moving pointer must traverse all L nodes to return to the frozen pointer, so exactly L steps (and increments) are needed."
    },
    {
      "question": "What happens if we forget to check for a cycle before starting the length count?",
      "options": [
        "We get an infinite loop",
        "We return 0",
        "We raise an exception",
        "We still get the correct answer"
      ],
      "answer": 0,
      "explanation": "Without a cycle the ‘next’ chain ends in None; the counting loop would dereference None indefinitely, causing an infinite loop (or crash)."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Floyd's algorithm first confirms a cycle exists, then re-uses the same two pointers to measure its length.",
    "Freezing one pointer inside the cycle and walking the other guarantees an exact count of nodes in the loop.",
    "The entire procedure stays O(n) time and O(1) space, making it the optimal solution for interview settings."
  ]
}
\`\`\``,
      starterCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def build_list(values, cycle_pos):
    if not values:
        return None
    head = ListNode(values[0])
    current = head
    nodes = [head]
    for v in values[1:]:
        node = ListNode(v)
        current.next = node
        current = node
        nodes.append(node)
    if cycle_pos >= 0:
        current.next = nodes[cycle_pos]
    return head

def find_cycle_length(head):
    # TODO: detect cycle, then count its length
    pass

# Test cases
print(find_cycle_length(build_list([1, 2, 3, 4, 5, 6], 2)))  # Expected: 4
print(find_cycle_length(build_list([1, 2, 3], 0)))             # Expected: 3
print(find_cycle_length(build_list([10, 20], 0)))              # Expected: 2
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def build_list(values, cycle_pos):
    if not values:
        return None
    head = ListNode(values[0])
    current = head
    nodes = [head]
    for v in values[1:]:
        node = ListNode(v)
        current.next = node
        current = node
        nodes.append(node)
    if cycle_pos >= 0:
        current.next = nodes[cycle_pos]
    return head

def find_cycle_length(head):
    slow, fast = head, head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            # Count the cycle length
            current = slow
            length = 0
            while True:
                current = current.next
                length += 1
                if current == slow:
                    break
            return length
    return 0

# Test cases
print(find_cycle_length(build_list([1, 2, 3, 4, 5, 6], 2)))  # Expected: 4
print(find_cycle_length(build_list([1, 2, 3], 0)))             # Expected: 3
print(find_cycle_length(build_list([10, 20], 0)))              # Expected: 2
`,
    },
    {
      id: "fast-slow-cycle-start",
      slug: "find-cycle-start",
      title: "Find Cycle Start",
      content: `## Find the Start of the Cycle

### Problem Statement

Given the head of a linked list that contains a cycle, find the **node where the cycle begins** and return its value.

\`\`\`concept
{
  "title": "Cycle Start Detection",
  "variant": "mental-model",
  "content": "Once Floyd's algorithm finds a meeting point inside the cycle, the distance from the list head to the cycle start equals the distance from the meeting point to the cycle start when traveling around the cycle. This mathematical insight lets us locate the exact cycle entrance in O(n) time with O(1) space."
}
\`\`\`

### Examples

\`\`\`
Input:  nodes = [1, 2, 3, 4, 5, 6], cycle_pos = 2
Output: 3
Explanation: The cycle starts at the node with value 3 (index 2).
\`\`\`

\`\`\`
Input:  nodes = [1, 2, 3], cycle_pos = 0
Output: 1
Explanation: The tail connects back to the head.
\`\`\`

\`\`\`
Input:  nodes = [10, 20, 30, 40], cycle_pos = 1
Output: 20
Explanation: The cycle starts at node with value 20.
\`\`\`

### Two-Phase Algorithm

\`\`\`steps
{
  "title": "Finding the Cycle Start",
  "steps": [
    {
      "title": "Phase 1: Detect Cycle",
      "content": "Use Floyd's algorithm to find any meeting point inside the cycle. Move slow pointer 1 step, fast pointer 2 steps per iteration until they meet."
    },
    {
      "title": "Phase 2: Find Cycle Length",
      "content": "Keep one pointer at the meeting point. Move the other pointer around the cycle until they meet again, counting the number of steps - this gives you cycle length K."
    },
    {
      "title": "Phase 3: Locate Cycle Start",
      "content": "Place pointer1 at head, pointer2 K steps ahead. Move both 1 step at a time. The meeting point is the cycle start."
    }
  ]
}
\`\`\`

\`\`\`algoviz
{
  "title": "Cycle Start Detection on [3,1,4,2]",
  "type": "linkedlist",
  "data": [3, 1, 4, 2],
  "frames": [
    {"highlight": [0], "label": "Phase 1: slow at 3, fast at 3"},
    {"highlight": [0,1], "label": "slow→1, fast→4"},
    {"highlight": [1,3], "label": "slow→4, fast→1 (wraps around)"},
    {"highlight": [3,2], "label": "slow→2, fast→2 (meeting point!)"},
    {"highlight": [0], "label": "Phase 3: reset slow to head"},
    {"highlight": [0,3], "label": "slow→1, fast→3"},
    {"highlight": [1,0], "label": "slow→4, fast→1"},
    {"highlight": [3], "label": "Both at node 1 - cycle start found!"}
  ],
  "speed": 1000
}
\`\`\`

### Why This Works

The key insight: when the two pointers meet inside the cycle, the distance from the list head to the cycle start equals the distance from the meeting point to the cycle start when traveling around the cycle. By moving one pointer ahead by exactly the cycle length, we ensure both pointers reach the cycle start simultaneously.

\`\`\`callout
{
  "type": "tip",
  "title": "Mathematical Proof",
  "content": "Let D = distance from head to cycle start, K = cycle length. When slow and fast meet, slow has traveled D + m*K + p steps, fast has traveled D + n*K + p steps. Since fast moves twice as fast: 2(D + m*K + p) = D + n*K + p. This simplifies to D = (n-2m)*K - p, proving that starting one pointer at head and another at the meeting point, they'll meet at the cycle start after D steps."
}
\`\`\`

### Complexity

- **Time:** O(n) - we traverse the list at most twice
- **Space:** O(1) - only using two pointers regardless of input size

\`\`\`quiz
{
  "title": "Cycle Start Detection Quiz",
  "questions": [
    {
      "question": "After finding a meeting point inside the cycle, what is the next step to find the cycle start?",
      "options": ["Reset both pointers to head", "Calculate cycle length then reset one pointer to head", "Move both pointers two steps at a time", "Return the meeting point as cycle start"],
      "answer": 1,
      "explanation": "You need to calculate the cycle length first, then reset one pointer to the head while keeping the other at the meeting point (advanced by cycle length)."
    },
    {
      "question": "Why does moving pointer2 ahead by cycle length K guarantee we'll find the cycle start?",
      "options": ["It makes pointer2 faster", "It ensures both pointers travel the same distance to reach cycle start", "It prevents infinite loops", "It reduces time complexity"],
      "answer": 1,
      "explanation": "Pointer2 being K steps ahead means when pointer1 reaches the cycle start, pointer2 has completed exactly one full cycle and is also at the cycle start."
    },
    {
      "question": "If the cycle length is 5 and the meeting point is at node with value 8, where should pointer2 start in phase 3?",
      "options": ["At the head", "5 nodes ahead of head", "At the meeting point (node 8)", "At node 8's next node"],
      "answer": 1,
      "explanation": "Pointer2 should start 5 nodes (cycle length) ahead of the head, which could involve wrapping around the cycle if the list is shorter than 5 nodes."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Implement Cycle Start Detection",
  "language": "python",
  "code": "class ListNode:\\n    def __init__(self, val=0, next=None):\\n        self.val = val\\n        self.next = next\\n\\ndef find_cycle_start(head):\\n    # Phase 1: Detect cycle\\n    slow = fast = head\\n    has_cycle = False\\n    \\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow == fast:\\n            has_cycle = True\\n            break\\n    \\n    if not has_cycle:\\n        return None\\n    \\n    # Phase 2: Find cycle length\\n    cycle_length = 0\\n    current = slow\\n    while True:\\n        current = current.next\\n        cycle_length += 1\\n        if current == slow:\\n            break\\n    \\n    # Phase 3: Find cycle start\\n    pointer1 = head\\n    pointer2 = head\\n    \\n    # Move pointer2 ahead by cycle_length\\n    for _ in range(cycle_length):\\n        pointer2 = pointer2.next\\n    \\n    # Move both until they meet\\n    while pointer1 != pointer2:\\n        pointer1 = pointer1.next\\n        pointer2 = pointer2.next\\n    \\n    return pointer1.val\\n\\n# Test with [1,2,3,4,5] where 3 connects back to 2\\ncycle_start = ListNode(2)\\ncycle_start.next = ListNode(3)\\ncycle_start.next.next = ListNode(4)\\ncycle_start.next.next.next = ListNode(5)\\ncycle_start.next.next.next.next = cycle_start  # creates cycle\\n\\nhead = ListNode(1)\\nhead.next = cycle_start\\n\\nprint(f\\"Cycle starts at node with value: {find_cycle_start(head)}\\")",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Floyd's algorithm finds cycle start in O(n) time and O(1) space",
    "The two-phase approach: first detect cycle, then find cycle length, finally locate start",
    "Mathematical insight: distance from head to cycle start equals distance from meeting point to cycle start",
    "This technique works for any sequence with cycles, not just linked lists"
  ]
}
\`\`\``,
      starterCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def build_list(values, cycle_pos):
    if not values:
        return None
    head = ListNode(values[0])
    current = head
    nodes = [head]
    for v in values[1:]:
        node = ListNode(v)
        current.next = node
        current = node
        nodes.append(node)
    if cycle_pos >= 0:
        current.next = nodes[cycle_pos]
    return head

def find_cycle_start(head):
    # TODO: find and return the value of the node where the cycle starts
    pass

# Test cases
print(find_cycle_start(build_list([1, 2, 3, 4, 5, 6], 2)))  # Expected: 3
print(find_cycle_start(build_list([1, 2, 3], 0)))             # Expected: 1
print(find_cycle_start(build_list([10, 20, 30, 40], 1)))      # Expected: 20
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def build_list(values, cycle_pos):
    if not values:
        return None
    head = ListNode(values[0])
    current = head
    nodes = [head]
    for v in values[1:]:
        node = ListNode(v)
        current.next = node
        current = node
        nodes.append(node)
    if cycle_pos >= 0:
        current.next = nodes[cycle_pos]
    return head

def find_cycle_start(head):
    slow, fast = head, head
    cycle_length = 0
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            # Calculate cycle length
            current = slow
            while True:
                current = current.next
                cycle_length += 1
                if current == slow:
                    break
            break
    # Move pointer2 cycle_length steps ahead
    pointer1, pointer2 = head, head
    for _ in range(cycle_length):
        pointer2 = pointer2.next
    # Move both until they meet
    while pointer1 != pointer2:
        pointer1 = pointer1.next
        pointer2 = pointer2.next
    return pointer1.val

# Test cases
print(find_cycle_start(build_list([1, 2, 3, 4, 5, 6], 2)))  # Expected: 3
print(find_cycle_start(build_list([1, 2, 3], 0)))             # Expected: 1
print(find_cycle_start(build_list([10, 20, 30, 40], 1)))      # Expected: 20
`,
    },
    {
      id: "fast-slow-happy-number",
      slug: "happy-number",
      title: "Happy Number",
      content: `## Happy Number

### Problem Statement

A number is called **happy** if, starting with the number itself, you repeatedly replace it with the sum of the squares of its digits, and the process eventually reaches **1**. If the process loops endlessly in a cycle that does not include 1, the number is **unhappy**.

Write a function that returns \`True\` if the given number is happy, \`False\` otherwise.

### Examples

\`\`\`
Input:  23
Output: True
Explanation: 2² + 3² = 13 -> 1² + 3² = 10 -> 1² + 0² = 1  (reached 1!)
\`\`\`

\`\`\`
Input:  12
Output: False
Explanation: The sequence eventually enters a cycle that never reaches 1.
\`\`\`

\`\`\`
Input:  1
Output: True
\`\`\`

\`\`\`concept
{
  "title": "The Happy Number Pattern",
  "variant": "mental-model",
  "content": "Happy numbers reveal a hidden structure: every positive integer's digit-square-sum sequence must either reach 1 (happy) or enter a repeating cycle (unhappy). There are no other possibilities — the sequence cannot grow infinitely because the sum of squares of digits always reduces large numbers. This guarantees that Floyd's cycle detection will always terminate."
}
\`\`\`

### Approach Hints

- The digit-square-sum sequence either reaches 1 or enters a cycle. This is exactly the **cycle detection** pattern!
- Use a slow pointer (one step of digit-square-sum) and a fast pointer (two steps).
- If they meet at 1, the number is happy; otherwise it is not.

\`\`\`algoviz
{
  "title": "Detecting Happy Number 23",
  "type": "array",
  "data": [23, 13, 10, 1],
  "frames": [
    {"highlight": [0], "label": "Start: n = 23", "stats": {"slow": 23, "fast": 23}},
    {"highlight": [0, 1], "label": "slow→13, fast→10 (2 steps)", "stats": {"slow": 13, "fast": 10}},
    {"highlight": [1, 2], "label": "slow→10, fast→1 (2 steps)", "stats": {"slow": 10, "fast": 1}},
    {"highlight": [2, 3], "label": "slow→1, fast→1 (met at 1!)", "stats": {"slow": 1, "fast": 1}}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Hash-set approach (O(k) space)",
    "code": "def isHappy(n: int) -> bool:\\n    seen = set()\\n    while n != 1 and n not in seen:\\n        seen.add(n)\\n        n = sum(int(d)**2 for d in str(n))\\n    return n == 1"
  },
  "after": {
    "label": "Floyd's tortoise & hare (O(1) space)",
    "code": "def isHappy(n: int) -> bool:\\n    def next_num(x):\\n        return sum(int(d)**2 for d in str(x))\\n    \\n    slow = fast = n\\n    while fast != 1:\\n        slow = next_num(slow)\\n        fast = next_num(next_num(fast))\\n        if slow == fast:\\n            break\\n    return fast == 1"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Happy Number Insights",
  "questions": [
    {
      "question": "Why can't the digit-square-sum sequence grow without bound?",
      "options": ["Digits are limited 0-9", "Sum of squares is always ≤ 9² × digits", "Both A and B", "Mathematical induction proves it"],
      "answer": 2,
      "explanation": "Each digit is at most 9, so sum of squares for a k-digit number is ≤ 81k. For k ≥ 4, 81k < 10^(k-1), so the sequence must decrease until the number has ≤ 3 digits."
    },
    {
      "question": "What cycle do all unhappy numbers eventually enter?",
      "options": ["4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4", "2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 2", "1 → 1 → 1 ...", "No fixed cycle"],
      "answer": 0,
      "explanation": "Every unhappy number ends in the repeating cycle 4,16,37,58,89,145,42,20,4. Detecting this cycle (or reaching 1) is the key to the algorithm."
    },
    {
      "question": "What is the worst-case time complexity for n = 10^9?",
      "options": ["O(log n)", "O(log log n)", "O(1)", "O(n)"],
      "answer": 0,
      "explanation": "Although the number shrinks quickly, the bound is expressed as O(log n) where n is the input value. For 10^9, log₁₀(10^9)=9, and the sequence length is a small constant multiple of this."
    }
  ]
}
\`\`\`

### Complexity

- **Time:** O(log n) — the number of digits decreases rapidly.
- **Space:** O(1) — no hash set needed thanks to fast/slow pointers.

\`\`\`playground
{
  "title": "Implement Happy Number",
  "language": "python",
  "code": "def isHappy(n: int) -> bool:\\n    def next_num(x):\\n        # TODO: return sum of squares of digits of x\\n        pass\\n    \\n    slow = fast = n\\n    while fast != 1:\\n        slow = next_num(slow)\\n        fast = next_num(next_num(fast))\\n        if slow == fast:\\n            break\\n    return fast == 1\\n\\n# Test cases\\nprint(isHappy(19))  # True\\nprint(isHappy(2))   # False",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Happy numbers are decided by whether the digit-square-sum sequence reaches 1 or enters the 4,16,37… cycle.",
    "Floyd’s tortoise & hare gives an O(log n) time, O(1) space solution—no extra memory needed.",
    "The algorithm is identical to linked-list cycle detection; only the ‘next’ function changes.",
    "Unhappy numbers always end in the same repeating cycle, guaranteeing termination."
  ]
}
\`\`\``,
      starterCode: `def is_happy_number(num):
    # TODO: implement using fast & slow pointers on digit square sums
    pass

# Test cases
print(is_happy_number(23))  # Expected: True
print(is_happy_number(12))  # Expected: False
print(is_happy_number(1))   # Expected: True
`,
      solutionCode: `def is_happy_number(num):
    def digit_square_sum(n):
        total = 0
        while n > 0:
            digit = n % 10
            total += digit * digit
            n //= 10
        return total

    slow = num
    fast = num
    while True:
        slow = digit_square_sum(slow)
        fast = digit_square_sum(digit_square_sum(fast))
        if slow == fast:
            break
    return slow == 1

# Test cases
print(is_happy_number(23))  # Expected: True
print(is_happy_number(12))  # Expected: False
print(is_happy_number(1))   # Expected: True
`,
    },
    {
      id: "fast-slow-middle-linked-list",
      slug: "middle-of-linked-list",
      title: "Middle of Linked List",
      content: `## Middle of the Linked List

### Problem Statement

Given the head of a singly linked list, return the **value of the middle node**. If the list has an even number of nodes, return the value of the **second middle node**.

### Examples

\`\`\`
Input:  [1, 2, 3, 4, 5]
Output: 3
Explanation: The middle of 5 nodes is at index 2.
\`\`\`

\`\`\`
Input:  [1, 2, 3, 4, 5, 6]
Output: 4
Explanation: For 6 nodes, the two middles are 3 and 4; we return the second one.
\`\`\`

\`\`\`
Input:  [1]
Output: 1
\`\`\`

\`\`\`concept
{
  "title": "Fast & Slow Pointers: The Tortoise and Hare",
  "variant": "mental-model",
  "content": "Imagine two runners on a straight track. The hare runs twice as fast as the tortoise. When the hare reaches the finish line, the tortoise will be exactly halfway to the finish. This is the essence of Floyd's algorithm: by moving one pointer twice as fast as another, we can find the midpoint in a single pass."
}
\`\`\`

### Approach

The Fast & Slow Pointers technique (also known as the Tortoise and Hare algorithm) provides an elegant solution:

1. **Initialize two pointers** at the head: \`slow\` and \`fast\`
2. **Move slow one step** (\`slow = slow.next\`)
3. **Move fast two steps** (\`fast = fast.next.next\`)
4. **Repeat until fast reaches the end** (\`fast\` is null or \`fast.next\` is null)
5. **Slow pointer is at the middle**

\`\`\`algoviz
{
  "title": "Finding Middle with Fast & Slow Pointers",
  "type": "linkedlist",
  "data": [1, 2, 3, 4, 5],
  "frames": [
    { "highlight": [0, 0], "label": "Both pointers start at head", "stats": {"slow": 0, "fast": 0} },
    { "highlight": [1, 2], "label": "Slow moves 1, fast moves 2", "stats": {"slow": 1, "fast": 2} },
    { "highlight": [2, 4], "label": "Slow at index 2 (value 3), fast at end", "stats": {"slow": 2, "fast": 4} }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`playground
{
  "title": "Middle Node Finder",
  "language": "python",
  "code": "class ListNode:\\n    def __init__(self, val=0, next=None):\\n        self.val = val\\n        self.next = next\\n\\ndef find_middle(head):\\n    slow = fast = head\\n    \\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n    \\n    return slow.val if slow else None\\n\\n# Test with [1,2,3,4,5]\\nhead = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))\\nprint(f\\"Middle value: {find_middle(head)}\\")  # Output: 3",
  "runnable": true
}
\`\`\`

### Edge Cases & Special Handling

\`\`\`callout
{
  "type": "warning",
  "title": "Even-Length Lists",
  "content": "When the list has an even number of nodes, fast will land on the last node (when \`fast.next\` is \`None\`), and slow will be at the second middle node. This matches our requirement to return the second middle value."
}
\`\`\`

### Complexity Analysis

- **Time:** O(n) — single pass through the list
- **Space:** O(1) — only two pointers regardless of list size

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naive Approach",
    "code": "# Count all nodes first, then traverse to middle\\ndef find_middle_naive(head):\\n    count = 0\\n    curr = head\\n    while curr:\\n        count += 1\\n        curr = curr.next\\n    \\n    mid = count // 2\\n    curr = head\\n    for i in range(mid):\\n        curr = curr.next\\n    return curr.val"
  },
  "after": {
    "label": "Fast & Slow Pointers",
    "code": "# Single pass solution\\ndef find_middle(head):\\n    slow = fast = head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n    return slow.val"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Middle Node Mastery",
  "questions": [
    {
      "question": "What happens if we move fast by 3 steps instead of 2?",
      "options": ["Still finds middle correctly", "Finds node at 1/3 position", "Causes infinite loop", "Skips middle entirely"],
      "answer": 1,
      "explanation": "Moving fast 3 steps would make slow move 1/3 as fast, so when fast reaches the end, slow would be at approximately 1/3 of the list length, not the middle."
    },
    {
      "question": "For the list [1,2,3,4,5,6,7], where is slow when the algorithm terminates?",
      "options": ["Node 3", "Node 4", "Node 5", "Node 7"],
      "answer": 1,
      "explanation": "With 7 nodes, the middle is at index 3 (0-based), which contains value 4. Fast reaches the end when slow is at this position."
    },
    {
      "question": "Why can't we use this technique on arrays?",
      "options": ["Arrays don't support pointers", "Arrays have random access", "Arrays are immutable", "The technique works fine on arrays"],
      "answer": 1,
      "explanation": "While we could use two indices, it's unnecessary since arrays support O(1) random access. We can directly access the middle element using index math: arr[len(arr)//2]."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Fast & Slow Pointers solve the problem in O(n) time with O(1) space",
    "The technique works because fast moves twice as fast as slow",
    "For even-length lists, we naturally get the second middle node",
    "This same pattern extends to cycle detection and other linked list problems"
  ]
}
\`\`\``,
      starterCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def build_list(values):
    if not values:
        return None
    head = ListNode(values[0])
    current = head
    for v in values[1:]:
        node = ListNode(v)
        current.next = node
        current = node
    return head

def find_middle(head):
    # TODO: implement using fast & slow pointers
    pass

# Test cases
print(find_middle(build_list([1, 2, 3, 4, 5])))    # Expected: 3
print(find_middle(build_list([1, 2, 3, 4, 5, 6]))) # Expected: 4
print(find_middle(build_list([1])))                  # Expected: 1
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def build_list(values):
    if not values:
        return None
    head = ListNode(values[0])
    current = head
    for v in values[1:]:
        node = ListNode(v)
        current.next = node
        current = node
    return head

def find_middle(head):
    slow, fast = head, head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
    return slow.val

# Test cases
print(find_middle(build_list([1, 2, 3, 4, 5])))    # Expected: 3
print(find_middle(build_list([1, 2, 3, 4, 5, 6]))) # Expected: 4
print(find_middle(build_list([1])))                  # Expected: 1
`,
    },
  ],
};
