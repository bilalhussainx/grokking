import { Module } from "../types";

export const modifiedBinarySearchModule: Module = {
  id: "modified-binary-search",
  title: "Modified Binary Search",
  description: "Master the Modified Binary Search pattern for searching in rotated arrays, finding boundaries, and solving search variations. Essential for interview problems involving sorted arrays with twists.",
  lessons: [
    {
      id: "modified-binary-search-intro",
      slug: "modified-binary-search-intro",
      title: "Introduction to Modified Binary Search",
      content: `## The Modified Binary Search Pattern

Standard binary search is elegant — but it only works on a perfectly sorted array. Real interviews throw you curveballs: arrays that were sorted and then rotated, searches for boundary positions rather than exact values, or arrays of unknown length.

The **Modified Binary Search** pattern teaches you how to adapt the core binary search template to handle all of these cases while preserving the O(log n) time complexity that makes binary search worth using in the first place.

\`\`\`concept
{ "title": "The Core Insight", "variant": "mental-model", "content": "Classic binary search works by eliminating half the search space each step. Modified binary search does the same thing — but before discarding a half, you first answer: 'which half am I sure is sorted?' Once you know that, you can determine whether the target lives in the sorted half or the other half, and discard accordingly. The key is that even a rotated array always has at least one sorted half at every step." }
\`\`\`

### Why Standard Binary Search Breaks

Consider the array \`[4, 5, 6, 7, 0, 1, 2]\`. This was originally \`[0, 1, 2, 4, 5, 6, 7]\` rotated at index 3. If you search for \`0\` with vanilla binary search:

- \`mid = 3\`, \`arr[mid] = 7\`
- \`0 < 7\`, so you move \`right = mid - 1 = 2\`
- You now search \`[4, 5, 6]\` — but \`0\` was in the right half!

Standard binary search confidently walks into the wrong half. You need an extra check.

\`\`\`algoviz
{ "title": "Rotated Array: Finding target=0 in [4,5,6,7,0,1,2]", "type": "array", "data": [4, 5, 6, 7, 0, 1, 2], "frames": [ { "highlight": [0, 6], "label": "Start: left=0, right=6, mid=3", "stats": { "left": 0, "right": 6, "mid": 3 } }, { "highlight": [3], "label": "arr[mid]=7. Left half [4..7] is sorted. Is 0 in [4..7)? No → search right half", "stats": { "left": 4, "right": 6, "mid": 3 } }, { "highlight": [4, 5, 6], "label": "Now left=4, right=6, mid=5", "stats": { "left": 4, "right": 6, "mid": 5 } }, { "highlight": [5], "label": "arr[mid]=1. Right half [1..2] is sorted. Is 0 in (1..2]? No → search left half", "stats": { "left": 4, "right": 4, "mid": 5 } }, { "highlight": [4], "label": "left=right=4, arr[4]=0 ✓ Found at index 4!", "stats": { "left": 4, "right": 4, "mid": 4 } } ], "speed": 900 }
\`\`\`

### The Classic Template (Your Starting Point)

Every modified binary search begins with this core template. You modify the conditions inside — not the structure.

\`\`\`python
left, right = 0, len(arr) - 1

while left <= right:
    mid = left + (right - left) // 2   # avoids integer overflow

    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        left = mid + 1
    else:
        right = mid - 1

return -1
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Always use left + (right - left) // 2", "content": "Writing \`mid = (left + right) // 2\` can overflow in languages with fixed-size integers (Java, C++). The form \`left + (right - left) // 2\` is mathematically identical but overflow-safe. Python has arbitrary-precision integers so it doesn't matter there, but build the habit anyway." }
\`\`\`

### Four Common Modifications

\`\`\`tabs
{ "tabs": [ { "label": "Rotated Array", "icon": "🔄", "content": "**Problem:** Array was sorted then rotated. Search for target.\\n\\n**Key idea:** At each step, one half is always fully sorted. Identify which half is sorted by comparing \`arr[left]\` and \`arr[mid]\`.\\n\\n\`\`\`python\\nif arr[left] <= arr[mid]:   # left half is sorted\\n    if arr[left] <= target < arr[mid]:\\n        right = mid - 1     # target is in left half\\n    else:\\n        left = mid + 1      # target must be in right half\\nelse:                       # right half is sorted\\n    if arr[mid] < target <= arr[right]:\\n        left = mid + 1      # target is in right half\\n    else:\\n        right = mid - 1     # target must be in left half\\n\`\`\`" }, { "label": "Find Boundary", "icon": "🎯", "content": "**Problem:** Find first or last occurrence of target. Don't stop on the first match.\\n\\n**Key idea:** When you find the target, record the index and keep searching in one direction.\\n\\n\`\`\`python\\nresult = -1\\nwhile left <= right:\\n    mid = left + (right - left) // 2\\n    if arr[mid] == target:\\n        result = mid        # record it\\n        right = mid - 1     # keep searching LEFT for first occurrence\\n        # OR: left = mid + 1 for last occurrence\\n    elif arr[mid] < target:\\n        left = mid + 1\\n    else:\\n        right = mid - 1\\nreturn result\\n\`\`\`" }, { "label": "Order-Agnostic", "icon": "↕️", "content": "**Problem:** Array is sorted but you don't know if ascending or descending.\\n\\n**Key idea:** Peek at the first and last element to determine direction, then adjust comparisons accordingly.\\n\\n\`\`\`python\\nis_ascending = arr[0] < arr[-1]\\n\\nwhile left <= right:\\n    mid = left + (right - left) // 2\\n    if arr[mid] == target:\\n        return mid\\n    if is_ascending:\\n        if arr[mid] < target:\\n            left = mid + 1\\n        else:\\n            right = mid - 1\\n    else:                   # descending: flip the logic\\n        if arr[mid] > target:\\n            left = mid + 1\\n        else:\\n            right = mid - 1\\n\`\`\`" }, { "label": "Infinite Array", "icon": "∞", "content": "**Problem:** Array is sorted but length is unknown (simulated as very large).\\n\\n**Key idea:** Use **exponential search** to find a valid right boundary first, then run standard binary search.\\n\\n\`\`\`python\\n# Phase 1: Expand bounds exponentially\\nleft, right = 0, 1\\nwhile arr[right] < target:\\n    new_left = right + 1\\n    right = right + (right - left + 1) * 2  # double the window\\n    left = new_left\\n\\n# Phase 2: Standard binary search within bounds\\nwhile left <= right:\\n    mid = left + (right - left) // 2\\n    if arr[mid] == target:\\n        return mid\\n    elif arr[mid] < target:\\n        left = mid + 1\\n    else:\\n        right = mid - 1\\n\`\`\`" } ] }
\`\`\`

### Complexity Summary

| Variation | Time | Space | Notes |
|-----------|------|-------|-------|
| Rotated array search | O(log n) | O(1) | Single pass |
| Find first/last occurrence | O(log n) | O(1) | Doesn't stop early |
| Order-agnostic search | O(log n) | O(1) | One extra comparison at start |
| Infinite array search | O(log n) | O(1) | Exponential phase is O(log n) too |

\`\`\`callout
{ "type": "info", "title": "3 Binary Search Variants to Know", "content": "Practitioners identify three core binary search shapes:\\n\\n1. **Exact match** — return index when \`arr[mid] == target\`\\n2. **Lower bound** — find first index where \`arr[mid] >= target\` (keep going left on match)\\n3. **Upper bound** — find last index where \`arr[mid] <= target\` (keep going right on match)\\n\\nAll modified binary search problems reduce to one of these three variants with adapted conditions." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "You're searching for target=5 in rotated array [6,7,0,1,2,3,4,5]. At mid index 3, arr[mid]=1. Which half is sorted?", "options": ["Left half [6,7,0,1] is sorted", "Right half [1,2,3,4,5] is sorted", "Neither half is sorted", "Both halves are sorted"], "answer": 1, "explanation": "Compare arr[left]=6 with arr[mid]=1. Since 6 > 1, the left half is NOT fully sorted (it contains the rotation point). Therefore the right half [2,3,4,5] is sorted. Since 5 is in range (1, 5], we search the right half." }, { "question": "When finding the FIRST occurrence of a duplicate target, what do you do when arr[mid] == target?", "options": ["Return mid immediately", "Set left = mid + 1 and continue", "Set right = mid - 1 and continue", "Set result = mid, then set left = mid + 1"], "answer": 2, "explanation": "Save the current index (result = mid) then continue searching the LEFT half by setting right = mid - 1. This ensures you find the earliest occurrence. Returning immediately would miss any earlier duplicates. Setting left = mid + 1 would find the LAST occurrence instead." }, { "question": "What is the time complexity of searching in an infinite sorted array using exponential search + binary search?", "options": ["O(n)", "O(log n)", "O(n log n)", "O(sqrt(n))"], "answer": 1, "explanation": "Both phases are O(log n). The exponential search doubles the window each step, so it reaches a window containing the target in O(log p) steps where p is the target's position. The subsequent binary search on that window is also O(log p). Total: O(log n)." }, { "question": "Which condition correctly identifies that the LEFT half of a rotated array is sorted?", "options": ["arr[mid] > arr[right]", "arr[left] <= arr[mid]", "arr[left] > arr[mid]", "arr[mid] < arr[right]"], "answer": 1, "explanation": "If arr[left] <= arr[mid], the subarray from left to mid is in ascending order — it contains no rotation point. This is the standard check. Note: arr[mid] > arr[right] implies the rotation is in the right half (equivalently the left is sorted), but arr[left] <= arr[mid] is the more direct and commonly used condition." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Modified Binary Search keeps O(log n) time by always eliminating half the search space — the key is determining WHICH half to eliminate even when the array isn't fully sorted.", "In a rotated sorted array, at least one of the two halves is always sorted at every step. Identify the sorted half, check if your target falls inside it, and eliminate accordingly.", "To find boundaries (first/last occurrence), resist returning on the first match — save the index and keep searching in the appropriate direction.", "All binary search variants share the same skeleton: the while loop, the mid calculation, and the left/right pointer updates. Only the branching conditions change." ] }
\`\`\``,
    },
    {
      id: "order-agnostic-binary-search",
      slug: "order-agnostic-binary-search",
      title: "Order-Agnostic Binary Search",
      content: `## Order-Agnostic Binary Search

<!-- voice:section_check concept="Binary search without knowing order" -->

Standard binary search assumes you know the sort direction. But what if you don't? Order-agnostic binary search handles this with a single extra check before the main loop.

\`\`\`concept
{ "title": "The Core Insight", "variant": "mental-model", "content": "Compare arr[0] with arr[last]. If arr[0] < arr[last], the array is ascending — use standard binary search comparisons. If arr[0] > arr[last], the array is descending — flip the comparisons. Everything else stays identical." }
\`\`\`

### Problem Statement

Given a sorted array (either ascending **or** descending), return the index of \`target\`, or \`-1\` if not found. You must determine the sort order at runtime.

**Examples:**

| Input | Target | Output | Why |
|-------|--------|--------|-----|
| \`[4, 6, 10]\` | \`10\` | \`2\` | Ascending: \`arr[0]=4 < arr[2]=10\` |
| \`[10, 6, 4]\` | \`10\` | \`0\` | Descending: \`arr[0]=10 > arr[2]=4\` |
| \`[40, 10, 5, 2, 1]\` | \`10\` | \`1\` | Descending: found at index 1 |

---

### The Algorithm

\`\`\`steps
{ "title": "Order-Agnostic Binary Search", "steps": [ { "title": "Detect sort order", "content": "Check \`arr[start] < arr[end]\`.\\n- **True** → ascending order\\n- **False** → descending order\\n\\nStore this as a boolean \`isAscending\` before the loop begins." }, { "title": "Set up two pointers", "content": "Initialize \`start = 0\`, \`end = arr.length - 1\`. These define the active search window — identical to standard binary search." }, { "title": "Compute mid (overflow-safe)", "content": "Inside the loop: \`mid = start + Math.floor((end - start) / 2)\`.\\n\\nThis avoids integer overflow compared to \`(start + end) / 2\`." }, { "title": "Check the middle element", "content": "If \`arr[mid] === target\`, return \`mid\`. Done." }, { "title": "Decide which half to discard", "content": "**Ascending:** If \`target < arr[mid]\`, search left (\`end = mid - 1\`); else search right (\`start = mid + 1\`).\\n\\n**Descending:** Flip the comparisons — if \`target > arr[mid]\`, search left (\`end = mid - 1\`); else search right (\`start = mid + 1\`).\\n\\nThis is the **only** line that differs from standard binary search." }, { "title": "Return -1 if not found", "content": "If the loop exits with \`start > end\`, the target is not in the array. Return \`-1\`." } ] }
\`\`\`

---

### Visualising the Search

Tracing \`arr = [10, 6, 4]\`, \`target = 4\` (descending):

\`\`\`algoviz
{ "title": "Order-Agnostic Binary Search — Descending Array", "type": "array", "data": [10, 6, 4], "frames": [ { "highlight": [0, 2], "label": "arr[0]=10 > arr[2]=4 → descending order detected", "stats": { "start": 0, "end": 2, "isAsc": false } }, { "highlight": [1], "label": "mid=1, arr[mid]=6. target=4 < arr[mid]=6, but descending → search RIGHT (start = mid+1)", "stats": { "start": 0, "end": 2, "mid": 1 } }, { "highlight": [2], "label": "mid=2, arr[mid]=4 === target → FOUND at index 2", "stats": { "start": 2, "end": 2, "mid": 2 } } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "The Flip That Trips People Up", "content": "In a **descending** array, smaller indices hold **larger** values. So when \`target < arr[mid]\`, the target is to the **right** — the opposite of ascending. Flip both comparison branches, not just one." }
\`\`\`

---

### Implementation

\`\`\`tabs
{ "tabs": [ { "label": "Python", "icon": "🐍", "content": "\`\`\`python\\ndef order_agnostic_binary_search(arr, target):\\n    start, end = 0, len(arr) - 1\\n    is_ascending = arr[start] < arr[end]\\n\\n    while start <= end:\\n        mid = start + (end - start) // 2\\n\\n        if arr[mid] == target:\\n            return mid\\n\\n        if is_ascending:\\n            if target < arr[mid]:\\n                end = mid - 1\\n            else:\\n                start = mid + 1\\n        else:  # descending\\n            if target > arr[mid]:\\n                end = mid - 1\\n            else:\\n                start = mid + 1\\n\\n    return -1\\n\\n# Tests\\nprint(order_agnostic_binary_search([4, 6, 10], 10))   # 2\\nprint(order_agnostic_binary_search([10, 6, 4], 10))   # 0\\nprint(order_agnostic_binary_search([40,10,5,2,1], 2)) # 3\\n\`\`\`" }, { "label": "TypeScript", "icon": "🔷", "content": "\`\`\`typescript\\nfunction orderAgnosticBinarySearch(arr: number[], target: number): number {\\n  let start = 0;\\n  let end = arr.length - 1;\\n  const isAscending = arr[start] < arr[end];\\n\\n  while (start <= end) {\\n    const mid = start + Math.floor((end - start) / 2);\\n\\n    if (arr[mid] === target) return mid;\\n\\n    if (isAscending) {\\n      if (target < arr[mid]) end = mid - 1;\\n      else start = mid + 1;\\n    } else {\\n      if (target > arr[mid]) end = mid - 1;\\n      else start = mid + 1;\\n    }\\n  }\\n\\n  return -1;\\n}\\n\\nconsole.log(orderAgnosticBinarySearch([4, 6, 10], 10));    // 2\\nconsole.log(orderAgnosticBinarySearch([10, 6, 4], 10));    // 0\\nconsole.log(orderAgnosticBinarySearch([40,10,5,2,1], 2));  // 3\\n\`\`\`" }, { "label": "Java", "icon": "☕", "content": "\`\`\`java\\npublic static int orderAgnosticBinarySearch(int[] arr, int target) {\\n    int start = 0, end = arr.length - 1;\\n    boolean isAscending = arr[start] < arr[end];\\n\\n    while (start <= end) {\\n        int mid = start + (end - start) / 2;\\n\\n        if (arr[mid] == target) return mid;\\n\\n        if (isAscending) {\\n            if (target < arr[mid]) end = mid - 1;\\n            else start = mid + 1;\\n        } else {\\n            if (target > arr[mid]) end = mid - 1;\\n            else start = mid + 1;\\n        }\\n    }\\n    return -1;\\n}\\n\`\`\`" } ] }
\`\`\`

<!-- voice:exercise_intro difficulty="easy" hints_available="3" -->

---

\`\`\`collapse
{ "title": "Deep Dive: Edge Cases to Handle", "content": "**Single-element array:** \`arr[start] == arr[end]\`, so \`isAscending\` will be \`false\` (since \`<\` is not satisfied). This is fine — the loop runs once, checks \`arr[0]\`, and either returns 0 or -1.\\n\\n**Duplicates at boundaries:** If \`arr[0] == arr[last]\`, you cannot determine order from endpoints alone. In practice, interviewers usually guarantee distinct boundary values. If not, you need to scan inward until you find a differing pair.\\n\\n**All equal elements:** Every element is the same. The search finds \`target\` on the first mid check, or returns -1 after one pass — correct either way.\\n\\n**Two-element array:** mid resolves to index 0 or 1. isAscending comparison between them is valid and sufficient." }
\`\`\`

---

### Complexity

| | Complexity |
|---|---|
| **Time** | O(log n) — halves the search space each iteration |
| **Space** | O(1) — only constant extra variables |

The only overhead over standard binary search is computing \`isAscending\` once before the loop — a single comparison, zero impact on asymptotic complexity.

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "arr = [15, 11, 8, 3, 1], target = 8. What is isAscending and what index is returned?", "options": ["isAscending=true, index=2", "isAscending=false, index=2", "isAscending=false, index=3", "isAscending=true, index=3"], "answer": 1, "explanation": "arr[0]=15 > arr[4]=1, so isAscending=false (descending). Binary search with flipped comparisons finds 8 at index 2." }, { "question": "Why do we use mid = start + (end - start) / 2 instead of (start + end) / 2?", "options": ["It runs faster in practice", "It avoids integer overflow when start and end are both large", "It returns a different (more correct) mid index", "It is required for descending arrays"], "answer": 1, "explanation": "(start + end) can overflow a 32-bit integer if both values are near INT_MAX. Rewriting as start + (end - start) / 2 is mathematically equivalent but overflow-safe — a standard interview best practice." }, { "question": "In the descending branch, when target > arr[mid], you set end = mid - 1. Why?", "options": ["Because larger values are on the right in a descending array", "Because larger values are on the LEFT in a descending array, so target is in the left half", "Because you always eliminate the right half first", "This is a bug — you should set start = mid + 1"], "answer": 1, "explanation": "In a descending array, index 0 holds the largest value. If target > arr[mid], target must sit to the LEFT of mid (at smaller indices). So you shrink the right boundary: end = mid - 1." }, { "question": "What happens if arr has only one element and target equals that element?", "options": ["The function returns -1 because isAscending is false", "The function returns 0 correctly", "The while loop never executes", "An index-out-of-bounds error occurs"], "answer": 1, "explanation": "start=0, end=0, so mid=0. arr[mid]==target immediately returns 0. The isAscending flag is irrelevant because we return before reaching the comparison branches." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Detect order once with arr[start] < arr[end] — no extra pass needed.", "Only the comparison direction flips between ascending and descending; the loop structure is identical to standard binary search.", "Use mid = start + (end - start) / 2 to avoid integer overflow — always.", "Time complexity remains O(log n); the order-detection step costs O(1).", "This pattern is the foundation for harder variants: search in rotated arrays, bitonic arrays, and mountain arrays all build on this same idea." ] }
\`\`\``,
      starterCode: `def order_agnostic_binary_search(arr, target):
    """
    Binary search when array order (asc/desc) is unknown.
    
    Args:
        arr: Sorted array (ascending or descending)
        target: Value to search for
    
    Returns:
        int: Index of target, or -1 if not found
    
    Example:
        >>> order_agnostic_binary_search([4, 6, 10], 10)
        2
        >>> order_agnostic_binary_search([10, 6, 4], 10)
        0
    """
    # TODO: Determine order, then apply appropriate binary search
    # Hint: Compare arr[0] and arr[-1] to determine if ascending
    pass


# ─── Test Cases ───

# Ascending order
print(order_agnostic_binary_search([1, 2, 3, 4, 5, 6, 7], 5))
# Expected: 4

# Descending order
print(order_agnostic_binary_search([10, 8, 6, 4, 2], 6))
# Expected: 2

# Target not found
print(order_agnostic_binary_search([1, 2, 3], 10))
# Expected: -1

# Single element
print(order_agnostic_binary_search([5], 5))
# Expected: 0

# Two elements ascending
print(order_agnostic_binary_search([1, 3], 3))
# Expected: 1

# Two elements descending
print(order_agnostic_binary_search([5, 3], 5))
# Expected: 0
`,
      solutionCode: `def order_agnostic_binary_search(arr, target):
    """
    Binary search when array order (asc/desc) is unknown.
    
    Time Complexity: O(log n)
    Space Complexity: O(1)
    """
    if not arr:
        return -1
    
    # Determine if array is ascending or descending
    is_ascending = arr[0] < arr[-1]
    
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        
        if is_ascending:
            # Standard binary search for ascending
            if arr[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        else:
            # Reversed binary search for descending
            if arr[mid] < target:
                right = mid - 1
            else:
                left = mid + 1
    
    return -1


# ─── Test Cases ───
print(order_agnostic_binary_search([1, 2, 3, 4, 5, 6, 7], 5))
# Expected: 4

print(order_agnostic_binary_search([10, 8, 6, 4, 2], 6))
# Expected: 2

print(order_agnostic_binary_search([1, 2, 3], 10))
# Expected: -1

print(order_agnostic_binary_search([5], 5))
# Expected: 0

print(order_agnostic_binary_search([1, 3], 3))
# Expected: 1

print(order_agnostic_binary_search([5, 3], 5))
# Expected: 0
`,
    },
    {
      id: "search-rotated-array",
      slug: "search-rotated-array",
      title: "Search in Rotated Array",
      content: `## Search in Rotated Sorted Array

<!-- voice:section_check concept="Binary search in rotated array" -->

A sorted array rotated at an unknown pivot looks like two sorted runs joined end-to-end. Finding a target in O(log n) seems impossible without knowing the pivot — but there is a structural guarantee that makes it work.

\`\`\`concept
{ "title": "The Local Sorted-Half Invariant", "variant": "mental-model", "content": "Pick any midpoint in a rotated sorted array. One of the two halves — left or right — is always fully sorted. Modified binary search exploits this: identify the sorted half, check whether the target could live there, then safely discard the other half. The rotation does not eliminate binary search — it just requires one extra O(1) step per iteration." }
\`\`\`

### Problem Statement

Given an integer array \`nums\` originally sorted ascending and rotated at an unknown pivot, return the **index** of \`target\`, or \`-1\` if absent. All values are **distinct**.

| Array | Target | Output |
|-------|--------|--------|
| \`[10, 15, 1, 3, 8]\` | \`15\` | \`1\` |
| \`[4, 5, 6, 7, 0, 1, 2]\` | \`0\` | \`4\` |
| \`[4, 5, 6, 7, 0, 1, 2]\` | \`3\` | \`-1\` |

<!-- voice:key_insight insight="In a rotated sorted array, one half is always sorted — determine which half and if target is in it" -->

### Algorithm

\`\`\`steps
{ "title": "Modified Binary Search — Rotated Array", "steps": [ { "title": "Set up two pointers", "content": "Initialize \`left = 0\` and \`right = len(nums) - 1\`. Standard binary search framing." }, { "title": "Compute mid and check for a direct hit", "content": "Inside the loop (\`while left <= right\`):\\n- \`mid = left + (right - left) // 2\`\\n- If \`nums[mid] == target\`, return \`mid\`." }, { "title": "Identify the sorted half", "content": "Compare \`nums[left]\` with \`nums[mid]\`:\\n- \`nums[left] <= nums[mid]\` → **left half is sorted** (indices \`left..mid\`)\\n- \`nums[left] > nums[mid]\` → **right half is sorted** (indices \`mid..right\`)" }, { "title": "Eliminate the irrelevant half", "content": "**If left half is sorted:**\\n- \`nums[left] <= target < nums[mid]\` → target is here → \`right = mid - 1\`\\n- Otherwise → \`left = mid + 1\`\\n\\n**If right half is sorted:**\\n- \`nums[mid] < target <= nums[right]\` → target is here → \`left = mid + 1\`\\n- Otherwise → \`right = mid - 1\`" }, { "title": "Return -1 if loop ends", "content": "When \`left > right\`, the search space is empty — target is absent. Return \`-1\`." } ] }
\`\`\`

### Visualizing the Search

Tracing \`[4, 5, 6, 7, 0, 1, 2]\`, target \`= 0\`:

\`\`\`algoviz
{ "title": "Search for 0 in [4, 5, 6, 7, 0, 1, 2]", "type": "array", "data": [4, 5, 6, 7, 0, 1, 2], "frames": [ { "highlight": [0, 1, 2, 3, 4, 5, 6], "label": "Start: left=0, right=6. Entire array is the search window.", "stats": { "left": 0, "right": 6, "mid": "—", "note": "initialize" } }, { "highlight": [3], "label": "Iter 1: mid=3, nums[3]=7. nums[0]=4 ≤ nums[3]=7 → left half [0..3] is sorted. Is 4 ≤ 0 < 7? No (0 < 4). Discard left half → left=4.", "stats": { "left": 0, "right": 6, "mid": 3, "note": "search right half" } }, { "highlight": [5], "label": "Iter 2: left=4, right=6, mid=5, nums[5]=1. nums[4]=0 ≤ nums[5]=1 → left half [4..5] sorted. Is 0 ≤ 0 < 1? Yes! Discard right half → right=4.", "stats": { "left": 4, "right": 6, "mid": 5, "note": "search left half" } }, { "highlight": [4], "label": "Iter 3: left=4, right=4, mid=4, nums[4]=0 == target. Return 4. ✓", "stats": { "left": 4, "right": 4, "mid": 4, "note": "FOUND!" } } ], "speed": 900 }
\`\`\`

Three iterations. Three halvings. The rotation never forced a linear scan — only a single extra comparison per step.

### Brute Force vs Modified Binary Search

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Brute Force — O(n)", "code": "def search(nums, target):\\n    for i, val in enumerate(nums):\\n        if val == target:\\n            return i\\n    return -1\\n\\n# Scans every element.\\n# Ignores the sorted structure entirely." }, "after": { "label": "Modified Binary Search — O(log n)", "code": "def search(nums, target):\\n    left, right = 0, len(nums) - 1\\n    while left <= right:\\n        mid = left + (right - left) // 2\\n        if nums[mid] == target:\\n            return mid\\n        if nums[left] <= nums[mid]:    # left half sorted\\n            if nums[left] <= target < nums[mid]:\\n                right = mid - 1\\n            else:\\n                left = mid + 1\\n        else:                           # right half sorted\\n            if nums[mid] < target <= nums[right]:\\n                left = mid + 1\\n            else:\\n                right = mid - 1\\n    return -1" } }
\`\`\`

### Common Pitfalls

\`\`\`callout
{ "type": "warning", "title": "Use <= not < when identifying the sorted half", "content": "The condition must be \`nums[left] <= nums[mid]\`, not strict \`<\`. When the window shrinks to a single element, \`left == mid\` and strict \`<\` evaluates false — misclassifying which half is sorted. The \`<=\` handles single-element windows and equal-boundary cases correctly." }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why the range checks are asymmetric", "content": "For the left-half check: \`nums[left] <= target < nums[mid]\` — strict \`<\` on the right because \`nums[mid]\` was already tested for equality at the top of the loop. Same reasoning for the right-half check: \`nums[mid] < target <= nums[right]\`. Using \`<=\` on both sides would create overlap, causing incorrect elimination when target equals a boundary value." }
\`\`\`

### Complexity

| Dimension | Cost |
|-----------|------|
| Time | O(log n) — search space halved each iteration |
| Space | O(1) — two pointers, no auxiliary storage |

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "In [6, 7, 1, 2, 3, 4, 5] with left=0, right=6, mid=3 (value=2), which half is sorted?", "options": ["Left half [0..3], because nums[left]=6 is the larger side", "Right half [3..6], because nums[left]=6 > nums[mid]=2 means the rotation is in the left half", "Cannot determine without knowing the original pivot index", "Both halves are sorted since mid is at the center"], "answer": 1, "explanation": "nums[left]=6 > nums[mid]=2, so the rotation point sits in the left half [0..3]. That means the right half [3..6] = [2,3,4,5] has no rotation and is fully sorted. The rule: if nums[left] > nums[mid], the right half is sorted." }, { "question": "The right half is sorted. Which condition correctly checks whether target belongs there?", "options": ["target >= nums[mid] and target <= nums[right]", "target > nums[mid] and target <= nums[right]", "target >= nums[mid] and target < nums[right]", "target > nums[left] and target < nums[right]"], "answer": 1, "explanation": "The correct condition is nums[mid] < target <= nums[right]. Strict inequality on the left because nums[mid] was already tested for equality. Inclusive on the right because nums[right] is a valid candidate not yet tested." }, { "question": "What is the time complexity of this algorithm?", "options": ["O(n) because the rotation forces at least one linear scan", "O(n log n) due to the extra comparison each iteration", "O(log n) — the extra comparison is O(1) and does not change the halving rate", "O(log n) only when the pivot index is provided"], "answer": 2, "explanation": "Each iteration still eliminates half the search space, exactly as in classic binary search. Identifying the sorted half adds only O(1) work per iteration, so overall complexity remains O(log n) — confirmed across the algorithm literature." }, { "question": "The algorithm returns -1 when:", "options": ["nums[mid] equals the target at the last iteration", "left becomes greater than right without ever finding the target", "The array has an odd number of elements", "nums[left] equals nums[right]"], "answer": 1, "explanation": "The while loop exits naturally when left > right, meaning the search space is exhausted. If no iteration returned mid (a direct match), the target was never found — return -1." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "At any midpoint in a rotated sorted array, at least one half is guaranteed to be fully sorted — this local invariant is what makes O(log n) possible.", "Identify the sorted half by comparing nums[left] with nums[mid]: if nums[left] <= nums[mid], the left half is sorted; otherwise the right half is.", "Boundary checks must use one strict and one inclusive inequality to avoid overlap and correctly exclude the already-tested midpoint.", "Time complexity is O(log n) and space is O(1) — identical to classic binary search.", "This pattern generalizes: finding the rotation pivot, the minimum in a rotated array, and other variants all rely on the same 'identify the sorted half' insight." ] }
\`\`\``,
      starterCode: `def search_rotated_array(arr, target):
    """
    Search for target in a rotated sorted array with distinct elements.
    
    Args:
        arr: Rotated sorted array with distinct elements
        target: Value to search for
    
    Returns:
        int: Index of target, or -1 if not found
    
    Example:
        >>> search_rotated_array([10, 15, 1, 3, 8], 15)
        1
    """
    # TODO: Binary search determining which half is sorted
    # Hint: Check if left half is sorted, then check if target is in range
    pass


# ─── Test Cases ───

# Standard rotated array
print(search_rotated_array([10, 15, 1, 3, 8], 15))
# Expected: 1

# Target in second half
print(search_rotated_array([4, 5, 7, 9, 10, -1, 2], -1))
# Expected: 5

# Not rotated
print(search_rotated_array([1, 2, 3, 4, 5], 3))
# Expected: 2

# Target not found
print(search_rotated_array([10, 15, 1, 3, 8], 20))
# Expected: -1

# Single element
print(search_rotated_array([5], 5))
# Expected: 0

# Two elements rotated
print(search_rotated_array([2, 1], 1))
# Expected: 1
`,
      solutionCode: `def search_rotated_array(arr, target):
    """
    Search for target in a rotated sorted array with distinct elements.
    
    Time Complexity: O(log n)
    Space Complexity: O(1)
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        
        # Determine which half is sorted
        if arr[left] <= arr[mid]:
            # Left half is sorted
            if arr[left] <= target < arr[mid]:
                # Target in left half
                right = mid - 1
            else:
                # Target in right half
                left = mid + 1
        else:
            # Right half is sorted
            if arr[mid] < target <= arr[right]:
                # Target in right half
                left = mid + 1
            else:
                # Target in left half
                right = mid - 1
    
    return -1


# ─── Test Cases ───
print(search_rotated_array([10, 15, 1, 3, 8], 15))
# Expected: 1

print(search_rotated_array([4, 5, 7, 9, 10, -1, 2], -1))
# Expected: 5

print(search_rotated_array([1, 2, 3, 4, 5], 3))
# Expected: 2

print(search_rotated_array([10, 15, 1, 3, 8], 20))
# Expected: -1

print(search_rotated_array([5], 5))
# Expected: 0

print(search_rotated_array([2, 1], 1))
# Expected: 1
`,
    },
    {
      id: "find-minimum-rotated",
      slug: "find-minimum-rotated",
      title: "Find Minimum in Rotated Array",
      content: `## Find Minimum in Rotated Sorted Array

<!-- voice:section_check concept="Finding minimum in rotated array" -->

A sorted array has been secretly rotated at an unknown pivot. Your mission: find the minimum element without a linear scan. The key is recognizing that the rotation creates a hidden binary structure we can exploit.

\`\`\`concept
{ "title": "Rotation Creates a Binary Pattern", "variant": "mental-model", "content": "After rotation, comparing any element to nums[n-1] gives a clean false/false/.../true/true partition. Elements in the left sorted half are all larger than nums[n-1] → false. Elements at or past the rotation point (including the minimum) are ≤ nums[n-1] → true. The minimum is always the first 'true'." }
\`\`\`

### Problem Statement

Given a sorted array of unique integers rotated at an unknown pivot, return the minimum element. Your algorithm must run in **O(log n)** time.

| Example | Input | Output |
|---------|-------|--------|
| 1 | \`[10, 15, 1, 3, 8]\` | \`1\` |
| 2 | \`[4, 5, 7, 9, 10, -1, 2]\` | \`-1\` |
| 3 | \`[1, 2, 3, 4, 5]\` | \`1\` (no rotation) |

### The Feasibility Condition

The entire algorithm rests on one observation: compare every element to \`nums[n-1]\`.

For \`[10, 15, 1, 3, 8]\` with \`nums[n-1] = 8\`:

| Index | Value | \`nums[i] ≤ 8\`? |
|-------|-------|----------------|
| 0 | 10 | **false** |
| 1 | 15 | **false** |
| 2 | 1 | **true** ← minimum |
| 3 | 3 | true |
| 4 | 8 | true |

Pattern: \`[F, F, T, T, T]\` — find the **first True** with binary search.

\`\`\`concept
{ "title": "Feasibility Rule", "variant": "rule", "content": "For index mid: if nums[mid] <= nums[n-1], mid is in the right sorted half (or IS the minimum) → feasible. If nums[mid] > nums[n-1], mid is in the left sorted half → minimum is further right." }
\`\`\`

### Algorithm

\`\`\`steps
{ "title": "Modified Binary Search for First True", "steps": [ { "title": "Initialize", "content": "Set \`left = 0\`, \`right = n - 1\`, \`first_true_index = -1\`. The tracker records the last confirmed feasible position." }, { "title": "Compute mid and check feasibility", "content": "Each iteration: \`mid = (left + right) // 2\`. Ask: is \`nums[mid] <= nums[n-1]\`?" }, { "title": "Feasible → record and search left", "content": "If \`nums[mid] <= nums[n-1]\`: mid is a valid candidate. Save \`first_true_index = mid\` and move \`right = mid - 1\` to look for an even earlier True." }, { "title": "Not feasible → discard left half", "content": "If \`nums[mid] > nums[n-1]\`: mid is in the false zone. Minimum must be to the right. Move \`left = mid + 1\`." }, { "title": "Return", "content": "Loop exits when \`left > right\`. \`first_true_index\` holds the rotation point — the minimum. Return \`nums[first_true_index]\`." } ] }
\`\`\`

### Visualizing the Search on \`[10, 15, 1, 3, 8]\`

\`\`\`algoviz
{ "title": "Binary Search: find first index where nums[mid] ≤ nums[4]=8", "type": "array", "data": [10, 15, 1, 3, 8], "frames": [ { "highlight": [2], "label": "mid=2 → nums[2]=1 ≤ 8 ✓ feasible. Save firstTrueIndex=2, shrink right to 1.", "stats": { "left": 0, "mid": 2, "right": 4, "firstTrueIndex": "—" } }, { "highlight": [0], "label": "mid=0 → nums[0]=10 > 8 ✗ not feasible. Minimum is right of mid, set left=1.", "stats": { "left": 0, "mid": 0, "right": 1, "firstTrueIndex": 2 } }, { "highlight": [1], "label": "mid=1 → nums[1]=15 > 8 ✗ not feasible. Set left=2.", "stats": { "left": 1, "mid": 1, "right": 1, "firstTrueIndex": 2 } }, { "highlight": [2], "label": "left(2) > right(1): loop ends. Return nums[firstTrueIndex] = nums[2] = 1 ✓", "stats": { "left": 2, "mid": "—", "right": 1, "firstTrueIndex": 2 } } ], "speed": 900 }
\`\`\`

### Implementation

\`\`\`tabs
{ "tabs": [ { "label": "Python", "icon": "🐍", "content": "\`\`\`python\\nfrom typing import List\\n\\nclass Solution:\\n    def findMin(self, nums: List[int]) -> int:\\n        n = len(nums)\\n        left, right = 0, n - 1\\n        first_true_index = -1\\n\\n        while left <= right:\\n            mid = (left + right) // 2\\n\\n            # Feasible: nums[mid] is in the right half (or IS the minimum)\\n            if nums[mid] <= nums[n - 1]:\\n                first_true_index = mid\\n                right = mid - 1\\n            else:\\n                left = mid + 1\\n\\n        return nums[first_true_index]\\n\`\`\`" }, { "label": "Java", "icon": "☕", "content": "\`\`\`java\\nclass Solution {\\n    public int findMin(int[] nums) {\\n        int n = nums.length;\\n        int left = 0, right = n - 1;\\n        int firstTrueIndex = -1;\\n\\n        while (left <= right) {\\n            int mid = left + (right - left) / 2; // avoids overflow\\n\\n            if (nums[mid] <= nums[n - 1]) {\\n                firstTrueIndex = mid;\\n                right = mid - 1;\\n            } else {\\n                left = mid + 1;\\n            }\\n        }\\n\\n        return nums[firstTrueIndex];\\n    }\\n}\\n\`\`\`" }, { "label": "C++", "icon": "⚙️", "content": "\`\`\`cpp\\nclass Solution {\\npublic:\\n    int findMin(vector<int>& nums) {\\n        int n = nums.size();\\n        int left = 0, right = n - 1;\\n        int firstTrueIndex = -1;\\n\\n        while (left <= right) {\\n            int mid = left + (right - left) / 2;\\n\\n            if (nums[mid] <= nums[n - 1]) {\\n                firstTrueIndex = mid;\\n                right = mid - 1;\\n            } else {\\n                left = mid + 1;\\n            }\\n        }\\n\\n        return nums[firstTrueIndex];\\n    }\\n};\\n\`\`\`" } ] }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Alternative: Early Exit with arr[low] < arr[high]", "content": "Some implementations add \`if arr[low] < arr[high]: return arr[low]\` at the top of the loop. This short-circuits when the current window is already sorted. Both are correct O(log n). The first-True-index template above is more uniform — it follows the exact same skeleton as all other binary search problems in this module." }
\`\`\`

\`\`\`callout
{ "type": "success", "title": "No Special Case for Unrotated Arrays", "content": "On \`[1, 2, 3, 4, 5]\`, every element satisfies \`nums[i] <= nums[4]=5\`, so the algorithm keeps recording candidates and moving right leftward. It converges on \`firstTrueIndex = 0\` — correctly returning the minimum. No if-check needed." }
\`\`\`

### Complexity

| Dimension | Value | Why |
|-----------|-------|-----|
| **Time** | O(log n) | Search space halves every iteration |
| **Space** | O(1) | Only index pointers, no extra storage |

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "For [3, 4, 5, 1, 2], what does the feasibility check use as its reference value?", "options": ["nums[0] = 3", "nums[mid] at each step", "nums[n-1] = 2", "The array's average"], "answer": 2, "explanation": "We always compare nums[mid] against nums[n-1]. Here n=5, so nums[4]=2. The rotation guarantee means any element in the right sorted half (including the minimum) will be ≤ this last element." }, { "question": "In [3, 4, 5, 1, 2], which indices are 'true' under the feasibility condition?", "options": ["Indices 0, 1, 2 (the larger values)", "Indices 3, 4 (value 1 and 2)", "All indices", "Only index 2 (value 5, the pivot)"], "answer": 1, "explanation": "nums[n-1]=2. Checking each: 3>2 (F), 4>2 (F), 5>2 (F), 1≤2 (T), 2≤2 (T). Pattern [F,F,F,T,T]. Index 3 is the first True — the minimum element (value 1)." }, { "question": "Why do we set right = mid - 1 after finding a feasible mid, rather than immediately returning nums[mid]?", "options": [ "To skip duplicate values at mid", "A more leftward index might also be feasible and be the actual minimum", "To satisfy the loop invariant left <= right", "Because mid could be an edge element with special behavior" ], "answer": 1, "explanation": "When nums[mid] <= nums[n-1], mid is a valid candidate, but there could be an earlier True further left (closer to the rotation point). We record it and continue narrowing right to ensure we find the leftmost feasible index." }, { "question": "What is the time complexity, and what makes it so?", "options": [ "O(n) — we may inspect every element in the worst case", "O(log n) — we eliminate half the array each iteration", "O(n log n) — we sort before searching", "O(1) — we compare only two elements" ], "answer": 1, "explanation": "Each iteration sets either left = mid + 1 or right = mid - 1, halving the active search window. Starting from n elements, we reach a window of size 1 in at most ⌈log₂ n⌉ iterations — O(log n) total." } ] }
\`\`\`

<!-- voice:key_insight insight="The minimum is always the first index where nums[mid] <= nums[n-1]. This single condition perfectly separates the two sorted halves of any rotated array." -->

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The feasibility condition nums[mid] <= nums[n-1] partitions the rotated array into a clean [F, F, ..., T, T] pattern — the minimum is the first True.", "When feasible: save the index, search left (right = mid - 1). When not feasible: discard the left half (left = mid + 1).", "No rotation and single-element arrays need no special cases — the template handles them naturally.", "This is the 'Find First True Index' binary search pattern. Recognizing it unlocks a family of rotated-array problems.", "Time: O(log n) | Space: O(1)" ] }
\`\`\``,
      starterCode: `def find_minimum_rotated(arr):
    """
    Find the minimum element in a rotated sorted array.
    
    Args:
        arr: Rotated sorted array
    
    Returns:
        int: Minimum element
    
    Example:
        >>> find_minimum_rotated([10, 15, 1, 3, 8])
        1
    """
    # TODO: Binary search to find minimum
    # Hint: Check if array is not rotated first; otherwise find unsorted half
    pass


# ─── Test Cases ───

# Standard rotated
print(find_minimum_rotated([10, 15, 1, 3, 8]))
# Expected: 1

# Rotated at different point
print(find_minimum_rotated([4, 5, 7, 9, 10, -1, 2]))
# Expected: -1

# Not rotated
print(find_minimum_rotated([1, 2, 3, 4, 5]))
# Expected: 1

# Single element
print(find_minimum_rotated([5]))
# Expected: 5

# Two elements
print(find_minimum_rotated([2, 1]))
# Expected: 1

# Rotated once
print(find_minimum_rotated([3, 1, 2]))
# Expected: 1
`,
      solutionCode: `def find_minimum_rotated(arr):
    """
    Find the minimum element in a rotated sorted array.
    
    Time Complexity: O(log n)
    Space Complexity: O(1)
    """
    if not arr:
        return None
    
    left, right = 0, len(arr) - 1
    
    # Array not rotated
    if arr[left] < arr[right]:
        return arr[left]
    
    while left < right:
        mid = left + (right - left) // 2
        
        # Check if mid is the minimum
        if mid > 0 and arr[mid] < arr[mid - 1]:
            return arr[mid]
        
        # Determine which half contains minimum
        if arr[mid] > arr[right]:
            # Minimum is in right half
            left = mid + 1
        else:
            # arr[mid] < arr[right], minimum is in left half (including mid)
            # Note: can't be mid+1 to right since arr[mid] <= arr[right]
            right = mid
    
    return arr[left]


# ─── Test Cases ───
print(find_minimum_rotated([10, 15, 1, 3, 8]))
# Expected: 1

print(find_minimum_rotated([4, 5, 7, 9, 10, -1, 2]))
# Expected: -1

print(find_minimum_rotated([1, 2, 3, 4, 5]))
# Expected: 1

print(find_minimum_rotated([5]))
# Expected: 5

print(find_minimum_rotated([2, 1]))
# Expected: 1

print(find_minimum_rotated([3, 1, 2]))
# Expected: 1
`,
    },
    {
      id: "find-number-infinite-array",
      slug: "find-number-infinite-array",
      title: "Find Number in Infinite Array",
      content: `## Find Number in Sorted Infinite Array

<!-- voice:section_check concept="Exponential search in infinite array" -->

The standard binary search requires knowing the array's length upfront — it needs \`high = n - 1\`. But what if the array is **infinite** (or just very large and streaming)? We can't set an upper bound we don't know.

The insight: **find the bounds first, then search within them.**

\`\`\`concept
{ "title": "Exponential Search: Growing the Window", "variant": "mental-model", "content": "Imagine shining a flashlight into a dark corridor. You don't know how long it is, so instead of guessing, you take steps that double each time — 1 step, 2 steps, 4 steps, 8 steps — until you see the wall (or pass your target). You've found your upper bound in O(log p) time. Now you binary search the illuminated corridor." }
\`\`\`

---

## The Two-Phase Algorithm

\`\`\`steps
{ "title": "Algorithm: Exponential Search + Binary Search", "steps": [ { "title": "Phase 1 — Expand the window exponentially", "content": "Start with \`low = 0\`, \`high = 1\`. While \`arr[high] < target\`, shift the window:\\n\\n\`\`\`\\nlow  = high\\nhigh = high * 2\\n\`\`\`\\n\\nEach iteration doubles the window size. After k doublings, \`high = 2^k\`. Because p ≤ 2^k, this takes at most **O(log p)** steps." }, { "title": "Phase 2 — Binary search in the window", "content": "Once \`arr[high] >= target\` (or we've overshot), we know:\\n\\n\`\`\`\\nlow <= position of target <= high\\n\`\`\`\\n\\nRun a standard binary search between \`low\` and \`high\`.\\n\\nTotal time: **O(log p)** — both phases are logarithmic in the target's position p." }, { "title": "Edge case — target not in array", "content": "If the target is absent, the binary search exits normally and returns \`-1\`. The exponential expansion still terminates because the array, while \\"infinite,\\" is sorted — so arr[high] will eventually exceed the target." } ] }
\`\`\`

---

## Visualising the Expansion

Below: searching for **target = 10** in \`[1, 3, 5, 7, 9, 10, 14, 20, 25, ...]\`.

\`\`\`algoviz
{ "title": "Phase 1: Exponential window expansion (target = 10)", "type": "array", "data": [1, 3, 5, 7, 9, 10, 14, 20, 25, 30], "frames": [ { "highlight": [0, 1], "label": "Start: low=0 (val=1), high=1 (val=3). arr[high]=3 < 10, expand.", "stats": { "low": 0, "high": 1 } }, { "highlight": [1, 3], "label": "low=1 (val=3), high=3 (val=7). arr[high]=7 < 10, expand.", "stats": { "low": 1, "high": 3 } }, { "highlight": [3, 7], "label": "low=3 (val=7), high=7 (val=20). arr[high]=20 >= 10. Window locked!", "stats": { "low": 3, "high": 7 } }, { "highlight": [3, 4, 5, 6, 7], "label": "Phase 2: Binary search in indices [3..7]. mid=5, arr[5]=10 == target!", "stats": { "low": 3, "high": 7, "mid": 5 } } ], "speed": 900 }
\`\`\`

---

## Code Walkthrough

\`\`\`trace
{ "title": "Tracing searchInfinite([1,3,5,7,9,10,14,20,25,30], target=10)", "language": "python", "code": "def search_infinite(arr, target):\\n    low, high = 0, 1\\n    while arr[high] < target:\\n        low = high\\n        high *= 2\\n    while low <= high:\\n        mid = low + (high - low) // 2\\n        if arr[mid] == target:\\n            return mid\\n        elif arr[mid] < target:\\n            low = mid + 1\\n        else:\\n            high = mid - 1\\n    return -1", "frames": [ { "line": 2, "vars": { "low": 0, "high": 1 }, "note": "Initialise window at indices 0 and 1" }, { "line": 3, "vars": { "low": 0, "high": 1 }, "note": "arr[1]=3 < 10, enter expansion loop" }, { "line": 4, "vars": { "low": 1, "high": 1 }, "note": "low = high (was 1)" }, { "line": 5, "vars": { "low": 1, "high": 2 }, "note": "high = 1 * 2 = 2; arr[2]=5 < 10, keep going" }, { "line": 4, "vars": { "low": 2, "high": 2 }, "note": "low = high (was 2)" }, { "line": 5, "vars": { "low": 2, "high": 4 }, "note": "high = 2 * 2 = 4; arr[4]=9 < 10, keep going" }, { "line": 4, "vars": { "low": 4, "high": 4 }, "note": "low = high (was 4)" }, { "line": 5, "vars": { "low": 4, "high": 8 }, "note": "high = 4 * 2 = 8; arr[8]=25 >= 10, exit loop" }, { "line": 7, "vars": { "low": 4, "high": 8, "mid": 6 }, "note": "mid = 4 + (8-4)//2 = 6; arr[6]=14 > 10 → high = 5" }, { "line": 7, "vars": { "low": 4, "high": 5, "mid": 4 }, "note": "mid = 4; arr[4]=9 < 10 → low = 5" }, { "line": 7, "vars": { "low": 5, "high": 5, "mid": 5 }, "note": "mid = 5; arr[5]=10 == target!", "stdout": "return 5" } ], "speed": 900 }
\`\`\`

---

## Complexity Analysis

\`\`\`callout
{ "type": "info", "title": "Why O(log p)?", "content": "Let **p** be the index of the target. After the expansion loop, \`high <= 2p\` (we at most double past p once). Each doubling step is O(1), and there are at most **log₂(p)** doublings. The binary search over a window of size ~p is also **O(log p)**. Both phases dominate at O(log p), giving a total of **O(log p)** time and **O(1)** space." }
\`\`\`

\`\`\`tabs
{ "tabs": [ { "label": "Python", "icon": "🐍", "content": "\`\`\`python\\ndef search_infinite(arr, target):\\n    low, high = 0, 1\\n    # Phase 1: exponential expansion\\n    while arr[high] < target:\\n        low = high\\n        high *= 2\\n    # Phase 2: binary search in [low, high]\\n    while low <= high:\\n        mid = low + (high - low) // 2\\n        if arr[mid] == target:\\n            return mid\\n        elif arr[mid] < target:\\n            low = mid + 1\\n        else:\\n            high = mid - 1\\n    return -1\\n\`\`\`" }, { "label": "Java", "icon": "☕", "content": "\`\`\`java\\npublic static int searchInfinite(int[] arr, int target) {\\n    int low = 0, high = 1;\\n    // Phase 1: exponential expansion\\n    while (target > arr[high]) {\\n        low = high;\\n        high = high * 2;\\n    }\\n    // Phase 2: binary search in [low, high]\\n    while (low <= high) {\\n        int mid = low + (high - low) / 2;\\n        if (arr[mid] == target) return mid;\\n        if (arr[mid] < target) low = mid + 1;\\n        else high = mid - 1;\\n    }\\n    return -1;\\n}\\n\`\`\`" }, { "label": "TypeScript", "icon": "🔷", "content": "\`\`\`typescript\\nfunction searchInfinite(arr: number[], target: number): number {\\n    let low = 0, high = 1;\\n    // Phase 1: exponential expansion\\n    while (arr[high] < target) {\\n        low = high;\\n        high *= 2;\\n    }\\n    // Phase 2: binary search in [low, high]\\n    while (low <= high) {\\n        const mid = low + Math.floor((high - low) / 2);\\n        if (arr[mid] === target) return mid;\\n        if (arr[mid] < target) low = mid + 1;\\n        else high = mid - 1;\\n    }\\n    return -1;\\n}\\n\`\`\`" } ] }
\`\`\`

---

\`\`\`collapse
{ "title": "Deep Dive: Why not just start with high = Infinity?", "content": "A natural question: can't we skip Phase 1 and call \`binary_search(arr, 0, LARGE_NUMBER, target)\`?\\n\\n**Problem:** You'd need to access \`arr[LARGE_NUMBER / 2]\` immediately — which is an arbitrary mid-point far from the target. That access might be:\\n- Out of bounds (exception on most real infinite-stream abstractions)\\n- Extraordinarily slow (network/disk fetch for distant data)\\n- Semantically undefined (the 'array' may be lazily generated)\\n\\n**Exponential search guarantees:** the highest index we ever access is \`2p\` — at most twice the target's actual position. We touch only O(log p) elements before locking the window, making this safe and efficient for streams, lazy iterators, or remote data sources." }
\`\`\`

---

## Real-World Analogy

\`\`\`concept
{ "title": "Search in Streaming Logs", "variant": "analogy", "content": "Amazon uses this pattern when searching timestamped log files that stream continuously. You don't know the current file size, so you double your read window until you bracket the target timestamp, then binary-search that window. The pattern appears whenever data arrives faster than you can pre-index it." }
\`\`\`

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "After the exponential expansion phase, what is the guaranteed relationship between the target's position p and high?", "options": [ "high == p exactly", "high >= p (target is within [low, high])", "high < p (we always undershoot)", "high == 2 * p always" ], "answer": 1, "explanation": "The loop exits when arr[high] >= target. Because the array is sorted, this means the target's index is ≤ high. We also set low = previous high before doubling, so low ≤ target index ≤ high." }, { "question": "What is the time complexity of searching for an element at index p in an infinite sorted array using exponential search?", "options": [ "O(p)", "O(log n) where n is total array size", "O(log p) where p is the target's index", "O(p log p)" ], "answer": 2, "explanation": "Both the expansion phase (at most log₂(p) doublings) and the binary search phase (window size ≤ 2p) run in O(log p). The total is O(log p), independent of any total array size." }, { "question": "Why do we initialise high = 1 instead of, say, high = 1000?", "options": [ "It saves memory", "Starting small avoids accessing out-of-bounds indices early and keeps the window minimal", "Binary search only works with powers of two", "It makes the first comparison always false" ], "answer": 1, "explanation": "Starting at high = 1 ensures the very first array access is at index 1 — safe and close. Starting at high = 1000 would wastefully access index 1000 when the target might be at index 3, and risks an out-of-bounds error on short streams." }, { "question": "After the expansion loop exits with low=4 and high=8, you run binary search and mid evaluates to 6. arr[6] > target. What happens next?", "options": [ "low = mid + 1 = 7", "high = mid - 1 = 5", "low = mid = 6", "The search restarts from low=0" ], "answer": 1, "explanation": "When arr[mid] > target, the target must be to the left of mid. We set high = mid - 1 = 5 to narrow the window leftward. This is standard binary search behaviour." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Exponential search solves the 'unknown upper bound' problem by doubling the window until arr[high] ≥ target — this takes O(log p) steps where p is the target's index.", "After the expansion phase, the target is guaranteed to lie in [low, high]; standard binary search then finds it in another O(log p) steps.", "Total complexity is O(log p) time, O(1) space — far better than O(p) linear scan.", "The pattern applies to any sorted, lazily-evaluated, or streaming data source where you cannot safely access an arbitrary far index upfront.", "Interview signal: recognising that you need to construct the search space before searching is the core modified binary search insight for infinite/unknown-size arrays." ] }
\`\`\``,
      starterCode: `def search_infinite_array(arr, target):
    """
    Search for target in a sorted infinite array.
    
    Args:
        arr: Sorted array (treated as infinite)
        target: Value to search for
    
    Returns:
        int: Index of target, or -1 if not found
    
    Example:
        >>> search_infinite_array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 7)
        6
    """
    # TODO: Use exponential search to find bounds, then binary search
    # Hint: Start with bound=1, double until arr[bound] >= target
    pass


# ─── Test Cases ───

# Standard case (finite array used for testing)
print(search_infinite_array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 7))
# Expected: 6

# Target at beginning
print(search_infinite_array([1, 2, 3, 4, 5], 1))
# Expected: 0

# Target at end
print(search_infinite_array([1, 2, 3, 4, 5], 5))
# Expected: 4

# Target not found
print(search_infinite_array([1, 2, 3, 4, 5], 10))
# Expected: -1

# Single element
print(search_infinite_array([5], 5))
# Expected: 0

# Larger array
print(search_infinite_array(list(range(1, 101)), 50))
# Expected: 49
`,
      solutionCode: `def search_infinite_array(arr, target):
    """
    Search for target in a sorted infinite array.
    
    Time Complexity: O(log p) where p is the position of target
    Space Complexity: O(1)
    """
    # First, find the bounds using exponential search
    bound = 1
    
    # Double bound until we exceed target or array bounds
    while bound < len(arr) and arr[bound] < target:
        bound *= 2
    
    # Binary search between bound/2 and min(bound, len(arr)-1)
    left = bound // 2
    right = min(bound, len(arr) - 1)
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1


# ─── Test Cases ───
print(search_infinite_array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 7))
# Expected: 6

print(search_infinite_array([1, 2, 3, 4, 5], 1))
# Expected: 0

print(search_infinite_array([1, 2, 3, 4, 5], 5))
# Expected: 4

print(search_infinite_array([1, 2, 3, 4, 5], 10))
# Expected: -1

print(search_infinite_array([5], 5))
# Expected: 0

print(search_infinite_array(list(range(1, 101)), 50))
# Expected: 49
`,
    },
    {
      id: "modified-binary-search-checkpoint",
      slug: "modified-binary-search-checkpoint",
      title: "Module Checkpoint: Modified Binary Search",
      content: `## Module Checkpoint: Modified Binary Search

<!-- voice:checkpoint_intro -->

Excellent work completing the Modified Binary Search module. Before moving on, let's lock in the key invariants that make every variation of this pattern work.

\`\`\`concept
{ "title": "The Core Invariant: One Half Is Always Sorted", "variant": "mental-model", "content": "Modified binary search is not magic — it is safe elimination applied to non-standard inputs. In a once-rotated sorted array, the rotation breakpoint exists in exactly one place. That means both halves cannot be broken simultaneously. At every step, at least one half is always in clean ascending order. Identify the sorted half, check if the target lives inside it, and discard accordingly. That is the entire algorithm." }
\`\`\`

### What You Learned in This Module

\`\`\`tabs
{ "tabs": [
  { "label": "Order-Agnostic Search", "icon": "↕️", "content": "**Problem:** Binary search an array that may be sorted ascending or descending — you don't know which.\\n\\n**Key move:** Compare \`arr[start]\` with \`arr[end]\`.\\n- \`arr[start] < arr[end]\` → ascending → use standard binary search conditions\\n- \`arr[start] > arr[end]\` → descending → flip the conditions\\n\\nThis is the simplest modification: one comparison at the top of the function, two symmetric branches below." },
  { "label": "Rotated Array Search", "icon": "🔄", "content": "**Problem:** Find a target in a sorted array rotated at an unknown pivot. O(log n) required.\\n\\n**Key move:** After computing \`mid\`, determine which half is sorted:\\n- If \`arr[lo] <= arr[mid]\` → left half is sorted\\n  - If \`lo <= target < arr[mid]\` → search left\\n  - Else → search right\\n- Else → right half is sorted\\n  - If \`arr[mid] < target <= arr[hi]\` → search right\\n  - Else → search left\\n\\nTime: O(log n) | Space: O(1)" },
  { "label": "Minimum in Rotated Array", "icon": "⬇️", "content": "**Problem:** Find the minimum element (the pivot point) in a rotated sorted array.\\n\\n**Key move:** The minimum is always in the *unsorted* half.\\n- If \`arr[mid] > arr[hi]\` → minimum is to the right of mid → \`lo = mid + 1\`\\n- Else → minimum is at mid or to the left → \`hi = mid\`\\n\\nLoop ends when \`lo == hi\`, which points at the minimum.\\n\\n**Amazon hint:** The pivot point IS the smallest element." },
  { "label": "Exponential Search", "icon": "∞", "content": "**Problem:** Search in an infinite (or very large) sorted array where you don't know the size.\\n\\n**Key move:** Two-phase approach:\\n1. **Bound finding:** Start with a window \`[0, 1]\`. If \`arr[bound] < target\`, double the bound: \`bound = bound * 2\`. Repeat until \`arr[bound] >= target\`.\\n2. **Binary search:** Run standard binary search in \`[bound/2, bound]\`.\\n\\nTime: **O(log p)** where p is the index of the target — not O(log n) of the full array.\\n\\nUse when: array size is unknown, or the target is expected early in a huge array." }
] }
\`\`\`

### Visualizing the Rotation Invariant

\`\`\`algoviz
{ "title": "Search for 0 in [4, 5, 6, 7, 0, 1, 2]", "type": "array", "data": [4, 5, 6, 7, 0, 1, 2], "frames": [ { "highlight": [0, 1, 2, 3, 4, 5, 6], "label": "Initial state. lo=0, hi=6, target=0", "stats": { "lo": 0, "hi": 6, "mid": "-" } }, { "highlight": [3], "label": "mid=3, arr[mid]=7. Compare arr[lo]=4 <= arr[mid]=7 → left half [4,5,6,7] is sorted. Is 0 in [4..7)? No → search right.", "stats": { "lo": 0, "hi": 6, "mid": 3 } }, { "highlight": [4, 5, 6], "label": "lo=4, hi=6, mid=5. arr[mid]=1. arr[lo]=0 <= arr[mid]=1 → left half [0,1] is sorted. Is 0 in [0..1)? Yes → search left.", "stats": { "lo": 4, "hi": 6, "mid": 5 } }, { "highlight": [4], "label": "lo=4, hi=4, mid=4. arr[mid]=0 == target. Found at index 4!", "stats": { "lo": 4, "hi": 4, "mid": 4 } } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "The Boundary Condition That Trips People Up", "content": "When checking if a target falls in the sorted left half, use \`arr[lo] <= target && target < arr[mid]\` — note the strict \`<\` on the right side. \`arr[mid]\` is already checked at the top of the loop. Using \`<=\` there causes you to miss the case where target equals arr[mid] and you've already handled it." }
\`\`\`

### Module Quiz

\`\`\`quiz
{ "title": "Modified Binary Search — Checkpoint", "questions": [ { "question": "In a once-rotated sorted array, which statement about sorted halves is always true?", "options": [ "Both halves are sorted", "Neither half is sorted", "At least one half is always sorted", "The longer half is always sorted" ], "answer": 2, "explanation": "Because the rotation breakpoint exists in exactly one location, it cannot split both halves simultaneously. One side must remain in clean ascending order — this is the invariant that makes O(log n) search possible." }, { "question": "You are at arr = [3,4,5,1,2], lo=0, hi=4, mid=2. arr[lo]=3, arr[mid]=5, arr[hi]=2. Which half is sorted?", "options": [ "Right half [1,2] is sorted", "Left half [3,4,5] is sorted", "Both halves are sorted", "Neither half is sorted" ], "answer": 1, "explanation": "arr[lo]=3 <= arr[mid]=5, so the left half is in ascending order. arr[mid]=5 > arr[hi]=2, confirming the right half contains the rotation point." }, { "question": "To determine if an array is sorted in ascending or descending order (order-agnostic search), you should compare:", "options": [ "arr[mid] and arr[mid+1]", "arr[0] and arr[1]", "arr[start] and arr[end]", "arr[mid-1] and arr[mid+1]" ], "answer": 2, "explanation": "Comparing arr[start] with arr[end] tells you the overall direction of the array in one comparison. arr[start] < arr[end] → ascending; arr[start] > arr[end] → descending." }, { "question": "What is the time complexity of exponential search when the target is at index p in the array?", "options": [ "O(n)", "O(log n) where n is total array size", "O(log p) where p is the target's index", "O(p)" ], "answer": 2, "explanation": "Exponential search bounds the target in O(log p) doublings, then binary searches that window in O(log p). Total: O(log p). This is faster than O(log n) when the target is near the front of a very large array." }, { "question": "In the find-minimum-in-rotated-array algorithm, if arr[mid] > arr[hi], what does this tell you?", "options": [ "The minimum is in the left half including mid", "The minimum is at arr[mid]", "The minimum is in the right half (mid+1 to hi)", "The array is not rotated" ], "answer": 2, "explanation": "arr[mid] > arr[hi] means the left half is sorted (values go up to mid, then the rotation happens somewhere to the right). The minimum — the pivot point — must lie in the right portion. Set lo = mid + 1." } ] }
\`\`\`

### Comparing the Two Core Patterns

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Linear scan fallback — O(n)", "code": "def search_rotated(arr, target):\\n    for i, val in enumerate(arr):\\n        if val == target:\\n            return i\\n    return -1" }, "after": { "label": "Modified binary search — O(log n)", "code": "def search_rotated(arr, target):\\n    lo, hi = 0, len(arr) - 1\\n    while lo <= hi:\\n        mid = (lo + hi) // 2\\n        if arr[mid] == target:\\n            return mid\\n        if arr[lo] <= arr[mid]:          # left half sorted\\n            if arr[lo] <= target < arr[mid]:\\n                hi = mid - 1\\n            else:\\n                lo = mid + 1\\n        else:                             # right half sorted\\n            if arr[mid] < target <= arr[hi]:\\n                lo = mid + 1\\n            else:\\n                hi = mid - 1\\n    return -1" } }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Handling Duplicates in Rotated Arrays", "content": "The standard algorithm assumes distinct elements. When duplicates are present (e.g., \`[1,3,1,1,1]\`), \`arr[lo] == arr[mid]\` no longer tells you which half is sorted.\\n\\n**Fix:** When \`arr[lo] == arr[mid] == arr[hi]\`, you cannot determine the sorted side. Shrink both ends by one:\\n\`\`\`python\\nif arr[lo] == arr[mid] == arr[hi]:\\n    lo += 1\\n    hi -= 1\\n    continue\\n\`\`\`\\n\\n**Cost:** Worst case degrades to O(n) when all elements are identical. Best and average case remain O(log n). This is the tradeoff interviewers expect you to articulate — LeetCode 81 (Search in Rotated Sorted Array II) tests exactly this." }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "In a once-rotated array, at least one half is always sorted — identify it by comparing arr[lo] with arr[mid]", "Safe elimination still works: check if the target falls in the sorted half, discard the other side", "Finding the minimum means tracking the rotation point: arr[mid] > arr[hi] means lo = mid+1, otherwise hi = mid", "Exponential search achieves O(log p) by doubling bounds first, then binary searching — optimal for infinite or very large arrays", "Order-agnostic search requires just one extra comparison (arr[start] vs arr[end]) to handle ascending or descending input" ] }
\`\`\`

**You've mastered the Modified Binary Search pattern — you can now handle rotated arrays, boundary searches, and infinite-array problems with O(log n) confidence.**`,
    },
  ],
};
