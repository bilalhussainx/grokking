import { Module } from "../types";

export const linkedListReversalModule: Module = {
  id: "linked-list-reversal",
  title: "Linked List Reversal",
  description:
    "Master the linked list reversal pattern for reversing entire lists, sublists, and handling k-group reversals. Essential for linked list manipulation problems.",
  lessons: [
    {
      id: "linked-list-reversal-intro",
      slug: "linked-list-reversal-intro",
      title: "Introduction to Linked List Reversal",
      content: `## The Linked List Reversal Pattern

The **linked list reversal** pattern is fundamental for manipulating linked lists, allowing you to reverse entire lists, specific sublists, or alternate nodes.

<!-- voice:section_check concept="linked list reversal basics" -->

### Why Linked List Reversal?

Many linked list problems require reversing portions of the list to achieve a desired configuration. Understanding the reversal mechanics is crucial for:
- Reversing entire lists
- Reversing sublists between positions
- K-group reversals
- Palindrome checking

### Basic Reversal Pattern

**Iterative Approach:**
~~~
prev = None
current = head

while current:
    next = current.next    # Store next
    current.next = prev    # Reverse the link
    prev = current         # Move prev forward
    current = next         # Move current forward

return prev  # New head
~~~

<!-- voice:key_insight insight="Reversal is about changing where each node's 'next' pointer points — from next node to previous node" -->

### Step-by-Step Pointer Manipulation

\`\`\`mermaid
graph LR
    subgraph Step1["Step 1: Store next"]
        P1["prev=None"] ~~~ C1["curr=1"] -->|next| N1["next=2"] --> X1["3"]
    end
    subgraph Step2["Step 2: Reverse link"]
        P2["prev=None"] <--|"curr.next = prev"| C2["curr=1"]
        N2["next=2"] --> X2["3"]
    end
    subgraph Step3["Step 3: Advance"]
        D1["1"] --- P3["prev=1"]
        C3["curr=2"] --> X3["3"]
    end
    Step1 --> Step2 --> Step3
    style C1 fill:#339af0,color:#fff
    style C2 fill:#339af0,color:#fff
    style C3 fill:#339af0,color:#fff
\`\`\`

> At each step: (1) save \`next\`, (2) reverse \`current.next\` to point to \`prev\`, (3) advance \`prev\` and \`current\` forward. After the loop, \`prev\` is the new head.

### Key Pointers

| Pointer | Purpose |
|---------|---------|
| **current** | The node being processed |
| **prev** | The node that will become the new 'next' |
| **next** | Temporary storage for the original next node |

### Complexity

- **Time:** O(n) — visit each node once
- **Space:** O(1) — iterative uses constant space`,
    },
    {
      id: "reverse-linked-list",
      slug: "reverse-linked-list",
      title: "Reverse a Linked List",
      content: `## Reverse a Linked List

<!-- voice:section_check concept="iterative list reversal" -->

### Problem Statement

Given the head of a singly linked list, reverse the list and return the new head.

### Examples

~~~
Input:  1 -> 2 -> 3 -> 4 -> 5 -> None
Output: 5 -> 4 -> 3 -> 2 -> 1 -> None
~~~

~~~
Input:  1 -> 2 -> None
Output: 2 -> 1 -> None
~~~

### Approach

Use three pointers iteratively:
1. **prev** — starts as None (will be new tail)
2. **current** — starts at head
3. **next** — temporarily stores current.next

At each step, reverse the link from current.next to point to prev instead.

<!-- voice:key_insight insight="The key is temporarily storing next before changing current.next, otherwise we lose the rest of the list" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) — single pass
- **Space:** O(1) — only using pointers`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverse_list(head):
    """
    Reverse a singly linked list iteratively.
    
    Args:
        head: ListNode, the head of the linked list
    
    Returns:
        ListNode: New head of the reversed list
    
    Example:
        >>> head = ListNode(1, ListNode(2, ListNode(3)))
        >>> reversed_head = reverse_list(head)
        >>> # 3 -> 2 -> 1
    """
    # TODO: Use three pointers (prev, current, next) to reverse links
    # Hint: Store next before changing current.next
    pass


def print_list(head):
    """Helper to print list"""
    result = []
    while head:
        result.append(head.val)
        head = head.next
    print(result)


# ─── Test Cases ───

# List: 1 -> 2 -> 3 -> 4 -> 5
head1 = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
print_list(reverse_list(head1))
# Expected: [5, 4, 3, 2, 1]

# List: 1 -> 2
head2 = ListNode(1, ListNode(2))
print_list(reverse_list(head2))
# Expected: [2, 1]

# Single node
head3 = ListNode(1)
print_list(reverse_list(head3))
# Expected: [1]

# Empty list
print_list(reverse_list(None))
# Expected: []
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverse_list(head):
    """
    Reverse a singly linked list iteratively.
    
    Time Complexity: O(n) — single pass
    Space Complexity: O(1) — only pointers
    """
    prev = None
    current = head
    
    while current:
        next_temp = current.next  # Store next node
        current.next = prev       # Reverse the link
        prev = current            # Move prev forward
        current = next_temp       # Move current forward
    
    return prev  # New head


def print_list(head):
    """Helper to print list"""
    result = []
    while head:
        result.append(head.val)
        head = head.next
    print(result)


# ─── Test Cases ───
head1 = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
print_list(reverse_list(head1))
# Expected: [5, 4, 3, 2, 1]

head2 = ListNode(1, ListNode(2))
print_list(reverse_list(head2))
# Expected: [2, 1]

head3 = ListNode(1)
print_list(reverse_list(head3))
# Expected: [1]

print_list(reverse_list(None))
# Expected: []
`,
    },
    {
      id: "reverse-sublist",
      slug: "reverse-sublist",
      title: "Reverse a Sub-list",
      content: `## Reverse a Sub-list

<!-- voice:section_check concept="reversing portion of linked list" -->

### Problem Statement

Given the head of a linked list and two positions left and right, reverse the nodes from position left to position right (1-indexed) and return the head.

### Examples

~~~
Input:  1 -> 2 -> 3 -> 4 -> 5, left = 2, right = 4
Output: 1 -> 4 -> 3 -> 2 -> 5
~~~

~~~
Input:  5, left = 1, right = 1
Output: 5
~~~

### Approach

1. Traverse to the node before position 'left' (call it 'before_sublist')
2. Reverse the sublist from left to right using standard reversal
3. Connect the reversed portion back:
   - before_sublist.next points to new sublist head
   - Sublist tail (original left node) points to node after 'right'

<!-- voice:key_insight insight="Save pointers to nodes before and after the sublist so you can reconnect after reversal" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — may traverse entire list
- **Space:** O(1) — only using pointers`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverse_between(head, left, right):
    """
    Reverse nodes of the list from position left to position right (1-indexed).
    
    Args:
        head: ListNode, head of the linked list
        left: int, starting position (1-indexed)
        right: int, ending position (1-indexed)
    
    Returns:
        ListNode: Head of modified list
    
    Example:
        >>> head = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
        >>> result = reverse_between(head, 2, 4)
        >>> # 1 -> 4 -> 3 -> 2 -> 5
    """
    # TODO: Find node before left, reverse sublist, reconnect
    # Hint: Use dummy node to handle edge case when left = 1
    pass


def print_list(head):
    """Helper to print list"""
    result = []
    while head:
        result.append(head.val)
        head = head.next
    print(result)


# ─── Test Cases ───

# Reverse middle portion
head1 = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
print_list(reverse_between(head1, 2, 4))
# Expected: [1, 4, 3, 2, 5]

# Reverse from start
head2 = ListNode(1, ListNode(2, ListNode(3)))
print_list(reverse_between(head2, 1, 2))
# Expected: [2, 1, 3]

# Reverse entire list
head3 = ListNode(1, ListNode(2, ListNode(3)))
print_list(reverse_between(head3, 1, 3))
# Expected: [3, 2, 1]

# Single node
head4 = ListNode(5)
print_list(reverse_between(head4, 1, 1))
# Expected: [5]

# Reverse single element
head5 = ListNode(1, ListNode(2, ListNode(3)))
print_list(reverse_between(head5, 2, 2))
# Expected: [1, 2, 3]
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverse_between(head, left, right):
    """
    Reverse nodes of the list from position left to position right.
    
    Time Complexity: O(n) — traverse to right position
    Space Complexity: O(1) — only pointers
    """
    if not head or left == right:
        return head
    
    # Dummy node helps when left = 1
    dummy = ListNode(0)
    dummy.next = head
    
    # Find node before the sublist
    prev = dummy
    for _ in range(left - 1):
        prev = prev.next
    
    # Reverse the sublist
    current = prev.next  # First node of sublist (will become last)
    for _ in range(right - left):
        next_temp = current.next
        current.next = next_temp.next
        next_temp.next = prev.next
        prev.next = next_temp
    
    return dummy.next


def print_list(head):
    """Helper to print list"""
    result = []
    while head:
        result.append(head.val)
        head = head.next
    print(result)


# ─── Test Cases ───
head1 = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
print_list(reverse_between(head1, 2, 4))
# Expected: [1, 4, 3, 2, 5]

head2 = ListNode(1, ListNode(2, ListNode(3)))
print_list(reverse_between(head2, 1, 2))
# Expected: [2, 1, 3]

head3 = ListNode(1, ListNode(2, ListNode(3)))
print_list(reverse_between(head3, 1, 3))
# Expected: [3, 2, 1]

head4 = ListNode(5)
print_list(reverse_between(head4, 1, 1))
# Expected: [5]

head5 = ListNode(1, ListNode(2, ListNode(3)))
print_list(reverse_between(head5, 2, 2))
# Expected: [1, 2, 3]
`,
    },
    {
      id: "reverse-k-group",
      slug: "reverse-k-group",
      title: "Reverse Every K-Element Sub-list",
      content: `## Reverse Every K-Element Sub-list

<!-- voice:section_check concept="reversing in k-sized chunks" -->

### Problem Statement

Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list. k is a positive integer and is less than or equal to the length of the linked list.

### Examples

~~~
Input:  1 -> 2 -> 3 -> 4 -> 5, k = 2
Output: 2 -> 1 -> 4 -> 3 -> 5
~~~

~~~
Input:  1 -> 2 -> 3 -> 4 -> 5, k = 3
Output: 3 -> 2 -> 1 -> 4 -> 5
~~~

### Approach

1. Reverse the first k nodes
2. The k+1-th node becomes the new head for the next segment
3. Connect the tail of the reversed segment (original head) to the result of reversing the rest
4. Repeat until fewer than k nodes remain

<!-- voice:key_insight insight="After reversing k nodes, the original head becomes the tail and should connect to the result of reversing the remaining list" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — each node visited once
- **Space:** O(1) — iterative approach`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverse_k_group(head, k):
    """
    Reverse the nodes of the list k at a time.
    
    Args:
        head: ListNode, head of the linked list
        k: int, size of groups to reverse
    
    Returns:
        ListNode: Head of modified list
    
    Example:
        >>> head = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
        >>> result = reverse_k_group(head, 2)
        >>> # 2 -> 1 -> 4 -> 3 -> 5
    """
    # TODO: Reverse first k nodes, then recursively reverse rest
    # Hint: Check if k nodes exist, reverse them, connect to reversed rest
    pass


def print_list(head):
    """Helper to print list"""
    result = []
    while head:
        result.append(head.val)
        head = head.next
    print(result)


# ─── Test Cases ───

# k = 2
head1 = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
print_list(reverse_k_group(head1, 2))
# Expected: [2, 1, 4, 3, 5]

# k = 3
head2 = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
print_list(reverse_k_group(head2, 3))
# Expected: [3, 2, 1, 4, 5]

# k = 1 (no reversal)
head3 = ListNode(1, ListNode(2, ListNode(3)))
print_list(reverse_k_group(head3, 1))
# Expected: [1, 2, 3]

# k equals list length
head4 = ListNode(1, ListNode(2, ListNode(3)))
print_list(reverse_k_group(head4, 3))
# Expected: [3, 2, 1]

# Single node
head5 = ListNode(1)
print_list(reverse_k_group(head5, 1))
# Expected: [1]
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverse_k_group(head, k):
    """
    Reverse the nodes of the list k at a time.
    
    Time Complexity: O(n) — each node visited once
    Space Complexity: O(1) — iterative
    """
    # Check if we have k nodes remaining
    count = 0
    curr = head
    while curr and count < k:
        curr = curr.next
        count += 1
    
    if count < k:
        return head  # Less than k nodes, don't reverse
    
    # Reverse k nodes
    prev = None
    curr = head
    for _ in range(k):
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    
    # head is now the tail of reversed group, connect to reversed rest
    head.next = reverse_k_group(curr, k)
    
    return prev  # New head of this group


def print_list(head):
    """Helper to print list"""
    result = []
    while head:
        result.append(head.val)
        head = head.next
    print(result)


# ─── Test Cases ───
head1 = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
print_list(reverse_k_group(head1, 2))
# Expected: [2, 1, 4, 3, 5]

head2 = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
print_list(reverse_k_group(head2, 3))
# Expected: [3, 2, 1, 4, 5]

head3 = ListNode(1, ListNode(2, ListNode(3)))
print_list(reverse_k_group(head3, 1))
# Expected: [1, 2, 3]

head4 = ListNode(1, ListNode(2, ListNode(3)))
print_list(reverse_k_group(head4, 3))
# Expected: [3, 2, 1]

head5 = ListNode(1)
print_list(reverse_k_group(head5, 1))
# Expected: [1]
`,
    },
    {
      id: "rotate-linked-list",
      slug: "rotate-linked-list",
      title: "Rotate a Linked List",
      content: `## Rotate a Linked List

<!-- voice:section_check concept="rotating list using reversal" -->

### Problem Statement

Given the head of a linked list, rotate the list to the right by k places.

### Examples

~~~
Input:  1 -> 2 -> 3 -> 4 -> 5, k = 2
Output: 4 -> 5 -> 1 -> 2 -> 3
~~~

~~~
Input:  0 -> 1 -> 2, k = 4
Output: 2 -> 0 -> 1
Explanation: Rotate by 4 is same as rotate by 1 (4 % 3 = 1)
~~~

### Approach

1. Find length of list and connect tail to head (make circular)
2. Calculate effective rotations: k = k % length
3. Find new tail at position (length - k)
4. New head is next of new tail
5. Break the circle by setting new tail's next to None

<!-- voice:key_insight insight="Make the list circular, then find the new break point based on k mod length" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — find length and new tail
- **Space:** O(1) — only pointers`,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def rotate_right(head, k):
    """
    Rotate the list to the right by k places.
    
    Args:
        head: ListNode, head of the linked list
        k: int, number of places to rotate
    
    Returns:
        ListNode: Head of rotated list
    
    Example:
        >>> head = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
        >>> result = rotate_right(head, 2)
        >>> # 4 -> 5 -> 1 -> 2 -> 3
    """
    # TODO: Find length, make circular, find new tail, break circle
    # Hint: k may be larger than list length, use modulo
    pass


def print_list(head):
    """Helper to print list"""
    result = []
    while head:
        result.append(head.val)
        head = head.next
    print(result)


# ─── Test Cases ───

# Rotate by 2
head1 = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
print_list(rotate_right(head1, 2))
# Expected: [4, 5, 1, 2, 3]

# k > length
head2 = ListNode(0, ListNode(1, ListNode(2)))
print_list(rotate_right(head2, 4))
# Expected: [2, 0, 1]

# k = 0
head3 = ListNode(1, ListNode(2, ListNode(3)))
print_list(rotate_right(head3, 0))
# Expected: [1, 2, 3]

# Single node
head4 = ListNode(1)
print_list(rotate_right(head4, 10))
# Expected: [1]

# Empty list
print_list(rotate_right(None, 5))
# Expected: []
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def rotate_right(head, k):
    """
    Rotate the list to the right by k places.
    
    Time Complexity: O(n) — find length and new tail
    Space Complexity: O(1) — only pointers
    """
    if not head or not head.next or k == 0:
        return head
    
    # Find length and tail
    length = 1
    tail = head
    while tail.next:
        tail = tail.next
        length += 1
    
    # Make circular
    tail.next = head
    
    # Find new tail position
    k = k % length
    if k == 0:
        tail.next = None
        return head
    
    # New tail is at position (length - k)
    steps_to_new_tail = length - k
    new_tail = head
    for _ in range(steps_to_new_tail - 1):
        new_tail = new_tail.next
    
    new_head = new_tail.next
    new_tail.next = None
    
    return new_head


def print_list(head):
    """Helper to print list"""
    result = []
    while head:
        result.append(head.val)
        head = head.next
    print(result)


# ─── Test Cases ───
head1 = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
print_list(rotate_right(head1, 2))
# Expected: [4, 5, 1, 2, 3]

head2 = ListNode(0, ListNode(1, ListNode(2)))
print_list(rotate_right(head2, 4))
# Expected: [2, 0, 1]

head3 = ListNode(1, ListNode(2, ListNode(3)))
print_list(rotate_right(head3, 0))
# Expected: [1, 2, 3]

head4 = ListNode(1)
print_list(rotate_right(head4, 10))
# Expected: [1]

print_list(rotate_right(None, 5))
# Expected: []
`,
    },
    {
      id: "linked-list-reversal-checkpoint",
      slug: "linked-list-reversal-checkpoint",
      title: "Module Checkpoint: Linked List Reversal",
      content: `## Module Checkpoint: Linked List Reversal

<!-- voice:checkpoint_intro -->

Great work on the Linked List Reversal module! Let's verify your understanding.

### Quick Review

You learned:
- **Iterative reversal** using three pointers
- Reversing a **sublist** between positions
- **K-group reversal** for chunk-based reversal
- **Rotation** using circular list technique

### Quiz

**Question 1:** In iterative linked list reversal, why do we need a temporary 'next' pointer?
- A) To find the middle of the list
- B) To keep track of the original next node before we change the link
- C) To detect cycles
- D) To count the list length

**Question 2:** What is the time complexity of reversing a linked list?
- A) O(log n)
- B) O(n)
- C) O(n²)
- D) O(1)

**Question 3:** When reversing a sublist, what node should the original head of the sublist connect to?
- A) The node before the sublist
- B) The node after the sublist
- C) The new head
- D) It becomes the new tail and connects to the remaining list

**Question 4:** True or False: Linked list rotation requires O(n) extra space.

**Question 5:** In k-group reversal, what happens if fewer than k nodes remain?
- A) Reverse them anyway
- B) Leave them as-is
- C) Remove them
- D) Return None

### Voice Summary

Your coach will ask you to:
- Walk through reversing a linked list step by step
- Explain how to reverse every k nodes
- Describe a real-world scenario where list rotation is useful

**You're mastering linked list manipulation!**`,
    },
  ],
};
