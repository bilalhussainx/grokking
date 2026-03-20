import { Module } from "../types";

export const linkedListReversalModule: Module = {
  id: "linked-list-reversal",
  title: "In-place Reversal of a Linked List",
  description:
    "Master in-place linked list reversal — full reversal, sub-list reversal, and k-group variants.",
  lessons: [
    {
      id: "ll-reversal-intro",
      slug: "linked-list-reversal-intro",
      title: "Introduction to Linked List Reversal",
      content: `## In-place Reversal of a Linked List

Reversing a linked list is a foundational technique that appears in many interview problems. The key insight is manipulating **pointers** so that each node points to its predecessor instead of its successor.

### The Three-Pointer Technique

To reverse a linked list in-place, maintain three references:

| Pointer | Role |
|---------|------|
| \`prev\` | The previously processed node (starts as \`None\`). |
| \`current\` | The node currently being processed. |
| \`next_node\` | Temporary storage so we don't lose the rest of the list. |

### Step-by-Step

\`\`\`
1 -> 2 -> 3 -> None

Step 1: prev=None, curr=1
        Save next=2, point 1->None, prev=1, curr=2
Step 2: prev=1, curr=2
        Save next=3, point 2->1, prev=2, curr=3
Step 3: prev=2, curr=3
        Save next=None, point 3->2, prev=3, curr=None
Done: head = prev = 3
Result: 3 -> 2 -> 1 -> None
\`\`\`

### Variants

- **Reverse a sub-list:** Only reverse nodes between positions p and q.
- **Reverse in k-groups:** Reverse every k consecutive nodes.
- **Alternating reversal:** Reverse one group of k, skip the next, repeat.

### Implementation Note

Since we run Python in the browser, each problem defines a simple \`ListNode\` class and helper functions to build and display linked lists.

### Complexity

In-place reversal runs in **O(n)** time and **O(1)** space.

\`\`\`mermaid
graph LR
    subgraph Before["Before Reversal"]
        direction LR
        B1["1"] -->|"next"| B2["2"] -->|"next"| B3["3"] -->|"next"| B4["None"]
    end
    subgraph Pointers["Three Pointers"]
        P["prev=None"] -.-> B1
        C["current"] -.-> B1
        N["next_node"] -.-> B2
    end
    subgraph After["After Reversal"]
        direction LR
        A3["3"] -->|"next"| A2["2"] -->|"next"| A1["1"] -->|"next"| A0["None"]
    end
    Before -->|"Reverse each link"| After
    style P fill:#9C27B0,color:#fff
    style C fill:#4CAF50,color:#fff
    style N fill:#2196F3,color:#fff
\`\`\`

\`\`\`mermaid
graph TD
    S0["prev=None, curr=1, next=2"]
    S1["Set 1.next=None<br/>prev=1, curr=2, next=3"]
    S2["Set 2.next=1<br/>prev=2, curr=3, next=None"]
    S3["Set 3.next=2<br/>prev=3, curr=None"]
    S4["Return prev=3<br/>Result: 3->2->1->None"]
    S0 --> S1 --> S2 --> S3 --> S4
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

### Approach Hints

- Use three pointers: \`prev\`, \`current\`, \`next_node\`.
- At each step, save the next node, reverse the current node's pointer, and advance all three pointers.
- When \`current\` is \`None\`, \`prev\` is the new head.

\`\`\`mermaid
graph LR
    subgraph S1["Step 1: curr=1"]
        A1["None <-- 1  2 -> 3 -> 4 -> 5"]
    end
    subgraph S2["Step 2: curr=2"]
        A2["None <-- 1 <-- 2  3 -> 4 -> 5"]
    end
    subgraph S3["Step 3: curr=3"]
        A3["None <-- 1 <-- 2 <-- 3  4 -> 5"]
    end
    subgraph S4["Step 4: curr=4"]
        A4["None <-- 1 <-- 2 <-- 3 <-- 4  5"]
    end
    subgraph S5["Step 5: curr=5"]
        A5["5 -> 4 -> 3 -> 2 -> 1 -> None"]
    end
    S1 --> S2 --> S3 --> S4 --> S5
\`\`\`

### Complexity

- **Time:** O(n)
- **Space:** O(1)`,
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

### Approach Hints

1. Traverse to position \`p - 1\` to find the node just before the sub-list.
2. Reverse \`q - p + 1\` nodes using the standard reversal technique.
3. Connect the reversed sub-list back to the rest of the list.
4. Handle the edge case where \`p = 1\` (no node before the sub-list).

### Complexity

- **Time:** O(n)
- **Space:** O(1)`,
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

Given the head of a linked list and a number \`k\`, reverse the list in groups of \`k\` nodes. If the remaining nodes are fewer than \`k\`, reverse them as well.

### Examples

\`\`\`
Input:  1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8, k=3
Output: 3 -> 2 -> 1 -> 6 -> 5 -> 4 -> 8 -> 7
\`\`\`

\`\`\`
Input:  1 -> 2 -> 3 -> 4 -> 5, k=2
Output: 2 -> 1 -> 4 -> 3 -> 5
\`\`\`

\`\`\`
Input:  1 -> 2 -> 3, k=4
Output: 3 -> 2 -> 1
Explanation: Fewer than k nodes, reverse them all.
\`\`\`

### Approach Hints

1. Process k nodes at a time using the standard reversal technique.
2. Before reversing each group, remember the last node of the previous group (to reconnect).
3. After reversing, the first node of the original group becomes the last node of the reversed group — connect it to the next group.
4. Repeat until all nodes are processed.

### Complexity

- **Time:** O(n)
- **Space:** O(1)`,
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

### Approach Hints

- Similar to "Reverse every K", but after reversing k nodes, skip the next k nodes instead of reversing them.
- Use a flag or alternating logic to decide whether the current group should be reversed or skipped.

### Complexity

- **Time:** O(n)
- **Space:** O(1)`,
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

### Problem Statement

Given the head of a singly linked list and a number \`k\`, rotate the list to the **right** by \`k\` positions.

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

### Approach Hints

1. Find the length of the list and adjust \`k = k % length\` (handle k >= length).
2. If k is 0, return the list as-is.
3. Find the node at position \`length - k\` from the start. This is the new tail.
4. The node after it is the new head.
5. Connect the old tail to the old head to complete the rotation.

### Complexity

- **Time:** O(n) — two passes at most.
- **Space:** O(1)`,
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
