import { Module } from "../types";

export const mergeIntervalsModule: Module = {
  id: "merge-intervals",
  title: "Merge Intervals",
  description:
    "Master interval manipulation problems including merging overlapping intervals, finding intersections, and scheduling. Essential for calendar, scheduling, and range problems.",
  lessons: [
    {
      id: "merge-intervals-intro",
      slug: "merge-intervals-intro",
      title: "Introduction to Merge Intervals",
      content: `## The Merge Intervals Pattern

The **merge intervals** pattern deals with problems involving ranges or time periods. These problems typically require finding overlaps, merging adjacent ranges, or detecting conflicts.

\`\`\`mermaid
graph LR
    subgraph Before
        A["[1,3]"] ~~~ B["[2,6]"] ~~~ C["[8,10]"] ~~~ D["[15,18]"]
    end
    subgraph After
        E["[1,6]"] ~~~ F["[8,10]"] ~~~ G["[15,18]"]
    end
    Before -->|merge| After
    style A fill:#f59e0b
    style B fill:#f59e0b
    style E fill:#4ade80
\`\`\`

<!-- voice:section_check concept="interval problems overview" -->

### Common Interval Problems

| Problem Type | Description |
|--------------|-------------|
| **Merge Overlapping** | Combine overlapping intervals into minimal set |
| **Find Intersections** | Find common ranges between two sets |
| **Insert Interval** | Add a new interval to existing set |
| **Conflicts** | Detect overlapping appointments |

<!-- voice:key_insight insight="Most interval problems are solved by first sorting by start time, then iterating with a tracking variable" -->

### Pattern Structure

~~~
1. Sort intervals by start time
2. Initialize result with first interval
3. For each subsequent interval:
   - If it overlaps with last result interval: merge them
   - Else: add as new interval to result
4. Return merged intervals
~~~

### Overlap Condition

Two intervals [a, b] and [c, d] overlap if:
~~~
b >= c  (end of first >= start of second)
~~~

### Complexity

- **Time:** O(n log n) — dominated by sorting.
- **Space:** O(n) — for the result array.`,
    },
    {
      id: "merge-overlapping-intervals",
      slug: "merge-overlapping-intervals",
      title: "Merge Overlapping Intervals",
      content: `## Merge Overlapping Intervals

<!-- voice:section_check concept="merging overlapping intervals" -->

### Problem Statement

Given a collection of intervals, merge all **overlapping intervals** and return the minimal set of non-overlapping intervals.

### Examples

~~~
Input:  [[1, 3], [2, 6], [8, 10], [15, 18]]
Output: [[1, 6], [8, 10], [15, 18]]
Explanation: [1, 3] and [2, 6] overlap, merge into [1, 6]
~~~

~~~
Input:  [[1, 4], [4, 5]]
Output: [[1, 5]]
Explanation: Adjacent intervals (touching) are merged
~~~

### Approach

1. **Sort** intervals by start time
2. Initialize result with first interval
3. For each next interval:
   - If start ≤ end of last merged: merge (extend end if needed)
   - Else: add new interval to result

<!-- voice:key_insight insight="After sorting by start time, we only need to check if the current interval overlaps with the last one in our result" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n log n) — sorting dominates.
- **Space:** O(n) — result storage.`,
      starterCode: `def merge_intervals(intervals):
    """
    Merge all overlapping intervals into minimal set.
    
    Args:
        intervals: List of [start, end] pairs
    
    Returns:
        List of merged [start, end] pairs
    
    Example:
        >>> merge_intervals([[1, 3], [2, 6], [8, 10]])
        [[1, 6], [8, 10]]
    """
    # TODO: Sort by start time, then merge overlapping intervals
    # Hint: Track current merged interval, extend when overlapping
    pass


# ─── Test Cases ───

# Standard overlapping
print(merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]]))
# Expected: [[1, 6], [8, 10], [15, 18]]

# Adjacent intervals (touching)
print(merge_intervals([[1, 4], [4, 5]]))
# Expected: [[1, 5]]

# No overlap
print(merge_intervals([[1, 2], [3, 4], [5, 6]]))
# Expected: [[1, 2], [3, 4], [5, 6]]

# Complete overlap (one inside another)
print(merge_intervals([[1, 10], [2, 3], [4, 5]]))
# Expected: [[1, 10]]

# Single interval
print(merge_intervals([[1, 5]]))
# Expected: [[1, 5]]

# Empty input
print(merge_intervals([]))
# Expected: []
`,
      solutionCode: `def merge_intervals(intervals):
    """
    Merge all overlapping intervals into minimal set.
    
    Time Complexity: O(n log n) — sorting dominates
    Space Complexity: O(n) — result storage
    """
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        last_merged = merged[-1]
        
        # Check if overlapping (current starts before last ends)
        if current[0] <= last_merged[1]:
            # Merge by extending the end if needed
            last_merged[1] = max(last_merged[1], current[1])
        else:
            # No overlap, add as new interval
            merged.append(current)
    
    return merged


# ─── Test Cases ───
print(merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]]))
# Expected: [[1, 6], [8, 10], [15, 18]]

print(merge_intervals([[1, 4], [4, 5]]))
# Expected: [[1, 5]]

print(merge_intervals([[1, 2], [3, 4], [5, 6]]))
# Expected: [[1, 2], [3, 4], [5, 6]]

print(merge_intervals([[1, 10], [2, 3], [4, 5]]))
# Expected: [[1, 10]]

print(merge_intervals([[1, 5]]))
# Expected: [[1, 5]]

print(merge_intervals([]))
# Expected: []
`,
    },
    {
      id: "insert-interval",
      slug: "insert-interval",
      title: "Insert Interval",
      content: `## Insert Interval

<!-- voice:section_check concept="inserting and merging" -->

### Problem Statement

Given a set of non-overlapping sorted intervals, insert a new interval and merge if necessary. Return the updated set of intervals.

### Examples

~~~
Input:  intervals = [[1, 3], [6, 9]], newInterval = [2, 5]
Output: [[1, 5], [6, 9]]
~~~

~~~
Input:  intervals = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval = [4, 8]
Output: [[1, 2], [3, 10], [12, 16]]
Explanation: [4, 8] overlaps with [3, 5], [6, 7], [8, 10]
~~~

### Approach

1. Add intervals that come **before** newInterval (no overlap)
2. Merge all overlapping intervals with newInterval
3. Add the merged interval
4. Add remaining intervals that come **after**

<!-- voice:key_insight insight="Three zones: intervals before (no overlap), overlapping intervals (merge all), intervals after (no overlap)" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — single pass through intervals.
- **Space:** O(n) — result storage.`,
      starterCode: `def insert_interval(intervals, new_interval):
    """
    Insert new interval into sorted non-overlapping intervals, merging if needed.
    
    Args:
        intervals: List of [start, end] pairs, sorted by start
        new_interval: [start, end] to insert
    
    Returns:
        List of merged intervals
    
    Example:
        >>> insert_interval([[1, 3], [6, 9]], [2, 5])
        [[1, 5], [6, 9]]
    """
    # TODO: Add non-overlapping before, merge overlapping, add after
    # Hint: Track three zones: before, overlapping, after
    pass


# ─── Test Cases ───

# New interval overlaps with first
print(insert_interval([[1, 3], [6, 9]], [2, 5]))
# Expected: [[1, 5], [6, 9]]

# New interval overlaps with multiple
print(insert_interval([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]))
# Expected: [[1, 2], [3, 10], [12, 16]]

# New interval at beginning
print(insert_interval([[3, 5]], [1, 2]))
# Expected: [[1, 2], [3, 5]]

# New interval at end
print(insert_interval([[1, 2]], [3, 5]))
# Expected: [[1, 2], [3, 5]]

# New interval covers all
print(insert_interval([[1, 2], [3, 4]], [0, 5]))
# Expected: [[0, 5]]

# Empty intervals
print(insert_interval([], [1, 5]))
# Expected: [[1, 5]]
`,
      solutionCode: `def insert_interval(intervals, new_interval):
    """
    Insert new interval into sorted non-overlapping intervals, merging if needed.
    
    Time Complexity: O(n) — single pass
    Space Complexity: O(n) — result storage
    """
    result = []
    i = 0
    n = len(intervals)
    
    # Add all intervals before new_interval (no overlap)
    while i < n and intervals[i][1] < new_interval[0]:
        result.append(intervals[i])
        i += 1
    
    # Merge all overlapping intervals with new_interval
    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval[0] = min(new_interval[0], intervals[i][0])
        new_interval[1] = max(new_interval[1], intervals[i][1])
        i += 1
    
    result.append(new_interval)
    
    # Add remaining intervals
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result


# ─── Test Cases ───
print(insert_interval([[1, 3], [6, 9]], [2, 5]))
# Expected: [[1, 5], [6, 9]]

print(insert_interval([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]))
# Expected: [[1, 2], [3, 10], [12, 16]]

print(insert_interval([[3, 5]], [1, 2]))
# Expected: [[1, 2], [3, 5]]

print(insert_interval([[1, 2]], [3, 5]))
# Expected: [[1, 2], [3, 5]]

print(insert_interval([[1, 2], [3, 4]], [0, 5]))
# Expected: [[0, 5]]

print(insert_interval([], [1, 5]))
# Expected: [[1, 5]]
`,
    },
    {
      id: "interval-intersection",
      slug: "interval-intersection",
      title: "Interval Intersection",
      content: `## Interval Intersection

<!-- voice:section_check concept="finding common intervals" -->

### Problem Statement

Given two lists of closed intervals, each list is pairwise disjoint and sorted. Return the **intersection** of these two interval lists.

### Examples

~~~
Input:  first = [[0, 2], [5, 10], [13, 23], [24, 25]]
        second = [[1, 5], [8, 12], [15, 24], [25, 26]]
Output: [[1, 2], [5, 5], [8, 10], [15, 23], [24, 24], [25, 25]]
~~~

### Approach

Use two pointers, one for each list:
1. Find intersection of current intervals: [max(start1, start2), min(end1, end2)]
2. If valid (start ≤ end), add to result
3. Advance pointer of interval that ends first (it can't intersect with more intervals)

<!-- voice:key_insight insight="Two intervals intersect at [max of starts, min of ends] — if max_start <= min_end, they overlap" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n + m) — single pass through both lists.
- **Space:** O(min(n, m)) — maximum possible intersections.`,
      starterCode: `def interval_intersection(first, second):
    """
    Find intersections of two interval lists.
    
    Args:
        first: List of [start, end] pairs, sorted and non-overlapping
        second: List of [start, end] pairs, sorted and non-overlapping
    
    Returns:
        List of intersection intervals
    
    Example:
        >>> interval_intersection([[0, 2], [5, 10]], [[1, 5], [8, 12]])
        [[1, 2], [5, 5], [8, 10]]
    """
    # TODO: Use two pointers to find intersections
    # Hint: Intersection is [max(starts), min(ends)], advance pointer with smaller end
    pass


# ─── Test Cases ───

# Standard case
first = [[0, 2], [5, 10], [13, 23], [24, 25]]
second = [[1, 5], [8, 12], [15, 24], [25, 26]]
print(interval_intersection(first, second))
# Expected: [[1, 2], [5, 5], [8, 10], [15, 23], [24, 24], [25, 25]]

# No intersection
print(interval_intersection([[1, 3]], [[4, 6]]))
# Expected: []

# Complete overlap
print(interval_intersection([[1, 10]], [[2, 5]]))
# Expected: [[2, 5]]

# Empty lists
print(interval_intersection([], [[1, 5]]))
# Expected: []

# Multiple intersections with same interval
print(interval_intersection([[1, 100]], [[2, 3], [5, 10], [15, 20]]))
# Expected: [[2, 3], [5, 10], [15, 20]]
`,
      solutionCode: `def interval_intersection(first, second):
    """
    Find intersections of two interval lists.
    
    Time Complexity: O(n + m) — single pass through both lists
    Space Complexity: O(min(n, m)) — result storage
    """
    result = []
    i = j = 0
    
    while i < len(first) and j < len(second):
        # Find intersection
        start = max(first[i][0], second[j][0])
        end = min(first[i][1], second[j][1])
        
        # Valid intersection if start <= end
        if start <= end:
            result.append([start, end])
        
        # Advance pointer with smaller end (can't intersect with more)
        if first[i][1] < second[j][1]:
            i += 1
        else:
            j += 1
    
    return result


# ─── Test Cases ───
first = [[0, 2], [5, 10], [13, 23], [24, 25]]
second = [[1, 5], [8, 12], [15, 24], [25, 26]]
print(interval_intersection(first, second))
# Expected: [[1, 2], [5, 5], [8, 10], [15, 23], [24, 24], [25, 25]]

print(interval_intersection([[1, 3]], [[4, 6]]))
# Expected: []

print(interval_intersection([[1, 10]], [[2, 5]]))
# Expected: [[2, 5]]

print(interval_intersection([], [[1, 5]]))
# Expected: []

print(interval_intersection([[1, 100]], [[2, 3], [5, 10], [15, 20]]))
# Expected: [[2, 3], [5, 10], [15, 20]]
`,
    },
    {
      id: "meeting-rooms",
      slug: "meeting-rooms",
      title: "Meeting Rooms",
      content: `## Meeting Rooms (Conflict Detection)

<!-- voice:section_check concept="conflict detection" -->

### Problem Statement

Given an array of meeting time intervals where intervals[i] = [start, end], determine if a person could **attend all meetings** without conflicts.

### Examples

~~~
Input:  [[0, 30], [5, 10], [15, 20]]
Output: False
Explanation: [0, 30] overlaps with both [5, 10] and [15, 20]
~~~

~~~
Input:  [[7, 10], [2, 4]]
Output: True
Explanation: No overlaps
~~~

### Approach

1. **Sort** intervals by start time
2. Check each consecutive pair
3. If any interval[i].start < interval[i-1].end, there's a conflict

<!-- voice:key_insight insight="After sorting, we only need to check adjacent intervals for conflicts" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n log n) — sorting dominates.
- **Space:** O(1) or O(n) — depends on sorting implementation.`,
      starterCode: `def can_attend_all_meetings(intervals):
    """
    Determine if a person can attend all meetings without conflicts.
    
    Args:
        intervals: List of [start, end] meeting times
    
    Returns:
        bool: True if no conflicts, False otherwise
    
    Example:
        >>> can_attend_all_meetings([[0, 30], [5, 10]])
        False
    """
    # TODO: Sort by start time, check for adjacent overlaps
    # Hint: After sorting, check if any interval starts before previous ends
    pass


# ─── Test Cases ───

# Has conflicts
print(can_attend_all_meetings([[0, 30], [5, 10], [15, 20]]))
# Expected: False

# No conflicts
print(can_attend_all_meetings([[7, 10], [2, 4]]))
# Expected: True

# Back-to-back meetings (no conflict)
print(can_attend_all_meetings([[1, 5], [5, 10]]))
# Expected: True

# Single meeting
print(can_attend_all_meetings([[1, 5]]))
# Expected: True

# Empty schedule
print(can_attend_all_meetings([]))
# Expected: True

# Same start time
print(can_attend_all_meetings([[1, 5], [1, 3]]))
# Expected: False
`,
      solutionCode: `def can_attend_all_meetings(intervals):
    """
    Determine if a person can attend all meetings without conflicts.
    
    Time Complexity: O(n log n) — sorting dominates
    Space Complexity: O(1) — in-place check
    """
    if len(intervals) <= 1:
        return True
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Check adjacent intervals for overlap
    for i in range(1, len(intervals)):
        # If current starts before previous ends, there's conflict
        if intervals[i][0] < intervals[i - 1][1]:
            return False
    
    return True


# ─── Test Cases ───
print(can_attend_all_meetings([[0, 30], [5, 10], [15, 20]]))
# Expected: False

print(can_attend_all_meetings([[7, 10], [2, 4]]))
# Expected: True

print(can_attend_all_meetings([[1, 5], [5, 10]]))
# Expected: True

print(can_attend_all_meetings([[1, 5]]))
# Expected: True

print(can_attend_all_meetings([]))
# Expected: True

print(can_attend_all_meetings([[1, 5], [1, 3]]))
# Expected: False
`,
    },
    {
      id: "merge-intervals-checkpoint",
      slug: "merge-intervals-checkpoint",
      title: "Module Checkpoint: Merge Intervals",
      content: `## Module Checkpoint: Merge Intervals

<!-- voice:checkpoint_intro -->

Great job on the Merge Intervals module! Let's verify your understanding.

### Quick Review

You learned:
- **Sorting first** is crucial for interval problems
- **Merging overlapping** intervals by tracking the current interval
- **Finding intersections** using two pointers
- **Conflict detection** for scheduling problems

### Quiz

**Question 1:** What is the first step in most interval problems?
- A) Merge all intervals immediately
- B) Sort intervals by start time
- C) Convert intervals to points
- D) Check for empty input

**Question 2:** Two intervals [a, b] and [c, d] overlap if:
- A) a == c
- B) b >= c
- C) a < d
- D) b < c

**Question 3:** What is the time complexity of merging intervals?
- A) O(n) — linear scan
- B) O(n log n) — sorting dominates
- C) O(n²) — compare all pairs
- D) O(1) — constant time

**Question 4:** When finding interval intersections, which pointer do you advance?
- A) Always advance first list pointer
- B) Always advance second list pointer
- C) Advance pointer with smaller end time
- D) Advance both pointers

**Question 5:** True or False: Back-to-back intervals like [1, 3] and [3, 5] overlap.

### Voice Summary

Your coach will ask you to:
- Explain the merge intervals algorithm step by step
- Describe how you'd find the union vs intersection of intervals
- Give a real-world example where interval problems appear

**You're building a strong foundation in classic interview patterns!**`,
    },
  ],
};
