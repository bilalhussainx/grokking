import { Module } from "../types";

export const module2: Module = {
  id: "supervised-learning",
  title: "Supervised Learning Deep Dive",
  description: "Linear and logistic regression from math to code, decision trees, random forests, gradient boosting, and SVM",
  lessons: [
    {
      id: "regression-classification",
      slug: "regression-classification",
      title: "From Linear Regression to Gradient Boosting",
      content: `# Supervised Learning

The core algorithms that power most production ML systems — understood from first principles.

---

## Linear Regression: The Mathematical Foundation

\`\`\`python
# Linear Regression: y = w₀ + w₁x₁ + w₂x₂ + ... + wₙxₙ
# Matrix form: y = Xw
# Optimal weights (closed form): w = (X^T X)^{-1} X^T y

import numpy as np
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet

# Regularization (prevents overfitting):
# Ridge (L2): minimize ||y - Xw||² + α||w||²  — shrinks all weights
# Lasso (L1): minimize ||y - Xw||² + α||w||₁  — drives some weights to ZERO (feature selection!)
# ElasticNet: combination of L1 + L2

models = {
    'OLS':        LinearRegression(),
    'Ridge':      Ridge(alpha=1.0),          # α controls regularization strength
    'Lasso':      Lasso(alpha=0.1),
    'ElasticNet': ElasticNet(alpha=0.1, l1_ratio=0.5),
}

for name, model in models.items():
    model.fit(X_train, y_train)
    score = model.score(X_test, y_test)
    nnz = np.sum(model.coef_ != 0)
    print(f"{name}: R²={score:.4f}, non-zero coefs={nnz}")

# LASSO shrinks many weights to exactly 0 → automatic feature selection
# Use Ridge when you believe all features matter
# Use Lasso when you expect sparse features (many irrelevant)
\`\`\`

## Logistic Regression: Classification via Probability

\`\`\`python
# Logistic Regression: P(y=1|x) = sigmoid(w·x)
# sigmoid(z) = 1 / (1 + e^{-z}) → maps any value to [0, 1]
# Decision boundary: predict 1 if P > 0.5, else 0

import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
from sklearn.metrics import classification_report

# Generate data:
X, y = make_classification(n_samples=1000, n_features=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = LogisticRegression(C=1.0, max_iter=1000)  # C = 1/α (inverse regularization)
model.fit(X_train, y_train)

# Probabilities, not just class predictions:
proba = model.predict_proba(X_test)[:, 1]   # P(positive class)

# Adjust threshold for precision/recall tradeoff:
threshold = 0.3   # More sensitive (higher recall, lower precision)
y_pred_custom = (proba >= threshold).astype(int)

# Feature importance:
for feat, coef in zip(range(10), model.coef_[0]):
    print(f"Feature {feat}: {coef:.4f}")
# Positive coef → increases P(y=1)
# Negative coef → decreases P(y=1)
\`\`\`

## Decision Trees: Interpretable Models

\`\`\`python
from sklearn.tree import DecisionTreeClassifier, plot_tree
import matplotlib.pyplot as plt

# Decision trees split data by asking yes/no questions:
# "Is feature X > threshold?" → go left or right
# Splitting criterion: minimize impurity (Gini/entropy)

tree = DecisionTreeClassifier(
    max_depth=5,            # Prevent deep trees (overfitting)
    min_samples_split=20,   # Require at least 20 samples to split
    min_samples_leaf=10,    # Leaf must have at least 10 samples
    random_state=42,
)
tree.fit(X_train, y_train)

# Visualize (small trees only):
plt.figure(figsize=(20, 10))
plot_tree(tree, max_depth=3, feature_names=[f'f{i}' for i in range(10)],
          class_names=['0', '1'], filled=True)
plt.show()

# Feature importance:
importances = tree.feature_importances_
# = mean decrease in impurity from splits on this feature
\`\`\`

## Gradient Boosting: XGBoost & LightGBM

\`\`\`python
# Boosting: train models sequentially, each correcting previous errors
# Gradient Boosting: each new model fits the RESIDUALS of the previous ensemble

import xgboost as xgb
import lightgbm as lgb
from sklearn.model_selection import cross_val_score

# XGBoost:
xgb_model = xgb.XGBClassifier(
    n_estimators=500,
    learning_rate=0.05,     # Low LR + more trees = better generalization
    max_depth=6,
    subsample=0.8,           # Use 80% of data per tree (reduces overfitting)
    colsample_bytree=0.8,    # Use 80% of features per tree
    reg_alpha=0.1,           # L1 regularization
    reg_lambda=1.0,          # L2 regularization
    early_stopping_rounds=50, # Stop if no improvement in 50 rounds
    random_state=42,
)
xgb_model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    verbose=False,
)

# LightGBM (faster than XGBoost for large data):
lgb_model = lgb.LGBMClassifier(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=-1,           # -1 = no limit, controlled by num_leaves
    num_leaves=31,          # Key param: 2^(max_depth) is roughly num_leaves
    min_child_samples=20,
    feature_fraction=0.8,
    bagging_fraction=0.8,
    bagging_freq=5,
    random_state=42,
)
lgb_model.fit(X_train, y_train,
              eval_set=[(X_test, y_test)],
              callbacks=[lgb.early_stopping(50), lgb.log_evaluation(0)])

# XGBoost vs LightGBM:
# LightGBM: 10-50x faster, leaf-wise growth, better for large datasets
# XGBoost: more mature, level-wise growth, robust hyperparameters
\`\`\`

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Regularization Guide",
      "icon": "⚖️",
      "content": "### When to Use Each Regularization\\n\\n| Method | Use When | Effect |\\n|--------|----------|--------|\\n| L2 (Ridge) | All features relevant | Shrinks weights proportionally |\\n| L1 (Lasso) | Sparse features | Sets irrelevant weights to 0 |\\n| ElasticNet | Grouped features | L1+L2 combination |\\n| Dropout (NN) | Neural networks | Randomly zero activations during training |\\n| Early Stopping | Boosting/NN | Stop when val loss stops improving |\\n| Max Depth | Tree models | Limit tree complexity |\\n\\nRule of thumb: start with L2, try L1 if you suspect many irrelevant features."
    },
    {
      "label": "When to use what",
      "icon": "🗺️",
      "content": "### Algorithm Selection Guide\\n\\n**Regression tasks:**\\n- Start: LinearRegression (baseline)\\n- Nonlinear: RandomForestRegressor\\n- Best results: XGBoost/LightGBM\\n\\n**Classification tasks:**\\n- Start: LogisticRegression (baseline)\\n- Balanced classes: RandomForestClassifier\\n- Imbalanced classes: XGBoost with scale_pos_weight\\n\\n**When to prefer simpler models:**\\n- Need interpretability (compliance, healthcare)\\n- < 1000 samples (complex models overfit)\\n- Real-time inference requirements (LogReg fastest)"
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Lasso drives irrelevant feature weights to exactly 0 — use it for automatic feature selection", "Ridge never zeroes weights — use it when you believe all features are relevant", "Decision trees naturally overfit — always limit depth, min_samples_split, min_samples_leaf", "XGBoost/LightGBM = sequential boosting — each tree corrects residuals of the ensemble so far", "LightGBM is 10-50x faster than XGBoost on large data — preferred for > 100k rows", "Early stopping: stop training when validation loss hasn't improved in N rounds — prevents overfitting for free"]
\`\`\`
`,
    },
  ],
};
