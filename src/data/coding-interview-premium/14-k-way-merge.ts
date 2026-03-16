import { Module } from "../types";

export const kWayMergeModule: Module = {
  id: "k-way-merge",
  title: "K-Way Merge",
  description:
    "Master the K-Way Merge pattern for efficiently merging K sorted arrays or lists using heaps. Essential for problems involving multiple sorted data sources.",
  lessons: [
    {
      id: "k-way-merge-intro",
      slug: "k-way-merge-intro",
      title: "Introduction to K-Way Merge",
      content: `## The K-Way Merge Pattern

The **K-Way Merge** pattern uses a **min-heap** to efficiently merge K sorted arrays or lists into a single sorted result.

<!-- voice:section_check concept="K-Way Merge basic concept" -->

### Why K-Way Merge?

When merging K sorted arrays:
- Naive approach: Concatenate all, then sort — O(nk log(nk))
- K-way merge using heap — O(nk log k) where n is average array length
- Much better when k is large

### How It Works

1. Create a **min-heap** and insert the first element from each of the K arrays
2. Track which array each element came from (and its index)
3. Pop the smallest element from heap, add to result
4. Push the next element from the same array (if exists)
5. Repeat until heap is empty

~~~
import heapq

def k_way_merge(arrays):
    result = []
    min_heap = []
    
    # Insert first element from each array
    for i, arr in enumerate(arrays):
        if arr:
            heapq.heappush(min_heap, (arr[0], i, 0))
    
    while min_heap:
        val, arr_idx, elem_idx = heapq.heappop(min_heap)
        result.append(val)
        
        # Push next element from same array
        if elem_idx + 1 < len(arrays[arr_idx]):
            next_val = arrays[arr_idx][elem_idx + 1]
            heapq.heappush(min_heap, (next_val, arr_idx, elem_idx + 1))
    
    return result
~~~

<!-- voice:key_insight insight="Always pick the smallest available element from all K arrays using a min-heap — this gives us O(log k) per element instead of O(k)" -->

### When to Use

- Merge K sorted arrays/lists
- Find kth smallest in M sorted lists
- Find smallest range covering elements from K lists
- Problems with multiple sorted inputs

### Complexity

- **Time:** O(nk log k) — nk total elements, heap operations O(log k)
- **Space:** O(k) — heap stores at most k elements`,
    },
    {
      id: "merge-k-sorted-lists",
      slug: "merge-k-sorted-lists",
      title: "Merge K Sorted Lists",
      content: `## Merge K Sorted Lists

<!-- voice:section_check concept="Heap for merging k sorted linked lists" -->

### Problem Statement

You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

### Examples

~~~
Input: lists = [[1, 4, 5], [1, 3, 4], [2, 6]]
Output: [1, 1, 2, 3, 4, 4, 5, 6]
Explanation: Merged sorted list from all 3 lists
~~~

~~~
Input: lists = []
Output: []
~~~

~~~
Input: lists = [[]]
Output: []
~~~

### Approach

Use a **min-heap** to track the smallest node from each list:
1. Push head of each non-empty list into heap (store value, list index, node)
2. Pop smallest node, add to result
3. Push next node from the same list
4. Repeat until heap is empty

<!-- voice:key_insight insight="Store (node.val, list_index, node) in heap — we need list_index as tie-breaker since node objects aren't comparable" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n log k) — n total nodes, each heap operation O(log k)
- **Space:** O(k) — heap stores at most k nodes`,
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

### Problem Statement

Given M sorted arrays, find the Kth smallest number among all the arrays.

### Examples

~~~
Input: lists = [[2, 6, 8], [3, 6, 7], [1, 3, 4]], k = 5
Output: 4
Explanation: Merged sorted: [1, 2, 3, 3, 4, 6, 6, 7, 8]
                              1st    ...     5th
~~~

~~~
Input: lists = [[5, 8, 9], [1, 7]], k = 3
Output: 7
Explanation: Merged sorted: [1, 5, 7, 8, 9], 3rd is 7
~~~

### Approach

Use the **K-Way Merge** pattern with early termination:
1. Use min-heap to track smallest element from each list
2. Pop k-1 times (these are the k-1 smallest)
3. The next pop gives us the kth smallest

<!-- voice:key_insight insight="We don't need to fully merge — just pop k times from the heap to find the kth smallest" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(k log m) — k pops, heap size m (number of lists)
- **Space:** O(m) — heap stores at most m elements`,
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

<!-- voice:section_check concept="Sliding window on k-way merge" -->

### Problem Statement

Given M sorted lists, find the smallest range that includes at least one number from each of the M lists.

### Examples

~~~
Input: lists = [[1, 5, 8], [4, 12], [7, 8, 10]]
Output: [4, 7]
Explanation: 4 from 2nd list, 7 from 3rd list
             Range size = 7 - 4 = 3 (smallest possible)
~~~

~~~
Input: lists = [[1, 2, 3], [1, 2, 3], [1, 2, 3]]
Output: [1, 1]
Explanation: 1 is in all three lists
~~~

### Approach

Use **K-Way Merge** with a sliding window concept:
1. Use min-heap to always get the minimum element from all lists
2. Track the current maximum element seen so far
3. At each step, the range is [heap_min, current_max]
4. Keep track of the smallest such range

<!-- voice:key_insight insight="The smallest range must start at some element in one of the lists — use heap to try all possibilities efficiently" -->

<!-- voice:exercise_intro difficulty="hard" hints_available="3" -->

### Complexity

- **Time:** O(n log m) — process all elements, heap operations O(log m)
- **Space:** O(m) — heap stores at most m elements`,
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

Great work on the K-Way Merge module! Let's verify your understanding.

### Quick Review

You learned:
- Using a **min-heap** to efficiently merge K sorted arrays
- **Merge K Sorted Lists** using heap with node tracking
- Finding **Kth smallest in M sorted lists** with early termination
- Finding the **smallest range** covering elements from K lists

### Quiz

**Question 1:** What is the time complexity of merging K sorted lists with total n elements?
- A) O(n log n)
- B) O(n log k)
- C) O(nk)
- D) O(k log n)

**Question 2:** In K-Way Merge, what information do we need to store in the heap?
- A) Just the value
- B) Value and which list it came from
- C) Value, list index, and element index
- D) Just the list index

**Question 3:** For finding kth smallest in M sorted lists, what's the time complexity?
- A) O(n log n)
- B) O(k log m)
- C) O(m log k)
- D) O(km)

**Question 4:** True or False: The K-Way Merge pattern requires all input lists to be the same length.

**Question 5:** In the Smallest Range problem, what does the range represent at each step?
- A) [min_element, max_element] of merged array
- B) [heap_min, current_max] of elements seen
- C) [first_element, last_element] of each list
- D) [min_length, max_length] of lists

### Voice Summary

Your coach will ask you to:
- Explain the K-Way Merge algorithm step by step
- Describe how to merge K sorted linked lists
- Find kth smallest without fully merging
- Explain the smallest range approach

**You're mastering the K-Way Merge pattern!**`,
    },
  ],
};
