import { Module } from "../types";

export const stacksQueuesModule: Module = {
  id: "ds-stacks-queues",
  title: "Stacks & Queues",
  description: "Master stack and queue patterns including monotonic stacks, deques, and expression evaluation.",
  lessons: [
    {
      id: "ds-sq-intro",
      slug: "intro-stacks-queues",
      title: "Intro to Stacks & Queues",
      content: `## Intro to Stacks & Queues

Stacks and queues are the two fundamental LIFO and FIFO data structures. They appear constantly in interviews — both as direct problems and as helpers in algorithms.

### Stack: Last In, First Out (LIFO)

Think of a stack of plates. You can only add or remove from the top.

**Operations** (all O(1)):
- \`push(item)\`: Add to top
- \`pop()\`: Remove from top
- \`peek()\` / \`top()\`: View top without removing
- \`is_empty()\`: Check if empty

**Python**: Use a list. \`append()\` = push, \`pop()\` = pop, \`[-1]\` = peek.

### Queue: First In, First Out (FIFO)

Think of a line at a store. First person in line is served first.

**Operations** (all O(1)):
- \`enqueue(item)\`: Add to back
- \`dequeue()\`: Remove from front
- \`front()\`: View front without removing
- \`is_empty()\`: Check if empty

**Python**: Use \`collections.deque\`. \`append()\` = enqueue, \`popleft()\` = dequeue. Don't use a list — \`pop(0)\` is O(n).

### When to Use a Stack

- **Matching pairs**: Parentheses matching, HTML tag matching.
- **Backtracking**: Undo operations, DFS traversal.
- **Monotonic patterns**: Next greater element, histogram problems.
- **Expression evaluation**: Infix to postfix, calculator problems.

### When to Use a Queue

- **BFS traversal**: Level-order tree traversal, shortest path in unweighted graph.
- **Order processing**: Task scheduling, request handling.
- **Sliding window**: With deque for min/max tracking.

### Valid Parentheses

The classic stack problem. For each character:
- Opening bracket → push to stack
- Closing bracket → pop from stack and check if it matches
- At end, stack should be empty

This is the most frequently asked easy-level interview question.

Implement valid parentheses and a min stack (stack that supports O(1) getMin).`,
      starterCode: `from collections import deque

def is_valid_parentheses(s: str) -> bool:
    """
    Check if a string of brackets is valid.
    Valid: (), [], {}, ([{}])
    Invalid: (], ([)], ((

    Time: O(n), Space: O(n)
    """
    # TODO: Create a mapping of closing -> opening brackets
    # TODO: Use a stack
    # TODO: For each char:
    #   - If opening, push
    #   - If closing, check stack top matches
    # TODO: Return whether stack is empty
    pass


class MinStack:
    """
    Stack that supports push, pop, top, and getMin in O(1) time.
    """

    def __init__(self):
        # TODO: Initialize main stack and min-tracking stack
        pass

    def push(self, val: int) -> None:
        # TODO: Push to main stack
        # TODO: Push to min stack if val <= current min
        pass

    def pop(self) -> None:
        # TODO: If popped value equals current min, pop min stack too
        pass

    def top(self) -> int:
        # TODO: Return top of main stack
        pass

    def get_min(self) -> int:
        # TODO: Return top of min stack
        pass


# Test valid parentheses
print(is_valid_parentheses("()[]{}"))     # True
print(is_valid_parentheses("([{}])"))     # True
print(is_valid_parentheses("(]"))         # False
print(is_valid_parentheses("([)]"))       # False
print(is_valid_parentheses(""))           # True

# Test MinStack
ms = MinStack()
ms.push(-2)
ms.push(0)
ms.push(-3)
print(ms.get_min())  # -3
ms.pop()
print(ms.top())      # 0
print(ms.get_min())  # -2
`,
      solutionCode: `from collections import deque

def is_valid_parentheses(s: str) -> bool:
    """
    Check if a string of brackets is valid.
    Valid: (), [], {}, ([{}])
    Invalid: (], ([)], ((

    Time: O(n), Space: O(n)
    """
    matching = {')': '(', ']': '[', '}': '{'}
    stack = []

    for char in s:
        if char in matching:
            # Closing bracket — check for match
            if not stack or stack[-1] != matching[char]:
                return False
            stack.pop()
        else:
            # Opening bracket — push
            stack.append(char)

    return len(stack) == 0


class MinStack:
    """
    Stack that supports push, pop, top, and getMin in O(1) time.
    """

    def __init__(self):
        self.stack = []
        self.min_stack = []  # Tracks minimums

    def push(self, val: int) -> None:
        self.stack.append(val)
        # Push to min_stack if it's empty or val is <= current min
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)

    def pop(self) -> None:
        val = self.stack.pop()
        # If popped value is the current min, pop min stack too
        if val == self.min_stack[-1]:
            self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def get_min(self) -> int:
        return self.min_stack[-1]


# Test valid parentheses
print(is_valid_parentheses("()[]{}"))     # True
print(is_valid_parentheses("([{}])"))     # True
print(is_valid_parentheses("(]"))         # False
print(is_valid_parentheses("([)]"))       # False
print(is_valid_parentheses(""))           # True

# Test MinStack
ms = MinStack()
ms.push(-2)
ms.push(0)
ms.push(-3)
print(ms.get_min())  # -3
ms.pop()
print(ms.top())      # 0
print(ms.get_min())  # -2
`,
    },
    {
      id: "ds-monotonic-stack",
      slug: "monotonic-stack",
      title: "Monotonic Stack",
      content: `## Monotonic Stack

A monotonic stack maintains elements in either increasing or decreasing order. It's a powerful technique for solving "next greater/smaller element" problems in O(n) time.

### What Is a Monotonic Stack?

A stack where elements are always in sorted order (either non-increasing or non-decreasing). When a new element would violate the order, we pop elements until the order is restored.

### Monotonic Decreasing Stack

Elements decrease from bottom to top. When a new element is larger than the top:
- Pop all smaller elements (they've found their "next greater element")
- Push the new element

This is used for **next greater element** problems.

### Monotonic Increasing Stack

Elements increase from bottom to top. When a new element is smaller than the top:
- Pop all larger elements (they've found their "next smaller element")
- Push the new element

### The Key Insight

Each element is pushed once and popped once, giving O(n) total time despite the nested-looking loop. The inner while loop across all iterations of the outer for loop processes each element at most once.

### Daily Temperatures

Classic monotonic stack problem: given daily temperatures, find how many days you need to wait for a warmer temperature.

\`\`\`
Input:  [73, 74, 75, 71, 69, 72, 76, 73]
Output: [1,  1,  4,  2,  1,  1,  0,  0]
\`\`\`

Stack stores indices. When we find a warmer day, we pop and compute the difference.

### Largest Rectangle in Histogram

One of the most famous monotonic stack problems. For each bar, find how far it can extend left and right as the shortest bar. Use a monotonic increasing stack (pop when a shorter bar is found).

### Interview Tip

If a problem asks about "next greater," "next smaller," "previous greater," or "previous smaller" — think monotonic stack immediately. These problems have a distinctive pattern.

Implement daily temperatures and largest rectangle in histogram.`,
      starterCode: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    """
    For each day, find how many days until a warmer temperature.
    Return 0 if no future warmer day exists.

    Monotonic decreasing stack (stores indices).
    Time: O(n), Space: O(n)
    """
    # TODO: Initialize result array of zeros
    # TODO: Use a stack storing indices
    # TODO: For each temperature:
    #   - While stack is non-empty and current temp > temp at stack top:
    #     - Pop index, compute days difference
    #   - Push current index
    pass


def largest_rectangle_histogram(heights: list[int]) -> int:
    """
    Find the area of the largest rectangle in a histogram.

    Monotonic increasing stack.
    Time: O(n), Space: O(n)
    """
    # TODO: Use a stack storing indices
    # TODO: For each bar (and a sentinel 0 at the end):
    #   - While stack non-empty and current height < height at stack top:
    #     - Pop index, compute width and area
    #     - Width = i - stack[-1] - 1 (or i if stack is empty)
    #   - Push current index
    # TODO: Return max area
    pass


# Test cases
print(daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]))
# [1, 1, 4, 2, 1, 1, 0, 0]

print(daily_temperatures([30, 40, 50, 60]))
# [1, 1, 1, 0]

print(daily_temperatures([30, 20, 10]))
# [0, 0, 0]

print(largest_rectangle_histogram([2, 1, 5, 6, 2, 3]))
# 10 (heights 5 and 6, width 2)

print(largest_rectangle_histogram([2, 4]))
# 4
`,
      solutionCode: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    """
    For each day, find how many days until a warmer temperature.
    Return 0 if no future warmer day exists.

    Monotonic decreasing stack (stores indices).
    Time: O(n), Space: O(n)
    """
    n = len(temperatures)
    result = [0] * n
    stack = []  # Stores indices

    for i in range(n):
        # Pop all indices with smaller temperatures
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_idx = stack.pop()
            result[prev_idx] = i - prev_idx
        stack.append(i)

    return result


def largest_rectangle_histogram(heights: list[int]) -> int:
    """
    Find the area of the largest rectangle in a histogram.

    Monotonic increasing stack.
    Time: O(n), Space: O(n)
    """
    stack = []  # Stores indices
    max_area = 0

    # Append 0 as sentinel to flush remaining bars
    for i, h in enumerate(heights + [0]):
        while stack and h < heights[stack[-1]]:
            height = heights[stack.pop()]
            # Width extends from current position to element after new stack top
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)

    return max_area


# Test cases
print(daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]))
# [1, 1, 4, 2, 1, 1, 0, 0]

print(daily_temperatures([30, 40, 50, 60]))
# [1, 1, 1, 0]

print(daily_temperatures([30, 20, 10]))
# [0, 0, 0]

print(largest_rectangle_histogram([2, 1, 5, 6, 2, 3]))
# 10 (heights 5 and 6, width 2)

print(largest_rectangle_histogram([2, 4]))
# 4
`,
    },
    {
      id: "ds-next-greater",
      slug: "next-greater-element",
      title: "Next Greater Element",
      content: `## Next Greater Element

The "next greater element" family of problems is a staple in coding interviews. They all follow the monotonic stack pattern but with interesting variations.

### Next Greater Element I

Given two arrays \`nums1\` (subset of \`nums2\`), for each element in \`nums1\`, find its next greater element in \`nums2\`. Return -1 if none exists.

**Approach**: Process \`nums2\` with a monotonic decreasing stack. When popping, map each popped element to the current element (its next greater). Then look up results for \`nums1\`.

### Next Greater Element II (Circular Array)

Same problem but the array is circular — after the last element, wrap around to the first. The trick: iterate through the array **twice** (indices 0 to 2n-1) using modulo to simulate the circular nature.

### Next Smaller Element

Same pattern but with a monotonic increasing stack. Pop when the current element is **smaller** than the stack top.

### Previous Greater Element

Instead of looking forward, we want the previous greater element. Process left to right. When we push, the stack top is the previous greater element for the current item.

### Stock Span Problem

For each day's stock price, the "span" is the number of consecutive previous days with price <= today's price (including today). This is equivalent to finding the previous greater element and computing the distance.

### Key Template

\`\`\`python
# Next greater element template
stack = []
result = [-1] * n
for i in range(n):
    while stack and nums[i] > nums[stack[-1]]:
        result[stack.pop()] = nums[i]
    stack.append(i)
\`\`\`

All variations modify: the comparison operator, whether to use indices or values, and whether to process left-to-right or right-to-left.

Implement next greater element for both regular and circular arrays, plus the stock span problem.`,
      starterCode: `def next_greater_element(nums1: list[int], nums2: list[int]) -> list[int]:
    """
    For each element in nums1, find its next greater element in nums2.
    nums1 is a subset of nums2. Return -1 if no next greater exists.

    Time: O(n + m), Space: O(n)
    """
    # TODO: Build a map of {element: next_greater} by processing nums2
    #       with a monotonic decreasing stack
    # TODO: Look up results for each element in nums1
    pass


def next_greater_circular(nums: list[int]) -> list[int]:
    """
    Find next greater element in a circular array.

    Time: O(n), Space: O(n)
    """
    # TODO: Initialize result with -1s
    # TODO: Iterate 0 to 2*n-1, use i % n for actual index
    # TODO: Use monotonic decreasing stack
    pass


def stock_span(prices: list[int]) -> list[int]:
    """
    For each day, find the span — number of consecutive days
    (including today) where price was <= today's price.

    Example: [100, 80, 60, 70, 60, 75, 85] → [1, 1, 1, 2, 1, 4, 6]

    Time: O(n), Space: O(n)
    """
    # TODO: Use a stack storing indices
    # TODO: For each day, pop all indices with price <= current
    # TODO: Span = distance to the new stack top (or i+1 if stack empty)
    pass


# Test cases
print(next_greater_element([4, 1, 2], [1, 3, 4, 2]))
# [-1, 3, -1]

print(next_greater_element([2, 4], [1, 2, 3, 4]))
# [3, -1]

print(next_greater_circular([1, 2, 1]))
# [2, -1, 2]

print(next_greater_circular([1, 2, 3, 4, 3]))
# [2, 3, 4, -1, 4]

print(stock_span([100, 80, 60, 70, 60, 75, 85]))
# [1, 1, 1, 2, 1, 4, 6]
`,
      solutionCode: `def next_greater_element(nums1: list[int], nums2: list[int]) -> list[int]:
    """
    For each element in nums1, find its next greater element in nums2.
    nums1 is a subset of nums2. Return -1 if no next greater exists.

    Time: O(n + m), Space: O(n)
    """
    # Build next-greater map from nums2
    next_greater = {}
    stack = []

    for num in nums2:
        while stack and num > stack[-1]:
            next_greater[stack.pop()] = num
        stack.append(num)

    # Remaining elements in stack have no next greater
    return [next_greater.get(num, -1) for num in nums1]


def next_greater_circular(nums: list[int]) -> list[int]:
    """
    Find next greater element in a circular array.

    Time: O(n), Space: O(n)
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Stores indices

    # Traverse the array twice to simulate circular behavior
    for i in range(2 * n):
        idx = i % n
        while stack and nums[idx] > nums[stack[-1]]:
            result[stack.pop()] = nums[idx]
        # Only push during first pass
        if i < n:
            stack.append(i)

    return result


def stock_span(prices: list[int]) -> list[int]:
    """
    For each day, find the span — number of consecutive days
    (including today) where price was <= today's price.

    Example: [100, 80, 60, 70, 60, 75, 85] → [1, 1, 1, 2, 1, 4, 6]

    Time: O(n), Space: O(n)
    """
    n = len(prices)
    span = [0] * n
    stack = []  # Stores indices

    for i in range(n):
        # Pop all days with price <= today's price
        while stack and prices[stack[-1]] <= prices[i]:
            stack.pop()

        # Span is distance from previous greater element
        span[i] = i + 1 if not stack else i - stack[-1]
        stack.append(i)

    return span


# Test cases
print(next_greater_element([4, 1, 2], [1, 3, 4, 2]))
# [-1, 3, -1]

print(next_greater_element([2, 4], [1, 2, 3, 4]))
# [3, -1]

print(next_greater_circular([1, 2, 1]))
# [2, -1, 2]

print(next_greater_circular([1, 2, 3, 4, 3]))
# [2, 3, 4, -1, 4]

print(stock_span([100, 80, 60, 70, 60, 75, 85]))
# [1, 1, 1, 2, 1, 4, 6]
`,
    },
    {
      id: "ds-queue-stacks",
      slug: "queue-with-stacks",
      title: "Queue with Stacks",
      content: `## Queue with Stacks

Implementing a queue using two stacks is a classic interview question that tests your understanding of both data structures. It also appears in real systems — some message queues use this pattern internally.

### The Core Idea

A stack reverses order. Two stacks reverse order twice, restoring the original FIFO order.

- **Push stack** (\`in_stack\`): Elements are pushed here.
- **Pop stack** (\`out_stack\`): Elements are popped from here.

When \`out_stack\` is empty and we need to dequeue, transfer all elements from \`in_stack\` to \`out_stack\`. This reverses the order, putting the oldest element on top.

### Amortized O(1) Analysis

Each element is moved at most once from \`in_stack\` to \`out_stack\`. So over n operations, the total work is O(n), giving O(1) amortized per operation.

**Worst case**: A single dequeue could take O(n) if all elements need to be transferred. But this is rare — the next n-1 dequeues are O(1).

### Alternative: Stack with Queues

You can also implement a stack using two queues. The idea: to push an element, enqueue it to queue 2, then transfer all elements from queue 1 to queue 2, then swap the queues. This makes push O(n) but pop O(1).

Or make push O(1) and pop O(n) by transferring during pop instead.

### Real-World Application

This pattern appears in:
- Implementing queues on hardware stacks
- Amortized data structures (similar to dynamic array resizing)
- Functional programming (purely functional queues use two lists)

### Interview Tips

- Mention the amortized analysis — it shows you understand the performance characteristics.
- Draw out the state of both stacks during operations.
- The interviewer may ask "what if we want O(1) worst case?" — that requires a more complex design with lazy transfers.

Implement a queue using two stacks and a stack using two queues.`,
      starterCode: `from collections import deque

class QueueWithStacks:
    """
    Implement a FIFO queue using two stacks.
    All operations are amortized O(1).
    """

    def __init__(self):
        # TODO: Initialize in_stack and out_stack
        pass

    def enqueue(self, val: int) -> None:
        """Add element to the back of the queue."""
        # TODO: Push to in_stack
        pass

    def dequeue(self) -> int:
        """Remove and return element from the front."""
        # TODO: If out_stack is empty, transfer from in_stack
        # TODO: Pop from out_stack
        pass

    def peek(self) -> int:
        """View the front element without removing."""
        # TODO: Same transfer logic as dequeue, but don't pop
        pass

    def is_empty(self) -> bool:
        # TODO: Check both stacks
        pass


class StackWithQueues:
    """
    Implement a LIFO stack using two queues.
    Push is O(n), pop is O(1).
    """

    def __init__(self):
        # TODO: Initialize main queue
        pass

    def push(self, val: int) -> None:
        """
        Push element onto the stack.
        Trick: add to queue, then rotate all previous elements behind it.
        """
        # TODO: Append val to queue
        # TODO: Rotate: popleft and append (len-1) times
        pass

    def pop(self) -> int:
        """Remove and return the top element."""
        # TODO: popleft from queue
        pass

    def top(self) -> int:
        """View the top element."""
        # TODO: Return front of queue
        pass

    def is_empty(self) -> bool:
        pass


# Test QueueWithStacks
q = QueueWithStacks()
q.enqueue(1)
q.enqueue(2)
q.enqueue(3)
print(q.dequeue())   # 1
print(q.peek())      # 2
q.enqueue(4)
print(q.dequeue())   # 2
print(q.dequeue())   # 3
print(q.dequeue())   # 4
print(q.is_empty())  # True

# Test StackWithQueues
s = StackWithQueues()
s.push(1)
s.push(2)
s.push(3)
print(s.pop())   # 3
print(s.top())   # 2
s.push(4)
print(s.pop())   # 4
print(s.pop())   # 2
print(s.pop())   # 1
print(s.is_empty())  # True
`,
      solutionCode: `from collections import deque

class QueueWithStacks:
    """
    Implement a FIFO queue using two stacks.
    All operations are amortized O(1).
    """

    def __init__(self):
        self.in_stack = []   # For enqueue
        self.out_stack = []  # For dequeue

    def enqueue(self, val: int) -> None:
        """Add element to the back of the queue."""
        self.in_stack.append(val)

    def _transfer(self) -> None:
        """Move all elements from in_stack to out_stack."""
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())

    def dequeue(self) -> int:
        """Remove and return element from the front."""
        self._transfer()
        return self.out_stack.pop()

    def peek(self) -> int:
        """View the front element without removing."""
        self._transfer()
        return self.out_stack[-1]

    def is_empty(self) -> bool:
        return not self.in_stack and not self.out_stack


class StackWithQueues:
    """
    Implement a LIFO stack using two queues.
    Push is O(n), pop is O(1).
    """

    def __init__(self):
        self.queue = deque()

    def push(self, val: int) -> None:
        """
        Push element onto the stack.
        Trick: add to queue, then rotate all previous elements behind it.
        """
        self.queue.append(val)
        # Rotate: move all elements before the new one to the back
        for _ in range(len(self.queue) - 1):
            self.queue.append(self.queue.popleft())

    def pop(self) -> int:
        """Remove and return the top element."""
        return self.queue.popleft()

    def top(self) -> int:
        """View the top element."""
        return self.queue[0]

    def is_empty(self) -> bool:
        return len(self.queue) == 0


# Test QueueWithStacks
q = QueueWithStacks()
q.enqueue(1)
q.enqueue(2)
q.enqueue(3)
print(q.dequeue())   # 1
print(q.peek())      # 2
q.enqueue(4)
print(q.dequeue())   # 2
print(q.dequeue())   # 3
print(q.dequeue())   # 4
print(q.is_empty())  # True

# Test StackWithQueues
s = StackWithQueues()
s.push(1)
s.push(2)
s.push(3)
print(s.pop())   # 3
print(s.top())   # 2
s.push(4)
print(s.pop())   # 4
print(s.pop())   # 2
print(s.pop())   # 1
print(s.is_empty())  # True
`,
    },
    {
      id: "ds-sliding-window-max",
      slug: "sliding-window-maximum",
      title: "Sliding Window Maximum (Deque)",
      content: `## Sliding Window Maximum (Deque)

Finding the maximum in a sliding window is a classic hard interview problem. The naive approach checks all k elements per window (O(n*k)). Using a **monotonic deque**, we can do it in O(n).

### The Problem

Given an array and a window size k, return the maximum value in each window as it slides from left to right.

\`\`\`
Input:  nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
Output: [3, 3, 5, 5, 6, 7]
\`\`\`

### Why a Deque?

A **deque** (double-ended queue) supports O(1) operations at both ends:
- \`append()\` / \`pop()\` at the right
- \`appendleft()\` / \`popleft()\` at the left

We need both: remove old elements from the left, remove smaller elements from the right.

### Algorithm: Monotonic Decreasing Deque

Maintain a deque of **indices** where the corresponding values are in decreasing order. The front of the deque always holds the index of the current window's maximum.

For each element:
1. **Remove expired**: If the front index is outside the current window, \`popleft()\`.
2. **Maintain monotonicity**: Pop from the right while the new element is >= the element at the right index. Those elements can never be the maximum for any future window.
3. **Add current**: Append the current index.
4. **Record result**: If we've processed at least k elements, the front of the deque is the maximum.

### Why This Works

An element is removed from the deque either because:
- It left the window (popped from left), or
- A larger element entered (popped from right — it can never be the maximum while the larger element is in the window)

Each element is added and removed at most once, giving O(n) total.

### Sliding Window Minimum

Same approach but maintain a **monotonic increasing** deque instead. Pop from the right when the new element is smaller.

### Related Problems

- **Minimum Window Substring**: Different technique (two pointers + frequency map)
- **Max of All Subarrays of Size K**: Same as this problem
- **Shortest Subarray with Sum >= K**: Monotonic deque with prefix sums

Implement sliding window maximum and minimum.`,
      starterCode: `from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    """
    Find the maximum in each sliding window of size k.

    Uses a monotonic decreasing deque (stores indices).
    Time: O(n), Space: O(k)
    """
    # TODO: Initialize deque and result list
    # TODO: For each index i:
    #   - Remove indices from front that are out of window
    #   - Remove indices from back where value <= nums[i]
    #   - Append i
    #   - If i >= k-1, append deque front value to result
    pass


def min_sliding_window(nums: list[int], k: int) -> list[int]:
    """
    Find the minimum in each sliding window of size k.

    Uses a monotonic increasing deque.
    Time: O(n), Space: O(k)
    """
    # TODO: Same pattern but maintain increasing order
    pass


def max_in_subarrays(arr: list[int], k: int) -> list[int]:
    """
    Find max minus min for each subarray of size k.
    Example: [1, 3, -1, -3, 5], k=3 → max-min = [4, 6, 8]

    Use both max and min sliding windows.
    """
    # TODO: Get max sliding window results
    # TODO: Get min sliding window results
    # TODO: Subtract element-wise
    pass


# Test cases
print(max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3))
# [3, 3, 5, 5, 6, 7]

print(max_sliding_window([1], 1))
# [1]

print(min_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3))
# [-1, -3, -3, -3, 3, 3]

print(max_in_subarrays([1, 3, -1, -3, 5], 3))
# [4, 6, 8]
`,
      solutionCode: `from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    """
    Find the maximum in each sliding window of size k.

    Uses a monotonic decreasing deque (stores indices).
    Time: O(n), Space: O(k)
    """
    dq = deque()  # Stores indices in decreasing value order
    result = []

    for i in range(len(nums)):
        # Remove indices outside the window
        while dq and dq[0] < i - k + 1:
            dq.popleft()

        # Remove smaller elements from the back
        while dq and nums[dq[-1]] <= nums[i]:
            dq.pop()

        dq.append(i)

        # Start recording when we have a full window
        if i >= k - 1:
            result.append(nums[dq[0]])

    return result


def min_sliding_window(nums: list[int], k: int) -> list[int]:
    """
    Find the minimum in each sliding window of size k.

    Uses a monotonic increasing deque.
    Time: O(n), Space: O(k)
    """
    dq = deque()
    result = []

    for i in range(len(nums)):
        # Remove indices outside the window
        while dq and dq[0] < i - k + 1:
            dq.popleft()

        # Remove larger elements from the back (maintain increasing order)
        while dq and nums[dq[-1]] >= nums[i]:
            dq.pop()

        dq.append(i)

        if i >= k - 1:
            result.append(nums[dq[0]])

    return result


def max_in_subarrays(arr: list[int], k: int) -> list[int]:
    """
    Find max minus min for each subarray of size k.
    Example: [1, 3, -1, -3, 5], k=3 → max-min = [4, 6, 8]

    Use both max and min sliding windows.
    """
    maxes = max_sliding_window(arr, k)
    mins = min_sliding_window(arr, k)
    return [mx - mn for mx, mn in zip(maxes, mins)]


# Test cases
print(max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3))
# [3, 3, 5, 5, 6, 7]

print(max_sliding_window([1], 1))
# [1]

print(min_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3))
# [-1, -3, -3, -3, 3, 3]

print(max_in_subarrays([1, 3, -1, -3, 5], 3))
# [4, 6, 8]
`,
    },
    {
      id: "ds-eval-expressions",
      slug: "evaluate-expressions",
      title: "Evaluate Expressions",
      content: `## Evaluate Expressions

Expression evaluation is a stack-powered classic that appears in interviews at Google, Amazon, and Microsoft. It tests your ability to handle operator precedence, parentheses, and multi-digit numbers.

### Basic Calculator (+ - with parentheses)

Handle addition, subtraction, and parentheses.

**Algorithm**:
1. Maintain a running \`result\` and a \`sign\` (+1 or -1).
2. When you see a digit, parse the full number.
3. When you see '+', set sign = +1.
4. When you see '-', set sign = -1.
5. When you see '(', push current result and sign onto stack, reset both.
6. When you see ')', pop sign and previous result, combine.

### Reverse Polish Notation (Postfix)

In RPN, operators come after their operands: \`2 3 +\` means \`2 + 3\`.

**Algorithm**: Use a stack. Push numbers. When you see an operator, pop two operands, compute, push result.

\`\`\`
["2", "1", "+", "3", "*"] → (2 + 1) * 3 = 9
\`\`\`

### Infix to Postfix (Shunting-Yard Algorithm)

Convert standard infix notation to postfix using operator precedence:
1. Numbers go directly to output.
2. Operators: pop operators with higher/equal precedence from stack to output, then push current operator.
3. '(' pushes to stack.
4. ')' pops to output until '(' is found.

### Handling Operator Precedence

For expressions with \`+\`, \`-\`, \`*\`, \`/\`:
- Process \`*\` and \`/\` immediately (higher precedence).
- Defer \`+\` and \`-\` (lower precedence).

**Practical approach**: Use a stack for numbers. Multiply/divide immediately with the stack top. Add/subtract at the end by summing the stack.

### Interview Tips

- Always handle **multi-digit numbers** (not just single digits).
- Handle **negative numbers** (especially at the start: "-3 + 5").
- Clarify whether division is integer division or float.
- Draw the stack state step by step for tricky cases.

Implement a basic calculator and RPN evaluator.`,
      starterCode: `def eval_rpn(tokens: list[str]) -> int:
    """
    Evaluate a Reverse Polish Notation expression.

    Example: ["2","1","+","3","*"] → 9

    Time: O(n), Space: O(n)
    """
    # TODO: Use a stack
    # TODO: For each token:
    #   - If it's a number, push it
    #   - If it's an operator, pop two operands, compute, push result
    # TODO: Handle integer division truncating toward zero
    pass


def basic_calculator(s: str) -> int:
    """
    Evaluate a string expression with +, -, and parentheses.
    Examples: "1 + 1" → 2, "(1+(4+5+2)-3)+(6+8)" → 23

    Time: O(n), Space: O(n)
    """
    # TODO: Initialize result=0, num=0, sign=1
    # TODO: Use a stack for parentheses
    # TODO: For each character:
    #   - Digit: build multi-digit number
    #   - '+': add num*sign to result, reset num, sign=1
    #   - '-': add num*sign to result, reset num, sign=-1
    #   - '(': push result and sign, reset both
    #   - ')': add num*sign to result, multiply by popped sign, add popped result
    pass


def calculate(s: str) -> int:
    """
    Evaluate expression with +, -, *, / (no parentheses).
    Integer division truncates toward zero.

    Example: "3+2*2" → 7

    Time: O(n), Space: O(n)
    """
    # TODO: Use a stack for numbers
    # TODO: Track the previous operator
    # TODO: For * and /, apply immediately to stack top
    # TODO: For + and -, push (with sign) to stack
    # TODO: Sum the stack at the end
    pass


# Test cases
print(eval_rpn(["2","1","+","3","*"]))           # 9
print(eval_rpn(["4","13","5","/","+"]))           # 6
print(eval_rpn(["10","6","9","3","+","-11","*","/","*","17","+","5","+"]))  # 22

print(basic_calculator("1 + 1"))                  # 2
print(basic_calculator("(1+(4+5+2)-3)+(6+8)"))   # 23
print(basic_calculator("2-(5-6)"))                # 3

print(calculate("3+2*2"))                         # 7
print(calculate(" 3/2 "))                         # 1
print(calculate(" 3+5 / 2 "))                     # 5
`,
      solutionCode: `def eval_rpn(tokens: list[str]) -> int:
    """
    Evaluate a Reverse Polish Notation expression.

    Example: ["2","1","+","3","*"] → 9

    Time: O(n), Space: O(n)
    """
    stack = []
    operators = {'+', '-', '*', '/'}

    for token in tokens:
        if token in operators:
            b = stack.pop()  # Second operand (popped first)
            a = stack.pop()  # First operand
            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            else:  # '/'
                # Integer division truncating toward zero
                stack.append(int(a / b))
        else:
            stack.append(int(token))

    return stack[0]


def basic_calculator(s: str) -> int:
    """
    Evaluate a string expression with +, -, and parentheses.
    Examples: "1 + 1" → 2, "(1+(4+5+2)-3)+(6+8)" → 23

    Time: O(n), Space: O(n)
    """
    result = 0
    num = 0
    sign = 1
    stack = []

    for char in s:
        if char.isdigit():
            num = num * 10 + int(char)
        elif char == '+':
            result += sign * num
            num = 0
            sign = 1
        elif char == '-':
            result += sign * num
            num = 0
            sign = -1
        elif char == '(':
            # Save current state
            stack.append(result)
            stack.append(sign)
            result = 0
            sign = 1
        elif char == ')':
            result += sign * num
            num = 0
            # Pop sign and previous result
            result *= stack.pop()  # Sign before parenthesis
            result += stack.pop()  # Previous result

    result += sign * num  # Don't forget the last number
    return result


def calculate(s: str) -> int:
    """
    Evaluate expression with +, -, *, / (no parentheses).
    Integer division truncates toward zero.

    Example: "3+2*2" → 7

    Time: O(n), Space: O(n)
    """
    stack = []
    num = 0
    prev_op = '+'
    s = s.strip() + '+'  # Add sentinel to process last number

    for char in s:
        if char.isdigit():
            num = num * 10 + int(char)
        elif char == ' ':
            continue
        else:
            # Process the previous operator with current num
            if prev_op == '+':
                stack.append(num)
            elif prev_op == '-':
                stack.append(-num)
            elif prev_op == '*':
                stack.append(stack.pop() * num)
            elif prev_op == '/':
                stack.append(int(stack.pop() / num))

            prev_op = char
            num = 0

    return sum(stack)


# Test cases
print(eval_rpn(["2","1","+","3","*"]))           # 9
print(eval_rpn(["4","13","5","/","+"]))           # 6
print(eval_rpn(["10","6","9","3","+","-11","*","/","*","17","+","5","+"]))  # 22

print(basic_calculator("1 + 1"))                  # 2
print(basic_calculator("(1+(4+5+2)-3)+(6+8)"))   # 23
print(basic_calculator("2-(5-6)"))                # 3

print(calculate("3+2*2"))                         # 7
print(calculate(" 3/2 "))                         # 1
print(calculate(" 3+5 / 2 "))                     # 5
`,
    },
  ],
};
