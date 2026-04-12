import { Module } from "../types";

export const mergeIntervalsModule: Module = {
  id: "merge-intervals",
  title: "Merge Intervals",
  description: "Learn to handle overlapping intervals — merging, inserting, and finding intersections efficiently.",
  lessons: [
    {
      id: "merge-intervals-intro",
      slug: "merge-intervals-intro",
      title: "Introduction to Merge Intervals",
      content: `## The Merge Intervals Pattern

Many problems involve dealing with **overlapping intervals** — time slots, ranges, schedules. The merge intervals pattern provides a systematic way to handle these.

### Key Concepts

**Overlap detection:** Two intervals \`[a, b]\` and \`[c, d]\` overlap if \`a <= d\` and \`c <= b\` (assuming both are sorted by start time).

**Six relationships** between two intervals:

\`\`\`
1. a----b                    (a before b, no overlap)
            c----d

2. a--------b                (a overlaps start of b)
        c--------d

3. a--------------b          (a fully contains b)
      c------d

4.     a------b              (b fully contains a)
   c--------------d

5.       a--------b          (b overlaps end of a)
   c--------d

6.            a----b         (b before a, no overlap)
   c----d
\`\`\`

### Standard Approach

1. **Sort** intervals by their start time.
2. Iterate through the sorted list, comparing each interval with the last merged interval.
3. If they overlap, **merge** them (extend the end time). Otherwise, start a new merged interval.

### When to Use This Pattern

- Scheduling and calendar problems
- Finding free time or conflicts
- Merging or splitting ranges
- CPU or meeting room allocation

### Complexity

Sorting takes **O(n log n)** and the merge pass takes **O(n)**, giving **O(n log n)** overall with **O(n)** space for the result.

\`\`\`mermaid
graph LR
    subgraph Before["Unsorted Intervals"]
        I1["[6,7]"] --- I2["[2,4]"] --- I3["[5,9]"]
    end
    subgraph Sorted["After Sort by Start"]
        S1["[2,4]"] --- S2["[5,9]"] --- S3["[6,7]"]
    end
    subgraph Merged["After Merge"]
        M1["[2,4]"] --- M2["[5,9]"]
    end
    Before -->|"Sort"| Sorted -->|"Merge overlaps"| Merged
\`\`\`

\`\`\`mermaid
graph TD
    A["Sort intervals by start"] --> B["Take first interval"]
    B --> C["Compare next interval"]
    C --> D{"Overlapping?"}
    D -->|"next.start <= curr.end"| E["Merge: extend end"]
    D -->|"No overlap"| F["Start new interval"]
    E --> C
    F --> C
\`\`\``,
    },
    {
      id: "merge-intervals-merge",
      slug: "merge-intervals",
      title: "Merge Intervals",
      content: `## Merge Intervals

### Problem Statement

Given a list of intervals, **merge all overlapping intervals** and return the list of merged intervals.

### Examples

\`\`\`
Input:  [[1,4], [2,5], [7,9]]
Output: [[1,5], [7,9]]
Explanation: [1,4] and [2,5] overlap, merging to [1,5].
\`\`\`

\`\`\`
Input:  [[6,7], [2,4], [5,9]]
Output: [[2,4], [5,9]]
Explanation: After sorting: [2,4], [5,9], [6,7]. [5,9] and [6,7] overlap -> [5,9].
\`\`\`

\`\`\`
Input:  [[1,4], [2,6], [3,5]]
Output: [[1,6]]
Explanation: All three overlap into one merged interval.
\`\`\`

### Approach Hints

1. Sort intervals by start time.
2. Initialize the merged list with the first interval.
3. For each subsequent interval, check if it overlaps with the last interval in the merged list.
4. If yes, update the end of the last merged interval to the max of both ends.
5. If no, append the current interval to the merged list.

\`\`\`mermaid
graph LR
    subgraph Input["Sorted: [1,4] [2,6] [3,5]"]
        direction LR
        I1["[1,4]"] --- I2["[2,6]"] --- I3["[3,5]"]
    end
    subgraph S1["Step 1: merged=[[1,4]]"]
        M1["[1,4]"]
    end
    subgraph S2["Step 2: 2<=4, merge"]
        M2["[1,6]"]
    end
    subgraph S3["Step 3: 3<=6, merge"]
        M3["[1,6] no change"]
    end
    Input --> S1 --> S2 --> S3
\`\`\`

### Complexity

- **Time:** O(n log n) for sorting.
- **Space:** O(n) for the output list.`,
      starterCode: `def merge(intervals):
    # TODO: merge overlapping intervals
    pass

# Test cases
print(merge([[1,4], [2,5], [7,9]]))        # Expected: [[1,5], [7,9]]
print(merge([[6,7], [2,4], [5,9]]))        # Expected: [[2,4], [5,9]]
print(merge([[1,4], [2,6], [3,5]]))        # Expected: [[1,6]]
`,
      solutionCode: `def merge(intervals):
    if len(intervals) < 2:
        return intervals
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for i in range(1, len(intervals)):
        if intervals[i][0] <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], intervals[i][1])
        else:
            merged.append(intervals[i])
    return merged

# Test cases
print(merge([[1,4], [2,5], [7,9]]))        # Expected: [[1,5], [7,9]]
print(merge([[6,7], [2,4], [5,9]]))        # Expected: [[2,4], [5,9]]
print(merge([[1,4], [2,6], [3,5]]))        # Expected: [[1,6]]
`,
    },
    {
      id: "merge-intervals-insert",
      slug: "insert-interval",
      title: "Insert Interval",
      content: `## Insert Interval

### Problem Statement

Given a list of **non-overlapping** intervals sorted by start time and a **new interval**, insert the new interval and merge if necessary. Return the resulting list of non-overlapping intervals.

### Examples

\`\`\`
Input:  intervals = [[1,3], [5,7], [8,12]], new = [4,6]
Output: [[1,3], [4,7], [8,12]]
Explanation: [4,6] overlaps with [5,7], merging to [4,7].
\`\`\`

\`\`\`
Input:  intervals = [[1,3], [5,7], [8,12]], new = [4,10]
Output: [[1,3], [4,12]]
Explanation: [4,10] overlaps with [5,7] and [8,12].
\`\`\`

\`\`\`
Input:  intervals = [[2,3], [5,7]], new = [1,4]
Output: [[1,4], [5,7]]
\`\`\`

### Approach Hints

1. Add all intervals that come **before** the new interval (end < new start).
2. Merge all intervals that **overlap** with the new interval (start <= new end).
3. Add all intervals that come **after** the merged result.

### Complexity

- **Time:** O(n) — single pass (input is already sorted).
- **Space:** O(n) — for the output.`,
      starterCode: `def insert(intervals, new_interval):
    # TODO: insert and merge the new interval
    pass

# Test cases
print(insert([[1,3], [5,7], [8,12]], [4,6]))   # Expected: [[1,3], [4,7], [8,12]]
print(insert([[1,3], [5,7], [8,12]], [4,10]))  # Expected: [[1,3], [4,12]]
print(insert([[2,3], [5,7]], [1,4]))            # Expected: [[1,4], [5,7]]
`,
      solutionCode: `def insert(intervals, new_interval):
    merged = []
    i = 0
    n = len(intervals)
    # Add all intervals before the new interval
    while i < n and intervals[i][1] < new_interval[0]:
        merged.append(intervals[i])
        i += 1
    # Merge overlapping intervals with new_interval
    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval[0] = min(new_interval[0], intervals[i][0])
        new_interval[1] = max(new_interval[1], intervals[i][1])
        i += 1
    merged.append(new_interval)
    # Add remaining intervals
    while i < n:
        merged.append(intervals[i])
        i += 1
    return merged

# Test cases
print(insert([[1,3], [5,7], [8,12]], [4,6]))   # Expected: [[1,3], [4,7], [8,12]]
print(insert([[1,3], [5,7], [8,12]], [4,10]))  # Expected: [[1,3], [4,12]]
print(insert([[2,3], [5,7]], [1,4]))            # Expected: [[1,4], [5,7]]
`,
    },
    {
      id: "merge-intervals-intersection",
      slug: "intervals-intersection",
      title: "Intervals Intersection",
      content: `## Intervals Intersection

### Problem Statement

Given two lists of intervals, each list is **pairwise non-overlapping** and sorted by start time. Find the **intersection** of these two lists — all intervals that are common to both.

### Examples

\`\`\`
Input:  a = [[1,3], [5,6], [7,9]], b = [[2,3], [5,7]]
Output: [[2,3], [5,6], [7,7]]
\`\`\`

\`\`\`
Input:  a = [[1,3], [5,7], [9,12]], b = [[5,10]]
Output: [[5,7], [9,10]]
\`\`\`

\`\`\`
Input:  a = [[1,2]], b = [[3,4]]
Output: []
Explanation: No overlap.
\`\`\`

### Approach Hints

- Use two pointers, one for each list.
- At each step, check if the current intervals overlap. If they do, the intersection is \`[max(start1, start2), min(end1, end2)]\`.
- Advance the pointer whose interval ends first (it cannot overlap with anything else from the other list).

### Complexity

- **Time:** O(n + m) where n and m are the lengths of the two lists.
- **Space:** O(1) — excluding the output.`,
      starterCode: `def intervals_intersection(a, b):
    # TODO: find intersection of two sorted interval lists
    pass

# Test cases
print(intervals_intersection([[1,3],[5,6],[7,9]], [[2,3],[5,7]]))
# Expected: [[2,3], [5,6], [7,7]]

print(intervals_intersection([[1,3],[5,7],[9,12]], [[5,10]]))
# Expected: [[5,7], [9,10]]

print(intervals_intersection([[1,2]], [[3,4]]))
# Expected: []
`,
      solutionCode: `def intervals_intersection(a, b):
    result = []
    i, j = 0, 0
    while i < len(a) and j < len(b):
        # Check if there is an overlap
        start = max(a[i][0], b[j][0])
        end = min(a[i][1], b[j][1])
        if start <= end:
            result.append([start, end])
        # Move the pointer with the smaller end
        if a[i][1] < b[j][1]:
            i += 1
        else:
            j += 1
    return result

# Test cases
print(intervals_intersection([[1,3],[5,6],[7,9]], [[2,3],[5,7]]))
# Expected: [[2,3], [5,6], [7,7]]

print(intervals_intersection([[1,3],[5,7],[9,12]], [[5,10]]))
# Expected: [[5,7], [9,10]]

print(intervals_intersection([[1,2]], [[3,4]]))
# Expected: []
`,
    },
    {
      id: "merge-intervals-conflicts",
      slug: "conflicting-appointments",
      title: "Conflicting Appointments",
      content: `## Conflicting Appointments

### Problem Statement

Given an array of appointment time slots where each slot is \`[start, end]\`, determine if a person can **attend all appointments** without any conflicts. Return \`True\` if there are no overlaps, \`False\` otherwise.

### Examples

\`\`\`
Input:  [[1,4], [2,5], [7,9]]
Output: False
Explanation: [1,4] and [2,5] overlap.
\`\`\`

\`\`\`
Input:  [[6,7], [2,4], [8,12]]
Output: True
Explanation: After sorting: [2,4], [6,7], [8,12] — no overlaps.
\`\`\`

\`\`\`
Input:  [[4,5], [2,3], [3,6]]
Output: False
Explanation: [4,5] and [3,6] overlap.
\`\`\`

### Approach Hints

- Sort appointments by start time.
- Check each consecutive pair: if the start of the next appointment is before the end of the previous one, there is a conflict.

### Complexity

- **Time:** O(n log n) for sorting.
- **Space:** O(1) — in-place check.`,
      starterCode: `def can_attend_all(appointments):
    # TODO: check if all appointments are conflict-free
    pass

# Test cases
print(can_attend_all([[1,4], [2,5], [7,9]]))   # Expected: False
print(can_attend_all([[6,7], [2,4], [8,12]]))  # Expected: True
print(can_attend_all([[4,5], [2,3], [3,6]]))   # Expected: False
`,
      solutionCode: `def can_attend_all(appointments):
    appointments.sort(key=lambda x: x[0])
    for i in range(1, len(appointments)):
        if appointments[i][0] < appointments[i - 1][1]:
            return False
    return True

# Test cases
print(can_attend_all([[1,4], [2,5], [7,9]]))   # Expected: False
print(can_attend_all([[6,7], [2,4], [8,12]]))  # Expected: True
print(can_attend_all([[4,5], [2,3], [3,6]]))   # Expected: False
`,
    },
    {
      id: "merge-intervals-min-rooms",
      slug: "minimum-meeting-rooms",
      title: "Minimum Meeting Rooms",
      content: `## Minimum Meeting Rooms

### Problem Statement

Given a list of meeting time intervals \`[start, end]\`, find the **minimum number of meeting rooms** required so that no two overlapping meetings share a room.

### Examples

\`\`\`
Input:  [[1,4], [2,5], [7,9]]
Output: 2
Explanation: Meetings [1,4] and [2,5] overlap, needing 2 rooms.
\`\`\`

\`\`\`
Input:  [[6,7], [2,4], [8,12]]
Output: 1
Explanation: No meetings overlap after sorting.
\`\`\`

\`\`\`
Input:  [[1,4], [2,3], [3,6]]
Output: 2
Explanation: [1,4] and [2,3] overlap. [3,6] starts when [2,3] ends, so only 2 rooms needed max.
\`\`\`

### Approach Hints

- **Sweep line approach:** Extract all start times and end times separately. Sort both arrays.
- Walk through events in order: each start increments the room count, each end decrements it.
- Track the maximum room count at any point.

Alternatively, use a **min-heap** of end times: for each meeting, if the earliest ending meeting finishes before the current one starts, reuse that room (pop from heap). Otherwise, allocate a new room (push to heap). The heap size at the end is the answer.

### Complexity

- **Time:** O(n log n) for sorting.
- **Space:** O(n) for the sorted arrays or heap.`,
      starterCode: `def min_meeting_rooms(meetings):
    # TODO: find minimum number of meeting rooms needed
    pass

# Test cases
print(min_meeting_rooms([[1,4], [2,5], [7,9]]))   # Expected: 2
print(min_meeting_rooms([[6,7], [2,4], [8,12]]))  # Expected: 1
print(min_meeting_rooms([[1,4], [2,3], [3,6]]))   # Expected: 2
`,
      solutionCode: `def min_meeting_rooms(meetings):
    if not meetings:
        return 0
    starts = sorted([m[0] for m in meetings])
    ends = sorted([m[1] for m in meetings])
    rooms = 0
    max_rooms = 0
    s, e = 0, 0
    while s < len(starts):
        if starts[s] < ends[e]:
            rooms += 1
            max_rooms = max(max_rooms, rooms)
            s += 1
        else:
            rooms -= 1
            e += 1
    return max_rooms

# Test cases
print(min_meeting_rooms([[1,4], [2,5], [7,9]]))   # Expected: 2
print(min_meeting_rooms([[6,7], [2,4], [8,12]]))  # Expected: 1
print(min_meeting_rooms([[1,4], [2,3], [3,6]]))   # Expected: 2
`,
    },
  ],
};
