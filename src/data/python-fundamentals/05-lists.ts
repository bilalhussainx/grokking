import { Module } from "../types";

export const listsModule: Module = {
  id: "lists",
  title: "Lists",
  description: "Master Python lists — indexing, slicing, common methods, and working with 2D lists (matrices).",
  lessons: [
    {
      id: "lists-intro",
      slug: "lists-intro",
      title: "Introduction to Lists",
      content: `## Lists — Ordered Collections

A **list** is an ordered, mutable collection of items. Lists can hold any data type and even mix types.

### Creating Lists

\`\`\`python
numbers = [1, 2, 3, 4, 5]
names = ["Alice", "Bob", "Charlie"]
mixed = [1, "hello", True, 3.14]
empty = []
\`\`\`

### Indexing and Slicing

\`\`\`python
fruits = ["apple", "banana", "cherry", "date", "elderberry"]

fruits[0]      # "apple"     (first element)
fruits[-1]     # "elderberry" (last element)
fruits[1:3]    # ["banana", "cherry"] (slice)
fruits[:2]     # ["apple", "banana"] (from start)
fruits[3:]     # ["date", "elderberry"] (to end)
fruits[::2]    # ["apple", "cherry", "elderberry"] (every other)
\`\`\`

### Common List Methods

| Method | Description | Example |
|--------|-------------|---------|
| \`append(x)\` | Add x to end | \`[1,2].append(3)\` -> \`[1,2,3]\` |
| \`insert(i, x)\` | Insert x at index i | \`[1,3].insert(1, 2)\` -> \`[1,2,3]\` |
| \`remove(x)\` | Remove first occurrence of x | \`[1,2,3].remove(2)\` -> \`[1,3]\` |
| \`pop(i)\` | Remove and return item at index i | \`[1,2,3].pop(1)\` -> returns \`2\` |
| \`sort()\` | Sort in place | \`[3,1,2].sort()\` -> \`[1,2,3]\` |
| \`reverse()\` | Reverse in place | \`[1,2,3].reverse()\` -> \`[3,2,1]\` |
| \`index(x)\` | Find index of first x | \`[1,2,3].index(2)\` -> \`1\` |
| \`count(x)\` | Count occurrences of x | \`[1,2,2,3].count(2)\` -> \`2\` |
| \`extend(lst)\` | Add all items from lst | \`[1,2].extend([3,4])\` -> \`[1,2,3,4]\` |

### List Comprehensions

A concise way to create lists:

\`\`\`python
squares = [x**2 for x in range(5)]    # [0, 1, 4, 9, 16]
evens = [x for x in range(10) if x % 2 == 0]  # [0, 2, 4, 6, 8]
\`\`\`

### Useful Built-in Functions

\`\`\`python
len([1,2,3])    # 3
sum([1,2,3])    # 6
min([1,2,3])    # 1
max([1,2,3])    # 3
sorted([3,1,2]) # [1,2,3] (returns new list)
\`\`\``,
    },
    {
      id: "lists-statistics",
      slug: "list-statistics",
      title: "List Statistics",
      content: `## List Statistics

Write functions that compute basic statistics from a list of numbers — without using Python's statistics module.

### Concepts You Will Practice

- Iterating over lists
- Using built-in functions (\`len\`, \`sum\`, \`min\`, \`max\`)
- Sorting lists
- Finding the median (middle value of a sorted list)

### Hints

- The **mean** (average) is the sum divided by the count
- The **median** is the middle value when sorted. If the list has an even number of elements, average the two middle values
- The **mode** is the most frequently occurring value
- Use \`sorted()\` to sort without modifying the original list`,
      starterCode: `def list_stats(numbers):
    """Return a dictionary with keys: 'min', 'max', 'sum', 'mean', 'count'.
    Round mean to 2 decimal places."""
    # TODO: Calculate all five statistics
    pass

def median(numbers):
    """Return the median of a list of numbers.
    If even count, return the average of the two middle values.
    Round to 2 decimal places."""
    # TODO: Sort the list, then find the middle value(s)
    pass

def mode(numbers):
    """Return the most frequently occurring number.
    If there's a tie, return the smallest one."""
    # TODO: Count occurrences, find the maximum count
    pass

def remove_outliers(numbers, threshold=2):
    """Remove values that are more than 'threshold' standard deviations
    from the mean. Return the filtered list."""
    # TODO: Calculate mean and standard deviation
    # Filter out values outside mean +/- threshold * std_dev
    pass

# Test cases
print(list_stats([4, 8, 15, 16, 23, 42]))
# Expected: {'min': 4, 'max': 42, 'sum': 108, 'mean': 18.0, 'count': 6}

print(list_stats([1, 2, 3]))
# Expected: {'min': 1, 'max': 3, 'sum': 6, 'mean': 2.0, 'count': 3}

print(median([1, 3, 5, 7, 9]))
# Expected: 5

print(median([1, 2, 3, 4]))
# Expected: 2.5

print(mode([1, 2, 2, 3, 3, 3, 4]))
# Expected: 3

print(mode([1, 1, 2, 2]))
# Expected: 1

print(remove_outliers([10, 12, 11, 13, 100, 11, 12]))
# Expected: [10, 12, 11, 13, 11, 12]`,
      solutionCode: `def list_stats(numbers):
    """Return a dictionary with keys: 'min', 'max', 'sum', 'mean', 'count'.
    Round mean to 2 decimal places."""
    count = len(numbers)
    total = sum(numbers)
    return {
        'min': min(numbers),
        'max': max(numbers),
        'sum': total,
        'mean': round(total / count, 2),
        'count': count,
    }

def median(numbers):
    """Return the median of a list of numbers.
    If even count, return the average of the two middle values.
    Round to 2 decimal places."""
    s = sorted(numbers)
    n = len(s)
    mid = n // 2
    if n % 2 == 1:
        return s[mid]
    else:
        return round((s[mid - 1] + s[mid]) / 2, 2)

def mode(numbers):
    """Return the most frequently occurring number.
    If there's a tie, return the smallest one."""
    counts = {}
    for num in numbers:
        counts[num] = counts.get(num, 0) + 1
    max_count = max(counts.values())
    candidates = [num for num, c in counts.items() if c == max_count]
    return min(candidates)

def remove_outliers(numbers, threshold=2):
    """Remove values that are more than 'threshold' standard deviations
    from the mean. Return the filtered list."""
    n = len(numbers)
    mean = sum(numbers) / n
    variance = sum((x - mean) ** 2 for x in numbers) / n
    std_dev = variance ** 0.5
    return [x for x in numbers if abs(x - mean) <= threshold * std_dev]

# Test cases
print(list_stats([4, 8, 15, 16, 23, 42]))
# Expected: {'min': 4, 'max': 42, 'sum': 108, 'mean': 18.0, 'count': 6}

print(list_stats([1, 2, 3]))
# Expected: {'min': 1, 'max': 3, 'sum': 6, 'mean': 2.0, 'count': 3}

print(median([1, 3, 5, 7, 9]))
# Expected: 5

print(median([1, 2, 3, 4]))
# Expected: 2.5

print(mode([1, 2, 2, 3, 3, 3, 4]))
# Expected: 3

print(mode([1, 1, 2, 2]))
# Expected: 1

print(remove_outliers([10, 12, 11, 13, 100, 11, 12]))
# Expected: [10, 12, 11, 13, 11, 12]`,
    },
    {
      id: "lists-manipulation",
      slug: "list-manipulation",
      title: "List Manipulation",
      content: `## List Manipulation

Practice reversing, sorting, filtering, and transforming lists using loops and list comprehensions.

### Key Techniques

- **Filtering**: keep only elements that match a condition
- **Mapping**: transform every element
- **Reducing**: combine all elements into one value
- **Sorting with key**: \`sorted(lst, key=func)\`

### Hints

- List comprehensions with conditions: \`[x for x in lst if condition]\`
- You can chain operations: filter then sort
- \`sorted()\` returns a new list; \`.sort()\` modifies in place`,
      starterCode: `def reverse_list(lst):
    """Return a reversed copy of the list (do NOT use .reverse() or [::-1])."""
    # TODO: Build a new reversed list using a loop
    pass

def unique_elements(lst):
    """Return a list of unique elements, preserving their original order."""
    # TODO: Track seen elements, only add new ones
    pass

def flatten(nested_list):
    """Flatten a list of lists into a single list.
    Example: [[1,2],[3,4],[5]] -> [1,2,3,4,5]"""
    # TODO: Loop through inner lists and extend the result
    pass

def rotate_list(lst, k):
    """Rotate a list to the right by k positions.
    Example: rotate_list([1,2,3,4,5], 2) -> [4,5,1,2,3]"""
    # TODO: Use slicing to split and recombine
    pass

def chunk_list(lst, size):
    """Split a list into chunks of the given size.
    Example: chunk_list([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]"""
    # TODO: Use slicing in a loop
    pass

# Test cases
print(reverse_list([1, 2, 3, 4, 5]))
# Expected: [5, 4, 3, 2, 1]

print(unique_elements([1, 2, 2, 3, 1, 4, 3, 5]))
# Expected: [1, 2, 3, 4, 5]

print(flatten([[1, 2], [3, 4], [5]]))
# Expected: [1, 2, 3, 4, 5]

print(flatten([[1], [2, 3], [], [4, 5, 6]]))
# Expected: [1, 2, 3, 4, 5, 6]

print(rotate_list([1, 2, 3, 4, 5], 2))
# Expected: [4, 5, 1, 2, 3]

print(rotate_list([1, 2, 3, 4, 5], 0))
# Expected: [1, 2, 3, 4, 5]

print(chunk_list([1, 2, 3, 4, 5], 2))
# Expected: [[1, 2], [3, 4], [5]]

print(chunk_list([1, 2, 3, 4, 5, 6], 3))
# Expected: [[1, 2, 3], [4, 5, 6]]`,
      solutionCode: `def reverse_list(lst):
    """Return a reversed copy of the list (do NOT use .reverse() or [::-1])."""
    result = []
    for i in range(len(lst) - 1, -1, -1):
        result.append(lst[i])
    return result

def unique_elements(lst):
    """Return a list of unique elements, preserving their original order."""
    seen = set()
    result = []
    for item in lst:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result

def flatten(nested_list):
    """Flatten a list of lists into a single list."""
    result = []
    for inner in nested_list:
        result.extend(inner)
    return result

def rotate_list(lst, k):
    """Rotate a list to the right by k positions."""
    if len(lst) == 0:
        return lst
    k = k % len(lst)
    return lst[-k:] + lst[:-k] if k != 0 else lst[:]

def chunk_list(lst, size):
    """Split a list into chunks of the given size."""
    result = []
    for i in range(0, len(lst), size):
        result.append(lst[i:i + size])
    return result

# Test cases
print(reverse_list([1, 2, 3, 4, 5]))
# Expected: [5, 4, 3, 2, 1]

print(unique_elements([1, 2, 2, 3, 1, 4, 3, 5]))
# Expected: [1, 2, 3, 4, 5]

print(flatten([[1, 2], [3, 4], [5]]))
# Expected: [1, 2, 3, 4, 5]

print(flatten([[1], [2, 3], [], [4, 5, 6]]))
# Expected: [1, 2, 3, 4, 5, 6]

print(rotate_list([1, 2, 3, 4, 5], 2))
# Expected: [4, 5, 1, 2, 3]

print(rotate_list([1, 2, 3, 4, 5], 0))
# Expected: [1, 2, 3, 4, 5]

print(chunk_list([1, 2, 3, 4, 5], 2))
# Expected: [[1, 2], [3, 4], [5]]

print(chunk_list([1, 2, 3, 4, 5, 6], 3))
# Expected: [[1, 2, 3], [4, 5, 6]]`,
    },
    {
      id: "lists-matrix",
      slug: "matrix-operations",
      title: "Matrix Operations",
      content: `## Matrix Operations

A **matrix** is a 2D list — a list of lists. Matrices are used extensively in math, data science, and game development.

### Creating a Matrix

\`\`\`python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Access element at row 1, column 2:
matrix[1][2]  # 6
\`\`\`

### Iterating Over a Matrix

\`\`\`python
for row in matrix:
    for value in row:
        print(value, end=" ")
    print()
\`\`\`

### Hints

- Row count: \`len(matrix)\`
- Column count: \`len(matrix[0])\`
- Transpose: swap rows and columns (element at [i][j] goes to [j][i])`,
      starterCode: `def create_matrix(rows, cols, default=0):
    """Create a rows x cols matrix filled with the default value."""
    # TODO: Use nested list comprehension or nested loops
    pass

def transpose(matrix):
    """Return the transpose of a matrix (swap rows and columns)."""
    # TODO: Element at [i][j] becomes [j][i]
    pass

def matrix_add(a, b):
    """Add two matrices element-wise. Assume same dimensions."""
    # TODO: Add corresponding elements
    pass

def matrix_multiply(a, b):
    """Multiply two matrices. Return the resulting matrix.
    a is m x n, b is n x p, result is m x p."""
    # TODO: Use the dot product formula for matrix multiplication
    pass

# Test cases
print(create_matrix(2, 3, 0))
# Expected: [[0, 0, 0], [0, 0, 0]]

print(create_matrix(3, 3, 1))
# Expected: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]

print(transpose([[1, 2, 3], [4, 5, 6]]))
# Expected: [[1, 4], [2, 5], [3, 6]]

print(transpose([[1, 2], [3, 4], [5, 6]]))
# Expected: [[1, 3, 5], [2, 4, 6]]

a = [[1, 2], [3, 4]]
b = [[5, 6], [7, 8]]
print(matrix_add(a, b))
# Expected: [[6, 8], [10, 12]]

a = [[1, 2], [3, 4]]
b = [[5, 6], [7, 8]]
print(matrix_multiply(a, b))
# Expected: [[19, 22], [43, 50]]`,
      solutionCode: `def create_matrix(rows, cols, default=0):
    """Create a rows x cols matrix filled with the default value."""
    return [[default for _ in range(cols)] for _ in range(rows)]

def transpose(matrix):
    """Return the transpose of a matrix (swap rows and columns)."""
    rows = len(matrix)
    cols = len(matrix[0])
    result = []
    for j in range(cols):
        new_row = []
        for i in range(rows):
            new_row.append(matrix[i][j])
        result.append(new_row)
    return result

def matrix_add(a, b):
    """Add two matrices element-wise. Assume same dimensions."""
    rows = len(a)
    cols = len(a[0])
    result = []
    for i in range(rows):
        row = []
        for j in range(cols):
            row.append(a[i][j] + b[i][j])
        result.append(row)
    return result

def matrix_multiply(a, b):
    """Multiply two matrices. Return the resulting matrix.
    a is m x n, b is n x p, result is m x p."""
    m = len(a)
    n = len(a[0])
    p = len(b[0])
    result = [[0 for _ in range(p)] for _ in range(m)]
    for i in range(m):
        for j in range(p):
            total = 0
            for k in range(n):
                total += a[i][k] * b[k][j]
            result[i][j] = total
    return result

# Test cases
print(create_matrix(2, 3, 0))
# Expected: [[0, 0, 0], [0, 0, 0]]

print(create_matrix(3, 3, 1))
# Expected: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]

print(transpose([[1, 2, 3], [4, 5, 6]]))
# Expected: [[1, 4], [2, 5], [3, 6]]

print(transpose([[1, 2], [3, 4], [5, 6]]))
# Expected: [[1, 3, 5], [2, 4, 6]]

a = [[1, 2], [3, 4]]
b = [[5, 6], [7, 8]]
print(matrix_add(a, b))
# Expected: [[6, 8], [10, 12]]

a = [[1, 2], [3, 4]]
b = [[5, 6], [7, 8]]
print(matrix_multiply(a, b))
# Expected: [[19, 22], [43, 50]]`,
    },
  ],
};
