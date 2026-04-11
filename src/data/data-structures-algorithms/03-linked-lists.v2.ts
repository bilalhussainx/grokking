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

\`\`\`concept
{
  "title": "What is a Singly Linked List?",
  "variant": "mental-model",
  "content": "Think of a singly linked list as a treasure hunt: each clue (node) contains some data and directions to the next clue. You can only move forward—there's no way to go back to the previous clue without starting over from the beginning."
}
\`\`\`

\`\`\`algoviz
{
  "title": "Visualizing a Singly Linked List",
  "type": "linkedlist",
  "data": [10, 20, 30],
  "frames": [
    { "highlight": [0], "label": "Head points to first node with value 10" },
    { "highlight": [1], "label": "Node 10 points to node 20" },
    { "highlight": [2], "label": "Node 20 points to node 30" },
    { "highlight": [], "label": "Node 30 points to None (end of list)" }
  ],
  "speed": 1000
}
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

\`\`\`callout
{
  "type": "warning",
  "title": "Memory Overhead",
  "content": "Each node stores both data and a pointer. On 32-bit systems, that's 4 bytes per pointer—potentially doubling memory usage for small data items compared to arrays."
}
\`\`\`

### When to Use

- When you need frequent insertions/deletions at the beginning
- When you do not need random access by index
- As a building block for stacks and queues

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Strengths",
      "content": "- **Dynamic size**: Grows/shrinks without resizing\\n- **Efficient head operations**: O(1) insert/delete at beginning\\n- **Memory flexibility**: Nodes allocated individually"
    },
    {
      "label": "Weaknesses",
      "content": "- **No random access**: Must traverse from head\\n- **Extra memory**: Each node needs a pointer\\n- **Cache unfriendly**: Nodes scattered in memory"
    }
  ]
}
\`\`\`

### Problem

Implement a singly linked list with \`append\`, \`prepend\`, \`delete\`, and \`to_list\` operations.

\`\`\`playground
{
  "title": "Singly Linked List Implementation",
  "language": "python",
  "code": "class Node:\\n    def __init__(self, val):\\n        self.val = val\\n        self.next = None\\n\\nclass SinglyLinkedList:\\n    def __init__(self):\\n        self.head = None\\n        self.tail = None\\n        self.size = 0\\n\\n    def prepend(self, val):\\n        \\"\\"\\"Insert at head - O(1)\\"\\"\\"\\n        new_node = Node(val)\\n        new_node.next = self.head\\n        self.head = new_node\\n        if not self.tail:\\n            self.tail = new_node\\n        self.size += 1\\n\\n    def append(self, val):\\n        \\"\\"\\"Insert at tail - O(1) with tail pointer\\"\\"\\"\\n        new_node = Node(val)\\n        if not self.head:\\n            self.head = self.tail = new_node\\n        else:\\n            self.tail.next = new_node\\n            self.tail = new_node\\n        self.size += 1\\n\\n    def delete(self, val):\\n        \\"\\"\\"Delete first occurrence - O(n)\\"\\"\\"\\n        if not self.head:\\n            return False\\n        if self.head.val == val:\\n            self.head = self.head.next\\n            if not self.head:\\n                self.tail = None\\n            self.size -= 1\\n            return True\\n        curr = self.head\\n        while curr.next and curr.next.val != val:\\n            curr = curr.next\\n        if curr.next:\\n            if curr.next == self.tail:\\n                self.tail = curr\\n            curr.next = curr.next.next\\n            self.size -= 1\\n            return True\\n        return False\\n\\n    def to_list(self):\\n        \\"\\"\\"Convert to Python list - O(n)\\"\\"\\"\\n        result = []\\n        curr = self.head\\n        while curr:\\n            result.append(curr.val)\\n            curr = curr.next\\n        return result\\n\\n# Test the implementation\\nsll = SinglyLinkedList()\\nsll.append(10)\\nsll.append(20)\\nsll.prepend(5)\\nsll.delete(20)\\nprint(sll.to_list())  # [5, 10]",
  "runnable": true
}
\`\`\`

\`\`\`trace
{
  "title": "Step-by-Step: Building a List",
  "language": "python",
  "code": "class Node:\\n    def __init__(self, val):\\n        self.val = val\\n        self.next = None\\n\\nclass SinglyLinkedList:\\n    def __init__(self):\\n        self.head = None\\n\\n    def prepend(self, val):\\n        new_node = Node(val)\\n        new_node.next = self.head\\n        self.head = new_node\\n\\n    def to_list(self):\\n        result = []\\n        curr = self.head\\n        while curr:\\n            result.append(curr.val)\\n            curr = curr.next\\n        return result\\n\\n# Build list: 30 -> 20 -> 10\\nsll = SinglyLinkedList()\\nsll.prepend(10)\\nsll.prepend(20)\\nsll.prepend(30)\\nprint(sll.to_list())",
  "frames": [
    { "line": 12, "vars": {"self.head": "None"}, "note": "Empty list", "stdout": "" },
    { "line": 13, "vars": {"self.head": "Node(10)"}, "note": "Added first node", "stdout": "" },
    { "line": 14, "vars": {"self.head": "Node(20)"}, "note": "Prepended 20", "stdout": "" },
    { "line": 15, "vars": {"self.head": "Node(30)"}, "note": "Prepended 30", "stdout": "" },
    { "line": 16, "vars": {"result": "[30, 20, 10]"}, "note": "Final list", "stdout": "[30, 20, 10]\\n" }
  ],
  "speed": 800
}
\`\`\`

\`\`\`quiz
{
  "title": "Singly Linked List Knowledge Check",
  "questions": [
    {
      "question": "What is the time complexity of inserting at the head of a singly linked list?",
      "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      "answer": 0,
      "explanation": "Inserting at the head only requires updating the head pointer, making it O(1) regardless of list size."
    },
    {
      "question": "Why can't we traverse a singly linked list backwards?",
      "options": ["Nodes don't store previous pointers", "It's too slow", "Memory constraints", "Python limitation"],
      "answer": 0,
      "explanation": "Each node only stores a 'next' pointer. Without a 'prev' pointer (as in doubly linked lists), backward traversal is impossible."
    },
    {
      "question": "Which operation requires O(n) time even with a tail pointer?",
      "options": ["Insert at head", "Insert at tail", "Delete last node", "Search by value"],
      "answer": 2,
      "explanation": "Deleting the last node requires finding the second-to-last node to update its next pointer, which needs a full traversal."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Singly linked lists excel at O(1) insertions/deletions at the head",
    "Random access is O(n) - you must traverse from the head",
    "Each node adds memory overhead for the next pointer",
    "Maintaining a tail pointer enables O(1) append operations",
    "They're ideal when you need dynamic size and frequent head operations"
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "The Power of Two Pointers",
  "variant": "mental-model",
  "content": "Think of a doubly linked list as a two-way street versus a one-way street (singly linked list). You can move forward and backward efficiently, but you pay for this flexibility with extra memory (one more pointer per node) and more complex pointer management during operations."
}
\`\`\`

### Structure

\`\`\`
None <- [prev|value|next] <-> [prev|value|next] <-> [prev|value|next] -> None
            head                                         tail
\`\`\`

\`\`\`algoviz
{
  "title": "Doubly Linked List Visualization",
  "type": "linkedlist",
  "data": [
    {"value": 10, "next": 1, "prev": null},
    {"value": 20, "next": 2, "prev": 0},
    {"value": 30, "next": null, "prev": 1}
  ],
  "frames": [
    {"highlight": [0], "label": "Head points to first node (10)", "stats": {"head": 0}},
    {"highlight": [0, 1], "label": "Forward traversal: 10 -> 20", "stats": {"current": 1}},
    {"highlight": [1, 2], "label": "Forward traversal: 20 -> 30", "stats": {"current": 2}},
    {"highlight": [2, 1], "label": "Backward traversal: 30 -> 20", "stats": {"current": 1}},
    {"highlight": [1, 0], "label": "Backward traversal: 20 -> 10", "stats": {"current": 0}}
  ],
  "speed": 1000
}
\`\`\`

### Advantages Over Singly Linked

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Singly Linked List",
    "code": "# Deleting node C requires finding node B first\\n# O(n) to find predecessor\\nprev = None\\ncurrent = head\\nwhile current.next != node_to_delete:\\n    prev = current\\n    current = current.next\\nprev.next = current.next"
  },
  "after": {
    "label": "Doubly Linked List",
    "code": "# Deleting node C with reference is O(1)\\n# No traversal needed!\\nnode.prev.next = node.next\\nnode.next.prev = node.prev"
  }
}
\`\`\`

- O(1) deletion when you have a reference to the node
- O(1) pop from tail (with tail pointer)
- Bidirectional traversal

\`\`\`callout
{
  "type": "warning",
  "title": "Memory Trade-off",
  "content": "Each node in a doubly linked list uses ~33% more memory than a singly linked list node (3 pointers vs 2 pointers). For large datasets, this overhead can be significant."
}
\`\`\`

### Implementation Challenge

Implement a doubly linked list with \`push_front\`, \`push_back\`, \`pop_front\`, \`pop_back\`, and \`to_list\`.

\`\`\`playground
{
  "title": "Doubly Linked List Implementation",
  "language": "python",
  "code": "class Node:\\n    def __init__(self, value):\\n        self.value = value\\n        self.prev = None\\n        self.next = None\\n\\nclass DoublyLinkedList:\\n    def __init__(self):\\n        self.head = None\\n        self.tail = None\\n        self.size = 0\\n    \\n    def push_front(self, value):\\n        \\"\\"\\"Add node to the beginning - O(1)\\"\\"\\"\\n        new_node = Node(value)\\n        if self.head is None:\\n            self.head = self.tail = new_node\\n        else:\\n            new_node.next = self.head\\n            self.head.prev = new_node\\n            self.head = new_node\\n        self.size += 1\\n    \\n    def push_back(self, value):\\n        \\"\\"\\"Add node to the end - O(1)\\"\\"\\"\\n        new_node = Node(value)\\n        if self.tail is None:\\n            self.head = self.tail = new_node\\n        else:\\n            new_node.prev = self.tail\\n            self.tail.next = new_node\\n            self.tail = new_node\\n        self.size += 1\\n    \\n    def pop_front(self):\\n        \\"\\"\\"Remove node from beginning - O(1)\\"\\"\\"\\n        if self.head is None:\\n            raise IndexError(\\"List is empty\\")\\n        \\n        value = self.head.value\\n        self.head = self.head.next\\n        if self.head is None:\\n            self.tail = None\\n        else:\\n            self.head.prev = None\\n        self.size -= 1\\n        return value\\n    \\n    def pop_back(self):\\n        \\"\\"\\"Remove node from end - O(1)\\"\\"\\"\\n        if self.tail is None:\\n            raise IndexError(\\"List is empty\\")\\n        \\n        value = self.tail.value\\n        self.tail = self.tail.prev\\n        if self.tail is None:\\n            self.head = None\\n        else:\\n            self.tail.next = None\\n        self.size -= 1\\n        return value\\n    \\n    def to_list(self):\\n        \\"\\"\\"Convert to Python list - O(n)\\"\\"\\"\\n        result = []\\n        current = self.head\\n        while current:\\n            result.append(current.value)\\n            current = current.next\\n        return result\\n\\n# Test your implementation\\ndll = DoublyLinkedList()\\ndll.push_back(1)\\ndll.push_back(2)\\ndll.push_front(0)\\nprint(dll.to_list())  # [0, 1, 2]\\nprint(dll.pop_back())  # 2\\nprint(dll.to_list())  # [0, 1]",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Doubly Linked List Operations",
  "questions": [
    {
      "question": "What is the time complexity of deleting a node in a doubly linked list when you have a direct reference to that node?",
      "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      "answer": 0,
      "explanation": "With a direct reference, you can update the prev and next pointers of adjacent nodes in constant time."
    },
    {
      "question": "Which operation becomes O(1) in a doubly linked list with a tail pointer but remains O(n) in a singly linked list?",
      "options": ["push_front", "pop_front", "pop_back", "search"],
      "answer": 2,
      "explanation": "pop_back requires accessing the last element and updating the tail, which is O(1) with a tail pointer in a doubly linked list but O(n) in a singly linked list."
    },
    {
      "question": "What is the main disadvantage of doubly linked lists compared to singly linked lists?",
      "options": ["Slower insertion", "Higher memory usage", "No backward traversal", "More complex search"],
      "answer": 1,
      "explanation": "Each node requires an additional prev pointer, increasing memory usage by approximately 33% per node."
    }
  ]
}
\`\`\`

\`\`\`trace
{
  "title": "Push and Pop Operations",
  "language": "python",
  "code": "dll = DoublyLinkedList()\\ndll.push_back(10)\\ndll.push_front(5)\\ndll.push_back(15)\\nprint(f\\"After pushes: {dll.to_list()}\\")\\nprint(f\\"Pop front: {dll.pop_front()}\\")\\nprint(f\\"Pop back: {dll.pop_back()}\\")\\nprint(f\\"Final list: {dll.to_list()}\\")",
  "frames": [
    {"line": 1, "vars": {"dll": "DoublyLinkedList object"}, "note": "Empty list created", "stdout": ""},
    {"line": 2, "vars": {"dll.head.value": 10, "dll.tail.value": 10}, "note": "First node added", "stdout": ""},
    {"line": 3, "vars": {"dll.head.value": 5, "dll.tail.value": 10}, "note": "Node added to front", "stdout": ""},
    {"line": 4, "vars": {"dll.head.value": 5, "dll.tail.value": 15}, "note": "Node added to back", "stdout": ""},
    {"line": 5, "vars": {}, "note": "Display current state", "stdout": "After pushes: [5, 10, 15]"},
    {"line": 6, "vars": {"dll.head.value": 10}, "note": "Remove front node", "stdout": "Pop front: 5"},
    {"line": 7, "vars": {"dll.head.value": 10, "dll.tail.value": 10}, "note": "Remove back node", "stdout": "Pop back: 15"},
    {"line": 8, "vars": {}, "note": "Final state", "stdout": "Final list: [10]"}
  ],
  "speed": 1200
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Doubly linked lists enable O(1) deletion with node reference due to bidirectional pointers",
    "Each node requires extra memory for the prev pointer (~33% overhead vs singly linked)",
    "Operations like pop_back become O(1) with tail pointer, unlike singly linked lists",
    "Implementation complexity increases due to managing both prev and next pointers"
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "Why These Three Operations Matter",
  "variant": "insight",
  "content": "These three operations form the foundation of most linked list interview questions. Master them and you'll recognize their patterns in 80% of linked list problems. Reversal teaches pointer manipulation, fast/slow pointers solve midpoint and cycle problems, and Floyd's algorithm is the standard for cycle detection in O(N) time with O(1) space."
}
\`\`\`

### Examples

\`\`\`
reverse([1, 2, 3, 4, 5]) -> [5, 4, 3, 2, 1]

find_middle([1, 2, 3, 4, 5]) -> 3
find_middle([1, 2, 3, 4]) -> 2

has_cycle(1 -> 2 -> 3 -> 1) -> True
has_cycle(1 -> 2 -> 3 -> None) -> False
\`\`\`

### Key Techniques

\`\`\`steps
{
  "title": "Three Essential Pointer Techniques",
  "steps": [
    {
      "title": "Three-Pointer Reversal",
      "content": "Use three pointers: \`prev\` (initially null), \`curr\` (head), and \`next\` (temp storage). For each node: save next, reverse the link, then advance all three pointers. This runs in O(N) time with O(1) space."
    },
    {
      "title": "Fast/Slow Pointers",
      "content": "Initialize two pointers at the head. Move fast pointer 2 steps while slow moves 1 step. When fast reaches the end, slow is at the middle. For even-length lists, slow stops at the first middle node."
    },
    {
      "title": "Floyd's Cycle Detection",
      "content": "Use two pointers: slow moves 1 step, fast moves 2 steps. If they meet, there's a cycle. If fast reaches null, no cycle exists. This is also called the 'tortoise and hare' algorithm."
    }
  ]
}
\`\`\`

\`\`\`algoviz
{
  "title": "Reversing a Linked List Step-by-Step",
  "type": "linkedlist",
  "data": [1, 2, 3, 4, 5],
  "frames": [
    { "highlight": [0], "label": "Initial list: prev=null, curr=head", "stats": {"prev": "null", "curr": "1"} },
    { "highlight": [0, 1], "label": "Save next (2), reverse 1→null", "stats": {"prev": "1", "curr": "2"} },
    { "highlight": [1, 2], "label": "Reverse 2→1, advance pointers", "stats": {"prev": "2", "curr": "3"} },
    { "highlight": [2, 3], "label": "Reverse 3→2, continue...", "stats": {"prev": "3", "curr": "4"} },
    { "highlight": [4], "label": "Final reversed list", "stats": {"prev": "5", "curr": "null"} }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`trace
{
  "title": "Finding the Middle Node",
  "language": "python",
  "code": "def find_middle(head):\\n    if not head:\\n        return None\\n    \\n    slow = fast = head\\n    \\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n    \\n    return slow\\n\\n# Test with [1,2,3,4,5]\\nhead = ListNode(1)\\nhead.next = ListNode(2)\\nhead.next.next = ListNode(3)\\nhead.next.next.next = ListNode(4)\\nhead.next.next.next.next = ListNode(5)\\n\\nmiddle = find_middle(head)\\nprint(f\\"Middle value: {middle.val}\\")",
  "frames": [
    { "line": 5, "vars": {"slow": "1", "fast": "1"}, "note": "Both start at head", "stdout": "" },
    { "line": 7, "vars": {"slow": "2", "fast": "3"}, "note": "First iteration", "stdout": "" },
    { "line": 7, "vars": {"slow": "3", "fast": "5"}, "note": "Second iteration", "stdout": "" },
    { "line": 10, "vars": {"slow": "3", "fast": "5"}, "note": "Loop ends, fast can't move further", "stdout": "Middle value: 3" }
  ],
  "speed": 1200
}
\`\`\`

\`\`\`quiz
{
  "title": "Pointer Technique Mastery",
  "questions": [
    {
      "question": "In the three-pointer reversal technique, what happens to the 'next' pointer after reversing a link?",
      "options": ["It becomes null", "It points to the previous node", "It temporarily stores the next node to process", "It gets deleted"],
      "answer": 2,
      "explanation": "The 'next' pointer temporarily stores the next node before we reverse the link, ensuring we don't lose track of the remaining list."
    },
    {
      "question": "When using fast/slow pointers on a list with 6 nodes, where does slow stop?",
      "options": ["Node 2", "Node 3", "Node 4", "Node 6"],
      "answer": 1,
      "explanation": "With 6 nodes, fast reaches null after 3 iterations (moving 2 steps each), so slow stops at node 3 (the first middle node)."
    },
    {
      "question": "In Floyd's cycle detection, what's the maximum number of steps before detecting a cycle?",
      "options": ["N steps", "2N steps", "N² steps", "log N steps"],
      "answer": 1,
      "explanation": "In the worst case, fast and slow pointers will meet within 2N steps. If there's no cycle, fast reaches null in N/2 steps."
    }
  ]
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naïve Cycle Detection (Bad)",
    "code": "def has_cycle_naive(head):\\n    seen = set()\\n    curr = head\\n    while curr:\\n        if curr in seen:\\n            return True\\n        seen.add(curr)\\n        curr = curr.next\\n    return False\\n# O(N) space - stores every node!"
  },
  "after": {
    "label": "Floyd's Algorithm (Good)",
    "code": "def has_cycle_floyd(head):\\n    slow = fast = head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow == fast:\\n            return True\\n    return False\\n# O(1) space - only two pointers!"
  }
}
\`\`\`

\`\`\`playground
{
  "title": "Implement All Three Operations",
  "language": "python",
  "code": "class ListNode:\\n    def __init__(self, val=0, next=None):\\n        self.val = val\\n        self.next = next\\n\\ndef reverse_list(head):\\n    # TODO: Implement in-place reversal\\n    pass\\n\\ndef find_middle(head):\\n    # TODO: Implement fast/slow pointer technique\\n    pass\\n\\ndef has_cycle(head):\\n    # TODO: Implement Floyd's cycle detection\\n    pass\\n\\n# Test your implementations\\ndef test_all():\\n    # Create list: 1 -> 2 -> 3 -> 4 -> 5\\n    head = ListNode(1)\\n    curr = head\\n    for i in range(2, 6):\\n        curr.next = ListNode(i)\\n        curr = curr.next\\n    \\n    print(\\"Original list:\\", list_to_array(head))\\n    \\n    # Test reversal\\n    reversed_head = reverse_list(head)\\n    print(\\"Reversed:\\", list_to_array(reversed_head))\\n    \\n    # Test middle finding\\n    middle = find_middle(reversed_head)\\n    print(\\"Middle value:\\", middle.val if middle else None)\\n    \\n    # Test cycle detection\\n    print(\\"Has cycle:\\", has_cycle(reversed_head))\\n\\ndef list_to_array(head):\\n    result = []\\n    curr = head\\n    while curr:\\n        result.append(curr.val)\\n        curr = curr.next\\n    return result\\n\\ntest_all()",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Three-pointer reversal is the standard technique for in-place linked list reversal with O(N) time and O(1) space",
    "Fast/slow pointers solve both middle-finding and cycle detection problems efficiently",
    "Floyd's algorithm detects cycles in O(N) time using O(1) space - never use a hash set for this",
    "These three techniques form the foundation for 80% of linked list interview questions",
    "Always handle edge cases: empty lists, single nodes, and null pointers"
  ]
}
\`\`\``,
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

