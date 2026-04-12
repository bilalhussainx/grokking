import { Module } from "../types";

export const twoHeapsModule: Module = {
  id: "two-heaps",
  title: "Two Heaps",
  description: "Learn to use a max-heap and min-heap in tandem to efficiently track medians and optimize selection problems.",
  lessons: [
    {
      id: "two-heaps-intro",
      slug: "two-heaps-intro",
      title: "Introduction to Two Heaps",
      content: `# Two Heaps Pattern

The **Two Heaps** pattern uses a max-heap and a min-heap together to efficiently partition a dataset into two halves. This is particularly powerful when you need to repeatedly find the median or balance elements around a central value.

## Why Two Heaps?

Imagine you receive a continuous stream of numbers and need to report the median at any time. Sorting after every insertion would cost O(n log n). With two heaps, each insertion and median query costs only O(log n).

## How It Works

- **Max-Heap (left half):** Stores the smaller half of the numbers. The top element is the largest of the small numbers.
- **Min-Heap (right half):** Stores the larger half. The top element is the smallest of the large numbers.

By keeping these two heaps balanced (sizes differ by at most 1), the median is always at the top of one or both heaps.

## Python Implementation Notes

Python's \`heapq\` module only provides a min-heap. To simulate a max-heap, **negate the values** when pushing and popping:

\`\`\`python
import heapq

max_heap = []
heapq.heappush(max_heap, -value)  # push negated
top = -heapq.heappop(max_heap)     # pop and negate back
\`\`\`

## When to Use This Pattern

- Finding the running median of a data stream
- Balancing two groups to minimize difference
- Problems requiring quick access to both the maximum of a lower set and the minimum of an upper set

The key insight is that by maintaining two sorted halves via heaps, you get O(log n) insertions and O(1) median lookups — far better than re-sorting each time.

\`\`\`mermaid
graph TD
    subgraph MaxHeap["Max-Heap (smaller half)"]
        MH1["3"]
        MH2["1"] --- MH3["2"]
        MH1 --- MH2
    end
    subgraph MinHeap["Min-Heap (larger half)"]
        NH1["5"]
        NH2["7"] --- NH3["8"]
        NH1 --- NH2
    end
    MaxHeap -->|"top=3"| Med["Median = avg(3,5) = 4.0"]
    MinHeap -->|"top=5"| Med
    style Med fill:#4CAF50,color:#fff
\`\`\`

\`\`\`mermaid
graph TD
    A["New number arrives"] --> B{"num <= max_heap top?"}
    B -->|"Yes"| C["Push to Max-Heap"]
    B -->|"No"| D["Push to Min-Heap"]
    C --> E{"Heaps balanced?"}
    D --> E
    E -->|"Max > Min+1"| F["Move max top to min"]
    E -->|"Min > Max"| G["Move min top to max"]
    E -->|"Balanced"| H["Read median from tops"]
    F --> H
    G --> H
\`\`\``,
    },
    {
      id: "two-heaps-median-stream",
      slug: "two-heaps-median-stream",
      title: "Find the Median of a Number Stream",
      content: `# Find the Median of a Number Stream

## Problem Statement

Design a class that supports two operations:

1. **\`insert_num(num)\`** — Add a number to the data structure.
2. **\`find_median()\`** — Return the median of all numbers inserted so far.

If the count of numbers is even, the median is the average of the two middle numbers.

## Examples

**Example 1:**
\`\`\`
insert_num(3), insert_num(1), find_median() → 2.0
insert_num(5), find_median() → 3.0
insert_num(4), find_median() → 3.5
\`\`\`

**Example 2:**
\`\`\`
insert_num(8), find_median() → 8.0
insert_num(2), find_median() → 5.0
\`\`\`

\`\`\`mermaid
graph LR
    subgraph S1["Insert 3"]
        A1["Max:[3] Min:[]<br/>Median=3.0"]
    end
    subgraph S2["Insert 1"]
        A2["Max:[1] Min:[3]<br/>Median=2.0"]
    end
    subgraph S3["Insert 5"]
        A3["Max:[1,3] Min:[5]<br/>Median=3.0"]
    end
    subgraph S4["Insert 4"]
        A4["Max:[1,3] Min:[4,5]<br/>Median=3.5"]
    end
    S1 --> S2 --> S3 --> S4
\`\`\`

## Approach

Maintain two heaps:
- A **max-heap** for the lower half (negate values in Python).
- A **min-heap** for the upper half.

On each insertion:
1. If the number is less than or equal to the max-heap's top, push it onto the max-heap; otherwise push onto the min-heap.
2. Rebalance so the heaps differ in size by at most 1.

For the median:
- If heaps are the same size, average their tops.
- Otherwise, the top of the larger heap is the median.

**Time Complexity:** O(log n) per insertion, O(1) per median query.
**Space Complexity:** O(n) for storing all elements.`,
      starterCode: `import heapq

class MedianFinder:
    def __init__(self):
        self.max_heap = []  # lower half (store negated)
        self.min_heap = []  # upper half

    def insert_num(self, num):
        # TODO: Insert num into the correct heap and rebalance
        pass

    def find_median(self):
        # TODO: Return the current median
        pass

# Test cases
mf = MedianFinder()
mf.insert_num(3)
mf.insert_num(1)
print(mf.find_median())  # Expected: 2.0
mf.insert_num(5)
print(mf.find_median())  # Expected: 3.0
mf.insert_num(4)
print(mf.find_median())  # Expected: 3.5
`,
      solutionCode: `import heapq

class MedianFinder:
    def __init__(self):
        self.max_heap = []  # lower half (store negated)
        self.min_heap = []  # upper half

    def insert_num(self, num):
        if not self.max_heap or num <= -self.max_heap[0]:
            heapq.heappush(self.max_heap, -num)
        else:
            heapq.heappush(self.min_heap, num)

        # Rebalance: max_heap can have at most 1 extra element
        if len(self.max_heap) > len(self.min_heap) + 1:
            heapq.heappush(self.min_heap, -heapq.heappop(self.max_heap))
        elif len(self.min_heap) > len(self.max_heap):
            heapq.heappush(self.max_heap, -heapq.heappop(self.min_heap))

    def find_median(self):
        if len(self.max_heap) == len(self.min_heap):
            return (-self.max_heap[0] + self.min_heap[0]) / 2.0
        return -self.max_heap[0] / 1.0

# Test cases
mf = MedianFinder()
mf.insert_num(3)
mf.insert_num(1)
print(mf.find_median())  # Expected: 2.0
mf.insert_num(5)
print(mf.find_median())  # Expected: 3.0
mf.insert_num(4)
print(mf.find_median())  # Expected: 3.5
`,
    },
    {
      id: "two-heaps-sliding-window-median",
      slug: "two-heaps-sliding-window-median",
      title: "Sliding Window Median",
      content: `# Sliding Window Median

## Problem Statement

Given an array of numbers and a window size \`k\`, find the median of each sliding window as it moves from left to right across the array.

## Examples

**Example 1:**
\`\`\`
Input: nums = [1, 2, -1, 3, 5], k = 3
Output: [1.0, 2.0, 3.0]
Explanation: Window [1,2,-1] → median 1, Window [2,-1,3] → median 2, Window [-1,3,5] → median 3
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
Output: [1.0, -1.0, -1.0, 3.0, 5.0, 6.0]
\`\`\`

## Approach

This extends the median-of-a-stream idea but adds element removal:

1. Use two heaps (max-heap for lower half, min-heap for upper half) as before.
2. For each window position, insert the new element and remove the element leaving the window.
3. Since \`heapq\` doesn't support efficient removal, use **lazy deletion**: track elements to remove in a hash map, and clean them up only when they appear at the top of a heap.
4. After insertion and removal, rebalance the heaps and compute the median.

**Time Complexity:** O(n log k) — each element is inserted and removed once.
**Space Complexity:** O(k) for the heaps plus O(n) for the removal tracker.

The tricky part is the rebalancing logic when elements are lazily deleted — you must account for "pending removals" in each heap's effective size.`,
      starterCode: `import heapq
from collections import defaultdict

def sliding_window_median(nums, k):
    # TODO: Return list of medians for each window of size k
    result = []
    return result

# Test cases
print(sliding_window_median([1, 2, -1, 3, 5], 3))
# Expected: [1.0, 2.0, 3.0]

print(sliding_window_median([1, 3, -1, -3, 5, 3, 6, 7], 3))
# Expected: [1.0, -1.0, -1.0, 3.0, 5.0, 6.0]
`,
      solutionCode: `import heapq
from collections import defaultdict

def sliding_window_median(nums, k):
    result = []
    max_heap = []  # lower half (negated)
    min_heap = []  # upper half
    to_remove = defaultdict(int)

    def get_median():
        if k % 2 == 1:
            return -max_heap[0] / 1.0
        return (-max_heap[0] + min_heap[0]) / 2.0

    def rebalance():
        # max_heap should have equal or one more element than min_heap
        if len(max_heap) - len(min_heap) > 1:
            heapq.heappush(min_heap, -heapq.heappop(max_heap))
        elif len(min_heap) > len(max_heap):
            heapq.heappush(max_heap, -heapq.heappop(min_heap))

    def clean_top(heap, is_max):
        while heap:
            val = -heap[0] if is_max else heap[0]
            if to_remove[val] > 0:
                to_remove[val] -= 1
                heapq.heappop(heap)
            else:
                break

    # Initialize with first k elements
    for i in range(k):
        heapq.heappush(max_heap, -nums[i])
    # Move the larger half to min_heap
    for _ in range(k // 2):
        heapq.heappush(min_heap, -heapq.heappop(max_heap))

    result.append(get_median())

    for i in range(k, len(nums)):
        out_val = nums[i - k]
        in_val = nums[i]

        # Mark element to remove
        to_remove[out_val] += 1

        # Determine which heap the outgoing element belongs to
        balance = -1 if out_val <= -max_heap[0] else 1  # -1 if from max_heap

        # Insert new element
        if max_heap and in_val <= -max_heap[0]:
            heapq.heappush(max_heap, -in_val)
            balance += 1
        else:
            heapq.heappush(min_heap, in_val)
            balance -= 1

        # Rebalance based on net effect
        if balance < 0:  # max_heap lost one net
            heapq.heappush(max_heap, -heapq.heappop(min_heap))
        elif balance > 0:  # min_heap lost one net
            heapq.heappush(min_heap, -heapq.heappop(max_heap))

        # Lazy cleanup
        clean_top(max_heap, True)
        clean_top(min_heap, False)

        result.append(get_median())

    return result

# Test cases
print(sliding_window_median([1, 2, -1, 3, 5], 3))
# Expected: [1.0, 2.0, 3.0]

print(sliding_window_median([1, 3, -1, -3, 5, 3, 6, 7], 3))
# Expected: [1.0, -1.0, -1.0, 3.0, 5.0, 6.0]
`,
    },
    {
      id: "two-heaps-maximize-capital",
      slug: "two-heaps-maximize-capital",
      title: "Maximize Capital",
      content: `# Maximize Capital

## Problem Statement

You are given a set of projects. Each project \`i\` has a **capital requirement** \`capital[i]\` (minimum money needed to start it) and a **profit** \`profits[i]\` (net gain upon completion). Starting with initial capital \`W\`, you can select at most \`k\` projects to maximize your total capital.

After completing a project, its profit is added to your total capital, potentially unlocking more projects.

## Examples

**Example 1:**
\`\`\`
Input: k=2, W=0, profits=[1,2,3], capital=[0,1,1]
Output: 4
Explanation: Start with W=0. Pick project 0 (needs 0, profit 1) → W=1.
Pick project 2 (needs 1, profit 3) → W=4.
\`\`\`

**Example 2:**
\`\`\`
Input: k=3, W=0, profits=[1,2,3], capital=[0,1,2]
Output: 6
Explanation: Pick all three projects in order: 0→1→2, total = 0+1+2+3 = 6.
\`\`\`

## Approach

Use two heaps:
1. **Min-heap on capital:** Store all projects sorted by their capital requirement.
2. **Max-heap on profit:** Store all currently affordable projects sorted by profit.

For each of the \`k\` rounds:
1. Move all projects from the min-heap whose capital requirement ≤ current \`W\` into the max-heap.
2. Pick the most profitable project from the max-heap.
3. Add its profit to \`W\`.

If the max-heap is empty at any round, stop early — no affordable projects remain.

**Time Complexity:** O(n log n + k log n) for heap operations.
**Space Complexity:** O(n) for the two heaps.`,
      starterCode: `import heapq

def find_maximum_capital(capital, profits, k, initial_capital):
    # TODO: Return the maximum capital after selecting at most k projects
    pass

# Test cases
print(find_maximum_capital([0, 1, 1], [1, 2, 3], 2, 0))
# Expected: 4

print(find_maximum_capital([0, 1, 2], [1, 2, 3], 3, 0))
# Expected: 6
`,
      solutionCode: `import heapq

def find_maximum_capital(capital, profits, k, initial_capital):
    n = len(capital)
    # Min-heap: (capital_required, index)
    min_capital_heap = []
    for i in range(n):
        heapq.heappush(min_capital_heap, (capital[i], i))

    # Max-heap for profits of affordable projects (store negated)
    max_profit_heap = []
    current_capital = initial_capital

    for _ in range(k):
        # Move all affordable projects to profit heap
        while min_capital_heap and min_capital_heap[0][0] <= current_capital:
            cap, idx = heapq.heappop(min_capital_heap)
            heapq.heappush(max_profit_heap, -profits[idx])

        if not max_profit_heap:
            break  # No affordable projects

        # Pick the most profitable project
        current_capital += -heapq.heappop(max_profit_heap)

    return current_capital

# Test cases
print(find_maximum_capital([0, 1, 1], [1, 2, 3], 2, 0))
# Expected: 4

print(find_maximum_capital([0, 1, 2], [1, 2, 3], 3, 0))
# Expected: 6
`,
    },
    {
      id: "two-heaps-next-interval",
      slug: "two-heaps-next-interval",
      title: "Next Interval",
      content: `# Next Interval

## Problem Statement

Given an array of intervals where each interval is \`[start, end]\`, for each interval find the index of the **next interval** — the interval whose start is greater than or equal to the current interval's end. If no such interval exists, return \`-1\` for that position.

## Examples

**Example 1:**
\`\`\`
Input: intervals = [[2,3],[3,4],[5,6]]
Output: [1, 2, -1]
Explanation: Next for [2,3] is [3,4] (index 1). Next for [3,4] is [5,6] (index 2). No next for [5,6].
\`\`\`

**Example 2:**
\`\`\`
Input: intervals = [[3,4],[1,5],[4,6]]
Output: [2, -1, -1]
Explanation: Next for [3,4] is [4,6]. No interval starts at 5 or later for [1,5] or at 6+ for [4,6].
\`\`\`

## Approach

Use two max-heaps:
1. **Max-heap on start:** Stores (start_value, original_index). We process from the largest start downward.
2. **Max-heap on end:** Stores (end_value, original_index).

Process intervals by largest end value first. For each interval (popped from the end-heap), pop from the start-heap until the top start is the smallest that is still ≥ current end. Record that as the next interval. Push back the last valid candidate so it can serve subsequent queries.

**Time Complexity:** O(n log n) for heap operations.
**Space Complexity:** O(n) for heaps and the result array.`,
      starterCode: `import heapq

def find_next_interval(intervals):
    # TODO: Return a list where result[i] is the index of the next interval for intervals[i]
    n = len(intervals)
    result = [-1] * n
    return result

# Test cases
print(find_next_interval([[2,3],[3,4],[5,6]]))
# Expected: [1, 2, -1]

print(find_next_interval([[3,4],[1,5],[4,6]]))
# Expected: [2, -1, -1]
`,
      solutionCode: `import heapq

def find_next_interval(intervals):
    n = len(intervals)
    result = [-1] * n

    # Max-heaps (negate for max behavior)
    start_heap = []  # (-start, index)
    end_heap = []    # (-end, index)

    for i, interval in enumerate(intervals):
        heapq.heappush(start_heap, (-interval[0], i))
        heapq.heappush(end_heap, (-interval[1], i))

    while end_heap:
        end_val, end_idx = heapq.heappop(end_heap)
        end_val = -end_val

        # Find the interval with the smallest start >= end_val
        candidate = None
        while start_heap and -start_heap[0][0] >= end_val:
            candidate = heapq.heappop(start_heap)

        if candidate is not None:
            result[end_idx] = candidate[1]
            # Push candidate back — it might be the answer for other intervals too
            heapq.heappush(start_heap, candidate)

    return result

# Test cases
print(find_next_interval([[2,3],[3,4],[5,6]]))
# Expected: [1, 2, -1]

print(find_next_interval([[3,4],[1,5],[4,6]]))
# Expected: [2, -1, -1]
`,
    },
    {
      id: "two-heaps-kth-largest-stream",
      slug: "two-heaps-kth-largest-stream",
      title: "Kth Largest Element in a Stream",
      content: `# Kth Largest Element in a Stream

## Problem Statement

Design a class that takes an integer \`k\` and an initial list of numbers. It should support an \`add(val)\` method that adds a new value and returns the kth largest element in the current collection.

## Examples

**Example 1:**
\`\`\`
KthLargest(3, [4, 5, 8, 2])
add(3) → 4   (sorted: [2,3,4,5,8], 3rd largest = 4)
add(5) → 5   (sorted: [2,3,4,5,5,8], 3rd largest = 5)
add(10) → 5  (sorted: [2,3,4,5,5,8,10], 3rd largest = 5)
\`\`\`

**Example 2:**
\`\`\`
KthLargest(1, [])
add(3) → 3
add(5) → 5
add(2) → 5
\`\`\`

## Approach

Use a **min-heap of size k**. The top of this min-heap is always the kth largest element.

1. Initialize by adding all numbers and keeping only the k largest.
2. On \`add(val)\`:
   - If the heap has fewer than k elements, push val.
   - If val > heap top, pop the top and push val (val displaces the smallest of the top-k).
   - Return the heap top.

This works because a min-heap of size k naturally keeps the k largest seen values, with the smallest of those k at the root — which is exactly the kth largest overall.

**Time Complexity:** O(log k) per add call.
**Space Complexity:** O(k) for the heap.`,
      starterCode: `import heapq

class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.heap = []
        # TODO: Initialize the heap with the k largest from nums

    def add(self, val):
        # TODO: Add val and return the kth largest element
        pass

# Test cases
kl = KthLargest(3, [4, 5, 8, 2])
print(kl.add(3))   # Expected: 4
print(kl.add(5))   # Expected: 5
print(kl.add(10))  # Expected: 5

kl2 = KthLargest(1, [])
print(kl2.add(3))  # Expected: 3
print(kl2.add(5))  # Expected: 5
print(kl2.add(2))  # Expected: 5
`,
      solutionCode: `import heapq

class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.heap = []
        for num in nums:
            heapq.heappush(self.heap, num)
            if len(self.heap) > k:
                heapq.heappop(self.heap)

    def add(self, val):
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]

# Test cases
kl = KthLargest(3, [4, 5, 8, 2])
print(kl.add(3))   # Expected: 4
print(kl.add(5))   # Expected: 5
print(kl.add(10))  # Expected: 5

kl2 = KthLargest(1, [])
print(kl2.add(3))  # Expected: 3
print(kl2.add(5))  # Expected: 5
print(kl2.add(2))  # Expected: 5
`,
    },
  ],
};
