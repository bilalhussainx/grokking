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

### Why Two Pointers?

A naive approach to finding a pair of elements that meet some criterion typically involves nested loops, giving **O(n²)** time. Two pointers exploit **sorted order** to shrink the search space at every step, reducing time to **O(n)**.

### How It Works

1. Place one pointer at the **start** and one at the **end** of a sorted array.
2. Evaluate the current pair.
3. If the result is too small, move the left pointer right (increase the sum).
4. If the result is too large, move the right pointer left (decrease the sum).
5. Stop when the pointers meet or cross.

### Variants

| Variant | Description |
|---------|-------------|
| **Opposite-direction** | One pointer starts at each end; they walk toward each other. |
| **Same-direction** | Both pointers start at one end; a fast pointer moves ahead. |
| **Three pointers** | Extension for problems like the Dutch National Flag. |

### When to Reach for Two Pointers

- The input is **sorted** (or you can sort it without penalty).
- You need to find a **pair / triplet** that satisfies a sum or difference constraint.
- You need to **partition** an array in-place.

### Complexity

Most two-pointer solutions run in **O(n)** time and **O(1)** extra space, making them far superior to hash-map or brute-force alternatives when the input is already sorted.

\`\`\`mermaid
graph LR
    A["[1"] --> B["2"] --> C["3"] --> D["4"] --> E["6]"]
    L["left pointer"] -.-> A
    R["right pointer"] -.-> E
    style L fill:#4CAF50,color:#fff
    style R fill:#2196F3,color:#fff
    A2["Sum too small?"] -->|"Move left -->>"| A3["left moves right"]
    A4["Sum too large?"] -->|"<<-- Move right"| A5["right moves left"]
    A6["Sum matches?"] -->|"Found pair!"| A7["Return indices"]
\`\`\`

\`\`\`mermaid
graph TD
    subgraph Opposite["Opposite-Direction Pointers"]
        O1["L=start, R=end"] --> O2["Compare pair"]
        O2 --> O3{"Condition?"}
        O3 -->|"Too small"| O4["L++"]
        O3 -->|"Too large"| O5["R--"]
        O3 -->|"Match"| O6["Done"]
        O4 --> O2
        O5 --> O2
    end
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

\`\`\`mermaid
graph LR
    subgraph Step1["Step 1: L=0, R=4"]
        S1["arr=[1,2,3,4,6] target=6<br/>1+6=7 > 6 → R--"]
    end
    subgraph Step2["Step 2: L=0, R=3"]
        S2["1+4=5 < 6 → L++"]
    end
    subgraph Step3["Step 3: L=1, R=3"]
        S3["2+4=6 == 6 → Return [1,3]"]
    end
    Step1 --> Step2 --> Step3
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

### Approach Hints

- Use a **slow** pointer to track the position where the next unique element should go.
- Use a **fast** pointer to scan through the array.
- Whenever the fast pointer finds a value different from the value at the slow pointer, advance the slow pointer and copy the new value there.

### Complexity

- **Time:** O(n) — single pass through the array.
- **Space:** O(1) — everything is done in-place.`,
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

### Examples

\`\`\`
Input:  [-2, -1, 0, 2, 3]
Output: [0, 1, 4, 4, 9]
\`\`\`

\`\`\`
Input:  [-3, -1, 0, 1, 2]
Output: [0, 1, 1, 4, 9]
\`\`\`

\`\`\`
Input:  [1, 2, 3]
Output: [1, 4, 9]
\`\`\`

### Approach Hints

- A naive approach would be to square everything and sort — O(n log n).
- Instead, notice that the **largest squares** come from either the far-left (most negative) or far-right (most positive) end.
- Use two pointers starting at both ends. Compare absolute values, place the larger square at the **end** of the result array, and move that pointer inward.

### Complexity

- **Time:** O(n) — single pass.
- **Space:** O(n) — for the output array (required by the problem).`,
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

### Approach Hints

1. **Sort** the array first.
2. Iterate through the array. For each element \`arr[i]\`, you need two numbers from the rest that sum to \`-arr[i]\`.
3. Use the **pair with target sum** pattern (two pointers) on the subarray to the right of \`i\`.
4. Skip duplicate values for \`i\` and for both pointers to avoid duplicate triplets.

### Complexity

- **Time:** O(n²) — for each element, a two-pointer scan takes O(n).
- **Space:** O(n) — for sorting (ignoring the output list).`,
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

### Approach Hints

- Use **three pointers**: \`low\`, \`mid\`, and \`high\`.
- \`low\` tracks the boundary for 0s, \`high\` tracks the boundary for 2s, and \`mid\` scans the array.
- If \`arr[mid] == 0\`: swap with \`arr[low]\`, advance both \`low\` and \`mid\`.
- If \`arr[mid] == 1\`: just advance \`mid\`.
- If \`arr[mid] == 2\`: swap with \`arr[high]\`, decrement \`high\` (do not advance \`mid\` because the swapped value needs inspection).

### Complexity

- **Time:** O(n) — single pass.
- **Space:** O(1) — in-place swaps.`,
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
