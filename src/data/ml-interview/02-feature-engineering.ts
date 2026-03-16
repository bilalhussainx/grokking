import { Module } from "../types";

export const featureEngineeringModule: Module = {
  id: "ml-feature-engineering",
  title: "Feature Engineering",
  description:
    "Master the art of feature engineering — handling missing data, scaling, encoding, feature selection, and dimensionality reduction with PCA.",
  lessons: [
    {
      id: "ml-fe-1",
      slug: "feature-engineering-intro",
      title: "Feature Engineering Introduction",
      content: `# Feature Engineering Introduction

## Why Feature Engineering Matters

Feature engineering is often the single biggest lever for improving model performance. Andrew Ng famously said: "Applied machine learning is basically feature engineering." In interviews, demonstrating strong feature engineering intuition sets you apart.

## What Is Feature Engineering?

Feature engineering is the process of transforming raw data into features that better represent the underlying patterns for your model.

\`\`\`
Raw Data → Feature Engineering → Model-Ready Features

Examples:
  Timestamp "2024-03-15 14:30"  →  hour=14, day_of_week=5, is_weekend=0
  Address "123 Main St, NYC"    →  latitude=40.7, longitude=-74.0, zip=10001
  Text "Great product!"         →  sentiment=0.9, word_count=2, has_exclamation=1
\`\`\`

## The Feature Engineering Pipeline

A typical pipeline includes these steps, and the order matters:

\`\`\`
1. Handle Missing Data      → Imputation or removal
2. Feature Transformation   → Log, sqrt, polynomial
3. Scaling & Normalization  → StandardScaler, MinMaxScaler
4. Encoding Categoricals    → One-hot, label, target encoding
5. Feature Creation         → Interactions, aggregations, domain features
6. Feature Selection        → Remove irrelevant or redundant features
7. Dimensionality Reduction → PCA, feature hashing
\`\`\`

## Feature Types

Understanding feature types guides your engineering decisions:

\`\`\`
Numerical Continuous:   age, salary, temperature
  → Scale, normalize, bin, log-transform

Numerical Discrete:     count_of_orders, num_children
  → Often treated as continuous, sometimes as categorical

Categorical Nominal:    color, country, browser_type
  → One-hot encode (no ordering)

Categorical Ordinal:    education_level, rating (1-5)
  → Label encode (preserve ordering)

Temporal:               timestamps, durations
  → Extract components, compute recency, create windows

Text:                   reviews, descriptions
  → TF-IDF, embeddings, n-grams

Geospatial:             lat/long, addresses
  → Distance features, clustering, geohashing
\`\`\`

## Interview Tip

When asked about feature engineering, always start with the business context. The best features encode domain knowledge. For a fraud detection model, features like "transaction amount relative to user average" or "number of transactions in last hour" are more powerful than raw amounts.

## Exercise

Explore a dataset and identify the feature types and potential engineering opportunities.`,
      starterCode: `import pandas as pd
import numpy as np

def analyze_features():
    """Create a sample dataset and identify feature types."""
    df = pd.DataFrame({
        'age': [25, 32, np.nan, 45, 28],
        'salary': [50000, 75000, 60000, 90000, 55000],
        'department': ['engineering', 'sales', 'engineering', 'sales', 'marketing'],
        'education': ['bachelor', 'master', 'phd', 'bachelor', 'master'],
        'join_date': pd.to_datetime(['2020-01-15', '2019-06-20', '2021-03-10',
                                      '2018-11-05', '2022-07-01']),
        'performance_rating': [4, 3, 5, 2, 4],
    })
    # TODO: Print dtypes and identify feature types
    # TODO: Identify which columns have missing values
    # TODO: Suggest 3 engineered features from the existing columns
    pass

analyze_features()`,
      solutionCode: `import pandas as pd
import numpy as np

def analyze_features():
    """Create a sample dataset and identify feature types."""
    df = pd.DataFrame({
        'age': [25, 32, np.nan, 45, 28],
        'salary': [50000, 75000, 60000, 90000, 55000],
        'department': ['engineering', 'sales', 'engineering', 'sales', 'marketing'],
        'education': ['bachelor', 'master', 'phd', 'bachelor', 'master'],
        'join_date': pd.to_datetime(['2020-01-15', '2019-06-20', '2021-03-10',
                                      '2018-11-05', '2022-07-01']),
        'performance_rating': [4, 3, 5, 2, 4],
    })

    print("=== Feature Analysis ===")
    print(f"\\nData Types:\\n{df.dtypes}")
    print(f"\\nMissing Values:\\n{df.isnull().sum()}")
    print(f"\\nFeature Types:")
    print("  age                → Numerical Continuous (has NaN)")
    print("  salary             → Numerical Continuous")
    print("  department         → Categorical Nominal")
    print("  education          → Categorical Ordinal")
    print("  join_date          → Temporal")
    print("  performance_rating → Categorical Ordinal / Discrete")

    # Engineered features
    df['tenure_days'] = (pd.Timestamp.now() - df['join_date']).dt.days
    df['salary_per_rating'] = df['salary'] / df['performance_rating']
    df['is_senior'] = (df['age'] > 35).astype(int)

    print(f"\\nEngineered Features:")
    print(f"  tenure_days:      {df['tenure_days'].tolist()}")
    print(f"  salary_per_rating: {df['salary_per_rating'].tolist()}")
    print(f"  is_senior:        {df['is_senior'].tolist()}")

analyze_features()`,
    },
    {
      id: "ml-fe-2",
      slug: "handling-missing-data",
      title: "Handling Missing Data",
      content: `# Handling Missing Data

## Why Missing Data Matters

Real-world datasets almost always have missing values. How you handle them directly impacts model performance and can introduce bias if done incorrectly. Interviewers frequently ask about missing data strategies because it reveals practical experience.

## Types of Missing Data

\`\`\`
MCAR (Missing Completely At Random):
  Missingness is unrelated to any variable.
  Example: A sensor randomly fails.
  Safe to drop rows without introducing bias.

MAR (Missing At Random):
  Missingness depends on other observed variables.
  Example: Younger users skip the "income" field more often.
  Can impute using other features.

MNAR (Missing Not At Random):
  Missingness depends on the missing value itself.
  Example: High-income people refuse to report income.
  Most dangerous — imputation may introduce bias.
\`\`\`

## Strategies

\`\`\`
Strategy              When to Use                    Risk
──────────────────────────────────────────────────────────────
Drop rows             MCAR, <5% missing              Lose data
Drop columns          >50% missing in column          Lose feature
Mean/Median impute    Numerical, MCAR                 Distorts distribution
Mode impute           Categorical, MCAR               Distorts distribution
KNN impute            MAR, moderate missing            Slow on large data
Iterative impute      MAR, complex relationships       Risk of overfitting
Indicator feature     Any type                        Adds a column
Forward/Back fill     Time series                      Assumes continuity
Model-based           MNAR, when pattern matters       Complex
\`\`\`

## The Indicator Trick

Always consider adding a binary "is_missing" indicator column alongside imputation. This lets the model learn whether missingness itself is informative.

\`\`\`python
# Before: [25, NaN, 30]
# After imputation: [25, 27.5, 30]
# Indicator:        [0,  1,    0]
\`\`\`

## Common Interview Questions

**Q: "How do you handle missing data in production?"**
A: Use the same imputation statistics computed on training data. Never compute imputation values from test or production data — this causes data leakage.

**Q: "Should you impute before or after train/test split?"**
A: After. Compute imputation statistics on training data only, then apply to test data. Use sklearn Pipeline to automate this.

**Q: "What if 40% of a column is missing?"**
A: Consider whether the missingness pattern is informative (create indicator). If the feature is not critical, drop it. If critical, use sophisticated imputation like IterativeImputer or domain knowledge.

## Exercise

Implement multiple imputation strategies and compare their impact.`,
      starterCode: `import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.datasets import load_iris

def compare_imputation_strategies():
    """Compare different imputation methods on model performance."""
    data = load_iris()
    X = pd.DataFrame(data.data, columns=data.feature_names)
    y = data.target

    # Introduce 20% missing values randomly
    np.random.seed(42)
    mask = np.random.random(X.shape) < 0.2
    X_missing = X.copy()
    X_missing[mask] = np.nan

    print(f"Missing values per column:\\n{X_missing.isnull().sum()}")

    # TODO: Create pipelines with different imputation strategies:
    # 1. Mean imputation
    # 2. Median imputation
    # 3. KNN imputation
    # TODO: Compare cross_val_score for each
    pass

compare_imputation_strategies()`,
      solutionCode: `import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.datasets import load_iris

def compare_imputation_strategies():
    """Compare different imputation methods on model performance."""
    data = load_iris()
    X = pd.DataFrame(data.data, columns=data.feature_names)
    y = data.target

    # Introduce 20% missing values randomly
    np.random.seed(42)
    mask = np.random.random(X.shape) < 0.2
    X_missing = X.copy()
    X_missing[mask] = np.nan

    print(f"Missing values per column:\\n{X_missing.isnull().sum()}\\n")

    strategies = {
        "Mean Imputation": SimpleImputer(strategy="mean"),
        "Median Imputation": SimpleImputer(strategy="median"),
        "KNN Imputation (k=5)": KNNImputer(n_neighbors=5),
    }

    for name, imputer in strategies.items():
        pipeline = Pipeline([
            ("imputer", imputer),
            ("clf", RandomForestClassifier(n_estimators=100, random_state=42))
        ])
        scores = cross_val_score(pipeline, X_missing, y, cv=5, scoring="accuracy")
        print(f"{name}: {scores.mean():.4f} (+/- {scores.std():.4f})")

    # Baseline: no missing data
    baseline = Pipeline([
        ("clf", RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    baseline_scores = cross_val_score(baseline, X, y, cv=5, scoring="accuracy")
    print(f"\\nBaseline (no missing): {baseline_scores.mean():.4f} (+/- {baseline_scores.std():.4f})")

compare_imputation_strategies()`,
    },
    {
      id: "ml-fe-3",
      slug: "scaling-normalization",
      title: "Scaling & Normalization",
      content: `# Scaling & Normalization

## Why Scale Features?

Many ML algorithms are sensitive to feature scales. If one feature ranges from 0-1 and another from 0-1,000,000, the larger feature will dominate distance calculations and gradient updates.

## Algorithms That Need Scaling

\`\`\`
NEEDS scaling:                    Does NOT need scaling:
  Linear/Logistic Regression        Decision Trees
  SVM                               Random Forests
  KNN                               Gradient Boosted Trees
  K-Means                           Naive Bayes
  PCA
  Neural Networks
  Regularized models (L1/L2)
\`\`\`

**Rule of thumb:** If the algorithm uses distances or gradients, scale your features.

## Scaling Methods

\`\`\`
StandardScaler (Z-score normalization):
  x_scaled = (x - mean) / std
  Result: mean=0, std=1
  Use when: Features are roughly Gaussian
  Sensitive to outliers: Yes

MinMaxScaler:
  x_scaled = (x - min) / (max - min)
  Result: values in [0, 1]
  Use when: You need bounded values (e.g., neural networks)
  Sensitive to outliers: Very

RobustScaler:
  x_scaled = (x - median) / IQR
  Result: centered on median, scaled by interquartile range
  Use when: Data has outliers
  Sensitive to outliers: No (by design)

MaxAbsScaler:
  x_scaled = x / max(|x|)
  Result: values in [-1, 1]
  Use when: Sparse data (preserves zeros)

Normalizer (L2):
  x_scaled = x / ||x||₂
  Scales each SAMPLE (row) to unit norm
  Use when: Text data (TF-IDF), comparing directions not magnitudes
\`\`\`

## Log Transform

For heavily right-skewed distributions (income, click counts, prices):

\`\`\`
x_transformed = log(x + 1)    # +1 to handle zeros

Before: [1, 10, 100, 1000, 10000]
After:  [0.69, 2.40, 4.62, 6.91, 9.21]
\`\`\`

This compresses the range and makes the distribution more Gaussian, which helps many algorithms.

## Critical Interview Point: Fit on Train, Transform Both

\`\`\`python
# CORRECT:
scaler.fit(X_train)              # Learn mean/std from training only
X_train_scaled = scaler.transform(X_train)
X_test_scaled = scaler.transform(X_test)   # Apply same transform

# WRONG:
scaler.fit(X_all)    # Data leakage! Test info leaks into training
\`\`\`

Using sklearn Pipeline handles this automatically.

## Exercise

Compare different scaling methods and their impact on model performance.`,
      starterCode: `import numpy as np
from sklearn.datasets import load_wine
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline

def compare_scaling():
    """Compare scaling methods on SVM performance."""
    data = load_wine()
    X, y = data.data, data.target

    # TODO: Print feature ranges to show why scaling matters
    # TODO: Create pipelines with no scaling, StandardScaler,
    #        MinMaxScaler, and RobustScaler + SVC
    # TODO: Compare cross_val_score for each
    pass

compare_scaling()`,
      solutionCode: `import numpy as np
from sklearn.datasets import load_wine
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline

def compare_scaling():
    """Compare scaling methods on SVM performance."""
    data = load_wine()
    X, y = data.data, data.target

    print("Feature ranges (showing why scaling matters):")
    for i, name in enumerate(data.feature_names):
        print(f"  {name}: [{X[:, i].min():.2f}, {X[:, i].max():.2f}]")

    scalers = {
        "No Scaling": None,
        "StandardScaler": StandardScaler(),
        "MinMaxScaler": MinMaxScaler(),
        "RobustScaler": RobustScaler(),
    }

    print(f"\\nSVM Performance with Different Scalers:")
    for name, scaler in scalers.items():
        if scaler is None:
            pipeline = Pipeline([("clf", SVC())])
        else:
            pipeline = Pipeline([("scaler", scaler), ("clf", SVC())])
        scores = cross_val_score(pipeline, X, y, cv=5, scoring="accuracy")
        print(f"  {name:20s}: {scores.mean():.4f} (+/- {scores.std():.4f})")

compare_scaling()`,
    },
    {
      id: "ml-fe-4",
      slug: "encoding-categoricals",
      title: "Encoding Categorical Variables",
      content: `# Encoding Categorical Variables

## The Problem

ML models work with numbers, not strings. Converting categorical variables to numerical representations is essential but must be done carefully to avoid introducing false relationships.

## Encoding Methods

### Label Encoding

Assigns an integer to each category:

\`\`\`
color:  red=0, blue=1, green=2
\`\`\`

**Problem:** Implies ordering (green > blue > red). Only use for ordinal categories (e.g., education: high_school=0, bachelor=1, master=2, phd=3).

### One-Hot Encoding

Creates a binary column for each category:

\`\`\`
color    →   color_red  color_blue  color_green
red           1          0           0
blue          0          1           0
green         0          0           1
\`\`\`

**Pros:** No false ordering. Works with any algorithm.
**Cons:** High cardinality features (1000+ categories) create sparse, high-dimensional data. Known as the "curse of dimensionality."

### Target Encoding (Mean Encoding)

Replaces each category with the mean of the target variable for that category:

\`\`\`
city     → city_encoded (mean of target)
NYC         0.72
LA          0.45
Chicago     0.58
\`\`\`

**Pros:** Single column, captures target relationship.
**Cons:** High risk of data leakage and overfitting. Must use regularization or fold-based encoding.

### Frequency Encoding

Replace each category with its frequency in the dataset:

\`\`\`
city     → city_freq
NYC         0.35  (35% of rows)
LA          0.28
Chicago     0.22
\`\`\`

**Pros:** Simple, single column, no leakage risk.
**Cons:** Different categories with same frequency become indistinguishable.

### Binary Encoding

Converts label-encoded integers to binary, then splits into columns:

\`\`\`
city     → label → binary → b1 b2 b3
NYC         0       000      0  0  0
LA          1       001      0  0  1
Chicago     2       010      0  1  0
Seattle     3       011      0  1  1
\`\`\`

Uses log2(n) columns instead of n — good for high cardinality.

## Decision Framework

\`\`\`
Cardinality     Ordering?    Recommendation
──────────────────────────────────────────────────
Low (<10)       No           One-Hot Encoding
Low (<10)       Yes          Label Encoding (ordinal)
Medium (10-50)  No           One-Hot or Binary Encoding
High (50+)      No           Target Encoding, Frequency, or Embeddings
Very High       No           Feature Hashing or Embeddings
\`\`\`

## Common Interview Trap

**Q: "You one-hot encoded a feature with 5 categories. How many columns should you create?"**
A: 4, not 5. The fifth column is linearly dependent on the others (if all four are 0, the fifth must be 1). This is called the "dummy variable trap" and causes multicollinearity in linear models. Use \`drop='first'\` in sklearn.

## Exercise

Implement and compare different encoding strategies.`,
      starterCode: `import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, OrdinalEncoder
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

def encoding_comparison():
    """Compare encoding methods on a dataset with categoricals."""
    np.random.seed(42)
    n = 200
    df = pd.DataFrame({
        'color': np.random.choice(['red', 'blue', 'green', 'yellow'], n),
        'size': np.random.choice(['S', 'M', 'L', 'XL'], n),
        'brand': np.random.choice([f'brand_{i}' for i in range(20)], n),
        'price': np.random.uniform(10, 100, n),
    })
    df['target'] = ((df['color'] == 'red').astype(int) +
                    (df['price'] > 50).astype(int) +
                    np.random.randint(0, 2, n)) > 1
    df['target'] = df['target'].astype(int)

    # TODO: Implement one-hot encoding for 'color'
    # TODO: Implement ordinal encoding for 'size' (S < M < L < XL)
    # TODO: Implement frequency encoding for 'brand'
    # TODO: Compare model performance with different encodings
    pass

encoding_comparison()`,
      solutionCode: `import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, OrdinalEncoder
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

def encoding_comparison():
    """Compare encoding methods on a dataset with categoricals."""
    np.random.seed(42)
    n = 200
    df = pd.DataFrame({
        'color': np.random.choice(['red', 'blue', 'green', 'yellow'], n),
        'size': np.random.choice(['S', 'M', 'L', 'XL'], n),
        'brand': np.random.choice([f'brand_{i}' for i in range(20)], n),
        'price': np.random.uniform(10, 100, n),
    })
    df['target'] = ((df['color'] == 'red').astype(int) +
                    (df['price'] > 50).astype(int) +
                    np.random.randint(0, 2, n)) > 1
    df['target'] = df['target'].astype(int)

    y = df['target']

    # One-hot encoding for color
    color_onehot = pd.get_dummies(df['color'], prefix='color', drop_first=True)

    # Ordinal encoding for size
    size_map = {'S': 0, 'M': 1, 'L': 2, 'XL': 3}
    size_ordinal = df['size'].map(size_map)

    # Frequency encoding for brand
    brand_freq = df['brand'].map(df['brand'].value_counts(normalize=True))

    # Combine features
    X_encoded = pd.concat([color_onehot, size_ordinal.rename('size'),
                           brand_freq.rename('brand_freq'),
                           df[['price']]], axis=1)

    print(f"Original shape: {df.shape}")
    print(f"Encoded shape: {X_encoded.shape}")
    print(f"\\nEncoded columns: {list(X_encoded.columns)}")
    print(f"\\nFirst 5 rows:\\n{X_encoded.head()}")

    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    scores = cross_val_score(clf, X_encoded, y, cv=5, scoring="accuracy")
    print(f"\\nModel Accuracy: {scores.mean():.4f} (+/- {scores.std():.4f})")

encoding_comparison()`,
    },
    {
      id: "ml-fe-5",
      slug: "feature-selection",
      title: "Feature Selection",
      content: `# Feature Selection

## Why Select Features?

More features is not always better. Irrelevant or redundant features can hurt model performance, increase training time, and make models harder to interpret. Feature selection finds the subset of features that matters most.

## Three Categories of Feature Selection

### Filter Methods

Evaluate features independently of the model using statistical tests:

\`\`\`
Correlation:         Remove features highly correlated with each other
                     Threshold: |r| > 0.9 often indicates redundancy

Variance Threshold:  Remove features with near-zero variance
                     A feature that is constant adds no information

Chi-Squared Test:    For categorical features vs categorical target
                     Tests independence between feature and target

Mutual Information:  Measures dependency between feature and target
                     Captures non-linear relationships (unlike correlation)

ANOVA F-test:        For numerical features vs categorical target
                     Tests whether feature means differ across classes
\`\`\`

**Pros:** Fast, model-agnostic. **Cons:** Ignores feature interactions.

### Wrapper Methods

Use model performance to evaluate feature subsets:

\`\`\`
Forward Selection:   Start empty, add features one at a time
                     Keep the one that improves performance most
                     Stop when no improvement

Backward Elimination: Start with all features, remove one at a time
                      Remove the one whose removal hurts least
                      Stop when removal hurts performance

Recursive Feature Elimination (RFE):
                     Train model, remove least important feature
                     Repeat until desired number of features
\`\`\`

**Pros:** Considers feature interactions. **Cons:** Computationally expensive (O(n^2) model trainings).

### Embedded Methods

Feature selection happens during model training:

\`\`\`
L1 Regularization (Lasso):
  Drives unimportant feature weights to exactly zero
  Automatic feature selection built into training

Tree-Based Importance:
  Random Forests and Gradient Boosted Trees compute
  feature importance based on how much each feature
  reduces impurity (Gini importance) or prediction error

Permutation Importance:
  Shuffle a feature's values and measure accuracy drop
  Model-agnostic, no retraining needed
  More reliable than built-in importance for correlated features
\`\`\`

## Decision Guide

\`\`\`
Scenario                              Method
──────────────────────────────────────────────────────
Quick exploration                     Correlation + Variance Threshold
Small dataset, few features           Wrapper (Forward/Backward)
Medium dataset                        RFE with Random Forest
Large dataset, many features          Filter (MI) + Embedded (L1)
Need interpretability                 Permutation Importance
High-dimensional (p >> n)             L1 or Mutual Information
\`\`\`

## Exercise

Apply multiple feature selection methods and compare the selected features.`,
      starterCode: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.feature_selection import (
    SelectKBest, f_classif, mutual_info_classif,
    RFE, VarianceThreshold
)
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

def feature_selection_comparison():
    """Compare feature selection methods."""
    data = load_breast_cancer()
    X, y = data.data, data.target
    feature_names = data.feature_names

    print(f"Original features: {X.shape[1]}")

    # TODO: Apply VarianceThreshold and print remaining features
    # TODO: Apply SelectKBest with f_classif (k=10)
    # TODO: Apply RFE with RandomForest (n_features=10)
    # TODO: Compare model performance with all features vs selected
    pass

feature_selection_comparison()`,
      solutionCode: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.feature_selection import (
    SelectKBest, f_classif, mutual_info_classif,
    RFE, VarianceThreshold
)
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

def feature_selection_comparison():
    """Compare feature selection methods."""
    data = load_breast_cancer()
    X, y = data.data, data.target
    feature_names = data.feature_names

    print(f"Original features: {X.shape[1]}")

    # Variance Threshold
    vt = VarianceThreshold(threshold=0.1)
    X_vt = vt.fit_transform(X)
    print(f"After VarianceThreshold: {X_vt.shape[1]} features")

    # SelectKBest with ANOVA F-test
    skb = SelectKBest(f_classif, k=10)
    skb.fit(X, y)
    selected_anova = feature_names[skb.get_support()]
    print(f"\\nTop 10 by ANOVA: {list(selected_anova)}")

    # RFE with Random Forest
    rfe = RFE(RandomForestClassifier(n_estimators=50, random_state=42),
              n_features_to_select=10)
    rfe.fit(X, y)
    selected_rfe = feature_names[rfe.support_]
    print(f"Top 10 by RFE:   {list(selected_rfe)}")

    # Compare performance
    print(f"\\nModel Performance Comparison:")
    configs = {
        "All features (30)": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(max_iter=10000))
        ]),
        "ANOVA top 10": Pipeline([
            ("scaler", StandardScaler()),
            ("select", SelectKBest(f_classif, k=10)),
            ("clf", LogisticRegression(max_iter=10000))
        ]),
        "RFE top 10": Pipeline([
            ("scaler", StandardScaler()),
            ("select", RFE(RandomForestClassifier(n_estimators=50, random_state=42),
                          n_features_to_select=10)),
            ("clf", LogisticRegression(max_iter=10000))
        ]),
    }

    for name, pipeline in configs.items():
        scores = cross_val_score(pipeline, X, y, cv=5, scoring="accuracy")
        print(f"  {name:25s}: {scores.mean():.4f} (+/- {scores.std():.4f})")

feature_selection_comparison()`,
    },
    {
      id: "ml-fe-6",
      slug: "pca-dimensionality-reduction",
      title: "PCA & Dimensionality Reduction",
      content: `# PCA & Dimensionality Reduction

## The Curse of Dimensionality

As the number of features grows, data becomes increasingly sparse. Distance metrics lose meaning, models overfit, and computation becomes expensive. Dimensionality reduction addresses this by projecting data into a lower-dimensional space while preserving important structure.

## Principal Component Analysis (PCA)

PCA finds the directions (principal components) of maximum variance in the data and projects data onto those directions.

\`\`\`
Algorithm:
1. Standardize the data (mean=0, std=1)
2. Compute the covariance matrix: C = (1/n) * X^T * X
3. Compute eigenvalues and eigenvectors of C
4. Sort eigenvectors by eigenvalue (descending)
5. Project data onto top k eigenvectors

Key properties:
  - Components are orthogonal (uncorrelated)
  - First component captures most variance
  - Each subsequent component captures less
  - Total variance preserved = sum of selected eigenvalues / total
\`\`\`

## How Many Components?

Use the explained variance ratio to decide:

\`\`\`
Cumulative Explained Variance:
  PC1: 0.45  (45% of variance)
  PC2: 0.25  (70% cumulative)
  PC3: 0.12  (82% cumulative)
  PC4: 0.08  (90% cumulative)  ← common cutoff
  PC5: 0.05  (95% cumulative)  ← conservative cutoff
\`\`\`

**Rules of thumb:**
- Keep enough components to explain 90-95% of variance
- Or use the "elbow" in the scree plot
- Or set \`n_components\` to a float (e.g., 0.95) to auto-select

## When to Use PCA

\`\`\`
Good use cases:
  - Reduce multicollinearity before linear models
  - Speed up training on high-dimensional data
  - Visualization (project to 2D/3D)
  - Noise reduction (drop low-variance components)
  - Preprocessing for KNN, SVM (distance-based models)

Poor use cases:
  - When interpretability is important (PCs are hard to explain)
  - Tree-based models (they handle high dimensions natively)
  - When features have different meanings/scales (must standardize first)
\`\`\`

## Other Dimensionality Reduction Methods

\`\`\`
t-SNE:    Non-linear, best for 2D/3D visualization
          Not suitable for preprocessing (non-deterministic, slow)

UMAP:     Like t-SNE but faster and preserves global structure
          Better for both visualization and preprocessing

LDA:      Supervised, finds directions that maximize class separation
          Limited to (num_classes - 1) components

Autoencoders: Neural network approach, learns non-linear embeddings
              Best when data has complex non-linear structure

Feature Hashing: Maps high-cardinality features to fixed-size vector
                 O(1) memory, fast, but information loss possible
\`\`\`

## Interview Questions

**Q: "PCA or feature selection — when to use which?"**
A: Feature selection keeps original features (interpretable). PCA creates new combined features (less interpretable but captures interactions). Use feature selection when you need to explain which features matter. Use PCA when you need to reduce dimensionality without caring which original features contribute.

**Q: "Can you apply PCA to categorical features?"**
A: Not directly. PCA assumes continuous, linear relationships. For categorical data, use MCA (Multiple Correspondence Analysis) or encode categoricals first, then apply PCA.

## Exercise

Apply PCA to a high-dimensional dataset and evaluate the tradeoff between compression and accuracy.`,
      starterCode: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline

def pca_analysis():
    """Apply PCA and analyze the variance-accuracy tradeoff."""
    data = load_digits()
    X, y = data.data, data.target

    print(f"Original dimensions: {X.shape}")

    # TODO: Standardize and fit PCA with all components
    # TODO: Print cumulative explained variance
    # TODO: Find how many components explain 90% and 95% of variance
    # TODO: Compare model accuracy with different numbers of components
    pass

pca_analysis()`,
      solutionCode: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline

def pca_analysis():
    """Apply PCA and analyze the variance-accuracy tradeoff."""
    data = load_digits()
    X, y = data.data, data.target

    print(f"Original dimensions: {X.shape}")

    # Fit PCA with all components to analyze variance
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    pca_full = PCA()
    pca_full.fit(X_scaled)

    cumvar = np.cumsum(pca_full.explained_variance_ratio_)
    n_90 = np.argmax(cumvar >= 0.90) + 1
    n_95 = np.argmax(cumvar >= 0.95) + 1

    print(f"Components for 90% variance: {n_90}")
    print(f"Components for 95% variance: {n_95}")

    # Compare performance with different component counts
    print(f"\\nAccuracy vs Components:")
    for n_comp in [10, n_90, n_95, 64]:
        pipeline = Pipeline([
            ("scaler", StandardScaler()),
            ("pca", PCA(n_components=n_comp)),
            ("clf", LogisticRegression(max_iter=5000))
        ])
        scores = cross_val_score(pipeline, X, y, cv=5, scoring="accuracy")
        label = f"{n_comp} components"
        if n_comp == n_90:
            label += " (90%var)"
        elif n_comp == n_95:
            label += " (95%var)"
        elif n_comp == 64:
            label += " (all)"
        print(f"  {label:30s}: {scores.mean():.4f} (+/- {scores.std():.4f})")

pca_analysis()`,
    },
  ],
};
