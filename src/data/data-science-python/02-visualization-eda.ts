import { Module } from "../types";

export const module2: Module = {
  id: "visualization-eda",
  title: "Data Visualization & Exploratory Analysis",
  description: "matplotlib, seaborn, and the systematic approach to EDA that uncovers patterns, outliers, and data quality issues before modeling",
  lessons: [
    {
      id: "matplotlib-seaborn",
      slug: "matplotlib-seaborn",
      title: "matplotlib & seaborn: Visualizing Data",
      content: `# Data Visualization with matplotlib & seaborn

You can't understand data you can't see. Visualization is the fastest way to find patterns, outliers, and relationships.

---

## matplotlib: The Foundation

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# --- Line Plot ---
x = np.linspace(0, 2*np.pi, 100)
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

axes[0].plot(x, np.sin(x), label='sin(x)', color='blue', linewidth=2)
axes[0].plot(x, np.cos(x), label='cos(x)', color='red', linestyle='--')
axes[0].set_title('Trigonometric Functions')
axes[0].set_xlabel('x')
axes[0].set_ylabel('y')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# --- Scatter Plot ---
np.random.seed(42)
x = np.random.randn(200)
y = 2*x + np.random.randn(200)
colors = np.abs(x)   # color by magnitude

axes[1].scatter(x, y, c=colors, cmap='viridis', alpha=0.6, s=30)
axes[1].set_title('Scatter: Correlated Variables')
axes[1].set_xlabel('x')

plt.tight_layout()
plt.savefig('output.png', dpi=150, bbox_inches='tight')
plt.show()
\`\`\`

## seaborn: Statistical Visualization

\`\`\`python
import seaborn as sns
import pandas as pd

# Use built-in dataset for demonstration:
tips = sns.load_dataset('tips')   # Restaurant tips data

# Set style:
sns.set_theme(style='whitegrid', palette='muted')

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 1. Distribution plot (histogram + KDE):
sns.histplot(tips['total_bill'], bins=30, kde=True, ax=axes[0,0])
axes[0,0].set_title('Distribution of Total Bill')

# 2. Box plot (outliers, quartiles, median):
sns.boxplot(data=tips, x='day', y='total_bill', hue='sex', ax=axes[0,1])
axes[0,1].set_title('Bill by Day and Gender')

# 3. Scatter with regression line:
sns.regplot(data=tips, x='total_bill', y='tip', ax=axes[1,0])
axes[1,0].set_title('Tip vs Bill (with regression)')

# 4. Heatmap (correlation matrix):
corr = tips.select_dtypes(include='number').corr()
sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm',
            center=0, ax=axes[1,1])
axes[1,1].set_title('Correlation Matrix')

plt.tight_layout()
plt.show()
\`\`\`

## Choosing the Right Chart

\`\`\`compare
{
  "title": "Chart Type Selection Guide",
  "items": [
    {
      "name": "Distribution",
      "description": "Histogram, KDE (kernel density), violinplot. Use when: understanding how a single variable is distributed, checking normality, finding skew/bimodality."
    },
    {
      "name": "Relationship",
      "description": "Scatterplot, regplot, pairplot. Use when: exploring correlation between two continuous variables, checking linearity, finding clusters or outlier groups."
    },
    {
      "name": "Comparison",
      "description": "Bar chart, boxplot, grouped bar. Use when: comparing a metric across categories (dept, day, group). Boxplot shows more than a bar (median + quartiles + outliers)."
    },
    {
      "name": "Time Series",
      "description": "Line chart, area chart. Use when: data has a time index. Always sort by time first. Watch for: seasonality, trend, sudden level shifts."
    }
  ]
}
\`\`\`

## The Systematic EDA Process

\`\`\`python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

def run_eda(df: pd.DataFrame):
    """Systematic EDA — run this on any new dataset."""

    print("=== SHAPE ===")
    print(f"Rows: {df.shape[0]:,}, Columns: {df.shape[1]}")

    print("\\n=== DATA TYPES ===")
    print(df.dtypes.to_string())

    print("\\n=== MISSING VALUES ===")
    missing = df.isna().sum()
    missing_pct = (missing / len(df) * 100).round(1)
    missing_df = pd.DataFrame({'count': missing, 'pct': missing_pct})
    print(missing_df[missing_df['count'] > 0].sort_values('pct', ascending=False))

    print("\\n=== NUMERIC SUMMARY ===")
    print(df.describe().T.to_string())

    print("\\n=== CATEGORICAL SUMMARY ===")
    cat_cols = df.select_dtypes(include=['object', 'category']).columns
    for col in cat_cols:
        print(f"\\n{col}: {df[col].nunique()} unique values")
        print(df[col].value_counts().head(5).to_string())

    print("\\n=== DUPLICATE ROWS ===")
    print(f"Duplicates: {df.duplicated().sum()}")

    # Correlation heatmap
    numeric_df = df.select_dtypes(include='number')
    if len(numeric_df.columns) > 1:
        plt.figure(figsize=(10, 8))
        sns.heatmap(numeric_df.corr(), annot=True, fmt='.2f', cmap='coolwarm', center=0)
        plt.title('Correlation Matrix')
        plt.tight_layout()
        plt.show()

# Usage:
# df = pd.read_csv('your_data.csv')
# run_eda(df)
\`\`\`

\`\`\`takeaways
["fig, axes = plt.subplots(rows, cols) creates a grid of plots — axes[row, col] to access each", "seaborn.set_theme() should be called once at the top — sets style for all subsequent plots", "Boxplot > bar chart for comparisons — shows median, quartiles, and outliers, not just averages", "Correlation heatmap as the first step to understand feature relationships", "Always check: shape, dtypes, missing values, duplicates, numeric distribution, categorical value counts"]
\`\`\`
`,
    },
  ],
};
