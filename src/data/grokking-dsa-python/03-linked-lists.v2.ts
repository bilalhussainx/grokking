import { Module } from "../types";

export const linkedListsModule: Module = {
  id: "linked-lists",
  title: "Linked Lists",
  description: "Understand how linked lists work, why they exist alongside arrays, and master the fast/slow pointer technique that solves cycle detection, middle-finding, and more.",
  lessons: [
    {
      id: "singly-linked-lists",
      slug: "singly-linked-lists",
      title: "Singly Linked Lists",
      content: `## Why Linked Lists?

Arrays are great, but they have a weakness: **inserting or deleting in the middle is O(n)** because every element after the insertion point must shift.

A **linked list** solves this. Instead of storing elements contiguously, each element (called a **node**) stores its value AND a pointer to the next node.

\`\`\`
Array:       [10][20][30][40][50]  ← contiguous in memory

Linked List: [10]→[20]→[30]→[40]→[50]→None
             Each node points to the next
\`\`\`

<!-- voice:section_check concept="linked lists use nodes with pointers instead of contiguous memory" -->

\`\`\`mermaid
graph LR
    HEAD["head"] --> N1
    N1["data: 10<br/>next: *"] -->|"next"| N2["data: 20<br/>next: *"] -->|"next"| N3["data: 30<br/>next: *"] -->|"next"| N4["data: 40<br/>next: *"] -->|"next"| NULL["None"]
    style HEAD fill:#42a5f5,stroke:#333
    style N1 fill:#66bb6a,stroke:#333
    style N2 fill:#66bb6a,stroke:#333
    style N3 fill:#66bb6a,stroke:#333
    style N4 fill:#66bb6a,stroke:#333
    style NULL fill:#bdbdbd,stroke:#333
\`\`\`

## Building a Linked List in Python

\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Create: 1 → 2 → 3 → None
head = ListNode(1)
head.next = ListNode(2)
head.next.next = ListNode(3)

# Or chain it:
head = ListNode(1, ListNode(2, ListNode(3)))
\`\`\`

## Traversing a Linked List

\`\`\`python
def print_list(head):
    current = head
    while current:
        print(current.val, end=" → ")
        current = current.next
    print("None")

# Output: 1 → 2 → 3 → None
\`\`\`

The key idea: **you can only move forward**. There's no \`list[i]\` — to reach the 5th element, you must walk through the first 4.

## Array vs Linked List

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access by index | O(1) | O(n) |
| Insert at beginning | O(n) | O(1) |
| Insert at end | O(1) amortized | O(n)* or O(1) with tail |
| Insert in middle | O(n) | O(1) after finding position |
| Delete in middle | O(n) | O(1) after finding position |
| Memory | Contiguous | Scattered (+ pointer overhead) |

<!-- voice:key_insight insight="Linked lists trade O(1) index access for O(1) insertion/deletion — use them when you frequently insert or remove from the front or middle" -->

## Java Comparison

\`\`\`java
// Java's ListNode is essentially the same
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

// Java also has LinkedList in java.util
LinkedList<Integer> list = new LinkedList<>();
list.addFirst(1);  // O(1) — linked list strength
list.addLast(3);
list.add(1, 2);    // Insert at index 1
\`\`\`

## Inserting and Deleting

\`\`\`python
def insert_at_head(head, val):
    """Insert a new node at the beginning: O(1)"""
    new_node = ListNode(val)
    new_node.next = head
    return new_node  # New head

def delete_node(head, target):
    """Delete first occurrence of target value."""
    if not head:
        return None
    if head.val == target:
        return head.next

    current = head
    while current.next:
        if current.next.val == target:
            current.next = current.next.next  # Skip over it
            return head
        current = current.next
    return head
\`\`\`

<!-- voice:section_check concept="insertion and deletion are pointer manipulation" -->

\`\`\`mermaid
graph LR
    subgraph "Insert at Head: O(1)"
        NEW["new: 0"] -->|"1. next = head"| A1["10"] --> A2["20"] --> A3["30"] --> NULL1["None"]
        NEWHEAD["head"] -.->|"2. head = new"| NEW
    end
    style NEW fill:#f9a825,stroke:#333
    style NEWHEAD fill:#42a5f5,stroke:#333
\`\`\`

## Try It Yourself

Implement basic linked list operations: counting nodes and inserting at a given position.
`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def list_to_linked(arr):
    """Helper: Convert a Python list to a linked list."""
    if not arr:
        return None
    head = ListNode(arr[0])
    current = head
    for val in arr[1:]:
        current.next = ListNode(val)
        current = current.next
    return head


def linked_to_list(head):
    """Helper: Convert a linked list to a Python list."""
    result = []
    current = head
    while current:
        result.append(current.val)
        current = current.next
    return result


def count_nodes(head):
    """
    Count the number of nodes in a linked list.

    Args:
        head: Head node of the linked list (or None)

    Returns:
        Integer count of nodes

    Example:
        1 → 2 → 3 → None  =>  3
    """
    # TODO: Traverse the list and count each node
    pass


def insert_at_position(head, val, position):
    """
    Insert a new node with given value at the specified position (0-indexed).
    If position is beyond the list length, insert at the end.

    Args:
        head: Head node of the linked list
        val: Value for the new node
        position: 0-indexed position to insert at

    Returns:
        Head of the modified list

    Example:
        1 → 3 → None, insert 2 at position 1  =>  1 → 2 → 3 → None
    """
    # TODO: Handle position 0 (insert at head)
    # Then traverse to position-1 and insert
    pass


# ─── Test Cases ───
# Do not modify below this line

head = list_to_linked([1, 2, 3, 4, 5])
print(count_nodes(head))
# Expected: 5

print(count_nodes(None))
# Expected: 0

head = list_to_linked([1, 3, 4])
head = insert_at_position(head, 2, 1)
print(linked_to_list(head))
# Expected: [1, 2, 3, 4]

head = insert_at_position(None, 5, 0)
print(linked_to_list(head))
# Expected: [5]

head = list_to_linked([1, 2])
head = insert_at_position(head, 3, 10)
print(linked_to_list(head))
# Expected: [1, 2, 3]
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def list_to_linked(arr):
    """Helper: Convert a Python list to a linked list."""
    if not arr:
        return None
    head = ListNode(arr[0])
    current = head
    for val in arr[1:]:
        current.next = ListNode(val)
        current = current.next
    return head


def linked_to_list(head):
    """Helper: Convert a linked list to a Python list."""
    result = []
    current = head
    while current:
        result.append(current.val)
        current = current.next
    return result


def count_nodes(head):
    """
    Count the number of nodes in a linked list.

    Time Complexity: O(n) — visit each node once
    Space Complexity: O(1) — single counter variable
    """
    count = 0
    current = head
    while current:
        count += 1
        current = current.next
    return count


def insert_at_position(head, val, position):
    """
    Insert a new node at the specified position.

    Time Complexity: O(n) — traverse to position
    Space Complexity: O(1) — creating one new node
    """
    new_node = ListNode(val)

    if position == 0:
        new_node.next = head
        return new_node

    current = head
    for _ in range(position - 1):
        if current.next is None:
            break
        current = current.next

    new_node.next = current.next
    current.next = new_node
    return head


# ─── Test Cases ───
# Do not modify below this line

head = list_to_linked([1, 2, 3, 4, 5])
print(count_nodes(head))
# Expected: 5

print(count_nodes(None))
# Expected: 0

head = list_to_linked([1, 3, 4])
head = insert_at_position(head, 2, 1)
print(linked_to_list(head))
# Expected: [1, 2, 3, 4]

head = insert_at_position(None, 5, 0)
print(linked_to_list(head))
# Expected: [5]

head = list_to_linked([1, 2])
head = insert_at_position(head, 3, 10)
print(linked_to_list(head))
# Expected: [1, 2, 3]
`,
    },
    {
      id: "reversing-linked-list",
      slug: "reversing-linked-list",
      title: "Reversing a Linked List",
      content: `## The Classic Interview Question

"Reverse a linked list" is one of the most frequently asked interview questions. It tests your ability to manipulate pointers carefully without losing track of nodes.

<!-- voice:section_check concept="reversing a linked list by flipping pointers" -->
## The Idea

Instead of moving data around (like reversing an array), we **flip the direction of the pointers**:

\`\`\`
Before: 1 → 2 → 3 → 4 → None
After:  None ← 1 ← 2 ← 3 ← 4
        (i.e., 4 → 3 → 2 → 1 → None)
\`\`\`

## The Three-Pointer Technique

We need three pointers:
- \`prev\` — the node behind us (starts as None)
- \`current\` — the node we're processing
- \`next_node\` — saved reference so we don't lose the rest of the list

\`\`\`python
def reverse_list(head):
    prev = None
    current = head

    while current:
        next_node = current.next  # Save the next node
        current.next = prev       # Flip the pointer
        prev = current             # Move prev forward
        current = next_node        # Move current forward

    return prev  # prev is now the new head
\`\`\`

**Step-by-step with [1, 2, 3]:**

| Step | prev | current | next_node | List state |
|------|------|---------|-----------|-----------|
| Start | None | 1 | - | 1→2→3→None |
| 1 | 1 | 2 | 2 | None←1  2→3→None |
| 2 | 2 | 3 | 3 | None←1←2  3→None |
| 3 | 3 | None | None | None←1←2←3 |

Return \`prev\` = node 3, the new head.

<!-- voice:key_insight insight="The three-pointer technique (prev, current, next) is the standard pattern for in-place linked list reversal" -->

## Java Version

\`\`\`java
public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    while (current != null) {
        ListNode next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    return prev;
}
\`\`\`

**Identical logic.** The three-pointer pattern is universal.

## Common Mistakes

1. **Forgetting to save \`next_node\`** — if you flip \`current.next = prev\` first, you lose the reference to the rest of the list
2. **Returning \`current\` instead of \`prev\`** — when the loop ends, \`current\` is None. The new head is \`prev\`
3. **Not handling empty list** — if \`head\` is None, the loop doesn't execute and we return \`prev\` = None (correct!)

<!-- voice:section_check concept="common reversal mistakes" -->

## Variations

- **Reverse a sublist** (positions m to n) — same logic, just start/stop in the middle
- **Reverse in groups of k** — reverse every k nodes, keep the rest
- **Palindrome check** — reverse the second half, compare with first half

## Try It Yourself

Implement the reverse function and a function that checks if a linked list is a palindrome by reversing the second half.
`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def list_to_linked(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    current = head
    for val in arr[1:]:
        current.next = ListNode(val)
        current = current.next
    return head


def linked_to_list(head):
    result = []
    current = head
    while current:
        result.append(current.val)
        current = current.next
    return result


def reverse_list(head):
    """
    Reverse a singly linked list in-place.

    Args:
        head: Head node of the linked list

    Returns:
        New head of the reversed list

    Example:
        1 → 2 → 3 → None  =>  3 → 2 → 1 → None
    """
    # TODO: Use three pointers: prev, current, next_node
    # Flip current.next to point to prev, then advance all three
    pass


def is_palindrome(head):
    """
    Check if a linked list is a palindrome.

    Args:
        head: Head node of the linked list

    Returns:
        True if the list reads the same forwards and backwards

    Example:
        1 → 2 → 1 → None  =>  True
        1 → 2 → 3 → None  =>  False

    Hint: Find the middle, reverse the second half, compare.
    """
    # TODO: Step 1 — find the middle using slow/fast pointers
    # TODO: Step 2 — reverse the second half
    # TODO: Step 3 — compare the two halves
    pass


# ─── Test Cases ───
# Do not modify below this line

head = list_to_linked([1, 2, 3, 4, 5])
print(linked_to_list(reverse_list(head)))
# Expected: [5, 4, 3, 2, 1]

print(linked_to_list(reverse_list(None)))
# Expected: []

head = list_to_linked([42])
print(linked_to_list(reverse_list(head)))
# Expected: [42]

print(is_palindrome(list_to_linked([1, 2, 2, 1])))
# Expected: True

print(is_palindrome(list_to_linked([1, 2, 3])))
# Expected: False

print(is_palindrome(list_to_linked([1])))
# Expected: True
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def list_to_linked(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    current = head
    for val in arr[1:]:
        current.next = ListNode(val)
        current = current.next
    return head


def linked_to_list(head):
    result = []
    current = head
    while current:
        result.append(current.val)
        current = current.next
    return result


def reverse_list(head):
    """
    Reverse a singly linked list in-place.

    Time Complexity: O(n) — visit each node once
    Space Complexity: O(1) — only pointer variables
    """
    prev = None
    current = head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev


def is_palindrome(head):
    """
    Check if a linked list is a palindrome.

    Time Complexity: O(n) — find middle + reverse + compare
    Space Complexity: O(1) — in-place reversal
    """
    if not head or not head.next:
        return True

    # Step 1: Find the middle using slow/fast pointers
    slow = head
    fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next

    # Step 2: Reverse the second half
    second_half = reverse_list(slow.next)

    # Step 3: Compare first and second halves
    first_half = head
    while second_half:
        if first_half.val != second_half.val:
            return False
        first_half = first_half.next
        second_half = second_half.next

    return True


# ─── Test Cases ───
# Do not modify below this line

head = list_to_linked([1, 2, 3, 4, 5])
print(linked_to_list(reverse_list(head)))
# Expected: [5, 4, 3, 2, 1]

print(linked_to_list(reverse_list(None)))
# Expected: []

head = list_to_linked([42])
print(linked_to_list(reverse_list(head)))
# Expected: [42]

print(is_palindrome(list_to_linked([1, 2, 2, 1])))
# Expected: True

print(is_palindrome(list_to_linked([1, 2, 3])))
# Expected: False

print(is_palindrome(list_to_linked([1])))
# Expected: True
`,
    },
    {
      id: "fast-slow-pointers",
      slug: "fast-slow-pointers",
      title: "Fast & Slow Pointers",
      content: `## The Tortoise and the Hare

The **fast and slow pointer** technique (also called Floyd's algorithm) is one of the most elegant patterns in computer science. Two pointers traverse the list at different speeds:
- **Slow** moves one step at a time
- **Fast** moves two steps at a time

This simple setup solves several problems that seem unrelated.

<!-- voice:section_check concept="fast pointer moves 2x, slow moves 1x" -->
## Problem 1: Find the Middle Node

When \`fast\` reaches the end, \`slow\` is at the middle:

\`\`\`python
def find_middle(head):
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
\`\`\`

**Why it works:** Fast covers twice the distance. When fast finishes n steps, slow has done n/2 — exactly the middle.

\`\`\`
List: 1 → 2 → 3 → 4 → 5 → None

Step 0: slow=1, fast=1
Step 1: slow=2, fast=3
Step 2: slow=3, fast=5  ← fast.next is None, stop

Middle = slow = 3  ✓
\`\`\`

<!-- voice:key_insight insight="When fast reaches the end, slow is at the middle — no need to count the length first" -->

## Problem 2: Detect a Cycle

If the list has a cycle (a node points back to an earlier node), fast and slow will eventually **meet** — like two runners on a circular track.

\`\`\`python
def has_cycle(head):
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
\`\`\`

If there's no cycle, fast reaches the end (None). If there IS a cycle, fast can never escape and will lap slow.

## Java Version

\`\`\`java
public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}
\`\`\`

<!-- voice:section_check concept="cycle detection using fast/slow pointer convergence" -->

## Problem 3: Find the Cycle Start

Once you detect a cycle, you can find WHERE it starts:

\`\`\`python
def find_cycle_start(head):
    slow = head
    fast = head

    # Phase 1: Detect the meeting point
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None  # No cycle

    # Phase 2: Find the start
    # Move one pointer to head, keep the other at meeting point
    # Both move at speed 1 — they meet at the cycle start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next

    return slow  # This is the cycle start node
\`\`\`

**Why Phase 2 works** is a beautiful mathematical proof involving modular arithmetic. The key fact: the distance from head to cycle start equals the distance from meeting point to cycle start (going around the cycle).

## Summary of Fast/Slow Applications

| Problem | How | Time | Space |
|---------|-----|------|-------|
| Find middle | slow=1x, fast=2x, return slow | O(n) | O(1) |
| Detect cycle | slow=1x, fast=2x, check if they meet | O(n) | O(1) |
| Find cycle start | Detect + reset slow to head | O(n) | O(1) |
| kth from end | advance fast k steps, then both | O(n) | O(1) |

## Try It Yourself

Implement middle-finding and cycle detection.
`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def list_to_linked(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    current = head
    for val in arr[1:]:
        current.next = ListNode(val)
        current = current.next
    return head


def find_middle(head):
    """
    Find the middle node of a linked list.
    For even-length lists, return the second middle node.

    Args:
        head: Head node of the linked list

    Returns:
        Value of the middle node, or None if list is empty

    Example:
        1 → 2 → 3 → 4 → 5 → None  =>  3
        1 → 2 → 3 → 4 → None      =>  3
    """
    # TODO: Use fast and slow pointers
    # slow moves 1 step, fast moves 2 steps
    # When fast reaches the end, slow is at the middle
    pass


def has_cycle(head):
    """
    Detect if a linked list has a cycle.

    Args:
        head: Head node of the linked list

    Returns:
        True if the list contains a cycle, False otherwise

    Must use O(1) space (no sets or lists to track visited nodes).
    """
    # TODO: Use fast and slow pointers
    # If they ever meet (slow == fast), there is a cycle
    # If fast reaches None, there is no cycle
    pass


# ─── Test Cases ───
# Do not modify below this line

print(find_middle(list_to_linked([1, 2, 3, 4, 5])))
# Expected: 3

print(find_middle(list_to_linked([1, 2, 3, 4])))
# Expected: 3

print(find_middle(list_to_linked([1])))
# Expected: 1

print(find_middle(None))
# Expected: None

# Test cycle detection
head = list_to_linked([1, 2, 3, 4, 5])
print(has_cycle(head))
# Expected: False

# Create a cycle: 5 → 3
node = head
while node.next:
    node = node.next
node.next = head.next.next  # 5 points back to 3
print(has_cycle(head))
# Expected: True

print(has_cycle(None))
# Expected: False
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def list_to_linked(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    current = head
    for val in arr[1:]:
        current.next = ListNode(val)
        current = current.next
    return head


def find_middle(head):
    """
    Find the middle node of a linked list.

    Time Complexity: O(n) — one pass
    Space Complexity: O(1) — two pointers
    """
    if not head:
        return None
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow.val


def has_cycle(head):
    """
    Detect if a linked list has a cycle using Floyd's algorithm.

    Time Complexity: O(n) — at most 2n steps before meeting
    Space Complexity: O(1) — only two pointer variables
    """
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False


# ─── Test Cases ───
# Do not modify below this line

print(find_middle(list_to_linked([1, 2, 3, 4, 5])))
# Expected: 3

print(find_middle(list_to_linked([1, 2, 3, 4])))
# Expected: 3

print(find_middle(list_to_linked([1])))
# Expected: 1

print(find_middle(None))
# Expected: None

# Test cycle detection
head = list_to_linked([1, 2, 3, 4, 5])
print(has_cycle(head))
# Expected: False

# Create a cycle: 5 → 3
node = head
while node.next:
    node = node.next
node.next = head.next.next  # 5 points back to 3
print(has_cycle(head))
# Expected: True

print(has_cycle(None))
# Expected: False
`,
    },
    {
      id: "linked-lists-checkpoint",
      slug: "linked-lists-checkpoint",
      title: "Module Checkpoint: Linked Lists",
      content: `## Well Done!

You've completed the Linked Lists module. Linked lists are less common in day-to-day coding than arrays, but they are **interview favorites** because they test pointer manipulation skills.

<!-- voice:section_check concept="module recap" -->
## What You've Mastered

1. **Node-based structure** — each node holds a value and a \`next\` pointer
2. **Traversal** — walking through nodes one at a time
3. **Reversal** — the three-pointer technique (prev, current, next_node)
4. **Fast/Slow pointers** — finding the middle, detecting cycles

## Quick Quiz

**Question 1:** What is the time complexity of accessing the kth element of a singly linked list?

A) O(1)
B) O(k)
C) O(n)
D) O(log n)

**Question 2:** When reversing a linked list, why do we need to save \`next_node = current.next\` before flipping the pointer?

A) To maintain the original list as a backup
B) Because after flipping \`current.next\`, we lose the reference to the rest of the list
C) To count how many nodes we've processed
D) Because Python garbage collects unreferenced nodes immediately

**Question 3:** In the fast/slow pointer technique, slow moves 1 step and fast moves 2 steps. When fast reaches the end of a 10-node list, where is slow?

A) Node 3
B) Node 5
C) Node 7
D) Node 10

**Question 4:** How does cycle detection with fast/slow pointers work? Why must they eventually meet if a cycle exists?

**Question 5:** You need to check if a linked list is a palindrome in O(n) time and O(1) space. Outline the steps (no code needed).

## Voice Summary

Explain the three-pointer reversal technique step by step to your voice coach. Then describe when you'd use fast/slow pointers instead of counting nodes to find the length.
`,
    },
  ],
};
