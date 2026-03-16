import { Module } from "../types";

export const fastSlowPointersModule: Module = {
  id: "fast-slow-pointers",
  title: "Fast & Slow Pointers",
  description:
    "Learn the fast and slow pointers (Floyd's Cycle Detection) technique to solve problems involving cycles in linked lists and arrays, and finding middle elements.",
  lessons: [
    {
      id: "fast-slow-intro",
      slug: "fast-slow-intro",
      title: "Introduction to Fast & Slow Pointers",
      content: `## The Fast & Slow Pointers Pattern

The **fast and slow pointers** technique uses two pointers moving at different speeds (typically 1x and 2x) to detect cycles, find middle elements, or identify patterns in linked lists and arrays.

<!-- voice:section_check concept="fast and slow pointer concept" -->

### Why Fast & Slow Pointers?

This pattern, also known as **Floyd's Cycle Detection Algorithm** or the **Tortoise and Hare** algorithm, elegantly solves problems that would otherwise require extra space or multiple passes.

### Common Applications

| Application | Description |
|-------------|-------------|
| **Cycle Detection** | Determine if a linked list has a cycle |
| **Find Middle** | Locate the middle element in one pass |
| **Find Cycle Start** | Identify where a cycle begins |
| **Happy Number** | Detect cycles in numerical sequences |

<!-- voice:key_insight insight="If there's a cycle, the fast pointer (moving 2x) will eventually meet the slow pointer (moving 1x)" -->

### How It Works

1. Initialize both pointers at the start.
2. Move slow pointer by 1 step, fast pointer by 2 steps.
3. If there's a cycle, they will eventually meet.
4. If fast reaches the end, there's no cycle.

### Complexity

- **Time:** O(n) — fast pointer traverses at most n nodes.
- **Space:** O(1) — no extra data structures needed.`,
    },
    {
      id: "linked-list-cycle",
      slug: "linked-list-cycle",
      title: "Linked List Cycle Detection",
      content: `## Linked List Cycle Detection

<!-- voice:section_check concept="Floyd's cycle detection" -->

### Problem Statement

Given the head of a linked list, determine if the linked list has a **cycle** in it. A cycle exists if some node can be reached again by continuously following the \`next\` pointer.

### Examples

~~~
Input:  head = [3, 2, 0, -4], pos = 1 (cycle back to index 1)
Output: True
~~~

~~~
Input:  head = [1, 2], pos = 0 (cycle back to index 0)
Output: True
~~~

~~~
Input:  head = [1], pos = -1 (no cycle)
Output: False
~~~

### Approach

Use two pointers:
- **Slow**: moves 1 step at a time
- **Fast**: moves 2 steps at a time

If there's a cycle, fast will eventually catch up to slow from behind.
If there's no cycle, fast will reach the end (null).

<!-- voice:key_insight insight="The fast pointer entering a cycle will eventually lap the slow pointer and meet it" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) — in the worst case, we visit each node once.
- **Space:** O(1) — only two pointers used.`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def has_cycle(head):
    """
    Detect if a linked list has a cycle using Floyd's algorithm.
    
    Args:
        head: ListNode, the head of the linked list
    
    Returns:
        bool: True if there's a cycle, False otherwise
    
    Example:
        # 1 -> 2 -> 3 -> 2 (cycle)
        # has_cycle(head) returns True
    """
    # TODO: Use fast and slow pointers
    # Hint: Slow moves 1 step, fast moves 2 steps. If they meet, there's a cycle.
    pass


# ─── Test Cases ───

# Create list: 1 -> 2 -> 3 -> 4 -> 2 (cycle back to node 2)
node1 = ListNode(1)
node2 = ListNode(2)
node3 = ListNode(3)
node4 = ListNode(4)
node1.next = node2
node2.next = node3
node3.next = node4
node4.next = node2  # Creates cycle
print(has_cycle(node1))
# Expected: True

# No cycle: 1 -> 2 -> 3 -> None
node_a = ListNode(1)
node_b = ListNode(2)
node_c = ListNode(3)
node_a.next = node_b
node_b.next = node_c
print(has_cycle(node_a))
# Expected: False

# Single node, no cycle
single = ListNode(1)
print(has_cycle(single))
# Expected: False

# Single node with self-cycle
self_cycle = ListNode(1)
self_cycle.next = self_cycle
print(has_cycle(self_cycle))
# Expected: True
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def has_cycle(head):
    """
    Detect if a linked list has a cycle using Floyd's algorithm.
    
    Time Complexity: O(n) — fast pointer visits at most n nodes
    Space Complexity: O(1) — only two pointers used
    """
    if not head or not head.next:
        return False
    
    slow = head
    fast = head.next  # Start fast one step ahead
    
    while fast and fast.next:
        if slow == fast:
            return True  # Pointers met, cycle exists
        slow = slow.next        # Move 1 step
        fast = fast.next.next   # Move 2 steps
    
    return False  # Fast reached end, no cycle


# ─── Test Cases ───
node1 = ListNode(1)
node2 = ListNode(2)
node3 = ListNode(3)
node4 = ListNode(4)
node1.next = node2
node2.next = node3
node3.next = node4
node4.next = node2
print(has_cycle(node1))
# Expected: True

node_a = ListNode(1)
node_b = ListNode(2)
node_c = ListNode(3)
node_a.next = node_b
node_b.next = node_c
print(has_cycle(node_a))
# Expected: False

single = ListNode(1)
print(has_cycle(single))
# Expected: False

self_cycle = ListNode(1)
self_cycle.next = self_cycle
print(has_cycle(self_cycle))
# Expected: True
`,
    },
    {
      id: "find-cycle-start",
      slug: "find-cycle-start",
      title: "Find Cycle Start",
      content: `## Find the Start of a Cycle

<!-- voice:section_check concept="finding cycle start node" -->

### Problem Statement

Given a linked list with a cycle, return the **node where the cycle begins**. If there is no cycle, return \`None\`.

### Examples

~~~
Input:  head = [3, 2, 0, -4], pos = 1
Output: Node at index 1 (value 2)
Explanation: The tail connects to the node at index 1
~~~

### Approach

Phase 1: Use fast and slow pointers to detect if a cycle exists.

Phase 2: Once they meet, reset one pointer to the head. Move both pointers at the **same speed** (1 step each). The node where they meet is the cycle start.

**Why this works:**
- Let distance from head to cycle start = F
- Let distance from cycle start to meeting point = S
- Let cycle length = C
- When slow and fast meet: 2(F + S) = F + S + nC (fast traveled twice as far, plus n full cycles)
- Simplifying: F + S = nC → F = nC - S
- This means the distance from head to start equals the distance from meeting point to start (modulo cycle length)

<!-- voice:key_insight insight="After finding the meeting point, reset one pointer to head and move both at same speed to find cycle start" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — single pass to detect cycle, another to find start.
- **Space:** O(1) — only pointers used.`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def find_cycle_start(head):
    """
    Find the node where the cycle begins in a linked list.
    
    Args:
        head: ListNode, the head of the linked list
    
    Returns:
        ListNode: The node where cycle begins, or None if no cycle
    
    Example:
        # Cycle starts at node with value 2
        # find_cycle_start(head).val returns 2
    """
    # TODO: Phase 1: Detect cycle with fast/slow
    # Phase 2: Reset one pointer to head, move both at same speed
    pass


# ─── Test Cases ───

# Cycle at index 1 (value 2)
node1 = ListNode(3)
node2 = ListNode(2)
node3 = ListNode(0)
node4 = ListNode(-4)
node1.next = node2
node2.next = node3
node3.next = node4
node4.next = node2  # Cycle back to node2
result = find_cycle_start(node1)
print(result.val if result else None)
# Expected: 2

# No cycle
a = ListNode(1)
b = ListNode(2)
a.next = b
print(find_cycle_start(a))
# Expected: None

# Cycle at index 0 (self-loop)
cycle_start = ListNode(1)
cycle_start.next = cycle_start
result2 = find_cycle_start(cycle_start)
print(result2.val if result2 else None)
# Expected: 1
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def find_cycle_start(head):
    """
    Find the node where the cycle begins in a linked list.
    
    Time Complexity: O(n) — detect cycle + find start
    Space Complexity: O(1) — only pointers used
    """
    if not head or not head.next:
        return None
    
    # Phase 1: Detect if cycle exists
    slow = fast = head
    has_cycle = False
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            has_cycle = True
            break
    
    if not has_cycle:
        return None
    
    # Phase 2: Find cycle start
    # Reset slow to head, keep fast at meeting point
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow  # or fast, they're the same


# ─── Test Cases ───
node1 = ListNode(3)
node2 = ListNode(2)
node3 = ListNode(0)
node4 = ListNode(-4)
node1.next = node2
node2.next = node3
node3.next = node4
node4.next = node2
result = find_cycle_start(node1)
print(result.val if result else None)
# Expected: 2

a = ListNode(1)
b = ListNode(2)
a.next = b
print(find_cycle_start(a))
# Expected: None

cycle_start = ListNode(1)
cycle_start.next = cycle_start
result2 = find_cycle_start(cycle_start)
print(result2.val if result2 else None)
# Expected: 1
`,
    },
    {
      id: "find-middle-linked-list",
      slug: "find-middle-linked-list",
      title: "Middle of Linked List",
      content: `## Find the Middle of a Linked List

<!-- voice:section_check concept="finding middle with fast/slow" -->

### Problem Statement

Given the head of a singly linked list, return the **middle node**. If there are two middle nodes, return the **second middle node**.

### Examples

~~~
Input:  [1, 2, 3, 4, 5]
Output: Node with value 3
~~~

~~~
Input:  [1, 2, 3, 4, 5, 6]
Output: Node with value 4 (second middle)
~~~

### Approach

Use fast and slow pointers:
- When fast reaches the end, slow will be at the middle
- Fast moves 2 steps, slow moves 1 step
- For even-length lists, fast will end at null, slow at second middle

<!-- voice:key_insight insight="When fast reaches the end, slow has traveled half the distance" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) — single pass through the list.
- **Space:** O(1) — only two pointers.`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def find_middle(head):
    """
    Find the middle node of a linked list.
    If two middle nodes, return the second one.
    
    Args:
        head: ListNode, the head of the linked list
    
    Returns:
        ListNode: The middle node
    
    Example:
        # 1 -> 2 -> 3 -> 4 -> 5
        # find_middle(head).val returns 3
    """
    # TODO: Use fast and slow pointers
    # Hint: When fast reaches end, slow is at middle
    pass


# ─── Test Cases ───

# Odd length: 1 -> 2 -> 3 -> 4 -> 5, middle is 3
n1 = ListNode(1)
n2 = ListNode(2)
n3 = ListNode(3)
n4 = ListNode(4)
n5 = ListNode(5)
n1.next = n2
n2.next = n3
n3.next = n4
n4.next = n5
print(find_middle(n1).val)
# Expected: 3

# Even length: 1 -> 2 -> 3 -> 4, middle is 3 (second)
a1 = ListNode(1)
a2 = ListNode(2)
a3 = ListNode(3)
a4 = ListNode(4)
a1.next = a2
a2.next = a3
a3.next = a4
print(find_middle(a1).val)
# Expected: 3

# Single node
single = ListNode(42)
print(find_middle(single).val)
# Expected: 42

# Two nodes
two1 = ListNode(1)
two2 = ListNode(2)
two1.next = two2
print(find_middle(two1).val)
# Expected: 2
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def find_middle(head):
    """
    Find the middle node of a linked list.
    If two middle nodes, return the second one.
    
    Time Complexity: O(n) — single pass
    Space Complexity: O(1) — two pointers
    """
    slow = fast = head
    
    # Fast moves 2x, slow moves 1x
    # When fast reaches end, slow is at middle
    while fast and fast.next:
        slow = slow.next        # 1 step
        fast = fast.next.next   # 2 steps
    
    return slow


# ─── Test Cases ───
n1 = ListNode(1)
n2 = ListNode(2)
n3 = ListNode(3)
n4 = ListNode(4)
n5 = ListNode(5)
n1.next = n2
n2.next = n3
n3.next = n4
n4.next = n5
print(find_middle(n1).val)
# Expected: 3

a1 = ListNode(1)
a2 = ListNode(2)
a3 = ListNode(3)
a4 = ListNode(4)
a1.next = a2
a2.next = a3
a3.next = a4
print(find_middle(a1).val)
# Expected: 3

single = ListNode(42)
print(find_middle(single).val)
# Expected: 42

two1 = ListNode(1)
two2 = ListNode(2)
two1.next = two2
print(find_middle(two1).val)
# Expected: 2
`,
    },
    {
      id: "happy-number",
      slug: "happy-number",
      title: "Happy Number",
      content: `## Happy Number

<!-- voice:section_check concept="cycle detection in numbers" -->

### Problem Statement

Write an algorithm to determine if a number is **happy**. A happy number is defined by the following process:
- Starting with any positive integer, replace the number by the sum of the squares of its digits.
- Repeat the process until the number equals 1 (happy) or loops endlessly in a cycle (not happy).

### Examples

~~~
Input:  n = 19
Output: True
Explanation: 
1² + 9² = 82
8² + 2² = 68
6² + 8² = 100
1² + 0² + 0² = 1
~~~

~~~
Input:  n = 2
Output: False
Explanation: Enters cycle 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4
~~~

### Approach

This is a cycle detection problem! The sequence of numbers either:
- Reaches 1 (terminate happily)
- Enters a cycle (not happy)

Use fast and slow pointers on the number transformation:
- Slow: transform once per step
- Fast: transform twice per step

If they meet at 1, it's happy. If they meet at any other number, there's a cycle.

<!-- voice:key_insight insight="This is cycle detection on a sequence of numbers, not a linked list" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(log n) — number of digits reduces quickly.
- **Space:** O(1) — only pointers and current number.`,
      starterCode: `def is_happy(n):
    """
    Determine if a number is happy.
    
    A happy number eventually reaches 1 when replacing it with
    sum of squares of its digits. Unhappy numbers enter a cycle.
    
    Args:
        n: Positive integer
    
    Returns:
        bool: True if happy number, False otherwise
    
    Example:
        >>> is_happy(19)
        True
        >>> is_happy(2)
        False
    """
    # TODO: Use fast/slow pointers on number transformation
    # Hint: Detect if we reach 1 (happy) or enter a cycle (unhappy)
    pass


def get_next_number(n):
    """Helper: Calculate sum of squares of digits."""
    # TODO: Implement sum of squares of digits
    pass


# ─── Test Cases ───

print(is_happy(19))
# Expected: True (19 → 82 → 68 → 100 → 1)

print(is_happy(2))
# Expected: False (enters cycle)

print(is_happy(7))
# Expected: True (7 → 49 → 97 → 130 → 10 → 1)

print(is_happy(1))
# Expected: True

print(is_happy(4))
# Expected: False (part of unhappy cycle)
`,
      solutionCode: `def is_happy(n):
    """
    Determine if a number is happy.
    
    Time Complexity: O(log n) — number of digits in n
    Space Complexity: O(1) — only pointers used
    """
    def get_next(num):
        """Calculate sum of squares of digits."""
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total
    
    slow = n
    fast = get_next(n)
    
    # Fast moves 2 steps, slow moves 1 step
    while fast != 1 and slow != fast:
        slow = get_next(slow)           # 1 step
        fast = get_next(get_next(fast)) # 2 steps
    
    return fast == 1


# ─── Test Cases ───
print(is_happy(19))
# Expected: True

print(is_happy(2))
# Expected: False

print(is_happy(7))
# Expected: True

print(is_happy(1))
# Expected: True

print(is_happy(4))
# Expected: False
`,
    },
    {
      id: "fast-slow-checkpoint",
      slug: "fast-slow-checkpoint",
      title: "Module Checkpoint: Fast & Slow Pointers",
      content: `## Module Checkpoint: Fast & Slow Pointers

<!-- voice:checkpoint_intro -->

Great job completing the Fast & Slow Pointers module! Let's verify your understanding.

### Quick Review

You learned to:
- Detect **cycles** in linked lists using Floyd's algorithm
- Find the **start of a cycle** with a two-phase approach
- Locate the **middle element** in one pass
- Apply cycle detection to **numerical sequences** (happy numbers)

### Quiz

**Question 1:** In Floyd's cycle detection, how many steps does the fast pointer move per iteration?
- A) 1 step
- B) 2 steps
- C) 3 steps
- D) Variable steps

**Question 2:** If fast and slow pointers meet in a linked list, what does this indicate?
- A) The list has an even number of nodes
- B) The list has a cycle
- C) The list is sorted
- D) The list is empty

**Question 3:** After finding the meeting point of fast and slow pointers, how do you find where the cycle starts?
- A) Reset both pointers to head and move at 2x speed
- B) Reset one pointer to head and move both at 1x speed
- C) Count nodes from head to meeting point
- D) Reverse the linked list

**Question 4:** True or False: The fast and slow pointer technique can find the middle of a linked list.

**Question 5:** What is the space complexity of Floyd's cycle detection algorithm?
- A) O(n) — stores visited nodes
- B) O(log n) — recursion stack
- C) O(1) — only uses two pointers
- D) O(n²) — nested iteration

### Voice Summary

After the quiz, your coach will ask you to explain:
- Why does the fast pointer eventually catch up to the slow pointer in a cycle?
- How would you explain the "reset to head" technique for finding cycle start?
- What other problems might benefit from fast/slow pointer patterns?

**You're doing great — keep it up!**`,
    },
  ],
};
