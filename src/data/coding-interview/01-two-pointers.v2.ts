import { Module } from "../types";

export const twoPointersModule: Module = {
  id: "two-pointers",
  title: "Two Pointers",
  description: "Learn the two pointers technique to efficiently solve problems involving sorted arrays and pair searching.",
  lessons: [
    {
      id: "two-pointers-intro",
      slug: "two-pointers-intro",
      title: "Introduction to Two Pointers",
      content: `## The Two Pointers Pattern

The **two pointers** technique uses two reference points (usually indices) that move through a data structure—most often a sorted array—to find pairs or subarrays that satisfy a condition.

\`\`\`concept
{
  "title": "Two Pointers in One Sentence",
  "variant": "mental-model",
  "content": "Think of two fingers sliding along a ruler from opposite ends: each move is a decision that instantly eliminates half the remaining search space."
}
\`\`\`

### Why Two Pointers?

A naive approach to finding a pair of elements that meet some criterion typically involves nested loops, giving **O(n²)** time. Two pointers exploit **sorted order** to shrink the search space at every step, reducing time to **O(n)**.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Brute-force O(n²)",
    "code": "for i in range(n):\\n    for j in range(i+1, n):\\n        if arr[i] + arr[j] == target:\\n            return i, j"
  },
  "after": {
    "label": "Two Pointers O(n)",
    "code": "left, right = 0, n-1\\nwhile left < right:\\n    s = arr[left] + arr[right]\\n    if s == target: return left, right\\n    elif s < target: left += 1\\n    else: right -= 1"
  }
}
\`\`\`

### How It Works

\`\`\`steps
{
  "title": "Opposite-Direction Walkthrough",
  "steps": [
    {
      "title": "1. Start at the extremes",
      "content": "Place \`left\` at index 0 and \`right\` at index \`n-1\` of the sorted array."
    },
    {
      "title": "2. Evaluate the pair",
      "content": "Compute the sum (or other metric) of \`arr[left]\` and \`arr[right]\`."
    },
    {
      "title": "3. Move intelligently",
      "content": "Too small? Increment \`left\` to increase the sum. Too large? Decrement \`right\` to decrease it."
    },
    {
      "title": "4. Stop when pointers meet",
      "content": "When \`left >= right\`, every possible pair has been considered."
    }
  ]
}
\`\`\`

\`\`\`algoviz
{
  "title": "Finding a Pair that Sums to 10",
  "type": "array",
  "data": [2, 3, 5, 7, 8, 9],
  "frames": [
    { "highlight": [0, 5], "label": "left=0, right=5 → 2+9=11 > 10", "stats": {"left": 0, "right": 5} },
    { "highlight": [0, 4], "label": "move right ←, 2+8=10 ✔", "stats": {"left": 0, "right": 4} }
  ],
  "speed": 1000
}
\`\`\`

### Variants

| Variant | Description |
|---------|-------------|
| **Opposite-direction** | One pointer starts at each end; they walk toward each other. |
| **Same-direction** | Both pointers start at one end; a fast pointer moves ahead. |
| **Three pointers** | Extension for problems like the Dutch National Flag. |

\`\`\`quiz
{
  "title": "Pick the Correct Variant",
  "questions": [
    {
      "question": "You need to find the longest sub-array with at most k distinct integers. Which variant fits best?",
      "options": ["Opposite-direction", "Same-direction sliding window", "Three pointers"],
      "answer": 1,
      "explanation": "Same-direction (sliding window) lets you expand/shrink the window while tracking distinct counts."
    },
    {
      "question": "Given a sorted array, find two numbers whose sum equals target. Which variant?",
      "options": ["Opposite-direction", "Same-direction", "Three pointers"],
      "answer": 0,
      "explanation": "Opposite-direction starts at both ends and walks inward, giving O(n) time."
    },
    {
      "question": "Partition an array into <p, =p, >p in one pass. Which variant?",
      "options": ["Opposite-direction", "Same-direction", "Three pointers"],
      "answer": 2,
      "explanation": "Dutch National Flag uses three pointers to track the three regions."
    }
  ]
}
\`\`\`

### When to Reach for Two Pointers

- The input is **sorted** (or you can sort it without penalty).
- You need to find a **pair / triplet** that satisfies a sum or difference constraint.
- You need to **partition** an array in-place.

### Complexity

Most two-pointer solutions run in **O(n)** time and **O(1)** extra space, making them far superior to hash-map or brute-force alternatives when the input is already sorted.

\`\`\`callout
{
  "type": "tip",
  "title": "Sorting First?",
  "content": "If the array isn’t sorted, weigh the O(n log n) sort cost against the speed-up you’ll gain. For single queries it may not be worth it; for many queries it usually is."
}
\`\`\`

In the following lessons you will apply this pattern to five classic problems of increasing difficulty.`,
    },
    {
      id: "two-pointers-pair-target-sum",
      slug: "pair-with-target-sum",
      title: "Pair with Target Sum",
      content: `## Pair with Target Sum

### Problem Statement

Given a **sorted** array of integers and a target sum, find **two numbers** in the array that add up to the target. Return their **indices** as a list \`[i, j]\` where \`i < j\`. If no such pair exists, return \`[-1, -1]\`.

### Examples

\`\`\`
Input:  arr = [1, 2, 3, 4, 6], target = 6
Output: [1, 3]
Explanation: arr[1] + arr[3] = 2 + 4 = 6
\`\`\`

\`\`\`
Input:  arr = [2, 5, 9, 11], target = 11
Output: [0, 2]
Explanation: arr[0] + arr[2] = 2 + 9 = 11
\`\`\`

\`\`\`
Input:  arr = [1, 2, 3], target = 7
Output: [-1, -1]
\`\`\`

### Approach Hints

- Since the array is sorted, place one pointer at the start and one at the end.
- If the sum of the two pointed-to values equals the target, return the indices.
- If the sum is less than the target, move the left pointer right.
- If the sum is greater, move the right pointer left.

\`\`\`concept
{
  "title": "Why Two Pointers Works on Sorted Arrays",
  "variant": "mental-model",
  "content": "Think of the array as a number line. The left pointer starts at the smallest value, the right at the largest. Their sum gives you the current range. If the sum is too small, you need a bigger number—so you move left forward. If it's too big, you need a smaller number—so you move right backward. This guarantees you'll check every possible pair in O(n) time without missing the target."
}
\`\`\`

\`\`\`algoviz
{
  "title": "Two Pointers in Action: arr = [1,2,3,4,6], target = 6",
  "type": "array",
  "data": [1, 2, 3, 4, 6],
  "frames": [
    { "highlight": [0, 4], "label": "L=0, R=4 → 1+6=7 > 6 → R--", "stats": { "L": 0, "R": 4, "sum": 7 } },
    { "highlight": [0, 3], "label": "L=0, R=3 → 1+4=5 < 6 → L++", "stats": { "L": 0, "R": 3, "sum": 5 } },
    { "highlight": [1, 3], "label": "L=1, R=3 → 2+4=6 == 6 → Return [1,3]", "stats": { "L": 1, "R": 3, "sum": 6 } }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Sorted Array Required",
  "content": "Two Pointers only works directly on sorted arrays. If your input is unsorted, you must either:\\n- Sort it first (O(n log n) time, O(1) space)\\n- Use a hash-map approach (O(n) time, O(n) space)\\nNever apply the pointers blindly—verify the order first."
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Brute Force (O(n²))",
    "code": "for i in range(n):\\n    for j in range(i+1, n):\\n        if arr[i] + arr[j] == target:\\n            return [i, j]\\nreturn [-1, -1]"
  },
  "after": {
    "label": "Two Pointers (O(n))",
    "code": "L, R = 0, len(arr) - 1\\nwhile L < R:\\n    s = arr[L] + arr[R]\\n    if s == target:\\n        return [L, R]\\n    elif s < target:\\n        L += 1\\n    else:\\n        R -= 1\\nreturn [-1, -1]"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "What happens if the array is unsorted and you still apply Two Pointers?",
      "options": [
        "It still finds the correct pair in O(n) time",
        "It may miss the pair or return wrong indices",
        "It automatically sorts the array first",
        "It throws a runtime error"
      ],
      "answer": 1,
      "explanation": "Without the sorted order, shrinking the window left or right is no longer guaranteed to adjust the sum in the correct direction, so the algorithm can skip the valid pair."
    },
    {
      "question": "Why is space complexity O(1) for Two Pointers?",
      "options": [
        "The array itself is constant size",
        "Only two extra variables (pointers) are used",
        "Sorting is done in-place",
        "No recursion stack is needed"
      ],
      "answer": 1,
      "explanation": "Regardless of input size, we only store left and right indices—two integers—so extra space is constant."
    },
    {
      "question": "If arr = [2, 7, 11, 15] and target = 9, which indices are returned?",
      "options": [
        "[0, 1]",
        "[1, 2]",
        "[0, 2]",
        "[-1, -1]"
      ],
      "answer": 0,
      "explanation": "arr[0] + arr[1] = 2 + 7 = 9, so the pair is found at the first step."
    }
  ]
}
\`\`\`

### Complexity

- **Time:** O(n) — each pointer moves at most n steps.
- **Space:** O(1) — no extra data structures.`,
      starterCode: `def pair_with_target_sum(arr, target):
    # TODO: implement using two pointers
    pass

# Test cases
print(pair_with_target_sum([1, 2, 3, 4, 6], 6))   # Expected: [1, 3]
print(pair_with_target_sum([2, 5, 9, 11], 11))     # Expected: [0, 2]
print(pair_with_target_sum([1, 2, 3], 7))           # Expected: [-1, -1]
`,
      solutionCode: `def pair_with_target_sum(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]

# Test cases
print(pair_with_target_sum([1, 2, 3, 4, 6], 6))   # Expected: [1, 3]
print(pair_with_target_sum([2, 5, 9, 11], 11))     # Expected: [0, 2]
print(pair_with_target_sum([1, 2, 3], 7))           # Expected: [-1, -1]
`,
    },
    {
      id: "two-pointers-remove-duplicates",
      slug: "remove-duplicates",
      title: "Remove Duplicates",
      content: `## Remove Duplicates from Sorted Array

\`\`\`concept
{"title": "Two-Pointer In-Place Filter", "variant": "mental-model", "content": "Imagine two cursors on a tape: a *fast* cursor reads ahead to find the next unique value, while a *slow* cursor writes that value into the earliest free slot. Because the tape is already sorted, every duplicate is adjacent, so the fast cursor can skip whole blocks of repeats in one move."}
\`\`\`

### Problem Statement

Given a **sorted** array, remove all duplicate values **in-place** so that each element appears only once. Return the **new length** of the array. The first \`k\` elements of the array should hold the unique values.

### Examples

\`\`\`
Input:  [2, 3, 3, 3, 6, 9, 9]
Output: 4
Array becomes: [2, 3, 6, 9, ...]
\`\`\`

\`\`\`
Input:  [2, 2, 2, 11]
Output: 2
Array becomes: [2, 11, ...]
\`\`\`

\`\`\`
Input:  [1, 2, 3, 4]
Output: 4
Array stays: [1, 2, 3, 4]
\`\`\`

### Visual Walk-through

\`\`\`algoviz
{"title": "Removing duplicates from [2,3,3,3,6,9,9]", "type": "array", "data": [2,3,3,3,6,9,9],
 "frames": [
   {"highlight": [0,0], "label": "slow=0, fast=0: write 2", "stats": {"slow":0,"fast":0}},
   {"highlight": [0,1], "label": "slow=0, fast=1: 3≠2 → advance slow, copy 3", "stats": {"slow":1,"fast":1}},
   {"highlight": [1,2], "label": "slow=1, fast=2: 3==3 → skip", "stats": {"slow":1,"fast":2}},
   {"highlight": [1,3], "label": "slow=1, fast=3: 3==3 → skip", "stats": {"slow":1,"fast":3}},
   {"highlight": [1,4], "label": "slow=1, fast=4: 6≠3 → advance slow, copy 6", "stats": {"slow":2,"fast":4}},
   {"highlight": [2,5], "label": "slow=2, fast=5: 9≠6 → advance slow, copy 9", "stats": {"slow":3,"fast":5}},
   {"highlight": [3,6], "label": "slow=3, fast=6: 9==9 → skip", "stats": {"slow":3,"fast":6}},
   {"highlight": [0,1,2,3], "label": "Done. New length = 4", "stats": {"slow":3,"fast":6}}
 ],
 "speed": 900}
\`\`\`

### Algorithm

\`\`\`steps
{"title": "Two-Pointer Recipe", "steps": [
  {"title": "Initialize", "content": "Place both pointers at index 0: \`slow = 0\`, \`fast = 0\`."},
  {"title": "Scan", "content": "Move \`fast\` one cell at a time."},
  {"title": "Compare", "content": "If \`nums[fast] != nums[slow]\`, increment \`slow\` and copy \`nums[fast]\` into \`nums[slow]\`."},
  {"title": "Finish", "content": "When \`fast\` reaches the end, \`slow + 1\` is the new logical length."}
]}
\`\`\`

### Complexity

- **Time:** O(n) — single pass through the array.
- **Space:** O(1) — everything is done in-place.

### Quick Check

\`\`\`quiz
{"title": "Does the order matter?", "questions": [
  {"question": "After the algorithm finishes, which portion of the array is guaranteed to be correct?", "options": ["The first slow+1 elements", "The last slow+1 elements", "All even indices", "None"], "answer": 0, "explanation": "The slow pointer marks the last valid unique element; everything up to and including it is correct."},
  {"question": "Why can we safely skip duplicate elements without storing them?", "options": ["The array is sorted", "We use extra memory", "Python handles it", "We cannot skip them"], "answer": 0, "explanation": "Sorting guarantees duplicates are adjacent, so once we see one duplicate we know all repeats are contiguous."},
  {"question": "What happens to the cells beyond the new length?", "options": ["They are zeroed", "They are undefined/garbage", "They are deleted", "They are shifted left"], "answer": 1, "explanation": "The problem only requires the first k elements to be unique; the rest are left untouched and their values are unspecified."}
]}
\`\`\`

### Code Playground

\`\`\`playground
{"title": "Remove Duplicates — Python", "language": "python", "code": "def remove_duplicates(nums):\\n    if not nums:\\n        return 0\\n    slow = 0\\n    for fast in range(len(nums)):\\n        if nums[fast] != nums[slow]:\\n            slow += 1\\n            nums[slow] = nums[fast]\\n    return slow + 1\\n\\n# ---- test ----\\narr = [2, 3, 3, 3, 6, 9, 9]\\nk = remove_duplicates(arr)\\nprint('new length:', k)\\nprint('unique part:', arr[:k])", "runnable": true}
\`\`\`

### Common Variation: Allow At Most Two Duplicates

\`\`\`collapse
{"title": "Deep Dive: k-duplicates rule", "content": "Interviewers often follow up with \\"allow each element to appear at most twice.\\"  The same two-pointer idea works, but instead of comparing with \`nums[slow]\` we compare with \`nums[slow-2]\` to ensure we never place a third copy.  The write pointer advances only when the current candidate differs from the element two slots behind it."}
\`\`\`

### Key Takeaways

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Two pointers (slow/write and fast/read) give an O(n) in-place solution for sorted arrays.",
  "Duplicates are adjacent because the input is sorted—no extra memory needed.",
  "The algorithm overwrites duplicates in a single left-to-right pass, returning the new logical length.",
  "Elements beyond the returned length are unspecified; only the prefix matters."
]}
\`\`\``,
      starterCode: `def remove_duplicates(arr):
    # TODO: implement using two pointers
    pass

# Test cases
print(remove_duplicates([2, 3, 3, 3, 6, 9, 9]))  # Expected: 4
print(remove_duplicates([2, 2, 2, 11]))            # Expected: 2
print(remove_duplicates([1, 2, 3, 4]))             # Expected: 4
`,
      solutionCode: `def remove_duplicates(arr):
    if not arr:
        return 0
    slow = 0
    for fast in range(1, len(arr)):
        if arr[fast] != arr[slow]:
            slow += 1
            arr[slow] = arr[fast]
    return slow + 1

# Test cases
print(remove_duplicates([2, 3, 3, 3, 6, 9, 9]))  # Expected: 4
print(remove_duplicates([2, 2, 2, 11]))            # Expected: 2
print(remove_duplicates([1, 2, 3, 4]))             # Expected: 4
`,
    },
    {
      id: "two-pointers-squaring-sorted-array",
      slug: "squaring-sorted-array",
      title: "Squaring a Sorted Array",
      content: `## Squaring a Sorted Array

### Problem Statement

Given a sorted array of integers (which may contain negative numbers), return a **new array** containing the squares of each number, also **sorted in ascending order**.

\`\`\`concept
{"title": "Why This Problem Matters", "variant": "insight", "content": "Squaring a sorted array seems trivial—until you realize that negative numbers flip the order. The largest magnitude might hide at the far-left end. This is a classic interview test of whether you can exploit sorted structure instead of falling back on an expensive sort."}
\`\`\`

### Examples

\`\`\`
Input:  [-2, -1, 0, 2, 3]
Output: [0, 1, 4, 4, 9]
\`\`\`

\`\`\`
Input:  [-3, -1, 0, 1, 2]
Output: [0, 1, 1, 4, 9]
\`\`\`

### Brute-Force vs. Two-Pointer Thinking

\`\`\`compare
{"variant": "good-bad", "before": {"label": "Brute Force (O(n log n))", "code": "squares = [x*x for x in nums]\\nsquares.sort()\\nreturn squares"}, "after": {"label": "Two Pointers (O(n))", "code": "n = len(nums)\\nres = [0]*n\\nl, r = 0, n-1\\nfor k in reversed(range(n)):\\n    if abs(nums[l]) > abs(nums[r]):\\n        res[k] = nums[l]*nums[l]\\n        l += 1\\n    else:\\n        res[k] = nums[r]*nums[r]\\n        r -= 1\\nreturn res"}}
\`\`\`

### Algorithm Walk-Through

\`\`\`algoviz
{"title": "Two-Pointer Squaring on [-4, -1, 0, 3, 10]", "type": "array", "data": [-4, -1, 0, 3, 10], "frames": [{"highlight": [0, 4], "label": "Compare |−4| vs |10|: 10²=100 placed last", "stats": {"left": 0, "right": 4, "writeIdx": 4}}, {"highlight": [0, 3], "label": "Compare |−4| vs |3|: (−4)²=16 placed next", "stats": {"left": 0, "right": 3, "writeIdx": 3}}, {"highlight": [1, 3], "label": "Compare |−1| vs |3|: 3²=9 placed", "stats": {"left": 1, "right": 3, "writeIdx": 2}}, {"highlight": [1, 2], "label": "Compare |−1| vs |0|: (−1)²=1 placed", "stats": {"left": 1, "right": 2, "writeIdx": 1}}, {"highlight": [2], "label": "Only one element left: 0²=0 placed first", "stats": {"left": 2, "right": 2, "writeIdx": 0}}], "speed": 900}
\`\`\`

### Complexity

- **Time:** O(n) — single pass.  
- **Space:** O(n) — for the output array (required by the problem).

### Quick Check

\`\`\`quiz
{"title": "Checkpoint", "questions": [{"question": "After squaring, where do the largest values originate?", "options": ["Only the far-right positive end", "Only the far-left negative end", "Either the far-left or far-right end", "The middle of the array"], "answer": 2, "explanation": "Because squaring exaggerates large magnitudes, the biggest squares come from whichever end has the larger absolute value."}, {"question": "Why fill the result array from right to left?", "options": ["To avoid extra space", "Because we generate squares in descending order", "To keep the input unchanged", "To allow binary search"], "answer": 1, "explanation": "Each step picks the largest remaining square, so we write them in reverse sorted order."}, {"question": "What would break the two-pointer approach?", "options": ["Unsorted input", "Presence of zero", "Duplicates", "Large numbers"], "answer": 0, "explanation": "The method relies on the input being sorted so that the largest absolute values are at the ends."}]}
\`\`\`

### Key Takeaways

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Squaring can invert the order of negative numbers.", "Two pointers exploit the sorted property to achieve O(n) time.", "Always compare absolute values, then place the larger square.", "Fill the result array from right to left to avoid extra sorting."]}
\`\`\``,
      starterCode: `def make_squares(arr):
    # TODO: implement using two pointers
    pass

# Test cases
print(make_squares([-2, -1, 0, 2, 3]))  # Expected: [0, 1, 4, 4, 9]
print(make_squares([-3, -1, 0, 1, 2]))  # Expected: [0, 1, 1, 4, 9]
print(make_squares([1, 2, 3]))          # Expected: [1, 4, 9]
`,
      solutionCode: `def make_squares(arr):
    n = len(arr)
    squares = [0] * n
    left, right = 0, n - 1
    highest_index = n - 1
    while left <= right:
        left_sq = arr[left] ** 2
        right_sq = arr[right] ** 2
        if left_sq > right_sq:
            squares[highest_index] = left_sq
            left += 1
        else:
            squares[highest_index] = right_sq
            right -= 1
        highest_index -= 1
    return squares

# Test cases
print(make_squares([-2, -1, 0, 2, 3]))  # Expected: [0, 1, 4, 4, 9]
print(make_squares([-3, -1, 0, 1, 2]))  # Expected: [0, 1, 1, 4, 9]
print(make_squares([1, 2, 3]))          # Expected: [1, 4, 9]
`,
    },
    {
      id: "two-pointers-triplet-sum-zero",
      slug: "triplet-sum-to-zero",
      title: "Triplet Sum to Zero",
      content: `## Triplet Sum to Zero

### Problem Statement

Given an array of unsorted integers, find **all unique triplets** that sum to zero. The solution must not contain duplicate triplets.

\`\`\`concept
{"title": "Triplet Sum = Pair Sum + One More Pointer", "variant": "mental-model", "content": "Think of the problem as:\\n1. Fix one number \`a\`.\\n2. Reduce the remaining task to the classic “pair that sums to \`-a\`”.\\n3. Run two pointers on the sorted suffix to collect every valid pair.\\nSorting first lets us skip duplicates in O(1) time and guarantees the two-pointer scan works."}
\`\`\`

### Examples

\`\`\`
Input:  [-3, 0, 1, 2, -1, 1, -2]
Output: [[-3, 1, 2], [-2, 0, 2], [-2, 1, 1], [-1, 0, 1]]
\`\`\`

\`\`\`
Input:  [-5, 2, -1, -2, 3]
Output: [[-5, 2, 3], [-2, -1, 3]]
\`\`\`

\`\`\`
Input:  [0, 0, 0]
Output: [[0, 0, 0]]
\`\`\`

### Algorithm Walk-through

\`\`\`steps
{"title": "Step-by-step with [-3, 0, 1, 2, -1, 1, -2]", "steps": [
  {"title": "1. Sort", "content": "\`[-3, -2, -1, 0, 1, 1, 2]\` — duplicates adjacent, easy to skip."},
  {"title": "2. Fix i = 0 (value -3)", "content": "Need pair that sums to \`3\` in suffix \`[-2, -1, 0, 1, 1, 2]\`.\\nLeft at -2, Right at 2 → sum 0 → triplet [-3, -2, 2] invalid.\\nMove left → 1 + 2 = 3 ✔ → record [-3, 1, 2]."},
  {"title": "3. Fix i = 1 (value -2)", "content": "Need sum \`2\`.\\nPairs found: [-2, 0, 2] and [-2, 1, 1]."},
  {"title": "4. Skip duplicate i", "content": "Next element is another -2 → skip to avoid duplicate triplets."},
  {"title": "5. Continue until i < n-2", "content": "Total unique triplets collected: 4."}
]}
\`\`\`

### Live Demo

\`\`\`algoviz
{"title": "Two-pointer scan for triplet sum", "type": "array", "data": [-3, -2, -1, 0, 1, 1, 2], "frames": [
  {"highlight": [0], "label": "Fix i=0 (-3), target pair sum = 3", "stats": {"i": 0, "target": 3}},
  {"highlight": [1, 6], "label": "left=1 (-2), right=6 (2), sum=0 < 3 → move left", "stats": {"left": 1, "right": 6, "pairSum": 0}},
  {"highlight": [4, 6], "label": "left=4 (1), right=6 (2), pairSum=3 ✔ record [-3,1,2]", "stats": {"left": 4, "right": 6, "pairSum": 3}},
  {"highlight": [1], "label": "i=1 (-2), target = 2", "stats": {"i": 1, "target": 2}},
  {"highlight": [2, 6], "label": "left=2 (-1), right=6 (2), pairSum=1 < 2 → left++", "stats": {"left": 2, "right": 6, "pairSum": 1}},
  {"highlight": [3, 6], "label": "left=3 (0), right=6 (2), pairSum=2 ✔ record [-2,0,2]", "stats": {"left": 3, "right": 6, "pairSum": 2}},
  {"highlight": [3, 5], "label": "Shrunk right, pairSum=1 → move left", "stats": {"left": 3, "right": 5, "pairSum": 1}},
  {"highlight": [4, 5], "label": "left=4 (1), right=5 (1), pairSum=2 ✔ record [-2,1,1]", "stats": {"left": 4, "right": 5, "pairSum": 2}}
], "speed": 1000}
\`\`\`

### Implementation

\`\`\`playground
{"title": "Python: Triplet Sum to Zero", "language": "python", "code": "def triplet_sum_zero(nums):\\n    nums.sort()\\n    triplets = []\\n    n = len(nums)\\n    for i in range(n - 2):\\n        if i > 0 and nums[i] == nums[i - 1]:      # skip duplicate anchor\\n            continue\\n        left, right = i + 1, n - 1\\n        target = -nums[i]\\n        while left < right:\\n            s = nums[left] + nums[right]\\n            if s == target:\\n                triplets.append([nums[i], nums[left], nums[right]])\\n                left += 1\\n                right -= 1\\n                while left < right and nums[left] == nums[left - 1]:\\n                    left += 1\\n                while left < right and nums[right] == nums[right + 1]:\\n                    right -= 1\\n            elif s < target:\\n                left += 1\\n            else:\\n                right -= 1\\n    return triplets\\n\\n# quick test\\nprint(triplet_sum_zero([-3, 0, 1, 2, -1, 1, -2]))", "runnable": true}
\`\`\`

### Complexity Analysis

- **Time:** O(n²) — sorting O(n log n) plus n outer loops each with an O(n) two-pointer scan.  
- **Space:** O(1) auxiliary — disregarding the output list; sorting can be done in-place.

\`\`\`quiz
{"title": "Check your understanding", "questions": [
  {"question": "Why do we sort the array first?", "options": ["To use binary search", "To enable the two-pointer technique and skip duplicates easily", "To reduce space usage", "To balance the tree"], "answer": 1, "explanation": "Sorting lets us run two pointers inward and detect duplicates in O(1) time."},
  {"question": "What is the purpose of skipping \`nums[i] == nums[i-1]\`?", "options": ["To save comparisons", "To avoid duplicate triplets anchored at the same value", "To speed up the inner while loop", "To handle negative numbers"], "answer": 1, "explanation": "The outer loop anchor must be unique; otherwise we would regenerate the same triplet set."},
  {"question": "If the input has only positive numbers, the output will be:", "options": "All possible triplets | Exactly one triplet | Empty list | Cannot determine", "options": ["All possible triplets", "Exactly one triplet", "Empty list", "Cannot determine"], "answer": 2, "explanation": "Three positive numbers cannot sum to zero, so no triplets satisfy the condition."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Sort first so two pointers can run inward in O(n) time per anchor.",
  "Fix one value, then solve the remaining pair-sum-to-target sub-problem.",
  "Skip duplicate anchors and duplicate pointer values to ensure uniqueness.",
  "Overall complexity is O(n²) time and O(1) extra space — optimal for this problem."
]}
\`\`\``,
      starterCode: `def search_triplets(arr):
    # TODO: implement using sort + two pointers
    pass

# Test cases
print(search_triplets([-3, 0, 1, 2, -1, 1, -2]))
# Expected: [[-3, 1, 2], [-2, 0, 2], [-2, 1, 1], [-1, 0, 1]]

print(search_triplets([-5, 2, -1, -2, 3]))
# Expected: [[-5, 2, 3], [-2, -1, 3]]

print(search_triplets([0, 0, 0]))
# Expected: [[0, 0, 0]]
`,
      solutionCode: `def search_triplets(arr):
    arr.sort()
    triplets = []
    for i in range(len(arr) - 2):
        if i > 0 and arr[i] == arr[i - 1]:
            continue  # skip duplicate for i
        left, right = i + 1, len(arr) - 1
        while left < right:
            total = arr[i] + arr[left] + arr[right]
            if total == 0:
                triplets.append([arr[i], arr[left], arr[right]])
                left += 1
                right -= 1
                while left < right and arr[left] == arr[left - 1]:
                    left += 1
                while left < right and arr[right] == arr[right + 1]:
                    right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return triplets

# Test cases
print(search_triplets([-3, 0, 1, 2, -1, 1, -2]))
# Expected: [[-3, 1, 2], [-2, 0, 2], [-2, 1, 1], [-1, 0, 1]]

print(search_triplets([-5, 2, -1, -2, 3]))
# Expected: [[-5, 2, 3], [-2, -1, 3]]

print(search_triplets([0, 0, 0]))
# Expected: [[0, 0, 0]]
`,
    },
    {
      id: "two-pointers-dutch-national-flag",
      slug: "dutch-national-flag",
      title: "Dutch National Flag",
      content: `## Dutch National Flag Problem

### Problem Statement

Given an array containing only **0s, 1s, and 2s**, sort it **in-place** so that all 0s come first, then all 1s, then all 2s. You must do this in a single pass.

This is known as the Dutch National Flag problem, originally proposed by Edsger Dijkstra.

### Examples

\`\`\`
Input:  [1, 0, 2, 1, 0]
Output: [0, 0, 1, 1, 2]
\`\`\`

\`\`\`
Input:  [2, 2, 0, 1, 2, 0]
Output: [0, 0, 1, 2, 2, 2]
\`\`\`

\`\`\`
Input:  [0, 0, 0]
Output: [0, 0, 0]
\`\`\`

### Three-Pointer Technique

\`\`\`concept
{
  "title": "The Three-Pointer Strategy",
  "variant": "mental-model",
  "content": "Imagine the array as three zones separated by invisible boundaries:\\n\\n- **0s Zone** (left): All elements before index \`low\` are 0s\\n- **1s Zone** (middle): All elements between \`low\` and \`mid-1\` are 1s  \\n- **Unsorted Zone** (center): Elements between \`mid\` and \`high\` are unknown\\n- **2s Zone** (right): All elements after index \`high\` are 2s\\n\\nThe \`mid\` pointer scans through the unsorted zone, classifying each element and expanding the appropriate zone. This maintains the invariant that the array is always partially sorted during the entire process."
}
\`\`\`

\`\`\`algoviz
{
  "title": "Dutch National Flag Algorithm",
  "type": "array",
  "data": [1, 0, 2, 1, 0],
  "frames": [
    {"highlight": [0,1,2,3,4], "label": "Initial: low=0, mid=0, high=4", "stats": {"low": 0, "mid": 0, "high": 4}},
    {"highlight": [0], "label": "arr[mid]=1 → just move mid", "stats": {"low": 0, "mid": 1, "high": 4}},
    {"highlight": [1], "label": "arr[mid]=0 → swap with low, advance both", "stats": {"low": 1, "mid": 2, "high": 4}},
    {"highlight": [2], "label": "arr[mid]=2 → swap with high, decrement high", "stats": {"low": 1, "mid": 2, "high": 3}},
    {"highlight": [2], "label": "arr[mid]=1 → just move mid", "stats": {"low": 1, "mid": 3, "high": 3}},
    {"highlight": [3], "label": "arr[mid]=0 → swap with low, advance both", "stats": {"low": 2, "mid": 4, "high": 3}},
    {"highlight": [], "label": "mid > high → done!", "stats": {"low": 2, "mid": 4, "high": 3}}
  ],
  "speed": 1000
}
\`\`\`

### Algorithm Steps

\`\`\`steps
{
  "title": "Implementing the Three-Way Partition",
  "steps": [
    {
      "title": "Initialize Pointers",
      "content": "Set \`low = 0\`, \`mid = 0\`, and \`high = n - 1\`. These represent the boundaries of our three zones."
    },
    {
      "title": "Process Each Element",
      "content": "While \`mid <= high\`:\\n- If \`arr[mid] == 0\`: Swap with \`arr[low]\`, then increment both \`low\` and \`mid\`\\n- If \`arr[mid] == 1\`: Just increment \`mid\` (element is already in correct zone)\\n- If \`arr[mid] == 2\`: Swap with \`arr[high]\`, then decrement \`high\` (don't increment \`mid\` because the swapped value needs inspection)"
    },
    {
      "title": "Termination",
      "content": "When \`mid > high\`, all elements have been processed. The array is now sorted with all 0s first, then 1s, then 2s."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Dutch National Flag Implementation",
  "language": "python",
  "code": "def dutch_flag_sort(arr):\\n    \\"\\"\\"\\n    Sort an array of 0s, 1s, and 2s in a single pass.\\n    Time: O(n), Space: O(1)\\n    \\"\\"\\"\\n    low = 0\\n    mid = 0\\n    high = len(arr) - 1\\n    \\n    while mid <= high:\\n        if arr[mid] == 0:\\n            # Swap with low boundary and expand 0s zone\\n            arr[low], arr[mid] = arr[mid], arr[low]\\n            low += 1\\n            mid += 1\\n        elif arr[mid] == 1:\\n            # Already in correct zone, just move forward\\n            mid += 1\\n        else:  # arr[mid] == 2\\n            # Swap with high boundary and expand 2s zone\\n            arr[mid], arr[high] = arr[high], arr[mid]\\n            high -= 1\\n            # Don't increment mid - need to inspect swapped value\\n    \\n    return arr\\n\\n# Test the implementation\\ntest_cases = [\\n    [1, 0, 2, 1, 0],\\n    [2, 2, 0, 1, 2, 0],\\n    [0, 0, 0],\\n    [2, 1, 0]\\n]\\n\\nfor arr in test_cases:\\n    original = arr.copy()\\n    result = dutch_flag_sort(arr)\\n    print(f\\"{original} → {result}\\")",
  "runnable": true
}
\`\`\`

### Why This Works

\`\`\`concept
{
  "title": "The Key Insight",
  "variant": "insight",
  "content": "The algorithm works because we maintain four invariants throughout execution:\\n\\n1. **Elements before \`low\` are all 0s** (0s zone is complete)\\n2. **Elements from \`low\` to \`mid-1\` are all 1s** (1s zone is complete)\\n3. **Elements from \`mid\` to \`high\` are unsorted** (unknown territory)\\n4. **Elements after \`high\` are all 2s** (2s zone is complete)\\n\\nBy processing each element and expanding the appropriate zone, we guarantee that when \`mid\` passes \`high\`, the entire array is sorted. The critical detail: when we swap a 2 to the end, we don't advance \`mid\` because the swapped value could be 0, 1, or 2 and needs inspection."
}
\`\`\`

### Complexity Analysis

- **Time:** O(n) — single pass through the array
- **Space:** O(1) — only using three pointer variables

\`\`\`quiz
{
  "title": "Dutch National Flag Mastery",
  "questions": [
    {
      "question": "Why don't we increment \`mid\` after swapping a 2 with \`arr[high]\`?",
      "options": [
        "Because we need to check the swapped value",
        "Because \`high\` is already decremented",
        "Because it's a bug in the algorithm",
        "Because we want to save operations"
      ],
      "answer": 0,
      "explanation": "When we swap \`arr[mid]\` (which is 2) with \`arr[high]\`, the value that comes to position \`mid\` could be 0, 1, or 2. We need to inspect this swapped value to determine the correct action, so we don't increment \`mid\`."
    },
    {
      "question": "What would happen if we used a standard sorting algorithm like quicksort instead?",
      "options": [
        "It would be faster",
        "It would have O(n log n) time complexity",
        "It would use less space",
        "It would handle edge cases better"
      ],
      "answer": 1,
      "explanation": "General-purpose sorting algorithms like quicksort have O(n log n) average time complexity, while the Dutch National Flag algorithm solves this specific problem in O(n) time by exploiting the constraint that we only have three distinct values."
    },
    {
      "question": "In the three-pointer approach, what do the pointers \`low\`, \`mid\`, and \`high\` represent?",
      "options": [
        "Three arbitrary positions in the array",
        "Boundaries between 0s, 1s, 2s, and unsorted regions",
        "The minimum, median, and maximum values",
        "Start, middle, and end of the array"
      ],
      "answer": 1,
      "explanation": "\`low\` separates the 0s zone from the 1s zone, \`mid\` is the current element being processed in the unsorted region, and \`high\` separates the unsorted region from the 2s zone. Together they maintain the three-way partition invariant."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The Dutch National Flag algorithm sorts an array of three distinct values in O(n) time and O(1) space",
    "Three pointers (low, mid, high) maintain four zones: 0s, 1s, unsorted, and 2s",
    "The critical insight: don't advance mid after swapping with high - the swapped value needs inspection",
    "This technique is fundamental to three-way partitioning in optimized quicksort implementations",
    "The algorithm demonstrates how constraints (only three values) enable specialized efficient solutions"
  ]
}
\`\`\``,
      starterCode: `def dutch_flag_sort(arr):
    # TODO: implement using three pointers
    pass

# Test cases
arr1 = [1, 0, 2, 1, 0]
dutch_flag_sort(arr1)
print(arr1)  # Expected: [0, 0, 1, 1, 2]

arr2 = [2, 2, 0, 1, 2, 0]
dutch_flag_sort(arr2)
print(arr2)  # Expected: [0, 0, 1, 2, 2, 2]

arr3 = [0, 0, 0]
dutch_flag_sort(arr3)
print(arr3)  # Expected: [0, 0, 0]
`,
      solutionCode: `def dutch_flag_sort(arr):
    low, mid, high = 0, 0, len(arr) - 1
    while mid <= high:
        if arr[mid] == 0:
            arr[low], arr[mid] = arr[mid], arr[low]
            low += 1
            mid += 1
        elif arr[mid] == 1:
            mid += 1
        else:
            arr[mid], arr[high] = arr[high], arr[mid]
            high -= 1

# Test cases
arr1 = [1, 0, 2, 1, 0]
dutch_flag_sort(arr1)
print(arr1)  # Expected: [0, 0, 1, 1, 2]

arr2 = [2, 2, 0, 1, 2, 0]
dutch_flag_sort(arr2)
print(arr2)  # Expected: [0, 0, 1, 2, 2, 2]

arr3 = [0, 0, 0]
dutch_flag_sort(arr3)
print(arr3)  # Expected: [0, 0, 0]
`,
    },
  ],
};
