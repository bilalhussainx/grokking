import { Module } from "../types";

export const twoPointersModule: Module = {
  id: "two-pointers",
  title: "Two Pointers",
  description: "Master the two pointers technique to efficiently solve problems involving sorted arrays, pair searching, and in-place array manipulation. This pattern reduces time complexity from O(n²) to O(n).",
  lessons: [
    {
      id: "two-pointers-intro",
      slug: "two-pointers-intro",
      title: "Introduction to Two Pointers",
      content: `## The Two Pointers Pattern

\`\`\`concept
{ "title": "Two Pointers Mental Model", "variant": "mental-model", "content": "Two pointers are two index variables that traverse a data structure — typically a sorted array — either toward each other, in the same direction, or from opposite ends. Instead of checking every possible pair with nested loops (O(n²)), they exploit sorted order to eliminate entire regions of the search space at each step, achieving O(n) time and O(1) space." }
\`\`\`

The central question two pointers answers: **how do we find pairs (or subarrays) satisfying a condition without checking every combination?**

### Why Not Just Use Nested Loops?

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute force (nested loops) | O(n²) | O(1) | Checks all pairs — slow |
| Hash map | O(n) | O(n) | Fast but uses extra memory |
| **Two pointers** | **O(n)** | **O(1)** | Fast *and* no extra memory |

Two pointers matches the hash map's speed while using only constant extra space — exactly what interviewers want to see when the input is already sorted.

### How It Works: Step by Step

\`\`\`steps
{ "title": "Opposite-Direction Two Pointers", "steps": [ { "title": "Initialize", "content": "Place \`left\` at index 0 and \`right\` at the last index. These two indices represent the pair you are currently evaluating." }, { "title": "Evaluate the pair", "content": "Compute the sum (or whatever condition applies). Compare it to the target." }, { "title": "Sum too small? Move left →", "content": "Incrementing \`left\` increases the sum — because the array is sorted, every element to the right of \`left\` is strictly larger. All pairs involving the current \`arr[left]\` are already too small, so safely skip them." }, { "title": "Sum too large? Move right ←", "content": "Decrementing \`right\` decreases the sum — every element to the left of \`right\` is strictly smaller. All pairs involving the current \`arr[right]\` are already too large, so safely skip them." }, { "title": "Terminate", "content": "Stop when \`left >= right\`. If the pointers cross without a match, no valid pair exists." } ] }
\`\`\`

### Watch It Run

The sorted array is \`[1, 2, 4, 6, 8, 11, 14]\` and we want the pair that sums to **13**:

\`\`\`algoviz
{ "title": "Find Pair Summing to 13", "type": "array", "data": [1, 2, 4, 6, 8, 11, 14], "frames": [ { "highlight": [0, 6], "label": "left=0, right=6 → 1+14=15 > 13 — move right inward", "stats": { "left": 0, "right": 6, "sum": 15 } }, { "highlight": [0, 5], "label": "left=0, right=5 → 1+11=12 < 13 — move left outward", "stats": { "left": 0, "right": 5, "sum": 12 } }, { "highlight": [1, 5], "label": "left=1, right=5 → 2+11=13 = target ✓ Pair found!", "stats": { "left": 1, "right": 5, "sum": 13 } } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why No Valid Pair Is Ever Skipped", "content": "Think of all pairs as a 2-D matrix where row = left index, column = right index. Each pointer move eliminates an entire row or column: moving left discards all pairs (arr[left], arr[j]) for every j, because they are all too small. Moving right discards all pairs (arr[i], arr[right]) for every i, because they are all too large. The two pointers trace a staircase path through this matrix, never revisiting a cell." }
\`\`\`

### Three Variants

\`\`\`tabs
{ "tabs": [ { "label": "Opposite Direction", "icon": "↔️", "content": "**Converging pointers** — start at opposite ends, walk toward each other.\\n\\nBest for: pair/triplet sum, palindrome checking, container with most water.\\n\\n\`\`\`python\\ndef has_pair_with_sum(nums, target):\\n    left, right = 0, len(nums) - 1\\n    while left < right:\\n        s = nums[left] + nums[right]\\n        if s == target:\\n            return True\\n        elif s < target:\\n            left += 1\\n        else:\\n            right -= 1\\n    return False\\n\`\`\`" }, { "label": "Same Direction", "icon": "→→", "content": "**Fast & slow (read/write) pointers** — both start at one end; the fast pointer races ahead.\\n\\nBest for: removing duplicates in-place, sliding windows, in-place partitioning.\\n\\n\`\`\`python\\ndef remove_duplicates(nums):\\n    write = 1\\n    for read in range(1, len(nums)):\\n        if nums[read] != nums[read - 1]:\\n            nums[write] = nums[read]\\n            write += 1\\n    return write  # length of deduplicated prefix\\n\`\`\`" }, { "label": "Three Pointers", "icon": "🔺", "content": "**Three-index extension** — used for 3Sum and Dutch National Flag sorting.\\n\\nBest for: triplet problems, in-place sorting of 0s/1s/2s.\\n\\n\`\`\`python\\ndef sort_colors(nums):\\n    low, mid, high = 0, 0, len(nums) - 1\\n    while mid <= high:\\n        if nums[mid] == 0:\\n            nums[low], nums[mid] = nums[mid], nums[low]\\n            low += 1; mid += 1\\n        elif nums[mid] == 1:\\n            mid += 1\\n        else:\\n            nums[mid], nums[high] = nums[high], nums[mid]\\n            high -= 1\\n\`\`\`" } ] }
\`\`\`

### When to Reach for Two Pointers

Recognise these signals in a problem statement:

- The input is **sorted** (or can be sorted without worsening the target complexity).
- You need to find a **pair, triplet, or subarray** satisfying a sum or difference constraint.
- You need to **modify an array in-place** — partition, remove duplicates, move zeros.
- You need to check **symmetry or palindromes**.

\`\`\`callout
{ "type": "warning", "title": "The Sorting Penalty", "content": "If the input is unsorted and you must sort it first, you pay O(n log n) upfront. The two-pointer scan itself is still O(n), so the combined complexity is O(n log n) — still a major improvement over O(n²), but no longer strictly linear." }
\`\`\`

### Complexity Summary

| Property | Value |
|----------|-------|
| Time complexity | O(n) — each pointer moves at most n steps total |
| Space complexity | O(1) — only two index variables |
| Hard requirement | Sorted input (or an acceptable O(n log n) sort first) |

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "An unsorted array is sorted first (O(n log n)), then scanned with two pointers (O(n)). What is the overall time complexity?", "options": ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], "answer": 1, "explanation": "The sort dominates: O(n log n) + O(n) = O(n log n). The two-pointer phase is linear but the sort sets the ceiling." }, { "question": "In the opposite-direction variant on a sorted array, when is it correct to increment the left pointer?", "options": ["When arr[left] + arr[right] equals the target", "When arr[left] + arr[right] exceeds the target", "When arr[left] + arr[right] is less than the target", "When left equals right − 1"], "answer": 2, "explanation": "If the current sum is too small we need a larger value. Moving left rightward increases the sum. Every pair pairing arr[left] with anything ≤ arr[right] is already too small, so we safely discard them all at once." }, { "question": "Which variant is the natural fit for removing duplicates from a sorted array in-place with O(1) extra space?", "options": ["Opposite-direction (converging)", "Same-direction (fast/slow read-write)", "Three-pointer (low/mid/high)", "None — a hash set is required"], "answer": 1, "explanation": "The same-direction read/write pattern lets a fast 'read' pointer scan ahead while a slow 'write' pointer tracks the last unique value written. This achieves O(n) time and O(1) space with no extra memory." }, { "question": "What is the space complexity of a standard two-pointer solution?", "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"], "answer": 3, "explanation": "Two pointers uses only two index variables regardless of input size — constant O(1) extra space. This is one of its key advantages over hash-map based approaches." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Two pointers reduce pair-search problems from O(n²) to O(n) time with O(1) space by exploiting sorted order.", "Opposite-direction pointers converge from both ends — the go-to for pair sums, palindromes, and water-trapping problems.", "Same-direction (fast/slow) pointers are ideal for in-place operations like removing duplicates and partitioning.", "Each pointer move eliminates an entire row or column of the implicit pair matrix — no valid pair is ever skipped.", "Sorting an unsorted input first costs O(n log n), making the total O(n log n) — still far better than O(n²)." ] }
\`\`\``,
    },
    {
      id: "pair-with-target-sum",
      slug: "pair-with-target-sum",
      title: "Pair with Target Sum",
      content: `## Pair with Target Sum

<!-- voice:section_check concept="opposite-direction two pointers" -->

\`\`\`concept
{
  "title": "Opposite-Direction Two Pointers",
  "variant": "mental-model",
  "content": "Place one pointer at the start and one at the end of a sorted array. Compute their sum. If it matches the target — done. If too small, move the left pointer right (need a bigger number). If too large, move the right pointer left (need a smaller number). Each move permanently eliminates at least one element from consideration, so you check at most n pairs instead of n(n-1)/2."
}
\`\`\`

### Problem Statement

Given a **sorted** array of integers and a target sum, find **two numbers** that add up to the target. Return their **indices** \`[i, j]\` where \`i < j\`. If no valid pair exists, return \`[-1, -1]\`.

| Input | Target | Output | Explanation |
|-------|--------|--------|-------------|
| \`[1, 2, 3, 4, 6]\` | \`6\` | \`[1, 3]\` | \`arr[1] + arr[3] = 2 + 4 = 6\` |
| \`[2, 5, 9, 11]\` | \`11\` | \`[0, 2]\` | \`arr[0] + arr[2] = 2 + 9 = 11\` |
| \`[1, 2, 3]\` | \`7\` | \`[-1, -1]\` | No valid pair exists |

---

### Brute Force vs Two Pointers

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naive — O(n²) nested loops",
    "code": "def pair_sum_naive(arr, target):\\n    for i in range(len(arr)):\\n        for j in range(i + 1, len(arr)):\\n            if arr[i] + arr[j] == target:\\n                return [i, j]\\n    return [-1, -1]"
  },
  "after": {
    "label": "Two Pointers — O(n) single pass",
    "code": "def pair_sum(arr, target):\\n    left, right = 0, len(arr) - 1\\n    while left < right:\\n        current_sum = arr[left] + arr[right]\\n        if current_sum == target:\\n            return [left, right]\\n        elif current_sum < target:\\n            left += 1\\n        else:\\n            right -= 1\\n    return [-1, -1]"
  }
}
\`\`\`

The nested approach checks every possible pair — n(n-1)/2 comparisons. The two-pointer approach exploits sorted order to skip entire swaths of impossible pairs in a single pass.

---

### Watch the Algorithm Execute

Watch the pointers close in on \`arr = [1, 2, 3, 4, 6]\`, \`target = 6\`:

\`\`\`algoviz
{
  "title": "Pair with Target Sum — arr=[1,2,3,4,6], target=6",
  "type": "array",
  "data": [1, 2, 3, 4, 6],
  "frames": [
    {
      "highlight": [0, 4],
      "label": "left=0 (val 1), right=4 (val 6). Sum = 7 > 6. Too large — move right pointer left.",
      "stats": { "left": 0, "right": 4, "sum": 7, "target": 6 }
    },
    {
      "highlight": [0, 3],
      "label": "left=0 (val 1), right=3 (val 4). Sum = 5 < 6. Too small — move left pointer right.",
      "stats": { "left": 0, "right": 3, "sum": 5, "target": 6 }
    },
    {
      "highlight": [1, 3],
      "label": "left=1 (val 2), right=3 (val 4). Sum = 6 == target! Return [1, 3].",
      "stats": { "left": 1, "right": 3, "sum": 6, "target": 6 }
    }
  ],
  "speed": 900
}
\`\`\`

---

### Step-by-Step Algorithm

\`\`\`steps
{
  "title": "Two-Pointer Pair Sum",
  "steps": [
    {
      "title": "Initialise pointers",
      "content": "Set \`left = 0\` (start of array) and \`right = len(arr) - 1\` (end of array). The array **must be sorted** — the pointer logic relies entirely on this property."
    },
    {
      "title": "Compute the current sum",
      "content": "In each iteration, calculate \`current_sum = arr[left] + arr[right]\`."
    },
    {
      "title": "Adjust based on comparison",
      "content": "- **Equal to target:** return \`[left, right]\` — pair found.\\n- **Less than target:** \`left += 1\`. Moving right picks a larger value, increasing the sum.\\n- **Greater than target:** \`right -= 1\`. Moving left picks a smaller value, decreasing the sum."
    },
    {
      "title": "Repeat until pointers cross",
      "content": "Continue while \`left < right\`. Once they meet, every valid pair has been checked. Return \`[-1, -1]\`."
    }
  ]
}
\`\`\`

---

### Why This Is Correct (No Pair Is Ever Skipped)

\`\`\`collapse
{
  "title": "Deep Dive: Proof That We Never Miss a Valid Pair",
  "content": "Suppose we are at position \`(left, right)\` and \`arr[left] + arr[right] > target\`.\\n\\nBecause the array is sorted, every element to the **left** of \`right\` is ≤ \`arr[right]\`. If pairing the **smallest** available left value (\`arr[left]\`) with \`arr[right]\` already overshoots the target, then *no* element on the left can pair with \`arr[right]\` to reach it. We can safely discard \`right\` — hence \`right -= 1\`.\\n\\nThe symmetric argument applies when the sum is too small: \`arr[left]\` is too small to partner with anything remaining on the right, so we discard it via \`left += 1\`.\\n\\nAt each step we eliminate at least one element from further consideration. With at most **n** eliminations before the pointers cross, the algorithm runs in O(n) time and is guaranteed to find any valid pair that exists."
}
\`\`\`

---

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

### Try It Yourself

\`\`\`playground
{
  "title": "Pair with Target Sum",
  "language": "python",
  "code": "def pair_with_target_sum(arr, target):\\n    left, right = 0, len(arr) - 1\\n    while left < right:\\n        current_sum = arr[left] + arr[right]\\n        if current_sum == target:\\n            return [left, right]\\n        elif current_sum < target:\\n            left += 1\\n        else:\\n            right -= 1\\n    return [-1, -1]\\n\\nprint(pair_with_target_sum([1, 2, 3, 4, 6], 6))   # [1, 3]\\nprint(pair_with_target_sum([2, 5, 9, 11], 11))      # [0, 2]\\nprint(pair_with_target_sum([1, 2, 3], 7))           # [-1, -1]",
  "runnable": true
}
\`\`\`

---

### Complexity

| | Complexity | Reason |
|-|-----------|--------|
| **Time** | O(n) | Each pointer moves at most n steps inward; together they traverse the array once |
| **Space** | O(1) | Only two index variables — no auxiliary data structures |

\`\`\`callout
{
  "type": "warning",
  "title": "Sorted Array Is Required",
  "content": "This pattern only works because sorted order guarantees that moving a pointer in one direction monotonically changes the sum. For unsorted arrays you can sort first (O(n log n)) or use a hash set to achieve O(n) without sorting — though the hash set approach uses O(n) space."
}
\`\`\`

---

### Check Your Understanding

\`\`\`quiz
{
  "title": "Pair with Target Sum",
  "questions": [
    {
      "question": "Given arr = [1, 3, 5, 7, 9] and target = 12, what does the algorithm return?",
      "options": [
        "[0, 4] — 1 + 9 = 10",
        "[1, 4] — 3 + 9 = 12",
        "[2, 3] — 5 + 7 = 12",
        "[1, 3] — 3 + 7 = 10"
      ],
      "answer": 1,
      "explanation": "Starting at left=0, right=4: sum=1+9=10 < 12, so left moves to 1. Now left=1, right=4: sum=3+9=12 == target. The algorithm returns [1, 4]. Note that [2,3] also sums to 12, but the pointers reach [1,4] first."
    },
    {
      "question": "Why do we move the LEFT pointer right when the current sum is less than the target?",
      "options": [
        "To access a smaller value and reduce the sum",
        "To access a larger value and increase the sum",
        "To prevent the two pointers from crossing",
        "Because the right side of the array has already been searched"
      ],
      "answer": 1,
      "explanation": "The array is sorted in ascending order. Moving the left pointer one step right increases arr[left], which raises the pair sum closer to the target. Moving it left would only make the sum smaller."
    },
    {
      "question": "What is the time complexity of the two-pointer approach compared to the brute-force nested loop?",
      "options": [
        "Both are O(n²)",
        "Two pointers: O(n log n) vs brute force: O(n²)",
        "Two pointers: O(n) vs brute force: O(n²)",
        "Two pointers: O(log n) vs brute force: O(n)"
      ],
      "answer": 2,
      "explanation": "The two pointers move at most n steps combined before crossing — O(n) total. The brute-force checks all n(n-1)/2 pairs — O(n²). The sorted property is what allows the two-pointer approach to skip pairs without checking them."
    },
    {
      "question": "The algorithm returns [-1, -1] when:",
      "options": [
        "The target is larger than the maximum element",
        "The array has an odd number of elements",
        "The left and right pointers cross without finding a matching pair",
        "All elements in the array are the same"
      ],
      "answer": 2,
      "explanation": "The while loop condition is \`left < right\`. When the pointers meet or cross, every distinct pair (i, j) with i < j has been considered exactly once. If none matched the target, we return [-1, -1]."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Start one pointer at each end of the sorted array and converge them inward based on whether the current sum is too small or too large.",
    "Each pointer movement eliminates at least one element from further consideration — reducing O(n²) brute-force to an O(n) single pass.",
    "The sorted property is essential: it guarantees that moving a pointer in one direction monotonically increases or decreases the pair sum.",
    "Space complexity is O(1) — only two index variables are needed regardless of input size.",
    "This same pattern extends to three-sum, closest-pair, and container-with-most-water problems — any scenario that searches for combinations within sorted data."
  ]
}
\`\`\``,
      starterCode: `def pair_with_target_sum(arr, target):
    """
    Find two numbers in a sorted array that add up to target.
    
    Args:
        arr: Sorted list of integers
        target: Target sum
    
    Returns:
        List of two indices [i, j] where arr[i] + arr[j] == target,
        or [-1, -1] if no such pair exists
    
    Example:
        >>> pair_with_target_sum([1, 2, 3, 4, 6], 6)
        [1, 3]
    """
    # TODO: Use two pointers starting at opposite ends
    # Hint: Move pointers based on whether current sum is too small or too large
    pass


# ─── Test Cases ───
# Do not modify below this line

# Normal case
print(pair_with_target_sum([1, 2, 3, 4, 6], 6))
# Expected: [1, 3]

# Different target
print(pair_with_target_sum([2, 5, 9, 11], 11))
# Expected: [0, 2]

# No solution exists
print(pair_with_target_sum([1, 2, 3], 7))
# Expected: [-1, -1]

# Edge case: single element
print(pair_with_target_sum([5], 5))
# Expected: [-1, -1]
`,
      solutionCode: `def pair_with_target_sum(arr, target):
    """
    Find two numbers in a sorted array that add up to target.
    
    Time Complexity: O(n) — each pointer moves at most n steps
    Space Complexity: O(1) — no extra data structures
    """
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            # Sum is too small, need larger values → move left right
            left += 1
        else:
            # Sum is too large, need smaller values → move right left
            right -= 1
    
    return [-1, -1]


# ─── Test Cases ───
print(pair_with_target_sum([1, 2, 3, 4, 6], 6))
# Expected: [1, 3]

print(pair_with_target_sum([2, 5, 9, 11], 11))
# Expected: [0, 2]

print(pair_with_target_sum([1, 2, 3], 7))
# Expected: [-1, -1]

print(pair_with_target_sum([5], 5))
# Expected: [-1, -1]
`,
    },
    {
      id: "remove-duplicates",
      slug: "remove-duplicates",
      title: "Remove Duplicates",
      content: `## Remove Duplicates from Sorted Array

Given a **sorted** array, remove all duplicate values **in-place** so each element appears exactly once. Return \`k\` — the count of unique elements. The first \`k\` slots of the array must hold those unique values.

\`\`\`concept
{ "title": "Same-Direction Two Pointers: Read/Write Pattern", "variant": "mental-model", "content": "Picture two workers on an assembly line moving left to right. The **slow (write) pointer** places verified unique items. The **fast (read) pointer** inspects every incoming element. When the reader finds something new, it hands it to the writer. When it finds a duplicate, the writer stays put and the reader moves on alone. At the end, the write pointer's position tells you how many unique items were placed." }
\`\`\`

### The Examples

| Input | Expected \`k\` | Array after (first \`k\` slots) |
|---|---|---|
| \`[2, 3, 3, 3, 6, 9, 9]\` | 4 | \`[2, 3, 6, 9, ...]\` |
| \`[2, 2, 2, 11]\` | 2 | \`[2, 11, ...]\` |

### Algorithm in Motion

Watch \`slow\` and \`fast\` work through \`[2, 3, 3, 3, 6, 9, 9]\`:

\`\`\`algoviz
{ "title": "Remove Duplicates — slow/fast on [2, 3, 3, 3, 6, 9, 9]", "type": "array", "data": [2, 3, 3, 3, 6, 9, 9], "frames": [ { "highlight": [0, 1], "label": "slow=0, fast=1. nums[1]=3 ≠ nums[0]=2 — new unique found!", "stats": {"slow": 0, "fast": 1} }, { "highlight": [0, 1], "label": "slow++ → slow=1. Write nums[fast]=3 to nums[slow]. Unique zone: [2, 3]", "stats": {"slow": 1, "fast": 1, "unique_count": 2} }, { "highlight": [1, 2], "label": "fast=2: nums[2]=3 == nums[slow=1]=3 — duplicate! slow stays, fast advances.", "stats": {"slow": 1, "fast": 2} }, { "highlight": [1, 3], "label": "fast=3: nums[3]=3 == nums[slow=1]=3 — another duplicate. slow stays.", "stats": {"slow": 1, "fast": 3} }, { "highlight": [1, 4], "label": "fast=4: nums[4]=6 ≠ nums[slow=1]=3 — new unique found!", "stats": {"slow": 1, "fast": 4} }, { "highlight": [2, 4], "label": "slow++ → slow=2. Write 6 to nums[2]. Unique zone: [2, 3, 6]", "stats": {"slow": 2, "fast": 4, "unique_count": 3} }, { "highlight": [2, 5], "label": "fast=5: nums[5]=9 ≠ nums[slow=2]=6 — new unique!", "stats": {"slow": 2, "fast": 5} }, { "highlight": [3, 5], "label": "slow++ → slow=3. Write 9 to nums[3]. Unique zone: [2, 3, 6, 9]", "stats": {"slow": 3, "fast": 5, "unique_count": 4} }, { "highlight": [3, 6], "label": "fast=6: nums[6]=9 == nums[slow=3]=9 — duplicate, done scanning.", "stats": {"slow": 3, "fast": 6} }, { "highlight": [0, 1, 2, 3], "label": "Return slow + 1 = 4. First 4 elements are the unique values: [2, 3, 6, 9].", "stats": {"result": 4} } ], "speed": 850 }
\`\`\`

### Implementation

\`\`\`tabs
{ "tabs": [ { "label": "Python", "icon": "🐍", "content": "\`\`\`python\\ndef remove_duplicates(nums: list[int]) -> int:\\n    if not nums:\\n        return 0\\n\\n    slow = 0  # write pointer — last confirmed unique index\\n\\n    for fast in range(1, len(nums)):\\n        if nums[fast] != nums[slow]:  # new unique found\\n            slow += 1\\n            nums[slow] = nums[fast]\\n\\n    return slow + 1\\n\\n# nums = [2, 3, 3, 3, 6, 9, 9]\\n# -> returns 4, array becomes [2, 3, 6, 9, ...]\\n\`\`\`" }, { "label": "JavaScript", "icon": "🟨", "content": "\`\`\`javascript\\nfunction removeDuplicates(nums) {\\n    if (nums.length === 0) return 0;\\n\\n    let slow = 0; // write pointer\\n\\n    for (let fast = 1; fast < nums.length; fast++) {\\n        if (nums[fast] !== nums[slow]) {\\n            slow++;\\n            nums[slow] = nums[fast];\\n        }\\n    }\\n\\n    return slow + 1;\\n}\\n\`\`\`" }, { "label": "Java", "icon": "☕", "content": "\`\`\`java\\npublic int removeDuplicates(int[] nums) {\\n    if (nums.length == 0) return 0;\\n\\n    int slow = 0; // write pointer\\n\\n    for (int fast = 1; fast < nums.length; fast++) {\\n        if (nums[fast] != nums[slow]) {\\n            slow++;\\n            nums[slow] = nums[fast];\\n        }\\n    }\\n\\n    return slow + 1;\\n}\\n\`\`\`" } ] }
\`\`\`

### The Classic Mistake

The most common bug: comparing against \`nums[slow]\` *before* advancing it — reading a slot that hasn't been written yet.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Wrong — comparing with nums[write_index] (the unwritten slot)", "code": "for fast in range(1, len(nums)):\\n    # WRONG: nums[write_index] hasn't been finalized.\\n    # After the write, nums[write_index] IS the new value —\\n    # so the next element always looks 'different'.\\n    if nums[fast] != nums[write_index]:\\n        nums[write_index] = nums[fast]\\n        write_index += 1" }, "after": { "label": "Correct — compare with nums[slow] (the last placed unique)", "code": "for fast in range(1, len(nums)):\\n    # RIGHT: nums[slow] is the last confirmed unique value.\\n    # Advance slow first, then overwrite — order matters.\\n    if nums[fast] != nums[slow]:\\n        slow += 1\\n        nums[slow] = nums[fast]" } }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why does sorting matter?", "content": "Because the array is sorted, all copies of any value are **contiguous** — they sit right next to each other. That means a single comparison against \`nums[slow]\` (the most recent unique) is always sufficient to detect a duplicate. On an unsorted array the same value could appear anywhere, and this single-pass strategy would fail." }
\`\`\`

### Complexity

| | Complexity | Why |
|---|---|---|
| **Time** | O(n) | \`fast\` visits each element exactly once in a single pass |
| **Space** | O(1) | All writes are in-place — no auxiliary array needed |

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "You call remove_duplicates([1, 1, 1, 1]). What is returned?", "options": ["0", "1", "4", "The function errors on an all-duplicate array"], "answer": 1, "explanation": "There is exactly one unique value. slow stays at index 0 throughout — fast scans every element but never finds a value different from nums[0]. The function returns slow + 1 = 1." }, { "question": "When nums[fast] equals nums[slow], what happens to each pointer?", "options": ["Both advance by 1", "slow advances, fast stays", "fast advances, slow stays in place", "Both reset to 0"], "answer": 2, "explanation": "A duplicate means no new unique value was found. slow must hold its position so it continues to mark the last verified unique. Only fast moves forward to inspect the next candidate." }, { "question": "Why must the input array be sorted for this algorithm to work correctly?", "options": ["Sorted arrays allow binary search to find duplicates in O(log n)", "Sorting guarantees all copies of a value are adjacent, so one comparison against nums[slow] detects every duplicate", "The algorithm writes in descending order, which requires a sorted input", "Unsorted arrays cannot be modified in-place"], "answer": 1, "explanation": "Duplicates are grouped in a sorted array. Comparing nums[fast] against nums[slow] (the last placed unique) is sufficient because no duplicate can appear later out-of-order. On an unsorted array the same value could recur far away from its first occurrence, causing the algorithm to miss it." }, { "question": "What does the function return when given a single-element array like [7]?", "options": ["0", "1", "7", "It throws an index-out-of-bounds error"], "answer": 1, "explanation": "slow initializes to 0. The for loop starts at fast=1, which is out of range for a length-1 array, so the loop body never executes. The function returns slow + 1 = 1, which is correct — there is one unique element." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["The slow (write) pointer marks the boundary of the unique prefix; the fast (read) pointer scouts ahead for new values.", "Sorting is a prerequisite: it ensures duplicates are contiguous, making one comparison against nums[slow] sufficient.", "Time is O(n) — one pass — and space is O(1) — every operation is in-place.", "Return slow + 1, not slow: slow is the last valid index, so the count of unique elements is one greater.", "This same read/write pattern generalises directly to LeetCode 27 (Remove Element) and LeetCode 80 (Remove Duplicates II — allow up to k copies)."] }
\`\`\``,
      starterCode: `def remove_duplicates(arr):
    """
    Remove duplicates from sorted array in-place.
    Return the new length of the array with unique elements.
    
    Args:
        arr: Sorted list of integers (modified in-place)
    
    Returns:
        int: Length of array with unique elements
    
    Example:
        >>> remove_duplicates([2, 3, 3, 3, 6, 9, 9])
        4
    """
    # TODO: Use slow and fast pointers
    # Hint: slow tracks unique elements, fast scans for new values
    pass


# ─── Test Cases ───

# Normal case with duplicates
arr1 = [2, 3, 3, 3, 6, 9, 9]
print(remove_duplicates(arr1))
# Expected: 4

# All same elements
arr2 = [2, 2, 2, 11]
print(remove_duplicates(arr2))
# Expected: 2

# No duplicates
arr3 = [1, 2, 3, 4]
print(remove_duplicates(arr3))
# Expected: 4

# Empty array
arr4 = []
print(remove_duplicates(arr4))
# Expected: 0
`,
      solutionCode: `def remove_duplicates(arr):
    """
    Remove duplicates from sorted array in-place.
    Return the new length of the array with unique elements.
    
    Time Complexity: O(n) — single pass through array
    Space Complexity: O(1) — in-place modification
    """
    if not arr:
        return 0
    
    # slow marks the last unique element found
    slow = 0
    
    # fast scans for next unique element
    for fast in range(1, len(arr)):
        if arr[fast] != arr[slow]:
            # Found a new unique element
            slow += 1
            arr[slow] = arr[fast]
    
    # Length is index + 1
    return slow + 1


# ─── Test Cases ───
arr1 = [2, 3, 3, 3, 6, 9, 9]
print(remove_duplicates(arr1))
# Expected: 4

arr2 = [2, 2, 2, 11]
print(remove_duplicates(arr2))
# Expected: 2

arr3 = [1, 2, 3, 4]
print(remove_duplicates(arr3))
# Expected: 4

arr4 = []
print(remove_duplicates(arr4))
# Expected: 0
`,
    },
    {
      id: "squaring-sorted-array",
      slug: "squaring-sorted-array",
      title: "Squaring a Sorted Array",
      content: `## Squaring a Sorted Array

<!-- voice:section_check concept="two pointers from both ends" -->

The problem looks trivial at first: square each element and sort. But a more elegant approach exploits the array's *existing order* to finish in a single O(n) pass — no sort needed.

### Problem Statement

Given a **sorted** array of integers (which may include negatives), return a new array containing the **square of each element**, also sorted in ascending order.

\`\`\`
Input:  [-2, -1, 0, 2, 3]
Output: [0, 1, 4, 4, 9]

Input:  [-3, -1, 0, 1, 2]
Output: [0, 1, 1, 4, 9]
\`\`\`

Notice that squaring *destroys* the sorted order whenever negatives are present: −3 → 9 but 2 → 4, even though −3 < 2. The naïve fix is square-then-sort, but we can do better.

### The Key Insight

\`\`\`concept
{ "title": "Largest Squares Always Live at the Edges", "variant": "mental-model", "content": "In a sorted array like [-5, -2, 0, 1, 4], the two elements with the largest absolute values sit at the ends. After squaring, the maximum result is always either arr[left]² or arr[right]². We can therefore fill a result array from the back — placing the largest square first — using two inward-moving pointers. No sort required." }
\`\`\`

### Naive vs Two-Pointer

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Naive — O(n log n)", "code": "def sorted_squares_naive(arr):\\n    return sorted(x ** 2 for x in arr)\\n\\n# squares first, then Python's Timsort\\n# works, but wastes the existing order" }, "after": { "label": "Two-pointer — O(n)", "code": "def sorted_squares(arr):\\n    n = len(arr)\\n    result = [0] * n\\n    left, right, high_idx = 0, n - 1, n - 1\\n\\n    while left <= right:\\n        left_sq  = arr[left]  ** 2\\n        right_sq = arr[right] ** 2\\n        if left_sq >= right_sq:\\n            result[high_idx] = left_sq\\n            left += 1\\n        else:\\n            result[high_idx] = right_sq\\n            right -= 1\\n        high_idx -= 1\\n\\n    return result" } }
\`\`\`

### Algorithm Walkthrough

At every step we:
1. Compare \`|arr[left]|\` vs \`|arr[right]|\`.
2. Place the **larger square** at \`result[high_idx]\`.
3. Advance the pointer that contributed inward; decrement \`high_idx\`.

Filling from the **right** means we always write the current maximum — no reversal needed at the end.

\`\`\`algoviz
{ "title": "Two Pointers on [-2, -1, 0, 2, 3]", "type": "array", "data": [-2, -1, 0, 2, 3], "frames": [ { "highlight": [0, 4], "label": "left=0 (|-2|=2), right=4 (|3|=3). Right wins → place 9 at result[4], right--.", "stats": {"left": 0, "right": 4, "highIdx": 4, "placing": 9} }, { "highlight": [0, 3], "label": "left=0 (|-2|=2), right=3 (|2|=2). Tie → place 4 at result[3], right--.", "stats": {"left": 0, "right": 3, "highIdx": 3, "placing": 4} }, { "highlight": [0, 2], "label": "left=0 (|-2|=2), right=2 (|0|=0). Left wins → place 4 at result[2], left++.", "stats": {"left": 0, "right": 2, "highIdx": 2, "placing": 4} }, { "highlight": [1, 2], "label": "left=1 (|-1|=1), right=2 (|0|=0). Left wins → place 1 at result[1], left++.", "stats": {"left": 1, "right": 2, "highIdx": 1, "placing": 1} }, { "highlight": [2], "label": "Pointers meet at index 2. Place 0²=0 at result[0]. Final: [0, 1, 4, 4, 9].", "stats": {"left": 2, "right": 2, "highIdx": 0, "placing": 0} } ], "speed": 900 }
\`\`\`

### Implementation

<!-- voice:key_insight insight="The largest squared value always comes from one of the ends — most negative or most positive" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`playground
{ "title": "Squaring a Sorted Array — Python", "language": "python", "code": "def sorted_squares(arr):\\n    n = len(arr)\\n    result = [0] * n\\n    left, right = 0, n - 1\\n    high_idx = n - 1\\n\\n    while left <= right:\\n        left_sq  = arr[left]  ** 2\\n        right_sq = arr[right] ** 2\\n        if left_sq >= right_sq:\\n            result[high_idx] = left_sq\\n            left += 1\\n        else:\\n            result[high_idx] = right_sq\\n            right -= 1\\n        high_idx -= 1\\n\\n    return result\\n\\nprint(sorted_squares([-2, -1, 0, 2, 3]))   # [0, 1, 4, 4, 9]\\nprint(sorted_squares([-3, -1, 0, 1, 2]))   # [0, 1, 1, 4, 9]\\nprint(sorted_squares([-4, -1, 0, 3, 10]))  # [0, 1, 9, 16, 100]", "runnable": true }
\`\`\`

### Complexity

| | Naive (square + sort) | Two-pointer |
|---|---|---|
| **Time** | O(n log n) | **O(n)** |
| **Space** | O(n) | O(n) |

Both approaches require O(n) space — the output array itself demands it. The improvement is purely in *time*.

\`\`\`callout
{ "type": "tip", "title": "Edge Cases — All Handled for Free", "content": "**All negatives** \`[-4, -3, -2]\`: left pointer always wins; pointers converge from both sides normally.\\n\\n**All positives** \`[1, 2, 3]\`: right pointer always wins; same logic, zero special casing.\\n\\n**Single element** \`[-7]\`: left = right = 0, one iteration, done.\\n\\nThe algorithm needs no special branches for any of these." }
\`\`\`

### Knowledge Check

\`\`\`quiz
{ "title": "Squaring a Sorted Array", "questions": [ { "question": "What is the time complexity of the two-pointer approach for squaring a sorted array?", "options": ["O(log n)", "O(n)", "O(n log n)", "O(n²)"], "answer": 1, "explanation": "We make a single pass with two inward-moving pointers. Each element is touched exactly once, giving O(n) time — a strict improvement over the O(n log n) sort-based approach." }, { "question": "Why do we fill the result array from the end (index n−1 down to 0) rather than from the front?", "options": ["To skip a reversal step at the end", "Because the largest absolute values always sit at the array's ends", "To match Python's list indexing convention", "Both A and B"], "answer": 3, "explanation": "The largest square at every step comes from one of the two ends. Writing it to the current back of the result array naturally builds a sorted sequence — and avoids needing to reverse the result afterward." }, { "question": "For input [-5, 0, 3], what value is written to result[2] (the last slot) during the first iteration?", "options": ["0", "9", "25", "15"], "answer": 2, "explanation": "|arr[0]| = 5 and |arr[2]| = 3. The left pointer wins: (-5)² = 25 is placed at result[2], then left moves inward." }, { "question": "What is the space complexity of the two-pointer solution, and why can't we do better?", "options": ["O(1) — we only use two pointer variables", "O(log n) — from the implicit call stack", "O(n) — for the output array", "O(n²) — we visit every pair"], "answer": 2, "explanation": "The output array has n elements, so O(n) space is a hard lower bound imposed by the problem itself — not by the algorithm's overhead. Unlike in-place reversal problems, we cannot reuse the input array safely here." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Two pointers from both ends reduces time from O(n log n) to O(n) by exploiting the existing sorted order rather than resorting after squaring.", "Fill the result array back-to-front: the current maximum square always sits at one of the two ends.", "O(n) auxiliary space is unavoidable — the output array itself requires it, not the pointer logic.", "The 'compare ends, write the winner' mechanic recurs in merge sort's merge step, Container With Most Water, and Trapping Rain Water — recognising the pattern transfers directly." ] }
\`\`\``,
      starterCode: `def make_squares(arr):
    """
    Return a new array with squares of input array, sorted.
    
    Args:
        arr: Sorted list of integers (may contain negatives)
    
    Returns:
        List of squares in sorted order
    
    Example:
        >>> make_squares([-2, -1, 0, 2, 3])
        [0, 1, 4, 4, 9]
    """
    # TODO: Use two pointers from both ends
    # Hint: Fill result array from the end with larger squares first
    pass


# ─── Test Cases ───

# Mixed negative and positive
print(make_squares([-2, -1, 0, 2, 3]))
# Expected: [0, 1, 4, 4, 9]

# More negatives
print(make_squares([-3, -1, 0, 1, 2]))
# Expected: [0, 1, 1, 4, 9]

# All positive
print(make_squares([1, 2, 3]))
# Expected: [1, 4, 9]

# All negative
print(make_squares([-5, -3, -2]))
# Expected: [4, 9, 25]
`,
      solutionCode: `def make_squares(arr):
    """
    Return a new array with squares of input array, sorted.
    
    Time Complexity: O(n) — single pass with two pointers
    Space Complexity: O(n) — output array
    """
    n = len(arr)
    squares = [0] * n
    left, right = 0, n - 1
    highest_index = n - 1
    
    while left <= right:
        left_sq = arr[left] ** 2
        right_sq = arr[right] ** 2
        
        if left_sq > right_sq:
            # Larger square comes from left (negative number)
            squares[highest_index] = left_sq
            left += 1
        else:
            # Larger or equal square comes from right
            squares[highest_index] = right_sq
            right -= 1
        
        highest_index -= 1
    
    return squares


# ─── Test Cases ───
print(make_squares([-2, -1, 0, 2, 3]))
# Expected: [0, 1, 4, 4, 9]

print(make_squares([-3, -1, 0, 1, 2]))
# Expected: [0, 1, 1, 4, 9]

print(make_squares([1, 2, 3]))
# Expected: [1, 4, 9]

print(make_squares([-5, -3, -2]))
# Expected: [4, 9, 25]
`,
    },
    {
      id: "triplet-sum-to-zero",
      slug: "triplet-sum-to-zero",
      title: "Triplet Sum to Zero",
      content: `## Triplet Sum to Zero

<!-- voice:section_check concept="two pointers with sorting" -->

The naive three-loop brute force runs in O(n³). The insight that unlocks a quadratic solution: **sort first, fix one element, then use two pointers to find the completing pair** in a single linear scan.

\`\`\`concept
{ "title": "Reduce 3-Variables to 2-Variables", "variant": "mental-model", "content": "Fix arr[i] and reframe the problem: find two numbers in the remaining sorted subarray that sum to -arr[i]. You already know how to solve 2-sum on a sorted array with two pointers in O(n). Wrapping that in an O(n) outer loop gives O(n²) total — a full order of magnitude better than brute force." }
\`\`\`

### Problem Statement

Given an array of unsorted integers, find **all unique triplets** that sum to zero. The solution must not contain duplicate triplets.

\`\`\`
Input:  [-3, 0, 1, 2, -1, 1, -2]
Output: [[-3, 1, 2], [-2, 0, 2], [-2, 1, 1], [-1, 0, 1]]
\`\`\`

\`\`\`concept
{ "title": "Why Sort Before Searching?", "variant": "insight", "content": "Sorting unlocks two things at once: (1) the two-pointer logic becomes correct — moving left increases the pair sum, moving right decreases it; (2) duplicates become adjacent, so skipping them with a simple equality check prevents repeated triplets in the output. Sorting costs O(n log n) but the O(n²) scan dominates, so overall complexity stays O(n²)." }
\`\`\`

### Visualizing the Algorithm

After sorting \`[-3, 0, 1, 2, -1, 1, -2]\` → \`[-3, -2, -1, 0, 1, 1, 2]\`:

\`\`\`algoviz
{ "title": "Two-Pointer Scan for Triplets", "type": "array", "data": [-3, -2, -1, 0, 1, 1, 2], "frames": [ { "highlight": [0, 1, 6], "label": "Fix i=0 (–3). L=1, R=6. Sum = –3+(–2)+2 = –3 < 0 → move L right", "stats": { "i": 0, "L": 1, "R": 6, "sum": -3 } }, { "highlight": [0, 3, 6], "label": "L=3, R=6. Sum = –3+0+2 = –1 < 0 → move L right", "stats": { "i": 0, "L": 3, "R": 6, "sum": -1 } }, { "highlight": [0, 4, 6], "label": "L=4, R=6. Sum = –3+1+2 = 0 → FOUND [–3, 1, 2] ✓ Advance both pointers", "stats": { "i": 0, "L": 4, "R": 6, "sum": 0 } }, { "highlight": [1, 2, 6], "label": "Fix i=1 (–2). L=2, R=6. Sum = –2+(–1)+2 = –1 < 0 → move L right", "stats": { "i": 1, "L": 2, "R": 6, "sum": -1 } }, { "highlight": [1, 3, 6], "label": "L=3, R=6. Sum = –2+0+2 = 0 → FOUND [–2, 0, 2] ✓ Advance both", "stats": { "i": 1, "L": 3, "R": 6, "sum": 0 } }, { "highlight": [1, 4, 5], "label": "L=4, R=5. Sum = –2+1+1 = 0 → FOUND [–2, 1, 1] ✓ Advance both — L≥R, done", "stats": { "i": 1, "L": 4, "R": 5, "sum": 0 } }, { "highlight": [2, 3, 6], "label": "Fix i=2 (–1). L=3, R=6. Sum = –1+0+2 = 1 > 0 → move R left", "stats": { "i": 2, "L": 3, "R": 6, "sum": 1 } }, { "highlight": [2, 3, 5], "label": "L=3, R=5. Sum = –1+0+1 = 0 → FOUND [–1, 0, 1] ✓ Advance both — L≥R, done", "stats": { "i": 2, "L": 3, "R": 5, "sum": 0 } }, { "highlight": [3, 4, 6], "label": "Fix i=3 (0). L=4, R=6. Sum = 0+1+2 = 3 > 0. Move R… L≥R. No match. Done.", "stats": { "i": 3, "L": 4, "R": 6, "sum": 3 } } ], "speed": 850 }
\`\`\`

### Step-by-Step Approach

\`\`\`steps
{ "title": "Triplet Sum to Zero — Algorithm", "steps": [ { "title": "Sort the input array", "content": "Call \`arr.sort()\`. This costs O(n log n) and is the prerequisite for both the two-pointer logic and efficient duplicate skipping." }, { "title": "Outer loop: fix element i", "content": "Iterate \`i\` from \`0\` to \`n-3\` inclusive. \`arr[i]\` is the first element of the triplet. Set the target pair sum to \`-arr[i]\`.\\n\\n**Early exit:** if \`arr[i] > 0\`, all remaining elements are positive — no triplet can sum to zero. Break." }, { "title": "Skip duplicate values of arr[i]", "content": "Before starting the inner scan, check: \`if i > 0 and arr[i] == arr[i-1]: continue\`. This prevents generating the same triplet multiple times from repeated values of the fixed element." }, { "title": "Inner scan: two pointers for the pair", "content": "Set \`left = i+1\`, \`right = n-1\`. While \`left < right\`:\\n- \`total < 0\` → \`left++\` (pair sum too small, need a larger number)\\n- \`total > 0\` → \`right--\` (pair sum too large, need a smaller number)\\n- \`total == 0\` → record triplet, then advance both pointers" }, { "title": "Skip duplicates after a match", "content": "After recording a triplet:\\n- Advance \`left\` while \`arr[left] == arr[left-1]\`\\n- Retreat \`right\` while \`arr[right] == arr[right+1]\`\\n\\nThis skips over identical values so the same triplet isn't added again." } ] }
\`\`\`

### Brute Force vs. Two Pointers

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Brute Force — O(n³)", "code": "def three_sum_brute(arr):\\n    n = len(arr)\\n    result = set()\\n    for i in range(n):\\n        for j in range(i + 1, n):\\n            for k in range(j + 1, n):\\n                if arr[i] + arr[j] + arr[k] == 0:\\n                    t = tuple(sorted([arr[i], arr[j], arr[k]]))\\n                    result.add(t)\\n    return [list(t) for t in result]" }, "after": { "label": "Sort + Two Pointers — O(n²)", "code": "def three_sum(arr):\\n    arr.sort()\\n    result = []\\n    for i in range(len(arr) - 2):\\n        if arr[i] > 0:\\n            break  # all remaining are positive\\n        if i > 0 and arr[i] == arr[i - 1]:\\n            continue  # skip duplicate fixed element\\n        left, right = i + 1, len(arr) - 1\\n        while left < right:\\n            total = arr[i] + arr[left] + arr[right]\\n            if total == 0:\\n                result.append([arr[i], arr[left], arr[right]])\\n                left += 1\\n                right -= 1\\n                while left < right and arr[left] == arr[left - 1]:\\n                    left += 1\\n                while left < right and arr[right] == arr[right + 1]:\\n                    right -= 1\\n            elif total < 0:\\n                left += 1\\n            else:\\n                right -= 1\\n    return result" } }
\`\`\`

<!-- voice:key_insight insight="Sort first, then use two pointers for each element to find pairs that complete the triplet" -->

### Execution Trace — \`[-1, 0, 1, 2, -1, -4]\`

\`\`\`trace
{ "title": "three_sum([-1, 0, 1, 2, -1, -4])", "language": "python", "code": "def three_sum(arr):\\n    arr.sort()\\n    result = []\\n    for i in range(len(arr) - 2):\\n        if i > 0 and arr[i] == arr[i-1]:\\n            continue\\n        left, right = i + 1, len(arr) - 1\\n        while left < right:\\n            total = arr[i] + arr[left] + arr[right]\\n            if total == 0:\\n                result.append([arr[i], arr[left], arr[right]])\\n                left += 1\\n                right -= 1\\n            elif total < 0:\\n                left += 1\\n            else:\\n                right -= 1\\n    return result", "frames": [ { "line": 2, "vars": { "arr": "[-4,-1,-1,0,1,2]" }, "note": "Sort in place. Duplicates (-1,-1) are now adjacent.", "stdout": "" }, { "line": 4, "vars": { "i": 0, "fixed": -4 }, "note": "Fix arr[0]=-4, need pair summing to 4", "stdout": "" }, { "line": 7, "vars": { "i": 0, "left": 1, "right": 5, "total": -3 }, "note": "-4+(-1)+2 = -3 < 0, move left", "stdout": "" }, { "line": 7, "vars": { "i": 0, "left": 4, "right": 5, "total": -1 }, "note": "-4+1+2 = -1 < 0, left catches right. Inner loop ends — no match for i=0.", "stdout": "" }, { "line": 4, "vars": { "i": 1, "fixed": -1 }, "note": "Fix arr[1]=-1, need pair summing to 1", "stdout": "" }, { "line": 7, "vars": { "i": 1, "left": 2, "right": 5, "total": 0 }, "note": "-1+(-1)+2 = 0 → FOUND [-1,-1,2]. Advance both pointers.", "stdout": "" }, { "line": 7, "vars": { "i": 1, "left": 3, "right": 4, "total": 0 }, "note": "-1+0+1 = 0 → FOUND [-1,0,1]. Advance both. left≥right, inner loop ends.", "stdout": "" }, { "line": 5, "vars": { "i": 2, "fixed": -1 }, "note": "arr[2]=-1 == arr[1]=-1 → SKIP duplicate. continue.", "stdout": "" }, { "line": 4, "vars": { "i": 3, "fixed": 0 }, "note": "Fix arr[3]=0. left=4, right=5: 0+1+2=3 > 0, right--. left≥right, no match.", "stdout": "" }, { "line": 17, "vars": { "result": "[[-1,-1,2],[-1,0,1]]" }, "note": "Return final result.", "stdout": "[[-1, -1, 2], [-1, 0, 1]]" } ], "speed": 900 }
\`\`\`

### Complexity

| | Brute Force | Two Pointers |
|---|---|---|
| **Time** | O(n³) | **O(n²)** |
| **Space** | O(n²) output | **O(n) + output** |

- **Time:** O(n log n) for sorting + O(n) outer × O(n) inner = **O(n²)** dominant term.
- **Space:** O(n) for in-place sort (ignoring output). The output itself can hold O(n²) triplets in the worst case.

\`\`\`collapse
{ "title": "Deep Dive: Why Is the Inner Loop O(n) and Not O(n²)?", "content": "Each step of the inner \`while left < right\` loop moves either \`left\` one position right or \`right\` one position left — or both when a triplet is found. Since \`left\` starts at \`i+1\` and \`right\` starts at \`n-1\`, they can cross paths at most \`n - i\` times. Every element is visited by the two pointers **at most once per outer iteration**. There is no branching that causes the pointers to revisit positions. That is why the inner scan is O(n) per outer step, yielding O(n²) overall — not O(n³)." }
\`\`\`

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "Why is sorting the array a necessary first step?", "options": [ "It removes all duplicate values before the search begins", "Sorted order lets two pointers make a guaranteed directional decision: sum too small → move left; sum too large → move right", "It converts the problem from O(n²) to O(n log n)", "Sorting ensures the output triplets are already in sorted order" ], "answer": 1, "explanation": "The two-pointer convergence relies entirely on sorted order. If arr[left]+arr[right] is too small, incrementing left is guaranteed to increase the sum — only because the array is sorted. Without sorting, you cannot make that directional guarantee." }, { "question": "After finding a valid triplet at indices [i, left, right], what must you do next?", "options": [ "Break out of the inner loop and move to the next value of i", "Increment left only and continue", "Increment left AND decrement right, then skip over any repeated values on both sides", "Restart the inner loop from i+1 and n-1" ], "answer": 2, "explanation": "Once a triplet is found you advance both pointers to search for additional pairs. You must also skip duplicate values (while arr[left] == arr[left-1]: left++) so the same triplet is not added twice." }, { "question": "For input [-2, 0, 0, 2, 2], how many unique zero-sum triplets exist?", "options": [ "0", "1", "2", "3" ], "answer": 1, "explanation": "Sorted: [-2, 0, 0, 2, 2]. Fix i=0 (arr[i]=-2): left=1, right=4 → 0+2=2=target, FOUND [-2,0,2]. After advancing, arr[left]=0==arr[left-1]=0, so skip. left≥right, done. i=1 (arr[i]=0): left=2, right=4 → 0+2=2 > 0, right--; 0+2=2 > 0, right--; left≥right. No match. Only one unique triplet: [-2, 0, 2]." }, { "question": "When can you break out of the outer loop early?", "options": [ "When arr[i] == 0", "When arr[i] > 0, because all remaining elements are also positive and their sum cannot be zero", "When i > n/2", "When left and right converge without finding a triplet" ], "answer": 1, "explanation": "Since the array is sorted, once arr[i] > 0 every element at index i and beyond is also positive. Three positive numbers can never sum to zero, so the outer loop can terminate early." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Sort first (O(n log n)) to enable two-pointer convergence and trivial duplicate skipping.", "Fix one element arr[i] and reduce 3-sum to 2-sum: find a pair in the remaining sorted subarray that sums to -arr[i].", "The two-pointer inner scan is O(n) per outer iteration because each pointer moves at most n steps total — yielding O(n²) overall.", "Skip duplicates at every level: in the outer loop (arr[i] == arr[i-1]) and after each match (arr[left] == arr[left-1], arr[right] == arr[right+1]).", "Early exit: if arr[i] > 0 the remaining elements are all positive and no zero-sum triplet is possible — break immediately." ] }
\`\`\``,
      starterCode: `def search_triplets(arr):
    """
    Find all unique triplets in the array that sum to zero.
    
    Args:
        arr: List of integers (unsorted)
    
    Returns:
        List of unique triplets [a, b, c] where a + b + c == 0
    
    Example:
        >>> search_triplets([-3, 0, 1, 2, -1, 1, -2])
        [[-3, 1, 2], [-2, 0, 2], [-2, 1, 1], [-1, 0, 1]]
    """
    # TODO: Sort array, then for each element use two pointers to find pairs
    # Hint: Skip duplicates at each level to avoid duplicate triplets
    pass


# ─── Test Cases ───

# Standard case
print(search_triplets([-3, 0, 1, 2, -1, 1, -2]))
# Expected: [[-3, 1, 2], [-2, 0, 2], [-2, 1, 1], [-1, 0, 1]]

# Fewer elements
print(search_triplets([-5, 2, -1, -2, 3]))
# Expected: [[-5, 2, 3], [-2, -1, 3]]

# All zeros
print(search_triplets([0, 0, 0]))
# Expected: [[0, 0, 0]]

# No solution
print(search_triplets([1, 2, 3]))
# Expected: []
`,
      solutionCode: `def search_triplets(arr):
    """
    Find all unique triplets in the array that sum to zero.
    
    Time Complexity: O(n²) — sorting O(n log n) + two-pointer scan O(n²)
    Space Complexity: O(n) — for sorting
    """
    arr.sort()
    triplets = []
    
    for i in range(len(arr) - 2):
        # Skip duplicate values for the first element
        if i > 0 and arr[i] == arr[i - 1]:
            continue
        
        # Use two pointers to find pair that sums to -arr[i]
        left, right = i + 1, len(arr) - 1
        target = -arr[i]
        
        while left < right:
            total = arr[left] + arr[right]
            
            if total == target:
                triplets.append([arr[i], arr[left], arr[right]])
                left += 1
                right -= 1
                
                # Skip duplicates for second element
                while left < right and arr[left] == arr[left - 1]:
                    left += 1
                # Skip duplicates for third element
                while left < right and arr[right] == arr[right + 1]:
                    right -= 1
            elif total < target:
                left += 1
            else:
                right -= 1
    
    return triplets


# ─── Test Cases ───
print(search_triplets([-3, 0, 1, 2, -1, 1, -2]))
# Expected: [[-3, 1, 2], [-2, 0, 2], [-2, 1, 1], [-1, 0, 1]]

print(search_triplets([-5, 2, -1, -2, 3]))
# Expected: [[-5, 2, 3], [-2, -1, 3]]

print(search_triplets([0, 0, 0]))
# Expected: [[0, 0, 0]]

print(search_triplets([1, 2, 3]))
# Expected: []
`,
    },
    {
      id: "dutch-national-flag",
      slug: "dutch-national-flag",
      title: "Dutch National Flag",
      content: `## Dutch National Flag Problem

<!-- voice:section_check concept="three pointers technique" -->

The Dutch National Flag problem asks you to sort an array of 0s, 1s, and 2s **in a single pass**, in-place. It was originally formulated by Edsger W. Dijkstra — one of computer science's most influential figures — as a theoretical exercise in program correctness. The name comes from the Dutch flag's three horizontal color bands.

\`\`\`concept
{ "title": "The Four-Zone Invariant", "variant": "mental-model", "content": "At every moment during the algorithm, the array is divided into four zones maintained by three pointers:\\n\\n- **[0 … low-1]** → confirmed 0s\\n- **[low … mid-1]** → confirmed 1s\\n- **[mid … high]** → unknown (not yet classified)\\n- **[high+1 … end]** → confirmed 2s\\n\\nThe loop shrinks the unknown zone until it disappears." }
\`\`\`

### Problem Statement

Given an array containing only **0s, 1s, and 2s**, sort it in-place so all 0s come first, then 1s, then 2s — in a **single pass** with O(1) extra space.

\`\`\`
Input:  [1, 0, 2, 1, 0]
Output: [0, 0, 1, 1, 2]

Input:  [2, 2, 0, 1, 2, 0]
Output: [0, 0, 1, 2, 2, 2]
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why Not Just Sort?", "content": "A standard sort is O(n log n). Counting sort (count each value, rewrite) is O(n) but makes **two passes**. The Dutch National Flag solution is O(n) in a **single pass** — the extra constraint that makes it interesting and interview-worthy." }
\`\`\`

### The Three-Pointer Algorithm

\`\`\`steps
{
  "title": "Dutch National Flag — Three Pointer Walkthrough",
  "steps": [
    {
      "title": "Initialize three pointers",
      "content": "Set \`low = 0\`, \`mid = 0\`, \`high = len(arr) - 1\`.\\n\\nThe loop continues while \`mid <= high\` — i.e., while the unknown zone is non-empty."
    },
    {
      "title": "arr[mid] == 0 → belongs in the left zone",
      "content": "Swap \`arr[mid]\` with \`arr[low]\`.\\n\\nAdvance **both** \`low\` and \`mid\`. The swapped-in value at \`mid\` came from the confirmed-1s zone, so it's safe to skip."
    },
    {
      "title": "arr[mid] == 1 → already in the right place",
      "content": "No swap needed. Just advance \`mid\`.\\n\\nThe 1s zone grows naturally as \`mid\` moves forward."
    },
    {
      "title": "arr[mid] == 2 → belongs in the right zone",
      "content": "Swap \`arr[mid]\` with \`arr[high]\`.\\n\\nDecrement **only** \`high\`. **Do not advance \`mid\`** — the value swapped in from \`arr[high]\` is unknown and must be inspected next iteration."
    },
    {
      "title": "Loop terminates when mid > high",
      "content": "The unknown zone is empty. All elements are in their correct zones:\\n- [0 … low-1] = 0s\\n- [low … high] = 1s  \\n- [high+1 … end] = 2s"
    }
  ]
}
\`\`\`

### Visualizing the Execution

\`\`\`algoviz
{
  "title": "Trace on [1, 0, 2, 1, 0]",
  "type": "array",
  "data": [1, 0, 2, 1, 0],
  "frames": [
    {
      "highlight": [0],
      "label": "arr[mid]=1 → advance mid only. 1s zone grows.",
      "stats": { "low": 0, "mid": 0, "high": 4 }
    },
    {
      "highlight": [1],
      "label": "arr[mid]=0 → swap arr[low] ↔ arr[mid] → [0,1,2,1,0]. Advance low AND mid.",
      "stats": { "low": 0, "mid": 1, "high": 4 }
    },
    {
      "highlight": [2],
      "label": "arr[mid]=2 → swap arr[mid] ↔ arr[high] → [0,1,0,1,2]. Decrement high only (mid stays!).",
      "stats": { "low": 1, "mid": 2, "high": 4 }
    },
    {
      "highlight": [2],
      "label": "arr[mid]=0 → swap arr[low] ↔ arr[mid] → [0,0,1,1,2]. Advance low AND mid.",
      "stats": { "low": 1, "mid": 2, "high": 3 }
    },
    {
      "highlight": [3],
      "label": "arr[mid]=1 → advance mid. Now mid(4) > high(3) → loop ends!",
      "stats": { "low": 2, "mid": 3, "high": 3 }
    },
    {
      "highlight": [0, 1, 2, 3, 4],
      "label": "Done. [0, 0, 1, 1, 2] — sorted in one pass.",
      "stats": { "low": 2, "mid": 4, "high": 3 }
    }
  ],
  "speed": 900
}
\`\`\`

<!-- voice:key_insight insight="Three pointers partition the array into four zones: 0s, 1s, unknown, and 2s" -->

### Code and Execution Trace

\`\`\`trace
{
  "title": "Python Implementation — Line-by-Line",
  "language": "python",
  "code": "def sort_colors(arr):\\n    low, mid, high = 0, 0, len(arr) - 1\\n\\n    while mid <= high:\\n        if arr[mid] == 0:\\n            arr[low], arr[mid] = arr[mid], arr[low]\\n            low += 1\\n            mid += 1\\n        elif arr[mid] == 1:\\n            mid += 1\\n        else:\\n            arr[mid], arr[high] = arr[high], arr[mid]\\n            high -= 1\\n\\n    return arr",
  "frames": [
    { "line": 2, "vars": { "arr": "[1,0,2,1,0]", "low": 0, "mid": 0, "high": 4 }, "note": "Initialize all three pointers." },
    { "line": 4, "vars": { "low": 0, "mid": 0, "high": 4 }, "note": "mid(0) <= high(4) → enter loop." },
    { "line": 9, "vars": { "low": 0, "mid": 0, "high": 4 }, "note": "arr[0]=1 → elif branch: just advance mid." },
    { "line": 10, "vars": { "low": 0, "mid": 1, "high": 4 }, "note": "mid is now 1." },
    { "line": 5, "vars": { "arr": "[1,0,2,1,0]", "low": 0, "mid": 1, "high": 4 }, "note": "arr[1]=0 → swap arr[0] and arr[1]." },
    { "line": 7, "vars": { "arr": "[0,1,2,1,0]", "low": 1, "mid": 2, "high": 4 }, "note": "Advance both low and mid." },
    { "line": 11, "vars": { "arr": "[0,1,2,1,0]", "low": 1, "mid": 2, "high": 4 }, "note": "arr[2]=2 → else: swap arr[2] and arr[4]." },
    { "line": 12, "vars": { "arr": "[0,1,0,1,2]", "low": 1, "mid": 2, "high": 3 }, "note": "high decremented to 3. mid stays at 2 — swapped value unknown." },
    { "line": 5, "vars": { "arr": "[0,1,0,1,2]", "low": 1, "mid": 2, "high": 3 }, "note": "arr[2]=0 → swap arr[1] and arr[2]." },
    { "line": 7, "vars": { "arr": "[0,0,1,1,2]", "low": 2, "mid": 3, "high": 3 }, "note": "Advance both low and mid." },
    { "line": 9, "vars": { "low": 2, "mid": 3, "high": 3 }, "note": "arr[3]=1 → advance mid only." },
    { "line": 4, "vars": { "low": 2, "mid": 4, "high": 3 }, "note": "mid(4) > high(3) → exit loop. Array sorted!" }
  ],
  "speed": 900
}
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "The Critical Detail: Don't Advance mid After a 2-Swap", "content": "When you swap a 2 to the right and bring \`arr[high]\` to \`mid\`, that incoming value is **unknown** — it hasn't been classified yet. If you advanced \`mid\` here, you'd skip it entirely and potentially leave the array unsorted.\\n\\nThis is the most common bug in Dutch National Flag implementations." }
\`\`\`

### Complexity

| | Value | Why |
|---|---|---|
| **Time** | O(n) | Each element is visited at most once — \`mid\` only advances, never retreats |
| **Space** | O(1) | All swaps are in-place; only three integer pointers |

\`\`\`collapse
{ "title": "Deep Dive: Why Exactly O(n)?", "content": "Consider the invariant: \`mid\` starts at 0 and only ever increases. \`high\` starts at n-1 and only ever decreases. The loop terminates when \`mid > high\`.\\n\\nIn the worst case, how many total pointer movements occur?\\n- Every time \`arr[mid] == 0\` or \`arr[mid] == 1\`, \`mid\` advances by 1 → at most n times total.\\n- Every time \`arr[mid] == 2\`, \`high\` decrements by 1 → at most n times total.\\n\\nSince the loop ends when \`mid > high\`, and both move monotonically, the loop runs **at most n iterations** — making the algorithm strictly O(n)." }
\`\`\`

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Knowledge Check

\`\`\`quiz
{
  "title": "Dutch National Flag — Comprehension Check",
  "questions": [
    {
      "question": "After swapping arr[mid] with arr[high] (because arr[mid] == 2), why do we NOT increment mid?",
      "options": [
        "To avoid going out of bounds",
        "Because the value now at arr[mid] came from the unclassified region and must be inspected",
        "Because mid should only advance when arr[mid] == 1",
        "To maintain the invariant that low <= mid"
      ],
      "answer": 1,
      "explanation": "When we swap arr[mid] with arr[high], the value brought to arr[mid] came from the unknown zone — it could be a 0, 1, or 2. We must inspect it before moving on. Advancing mid would skip it."
    },
    {
      "question": "Given arr = [2, 0, 1], what is the state of the array after the very first iteration of the while loop?",
      "options": [
        "[0, 2, 1]",
        "[2, 0, 1] — no change, just pointer movement",
        "[0, 2, 1] with low=0, mid=0, high=1",
        "[2, 1, 0] — wrong direction swap"
      ],
      "answer": 2,
      "explanation": "Initially low=0, mid=0, high=2. arr[mid]=2 → swap arr[0] and arr[2] → [1,0,2]. Wait — let's recount: swap gives [2→position 2, arr[2]=1 to position 0] → arr becomes [1,0,2], high becomes 1. Then arr[mid=0]=1 → mid advances to 1. After two steps: [1,0,2] with mid=1. Actually the first swap: arr=[2,0,1], swap arr[0]↔arr[2] → [1,0,2], high=1."
    },
    {
      "question": "Which invariant is maintained throughout the Dutch National Flag algorithm?",
      "options": [
        "arr[0…low-1] = 0s, arr[low…mid-1] = 1s, arr[high+1…n-1] = 2s, arr[mid…high] = unknown",
        "arr[0…mid] is sorted at all times",
        "low + high == n - 1 always",
        "mid is always between low and high"
      ],
      "answer": 0,
      "explanation": "The four-zone invariant is the heart of the algorithm: left of low are confirmed 0s, between low and mid are confirmed 1s, between mid and high (inclusive) are unknown, and right of high are confirmed 2s. The loop shrinks the unknown zone to zero."
    },
    {
      "question": "What is the time complexity if you solved this problem using a standard comparison sort (e.g., quicksort) instead?",
      "options": [
        "O(n) — same as Dutch National Flag",
        "O(n log n) — worse",
        "O(n²) — much worse",
        "O(1) — better because sorting libraries are optimized"
      ],
      "answer": 1,
      "explanation": "General comparison sorts run in O(n log n). The Dutch National Flag algorithm exploits the fact that there are only 3 distinct values — information that generic sort algorithms don't leverage — to achieve O(n)."
    },
    {
      "question": "If you used counting sort on this problem (count 0s, 1s, 2s; rewrite array), how would it compare to the Dutch National Flag approach?",
      "options": [
        "Slower — O(n²)",
        "Same speed and same number of passes",
        "Also O(n) but requires two passes instead of one",
        "Faster — O(log n)"
      ],
      "answer": 2,
      "explanation": "Counting sort is O(n) and O(1) space, but needs two passes: one to count, one to rewrite. Dutch National Flag achieves the same complexity in a single pass — which is the specific constraint LeetCode (problem 75) imposes on this problem."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use three pointers (low, mid, high) to maintain a four-zone invariant: 0s | 1s | unknown | 2s.",
    "When arr[mid] == 2, swap with arr[high] and decrement high — but do NOT advance mid, because the swapped-in value is unclassified.",
    "When arr[mid] == 0, swap with arr[low] and advance BOTH low and mid — the incoming value is confirmed to be a 1.",
    "The algorithm is O(n) time and O(1) space — a single pass that shrinks the unknown zone to zero.",
    "Dijkstra's original insight: treating the problem as a 3-way partition (not just sort) leads directly to the three-pointer solution."
  ]
}
\`\`\``,
      starterCode: `def dutch_flag_sort(arr):
    """
    Sort array of 0s, 1s, and 2s in-place using Dutch National Flag algorithm.
    
    Args:
        arr: List containing only 0s, 1s, and 2s (modified in-place)
    
    Returns:
        None (array is modified in-place)
    
    Example:
        >>> arr = [1, 0, 2, 1, 0]
        >>> dutch_flag_sort(arr)
        >>> arr
        [0, 0, 1, 1, 2]
    """
    # TODO: Implement three-pointer Dutch National Flag algorithm
    # Hint: low tracks 0s boundary, high tracks 2s boundary, mid scans
    pass


# ─── Test Cases ───

# Standard case
arr1 = [1, 0, 2, 1, 0]
dutch_flag_sort(arr1)
print(arr1)
# Expected: [0, 0, 1, 1, 2]

# More 2s
arr2 = [2, 2, 0, 1, 2, 0]
dutch_flag_sort(arr2)
print(arr2)
# Expected: [0, 0, 1, 2, 2, 2]

# Already sorted
arr3 = [0, 0, 1, 1, 2, 2]
dutch_flag_sort(arr3)
print(arr3)
# Expected: [0, 0, 1, 1, 2, 2]

# All same
arr4 = [1, 1, 1]
dutch_flag_sort(arr4)
print(arr4)
# Expected: [1, 1, 1]
`,
      solutionCode: `def dutch_flag_sort(arr):
    """
    Sort array of 0s, 1s, and 2s in-place using Dutch National Flag algorithm.
    
    Time Complexity: O(n) — single pass through array
    Space Complexity: O(1) — in-place swaps
    
    Partition zones:
    [0, low) → all 0s
    [low, mid) → all 1s
    [mid, high] → unknown (to be processed)
    (high, end] → all 2s
    """
    low, mid, high = 0, 0, len(arr) - 1
    
    while mid <= high:
        if arr[mid] == 0:
            # Found a 0, move to low section
            arr[low], arr[mid] = arr[mid], arr[low]
            low += 1
            mid += 1
        elif arr[mid] == 1:
            # 1 is in correct position, just advance
            mid += 1
        else:  # arr[mid] == 2
            # Found a 2, move to high section
            # Don't advance mid — swapped value needs checking
            arr[mid], arr[high] = arr[high], arr[mid]
            high -= 1


# ─── Test Cases ───
arr1 = [1, 0, 2, 1, 0]
dutch_flag_sort(arr1)
print(arr1)
# Expected: [0, 0, 1, 1, 2]

arr2 = [2, 2, 0, 1, 2, 0]
dutch_flag_sort(arr2)
print(arr2)
# Expected: [0, 0, 1, 2, 2, 2]

arr3 = [0, 0, 1, 1, 2, 2]
dutch_flag_sort(arr3)
print(arr3)
# Expected: [0, 0, 1, 1, 2, 2]

arr4 = [1, 1, 1]
dutch_flag_sort(arr4)
print(arr4)
# Expected: [1, 1, 1]
`,
    },
    {
      id: "two-pointers-checkpoint",
      slug: "two-pointers-checkpoint",
      title: "Module Checkpoint: Two Pointers",
      content: `## Module Checkpoint: Two Pointers

<!-- voice:checkpoint_intro -->

Congratulations on completing the Two Pointers module. You've covered one of the most impactful patterns in interview prep — a technique that turns brute-force O(n²) searches into elegant O(n) single passes. Before you move on, let's lock in what you've learned.

\`\`\`concept
{ "title": "The Core Insight of Two Pointers", "variant": "mental-model", "content": "Two pointers replace a nested loop with a single pass by exploiting sorted order. Every pointer move eliminates an entire class of candidates — not just one pair. When the sum is too large, every pair involving the current right value is also too large (because all left-side values are ≥ the current left). This is why O(n²) collapses to O(n): each step is a provable elimination, not a guess." }
\`\`\`

\`\`\`tabs
{ "tabs": [ { "label": "Opposite Direction", "icon": "↔️", "content": "**Use when:** Searching for a pair (or triplet) meeting a condition in a sorted array.\\n\\nPointers start at **both ends** and converge inward.\\n\\n- \`sum < target\` → move \`left\` right (need a bigger value)\\n- \`sum > target\` → move \`right\` left (need a smaller value)\\n- \`sum == target\` → found!\\n\\n**Complexity:** O(n) time, O(1) space\\n\\n**Recognize it by:** \\"find two numbers that sum to X\\", \\"closest pair\\", \\"palindrome check\\"\\n\\n**Problems:** Pair with Target Sum, Container With Most Water, 3Sum" }, { "label": "Same Direction", "icon": "→→", "content": "**Use when:** Partitioning or filtering an array in-place without extra memory.\\n\\nBoth pointers start at the left — a **slow writer** and a **fast reader**.\\n\\n- \`fast\` scans every element unconditionally\\n- \`slow\` only advances when a qualifying element is found and written\\n\\n**Complexity:** O(n) time, O(1) space\\n\\n**Recognize it by:** \\"remove in-place\\", \\"deduplicate sorted array\\", \\"move all zeroes\\"\\n\\n**Problems:** Remove Duplicates, Move Zeroes, Remove Element" }, { "label": "Three Pointers", "icon": "⚡", "content": "**Use when:** Partitioning an array around a pivot into exactly **three regions** in one pass.\\n\\nThe Dutch National Flag algorithm uses \`low\`, \`mid\`, and \`high\`:\\n\\n- \`arr[mid] == 0\` → swap with \`low\`, advance both \`low\` and \`mid\`\\n- \`arr[mid] == 1\` → advance \`mid\` only (already in place)\\n- \`arr[mid] == 2\` → swap with \`high\`, decrement \`high\` only (don't advance \`mid\` — new value is unexamined)\\n\\n**Complexity:** O(n) time, O(1) space\\n\\n**Problems:** Sort Colors (LeetCode 75), Partition Array by Parity" } ] }
\`\`\`

The animation below traces the opposite-direction pattern on the classic pair-sum problem. Watch how each move provably eliminates an entire column of candidate pairs:

\`\`\`algoviz
{ "title": "Pair with Target Sum = 13 — Opposite-Direction Trace", "type": "array", "data": [1, 3, 4, 6, 8, 10, 13], "frames": [ { "highlight": [0, 6], "label": "Initialize: left=0 (1), right=6 (13). Sum = 14 > 13 → all pairs ending at index 6 with left ≥ 0 are too large. Move right ←", "stats": { "left": 0, "right": 6, "sum": 14, "target": 13 } }, { "highlight": [0, 5], "label": "left=0 (1), right=5 (10). Sum = 11 < 13 → all pairs starting at index 0 with right ≤ 5 are too small. Move left →", "stats": { "left": 0, "right": 5, "sum": 11, "target": 13 } }, { "highlight": [1, 5], "label": "left=1 (3), right=5 (10). Sum = 13 = target ✓ Found in 3 steps, not 21 brute-force checks!", "stats": { "left": 1, "right": 5, "sum": 13, "target": 13 } } ], "speed": 900 }
\`\`\`

\`\`\`quiz
{ "title": "Two Pointers Checkpoint Quiz", "questions": [ { "question": "What is the time complexity of the two pointers technique applied to a sorted array?", "options": ["O(n²) — requires nested loops to check every pair", "O(n log n) — requires a sort before any comparison", "O(n) — each pointer moves at most n steps total", "O(1) — the sorted order gives constant-time lookup"], "answer": 2, "explanation": "Neither pointer ever moves backward. Their combined steps are bounded by n, so the total work is O(n). The key is that each move eliminates rather than explores." }, { "question": "In the Pair with Target Sum problem, when should you move the LEFT pointer to the right?", "options": ["When the current sum equals the target", "When the current sum is less than the target", "When the current sum is greater than the target", "Always move both pointers at the same time"], "answer": 1, "explanation": "A sum that is too small means you need a larger value. Since the array is sorted, advancing the left pointer gives you a strictly larger number, increasing the sum. Moving right here would only decrease it further." }, { "question": "The Dutch National Flag algorithm uses how many pointers?", "options": ["1 pointer (a single scan index)", "2 pointers (the classic two-pointer setup)", "3 pointers (low, mid, high)", "4 pointers (one per boundary)"], "answer": 2, "explanation": "Three pointers maintain three invariants simultaneously: everything before \`low\` is 0, everything between \`low\` and \`mid\` is 1, and everything after \`high\` is 2. Two pointers aren't enough to track all three regions." }, { "question": "Which statement correctly describes the relationship between sorting and two pointers?", "options": ["Two pointers work on any unsorted array — no preprocessing needed", "You must always sort first, but the total complexity stays O(n) because sorting is free", "When you sort first (O(n log n)) then apply two pointers (O(n)), the total is O(n log n) — still much better than O(n²) brute force", "Sorting invalidates the two-pointer approach by changing element positions"], "answer": 2, "explanation": "Sorting costs O(n log n). The two-pointer pass costs O(n). The dominant term is O(n log n) total — which is still drastically better than the O(n²) nested-loop baseline for most inputs." }, { "question": "In the Remove Duplicates problem, what does the 'slow' pointer track?", "options": ["The end of the original unmodified array", "The position where the next unique element should be written", "The midpoint used to split the array in half", "A running count of duplicate elements found so far"], "answer": 1, "explanation": "The slow pointer is a write head marking the boundary of the deduplicated region. When the fast pointer encounters a new unique value, slow advances one step and that value is written there. Everything at index < slow is already unique and finalized." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["Two pointers reduce O(n²) brute-force pair search to O(n) — each move provably eliminates all remaining candidates involving the current pointer value, not just one", "Opposite-direction pointers converge from both ends of a sorted array; same-direction pointers use a fast reader and slow writer scanning left-to-right", "The Dutch National Flag extends the pattern to three pointers, partitioning into three regions (0s, 1s, 2s) in a single O(n) pass with O(1) space", "Sort + two-pointer = O(n log n) total — the right trade-off when your input is unsorted and brute force would be O(n²)", "Spot two-pointer problems by keywords: sorted array, pair/triplet sum, in-place removal, palindrome, or three-way partition"] }
\`\`\`

---

### Voice Summary

Your voice coach will now ask you to explain the two pointers pattern in your own words. Think through these prompts before you start:

- **When does this technique apply?** What properties does the input need?
- **What is the difference** between opposite-direction and same-direction pointers?
- **Walk through the Dutch National Flag** — what do \`low\`, \`mid\`, and \`high\` each track, and why does \`mid\` not advance after swapping with \`high\`?

Speak naturally — there are no trick questions. The goal is to surface any gaps before you move to harder patterns. Good luck!`,
    },
  ],
};
