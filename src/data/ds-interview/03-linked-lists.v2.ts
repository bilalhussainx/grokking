import { Module } from "../types";

export const linkedListsModule: Module = {
  id: "ds-linked-lists",
  title: "Linked Lists",
  description: "Master linked list manipulation — from basic operations to advanced techniques like fast/slow pointers and in-place reversal.",
  lessons: [
    {
      id: "ds-ll-intro",
      slug: "intro-linked-lists",
      title: "Intro to Linked Lists",
      content: `## Intro to Linked Lists

A linked list is a linear data structure where elements are stored in nodes, and each node points to the next. Unlike arrays, linked lists don't use contiguous memory, which gives them unique strengths and weaknesses.

### Why Linked Lists Matter in Interviews

Linked lists test your ability to manipulate pointers carefully. One wrong pointer assignment and your list breaks. Interviewers love them because they reveal how precisely you think about state.

### Array vs. Linked List

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access by index | O(1) | O(n) |
| Insert at front | O(n) | O(1) |
| Insert at end | O(1)* | O(1)** |
| Delete by value | O(n) | O(n) search + O(1) delete |
| Memory | Contiguous | Scattered |

*Amortized. **With tail pointer.

### Node Structure

\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
\`\`\`

### The Dummy Head Technique

Many linked list problems become simpler with a **dummy head** (sentinel node) at the front. This eliminates edge cases when the head itself needs to change.

\`\`\`python
dummy = ListNode(0)
dummy.next = head
# ... operations ...
return dummy.next  # New head
\`\`\`

### Common Mistakes

1. **Losing references**: Always save \`next\` before modifying pointers.
2. **Null pointer access**: Check \`node is not None\` before accessing \`node.next\`.
3. **Not updating head**: After modifications, the head might have changed.
4. **Infinite loops**: If you accidentally create a cycle, traversal never ends.

### Drawing Helps

Always draw out the list and pointer changes step by step. Even experienced engineers draw linked list diagrams. It prevents most bugs.

Implement basic linked list operations: create, append, delete, and search.`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def create_linked_list(values: list[int]) -> ListNode:
    """Create a linked list from a list of values. Return head."""
    # TODO: Handle empty list
    # TODO: Create head node from first value
    # TODO: Iterate through remaining values, linking nodes
    pass


def to_list(head: ListNode) -> list[int]:
    """Convert linked list to Python list for easy viewing."""
    # TODO: Traverse and collect values
    pass


def delete_node(head: ListNode, val: int) -> ListNode:
    """
    Delete the first node with the given value.
    Return the (possibly new) head.

    Use dummy head to handle edge cases.
    """
    # TODO: Create dummy node pointing to head
    # TODO: Find node whose next has the target value
    # TODO: Skip over it by updating pointers
    # TODO: Return dummy.next
    pass


def find_middle(head: ListNode) -> ListNode:
    """
    Find the middle node of a linked list.
    If even length, return the second middle node.

    Use slow/fast pointer technique.
    """
    # TODO: Initialize slow and fast to head
    # TODO: Move slow by 1, fast by 2
    # TODO: When fast reaches end, slow is at middle
    pass


# Test cases
ll = create_linked_list([1, 2, 3, 4, 5])
print(to_list(ll))                          # [1, 2, 3, 4, 5]

ll = delete_node(ll, 3)
print(to_list(ll))                          # [1, 2, 4, 5]

ll = delete_node(ll, 1)
print(to_list(ll))                          # [2, 4, 5]

mid = find_middle(create_linked_list([1, 2, 3, 4, 5]))
print(mid.val)                              # 3

mid = find_middle(create_linked_list([1, 2, 3, 4]))
print(mid.val)                              # 3
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def create_linked_list(values: list[int]) -> ListNode:
    """Create a linked list from a list of values. Return head."""
    if not values:
        return None
    head = ListNode(values[0])
    current = head
    for val in values[1:]:
        current.next = ListNode(val)
        current = current.next
    return head


def to_list(head: ListNode) -> list[int]:
    """Convert linked list to Python list for easy viewing."""
    result = []
    current = head
    while current:
        result.append(current.val)
        current = current.next
    return result


def delete_node(head: ListNode, val: int) -> ListNode:
    """
    Delete the first node with the given value.
    Return the (possibly new) head.

    Use dummy head to handle edge cases.
    """
    dummy = ListNode(0)
    dummy.next = head
    current = dummy

    while current.next:
        if current.next.val == val:
            current.next = current.next.next  # Skip the target node
            break
        current = current.next

    return dummy.next


def find_middle(head: ListNode) -> ListNode:
    """
    Find the middle node of a linked list.
    If even length, return the second middle node.

    Use slow/fast pointer technique.
    """
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow


# Test cases
ll = create_linked_list([1, 2, 3, 4, 5])
print(to_list(ll))                          # [1, 2, 3, 4, 5]

ll = delete_node(ll, 3)
print(to_list(ll))                          # [1, 2, 4, 5]

ll = delete_node(ll, 1)
print(to_list(ll))                          # [2, 4, 5]

mid = find_middle(create_linked_list([1, 2, 3, 4, 5]))
print(mid.val)                              # 3

mid = find_middle(create_linked_list([1, 2, 3, 4]))
print(mid.val)                              # 3
`,
    },
    {
      id: "ds-singly-doubly",
      slug: "singly-vs-doubly",
      title: "Singly vs Doubly Linked Lists",
      content: `## Singly vs Doubly Linked Lists

Understanding when to use singly vs doubly linked lists is important for both interviews and system design.

### Singly Linked List

Each node has one pointer: \`next\`. You can only traverse forward.

**Pros**: Less memory per node (one pointer vs two). Simpler implementation.
**Cons**: Cannot traverse backward. Deleting a node requires access to the **previous** node.

### Doubly Linked List

Each node has two pointers: \`prev\` and \`next\`. You can traverse in both directions.

**Pros**: O(1) deletion when you have a reference to the node. Can traverse backward.
**Cons**: More memory, more pointers to maintain.

### When to Use Which

- **Singly**: Simple forward traversal, stack implementation, basic linked list problems.
- **Doubly**: LRU cache, browser history, undo/redo, any problem needing bidirectional traversal.

### Implementing a Doubly Linked List

The key difference is managing two pointers on every insert and delete:

**Insert after node A**:
1. Create new node N
2. N.next = A.next
3. N.prev = A
4. If A.next exists: A.next.prev = N
5. A.next = N

**Delete node N**:
1. N.prev.next = N.next
2. If N.next exists: N.next.prev = N.prev

### Sentinel Nodes for Doubly Linked Lists

Using dummy head and tail sentinels eliminates all null checks:
\`\`\`
dummy_head <-> node1 <-> node2 <-> ... <-> dummy_tail
\`\`\`

Every real node always has valid prev and next pointers, so insertion and deletion never need special cases.

### Interview Insight

Most interview problems use singly linked lists. Doubly linked lists appear in:
- LRU Cache (previous lesson)
- Design problems (browser history, text editor)
- Problems where you need to delete a node in O(1) given a reference to it

Build a complete doubly linked list class with insert, delete, and bidirectional traversal.`,
      starterCode: `class DListNode:
    def __init__(self, val=0):
        self.val = val
        self.prev = None
        self.next = None


class DoublyLinkedList:
    def __init__(self):
        """Initialize with dummy head and tail sentinels."""
        # TODO: Create head and tail sentinel nodes
        # TODO: Link them together
        self.size = 0

    def add_front(self, val: int) -> None:
        """Add a node with given value at the front."""
        # TODO: Create new node
        # TODO: Insert between head sentinel and head.next
        # TODO: Update all four pointers
        pass

    def add_back(self, val: int) -> None:
        """Add a node with given value at the back."""
        # TODO: Create new node
        # TODO: Insert between tail.prev and tail sentinel
        pass

    def remove_node(self, node: DListNode) -> int:
        """Remove a specific node and return its value."""
        # TODO: Update prev and next pointers to skip this node
        pass

    def remove_front(self) -> int:
        """Remove and return value from the front. Raise error if empty."""
        # TODO: Check if empty
        # TODO: Remove head.next (first real node)
        pass

    def remove_back(self) -> int:
        """Remove and return value from the back. Raise error if empty."""
        # TODO: Check if empty
        # TODO: Remove tail.prev (last real node)
        pass

    def to_list_forward(self) -> list[int]:
        """Return values from front to back."""
        # TODO: Traverse from head.next to tail
        pass

    def to_list_backward(self) -> list[int]:
        """Return values from back to front."""
        # TODO: Traverse from tail.prev to head
        pass


# Test cases
dll = DoublyLinkedList()
dll.add_back(1)
dll.add_back(2)
dll.add_back(3)
dll.add_front(0)
print(dll.to_list_forward())    # [0, 1, 2, 3]
print(dll.to_list_backward())   # [3, 2, 1, 0]

dll.remove_front()
print(dll.to_list_forward())    # [1, 2, 3]

dll.remove_back()
print(dll.to_list_forward())    # [1, 2]

print(dll.size)                  # 2
`,
      solutionCode: `class DListNode:
    def __init__(self, val=0):
        self.val = val
        self.prev = None
        self.next = None


class DoublyLinkedList:
    def __init__(self):
        """Initialize with dummy head and tail sentinels."""
        self.head = DListNode()  # Sentinel
        self.tail = DListNode()  # Sentinel
        self.head.next = self.tail
        self.tail.prev = self.head
        self.size = 0

    def add_front(self, val: int) -> None:
        """Add a node with given value at the front."""
        node = DListNode(val)
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node
        self.size += 1

    def add_back(self, val: int) -> None:
        """Add a node with given value at the back."""
        node = DListNode(val)
        node.prev = self.tail.prev
        node.next = self.tail
        self.tail.prev.next = node
        self.tail.prev = node
        self.size += 1

    def remove_node(self, node: DListNode) -> int:
        """Remove a specific node and return its value."""
        node.prev.next = node.next
        node.next.prev = node.prev
        self.size -= 1
        return node.val

    def remove_front(self) -> int:
        """Remove and return value from the front. Raise error if empty."""
        if self.size == 0:
            raise IndexError("List is empty")
        return self.remove_node(self.head.next)

    def remove_back(self) -> int:
        """Remove and return value from the back. Raise error if empty."""
        if self.size == 0:
            raise IndexError("List is empty")
        return self.remove_node(self.tail.prev)

    def to_list_forward(self) -> list[int]:
        """Return values from front to back."""
        result = []
        current = self.head.next
        while current != self.tail:
            result.append(current.val)
            current = current.next
        return result

    def to_list_backward(self) -> list[int]:
        """Return values from back to front."""
        result = []
        current = self.tail.prev
        while current != self.head:
            result.append(current.val)
            current = current.prev
        return result


# Test cases
dll = DoublyLinkedList()
dll.add_back(1)
dll.add_back(2)
dll.add_back(3)
dll.add_front(0)
print(dll.to_list_forward())    # [0, 1, 2, 3]
print(dll.to_list_backward())   # [3, 2, 1, 0]

dll.remove_front()
print(dll.to_list_forward())    # [1, 2, 3]

dll.remove_back()
print(dll.to_list_forward())    # [1, 2]

print(dll.size)                  # 2
`,
    },
    {
      id: "ds-fast-slow",
      slug: "fast-slow-pointers",
      title: "Fast & Slow Pointers",
      content: `## Fast & Slow Pointers

The fast and slow pointer technique (also called Floyd's Tortoise and Hare) is one of the most elegant patterns in linked list problems. It solves problems that seem impossible without extra space.

### The Core Idea

Use two pointers moving at different speeds. The **slow** pointer moves one step at a time. The **fast** pointer moves two steps. This creates a predictable relationship between their positions.

### Application 1: Find the Middle

When fast reaches the end, slow is at the middle. This works because fast covers twice the distance.

\`\`\`
1 -> 2 -> 3 -> 4 -> 5
s
f

1 -> 2 -> 3 -> 4 -> 5
          s
                    f
\`\`\`

Slow is at node 3 — the middle.

### Application 2: Detect a Cycle

If there's a cycle, the fast pointer will eventually "lap" the slow pointer and they'll meet. If there's no cycle, fast reaches null.

**Why do they meet?** Once both pointers are in the cycle, fast gains one position on slow per step. So the gap shrinks by 1 each iteration until they collide.

### Application 3: Find Cycle Start

After detecting a cycle (meeting point), move one pointer back to the head. Now advance both by one step. Where they meet again is the **start of the cycle**.

**Mathematical proof**: Let the distance from head to cycle start be \`a\`, from cycle start to meeting point be \`b\`, and the remaining cycle length be \`c\`. At meeting: slow traveled \`a + b\`, fast traveled \`a + b + c + b\`. Since fast = 2 * slow: \`a + 2b + c = 2(a + b)\`, so \`c = a\`. Thus moving from head and from meeting point converges at the cycle start.

### Application 4: Check Palindrome

1. Find middle with slow/fast.
2. Reverse second half.
3. Compare first half with reversed second half.
4. (Optional) Restore the list.

### When to Use

- Any problem involving the "middle" of a linked list
- Cycle detection or finding the start of a cycle
- Problems where you need to process the list in halves

Implement cycle detection and palindrome checking for linked lists.`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def has_cycle(head: ListNode) -> bool:
    """
    Detect if a linked list has a cycle.

    Time: O(n), Space: O(1)
    """
    # TODO: Initialize slow and fast to head
    # TODO: While fast and fast.next exist:
    #   - Move slow by 1, fast by 2
    #   - If they meet, return True
    # TODO: Return False (fast reached end)
    pass


def find_cycle_start(head: ListNode) -> ListNode:
    """
    Find the node where a cycle begins. Return None if no cycle.

    Time: O(n), Space: O(1)
    """
    # TODO: Detect cycle using slow/fast
    # TODO: If cycle found, reset one pointer to head
    # TODO: Move both by 1 step until they meet — that's the cycle start
    pass


def is_palindrome(head: ListNode) -> bool:
    """
    Check if a linked list is a palindrome.

    Approach: Find middle, reverse second half, compare.
    Time: O(n), Space: O(1)
    """
    # TODO: Find middle using slow/fast
    # TODO: Reverse the second half of the list
    # TODO: Compare first half with reversed second half
    # TODO: Return True if all values match
    pass


# Helper to create list
def make_list(vals):
    if not vals:
        return None
    head = ListNode(vals[0])
    curr = head
    for v in vals[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head


# Test has_cycle
ll = make_list([1, 2, 3, 4])
print(has_cycle(ll))  # False

# Create a cycle: 4 -> 2
node = ll
while node.next:
    node = node.next
node.next = ll.next  # 4 points to 2
print(has_cycle(ll))  # True

# Test find_cycle_start
start = find_cycle_start(ll)
print(start.val)  # 2

# Test palindrome
print(is_palindrome(make_list([1, 2, 2, 1])))    # True
print(is_palindrome(make_list([1, 2, 3, 2, 1]))) # True
print(is_palindrome(make_list([1, 2, 3])))        # False
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def has_cycle(head: ListNode) -> bool:
    """
    Detect if a linked list has a cycle.

    Time: O(n), Space: O(1)
    """
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False


def find_cycle_start(head: ListNode) -> ListNode:
    """
    Find the node where a cycle begins. Return None if no cycle.

    Time: O(n), Space: O(1)
    """
    slow = fast = head

    # Phase 1: Detect cycle
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None  # No cycle

    # Phase 2: Find start of cycle
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    return slow


def is_palindrome(head: ListNode) -> bool:
    """
    Check if a linked list is a palindrome.

    Approach: Find middle, reverse second half, compare.
    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return True

    # Step 1: Find middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next

    # Step 2: Reverse second half (starting from slow.next)
    prev = None
    curr = slow.next
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    # prev is now head of reversed second half

    # Step 3: Compare first half with reversed second half
    left = head
    right = prev
    while right:
        if left.val != right.val:
            return False
        left = left.next
        right = right.next

    return True


# Helper to create list
def make_list(vals):
    if not vals:
        return None
    head = ListNode(vals[0])
    curr = head
    for v in vals[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head


# Test has_cycle
ll = make_list([1, 2, 3, 4])
print(has_cycle(ll))  # False

# Create a cycle: 4 -> 2
node = ll
while node.next:
    node = node.next
node.next = ll.next  # 4 points to 2
print(has_cycle(ll))  # True

# Test find_cycle_start
start = find_cycle_start(ll)
print(start.val)  # 2

# Test palindrome
print(is_palindrome(make_list([1, 2, 2, 1])))    # True
print(is_palindrome(make_list([1, 2, 3, 2, 1]))) # True
print(is_palindrome(make_list([1, 2, 3])))        # False
`,
    },
    {
      id: "ds-reverse-ll",
      slug: "reversing-linked-list",
      title: "Reversing (Iterative & Recursive)",
      content: `## Reversing Linked Lists (Iterative & Recursive)

Reversing a linked list is the single most fundamental linked list operation. It appears as a standalone problem and as a subroutine in dozens of others (palindrome check, reverse in groups, reorder list).

### Iterative Reversal

The iterative approach uses three pointers: \`prev\`, \`curr\`, and \`next\`.

**Algorithm**:
1. Initialize \`prev = None\`, \`curr = head\`.
2. While \`curr\` is not None:
   a. Save \`next = curr.next\`
   b. Reverse the pointer: \`curr.next = prev\`
   c. Advance: \`prev = curr\`, \`curr = next\`
3. Return \`prev\` (new head).

**Visualization**:
\`\`\`
Step 0: None <- 1    2 -> 3 -> 4
              prev  curr
Step 1: None <- 1 <- 2    3 -> 4
                    prev  curr
Step 2: None <- 1 <- 2 <- 3    4
                          prev  curr
Step 3: None <- 1 <- 2 <- 3 <- 4
                               prev  curr=None
\`\`\`

### Recursive Reversal

The recursive approach is more elegant but harder to trace:

1. **Base case**: If head is None or head.next is None, return head.
2. **Recurse**: \`new_head = reverse(head.next)\`
3. **Reverse pointer**: \`head.next.next = head\`
4. **Clean up**: \`head.next = None\`
5. Return \`new_head\`.

### Reverse a Sublist (Between Positions)

A common variant: reverse nodes from position \`left\` to \`right\`. This requires:
1. Traverse to the node before position \`left\`.
2. Reverse the sublist of length \`right - left + 1\`.
3. Reconnect the reversed portion to the rest.

### Reverse in Groups of K

Another popular variant: reverse every k nodes. If the last group has fewer than k nodes, leave them as-is (or reverse — problem specifies).

This combines counting, reversing, and reconnecting — all fundamental skills.

### Interview Tips

- Always draw the pointer changes step by step.
- The iterative version is safer (no stack overflow risk).
- Mention both approaches — interviewers may ask for both.
- Practice the "reverse between positions" variant thoroughly.

Implement iterative reversal, recursive reversal, and reverse-between-positions.`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def make_list(vals):
    if not vals: return None
    head = ListNode(vals[0])
    curr = head
    for v in vals[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result


def reverse_iterative(head: ListNode) -> ListNode:
    """
    Reverse a linked list iteratively.
    Time: O(n), Space: O(1)
    """
    # TODO: Use prev, curr, next pointers
    # TODO: Reverse each pointer as you traverse
    pass


def reverse_recursive(head: ListNode) -> ListNode:
    """
    Reverse a linked list recursively.
    Time: O(n), Space: O(n) — call stack
    """
    # TODO: Base case: empty or single node
    # TODO: Recursively reverse the rest
    # TODO: head.next.next = head, head.next = None
    pass


def reverse_between(head: ListNode, left: int, right: int) -> ListNode:
    """
    Reverse nodes from position left to right (1-indexed).
    Example: 1->2->3->4->5, left=2, right=4 → 1->4->3->2->5

    Time: O(n), Space: O(1)
    """
    # TODO: Use dummy head
    # TODO: Find the node before position 'left'
    # TODO: Reverse 'right - left' links
    # TODO: Reconnect
    pass


# Test cases
print(to_list(reverse_iterative(make_list([1,2,3,4,5]))))
# [5, 4, 3, 2, 1]

print(to_list(reverse_recursive(make_list([1,2,3,4,5]))))
# [5, 4, 3, 2, 1]

print(to_list(reverse_between(make_list([1,2,3,4,5]), 2, 4)))
# [1, 4, 3, 2, 5]

print(to_list(reverse_between(make_list([5]), 1, 1)))
# [5]
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def make_list(vals):
    if not vals: return None
    head = ListNode(vals[0])
    curr = head
    for v in vals[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result


def reverse_iterative(head: ListNode) -> ListNode:
    """
    Reverse a linked list iteratively.
    Time: O(n), Space: O(1)
    """
    prev = None
    curr = head
    while curr:
        nxt = curr.next      # Save next
        curr.next = prev     # Reverse pointer
        prev = curr          # Advance prev
        curr = nxt           # Advance curr
    return prev  # New head


def reverse_recursive(head: ListNode) -> ListNode:
    """
    Reverse a linked list recursively.
    Time: O(n), Space: O(n) — call stack
    """
    # Base case: empty or single node
    if not head or not head.next:
        return head

    # Recursively reverse the rest of the list
    new_head = reverse_recursive(head.next)

    # head.next is the last node of the reversed sublist
    # Make it point back to head
    head.next.next = head
    head.next = None  # Head is now the tail

    return new_head


def reverse_between(head: ListNode, left: int, right: int) -> ListNode:
    """
    Reverse nodes from position left to right (1-indexed).
    Example: 1->2->3->4->5, left=2, right=4 → 1->4->3->2->5

    Time: O(n), Space: O(1)
    """
    dummy = ListNode(0)
    dummy.next = head

    # Step 1: Find the node before the 'left' position
    pre = dummy
    for _ in range(left - 1):
        pre = pre.next

    # Step 2: Reverse from left to right
    # 'start' is the first node of the sublist to reverse
    start = pre.next
    then = start.next

    for _ in range(right - left):
        # Move 'then' to the position right after 'pre'
        start.next = then.next
        then.next = pre.next
        pre.next = then
        then = start.next

    return dummy.next


# Test cases
print(to_list(reverse_iterative(make_list([1,2,3,4,5]))))
# [5, 4, 3, 2, 1]

print(to_list(reverse_recursive(make_list([1,2,3,4,5]))))
# [5, 4, 3, 2, 1]

print(to_list(reverse_between(make_list([1,2,3,4,5]), 2, 4)))
# [1, 4, 3, 2, 5]

print(to_list(reverse_between(make_list([5]), 1, 1)))
# [5]
`,
    },
    {
      id: "ds-merge-sort-ll",
      slug: "merge-sort-linked-list",
      title: "Merge & Sort Linked Lists",
      content: `## Merge & Sort Linked Lists

Merging and sorting linked lists are critical operations that combine multiple techniques: finding the middle, reversing, and careful pointer manipulation.

### Merge Two Sorted Lists

Given two sorted linked lists, merge them into one sorted list. This is the linked list equivalent of the merge step in merge sort.

**Algorithm**:
1. Use a dummy head node.
2. Compare current nodes of both lists.
3. Append the smaller one to result, advance that pointer.
4. When one list is exhausted, append the remainder of the other.

This runs in O(n + m) time and O(1) space (just reusing existing nodes).

### Merge Sort on Linked Lists

Merge sort is the ideal sorting algorithm for linked lists because:
- It doesn't need random access (unlike quicksort's partitioning).
- The merge step is natural for linked lists (O(1) space).
- Splitting at the middle is easy with fast/slow pointers.

**Algorithm**:
1. **Base case**: List has 0 or 1 nodes — already sorted.
2. **Split**: Find middle with slow/fast pointers. Cut the list in two.
3. **Recurse**: Sort each half.
4. **Merge**: Merge the two sorted halves.

Time: O(n log n). Space: O(log n) for the recursion stack.

### Intersection of Two Lists

Find the node where two linked lists intersect (share the same nodes from that point onward).

**Approach**:
1. Get lengths of both lists.
2. Advance the longer list's pointer by the difference.
3. Walk both pointers until they meet.

Or the elegant two-pointer trick: pointer A walks list A then list B; pointer B walks list B then list A. They meet at the intersection because they cover the same total distance.

### Interview Frequency

- Merge two sorted lists: extremely common (easy category).
- Sort a linked list: common (medium category).
- Merge K sorted lists: common (hard category) — covered in the heaps module.

Implement merge two sorted lists and merge sort for linked lists.`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def make_list(vals):
    if not vals: return None
    head = ListNode(vals[0])
    curr = head
    for v in vals[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result


def merge_two_sorted(l1: ListNode, l2: ListNode) -> ListNode:
    """
    Merge two sorted linked lists into one sorted list.
    Time: O(n + m), Space: O(1)
    """
    # TODO: Create dummy head
    # TODO: While both lists have nodes, append smaller
    # TODO: Append remaining nodes from non-empty list
    # TODO: Return dummy.next
    pass


def sort_list(head: ListNode) -> ListNode:
    """
    Sort a linked list using merge sort.
    Time: O(n log n), Space: O(log n)
    """
    # TODO: Base case — 0 or 1 nodes
    # TODO: Find middle with slow/fast pointers
    # TODO: Split list into two halves
    # TODO: Recursively sort each half
    # TODO: Merge the sorted halves
    pass


def get_intersection(headA: ListNode, headB: ListNode) -> ListNode:
    """
    Find the intersection node of two linked lists.
    Return None if no intersection.

    Two-pointer approach.
    Time: O(n + m), Space: O(1)
    """
    # TODO: Initialize pointers to each head
    # TODO: When a pointer reaches end, redirect to other list's head
    # TODO: They meet at intersection or both become None
    pass


# Test cases
print(to_list(merge_two_sorted(make_list([1,3,5]), make_list([2,4,6]))))
# [1, 2, 3, 4, 5, 6]

print(to_list(sort_list(make_list([4, 2, 1, 3]))))
# [1, 2, 3, 4]

print(to_list(sort_list(make_list([5, 1, 4, 2, 8]))))
# [1, 2, 4, 5, 8]

# Test intersection
shared = make_list([8, 10])
a = ListNode(3)
a.next = ListNode(7)
a.next.next = shared
b = ListNode(99)
b.next = shared
result = get_intersection(a, b)
print(result.val if result else None)  # 8
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def make_list(vals):
    if not vals: return None
    head = ListNode(vals[0])
    curr = head
    for v in vals[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result


def merge_two_sorted(l1: ListNode, l2: ListNode) -> ListNode:
    """
    Merge two sorted linked lists into one sorted list.
    Time: O(n + m), Space: O(1)
    """
    dummy = ListNode(0)
    current = dummy

    while l1 and l2:
        if l1.val <= l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next

    # Append remaining nodes
    current.next = l1 if l1 else l2
    return dummy.next


def sort_list(head: ListNode) -> ListNode:
    """
    Sort a linked list using merge sort.
    Time: O(n log n), Space: O(log n)
    """
    # Base case: 0 or 1 nodes
    if not head or not head.next:
        return head

    # Find middle using slow/fast
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    # Split the list into two halves
    mid = slow.next
    slow.next = None  # Cut the connection

    # Recursively sort each half
    left = sort_list(head)
    right = sort_list(mid)

    # Merge sorted halves
    return merge_two_sorted(left, right)


def get_intersection(headA: ListNode, headB: ListNode) -> ListNode:
    """
    Find the intersection node of two linked lists.
    Return None if no intersection.

    Two-pointer approach.
    Time: O(n + m), Space: O(1)
    """
    if not headA or not headB:
        return None

    a, b = headA, headB

    # When one pointer reaches the end, redirect to the other list's head.
    # If they intersect, they'll meet at the intersection.
    # If not, both become None at the same time.
    while a != b:
        a = a.next if a else headB
        b = b.next if b else headA

    return a  # Either the intersection node or None


# Test cases
print(to_list(merge_two_sorted(make_list([1,3,5]), make_list([2,4,6]))))
# [1, 2, 3, 4, 5, 6]

print(to_list(sort_list(make_list([4, 2, 1, 3]))))
# [1, 2, 3, 4]

print(to_list(sort_list(make_list([5, 1, 4, 2, 8]))))
# [1, 2, 4, 5, 8]

# Test intersection
shared = make_list([8, 10])
a = ListNode(3)
a.next = ListNode(7)
a.next.next = shared
b = ListNode(99)
b.next = shared
result = get_intersection(a, b)
print(result.val if result else None)  # 8
`,
    },
    {
      id: "ds-cycle-removal",
      slug: "cycle-detection-removal",
      title: "Cycle Detection & Removal",
      content: `## Cycle Detection & Removal

We covered cycle detection with Floyd's algorithm earlier. Now let's go deeper — removing cycles and understanding the mathematical proof behind the algorithm.

### Floyd's Algorithm Recap

1. **Detection**: Slow moves 1 step, fast moves 2 steps. If they meet, there's a cycle.
2. **Finding start**: Reset one pointer to head. Move both 1 step at a time. They meet at the cycle start.

### Why Does Finding the Start Work?

Let's define:
- **L** = distance from head to cycle start
- **C** = cycle length
- **K** = distance from cycle start to meeting point

At the meeting point:
- Slow traveled: L + K
- Fast traveled: L + K + n*C (for some n >= 1)
- Since fast = 2 * slow: L + K + n*C = 2(L + K)
- Therefore: n*C = L + K, which means L = n*C - K

This means if you walk L steps from the meeting point (going around the cycle as needed), you arrive at the cycle start. And L steps from the head also arrives at the cycle start. So moving one pointer from head and one from meeting point at the same speed — they meet at the cycle start.

### Removing the Cycle

Once you know the cycle start, find the last node in the cycle (the node whose \`next\` points to the cycle start) and set its \`next\` to \`None\`.

**Algorithm**:
1. Find the cycle start node using Floyd's algorithm.
2. Traverse the cycle from the start until you find the node whose \`next\` is the start.
3. Set that node's \`next\` to \`None\`.

### Finding Cycle Length

Once two pointers meet inside the cycle, keep one fixed and move the other one step at a time, counting until they meet again. That count is the cycle length.

### Edge Cases

- **Cycle at head**: The head itself is part of the cycle. The "node before cycle start" is the tail of the cycle, which wraps around to head.
- **Single node cycle**: A node pointing to itself.
- **No cycle**: Always check first.

### Real-World Application

Cycle detection appears in:
- Detecting infinite loops in linked data structures
- Finding repeated states in algorithms (e.g., finding the start of a repeating sequence)
- Detecting cycles in graphs (similar concept)

Implement cycle removal and cycle length calculation.`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def make_list(vals):
    if not vals: return None
    head = ListNode(vals[0])
    curr = head
    for v in vals[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result, seen = [], set()
    while head and id(head) not in seen:
        seen.add(id(head))
        result.append(head.val)
        head = head.next
    return result


def detect_and_remove_cycle(head: ListNode) -> bool:
    """
    Detect and remove a cycle from a linked list.
    Returns True if a cycle was found and removed, False otherwise.

    Time: O(n), Space: O(1)
    """
    # TODO: Use Floyd's algorithm to detect the cycle
    # TODO: If no cycle, return False
    # TODO: Find the cycle start (reset one pointer to head)
    # TODO: Find the last node in the cycle (node before cycle start)
    # TODO: Set its next to None
    # TODO: Return True
    pass


def cycle_length(head: ListNode) -> int:
    """
    Find the length of the cycle in a linked list.
    Returns 0 if no cycle exists.

    Time: O(n), Space: O(1)
    """
    # TODO: Detect cycle using Floyd's algorithm
    # TODO: If no cycle, return 0
    # TODO: From meeting point, count steps to return to same point
    pass


def find_duplicate(nums: list[int]) -> int:
    """
    Find the duplicate number in an array where nums has n+1 integers
    in range [1, n]. Exactly one duplicate exists.

    Treat as linked list: index -> nums[index] is next pointer.
    The duplicate creates a cycle — find the cycle start!

    Time: O(n), Space: O(1)
    """
    # TODO: Phase 1: slow = nums[slow], fast = nums[nums[fast]]
    # TODO: Phase 2: Reset slow to 0, advance both by 1
    # TODO: Meeting point value is the duplicate
    pass


# Test cases
# Test cycle removal
ll = make_list([1, 2, 3, 4, 5])
# Create cycle: 5 -> 3
node = ll
while node.next:
    node = node.next
target = ll.next.next  # Node with val=3
node.next = target

print(detect_and_remove_cycle(ll))  # True
print(to_list(ll))                   # [1, 2, 3, 4, 5]

# Test cycle length
ll2 = make_list([1, 2, 3, 4, 5])
node = ll2
while node.next:
    node = node.next
node.next = ll2.next.next  # 5 -> 3, cycle length = 3
print(cycle_length(ll2))    # 3

# Test find duplicate (Floyd's on array)
print(find_duplicate([1, 3, 4, 2, 2]))  # 2
print(find_duplicate([3, 1, 3, 4, 2]))  # 3
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def make_list(vals):
    if not vals: return None
    head = ListNode(vals[0])
    curr = head
    for v in vals[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result, seen = [], set()
    while head and id(head) not in seen:
        seen.add(id(head))
        result.append(head.val)
        head = head.next
    return result


def detect_and_remove_cycle(head: ListNode) -> bool:
    """
    Detect and remove a cycle from a linked list.
    Returns True if a cycle was found and removed, False otherwise.

    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return False

    # Phase 1: Detect cycle
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return False  # No cycle

    # Phase 2: Find cycle start
    slow = head
    # Special case: cycle starts at head
    if slow == fast:
        # Find the last node in the cycle
        while fast.next != slow:
            fast = fast.next
        fast.next = None
        return True

    while slow.next != fast.next:
        slow = slow.next
        fast = fast.next

    # fast.next is the cycle start, fast is the last node in the cycle
    fast.next = None
    return True


def cycle_length(head: ListNode) -> int:
    """
    Find the length of the cycle in a linked list.
    Returns 0 if no cycle exists.

    Time: O(n), Space: O(1)
    """
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            # Count cycle length
            count = 1
            current = slow.next
            while current != slow:
                count += 1
                current = current.next
            return count
    return 0


def find_duplicate(nums: list[int]) -> int:
    """
    Find the duplicate number in an array where nums has n+1 integers
    in range [1, n]. Exactly one duplicate exists.

    Treat as linked list: index -> nums[index] is next pointer.
    The duplicate creates a cycle — find the cycle start!

    Time: O(n), Space: O(1)
    """
    # Phase 1: Find meeting point
    slow = nums[0]
    fast = nums[nums[0]]
    while slow != fast:
        slow = nums[slow]
        fast = nums[nums[fast]]

    # Phase 2: Find cycle start (the duplicate)
    slow = 0
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]

    return slow


# Test cases
# Test cycle removal
ll = make_list([1, 2, 3, 4, 5])
# Create cycle: 5 -> 3
node = ll
while node.next:
    node = node.next
target = ll.next.next  # Node with val=3
node.next = target

print(detect_and_remove_cycle(ll))  # True
print(to_list(ll))                   # [1, 2, 3, 4, 5]

# Test cycle length
ll2 = make_list([1, 2, 3, 4, 5])
node = ll2
while node.next:
    node = node.next
node.next = ll2.next.next  # 5 -> 3, cycle length = 3
print(cycle_length(ll2))    # 3

# Test find duplicate (Floyd's on array)
print(find_duplicate([1, 3, 4, 2, 2]))  # 2
print(find_duplicate([3, 1, 3, 4, 2]))  # 3
`,
    },
  ],
};
