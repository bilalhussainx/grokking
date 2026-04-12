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

### Core Idea

- A **slow** pointer moves one step at a time.
- A **fast** pointer moves two steps at a time.
- If there is a **cycle**, the fast pointer will eventually catch up to the slow pointer inside the cycle.
- If there is **no cycle**, the fast pointer will reach the end.

### Why It Works

Imagine two runners on a circular track. The faster runner will inevitably lap the slower runner. The same principle applies to pointers traversing a cyclic data structure.

### Classic Applications

| Use Case | Description |
|----------|-------------|
| **Cycle detection** | Determine whether a linked list or sequence contains a loop. |
| **Cycle length** | Once inside the cycle, count steps until the slow pointer returns to the meeting point. |
| **Cycle start** | Reset one pointer to the head; move both at the same speed — they meet at the cycle start. |
| **Middle element** | When fast reaches the end, slow is at the middle. |
| **Happy number** | Digit-square sequences either reach 1 or loop — treat it as cycle detection. |

### Complexity

Most fast/slow pointer solutions run in **O(n)** time and **O(1)** space, avoiding the need for hash sets to detect revisited nodes.

### Note on Implementation

Since we are running Python in the browser (Pyodide), we will simulate linked lists using arrays or simple \`ListNode\` classes defined inline. The algorithmic logic is identical.

\`\`\`mermaid
graph LR
    N1["1"] --> N2["2"] --> N3["3"] --> N4["4"] --> N5["5"]
    N5 -->|"cycle"| N3
    S["Slow (1 step)"] -.-> N2
    F["Fast (2 steps)"] -.-> N4
    style S fill:#4CAF50,color:#fff
    style F fill:#f44336,color:#fff
\`\`\`

\`\`\`mermaid
graph TD
    A["Both start at head"] --> B{"Fast reached end?"}
    B -->|"Yes"| C["No cycle"]
    B -->|"No"| D["Slow += 1 step<br/>Fast += 2 steps"]
    D --> E{"Slow == Fast?"}
    E -->|"Yes"| F["Cycle detected!"]
    E -->|"No"| B
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

### Approach Hints

- Initialize both \`slow\` and \`fast\` to the head.
- Move \`slow\` one step, \`fast\` two steps.
- If \`fast\` or \`fast.next\` becomes \`None\`, there is no cycle.
- If \`slow == fast\` at any point, a cycle exists.

\`\`\`mermaid
graph LR
    subgraph Step1["Step 1"]
        S1["S=1, F=1 → S→2, F→3"]
    end
    subgraph Step2["Step 2"]
        S2["S=2, F=3 → S→3, F→5"]
    end
    subgraph Step3["Step 3"]
        S3["S=3, F=5 → S→4, F→3"]
    end
    subgraph Step4["Step 4"]
        S4["S=4, F=3 → S→5, F→5"]
    end
    subgraph Step5["Step 5: Meet!"]
        S5["S=5, F=5 → Cycle found!"]
    end
    Step1 --> Step2 --> Step3 --> Step4 --> Step5
\`\`\`

### Complexity

- **Time:** O(n)
- **Space:** O(1)`,
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

### Approach Hints

1. First, detect the cycle using fast/slow pointers until they meet.
2. Once they meet (both are inside the cycle), keep one pointer fixed and advance the other one step at a time, counting until it returns to the meeting point.
3. That count is the cycle length.

### Complexity

- **Time:** O(n)
- **Space:** O(1)`,
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

### Approach Hints

1. Detect the cycle and find the cycle length \`K\` (using the technique from the previous problem).
2. Place pointer1 at the head. Place pointer2 at the head and advance it \`K\` steps ahead.
3. Now move both pointers one step at a time. The point where they meet is the **start of the cycle**.

The reason this works: pointer2 is exactly one cycle length ahead, so when pointer1 reaches the cycle start, pointer2 has completed exactly one full loop and is also at the cycle start.

### Complexity

- **Time:** O(n)
- **Space:** O(1)`,
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

### Approach Hints

- The digit-square-sum sequence either reaches 1 or enters a cycle. This is exactly the **cycle detection** pattern!
- Use a slow pointer (one step of digit-square-sum) and a fast pointer (two steps).
- If they meet at 1, the number is happy; otherwise it is not.

### Complexity

- **Time:** O(log n) — the number of digits decreases rapidly.
- **Space:** O(1) — no hash set needed thanks to fast/slow pointers.`,
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

### Approach Hints

- Use slow and fast pointers starting at the head.
- Move slow one step, fast two steps.
- When fast reaches the end, slow is at the middle.
- For even-length lists, fast will land on the last node (when \`fast.next\` is \`None\`), and slow will be at the second middle node.

### Complexity

- **Time:** O(n) — single pass.
- **Space:** O(1)`,
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
