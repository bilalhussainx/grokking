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

\`\`\`concept
{
  "title": "Overlap Detection Rule",
  "variant": "rule",
  "content": "Two intervals [a, b] and [c, d] overlap if a <= d and c <= b (assuming both are sorted by start time). This simple check is the foundation of all interval merging algorithms."
}
\`\`\`

### Six Relationships Between Two Intervals

\`\`\`algoviz
{
  "title": "Interval Relationships Visualized",
  "type": "array",
  "data": [[1,2],[3,4],[1,5],[2,3],[1,4],[2,5],[3,5],[6,7]],
  "frames": [
    {"highlight": [0,1], "label": "No overlap: [1,2] ends before [3,4] starts"},
    {"highlight": [2,3], "label": "Full contain: [1,5] completely covers [2,3]"},
    {"highlight": [4,5], "label": "Partial overlap: [1,4] and [2,5] share [2,4]"},
    {"highlight": [6,7], "label": "Adjacent: [3,5] and [6,7] do not overlap"}
  ],
  "speed": 1000
}
\`\`\`

### Standard Approach

1. **Sort** intervals by their start time.
2. Iterate through the sorted list, comparing each interval with the last merged interval.
3. If they overlap, **merge** them (extend the end time). Otherwise, start a new merged interval.

\`\`\`trace
{
  "title": "Merge Algorithm in Action",
  "language": "python",
  "code": "def merge(intervals):\\n    if not intervals:\\n        return []\\n    \\n    # Step 1: Sort by start time\\n    intervals.sort(key=lambda x: x[0])\\n    merged = [intervals[0]]\\n    \\n    for curr in intervals[1:]:\\n        last = merged[-1]\\n        # Check for overlap\\n        if curr[0] <= last[1]:\\n            # Merge: extend the end time\\n            merged[-1] = [last[0], max(last[1], curr[1])]\\n        else:\\n            # No overlap: add as new interval\\n            merged.append(curr)\\n    \\n    return merged\\n\\n# Test with overlapping intervals\\nintervals = [[6,7], [2,4], [5,9], [1,3]]\\nresult = merge(intervals)\\nprint(f\\"Merged: {result}\\")",
  "frames": [
    {"line": 6, "vars": {"intervals": "[[1,3], [2,4], [5,9], [6,7]]"}, "note": "After sorting by start time"},
    {"line": 7, "vars": {"merged": "[[1,3]]"}, "note": "Initialize with first interval"},
    {"line": 9, "vars": {"curr": "[2,4]", "last": "[1,3]"}, "note": "Check [2,4] vs [1,3]"},
    {"line": 12, "vars": {"merged": "[[1,4]]"}, "note": "Overlap detected! Merge to [1,4]"},
    {"line": 9, "vars": {"curr": "[5,9]", "last": "[1,4]"}, "note": "Check [5,9] vs [1,4]"},
    {"line": 15, "vars": {"merged": "[[1,4], [5,9]]"}, "note": "No overlap, add new interval"},
    {"line": 9, "vars": {"curr": "[6,7]", "last": "[5,9]"}, "note": "Check [6,7] vs [5,9]"},
    {"line": 12, "vars": {"merged": "[[1,4], [5,9]]"}, "note": "Overlap detected! [5,9] already covers [6,7]"},
    {"line": 18, "stdout": "Merged: [[1,4], [5,9]]", "note": "Final result"}
  ],
  "speed": 1200
}
\`\`\`

### When to Use This Pattern

- Scheduling and calendar problems
- Finding free time or conflicts
- Merging or splitting ranges
- CPU or meeting room allocation

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "What is the time complexity of the merge intervals algorithm?",
      "options": ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      "answer": 1,
      "explanation": "Sorting takes O(n log n) and the merge pass takes O(n), so overall complexity is O(n log n)."
    },
    {
      "question": "Which condition correctly detects overlap between [a,b] and [c,d]?",
      "options": ["a < c and b < d", "a <= d and c <= b", "a == c or b == d", "a > c and b < d"],
      "answer": 1,
      "explanation": "Two intervals overlap if the start of one is <= the end of the other, and vice versa."
    },
    {
      "question": "What happens if you forget to sort intervals before merging?",
      "options": ["Algorithm runs faster", "Some overlaps may be missed", "All intervals merge into one", "No effect on correctness"],
      "answer": 1,
      "explanation": "Without sorting, intervals are processed out of order and overlaps might be missed, leading to incorrect results."
    }
  ]
}
\`\`\`

### Complexity

Sorting takes **O(n log n)** and the merge pass takes **O(n)**, giving **O(n log n)** overall with **O(n)** space for the result.

\`\`\`callout
{
  "type": "warning",
  "title": "Common Pitfall",
  "content": "Don't use strict inequalities when checking overlaps! Adjacent intervals like [1,2] and [2,3] should be merged into [1,3]. Use \`curr[0] <= last[1]\` not \`curr[0] < last[1]\`."
}
\`\`\``,
    },
    {
      id: "merge-intervals-merge",
      slug: "merge-intervals",
      title: "Merge Intervals",
      content: `## Merge Intervals

### Problem Statement

Given a list of intervals, **merge all overlapping intervals** and return the list of merged intervals.

\`\`\`concept
{
  "title": "What counts as an overlap?",
  "variant": "rule",
  "content": "Two intervals [a, b] and [c, d] overlap if and only if c ≤ b. When they do, the merged interval becomes [a, max(b, d)]."
}
\`\`\`

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

### Algorithm Walk-through

\`\`\`steps
{
  "title": "Merge Intervals in 5 Steps",
  "steps": [
    {
      "title": "1. Sort by start time",
      "content": "Put intervals in ascending order of their first value. This lets us process them left-to-right and guarantees any overlap is with the most recently added interval."
    },
    {
      "title": "2. Seed the merged list",
      "content": "Create an empty list \`merged\` and push the first interval into it. This gives us something to compare the next interval against."
    },
    {
      "title": "3. Compare next interval",
      "content": "Let \`curr = intervals[i]\` and \`last = merged[-1]\`. If \`curr[0] ≤ last[1]\` they overlap."
    },
    {
      "title": "4. Merge or append",
      "content": "If they overlap, extend \`last[1]\` to \`max(last[1], curr[1])\`. Otherwise push \`curr\` into \`merged\` as a new disjoint interval."
    },
    {
      "title": "5. Return result",
      "content": "After the single pass, \`merged\` contains all non-overlapping intervals in sorted order."
    }
  ]
}
\`\`\`

\`\`\`algoviz
{
  "title": "Merging [[1,4], [2,6], [3,5]]",
  "type": "array",
  "data": [[1,4], [2,6], [3,5]],
  "frames": [
    { "highlight": [0], "label": "Start with merged=[[1,4]]" },
    { "highlight": [1], "label": "[2,6] overlaps 1-4 → extend to [1,6]" },
    { "highlight": [2], "label": "[3,5] inside 1-6 → no change" }
  ],
  "speed": 1000
}
\`\`\`

### Complexity

- **Time:** O(n log n) for sorting.
- **Space:** O(n) for the output list.

\`\`\`callout
{
  "type": "info",
  "title": "Why not O(n²)?",
  "content": "After sorting, each interval is examined exactly once. The merge step is therefore O(n), so the overall bound is dominated by the initial sort."
}
\`\`\`

### Edge Cases to Test

\`\`\`quiz
{
  "title": "Quick Sanity Check",
  "questions": [
    {
      "question": "What happens with adjacent intervals like [1,2] and [2,3]?",
      "options": ["They remain separate", "They merge into [1,3]", "They merge into [2,2]"],
      "answer": 1,
      "explanation": "By definition 2 ≤ 2, so they touch and become [1,3]."
    },
    {
      "question": "If the input is already merged, what’s the runtime?",
      "options": ["O(n)", "O(n log n)", "O(n²)"],
      "answer": 1,
      "explanation": "We still pay for the initial sort; the linear pass can’t avoid that."
    },
    {
      "question": "Which sort key guarantees correctness?",
      "options": ["start ascending", "end ascending", "start descending"],
      "answer": 0,
      "explanation": "Sorting by start time lets us detect overlaps with a single left-to-right scan."
    }
  ]
}
\`\`\`

### Reference Implementation

\`\`\`playground
{
  "title": "Python 3 Merge Intervals",
  "language": "python",
  "code": "def merge(intervals):\\n    if not intervals:\\n        return []\\n    \\n    intervals.sort(key=lambda x: x[0])   # O(n log n)\\n    merged = [intervals[0]]\\n    \\n    for curr in intervals[1:]:           # O(n)\\n        last = merged[-1]\\n        if curr[0] <= last[1]:           # overlap\\n            last[1] = max(last[1], curr[1])\\n        else:\\n            merged.append(curr)\\n    \\n    return merged\\n\\n# Quick test\\ndata = [[1,4], [2,6], [3,5]]\\nprint('merged:', merge(data))",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Always sort by start time first; it unlocks a single linear pass.",
    "The merge decision needs only the last interval in the output list.",
    "Total complexity is O(n log n) time and O(n) space for the result."
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "Why Insert & Merge?",
  "variant": "mental-model",
  "content": "Think of intervals as booked meeting rooms on a calendar. When you add a new meeting, you must:\\n1. Keep earlier meetings untouched\\n2. Merge any overlapping meetings into one block\\n3. Append later meetings unchanged\\n\\nThis guarantees your calendar stays conflict-free with minimal changes."
}
\`\`\`

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

### Three-Phase Algorithm

\`\`\`steps
{
  "title": "Insert & Merge in One Pass",
  "steps": [
    {
      "title": "1. Skip non-overlapping predecessors",
      "content": "Collect every interval whose \`end < new.start\`. These are guaranteed to finish before the new interval begins, so they stay unchanged."
    },
    {
      "title": "2. Merge overlapping cluster",
      "content": "While the current interval's \`start ≤ merged.end\`, expand the merged interval:\\n\\n\`\`\`\\nmerged.start = min(merged.start,  current.start)\\nmerged.end   = max(merged.end,    current.end)\\n\`\`\`\\n\\nThis absorbs all overlapping intervals into one continuous block."
    },
    {
      "title": "3. Append remaining successors",
      "content": "Once overlaps end, every subsequent interval starts strictly after the merged block. Push them to the result as-is."
    }
  ]
}
\`\`\`

\`\`\`trace
{
  "title": "Walk-through: intervals = [[1,3],[5,7],[8,12]], new = [4,6]",
  "language": "python",
  "code": "def insert(intervals, new):\\n    i, n = 0, len(intervals)\\n    res = []\\n    # 1. add earlier\\n    while i < n and intervals[i][1] < new[0]:\\n        res.append(intervals[i])\\n        i += 1\\n    # 2. merge overlaps\\n    merged = new\\n    while i < n and intervals[i][0] <= merged[1]:\\n        merged[0] = min(merged[0], intervals[i][0])\\n        merged[1] = max(merged[1], intervals[i][1])\\n        i += 1\\n    res.append(merged)\\n    # 3. add later\\n    while i < n:\\n        res.append(intervals[i])\\n        i += 1\\n    return res",
  "frames": [
    { "line": 4, "vars": {"i":0,"res":[],"new":[4,6]}, "note": "start, nothing in res yet" },
    { "line": 5, "vars": {"i":0,"res":[[1,3]],"new":[4,6]}, "note": "[1,3] ends at 3 < 4, keep it" },
    { "line": 10, "vars": {"i":1,"merged":[4,6]}, "note": "enter merge phase" },
    { "line": 12, "vars": {"i":1,"merged":[4,7]}, "note": "overlap [5,7], expand end to 7" },
    { "line": 16, "vars": {"res":[[1,3],[4,7]],"i":2}, "note": "merged block appended" },
    { "line": 18, "vars": {"res":[[1,3],[4,7],[8,12]],"i":3}, "note": "append remaining [8,12]" }
  ],
  "speed": 900
}
\`\`\`

### Complexity

- **Time:** O(n) — single left-to-right pass (input is already sorted).  
- **Space:** O(n) — for the output list.

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Why can we safely append intervals once \`intervals[i][0] > merged[1]\`?",
      "options": [
        "They are guaranteed to be duplicates",
        "They start after the merged block ends, so no overlap",
        "The list is unsorted beyond that point",
        "We already merged them earlier"
      ],
      "answer": 1,
      "explanation": "The input is sorted by start time, so any interval starting after \`merged[1]\` cannot overlap with the merged block."
    },
    {
      "question": "What happens if the new interval is completely inside an existing one, e.g., insert [6,7] into [[1,10]]?",
      "options": [
        "Two intervals remain",
        "The new interval is ignored",
        "The result is still [[1,10]]",
        "A runtime error occurs"
      ],
      "answer": 2,
      "explanation": "The merge logic expands to the union, which is still [1,10], so output is unchanged."
    },
    {
      "question": "Which edge-case is automatically handled by the three-phase loop?",
      "options": [
        "New interval is empty",
        "New interval is larger than all others",
        "Intervals contain negative numbers",
        "Duplicate intervals exist"
      ],
      "answer": 1,
      "explanation": "If the new interval spans every existing one, the merge phase absorbs them all and the later-phase loop never runs."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Try It: Insert Interval",
  "language": "python",
  "code": "def insert(intervals, newInterval):\\n    # your code here\\n    pass\\n\\n# Test cases\\nprint(insert([[1,3],[6,9]], [2,5]))  # ➜ [[1,5],[6,9]]\\nprint(insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]))  # ➜ [[1,2],[3,10],[12,16]]",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Single left-to-right pass is enough because the list is already sorted.",
    "Three clear phases: skip early, merge overlaps, append late.",
    "Merge step only needs to track the current merged start & end—no extra data structures.",
    "Algorithm runs in O(n) time and O(n) space, optimal for this problem."
  ]
}
\`\`\``,
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

\`\`\`concept
{"title": "What is Interval Intersection?", "variant": "mental-model", "content": "Think of two people’s calendars, each already free of double-bookings. Interval intersection asks: \\"When are both people simultaneously free?\\" The answer is the overlapping time slots — the shared availability between the two schedules."}
\`\`\`

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

### Two-Pointer Walkthrough

\`\`\`algoviz
{"title": "Finding Intersections Step-by-Step", "type": "array", "data": [[1,3],[5,6],[7,9]], "frames": [
  {"highlight": [0], "label": "i=0, j=0 → overlap [2,3]", "stats": {"i":0,"j":0}},
  {"highlight": [1], "label": "i=1, j=1 → overlap [5,6]", "stats": {"i":1,"j":1}},
  {"highlight": [2], "label": "i=2, j=1 → overlap [7,7]", "stats": {"i":2,"j":1}}
], "speed": 1000}
\`\`\`

### Algorithm in Action

\`\`\`trace
{"title": "Python Trace for a = [[1,3],[5,6],[7,9]], b = [[2,3],[5,7]]", "language": "python", "code": "def intersect(a, b):\\n    i = j = 0\\n    out = []\\n    while i < len(a) and j < len(b):\\n        s1, e1 = a[i]\\n        s2, e2 = b[j]\\n        # potential overlap\\n        start = max(s1, s2)\\n        end   = min(e1, e2)\\n        if start <= end:\\n            out.append([start, end])\\n        # advance pointer with smaller endpoint\\n        if e1 < e2:\\n            i += 1\\n        else:\\n            j += 1\\n    return out\\n\\nprint(intersect([[1,3],[5,6],[7,9]], [[2,3],[5,7]]))", "frames": [
  {"line": 2, "vars": {"i":0,"j":0}, "note": "pointers at first intervals", "stdout": ""},
  {"line": 5, "vars": {"s1":1,"e1":3,"s2":2,"e2":3}, "note": "overlap [2,3] found", "stdout": ""},
  {"line": 12, "vars": {"out":[[2,3]]}, "note": "stored overlap", "stdout": ""},
  {"line": 16, "vars": {"j":1}, "note": "b ends first → advance j", "stdout": ""},
  {"line": 5, "vars": {"s1":5,"e1":6,"s2":5,"e2":7}, "note": "overlap [5,6]", "stdout": ""},
  {"line": 12, "vars": {"out":[[2,3],[5,6]]}, "note": "stored", "stdout": ""},
  {"line": 14, "vars": {"i":2}, "note": "a ends first → advance i", "stdout": ""},
  {"line": 5, "vars": {"s1":7,"e1":9,"s2":5,"e2":7}, "note": "overlap [7,7]", "stdout": ""},
  {"line": 12, "vars": {"out":[[2,3],[5,6],[7,7]]}, "note": "final overlap", "stdout": ""}
], "speed": 900}
\`\`\`

### Key Insight

\`\`\`concept
{"title": "Why Advance the Earlier-Ending Interval?", "variant": "insight", "content": "The interval that ends earlier cannot overlap with any remaining intervals in the other list — those intervals start after the current one has already finished. Moving this pointer guarantees we never miss a future overlap."}
\`\`\`

### Implementation Template

\`\`\`fillblank
{"title": "Complete the Intersection Logic", "prompt": "Finish the loop body to compute intersections correctly.", "language": "python", "template": "while i < len(a) and j < len(b):\\n    s1, e1 = a[i]\\n    s2, e2 = b[j]\\n    start = max(___ , ___)\\n    end   = min(___ , ___)\\n    if start ___ end:\\n        out.append([start, end])\\n    # move pointer whose interval ends first\\n    if e1 ___ e2:\\n        i += 1\\n    else:\\n        j += 1", "blanks": [
  {"answer": "s1", "hint": "first interval start"},
  {"answer": "s2", "hint": "second interval start"},
  {"answer": "e1", "hint": "first interval end"},
  {"answer": "e2", "hint": "second interval end"},
  {"answer": "<=", "hint": "overlap condition"},
  {"answer": "<", "hint": "strictly earlier?"}
]}
\`\`\`

### Complexity Analysis

- **Time:** O(n + m) — each pointer moves forward at most n or m times.  
- **Space:** O(1) — excluding the output list, only constant extra variables are used.

### Quick Check

\`\`\`quiz
{"title": "Checkpoint", "questions": [
  {"question": "When intervals [2,5] and [3,7] overlap, what is the intersection?", "options": ["[2,7]","[3,5]","[2,3]","[5,7]"], "answer": 1, "explanation": "Intersection is [max(2,3), min(5,7)] = [3,5]."},
  {"question": "After finding an overlap, which pointer(s) can safely be advanced?", "options": ["Both","The one whose interval ends earlier","The one whose interval starts earlier","Neither until another overlap is found"], "answer": 1, "explanation": "Advancing the earlier-ending pointer preserves the invariant that future overlaps are still reachable."},
  {"question": "What is the worst-case time if both lists have 1 000 000 intervals?", "options": ["O(n log n)","O(n²)","O(n + m)","O(n)"], "answer": 2, "explanation": "Each pointer moves linearly, so total work is O(n + m) ≈ 2 000 000 steps."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Use two pointers to merge sorted, non-overlapping interval lists in linear time.",
  "Overlap exists when max(starts) ≤ min(ends); intersection is exactly that range.",
  "Always advance the pointer whose current interval ends first — this maintains correctness and efficiency."
]}
\`\`\``,
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

\`\`\`concept
{
  "title": "The Core Insight",
  "variant": "insight",
  "content": "Two intervals [a_start, a_end] and [b_start, b_end] overlap if and only if a_start < b_end AND b_start < a_end. After sorting by start time, we only need to check each consecutive pair — if any adjacent intervals satisfy this condition, a conflict exists."
}
\`\`\`

### Visual Walk-through

\`\`\`algoviz
{
  "title": "Detecting Overlap After Sorting",
  "type": "array",
  "data": [[1,4],[2,5],[7,9]],
  "frames": [
    { "highlight": [], "label": "Original intervals", "stats": {} },
    { "highlight": [0], "label": "Sort by start time → [1,4]", "stats": {} },
    { "highlight": [0,1], "label": "Check [1,4] vs [2,5]: 2 < 4 → overlap!", "stats": {} },
    { "highlight": [1,2], "label": "Early exit: conflict found", "stats": {} }
  ],
  "speed": 1000
}
\`\`\`

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

### Step-by-Step Algorithm

\`\`\`steps
{
  "title": "Conflict Detection in 3 Steps",
  "steps": [
    {
      "title": "1. Sort by Start",
      "content": "Sort the intervals by their start time. This ensures any potential overlap will be between adjacent entries."
    },
    {
      "title": "2. Scan Adjacent Pairs",
      "content": "Iterate once through the sorted list. For each pair \`i\` and \`i+1\`, check if \`intervals[i+1][0] < intervals[i][1]\`."
    },
    {
      "title": "3. Early Exit on Conflict",
      "content": "As soon as an overlap is detected, return \`False\`. If the loop finishes, return \`True\`."
    }
  ]
}
\`\`\`

### Complexity

- **Time:** O(n log n) for sorting.
- **Space:** O(1) — in-place check.

\`\`\`quiz
{
  "title": "Quick Check — Conflicts",
  "questions": [
    {
      "question": "After sorting, which intervals must be compared for overlap?",
      "options": ["All pairs", "Only adjacent pairs", "First and last only", "Random sample"],
      "answer": 1,
      "explanation": "Sorting guarantees that any overlap occurs between neighbors, so a single linear scan suffices."
    },
    {
      "question": "What is the earliest point we can return False?",
      "options": ["After full scan", "Immediately when overlap found", "After sorting", "Never early"],
      "answer": 1,
      "explanation": "The algorithm can short-circuit as soon as any adjacent overlap is detected."
    },
    {
      "question": "If all intervals are already sorted, what is the time complexity?",
      "options": ["O(n log n)", "O(n)", "O(1)", "O(n²)"],
      "answer": 1,
      "explanation": "With sorting already done, only the linear O(n) scan remains."
    }
  ]
}
\`\`\`

### Try It

\`\`\`playground
{
  "title": "Can Attend All Appointments?",
  "language": "python",
  "code": "def can_attend_all(intervals):\\n    intervals.sort(key=lambda x: x[0])\\n    for i in range(1, len(intervals)):\\n        if intervals[i][0] < intervals[i-1][1]:\\n            return False\\n    return True\\n\\n# Test cases\\nprint(can_attend_all([[1,4], [2,5], [7,9]]))  # Expected: False\\nprint(can_attend_all([[6,7], [2,4], [8,12]])) # Expected: True",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Sorting by start time reduces the problem to checking only adjacent intervals.",
    "Overlap test: next_start < prev_end.",
    "Overall complexity is dominated by the O(n log n) sort; the scan is O(n).",
    "Early exit on first conflict keeps the average case fast."
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "Why This Matters",
  "variant": "insight",
  "content": "The minimum rooms value equals the **maximum number of simultaneous meetings** at any moment.  If we draw a timeline, the answer is simply the highest spike we see.  All efficient solutions therefore reduce to tracking that spike."
}
\`\`\`

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

### Sweep-Line Algorithm (Two Pointers)

1. Extract all start times and all end times into two separate arrays.
2. Sort both arrays.
3. Walk through the events with two pointers:
   - Meeting **starts** → increment current rooms.
   - Meeting **ends** → decrement current rooms.
4. Record the maximum value current rooms ever reaches.

\`\`\`trace
{
  "title": "Sweep-Line Walk-Through",
  "language": "python",
  "code": "def min_rooms(intervals):\\n    starts = sorted(s for s, e in intervals)\\n    ends   = sorted(e for s, e in intervals)\\n    \\n    i = j = rooms = max_rooms = 0\\n    n = len(intervals)\\n    \\n    while i < n:\\n        if starts[i] < ends[j]:   # new meeting starts before any ends\\n            rooms += 1\\n            i += 1\\n            max_rooms = max(max_rooms, rooms)\\n        else:                     # a meeting ends\\n            rooms -= 1\\n            j += 1\\n    return max_rooms",
  "frames": [
    {"line": 2, "vars": {"intervals": "[[1,4],[2,5],[7,9]]", "starts": "[1,2,7]", "ends": "[4,5,9]"}, "note": "sorted start/end arrays"},
    {"line": 6, "vars": {"i":0,"j":0,"rooms":0,"max_rooms":0}, "note": "pointers at first event"},
    {"line": 8, "vars": {"starts[i]":1,"ends[j]":4}, "stdout": "rooms = 1", "note": "start < end → new room needed"},
    {"line": 9, "vars": {"i":1,"rooms":1,"max_rooms":1}, "note": "advance start pointer"},
    {"line": 8, "vars": {"starts[i]":2,"ends[j]":4}, "stdout": "rooms = 2", "note": "start < end → another room"},
    {"line": 9, "vars": {"i":2,"rooms":2,"max_rooms":2}, "note": "max rooms so far = 2"},
    {"line": 8, "vars": {"starts[i]":7,"ends[j]":4}, "stdout": "rooms = 1", "note": "7 ≥ 4 → meeting ended, free room"},
    {"line": 12, "vars": {"j":1,"rooms":1}, "note": "advance end pointer"},
    {"line": 8, "vars": {"starts[i]":7,"ends[j]":5}, "stdout": "rooms = 0", "note": "7 ≥ 5 → another meeting ends"},
    {"line": 12, "vars": {"j":2,"rooms":0}, "note": "advance end pointer"},
    {"line": 8, "vars": {"starts[i]":7,"ends[j]":9}, "stdout": "rooms = 1", "note": "start < end → new room"},
    {"line": 9, "vars": {"i":3,"rooms":1}, "note": "loop ends"},
    {"line": 13, "stdout": "return 2", "note": "max_rooms recorded"}
  ],
  "speed": 900
}
\`\`\`

### Min-Heap (Priority-Queue) Approach

1. Sort intervals by **start** time.
2. Keep a min-heap of **end** times of meetings currently in rooms.
3. For each meeting:
   - If the earliest ending meeting finishes **before** the current one starts, reuse that room (pop).
   - Otherwise allocate a new room (push).
4. The heap size at the end is the answer.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naïve Check All Pairs",
    "code": "# O(n²) — compare every pair\\nrooms = 0\\nfor i in range(n):\\n    cnt = 1\\n    for j in range(n):\\n        if overlap(intervals[i], intervals[j]):\\n            cnt += 1\\n    rooms = max(rooms, cnt)"
  },
  "after": {
    "label": "Heap Reuse",
    "code": "import heapq\\n\\ndef min_rooms_heap(intervals):\\n    intervals.sort(key=lambda x: x[0])\\n    ends = []  # min-heap of end times\\n    \\n    for s, e in intervals:\\n        if ends and ends[0] <= s:\\n            heapq.heappop(ends)  # reuse room\\n        heapq.heappush(ends, e)  # occupy room until e\\n    \\n    return len(ends)  # rooms in use"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Checkpoint: Minimum Meeting Rooms",
  "questions": [
    {
      "question": "When using the sweep-line method, what does the variable \`rooms\` represent at any instant?",
      "options": [
        "Total meetings processed so far",
        "Number of meetings that have ended",
        "Number of meetings happening right now",
        "Maximum rooms needed up to now"
      ],
      "answer": 2,
      "explanation": "\`rooms\` is incremented on a start event and decremented on an end event, so it always equals the current number of active meetings."
    },
    {
      "question": "If two meetings have times [3, 6] and [6, 8], do they require separate rooms?",
      "options": ["Yes", "No"],
      "answer": 1,
      "explanation": "A meeting ending at 6 frees the room exactly when the next one starts at 6, so they do not overlap."
    },
    {
      "question": "What is the worst-case space complexity of the heap solution?",
      "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      "answer": 2,
      "explanation": "In the worst case all meetings overlap and the heap stores every end time, giving O(n) space."
    }
  ]
}
\`\`\`

### Complexity

- **Time:** O(n log n) — dominated by sorting or heap operations.
- **Space:** O(n) — for the sorted arrays or heap.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The answer equals the maximum number of overlapping meetings at any time.",
    "Sweep-line (two pointers) and min-heap are both O(n log n); choose whichever you find clearer.",
    "Edge case: meetings ending at time \`t\` can immediately be reused by a meeting starting at \`t\`."
  ]
}
\`\`\``,
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
