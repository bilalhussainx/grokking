import { Module } from "../types";

export const module3: Module = {
  id: "data-cleaning",
  title: "Data Cleaning & Feature Engineering",
  description: "Handle messy real-world data: missing values, outliers, encoding, scaling, and creating features that improve model performance",
  lessons: [
    {
      id: "cleaning-techniques",
      slug: "cleaning-techniques",
      title: "Data Cleaning: Handling Real-World Messy Data",
      content: `# Data Cleaning

80% of data science work is cleaning data. The quality of your data determines the ceiling of your model's performance.

---

\`\`\`concept
{
  "title": "Garbage In, Garbage Out",
  "variant": "warning",
  "content": "A model trained on bad data learns bad patterns. Missing values imputed with mean when they're actually MCAR vs MNAR have different implications. Outliers left in distort regressions. Categories with typos (New York, new york, NYC) become separate features. Clean first, model second."
}
\`\`\`

---

## Missing Value Strategies

\`\`\`python
import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer, KNNImputer

df = pd.read_csv('data.csv')

# --- Understand the missingness pattern FIRST ---
# MCAR (Missing Completely At Random): impute safely
# MAR (Missing At Random): impute with model
# MNAR (Missing Not At Random): creates selection bias — careful!

# --- Strategy 1: Drop (only if < 5% missing AND MCAR) ---
df_clean = df.dropna(subset=['critical_column'])

# --- Strategy 2: Simple Imputation ---
numeric_cols = df.select_dtypes(include='number').columns

# Mean — for normally distributed, no outliers
mean_imputer = SimpleImputer(strategy='mean')
df[numeric_cols] = mean_imputer.fit_transform(df[numeric_cols])

# Median — robust to outliers (preferred for skewed distributions)
med_imputer = SimpleImputer(strategy='median')

# Mode — for categorical
cat_imputer = SimpleImputer(strategy='most_frequent')

# --- Strategy 3: KNN Imputation (uses similar rows) ---
knn_imputer = KNNImputer(n_neighbors=5)
df_imputed = pd.DataFrame(
    knn_imputer.fit_transform(df[numeric_cols]),
    columns=numeric_cols
)

# --- Strategy 4: Flag missing as a feature ---
# Sometimes missingness itself is informative!
df['salary_was_missing'] = df['salary'].isna().astype(int)
df['salary'].fillna(df['salary'].median(), inplace=True)
\`\`\`

## Outlier Detection & Handling

\`\`\`python
# --- Method 1: IQR (Interquartile Range) ---
Q1 = df['salary'].quantile(0.25)
Q3 = df['salary'].quantile(0.75)
IQR = Q3 - Q1
lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR

# Flag outliers:
df['is_outlier'] = (df['salary'] < lower) | (df['salary'] > upper)

# Cap (Winsorize) instead of removing:
df['salary_capped'] = df['salary'].clip(lower, upper)

# --- Method 2: Z-score ---
from scipy import stats
z_scores = np.abs(stats.zscore(df['salary'].dropna()))
# Typically: |z| > 3 is an outlier

# --- Method 3: IsolationForest (multivariate) ---
from sklearn.ensemble import IsolationForest
iso = IsolationForest(contamination=0.05, random_state=42)
df['anomaly'] = iso.fit_predict(df[numeric_cols])
# -1 = outlier, 1 = normal
\`\`\`

## Feature Engineering

\`\`\`python
# --- Encoding Categorical Variables ---

# Option 1: One-Hot Encoding (for nominal categories, < 15 unique values)
df_encoded = pd.get_dummies(df, columns=['dept', 'city'], drop_first=True)

# Option 2: Label Encoding (for ordinal categories)
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
df['education_encoded'] = le.fit_transform(df['education'])
# But: LabelEncoder imposes ordinal relationship — use only for tree models

# Option 3: Target Encoding (for high-cardinality)
# Mean of target variable per category — avoids explosion of columns
from category_encoders import TargetEncoder
te = TargetEncoder()
df['city_encoded'] = te.fit_transform(df['city'], df['target'])

# --- Scaling ---
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler

# StandardScaler: mean=0, std=1 (use for algorithms sensitive to scale: SVM, KNN, LR)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # NEVER fit on test set!

# MinMaxScaler: range [0, 1] — sensitive to outliers
# RobustScaler: median/IQR — outlier resistant

# --- Creating New Features ---
# Date features:
df['date'] = pd.to_datetime(df['date'])
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
df['day_of_week'] = df['date'].dt.dayofweek
df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)

# Interaction features:
df['price_per_sqft'] = df['price'] / df['sqft']
df['revenue_per_customer'] = df['revenue'] / df['customer_count']

# Binning continuous to categorical:
df['age_group'] = pd.cut(df['age'],
    bins=[0, 25, 35, 50, 100],
    labels=['young', 'adult', 'mid', 'senior']
)
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Why should you NEVER call scaler.fit_transform() on test data?",
      "options": [
        "It's slower on test data",
        "It causes data leakage — the scaler learns test set statistics (mean, std), allowing information from the future to influence training. Always fit on training data only, then transform both.",
        "test data doesn't have the right columns",
        "StandardScaler only works on training data"
      ],
      "answer": 1,
      "explanation": "Data leakage is when information from the test set (or future) influences training. If you fit the scaler on all data, the mean and std computed include test set values. In production, your scaler won't have access to future data. Always: fit on training set → transform training → transform test with the SAME fitted scaler. Same rule applies to imputers, encoders, and any preprocessing step."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
