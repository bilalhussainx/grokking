import { Module } from "../types";

export const segmentTreeModule: Module = {
  id: "segment-tree",
  title: "Segment Tree",
  description:
    "Master the Segment Tree data structure for efficient range queries and updates. Learn to solve range sum, range maximum, and order statistic problems with O(log n) operations.",
  lessons: [
    {
      id: "segment-tree-intro",
      slug: "segment-tree-intro",
      title: "Introduction to Segment Tree",
      content: `## The Segment Tree Pattern

A **Segment Tree** is a tree data structure for storing information about intervals or segments. It allows querying and updating intervals in O(log n) time.

<!-- voice:section_check concept="Segment Tree basic concept" -->

### Why Segment Tree?

When you need:
1. **Range queries** — sum, min, max, gcd over a range
2. **Point updates** — change a single element
3. **Both operations** frequently on the same array

| Operation | Array | Prefix Sum | Segment Tree |
|-----------|-------|------------|--------------|
| Build | O(1) | O(n) | O(n) |
| Point Update | O(1) | O(n) | O(log n) |
| Range Query | O(n) | O(1) | O(log n) |

Segment Tree balances both operations!

### Structure

- **Leaf nodes**: Individual array elements
- **Internal nodes**: Aggregate of children (sum, min, max, etc.)
- **Root**: Represents entire array

For array [1, 3, 5, 7, 9, 11]:
~~~
         [36]           (sum of all)
       /      \\
    [9]        [27]      (sum of halves)
   /   \\      /    \\
 [4]   [5]  [16]   [11]
 / \\   |    /  \\    |
1   3  5    7   9   11
~~~

### Core Operations

**Build:** Recursively build from array
~~~
def build(node, start, end):
    if start == end:
        tree[node] = arr[start]
    else:
        mid = (start + end) // 2
        build(2*node, start, mid)
        build(2*node+1, mid+1, end)
        tree[node] = tree[2*node] + tree[2*node+1]
~~~

**Query:** Get sum/range over [L, R]
~~~
def query(node, start, end, L, R):
    if R < start or end < L: return 0  # No overlap
    if L <= start and end <= R: return tree[node]  # Total overlap
    # Partial overlap
    mid = (start + end) // 2
    return query(2*node, start, mid, L, R) + \\
           query(2*node+1, mid+1, end, L, R)
~~~

**Update:** Change value at index
~~~
def update(node, start, end, idx, val):
    if start == end:
        tree[node] = val
    else:
        mid = (start + end) // 2
        if start <= idx <= mid:
            update(2*node, start, mid, idx, val)
        else:
            update(2*node+1, mid+1, end, idx, val)
        tree[node] = tree[2*node] + tree[2*node+1]
~~~

<!-- voice:key_insight insight="Segment tree stores partial results — querying a range only needs O(log n) nodes instead of scanning all elements" -->

### When to Use

- Range sum/min/max queries with point updates
- Frequency counting problems
- Order statistics (kth smallest)
- Lazy propagation for range updates (advanced)

### Complexity

- **Build:** O(n)
- **Query:** O(log n)
- **Update:** O(log n)
- **Space:** O(4n) for array representation`,
    },
    {
      id: "range-sum-query-mutable",
      slug: "range-sum-query-mutable",
      title: "Range Sum Query - Mutable",
      content: `## Range Sum Query - Mutable

<!-- voice:section_check concept="Segment tree for sum queries" -->

### Problem Statement

Given an integer array \`nums\`, handle multiple queries:
1. \`sumRange(left, right)\`: Return sum of elements between indices left and right inclusive
2. \`update(index, val)\`: Update element at index to val

### Examples

~~~
Input:
["NumArray", "sumRange", "update", "sumRange"]
[[[1, 3, 5]], [0, 2], [1, 2], [0, 2]]

Output:
[null, 9, null, 8]

Explanation:
NumArray numArray = new NumArray([1, 3, 5])
numArray.sumRange(0, 2)  # 1 + 3 + 5 = 9
numArray.update(1, 2)    # nums = [1, 2, 5]
numArray.sumRange(0, 2)  # 1 + 2 + 5 = 8
~~~

### Approach

**Segment Tree:**
1. Build tree from initial array
2. sumRange: Query sum over range [left, right]
3. update: Update leaf and propagate changes up

**Alternative: Binary Indexed Tree (Fenwick Tree)**
- Less code, same complexity
- Only works for invertible operations (sum, not max)

<!-- voice:key_insight insight="Use iterative segment tree for cleaner code — store tree in array where tree[i] is parent of tree[2i] and tree[2i+1]" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Build:** O(n)
- **sumRange:** O(log n)
- **update:** O(log n)
- **Space:** O(n)`,
      starterCode: `class NumArray:
    """
    Segment Tree implementation for range sum queries with updates.
    
    Example:
        >>> nums = NumArray([1, 3, 5])
        >>> nums.sumRange(0, 2)
        9
        >>> nums.update(1, 2)
        >>> nums.sumRange(0, 2)
        8
    """
    
    def __init__(self, nums):
        """Initialize with nums array."""
        # TODO: Build segment tree
        pass
    
    def update(self, index, val):
        """Update nums[index] to val."""
        # TODO: Update segment tree
        pass
    
    def sumRange(self, left, right):
        """Return sum of nums[left..right]."""
        # TODO: Query segment tree
        pass


# ─── Test Cases ───

# Basic operations
nums = NumArray([1, 3, 5])
print(nums.sumRange(0, 2))  # Expected: 9

nums.update(1, 2)
print(nums.sumRange(0, 2))  # Expected: 8

# Single element
nums2 = NumArray([5])
print(nums2.sumRange(0, 0))  # Expected: 5
nums2.update(0, 10)
print(nums2.sumRange(0, 0))  # Expected: 10

# Multiple updates
nums3 = NumArray([0, 9, 5, 7, 3])
print(nums3.sumRange(0, 4))  # Expected: 24
nums3.update(1, 1)
print(nums3.sumRange(0, 4))  # Expected: 16
nums3.update(2, 2)
print(nums3.sumRange(0, 2))  # Expected: 3
`,
      solutionCode: `class NumArray:
    """
    Segment Tree implementation for range sum queries with updates.
    
    Time Complexity:
        __init__: O(n)
        update: O(log n)
        sumRange: O(log n)
    Space Complexity: O(n)
    """
    
    def __init__(self, nums):
        self.n = len(nums)
        # Use 4*n size for safety (max nodes in segment tree)
        self.tree = [0] * (4 * self.n)
        self.nums = nums
        if self.n > 0:
            self._build(0, 0, self.n - 1, nums)
    
    def _build(self, node, start, end, nums):
        """Build segment tree recursively."""
        if start == end:
            self.tree[node] = nums[start]
        else:
            mid = (start + end) // 2
            self._build(2 * node + 1, start, mid, nums)
            self._build(2 * node + 2, mid + 1, end, nums)
            self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def update(self, index, val):
        """Update nums[index] to val."""
        self._update(0, 0, self.n - 1, index, val)
    
    def _update(self, node, start, end, idx, val):
        """Update segment tree recursively."""
        if start == end:
            self.tree[node] = val
        else:
            mid = (start + end) // 2
            if start <= idx <= mid:
                self._update(2 * node + 1, start, mid, idx, val)
            else:
                self._update(2 * node + 2, mid + 1, end, idx, val)
            self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def sumRange(self, left, right):
        """Return sum of nums[left..right]."""
        return self._query(0, 0, self.n - 1, left, right)
    
    def _query(self, node, start, end, L, R):
        """Query sum over range [L, R]."""
        # No overlap
        if R < start or end < L:
            return 0
        # Total overlap
        if L <= start and end <= R:
            return self.tree[node]
        # Partial overlap
        mid = (start + end) // 2
        left_sum = self._query(2 * node + 1, start, mid, L, R)
        right_sum = self._query(2 * node + 2, mid + 1, end, L, R)
        return left_sum + right_sum


# Iterative Segment Tree (more efficient)
class NumArrayIterative:
    """Iterative segment tree implementation."""
    
    def __init__(self, nums):
        n = len(nums)
        self.n = n
        # Size to next power of 2
        self.size = 1
        while self.size < n:
            self.size *= 2
        
        # Tree has 2*size elements
        self.tree = [0] * (2 * self.size)
        
        # Copy nums to leaves
        for i in range(n):
            self.tree[self.size + i] = nums[i]
        
        # Build tree
        for i in range(self.size - 1, 0, -1):
            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]
    
    def update(self, index, val):
        # Update leaf
        i = self.size + index
        self.tree[i] = val
        
        # Propagate up
        i //= 2
        while i >= 1:
            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]
            i //= 2
    
    def sumRange(self, left, right):
        # Convert to leaf indices
        l = self.size + left
        r = self.size + right
        res = 0
        
        while l <= r:
            if l % 2 == 1:  # l is right child
                res += self.tree[l]
                l += 1
            if r % 2 == 0:  # r is left child
                res += self.tree[r]
                r -= 1
            l //= 2
            r //= 2
        
        return res


# ─── Test Cases ───
nums = NumArray([1, 3, 5])
print(nums.sumRange(0, 2))  # Expected: 9

nums.update(1, 2)
print(nums.sumRange(0, 2))  # Expected: 8

nums2 = NumArray([5])
print(nums2.sumRange(0, 0))  # Expected: 5
nums2.update(0, 10)
print(nums2.sumRange(0, 0))  # Expected: 10

nums3 = NumArray([0, 9, 5, 7, 3])
print(nums3.sumRange(0, 4))  # Expected: 24
nums3.update(1, 1)
print(nums3.sumRange(0, 4))  # Expected: 16
nums3.update(2, 2)
print(nums3.sumRange(0, 2))  # Expected: 3
`,
    },
    {
      id: "range-maximum-query",
      slug: "range-maximum-query",
      title: "Range Maximum Query",
      content: `## Range Maximum Query

<!-- voice:section_check concept="Segment tree for max queries" -->

### Problem Statement

Given an integer array \`nums\`, handle multiple queries:
1. \`query(left, right)\`: Return maximum element between indices left and right inclusive
2. \`update(index, val)\`: Update element at index to val

### Examples

~~~
Input:
["SegTree", "query", "update", "query"]
[[[1, 3, 5, 7, 9]], [0, 4], [2, 10], [0, 4]]

Output:
[null, 9, null, 10]

Explanation:
SegTree st = new SegTree([1, 3, 5, 7, 9])
st.query(0, 4)     # max([1,3,5,7,9]) = 9
st.update(2, 10)   # nums = [1, 3, 10, 7, 9]
st.query(0, 4)     # max([1,3,10,7,9]) = 10
~~~

### Approach

**Segment Tree for Maximum:**
- Same structure as sum segment tree
- Internal nodes store max of children instead of sum
- Query returns max over range

**Changes from Sum Segment Tree:**
- Merge operation: max(left, right) instead of left + right
- Base case for no overlap: -infinity instead of 0

<!-- voice:key_insight insight="Segment tree can aggregate any associative operation — max, min, gcd, sum — just change the merge function" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Build:** O(n)
- **Query:** O(log n)
- **Update:** O(log n)
- **Space:** O(n)`,
      starterCode: `class SegTreeMax:
    """
    Segment Tree for range maximum queries with updates.
    
    Example:
        >>> st = SegTreeMax([1, 3, 5, 7, 9])
        >>> st.query(0, 4)
        9
        >>> st.update(2, 10)
        >>> st.query(0, 4)
        10
    """
    
    def __init__(self, nums):
        """Initialize with nums array."""
        # TODO: Build max segment tree
        pass
    
    def update(self, index, val):
        """Update nums[index] to val."""
        # TODO: Update max segment tree
        pass
    
    def query(self, left, right):
        """Return max of nums[left..right]."""
        # TODO: Query max segment tree
        pass


# ─── Test Cases ───

# Basic operations
st = SegTreeMax([1, 3, 5, 7, 9])
print(st.query(0, 4))  # Expected: 9
print(st.query(0, 2))  # Expected: 5
print(st.query(3, 4))  # Expected: 9

st.update(2, 10)
print(st.query(0, 4))  # Expected: 10
print(st.query(0, 2))  # Expected: 10

# Single element
st2 = SegTreeMax([5])
print(st2.query(0, 0))  # Expected: 5
st2.update(0, 100)
print(st2.query(0, 0))  # Expected: 100

# Decreasing array
st3 = SegTreeMax([9, 7, 5, 3, 1])
print(st3.query(0, 4))  # Expected: 9
print(st3.query(2, 4))  # Expected: 5
st3.update(4, 10)
print(st3.query(2, 4))  # Expected: 10
`,
      solutionCode: `class SegTreeMax:
    """
    Segment Tree for range maximum queries with updates.
    
    Time Complexity:
        __init__: O(n)
        update: O(log n)
        query: O(log n)
    Space Complexity: O(n)
    """
    
    def __init__(self, nums):
        self.n = len(nums)
        self.tree = [float('-inf')] * (4 * self.n)
        if self.n > 0:
            self._build(0, 0, self.n - 1, nums)
    
    def _build(self, node, start, end, nums):
        """Build max segment tree."""
        if start == end:
            self.tree[node] = nums[start]
        else:
            mid = (start + end) // 2
            self._build(2 * node + 1, start, mid, nums)
            self._build(2 * node + 2, mid + 1, end, nums)
            self.tree[node] = max(self.tree[2 * node + 1], self.tree[2 * node + 2])
    
    def update(self, index, val):
        """Update nums[index] to val."""
        self._update(0, 0, self.n - 1, index, val)
    
    def _update(self, node, start, end, idx, val):
        """Update max segment tree."""
        if start == end:
            self.tree[node] = val
        else:
            mid = (start + end) // 2
            if start <= idx <= mid:
                self._update(2 * node + 1, start, mid, idx, val)
            else:
                self._update(2 * node + 2, mid + 1, end, idx, val)
            self.tree[node] = max(self.tree[2 * node + 1], self.tree[2 * node + 2])
    
    def query(self, left, right):
        """Return max of nums[left..right]."""
        return self._query(0, 0, self.n - 1, left, right)
    
    def _query(self, node, start, end, L, R):
        """Query max over range [L, R]."""
        # No overlap
        if R < start or end < L:
            return float('-inf')
        # Total overlap
        if L <= start and end <= R:
            return self.tree[node]
        # Partial overlap
        mid = (start + end) // 2
        left_max = self._query(2 * node + 1, start, mid, L, R)
        right_max = self._query(2 * node + 2, mid + 1, end, L, R)
        return max(left_max, right_max)


# Generic segment tree (works for any associative operation)
class SegTree:
    """Generic segment tree with custom operation."""
    
    def __init__(self, nums, op, default):
        """
        Args:
            nums: Array of values
            op: Binary operation (e.g., max, min, lambda x,y: x+y)
            default: Identity for op (e.g., -inf for max, 0 for sum)
        """
        self.n = len(nums)
        self.op = op
        self.default = default
        self.tree = [default] * (4 * self.n)
        if self.n > 0:
            self._build(0, 0, self.n - 1, nums)
    
    def _build(self, node, start, end, nums):
        if start == end:
            self.tree[node] = nums[start]
        else:
            mid = (start + end) // 2
            self._build(2 * node + 1, start, mid, nums)
            self._build(2 * node + 2, mid + 1, end, nums)
            self.tree[node] = self.op(self.tree[2 * node + 1], self.tree[2 * node + 2])
    
    def update(self, index, val):
        self._update(0, 0, self.n - 1, index, val)
    
    def _update(self, node, start, end, idx, val):
        if start == end:
            self.tree[node] = val
        else:
            mid = (start + end) // 2
            if start <= idx <= mid:
                self._update(2 * node + 1, start, mid, idx, val)
            else:
                self._update(2 * node + 2, mid + 1, end, idx, val)
            self.tree[node] = self.op(self.tree[2 * node + 1], self.tree[2 * node + 2])
    
    def query(self, left, right):
        return self._query(0, 0, self.n - 1, left, right)
    
    def _query(self, node, start, end, L, R):
        if R < start or end < L:
            return self.default
        if L <= start and end <= R:
            return self.tree[node]
        mid = (start + end) // 2
        left_val = self._query(2 * node + 1, start, mid, L, R)
        right_val = self._query(2 * node + 2, mid + 1, end, L, R)
        return self.op(left_val, right_val)


# ─── Test Cases ───
st = SegTreeMax([1, 3, 5, 7, 9])
print(st.query(0, 4))  # Expected: 9
print(st.query(0, 2))  # Expected: 5
print(st.query(3, 4))  # Expected: 9

st.update(2, 10)
print(st.query(0, 4))  # Expected: 10
print(st.query(0, 2))  # Expected: 10

st2 = SegTreeMax([5])
print(st2.query(0, 0))  # Expected: 5
st2.update(0, 100)
print(st2.query(0, 0))  # Expected: 100

st3 = SegTreeMax([9, 7, 5, 3, 1])
print(st3.query(0, 4))  # Expected: 9
print(st3.query(2, 4))  # Expected: 5
st3.update(4, 10)
print(st3.query(2, 4))  # Expected: 10
`,
    },
    {
      id: "count-of-smaller-numbers",
      slug: "count-of-smaller-numbers",
      title: "Count of Smaller Numbers After Self",
      content: `## Count of Smaller Numbers After Self

<!-- voice:section_check concept="Segment tree for counting/inversion problems" -->

### Problem Statement

Given an integer array \`nums\`, return a new array \`counts\` where \`counts[i]\` is the number of smaller elements to the right of \`nums[i]\`.

### Examples

~~~
Input: nums = [5, 2, 6, 1]
Output: [2, 1, 1, 0]
Explanation:
- 5: elements smaller to right are [2, 1] → count = 2
- 2: elements smaller to right are [1] → count = 1
- 6: elements smaller to right are [1] → count = 1
- 1: no elements to right → count = 0
~~~

~~~
Input: nums = [-1, -1]
Output: [0, 0]
~~~

### Approach

**Segment Tree for Frequency Counting:**
1. Coordinate compression: Map values to [0, n-1] range
2. Process array from right to left
3. For each element:
   - Query segment tree for count of elements < current
   - Update segment tree: increment count at current value

**Alternative: Fenwick Tree / Binary Indexed Tree** — more space efficient

<!-- voice:key_insight insight="Process right-to-left and use segment tree to count how many of each value we've seen — query sum over [0, current-1]" -->

<!-- voice:exercise_intro difficulty="hard" hints_available="3" -->

### Complexity

- **Coordinate compression:** O(n log n)
- **Query/Update:** O(log n) each
- **Total:** O(n log n) time, O(n) space`,
      starterCode: `def count_smaller(nums):
    """
    Return count of smaller elements to the right of each element.
    
    Args:
        nums: List of integers
    
    Returns:
        List of counts
    
    Example:
        >>> count_smaller([5, 2, 6, 1])
        [2, 1, 1, 0]
        >>> count_smaller([-1, -1])
        [0, 0]
    """
    # TODO: Use segment tree with coordinate compression
    # Hint: Compress values, then process right-to-left
    pass


# ─── Test Cases ───

# Standard case
print(count_smaller([5, 2, 6, 1]))
# Expected: [2, 1, 1, 0]

# All same elements
print(count_smaller([-1, -1]))
# Expected: [0, 0]

# Increasing sequence
print(count_smaller([1, 2, 3, 4]))
# Expected: [0, 0, 0, 0]

# Decreasing sequence
print(count_smaller([4, 3, 2, 1]))
# Expected: [3, 2, 1, 0]

# Single element
print(count_smaller([1]))
# Expected: [0]

# Empty array
print(count_smaller([]))
# Expected: []

# With duplicates
print(count_smaller([2, 0, 1]))
# Expected: [2, 0, 0]
`,
      solutionCode: `class SegmentTree:
    """Segment tree for sum queries."""
    def __init__(self, size):
        self.n = size
        self.tree = [0] * (4 * size)
    
    def update(self, index, delta=1):
        """Add delta at index."""
        self._update(0, 0, self.n - 1, index, delta)
    
    def _update(self, node, start, end, idx, delta):
        if start == end:
            self.tree[node] += delta
        else:
            mid = (start + end) // 2
            if idx <= mid:
                self._update(2 * node + 1, start, mid, idx, delta)
            else:
                self._update(2 * node + 2, mid + 1, end, idx, delta)
            self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def query(self, left, right):
        """Sum over range [left, right]."""
        if left > right:
            return 0
        return self._query(0, 0, self.n - 1, left, right)
    
    def _query(self, node, start, end, L, R):
        if R < start or end < L:
            return 0
        if L <= start and end <= R:
            return self.tree[node]
        mid = (start + end) // 2
        return self._query(2 * node + 1, start, mid, L, R) + \\
               self._query(2 * node + 2, mid + 1, end, L, R)


def count_smaller(nums):
    """
    Return count of smaller elements to the right of each element.
    
    Time Complexity: O(n log n)
    Space Complexity: O(n)
    """
    if not nums:
        return []
    
    # Coordinate compression
    sorted_unique = sorted(set(nums))
    rank = {v: i for i, v in enumerate(sorted_unique)}
    
    # Process right to left
    st = SegmentTree(len(sorted_unique))
    result = []
    
    for num in reversed(nums):
        r = rank[num]
        # Count elements with rank < r (smaller values)
        count = st.query(0, r - 1)
        result.append(count)
        # Add current element
        st.update(r)
    
    # Reverse to get original order
    return result[::-1]


# Alternative: Fenwick Tree (Binary Indexed Tree)
class FenwickTree:
    """Fenwick Tree for sum queries."""
    def __init__(self, size):
        self.n = size
        self.tree = [0] * (size + 1)
    
    def update(self, index, delta=1):
        """Add delta at index (0-indexed)."""
        i = index + 1  # Fenwick tree is 1-indexed
        while i <= self.n:
            self.tree[i] += delta
            i += i & -i
    
    def query(self, index):
        """Sum of [0, index] (0-indexed)."""
        if index < 0:
            return 0
        i = index + 1
        res = 0
        while i > 0:
            res += self.tree[i]
            i -= i & -i
        return res


def count_smaller_fenwick(nums):
    """Fenwick tree implementation (more concise)."""
    if not nums:
        return []
    
    # Coordinate compression
    sorted_unique = sorted(set(nums))
    rank = {v: i for i, v in enumerate(sorted_unique)}
    
    ft = FenwickTree(len(sorted_unique))
    result = []
    
    for num in reversed(nums):
        r = rank[num]
        count = ft.query(r - 1)
        result.append(count)
        ft.update(r)
    
    return result[::-1]


# ─── Test Cases ───
print(count_smaller([5, 2, 6, 1]))
# Expected: [2, 1, 1, 0]

print(count_smaller([-1, -1]))
# Expected: [0, 0]

print(count_smaller([1, 2, 3, 4]))
# Expected: [0, 0, 0, 0]

print(count_smaller([4, 3, 2, 1]))
# Expected: [3, 2, 1, 0]

print(count_smaller([1]))
# Expected: [0]

print(count_smaller([]))
# Expected: []

print(count_smaller([2, 0, 1]))
# Expected: [2, 0, 0]
`,
    },
    {
      id: "segment-tree-checkpoint",
      slug: "segment-tree-checkpoint",
      title: "Module Checkpoint: Segment Tree",
      content: `## Module Checkpoint: Segment Tree

<!-- voice:checkpoint_intro -->

Great work on the Segment Tree module! Let's verify your understanding.

### Quick Review

You learned:
- **Segment Tree structure**: Complete binary tree storing range aggregates
- **Build:** O(n) recursive construction
- **Query:** O(log n) range queries
- **Update:** O(log n) point updates
- **Range Maximum Query:** Same structure, different aggregation
- **Count Smaller:** Coordinate compression + frequency counting

### Quiz

**Question 1:** What is the time complexity of a range query in a segment tree?
- A) O(1)
- B) O(log n)
- C) O(n)
- D) O(n log n)

**Question 2:** What is the space complexity of a segment tree?
- A) O(n)
- B) O(4n) typically
- C) O(log n)
- D) O(1)

**Question 3:** Why do we use coordinate compression in the "Count of Smaller Numbers" problem?
- A) To make the code shorter
- B) To handle negative numbers and large ranges
- C) To sort the array
- D) It's not necessary

**Question 4:** True or False: Segment trees can only be used for sum queries.

**Question 5:** What is the key difference between sum and max segment trees?
- A) Nothing, they're the same
- B) The merge operation (sum vs max) and identity value (0 vs -inf)
- C) The tree structure is different
- D) Query time complexity differs

### Voice Summary

Your coach will ask you to:
- Explain segment tree structure and operations
- Walk through a range query example
- Explain coordinate compression
- Compare segment tree with prefix sums

**You're mastering the Segment Tree pattern!**`,
    },
  ],
};
