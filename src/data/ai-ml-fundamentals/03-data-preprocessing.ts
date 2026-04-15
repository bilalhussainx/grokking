import { Module } from "../types";

export const dataPreprocessingModule: Module = {
  id: "data-preprocessing",
  title: "Data Preprocessing and Feature Engineering",
  description: "Transform raw data into ML-ready form: handle missing values, encode categoricals, scale features, detect outliers, and split datasets properly.",
  lessons: [
    {
      id: "loading-exploring-data",
      slug: "loading-exploring-data",
      title: "Loading and Exploring Datasets",
      content: `# Loading and Exploring Datasets

Before any model can learn, you need to understand your data. Rushing into modeling without exploration is like driving blindfolded — you might get somewhere, but probably not where you intended. This lesson teaches you to load raw CSV data using NumPy and systematically interrogate it: shapes, types, distributions, and anomalies.

\`\`\`concept
{ "title": "Data First, Model Second", "variant": "rule", "content": "Every ML project starts with Exploratory Data Analysis (EDA). You cannot choose the right algorithm, preprocessing steps, or features without first understanding what your data actually looks like. NumPy gives you the numerical foundation to do this from scratch." }
\`\`\`

---

## Why NumPy for Data Loading?

NumPy is Python's numerical computing backbone. Under the hood, TensorFlow, PyTorch, and scikit-learn all represent data as NumPy-style multidimensional arrays. By learning to load and inspect data with NumPy directly, you build the mental model that every framework inherits.

\`\`\`callout
{ "type": "info", "title": "NumPy is NOT a Machine Learning Framework", "content": "NumPy is a numerical computing library. It does not provide pre-built ML models or training APIs. It gives you the array operations and math primitives that ML frameworks are built upon. This distinction matters — frameworks are for deployment, NumPy is for understanding." }
\`\`\`

---

## Step 1 — Loading CSV Data with \`np.genfromtxt\`

NumPy provides two primary functions for reading tabular files:

| Function | Best For | Handles Missing? |
|---|---|---|
| \`np.loadtxt\` | Clean, uniform data | No |
| \`np.genfromtxt\` | Real-world messy data | Yes |

In practice, real datasets always have quirks — missing values, mixed types, header rows. Use \`np.genfromtxt\`.

\`\`\`steps
{ "title": "Loading a CSV Step by Step", "steps": [ { "title": "Import NumPy", "content": "\`\`\`python\\nimport numpy as np\\n\`\`\`\\nNumPy is your only dependency for this entire module." }, { "title": "Load the file", "content": "\`\`\`python\\ndata = np.genfromtxt(\\n    'housing.csv',\\n    delimiter=',',\\n    skip_header=1,\\n    filling_values=np.nan\\n)\\n\`\`\`\\n- \`delimiter=','\` — tells NumPy the column separator\\n- \`skip_header=1\` — skips the column name row\\n- \`filling_values=np.nan\` — fills missing entries with NaN (Not a Number)" }, { "title": "Check what you loaded", "content": "\`\`\`python\\nprint(data.shape)   # (rows, columns)\\nprint(data.dtype)   # float64 by default\\n\`\`\`\\n\`shape\` is the single most important attribute. A shape of \`(506, 13)\` means 506 samples and 13 features." }, { "title": "Separate features from target", "content": "\`\`\`python\\nX = data[:, :-1]   # all rows, all columns except last\\ny = data[:, -1]    # all rows, last column only\\n\\nprint(X.shape)  # (506, 12)\\nprint(y.shape)  # (506,)\\n\`\`\`\\nBy convention, \`X\` holds features (inputs) and \`y\` holds the target (output to predict)." } ] }
\`\`\`

---

## Hands-On: Load and Inspect

The playground below contains a synthetic housing dataset embedded as a string — just like reading a real CSV file. Run it and study the output.

\`\`\`playground
{ "title": "Load and Inspect a Dataset", "language": "python", "code": "import numpy as np\\nfrom io import StringIO\\n\\n# Synthetic housing dataset (embedded as CSV string)\\ncsv_data = \\"\\"\\"size_sqft,bedrooms,age_years,distance_km,price_k\\n1400,3,10,5.2,320\\n2100,4,5,3.1,475\\n850,2,25,8.7,185\\n1750,3,12,4.0,380\\n3200,5,2,1.5,620\\n1100,2,18,6.3,240\\n2800,4,8,2.9,530\\n950,2,30,9.1,175\\n1600,3,7,4.8,355\\n2400,4,3,2.2,510\\n\\"\\"\\"\\n\\n# Load from string (same API as loading from a file path)\\ndata = np.genfromtxt(StringIO(csv_data), delimiter=',', skip_header=1)\\n\\nprint(\\"=== SHAPE ===\\")\\nprint(f\\"Rows (samples): {data.shape[0]}\\")\\nprint(f\\"Columns (features+target): {data.shape[1]}\\")\\n\\nprint(\\"\\\\n=== DATA TYPE ===\\")\\nprint(f\\"dtype: {data.dtype}\\")\\n\\nprint(\\"\\\\n=== FIRST 3 ROWS ===\\")\\nprint(data[:3])\\n\\nprint(\\"\\\\n=== SEPARATE X AND y ===\\")\\nX = data[:, :-1]\\ny = data[:, -1]\\nprint(f\\"X shape: {X.shape}  (features)\\")\\nprint(f\\"y shape: {y.shape}  (target)\\")\\n\\nprint(\\"\\\\n=== SUMMARY STATISTICS ===\\")\\nfeature_names = ['size_sqft', 'bedrooms', 'age_years', 'distance_km']\\nfor i, name in enumerate(feature_names):\\n    col = X[:, i]\\n    print(f\\"{name:15s}  min={col.min():7.1f}  max={col.max():7.1f}  mean={col.mean():7.1f}  std={col.std():6.1f}\\")", "runnable": true }
\`\`\`

---

## Step 2 — Understanding Array Shape and Indexing

Shape is the lens through which you read all data in NumPy. Every operation — matrix multiplication, broadcasting, slicing — depends on understanding shapes precisely.

\`\`\`concept
{ "title": "The Shape Mental Model", "variant": "analogy", "content": "Think of a NumPy array like a spreadsheet. \`shape[0]\` is the number of rows (samples/observations). \`shape[1]\` is the number of columns (features/variables). A shape of (100, 5) means 100 data points, each described by 5 numbers. ML algorithms consume data in this (samples, features) layout." }
\`\`\`

Here is a visual trace of how NumPy loads and structures your data:

\`\`\`trace
{ "title": "Tracing Data Loading Line by Line", "language": "python", "code": "import numpy as np\\nfrom io import StringIO\\n\\ncsv = \\"a,b,c\\\\n1,2,3\\\\n4,5,6\\\\n7,8,9\\"\\ndata = np.genfromtxt(StringIO(csv), delimiter=',', skip_header=1)\\nrow0 = data[0]\\ncol1 = data[:, 1]\\nmean_col1 = col1.mean()\\nX = data[:, :2]\\ny = data[:, 2]", "frames": [ { "line": 1, "vars": {}, "note": "Import NumPy — the only library we need" }, { "line": 2, "vars": {}, "note": "StringIO lets us treat a string as a file object — identical API to np.genfromtxt('file.csv')" }, { "line": 4, "vars": { "csv": "\\"a,b,c\\\\n1,2,3\\\\n...\\"" }, "note": "A small 3x3 CSV with header row a, b, c" }, { "line": 5, "vars": { "data": "array([[1,2,3],[4,5,6],[7,8,9]])", "data.shape": "(3, 3)", "data.dtype": "float64" }, "note": "genfromtxt reads CSV, skips header, returns 2D float array of shape (3,3)" }, { "line": 6, "vars": { "row0": "array([1., 2., 3.])", "data.shape": "(3, 3)" }, "note": "data[0] selects the first row — all 3 features for sample 0" }, { "line": 7, "vars": { "col1": "array([2., 5., 8.])", "row0": "array([1., 2., 3.])" }, "note": "data[:, 1] selects ALL rows, column index 1 — feature 'b' for every sample" }, { "line": 8, "vars": { "mean_col1": "5.0", "col1": "array([2., 5., 8.])" }, "note": ".mean() computes the arithmetic mean: (2+5+8)/3 = 5.0" }, { "line": 9, "vars": { "X": "array([[1,2],[4,5],[7,8]])", "mean_col1": "5.0" }, "note": "data[:, :2] slices columns 0 and 1 — our feature matrix X, shape (3,2)" }, { "line": 10, "vars": { "y": "array([3., 6., 9.])", "X": "array([[1,2],[4,5],[7,8]])" }, "note": "data[:, 2] extracts column 2 — our target vector y, shape (3,)" } ], "speed": 900 }
\`\`\`

---

## Step 3 — Computing Summary Statistics

Summary statistics reveal the distribution of each feature. This tells you whether features are on comparable scales (critical for many ML algorithms), whether outliers exist, and whether data makes sense.

The five key statistics for each numeric feature:

| Statistic | NumPy Call | What It Reveals |
|---|---|---|
| Minimum | \`np.min(col)\` | Lower bound, possible outliers |
| Maximum | \`np.max(col)\` | Upper bound, possible outliers |
| Mean | \`np.mean(col)\` | Central tendency |
| Standard deviation | \`np.std(col)\` | Spread of values |
| Median | \`np.median(col)\` | Robust center (not affected by outliers) |

\`\`\`callout
{ "type": "tip", "title": "Mean vs Median — Why Both Matter", "content": "If mean and median differ significantly for a feature, the distribution is skewed and likely contains outliers. For example, income data often has mean >> median because a few very high earners pull the mean up. Always compute both." }
\`\`\`

---

## Visualising the Array Structure

Here is how a 5-sample, 4-feature dataset sits in memory as a 2D NumPy array:

\`\`\`algoviz
{ "title": "Dataset as a 2D NumPy Array (5 samples × 4 features)", "type": "array", "data": [1400, 3, 10, 5.2, 2100, 4, 5, 3.1, 850, 2, 25, 8.7, 1750, 3, 12, 4.0, 3200, 5, 2, 1.5], "frames": [ { "highlight": [0, 1, 2, 3], "label": "Row 0 (sample 0): size=1400, beds=3, age=10, dist=5.2", "stats": { "row": 0, "cols": 4 } }, { "highlight": [4, 5, 6, 7], "label": "Row 1 (sample 1): size=2100, beds=4, age=5, dist=3.1", "stats": { "row": 1, "cols": 4 } }, { "highlight": [8, 9, 10, 11], "label": "Row 2 (sample 2): size=850, beds=2, age=25, dist=8.7", "stats": { "row": 2, "cols": 4 } }, { "highlight": [0, 4, 8, 12, 16], "label": "Column 0 = 'size_sqft' feature across all samples", "stats": { "col": 0, "feature": "size_sqft" } }, { "highlight": [3, 7, 11, 15, 19], "label": "Column 3 = 'distance_km' feature across all samples", "stats": { "col": 3, "feature": "distance_km" } } ], "speed": 1000 }
\`\`\`

---

## Step 4 — Detecting Missing Values

Real data is never clean. Missing values in NumPy are represented as \`np.nan\` (Not a Number). Before any computation, you must find and handle them.

\`\`\`playground
{ "title": "Detecting Missing Values with NumPy", "language": "python", "code": "import numpy as np\\nfrom io import StringIO\\n\\n# Dataset with intentional missing values (blank = NaN)\\ncsv_data = \\"\\"\\"size,bedrooms,age,price\\n1400,3,10,320\\n2100,,5,475\\n850,2,,185\\n1750,3,12,\\n3200,5,2,620\\n\\"\\"\\"\\n\\ndata = np.genfromtxt(StringIO(csv_data), delimiter=',', skip_header=1)\\n\\nprint(\\"=== RAW DATA (NaN = missing) ===\\")\\nprint(data)\\n\\nprint(\\"\\\\n=== MISSING VALUE MAP ===\\")\\nmissing_mask = np.isnan(data)\\nprint(missing_mask)\\n\\nprint(\\"\\\\n=== COUNT PER COLUMN ===\\")\\ncol_names = ['size', 'bedrooms', 'age', 'price']\\nfor i, name in enumerate(col_names):\\n    n_missing = np.sum(np.isnan(data[:, i]))\\n    pct = 100 * n_missing / data.shape[0]\\n    print(f\\"  {name:10s}: {n_missing} missing ({pct:.0f}%)\\")\\n\\nprint(\\"\\\\n=== ROWS WITH ANY MISSING VALUE ===\\")\\nrows_with_nan = np.any(np.isnan(data), axis=1)\\nprint(f\\"Affected rows: {np.where(rows_with_nan)[0].tolist()}\\")\\nprint(f\\"Clean rows:    {np.where(~rows_with_nan)[0].tolist()}\\")", "runnable": true }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the Exploration Pipeline", "prompt": "Write a function that loads a CSV file and returns its shape, the count of NaN values, and the mean of each column.", "language": "python", "template": "import numpy as np\\n\\ndef explore_dataset(filepath):\\n    # Load with missing value support\\n    data = np.genfromtxt(___, delimiter=',', skip_header=1, filling_values=np.nan)\\n    \\n    # Get dimensions\\n    n_samples, n_features = data.___\\n    \\n    # Count total missing values\\n    n_missing = np.sum(np.isnan(___))\\n    \\n    # Compute column means, ignoring NaN\\n    col_means = np.nanmean(data, axis=___)\\n    \\n    return n_samples, n_features, n_missing, col_means", "blanks": [ { "answer": "filepath", "hint": "Pass the file path string directly to genfromtxt as its first argument" }, { "answer": "shape", "hint": "This NumPy array attribute returns a tuple (rows, cols)" }, { "answer": "data", "hint": "You want to check the entire data array for NaN values" }, { "answer": "0", "hint": "axis=0 computes the mean down each column; axis=1 would compute across each row" } ] }
\`\`\`

---

## The Exploration Checklist

Every dataset you encounter should be put through this systematic checklist before touching any algorithm:

\`\`\`tabs
{ "tabs": [ { "label": "Shape & Type", "icon": "📐", "content": "\`\`\`python\\n# Always check first\\nprint(data.shape)    # (n_samples, n_features)\\nprint(data.dtype)    # usually float64 for numeric data\\nprint(data.ndim)     # should be 2 for tabular data\\n\`\`\`\\n\\n**What you're checking:**\\n- \`shape[0]\` — do you have enough samples for ML? (<100 is very small)\\n- \`shape[1]\` — how many features? Too many may cause the curse of dimensionality\\n- \`dtype\` — if it shows \`object\`, you have mixed types and need to handle them" }, { "label": "Statistics", "icon": "📊", "content": "\`\`\`python\\n# Per-column statistics\\nfor i in range(X.shape[1]):\\n    col = X[:, i]\\n    print(f\\"Feature {i}:\\")\\n    print(f\\"  min={np.min(col):.2f}, max={np.max(col):.2f}\\")\\n    print(f\\"  mean={np.mean(col):.2f}, std={np.std(col):.2f}\\")\\n    print(f\\"  median={np.median(col):.2f}\\")\\n\`\`\`\\n\\n**What you're checking:**\\n- Are features on similar scales? (e.g., size=1400 vs age=10 — huge gap)\\n- Is mean ≈ median? Large gaps signal skewness or outliers\\n- Is std very small? Feature may be near-constant and not useful" }, { "label": "Missing Values", "icon": "❓", "content": "\`\`\`python\\n# Total missing\\nprint(np.sum(np.isnan(data)))\\n\\n# Per-column missing\\nfor i in range(data.shape[1]):\\n    n = np.sum(np.isnan(data[:, i]))\\n    print(f\\"Col {i}: {n} missing ({100*n/len(data):.1f}%)\\")\\n\\n# Rows with any missing\\nbad_rows = np.any(np.isnan(data), axis=1)\\nprint(f\\"{bad_rows.sum()} rows have missing values\\")\\n\`\`\`\\n\\n**Decision rules:**\\n- <5% missing: safe to drop those rows\\n- 5-30% missing: impute (fill with mean/median)\\n- >30% missing: consider dropping the entire feature" }, { "label": "Outliers", "icon": "🎯", "content": "\`\`\`python\\n# Z-score method: flag values > 3 std from mean\\nfor i in range(X.shape[1]):\\n    col = X[:, i]\\n    z_scores = np.abs((col - col.mean()) / col.std())\\n    outliers = np.sum(z_scores > 3)\\n    print(f\\"Feature {i}: {outliers} outlier(s)\\")\\n\\n# IQR method (more robust)\\nQ1 = np.percentile(col, 25)\\nQ3 = np.percentile(col, 75)\\nIQR = Q3 - Q1\\nis_outlier = (col < Q1 - 1.5*IQR) | (col > Q3 + 1.5*IQR)\\nprint(f\\"IQR outliers: {is_outlier.sum()}\\")\\n\`\`\`\\n\\n**Why it matters:** Outliers can dominate the loss function and make your model fit noise instead of signal." } ] }
\`\`\`

---

## Before You Model: The Scale Problem

Notice from the playground above that \`size_sqft\` values (~850–3200) are hundreds of times larger than \`bedrooms\` (2–5). This difference in scale is not just aesthetic — it causes real algorithmic problems:

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Unscaled Features (PROBLEM)", "code": "# size_sqft: 850 to 3200\\n# bedrooms:   2 to 5\\n# age_years:  2 to 30\\n# distance:   1.5 to 9.1\\n\\n# Gradient descent will chase 'size' and\\n# almost ignore 'bedrooms' — the scale\\n# creates an artificially uneven landscape.\\n\\nX_raw = data[:, :-1]\\n# shape: (10, 4) -- but scales are wildly different" }, "after": { "label": "Scaled Features (SOLUTION — next lesson)", "code": "# After min-max or z-score normalization:\\n# size_sqft: 0.0 to 1.0\\n# bedrooms:  0.0 to 1.0\\n# age_years: 0.0 to 1.0\\n# distance:  0.0 to 1.0\\n\\n# Now each feature contributes equally.\\n# We'll implement this in the next lesson.\\n\\nX_scaled = (X - X.min(axis=0)) / (X.max(axis=0) - X.min(axis=0))" } }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Do Not Scale Before Splitting", "content": "Always split your data into train/test sets BEFORE computing scaling parameters. If you fit your scaler on the full dataset (including test data), you leak information from the test set into training — a form of data leakage that gives optimistically wrong evaluation results." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Loading and Exploring Datasets", "questions": [ { "question": "You call \`data = np.genfromtxt('file.csv', delimiter=',', skip_header=1)\` and then \`print(data.shape)\` shows \`(200, 6)\`. How many samples and features does your dataset have?", "options": ["200 features, 6 samples", "200 samples, 6 columns total (5 features + 1 target)", "6 samples, 200 features", "200 samples, 6 features with no target"], "answer": 1, "explanation": "shape[0]=200 is the number of rows (samples). shape[1]=6 is the total number of columns. By convention the last column is the target, giving 5 features + 1 target — though this depends on your dataset's structure." }, { "question": "Which NumPy function correctly computes the mean of each column while ignoring NaN (missing) values?", "options": ["np.mean(data, axis=0)", "np.nanmean(data, axis=0)", "np.mean(data, axis=1)", "np.nanmean(data, axis=1)"], "answer": 1, "explanation": "np.nanmean ignores NaN values. axis=0 computes down each column (one mean per feature). Using regular np.mean when NaN values exist returns NaN for any column that contains even one missing value." }, { "question": "What does \`np.isnan(data).sum()\` compute?", "options": ["The number of rows with at least one NaN", "The number of columns with at least one NaN", "The total count of NaN values across the entire array", "The percentage of NaN values"], "answer": 2, "explanation": "np.isnan(data) produces a boolean array (True where NaN exists). Calling .sum() on a boolean array counts the True values, giving the total number of NaN entries in the entire 2D array." }, { "question": "Why is it a problem that one feature has values ranging from 1 to 100,000 while another ranges from 0 to 1?", "options": ["NumPy cannot store both scales in the same array", "Gradient descent will disproportionately update weights for the large-scale feature", "The mean will be meaningless for both features", "There is no problem — ML algorithms handle scale differences automatically"], "answer": 1, "explanation": "Gradient descent computes partial derivatives with respect to each weight. Features with large scales produce large gradients, causing the optimizer to update those weights much more aggressively and potentially ignore small-scale features. Feature scaling (normalization) fixes this — covered in the next lesson." }, { "question": "You want to extract only the first 3 columns of a 2D NumPy array \`data\` with shape (150, 5). Which slice is correct?", "options": ["data[3, :]", "data[:3]", "data[:, :3]", "data[:, 3:]"], "answer": 2, "explanation": "data[:, :3] means 'all rows (:), columns 0 through 2 (:3)'. The result has shape (150, 3). data[:3] would give the first 3 rows, not columns." } ] }
\`\`\`

---

## Collapse: Under the Hood — How \`genfromtxt\` Handles Types

\`\`\`collapse
{ "title": "Deep Dive: Why dtype matters and what happens with mixed columns", "content": "When NumPy reads a CSV, it needs to assign a single dtype to the array. If all values are numeric, it defaults to \`float64\` — the most flexible numeric type.\\n\\n**What happens with string columns (like 'Male'/'Female' for gender)?**\\n\\nIf any column contains strings, NumPy cannot represent the array as \`float64\`. It falls back to \`dtype=object\` — Python objects, not fast numeric arrays. This kills performance.\\n\\n\`\`\`python\\n# Problem: mixing strings and numbers\\ndata = np.genfromtxt('data.csv', delimiter=',', dtype=None, encoding='utf-8')\\nprint(data.dtype)  # object — slow\\n\`\`\`\\n\\n**The proper solution:** Load strings separately, encode them numerically, then combine.\\n\\n\`\`\`python\\n# Step 1: Load only numeric columns\\nnumeric_data = np.genfromtxt('data.csv', delimiter=',', skip_header=1,\\n                              usecols=(0, 1, 2, 4))  # skip column 3 (strings)\\n\\n# Step 2: Load string column separately\\nstring_col = np.genfromtxt('data.csv', delimiter=',', skip_header=1,\\n                            usecols=(3,), dtype=str)\\n\\n# Step 3: Encode strings as integers (label encoding)\\nunique_vals, encoded = np.unique(string_col, return_inverse=True)\\n# 'Female' -> 0, 'Male' -> 1  (alphabetical order)\\n\\n# Step 4: Combine back into float array\\nfull_data = np.column_stack([numeric_data, encoded.reshape(-1, 1)])\\n\`\`\`\\n\\nThis manual process is exactly what scikit-learn's \`LabelEncoder\` automates — but now you understand what it does internally.\\n\\n**float64 vs float32:**\\nFor very large datasets, \`float32\` uses half the memory of \`float64\` with negligible precision loss for most ML tasks:\\n\`\`\`python\\ndata = np.genfromtxt('data.csv', delimiter=',', skip_header=1, dtype=np.float32)\\n\`\`\`" }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Use \`np.genfromtxt\` with \`filling_values=np.nan\` to safely load real-world CSV files that may contain missing values.", "Always inspect \`data.shape\` first — shape[0] is samples, shape[1] is total columns (features + target).", "Use \`np.isnan(data)\` to build a missing value map; use \`np.nanmean\` and \`np.nanstd\` for statistics that survive NaN.", "Summary statistics (min, max, mean, std, median) reveal scale mismatches and outliers — both must be resolved before modeling.", "Never scale data before splitting into train/test sets — doing so leaks test information into your training process." ] }
\`\`\``,
    },
    {
      id: "missing-values-outliers",
      slug: "missing-values-outliers",
      title: "Handling Missing Values and Outliers",
      content: `# Handling Missing Values and Outliers

Real-world data is messy. Sensors malfunction, survey respondents skip questions, spreadsheets get corrupted. Before any ML algorithm ever sees your data, you need to answer two critical questions: *what's missing?* and *what doesn't belong?* Get these wrong and your model learns from noise — or fails to learn at all.

In this lesson you'll build every technique from scratch using only NumPy: detecting NaNs, imputing with mean/median/forward-fill, and hunting outliers with IQR and z-scores.

---

\`\`\`concept
{ "title": "Data Cleaning as Translation", "variant": "analogy", "content": "Think of raw data as a handwritten letter full of smudges and wild scribbles. Missing values are the smudges — the ink is gone and you must infer what was meant from context. Outliers are the wild scribbles — they stand out so dramatically that you must decide: typo or intentional emphasis? Your job before any ML is to translate this messy letter into clean, machine-readable text." }
\`\`\`

---

## Part 1 — Missing Values

### What Are They and Why Do They Exist?

Missing values appear as \`NaN\` (Not a Number) in NumPy arrays and pandas DataFrames. Their root causes fall into three categories that directly determine *how* you should handle them:

\`\`\`tabs
{ "tabs": [
  {
    "label": "MCAR",
    "icon": "🎲",
    "content": "**Missing Completely at Random (MCAR)**\\n\\nThe probability of a value being missing has no relationship to any variable in the dataset — it is pure chance. Example: a sensor randomly drops 2% of readings due to packet loss.\\n\\n**Implication:** Safe to use mean/median imputation or even row deletion without introducing bias."
  },
  {
    "label": "MAR",
    "icon": "🔗",
    "content": "**Missing at Random (MAR)**\\n\\nThe missingness depends on *other observed* variables, not the missing value itself. Example: younger survey respondents are less likely to report income, but whether *their specific income* is missing is unrelated to the income amount.\\n\\n**Implication:** Imputation using other features (e.g., KNN, regression) works well. Simple mean imputation can introduce bias."
  },
  {
    "label": "MNAR",
    "icon": "⚠️",
    "content": "**Missing Not at Random (MNAR)**\\n\\nThe missingness is directly related to the value that's missing. Example: high-earners refuse to disclose income — the income *value itself* predicts whether it's missing.\\n\\n**Implication:** The hardest case. Simple imputation will systematically bias results. You may need domain expertise, separate missingness indicators, or specialized models."
  }
] }
\`\`\`

### Detecting Missing Values with NumPy

NumPy's \`np.isnan()\` is your primary tool. Let's build a full detection pipeline:

\`\`\`playground
{ "title": "Detecting and Counting Missing Values", "language": "python", "code": "import numpy as np\\n\\n# Simulate a dataset: age, income, years_experience\\n# NaN represents missing data\\ndata = np.array([\\n    [25.0, 50000.0, 3.0],\\n    [30.0,    np.nan, 5.0],\\n    [np.nan, 75000.0, 8.0],\\n    [45.0, 90000.0, np.nan],\\n    [22.0, np.nan,  1.0],\\n    [35.0, 65000.0, 7.0],\\n])\\n\\nfeatures = ['age', 'income', 'years_exp']\\n\\n# --- Detection ---\\nmissing_mask = np.isnan(data)          # Boolean mask: True where NaN\\nmissing_per_col = missing_mask.sum(axis=0)   # Count per feature\\nmissing_pct = missing_mask.mean(axis=0) * 100  # Percentage\\n\\nprint(\\"Missing value audit:\\")\\nprint(\\"-\\" * 35)\\nfor i, feat in enumerate(features):\\n    print(f\\"  {feat:15s}: {int(missing_per_col[i])} missing ({missing_pct[i]:.1f}%)\\")\\n\\nprint(f\\"\\\\nRows with ANY missing value: {missing_mask.any(axis=1).sum()}\\")\\nprint(f\\"Total cells: {data.size}  |  Missing: {missing_mask.sum()}\\")", "runnable": true }
\`\`\`

### Imputation Strategies

Once you know *where* data is missing, choose your fill strategy based on the distribution and missingness type:

\`\`\`steps
{ "title": "Imputation Decision Ladder", "steps": [
  {
    "title": "Check missingness percentage",
    "content": "If a column is **>50% missing**, consider dropping it — imputation of that many values invents more data than it preserves.\\n\\nIf **<5% missing** and likely MCAR, simple mean/median imputation is usually fine."
  },
  {
    "title": "Check the distribution",
    "content": "Use **mean imputation** for roughly symmetric, low-outlier distributions.\\n\\nUse **median imputation** for skewed distributions or when outliers are present — the median is robust to extreme values."
  },
  {
    "title": "Check for ordered/time-series data",
    "content": "For sequential data (time series, sensor readings), **forward-fill** (propagate last known value) or **backward-fill** preserves temporal structure better than a global statistic."
  },
  {
    "title": "Consider feature relationships (MAR case)",
    "content": "If missingness correlates with other features, imputing the column mean ignores that relationship. KNN or regression imputation leverages other columns to make a smarter estimate — but that's beyond this lesson's NumPy scope."
  }
] }
\`\`\`

Now let's implement all three strategies in pure NumPy:

\`\`\`playground
{ "title": "Mean, Median, and Forward-Fill Imputation", "language": "python", "code": "import numpy as np\\n\\ndata = np.array([\\n    [25.0, 50000.0,  3.0],\\n    [30.0,    np.nan,  5.0],\\n    [np.nan, 75000.0,  8.0],\\n    [45.0, 90000.0, np.nan],\\n    [22.0,    np.nan,  1.0],\\n    [35.0, 65000.0,  7.0],\\n])\\n\\n# ── 1. Mean imputation ──────────────────────────────────────────\\ndef mean_impute(X):\\n    result = X.copy()\\n    for col in range(X.shape[1]):\\n        col_mean = np.nanmean(X[:, col])\\n        mask = np.isnan(X[:, col])\\n        result[mask, col] = col_mean\\n    return result\\n\\n# ── 2. Median imputation ────────────────────────────────────────\\ndef median_impute(X):\\n    result = X.copy()\\n    for col in range(X.shape[1]):\\n        col_median = np.nanmedian(X[:, col])\\n        mask = np.isnan(X[:, col])\\n        result[mask, col] = col_median\\n    return result\\n\\n# ── 3. Forward-fill (for ordered/sequential data) ───────────────\\ndef forward_fill(X):\\n    result = X.copy()\\n    for col in range(X.shape[1]):\\n        for row in range(1, X.shape[0]):\\n            if np.isnan(result[row, col]):\\n                result[row, col] = result[row - 1, col]  # carry forward\\n    return result\\n\\nprint(\\"Original data (NaN shown as nan):\\")\\nprint(data)\\n\\nprint(\\"\\\\nAfter mean imputation:\\")\\nprint(mean_impute(data).round(1))\\n\\nprint(\\"\\\\nAfter median imputation:\\")\\nprint(median_impute(data).round(1))\\n\\nprint(\\"\\\\nAfter forward-fill:\\")\\nprint(forward_fill(data))", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Mean Imputation Shrinks Variance", "content": "Every missing value replaced with the mean is a new data point sitting exactly at the center of the distribution. If 20% of your values are missing, mean imputation artificially reduces the variance of that feature — your model will underestimate uncertainty in that column. For high missingness, prefer more sophisticated strategies." }
\`\`\`

Let's trace through forward-fill step by step so the algorithm is crystal clear:

\`\`\`trace
{ "title": "Forward-Fill Trace (income column)", "language": "python", "code": "col = [50000.0, np.nan, 75000.0, 90000.0, np.nan, 65000.0]\\nresult = col.copy()\\nfor row in range(1, len(col)):\\n    if np.isnan(result[row]):\\n        result[row] = result[row - 1]\\nprint(result)", "frames": [
  { "line": 3, "vars": { "row": 1, "result[1]": "nan", "result[0]": 50000 }, "note": "row=1 is NaN → copy result[0]=50000", "stdout": "" },
  { "line": 3, "vars": { "row": 2, "result[2]": 75000, "result[1]": 50000 }, "note": "row=2 is 75000 (not NaN) → skip", "stdout": "" },
  { "line": 3, "vars": { "row": 3, "result[3]": 90000 }, "note": "row=3 is 90000 → skip", "stdout": "" },
  { "line": 3, "vars": { "row": 4, "result[4]": "nan", "result[3]": 90000 }, "note": "row=4 is NaN → copy result[3]=90000", "stdout": "" },
  { "line": 3, "vars": { "row": 5, "result[5]": 65000 }, "note": "row=5 is 65000 → skip. Done.", "stdout": "" },
  { "line": 5, "vars": { "result": "[50000, 50000, 75000, 90000, 90000, 65000]" }, "note": "Final array — gaps filled by carrying the last known value forward", "stdout": "[50000.0, 50000.0, 75000.0, 90000.0, 90000.0, 65000.0]" }
], "speed": 900 }
\`\`\`

---

## Part 2 — Outlier Detection

Outliers are data points that sit far from the rest of the distribution. The challenge: *should you remove them, impute them, or keep them?* That depends on whether they represent measurement errors or genuine extreme events — think fraudulent credit card transactions or once-in-a-century storm readings.

\`\`\`concept
{ "title": "Outliers Are Not Always Enemies", "variant": "insight", "content": "In fraud detection, the outliers ARE the signal. A transaction of $15,000 from an account that usually spends $50/day isn't noise — it is exactly what you are trying to find. Blindly removing all statistical outliers in a fraud dataset would delete your most informative training examples. Always ask: is this an error, or is this a rare but real event?" }
\`\`\`

### Method 1 — Interquartile Range (IQR)

IQR measures the spread of the middle 50% of your data. The standard fences are:

- **Lower fence:** Q1 − 1.5 × IQR
- **Upper fence:** Q3 + 1.5 × IQR

Any point outside these fences is flagged as an outlier. IQR is **robust** — it ignores the extremes when computing the fences, so outliers don't inflate the threshold.

\`\`\`algoviz
{ "title": "IQR Outlier Detection — Sorted Array", "type": "array", "data": [12, 15, 18, 19, 21, 22, 24, 25, 26, 28, 95], "frames": [
  { "highlight": [0, 1, 2, 3, 4], "label": "Q1 region: lower 25% of data. Q1 = 18.5", "stats": { "Q1": 18.5 } },
  { "highlight": [5, 6, 7, 8, 9, 10], "label": "Q3 region: upper 25% of data. Q3 = 26.5", "stats": { "Q1": 18.5, "Q3": 26.5 } },
  { "highlight": [], "label": "IQR = Q3 - Q1 = 8.0. Fences: lower=5.5, upper=38.5", "stats": { "IQR": 8.0, "lower_fence": 5.5, "upper_fence": 38.5 } },
  { "highlight": [10], "label": "95 > upper fence (38.5) → OUTLIER flagged!", "stats": { "outlier_index": 10, "value": 95 } }
], "speed": 900 }
\`\`\`

### Method 2 — Z-Score

The z-score measures how many standard deviations a value sits from the mean:

**z = (x − μ) / σ**

Points with |z| > 3 are conventionally flagged as outliers (they sit beyond 3 standard deviations — a ~0.3% probability under a normal distribution). Z-scores are fast to compute but **sensitive to the outliers themselves** — a single extreme value shifts the mean and inflates σ, potentially masking other outliers.

\`\`\`playground
{ "title": "IQR and Z-Score Outlier Detection", "language": "python", "code": "import numpy as np\\n\\n# Simulated house prices (in $1000s) — two obvious outliers\\nprices = np.array([210, 220, 215, 200, 225, 218, 212, 208, 5, 230, 219, 1500, 222, 205])\\n\\n# ── IQR Method ──────────────────────────────────────────────────\\ndef iqr_outliers(x, k=1.5):\\n    q1 = np.percentile(x, 25)\\n    q3 = np.percentile(x, 75)\\n    iqr = q3 - q1\\n    lower = q1 - k * iqr\\n    upper = q3 + k * iqr\\n    mask = (x < lower) | (x > upper)\\n    return mask, lower, upper\\n\\n# ── Z-Score Method ──────────────────────────────────────────────\\ndef zscore_outliers(x, threshold=3.0):\\n    mean = np.mean(x)\\n    std  = np.std(x)\\n    zscores = np.abs((x - mean) / std)\\n    mask = zscores > threshold\\n    return mask, zscores\\n\\niqr_mask, lo, hi   = iqr_outliers(prices)\\nz_mask, zscores    = zscore_outliers(prices)\\n\\nprint(f\\"IQR fences: [{lo:.1f}, {hi:.1f}]\\")\\nprint(f\\"IQR outliers (indices): {np.where(iqr_mask)[0]} → values: {prices[iqr_mask]}\\")\\n\\nprint(f\\"\\\\nZ-score outliers (indices): {np.where(z_mask)[0]} → values: {prices[z_mask]}\\")\\nprint(f\\"Z-scores for all points:\\\\n{np.round(zscores, 2)}\\")\\n\\n# ── After detection: three choices ──────────────────────────────\\n# 1. Remove rows\\nclean_iqr = prices[~iqr_mask]\\nprint(f\\"\\\\nAfter IQR removal: {len(clean_iqr)} rows remain (was {len(prices)})\\")\\n\\n# 2. Clip to fence boundaries (winsorizing)\\nclipped = np.clip(prices, lo, hi)\\nprint(f\\"After clipping: {clipped}\\")", "runnable": true }
\`\`\`

### Comparing Imputation: Before and After

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Raw data with NaN and outlier", "code": "prices = [210, 220, NaN, 200, 1500, 218, NaN, 208]\\n\\nmean = 509.3   # Severely inflated by 1500\\nstd  = 450.1   # Blown out by outlier\\n\\n# Model trained on this:\\n# - Missing rows skipped entirely\\n# - $1500 outlier distorts regression line\\n# - Mean/variance useless for normalization" }, "after": { "label": "Cleaned: outlier clipped, NaN median-imputed", "code": "# Step 1: clip outlier (IQR upper fence = 231)\\nprices_clipped = np.clip(prices, 0, 231)\\n# [210, 220, NaN, 200, 231, 218, NaN, 208]\\n\\n# Step 2: median-impute remaining NaN\\nmedian = np.nanmedian(prices_clipped)  # 215\\nprices_clean = median_impute(prices_clipped)\\n# [210, 220, 215, 200, 231, 218, 215, 208]\\n\\nmean = 214.6   # Sensible\\nstd  =  9.2    # Reflects true spread" } }
\`\`\`

---

## Practice

\`\`\`fillblank
{ "title": "Implement IQR Outlier Detection", "prompt": "Complete the function that returns a boolean mask marking outliers using the IQR method with a multiplier k.", "language": "python", "template": "import numpy as np\\n\\ndef iqr_mask(x, k=1.5):\\n    q1 = np.percentile(x, ___)\\n    q3 = np.percentile(x, ___)\\n    iqr = q3 - q1\\n    lower = q1 - ___ * iqr\\n    upper = q3 + ___ * iqr\\n    return (x < lower) | (x > upper)\\n\\ndata = np.array([10, 12, 11, 13, 10, 12, 100])\\nprint(iqr_mask(data))  # [False False False False False False True]", "blanks": [
  { "answer": "25", "hint": "Q1 is the 25th percentile" },
  { "answer": "75", "hint": "Q3 is the 75th percentile" },
  { "answer": "k", "hint": "Subtract k multiples of IQR from Q1" },
  { "answer": "k", "hint": "Add k multiples of IQR to Q3" }
] }
\`\`\`

---

\`\`\`collapse
{ "title": "Deep Dive: Why IQR Beats Z-Score for Skewed Data", "content": "Z-score assumes your data is roughly normally distributed. When a distribution is heavily right-skewed (e.g., income, transaction amounts), the mean gets pulled toward the tail and the standard deviation inflates — both influenced by the very outliers you're trying to flag.\\n\\n**Example:** Suppose you have 100 salaries between $40k–$120k and one CEO salary of $5M.\\n\\n- Z-score: μ ≈ $89k, σ ≈ $488k (inflated). The CEO's z-score is only ~10 — but so would be many legitimate high salaries near $1M. You might also fail to flag moderate outliers because σ is so large.\\n- IQR: Q1 ≈ $55k, Q3 ≈ $95k, IQR ≈ $40k. Upper fence ≈ $155k. The CEO's $5M and any salary above $155k gets cleanly flagged, unaffected by the extreme value itself.\\n\\n**Rule of thumb:** Use IQR for skewed distributions or when you suspect heavy tails. Use Z-score as a quick sanity check for roughly normal data, or when you need a probabilistic interpretation." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Missing Values and Outliers", "questions": [
  {
    "question": "A clinical trial collects patient blood pressure, but patients with very high BP tend to drop out and not report their next reading. What type of missingness is this?",
    "options": [
      "Missing Completely at Random (MCAR)",
      "Missing at Random (MAR)",
      "Missing Not at Random (MNAR)",
      "Structural missingness"
    ],
    "answer": 2,
    "explanation": "The probability of the value being missing depends on the value itself (high BP → not reported). This is MNAR — the hardest case to handle, because simple imputation will systematically underestimate blood pressure in the dataset."
  },
  {
    "question": "You are preprocessing a dataset of house prices for linear regression. The 'price' column has a strong right skew. A colleague suggests replacing NaN values with the column mean. What is the key problem with this approach?",
    "options": [
      "Mean imputation is not supported in NumPy",
      "The mean is skewed by extreme values and will overestimate a typical price, introducing bias",
      "Mean imputation only works for normally distributed data and will crash otherwise",
      "It increases the variance of the feature artificially"
    ],
    "answer": 1,
    "explanation": "For skewed distributions, the mean is pulled toward the tail. Median imputation is more appropriate because the median is robust to extreme values — it represents the 'typical' house price regardless of a few $10M mansions in the dataset."
  },
  {
    "question": "Which statement about IQR-based outlier detection is TRUE?",
    "options": [
      "The IQR is computed as Q3 + Q1",
      "IQR fences are typically set at Q1 ± 1.5×IQR and Q3 ± 1.5×IQR",
      "IQR is more sensitive to outliers than z-score because it uses the full range",
      "The IQR upper fence is Q3 − 1.5×IQR"
    ],
    "answer": 1,
    "explanation": "IQR = Q3 − Q1. The lower fence is Q1 − 1.5×IQR and the upper fence is Q3 + 1.5×IQR. IQR is actually MORE robust than z-score because it only uses the middle 50% of the data — extreme values cannot inflate the fence thresholds."
  },
  {
    "question": "A data scientist is building a fraud detection model and removes all statistical outliers before training. What is the likely consequence?",
    "options": [
      "The model will generalize better because noisy data is removed",
      "Training will be faster with fewer data points",
      "The model may miss the very transactions it should flag, since fraud cases are the outliers",
      "Precision will increase while recall stays the same"
    ],
    "answer": 2,
    "explanation": "In fraud detection, outliers are the signal, not noise. Fraudulent transactions are statistically anomalous by definition — large amounts, unusual merchants, odd hours. Removing outliers blindly deletes exactly the positive-class examples the model needs to learn from."
  },
  {
    "question": "When is forward-fill imputation the most appropriate strategy?",
    "options": [
      "When the column has a symmetric bell-curve distribution",
      "When the data is ordered in time and the last known value is a reasonable estimate for gaps",
      "When more than 50% of values are missing",
      "When the missingness mechanism is MNAR"
    ],
    "answer": 1,
    "explanation": "Forward-fill works by propagating the last observed value into subsequent missing positions. This makes sense for time-series data — e.g., a sensor reading that drops out for 3 minutes likely stayed near its last recorded value. It would be inappropriate for unordered tabular data where row order is arbitrary."
  }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Missing values fall into three types (MCAR, MAR, MNAR) — the type determines the right imputation strategy, and confusing them leads to biased models.",
  "Use mean imputation for symmetric distributions, median imputation for skewed ones (median is robust to outliers), and forward-fill for time-ordered sequential data.",
  "IQR detects outliers using Q1 − 1.5×IQR and Q3 + 1.5×IQR as fences — it is robust because the computation ignores the extremes. Z-score (|z| > 3) is faster but sensitive to the very outliers it tries to flag.",
  "Outliers are not always errors: in fraud detection and anomaly detection, the outliers ARE the target class. Always ask whether an outlier is a measurement error or a rare but genuine event before removing it.",
  "There is no universal best technique — the right approach depends on your distribution, missingness percentage, missingness mechanism, and the downstream ML algorithm's sensitivity to outliers."
] }
\`\`\``,
      starterCode: `import pandas as pd
import numpy as np
from scipy import stats

# Sample dataset with missing values and outliers
data = {
    'age': [25, 30, np.nan, 35, 200, 28, np.nan, 32, 29, 31],
    'salary': [50000, 60000, 55000, np.nan, 58000, 62000, 54000, np.nan, 59000, 57000],
    'score': [85, 90, 78, 92, 88, np.nan, 95, 82, np.nan, 89]
}
df = pd.DataFrame(data)

print("Original DataFrame:")
print(df)
print()

# TODO 1: Detect missing values
# Count the number of NaNs in each column and print the result
missing_counts = None  # replace with your code
print("Missing value counts:")
print(missing_counts)
print()

# TODO 2: Detect outliers in 'age' using IQR
# Calculate Q1, Q3, and IQR for the 'age' column (drop NaNs first)
# An outlier is any value below (Q1 - 1.5*IQR) or above (Q3 + 1.5*IQR)
age_clean = df['age'].dropna()
Q1 = None  # 25th percentile
Q3 = None  # 75th percentile
IQR = None  # interquartile range
lower_bound = None
upper_bound = None
age_outliers = None  # boolean mask for outliers in age_clean
print("Age outliers (IQR method):")
print(age_outliers[age_outliers] if age_outliers is not None else "Not implemented")
print()

# TODO 3: Detect outliers in 'salary' using z-scores
# Calculate z-scores for the 'salary' column (drop NaNs first)
# Values with |z-score| > 2 are considered outliers
salary_clean = df['salary'].dropna()
z_scores = None  # use stats.zscore()
salary_outliers = None  # boolean mask where |z| > 2
print("Salary outliers (z-score method):")
print(salary_clean[salary_outliers] if salary_outliers is not None else "Not implemented")
print()

# TODO 4: Impute missing values in 'age' with the MEAN
# Fill NaNs in the 'age' column with the column mean (use a copy of df)
df_mean = df.copy()
df_mean['age'] = None  # replace with your code
print("Age after mean imputation:")
print(df_mean['age'].tolist())
print()

# TODO 5: Impute missing values in 'salary' with the MEDIAN
# Fill NaNs in the 'salary' column with the column median
df_median = df.copy()
df_median['salary'] = None  # replace with your code
print("Salary after median imputation:")
print(df_median['salary'].tolist())
print()

# TODO 6: Impute missing values in 'score' using FORWARD FILL
# Forward-fill fills a NaN with the previous non-null value
df_ffill = df.copy()
df_ffill['score'] = None  # replace with your code
print("Score after forward-fill imputation:")
print(df_ffill['score'].tolist())
`,
      solutionCode: `import pandas as pd
import numpy as np
from scipy import stats

# Sample dataset with missing values and outliers
data = {
    'age': [25, 30, np.nan, 35, 200, 28, np.nan, 32, 29, 31],
    'salary': [50000, 60000, 55000, np.nan, 58000, 62000, 54000, np.nan, 59000, 57000],
    'score': [85, 90, 78, 92, 88, np.nan, 95, 82, np.nan, 89]
}
df = pd.DataFrame(data)

print("Original DataFrame:")
print(df)
print()

# 1. Detect missing values — isnull().sum() counts NaNs per column
missing_counts = df.isnull().sum()
print("Missing value counts:")
print(missing_counts)
print()

# 2. Detect outliers in 'age' using IQR
# Drop NaNs so they don't interfere with percentile calculations
age_clean = df['age'].dropna()
Q1 = age_clean.quantile(0.25)       # 25th percentile
Q3 = age_clean.quantile(0.75)       # 75th percentile
IQR = Q3 - Q1                       # interquartile range
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR
age_outliers = (age_clean < lower_bound) | (age_clean > upper_bound)
print("Age outliers (IQR method):")
print(age_clean[age_outliers])      # prints 200 — clearly an outlier
print()

# 3. Detect outliers in 'salary' using z-scores
# z-score = (value - mean) / std; large |z| means far from the mean
salary_clean = df['salary'].dropna()
z_scores = np.abs(stats.zscore(salary_clean))
salary_outliers = z_scores > 2      # threshold: 2 standard deviations
print("Salary outliers (z-score method):")
print(salary_clean[salary_outliers])
print()

# 4. Impute missing 'age' values with the column MEAN
# Mean imputation is simple but sensitive to outliers
df_mean = df.copy()
df_mean['age'] = df_mean['age'].fillna(df_mean['age'].mean())
print("Age after mean imputation:")
print(df_mean['age'].tolist())
print()

# 5. Impute missing 'salary' values with the column MEDIAN
# Median imputation is more robust when outliers are present
df_median = df.copy()
df_median['salary'] = df_median['salary'].fillna(df_median['salary'].median())
print("Salary after median imputation:")
print(df_median['salary'].tolist())
print()

# 6. Impute missing 'score' values using FORWARD FILL (ffill)
# ffill propagates the last valid observation forward — useful for time-series
df_ffill = df.copy()
df_ffill['score'] = df_ffill['score'].ffill()
print("Score after forward-fill imputation:")
print(df_ffill['score'].tolist())
`,
    },
    {
      id: "feature-scaling",
      slug: "feature-scaling",
      title: "Feature Scaling: Normalization vs Standardization",
      content: `# Feature Scaling: Normalization vs Standardization

Raw datasets are messy — one feature might measure salary in the hundreds of thousands while another measures age in the tens. Feed both directly into a gradient-descent algorithm and the large-scale feature will dominate every weight update, leaving the smaller-scale feature effectively ignored. Feature scaling fixes this by bringing every feature onto a comparable range before training begins.

In this lesson you'll implement both major scaling techniques — **min-max normalization** and **z-score standardization** — from scratch using only NumPy, understand the mathematics behind each, and develop intuition for when to reach for one versus the other.

\`\`\`concept
{ "title": "Feature Scaling", "variant": "mental-model", "content": "Feature scaling is the process of transforming each numerical feature so its values occupy a comparable range. The model's learning algorithm then treats each feature as an equal participant rather than letting large-magnitude features dominate the loss landscape." }
\`\`\`

---

## Why Scaling Matters

Consider a dataset with two features:

| Sample | Age | Annual Salary ($) |
|--------|-----|-------------------|
| A | 25 | 40,000 |
| B | 55 | 120,000 |
| C | 35 | 85,000 |

Without scaling, the salary column has values ~2,000× larger than age. During gradient descent, the model adjusts weights proportionally to the gradient magnitude — which is dominated by salary. Age's weight barely moves, even if age is genuinely informative.

\`\`\`concept
{ "title": "The Steepest-Slope Problem", "variant": "analogy", "content": "Imagine rolling a marble down a bowl that is stretched 2,000× wider in one direction than the other. The marble shoots sideways along the narrow axis and barely moves in the wide direction. Scaling transforms the bowl into a sphere — the marble rolls straight to the bottom (global minimum) in far fewer steps." }
\`\`\`

---

## Min-Max Normalization

Min-max normalization rescales each feature to a fixed interval, typically **[0, 1]**.

### The Formula

$$x_{norm} = \\frac{x - x_{min}}{x_{max} - x_{min}}$$

- The minimum value maps to **0**
- The maximum value maps to **1**
- Every other value falls linearly in between

The transformation preserves the shape of the original distribution — if your data was right-skewed before, it stays right-skewed after.

\`\`\`trace
{ "title": "Tracing Min-Max Normalization on [10, 20, 30, 40, 50]", "language": "python", "code": "import numpy as np\\n\\nx = np.array([10, 20, 30, 40, 50])\\nx_min = x.min()\\nx_max = x.max()\\n\\nx_norm = (x - x_min) / (x_max - x_min)\\nprint(x_norm)", "frames": [ { "line": 3, "vars": { "x": "[10,20,30,40,50]" }, "note": "Raw feature values", "stdout": "" }, { "line": 4, "vars": { "x": "[10,20,30,40,50]", "x_min": 10 }, "note": "Find the minimum value", "stdout": "" }, { "line": 5, "vars": { "x": "[10,20,30,40,50]", "x_min": 10, "x_max": 50 }, "note": "Find the maximum value", "stdout": "" }, { "line": 7, "vars": { "x": "[10,20,30,40,50]", "x_min": 10, "x_max": 50, "x_norm": "[0.0, 0.25, 0.5, 0.75, 1.0]" }, "note": "Each value shifted by min, divided by range", "stdout": "" }, { "line": 8, "vars": { "x_norm": "[0.0, 0.25, 0.5, 0.75, 1.0]" }, "note": "Result: evenly spaced in [0, 1]", "stdout": "[0.   0.25 0.5  0.75 1.  ]" } ], "speed": 900 }
\`\`\`

\`\`\`algoviz
{ "title": "Min-Max: Values map linearly into [0, 1]", "type": "array", "data": [10, 20, 30, 40, 50], "frames": [ { "highlight": [], "label": "Original values: range is 10 → 50", "stats": { "min": 10, "max": 50 } }, { "highlight": [0], "label": "10 → (10-10)/(50-10) = 0.00", "stats": { "scaled": 0.0 } }, { "highlight": [1], "label": "20 → (20-10)/(50-10) = 0.25", "stats": { "scaled": 0.25 } }, { "highlight": [2], "label": "30 → (30-10)/(50-10) = 0.50", "stats": { "scaled": 0.5 } }, { "highlight": [3], "label": "40 → (40-10)/(50-10) = 0.75", "stats": { "scaled": 0.75 } }, { "highlight": [4], "label": "50 → (50-10)/(50-10) = 1.00", "stats": { "scaled": 1.0 } } ], "speed": 800 }
\`\`\`

---

## Z-Score Standardization

Z-score standardization (also called **standard scaling**) transforms features so they have a **mean of 0** and a **standard deviation of 1**.

### The Formula

$$x_{std} = \\frac{x - \\mu}{\\sigma}$$

where μ is the feature mean and σ is the feature standard deviation.

- Values above the mean become positive
- Values below the mean become negative
- The resulting distribution is centered at 0 with unit variance

Unlike normalization, standardization does **not** bound values to a fixed interval — outliers will still produce large positive or negative z-scores, but the bulk of the data clusters near 0.

\`\`\`trace
{ "title": "Tracing Z-Score Standardization on [10, 20, 30, 40, 50]", "language": "python", "code": "import numpy as np\\n\\nx = np.array([10, 20, 30, 40, 50])\\nmean = x.mean()\\nstd = x.std()\\n\\nx_std = (x - mean) / std\\nprint(x_std)", "frames": [ { "line": 3, "vars": { "x": "[10,20,30,40,50]" }, "note": "Raw feature values", "stdout": "" }, { "line": 4, "vars": { "x": "[10,20,30,40,50]", "mean": 30.0 }, "note": "Mean = (10+20+30+40+50)/5 = 30", "stdout": "" }, { "line": 5, "vars": { "x": "[10,20,30,40,50]", "mean": 30.0, "std": 14.14 }, "note": "Std deviation ≈ 14.14", "stdout": "" }, { "line": 7, "vars": { "x": "[10,20,30,40,50]", "mean": 30.0, "std": 14.14, "x_std": "[-1.41,-0.71, 0.0, 0.71, 1.41]" }, "note": "Each value: subtract mean, divide by std", "stdout": "" }, { "line": 8, "vars": { "x_std": "[-1.41,-0.71, 0.0, 0.71, 1.41]" }, "note": "Result: centered at 0, unit std dev", "stdout": "[-1.41 -0.71  0.    0.71  1.41]" } ], "speed": 900 }
\`\`\`

---

## Normalization vs Standardization Side-by-Side

\`\`\`tabs
{ "tabs": [ { "label": "Min-Max Normalization", "icon": "📏", "content": "**Formula:** \`x_norm = (x - x_min) / (x_max - x_min)\`\\n\\n**Output range:** Always [0, 1] (or any [a, b] if you rescale)\\n\\n**What it preserves:** Relative distances between values\\n\\n**What it does NOT preserve:** Outlier impact (an extreme value compresses everything else)\\n\\n**Best for:**\\n- Neural networks with sigmoid/tanh activations (expect inputs near 0–1)\\n- Image pixel data (naturally bounded 0–255)\\n- Distance-based algorithms (KNN, K-Means) when you want equal range contributions\\n- When you know your data has hard boundaries\\n\\n**Weakness:** Sensitive to outliers — one extreme value can squash all others into a narrow band." }, { "label": "Z-Score Standardization", "icon": "📊", "content": "**Formula:** \`x_std = (x - mean) / std\`\\n\\n**Output range:** Unbounded — depends on the data's spread\\n\\n**What it preserves:** Relative position in the distribution (z-score = how many std devs from mean)\\n\\n**What it does NOT preserve:** Bounded range\\n\\n**Best for:**\\n- Linear regression and logistic regression (assumes features are on similar scale)\\n- PCA (needs zero-mean features to work correctly)\\n- SVMs with RBF kernel\\n- When data is approximately Gaussian\\n- When outliers are informative and should be preserved\\n\\n**Weakness:** Output is unbounded — algorithms expecting [0,1] inputs may behave unexpectedly." }, { "label": "Quick Decision Guide", "icon": "🧭", "content": "| Situation | Recommended Scaling |\\n|-----------|--------------------|\\n| Neural network with sigmoid/tanh | Min-Max → [0, 1] |\\n| Linear or logistic regression | Z-Score |\\n| PCA or LDA | Z-Score |\\n| KNN / K-Means | Either (min-max common) |\\n| Image pixel values | Min-Max (divide by 255) |\\n| Data with significant outliers | Z-Score (outliers shrink less) |\\n| Data with hard natural bounds | Min-Max |\\n| Algorithm assumes Gaussian features | Z-Score |\\n\\n**Rule of thumb:** When in doubt, start with z-score standardization. It is more robust to outliers and is the default in scikit-learn's \`StandardScaler\`." } ] }
\`\`\`

---

## Build Both Scalers from Scratch

Now implement both scalers as reusable NumPy classes. The pattern mirrors scikit-learn's \`fit\` / \`transform\` API — \`fit\` learns statistics from the training set, \`transform\` applies the scaling. This separation is critical: you must **never fit on test data**.

\`\`\`playground
{ "title": "MinMaxScaler and StandardScaler from Scratch", "language": "python", "runnable": true, "code": "import numpy as np\\n\\nclass MinMaxScaler:\\n    def fit(self, X):\\n        self.min_ = X.min(axis=0)\\n        self.max_ = X.max(axis=0)\\n        return self\\n\\n    def transform(self, X):\\n        return (X - self.min_) / (self.max_ - self.min_)\\n\\n    def fit_transform(self, X):\\n        return self.fit(X).transform(X)\\n\\n\\nclass StandardScaler:\\n    def fit(self, X):\\n        self.mean_ = X.mean(axis=0)\\n        self.std_ = X.std(axis=0)\\n        return self\\n\\n    def transform(self, X):\\n        return (X - self.mean_) / self.std_\\n\\n    def fit_transform(self, X):\\n        return self.fit(X).transform(X)\\n\\n\\n# --- Demo ---\\n# Dataset: [age, salary (in thousands)]\\nX_train = np.array([\\n    [25, 40],\\n    [35, 85],\\n    [45, 120],\\n    [55, 60],\\n    [30, 95],\\n])\\n\\nX_test = np.array([\\n    [28, 50],\\n    [50, 110],\\n])\\n\\nprint(\\"=== Min-Max Normalization ===\\")\\nmm = MinMaxScaler()\\nX_train_mm = mm.fit_transform(X_train)\\nX_test_mm  = mm.transform(X_test)        # Use stats from train only!\\nprint(\\"Train (scaled):\\\\n\\", X_train_mm.round(3))\\nprint(\\"Test  (scaled):\\\\n\\", X_test_mm.round(3))\\n\\nprint(\\"\\\\n=== Z-Score Standardization ===\\")\\nss = StandardScaler()\\nX_train_std = ss.fit_transform(X_train)\\nX_test_std  = ss.transform(X_test)\\nprint(\\"Train (scaled):\\\\n\\", X_train_std.round(3))\\nprint(\\"Test  (scaled):\\\\n\\", X_test_std.round(3))\\n\\nprint(\\"\\\\n=== Verification ===\\")\\nprint(f\\"Min-Max train column mins:  {X_train_mm.min(axis=0)}\\")\\nprint(f\\"Min-Max train column maxes: {X_train_mm.max(axis=0)}\\")\\nprint(f\\"Z-Score train column means: {X_train_std.mean(axis=0).round(10)}\\")\\nprint(f\\"Z-Score train column stds:  {X_train_std.std(axis=0).round(10)}\\")\\n" }
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "Never Fit on Test Data", "content": "Always call \`scaler.fit()\` on **training data only**, then \`scaler.transform()\` on both train and test sets. If you fit on the test set (or the combined dataset), you introduce **data leakage** — your model implicitly 'sees' test statistics during training. In production, the test set represents unseen future data, so its statistics are unknowable at training time." }
\`\`\`

---

## The Data Leakage Trap

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Data Leakage (Wrong)", "code": "# BAD: fitting on ALL data before splitting\\nscaler = StandardScaler()\\nX_all_scaled = scaler.fit_transform(X_all)   # Leaks test stats!\\n\\nX_train, X_test = train_test_split(X_all_scaled)" }, "after": { "label": "Correct Pipeline", "code": "# GOOD: split first, fit only on train\\nX_train, X_test = train_test_split(X_all)\\n\\nscaler = StandardScaler()\\nX_train_scaled = scaler.fit_transform(X_train)  # Fit on train only\\nX_test_scaled  = scaler.transform(X_test)        # Apply train stats to test" } }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Implement Z-Score Standardization", "prompt": "Complete the StandardScaler's fit and transform methods. fit() should compute and store the mean and standard deviation. transform() should apply the z-score formula.", "language": "python", "template": "import numpy as np\\n\\nclass StandardScaler:\\n    def fit(self, X):\\n        self.mean_ = X.mean(___)\\n        self.std_  = X.std(___)\\n        return self\\n\\n    def transform(self, X):\\n        return (X - ___) / ___", "blanks": [ { "answer": "axis=0", "hint": "We want per-column statistics, not a single scalar. axis=0 reduces along rows." }, { "answer": "axis=0", "hint": "Same axis as mean — standard deviation per column." }, { "answer": "self.mean_", "hint": "Subtract the mean learned during fit()." }, { "answer": "self.std_", "hint": "Divide by the standard deviation learned during fit()." } ] }
\`\`\`

---

## Handling Edge Cases

What happens if a feature has zero variance — every value is identical? The standard deviation is 0, and division by zero produces \`nan\`.

\`\`\`collapse
{ "title": "Deep Dive: Robust Scalers for Zero-Variance and Outlier-Heavy Data", "content": "### Zero-Variance Features\\n\\nIf \`std_ == 0\`, the feature carries no information — every sample has the same value. The safest approach:\\n\\n\`\`\`python\\ndef transform(self, X):\\n    # Replace zero std with 1 to avoid division by zero\\n    safe_std = np.where(self.std_ == 0, 1.0, self.std_)\\n    return (X - self.mean_) / safe_std\\n\`\`\`\\n\\nAlternatively, drop zero-variance columns before scaling.\\n\\n### Outlier-Robust Scaling\\n\\nBoth min-max and z-score are sensitive to outliers in different ways:\\n- **Min-max**: one extreme value compresses all others into a tiny band\\n- **Z-score**: extreme values inflate σ, compressing non-outlier values\\n\\nA robust alternative uses the **median** and **IQR** (interquartile range):\\n\\n\`\`\`python\\nclass RobustScaler:\\n    def fit(self, X):\\n        self.median_ = np.median(X, axis=0)\\n        q75 = np.percentile(X, 75, axis=0)\\n        q25 = np.percentile(X, 25, axis=0)\\n        self.iqr_ = q75 - q25\\n        return self\\n\\n    def transform(self, X):\\n        return (X - self.median_) / self.iqr_\\n\`\`\`\\n\\nThe median and IQR ignore the top and bottom 25% of data entirely, making this scaler insensitive to extreme outliers.\\n\\n### When to Use Which\\n\\n| Scenario | Recommended |\\n|----------|-------------|\\n| Clean data, known bounds | MinMaxScaler |\\n| Clean data, unbounded | StandardScaler |\\n| Significant outliers | RobustScaler |\\n| Tree-based models (RF, GBM) | No scaling needed |\\n" }
\`\`\`

---

## Putting It All Together

\`\`\`playground
{ "title": "Compare Both Scalers on a Dataset with an Outlier", "language": "python", "runnable": true, "code": "import numpy as np\\n\\n# Feature with one outlier\\ndata = np.array([[1], [2], [3], [4], [100]])  # 100 is an outlier\\n\\n# ---- Min-Max ----\\nmin_val = data.min()\\nmax_val = data.max()\\nmm_scaled = (data - min_val) / (max_val - min_val)\\n\\n# ---- Z-Score ----\\nmean_val = data.mean()\\nstd_val  = data.std()\\nss_scaled = (data - mean_val) / std_val\\n\\n# ---- Robust (median + IQR) ----\\nmedian_val = np.median(data)\\nq75 = np.percentile(data, 75)\\nq25 = np.percentile(data, 25)\\niqr = q75 - q25\\nrob_scaled = (data - median_val) / iqr\\n\\nprint(f\\"{'Value':>8} {'MinMax':>10} {'ZScore':>10} {'Robust':>10}\\")\\nprint(\\"-\\" * 42)\\nfor raw, mm, ss, rb in zip(data, mm_scaled, ss_scaled, rob_scaled):\\n    print(f\\"{raw[0]:>8} {mm[0]:>10.3f} {ss[0]:>10.3f} {rb[0]:>10.3f}\\")\\n\\nprint(\\"\\\\nKey insight:\\")\\nprint(f\\"Min-Max non-outlier range: {mm_scaled[:4].min():.3f} to {mm_scaled[:4].max():.3f}\\")\\nprint(f\\"ZScore  non-outlier range: {ss_scaled[:4].min():.3f} to {ss_scaled[:4].max():.3f}\\")\\nprint(f\\"Robust  non-outlier range: {rob_scaled[:4].min():.3f} to {rob_scaled[:4].max():.3f}\\")\\n" }
\`\`\`

Run this and observe: min-max squashes values 1–4 into a 0.00–0.03 band because of the outlier at 100. Z-score gives them slightly more breathing room (−0.97 to −0.88), but Robust scaling spreads them across −1.0 to 1.0 — preserving the meaningful variation in the bulk of the data.

---

## Quiz

\`\`\`quiz
{ "title": "Feature Scaling: Check Your Understanding", "questions": [ { "question": "You are training a K-Nearest Neighbors classifier on a dataset where one feature is 'age' (range 18–80) and another is 'income' (range 20,000–200,000). Which problem will occur if you do NOT scale the features?", "options": [ "The model will fail to compile and throw a runtime error", "KNN distance calculations will be dominated by the income feature, making age nearly irrelevant", "The model will automatically normalize features internally", "Age will dominate because it has a smaller range" ], "answer": 1, "explanation": "KNN computes Euclidean distance between samples. A difference of 1 year in age contributes 1² = 1 to the squared distance. A difference of $1,000 in income contributes 1,000,000 to the squared distance. Income completely swamps age in the calculation." }, { "question": "You train a StandardScaler on your training set (mean=50, std=10). Your test set has a value of 80. What is the correct z-score for this test value?", "options": [ "Recompute mean and std on the test set, then scale", "Use train mean and std: (80 - 50) / 10 = 3.0", "Use test mean and std to keep test values between -3 and 3", "(80 - 80) / test_std = 0" ], "answer": 1, "explanation": "Always use training set statistics to transform both train and test data. Using test statistics would be data leakage. (80 - 50) / 10 = 3.0 — this test point is 3 standard deviations above the training mean." }, { "question": "A dataset has pixel values ranging from 0 to 255 (grayscale images). Which scaling approach is most natural for this data?", "options": [ "Z-score standardization, because neural networks prefer zero-mean inputs", "Min-max normalization to [0,1] by dividing each pixel by 255", "No scaling needed — pixel values are already well-behaved", "Robust scaling using median and IQR" ], "answer": 1, "explanation": "Pixel values have a known, hard boundary of [0, 255]. Min-max normalization (dividing by 255) is the standard approach, producing values in [0, 1]. This is exactly what most deep learning frameworks do internally." }, { "question": "You apply min-max normalization to training data with min=10 and max=90. A test sample has value 95 (outside the training range). What happens to the scaled value?", "options": [ "It gets clipped to 1.0 automatically", "It becomes (95 - 10) / (90 - 10) = 1.0625, slightly above 1", "The scaler raises an error and rejects the value", "It gets scaled to 0 since it is an outlier" ], "answer": 1, "explanation": "Min-max normalization does NOT clip values — it applies the formula using training statistics. A value outside the training range produces a result outside [0, 1]. This is why min-max is sensitive to outliers and unseen extreme values, and why StandardScaler is often more robust for real-world data." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Feature scaling prevents large-magnitude features from dominating gradient-based learning algorithms like linear regression, logistic regression, and neural networks.", "Min-max normalization (x_norm = (x - min) / (max - min)) maps values to [0, 1] and is ideal for bounded data like image pixels and neural nets with sigmoid/tanh activations.", "Z-score standardization (x_std = (x - mean) / std) centers data at 0 with unit variance and is preferred for linear models, PCA, and data with outliers.", "Always fit your scaler on training data only, then apply it to both train and test sets — fitting on test data is data leakage.", "Tree-based models (Random Forest, Gradient Boosting) are invariant to monotone transformations and generally do not require feature scaling." ] }
\`\`\``,
      starterCode: `# Feature Scaling: Normalization vs Standardization
# Implement both scaling techniques from scratch

import math

# Sample dataset: house prices features
# [size_sqft, num_rooms, age_years]
data = [
    [1500, 3, 10],
    [2200, 4, 5],
    [800,  2, 30],
    [3100, 5, 2],
    [1200, 3, 15],
]


def get_column(data, col_index):
    """Extract a single feature column from the dataset."""
    return [row[col_index] for row in data]


def min_max_normalize(data):
    """
    Apply min-max normalization to each feature column.
    Formula: x_scaled = (x - x_min) / (x_max - x_min)
    Result: all values scaled to [0, 1]
    """
    num_features = len(data[0])
    scaled = []

    for row in data:
        scaled_row = []
        for col in range(num_features):
            column = get_column(data, col)

            # TODO: compute the minimum value of this column
            col_min = None

            # TODO: compute the maximum value of this column
            col_max = None

            # TODO: apply the min-max formula to row[col]
            # Hint: (x - col_min) / (col_max - col_min)
            scaled_value = None

            scaled_row.append(round(scaled_value, 4))
        scaled.append(scaled_row)

    return scaled


def z_score_standardize(data):
    """
    Apply z-score standardization to each feature column.
    Formula: x_scaled = (x - mean) / std_dev
    Result: each feature has mean=0 and std_dev=1
    """
    num_features = len(data[0])
    scaled = []

    for row in data:
        scaled_row = []
        for col in range(num_features):
            column = get_column(data, col)

            # TODO: compute the mean of this column
            # Hint: sum(column) / len(column)
            mean = None

            # TODO: compute the standard deviation of this column
            # Hint: math.sqrt( sum((x - mean)**2 for x in column) / len(column) )
            std_dev = None

            # TODO: apply the z-score formula to row[col]
            # Hint: (x - mean) / std_dev
            scaled_value = None

            scaled_row.append(round(scaled_value, 4))
        scaled.append(scaled_row)

    return scaled


# --- Run and compare ---
print("Original data (size, rooms, age):")
for row in data:
    print(" ", row)

print("\\nMin-Max Normalized [0, 1]:")
for row in min_max_normalize(data):
    print(" ", row)

print("\\nZ-Score Standardized (mean=0, std=1):")
for row in z_score_standardize(data):
    print(" ", row)

# TODO (reflection): Which method would you choose if the dataset
# contained outliers like a 10,000 sqft mansion? Why?
`,
      solutionCode: `# Feature Scaling: Normalization vs Standardization
# Complete solution with both scaling techniques

import math

# Sample dataset: house price features
# [size_sqft, num_rooms, age_years]
data = [
    [1500, 3, 10],
    [2200, 4, 5],
    [800,  2, 30],
    [3100, 5, 2],
    [1200, 3, 15],
]


def get_column(data, col_index):
    """Extract a single feature column from the dataset."""
    return [row[col_index] for row in data]


def min_max_normalize(data):
    """
    Min-max normalization scales every feature to [0, 1].

    Best when:
    - You know the data has a bounded range (e.g. pixel values 0-255)
    - The algorithm is sensitive to absolute scale (e.g. neural networks)
    - There are no extreme outliers (outliers compress all other values)

    Formula: x_scaled = (x - x_min) / (x_max - x_min)
    """
    num_features = len(data[0])
    scaled = []

    for row in data:
        scaled_row = []
        for col in range(num_features):
            column = get_column(data, col)

            col_min = min(column)
            col_max = max(column)

            # Scale this value into [0, 1]
            scaled_value = (row[col] - col_min) / (col_max - col_min)

            scaled_row.append(round(scaled_value, 4))
        scaled.append(scaled_row)

    return scaled


def z_score_standardize(data):
    """
    Z-score standardization transforms each feature so that
    it has mean = 0 and standard deviation = 1.

    Best when:
    - Data follows (approximately) a normal distribution
    - The algorithm assumes zero-centered features (e.g. SVM, PCA, logistic regression)
    - Outliers are present — z-score is more robust than min-max

    Formula: x_scaled = (x - mean) / std_dev
    """
    num_features = len(data[0])
    scaled = []

    for row in data:
        scaled_row = []
        for col in range(num_features):
            column = get_column(data, col)

            # Population mean
            mean = sum(column) / len(column)

            # Population standard deviation
            variance = sum((x - mean) ** 2 for x in column) / len(column)
            std_dev = math.sqrt(variance)

            # How many std deviations away from the mean?
            scaled_value = (row[col] - mean) / std_dev

            scaled_row.append(round(scaled_value, 4))
        scaled.append(scaled_row)

    return scaled


# --- Run and compare ---
print("Original data (size, rooms, age):")
for row in data:
    print(" ", row)

print("\\nMin-Max Normalized [0, 1]:")
for row in min_max_normalize(data):
    print(" ", row)

print("\\nZ-Score Standardized (mean=0, std=1):")
for row in z_score_standardize(data):
    print(" ", row)

# Reflection answer:
# With a 10,000 sqft outlier, min-max would squish all other size values
# near 0 because the range explodes. Z-score handles it better — the
# outlier becomes a large positive z-score, but the other values stay
# spread out relative to the mean.
`,
    },
    {
      id: "encoding-categoricals",
      slug: "encoding-categoricals",
      title: "Encoding Categorical Variables",
      content: `# Encoding Categorical Variables

Raw datasets are full of text: neighborhood names, product categories, education levels, animal species. Before any machine learning algorithm can process this data, you need to translate these labels into numbers — a process called **categorical encoding**.

In this lesson you'll build two fundamental encoders from scratch using only NumPy: **label encoding** and **one-hot encoding**. You'll also learn the single most important preprocessing rule that separates correct pipelines from broken ones: always fit your encoder on training data only.

---

\`\`\`concept
{
  "title": "Encoding Is Translation, Not Just Renaming",
  "variant": "mental-model",
  "content": "When you assign 'red'→0, 'green'→1, 'blue'→2, you haven't just renamed labels — you've made a mathematical claim. The number 2 is greater than 0. Does that mean blue > red? For a color column, absolutely not. Choosing the wrong encoding silently injects false relationships into your model, causing it to learn patterns that don't exist in the real world."
}
\`\`\`

---

## Ordinal vs Nominal: The Question You Must Ask First

Before encoding any column, ask one question: **does the order of categories carry real meaning?**

| Type | Definition | Example | Correct Encoding |
|---|---|---|---|
| **Ordinal** | Natural, meaningful order exists | Education: HS < BS < MS < PhD | Label Encoding |
| **Nominal** | No inherent order between categories | Color: Red, Blue, Green | One-Hot Encoding |

Getting this wrong is one of the most common preprocessing mistakes. Apply label encoding to a nominal column and your model may learn the spurious relationship \`blue(0) < green(1) < red(2)\` — a relationship you never intended.

---

## Method 1: Label Encoding

Label encoding replaces each unique category with an integer. It's simple, memory-efficient, and correct **only when** categories are ordinal.

The algorithm is three steps:
1. Extract all unique categories
2. Sort them for a deterministic mapping
3. Replace each label with its integer index

Watch the execution unfold:

\`\`\`trace
{
  "title": "Label Encoding Execution Trace",
  "language": "python",
  "code": "categories = ['cat', 'dog', 'bird', 'dog', 'cat']\\nunique = sorted(set(categories))\\nmapping = {v: i for i, v in enumerate(unique)}\\nencoded = [mapping[c] for c in categories]\\nprint(encoded)",
  "frames": [
    {
      "line": 1,
      "vars": {"categories": "['cat', 'dog', 'bird', 'dog', 'cat']"},
      "note": "Raw input: 5 labels with repetitions — dog and cat appear twice"
    },
    {
      "line": 2,
      "vars": {"categories": "['cat', 'dog', 'bird', 'dog', 'cat']", "unique": "['bird', 'cat', 'dog']"},
      "note": "set() removes duplicates; sorted() gives alphabetical order — deterministic across runs"
    },
    {
      "line": 3,
      "vars": {"unique": "['bird', 'cat', 'dog']", "mapping": "{'bird': 0, 'cat': 1, 'dog': 2}"},
      "note": "enumerate() yields (0,'bird'), (1,'cat'), (2,'dog') — swap to build label→int lookup"
    },
    {
      "line": 4,
      "vars": {"mapping": "{'bird': 0, 'cat': 1, 'dog': 2}", "encoded": "[1, 2, 0, 2, 1]"},
      "note": "Apply mapping to every element: cat→1, dog→2, bird→0, dog→2, cat→1"
    },
    {
      "line": 5,
      "vars": {"encoded": "[1, 2, 0, 2, 1]"},
      "note": "Integer array — any ML algorithm can now compute with this",
      "stdout": "[1, 2, 0, 2, 1]"
    }
  ],
  "speed": 800
}
\`\`\`

---

## Method 2: One-Hot Encoding

One-hot encoding converts each category into a **binary vector**. For k unique categories, you create k new columns. Each row has exactly one \`1\` (the "hot" position) and all other columns are \`0\`.

The key insight: no column is ever larger than another. The model sees *presence or absence*, not a numeric ranking.

\`\`\`algoviz
{
  "title": "Building a One-Hot Matrix for ['cat', 'dog', 'bird']",
  "type": "grid",
  "data": [[0,1,0],[0,0,1],[1,0,0]],
  "frames": [
    {
      "highlight": [0],
      "label": "Row 0: input='cat'. Sorted unique=['bird','cat','dog'] → cat is index 1 → column 1 goes hot",
      "stats": {"row": 0, "input": "cat", "bird": 0, "cat": 1, "dog": 0}
    },
    {
      "highlight": [1],
      "label": "Row 1: input='dog'. dog is index 2 in sorted order → column 2 goes hot",
      "stats": {"row": 1, "input": "dog", "bird": 0, "cat": 0, "dog": 1}
    },
    {
      "highlight": [2],
      "label": "Row 2: input='bird'. bird is index 0 in sorted order → column 0 goes hot",
      "stats": {"row": 2, "input": "bird", "bird": 1, "cat": 0, "dog": 0}
    }
  ],
  "speed": 800
}
\`\`\`

Each row has **exactly one 1**. The algorithm is never told \`bird < cat < dog\`. It only knows which column is active — preserving the nominal nature of the data perfectly.

> **The dummy variable trap:** With k categories producing k binary columns, the columns always sum to 1 — meaning any one column is perfectly predictable from the others. This is *perfect multicollinearity*, which can cause numerical instability in linear models. The fix: drop one column (use k−1 columns). You lose no information.

---

## Choosing the Right Method

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Label Encoding on Ordinal Data (Correct)",
    "code": "# Education level has a natural ranking\\nedu = ['high school', 'bachelor', 'master', 'PhD']\\nmapping = {'high school': 0, 'bachelor': 1,\\n           'master': 2, 'PhD': 3}\\nencoded = [mapping[e] for e in edu]\\n# [0, 1, 2, 3] — order is mathematically preserved\\n# Model correctly learns: higher number = more education"
  },
  "after": {
    "label": "Label Encoding on Nominal Data (Wrong!)",
    "code": "# Colors have NO natural order\\ncolors = ['red', 'green', 'blue']\\nmapping = {'blue': 0, 'green': 1, 'red': 2}\\nencoded = [mapping[c] for c in colors]\\n# Model now believes: blue(0) < green(1) < red(2)\\n# This false relationship pollutes learning!\\n# Solution: use one-hot encoding for nominal data"
  }
}
\`\`\`

---

## Full Implementation: Fit on Train, Transform Both

The golden rule of encoding: **fit on training data only, then apply the same mapping to the test set**. This prevents *target leakage* — one of the most insidious bugs in ML pipelines.

\`\`\`callout
{
  "type": "danger",
  "title": "Target Leakage: The Fit-on-Test Bug",
  "content": "If you compute your encoding mapping from the entire dataset before splitting, the encoder has 'seen' test samples. Category frequencies and unique values from the test set influence the encoder fitted during training — your model indirectly trains on test data.\\n\\n**Result:** evaluation metrics are optimistically biased. The model appears to generalize better than it actually does.\\n\\n**Rule:** always split first, encode second. Fit only on training data. Use the same fitted mapping (transform only, no re-fitting) on the test set."
}
\`\`\`

\`\`\`playground
{
  "title": "Label & One-Hot Encoding with Proper Train/Test Split",
  "language": "python",
  "code": "import numpy as np\\n\\n# ── Dataset ──────────────────────────────────────────────────\\n# Neighborhood feature for a house price model\\ntrain_data = np.array(['north', 'south', 'east', 'north', 'west', 'south'])\\ntest_data  = np.array(['east', 'north', 'west'])\\n\\n# ── Label Encoding ───────────────────────────────────────────\\n# Fit: learn the mapping from TRAINING data only\\nunique_labels = sorted(set(train_data))\\nlabel_map = {v: i for i, v in enumerate(unique_labels)}\\n\\n# Transform: apply the same mapping to both splits\\ntrain_le = np.array([label_map[v] for v in train_data])\\ntest_le  = np.array([label_map[v] for v in test_data])\\n\\nprint('=== Label Encoding ===')\\nprint('Mapping:', label_map)\\nprint('Train:  ', train_le)\\nprint('Test:   ', test_le)\\n\\n# ── One-Hot Encoding ─────────────────────────────────────────\\n# Fit: categories determined by TRAINING data only\\ncategories = sorted(set(train_data))\\nn_cats = len(categories)\\ncat_idx = {v: i for i, v in enumerate(categories)}\\n\\ndef ohe_transform(arr, cat_idx, n_cats):\\n    result = np.zeros((len(arr), n_cats), dtype=int)\\n    for i, val in enumerate(arr):\\n        result[i, cat_idx[val]] = 1\\n    return result\\n\\n# Transform: reuse the same cat_idx fitted on train\\ntrain_ohe = ohe_transform(train_data, cat_idx, n_cats)\\ntest_ohe  = ohe_transform(test_data,  cat_idx, n_cats)\\n\\nprint('\\\\n=== One-Hot Encoding ===')\\nprint('Columns:', categories)\\nprint('Train OHE:')\\nprint(train_ohe)\\nprint('Test OHE:')\\nprint(test_ohe)",
  "runnable": true
}
\`\`\`

Notice that \`cat_idx\` — the category-to-column mapping — is computed once from \`train_data\` and passed unchanged into \`ohe_transform\` for the test set. The test set never influences the encoder.

**Handling unknown categories:** If a test sample contains a value that never appeared in training (e.g., a new neighborhood added after the model was deployed), the encoder will raise a \`KeyError\`. Handle this by adding an explicit \`"unknown"\` category during fitting, or by clipping unseen values to a fallback.

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{
  "title": "Implement One-Hot Encoding from Scratch",
  "prompt": "Complete the one_hot_encode function. It should return a binary matrix where each row has exactly one 1, plus a list of the column names.",
  "language": "python",
  "template": "import numpy as np\\n\\ndef one_hot_encode(labels):\\n    unique = ___(set(labels))    # deterministic column order\\n    n = len(unique)\\n    idx = {v: i for i, v in enumerate(unique)}\\n    result = np.zeros((len(labels), ___), dtype=int)\\n    for i, label in enumerate(labels):\\n        result[i, idx[label]] = ___\\n    return result, unique\\n\\nmatrix, cols = one_hot_encode(['cat', 'dog', 'cat', 'bird'])\\nprint('Columns:', cols)\\nprint(matrix)",
  "blanks": [
    {
      "answer": "sorted",
      "hint": "Ensures the same category always maps to the same column across different runs and Python versions"
    },
    {
      "answer": "n",
      "hint": "The number of columns must equal the number of unique categories"
    },
    {
      "answer": "1",
      "hint": "Mark the active category as hot — every other column in this row stays 0"
    }
  ]
}
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{
  "title": "Encoding Categorical Variables",
  "questions": [
    {
      "question": "A dataset has a 'temperature_band' column: ['freezing', 'cold', 'warm', 'hot']. Which encoding is most appropriate?",
      "options": [
        "One-hot encoding — avoids imposing any numeric order",
        "Label encoding — temperature bands have a natural ordering",
        "No encoding needed — most algorithms handle strings natively",
        "Both methods are always equally valid"
      ],
      "answer": 1,
      "explanation": "Temperature bands are ordinal: freezing < cold < warm < hot. Label encoding (0, 1, 2, 3) correctly preserves this relationship. One-hot encoding would discard the ordering information, making it harder for the model to learn temperature-dependent patterns."
    },
    {
      "question": "You compute your one-hot mapping from the full dataset (train + test combined) before splitting. What is the consequence?",
      "options": [
        "The encoded matrix will have fewer columns than expected",
        "Test-set category distributions influence the encoder — evaluation metrics are optimistically biased",
        "The encoding becomes non-deterministic between runs",
        "One-hot encoding requires the full dataset to generate a valid mapping"
      ],
      "answer": 1,
      "explanation": "Fitting on the full dataset causes target leakage: the encoder has implicitly 'seen' test samples during training. This inflates evaluation metrics, making the model appear to generalize better than it actually does. Always split first, then fit the encoder on training data only."
    },
    {
      "question": "A 'country' column has 150 unique values. After one-hot encoding, your feature matrix grows from 10 to 159 columns. What is the main concern?",
      "options": [
        "The encoded values are no longer binary",
        "A sparse, high-dimensional matrix that increases memory usage and can degrade model performance",
        "Label encoding would produce the exact same problem",
        "One-hot encoding cannot be applied to more than 50 unique categories"
      ],
      "answer": 1,
      "explanation": "150 one-hot columns produce a very sparse matrix — most entries are 0. This high-dimensional sparse representation increases memory cost, slows training, and can hurt generalization. For high-cardinality nominal features, consider target encoding (replace category with mean target value, computed on train only) or frequency encoding."
    },
    {
      "question": "Why must you call sorted() on the unique categories when building an encoder?",
      "options": [
        "set() returns categories in a random order — sorted() makes the mapping deterministic across runs",
        "NumPy requires input arrays to be sorted before building a dictionary",
        "Sorted categories always improve model accuracy by reducing noise",
        "Sorting is only needed for one-hot encoding, not label encoding"
      ],
      "answer": 0,
      "explanation": "Python sets are unordered — their iteration order can vary between runs and Python versions. If you build a mapping from an unsorted set, 'bird' might map to 0 in one run and 2 in another. When you later load a saved model and apply a newly computed mapping, the columns won't align. sorted() guarantees 'bird' always maps to the same integer."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Ordinal categories (natural order exists) → label encoding. Nominal categories (no order) → one-hot encoding. Applying the wrong method silently injects false mathematical relationships into your model.",
    "Always split your data first, then fit your encoder on training data only. Apply the same fitted mapping to the test set without re-fitting — this is the primary defense against target leakage.",
    "One-hot encoding creates k binary columns per feature. High-cardinality features (hundreds of unique values) produce wide, sparse matrices — consider target encoding or frequency encoding as alternatives.",
    "Always call sorted() on unique categories when building a mapping. Python sets are unordered; without sorting, the same category could receive different integers across runs, corrupting saved models.",
    "The dummy variable trap: k one-hot columns always sum to 1, creating perfect multicollinearity. For linear models, use k−1 columns (drop one category) to avoid numerical instability — you lose no information."
  ]
}
\`\`\``,
      starterCode: `import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

# Dataset: predict customer churn based on plan type, region, and support tier
data = {
    'plan':      ['basic', 'premium', 'basic', 'enterprise', 'premium', 'enterprise', 'basic', 'premium'],
    'region':    ['north', 'south', 'east', 'west', 'north', 'east', 'west', 'south'],
    'support':   ['standard', 'priority', 'standard', 'dedicated', 'priority', 'dedicated', 'standard', 'priority'],
    'churned':   [1, 0, 1, 0, 0, 0, 1, 0]
}
df = pd.DataFrame(data)

# --- Step 1: Split BEFORE encoding to avoid target leakage ---
# TODO: Split df into train_df and test_df using train_test_split.
#       Use test_size=0.25 and random_state=42.
#       Hint: split the whole DataFrame, then reset the index on both halves.
train_df, test_df = None, None


# --- Step 2: Label Encoding for 'support' (ordinal: standard < priority < dedicated) ---
# TODO: Create a LabelEncoder, fit it on train_df['support'] only,
#       then transform both train_df and test_df.
#       Store results in train_df['support_encoded'] and test_df['support_encoded'].
le = LabelEncoder()
train_df['support_encoded'] = None  # fit + transform on train
test_df['support_encoded']  = None  # transform only on test


# --- Step 3: One-Hot Encoding for 'plan' and 'region' (nominal, no order) ---
# TODO: Use pd.get_dummies() on train_df for columns ['plan', 'region'].
#       Then use the same call on test_df, but pass the columns from the
#       training dummies so both DataFrames have identical columns.
#       Store results in train_ohe and test_ohe.
train_ohe = None
test_ohe  = None


# --- Step 4: Verify no leakage and print results ---
print("Train OHE columns:", list(train_ohe.columns))
print("Test  OHE columns:", list(test_ohe.columns))
print("\\nTrain support_encoded values:", train_df['support_encoded'].tolist())
print("Test  support_encoded values:", test_df['support_encoded'].tolist())
print("\\nTrain OHE head:")
print(train_ohe.head())
`,
      solutionCode: `import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

# Dataset: predict customer churn based on plan type, region, and support tier
data = {
    'plan':      ['basic', 'premium', 'basic', 'enterprise', 'premium', 'enterprise', 'basic', 'premium'],
    'region':    ['north', 'south', 'east', 'west', 'north', 'east', 'west', 'south'],
    'support':   ['standard', 'priority', 'standard', 'dedicated', 'priority', 'dedicated', 'standard', 'priority'],
    'churned':   [1, 0, 1, 0, 0, 0, 1, 0]
}
df = pd.DataFrame(data)

# --- Step 1: Split BEFORE encoding to avoid target leakage ---
# Fitting an encoder on the full dataset lets test-set label frequencies
# influence the encoder, leaking information about unseen data.
train_df, test_df = train_test_split(df, test_size=0.25, random_state=42)
train_df = train_df.reset_index(drop=True)
test_df  = test_df.reset_index(drop=True)


# --- Step 2: Label Encoding for 'support' (ordinal: standard < priority < dedicated) ---
# Fit ONLY on training data so the encoder learns the mapping from train alone.
# Then apply the same mapping to test — never re-fit on test.
le = LabelEncoder()
train_df['support_encoded'] = le.fit_transform(train_df['support'])  # fit + transform
test_df['support_encoded']  = le.transform(test_df['support'])       # transform only

# Note: LabelEncoder assigns integers alphabetically by default
# (dedicated=0, priority=1, standard=2). For a meaningful ordinal order
# you would use OrdinalEncoder with categories=[['standard','priority','dedicated']].


# --- Step 3: One-Hot Encoding for 'plan' and 'region' (nominal, no order) ---
# Fit (discover all categories) on training data only.
train_ohe = pd.get_dummies(train_df[['plan', 'region']], columns=['plan', 'region'])

# Reindex test to match training columns exactly.
# Any category not seen in test gets a column of zeros; no extra columns appear.
test_ohe = pd.get_dummies(test_df[['plan', 'region']], columns=['plan', 'region'])
test_ohe = test_ohe.reindex(columns=train_ohe.columns, fill_value=0)


# --- Step 4: Verify no leakage and print results ---
print("Train OHE columns:", list(train_ohe.columns))
print("Test  OHE columns:", list(test_ohe.columns))   # must match train exactly
print("\\nTrain support_encoded values:", train_df['support_encoded'].tolist())
print("Test  support_encoded values:", test_df['support_encoded'].tolist())
print("\\nTrain OHE head:")
print(train_ohe.head())
`,
    },
    {
      id: "train-val-test-split",
      slug: "train-val-test-split",
      title: "Train, Validation, and Test Splits",
      content: `# Train, Validation, and Test Splits

Every model you build faces one fundamental question: *does it actually work on data it's never seen?* The only honest way to answer that question is to hide some data from the model entirely — and never peek until you're done building.

This lesson teaches you how to split data correctly, why the order of operations matters, and how to handle imbalanced classes so your evaluation is never misleading.

---

\`\`\`concept
{
  "title": "The Three-Set Contract",
  "variant": "mental-model",
  "content": "Think of your dataset as a textbook, a practice exam, and a final exam.\\n\\n- **Training set** = the textbook. The model studies this and adjusts its parameters.\\n- **Validation set** = practice exams. You use this to tune hyperparameters and catch overfitting *while* developing.\\n- **Test set** = the sealed final exam. Opened exactly once, at the very end, to get an unbiased score.\\n\\nIf you study the final exam in advance, your grade means nothing."
}
\`\`\`

---

## Why Three Sets, Not Two?

You might wonder: why not just train on some data and test on the rest?

The problem is **hyperparameter contamination**. Suppose you try 20 different learning rates, pick the one that gives the best test accuracy, and report that number. You've implicitly trained on the test set — you just made 20 decisions based on it. The test score is now optimistic and untrustworthy.

The validation set absorbs all those iterative decisions. The test set stays pristine.

\`\`\`callout
{
  "type": "danger",
  "title": "The Cardinal Sin: Peeking at the Test Set",
  "content": "Using the test set to guide *any* modeling decision — hyperparameter tuning, feature selection, architecture choices — destroys its value as an unbiased estimator. Once you peek, you no longer have a test set. You have a second validation set."
}
\`\`\`

---

## Visualising the Split

\`\`\`sysdiag
{
  "title": "Dataset Split Flow",
  "width": 620,
  "height": 300,
  "nodes": [
    { "id": "raw", "label": "Raw Dataset\\n(100%)", "x": 80, "y": 150, "kind": "storage" },
    { "id": "train", "label": "Training Set\\n(70%)", "x": 300, "y": 80, "kind": "service" },
    { "id": "val", "label": "Validation Set\\n(15%)", "x": 300, "y": 180, "kind": "service" },
    { "id": "test", "label": "Test Set\\n(15%)", "x": 300, "y": 260, "kind": "storage" },
    { "id": "model", "label": "Trained Model", "x": 500, "y": 80, "kind": "service" },
    { "id": "report", "label": "Final Score", "x": 500, "y": 260, "kind": "storage" }
  ],
  "edges": [
    { "from": "raw", "to": "train", "label": "shuffle + split" },
    { "from": "raw", "to": "val", "label": "" },
    { "from": "raw", "to": "test", "label": "" },
    { "from": "train", "to": "model", "label": "fit()" },
    { "from": "val", "to": "model", "label": "tune" },
    { "from": "test", "to": "report", "label": "evaluate once" }
  ],
  "annotations": {
    "train": "Model sees this data. Parameters (weights) are updated here.",
    "val": "Model never trains on this. Used to select hyperparameters and detect overfitting.",
    "test": "Completely held out. Opened exactly once at the end to report final accuracy.",
    "model": "Trained with optimal hyperparameters chosen using the validation set.",
    "report": "Unbiased estimate of real-world performance."
  }
}
\`\`\`

---

## Implementing a Basic Split in NumPy

The key insight: **shuffle first, then slice**. Never slice a sorted dataset.

\`\`\`playground
{
  "title": "Basic Train / Val / Test Split",
  "language": "python",
  "code": "import numpy as np\\n\\n# Reproducible randomness\\nnp.random.seed(42)\\n\\n# Simulate 1000 samples with 5 features and a binary label\\nX = np.random.randn(1000, 5)\\ny = (X[:, 0] + X[:, 2] > 0).astype(int)   # some noisy rule\\n\\nprint(f\\"Dataset shape : X={X.shape}, y={y.shape}\\")\\nprint(f\\"Class balance : {np.bincount(y) / len(y)}\\")\\n\\n# --- Step 1: Shuffle ---\\nindices = np.arange(len(X))\\nnp.random.shuffle(indices)\\nX, y = X[indices], y[indices]\\n\\n# --- Step 2: Define split boundaries ---\\nn = len(X)\\ntrain_end = int(0.70 * n)   # 70%\\nval_end   = int(0.85 * n)   # 70% + 15%\\n\\n# --- Step 3: Slice ---\\nX_train, y_train = X[:train_end],        y[:train_end]\\nX_val,   y_val   = X[train_end:val_end], y[train_end:val_end]\\nX_test,  y_test  = X[val_end:],          y[val_end:]\\n\\nprint(f\\"\\\\nSplit sizes   : train={len(X_train)}, val={len(X_val)}, test={len(X_test)}\\")\\nprint(f\\"Train balance : {np.bincount(y_train) / len(y_train)}\\")\\nprint(f\\"Val balance   : {np.bincount(y_val)   / len(y_val)}\\")\\nprint(f\\"Test balance  : {np.bincount(y_test)  / len(y_test)}\\")",
  "runnable": true
}
\`\`\`

---

## The Data Leakage Trap

Splitting sounds simple — but one common mistake silently corrupts your evaluation.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "What is leakage?",
      "icon": "💧",
      "content": "**Data leakage** happens when information from the validation or test set influences the training process.\\n\\nThe model appears to perform well in evaluation, but fails in production — because it was implicitly trained on the very data it was being evaluated on.\\n\\nLeakage is insidious: your metrics look great, so you never suspect a problem."
    },
    {
      "label": "Classic leakage example",
      "icon": "⚠️",
      "content": "\`\`\`python\\n# WRONG — scale the whole dataset BEFORE splitting\\nfrom sklearn.preprocessing import StandardScaler\\n\\nscaler = StandardScaler()\\nX_scaled = scaler.fit_transform(X)   # uses mean/std of val+test!\\n\\nX_train, X_val, X_test = split(X_scaled)  # leakage baked in\\n\`\`\`\\n\\nThe scaler has seen the test set's values when computing the mean and standard deviation. Now the test set has influenced how training data is normalised."
    },
    {
      "label": "Correct order",
      "icon": "✅",
      "content": "\`\`\`python\\n# CORRECT — split FIRST, then fit scaler on train only\\nX_train, X_val, X_test = split(X)   # raw data\\n\\nmean = X_train.mean(axis=0)          # computed on TRAIN only\\nstd  = X_train.std(axis=0)\\n\\n# Apply the SAME transform to all three sets\\nX_train_s = (X_train - mean) / std\\nX_val_s   = (X_val   - mean) / std   # val uses TRAIN stats\\nX_test_s  = (X_test  - mean) / std   # test uses TRAIN stats\\n\`\`\`\\n\\nGolden rule: **fit any transformation on the training set only, then transform all sets using those fitted parameters**."
    }
  ]
}
\`\`\`

---

## Stratified Splitting for Imbalanced Classes

Suppose 95% of your labels are class 0 and only 5% are class 1. A random shuffle might accidentally put *all* the class-1 examples into the training set — leaving the validation set with no positive examples at all.

**Stratified splitting** preserves the original class ratio in every split.

\`\`\`steps
{
  "title": "How Stratified Splitting Works",
  "steps": [
    {
      "title": "Separate by class",
      "content": "Identify all indices belonging to each class:\\n\\n\`\`\`python\\nclass0_idx = np.where(y == 0)[0]\\nclass1_idx = np.where(y == 1)[0]\\n\`\`\`\\n\\nEach class is handled independently so its proportion is maintained."
    },
    {
      "title": "Shuffle within each class",
      "content": "\`\`\`python\\nnp.random.shuffle(class0_idx)\\nnp.random.shuffle(class1_idx)\\n\`\`\`\\n\\nThis removes any ordering bias within each class before we slice."
    },
    {
      "title": "Slice each class at the same ratios",
      "content": "\`\`\`python\\ndef class_split(idx, train_r=0.70, val_r=0.15):\\n    n = len(idx)\\n    t = int(train_r * n)\\n    v = int((train_r + val_r) * n)\\n    return idx[:t], idx[t:v], idx[v:]\\n\\ntrain0, val0, test0 = class_split(class0_idx)\\ntrain1, val1, test1 = class_split(class1_idx)\\n\`\`\`\\n\\nEach class contributes 70 / 15 / 15% to the final split."
    },
    {
      "title": "Concatenate and shuffle the merged sets",
      "content": "\`\`\`python\\ntrain_idx = np.concatenate([train0, train1])\\nval_idx   = np.concatenate([val0,   val1])\\ntest_idx  = np.concatenate([test0,  test1])\\n\\n# Shuffle so classes aren't ordered within each split\\nnp.random.shuffle(train_idx)\\nnp.random.shuffle(val_idx)\\nnp.random.shuffle(test_idx)\\n\\nX_train, y_train = X[train_idx], y[train_idx]\\nX_val,   y_val   = X[val_idx],   y[val_idx]\\nX_test,  y_test  = X[test_idx],  y[test_idx]\\n\`\`\`"
    }
  ]
}
\`\`\`

---

## Putting It All Together

\`\`\`playground
{
  "title": "Stratified Split — Full NumPy Implementation",
  "language": "python",
  "code": "import numpy as np\\n\\nnp.random.seed(0)\\n\\n# Imbalanced dataset: 950 negatives, 50 positives\\nX = np.random.randn(1000, 4)\\ny = np.array([0]*950 + [1]*50)\\nnp.random.shuffle(y)   # mix them up first\\n\\nprint(\\"=== Original class balance ===\\")\\nprint(f\\"Class 0: {(y==0).sum()}  Class 1: {(y==1).sum()}\\")\\n\\ndef stratified_split(X, y, train_ratio=0.70, val_ratio=0.15, seed=42):\\n    rng = np.random.default_rng(seed)\\n    classes = np.unique(y)\\n\\n    train_idx, val_idx, test_idx = [], [], []\\n\\n    for cls in classes:\\n        idx = np.where(y == cls)[0]\\n        rng.shuffle(idx)\\n        n = len(idx)\\n        t = int(train_ratio * n)\\n        v = int((train_ratio + val_ratio) * n)\\n        train_idx.append(idx[:t])\\n        val_idx.append(idx[t:v])\\n        test_idx.append(idx[v:])\\n\\n    def merge_shuffle(parts):\\n        merged = np.concatenate(parts)\\n        rng.shuffle(merged)\\n        return merged\\n\\n    return (\\n        merge_shuffle(train_idx),\\n        merge_shuffle(val_idx),\\n        merge_shuffle(test_idx)\\n    )\\n\\ntrain_i, val_i, test_i = stratified_split(X, y)\\n\\nfor name, idx in [(\\"Train\\", train_i), (\\"Val\\", val_i), (\\"Test\\", test_i)]:\\n    counts = np.bincount(y[idx])\\n    ratio  = counts[1] / counts.sum()\\n    print(f\\"{name:6s}: n={len(idx):4d}  class-1 ratio={ratio:.3f}\\")",
  "runnable": true
}
\`\`\`

---

## Tracing the Algorithm

Watch how a 10-sample toy dataset is split — tracking the indices at each step.

\`\`\`trace
{
  "title": "Step-by-step stratified split on 10 samples",
  "language": "python",
  "code": "y = [0,0,0,0,0,0,1,1,1,1]  # 6 neg, 4 pos\\nclass0 = [0,1,2,3,4,5]\\nclass1 = [6,7,8,9]\\nnp.random.shuffle(class0)  # e.g. -> [3,1,5,0,4,2]\\nnp.random.shuffle(class1)  # e.g. -> [8,6,9,7]\\ntrain0 = class0[:4]; val0 = class0[4:5]; test0 = class0[5:]\\ntrain1 = class1[:2]; val1 = class1[2:3]; test1 = class1[3:]\\ntrain_idx = concat + shuffle([3,1,5,0,8,6])\\nval_idx   = concat + shuffle([4,9])\\ntest_idx  = concat + shuffle([2,7])",
  "frames": [
    { "line": 1, "vars": { "y": "[0,0,0,0,0,0,1,1,1,1]" }, "note": "10 samples: 6 class-0, 4 class-1" },
    { "line": 2, "vars": { "class0": "[0,1,2,3,4,5]", "class1": "[6,7,8,9]" }, "note": "Separate indices by class" },
    { "line": 3, "vars": { "class0": "[3,1,5,0,4,2]" }, "note": "Shuffle class-0 indices independently" },
    { "line": 4, "vars": { "class1": "[8,6,9,7]" }, "note": "Shuffle class-1 indices independently" },
    { "line": 5, "vars": { "train0": "[3,1,5,0]", "val0": "[4]", "test0": "[2]" }, "note": "70/15/15 slice of class-0 (4 / 1 / 1)" },
    { "line": 6, "vars": { "train1": "[8,6]", "val1": "[9]", "test1": "[7]" }, "note": "70/15/15 slice of class-1 (2 / 1 / 1)" },
    { "line": 7, "vars": { "train_idx": "[0,1,3,5,6,8]", "class1_ratio": "2/6 = 33%" }, "note": "Merge and shuffle train — class ratio preserved" },
    { "line": 8, "vars": { "val_idx": "[4,9]", "class1_ratio": "1/2 = 50%" }, "note": "Val split — small but still contains both classes" },
    { "line": 9, "vars": { "test_idx": "[2,7]", "class1_ratio": "1/2 = 50%" }, "note": "Test split locked away — never used during development" }
  ],
  "speed": 900
}
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{
  "title": "Complete the stratified split logic",
  "prompt": "Given class indices, compute the slice boundaries for a 70/15/15 split:",
  "language": "python",
  "template": "def get_boundaries(n, train_ratio=0.70, val_ratio=0.15):\\n    train_end = int(___ * n)\\n    val_end   = int((train_ratio + ___) * n)\\n    return train_end, val_end\\n\\n# For n=200: train_end should be 140, val_end should be 170\\nprint(get_boundaries(___)) ",
  "blanks": [
    { "answer": "train_ratio", "hint": "The fraction of data used for training" },
    { "answer": "val_ratio", "hint": "Add this to train_ratio to find where validation ends" },
    { "answer": "200", "hint": "We want to test with 200 samples" }
  ]
}
\`\`\`

---

## Common Pitfalls at a Glance

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Leaky Pipeline (Wrong)",
    "code": "# Scale BEFORE splitting — leaks test stats into scaler\\nX_scaled = (X - X.mean(0)) / X.std(0)\\n\\nX_train = X_scaled[:700]\\nX_val   = X_scaled[700:850]\\nX_test  = X_scaled[850:]   # already contaminated"
  },
  "after": {
    "label": "Clean Pipeline (Correct)",
    "code": "# Split FIRST — then fit scaler on train only\\nX_train_raw = X[:700]\\nX_val_raw   = X[700:850]\\nX_test_raw  = X[850:]\\n\\nmean = X_train_raw.mean(0)   # train stats only\\nstd  = X_train_raw.std(0)\\n\\nX_train = (X_train_raw - mean) / std\\nX_val   = (X_val_raw   - mean) / std\\nX_test  = (X_test_raw  - mean) / std"
  }
}
\`\`\`

---

\`\`\`collapse
{
  "title": "Deep Dive: When to Use Cross-Validation Instead",
  "content": "For small datasets (< ~1000 samples), a single 70/15/15 split can be highly variable — you might get lucky or unlucky with which examples land in which set.\\n\\n**k-Fold Cross-Validation** is the alternative:\\n\\n1. Divide data into k equal folds (typically k=5 or k=10).\\n2. Train k times; each time, one fold is the validation set and the rest are training.\\n3. Average the k validation scores to get a more stable estimate.\\n\\n\`\`\`python\\ndef k_fold_indices(n, k=5, seed=42):\\n    rng = np.random.default_rng(seed)\\n    indices = np.arange(n)\\n    rng.shuffle(indices)\\n    return np.array_split(indices, k)\\n\\nfolds = k_fold_indices(500, k=5)\\nfor i in range(5):\\n    val_idx   = folds[i]\\n    train_idx = np.concatenate([folds[j] for j in range(5) if j != i])\\n    print(f\\"Fold {i}: train={len(train_idx)}, val={len(val_idx)}\\")\\n\`\`\`\\n\\n**When to choose which:**\\n\\n| Situation | Recommendation |\\n|---|---|\\n| n > 10,000 | Single split (fast, sufficient) |\\n| n < 1,000 | k-Fold cross-validation |\\n| Imbalanced + small | Stratified k-Fold |\\n| Time-series data | Time-based split (no shuffling!) |\\n\\nNote: with k-fold you still need a held-out **test set** — the k-fold is your substitute for the validation set only."
}
\`\`\`

---

## Quiz

\`\`\`quiz
{
  "title": "Train, Validation, and Test Splits",
  "questions": [
    {
      "question": "You train 10 models with different hyperparameters, pick the best one based on test accuracy, and report that accuracy. What is wrong with this approach?",
      "options": [
        "Nothing — that is the correct way to select the best model",
        "The test set has been used to make decisions, so it no longer provides an unbiased estimate",
        "You should always use the training accuracy to pick the best model",
        "Hyperparameter tuning should be done before any data splitting"
      ],
      "answer": 1,
      "explanation": "Every time you use the test set to guide a decision, the model implicitly adapts to it. The test set must be used exactly once — after all decisions are finalised — to give an unbiased score. Use the validation set for hyperparameter selection instead."
    },
    {
      "question": "You fit a StandardScaler on the entire dataset before splitting into train/val/test. What problem does this introduce?",
      "options": [
        "The model will train faster, which may cause underfitting",
        "The scaler's mean and std are computed using val/test values, leaking future information into training",
        "Standard scaling should never be used with neural networks",
        "This makes the test set too similar to the training set in terms of distribution"
      ],
      "answer": 1,
      "explanation": "Fitting the scaler on the entire dataset means the mean and standard deviation incorporate information from the validation and test sets. When you later evaluate on those sets, they have already indirectly influenced the preprocessing — this is data leakage. Always fit transformations on the training set only."
    },
    {
      "question": "Your dataset has 950 samples of class 0 and 50 samples of class 1. Why is stratified splitting preferred over simple random splitting?",
      "options": [
        "Stratified splitting always produces larger training sets",
        "Simple random splitting is slower for imbalanced data",
        "A random shuffle might place nearly all class-1 examples in training, leaving validation and test with too few positives to evaluate fairly",
        "Stratified splitting prevents the need for a test set entirely"
      ],
      "answer": 2,
      "explanation": "With 5% positive examples, an unlucky random split could put zero or one positive example into the validation or test set. Stratified splitting guarantees that each split has roughly the same class ratio (5% positives) as the original dataset, making evaluation meaningful and fair."
    },
    {
      "question": "Which split ratio is most appropriate for a very large dataset (e.g., 10 million samples)?",
      "options": [
        "50% train, 25% val, 25% test — more data is always better for evaluation",
        "98% train, 1% val, 1% test — even 1% of 10M gives 100k samples for evaluation",
        "60% train, 20% val, 20% test — the standard ratio regardless of dataset size",
        "100% train with cross-validation — test sets are only needed for small datasets"
      ],
      "answer": 1,
      "explanation": "When you have millions of samples, 1% is still 100,000 examples — more than enough for statistically reliable evaluation. Putting more data into the training set helps the model learn better patterns. Large datasets make it practical to use much smaller validation and test fractions than the traditional 15-20%."
    },
    {
      "question": "Why must you shuffle data BEFORE splitting, rather than after?",
      "options": [
        "Shuffling after splitting is identical to shuffling before — order doesn't matter",
        "Post-split shuffling increases training speed",
        "If data is ordered (e.g., by class or date), unshuffled slices create non-representative splits where some classes or time periods are missing from certain sets",
        "You should never shuffle data — it introduces randomness that hurts reproducibility"
      ],
      "answer": 2,
      "explanation": "Datasets often have structure: records from the same class grouped together, or samples ordered by timestamp. Slicing without shuffling might put all of class A in training and all of class B in the test set. Shuffling first randomises the order so each slice is a representative sample of the full distribution."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Split your data into three sets: training (learn parameters), validation (tune hyperparameters), and test (final unbiased evaluation — used exactly once).",
    "Always shuffle before splitting to remove ordering bias. Use a fixed random seed for reproducibility.",
    "Fit all preprocessing transformations (scalers, encoders) on the training set only, then apply those fitted parameters to validation and test sets — never fit on the full dataset.",
    "For imbalanced classes, use stratified splitting: separate indices by class, apply the same train/val/test ratios within each class, then merge and shuffle.",
    "For small datasets (< ~1000 samples), consider k-fold cross-validation to get a more stable validation estimate — but always keep a separate held-out test set.",
    "Typical split ratios are 70/15/15 or 80/10/10 for moderate datasets; large datasets (millions of rows) can use 98/1/1 since even 1% yields statistically reliable samples."
  ]
}
\`\`\``,
      starterCode: `import numpy as np

# Dataset: 1000 samples, imbalanced classes (90% class 0, 10% class 1)
np.random.seed(42)
n_samples = 1000
X = np.random.randn(n_samples, 4)  # 4 features
y = np.array([0] * 900 + [1] * 100)  # imbalanced: 900 negatives, 100 positives


def stratified_split(X, y, val_size=0.15, test_size=0.15, random_seed=42):
    """
    Split data into train/validation/test sets using stratified sampling.
    Stratified sampling preserves the class distribution in each split.

    Args:
        X: Feature array of shape (n_samples, n_features)
        y: Label array of shape (n_samples,)
        val_size: Fraction of data for validation set
        test_size: Fraction of data for test set
        random_seed: For reproducibility

    Returns:
        X_train, X_val, X_test, y_train, y_val, y_test
    """
    np.random.seed(random_seed)

    # TODO 1: Find the unique classes and their indices
    # Hint: use np.unique() and np.where() or boolean indexing
    classes = None
    indices_per_class = {}  # dict mapping class -> array of indices

    # TODO 2: For each class, shuffle its indices independently
    # This ensures each class is sampled proportionally

    # TODO 3: For each class, split the shuffled indices into
    # train / val / test portions based on val_size and test_size
    # Collect train_idx, val_idx, test_idx across all classes
    train_idx = []
    val_idx = []
    test_idx = []

    # TODO 4: Concatenate the per-class index lists, then shuffle
    # each combined split so samples aren't grouped by class

    # TODO 5: Use the final index arrays to slice X and y
    # and return all six arrays
    pass


# --- Run and verify ---
X_train, X_val, X_test, y_train, y_val, y_test = stratified_split(X, y)

print("Split sizes:")
print(f"  Train : {len(X_train)} samples")
print(f"  Val   : {len(X_val)} samples")
print(f"  Test  : {len(X_test)} samples")

print("\\nClass-1 ratio (should be ~10% in every split):")
print(f"  Original : {y.mean():.2%}")
print(f"  Train    : {y_train.mean():.2%}")
print(f"  Val      : {y_val.mean():.2%}")
print(f"  Test     : {y_test.mean():.2%}")
`,
      solutionCode: `import numpy as np

# Dataset: 1000 samples, imbalanced classes (90% class 0, 10% class 1)
np.random.seed(42)
n_samples = 1000
X = np.random.randn(n_samples, 4)  # 4 features
y = np.array([0] * 900 + [1] * 100)  # imbalanced: 900 negatives, 100 positives


def stratified_split(X, y, val_size=0.15, test_size=0.15, random_seed=42):
    """
    Split data into train/validation/test sets using stratified sampling.
    Stratified sampling preserves the class distribution in each split.
    """
    np.random.seed(random_seed)

    # Step 1: Find unique classes and gather their indices
    classes = np.unique(y)
    indices_per_class = {cls: np.where(y == cls)[0] for cls in classes}

    train_idx = []
    val_idx = []
    test_idx = []

    for cls, idx in indices_per_class.items():
        # Step 2: Shuffle this class's indices in place
        shuffled = idx.copy()
        np.random.shuffle(shuffled)

        n = len(shuffled)

        # Step 3: Calculate split boundaries for this class
        # Working from the end keeps arithmetic simple and avoids
        # accidentally assigning the same sample to two splits.
        n_test = int(np.floor(n * test_size))
        n_val = int(np.floor(n * val_size))
        n_train = n - n_val - n_test

        # Slice the shuffled indices for each split
        train_idx.append(shuffled[:n_train])
        val_idx.append(shuffled[n_train:n_train + n_val])
        test_idx.append(shuffled[n_train + n_val:])

    # Step 4: Merge per-class index chunks and re-shuffle each split
    # so rows are interleaved (not all class-0 then all class-1)
    train_idx = np.concatenate(train_idx)
    val_idx = np.concatenate(val_idx)
    test_idx = np.concatenate(test_idx)

    np.random.shuffle(train_idx)
    np.random.shuffle(val_idx)
    np.random.shuffle(test_idx)

    # Step 5: Index into X and y with the final index arrays
    return (
        X[train_idx], X[val_idx], X[test_idx],
        y[train_idx], y[val_idx], y[test_idx],
    )


# --- Run and verify ---
X_train, X_val, X_test, y_train, y_val, y_test = stratified_split(X, y)

print("Split sizes:")
print(f"  Train : {len(X_train)} samples")
print(f"  Val   : {len(X_val)} samples")
print(f"  Test  : {len(X_test)} samples")

print("\\nClass-1 ratio (should be ~10% in every split):")
print(f"  Original : {y.mean():.2%}")
print(f"  Train    : {y_train.mean():.2%}")
print(f"  Val      : {y_val.mean():.2%}")
print(f"  Test     : {y_test.mean():.2%}")
`,
    },
    {
      id: "preprocessing-checkpoint",
      slug: "preprocessing-checkpoint",
      title: "Checkpoint: Full Preprocessing Pipeline",
      content: `# Checkpoint: Full Preprocessing Pipeline

You've spent this module learning the individual tools: imputing missing values, scaling features, encoding labels, detecting outliers, splitting data. Now it's time to weld them into a single, reusable pipeline that you can drop onto any dataset.

This checkpoint is **active** — you'll build, trace, and stress-test a complete NumPy preprocessing pipeline from scratch.

\`\`\`concept
{ "title": "What a Preprocessing Pipeline Actually Is", "variant": "mental-model", "content": "A pipeline is a sequence of pure transformations: each step takes a NumPy array in and returns a NumPy array out. The critical rule is fit-on-train, transform-both — statistics (mean, std, unique classes) are computed only on training data, then applied identically to validation and test data. Violating this rule causes data leakage." }
\`\`\`

---

## The Dataset We're Working With

We'll use a synthetic patient health dataset — 8 features, one binary label, and intentional messiness: missing values, mixed scales, and string categories.

| Feature | Type | Issue |
|---|---|---|
| \`age\` | numeric | a few NaNs |
| \`bmi\` | numeric | NaNs + outliers |
| \`blood_pressure\` | numeric | wide scale |
| \`glucose\` | numeric | wide scale |
| \`insulin\` | numeric | many NaNs |
| \`skin_thickness\` | numeric | NaNs |
| \`region\` | categorical | 4 string classes |
| \`smoker\` | categorical | binary yes/no |
| \`outcome\` | label | 0 / 1 |

A well-designed pipeline handles all of this in the correct order — and that order matters.

\`\`\`steps
{ "title": "Pipeline Execution Order", "steps": [ { "title": "1. Split First", "content": "Always split into train/val/test **before** any other step. Nothing about the validation or test set should influence the pipeline's fitted parameters." }, { "title": "2. Impute Missing Values", "content": "Replace NaNs using statistics computed only on the **training** split. For numeric columns use median (robust to outliers); for categorical columns use mode." }, { "title": "3. Detect & Clip Outliers", "content": "Use the IQR method on training data to compute fence values. Clip (not drop) values beyond 3×IQR so you don't lose rows." }, { "title": "4. Encode Categorical Features", "content": "Build a vocabulary from training categories. Map each string to an integer index. Unknown categories at test time map to -1 (or a special UNK slot)." }, { "title": "5. Scale Numeric Features", "content": "Compute mean and std on training data only. Apply standard scaling: \`z = (x - mean) / std\`. Categorical integer columns skip this step." }, { "title": "6. Verify & Return", "content": "Assert no NaNs remain, assert shapes are consistent, return \`(X_train, X_val, X_test, y_train, y_val, y_test)\` as float64 arrays." } ] }
\`\`\`

---

## Tracing Data Through the Pipeline

Watch one numeric column (\`bmi\`) and one categorical column (\`region\`) flow through each stage for a tiny 6-row dataset.

\`\`\`trace
{ "title": "bmi column: raw → imputed → clipped → scaled", "language": "python", "code": "import numpy as np\\n\\nbmi = np.array([22.5, np.nan, 45.0, 19.1, np.nan, 38.0])\\n# Step 1: compute median on available training values\\nmedian_bmi = np.nanmedian(bmi)\\nbmi_filled = np.where(np.isnan(bmi), median_bmi, bmi)\\n# Step 2: IQR clipping\\nQ1, Q3 = np.percentile(bmi_filled, [25, 75])\\nIQR = Q3 - Q1\\nbmi_clipped = np.clip(bmi_filled, Q1 - 3*IQR, Q3 + 3*IQR)\\n# Step 3: standard scaling\\nmean_bmi = bmi_clipped.mean()\\nstd_bmi  = bmi_clipped.std()\\nbmi_scaled = (bmi_clipped - mean_bmi) / std_bmi\\nprint(bmi_scaled)", "frames": [ { "line": 3, "vars": { "bmi": "[22.5, nan, 45.0, 19.1, nan, 38.0]" }, "note": "Raw input — 2 NaNs present", "stdout": "" }, { "line": 5, "vars": { "median_bmi": "30.25" }, "note": "Median computed ignoring NaNs", "stdout": "" }, { "line": 6, "vars": { "bmi_filled": "[22.5, 30.25, 45.0, 19.1, 30.25, 38.0]" }, "note": "NaNs replaced with median", "stdout": "" }, { "line": 9, "vars": { "Q1": "22.5", "Q3": "38.0", "IQR": "15.5" }, "note": "IQR computed on filled values", "stdout": "" }, { "line": 10, "vars": { "bmi_clipped": "[22.5, 30.25, 45.0, 19.1, 30.25, 38.0]" }, "note": "No values exceed 3×IQR fence — no clipping needed here", "stdout": "" }, { "line": 14, "vars": { "mean_bmi": "29.18", "std_bmi": "8.97" }, "note": "Scale parameters computed on clipped data", "stdout": "" }, { "line": 15, "vars": { "bmi_scaled": "[-0.74, 0.12, 1.76, -1.12, 0.12, 0.98]" }, "note": "Final scaled values — mean≈0, std≈1", "stdout": "[-0.74  0.12  1.76 -1.12  0.12  0.98]" } ], "speed": 900 }
\`\`\`

---

## Building the Full Pipeline

Now let's implement the complete, production-quality version. Read through it carefully — each function is one stage of the pipeline.

\`\`\`playground
{ "title": "Full NumPy Preprocessing Pipeline", "language": "python", "code": "import numpy as np\\n\\n# ── Reproducibility ──────────────────────────────────────────────\\nnp.random.seed(42)\\n\\n# ── Synthetic dataset (200 rows) ─────────────────────────────────\\nn = 200\\nage           = np.random.randint(20, 80, n).astype(float)\\nbmi           = np.random.normal(27, 6, n)\\nblood_pressure= np.random.normal(80, 12, n)\\nglucose       = np.random.normal(120, 30, n)\\ninsulin       = np.random.normal(80, 40, n)\\nskin_thickness= np.random.normal(20, 8, n)\\nregion        = np.random.choice(['north', 'south', 'east', 'west'], n)\\nsmoker        = np.random.choice(['yes', 'no'], n)\\noutcome       = (bmi > 28).astype(int)\\n\\n# Inject missing values ─────────────────────────────────────────\\nfor col in [age, bmi, insulin, skin_thickness]:\\n    idx = np.random.choice(n, size=int(0.10 * n), replace=False)\\n    col[idx] = np.nan\\n\\n# Inject outliers in bmi ────────────────────────────────────────\\nbmi[np.random.choice(n, 5, replace=False)] = np.random.uniform(70, 90, 5)\\n\\n# Stack numeric features, keep categoricals separate ───────────\\nX_num = np.column_stack([age, bmi, blood_pressure, glucose, insulin, skin_thickness])\\nX_cat = np.column_stack([region, smoker])   # object dtype\\ny     = outcome\\n\\nprint('Raw shapes:', X_num.shape, X_cat.shape, y.shape)\\nprint('NaN count  :', np.isnan(X_num).sum())\\n\\n\\n# ══════════════════════════════════════════════════════════════\\n# STEP 1 — Train / Val / Test split (60 / 20 / 20)\\n# ══════════════════════════════════════════════════════════════\\ndef train_val_test_split(X_num, X_cat, y, val_frac=0.2, test_frac=0.2, seed=42):\\n    rng   = np.random.default_rng(seed)\\n    idx   = rng.permutation(len(y))\\n    n_test = int(len(y) * test_frac)\\n    n_val  = int(len(y) * val_frac)\\n    test_idx  = idx[:n_test]\\n    val_idx   = idx[n_test:n_test + n_val]\\n    train_idx = idx[n_test + n_val:]\\n    return (X_num[train_idx], X_num[val_idx],  X_num[test_idx],\\n            X_cat[train_idx], X_cat[val_idx],  X_cat[test_idx],\\n            y[train_idx],     y[val_idx],       y[test_idx])\\n\\n(Xn_tr, Xn_val, Xn_te,\\n Xc_tr, Xc_val, Xc_te,\\n y_tr,  y_val,  y_te) = train_val_test_split(X_num, X_cat, y)\\n\\nprint('\\\\nSplit sizes — train:', len(y_tr), '| val:', len(y_val), '| test:', len(y_te))\\n\\n\\n# ══════════════════════════════════════════════════════════════\\n# STEP 2 — Impute missing values (fit on train)\\n# ══════════════════════════════════════════════════════════════\\ndef fit_imputer(X):\\n    \\"\\"\\"Returns per-column medians (ignoring NaN).\\"\\"\\"\\n    return np.nanmedian(X, axis=0)   # shape (n_features,)\\n\\ndef apply_imputer(X, medians):\\n    out = X.copy()\\n    for j in range(X.shape[1]):\\n        mask = np.isnan(out[:, j])\\n        out[mask, j] = medians[j]\\n    return out\\n\\nmedians  = fit_imputer(Xn_tr)\\nXn_tr    = apply_imputer(Xn_tr,  medians)\\nXn_val   = apply_imputer(Xn_val, medians)   # use TRAIN medians\\nXn_te    = apply_imputer(Xn_te,  medians)\\nprint('\\\\nAfter imputation — NaN count:', np.isnan(Xn_tr).sum())\\n\\n\\n# ══════════════════════════════════════════════════════════════\\n# STEP 3 — Clip outliers via IQR (fit on train)\\n# ══════════════════════════════════════════════════════════════\\ndef fit_iqr_clipper(X, factor=3.0):\\n    Q1 = np.percentile(X, 25, axis=0)\\n    Q3 = np.percentile(X, 75, axis=0)\\n    IQR = Q3 - Q1\\n    return Q1 - factor * IQR, Q3 + factor * IQR   # lower, upper fences\\n\\ndef apply_iqr_clipper(X, lower, upper):\\n    return np.clip(X, lower, upper)\\n\\nlower, upper = fit_iqr_clipper(Xn_tr)\\nXn_tr  = apply_iqr_clipper(Xn_tr,  lower, upper)\\nXn_val = apply_iqr_clipper(Xn_val, lower, upper)\\nXn_te  = apply_iqr_clipper(Xn_te,  lower, upper)\\nprint('BMI max after clipping:', Xn_tr[:, 1].max().round(2))\\n\\n\\n# ══════════════════════════════════════════════════════════════\\n# STEP 4 — Encode categorical features (fit on train)\\n# ══════════════════════════════════════════════════════════════\\ndef fit_encoder(X_cat):\\n    \\"\\"\\"Returns list of vocabularies, one per column.\\"\\"\\"\\n    vocabs = []\\n    for j in range(X_cat.shape[1]):\\n        unique_vals = np.unique(X_cat[:, j])\\n        vocab = {v: i for i, v in enumerate(unique_vals)}\\n        vocabs.append(vocab)\\n    return vocabs\\n\\ndef apply_encoder(X_cat, vocabs):\\n    out = np.zeros((X_cat.shape[0], X_cat.shape[1]), dtype=float)\\n    for j, vocab in enumerate(vocabs):\\n        for i, val in enumerate(X_cat[:, j]):\\n            out[i, j] = vocab.get(val, -1)  # -1 for unknown\\n    return out\\n\\nvocabs  = fit_encoder(Xc_tr)\\nXc_tr   = apply_encoder(Xc_tr,  vocabs)\\nXc_val  = apply_encoder(Xc_val, vocabs)\\nXc_te   = apply_encoder(Xc_te,  vocabs)\\nprint('\\\\nEncoded categories sample:\\\\n', Xc_tr[:4])\\n\\n\\n# ══════════════════════════════════════════════════════════════\\n# STEP 5 — Standard scale numeric features (fit on train)\\n# ══════════════════════════════════════════════════════════════\\ndef fit_scaler(X):\\n    return X.mean(axis=0), X.std(axis=0)\\n\\ndef apply_scaler(X, mean, std):\\n    std_safe = np.where(std == 0, 1.0, std)  # avoid divide-by-zero\\n    return (X - mean) / std_safe\\n\\ntr_mean, tr_std = fit_scaler(Xn_tr)\\nXn_tr  = apply_scaler(Xn_tr,  tr_mean, tr_std)\\nXn_val = apply_scaler(Xn_val, tr_mean, tr_std)\\nXn_te  = apply_scaler(Xn_te,  tr_mean, tr_std)\\nprint('\\\\nAfter scaling — train mean (should ≈ 0):', Xn_tr.mean(axis=0).round(3))\\nprint('After scaling — train std  (should ≈ 1):', Xn_tr.std(axis=0).round(3))\\n\\n\\n# ══════════════════════════════════════════════════════════════\\n# STEP 6 — Combine and verify\\n# ══════════════════════════════════════════════════════════════\\nX_train = np.hstack([Xn_tr, Xc_tr]).astype(np.float64)\\nX_val   = np.hstack([Xn_val, Xc_val]).astype(np.float64)\\nX_test  = np.hstack([Xn_te, Xc_te]).astype(np.float64)\\n\\nassert not np.isnan(X_train).any(), 'NaNs in training set!'\\nassert not np.isnan(X_val).any(),   'NaNs in validation set!'\\nassert not np.isnan(X_test).any(),  'NaNs in test set!'\\nassert X_train.shape[1] == X_val.shape[1] == X_test.shape[1]\\n\\nprint('\\\\n✓ Pipeline complete!')\\nprint('Final shapes — X_train:', X_train.shape,\\n      '| X_val:', X_val.shape,\\n      '| X_test:', X_test.shape)\\nprint('Label counts (train)  — 0:', (y_tr==0).sum(), '| 1:', (y_tr==1).sum())\\n", "runnable": true }
\`\`\`

---

## Why Order Matters: A Common Mistake

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "WRONG — scale before split", "code": "# Leakage! Scaler sees ALL rows (incl. test)\\nmean = X_num.mean(axis=0)\\nstd  = X_num.std(axis=0)\\nX_scaled = (X_num - mean) / std   # applied globally\\n\\n# Split AFTER scaling — test info leaked into scaler\\nX_train, X_test = X_scaled[:160], X_scaled[160:]" }, "after": { "label": "CORRECT — split before fit", "code": "# Split first — test set is invisible\\nX_train, X_test = X_num[:160], X_num[160:]\\n\\n# Fit scaler ONLY on training data\\nmean = X_train.mean(axis=0)\\nstd  = X_train.std(axis=0)\\n\\n# Apply the SAME parameters to both\\nX_train = (X_train - mean) / std\\nX_test  = (X_test  - mean) / std  # use train mean/std!" } }
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "Data Leakage Kills Model Evaluation", "content": "If you compute statistics (mean, std, quantiles, category vocabulary) on the full dataset before splitting, your model indirectly 'sees' test data during training. Accuracy metrics will be optimistic and unreliable. Always: **fit on train, transform all**." }
\`\`\`

---

## Visualizing the Pipeline as a System

\`\`\`sysdiag
{ "title": "Preprocessing Pipeline Data Flow", "width": 620, "height": 320, "nodes": [ { "id": "raw", "label": "Raw Dataset", "x": 60, "y": 160, "kind": "storage" }, { "id": "split", "label": "Train/Val/Test\\nSplit", "x": 180, "y": 160, "kind": "service" }, { "id": "impute", "label": "Imputer\\n(fit on train)", "x": 320, "y": 80, "kind": "service" }, { "id": "clip", "label": "IQR Clipper\\n(fit on train)", "x": 320, "y": 160, "kind": "service" }, { "id": "encode", "label": "Encoder\\n(fit on train)", "x": 320, "y": 240, "kind": "service" }, { "id": "scale", "label": "Scaler\\n(fit on train)", "x": 460, "y": 120, "kind": "service" }, { "id": "out", "label": "ML-Ready\\nArrays", "x": 560, "y": 200, "kind": "storage" } ], "edges": [ { "from": "raw", "to": "split", "label": "all rows" }, { "from": "split", "to": "impute", "label": "numeric" }, { "from": "split", "to": "clip", "label": "numeric" }, { "from": "split", "to": "encode", "label": "categorical" }, { "from": "impute", "to": "scale", "label": "filled" }, { "from": "clip", "to": "scale", "label": "clipped" }, { "from": "encode", "to": "out", "label": "int codes" }, { "from": "scale", "to": "out", "label": "z-scores" } ], "annotations": { "split": "First operation — creates invisible firewall between train and test statistics", "scale": "Mean and std computed only from training rows; same values applied to val and test", "out": "float64 arrays, no NaNs, consistent number of columns across all three splits" } }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Implement the Scaler", "prompt": "Complete the \`fit_scaler\` and \`apply_scaler\` functions. The scaler should compute mean and standard deviation column-wise on training data, then apply z-score normalization.", "language": "python", "template": "import numpy as np\\n\\ndef fit_scaler(X_train):\\n    mean = X_train.___(axis=___)\\n    std  = X_train.___(axis=___)\\n    return mean, std\\n\\ndef apply_scaler(X, mean, std):\\n    std_safe = np.where(std == 0, ___, std)\\n    return (X - ___) / ___\\n\\n# Test\\nX_tr = np.array([[1.0, 200.0], [2.0, 400.0], [3.0, 600.0]])\\nX_te = np.array([[4.0, 800.0]])\\nmean, std = fit_scaler(X_tr)\\nprint(apply_scaler(X_tr, mean, std))\\nprint(apply_scaler(X_te, mean, std))  # should be > 1.0", "blanks": [ { "answer": "mean", "hint": "NumPy method to compute average" }, { "answer": "0", "hint": "We want per-column stats, so reduce along which axis?" }, { "answer": "std", "hint": "NumPy method to compute standard deviation" }, { "answer": "0", "hint": "Same axis as mean" }, { "answer": "1.0", "hint": "What value avoids division-by-zero for constant columns?" }, { "answer": "mean", "hint": "Subtract the center" }, { "answer": "std_safe", "hint": "Divide by the safe standard deviation" } ] }
\`\`\`

---

## Making It Reusable: Pipeline as a Class

The functions above work, but production code wraps them in an object so you can save and reuse the fitted parameters.

\`\`\`collapse
{ "title": "Deep Dive: Wrapping the Pipeline in a Class", "content": "\`\`\`python\\nimport numpy as np\\n\\nclass PreprocessingPipeline:\\n    \\"\\"\\"Fits on training data; transforms any split.\\"\\"\\"\\n\\n    def fit(self, X_num, X_cat):\\n        # Imputer\\n        self.medians_ = np.nanmedian(X_num, axis=0)\\n        X_filled = self._impute(X_num)\\n\\n        # IQR clipper\\n        Q1 = np.percentile(X_filled, 25, axis=0)\\n        Q3 = np.percentile(X_filled, 75, axis=0)\\n        IQR = Q3 - Q1\\n        self.lower_ = Q1 - 3 * IQR\\n        self.upper_ = Q3 + 3 * IQR\\n        X_clipped = np.clip(X_filled, self.lower_, self.upper_)\\n\\n        # Encoder\\n        self.vocabs_ = []\\n        for j in range(X_cat.shape[1]):\\n            unique = np.unique(X_cat[:, j])\\n            self.vocabs_.append({v: i for i, v in enumerate(unique)})\\n\\n        # Scaler\\n        self.mean_ = X_clipped.mean(axis=0)\\n        self.std_  = X_clipped.std(axis=0)\\n        return self\\n\\n    def transform(self, X_num, X_cat):\\n        X = self._impute(X_num)\\n        X = np.clip(X, self.lower_, self.upper_)\\n        X = (X - self.mean_) / np.where(self.std_ == 0, 1.0, self.std_)\\n        Xc = np.zeros((X_cat.shape[0], X_cat.shape[1]))\\n        for j, vocab in enumerate(self.vocabs_):\\n            for i, val in enumerate(X_cat[:, j]):\\n                Xc[i, j] = vocab.get(val, -1)\\n        return np.hstack([X, Xc]).astype(np.float64)\\n\\n    def fit_transform(self, X_num, X_cat):\\n        return self.fit(X_num, X_cat).transform(X_num, X_cat)\\n\\n    def _impute(self, X):\\n        out = X.copy()\\n        for j in range(X.shape[1]):\\n            mask = np.isnan(out[:, j])\\n            out[mask, j] = self.medians_[j]\\n        return out\\n\\n# Usage:\\npipe = PreprocessingPipeline()\\nX_train = pipe.fit_transform(Xn_tr_raw, Xc_tr_raw)\\nX_val   = pipe.transform(Xn_val_raw, Xc_val_raw)\\nX_test  = pipe.transform(Xn_te_raw,  Xc_te_raw)\\n\`\`\`\\n\\nThe key insight: \`fit()\` stores parameters on \`self\` (medians, fences, vocabs, mean, std). \`transform()\` uses only those stored parameters — it never looks at the current data to compute new statistics. This is exactly how \`sklearn.Pipeline\` works under the hood." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Preprocessing Pipeline Quiz", "questions": [ { "question": "You have a dataset of 1,000 rows. You compute the mean and std for scaling on all 1,000 rows, then split 80/20. What problem does this cause?", "options": [ "The model will train faster than expected", "Data leakage — test set statistics contaminate the scaler parameters", "The scaler will produce NaN values", "The validation accuracy will be too low" ], "answer": 1, "explanation": "Computing statistics on the full dataset before splitting means test-set information leaks into your scaler parameters. Evaluation metrics become optimistic and unreliable because the model indirectly 'saw' test data. Always split first, then fit parameters exclusively on the training portion." }, { "question": "Your training set has a 'region' column with values ['north', 'south', 'east', 'west']. At inference time, a new record arrives with region = 'central'. What should your encoder return for this unknown category?", "options": [ "Raise a KeyError and crash the pipeline", "Assign it the value 0 (same as the first known category)", "Assign a sentinel value like -1 to flag it as unknown", "Drop the entire row" ], "answer": 2, "explanation": "Returning a sentinel value (e.g., -1) is the correct approach. Crashing is unacceptable in production. Assigning it to an existing category would be factually wrong and could mislead the model. Dropping rows loses data. The sentinel allows downstream code to handle unknowns gracefully." }, { "question": "Why do we use median (not mean) for imputing missing numeric values?", "options": [ "Median is always faster to compute than mean", "Median is resistant to outliers; the mean can be pulled far from typical values by extreme entries", "Mean imputation causes data leakage", "NumPy does not have a nanmean function" ], "answer": 1, "explanation": "The median is the 50th percentile — it is not affected by extreme outlier values. If a feature like 'insulin' has a few extreme values (e.g., 800 vs. a typical 80), the mean would be dragged upward and would be a poor representative value for filling gaps. NumPy's nanmedian ignores NaNs when computing the statistic." }, { "question": "You apply IQR clipping with a factor of 3. What does this actually do to outlier values?", "options": [ "Removes (drops) all rows where any feature is outside the fence", "Replaces outlier values with NaN for later imputation", "Clips values to the fence boundaries — values beyond 3×IQR become exactly equal to the fence", "Logs a warning but makes no changes to the data" ], "answer": 2, "explanation": "np.clip(X, lower, upper) caps values at the fence boundaries without removing rows. A value of 95 clipped to an upper fence of 70 becomes 70. This preserves every row while bounding the influence of extreme values on the scaler's mean and std estimates." }, { "question": "After standard scaling, what should the approximate mean and standard deviation of the training features be?", "options": [ "Mean = 1, Std = 0", "Mean = 0, Std = 1", "Mean = 0.5, Std = 0.5", "Mean and std depend on the original data and cannot be predicted" ], "answer": 1, "explanation": "Standard (z-score) scaling transforms each feature to have mean ≈ 0 and std ≈ 1 on the training set. The formula z = (x - mean) / std centers the data (subtracting mean → zero mean) and normalizes spread (dividing by std → unit std). Note this holds exactly on training data; val/test sets will be close but not exactly 0/1 since they use training statistics." } ] }
\`\`\`

---

## Connecting to the Broader Course

At this point your NumPy toolbox contains everything needed to hand clean data to a learning algorithm. Here's where each piece fits into the full ML pipeline you'll build in upcoming modules:

\`\`\`tabs
{ "tabs": [ { "label": "Linear Regression", "icon": "📈", "content": "Linear regression expects features on comparable scales — large-magnitude inputs like \`blood_pressure\` dominate the gradient update if unscaled. Your z-score scaler fixes this, letting the model converge reliably via gradient descent." }, { "label": "Logistic Regression", "icon": "🔀", "content": "Logistic regression uses the sigmoid function. With unscaled inputs, the sigmoid saturates (output ≈ 0 or 1) and gradients vanish. Proper scaling keeps activations in the sensitive middle region of sigmoid where learning happens." }, { "label": "Neural Networks", "icon": "🧠", "content": "Every layer in a neural network multiplies inputs by weights. Unscaled features cause activations to explode or collapse across layers. Your scaler ensures the network starts in a healthy regime — same reason BatchNorm was invented (it re-normalizes mid-network)." }, { "label": "NLP Pipelines", "icon": "📝", "content": "Text preprocessing is conceptually identical: tokenize (encode), count/TF-IDF (scale), remove rare words (clip). The same 'fit on train, transform both' rule applies — your vocabulary is built only from training documents." } ] }
\`\`\`

---

\`\`\`callout
{ "type": "tip", "title": "NumPy is the Foundation — Not the Ceiling", "content": "NumPy's vectorized operations are backed by C and Fortran — they are fast. The \`from scratch\` approach here isn't about avoiding frameworks forever; it's about understanding what those frameworks do. When you later call \`StandardScaler().fit_transform(X_train)\` in scikit-learn, you'll know exactly what's happening inside: fit stores mean/std, transform applies z = (x-mean)/std. That understanding makes you a far better debugger and optimizer." }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Split data FIRST — every fitted parameter (median, IQR, vocabulary, mean, std) must be computed exclusively on training data to prevent data leakage.", "The pipeline order matters: split → impute → clip → encode → scale. Scaling before imputation would operate on NaN-containing columns.", "Use median for numeric imputation (robust to outliers) and mode for categorical imputation.", "IQR clipping uses factor × IQR fences to bound extreme values without losing rows — np.clip preserves all observations.", "Encode unknown categories at inference time with a sentinel (e.g., -1) rather than crashing or silently misclassifying.", "NumPy's vectorized operations (nanmedian, percentile, clip, mean, std) make these pipelines efficient — avoid Python loops over rows wherever possible.", "Wrapping pipeline stages in a class with fit() / transform() methods mirrors how scikit-learn Transformers work and makes your pipeline reusable across experiments." ] }
\`\`\``,
      starterCode: `import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer

# Sample dataset: student exam results
data = {
    'age':        [22, 25, None, 28, 21, 30, None, 24],
    'study_hours':[5.0, 8.0, 6.0, None, 4.0, 9.0, 7.0, None],
    'score':      [72, 85, 78, 90, 65, 95, 82, 70],
    'grade':      ['B', 'A', 'B', 'A', 'C', 'A', 'B', 'C']
}
df = pd.DataFrame(data)

print("Original DataFrame:")
print(df)
print()

# TODO 1: Separate features and target
# - Assign numeric columns ['age', 'study_hours', 'score'] to X
# - Assign the 'grade' column to y
X = None
y = None

# TODO 2: Handle missing values in X
# - Create a SimpleImputer that fills NaN with the column mean
# - Fit the imputer on X and transform X
# - Store the result back in X (as a DataFrame with the same column names)
imputer = None
X = None

# TODO 3: Scale the numeric features in X
# - Create a StandardScaler
# - Fit the scaler on X and transform X
# - Store the result back in X (as a DataFrame with the same column names)
scaler = None
X = None

# TODO 4: Encode the target labels in y
# - Create a LabelEncoder
# - Fit the encoder on y and transform y
# - Store the result back in y
le = None
y = None

print("Preprocessed features (X):")
print(X.round(3))
print()
print("Encoded labels (y):", y)
print("Label mapping:", dict(zip(le.classes_, le.transform(le.classes_))))
`,
      solutionCode: `import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer

# Sample dataset: student exam results
data = {
    'age':        [22, 25, None, 28, 21, 30, None, 24],
    'study_hours':[5.0, 8.0, 6.0, None, 4.0, 9.0, 7.0, None],
    'score':      [72, 85, 78, 90, 65, 95, 82, 70],
    'grade':      ['B', 'A', 'B', 'A', 'C', 'A', 'B', 'C']
}
df = pd.DataFrame(data)

print("Original DataFrame:")
print(df)
print()

# Step 1: Separate features and target
# X holds the numeric input features; y holds the categorical label we want to predict
numeric_cols = ['age', 'study_hours', 'score']
X = df[numeric_cols].copy()
y = df['grade'].copy()

# Step 2: Handle missing values
# SimpleImputer with strategy='mean' replaces each NaN with that column's mean,
# so no row is dropped and the dataset stays balanced.
imputer = SimpleImputer(strategy='mean')
X = pd.DataFrame(imputer.fit_transform(X), columns=numeric_cols)

# Step 3: Scale numeric features
# StandardScaler transforms each feature to zero mean and unit variance.
# This prevents columns with large ranges (e.g. 'score') from dominating the model.
scaler = StandardScaler()
X = pd.DataFrame(scaler.fit_transform(X), columns=numeric_cols)

# Step 4: Encode target labels
# LabelEncoder converts string labels ('A', 'B', 'C') to integers (0, 1, 2),
# which most sklearn estimators require for classification.
le = LabelEncoder()
y = le.fit_transform(y)

print("Preprocessed features (X):")
print(X.round(3))
print()
print("Encoded labels (y):", y)
print("Label mapping:", dict(zip(le.classes_, le.transform(le.classes_))))
`,
    },
  ],
};
