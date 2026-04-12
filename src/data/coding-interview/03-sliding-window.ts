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

### Two Flavors

| Type | Description | Example |
|------|-------------|---------|
| **Fixed-size window** | The window always contains exactly \`k\` elements. Slide one step at a time. | Max sum of subarray of size k. |
| **Dynamic window** | The window expands or shrinks based on a condition. | Smallest subarray whose sum >= target. |

### Fixed Window Template

1. Compute the result for the first window of size \`k\`.
2. Slide the window one position right: add the incoming element, subtract the outgoing element.
3. Update the answer at each step.

### Dynamic Window Template

1. Expand the window by moving the **right** pointer and updating state.
2. When the window condition is violated (or satisfied, depending on the problem), **shrink** from the left.
3. Track the answer during expansion or contraction.

### When to Use Sliding Window

- You need something about **contiguous** subarrays or substrings (sum, count, distinct elements).
- A brute-force approach would check every subarray — O(n²) or worse.
- The window state can be updated incrementally in O(1).

### Complexity

Most sliding-window problems are solved in **O(n)** time with **O(1)** or **O(k)** extra space, compared to the O(n × k) or O(n²) brute force.

\`\`\`mermaid
graph LR
    subgraph Array["Array"]
        A1["a"] --- A2["b"] --- A3["c"] --- A4["d"] --- A5["e"] --- A6["f"]
    end
    W1["Window Start"] -.-> A2
    W2["Window End"] -.-> A4
    style W1 fill:#4CAF50,color:#fff
    style W2 fill:#2196F3,color:#fff
    EX["Expand: End -->><br/>Contract: <<-- Start"]
\`\`\`

\`\`\`mermaid
graph TD
    A["Initialize window_start=0"] --> B["Expand: move window_end right"]
    B --> C["Add element to window state"]
    C --> D{"Window valid?"}
    D -->|"Fixed: size==k"| E["Record result, slide start++"]
    D -->|"Dynamic: condition met"| F["Shrink from left until invalid"]
    D -->|"Not yet"| B
    E --> B
    F --> B
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

\`\`\`
Input:  arr = [1, 1, 1, 1], k = 2
Output: 2
\`\`\`

### Approach Hints

- This is a **fixed-size window** problem.
- Calculate the sum of the first \`k\` elements.
- Slide the window: add the next element, subtract the element that just left the window.
- Keep track of the maximum sum seen.

\`\`\`mermaid
graph LR
    subgraph W1["Window 1: sum=8"]
        direction LR
        A1["[2"] --- A2["1"] --- A3["5]"]
    end
    subgraph W2["Window 2: sum=7"]
        direction LR
        B2["[1"] --- B3["5"] --- B4["1]"]
    end
    subgraph W3["Window 3: sum=9 MAX"]
        direction LR
        C3["[5"] --- C4["1"] --- C5["3]"]
    end
    subgraph W4["Window 4: sum=6"]
        direction LR
        D4["[1"] --- D5["3"] --- D6["2]"]
    end
    W1 -->|"-2, +1"| W2 -->|"-1, +1"| W3 -->|"-5, +2"| W4
\`\`\`

### Complexity

- **Time:** O(n) — one pass through the array.
- **Space:** O(1)`,
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
      content: `## Smallest Subarray with Sum >= S

### Problem Statement

Given an array of positive integers and a number \`s\`, find the length of the **smallest contiguous subarray** whose sum is **greater than or equal to** \`s\`. Return \`0\` if no such subarray exists.

### Examples

\`\`\`
Input:  s = 7, arr = [2, 1, 5, 2, 3, 2]
Output: 2
Explanation: [5, 2] is the smallest subarray with sum >= 7.
\`\`\`

\`\`\`
Input:  s = 7, arr = [2, 1, 5, 2, 8]
Output: 1
Explanation: [8] alone is >= 7.
\`\`\`

\`\`\`
Input:  s = 8, arr = [3, 4, 1, 1, 6]
Output: 3
Explanation: [1, 1, 6] or [3, 4, 1] both have length 3.
\`\`\`

### Approach Hints

- This is a **dynamic window** problem.
- Expand the window by adding elements from the right.
- Once the window sum is >= \`s\`, try shrinking from the left to find the minimum length.
- Record the smallest window length at each valid state.

### Complexity

- **Time:** O(n) — each element is added and removed at most once.
- **Space:** O(1)`,
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

### Approach Hints

- Use a **dynamic window** with a hash map to count character frequencies.
- Expand the window to the right, adding characters to the map.
- When the map has more than \`k\` keys, shrink from the left, removing characters whose count drops to zero.
- Track the maximum window size.

### Complexity

- **Time:** O(n) — each character is processed at most twice.
- **Space:** O(k) — the hash map stores at most k+1 characters.`,
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

### Approach Hints

- This is identical to "Longest Substring with K Distinct Characters" with K = 2.
- Use a sliding window with a frequency map.
- Expand right, and when distinct count exceeds 2, shrink from the left.

### Complexity

- **Time:** O(n)
- **Space:** O(1) — at most 3 entries in the map.`,
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

### Approach Hints

- Use a sliding window with a hash map that stores the **last seen index** of each character.
- When you encounter a character already in the window, jump the window start to **one position past** that character's last occurrence.
- Update the character's index in the map at each step.
- Track the maximum window length.

### Complexity

- **Time:** O(n) — single pass.
- **Space:** O(min(n, alphabet_size)) — for the hash map.`,
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
