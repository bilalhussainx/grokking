import { Module } from "../types";

export const algorithmsModule: Module = {
  id: "ap-csp-algorithms",
  title: "Algorithms",
  description:
    "Learn what algorithms are, how to compare their efficiency, and implement classic searching and sorting algorithms.",
  lessons: [
    {
      id: "ap-csp-what-are-algorithms",
      slug: "what-are-algorithms",
      title: "What Are Algorithms?",
      content: `## What Are Algorithms?

<!-- voice:key_insight -->

An **algorithm** is a step-by-step procedure for solving a problem. You use algorithms every day without realizing it -- a recipe for baking cookies, directions to school, or the process of tying your shoes are all algorithms.

### Properties of a Good Algorithm

1. **Clear inputs** -- What does the algorithm start with?
2. **Clear outputs** -- What does it produce?
3. **Definite steps** -- Each step is precise and unambiguous
4. **Finite** -- It eventually stops (no infinite loops)
5. **Effective** -- Each step can actually be carried out

### Algorithm vs. Program

An algorithm is the **idea** -- the strategy for solving the problem. A program is the **implementation** -- the algorithm written in a specific programming language.

You can describe the same algorithm in English, Python, Java, or even a flowchart. The algorithm itself is language-independent.

### Efficiency Matters

Consider searching for a name in a phone book with 1,000,000 entries:

- **Linear search**: Check every entry one by one. Worst case: 1,000,000 steps.
- **Binary search**: Open to the middle, eliminate half, repeat. Worst case: about 20 steps!

Both algorithms solve the same problem, but binary search is dramatically faster.

### Analogy: Finding a Word in a Dictionary

You do not start at page 1 and read every word. You open roughly to the right letter, then narrow down. That is binary search -- and you have been doing it since elementary school.

### Deeper Reading
- AP CSP: Big Idea 3 -- Algorithms
- *Algorithms to Live By* by Brian Christian and Tom Griffiths, Chapter 1

### Reflection Questions
1. Give an example of an algorithm from your daily life.
2. Why can two correct algorithms for the same problem have very different performance?
3. What makes an algorithm "finite"?`,
    },
    {
      id: "ap-csp-linear-binary-search",
      slug: "linear-binary-search",
      title: "Searching: Linear and Binary Search",
      content: `## Searching: Linear and Binary Search

Two fundamental algorithms for finding an item in a list.

### Linear Search

Check each element one by one until you find the target or reach the end.

\`\`\`python
def linear_search(lst, target):
    for i in range(len(lst)):
        if lst[i] == target:
            return i
    return -1
\`\`\`

- Works on any list (sorted or unsorted)
- Worst case: check every element (N comparisons)

### Binary Search

Only works on a **sorted** list. Repeatedly cut the search space in half.

\`\`\`python
def binary_search(lst, target):
    low = 0
    high = len(lst) - 1
    while low <= high:
        mid = (low + high) // 2
        if lst[mid] == target:
            return mid
        elif lst[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
\`\`\`

<!-- voice:key_insight -->

\`\`\`mermaid
graph TD
    subgraph "Linear Search"
        L1["Start at index 0"] --> L2["Is this the target?"]
        L2 -->|"No"| L3["Move to next index"]
        L3 --> L2
        L2 -->|"Yes"| L4["Found!"]
    end
    subgraph "Binary Search (sorted list)"
        B1["Look at middle element"] --> B2{"Target vs middle?"}
        B2 -->|"Equal"| B3["Found!"]
        B2 -->|"Less"| B4["Search left half"]
        B2 -->|"Greater"| B5["Search right half"]
        B4 --> B1
        B5 --> B1
    end
\`\`\`

### How Many Steps?

| List Size | Linear Search (worst) | Binary Search (worst) |
|-----------|----------------------|----------------------|
| 10 | 10 | 4 |
| 1,000 | 1,000 | 10 |
| 1,000,000 | 1,000,000 | 20 |
| 1,000,000,000 | 1,000,000,000 | 30 |

Binary search uses roughly **log2(N)** steps. That is incredibly fast.

### Your Task

Implement both search algorithms.`,
      starterCode: `def linear_search(lst, target):
    """Search for target in lst. Return its index, or -1 if not found.

    Example: linear_search([4, 2, 7, 1], 7) -> 2
    """
    # TODO: Loop through lst, return index when target is found
    pass

def binary_search(sorted_lst, target):
    """Search for target in a SORTED list. Return its index, or -1 if not found.

    Example: binary_search([1, 3, 5, 7, 9], 7) -> 3
    """
    # TODO: Use low/high pointers, narrow the range by half each step
    pass

def count_search_steps(lst, target):
    """Return how many comparisons linear search needs to find target."""
    # TODO: Count the steps
    pass

# Tests
print(linear_search([4, 2, 7, 1, 9], 7))    # Expected: 2
print(linear_search([4, 2, 7, 1, 9], 5))    # Expected: -1
print(binary_search([1, 3, 5, 7, 9], 7))    # Expected: 3
print(binary_search([1, 3, 5, 7, 9], 4))    # Expected: -1
print(count_search_steps([1,2,3,4,5,6,7,8,9,10], 10))  # Expected: 10
`,
      solutionCode: `def linear_search(lst, target):
    """Search for target in lst. Return its index, or -1 if not found."""
    for i in range(len(lst)):
        if lst[i] == target:
            return i
    return -1

def binary_search(sorted_lst, target):
    """Search for target in a SORTED list. Return its index, or -1 if not found."""
    low = 0
    high = len(sorted_lst) - 1
    while low <= high:
        mid = (low + high) // 2
        if sorted_lst[mid] == target:
            return mid
        elif sorted_lst[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

def count_search_steps(lst, target):
    """Return how many comparisons linear search needs to find target."""
    steps = 0
    for item in lst:
        steps += 1
        if item == target:
            return steps
    return steps

# Tests
print(linear_search([4, 2, 7, 1, 9], 7))    # Expected: 2
print(linear_search([4, 2, 7, 1, 9], 5))    # Expected: -1
print(binary_search([1, 3, 5, 7, 9], 7))    # Expected: 3
print(binary_search([1, 3, 5, 7, 9], 4))    # Expected: -1
print(count_search_steps([1,2,3,4,5,6,7,8,9,10], 10))  # Expected: 10
`,
    },
    {
      id: "ap-csp-sorting",
      slug: "sorting-algorithms",
      title: "Sorting Algorithms",
      content: `## Sorting Algorithms

Sorting is one of the most fundamental operations in computer science. Many algorithms (like binary search) require sorted data to work.

### Selection Sort

Find the smallest element, put it first. Find the next smallest, put it second. Repeat.

\`\`\`python
def selection_sort(lst):
    for i in range(len(lst)):
        min_idx = i
        for j in range(i + 1, len(lst)):
            if lst[j] < lst[min_idx]:
                min_idx = j
        lst[i], lst[min_idx] = lst[min_idx], lst[i]
    return lst
\`\`\`

### Bubble Sort

Compare adjacent pairs and swap if they are in the wrong order. Repeat until no more swaps are needed.

<!-- voice:key_insight -->

### Comparing Sorting Algorithms

| Algorithm | Best Case | Average | Worst Case | Easy to Code? |
|-----------|-----------|---------|------------|---------------|
| Selection Sort | N^2 | N^2 | N^2 | Yes |
| Bubble Sort | N (if already sorted) | N^2 | N^2 | Yes |
| Merge Sort | N log N | N log N | N log N | Medium |

For the AP CSP exam, you need to understand that some algorithms are faster than others and be able to trace through a sorting algorithm step-by-step.

### Analogy: Sorting a Hand of Cards

When you pick up cards one at a time and insert each into its correct position in your hand, you are doing **insertion sort**. When you scan your whole hand to find the lowest card and move it to the left, that is **selection sort**.

### Real-World Connection

Search engines sort billions of web pages by relevance. Online stores sort products by price, rating, or popularity. Efficient sorting algorithms make these experiences feel instant.

### Deeper Reading
- VisuAlgo.net: animated sorting algorithm visualizations
- AP CSP: Algorithm efficiency concepts

### Reflection Questions
1. Why is merge sort faster than selection sort for large lists?
2. If a list is already sorted, which sorting algorithm runs fastest?
3. Why do we care about "worst case" performance?`,
    },
    {
      id: "ap-csp-algorithms-checkpoint",
      slug: "algorithms-checkpoint",
      title: "Checkpoint: Algorithms",
      content: `## Checkpoint: Algorithms

<!-- voice:section_check -->

### Question 1
You have a sorted list of 1,024 student IDs. Using binary search, what is the maximum number of comparisons needed to find a specific ID?

<details>
<summary>Show Answer</summary>

**10 comparisons**. log2(1024) = 10. Each comparison cuts the remaining items in half.
</details>

### Question 2
Trace through selection sort on the list [5, 3, 8, 1, 4]. Show the list after each pass.

<details>
<summary>Show Answer</summary>

- Pass 1: Find min (1), swap with index 0 -> [1, 3, 8, 5, 4]
- Pass 2: Find min in remaining (3), already at index 1 -> [1, 3, 8, 5, 4]
- Pass 3: Find min in remaining (4), swap with index 2 -> [1, 3, 4, 5, 8]
- Pass 4: Find min in remaining (5), already at index 3 -> [1, 3, 4, 5, 8]
</details>

### Question 3
Can binary search work on an unsorted list? Why or why not?

<details>
<summary>Show Answer</summary>

**No.** Binary search assumes the list is sorted so it can eliminate half the remaining items at each step. On an unsorted list, the midpoint comparison tells you nothing about which half contains the target.
</details>

### Question 4
What is the difference between an algorithm and a program?

<details>
<summary>Show Answer</summary>

An **algorithm** is the abstract step-by-step strategy (language-independent). A **program** is a concrete implementation of an algorithm in a specific programming language.
</details>

### Question 5
A website needs to search through 1 million products. They have two options: sort the products first and use binary search, or just use linear search. Which approach is better if they will search many times?

<details>
<summary>Show Answer</summary>

**Sort once, then binary search.** Sorting costs about N log N steps (roughly 20 million), but each binary search only costs about 20 steps. After just a few searches, the upfront sorting cost is repaid many times over.
</details>

### Fantastic Work!
You now understand how algorithms solve problems efficiently. Next, we will explore data analysis.`,
    },
  ],
};
