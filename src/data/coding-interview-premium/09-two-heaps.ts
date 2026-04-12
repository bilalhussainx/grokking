import { Module } from "../types";

export const twoHeapsModule: Module = {
  id: "two-heaps",
  title: "Two Heaps",
  description: "Master the Two Heaps pattern for median finding and sliding window problems. Learn how to use max-heap and min-heap together to efficiently track median values.",
  lessons: [
    {
      id: "two-heaps-intro",
      slug: "two-heaps-intro",
      title: "Introduction to Two Heaps",
      content: `## The Two Heaps Pattern

The **Two Heaps** pattern pairs a **max-heap** and a **min-heap** to track the median of a dynamic data stream — delivering O(log n) insertion and O(1) median lookup at any point, no matter how many numbers have been added.

\`\`\`concept
{ "title": "The Two Heaps Mental Model", "variant": "mental-model", "content": "Picture a number line split at the median. Every number to the left of the split belongs in a max-heap — so the largest left-side number sits right at the top, always visible. Every number to the right belongs in a min-heap — smallest right-side number at the top. The median is always visible at the top of one or both heaps. No sorting, no scanning — just two peeked values." }
\`\`\`

### Why Not Just Sort?

| Approach | Insert | Find Median |
|---|---|---|
| Sorted array | O(n) | O(1) |
| **Two Heaps** | **O(log n)** | **O(1)** |
| Single heap | O(log n) | O(n) |

Resorting on every insertion costs O(n) per element. A single heap lets you insert quickly but forces an O(n) scan to find the middle. Two Heaps gets you the best of both worlds.

### The Four Invariants

Every Two Heaps implementation must uphold these rules after **every** insertion or deletion:

\`\`\`steps
{ "title": "Two Heaps Invariants", "steps": [ { "title": "Max-Heap holds the smaller half", "content": "All numbers ≤ median go into the max-heap. Its root is the **largest** of the small numbers — the left boundary of the split." }, { "title": "Min-Heap holds the larger half", "content": "All numbers > median go into the min-heap. Its root is the **smallest** of the large numbers — the right boundary of the split." }, { "title": "Balance: sizes differ by at most 1", "content": "After each insertion, rebalance so \`abs(len(max_heap) - len(min_heap)) <= 1\`. If the difference hits 2, pop the root of the larger heap and push it into the smaller." }, { "title": "Ordering: max-heap top ≤ min-heap top", "content": "The largest element of the small half must never exceed the smallest element of the large half. Route every new number through the max-heap first — if it's bigger than the max-heap root, move it to the min-heap — and this ordering is automatically maintained." } ] }
\`\`\`

### Visualising an Insertion Sequence

Watch both heaps grow as we insert \`[5, 2, 8, 1, 6]\` one at a time. Notice how the rebalance step fires after insertions 2 and 4:

\`\`\`algoviz
{ "title": "Inserting [5, 2, 8, 1, 6] into Two Heaps", "type": "array", "data": [5, 2, 8, 1, 6], "frames": [ { "highlight": [0], "label": "Insert 5 → max-heap empty, push to max-heap.", "stats": { "max_heap": "[5]", "min_heap": "[]", "median": "5" } }, { "highlight": [1], "label": "Insert 2 → 2 ≤ 5, push to max-heap → sizes: max=2, min=0. Rebalance: pop 5 from max, push to min.", "stats": { "max_heap": "[2]", "min_heap": "[5]", "median": "(2+5)/2 = 3.5" } }, { "highlight": [2], "label": "Insert 8 → 8 > top(max=2), push to min-heap → sizes: max=1, min=2. Rebalance: pop 5 from min, push to max.", "stats": { "max_heap": "[5, 2]", "min_heap": "[8]", "median": "5" } }, { "highlight": [3], "label": "Insert 1 → 1 ≤ 5, push to max-heap → sizes: max=3, min=1. Rebalance: pop 5 from max, push to min.", "stats": { "max_heap": "[2, 1]", "min_heap": "[5, 8]", "median": "(2+5)/2 = 3.5" } }, { "highlight": [4], "label": "Insert 6 → 6 > top(max=2), push to min-heap → sizes: max=2, min=3. Rebalance: pop 5 from min, push to max.", "stats": { "max_heap": "[5, 2, 1]", "min_heap": "[6, 8]", "median": "5" } } ], "speed": 900 }
\`\`\`

### Python Implementation

\`\`\`playground
{ "title": "Two Heaps — Core Template", "language": "python", "code": "import heapq\\n\\nmax_heap = []  # smaller half — negate values (Python only has min-heap)\\nmin_heap = []  # larger half\\n\\ndef insert(num):\\n    if not max_heap or num <= -max_heap[0]:\\n        heapq.heappush(max_heap, -num)\\n    else:\\n        heapq.heappush(min_heap, num)\\n\\n    # Rebalance: sizes may differ by at most 1\\n    if len(max_heap) > len(min_heap) + 1:\\n        heapq.heappush(min_heap, -heapq.heappop(max_heap))\\n    elif len(min_heap) > len(max_heap):\\n        heapq.heappush(max_heap, -heapq.heappop(min_heap))\\n\\ndef find_median():\\n    if len(max_heap) == len(min_heap):\\n        return (-max_heap[0] + min_heap[0]) / 2.0\\n    return float(-max_heap[0])  # max_heap always holds the extra element\\n\\nfor n in [5, 2, 8, 1, 6]:\\n    insert(n)\\n    print('After inserting', n, '-> median =', find_median())", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Python's heapq is always a min-heap", "content": "Python's \`heapq\` only exposes a min-heap — there is no built-in max-heap. The universal workaround: **negate values before pushing**. \`heappush(max_heap, -num)\` stores the largest number as the most-negative value, so \`heappop\` returns it first. Remember to negate again on the way out: \`-heapq.heappop(max_heap)\` restores the original value. You will write this in every Two Heaps problem." }
\`\`\`

### Reading the Median

\`\`\`tabs
{ "tabs": [ { "label": "Odd count", "icon": "🔢", "content": "When the total element count is **odd**, one heap has one extra element.\\n\\nKeep the extra in the **max-heap** (the convention used in the template above).\\n\\nMedian = \`-max_heap[0]\`\\n\\n**Example:** stream \`[1, 2, 3]\`\\nmax = [2, 1], min = [3]\\nMedian = **2**" }, { "label": "Even count", "icon": "⚖️", "content": "When both heaps have the **same size**, the median is the average of the two roots:\\n\\nMedian = \`(-max_heap[0] + min_heap[0]) / 2.0\`\\n\\n**Example:** stream \`[1, 2]\`\\nmax = [1], min = [2]\\nMedian = **(1 + 2) / 2 = 1.5**\\n\\nNote the \`2.0\` divisor — integer division would silently return the wrong answer in Python 2 and some other languages." }, { "label": "Edge cases", "icon": "⚠️", "content": "**Empty stream:** guard before calling \`find_median()\`:\\n\`\`\`python\\nif not max_heap and not min_heap:\\n    return None\\n\`\`\`\\n\\n**Duplicate values:** the template handles them naturally — duplicates route to max-heap and the balance step moves extras as needed.\\n\\n**Negative numbers:** negation still works because \`-(-5) = 5\`. No special handling required." } ] }
\`\`\`

### Where This Pattern Appears

The Two Heaps pattern surfaces whenever a problem needs instant access to **the element at the split point** of a dynamic dataset. The three canonical LeetCode problems are:

- **Find Median from Data Stream** (LC #295) — the pure form of the pattern
- **Sliding Window Median** (LC #480) — extends Two Heaps with lazy deletion as the window slides
- **IPO / Maximize Capital** (LC #502) — uses one heap per constraint (min-heap for capital requirements, max-heap for profits)

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "After inserting [3, 1, 5, 2, 4] one by one, what is the final median reported by Two Heaps?", "options": ["2", "3", "2.5", "3.5"], "answer": 1, "explanation": "After all five insertions the heaps settle to max=[3,2,1] and min=[4,5]. Since max-heap has one more element, the median is -max_heap[0] = 3." }, { "question": "Why does the Python implementation store negated values in the max-heap?", "options": ["To sort values in descending order before inserting", "Because heapq only provides a min-heap — negating simulates a max-heap", "To avoid integer overflow on large inputs", "To make the balance condition simpler to write"], "answer": 1, "explanation": "Python's heapq always pops the smallest value. By storing -x, the largest original value becomes the most-negative stored value, so heappop effectively returns the maximum. Negate again on pop to recover the original number." }, { "question": "What is the time complexity of Two Heaps for N insertions followed by N median queries?", "options": ["O(n²) insert, O(1) query", "O(n log n) total insert, O(n) total query", "O(n log n) total insert, O(1) per query", "O(n) total insert, O(log n) per query"], "answer": 2, "explanation": "Each insertion does at most two heap operations (push + a possible rebalance pop/push) — each O(log n) — so N insertions cost O(n log n) in total. Each median query is a single O(1) peek at the heap roots, so N queries cost O(n) total." }, { "question": "The rebalance step moves the root of max-heap to min-heap when which condition is true?", "options": ["len(min_heap) > len(max_heap)", "len(max_heap) > len(min_heap) + 1", "len(max_heap) == len(min_heap)", "The new number is greater than the max-heap root"], "answer": 1, "explanation": "We allow max-heap to hold one extra element (for odd totals). It is only when max-heap exceeds that allowance — len(max_heap) > len(min_heap) + 1 — that we pop its root and push it into min-heap to restore balance." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Two Heaps splits the dataset at the median: max-heap for the smaller half, min-heap for the larger half.", "Insertion costs O(log n); median lookup costs O(1) — far better than resorting the full dataset.", "Two invariants must hold after every operation: (1) heap sizes differ by at most 1, (2) max-heap top ≤ min-heap top.", "In Python, simulate a max-heap by negating values before heappush and after heappop.", "Recognise this pattern when a problem asks for: median of a stream, sliding-window median, or any split-point access on a changing dataset." ] }
\`\`\``,
    },
    {
      id: "find-median-number-stream",
      slug: "find-median-number-stream",
      title: "Find Median of Number Stream",
      content: `## Find Median of Number Stream

<!-- voice:section_check concept="Two Heaps for streaming median" -->

The **running median** problem asks: after each new number arrives, what is the current median — without re-sorting the entire list?

Naïve approach: keep a sorted array, re-sort on every insert. That's O(n log n) per query. The key insight is to stay *sorted just enough* — maintain two heaps permanently holding the two halves of your sorted sequence.

\`\`\`concept
{ "title": "The Two-Halves Partition", "variant": "mental-model", "content": "Picture all numbers seen so far arranged in sorted order. Cut the line at the midpoint. The **left half** (smaller numbers) lives in a max-heap — its top is the largest of the small numbers. The **right half** (larger numbers) lives in a min-heap — its top is the smallest of the large numbers. The median always sits at this exact boundary: either the max-heap top (odd count) or the average of both tops (even count)." }
\`\`\`

### The Invariant

After every insertion, both of these must hold:

1. \`len(max_heap) - len(min_heap)\` is **0 or 1** (sizes stay balanced)
2. Every element in \`max_heap\` ≤ every element in \`min_heap\` (partition is valid)

As long as both conditions hold, reading the median costs **O(1)** — two heap peeks.

\`\`\`callout
{ "type": "info", "title": "Python's Max-Heap Trick", "content": "Python's \`heapq\` module only provides a **min-heap**. Simulate a max-heap by **negating values** on push and un-negating on pop. \`heapq.heappush(lo, -num)\` stores \`num\` so that the largest original value becomes the smallest stored value — and floats to index 0." }
\`\`\`

### Algorithm

\`\`\`steps
{ "title": "insertNum — Three Phases", "steps": [ { "title": "Route the incoming number", "content": "If \`max_heap\` is empty **or** \`num ≤ max_heap top\` → push to \`max_heap\` (it belongs in the lower half).\\n\\nOtherwise → push to \`min_heap\` (it belongs in the upper half)." }, { "title": "Rebalance if the invariant is broken", "content": "**Case A:** \`len(max_heap) > len(min_heap) + 1\` → pop the max from \`max_heap\` and push it to \`min_heap\`.\\n\\n**Case B:** \`len(min_heap) > len(max_heap)\` → pop the min from \`min_heap\` and push it to \`max_heap\`.\\n\\nAt most one transfer per insert." }, { "title": "Read the median (O(1))", "content": "**Equal sizes** → \`(max_heap_top + min_heap_top) / 2.0\`\\n\\n**max_heap one larger** → \`float(max_heap_top)\`\\n\\nNo looping, no sorting — just two index-0 reads." } ] }
\`\`\`

### Step-by-Step Trace: Inserting [3, 1, 5, 4]

\`\`\`trace
{ "title": "MedianFinder on [3, 1, 5, 4]", "language": "python", "code": "import heapq\\n\\nclass MedianFinder:\\n    def __init__(self):\\n        self.lo = []  # max-heap (negated values)\\n        self.hi = []  # min-heap\\n\\n    def insertNum(self, num):\\n        if not self.lo or num <= -self.lo[0]:\\n            heapq.heappush(self.lo, -num)\\n        else:\\n            heapq.heappush(self.hi, num)\\n        if len(self.lo) > len(self.hi) + 1:\\n            heapq.heappush(self.hi, -heapq.heappop(self.lo))\\n        elif len(self.hi) > len(self.lo):\\n            heapq.heappush(self.lo, -heapq.heappop(self.hi))\\n\\n    def findMedian(self):\\n        if len(self.lo) > len(self.hi):\\n            return float(-self.lo[0])\\n        return (-self.lo[0] + self.hi[0]) / 2.0", "frames": [ { "line": 9, "vars": { "num": 3, "lo": "[]", "hi": "[]" }, "note": "lo is empty → route 3 into lo (lower half)" }, { "line": 10, "vars": { "num": 3, "lo": "[-3]", "hi": "[]" }, "note": "Push -3. lo top = 3. Sizes: 1 vs 0 → balanced (1 ≤ 0+1).", "stdout": "findMedian → 3.0" }, { "line": 9, "vars": { "num": 1, "lo": "[-3]", "hi": "[]" }, "note": "lo top = 3 ≥ 1 → route 1 into lo" }, { "line": 10, "vars": { "num": 1, "lo": "[-3, -1]", "hi": "[]" }, "note": "lo has 2 elements, hi has 0. Sizes: 2 > 0+1 → REBALANCE!" }, { "line": 14, "vars": { "lo": "[-1]", "hi": "[3]" }, "note": "Pop max (3) from lo, push to hi. Now lo=[1], hi=[3]. Equal sizes.", "stdout": "findMedian → (1+3)/2 = 2.0" }, { "line": 9, "vars": { "num": 5, "lo": "[-1]", "hi": "[3]" }, "note": "lo top = 1 < 5 → route 5 into hi (upper half)" }, { "line": 12, "vars": { "lo": "[-1]", "hi": "[3, 5]" }, "note": "Sizes: 1 vs 2. hi > lo → REBALANCE: pop min (3) from hi, push to lo." }, { "line": 16, "vars": { "lo": "[-3, -1]", "hi": "[5]" }, "note": "lo=[3,1], hi=[5]. lo has one more → median = lo top = 3.", "stdout": "findMedian → 3.0" }, { "line": 9, "vars": { "num": 4, "lo": "[-3, -1]", "hi": "[5]" }, "note": "lo top = 3 < 4 → route 4 into hi" }, { "line": 12, "vars": { "lo": "[-3, -1]", "hi": "[4, 5]" }, "note": "Sizes: 2 vs 2 → perfectly balanced. Median = (lo_top + hi_top) / 2.", "stdout": "findMedian → (3+4)/2 = 3.5" } ], "speed": 900 }
\`\`\`

### Full Solution

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`playground
{ "title": "MedianFinder — Python (runnable)", "language": "python", "code": "import heapq\\n\\nclass MedianFinder:\\n    def __init__(self):\\n        self.lo = []  # max-heap (negate to simulate)\\n        self.hi = []  # min-heap\\n\\n    def insertNum(self, num: int) -> None:\\n        if not self.lo or num <= -self.lo[0]:\\n            heapq.heappush(self.lo, -num)\\n        else:\\n            heapq.heappush(self.hi, num)\\n\\n        if len(self.lo) > len(self.hi) + 1:\\n            heapq.heappush(self.hi, -heapq.heappop(self.lo))\\n        elif len(self.hi) > len(self.lo):\\n            heapq.heappush(self.lo, -heapq.heappop(self.hi))\\n\\n    def findMedian(self) -> float:\\n        if len(self.lo) > len(self.hi):\\n            return float(-self.lo[0])\\n        return (-self.lo[0] + self.hi[0]) / 2.0\\n\\n\\n# Verify against the problem examples\\nmf = MedianFinder()\\ncases = [(3, 3.0), (1, 2.0), (5, 3.0), (4, 3.5)]\\nfor num, expected in cases:\\n    mf.insertNum(num)\\n    result = mf.findMedian()\\n    ok = 'PASS' if result == expected else 'FAIL'\\n    print(f'insert({num}) -> median={result}  expected={expected}  [{ok}]')", "runnable": true }
\`\`\`

### Complexity

| Operation | Time | Space |
|-----------|------|-------|
| \`insertNum\` | O(log n) | — |
| \`findMedian\` | O(1) | — |
| Total space | — | O(n) |

The log n bound comes from at most two heap push/pop operations per insert. The O(1) median is why this pattern beats naïve sorting by orders of magnitude on large streams.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Naive: re-sort on every call — O(n log n)", "code": "def findMedian(self):\\n    s = sorted(self.nums)   # re-sort entire list\\n    n = len(s)\\n    if n % 2 == 1:\\n        return float(s[n // 2])\\n    return (s[n // 2 - 1] + s[n // 2]) / 2.0" }, "after": { "label": "Two Heaps: O(1) peek, O(log n) insert", "code": "def findMedian(self) -> float:\\n    if len(self.lo) > len(self.hi):\\n        return float(-self.lo[0])          # O(1)\\n    return (-self.lo[0] + self.hi[0]) / 2.0  # O(1)" } }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Why the Rebalancing Logic Is Correct", "content": "**Why at most one transfer per insert?**\\n\\nEach \`insertNum\` adds exactly one element to one heap. That can change the size difference by at most 1. Before the insert, the invariant held (\`|lo| - |hi| ≤ 1\`). So after the insert, the difference can be at most 2 — corrected by moving exactly one element.\\n\\n**Why move from lo → hi when \`len(lo) > len(hi) + 1\`?**\\n\\nIf lo grows too large, the median boundary has shifted left. Pushing lo's maximum into hi restores both the size balance *and* the partition validity: the moved element was the largest of the lower half, making it the smallest of the upper half.\\n\\n**Why move from hi → lo when \`len(hi) > len(lo)\`?**\\n\\nWe allow lo to have at most one extra element (for odd-count medians). If hi ever equals or exceeds lo, the median boundary shifts right. Pulling hi's minimum back into lo restores the invariant.\\n\\n**The two conditions are mutually exclusive** — a single insert can only break one side of the balance, so only one \`if\`/\`elif\` branch fires per call." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "After inserting [2, 8, 4, 6] in order, what values does the max-heap (lower half) hold?", "options": ["[8, 6]", "[2, 4]", "[4, 2]", "[6, 4]"], "answer": 2, "explanation": "Tracing the insertions: after all four numbers, lo holds {4, 2} with 4 at the top. Internally stored as [-4, -2]. Option '[4, 2]' lists the real values in max-heap order (largest at front)." }, { "question": "Why do we negate values when pushing to the max-heap in Python?", "options": [ "heapq is a max-heap by default and negation converts it to min-heap", "heapq is a min-heap only; negating makes the largest original value the smallest stored value, so it surfaces at index 0", "Negation is only needed when all values are positive integers", "It prevents integer overflow during heap comparisons" ], "answer": 1, "explanation": "Python's heapq always maintains a min-heap: the smallest element sits at index 0. By pushing -num, the most negative stored value corresponds to the largest original value — so the largest correctly floats to the top." }, { "question": "When should you rebalance by moving an element from min_heap into max_heap?", "options": [ "When len(max_heap) > len(min_heap) + 1", "When len(min_heap) > len(max_heap)", "After every insertion, unconditionally", "Only when findMedian() is about to be called" ], "answer": 1, "explanation": "We allow max_heap to have at most one extra element (to hold the median for odd counts). If min_heap ever exceeds max_heap in size, the median boundary has drifted right — move min_heap's minimum back into max_heap to restore the invariant." }, { "question": "What is the time complexity of findMedian() with this approach, and why?", "options": [ "O(n log n) — must sort the combined elements", "O(n) — must scan both heaps", "O(log n) — one heap traversal", "O(1) — reads only the top elements of both heaps" ], "answer": 3, "explanation": "findMedian() accesses only heap[0] of each heap — a constant-time peek. No traversal or sorting occurs. This O(1) read is the entire point of maintaining the two-heap structure." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Partition numbers into two halves: a max-heap (lower half) and a min-heap (upper half). The median always sits at their boundary.", "Invariant after every insert: sizes differ by at most 1, and every lo element ≤ every hi element. At most one heap-to-heap transfer restores this.", "insertNum runs in O(log n); findMedian runs in O(1) — far better than O(n log n) naive re-sort per query.", "In Python, simulate a max-heap with heapq by negating values on push and un-negating on pop.", "This same two-heap structure extends to the sliding-window median problem, where elements are also removed — handled via lazy deletion." ] }
\`\`\``,
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

The **Find Median from Data Stream** problem assumed elements only ever arrive — they never leave. Sliding windows break that assumption. As the window moves right, one element leaves and one enters. This single change transforms a solved problem into a significantly harder one.

\`\`\`concept
{ "title": "The Core Tension", "variant": "insight", "content": "Heaps give O(log k) insertion and O(1) median access — but they don't support O(log k) removal of an arbitrary element. You'd have to find it first, which is O(k). For n up to 10^5 and k windows, that's O(nk) — too slow. The solution: pretend to delete, and clean up lazily." }
\`\`\`

### Problem Statement

Given an array of numbers and a window size \`k\`, find the median of every contiguous subarray of size \`k\`.

\`\`\`tabs
{ "tabs": [
  { "label": "Example 1 (k=2)", "icon": "🔢", "content": "**Input:** \`nums = [1, 2, -1, 3, 5]\`, \`k = 2\`\\n\\n| Window | Sorted | Median |\\n|--------|--------|--------|\\n| [1, 2] | [1, 2] | (1+2)/2 = **1.5** |\\n| [2, -1] | [-1, 2] | (-1+2)/2 = **0.5** |\\n| [-1, 3] | [-1, 3] | (-1+3)/2 = **1.0** |\\n| [3, 5] | [3, 5] | (3+5)/2 = **4.0** |\\n\\n**Output:** \`[1.5, 0.5, 1.0, 4.0]\`" },
  { "label": "Example 2 (k=3)", "icon": "🔢", "content": "**Input:** \`nums = [1, 2, -1, 3, 5]\`, \`k = 3\`\\n\\n| Window | Sorted | Median |\\n|--------|--------|--------|\\n| [1, 2, -1] | [-1, 1, 2] | **1.0** |\\n| [2, -1, 3] | [-1, 2, 3] | **2.0** |\\n| [-1, 3, 5] | [-1, 3, 5] | **3.0** |\\n\\n**Output:** \`[1.0, 2.0, 3.0]\`" },
  { "label": "Classic Example", "icon": "📋", "content": "**Input:** \`nums = [1, 3, -1, -3, 5, 3, 6, 7]\`, \`k = 3\`\\n\\n**Output:** \`[1.0, -1.0, -1.0, 3.0, 5.0, 6.0]\`\\n\\nWindow \`[1,3,-1]\` sorted is \`[-1,1,3]\` → median = **1.0**\\n\\nWindow \`[3,-1,-3]\` sorted is \`[-3,-1,3]\` → median = **-1.0**\\n\\nAnd so on as the window slides right by one each time." }
] }
\`\`\`

### Why Plain Two-Heaps Breaks Down

The median-from-stream solution uses a **max-heap** (lower half) + **min-heap** (upper half), kept balanced so the median lives at the heap tops. Adding an element costs O(log k). That's fine.

The problem: **removing an outgoing element**. Python's \`heapq\` (and most heap libraries) don't offer arbitrary removal. Finding an element buried at index \`i\` in a heap costs O(k), and \`heapify\` after removal costs O(k) too. Over \`n\` windows, that's **O(nk)** — for \`n = 10^5\`, \`k = 10^4\`, that's 10^9 operations.

\`\`\`concept
{ "title": "Lazy Deletion — The Key Insight", "variant": "mental-model", "content": "Instead of physically removing the outgoing element, record it in a hash map of 'pending deletions.' The element stays in the heap as a ghost. When a ghost eventually rises to the top of its heap, pop and discard it before reading the median. Ghost elements buried deep in the heap never affect the result because we only read the tops." }
\`\`\`

### The Full Algorithm

\`\`\`steps
{ "title": "Two Heaps with Lazy Deletion", "steps": [
  { "title": "Initialize two heaps + delayed map", "content": "\`small\` = max-heap (lower half, negated in Python)\\n\`large\` = min-heap (upper half)\\n\`delayed\` = hash map of \`{value: count}\` for pending deletions\\n\`small_size\`, \`large_size\` = effective counts (excluding ghosts)" },
  { "title": "Build the first window (first k elements)", "content": "For each of the first \`k\` elements:\\n- If \`num ≤ top of small\` (or small is empty) → push to \`small\`, increment \`small_size\`\\n- Else → push to \`large\`, increment \`large_size\`\\n- Rebalance: if \`small_size > large_size + 1\`, move top of \`small\` → \`large\`; if \`large_size > small_size\`, move top of \`large\` → \`small\`" },
  { "title": "Record first median", "content": "If \`small_size == large_size\`: median = \`(-small[0] + large[0]) / 2.0\`\\nElse (small has one more): median = \`-small[0]\`\\nAppend to result." },
  { "title": "Slide the window (i from k to n-1)", "content": "**Incoming element** \`nums[i]\`: add normally (same logic as step 2), rebalance.\\n\\n**Outgoing element** \`nums[i - k]\`: mark it in \`delayed[nums[i-k]] += 1\`. Decrement \`small_size\` or \`large_size\` based on which heap it belongs to. Rebalance." },
  { "title": "Prune ghosts before reading", "content": "Before reading heap tops (in \`find_median\` or after rebalance), pop any ghost at the top of either heap:\\n\`\`\`python\\nwhile small and delayed[-small[0]]:\\n    delayed[-small[0]] -= 1\\n    heappop(small)\\n\\nwhile large and delayed[large[0]]:\\n    delayed[large[0]] -= 1\\n    heappop(large)\\n\`\`\`" },
  { "title": "Append median for each new window", "content": "After sliding, compute and append median using cleaned heap tops. Repeat until window reaches end of array. Return result list." }
] }
\`\`\`

### Tracing the Algorithm

Let's trace \`nums = [1, 2, -1, 3, 5]\`, \`k = 2\` step by step.

\`\`\`trace
{ "title": "Sliding Window Median — Lazy Deletion Trace", "language": "python", "code": "# nums = [1, 2, -1, 3, 5], k = 2\\nsmall = []   # max-heap (lower half, negated)\\nlarge = []   # min-heap (upper half)\\ndelayed = {} # ghost deletions\\nresult = []\\n\\n# Build first window: nums[0]=1, nums[1]=2\\nheappush(small, -1); small_size=1  # 1 -> small\\nrebalance()  # balanced: small=[1], large=[]\\n\\nheappush(large, 2); large_size=1   # 2 > top(small)=1 -> large\\nrebalance()  # small_size==large_size, ok\\n\\n# First median: even window -> avg of tops\\nresult.append((-small[0] + large[0]) / 2.0)  # (1+2)/2 = 1.5\\n\\n# Slide: incoming=nums[2]=-1, outgoing=nums[0]=1\\ndelayed[1] = 1; small_size -= 1  # mark 1 as ghost in small\\nheappush(small, 1)  # -1 <= top(small)=1 -> small (negate: push 1)\\nsmall_size += 1\\nrebalance()  # prune ghost '1' from small top -> median from [-1] and [2]\\n\\nresult.append((-small[0] + large[0]) / 2.0)  # (-1+2)/2 = 0.5", "frames": [
  { "line": 5, "vars": { "small": "[]", "large": "[]", "delayed": "{}", "result": "[]" }, "note": "Initial state — both heaps empty" },
  { "line": 8, "vars": { "small": "[-1]", "large": "[]", "small_size": 1, "large_size": 0 }, "note": "Push 1 to small (heap stores -1 for max-heap)" },
  { "line": 11, "vars": { "small": "[-1]", "large": "[2]", "small_size": 1, "large_size": 1 }, "note": "2 > top(small)=1, push to large; heaps balanced" },
  { "line": 14, "vars": { "result": "[1.5]" }, "note": "Even window: median = (1 + 2) / 2 = 1.5" },
  { "line": 17, "vars": { "delayed": "{1: 1}", "small_size": 0 }, "note": "Outgoing element 1: mark ghost in delayed, decrement small_size" },
  { "line": 18, "vars": { "small": "[-1, 1]", "small_size": 1 }, "note": "Incoming -1 ≤ current top, goes to small (now has ghost '1' too)" },
  { "line": 20, "vars": { "small": "[1]", "delayed": "{}" }, "note": "Pruning: ghost '1' surfaces to top of small, popped and discarded" },
  { "line": 22, "vars": { "result": "[1.5, 0.5]" }, "note": "Even window: median = (-1 + 2) / 2 = 0.5" }
], "speed": 900 }
\`\`\`

### Implementation

\`\`\`playground
{ "title": "Sliding Window Median — Python", "language": "python", "runnable": true, "code": "from collections import defaultdict\\nfrom heapq import heappush, heappop\\nfrom typing import List\\n\\ndef median_sliding_window(nums: List[int], k: int) -> List[float]:\\n    small = []       # max-heap for lower half (values negated)\\n    large = []       # min-heap for upper half\\n    delayed = defaultdict(int)  # ghost deletion map\\n    small_size = large_size = 0\\n\\n    def add_num(num):\\n        nonlocal small_size, large_size\\n        if not small or num <= -small[0]:\\n            heappush(small, -num)\\n            small_size += 1\\n        else:\\n            heappush(large, num)\\n            large_size += 1\\n        rebalance()\\n\\n    def prune(heap, top_fn):\\n        \\"\\"\\"Pop ghost elements from heap top.\\"\\"\\"\\n        while heap and delayed[top_fn(heap)] > 0:\\n            val = top_fn(heap)\\n            delayed[val] -= 1\\n            heappop(heap)\\n\\n    def rebalance():\\n        nonlocal small_size, large_size\\n        if small_size > large_size + 1:\\n            prune(small, lambda h: -h[0])\\n            if small_size > large_size + 1:\\n                heappush(large, -heappop(small))\\n                small_size -= 1\\n                large_size += 1\\n        elif large_size > small_size:\\n            prune(large, lambda h: h[0])\\n            if large_size > small_size:\\n                heappush(small, -heappop(large))\\n                large_size -= 1\\n                small_size += 1\\n\\n    def find_median():\\n        prune(small, lambda h: -h[0])\\n        prune(large, lambda h: h[0])\\n        if small_size == large_size:\\n            return (-small[0] + large[0]) / 2.0\\n        return float(-small[0])\\n\\n    # Build first window\\n    for i in range(k):\\n        add_num(nums[i])\\n\\n    result = [find_median()]\\n\\n    # Slide the window\\n    for i in range(k, len(nums)):\\n        # Add incoming element\\n        add_num(nums[i])\\n        # Remove outgoing element (lazy)\\n        outgoing = nums[i - k]\\n        delayed[outgoing] += 1\\n        if outgoing <= -small[0]:\\n            small_size -= 1\\n        else:\\n            large_size -= 1\\n        rebalance()\\n        result.append(find_median())\\n\\n    return result\\n\\n# Test\\nprint(median_sliding_window([1, 2, -1, 3, 5], 2))  # [1.5, 0.5, 1.0, 4.0]\\nprint(median_sliding_window([1, 2, -1, 3, 5], 3))  # [1.0, 2.0, 3.0]\\nprint(median_sliding_window([1,3,-1,-3,5,3,6,7], 3))  # [1.0,-1.0,-1.0,3.0,5.0,6.0]\\n" }
\`\`\`

### Common Pitfalls

\`\`\`tabs
{ "tabs": [
  { "label": "Even vs Odd k", "icon": "⚠️", "content": "**Even \`k\`:** median = average of two middle values → \`(-small[0] + large[0]) / 2.0\`\\n\\n**Odd \`k\`:** median = single middle value → \`-small[0]\` (small always has one more)\\n\\nForgetting this distinction produces wrong output for even-sized windows." },
  { "label": "Overflow on Average", "icon": "🔢", "content": "**Danger:** \`(a + b) / 2\` can overflow for large integers.\\n\\n**Safe:** \`a / 2.0 + b / 2.0\`\\n\\nIn Python integers don't overflow, but in Java/C++ this is a real bug:\\n\`\`\`java\\n// WRONG — may overflow\\nreturn (maxHeap.peek() + minHeap.peek()) / 2.0;\\n\\n// SAFE\\nreturn maxHeap.peek() / 2.0 + minHeap.peek() / 2.0;\\n\`\`\`" },
  { "label": "Ghost Pruning Timing", "icon": "👻", "content": "Prune ghost tops **before** reading medians and **before** rebalancing.\\n\\nIf you read \`small[0]\` without pruning, you may get a ghost value that should have been deleted — producing an incorrect median.\\n\\nThe fix: always call \`prune()\` at the start of \`find_median()\`." },
  { "label": "Which Heap Owns the Outgoing?", "icon": "🏠", "content": "When marking an outgoing element as a ghost, you must correctly decide which heap's effective size to decrement:\\n\\n\`\`\`python\\nif outgoing <= -small[0]:  # belongs to lower half\\n    small_size -= 1\\nelse:                       # belongs to upper half\\n    large_size -= 1\\n\`\`\`\\n\\nUsing the wrong heap for the size adjustment breaks the balance invariant and leads to incorrect medians." }
] }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why Ghosts Don't Corrupt the Median", "content": "The two-heap median trick works because only the **tops** of the heaps matter — the median lives at the boundary between lower and upper halves. Ghosts buried deep in the heap never surface to influence the tops until they float up naturally. And when they do, we discard them before reading. The balance invariant (|small_size - large_size| ≤ 1) is maintained on effective sizes, not physical heap sizes, so correctness is preserved." }
\`\`\`

### Visualizing the Heap State

\`\`\`algoviz
{ "title": "Sliding Window Heaps — nums=[1,2,-1,3,5], k=2", "type": "array", "data": [1, 2, -1, 3, 5], "frames": [
  { "highlight": [0, 1], "label": "Window [1,2]: small={1}, large={2} → median=1.5", "stats": { "small_top": 1, "large_top": 2, "median": 1.5 } },
  { "highlight": [1, 2], "label": "Slide: outgoing=1 (ghost), incoming=-1 → small={-1}, large={2} → median=0.5", "stats": { "small_top": -1, "large_top": 2, "median": 0.5 } },
  { "highlight": [2, 3], "label": "Slide: outgoing=2 (ghost), incoming=3 → small={-1}, large={3} → median=1.0", "stats": { "small_top": -1, "large_top": 3, "median": 1.0 } },
  { "highlight": [3, 4], "label": "Slide: outgoing=-1 (ghost), incoming=5 → small={3}, large={5} → median=4.0", "stats": { "small_top": 3, "large_top": 5, "median": 4.0 } }
], "speed": 1000 }
\`\`\`

### Complexity Analysis

| | Complexity | Explanation |
|---|---|---|
| **Time** | O(n log k) | Each element is pushed once and popped at most once; each heap operation is O(log k) |
| **Space** | O(k) | Heaps hold at most k effective elements; \`delayed\` map holds at most k ghosts |

\`\`\`collapse
{ "title": "Deep Dive: Why Not a Sorted List or BST?", "content": "**Sorted list (brute force):** O(k) insertion (shifting), O(1) median. For n windows → O(nk) total. Fails at n=10^5, k=10^4.\\n\\n**\`SortedList\` (Python \`sortedcontainers\`):** O(log k) insertion, O(log k) deletion, O(1) median by index. Valid O(n log k) solution — simpler code but a non-standard library.\\n\\n**Two heaps + lazy deletion:** O(log k) per operation, O(k) space. Pure stdlib. The standard interview answer.\\n\\n**Why not a balanced BST?** A self-balancing BST (like C++ \`multiset\`) gives O(log k) for all operations and supports arbitrary deletion cleanly. In Python there's no stdlib BST, but in C++ \`multiset\` is a clean alternative to lazy deletion." }
\`\`\`

### Knowledge Check

\`\`\`quiz
{ "title": "Sliding Window Median", "questions": [
  {
    "question": "Why can't we simply call heap.remove(outgoing) when sliding the window?",
    "options": [
      "Heaps don't store the outgoing element after it was inserted",
      "Finding and removing an arbitrary element from a heap costs O(k), making the overall algorithm O(nk)",
      "The outgoing element has already been popped by heap rebalancing",
      "Python's heapq module doesn't support remove() at all"
    ],
    "answer": 1,
    "explanation": "Heaps are only efficient for accessing the min/max at the top. Finding an arbitrary element buried in the heap requires a linear scan (O(k)), and re-heapifying after removal is also O(k). Over n windows this gives O(nk) total — too slow for large inputs."
  },
  {
    "question": "With k=4 (even), the effective sizes are small_size=2 and large_size=2. What is the median?",
    "options": [
      "-small[0]  (top of the max-heap)",
      "large[0]  (top of the min-heap)",
      "(-small[0] + large[0]) / 2.0",
      "(-small[0] + large[0]) / 2"
    ],
    "answer": 2,
    "explanation": "For even k, the two middle elements of the sorted window live at the tops of the two heaps. The median is their average. Use floating-point division (/ 2.0) to avoid integer truncation, and prefer a/2.0 + b/2.0 in languages prone to overflow."
  },
  {
    "question": "A ghost element for value 5 is in the \`delayed\` map. It is currently deep inside the max-heap (small). When does it actually get removed?",
    "options": [
      "Immediately when delayed[5] is incremented",
      "After the next rebalance() call",
      "Only when it rises to the top of the heap and prune() is called",
      "After find_median() returns a result"
    ],
    "answer": 2,
    "explanation": "Lazy deletion means the element physically stays in the heap until it surfaces to the top. When prune() runs before a balance or median read, it checks the top element — if it's in delayed with count > 0, it pops and decrements. Elements buried deep are never directly removed; they're evicted passively."
  },
  {
    "question": "After sliding the window, small_size=1 and large_size=2. What must happen?",
    "options": [
      "Nothing — the heaps are allowed to differ by 1",
      "Move top of small to large to equalize",
      "Move top of large to small to restore the invariant (small ≥ large in size)",
      "Rebuild both heaps from scratch"
    ],
    "answer": 2,
    "explanation": "The invariant requires small_size == large_size (even k) or small_size == large_size + 1 (odd k). Here large_size > small_size, which is never valid. We move the top of large to small: large_size becomes 1, small_size becomes 2, restoring the odd-k invariant."
  }
] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Sliding window median extends two-heap median-finding with lazy (delayed) deletion to avoid O(k) arbitrary-removal costs",
  "Track outgoing elements in a hash map; only physically remove them when they surface to the top of a heap",
  "Maintain effective size counters (excluding ghosts) separate from physical heap size to enforce the balance invariant",
  "Always prune ghost tops before reading the median — ghosts at the top produce incorrect results",
  "For even k, median = average of both heap tops; for odd k, median = top of the larger heap (small). Use floating-point division to avoid overflow"
] }
\`\`\``,
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

The IPO problem is a classic application of the Two Heaps pattern — not for finding a median, but for making **greedy, capital-constrained investment decisions**. You have a budget that grows each round; you need to always pick the most profitable project you can currently afford.

\`\`\`concept
{ "title": "Two Heaps as a Greedy Filter", "variant": "mental-model", "content": "Think of the two heaps as a two-stage funnel.\\n\\n**Stage 1 — Eligibility gate (min-heap by capital):** holds all unstarted projects sorted by capital requirement. Each round, drain every project you can currently afford into Stage 2.\\n\\n**Stage 2 — Selection oracle (max-heap by profit):** holds every project you *can* start right now. Always pop the top — the highest-profit option.\\n\\nThis greedy choice is locally and globally optimal: picking the most profitable affordable project maximizes the capital you bring into the next round." }
\`\`\`

### Problem Statement

Given initial capital **w**, select at most **k** distinct projects from a list of *n* projects (each with a \`capital[i]\` requirement and \`profits[i]\` reward) to maximize your final capital.

\`\`\`callout
{ "type": "info", "title": "LeetCode 502 — IPO", "content": "Constraints: 0 ≤ k ≤ 10^5, 0 ≤ w ≤ 10^9, 1 ≤ n ≤ 10^5. Each project can be selected at most once." }
\`\`\`

### Worked Example

\`\`\`
Input:  k=2, w=0, profits=[1, 2, 3], capital=[0, 1, 1]
Output: 4
\`\`\`

**Round 1** (current capital = 0):
- Affordable: only project 0 (cap=0 ≤ 0). Projects 1 and 2 (cap=1) locked.
- Pick best profit = 1. Capital → 0 + 1 = **1**

**Round 2** (current capital = 1):
- Affordable: project 1 (cap=1, profit=2) **and** project 2 (cap=1, profit=3) both unlock.
- Pick best profit = 3. Capital → 1 + 3 = **4**

The min-heap revealed newly affordable projects as w grew; the max-heap ensured we always picked the best among them.

### Algorithm

\`\`\`steps
{ "title": "Two Heaps Algorithm for IPO", "steps": [ { "title": "Build the capital min-heap", "content": "Pair every project as \`(capital[i], profits[i])\` and call \`heapify\`. This gives O(n) construction — cheaper than inserting one by one — with the smallest capital requirement always at the root." }, { "title": "Repeat for each of k rounds", "content": "**Drain affordable projects:** while \`cap_heap\` is non-empty and \`cap_heap[0][0] ≤ w\`, pop the root and push its profit (negated) onto \`profit_heap\`.\\n\\n**Select the best:** pop the top of \`profit_heap\` (highest profit). Add that profit to \`w\`.\\n\\n**Early exit:** if \`profit_heap\` is empty after draining, no affordable project exists — break." }, { "title": "Return w", "content": "After k rounds (or early termination), \`w\` holds the maximum achievable capital. Every project passed through the pipeline at most once." } ] }
\`\`\`

### Step-by-Step Code Trace

\`\`\`trace
{ "title": "IPO trace — k=2, w=0, profits=[1,2,3], capital=[0,1,1]", "language": "python", "code": "import heapq\\n\\ndef find_maximized_capital(k, w, profits, capital):\\n    cap_heap = [(c, p) for c, p in zip(capital, profits)]\\n    heapq.heapify(cap_heap)\\n    profit_heap = []\\n    for _ in range(k):\\n        while cap_heap and cap_heap[0][0] <= w:\\n            c, p = heapq.heappop(cap_heap)\\n            heapq.heappush(profit_heap, -p)\\n        if profit_heap:\\n            w += -heapq.heappop(profit_heap)\\n    return w", "frames": [ { "line": 4, "vars": {"cap_heap": "[(0,1),(1,2),(1,3)]", "w": 0, "k": 2}, "note": "Pair each capital with its profit" }, { "line": 5, "vars": {"cap_heap": "[(0,1),(1,2),(1,3)]"}, "note": "heapify in O(n): smallest capital (0,1) rises to root" }, { "line": 6, "vars": {"profit_heap": "[]"}, "note": "Max-heap starts empty (will store negated profits)" }, { "line": 7, "vars": {"_": 0}, "note": "Round 1 of k=2" }, { "line": 8, "vars": {}, "note": "cap_heap root: cap=0 ≤ w=0 → enter while loop" }, { "line": 9, "vars": {"c": 0, "p": 1, "cap_heap": "[(1,2),(1,3)]"}, "note": "Pop (0,1) from cap_heap" }, { "line": 10, "vars": {"profit_heap": "[-1]"}, "note": "Push -1 (negate profit=1) onto profit_heap" }, { "line": 8, "vars": {}, "note": "cap_heap root: cap=1 > w=0 → exit while loop" }, { "line": 12, "vars": {"w": 1, "profit_heap": "[]"}, "note": "Pop max: -(-1) = 1. w = 0 + 1 = 1" }, { "line": 7, "vars": {"_": 1}, "note": "Round 2 of k=2" }, { "line": 10, "vars": {"cap_heap": "[]", "profit_heap": "[-3, -2]"}, "note": "Both (1,2) and (1,3) have cap=1 ≤ w=1 — push -2 and -3. cap_heap now empty" }, { "line": 12, "vars": {"w": 4, "profit_heap": "[-2]"}, "note": "Pop max: -(-3) = 3. w = 1 + 3 = 4" }, { "line": 13, "vars": {"return": 4}, "note": "All k rounds done. Maximum capital = 4 ✓" } ], "speed": 900 }
\`\`\`

### Brute Force vs. Two Heaps

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Brute Force — O(k · n)", "code": "def find_maximized_capital(k, w, profits, capital):\\n    used = [False] * len(profits)\\n    for _ in range(k):\\n        best, best_p = -1, -1\\n        for i in range(len(profits)):  # scan ALL projects\\n            if not used[i] and capital[i] <= w:\\n                if profits[i] > best_p:\\n                    best_p = profits[i]\\n                    best = i\\n        if best == -1:\\n            break\\n        used[best] = True\\n        w += profits[best]\\n    return w" }, "after": { "label": "Two Heaps — O(n log n + k log n)", "code": "import heapq\\n\\ndef find_maximized_capital(k, w, profits, capital):\\n    cap_heap = [(c, p) for c, p in zip(capital, profits)]\\n    heapq.heapify(cap_heap)   # O(n) — one-time cost\\n    profit_heap = []\\n    for _ in range(k):\\n        while cap_heap and cap_heap[0][0] <= w:\\n            c, p = heapq.heappop(cap_heap)\\n            heapq.heappush(profit_heap, -p)\\n        if profit_heap:\\n            w += -heapq.heappop(profit_heap)\\n    return w" } }
\`\`\`

### Complexity

| Operation | Time | Notes |
|---|---|---|
| \`heapify(cap_heap)\` | O(n) | One-time setup |
| n pushes to \`profit_heap\` | O(n log n) | Each project enters at most once |
| k pops from \`profit_heap\` | O(k log n) | One pop per round |
| **Total** | **O(n log n + k log n)** | **O(n) space** |

\`\`\`callout
{ "type": "tip", "title": "Why not just sort by capital?", "content": "Sorting capitals upfront costs O(n log n) — identical to heapify. But as w grows each round, newly affordable projects appear dynamically. A sorted array requires a binary search re-scan each round; the min-heap naturally presents the next cheapest project at its root, giving O(log n) incremental access with zero re-sorting." }
\`\`\`

### Check Your Understanding

\`\`\`quiz
{ "title": "Two Heaps: IPO", "questions": [ { "question": "After Round 1 with w=0, capitals=[0,1,1], profits=[1,2,3], what is in the profit max-heap before the pop?", "options": ["[-1] — only project 0 was affordable", "[-3,-2] — all three projects entered", "[-2,-1] — projects 1 and 2 qualified", "[] — the heap stays empty until round 2"], "answer": 0, "explanation": "Only project 0 has capital=0 ≤ w=0. Projects 1 and 2 have capital=1 which exceeds the current w=0, so they are not yet drained into the profit heap. Profit=1 is stored as -1 to simulate a max-heap." }, { "question": "Why does the Python solution push -profit instead of profit onto the profit heap?", "options": ["To avoid collisions with capital values in the same heap", "Python's heapq is a min-heap; negating transforms it into an effective max-heap", "Negative values are required by the heapq API", "To handle integer overflow in large inputs"], "answer": 1, "explanation": "Python's heapq module provides only a min-heap. By pushing -profit, the smallest value (most negative) corresponds to the largest profit. Popping and negating the result gives the maximum profit — effectively simulating a max-heap without any additional data structure." }, { "question": "What is the correct action if profit_heap is empty when we try to select a project in a round?", "options": ["Raise an exception — the input is invalid", "Pick the project with the minimum capital requirement anyway", "Skip the round; the algorithm may still proceed or terminate early", "Reset w to 0 and restart"], "answer": 2, "explanation": "An empty profit_heap means no project is currently affordable. The \`if profit_heap:\` guard prevents an invalid pop. The outer for loop continues (consuming one of k rounds doing nothing). In practice, once no project can be afforded, future rounds will also be empty, so a break is the correct optimization." }, { "question": "Given n=10^5 projects and k=10^5 selections, approximately how many heap operations does the Two Heaps solution perform in the worst case?", "options": ["10^5 (one per round)", "2 × 10^5 (one push + one pop per project)", "About 3 × 10^5 × log(10^5) ≈ 5 × 10^6", "n × k = 10^10 (same as brute force)"], "answer": 2, "explanation": "Each of the n=10^5 projects is pushed to cap_heap (O(log n)) and potentially pushed/popped from profit_heap (O(log n)). Plus k=10^5 pops from profit_heap. That's roughly (2n + k) × log n ≈ 3×10^5 × 17 ≈ 5×10^6 operations — vs. the brute-force k×n = 10^10. A factor of ~2000× improvement." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Use a **capital min-heap** as an eligibility gate — drain all newly affordable projects into the profit max-heap each round before selecting.", "Use a **profit max-heap** as a selection oracle — always pick the highest-profit affordable project (the greedy choice is optimal).", "Each project moves through the pipeline at most once: one pop from cap_heap + one push/pop from profit_heap → O(n log n + k log n) total.", "Python's heapq is min-heap only — negate profits before pushing and negate again after popping to simulate max-heap behaviour.", "Break early if the profit heap is empty mid-loop: no further gains are achievable when no project is affordable." ] }
\`\`\``,
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

You've completed the Two Heaps module — one of the most elegant partitioning techniques in the coding interview toolkit. This checkpoint verifies your grasp of four core ideas: the **balancing invariant**, **O(1) median access**, **lazy deletion**, and the **IPO greedy strategy**.

\`\`\`concept
{ "title": "The Balancing Invariant", "variant": "rule", "content": "Always maintain: max-heap holds the **lower half**, min-heap holds the **upper half**. Size rule: |max| == |min| (even count) or |max| == |min| + 1 (odd count). This guarantees the median lives at the heap tops — readable in O(1) after every O(log n) insert." }
\`\`\`

### Three Problems, One Pattern

\`\`\`tabs
{ "tabs": [ { "label": "Median Finder", "icon": "📊", "content": "**LC 295 — Find Median from Data Stream**\\n\\nFor each \`addNum(num)\`:\\n1. If \`num <= max_heap.top\`, push to max-heap (lower half); otherwise push to min-heap\\n2. Rebalance if sizes diverge by more than 1\\n\\n**Reading the median:**\\n- Equal sizes → \`(max.top + min.top) / 2.0\`\\n- max-heap larger → \`max.top\`\\n\\n**Complexity:** O(log n) insert · O(1) query · O(n) space" }, { "label": "Sliding Window Median", "icon": "🪟", "content": "**LC 480 — Sliding Window Median**\\n\\nExtend Median Finder with a \`delayed\` hash map for **lazy deletion**:\\n\\n1. Add the incoming element (standard insert + rebalance)\\n2. Mark the outgoing element in \`delayed\` — don't touch the heap yet\\n3. Before reading any heap top, prune ghost elements that have floated there\\n\\n**Why not remove directly?** Finding an arbitrary element in a heap costs O(k). Lazy deletion defers removal until the ghost rises to the root naturally — amortized O(log k).\\n\\n**Complexity:** O(n log k) time · O(k) space" }, { "label": "IPO", "icon": "💼", "content": "**LC 502 — IPO (Maximize Capital)**\\n\\nPick at most k projects to maximize capital:\\n\\n1. Push all projects into a **min-heap keyed on capital** (cheapest to unlock first)\\n2. Each round: drain all affordable projects → push their profits to a **max-heap**\\n3. Pop the max-heap top (best available profit)\\n4. Repeat k times\\n\\n**Key insight:** one heap handles *affordability*, the other handles *optimality* — clean two-heap decomposition.\\n\\n**Complexity:** O(n log n + k log n)" } ] }
\`\`\`

### Algorithm Trace: \`addNum(3) → addNum(1) → addNum(2) → findMedian()\`

\`\`\`trace
{ "title": "MedianFinder on [3, 1, 2]", "language": "python", "code": "import heapq\\n\\nmax_heap, min_heap = [], []\\n\\n# addNum(3)\\nheapq.heappush(max_heap, -3)\\n# sizes: max=1, min=0 -- balanced\\n# addNum(1)\\nheapq.heappush(max_heap, -1)\\nif len(max_heap) > len(min_heap) + 1:  # 2 > 1: True\\n    heapq.heappush(min_heap, -heapq.heappop(max_heap))\\n# addNum(2)\\nif -max_heap[0] < 2:  # lower-top=1 < 2: True\\n    heapq.heappush(min_heap, 2)\\nif len(max_heap) < len(min_heap):  # 1 < 2: True\\n    heapq.heappush(max_heap, -heapq.heappop(min_heap))\\n# findMedian\\nmedian = -max_heap[0]", "frames": [ { "line": 6, "vars": { "max_heap": "[-3]", "min_heap": "[]" }, "note": "addNum(3): push -3 to lower half. Effective top = 3" }, { "line": 9, "vars": { "max_heap": "[-3, -1]", "min_heap": "[]" }, "note": "addNum(1): 1 <= lower-top(3), so push 1 to lower half" }, { "line": 11, "vars": { "max_heap": "[-1]", "min_heap": "[3]" }, "note": "Rebalance: lower had 2 elems -- move its max (3) to upper half" }, { "line": 14, "vars": { "max_heap": "[-1]", "min_heap": "[2, 3]" }, "note": "addNum(2): lower-top=1 < 2, so 2 goes to upper half" }, { "line": 16, "vars": { "max_heap": "[-2, -1]", "min_heap": "[3]" }, "note": "Rebalance: upper was larger -- move its min (2) back to lower half" }, { "line": 18, "vars": { "max_heap": "[-2, -1]", "min_heap": "[3]", "median": "2" }, "note": "3 elements (odd): median = lower-top = -(-2) = 2 checkmark" } ], "speed": 900 }
\`\`\`

### Knowledge Check

\`\`\`quiz
{ "title": "Two Heaps -- Checkpoint Quiz", "questions": [ { "question": "What is the time complexity of reading the median from two balanced heaps?", "options": ["O(n)", "O(log n)", "O(1)", "O(n log n)"], "answer": 2, "explanation": "The median always sits at the tops of the two heaps. Reading a heap root is O(1). The O(log n) cost is paid during insertion to maintain the balance invariant -- not during the query itself." }, { "question": "In the two-heaps median pattern, what does the max-heap store?", "options": ["The larger half of numbers", "The smaller half of numbers", "All numbers in sorted order", "Only the current median candidate"], "answer": 1, "explanation": "The max-heap holds the lower (smaller) half. Its root is the largest element of that half -- the left boundary of the median. The min-heap holds the upper half, with its root as the right boundary." }, { "question": "Why is lazy deletion used in Sliding Window Median?", "options": ["To reduce memory by eagerly pruning old elements", "To avoid O(k) linear search when removing arbitrary heap elements", "To keep both heaps exactly equal in size at all times", "Lazy deletion is optional -- direct removal has the same complexity"], "answer": 1, "explanation": "Heaps only support efficient O(log k) removal at the root. Finding and removing an element buried inside the heap costs O(k). Lazy deletion defers removal until the element naturally rises to the top, preserving amortized O(log k) cost." }, { "question": "How do you simulate a max-heap using Python's heapq module?", "options": ["Pass reverse=True to heapq.heappush()", "Negate values on push; negate again after popping", "Use heapq.nlargest() for every access", "Python heapq natively supports max-heap mode via a flag"], "answer": 1, "explanation": "Python's heapq is min-heap only. Storing -x inverts the ordering: the smallest stored value (most negative) corresponds to the largest original value. After heappop(), negate the result to recover the true value." }, { "question": "In the IPO problem, which data structure tracks all currently affordable projects?", "options": ["Max-heap sorted by profit", "Min-heap sorted by required capital", "Max-heap sorted by required capital", "Min-heap sorted by profit"], "answer": 1, "explanation": "A min-heap keyed on capital lets you efficiently find all projects whose cost is within your current budget -- drain it while top.capital <= available. Their profits then flow into a max-heap for the selection step." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Max-heap (lower half) + min-heap (upper half): the balance invariant delivers O(1) median access after O(log n) insert.", "In Python, negate values to turn heapq into a max-heap -- this trick is required for every two-heaps problem.", "Lazy deletion solves arbitrary heap removal in amortized O(log k) by deferring until the element reaches the root.", "IPO separates two concerns with two heaps: affordability (min-heap on capital) and optimality (max-heap on profit).", "LC 295, 480, and 502 are all Hard-rated and appear in real FAANG interviews -- you have now covered all three." ] }
\`\`\`

<!-- voice:checkpoint_complete -->

**Pattern complete.** Max-heap and min-heap, balanced at their boundary — a deceptively simple structure that tames median queries, sliding windows, and capital allocation problems alike.`,
    },
  ],
};
