import { Module } from "../types";

export const twoHeapsModule: Module = {
  id: "two-heaps",
  title: "Two Heaps",
  description:
    "Master the Two Heaps pattern for median finding and sliding window problems. Learn how to use max-heap and min-heap together to efficiently track median values.",
  lessons: [
    {
      id: "two-heaps-intro",
      slug: "two-heaps-intro",
      title: "Introduction to Two Heaps",
      content: `## The Two Heaps Pattern

The **Two Heaps** pattern uses a **max-heap** and a **min-heap** together to efficiently track the median of a dynamic stream of numbers or solve other problems requiring quick access to middle elements.

<!-- voice:section_check concept="Two Heaps basic concept" -->

### Why Two Heaps?

When you need to find the median of a stream of numbers:
- Finding median in a sorted array takes O(n) to insert and O(1) to get median
- Using two heaps gives us O(log n) insertion and O(1) median access

### How It Works

1. **Max-Heap** (small numbers): Contains the smaller half of numbers
2. **Min-Heap** (large numbers): Contains the larger half of numbers
3. **Balance Property**: Heaps differ in size by at most 1
4. **Ordering Property**: All elements in max-heap ≤ all elements in min-heap

### Pattern Structure

~~~
import heapq

# Max heap (store negatives for Python)
max_heap = []  # smaller half
min_heap = []  # larger half

def insert(num):
    # Add to appropriate heap
    if not max_heap or num <= -max_heap[0]:
        heapq.heappush(max_heap, -num)
    else:
        heapq.heappush(min_heap, num)
    
    # Balance heaps
    if len(max_heap) > len(min_heap) + 1:
        heapq.heappush(min_heap, -heapq.heappop(max_heap))
    elif len(min_heap) > len(max_heap):
        heapq.heappush(max_heap, -heapq.heappop(min_heap))

def find_median():
    if len(max_heap) == len(min_heap):
        return (-max_heap[0] + min_heap[0]) / 2
    return -max_heap[0]  # max_heap has one extra
~~~

<!-- voice:key_insight insight="Split the numbers into two halves — max-heap for the smaller half, min-heap for the larger half. The median is at the top of one or both heaps." -->

### When to Use

- Finding median of a number stream
- Sliding window median
- Problems requiring access to "middle" elements

### Complexity

- **Insert:** O(log n) — heap push
- **Find Median:** O(1) — peek at heap tops
- **Space:** O(n) — store all numbers`,
    },
    {
      id: "find-median-number-stream",
      slug: "find-median-number-stream",
      title: "Find Median of Number Stream",
      content: `## Find Median of Number Stream

<!-- voice:section_check concept="Two Heaps for streaming median" -->

### Problem Statement

Design a class to calculate the median of a number stream. The class should have:
- \\\`insertNum(int num)\\\`: stores the number
- \\\`findMedian()\\\`: returns the median of all numbers inserted so far

If the count of numbers is even, the median is the average of the middle two numbers.

### Examples

~~~
MedianFinder medianFinder = new MedianFinder();
medianFinder.insertNum(3);
medianFinder.insertNum(1);
medianFinder.findMedian();  // returns 2.0
medianFinder.insertNum(5);
medianFinder.findMedian();  // returns 3.0
medianFinder.insertNum(4);
medianFinder.findMedian();  // returns 3.5
~~~

### Approach

Use two heaps:
1. **Max-heap** for the smaller half of numbers (use negative values in Python's min-heap)
2. **Min-heap** for the larger half of numbers
3. Rebalance after each insertion so heap sizes differ by at most 1

<!-- voice:key_insight insight="The max-heap contains the smaller half, so its top is the largest of the smaller numbers. If it has more elements, it's the median." -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Insert:** O(log n) — heap operations
- **Find Median:** O(1) — peek at heap tops
- **Space:** O(n) — store all numbers`,
      starterCode: `import heapq


class MedianFinder:
    """
    Class to find median of a stream of numbers using two heaps.
    
    Example:
        >>> finder = MedianFinder()
        >>> finder.insertNum(3)
        >>> finder.insertNum(1)
        >>> finder.findMedian()
        2.0
        >>> finder.insertNum(5)
        >>> finder.findMedian()
        3.0
    """
    
    def __init__(self):
        """Initialize two heaps for median finding."""
        # TODO: Initialize max_heap (smaller half) and min_heap (larger half)
        # Hint: Use negative values for max_heap in Python
        pass
    
    def insertNum(self, num):
        """
        Insert a number into the data structure.
        
        Args:
            num: int, number to insert
        """
        # TODO: Insert into appropriate heap, then rebalance
        # Hint: Compare with top of max_heap to decide where to insert
        pass
    
    def findMedian(self):
        """
        Return the median of all inserted numbers.
        
        Returns:
            float: median value
        """
        # TODO: Return median based on heap sizes
        # Hint: If heaps equal size, average the tops; else max_heap top
        pass


# ─── Test Cases ───

finder = MedianFinder()
finder.insertNum(3)
finder.insertNum(1)
print(finder.findMedian())
# Expected: 2.0

finder.insertNum(5)
print(finder.findMedian())
# Expected: 3.0

finder.insertNum(4)
print(finder.findMedian())
# Expected: 3.5

finder.insertNum(2)
print(finder.findMedian())
# Expected: 3.0

# Single element
finder2 = MedianFinder()
finder2.insertNum(10)
print(finder2.findMedian())
# Expected: 10.0
`,
      solutionCode: `import heapq


class MedianFinder:
    """
    Class to find median of a stream of numbers using two heaps.
    
    Time Complexity:
        insertNum: O(log n) — heap push
        findMedian: O(1) — peek at heap tops
    Space Complexity: O(n) — store all numbers
    """
    
    def __init__(self):
        """Initialize two heaps for median finding."""
        self.max_heap = []  # smaller half (store negatives)
        self.min_heap = []  # larger half
    
    def insertNum(self, num):
        """
        Insert a number into the data structure.
        """
        # Insert into appropriate heap
        if not self.max_heap or num <= -self.max_heap[0]:
            heapq.heappush(self.max_heap, -num)
        else:
            heapq.heappush(self.min_heap, num)
        
        # Rebalance: max_heap can have at most 1 more element
        if len(self.max_heap) > len(self.min_heap) + 1:
            heapq.heappush(self.min_heap, -heapq.heappop(self.max_heap))
        elif len(self.min_heap) > len(self.max_heap):
            heapq.heappush(self.max_heap, -heapq.heappop(self.min_heap))
    
    def findMedian(self):
        """
        Return the median of all inserted numbers.
        """
        if len(self.max_heap) == len(self.min_heap):
            # Even number of elements
            return (-self.max_heap[0] + self.min_heap[0]) / 2
        else:
            # Odd number of elements, max_heap has the extra
            return float(-self.max_heap[0])


# ─── Test Cases ───
finder = MedianFinder()
finder.insertNum(3)
finder.insertNum(1)
print(finder.findMedian())
# Expected: 2.0

finder.insertNum(5)
print(finder.findMedian())
# Expected: 3.0

finder.insertNum(4)
print(finder.findMedian())
# Expected: 3.5

finder.insertNum(2)
print(finder.findMedian())
# Expected: 3.0

finder2 = MedianFinder()
finder2.insertNum(10)
print(finder2.findMedian())
# Expected: 10.0
`,
    },
    {
      id: "sliding-window-median",
      slug: "sliding-window-median",
      title: "Sliding Window Median",
      content: `## Sliding Window Median

<!-- voice:section_check concept="Two Heaps for sliding window" -->

### Problem Statement

Given an array of numbers and a window size 'k', find the median of all contiguous subarrays of size 'k'.

### Examples

~~~
Input: nums = [1, 2, -1, 3, 5], k = 2
Output: [1.5, 0.5, 1.0, 4.0]
Explanation: 
- Window [1, 2]: median = (1+2)/2 = 1.5
- Window [2, -1]: median = (2+(-1))/2 = 0.5
- Window [-1, 3]: median = (-1+3)/2 = 1.0
- Window [3, 5]: median = (3+5)/2 = 4.0
~~~

~~~
Input: nums = [1, 2, -1, 3, 5], k = 3
Output: [1.0, 2.0, 3.0]
~~~

### Approach

Use two heaps with lazy deletion:
1. Use max-heap and min-heap as before
2. When sliding the window, mark numbers for removal instead of immediately deleting
3. Rebalance heaps and clean up tops when needed
4. Use hash map to track "delayed" deletions

<!-- voice:key_insight insight="Lazy deletion: mark elements to remove in a hash map, actually remove them only when they reach the top of a heap" -->

<!-- voice:exercise_intro difficulty="hard" hints_available="3" -->

### Complexity

- **Time:** O(n log k) — n elements, each heap operation O(log k)
- **Space:** O(k) — heaps store at most k elements`,
      starterCode: `import heapq


def median_sliding_window(nums, k):
    """
    Find median of all subarrays of size k.
    
    Args:
        nums: List of integers
        k: int, window size
    
    Returns:
        List of floats, median for each window
    
    Example:
        >>> median_sliding_window([1, 2, -1, 3, 5], 2)
        [1.5, 0.5, 1.0, 4.0]
    """
    # TODO: Use two heaps with lazy deletion for sliding window median
    # Hint: Track outgoing elements with a hash map, clean lazily
    pass


# ─── Test Cases ───

# Standard case, k=2
print(median_sliding_window([1, 2, -1, 3, 5], 2))
# Expected: [1.5, 0.5, 1.0, 4.0]

# k=3
print(median_sliding_window([1, 2, -1, 3, 5], 3))
# Expected: [1.0, 2.0, 3.0]

# Single window
print(median_sliding_window([1, 2, 3], 3))
# Expected: [2.0]

# All same numbers
print(median_sliding_window([5, 5, 5, 5], 2))
# Expected: [5.0, 5.0, 5.0]

# k=1 (each element is its own median)
print(median_sliding_window([1, 2, 3], 1))
# Expected: [1.0, 2.0, 3.0]
`,
      solutionCode: `import heapq


def median_sliding_window(nums, k):
    """
    Find median of all subarrays of size k.
    
    Time Complexity: O(n log k) — n elements, heap ops O(log k)
    Space Complexity: O(k) — heaps store window elements
    """
    def get_median():
        """Get current median from heaps."""
        if k % 2 == 1:
            return float(-max_heap[0])
        return (-max_heap[0] + min_heap[0]) / 2
    
    def prune(heap):
        """Remove delayed elements from heap top."""
        while heap:
            num = -heap[0] if heap is max_heap else heap[0]
            if num in delayed:
                heapq.heappop(heap)
                delayed[num] -= 1
                if delayed[num] == 0:
                    del delayed[num]
            else:
                break
    
    def make_balance():
        """Balance the two heaps."""
        # max_heap can have at most 1 more element
        if len(max_heap) > len(min_heap) + 1:
            num = -heapq.heappop(max_heap)
            prune(max_heap)
            heapq.heappush(min_heap, num)
        elif len(min_heap) > len(max_heap):
            num = heapq.heappop(min_heap)
            prune(min_heap)
            heapq.heappush(max_heap, -num)
    
    def insert(num):
        """Insert number into appropriate heap."""
        if not max_heap or num <= -max_heap[0]:
            heapq.heappush(max_heap, -num)
        else:
            heapq.heappush(min_heap, num)
        make_balance()
    
    def remove(num):
        """Mark number for lazy deletion."""
        delayed[num] = delayed.get(num, 0) + 1
        if num <= -max_heap[0]:
            max_size -= 1
            if num == -max_heap[0]:
                prune(max_heap)
        else:
            min_size -= 1
            if min_heap and num == min_heap[0]:
                prune(min_heap)
        make_balance()
    
    if not nums or k == 0:
        return []
    
    max_heap = []  # smaller half
    min_heap = []  # larger half
    delayed = {}   # lazy deletion tracker
    
    # Initialize with first k elements
    for i in range(k):
        heapq.heappush(max_heap, -nums[i])
    
    # Balance: move half to min_heap
    for i in range(k // 2):
        heapq.heappush(min_heap, -heapq.heappop(max_heap))
    
    result = [get_median()]
    
    # Slide window
    for i in range(k, len(nums)):
        # Remove outgoing element (nums[i-k])
        out_num = nums[i - k]
        in_num = nums[i]
        
        # Remove out_num
        delayed[out_num] = delayed.get(out_num, 0) + 1
        balance = -1 if out_num <= -max_heap[0] else 1
        
        # Insert in_num
        if in_num <= -max_heap[0]:
            heapq.heappush(max_heap, -in_num)
            balance += 1
        else:
            heapq.heappush(min_heap, in_num)
            balance -= 1
        
        # Rebalance
        if balance < 0:
            # min_heap has more
            heapq.heappush(max_heap, -heapq.heappop(min_heap))
        elif balance > 0:
            # max_heap has more
            heapq.heappush(min_heap, -heapq.heappop(max_heap))
        
        # Clean tops
        prune(max_heap)
        prune(min_heap)
        
        result.append(get_median())
    
    return result


# ─── Test Cases ───
print(median_sliding_window([1, 2, -1, 3, 5], 2))
# Expected: [1.5, 0.5, 1.0, 4.0]

print(median_sliding_window([1, 2, -1, 3, 5], 3))
# Expected: [1.0, 2.0, 3.0]

print(median_sliding_window([1, 2, 3], 3))
# Expected: [2.0]

print(median_sliding_window([5, 5, 5, 5], 2))
# Expected: [5.0, 5.0, 5.0]

print(median_sliding_window([1, 2, 3], 1))
# Expected: [1.0, 2.0, 3.0]
`,
    },
    {
      id: "maximize-capital",
      slug: "maximize-capital",
      title: "Maximize Capital (IPO)",
      content: `## Maximize Capital (IPO Problem)

<!-- voice:section_check concept="Two Heaps for project selection" -->

### Problem Statement

Given:
- Initial capital 'c'
- Number of projects you can select 'k'
- List of capitals for 'n' projects
- List of profits for 'n' projects

Each project requires at least the given capital to start, and yields the given profit upon completion. Select at most 'k' distinct projects to maximize final capital.

### Examples

~~~
Input: c = 0, k = 2, capitals = [0, 1, 2], profits = [1, 2, 3]
Output: 4
Explanation:
- Start with capital 0, can only do project 0 (capital 0)
- After project 0: capital = 0 + 1 = 1
- Now can do project 1 (capital 1), profit = 2
- Final capital = 1 + 2 = 3
- Or do project 0 then 2: 0 + 1 + 3 = 4 (optimal)
~~~

### Approach

Use two heaps:
1. **Min-heap** for capitals: find all projects we can afford
2. **Max-heap** for profits: from affordable projects, pick most profitable

Algorithm:
1. Add all projects (capital, profit) to min-heap sorted by capital
2. For each of k selections:
   - Move all affordable projects from capital heap to profit heap
   - Select most profitable project from profit heap
   - Add profit to capital

<!-- voice:key_insight insight="Use min-heap to find affordable projects, max-heap to pick the most profitable among them" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n log n + k log n) — heap operations
- **Space:** O(n) — store all projects`,
      starterCode: `import heapq


def find_maximized_capital(k, c, capitals, profits):
    """
    Find maximum capital after selecting at most k projects.
    
    Args:
        k: int, number of projects to select
        c: int, initial capital
        capitals: List of integers, capital required for each project
        profits: List of integers, profit from each project
    
    Returns:
        int: Maximum capital after k projects
    
    Example:
        >>> find_maximized_capital(2, 0, [0, 1, 2], [1, 2, 3])
        4
    """
    # TODO: Use min-heap for capitals, max-heap for profits
    # Hint: Move affordable projects to profit heap, pick max profit
    pass


# ─── Test Cases ───

# Standard case
print(find_maximized_capital(2, 0, [0, 1, 2], [1, 2, 3]))
# Expected: 4

# Can do all projects
print(find_maximized_capital(3, 0, [0, 1, 2], [1, 2, 3]))
# Expected: 6

# Limited initial capital
print(find_maximized_capital(2, 1, [0, 1, 2], [1, 2, 3]))
# Expected: 6 (start with 1, can do proj 0 or 1)

# k=0 (no projects)
print(find_maximized_capital(0, 5, [0, 1, 2], [1, 2, 3]))
# Expected: 5

# Single project
print(find_maximized_capital(1, 0, [0], [5]))
# Expected: 5
`,
      solutionCode: `import heapq


def find_maximized_capital(k, c, capitals, profits):
    """
    Find maximum capital after selecting at most k projects.
    
    Time Complexity: O(n log n + k log n) — heap operations
    Space Complexity: O(n) — store all projects
    """
    n = len(capitals)
    
    # Min-heap for capitals: (capital_required, profit)
    capital_heap = []
    for i in range(n):
        heapq.heappush(capital_heap, (capitals[i], profits[i]))
    
    # Max-heap for profits (use negative for max-heap in Python)
    profit_heap = []
    
    current_capital = c
    
    for _ in range(k):
        # Move all affordable projects to profit heap
        while capital_heap and capital_heap[0][0] <= current_capital:
            cap, prof = heapq.heappop(capital_heap)
            heapq.heappush(profit_heap, -prof)  # negative for max-heap
        
        # If no affordable projects, break
        if not profit_heap:
            break
        
        # Select most profitable project
        current_capital += -heapq.heappop(profit_heap)
    
    return current_capital


# ─── Test Cases ───
print(find_maximized_capital(2, 0, [0, 1, 2], [1, 2, 3]))
# Expected: 4

print(find_maximized_capital(3, 0, [0, 1, 2], [1, 2, 3]))
# Expected: 6

print(find_maximized_capital(2, 1, [0, 1, 2], [1, 2, 3]))
# Expected: 6

print(find_maximized_capital(0, 5, [0, 1, 2], [1, 2, 3]))
# Expected: 5

print(find_maximized_capital(1, 0, [0], [5]))
# Expected: 5
`,
    },
    {
      id: "two-heaps-checkpoint",
      slug: "two-heaps-checkpoint",
      title: "Module Checkpoint: Two Heaps",
      content: `## Module Checkpoint: Two Heaps

<!-- voice:checkpoint_intro -->

Excellent work on the Two Heaps module! Let's verify your understanding.

### Quick Review

You learned:
- Using a **max-heap** for the smaller half and **min-heap** for the larger half
- **Finding median** of a stream in O(1) after O(log n) insertion
- **Sliding window median** with lazy deletion
- **Project selection** using capitals and profits heaps

### Quiz

**Question 1:** What is the time complexity of finding the median using two heaps?
- A) O(n)
- B) O(log n)
- C) O(1)
- D) O(n log n)

**Question 2:** In the median finding pattern, what does the max-heap contain?
- A) The larger half of numbers
- B) The smaller half of numbers
- C) All numbers
- D) Only even numbers

**Question 3:** Why do we need lazy deletion in sliding window median?
- A) To save memory
- B) To remove arbitrary elements efficiently from heaps
- C) To sort the numbers
- D) It's not needed

**Question 4:** True or False: In Python, we can directly create a max-heap using heapq.

**Question 5:** In the IPO problem, which heap do we use to find affordable projects?
- A) Max-heap sorted by profit
- B) Min-heap sorted by capital
- C) Max-heap sorted by capital
- D) Min-heap sorted by profit

### Voice Summary

Your coach will ask you to:
- Explain how two heaps maintain the median property
- Walk through the sliding window median algorithm
- Describe how to solve the IPO problem

**You're mastering the Two Heaps pattern!**`,
    },
  ],
};
