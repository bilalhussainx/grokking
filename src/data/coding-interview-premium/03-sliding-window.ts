import { Module } from "../types";

export const slidingWindowModule: Module = {
  id: "sliding-window",
  title: "Sliding Window",
  description: "Master the sliding window technique for efficient processing of arrays and strings. Ideal for substring/subarray problems, reducing time complexity from O(n²) to O(n) or O(n log n).",
  lessons: [
    {
      id: "sliding-window-intro",
      slug: "sliding-window-intro",
      title: "Introduction to Sliding Window",
      content: `## The Sliding Window Pattern

The **sliding window** technique maintains a subset of elements — the "window" — that satisfies certain conditions, then slides this window across the data incrementally rather than recomputing from scratch each step.

<!-- voice:section_check concept="sliding window basic concept" -->

\`\`\`concept
{ "title": "The Train Window Mental Model", "variant": "analogy", "content": "Imagine looking through a fixed-size window on a moving train. You don't restart your journey each time you look — you simply observe what enters and leaves the frame as you move forward. Sliding window works the same way: when the window advances, one element enters from the right and one exits from the left. You update only what changed, not the whole picture." }
\`\`\`

### Why Sliding Window?

Many problems ask for the **best contiguous subarray or substring** satisfying some criterion — maximum sum, specific character count, shortest length with sum ≥ target. A naïve approach checks every possible subarray:

\`\`\`mermaid
graph LR
    subgraph "Array: [2, 1, 5, 1, 3, 2]"
        A["2"] --- B["1"] --- C["5"] --- D["1"] --- E["3"] --- F["2"]
    end
    W1["window k=3"] -.->|"step 1"| A
    W2["window k=3"] -.->|"step 2"| B
    W3["window k=3"] -.->|"step 3"| C
    style W1 fill:#6366f1,color:#fff
    style W2 fill:#818cf8,color:#fff
    style W3 fill:#a5b4fc,color:#fff
\`\`\`

Adjacent subarrays **overlap significantly** — sliding window avoids recomputing the overlapping portion. This collapses O(n²) nested loops into a single O(n) pass.

<!-- voice:key_insight insight="The key insight is that adjacent subarrays share most of their elements — you only need to add the new right element and remove the old left element as the window slides." -->

### Window Types

| Type | Description | When to Use |
|------|-------------|-------------|
| **Fixed Size** | Window has constant size k | Max sum of k consecutive elements |
| **Dynamic (Variable)** | Window expands/contracts based on conditions | Smallest subarray with sum ≥ target |
| **Two Windows** | Track two windows simultaneously | Longest substring with at most k distinct characters |

\`\`\`algoviz
{
  "title": "Fixed Window Sliding — Max Sum, k=3 over [2,1,5,1,3,2]",
  "type": "array",
  "data": [2, 1, 5, 1, 3, 2],
  "frames": [
    { "highlight": [0, 1, 2], "label": "Initial window [2,1,5] — sum = 8", "stats": { "left": 0, "right": 2, "sum": 8, "max": 8 } },
    { "highlight": [1, 2, 3], "label": "Slide right: remove 2, add 1 → [1,5,1] — sum = 7", "stats": { "left": 1, "right": 3, "sum": 7, "max": 8 } },
    { "highlight": [2, 3, 4], "label": "Slide right: remove 1, add 3 → [5,1,3] — sum = 9", "stats": { "left": 2, "right": 4, "sum": 9, "max": 9 } },
    { "highlight": [3, 4, 5], "label": "Slide right: remove 5, add 2 → [1,3,2] — sum = 6", "stats": { "left": 3, "right": 5, "sum": 6, "max": 9 } }
  ],
  "speed": 900
}
\`\`\`

### Pattern Structure

\`\`\`steps
{
  "title": "The Sliding Window Blueprint",
  "steps": [
    { "title": "Initialize pointers", "content": "Set \`left = 0\` and \`right = 0\`. Optionally initialize any tracking state (running sum, frequency map, etc.)." },
    { "title": "Expand — move right pointer", "content": "Include \`arr[right]\` into the window. Update your tracked state incrementally (e.g., \`window_sum += arr[right]\`)." },
    { "title": "Check the condition", "content": "Evaluate whether the current window satisfies, violates, or meets the optimum condition. Record the best result if applicable." },
    { "title": "Contract — move left pointer (dynamic only)", "content": "While the window violates the constraint, remove \`arr[left]\` from state and advance \`left += 1\`. For fixed windows, shrink only when \`right - left + 1 > k\`." },
    { "title": "Repeat until right reaches end", "content": "Advance \`right += 1\` and repeat. Return the tracked optimal result when the loop ends." }
  ]
}
\`\`\`

### Complexity

- **Time:** O(n) — each element enters the window once (via \`right\`) and leaves once (via \`left\`).
- **Space:** O(1) for basic sum/count tracking; O(k) or O(Σ) when a hash map tracks character frequencies within the window.

\`\`\`callout
{ "type": "tip", "title": "Spotting a Sliding Window Problem", "content": "Look for these signals in the problem statement:\\n- \\"contiguous subarray\\" or \\"substring\\"\\n- \\"maximum/minimum\\" sum, length, or count\\n- \\"exactly k\\" or \\"at most k\\" distinct elements\\n- Single-pass O(n) time limit with n ≤ 10⁶\\n\\nIf you'd naturally reach for two nested loops, sliding window is almost certainly the right pattern." }
\`\`\`

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Fixed Window",
      "icon": "📏",
      "content": "**Use when:** window size \`k\` is given explicitly.\\n\\n\`\`\`python\\ndef max_sum_fixed(nums, k):\\n    window_sum = sum(nums[:k])\\n    max_sum = window_sum\\n    for i in range(k, len(nums)):\\n        window_sum += nums[i] - nums[i - k]  # add right, drop left\\n        max_sum = max(max_sum, window_sum)\\n    return max_sum\\n\`\`\`\\n\\n**Key move:** \`window_sum += nums[right] - nums[left]\` — O(1) update per step."
    },
    {
      "label": "Dynamic Window",
      "icon": "🔄",
      "content": "**Use when:** window grows until a condition breaks, then shrinks.\\n\\n\`\`\`python\\ndef min_subarray_len(target, nums):\\n    left = window_sum = 0\\n    min_len = float('inf')\\n    for right in range(len(nums)):\\n        window_sum += nums[right]\\n        while window_sum >= target:\\n            min_len = min(min_len, right - left + 1)\\n            window_sum -= nums[left]\\n            left += 1\\n    return 0 if min_len == float('inf') else min_len\\n\`\`\`\\n\\n**Key move:** inner \`while\` shrinks the window the moment it satisfies (or violates) the constraint."
    },
    {
      "label": "With Hash Map",
      "icon": "🗺️",
      "content": "**Use when:** tracking character/element frequency within the window.\\n\\n\`\`\`python\\ndef length_of_longest_substring(s):\\n    seen = set()\\n    left = max_len = 0\\n    for right in range(len(s)):\\n        while s[right] in seen:\\n            seen.remove(s[left])\\n            left += 1\\n        seen.add(s[right])\\n        max_len = max(max_len, right - left + 1)\\n    return max_len\\n\`\`\`\\n\\n**Space:** O(min(n, Σ)) where Σ is the alphabet size. The set acts as the window's \\"state\\"."
    }
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "What is the time complexity of a correctly implemented sliding window solution, and why?",
      "options": [
        "O(n²) — because we check every pair of pointers",
        "O(n log n) — because we sort before sliding",
        "O(n) — each element is added and removed from the window at most once",
        "O(k) — because we only look at k elements at a time"
      ],
      "answer": 2,
      "explanation": "Each element is visited at most twice: once when the right pointer adds it to the window, and once when the left pointer removes it. This gives exactly O(2n) = O(n) work total, regardless of window size."
    },
    {
      "question": "You need to find the shortest subarray whose sum is ≥ target. Which window type should you use?",
      "options": [
        "Fixed window — set k equal to the target value",
        "Dynamic window — expand right until sum ≥ target, then shrink from left",
        "Two windows — track the minimum and maximum simultaneously",
        "No window — this requires a prefix sum approach only"
      ],
      "answer": 1,
      "explanation": "The window size is unknown upfront and depends on the values encountered. A dynamic window expands by moving right until sum ≥ target, then contracts from the left to minimize length — a classic variable-window pattern."
    },
    {
      "question": "When sliding a fixed window of size k from position i to i+1, what is the O(1) update formula for the window sum?",
      "options": [
        "window_sum = sum(arr[i+1 : i+k+1])",
        "window_sum += arr[i+k]",
        "window_sum += arr[i+k] - arr[i]",
        "window_sum -= arr[i] and then window_sum += arr[i+k] in two separate loops"
      ],
      "answer": 2,
      "explanation": "arr[i+k] is the new element entering the right side of the window, and arr[i] is the element leaving the left side. Doing both adjustments in one expression — window_sum += arr[i+k] - arr[i] — keeps the update O(1) and avoids re-summing all k elements."
    },
    {
      "question": "Which of the following is NOT a signal that sliding window is the right approach?",
      "options": [
        "The problem asks for a contiguous subarray with maximum sum",
        "The problem asks for the k-th largest element in an unsorted array",
        "The problem asks for the longest substring with at most 2 distinct characters",
        "The problem asks for the minimum window containing all characters of a target string"
      ],
      "answer": 1,
      "explanation": "Finding the k-th largest element is a selection problem — typically solved with a heap or quickselect, not a sliding window. The other three all involve contiguous subarrays or substrings with a condition, which are classic sliding window problems."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Sliding window converts O(n²) subarray problems to O(n) by reusing the previous window's computation — only the entering and exiting elements are processed each step.",
    "Fixed windows are driven by a known size k; dynamic windows expand via the right pointer and shrink via the left pointer based on a constraint.",
    "Space is O(1) for sum/count problems and O(k) or O(alphabet size) when a hash map or set tracks element frequencies inside the window.",
    "Recognise the pattern by these keywords: contiguous subarray/substring, maximum/minimum under a constraint, exactly or at most k distinct elements.",
    "Every dynamic-window solution has the same skeleton: expand right → check condition → contract left while violated → record best result."
  ]
}
\`\`\``,
    },
    {
      id: "max-sum-subarray-size-k",
      slug: "max-sum-subarray-size-k",
      title: "Maximum Sum Subarray of Size K",
      content: `## Maximum Sum Subarray of Size K

Given an array of integers and a number **k**, find the **maximum sum** of any contiguous subarray of size k.

This is the gateway problem for the fixed-size sliding window pattern. Master this and you unlock an entire family of interview questions.

### Problem Examples

| Input | k | Output | Winning Subarray |
|-------|---|--------|-----------------|
| \`[2, 1, 5, 1, 3, 2]\` | 3 | 9 | \`[5, 1, 3]\` |
| \`[2, 3, 4, 1, 5]\` | 2 | 7 | \`[3, 4]\` |

\`\`\`concept
{ "title": "The Sliding Window Mental Model", "variant": "mental-model", "content": "Imagine a physical frame of width k that you slide across the array from left to right. At each position the frame covers exactly k elements. Instead of re-summing all k elements at each position, maintain a running total: subtract the element leaving the left side and add the element entering the right. One O(1) operation per slide — not O(k)." }
\`\`\`

### Why Not Brute Force?

The naive approach computes \`sum(nums[i : i+k])\` for every valid start index \`i\`. That is **O(k)** work per window across **O(n − k + 1)** windows — giving **O(n × k)** total. For n = 10⁶ and k = 500, that is 500 million operations.

The key observation: adjacent windows share **k − 1 elements**. The sliding window exploits this overlap — we only account for the one element that left and the one that just entered.

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Brute Force — O(n × k)", "code": "def max_subarray_sum_brute(nums, k):\\n    max_sum = float('-inf')\\n    for i in range(len(nums) - k + 1):\\n        # Re-sum k elements every iteration\\n        window_sum = sum(nums[i : i + k])\\n        max_sum = max(max_sum, window_sum)\\n    return max_sum" }, "after": { "label": "Sliding Window — O(n)", "code": "def max_subarray_sum(nums, k):\\n    max_sum = float('-inf')\\n    window_sum = 0\\n    start = 0\\n    for end in range(len(nums)):\\n        window_sum += nums[end]        # expand right\\n        if end - start + 1 == k:       # window full\\n            max_sum = max(max_sum, window_sum)\\n            window_sum -= nums[start]  # shrink left\\n            start += 1\\n    return max_sum" } }
\`\`\`

### The Algorithm

\`\`\`steps
{ "title": "Fixed-Size Sliding Window", "steps": [ { "title": "Initialize", "content": "Set \`max_sum = -∞\`, \`window_sum = 0\`, \`start = 0\`. The \`start\` pointer tracks the left edge of the window; \`end\` is the right edge (loop variable)." }, { "title": "Expand right", "content": "For each \`end\` index, add \`nums[end]\` to \`window_sum\`. This grows the window one element to the right." }, { "title": "Check the invariant", "content": "When \`end - start + 1 == k\`, the window contains exactly k elements. Update: \`max_sum = max(max_sum, window_sum)\`." }, { "title": "Slide (shrink left)", "content": "Subtract \`nums[start]\` from \`window_sum\` and increment \`start\`. The window shrinks from the left, ready to accept the next element on the right." }, { "title": "Return", "content": "After the loop, \`max_sum\` holds the maximum sum seen across all k-element windows." } ] }
\`\`\`

### Visualizing Every Window

\`\`\`algoviz
{ "title": "Sliding Window on [2, 1, 5, 1, 3, 2], k = 3", "type": "array", "data": [2, 1, 5, 1, 3, 2], "frames": [ { "highlight": [0, 1, 2], "label": "Window 1: [2, 1, 5] → sum = 8. max_sum = 8", "stats": { "window_sum": 8, "max_sum": 8, "start": 0, "end": 2 } }, { "highlight": [1, 2, 3], "label": "Slide: remove 2, add 1 → Window 2: [1, 5, 1] → sum = 7. max_sum stays 8", "stats": { "window_sum": 7, "max_sum": 8, "start": 1, "end": 3 } }, { "highlight": [2, 3, 4], "label": "Slide: remove 1, add 3 → Window 3: [5, 1, 3] → sum = 9. New max_sum = 9!", "stats": { "window_sum": 9, "max_sum": 9, "start": 2, "end": 4 } }, { "highlight": [3, 4, 5], "label": "Slide: remove 5, add 2 → Window 4: [1, 3, 2] → sum = 6. max_sum stays 9", "stats": { "window_sum": 6, "max_sum": 9, "start": 3, "end": 5 } }, { "highlight": [2, 3, 4], "label": "Done — maximum sum is 9, from subarray [5, 1, 3]", "stats": { "answer": 9 } } ], "speed": 800 }
\`\`\`

### Try It Yourself

\`\`\`playground
{ "title": "Maximum Sum Subarray of Size K", "language": "python", "code": "def max_subarray_sum(nums, k):\\n    max_sum = float('-inf')\\n    window_sum = 0\\n    start = 0\\n    for end in range(len(nums)):\\n        window_sum += nums[end]\\n        if end - start + 1 == k:\\n            max_sum = max(max_sum, window_sum)\\n            window_sum -= nums[start]\\n            start += 1\\n    return max_sum\\n\\nprint(max_subarray_sum([2, 1, 5, 1, 3, 2], 3))  # Expected: 9\\nprint(max_subarray_sum([2, 3, 4, 1, 5], 2))       # Expected: 7\\nprint(max_subarray_sum([1, 1, 1, 1, 1], 1))       # Expected: 1\\nprint(max_subarray_sum([-3, -1, -2, -5], 2))      # Expected: -3", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "The Expand → Evaluate → Shrink Heartbeat", "content": "Every fixed-size sliding window follows the same rhythm: **expand** the right edge by one, **evaluate** when \`end - start + 1 == k\`, then **shrink** the left edge by one. This three-step beat repeats for every element in the array. Internalise this pattern and you can solve any fixed-window problem on autopilot." }
\`\`\`

### Complexity

| | Brute Force | Sliding Window |
|---|---|---|
| **Time** | O(n × k) | **O(n)** |
| **Space** | O(1) | **O(1)** |

Each element is added to \`window_sum\` exactly once and removed at most once — constant work per element regardless of k.

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "What is the time complexity of the sliding window solution?", "options": ["O(k)", "O(n × k)", "O(n)", "O(n log n)"], "answer": 2, "explanation": "The \`end\` pointer sweeps the array once. Each element is added to window_sum once and subtracted once — O(1) work per element — so the total is O(n)." }, { "question": "For array [3, 2, 7, 1, 4] with k = 2, what is the maximum subarray sum?", "options": ["5", "8", "9", "11"], "answer": 2, "explanation": "Windows of size 2: [3,2]=5, [2,7]=9, [7,1]=8, [1,4]=5. The maximum is 9 from subarray [2, 7]." }, { "question": "After evaluating a full window of size k, you should immediately ____.", "options": ["reset window_sum to 0", "break out of the loop", "subtract nums[start] and increment start", "subtract nums[end] and decrement end"], "answer": 2, "explanation": "Subtracting nums[start] and incrementing start shrinks the left edge by one, preparing the window to grow again on the next iteration. This is the 'slide'." }, { "question": "What is the space complexity of this sliding window approach?", "options": ["O(k) — we implicitly store the current window", "O(n) — we scan the whole array", "O(1) — only a few scalar variables", "O(n / k) — proportional to number of windows"], "answer": 2, "explanation": "We only maintain window_sum, max_sum, start, and end — four integer variables regardless of input size. No auxiliary array or hash map is needed." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Fixed-size sliding window reduces O(n × k) brute force to O(n) by reusing the overlap between adjacent windows — subtract the leaving element, add the entering one.", "The invariant \`end - start + 1 == k\` is your signal: window is full, evaluate max, then shrink the left edge.", "Space stays O(1) — no extra data structures, just a handful of scalar variables.", "This expand → evaluate → shrink heartbeat is the foundation for harder fixed-window variants: max sum with distinct elements, card-picking problems, and average-of-all-subarrays." ] }
\`\`\``,
      starterCode: `def max_sum_subarray(arr, k):
    """
    Find maximum sum of any contiguous subarray of size k.
    
    Args:
        arr: List of integers
        k: Size of subarray
    
    Returns:
        int: Maximum sum of any k-length subarray
    
    Example:
        >>> max_sum_subarray([2, 1, 5, 1, 3, 2], 3)
        9
    """
    # TODO: Use sliding window of fixed size k
    # Hint: Calculate first window sum, then slide and update
    pass


# ─── Test Cases ───

# Standard case
print(max_sum_subarray([2, 1, 5, 1, 3, 2], 3))
# Expected: 9

# Different array
print(max_sum_subarray([2, 3, 4, 1, 5], 2))
# Expected: 7

# Single element windows
print(max_sum_subarray([1, 4, 2, 10], 1))
# Expected: 10

# Entire array as window
print(max_sum_subarray([1, 2, 3, 4], 4))
# Expected: 10

# Negative numbers included
print(max_sum_subarray([-1, 2, 3, -2, 5], 3))
# Expected: 6
`,
      solutionCode: `def max_sum_subarray(arr, k):
    """
    Find maximum sum of any contiguous subarray of size k.
    
    Time Complexity: O(n) — single pass
    Space Complexity: O(1) — only tracking sums
    """
    if k > len(arr) or k <= 0:
        return 0
    
    # Calculate sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide window: remove leftmost, add new right element
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i - k] + arr[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum


# ─── Test Cases ───
print(max_sum_subarray([2, 1, 5, 1, 3, 2], 3))
# Expected: 9

print(max_sum_subarray([2, 3, 4, 1, 5], 2))
# Expected: 7

print(max_sum_subarray([1, 4, 2, 10], 1))
# Expected: 10

print(max_sum_subarray([1, 2, 3, 4], 4))
# Expected: 10

print(max_sum_subarray([-1, 2, 3, -2, 5], 3))
# Expected: 6
`,
    },
    {
      id: "smallest-subarray-sum",
      slug: "smallest-subarray-sum",
      title: "Smallest Subarray with Given Sum",
      content: `## Smallest Subarray with a Given Sum

<!-- voice:section_check concept="dynamic-size sliding window" -->

Given an array of **positive integers** and a target sum \`S\`, find the **length of the smallest contiguous subarray** whose sum is greater than or equal to \`S\`. Return \`0\` if no such subarray exists.

\`\`\`concept
{ "title": "Dynamic Sliding Window", "variant": "mental-model", "content": "A fixed window always has the same size. A dynamic window grows and shrinks based on a condition.\\n\\nFor this problem: expand the right boundary until the sum condition is satisfied, then shrink the left boundary to squeeze out the minimum valid window. Repeat until the right pointer exhausts the array." }
\`\`\`

---

### Concrete Examples

| Input | S | Output | Why |
|---|---|---|---|
| \`[2, 1, 5, 2, 3, 2]\` | 7 | 2 | Subarray \`[5, 2]\` sums to 7 |
| \`[2, 1, 5, 2, 8]\` | 7 | 1 | Single element \`[8]\` ≥ 7 |
| \`[3, 4, 1, 1, 6]\` | 8 | 3 | Subarray \`[3, 4, 1]\` or \`[1, 1, 6]\` |
| \`[1, 1, 1, 1]\` | 10 | 0 | Total sum < S |

---

### Algorithm Walkthrough

\`\`\`algoviz
{
  "title": "Trace on [2, 1, 5, 2, 3, 2], S = 7",
  "type": "array",
  "data": [2, 1, 5, 2, 3, 2],
  "frames": [
    { "highlight": [0], "label": "right=0: windowSum=2, no condition met", "stats": { "left": 0, "right": 0, "windowSum": 2, "minLen": "∞" } },
    { "highlight": [0, 1], "label": "right=1: windowSum=3, still < 7", "stats": { "left": 0, "right": 1, "windowSum": 3, "minLen": "∞" } },
    { "highlight": [0, 1, 2], "label": "right=2: windowSum=8 ≥ 7! Record length=3", "stats": { "left": 0, "right": 2, "windowSum": 8, "minLen": 3 } },
    { "highlight": [1, 2], "label": "Shrink left: remove arr[0]=2, windowSum=6 < 7. Stop shrinking.", "stats": { "left": 1, "right": 2, "windowSum": 6, "minLen": 3 } },
    { "highlight": [1, 2, 3], "label": "right=3: windowSum=8 ≥ 7! Record length=3 (no improvement)", "stats": { "left": 1, "right": 3, "windowSum": 8, "minLen": 3 } },
    { "highlight": [2, 3], "label": "Shrink left: remove arr[1]=1, windowSum=7 ≥ 7! Record length=2", "stats": { "left": 2, "right": 3, "windowSum": 7, "minLen": 2 } },
    { "highlight": [3], "label": "Shrink left: remove arr[2]=5, windowSum=2 < 7. Stop.", "stats": { "left": 3, "right": 3, "windowSum": 2, "minLen": 2 } },
    { "highlight": [3, 4], "label": "right=4: windowSum=5 < 7, keep expanding", "stats": { "left": 3, "right": 4, "windowSum": 5, "minLen": 2 } },
    { "highlight": [3, 4, 5], "label": "right=5: windowSum=7 ≥ 7! Record length=3 (no improvement)", "stats": { "left": 3, "right": 5, "windowSum": 7, "minLen": 2 } },
    { "highlight": [4, 5], "label": "Shrink: remove arr[3]=2, windowSum=5 < 7. Done. Final answer: 2", "stats": { "left": 4, "right": 5, "windowSum": 5, "minLen": 2 } }
  ],
  "speed": 900
}
\`\`\`

<!-- voice:key_insight insight="Expand until condition is met, then shrink to find the minimum — this gives O(n) time for what seems like O(n²)" -->

---

### Step-by-Step Implementation Strategy

\`\`\`steps
{
  "title": "Building the Dynamic Window",
  "steps": [
    {
      "title": "Initialize",
      "content": "Set \`left = 0\`, \`windowSum = 0\`, \`minLength = float('inf')\`.\\n\\nWe use infinity so any valid window will replace it."
    },
    {
      "title": "Expand: move right pointer",
      "content": "Loop \`right\` from \`0\` to \`n-1\`. Add \`arr[right]\` to \`windowSum\`.\\n\\nThis grows the window one element at a time."
    },
    {
      "title": "Shrink: move left pointer while valid",
      "content": "While \`windowSum >= S\`:\\n- Update \`minLength = min(minLength, right - left + 1)\`\\n- Subtract \`arr[left]\` from \`windowSum\`\\n- Increment \`left\`\\n\\nShrinking continues as long as the condition holds — we want the tightest valid window."
    },
    {
      "title": "Return result",
      "content": "After the loop, return \`minLength\` if it was updated, else \`0\`.\\n\\n\`\`\`python\\nreturn 0 if minLength == float('inf') else minLength\\n\`\`\`"
    }
  ]
}
\`\`\`

---

### Code

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Brute Force — O(n²)",
    "code": "def min_subarray_len(arr, S):\\n    n = len(arr)\\n    min_len = float('inf')\\n\\n    for i in range(n):\\n        window_sum = 0\\n        for j in range(i, n):\\n            window_sum += arr[j]\\n            if window_sum >= S:\\n                min_len = min(min_len, j - i + 1)\\n                break  # no need to extend further\\n\\n    return 0 if min_len == float('inf') else min_len"
  },
  "after": {
    "label": "Dynamic Sliding Window — O(n)",
    "code": "def min_subarray_len(arr, S):\\n    left = 0\\n    window_sum = 0\\n    min_len = float('inf')\\n\\n    for right in range(len(arr)):\\n        window_sum += arr[right]          # expand\\n\\n        while window_sum >= S:            # shrink\\n            min_len = min(min_len, right - left + 1)\\n            window_sum -= arr[left]\\n            left += 1\\n\\n    return 0 if min_len == float('inf') else min_len"
  }
}
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Why positive integers matter", "content": "The shrinking step only terminates because all values are positive — removing an element **guarantees** the sum decreases. If the array could contain zeros or negatives, the window might need to keep shrinking past a valid answer without triggering the stop condition, and this O(n) approach would break." }
\`\`\`

---

### Execution Trace

\`\`\`trace
{
  "title": "Line-by-line on [2, 1, 5, 2, 3, 2], S=7",
  "language": "python",
  "code": "def min_subarray_len(arr, S):\\n    left = 0\\n    window_sum = 0\\n    min_len = float('inf')\\n    for right in range(len(arr)):\\n        window_sum += arr[right]\\n        while window_sum >= S:\\n            min_len = min(min_len, right - left + 1)\\n            window_sum -= arr[left]\\n            left += 1\\n    return 0 if min_len == float('inf') else min_len",
  "frames": [
    { "line": 2, "vars": { "left": 0, "window_sum": 0, "min_len": "inf" }, "note": "Initialize" },
    { "line": 5, "vars": { "right": 0 }, "note": "First iteration, right=0" },
    { "line": 6, "vars": { "window_sum": 2 }, "note": "Add arr[0]=2" },
    { "line": 5, "vars": { "right": 2 }, "note": "Skip to right=2 for brevity" },
    { "line": 6, "vars": { "window_sum": 8 }, "note": "Add arr[2]=5, now 8 >= 7" },
    { "line": 8, "vars": { "min_len": 3 }, "note": "Window [0..2], length 3" },
    { "line": 9, "vars": { "window_sum": 6, "left": 1 }, "note": "Remove arr[0]=2, sum=6 < 7" },
    { "line": 5, "vars": { "right": 3 }, "note": "right=3" },
    { "line": 6, "vars": { "window_sum": 8 }, "note": "Add arr[3]=2, sum=8 >= 7" },
    { "line": 8, "vars": { "min_len": 3 }, "note": "Window [1..3], length 3, no improvement" },
    { "line": 9, "vars": { "window_sum": 7, "left": 2 }, "note": "Remove arr[1]=1, sum=7 >= 7 still!" },
    { "line": 8, "vars": { "min_len": 2 }, "note": "Window [2..3]=[5,2], length 2 — new min!" },
    { "line": 9, "vars": { "window_sum": 2, "left": 3 }, "note": "Remove arr[2]=5, sum=2 < 7. Exit while." },
    { "line": 11, "vars": { "return": 2 }, "note": "Final answer: 2", "stdout": "2" }
  ],
  "speed": 800
}
\`\`\`

---

### Complexity Analysis

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Time — O(n)",
      "icon": "⏱️",
      "content": "Each element is added to \`window_sum\` **once** (when \`right\` passes it) and removed **at most once** (when \`left\` passes it).\\n\\nTotal operations = at most **2n**, which is O(n).\\n\\nThe inner \`while\` loop does NOT make this O(n²) — its total iterations across the entire outer loop are bounded by n."
    },
    {
      "label": "Space — O(1)",
      "icon": "💾",
      "content": "We use only a fixed number of variables:\\n- \`left\`, \`right\` — two pointers\\n- \`window_sum\` — running sum\\n- \`min_len\` — running minimum\\n\\nNo extra data structures. Constant space regardless of input size."
    },
    {
      "label": "O(n log n) Alternative",
      "icon": "🔍",
      "content": "LeetCode 209 asks for an O(n log n) solution as a follow-up:\\n\\n1. Build a **prefix sum array** \`s\` where \`s[i]\` = sum of first \`i\` elements\\n2. For each left index \`i\`, binary search for the smallest \`j\` such that \`s[j] - s[i] >= target\`\\n\\nThis works because prefix sums of positive integers are **monotonically increasing**, making binary search valid. The sliding window O(n) approach is strictly better, but demonstrating the prefix sum insight shows deeper understanding."
    }
  ]
}
\`\`\`

---

\`\`\`collapse
{ "title": "Deep Dive: Why the Two-Pointer Proof Works", "content": "**Claim:** Each element enters and leaves the window at most once, giving O(n) total work.\\n\\n**Proof sketch:**\\n- \`right\` only moves forward (0 → n-1). n increments total.\\n- \`left\` only moves forward and can never exceed \`right\`. n increments total.\\n- The \`while\` loop body runs once per \`left\` increment.\\n- Therefore total \`while\` body executions ≤ n.\\n\\nThis argument — that two monotone pointers together make at most 2n moves — is the core of all sliding window proofs. Internalise it and you can analyse any sliding window problem.\\n\\n**Why shrinking must happen before expanding:** Once \`windowSum >= S\`, there's no benefit in expanding further *before* trying to shrink. Adding more elements can only increase the window length, which is the opposite of what we want." }
\`\`\`

---

### Knowledge Check

\`\`\`quiz
{
  "title": "Smallest Subarray — Check Your Understanding",
  "questions": [
    {
      "question": "For arr = [1, 4, 4] and S = 4, what is the correct output?",
      "options": ["1", "2", "3", "0"],
      "answer": 0,
      "explanation": "The single element arr[1] = 4 satisfies sum ≥ 4. The answer is 1 (window of length 1)."
    },
    {
      "question": "Why must all integers in the array be positive for this O(n) approach to work?",
      "options": [
        "Positive integers allow us to skip the inner while loop",
        "Removing an element from the window guarantees the sum decreases, so the while loop always terminates correctly",
        "Negative numbers would require a different data structure",
        "The minimum length could be 0 with negative integers"
      ],
      "answer": 1,
      "explanation": "The while loop's invariant depends on shrinking the window reducing the sum. If arr[left] ≤ 0, removing it could leave windowSum ≥ S, causing the loop to miss valid shorter windows or run incorrectly."
    },
    {
      "question": "What is the time complexity of the inner while loop across ALL outer loop iterations combined?",
      "options": ["O(n) per outer iteration", "O(n²) total", "O(n) total", "O(log n) total"],
      "answer": 2,
      "explanation": "The left pointer moves at most n times total across all iterations of the while loop (since it only moves forward and can't exceed n). So the while loop body runs at most n times in total — not n times per outer iteration."
    },
    {
      "question": "After expanding to windowSum ≥ S, why do we shrink BEFORE expanding again?",
      "options": [
        "To avoid integer overflow",
        "The while loop naturally handles this — it keeps shrinking while the condition holds, finding the tightest valid window before the next expand",
        "We only need to shrink once per expand",
        "The algorithm would produce wrong results otherwise but the complexity stays the same"
      ],
      "answer": 1,
      "explanation": "The while loop exhausts all valid shrinking steps for the current right position. Only once the sum drops below S (condition false) does control return to the for loop to expand again. This ensures we never miss a shorter valid window."
    },
    {
      "question": "For arr = [1, 1, 1, 1, 1] and S = 11, what should the function return?",
      "options": ["5", "1", "0", "11"],
      "answer": 2,
      "explanation": "The total sum of the array is 5, which is less than S = 11. No subarray can meet the condition, so we return 0. min_len stays at infinity and we return 0."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Dynamic sliding window: expand right until condition met, shrink left to find the tightest window — O(n) total because each element is added and removed at most once.",
    "Positive integers are a prerequisite: they guarantee that shrinking the window always reduces the sum, making the two-pointer invariant valid.",
    "Track minLength throughout — update it inside the while (shrink) loop, not after it, so every valid sub-window is considered.",
    "Return 0 (not infinity) when no valid subarray exists — initialise minLength to float('inf') and check at the end.",
    "This same expand-then-shrink skeleton solves many problems: minimum window substring, longest subarray with sum ≤ K, and more."
  ]
}
\`\`\``,
      starterCode: `def smallest_subarray_with_sum(arr, s):
    """
    Find length of smallest subarray with sum >= s.
    
    Args:
        arr: List of positive integers
        s: Target sum
    
    Returns:
        int: Minimum length of subarray with sum >= s, or 0 if none exists
    
    Example:
        >>> smallest_subarray_with_sum([2, 1, 5, 2, 3, 2], 7)
        2
    """
    # TODO: Use dynamic sliding window
    # Hint: Expand until sum >= s, then shrink to find minimum
    pass


# ─── Test Cases ───

# Standard case
print(smallest_subarray_with_sum([2, 1, 5, 2, 3, 2], 7))
# Expected: 2

# Single element solution
print(smallest_subarray_with_sum([2, 1, 5, 2, 8], 7))
# Expected: 1

# Entire array needed
print(smallest_subarray_with_sum([1, 2, 3, 4, 5], 15))
# Expected: 5

# No solution possible
print(smallest_subarray_with_sum([1, 2, 3], 10))
# Expected: 0

# Single element meets target
print(smallest_subarray_with_sum([5], 5))
# Expected: 1
`,
      solutionCode: `def smallest_subarray_with_sum(arr, s):
    """
    Find length of smallest subarray with sum >= s.
    
    Time Complexity: O(n) — each element visited at most twice
    Space Complexity: O(1) — only tracking window state
    """
    min_length = float('inf')
    window_sum = 0
    window_start = 0
    
    for window_end in range(len(arr)):
        # Expand window by adding current element
        window_sum += arr[window_end]
        
        # Shrink window while condition is satisfied
        while window_sum >= s:
            min_length = min(min_length, window_end - window_start + 1)
            window_sum -= arr[window_start]
            window_start += 1
    
    return min_length if min_length != float('inf') else 0


# ─── Test Cases ───
print(smallest_subarray_with_sum([2, 1, 5, 2, 3, 2], 7))
# Expected: 2

print(smallest_subarray_with_sum([2, 1, 5, 2, 8], 7))
# Expected: 1

print(smallest_subarray_with_sum([1, 2, 3, 4, 5], 15))
# Expected: 5

print(smallest_subarray_with_sum([1, 2, 3], 10))
# Expected: 0

print(smallest_subarray_with_sum([5], 5))
# Expected: 1
`,
    },
    {
      id: "longest-substring-k-distinct",
      slug: "longest-substring-k-distinct",
      title: "Longest Substring with K Distinct Characters",
      content: `## Longest Substring with K Distinct Characters

<!-- voice:section_check concept="hash map with sliding window" -->

### Problem Statement

Given a string, find the **length** of the longest substring containing **no more than K distinct characters**.

### Examples

~~~
Input:  String = "araaci", K = 2
Output: 4
Explanation: "araa" has 2 distinct characters (a, r) and length 4
~~~

~~~
Input:  String = "araaci", K = 1
Output: 2
Explanation: "aa" is the longest substring with 1 distinct character
~~~

### Approach

1. Use a hash map to track character frequencies in the current window
2. Expand window by moving right pointer
3. When distinct characters exceed K, shrink from left until valid again
4. Track maximum valid window length

<!-- voice:key_insight insight="Use a hash map to count character frequencies — this lets us know exactly when we violate the K distinct constraint" -->

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

### Complexity

- **Time:** O(n) — each character visited at most twice.
- **Space:** O(k) — hash map holds at most k+1 characters.`,
      starterCode: `def longest_substring_k_distinct(s, k):
    """
    Find length of longest substring with at most k distinct characters.
    
    Args:
        s: Input string
        k: Maximum number of distinct characters allowed
    
    Returns:
        int: Length of longest valid substring
    
    Example:
        >>> longest_substring_k_distinct("araaci", 2)
        4
    """
    # TODO: Use sliding window with hash map for character counts
    # Hint: Track character frequencies, shrink when distinct count > k
    pass


# ─── Test Cases ───

# Standard case
print(longest_substring_k_distinct("araaci", 2))
# Expected: 4

# K = 1
print(longest_substring_k_distinct("araaci", 1))
# Expected: 2

# Longer string
print(longest_substring_k_distinct("cbbebi", 3))
# Expected: 5 ("cbbeb" or "bbebi")

# K >= distinct chars in string
print(longest_substring_k_distinct("abc", 5))
# Expected: 3

# Empty string
print(longest_substring_k_distinct("", 2))
# Expected: 0
`,
      solutionCode: `def longest_substring_k_distinct(s, k):
    """
    Find length of longest substring with at most k distinct characters.
    
    Time Complexity: O(n) — each character visited at most twice
    Space Complexity: O(k) — hash map holds at most k+1 characters
    """
    if k == 0 or not s:
        return 0
    
    char_frequency = {}
    max_length = 0
    window_start = 0
    
    for window_end in range(len(s)):
        # Add current character to frequency map
        right_char = s[window_end]
        char_frequency[right_char] = char_frequency.get(right_char, 0) + 1
        
        # Shrink window while we have more than k distinct characters
        while len(char_frequency) > k:
            left_char = s[window_start]
            char_frequency[left_char] -= 1
            if char_frequency[left_char] == 0:
                del char_frequency[left_char]
            window_start += 1
        
        # Update max length
        max_length = max(max_length, window_end - window_start + 1)
    
    return max_length


# ─── Test Cases ───
print(longest_substring_k_distinct("araaci", 2))
# Expected: 4

print(longest_substring_k_distinct("araaci", 1))
# Expected: 2

print(longest_substring_k_distinct("cbbebi", 3))
# Expected: 5

print(longest_substring_k_distinct("abc", 5))
# Expected: 3

print(longest_substring_k_distinct("", 2))
# Expected: 0
`,
    },
    {
      id: "fruits-into-baskets",
      slug: "fruits-into-baskets",
      title: "Fruits Into Baskets",
      content: `## Fruits Into Baskets (Longest Subarray with 2 Distinct)

<!-- voice:section_check concept="practical application of sliding window" -->

You are visiting a farm with a single row of fruit trees. Each tree produces one type of fruit. You have **two baskets** — each basket holds exactly **one type of fruit**, with no limit on quantity.

Starting from any tree, pick one fruit from every tree moving right, until a third fruit type appears. Find the **maximum number of fruits** you can pick.

\`\`\`concept
{ "title": "The Core Reframing", "variant": "insight", "content": "Strip away the fruit story: this is 'find the longest subarray with at most 2 distinct elements.' Every sliding-window problem with a 'budget' constraint maps to this shape — maintain a frequency map, shrink from the left whenever you exceed the budget." }
\`\`\`

### Examples

| Input | Output | Window |
|-------|--------|--------|
| \`['A', 'B', 'C', 'A', 'C']\` | \`3\` | \`['C','A','C']\` — types A, C |
| \`['A', 'B', 'C', 'B', 'B', 'C']\` | \`5\` | \`['B','C','B','B','C']\` — types B, C |

---

### Visualising the Window

Watch how the window expands over \`['A', 'B', 'C', 'B', 'B', 'C']\` and shrinks the moment a third type enters:

\`\`\`algoviz
{
  "title": "Sliding Window on ['A','B','C','B','B','C']",
  "type": "array",
  "data": ["A","B","C","B","B","C"],
  "frames": [
    { "highlight": [0], "label": "right=0: add A → {A:1}. 1 type ≤ 2. max=1", "stats": { "left": 0, "right": 0, "max": 1 } },
    { "highlight": [0,1], "label": "right=1: add B → {A:1,B:1}. 2 types ≤ 2. max=2", "stats": { "left": 0, "right": 1, "max": 2 } },
    { "highlight": [0,1,2], "label": "right=2: add C → {A:1,B:1,C:1}. 3 types > 2! Shrink...", "stats": { "left": 0, "right": 2, "max": 2 } },
    { "highlight": [1,2], "label": "Shrink: remove A (left→1) → {B:1,C:1}. 2 types OK. max=2", "stats": { "left": 1, "right": 2, "max": 2 } },
    { "highlight": [1,2,3], "label": "right=3: add B → {B:2,C:1}. 2 types ≤ 2. max=3", "stats": { "left": 1, "right": 3, "max": 3 } },
    { "highlight": [1,2,3,4], "label": "right=4: add B → {B:3,C:1}. 2 types ≤ 2. max=4", "stats": { "left": 1, "right": 4, "max": 4 } },
    { "highlight": [1,2,3,4,5], "label": "right=5: add C → {B:3,C:2}. 2 types ≤ 2. max=5 ✓", "stats": { "left": 1, "right": 5, "max": 5 } }
  ],
  "speed": 900
}
\`\`\`

---

### Algorithm

\`\`\`steps
{
  "title": "Shrinkable Sliding Window",
  "steps": [
    {
      "title": "Initialise",
      "content": "Set \`left = 0\`, \`max_fruits = 0\`, and an empty frequency map \`count = {}\`."
    },
    {
      "title": "Expand right",
      "content": "For each \`right\` index, add \`fruits[right]\` to the map: \`count[fruit] += 1\`."
    },
    {
      "title": "Shrink if over budget",
      "content": "While \`len(count) > 2\`: decrement \`count[fruits[left]]\`. If it reaches 0, delete the key. Advance \`left\`."
    },
    {
      "title": "Record maximum",
      "content": "After each shrink (or if no shrink needed), update \`max_fruits = max(max_fruits, right - left + 1)\`."
    },
    {
      "title": "Return",
      "content": "After the loop, \`max_fruits\` holds the length of the longest valid subarray."
    }
  ]
}
\`\`\`

---

### Implementation

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Python",
      "icon": "🐍",
      "content": "\`\`\`python\\nfrom collections import defaultdict\\nfrom typing import List\\n\\nclass Solution:\\n    def totalFruit(self, fruits: List[int]) -> int:\\n        count = defaultdict(int)  # fruit type → frequency in window\\n        left = 0\\n        max_fruits = 0\\n\\n        for right in range(len(fruits)):\\n            count[fruits[right]] += 1\\n\\n            # Shrink window until at most 2 distinct types\\n            while len(count) > 2:\\n                count[fruits[left]] -= 1\\n                if count[fruits[left]] == 0:\\n                    del count[fruits[left]]\\n                left += 1\\n\\n            max_fruits = max(max_fruits, right - left + 1)\\n\\n        return max_fruits\\n\`\`\`"
    },
    {
      "label": "JavaScript",
      "icon": "🟨",
      "content": "\`\`\`javascript\\nvar totalFruit = function(fruits) {\\n    const count = {};  // fruit type → frequency in window\\n    let left = 0;\\n    let maxFruits = 0;\\n\\n    for (let right = 0; right < fruits.length; right++) {\\n        const fruit = fruits[right];\\n        count[fruit] = (count[fruit] || 0) + 1;\\n\\n        // Shrink window until at most 2 distinct types\\n        while (Object.keys(count).length > 2) {\\n            const leftFruit = fruits[left];\\n            count[leftFruit] -= 1;\\n            if (count[leftFruit] === 0) {\\n                delete count[leftFruit];\\n            }\\n            left++;\\n        }\\n\\n        maxFruits = Math.max(maxFruits, right - left + 1);\\n    }\\n\\n    return maxFruits;\\n};\\n\`\`\`"
    }
  ]
}
\`\`\`

---

### Step-by-Step Trace

Trace the Python solution on \`fruits = [1, 2, 1]\`:

\`\`\`trace
{
  "title": "Trace: fruits = [1, 2, 1]",
  "language": "python",
  "code": "count = defaultdict(int)\\nleft = 0\\nmax_fruits = 0\\nfor right in range(len(fruits)):\\n    count[fruits[right]] += 1\\n    while len(count) > 2:\\n        count[fruits[left]] -= 1\\n        if count[fruits[left]] == 0:\\n            del count[fruits[left]]\\n        left += 1\\n    max_fruits = max(max_fruits, right - left + 1)",
  "frames": [
    { "line": 4, "vars": { "right": 0, "left": 0, "count": "{}", "max_fruits": 0 }, "note": "Start loop, right=0" },
    { "line": 5, "vars": { "right": 0, "left": 0, "count": "{1:1}", "max_fruits": 0 }, "note": "Add fruits[0]=1 to count" },
    { "line": 9, "vars": { "right": 0, "left": 0, "count": "{1:1}", "max_fruits": 1 }, "note": "1 type ≤ 2, skip while. max=max(0,1)=1" },
    { "line": 4, "vars": { "right": 1, "left": 0, "count": "{1:1}", "max_fruits": 1 }, "note": "right=1" },
    { "line": 5, "vars": { "right": 1, "left": 0, "count": "{1:1,2:1}", "max_fruits": 1 }, "note": "Add fruits[1]=2" },
    { "line": 9, "vars": { "right": 1, "left": 0, "count": "{1:1,2:1}", "max_fruits": 2 }, "note": "2 types ≤ 2, skip while. max=2" },
    { "line": 4, "vars": { "right": 2, "left": 0, "count": "{1:1,2:1}", "max_fruits": 2 }, "note": "right=2" },
    { "line": 5, "vars": { "right": 2, "left": 0, "count": "{1:2,2:1}", "max_fruits": 2 }, "note": "Add fruits[2]=1 → count[1]=2" },
    { "line": 9, "vars": { "right": 2, "left": 0, "count": "{1:2,2:1}", "max_fruits": 3 }, "note": "2 types ≤ 2, skip while. max=max(2,3)=3", "stdout": "3" }
  ],
  "speed": 800
}
\`\`\`

---

### Complexity

\`\`\`concept
{ "title": "Why O(n) time, O(1) space?", "variant": "rule", "content": "Time: O(n) — every element is added once and removed at most once (left pointer only moves right). The inner while loop does NOT make this O(n²); across the entire run, left advances at most n times total.\\n\\nSpace: O(1) — the frequency map holds at most 3 entries (2 valid types + 1 overflow type being evicted). This is bounded by the basket budget K=2, not input size." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Generalising to K Distinct", "content": "This problem is a special case of **Longest Substring with K Distinct Characters** where K=2.\\n\\nTo generalise, replace the hard-coded \`> 2\` check with \`> k\`:\\n\\n\`\`\`python\\nwhile len(count) > k:\\n    count[fruits[left]] -= 1\\n    if count[fruits[left]] == 0:\\n        del count[fruits[left]]\\n    left += 1\\n\`\`\`\\n\\nThe same pattern — expand right, shrink left — solves the entire family:\\n- K=1 → longest run of a single element\\n- K=2 → Fruits Into Baskets (LeetCode 904)\\n- K=26 → longest substring with all distinct characters" }
\`\`\`

---

### Check Your Understanding

\`\`\`quiz
{
  "title": "Fruits Into Baskets",
  "questions": [
    {
      "question": "What is the correct output for fruits = ['A', 'B', 'C', 'A', 'C']?",
      "options": ["2", "3", "4", "5"],
      "answer": 1,
      "explanation": "The longest subarray with at most 2 distinct types is ['C','A','C'] (indices 2–4), which has length 3. ['A','B'] is only 2. ['A','B','C'] has 3 types and is invalid."
    },
    {
      "question": "After adding a third fruit type to the window, what happens to the left pointer?",
      "options": [
        "It jumps directly past the first occurrence of the overflowing type",
        "It advances one step at a time, decrementing counts, until only 2 types remain",
        "It resets to 0 and we restart",
        "It stays fixed; only the right pointer moves back"
      ],
      "answer": 1,
      "explanation": "The while loop shrinks the window by incrementing left one step at a time, decrementing the count of fruits[left] each time, and removing the entry from the map when its count drops to 0. This continues until len(count) ≤ 2."
    },
    {
      "question": "Why is the space complexity O(1) and not O(n)?",
      "options": [
        "We only store the two basket types, never intermediate values",
        "The frequency map holds at most K+1 = 3 entries before shrinking kicks in",
        "The input array is not counted in space complexity",
        "We use a fixed-size array of 26 letters instead of a dict"
      ],
      "answer": 1,
      "explanation": "The frequency map can temporarily hold K+1 entries (the two valid types plus one overflow type that triggers the while loop). Since K=2 is a constant, the map size is bounded by 3 — independent of n. This is O(1) auxiliary space."
    },
    {
      "question": "Which problem does 'Fruits Into Baskets' directly generalise to?",
      "options": [
        "Maximum Sum Subarray of Size K",
        "Minimum Window Substring",
        "Longest Substring with K Distinct Characters",
        "Permutation in a String"
      ],
      "answer": 2,
      "explanation": "Fruits Into Baskets is exactly 'Longest Subarray with at most 2 Distinct Elements', a special case of 'Longest Substring with K Distinct Characters' where K=2. Replacing the hard-coded 2 with a variable K solves the general problem."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Fruits Into Baskets = longest subarray with at most 2 distinct elements — recognising this reframing unlocks the solution immediately.",
    "Use a frequency map + two pointers: expand right unconditionally, shrink left whenever the map exceeds 2 keys.",
    "Time complexity is O(n) because each element is added and removed at most once; the inner while loop is amortised across the full pass.",
    "Space is O(1) — the map holds at most K+1 entries regardless of input size.",
    "The pattern generalises to K distinct types by replacing the hard-coded 2 with a variable — one template solves the whole family."
  ]
}
\`\`\``,
      starterCode: `def max_fruits_in_baskets(fruits):
    """
    Find maximum number of fruits that can be collected with 2 baskets.
    Each basket holds one type of fruit.
    
    Args:
        fruits: List of characters representing fruit types
    
    Returns:
        int: Maximum fruits that can be collected
    
    Example:
        >>> max_fruits_in_baskets(['A', 'B', 'C', 'A', 'C'])
        3
    """
    # TODO: Find longest subarray with at most 2 distinct elements
    # Hint: Same pattern as longest substring with k distinct, where k=2
    pass


# ─── Test Cases ───

# Standard case
print(max_fruits_in_baskets(['A', 'B', 'C', 'A', 'C']))
# Expected: 3

# Better collection possible
print(max_fruits_in_baskets(['A', 'B', 'C', 'B', 'B', 'C']))
# Expected: 5

# All same type
print(max_fruits_in_baskets(['A', 'A', 'A', 'A']))
# Expected: 4

# Two types throughout
print(max_fruits_in_baskets(['A', 'B', 'A', 'B', 'A']))
# Expected: 5

# Single tree
print(max_fruits_in_baskets(['A']))
# Expected: 1
`,
      solutionCode: `def max_fruits_in_baskets(fruits):
    """
    Find maximum number of fruits that can be collected with 2 baskets.
    Each basket holds one type of fruit.
    
    Time Complexity: O(n) — single pass
    Space Complexity: O(1) — at most 3 types tracked
    """
    basket = {}  # fruit_type -> count
    max_fruits = 0
    window_start = 0
    
    for window_end in range(len(fruits)):
        # Add current fruit to basket
        fruit = fruits[window_end]
        basket[fruit] = basket.get(fruit, 0) + 1
        
        # Shrink while we have more than 2 types
        while len(basket) > 2:
            left_fruit = fruits[window_start]
            basket[left_fruit] -= 1
            if basket[left_fruit] == 0:
                del basket[left_fruit]
            window_start += 1
        
        # Update max
        max_fruits = max(max_fruits, window_end - window_start + 1)
    
    return max_fruits


# ─── Test Cases ───
print(max_fruits_in_baskets(['A', 'B', 'C', 'A', 'C']))
# Expected: 3

print(max_fruits_in_baskets(['A', 'B', 'C', 'B', 'B', 'C']))
# Expected: 5

print(max_fruits_in_baskets(['A', 'A', 'A', 'A']))
# Expected: 4

print(max_fruits_in_baskets(['A', 'B', 'A', 'B', 'A']))
# Expected: 5

print(max_fruits_in_baskets(['A']))
# Expected: 1
`,
    },
    {
      id: "sliding-window-checkpoint",
      slug: "sliding-window-checkpoint",
      title: "Module Checkpoint: Sliding Window",
      content: `## Module Checkpoint: Sliding Window

<!-- voice:checkpoint_intro -->

You've completed the Sliding Window module — one of the most powerful patterns in coding interviews. Before moving on, let's consolidate what you've built with a structured review and five-question check.

\`\`\`concept
{ "title": "The Core Insight", "variant": "mental-model", "content": "Sliding window transforms O(n²) brute force into O(n) by reusing computation. Instead of recalculating the entire window from scratch, you add one element (right pointer expands) and remove one element (left pointer advances). Each element is visited at most twice — once added, once removed." }
\`\`\`

### What You Mastered

\`\`\`tabs
{ "tabs": [ { "label": "Fixed Window", "icon": "📏", "content": "**When to use:** Problem gives you an exact window size \`k\`.\\n\\n**Pattern:**\\n1. Build the initial window of size \`k\`\\n2. Slide: subtract the element leaving (\`arr[i - k]\`), add the element entering (\`arr[i]\`)\\n3. Track the best result at each step\\n\\n**Complexity:** O(n) time, O(1) space\\n\\n**Example problems:** Maximum sum subarray of size K, average of subarrays of size K" }, { "label": "Dynamic Window", "icon": "🔄", "content": "**When to use:** Window size varies based on a constraint (e.g., \\"at most K distinct characters\\").\\n\\n**Pattern:**\\n1. Expand \`right\` pointer unconditionally\\n2. While constraint is **violated** → shrink by advancing \`left\`\\n3. Record answer when constraint is satisfied\\n\\n**Complexity:** O(n) amortized — each pointer moves at most n steps total\\n\\n**Example problems:** Longest substring without repeating characters, minimum window substring" }, { "label": "Hash Map Window", "icon": "🗺️", "content": "**When to use:** Need to track *what's inside* the window, not just a running sum.\\n\\n**Pattern:**\\n- \`freq[char]++\` when element enters (right expands)\\n- \`freq[char]--\` when element leaves (left shrinks)\\n- Remove key when count hits 0 to avoid stale entries\\n\\n**Example problems:** Permutation in a string, find all anagrams, longest substring with K distinct characters" }, { "label": "When It Doesn't Apply", "icon": "🚫", "content": "Sliding window **cannot** help when:\\n- You need non-contiguous elements (use DP or greedy)\\n- The constraint involves global properties, not local window properties\\n- You need to backtrack or revisit elements\\n- Validity cannot be maintained *incrementally* as you slide\\n\\nThe key signal: if knowing the old window doesn't help you compute the new window, sliding window won't work." } ] }
\`\`\`

### Visualizing the Slide

Watch a fixed window of size **k = 3** slide over \`[2, 1, 5, 1, 3, 2]\` to find the maximum subarray sum:

\`\`\`algoviz
{ "title": "Fixed Window: Max Sum Subarray (k=3)", "type": "array", "data": [2, 1, 5, 1, 3, 2], "frames": [ { "highlight": [0, 1, 2], "label": "Initial window: sum = 2+1+5 = 8", "stats": { "window_sum": 8, "max_sum": 8 } }, { "highlight": [1, 2, 3], "label": "Slide right: subtract arr[0]=2, add arr[3]=1 → 8-2+1 = 7", "stats": { "window_sum": 7, "max_sum": 8 } }, { "highlight": [2, 3, 4], "label": "Slide right: subtract arr[1]=1, add arr[4]=3 → 7-1+3 = 9 ✓ new max", "stats": { "window_sum": 9, "max_sum": 9 } }, { "highlight": [3, 4, 5], "label": "Slide right: subtract arr[2]=5, add arr[5]=2 → 9-5+2 = 6", "stats": { "window_sum": 6, "max_sum": 9 } } ], "speed": 900 }
\`\`\`

Notice: each step is one subtraction and one addition — never a full recompute.

\`\`\`quiz
{ "title": "Sliding Window Knowledge Check", "questions": [ { "question": "What is the time complexity of a well-implemented sliding window solution?", "options": [ "O(n²) — we still check all subarrays", "O(n log n) — requires sorting", "O(n) — each element is visited at most twice", "O(1) — constant time regardless of input" ], "answer": 2, "explanation": "Each element is added to the window once (right pointer) and removed at most once (left pointer), giving at most 2n operations total — O(n). This is the fundamental reason sliding window beats brute force." }, { "question": "In a fixed-size sliding window, what is the correct update when moving the window one step to the right?", "options": [ "Recalculate the entire window sum from scratch", "Add the new rightmost element and subtract the element that left", "Sort the window contents and take the middle value", "Reset the sum to zero and restart" ], "answer": 1, "explanation": "new_sum = old_sum - arr[left] + arr[right]. This O(1) update replaces O(k) recomputation, producing the overall O(n) runtime across all n - k + 1 windows." }, { "question": "When should you shrink a dynamic sliding window (advance the left pointer)?", "options": [ "Whenever the window is smaller than the target size", "Whenever the window violates the problem constraint", "At every step, regardless of the current constraint state", "Never — only the right pointer moves" ], "answer": 1, "explanation": "In dynamic windows, shrink only when the constraint is violated (e.g., too many distinct characters, or sum exceeds target). Keep shrinking until the constraint is restored, then resume expanding right." }, { "question": "True or False: Sliding window can only be applied to sorted arrays.", "options": [ "True — the input must be sorted first", "False — sliding window works on unsorted arrays and strings", "True — but only for fixed-size windows", "True — but only for dynamic windows" ], "answer": 1, "explanation": "Sorting is not required. Sliding window relies on contiguity, not ordering. 'Longest substring without repeating characters' operates on completely unsorted strings — a classic example on unsorted input." }, { "question": "Which data structure is most useful for tracking distinct character frequencies inside a sliding window?", "options": [ "Array indexed by character code", "Stack (LIFO order)", "Hash map (character → count)", "Queue (FIFO order)" ], "answer": 2, "explanation": "A hash map maps each character to its current frequency in the window. Increment on entry, decrement on exit, delete when count reaches 0. This gives O(1) lookups to check constraints like 'at most K distinct characters'." } ] }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Why is dynamic sliding window still O(n) with an inner while loop?", "content": "It looks like O(n²) — an outer loop over \`right\` and an inner \`while\` loop advancing \`left\`. But amortized analysis shows it's O(n):\\n\\n- The \`right\` pointer advances exactly **n** times total.\\n- The \`left\` pointer also advances at most **n** times total — it never resets or goes backward.\\n- Total pointer movements: at most 2n = **O(n)**.\\n\\nThe cost of the inner loop is amortized across all outer iterations, not paid fresh each time. This is the same reasoning behind O(1) amortized push on a dynamic array — the expensive operations happen rarely enough that the average cost stays constant." }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Sliding window cuts O(n²) brute force to O(n) by reusing state: add one element in, subtract one element out — never recompute from scratch", "Fixed windows use an exact size k; dynamic windows let a constraint control when to expand (right++) or shrink (left++)", "Hash maps track window contents for O(1) constraint checks — increment on entry, decrement on exit, delete at zero", "Even with an inner shrink loop, dynamic windows are O(n) amortized because left moves at most n steps total across the entire run", "Sliding window requires contiguous subarrays or substrings — non-contiguous selections or problems requiring backtracking need a different approach" ] }
\`\`\`

### Voice Summary

<!-- voice:checkpoint_summary -->

Your coach will ask you to explain the following — try speaking your answers aloud before moving on:

- What's the structural difference between a fixed and a dynamic sliding window, and what in the problem statement tells you which to use?
- Why is a dynamic sliding window O(n) even though it has a nested \`while\` loop?
- Name a problem type where sliding window **cannot** be applied and explain exactly why the technique breaks down.

**You've built one of the most interview-critical patterns in your toolkit — strong work finishing the Sliding Window module.**`,
    },
  ],
};
