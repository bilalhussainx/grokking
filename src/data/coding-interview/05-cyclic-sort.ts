import { Module } from "../types";

export const cyclicSortModule: Module = {
  id: "cyclic-sort",
  title: "Cyclic Sort",
  description:
    "Use cyclic sort to solve problems where numbers are in a known range — find missing, duplicate, or misplaced elements in O(n) time.",
  lessons: [
    {
      id: "cyclic-sort-intro",
      slug: "cyclic-sort-intro",
      title: "Introduction to Cyclic Sort",
      content: `## The Cyclic Sort Pattern

When you have an array of numbers in the range **[1, n]** or **[0, n]**, each number can be placed at its "correct" index. Cyclic sort exploits this to sort the array — or detect anomalies — in **O(n)** time with **O(1)** space.

### Core Idea

For an array containing numbers from **1 to n**, number \`k\` belongs at index \`k - 1\`. We iterate through the array and, for each position, swap the current element to its correct index until the current position holds the right value.

\`\`\`
arr = [3, 1, 5, 4, 2]

Index 0: arr[0]=3, should be at index 2 -> swap -> [5, 1, 3, 4, 2]
Index 0: arr[0]=5, should be at index 4 -> swap -> [2, 1, 3, 4, 5]
Index 0: arr[0]=2, should be at index 1 -> swap -> [1, 2, 3, 4, 5]
Index 0: arr[0]=1, correct! Move to index 1.
... all remaining are correct.
\`\`\`

### Why Not Just Use a Regular Sort?

Regular sorting is O(n log n). Since we know the exact range of values, cyclic sort achieves **O(n)** by placing each element directly at its target index. Each element is swapped at most once.

### Applications

| Problem | Key Insight |
|---------|-------------|
| **Find missing number** | After cyclic sort, the index that doesn't hold its expected value reveals the missing number. |
| **Find duplicate** | During sorting, if the target index already holds the correct value, the current element is a duplicate. |
| **Find all missing/duplicates** | Same approach, just collect all anomalies instead of returning early. |

### Complexity

- **Time:** O(n) — each number is swapped at most once.
- **Space:** O(1) — in-place.

\`\`\`mermaid
graph LR
    subgraph Idea["Core Idea: number k belongs at index k-1"]
        direction LR
        V1["val=3"] -.->|"place at idx 2"| I2["index 2"]
        V2["val=1"] -.->|"place at idx 0"| I0["index 0"]
        V3["val=5"] -.->|"place at idx 4"| I4["index 4"]
    end
\`\`\`

\`\`\`mermaid
graph TD
    subgraph Start["[3, 1, 5, 4, 2]"]
        S0["i=0: arr[0]=3, swap to idx 2"]
    end
    subgraph Step1["[5, 1, 3, 4, 2]"]
        S1["i=0: arr[0]=5, swap to idx 4"]
    end
    subgraph Step2["[2, 1, 3, 4, 5]"]
        S2["i=0: arr[0]=2, swap to idx 1"]
    end
    subgraph Step3["[1, 2, 3, 4, 5]"]
        S3["i=0: arr[0]=1, correct! Done."]
    end
    Start --> Step1 --> Step2 --> Step3
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

### Approach Hints

- Start at index 0. If the current number is not at its correct position (i.e., \`arr[i] != i + 1\`), swap it to its correct index.
- Keep swapping at the same index until the correct number lands there.
- Then move to the next index.

\`\`\`mermaid
graph LR
    subgraph S1["i=0: swap 2<->6"]
        A1["[2,6,4,3,1,5]"]
    end
    subgraph S2["i=0: swap 6<->5"]
        A2["[6,2,4,3,1,5]"]
    end
    subgraph S3["i=0: swap 5<->1"]
        A3["[5,2,4,3,6,1]"]
    end
    subgraph S4["i=0: 1 correct, move on"]
        A4["[1,2,4,3,6,5]"]
    end
    subgraph S5["Continue swaps..."]
        A5["[1,2,3,4,5,6]"]
    end
    S1 --> S2 --> S3 --> S4 --> S5
\`\`\`

### Complexity

- **Time:** O(n) — each element is placed at most once.
- **Space:** O(1) — in-place swaps.`,
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
- **Space:** O(1)`,
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

### Approach Hints

- Apply cyclic sort: place each number at index \`number - 1\` when possible.
- If the target index already has the correct value, skip (this handles duplicates).
- After sorting, any index where \`arr[i] != i + 1\` means \`i + 1\` is missing.

### Complexity

- **Time:** O(n)
- **Space:** O(1) — ignoring the output list.`,
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

### Complexity

- **Time:** O(n)
- **Space:** O(1)`,
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

### Approach Hints

- Apply cyclic sort to place each number at its correct index.
- Skip (do not swap) when the target position already holds the correct value — this indicates a duplicate.
- After sorting, scan through: any position where \`arr[i] != i + 1\` means \`arr[i]\` is a duplicate that could not be placed at its home index.

### Complexity

- **Time:** O(n)
- **Space:** O(1) — ignoring the output list.`,
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
