import { Module } from "../types";

export const fastSlowPointersModule: Module = {
  id: "fast-slow-pointers",
  title: "Fast & Slow Pointers",
  description: "Learn the fast and slow pointers (Floyd's Cycle Detection) technique to solve problems involving cycles in linked lists and arrays, and finding middle elements.",
  lessons: [
    {
      id: "fast-slow-intro",
      slug: "fast-slow-intro",
      title: "Introduction to Fast & Slow Pointers",
      content: `## The Fast & Slow Pointers Pattern

The **fast and slow pointers** technique uses two pointers moving at different speeds — slow advances **1 step**, fast advances **2 steps** — to detect cycles, locate middle elements, and find repeated sequences. It is formally known as **Floyd's Cycle Detection Algorithm**, or the **Tortoise and Hare** algorithm.

\`\`\`concept
{
  "title": "The Tortoise and Hare",
  "variant": "analogy",
  "content": "Picture two runners on a track. The Hare sprints at double the Tortoise's pace. On a straight track the Hare reaches the finish line first and no meeting occurs — no cycle. On a circular track the Hare will eventually lap the Tortoise, guaranteeing a meeting inside the loop. The relative closing speed is always exactly 1 step per iteration, so the meeting is mathematically certain whenever a cycle exists."
}
\`\`\`

### Why Two Pointers at Different Speeds?

Two clean mathematical facts underpin every application of this pattern:

**Middle finding:** When the fast pointer has traveled the full length *n*, the slow pointer has traveled *n/2* — landing it precisely at the midpoint in a single pass, with no pre-counting needed.

**Cycle detection:** Inside a cycle of length *k*, the fast pointer gains exactly 1 step on the slow pointer per iteration. The gap shrinks by 1 every round and must eventually reach zero — the pointers meet. If there is no cycle, the fast pointer reaches \`null\` and the loop terminates cleanly.

**Finding the cycle start:** Once the pointers meet inside the cycle, reset one pointer to \`head\` and advance both at 1 step per iteration. The distance from \`head\` to the cycle entry equals the distance from the meeting node to the cycle entry (modulo *k*), so they arrive at the entry node simultaneously.

### Cycle Detection Visualized

The list below has a back-edge: **node 5 → node 3** (cycle). Watch the slow (🐢) and fast (🐇) pointers converge.

\`\`\`algoviz
{
  "title": "Floyd's Cycle Detection  —  1 → 2 → 3 → 4 → 5 → (back to 3)",
  "type": "linkedlist",
  "data": [1, 2, 3, 4, 5],
  "frames": [
    {
      "highlight": [0, 0],
      "label": "Init: 🐢 slow = node 1,  🐇 fast = node 1  (both at head)",
      "stats": { "slow": 0, "fast": 0 }
    },
    {
      "highlight": [1, 2],
      "label": "Step 1: 🐢 slow → node 2,  🐇 fast → node 3",
      "stats": { "slow": 1, "fast": 2 }
    },
    {
      "highlight": [2, 4],
      "label": "Step 2: 🐢 slow → node 3,  🐇 fast → node 5",
      "stats": { "slow": 2, "fast": 4 }
    },
    {
      "highlight": [3, 3],
      "label": "Step 3: 🐢 slow → node 4,  🐇 fast cycles (5 → 3 → 4). MEET at node 4!",
      "stats": { "slow": 3, "fast": 3 }
    }
  ],
  "speed": 900
}
\`\`\`

> The cycle back-edge (node 5 → node 3) is not shown as a forward arrow above, but the fast pointer wraps through it. They collide in just **3 steps** despite the list having 5 nodes.

### Four Core Applications

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Cycle Detection",
      "icon": "🔄",
      "content": "**Goal:** Does this linked list contain a cycle?\\n\\n**Approach:** Start both pointers at \`head\`. Each iteration: \`slow = slow.next\`, \`fast = fast.next.next\`. Guard against null before each dereference.\\n\\n- \`fast\` or \`fast.next\` is \`null\` → no cycle, return \`False\`\\n- \`slow == fast\` → cycle detected, return \`True\`\\n\\n**Complexity:** O(n) time, O(1) space\\n\\n**Classic problem:** LeetCode 141 — Linked List Cycle"
    },
    {
      "label": "Find Middle",
      "icon": "🎯",
      "content": "**Goal:** Find the middle node in a single pass.\\n\\n**Approach:** Start both pointers at \`head\`. Advance until \`fast.next\` (or \`fast.next.next\`) is \`null\`.\\n\\n- Slow lands at the midpoint automatically.\\n- For even-length lists, slow lands on the **first** of the two middle nodes.\\n\\n\`\`\`python\\ndef find_middle(head):\\n    slow = fast = head\\n    while fast.next and fast.next.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n    return slow\\n\`\`\`\\n\\n**Classic problem:** LeetCode 876 — Middle of the Linked List"
    },
    {
      "label": "Find Cycle Start",
      "icon": "📍",
      "content": "**Goal:** Where does the cycle begin?\\n\\n**Two-phase approach:**\\n\\n**Phase 1 — Detect:** Run Floyd's algorithm until slow and fast meet inside the cycle.\\n\\n**Phase 2 — Locate:** Reset \`slow = head\`. Advance both pointers 1 step at a time. Their next meeting point is the cycle entry node.\\n\\n**Why it works:** Let *m* = distance from head to cycle start, *k* = distance from cycle start to meeting point, *c* = cycle length. At the meeting point, slow traveled *m + k* steps. Moving slow back to head and advancing both at 1× causes them to meet after exactly *m* more steps — at the cycle entry.\\n\\n**Classic problem:** LeetCode 142 — Linked List Cycle II"
    },
    {
      "label": "Happy Number",
      "icon": "😊",
      "content": "**Goal:** Is *n* a happy number? (Repeatedly replace *n* with the sum of squares of its digits. If you reach 1 it is happy; otherwise it cycles forever.)\\n\\n**Key insight:** The digit-square-sum function is a deterministic 'next pointer'. Any non-happy number eventually enters a cycle — detectable with fast & slow pointers.\\n\\n\`\`\`python\\ndef is_happy(n):\\n    def next_val(x):\\n        return sum(int(d)**2 for d in str(x))\\n    slow, fast = n, next_val(n)\\n    while fast != 1 and slow != fast:\\n        slow = next_val(slow)\\n        fast = next_val(next_val(fast))\\n    return fast == 1\\n\`\`\`\\n\\n**Classic problem:** LeetCode 202 — Happy Number"
    }
  ]
}
\`\`\`

### Algorithm Walkthrough

\`\`\`steps
{
  "title": "Floyd's Cycle Detection — Step by Step",
  "steps": [
    {
      "title": "Initialize both pointers",
      "content": "Set \`slow = head\` and \`fast = head\` (or \`fast = head.next\`). Both initializations are correct — they differ only in whether the \`slow != fast\` guard is checked before or inside the loop body."
    },
    {
      "title": "Advance at different speeds",
      "content": "Each iteration:\\n- \`slow = slow.next\`  (1 step)\\n- \`fast = fast.next.next\`  (2 steps)\\n\\nAlways null-check before dereferencing: \`if not fast or not fast.next: return False\`."
    },
    {
      "title": "Check the termination condition",
      "content": "Two possible exits:\\n\\n**Cycle found:** \`slow == fast\` — the pointers have met somewhere inside the loop.\\n\\n**No cycle:** \`fast\` or \`fast.next\` is \`null\` — the fast pointer reached the end of the list."
    },
    {
      "title": "(Optional) Locate the cycle entry",
      "content": "Reset \`slow = head\`. Keep \`fast\` at the meeting point. Advance both one step at a time. The node where they next meet is the **cycle start** — the first node belonging to the loop."
    }
  ]
}
\`\`\`

### Naive vs. Fast & Slow

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Hash Set Approach — O(n) Space",
    "code": "def has_cycle(head):\\n    visited = set()\\n    node = head\\n    while node:\\n        if node in visited:\\n            return True  # cycle!\\n        visited.add(node)\\n        node = node.next\\n    return False\\n\\n# Correct, but allocates O(n) memory\\n# for every node reference seen."
  },
  "after": {
    "label": "Fast & Slow Pointers — O(1) Space",
    "code": "def has_cycle(head):\\n    if not head or not head.next:\\n        return False\\n    slow = head\\n    fast = head.next\\n    while slow != fast:\\n        if not fast or not fast.next:\\n            return False\\n        slow = slow.next\\n        fast = fast.next.next\\n    return True\\n\\n# Same O(n) time, but only two\\n# pointer variables — truly O(1) space."
  }
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Interview Tip: Recognizing the Pattern",
  "content": "Reach for fast & slow pointers when you see: a linked list problem asking about cycles or midpoints, a sequence with a deterministic 'next' function (happy number, duplicate finder), or any problem where O(1) space is a constraint and a naive hash-set solution is obvious but disallowed."
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Why is a meeting between slow and fast pointers guaranteed when a cycle exists?",
      "options": [
        "The fast pointer resets to head once it enters the cycle",
        "The relative closing speed between the two pointers inside the cycle is exactly 1 step per iteration, so the gap must eventually reach zero",
        "The slow pointer pauses when it enters the cycle, giving the fast pointer time to catch up",
        "The fast pointer always catches the slow pointer in exactly n/2 steps regardless of cycle length"
      ],
      "answer": 1,
      "explanation": "Inside a cycle of length k, the fast pointer gains exactly 1 step on the slow pointer per iteration. The gap decreases by 1 every round and wraps around the cycle, so it must eventually equal zero — the pointers meet. This is guaranteed in at most k iterations after both enter the cycle."
    },
    {
      "question": "After detecting the meeting point inside a cycle, you reset slow to head and advance both pointers 1 step at a time. Where do they next meet?",
      "options": [
        "At the original meeting node inside the cycle",
        "At the node exactly halfway between head and the meeting point",
        "At the cycle entry node — the first node that is part of the loop",
        "At the tail of the list"
      ],
      "answer": 2,
      "explanation": "Let m = distance from head to cycle start, k = distance from cycle start to meeting point, c = cycle length. The slow pointer traveled m + k steps total. Resetting slow to head and advancing both 1 step at a time means slow covers m more steps to reach the cycle start. Since (m + k) is a multiple of c relative to the fast pointer's position, fast also arrives at the cycle entry after m steps — they meet there."
    },
    {
      "question": "A linked list has 9 nodes (indices 0–8, no cycle). Where does the slow pointer land when the fast pointer reaches the end?",
      "options": [
        "Index 3",
        "Index 4",
        "Index 5",
        "Index 6"
      ],
      "answer": 1,
      "explanation": "With 9 nodes (odd length), the exact middle is index 4. When fast is at index 8 (last node, fast.next is null), slow has advanced 4 steps and sits at index 4 — the single middle node. For even-length lists, slow would land on the first of the two middle nodes."
    },
    {
      "question": "Which problem is NOT naturally solved by the fast & slow pointer pattern?",
      "options": [
        "Detecting a cycle in a linked list (LeetCode 141)",
        "Finding the kth node from the end of a linked list",
        "Determining whether a number is a happy number (LeetCode 202)",
        "Finding where a cycle begins (LeetCode 142)"
      ],
      "answer": 1,
      "explanation": "Finding the kth node from the end uses two pointers separated by k steps that both advance at the same speed (1×). That is the 'offset two-pointer' or 'sliding window on a linked list' pattern — not fast & slow. The other three are canonical Floyd's algorithm problems where the 2× speed differential is the key insight."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Fast & slow pointers (Floyd's algorithm) detect cycles in O(n) time and O(1) space — no auxiliary hash sets needed.",
    "Meeting is guaranteed in a cycle because the relative closing speed is exactly 1 step per iteration inside any loop.",
    "To find the cycle entry: detect the meeting point, reset one pointer to head, advance both at 1 step — they converge at the loop's first node.",
    "For middle-finding, the slow pointer naturally lands at n/2 when fast reaches the end — no pre-counting or length calculation required.",
    "The pattern generalizes beyond linked lists: any deterministic 'next' function (digit-square sums, array index jumps) can be analyzed with fast & slow pointers."
  ]
}
\`\`\``,
    },
    {
      id: "linked-list-cycle",
      slug: "linked-list-cycle",
      title: "Linked List Cycle Detection",
      content: `## Linked List Cycle Detection

\`\`\`concept
{ "title": "Floyd's Tortoise and Hare", "variant": "analogy", "content": "Picture two runners on a circular track — one fast, one slow. If the track loops back on itself, the fast runner will eventually lap the slow one and they'll collide at the same point. If the track is a straight road with a dead end, the fast runner falls off the edge (hits null) first. This is exactly how Floyd's Cycle Detection works on a linked list." }
\`\`\`

### Problem Statement

Given the head of a linked list, return \`true\` if the list contains a **cycle** — meaning some node's \`next\` pointer points back to an earlier node, trapping a traversal in an infinite loop — or \`false\` if the list ends cleanly at \`null\`.

\`\`\`tabs
{ "tabs": [ { "label": "Cycle — Example 1", "icon": "🔄", "content": "**Input:** \`[3 → 2 → 0 → -4]\`, tail points back to index 1\\n\\n\`\`\`\\n3 → 2 → 0 → -4\\n    ↑___________|\\n\`\`\`\\n\\n**Output:** \`true\`" }, { "label": "Cycle — Example 2", "icon": "🔄", "content": "**Input:** \`[1 → 2]\`, tail points back to index 0\\n\\n\`\`\`\\n1 → 2\\n↑___|\\n\`\`\`\\n\\n**Output:** \`true\`" }, { "label": "No Cycle", "icon": "➡️", "content": "**Input:** \`[1]\`, no backward connection (\`pos = -1\`)\\n\\n\`\`\`\\n1 → null\\n\`\`\`\\n\\n**Output:** \`false\`" } ] }
\`\`\`

### The Fast & Slow Pointer Strategy

\`\`\`steps
{ "title": "Floyd's Algorithm — Four Steps", "steps": [ { "title": "Initialize both pointers at the head", "content": "Set \`slow = head\` and \`fast = head\`. Both start at the same node before any movement." }, { "title": "Advance at different speeds each iteration", "content": "- **Slow** moves **1 step**: \`slow = slow.next\`\\n- **Fast** moves **2 steps**: \`fast = fast.next.next\`\\n\\nFast gains exactly 1 node per iteration relative to slow." }, { "title": "Check for a meeting point", "content": "After each move, test \`slow == fast\`. If they point to the same node, a cycle exists — **return \`true\`**." }, { "title": "Check for the end of the list", "content": "Before each move, test \`fast != null\` and \`fast.next != null\`. If either is null, fast has reached the end of a cycle-free list — **return \`false\`**." } ] }
\`\`\`

### Watching the Algorithm Run

The list below is \`[3 → 2 → 0 → -4]\` where \`-4.next\` points back to the node at index 1 (value \`2\`). Watch the slow and fast indices converge:

\`\`\`algoviz
{ "title": "Floyd's Detection on [3, 2, 0, -4] with -4 → index 1 cycle", "type": "array", "data": [3, 2, 0, -4], "frames": [ { "highlight": [0, 0], "label": "Init: slow=index 0 (val 3), fast=index 0 (val 3)", "stats": { "slow": 0, "fast": 0, "met": "no" } }, { "highlight": [1, 2], "label": "Move 1 — slow→index 1 (val 2), fast→index 2 (val 0)", "stats": { "slow": 1, "fast": 2, "met": "no" } }, { "highlight": [2, 1], "label": "Move 2 — slow→index 2 (val 0), fast: -4.next=2, so fast→index 1 (val 2)", "stats": { "slow": 2, "fast": 1, "met": "no" } }, { "highlight": [3, 3], "label": "Move 3 — slow→index 3 (val -4), fast: 2.next=0, 0.next=-4, so fast→index 3. slow == fast → CYCLE!", "stats": { "slow": 3, "fast": 3, "met": "YES ✓" } } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why Do They Always Meet Inside the Cycle?", "content": "Once fast enters the cycle, the gap between fast and slow grows by exactly 1 node per iteration (fast is 2 steps ahead, slow is 1 step ahead, net gain = 1). The gap grows modulo the cycle length L. When the gap mod L reaches 0, the pointers are on the same node. This is guaranteed as long as a cycle exists — they cannot miss each other." }
\`\`\`

### Code Trace

\`\`\`trace
{ "title": "Tracing hasCycle — [3 → 2 → 0 → -4 → ↑2]", "language": "python", "code": "def hasCycle(head):\\n    slow = head\\n    fast = head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow == fast:\\n            return True\\n    return False", "frames": [ { "line": 2, "vars": { "slow": "3", "fast": "unset" }, "note": "slow initialized to head (val 3)" }, { "line": 3, "vars": { "slow": "3", "fast": "3" }, "note": "fast initialized to head (val 3)" }, { "line": 4, "vars": { "slow": "3", "fast": "3" }, "note": "fast=3 (not null), fast.next=2 (not null) — enter loop" }, { "line": 5, "vars": { "slow": "2", "fast": "3" }, "note": "slow advances 1 step: 3→2" }, { "line": 6, "vars": { "slow": "2", "fast": "0" }, "note": "fast advances 2 steps: 3→2→0" }, { "line": 7, "vars": { "slow": "2", "fast": "0" }, "note": "slow(2) != fast(0) — no meet yet" }, { "line": 5, "vars": { "slow": "0", "fast": "0" }, "note": "slow advances 1 step: 2→0" }, { "line": 6, "vars": { "slow": "0", "fast": "2" }, "note": "fast advances 2 steps: 0→-4→2 (cycle!)" }, { "line": 7, "vars": { "slow": "0", "fast": "2" }, "note": "slow(0) != fast(2) — continue" }, { "line": 5, "vars": { "slow": "-4", "fast": "2" }, "note": "slow advances 1 step: 0→-4" }, { "line": 6, "vars": { "slow": "-4", "fast": "-4" }, "note": "fast advances 2 steps: 2→0→-4" }, { "line": 7, "vars": { "slow": "-4", "fast": "-4" }, "note": "slow == fast! Pointers collide inside cycle." }, { "line": 8, "vars": {}, "note": "Return true — cycle confirmed.", "stdout": "True" } ], "speed": 800 }
\`\`\`

### Complexity Analysis

\`\`\`callout
{ "type": "success", "title": "Time & Space Complexity", "content": "**Time: O(n)** — In the worst case, the fast pointer traverses the list at most twice and the slow pointer once before they meet (or fast hits null). Each node is visited a constant number of times.\\n\\n**Space: O(1)** — Exactly two pointer variables regardless of list size. No auxiliary data structures are allocated." }
\`\`\`

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Hash Set — O(n) Space", "code": "def hasCycle(head):\\n    seen = set()\\n    while head:\\n        if id(head) in seen:\\n            return True\\n        seen.add(id(head))\\n        head = head.next\\n    return False" }, "after": { "label": "Floyd's — O(1) Space", "code": "def hasCycle(head):\\n    slow = head\\n    fast = head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow == fast:\\n            return True\\n    return False" } }
\`\`\`

The hash-set approach allocates memory for every node visited. Floyd's algorithm solves the identical problem with **zero extra memory** — a significant win on long lists.

### Knowledge Check

\`\`\`quiz
{ "title": "Floyd's Cycle Detection — Check Your Understanding", "questions": [ { "question": "What does it mean when fast reaches null during Floyd's algorithm?", "options": [ "A cycle was detected and fast exited it", "The list has no cycle — fast reached the dead end", "The slow pointer is ahead of fast", "Both pointers are stuck in a loop" ], "answer": 1, "explanation": "If fast or fast.next becomes null, the list terminates cleanly. A cycle-free list has a finite end that the faster pointer will always reach before slow does — so no cycle exists." }, { "question": "Why does the gap between slow and fast increase by exactly 1 per iteration inside a cycle?", "options": [ "Fast moves 3 steps so the gap is always larger than 1", "Fast moves 2 steps and slow moves 1 step, so fast gains 1 node per iteration relative to slow", "Slow moves backwards by 1 step each time", "The pointers start at opposite ends of the cycle" ], "answer": 1, "explanation": "Each iteration: fast advances 2, slow advances 1. Net relative gain = 2 - 1 = 1 node. Inside a cycle of length L, the gap grows modulo L and eventually hits 0 — the meeting point." }, { "question": "What is the space complexity of Floyd's Cycle Detection?", "options": [ "O(n) — one entry per visited node", "O(log n) — proportional to pointer arithmetic", "O(1) — only two pointer variables, independent of list size", "O(n²) — nested traversal of all pairs" ], "answer": 2, "explanation": "Only two pointer variables (slow and fast) are used regardless of list length. This is constant space — O(1). Compare this to the hash-set approach which allocates O(n) space to track visited nodes." }, { "question": "For the list [A → B → C → D → B] (D.next = B), after exactly 2 complete iterations, where are slow and fast?", "options": [ "slow=A, fast=A (they haven't moved yet)", "slow=B, fast=C", "slow=C, fast=C", "slow=C, fast=B" ], "answer": 2, "explanation": "Start: slow=A, fast=A. Iteration 1: slow→B, fast→C. Iteration 2: slow→C, fast: D.next=B, B.next=C → fast→C. They meet at C after just 2 iterations!" } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Floyd's algorithm uses two pointers at a 2× speed difference. Inside any cycle, the fast pointer will always catch the slow pointer — the meeting is mathematically guaranteed.", "Termination condition: if fast == null or fast.next == null before they meet, the list has no cycle.", "Time complexity is O(n) — each node is visited a constant number of times. Space is O(1) — only two pointers.", "The hash-set alternative is O(n) space; Floyd's achieves identical results in O(1) space — always prefer it in constrained environments.", "The fast & slow pointer pattern generalizes far beyond cycle detection: finding the list midpoint, locating the cycle entry node, and solving the Happy Number problem all use the same core idea." ] }
\`\`\``,
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

Given a linked list with a cycle, detecting *whether* a cycle exists is only half the problem. The harder question — and the one interviewers really want — is: **where does the cycle begin?** Floyd's algorithm answers this in two phases without any extra memory.

\`\`\`concept
{ "title": "Two-Phase Floyd's Algorithm", "variant": "mental-model", "content": "Phase 1 — Move slow (1 step) and fast (2 steps) per iteration until they meet inside the cycle. This confirms a cycle exists.\\n\\nPhase 2 — Reset slow to the head. Move both pointers one step at a time. The node where they meet next is exactly the cycle start.\\n\\nThe math guarantees this: the distance from head → cycle start equals the distance from the meeting point → cycle start (measured forward around the cycle)." }
\`\`\`

### The Math Behind Phase 2

Define three distances along the list:

| Variable | Meaning |
|---|---|
| **F** | Nodes from \`head\` to cycle start |
| **S** | Nodes from cycle start to the meeting point |
| **C** | Length of the cycle |

When slow and fast meet in Phase 1, fast has traveled exactly twice as far as slow — but also completed extra full laps of the cycle:

\`\`\`
Distance: fast = 2 × slow
             F + S + nC = 2(F + S)
                    nC  = F + S
                     F  = nC − S
\`\`\`

This means *distance from head to cycle start* equals *distance from meeting point forward to cycle start* (wrapping around). Reset slow to head, keep fast at the meeting point, advance both one step at a time — they arrive at the cycle start simultaneously.

\`\`\`steps
{ "title": "Algorithm Walkthrough", "steps": [ { "title": "Phase 1 — Detect the Cycle", "content": "Set \`slow = head\` and \`fast = head\`. Each iteration: \`slow = slow.next\`, \`fast = fast.next.next\`. If \`slow == fast\`, break — a cycle exists. If \`fast\` reaches \`None\`, return \`None\` (no cycle)." }, { "title": "Phase 2 — Navigate to the Start", "content": "Reset \`slow = head\`. Keep \`fast\` at the meeting point from Phase 1. Advance **both pointers one step at a time**. The node where \`slow == fast\` is the cycle start — return it." }, { "title": "Why It Terminates in Exactly F Steps", "content": "After the reset, slow is F steps from the cycle start (going forward from head). By the equation F = nC − S, fast is also F steps from the cycle start (going forward around the cycle). Both converge in exactly F iterations." } ] }
\`\`\`

### Visualizing the Algorithm

The list \`[3 → 2 → 0 → −4 → (back to index 1)]\` has its tail connecting to the node with value \`2\`.

\`\`\`algoviz
{ "title": "Trace on [3, 2, 0, -4] — cycle tail connects back to index 1", "type": "array", "data": [3, 2, 0, -4], "frames": [ { "highlight": [0], "label": "Phase 1 start: both slow and fast at head (index 0)", "stats": { "slow": 0, "fast": 0, "phase": 1 } }, { "highlight": [1, 2], "label": "Iter 1: slow → 1 (val 2), fast → 2 (val 0)", "stats": { "slow": 1, "fast": 2, "phase": 1 } }, { "highlight": [2, 1], "label": "Iter 2: slow → 2 (val 0), fast wraps: 2 → 3 → 1 (val 2)", "stats": { "slow": 2, "fast": 1, "phase": 1 } }, { "highlight": [3], "label": "Iter 3: slow → 3 (val -4), fast: 1 → 2 → 3 (val -4) — MEET! Cycle detected.", "stats": { "slow": 3, "fast": 3, "phase": 1 } }, { "highlight": [0, 3], "label": "Phase 2: reset slow to head (0), fast stays at meeting point (3)", "stats": { "slow": 0, "fast": 3, "phase": 2 } }, { "highlight": [1], "label": "Step 1: slow → 1 (val 2), fast: 3 → 1 (val 2) — MEET! Cycle start at index 1.", "stats": { "slow": 1, "fast": 1, "phase": 2, "cycleStart": 1 } } ], "speed": 900 }
\`\`\`

### Implementation

\`\`\`playground
{ "title": "Find Cycle Start — Python", "language": "python", "code": "class ListNode:\\n    def __init__(self, val=0, next=None):\\n        self.val = val\\n        self.next = next\\n\\ndef detectCycle(head):\\n    slow = fast = head\\n\\n    # Phase 1: detect cycle\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow == fast:\\n            break\\n    else:\\n        return None  # no cycle (loop exited normally)\\n\\n    # Phase 2: find cycle start\\n    slow = head\\n    while slow != fast:\\n        slow = slow.next\\n        fast = fast.next\\n    return slow\\n\\n# Build: 3 -> 2 -> 0 -> -4 -> (back to node val=2)\\nn3   = ListNode(3)\\nn2   = ListNode(2)\\nn0   = ListNode(0)\\nneg4 = ListNode(-4)\\nn3.next = n2\\nn2.next = n0\\nn0.next = neg4\\nneg4.next = n2  # cycle connects tail back to index 1\\n\\nresult = detectCycle(n3)\\nprint('Cycle start value:', result.val)  # Expected: 2", "runnable": true }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Java Implementation", "content": "\`\`\`java\\npublic ListNode detectCycle(ListNode head) {\\n    ListNode slow = head, fast = head;\\n\\n    // Phase 1: detect cycle\\n    while (fast != null && fast.next != null) {\\n        slow = slow.next;\\n        fast = fast.next.next;\\n        if (slow == fast) break;\\n    }\\n    // Exited without meeting — no cycle\\n    if (fast == null || fast.next == null) return null;\\n\\n    // Phase 2: find cycle start\\n    slow = head;\\n    while (slow != fast) {\\n        slow = slow.next;\\n        fast = fast.next;  // one step only\\n    }\\n    return slow;\\n}\\n\`\`\`\\n\\n**Critical null-check:** After the while loop, you must verify \`fast == null || fast.next == null\` to distinguish 'no cycle' (loop ran to end) from 'cycle detected' (loop broke on \`slow == fast\`). Skipping this check causes a NullPointerException on acyclic lists." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Most Common Bug: Fast Still Moves Two Steps in Phase 2", "content": "In Phase 2, **both pointers must move exactly one step per iteration**. A frequent mistake is leaving fast at two-step speed — this breaks the mathematical guarantee and lands on the wrong node. When in doubt: Phase 2 = equal speed." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "After Phase 1 ends, where is the fast pointer?", "options": ["Reset back to the head of the list", "Sitting at the node just before the cycle start", "Sitting at the meeting point somewhere inside the cycle", "At the tail node of the list"], "answer": 2, "explanation": "Fast stops at the same node as slow — wherever they collided inside the cycle. Only slow is reset to the head at the start of Phase 2. Fast stays at the meeting point." }, { "question": "For the list [3, 2, 0, -4] with the tail connecting back to index 1, at which index do slow and fast first meet during Phase 1?", "options": ["Index 0 (value 3)", "Index 1 (value 2)", "Index 2 (value 0)", "Index 3 (value -4)"], "answer": 3, "explanation": "Tracing the iterations: after 3 steps, slow reaches index 3 and fast also arrives at index 3 (traveling 1→2→3). The meeting point is the node with value -4 at index 3 — not the cycle start." }, { "question": "Why does resetting slow to head (while fast remains at the meeting point) guarantee they meet exactly at the cycle start?", "options": ["Because the cycle start is always the midpoint of the list", "Because F = nC − S, so both pointers travel the same remaining distance to the cycle start", "Because fast already passed through the cycle start during Phase 1 and remembers it", "Because slow is faster than fast in Phase 2"], "answer": 1, "explanation": "The derivation shows F = nC − S. Slow needs F steps to walk from head to cycle start. Fast, starting at the meeting point S steps past the cycle start, needs nC − S = F steps going forward to lap back to cycle start. They take the same number of steps, so they arrive together." }, { "question": "What is the time and space complexity of this two-phase algorithm?", "options": ["O(n) time, O(n) space — requires storing visited nodes", "O(n log n) time, O(1) space — due to pointer comparisons", "O(n) time, O(1) space — only two pointers used throughout", "O(n²) time, O(1) space — nested traversal"], "answer": 2, "explanation": "Phase 1 runs at most O(n) iterations (fast either exits or meets slow within one full cycle traversal). Phase 2 runs at most O(n) more steps. Only slow and fast pointers are maintained — constant O(1) space regardless of list size." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Floyd's cycle-start algorithm runs in two phases: Phase 1 detects the cycle with fast/slow pointers; Phase 2 finds the exact start by resetting slow to head and advancing both at equal speed.", "The math F = nC − S guarantees convergence at the cycle start — slow walks F steps from head, fast walks the equivalent distance forward around the cycle.", "In Phase 2, both pointers must move exactly one step per iteration. Keeping fast at two steps is the single most common implementation bug.", "Time complexity is O(n), space complexity is O(1) — no hash sets, no visited arrays, no extra memory needed.", "Interviewers expect the proof, not just the recipe. Being able to derive F = nC − S on a whiteboard is what separates strong candidates." ] }
\`\`\``,
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

\`\`\`concept
{ "title": "The Tortoise & Hare Insight", "variant": "mental-model", "content": "If two runners start at the same point and one runs at double speed, when the fast runner finishes the track the slow runner is exactly halfway. Fast/slow pointers exploit this ratio: fast moves 2 steps per iteration, slow moves 1. When fast hits the end, slow is at the middle — in a single O(n) pass with O(1) space." }
\`\`\`

### Problem Statement

Given the head of a singly linked list, return the **middle node**. If there are two middle nodes (even-length list), return the **second** middle node.

| Input | Output | Why |
|-------|--------|-----|
| \`[1, 2, 3, 4, 5]\` | Node \`3\` | One true middle (index 2) |
| \`[1, 2, 3, 4, 5, 6]\` | Node \`4\` | Two middles — return the second |

### Visualizing the Algorithm

Watch \`slow\` and \`fast\` traverse \`[1 → 2 → 3 → 4 → 5]\` together:

\`\`\`algoviz
{ "title": "Middle of Linked List — [1, 2, 3, 4, 5]", "type": "linkedlist", "data": [1, 2, 3, 4, 5], "frames": [ { "highlight": [0, 0], "label": "Initial: both pointers at head (node 1)", "stats": { "slow": 1, "fast": 1 } }, { "highlight": [1, 2], "label": "Step 1: slow → node 2, fast → node 3", "stats": { "slow": 2, "fast": 3 } }, { "highlight": [2, 4], "label": "Step 2: slow → node 3, fast → node 5", "stats": { "slow": 3, "fast": 5 } }, { "highlight": [2], "label": "fast.next is null — loop exits. slow = node 3 is the middle!", "stats": { "slow": 3, "fast": "null" } } ], "speed": 900 }
\`\`\`

### The Algorithm Step by Step

\`\`\`steps
{ "title": "Implementing Fast & Slow Pointers", "steps": [ { "title": "Initialize both pointers at head", "content": "\`\`\`python\\nslow = head\\nfast = head\\n\`\`\`\\nBoth pointers begin at the first node. No special offset needed." }, { "title": "Advance while fast can move two steps", "content": "\`\`\`python\\nwhile fast and fast.next:\\n    slow = slow.next\\n    fast = fast.next.next\\n\`\`\`\\nThe condition guards two failure cases: \`fast == None\` (even list, fast went past tail) and \`fast.next == None\` (odd list, fast is at tail). Either way, fast cannot safely jump two more steps." }, { "title": "Return slow — it is at the middle", "content": "\`\`\`python\\nreturn slow\\n\`\`\`\\nWhen the loop ends, fast has covered approximately twice the distance slow has. So slow sits at position n/2 — the middle.\\n\\nFor **even-length** lists, fast lands on \`None\` and slow is already at the second middle node — exactly what LeetCode #876 requires." } ] }
\`\`\`

### Odd vs Even Length — How the Stopping Point Differs

\`\`\`tabs
{ "tabs": [ { "label": "Odd Length [1,2,3,4,5]", "icon": "🔢", "content": "**5 nodes → one true middle (node 3)**\\n\\n| Iteration | slow | fast | Loop condition |\\n|-----------|------|------|----------------|\\n| start | 1 | 1 | — |\\n| 1 | 2 | 3 | fast=3 ✓, fast.next=4 ✓ |\\n| 2 | 3 | 5 | fast=5 ✓, fast.next=**None** ✗ |\\n\\nLoop exits after step 2. **Return slow = node 3.** ✓" }, { "label": "Even Length [1,2,3,4,5,6]", "icon": "🔢", "content": "**6 nodes → two middles (nodes 3 and 4) — return node 4**\\n\\n| Iteration | slow | fast | Loop condition |\\n|-----------|------|------|----------------|\\n| start | 1 | 1 | — |\\n| 1 | 2 | 3 | fast=3 ✓, fast.next=4 ✓ |\\n| 2 | 3 | 5 | fast=5 ✓, fast.next=6 ✓ |\\n| 3 | 4 | **None** | fast=**None** ✗ |\\n\\nLoop exits after step 3. **Return slow = node 4 (second middle).** ✓" } ] }
\`\`\`

<!-- voice:key_insight insight="When fast reaches the end, slow has traveled half the distance" -->

\`\`\`callout
{ "type": "tip", "title": "Why \`fast and fast.next\` — not just \`fast\`?", "content": "Inside the loop body you call \`fast.next.next\`. If \`fast.next\` were \`None\`, that access would throw an \`AttributeError\` (Python) or \`NullPointerException\` (Java). The guard \`fast.next != None\` ensures fast can always safely hop two steps before doing so." }
\`\`\`

### Step-by-Step Code Trace

\`\`\`trace
{ "title": "Tracing middleNode on [1, 2, 3, 4, 5]", "language": "python", "code": "def middleNode(head):\\n    slow = head          # line 2\\n    fast = head          # line 3\\n    while fast and fast.next:  # line 4\\n        slow = slow.next       # line 5\\n        fast = fast.next.next  # line 6\\n    return slow          # line 7", "frames": [ { "line": 2, "vars": { "slow": "Node(1)", "fast": "unset" }, "note": "slow initialized to head" }, { "line": 3, "vars": { "slow": "Node(1)", "fast": "Node(1)" }, "note": "fast also initialized to head" }, { "line": 4, "vars": { "slow": "Node(1)", "fast": "Node(1)" }, "note": "fast=Node(1) ✓, fast.next=Node(2) ✓ → enter loop" }, { "line": 5, "vars": { "slow": "Node(2)", "fast": "Node(1)" }, "note": "slow hops one step forward" }, { "line": 6, "vars": { "slow": "Node(2)", "fast": "Node(3)" }, "note": "fast hops two steps forward" }, { "line": 4, "vars": { "slow": "Node(2)", "fast": "Node(3)" }, "note": "fast=Node(3) ✓, fast.next=Node(4) ✓ → loop again" }, { "line": 5, "vars": { "slow": "Node(3)", "fast": "Node(3)" }, "note": "slow advances to Node(3)" }, { "line": 6, "vars": { "slow": "Node(3)", "fast": "Node(5)" }, "note": "fast jumps over Node(4) to Node(5)" }, { "line": 4, "vars": { "slow": "Node(3)", "fast": "Node(5)" }, "note": "fast=Node(5) ✓, fast.next=None ✗ → EXIT loop" }, { "line": 7, "vars": { "slow": "Node(3)", "fast": "Node(5)" }, "note": "Return slow = Node(3) — the middle ✓" } ], "speed": 900 }
\`\`\`

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(n) | Single traversal — fast covers at most n nodes total |
| **Space** | O(1) | Two pointer variables only, regardless of list length |

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "For the linked list [1, 2, 3, 4, 5, 6, 7] (7 nodes), which node does middleNode() return?", "options": ["Node 3", "Node 4", "Node 5", "Node 6"], "answer": 1, "explanation": "7 nodes, odd length. Trace: (slow=1,fast=1) → (slow=2,fast=3) → (slow=3,fast=5) → (slow=4,fast=7). Now fast=7 and fast.next=None, so the loop exits. Return slow = Node 4." }, { "question": "What is the effect of initializing fast = head.next instead of fast = head?", "options": ["No difference — both produce the same result for all inputs", "For odd-length lists it skips to the node after the middle", "For even-length lists it returns the first middle node instead of the second", "The loop condition must also change or it causes an infinite loop"], "answer": 2, "explanation": "Starting fast one step ahead shifts where the pointers meet. For even-length [1,2,3,4]: slow=1,fast=2 → slow=2,fast=4 → fast.next=None, stop. Returns Node 2 (first middle) instead of Node 3 (second middle). Odd-length behavior is unchanged in this case." }, { "question": "Why must the loop condition check BOTH \`fast != None\` AND \`fast.next != None\`?", "options": ["Because slow can also reach None for short lists", "Because fast.next.next inside the loop would crash if fast.next is None", "Because Python requires both checks for boolean short-circuit evaluation", "To handle the special case of a single-node list only"], "answer": 1, "explanation": "Inside the loop body you execute \`fast = fast.next.next\`. If \`fast.next\` is None, then \`fast.next.next\` raises an AttributeError. The \`fast.next != None\` guard ensures fast can always safely jump two steps before doing so." }, { "question": "Beyond finding the middle, which of these problems directly uses the same fast/slow pointer technique?", "options": ["Sorting a linked list by node values", "Finding the maximum value in a linked list", "Checking whether a linked list is a palindrome", "Counting the total number of nodes"], "answer": 2, "explanation": "Palindrome checking uses fast/slow pointers to find the middle, then reverses the second half and compares. Cycle detection is another direct application. Sorting and max-finding require different approaches (merge sort, linear scan respectively)." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Fast/slow pointers find the list middle in O(n) time and O(1) space — no need to count nodes first.", "The loop condition \`while fast and fast.next\` prevents null-dereference when fast approaches the tail.", "For even-length lists this implementation returns the second middle node — the behavior required by LeetCode #876.", "The same 2:1 speed ratio underpins cycle detection, palindrome checking, and k-th-from-end removal problems." ] }
\`\`\``,
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

What looks like a quirky number theory puzzle is actually **cycle detection in disguise**. The moment you see that, everything else follows naturally.

\`\`\`concept
{
  "title": "Numbers as an Implicit Linked List",
  "variant": "mental-model",
  "content": "Every number n maps to exactly one successor: the sum of the squares of its digits. This creates an implicit sequence. That sequence either terminates at 1 (happy) or loops back to a value seen before (not happy). You've just reframed the problem as 'detect a cycle in a sequence' — and Floyd's algorithm is the exact tool for that."
}
\`\`\`

### Problem Statement

Write an algorithm to determine if \`n\` is a **happy number**:

- Replace the number with the **sum of the squares of its digits**
- Repeat until it equals \`1\` (happy) or loops endlessly in a cycle (not happy)

**Happy — n = 19:**

| Step | Calculation | Result |
|------|-------------|--------|
| 1 | 1² + 9² | 82 |
| 2 | 8² + 2² | 68 |
| 3 | 6² + 8² | 100 |
| 4 | 1² + 0² + 0² | **1 ✓** |

**Unhappy — n = 2:**

\`2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 → ...\` *(cycle — never reaches 1)*

<!-- voice:key_insight insight="This is cycle detection on a sequence of numbers, not a linked list" -->

### Approach: Floyd's Algorithm on a Number Sequence

\`\`\`steps
{
  "title": "Applying Fast & Slow Pointers",
  "steps": [
    {
      "title": "Define the transformation",
      "content": "Write \`get_next(n)\` that sums the squares of each digit: extract digits with \`n % 10\`, accumulate \`digit²\`, then shrink n with \`n //= 10\`. This is our 'follow the pointer' operation — each number maps to exactly one successor, just like a node points to its next."
    },
    {
      "title": "Initialize two pointers",
      "content": "Set \`slow = n\` and \`fast = get_next(n)\`. Starting fast one step ahead is intentional — if both start equal, the loop condition \`slow != fast\` is immediately false and we'd return the wrong answer."
    },
    {
      "title": "Advance at different speeds",
      "content": "Each iteration: **slow** advances once via \`get_next(slow)\`, **fast** advances twice via \`get_next(get_next(fast))\`. The 2× speed difference guarantees that if a cycle exists, fast eventually laps slow and they meet."
    },
    {
      "title": "Check the meeting point",
      "content": "The loop exits when \`fast == 1\` (reached the happy terminus) or \`slow == fast\` (met inside a repeating cycle). Return \`fast == 1\` — True means happy, False means stuck in a cycle."
    }
  ]
}
\`\`\`

### Execution Trace: \`is_happy(19)\`

\`\`\`trace
{
  "title": "Fast & Slow Pointer Trace — is_happy(19)",
  "language": "python",
  "code": "def get_next(n):\\n    total = 0\\n    while n > 0:\\n        digit = n % 10\\n        total += digit * digit\\n        n //= 10\\n    return total\\n\\ndef is_happy(n):\\n    slow = n\\n    fast = get_next(n)\\n    while fast != 1 and slow != fast:\\n        slow = get_next(slow)\\n        fast = get_next(get_next(fast))\\n    return fast == 1",
  "frames": [
    { "line": 10, "vars": { "slow": 19, "fast": "—" },   "note": "slow = n = 19" },
    { "line": 11, "vars": { "slow": 19, "fast": 82 },    "note": "fast = get_next(19) = 1²+9² = 82" },
    { "line": 12, "vars": { "slow": 19, "fast": 82 },    "note": "82 ≠ 1 and 19 ≠ 82 → enter loop" },
    { "line": 13, "vars": { "slow": 82, "fast": 82 },    "note": "slow = get_next(19) = 82" },
    { "line": 14, "vars": { "slow": 82, "fast": 100 },   "note": "fast = get_next(get_next(82)) = get_next(68) = 100" },
    { "line": 12, "vars": { "slow": 82, "fast": 100 },   "note": "100 ≠ 1 and 82 ≠ 100 → continue" },
    { "line": 13, "vars": { "slow": 68, "fast": 100 },   "note": "slow = get_next(82) = 8²+2² = 68" },
    { "line": 14, "vars": { "slow": 68, "fast": 1 },     "note": "fast = get_next(get_next(100)) = get_next(1) = 1" },
    { "line": 12, "vars": { "slow": 68, "fast": 1 },     "note": "fast == 1 → exit loop" },
    { "line": 15, "vars": { "slow": 68, "fast": 1 },     "note": "return fast == 1 → True ✓ happy!" }
  ],
  "speed": 900
}
\`\`\`

### Fast & Slow vs. HashSet

The naive solution stores every seen number in a set. The fast & slow approach eliminates that entirely:

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "HashSet — O(n) space",
    "code": "def is_happy(n):\\n    seen = set()\\n    while n != 1:\\n        if n in seen:\\n            return False\\n        seen.add(n)\\n        n = get_next(n)\\n    return True"
  },
  "after": {
    "label": "Fast & Slow Pointers — O(1) space",
    "code": "def is_happy(n):\\n    slow = n\\n    fast = get_next(n)\\n    while fast != 1 and slow != fast:\\n        slow = get_next(slow)\\n        fast = get_next(get_next(fast))\\n    return fast == 1"
  }
}
\`\`\`

Both are correct. The pointer approach wins on space — no need to store every intermediate value.

\`\`\`callout
{
  "type": "tip",
  "title": "Lead with the cycle insight in interviews",
  "content": "Interviewers listen for the moment you say 'I noticed this is actually a cycle detection problem.' That one sentence signals pattern recognition and earns you partial credit even before you write a line of code. Don't skip straight to implementation."
}
\`\`\`

### Complexity

| | Complexity | Reason |
|--|-----------|--------|
| **Time** | O(log n) | Each digit-square step shrinks large numbers rapidly; the unhappy cycle is bounded in size |
| **Space** | O(1) | Two integer variables — no auxiliary data structures |

\`\`\`callout
{
  "type": "info",
  "title": "Why the unhappy cycle is bounded",
  "content": "For any 3-digit number (≤ 999), the maximum digit-square sum is 9²×3 = 243. So all sequences eventually stay below 243 — a tiny bounded space. Since there are finitely many values, a repeat (cycle) is inevitable. This is why the algorithm always terminates."
}
\`\`\`

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Why does the digit-square sequence always either reach 1 or cycle — it never grows forever?",
      "options": [
        "Floyd's algorithm forces it to terminate",
        "Large numbers quickly shrink: a 3-digit number's max digit-square sum is 243, so values stay bounded",
        "The sum of squares is always less than n for all n > 1",
        "Happy numbers are more common than unhappy ones"
      ],
      "answer": 1,
      "explanation": "For a 3-digit number at most (999), the max sum of squares is 9²×3 = 243. Values are bounded, so the sequence must eventually revisit a number — either 1 or a cycle member. This finiteness is what makes termination guaranteed."
    },
    {
      "question": "When does the while loop in the fast & slow solution exit?",
      "options": [
        "When slow reaches 1",
        "When fast reaches 1 OR slow equals fast",
        "Only when fast equals slow equals 1",
        "After exactly log(n) iterations"
      ],
      "answer": 1,
      "explanation": "The condition is \`while fast != 1 and slow != fast\`. It exits when either fast hits 1 (happy path) or slow catches up to fast in a cycle (unhappy path). Checking \`return fast == 1\` afterward distinguishes the two cases."
    },
    {
      "question": "Why does \`fast\` start at \`get_next(n)\` rather than \`n\`?",
      "options": [
        "To save one iteration of the loop",
        "To avoid the initial case where slow == fast immediately, which would falsely exit the loop",
        "Because fast must always be ahead of slow at all times",
        "To match the linked list cycle detection template exactly"
      ],
      "answer": 1,
      "explanation": "If both start at n, \`slow != fast\` is false from the first iteration — the loop never runs and we return \`fast == 1\` (i.e., \`n == 1\`), which is only correct when n=1. Offsetting fast by one step gives them different positions so they can meaningfully chase each other."
    },
    {
      "question": "For n = 2 (unhappy), the cycle is: 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4. Where will slow and fast actually meet?",
      "options": [
        "Always at the cycle entry point (4)",
        "Always at 89, the largest value in the cycle",
        "Somewhere inside the cycle — the exact meeting point depends on pointer positions, not necessarily the entry",
        "They never meet because the cycle is too long"
      ],
      "answer": 2,
      "explanation": "Floyd's algorithm guarantees the pointers meet inside the cycle, but not necessarily at the entry point. The exact meeting node depends on how many steps each pointer took to enter. What matters is that they do meet — confirming a cycle exists — so the function correctly returns False."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Happy Number is a cycle detection problem on an implicit sequence — get_next(n) is the 'next pointer', each number maps to exactly one successor.",
    "Apply Floyd's algorithm: slow advances once, fast advances twice; exit when fast==1 (happy) or slow==fast (cycle, not happy).",
    "Start fast at get_next(n), not n — otherwise slow==fast immediately and the loop never runs.",
    "O(log n) time because digit squaring rapidly shrinks large numbers; O(1) space because only two integers are used.",
    "In interviews, naming the cycle-detection pattern before coding is the move that signals mastery."
  ]
}
\`\`\``,
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

Great job completing the Fast & Slow Pointers module! Before moving on, let's lock in the key ideas and make sure the mental models are solid.

\`\`\`concept
{ "title": "The Core Insight: Speed Creates a Trap", "variant": "mental-model", "content": "Two pointers start at the same node. Slow moves 1 step per tick; fast moves 2. On a linear list, fast escapes to null. Inside a cycle, fast laps slow — they must collide. That collision is your signal." }
\`\`\`

### What You Covered

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Cycle Detection",
      "icon": "🔄",
      "content": "**Floyd's Algorithm** — slow moves 1 step, fast moves 2.\\n\\n- If \`fast\` reaches \`null\` → no cycle, O(n) time\\n- If \`slow == fast\` → cycle exists, O(1) space\\n\\nThe fast pointer catches up at the rate of **1 node per tick** inside the cycle, so they must meet within at most one full loop."
    },
    {
      "label": "Cycle Start",
      "icon": "📍",
      "content": "**Two-Phase Reset** — after slow and fast meet:\\n\\n1. Reset one pointer to **head**\\n2. Move **both at 1× speed**\\n3. Where they meet again = cycle start\\n\\n**Why it works:** If \`L\` = distance from head to cycle start and \`a\` = distance from cycle start to meeting point, the math gives \`L = nC − a\`, meaning both pointers cover the same distance to the cycle entry."
    },
    {
      "label": "Middle Element",
      "icon": "🎯",
      "content": "**Single-Pass Middle** — both start at head:\\n\\n\`\`\`python\\nwhile fast and fast.next:\\n    slow = slow.next\\n    fast = fast.next.next\\nreturn slow  # middle node\\n\`\`\`\\n\\nWhen fast hits the end, slow is exactly at the midpoint. For even-length lists, this returns the **second** middle node (LeetCode #876 behavior)."
    },
    {
      "label": "Happy Numbers",
      "icon": "😊",
      "content": "**Cycle Detection on Sequences** — the digit-square-sum sequence either:\\n\\n- Reaches \`1\` → happy number ✅\\n- Enters an infinite cycle → not happy ❌\\n\\nApply the same slow/fast pattern on the numerical sequence instead of pointer nodes. Same O(1) space, same collision logic."
    }
  ]
}
\`\`\`

### Visualizing the Meeting Point

\`\`\`algoviz
{
  "title": "Floyd's Algorithm — Slow & Fast Converge",
  "type": "linkedlist",
  "data": [3, 2, 0, -4],
  "frames": [
    { "highlight": [0, 0], "label": "Both pointers start at head (node 3)", "stats": { "slow": 0, "fast": 0 } },
    { "highlight": [1, 2], "label": "slow → node 2 (1 step), fast → node 0 (2 steps)", "stats": { "slow": 1, "fast": 2 } },
    { "highlight": [2, 1], "label": "slow → node 0 (1 step), fast wraps via -4 → node 2 (cycle!)", "stats": { "slow": 2, "fast": 1 } },
    { "highlight": [3, 3], "label": "slow → node -4, fast → node -4 — MEET! Cycle confirmed", "stats": { "slow": 3, "fast": 3 } },
    { "highlight": [0, 3], "label": "Phase 2: reset slow to head. Both advance 1 step at a time", "stats": { "slow": "head", "fast": "meeting point" } },
    { "highlight": [1, 1], "label": "Both arrive at node 2 — this is the cycle start!", "stats": { "slow": 1, "fast": 1 } }
  ],
  "speed": 900
}
\`\`\`

\`\`\`callout
{ "type": "info", "title": "The Math Behind Phase 2", "content": "Let **L** = distance from head to cycle start, **C** = cycle length, **a** = distance from cycle start to meeting point.\\n\\nWhen they meet: slow traveled \`L + a\`, fast traveled \`L + a + nC\`.\\n\\nSince fast moves 2× faster: \`2(L + a) = L + a + nC\` → **L = nC − a**.\\n\\nThis guarantees the pointer reset to head meets the other pointer exactly at the cycle start." }
\`\`\`

---

### Quiz

\`\`\`quiz
{
  "title": "Fast & Slow Pointers — Check Your Understanding",
  "questions": [
    {
      "question": "In Floyd's cycle detection, how many steps does the fast pointer advance per iteration?",
      "options": ["1 step", "2 steps", "3 steps", "Variable — depends on list size"],
      "answer": 1,
      "explanation": "The fast pointer moves 2 steps per iteration while slow moves 1. This fixed 2× speed difference guarantees they converge inside any cycle within at most C iterations (C = cycle length)."
    },
    {
      "question": "If slow and fast pointers meet in a linked list, what does that conclusively indicate?",
      "options": [
        "The list has an even number of nodes",
        "The list contains a cycle",
        "The list is sorted in ascending order",
        "The list length is a power of 2"
      ],
      "answer": 1,
      "explanation": "A meeting point can only occur if the fast pointer laps the slow pointer inside a loop. On a finite acyclic list, fast reaches null before catching slow."
    },
    {
      "question": "After slow and fast meet inside a cycle, how do you locate the cycle's start node?",
      "options": [
        "Reset both pointers to head and move both at 2× speed",
        "Reset one pointer to head and advance both at 1× speed until they meet",
        "Count nodes from the head to the meeting point",
        "Reverse the portion of the list inside the cycle"
      ],
      "answer": 1,
      "explanation": "Phase 2: reset one pointer to head, leave the other at the meeting point, then advance both 1 step at a time. They converge at the cycle start — this follows from the equation L = nC − a."
    },
    {
      "question": "For a linked list of length 6 (even), when slow and fast both start at head and you run the middle-finder loop, which node does slow point to when fast hits null?",
      "options": [
        "Node at index 2 (0-based) — the first middle",
        "Node at index 3 (0-based) — the second middle",
        "Node at index 1 (0-based)",
        "slow never stops — fast loops forever"
      ],
      "answer": 1,
      "explanation": "For an even-length list, the standard while (fast && fast.next) condition causes slow to land on the second of the two middle nodes (index n/2). LeetCode #876 expects this behavior."
    },
    {
      "question": "What are the time and space complexities of Floyd's cycle detection algorithm?",
      "options": [
        "O(n) time, O(n) space — stores visited nodes in a set",
        "O(n log n) time, O(1) space",
        "O(n) time, O(1) space — only two pointers used",
        "O(n²) time, O(1) space — nested pointer traversal"
      ],
      "answer": 2,
      "explanation": "Each node is visited at most twice → O(n) time. Only two pointer variables are maintained regardless of list size → O(1) space. This optimal profile is why Floyd's algorithm is a favourite in interviews."
    }
  ]
}
\`\`\`

---

### Voice Summary

<!-- voice:checkpoint_summary -->

Your coach will ask you to explain these in your own words:

1. **Why does the fast pointer always catch the slow pointer inside a cycle?** *(Think: relative speed, gap closing)*
2. **Walk through the phase-2 reset.** Why does resetting one pointer to head — and moving both at 1× — find the cycle start?
3. **Beyond linked lists** — what other problems benefit from the fast/slow pattern? *(Happy numbers, find-duplicate, palindrome linked list)*

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Fast (2×) and slow (1×) pointers collide inside any cycle — the speed gap closes at exactly 1 node per tick.",
    "Finding the cycle start is a two-phase operation: detect collision first, then reset one pointer to head and walk both at 1× speed.",
    "Middle-of-list runs in a single O(n) pass with O(1) space — when fast exits, slow is at the midpoint.",
    "The same cycle-detection logic applies to numerical sequences (happy numbers) and duplicate detection in arrays.",
    "Floyd's algorithm is interview gold: O(n) time, O(1) space, and the math behind phase 2 is a strong differentiator."
  ]
}
\`\`\`

**Excellent work — you've mastered one of the most elegant pointer techniques in algorithmic interviews.**`,
    },
  ],
};