Two classic interview questions that separate candidates who *know* linked lists from those who *own* them.

\`\`\`concept
{"title": "Pointer Manipulation = Linked List Superpower", "variant": "mental-model", "content": "Every linked-list problem is a story about pointers changing partners. If you can draw the arrows before and after each operation, you can code it bug-free."}
\`\`\`

---

## Problem 1: Merge Two Sorted Lists

Given two already-sorted singly linked lists, splice them into one sorted chain.

\`\`\`algoviz
{"title": "Merging [1→3→5] and [2→4→6]", "type": "linkedlist", "data": [{"id":"l1-1","value":1,"next":"l1-3"},{"id":"l1-3","value":3,"next":"l1-5"},{"id":"l1-5","value":5,"next":null},{"id":"l2-2","value":2,"next":"l2-4"},{"id":"l2-4","value":4,"next":"l2-6"},{"id":"l2-6","value":6,"next":null}], "frames": [{"highlight":["l1-1","l2-2"],"label":"Compare 1 vs 2 → pick 1","stats":{"l1_ptr":"l1-1","l2_ptr":"l2-2","tail":"l1-1"}},{"highlight":["l1-3","l2-2"],"label":"Compare 3 vs 2 → pick 2","stats":{"l1_ptr":"l1-3","l2_ptr":"l2-2","tail":"l2-2"}},{"highlight":["l1-3","l2-4"],"label":"Compare 3 vs 4 → pick 3","stats":{"l1_ptr":"l1-3","l2_ptr":"l2-4","tail":"l1-3"}},{"highlight":["l1-5","l2-4"],"label":"Compare 5 vs 4 → pick 4","stats":{"l1_ptr":"l1-5","l2_ptr":"l2-4","tail":"l2-4"}},{"highlight":["l1-5","l2-6"],"label":"Compare 5 vs 6 → pick 5","stats":{"l1_ptr":"l1-5","l2_ptr":"l2-6","tail":"l1-5"}},{"highlight":["l2-6"],"label":"List 1 exhausted → link remaining 6","stats":{"l1_ptr":null,"l2_ptr":"l2-6","tail":"l2-6"}}], "speed": 1000}
\`\`\`

### Dummy-node Technique

A *dummy* (sentinel) node gives the merged list a fake head before the first real node is chosen.  
Benefits:

- No special case for the first append
- A single \`tail\` pointer always points to the last node of the partial merge

\`\`\`playground
{"title": "Merge Two Sorted Lists", "language": "python", "runnable": true, "code": "class Node:\\n    def __init__(self, val, nxt=None):\\n        self.val, self.next = val, nxt\\n\\ndef merge(a: Node, b: Node) -> Node:\\n    dummy = Node(0)          # never used for data; just anchor\\n    tail = dummy\\n    while a and b:\\n        if a.val <= b.val:\\n            tail.next, a = a, a.next\\n        else:\\n            tail.next, b = b, b.next\\n        tail = tail.next\\n    tail.next = a if a else b   # link remainder\\n    return dummy.next\\n\\n# ---- helper code for demo ----\\ndef build(lst):\\n    head = None\\n    for x in reversed(lst):\\n        head = Node(x, head)\\n    return head\\n\\ndef to_list(head):\\n    out = []\\n    while head:\\n        out.append(head.val)\\n        head = head.next\\n    return out\\n\\nl1 = build([1,3,5])\\nl2 = build([2,4,6])\\nprint('merge result:', to_list(merge(l1, l2)))"}
\`\`\`

---

## Problem 2: Remove N-th Node From End

Given \`head\` and integer \`n\`, delete the node that is \`n\` positions away from the tail.  
Return the new head (possibly changed).

\`\`\`concept
{"title": "Two-pointer Gap Trick", "variant": "rule", "content": "Put two pointers \`n+1\` nodes apart. Advance both until the right pointer hits the end. The left pointer will be *just before* the node to delete, letting you relink in O(1) time."}
\`\`\`

\`\`\`trace
{"title": "Removing 2nd-from-end on [1→2→3→4→5]", "language": "python", "code": "class Node:\\n    def __init__(self, val, nxt=None):\\n        self.val, self.next = val, nxt\\n\\ndef remove_nth(head: Node, n: int) -> Node:\\n    dummy = Node(0, head)   # handles delete-head case\\n    left = dummy\\n    right = head\\n    # open gap of n nodes\\n    for _ in range(n):\\n        right = right.next\\n    # march both until right falls off list\\n    while right:\\n        left, right = left.next, right.next\\n    # left.next is the node to unlink\\n    left.next = left.next.next\\n    return dummy.next", "frames": [{"line":6,"vars":{"head":"Node(1)","n":2,"dummy":"Node(0)→1"},"note":"dummy created","stdout":""},{"line":8,"vars":{"left":"dummy","right":"Node(1)"},"note":"left at dummy, right at head","stdout":""},{"line":10,"vars":{"right":"Node(3)"},"note":"after moving right 2 steps","stdout":""},{"line":13,"vars":{"left":"dummy","right":"Node(3)"},"note":"enter while loop","stdout":""},{"line":14,"vars":{"left":"Node(1)","right":"Node(4)"},"note":"both advance","stdout":""},{"line":13,"vars":{"left":"Node(2)","right":"Node(5)"},"note":"loop continues","stdout":""},{"line":13,"vars":{"left":"Node(3)","right":null},"note":"right becomes null → exit loop","stdout":""},{"line":16,"vars":{},"note":"left.next (Node 4) unlinked","stdout":""},{"line":17,"vars":{},"note":"return dummy.next (still Node 1)","stdout":""}], "speed": 900}
\`\`\`

### Edge Cases Handled

- Removing the first node (\`n = length\`) – dummy becomes the new head anchor
- Single-node list (\`n = 1\`) – returns empty list
- \`n\` larger than list length – algorithm naturally crashes with an early \`AttributeError\`, which is acceptable behavior unless specified otherwise

\`\`\`quiz
{"title": "Quick Checks on Pointer Logic", "questions": [{"question":"In the merge routine, why do we create a dummy node instead of simply starting with the smaller head?","options":["Dummies use less memory","It avoids a special case for the first append","It speeds up the loop","It is required to keep lists immutable"],"answer":1,"explanation":"With a dummy we can always append to tail.next without asking 'is this the first real node?'."},{"question":"After the two-pointer gap is established in remove_nth, what invariant holds?","options":["left is n nodes behind right","left is n+1 nodes behind right","left and right are the same distance from the end","left is always at the head"],"answer":1,"explanation":"We started left at dummy (one before head) and moved right n steps, so the gap is n+1."},{"question":"What are the time and space complexities of the two algorithms?","options":["O(n log n) time, O(n) space each","O(n) time, O(1) space each","O(n²) time, O(1) space each","O(n) time, O(log n) space each"],"answer":1,"explanation":"Each algorithm touches every node once and uses only a constant number of extra pointers."}]}
\`\`\`

---

## Takeaways

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Dummy/sentinel nodes eliminate special-case branching at the head or tail.", "Merging sorted lists is a textbook use of the two-pointer technique on linked structures.", "The 'n+1 gap' trick lets you locate the predecessor of the n-th-from-end node in a single pass.", "Both algorithms run in O(n) time and O(1) extra space—optimal for sequential data."]}
\`\`\`

Now practice: can you merge *k* sorted lists in O(n log k) time using the same dummy idea plus a min-heap?`,
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
