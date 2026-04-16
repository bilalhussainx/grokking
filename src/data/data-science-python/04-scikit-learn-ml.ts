import { Module } from "../types";

export const module4: Module = {
  id: "scikit-learn-ml",
  title: "scikit-learn: Machine Learning Fundamentals",
  description: "Train, evaluate, and tune ML models with scikit-learn — the consistent API that covers 90% of practical ML tasks",
  lessons: [
    {
      id: "sklearn-fundamentals",
      slug: "sklearn-fundamentals",
      title: "scikit-learn: The Universal ML API",
      content: `# scikit-learn: Practical Machine Learning

scikit-learn has one API that works for every algorithm: fit → predict → score. Learn the pattern once, apply to any model.

---

## The scikit-learn API

\`\`\`python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
import pandas as pd

# --- The Universal Pattern ---
# 1. Load and split data
X = df.drop('target', axis=1)
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 2. Preprocess
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled  = scaler.transform(X_test)       # Only transform, never fit!

# 3. Train
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# 4. Evaluate
y_pred = model.predict(X_test_scaled)
print(classification_report(y_test, y_pred))
print(f"Accuracy: {model.score(X_test_scaled, y_test):.4f}")
\`\`\`

## Algorithm Cheat Sheet

\`\`\`compare
{
  "title": "When to Use Which Algorithm",
  "items": [
    {
      "name": "Logistic Regression",
      "description": "Fast, interpretable baseline for binary/multiclass. Works well when features are linearly separable. Always try this first — if it works well enough, no need for complexity."
    },
    {
      "name": "Random Forest",
      "description": "Robust ensemble of decision trees. Handles non-linearity, mixed types, missing values somewhat. Good feature importance. Harder to overfit than single trees."
    },
    {
      "name": "Gradient Boosting (XGBoost/LightGBM)",
      "description": "State-of-the-art for tabular data. Usually wins Kaggle competitions. More hyperparameters to tune. XGBoost/LightGBM much faster than sklearn's GradientBoostingClassifier."
    },
    {
      "name": "SVM",
      "description": "Works well for high-dimensional data (text, images). Very slow on large datasets. Needs feature scaling. Good for small-medium datasets with clear margin."
    },
    {
      "name": "KNN",
      "description": "Simple, no training needed. Very slow at prediction time (computes distance to all points). Good baseline but rarely production-ready. Needs feature scaling."
    }
  ]
}
\`\`\`

## Model Evaluation

\`\`\`python
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, RocCurveDisplay,
    mean_squared_error, mean_absolute_error, r2_score
)
import matplotlib.pyplot as plt

# --- Classification Metrics ---
y_pred_proba = model.predict_proba(X_test)[:, 1]  # P(positive)

print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
print(f"Precision: {precision_score(y_test, y_pred):.4f}")  # TP / (TP+FP) — avoid false positives
print(f"Recall:    {recall_score(y_test, y_pred):.4f}")     # TP / (TP+FN) — avoid false negatives
print(f"F1:        {f1_score(y_test, y_pred):.4f}")         # harmonic mean of precision/recall
print(f"AUC-ROC:   {roc_auc_score(y_test, y_pred_proba):.4f}")  # 0.5=random, 1.0=perfect

# Confusion matrix:
cm = confusion_matrix(y_test, y_pred)
print(cm)
# [[TN, FP],
#  [FN, TP]]

# When to care about which metric:
# Spam detection: high precision (don't filter legitimate emails)
# Cancer screening: high recall (don't miss cancer cases)
# General: F1 (balanced when classes are imbalanced)

# --- Regression Metrics ---
# RMSE: same units as target, penalizes large errors
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
# MAE: robust to outliers — median absolute error
mae  = mean_absolute_error(y_test, y_pred)
# R²: 0=baseline, 1=perfect, can be negative (worse than mean)
r2   = r2_score(y_test, y_pred)
\`\`\`

## Cross-Validation & Pipeline

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score, GridSearchCV, RandomizedSearchCV
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingClassifier

# Pipeline: chain preprocessing + model (prevents data leakage)
pipe = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler',  StandardScaler()),
    ('model',   GradientBoostingClassifier(random_state=42)),
])

# Cross-validation: robust estimate of generalization
cv_scores = cross_val_score(pipe, X, y, cv=5, scoring='f1_macro')
print(f"CV F1: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

# Hyperparameter tuning:
param_grid = {
    'model__n_estimators': [100, 200, 500],
    'model__max_depth': [3, 5, 7],
    'model__learning_rate': [0.01, 0.1, 0.2],
}

search = RandomizedSearchCV(
    pipe, param_grid, n_iter=20, cv=5,
    scoring='f1_macro', n_jobs=-1, random_state=42
)
search.fit(X_train, y_train)
print(f"Best params: {search.best_params_}")
print(f"Best CV score: {search.best_score_:.4f}")

# Best model:
best_model = search.best_estimator_
\`\`\`

\`\`\`takeaways
["Pipeline prevents data leakage — preprocessing steps are fit only on training folds during CV", "Always use cross-validation — a single train/test split is misleading for small datasets", "Metric selection: precision (cost of false positive), recall (cost of false negative), F1 (balance)", "RandomizedSearchCV >> GridSearchCV — samples the grid randomly, 20x faster for same quality results", "AUC-ROC measures rank quality regardless of threshold — useful when class distribution shifts in prod", "Start with LogisticRegression baseline, then try RandomForest, then XGBoost/LightGBM"]
\`\`\`
`,
    },
  ],
};
