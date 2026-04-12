import { Module } from "../types";

export const kWayMergeModule: Module = {
  id: "k-way-merge",
  title: "K-Way Merge",
  description: "Master the K-Way Merge pattern for efficiently merging K sorted arrays or lists using heaps. Essential for problems involving multiple sorted data sources.",
  lessons: [
    {
      id: "k-way-merge-intro",
      slug: "k-way-merge-intro",
      title: "Introduction to K-Way Merge",
      content: `## The K-Way Merge Pattern

When you have K sorted arrays and need one sorted result, the instinct is to concatenate everything and sort — but there's a fundamentally smarter approach.

\`\`\`concept
{ "title": "K-Way Merge Mental Model", "variant": "mental-model", "content": "Think of K checkout lines, each already sorted by transaction amount. You want to process all transactions in order. Instead of shuffling everyone into one big line (expensive!), you post a spotter at each line's front. At each step, the spotter picks whichever front-of-line customer has the smallest amount — then waves up the next person in that same line. The min-heap is your spotter: it always knows the global minimum across all K lines in O(log k) time." }
\`\`\`

### Why Not Just Sort Everything?

| Approach | Time | Space | When it wins |
|----------|------|-------|--------------|
| Concatenate + sort | O(n log n) | O(n) | K is tiny (2–3 arrays) |
| K-Way Merge (heap) | O(n log k) | O(k) | K is large, data streams in |

The win is in the logarithm's base: \`log k\` instead of \`log n\`. When K=1,000 and n=1,000,000, that's \`log 1000 ≈ 10\` vs \`log 1,000,000 ≈ 20\` — every comparison becomes twice as cheap.

\`\`\`concept
{ "title": "The O(n log k) Guarantee", "variant": "rule", "content": "Each of the n total elements is pushed and popped from the heap exactly once. Each heap operation costs O(log k) because the heap holds at most k elements simultaneously. Total cost: n × O(log k) = O(n log k). Auxiliary space is O(k) — the heap never grows beyond one frontier element per array." }
\`\`\`

### Algorithm: Step by Step

\`\`\`steps
{ "title": "K-Way Merge Algorithm", "steps": [ { "title": "Seed the heap", "content": "Push the **first element** from each of the K arrays into a min-heap. Each entry stores \`(value, array_index, element_index)\` so you always know where an element came from." }, { "title": "Pop the global minimum", "content": "Extract the heap root — this is the smallest value across all K array fronts. Append it to the result list." }, { "title": "Advance that array's pointer", "content": "Using \`array_index\` and \`element_index\` from the popped tuple, push the **next element** from that same array into the heap (if one exists)." }, { "title": "Repeat until the heap is empty", "content": "The heap size stays ≤ K throughout. When it empties, every element has been visited exactly once and \`result\` is fully sorted." } ] }
\`\`\`

### Visualizing the Merge

Watch three sorted arrays \`[1,4,7]\`, \`[2,5,8]\`, \`[3,6,9]\` merge in real time:

\`\`\`algoviz
{ "title": "K-Way Merge on 3 Sorted Arrays", "type": "grid", "data": [[1,4,7],[2,5,8],[3,6,9]], "frames": [ { "highlight": [0,3,6], "label": "Seed heap with first element of each array → heap = [(1,arr0), (2,arr1), (3,arr2)]", "stats": { "heap": "[(1,0), (2,1), (3,2)]", "result": "[]" } }, { "highlight": [0], "label": "Pop min=1 from arr0. Push next element 4 from arr0.", "stats": { "heap": "[(2,1), (3,2), (4,0)]", "result": "[1]" } }, { "highlight": [3], "label": "Pop min=2 from arr1. Push next element 5 from arr1.", "stats": { "heap": "[(3,2), (4,0), (5,1)]", "result": "[1, 2]" } }, { "highlight": [6], "label": "Pop min=3 from arr2. Push next element 6 from arr2.", "stats": { "heap": "[(4,0), (5,1), (6,2)]", "result": "[1, 2, 3]" } }, { "highlight": [1], "label": "Pop min=4 from arr0. Push next element 7 from arr0.", "stats": { "heap": "[(5,1), (6,2), (7,0)]", "result": "[1, 2, 3, 4]" } }, { "highlight": [4,7,2,5,8], "label": "Pattern continues: 5→6→7→8→9. Arrays exhaust one by one; heap drains to empty.", "stats": { "heap": "[ ]", "result": "[1, 2, 3, 4, 5, 6, 7, 8, 9]" } } ], "speed": 900 }
\`\`\`

### Implementation

\`\`\`playground
{ "title": "K-Way Merge — Python", "language": "python", "code": "import heapq\\n\\ndef k_way_merge(arrays):\\n    result = []\\n    min_heap = []\\n\\n    # Seed: push (value, array_index, element_index)\\n    for i, arr in enumerate(arrays):\\n        if arr:  # skip empty arrays safely\\n            heapq.heappush(min_heap, (arr[0], i, 0))\\n\\n    while min_heap:\\n        val, arr_idx, elem_idx = heapq.heappop(min_heap)\\n        result.append(val)\\n\\n        # Advance pointer in the same array\\n        next_idx = elem_idx + 1\\n        if next_idx < len(arrays[arr_idx]):\\n            next_val = arrays[arr_idx][next_idx]\\n            heapq.heappush(min_heap, (next_val, arr_idx, next_idx))\\n\\n    return result\\n\\n# Equal-length arrays\\nprint(k_way_merge([[1,4,7],[2,5,8],[3,6,9]]))\\n# [1, 2, 3, 4, 5, 6, 7, 8, 9]\\n\\n# Unequal-length arrays work seamlessly\\nprint(k_way_merge([[1,10,20],[4],[5,6]]))\\n# [1, 4, 5, 6, 10, 20]", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Tuple ordering: watch out for equal values", "content": "Python's \`heapq\` compares tuples lexicographically. Storing \`(value, array_index, element_index)\` breaks if two values are equal **and** \`array_index\` values are also comparable (integers: fine). It breaks badly if the third field is a non-comparable object (e.g., a custom class). In that case, insert a monotonic counter as a tiebreaker: \`(value, counter, array_index, element_index)\`." }
\`\`\`

### When to Reach for This Pattern

| Problem signal | Canonical example |
|----------------|------------------|
| K sorted arrays → one sorted output | Merge K Sorted Lists (LeetCode 23) |
| Kth smallest across sorted sequences | Kth Smallest in M Sorted Lists |
| Smallest range covering K lists | Smallest Range (LeetCode 632) |
| External merge sort on disk | K sorted file chunks → one sorted file |
| Distributed log aggregation | K servers emit sorted event streams |

\`\`\`collapse
{ "title": "Deep Dive: K-Way Merge in Production Systems", "content": "**External Merge Sort:** When a dataset exceeds RAM, you sort in-memory chunks (producing K sorted runs on disk), then K-way merge them in a single pass — the backbone of database sort operations and Hadoop MapReduce.\\n\\n**Distributed Search:** A search engine queries K shards, each returning top-N results sorted by relevance score. K-way merge reassembles the global top-N without centralising all data.\\n\\n**Time-Series Aggregation:** K microservices each emit a sorted stream of timestamped events. K-way merge produces a globally ordered audit log with O(n log K) work — far cheaper than buffering and sorting.\\n\\n**MapReduce Shuffle Phase:** The 'shuffle and sort' step merges K sorted partitions from map workers before they reach reducers — textbook K-way merge under the hood." }
\`\`\`

\`\`\`quiz
{ "title": "K-Way Merge Check", "questions": [ { "question": "You have K=50 sorted arrays with n=10,000 total elements. Approximately how many heap comparisons does K-way merge perform?", "options": ["10,000 × log(10,000) ≈ 130,000", "10,000 × log(50) ≈ 56,000", "50 × log(10,000) ≈ 665", "10,000 × 50 = 500,000"], "answer": 1, "explanation": "Each of the n=10,000 elements triggers one push and one pop — 20,000 heap operations total. Each costs O(log 50) ≈ 5.6 comparisons. That's roughly 112,000 comparisons, consistent with O(n log k)." }, { "question": "Why does each heap entry store (value, array_index, element_index) instead of just (value)?", "options": ["To sort tie values alphabetically", "To know which array to advance after popping the minimum", "To prevent duplicate values entering the heap", "To track total elements processed so far"], "answer": 1, "explanation": "After popping the minimum, you must push the next element from the *same* array. Without array_index and element_index, you have no way to locate that next element." }, { "question": "What is the auxiliary space complexity of K-way merge, and why?", "options": ["O(n) — you must hold the entire result in memory", "O(k log k) — heap has k elements each costing log k space", "O(k) — the heap holds at most one element per array at any time", "O(n log k) — mirrors the time complexity"], "answer": 2, "explanation": "The heap maintains at most k elements simultaneously — one frontier pointer per array. The result array is output space and excluded from auxiliary space analysis." }, { "question": "Array A = [1, 5, 9] and Array B = [] are passed to k_way_merge. What happens?", "options": ["IndexError on the empty array", "Incorrect output — empty arrays must be padded with infinity", "The guard \`if arr:\` skips B; output is [1, 5, 9]", "Output is [1, 5, 9, None]"], "answer": 2, "explanation": "The \`if arr:\` check before the initial heappush safely skips empty arrays. An empty array contributes no elements to the merge, so skipping its heap entry produces the correct result." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "K-Way Merge uses a min-heap to extract the global minimum across K sorted arrays in O(log k) per element — total O(n log k) time, O(k) space.", "Always store (value, array_index, element_index) in each heap entry so you can advance the correct array after each extraction.", "Compared to concatenate-and-sort O(n log n), the heap approach wins whenever K is large relative to n.", "Recognise the pattern when a problem gives K sorted inputs and asks for globally sorted output, the Kth smallest element, or the smallest range covering all K lists." ] }
\`\`\``,
    },
    {
      id: "merge-k-sorted-lists",
      slug: "merge-k-sorted-lists",
      title: "Merge K Sorted Lists",
      content: `\`\`\`concept
{ "title": "K-Way Merge Mental Model", "variant": "mental-model", "content": "Imagine K sorted queues feeding a single output conveyor belt. At every step, the next item on the belt must be the minimum of all K front items. A min-heap is a machine that hands you the current minimum in O(log K) — you replace it with the next item from that same queue, then repeat. The heap never holds more than K items." }
\`\`\`

## Problem Statement

Given an array of \`k\` linked lists, each sorted in ascending order, merge them all into one sorted linked list and return it.

\`\`\`callout
{ "type": "info", "title": "Examples", "content": "**Example 1:** \`lists = [[1,4,5],[1,3,4],[2,6]]\` → \`[1,1,2,3,4,4,5,6]\`\\n\\n**Example 2:** \`lists = []\` → \`[]\`\\n\\n**Example 3:** \`lists = [[]]\` → \`[]\`" }
\`\`\`

## Why a Min-Heap?

The naive approach scans all K heads every step — O(K) per element — giving **O(NK)** total. When K is large this is painful. The key observation: because each list is already sorted, you only ever care about the *current head* of each list. Among K heads, "which is smallest?" is exactly what a min-heap answers in **O(log K)**, reducing total work to **O(N log K)**.

\`\`\`steps
{ "title": "K-Way Merge Algorithm", "steps": [ { "title": "Initialize: push all list heads", "content": "For each non-empty list, push \`(node.val, list_index, node)\` into the min-heap. The \`list_index\` integer is critical — it acts as a tie-breaker when two nodes share the same value, since Python can't compare raw \`ListNode\` objects directly." }, { "title": "Pop the global minimum", "content": "Extract the smallest tuple from the heap. The \`node\` inside is the next element for the merged output. Advance \`tail.next = node\`, then \`tail = tail.next\`." }, { "title": "Advance that list", "content": "If the popped node has a \`next\`, push \`(node.next.val, list_index, node.next)\` into the heap. This keeps exactly one representative per non-exhausted list in the heap at all times — the invariant that makes correctness work." }, { "title": "Repeat until empty", "content": "Keep popping and pushing until the heap is empty. Every node is processed exactly once. Return \`head.next\` from the dummy head node to get the result." } ] }
\`\`\`

## Step-by-Step Walkthrough

Tracing \`[[1,4,5], [1,3,4], [2,6]]\` — watch the output array fill left to right:

\`\`\`algoviz
{ "title": "Merged Output Being Built", "type": "array", "data": [1, 1, 2, 3, 4, 4, 5, 6], "frames": [ { "highlight": [], "label": "Heap initialized with heads: [(1,L0), (1,L1), (2,L2)]", "stats": { "heap": "[(1,L0),(1,L1),(2,L2)]", "output_len": 0 } }, { "highlight": [0], "label": "Pop 1 from L0 → output. Push 4(L0) into heap.", "stats": { "heap": "[(1,L1),(2,L2),(4,L0)]", "output_len": 1 } }, { "highlight": [0, 1], "label": "Pop 1 from L1 → output. Push 3(L1) into heap.", "stats": { "heap": "[(2,L2),(3,L1),(4,L0)]", "output_len": 2 } }, { "highlight": [0, 1, 2], "label": "Pop 2 from L2 → output. Push 6(L2) into heap.", "stats": { "heap": "[(3,L1),(4,L0),(6,L2)]", "output_len": 3 } }, { "highlight": [0, 1, 2, 3], "label": "Pop 3 from L1 → output. Push 4(L1) into heap.", "stats": { "heap": "[(4,L0),(4,L1),(6,L2)]", "output_len": 4 } }, { "highlight": [0, 1, 2, 3, 4], "label": "Pop 4 from L0 → output. Push 5(L0) into heap.", "stats": { "heap": "[(4,L1),(5,L0),(6,L2)]", "output_len": 5 } }, { "highlight": [0, 1, 2, 3, 4, 5], "label": "Pop 4 from L1 → output. L1 exhausted — nothing pushed.", "stats": { "heap": "[(5,L0),(6,L2)]", "output_len": 6 } }, { "highlight": [0, 1, 2, 3, 4, 5, 6], "label": "Pop 5 from L0 → output. L0 exhausted.", "stats": { "heap": "[(6,L2)]", "output_len": 7 } }, { "highlight": [0, 1, 2, 3, 4, 5, 6, 7], "label": "Pop 6 from L2 → output. Heap empty — merge complete!", "stats": { "heap": "[]", "output_len": 8 } } ], "speed": 900 }
\`\`\`

## Solution

\`\`\`playground
{ "title": "Merge K Sorted Lists — Python", "language": "python", "code": "import heapq\\nfrom typing import List, Optional\\n\\nclass ListNode:\\n    def __init__(self, val=0, next=None):\\n        self.val = val\\n        self.next = next\\n\\nclass Solution:\\n    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:\\n        heap = []\\n        # Push (val, list_index, node) — list_index breaks ties safely\\n        for i, node in enumerate(lists):\\n            if node:\\n                heapq.heappush(heap, (node.val, i, node))\\n\\n        head = tail = ListNode(0)  # dummy head avoids first-node special case\\n\\n        while heap:\\n            val, i, node = heapq.heappop(heap)\\n            tail.next = node\\n            tail = tail.next\\n            if node.next:\\n                heapq.heappush(heap, (node.next.val, i, node.next))\\n\\n        return head.next  # skip the dummy", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why (val, list_index, node) — not just node?", "content": "Python's \`heapq\` compares tuples left-to-right. When two nodes have equal \`.val\`, the heap tries the *next* element in the tuple. If you stored \`(val, node)\`, it would try to compare \`ListNode\` objects — but \`ListNode\` has no \`__lt__\`, so Python raises \`TypeError\`. Inserting an integer \`list_index\` as the middle element provides a guaranteed-comparable tie-breaker before the node is ever touched." }
\`\`\`

## Complexity & Alternatives

\`\`\`tabs
{ "tabs": [ { "label": "Time — O(N log K)", "icon": "⏱️", "content": "**N** = total nodes across all K lists.\\n\\nEach node is pushed once and popped once. The heap holds at most **K** elements, so each push/pop costs **O(log K)**.\\n\\n| Approach | Time | Note |\\n|---|---|---|\\n| Naïve scan | O(NK) | Scan all K heads every step |\\n| **Min-heap** | **O(N log K)** | Heap of K elements |\\n| Divide & conquer | O(N log K) | Pair-merge like merge sort |\\n\\nFor K=1000 and N=10⁶, the heap is ~100× faster than naïve." }, { "label": "Space — O(K)", "icon": "💾", "content": "The heap holds at most **K** nodes simultaneously — one per non-exhausted list.\\n\\nThe output list reuses the original \`ListNode\` objects (no new nodes allocated), so **auxiliary space is O(K)**.\\n\\nIf you count the output itself, it's O(N) — but by convention we report auxiliary space only." }, { "label": "Divide & Conquer", "icon": "🔀", "content": "An elegant alternative: pair up the K lists and merge each pair using the classic merge-two-sorted-lists subroutine, then repeat on the results.\\n\\n\`\`\`\\nRound 1: K lists → K/2 merged lists  (all N nodes touched once)\\nRound 2: K/2   → K/4  (all N nodes touched once)\\n...after log(K) rounds: 1 final list\\n\`\`\`\\n\\n**Same O(N log K) time**, O(log K) recursion stack, no heap needed. The building block (\`merge two lists\`) is simpler to reason about, but the heap approach has a lower constant factor and is more common in interviews." } ] }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "After popping a node from the heap, what is the next required action?", "options": [ "Rebuild the heap from scratch with all remaining nodes", "Push node.next into the heap (if non-null)", "Pop again immediately to find the second-smallest", "Push the head of any other list that hasn't started yet" ], "answer": 1, "explanation": "Correctness depends on maintaining exactly one representative per non-exhausted list. After consuming a node, you must push its successor so that list remains eligible for future selections. Skipping this step would cause elements from that list to be lost." }, { "question": "Why is list_index stored as the second element in the heap tuple (val, list_index, node)?", "options": [ "To save memory by deferring node object access", "To enable O(1) lookup of how many nodes each list has contributed", "Because heapq compares tuples left-to-right — list_index prevents TypeError when two vals are equal", "To allow the heap to detect when a list has been fully exhausted" ], "answer": 2, "explanation": "Python's heapq falls through to the next tuple element on ties. If two nodes share the same val, heapq tries to compare the ListNode objects directly — but ListNode has no __lt__, raising TypeError. An integer list_index as the second element provides a safely comparable tie-breaker before the nodes are ever touched." }, { "question": "What is the time complexity of the min-heap approach?", "options": [ "O(N log N) — N total nodes, heap of size N", "O(NK) — N nodes × K lists", "O(N log K) — N nodes, heap of size K", "O(K log N) — K lists, N nodes each" ], "answer": 2, "explanation": "Each of the N nodes is pushed and popped exactly once. The heap holds at most K elements at any time, so each operation costs O(log K). Total: O(N log K). The naive scan-all-heads approach costs O(NK) — the heap provides the log K factor improvement." }, { "question": "What is the purpose of the dummy head node (\`head = tail = ListNode(0)\`)?", "options": [ "It stores the total count of merged nodes for validation", "It prevents the heap from processing null nodes", "It eliminates the need to special-case attaching the very first output node", "It holds the minimum value so the heap can skip one comparison" ], "answer": 2, "explanation": "Without a dummy head, you'd need an if-branch to handle the first node (since tail would be None initially). The dummy lets you uniformly write \`tail.next = node; tail = tail.next\` for every popped node, then return \`head.next\` as the real head of the merged list." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "A min-heap capped at K elements lets you extract the global minimum in O(log K) — this is the core insight behind K-way merge.", "Store (val, list_index, node) in heap tuples: the integer list_index safely breaks ties without needing a custom __lt__ on ListNode.", "Time: O(N log K) | Space: O(K) auxiliary — each of the N nodes is heap-processed exactly once.", "The dummy head node (\`head = tail = ListNode(0)\`) eliminates first-node special cases; always return head.next.", "Divide-and-conquer (pair-wise merging like merge sort) achieves the same O(N log K) time — worth knowing as an alternative that trades the heap for O(log K) stack depth." ] }
\`\`\``,
      starterCode: `import heapq


class ListNode:
    """Node in a singly linked list."""
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
    
    def __repr__(self):
        """String representation for debugging."""
        result = []
        curr = self
        while curr:
            result.append(str(curr.val))
            curr = curr.next
        return " -> ".join(result)


def merge_k_lists(lists):
    """
    Merge k sorted linked lists into one sorted list.
    
    Args:
        lists: List of ListNode, heads of sorted linked lists
    
    Returns:
        ListNode: Head of merged sorted list
    
    Example:
        >>> lists = [ListNode(1, ListNode(4, ListNode(5))),
        ...          ListNode(1, ListNode(3, ListNode(4))),
        ...          ListNode(2, ListNode(6))]
        >>> result = merge_k_lists(lists)
        >>> print(result)
        1 -> 1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6
    """
    # TODO: Use min-heap to merge k sorted lists
    # Hint: Store (val, list_index, node) in heap
    pass


# ─── Helper Functions ───

def create_linked_list(arr):
    """Create linked list from array."""
    if not arr:
        return None
    head = ListNode(arr[0])
    curr = head
    for val in arr[1:]:
        curr.next = ListNode(val)
        curr = curr.next
    return head


def linked_list_to_array(head):
    """Convert linked list to array."""
    result = []
    curr = head
    while curr:
        result.append(curr.val)
        curr = curr.next
    return result


# ─── Test Cases ───

# Standard case
lists = [
    create_linked_list([1, 4, 5]),
    create_linked_list([1, 3, 4]),
    create_linked_list([2, 6])
]
result = merge_k_lists(lists)
print(linked_list_to_array(result))
# Expected: [1, 1, 2, 3, 4, 4, 5, 6]

# Empty list of lists
print(merge_k_lists([]))
# Expected: None

# List with empty list
result = merge_k_lists([[]])
print(result)
# Expected: None

# Single list
result = merge_k_lists([create_linked_list([1, 2, 3])])
print(linked_list_to_array(result))
# Expected: [1, 2, 3]

# Two lists
lists = [
    create_linked_list([1, 3, 5]),
    create_linked_list([2, 4, 6])
]
result = merge_k_lists(lists)
print(linked_list_to_array(result))
# Expected: [1, 2, 3, 4, 5, 6]
`,
      solutionCode: `import heapq


class ListNode:
    """Node in a singly linked list."""
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
    
    def __repr__(self):
        result = []
        curr = self
        while curr:
            result.append(str(curr.val))
            curr = curr.next
        return " -> ".join(result)
    
    def __lt__(self, other):
        """Less than comparison for heap."""
        return self.val < other.val


def merge_k_lists(lists):
    """
    Merge k sorted linked lists into one sorted list.
    
    Time Complexity: O(n log k) — n total nodes, heap ops O(log k)
    Space Complexity: O(k) — heap stores at most k nodes
    """
    # Min-heap to track smallest node from each list
    min_heap = []
    
    # Push head of each non-empty list
    for i, node in enumerate(lists):
        if node:
            # Use counter to break ties (nodes not directly comparable)
            heapq.heappush(min_heap, (node.val, i, node))
    
    # Dummy head for result list
    dummy = ListNode(0)
    curr = dummy
    
    while min_heap:
        val, i, node = heapq.heappop(min_heap)
        
        # Add to result
        curr.next = node
        curr = curr.next
        
        # Push next node from same list
        if node.next:
            heapq.heappush(min_heap, (node.next.val, i, node.next))
    
    return dummy.next


# Alternative without modifying ListNode
def merge_k_lists_v2(lists):
    """
    Alternative using wrapper class for comparison.
    """
    class Wrapper:
        def __init__(self, node):
            self.node = node
        def __lt__(self, other):
            return self.node.val < other.node.val
    
    min_heap = []
    for node in lists:
        if node:
            heapq.heappush(min_heap, Wrapper(node))
    
    dummy = ListNode(0)
    curr = dummy
    
    while min_heap:
        wrapper = heapq.heappop(min_heap)
        node = wrapper.node
        curr.next = node
        curr = curr.next
        
        if node.next:
            heapq.heappush(min_heap, Wrapper(node.next))
    
    return dummy.next


# ─── Helper Functions ───

def create_linked_list(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    curr = head
    for val in arr[1:]:
        curr.next = ListNode(val)
        curr = curr.next
    return head


def linked_list_to_array(head):
    result = []
    curr = head
    while curr:
        result.append(curr.val)
        curr = curr.next
    return result


# ─── Test Cases ───
lists = [
    create_linked_list([1, 4, 5]),
    create_linked_list([1, 3, 4]),
    create_linked_list([2, 6])
]
result = merge_k_lists(lists)
print(linked_list_to_array(result))
# Expected: [1, 1, 2, 3, 4, 4, 5, 6]

print(merge_k_lists([]))
# Expected: None

print(merge_k_lists([[]]))
# Expected: None

result = merge_k_lists([create_linked_list([1, 2, 3])])
print(linked_list_to_array(result))
# Expected: [1, 2, 3]

lists = [
    create_linked_list([1, 3, 5]),
    create_linked_list([2, 4, 6])
]
result = merge_k_lists(lists)
print(linked_list_to_array(result))
# Expected: [1, 2, 3, 4, 5, 6]
`,
    },
    {
      id: "kth-smallest-m-sorted-lists",
      slug: "kth-smallest-m-sorted-lists",
      title: "Kth Smallest Number in M Sorted Lists",
      content: `## Kth Smallest Number in M Sorted Lists

<!-- voice:section_check concept="Finding kth smallest without full merge" -->

Given M sorted arrays, find the **Kth smallest number** among all elements across all arrays — without fully merging them.

\`\`\`concept
{ "title": "The Key Insight", "variant": "insight", "content": "You don't need to merge all M lists to find the Kth smallest. The min-heap always holds the current front of each list — the global minimum is always at the top. Pop exactly K times and you have your answer. Early termination saves you from processing potentially millions of elements you'll never need." }
\`\`\`

### Problem Statement

Given M sorted arrays, find the Kth smallest element among all of them.

| Example | Input | K | Output | Merged (for reference) |
|---------|-------|---|--------|----------------------|
| 1 | \`[[2,6,8],[3,6,7],[1,3,4]]\` | 5 | \`4\` | \`[1,2,3,3,**4**,6,6,7,8]\` |
| 2 | \`[[5,8,9],[1,7]]\` | 3 | \`7\` | \`[1,5,**7**,8,9]\` |

---

### Approach: K-Way Merge with Early Termination

\`\`\`steps
{ "title": "K-Way Merge Algorithm", "steps": [ { "title": "Seed the heap", "content": "Push the first element of **every** list into a min-heap as a tuple \`(value, list_index, element_index)\`. The heap now holds the M smallest candidates — one from each list." }, { "title": "Pop K−1 times", "content": "Each pop removes the current global minimum. After popping, push the **next element from the same list** (if one exists) to maintain the invariant: the heap always has the smallest unprocessed element from each active list." }, { "title": "The Kth pop is the answer", "content": "On the Kth extraction, return the popped value immediately — no need to continue. This is the early-termination optimization that gives us O(k log m) instead of O(N log m) for a full merge." } ] }
\`\`\`

\`\`\`concept
{ "title": "Heap Invariant", "variant": "rule", "content": "At every step, the min-heap contains exactly one element per active list — the smallest unprocessed element from that list. This guarantees the heap top is always the global minimum among all remaining elements. Pop it, replace with next from the same list, repeat." }
\`\`\`

---

### Visualizing the Algorithm

Let's trace \`lists = [[2,6,8],[3,6,7],[1,3,4]], k=5\`:

\`\`\`algoviz
{ "title": "Heap State — Finding 5th Smallest", "type": "array", "data": [1, 2, 3, 3, 4, 6, 6, 7, 8], "frames": [ { "highlight": [0], "label": "Pop #1: value=1 (list 2, idx 0). Push next from list 2 → 3. Heap: {2,3,3}", "stats": { "pop": 1, "heap_size": 3 } }, { "highlight": [0, 1], "label": "Pop #2: value=2 (list 0, idx 0). Push next from list 0 → 6. Heap: {3,3,6}", "stats": { "pop": 2, "heap_size": 3 } }, { "highlight": [0, 1, 2], "label": "Pop #3: value=3 (list 1, idx 0). Push next from list 1 → 6. Heap: {3,6,6}", "stats": { "pop": 3, "heap_size": 3 } }, { "highlight": [0, 1, 2, 3], "label": "Pop #4: value=3 (list 2, idx 1). Push next from list 2 → 4. Heap: {4,6,6}", "stats": { "pop": 4, "heap_size": 3 } }, { "highlight": [0, 1, 2, 3, 4], "label": "Pop #5: value=4 ← THIS IS THE ANSWER (k=5). Stop immediately!", "stats": { "pop": 5, "heap_size": 2 } } ], "speed": 900 }
\`\`\`

---

### Code Trace

\`\`\`trace
{ "title": "Step-by-Step Execution", "language": "python", "code": "import heapq\\n\\ndef kth_smallest(lists, k):\\n    heap = []\\n    for i, lst in enumerate(lists):\\n        if lst:\\n            heapq.heappush(heap, (lst[0], i, 0))\\n    \\n    count = 0\\n    result = None\\n    while heap:\\n        val, li, ei = heapq.heappop(heap)\\n        count += 1\\n        if count == k:\\n            return val\\n        if ei + 1 < len(lists[li]):\\n            heapq.heappush(heap, (lists[li][ei+1], li, ei+1))\\n    return result", "frames": [ { "line": 3, "vars": { "heap": "[]", "lists": "[[2,6,8],[3,6,7],[1,3,4]]", "k": 5 }, "note": "Start: empty heap" }, { "line": 5, "vars": { "heap": "[(1,2,0),(2,0,0),(3,1,0)]", "i": 2 }, "note": "Seeded heap with first element of each list" }, { "line": 9, "vars": { "count": 0, "val": "—", "heap_size": 3 }, "note": "Enter main loop" }, { "line": 10, "vars": { "val": 1, "li": 2, "ei": 0, "count": 1 }, "note": "Pop 1st: value=1 from list[2]" }, { "line": 14, "vars": { "heap": "[(2,0,0),(3,1,0),(3,2,1)]" }, "note": "Push next from list[2]: value=3" }, { "line": 10, "vars": { "val": 3, "li": 2, "ei": 1, "count": 4 }, "note": "Pop 4th: value=3 from list[2]" }, { "line": 14, "vars": { "heap": "[(4,2,2),(6,0,1),(6,1,1)]" }, "note": "Push next from list[2]: value=4" }, { "line": 11, "vars": { "val": 4, "count": 5 }, "note": "Pop 5th: count==k → return 4 ✓", "stdout": "4" } ], "speed": 900 }
\`\`\`

---

### Implementation

\`\`\`tabs
{ "tabs": [ { "label": "Python", "icon": "🐍", "content": "\`\`\`python\\nimport heapq\\n\\ndef kth_smallest(lists, k):\\n    heap = []\\n    # Seed: push (value, list_index, element_index)\\n    for i, lst in enumerate(lists):\\n        if lst:\\n            heapq.heappush(heap, (lst[0], i, 0))\\n    \\n    count = 0\\n    while heap:\\n        val, li, ei = heapq.heappop(heap)\\n        count += 1\\n        if count == k:\\n            return val          # Early termination\\n        next_ei = ei + 1\\n        if next_ei < len(lists[li]):\\n            heapq.heappush(heap, (lists[li][next_ei], li, next_ei))\\n    \\n    return None   # k exceeds total elements\\n\`\`\`" }, { "label": "Java", "icon": "☕", "content": "\`\`\`java\\nimport java.util.PriorityQueue;\\n\\npublic int kthSmallest(int[][] lists, int k) {\\n    // [value, listIndex, elementIndex]\\n    PriorityQueue<int[]> heap = new PriorityQueue<>(\\n        (a, b) -> a[0] - b[0]\\n    );\\n    \\n    for (int i = 0; i < lists.length; i++) {\\n        if (lists[i].length > 0) {\\n            heap.offer(new int[]{lists[i][0], i, 0});\\n        }\\n    }\\n    \\n    int count = 0;\\n    while (!heap.isEmpty()) {\\n        int[] top = heap.poll();\\n        count++;\\n        if (count == k) return top[0];  // Early termination\\n        int nextIdx = top[2] + 1;\\n        if (nextIdx < lists[top[1]].length) {\\n            heap.offer(new int[]{lists[top[1]][nextIdx], top[1], nextIdx});\\n        }\\n    }\\n    return -1;\\n}\\n\`\`\`" }, { "label": "JavaScript", "icon": "🟨", "content": "\`\`\`javascript\\n// Using a MinHeap class (heap not built into JS)\\nfunction kthSmallest(lists, k) {\\n    const heap = new MinHeap((a, b) => a[0] - b[0]);\\n    \\n    for (let i = 0; i < lists.length; i++) {\\n        if (lists[i].length > 0) {\\n            heap.push([lists[i][0], i, 0]);\\n        }\\n    }\\n    \\n    let count = 0;\\n    while (!heap.isEmpty()) {\\n        const [val, li, ei] = heap.pop();\\n        count++;\\n        if (count === k) return val;  // Early termination\\n        if (ei + 1 < lists[li].length) {\\n            heap.push([lists[li][ei + 1], li, ei + 1]);\\n        }\\n    }\\n    return null;\\n}\\n\`\`\`" } ] }
\`\`\`

---

### Complexity Analysis

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Naive: Full Merge First", "code": "# Collect all elements → sort → index\\nall_elements = []\\nfor lst in lists:\\n    all_elements.extend(lst)\\nall_elements.sort()     # O(N log N)\\nreturn all_elements[k-1]\\n\\n# Time:  O(N log N)  where N = total elements\\n# Space: O(N)  — stores everything in memory\\n# Bad when N >> k (millions of elements, k=10)" }, "after": { "label": "Optimal: K-Way Merge (Early Termination)", "code": "# Min-heap stops after exactly k extractions\\n# Never looks at elements beyond the kth\\n\\n# Time:  O(k log m)\\n#   k = target rank, m = number of lists\\n#   heap never exceeds m elements\\n# Space: O(m)\\n#   only one element per list in heap\\n# Ideal when k << N (find top-10 in 10M records)" } }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "When m is small (typical case)", "content": "With m=10 lists and k=100, the heap has at most 10 elements. Each \`heappush\`/\`heappop\` is O(log 10) ≈ 3 comparisons. You do this 100 times → ~300 comparisons total. The naive sort of, say, 10,000 total elements would be ~130,000 comparisons. The savings compound dramatically at scale." }
\`\`\`

---

### Connection to Related Problems

\`\`\`collapse
{ "title": "Deep Dive: Kth Smallest in N×N Sorted Matrix", "content": "A sorted matrix (each row AND column sorted) is just M sorted lists in disguise — treat each **row** as one list. Apply the exact same algorithm with m = N (number of rows).\\n\\nThe heap still holds at most N elements (one per row). Extract k times for O(k log N) time.\\n\\n**Alternative: Binary Search on value space**\\nSince the matrix is doubly sorted, you can binary search on the answer value and count how many elements are ≤ mid in O(N) time (staircase traversal). This gives O(N log(max−min)) — useful when k is large but N is small.\\n\\nFor the standard k-way merge heap approach, both problems share the same O(k log m) complexity." }
\`\`\`

---

### Knowledge Check

\`\`\`quiz
{ "title": "Kth Smallest in M Sorted Lists", "questions": [ { "question": "You have m=4 sorted lists with a total of N=10,000 elements, and k=20. What is the maximum number of elements the min-heap ever holds simultaneously?", "options": ["20", "4", "10,000", "80"], "answer": 1, "explanation": "The heap holds exactly one element per active list — at most m=4 elements at any time. It never holds k=20 or N elements. This is what makes the space complexity O(m), not O(N)." }, { "question": "After initializing the heap with the first element of each list, how many total heap operations (push + pop combined) does the algorithm perform to find the kth smallest?", "options": ["O(k)", "O(2k + m)", "O(k log m)", "O(N)"], "answer": 1, "explanation": "We do m initial pushes to seed the heap, then for each of k extractions we do 1 pop + at most 1 push = 2 operations. Total: m + 2k heap operations, each costing O(log m). The O(2k + m) count is exact; the time complexity is O((k + m) log m) ≈ O(k log m) when k >> m." }, { "question": "What information must each heap entry store (beyond the element value) and why?", "options": ["Only the value — the heap sorts by value anyway", "The value and the list index — to know which list to pull the next element from", "The value, list index, and element index — to locate and push the next element", "The value and a reference to the remaining subarray"], "answer": 2, "explanation": "You need (value, list_index, element_index) to efficiently find the next element: \`lists[list_index][element_index + 1]\`. Storing just (value, list_index) would require scanning from the start of each list on every pop — O(n) instead of O(1) to find the successor." }, { "question": "Which scenario most benefits from K-Way Merge over sorting all elements?", "options": ["k equals the total number of elements N", "k is very small relative to N (e.g., top-10 from 1 million records)", "All lists have exactly one element", "k equals N/2 (median case)"], "answer": 1, "explanation": "When k << N, early termination in K-Way Merge is a massive win. O(k log m) vs O(N log N) — if k=10 and N=1,000,000 with m=100 lists, that's ~70 operations vs ~20,000,000. The savings vanish when k approaches N." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Initialize the min-heap with the first element of each of the m lists — seeds the heap with all 'current candidates'.", "Each pop reveals the global minimum; immediately push the next element from the same list to maintain the invariant.", "Stop after exactly k pops — early termination gives O(k log m) time and O(m) space, beating a full sort when k << total elements.", "The heap never holds more than m elements regardless of list sizes — this is the space efficiency guarantee.", "This same technique generalizes to Kth Smallest in N×N Sorted Matrix by treating each row as a sorted list." ] }
\`\`\``,
      starterCode: `import heapq


def find_kth_smallest(lists, k):
    """
    Find kth smallest number in m sorted lists.
    
    Args:
        lists: List of sorted arrays
        k: int, which smallest element to find
    
    Returns:
        int: The kth smallest element
    
    Example:
        >>> find_kth_smallest([[2, 6, 8], [3, 6, 7], [1, 3, 4]], 5)
        4
        >>> find_kth_smallest([[5, 8, 9], [1, 7]], 3)
        7
    """
    # TODO: Use min-heap to find kth smallest without full merge
    # Hint: Pop from heap k times, the kth pop is the answer
    pass


# ─── Test Cases ───

# Standard case
print(find_kth_smallest([[2, 6, 8], [3, 6, 7], [1, 3, 4]], 5))
# Expected: 4

# Two lists
print(find_kth_smallest([[5, 8, 9], [1, 7]], 3))
# Expected: 7

# k=1 (smallest overall)
print(find_kth_smallest([[2, 4], [1, 3]], 1))
# Expected: 1

# Single list
print(find_kth_smallest([[1, 2, 3, 4, 5]], 3))
# Expected: 3

# Multiple duplicates
print(find_kth_smallest([[1, 1, 1], [1, 2, 3]], 4))
# Expected: 2

# Larger k
print(find_kth_smallest([[1, 2, 3], [4, 5, 6], [7, 8, 9]], 7))
# Expected: 7
`,
      solutionCode: `import heapq


def find_kth_smallest(lists, k):
    """
    Find kth smallest number in m sorted lists.
    
    Time Complexity: O(k log m) — k heap pops, heap size m
    Space Complexity: O(m) — heap stores at most m elements
    """
    min_heap = []
    
    # Push first element from each list
    for i, arr in enumerate(lists):
        if arr:
            heapq.heappush(min_heap, (arr[0], i, 0))
    
    count = 0
    
    while min_heap:
        val, list_idx, elem_idx = heapq.heappop(min_heap)
        count += 1
        
        # Found kth smallest
        if count == k:
            return val
        
        # Push next element from same list
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(min_heap, (next_val, list_idx, elem_idx + 1))
    
    return -1  # k is larger than total elements


# Alternative: Binary Search approach
def find_kth_smallest_binary_search(lists, k):
    """
    Alternative using binary search on value range.
    """
    def count_less_equal(num):
        """Count elements <= num across all lists."""
        count = 0
        for arr in lists:
            # Binary search for rightmost position <= num
            left, right = 0, len(arr)
            while left < right:
                mid = left + (right - left) // 2
                if arr[mid] <= num:
                    left = mid + 1
                else:
                    right = mid
            count += left
        return count
    
    # Find min and max values
    left = min(arr[0] for arr in lists if arr)
    right = max(arr[-1] for arr in lists if arr)
    
    while left < right:
        mid = left + (right - left) // 2
        if count_less_equal(mid) < k:
            left = mid + 1
        else:
            right = mid
    
    return left


# ─── Test Cases ───
print(find_kth_smallest([[2, 6, 8], [3, 6, 7], [1, 3, 4]], 5))
# Expected: 4

print(find_kth_smallest([[5, 8, 9], [1, 7]], 3))
# Expected: 7

print(find_kth_smallest([[2, 4], [1, 3]], 1))
# Expected: 1

print(find_kth_smallest([[1, 2, 3, 4, 5]], 3))
# Expected: 3

print(find_kth_smallest([[1, 1, 1], [1, 2, 3]], 4))
# Expected: 2

print(find_kth_smallest([[1, 2, 3], [4, 5, 6], [7, 8, 9]], 7))
# Expected: 7
`,
    },
    {
      id: "smallest-range-covering-k-lists",
      slug: "smallest-range-covering-k-lists",
      title: "Find Smallest Range Covering Elements from K Lists",
      content: `## Find Smallest Range Covering Elements from K Lists

The challenge: given K sorted lists, find the **tightest window [lo, hi]** such that every list contributes at least one number inside it. This is a direct application of K-Way Merge — but instead of merging everything, you're hunting for the best range.

\`\`\`concept
{ "title": "The Core Insight", "variant": "insight", "content": "At any moment, the candidate range is [heap_min, current_max]. The heap always gives you the minimum across all list-heads; you separately track the running maximum. When you advance past the minimum, the range's lower bound rises — so you greedily try every possible lower bound in sorted order, stopping the instant any list is exhausted." }
\`\`\`

### Problem Statement

Given M sorted lists, find the smallest range **[lo, hi]** such that at least one element from each list falls within [lo, hi] (inclusive).

| Input | Output | Coverage |
|-------|--------|----------|
| \`[[1,5,8],[4,12],[7,8,10]]\` | \`[4, 7]\` | 5∈L0, 4∈L1, 7∈L2 → size 3 |
| \`[[1,2,3],[1,2,3],[1,2,3]]\` | \`[1, 1]\` | 1 is in all three lists → size 0 |
| \`[[4,10,15,24],[0,9,12,20],[5,18,22,30]]\` | \`[4, 9]\` | 4∈L0, 9∈L1, 5∈L2 → size 5 |

\`\`\`concept
{ "title": "Why a Min-Heap?", "variant": "mental-model", "content": "You need to try all possible range lower bounds efficiently. Since every list is sorted, the global minimum across all current list-heads is the tightest lower bound available right now. A min-heap gives you that minimum in O(log K). After extracting it, you push the next element from the same list — keeping exactly one representative from every list in the heap at all times." }
\`\`\`

### Algorithm

\`\`\`steps
{ "title": "K-Way Merge for Smallest Range", "steps": [ { "title": "Initialize", "content": "Push the first element from every list into the min-heap as \`(value, list_index, element_index)\`. Set \`current_max\` to the maximum of all these first elements. Set \`best = [-∞, +∞]\`." }, { "title": "Pop the minimum and evaluate", "content": "Pop \`(min_val, li, ei)\` from the heap. The current window is \`[min_val, current_max]\`. If \`current_max - min_val < best[1] - best[0]\`, update \`best = [min_val, current_max]\`." }, { "title": "Advance that list", "content": "Push the next element from list \`li\` (index \`ei + 1\`) into the heap and update \`current_max = max(current_max, lists[li][ei+1])\`." }, { "title": "Stop when a list is exhausted", "content": "If list \`li\` has no more elements after \`ei\`, **break immediately**. You can no longer keep a representative from that list — no smaller valid range exists." }, { "title": "Return best", "content": "Return \`best\`. Because every possible minimum value was processed in ascending order, the optimal range was necessarily evaluated during the loop." } ] }
\`\`\`

### Step-by-Step Trace

Tracing through \`[[1, 5, 8], [4, 12], [7, 8, 10]]\`:

\`\`\`trace
{ "title": "Smallest Range — Full Execution", "language": "python", "code": "import heapq\\n\\ndef find_smallest_range(lists):\\n    heap = []\\n    current_max = float('-inf')\\n    for i, lst in enumerate(lists):\\n        heapq.heappush(heap, (lst[0], i, 0))\\n        current_max = max(current_max, lst[0])\\n\\n    best = [float('-inf'), float('inf')]\\n\\n    while heap:\\n        min_val, li, ei = heapq.heappop(heap)\\n        if current_max - min_val < best[1] - best[0]:\\n            best = [min_val, current_max]\\n        if ei + 1 == len(lists[li]):\\n            break\\n        nxt = lists[li][ei + 1]\\n        heapq.heappush(heap, (nxt, li, ei + 1))\\n        current_max = max(current_max, nxt)\\n\\n    return best", "frames": [ { "line": 6, "vars": { "heap": "[(1,0,0),(4,1,0),(7,2,0)]", "current_max": 7 }, "note": "Seed heap: L0[0]=1, L1[0]=4, L2[0]=7. max=7" }, { "line": 12, "vars": { "min_val": 1, "li": 0, "ei": 0, "current_max": 7, "best": "[-inf, inf]" }, "note": "Pop min=1 from L0. Window [1,7], size=6 → update best" }, { "line": 14, "vars": { "best": "[1, 7]" }, "note": "best=[1,7]" }, { "line": 18, "vars": { "nxt": 5, "heap": "[(4,1,0),(5,0,1),(7,2,0)]", "current_max": 7 }, "note": "Push L0[1]=5. max stays 7" }, { "line": 12, "vars": { "min_val": 4, "li": 1, "ei": 0, "current_max": 7, "best": "[1, 7]" }, "note": "Pop min=4 from L1. Window [4,7], size=3 < 6 → update best!" }, { "line": 14, "vars": { "best": "[4, 7]" }, "note": "best=[4,7] ← this is the answer" }, { "line": 18, "vars": { "nxt": 12, "heap": "[(5,0,1),(7,2,0),(12,1,1)]", "current_max": 12 }, "note": "Push L1[1]=12. max grows to 12" }, { "line": 12, "vars": { "min_val": 5, "li": 0, "ei": 1, "current_max": 12 }, "note": "Pop min=5. Window [5,12], size=7. Not better." }, { "line": 18, "vars": { "nxt": 8, "heap": "[(7,2,0),(8,0,2),(12,1,1)]", "current_max": 12 }, "note": "Push L0[2]=8. max stays 12" }, { "line": 12, "vars": { "min_val": 7, "li": 2, "ei": 0, "current_max": 12 }, "note": "Pop min=7. Window [7,12], size=5. Not better." }, { "line": 18, "vars": { "nxt": 8, "heap": "[(8,0,2),(8,2,1),(12,1,1)]", "current_max": 12 }, "note": "Push L2[1]=8. max stays 12" }, { "line": 12, "vars": { "min_val": 8, "li": 0, "ei": 2, "current_max": 12 }, "note": "Pop min=8 from L0. L0 exhausted (ei+1=3=len). BREAK." }, { "line": 21, "vars": { "best": "[4, 7]" }, "note": "Return [4, 7]", "stdout": "[4, 7]" } ], "speed": 1000 }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why stop when a list is exhausted?", "content": "Once list \`li\` runs out of elements, you cannot maintain a representative from it in any future window. The minimum after this point would come from a different list — but \`li\` would be unrepresented, making the range invalid. The best range reachable from this point is at most as good as what you've already found." }
\`\`\`

### Implementation

\`\`\`playground
{ "title": "Find Smallest Range — Python", "language": "python", "code": "import heapq\\n\\ndef find_smallest_range(lists):\\n    heap = []\\n    current_max = float('-inf')\\n\\n    # Seed with first element from every list\\n    for i, lst in enumerate(lists):\\n        heapq.heappush(heap, (lst[0], i, 0))\\n        current_max = max(current_max, lst[0])\\n\\n    best = [float('-inf'), float('inf')]\\n\\n    while heap:\\n        min_val, li, ei = heapq.heappop(heap)\\n\\n        # Update best if this window is smaller\\n        if current_max - min_val < best[1] - best[0]:\\n            best = [min_val, current_max]\\n\\n        # Stop if this list is fully consumed\\n        if ei + 1 == len(lists[li]):\\n            break\\n\\n        # Advance the pointer for that list\\n        nxt = lists[li][ei + 1]\\n        heapq.heappush(heap, (nxt, li, ei + 1))\\n        current_max = max(current_max, nxt)\\n\\n    return best\\n\\nprint(find_smallest_range([[1, 5, 8], [4, 12], [7, 8, 10]]))   # [4, 7]\\nprint(find_smallest_range([[1, 2, 3], [1, 2, 3], [1, 2, 3]]))  # [1, 1]\\nprint(find_smallest_range([[4,10,15,24],[0,9,12,20],[5,18,22,30]]))  # [4, 9]", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Equal-size range tie-breaking", "content": "When two ranges have identical size, prefer the one with the smaller \`lo\`. The strict \`<\` comparison in the implementation handles this automatically: the first range of a given size encountered is kept, and because we process minimums in ascending order, the first occurrence always has the smallest lower bound." }
\`\`\`

### Complexity

\`\`\`tabs
{ "tabs": [ { "label": "Time — O(N log K)", "icon": "⏱️", "content": "Let N = total elements across all K lists.\\n\\n- **Initialization:** push K elements → O(K log K)\\n- **Main loop:** each element is pushed and popped at most once → O(N log K) total\\n\\n**Overall: O(N log K)**\\n\\nThis is essentially optimal — every element must be examined at least once, and the heap keeps each operation at O(log K) rather than O(K)." }, { "label": "Space — O(K)", "icon": "💾", "content": "The heap holds exactly **one element per list** at any point in time — the current frontier representative. This is O(K), the same bound as Merge K Sorted Lists.\\n\\n\`best\` and \`current_max\` are O(1) additional space.\\n\\nNote: we do NOT store the flattened array, so space stays O(K) regardless of how large N is." }, { "label": "vs Brute Force", "icon": "⚖️", "content": "**Brute force:** try every pair of elements as range endpoints, verify each covers all K lists.\\n- O(N²) pairs × O(K) verification = **O(N² K)**\\n\\n**K-Way Merge:** **O(N log K)**\\n\\nFor N = 10,000 elements across K = 50 lists:\\n- Brute force: ~5 billion operations\\n- K-Way Merge: ~166,000 operations\\n\\nThe heap approach is the standard expected solution in interviews." } ] }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "After popping the minimum (min_val, li, ei), when do we stop the algorithm?", "options": ["When heap size drops below K", "When list li has no element at index ei + 1", "When current_max equals min_val", "After exactly N iterations"], "answer": 1, "explanation": "We stop when the list that provided the current minimum is exhausted. At that point, we can no longer keep a representative from that list in any future window — every future window would be invalid for list li. No future range can beat the best already found." }, { "question": "Why does current_max never decrease during the algorithm?", "options": ["We only push elements that are larger than current_max", "Each list is sorted, so the next element from any list is ≥ the element it replaces, and we take the max", "We only update current_max when we find a new best range", "current_max is set once at initialization and never changes"], "answer": 1, "explanation": "Each list is sorted in ascending order. When we replace the popped element with the next element from the same list, that next element is ≥ the popped element. We update current_max = max(current_max, next_element) — since next_element ≥ popped ≥ 0 and we always take the max, current_max is non-decreasing." }, { "question": "For lists = [[1,5,8],[4,12],[7,8,10]], is [5,8] a valid range? Why or why not?", "options": ["Yes — 5 is in L0, 8 is in L2, and 8 is between 5 and 8", "No — L1 = [4,12] has no element in [5,8]; neither 4 nor 12 falls in that range", "Yes — it is valid but larger than [4,7]", "No — the range size equals [4,7] so it is skipped"], "answer": 1, "explanation": "L1 = [4, 12]. The only elements are 4 (below 5) and 12 (above 8). Neither falls in [5, 8], so [5, 8] does not cover L1 and is an invalid range. This is why the algorithm carefully advances through all elements — some intuitively plausible ranges are actually invalid." }, { "question": "If K=3 lists each have n=1000 elements, what is the time complexity?", "options": ["O(3000 log 3000)", "O(3000 log 3)", "O(1000 log 3)", "O(3000² × 3)"], "answer": 1, "explanation": "Total elements N = K × n = 3000. Time is O(N log K) = O(3000 log 3) ≈ O(3000 × 1.58) ≈ 4,750 operations. Note the log is in K (number of lists), not N (total elements) — this is why the heap approach scales so well even for many long lists." } ] }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Sliding Window on Sorted Array (Alternative Approach)", "content": "LeetCode 632 can also be solved with a **sliding window on the merged sorted array**:\\n\\n1. Flatten all elements into \`(value, list_index)\` pairs and sort by value — O(N log N).\\n2. Use a sliding window with a frequency map counting how many distinct lists are in the window.\\n3. Expand the right pointer; shrink the left pointer whenever all K lists are represented.\\n4. Track the smallest valid window encountered.\\n\\nThis runs in **O(N log N)** — dominated by the sort. The heap approach is **O(N log K)**, which is faster when K << N (few lists, each very long).\\n\\nThe sliding window formulation makes it clearer why the problem name includes 'smallest range': you're literally finding the minimum-length subarray of the sorted merged sequence that contains at least one element from each of the K source lists." }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Keep exactly one representative per list in the min-heap — the heap minimum is always the tightest possible lower bound for the current window.", "Track current_max separately: it is the window's upper bound, and it only ever grows because lists are sorted.", "Stop immediately when any list is exhausted — maintaining full coverage becomes impossible after that point.", "Time complexity is O(N log K), space is O(K). Both are determined by K (number of lists), not N (total elements).", "This problem is the natural synthesis of K-Way Merge and range optimization: the heap replaces the need to scan all K lists at every step." ] }
\`\`\``,
      starterCode: `import heapq


def find_smallest_range(lists):
    """
    Find smallest range covering at least one element from each list.
    
    Args:
        lists: List of sorted arrays
    
    Returns:
        List [start, end] representing smallest range
    
    Example:
        >>> find_smallest_range([[1, 5, 8], [4, 12], [7, 8, 10]])
        [4, 7]
        >>> find_smallest_range([[1, 2, 3], [1, 2, 3], [1, 2, 3]])
        [1, 1]
    """
    # TODO: Use min-heap to track range covering all lists
    # Hint: Track current max, range is [heap_min, current_max]
    pass


# ─── Test Cases ───

# Standard case
print(find_smallest_range([[1, 5, 8], [4, 12], [7, 8, 10]]))
# Expected: [4, 7]

# All same elements
print(find_smallest_range([[1, 2, 3], [1, 2, 3], [1, 2, 3]]))
# Expected: [1, 1]

# Two lists
print(find_smallest_range([[1, 10], [5, 15]]))
# Expected: [5, 10]

# Single element lists
print(find_smallest_range([[1], [2], [3]]))
# Expected: [1, 3]

# Overlapping ranges
print(find_smallest_range([[1, 3, 5], [2, 4, 6], [3, 5, 7]]))
# Expected: [3, 3]
`,
      solutionCode: `import heapq


def find_smallest_range(lists):
    """
    Find smallest range covering at least one element from each list.
    
    Time Complexity: O(n log m) — n total elements, heap ops O(log m)
    Space Complexity: O(m) — heap stores at most m elements
    """
    min_heap = []
    current_max = float('-inf')
    
    # Push first element from each list
    for i, arr in enumerate(lists):
        heapq.heappush(min_heap, (arr[0], i, 0))
        current_max = max(current_max, arr[0])
    
    # Track smallest range
    range_start, range_end = 0, float('inf')
    
    while len(min_heap) == len(lists):
        # Current range is [heap_min, current_max]
        current_min, list_idx, elem_idx = heapq.heappop(min_heap)
        
        # Update smallest range if this is better
        if current_max - current_min < range_end - range_start:
            range_start = current_min
            range_end = current_max
        
        # Push next element from same list
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(min_heap, (next_val, list_idx, elem_idx + 1))
            current_max = max(current_max, next_val)
        else:
            # This list is exhausted, can't form valid range anymore
            break
    
    return [range_start, range_end]


# ─── Test Cases ───
print(find_smallest_range([[1, 5, 8], [4, 12], [7, 8, 10]]))
# Expected: [4, 7]

print(find_smallest_range([[1, 2, 3], [1, 2, 3], [1, 2, 3]]))
# Expected: [1, 1]

print(find_smallest_range([[1, 10], [5, 15]]))
# Expected: [5, 10]

print(find_smallest_range([[1], [2], [3]]))
# Expected: [1, 3]

print(find_smallest_range([[1, 3, 5], [2, 4, 6], [3, 5, 7]]))
# Expected: [3, 3]
`,
    },
    {
      id: "k-way-merge-checkpoint",
      slug: "k-way-merge-checkpoint",
      title: "Module Checkpoint: K-Way Merge",
      content: `## Module Checkpoint: K-Way Merge

<!-- voice:checkpoint_intro -->

You've reached the end of the K-Way Merge module. Before moving on, let's lock in the pattern and stress-test your understanding.

\`\`\`concept
{ "title": "The K-Way Merge Mental Model", "variant": "mental-model", "content": "You have K sorted lists and need a globally sorted output. The insight: the next element in the merged result must be the smallest among the K current list-heads — never anything else. A min-heap tracks exactly those K candidates, giving you the minimum in O(log K) instead of scanning all K heads in O(K). Every pop is one output element; every push keeps the heap full. Total cost: O(N log K) time, O(K) space." }
\`\`\`

### What You Covered in This Module

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "A min-heap of size K is the core data structure — always holds exactly one element per active list", "Heap entries must store (value, list_index, element_index) so you know where to pull the next element from", "Time complexity is O(N log K) — N total elements, each requiring one O(log K) heap operation", "Space complexity is O(K) — heap never grows beyond K entries regardless of list lengths", "Early termination (Kth-smallest) exits after K pops — no need to merge everything", "Smallest Range: the heap tracks the current minimum; a running max variable tracks the current maximum, giving [heap_top, running_max] as the live window" ] }
\`\`\`

### Algorithm Replay — Merging 3 Sorted Lists

Watch the heap evolve as the merge proceeds on a concrete example.

\`\`\`algoviz
{ "title": "K-Way Merge: Step-by-Step Heap Trace", "type": "array", "data": [1, 3, 5, 2, 6, 9, 4, 7, 8], "frames": [ { "highlight": [0, 3, 6], "label": "Init: push head of each list → heap = [(1,L0), (2,L1), (4,L2)]", "stats": { "heap_min": 1, "output": "[]" } }, { "highlight": [0], "label": "Pop (1, L0) → output [1]. Push next from L0: (3, L0). Heap = [(2,L1),(3,L0),(4,L2)]", "stats": { "heap_min": 2, "output": "[1]" } }, { "highlight": [3], "label": "Pop (2, L1) → output [1,2]. Push next from L1: (6, L1). Heap = [(3,L0),(4,L2),(6,L1)]", "stats": { "heap_min": 3, "output": "[1,2]" } }, { "highlight": [1], "label": "Pop (3, L0) → output [1,2,3]. Push next from L0: (5, L0). Heap = [(4,L2),(5,L0),(6,L1)]", "stats": { "heap_min": 4, "output": "[1,2,3]" } }, { "highlight": [6], "label": "Pop (4, L2) → output [1,2,3,4]. Push next from L2: (7, L2). Heap = [(5,L0),(6,L1),(7,L2)]", "stats": { "heap_min": 5, "output": "[1,2,3,4]" } }, { "highlight": [2], "label": "Pop (5, L0) → output [1,2,3,4,5]. L0 exhausted — no push. Heap = [(6,L1),(7,L2)]", "stats": { "heap_min": 6, "output": "[1,2,3,4,5]" } }, { "highlight": [4, 7, 8], "label": "Continue popping: 6,7,8,9 → final output [1,2,3,4,5,6,7,8,9]", "stats": { "heap_min": 6, "output": "[1,2,3,4,5,6,7,8,9]" } } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why O(N log K) and not O(N log N)?", "content": "Each of the N elements is pushed and popped from the heap exactly once. The heap size is bounded by K — not N — because we only ever hold one element per list. So each push/pop costs O(log K), giving O(N log K) total. For K << N (e.g. merging 8 lists of 10,000 elements each), this is dramatically faster than sorting all N elements together at O(N log N)." }
\`\`\`

### Complexity Quick Reference

| Problem | Time | Space | Key trick |
|---|---|---|---|
| Merge K Sorted Lists | O(N log K) | O(K) | Store \`ListNode\` pointer in heap |
| Kth Smallest in M Sorted Lists | O(K log M) | O(M) | Stop after K pops |
| Smallest Range Covering K Lists | O(N log K) | O(K) | Track running max alongside heap min |

### Checkpoint Quiz

\`\`\`quiz
{ "title": "K-Way Merge — Verify Your Understanding", "questions": [ { "question": "What is the time complexity of merging K sorted lists with N total elements using a min-heap?", "options": ["O(N log N)", "O(N log K)", "O(NK)", "O(K log N)"], "answer": 1, "explanation": "Each of the N elements is pushed/popped once. The heap holds at most K entries at any time, so each operation costs O(log K). Total: O(N log K). O(N log N) would apply if you ignored the sorted structure and sorted all elements from scratch." }, { "question": "What three pieces of information must each heap entry store for the merge to work correctly?", "options": ["Just the value", "Value and which list it came from", "Value, list index, and element index (or pointer)", "Just the list index"], "answer": 2, "explanation": "After popping the minimum, you must know (1) the value to append to output, (2) which list it came from, and (3) the position within that list so you can push the next element. Without the list index and position, you cannot advance the pointer." }, { "question": "You are merging K=4 lists. List sizes are 100, 200, 50, and 150 elements (N=500 total). At any moment, what is the maximum number of elements in the heap?", "options": ["500", "50", "4", "Depends on list sizes"], "answer": 2, "explanation": "The heap holds exactly one element per non-exhausted list. With K=4 lists, the heap has at most 4 elements — always O(K), regardless of individual list lengths." }, { "question": "For finding the Kth smallest element across M sorted lists, why can you stop after K heap pops instead of merging everything?", "options": ["Because the heap is sorted by insertion order", "Because K pops yield exactly K globally-ordered elements, and the Kth pop is the Kth smallest", "Because all lists have equal length", "Because the lists are already merged after K pops"], "answer": 1, "explanation": "Each pop produces the next element in globally sorted order. After K pops you have seen exactly the K smallest elements across all lists — the Kth pop gives you the Kth smallest. You never need to process the remaining N-K elements." }, { "question": "In the Smallest Range problem, the current range at each step is defined as:", "options": ["[min element in output, max element in output]", "[heap minimum, running maximum of all elements entered into the heap]", "[first element of first list, last element of last list]", "[heap minimum, heap maximum]"], "answer": 1, "explanation": "The heap always contains exactly one element from each list. Its top is the current minimum across all lists. A separate variable tracks the maximum value ever pushed into the heap — that maximum, together with the heap top, defines the tightest window guaranteed to contain at least one element from every list. You shrink the range by popping the min and advancing that list." } ] }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: When to Use K-Way Merge vs. Sort-Everything", "content": "**Use K-Way Merge when:**\\n- Input arrives as K already-sorted sequences (files, database partitions, list nodes)\\n- K is much smaller than N — the log K factor gives a real speedup\\n- You need a streaming or lazy output (e.g., stop after the Kth element)\\n- Memory is constrained — O(K) heap is far cheaper than loading all N elements\\n\\n**Stick with sort-everything when:**\\n- The inputs are unsorted to begin with (you gain nothing from the heap)\\n- K ≈ N (the log K advantage disappears)\\n- You need a one-time batch result and simplicity matters more than constant-factor performance\\n\\n**Real-world applications of K-Way Merge:**\\n- External merge sort (merging sorted disk chunks during a database sort)\\n- MapReduce reduce phase (merging sorted output from K mappers)\\n- Log aggregation (combining timestamped logs from K servers into one chronological stream)\\n- Distributed database query results (merging sorted result shards)" }
\`\`\`

<!-- voice:checkpoint_summary -->

\`\`\`callout
{ "type": "success", "title": "Voice Summary — Your Coach Will Ask You To:", "content": "1. Walk through the K-Way Merge algorithm step by step (init heap → pop → push next → repeat)\\\\n2. Explain what information each heap entry must carry, and why\\\\n3. Describe how you would find the Kth smallest without fully merging all lists\\\\n4. Explain the Smallest Range approach: what the heap and running-max variable each track, and why popping the heap minimum shrinks the window" }
\`\`\`

**You've mastered the K-Way Merge pattern.** The heap is your constant-size coordinator across K sorted sources — a trick that appears in external sorting, distributed systems, and a whole class of interview problems.`,
    },
  ],
};
