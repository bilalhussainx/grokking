import { Module } from "../types";

export const topKElementsModule: Module = {
  id: "top-k-elements",
  title: "Top K Elements",
  description:
    "Master the Top K Elements pattern using heaps to efficiently find the K largest, smallest, or most frequent elements. Essential for optimization problems involving ranking and selection.",
  lessons: [
    {
      id: "top-k-elements-intro",
      slug: "top-k-elements-intro",
      title: "Introduction to Top K Elements",
      content: `## The Top K Elements Pattern

The **Top K Elements** pattern uses a **min-heap** or **max-heap** to efficiently find the K largest, smallest, or most frequent elements from a collection.

<!-- voice:section_check concept="Top K Elements basic concept" -->

### Why Top K Elements?

When you need to find the top/smallest K elements:
- Sorting takes O(n log n) time
- Using a heap takes O(n log k) time — much better when k << n

### How It Works

**Finding K Largest Elements:**
1. Use a **min-heap** of size k
2. Iterate through all elements
3. If heap size < k, add element
4. If element > heap top, replace top with element
5. Heap contains k largest elements

~~~
import heapq

def find_k_largest(nums, k):
    min_heap = []
    for num in nums:
        if len(min_heap) < k:
            heapq.heappush(min_heap, num)
        elif num > min_heap[0]:
            heapq.heapreplace(min_heap, num)
    return min_heap  # k largest elements
~~~

**Finding K Smallest Elements:**
1. Use a **max-heap** of size k (negate values in Python)
2. Similar approach as above

<!-- voice:key_insight insight="Use a min-heap of size k to track k largest elements — the smallest of the k largest is always at the top" -->

### When to Use

- Find K largest/smallest elements
- Find K most frequent elements
- Find K closest points to origin
- Kth largest/smallest element problems

### Complexity

- **Time:** O(n log k) — heap operations for n elements
- **Space:** O(k) — heap stores at most k elements`,
    },
    {
      id: "kth-largest-element",
      slug: "kth-largest-element",
      title: "Kth Largest Element in Array",
      content: `## Kth Largest Element in Array

<!-- voice:section_check concept="Min-heap for kth largest" -->

### Problem Statement

Given an integer array \`nums\` and an integer \`k\`, return the \`kth\` largest element in the array.

Note that it is the \`kth\` largest element in sorted order, not the \`kth\` distinct element.

### Examples

~~~
Input: nums = [3, 2, 1, 5, 6, 4], k = 2
Output: 5
Explanation: Sorted: [1, 2, 3, 4, 5, 6], 2nd largest is 5
~~~

~~~
Input: nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4
Output: 4
~~~

### Approach

Use a **min-heap** of size k:
1. Maintain a min-heap with k largest elements seen so far
2. The root of the min-heap is always the kth largest
3. For each number, if heap not full, add it; else if number > heap top, replace

Alternative: Use QuickSelect for O(n) average time (not covered here).

<!-- voice:key_insight insight="The kth largest element is the smallest among the k largest elements — that's exactly what a min-heap of size k tracks" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n log k) — n elements, each heap operation O(log k)
- **Space:** O(k) — heap stores k elements`,
      starterCode: `import heapq


def find_kth_largest(nums, k):
    """
    Find the kth largest element in an unsorted array.
    
    Args:
        nums: List of integers
        k: int, which largest element to find
    
    Returns:
        int: The kth largest element
    
    Example:
        >>> find_kth_largest([3, 2, 1, 5, 6, 4], 2)
        5
        >>> find_kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)
        4
    """
    # TODO: Use min-heap of size k to find kth largest
    # Hint: Heap will contain k largest elements, top is the kth largest
    pass


# ─── Test Cases ───

# Standard case
print(find_kth_largest([3, 2, 1, 5, 6, 4], 2))
# Expected: 5

# With duplicates
print(find_kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4))
# Expected: 4

# k=1 (largest element)
print(find_kth_largest([1, 2, 3, 4, 5], 1))
# Expected: 5

# k=n (smallest element)
print(find_kth_largest([1, 2, 3, 4, 5], 5))
# Expected: 1

# Single element
print(find_kth_largest([42], 1))
# Expected: 42

# All same elements
print(find_kth_largest([5, 5, 5, 5], 2))
# Expected: 5
`,
      solutionCode: `import heapq


def find_kth_largest(nums, k):
    """
    Find the kth largest element in an unsorted array.
    
    Time Complexity: O(n log k) — heap operations for n elements
    Space Complexity: O(k) — min-heap of size k
    """
    min_heap = []
    
    for num in nums:
        if len(min_heap) < k:
            heapq.heappush(min_heap, num)
        elif num > min_heap[0]:
            # Current num is larger than kth largest so far
            heapq.heapreplace(min_heap, num)
    
    # Top of min-heap is the kth largest
    return min_heap[0]


# Alternative using max-heap (negate all numbers)
def find_kth_largest_max_heap(nums, k):
    """
    Alternative using max-heap approach.
    """
    # Negate all numbers to simulate max-heap
    max_heap = [-num for num in nums]
    heapq.heapify(max_heap)
    
    # Pop k-1 largest elements
    for _ in range(k - 1):
        heapq.heappop(max_heap)
    
    # Next pop is kth largest
    return -heapq.heappop(max_heap)


# ─── Test Cases ───
print(find_kth_largest([3, 2, 1, 5, 6, 4], 2))
# Expected: 5

print(find_kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4))
# Expected: 4

print(find_kth_largest([1, 2, 3, 4, 5], 1))
# Expected: 5

print(find_kth_largest([1, 2, 3, 4, 5], 5))
# Expected: 1

print(find_kth_largest([42], 1))
# Expected: 42

print(find_kth_largest([5, 5, 5, 5], 2))
# Expected: 5
`,
    },
    {
      id: "kth-smallest-sorted-matrix",
      slug: "kth-smallest-sorted-matrix",
      title: "Kth Smallest Element in Sorted Matrix",
      content: `## Kth Smallest Element in Sorted Matrix

<!-- voice:section_check concept="Heap for kth smallest in sorted matrix" -->

### Problem Statement

Given an \`n x n\` matrix where each of the rows and columns is sorted in ascending order, return the \`kth\` smallest element in the matrix.

### Examples

~~~
Input: matrix = [[1, 5, 9], [10, 11, 13], [12, 13, 15]], k = 8
Output: 13
Explanation: Elements in sorted order: [1, 5, 9, 10, 11, 12, 13, 13, 15]
                                      1st          ...           8th
~~~

~~~
Input: matrix = [[-5]], k = 1
Output: -5
~~~

### Approach

Use a **min-heap** to merge sorted rows:
1. Start with the first element of each row (smallest of each row)
2. Pop the smallest element from heap
3. Push the next element from the same row
4. Repeat k times — the kth pop is our answer

<!-- voice:key_insight insight="Treat it like merging k sorted arrays — use heap to always get the minimum from all row heads" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(k log n) — k pops, each O(log n) for n rows
- **Space:** O(n) — heap stores at most n elements (one from each row)`,
      starterCode: `import heapq


def kth_smallest_matrix(matrix, k):
    """
    Find kth smallest element in a sorted n x n matrix.
    
    Args:
        matrix: n x n matrix where rows and columns are sorted
        k: int, which smallest element to find
    
    Returns:
        int: The kth smallest element
    
    Example:
        >>> kth_smallest_matrix([[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8)
        13
    """
    # TODO: Use min-heap to merge sorted rows
    # Hint: Start with first element of each row, track (value, row, col)
    pass


# ─── Test Cases ───

# Standard case
print(kth_smallest_matrix([[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8))
# Expected: 13

# Single element
print(kth_smallest_matrix([[-5]], 1))
# Expected: -5

# k=1 (smallest)
print(kth_smallest_matrix([[1, 2], [3, 4]], 1))
# Expected: 1

# k=n*n (largest)
print(kth_smallest_matrix([[1, 2], [3, 4]], 4))
# Expected: 4

# 2x2 matrix
print(kth_smallest_matrix([[1, 3], [2, 4]], 3))
# Expected: 3
`,
      solutionCode: `import heapq


def kth_smallest_matrix(matrix, k):
    """
    Find kth smallest element in a sorted n x n matrix.
    
    Time Complexity: O(k log n) — k heap operations, heap size n
    Space Complexity: O(n) — heap stores one element per row max
    """
    n = len(matrix)
    
    # Min-heap: (value, row, col)
    # Start with first element of each row
    min_heap = []
    for r in range(min(n, k)):  # Only need first k rows
        min_heap.append((matrix[r][0], r, 0))
    
    heapq.heapify(min_heap)
    
    # Pop k-1 smallest elements
    for _ in range(k - 1):
        val, row, col = heapq.heappop(min_heap)
        
        # Push next element from same row if exists
        if col + 1 < n:
            heapq.heappush(min_heap, (matrix[row][col + 1], row, col + 1))
    
    # kth smallest is at heap top
    return min_heap[0][0]


# Alternative: Binary Search approach (O(n log(max-min)))
def kth_smallest_binary_search(matrix, k):
    """
    Alternative using binary search on value range.
    """
    n = len(matrix)
    
    def count_less_equal(mid):
        """Count elements <= mid in sorted matrix."""
        count = 0
        row, col = n - 1, 0  # Start from bottom-left
        
        while row >= 0 and col < n:
            if matrix[row][col] <= mid:
                # All elements in this column up to row are <= mid
                count += row + 1
                col += 1
            else:
                row -= 1
        
        return count
    
    left, right = matrix[0][0], matrix[n-1][n-1]
    
    while left < right:
        mid = left + (right - left) // 2
        if count_less_equal(mid) < k:
            left = mid + 1
        else:
            right = mid
    
    return left


# ─── Test Cases ───
print(kth_smallest_matrix([[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8))
# Expected: 13

print(kth_smallest_matrix([[-5]], 1))
# Expected: -5

print(kth_smallest_matrix([[1, 2], [3, 4]], 1))
# Expected: 1

print(kth_smallest_matrix([[1, 2], [3, 4]], 4))
# Expected: 4

print(kth_smallest_matrix([[1, 3], [2, 4]], 3))
# Expected: 3
`,
    },
    {
      id: "k-closest-points-origin",
      slug: "k-closest-points-origin",
      title: "Find K Closest Points to Origin",
      content: `## Find K Closest Points to Origin

<!-- voice:section_check concept="Max-heap for k closest points" -->

### Problem Statement

Given an array of \`points\` where \`points[i] = [xi, yi]\` represents a point on the X-Y plane and an integer \`k\`, return the \`k\` closest points to the origin \`(0, 0)\`.

The distance between two points on the X-Y plane is the Euclidean distance: \`sqrt((x1 - x2)² + (y1 - y2)²)\`.

You may return the answer in any order.

### Examples

~~~
Input: points = [[1, 3], [-2, 2]], k = 1
Output: [[-2, 2]]
Explanation: 
- Distance of [1, 3] from origin = sqrt(1 + 9) = sqrt(10)
- Distance of [-2, 2] from origin = sqrt(4 + 4) = sqrt(8)
- [-2, 2] is closer
~~~

~~~
Input: points = [[3, 3], [5, -1], [-2, 4]], k = 2
Output: [[3, 3], [-2, 4]] or [[-2, 4], [3, 3]]
~~~

### Approach

Use a **max-heap** of size k:
1. Calculate squared distance for each point (avoid sqrt, same ordering)
2. Use max-heap to keep k smallest distances
3. If heap size < k, add point; else if distance < max in heap, replace

<!-- voice:key_insight insight="Use a max-heap of size k — it stores the k closest points, with the farthest among them at the top" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n log k) — n points, heap operations O(log k)
- **Space:** O(k) — heap stores k points`,
      starterCode: `import heapq


def k_closest(points, k):
    """
    Find k closest points to origin.
    
    Args:
        points: List of [x, y] coordinates
        k: int, number of closest points to return
    
    Returns:
        List of [x, y] coordinates, k closest to origin
    
    Example:
        >>> k_closest([[1, 3], [-2, 2]], 1)
        [[-2, 2]]
        >>> k_closest([[3, 3], [5, -1], [-2, 4]], 2)
        [[3, 3], [-2, 4]]  # or [[-2, 4], [3, 3]]
    """
    # TODO: Use max-heap of size k to track k closest points
    # Hint: Store (-distance, point) for max-heap in Python
    pass


# ─── Test Cases ───

# Standard case
print(k_closest([[1, 3], [-2, 2]], 1))
# Expected: [[-2, 2]]

# Two closest from three
result = k_closest([[3, 3], [5, -1], [-2, 4]], 2)
print(sorted(result))  # Sort for consistent comparison
# Expected: [[-2, 4], [3, 3]] (sorted)

# k equals number of points
print(k_closest([[1, 1], [2, 2]], 2))
# Expected: [[1, 1], [2, 2]] (any order)

# All same distance
print(k_closest([[1, 1], [-1, 1], [1, -1], [-1, -1]], 2))
# Expected: Any 2 of the 4 points

# Single point
print(k_closest([[0, 0]], 1))
# Expected: [[0, 0]]
`,
      solutionCode: `import heapq


def k_closest(points, k):
    """
    Find k closest points to origin.
    
    Time Complexity: O(n log k) — n points, heap operations O(log k)
    Space Complexity: O(k) — max-heap of size k
    """
    # Max-heap: store (-distance, point) to simulate max-heap
    max_heap = []
    
    for x, y in points:
        # Use squared distance (same ordering, avoid sqrt)
        dist = x * x + y * y
        
        if len(max_heap) < k:
            # Negate distance for max-heap behavior
            heapq.heappush(max_heap, (-dist, [x, y]))
        elif dist < -max_heap[0][0]:
            # Current point is closer than farthest in heap
            heapq.heapreplace(max_heap, (-dist, [x, y]))
    
    # Extract points from heap
    return [point for (_, point) in max_heap]


# Alternative: Sort approach (O(n log n))
def k_closest_sort(points, k):
    """
    Alternative using sorting.
    """
    # Sort by squared distance
    points.sort(key=lambda p: p[0]**2 + p[1]**2)
    return points[:k]


# Alternative: QuickSelect approach (O(n) average)
def k_closest_quickselect(points, k):
    """
    Alternative using QuickSelect for O(n) average.
    """
    def dist_sq(p):
        return p[0]**2 + p[1]**2
    
    def partition(left, right, pivot_idx):
        pivot_dist = dist_sq(points[pivot_idx])
        # Move pivot to end
        points[pivot_idx], points[right] = points[right], points[pivot_idx]
        
        store_idx = left
        for i in range(left, right):
            if dist_sq(points[i]) < pivot_dist:
                points[store_idx], points[i] = points[i], points[store_idx]
                store_idx += 1
        
        # Move pivot to final place
        points[right], points[store_idx] = points[store_idx], points[right]
        return store_idx
    
    def select(left, right, k_smallest):
        if left == right:
            return
        
        pivot_idx = left + (right - left) // 2
        pivot_idx = partition(left, right, pivot_idx)
        
        if k_smallest == pivot_idx:
            return
        elif k_smallest < pivot_idx:
            select(left, pivot_idx - 1, k_smallest)
        else:
            select(pivot_idx + 1, right, k_smallest)
    
    select(0, len(points) - 1, k)
    return points[:k]


# ─── Test Cases ───
print(k_closest([[1, 3], [-2, 2]], 1))
# Expected: [[-2, 2]]

result = k_closest([[3, 3], [5, -1], [-2, 4]], 2)
print(sorted(result))
# Expected: [[-2, 4], [3, 3]] (sorted for comparison)

print(k_closest([[1, 1], [2, 2]], 2))
# Expected: [[1, 1], [2, 2]]

print(k_closest([[0, 0]], 1))
# Expected: [[0, 0]]
`,
    },
    {
      id: "top-k-frequent-elements",
      slug: "top-k-frequent-elements",
      title: "Top K Frequent Elements",
      content: `## Top K Frequent Elements

<!-- voice:section_check concept="Min-heap for top k frequent elements" -->

### Problem Statement

Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in any order.

### Examples

~~~
Input: nums = [1, 1, 1, 2, 2, 3], k = 2
Output: [1, 2]
Explanation: 1 appears 3 times, 2 appears 2 times, 3 appears 1 time
             Top 2 frequent: 1 and 2
~~~

~~~
Input: nums = [1], k = 1
Output: [1]
~~~

### Approach

1. Count frequency of each element using hash map: O(n)
2. Use **min-heap** of size k based on frequency: O(n log k)
3. Return elements in heap

<!-- voice:key_insight insight="Use heapq.nlargest with key=frequency for a clean solution, or manually maintain a min-heap of size k" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n log k) — counting O(n), heap operations O(n log k)
- **Space:** O(n + k) — frequency map O(n), heap O(k)`,
      starterCode: `import heapq
from collections import Counter


def top_k_frequent(nums, k):
    """
    Find k most frequent elements.
    
    Args:
        nums: List of integers
        k: int, number of most frequent elements to return
    
    Returns:
        List of k most frequent elements
    
    Example:
        >>> top_k_frequent([1, 1, 1, 2, 2, 3], 2)
        [1, 2]
        >>> top_k_frequent([1], 1)
        [1]
    """
    # TODO: Count frequencies, then use min-heap to find top k
    # Hint: Use Counter for frequencies, then heap with (freq, num)
    pass


# ─── Test Cases ───

# Standard case
result = top_k_frequent([1, 1, 1, 2, 2, 3], 2)
print(sorted(result))  # Sort for consistent comparison
# Expected: [1, 2]

# Single element
print(top_k_frequent([1], 1))
# Expected: [1]

# All same frequency (any k elements valid)
result = top_k_frequent([1, 2, 3, 4], 2)
print(len(result))
# Expected: 2

# k equals unique elements
result = top_k_frequent([1, 1, 2, 2], 2)
print(sorted(result))
# Expected: [1, 2]

# More complex case
result = top_k_frequent([4, 1, -1, 2, -1, 2, 3], 2)
print(sorted(result))
# Expected: [-1, 2] (both appear twice)
`,
      solutionCode: `import heapq
from collections import Counter


def top_k_frequent(nums, k):
    """
    Find k most frequent elements.
    
    Time Complexity: O(n log k) — counting O(n), heap O(n log k)
    Space Complexity: O(n) — frequency map
    """
    # Count frequencies
    freq_map = Counter(nums)
    
    # Use min-heap of size k
    min_heap = []
    
    for num, freq in freq_map.items():
        if len(min_heap) < k:
            heapq.heappush(min_heap, (freq, num))
        elif freq > min_heap[0][0]:
            heapq.heapreplace(min_heap, (freq, num))
    
    # Extract elements
    return [num for (freq, num) in min_heap]


# Cleaner alternative using heapq.nlargest
def top_k_frequent_clean(nums, k):
    """
    Clean solution using heapq.nlargest.
    """
    freq_map = Counter(nums)
    # nlargest returns k elements with largest frequency
    return heapq.nlargest(k, freq_map.keys(), key=freq_map.get)


# Alternative using bucket sort (O(n) time)
def top_k_frequent_bucket(nums, k):
    """
    O(n) solution using bucket sort.
    """
    freq_map = Counter(nums)
    n = len(nums)
    
    # Buckets[i] contains elements with frequency i
    buckets = [[] for _ in range(n + 1)]
    
    for num, freq in freq_map.items():
        buckets[freq].append(num)
    
    # Collect from highest frequency bucket
    result = []
    for i in range(n, 0, -1):
        result.extend(buckets[i])
        if len(result) >= k:
            return result[:k]
    
    return result[:k]


# ─── Test Cases ───
result = top_k_frequent([1, 1, 1, 2, 2, 3], 2)
print(sorted(result))
# Expected: [1, 2]

print(top_k_frequent([1], 1))
# Expected: [1]

result = top_k_frequent([1, 2, 3, 4], 2)
print(len(result))
# Expected: 2

result = top_k_frequent([1, 1, 2, 2], 2)
print(sorted(result))
# Expected: [1, 2]

result = top_k_frequent([4, 1, -1, 2, -1, 2, 3], 2)
print(sorted(result))
# Expected: [-1, 2]
`,
    },
    {
      id: "top-k-elements-checkpoint",
      slug: "top-k-elements-checkpoint",
      title: "Module Checkpoint: Top K Elements",
      content: `## Module Checkpoint: Top K Elements

<!-- voice:checkpoint_intro -->

Great work on the Top K Elements module! Let's verify your understanding.

### Quick Review

You learned:
- Using a **min-heap of size k** to find k largest elements
- Using a **max-heap of size k** to find k smallest/closest elements
- Finding **kth largest/smallest** element in O(n log k) time
- Handling **2D problems** like closest points to origin
- Finding **top k frequent elements** with frequency counting

### Quiz

**Question 1:** What is the time complexity of finding k largest elements using a heap?
- A) O(n log n)
- B) O(n log k)
- C) O(k log n)
- D) O(n)

**Question 2:** For finding kth largest element, what type of heap should we use?
- A) Max-heap of size k
- B) Min-heap of size k
- C) Max-heap of size n
- D) Min-heap of size n

**Question 3:** In the K Closest Points problem, why don't we need to compute the actual sqrt distance?
- A) It's too slow
- B) Squared distance preserves the ordering
- C) We don't care about exact values
- D) It's not mathematically correct

**Question 4:** True or False: For Top K Frequent Elements, we can use bucket sort for an O(n) solution.

**Question 5:** In a sorted matrix kth smallest problem, what is the heap size?
- A) k
- B) n (number of rows)
- C) n² (all elements)
- D) log n

### Voice Summary

Your coach will ask you to:
- Explain why min-heap is used for k largest elements
- Walk through the kth smallest in sorted matrix algorithm
- Describe the approach for top k frequent elements
- Compare time complexity with sorting approach

**You're mastering the Top K Elements pattern!**`,
    },
  ],
};
