import { Module } from "../types";

export const mergeIntervalsModule: Module = {
  id: "merge-intervals",
  title: "Merge Intervals",
  description: "Master interval manipulation problems including merging overlapping intervals, finding intersections, and scheduling. Essential for calendar, scheduling, and range problems.",
  lessons: [
    {
      id: "merge-intervals-intro",
      slug: "merge-intervals-intro",
      title: "Introduction to Merge Intervals",
      content: `## The Merge Intervals Pattern

Interval problems appear everywhere in software engineering — calendar scheduling, resource allocation, network time windows, and meeting room booking. The core challenge is always the same: given a collection of ranges, efficiently find or eliminate overlaps.

\`\`\`concept
{ "title": "The Merge Intervals Mental Model", "variant": "mental-model", "content": "Think of each interval as a highlighted segment on a number line. After sorting by start position, you walk left-to-right with a single 'active segment'. If the next segment touches or overlaps your active one, stretch it. If not, save your active segment and start a new one. One left-to-right pass is all you need." }
\`\`\`

---

## Seeing the Merge in Action

Before any code, build the visual intuition. Four intervals arrive unsorted — two of them overlap:

\`\`\`algoviz
{ "title": "Merging [1,3],[2,6],[8,10],[15,18]", "type": "array", "data": ["[1,3]", "[2,6]", "[8,10]", "[15,18]"], "frames": [ { "highlight": [0], "label": "Sort complete. Initialize result with first interval [1,3].", "stats": { "result": "[[1,3]]", "current": "[1,3]" } }, { "highlight": [0, 1], "label": "Compare [2,6] vs last result [1,3]. Start 2 ≤ end 3 → OVERLAP! Merge: end becomes max(3,6) = 6.", "stats": { "result": "[[1,6]]", "overlap": "yes" } }, { "highlight": [1, 2], "label": "Compare [8,10] vs last result [1,6]. Start 8 > end 6 → NO overlap. Append [8,10].", "stats": { "result": "[[1,6],[8,10]]", "overlap": "no" } }, { "highlight": [2, 3], "label": "Compare [15,18] vs last result [8,10]. Start 15 > end 10 → NO overlap. Append [15,18].", "stats": { "result": "[[1,6],[8,10],[15,18]]", "overlap": "no" } }, { "highlight": [], "label": "Done. 4 intervals → 3 merged intervals.", "stats": { "result": "[[1,6],[8,10],[15,18]]" } } ], "speed": 900 }
\`\`\`

---

## The Algorithm

\`\`\`steps
{ "title": "Merge Intervals — Step by Step", "steps": [ { "title": "Sort by start time", "content": "Sort all intervals by their start value. This is the key insight: after sorting, **overlapping intervals are always adjacent**. You will never need to look back more than one position.\\n\\nTime cost: O(n log n) — this is the bottleneck of the entire algorithm." }, { "title": "Initialize result with the first interval", "content": "Place \`intervals[0]\` into your result list. This becomes the 'active' interval — the one you are currently extending or finalizing." }, { "title": "Iterate through remaining intervals", "content": "For each interval \`curr\`, compare it with \`result[-1]\` (the last interval in your result):\\n\\n- **Overlap** (\`curr.start <= result[-1].end\`): Extend the active interval's end to \`max(result[-1].end, curr.end)\`.\\n- **No overlap** (\`curr.start > result[-1].end\`): The active interval is final. Append \`curr\` as the new active interval." }, { "title": "Return the result", "content": "When all intervals are processed, return the result list. It contains the minimum set of non-overlapping intervals that cover every range in the input." } ] }
\`\`\`

---

## The Overlap Condition

\`\`\`callout
{ "type": "info", "title": "When Do Two Intervals Overlap?", "content": "Intervals **[a, b]** and **[c, d]** overlap if and only if:\\n\\n\`\`\`\\nb >= c   (end of first ≥ start of second)\\n\`\`\`\\n\\nNote: touching endpoints count as overlapping. \`[1,4]\` and \`[4,5]\` overlap and merge into \`[1,5]\`.\\n\\nEquivalently: they do **NOT** overlap when \`b < c\`." }
\`\`\`

---

## Algorithm Trace — Code Walkthrough

\`\`\`trace
{ "title": "Tracing merge([[1,3],[2,6],[8,10],[15,18]])", "language": "python", "code": "def merge(intervals):\\n    intervals.sort(key=lambda x: x[0])\\n    merged = [intervals[0]]\\n    for curr in intervals[1:]:\\n        last = merged[-1]\\n        if curr[0] <= last[1]:       # overlap check\\n            last[1] = max(last[1], curr[1])\\n        else:\\n            merged.append(curr)\\n    return merged", "frames": [ { "line": 2, "vars": { "intervals": "[[1,3],[2,6],[8,10],[15,18]]" }, "note": "Sort by start time — already sorted here" }, { "line": 3, "vars": { "merged": "[[1,3]]" }, "note": "Initialize result with first interval" }, { "line": 4, "vars": { "curr": "[2,6]" }, "note": "Begin loop: first iteration" }, { "line": 5, "vars": { "last": "[1,3]" }, "note": "Peek at last interval in result" }, { "line": 6, "vars": { "curr[0]": 2, "last[1]": 3 }, "note": "2 ≤ 3 → overlap detected" }, { "line": 7, "vars": { "last[1]": 6, "merged": "[[1,6]]" }, "note": "Extend end to max(3,6) = 6. Mutates in place." }, { "line": 4, "vars": { "curr": "[8,10]" }, "note": "Second iteration" }, { "line": 6, "vars": { "curr[0]": 8, "last[1]": 6 }, "note": "8 > 6 → no overlap" }, { "line": 9, "vars": { "merged": "[[1,6],[8,10]]" }, "note": "No overlap — append as new interval" }, { "line": 4, "vars": { "curr": "[15,18]" }, "note": "Third iteration" }, { "line": 6, "vars": { "curr[0]": 15, "last[1]": 10 }, "note": "15 > 10 → no overlap" }, { "line": 9, "vars": { "merged": "[[1,6],[8,10],[15,18]]" }, "note": "Append final interval" }, { "line": 10, "vars": {}, "note": "Return complete merged result", "stdout": "[[1, 6], [8, 10], [15, 18]]" } ], "speed": 800 }
\`\`\`

---

## Problem Variants — Know Your Sort Strategy

Not every interval problem sorts by start time. Recognizing the variant determines your approach before you write a line of code.

\`\`\`tabs
{ "tabs": [ { "label": "Merge Overlapping", "icon": "🔗", "content": "**Sort by: start time**\\n\\nAfter sorting, overlapping intervals become adjacent. A single left-to-right scan merges them.\\n\\n**Key check:** \`curr.start <= last.end\`\\n\\n**Merge by:** \`last.end = max(last.end, curr.end)\`\\n\\n*Example problems: Merge Intervals (LeetCode 56), Insert Interval (57)*" }, { "label": "Find Intersections", "icon": "✂️", "content": "**Sort by: both lists pre-sorted**\\n\\nUse two pointers, one per list. At each step, check for overlap. Advance the pointer whose interval ends first.\\n\\n**Key check:** \`max(a.start, b.start) <= min(a.end, b.end)\`\\n\\n**Advance:** whichever interval ends sooner\\n\\n*Example problem: Interval List Intersections (LeetCode 986)*" }, { "label": "Non-Overlapping / Selection", "icon": "🎯", "content": "**Sort by: end time**\\n\\nGreedy insight: always pick the interval that **ends earliest** — it leaves maximum room for future intervals.\\n\\n**Key check:** \`curr.start < last_end\` → skip (overlap with last selected)\\n\\n*Example problem: Non-overlapping Intervals (LeetCode 435)*" }, { "label": "Concurrent Count", "icon": "📅", "content": "**Technique: line sweep**\\n\\nConvert intervals to events: \`+1\` at each start, \`-1\` at each end. Sort all events and track a running sum. The maximum running sum is the peak concurrency.\\n\\n*Example problem: Meeting Rooms II (LeetCode 253)*\\n\\nAlternative: min-heap approach — track earliest-ending room in use." } ] }
\`\`\`

---

## Complexity

| | Complexity | Reason |
|---|---|---|
| **Time** | O(n log n) | Sorting dominates — the scan is O(n) |
| **Space** | O(n) | Output array holds up to n intervals |

\`\`\`callout
{ "type": "tip", "title": "Space Optimization", "content": "If the problem allows in-place modification and guarantees sorted input, you can reduce auxiliary space to O(1) by writing merged intervals back into the input array and trimming at the end. This is rare in interview settings but useful to know." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Merge Intervals — Check Your Understanding", "questions": [ { "question": "Intervals [1,4] and [4,7] — do they overlap?", "options": ["No, they are adjacent but not overlapping", "Yes, touching endpoints count as overlap and they merge to [1,7]", "Only if the problem specifies inclusive endpoints", "No, overlap requires at least 2 shared values"], "answer": 1, "explanation": "When one interval ends exactly where another begins (end = start), they share a single point. By the standard definition used in LeetCode and interview problems, this counts as an overlap. The merged result is [1,7]." }, { "question": "You have n intervals with random start times. What is the time complexity of the merge algorithm?", "options": ["O(n) — one pass is enough", "O(n log n) — sorting is required first", "O(n²) — each interval is compared with every other", "O(log n) — binary search finds overlap positions"], "answer": 1, "explanation": "The sort step costs O(n log n). The subsequent linear scan costs O(n). Since O(n log n) dominates, total time complexity is O(n log n). If input is already sorted, you can skip sorting and achieve O(n)." }, { "question": "Which sort order should you use when selecting the maximum number of non-overlapping intervals (activity selection problem)?", "options": ["Sort by start time (ascending)", "Sort by end time (ascending)", "Sort by interval length (ascending)", "Sort by start time (descending)"], "answer": 1, "explanation": "Sorting by end time and greedily selecting intervals that don't conflict is the optimal approach. Picking the earliest-ending interval at each step leaves the most room for subsequent selections — a classic greedy argument. This solves LeetCode 435 (Non-overlapping Intervals)." }, { "question": "After sorting by start time, two intervals [a,b] and [c,d] where c > a. Under what condition do they NOT overlap?", "options": ["b < c", "b <= c", "a < c", "b > d"], "answer": 0, "explanation": "They do not overlap when b < c — the end of the first interval is strictly less than the start of the second. If b >= c, they overlap. If b = c, they touch (still counted as overlapping in most problems)." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Sort by start time first — this makes overlapping intervals adjacent, enabling a single O(n) scan to merge them.", "The overlap condition is curr.start <= last.end. On overlap, extend: last.end = max(last.end, curr.end).", "Time complexity is O(n log n) dominated by sorting; space is O(n) for the output.", "Different variants demand different sort strategies: end-time sorting for selection problems, line-sweep for concurrency counting.", "Recognize interval problems by keywords: 'ranges', 'overlapping', 'scheduling', 'meeting rooms', 'time windows'." ] }
\`\`\``,
    },
    {
      id: "merge-overlapping-intervals",
      slug: "merge-overlapping-intervals",
      title: "Merge Overlapping Intervals",
      content: `## Merge Overlapping Intervals

<!-- voice:section_check concept="merging overlapping intervals" -->

\`\`\`concept
{ "title": "The Core Insight", "variant": "mental-model", "content": "After sorting intervals by start time, every potential overlap is **local** — you only ever need to compare the current interval against the last one in your result list. No pair-wise checking required." }
\`\`\`

### Problem Statement

Given a collection of intervals, merge all **overlapping intervals** and return the minimal set of non-overlapping intervals that collectively cover all the same time ranges.

Two intervals are considered overlapping if they share any common time — including when one ends exactly where another begins (e.g., \`[1, 4]\` and \`[4, 5]\` → merge into \`[1, 5]\`).

\`\`\`callout
{ "type": "tip", "title": "Clarify Before Coding", "content": "Always confirm with the interviewer: are touching intervals like \`[1,2]\` and \`[2,3]\` considered overlapping? In LeetCode #56 (and this lesson) they **are** — use \`<=\` not \`<\` in your overlap check." }
\`\`\`

### Visualizing the Algorithm

Watch what happens step-by-step on \`[[1,3],[2,6],[8,10],[15,18]]\`:

\`\`\`algoviz
{ "title": "Merge Intervals — Step by Step", "type": "array", "data": [[1,3],[2,6],[8,10],[15,18]], "frames": [ { "highlight": [0], "label": "Sort by start (already sorted). Initialize result = [[1,3]]", "stats": { "result": "[[1,3]]", "current": "[1,3]" } }, { "highlight": [1], "label": "[2,6]: start=2 ≤ end=3 of last merged → overlap! Extend end to max(3,6)=6", "stats": { "result": "[[1,6]]", "current": "[2,6]" } }, { "highlight": [2], "label": "[8,10]: start=8 > end=6 → no overlap. Append as new interval.", "stats": { "result": "[[1,6],[8,10]]", "current": "[8,10]" } }, { "highlight": [3], "label": "[15,18]: start=15 > end=10 → no overlap. Append as new interval.", "stats": { "result": "[[1,6],[8,10],[15,18]]", "current": "[15,18]" } } ], "speed": 900 }
\`\`\`

### The Algorithm

\`\`\`steps
{ "title": "Sort-and-Merge Algorithm", "steps": [ { "title": "Sort by start time", "content": "Sort all intervals by their start value. This guarantees that if interval \`i\` can overlap with anything, it can only overlap with intervals that came before it in sorted order — and specifically, only the *last* merged interval." }, { "title": "Initialize result with the first interval", "content": "After sorting, the first interval can't overlap with anything before it. Push it directly into the result list." }, { "title": "Iterate and decide: merge or append", "content": "For each subsequent interval:\\n- **Overlap** (\`current.start <= last.end\`): merge by setting \`last.end = max(last.end, current.end)\`\\n- **No overlap** (\`current.start > last.end\`): append \`current\` to result as a new standalone interval" }, { "title": "Return the result", "content": "After the loop, the result list contains all merged, non-overlapping intervals in sorted order." } ] }
\`\`\`

### Tracing Through Both Examples

\`\`\`trace
{ "title": "Trace: [[1,3],[2,6],[8,10],[15,18]]", "language": "python", "code": "def merge(intervals):\\n    intervals.sort(key=lambda x: x[0])\\n    result = [intervals[0]]\\n    for curr in intervals[1:]:\\n        last = result[-1]\\n        if curr[0] <= last[1]:\\n            last[1] = max(last[1], curr[1])\\n        else:\\n            result.append(curr)\\n    return result", "frames": [ { "line": 2, "vars": { "intervals": "[[1,3],[2,6],[8,10],[15,18]]" }, "note": "Sort by start (no change here)" }, { "line": 3, "vars": { "result": "[[1,3]]" }, "note": "Seed result with first interval" }, { "line": 4, "vars": { "curr": "[2,6]", "last": "[1,3]" }, "note": "curr.start=2 ≤ last.end=3 → overlap" }, { "line": 6, "vars": { "result": "[[1,6]]" }, "note": "Extend last.end to max(3,6)=6" }, { "line": 4, "vars": { "curr": "[8,10]", "last": "[1,6]" }, "note": "curr.start=8 > last.end=6 → no overlap" }, { "line": 8, "vars": { "result": "[[1,6],[8,10]]" }, "note": "Append [8,10] as new interval" }, { "line": 4, "vars": { "curr": "[15,18]", "last": "[8,10]" }, "note": "curr.start=15 > last.end=10 → no overlap" }, { "line": 8, "vars": { "result": "[[1,6],[8,10],[15,18]]" }, "note": "Append [15,18]. Loop ends." } ], "speed": 800 }
\`\`\`

### Corner Cases to Watch For

\`\`\`tabs
{ "tabs": [ { "label": "Touching intervals", "icon": "🤝", "content": "**\`[[1,4],[4,5]]\` → \`[[1,5]]\`**\\n\\nBecause \`4 <= 4\`, these are considered overlapping. Use \`<=\` in your check:\\n\`\`\`python\\nif curr[0] <= last[1]:  # <= not <\\n\`\`\`" }, { "label": "One inside another", "icon": "🫙", "content": "**\`[[1,10],[2,3]]\` → \`[[1,10]]\`**\\n\\n\`[2,3]\` is fully contained inside \`[1,10]\`. The \`max()\` call handles this:\\n\`\`\`python\\nlast[1] = max(last[1], curr[1])  # max(10, 3) = 10, no shrinkage\\n\`\`\`\\nWithout \`max()\`, you'd incorrectly shrink the end to 3." }, { "label": "Empty / single", "icon": "1️⃣", "content": "**Edge cases to handle:**\\n- Empty input \`[]\` → return \`[]\`\\n- Single interval \`[[a,b]]\` → return \`[[a,b]]\`\\n\\nBoth are naturally handled if you guard the seed step:\\n\`\`\`python\\nif not intervals:\\n    return []\\n\`\`\`" }, { "label": "Already sorted", "icon": "✅", "content": "If the input is pre-sorted, sorting is O(n) (Timsort detects this). The algorithm's correctness doesn't change — the sort step is a no-op on already-sorted data." } ] }
\`\`\`

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Missing max() — bug with contained intervals", "code": "for curr in intervals[1:]:\\n    last = result[-1]\\n    if curr[0] <= last[1]:\\n        last[1] = curr[1]  # BUG: shrinks if curr ends earlier\\n    else:\\n        result.append(curr)" }, "after": { "label": "Correct — always take the wider end", "code": "for curr in intervals[1:]:\\n    last = result[-1]\\n    if curr[0] <= last[1]:\\n        last[1] = max(last[1], curr[1])  # Correct: only extend\\n    else:\\n        result.append(curr)" } }
\`\`\`

### Complexity

| | Complexity | Why |
|---|---|---|
| **Time** | O(n log n) | Sorting dominates; the merge pass is O(n) |
| **Space** | O(n) | Result array holds at most n intervals |

<!-- voice:key_insight insight="After sorting by start time, we only need to check if the current interval overlaps with the last one in our result — because anything earlier was already merged." -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "Given [[1,4],[0,2],[3,5]], what is the merged output after sorting and merging?", "options": ["[[0,4],[3,5]]", "[[0,5]]", "[[0,2],[1,4],[3,5]]", "[[0,4]]"], "answer": 1, "explanation": "After sorting: [[0,2],[1,4],[3,5]]. [0,2] and [1,4] overlap → [0,4]. Then [0,4] and [3,5] overlap (3 ≤ 4) → [0,5]. Final answer: [[0,5]]." }, { "question": "Why do we take max(last.end, curr.end) instead of just curr.end during a merge?", "options": ["To handle unsorted input", "To avoid shrinking the merged interval when curr is fully contained in last", "To improve performance", "It makes no difference — both give correct results"], "answer": 1, "explanation": "If curr is fully contained inside last (e.g., last=[1,10], curr=[2,3]), taking curr.end=3 would shrink the interval from [1,10] to [1,3]. Using max(10,3)=10 preserves the correct wider boundary." }, { "question": "What is the time complexity of the merge intervals algorithm?", "options": ["O(n)", "O(n²)", "O(n log n)", "O(log n)"], "answer": 2, "explanation": "The sort step is O(n log n). The subsequent linear scan is O(n). Since O(n log n) dominates, the total time complexity is O(n log n)." }, { "question": "What is the minimum number of intervals in the output for input [[1,2],[3,4],[5,6]]?", "options": ["1", "2", "3", "It depends on the sort"], "answer": 2, "explanation": "None of these intervals overlap (1<2<3<4<5<6 with strict gaps). After sorting and scanning, none trigger a merge — all three are appended to result as-is. Output: [[1,2],[3,4],[5,6]]." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Sort intervals by start time first — this reduces the problem from O(n²) pair comparisons to a single O(n) linear scan.", "Use max(last.end, curr.end) when merging — this correctly handles the case where one interval is fully contained within another.", "The overlap condition is curr.start <= last.end (≤ not <) — touching intervals like [1,4] and [4,5] should be merged.", "Always handle edge cases: empty input, single interval, and fully-contained intervals.", "This same sort-and-scan skeleton applies to related problems: Insert Interval, Meeting Rooms II, and Non-overlapping Intervals." ] }
\`\`\``,
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

\`\`\`concept
{ "title": "The Three-Zone Mental Model", "variant": "mental-model", "content": "When inserting a new interval into a sorted, non-overlapping list, every existing interval falls into exactly one of three zones:\\n\\n**Zone 1 — Before:** The existing interval ends before the new interval starts. No overlap. Copy directly to output.\\n\\n**Zone 2 — Overlapping:** The existing interval overlaps the new interval. Absorb it by expanding the new interval's boundaries.\\n\\n**Zone 3 — After:** The existing interval starts after the new interval ends. No overlap. Copy directly to output.\\n\\nThis single-pass classification gives O(n) time with no extra sorting." }
\`\`\`

### Problem Statement

Given a list of **non-overlapping**, **sorted** intervals, insert a new interval and merge any overlaps. Return the resulting sorted, non-overlapping intervals.

\`\`\`callout
{ "type": "info", "title": "Overlap Clarification", "content": "Two intervals \`[a, b]\` and \`[c, d]\` overlap when \`a <= d\` AND \`c <= b\`. Always ask your interviewer: do touching intervals like \`[1,2]\` and \`[2,3]\` count as overlapping? The answer changes \`<\` vs \`<=\` in your conditions." }
\`\`\`

### Examples

**Example 1 — Single merge:**

\`\`\`
intervals = [[1, 3], [6, 9]],  newInterval = [2, 5]
Output:      [[1, 5], [6, 9]]
\`\`\`

\`[2,5]\` overlaps \`[1,3]\` → merged to \`[1,5]\`. Then \`[6,9]\` passes through untouched.

**Example 2 — Multiple merges:**

\`\`\`
intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]],  newInterval = [4, 8]
Output:      [[1, 2], [3, 10], [12, 16]]
\`\`\`

\`[4,8]\` overlaps \`[3,5]\`, \`[6,7]\`, and \`[8,10]\` — all three absorbed into \`[3,10]\`.

### Visualizing the Three Zones

\`\`\`algoviz
{ "title": "Zone Classification: [[1,2],[3,5],[6,7],[8,10],[12,16]], new=[4,8]", "type": "array", "data": ["[1,2]", "[3,5]", "[6,7]", "[8,10]", "[12,16]"], "frames": [ { "highlight": [], "label": "New interval = [4,8]. Classify each existing interval into one of three zones.", "stats": { "new": "[4,8]", "result": "[]" } }, { "highlight": [0], "label": "Zone 1: [1,2] ends at 2 < 4 (new start). No overlap — copy as-is.", "stats": { "zone": "before", "result": "[[1,2]]" } }, { "highlight": [1], "label": "Zone 2: [3,5] starts at 3 ≤ 8 (new end). Overlaps — expand new to [3,8].", "stats": { "zone": "overlap", "new": "[3,8]" } }, { "highlight": [2], "label": "Zone 2: [6,7] starts at 6 ≤ 8. Still overlaps — new stays [3,8].", "stats": { "zone": "overlap", "new": "[3,8]" } }, { "highlight": [3], "label": "Zone 2: [8,10] starts at 8 ≤ 8. Overlaps — expand new to [3,10].", "stats": { "zone": "overlap", "new": "[3,10]" } }, { "highlight": [4], "label": "Zone 3: [12,16] starts at 12 > 10 (merged end). Emit [3,10], then copy [12,16].", "stats": { "zone": "after", "result": "[[1,2],[3,10],[12,16]]" } } ], "speed": 900 }
\`\`\`

### Algorithm

\`\`\`steps
{ "title": "Insert Interval — Three-Zone Approach", "steps": [ { "title": "Zone 1: Copy intervals that end before the new interval starts", "content": "Advance while \`intervals[i][1] < newInterval[0]\`.\\n\\nThese intervals finish before the new one begins — zero chance of overlap. Append each directly to \`result\`." }, { "title": "Zone 2: Expand newInterval to absorb all overlapping intervals", "content": "Continue while \`intervals[i][0] <= newInterval[1]\`.\\n\\nFor each overlapping interval, widen \`newInterval\` to cover both:\\n\`\`\`\\nnewInterval[0] = min(newInterval[0], intervals[i][0])\\nnewInterval[1] = max(newInterval[1], intervals[i][1])\\n\`\`\`\\nWhen the loop exits, append the fully-merged \`newInterval\`." }, { "title": "Zone 3: Copy all remaining intervals", "content": "Append everything that's left. Since the input is sorted and we already merged the overlap region, every remaining interval starts after the merged interval ends — no further merging needed." } ] }
\`\`\`

### Code Trace

\`\`\`trace
{ "title": "Trace: intervals=[[1,3],[6,9]], newInterval=[2,5]", "language": "python", "code": "def insert(intervals, new):\\n    result = []\\n    i = 0\\n    while i < len(intervals) and intervals[i][1] < new[0]:\\n        result.append(intervals[i])\\n        i += 1\\n    while i < len(intervals) and intervals[i][0] <= new[1]:\\n        new[0] = min(new[0], intervals[i][0])\\n        new[1] = max(new[1], intervals[i][1])\\n        i += 1\\n    result.append(new)\\n    while i < len(intervals):\\n        result.append(intervals[i])\\n        i += 1\\n    return result", "frames": [ { "line": 2, "vars": { "result": "[]", "i": "—", "new": "[2,5]" }, "note": "Initialize output list." }, { "line": 3, "vars": { "result": "[]", "i": 0, "new": "[2,5]" }, "note": "i starts at 0." }, { "line": 4, "vars": { "result": "[]", "i": 0, "new": "[2,5]" }, "note": "Zone 1 check: intervals[0][1]=3 < new[0]=2? No — Zone 1 is empty, skip entirely." }, { "line": 7, "vars": { "result": "[]", "i": 0, "new": "[2,5]" }, "note": "Zone 2 check: intervals[0][0]=1 ≤ new[1]=5? Yes — [1,3] overlaps [2,5]." }, { "line": 8, "vars": { "result": "[]", "i": 0, "new": "[1,5]" }, "note": "Expand left: new[0] = min(2, 1) = 1." }, { "line": 9, "vars": { "result": "[]", "i": 0, "new": "[1,5]" }, "note": "Expand right: new[1] = max(5, 3) = 5. (No change — new already covers [1,3].)" }, { "line": 10, "vars": { "result": "[]", "i": 1, "new": "[1,5]" }, "note": "Advance i to 1." }, { "line": 7, "vars": { "result": "[]", "i": 1, "new": "[1,5]" }, "note": "Zone 2 check: intervals[1][0]=6 ≤ new[1]=5? No — exit Zone 2." }, { "line": 11, "vars": { "result": "[[1,5]]", "i": 1, "new": "[1,5]" }, "note": "Append the merged interval [1,5]." }, { "line": 13, "vars": { "result": "[[1,5],[6,9]]", "i": 2, "new": "[1,5]" }, "note": "Zone 3: append [6,9]. i=2, loop ends." }, { "line": 15, "vars": { "result": "[[1,5],[6,9]]", "i": 2, "new": "[1,5]" }, "note": "Done.", "stdout": "[[1, 5], [6, 9]]" } ], "speed": 800 }
\`\`\`

### Complexity

| | |
|---|---|
| **Time** | O(n) — single pass; each interval is visited exactly once across the three zones |
| **Space** | O(n) — result list holds at most n + 1 intervals |

The input is already sorted, so no sorting step is needed. The three-zone scan is strictly linear.

<!-- voice:key_insight insight="Three zones: intervals before (no overlap), overlapping intervals (merge all), intervals after (no overlap)" -->

\`\`\`callout
{ "type": "warning", "title": "Corner Cases to Verify", "content": "- **Empty \`intervals\`** — return \`[newInterval]\` immediately.\\n- **newInterval before everything** — Zone 1 is empty; entire list is Zone 3.\\n- **newInterval after everything** — Zone 2/3 are empty; entire list is Zone 1, then append newInterval.\\n- **newInterval consumed by one existing interval** — min/max expansion handles this correctly; the boundary doesn't shrink.\\n- **Touching intervals** like \`[1,3]\` and \`[3,5]\` with new \`[3,4]\` — behavior depends on \`<\` vs \`<=\` in Zone 1's exit condition." }
\`\`\`

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Check Your Understanding

\`\`\`quiz
{ "title": "Insert Interval", "questions": [ { "question": "Given intervals = [[1,4],[7,9]] and newInterval = [5,6], what is the output?", "options": ["[[1,4],[5,6],[7,9]]", "[[1,6],[7,9]]", "[[1,9]]", "[[1,4],[5,9]]"], "answer": 0, "explanation": "[5,6] starts at 5 > 4 (end of [1,4]) and ends at 6 < 7 (start of [7,9]). It falls entirely in a gap — no overlaps. All three intervals are output in order." }, { "question": "The Zone 2 while loop uses condition \`intervals[i][0] <= newInterval[1]\`. What does this detect?", "options": ["The existing interval starts before the new interval starts", "The existing interval starts at or before the new interval ends — they overlap", "The existing interval ends after the new interval ends", "The new interval is completely inside the existing interval"], "answer": 1, "explanation": "Since Zone 1 already filtered out intervals that end before the new one starts, any remaining interval that begins at or before newInterval[1] must overlap with it. This single check is sufficient because the list is sorted." }, { "question": "What is the time complexity of this three-zone algorithm?", "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"], "answer": 2, "explanation": "Every interval is visited exactly once across the three while loops. Because the input is already sorted, no sorting step is required. Total work is O(n)." }, { "question": "newInterval = [1, 100], intervals = [[2,5],[10,20],[30,80]]. How many intervals are in the output?", "options": ["1", "2", "3", "4"], "answer": 0, "explanation": "newInterval [1,100] overlaps every existing interval (all start before 100 and end after 1). Zone 1 is empty. All three are absorbed in Zone 2: new[0]=min(1,2,10,30)=1, new[1]=max(100,5,20,80)=100. Output: [[1,100]]." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The three-zone model (before / overlapping / after) reduces Insert Interval to a clean O(n) single pass — no sorting required since the input is already sorted.", "Zone 2 expansion uses min for the left boundary and max for the right: this correctly handles partial overlaps, full containment, and chains of overlapping intervals.", "Get the boundary conditions right: Zone 1 exits when intervals[i][1] >= newInterval[0]; Zone 2 exits when intervals[i][0] > newInterval[1].", "Always verify corner cases: empty input, newInterval before/after all existing intervals, and newInterval fully consumed by one larger existing interval.", "This pattern — scan sorted ranges in three phases — recurs in meeting rooms, calendar merging, and interval intersection problems." ] }
\`\`\``,
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

The **Interval Intersection** problem: given two sorted, pairwise-disjoint lists of intervals, find every sub-interval that belongs to *both* simultaneously. It's the building block behind calendar conflict detection, genomic overlap analysis, and range join queries.

\`\`\`concept
{ "title": "The Intersection Formula", "variant": "rule", "content": "Two intervals [a, b] and [c, d] intersect at [max(a, c), min(b, d)]. If max(a, c) ≤ min(b, d), the intersection is valid. Otherwise the intervals are disjoint — no complex conditionals, no case analysis needed." }
\`\`\`

### Why Two Pointers Work

Both input lists are **already sorted** — a gift we must exploit. A brute-force O(n·m) pass checks every pair. But because both lists are sorted, once an interval in \`first\` ends *before* the current interval in \`second\` begins, that interval of \`first\` can never intersect anything further in \`second\`. We advance past it immediately.

\`\`\`steps
{ "title": "Two-Pointer Algorithm", "steps": [ { "title": "Initialize", "content": "Set \`i = 0\` into \`first[]\` and \`j = 0\` into \`second[]\`. Loop while both pointers are in bounds." }, { "title": "Compute candidate intersection", "content": "For the current pair \`first[i]\` and \`second[j]\`:\\n\\n\`\`\`\\nstart = max(first[i][0], second[j][0])\\nend   = min(first[i][1], second[j][1])\\n\`\`\`\\n\\nThis single formula replaces six nested if-else branches." }, { "title": "Record if valid", "content": "If \`start <= end\`, the intersection is non-empty. Append \`[start, end]\` to results. Touching intervals like \`[2,2]\` are valid — clarify with your interviewer." }, { "title": "Advance the earlier-ending pointer", "content": "The interval that ends first cannot intersect any *later* interval in the other list (those only start later or equal). Advance its pointer:\\n\\n\`\`\`\\nif first[i][1] < second[j][1]:  i += 1\\nelse:                            j += 1\\n\`\`\`" } ] }
\`\`\`

### Execution Trace on the Full Example

\`\`\`algoviz
{ "title": "i walks through first[] — label shows current second[j]", "type": "array", "data": [[0,2],[5,10],[13,23],[24,25]], "frames": [ {"highlight":[0],"label":"i=0 j=0 | [0,2] ∩ [1,5] → max(0,1)=1, min(2,5)=2 → [1,2] ✓ | first ends earlier → i++","stats":{"i":0,"j":0,"result":"[[1,2]]"}}, {"highlight":[1],"label":"i=1 j=0 | [5,10] ∩ [1,5] → max(5,1)=5, min(10,5)=5 → [5,5] ✓ | second ends earlier → j++","stats":{"i":1,"j":0,"result":"[[1,2],[5,5]]"}}, {"highlight":[1],"label":"i=1 j=1 | [5,10] ∩ [8,12] → max(5,8)=8, min(10,12)=10 → [8,10] ✓ | first ends earlier → i++","stats":{"i":1,"j":1,"result":"[[1,2],[5,5],[8,10]]"}}, {"highlight":[2],"label":"i=2 j=1 | [13,23] ∩ [8,12] → max(13,8)=13, min(23,12)=12 → 13>12 invalid | second ends earlier → j++","stats":{"i":2,"j":1,"result":"(no change)"}}, {"highlight":[2],"label":"i=2 j=2 | [13,23] ∩ [15,24] → max(13,15)=15, min(23,24)=23 → [15,23] ✓ | first ends earlier → i++","stats":{"i":2,"j":2,"result":"...,[15,23]"}}, {"highlight":[3],"label":"i=3 j=2 | [24,25] ∩ [15,24] → max(24,15)=24, min(25,24)=24 → [24,24] ✓ | second ends earlier → j++","stats":{"i":3,"j":2,"result":"...,[24,24]"}}, {"highlight":[3],"label":"i=3 j=3 | [24,25] ∩ [25,26] → max(24,25)=25, min(25,26)=25 → [25,25] ✓ | first ends earlier → i++","stats":{"i":3,"j":3,"result":"...,[25,25]"}}, {"highlight":[],"label":"i=4: out of bounds → done. Output: [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]","stats":{"i":4,"j":3,"result":"complete"}} ], "speed": 900 }
\`\`\`

### Code and Step-by-Step Trace

<!-- voice:key_insight insight="Two intervals intersect at [max of starts, min of ends] — if max_start <= min_end, they overlap" -->

\`\`\`trace
{ "title": "Trace on first=[[0,2],[5,10]], second=[[1,5],[8,12]]", "language": "python", "code": "def intervalIntersection(first, second):\\n    result = []\\n    i, j = 0, 0\\n    while i < len(first) and j < len(second):\\n        start = max(first[i][0], second[j][0])\\n        end   = min(first[i][1], second[j][1])\\n        if start <= end:\\n            result.append([start, end])\\n        if first[i][1] < second[j][1]:\\n            i += 1\\n        else:\\n            j += 1\\n    return result", "frames": [ {"line":1,"vars":{"first":"[[0,2],[5,10]]","second":"[[1,5],[8,12]]"},"note":"Function called with two sorted interval lists"}, {"line":2,"vars":{"result":"[]"},"note":"Initialize empty result list"}, {"line":3,"vars":{"i":0,"j":0},"note":"Both pointers start at index 0"}, {"line":4,"vars":{},"note":"0 < 2 and 0 < 2 — enter loop"}, {"line":5,"vars":{"start":1},"note":"max(first[0][0]=0, second[0][0]=1) = 1"}, {"line":6,"vars":{"end":2},"note":"min(first[0][1]=2, second[0][1]=5) = 2"}, {"line":7,"vars":{"start":1,"end":2},"note":"1 <= 2 — valid intersection"}, {"line":8,"vars":{"result":"[[1,2]]"},"note":"Append [1,2]"}, {"line":9,"vars":{},"note":"first[0][1]=2 < second[0][1]=5 — first ends sooner"}, {"line":10,"vars":{"i":1},"note":"Advance i to 1"}, {"line":4,"vars":{"i":1,"j":0},"note":"1 < 2 and 0 < 2 — continue"}, {"line":5,"vars":{"start":5},"note":"max(first[1][0]=5, second[0][0]=1) = 5"}, {"line":6,"vars":{"end":5},"note":"min(first[1][1]=10, second[0][1]=5) = 5"}, {"line":7,"vars":{"start":5,"end":5},"note":"5 <= 5 — touching counts as valid!"}, {"line":8,"vars":{"result":"[[1,2],[5,5]]"},"note":"Append [5,5]"}, {"line":9,"vars":{},"note":"first[1][1]=10 >= second[0][1]=5 — second ends sooner"}, {"line":12,"vars":{"j":1},"note":"Advance j to 1"}, {"line":4,"vars":{"i":1,"j":1},"note":"1 < 2 and 1 < 2 — continue"}, {"line":5,"vars":{"start":8},"note":"max(5, 8) = 8"}, {"line":6,"vars":{"end":10},"note":"min(10, 12) = 10"}, {"line":8,"vars":{"result":"[[1,2],[5,5],[8,10]]"},"note":"Append [8,10]"}, {"line":10,"vars":{"i":2},"note":"first[1][1]=10 < 12 → i = 2, now out of bounds"}, {"line":13,"vars":{"result":"[[1,2],[5,5],[8,10]]"},"note":"Return result"} ], "speed": 800 }
\`\`\`

### Interview Prep

\`\`\`callout
{ "type": "warning", "title": "Clarify Before You Code", "content": "Three questions to ask up front:\\n\\n1. **Touching intervals** — does \`[1,2]\` and \`[2,3]\` produce intersection \`[2,2]\`? (LeetCode 986 says yes.)\\n2. **Empty lists** — if either input is empty, return \`[]\`. The while condition handles this automatically.\\n3. **Closed vs. open** — the formula assumes closed intervals \`[a, b]\`. Open intervals would use strict inequality." }
\`\`\`

### Complexity

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(n + m) | Each pointer advances exactly once per interval — linear scan through both lists |
| **Space** | O(min(n, m)) | At most min(n, m) intersections exist, bounded by the shorter list |

\`\`\`collapse
{ "title": "Deep Dive: Why space is O(min(n, m)) and not O(n + m)", "content": "Each interval in the shorter list is disjoint from its neighbors, so it can overlap with **at most one** interval in the longer list. If the shorter list has k intervals, you can produce at most k intersections — no matter how many intervals the longer list has. Hence the result size is bounded by min(n, m), not their sum." }
\`\`\`

### Knowledge Check

\`\`\`quiz
{ "title": "Interval Intersection", "questions": [ { "question": "What is the intersection of [3, 7] and [5, 10]?", "options": ["[3, 10]", "[5, 7]", "[3, 5]", "[7, 10]"], "answer": 1, "explanation": "Intersection = [max(3,5), min(7,10)] = [5, 7]. We take the later of the two starts and the earlier of the two ends." }, { "question": "When should you advance pointer i (into first[])?", "options": [ "When first[i][0] < second[j][0]", "When first[i][1] < second[j][1]", "Every time a valid intersection is found", "When first[i][1] > second[j][1]" ], "answer": 1, "explanation": "Advance the pointer whose current interval ends first. If first[i][1] < second[j][1], first[i] is 'used up' — it cannot intersect any later (rightward) interval in second[], so move i forward." }, { "question": "What does max(start1, start2) > min(end1, end2) indicate?", "options": [ "The intervals are identical", "One interval is fully contained in the other", "The intervals do not intersect", "We should merge the intervals instead" ], "answer": 2, "explanation": "A valid interval requires start ≤ end. When max(start1, start2) > min(end1, end2), the computed intersection has start > end — it's invalid, meaning the two intervals are disjoint." }, { "question": "What is the time complexity of the two-pointer intersection algorithm on lists of size n and m?", "options": ["O(n log m)", "O(n · m)", "O(n + m)", "O((n + m) log(n + m))"], "answer": 2, "explanation": "Each pointer moves strictly forward, and every interval is visited at most once. Total comparisons = n + m, giving linear O(n + m) time — far better than the O(n · m) brute-force approach." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Intersection of [a,b] and [c,d] = [max(a,c), min(b,d)] — valid exactly when max(a,c) ≤ min(b,d)", "Advance the pointer whose interval ends first — it has no future overlap potential with any later interval", "Two-pointer yields O(n+m) time by exploiting sorted order — brute force is O(n·m)", "Touching intervals [1,2] and [2,3] produce [2,2]: always clarify closed vs. open with your interviewer", "Output size is bounded by O(min(n,m)) — each interval in the shorter list overlaps at most one in the longer" ] }
\`\`\``,
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

Given an array of meeting time intervals, can one person attend **all** meetings without any two overlapping? This is the gateway interval problem — mastering it unlocks the entire Merge Intervals pattern.

\`\`\`concept
{ "title": "The Sorting Trick", "variant": "insight", "content": "After sorting intervals by start time, any two overlapping intervals must be adjacent. This collapses an O(n²) all-pairs check into a single O(n) scan — you only ever compare each interval to its immediate predecessor." }
\`\`\`

### Problem Statement

Given \`intervals[i] = [start, end]\`, return \`true\` if a single person can attend all meetings (no two overlap), \`false\` otherwise.

**Example 1 — Conflict:**
\`\`\`
Input:  [[0, 30], [5, 10], [15, 20]]
Output: false
\`\`\`
\`[0, 30]\` overlaps with both \`[5, 10]\` and \`[15, 20]\`.

**Example 2 — No Conflict:**
\`\`\`
Input:  [[7, 10], [2, 4]]
Output: true
\`\`\`
After sorting: \`[2, 4]\` ends at 4, and \`[7, 10]\` starts at 7 — no overlap.

### The Algorithm

\`\`\`steps
{ "title": "Meeting Rooms: Step-by-Step", "steps": [ { "title": "Sort by Start Time", "content": "Sort all intervals ascending by their start value.\\n\\n\`[[0,30],[5,10],[15,20]]\` → already sorted by start\\n\\n\`[[7,10],[2,4]]\` → sorted becomes \`[[2,4],[7,10]]\`\\n\\nThis guarantees that if any overlap exists, it will appear between consecutive elements." }, { "title": "Scan Adjacent Pairs", "content": "Iterate from index 1. For each interval \`i\`, compare its **start** against interval \`i-1\`'s **end**:\\n\\n\`\`\`\\nif intervals[i][0] < intervals[i-1][1]:\\n    return False  # conflict found\\n\`\`\`\\n\\nWhy only adjacent? Because after sorting, a meeting can only conflict with the one directly before it in the sorted order." }, { "title": "Return True if Clean", "content": "If the entire array is scanned without finding a conflict, the person can attend every meeting.\\n\\n\`\`\`\\nreturn True\\n\`\`\`" } ] }
\`\`\`

### Visualizing Example 1

\`\`\`algoviz
{ "title": "Can attend [[0,30],[5,10],[15,20]]?", "type": "array", "data": ["[0,30]", "[5,10]", "[15,20]"], "frames": [ { "highlight": [], "label": "Sort by start time — already sorted: [0,30], [5,10], [15,20]", "stats": { "step": "sort", "prev_end": "-" } }, { "highlight": [0, 1], "label": "Check pair (0,1): curr.start=5 < prev.end=30 → OVERLAP detected!", "stats": { "i": 1, "curr_start": 5, "prev_end": 30 } }, { "highlight": [0, 1, 2], "label": "Return false immediately — no need to check further", "stats": { "result": "false" } } ], "speed": 900 }
\`\`\`

### Brute Force vs Optimal

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Brute Force — O(n²)", "code": "def can_attend(intervals):\\n    n = len(intervals)\\n    for i in range(n):\\n        for j in range(i + 1, n):\\n            a, b = intervals[i]\\n            c, d = intervals[j]\\n            # Two intervals overlap if max(a,c) < min(b,d)\\n            if max(a, c) < min(b, d):\\n                return False\\n    return True" }, "after": { "label": "Sort + Linear Scan — O(n log n)", "code": "def can_attend(intervals):\\n    # Sort by start time\\n    intervals.sort(key=lambda x: x[0])\\n\\n    for i in range(1, len(intervals)):\\n        # Adjacent overlap check is sufficient after sorting\\n        if intervals[i][0] < intervals[i - 1][1]:\\n            return False\\n\\n    return True" } }
\`\`\`

<!-- voice:key_insight insight="After sorting, we only need to check adjacent intervals for conflicts" -->

### Code Trace — Example 2

\`\`\`trace
{ "title": "Trace: [[7,10],[2,4]] → true", "language": "python", "code": "intervals = [[7, 10], [2, 4]]\\nintervals.sort(key=lambda x: x[0])\\nfor i in range(1, len(intervals)):\\n    if intervals[i][0] < intervals[i-1][1]:\\n        return False\\nreturn True", "frames": [ { "line": 1, "vars": { "intervals": "[[7,10],[2,4]]" }, "note": "Original unsorted input", "stdout": "" }, { "line": 2, "vars": { "intervals": "[[2,4],[7,10]]" }, "note": "Sort by start time: 2 < 7", "stdout": "" }, { "line": 3, "vars": { "i": 1 }, "note": "Loop begins at index 1", "stdout": "" }, { "line": 4, "vars": { "i": 1, "intervals[1][0]": 7, "intervals[0][1]": 4 }, "note": "Check: 7 < 4? → False, no conflict", "stdout": "" }, { "line": 6, "vars": { "result": "True" }, "note": "Scan complete — return True", "stdout": "True" } ], "speed": 800 }
\`\`\`

### Complexity

| | Complexity | Reason |
|---|---|---|
| **Time** | O(n log n) | Sorting dominates the O(n) scan |
| **Space** | O(1) or O(log n) | No extra data structures; stack space depends on sort |

\`\`\`callout
{ "type": "tip", "title": "Boundary Case: Meetings that share an endpoint", "content": "If meeting A ends exactly when meeting B starts — e.g., [0, 10] and [10, 20] — there is **no conflict**. The condition uses strict less-than (\`<\`), not less-than-or-equal. A person can leave one meeting at 10 and enter the next at 10." }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "This Is Meeting Rooms I — What Comes Next?", "content": "Meeting Rooms I asks: *can one person attend all?* (boolean)\\n\\nMeeting Rooms II asks: *what is the minimum number of rooms needed?* (integer)\\n\\nThe harder variant adds a **min-heap** to track how many meetings are simultaneously active. The sorting insight you learned here carries over directly." }
\`\`\`

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Knowledge Check

\`\`\`quiz
{ "title": "Meeting Rooms — Check Your Understanding", "questions": [ { "question": "After sorting [[3,9],[1,5],[6,10]] by start time, what is the correct order?", "options": ["[[3,9],[1,5],[6,10]]", "[[1,5],[3,9],[6,10]]", "[[1,5],[6,10],[3,9]]", "[[6,10],[1,5],[3,9]]"], "answer": 1, "explanation": "Sorting by start value gives [[1,5],[3,9],[6,10]] since 1 < 3 < 6." }, { "question": "With sorted intervals [[1,5],[3,9],[6,10]], we check pair (0,1): curr.start=3, prev.end=5. What should we return?", "options": ["true — no conflict found yet, keep scanning", "false — conflict detected because 3 < 5", "Skip this pair and check pair (1,2) first", "true — the intervals are sorted so they cannot overlap"], "answer": 1, "explanation": "Since curr.start (3) < prev.end (5), the intervals [1,5] and [3,9] overlap. We return false immediately — no need to check pair (1,2)." }, { "question": "What is the time complexity of the optimal Meeting Rooms solution?", "options": ["O(n)", "O(n²)", "O(n log n)", "O(log n)"], "answer": 2, "explanation": "Sorting takes O(n log n). The single scan is O(n). The total is O(n log n), dominated by sorting." }, { "question": "Why does sorting by start time allow us to only check adjacent pairs?", "options": ["It ensures all intervals are non-overlapping", "Overlapping intervals become adjacent after sorting, so a single pass suffices", "It converts the problem into a linked-list traversal", "It eliminates duplicate intervals before we scan"], "answer": 1, "explanation": "After sorting by start time, if interval A and interval B overlap (where A precedes B), they must be adjacent in the sorted array. A non-adjacent pair cannot overlap without one of the intervals in between also overlapping — which we would catch first." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Sort by start time — this collapses an O(n²) all-pairs problem into a single O(n) scan", "Only check adjacent pairs: if curr.start < prev.end, return false immediately", "Meetings sharing only an endpoint (e.g., [0,10] and [10,20]) do NOT conflict — use strict <", "Time: O(n log n) | Space: O(1) extra — no auxiliary data structures needed", "This problem is the prerequisite for Meeting Rooms II, which adds a min-heap to count concurrent meetings" ] }
\`\`\``,
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

Great work completing the Merge Intervals module. Before moving on, let's lock in the patterns you've built — these show up constantly in scheduling, calendar, and range problems at top tech companies.

\`\`\`concept
{ "title": "The Merge Intervals Pattern in One Sentence", "variant": "mental-model", "content": "Sort by start time, then greedily extend the current window whenever the next interval's start falls at or before the current end — advancing a two-pointer to intersect two sorted lists is the same idea applied across two sources." }
\`\`\`

### What You Covered This Module

\`\`\`tabs
{ "tabs": [
  { "label": "Sort First", "icon": "🔢", "content": "**Sorting by start time is always step one.** Without it, you'd have to compare every pair — O(n²) brute force. Sorting brings overlapping intervals adjacent, reducing the problem to a single linear pass.\\n\\n\`\`\`\\nTime: O(n log n) — sorting dominates\\nSpace: O(n) — merged output list\\n\`\`\`" },
  { "label": "Merging", "icon": "🔗", "content": "**Track the last merged interval.** For each new interval:\\n- If \`current.start <= last.end\` → overlap exists, extend: \`last.end = max(last.end, current.end)\`\\n- Otherwise → no overlap, push current as a new entry\\n\\nEdge case: \`[1,3]\` and \`[3,5]\` **do** overlap (shared endpoint at 3)." },
  { "label": "Intersections", "icon": "✂️", "content": "**Two-pointer across two sorted lists.** Advance the pointer whose interval ends sooner. The intersection of \`[a, b]\` and \`[c, d]\` is \`[max(a,c), min(b,d)]\` — only record it when \`max(a,c) <= min(b,d)\`." },
  { "label": "Scheduling", "icon": "📅", "content": "**Conflict detection = overlap check after sorting.** For meeting rooms, you need the *count* of simultaneous intervals — use a min-heap on end times. Pop whenever the earliest-ending meeting finishes before the next one starts." }
] }
\`\`\`

### Algorithm in Motion

Watch how the greedy merge unfolds on \`[[1,3],[2,6],[8,10],[15,18]]\`:

\`\`\`algoviz
{ "title": "Merge Intervals — Step by Step", "type": "array", "data": [[1,3],[2,6],[8,10],[15,18]], "frames": [ { "highlight": [0], "label": "Sorted. Push [1,3] as first merged interval.", "stats": { "merged": "[[1,3]]", "current": "[1,3]" } }, { "highlight": [0, 1], "label": "[2,6]: start=2 ≤ end=3 → overlap! Extend end to max(3,6)=6.", "stats": { "merged": "[[1,6]]", "current": "[2,6]" } }, { "highlight": [1, 2], "label": "[8,10]: start=8 > end=6 → no overlap. Push new interval.", "stats": { "merged": "[[1,6],[8,10]]", "current": "[8,10]" } }, { "highlight": [2, 3], "label": "[15,18]: start=15 > end=10 → no overlap. Push new interval.", "stats": { "merged": "[[1,6],[8,10],[15,18]]", "current": "[15,18]" } } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "The Boundary Edge Case", "content": "The overlap condition is \`current.start <= last.end\` (less than **or equal**). Intervals like \`[1,3]\` and \`[3,5]\` share the point 3 and should merge into \`[1,5]\`. Always clarify this with the interviewer — the problem statement may explicitly say otherwise." }
\`\`\`

### Knowledge Check

\`\`\`quiz
{ "title": "Merge Intervals — Module Quiz", "questions": [ { "question": "What is the first step in virtually every interval problem, and why?", "options": ["Merge all intervals immediately using a hash map", "Sort intervals by start time so overlapping intervals become adjacent", "Convert each interval to its midpoint for easier comparison", "Check whether any interval has length zero before processing"], "answer": 1, "explanation": "Sorting by start time is step one because it guarantees that any interval overlapping with the current one must come next in the list. Without sorting you'd need O(n²) pairwise comparisons." }, { "question": "Two intervals [a, b] and [c, d] (with a ≤ c) overlap when:", "options": ["a == c", "b < c", "b >= c", "a < d and b > c"], "answer": 2, "explanation": "Since we sort so a ≤ c, the only question is whether [a,b] reaches at least as far as c starts. If b ≥ c the intervals share at least the point c and must be merged. b < c means a true gap exists." }, { "question": "What is the time complexity of merging n intervals?", "options": ["O(n) — single linear pass", "O(n log n) — sorting step dominates", "O(n²) — every pair must be compared", "O(log n) — binary search on endpoints"], "answer": 1, "explanation": "Sorting is O(n log n). The subsequent linear scan is O(n). The overall complexity is O(n log n). This is confirmed by multiple authoritative sources including Tech Interview Handbook and GeeksforGeeks." }, { "question": "When computing the intersection of two sorted interval lists with two pointers, which pointer do you advance after each step?", "options": ["Always advance the pointer in the first list", "Always advance the pointer in the second list", "Advance whichever pointer's interval has the smaller end value", "Advance both pointers simultaneously every time"], "answer": 2, "explanation": "The interval that ends sooner cannot possibly overlap with anything later in the other list. Advancing the pointer with the smaller end value is the greedy choice that keeps both lists in sync." }, { "question": "Are back-to-back intervals [1, 3] and [3, 5] considered overlapping on LeetCode #56?", "options": ["No — they only touch at a single point and should stay separate", "Yes — they share endpoint 3 and merge into [1, 5]", "It depends on whether the intervals are open or closed", "Only if the values are integers"], "answer": 1, "explanation": "LeetCode #56 explicitly states that [1,4] and [4,5] are overlapping and should merge into [1,5]. Shared endpoints count as overlap. Always verify this assumption with your interviewer on a real problem." } ] }
\`\`\`

### Complexity at a Glance

| Operation | Time | Space | Key Insight |
|---|---|---|---|
| Merge intervals | O(n log n) | O(n) | Sort dominates |
| Interval intersection | O(m + n) | O(m + n) | Two-pointer, already sorted |
| Meeting rooms II | O(n log n) | O(n) | Min-heap on end times |
| Insert interval | O(n) | O(n) | Input already sorted |

\`\`\`collapse
{ "title": "Deep Dive: Why Greedy Works for Merging", "content": "The greedy argument is straightforward: after sorting by start time, every interval that could possibly overlap with \`current\` must appear consecutively in the list. Once you encounter an interval whose start exceeds \`current.end\`, no future interval (which starts even later) can overlap either. This local decision — merge or don't — is globally optimal, so there is no need for backtracking or dynamic programming." }
\`\`\`

### Voice Summary Prompts

<!-- voice:checkpoint_summary -->

Your coach will ask you to walk through three things aloud:

1. **The algorithm** — trace merge intervals on \`[[2,4],[1,3],[6,8],[5,7]]\` step by step, including the sort.
2. **Union vs intersection** — explain in plain English how you'd compute the union of two interval lists versus their intersection, and what changes in the code.
3. **Real-world application** — name a concrete scenario (calendar blocking, IP range filtering, genomic segment coverage, CPU burst scheduling) and describe which interval technique applies.

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Always sort by start time first — this collapses an O(n²) problem into O(n log n) with a single linear pass.", "The merge condition is current.start ≤ last.end; clarify with the interviewer whether shared endpoints count as overlap.", "Intersection of two sorted lists uses a two-pointer advance-the-smaller-end strategy — O(m + n).", "Meeting Rooms II (counting concurrent intervals) upgrades to a min-heap, but the sort-first discipline stays the same.", "Back-to-back intervals like [1,3] and [3,5] merge on LeetCode #56 — always confirm boundary semantics before coding." ] }
\`\`\`

**You've mastered one of the highest-frequency interview patterns. On to the next module.**`,
    },
  ],
};
