import { Module } from "../types";

export const twoDArraysModule: Module = {
  id: "ap-csa-2d-arrays",
  title: "2D Arrays",
  description:
    "Work with two-dimensional arrays -- grids, matrices, and nested loops for row-column traversal.",
  lessons: [
    {
      id: "ap-csa-2d-array-basics",
      slug: "2d-array-basics",
      title: "Creating and Accessing 2D Arrays",
      content: `## Creating and Accessing 2D Arrays

<!-- voice:section_check concept="2D array as a grid of rows and columns" -->
## A Grid of Data

Imagine a spreadsheet. It has rows going across and columns going down. A **2D array** (two-dimensional array) stores data in exactly this grid structure -- each element is located by its row number and column number.

In Java, a 2D array is literally an "array of arrays." Each element of the outer array is itself an array representing one row.

### Java vs. Python

**Java:**
\`\`\`java
int[][] grid = new int[3][4];      // 3 rows, 4 columns, filled with 0
grid[0][2] = 7;                     // row 0, column 2
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
int rows = matrix.length;           // 3
int cols = matrix[0].length;        // 3
\`\`\`

**Python equivalent:**
\`\`\`python
grid = [[0] * 4 for _ in range(3)]  # 3 rows, 4 columns
grid[0][2] = 7                       # row 0, column 2
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
rows = len(matrix)                   # 3
cols = len(matrix[0])                # 3
\`\`\`

<!-- voice:key_insight insight="Access any element with two indices: matrix[row][col]. The first index picks the row, the second picks the column within that row." -->

### Common Pitfall: Creating 2D Lists in Python

\`\`\`python
# WRONG -- all rows share the same list object
bad_grid = [[0] * 4] * 3
bad_grid[0][0] = 5  # Changes ALL rows!

# CORRECT -- each row is an independent list
good_grid = [[0] * 4 for _ in range(3)]
good_grid[0][0] = 5  # Only changes row 0
\`\`\`

### Analogy: Rows of Lockers

If a 1D array is one row of lockers, a 2D array is an entire wall of lockers -- organized in rows and columns. To find locker [2][3], go to row 2, then count to column 3.

### Reflection Questions

1. Why is a 2D array described as an "array of arrays"?
2. What goes wrong when you use \`[[0]*4]*3\` in Python?
3. How do you find the number of rows and columns in a 2D array?

### Deeper Reading
- AP CSA Unit 8: 2D Array
- *Think Java* by Allen Downey, Chapter 8 -- Arrays of arrays`,
    },
    {
      id: "ap-csa-2d-traversal",
      slug: "2d-array-traversal",
      title: "Nested Loop Traversal",
      content: `## Nested Loop Traversal

<!-- voice:section_check concept="row-major vs column-major traversal" -->
## Walking Through Every Cell

To visit every element in a 2D array, you need two loops -- one for rows and one for columns. The order you nest them determines whether you traverse **row by row** or **column by column**.

### Row-Major Traversal (Standard)

The outer loop moves through rows, the inner loop moves through columns within each row. This visits elements left to right, top to bottom -- like reading a book.

\`\`\`python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Row-major: 1, 2, 3, 4, 5, 6, 7, 8, 9
for row in range(len(matrix)):
    for col in range(len(matrix[row])):
        print(matrix[row][col], end=" ")
\`\`\`

### Column-Major Traversal

Swap the loop order. The outer loop moves through columns, the inner loop moves through rows. This visits elements top to bottom, left to right.

\`\`\`python
# Column-major: 1, 4, 7, 2, 5, 8, 3, 6, 9
for col in range(len(matrix[0])):
    for row in range(len(matrix)):
        print(matrix[row][col], end=" ")
\`\`\`

<!-- voice:key_insight insight="Row-major traversal nests columns inside rows. Column-major traversal nests rows inside columns. The element access is always matrix[row][col] -- only the loop order changes." -->

### Practical Example: Summing Each Row

\`\`\`python
grades = [
    [88, 92, 79],
    [95, 85, 91],
    [76, 80, 88]
]

for row in range(len(grades)):
    row_sum = 0
    for col in range(len(grades[row])):
        row_sum += grades[row][col]
    average = row_sum / len(grades[row])
    print(f"Student {row}: {average:.1f}")
\`\`\`

### The Image Processing Analogy

A digital image is a 2D array of pixels. Each pixel has a color value. Image filters (blur, sharpen, grayscale) work by traversing this 2D grid and modifying pixel values based on their neighbors. When you apply a filter in a photo app, nested loops are doing the work behind the scenes.

### Reflection Questions

1. When would you use column-major instead of row-major traversal?
2. Why does the element access \`matrix[row][col]\` stay the same regardless of loop order?
3. How would you traverse only the diagonal elements of a square matrix?

### Deeper Reading
- AP CSA Unit 8: Traversing 2D Arrays
- *Introduction to Computation and Programming Using Python* by John Guttag, MIT Press, 2021, Chapter 5`,
    },
    {
      id: "ap-csa-2d-exercise",
      slug: "2d-array-exercise",
      title: "Practice: 2D Array Algorithms",
      content: `## Practice: 2D Array Algorithms

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

Implement common 2D array operations that appear on the AP CSA exam.`,
      starterCode: `def row_sums(matrix):
    """Return a list where each element is the sum of a row.

    Example:
    row_sums([[1, 2, 3], [4, 5, 6]]) -> [6, 15]
    """
    # TODO: Loop through each row and sum its elements
    pass

def column_sums(matrix):
    """Return a list where each element is the sum of a column.

    Example:
    column_sums([[1, 2], [3, 4], [5, 6]]) -> [9, 12]
    """
    # TODO: Loop column-major and accumulate sums
    pass

def find_element(matrix, target):
    """Return (row, col) of target, or (-1, -1) if not found.

    Example:
    find_element([[1, 2], [3, 4]], 3) -> (1, 0)
    """
    # TODO: Search every cell
    pass

def transpose(matrix):
    """Return the transpose of the matrix (swap rows and columns).

    Example:
    transpose([[1, 2, 3], [4, 5, 6]]) -> [[1, 4], [2, 5], [3, 6]]
    """
    # TODO: Build a new matrix with swapped dimensions
    pass

# Tests
print(row_sums([[1, 2, 3], [4, 5, 6]]))           # Expected: [6, 15]
print(column_sums([[1, 2], [3, 4], [5, 6]]))      # Expected: [9, 12]
print(find_element([[1, 2], [3, 4]], 3))           # Expected: (1, 0)
print(transpose([[1, 2, 3], [4, 5, 6]]))          # Expected: [[1, 4], [2, 5], [3, 6]]
`,
      solutionCode: `def row_sums(matrix):
    """Return a list where each element is the sum of a row."""
    result = []
    for row in matrix:
        result.append(sum(row))
    return result

def column_sums(matrix):
    """Return a list where each element is the sum of a column."""
    if not matrix:
        return []
    num_cols = len(matrix[0])
    result = [0] * num_cols
    for row in matrix:
        for col in range(num_cols):
            result[col] += row[col]
    return result

def find_element(matrix, target):
    """Return (row, col) of target, or (-1, -1) if not found."""
    for r in range(len(matrix)):
        for c in range(len(matrix[r])):
            if matrix[r][c] == target:
                return (r, c)
    return (-1, -1)

def transpose(matrix):
    """Return the transpose of the matrix."""
    if not matrix:
        return []
    rows = len(matrix)
    cols = len(matrix[0])
    result = []
    for c in range(cols):
        new_row = []
        for r in range(rows):
            new_row.append(matrix[r][c])
        result.append(new_row)
    return result

# Tests
print(row_sums([[1, 2, 3], [4, 5, 6]]))           # Expected: [6, 15]
print(column_sums([[1, 2], [3, 4], [5, 6]]))      # Expected: [9, 12]
print(find_element([[1, 2], [3, 4]], 3))           # Expected: (1, 0)
print(transpose([[1, 2, 3], [4, 5, 6]]))          # Expected: [[1, 4], [2, 5], [3, 6]]
`,
    },
    {
      id: "ap-csa-2d-arrays-checkpoint",
      slug: "2d-arrays-checkpoint",
      title: "Checkpoint: 2D Arrays",
      content: `## Checkpoint: 2D Arrays

Nice work completing the 2D Arrays module! Let's make sure the concepts are solid.

<!-- voice:section_check concept="2D array creation, traversal order, and common algorithms" -->

### Question 1
What is the output of this code?
\`\`\`python
m = [[1, 2], [3, 4], [5, 6]]
print(len(m), len(m[0]))
\`\`\`

<details>
<summary>Show Answer</summary>

**3 2** -- \`len(m)\` gives the number of rows (3), \`len(m[0])\` gives the number of columns in the first row (2).
</details>

### Question 2
In row-major traversal, which loop is the outer loop -- the row loop or the column loop?

<details>
<summary>Show Answer</summary>

The **row loop** is the outer loop. You visit all columns in row 0, then all columns in row 1, and so on.
</details>

### Question 3
What is the output?
\`\`\`python
grid = [[0] * 3] * 2
grid[0][1] = 5
print(grid)
\`\`\`

<details>
<summary>Show Answer</summary>

**[[0, 5, 0], [0, 5, 0]]** -- Both rows are the same list object, so changing one changes both. Use a list comprehension to create independent rows.
</details>

### Question 4
Write code to find the largest element in a 2D array.

<details>
<summary>Show Answer</summary>

\`\`\`python
def find_max(matrix):
    largest = matrix[0][0]
    for row in matrix:
        for val in row:
            if val > largest:
                largest = val
    return largest
\`\`\`
</details>

### Question 5
How would you traverse only the main diagonal of a square matrix?

<details>
<summary>Show Answer</summary>

Use a single loop: \`for i in range(len(matrix)): print(matrix[i][i])\`. The main diagonal has equal row and column indices.
</details>

### Great Progress!
Next up: Inheritance -- building class hierarchies.`,
    },
  ],
};
