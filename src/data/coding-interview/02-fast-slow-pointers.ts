import { Module } from "../types";

export const fastSlowPointersModule: Module = {
  id: "fast-slow-pointers",
  title: "Fast & Slow Pointers (Floyd's Algorithm)",
  description: "Use two pointers moving at different speeds to detect cycles, find midpoints, and identify structural properties in linked lists and arrays.",
  lessons: [
    {
      id: "fast-slow-intro",
      slug: "fast-slow-intro",
      title: "Introduction to Fast & Slow Pointers",
      content: `# Introduction to Fast & Slow Pointers

Two runners enter a circular track. One jogs steadily — one step at a time. The other sprints at double the pace. If the track loops, the sprinter will eventually lap the jogger and they'll meet. If the track is straight, the sprinter simply reaches the end first.

This is Floyd's Tortoise and Hare algorithm — and it's one of the most elegant ideas in computer science.

\`\`\`concept
{ "title": "The Fast & Slow Pointer Pattern", "variant": "mental-model", "content": "Maintain two pointers over a sequence. The **slow pointer** advances one step per iteration. The **fast pointer** advances two steps. Their relative behavior — do they meet? where do they meet? — reveals structural properties of the data: cycles, midpoints, and repeated elements." }
\`\`\`

## Why Two Speeds?

Think about what happens when you traverse a linked list with a single pointer. You can find the end. You can read values. But you can't detect whether the list loops back on itself without either (a) extra memory to track visited nodes, or (b) some mathematical trick.

The fast/slow approach is that trick — **O(1) space**, **O(N) time**, and no hash sets required.

The core insight is this: inside a cycle, a pointer moving at speed 2 gains one position per step on a pointer moving at speed 1. The gap closes by exactly 1 each iteration. Given a cycle of length \`C\`, the fast pointer **must** catch the slow pointer within \`C\` steps of entering the cycle.

\`\`\`concept
{ "title": "Why They Always Meet Inside a Cycle", "variant": "insight", "content": "Once both pointers are inside a cycle of length C, the distance between them decreases by 1 each step (fast closes 2 steps, slow closes 1 step — net difference: 1). Starting distance can be at most C−1, so they meet in at most C−1 iterations. No infinite loop. No missed passes." }
\`\`\`

## The Three Problem Shapes

Fast & slow pointers solve a specific family of problems. Learn to recognize these shapes and the pattern triggers automatically:

\`\`\`tabs
{ "tabs": [
  {
    "label": "Cycle Detection",
    "icon": "🔄",
    "content": "**Shape:** Does this linked list (or sequence) loop back on itself?\\n\\n**Signal in problem:** \\"detect a cycle\\", \\"is there a loop\\", \\"circular\\"\\n\\n**How it works:**\\n- Move slow by 1, fast by 2\\n- If they ever point to the same node → cycle exists\\n- If fast reaches \`None\` → no cycle\\n\\n**Examples:** LinkedList Cycle, Circular Array Loop, Happy Number"
  },
  {
    "label": "Find Midpoint",
    "icon": "🎯",
    "content": "**Shape:** Find the middle node of a linked list in one pass.\\n\\n**Signal in problem:** \\"middle node\\", \\"median\\", \\"split list in half\\"\\n\\n**How it works:**\\n- Move slow by 1, fast by 2\\n- When fast reaches the end, slow is at the middle\\n- For even-length lists, slow lands at the second of the two middle nodes\\n\\n**Examples:** Middle of LinkedList, Palindrome LinkedList"
  },
  {
    "label": "Start of Cycle",
    "icon": "📍",
    "content": "**Shape:** Where does the cycle begin?\\n\\n**Signal in problem:** \\"entry point of the loop\\", \\"find where the cycle starts\\"\\n\\n**How it works:**\\n1. Detect meeting point using fast/slow\\n2. Reset one pointer to \`head\`\\n3. Advance both at speed 1 — they meet at the cycle start\\n\\nThis relies on a mathematical proof: the distance from head to cycle-start equals the distance from meeting-point to cycle-start.\\n\\n**Examples:** Start of LinkedList Cycle, Find the Duplicate Number"
  }
] }
\`\`\`

## Visualizing Cycle Detection

Watch how the tortoise and hare move through a linked list with a cycle:

\`\`\`algoviz
{ "title": "Floyd's Algorithm — Cycle Detection", "type": "linkedlist", "data": [3, 1, 2, 4, 5, 2], "frames": [
  { "highlight": [0], "label": "Initial state: slow = head, fast = head (node 3)", "stats": { "slow": 0, "fast": 0 } },
  { "highlight": [1, 2], "label": "Step 1: slow moves +1 → node 1, fast moves +2 → node 2", "stats": { "slow": 1, "fast": 2 } },
  { "highlight": [2, 4], "label": "Step 2: slow moves +1 → node 2, fast moves +2 → node 5", "stats": { "slow": 2, "fast": 4 } },
  { "highlight": [3, 3], "label": "Step 3: slow moves +1 → node 4, fast moves +2 → wraps to node 4 (cycle!)", "stats": { "slow": 3, "fast": 3 } },
  { "highlight": [3], "label": "slow == fast — CYCLE DETECTED at node 4!", "stats": { "slow": 3, "fast": 3 } }
], "speed": 900 }
\`\`\`

## Step-by-Step Code Trace

Let's trace through the canonical cycle detection implementation:

\`\`\`trace
{ "title": "Tracing has_cycle() on [1 → 2 → 3 → 4 → 2 (cycle)]", "language": "python", "code": "def has_cycle(head):\\n    slow = head\\n    fast = head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow == fast:\\n            return True\\n    return False", "frames": [
  { "line": 2, "vars": { "slow": "node(1)", "fast": "node(1)" }, "note": "Both start at head" },
  { "line": 3, "vars": { "slow": "node(1)", "fast": "node(1)" }, "note": "Enter while loop — fast and fast.next both exist" },
  { "line": 4, "vars": { "slow": "node(2)", "fast": "node(1)" }, "note": "slow advances one step" },
  { "line": 5, "vars": { "slow": "node(2)", "fast": "node(3)" }, "note": "fast advances two steps" },
  { "line": 6, "vars": { "slow": "node(2)", "fast": "node(3)" }, "note": "slow != fast, continue" },
  { "line": 4, "vars": { "slow": "node(3)", "fast": "node(3)" }, "note": "Next iteration: slow → node(3)" },
  { "line": 5, "vars": { "slow": "node(3)", "fast": "node(2)" }, "note": "fast → node(2) (wrapped via cycle)" },
  { "line": 4, "vars": { "slow": "node(4)", "fast": "node(2)" }, "note": "slow → node(4)" },
  { "line": 5, "vars": { "slow": "node(4)", "fast": "node(4)" }, "note": "fast → node(4) — same as slow!" },
  { "line": 6, "vars": { "slow": "node(4)", "fast": "node(4)" }, "note": "slow == fast → return True ✓", "stdout": "True" }
], "speed": 900 }
\`\`\`

## Runnable Implementation

Here's the complete fast & slow pointer toolkit. Run it, modify the cycle structure, see what changes:

\`\`\`playground
{ "title": "Fast & Slow Pointers — Core Implementations", "language": "python", "runnable": true, "code": "class Node:\\n    def __init__(self, val, next=None):\\n        self.val = val\\n        self.next = next\\n\\n# ── Cycle Detection ──────────────────────────────\\ndef has_cycle(head):\\n    slow, fast = head, head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow is fast:\\n            return True\\n    return False\\n\\n# ── Find Middle Node ─────────────────────────────\\ndef find_middle(head):\\n    slow, fast = head, head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n    return slow\\n\\n# ── Test: list with cycle ─────────────────────────\\nhead = Node(1)\\nhead.next = Node(2)\\nhead.next.next = Node(3)\\nhead.next.next.next = Node(4)\\nhead.next.next.next.next = Node(5)\\nhead.next.next.next.next.next = head.next  # cycle back to node 2\\n\\nprint('Has cycle:', has_cycle(head))  # True\\n\\n# ── Test: list without cycle ──────────────────────\\nlinear = Node(1, Node(2, Node(3, Node(4, Node(5)))))\\nprint('Has cycle:', has_cycle(linear))  # False\\nmid = find_middle(linear)\\nprint('Middle node value:', mid.val)   # 3\\n\\n# ── Try even-length list ──────────────────────────\\neven = Node(1, Node(2, Node(3, Node(4))))\\nprint('Middle of even list:', find_middle(even).val)  # 3 (second middle)\\n" }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "The \`is\` vs \`==\` Distinction", "content": "Use \`slow is fast\` (identity check), not \`slow == fast\` (value check). Two different nodes could hold the same integer value — you need to confirm they are the **same object** in memory, not just equal in value." }
\`\`\`

## The Happy Number Insight

Fast & slow pointers aren't only for linked lists. The **Happy Number** problem applies the same idea to number sequences:

A happy number repeatedly sums the squares of its digits. If the process eventually reaches 1, it's happy. If not, it loops forever in a cycle.

The sequence is just an **implicit linked list** — each number points to its "next" number. Apply fast & slow pointers to detect whether you enter the cycle at 1 (happy) or elsewhere (not happy):

\`\`\`playground
{ "title": "Happy Number — Fast & Slow on an Implicit Sequence", "language": "python", "runnable": true, "code": "def digit_square_sum(n):\\n    total = 0\\n    while n > 0:\\n        digit = n % 10\\n        total += digit * digit\\n        n //= 10\\n    return total\\n\\ndef is_happy(n):\\n    slow = n\\n    fast = n\\n    while True:\\n        slow = digit_square_sum(slow)           # one step\\n        fast = digit_square_sum(digit_square_sum(fast))  # two steps\\n        if slow == fast:\\n            break  # cycle detected\\n    return slow == 1  # happy if cycle ends at 1\\n\\n# Test cases\\nfor num in [23, 19, 12, 7, 2]:\\n    result = 'HAPPY' if is_happy(num) else 'not happy'\\n    print(f'{num} is {result}')\\n" }
\`\`\`

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Implement: Find Middle of Linked List", "prompt": "Complete the find_middle function. When fast reaches the end, slow will be at the middle.", "language": "python", "template": "def find_middle(head):\\n    slow = ___\\n    fast = ___\\n    while fast and ___:\\n        slow = slow.next\\n        fast = fast.___\\n    return slow", "blanks": [
  { "answer": "head", "hint": "Both pointers start at the beginning" },
  { "answer": "head", "hint": "Both pointers start at the same node" },
  { "answer": "fast.next", "hint": "Fast must have a next-next to take two steps safely" },
  { "answer": "next.next", "hint": "Fast moves two steps at once" }
] }
\`\`\`

## Complexity at a Glance

| Operation | Time | Space | Why |
|---|---|---|---|
| Cycle detection | O(N) | O(1) | Fast catches slow within one loop pass |
| Find middle | O(N) | O(1) | Single pass, fast exits at end |
| Cycle start | O(N) | O(1) | Two phases, both linear |
| Happy number | O(log N) per step | O(1) | Digit count shrinks each iteration |

\`\`\`collapse
{ "title": "Deep Dive: Mathematical Proof of the Meeting Point", "content": "**Why does resetting one pointer to \`head\` find the cycle start?**\\n\\nLet:\\n- \`F\` = distance from head to cycle entrance\\n- \`C\` = length of the cycle\\n- \`a\` = distance from cycle entrance to meeting point\\n\\nWhen they meet:\\n- Slow has traveled: \`F + a\`\\n- Fast has traveled: \`F + a + kC\` (for some integer k, extra laps)\\n- Fast travels 2× slow: \`2(F + a) = F + a + kC\`\\n- Simplify: \`F + a = kC\` → \`F = kC - a\`\\n\\nThis means: **the distance from head to cycle-start equals the distance from meeting-point to cycle-start** (going forward in the cycle). So if you reset one pointer to head and advance both at speed 1, they meet precisely at the cycle entrance. ✓" }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [
  {
    "question": "What happens to the fast pointer when traversing a linked list with NO cycle?",
    "options": ["It slows down and matches the slow pointer", "It reaches None (the end) before meeting the slow pointer", "It loops back to the head automatically", "It throws an index out of bounds error"],
    "answer": 1,
    "explanation": "Without a cycle, fast will exhaust the list and reach None. The while condition \`fast and fast.next\` catches this and exits cleanly — no meeting, which signals 'no cycle.'"
  },
  {
    "question": "You're given a linked list of length N where the cycle starts at position k from the head. What is the time complexity of detecting the cycle?",
    "options": ["O(k)", "O(N²)", "O(N)", "O(C) where C is the cycle length"],
    "answer": 2,
    "explanation": "The slow pointer traverses at most N nodes before the fast pointer catches up. Even though fast moves faster, the total number of node visits is bounded by O(N)."
  },
  {
    "question": "For a linked list with 6 nodes and no cycle [1→2→3→4→5→6], what value does find_middle() return?",
    "options": ["3 (the first middle node)", "4 (the second middle node)", "2", "6"],
    "answer": 1,
    "explanation": "When fast reaches node 5 (fast.next = node 6, fast.next.next = None), the while condition fails. At that point, slow is at node 4 — the second of the two middle nodes. For even-length lists, fast & slow returns the second middle."
  },
  {
    "question": "Why does the Happy Number problem use fast & slow pointers instead of a hash set?",
    "options": ["Hash sets don't work with integers", "Fast & slow uses O(1) space vs O(N) for a hash set", "The sequence is too long for a hash set", "Fast & slow is faster in time complexity"],
    "answer": 1,
    "explanation": "Both approaches detect the cycle, but a hash set stores every visited number (O(N) space). Fast & slow pointers detect the cycle by convergence — no extra storage needed, keeping space at O(1)."
  },
  {
    "question": "Which of the following is NOT a valid use case for the fast & slow pointer pattern?",
    "options": ["Detecting if a linked list has a cycle", "Finding the middle of a linked list", "Finding the maximum element in an unsorted array", "Detecting a repeated number in an array treated as an implicit linked list"],
    "answer": 2,
    "explanation": "Fast & slow pointers work on sequential structures where each element points to a 'next' element. Finding a maximum in an unsorted array requires comparing all values — there's no directional traversal structure to exploit."
  }
] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Fast & slow pointers use two traversal speeds (1× and 2×) to detect structural properties with O(1) space — no hash sets needed.",
  "If a cycle exists, fast and slow will always meet inside it: the gap closes by exactly 1 per step, so meeting is guaranteed within C iterations.",
  "Three problem shapes trigger this pattern: cycle detection (do they meet?), midpoint finding (where is slow when fast ends?), and cycle-start location (reset + walk at equal speed).",
  "The pattern extends beyond linked lists — any sequence where each value maps to a 'next' value (like Happy Numbers) can be treated as an implicit linked list.",
  "Always use identity comparison (\`is\`) not equality (\`==\`) when checking if two node pointers have converged."
] }
\`\`\``,
      starterCode: `# Fast & Slow Pointers — Cycle Detection
#
# Given the head of a linked list, determine if the list contains a cycle.
# If a cycle exists, return the node where the cycle begins.
# If no cycle exists, return None.
#
# Use Floyd's tortoise-and-hare algorithm:
#   - slow pointer moves 1 step at a time
#   - fast pointer moves 2 steps at a time
#   - if they ever meet, a cycle exists
#   - to find the cycle start: reset one pointer to head,
#     then advance both one step at a time until they meet

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def detect_cycle(head: ListNode) -> ListNode:
    """
    Returns the node where the cycle begins, or None if no cycle.
    Time:  O(n)
    Space: O(1)
    """
    # TODO 1: Handle edge case — if the list is empty or has only
    # one node with no self-loop, return None immediately.

    # TODO 2: Initialize slow and fast pointers.
    # Both start at head.

    # TODO 3: Phase 1 — detect whether a cycle exists.
    # Advance slow by 1 and fast by 2 each iteration.
    # If fast or fast.next becomes None, there is no cycle — return None.
    # Stop when slow == fast (they've met inside the cycle).

    # TODO 4: Phase 2 — find the cycle entry node.
    # Reset one pointer back to head (keep the other at the meeting point).
    # Advance both one step at a time.
    # The node where they meet again is the start of the cycle — return it.
    pass


# ---------------------------------------------------------------------------
# Helper to build a linked list with an optional cycle.
# cycle_pos is the 0-based index of the node that tail.next points to.
# Pass cycle_pos = -1 for no cycle.
# ---------------------------------------------------------------------------
def build_list(values: list, cycle_pos: int = -1) -> ListNode:
    if not values:
        return None
    nodes = [ListNode(v) for v in values]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if cycle_pos != -1:
        nodes[-1].next = nodes[cycle_pos]
    return nodes[0]


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Test 1: cycle starts at index 1  →  expect node with val 2
    head = build_list([3, 2, 0, -4], cycle_pos=1)
    result = detect_cycle(head)
    assert result is not None and result.val == 2, f"Test 1 failed: {result}"
    print("Test 1 passed — cycle entry val:", result.val)

    # Test 2: cycle starts at index 0  →  expect node with val 1
    head = build_list([1, 2], cycle_pos=0)
    result = detect_cycle(head)
    assert result is not None and result.val == 1, f"Test 2 failed: {result}"
    print("Test 2 passed — cycle entry val:", result.val)

    # Test 3: no cycle  →  expect None
    head = build_list([1, 2, 3])
    result = detect_cycle(head)
    assert result is None, f"Test 3 failed: {result}"
    print("Test 3 passed — no cycle detected")

    # Test 4: empty list  →  expect None
    result = detect_cycle(None)
    assert result is None, "Test 4 failed"
    print("Test 4 passed — empty list")

    print("\\nAll tests passed!")
`,
      solutionCode: `# Fast & Slow Pointers — Cycle Detection (Solution)
#
# Floyd's tortoise-and-hare works in two phases:
#
# Phase 1 — collision:
#   slow moves +1, fast moves +2 per step.
#   If a cycle of length C exists, fast gains on slow by 1 node/step,
#   so they must collide somewhere inside the cycle in at most C steps.
#
# Phase 2 — entry node:
#   Let F = distance from head to cycle start,
#       a = distance from cycle start to collision point.
#   At collision: slow has walked F + a steps.
#   fast has walked 2(F + a) steps = F + a + n*C  for some integer n.
#   => F + a = n*C  =>  F = n*C - a = (n-1)*C + (C - a).
#   (C - a) is the remaining distance from the collision point back to the
#   cycle entry.  Moving one pointer to head and stepping both by 1 means
#   after F more steps they both arrive at the cycle entry simultaneously.

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def detect_cycle(head: ListNode) -> ListNode:
    """
    Returns the node where the cycle begins, or None if no cycle.
    Time:  O(n)
    Space: O(1)
    """
    # Edge case: empty list or single node without a self-loop
    if not head or not head.next:
        return None

    # Phase 1: find the collision point inside the cycle (if any)
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next          # tortoise: 1 step
        fast = fast.next.next     # hare:     2 steps
        if slow is fast:
            break                 # collision — cycle confirmed
    else:
        # fast reached the end of the list → no cycle
        return None

    # Phase 2: find the cycle entry node
    # Reset one pointer to head; keep the other at the collision point.
    finder = head
    while finder is not slow:
        finder = finder.next
        slow = slow.next
    # Both pointers now sit exactly at the cycle entry node
    return finder


# ---------------------------------------------------------------------------
# Helper to build a linked list with an optional cycle.
# ---------------------------------------------------------------------------
def build_list(values: list, cycle_pos: int = -1) -> ListNode:
    if not values:
        return None
    nodes = [ListNode(v) for v in values]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if cycle_pos != -1:
        nodes[-1].next = nodes[cycle_pos]
    return nodes[0]


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Test 1: cycle starts at index 1  →  expect node with val 2
    head = build_list([3, 2, 0, -4], cycle_pos=1)
    result = detect_cycle(head)
    assert result is not None and result.val == 2, f"Test 1 failed: {result}"
    print("Test 1 passed — cycle entry val:", result.val)

    # Test 2: cycle starts at index 0  →  expect node with val 1
    head = build_list([1, 2], cycle_pos=0)
    result = detect_cycle(head)
    assert result is not None and result.val == 1, f"Test 2 failed: {result}"
    print("Test 2 passed — cycle entry val:", result.val)

    # Test 3: no cycle  →  expect None
    head = build_list([1, 2, 3])
    result = detect_cycle(head)
    assert result is None, f"Test 3 failed: {result}"
    print("Test 3 passed — no cycle detected")

    # Test 4: empty list  →  expect None
    result = detect_cycle(None)
    assert result is None, "Test 4 failed"
    print("Test 4 passed — empty list")

    print("\\nAll tests passed!")
`,
    },
    {
      id: "linked-list-cycle",
      slug: "linked-list-cycle",
      title: "Linked List Cycle Detection",
      content: `# Linked List Cycle Detection

Imagine you're driving on a road. If you keep moving forward and eventually end up where you started, you're on a circular route — a **cycle**. The same idea applies to linked lists.

A linked list has a cycle when a node's \`next\` pointer points back to a previous node in the list, creating an infinite loop. If you tried to traverse it naively, you'd loop forever.

\`\`\`concept
{ "title": "The Core Problem", "variant": "mental-model", "content": "A linked list has a cycle if following \`next\` pointers from any node eventually brings you back to a previously visited node. The challenge: detect this in O(1) space — no extra memory allowed." }
\`\`\`

The brute-force solution is to store every visited node in a hash set. If you encounter a node you've already seen — cycle detected. But this costs **O(n) space**. Can we do better?

Yes. Meet Floyd's Cycle Detection Algorithm.

---

## Floyd's Algorithm: The Tortoise and the Hare

\`\`\`concept
{ "title": "The Tortoise and the Hare", "variant": "analogy", "content": "Picture a circular running track. A slow runner (tortoise) and a fast runner (hare) start together. If the track is circular, the hare will eventually lap the tortoise and they'll meet again. If the track is a straight line, the hare just runs off the end — they never meet. Two pointers moving at different speeds: if there's a cycle, they MUST collide." }
\`\`\`

**The mechanics:**
- \`slow\` pointer advances **1 step** at a time
- \`fast\` pointer advances **2 steps** at a time
- If \`fast\` reaches \`None\` → **no cycle** (list is finite)
- If \`slow == fast\` at any point → **cycle detected**

Why do they always meet if a cycle exists? Once both pointers enter the cycle, the \`fast\` pointer gains 1 node on \`slow\` per iteration. The distance between them shrinks by 1 each step — so they must eventually collide.

---

## Visualizing the Algorithm

Consider this linked list where node 6 points back to node 2, forming a cycle:

\`\`\`
1 → 2 → 3 → 4 → 5 → 6
        ↑_______________↑
\`\`\`

\`\`\`algoviz
{
  "title": "Floyd's Cycle Detection — Step by Step",
  "type": "linkedlist",
  "data": [1, 2, 3, 4, 5, 6],
  "frames": [
    { "highlight": [0, 0], "label": "Start: slow=1, fast=1 (both at head)", "stats": { "slow": 1, "fast": 1 } },
    { "highlight": [1, 2], "label": "Step 1: slow moves 1→2, fast moves 1→3", "stats": { "slow": 2, "fast": 3 } },
    { "highlight": [2, 4], "label": "Step 2: slow moves 2→3, fast moves 3→5", "stats": { "slow": 3, "fast": 5 } },
    { "highlight": [3, 1], "label": "Step 3: slow moves 3→4, fast moves 5→6→2 (cycle!)", "stats": { "slow": 4, "fast": 2 } },
    { "highlight": [4, 3], "label": "Step 4: slow moves 4→5, fast moves 2→3→4", "stats": { "slow": 5, "fast": 4 } },
    { "highlight": [5, 4], "label": "Step 5: slow moves 5→6, fast moves 4→5→6", "stats": { "slow": 6, "fast": 6 } },
    { "highlight": [5, 5], "label": "COLLISION! slow == fast → Cycle detected!", "stats": { "slow": 6, "fast": 6 } }
  ],
  "speed": 900
}
\`\`\`

---

## Code Walkthrough

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Node Setup",
      "icon": "🔗",
      "content": "\`\`\`python\\nclass ListNode:\\n    def __init__(self, val=0):\\n        self.val = val\\n        self.next = None\\n\`\`\`\\n\\nA \`ListNode\` holds a value and a reference to the next node. When \`next\` points backward in the list, we have a cycle."
    },
    {
      "label": "Floyd's Algorithm",
      "icon": "🐢",
      "content": "\`\`\`python\\ndef has_cycle(head: ListNode) -> bool:\\n    slow = head\\n    fast = head\\n\\n    while fast and fast.next:\\n        slow = slow.next        # move 1 step\\n        fast = fast.next.next  # move 2 steps\\n\\n        if slow == fast:        # pointers collide\\n            return True\\n\\n    return False  # fast hit None — no cycle\\n\`\`\`\\n\\n**Why \`fast and fast.next\`?** We need both checks:\\n- \`fast\` must not be \`None\` (end of list)\\n- \`fast.next\` must not be \`None\` (so \`fast.next.next\` is safe)"
    },
    {
      "label": "Complexity",
      "icon": "📊",
      "content": "| Metric | Value | Why |\\n|--------|-------|-----|\\n| **Time** | O(n) | In the worst case, fast pointer traverses the list once |\\n| **Space** | O(1) | Only two pointer variables — no extra data structures |\\n\\nCompare to the hash set approach:\\n- Time: O(n) — same\\n- Space: **O(n)** — stores every visited node\\n\\nFloyd's wins on space with no trade-off."
    },
    {
      "label": "Edge Cases",
      "icon": "⚠️",
      "content": "\`\`\`python\\n# Empty list\\nhas_cycle(None)  # → False (while condition fails immediately)\\n\\n# Single node, no cycle\\nnode = ListNode(1)\\nhas_cycle(node)  # → False\\n\\n# Single node pointing to itself\\nnode = ListNode(1)\\nnode.next = node\\nhas_cycle(node)  # → True (fast.next.next == node == slow)\\n\\n# Two nodes with cycle\\na = ListNode(1)\\nb = ListNode(2)\\na.next = b\\nb.next = a\\nhas_cycle(a)  # → True\\n\`\`\`"
    }
  ]
}
\`\`\`

---

## Trace Through the Code

Let's trace Floyd's algorithm on a list: \`1 → 2 → 3 → 2\` (node 3 points back to node 2).

\`\`\`trace
{
  "title": "Execution Trace — List with Cycle at node 2",
  "language": "python",
  "code": "def has_cycle(head):\\n    slow = head\\n    fast = head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow == fast:\\n            return True\\n    return False",
  "frames": [
    { "line": 2, "vars": { "slow": "node(1)", "fast": "node(1)" }, "note": "Both pointers start at head" },
    { "line": 3, "vars": { "slow": "node(1)", "fast": "node(1)" }, "note": "fast=node(1) ✓, fast.next=node(2) ✓ — enter loop" },
    { "line": 4, "vars": { "slow": "node(2)", "fast": "node(1)" }, "note": "slow advances: 1→2" },
    { "line": 5, "vars": { "slow": "node(2)", "fast": "node(3)" }, "note": "fast advances: 1→2→3" },
    { "line": 6, "vars": { "slow": "node(2)", "fast": "node(3)" }, "note": "slow(2) ≠ fast(3) — continue" },
    { "line": 3, "vars": { "slow": "node(2)", "fast": "node(3)" }, "note": "fast=node(3) ✓, fast.next=node(2) ✓ — loop again" },
    { "line": 4, "vars": { "slow": "node(3)", "fast": "node(3)" }, "note": "slow advances: 2→3" },
    { "line": 5, "vars": { "slow": "node(3)", "fast": "node(2)" }, "note": "fast advances: 3→2→3 (cycle!)" },
    { "line": 6, "vars": { "slow": "node(3)", "fast": "node(3)" }, "note": "slow == fast → CYCLE DETECTED!", "stdout": "True" },
    { "line": 7, "vars": { "slow": "node(3)", "fast": "node(3)" }, "note": "Return True" }
  ],
  "speed": 800
}
\`\`\`

---

## Run It Yourself

\`\`\`playground
{
  "title": "Floyd's Cycle Detection — Interactive",
  "language": "python",
  "runnable": true,
  "code": "class ListNode:\\n    def __init__(self, val=0):\\n        self.val = val\\n        self.next = None\\n    def __repr__(self):\\n        return f\\"Node({self.val})\\"\\n\\ndef has_cycle(head):\\n    slow = head\\n    fast = head\\n    steps = 0\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        steps += 1\\n        if slow == fast:\\n            print(f\\"Cycle detected after {steps} steps! Collision at {slow}\\")\\n            return True\\n    print(f\\"No cycle — fast pointer reached end after {steps} steps\\")\\n    return False\\n\\n# --- Test 1: List WITH a cycle ---\\n# Build: 1 -> 2 -> 3 -> 4 -> 5 -> (back to node 2)\\nprint(\\"=== Test 1: Cycle present ===\\")\\nnodes = [ListNode(i) for i in range(1, 6)]\\nfor i in range(len(nodes) - 1):\\n    nodes[i].next = nodes[i + 1]\\nnodes[-1].next = nodes[1]  # 5 -> 2 (cycle!)\\nprint(has_cycle(nodes[0]))\\n\\n# --- Test 2: List WITHOUT a cycle ---\\nprint(\\"\\\\n=== Test 2: No cycle ===\\")\\na, b, c = ListNode(1), ListNode(2), ListNode(3)\\na.next = b\\nb.next = c\\n# c.next stays None\\nprint(has_cycle(a))\\n\\n# --- Test 3: Single node, self-loop ---\\nprint(\\"\\\\n=== Test 3: Self-loop ===\\")\\nalone = ListNode(42)\\nalone.next = alone\\nprint(has_cycle(alone))"
}
\`\`\`

---

## Common Mistakes

\`\`\`callout
{ "type": "danger", "title": "Forgetting to check fast.next", "content": "Always guard with \`while fast and fast.next\`. If you only check \`while fast\`, then \`fast.next.next\` will throw an \`AttributeError\` when \`fast\` is the last node (its \`next\` is \`None\`)." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Comparing values, not references", "content": "Use \`slow == fast\` to compare **node identity** (same object), not \`slow.val == fast.val\`. Two different nodes can hold the same value — you need to confirm it's the exact same node object in memory." }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why start both at head?", "content": "Starting both pointers at \`head\` (not \`head.next\`) simplifies the loop condition. The loop runs \`while fast and fast.next\`, so the pointers only move if both conditions are met — safe to advance fast by two steps." }
\`\`\`

---

## Before-After: Naive vs. Floyd's

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naive — O(n) Space (Hash Set)",
    "code": "def has_cycle_naive(head):\\n    visited = set()\\n    current = head\\n    while current:\\n        if id(current) in visited:\\n            return True\\n        visited.add(id(current))\\n        current = current.next\\n    return False\\n# Space: O(n) — stores id of every node"
  },
  "after": {
    "label": "Floyd's — O(1) Space (Two Pointers)",
    "code": "def has_cycle(head):\\n    slow = head\\n    fast = head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow == fast:\\n            return True\\n    return False\\n# Space: O(1) — only two pointer variables"
  }
}
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{
  "title": "Implement Floyd's Cycle Detection",
  "prompt": "Complete the cycle detection function. The slow pointer moves 1 step; the fast pointer moves 2 steps.",
  "language": "python",
  "template": "def has_cycle(head):\\n    slow = head\\n    fast = ___\\n    while fast and ___:\\n        slow = slow.next\\n        fast = fast.next.___\\n        if slow == ___:\\n            return True\\n    return False",
  "blanks": [
    { "answer": "head", "hint": "Fast pointer starts at the same position as slow" },
    { "answer": "fast.next", "hint": "We need to safely advance fast by 2 — what must exist for that?" },
    { "answer": "next", "hint": "fast.next.WHAT gives us 2 steps forward?" },
    { "answer": "fast", "hint": "Cycle is detected when both pointers point to the same node" }
  ]
}
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{
  "title": "Linked List Cycle Detection",
  "questions": [
    {
      "question": "What is the space complexity of Floyd's cycle detection algorithm?",
      "options": ["O(n) — stores all visited nodes", "O(log n) — uses recursive stack", "O(1) — only two pointer variables", "O(n²) — compares every pair of nodes"],
      "answer": 2,
      "explanation": "Floyd's algorithm uses only two pointers (slow and fast), regardless of list length. This is O(1) space — a major advantage over the hash set approach which requires O(n) space."
    },
    {
      "question": "In Floyd's algorithm, if the list has NO cycle, what happens?",
      "options": ["slow and fast always collide at the tail", "fast reaches None and the loop exits", "slow reaches None first and we return False", "An infinite loop occurs"],
      "answer": 1,
      "explanation": "If there's no cycle, the fast pointer will eventually reach None (end of list). The condition \`while fast and fast.next\` will evaluate to False, breaking the loop, and we return False."
    },
    {
      "question": "Why must we check \`fast.next\` in addition to \`fast\` in the while condition?",
      "options": ["To avoid comparing equal values", "Because fast.next.next would throw an error if fast.next is None", "To handle duplicate values in the list", "To ensure slow doesn't overtake fast"],
      "answer": 1,
      "explanation": "Inside the loop we advance fast with \`fast.next.next\`. If \`fast.next\` is None (fast is at the last node), then \`fast.next.next\` raises an AttributeError. Checking \`fast.next\` in the while guard prevents this."
    },
    {
      "question": "If a linked list has exactly 1 node pointing to itself (self-loop), will Floyd's algorithm detect it?",
      "options": ["No — the loop exits immediately since fast.next.next is itself", "Yes — on the first iteration, slow and fast both advance to the same node", "No — a single node cannot form a cycle", "Yes — but only after n iterations"],
      "answer": 1,
      "explanation": "With a self-loop, head.next = head. On the first iteration: slow = head.next = head, fast = head.next.next = head. They're equal immediately — cycle detected! The while guard passes because fast (head) is not None and fast.next (head) is not None."
    },
    {
      "question": "What is the time complexity of Floyd's cycle detection algorithm?",
      "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      "answer": 2,
      "explanation": "In the worst case (no cycle), the fast pointer traverses the entire list once, visiting at most n nodes. If there is a cycle, both pointers enter it and the fast pointer catches the slow pointer within at most one full cycle traversal — still O(n) overall."
    }
  ]
}
\`\`\`

---

## When to Apply This Pattern

\`\`\`collapse
{ "title": "Deep Dive: Recognizing Fast & Slow Pointer Problems", "content": "Floyd's cycle detection is the foundation of a whole family of fast & slow pointer problems. Look for these signals in a problem:\\n\\n**Use fast & slow pointers when:**\\n- Problem involves a linked list or sequence with possible cycles\\n- You need to find the **midpoint** of a linked list\\n- You need to find the **start** of a cycle (extension of this lesson)\\n- Problem involves detecting repeated states (e.g., Happy Number problem)\\n- Space must be O(1)\\n\\n**Problems that build on this lesson:**\\n- *Middle of the Linked List* — stop when fast reaches end; slow is at midpoint\\n- *Start of LinkedList Cycle* — after detection, reset one pointer to head and advance both at speed 1\\n- *Happy Number* — treat digit-square sums as a \\"linked list\\" and detect a cycle\\n- *Palindrome Linked List* — find midpoint, reverse second half, compare\\n\\n**The key insight:** Any sequence of states that could repeat can be modeled as a linked list with a potential cycle." }
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Floyd's Cycle Detection uses two pointers (slow=1 step, fast=2 steps) — if they ever meet, a cycle exists",
    "Time complexity is O(n), space complexity is O(1) — better than the O(n) space hash set approach",
    "Guard the while loop with \`while fast and fast.next\` to safely advance the fast pointer by two steps",
    "Compare node identity (\`slow == fast\`), not values — different nodes can hold the same value",
    "If no cycle exists, the fast pointer reaches None and the loop terminates naturally"
  ]
}
\`\`\``,
      starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def has_cycle(head: ListNode) -> bool:
    """
    Detect whether a linked list contains a cycle.
    Use Floyd's cycle detection algorithm (two pointers).
    Time: O(n), Space: O(1) — no visited set allowed!
    """
    # TODO: Initialize two pointers — slow and fast — both starting at head

    # TODO: Loop while fast and fast.next are not None
    #       (if either reaches None, there's no cycle)

        # TODO: Move slow one step forward

        # TODO: Move fast two steps forward

        # TODO: If slow and fast meet, a cycle exists — return True

    # TODO: Loop ended without meeting — return False
    pass


# --- Tests ---
def make_list(values, cycle_pos=None):
    """Helper: build a linked list; connect tail to node at cycle_pos index if given."""
    if not values:
        return None
    nodes = [ListNode(v) for v in values]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if cycle_pos is not None:
        nodes[-1].next = nodes[cycle_pos]
    return nodes[0]


if __name__ == "__main__":
    # Cycle: tail connects back to index 1
    assert has_cycle(make_list([3, 2, 0, -4], cycle_pos=1)) == True
    # Cycle: tail connects back to index 0
    assert has_cycle(make_list([1, 2], cycle_pos=0)) == True
    # No cycle
    assert has_cycle(make_list([1])) == False
    # Empty list
    assert has_cycle(None) == False
    print("All tests passed!")
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def has_cycle(head: ListNode) -> bool:
    """
    Floyd's Cycle Detection ("tortoise and hare"):
    - slow pointer moves 1 step at a time
    - fast pointer moves 2 steps at a time
    - if a cycle exists, fast will eventually lap slow and they meet
    - if no cycle, fast reaches the end (None)
    Time: O(n), Space: O(1)
    """
    slow = head
    fast = head

    while fast is not None and fast.next is not None:
        slow = slow.next        # move 1 step
        fast = fast.next.next   # move 2 steps

        if slow is fast:        # pointers met — cycle confirmed
            return True

    return False  # fast hit the end — no cycle


# --- Tests ---
def make_list(values, cycle_pos=None):
    """Helper: build a linked list; connect tail to node at cycle_pos index if given."""
    if not values:
        return None
    nodes = [ListNode(v) for v in values]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if cycle_pos is not None:
        nodes[-1].next = nodes[cycle_pos]
    return nodes[0]


if __name__ == "__main__":
    # Cycle: tail connects back to index 1
    assert has_cycle(make_list([3, 2, 0, -4], cycle_pos=1)) == True
    # Cycle: tail connects back to index 0
    assert has_cycle(make_list([1, 2], cycle_pos=0)) == True
    # No cycle
    assert has_cycle(make_list([1])) == False
    # Empty list
    assert has_cycle(None) == False
    print("All tests passed!")
`,
    },
    {
      id: "start-of-cycle",
      slug: "start-of-cycle",
      title: "Start of LinkedList Cycle",
      content: `# Start of LinkedList Cycle

You've already learned how to *detect* a cycle using Floyd's fast & slow pointer algorithm. But interviews rarely stop there. The follow-up question is almost always:

> "Great — now tell me **where** the cycle starts."

This lesson proves, mathematically, why Floyd's algorithm lets you pinpoint the exact entry node — and walks you through implementing it from scratch.

\`\`\`concept
{ "title": "The Core Insight", "variant": "mental-model", "content": "Once the fast and slow pointers meet inside the cycle, resetting one pointer to the head and advancing both at speed 1 will cause them to meet again — exactly at the cycle's start node. This is not a coincidence; it follows from the algebra of their distances." }
\`\`\`

---

## Setting Up the Problem

Consider this linked list:

\`\`\`
Head → 1 → 2 → 3 → 4 → 5 → 6
                    ↑           ↓
                    └───────────┘
                    (cycle start)
\`\`\`

Node \`4\` is where the cycle begins. Node \`6\` points back to node \`4\`. Your goal is to return a reference to node \`4\` — not just \`True\`.

\`\`\`callout
{ "type": "info", "title": "Problem Constraints", "content": "- The linked list may or may not have a cycle\\n- If no cycle exists, return \`None\`\\n- You must use **O(1) extra space** (no hash sets allowed in the optimal solution)\\n- Time complexity must be **O(n)**" }
\`\`\`

---

## Phase 1: Detect the Meeting Point

First, run the standard cycle detection you already know. The fast pointer moves 2 steps per iteration; the slow pointer moves 1.

\`\`\`algoviz
{ "title": "Phase 1 — Finding the Meeting Point", "type": "linkedlist", "data": [1, 2, 3, 4, 5, 6], "frames": [ { "highlight": [0], "label": "slow=Head(1), fast=Head(1). Both start at head.", "stats": { "slow": 1, "fast": 1 } }, { "highlight": [1, 2], "label": "slow moves 1→2, fast moves 1→3.", "stats": { "slow": 2, "fast": 3 } }, { "highlight": [2, 4], "label": "slow moves 2→3, fast moves 3→5.", "stats": { "slow": 3, "fast": 5 } }, { "highlight": [3, 5], "label": "slow moves 3→4, fast moves 5→6.", "stats": { "slow": 4, "fast": 6 } }, { "highlight": [4, 3], "label": "slow moves 4→5, fast cycles: 6→4.", "stats": { "slow": 5, "fast": 4 } }, { "highlight": [5, 4], "label": "slow moves 5→6, fast moves 4→5.", "stats": { "slow": 6, "fast": 5 } }, { "highlight": [3, 3], "label": "slow moves 6→4, fast moves 5→6→4. THEY MEET at node 4!", "stats": { "slow": 4, "fast": 4 } } ], "speed": 900 }
\`\`\`

---

## The Mathematical Proof

Here is where the magic happens. Let's define three distances:

| Variable | Meaning |
|----------|---------|
| **D** | Distance from **head** to the **cycle start** |
| **K** | Distance from **cycle start** to the **meeting point** |
| **C** | Total **cycle length** |

When the two pointers meet:
- Slow pointer has traveled: \`D + K\`
- Fast pointer has traveled: \`D + K + n × C\` (it looped around \`n\` times)

Since fast moves twice as fast as slow:

\`\`\`
2(D + K) = D + K + n × C
D + K    = n × C
D        = n × C − K
\`\`\`

\`\`\`concept
{ "title": "The Key Equation: D = nC − K", "variant": "insight", "content": "The distance from the head to the cycle start (D) equals n full cycle lengths minus the distance from cycle start to the meeting point (K). This means if one pointer starts at the head and another stays at the meeting point, both moving at speed 1, they will travel equal distances and arrive at the cycle start simultaneously." }
\`\`\`

### Why Does This Work?

After the meeting point, the pointer inside the cycle needs to travel \`nC − K\` more steps to reach the cycle start. That's exactly \`D\` steps — the same number the head-pointer needs to reach the cycle start. They arrive together.

\`\`\`collapse
{ "title": "Deep Dive: Walking Through the Algebra with Numbers", "content": "Using our example list: Head → 1 → 2 → 3 → 4 → 5 → 6 → (back to 4)\\n\\n**Measuring distances:**\\n- D = 3 (head to cycle start: nodes 1→2→3→4, so 3 edges)\\n- C = 3 (cycle: 4→5→6→4, so 3 edges)\\n- The pointers met at node 4 (the cycle start itself in this case), so K = 0\\n\\n**Checking the equation:**\\n\`D = nC - K → 3 = 1×3 - 0 = 3\` ✓\\n\\n**Phase 2:** One pointer at head (node 1), one stays at meeting point (node 4).\\nBoth move 1 step at a time:\\n- Step 1: head-ptr → node 2, cycle-ptr → node 5\\n- Step 2: head-ptr → node 3, cycle-ptr → node 6\\n- Step 3: head-ptr → node 4, cycle-ptr → node 4 ← **MEET at cycle start!**\\n\\nThe algebra holds exactly." }
\`\`\`

---

## Phase 2: Finding the Cycle Start

\`\`\`steps
{ "title": "Phase 2 Algorithm — Two Pointer Reset", "steps": [ { "title": "Confirm a cycle exists", "content": "Run the standard fast/slow detection. If \`fast\` or \`fast.next\` becomes \`None\`, return \`None\` immediately — no cycle exists." }, { "title": "Keep slow at meeting point", "content": "When the pointers meet, **do not move** the slow pointer. It stays at the intersection node inside the cycle." }, { "title": "Reset fast to head", "content": "Move the fast pointer back to \`head\`. Now rename them mentally: pointer1 (at head) and pointer2 (at meeting point)." }, { "title": "Advance both at speed 1", "content": "Move **both** pointers one step at a time. They will converge at the cycle start node after exactly D steps." }, { "title": "Return the meeting node", "content": "When \`pointer1 == pointer2\`, that node is the cycle start. Return it." } ] }
\`\`\`

---

## Implementation

\`\`\`playground
{ "title": "Start of LinkedList Cycle — Full Solution", "language": "python", "code": "class ListNode:\\n    def __init__(self, val=0, next=None):\\n        self.val = val\\n        self.next = next\\n\\n\\ndef find_cycle_start(head):\\n    \\"\\"\\"\\n    Returns the node where the cycle begins,\\n    or None if there is no cycle.\\n    Time:  O(n)\\n    Space: O(1)\\n    \\"\\"\\"\\n    if not head or not head.next:\\n        return None\\n\\n    # --- Phase 1: Detect the meeting point ---\\n    slow, fast = head, head\\n    cycle_found = False\\n\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow is fast:\\n            cycle_found = True\\n            break\\n\\n    if not cycle_found:\\n        return None  # No cycle\\n\\n    # --- Phase 2: Find the cycle start ---\\n    # Reset one pointer to head; keep the other at meeting point\\n    pointer1 = head\\n    pointer2 = slow  # meeting point\\n\\n    while pointer1 is not pointer2:\\n        pointer1 = pointer1.next\\n        pointer2 = pointer2.next\\n\\n    return pointer1  # Both point to cycle start\\n\\n\\n# --- Build test linked list: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> (back to 4) ---\\ndef build_cyclic_list():\\n    nodes = [ListNode(i) for i in range(1, 7)]\\n    for i in range(5):\\n        nodes[i].next = nodes[i + 1]\\n    nodes[5].next = nodes[3]  # node 6 -> node 4 (index 3)\\n    return nodes[0], nodes[3]  # return head and expected cycle start\\n\\nhead, expected = build_cyclic_list()\\nresult = find_cycle_start(head)\\n\\nif result:\\n    print(f\\"Cycle starts at node with value: {result.val}\\")\\n    print(f\\"Expected: {expected.val}\\")\\n    print(f\\"Correct: {result is expected}\\")\\nelse:\\n    print(\\"No cycle found\\")\\n\\n# Test with no cycle\\nno_cycle_head = ListNode(1, ListNode(2, ListNode(3)))\\nprint(f\\"\\\\nNo-cycle test: {find_cycle_start(no_cycle_head)}\\")  # Should be None\\n", "runnable": true }
\`\`\`

---

## Step-by-Step Trace

Let's trace through Phase 2 to build intuition:

\`\`\`trace
{ "title": "Phase 2 Trace — Both Pointers Moving at Speed 1", "language": "python", "code": "pointer1 = head        # starts at node 1\\npointer2 = slow        # stays at meeting point (node 4)\\n\\n# Iteration 1\\npointer1 = pointer1.next  # node 1 -> node 2\\npointer2 = pointer2.next  # node 4 -> node 5\\n\\n# Iteration 2\\npointer1 = pointer1.next  # node 2 -> node 3\\npointer2 = pointer2.next  # node 5 -> node 6\\n\\n# Iteration 3\\npointer1 = pointer1.next  # node 3 -> node 4  ← cycle start!\\npointer2 = pointer2.next  # node 6 -> node 4  ← cycle start!\\n\\n# pointer1 is pointer2  →  True\\n# return pointer1  (node 4)", "frames": [ { "line": 1, "vars": { "pointer1": "node(1)", "pointer2": "node(4)" }, "note": "pointer1 reset to head. pointer2 stays at meeting point." }, { "line": 4, "vars": { "pointer1": "node(2)", "pointer2": "node(4)" }, "note": "pointer1 advances to node 2." }, { "line": 5, "vars": { "pointer1": "node(2)", "pointer2": "node(5)" }, "note": "pointer2 advances to node 5." }, { "line": 8, "vars": { "pointer1": "node(3)", "pointer2": "node(5)" }, "note": "pointer1 advances to node 3." }, { "line": 9, "vars": { "pointer1": "node(3)", "pointer2": "node(6)" }, "note": "pointer2 advances to node 6." }, { "line": 12, "vars": { "pointer1": "node(4)", "pointer2": "node(6)" }, "note": "pointer1 reaches node 4 — the cycle start!" }, { "line": 13, "vars": { "pointer1": "node(4)", "pointer2": "node(4)" }, "note": "pointer2 wraps from node 6 back to node 4. They meet! Return node 4." } ], "speed": 900 }
\`\`\`

---

## Comparing Approaches

\`\`\`tabs
{ "tabs": [ { "label": "Floyd's Algorithm (Optimal)", "icon": "⚡", "content": "**Time:** O(n) — two passes at most\\n**Space:** O(1) — only two pointers\\n\\n\`\`\`python\\ndef find_cycle_start(head):\\n    slow = fast = head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow is fast:\\n            break\\n    else:\\n        return None  # no cycle\\n    pointer1 = head\\n    while pointer1 is not slow:\\n        pointer1 = pointer1.next\\n        slow = slow.next\\n    return pointer1\\n\`\`\`\\n\\nThis is the **interview-expected** answer. Uses the mathematical relationship D = nC − K." }, { "label": "Hash Set (Brute Force)", "icon": "🐢", "content": "**Time:** O(n)\\n**Space:** O(n) — stores every visited node\\n\\n\`\`\`python\\ndef find_cycle_start_hash(head):\\n    visited = set()\\n    current = head\\n    while current:\\n        if current in visited:\\n            return current  # first repeated node = cycle start\\n        visited.add(current)\\n        current = current.next\\n    return None\\n\`\`\`\\n\\nEasy to understand, but uses O(n) memory. Interviewers will ask you to optimize this to O(1) space — which leads directly to Floyd's approach." }, { "label": "Edge Cases", "icon": "🔍", "content": "Always handle these before your main logic:\\n\\n| Case | Behavior |\\n|------|----------|\\n| \`head = None\` | Return \`None\` immediately |\\n| Single node, no self-loop | Return \`None\` |\\n| Single node with self-loop (\`node.next = node\`) | Return the node itself |\\n| Cycle at head | Phase 2 returns head |\\n| Cycle at tail only | Works normally |\\n\\n\`\`\`python\\n# Self-loop test\\nnode = ListNode(42)\\nnode.next = node\\nprint(find_cycle_start(node).val)  # → 42\\n\`\`\`" } ] }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the Phase 2 Logic", "prompt": "Fill in the missing parts of the cycle-start finder. After the meeting point is found in Phase 1:", "language": "python", "template": "# Phase 2: find cycle start\\npointer1 = ___      # reset to head\\npointer2 = ___      # stays at meeting point\\n\\nwhile pointer1 ___ pointer2:\\n    pointer1 = pointer1.___\\n    pointer2 = pointer2.___\\n\\nreturn pointer1", "blanks": [ { "answer": "head", "hint": "One pointer must start from the very beginning of the list" }, { "answer": "slow", "hint": "The other pointer stays where the two pointers met inside the cycle" }, { "answer": "is not", "hint": "We stop when they point to the exact same node object (use identity, not equality)" }, { "answer": "next", "hint": "Move one step forward" }, { "answer": "next", "hint": "Both pointers move at the same speed (1 step)" } ] }
\`\`\`

---

## Quiz

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "After Phase 1 of Floyd's algorithm, slow and fast pointers meet inside the cycle. What do you do next to find the cycle start?", "options": [ "Keep both pointers moving at their current speeds until they meet again", "Reset the slow pointer to head, then advance both pointers one step at a time", "Reset the fast pointer to head, then advance both pointers one step at a time", "Count the cycle length, then use it to offset a fresh head pointer" ], "answer": 2, "explanation": "Reset the FAST pointer to head, then move both at speed 1. After the meeting point the 'fast' pointer becomes 'pointer1' at head; 'slow' (at the meeting point) becomes 'pointer2'. They'll converge at the cycle start after D steps." }, { "question": "In Floyd's algorithm, if D is the distance from head to cycle start, K is the distance from cycle start to meeting point, and C is the cycle length, which equation holds?", "options": [ "D = K + C", "D = nC + K", "D = nC − K", "D = C − 2K" ], "answer": 2, "explanation": "The fast pointer travels twice as far as the slow pointer: 2(D+K) = D+K+nC, which simplifies to D = nC − K. This means advancing D steps from the meeting point lands you at the cycle start — the same as advancing D steps from the head." }, { "question": "What is the space complexity of Floyd's cycle-start algorithm?", "options": [ "O(n) — proportional to list length", "O(log n) — logarithmic in list length", "O(1) — only two pointer variables", "O(C) — proportional to cycle length" ], "answer": 2, "explanation": "Floyd's algorithm uses only two pointer variables (slow and fast, or pointer1 and pointer2 in Phase 2). This is O(1) space regardless of list length — a key advantage over the hash-set approach." }, { "question": "A linked list has nodes: 1 → 2 → 3 → 4 → 5, with node 5 pointing back to node 3. What value does find_cycle_start return?", "options": [ "2", "3", "4", "5" ], "answer": 1, "explanation": "The cycle starts at node 3. D=2 (head to node 3), C=3 (nodes 3,4,5), K varies by meeting point. The algorithm correctly identifies node 3 as the first node that belongs to the cycle." }, { "question": "Which comparison should you use to check if pointer1 and pointer2 have met at the cycle start?", "options": [ "pointer1.val == pointer2.val", "pointer1 == pointer2", "pointer1 is pointer2", "pointer1.next is pointer2.next" ], "answer": 2, "explanation": "Use Python's \`is\` operator to check object identity — you need both pointers to reference the exact same node object in memory. Using \`.val\` equality could give false positives if multiple nodes share the same value." } ] }
\`\`\`

---

## Complexity Summary

| Phase | Time | Space | What it does |
|-------|------|-------|-------------|
| Phase 1 | O(n) | O(1) | Detect cycle, find meeting point |
| Phase 2 | O(n) | O(1) | Walk D steps from head + meeting point |
| **Total** | **O(n)** | **O(1)** | Find exact cycle start |

\`\`\`callout
{ "type": "tip", "title": "Interview Pattern to Mention", "content": "When explaining this in an interview, walk through both phases explicitly:\\n1. **Detection phase** — prove a cycle exists and find where they meet\\n2. **Location phase** — use the D = nC − K equation to explain *why* resetting one pointer to head guarantees they meet at the cycle start\\n\\nMost candidates can write the code; very few can explain *why* it works. That's what sets you apart." }
\`\`\`

---

## Related Problems Using This Pattern

This same two-phase technique appears in several disguised forms:

\`\`\`tabs
{ "tabs": [ { "label": "Happy Number", "icon": "😊", "content": "A number is 'happy' if repeatedly summing the squares of its digits eventually reaches 1. If it cycles forever, it's not happy.\\n\\n**Connection:** Treat each transformation as a \`node.next\`. Run Floyd's on the sequence of values. If \`slow == fast == 1\`, it's happy. If they meet at any other value, there's a cycle — not happy.\\n\\n\`\`\`python\\ndef is_happy(n):\\n    def next_num(x):\\n        total = 0\\n        while x:\\n            digit = x % 10\\n            total += digit * digit\\n            x //= 10\\n        return total\\n\\n    slow, fast = n, n\\n    while True:\\n        slow = next_num(slow)\\n        fast = next_num(next_num(fast))\\n        if slow == fast:\\n            break\\n    return slow == 1\\n\`\`\`" }, { "label": "Find Duplicate Number", "icon": "🔢", "content": "Given an array of n+1 integers where each value is in [1, n], find the duplicate without modifying the array and using O(1) space.\\n\\n**Connection:** Treat each value \`nums[i]\` as a 'next pointer' — index i points to index nums[i]. A duplicate value means two indices point to the same next index, creating a cycle. Apply Floyd's algorithm on the index sequence.\\n\\n\`\`\`python\\ndef find_duplicate(nums):\\n    slow, fast = nums[0], nums[nums[0]]\\n    while slow != fast:\\n        slow = nums[slow]\\n        fast = nums[nums[fast]]\\n    # Phase 2: find cycle start\\n    slow = 0\\n    while slow != fast:\\n        slow = nums[slow]\\n        fast = nums[fast]\\n    return slow\\n\`\`\`" }, { "label": "Palindrome LinkedList", "icon": "🪞", "content": "Check if a linked list is a palindrome in O(n) time and O(1) space.\\n\\n**Connection:** Use slow/fast pointers to find the midpoint (the fast-and-slow trick from the previous lesson). Then reverse the second half and compare.\\n\\n\`\`\`python\\ndef is_palindrome(head):\\n    # Step 1: Find middle\\n    slow, fast = head, head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n    # Step 2: Reverse second half\\n    prev, curr = None, slow\\n    while curr:\\n        curr.next, prev, curr = prev, curr, curr.next\\n    # Step 3: Compare\\n    left, right = head, prev\\n    while right:\\n        if left.val != right.val:\\n            return False\\n        left, right = left.next, right.next\\n    return True\\n\`\`\`" } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Floyd's cycle-start algorithm works in two phases: Phase 1 finds the meeting point, Phase 2 walks from both head and meeting point at speed 1 until they converge.", "The mathematical foundation is D = nC − K: the head-to-start distance equals n full cycle lengths minus the start-to-meeting distance.", "Always use Python's \`is\` operator (identity) not \`==\` (equality) when comparing node references.", "This pattern appears in disguised form in problems like Happy Number and Find Duplicate Number — recognizing the 'implicit linked list' is the key insight.", "The algorithm runs in O(n) time and O(1) space, making it the expected interview solution over hash-set approaches." ] }
\`\`\``,
      starterCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None


def find_cycle_start(head: ListNode) -> ListNode:
    """
    Given a linked list that contains a cycle, find the node where the cycle begins.

    Approach: Floyd's algorithm (two-pointer)
    Phase 1 - Detect the cycle using slow/fast pointers.
    Phase 2 - Find the cycle start using the mathematical proof:
              If slow and fast meet at distance 'k' from the cycle start,
              then the head is also exactly 'k' steps from the cycle start.
    """
    # TODO 1: Initialize slow and fast pointers both at head
    slow = None
    fast = None

    # TODO 2: Phase 1 — advance slow by 1 step and fast by 2 steps
    # until they meet inside the cycle
    while fast is not None and fast.next is not None:
        pass  # TODO: move slow and fast forward, break when they meet

    # TODO 3: Phase 2 — reset one pointer to head.
    # Then advance both pointers one step at a time.
    # The node where they meet is the cycle start.
    current1 = None  # TODO: set to head
    current2 = None  # TODO: set to the meeting point from Phase 1

    while current1 != current2:
        pass  # TODO: advance both pointers by 1

    # TODO 4: Return the cycle start node
    return None


# --- Test Harness ---
def build_list_with_cycle(values, cycle_index):
    """Helper: builds a linked list where the tail connects back to cycle_index."""
    nodes = [ListNode(v) for v in values]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if cycle_index >= 0:
        nodes[-1].next = nodes[cycle_index]
    return nodes[0], nodes[cycle_index]


if __name__ == '__main__':
    # Test 1: cycle starts at index 2 (value=3)
    head, expected_start = build_list_with_cycle([1, 2, 3, 4, 5], 2)
    result = find_cycle_start(head)
    print('Test 1:', 'PASS' if result is expected_start else f'FAIL (got {result.val if result else None})')

    # Test 2: cycle starts at index 0 (full list is the cycle)
    head, expected_start = build_list_with_cycle([1, 2, 3], 0)
    result = find_cycle_start(head)
    print('Test 2:', 'PASS' if result is expected_start else f'FAIL (got {result.val if result else None})')

    # Test 3: single-node cycle (node points to itself)
    head, expected_start = build_list_with_cycle([42], 0)
    result = find_cycle_start(head)
    print('Test 3:', 'PASS' if result is expected_start else f'FAIL (got {result.val if result else None})')
`,
      solutionCode: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None


def find_cycle_start(head: ListNode) -> ListNode:
    """
    Find the node where a cycle begins in a linked list.

    Mathematical proof (why Phase 2 works):
      Let F = distance from head to cycle start
          C = cycle length
          k = distance from cycle start to the meeting point

      When slow and fast meet:
        slow travelled: F + k
        fast travelled: F + k + n*C  (for some integer n)

      Since fast moves 2x as fast: 2(F + k) = F + k + n*C
        => F + k = n*C
        => F = n*C - k

      So the head is exactly F steps from the cycle start,
      and the meeting point is also F steps from the cycle start
      (going forward around the cycle). Therefore two pointers
      starting at head and meeting point, both moving 1 step at a
      time, will converge exactly at the cycle start.

    Time:  O(n)
    Space: O(1)
    """
    # Phase 1: detect the cycle — find the meeting point
    slow = head
    fast = head

    while fast is not None and fast.next is not None:
        slow = slow.next          # move 1 step
        fast = fast.next.next     # move 2 steps
        if slow is fast:          # cycle detected
            break

    # Phase 2: find the cycle start
    # Reset one pointer to head; the other stays at the meeting point.
    # Both move 1 step at a time — they meet at the cycle start.
    current1 = head
    current2 = slow  # meeting point from Phase 1

    while current1 != current2:
        current1 = current1.next
        current2 = current2.next

    return current1  # cycle start node


# --- Test Harness ---
def build_list_with_cycle(values, cycle_index):
    """Helper: builds a linked list where the tail connects back to cycle_index."""
    nodes = [ListNode(v) for v in values]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if cycle_index >= 0:
        nodes[-1].next = nodes[cycle_index]
    return nodes[0], nodes[cycle_index]


if __name__ == '__main__':
    # Test 1: cycle starts at index 2 (value=3)
    head, expected_start = build_list_with_cycle([1, 2, 3, 4, 5], 2)
    result = find_cycle_start(head)
    print('Test 1:', 'PASS' if result is expected_start else f'FAIL (got {result.val if result else None})')

    # Test 2: cycle starts at index 0 (full list is the cycle)
    head, expected_start = build_list_with_cycle([1, 2, 3], 0)
    result = find_cycle_start(head)
    print('Test 2:', 'PASS' if result is expected_start else f'FAIL (got {result.val if result else None})')

    # Test 3: single-node cycle (node points to itself)
    head, expected_start = build_list_with_cycle([42], 0)
    result = find_cycle_start(head)
    print('Test 3:', 'PASS' if result is expected_start else f'FAIL (got {result.val if result else None})')
`,
    },
    {
      id: "happy-number",
      slug: "happy-number",
      title: "Happy Number",
      content: `# Happy Number

## The Surprising Link Between Numbers and Cycles

At first glance, "Happy Number" sounds like a math puzzle — and it is. But it's also a perfect vehicle for understanding **Floyd's Cycle Detection** beyond linked lists.

Here's the problem: take any positive integer. Replace it with the **sum of the squares of its digits**. Repeat. If you eventually reach **1**, the number is *happy*. If you never reach 1 — you're stuck in a cycle forever — it's *unhappy*.

\`\`\`
19 → 1² + 9² = 82
82 → 8² + 2² = 68
68 → 6² + 8² = 100
100 → 1² + 0² + 0² = 1  ✓  HAPPY!
\`\`\`

But for unhappy numbers:

\`\`\`
2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 → 16 → ... (cycle!)
\`\`\`

The sequence for unhappy numbers always loops back. That's a **cycle detection problem** in disguise — and Floyd's fast/slow pointer algorithm is the perfect weapon.

\`\`\`concept
{ "title": "The Core Insight", "variant": "mental-model", "content": "The digit-sum sequence creates an implicit sequence of 'nodes'. For a happy number, following these nodes leads to 1. For an unhappy number, the sequence eventually revisits a value — forming a cycle. We never need a real linked list; any repeating sequence can be treated as one." }
\`\`\`

---

## The Digit-Sum Sequence as a Linked List

Imagine each number as a node. Each node points to exactly one successor: the sum of squares of its digits. This gives us an implicit linked list we can traverse with pointers.

\`\`\`algoviz
{ "title": "Unhappy Number 2: Traversing the Digit-Sum Sequence", "type": "linkedlist", "data": [2, 4, 16, 37, 58, 89, 145, 42, 20, 4], "frames": [ { "highlight": [0], "label": "Start: n = 2", "stats": { "slow": 2, "fast": 2 } }, { "highlight": [0, 1], "label": "slow→4, fast→4→16", "stats": { "slow": 4, "fast": 16 } }, { "highlight": [1, 2], "label": "slow→16, fast→58", "stats": { "slow": 16, "fast": 58 } }, { "highlight": [2, 4], "label": "slow→37, fast→145", "stats": { "slow": 37, "fast": 145 } }, { "highlight": [3, 5], "label": "slow→58, fast→20", "stats": { "slow": 58, "fast": 20 } }, { "highlight": [4, 6], "label": "slow→89, fast→4", "stats": { "slow": 89, "fast": 4 } }, { "highlight": [5, 1], "label": "slow→145, fast→16", "stats": { "slow": 145, "fast": 16 } }, { "highlight": [6, 2], "label": "slow→42, fast→37", "stats": { "slow": 42, "fast": 37 } }, { "highlight": [7, 3], "label": "slow→20, fast→58", "stats": { "slow": 20, "fast": 58 } }, { "highlight": [8, 4], "label": "slow→4, fast→145", "stats": { "slow": 4, "fast": 145 } }, { "highlight": [1, 6], "label": "slow→16, fast→42", "stats": { "slow": 16, "fast": 42 } }, { "highlight": [2, 7], "label": "MEET at same value → CYCLE DETECTED!", "stats": { "slow": 16, "fast": 16 } } ], "speed": 900 }
\`\`\`

\`\`\`concept
{ "title": "Two Termination Conditions", "variant": "rule", "content": "1. If fast pointer reaches 1 → the number IS happy (no cycle, sequence terminates).\\n2. If fast pointer equals slow pointer (and neither is 1) → the number is NOT happy (cycle detected).\\n\\nBoth conditions fall naturally out of Floyd's algorithm — no visited set needed." }
\`\`\`

---

## Building the Solution Step by Step

\`\`\`steps
{ "title": "Implementing Happy Number with Fast & Slow Pointers", "steps": [ { "title": "Write the digit-square-sum helper", "content": "We need a function that, given a number, computes the sum of squares of its digits:\\n\\n\`\`\`python\\ndef digit_sum(n):\\n    total = 0\\n    while n > 0:\\n        digit = n % 10      # extract last digit\\n        total += digit * digit\\n        n //= 10            # remove last digit\\n    return total\\n\`\`\`\\n\\nExample: \`digit_sum(19)\` → \`1² + 9²\` = \`1 + 81\` = \`82\`" }, { "title": "Initialize slow and fast pointers", "content": "Both start at \`n\`. The fast pointer advances **twice per step** through the digit-sum sequence:\\n\\n\`\`\`python\\nslow = n\\nfast = digit_sum(n)   # fast starts one step ahead\\n\`\`\`" }, { "title": "Run the loop until termination", "content": "Move slow one step, fast two steps each iteration:\\n\\n\`\`\`python\\nwhile fast != 1 and slow != fast:\\n    slow = digit_sum(slow)\\n    fast = digit_sum(digit_sum(fast))\\n\`\`\`\\n\\nThe loop exits when:\\n- \`fast == 1\` → happy number ✓\\n- \`slow == fast\` → cycle detected, unhappy ✗" }, { "title": "Return the result", "content": "\`\`\`python\\nreturn fast == 1\\n\`\`\`\\n\\nIf we exited because \`fast == 1\`, return \`True\`. If we exited because \`slow == fast\` (at some value ≠ 1), return \`False\`." } ] }
\`\`\`

---

## Full Implementation

\`\`\`playground
{ "title": "Happy Number — Fast & Slow Pointers", "language": "python", "runnable": true, "code": "def digit_sum(n):\\n    \\"\\"\\"Sum of squares of digits of n.\\"\\"\\"\\n    total = 0\\n    while n > 0:\\n        digit = n % 10\\n        total += digit * digit\\n        n //= 10\\n    return total\\n\\n\\ndef is_happy(n):\\n    slow = n\\n    fast = digit_sum(n)\\n\\n    while fast != 1 and slow != fast:\\n        slow = digit_sum(slow)\\n        fast = digit_sum(digit_sum(fast))\\n\\n    return fast == 1\\n\\n\\n# Test cases\\nprint(f\\"19 → {is_happy(19)}\\")   # True  (1² + 9² → ... → 1)\\nprint(f\\"2  → {is_happy(2)}\\")    # False (cycles through 4→16→37→...)\\nprint(f\\"1  → {is_happy(1)}\\")    # True  (already 1)\\nprint(f\\"7  → {is_happy(7)}\\")    # True\\nprint(f\\"4  → {is_happy(4)}\\")    # False\\n\\n# Trace the path for 19 manually\\nprint(\\"\\\\nPath for 19:\\")\\nnum = 19\\nsteps = [num]\\nfor _ in range(10):\\n    num = digit_sum(num)\\n    steps.append(num)\\n    if num == 1:\\n        break\\nprint(\\" → \\".join(map(str, steps)))\\n" }
\`\`\`

---

## Step-by-Step Execution Trace

Watch the variable states as the algorithm runs on \`n = 19\`:

\`\`\`trace
{ "title": "Execution trace: is_happy(19)", "language": "python", "code": "def digit_sum(n):\\n    total = 0\\n    while n > 0:\\n        digit = n % 10\\n        total += digit * digit\\n        n //= 10\\n    return total\\n\\ndef is_happy(n):\\n    slow = n\\n    fast = digit_sum(n)\\n    while fast != 1 and slow != fast:\\n        slow = digit_sum(slow)\\n        fast = digit_sum(digit_sum(fast))\\n    return fast == 1\\n\\nresult = is_happy(19)", "frames": [ { "line": 9, "vars": { "n": 19 }, "note": "Enter is_happy(19)" }, { "line": 10, "vars": { "slow": 19 }, "note": "slow = 19" }, { "line": 11, "vars": { "slow": 19, "fast": 82 }, "note": "fast = digit_sum(19) = 1²+9² = 82" }, { "line": 12, "vars": { "slow": 19, "fast": 82 }, "note": "Check: fast≠1, slow≠fast → enter loop" }, { "line": 13, "vars": { "slow": 82, "fast": 82 }, "note": "slow = digit_sum(19) = 82" }, { "line": 14, "vars": { "slow": 82, "fast": 68 }, "note": "fast = digit_sum(digit_sum(82)) = digit_sum(68) = 100" }, { "line": 12, "vars": { "slow": 82, "fast": 100 }, "note": "Check: fast≠1, slow≠fast → continue" }, { "line": 13, "vars": { "slow": 68, "fast": 100 }, "note": "slow = digit_sum(82) = 68" }, { "line": 14, "vars": { "slow": 68, "fast": 1 }, "note": "fast = digit_sum(digit_sum(100)) = digit_sum(1) = 1 ✓" }, { "line": 12, "vars": { "slow": 68, "fast": 1 }, "note": "fast == 1 → EXIT loop" }, { "line": 15, "vars": { "result": true }, "note": "return fast == 1 → True. 19 is HAPPY!" } ], "speed": 1000 }
\`\`\`

---

## Why Not Use a Hash Set?

\`\`\`tabs
{ "tabs": [ { "label": "Hash Set Approach", "icon": "🗃️", "content": "**The naive approach** stores every number seen:\\n\\n\`\`\`python\\ndef is_happy_set(n):\\n    seen = set()\\n    while n != 1:\\n        if n in seen:\\n            return False   # cycle!\\n        seen.add(n)\\n        n = digit_sum(n)\\n    return True\\n\`\`\`\\n\\n**Time:** O(log n) per step, until cycle or 1\\n\\n**Space:** O(log n) — must store every visited node\\n\\nThis works, but uses extra memory proportional to the cycle length." }, { "label": "Fast & Slow Approach", "icon": "⚡", "content": "**Floyd's algorithm** detects the cycle with zero extra storage:\\n\\n\`\`\`python\\ndef is_happy(n):\\n    slow = n\\n    fast = digit_sum(n)\\n    while fast != 1 and slow != fast:\\n        slow = digit_sum(slow)\\n        fast = digit_sum(digit_sum(fast))\\n    return fast == 1\\n\`\`\`\\n\\n**Time:** O(log n) per step, same asymptotic behavior\\n\\n**Space:** O(1) — only two integer variables!\\n\\nThe fast pointer laps the slow pointer inside any cycle, guaranteed." }, { "label": "Complexity Summary", "icon": "📊", "content": "| | Time | Space |\\n|---|---|---|\\n| Hash Set | O(log n) | O(log n) |\\n| Fast/Slow | O(log n) | **O(1)** |\\n\\n**Why O(log n)?** Each step reduces the number roughly by the number of digits. For very large n, the sequence quickly falls into a small range. The total steps before reaching 1 or a cycle is bounded by O(log n).\\n\\n**Interview answer:** Always prefer the O(1) space solution — it demonstrates mastery of Floyd's algorithm." } ] }
\`\`\`

---

## Common Pitfalls

\`\`\`callout
{ "type": "warning", "title": "Don't Initialize Both Pointers at the Same Value", "content": "If you set \`slow = n\` and \`fast = n\`, the while condition \`slow != fast\` is immediately False and you return the wrong answer!\\n\\nAlways advance fast by one step at initialization:\\n\`\`\`python\\nslow = n\\nfast = digit_sum(n)  # one step ahead\\n\`\`\`" }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "The Unhappy Cycle Always Contains 4", "content": "A mathematical fact: every unhappy number's sequence eventually enters the cycle: **4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4**. This is provable, but you don't need to know it for the algorithm — Floyd's detects ANY cycle automatically." }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the digit_sum helper", "prompt": "Fill in the two blanks to correctly extract digits and accumulate their squares:", "language": "python", "template": "def digit_sum(n):\\n    total = 0\\n    while n > 0:\\n        digit = n % ___\\n        total += digit * ___\\n        n //= 10\\n    return total", "blanks": [ { "answer": "10", "hint": "Modulo what value extracts the last digit?" }, { "answer": "digit", "hint": "You want to square the digit you just extracted" } ] }
\`\`\`

\`\`\`fillblank
{ "title": "Complete the fast pointer advance", "prompt": "The fast pointer must move TWO steps in the sequence each iteration. Fill in the blanks:", "language": "python", "template": "while fast != 1 and slow != fast:\\n    slow = digit_sum(___)\\n    fast = digit_sum(digit_sum(___))", "blanks": [ { "answer": "slow", "hint": "Slow moves one step from its current position" }, { "answer": "fast", "hint": "Fast moves two steps from its current position" } ] }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Happy Number — Check Your Understanding", "questions": [ { "question": "Why can we apply Floyd's cycle detection to the Happy Number problem even though there's no actual linked list?", "options": [ "Because Python integers are internally stored as linked nodes", "Because the digit-sum function maps each number to exactly one successor, creating an implicit sequence", "Because the numbers repeat in a sorted order", "Because cycle detection only works on numeric sequences" ], "answer": 1, "explanation": "Floyd's algorithm works on any sequence where each element has exactly one 'next' element. The digit-sum function f(n) defines exactly one successor for every n, creating an implicit linked list we can traverse with pointers — no actual linked list data structure is needed." }, { "question": "After the fast/slow loop exits with \`fast == slow\` (and neither equals 1), what can we conclude?", "options": [ "The number might still be happy — we need more iterations", "The sequence has entered a cycle that does not include 1, so the number is unhappy", "The fast pointer made an error and we should restart", "The number is happy because the pointers met" ], "answer": 1, "explanation": "If \`slow == fast\` and that value is not 1, Floyd's theorem guarantees we're inside a cycle. Since the sequence never reached 1, the number is unhappy. The pointers meeting at a non-1 value is definitive proof of a cycle." }, { "question": "What is the space complexity advantage of using fast/slow pointers over a hash set for cycle detection?", "options": [ "O(log n) vs O(n)", "O(1) vs O(log n)", "O(n) vs O(log n)", "Both use O(1) space" ], "answer": 1, "explanation": "The hash set approach must store every visited number until a repeat is found, which is O(log n) space (the cycle length is bounded by the number of digits). Fast/slow pointers use only two integer variables — O(1) space — regardless of the cycle length." }, { "question": "In the initialization \`slow = n; fast = digit_sum(n)\`, why does fast start one step ahead?", "options": [ "To save one iteration of the loop", "To ensure the loop condition \`slow != fast\` isn't immediately False at equal starting values", "Because digit_sum must be called at least once before the loop", "It's a style convention, not a correctness requirement" ], "answer": 1, "explanation": "If both pointers start at the same value, \`slow != fast\` is False and the loop never runs, returning \`fast == 1\` immediately — which is wrong for n > 1. Starting fast one step ahead ensures the algorithm actually runs. Alternatively, you can use a do-while style loop, but the off-by-one initialization is the cleanest Python pattern." } ] }
\`\`\`

---

## Generalizing the Pattern

\`\`\`concept
{ "title": "Fast & Slow Beyond Linked Lists", "variant": "insight", "content": "Any deterministic sequence where each element maps to exactly one successor can harbor a cycle. Floyd's algorithm detects it in O(1) space every time. You'll encounter this in:\\n\\n• **Happy Numbers** — digit-sum sequences (this lesson)\\n• **Functional graphs** — f(x) applied repeatedly\\n• **Pseudo-random generators** — detecting period length\\n• **Array-index cycles** — values treated as next-pointers\\n\\nWhen you see 'repeated application of a function' and 'detect if it loops', think fast/slow pointers." }
\`\`\`

---

## Variations to Watch For

\`\`\`collapse
{ "title": "Deep Dive: Cycle in a Circular Array", "content": "A harder variant: given an array where each element's value is a jump offset, determine if there's a cycle where all jumps go in the same direction.\\n\\nThe same fast/slow logic applies — \`slow\` advances one step, \`fast\` advances two — but 'one step' now means 'jump by \`arr[i]\` positions (mod n)'.\\n\\nExtra constraint: a valid cycle must have **all same-direction jumps** and **length > 1**. So you need to check:\\n1. The jump direction doesn't change mid-cycle\\n2. A single-element self-loop doesn't count\\n\\nThis problem (LeetCode 457) is a direct extension of today's pattern." }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The Happy Number problem is cycle detection on an implicit sequence — the digit-sum function maps each number to exactly one successor, forming a conceptual linked list.", "Floyd's fast & slow pointer algorithm detects cycles in O(1) space: if fast ever equals 1, the number is happy; if fast equals slow at any non-1 value, a cycle exists and the number is unhappy.", "Initialize slow = n and fast = digit_sum(n) (one step ahead) to avoid a false-negative on the very first loop check.", "The pattern generalizes to any repeated function application — whenever you see 'apply f(x) repeatedly and detect loops', fast & slow pointers are your O(1)-space tool.", "Compared to the hash set approach, fast/slow pointers trade no code complexity for an improvement from O(log n) to O(1) space — always mention this trade-off in interviews." ] }
\`\`\``,
      starterCode: `def get_digit_sum(n):
    # TODO: Compute the sum of squares of digits of n
    # Example: 19 -> 1^2 + 9^2 = 82
    pass


def is_happy(n):
    """
    Determine if n is a happy number using fast/slow pointers.
    A happy number eventually reaches 1 when repeatedly replacing
    it with the sum of squares of its digits.
    An unhappy number enters a cycle that never reaches 1.
    """
    # TODO: Initialize slow and fast pointers
    # slow moves one step at a time (one digit-sum)
    # fast moves two steps at a time (two digit-sums)
    slow = None  # TODO: set to n
    fast = None  # TODO: set to get_digit_sum(n)

    # TODO: Loop while slow != fast (cycle not yet detected)
    # Inside the loop:
    #   - advance slow by one step
    #   - advance fast by two steps

    # TODO: Return True if the meeting point is 1 (reached happy end),
    #        False if it's any other number (stuck in a cycle)
    pass


# --- Tests ---
if __name__ == "__main__":
    assert is_happy(19) == True,  "19 is happy"
    assert is_happy(1)  == True,  "1 is happy"
    assert is_happy(2)  == False, "2 is not happy"
    assert is_happy(4)  == False, "4 is not happy"
    print("All tests passed!")
`,
      solutionCode: `def get_digit_sum(n):
    """Return the sum of squares of the digits of n."""
    total = 0
    while n > 0:
        digit = n % 10
        total += digit * digit
        n //= 10
    return total


def is_happy(n):
    """
    Use Floyd's cycle-detection (fast/slow pointers) on the digit-sum sequence.

    - If the sequence reaches 1, n is a happy number.
    - If the sequence enters a cycle that doesn't include 1, n is unhappy.

    Both paths are caught by the same loop: when slow == fast the pointers
    have met, and we simply check whether the meeting point is 1.
    """
    slow = n                        # moves one step per iteration
    fast = get_digit_sum(n)         # moves two steps per iteration

    while slow != fast:
        slow = get_digit_sum(slow)              # one step
        fast = get_digit_sum(get_digit_sum(fast))  # two steps

    # If the cycle collapses at 1, the number is happy
    return slow == 1


# --- Tests ---
if __name__ == "__main__":
    assert is_happy(19) == True,  "19 is happy"
    assert is_happy(1)  == True,  "1 is happy"
    assert is_happy(2)  == False, "2 is not happy"
    assert is_happy(4)  == False, "4 is not happy"
    print("All tests passed!")
`,
    },
    {
      id: "middle-of-linked-list",
      slug: "middle-of-linked-list",
      title: "Middle of the LinkedList",
      content: `# Middle of the Linked List

Finding the middle of a linked list sounds straightforward — until you realize you can't index into it like an array. The naive approach walks the list **twice**: first to count the total length, then again to reach index \`length // 2\`. That's two full passes over potentially millions of nodes.

The **fast & slow pointer** technique does it in a single pass, using only two pointers and O(1) space.

\`\`\`concept
{
  "title": "The Tortoise and the Hare",
  "variant": "analogy",
  "content": "Imagine two runners on a straight track. The hare runs at 2× the tortoise's speed. The moment the hare crosses the finish line, the tortoise has covered exactly half the distance — landing at the midpoint. In a linked list, 'fast' is the hare (2 steps/iteration), 'slow' is the tortoise (1 step/iteration). When fast hits the end, slow is at the middle."
}
\`\`\`

## Why One Pass Works

Place two pointers — \`slow\` and \`fast\` — both starting at \`head\`:

- \`slow\` advances **one node** per iteration
- \`fast\` advances **two nodes** per iteration

When \`fast\` can no longer move forward, \`slow\` has covered exactly half the nodes, landing at the middle.

\`\`\`algoviz
{
  "title": "Fast & Slow Pointers on [1 → 2 → 3 → 4 → 5]",
  "type": "linkedlist",
  "data": [1, 2, 3, 4, 5],
  "frames": [
    { "highlight": [0], "label": "Start: slow=Node(1), fast=Node(1) — both at head", "stats": { "slow_idx": 0, "fast_idx": 0 } },
    { "highlight": [1, 2], "label": "Iteration 1: slow→Node(2), fast→Node(3)", "stats": { "slow_idx": 1, "fast_idx": 2 } },
    { "highlight": [2, 4], "label": "Iteration 2: slow→Node(3), fast→Node(5). fast.next is None → EXIT", "stats": { "slow_idx": 2, "fast_idx": 4 } },
    { "highlight": [2], "label": "✓ slow = Node(3) — the middle node!", "stats": { "slow_idx": 2, "fast_idx": 4 } }
  ],
  "speed": 900
}
\`\`\`

## The Loop Condition

The while condition \`fast and fast.next\` is doing two checks simultaneously:

| Condition | Guards Against |
|-----------|----------------|
| \`fast\` | Empty list — if \`head\` is \`None\`, this fails immediately |
| \`fast.next\` | Even-length lists — prevents \`fast.next.next\` from crashing on \`None\` |

\`\`\`callout
{
  "type": "info",
  "title": "Even-Length Lists Return the Second Middle",
  "content": "For \`[1 → 2 → 3 → 4]\`, there are two middle nodes: 2 and 3. The fast/slow approach returns **Node(3)** — the second middle. This matches LeetCode #876's expected output.\\n\\nIf you need the **first** middle instead, change the condition to \`while fast.next and fast.next.next\`. This stops one step earlier."
}
\`\`\`

## Step-by-Step Trace

Watch every variable as we trace \`[1 → 2 → 3 → 4 → 5]\`:

\`\`\`trace
{
  "title": "Tracing find_middle([1, 2, 3, 4, 5])",
  "language": "python",
  "code": "def find_middle(head):\\n    slow = head\\n    fast = head\\n\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n\\n    return slow",
  "frames": [
    { "line": 2, "vars": { "slow": "Node(1)", "fast": "unset" }, "note": "slow initialized to head" },
    { "line": 3, "vars": { "slow": "Node(1)", "fast": "Node(1)" }, "note": "fast initialized to head" },
    { "line": 5, "vars": { "slow": "Node(1)", "fast": "Node(1)" }, "note": "fast=Node(1) ✓  fast.next=Node(2) ✓ — enter loop" },
    { "line": 6, "vars": { "slow": "Node(2)", "fast": "Node(1)" }, "note": "slow advances one step" },
    { "line": 7, "vars": { "slow": "Node(2)", "fast": "Node(3)" }, "note": "fast advances two steps" },
    { "line": 5, "vars": { "slow": "Node(2)", "fast": "Node(3)" }, "note": "fast=Node(3) ✓  fast.next=Node(4) ✓ — continue" },
    { "line": 6, "vars": { "slow": "Node(3)", "fast": "Node(3)" }, "note": "slow advances one step" },
    { "line": 7, "vars": { "slow": "Node(3)", "fast": "Node(5)" }, "note": "fast advances two steps" },
    { "line": 5, "vars": { "slow": "Node(3)", "fast": "Node(5)" }, "note": "fast=Node(5) ✓  fast.next=None ✗ — EXIT loop" },
    { "line": 9, "vars": { "slow": "Node(3)", "fast": "Node(5)" }, "note": "Return slow → Node(3) is the middle ✓" }
  ],
  "speed": 800
}
\`\`\`

## Full Runnable Solution

\`\`\`playground
{
  "title": "Middle of the Linked List — Complete Solution",
  "language": "python",
  "code": "class ListNode:\\n    def __init__(self, val=0, next=None):\\n        self.val = val\\n        self.next = next\\n\\ndef find_middle(head):\\n    slow = head\\n    fast = head\\n\\n    while fast and fast.next:\\n        slow = slow.next        # one step\\n        fast = fast.next.next  # two steps\\n\\n    return slow\\n\\ndef build_list(values):\\n    if not values:\\n        return None\\n    head = ListNode(values[0])\\n    cur = head\\n    for v in values[1:]:\\n        cur.next = ListNode(v)\\n        cur = cur.next\\n    return head\\n\\n# Odd-length: [1, 2, 3, 4, 5] — true middle is 3\\nhead1 = build_list([1, 2, 3, 4, 5])\\nprint('Odd list middle:', find_middle(head1).val)   # 3\\n\\n# Even-length: [1, 2, 3, 4] — second middle is 3\\nhead2 = build_list([1, 2, 3, 4])\\nprint('Even list middle:', find_middle(head2).val)  # 3\\n\\n# Single node: [42] — only node is the middle\\nhead3 = build_list([42])\\nprint('Single node:', find_middle(head3).val)       # 42\\n\\n# Two nodes: [5, 10] — second middle is 10\\nhead4 = build_list([5, 10])\\nprint('Two-node list:', find_middle(head4).val)     # 10",
  "runnable": true
}
\`\`\`

## Naive vs Fast & Slow

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Naive: Two-Pass Approach",
    "code": "def find_middle_naive(head):\\n    # Pass 1: count the length\\n    length = 0\\n    cur = head\\n    while cur:\\n        length += 1\\n        cur = cur.next\\n\\n    # Pass 2: walk to the middle\\n    cur = head\\n    for _ in range(length // 2):\\n        cur = cur.next\\n    return cur\\n\\n# Traverses the list TWICE"
  },
  "after": {
    "label": "Fast & Slow: One-Pass Approach",
    "code": "def find_middle(head):\\n    slow = head\\n    fast = head\\n\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n\\n    return slow\\n\\n# Single traversal — no length needed"
  }
}
\`\`\`

Both are O(N) time, but the fast/slow approach:
- Requires **one traversal** instead of two (better cache behavior)
- Works without knowing the list length upfront
- Is the **core building block** for cycle detection, palindrome checking, and rearranging linked lists

## Complexity Breakdown

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Time Complexity",
      "icon": "⏱️",
      "content": "**O(N)** where N = number of nodes.\\n\\n\`fast\` moves 2 steps per iteration. To traverse N nodes, it takes N/2 iterations. So the total work is proportional to N.\\n\\nThis is **optimal** — you must examine every node at least once to reliably identify the middle."
    },
    {
      "label": "Space Complexity",
      "icon": "💾",
      "content": "**O(1)** — constant extra space.\\n\\nOnly two pointer variables (\`slow\` and \`fast\`) are allocated, regardless of the list's size. No auxiliary arrays, no recursion stack.\\n\\nContrast with an approach that copies all values into a list first — that would be O(N) space."
    },
    {
      "label": "Interview Playbook",
      "icon": "🎯",
      "content": "How to explain this pattern clearly in an interview:\\n\\n1. **Name it:** *'I'll use the fast and slow pointer technique — also known as Floyd's Tortoise and Hare.'*\\n2. **Justify it:** *'This avoids a second pass and doesn't need the list length.'*\\n3. **Handle even length:** *'For even-length lists, this returns the second middle — should I return the first instead?'*\\n4. **Connect to related problems:** *'The same idea detects cycles, finds the cycle start, and checks if a list is a palindrome.'*"
    }
  ]
}
\`\`\`

## Practice: Complete the Solution

\`\`\`fillblank
{
  "title": "Fill in the Fast & Slow Pointer Pattern",
  "prompt": "Complete the find_middle function using the fast and slow pointer technique:",
  "language": "python",
  "template": "def find_middle(head):\\n    slow = ___\\n    fast = ___\\n\\n    while ___ and ___.next:\\n        slow = slow.___\\n        fast = fast.next.___\\n\\n    return ___",
  "blanks": [
    { "answer": "head", "hint": "Both pointers start at the beginning of the list" },
    { "answer": "head", "hint": "Both pointers start at the beginning of the list" },
    { "answer": "fast", "hint": "Which pointer do we check for validity?" },
    { "answer": "fast", "hint": "Same pointer — we also check its next node exists" },
    { "answer": "next", "hint": "Slow moves exactly one step at a time" },
    { "answer": "next", "hint": "Fast moves two steps: fast.next.___ completes the jump" },
    { "answer": "slow", "hint": "When the loop exits, which pointer is at the middle?" }
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "For the list [1 → 2 → 3 → 4 → 5 → 6], what does find_middle() return?",
      "options": ["Node(3)", "Node(4)", "Node(2)", "Node(5)"],
      "answer": 1,
      "explanation": "For an even-length list of 6 nodes, the two middle nodes are 3 and 4. The fast/slow approach always returns the second middle. After 3 iterations: slow=Node(4), fast goes past the end. So the answer is Node(4)."
    },
    {
      "question": "Why must we check \`fast.next\` in the while condition, not just \`fast\`?",
      "options": [
        "To make the loop run exactly N/2 iterations",
        "Because \`fast.next.next\` would crash with AttributeError if fast.next is None",
        "To handle empty list edge cases",
        "Because slow also needs validation"
      ],
      "answer": 1,
      "explanation": "Inside the loop, we execute \`fast = fast.next.next\`. If \`fast.next\` were None, calling \`.next\` on it would raise \`AttributeError: 'NoneType' object has no attribute 'next'\`. Checking \`fast.next\` in the while condition prevents this crash."
    },
    {
      "question": "You want the FIRST middle node of an even-length list. Which condition achieves this?",
      "options": [
        "while fast.next and fast.next.next",
        "while fast and fast.next.next",
        "while fast.next",
        "while slow != fast"
      ],
      "answer": 0,
      "explanation": "Changing to \`while fast.next and fast.next.next\` stops the loop one iteration earlier — when fast is at the last node rather than past it. At that earlier stopping point, slow will be at the first of the two middle nodes instead of the second."
    },
    {
      "question": "What does find_middle() return when passed a single-node list?",
      "options": [
        "None",
        "The head node itself",
        "Raises an error",
        "Returns 0"
      ],
      "answer": 1,
      "explanation": "With a single node, \`fast = head\` and \`fast.next = None\`. The while condition \`fast and fast.next\` evaluates to \`True and False = False\`, so the loop body never runs. \`slow\` still points to \`head\`, which is immediately returned — the correct answer."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Fast & slow pointers find the linked list middle in one pass — no need to count length first.",
    "When fast reaches the end, slow is at the middle (second middle for even-length lists).",
    "The loop condition \`while fast and fast.next\` guards against NoneType crashes on odd and even lists.",
    "Time complexity is O(N), space complexity is O(1) — both optimal for this problem.",
    "This pattern is the foundation for Floyd's cycle detection, palindrome checking, and linked list rearrangement."
  ]
}
\`\`\``,
    },
    {
      id: "palindrome-linked-list",
      slug: "palindrome-linked-list",
      title: "Palindrome LinkedList",
      content: `## Palindrome LinkedList

Content generation failed. Please retry.`,
    },
    {
      id: "fast-slow-checkpoint",
      slug: "fast-slow-checkpoint",
      title: "Checkpoint: Fast & Slow Pointers Review",
      content: `## Checkpoint: Fast & Slow Pointers Review

Content generation failed. Please retry.`,
    },
  ],
};
