import { Module } from "../types";

export const module1: Module = {
  id: "numpy-pandas",
  title: "NumPy & pandas: The Data Science Foundation",
  description: "Vectorized computation with NumPy, DataFrame manipulation with pandas, and the mental models that make both click",
  lessons: [
    {
      id: "numpy-fundamentals",
      slug: "numpy-fundamentals",
      title: "NumPy: Vectorized Computing",
      content: `# NumPy: Vectorized Computing

NumPy is the foundation of the Python data science stack. It replaces slow Python loops with fast C-powered array operations.

---

\`\`\`concept
{
  "title": "Why NumPy is Fast",
  "variant": "mental-model",
  "content": "Python lists store objects with pointers — memory is scattered, type-checking per element. NumPy arrays store contiguous typed data in memory (like C arrays). Operations run on entire arrays in optimized C code (vectorization). A loop over 1M elements: Python ~1000ms, NumPy ~1ms. That's the 1000x speedup."
}
\`\`\`

---

## Array Creation & Properties

\`\`\`python
import numpy as np

# Create arrays
arr = np.array([1, 2, 3, 4, 5])           # From Python list
zeros = np.zeros((3, 4))                   # 3x4 matrix of zeros
ones = np.ones((2, 3), dtype=np.float32)   # specify dtype
rng = np.arange(0, 10, 2)                  # [0, 2, 4, 6, 8]
linspace = np.linspace(0, 1, 5)            # [0, 0.25, 0.5, 0.75, 1.0]
random = np.random.randn(100, 3)           # 100x3 normal distribution

# Properties
arr.shape    # (5,) — dimensions
arr.dtype    # int64
arr.ndim     # 1
arr.size     # 5 (total elements)

matrix = np.array([[1, 2, 3], [4, 5, 6]])
matrix.shape  # (2, 3) — 2 rows, 3 cols
\`\`\`

## Indexing & Slicing

\`\`\`python
a = np.arange(12).reshape(3, 4)
# [[ 0  1  2  3]
#  [ 4  5  6  7]
#  [ 8  9 10 11]]

# Basic indexing:
a[1, 2]       # 6 — row 1, col 2
a[0]          # [0 1 2 3] — entire first row
a[:, 1]       # [1 5 9] — entire second column

# Slicing:
a[1:, 2:]     # [[6 7], [10 11]] — rows 1+, cols 2+
a[::2, ::2]   # [[0 2], [8 10]] — every other row and col

# Boolean indexing (POWERFUL):
mask = a > 5
a[mask]       # [6 7 8 9 10 11] — flatten filtered

# Fancy indexing:
a[[0, 2], :]  # rows 0 and 2
a[:, [0, 3]]  # cols 0 and 3
\`\`\`

## Vectorized Operations (No Loops!)

\`\`\`python
x = np.array([1.0, 2.0, 3.0, 4.0])
y = np.array([10.0, 20.0, 30.0, 40.0])

# Element-wise — NO loop needed:
x + y           # [11. 22. 33. 44.]
x * y           # [10. 40. 90. 160.]
np.sqrt(x)      # [1. 1.414 1.732 2.]
np.exp(x)       # [2.718 7.389 20.09 54.6]

# Broadcasting — different shapes work together:
a = np.ones((3, 4))
b = np.array([1, 2, 3, 4])    # shape (4,)
a + b                          # b broadcast to (3,4) — adds to each row

# Aggregations:
x.sum()         # 10.0
x.mean()        # 2.5
x.std()         # 1.118...
x.min(), x.max()
np.argmax(x)    # 3 — index of maximum

# Matrix operations:
A = np.random.randn(3, 4)
B = np.random.randn(4, 5)
C = A @ B            # Matrix multiplication — shape (3, 5)
A.T                  # Transpose — shape (4, 3)
np.linalg.inv(...)   # Matrix inverse
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does NumPy broadcasting allow?",
      "options": [
        "Sending arrays over a network",
        "Operations between arrays of different shapes by virtually expanding the smaller array to match the larger one",
        "Parallel processing on multiple CPUs",
        "Converting arrays to lists automatically"
      ],
      "answer": 1,
      "explanation": "Broadcasting lets NumPy perform operations on arrays of different shapes without copying data. Rules: (1) Arrays are right-aligned by shape. (2) Dimensions of size 1 are stretched to match. Example: (3,4) + (4,) — the (4,) array is treated as (1,4) then stretched to (3,4). This allows adding a bias vector to each row of a matrix with one line of code."
    }
  ]
}
\`\`\`
`,
      starterCode: `import numpy as np

# Task 1: Create a 5x5 identity-like matrix where diagonal elements
# are 1, 2, 3, 4, 5 (not all 1s)
# Expected: [[1,0,0,0,0], [0,2,0,0,0], ...]

# Task 2: Given an array of temperatures in Celsius,
# return only those above 20°C converted to Fahrenheit (F = C * 9/5 + 32)
temperatures_c = np.array([15, 22, 8, 30, 19, 25, 12, 35])

# Task 3: Compute the cosine similarity between two vectors:
# cosine_sim = (a · b) / (||a|| * ||b||)
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])`,
      solutionCode: `import numpy as np

# Task 1: Diagonal matrix with 1..5
mat = np.diag([1, 2, 3, 4, 5])
print(mat)

# Task 2: Filter and convert
temperatures_c = np.array([15, 22, 8, 30, 19, 25, 12, 35])
hot_c = temperatures_c[temperatures_c > 20]
hot_f = hot_c * 9/5 + 32
print(hot_f)  # [71.6, 86.0, 77.0, 95.0]

# Task 3: Cosine similarity
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
cosine_sim = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
print(f"Cosine similarity: {cosine_sim:.4f}")  # 0.9746`,
    },
    {
      id: "pandas-dataframes",
      slug: "pandas-dataframes",
      title: "pandas: Data Wrangling at Scale",
      content: `# pandas: The Data Scientist's Spreadsheet

pandas is built on NumPy and adds labeled data (DataFrames) with powerful grouping, merging, and reshaping operations.

---

## DataFrame Fundamentals

\`\`\`python
import pandas as pd
import numpy as np

# Create DataFrame:
df = pd.DataFrame({
    'name':   ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'],
    'age':    [25, 30, 35, 28, 32],
    'salary': [70000, 85000, 90000, 65000, 78000],
    'dept':   ['Eng', 'Sales', 'Eng', 'HR', 'Eng'],
})

# Read from files:
df = pd.read_csv('data.csv')
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')
df = pd.read_json('data.json')
df = pd.read_parquet('data.parquet')   # Fast columnar format

# Basic inspection:
df.shape        # (5, 4)
df.dtypes       # column types
df.info()       # non-null counts + dtypes
df.describe()   # mean, std, min, 25%, 50%, 75%, max
df.head(3)      # first 3 rows
df.tail(3)      # last 3 rows
df.sample(3)    # random 3 rows
\`\`\`

## Selection & Filtering

\`\`\`python
# Column selection:
df['name']              # Series
df[['name', 'salary']]  # DataFrame (double brackets)

# Row selection — loc (label) vs iloc (position):
df.loc[0]               # row with index label 0
df.loc[1:3]             # rows 1-3 (inclusive! label-based)
df.iloc[1:3]            # rows 1-2 (exclusive — position-based)

# Boolean filtering:
df[df['salary'] > 75000]                        # salary over 75k
df[(df['dept'] == 'Eng') & (df['age'] < 32)]   # Eng dept AND young
df[df['name'].isin(['Alice', 'Carol'])]          # name in list
df[df['dept'].str.startswith('Eng')]             # string methods

# query() — cleaner syntax:
df.query("dept == 'Eng' and salary > 75000")
\`\`\`

## GroupBy & Aggregations

\`\`\`python
# GroupBy — split-apply-combine:
dept_stats = df.groupby('dept').agg(
    avg_salary=('salary', 'mean'),
    max_salary=('salary', 'max'),
    headcount=('name', 'count'),
    avg_age=('age', 'mean'),
).round(2)

#        avg_salary  max_salary  headcount  avg_age
# Eng     79333.33       90000          3    30.67
# HR      65000.00       65000          1    28.00
# Sales   85000.00       85000          1    30.00

# Pivot table:
pivot = df.pivot_table(
    values='salary',
    index='dept',
    columns='age',
    aggfunc='mean',
    fill_value=0,
)

# Apply custom function to each group:
df.groupby('dept')['salary'].apply(
    lambda s: s - s.mean()   # salary deviation from dept mean
)
\`\`\`

## Merge & Join

\`\`\`python
# Like SQL JOIN:
employees = pd.DataFrame({'emp_id': [1,2,3], 'name': ['Alice','Bob','Carol']})
salaries  = pd.DataFrame({'emp_id': [1,2,4], 'salary': [70000, 85000, 60000]})

# INNER JOIN (only matching rows):
pd.merge(employees, salaries, on='emp_id', how='inner')
# emp_id  name    salary
#      1  Alice   70000
#      2  Bob     85000

# LEFT JOIN (all left rows, NaN for unmatched right):
pd.merge(employees, salaries, on='emp_id', how='left')
# emp_id  name    salary
#      1  Alice   70000.0
#      2  Bob     85000.0
#      3  Carol   NaN
\`\`\`

## Handling Missing Data

\`\`\`python
# Detect missing:
df.isna().sum()         # count NaN per column
df.isna().mean() * 100  # % missing per column

# Drop rows/cols with NaN:
df.dropna()              # drop rows with ANY NaN
df.dropna(subset=['salary'])     # only if salary is NaN
df.dropna(axis=1, thresh=3)     # drop cols with < 3 non-null

# Fill missing:
df.fillna(0)                     # fill all with 0
df['salary'].fillna(df['salary'].median())   # median imputation
df.ffill()                       # forward fill (time series)
df.bfill()                       # backward fill
\`\`\`

\`\`\`takeaways
["DataFrame.loc is label-based (inclusive end); iloc is position-based (exclusive end) — mixing them up causes subtle bugs", "groupby().agg() with named aggregations is the cleanest way to compute multiple stats per group", "merge() left join is the SQL LEFT JOIN — all left rows, NaN for unmatched", "fillna with median (not mean) is safer for skewed distributions — outliers don't distort the median", "pd.read_parquet is 10-100x faster than read_csv for large datasets — prefer parquet in production pipelines"]
\`\`\`
`,
    },
  ],
};
