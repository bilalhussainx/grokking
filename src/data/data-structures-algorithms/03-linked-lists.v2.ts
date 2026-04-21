import { Module } from "../types";

export const linkedListsModule: Module = {
  id: "linked-lists",
  title: "Linked Lists",
  description: "Master singly and doubly linked lists, core operations, and classic interview problems involving pointer manipulation.",
  lessons: [
    {
      id: "linked-lists-singly",
      slug: "singly-linked-list",
      title: "Singly Linked List",
      content: `## Singly Linked List

A **singly linked list** is a linear data structure where each node contains a value and a pointer to the next node. The last node points to \`None\`.

\`\`\`mermaid
graph LR
    A["[10|next]"] -->|ptr| B["[20|next]"]
    B -->|ptr| C["[30|next]"]
    C -->|ptr| D["null"]
    style A fill:#6366f1,color:#fff
    style B fill:#6366f1,color:#fff
    style C fill:#6366f1,color:#fff
    style D fill:#ef4444,color:#fff
\`\`\`

### Structure

\`\`\`
[value|next] -> [value|next] -> [value|next] -> None
    head                            tail
\`\`\`

### Key Characteristics

| Property | Detail |
|----------|--------|
| Access | O(n) — must traverse from head |
| Insert at head | O(1) |
| Insert at tail | O(n) without tail pointer, O(1) with |
| Delete head | O(1) |
| Search | O(n) |

### When to Use

- When you need frequent insertions/deletions at the beginning
- When you do not need random access by index
- As a building block for stacks and queues

### Problem

Implement a singly linked list with \`append\`, \`prepend\`, \`delete\`, and \`to_list\` operations.`,
      starterCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

class SinglyLinkedList:
    def __init__(self):
        self.head = None

    def prepend(self, val):
        # TODO: Insert at the beginning
        pass

    def append(self, val):
        # TODO: Insert at the end
        pass

    def delete(self, val):
        # TODO: Delete first occurrence of val
        pass

    def to_list(self):
        # TODO: Return all values as a Python list
        pass

# Test cases
sll = SinglyLinkedList()
sll.append(1)
sll.append(2)
sll.append(3)
print(sll.to_list())     # Expected: [1, 2, 3]
sll.prepend(0)
print(sll.to_list())     # Expected: [0, 1, 2, 3]
sll.delete(2)
print(sll.to_list())     # Expected: [0, 1, 3]
sll.delete(0)
print(sll.to_list())     # Expected: [1, 3]
`,
      solutionCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

class SinglyLinkedList:
    def __init__(self):
        self.head = None

    def prepend(self, val):
        node = Node(val)
        node.next = self.head
        self.head = node

    def append(self, val):
        node = Node(val)
        if not self.head:
            self.head = node
            return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = node

    def delete(self, val):
        if not self.head:
            return
        if self.head.val == val:
            self.head = self.head.next
            return
        curr = self.head
        while curr.next:
            if curr.next.val == val:
                curr.next = curr.next.next
                return
            curr = curr.next

    def to_list(self):
        result = []
        curr = self.head
        while curr:
            result.append(curr.val)
            curr = curr.next
        return result

# Test cases
sll = SinglyLinkedList()
sll.append(1)
sll.append(2)
sll.append(3)
print(sll.to_list())     # Expected: [1, 2, 3]
sll.prepend(0)
print(sll.to_list())     # Expected: [0, 1, 2, 3]
sll.delete(2)
print(sll.to_list())     # Expected: [0, 1, 3]
sll.delete(0)
print(sll.to_list())     # Expected: [1, 3]
`,
    },
    {
      id: "linked-lists-doubly",
      slug: "doubly-linked-list",
      title: "Doubly Linked List",
      content: `## Doubly Linked List

A **doubly linked list** extends the singly linked list by adding a \`prev\` pointer to each node, allowing traversal in both directions.

### Structure

\`\`\`
None <- [prev|value|next] <-> [prev|value|next] <-> [prev|value|next] -> None
            head                                         tail
\`\`\`

### Advantages Over Singly Linked

\`\`\`mermaid
graph LR
    N["null"] ---|prev| A["Node A"]
    A -->|next| B["Node B"]
    B -->|prev| A
    B -->|next| C["Node C"]
    C -->|prev| B
    C -->|next| N2["null"]
    style A fill:#6366f1,color:#fff
    style B fill:#6366f1,color:#fff
    style C fill:#6366f1,color:#fff
    style N fill:#ef4444,color:#fff
    style N2 fill:#ef4444,color:#fff
\`\`\`

- O(1) deletion when you have a reference to the node
- O(1) pop from tail (with tail pointer)
- Bidirectional traversal

### Problem

Implement a doubly linked list with \`push_front\`, \`push_back\`, \`pop_front\`, \`pop_back\`, and \`to_list\`.`,
      starterCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def push_front(self, val):
        # TODO: Insert at head
        pass

    def push_back(self, val):
        # TODO: Insert at tail
        pass

    def pop_front(self):
        # TODO: Remove and return head value
        pass

    def pop_back(self):
        # TODO: Remove and return tail value
        pass

    def to_list(self):
        # TODO: Return all values as a list
        pass

# Test cases
dll = DoublyLinkedList()
dll.push_back(1)
dll.push_back(2)
dll.push_back(3)
print(dll.to_list())     # Expected: [1, 2, 3]
dll.push_front(0)
print(dll.to_list())     # Expected: [0, 1, 2, 3]
print(dll.pop_back())    # Expected: 3
print(dll.pop_front())   # Expected: 0
print(dll.to_list())     # Expected: [1, 2]
`,
      solutionCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def push_front(self, val):
        node = Node(val)
        if not self.head:
            self.head = self.tail = node
        else:
            node.next = self.head
            self.head.prev = node
            self.head = node

    def push_back(self, val):
        node = Node(val)
        if not self.tail:
            self.head = self.tail = node
        else:
            node.prev = self.tail
            self.tail.next = node
            self.tail = node

    def pop_front(self):
        if not self.head:
            return None
        val = self.head.val
        self.head = self.head.next
        if self.head:
            self.head.prev = None
        else:
            self.tail = None
        return val

    def pop_back(self):
        if not self.tail:
            return None
        val = self.tail.val
        self.tail = self.tail.prev
        if self.tail:
            self.tail.next = None
        else:
            self.head = None
        return val

    def to_list(self):
        result = []
        curr = self.head
        while curr:
            result.append(curr.val)
            curr = curr.next
        return result

# Test cases
dll = DoublyLinkedList()
dll.push_back(1)
dll.push_back(2)
dll.push_back(3)
print(dll.to_list())     # Expected: [1, 2, 3]
dll.push_front(0)
print(dll.to_list())     # Expected: [0, 1, 2, 3]
print(dll.pop_back())    # Expected: 3
print(dll.pop_front())   # Expected: 0
print(dll.to_list())     # Expected: [1, 2]
`,
    },
    {
      id: "linked-lists-operations",
      slug: "linked-list-operations",
      title: "Linked List Operations",
      content: `## Linked List Operations

### Problem Statement

Implement three essential linked list operations:

1. **Reverse** a singly linked list in-place
2. **Find the middle** node using the fast/slow pointer technique
3. **Detect a cycle** using Floyd's algorithm

These are fundamental building blocks that appear in many interview problems.

### Examples

\`\`\`
reverse([1, 2, 3, 4, 5]) -> [5, 4, 3, 2, 1]

find_middle([1, 2, 3, 4, 5]) -> 3
find_middle([1, 2, 3, 4]) -> 2

has_cycle(1 -> 2 -> 3 -> 1) -> True
has_cycle(1 -> 2 -> 3 -> None) -> False
\`\`\`

### Key Techniques

\`\`\`mermaid
graph TD
    subgraph "Insert X after A"
    A1["A"] -->|"next (old)"| B1["B"]
    A1 -.->|"1: A.next = X"| X1["X"]
    X1 -.->|"2: X.next = B"| B1
    end
    subgraph "Delete B (A.next = C)"
    A2["A"] -->|"next (old)"| B2["B"]
    B2 -->|"next"| C2["C"]
    A2 -.->|"A.next = C"| C2
    end
    style X1 fill:#4ade80,color:#000
    style B2 fill:#ef4444,color:#fff
\`\`\`

- **Three-pointer reversal**: Use prev, curr, next to reverse links one at a time
- **Fast/slow pointers**: Fast moves 2 steps, slow moves 1. When fast reaches the end, slow is at the middle
- **Floyd's cycle detection**: If fast and slow ever meet, there is a cycle`,
      starterCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def build_list(values):
    if not values:
        return None
    head = Node(values[0])
    curr = head
    for v in values[1:]:
        curr.next = Node(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def reverse_list(head):
    # TODO: Reverse the linked list in-place, return new head
    pass

def find_middle(head):
    # TODO: Return the value of the middle node (slow/fast pointers)
    pass

def has_cycle(head):
    # TODO: Return True if the list has a cycle
    pass

# Test reverse
print(to_list(reverse_list(build_list([1, 2, 3, 4, 5]))))  # Expected: [5, 4, 3, 2, 1]
print(to_list(reverse_list(build_list([1]))))                # Expected: [1]

# Test find middle
print(find_middle(build_list([1, 2, 3, 4, 5])))  # Expected: 3
print(find_middle(build_list([1, 2, 3, 4])))      # Expected: 2

# Test cycle detection
head = build_list([1, 2, 3, 4])
print(has_cycle(head))  # Expected: False
# Create a cycle: 4 -> 2
curr = head
while curr.next:
    curr = curr.next
curr.next = head.next
print(has_cycle(head))  # Expected: True
`,
      solutionCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def build_list(values):
    if not values:
        return None
    head = Node(values[0])
    curr = head
    for v in values[1:]:
        curr.next = Node(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev

def find_middle(head):
    slow = head
    fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    return slow.val

def has_cycle(head):
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False

# Test reverse
print(to_list(reverse_list(build_list([1, 2, 3, 4, 5]))))  # Expected: [5, 4, 3, 2, 1]
print(to_list(reverse_list(build_list([1]))))                # Expected: [1]

# Test find middle
print(find_middle(build_list([1, 2, 3, 4, 5])))  # Expected: 3
print(find_middle(build_list([1, 2, 3, 4])))      # Expected: 2

# Test cycle detection
head = build_list([1, 2, 3, 4])
print(has_cycle(head))  # Expected: False
# Create a cycle: 4 -> 2
curr = head
while curr.next:
    curr = curr.next
curr.next = head.next
print(has_cycle(head))  # Expected: True
`,
    },
    {
      id: "linked-lists-problems",
      slug: "linked-list-problems",
      title: "Linked List Problems",
      content: `## Linked List Problems

### Problem Statement

Solve two classic linked list interview problems:

**Problem 1: Merge Two Sorted Lists**

Given two sorted linked lists, merge them into a single sorted linked list.

\`\`\`
merge([1, 3, 5], [2, 4, 6]) -> [1, 2, 3, 4, 5, 6]
merge([1, 2], [3]) -> [1, 2, 3]
\`\`\`

**Problem 2: Remove N-th Node From End**

Given a linked list, remove the n-th node from the end and return the head.

\`\`\`
remove_nth_from_end([1, 2, 3, 4, 5], 2) -> [1, 2, 3, 5]
remove_nth_from_end([1], 1) -> []
\`\`\`

### Approach

- **Merge**: Use a dummy node and compare heads of both lists
- **Remove N-th**: Use two pointers separated by n nodes

### Complexity

Both problems: O(n) time, O(1) space`,
      starterCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def build_list(values):
    if not values:
        return None
    head = Node(values[0])
    curr = head
    for v in values[1:]:
        curr.next = Node(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def merge_sorted(l1, l2):
    # TODO: Merge two sorted linked lists
    pass

def remove_nth_from_end(head, n):
    # TODO: Remove the n-th node from the end
    pass

# Test merge
print(to_list(merge_sorted(build_list([1, 3, 5]), build_list([2, 4, 6]))))
# Expected: [1, 2, 3, 4, 5, 6]
print(to_list(merge_sorted(build_list([1, 2]), build_list([3]))))
# Expected: [1, 2, 3]
print(to_list(merge_sorted(build_list([]), build_list([1, 2]))))
# Expected: [1, 2]

# Test remove nth from end
print(to_list(remove_nth_from_end(build_list([1, 2, 3, 4, 5]), 2)))
# Expected: [1, 2, 3, 5]
print(to_list(remove_nth_from_end(build_list([1, 2, 3, 4, 5]), 1)))
# Expected: [1, 2, 3, 4]
print(to_list(remove_nth_from_end(build_list([1]), 1)))
# Expected: []
`,
      solutionCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def build_list(values):
    if not values:
        return None
    head = Node(values[0])
    curr = head
    for v in values[1:]:
        curr.next = Node(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def merge_sorted(l1, l2):
    dummy = Node(0)
    curr = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            curr.next = l1
            l1 = l1.next
        else:
            curr.next = l2
            l2 = l2.next
        curr = curr.next
    curr.next = l1 if l1 else l2
    return dummy.next

def remove_nth_from_end(head, n):
    dummy = Node(0)
    dummy.next = head
    fast = dummy
    slow = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        fast = fast.next
        slow = slow.next
    slow.next = slow.next.next
    return dummy.next

# Test merge
print(to_list(merge_sorted(build_list([1, 3, 5]), build_list([2, 4, 6]))))
# Expected: [1, 2, 3, 4, 5, 6]
print(to_list(merge_sorted(build_list([1, 2]), build_list([3]))))
# Expected: [1, 2, 3]
print(to_list(merge_sorted(build_list([]), build_list([1, 2]))))
# Expected: [1, 2]

# Test remove nth from end
print(to_list(remove_nth_from_end(build_list([1, 2, 3, 4, 5]), 2)))
# Expected: [1, 2, 3, 5]
print(to_list(remove_nth_from_end(build_list([1, 2, 3, 4, 5]), 1)))
# Expected: [1, 2, 3, 4]
print(to_list(remove_nth_from_end(build_list([1]), 1)))
# Expected: []
`,
    },
  ],
};
