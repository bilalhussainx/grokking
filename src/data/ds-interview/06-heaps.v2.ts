import { Module } from "../types";

export const heapsModule: Module = {
  id: "ds-heaps",
  title: "Heaps",
  description: "Build heaps from scratch, then solve Top K, Merge K, Median Stream, and Task Scheduler problems.",
  lessons: [
    {
      id: "heaps-intro",
      slug: "intro-to-heaps",
      title: "Intro to Heaps",
      content: `## Intro to Heaps

A heap is a complete binary tree that satisfies the **heap property**. It is the go-to data structure when you need fast access to the minimum or maximum element.

### Min-Heap vs Max-Heap

- **Min-heap**: Every parent is less than or equal to its children. The root is the smallest element.
- **Max-heap**: Every parent is greater than or equal to its children. The root is the largest element.

### Array Representation

A heap is stored as an array with no gaps (complete binary tree). For a node at index \`i\`:
- **Left child**: \`2*i + 1\`
- **Right child**: \`2*i + 2\`
- **Parent**: \`(i - 1) // 2\`

This eliminates the need for pointers, making heaps memory-efficient and cache-friendly.

\`\`\`
Min-heap array: [1, 3, 5, 7, 9, 8]

Tree view:
        1
       / \\
      3   5
     / \\ /
    7  9 8
\`\`\`

### Key Operations and Complexity

| Operation | Time |
|-----------|------|
| Find min/max | O(1) |
| Insert | O(log n) |
| Extract min/max | O(log n) |
| Heapify (build) | O(n) |

### Python's heapq Module

Python provides \`heapq\` for min-heaps:
\`\`\`python
import heapq
heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 1)
smallest = heapq.heappop(heap)  # 1
\`\`\`

For a max-heap, negate values: push \`-val\`, pop and negate.

### When to Use a Heap

- Finding the kth largest/smallest element
- Continuously tracking the min/max of a changing dataset
- Merging sorted sequences
- Priority scheduling (task scheduler, CPU scheduling)
- Dijkstra's shortest path algorithm

### Heap vs Sorted Array

Why not just keep a sorted array? Insertion into a sorted array is O(n) due to shifting. A heap gives O(log n) insertion while still providing O(1) access to the extreme element.

In this exercise, practice using Python's heapq to solve basic problems: find the kth largest element and sort an array using a heap.`,
      starterCode: `import heapq


def kth_largest(nums: list[int], k: int) -> int:
    """
    Find the kth largest element in an unsorted array.

    Approach: Use a min-heap of size k. The root is the kth largest.
    Time: O(n log k), Space: O(k)
    """
    # TODO: Create a min-heap with the first k elements
    # TODO: For each remaining element, if it's larger than heap root,
    #       replace the root (heappushpop)
    # TODO: Return the heap root
    pass


def heap_sort(nums: list[int]) -> list[int]:
    """
    Sort an array using a heap.

    Approach: Push all elements into a min-heap, then pop them out.
    Time: O(n log n), Space: O(n)
    """
    # TODO: Build a heap from all elements
    # TODO: Pop elements one by one into result list
    pass


def k_closest_to_origin(points: list[list[int]], k: int) -> list[list[int]]:
    """
    Find the k closest points to the origin (0, 0).
    Distance = x^2 + y^2 (no need for sqrt).

    Approach: Max-heap of size k (negate distances for max-heap behavior).
    Time: O(n log k), Space: O(k)
    """
    # TODO: Use a max-heap of size k (negate distances)
    # TODO: For each point, compute distance
    # TODO: If heap has < k elements, push
    # TODO: Else if distance < -heap[0], replace root
    # TODO: Return the points in the heap
    pass


# Test cases
print(kth_largest([3, 2, 1, 5, 6, 4], 2))        # 5
print(kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4))  # 4

print(heap_sort([5, 3, 8, 1, 2]))  # [1, 2, 3, 5, 8]
print(heap_sort([1]))               # [1]

print(k_closest_to_origin([[1,3],[-2,2]], 1))         # [[-2,2]]
print(k_closest_to_origin([[3,3],[5,-1],[-2,4]], 2))  # [[3,3],[-2,4]] (order may vary)
`,
      solutionCode: `import heapq


def kth_largest(nums: list[int], k: int) -> int:
    """
    Find the kth largest element in an unsorted array.

    Approach: Use a min-heap of size k. The root is the kth largest.
    Time: O(n log k), Space: O(k)
    """
    # Build a min-heap with the first k elements
    heap = nums[:k]
    heapq.heapify(heap)

    # For remaining elements, keep only the k largest
    for num in nums[k:]:
        if num > heap[0]:
            heapq.heapreplace(heap, num)

    return heap[0]


def heap_sort(nums: list[int]) -> list[int]:
    """
    Sort an array using a heap.

    Approach: Push all elements into a min-heap, then pop them out.
    Time: O(n log n), Space: O(n)
    """
    heap = nums[:]
    heapq.heapify(heap)
    return [heapq.heappop(heap) for _ in range(len(heap))]


def k_closest_to_origin(points: list[list[int]], k: int) -> list[list[int]]:
    """
    Find the k closest points to the origin (0, 0).
    Distance = x^2 + y^2 (no need for sqrt).

    Approach: Max-heap of size k (negate distances for max-heap behavior).
    Time: O(n log k), Space: O(k)
    """
    max_heap = []  # stores (-distance, point)

    for point in points:
        dist = point[0] ** 2 + point[1] ** 2
        if len(max_heap) < k:
            heapq.heappush(max_heap, (-dist, point))
        elif -dist > max_heap[0][0]:
            heapq.heapreplace(max_heap, (-dist, point))

    return [point for _, point in max_heap]


# Test cases
print(kth_largest([3, 2, 1, 5, 6, 4], 2))        # 5
print(kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4))  # 4

print(heap_sort([5, 3, 8, 1, 2]))  # [1, 2, 3, 5, 8]
print(heap_sort([1]))               # [1]

print(k_closest_to_origin([[1,3],[-2,2]], 1))         # [[-2,2]]
print(k_closest_to_origin([[3,3],[5,-1],[-2,4]], 2))  # [[3,3],[-2,4]] (order may vary)
`,
    },
    {
      id: "heaps-implementation",
      slug: "implementing-min-max-heap",
      title: "Implementing Min/Max Heap",
      content: `## Implementing Min/Max Heap

Building a heap from scratch is a classic interview exercise. It tests your understanding of the heap property, array-based tree representation, and the two key operations: sift up and sift down.

### The Two Core Operations

**Sift Up (Bubble Up)**: Used after insertion. The new element is placed at the end of the array, then repeatedly swapped with its parent until the heap property is restored.

\`\`\`
Insert 2 into [1, 5, 3, 7, 9]:
[1, 5, 3, 7, 9, 2]  → swap 2 with parent 3
[1, 5, 2, 7, 9, 3]  → swap 2 with parent 5? No, 2 > 1 so we check parent
[1, 2, 3, 7, 9, 5]  → wait, 2's parent is 5 at index 1
Actually: index 5's parent is index 2 (value 3). 2 < 3, swap.
Then index 2's parent is index 0 (value 1). 2 > 1, stop.
\`\`\`

**Sift Down (Bubble Down)**: Used after extraction. The root is removed, the last element takes its place, then it is repeatedly swapped with its smallest child (min-heap) until the heap property is restored.

### Building a Heap: O(n) Heapify

A common misconception is that building a heap by inserting n elements takes O(n log n). The **heapify** approach is faster: start from the last non-leaf node and sift down each node. This is O(n) because most nodes are near the bottom and sift down very little.

The last non-leaf node is at index \`n // 2 - 1\`. Iterate backwards from there to index 0, calling sift_down on each.

### Why O(n)?

Leaf nodes (half the array) need 0 swaps. Nodes one level up need at most 1 swap. Nodes two levels up need at most 2 swaps. The sum converges to O(n), not O(n log n).

### Step-by-Step Construction

\`\`\`python
class MinHeap:
    def __init__(self):
        self.data = []

    def insert(self, val):
        self.data.append(val)
        self._sift_up(len(self.data) - 1)

    def extract_min(self):
        # Swap root with last, pop last, sift down new root
        ...
\`\`\`

### Interview Tips

- Always implement the helper \`_sift_up\` and \`_sift_down\` as separate methods — it makes the code clean and testable.
- For sift_down in a min-heap, compare with the **smaller** child. For max-heap, the **larger** child.
- Edge case: when a node has only a left child (no right child), do not access the right child index.

Build a complete MinHeap class from scratch.`,
      starterCode: `class MinHeap:
    """
    A min-heap implementation using an array.
    The smallest element is always at the root (index 0).
    """

    def __init__(self):
        self.data = []

    def _parent(self, i: int) -> int:
        return (i - 1) // 2

    def _left(self, i: int) -> int:
        return 2 * i + 1

    def _right(self, i: int) -> int:
        return 2 * i + 2

    def _sift_up(self, i: int) -> None:
        """Move element at index i up until heap property is restored."""
        # TODO: While i > 0 and data[i] < data[parent(i)]:
        #   swap data[i] with data[parent(i)]
        #   move i to parent
        pass

    def _sift_down(self, i: int) -> None:
        """Move element at index i down until heap property is restored."""
        # TODO: Find the smallest among node and its children
        # TODO: If smallest is not the node, swap and continue
        # TODO: Handle case where right child may not exist
        pass

    def insert(self, val: int) -> None:
        """Insert a value into the heap. Time: O(log n)."""
        # TODO: Append to end, then sift up
        pass

    def extract_min(self) -> int:
        """Remove and return the minimum element. Time: O(log n)."""
        # TODO: Save root value
        # TODO: Move last element to root
        # TODO: Sift down
        # TODO: Return saved value
        pass

    def peek(self) -> int:
        """Return the minimum element without removing. Time: O(1)."""
        return self.data[0]

    def size(self) -> int:
        return len(self.data)

    def heapify(self, arr: list[int]) -> None:
        """Build a heap from an array in O(n) time."""
        # TODO: Set self.data = arr
        # TODO: Start from last non-leaf node, sift down each
        pass


# Test cases
h = MinHeap()
for val in [5, 3, 8, 1, 2, 7]:
    h.insert(val)

print(h.extract_min())  # 1
print(h.extract_min())  # 2
print(h.extract_min())  # 3
print(h.peek())         # 5
print(h.size())         # 3

# Test heapify
h2 = MinHeap()
h2.heapify([9, 5, 6, 2, 3])
print(h2.extract_min())  # 2
print(h2.extract_min())  # 3
print(h2.extract_min())  # 5
`,
      solutionCode: `class MinHeap:
    """
    A min-heap implementation using an array.
    The smallest element is always at the root (index 0).
    """

    def __init__(self):
        self.data = []

    def _parent(self, i: int) -> int:
        return (i - 1) // 2

    def _left(self, i: int) -> int:
        return 2 * i + 1

    def _right(self, i: int) -> int:
        return 2 * i + 2

    def _sift_up(self, i: int) -> None:
        """Move element at index i up until heap property is restored."""
        while i > 0 and self.data[i] < self.data[self._parent(i)]:
            pi = self._parent(i)
            self.data[i], self.data[pi] = self.data[pi], self.data[i]
            i = pi

    def _sift_down(self, i: int) -> None:
        """Move element at index i down until heap property is restored."""
        n = len(self.data)
        while True:
            smallest = i
            left = self._left(i)
            right = self._right(i)

            if left < n and self.data[left] < self.data[smallest]:
                smallest = left
            if right < n and self.data[right] < self.data[smallest]:
                smallest = right

            if smallest == i:
                break
            self.data[i], self.data[smallest] = self.data[smallest], self.data[i]
            i = smallest

    def insert(self, val: int) -> None:
        """Insert a value into the heap. Time: O(log n)."""
        self.data.append(val)
        self._sift_up(len(self.data) - 1)

    def extract_min(self) -> int:
        """Remove and return the minimum element. Time: O(log n)."""
        if len(self.data) == 1:
            return self.data.pop()
        root = self.data[0]
        self.data[0] = self.data.pop()  # Move last to root
        self._sift_down(0)
        return root

    def peek(self) -> int:
        """Return the minimum element without removing. Time: O(1)."""
        return self.data[0]

    def size(self) -> int:
        return len(self.data)

    def heapify(self, arr: list[int]) -> None:
        """Build a heap from an array in O(n) time."""
        self.data = arr
        # Start from last non-leaf node and sift down
        n = len(self.data)
        for i in range(n // 2 - 1, -1, -1):
            self._sift_down(i)


# Test cases
h = MinHeap()
for val in [5, 3, 8, 1, 2, 7]:
    h.insert(val)

print(h.extract_min())  # 1
print(h.extract_min())  # 2
print(h.extract_min())  # 3
print(h.peek())         # 5
print(h.size())         # 3

# Test heapify
h2 = MinHeap()
h2.heapify([9, 5, 6, 2, 3])
print(h2.extract_min())  # 2
print(h2.extract_min())  # 3
print(h2.extract_min())  # 5
`,
    },
    {
      id: "heaps-top-k",
      slug: "top-k-elements",
      title: "Top K Elements",
      content: `## Top K Elements

"Find the K largest/smallest/most frequent" is one of the most common heap patterns in coding interviews. The key insight is that you do not need to sort the entire collection — a heap of size K is enough.

### The Pattern: Min-Heap of Size K

To find the K largest elements:
1. Build a min-heap of the first K elements.
2. For each remaining element, compare with the heap's root (the smallest of the K largest so far).
3. If the new element is larger, replace the root and sift down.
4. At the end, the heap contains the K largest elements.

**Time**: O(n log k) — much better than O(n log n) sorting when k is small.
**Space**: O(k).

### Why Min-Heap for K Largest?

It sounds counterintuitive, but the min-heap acts as a gatekeeper. Its root is the threshold — the smallest element that qualifies as "top K." Any element smaller than the root cannot be in the top K, so we skip it. Any element larger replaces the root.

### Top K Frequent Elements

A common variant: given an array, return the k most frequent elements.

1. Count frequencies using a hash map — O(n).
2. Use a min-heap of size k on the frequencies — O(n log k).
3. Alternatively, use **bucket sort**: create buckets indexed by frequency, then scan from highest frequency — O(n).

### Kth Largest in a Stream

Maintain a min-heap of size k. For each new element:
- If heap size < k, push the element.
- Else if element > heap root, replace the root.
- The heap root is always the kth largest.

This gives O(log k) per insertion and O(1) for querying the kth largest.

### Interview Tips

- If the problem says "top K" or "K most/least," think heap immediately.
- For K largest, use min-heap. For K smallest, use max-heap. This is the opposite of what you might expect.
- The bucket sort approach for "top K frequent" is O(n) and avoids the heap entirely — know both approaches.

Implement top K frequent elements and a Kth-largest stream class.`,
      starterCode: `import heapq
from collections import Counter


def top_k_frequent(nums: list[int], k: int) -> list[int]:
    """
    Return the k most frequent elements.

    Approach: Count frequencies, then use a min-heap of size k.
    Time: O(n log k), Space: O(n)
    """
    # TODO: Count frequencies using Counter
    # TODO: Use a min-heap of size k on (frequency, element) pairs
    # TODO: Return the elements from the heap
    pass


def top_k_frequent_bucket(nums: list[int], k: int) -> list[int]:
    """
    Return the k most frequent elements using bucket sort.

    Approach: Bucket sort by frequency — O(n) time.
    """
    # TODO: Count frequencies
    # TODO: Create buckets where index = frequency
    # TODO: Scan from highest frequency bucket, collect k elements
    pass


class KthLargest:
    """
    Design a class to find the kth largest element in a stream.
    """

    def __init__(self, k: int, nums: list[int]):
        """Initialize with k and an initial list of numbers."""
        # TODO: Build a min-heap of size k from nums
        pass

    def add(self, val: int) -> int:
        """Add a value and return the kth largest element."""
        # TODO: If heap size < k, push val
        # TODO: Else if val > heap root, replace root
        # TODO: Return heap root (the kth largest)
        pass


# Test cases
print(top_k_frequent([1,1,1,2,2,3], 2))      # [1, 2]
print(top_k_frequent([1], 1))                  # [1]

print(top_k_frequent_bucket([1,1,1,2,2,3], 2))  # [1, 2]

kth = KthLargest(3, [4, 5, 8, 2])
print(kth.add(3))   # 4
print(kth.add(5))   # 5
print(kth.add(10))  # 5
print(kth.add(9))   # 8
print(kth.add(4))   # 8
`,
      solutionCode: `import heapq
from collections import Counter


def top_k_frequent(nums: list[int], k: int) -> list[int]:
    """
    Return the k most frequent elements.

    Approach: Count frequencies, then use a min-heap of size k.
    Time: O(n log k), Space: O(n)
    """
    freq = Counter(nums)
    # Min-heap of size k on (frequency, element)
    heap = []
    for num, count in freq.items():
        if len(heap) < k:
            heapq.heappush(heap, (count, num))
        elif count > heap[0][0]:
            heapq.heapreplace(heap, (count, num))

    return [num for _, num in heap]


def top_k_frequent_bucket(nums: list[int], k: int) -> list[int]:
    """
    Return the k most frequent elements using bucket sort.

    Approach: Bucket sort by frequency — O(n) time.
    """
    freq = Counter(nums)
    # Buckets indexed by frequency (max frequency is len(nums))
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, count in freq.items():
        buckets[count].append(num)

    result = []
    for i in range(len(buckets) - 1, -1, -1):
        for num in buckets[i]:
            result.append(num)
            if len(result) == k:
                return result
    return result


class KthLargest:
    """
    Design a class to find the kth largest element in a stream.
    """

    def __init__(self, k: int, nums: list[int]):
        """Initialize with k and an initial list of numbers."""
        self.k = k
        self.heap = []
        for num in nums:
            self.add(num)

    def add(self, val: int) -> int:
        """Add a value and return the kth largest element."""
        if len(self.heap) < self.k:
            heapq.heappush(self.heap, val)
        elif val > self.heap[0]:
            heapq.heapreplace(self.heap, val)
        return self.heap[0]


# Test cases
print(top_k_frequent([1,1,1,2,2,3], 2))      # [1, 2]
print(top_k_frequent([1], 1))                  # [1]

print(top_k_frequent_bucket([1,1,1,2,2,3], 2))  # [1, 2]

kth = KthLargest(3, [4, 5, 8, 2])
print(kth.add(3))   # 4
print(kth.add(5))   # 5
print(kth.add(10))  # 5
print(kth.add(9))   # 8
print(kth.add(4))   # 8
`,
    },
    {
      id: "heaps-merge-k",
      slug: "merge-k-sorted-lists",
      title: "Merge K Sorted Lists",
      content: `## Merge K Sorted Lists

Merging K sorted lists into one sorted list is a classic heap application. It appears in database systems (merge phase of external sort), distributed systems (merging sorted results from K servers), and coding interviews.

### The Problem

Given K sorted linked lists (or arrays), merge them into one sorted list.

### Approach 1: Brute Force

Collect all elements, sort them. Time: O(N log N) where N is the total number of elements. This ignores the fact that lists are already sorted.

### Approach 2: Merge Two at a Time

Repeatedly merge two lists using the standard merge algorithm. This works but can be slow: O(N * K) in the worst case if done naively.

### Approach 3: Min-Heap (Optimal)

Use a min-heap of size K:
1. Push the first element from each list into the heap (along with list index and position).
2. Pop the smallest element from the heap — this is the next element in the merged output.
3. Push the next element from the same list that the popped element came from.
4. Repeat until the heap is empty.

**Time**: O(N log K) — each of the N elements is pushed and popped from a heap of size K.
**Space**: O(K) for the heap.

### Why O(N log K)?

Each heap operation (push/pop) is O(log K) because the heap never exceeds size K. We perform N push/pop pairs, so the total is O(N log K). When K is much smaller than N, this is significantly faster than O(N log N).

### Implementation with Arrays

For simplicity in interviews, the problem is often presented with arrays instead of linked lists. The approach is identical — track which array and which index each element came from.

### Comparison

| Approach | Time | Space |
|----------|------|-------|
| Sort all | O(N log N) | O(N) |
| Merge pairs | O(N * K) | O(1) |
| Min-heap | O(N log K) | O(K) |

### Interview Tips

- Always mention the heap approach — it is what interviewers expect.
- In Python, when pushing tuples to a heap, ensure the comparison works. If values tie, the second element must be comparable (use an index as tiebreaker).
- This pattern extends to "merge K sorted streams" — any problem where you combine multiple sorted sources.

Implement merge K sorted arrays using a heap.`,
      starterCode: `import heapq


def merge_k_sorted(lists: list[list[int]]) -> list[int]:
    """
    Merge K sorted arrays into one sorted array.

    Approach: Min-heap of size K.
    Time: O(N log K), Space: O(K) where N = total elements
    """
    # TODO: Initialize a min-heap
    # TODO: Push the first element of each non-empty list
    #       as (value, list_index, element_index)
    # TODO: Pop smallest, add to result
    # TODO: Push next element from the same list
    # TODO: Repeat until heap is empty
    pass


def merge_k_sorted_lists_linked(lists):
    """
    Merge K sorted linked lists. Returns the head of merged list.
    Uses a min-heap.
    """
    # TODO: Push (node.val, index, node) for each list head
    # TODO: Pop smallest, link to result
    # TODO: Push node.next if it exists
    pass


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def to_list(head):
    """Convert linked list to Python list for display."""
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result


def from_list(arr):
    """Convert Python list to linked list."""
    dummy = ListNode(0)
    current = dummy
    for val in arr:
        current.next = ListNode(val)
        current = current.next
    return dummy.next


# Test cases — arrays
print(merge_k_sorted([[1, 4, 5], [1, 3, 4], [2, 6]]))
# [1, 1, 2, 3, 4, 4, 5, 6]

print(merge_k_sorted([[1, 2], [3, 4], [0, 5]]))
# [0, 1, 2, 3, 4, 5]

print(merge_k_sorted([[], [1], [2, 3]]))
# [1, 2, 3]

# Test cases — linked lists
ll1 = from_list([1, 4, 5])
ll2 = from_list([1, 3, 4])
ll3 = from_list([2, 6])
merged = merge_k_sorted_lists_linked([ll1, ll2, ll3])
print(to_list(merged))  # [1, 1, 2, 3, 4, 4, 5, 6]
`,
      solutionCode: `import heapq


def merge_k_sorted(lists: list[list[int]]) -> list[int]:
    """
    Merge K sorted arrays into one sorted array.

    Approach: Min-heap of size K.
    Time: O(N log K), Space: O(K) where N = total elements
    """
    heap = []
    # Push first element from each non-empty list
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))

    result = []
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        result.append(val)
        # Push next element from the same list
        next_idx = elem_idx + 1
        if next_idx < len(lists[list_idx]):
            heapq.heappush(heap, (lists[list_idx][next_idx], list_idx, next_idx))

    return result


def merge_k_sorted_lists_linked(lists):
    """
    Merge K sorted linked lists. Returns the head of merged list.
    Uses a min-heap.
    """
    heap = []
    # Push head of each non-empty list
    for i, head in enumerate(lists):
        if head:
            heapq.heappush(heap, (head.val, i, head))

    dummy = ListNode(0)
    current = dummy

    while heap:
        val, idx, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        if node.next:
            heapq.heappush(heap, (node.next.val, idx, node.next))

    return dummy.next


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

    def __lt__(self, other):
        return self.val < other.val


def to_list(head):
    """Convert linked list to Python list for display."""
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result


def from_list(arr):
    """Convert Python list to linked list."""
    dummy = ListNode(0)
    current = dummy
    for val in arr:
        current.next = ListNode(val)
        current = current.next
    return dummy.next


# Test cases — arrays
print(merge_k_sorted([[1, 4, 5], [1, 3, 4], [2, 6]]))
# [1, 1, 2, 3, 4, 4, 5, 6]

print(merge_k_sorted([[1, 2], [3, 4], [0, 5]]))
# [0, 1, 2, 3, 4, 5]

print(merge_k_sorted([[], [1], [2, 3]]))
# [1, 2, 3]

# Test cases — linked lists
ll1 = from_list([1, 4, 5])
ll2 = from_list([1, 3, 4])
ll3 = from_list([2, 6])
merged = merge_k_sorted_lists_linked([ll1, ll2, ll3])
print(to_list(merged))  # [1, 1, 2, 3, 4, 4, 5, 6]
`,
    },
    {
      id: "heaps-median-stream",
      slug: "median-of-data-stream",
      title: "Median of Data Stream",
      content: `## Median of Data Stream

Finding the median of a continuously growing stream of numbers is one of the most elegant heap applications. It combines two heaps to maintain a running median in O(log n) per insertion.

### The Problem

Design a data structure that supports:
- \`add_num(num)\` — add a number from the stream.
- \`find_median()\` — return the current median.

### The Two-Heap Approach

Maintain two heaps that split the data in half:
- **Max-heap** (left half): stores the smaller half of numbers. The root is the largest of the small numbers.
- **Min-heap** (right half): stores the larger half of numbers. The root is the smallest of the large numbers.

The median is either:
- The root of the larger heap (odd total count), or
- The average of both roots (even total count).

### Balancing Rules

After each insertion, ensure the heaps stay balanced:
1. The max-heap can have at most 1 more element than the min-heap.
2. Every element in the max-heap must be less than or equal to every element in the min-heap.

**Insertion algorithm:**
1. Add the number to the max-heap (left half).
2. Move the max-heap root to the min-heap (ensures ordering — the largest of the left half moves right).
3. If the min-heap is now larger than the max-heap, move the min-heap root back to the max-heap (rebalance sizes).

This three-step process guarantees both invariants after every insertion.

### Python Implementation Detail

Python's \`heapq\` only supports min-heaps. For the max-heap, negate the values: push \`-val\` and negate when popping.

### Complexity

| Operation | Time | Space |
|-----------|------|-------|
| add_num | O(log n) | O(n) total |
| find_median | O(1) | - |

### Alternative Approaches

- **Sorted list with bisect**: O(n) insertion due to shifting, O(1) median.
- **Self-balancing BST**: O(log n) for both, but more complex to implement.
- **Two heaps**: O(log n) insert, O(1) median — the best practical tradeoff.

### Interview Tips

- Draw the two heaps side by side during your explanation. Show how numbers flow from left to right.
- The "push to one, move root to other, rebalance" pattern is clean and hard to get wrong.
- Be careful with the even/odd logic when computing the median.

Implement the MedianFinder class.`,
      starterCode: `import heapq


class MedianFinder:
    """
    Find the median from a data stream.

    Two heaps:
    - max_heap (left half): stores negated values for max-heap behavior
    - min_heap (right half): standard min-heap
    """

    def __init__(self):
        # TODO: Initialize two heaps
        # max_heap stores negated values (Python only has min-heap)
        # min_heap stores values as-is
        pass

    def add_num(self, num: int) -> None:
        """
        Add a number to the data structure.

        Steps:
        1. Push to max_heap (left half)
        2. Move max_heap root to min_heap (ensure ordering)
        3. If min_heap is larger, move its root back to max_heap
        """
        # TODO: Push -num to max_heap
        # TODO: Pop max_heap root, push to min_heap (negate back)
        # TODO: If len(min_heap) > len(max_heap), rebalance
        pass

    def find_median(self) -> float:
        """
        Return the median of all elements added so far.
        If even count, return average of two middle elements.
        """
        # TODO: If max_heap is larger, return -max_heap[0]
        # TODO: Otherwise, return average of -max_heap[0] and min_heap[0]
        pass


# Test cases
mf = MedianFinder()
mf.add_num(1)
print(mf.find_median())  # 1.0

mf.add_num(2)
print(mf.find_median())  # 1.5

mf.add_num(3)
print(mf.find_median())  # 2.0

mf.add_num(4)
print(mf.find_median())  # 2.5

mf.add_num(5)
print(mf.find_median())  # 3.0

# Another sequence
mf2 = MedianFinder()
for num in [6, 10, 2, 6, 5, 0, 6, 3, 1, 0, 0]:
    mf2.add_num(num)
print(mf2.find_median())  # 3.0
`,
      solutionCode: `import heapq


class MedianFinder:
    """
    Find the median from a data stream.

    Two heaps:
    - max_heap (left half): stores negated values for max-heap behavior
    - min_heap (right half): standard min-heap
    """

    def __init__(self):
        self.max_heap = []  # Left half (negated values)
        self.min_heap = []  # Right half

    def add_num(self, num: int) -> None:
        """
        Add a number to the data structure.

        Steps:
        1. Push to max_heap (left half)
        2. Move max_heap root to min_heap (ensure ordering)
        3. If min_heap is larger, move its root back to max_heap
        """
        # Push to left half
        heapq.heappush(self.max_heap, -num)
        # Move the largest of left half to right half
        val = -heapq.heappop(self.max_heap)
        heapq.heappush(self.min_heap, val)
        # Rebalance: left half should be >= right half in size
        if len(self.min_heap) > len(self.max_heap):
            val = heapq.heappop(self.min_heap)
            heapq.heappush(self.max_heap, -val)

    def find_median(self) -> float:
        """
        Return the median of all elements added so far.
        If even count, return average of two middle elements.
        """
        if len(self.max_heap) > len(self.min_heap):
            return float(-self.max_heap[0])
        return (-self.max_heap[0] + self.min_heap[0]) / 2.0


# Test cases
mf = MedianFinder()
mf.add_num(1)
print(mf.find_median())  # 1.0

mf.add_num(2)
print(mf.find_median())  # 1.5

mf.add_num(3)
print(mf.find_median())  # 2.0

mf.add_num(4)
print(mf.find_median())  # 2.5

mf.add_num(5)
print(mf.find_median())  # 3.0

# Another sequence
mf2 = MedianFinder()
for num in [6, 10, 2, 6, 5, 0, 6, 3, 1, 0, 0]:
    mf2.add_num(num)
print(mf2.find_median())  # 3.0
`,
    },
    {
      id: "heaps-task-scheduler",
      slug: "task-scheduler",
      title: "Task Scheduler",
      content: `## Task Scheduler

The Task Scheduler problem is a popular medium-to-hard interview question that combines greedy strategy with heap usage. It asks: given a list of tasks and a cooldown period, find the minimum time to execute all tasks.

### The Problem

You have a list of tasks (represented as characters) and an integer \`n\` representing the cooldown between two identical tasks. During the cooldown, the CPU can execute different tasks or stay idle. What is the minimum number of intervals needed?

**Example**: tasks = ["A","A","A","B","B","B"], n = 2
Output: 8 (A -> B -> idle -> A -> B -> idle -> A -> B)

### Greedy Insight

Always execute the task with the highest remaining count first. This minimizes idle time because the most frequent task is the bottleneck — it forces the most cooldown periods.

### Approach: Max-Heap + Cooldown Queue

1. Count task frequencies.
2. Build a max-heap of frequencies (negate for Python min-heap).
3. Use a queue to track tasks in cooldown: \`(next_available_time, remaining_count)\`.
4. At each time step:
   - If a task in the cooldown queue is now available, push it back to the heap.
   - Pop the most frequent task from the heap, execute it (decrement count).
   - If it still has remaining executions, add it to the cooldown queue.
   - If the heap and queue are both empty, we are done.
   - If the heap is empty but the queue is not, the CPU idles.

### Mathematical Approach

There is also a formula-based solution:
- Let \`max_freq\` be the frequency of the most common task.
- Let \`max_count\` be how many tasks have that maximum frequency.
- Minimum intervals = max(len(tasks), (max_freq - 1) * (n + 1) + max_count)

The formula works because the most frequent task creates \`max_freq - 1\` gaps of size \`n + 1\`. The remaining slots are filled with other tasks. If there are enough tasks to fill all gaps, the answer is just \`len(tasks)\`.

### Complexity

| Approach | Time | Space |
|----------|------|-------|
| Heap + Queue | O(N * n) worst case | O(26) = O(1) |
| Formula | O(N) | O(26) = O(1) |

### Interview Tips

- Start by explaining the greedy intuition: most frequent first.
- The formula approach is elegant for a follow-up but harder to derive under pressure.
- The heap approach is more generalizable and shows stronger problem-solving skills.

Implement both the heap-based and formula-based solutions.`,
      starterCode: `import heapq
from collections import Counter, deque


def task_scheduler_heap(tasks: list[str], n: int) -> int:
    """
    Find minimum intervals to execute all tasks with cooldown n.

    Approach: Max-heap (most frequent first) + cooldown queue.
    """
    # TODO: Count task frequencies
    # TODO: Build max-heap of frequencies (negate for Python)
    # TODO: Use a queue for cooldown: (available_time, count)
    # TODO: Track current time
    # TODO: At each step:
    #   - Move available tasks from queue back to heap
    #   - If heap not empty, pop and execute most frequent
    #   - If heap empty and queue not empty, idle (jump time forward)
    # TODO: Return total time
    pass


def task_scheduler_formula(tasks: list[str], n: int) -> int:
    """
    Find minimum intervals using the mathematical formula.

    Formula: max(len(tasks), (max_freq - 1) * (n + 1) + max_count)
    """
    # TODO: Count frequencies
    # TODO: Find max_freq and how many tasks have max_freq
    # TODO: Apply formula
    pass


# Test cases
print(task_scheduler_heap(["A","A","A","B","B","B"], 2))       # 8
print(task_scheduler_heap(["A","A","A","B","B","B"], 0))       # 6
print(task_scheduler_heap(["A","A","A","A","B","B","B","C","C"], 2))  # 10

print(task_scheduler_formula(["A","A","A","B","B","B"], 2))    # 8
print(task_scheduler_formula(["A","A","A","B","B","B"], 0))    # 6
print(task_scheduler_formula(["A","A","A","A","B","B","B","C","C"], 2))  # 10
`,
      solutionCode: `import heapq
from collections import Counter, deque


def task_scheduler_heap(tasks: list[str], n: int) -> int:
    """
    Find minimum intervals to execute all tasks with cooldown n.

    Approach: Max-heap (most frequent first) + cooldown queue.
    """
    freq = Counter(tasks)
    # Max-heap of frequencies (negate for Python min-heap)
    max_heap = [-count for count in freq.values()]
    heapq.heapify(max_heap)

    cooldown = deque()  # (available_time, remaining_count)
    time = 0

    while max_heap or cooldown:
        time += 1
        # Move tasks that have finished cooldown back to heap
        if cooldown and cooldown[0][0] <= time:
            _, count = cooldown.popleft()
            heapq.heappush(max_heap, count)

        if max_heap:
            count = heapq.heappop(max_heap)
            count += 1  # Increment (it's negated, so this decrements actual count)
            if count < 0:  # Still has remaining executions
                cooldown.append((time + n + 1, count))
        elif cooldown:
            # CPU idles — jump to next available time
            time = cooldown[0][0] - 1  # Will be incremented at start of loop

    return time


def task_scheduler_formula(tasks: list[str], n: int) -> int:
    """
    Find minimum intervals using the mathematical formula.

    Formula: max(len(tasks), (max_freq - 1) * (n + 1) + max_count)
    """
    freq = Counter(tasks)
    max_freq = max(freq.values())
    # Count how many tasks have the maximum frequency
    max_count = sum(1 for count in freq.values() if count == max_freq)
    return max(len(tasks), (max_freq - 1) * (n + 1) + max_count)


# Test cases
print(task_scheduler_heap(["A","A","A","B","B","B"], 2))       # 8
print(task_scheduler_heap(["A","A","A","B","B","B"], 0))       # 6
print(task_scheduler_heap(["A","A","A","A","B","B","B","C","C"], 2))  # 10

print(task_scheduler_formula(["A","A","A","B","B","B"], 2))    # 8
print(task_scheduler_formula(["A","A","A","B","B","B"], 0))    # 6
print(task_scheduler_formula(["A","A","A","A","B","B","B","C","C"], 2))  # 10
`,
    },
  ],
};
