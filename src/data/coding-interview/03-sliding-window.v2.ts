import { Module } from "../types";

export const slidingWindowModule: Module = {
  id: "sliding-window",
  title: "Sliding Window",
  description: "Learn the sliding window technique for efficiently processing contiguous subarrays and substrings.",
  lessons: [
    {
      id: "sliding-window-intro",
      slug: "sliding-window-intro",
      title: "Introduction to Sliding Window",
      content: `## The Sliding Window Pattern

The **sliding window** pattern maintains a subset of elements (a "window") as it slides over a data structure, typically an array or string. Instead of recalculating from scratch for every position, you **add** the new element entering the window and **remove** the element leaving it.

\`\`\`concept
{
  "title": "The Core Insight",
  "variant": "insight",
  "content": "Sliding window transforms O(n²) brute-force into O(n) by reusing computations. Each element is processed at most twice: once when it enters the window and once when it leaves."
}
\`\`\`

### Two Flavors

| Type | Description | Example |
|------|-------------|---------|
| **Fixed-size window** | The window always contains exactly \`k\` elements. Slide one step at a time. | Max sum of subarray of size k. |
| **Dynamic window** | The window expands or shrinks based on a condition. | Smallest subarray whose sum >= target. |

\`\`\`algoviz
{
  "title": "Fixed vs Dynamic Window",
  "type": "array",
  "data": [3, 1, 4, 1, 5, 9, 2],
  "frames": [
    {"highlight": [0, 1, 2], "label": "Fixed k=3: window slides right", "stats": {"sum": 8}},
    {"highlight": [1, 2, 3], "label": "Slide: remove 3, add 1", "stats": {"sum": 6}},
    {"highlight": [2, 3, 4], "label": "Slide: remove 1, add 4", "stats": {"sum": 10}},
    {"highlight": [0, 1], "label": "Dynamic: expand while sum < 7", "stats": {"sum": 4}},
    {"highlight": [0, 1, 2], "label": "Expand: add 4, sum=8 ≥ 7", "stats": {"sum": 8}},
    {"highlight": [1, 2], "label": "Shrink from left to minimize", "stats": {"sum": 5}}
  ],
  "speed": 1000
}
\`\`\`

### Fixed Window Template

1. Compute the result for the first window of size \`k\`.
2. Slide the window one position right: add the incoming element, subtract the outgoing element.
3. Update the answer at each step.

\`\`\`playground
{
  "title": "Max Sum Subarray of Size k",
  "language": "python",
  "code": "def max_sum_k(arr, k):\\n    n = len(arr)\\n    if n < k:\\n        return 0\\n    \\n    # Step 1: first window\\n    window_sum = sum(arr[:k])\\n    max_sum = window_sum\\n    \\n    # Step 2: slide window\\n    for i in range(k, n):\\n        window_sum += arr[i] - arr[i - k]  # add new, remove old\\n        max_sum = max(max_sum, window_sum)\\n    \\n    return max_sum\\n\\nprint(max_sum_k([2, 1, 5, 1, 3, 2], 3))  # 9\\nprint(max_sum_k([2, 3, 4, 1, 5], 2))     # 7",
  "runnable": true
}
\`\`\`

### Dynamic Window Template

1. Expand the window by moving the **right** pointer and updating state.
2. When the window condition is violated (or satisfied, depending on the problem), **shrink** from the left.
3. Track the answer during expansion or contraction.

\`\`\`trace
{
  "title": "Smallest Subarray with Sum ≥ Target",
  "language": "python",
  "code": "def min_subarray_len(target, nums):\\n    left = 0\\n    window_sum = 0\\n    min_len = float('inf')\\n    \\n    for right in range(len(nums)):\\n        window_sum += nums[right]  # expand\\n        \\n        while window_sum >= target:  # shrink when valid\\n            min_len = min(min_len, right - left + 1)\\n            window_sum -= nums[left]\\n            left += 1\\n    \\n    return min_len if min_len != float('inf') else 0",
  "frames": [
    {"line": 1, "vars": {"target": 7, "nums": [2, 3, 1, 2, 4, 3]}, "stdout": ""},
    {"line": 2, "vars": {"left": 0, "window_sum": 0, "min_len": "inf"}, "stdout": ""},
    {"line": 5, "vars": {"right": 0, "window_sum": 2}, "stdout": ""},
    {"line": 7, "vars": {"right": 1, "window_sum": 5}, "stdout": ""},
    {"line": 8, "vars": {"right": 2, "window_sum": 6}, "stdout": ""},
    {"line": 9, "vars": {"right": 3, "window_sum": 8, "min_len": 4}, "stdout": ""},
    {"line": 10, "vars": {"left": 1, "window_sum": 6}, "stdout": ""},
    {"line": 9, "vars": {"right": 4, "window_sum": 10, "min_len": 3}, "stdout": ""},
    {"line": 10, "vars": {"left": 2, "window_sum": 7}, "stdout": ""},
    {"line": 9, "vars": {"right": 5, "window_sum": 10, "min_len": 2}, "stdout": ""}
  ],
  "speed": 800
}
\`\`\`

### When to Use Sliding Window

- You need something about **contiguous** subarrays or substrings (sum, count, distinct elements).
- A brute-force approach would check every subarray — O(n²) or worse.
- The window state can be updated incrementally in O(1).

\`\`\`quiz
{
  "title": "Recognizing Sliding Window Problems",
  "questions": [
    {
      "question": "Which problem is BEST suited for sliding window?",
      "options": ["Find max element in array", "Find longest substring without repeating characters", "Sort an array", "Find pair with given sum"],
      "answer": 1,
      "explanation": "Substring problems with continuity constraints are classic sliding window candidates."
    },
    {
      "question": "What is the time complexity of sliding window vs brute-force for substring problems?",
      "options": ["O(n) vs O(n²)", "O(n²) vs O(n)", "O(n log n) vs O(n²)", "Same complexity"],
      "answer": 0,
      "explanation": "Sliding window reduces nested loops to a single pass: O(n) instead of O(n²)."
    },
    {
      "question": "In a fixed-size window of size k, how many times is each element processed?",
      "options": ["Once", "Twice", "k times", "n times"],
      "answer": 1,
      "explanation": "Each element enters once and leaves once — constant work per element."
    }
  ]
}
\`\`\`

### Complexity

Most sliding-window problems are solved in **O(n)** time with **O(1)** or **O(k)** extra space, compared to the O(n × k) or O(n²) brute force.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Sliding window reuses computations to achieve O(n) time for contiguous subarray problems",
    "Fixed windows slide one step at a time; dynamic windows expand/shrink based on conditions",
    "Each element is processed at most twice: once when entering and once when leaving the window",
    "Look for problems requiring results over contiguous sequences where brute-force would be O(n²)"
  ]
}
\`\`\``,
    },
    {
      id: "sliding-window-max-sum-k",
      slug: "max-sum-subarray-size-k",
      title: "Maximum Sum Subarray of Size K",
      content: `## Maximum Sum Subarray of Size K

### Problem Statement

Given an array of positive integers and a number \`k\`, find the **maximum sum** of any contiguous subarray of size \`k\`.

### Examples

\`\`\`
Input:  arr = [2, 1, 5, 1, 3, 2], k = 3
Output: 9
Explanation: Subarray [5, 1, 3] has the maximum sum of 9.
\`\`\`

\`\`\`
Input:  arr = [2, 3, 4, 1, 5], k = 2
Output: 7
Explanation: Subarray [3, 4] has the maximum sum of 7.
\`\`\`

\`\`\`concept
{
  "title": "Fixed-Size Sliding Window",
  "variant": "mental-model",
  "content": "Think of a sliding window as a frame that moves across your array. For this problem, the frame always contains exactly k elements. Instead of recalculating the sum from scratch each time, we simply subtract the element that's leaving the window and add the new element that's entering. This transforms an O(N×K) brute-force approach into an elegant O(N) solution."
}
\`\`\`

\`\`\`algoviz
{
  "title": "Sliding Window in Action",
  "type": "array",
  "data": [2, 1, 5, 1, 3, 2],
  "frames": [
    {"highlight": [0, 1, 2], "label": "Window 1: sum = 2+1+5 = 8", "stats": {"window_sum": 8, "max_sum": 8}},
    {"highlight": [1, 2, 3], "label": "Window 2: 8-2+1 = 7", "stats": {"window_sum": 7, "max_sum": 8}},
    {"highlight": [2, 3, 4], "label": "Window 3: 7-1+3 = 9 (NEW MAX)", "stats": {"window_sum": 9, "max_sum": 9}},
    {"highlight": [3, 4, 5], "label": "Window 4: 9-5+2 = 6", "stats": {"window_sum": 6, "max_sum": 9}}
  ],
  "speed": 1000
}
\`\`\`

### Approach

This is a **fixed-size window** problem. The key insight is that adjacent windows overlap significantly - we can reuse the previous sum instead of recalculating from scratch.

1. Calculate the sum of the first \`k\` elements
2. Slide the window: subtract the element that left, add the new element
3. Track the maximum sum seen

\`\`\`playground
{
  "title": "Maximum Sum Subarray Implementation",
  "language": "python",
  "code": "def max_sum_subarray(arr, k):\\n    \\"\\"\\"\\n    Find maximum sum of any contiguous subarray of size k.\\n    Time: O(n), Space: O(1)\\n    \\"\\"\\"\\n    if not arr or k <= 0 or k > len(arr):\\n        return 0\\n    \\n    # Calculate sum of first window\\n    window_sum = sum(arr[:k])\\n    max_sum = window_sum\\n    \\n    # Slide the window\\n    for i in range(k, len(arr)):\\n        # Remove element going out, add element coming in\\n        window_sum = window_sum - arr[i - k] + arr[i]\\n        max_sum = max(max_sum, window_sum)\\n    \\n    return max_sum\\n\\n# Test cases\\nprint(max_sum_subarray([2, 1, 5, 1, 3, 2], 3))  # Expected: 9\\nprint(max_sum_subarray([2, 3, 4, 1, 5], 2))     # Expected: 7\\nprint(max_sum_subarray([1, 1, 1, 1], 2))        # Expected: 2",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Understanding the Sliding Window",
  "questions": [
    {
      "question": "Why is the sliding window technique more efficient than brute force for this problem?",
      "options": ["It uses less memory", "It avoids recalculating overlapping sums", "It sorts the array first", "It uses binary search"],
      "answer": 1,
      "explanation": "The sliding window technique reuses the sum from the previous window by simply subtracting the outgoing element and adding the incoming element, avoiding O(K) work per window."
    },
    {
      "question": "What is the time complexity of the sliding window solution?",
      "options": ["O(N×K)", "O(N²)", "O(N)", "O(K)"],
      "answer": 2,
      "explanation": "The sliding window approach processes each element exactly once, resulting in O(N) time complexity."
    },
    {
      "question": "In the array [4, 2, 1, 7, 8, 2] with k=3, what is the maximum sum?",
      "options": ["13", "16", "17", "15"],
      "answer": 1,
      "explanation": "The windows are: [4,2,1]=7, [2,1,7]=10, [1,7,8]=16, [7,8,2]=17. The maximum sum is 17."
    }
  ]
}
\`\`\`

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Brute Force O(N×K)",
    "code": "def max_sum_brute_force(arr, k):\\n    max_sum = 0\\n    for i in range(len(arr) - k + 1):\\n        current_sum = 0\\n        for j in range(i, i + k):\\n            current_sum += arr[j]\\n        max_sum = max(max_sum, current_sum)\\n    return max_sum"
  },
  "after": {
    "label": "Sliding Window O(N)",
    "code": "def max_sum_sliding_window(arr, k):\\n    window_sum = sum(arr[:k])\\n    max_sum = window_sum\\n    \\n    for i in range(k, len(arr)):\\n        window_sum = window_sum - arr[i - k] + arr[i]\\n        max_sum = max(max_sum, window_sum)\\n    \\n    return max_sum"
  }
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Common Pitfall",
  "content": "Don't confuse this with Kadane's Algorithm! Kadane's finds the maximum subarray of *any* size, while this problem specifically requires a fixed size k. The techniques are different - Kadane's uses dynamic programming, while this uses a sliding window."
}
\`\`\`

### Complexity

- **Time:** O(n) — single pass through the array
- **Space:** O(1) — only using a few variables

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Fixed-size sliding windows maintain a constant window length throughout processing",
    "Efficiency comes from reusing the previous window's sum instead of recalculating",
    "Each window transition requires only O(1) work: subtract outgoing, add incoming",
    "This technique is widely used in real-world applications like calculating moving averages in financial analysis"
  ]
}
\`\`\``,
      starterCode: `def max_sub_array_of_size_k(k, arr):
    # TODO: implement using fixed-size sliding window
    pass

# Test cases
print(max_sub_array_of_size_k(3, [2, 1, 5, 1, 3, 2]))  # Expected: 9
print(max_sub_array_of_size_k(2, [2, 3, 4, 1, 5]))      # Expected: 7
print(max_sub_array_of_size_k(2, [1, 1, 1, 1]))          # Expected: 2
`,
      solutionCode: `def max_sub_array_of_size_k(k, arr):
    max_sum = 0
    window_sum = 0
    window_start = 0
    for window_end in range(len(arr)):
        window_sum += arr[window_end]
        if window_end >= k - 1:
            max_sum = max(max_sum, window_sum)
            window_sum -= arr[window_start]
            window_start += 1
    return max_sum

# Test cases
print(max_sub_array_of_size_k(3, [2, 1, 5, 1, 3, 2]))  # Expected: 9
print(max_sub_array_of_size_k(2, [2, 3, 4, 1, 5]))      # Expected: 7
print(max_sub_array_of_size_k(2, [1, 1, 1, 1]))          # Expected: 2
`,
    },
    {
      id: "sliding-window-smallest-subarray-sum",
      slug: "smallest-subarray-with-sum",
      title: "Smallest Subarray with Sum >= S",
      content: `## Smallest Subarray with Sum ≥ S

\`\`\`concept
{
  "title": "Dynamic Window Insight",
  "variant": "insight",
  "content": "When all numbers are positive, shrinking the left edge of the window can never increase the current sum. This monotonic property lets us safely contract the window once the sum ≥ S, guaranteeing we see the smallest valid length in O(n) time."
}
\`\`\`

### Problem Statement

Given an array of **positive integers** and a target \`s\`, return the **length of the shortest contiguous subarray** whose sum is **≥ s**.  
Return \`0\` if no such subarray exists.

### Examples

\`\`\`
Input:  s = 7, arr = [2, 1, 5, 2, 3, 2]
Output: 2
Explanation: [5, 2] is the smallest subarray with sum ≥ 7.
\`\`\`

\`\`\`
Input:  s = 7, arr = [2, 1, 5, 2, 8]
Output: 1
Explanation: [8] alone is ≥ 7.
\`\`\`

\`\`\`
Input:  s = 8, arr = [3, 4, 1, 1, 6]
Output: 3
Explanation: [1, 1, 6] or [3, 4, 1] both have length 3.
\`\`\`

### Sliding-Window Blueprint

\`\`\`steps
{
  "title": "Two-Pointer Recipe",
  "steps": [
    {
      "title": "1. Expand",
      "content": "Move \`right\` forward, adding \`arr[right]\` to \`window_sum\`."
    },
    {
      "title": "2. Contract",
      "content": "While \`window_sum ≥ s\`, shrink from the left: subtract \`arr[left]\` and increment \`left\`."
    },
    {
      "title": "3. Record",
      "content": "After each contraction, update \`min_len = min(min_len, right - left + 1)\`."
    }
  ]
}
\`\`\`

### Live Execution

\`\`\`algoviz
{
  "title": "Finding the smallest window for s = 7, arr = [2,1,5,2,3,2]",
  "type": "array",
  "data": [2, 1, 5, 2, 3, 2],
  "frames": [
    { "highlight": [0], "label": "right=0, sum=2, left=0", "stats": { "min_len": "∞" } },
    { "highlight": [0,1], "label": "right=1, sum=3, left=0", "stats": { "min_len": "∞" } },
    { "highlight": [0,1,2], "label": "right=2, sum=8 ≥ 7 → shrink", "stats": { "min_len": "∞" } },
    { "highlight": [1,2], "label": "left=1, sum=6 < 7", "stats": { "min_len": "2" } },
    { "highlight": [1,2,3], "label": "right=3, sum=8 ≥ 7 → shrink", "stats": { "min_len": "2" } },
    { "highlight": [2,3], "label": "left=2, sum=7 ≥ 7 → shrink", "stats": { "min_len": "2" } },
    { "highlight": [3], "label": "left=3, sum=2 < 7", "stats": { "min_len": "2" } },
    { "highlight": [3,4], "label": "right=4, sum=5 < 7", "stats": { "min_len": "2" } },
    { "highlight": [3,4,5], "label": "right=5, sum=7 ≥ 7 → shrink", "stats": { "min_len": "2" } },
    { "highlight": [4,5], "label": "left=4, sum=5 < 7", "stats": { "min_len": "2" } }
  ],
  "speed": 1000
}
\`\`\`

### Reference Implementation

\`\`\`playground
{
  "title": "Python 3 — O(n) / O(1)",
  "language": "python",
  "code": "import math\\n\\ndef min_subarray_len(s: int, nums: list[int]) -> int:\\n    left = 0\\n    window_sum = 0\\n    min_len = math.inf\\n    \\n    for right in range(len(nums)):\\n        window_sum += nums[right]          # 1. expand\\n        \\n        while window_sum >= s:             # 2. contract while valid\\n            min_len = min(min_len, right - left + 1)\\n            window_sum -= nums[left]\\n            left += 1\\n    \\n    return 0 if min_len is math.inf else min_len\\n\\n# quick tests\\nprint(min_subarray_len(7, [2, 1, 5, 2, 3, 2]))  # 2\\nprint(min_subarray_len(7, [2, 1, 5, 2, 8]))     # 1\\nprint(min_subarray_len(8, [3, 4, 1, 1, 6]))     # 3",
  "runnable": true
}
\`\`\`

### Common Pitfalls

\`\`\`callout
{
  "type": "warning",
  "title": "Watch for These Bugs",
  "content": "- Forgetting to return 0 when no valid window exists (check if \`min_len\` is still ∞).\\n- Using \`==\` instead of \`>=\`—you’ll miss windows whose sum exceeds \`s\`.\\n- Assuming the technique works with negative numbers; it doesn’t, because removing left elements can *increase* the sum."
}
\`\`\`

### Complexity Analysis

- **Time:** O(n) — each element enters and leaves the window at most once.  
- **Space:** O(1) — only a handful of variables are used.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Positive integers let us shrink the window greedily without fear of missing a smaller valid subarray.",
    "The dynamic-window pattern: expand until valid, then contract to find the minimal length.",
    "Always initialize the minimum-length sentinel to ∞ and return 0 if it never updates."
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Checkpoint",
  "questions": [
    {
      "question": "What prevents the algorithm from incorrectly skipping the smallest window?",
      "options": [
        "We sort the array first",
        "All numbers are positive, so shrinking never increases the sum",
        "We use a deque instead of two pointers",
        "We restart the window whenever sum exceeds s"
      ],
      "answer": 1,
      "explanation": "Positivity guarantees monotonicity: discarding from the left can only reduce the sum, so the first time we achieve sum ≥ s, every shorter subarray starting further right will also be examined."
    },
    {
      "question": "How many total operations are performed on each element?",
      "options": ["Exactly once", "At most twice—once added, once removed", "Up to n times", "Up to log n times"],
      "answer": 1,
      "explanation": "Each element is added once when the right pointer passes it and removed at most once when the left pointer advances, yielding O(n) total work."
    },
    {
      "question": "If the array contained negative numbers, which statement is true?",
      "options": [
        "The same code still works in O(n)",
        "We must switch to prefix sums + binary search for O(n log n)",
        "We can still use sliding window but need a deque",
        "No efficient algorithm exists"
      ],
      "answer": 1,
      "explanation": "Negatives break the monotonic property; shrinking can increase the sum. Prefix sums with binary search (or another technique) becomes necessary."
    }
  ]
}
\`\`\``,
      starterCode: `def smallest_subarray_sum(s, arr):
    # TODO: implement using dynamic sliding window
    pass

# Test cases
print(smallest_subarray_sum(7, [2, 1, 5, 2, 3, 2]))  # Expected: 2
print(smallest_subarray_sum(7, [2, 1, 5, 2, 8]))      # Expected: 1
print(smallest_subarray_sum(8, [3, 4, 1, 1, 6]))      # Expected: 3
`,
      solutionCode: `def smallest_subarray_sum(s, arr):
    window_sum = 0
    min_length = float('inf')
    window_start = 0
    for window_end in range(len(arr)):
        window_sum += arr[window_end]
        while window_sum >= s:
            min_length = min(min_length, window_end - window_start + 1)
            window_sum -= arr[window_start]
            window_start += 1
    return min_length if min_length != float('inf') else 0

# Test cases
print(smallest_subarray_sum(7, [2, 1, 5, 2, 3, 2]))  # Expected: 2
print(smallest_subarray_sum(7, [2, 1, 5, 2, 8]))      # Expected: 1
print(smallest_subarray_sum(8, [3, 4, 1, 1, 6]))      # Expected: 3
`,
    },
    {
      id: "sliding-window-k-distinct",
      slug: "longest-substring-k-distinct",
      title: "Longest Substring with K Distinct Characters",
      content: `## Longest Substring with K Distinct Characters

### Problem Statement

Given a string, find the length of the **longest substring** that contains at most **K distinct characters**.

### Examples

\`\`\`
Input:  s = "araaci", k = 2
Output: 4
Explanation: "araa" has at most 2 distinct characters.
\`\`\`

\`\`\`
Input:  s = "araaci", k = 1
Output: 2
Explanation: "aa" is the longest with 1 distinct character.
\`\`\`

\`\`\`
Input:  s = "cbbebi", k = 3
Output: 5
Explanation: "cbbeb" or "bbebi" both have 3 distinct characters and length 5.
\`\`\`

\`\`\`concept
{
  "title": "Sliding Window with Frequency Map",
  "variant": "mental-model",
  "content": "Think of a camera sliding across the string. The lens (window) expands to include new characters, but when it sees more than K distinct characters, it shrinks from the left until only K remain. A frequency map acts like a counter that tells us exactly how many of each character are currently in view."
}
\`\`\`

### Approach Hints

- Use a **dynamic window** with a hash map to count character frequencies.
- Expand the window to the right, adding characters to the map.
- When the map has more than \`k\` keys, shrink from the left, removing characters whose count drops to zero.
- Track the maximum window size.

\`\`\`trace
{
  "title": "Step-by-step on \\"araaci\\", k=2",
  "language": "python",
  "code": "def longest_substring(s, k):\\n    from collections import defaultdict\\n    freq = defaultdict(int)\\n    left = 0\\n    max_len = 0\\n    \\n    for right in range(len(s)):\\n        freq[s[right]] += 1\\n        \\n        while len(freq) > k:\\n            freq[s[left]] -= 1\\n            if freq[s[left]] == 0:\\n                del freq[s[left]]\\n            left += 1\\n        \\n        max_len = max(max_len, right - left + 1)\\n    \\n    return max_len",
  "frames": [
    { "line": 4, "vars": {"s": "araaci", "k": 2, "freq": {}, "left": 0, "max_len": 0, "right": 0}, "note": "Start with empty window", "stdout": "" },
    { "line": 7, "vars": {"right": 0, "freq": {"a": 1}}, "note": "Add 'a'", "stdout": "" },
    { "line": 14, "vars": {"max_len": 1}, "note": "Update max length", "stdout": "" },
    { "line": 7, "vars": {"right": 1, "freq": {"a": 1, "r": 1}}, "note": "Add 'r'", "stdout": "" },
    { "line": 14, "vars": {"max_len": 2}, "note": "Window size 2", "stdout": "" },
    { "line": 7, "vars": {"right": 2, "freq": {"a": 2, "r": 1}}, "note": "Add 'a' again", "stdout": "" },
    { "line": 14, "vars": {"max_len": 3}, "note": "Window size 3", "stdout": "" },
    { "line": 7, "vars": {"right": 3, "freq": {"a": 3, "r": 1}}, "note": "Add 'a' again", "stdout": "" },
    { "line": 14, "vars": {"max_len": 4}, "note": "Window size 4", "stdout": "" },
    { "line": 7, "vars": {"right": 4, "freq": {"a": 3, "r": 1, "c": 1}}, "note": "Add 'c' — now 3 distinct", "stdout": "" },
    { "line": 9, "vars": {"left": 1, "freq": {"a": 2, "r": 1, "c": 1}}, "note": "Shrink from left", "stdout": "" },
    { "line": 10, "vars": {"left": 2, "freq": {"a": 2, "c": 1}}, "note": "Remove 'r'", "stdout": "" },
    { "line": 14, "vars": {"max_len": 4}, "note": "Current window size 3 < max", "stdout": "" }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "What is the maximum size of the frequency map during the algorithm?",
      "options": ["O(n)", "O(k)", "O(k+1)", "O(1)"],
      "answer": 2,
      "explanation": "The map holds at most k+1 distinct characters before we shrink the window."
    },
    {
      "question": "Why is the time complexity O(n) and not O(n²)?",
      "options": ["Each character is visited at most twice", "Hash maps are O(1)", "We skip duplicates", "The window never shrinks"],
      "answer": 0,
      "explanation": "Every character enters via the right pointer and exits via the left pointer at most once."
    },
    {
      "question": "If k = 0, what should the function return?",
      "options": ["0", "1", "Length of string", "Error"],
      "answer": 0,
      "explanation": "A substring must contain at most 0 distinct characters, so only the empty string qualifies."
    }
  ]
}
\`\`\`

### Complexity

- **Time:** O(n) — each character is processed at most twice.
- **Space:** O(k) — the hash map stores at most k+1 characters.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Brute-force (O(n³))",
    "code": "max_len = 0\\nfor i in range(n):\\n    for j in range(i, n):\\n        distinct = set(s[i:j+1])\\n        if len(distinct) <= k:\\n            max_len = max(max_len, j-i+1)"
  },
  "after": {
    "label": "Sliding Window (O(n))",
    "code": "max_len = left = 0\\nfreq = {}\\nfor right in range(n):\\n    freq[s[right]] = freq.get(s[right], 0) + 1\\n    while len(freq) > k:\\n        freq[s[left]] -= 1\\n        if freq[s[left]] == 0:\\n            del freq[s[left]]\\n        left += 1\\n    max_len = max(max_len, right - left + 1)"
  }
}
\`\`\`

\`\`\`playground
{
  "title": "Try it live",
  "language": "python",
  "code": "def longest_k_distinct(s, k):\\n    from collections import defaultdict\\n    freq = defaultdict(int)\\n    left = 0\\n    max_len = 0\\n    \\n    for right in range(len(s)):\\n        freq[s[right]] += 1\\n        \\n        while len(freq) > k:\\n            freq[s[left]] -= 1\\n            if freq[s[left]] == 0:\\n                del freq[s[left]]\\n            left += 1\\n        \\n        max_len = max(max_len, right - left + 1)\\n    \\n    return max_len\\n\\n# Test cases\\nprint(longest_k_distinct(\\"araaci\\", 2))  # 4\\nprint(longest_k_distinct(\\"cbbebi\\", 3))  # 5\\nprint(longest_k_distinct(\\"aaaa\\", 1))    # 4",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use a sliding window plus frequency map to track distinct characters in O(n) time.",
    "Shrink the window from the left as soon as distinct count exceeds k.",
    "Each character enters and exits the window at most once, guaranteeing linear time.",
    "Space usage is O(k) because the map never holds more than k+1 entries."
  ]
}
\`\`\``,
      starterCode: `def longest_substring_k_distinct(s, k):
    # TODO: implement using sliding window + hash map
    pass

# Test cases
print(longest_substring_k_distinct("araaci", 2))  # Expected: 4
print(longest_substring_k_distinct("araaci", 1))  # Expected: 2
print(longest_substring_k_distinct("cbbebi", 3))  # Expected: 5
`,
      solutionCode: `def longest_substring_k_distinct(s, k):
    char_freq = {}
    max_length = 0
    window_start = 0
    for window_end in range(len(s)):
        right_char = s[window_end]
        char_freq[right_char] = char_freq.get(right_char, 0) + 1
        while len(char_freq) > k:
            left_char = s[window_start]
            char_freq[left_char] -= 1
            if char_freq[left_char] == 0:
                del char_freq[left_char]
            window_start += 1
        max_length = max(max_length, window_end - window_start + 1)
    return max_length

# Test cases
print(longest_substring_k_distinct("araaci", 2))  # Expected: 4
print(longest_substring_k_distinct("araaci", 1))  # Expected: 2
print(longest_substring_k_distinct("cbbebi", 3))  # Expected: 5
`,
    },
    {
      id: "sliding-window-fruits-baskets",
      slug: "fruits-into-baskets",
      title: "Fruits Into Baskets",
      content: `## Fruits Into Baskets

### Problem Statement

You are visiting a farm with a single row of fruit trees. Each tree produces one type of fruit (represented by an integer). You have **two baskets**, and each basket can hold only **one type** of fruit. Starting from any tree, you pick exactly one fruit from each tree moving right. You stop when you have to pick a third type of fruit.

Find the **maximum number of fruits** you can collect.

This is equivalent to finding the **longest subarray with at most 2 distinct elements**.

\`\`\`concept
{
  "title": "The Core Insight",
  "variant": "insight",
  "content": "Fruits Into Baskets is a classic sliding window problem in disguise. The 'two baskets' constraint translates to 'at most 2 distinct characters' in the longest substring problem. The key is maintaining a window that never contains more than 2 distinct fruit types while maximizing its length."
}
\`\`\`

### Examples

\`\`\`
Input:  fruits = ['A', 'B', 'C', 'A', 'C']
Output: 3
Explanation: Starting from index 2: ['C', 'A', 'C'] — 2 types, 3 fruits.
\`\`\`

\`\`\`
Input:  fruits = ['A', 'B', 'C', 'B', 'B', 'C']
Output: 5
Explanation: Starting from index 1: ['B', 'C', 'B', 'B', 'C'] — 2 types, 5 fruits.
\`\`\`

\`\`\`
Input:  fruits = ['A', 'A', 'A']
Output: 3
\`\`\`

### Visualizing the Sliding Window

\`\`\`algoviz
{
  "title": "Sliding Window on ['A','B','C','B','B','C']",
  "type": "array",
  "data": ["A", "B", "C", "B", "B", "C"],
  "frames": [
    {"highlight": [0], "label": "Start with window [A], types: {A:1}", "stats": {"left": 0, "right": 0, "types": 1}},
    {"highlight": [0,1], "label": "Expand to [A,B], types: {A:1, B:1}", "stats": {"left": 0, "right": 1, "types": 2}},
    {"highlight": [0,1,2], "label": "Expand to [A,B,C] - 3 types! Need to shrink", "stats": {"left": 0, "right": 2, "types": 3}},
    {"highlight": [1,2], "label": "Shrink from left: remove A, window [B,C]", "stats": {"left": 1, "right": 2, "types": 2}},
    {"highlight": [1,2,3], "label": "Expand to [B,C,B], types still 2", "stats": {"left": 1, "right": 3, "types": 2}},
    {"highlight": [1,2,3,4], "label": "Expand to [B,C,B,B], types still 2", "stats": {"left": 1, "right": 4, "types": 2}},
    {"highlight": [1,2,3,4,5], "label": "Final expansion: [B,C,B,B,C] - 5 fruits!", "stats": {"left": 1, "right": 5, "types": 2}}
  ],
  "speed": 1000
}
\`\`\`

### Approach

This is identical to "Longest Substring with K Distinct Characters" with K = 2. Use a sliding window with a frequency map:

1. **Expand right**: Add fruits to your baskets
2. **Shrink when invalid**: When you have 3+ types, remove from the left
3. **Track maximum**: Keep the longest valid window seen

\`\`\`steps
{
  "title": "Sliding Window Algorithm",
  "steps": [
    {
      "title": "Initialize Pointers",
      "content": "Set \`left = 0\` and create an empty frequency map. These track your current window."
    },
    {
      "title": "Expand Right",
      "content": "Move \`right\` pointer forward, adding each fruit to the frequency map."
    },
    {
      "title": "Check Validity",
      "content": "If the map contains more than 2 fruit types, your window is invalid."
    },
    {
      "title": "Shrink from Left",
      "content": "Move \`left\` forward, removing fruits from the map until only 2 types remain."
    },
    {
      "title": "Update Maximum",
      "content": "After each valid window, update \`max_fruits = max(max_fruits, right - left + 1)\`"
    }
  ]
}
\`\`\`

### Implementation

\`\`\`playground
{
  "title": "Fruits Into Baskets Solution",
  "language": "python",
  "code": "def totalFruit(fruits):\\n    from collections import defaultdict\\n    \\n    basket = defaultdict(int)\\n    left = 0\\n    max_fruits = 0\\n    \\n    for right in range(len(fruits)):\\n        # Add current fruit to basket\\n        basket[fruits[right]] += 1\\n        \\n        # If we have more than 2 types, shrink window\\n        while len(basket) > 2:\\n            basket[fruits[left]] -= 1\\n            if basket[fruits[left]] == 0:\\n                del basket[fruits[left]]\\n            left += 1\\n        \\n        # Update maximum fruits collected\\n        max_fruits = max(max_fruits, right - left + 1)\\n    \\n    return max_fruits\\n\\n# Test the examples\\nprint(\\"Example 1:\\", totalFruit(['A', 'B', 'C', 'A', 'C']))\\nprint(\\"Example 2:\\", totalFruit(['A', 'B', 'C', 'B', 'B', 'C']))\\nprint(\\"Example 3:\\", totalFruit(['A', 'A', 'A']))",
  "runnable": true
}
\`\`\`

### Complexity Analysis

- **Time:** O(n) — Each fruit is visited at most twice (once by right pointer, once by left)
- **Space:** O(1) — At most 3 entries in the frequency map (2 valid + 1 being removed)

\`\`\`callout
{
  "type": "tip",
  "title": "Space Complexity Insight",
  "content": "The space complexity is O(1) not O(k) because k is bounded by a constant (k ≤ 3). Even though we use a hash map, it never contains more than 3 fruit types simultaneously."
}
\`\`\`

### Testing Your Understanding

\`\`\`quiz
{
  "title": "Fruits Into Baskets Quiz",
  "questions": [
    {
      "question": "What is the maximum number of fruits you can collect from [1,2,1,2,3,1]?",
      "options": ["3", "4", "5", "6"],
      "answer": 2,
      "explanation": "The longest valid window is [1,2,1,2] or [2,1,2,3] (but the second one has 3 types), so the answer is 4 fruits from [1,2,1,2]."
    },
    {
      "question": "Why is the space complexity O(1) and not O(k)?",
      "options": ["Because k is always ≤ 2", "Because k is bounded by a small constant", "Because we use an array instead of hash map", "The space is actually O(n)"],
      "answer": 1,
      "explanation": "While k could theoretically be large, in this problem the frequency map never contains more than 3 entries (2 valid types + 1 being removed), making it O(1)."
    },
    {
      "question": "What happens when we encounter a third fruit type?",
      "options": ["Stop immediately", "Remove all fruits and start new window", "Shrink from left until only 2 types remain", "Skip this fruit and continue"],
      "answer": 2,
      "explanation": "We shrink the window from the left, removing fruits until we're back to at most 2 distinct types, maintaining the sliding window invariant."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Fruits Into Baskets is equivalent to finding the longest subarray with at most 2 distinct elements",
    "Use a sliding window with frequency map to track fruit types in current window",
    "Expand right pointer to add fruits, shrink left pointer when having 3+ types",
    "Time complexity is O(n) and space is O(1) due to constant bound on fruit types"
  ]
}
\`\`\``,
      starterCode: `def fruits_into_baskets(fruits):
    # TODO: implement — longest subarray with at most 2 distinct values
    pass

# Test cases
print(fruits_into_baskets(['A', 'B', 'C', 'A', 'C']))       # Expected: 3
print(fruits_into_baskets(['A', 'B', 'C', 'B', 'B', 'C']))  # Expected: 5
print(fruits_into_baskets(['A', 'A', 'A']))                  # Expected: 3
`,
      solutionCode: `def fruits_into_baskets(fruits):
    freq = {}
    max_fruits = 0
    window_start = 0
    for window_end in range(len(fruits)):
        right = fruits[window_end]
        freq[right] = freq.get(right, 0) + 1
        while len(freq) > 2:
            left = fruits[window_start]
            freq[left] -= 1
            if freq[left] == 0:
                del freq[left]
            window_start += 1
        max_fruits = max(max_fruits, window_end - window_start + 1)
    return max_fruits

# Test cases
print(fruits_into_baskets(['A', 'B', 'C', 'A', 'C']))       # Expected: 3
print(fruits_into_baskets(['A', 'B', 'C', 'B', 'B', 'C']))  # Expected: 5
print(fruits_into_baskets(['A', 'A', 'A']))                  # Expected: 3
`,
    },
    {
      id: "sliding-window-no-repeat",
      slug: "longest-substring-no-repeat",
      title: "Longest Substring Without Repeating Characters",
      content: `## Longest Substring Without Repeating Characters

### Problem Statement

Given a string, find the length of the **longest substring** that has **no repeating characters**.

\`\`\`concept
{
  "title": "What counts as a substring?",
  "variant": "mental-model",
  "content": "A substring is a contiguous slice of the original string. For \\"hello\\", valid substrings include \\"hel\\", \\"ell\\", \\"llo\\", but NOT \\"hlo\\" (letters aren't adjacent). The task is to find the longest slice where every character appears exactly once."
}
\`\`\`

### Examples

\`\`\`
Input:  "aabccbb"
Output: 3
Explanation: "abc" is the longest substring without repeats.
\`\`\`

\`\`\`
Input:  "abbbb"
Output: 2
Explanation: "ab" is the longest.
\`\`\`

\`\`\`
Input:  "abccde"
Output: 3
Explanation: "cde" (or "abc") has length 3.
\`\`\`

### Sliding-Window Blueprint

\`\`\`steps
{
  "title": "Step-by-step plan",
  "steps": [
    {
      "title": "1. Expand the right edge",
      "content": "Move \`right\` pointer forward, adding the new character to a hash map that stores **last seen index**."
    },
    {
      "title": "2. Detect duplicate",
      "content": "If the new character already exists **inside the current window**, shrink the left edge to \`max(left, lastSeen[c] + 1)\`."
    },
    {
      "title": "3. Update & measure",
      "content": "Overwrite the character’s last-seen index, then record \`max_len = max(max_len, right - left + 1)\`."
    }
  ]
}
\`\`\`

### Live Execution

\`\`\`algoviz
{
  "title": "Window slides over \\"pwwkew\\"",
  "type": "array",
  "data": ["p","w","w","k","e","w"],
  "frames": [
    { "highlight": [0], "label": "init left=0, right=0, max=1", "stats": {"left":0,"right":0,"max":1} },
    { "highlight": [0,1], "label": "expand to 'w', map={p:0,w:1}", "stats": {"left":0,"right":1,"max":2} },
    { "highlight": [2], "label": "duplicate 'w' → left jumps to 2", "stats": {"left":2,"right":2,"max":2} },
    { "highlight": [2,3], "label": "add 'k', map={w:2,k:3}", "stats": {"left":2,"right":3,"max":2} },
    { "highlight": [2,3,4], "label": "add 'e', map={w:2,k:3,e:4}", "stats": {"left":2,"right":4,"max":3} },
    { "highlight": [2,3,4,5], "label": "add second 'w' → left jumps to 3", "stats": {"left":3,"right":5,"max":3} }
  ],
  "speed": 900
}
\`\`\`

### Python Implementation

\`\`\`playground
{
  "title": "O(n) solution",
  "language": "python",
  "code": "def length_of_longest_substring(s: str) -> int:\\n    left = 0\\n    last_seen = {}          # char → last index\\n    max_len = 0\\n\\n    for right, ch in enumerate(s):\\n        # If we've seen this char inside the current window, shrink\\n        if ch in last_seen and last_seen[ch] >= left:\\n            left = last_seen[ch] + 1\\n        # Update/insert current index\\n        last_seen[ch] = right\\n        # Measure window size\\n        max_len = max(max_len, right - left + 1)\\n    return max_len\\n\\n# Quick tests\\nprint(length_of_longest_substring(\\"abcabcbb\\"))  # 3\\nprint(length_of_longest_substring(\\"bbbbb\\"))     # 1\\nprint(length_of_longest_substring(\\"pwwkew\\"))    # 3",
  "runnable": true
}
\`\`\`

### Complexity Analysis

- **Time:** O(n) — each pointer moves at most n steps.  
- **Space:** O(min(n, m)) — the map holds ≤ min(string length, alphabet size).

\`\`\`callout
{
  "type": "tip",
  "title": "Interview follow-up",
  "content": "If the alphabet is fixed (e.g., lowercase a–z), space is O(1) because the map can’t exceed 26 entries. Always mention this trade-off!"
}
\`\`\`

### Quick Check

\`\`\`quiz
{
  "title": "Checkpoint",
  "questions": [
    {
      "question": "What happens when we see a character that appeared before the current left border?",
      "options": [
        "Shrink the window to that old index",
        "Ignore it; it’s outside the window",
        "Restart left at 0",
        "Delete the character from the map"
      ],
      "answer": 1,
      "explanation": "Indices before \`left\` are no longer in the window, so they don’t affect uniqueness."
    },
    {
      "question": "Why store the *last* index instead of just a boolean flag?",
      "options": [
        "To compute substring length faster",
        "To know exactly where to jump left",
        "To avoid hash collisions",
        "No reason; boolean would work"
      ],
      "answer": 1,
      "explanation": "Knowing the last position lets us set \`left = lastSeen[c] + 1\` in O(1) time."
    },
    {
      "question": "What is the worst-case space usage for ASCII input?",
      "options": ["O(n)", "O(1)", "O(128)", "O(256)"],
      "answer": 2,
      "explanation": "Standard ASCII has 128 characters, so the map size is bounded by 128 regardless of n."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use a sliding window plus hash map that records *last seen indices*.",
    "Shrink only when the duplicate lies **inside** the current window.",
    "Algorithm is single-pass O(n) time and O(min(n, alphabet)) space."
  ]
}
\`\`\``,
      starterCode: `def non_repeat_substring(s):
    # TODO: implement using sliding window + last-seen map
    pass

# Test cases
print(non_repeat_substring("aabccbb"))  # Expected: 3
print(non_repeat_substring("abbbb"))    # Expected: 2
print(non_repeat_substring("abccde"))   # Expected: 3
`,
      solutionCode: `def non_repeat_substring(s):
    char_index = {}
    max_length = 0
    window_start = 0
    for window_end in range(len(s)):
        right_char = s[window_end]
        if right_char in char_index:
            # Move window_start to just past the previous occurrence
            # but never move it backwards
            window_start = max(window_start, char_index[right_char] + 1)
        char_index[right_char] = window_end
        max_length = max(max_length, window_end - window_start + 1)
    return max_length

# Test cases
print(non_repeat_substring("aabccbb"))  # Expected: 3
print(non_repeat_substring("abbbb"))    # Expected: 2
print(non_repeat_substring("abccde"))   # Expected: 3
`,
    },
  ],
};
