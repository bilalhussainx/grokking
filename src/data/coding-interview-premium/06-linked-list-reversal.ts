import { Module } from "../types";

export const linkedListReversalModule: Module = {
  id: "linked-list-reversal",
  title: "Linked List Reversal",
  description: "Master the linked list reversal pattern for reversing entire lists, sublists, and handling k-group reversals. Essential for linked list manipulation problems.",
  lessons: [
    {
      id: "linked-list-reversal-intro",
      slug: "linked-list-reversal-intro",
      title: "Introduction to Linked List Reversal",
      content: `## The Linked List Reversal Pattern

\`\`\`concept
{ "title": "The Core Mental Model", "variant": "mental-model", "content": "Linked list reversal is about redirecting arrows, not moving data. Every node has a \`next\` pointer aimed forward — reversal flips each of those arrows to point backward. Three pointers (\`prev\`, \`curr\`, \`next_node\`) march through the list in lockstep, one node at a time, until every link is reversed and the original tail becomes the new head." }
\`\`\`

### Why Linked List Reversal?

Many linked list problems require rearranging structure without allocating extra space. The three-pointer reversal mechanic you learn here is the engine behind:

- **Reverse entire list** — LeetCode 206
- **Reverse a sublist** between positions \`left\` and \`right\` — LeetCode 92
- **Reverse in k-groups** — LeetCode 25
- **Palindrome detection** — compare first half with reversed second half (LeetCode 234)

Each problem layers on top of the same core pattern. Master it once, apply it everywhere.

\`\`\`callout
{ "type": "info", "title": "Pointers, Not Values", "content": "This algorithm rewires \`next\` pointers — it never reads or writes node values. No extra nodes are created. That is why space stays O(1) regardless of list length." }
\`\`\`

### The Three-Pointer Algorithm

\`\`\`steps
{ "title": "Iterative Reversal — Step by Step", "steps": [ { "title": "Initialise the two anchors", "content": "Set \`prev = None\` and \`curr = head\`. \`prev\` represents the node that will become \`curr\`'s new next. It starts as \`None\` because the original head will become the tail, which must point to \`None\`." }, { "title": "Save the next node (critical!)", "content": "Before touching any pointer, execute \`next_node = curr.next\`. This saves your only reference to the rest of the list. Skip this and the chain is severed permanently." }, { "title": "Reverse the current link", "content": "Set \`curr.next = prev\`. This is the actual reversal — the current node stops pointing forward and now points backward to whatever \`prev\` is." }, { "title": "Advance both pointers forward", "content": "Set \`prev = curr\`, then \`curr = next_node\`. \`prev\` has caught up to the last processed node; \`curr\` moves to the node we saved in step 2." }, { "title": "Return prev, not curr", "content": "When \`curr\` becomes \`None\` the entire list is reversed. At that moment, \`prev\` is sitting on the original tail — now the new head. Return \`prev\`." } ] }
\`\`\`

### Algorithm Trace on \`1 → 2 → 3 → None\`

\`\`\`trace
{ "title": "Full reversal trace — [1, 2, 3]", "language": "python", "code": "def reverse_list(head):\\n    prev = None\\n    curr = head\\n\\n    while curr:\\n        next_node = curr.next\\n        curr.next = prev\\n        prev = curr\\n        curr = next_node\\n\\n    return prev", "frames": [ { "line": 2, "vars": { "prev": "None", "curr": "—" }, "note": "prev = None; the future tail must point to None" }, { "line": 3, "vars": { "prev": "None", "curr": "Node(1)" }, "note": "curr starts at head" }, { "line": 5, "vars": { "prev": "None", "curr": "Node(1)" }, "note": "curr is truthy — enter loop, iteration 1" }, { "line": 6, "vars": { "prev": "None", "curr": "Node(1)", "next_node": "Node(2)" }, "note": "Save next_node before severing the forward link" }, { "line": 7, "vars": { "prev": "None", "curr": "Node(1)→None", "next_node": "Node(2)" }, "note": "Reverse: Node(1).next now points to prev (None)" }, { "line": 8, "vars": { "prev": "Node(1)", "curr": "Node(1)→None", "next_node": "Node(2)" }, "note": "Advance prev up to Node(1)" }, { "line": 9, "vars": { "prev": "Node(1)", "curr": "Node(2)", "next_node": "Node(2)" }, "note": "Advance curr to the saved next_node" }, { "line": 5, "vars": { "prev": "Node(1)", "curr": "Node(2)" }, "note": "curr truthy — loop again, iteration 2" }, { "line": 6, "vars": { "prev": "Node(1)", "curr": "Node(2)", "next_node": "Node(3)" }, "note": "Save next_node = Node(3)" }, { "line": 7, "vars": { "prev": "Node(1)", "curr": "Node(2)→Node(1)", "next_node": "Node(3)" }, "note": "Reverse: Node(2).next → Node(1)" }, { "line": 8, "vars": { "prev": "Node(2)", "curr": "Node(2)→Node(1)", "next_node": "Node(3)" }, "note": "Advance prev to Node(2)" }, { "line": 9, "vars": { "prev": "Node(2)", "curr": "Node(3)", "next_node": "Node(3)" }, "note": "Advance curr to Node(3)" }, { "line": 5, "vars": { "prev": "Node(2)", "curr": "Node(3)" }, "note": "curr truthy — loop again, iteration 3" }, { "line": 6, "vars": { "prev": "Node(2)", "curr": "Node(3)", "next_node": "None" }, "note": "Save next_node = None (tail's original next)" }, { "line": 7, "vars": { "prev": "Node(2)", "curr": "Node(3)→Node(2)", "next_node": "None" }, "note": "Reverse: Node(3).next → Node(2)" }, { "line": 8, "vars": { "prev": "Node(3)", "curr": "Node(3)→Node(2)", "next_node": "None" }, "note": "Advance prev to Node(3)" }, { "line": 9, "vars": { "prev": "Node(3)", "curr": "None" }, "note": "curr advances to None — loop will exit" }, { "line": 5, "vars": { "prev": "Node(3)", "curr": "None" }, "note": "curr is None — exit loop" }, { "line": 11, "vars": { "prev": "Node(3)→Node(2)→Node(1)→None", "return": "Node(3)" }, "note": "prev is the new head — return it" } ], "speed": 800 }
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "The One Mistake That Destroys the List", "content": "Writing \`curr.next = prev\` before \`next_node = curr.next\` overwrites your only pointer to the rest of the list. The unreachable nodes are gone. Always save \`next_node\` first — every time, no exceptions." }
\`\`\`

### Pointer Roles at a Glance

| Pointer | Purpose | Value when loop ends |
|---------|---------|----------------------|
| \`curr\` | The node currently being reversed | \`None\` |
| \`prev\` | Receives \`curr\`'s reversed link; new head at end | Original tail — **return this** |
| \`next_node\` | Temporary save of \`curr.next\` before severing | \`None\` (last node's original next) |

### Complexity

| Dimension | Value | Reason |
|-----------|-------|--------|
| **Time** | O(n) | Every node is visited exactly once |
| **Space** | O(1) | Three scalar pointers — independent of list length |

\`\`\`quiz
{ "title": "Reversal Fundamentals", "questions": [ { "question": "After calling \`reverse_list\` on \`1 → 2 → 3 → 4\`, which node does the return value point to?", "options": ["Node(1) — the original head", "Node(4) — the original tail", "None — the list was cleared", "Node(2) — the second node"], "answer": 1, "explanation": "The function returns \`prev\`. When the loop exits (curr = None), prev is sitting on the last node visited — the original tail, Node(4). It is now the new head." }, { "question": "What goes wrong if you write \`curr.next = prev\` before \`next_node = curr.next\`?", "options": [ "Nothing — the order does not matter for correctness", "curr.next becomes None and the reversal stops early", "The only reference to the remaining list is overwritten and those nodes become unreachable", "prev is set to the wrong node" ], "answer": 2, "explanation": "curr.next is your only pointer to the rest of the list. Overwriting it with prev severs that link. There is no other way to reach the subsequent nodes — they are permanently lost." }, { "question": "Reversing a single-node list \`5 → None\` with this algorithm returns:", "options": ["None — the while loop never runs", "A new copy of Node(5)", "Node(5) itself (the original node, unchanged)", "Node(5) with its next pointer set to itself"], "answer": 2, "explanation": "curr = Node(5) is truthy, so the loop runs once: next_node = None, curr.next = None (already None), prev = Node(5), curr = None. We return prev = Node(5). Same node, nothing changed." }, { "question": "Which statement about the space complexity is correct?", "options": [ "O(n) — three pointers are needed per node", "O(log n) — the algorithm is divide-and-conquer", "O(n) — we store the entire reversed list as we go", "O(1) — only three pointers are used regardless of n" ], "answer": 3, "explanation": "prev, curr, and next_node are three scalar variables. Their count does not grow with the input size, so auxiliary space is O(1)." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Reversal rewires \`next\` pointers — never node values — giving O(1) auxiliary space.", "The mandatory order is: (1) save \`next_node\`, (2) set \`curr.next = prev\`, (3) advance \`prev\`, (4) advance \`curr\`.", "Skipping the \`next_node\` save before reversing \`curr.next\` permanently loses the rest of the list.", "When the loop exits \`curr\` is \`None\`; the new head is \`prev\` — always return \`prev\`.", "This three-pointer mechanic is the shared foundation of sublist reversal, k-group reversal, and linked-list palindrome detection." ] }
\`\`\``,
    },
    {
      id: "reverse-linked-list",
      slug: "reverse-linked-list",
      title: "Reverse a Linked List",
      content: `## Reverse a Linked List

<!-- voice:section_check concept="iterative list reversal" -->

### Problem Statement

Given the head of a singly linked list, reverse the list and return the new head.

| Input | Output |
|-------|--------|
| \`1 → 2 → 3 → 4 → 5 → None\` | \`5 → 4 → 3 → 2 → 1 → None\` |
| \`1 → 2 → None\` | \`2 → 1 → None\` |
| \`None\` (empty list) | \`None\` |

\`\`\`concept
{ "title": "The Three-Pointer Dance", "variant": "mental-model", "content": "Picture a chain of nodes, each gripping the one ahead. To reverse the chain:\\n\\n**prev** — the last node you've already re-pointed (starts as None, becomes the new tail's sentinel)\\n\\n**curr** — the node whose link you're flipping right now\\n\\n**next_node** — the node you must remember before you cut the forward link\\n\\nAt each step: save next → flip link → step forward. Repeat until curr falls off the end; prev is your new head." }
\`\`\`

### The Algorithm: Step by Step

\`\`\`steps
{ "title": "Iterative Reversal Algorithm", "steps": [ { "title": "Initialize prev and curr", "content": "Set \`prev = None\` and \`curr = head\`. The \`prev = None\` is intentional — when the original head becomes the new tail, its \`.next\` must point to \`None\`." }, { "title": "Save next_node before overwriting", "content": "\`next_node = curr.next\`\\n\\nThis is the non-negotiable first line inside the loop. As soon as you reassign \`curr.next\`, the path forward is gone — this save is your only lifeline to the rest of the list." }, { "title": "Reverse the current link", "content": "\`curr.next = prev\`\\n\\nFlip the arrow. Instead of pointing forward, \`curr\` now points to the node behind it. One link reversed." }, { "title": "Advance both pointers", "content": "\`prev = curr\` then \`curr = next_node\`\\n\\nLock in the progress: prev catches up to curr, then curr leaps to the saved next node. Ready for the next iteration." }, { "title": "Return the new head", "content": "When \`curr\` is \`None\` (past the last node), \`prev\` sits on the original last node — which is now the head of the reversed list. Return \`prev\`." } ] }
\`\`\`

<!-- voice:key_insight insight="The key is temporarily storing next before changing current.next, otherwise we lose the rest of the list" -->

### Visualizing the Reversal

\`\`\`algoviz
{ "title": "Three-Pointer Reversal on [1, 2, 3, 4, 5]", "type": "linkedlist", "data": [1, 2, 3, 4, 5], "frames": [ { "highlight": [0], "label": "Init: prev=None, curr=Node(1)", "stats": {"prev": "None", "curr": 1} }, { "highlight": [0], "label": "Save next=2, flip 1→None, advance: prev=1, curr=2", "stats": {"prev": 1, "curr": 2} }, { "highlight": [1], "label": "Save next=3, flip 2→1, advance: prev=2, curr=3", "stats": {"prev": 2, "curr": 3} }, { "highlight": [2], "label": "Save next=4, flip 3→2, advance: prev=3, curr=4", "stats": {"prev": 3, "curr": 4} }, { "highlight": [3], "label": "Save next=5, flip 4→3, advance: prev=4, curr=5", "stats": {"prev": 4, "curr": 5} }, { "highlight": [4], "label": "Save next=None, flip 5→4, advance: prev=5, curr=None", "stats": {"prev": 5, "curr": "None"} }, { "highlight": [], "label": "curr is None — loop exits. Return prev=Node(5): the new head!", "stats": {"new_head": 5} } ], "speed": 850 }
\`\`\`

### Iterative vs. Recursive

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Recursive — O(n) Call Stack", "code": "def reverseList(head):\\n    # Base case: empty or single node\\n    if not head or not head.next:\\n        return head\\n    # Reverse the rest of the list first\\n    new_head = reverseList(head.next)\\n    # head.next is now the tail — point it back\\n    head.next.next = head\\n    head.next = None  # cut old forward link (avoid cycle!)\\n    return new_head" }, "after": { "label": "Iterative — O(1) Space (Preferred)", "code": "def reverseList(head):\\n    prev = None\\n    curr = head\\n    while curr:\\n        next_node = curr.next  # 1. save next\\n        curr.next = prev       # 2. reverse link\\n        prev = curr            # 3. advance prev\\n        curr = next_node       # 4. advance curr\\n    return prev  # prev is the new head" } }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Recursive Risk: Stack Overflow", "content": "Python's default recursion limit is ~1,000 frames. A list with 10,000 nodes will crash the recursive solution with a \`RecursionError\`. For lists of unknown length, always prefer the iterative approach in production code and in interviews." }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Interview Strategy: Lead with Iterative", "content": "Open with the iterative solution — state 'O(n) time, O(1) space.' Then volunteer the recursive variant and explain why it costs O(n) space. Showing both with clear trade-off reasoning earns extra credit with interviewers." }
\`\`\`

### Complexity

| Approach | Time | Space | Notes |
|---|---|---|---|
| Iterative | O(n) | O(1) | Single pass, three pointers only |
| Recursive | O(n) | O(n) | One stack frame per node |

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

\`\`\`quiz
{ "title": "Reverse a Linked List — Check Your Understanding", "questions": [ { "question": "What does \`prev\` contain when the while loop exits?", "options": ["None — it was never reassigned from its initial value", "The original head node", "The last node of the original list, which is the new head", "The middle node of the list"], "answer": 2, "explanation": "When \`curr\` becomes None (we've stepped past the last node), \`prev\` is sitting on the original last node. After all the reversals, this node is the new head — so we return \`prev\`." }, { "question": "Why is \`next_node = curr.next\` placed as the very first line inside the loop?", "options": ["To detect whether the list contains a cycle", "Because \`curr.next\` is overwritten on the very next line, permanently losing our path forward", "To count how many nodes remain to be processed", "It is optional — the original next pointer can always be recovered from prev"], "answer": 1, "explanation": "We immediately overwrite \`curr.next = prev\` after saving next_node. Without the save, the only reference to the rest of the list is gone — we'd strand every node beyond curr on each iteration." }, { "question": "What is the space complexity of the iterative reversal?", "options": ["O(n) — one pointer variable allocated per node", "O(log n) — pointer arithmetic scales logarithmically", "O(1) — three pointer variables regardless of list length", "O(n²) — two nested traversals needed"], "answer": 2, "explanation": "The iterative approach uses exactly three pointer variables (prev, curr, next_node) no matter how long the list is. That is constant — O(1) — extra space." }, { "question": "In the recursive solution, what happens if you forget the line \`head.next = None\`?", "options": ["The function returns the wrong new head node", "The original head creates a cycle — head.next still points forward while head.next.next now points back to head", "The recursion runs indefinitely until a stack overflow", "Nothing — it is a harmless no-op"], "answer": 1, "explanation": "After \`head.next.next = head\`, the next node points back to head AND head still points forward to it — a two-node cycle. Setting \`head.next = None\` cuts this cycle, making head the proper new tail." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["Three pointers — prev, curr, next_node — are all you need for an O(1) space reversal", "Always save next_node before overwriting curr.next, or you'll permanently sever the remaining list", "The iterative solution handles empty lists and single-node lists automatically via the while condition — no special cases needed", "Recursive reversal is elegant but uses O(n) call-stack space and risks overflow on long lists", "After the loop, prev (not curr) holds the new head — return prev, never curr"] }
\`\`\``,
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

\`\`\`concept
{ "title": "The Three-Zone Mental Model", "variant": "mental-model", "content": "Every sub-list reversal divides the list into three zones: **Before** (positions 1 to left-1, untouched), **Target** (positions left to right, reversed in-place), and **After** (positions right+1 to end, untouched). Your only job is to reverse the Target zone and stitch all three zones back together with exactly two pointer assignments." }
\`\`\`

### Problem Statement

Given the head of a linked list and two 1-indexed positions \`left\` and \`right\`, reverse only the nodes from position \`left\` to position \`right\` and return the modified head.

| Input | left | right | Output |
|-------|------|-------|--------|
| 1 → 2 → 3 → 4 → 5 | 2 | 4 | 1 → 4 → 3 → 2 → 5 |
| 5 | 1 | 1 | 5 |

\`\`\`callout
{ "type": "info", "title": "Key Constraint", "content": "Positions are **1-indexed**. When \`left == right\`, no reversal is needed — return the head unchanged. The algorithm must run in **O(N) time** and **O(1) space**: pointer manipulation only, no auxiliary arrays." }
\`\`\`

### Algorithm

\`\`\`steps
{ "title": "In-Place Sub-list Reversal", "steps": [ { "title": "Attach a dummy node", "content": "Prepend \`dummy\` with \`dummy.next = head\`. This eliminates the edge case where \`left == 1\` — you always have a node *before* the sub-list to serve as an anchor, so the reconnection logic stays uniform." }, { "title": "Walk to the node before position left", "content": "Advance \`before_sublist\` exactly \`left - 1\` steps from \`dummy\`. After this walk:\\n- \`before_sublist\` = last untouched node before the target zone\\n- \`sublist_tail = before_sublist.next\` = node that will become the **tail** after reversal (save this now — the loop will overwrite its \`.next\`)" }, { "title": "Reverse right − left + 1 nodes", "content": "Run the standard in-place reversal for exactly \`right - left + 1\` iterations:\\n\\n\`\`\`\\nprev = before_sublist\\ncurrent = sublist_tail\\nfor _ in range(right - left + 1):\\n    nxt = current.next\\n    current.next = prev\\n    prev = current\\n    current = nxt\\n\`\`\`\\n\\nWhen the loop exits: \`prev\` = new sub-list head (original node at \`right\`), \`current\` = first node of the after-zone." }, { "title": "Reconnect the three zones", "content": "Two assignments close every gap:\\n1. \`before_sublist.next = prev\` — Before-zone now points to the new sub-list head\\n2. \`sublist_tail.next = current\` — Reversed tail links to the After-zone\\n\\nThese two lines are the entire stitching step." }, { "title": "Return dummy.next", "content": "Return \`dummy.next\`, not \`head\`. When \`left == 1\`, the original head moved into the middle of the reversed section — \`dummy.next\` always points to the correct new front of the list." } ] }
\`\`\`

### Execution Trace — [1→2→3→4→5], left=2, right=4

\`\`\`algoviz
{ "title": "Sub-list Reversal: positions 2 to 4", "type": "linkedlist", "data": [1, 2, 3, 4, 5], "frames": [ { "highlight": [], "label": "Initial list. Reverse positions 2–4 (values 2, 3, 4).", "stats": { "left": 2, "right": 4 } }, { "highlight": [0], "label": "Walk left-1=1 steps from dummy. before_sublist=node(1), sublist_tail=node(2).", "stats": { "before_sublist": 1, "sublist_tail": 2 } }, { "highlight": [1], "label": "Iteration 1: flip node(2).next → before_sublist. prev=node(2), current=node(3).", "stats": { "prev": 2, "current": 3 } }, { "highlight": [2], "label": "Iteration 2: flip node(3).next → node(2). prev=node(3), current=node(4).", "stats": { "prev": 3, "current": 4 } }, { "highlight": [3], "label": "Iteration 3: flip node(4).next → node(3). prev=node(4), current=node(5). Loop ends.", "stats": { "prev": 4, "current": 5 } }, { "highlight": [0, 1, 2, 3, 4], "label": "Reconnect: node(1).next=node(4) and node(2).next=node(5). Result: 1→4→3→2→5.", "stats": { "result": "1→4→3→2→5" } } ], "speed": 900 }
\`\`\`

### Implementation

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Naive: swap values (O(n) space)", "code": "def reverseBetween(head, left, right):\\n    vals, node = [], head\\n    while node:\\n        vals.append(node.val)\\n        node = node.next\\n    vals[left-1:right] = vals[left-1:right][::-1]\\n    node = head\\n    for v in vals:\\n        node.val = v\\n        node = node.next\\n    return head\\n# Copies all values — O(n) extra space\\n# Also illegal if nodes store non-copyable data" }, "after": { "label": "Optimal: in-place pointer reversal — O(1) space", "code": "def reverseBetween(head, left, right):\\n    dummy = ListNode(0)\\n    dummy.next = head\\n    before_sublist = dummy\\n\\n    for _ in range(left - 1):\\n        before_sublist = before_sublist.next\\n\\n    # sublist_tail becomes the tail after reversal\\n    sublist_tail = before_sublist.next\\n    prev = before_sublist\\n    current = sublist_tail\\n\\n    for _ in range(right - left + 1):\\n        nxt = current.next\\n        current.next = prev\\n        prev = current\\n        current = nxt\\n\\n    # Stitch the three zones back together\\n    before_sublist.next = prev    # Before → new head\\n    sublist_tail.next = current   # Old head (now tail) → After\\n\\n    return dummy.next\\n# Time: O(N) | Space: O(1)" } }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Classic Bug: Losing the After-zone", "content": "If you forget to save \`sublist_tail = before_sublist.next\` **before** starting the reversal loop, the loop overwrites \`sublist_tail.next\` and you permanently lose the reference to the after-zone. Always capture this pointer first — it is the only link to everything past position \`right\`." }
\`\`\`

### Complexity

| Dimension | Value | Reason |
|-----------|-------|--------|
| **Time** | O(N) | One pass to find \`before_sublist\` + at most N−1 pointer flips |
| **Space** | O(1) | Four pointer variables only — no auxiliary storage |

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "After the reversal loop exits, what does \`prev\` point to?", "options": ["The node just before position left", "The original node at position left (now the tail)", "The original node at position right (new sub-list head)", "The node just after position right"], "answer": 2, "explanation": "The loop walks forward through the sub-list flipping each pointer backward. When it exits after right−left+1 iterations, \`prev\` is sitting on the last node touched — the node originally at position right, which is now the head of the reversed segment." }, { "question": "Why return \`dummy.next\` instead of \`head\`?", "options": ["To handle an empty list without crashing", "Because when left=1, the original head moves inside the reversed section and is no longer the list front", "Because dummy always equals head after reconnection", "To avoid returning a node whose value changed"], "answer": 1, "explanation": "When left=1, the reversal pulls the original head into the middle of the reversed sub-list. Returning \`head\` would give you a node in the middle of the list. \`dummy.next\` always tracks the true front regardless of where the sub-list starts." }, { "question": "How many pointer assignments reconnect the three zones after reversal?", "options": ["1 — only the before-zone needs updating", "2 — before_sublist.next and sublist_tail.next", "3 — also need to null out the old tail pointer", "4 — one per boundary node"], "answer": 1, "explanation": "Exactly two: \`before_sublist.next = prev\` connects the before-zone to the new sub-list head, and \`sublist_tail.next = current\` connects the reversed tail to the after-zone. All other pointers were handled inside the reversal loop itself." }, { "question": "Input: 1→2→3→4→5, left=1, right=3. What is the output?", "options": ["3→2→1→4→5", "1→2→3→4→5", "5→4→3→2→1", "1→3→2→4→5"], "answer": 0, "explanation": "Positions 1–3 (values 1, 2, 3) are reversed to produce 3→2→1. The after-zone (4→5) is then appended via sublist_tail.next = current, giving 3→2→1→4→5. The dummy node ensures left=1 works without a special case." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Mentally split the list into Before / Target / After — only the Target zone changes.", "A dummy node gives you a safe before_sublist anchor when left=1, eliminating a special case.", "Capture sublist_tail = before_sublist.next before the reversal loop — it's the only handle to the after-zone once the loop runs.", "Two pointer assignments stitch everything back: before_sublist.next = prev and sublist_tail.next = current.", "Time O(N), Space O(1) — a single traversal with four pointer variables." ] }
\`\`\``,
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

\`\`\`concept
{ "title": "The K-Group Reversal Pattern", "variant": "mental-model", "content": "Think of the list as a series of windows, each k nodes wide. Slide the window forward, reverse whatever is inside, stitch the reversed segment back onto the growing result, then advance. If the final window has fewer than k nodes, leave it untouched. Two pointers do the heavy lifting: the node before the current group (for stitching) and the node after the group (the start of the next window)." }
\`\`\`

### Problem Statement

Given the head of a linked list, reverse the nodes **k at a time** and return the modified list. Nodes remaining at the end that number fewer than k are left in their original order.

| Input | k | Output |
|---|---|---|
| 1 → 2 → 3 → 4 → 5 | 2 | **2 → 1 → 4 → 3 → 5** |
| 1 → 2 → 3 → 4 → 5 | 3 | **3 → 2 → 1 → 4 → 5** |
| 1 → 2 → 3 → 4 → 5 | 1 | 1 → 2 → 3 → 4 → 5 *(unchanged)* |
| 1 → 2 → 3 → 4 → 5 | 5 | **5 → 4 → 3 → 2 → 1** |

\`\`\`callout
{ "type": "info", "title": "LeetCode 25 — Hard", "content": "This problem generalises the simpler 'Reverse Linked List' (Easy) pattern. Mastering it unlocks a whole family of sliding-window reversal problems and is a reliable signal of strong pointer mechanics in interviews." }
\`\`\`

### Algorithm Breakdown

\`\`\`steps
{ "title": "K-Group Reversal — Four Steps", "steps": [ { "title": "Count k nodes from the current position", "content": "Walk forward k steps. If you reach the end before hitting k, you have fewer than k nodes remaining — **return the current head unchanged**. This check is both the base case for recursion and the termination guard for iteration." }, { "title": "Reverse the k-node segment in place", "content": "Use the standard three-pointer reversal: set \`prev = None\`, then iterate exactly k times flipping \`curr.next = prev\`. After the loop, \`prev\` is the new head of the reversed segment and \`curr\` is the first node of the next group." }, { "title": "Connect the reversed segment to the remainder", "content": "The **original head** of the reversed segment is now its **tail**. Connect it to the result of reversing the next group: \`head.next = reverseKGroup(curr, k)\`. This stitches all segments together automatically." }, { "title": "Return the new head of this segment", "content": "After reversing, \`prev\` points to the k-th node of the original group — now the first node of the reversed segment. Return \`prev\` as the new local head." } ] }
\`\`\`

### Visualising the Reversal (k = 2)

<!-- voice:key_insight insight="After reversing k nodes, the original head becomes the tail and should connect to the result of reversing the remaining list" -->

\`\`\`algoviz
{ "title": "Reverse Every 2 Nodes — [1, 2, 3, 4, 5]", "type": "linkedlist", "data": [1, 2, 3, 4, 5], "frames": [ { "highlight": [0, 1], "label": "Group 1: count k=2 nodes (1 and 2) — count == k, proceed", "stats": { "group": 1, "count": 2, "k": 2 } }, { "highlight": [1, 0], "label": "Reverse group 1: flip pointers → 2→1. Original head (1) becomes the tail", "stats": { "new_head": 2, "tail": 1 } }, { "highlight": [2, 3], "label": "Group 2: count k=2 nodes (3 and 4) — count == k, proceed", "stats": { "group": 2, "count": 2, "k": 2 } }, { "highlight": [3, 2], "label": "Reverse group 2: 4→3. Connect tail of group 1 (node 1) → node 4", "stats": { "new_head": 4, "tail": 3 } }, { "highlight": [4], "label": "Remaining: 1 node < k=2, leave node 5 as-is", "stats": { "remaining": 1, "k": 2 } }, { "highlight": [1, 0, 3, 2, 4], "label": "Final result: 2 → 1 → 4 → 3 → 5", "stats": { "done": true } } ], "speed": 900 }
\`\`\`

### Execution Trace — Recursive Approach (k = 2)

\`\`\`trace
{ "title": "reverseKGroup([1→2→3→4→5], k=2)", "language": "python", "code": "def reverseKGroup(head, k):\\n    curr, count = head, 0\\n    while curr and count < k:\\n        curr = curr.next\\n        count += 1\\n    if count < k:\\n        return head\\n    prev, curr = None, head\\n    for _ in range(k):\\n        nxt = curr.next\\n        curr.next = prev\\n        prev = curr\\n        curr = nxt\\n    head.next = reverseKGroup(curr, k)\\n    return prev", "frames": [ { "line": 1, "vars": { "head": "node(1)", "k": 2 }, "note": "First call. head = node(1), k = 2" }, { "line": 3, "vars": { "curr": "node(1)", "count": 0 }, "note": "Begin counting k nodes forward" }, { "line": 5, "vars": { "curr": "node(3)", "count": 2 }, "note": "Counted 2 nodes — exactly k. curr now points to node(3), start of next group" }, { "line": 6, "vars": { "count": 2, "k": 2 }, "note": "count == k, skip early return. Enough nodes to reverse." }, { "line": 8, "vars": { "prev": null, "curr": "node(1)" }, "note": "Reset curr to head for reversal loop" }, { "line": 10, "vars": { "nxt": "node(2)", "curr": "node(1)", "prev": null }, "note": "Iter 1: save next=node(2), flip node(1).next = None" }, { "line": 10, "vars": { "nxt": "node(3)", "curr": "node(2)", "prev": "node(1)" }, "note": "Iter 2: flip node(2).next = node(1). Reversal complete!" }, { "line": 13, "vars": { "prev": "node(2)", "curr": "node(3)", "head": "node(1)" }, "note": "prev = new head (2), curr = start of next group (3), head = tail of this group (1)" }, { "line": 14, "vars": { "head.next": "reverseKGroup(node(3), 2) → node(4)" }, "note": "Recursive call returns 4→3→5. Connect tail (node 1) → node(4)" }, { "line": 15, "vars": { "return": "node(2)" }, "note": "Return node(2) — new head of this segment. Final chain: 2→1→4→3→5", "stdout": "2 → 1 → 4 → 3 → 5" } ], "speed": 800 }
\`\`\`

### The Most Common Bug

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Missing k-count guard — crashes or corrupts the tail", "code": "def reverseKGroup(head, k):\\n    prev, curr = None, head\\n    # No count check!\\n    for _ in range(k):\\n        nxt = curr.next   # NullPointerError if fewer than k nodes remain\\n        curr.next = prev\\n        prev = curr\\n        curr = nxt\\n    head.next = reverseKGroup(curr, k)\\n    return prev" }, "after": { "label": "Always count before reversing", "code": "def reverseKGroup(head, k):\\n    curr, count = head, 0\\n    while curr and count < k:  # safe forward walk\\n        curr = curr.next\\n        count += 1\\n    if count < k:              # fewer than k remain?\\n        return head            # leave remainder unchanged\\n    prev, curr = None, head\\n    for _ in range(k):\\n        nxt = curr.next\\n        curr.next = prev\\n        prev = curr\\n        curr = nxt\\n    head.next = reverseKGroup(curr, k)\\n    return prev" } }
\`\`\`

### Complexity Analysis

| | Recursive | Iterative (\`dummy\` + \`group_prev\`) |
|---|---|---|
| **Time** | O(n) | O(n) |
| **Space** | O(n/k) — recursion depth | **O(1)** — no call stack |

Each node is visited at most twice: once during the k-count walk and once during reversal. Total operations = 2n → **O(n)**. The iterative variant satisfies the common interview follow-up of "can you do it in O(1) space?"

\`\`\`callout
{ "type": "tip", "title": "Interview Follow-Up: O(1) Space", "content": "Interviewers frequently ask for O(1) space after you code the recursive version. The iterative approach uses a \`dummy\` sentinel node and a \`group_prev\` pointer that advances to the old group tail after each reversal. Practice both — recursive for clarity, iterative for the follow-up." }
\`\`\`

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "Input: 1→2→3→4→5→6→7→8, k=3. What is the output?", "options": ["3→2→1→6→5→4→7→8", "3→2→1→6→5→4→8→7", "6→5→4→3→2→1→7→8", "3→2→1→4→5→6→7→8"], "answer": 0, "explanation": "Groups: [1,2,3] reversed → 3→2→1; [4,5,6] reversed → 6→5→4; [7,8] has only 2 nodes < k=3, left unchanged. Result: 3→2→1→6→5→4→7→8." }, { "question": "After reversing a k-node group, which node becomes the tail of the reversed segment?", "options": ["prev — the new head returned by the loop", "curr — the first node of the next group", "head — the original first node before reversal", "The k-th node counted from the start"], "answer": 2, "explanation": "Standard list reversal sends the original head to the back. That is why we write \`head.next = reverseKGroup(curr, k)\` — head is now the tail, and we link it to the next reversed segment." }, { "question": "What is the recursion depth (space complexity) of the recursive approach on a list of n nodes with group size k?", "options": ["O(1)", "O(k)", "O(n/k)", "O(n)"], "answer": 2, "explanation": "One recursive call is made per group of k nodes, giving n/k total calls on the stack. In the worst case (k=1) this degrades to O(n), which is why the iterative approach is preferred when O(1) space is required." }, { "question": "If k equals the length of the list, what does reverseKGroup return?", "options": ["The original list unchanged", "An empty list", "The fully reversed list", "Only the first node"], "answer": 2, "explanation": "If k equals the list length, all nodes form a single group. That group is reversed in its entirety, so the result is the fully reversed list — the same as calling a plain reverse function." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["Always count k nodes before reversing — if fewer than k remain, return the sublist unchanged.", "After reversing a group, the original head becomes the tail; connect it to the result of the next recursive call or iteration.", "The iterative approach (dummy node + group_prev pointer) achieves O(1) space and is the preferred answer to the follow-up question.", "Time is O(n) for both approaches: each node is visited at most twice — once during counting, once during reversal.", "This pattern generalises: 'reverse alternate k groups', 'rotate every k nodes', and 'reorder list in groups' all share the same counting + reversal skeleton."] }
\`\`\``,
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

Rotating a linked list to the right by \`k\` positions means the last \`k\` nodes move to the front. Unlike arrays, linked lists have no index-based slice — but by making the list **circular** and then finding the right cut point, we can do it in O(n) time with O(1) space.

\`\`\`concept
{ "title": "The Make-Circular Trick", "variant": "mental-model", "content": "Instead of physically moving nodes, connect the tail back to the head to form a ring. Rotation then becomes: find the new break point and cut there. The new tail is always at position (length − k − 1) from the original head, and the node after it becomes the new head." }
\`\`\`

### Problem Statement

Given the head of a singly linked list, rotate the list **to the right** by \`k\` places. Return the new head.

**Constraints:** \`k\` can be larger than the list length — use \`k % length\` to normalize it first.

### Examples

**Example 1**

\`\`\`
Input:  1 → 2 → 3 → 4 → 5,  k = 2
Output: 4 → 5 → 1 → 2 → 3
\`\`\`

The last 2 nodes (\`4 → 5\`) move to the front.

**Example 2**

\`\`\`
Input:  0 → 1 → 2,  k = 4
Output: 2 → 0 → 1
\`\`\`

\`4 % 3 = 1\`, so rotating by 4 is identical to rotating by 1.

\`\`\`algoviz
{ "title": "Rotate [1,2,3,4,5] right by k=2 → [4,5,1,2,3]", "type": "array", "data": [1, 2, 3, 4, 5], "frames": [ { "highlight": [], "label": "Original list: 1 → 2 → 3 → 4 → 5. Goal: rotate right by k=2.", "stats": { "k": 2, "length": "?" } }, { "highlight": [4], "label": "Traverse to tail (value=5) and compute length = 5. Effective k = 2 % 5 = 2.", "stats": { "length": 5, "effective_k": 2 } }, { "highlight": [0, 4], "label": "Make circular: tail.next = head. The list is now a ring.", "stats": { "step": "circular" } }, { "highlight": [2], "label": "New tail at index (5 - 2 - 1) = 2 → value = 3.", "stats": { "new_tail_idx": 2, "new_tail_val": 3 } }, { "highlight": [3], "label": "New head = new_tail.next → index 3, value = 4.", "stats": { "new_head_idx": 3, "new_head_val": 4 } }, { "highlight": [3, 4], "label": "Break circle: new_tail.next = None. Result: 4 → 5 → 1 → 2 → 3.", "stats": { "done": "true" } } ], "speed": 900 }
\`\`\`

### Algorithm

\`\`\`steps
{ "title": "Rotate a Linked List — 5-Step Algorithm", "steps": [ { "title": "Find the tail and list length", "content": "Traverse until \`tail.next is None\`. Count every node to record \`length\`. This is your only full traversal." }, { "title": "Normalize k", "content": "Compute \`k = k % length\`. If \`k == 0\` after normalization, no rotation is needed — return \`head\` immediately to avoid a future infinite loop." }, { "title": "Make the list circular", "content": "Set \`tail.next = head\`. The list is now a ring. There is no \`None\` in it — every node points to the next." }, { "title": "Find the new tail", "content": "Starting from the original \`head\`, walk exactly \`length - k - 1\` steps. That node is the **new tail** — the last node of the rotated list." }, { "title": "Break the circle and return", "content": "Save \`new_head = new_tail.next\`, then set \`new_tail.next = None\` to restore a proper list. Return \`new_head\`." } ] }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Always normalize k before searching for the new tail", "content": "If \`k >= length\`, the walk of \`length - k - 1\` steps would go negative or overshoot, giving a wrong result. After \`k = k % length\`, also check \`k == 0\` — if so, return the original head immediately. Both checks cost O(1) and prevent silent bugs." }
\`\`\`

### Implementation

\`\`\`playground
{ "title": "Rotate Linked List — Python", "language": "python", "runnable": true, "code": "class ListNode:\\n    def __init__(self, val=0, next=None):\\n        self.val = val\\n        self.next = next\\n\\ndef rotateRight(head, k):\\n    if not head or not head.next or k == 0:\\n        return head\\n\\n    # Step 1: find tail and length\\n    tail = head\\n    length = 1\\n    while tail.next:\\n        tail = tail.next\\n        length += 1\\n\\n    # Step 2: normalize k\\n    k = k % length\\n    if k == 0:\\n        return head\\n\\n    # Step 3: make circular\\n    tail.next = head\\n\\n    # Step 4: find new tail at (length - k - 1) steps from head\\n    new_tail = head\\n    for _ in range(length - k - 1):\\n        new_tail = new_tail.next\\n\\n    # Step 5: break circle\\n    new_head = new_tail.next\\n    new_tail.next = None\\n    return new_head\\n\\n# --- Helpers ---\\ndef build(vals):\\n    dummy = ListNode(0)\\n    cur = dummy\\n    for v in vals:\\n        cur.next = ListNode(v)\\n        cur = cur.next\\n    return dummy.next\\n\\ndef to_list(head):\\n    result = []\\n    while head:\\n        result.append(head.val)\\n        head = head.next\\n    return result\\n\\n# Tests\\nprint(to_list(rotateRight(build([1, 2, 3, 4, 5]), 2)))  # [4, 5, 1, 2, 3]\\nprint(to_list(rotateRight(build([0, 1, 2]), 4)))        # [2, 0, 1]\\nprint(to_list(rotateRight(build([1, 2]), 2)))           # [1, 2]  (k % 2 == 0)" }
\`\`\`

### Complexity

| | Complexity | Reason |
|---|---|---|
| **Time** | O(n) | One pass to find tail + length; one partial pass to find new tail |
| **Space** | O(1) | Only a fixed number of pointer variables; no extra nodes created |

<!-- voice:key_insight insight="Make the list circular, then find the new break point based on k mod length" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "A list has 6 nodes. What effective rotation count is used when k = 20?", "options": ["20", "6", "2", "14"], "answer": 2, "explanation": "20 % 6 = 2. Always normalize k to avoid walking off the end when computing the new tail position." }, { "question": "After step 4 (finding the new tail), which node becomes the new head?", "options": ["The original head", "The original tail", "new_tail.next", "new_tail.prev"], "answer": 2, "explanation": "new_head = new_tail.next. The new tail is the last node of the rotated list; the node immediately after it in the circular ring is the first node of the rotated list." }, { "question": "For a list of length 5 with k=2, how many steps from the original head do you walk to reach the new tail?", "options": ["2", "3", "4", "1"], "answer": 0, "explanation": "length - k - 1 = 5 - 2 - 1 = 2. Starting at index 0 (the original head), walking 2 steps lands you at index 2 (value=3), which is the new tail." }, { "question": "Which single line of code converts the straight list into a circular one?", "options": ["head.next = tail", "tail.next = None", "tail.next = head", "new_tail.next = head"], "answer": 2, "explanation": "tail.next = head closes the ring. Later, new_tail.next = None is what breaks it at exactly the right split point to produce the rotated result." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Rotation = make the list circular (tail.next = head), then cut at the new tail position.", "Always normalize: k = k % length. If k becomes 0, return head immediately.", "New tail is (length − k − 1) steps from the original head; new head is new_tail.next.", "Time O(n), Space O(1) — two partial traversals, no auxiliary data structures.", "This pattern (LeetCode 61) connects directly to Reverse Nodes in k-Group (LeetCode 25) and Reorder List (LeetCode 143) — circular pointer tricks appear across all of them." ] }
\`\`\``,
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

You've made it through one of the most pointer-intensive patterns in interview prep. Before moving on, let's lock in the mechanics with a hands-on review.

\`\`\`concept
{ "title": "The Three-Pointer Mental Model", "variant": "mental-model", "content": "Every linked list reversal — full, partial, or k-group — reduces to the same core move: save \`next\`, flip the pointer, advance. The only difference between problem types is *where you start* and *where you stop*. If you own this one move, you own the entire pattern family." }
\`\`\`

### The Core Reversal in Motion

Watch how \`prev\`, \`curr\`, and \`temp\` cooperate to reverse \`1 → 2 → 3 → 4 → 5\`:

\`\`\`algoviz
{
  "title": "Iterative Reversal: 1 → 2 → 3 → 4 → 5",
  "type": "linkedlist",
  "data": [1, 2, 3, 4, 5],
  "frames": [
    { "highlight": [0], "label": "Start: prev=null, curr=1", "stats": { "prev": "null", "curr": "1", "temp": "-" } },
    { "highlight": [0], "label": "temp = curr.next (2). Flip: curr.next = prev (null). Advance.", "stats": { "prev": "null", "curr": "1", "temp": "2" } },
    { "highlight": [1], "label": "prev=1, curr=2. temp = 3. Flip: 2.next = 1.", "stats": { "prev": "1", "curr": "2", "temp": "3" } },
    { "highlight": [2], "label": "prev=2, curr=3. temp = 4. Flip: 3.next = 2.", "stats": { "prev": "2", "curr": "3", "temp": "4" } },
    { "highlight": [3], "label": "prev=3, curr=4. temp = 5. Flip: 4.next = 3.", "stats": { "prev": "3", "curr": "4", "temp": "5" } },
    { "highlight": [4], "label": "prev=4, curr=5. temp = null. Flip: 5.next = 4.", "stats": { "prev": "4", "curr": "5", "temp": "null" } },
    { "highlight": [4, 3, 2, 1, 0], "label": "curr=null → done. prev is the new head: 5 → 4 → 3 → 2 → 1", "stats": { "prev": "5 (new head)", "curr": "null", "temp": "-" } }
  ],
  "speed": 900
}
\`\`\`

### Pattern Comparison

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Full Reversal",
      "icon": "🔄",
      "content": "**Time:** O(n) — **Space:** O(1)\\n\\nThree pointers: \`prev = null\`, \`curr = head\`, \`temp\`.\\n\\nAt each step:\\n1. \`temp = curr.next\` — save next before overwriting\\n2. \`curr.next = prev\` — flip the pointer\\n3. \`prev = curr\` — advance prev\\n4. \`curr = temp\` — advance curr\\n\\nWhen \`curr\` is \`null\`, \`prev\` is the new head."
    },
    {
      "label": "Sublist Reversal",
      "icon": "✂️",
      "content": "**Time:** O(n) — **Space:** O(1)\\n\\nTraverse to position \`left - 1\` to find the node *before* the sublist (\`connectionPoint\`).\\n\\nSave \`firstNodeToReverse = connectionPoint.next\`.\\n\\nRun the standard flip loop for \`right - left + 1\` iterations.\\n\\nAfter the loop:\\n- \`connectionPoint.next = newSublistHead\` (reconnect left side)\\n- \`firstNodeToReverse.next = nodeAfterSublist\` (reconnect right side)\\n\\nThe original first node of the sublist becomes its *tail* after reversal."
    },
    {
      "label": "K-Group Reversal",
      "icon": "📦",
      "content": "**Time:** O(n) — **Space:** O(1)\\n\\nUse a **dummy node** before \`head\` so every group (including the first) has a consistent predecessor (\`prevGroupTail\`).\\n\\nFor each group:\\n1. Check that k nodes remain — if not, leave them as-is.\\n2. Reverse the k nodes in place with the standard flip loop.\\n3. Reconnect: \`prevGroupTail.next = newGroupHead\`\\n4. \`originalGroupHead.next = nextGroupStart\` (original head is now the tail)\\n5. Advance \`prevGroupTail\` to \`originalGroupHead\`.\\n\\nReturn \`dummy.next\`."
    },
    {
      "label": "Rotation",
      "icon": "🔁",
      "content": "**Time:** O(n) — **Space:** O(1)\\n\\nRotating right by \`k\` positions does **not** require extra space.\\n\\nTechnique:\\n1. Find the tail and connect it to \`head\` → circular list.\\n2. Find the new tail at position \`n - k % n - 1\`.\\n3. Set \`newHead = newTail.next\`, then \`newTail.next = null\` to break the circle.\\n\\nNo allocations, no auxiliary structures."
    }
  ]
}
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "The #1 sublist reconnection mistake", "content": "After reversing a sublist, beginners forget to set \`firstNodeToReverse.next = nodeAfterSublist\`. The left reconnection is obvious; the right one is easy to drop. Always draw the before/after diagram for both ends." }
\`\`\`

### Checkpoint Quiz

\`\`\`quiz
{
  "title": "Linked List Reversal — Knowledge Check",
  "questions": [
    {
      "question": "In iterative linked list reversal, why do we save \`temp = curr.next\` before flipping the pointer?",
      "options": [
        "To find the middle of the list",
        "To keep track of the original next node before we overwrite curr.next",
        "To detect cycles in the list",
        "To count the total list length"
      ],
      "answer": 1,
      "explanation": "Once we set \`curr.next = prev\`, the forward link is gone. Without saving \`temp\` first, we permanently lose our way to the rest of the list. This is the single most important move in the entire algorithm."
    },
    {
      "question": "What is the time and space complexity of reversing a linked list in place?",
      "options": [
        "O(log n) time, O(1) space",
        "O(n) time, O(n) space",
        "O(n) time, O(1) space",
        "O(n²) time, O(1) space"
      ],
      "answer": 2,
      "explanation": "We visit each node exactly once (O(n) time) and use only three pointer variables regardless of list length (O(1) space). No auxiliary array or stack is needed."
    },
    {
      "question": "When reversing a sublist from position left to right, what does the original head of the sublist connect to after reversal?",
      "options": [
        "The node before the sublist",
        "The node immediately after the sublist",
        "The new head of the sublist",
        "null — it becomes the absolute tail"
      ],
      "answer": 1,
      "explanation": "The original first node of the sublist becomes the last node of the reversed segment, so it must point to the first node after position right — stitching the reversed section back into the rest of the list."
    },
    {
      "question": "In k-group reversal, what happens when fewer than k nodes remain at the end of the list?",
      "options": [
        "Reverse them anyway",
        "Leave them in their original order",
        "Remove them from the list",
        "Return null"
      ],
      "answer": 1,
      "explanation": "Per LeetCode 25's specification (and standard interview expectation): if the remaining nodes number less than k, do not reverse them — leave them as-is. This is why you check that k nodes exist *before* reversing each group."
    },
    {
      "question": "Why is a dummy node essential for k-group reversal?",
      "options": [
        "It stores the total node count",
        "It gives every group, including the first, a consistent predecessor to reconnect through",
        "It prevents cycles from forming during reversal",
        "It marks the boundary between reversed and unreversed sections"
      ],
      "answer": 1,
      "explanation": "Without a dummy node, the first group is a special case — there is no previous tail to update. The dummy node (placed before \`head\`) acts as that predecessor, making the reconnection logic uniform across all groups and eliminating the edge case."
    }
  ]
}
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Voice Summary — your coach will ask you to:", "content": "1. Walk through reversing \`1 → 2 → 3 → 4 → 5\` step by step, naming each pointer at every iteration.\\n2. Explain how to reverse every k nodes and what to do with a leftover tail shorter than k.\\n3. Describe a real-world scenario where list rotation is useful (hint: think scheduling queues or circular buffers)." }
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Every reversal variant — full, sublist, k-group — is built on one move: save next, flip pointer, advance. Master the primitive and the variants are just boundary conditions.",
    "Sublist reversal requires two reconnection steps: left side (predecessor → new head) and right side (original head → successor). Missing either breaks the list.",
    "K-group reversal uses a dummy node so that even the first group has a consistent predecessor, keeping the reconnection logic uniform across all iterations.",
    "Iterative reversal runs in O(n) time and O(1) space — the expected complexity for any in-place linked list manipulation problem.",
    "Rotation avoids extra space entirely by forming a circular list, then breaking it at the correct new tail — no allocation required."
  ]
}
\`\`\``,
    },
  ],
};
