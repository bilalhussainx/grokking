import { Module } from "../types";

export const cyclicSortModule: Module = {
  id: "cyclic-sort",
  title: "Cyclic Sort",
  description: "Use cyclic sort to solve problems where numbers are in a known range — find missing, duplicate, or misplaced elements in O(n) time.",
  lessons: [
    {
      id: "cyclic-sort-intro",
      slug: "cyclic-sort-intro",
      title: "Introduction to Cyclic Sort",
      content: `## The Cyclic Sort Pattern

When you have an array of numbers in the range **[1, n]** or **[0, n]**, each number can be placed at its "correct" index. Cyclic sort exploits this to sort the array — or detect anomalies — in **O(n)** time with **O(1)** space.

\`\`\`concept
{
  "title": "The Index Mapping Rule",
  "variant": "mental-model",
  "content": "For numbers 1..n, value k belongs at index k-1. This creates a perfect 1:1 mapping between values and indices, turning the array into a hash table where each value is its own key."
}
\`\`\`

### Core Idea

For an array containing numbers from **1 to n**, number \`k\` belongs at index \`k - 1\`. We iterate through the array and, for each position, swap the current element to its correct index until the current position holds the right value.

\`\`\`algoviz
{
  "title": "Cyclic Sort in Action",
  "type": "array",
  "data": [3, 1, 5, 4, 2],
  "frames": [
    { "highlight": [0], "label": "i=0: arr[0]=3 should be at index 2", "stats": {"i": 0, "target": 2} },
    { "highlight": [0, 2], "label": "Swap 3 with element at index 2", "stats": {"swap": "3↔5"} },
    { "highlight": [0], "label": "i=0: arr[0]=5 should be at index 4", "stats": {"i": 0, "target": 4} },
    { "highlight": [0, 4], "label": "Swap 5 with element at index 4", "stats": {"swap": "5↔2"} },
    { "highlight": [0], "label": "i=0: arr[0]=2 should be at index 1", "stats": {"i": 0, "target": 1} },
    { "highlight": [0, 1], "label": "Swap 2 with element at index 1", "stats": {"swap": "2↔1"} },
    { "highlight": [0], "label": "i=0: arr[0]=1 is now correct!", "stats": {"correct": true} },
    { "highlight": [1], "label": "Move to i=1: arr[1]=2 is correct", "stats": {"i": 1} },
    { "highlight": [2], "label": "i=2: arr[2]=3 is correct", "stats": {"i": 2} },
    { "highlight": [3], "label": "i=3: arr[3]=4 is correct", "stats": {"i": 3} },
    { "highlight": [4], "label": "i=4: arr[4]=5 is correct", "stats": {"i": 4} }
  ],
  "speed": 1200
}
\`\`\`

### Why Not Just Use a Regular Sort?

Regular sorting is O(n log n). Since we know the exact range of values, cyclic sort achieves **O(n)** by placing each element directly at its target index. Each element is swapped at most once.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "QuickSort (O(n log n))",
    "code": "def sort_range(arr):\\n    # General purpose: O(n log n)\\n    arr.sort()  # Timsort: O(n log n)\\n    return arr"
  },
  "after": {
    "label": "Cyclic Sort (O(n))",
    "code": "def cyclic_sort(arr):\\n    # Known range 1..n: O(n)\\n    i = 0\\n    while i < len(arr):\\n        correct = arr[i] - 1\\n        if arr[i] != arr[correct]:\\n            arr[i], arr[correct] = arr[correct], arr[i]\\n        else:\\n            i += 1\\n    return arr"
  }
}
\`\`\`

### Applications

| Problem | Key Insight |
|---------|-------------|
| **Find missing number** | After cyclic sort, the index that doesn't hold its expected value reveals the missing number. |
| **Find duplicate** | During sorting, if the target index already holds the correct value, the current element is a duplicate. |
| **Find all missing/duplicates** | Same approach, just collect all anomalies instead of returning early. |

\`\`\`quiz
{
  "title": "Cyclic Sort Applications",
  "questions": [
    {
      "question": "After cyclic sort on [3,1,2,4,6,6], which index indicates the duplicate?",
      "options": ["Index 0", "Index 4", "Index 5", "Index 2"],
      "answer": 2,
      "explanation": "Index 5 should contain value 6, but since index 4 already has 6, we find 6 at index 5 again — revealing the duplicate."
    },
    {
      "question": "In an array of size 5 containing numbers 1-5 with one missing, what will you find at the 'missing' index after cyclic sort?",
      "options": ["The missing number", "A duplicate number", "A number out of range", "Zero"],
      "answer": 1,
      "explanation": "The missing index will contain whatever number was displaced — often a duplicate or out-of-place value."
    },
    {
      "question": "Why can't we use cyclic sort on [7, 3, 9, 2]?",
      "options": ["Numbers are too large", "Range is not contiguous 1..n", "Array is already sorted", "Contains even numbers"],
      "answer": 1,
      "explanation": "Cyclic sort requires values to map directly to indices (1→0, 2→1, etc.). Without the contiguous range 1..n, we can't determine 'correct' positions."
    }
  ]
}
\`\`\`

### Complexity

- **Time:** O(n) — each number is swapped at most once.
- **Space:** O(1) — in-place.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Cyclic sort exploits the 1:1 mapping between values 1..n and indices 0..n-1",
    "Each element moves at most once, guaranteeing O(n) time and O(1) space",
    "The same pattern solves missing/duplicate problems without full sorting",
    "Only works when the range is known and contiguous (1..n or 0..n-1)"
  ]
}
\`\`\``,
    },
    {
      id: "cyclic-sort-basic",
      slug: "cyclic-sort",
      title: "Cyclic Sort",
      content: `## Cyclic Sort

### Problem Statement

Given an array containing \`n\` distinct numbers from the range **[1, n]**, sort the array **in-place** using the cyclic sort technique. Each number should end up at index \`number - 1\`.

### Examples

\`\`\`
Input:  [3, 1, 5, 4, 2]
Output: [1, 2, 3, 4, 5]
\`\`\`

\`\`\`
Input:  [2, 6, 4, 3, 1, 5]
Output: [1, 2, 3, 4, 5, 6]
\`\`\`

\`\`\`
Input:  [1, 2, 3]
Output: [1, 2, 3]   (already sorted)
\`\`\`

### How Cyclic Sort Works

The algorithm is beautifully simple: each value \`x\` belongs at index \`x-1\`. We walk through the array once, and whenever we find a value out of place, we **swap it directly to its correct index**. We keep swapping at the same position until the right value lands there, then move forward.

\`\`\`concept
{
  "title": "Cyclic Sort Insight",
  "variant": "mental-model",
  "content": "Think of the array as a row of labeled mailboxes. Mailbox #1 should always contain letter #1, mailbox #2 letter #2, etc. If you open a mailbox and find the wrong letter, you immediately walk it to its correct mailbox and swap. You don’t leave the spot until the current mailbox has the right letter, guaranteeing each item moves at most once."
}
\`\`\`

\`\`\`algoviz
{
  "title": "Cyclic Sort in Action",
  "type": "array",
  "data": [2, 6, 4, 3, 1, 5],
  "frames": [
    { "highlight": [0], "label": "i=0: 2 is wrong (should be at 1). Swap with index 1.", "stats": {"i": 0} },
    { "highlight": [0, 1], "label": "After swap: [6, 2, 4, 3, 1, 5]. Still at i=0.", "stats": {"i": 0} },
    { "highlight": [0, 5], "label": "6 belongs at index 5. Swap.", "stats": {"i": 0} },
    { "highlight": [0, 4], "label": "Now 5 belongs at index 4. Swap.", "stats": {"i": 0} },
    { "highlight": [0], "label": "1 is now correct at index 0. Move i to 1.", "stats": {"i": 1} },
    { "highlight": [1], "label": "2 is already correct. Move on.", "stats": {"i": 2} },
    { "highlight": [2, 3], "label": "4 is wrong. Swap with index 3.", "stats": {"i": 2} },
    { "highlight": [2], "label": "3 is now correct. Move on.", "stats": {"i": 3} },
    { "highlight": [3], "label": "4 is correct. Move on.", "stats": {"i": 4} },
    { "highlight": [4, 5], "label": "5 is wrong. Swap with index 5.", "stats": {"i": 4} },
    { "highlight": [5], "label": "6 is correct. Done!", "stats": {"i": 5} }
  ],
  "speed": 1000
}
\`\`\`

### Implementation

\`\`\`playground
{
  "title": "Cyclic Sort Implementation",
  "language": "python",
  "code": "def cyclic_sort(nums):\\n    \\"\\"\\"In-place cyclic sort for 1..n distinct integers.\\"\\"\\"\\n    i = 0\\n    while i < len(nums):\\n        correct_idx = nums[i] - 1  # value x belongs at index x-1\\n        if nums[i] != nums[correct_idx]:\\n            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]\\n        else:\\n            i += 1\\n    return nums\\n\\n# Quick sanity check\\nprint(cyclic_sort([3, 1, 5, 4, 2]))\\nprint(cyclic_sort([2, 6, 4, 3, 1, 5]))",
  "runnable": true
}
\`\`\`

### Complexity Analysis

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Time",
      "content": "**O(n)** — Each element is moved at most once. Even though we may perform multiple swaps at a single index, every swap places one element in its final position, so the total number of swaps is ≤ n."
    },
    {
      "label": "Space",
      "content": "**O(1)** — All operations are swaps within the input array; no extra storage is allocated."
    },
    {
      "label": "Writes",
      "content": "**Optimal** — Cyclic Sort performs the minimum possible number of writes: each element is written exactly zero or one time."
    }
  ]
}
\`\`\`

### Common Pitfalls

\`\`\`callout
{
  "type": "warning",
  "title": "Range Matters",
  "content": "Cyclic Sort only works when values are **distinct** and cover the exact range 1..n. If the range is 0..n-1, adjust the target index to \`value\` instead of \`value-1\`. For duplicates or arbitrary values, use a different algorithm."
}
\`\`\`

### Quick Check

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "What is the correct index for value 7 in a 1-based cyclic sort array of length 10?",
      "options": ["6", "7", "8", "9"],
      "answer": 0,
      "explanation": "Value x belongs at index x-1, so 7 belongs at index 6."
    },
    {
      "question": "Why does the loop index i only advance when nums[i] is already in the right place?",
      "options": [
        "To avoid an infinite loop",
        "Because the current element is already sorted and we can safely move on",
        "To reduce swap count",
        "Both A and B"
      ],
      "answer": 3,
      "explanation": "Advancing only when nums[i] is correct prevents re-examining settled elements and avoids infinite loops caused by continuous swapping."
    },
    {
      "question": "What happens if the input contains duplicates?",
      "options": [
        "Algorithm still sorts in O(n)",
        "Algorithm may enter an infinite loop",
        "Algorithm becomes O(n²)",
        "Algorithm produces incorrect order"
      ],
      "answer": 1,
      "explanation": "With duplicates, the swap condition \`nums[i] != nums[correct_idx]\` can fail forever when two equal values block each other, causing an infinite loop."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Cyclic Sort exploits the direct value-to-index mapping (x → x-1) to achieve linear time.",
    "It is in-place (O(1) space) and optimal in write operations.",
    "Use it only for distinct integers covering the exact range 1..n (or 0..n-1 with a tweak).",
    "The algorithm is the backbone of many ‘find missing/duplicate/disappeared number’ interview problems."
  ]
}
\`\`\``,
      starterCode: `def cyclic_sort(nums):
    # TODO: sort using cyclic sort
    pass

# Test cases
arr1 = [3, 1, 5, 4, 2]
cyclic_sort(arr1)
print(arr1)  # Expected: [1, 2, 3, 4, 5]

arr2 = [2, 6, 4, 3, 1, 5]
cyclic_sort(arr2)
print(arr2)  # Expected: [1, 2, 3, 4, 5, 6]

arr3 = [1, 2, 3]
cyclic_sort(arr3)
print(arr3)  # Expected: [1, 2, 3]
`,
      solutionCode: `def cyclic_sort(nums):
    i = 0
    while i < len(nums):
        correct = nums[i] - 1
        if nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1

# Test cases
arr1 = [3, 1, 5, 4, 2]
cyclic_sort(arr1)
print(arr1)  # Expected: [1, 2, 3, 4, 5]

arr2 = [2, 6, 4, 3, 1, 5]
cyclic_sort(arr2)
print(arr2)  # Expected: [1, 2, 3, 4, 5, 6]

arr3 = [1, 2, 3]
cyclic_sort(arr3)
print(arr3)  # Expected: [1, 2, 3]
`,
    },
    {
      id: "cyclic-sort-missing-number",
      slug: "find-missing-number",
      title: "Find the Missing Number",
      content: `## Find the Missing Number

### Problem Statement

Given an array containing \`n\` distinct numbers from the range **[0, n]**, find the one number that is **missing** from the array.

### Examples

\`\`\`
Input:  [4, 0, 3, 1]
Output: 2
\`\`\`

\`\`\`
Input:  [8, 3, 5, 2, 4, 6, 0, 1]
Output: 7
\`\`\`

\`\`\`
Input:  [0, 1, 2]
Output: 3
\`\`\`

### Approach Hints

- The range is [0, n] but the array has n elements, so one number is missing.
- Apply cyclic sort: try to place each number at its value as index (number \`k\` at index \`k\`).
- If a number equals \`n\`, you cannot place it (there is no index \`n\`), so skip it.
- After sorting, scan the array: the index where \`arr[i] != i\` is the missing number.
- If all indices match, the missing number is \`n\`.

### Complexity

- **Time:** O(n)
- **Space:** O(1)

\`\`\`concept
{
  "title": "Cyclic Sort for Missing Number",
  "variant": "mental-model",
  "content": "Think of the array as a parking lot with spots 0..n. Each car (number) wants to park in its matching spot (value k parks at index k). Spot n is a 'virtual' spot - cars numbered n can't park there. After everyone parks, the empty spot reveals the missing number. If all spots 0..n-1 are filled, then n is missing."
}
\`\`\`

\`\`\`algoviz
{
  "title": "Cyclic Sort on [4, 0, 3, 1]",
  "type": "array",
  "data": [4, 0, 3, 1],
  "frames": [
    {"highlight": [0], "label": "i=0, arr[0]=4 (skip, equals n)", "stats": {"i": 0}},
    {"highlight": [1], "label": "i=1, arr[1]=0, swap with index 0", "stats": {"i": 1}},
    {"highlight": [0, 1], "label": "swap 0 and 4 → [0, 4, 3, 1]", "stats": {"i": 1}},
    {"highlight": [1], "label": "i=1, arr[1]=4 (skip, equals n)", "stats": {"i": 1}},
    {"highlight": [2], "label": "i=2, arr[2]=3, swap with index 3", "stats": {"i": 2}},
    {"highlight": [2, 3], "label": "swap 3 and 1 → [0, 4, 1, 3]", "stats": {"i": 2}},
    {"highlight": [2], "label": "i=2, arr[2]=1, swap with index 1", "stats": {"i": 2}},
    {"highlight": [1, 2], "label": "swap 1 and 4 → [0, 1, 4, 3]", "stats": {"i": 2}},
    {"highlight": [2], "label": "i=2, arr[2]=4 (skip, equals n)", "stats": {"i": 2}},
    {"highlight": [3], "label": "i=3, arr[3]=3 (already correct)", "stats": {"i": 3}},
    {"highlight": [2], "label": "scan: index 2 ≠ 2 → missing = 2", "stats": {}}
  ],
  "speed": 800
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naive: Sum Formula",
    "code": "expected = n*(n+1)//2\\nactual   = sum(arr)\\nmissing  = expected - actual"
  },
  "after": {
    "label": "Cyclic Sort (in-place)",
    "code": "for i in range(n):\\n    while arr[i] < n and arr[i] != i:\\n        arr[arr[i]], arr[i] = arr[i], arr[arr[i]]\\nfor i in range(n):\\n    if arr[i] != i:\\n        return i\\nreturn n"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Why do we skip numbers equal to n during cyclic sort?",
      "options": [
        "They are already in their correct position",
        "There is no index n in the array",
        "They represent the missing number",
        "They cause infinite loops"
      ],
      "answer": 1,
      "explanation": "Array indices run from 0 to n-1, so a value of n cannot be placed at index n — that slot doesn't exist."
    },
    {
      "question": "What is the maximum number of swaps performed by the algorithm?",
      "options": ["n", "n-1", "n/2", "log n"],
      "answer": 1,
      "explanation": "Each element is moved at most once to its correct position, giving at most n-1 swaps total."
    },
    {
      "question": "If after sorting every index i satisfies arr[i] == i, what is the missing number?",
      "options": ["0", "n-1", "n", "impossible"],
      "answer": 2,
      "explanation": "All indices 0..n-1 are occupied by their matching values, so the only remaining candidate is n."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Implement Missing Number",
  "language": "python",
  "code": "def find_missing(arr):\\n    n = len(arr)\\n    # TODO: implement cyclic sort\\n    # Place each number at index == number\\n    # Skip if number == n\\n    \\n    # TODO: scan for missing index\\n    # return that index, or n if all match\\n    pass\\n\\n# Test cases\\nprint(find_missing([4, 0, 3, 1]))        # 2\\nprint(find_missing([8, 3, 5, 2, 4, 6, 0, 1]))  # 7\\nprint(find_missing([0, 1, 2]))           # 3",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Cyclic sort runs in O(n) time and O(1) space by placing each element at its value-index.",
    "Values equal to n are skipped because array indices only span 0..n-1.",
    "After sorting, the first index i where arr[i] ≠ i is the missing number; if none, n is missing.",
    "The algorithm performs at most n-1 swaps, making it optimal in write operations."
  ]
}
\`\`\``,
      starterCode: `def find_missing_number(nums):
    # TODO: use cyclic sort to find the missing number
    pass

# Test cases
print(find_missing_number([4, 0, 3, 1]))              # Expected: 2
print(find_missing_number([8, 3, 5, 2, 4, 6, 0, 1]))  # Expected: 7
print(find_missing_number([0, 1, 2]))                  # Expected: 3
`,
      solutionCode: `def find_missing_number(nums):
    n = len(nums)
    i = 0
    while i < n:
        val = nums[i]
        if val < n and val != i:
            nums[i], nums[val] = nums[val], nums[i]
        else:
            i += 1
    for i in range(n):
        if nums[i] != i:
            return i
    return n

# Test cases
print(find_missing_number([4, 0, 3, 1]))              # Expected: 2
print(find_missing_number([8, 3, 5, 2, 4, 6, 0, 1]))  # Expected: 7
print(find_missing_number([0, 1, 2]))                  # Expected: 3
`,
    },
    {
      id: "cyclic-sort-all-missing",
      slug: "find-all-missing-numbers",
      title: "Find All Missing Numbers",
      content: `## Find All Missing Numbers

### Problem Statement

Given an array of \`n\` integers where each integer is in the range **[1, n]** (some numbers may appear **twice** and some may be **missing**), find all the numbers from 1 to n that are **missing** from the array.

### Examples

\`\`\`
Input:  [2, 3, 1, 8, 2, 3, 5, 1]
Output: [4, 6, 7]
\`\`\`

\`\`\`
Input:  [2, 4, 1, 2]
Output: [3]
\`\`\`

\`\`\`
Input:  [1, 1]
Output: [2]
\`\`\`

\`\`\`concept
{
  "title": "Cyclic Sort for Missing Numbers",
  "variant": "mental-model",
  "content": "Think of the array as a parking lot with numbered spots 1-n. Each car (number) should park in its matching spot (index = number-1). When cars are in wrong spots, we rotate them until each car is either correctly parked or we've confirmed it's a duplicate. After the rotation, empty spots reveal missing numbers."
}
\`\`\`

### Approach

The key insight is that **each number should live at index \`number - 1\`**. We'll use cyclic sort to place numbers in their correct positions, skipping duplicates when we encounter them.

\`\`\`steps
{
  "title": "Cyclic Sort Algorithm",
  "steps": [
    {
      "title": "Place each number",
      "content": "For each index \`i\`, if \`arr[i]\` is not in its correct position (index \`arr[i] - 1\`), swap it with the element at its target position."
    },
    {
      "title": "Handle duplicates",
      "content": "If the target position already contains the correct value, we have a duplicate. Skip it and move to the next index."
    },
    {
      "title": "Find missing numbers",
      "content": "After sorting, any index \`i\` where \`arr[i] != i + 1\` means that \`i + 1\` is missing from the array."
    }
  ]
}
\`\`\`

\`\`\`algoviz
{
  "title": "Cyclic Sort in Action",
  "type": "array",
  "data": [2, 3, 1, 8, 2, 3, 5, 1],
  "frames": [
    {"highlight": [0], "label": "Start: i=0, arr[0]=2", "stats": {"i": 0}},
    {"highlight": [0, 1], "label": "Swap 2 with 3", "stats": {"i": 0}},
    {"highlight": [0, 2], "label": "Swap 2 with 1", "stats": {"i": 0}},
    {"highlight": [0], "label": "2 is now at index 1", "stats": {"i": 0}},
    {"highlight": [1], "label": "3 should be at index 2", "stats": {"i": 1}},
    {"highlight": [1, 2], "label": "Swap 3 with 1", "stats": {"i": 1}},
    {"highlight": [1], "label": "3 is now at index 2", "stats": {"i": 1}},
    {"highlight": [2], "label": "1 is already at index 0", "stats": {"i": 2}},
    {"highlight": [3], "label": "8 should be at index 7", "stats": {"i": 3}},
    {"highlight": [3, 7], "label": "Swap 8 with 1", "stats": {"i": 3}},
    {"highlight": [3], "label": "8 is now at index 7", "stats": {"i": 3}},
    {"highlight": [4], "label": "2 is already at index 1", "stats": {"i": 4}},
    {"highlight": [5], "label": "3 is already at index 2", "stats": {"i": 5}},
    {"highlight": [6], "label": "5 should be at index 4", "stats": {"i": 6}},
    {"highlight": [6, 4], "label": "Swap 5 with 2", "stats": {"i": 6}},
    {"highlight": [6], "label": "5 is now at index 4", "stats": {"i": 6}}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`playground
{
  "title": "Find All Missing Numbers",
  "language": "python",
  "code": "def find_missing_numbers(nums):\\n    \\"\\"\\"\\n    Find all missing numbers in range [1, n] using cyclic sort.\\n    Time: O(n), Space: O(1) excluding output.\\n    \\"\\"\\"\\n    n = len(nums)\\n    i = 0\\n    \\n    # Cyclic sort phase\\n    while i < n:\\n        correct_idx = nums[i] - 1  # where nums[i] should be\\n        \\n        # If not in correct position and not a duplicate\\n        if nums[i] != nums[correct_idx]:\\n            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]\\n        else:\\n            i += 1\\n    \\n    # Find missing numbers\\n    missing = []\\n    for i in range(n):\\n        if nums[i] != i + 1:\\n            missing.append(i + 1)\\n    \\n    return missing\\n\\n# Test cases\\nprint(find_missing_numbers([2, 3, 1, 8, 2, 3, 5, 1]))  # [4, 6, 7]\\nprint(find_missing_numbers([2, 4, 1, 2]))              # [3]\\nprint(find_missing_numbers([1, 1]))                    # [2]",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Cyclic Sort Understanding",
  "questions": [
    {
      "question": "Why do we skip swapping when nums[i] == nums[correct_idx]?",
      "options": ["To avoid infinite loops with duplicates", "To save time", "Because the array is already sorted", "Because it's a special case"],
      "answer": 0,
      "explanation": "When nums[i] == nums[correct_idx], we have a duplicate value. Swapping would create an infinite loop since we'd keep encountering the same value at the same position."
    },
    {
      "question": "After cyclic sort, what does arr[i] != i + 1 indicate?",
      "options": ["A duplicate number", "A missing number", "An out-of-range number", "A sorting error"],
      "answer": 1,
      "explanation": "If arr[i] != i + 1 after cyclic sort, it means the number i + 1 is missing from the array, since that position should contain the value i + 1."
    },
    {
      "question": "What's the time complexity of finding missing numbers after cyclic sort?",
      "options": ["O(n log n)", "O(n)", "O(n²)", "O(1)"],
      "answer": 1,
      "explanation": "Both the cyclic sort phase and the missing numbers detection phase are O(n), giving us overall O(n) time complexity."
    }
  ]
}
\`\`\`

### Complexity

- **Time:** O(n) — Each element is moved at most once to its correct position
- **Space:** O(1) — Ignoring the output list, we only use a constant amount of extra space

\`\`\`callout
{
  "type": "tip",
  "title": "Optimization Insight",
  "content": "Cyclic Sort is theoretically optimal in terms of write operations. Each value is written either zero times (if already in place) or exactly once to its correct position. This makes it excellent for scenarios where write operations are expensive."
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Cyclic Sort places each number at index number-1, handling duplicates by skipping when the target already has the correct value",
    "After sorting, missing numbers are revealed by indices where arr[i] != i + 1",
    "This approach achieves O(n) time and O(1) space complexity, making it optimal for this specific problem",
    "The algorithm is unstable and only works for numbers in a known bounded range"
  ]
}
\`\`\``,
      starterCode: `def find_all_missing(nums):
    # TODO: use cyclic sort to find all missing numbers
    pass

# Test cases
print(find_all_missing([2, 3, 1, 8, 2, 3, 5, 1]))  # Expected: [4, 6, 7]
print(find_all_missing([2, 4, 1, 2]))                # Expected: [3]
print(find_all_missing([1, 1]))                       # Expected: [2]
`,
      solutionCode: `def find_all_missing(nums):
    i = 0
    while i < len(nums):
        correct = nums[i] - 1
        if nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1
    missing = []
    for i in range(len(nums)):
        if nums[i] != i + 1:
            missing.append(i + 1)
    return missing

# Test cases
print(find_all_missing([2, 3, 1, 8, 2, 3, 5, 1]))  # Expected: [4, 6, 7]
print(find_all_missing([2, 4, 1, 2]))                # Expected: [3]
print(find_all_missing([1, 1]))                       # Expected: [2]
`,
    },
    {
      id: "cyclic-sort-find-duplicate",
      slug: "find-duplicate-number",
      title: "Find the Duplicate Number",
      content: `## Find the Duplicate Number

### Problem Statement

Given an array containing \`n + 1\` numbers from the range **[1, n]**, find the one number that is **duplicated**. You must not modify the original array and should use only constant extra space.

However, for learning the cyclic sort approach, we will allow in-place modification.

\`\`\`concept
{
  "title": "Why does a duplicate always exist?",
  "variant": "insight",
  "content": "The pigeonhole principle guarantees a duplicate: we have n+1 numbers but only n possible distinct values in the range [1, n]. Therefore, at least one value must appear twice."
}
\`\`\`

### Examples

\`\`\`
Input:  [1, 4, 4, 3, 2]
Output: 4
\`\`\`

\`\`\`
Input:  [2, 1, 3, 3, 5, 4]
Output: 3
\`\`\`

\`\`\`
Input:  [2, 2, 1]
Output: 2
\`\`\`

### Approach Hints

- Apply cyclic sort: try to place each number \`k\` at index \`k - 1\`.
- When you try to place a number and the target index already holds that same value, you have found the duplicate.

\`\`\`algoviz
{
  "title": "Cyclic Sort in Action",
  "type": "array",
  "data": [1, 4, 4, 3, 2],
  "frames": [
    { "highlight": [0], "label": "i=0: nums[0]=1 already at index 0, move on", "stats": {"i":0} },
    { "highlight": [1], "label": "i=1: nums[1]=4 should go to index 3", "stats": {"i":1} },
    { "highlight": [1,3], "label": "Swap 4 with 3 → [1,3,4,4,2]", "stats": {"i":1} },
    { "highlight": [1], "label": "Now nums[1]=3 should go to index 2", "stats": {"i":1} },
    { "highlight": [1,2], "label": "Swap 3 with 4 → [1,4,3,4,2]", "stats": {"i":1} },
    { "highlight": [1], "label": "nums[1]=4 again wants index 3", "stats": {"i":1} },
    { "highlight": [1,3], "label": "Index 3 already has 4 → duplicate found!", "stats": {"i":1} }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`trace
{
  "title": "Step-by-step Trace",
  "language": "python",
  "code": "def find_duplicate(nums):\\n    i = 0\\n    while i < len(nums):\\n        if nums[i] != i + 1:          # not in correct spot\\n            j = nums[i] - 1           # target index\\n            if nums[j] == nums[i]:    # duplicate spotted\\n                return nums[i]\\n            nums[i], nums[j] = nums[j], nums[i]  # swap\\n        else:\\n            i += 1\\n    return -1",
  "frames": [
    { "line": 1, "vars": {"nums":[1,4,4,3,2], "i":0}, "stdout": "" },
    { "line": 4, "vars": {"nums":[1,4,4,3,2], "i":0}, "stdout": "" },
    { "line": 9, "vars": {"nums":[1,4,4,3,2], "i":0}, "stdout": "" },
    { "line": 10, "vars": {"nums":[1,4,4,3,2], "i":1}, "stdout": "" },
    { "line": 4, "vars": {"nums":[1,4,4,3,2], "i":1, "j":3}, "stdout": "" },
    { "line": 7, "vars": {"nums":[1,3,4,4,2], "i":1}, "stdout": "" },
    { "line": 4, "vars": {"nums":[1,3,4,4,2], "i":1, "j":2}, "stdout": "" },
    { "line": 7, "vars": {"nums":[1,4,3,4,2], "i":1}, "stdout": "" },
    { "line": 4, "vars": {"nums":[1,4,3,4,2], "i":1, "j":3}, "stdout": "" },
    { "line": 5, "vars": {"nums":[1,4,3,4,2], "i":1, "j":3}, "stdout": "", "note": "nums[1]==nums[3] → duplicate=4" }
  ],
  "speed": 900
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "What makes cyclic sort especially suitable for this problem?",
      "options": [
        "It is a stable sort",
        "It works in O(n log n) time",
        "It places each value at its corresponding index",
        "It requires O(n) extra space"
      ],
      "answer": 2,
      "explanation": "Cyclic sort directly maps values to indices (value k belongs at index k-1), so any misplaced or duplicate value is immediately detectable."
    },
    {
      "question": "How many swaps, in the worst case, will place a single element in its correct position?",
      "options": ["0", "1", "2", "n"],
      "answer": 1,
      "explanation": "Each element is swapped at most once to reach its correct index, giving the algorithm its O(n) bound on total writes."
    },
    {
      "question": "If the array were [3, 1, 2, 2], at which index would the duplicate first be detected?",
      "options": ["0", "1", "2", "3"],
      "answer": 0,
      "explanation": "Starting at i=0, value 3 wants index 2; after swapping we get [2,1,3,2]. Now index 0 holds 2, which again wants index 1; swap to [1,2,3,2]. Finally 2 at index 3 clashes with 2 already at index 1—duplicate detected."
    }
  ]
}
\`\`\`

### Complexity

- **Time:** O(n)  
  Each element is visited and swapped at most once.

- **Space:** O(1)  
  Only a few variables are used regardless of input size.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Cyclic sort exploits the 1-to-n range to map values directly to indices.",
    "A duplicate is found when the target index already contains the correct value.",
    "The algorithm is in-place and write-optimal, ideal for memory-constrained environments."
  ]
}
\`\`\``,
      starterCode: `def find_duplicate(nums):
    # TODO: use cyclic sort to find the duplicate
    pass

# Test cases
print(find_duplicate([1, 4, 4, 3, 2]))      # Expected: 4
print(find_duplicate([2, 1, 3, 3, 5, 4]))   # Expected: 3
print(find_duplicate([2, 2, 1]))             # Expected: 2
`,
      solutionCode: `def find_duplicate(nums):
    i = 0
    while i < len(nums):
        if nums[i] != i + 1:
            correct = nums[i] - 1
            if nums[i] != nums[correct]:
                nums[i], nums[correct] = nums[correct], nums[i]
            else:
                return nums[i]
        else:
            i += 1
    return -1

# Test cases
print(find_duplicate([1, 4, 4, 3, 2]))      # Expected: 4
print(find_duplicate([2, 1, 3, 3, 5, 4]))   # Expected: 3
print(find_duplicate([2, 2, 1]))             # Expected: 2
`,
    },
    {
      id: "cyclic-sort-all-duplicates",
      slug: "find-all-duplicate-numbers",
      title: "Find All Duplicate Numbers",
      content: `## Find All Duplicate Numbers

### Problem Statement

Given an array of \`n\` integers where each integer is in the range **[1, n]**, some elements appear **twice** and others appear **once**. Find all elements that appear **twice**.

### Examples

\`\`\`
Input:  [3, 4, 4, 5, 5]
Output: [4, 5]
\`\`\`

\`\`\`
Input:  [5, 4, 7, 2, 3, 5, 3]
Output: [3, 5]
\`\`\`

\`\`\`
Input:  [1, 2, 3]
Output: []
\`\`\`

\`\`\`concept
{
  "title": "Cyclic Sort for Duplicates",
  "variant": "mental-model",
  "content": "When numbers are in range [1, n] and some appear twice, think of the array as a parking lot with n spots labeled 1-n. Each number is a car that wants to park in its matching spot. If a car finds its spot already occupied by the same car model, that's our duplicate!"
}
\`\`\`

### Approach Hints

- Apply cyclic sort to place each number at its correct index.
- Skip (do not swap) when the target position already holds the correct value — this indicates a duplicate.
- After sorting, scan through: any position where \`arr[i] != i + 1\` means \`arr[i]\` is a duplicate that could not be placed at its home index.

\`\`\`algoviz
{
  "title": "Cyclic Sort in Action: [3, 4, 4, 5, 5]",
  "type": "array",
  "data": [3, 4, 4, 5, 5],
  "frames": [
    {"highlight": [0], "label": "i=0: nums[0]=3 should go to index 2", "stats": {"i": 0}},
    {"highlight": [0, 2], "label": "Swap 3↔4 → [4, 4, 3, 5, 5]", "stats": {"i": 0}},
    {"highlight": [0], "label": "i=0: nums[0]=4 should go to index 3", "stats": {"i": 0}},
    {"highlight": [0, 3], "label": "Swap 4↔5 → [5, 4, 3, 4, 5]", "stats": {"i": 0}},
    {"highlight": [0], "label": "i=0: nums[0]=5 should go to index 4", "stats": {"i": 0}},
    {"highlight": [0, 4], "label": "Swap 5↔5 → found duplicate!", "stats": {"i": 0}},
    {"highlight": [1], "label": "i=1: nums[1]=4 already at index 3 → duplicate", "stats": {"i": 1}},
    {"highlight": [2], "label": "i=2: nums[2]=3 is at correct index", "stats": {"i": 2}},
    {"highlight": [3], "label": "i=3: nums[3]=4 is at correct index", "stats": {"i": 3}},
    {"highlight": [4], "label": "i=4: nums[4]=5 is at correct index", "stats": {"i": 4}}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`playground
{
  "title": "Find All Duplicates",
  "language": "python",
  "code": "def find_duplicates(nums):\\n    \\"\\"\\"Return all numbers that appear twice in nums (1-n range).\\"\\"\\"\\n    i = 0\\n    while i < len(nums):\\n        j = nums[i] - 1  # correct index for nums[i]\\n        if nums[i] != nums[j]:  # not in place\\n            nums[i], nums[j] = nums[j], nums[i]  # swap\\n        else:\\n            i += 1\\n    # collect duplicates\\n    duplicates = []\\n    for i in range(len(nums)):\\n        if nums[i] != i + 1:\\n            duplicates.append(nums[i])\\n    return duplicates\\n\\n# quick test\\nprint(find_duplicates([3, 4, 4, 5, 5]))",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Why do we skip swapping when nums[i] == nums[j]?",
      "options": [
        "To avoid infinite loops",
        "It signals a duplicate",
        "Both A and B",
        "To save time"
      ],
      "answer": 2,
      "explanation": "When the value at the target index already equals the current value, swapping would create an infinite loop. This condition also identifies that the current value is a duplicate."
    },
    {
      "question": "What is the final array state after cyclic sort on [2, 3, 1, 3]?",
      "options": [
        "[1, 2, 3, 3]",
        "[1, 2, 3, 4]",
        "[1, 3, 2, 3]",
        "[3, 2, 1, 3]"
      ],
      "answer": 0,
      "explanation": "Each number is moved to its correct index (value-1). The duplicate 3 remains at the end because its home index is already occupied."
    },
    {
      "question": "What is the space complexity of this algorithm ignoring the output list?",
      "options": ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
      "answer": 2,
      "explanation": "Cyclic sort operates in-place with only a few extra variables, yielding O(1) auxiliary space."
    }
  ]
}
\`\`\`

### Complexity

- **Time:** O(n)
- **Space:** O(1) — ignoring the output list.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Cyclic sort places each value at index value-1 in a single left-to-right pass.",
    "When the correct slot already holds the same value, you've found a duplicate.",
    "The algorithm runs in O(n) time and O(1) space, optimal for constrained-range arrays.",
    "After sorting, any index i where nums[i] ≠ i+1 contains a duplicate."
  ]
}
\`\`\``,
      starterCode: `def find_all_duplicates(nums):
    # TODO: use cyclic sort to find all duplicate numbers
    pass

# Test cases
print(find_all_duplicates([3, 4, 4, 5, 5]))        # Expected: [4, 5]
print(find_all_duplicates([5, 4, 7, 2, 3, 5, 3]))  # Expected: [3, 5]
print(find_all_duplicates([1, 2, 3]))               # Expected: []
`,
      solutionCode: `def find_all_duplicates(nums):
    i = 0
    while i < len(nums):
        correct = nums[i] - 1
        if nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1
    duplicates = []
    for i in range(len(nums)):
        if nums[i] != i + 1:
            duplicates.append(nums[i])
    return duplicates

# Test cases
print(find_all_duplicates([3, 4, 4, 5, 5]))        # Expected: [4, 5]
print(find_all_duplicates([5, 4, 7, 2, 3, 5, 3]))  # Expected: [3, 5]
print(find_all_duplicates([1, 2, 3]))               # Expected: []
`,
    },
  ],
};
