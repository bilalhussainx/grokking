import { Module } from "../types";

export const linkedListReversalModule: Module = {
  id: "linked-list-reversal",
  title: "In-place Reversal of a Linked List",
  description: "Master in-place linked list reversal — full reversal, sub-list reversal, and k-group variants.",
  lessons: [
    {
      id: "ll-reversal-intro",
      slug: "linked-list-reversal-intro",
      title: "Introduction to Linked List Reversal",
      content: `## In-place Reversal of a Linked List

Reversing a linked list is a foundational technique that appears in many interview problems. The key insight is manipulating **pointers** so that each node points to its predecessor instead of its successor.

\`\`\`concept
{
  "title": "The Core Insight",
  "variant": "mental-model",
  "content": "Linked list reversal is like flipping a chain: you keep every link intact, but you change which way each link 'faces'. Instead of pointing forward to the next node, each node now points backward to the previous one. This happens entirely by updating the \`next\` pointers — no new nodes are created."
}
\`\`\`

### The Three-Pointer Technique

To reverse a linked list in-place, maintain three references:

| Pointer | Role |
|---------|------|
| \`prev\` | The previously processed node (starts as \`None\`). |
| \`current\` | The node currently being processed. |
| \`next_node\` | Temporary storage so we don't lose the rest of the list. |

\`\`\`trace
{
  "title": "Step-by-Step Reversal of 1→2→3→None",
  "language": "python",
  "code": "class ListNode:\\n    def __init__(self, val, nxt=None):\\n        self.val, self.next = val, nxt\\n\\ndef reverse(head):\\n    prev, curr = None, head\\n    while curr:\\n        next_node = curr.next   # save next\\n        curr.next = prev        # flip link\\n        prev = curr             # advance prev\\n        curr = next_node        # advance curr\\n    return prev                 # new head",
  "frames": [
    { "line": 5, "vars": {"head":"1→2→3→None","prev":null,"curr":"1→2→3→None"}, "note": "Initial state", "stdout": "" },
    { "line": 6, "vars": {"prev":null,"curr":"1→2→3→None","next_node":"2→3→None"}, "note": "Save next", "stdout": "" },
    { "line": 7, "vars": {"prev":null,"curr":"1→None","next_node":"2→3→None"}, "note": "Flip 1→None", "stdout": "" },
    { "line": 8, "vars": {"prev":"1→None","curr":"2→3→None"}, "note": "Advance pointers", "stdout": "" },
    { "line": 6, "vars": {"prev":"1→None","curr":"2→3→None","next_node":"3→None"}, "note": "Second iteration", "stdout": "" },
    { "line": 7, "vars": {"prev":"1→None","curr":"2→1→None","next_node":"3→None"}, "note": "Flip 2→1", "stdout": "" },
    { "line": 8, "vars": {"prev":"2→1→None","curr":"3→None"}, "note": "Advance again", "stdout": "" },
    { "line": 6, "vars": {"prev":"2→1→None","curr":"3→None","next_node":null}, "note": "Third iteration", "stdout": "" },
    { "line": 7, "vars": {"prev":"2→1→None","curr":"3→2→1→None","next_node":null}, "note": "Flip 3→2", "stdout": "" },
    { "line": 9, "vars": {"prev":"3→2→1→None","curr":null}, "note": "curr is None → done", "stdout": "" },
    { "line": 10, "vars": {"return":"3→2→1→None"}, "note": "Return new head", "stdout": "" }
  ],
  "speed": 900
}
\`\`\`

### Variants

- **Reverse a sub-list:** Only reverse nodes between positions p and q.
- **Reverse in k-groups:** Reverse every k consecutive nodes.
- **Alternating reversal:** Reverse one group of k, skip the next, repeat.

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "What is the space complexity of the iterative in-place reversal algorithm?",
      "options": ["O(n)", "O(1)", "O(log n)", "O(n log n)"],
      "answer": 1,
      "explanation": "Only three extra pointers (prev, curr, next_node) are used regardless of list length → O(1)."
    },
    {
      "question": "If you forget to save \`curr.next\` before overwriting it, what happens?",
      "options": ["The list becomes cyclic", "You lose the rest of the list", "Nothing—Python fixes it", "Reversal becomes O(n²)"],
      "answer": 1,
      "explanation": "Without storing \`curr.next\` first, you have no reference to the remaining nodes and they become unreachable."
    },
    {
      "question": "After reversal, which variable holds the new head of the list?",
      "options": ["curr", "prev", "next_node", "head"],
      "answer": 1,
      "explanation": "When the loop ends, \`curr\` is None and \`prev\` is the last processed node—now the new head."
    }
  ]
}
\`\`\`

### Complexity

In-place reversal runs in **O(n)** time and **O(1)** space.

\`\`\`callout
{
  "type": "warning",
  "title": "Recursive Alternative",
  "content": "A recursive solution is shorter but uses **O(n)** call-stack space, which can overflow for very long lists. Stick to the iterative three-pointer method in interviews unless explicitly told stack usage is acceptable."
}
\`\`\``,
    },
    {
      id: "ll-reversal-full",
      slug: "reverse-linked-list",
      title: "Reverse a Linked List",
      content: `## Reverse a Linked List

### Problem Statement

Given the head of a singly linked list, reverse the entire list and return the new head.

### Examples

\`\`\`
Input:  1 -> 2 -> 3 -> 4 -> 5 -> None
Output: 5 -> 4 -> 3 -> 2 -> 1 -> None
\`\`\`

\`\`\`
Input:  10 -> 20 -> 30 -> None
Output: 30 -> 20 -> 10 -> None
\`\`\`

\`\`\`
Input:  7 -> None
Output: 7 -> None
\`\`\`

\`\`\`concept
{
  "title": "In-place Reversal",
  "variant": "mental-model",
  "content": "Think of reversing a linked list like flipping a chain of dominoes. Instead of creating a new chain, you simply rewire the connections between existing dominoes so they point backward. This is the essence of in-place reversal — no extra space needed, just pointer manipulation."
}
\`\`\`

\`\`\`steps
{
  "title": "Three-Pointer Technique",
  "steps": [
    {
      "title": "Initialize Pointers",
      "content": "Start with \`prev = None\` (will track reversed portion), \`current = head\` (node being processed), and \`next_node\` (temporary storage)."
    },
    {
      "title": "Save Next Node",
      "content": "Before rewiring, store \`current.next\` in \`next_node\` so you don't lose the rest of the list."
    },
    {
      "title": "Reverse the Link",
      "content": "Point \`current.next\` to \`prev\`, effectively reversing the direction of this link."
    },
    {
      "title": "Advance Pointers",
      "content": "Move \`prev\` to \`current\` and \`current\` to \`next_node\` to process the next node."
    },
    {
      "title": "Return New Head",
      "content": "When \`current\` becomes \`None\`, \`prev\` points to the new head of the reversed list."
    }
  ]
}
\`\`\`

\`\`\`algoviz
{
  "title": "Reversing 1→2→3→4→5",
  "type": "linkedlist",
  "data": [1, 2, 3, 4, 5],
  "frames": [
    { "highlight": [0], "label": "prev=None, curr=1, save next=2", "stats": {"prev": "None", "curr": 1} },
    { "highlight": [0], "label": "Reverse: 1→None", "stats": {"prev": "None", "curr": 1} },
    { "highlight": [1], "label": "Advance: prev=1, curr=2", "stats": {"prev": 1, "curr": 2} },
    { "highlight": [1], "label": "Save next=3, reverse 2→1", "stats": {"prev": 1, "curr": 2} },
    { "highlight": [2], "label": "Advance: prev=2, curr=3", "stats": {"prev": 2, "curr": 3} },
    { "highlight": [2], "label": "Save next=4, reverse 3→2", "stats": {"prev": 2, "curr": 3} },
    { "highlight": [3], "label": "Advance: prev=3, curr=4", "stats": {"prev": 3, "curr": 4} },
    { "highlight": [3], "label": "Save next=5, reverse 4→3", "stats": {"prev": 3, "curr": 4} },
    { "highlight": [4], "label": "Advance: prev=4, curr=5", "stats": {"prev": 4, "curr": 5} },
    { "highlight": [4], "label": "Reverse 5→4, curr=None", "stats": {"prev": 5, "curr": "None"} },
    { "highlight": [4], "label": "Done! New head is 5", "stats": {"head": 5} }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`playground
{
  "title": "Implement Linked List Reversal",
  "language": "python",
  "code": "class ListNode:\\n    def __init__(self, val=0, next=None):\\n        self.val = val\\n        self.next = next\\n\\ndef reverseList(head):\\n    prev = None\\n    current = head\\n    \\n    while current:\\n        next_node = current.next  # Save next\\n        current.next = prev       # Reverse\\n        prev = current           # Move prev\\n        current = next_node      # Move current\\n    \\n    return prev  # New head\\n\\n# Test the implementation\\nhead = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))\\nresult = reverseList(head)\\n\\n# Print reversed list\\ncurrent = result\\nwhile current:\\n    print(current.val, end=\\" -> \\" if current.next else \\"\\\\n\\")\\n    current = current.next",
  "runnable": true
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Recursive Approach (O(N) space)",
    "code": "def reverseList(head):\\n    if not head or not head.next:\\n        return head\\n    \\n    reversed_head = reverseList(head.next)\\n    head.next.next = head\\n    head.next = None\\n    \\n    return reversed_head"
  },
  "after": {
    "label": "Iterative In-place (O(1) space)",
    "code": "def reverseList(head):\\n    prev = None\\n    current = head\\n    \\n    while current:\\n        next_node = current.next\\n        current.next = prev\\n        prev = current\\n        current = next_node\\n    \\n    return prev"
  }
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Stack Overflow Risk",
  "content": "The recursive approach, while elegant, uses O(N) space due to the call stack. For lists with millions of nodes, this can cause a stack overflow. The iterative in-place method is always safe and preferred for production code."
}
\`\`\`

\`\`\`quiz
{
  "title": "Test Your Understanding",
  "questions": [
    {
      "question": "What is the space complexity of the iterative in-place reversal algorithm?",
      "options": ["O(N)", "O(1)", "O(log N)", "O(N log N)"],
      "answer": 1,
      "explanation": "The iterative approach uses only three pointer variables (prev, current, next_node) regardless of list size, achieving O(1) constant space complexity."
    },
    {
      "question": "When reversing a linked list, what happens to the original head node?",
      "options": ["It becomes the new tail", "It stays the head", "It gets deleted", "It becomes the second node"],
      "answer": 0,
      "explanation": "After reversal, the original head node becomes the last node (tail) of the reversed list, with its next pointer set to None."
    },
    {
      "question": "Why do we need to save the next node before reversing the current link?",
      "options": ["To prevent memory leaks", "To avoid losing the rest of the list", "For garbage collection", "To check for cycles"],
      "answer": 1,
      "explanation": "Once we set current.next = prev, we lose the reference to the remaining nodes. Saving next_node ensures we can continue processing the rest of the list."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use three pointers (prev, current, next) to reverse links in-place with O(1) space",
    "Always save the next node before rewiring to avoid losing the rest of the list",
    "When current becomes None, prev points to the new head of the reversed list",
    "Iterative approach is preferred over recursive for large lists to avoid stack overflow",
    "This technique is fundamental for solving more complex linked list problems"
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
    curr = head
    for v in values[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def reverse(head):
    # TODO: reverse the linked list in-place
    pass

# Test cases
print(to_list(reverse(build_list([1, 2, 3, 4, 5]))))  # Expected: [5, 4, 3, 2, 1]
print(to_list(reverse(build_list([10, 20, 30]))))      # Expected: [30, 20, 10]
print(to_list(reverse(build_list([7]))))                # Expected: [7]
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def build_list(values):
    if not values:
        return None
    head = ListNode(values[0])
    curr = head
    for v in values[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def reverse(head):
    prev = None
    current = head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev

# Test cases
print(to_list(reverse(build_list([1, 2, 3, 4, 5]))))  # Expected: [5, 4, 3, 2, 1]
print(to_list(reverse(build_list([10, 20, 30]))))      # Expected: [30, 20, 10]
print(to_list(reverse(build_list([7]))))                # Expected: [7]
`,
    },
    {
      id: "ll-reversal-sublist",
      slug: "reverse-sub-list",
      title: "Reverse a Sub-list",
      content: `## Reverse a Sub-list

### Problem Statement

Given the head of a linked list and two positions \`p\` and \`q\` (1-indexed), reverse the nodes from position \`p\` to position \`q\` and return the modified list.

### Examples

\`\`\`
Input:  1 -> 2 -> 3 -> 4 -> 5, p=2, q=4
Output: 1 -> 4 -> 3 -> 2 -> 5
Explanation: Nodes at positions 2,3,4 are reversed.
\`\`\`

\`\`\`
Input:  1 -> 2 -> 3, p=1, q=3
Output: 3 -> 2 -> 1
Explanation: Entire list reversed.
\`\`\`

\`\`\`
Input:  10 -> 20 -> 30 -> 40 -> 50, p=2, q=3
Output: 10 -> 30 -> 20 -> 40 -> 50
\`\`\`

\`\`\`concept
{
  "title": "The Core Challenge: Re-linking Three Segments",
  "variant": "mental-model",
  "content": "Imagine the list as a train. To reverse a middle segment, you must:\\n\\n1. **Detach** the segment from the rest (cut links at p-1 and q+1)\\n2. **Flip** the segment (reverse next pointers inside)\\n3. **Re-attach** with new endpoints (prev of p now points to q, old q now points to q+1)\\n\\nThe trickiest part is keeping track of the four boundary nodes while you work."
}
\`\`\`

### Approach

1. Traverse to position \`p - 1\` to find the node just before the sub-list.
2. Reverse \`q - p + 1\` nodes using the standard reversal technique.
3. Connect the reversed sub-list back to the rest of the list.
4. Handle the edge case where \`p = 1\` (no node before the sub-list).

\`\`\`algoviz
{
  "title": "Step-by-step Reversal of Positions 2-4",
  "type": "linkedlist",
  "data": [1,2,3,4,5],
  "frames": [
    { "highlight": [0], "label": "Start at dummy (0), move to node before p (pos 1)" },
    { "highlight": [1,2,3], "label": "Reverse sub-list: flip next pointers of nodes 2,3,4" },
    { "highlight": [0,3], "label": "Connect prev of p (node 1) to new head (node 4)" },
    { "highlight": [2,4], "label": "Connect new tail (node 2) to node after q (node 5)" }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`steps
{
  "title": "Pointer Setup Strategy",
  "steps": [
    {
      "title": "Create a dummy node",
      "content": "Attach a dummy before the head. This eliminates the special case when p = 1."
    },
    {
      "title": "Position \`prev\` at p-1",
      "content": "Walk \`prev\` forward \`p-1\` steps. It will anchor the left re-connection."
    },
    {
      "title": "Identify sub-list boundaries",
      "content": "\`start = prev.next\` (first node to reverse)  \\n\`then = start.next\` (node we will iteratively move in front)."
    },
    {
      "title": "Repeat q-p reversals",
      "content": "For each of the \`q-p\` nodes, splice \`then\` right after \`prev\`, updating pointers."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Reverse Sub-list Implementation",
  "language": "python",
  "code": "class ListNode:\\n    def __init__(self, val=0, next=None):\\n        self.val = val\\n        self.next = next\\n\\ndef reverseBetween(head: ListNode, p: int, q: int) -> ListNode:\\n    if not head or p == q:\\n        return head\\n    \\n    dummy = ListNode(0)\\n    dummy.next = head\\n    prev = dummy\\n    \\n    # Move prev to node before position p\\n    for _ in range(p - 1):\\n        prev = prev.next\\n    \\n    start = prev.next        # first node of sub-list\\n    then = start.next        # node to be reversed in each step\\n    \\n    # Reverse q - p links\\n    for _ in range(q - p):\\n        start.next = then.next\\n        then.next = prev.next\\n        prev.next = then\\n        then = start.next\\n    \\n    return dummy.next",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Why is a dummy node helpful when p = 1?",
      "options": [
        "It reduces time complexity",
        "It avoids special-case code to update head",
        "It prevents stack overflow",
        "It doubles the space used"
      ],
      "answer": 1,
      "explanation": "With a dummy, every reversal has a non-null predecessor, so we can treat the head update like any other re-linking."
    },
    {
      "question": "How many pointer updates occur inside the reversal loop?",
      "options": ["2", "3", "4", "5"],
      "answer": 2,
      "explanation": "Each iteration performs three updates: start.next, then.next, and prev.next."
    },
    {
      "question": "What is the space complexity of this algorithm?",
      "options": ["O(n)", "O(p)", "O(1)", "O(q-p)"],
      "answer": 2,
      "explanation": "Only a constant number of pointers are used regardless of list length."
    }
  ]
}
\`\`\`

### Complexity

- **Time:** O(n) — single pass to locate the sub-list plus at most n reversals.
- **Space:** O(1) — only a handful of pointers are maintained.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use a dummy node to unify edge cases where reversal starts at the head.",
    "Maintain clear roles for each pointer: prev anchors, start marks sub-list head, then is the moving node.",
    "After reversal, prev should point to the new head (originally at q) and the new tail (originally at p) should point to the remaining list."
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
    curr = head
    for v in values[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def reverse_sub_list(head, p, q):
    # TODO: reverse nodes from position p to q
    pass

# Test cases
print(to_list(reverse_sub_list(build_list([1,2,3,4,5]), 2, 4)))  # Expected: [1,4,3,2,5]
print(to_list(reverse_sub_list(build_list([1,2,3]), 1, 3)))       # Expected: [3,2,1]
print(to_list(reverse_sub_list(build_list([10,20,30,40,50]), 2, 3)))  # Expected: [10,30,20,40,50]
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def build_list(values):
    if not values:
        return None
    head = ListNode(values[0])
    curr = head
    for v in values[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def reverse_sub_list(head, p, q):
    if p == q:
        return head
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy
    # Move prev to node before position p
    for _ in range(p - 1):
        prev = prev.next
    # Reverse q - p + 1 nodes
    current = prev.next
    for _ in range(q - p):
        next_node = current.next
        current.next = next_node.next
        next_node.next = prev.next
        prev.next = next_node
    return dummy.next

# Test cases
print(to_list(reverse_sub_list(build_list([1,2,3,4,5]), 2, 4)))  # Expected: [1,4,3,2,5]
print(to_list(reverse_sub_list(build_list([1,2,3]), 1, 3)))       # Expected: [3,2,1]
print(to_list(reverse_sub_list(build_list([10,20,30,40,50]), 2, 3)))  # Expected: [10,30,20,40,50]
`,
    },
    {
      id: "ll-reversal-k-group",
      slug: "reverse-every-k-elements",
      title: "Reverse Every K-element Sub-list",
      content: `## Reverse Every K-element Sub-list

### Problem Statement

Given the head of a linked list and a number \`k\`, reverse the list in groups of \`k\` nodes. If the remaining nodes are fewer than \`k\`, leave them in their original order.

\`\`\`concept
{
  "title": "Core Insight",
  "variant": "mental-model",
  "content": "Think of the list as a chain of k-length segments. For each segment: 1) detach it, 2) reverse its pointers, 3) splice it back. The trick is keeping three bookmarks: the tail of the previous reversed segment, the head of the current segment, and the node that follows the current segment so you can reconnect after reversal."
}
\`\`\`

### Visual Examples

\`\`\`algoviz
{
  "title": "Step-by-step: k = 3 on 1→2→3→4→5→6→7→8",
  "type": "linkedlist",
  "data": [1, 2, 3, 4, 5, 6, 7, 8],
  "frames": [
    { "highlight": [0, 1, 2], "label": "Group 1: reverse 1→2→3 into 3→2→1", "stats": {} },
    { "highlight": [3, 4, 5], "label": "Group 2: reverse 4→5→6 into 6→5→4", "stats": {} },
    { "highlight": [6, 7], "label": "Group 3: only 2 nodes < k, leave as-is", "stats": {} }
  ],
  "speed": 1000
}
\`\`\`

### Algorithm in Plain Steps

\`\`\`steps
{
  "title": "Iterative Blueprint",
  "steps": [
    {
      "title": "1. Dummy Head",
      "content": "Create a dummy node that points to \`head\`. It eliminates the special case of updating the real head after the first reversal."
    },
    {
      "title": "2. Count & Reverse Loop",
      "content": "Use a pointer \`groupPrev\` (initially dummy). Walk \`k\` steps to see if a full group exists. If yes, reverse those \`k\` nodes in-place; otherwise break."
    },
    {
      "title": "3. Re-linking",
      "content": "After reversal, \`groupPrev.next\` becomes the new head of the reversed segment. Update \`groupPrev\` to the old head (now tail) of that segment so it can connect to the next reversed chunk."
    },
    {
      "title": "4. Tail Handling",
      "content": "When fewer than \`k\` nodes remain, the walk in step 2 stops early and we simply exit—those nodes stay untouched."
    }
  ]
}
\`\`\`

### Complexity

- **Time:** O(n) — each node is visited at most twice (once to count, once to reverse)  
- **Space:** O(1) — only a constant number of pointers are used

\`\`\`callout
{
  "type": "warning",
  "title": "Recursive Variant",
  "content": "A recursive solution is elegant but consumes O(n/k) call-stack space. In the worst case (k = 1) that becomes O(n), which may overflow for very long lists."
}
\`\`\`

### Interactive Quiz

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "If k equals the length of the list, the output is:",
      "options": [
        "The original list",
        "The reversed list",
        "A list with only the first node",
        "Undefined behavior"
      ],
      "answer": 1,
      "explanation": "Reversing one full group of size n produces the reversed list."
    },
    {
      "question": "Why do we use a dummy node?",
      "options": [
        "To save memory",
        "To avoid special-casing the new head after the first reversal",
        "To mark the end of the list",
        "To store the value of k"
      ],
      "answer": 1,
      "explanation": "The dummy gives us a stable node whose next pointer we can always update, eliminating edge-case code for the real head."
    },
    {
      "question": "In the iterative solution, what is the maximum extra space used?",
      "options": ["O(n)", "O(k)", "O(1)", "O(log n)"],
      "answer": 2,
      "explanation": "Only a handful of pointers (prev, curr, next, groupPrev, groupNext) are maintained regardless of input size."
    }
  ]
}
\`\`\`

### Reference Implementation

\`\`\`playground
{
  "title": "Python: In-Place k-Group Reversal",
  "language": "python",
  "code": "class ListNode:\\n    def __init__(self, val=0, nxt=None):\\n        self.val, self.next = val, nxt\\n\\ndef reverseKGroup(head: ListNode, k: int) -> ListNode:\\n    dummy = ListNode(0, head)\\n    group_prev = dummy\\n\\n    while True:\\n        # Check if k nodes remain\\n        kth = group_prev\\n        for _ in range(k):\\n            kth = kth.next\\n            if not kth:\\n                return dummy.next  # done\\n\\n        # Reverse k nodes\\n        prev, curr = kth.next, group_prev.next\\n        while curr != kth.next:\\n            nxt = curr.next\\n            curr.next = prev\\n            prev, curr = curr, nxt\\n\\n        # Re-link\\n        tmp = group_prev.next\\n        group_prev.next = kth\\n        group_prev = tmp\\n\\n# Quick test\\nnodes = [ListNode(i) for i in range(1, 9)]\\nfor i in range(7): nodes[i].next = nodes[i+1]\\nnew_head = reverseKGroup(nodes[0], 3)\\ncurr = new_head\\nwhile curr:\\n    print(curr.val, end='→' if curr.next else '\\\\n')\\n    curr = curr.next",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use a dummy head to simplify pointer updates after each reversal.",
    "Always verify a full group of k nodes exists before reversing; leave the tail untouched if it’s shorter.",
    "The algorithm is strictly O(n) time and O(1) space when done iteratively."
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
    curr = head
    for v in values[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def reverse_every_k(head, k):
    # TODO: reverse in groups of k
    pass

# Test cases
print(to_list(reverse_every_k(build_list([1,2,3,4,5,6,7,8]), 3)))
# Expected: [3,2,1,6,5,4,8,7]

print(to_list(reverse_every_k(build_list([1,2,3,4,5]), 2)))
# Expected: [2,1,4,3,5]

print(to_list(reverse_every_k(build_list([1,2,3]), 4)))
# Expected: [3,2,1]
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def build_list(values):
    if not values:
        return None
    head = ListNode(values[0])
    curr = head
    for v in values[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def reverse_every_k(head, k):
    if k <= 1 or head is None:
        return head
    dummy = ListNode(0)
    dummy.next = head
    prev_group_end = dummy
    current = head
    while current:
        group_start = current
        # Check if there are k nodes remaining
        count = 0
        temp = current
        while temp and count < k:
            temp = temp.next
            count += 1
        # Reverse k nodes
        prev = None
        for _ in range(count):
            next_node = current.next
            current.next = prev
            prev = current
            current = next_node
        # Connect with previous part
        prev_group_end.next = prev
        group_start.next = current
        prev_group_end = group_start
    return dummy.next

# Test cases
print(to_list(reverse_every_k(build_list([1,2,3,4,5,6,7,8]), 3)))
# Expected: [3,2,1,6,5,4,8,7]

print(to_list(reverse_every_k(build_list([1,2,3,4,5]), 2)))
# Expected: [2,1,4,3,5]

print(to_list(reverse_every_k(build_list([1,2,3]), 4)))
# Expected: [3,2,1]
`,
    },
    {
      id: "ll-reversal-alternate-k",
      slug: "reverse-alternating-k-elements",
      title: "Reverse Alternating K-element Sub-list",
      content: `## Reverse Alternating K-element Sub-list

### Problem Statement

Given the head of a linked list and a number \`k\`, reverse **every alternate** group of \`k\` nodes. That is: reverse the first k nodes, skip the next k nodes, reverse the next k, skip the next k, and so on.

\`\`\`concept
{
  "title": "The Alternating Pattern",
  "variant": "mental-model",
  "content": "Think of this as a toggle switch: REVERSE → SKIP → REVERSE → SKIP...\\n\\n- When the switch is ON: reverse the next k nodes\\n- When the switch is OFF: skip (preserve) the next k nodes\\n\\nThis is simpler than it sounds — you just need a boolean flag that flips after each group of k nodes."
}
\`\`\`

### Examples

\`\`\`
Input:  1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8, k=2
Output: 2 -> 1 -> 3 -> 4 -> 6 -> 5 -> 7 -> 8
Explanation: Reverse [1,2], skip [3,4], reverse [5,6], skip [7,8].
\`\`\`

\`\`\`
Input:  1 -> 2 -> 3 -> 4 -> 5 -> 6, k=3
Output: 3 -> 2 -> 1 -> 4 -> 5 -> 6
Explanation: Reverse [1,2,3], skip [4,5,6].
\`\`\`

\`\`\`
Input:  1 -> 2 -> 3 -> 4 -> 5, k=1
Output: 1 -> 2 -> 3 -> 4 -> 5
Explanation: k=1 means reverse single nodes (no change), skip single nodes.
\`\`\`

\`\`\`algoviz
{
  "title": "Walk-through: k=2 on 8 nodes",
  "type": "linkedlist",
  "data": [1,2,3,4,5,6,7,8],
  "frames": [
    {"highlight":[0,1],"label":"Reverse group 1 (nodes 1→2)","stats":{"shouldReverse":true}},
    {"highlight":[2,3],"label":"Skip group 2 (nodes 3→4)","stats":{"shouldReverse":false}},
    {"highlight":[4,5],"label":"Reverse group 3 (nodes 5→6)","stats":{"shouldReverse":true}},
    {"highlight":[6,7],"label":"Skip group 4 (nodes 7→8)","stats":{"shouldReverse":false}}
  ],
  "speed": 1000
}
\`\`\`

### Approach Hints

- Similar to "Reverse every K", but after reversing k nodes, skip the next k nodes instead of reversing them.
- Use a flag or alternating logic to decide whether the current group should be reversed or skipped.

\`\`\`steps
{
  "title": "Algorithm Blueprint",
  "steps": [
    {
      "title": "1. Initialize pointers & flag",
      "content": "Start with \`prev = None\`, \`curr = head\`, and \`shouldReverse = True\`."
    },
    {
      "title": "2. Process each group of k",
      "content": "While \`curr\` is not None:\\n- Count next k nodes (or whatever remains)\\n- If \`shouldReverse\` is True, reverse that segment\\n- Otherwise, just walk past k nodes\\n- Flip \`shouldReverse\` for the next iteration"
    },
    {
      "title": "3. Connect the pieces",
      "content": "Maintain \`prev\` to link the processed segment back to the already-built list."
    }
  ]
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naïve: rebuild list",
    "code": "new_dummy = ListNode(0)\\ntail = new_dummy\\nwhile head:\\n    group = extract_k(head, k)\\n    if should_reverse:\\n        group = reverse_list(group)\\n    tail.next = group\\n    tail = last_node(group)\\n    head = skip_k(head, k)\\n    should_reverse = not should_reverse\\nreturn new_dummy.next"
  },
  "after": {
    "label": "In-place: O(1) space",
    "code": "prev, curr = None, head\\nshould_reverse = True\\nwhile curr:\\n    # count / reverse / skip in one pass\\n    first = curr\\n    count = 0\\n    while count < k and curr:\\n        count += 1\\n        curr = curr.next\\n    if should_reverse:\\n        prev = reverse_segment(prev, first, curr)\\n    else:\\n        prev = first\\n    should_reverse = not should_reverse\\nreturn head"
  }
}
\`\`\`

### Complexity

- **Time:** O(n)
- **Space:** O(1)

\`\`\`quiz
{
  "title": "Quick Check",
  "questions": [
    {
      "question": "For k=1, what does the algorithm produce?",
      "options": ["Original list unchanged", "List reversed once", "List reversed twice", "Runtime error"],
      "answer": 0,
      "explanation": "Reversing a single node is a no-op, and skipping single nodes leaves them untouched, so the list stays identical."
    },
    {
      "question": "If the list length is exactly 2k, how many nodes are reversed in total?",
      "options": ["k", "2k", "k/2", "0"],
      "answer": 0,
      "explanation": "Only the first k nodes are reversed; the second k are skipped, so k nodes total are reversed."
    },
    {
      "question": "Which single variable tracks whether we reverse or skip the current group?",
      "options": ["prev", "curr", "shouldReverse", "k"],
      "answer": 2,
      "explanation": "A boolean flag like shouldReverse is flipped after each group to alternate between reverse and skip modes."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Implement alternating reversal",
  "language": "python",
  "code": "class ListNode:\\n    def __init__(self, val=0, nxt=None):\\n        self.val, self.next = val, nxt\\n\\ndef reverse_alternating_k(head: ListNode, k: int) -> ListNode:\\n    # your code here\\n    pass\\n\\n# ---- helper to build / print ----\\ndef build(lst):\\n    dummy = ListNode()\\n    curr = dummy\\n    for x in lst:\\n        curr.next = ListNode(x)\\n        curr = curr.next\\n    return dummy.next\\n\\ndef show(head):\\n    out = []\\n    while head:\\n        out.append(head.val)\\n        head = head.next\\n    return out\\n\\n# ---- test ----\\nhead = build([1,2,3,4,5,6,7,8])\\nnew_head = reverse_alternating_k(head, 2)\\nprint(show(new_head))  # expect [2,1,3,4,6,5,7,8]",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use a boolean toggle to alternate between reversing and skipping groups of k nodes.",
    "The algorithm is still O(n) time and O(1) space — no extra list is created.",
    "Handle leftover nodes (<k) by leaving them as-is; they automatically become the last skipped group."
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
    curr = head
    for v in values[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def reverse_alternate_k(head, k):
    # TODO: reverse alternate k-element groups
    pass

# Test cases
print(to_list(reverse_alternate_k(build_list([1,2,3,4,5,6,7,8]), 2)))
# Expected: [2,1,3,4,6,5,7,8]

print(to_list(reverse_alternate_k(build_list([1,2,3,4,5,6]), 3)))
# Expected: [3,2,1,4,5,6]

print(to_list(reverse_alternate_k(build_list([1,2,3,4,5]), 1)))
# Expected: [1,2,3,4,5]
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def build_list(values):
    if not values:
        return None
    head = ListNode(values[0])
    curr = head
    for v in values[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def reverse_alternate_k(head, k):
    if k <= 1 or head is None:
        return head
    dummy = ListNode(0)
    dummy.next = head
    prev_group_end = dummy
    current = head
    should_reverse = True
    while current:
        if should_reverse:
            group_start = current
            prev = None
            count = 0
            while current and count < k:
                next_node = current.next
                current.next = prev
                prev = current
                current = next_node
                count += 1
            prev_group_end.next = prev
            group_start.next = current
            prev_group_end = group_start
        else:
            # Skip k nodes
            count = 0
            while current and count < k:
                prev_group_end = current
                current = current.next
                count += 1
        should_reverse = not should_reverse
    return dummy.next

# Test cases
print(to_list(reverse_alternate_k(build_list([1,2,3,4,5,6,7,8]), 2)))
# Expected: [2,1,3,4,6,5,7,8]

print(to_list(reverse_alternate_k(build_list([1,2,3,4,5,6]), 3)))
# Expected: [3,2,1,4,5,6]

print(to_list(reverse_alternate_k(build_list([1,2,3,4,5]), 1)))
# Expected: [1,2,3,4,5]
`,
    },
    {
      id: "ll-reversal-rotate",
      slug: "rotate-linked-list",
      title: "Rotate a Linked List",
      content: `## Rotate a Linked List

\`\`\`concept
{"title": "What \\"Rotate Right\\" Really Means", "variant": "mental-model", "content": "Imagine your linked list is a ring of train cars on a circular track.  Rotating right by k is simply choosing a new \\"engine\\" — the car that was k positions from the end becomes the new front, and the former last car now points to the old engine.  No cars are added or removed; we only reconnect the couplers."}
\`\`\`

### Problem Statement

Given the head of a singly linked list and a number \`k\`, rotate the list to the **right** by \`k\` positions.

\`\`\`algoviz
{"title": "Rotate 1 → 2 → 3 → 4 → 5 by k = 2", "type": "linkedlist", "data": [1,2,3,4,5], "frames": [
  {"highlight": [0,1,2,3,4], "label": "Original list", "stats": {"k":2,"n":5}},
  {"highlight": [3,4], "label": "Step 1: last k=2 nodes will become new front"},
  {"highlight": [2], "label": "Step 2: node at pos n-k-1=2 is new tail"},
  {"highlight": [3], "label": "Step 3: node 3 is new head"},
  {"highlight": [4,3,0,1,2], "label": "Step 4: reconnect; old tail→old head; new tail→null"}
], "speed": 1000}
\`\`\`

### Examples

\`\`\`
Input:  1 -> 2 -> 3 -> 4 -> 5, k=2
Output: 4 -> 5 -> 1 -> 2 -> 3
Explanation: Last 2 nodes move to the front.
\`\`\`

\`\`\`
Input:  1 -> 2 -> 3, k=1
Output: 3 -> 1 -> 2
\`\`\`

\`\`\`
Input:  1 -> 2 -> 3, k=3
Output: 1 -> 2 -> 3
Explanation: Rotating by the list length gives the same list.
\`\`\`

### Efficient In-Place Algorithm

1. Traverse once to compute length \`n\` and locate the tail.  
2. \`k = k % n\` (handles \`k ≥ n\`).  
3. If \`k == 0\` return head immediately.  
4. Make the list circular: \`tail.next = head\`.  
5. Walk \`n - k\` steps to the new tail (node at index \`n - k - 1\`).  
6. New head is \`newTail.next\`; break the circle: \`newTail.next = null\`.

\`\`\`trace
{"title": "Code Walk-through on 1→2→3→4→5, k=2", "language": "python", "code": "def rotateRight(head, k):\\n    if not head or k == 0:\\n        return head\\n    # 1st pass: find length & tail\\n    tail, n = head, 1\\n    while tail.next:\\n        tail = tail.next\\n        n += 1\\n    k %= n\\n    if k == 0:\\n        return head\\n    # make circular\\n    tail.next = head\\n    # 2nd pass: find new tail (n-k-1 steps)\\n    newTail = head\\n    for _ in range(n - k - 1):\\n        newTail = newTail.next\\n    newHead = newTail.next\\n    newTail.next = None\\n    return newHead", "frames": [
  {"line": 2, "vars": {"head": "Node(1)", "k": 2}, "note": "start", "stdout": ""},
  {"line": 6, "vars": {"tail": "Node(5)", "n": 5}, "note": "tail & length found", "stdout": ""},
  {"line": 11, "vars": {"k": 2}, "note": "k mod 5 = 2", "stdout": ""},
  {"line": 13, "vars": {}, "note": "list made circular", "stdout": ""},
  {"line": 16, "vars": {"newTail": "Node(3)"}, "note": "after 2 steps newTail=3", "stdout": ""},
  {"line": 17, "vars": {"newHead": "Node(4)"}, "note": "newHead is 4", "stdout": ""},
  {"line": 18, "vars": {}, "note": "circle broken", "stdout": ""},
  {"line": 19, "vars": {}, "note": "return newHead", "stdout": ""}
], "speed": 900}
\`\`\`

\`\`\`callout
{"type": "warning", "title": "Watch the Modulo", "content": "Forgetting \`k %= n\` is the #1 cause of timeouts and crashes.  Always normalize \`k\` before any pointer surgery."}
\`\`\`

### Complexity

- **Time:** O(n) — two passes at most.  
- **Space:** O(1) — only a few pointers regardless of input size.

\`\`\`quiz
{"title": "Quick Check", "questions": [
  {"question": "After rotating a list of length 100 by k=103, the effective k is:", "options": ["103", "3", "0", "100"], "answer": 1, "explanation": "k %= n → 103 % 100 = 3."},
  {"question": "Which step guarantees we do not rotate unnecessarily when k is a multiple of n?", "options": ["Finding the tail", "Making the list circular", "k %= n check", "Breaking the circle"], "answer": 2, "explanation": "The modulo reduces k to 0, and we return early."},
  {"question": "What is the space complexity of the in-place algorithm?", "options": ["O(n)", "O(k)", "O(1)", "O(log n)"], "answer": 2, "explanation": "Only a constant number of pointers are used."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Normalize k with modulo to avoid useless work and crashes.", "Form a circle once—then walk to the new tail and break the circle.", "Two passes give O(n) time and O(1) space, optimal for this problem."]}
\`\`\``,
      starterCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def build_list(values):
    if not values:
        return None
    head = ListNode(values[0])
    curr = head
    for v in values[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def rotate(head, k):
    # TODO: rotate the linked list by k positions to the right
    pass

# Test cases
print(to_list(rotate(build_list([1,2,3,4,5]), 2)))  # Expected: [4,5,1,2,3]
print(to_list(rotate(build_list([1,2,3]), 1)))        # Expected: [3,1,2]
print(to_list(rotate(build_list([1,2,3]), 3)))        # Expected: [1,2,3]
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def build_list(values):
    if not values:
        return None
    head = ListNode(values[0])
    curr = head
    for v in values[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def rotate(head, k):
    if not head or not head.next or k == 0:
        return head
    # Find length and tail
    length = 1
    tail = head
    while tail.next:
        tail = tail.next
        length += 1
    k = k % length
    if k == 0:
        return head
    # Find new tail: (length - k - 1) steps from head
    new_tail = head
    for _ in range(length - k - 1):
        new_tail = new_tail.next
    new_head = new_tail.next
    new_tail.next = None
    tail.next = head
    return new_head

# Test cases
print(to_list(rotate(build_list([1,2,3,4,5]), 2)))  # Expected: [4,5,1,2,3]
print(to_list(rotate(build_list([1,2,3]), 1)))        # Expected: [3,1,2]
print(to_list(rotate(build_list([1,2,3]), 3)))        # Expected: [1,2,3]
`,
    },
  ],
};
