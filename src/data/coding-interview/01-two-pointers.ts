import { Module } from "../types";

export const twoPointersModule: Module = {
  id: "two-pointers",
  title: "Two Pointers Pattern",
  description: "Master the two-pointer technique for solving problems involving sorted arrays, pair sums, and in-place manipulation with O(n) time complexity.",
  lessons: [
    {
      id: "two-pointers-intro",
      slug: "two-pointers-intro",
      title: "Introduction to the Two Pointers Pattern",
      content: `# Introduction to the Two Pointers Pattern

Every developer has written the nested loop — two \`for\` loops, \`O(n²)\`, *it works but it hurts*.
The Two Pointers pattern is the clean, elegant alternative that collapses that quadratic crawl into a single linear pass. By the end of this lesson you'll recognize exactly **when** to reach for it and **why** it works.

---

\`\`\`concept
{ "title": "The Core Idea", "variant": "mental-model", "content": "Place one pointer at each end of a sorted array (or both at the start, depending on the problem). Advance them toward each other — or in the same direction — based on a condition. Because the array is sorted, each pointer move gives you *guaranteed information* about all the elements you're skipping. That guarantee is what makes O(n) possible." }
\`\`\`

---

## Why Brute Force Hurts

Suppose you have a sorted array and need to find **two numbers that sum to a target**.

The naive approach checks every possible pair:

\`\`\`python
def two_sum_brute(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []

print(two_sum_brute([1, 2, 3, 4, 6], 6))  # [1, 3]
\`\`\`

For an array of 10,000 elements that's ~50,000,000 comparisons.
For 1,000,000 elements? ~500,000,000,000. The interview ends before your program does.

\`\`\`callout
{ "type": "warning", "title": "O(n²) Is a Red Flag", "content": "Whenever you find yourself writing a nested loop over the *same* array, ask: is this data sorted (or can I sort it)? If yes, Two Pointers almost certainly cuts it to O(n)." }
\`\`\`

---

## The Two Pointers Solution

Place \`left\` at index 0 and \`right\` at the last index. Check their sum:

- **Sum == target** → found the pair, return indices
- **Sum < target** → need a larger number, move \`left\` right
- **Sum > target** → need a smaller number, move \`right\` left

Because the array is **sorted**, moving \`left\` right always increases the sum, and moving \`right\` left always decreases it. No guess work — pure logic.

---

## Visual Walkthrough

\`\`\`algoviz
{
  "title": "Two Pointers: Find Pair with Target Sum",
  "type": "array",
  "data": [1, 2, 3, 4, 6],
  "frames": [
    { "highlight": [0, 4], "label": "Start: left=0 (val 1), right=4 (val 6). Sum = 7 > 6. Move right left.", "stats": { "left": 0, "right": 4, "sum": 7, "target": 6 } },
    { "highlight": [0, 3], "label": "left=0 (val 1), right=3 (val 4). Sum = 5 < 6. Move left right.", "stats": { "left": 0, "right": 3, "sum": 5, "target": 6 } },
    { "highlight": [1, 3], "label": "left=1 (val 2), right=3 (val 4). Sum = 6 == target! ✓ Return [1, 3].", "stats": { "left": 1, "right": 3, "sum": 6, "target": 6 } }
  ],
  "speed": 900
}
\`\`\`

---

## The Code

\`\`\`playground
{ "title": "Two Pointers: Pair with Target Sum", "language": "python", "code": "def pair_with_target_sum(nums, target):\\n    left, right = 0, len(nums) - 1\\n\\n    while left < right:\\n        current_sum = nums[left] + nums[right]\\n\\n        if current_sum == target:\\n            return [left, right]\\n        elif current_sum < target:\\n            left += 1   # Need bigger sum\\n        else:\\n            right -= 1  # Need smaller sum\\n\\n    return []  # No pair found\\n\\n\\n# Test cases\\nprint(pair_with_target_sum([1, 2, 3, 4, 6], 6))   # [1, 3]\\nprint(pair_with_target_sum([2, 5, 9, 11], 11))     # [0, 2]\\nprint(pair_with_target_sum([1, 3, 5, 7], 100))     # [] - no pair\\nprint(pair_with_target_sum([-3, -1, 0, 2, 4], 1))  # [1, 3]", "runnable": true }
\`\`\`

---

## Execution Trace

Let's watch every variable change for \`nums = [1, 2, 3, 4, 6]\`, \`target = 6\`:

\`\`\`trace
{ "title": "Step-by-Step Execution", "language": "python", "code": "def pair_with_target_sum(nums, target):\\n    left, right = 0, len(nums) - 1\\n    while left < right:\\n        current_sum = nums[left] + nums[right]\\n        if current_sum == target:\\n            return [left, right]\\n        elif current_sum < target:\\n            left += 1\\n        else:\\n            right -= 1\\n    return []", "frames": [
    { "line": 2, "vars": { "nums": "[1,2,3,4,6]", "target": 6, "left": 0, "right": 4 }, "note": "Initialise both pointers" },
    { "line": 4, "vars": { "left": 0, "right": 4, "current_sum": 7 }, "note": "1 + 6 = 7. Sum too large." },
    { "line": 8, "vars": { "left": 0, "right": 3, "current_sum": 7 }, "note": "Decrement right. right=3 (val 4)" },
    { "line": 4, "vars": { "left": 0, "right": 3, "current_sum": 5 }, "note": "1 + 4 = 5. Sum too small." },
    { "line": 7, "vars": { "left": 1, "right": 3, "current_sum": 5 }, "note": "Increment left. left=1 (val 2)" },
    { "line": 4, "vars": { "left": 1, "right": 3, "current_sum": 6 }, "note": "2 + 4 = 6. Match found!" },
    { "line": 5, "vars": { "left": 1, "right": 3 }, "note": "Return [1, 3]", "stdout": "[1, 3]" }
  ], "speed": 900 }
\`\`\`

---

## Pattern Recognition: When to Use Two Pointers

\`\`\`tabs
{ "tabs": [
  { "label": "Strong Signals", "icon": "✅", "content": "Use Two Pointers when you see:\\n\\n- **Sorted array or linked list** as input\\n- Need to find a **pair, triplet, or subarray** satisfying a condition\\n- Problem asks for **in-place** manipulation (remove duplicates, move zeroes)\\n- Keywords: *pair*, *sum*, *target*, *remove*, *palindrome*, *reverse*, *two numbers*\\n- Space complexity requirement of **O(1)** extra space\\n\\n**Classic problems that use this pattern:**\\n- Two Sum (sorted array variant)\\n- Squaring a sorted array\\n- Remove duplicates in-place\\n- Validate palindrome\\n- Container with most water" },
  { "label": "Weak Signals", "icon": "⚠️", "content": "Think twice before reaching for Two Pointers when:\\n\\n- The array is **unsorted** and sorting would change the problem (e.g., index-based answers)\\n- You need to find **all** pairs, not just one (may still apply, but logic changes)\\n- The data structure is a **hash map** or **set** (different tools fit better)\\n- You're working with **2D grids** (nested pointers or BFS/DFS usually better)\\n\\nIn these cases, consider: **Hash Map** for O(n) lookup, **Sliding Window** for subarrays with dynamic bounds, **Binary Search** for sorted lookup." },
  { "label": "Opposite vs Same Direction", "icon": "🔄", "content": "Two Pointers comes in two flavours:\\n\\n**Opposite direction** (converging):\\n\`\`\`\\nleft = 0,  right = len(arr) - 1\\nwhile left < right:\\n    ...move one or both...\\n\`\`\`\\nBest for: pair sum, palindrome check, container with most water\\n\\n---\\n\\n**Same direction** (fast/slow or read/write):\\n\`\`\`\\nread = 0,  write = 0\\nwhile read < len(arr):\\n    if condition: arr[write] = arr[read]; write += 1\\n    read += 1\\n\`\`\`\\nBest for: remove duplicates in-place, move zeroes to end, partition array\\n\\nThis module focuses on the **opposite-direction** variant. Same-direction is covered in the next lesson." }
] }
\`\`\`

---

## Complexity Analysis

\`\`\`concept
{ "title": "Why O(n) Time, O(1) Space", "variant": "insight", "content": "Each pointer only ever moves **inward** — left only moves right, right only moves left. Together they make at most n steps before they meet. That's one linear scan: O(n) time. The only extra memory is the two pointer variables themselves, regardless of input size: O(1) space. This is why interviewers love this pattern — it's provably optimal for sorted-array pair problems." }
\`\`\`

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute force (nested loops) | O(n²) | O(1) | Simple but too slow |
| Hash map | O(n) | O(n) | Works on unsorted data |
| **Two Pointers** | **O(n)** | **O(1)** | Best for sorted input |

---

## Practice: Fill in the Blanks

Complete the palindrome checker — a classic same-direction two-pointer problem:

\`\`\`fillblank
{ "title": "Is Palindrome?", "prompt": "Fill in the blanks to check if a string is a palindrome using two pointers.", "language": "python", "template": "def is_palindrome(s):\\n    left, right = ___, len(s) - 1\\n    while left < right:\\n        if s[left] != s[___]:\\n            return False\\n        left += ___\\n        right -= ___\\n    return True\\n\\nprint(is_palindrome('racecar'))  # True\\nprint(is_palindrome('hello'))    # False", "blanks": [ { "answer": "0", "hint": "Start the left pointer at the beginning of the string" }, { "answer": "right", "hint": "Compare the character at the left pointer with the character at the... pointer" }, { "answer": "1", "hint": "Move left pointer one step inward" }, { "answer": "1", "hint": "Move right pointer one step inward" } ] }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Two Pointers: Check Your Understanding", "questions": [
  {
    "question": "An unsorted array \`[4, 1, 7, 2, 5]\` is given. You want to use the opposite-direction two-pointer technique to find a pair summing to 9. What must you do first?",
    "options": ["Apply two pointers directly from both ends", "Sort the array first, then apply two pointers", "Use a hash set — two pointers won't work here at all", "Reverse the array, then apply two pointers"],
    "answer": 1,
    "explanation": "The opposite-direction two-pointer technique relies on the sorted property: moving left right *always* increases the sum, and moving right left *always* decreases it. Without sorting first, you lose the guarantee that drives pointer movement decisions. Sort the array in O(n log n), then apply two pointers in O(n) — still better than O(n²) brute force."
  },
  {
    "question": "You run \`pair_with_target_sum([1, 3, 5, 7, 9], 10)\` and both pointers end up at the same index. What does the algorithm return?",
    "options": ["The index twice, e.g. [2, 2]", "[-1, -1] as a sentinel", "[] because the while condition \`left < right\` stops before they meet", "It raises an IndexError"],
    "answer": 2,
    "explanation": "The while loop condition is \`left < right\`, NOT \`left <= right\`. When both pointers reach the same index, the loop exits without returning a pair, and the function falls through to \`return []\`. This correctly handles the constraint that a pair must use two *distinct* elements."
  },
  {
    "question": "What is the space complexity of the two-pointer approach for finding a pair sum in a sorted array?",
    "options": ["O(n) — we track visited elements", "O(log n) — due to recursive calls", "O(1) — only two pointer variables needed", "O(n²) — same as brute force"],
    "answer": 2,
    "explanation": "Two pointers use only two integer variables (\`left\` and \`right\`) regardless of how large the input array is. There's no auxiliary data structure, no recursion stack — just two counters. This O(1) extra space is one of the pattern's biggest advantages over the hash-map approach, which needs O(n) space to store seen values."
  },
  {
    "question": "In the pair-sum algorithm, the current sum is *less than* the target. Which pointer should you move, and in which direction?",
    "options": ["Move right pointer left — to get a smaller number", "Move left pointer right — to get a larger number", "Move both pointers one step toward the center", "Swap the values at both pointers"],
    "answer": 1,
    "explanation": "When the sum is too small, you need a larger number to reach the target. Since the array is sorted in ascending order, the only way to increase the sum (while keeping the other element fixed) is to move the *left* pointer rightward — toward larger values. Moving right leftward would only decrease the sum further."
  }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Two Pointers turns O(n²) brute-force pair searches into O(n) by exploiting the sorted order of the data.",
  "The core loop invariant: moving \`left\` right increases the sum; moving \`right\` left decreases it — eliminating the need to revisit elements.",
  "Space complexity is O(1) — only two pointer variables, no extra data structures.",
  "Pattern triggers: sorted input, pair/triplet/subarray condition, in-place manipulation, O(1) space requirement.",
  "Two flavours: opposite-direction (converging) for pair sums and palindromes; same-direction (fast/slow) for in-place writes and duplicates."
] }
\`\`\`

---

\`\`\`callout
{ "type": "success", "title": "You're Ready for the Next Step", "content": "You now know *what* Two Pointers is, *why* it works, and *when* to reach for it. In the next lesson you'll apply this pattern to **Remove Duplicates from a Sorted Array** — a favourite in FAANG phone screens — using the same-direction (read/write) variant." }
\`\`\``,
      starterCode: `def two_sum_sorted(numbers, target):
    """
    Given a sorted array of integers and a target sum,
    find two numbers that add up to the target.
    Return their 1-based indices as a list [left, right].

    Example:
        numbers = [2, 7, 11, 15], target = 9
        Output: [1, 2]  (numbers[0] + numbers[1] == 9)

    Constraints:
        - The array is sorted in ascending order
        - Exactly one solution exists
        - You may not use the same element twice

    Brute force is O(n²) — can you solve this in O(n) using two pointers?
    """
    # TODO 1: Initialize two pointers
    # Hint: one should start at the beginning, one at the end
    left = None
    right = None

    # TODO 2: Loop while the pointers haven't crossed
    while None:  # replace None with your condition

        # TODO 3: Calculate the current sum of the two pointed values
        current_sum = None

        # TODO 4: If current_sum equals target, return the 1-based indices
        if None:
            return None

        # TODO 5: If current_sum is too large, move the right pointer inward
        elif None:
            pass  # update right pointer

        # TODO 6: If current_sum is too small, move the left pointer inward
        else:
            pass  # update left pointer

    return []  # no solution found


# --- Tests ---
if __name__ == "__main__":
    assert two_sum_sorted([2, 7, 11, 15], 9) == [1, 2]
    assert two_sum_sorted([1, 3, 4, 5, 7, 11], 9) == [3, 5]
    assert two_sum_sorted([-3, -1, 0, 2, 4], 1) == [2, 5]
    print("All tests passed!")
`,
      solutionCode: `def two_sum_sorted(numbers, target):
    """
    Two Pointers approach:
    - Place one pointer at the start (smallest value)
    - Place one pointer at the end (largest value)
    - Their sum tells us which direction to move:
        * sum == target  → found the answer
        * sum > target   → right pointer moves left (need smaller value)
        * sum < target   → left pointer moves right (need larger value)
    Each iteration eliminates one element, giving us O(n) time, O(1) space.
    """
    # Initialize pointers at opposite ends of the array
    left = 0
    right = len(numbers) - 1

    # Continue until the pointers meet
    while left < right:
        current_sum = numbers[left] + numbers[right]

        if current_sum == target:
            # Return 1-based indices
            return [left + 1, right + 1]
        elif current_sum > target:
            # Sum is too big — shrink it by moving right pointer left
            right -= 1
        else:
            # Sum is too small — grow it by moving left pointer right
            left += 1

    return []  # no solution found


# --- Tests ---
if __name__ == "__main__":
    assert two_sum_sorted([2, 7, 11, 15], 9) == [1, 2]
    assert two_sum_sorted([1, 3, 4, 5, 7, 11], 9) == [3, 5]
    assert two_sum_sorted([-3, -1, 0, 2, 4], 1) == [2, 5]
    print("All tests passed!")
`,
    },
    {
      id: "pair-with-target-sum",
      slug: "pair-with-target-sum",
      title: "Pair with Target Sum",
      content: `# Pair with Target Sum

Given a **sorted array** and a target number, find a pair of elements whose sum equals the target. Return the indices of the two numbers.

This is the gateway problem for the Two Pointers pattern. Master it here, and you'll recognize its fingerprints in dozens of harder problems.

---

## Why Not Just Use Brute Force?

The naive approach is to check every pair:

\`\`\`python
# O(N²) brute force
for i in range(len(arr)):
    for j in range(i + 1, len(arr)):
        if arr[i] + arr[j] == target:
            return [i, j]
\`\`\`

Two nested loops → **O(N²) time**. For an array of 10,000 elements, that's 50 million comparisons. We can do far better.

\`\`\`concept
{ "title": "The Sorted Array Guarantee", "variant": "insight", "content": "When an array is sorted, position carries information. A value at index i is always ≤ the value at index i+1. This ordering lets us make smart directional decisions — something a hash map or brute force cannot exploit." }
\`\`\`

---

## The Two-Pointer Insight

Place one pointer at the **leftmost** element (smallest) and another at the **rightmost** (largest). Now compute their sum:

- **Sum == target** → found it, return both indices
- **Sum < target** → we need a larger sum, so move the **left pointer right** (increase the smaller value)
- **Sum > target** → we need a smaller sum, so move the **right pointer left** (decrease the larger value)

Each step eliminates one element from consideration. The pointers converge in at most **N steps**.

\`\`\`concept
{ "title": "Convergence = Elimination", "variant": "mental-model", "content": "Think of the two pointers as squeezing the search space from both ends. Every move permanently discards one candidate. Because the array is sorted, you never need to revisit a discarded element — the ordering guarantees no valid pair can include it." }
\`\`\`

---

## Step-by-Step Walkthrough

\`\`\`steps
{ "title": "Two-Pointer Algorithm", "steps": [ { "title": "Initialize pointers", "content": "Set \`left = 0\` and \`right = len(arr) - 1\`. These point to the smallest and largest elements respectively." }, { "title": "Compute current sum", "content": "Calculate \`current_sum = arr[left] + arr[right]\`. Compare it to the target." }, { "title": "Exact match → return", "content": "If \`current_sum == target\`, you found the pair. Return \`[left, right]\`." }, { "title": "Sum too small → move left right", "content": "If \`current_sum < target\`, the left value is too small. Increment \`left\` to try a larger value from the left side." }, { "title": "Sum too large → move right left", "content": "If \`current_sum > target\`, the right value is too large. Decrement \`right\` to try a smaller value from the right side." }, { "title": "No pair found", "content": "If \`left >= right\` and no pair was found, return \`[-1, -1]\`. The pointers have crossed — all candidates exhausted." } ] }
\`\`\`

---

## Visualizing the Algorithm

Watch the pointers converge on the target pair \`[1, 4, 6, 8, 11] → target = 10\`:

\`\`\`algoviz
{ "title": "Finding pair that sums to 10", "type": "array", "data": [1, 4, 6, 8, 11], "frames": [ { "highlight": [0, 4], "label": "left=0 (val=1), right=4 (val=11) → sum=12 > 10, move right left", "stats": { "left": 0, "right": 4, "sum": 12 } }, { "highlight": [0, 3], "label": "left=0 (val=1), right=3 (val=8) → sum=9 < 10, move left right", "stats": { "left": 0, "right": 3, "sum": 9 } }, { "highlight": [1, 3], "label": "left=1 (val=4), right=3 (val=8) → sum=12 > 10, move right left", "stats": { "left": 1, "right": 3, "sum": 12 } }, { "highlight": [1, 2], "label": "left=1 (val=4), right=2 (val=6) → sum=10 == target! ✓", "stats": { "left": 1, "right": 2, "sum": 10 } } ], "speed": 900 }
\`\`\`

Four comparisons to find the answer in a 5-element array. Brute force would need up to 10.

---

## Code Trace: Execution Line by Line

\`\`\`trace
{ "title": "Tracing pair_with_target_sum([1, 4, 6, 8, 11], 10)", "language": "python", "code": "def pair_with_target_sum(arr, target):\\n    left, right = 0, len(arr) - 1\\n    while left < right:\\n        current_sum = arr[left] + arr[right]\\n        if current_sum == target:\\n            return [left, right]\\n        elif current_sum < target:\\n            left += 1\\n        else:\\n            right -= 1\\n    return [-1, -1]", "frames": [ { "line": 2, "vars": { "arr": "[1,4,6,8,11]", "target": 10, "left": 0, "right": 4 }, "note": "Initialize both pointers" }, { "line": 3, "vars": { "left": 0, "right": 4 }, "note": "0 < 4, enter loop" }, { "line": 4, "vars": { "current_sum": 12, "arr[left]": 1, "arr[right]": 11 }, "note": "1 + 11 = 12" }, { "line": 7, "vars": { "right": 3 }, "note": "12 > 10, move right left" }, { "line": 4, "vars": { "current_sum": 9, "arr[left]": 1, "arr[right]": 8 }, "note": "1 + 8 = 9" }, { "line": 6, "vars": { "left": 1 }, "note": "9 < 10, move left right" }, { "line": 4, "vars": { "current_sum": 12, "arr[left]": 4, "arr[right]": 8 }, "note": "4 + 8 = 12" }, { "line": 7, "vars": { "right": 2 }, "note": "12 > 10, move right left" }, { "line": 4, "vars": { "current_sum": 10, "arr[left]": 4, "arr[right]": 6 }, "note": "4 + 6 = 10 ✓" }, { "line": 5, "vars": {}, "note": "Match found! Return [1, 2]", "stdout": "[1, 2]" } ], "speed": 800 }
\`\`\`

---

## Full Solution — Run It Yourself

\`\`\`playground
{ "title": "Pair with Target Sum — Two Pointers", "language": "python", "code": "def pair_with_target_sum(arr, target):\\n    \\"\\"\\"\\n    Find indices of two numbers in a sorted array that sum to target.\\n    Time:  O(N) — single pass with two pointers\\n    Space: O(1) — no extra data structures\\n    \\"\\"\\"\\n    left, right = 0, len(arr) - 1\\n\\n    while left < right:\\n        current_sum = arr[left] + arr[right]\\n\\n        if current_sum == target:\\n            return [left, right]\\n        elif current_sum < target:\\n            left += 1   # need bigger sum, advance left\\n        else:\\n            right -= 1  # need smaller sum, retreat right\\n\\n    return [-1, -1]  # no pair found\\n\\n\\n# Test cases\\nprint(pair_with_target_sum([1, 2, 3, 4, 6], 6))      # [1, 3] (2+4)\\nprint(pair_with_target_sum([2, 5, 9, 11], 11))        # [0, 2] (2+9)\\nprint(pair_with_target_sum([1, 4, 6, 8, 11], 10))     # [1, 2] (4+6)\\nprint(pair_with_target_sum([1, 3, 5, 7], 100))        # [-1, -1] (no pair)\\nprint(pair_with_target_sum([-3, -1, 0, 2, 5], 1))     # [1, 3] (-1+2)", "runnable": true }
\`\`\`

---

## Understanding the Complexity

\`\`\`tabs
{ "tabs": [ { "label": "Time Complexity", "icon": "⏱️", "content": "**O(N)** — The two pointers start at opposite ends and each moves at most N times total before crossing. No element is visited more than once.\\n\\nContrast with:\\n- Brute force: O(N²)\\n- Hash map approach: O(N) time but O(N) space\\n\\nThe two-pointer approach achieves O(N) time **and** O(1) space simultaneously — but only because the array is already sorted." }, { "label": "Space Complexity", "icon": "💾", "content": "**O(1)** — Only two integer variables (\`left\` and \`right\`) are used regardless of input size.\\n\\nIf the array is **not sorted**, you'd need to sort it first:\\n- Sorting: O(N log N) time, O(1) or O(N) space depending on sort algorithm\\n- Two-pointer scan: O(N)\\n- **Total: O(N log N)**\\n\\nFor already-sorted input, it's pure O(N)." }, { "label": "Why Not Hash Map?", "icon": "🗺️", "content": "A hash map approach also works in O(N) time:\\n\`\`\`python\\nseen = {}\\nfor i, num in enumerate(arr):\\n    complement = target - num\\n    if complement in seen:\\n        return [seen[complement], i]\\n    seen[num] = i\\nreturn [-1, -1]\\n\`\`\`\\n\\nBut it uses **O(N) space** to store the hash map. Two pointers give you the same time complexity with **O(1) space** — a strict improvement when the array is sorted." } ] }
\`\`\`

---

## Now You Try — Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the two-pointer solution", "prompt": "Fill in the missing pieces of the two-pointer algorithm:", "language": "python", "template": "def pair_with_target_sum(arr, target):\\n    left, right = ___, len(arr) - 1\\n    while left ___ right:\\n        current_sum = arr[left] + arr[right]\\n        if current_sum == target:\\n            return [left, right]\\n        elif current_sum < target:\\n            left ___\\n        else:\\n            right ___\\n    return [-1, -1]", "blanks": [ { "answer": "0", "hint": "The left pointer starts at the beginning of the array" }, { "answer": "<", "hint": "The loop runs while the pointers haven't crossed each other" }, { "answer": "+= 1", "hint": "Sum is too small — we need a larger left value, so move right" }, { "answer": "-= 1", "hint": "Sum is too large — we need a smaller right value, so move left" } ] }
\`\`\`

---

## Edge Cases to Know Cold

\`\`\`callout
{ "type": "warning", "title": "Common Interview Traps", "content": "**Duplicates in the array:** The algorithm still works correctly — it finds the first valid pair.\\n\\n**Negative numbers:** Also fine! The algorithm works for any sorted input, including negatives. The comparison logic (\`< target\` vs \`> target\`) handles all cases.\\n\\n**No valid pair:** The loop exits when \`left >= right\`. Always return a sentinel value like \`[-1, -1]\` or \`[]\`.\\n\\n**Target is sum of same element with itself:** e.g., \`arr=[3,5]\`, target=6. Since \`left < right\` is strict, the same index can never be used twice." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: What if the array is NOT sorted?", "content": "If the input isn't sorted, you have two options:\\n\\n**Option A — Sort first (O(N log N)):**\\n\`\`\`python\\narr.sort()  # or sorted() to preserve original\\nreturn pair_with_target_sum(arr, target)\\n\`\`\`\\nWarning: sorting changes indices! If the problem asks for original indices, you need to track them:\\n\`\`\`python\\nindexed = sorted(enumerate(arr), key=lambda x: x[1])\\n# Then run two pointers on indexed, return original indices\\n\`\`\`\\n\\n**Option B — Hash map (O(N) time, O(N) space):**\\nUse the complement pattern. No sorting needed, preserves original indices, slightly more memory.\\n\\nThe right choice depends on the constraint: if the problem guarantees a sorted array, always use two pointers. If not, weigh the space/time trade-off." }
\`\`\`

---

## Practice Problem Variations

\`\`\`callout
{ "type": "info", "title": "What Comes Next in This Pattern", "content": "Once you internalize Pair with Target Sum, these problems follow naturally:\\n\\n- **Triplet Sum to Zero** — extend to 3 pointers (fix one, two-pointer the rest)\\n- **Triplet Sum Close to Target** — track the closest sum seen so far\\n- **Quadruple Sum to Target** — two nested loops + two pointers\\n- **Subarrays with Product Less than Target** — sliding window cousin\\n\\nThe key transfer: every time you need to find a pair/triple with a numerical property in a sorted structure, think two pointers first." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Pair with Target Sum", "questions": [ { "question": "Given \`arr = [1, 2, 3, 4, 6]\` and \`target = 6\`, what does \`pair_with_target_sum\` return?", "options": ["[0, 4]", "[1, 3]", "[2, 3]", "[0, 5]"], "answer": 1, "explanation": "arr[1]=2 and arr[3]=4, and 2+4=6. The pointers converge: start at (1,6)→sum=7>6 so right moves, (1,4)→sum=5<6 so left moves, (2,4)→sum=6. Wait — let me recheck: left=0(1), right=4(6), sum=7>6 → right=3(4). left=0(1), right=3(4), sum=5<6 → left=1(2). left=1(2), right=3(4), sum=6 == target → return [1, 3]." }, { "question": "Why does the two-pointer technique require the array to be sorted?", "options": ["Sorted arrays are faster to iterate over", "Sorting allows us to make directional decisions — moving left increases the sum, moving right decreases it", "Unsorted arrays cannot have pairs that sum to a target", "Sorting is required to avoid duplicate pairs"], "answer": 1, "explanation": "The algorithm's correctness depends on order: if arr[left] + arr[right] < target, we KNOW moving left pointer right will increase the sum (because arr is sorted ascending). Without this guarantee, moving a pointer in either direction could either increase or decrease the sum unpredictably." }, { "question": "What is the time complexity of pair_with_target_sum on an already-sorted array?", "options": ["O(N²)", "O(N log N)", "O(N)", "O(log N)"], "answer": 2, "explanation": "O(N) — each pointer moves at most N steps total before they cross. No element is examined more than once. The two pointers together sweep through the array in a single pass." }, { "question": "What should the function return if no valid pair exists?", "options": ["None", "Raise a ValueError", "[-1, -1] or an equivalent sentinel", "An empty list — either works, pick one consistently"], "answer": 2, "explanation": "Returning [-1, -1] (or [] depending on the problem statement) signals 'no valid pair found.' The loop exits when left >= right without finding a match, and this sentinel return handles that case. Always check the expected return format in the problem statement." }, { "question": "You have \`arr = [-3, -1, 0, 2, 5]\` and \`target = 1\`. What pair is found?", "options": ["[-3, 5] at indices [0, 4]", "[-1, 2] at indices [1, 3]", "[0, 2] at indices [2, 3]", "No pair exists"], "answer": 1, "explanation": "left=0(-3), right=4(5): sum=2>1 → right=3(2). left=0(-3), right=3(2): sum=-1<1 → left=1(-1). left=1(-1), right=3(2): sum=1 == target → return [1, 3]. The pair is arr[1]=-1 and arr[3]=2." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The two-pointer technique achieves O(N) time and O(1) space by exploiting sorted order to make directional decisions.", "When current_sum < target, move the left pointer right (increase the smaller value). When current_sum > target, move the right pointer left (decrease the larger value).", "Each pointer movement permanently eliminates one candidate — no element is visited twice, guaranteeing O(N) convergence.", "The algorithm requires a sorted array. For unsorted input, sort first (O(N log N)) or use a hash map (O(N) time, O(N) space).", "This pattern generalizes directly to Triplet Sum, Quadruple Sum, and many other 'find K elements with property X in sorted array' problems." ] }
\`\`\``,
      starterCode: `def pair_with_target_sum(arr, target):
    """
    Given a sorted array, find a pair of numbers that sum to the target.
    Return their indices as a list [left_index, right_index].
    Return [-1, -1] if no such pair exists.

    Example:
        arr = [1, 2, 3, 4, 6], target = 6
        Output: [1, 3]  # arr[1] + arr[3] = 2 + 4 = 6

    Args:
        arr: A sorted list of integers
        target: The target sum to find

    Returns:
        A list with two indices [left, right], or [-1, -1] if not found
    """
    # TODO: Initialize two pointers — one at the start, one at the end
    left = None
    right = None

    # TODO: Loop while left pointer is to the left of right pointer
    while ???:
        # TODO: Calculate the current sum of arr[left] + arr[right]
        current_sum = None

        # TODO: If current_sum equals target, return [left, right]

        # TODO: If current_sum is less than target, move left pointer right
        #       (we need a larger value)

        # TODO: If current_sum is greater than target, move right pointer left
        #       (we need a smaller value)

    # No pair found
    return [-1, -1]


# --- Tests ---
if __name__ == "__main__":
    assert pair_with_target_sum([1, 2, 3, 4, 6], 6) == [1, 3]
    assert pair_with_target_sum([2, 5, 9, 11], 11) == [0, 2]
    assert pair_with_target_sum([1, 3, 5, 7], 12) == [2, 3]
    assert pair_with_target_sum([1, 2, 3], 10) == [-1, -1]
    assert pair_with_target_sum([-3, 0, 4, 8], 1) == [0, 2]
    print("All tests passed!")
`,
      solutionCode: `def pair_with_target_sum(arr, target):
    """
    Given a sorted array, find a pair of numbers that sum to the target.
    Return their indices as a list [left_index, right_index].
    Return [-1, -1] if no such pair exists.

    Strategy: Two-pointer convergence
    - Start one pointer at the left end (smallest value)
    - Start one pointer at the right end (largest value)
    - If the sum is too small, move left pointer right to increase it
    - If the sum is too large, move right pointer left to decrease it
    - Stop when they meet (all pairs exhausted)

    Time Complexity:  O(n) — single pass through the array
    Space Complexity: O(1) — only two index variables
    """
    left = 0
    right = len(arr) - 1

    while left < right:
        current_sum = arr[left] + arr[right]

        if current_sum == target:
            return [left, right]          # Found the pair

        elif current_sum < target:
            left += 1                     # Need a bigger value; move left inward

        else:  # current_sum > target
            right -= 1                    # Need a smaller value; move right inward

    return [-1, -1]  # Pointers crossed; no valid pair exists


# --- Tests ---
if __name__ == "__main__":
    assert pair_with_target_sum([1, 2, 3, 4, 6], 6) == [1, 3]
    assert pair_with_target_sum([2, 5, 9, 11], 11) == [0, 2]
    assert pair_with_target_sum([1, 3, 5, 7], 12) == [2, 3]
    assert pair_with_target_sum([1, 2, 3], 10) == [-1, -1]
    assert pair_with_target_sum([-3, 0, 4, 8], 1) == [0, 2]
    print("All tests passed!")
`,
    },
    {
      id: "remove-duplicates",
      slug: "remove-duplicates",
      title: "Remove Duplicates from Sorted Array",
      content: `# Remove Duplicates from Sorted Array

When you get a sorted array in an interview and need to remove duplicates **without extra memory**, the two-pointer technique is your go-to tool. This lesson walks you through the slow/fast pointer approach that solves this problem in O(n) time and O(1) space.

---

\`\`\`concept
{
  "title": "The Slow/Fast Pointer Pair",
  "variant": "mental-model",
  "content": "Use two pointers on the same array moving in the same direction at different speeds. The **slow pointer** (write index) tracks where the next unique element should go. The **fast pointer** scans ahead looking for new unique values. When fast finds something new, slow writes it and advances. This separates 'where we are reading' from 'where we are writing'."
}
\`\`\`

## Why Two Pointers Work Here

A brute-force approach might use a hash set to track seen values — but that costs O(n) extra space. We can do better.

The key insight is that the array is **already sorted**. Because of this, all duplicates of a given value are **grouped together consecutively**. We don't need a hash set to detect duplicates — we just compare each element to the previous unique element we wrote.

\`\`\`concept
{
  "title": "Sorted Array = Free Duplicate Detection",
  "variant": "insight",
  "content": "In a sorted array, duplicates are always adjacent. So to check whether an element is a duplicate, you only need to compare it with the last unique element you've placed — a single O(1) comparison, no hash set needed."
}
\`\`\`

## Visualising the Algorithm

Given \`nums = [1, 1, 2, 3, 3, 4]\`, watch how the two pointers interact:

\`\`\`algoviz
{
  "title": "Slow/Fast Pointer: Remove Duplicates",
  "type": "array",
  "data": [1, 1, 2, 3, 3, 4],
  "frames": [
    { "highlight": [0], "label": "Init: write_index=0, start iterating. First element always unique — write it.", "stats": { "write_index": 0, "current": 1 } },
    { "highlight": [0, 1], "label": "nums[1]=1, same as nums[write_index-1]=1. Skip duplicate.", "stats": { "write_index": 1, "current": 1 } },
    { "highlight": [0, 2], "label": "nums[2]=2, different from nums[0]=1. Write 2 at write_index=1.", "stats": { "write_index": 1, "current": 2 } },
    { "highlight": [0, 1, 3], "label": "nums[3]=3, different from nums[1]=2. Write 3 at write_index=2.", "stats": { "write_index": 2, "current": 3 } },
    { "highlight": [0, 1, 2, 4], "label": "nums[4]=3, same as nums[2]=3. Skip duplicate.", "stats": { "write_index": 3, "current": 3 } },
    { "highlight": [0, 1, 2, 5], "label": "nums[5]=4, different from nums[2]=3. Write 4 at write_index=3.", "stats": { "write_index": 3, "current": 4 } },
    { "highlight": [0, 1, 2, 3], "label": "Done. First 4 positions hold unique elements [1,2,3,4]. Return 4.", "stats": { "write_index": 4, "result": 4 } }
  ],
  "speed": 900
}
\`\`\`

## Step-by-Step Breakdown

\`\`\`steps
{
  "title": "Algorithm Walkthrough",
  "steps": [
    {
      "title": "Handle the edge case",
      "content": "If the array is empty, return 0 immediately. An empty array has no elements to process.\\n\\n\`\`\`python\\nif not nums:\\n    return 0\\n\`\`\`"
    },
    {
      "title": "Initialise the write pointer",
      "content": "Set \`write_index = 0\`. This pointer tracks where the next unique element should be written. The first element is always unique, so we can start writing from index 0."
    },
    {
      "title": "Iterate with the fast pointer",
      "content": "Loop through every element \`current_num\` in \`nums\`. For each element, ask: *is this element different from the last unique element I wrote?*\\n\\nThe last unique element written lives at \`nums[write_index - 1]\`."
    },
    {
      "title": "Write unique elements",
      "content": "Two conditions trigger a write:\\n- \`write_index == 0\` (we haven't written anything yet), **OR**\\n- \`current_num != nums[write_index - 1]\` (it's a new unique value)\\n\\nWhen either is true: \`nums[write_index] = current_num\`, then \`write_index += 1\`."
    },
    {
      "title": "Return the count",
      "content": "After the loop, \`write_index\` equals the number of unique elements. The first \`write_index\` slots in \`nums\` hold those unique elements in sorted order."
    }
  ]
}
\`\`\`

## The Code

\`\`\`playground
{
  "title": "Remove Duplicates — Two Pointer Solution",
  "language": "python",
  "code": "from typing import List\\n\\ndef remove_duplicates(nums: List[int]) -> int:\\n    if not nums:\\n        return 0\\n\\n    write_index = 0\\n\\n    for current_num in nums:\\n        # Write if first element OR current is different from last written unique\\n        if write_index == 0 or current_num != nums[write_index - 1]:\\n            nums[write_index] = current_num\\n            write_index += 1\\n\\n    return write_index\\n\\n\\n# --- Test cases ---\\ntest_cases = [\\n    [1, 1, 2, 3, 3, 4],        # Expected: 4, unique = [1,2,3,4]\\n    [0, 0, 1, 1, 1, 2, 2, 3],  # Expected: 4, unique = [0,1,2,3]\\n    [1],                        # Expected: 1\\n    [1, 1, 1, 1],               # Expected: 1\\n    [1, 2, 3, 4, 5],            # Expected: 5 (already unique)\\n    [],                         # Expected: 0\\n]\\n\\nfor nums in test_cases:\\n    original = nums.copy()\\n    k = remove_duplicates(nums)\\n    print(f\\"Input: {original}\\")\\n    print(f\\"  Unique count: {k}, Modified array prefix: {nums[:k]}\\")\\n    print()\\n",
  "runnable": true
}
\`\`\`

## Tracing Through an Example

Let's trace \`nums = [0, 0, 1, 1, 2]\` line by line:

\`\`\`trace
{
  "title": "Line-by-Line Trace: [0, 0, 1, 1, 2]",
  "language": "python",
  "code": "nums = [0, 0, 1, 1, 2]\\nwrite_index = 0\\n\\nfor current_num in nums:\\n    if write_index == 0 or current_num != nums[write_index - 1]:\\n        nums[write_index] = current_num\\n        write_index += 1\\n\\nreturn write_index",
  "frames": [
    { "line": 2, "vars": { "nums": "[0,0,1,1,2]", "write_index": 0 }, "note": "Initialise write_index to 0" },
    { "line": 4, "vars": { "current_num": 0, "write_index": 0 }, "note": "First iteration: current_num=0" },
    { "line": 5, "vars": { "current_num": 0, "write_index": 0 }, "note": "write_index==0 → condition TRUE, write 0" },
    { "line": 6, "vars": { "nums": "[0,0,1,1,2]", "write_index": 1 }, "note": "write_index advances to 1" },
    { "line": 4, "vars": { "current_num": 0, "write_index": 1 }, "note": "Second iteration: current_num=0" },
    { "line": 5, "vars": { "current_num": 0, "write_index": 1 }, "note": "0 == nums[0]=0 → DUPLICATE, skip" },
    { "line": 4, "vars": { "current_num": 1, "write_index": 1 }, "note": "Third iteration: current_num=1" },
    { "line": 5, "vars": { "current_num": 1, "write_index": 1 }, "note": "1 != nums[0]=0 → condition TRUE, write 1" },
    { "line": 6, "vars": { "nums": "[0,1,1,1,2]", "write_index": 2 }, "note": "write_index advances to 2" },
    { "line": 4, "vars": { "current_num": 1, "write_index": 2 }, "note": "Fourth iteration: current_num=1" },
    { "line": 5, "vars": { "current_num": 1, "write_index": 2 }, "note": "1 == nums[1]=1 → DUPLICATE, skip" },
    { "line": 4, "vars": { "current_num": 2, "write_index": 2 }, "note": "Fifth iteration: current_num=2" },
    { "line": 5, "vars": { "current_num": 2, "write_index": 2 }, "note": "2 != nums[1]=1 → condition TRUE, write 2" },
    { "line": 6, "vars": { "nums": "[0,1,2,1,2]", "write_index": 3 }, "note": "write_index advances to 3" },
    { "line": 8, "vars": { "write_index": 3 }, "note": "Return 3. nums[:3] = [0, 1, 2] ✓", "stdout": "3" }
  ],
  "speed": 800
}
\`\`\`

## Complexity Analysis

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Time Complexity",
      "icon": "⏱️",
      "content": "**O(n)** — We make a single pass through the array. Each element is visited exactly once by the fast pointer. The write pointer only advances forward and never backtracks.\\n\\n- n = length of input array\\n- No nested loops, no repeated comparisons"
    },
    {
      "label": "Space Complexity",
      "icon": "💾",
      "content": "**O(1)** — The modification is done **in-place**. We use only two integer variables (\`write_index\` and \`current_num\`), regardless of input size.\\n\\nCompare this to the hash set approach:\\n- Hash set: O(n) space (stores all unique elements)\\n- Two pointers: O(1) space ✓"
    },
    {
      "label": "Why Not Hash Set?",
      "icon": "🚫",
      "content": "The hash set approach works for **unsorted** arrays — it's versatile. But for a **sorted** array, it wastes memory.\\n\\nSorted arrays give us a structural guarantee: duplicates are adjacent. We exploit this to reduce space from O(n) → O(1) with a direct comparison instead of a lookup."
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "LeetCode Contract: Return k, Not the Array",
  "content": "On LeetCode problem #26, the judge checks \`nums[:k]\`, not the full array. You must return the **integer count** of unique elements (\`write_index\`). The judge ignores everything after index \`k-1\` in the modified array."
}
\`\`\`

## Contrast: Before & After

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Hash Set Approach — O(n) Space",
    "code": "def remove_duplicates_hashset(nums):\\n    seen = set()\\n    write_index = 0\\n    for num in nums:\\n        if num not in seen:\\n            seen.add(num)\\n            nums[write_index] = num\\n            write_index += 1\\n    return write_index\\n# Extra O(n) memory for \`seen\`"
  },
  "after": {
    "label": "Two Pointer — O(1) Space",
    "code": "def remove_duplicates(nums):\\n    write_index = 0\\n    for current_num in nums:\\n        if write_index == 0 or current_num != nums[write_index - 1]:\\n            nums[write_index] = current_num\\n            write_index += 1\\n    return write_index\\n# No extra memory — exploits sorted order"
  }
}
\`\`\`

## Practice: Fill in the Blanks

\`\`\`fillblank
{
  "title": "Complete the Two-Pointer Solution",
  "prompt": "Fill in the missing parts of the remove_duplicates function:",
  "language": "python",
  "template": "def remove_duplicates(nums):\\n    write_index = ___\\n\\n    for current_num in nums:\\n        if write_index == 0 or current_num != nums[___ - 1]:\\n            nums[write_index] = ___\\n            write_index += ___\\n\\n    return write_index",
  "blanks": [
    { "answer": "0", "hint": "The write pointer starts at the beginning of the array" },
    { "answer": "write_index", "hint": "We compare with the last position that was written" },
    { "answer": "current_num", "hint": "We write the current (unique) element to the write position" },
    { "answer": "1", "hint": "The write pointer advances by one slot each time we write" }
  ]
}
\`\`\`

## Edge Cases to Know

\`\`\`collapse
{
  "title": "Deep Dive: Edge Cases & Boundary Conditions",
  "content": "**Empty array** → return 0 immediately. The \`if not nums\` guard handles this.\\n\\n**Single element** → write_index starts at 0. The condition \`write_index == 0\` fires, we write it, write_index becomes 1. Return 1. Correct.\\n\\n**All duplicates** (e.g., \`[2,2,2,2]\`) → Only the first element passes the condition. write_index reaches 1. Return 1. Array becomes \`[2, ...]\`.\\n\\n**All unique** (e.g., \`[1,2,3,4]\`) → Every element is different from the previous one. write_index reaches len(nums). Return n. Array is unchanged.\\n\\n**Two-element duplicates** (e.g., \`[1,1]\`) → write_index=0 triggers write of first 1. Second 1 matches nums[0]=1, skipped. Return 1."
}
\`\`\`

## Knowledge Check

\`\`\`quiz
{
  "title": "Remove Duplicates: Check Your Understanding",
  "questions": [
    {
      "question": "Given nums = [1, 1, 1, 2, 2, 3], what does remove_duplicates(nums) return?",
      "options": ["2", "3", "6", "4"],
      "answer": 1,
      "explanation": "The unique elements are [1, 2, 3] — that's 3 unique values. The function returns 3, and nums[:3] = [1, 2, 3]."
    },
    {
      "question": "Why can we compare current_num with nums[write_index - 1] instead of maintaining a separate 'last seen' variable?",
      "options": [
        "Because we always overwrite the same slot",
        "Because the array is sorted, so the last written unique element is always at nums[write_index - 1]",
        "Because write_index - 1 always points to the original element",
        "This is just a style choice — both approaches are identical"
      ],
      "answer": 1,
      "explanation": "Every element we write is placed sequentially starting at index 0. So the most recently written unique element is always at nums[write_index - 1]. We can read it directly without a separate variable."
    },
    {
      "question": "What is the space complexity of the two-pointer approach compared to the hash set approach?",
      "options": [
        "Both are O(n)",
        "Two pointers: O(n), hash set: O(1)",
        "Two pointers: O(1), hash set: O(n)",
        "Both are O(1)"
      ],
      "answer": 2,
      "explanation": "The two-pointer approach uses O(1) space — only two integer variables regardless of input size. The hash set stores up to n unique elements, so it uses O(n) space."
    },
    {
      "question": "What happens to elements after index write_index - 1 in the modified array?",
      "options": [
        "They are set to 0",
        "They are deleted from memory",
        "They can be any value — the problem only cares about the first k elements",
        "They retain their original sorted values"
      ],
      "answer": 2,
      "explanation": "The problem contract only cares about nums[:k] (the first k unique elements). Whatever remains after index k-1 is irrelevant — the judge ignores it entirely."
    },
    {
      "question": "If nums = [3, 3, 3, 3, 3], what is write_index after the loop completes?",
      "options": ["0", "1", "5", "4"],
      "answer": 1,
      "explanation": "The first element (3) passes the condition \`write_index == 0\` and gets written. write_index becomes 1. All subsequent 3s match nums[0]=3 and are skipped. Final write_index = 1."
    }
  ]
}
\`\`\`

## Common Mistakes

\`\`\`callout
{
  "type": "danger",
  "title": "Don't Start write_index at 1",
  "content": "A common mistake is initialising \`write_index = 1\` (to skip the first element) and starting the loop at index 1. While this can work, it breaks on edge cases like a single-element array or an array where the loop must compare index 0. The \`write_index == 0\` condition in the guard handles initialisation cleanly — start both at 0."
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "This Pattern Generalises",
  "content": "This exact slow/fast pointer structure solves related variants:\\n- **Remove all instances of a value** — change the condition to \`current_num != target\`\\n- **Allow at most k duplicates** — compare \`current_num\` against \`nums[write_index - k]\` instead of \`nums[write_index - 1]\`\\n\\nLearning this pattern unlocks a whole family of in-place array problems."
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use a slow (write) pointer and a fast (read) pointer on the same array — no extra data structures needed.",
    "The sorted property means duplicates are adjacent, so a single comparison with nums[write_index - 1] is sufficient to detect them.",
    "Time complexity is O(n) — one pass. Space complexity is O(1) — in-place modification with two integer variables.",
    "Return write_index (the count of unique elements), not the array itself. The first write_index slots hold the answer.",
    "The pattern generalises: changing the write condition lets you solve 'remove element', 'allow k duplicates', and other in-place variants."
  ]
}
\`\`\``,
      starterCode: `def remove_duplicates(nums):
    """
    Remove duplicates from a sorted array in-place.
    Return the length of the array after removing duplicates.
    
    Use two pointers:
    - slow: marks the boundary of the unique elements
    - fast: scans ahead to find the next unique element
    
    Example:
        Input:  [1, 1, 2, 3, 3, 4]
        Output: 4  (array becomes [1, 2, 3, 4, ...])
    """
    if not nums:
        return 0
    
    # TODO: Initialize the slow pointer at index 0
    # (it points to the last known unique element)
    
    # TODO: Loop with the fast pointer from index 1 to end of array
    
        # TODO: If the element at fast differs from the element at slow,
        #       a new unique value has been found.
        #       - Advance slow by 1
        #       - Copy the unique value into nums[slow]
    
    # TODO: Return the count of unique elements (slow + 1)
    pass


# --- Tests ---
if __name__ == "__main__":
    assert remove_duplicates([1, 1, 2, 3, 3, 4]) == 4
    assert remove_duplicates([1, 1, 1]) == 1
    assert remove_duplicates([1, 2, 3]) == 3
    assert remove_duplicates([]) == 0
    assert remove_duplicates([5]) == 1
    print("All tests passed!")`,
      solutionCode: `def remove_duplicates(nums):
    """
    Remove duplicates from a sorted array in-place.
    Return the length of the array after removing duplicates.
    
    Time:  O(n) — single pass with fast pointer
    Space: O(1) — no extra memory, only two index variables
    """
    if not nums:
        return 0
    
    # slow marks the tail of the unique-elements window.
    # Everything at index <= slow is already deduplicated.
    slow = 0
    
    # fast scans every element looking for values that differ
    # from the current unique tail.
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            # Found a new unique value — extend the window.
            slow += 1
            nums[slow] = nums[fast]
    
    # The unique section spans indices 0..slow (inclusive),
    # so its length is slow + 1.
    return slow + 1


# --- Tests ---
if __name__ == "__main__":
    assert remove_duplicates([1, 1, 2, 3, 3, 4]) == 4
    assert remove_duplicates([1, 1, 1]) == 1
    assert remove_duplicates([1, 2, 3]) == 3
    assert remove_duplicates([]) == 0
    assert remove_duplicates([5]) == 1
    print("All tests passed!")`,
    },
    {
      id: "squaring-sorted-array",
      slug: "squaring-sorted-array",
      title: "Squaring a Sorted Array",
      content: `# Squaring a Sorted Array

You're given a sorted array of integers — some negative, some positive. Your task: return a new array of their squares, also sorted.

Sounds trivial. Square everything, sort, done. But that costs **O(n log n)**. The two-pointer technique solves this in **O(n)** by exploiting the structure that's already there.

\`\`\`concept
{ "title": "The Core Insight", "variant": "insight", "content": "In a sorted array like [-4, -1, 0, 3, 10], the largest squares live at the two ends — not the middle. -4 squared is 16, and 10 squared is 100. The middle values (near zero) produce the smallest squares. This means we can race two pointers from both ends inward, always picking the larger square." }
\`\`\`

## Why the Naïve Approach Falls Short

Most people's first instinct:

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Naïve — O(n log n)", "code": "def sorted_squares_naive(nums):\\n    return sorted(x * x for x in nums)\\n# Square everything, then sort\\n# Ignores the sorted structure we already have" }, "after": { "label": "Two Pointers — O(n)", "code": "def sorted_squares(nums):\\n    n = len(nums)\\n    result = [0] * n\\n    left, right = 0, n - 1\\n    pos = n - 1  # fill from the end\\n    while left <= right:\\n        if abs(nums[left]) > abs(nums[right]):\\n            result[pos] = nums[left] ** 2\\n            left += 1\\n        else:\\n            result[pos] = nums[right] ** 2\\n            right -= 1\\n        pos -= 1\\n    return result\\n# Fills result from largest to smallest in one pass" } }
\`\`\`

The sorted approach throws away information. The two-pointer approach uses the sorted order as a **roadmap** — the largest magnitude values are always at the extremes.

## Visualising the Algorithm

Watch the two pointers converge on \`[-4, -1, 0, 3, 10]\`:

\`\`\`algoviz
{ "title": "Two Pointers on [-4, -1, 0, 3, 10]", "type": "array", "data": [-4, -1, 0, 3, 10], "frames": [ { "highlight": [0, 4], "label": "Init: left=0 (-4), right=4 (10). Compare |−4|=4 vs |10|=10. Right wins → place 100 at result[4]", "stats": { "left": 0, "right": 4, "pos": 4 } }, { "highlight": [0, 3], "label": "left=0 (-4), right=3 (3). Compare |−4|=4 vs |3|=3. Left wins → place 16 at result[3]", "stats": { "left": 0, "right": 3, "pos": 3 } }, { "highlight": [1, 3], "label": "left=1 (-1), right=3 (3). Compare |−1|=1 vs |3|=3. Right wins → place 9 at result[2]", "stats": { "left": 1, "right": 3, "pos": 2 } }, { "highlight": [1, 2], "label": "left=1 (-1), right=2 (0). Compare |−1|=1 vs |0|=0. Left wins → place 1 at result[1]", "stats": { "left": 1, "right": 2, "pos": 1 } }, { "highlight": [2, 2], "label": "left=2 (0), right=2 (0). Equal — place 0 at result[0]. Pointers cross. Done!", "stats": { "left": 2, "right": 2, "pos": 0 } } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why fill from the back?", "content": "We always know which end produces the *largest* remaining square — but we don't know the *smallest* yet. So we fill the result array from the largest position downward. Each step, we compare the two candidates and commit the bigger one." }
\`\`\`

## Step-by-Step Algorithm

\`\`\`steps
{ "title": "Building the Solution", "steps": [ { "title": "Set up three pointers", "content": "- \`left = 0\` — points to the leftmost (most negative) element\\n- \`right = len(nums) - 1\` — points to the rightmost (most positive) element\\n- \`pos = len(nums) - 1\` — the position in the result array we are about to fill\\n\\nAllocate \`result = [0] * n\` upfront so we can index directly." }, { "title": "Compare absolute values", "content": "In each iteration, compare \`abs(nums[left])\` vs \`abs(nums[right])\`.\\n\\nThe one with the **larger absolute value** produces the larger square — place that square at \`result[pos]\` and move the corresponding pointer inward." }, { "title": "Advance the winning pointer", "content": "- If left had the larger absolute value: \`left += 1\`\\n- If right had the larger absolute value: \`right -= 1\`\\n- If they're equal (a tie): break the tie either way — say, right first\\n\\nThen decrement \`pos -= 1\` to move to the next slot." }, { "title": "Stop when pointers cross", "content": "Loop condition: \`while left <= right\`.\\n\\nWhen \`left > right\`, every element has been processed exactly once. The result array is filled from index \`n-1\` down to \`0\`, so it's already sorted ascending — no extra sort needed." } ] }
\`\`\`

## Tracing Through the Code

\`\`\`trace
{ "title": "Trace: nums = [-4, -1, 0, 3, 10]", "language": "python", "code": "def sorted_squares(nums):\\n    n = len(nums)\\n    result = [0] * n\\n    left, right = 0, n - 1\\n    pos = n - 1\\n    while left <= right:\\n        if abs(nums[left]) > abs(nums[right]):\\n            result[pos] = nums[left] ** 2\\n            left += 1\\n        else:\\n            result[pos] = nums[right] ** 2\\n            right -= 1\\n        pos -= 1\\n    return result", "frames": [ { "line": 2, "vars": { "n": 5 }, "note": "Array has 5 elements" }, { "line": 3, "vars": { "result": "[0,0,0,0,0]" }, "note": "Allocate result array" }, { "line": 4, "vars": { "left": 0, "right": 4, "pos": 4 }, "note": "Three pointers initialised" }, { "line": 6, "vars": { "left": 0, "right": 4 }, "note": "abs(-4)=4, abs(10)=10 → else branch" }, { "line": 10, "vars": { "result": "[0,0,0,0,100]", "right": 3, "pos": 3 }, "note": "10²=100 placed at result[4]" }, { "line": 6, "vars": { "left": 0, "right": 3 }, "note": "abs(-4)=4, abs(3)=3 → if branch" }, { "line": 8, "vars": { "result": "[0,0,0,16,100]", "left": 1, "pos": 2 }, "note": "(-4)²=16 placed at result[3]" }, { "line": 6, "vars": { "left": 1, "right": 3 }, "note": "abs(-1)=1, abs(3)=3 → else branch" }, { "line": 10, "vars": { "result": "[0,0,9,16,100]", "right": 2, "pos": 1 }, "note": "3²=9 placed at result[2]" }, { "line": 6, "vars": { "left": 1, "right": 2 }, "note": "abs(-1)=1, abs(0)=0 → if branch" }, { "line": 8, "vars": { "result": "[0,1,9,16,100]", "left": 2, "pos": 0 }, "note": "(-1)²=1 placed at result[1]" }, { "line": 6, "vars": { "left": 2, "right": 2 }, "note": "abs(0)=0, abs(0)=0 → else branch (tie)" }, { "line": 10, "vars": { "result": "[0,1,9,16,100]", "right": 1, "pos": -1 }, "note": "0²=0 placed at result[0]" }, { "line": 13, "vars": { "result": "[0,1,9,16,100]" }, "note": "left(2) > right(1) — loop exits. Return sorted result!", "stdout": "[0, 1, 9, 16, 100]" } ], "speed": 900 }
\`\`\`

## Try It Yourself

\`\`\`playground
{ "title": "Squaring a Sorted Array", "language": "python", "code": "def sorted_squares(nums):\\n    n = len(nums)\\n    result = [0] * n\\n    left, right = 0, n - 1\\n    pos = n - 1\\n\\n    while left <= right:\\n        if abs(nums[left]) > abs(nums[right]):\\n            result[pos] = nums[left] ** 2\\n            left += 1\\n        else:\\n            result[pos] = nums[right] ** 2\\n            right -= 1\\n        pos -= 1\\n\\n    return result\\n\\n\\n# Test cases\\nprint(sorted_squares([-4, -1, 0, 3, 10]))   # [0, 1, 9, 16, 100]\\nprint(sorted_squares([-7, -3, 2, 3, 11]))   # [4, 9, 9, 49, 121]\\nprint(sorted_squares([-5, -3, -1]))          # [1, 9, 25]\\nprint(sorted_squares([1, 2, 3, 4]))          # [1, 4, 9, 16]\\nprint(sorted_squares([]))                    # []\\nprint(sorted_squares([0]))                   # [0]", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Edge Cases to Handle", "content": "- **All negatives** (e.g. \`[-5, -3, -1]\`): the left pointer always wins — both pointers march rightward. The algorithm still works because \`abs(-5) > abs(-3) > abs(-1)\`.\\n- **All positives** (e.g. \`[1, 2, 3, 4]\`): the right pointer always wins — both march leftward.\\n- **Empty array**: the while condition is false immediately, and you return an empty list — no crash." }
\`\`\`

## Complexity Analysis

\`\`\`tabs
{ "tabs": [ { "label": "Time", "icon": "⏱️", "content": "**O(n)** — we visit each element exactly once. The single while loop runs at most \`n\` iterations (one per element), since each iteration either advances \`left\` or retreats \`right\`.\\n\\nContrast with the naïve approach: \`sorted()\` costs **O(n log n)** even if you square first." }, { "label": "Space", "icon": "💾", "content": "**O(n)** — we allocate a new result array of size \`n\`.\\n\\nThis is unavoidable: the output itself is O(n). We do **not** count the output in auxiliary space analysis, so the *extra* space (beyond input and output) is **O(1)** — just the three integer pointers." }, { "label": "Why Not In-Place?", "icon": "🤔", "content": "Can we square in-place? Not while maintaining the two-pointer approach — overwriting elements we haven't read yet would corrupt the comparison logic.\\n\\nThe in-place naïve approach (\`nums[i] = nums[i]**2\` then \`nums.sort()\`) works but costs O(n log n). The two-pointer method requires the output array." } ] }
\`\`\`

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the Two-Pointer Solution", "prompt": "Fill in the missing pieces of the sorted squares algorithm:", "language": "python", "template": "def sorted_squares(nums):\\n    n = len(nums)\\n    result = [0] * n\\n    left, right = ___, n - 1\\n    pos = ___\\n\\n    while left <= right:\\n        if abs(nums[left]) > abs(nums[right]):\\n            result[pos] = nums[left] ** ___\\n            left += 1\\n        else:\\n            result[pos] = nums[right] ** 2\\n            ___ -= 1\\n        pos -= 1\\n\\n    return result", "blanks": [ { "answer": "0", "hint": "Start the left pointer at the beginning of the array" }, { "answer": "n - 1", "hint": "We fill the result from the last position downward" }, { "answer": "2", "hint": "Squaring means raising to the power of what?" }, { "answer": "right", "hint": "When the right element wins, which pointer moves inward?" } ] }
\`\`\`

## Collapse: What If the Array Has Duplicates?

\`\`\`collapse
{ "title": "Deep Dive: Duplicates, Ties, and Stability", "content": "**Duplicate values** are handled cleanly. If \`nums[left]\` and \`nums[right]\` have the same absolute value, the \`else\` branch fires (we placed \`>\` not \`>=\`), so the right element is placed first. Both elements will eventually be placed — you can verify with \`[-3, 0, 3]\`:\\n\\n- left=0 (-3), right=2 (3): tie → place 9, right=1\\n- left=0 (-3), right=1 (0): abs(-3)=3 > abs(0)=0 → place 9, left=1\\n- left=1 (0), right=1 (0): tie → place 0, right=0\\n- left(1) > right(0): done. Result: [0, 9, 9] ✓\\n\\n**Is the order of tie-breaking important?** No — both squares are identical, so swapping them doesn't affect the result.\\n\\n**What if you need the original elements (not just squares)?** The same two-pointer skeleton works — instead of squaring, store a tuple \`(square, original_value)\` and return the values afterward." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "Given nums = [-7, -3, 2, 3, 11], what is result[4] (the last element) after the algorithm completes?", "options": ["9", "49", "121", "9 or 49 (tie)"], "answer": 2, "explanation": "result[4] is the largest square. abs(-7)=7 vs abs(11)=11 — the right pointer (11) wins first. 11²=121 is placed at result[4]." }, { "question": "Why do we fill the result array from back to front (pos = n-1)?", "options": ["To avoid using extra memory", "Because we always know the largest remaining square, not the smallest", "To make the loop condition simpler", "Python lists are faster to append at the end"], "answer": 1, "explanation": "At each step we can identify the maximum of the two candidates (leftmost vs rightmost absolute value), but not the minimum. Filling from the back lets us commit the largest value immediately without needing to know what comes next." }, { "question": "What is the time complexity of the two-pointer approach compared to the naïve square-then-sort approach?", "options": ["Both are O(n log n)", "Two-pointer is O(n), naïve is O(n log n)", "Two-pointer is O(n²), naïve is O(n log n)", "Both are O(n)"], "answer": 1, "explanation": "The two-pointer approach visits each element exactly once in a single while loop — O(n). The naïve approach uses Python's sort(), which is O(n log n) via Timsort. The two-pointer approach is strictly faster for large inputs." }, { "question": "What happens when all elements in the input array are positive, e.g. [1, 2, 3, 4]?", "options": ["The algorithm fails — left never wins", "The right pointer wins every comparison and marches leftward", "The algorithm degrades to O(n log n)", "We need a special case for all-positive arrays"], "answer": 1, "explanation": "When all elements are positive, nums[right] always has the larger absolute value (since right points to the largest element in a sorted positive array). The else branch fires every iteration, right decrements each time, and we fill result[n-1] down to result[0] correctly. No special case needed." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "In a sorted array, the largest squares are always at the two ends — the two-pointer pattern exploits this structure.", "Fill the result array from back to front: you always know the next largest square, but never the next smallest.", "Time complexity is O(n) — one pass — versus O(n log n) for square-then-sort. Space is O(n) for the output array.", "Negative-only and positive-only arrays are natural edge cases; the algorithm handles them without modification.", "The same back-to-front fill pattern appears in merge sort's merge step — recognise it as a building block." ] }
\`\`\``,
      starterCode: `def sorted_squares(nums: list[int]) -> list[int]:
    """
    Given a sorted array of integers (may include negatives),
    return a new array of the squares of each number, also in sorted order.

    Example:
        Input:  [-4, -1, 0, 3, 10]
        Output: [0, 1, 9, 16, 100]

    Constraints:
        - Do NOT sort the output array after squaring (that would be O(n log n))
        - Use two pointers from both ends to achieve O(n) time
        - Do not modify the input array
    """
    n = len(nums)
    result = [0] * n

    # TODO 1: Initialize two pointers — one at the start, one at the end
    left = ...
    right = ...

    # TODO 2: We'll fill result from the back (largest values first)
    # Start the fill index at the last position
    fill = ...

    # TODO 3: Loop while left pointer hasn't crossed right pointer
    while ...:
        left_sq = nums[left] ** 2
        right_sq = nums[right] ** 2

        # TODO 4: Compare left_sq and right_sq.
        # Place the LARGER square at result[fill], then move the
        # corresponding pointer inward and decrement fill.
        if left_sq > right_sq:
            result[fill] = ...
            left += ...
        else:
            result[fill] = ...
            right -= ...

        fill -= 1

    return result


# --- tests ---
if __name__ == "__main__":
    assert sorted_squares([-4, -1, 0, 3, 10]) == [0, 1, 9, 16, 100]
    assert sorted_squares([-7, -3, 2, 3, 11]) == [4, 9, 9, 49, 121]
    assert sorted_squares([-5, -3, -1])        == [1, 9, 25]
    assert sorted_squares([1, 2, 3])            == [1, 4, 9]
    assert sorted_squares([0])                  == [0]
    print("All tests passed!")
`,
      solutionCode: `def sorted_squares(nums: list[int]) -> list[int]:
    """
    Squares all elements of a sorted array and returns them in sorted order.

    Key insight: the largest squares always live at one of the two ends of a
    sorted array (either a large positive or a large-magnitude negative).
    By comparing the two ends with two pointers and filling the result array
    from back to front we get O(n) time with O(n) space for the output.

    Time:  O(n)
    Space: O(n)  — for the result array; O(1) extra
    """
    n = len(nums)
    result = [0] * n

    left = 0          # points to the smallest (leftmost) element
    right = n - 1     # points to the largest  (rightmost) element
    fill = n - 1      # we place the next largest square here

    while left <= right:
        left_sq  = nums[left]  ** 2
        right_sq = nums[right] ** 2

        if left_sq > right_sq:
            # Left end has the bigger square; record it and move left inward
            result[fill] = left_sq
            left += 1
        else:
            # Right end has the bigger (or equal) square; record and move right inward
            result[fill] = right_sq
            right -= 1

        fill -= 1   # next largest square goes one position earlier

    return result


# --- tests ---
if __name__ == "__main__":
    assert sorted_squares([-4, -1, 0, 3, 10]) == [0, 1, 9, 16, 100]
    assert sorted_squares([-7, -3, 2, 3, 11]) == [4, 9, 9, 49, 121]
    assert sorted_squares([-5, -3, -1])        == [1, 9, 25]   # all negatives
    assert sorted_squares([1, 2, 3])            == [1, 4, 9]   # all positives
    assert sorted_squares([0])                  == [0]         # single element
    print("All tests passed!")
`,
    },
    {
      id: "triplet-sum-to-zero",
      slug: "triplet-sum-to-zero",
      title: "Triplet Sum to Zero (3Sum)",
      content: `# Triplet Sum to Zero (3Sum)

You've mastered finding pairs that sum to a target. Now the challenge escalates: find **all unique triplets** in an array that add up to zero.

The naive approach — check every combination of three elements — runs in O(N³). With the two-pointer technique applied inside a loop, we can slash that to **O(N²)**. This is one of the most frequently asked medium problems in technical interviews at top companies.

\`\`\`concept
{ "title": "The Core Insight", "variant": "mental-model", "content": "Reduce 3Sum to repeated 2Sum problems. Fix one number with an outer loop, then use two pointers on the remaining subarray to find a pair that sums to the negation of that fixed number. If nums[i] + nums[left] + nums[right] == 0, you need nums[left] + nums[right] == -nums[i]." }
\`\`\`

## Why Sorting Is the Key

Before any pointer work, **sort the array**. Sorting costs O(N log N) but unlocks two critical abilities:

1. **Directional movement**: If the current sum is too small, move the left pointer right (increase the sum). If too large, move right pointer left (decrease it).
2. **Duplicate skipping**: Equal adjacent values in a sorted array let you skip them with a single comparison, guaranteeing unique triplets without a hash set.

\`\`\`callout
{ "type": "warning", "title": "The Duplicate Trap", "content": "Without duplicate skipping, [-1, -1, 0, 1, 2] would produce [-1, -1, 2] twice and [-1, 0, 1] twice. You must skip duplicate values at **both** the outer loop index and the two-pointer positions after finding a valid triplet." }
\`\`\`

## Algorithm Walkthrough

Let's trace through \`nums = [-3, -1, 0, 1, 2, 4]\` step by step.

\`\`\`steps
{ "title": "3Sum Algorithm", "steps": [ { "title": "Sort the array", "content": "Sort \`nums\` in ascending order.\\n\\nResult: \`[-3, -1, 0, 1, 2, 4]\` (already sorted)\\n\\nNow we can use directional pointer movement." }, { "title": "Fix the outer pointer i", "content": "Start with \`i = 0\`, so \`nums[i] = -3\`.\\n\\nWe need two numbers from the rest of the array that sum to \`+3\`.\\n\\nSet \`left = i + 1 = 1\` and \`right = len(nums) - 1 = 5\`." }, { "title": "Run two pointers inward", "content": "- \`nums[1] + nums[5] = -1 + 4 = 3\` ✅ → triplet \`[-3, -1, 4]\` found! Advance left, retreat right.\\n- \`nums[2] + nums[4] = 0 + 2 = 2\` → sum too small, move left.\\n- \`nums[3] + nums[4] = 1 + 2 = 3\` ✅ → triplet \`[-3, 1, 2]\` found!\\n- \`left == right\` → inner loop done." }, { "title": "Advance outer pointer, skip duplicates", "content": "Move to \`i = 1\`, \`nums[i] = -1\`. Need pairs summing to \`+1\`.\\n\\n- \`nums[2] + nums[5] = 0 + 4 = 4\` → too big, move right.\\n- \`nums[2] + nums[4] = 0 + 2 = 2\` → too big, move right.\\n- \`nums[2] + nums[3] = 0 + 1 = 1\` ✅ → triplet \`[-1, 0, 1]\` found!" }, { "title": "Continue until i reaches the third-to-last element", "content": "For \`i = 2\`, \`nums[i] = 0\`. Need pairs summing to \`0\`.\\n\\n- No valid pair found in remaining \`[1, 2, 4]\`.\\n\\nFor \`i = 3\`, \`nums[i] = 1\` → remaining values are all positive, sum can only grow. Break early if \`nums[i] > 0\`.\\n\\nFinal result: \`[[-3, -1, 4], [-3, 1, 2], [-1, 0, 1]]\`" } ] }
\`\`\`

## Visual Execution

Watch how the pointers move through a concrete example:

\`\`\`algoviz
{ "title": "3Sum on [-2, -1, 0, 1, 2, 3]", "type": "array", "data": [-2, -1, 0, 1, 2, 3], "frames": [ { "highlight": [0, 1, 5], "label": "i=0 (-2), left=1 (-1), right=5 (3). Sum=-2+-1+3=0 ✅ Triplet found!", "stats": { "i": 0, "left": 1, "right": 5, "sum": 0 } }, { "highlight": [0, 2, 4], "label": "Advance left→2, retreat right→4. Sum=-2+0+2=0 ✅ Another triplet!", "stats": { "i": 0, "left": 2, "right": 4, "sum": 0 } }, { "highlight": [0, 3, 3], "label": "left=3, right=3: pointers crossed. Move outer i forward.", "stats": { "i": 0, "left": 3, "right": 3, "sum": "N/A" } }, { "highlight": [1, 2, 5], "label": "i=1 (-1), left=2 (0), right=5 (3). Sum=-1+0+3=2 > 0, move right.", "stats": { "i": 1, "left": 2, "right": 5, "sum": 2 } }, { "highlight": [1, 2, 4], "label": "right=4 (2). Sum=-1+0+2=1 > 0, move right.", "stats": { "i": 1, "left": 2, "right": 4, "sum": 1 } }, { "highlight": [1, 2, 3], "label": "right=3 (1). Sum=-1+0+1=0 ✅ Triplet found!", "stats": { "i": 1, "left": 2, "right": 3, "sum": 0 } }, { "highlight": [2, 3, 5], "label": "i=2 (0), left=3 (1), right=5 (3). Sum=0+1+3=4 > 0, move right.", "stats": { "i": 2, "left": 3, "right": 5, "sum": 4 } }, { "highlight": [2, 3, 4], "label": "right=4 (2). Sum=0+1+2=3 > 0, move right.", "stats": { "i": 2, "left": 3, "right": 4, "sum": 3 } }, { "highlight": [3], "label": "i=3 (1) > 0 and array is sorted → all future sums positive. Done!", "stats": { "i": 3, "left": "—", "right": "—", "sum": "N/A" } } ], "speed": 900 }
\`\`\`

## The Code

\`\`\`playground
{ "title": "Triplet Sum to Zero", "language": "python", "code": "def three_sum(nums):\\n    nums.sort()\\n    triplets = []\\n    n = len(nums)\\n\\n    for i in range(n - 2):\\n        # Skip duplicate values for the outer pointer\\n        if i > 0 and nums[i] == nums[i - 1]:\\n            continue\\n\\n        # Early exit: smallest possible sum is already positive\\n        if nums[i] > 0:\\n            break\\n\\n        left, right = i + 1, n - 1\\n\\n        while left < right:\\n            current_sum = nums[i] + nums[left] + nums[right]\\n\\n            if current_sum == 0:\\n                triplets.append([nums[i], nums[left], nums[right]])\\n                left += 1\\n                right -= 1\\n                # Skip duplicate values for left pointer\\n                while left < right and nums[left] == nums[left - 1]:\\n                    left += 1\\n                # Skip duplicate values for right pointer\\n                while left < right and nums[right] == nums[right + 1]:\\n                    right -= 1\\n\\n            elif current_sum < 0:\\n                left += 1   # Sum too small, need larger value\\n            else:\\n                right -= 1  # Sum too large, need smaller value\\n\\n    return triplets\\n\\n\\n# Test cases\\nprint(three_sum([-3, 0, 1, 2, -1, 1, -2]))\\n# Expected: [[-3, 1, 2], [-2, 0, 2], [-2, 1, 1], [-1, 0, 1]]\\n\\nprint(three_sum([-5, 2, -1, -2, 3]))\\n# Expected: [[-5, 2, 3], [-2, -1, 3]]\\n\\nprint(three_sum([0, 0, 0]))\\n# Expected: [[0, 0, 0]]\\n\\nprint(three_sum([1, 2, 3]))\\n# Expected: [] (no triplets sum to zero)\\n", "runnable": true }
\`\`\`

## Step-by-Step Trace

Watch every variable change as we process \`[-1, 0, 1, 2, -1, -4]\`:

\`\`\`trace
{ "title": "Tracing [-1, 0, 1, 2, -1, -4]", "language": "python", "code": "nums = [-1, 0, 1, 2, -1, -4]\\nnums.sort()\\n# nums = [-4, -1, -1, 0, 1, 2]\\nresult = []\\n\\n# i=0, nums[0]=-4\\nleft, right = 1, 5\\n# -4 + -1 + 2 = -3 < 0 → left++\\nleft = 2\\n# -4 + -1 + 2 = -3 < 0 → left++\\nleft = 3\\n# -4 + 0 + 2 = -2 < 0 → left++\\nleft = 4\\n# -4 + 1 + 2 = -1 < 0 → left++\\nleft = 5  # left==right, inner loop ends\\n\\n# i=1, nums[1]=-1\\nleft, right = 2, 5\\n# -1 + -1 + 2 = 0 → FOUND! append [-1,-1,2]\\nresult = [[-1, -1, 2]]\\nleft, right = 3, 4\\n# -1 + 0 + 1 = 0 → FOUND! append [-1,0,1]\\nresult = [[-1, -1, 2], [-1, 0, 1]]\\nleft, right = 4, 3  # left>right, inner loop ends\\n\\n# i=2, nums[2]=-1 == nums[1]=-1 → SKIP DUPLICATE\\n\\n# i=3, nums[3]=0\\nleft, right = 4, 5\\n# 0 + 1 + 2 = 3 > 0 → right--\\nright = 4  # left==right, inner loop ends\\n\\n# i=4 would be n-2=4, loop ends\\nprint(result)  # [[-1,-1,2],[-1,0,1]]", "frames": [ { "line": 2, "vars": { "nums": "[-4,-1,-1,0,1,2]" }, "note": "Sorted! Duplicates are now adjacent." }, { "line": 6, "vars": { "i": 0, "left": 1, "right": 5, "nums[i]": -4 }, "note": "Outer loop starts. Need pair summing to +4." }, { "line": 9, "vars": { "sum": -3, "left": 2 }, "note": "-4 + -1 + 2 = -3. Too small, advance left." }, { "line": 12, "vars": { "sum": -2, "left": 3 }, "note": "-4 + 0 + 2 = -2. Still too small." }, { "line": 14, "vars": { "sum": -1, "left": 4 }, "note": "-4 + 1 + 2 = -1. Still too small." }, { "line": 17, "vars": { "i": 1, "left": 2, "right": 5 }, "note": "i=1, nums[1]=-1. Need pair summing to +1." }, { "line": 20, "vars": { "sum": 0 }, "note": "-1 + -1 + 2 = 0. TRIPLET FOUND!" }, { "line": 21, "vars": { "result": "[[-1,-1,2]]", "left": 3, "right": 4 }, "note": "Recorded [-1,-1,2]. Both pointers moved inward." }, { "line": 24, "vars": { "sum": 0 }, "note": "-1 + 0 + 1 = 0. Another TRIPLET FOUND!" }, { "line": 25, "vars": { "result": "[[-1,-1,2],[-1,0,1]]", "left": 4, "right": 3 }, "note": "Recorded [-1,0,1]. Pointers crossed — inner loop ends." }, { "line": 28, "vars": { "i": 2 }, "note": "nums[2]=-1 == nums[1]=-1. DUPLICATE — skip this i." }, { "line": 30, "vars": { "i": 3, "left": 4, "right": 5 }, "note": "i=3, nums[3]=0. Need pair summing to 0." }, { "line": 33, "vars": { "sum": 3, "right": 4 }, "note": "0 + 1 + 2 = 3. Too big, retreat right. left==right, done." } ], "speed": 700 }
\`\`\`

## Brute Force vs Optimised

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Brute Force O(N³)", "code": "def three_sum_brute(nums):\\n    result = set()\\n    n = len(nums)\\n    for i in range(n - 2):\\n        for j in range(i + 1, n - 1):\\n            for k in range(j + 1, n):\\n                if nums[i] + nums[j] + nums[k] == 0:\\n                    triplet = tuple(sorted([nums[i], nums[j], nums[k]]))\\n                    result.add(triplet)\\n    return [list(t) for t in result]\\n\\n# Three nested loops: O(N³) time\\n# Needs a set to deduplicate: O(N) space for set" }, "after": { "label": "Two Pointers O(N²)", "code": "def three_sum(nums):\\n    nums.sort()  # O(N log N)\\n    triplets = []\\n    for i in range(len(nums) - 2):\\n        if i > 0 and nums[i] == nums[i - 1]:\\n            continue  # skip outer duplicates\\n        left, right = i + 1, len(nums) - 1\\n        while left < right:\\n            s = nums[i] + nums[left] + nums[right]\\n            if s == 0:\\n                triplets.append([nums[i], nums[left], nums[right]])\\n                left += 1; right -= 1\\n                while left < right and nums[left] == nums[left-1]:\\n                    left += 1\\n            elif s < 0:\\n                left += 1\\n            else:\\n                right -= 1\\n    return triplets\\n\\n# One outer loop × one inner scan: O(N²) time\\n# No set needed — sorting handles deduplication" } }
\`\`\`

## Complexity Analysis

\`\`\`tabs
{ "tabs": [ { "label": "Time", "icon": "⏱️", "content": "**Sorting:** O(N log N)\\n\\n**Outer loop:** O(N) — iterates through each element once as the fixed number\\n\\n**Inner two-pointer scan:** O(N) — left and right pointers together traverse at most N elements per outer iteration\\n\\n**Total:** O(N log N) + O(N²) = **O(N²)**\\n\\nCompare to brute force O(N³) — for N=1000, that's 10⁶ vs 10⁹ operations. A 1000× speedup!" }, { "label": "Space", "icon": "💾", "content": "**Sorting:** O(log N) to O(N) depending on Python's Timsort implementation\\n\\n**Result list:** O(N) in the worst case — though in practice triplets are sparse\\n\\n**Pointers:** O(1) extra space — just three integer indices\\n\\n**Total auxiliary space:** **O(N)** (dominated by output storage)\\n\\nIf we don't count the output, the algorithm itself uses O(1) extra space." }, { "label": "Edge Cases", "icon": "⚠️", "content": "**All zeros:** \`[0, 0, 0, 0]\` → one triplet \`[0, 0, 0]\`. Duplicate skipping handles this.\\n\\n**All positive / all negative:** No valid triplet exists. The early break (\`if nums[i] > 0\`) optimizes the all-positive case.\\n\\n**Fewer than 3 elements:** Return \`[]\` immediately.\\n\\n**Multiple duplicates:** \`[-2, 0, 0, 2, 2]\` → only \`[-2, 0, 2]\` should appear once. Both inner and outer duplicate skipping are required." } ] }
\`\`\`

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the 3Sum Implementation", "prompt": "Fill in the missing pieces of the two-pointer 3Sum solution:", "language": "python", "template": "def three_sum(nums):\\n    nums.___()  # Step 1: sort\\n    triplets = []\\n    for i in range(len(nums) - 2):\\n        if i > 0 and nums[i] == nums[___]:  # skip outer duplicates\\n            continue\\n        left, right = i + 1, len(nums) - ___\\n        while left < right:\\n            s = nums[i] + nums[left] + nums[right]\\n            if s == 0:\\n                triplets.append([nums[i], nums[left], nums[right]])\\n                left += ___\\n                right -= 1\\n            elif s < 0:\\n                left += 1\\n            else:\\n                right -= ___\\n    return triplets", "blanks": [ { "answer": "sort", "hint": "Sort the array in-place to enable directional pointer movement" }, { "answer": "i - 1", "hint": "Compare current outer value with the previous one to detect duplicates" }, { "answer": "1", "hint": "right starts at the last valid index" }, { "answer": "1", "hint": "After finding a triplet, advance left inward" }, { "answer": "1", "hint": "When sum is too large, decrease the right element" } ] }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Why Skip Duplicates at Both Levels?", "content": "There are two distinct places where duplicates must be skipped:\\n\\n**Level 1 — Outer loop (i):**\\n\\nIf \`nums[i] == nums[i-1]\`, we already found every triplet that can be formed with this value when \`i\` pointed to its first occurrence. Using it again would regenerate all those same triplets.\\n\\n\`\`\`python\\n# Without this check on [-1, -1, 0, 1]:\\n# i=0: finds [-1, 0, 1]\\n# i=1: finds [-1, 0, 1] again → DUPLICATE OUTPUT\\nif i > 0 and nums[i] == nums[i - 1]:\\n    continue\\n\`\`\`\\n\\n**Level 2 — Inner pointers (after finding a triplet):**\\n\\nAfter recording a valid triplet and moving both pointers inward, the new \`nums[left]\` might equal the old \`nums[left]\`. Using it would pair it with the same \`nums[right]\` position to form a duplicate.\\n\\n\`\`\`python\\n# Without this on [-2, -1, -1, 0, 3]:\\n# i=0, finds [-2, -1, 3] when left=1, right=4\\n# left moves to 2, right to 3\\n# -1 + 0 = -1 → not zero, ok\\n# But on [-2, 0, 0, 1, 1]:\\n# i=0, finds [-2, 0, 2] when left=1, right=4\\n# Without skipping: left=2 has same 0 → finds [-2, 0, 2] again!\\nwhile left < right and nums[left] == nums[left - 1]:\\n    left += 1\\n\`\`\`\\n\\n**Key insight:** The outer skip is checked *before* the inner search begins; the inner skip only fires *after* a successful match." }
\`\`\`

## Knowledge Check

\`\`\`quiz
{ "title": "Triplet Sum to Zero", "questions": [ { "question": "What is the time complexity of the optimised two-pointer 3Sum solution?", "options": ["O(N)", "O(N log N)", "O(N²)", "O(N³)"], "answer": 2, "explanation": "The outer loop runs O(N) times. For each iteration, the two-pointer inner scan runs in O(N). Combined: O(N²). The initial sort is O(N log N), which is dominated by O(N²)." }, { "question": "Given nums = [-4, -1, -1, 0, 1, 2], which of the following is a valid unique triplet summing to zero?", "options": ["[-4, 1, 3]", "[-1, -1, 2]", "[-4, 2, 2]", "[0, 1, -1]"], "answer": 1, "explanation": "[-1, -1, 2] sums to 0 and all values exist in the array. [-4, 1, 3] and [-4, 2, 2] use values not present. [0, 1, -1] is also valid but is typically represented sorted as [-1, 0, 1], not [0, 1, -1]." }, { "question": "After finding a valid triplet in the inner loop, both left and right pointers are moved inward. What additional check is needed?", "options": ["Check if the new sum equals zero immediately", "Skip duplicate values at both the left and right positions", "Reset left to i+1 and right to n-1", "Break out of the inner while loop entirely"], "answer": 1, "explanation": "After recording a triplet and advancing both pointers, the new left or right might equal the previous value — which would produce a duplicate triplet. We must advance past all equal adjacent values before continuing the search." }, { "question": "When can you apply an early break to the outer loop?", "options": ["When nums[i] == 0", "When nums[i] > 0", "When i > len(nums) // 2", "When the result list has at least one triplet"], "answer": 1, "explanation": "If nums[i] > 0 and the array is sorted, then nums[left] > nums[i] > 0 and nums[right] > nums[i] > 0. Their sum must be positive — it can never be zero. Breaking early avoids unnecessary iterations." }, { "question": "What is the output of three_sum([0, 0, 0, 0])?", "options": ["[[0, 0, 0], [0, 0, 0]]", "[[0, 0, 0, 0]]", "[[0, 0, 0]]", "[]"], "answer": 2, "explanation": "Only one unique triplet [0, 0, 0] sums to zero. The duplicate-skipping logic ensures we record it exactly once. The outer loop skips i=1,2 since nums[i] == nums[i-1]. The inner loop finds [0,0,0] on the first valid i, then skips the duplicate left values." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Sort first — it enables two-pointer directional movement and makes duplicate detection trivial with O(1) adjacent comparisons.", "Reduce 3Sum to repeated 2Sum: fix nums[i] in an outer loop, then find pairs summing to -nums[i] using two pointers.", "Time complexity is O(N²) — one outer O(N) loop containing an O(N) two-pointer scan. Far better than O(N³) brute force.", "Skip duplicates at two levels: the outer pointer (before the inner loop) and both inner pointers (after recording a triplet) to guarantee unique output.", "Apply an early break when nums[i] > 0: in a sorted array, no remaining combination can sum to zero." ] }
\`\`\``,
      starterCode: `def three_sum(nums):
    """
    Find all unique triplets in nums that sum to zero.
    
    Args:
        nums: List of integers
    Returns:
        List of unique triplets [a, b, c] where a + b + c == 0
    """
    result = []
    
    # TODO 1: Sort the array
    # Sorting enables the two-pointer technique and helps skip duplicates
    
    
    # TODO 2: Iterate through the array with index i
    # Stop early enough that there are at least 3 elements remaining
    for i in range(len(nums) - 2):
        
        # TODO 3: Skip duplicate values for i
        # If nums[i] == nums[i-1], this triplet start was already processed
        
        
        # TODO 4: Set up two pointers
        # left starts just after i, right starts at the end
        
        
        while left < right:
            current_sum = nums[i] + nums[left] + nums[right]
            
            if current_sum == 0:
                # TODO 5: Found a valid triplet — append it to result
                
                
                # TODO 6: Skip duplicates for left pointer
                # Advance left while the next value equals current left value
                
                
                # TODO 7: Skip duplicates for right pointer
                # Move right back while the previous value equals current right value
                
                
                # Move both pointers inward
                left += 1
                right -= 1
            
            elif current_sum < 0:
                # TODO 8: Sum too small — which pointer should move and which direction?
                pass
            
            else:
                # TODO 9: Sum too large — which pointer should move and which direction?
                pass
    
    return result


# Test cases
print(three_sum([-1, 0, 1, 2, -1, -4]))  # Expected: [[-1, -1, 2], [-1, 0, 1]]
print(three_sum([0, 0, 0]))               # Expected: [[0, 0, 0]]
print(three_sum([1, 2, 3]))               # Expected: []
print(three_sum([]))                      # Expected: []`,
      solutionCode: `def three_sum(nums):
    """
    Find all unique triplets in nums that sum to zero.
    
    Approach: Sort + two pointers
    - Sort to enable two-pointer technique and duplicate skipping
    - Fix one element (i), use left/right pointers for the other two
    - Skip duplicates at each position to ensure unique triplets
    
    Time:  O(n^2) — one outer loop, one inner two-pointer sweep each
    Space: O(1) extra (excluding output list)
    """
    result = []
    
    # Sort enables two-pointer logic and easy duplicate skipping
    nums.sort()
    
    for i in range(len(nums) - 2):
        
        # Skip duplicate values for the fixed element
        # (only skip after the first occurrence, hence i > 0 guard)
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        # Two pointers scanning inward from both ends of the remaining slice
        left = i + 1
        right = len(nums) - 1
        
        while left < right:
            current_sum = nums[i] + nums[left] + nums[right]
            
            if current_sum == 0:
                result.append([nums[i], nums[left], nums[right]])
                
                # Skip duplicates for left pointer before moving inward
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                
                # Skip duplicates for right pointer before moving inward
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                
                # Move both pointers inward to search for more triplets
                left += 1
                right -= 1
            
            elif current_sum < 0:
                # Sum too small — move left pointer right to increase the sum
                left += 1
            
            else:
                # Sum too large — move right pointer left to decrease the sum
                right -= 1
    
    return result


# Test cases
print(three_sum([-1, 0, 1, 2, -1, -4]))  # Expected: [[-1, -1, 2], [-1, 0, 1]]
print(three_sum([0, 0, 0]))               # Expected: [[0, 0, 0]]
print(three_sum([1, 2, 3]))               # Expected: []
print(three_sum([]))                      # Expected: []`,
    },
    {
      id: "dutch-national-flag",
      slug: "dutch-national-flag",
      title: "Dutch National Flag (Sort Colors)",
      content: `# Dutch National Flag (Sort Colors)

The "Sort Colors" problem is a classic interview challenge with an elegant O(n) single-pass solution. Invented by computer scientist Edsger W. Dijkstra, it was named after the Dutch flag — three horizontal bands of red, white, and blue.

**The challenge:** given an array of \`0\`s, \`1\`s, and \`2\`s in random order, sort it in-place without any built-in sort and in exactly one pass.

\`\`\`concept
{ "title": "The Three-Region Invariant", "variant": "mental-model", "content": "Imagine three buckets growing from both ends toward the middle. At every moment, the array is divided into four zones:\\n\\n[ sorted 0s | sorted 1s | unknown | sorted 2s ]\\n\\nA \`low\` pointer marks the right edge of the 0s zone. A \`high\` pointer marks the left edge of the 2s zone. A \`mid\` pointer advances through the unknown zone. When mid catches up to high, every element has been classified — done in one pass." }
\`\`\`

---

## The Problem

\`\`\`
Input:  [2, 0, 2, 1, 1, 0]
Output: [0, 0, 1, 1, 2, 2]

Input:  [2, 0, 1]
Output: [0, 1, 2]
\`\`\`

**Constraints:** sort in-place, O(n) time, O(1) space, exactly one pass.

\`\`\`callout
{ "type": "info", "title": "Why not just use sorted()?", "content": "Python's built-in sort is O(n log n) and allocates new memory. The interview asks for O(n) time and O(1) space — which is only achievable because there are exactly three distinct values. The Dutch National Flag algorithm exploits that constraint." }
\`\`\`

---

## Naive vs Optimal

\`\`\`tabs
{ "tabs": [ { "label": "Naive (Two-Pass Count)", "icon": "🐌", "content": "Count the frequency of each value, then overwrite the array:\\n\\n\`\`\`python\\ndef sort_colors_naive(nums):\\n    count = [0, 0, 0]\\n    for n in nums:\\n        count[n] += 1\\n    i = 0\\n    for val in range(3):\\n        for _ in range(count[val]):\\n            nums[i] = val\\n            i += 1\\n\`\`\`\\n\\n**Time:** O(n) — two passes\\n**Space:** O(1) — just the count array\\n\\nThis works, but uses **two passes** over the data. Many interviewers will ask: *can you do it in one pass?*" }, { "label": "Optimal (Single-Pass DNF)", "icon": "🚀", "content": "Use three pointers — \`lo\`, \`mid\`, \`hi\` — to sort in a single pass:\\n\\n\`\`\`python\\ndef sort_colors(nums):\\n    lo, mid, hi = 0, 0, len(nums) - 1\\n    while mid <= hi:\\n        if nums[mid] == 0:\\n            nums[lo], nums[mid] = nums[mid], nums[lo]\\n            lo += 1\\n            mid += 1\\n        elif nums[mid] == 1:\\n            mid += 1\\n        else:\\n            nums[mid], nums[hi] = nums[hi], nums[mid]\\n            hi -= 1\\n\`\`\`\\n\\n**Time:** O(n) — one pass\\n**Space:** O(1) — three pointer variables\\n\\nEach element is visited **at most twice**. The critical insight: when we swap a \`2\` from \`mid\` to \`hi\`, we don't advance \`mid\` because the swapped-in value needs to be examined." } ] }
\`\`\`

---

## Algorithm Walkthrough

\`\`\`steps
{ "title": "Dutch National Flag — Step by Step", "steps": [ { "title": "Initialize three pointers", "content": "\`\`\`\\nlo  = 0              # right boundary of the 0s region\\nmid = 0              # current element under examination  \\nhi  = len(nums) - 1  # left boundary of the 2s region\\n\`\`\`\\n\\nInitially everything is 'unknown'. \`lo\` and \`mid\` both start at index 0. \`hi\` starts at the last index." }, { "title": "Case 1 — nums[mid] == 0", "content": "Swap \`nums[mid]\` with \`nums[lo]\`. The 0 belongs at the left, so move it there.\\n\\nAdvance **both** \`lo\` and \`mid\` — the swapped-in element at \`mid\` came from the already-processed region, so we know it's safe to skip.\\n\\n\`\`\`\\n[ 0s | → 1s ← | unknown | 2s ]\\n        ↑ lo and mid both advance\\n\`\`\`" }, { "title": "Case 2 — nums[mid] == 1", "content": "A \`1\` is already in the correct middle region. No swap needed.\\n\\nAdvance **only** \`mid\`.\\n\\n\`\`\`\\n[ 0s | 1s → | unknown | 2s ]\\n          ↑ mid advances\\n\`\`\`" }, { "title": "Case 3 — nums[mid] == 2", "content": "Swap \`nums[mid]\` with \`nums[hi]\`. The 2 belongs at the right, so move it there.\\n\\nDecrement \`hi\`, but **do NOT advance \`mid\`**. The element swapped in from \`hi\` came from the unknown region and hasn't been examined yet.\\n\\n\`\`\`\\n[ 0s | 1s | unknown ← | 2s ]\\n                    ↑ hi decrements, mid stays\\n\`\`\`" }, { "title": "Termination", "content": "The loop ends when \`mid > hi\`. At that point:\\n- Everything left of \`lo\` is \`0\`\\n- Everything between \`lo\` and \`hi\` is \`1\`\\n- Everything right of \`hi\` is \`2\`\\n\\nThe unknown region has shrunk to nothing." } ] }
\`\`\`

---

## Visualizing the Pointers

\`\`\`algoviz
{ "title": "DNF on [2, 0, 2, 1, 1, 0]", "type": "array", "data": [2, 0, 2, 1, 1, 0], "frames": [ { "highlight": [0, 5], "label": "Start: lo=0, mid=0, hi=5. nums[mid]=2 → swap with hi", "stats": { "lo": 0, "mid": 0, "hi": 5 } }, { "highlight": [0, 4], "label": "After swap: [0,0,2,1,1,2]. hi-- to 4. mid stays at 0", "stats": { "lo": 0, "mid": 0, "hi": 4 } }, { "highlight": [0, 0], "label": "nums[mid=0]=0 → swap with lo (no-op). lo=1, mid=1", "stats": { "lo": 1, "mid": 1, "hi": 4 } }, { "highlight": [1, 1], "label": "nums[mid=1]=0 → swap with lo (no-op). lo=2, mid=2", "stats": { "lo": 2, "mid": 2, "hi": 4 } }, { "highlight": [2, 4], "label": "nums[mid=2]=2 → swap with hi: [0,0,1,1,2,2]. hi-- to 3", "stats": { "lo": 2, "mid": 2, "hi": 3 } }, { "highlight": [2, 2], "label": "nums[mid=2]=1 → advance mid to 3", "stats": { "lo": 2, "mid": 3, "hi": 3 } }, { "highlight": [3, 3], "label": "nums[mid=3]=1 → advance mid to 4. mid > hi → DONE", "stats": { "lo": 2, "mid": 4, "hi": 3 } } ], "speed": 900 }
\`\`\`

---

## Code Trace: [2, 0, 1]

\`\`\`trace
{ "title": "Tracing sort_colors([2, 0, 1])", "language": "python", "code": "def sort_colors(nums):\\n    lo, mid, hi = 0, 0, len(nums) - 1\\n    while mid <= hi:\\n        if nums[mid] == 0:\\n            nums[lo], nums[mid] = nums[mid], nums[lo]\\n            lo += 1\\n            mid += 1\\n        elif nums[mid] == 1:\\n            mid += 1\\n        else:\\n            nums[mid], nums[hi] = nums[hi], nums[mid]\\n            hi -= 1\\n\\nnums = [2, 0, 1]\\nsort_colors(nums)\\nprint(nums)", "frames": [ { "line": 2, "vars": { "nums": "[2, 0, 1]", "lo": 0, "mid": 0, "hi": 2 }, "note": "Initialize pointers. lo=mid=0 at start, hi=2 (last index)" }, { "line": 3, "vars": { "nums": "[2, 0, 1]", "lo": 0, "mid": 0, "hi": 2 }, "note": "mid(0) <= hi(2) → enter loop" }, { "line": 11, "vars": { "nums": "[2, 0, 1]", "lo": 0, "mid": 0, "hi": 2 }, "note": "nums[mid=0] = 2 → else branch: swap with hi" }, { "line": 12, "vars": { "nums": "[1, 0, 2]", "lo": 0, "mid": 0, "hi": 1 }, "note": "Swapped: 2 goes to end. hi-- = 1. mid stays at 0 — swapped-in value (1) not yet examined!" }, { "line": 8, "vars": { "nums": "[1, 0, 2]", "lo": 0, "mid": 0, "hi": 1 }, "note": "nums[mid=0] = 1 → elif branch: 1 is already in the right zone" }, { "line": 9, "vars": { "nums": "[1, 0, 2]", "lo": 0, "mid": 1, "hi": 1 }, "note": "mid advances to 1" }, { "line": 5, "vars": { "nums": "[1, 0, 2]", "lo": 0, "mid": 1, "hi": 1 }, "note": "nums[mid=1] = 0 → if branch: swap with lo" }, { "line": 6, "vars": { "nums": "[0, 1, 2]", "lo": 1, "mid": 2, "hi": 1 }, "note": "0 moved to front! lo=1, mid=2. Now mid(2) > hi(1) → exit loop" }, { "line": 3, "vars": { "nums": "[0, 1, 2]", "lo": 1, "mid": 2, "hi": 1 }, "note": "mid(2) > hi(1) → loop ends", "stdout": "" }, { "line": 16, "vars": { "nums": "[0, 1, 2]" }, "note": "Done! Array sorted in a single pass.", "stdout": "[0, 1, 2]" } ], "speed": 900 }
\`\`\`

---

## Full Solution

\`\`\`playground
{ "title": "Dutch National Flag — Sort Colors", "language": "python", "code": "def sort_colors(nums):\\n    \\"\\"\\"\\n    Sort array of 0s, 1s, 2s in-place in one pass.\\n    Time:  O(n)\\n    Space: O(1)\\n    \\"\\"\\"\\n    lo, mid, hi = 0, 0, len(nums) - 1\\n\\n    while mid <= hi:\\n        if nums[mid] == 0:\\n            # 0 belongs in the low zone — swap with lo\\n            nums[lo], nums[mid] = nums[mid], nums[lo]\\n            lo += 1\\n            mid += 1\\n        elif nums[mid] == 1:\\n            # 1 is already in the right zone — just advance\\n            mid += 1\\n        else:\\n            # 2 belongs in the high zone — swap with hi\\n            # Do NOT advance mid: swapped value needs examination\\n            nums[mid], nums[hi] = nums[hi], nums[mid]\\n            hi -= 1\\n\\n\\n# Test cases\\ntest_cases = [\\n    ([2, 0, 2, 1, 1, 0], [0, 0, 1, 1, 2, 2]),\\n    ([2, 0, 1],           [0, 1, 2]),\\n    ([0],                 [0]),\\n    ([1],                 [1]),\\n    ([2, 2, 2],           [2, 2, 2]),\\n    ([0, 0, 0],           [0, 0, 0]),\\n]\\n\\nfor nums, expected in test_cases:\\n    original = nums[:]\\n    sort_colors(nums)\\n    status = 'PASS' if nums == expected else 'FAIL'\\n    print(f\\"{status}: {original} -> {nums}\\")", "runnable": true }
\`\`\`

---

## The Critical Asymmetry

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "WRONG — advancing mid after swapping a 2", "code": "else:\\n    nums[mid], nums[hi] = nums[hi], nums[mid]\\n    hi -= 1\\n    mid += 1  # BUG: swapped-in value not examined!\\n\\n# Breaks on: [2, 2, 0]\\n# lo=0, mid=0, hi=2\\n# swap(0,2): [0, 2, 2], hi=1, mid=1  (WRONG!)\\n# mid=1 > hi... wait, still wrong:\\n# [2, 2, 0] -> after BUG: [0, 2, 2]\\n# 1s region empty, 2 is misplaced" }, "after": { "label": "CORRECT — do not advance mid when swapping a 2", "code": "else:\\n    nums[mid], nums[hi] = nums[hi], nums[mid]\\n    hi -= 1\\n    # mid stays — we must examine the swapped-in value!\\n\\n# Works on: [2, 2, 0]\\n# lo=0, mid=0, hi=2\\n# swap(0,2): [0, 2, 2], hi=1\\n# nums[mid=0]=0: swap(0,0), lo=1, mid=1\\n# nums[mid=1]=2: swap(1,1), hi=0\\n# mid(1) > hi(0) -> done: [0, 2, 2]... \\n# Actually [0,2,2] is wrong for [2,2,0]!\\n# Correct: [0,2,2] -> hmm that is right: 0 first, no 1s, two 2s" } }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "The Most Common Bug", "content": "When you swap \`nums[mid]\` with \`nums[hi]\`, the element that arrives at \`mid\` came from the **unknown region** — it has never been examined. If you advance \`mid\`, you skip examining it and may leave a \`0\` or \`1\` stranded in the wrong zone.\\n\\nWhen you swap \`nums[mid]\` with \`nums[lo]\`, the element that arrives at \`mid\` came from the **already-processed 1s region** — we know it's a \`1\`. It's safe to advance \`mid\`." }
\`\`\`

---

## Complexity Analysis

| | Time | Space |
|---|---|---|
| **Dutch National Flag** | O(n) — one pass | O(1) — three pointers |
| Counting sort (two-pass) | O(n) — two passes | O(1) |
| Built-in \`sorted()\` | O(n log n) | O(n) |

Each element is visited **at most twice**: once when \`mid\` reaches it, and possibly once when it gets swapped in from \`hi\`. The \`mid\` pointer only advances forward, so the total work is bounded by n.

---

## Practice

\`\`\`fillblank
{ "title": "Complete the Dutch National Flag Algorithm", "prompt": "Fill in the missing parts of sort_colors:", "language": "python", "template": "def sort_colors(nums):\\n    lo, mid, hi = ___, 0, len(nums) - 1\\n    while mid <= hi:\\n        if nums[mid] == 0:\\n            nums[lo], nums[mid] = nums[mid], nums[lo]\\n            lo += 1\\n            mid += 1\\n        elif nums[mid] == ___:\\n            mid += 1\\n        else:\\n            nums[mid], nums[hi] = nums[hi], nums[mid]\\n            ___ -= 1", "blanks": [ { "answer": "0", "hint": "lo starts at the beginning of the array" }, { "answer": "1", "hint": "Which value requires no swap — it's already in the middle zone?" }, { "answer": "hi", "hint": "Which pointer shrinks the 2s region from the right?" } ] }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Dutch National Flag Quiz", "questions": [ { "question": "Why do we NOT advance \`mid\` after swapping nums[mid] with nums[hi]?", "options": [ "To keep the loop running longer for correctness", "The element swapped in from hi came from the unknown region and hasn't been examined yet", "The hi pointer needs to catch up to mid first", "It would make the algorithm O(n²) if we advanced mid" ], "answer": 1, "explanation": "When we swap with hi, the element arriving at mid came from the unexamined unknown region. We must inspect it before advancing. When we swap with lo, the arriving element came from the already-processed 1s zone — we know it's a 1, so it's safe to skip." }, { "question": "What is the time and space complexity of the Dutch National Flag algorithm?", "options": [ "O(n log n) time, O(1) space", "O(n) time, O(n) space", "O(n) time, O(1) space", "O(n²) time, O(1) space" ], "answer": 2, "explanation": "The algorithm makes a single pass (O(n)) using only three pointer variables (O(1) extra space). Each element is touched at most twice — once when mid examines it and possibly once via a swap." }, { "question": "Given nums = [1, 2, 0], what are lo, mid, hi after the first iteration of the while loop?", "options": [ "lo=0, mid=0, hi=2", "lo=0, mid=1, hi=2", "lo=0, mid=0, hi=1", "lo=1, mid=1, hi=2" ], "answer": 1, "explanation": "nums[mid=0] = 1, which hits the elif branch. We only advance mid: lo stays 0, mid becomes 1, hi stays 2." }, { "question": "Which variant of the two-pointer pattern does the Dutch National Flag algorithm use?", "options": [ "Both pointers start at opposite ends and move inward", "Three pointers: two boundaries expanding outward + one scanning forward", "Both pointers start at the same end and move at different speeds", "One pointer is fixed while the other scans the array" ], "answer": 1, "explanation": "DNF uses three pointers: lo (low boundary, expands right), hi (high boundary, expands left), and mid (scanner, always moves forward). lo and hi define the boundaries of sorted regions; mid scans the unknown region between them." } ] }
\`\`\`

---

## Generalizing the Pattern

\`\`\`collapse
{ "title": "Deep Dive: Solving Similar Problems with the Same Template", "content": "The Dutch National Flag template — **partition by value using boundary pointers** — applies beyond 0/1/2 sorting.\\n\\n### Sort by Two Values\\nIf the array has only 0s and 1s (or any two values), simplify to two pointers:\\n\`\`\`python\\ndef sort_binary(nums):\\n    lo, hi = 0, len(nums) - 1\\n    while lo < hi:\\n        while lo < hi and nums[lo] == 0:\\n            lo += 1\\n        while lo < hi and nums[hi] == 1:\\n            hi -= 1\\n        if lo < hi:\\n            nums[lo], nums[hi] = nums[hi], nums[lo]\\n\`\`\`\\n\\n### Move Zeros to End\\nLeetCode 283 — a direct application where 0 maps to 'end' and nonzero maps to 'front':\\n\`\`\`python\\ndef move_zeroes(nums):\\n    lo = 0\\n    for mid in range(len(nums)):\\n        if nums[mid] != 0:\\n            nums[lo], nums[mid] = nums[mid], nums[lo]\\n            lo += 1\\n\`\`\`\\n\\n### Segregate Even and Odd\\nSame structure — replace the \`0/1/2\` check with \`even/odd\`:\\n\`\`\`python\\ndef segregate(nums):\\n    lo, mid, hi = 0, 0, len(nums) - 1\\n    while mid <= hi:\\n        if nums[mid] % 2 == 0:    # even → front\\n            nums[lo], nums[mid] = nums[mid], nums[lo]\\n            lo += 1; mid += 1\\n        else:                      # odd → back\\n            nums[mid], nums[hi] = nums[hi], nums[mid]\\n            hi -= 1\\n\`\`\`\\n\\nThe invariant is always the same: **maintain sorted regions at both ends while scanning the middle**." }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The Dutch National Flag algorithm sorts 0s, 1s, and 2s in-place in a single O(n) pass using O(1) space — three pointers: lo, mid, hi.", "The core invariant: [sorted 0s | sorted 1s | unknown | sorted 2s]. The unknown region shrinks as mid advances.", "When swapping nums[mid] with nums[hi] (a 2), do NOT advance mid — the swapped-in value is unexplored. When swapping with nums[lo] (a 0), advance both lo and mid since the arriving element is a known 1.", "The algorithm generalizes to any three-way partition problem: segregate by parity, move zeros, sort by two values, etc. Recognize the pattern by the presence of exactly three distinct categories." ] }
\`\`\``,
      starterCode: `def sort_colors(nums: list[int]) -> None:
    """
    Sort an array containing only 0s, 1s, and 2s in-place.
    Do NOT use Python's built-in sort.
    Use the Dutch National Flag algorithm with three pointers.

    Args:
        nums: List of integers, each either 0, 1, or 2

    Returns:
        None (sort in-place)

    Example:
        nums = [2, 0, 2, 1, 1, 0]
        sort_colors(nums)
        print(nums)  # [0, 0, 1, 1, 2, 2]
    """
    # TODO: Initialize three pointers:
    #   - \`low\`  points to the boundary where the next 0 should go (start)
    #   - \`mid\`  is the current element being examined (start)
    #   - \`high\` points to the boundary where the next 2 should go (end)
    low = 0
    mid = 0
    high = 0  # TODO: set to last index

    # TODO: Loop while mid <= high
    while False:  # TODO: replace False with the correct condition
        current = nums[mid]

        if current == 0:
            # TODO: Swap nums[low] and nums[mid],
            #       then advance both low and mid by 1
            pass

        elif current == 1:
            # TODO: 1 is already in the middle section — just advance mid
            pass

        else:  # current == 2
            # TODO: Swap nums[mid] and nums[high],
            #       then shrink high by 1
            #       (do NOT advance mid — the swapped element needs checking)
            pass


# --- Tests (run this file to verify) ---
if __name__ == "__main__":
    tests = [
        ([2, 0, 2, 1, 1, 0], [0, 0, 1, 1, 2, 2]),
        ([2, 0, 1],          [0, 1, 2]),
        ([0],                [0]),
        ([1],                [1]),
        ([0, 0, 0],          [0, 0, 0]),
        ([2, 2, 2],          [2, 2, 2]),
        ([1, 2, 0],          [0, 1, 2]),
    ]
    for nums, expected in tests:
        result = nums[:]
        sort_colors(result)
        status = "PASS" if result == expected else "FAIL"
        print(f"{status}: sort_colors({nums}) => {result}")
`,
      solutionCode: `def sort_colors(nums: list[int]) -> None:
    """
    Dutch National Flag algorithm — O(n) time, O(1) space.

    Three regions are maintained as we scan left to right:
        [0 .. low-1]   -> all 0s
        [low .. mid-1] -> all 1s
        [mid .. high]  -> unsorted / unknown
        [high+1 .. end]-> all 2s

    We shrink the unknown region each iteration until mid > high.
    """
    low = 0          # next position for a 0
    mid = 0          # current element under inspection
    high = len(nums) - 1  # next position for a 2

    while mid <= high:
        if nums[mid] == 0:
            # Current element is 0: swap it to the low boundary.
            # nums[low] is guaranteed to be a 1 (already processed),
            # so mid can safely advance after the swap.
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1

        elif nums[mid] == 1:
            # Current element is 1: already in the correct middle region.
            # Just move forward.
            mid += 1

        else:  # nums[mid] == 2
            # Current element is 2: swap it to the high boundary.
            # The element swapped back from high is unknown, so do NOT
            # advance mid — it will be inspected on the next iteration.
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1


# --- Tests ---
if __name__ == "__main__":
    tests = [
        ([2, 0, 2, 1, 1, 0], [0, 0, 1, 1, 2, 2]),
        ([2, 0, 1],          [0, 1, 2]),
        ([0],                [0]),
        ([1],                [1]),
        ([0, 0, 0],          [0, 0, 0]),
        ([2, 2, 2],          [2, 2, 2]),
        ([1, 2, 0],          [0, 1, 2]),
    ]
    for nums, expected in tests:
        result = nums[:]
        sort_colors(result)
        status = "PASS" if result == expected else "FAIL"
        print(f"{status}: sort_colors({nums}) => {result}")
`,
    },
    {
      id: "two-pointers-checkpoint",
      slug: "two-pointers-checkpoint",
      title: "Checkpoint: Two Pointers Mastery",
      content: `# Checkpoint: Two Pointers Mastery

This checkpoint tests whether you can **recognize the right variant before you code** — the exact skill interviewers are evaluating when they ask follow-up questions like "can you do this in O(n)?"

**Four unseen problems.** No hints on which variant applies. For each problem, follow this workflow:

1. Read the problem and constraints
2. Ask: *"What structure do I have, and what relationship am I looking for?"*
3. Name the variant — then implement

> **Passing bar:** Solve at least 3 of 4 problems. All solutions must achieve O(n) or O(n²) time with O(1) extra space (excluding output).

<!-- voice: Welcome to your Two Pointers checkpoint. Four unseen problems — no scaffolding. Treat each one like a real interview question. Pause before coding and name the variant first. Let's begin. -->

---

## Quick Reference: The Four Variants

\`\`\`tabs
{ "tabs": [
    {
      "label": "Opposite Ends",
      "icon": "↔️",
      "content": "**Signal:** Sorted array + find a pair/triplet satisfying a condition (sum, product, difference).\\n\\n**Setup:**\\n\`\`\`python\\nleft, right = 0, len(arr) - 1\\nwhile left < right:\\n    if condition_met: record answer\\n    elif need_larger: left += 1\\n    else: right -= 1\\n\`\`\`\\n\\n**Key insight:** Moving the smaller pointer inward can only increase the sum; moving the larger pointer can only decrease it.\\n\\n**Classic problems:** Two Sum II, 3Sum, Trapping Rain Water, Container With Most Water"
    },
    {
      "label": "Same Direction",
      "icon": "→→",
      "content": "**Signal:** In-place write — overwrite selected elements while scanning forward.\\n\\n**Setup:**\\n\`\`\`python\\nslow = 0\\nfor fast in range(len(arr)):\\n    if arr[fast] qualifies:\\n        arr[slow] = arr[fast]\\n        slow += 1\\nreturn slow  # new length\\n\`\`\`\\n\\n**Key insight:** \`slow\` is the write head; \`fast\` is the read head. They diverge as elements are skipped.\\n\\n**Classic problems:** Remove Duplicates, Move Zeroes, Filter in-place"
    },
    {
      "label": "Fill from End",
      "icon": "⬅️",
      "content": "**Signal:** Sorted array with negatives, output must be sorted — largest absolute values live at either extreme.\\n\\n**Setup:**\\n\`\`\`python\\nleft, right = 0, len(arr) - 1\\nresult = [0] * len(arr)\\nwrite = len(arr) - 1\\nwhile left <= right:\\n    if abs(arr[left]) > abs(arr[right]):\\n        result[write] = arr[left] ** 2\\n        left += 1\\n    else:\\n        result[write] = arr[right] ** 2\\n        right -= 1\\n    write -= 1\\n\`\`\`\\n\\n**Classic problems:** Squares of a Sorted Array"
    },
    {
      "label": "Anchor + Two Pointers",
      "icon": "⚓",
      "content": "**Signal:** Triplets or k-tuples in a sorted array.\\n\\n**Setup:**\\n\`\`\`python\\narr.sort()\\nfor i in range(len(arr) - 2):\\n    left, right = i + 1, len(arr) - 1\\n    while left < right:\\n        total = arr[i] + arr[left] + arr[right]\\n        # standard opposite-ends logic here\\n\`\`\`\\n\\n**Key insight:** Fix one element with an outer loop — the remaining sub-problem becomes a standard Opposite Ends search.\\n\\n**Classic problems:** 3Sum, 3Sum Closest, 4Sum"
    }
  ]
}
\`\`\`

---

## Problem 1: Squares of a Sorted Array

**Difficulty:** Easy — but the O(n) constraint rules out the naive approach.

> Given a **sorted** array of integers (may include negatives), return a new array of the **squares** of each number sorted in non-decreasing order.
>
> **Input:** \`[-4, -1, 0, 3, 10]\`  
> **Output:** \`[0, 1, 9, 16, 100]\`  
> **Constraint:** O(n) time — sorting the squares afterwards is O(n log n) and not acceptable here.

### Step 1: Identify the Variant

\`\`\`concept
{ "title": "Why Fill from End?", "variant": "insight", "content": "The naive approach — square everything, then sort — costs O(n log n). The trick: in a sorted array, the largest square always lives at one of the two ends (either the most-negative or the most-positive element). Two pointers at both ends, filling the result array from back to front, processes each element exactly once: O(n)." }
\`\`\`

### Step 2: Visualize the Algorithm

\`\`\`algoviz
{ "title": "Squares of a Sorted Array — Fill from End",
  "type": "array",
  "data": [-4, -1, 0, 3, 10],
  "frames": [
    { "highlight": [0, 4], "label": "left=−4 (sq=16), right=10 (sq=100). 100 > 16 → place 100 at result[4], right--", "stats": { "left": 0, "right": 4, "write": 4 } },
    { "highlight": [0, 3], "label": "left=−4 (sq=16), right=3 (sq=9). 16 > 9 → place 16 at result[3], left++", "stats": { "left": 0, "right": 3, "write": 3 } },
    { "highlight": [1, 3], "label": "left=−1 (sq=1), right=3 (sq=9). 9 > 1 → place 9 at result[2], right--", "stats": { "left": 1, "right": 3, "write": 2 } },
    { "highlight": [1, 2], "label": "left=−1 (sq=1), right=0 (sq=0). 1 > 0 → place 1 at result[1], left++", "stats": { "left": 1, "right": 2, "write": 1 } },
    { "highlight": [2, 2], "label": "left == right → place 0²=0 at result[0]. Done! Result: [0, 1, 9, 16, 100] ✓", "stats": { "left": 2, "right": 2, "write": 0 } }
  ],
  "speed": 900 }
\`\`\`

### Step 3: Implement

\`\`\`playground
{ "title": "Problem 1: Squares of a Sorted Array",
  "language": "python",
  "code": "def sorted_squares(nums):\\n    # Fill result from back to front — largest square goes first\\n    n = len(nums)\\n    result = [0] * n\\n    left, right = 0, n - 1\\n    write = n - 1\\n\\n    while left <= right:\\n        left_sq = nums[left] ** 2\\n        right_sq = nums[right] ** 2\\n        if left_sq > right_sq:\\n            result[write] = left_sq\\n            left += 1\\n        else:\\n            result[write] = right_sq\\n            right -= 1\\n        write -= 1\\n\\n    return result\\n\\nprint(sorted_squares([-4, -1, 0, 3, 10]))   # [0, 1, 9, 16, 100]\\nprint(sorted_squares([-7, -3, 2, 3, 11]))   # [4, 9, 9, 49, 121]\\nprint(sorted_squares([-5, -3, -2, -1]))     # [1, 4, 9, 25]\\nprint(sorted_squares([0, 2, 4]))            # [0, 4, 16]",
  "runnable": true }
\`\`\`

---

## Problem 2: Container With Most Water

**Difficulty:** Medium — a greedy insight drives the pointer movement.

> You have \`n\` vertical lines where \`height[i]\` is the height of line \`i\`. Find two lines that form a container holding the **maximum amount of water** (water = width × min height).
>
> **Input:** \`[1, 8, 6, 2, 5, 4, 8, 3, 7]\`  
> **Output:** \`49\`

### Step 1: Identify the Variant

\`\`\`concept
{ "title": "Why Opposite Ends?", "variant": "insight", "content": "You are maximizing a value from a pair of elements. Start with the widest possible container (left=0, right=n-1) and move inward. The critical greedy rule: always move the pointer at the SHORTER line. Why? Moving the taller line inward strictly loses width and can only keep or worsen the height bottleneck — it is never beneficial. Moving the shorter line sacrifices width but creates a chance of finding a taller bottleneck." }
\`\`\`

### Step 2: Trace the Key Decisions

\`\`\`trace
{ "title": "Container With Most Water — Greedy Pointer Movement",
  "language": "python",
  "code": "def max_area(height):\\n    left, right = 0, len(height) - 1\\n    max_water = 0\\n    while left < right:\\n        width = right - left\\n        water = width * min(height[left], height[right])\\n        max_water = max(max_water, water)\\n        if height[left] < height[right]:\\n            left += 1\\n        else:\\n            right -= 1\\n    return max_water\\n\\nheight = [1, 8, 6, 2, 5, 4, 8, 3, 7]\\nprint(max_area(height))",
  "frames": [
    { "line": 2, "vars": { "left": 0, "right": 8 }, "note": "Start at both ends — widest container possible" },
    { "line": 6, "vars": { "left": 0, "right": 8, "width": 8, "water": 8 }, "note": "water = 8 × min(height[0]=1, height[8]=7) = 8" },
    { "line": 8, "vars": { "left": 0, "right": 8, "max_water": 8 }, "note": "height[0]=1 < height[8]=7 → shorter line is on the left, move left pointer inward" },
    { "line": 9, "vars": { "left": 1, "right": 8, "max_water": 8 }, "note": "left advances to index 1 (height=8)" },
    { "line": 6, "vars": { "left": 1, "right": 8, "width": 7, "water": 49 }, "note": "water = 7 × min(height[1]=8, height[8]=7) = 49  ← new maximum!" },
    { "line": 7, "vars": { "left": 1, "right": 8, "max_water": 49 }, "note": "max_water jumps to 49 — this will be our final answer" },
    { "line": 10, "vars": { "left": 1, "right": 8, "max_water": 49 }, "note": "height[1]=8 ≥ height[8]=7 → move right pointer inward" },
    { "line": 6, "vars": { "left": 1, "right": 7, "width": 6, "water": 18 }, "note": "water = 6 × min(8,3) = 18. Smaller than 49, max_water unchanged. Loop continues shrinking..." },
    { "line": 12, "vars": { "max_water": 49 }, "note": "All pairs explored — no combination beats 49. Return.", "stdout": "49" }
  ],
  "speed": 900 }
\`\`\`

### Step 3: Implement

\`\`\`playground
{ "title": "Problem 2: Container With Most Water",
  "language": "python",
  "code": "def max_area(height):\\n    left, right = 0, len(height) - 1\\n    max_water = 0\\n\\n    while left < right:\\n        width = right - left\\n        water = width * min(height[left], height[right])\\n        max_water = max(max_water, water)\\n\\n        # Always move the shorter line — it is the bottleneck\\n        if height[left] < height[right]:\\n            left += 1\\n        else:\\n            right -= 1\\n\\n    return max_water\\n\\nprint(max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))  # 49\\nprint(max_area([1, 1]))                         # 1\\nprint(max_area([4, 3, 2, 1, 4]))               # 16\\nprint(max_area([1, 2, 1]))                      # 2",
  "runnable": true }
\`\`\`

---

## Problem 3: Remove Duplicates — Allow At Most 2

**Difficulty:** Medium — a clever twist on a pattern you know.

> Given a sorted array \`nums\`, remove duplicates **in-place** so each element appears **at most twice**. Return the new length \`k\`. The first \`k\` elements of \`nums\` must hold the result. Do not allocate extra space.
>
> **Input:** \`[1, 1, 1, 2, 2, 3]\`  
> **Output:** \`5\` (array becomes \`[1, 1, 2, 2, 3, _]\`)

### Step 1: Identify the Variant

\`\`\`concept
{ "title": "Why Same Direction (with a twist)?", "variant": "insight", "content": "In-place write with a condition — this is Same Direction. The twist: instead of comparing nums[fast] != nums[slow-1] (allow 1 occurrence), compare nums[fast] != nums[slow-2] (allow 2 occurrences). The slow pointer trails 2 positions, acting as a two-slot memory of what was last safely written. To allow at most k duplicates, compare against nums[slow-k]." }
\`\`\`

### Step 2: Fill in the Blanks

\`\`\`fillblank
{ "title": "Remove Duplicates — At Most 2 Occurrences",
  "prompt": "Complete the function. \`slow\` is the write pointer starting at 2 (first two elements are always valid). Compare \`nums[fast]\` against the element 2 slots behind \`slow\` to enforce the at-most-2 rule.",
  "language": "python",
  "template": "def remove_duplicates_ii(nums):\\n    if len(nums) <= 2:\\n        return len(nums)\\n    slow = 2\\n    for fast in range(2, len(nums)):\\n        if nums[fast] != nums[___]:\\n            nums[slow] = nums[fast]\\n            slow += ___\\n    return slow\\n\\nprint(remove_duplicates_ii([1,1,1,2,2,3]))         # 5\\nprint(remove_duplicates_ii([0,0,1,1,1,2,2,3,3,4])) # 7",
  "blanks": [
    { "answer": "slow - 2", "hint": "We allow at most 2 copies — compare with what was written 2 slots ago" },
    { "answer": "1", "hint": "Advance the write pointer by 1 after each valid write" }
  ] }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "The k-Duplicates Generalization", "content": "To allow at most **k** occurrences of each element, change \`slow - 2\` to \`slow - k\`. The classic \\"remove all duplicates\\" problem uses \`slow - 1\` (k=1). The same four-line template handles both cases — only the comparison index changes." }
\`\`\`

---

## Problem 4: 3Sum Closest

**Difficulty:** Medium — you know 3Sum; the objective just changes.

> Given an integer array \`nums\` and a \`target\`, find three integers whose sum is **closest** to \`target\`. Return that sum. Exactly one answer always exists.
>
> **Input:** \`[-1, 2, 1, -4]\`, target = \`1\`  
> **Output:** \`2\` (from \`−1 + 2 + 1 = 2\`)

### Step 1: Identify the Variant

\`\`\`concept
{ "title": "Why Anchor + Two Pointers?", "variant": "insight", "content": "This is 3Sum with a tracking objective instead of an equality objective. Sort the array. Fix one element with an outer loop (anchor), then run an Opposite Ends two-pointer search on the remaining subarray. Instead of checking for zero, track the closest sum seen so far. The pointer-movement logic is identical to 3Sum: sum < target → move left up; sum > target → move right down." }
\`\`\`

### Step 2: Implement

\`\`\`playground
{ "title": "Problem 4: 3Sum Closest",
  "language": "python",
  "code": "def three_sum_closest(nums, target):\\n    # Time: O(n^2) | Space: O(1) excluding sort\\n    nums.sort()\\n    closest_sum = float('inf')\\n\\n    for i in range(len(nums) - 2):\\n        left, right = i + 1, len(nums) - 1\\n\\n        while left < right:\\n            current_sum = nums[i] + nums[left] + nums[right]\\n\\n            # Track closest to target\\n            if abs(current_sum - target) < abs(closest_sum - target):\\n                closest_sum = current_sum\\n\\n            # Greedy movement — same logic as 3Sum\\n            if current_sum < target:\\n                left += 1    # Need a larger sum\\n            elif current_sum > target:\\n                right -= 1   # Need a smaller sum\\n            else:\\n                return current_sum  # Exact match — cannot do better\\n\\n    return closest_sum\\n\\nprint(three_sum_closest([-1, 2, 1, -4], 1))     # 2\\nprint(three_sum_closest([0, 0, 0], 1))           # 0\\nprint(three_sum_closest([1, 1, 1, 0], -100))     # 2\\nprint(three_sum_closest([-100, -98, -2, 3], 0))  # -99",
  "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Early Exit on Exact Match", "content": "If \`current_sum == target\`, the distance to target is 0 — nothing can be closer. Return immediately. This optimization is especially valuable when the target appears in the array, potentially cutting iterations to O(n) for that case." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Two Pointers Mastery Quiz",
  "questions": [
    {
      "question": "A sorted array problem asks you to find all pairs whose product equals a target value. Which two-pointer variant applies?",
      "options": [
        "Fill from End — build results backwards since negatives square to large values",
        "Opposite Ends — start at both ends, move based on whether the product is too large or too small",
        "Same Direction — use a slow write pointer and fast read pointer",
        "Anchor + Two Pointers — fix one element and search the rest"
      ],
      "answer": 1,
      "explanation": "Finding a pair satisfying a condition (product = target) in a sorted array is the Opposite Ends pattern. Start left=0, right=n-1. Product > target → move right inward (smaller value). Product < target → move left inward (larger value). O(n) time."
    },
    {
      "question": "In Container With Most Water, why do we always move the pointer at the SHORTER line, never the taller one?",
      "options": [
        "Moving the shorter pointer always increases the water volume in the next step",
        "The taller line is not the bottleneck — only the shorter line limits the water. Moving the taller pointer cannot improve the height constraint.",
        "Moving the taller pointer would skip over valid pair combinations entirely",
        "Both pointers can be moved in any order; this is just a convention for tie-breaking"
      ],
      "answer": 1,
      "explanation": "Water volume = width × min(left_height, right_height). The shorter line IS the bottleneck — it sets the ceiling. Moving the taller pointer inward decreases width AND keeps the same (or worse) bottleneck. Moving the shorter pointer decreases width but gives a chance of raising the bottleneck. Only one direction can possibly improve the answer."
    },
    {
      "question": "In 'Remove Duplicates — at most 2 occurrences', why does slow start at index 2 instead of 0?",
      "options": [
        "Starting slow at 0 causes an index-out-of-bounds on the nums[slow-2] comparison",
        "The first two elements are always valid — any sorted array can have at most 2 of anything in its first two slots — so we never need to overwrite them",
        "The algorithm requires slow to lead fast by exactly 2 positions at all times",
        "Index 0 and 1 are reserved as sentinels for the comparison logic"
      ],
      "answer": 1,
      "explanation": "In a sorted array, positions 0 and 1 always satisfy 'at most 2 occurrences' — even if nums[0] == nums[1], we are explicitly allowed two copies. So we initialize slow=2 (the first position we might need to overwrite) and scan from fast=2 onward, leaving the first two elements untouched."
    },
    {
      "question": "What is the time complexity of 3Sum Closest after sorting?",
      "options": [
        "O(n) — single pass with two pointers collapsing the problem",
        "O(n log n) — dominated by the initial sort step",
        "O(n²) — outer anchor loop O(n) × inner two-pointer scan O(n)",
        "O(n³) — three nested loops are required to check all triplets"
      ],
      "answer": 2,
      "explanation": "Sorting costs O(n log n). The outer loop runs O(n) times; for each iteration the inner two-pointer scan runs O(n). Total: O(n log n + n²) = O(n²). The Anchor + Two Pointers technique reduces the naïve O(n³) brute-force triplet search to O(n²) — the key interview win."
    },
    {
      "question": "You are given an unsorted array and need to find the minimum absolute difference between any two elements. Can you use the Opposite Ends two-pointer pattern directly?",
      "options": [
        "Yes — start at both ends and move the pointer whose element is farther from the other",
        "No — Opposite Ends requires a sorted array to make the greedy pointer-movement decision valid",
        "Yes — the variant works on any array as long as you track the minimum difference seen",
        "No — you should use a hash map instead of two pointers for this problem"
      ],
      "answer": 1,
      "explanation": "Opposite Ends only works correctly on sorted arrays. The greedy invariant — 'moving the smaller pointer inward can only increase the sum' — depends on the sorted order. On an unsorted array the decision of which pointer to move is not well-defined. Sort first (O(n log n)), then apply two pointers (O(n)), for O(n log n) overall."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways",
  "items": [
    "Opposite Ends: sorted array + find a pair/triplet meeting a condition. Move the pointer that cannot improve the result from its current side.",
    "Same Direction: in-place overwrite. slow is the write head, fast is the read head. To allow at most k duplicates, compare nums[fast] != nums[slow - k].",
    "Fill from End: sorted array with negatives, sorted output needed. Largest absolute value lives at one end — build the result array backward in O(n).",
    "Anchor + Two Pointers: k-tuple problems. Fix k-2 elements with outer loops; the innermost sub-problem becomes a standard Opposite Ends search.",
    "Name the variant before writing a single line — the implementation follows naturally once the variant is identified. This is the habit that impresses interviewers."
  ]
}
\`\`\``,
      starterCode: `# ===== CHECKPOINT: Two Pointers Mastery =====
# For each problem: identify the variant, then implement.
#
# Variants to consider:
#   A) Opposite ends   -- left/right start at boundaries, converge inward
#   B) Same direction  -- slow/fast pointers both move left to right
#   C) Anchor + window -- sort first, fix one element, use A for the rest


# -------------------------------------------------------
# Problem 1: Two Sum (Sorted Array)
# Given a SORTED array and a target, return the 1-indexed
# positions of the two numbers that add up to target.
# Guaranteed exactly one solution. No element used twice.
#
# Example: nums=[2,7,11,15], target=9  ->  [1, 2]
# -------------------------------------------------------
def two_sum_sorted(nums, target):
    # TODO: which variant applies here? (A / B / C)
    # TODO: initialize two pointers at opposite ends
    # TODO: loop while pointers have not crossed
        # TODO: compute the current sum
        # TODO: if sum == target, return 1-indexed positions
        # TODO: if sum < target, move left pointer right
        # TODO: if sum > target, move right pointer left
    pass


# -------------------------------------------------------
# Problem 2: Move Zeros
# Move all 0s to the end of the array IN-PLACE while
# keeping the relative order of non-zero elements.
#
# Example: nums=[0,1,0,3,12]  ->  [1,3,12,0,0]
# -------------------------------------------------------
def move_zeros(nums):
    # TODO: which variant applies here? (A / B / C)
    # TODO: initialize slow pointer (tracks the next write position)
    # TODO: iterate with a fast pointer over every element
        # TODO: if the element is non-zero, write it to the slow position
        #       and advance the slow pointer
    # TODO: fill every remaining slot (slow pointer onward) with 0
    pass


# -------------------------------------------------------
# Problem 3: Container With Most Water
# Given heights[], find two lines that form a container
# holding the most water. Return the maximum volume.
#
# Example: heights=[1,8,6,2,5,4,8,3,7]  ->  49
# -------------------------------------------------------
def max_water(heights):
    # TODO: which variant applies here? (A / B / C)
    # TODO: initialize left/right pointers and a max tracker
    # TODO: loop while left < right
        # TODO: compute current volume = min(h[l], h[r]) * (r - l)
        # TODO: update the max
        # TODO: move the pointer on the SHORTER side inward (why?)
    # TODO: return max volume
    pass


# -------------------------------------------------------
# Problem 4: Three Sum to Zero
# Return all unique triplets [a, b, c] where a+b+c == 0.
# No duplicate triplets in the output.
#
# Example: nums=[-1,0,1,2,-1,-4]  ->  [[-1,-1,2],[-1,0,1]]
# -------------------------------------------------------
def three_sum(nums):
    # TODO: which variant applies here? (A / B / C)
    #       Hint: it combines sorting with an anchor element
    # TODO: sort nums first (enables duplicate skipping + two pointers)
    # TODO: loop, treating each element as the anchor
        # TODO: skip duplicate anchor values (i > 0 and nums[i] == nums[i-1])
        # TODO: set left = anchor+1, right = last index
        # TODO: while left < right:
            # TODO: compute total = anchor + nums[left] + nums[right]
            # TODO: if total == 0: record triplet, skip duplicates, advance both
            # TODO: if total < 0: move left right
            # TODO: if total > 0: move right left
    # TODO: return result list
    pass
`,
      solutionCode: `# ===== CHECKPOINT: Two Pointers Mastery — SOLUTIONS =====
#
# Variant key:
#   A) Opposite ends   -- pointers converge from both boundaries
#   B) Same direction  -- slow/fast pointers, both move left to right
#   C) Anchor + window -- sort, fix one element, then use variant A


# -------------------------------------------------------
# Problem 1: Two Sum (Sorted Array)   [Variant A]
#
# Why A works: array is sorted, so a small left + large right
# lets us steer the sum up (left++) or down (right--).
# Time: O(n)  |  Space: O(1)
# -------------------------------------------------------
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        current = nums[left] + nums[right]
        if current == target:
            return [left + 1, right + 1]   # convert to 1-indexed
        elif current < target:
            left += 1    # sum too small: move to larger value
        else:
            right -= 1   # sum too large: move to smaller value
    return []            # problem guarantees a solution; unreachable


# -------------------------------------------------------
# Problem 2: Move Zeros   [Variant B]
#
# Why B works: we scan once with 'fast', writing non-zeros
# to the 'slow' position. No extra array needed.
# Time: O(n)  |  Space: O(1)
# -------------------------------------------------------
def move_zeros(nums):
    slow = 0                           # next write position for non-zeros
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow] = nums[fast]    # compact non-zeros to the front
            slow += 1
    # everything from slow onward should be zero
    for i in range(slow, len(nums)):
        nums[i] = 0
    return nums                        # modified in-place; returned for testing


# -------------------------------------------------------
# Problem 3: Container With Most Water   [Variant A]
#
# Key insight: the shorter line is the bottleneck.
# Moving the taller line inward can only make things worse
# (width shrinks, height stays the same or less). So always
# move the shorter pointer -- it's the only chance to improve.
# Time: O(n)  |  Space: O(1)
# -------------------------------------------------------
def max_water(heights):
    left, right = 0, len(heights) - 1
    max_vol = 0
    while left < right:
        vol = min(heights[left], heights[right]) * (right - left)
        max_vol = max(max_vol, vol)
        # advance the side with the shorter line
        if heights[left] < heights[right]:
            left += 1
        else:
            right -= 1
    return max_vol


# -------------------------------------------------------
# Problem 4: Three Sum to Zero   [Variant C]
#
# Sort first, then for each anchor element use variant A
# on the remaining subarray. Skip duplicates at every level
# to guarantee unique triplets without a hash set.
# Time: O(n^2)  |  Space: O(1) excluding output
# -------------------------------------------------------
def three_sum(nums):
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        # skip duplicate anchor values to avoid repeated triplets
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                # skip duplicate values on both sides before advancing
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1    # need a larger value
            else:
                right -= 1   # need a smaller value
    return result
`,
    },
  ],
};
