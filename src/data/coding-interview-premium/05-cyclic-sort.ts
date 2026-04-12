import { Module } from "../types";

export const cyclicSortModule: Module = {
  id: "cyclic-sort",
  title: "Cyclic Sort",
  description: "Master the cyclic sort pattern for sorting numbers in a given range [1..n] in O(n) time without extra space. Perfect for finding missing numbers, duplicates, and other range-based problems.",
  lessons: [
    {
      id: "cyclic-sort-intro",
      slug: "cyclic-sort-intro",
      title: "Introduction to Cyclic Sort",
      content: `## The Cyclic Sort Pattern

Cyclic sort is an in-place sorting technique that exploits a single key insight: when an array contains numbers in the range **[1..n]**, each number **v** has a predetermined home — **index v − 1**. Rather than comparing and shifting elements like traditional sorting, cyclic sort sends each misplaced number directly to its destination, achieving O(n) time with zero extra space.

\`\`\`concept
{ "title": "The Value-as-Index Insight", "variant": "mental-model", "content": "For an array of n numbers in range [1..n], each value v tells you exactly where it belongs: index v−1. Think of each element as carrying its own address — you just need to deliver it. Instead of comparing neighbors, cyclic sort uses the value itself as a map to the destination. This is what makes O(n) sorting without extra space possible." }
\`\`\`

<!-- voice:section_check concept="cyclic sort basic idea" -->

### When to Use Cyclic Sort

Cyclic sort is purpose-built for a specific class of problems. Recognizing the pattern quickly is the real skill — if you see **any** of these signals, reach for it immediately:

| Signal | Example |
|---|---|
| Array of n numbers in range [1..n] or [0..n−1] | \`[3, 1, 4, 2]\`, \`[0, 2, 1, 3]\` |
| Find the missing number(s) in a sequence | "Find the missing integer in [1..n]" |
| Find duplicate numbers in a range | "Find the repeated element" |
| Problem requires O(n) time + O(1) space | Nearly any of the above |

\`\`\`callout
{ "type": "warning", "title": "Not a General-Purpose Sort", "content": "Cyclic sort only works when values are integers in a fixed, known range — because you need to map values to indices. For arbitrary data (strings, floats, objects), use quicksort or mergesort instead. Cyclic sort's power is precision, not generality." }
\`\`\`

---

### How It Works

\`\`\`steps
{ "title": "Cyclic Sort Algorithm", "steps": [ { "title": "Initialize at index 0", "content": "Set pointer \`i = 0\`. We process every index left to right, but we may stay at the same index for multiple iterations while placing elements that arrive there." }, { "title": "Calculate the correct index", "content": "For the current element \`nums[i]\`, its correct position is \`correct = nums[i] - 1\`. For example, value \`3\` belongs at index \`2\`, value \`5\` belongs at index \`4\`." }, { "title": "Swap if out of place", "content": "If \`nums[i] != nums[correct]\`, swap \`nums[i]\` with \`nums[correct]\`. **Do not advance \`i\`** — the element that just arrived at index \`i\` may also need to move somewhere else." }, { "title": "Advance only when correct", "content": "If \`nums[i] == nums[correct]\`, the element at index \`i\` is already home. Increment \`i\` and move to the next position." }, { "title": "Repeat until i reaches n", "content": "Continue until \`i == len(nums)\`. The array is now sorted. Any index where \`nums[i] != i + 1\` after sorting reveals a missing or duplicate — no extra scan logic needed." } ] }
\`\`\`

---

### Tracing the Algorithm

<!-- voice:key_insight insight="Each number tells us exactly where it belongs — we use the value as an index to place it correctly" -->

Watch cyclic sort process \`[3, 1, 5, 2, 4]\` line by line. Pay close attention: \`i\` stays pinned at index 0 for four consecutive swaps before it ever advances.

\`\`\`trace
{ "title": "cyclic_sort([3, 1, 5, 2, 4])", "language": "python", "code": "def cyclic_sort(nums):\\n    i = 0\\n    while i < len(nums):\\n        correct = nums[i] - 1\\n        if nums[i] != nums[correct]:\\n            nums[i], nums[correct] = nums[correct], nums[i]\\n        else:\\n            i += 1\\n    return nums\\n\\nnums = [3, 1, 5, 2, 4]\\ncyclic_sort(nums)", "frames": [ { "line": 11, "vars": { "nums": "[3, 1, 5, 2, 4]" }, "note": "Start with unsorted input" }, { "line": 2, "vars": { "nums": "[3, 1, 5, 2, 4]", "i": 0 }, "note": "Initialize i = 0" }, { "line": 4, "vars": { "nums": "[3, 1, 5, 2, 4]", "i": 0, "correct": 2 }, "note": "nums[0]=3, correct index = 3-1 = 2" }, { "line": 6, "vars": { "nums": "[5, 1, 3, 2, 4]", "i": 0, "correct": 2 }, "note": "3 != nums[2]=5. Swap! 3 now sits at index 2." }, { "line": 4, "vars": { "nums": "[5, 1, 3, 2, 4]", "i": 0, "correct": 4 }, "note": "nums[0]=5, correct index = 5-1 = 4" }, { "line": 6, "vars": { "nums": "[4, 1, 3, 2, 5]", "i": 0, "correct": 4 }, "note": "5 != nums[4]=4. Swap! 5 now sits at index 4." }, { "line": 4, "vars": { "nums": "[4, 1, 3, 2, 5]", "i": 0, "correct": 3 }, "note": "nums[0]=4, correct index = 4-1 = 3" }, { "line": 6, "vars": { "nums": "[2, 1, 3, 4, 5]", "i": 0, "correct": 3 }, "note": "4 != nums[3]=2. Swap! 4 now sits at index 3." }, { "line": 4, "vars": { "nums": "[2, 1, 3, 4, 5]", "i": 0, "correct": 1 }, "note": "nums[0]=2, correct index = 2-1 = 1" }, { "line": 6, "vars": { "nums": "[1, 2, 3, 4, 5]", "i": 0, "correct": 1 }, "note": "2 != nums[1]=1. Swap! Index 0 now holds 1." }, { "line": 8, "vars": { "nums": "[1, 2, 3, 4, 5]", "i": 1 }, "note": "nums[0]=1 is correct (1 == 0+1). Advance i to 1." }, { "line": 9, "vars": { "nums": "[1, 2, 3, 4, 5]", "i": 5 }, "note": "Indices 1-4 all already in place. i reaches 5, loop ends. Sorted in 4 swaps!" } ], "speed": 900 }
\`\`\`

> Each number **v** belongs at index **v − 1**. Any index where \`nums[i] != i + 1\` after the sort immediately reveals a missing or duplicate — no extra logic required.

---

### Implementation

\`\`\`tabs
{ "tabs": [ { "label": "Python", "icon": "🐍", "content": "\`\`\`python\\ndef cyclic_sort(nums: list[int]) -> list[int]:\\n    i = 0\\n    while i < len(nums):\\n        correct = nums[i] - 1\\n        if nums[i] != nums[correct]:  # out of place — swap\\n            nums[i], nums[correct] = nums[correct], nums[i]\\n        else:\\n            i += 1              # home — move forward\\n    return nums\\n\\nprint(cyclic_sort([3, 1, 5, 2, 4]))  # [1, 2, 3, 4, 5]\\n\`\`\`" }, { "label": "JavaScript", "icon": "🟨", "content": "\`\`\`javascript\\nfunction cyclicSort(nums) {\\n  let i = 0;\\n  while (i < nums.length) {\\n    const correct = nums[i] - 1;\\n    if (nums[i] !== nums[correct]) {   // out of place — swap\\n      [nums[i], nums[correct]] = [nums[correct], nums[i]];\\n    } else {\\n      i++;                              // home — move forward\\n    }\\n  }\\n  return nums;\\n}\\n\\nconsole.log(cyclicSort([3, 1, 5, 2, 4]));  // [1, 2, 3, 4, 5]\\n\`\`\`" }, { "label": "Java", "icon": "☕", "content": "\`\`\`java\\npublic static void cyclicSort(int[] nums) {\\n    int i = 0;\\n    while (i < nums.length) {\\n        int correct = nums[i] - 1;  // value v -> index v-1\\n        if (nums[i] != nums[correct]) {\\n            int temp = nums[i];\\n            nums[i] = nums[correct];\\n            nums[correct] = temp;\\n        } else {\\n            i++;\\n        }\\n    }\\n}\\n// cyclicSort(new int[]{3, 1, 5, 2, 4}) -> [1, 2, 3, 4, 5]\\n\`\`\`" } ] }
\`\`\`

---

### Complexity

**Time: O(n)** — Although there are two nested loops, each element is moved to its correct position **at most once**. Once an element is placed, it is never moved again. Total swaps across the entire algorithm ≤ n − 1.

**Space: O(1)** — All operations are in-place. No auxiliary arrays, sets, or hash maps.

\`\`\`collapse
{ "title": "Deep Dive: Why nested loops still give O(n)", "content": "At first glance, a while-loop inside a while-loop screams O(n²). The key is the amortized argument: each swap places exactly one element permanently in its correct position. With n elements total, there can be at most n swaps total — not n swaps per outer iteration. The outer loop executes n times (once per index), and the total work of all inner iterations combined is bounded by n. So the real complexity is O(n) outer iterations + O(n) total swaps = O(n) overall." }
\`\`\`

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "What is the time complexity of cyclic sort on an array of n elements in range [1..n]?", "options": ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], "answer": 2, "explanation": "Each element is swapped to its correct position at most once, so total swaps across the entire algorithm is at most n−1. Despite the nested loop structure, the algorithm is O(n)." }, { "question": "You are at index i with nums[i] = 4 in an array of length 5. Which index should this element be swapped to?", "options": ["Index 4", "Index 3", "Index 2", "Index 1"], "answer": 1, "explanation": "For value v in range [1..n], the correct index is v − 1. Value 4 belongs at index 4 − 1 = 3." }, { "question": "Tracing cyclic_sort([3, 1, 5, 2, 4]): how many swap operations occur before i finally advances past index 0?", "options": ["1 swap", "2 swaps", "3 swaps", "4 swaps"], "answer": 3, "explanation": "At i=0: swap 3↔5 (idx 2), then 5↔4 (idx 4), then 4↔2 (idx 3), then 2↔1 (idx 1). After all four swaps nums[0]=1 is in place and i increments to 1." }, { "question": "Which problem is cyclic sort LEAST suited for?", "options": ["Find the missing number in an array [1..n]", "Sort a list of employee names alphabetically", "Find all duplicates in an array of n numbers in range [1..n]", "Find the smallest missing positive integer"], "answer": 1, "explanation": "Cyclic sort relies on values being integers that map directly to array indices. String data has no equivalent numeric index mapping, making cyclic sort inapplicable." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Cyclic sort treats each value v as a pointer to its correct index (v − 1), enabling O(n) in-place sorting without extra space.", "The pointer i only advances when the current element is already home — this invariant is what guarantees every element gets placed correctly.", "Total swaps across the entire algorithm are bounded by n − 1, which is why the nested loop structure is still O(n) overall.", "After sorting, any index where nums[i] != i + 1 immediately reveals a missing or duplicate number — the sorted array becomes a lookup table.", "Reach for cyclic sort whenever you see: numbers in a fixed range [1..n] or [0..n−1], find missing/duplicates, and O(1) space required." ] }
\`\`\``,
    },
    {
      id: "find-missing-number",
      slug: "find-missing-number",
      title: "Find Missing Number",
      content: `## Find the Missing Number

Given an array of **n** distinct integers drawn from the range **[0..n]**, exactly one value is absent. The task is to identify it in O(n) time with O(1) space.

\`\`\`concept
{ "title": "Index-as-Address Mental Model", "variant": "mental-model", "content": "Cyclic sort exploits one property: when numbers live in [0..n] and we have n slots (indices 0 to n-1), value i belongs exactly at index i. After an in-place cyclic sort, the first index where nums[i] ≠ i exposes the missing number. If every index matches, then n itself is missing — it had no slot to land in." }
\`\`\`

### Why This Range Is Slightly Different

The base cyclic sort pattern targets **[1..n]** and places value \`i\` at index \`i-1\`. Here the range starts at **0**, so the mapping is \`value i → index i\`. The only number that cannot be placed is **n** — there are only indices 0 to n-1.

\`\`\`callout
{ "type": "warning", "title": "Guard condition: num < n, not num <= n", "content": "Value n has no valid destination index. The guard \`num < len(nums)\` filters it out during the swap phase. If it ends up in the array (as a displaced value), we simply skip it and return n at the end if no other mismatch is found." }
\`\`\`

### Algorithm

\`\`\`steps
{ "title": "Two-Phase Approach", "steps": [ { "title": "Phase 1 — Cyclic Sort", "content": "Walk with pointer \`i\`. For each position: if \`nums[i] < n\` AND \`nums[i] != i\`, swap \`nums[i]\` with \`nums[nums[i]]\` to send it home. Otherwise advance \`i\`. Because every swap moves one element to its final position, the loop terminates in O(n) total swaps." }, { "title": "Phase 2 — Scan for the Mismatch", "content": "Walk the sorted array. The first index \`i\` where \`nums[i] != i\` is your answer — the missing number is \`i\` itself." }, { "title": "Edge Case: n is Missing", "content": "If the scan completes with no mismatch, then all values 0..n-1 are present and n is missing. Return \`len(nums)\`." } ] }
\`\`\`

### Visualising the Scan Phase

After running cyclic sort on \`[3, 0, 1]\` we get \`[0, 1, 3]\`. The animation below shows the scan finding the mismatch:

\`\`\`algoviz
{ "title": "Scan sorted [0, 1, 3] for the missing value", "type": "array", "data": [0, 1, 3], "frames": [ { "highlight": [0], "label": "index 0: value 0 == 0 ✓ — correct", "stats": { "i": 0, "check": "0==0" } }, { "highlight": [1], "label": "index 1: value 1 == 1 ✓ — correct", "stats": { "i": 1, "check": "1==1" } }, { "highlight": [2], "label": "index 2: value 3 ≠ 2 — MISSING NUMBER = 2", "stats": { "i": 2, "check": "3≠2", "answer": 2 } } ], "speed": 900 }
\`\`\`

### Python Implementation

\`\`\`python
def missingNumber(nums: list[int]) -> int:
    i, n = 0, len(nums)
    while i < n:
        num = nums[i]
        # num < n guards against value n (no valid index)
        if num < n and num != i:
            nums[i], nums[num] = nums[num], nums[i]
        else:
            i += 1
    for i in range(n):
        if nums[i] != i:
            return i
    return n  # All 0..n-1 present → n is missing
\`\`\`

### Execution Trace on \`[3, 0, 1]\`

\`\`\`trace
{ "title": "missingNumber([3, 0, 1]) — full trace", "language": "python", "code": "def missingNumber(nums):\\n    i, n = 0, len(nums)\\n    while i < n:\\n        num = nums[i]\\n        if num < n and num != i:\\n            nums[i], nums[num] = nums[num], nums[i]\\n        else:\\n            i += 1\\n    for i in range(n):\\n        if nums[i] != i:\\n            return i\\n    return n", "frames": [ { "line": 2, "vars": { "nums": "[3,0,1]", "i": 0, "n": 3 }, "note": "Initialise: i=0, n=3" }, { "line": 4, "vars": { "nums": "[3,0,1]", "i": 0, "num": 3 }, "note": "num=3; 3 < 3 is False → else branch" }, { "line": 8, "vars": { "nums": "[3,0,1]", "i": 1 }, "note": "i advances to 1" }, { "line": 4, "vars": { "nums": "[3,0,1]", "i": 1, "num": 0 }, "note": "num=0; 0 < 3 and 0 ≠ 1 → swap nums[1] with nums[0]" }, { "line": 6, "vars": { "nums": "[0,3,1]", "i": 1 }, "note": "Array is now [0,3,1]. i stays at 1 (re-check same slot)" }, { "line": 4, "vars": { "nums": "[0,3,1]", "i": 1, "num": 3 }, "note": "num=3; 3 < 3 is False → else branch" }, { "line": 8, "vars": { "nums": "[0,3,1]", "i": 2 }, "note": "i advances to 2" }, { "line": 4, "vars": { "nums": "[0,3,1]", "i": 2, "num": 1 }, "note": "num=1; 1 < 3 and 1 ≠ 2 → swap nums[2] with nums[1]" }, { "line": 6, "vars": { "nums": "[0,1,3]", "i": 2 }, "note": "Array is now [0,1,3]. i stays at 2" }, { "line": 4, "vars": { "nums": "[0,1,3]", "i": 2, "num": 3 }, "note": "num=3; 3 < 3 is False → else. i → 3, loop exits" }, { "line": 10, "vars": { "nums": "[0,1,3]", "i": 2 }, "note": "Scan: i=0 ok, i=1 ok, i=2: nums[2]=3 ≠ 2 → return 2", "stdout": "2" } ], "speed": 800 }
\`\`\`

### Complexity

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(n) | Each element is swapped at most once — total swaps ≤ n |
| **Space** | O(1) | All operations in-place; no auxiliary structures |

\`\`\`collapse
{ "title": "Deep Dive: Why the Loop is O(n) Despite Looking Nested", "content": "The while loop does not advance \`i\` on every iteration — it only advances when no swap occurs. This looks like it could be quadratic, but consider: every swap sends \`nums[i]\` to its final home and it is never moved again. The pointer \`i\` can only advance n times total. So the total number of loop iterations (advances + swaps) is at most 2n, giving O(n) overall." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "After cyclic sort on [2, 0, 3], the array becomes [0, 3, 2]. What is the missing number?", "options": ["1", "2", "3", "4"], "answer": 0, "explanation": "Scan index by index: nums[0]=0 ✓, nums[1]=3 ≠ 1 → missing is 1. The range was [0..3] with n=3 elements." }, { "question": "Why must the guard condition be \`num < len(nums)\` rather than \`num <= len(nums)\`?", "options": ["To prevent an index-out-of-bounds error when swapping", "Because value n has no valid destination index in an array of length n", "To skip duplicate values during the sort", "Because the scan phase handles values above n-1"], "answer": 1, "explanation": "The array holds indices 0..n-1. Value n cannot be placed at index n (it doesn't exist), so the guard \`num < n\` filters it out during swaps. At the end, if every index matches, n is returned as the fallback." }, { "question": "Input: [0]. What does the function return?", "options": ["0", "1", "-1", "None"], "answer": 1, "explanation": "n=1. Value 0 is already at index 0 — no swap needed. The scan finds no mismatch, so we fall through to \`return n\` which is 1. The range [0..1] is missing 1." }, { "question": "An alternative solution stores all values in a hash set and checks which number in [0..n] is absent. How does this compare to cyclic sort?", "options": ["Same time and space complexity", "Faster time complexity, same space", "Same time complexity, but O(n) space instead of O(1)", "Both are O(n log n)"], "answer": 2, "explanation": "A hash set also runs in O(n) time, but allocates O(n) extra memory for the set. Cyclic sort achieves identical time complexity with O(1) space by reusing the input array as scratch space." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Map value i → index i: after cyclic sort on a [0..n] range, the first index where nums[i] ≠ i is the missing number.", "The guard \`num < n\` is non-negotiable — value n has no destination index and must be treated as a special case.", "Each element is swapped at most once, keeping the algorithm at O(n) time despite the inner-looking while loop.", "If the scan finds no mismatch, n itself is missing — always handle this edge case with a final \`return n\`.", "Cyclic sort eliminates the O(n) space cost of a hash-set solution while preserving O(n) time." ] }
\`\`\``,
      starterCode: `def find_missing_number(nums):
    """
    Find the missing number in range [0..n] from the array.
    
    Args:
        nums: List of n distinct integers from range [0..n] with one missing
    
    Returns:
        int: The missing number
    
    Example:
        >>> find_missing_number([4, 0, 3, 1])
        2
    """
    # TODO: Use cyclic sort to place numbers at correct indices
    # Hint: Number i should be at index i
    pass


# ─── Test Cases ───

# Standard case
print(find_missing_number([4, 0, 3, 1]))
# Expected: 2

# Larger range
print(find_missing_number([8, 3, 5, 2, 4, 6, 0, 1]))
# Expected: 7

# Missing 0
print(find_missing_number([1, 2, 3]))
# Expected: 0

# Missing last number
print(find_missing_number([0, 1, 2]))
# Expected: 3

# Single element, missing 0
print(find_missing_number([1]))
# Expected: 0

# Single element, missing 1
print(find_missing_number([0]))
# Expected: 1
`,
      solutionCode: `def find_missing_number(nums):
    """
    Find the missing number in range [0..n] from the array.
    
    Time Complexity: O(n) — cyclic sort
    Space Complexity: O(1) — in-place
    """
    i = 0
    n = len(nums)
    
    while i < n:
        correct_idx = nums[i]
        # If the number is in valid range and not in correct position, swap
        if correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Find first index that doesn't match its value
    for i in range(n):
        if nums[i] != i:
            return i
    
    # If all match, missing number is n
    return n


# ─── Test Cases ───
print(find_missing_number([4, 0, 3, 1]))
# Expected: 2

print(find_missing_number([8, 3, 5, 2, 4, 6, 0, 1]))
# Expected: 7

print(find_missing_number([1, 2, 3]))
# Expected: 0

print(find_missing_number([0, 1, 2]))
# Expected: 3

print(find_missing_number([1]))
# Expected: 0

print(find_missing_number([0]))
# Expected: 1
`,
    },
    {
      id: "find-all-missing-numbers",
      slug: "find-all-missing-numbers",
      title: "Find All Missing Numbers",
      content: `## Find All Missing Numbers

<!-- voice:section_check concept="multiple missing numbers with cyclic sort" -->

### Problem Statement

Given an array of n integers where each number is in range [1..n], find all numbers that are missing from the array. Each number appears exactly once or not at all.

### Examples

~~~
Input:  [2, 3, 1, 8, 2, 3, 5, 1]
Output: [4, 6, 7]
Explanation: Numbers 4, 6, 7 are missing from range [1..8]
~~~

~~~
Input:  [2, 4, 1, 2]
Output: [3]
~~~

### Approach

Use cyclic sort to place each number at its correct index (number i at index i-1). After sorting, indices that don't contain the expected number reveal all missing numbers.

<!-- voice:key_insight insight="After placing each number at index i-1, indices with wrong values correspond to missing numbers" -->

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Complexity

- **Time:** O(n) — cyclic sort
- **Space:** O(1) excluding output — in-place sorting`,
      starterCode: `def find_missing_numbers(nums):
    """
    Find all missing numbers in range [1..n] from the array.
    
    Args:
        nums: List of integers in range [1..n]
    
    Returns:
        List of missing numbers
    
    Example:
        >>> find_missing_numbers([2, 3, 1, 8, 2, 3, 5, 1])
        [4, 6, 7]
    """
    # TODO: Use cyclic sort, then find indices where value != index + 1
    # Hint: Number i should be at index i-1
    pass


# ─── Test Cases ───

# Multiple missing
print(find_missing_numbers([2, 3, 1, 8, 2, 3, 5, 1]))
# Expected: [4, 6, 7]

# Single missing
print(find_missing_numbers([2, 4, 1, 2]))
# Expected: [3]

# No missing
print(find_missing_numbers([1, 2, 3, 4]))
# Expected: []

# All missing
print(find_missing_numbers([2, 2, 2, 2]))
# Expected: [1, 3, 4]

# Empty
print(find_missing_numbers([]))
# Expected: []
`,
      solutionCode: `def find_missing_numbers(nums):
    """
    Find all missing numbers in range [1..n] from the array.
    
    Time Complexity: O(n) — cyclic sort
    Space Complexity: O(1) excluding output — in-place
    """
    n = len(nums)
    i = 0
    
    # Cyclic sort: place number i at index i-1
    while i < n:
        correct_idx = nums[i] - 1
        # If in valid range and not in correct position, swap
        if 0 <= correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Find all indices where value != index + 1
    missing = []
    for i in range(n):
        if nums[i] != i + 1:
            missing.append(i + 1)
    
    return missing


# ─── Test Cases ───
print(find_missing_numbers([2, 3, 1, 8, 2, 3, 5, 1]))
# Expected: [4, 6, 7]

print(find_missing_numbers([2, 4, 1, 2]))
# Expected: [3]

print(find_missing_numbers([1, 2, 3, 4]))
# Expected: []

print(find_missing_numbers([2, 2, 2, 2]))
# Expected: [1, 3, 4]

print(find_missing_numbers([]))
# Expected: []
`,
    },
    {
      id: "find-duplicate-number",
      slug: "find-duplicate-number",
      title: "Find Duplicate Number",
      content: `## Find the Duplicate Number

<!-- voice:section_check concept="finding duplicates with cyclic sort" -->

The problem sounds deceptively simple — find the one repeated number. The catch: the constraints rule out both the O(n²) brute force and the O(n) hash set. Cyclic sort solves it in O(n) time with no extra space.

\`\`\`concept
{ "title": "The Duplicate Detection Insight", "variant": "mental-model", "content": "In an array of n+1 integers where all values are in [1..n], every number has a 'home' index at value−1. When two copies of value v both try to occupy index v−1, the second one has nowhere to go. That stuck value is your duplicate." }
\`\`\`

### Problem Statement

Given an array of \`n+1\` integers where each integer is in the range \`[1, n]\` inclusive, exactly one number is duplicated. Find it.

\`\`\`tabs
{ "tabs": [
  { "label": "Example 1", "icon": "🔢", "content": "**Input:** \`[1, 4, 4, 3, 2]\`\\n\\n**Output:** \`4\`\\n\\nValue \`4\` appears at both index 1 and index 2." },
  { "label": "Example 2", "icon": "🔢", "content": "**Input:** \`[2, 1, 3, 3, 5, 4]\`\\n\\n**Output:** \`3\`\\n\\nValue \`3\` appears at both index 2 and index 3." },
  { "label": "Constraints", "icon": "📋", "content": "- Array length is \`n+1\`, values in range \`[1, n]\`\\n- Exactly one number is duplicated (may appear more than twice)\\n- Target: **O(n) time, O(1) space**\\n\\n**LeetCode 287 note:** The official problem prohibits modifying the array. Cyclic sort mutates input in-place — confirm with your interviewer before using this approach. If mutation is forbidden, Floyd's cycle detection achieves the same bounds without touching the array." }
] }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "In-Place Mutation Caveat", "content": "Cyclic sort physically rearranges the input array. LeetCode 287 explicitly says 'do not modify nums.' Many interviewers still accept this approach if you flag the trade-off. Always ask: 'Is it okay if I mutate the input array?' before proceeding." }
\`\`\`

### The Algorithm

\`\`\`steps
{ "title": "Cyclic Sort — Find Duplicate", "steps": [
  { "title": "Compute each number's home", "content": "For any value \`v\` in range \`[1..n]\`, its correct index is \`v - 1\`. Value \`1\` belongs at index \`0\`, value \`4\` belongs at index \`3\`, and so on." },
  { "title": "Phase 1 — Sort in place", "content": "Walk pointer \`i\` across the array. At each step, compute \`correct_idx = nums[i] - 1\`.\\n\\n- If \`nums[i] != nums[correct_idx]\`: swap — send the value toward its home.\\n- If \`nums[i] == nums[correct_idx]\`: the home is already occupied by the same value. This is either (a) the value is home, or (b) a duplicate collision. Either way, **advance \`i\`**. Swapping identical values would create an infinite loop." },
  { "title": "Phase 2 — Scan for the misfit", "content": "After sorting, every non-duplicate value sits at \`index = value - 1\`. Scan the array: any index \`i\` where \`nums[i] != i + 1\` holds the duplicate. Return \`nums[i]\`." }
] }
\`\`\`

### Step-by-Step Trace on \`[1, 4, 4, 3, 2]\`

\`\`\`algoviz
{ "title": "Cyclic Sort trace — [1, 4, 4, 3, 2]", "type": "array", "data": [1, 4, 4, 3, 2],
  "frames": [
    { "highlight": [0], "label": "i=0: value=1, home=index 0 → already home (nums[0]==nums[0]), advance i", "stats": {"i": 0, "value": 1, "home_idx": 0, "action": "advance"} },
    { "highlight": [1, 3], "label": "i=1: value=4, home=index 3 → nums[3]=3 ≠ 4, SWAP indices 1 and 3 → [1, 3, 4, 4, 2]", "stats": {"i": 1, "value": 4, "home_idx": 3, "action": "swap"} },
    { "highlight": [1, 2], "label": "i=1: value=3, home=index 2 → nums[2]=4 ≠ 3, SWAP indices 1 and 2 → [1, 4, 3, 4, 2]", "stats": {"i": 1, "value": 3, "home_idx": 2, "action": "swap"} },
    { "highlight": [1, 3], "label": "i=1: value=4, home=index 3 → nums[3]=4 == 4 → DUPLICATE COLLISION, advance i", "stats": {"i": 1, "value": 4, "home_idx": 3, "action": "duplicate detected!"} },
    { "highlight": [2, 3], "label": "i=2,3: values 3 and 4 are at home → advance. i=4: value=2, swap with index 1 → [1, 2, 3, 4, 4]", "stats": {"i": 4, "value": 2, "home_idx": 1, "action": "swap"} },
    { "highlight": [4], "label": "Phase 2 scan: nums[4]=4 but expected i+1=5 → misfit found → return 4", "stats": {"i": 4, "expected": 5, "found": 4} }
  ],
  "speed": 900 }
\`\`\`

### Code

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Hash Set — O(n) time, O(n) space", "code": "def find_duplicate(nums):\\n    seen = set()\\n    for n in nums:\\n        if n in seen:\\n            return n\\n        seen.add(n)\\n    return -1" }, "after": { "label": "Cyclic Sort — O(n) time, O(1) space", "code": "def find_duplicate(nums):\\n    i = 0\\n    while i < len(nums):\\n        correct_idx = nums[i] - 1\\n        if nums[i] != nums[correct_idx]:\\n            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]\\n        else:\\n            i += 1  # home occupied — advance regardless\\n\\n    for i in range(len(nums)):\\n        if nums[i] != i + 1:\\n            return nums[i]\\n\\n    return -1" } }
\`\`\`

<!-- voice:key_insight insight="When trying to place a number at its correct index, if that index already has the correct value, we've found our duplicate" -->

\`\`\`concept
{ "title": "Why the while loop is still O(n)", "variant": "insight", "content": "The inner body looks like it could loop forever — but each swap permanently moves one value to its correct index. Since there are only n positions, at most n swaps occur across the entire run. The total work is O(n), not O(n²)." }
\`\`\`

### Complexity

| Approach | Time | Space | Mutates input? |
|---|---|---|---|
| Brute force (nested loops) | O(n²) | O(1) | No |
| Hash set | O(n) | O(n) | No |
| Cyclic sort | O(n) | O(1) | **Yes** |
| Floyd's cycle detection | O(n) | O(1) | No |

\`\`\`quiz
{ "title": "Find Duplicate — Check Your Understanding", "questions": [
  {
    "question": "In the cyclic sort loop, when exactly do we increment i?",
    "options": [
      "After every iteration, unconditionally",
      "Only when a swap is performed",
      "When nums[i] equals nums[correct_idx] — either the value is home or it's a duplicate",
      "When nums[i] is greater than i"
    ],
    "answer": 2,
    "explanation": "We advance i only when nums[i] == nums[correct_idx]. This covers two cases: (a) the value is already at its correct home (nums[i] == i+1 implies correct_idx == i), and (b) a duplicate is detected — the home is occupied by the same value. In both cases, swapping would be useless or infinite, so we advance."
  },
  {
    "question": "Why would swapping when nums[i] == nums[correct_idx] cause an infinite loop?",
    "options": [
      "The swap operation itself has a bug",
      "Swapping two equal values produces the identical array — the condition stays true forever",
      "The indices i and correct_idx become negative",
      "The array length changes during the swap"
    ],
    "answer": 1,
    "explanation": "If nums[i] and nums[correct_idx] hold the same value, swapping them changes nothing — the array is byte-for-byte identical after the swap. The condition nums[i] != nums[correct_idx] remains false on the next check, triggering another identical swap, ad infinitum."
  },
  {
    "question": "After Phase 1 (cyclic sort), why does exactly one index have nums[i] != i + 1?",
    "options": [
      "Because the array has an odd number of elements",
      "The duplicate occupies the slot meant for the missing number, leaving one index with a wrong value",
      "The sort always leaves the last element misplaced",
      "There is no guarantee — multiple indices may be wrong"
    ],
    "answer": 1,
    "explanation": "With n+1 values in n slots, one value appears twice and one 'slot number' appears zero times. The duplicate fills its home slot AND displaces the missing number — exactly one index ends up with the wrong value. That wrong value is the duplicate."
  },
  {
    "question": "What is the total number of swaps performed by cyclic sort across the entire array?",
    "options": [
      "O(n²) in the worst case",
      "Exactly n swaps, always",
      "At most n swaps — each swap settles one element permanently",
      "O(log n) swaps due to cycle decomposition"
    ],
    "answer": 2,
    "explanation": "Each successful swap moves nums[i] to its correct index. Once settled there, that element is never swapped again (future passes over it just advance i). With n elements to settle, the total swap count is at most n, giving O(n) overall."
  }
] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Cyclic sort places each value at index value−1, achieving O(n) time and O(1) space for range-bounded arrays.",
  "The duplicate is exposed when two copies compete for the same index — swapping would loop forever, so we advance instead and the duplicate stays misplaced.",
  "Only increment i when nums[i] == nums[correct_idx]: this single guard prevents infinite loops and doubles as duplicate detection.",
  "LeetCode 287 forbids array mutation — always confirm with your interviewer whether in-place modification is acceptable before using cyclic sort."
] }
\`\`\`

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->`,
      starterCode: `def find_duplicate(nums):
    """
    Find the duplicate number in array of n+1 integers in range [1..n].
    
    Args:
        nums: List of n+1 integers in range [1..n] with exactly one duplicate
    
    Returns:
        int: The duplicate number
    
    Example:
        >>> find_duplicate([1, 4, 4, 3, 2])
        4
    """
    # TODO: Use cyclic sort, return number when we try to place at already-correct index
    # Hint: If nums[i] should go at index j but nums[j] already equals nums[i], it's a duplicate
    pass


# ─── Test Cases ───

# Standard case
print(find_duplicate([1, 4, 4, 3, 2]))
# Expected: 4

# Duplicate at beginning
print(find_duplicate([2, 1, 3, 3, 5, 4]))
# Expected: 3

# Duplicate is 1
print(find_duplicate([1, 1, 2, 3, 4]))
# Expected: 1

# Duplicate is last number
print(find_duplicate([1, 2, 3, 4, 4]))
# Expected: 4

# Small array
print(find_duplicate([1, 1]))
# Expected: 1
`,
      solutionCode: `def find_duplicate(nums):
    """
    Find the duplicate number in array of n+1 integers in range [1..n].
    
    Time Complexity: O(n) — cyclic sort
    Space Complexity: O(1) — in-place
    """
    i = 0
    
    while i < len(nums):
        if nums[i] != i + 1:
            correct_idx = nums[i] - 1
            # If the correct position already has the same value, it's a duplicate
            if nums[i] == nums[correct_idx]:
                return nums[i]
            # Otherwise, swap to place it correctly
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    return -1


# ─── Test Cases ───
print(find_duplicate([1, 4, 4, 3, 2]))
# Expected: 4

print(find_duplicate([2, 1, 3, 3, 5, 4]))
# Expected: 3

print(find_duplicate([1, 1, 2, 3, 4]))
# Expected: 1

print(find_duplicate([1, 2, 3, 4, 4]))
# Expected: 4

print(find_duplicate([1, 1]))
# Expected: 1
`,
    },
    {
      id: "find-all-duplicates",
      slug: "find-all-duplicates",
      title: "Find All Duplicates",
      content: `## Find All Duplicates

<!-- voice:section_check concept="finding all duplicates with cyclic sort" -->

Given an array of **n** integers where each element is in the range **[1..n]**, find every number that appears **exactly twice**. You must do this in O(n) time with O(1) extra space (excluding output).

\`\`\`concept
{ "title": "The Core Insight", "variant": "mental-model", "content": "Each number in [1..n] has exactly one 'correct home' — the index (value - 1). After cyclic sort, any number still sitting at the wrong index has a twin already occupying its home. That twin is a duplicate. Collecting every misplaced number gives you all duplicates." }
\`\`\`

### Problem Examples

| Input | Output | Why |
|---|---|---|
| \`[3, 4, 4, 5, 5]\` | \`[4, 5]\` | 4 and 5 each appear twice |
| \`[5, 4, 7, 2, 3, 5, 3]\` | \`[5, 3]\` | 5 and 3 each appear twice |
| \`[4, 3, 2, 7, 8, 2, 3, 1]\` | \`[2, 3]\` | 2 and 3 each appear twice |

---

### Algorithm Walkthrough

\`\`\`steps
{ "title": "Cyclic Sort — Collect All Duplicates", "steps": [ { "title": "Phase 1 — Place every number at its correct index", "content": "Iterate with pointer \`i\`. For each \`nums[i]\`, compute \`correct = nums[i] - 1\`.\\n\\n- If \`nums[i] != nums[correct]\` → swap them (send the number home).\\n- If \`nums[i] == nums[correct]\` → both positions hold the same value; we **cannot** swap (infinite loop). Advance \`i\` instead." }, { "title": "Phase 2 — Scan for misplaced numbers", "content": "After sorting, walk the array once more. Any index \`i\` where \`nums[i] != i + 1\` means that slot's correct resident was displaced by a duplicate — \`nums[i]\` is the duplicate." }, { "title": "Collect and return", "content": "Append every misplaced \`nums[i]\` to a result list and return it. No hash set, no extra O(n) storage — just the output list." } ] }
\`\`\`

---

### Execution Trace — \`[4, 3, 2, 7, 8, 2, 3, 1]\`

\`\`\`algoviz
{ "title": "Cyclic Sort on [4, 3, 2, 7, 8, 2, 3, 1]", "type": "array", "data": [4, 3, 2, 7, 8, 2, 3, 1], "frames": [ { "highlight": [0], "label": "i=0: nums[0]=4, correct index=3. nums[0]≠nums[3] → swap(0,3)", "stats": { "i": 0, "action": "swap" } }, { "highlight": [0], "label": "After swap: [7,3,2,4,8,2,3,1]. i=0: nums[0]=7, correct=6. nums[0]≠nums[6] → swap(0,6)", "stats": { "i": 0, "action": "swap" } }, { "highlight": [0], "label": "After swap: [3,3,2,4,8,2,7,1]. i=0: nums[0]=3, correct=2. nums[0]≠nums[2] → swap(0,2)", "stats": { "i": 0, "action": "swap" } }, { "highlight": [0], "label": "After swap: [2,3,3,4,8,2,7,1]. i=0: nums[0]=2, correct=1. nums[0]≠nums[1] → swap(0,1)", "stats": { "i": 0, "action": "swap" } }, { "highlight": [0], "label": "After swap: [3,2,3,4,8,2,7,1]. i=0: nums[0]=3, correct=2. nums[0]==nums[2] → DUPLICATE SIGNAL, advance i", "stats": { "i": 0, "action": "advance (collision!)" } }, { "highlight": [4], "label": "...continuing sort... i=4: nums[4]=8, correct=7. swap(4,7) → [1,2,3,4,3,2,7,8]", "stats": { "i": 4, "action": "swap" } }, { "highlight": [4], "label": "i=4: nums[4]=3, correct=2. nums[4]==nums[2] → collision, advance i", "stats": { "i": 4, "action": "advance (collision!)" } }, { "highlight": [5], "label": "i=5: nums[5]=2, correct=1. nums[5]==nums[1] → collision, advance i", "stats": { "i": 5, "action": "advance (collision!)" } }, { "highlight": [0,1,2,3,4,5,6,7], "label": "Phase 2 scan: [1,2,3,4,3,2,7,8]. Index 4→nums=3≠5, index 5→nums=2≠6. Duplicates: [3,2]", "stats": { "duplicates": "[3, 2]" } } ], "speed": 900 }
\`\`\`

---

### Implementation

\`\`\`tabs
{ "tabs": [ { "label": "Python", "icon": "🐍", "content": "\`\`\`python\\ndef find_all_duplicates(nums):\\n    i = 0\\n    while i < len(nums):\\n        correct = nums[i] - 1          # where this number belongs\\n        if nums[i] != nums[correct]:   # not home yet — send it there\\n            nums[i], nums[correct] = nums[correct], nums[i]\\n        else:\\n            i += 1                     # already home (or duplicate collision)\\n\\n    duplicates = []\\n    for i in range(len(nums)):\\n        if nums[i] != i + 1:           # misplaced → its twin stole the home\\n            duplicates.append(nums[i])\\n    return duplicates\\n\\n# [4, 3, 2, 7, 8, 2, 3, 1] → [2, 3]\\n\`\`\`" }, { "label": "Java", "icon": "☕", "content": "\`\`\`java\\npublic List<Integer> findDuplicates(int[] nums) {\\n    int i = 0;\\n    while (i < nums.length) {\\n        int correct = nums[i] - 1;\\n        if (nums[i] != nums[correct]) {\\n            // swap nums[i] and nums[correct]\\n            int tmp = nums[i];\\n            nums[i] = nums[correct];\\n            nums[correct] = tmp;\\n        } else {\\n            i++;\\n        }\\n    }\\n\\n    List<Integer> duplicates = new ArrayList<>();\\n    for (int j = 0; j < nums.length; j++) {\\n        if (nums[j] != j + 1) duplicates.add(nums[j]);\\n    }\\n    return duplicates;\\n}\\n// TC: O(n) | SC: O(1) excluding output\\n\`\`\`" }, { "label": "JavaScript", "icon": "🟨", "content": "\`\`\`javascript\\nfunction findAllDuplicates(nums) {\\n    let i = 0;\\n    while (i < nums.length) {\\n        const correct = nums[i] - 1;\\n        if (nums[i] !== nums[correct]) {\\n            [nums[i], nums[correct]] = [nums[correct], nums[i]];\\n        } else {\\n            i++;\\n        }\\n    }\\n\\n    const duplicates = [];\\n    for (let j = 0; j < nums.length; j++) {\\n        if (nums[j] !== j + 1) duplicates.push(nums[j]);\\n    }\\n    return duplicates;\\n}\\n\`\`\`" } ] }
\`\`\`

---

### Why the Collision Check Works

\`\`\`concept
{ "title": "Collision = Duplicate Evidence", "variant": "insight", "content": "When we try to place nums[i] at index (nums[i]-1) and find the same value already there, we know the array has two copies of that number. We cannot swap — it would create an infinite loop. Instead we advance i, leaving both copies where they are. In Phase 2, the 'extra' copy sits at the wrong index and gets harvested." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Don't skip the collision guard", "content": "Without the \`nums[i] != nums[correct]\` check, swapping equal values loops forever. This guard is what separates 'find one duplicate' from 'find all duplicates' — the logic is identical, you just let the sort finish rather than returning early." }
\`\`\`

---

### Approach Comparison

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Hash Set approach — O(n) space", "code": "def findDuplicates(nums):\\n    seen, result = set(), []\\n    for n in nums:\\n        if n in seen:\\n            result.append(n)\\n        else:\\n            seen.add(n)\\n    return result\\n# Correct, but allocates O(n) extra memory." }, "after": { "label": "Cyclic Sort — O(1) space", "code": "def findDuplicates(nums):\\n    i = 0\\n    while i < len(nums):\\n        c = nums[i] - 1\\n        if nums[i] != nums[c]:\\n            nums[i], nums[c] = nums[c], nums[i]\\n        else:\\n            i += 1\\n    return [nums[i] for i in range(len(nums)) if nums[i] != i + 1]\\n# Same O(n) time, zero extra memory." } }
\`\`\`

---

### Complexity

| | Complexity | Reason |
|---|---|---|
| **Time** | O(n) | Each element is swapped at most once into its correct slot; Phase 2 is a single linear scan |
| **Space** | O(1) | Sorting is done in-place; output list not counted as extra space |

\`\`\`collapse
{ "title": "Deep Dive: Why is it really O(n)?", "content": "The while loop looks like it could be O(n²) because \`i\` doesn't always advance. But notice: every swap permanently places at least one element at its correct index. Since there are only n positions and each element is correctly placed at most once, the total number of swaps across the entire loop is bounded by n. Combined with the n iterations in Phase 2, the algorithm is O(2n) = O(n)." }
\`\`\`

---

### Knowledge Check

\`\`\`quiz
{ "title": "Find All Duplicates — Check Your Understanding", "questions": [ { "question": "In the cyclic sort phase, when do we advance \`i\` without swapping?", "options": [ "When nums[i] equals i+1 (already in correct position)", "When nums[i] equals nums[nums[i]-1] (duplicate collision)", "Both of the above", "When nums[i] is greater than nums[i]-1" ], "answer": 2, "explanation": "We advance i without swapping in TWO cases: (1) the element is already at its correct index (nums[i] == i+1), or (2) the correct index already holds the same value (nums[i] == nums[nums[i]-1]), indicating a duplicate. Swapping in case 2 would create an infinite loop." }, { "question": "After cyclic sort completes on [4,3,2,7,8,2,3,1], what does the array look like?", "options": [ "[1,2,3,4,3,2,7,8]", "[1,2,3,4,5,6,7,8]", "[2,3,4,7,8,2,3,1]", "[1,2,3,4,8,2,7,3]" ], "answer": 0, "explanation": "[1,2,3,4,3,2,7,8] — elements 1,2,3,4 are in their correct positions. Index 4 holds 3 and index 5 holds 2 because 5 and 6 are missing (they were replaced by the duplicates 3 and 2). Index 6 holds 7 and index 7 holds 8, correctly placed." }, { "question": "How many total swaps does cyclic sort perform on an array of length n with k duplicates?", "options": [ "Exactly n swaps always", "At most n − k swaps (each swap places one non-duplicate element)", "At most n swaps total (each element placed at most once)", "Exactly 2n swaps (two passes)" ], "answer": 2, "explanation": "Each swap permanently places at least one element in its correct position. Since there are at most n positions to fill, there can be at most n swaps total regardless of how many duplicates exist — which is why the overall complexity stays O(n)." }, { "question": "Which LeetCode problem is the direct extension of this pattern to finding disappeared numbers?", "options": [ "LeetCode 268 — Missing Number", "LeetCode 448 — Find All Numbers Disappeared in an Array", "LeetCode 287 — Find the Duplicate Number", "LeetCode 645 — Set Mismatch" ], "answer": 1, "explanation": "LeetCode 448 asks for numbers in [1..n] that do NOT appear in the array — the exact complement of this problem. After the same cyclic sort phase, you scan for indices where nums[i] != i+1 and collect (i+1) instead of nums[i]." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Cyclic sort places each number at index (value - 1) in O(n) time with O(1) space by swapping elements to their correct homes.", "When nums[i] == nums[nums[i]-1], you've hit a duplicate collision — advance i instead of swapping to avoid an infinite loop.", "After sorting, a single linear scan harvests all duplicates: any nums[i] ≠ i+1 is a number whose home was already occupied.", "This pattern generalises cleanly to finding missing numbers (collect i+1 where misplaced) and set mismatch (collect both the duplicate and the missing value).", "Time O(n), Space O(1) — optimal for range-bounded integer arrays." ] }
\`\`\``,
      starterCode: `def find_all_duplicates(nums):
    """
    Find all numbers that appear twice in the array.
    
    Args:
        nums: List of integers in range [1..n]
    
    Returns:
        List of duplicate numbers
    
    Example:
        >>> find_all_duplicates([3, 4, 4, 5, 5])
        [4, 5]
    """
    # TODO: Use cyclic sort, collect all duplicates found
    # Hint: Same as finding one duplicate, but keep track of all found
    pass


# ─── Test Cases ───

# Multiple duplicates
print(find_all_duplicates([3, 4, 4, 5, 5]))
# Expected: [4, 5]

# Duplicates in different positions
print(find_all_duplicates([5, 4, 7, 2, 3, 5, 3]))
# Expected: [5, 3]

# No duplicates
print(find_all_duplicates([1, 2, 3, 4]))
# Expected: []

# All duplicates
print(find_all_duplicates([1, 1, 2, 2, 3, 3]))
# Expected: [1, 2, 3]

# Single element appearing multiple times
print(find_all_duplicates([2, 2, 2, 2]))
# Expected: [2]
`,
      solutionCode: `def find_all_duplicates(nums):
    """
    Find all numbers that appear twice in the array.
    
    Time Complexity: O(n) — cyclic sort
    Space Complexity: O(1) excluding output — in-place
    """
    duplicates = []
    i = 0
    
    while i < len(nums):
        correct_idx = nums[i] - 1
        # If not in correct position
        if nums[i] != nums[correct_idx]:
            # Swap to place it correctly
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            # Already in correct position, move on
            i += 1
    
    # After sorting, duplicates will be at wrong positions
    for i in range(len(nums)):
        if nums[i] != i + 1:
            duplicates.append(nums[i])
    
    return duplicates


# ─── Test Cases ───
print(find_all_duplicates([3, 4, 4, 5, 5]))
# Expected: [4, 5]

print(find_all_duplicates([5, 4, 7, 2, 3, 5, 3]))
# Expected: [5, 3]

print(find_all_duplicates([1, 2, 3, 4]))
# Expected: []

print(find_all_duplicates([1, 1, 2, 2, 3, 3]))
# Expected: [1, 2, 3]

print(find_all_duplicates([2, 2, 2, 2]))
# Expected: [2]
`,
    },
    {
      id: "cyclic-sort-checkpoint",
      slug: "cyclic-sort-checkpoint",
      title: "Module Checkpoint: Cyclic Sort",
      content: `## Module Checkpoint: Cyclic Sort

<!-- voice:checkpoint_intro -->

Excellent work completing the Cyclic Sort module. Before moving on, let's consolidate everything you've built — the mental models, the edge cases, and the decision-making instincts that separate cyclic sort from every other sorting technique.

---

\`\`\`concept
{ "title": "The Core Insight", "variant": "mental-model", "content": "Cyclic sort exploits the fact that when numbers live in a known range [1..n], each number IS its own address. Number k belongs at index k-1. Instead of comparing and shifting like merge sort, you teleport each element directly home. This is why the algorithm runs in O(n) time despite appearing to have nested movement — each element is swapped at most once." }
\`\`\`

\`\`\`concept
{ "title": "Why O(n) with apparent nested loops?", "variant": "insight", "content": "The outer while-loop moves through indices 0 to n-1. The inner swap only fires when nums[i] is not in its correct slot — and each swap permanently places at least one element correctly. Since there are n elements and each is placed at most once, the total number of swaps is bounded by n, giving O(n) overall. The index i only advances when no swap happens (element is already home or is a duplicate)." }
\`\`\`

---

### Visual Recap: What Cyclic Sort Does

\`\`\`algoviz
{ "title": "Cyclic Sort on [3, 1, 5, 4, 2]", "type": "array", "data": [3, 1, 5, 4, 2], "frames": [ { "highlight": [0], "label": "i=0: nums[0]=3 → belongs at index 2. Swap with nums[2].", "stats": { "i": 0, "swaps": 0 } }, { "highlight": [0, 2], "label": "After swap: [5,1,3,4,2]. nums[0]=5 → belongs at index 4. Swap.", "stats": { "i": 0, "swaps": 1 } }, { "highlight": [0, 4], "label": "After swap: [2,1,3,4,5]. nums[0]=2 → belongs at index 1. Swap.", "stats": { "i": 0, "swaps": 2 } }, { "highlight": [0, 1], "label": "After swap: [1,2,3,4,5]. nums[0]=1 → already home. Advance i.", "stats": { "i": 0, "swaps": 3 } }, { "highlight": [1], "label": "i=1: nums[1]=2 → already home. Advance.", "stats": { "i": 1, "swaps": 3 } }, { "highlight": [2], "label": "i=2: nums[2]=3 → already home. Advance.", "stats": { "i": 2, "swaps": 3 } }, { "highlight": [3], "label": "i=3: nums[3]=4 → already home. Advance.", "stats": { "i": 3, "swaps": 3 } }, { "highlight": [4], "label": "i=4: nums[4]=5 → already home. Done. Total: 3 swaps for 5 elements.", "stats": { "i": 4, "swaps": 3 } } ], "speed": 900 }
\`\`\`

---

### Applying the Pattern: The Two Post-Sort Passes

\`\`\`tabs
{ "tabs": [ { "label": "Find Missing Number", "icon": "🔍", "content": "**Range [0..n] — LeetCode 268**\\n\\nAfter running cyclic sort (skipping numbers ≥ n since they can't be placed):\\n\\n\`\`\`python\\nfor i in range(len(nums)):\\n    if nums[i] != i:\\n        return i\\nreturn len(nums)\\n\`\`\`\\n\\nThe first index where \`nums[i] != i\` holds the answer. If all positions are correct, the missing number is \`n\` itself." }, { "label": "Find Duplicate", "icon": "♊", "content": "**Range [1..n] — LeetCode 287**\\n\\nDuring the sort, when you try to place \`nums[i]\` at its correct index and find the slot already has the same value:\\n\\n\`\`\`python\\nif nums[i] != nums[correct_idx]:  # different value? swap\\n    swap(nums, i, correct_idx)\\nelse:\\n    i += 1  # same value at correct slot → duplicate found earlier\\n\`\`\`\\n\\nPost-sort: first index where \`nums[i] != i + 1\` reveals the duplicate." }, { "label": "Find All Duplicates", "icon": "🔢", "content": "**Range [1..n] — LeetCode 442**\\n\\nSame sort, but collect all mismatches in one final pass:\\n\\n\`\`\`python\\nresult = []\\nfor i in range(len(nums)):\\n    if nums[i] != i + 1:\\n        result.append(nums[i])\\nreturn result\\n\`\`\`\\n\\nTime: O(n). Space: O(1) ignoring the output list." }, { "label": "First Missing Positive", "icon": "➕", "content": "**Range [1..n] — LeetCode 41**\\n\\nTrickier: numbers outside [1..n] are ignored during sort.\\n\\n\`\`\`python\\nwhile i < len(nums):\\n    j = nums[i] - 1\\n    if 1 <= nums[i] <= n and nums[i] != nums[j]:\\n        swap(nums, i, j)\\n    else:\\n        i += 1\\n\\nfor i in range(len(nums)):\\n    if nums[i] != i + 1:\\n        return i + 1\\nreturn n + 1\\n\`\`\`\\n\\nPost-sort: first slot where \`nums[i] != i+1\` gives the answer." } ] }
\`\`\`

---

\`\`\`quiz
{ "title": "Cyclic Sort Checkpoint", "questions": [ { "question": "What is the time complexity of the cyclic sort algorithm?", "options": ["O(n log n) — like comparison-based sorts", "O(n²) — two nested loops always iterate fully", "O(n) — each element is moved at most once", "O(n) amortized, O(n²) worst case"], "answer": 2, "explanation": "Even though there is movement inside the while-loop, each element is placed at its correct index at most once. The total number of swaps across the entire algorithm is bounded by n, so the overall complexity is O(n). Space is O(1) — no extra arrays needed." }, { "question": "In cyclic sort for range [1..n], where should the number 5 be placed?", "options": ["Index 5", "Index 4", "Index 6", "Index 0"], "answer": 1, "explanation": "For the range [1..n], number k belongs at index k-1. So number 5 belongs at index 4. This 0-based offset is the most common source of off-by-one bugs — always double-check your index formula against the problem's stated range." }, { "question": "During cyclic sort, when do we stop swapping and advance the index i?", "options": ["When nums[i] equals i", "When nums[i] equals i+1, OR when the target slot already holds nums[i] (duplicate)", "When the entire array is sorted", "When nums[i] is greater than n"], "answer": 1, "explanation": "We advance i (instead of swapping) in two cases: (1) the current element is already in its correct position, OR (2) the element we'd swap with is identical — meaning it's a duplicate and we must skip to avoid an infinite loop. Failing to handle duplicates causes infinite swap cycles." }, { "question": "After running cyclic sort on a [0..n] range array (LeetCode 268), how do you find the missing number?", "options": ["Sum all elements, subtract from n*(n+1)/2", "Find the first index where nums[i] != i", "Look for the largest element out of place", "Check whether the last index holds n"], "answer": 1, "explanation": "Once cyclic sort places every in-range number at its correct index, a single linear scan reveals the first slot where nums[i] != i — that index IS the missing number. If all indices match, the missing number is n itself (the one value that couldn't fit). The sum formula also works but doesn't use the cyclic sort result." }, { "question": "True or False: Cyclic sort modifies the input array in-place and requires O(1) additional space.", "options": ["True — that is its key advantage over hash-set approaches", "False — it requires an auxiliary copy of the array", "True for finding duplicates, False for finding missing numbers", "False — it requires a visited[] boolean array"], "answer": 0, "explanation": "Cyclic sort swaps elements within the original array using only a constant number of pointer variables. No hash sets, no boolean visited arrays, no extra arrays of any kind. This O(1) space property is what makes it superior to the naive HashMap approach (which is O(n) space) for range-based problems." } ] }
\`\`\`

---

\`\`\`collapse
{ "title": "Deep Dive: When NOT to Use Cyclic Sort", "content": "Cyclic sort is powerful but narrow — it only applies when **all these conditions hold**:\\n\\n1. Input is an array of integers\\n2. Values fall in a **known, contiguous range** (e.g. [1..n] or [0..n])\\n3. You can **modify the input array** in-place\\n\\n**Do not reach for cyclic sort when:**\\n- The range is unknown or very large (e.g., arbitrary integers)\\n- The array holds floats, strings, or objects\\n- The problem forbids modifying the input — use Floyd's Cycle Detection (fast/slow pointer) for finding duplicates without mutation\\n- You need a **stable sort** (cyclic sort is unstable — equal elements may be reordered)\\n\\n**Floyd's alternative for duplicate detection (no mutation, O(1) space):**\\nIf the array can't be modified, model it as a linked list where \`nums[i]\` points to index \`nums[i]\`. A duplicate creates a cycle; fast/slow pointers find the cycle entry = the duplicate. LeetCode 287 accepts both approaches." }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Cyclic sort runs in O(n) time and O(1) space by using values as indices — number k belongs at index k-1 for range [1..n].", "Advance the pointer only when an element is already home OR when a swap would create an infinite loop (duplicate detected at the target index).", "The real power is in the post-sort scan: missing number → first index where nums[i] != i; duplicate → first index where nums[i] != i+1.", "Recognize the pattern by spotting: array of integers + known range + missing/duplicate/misplaced number questions.", "When the input cannot be modified, Floyd's cycle detection achieves the same O(n) time, O(1) space result for duplicate-finding without mutation." ] }
\`\`\`

---

### Voice Summary Prompt

<!-- voice:checkpoint_summary -->

Your coach will ask you to cover three things — try to answer without looking at your notes:

1. Explain the core swap condition in cyclic sort and why we skip (advance \`i\`) instead of swap in two specific scenarios.
2. Walk through \`[3, 4, -1, 1]\` (LeetCode 41 — First Missing Positive) and identify the missing number step by step.
3. Describe one situation where cyclic sort is the wrong tool and what you'd use instead.

**Well done completing the Cyclic Sort module — you now have one of the most elegant O(n) patterns in your toolkit.**`,
    },
  ],
};
