import { Module } from "../types";

export const classicMlModule: Module = {
  id: "ml-classic-algorithms",
  title: "Classic ML Algorithms",
  description:
    "Deep dive into the classic ML algorithms — linear models, trees, SVMs, KNN, Naive Bayes, and ensemble methods with sklearn implementations.",
  lessons: [
    {
      id: "ml-classic-1",
      slug: "linear-logistic-regression",
      title: "Linear & Logistic Regression",
      content: `# Linear & Logistic Regression

## Linear Regression

The foundation of predictive modeling. Linear regression models the relationship between features and a continuous target.

\`\`\`
Model:  y = w₀ + w₁x₁ + w₂x₂ + ... + wₙxₙ
        y = W^T * X + b

Loss Function (MSE):
  L = (1/n) * Σ(yᵢ - ŷᵢ)²

Optimization:
  Closed form:  W = (X^T X)^(-1) X^T y   (Normal Equation)
  Iterative:    Gradient Descent — W = W - α * ∂L/∂W
\`\`\`

**Assumptions:** Linearity, independence of errors, homoscedasticity (constant error variance), normally distributed errors.

**Interview tip:** Always mention assumptions. Interviewers love to ask "When would linear regression fail?" Answer: multicollinearity, non-linear relationships, heteroscedastic errors.

## Regularization

\`\`\`
Ridge (L2):  L = MSE + λ * Σwᵢ²
  Shrinks all weights, never to zero. Good when all features are useful.

Lasso (L1):  L = MSE + λ * Σ|wᵢ|
  Drives some weights to exactly zero. Built-in feature selection.

ElasticNet:  L = MSE + λ₁ * Σ|wᵢ| + λ₂ * Σwᵢ²
  Combines L1 and L2. Use when features are correlated.
\`\`\`

## Logistic Regression

Despite the name, logistic regression is a **classification** algorithm. It models the probability of class membership using the sigmoid function.

\`\`\`
Sigmoid:  σ(z) = 1 / (1 + e^(-z))

Model:    P(y=1|x) = σ(W^T * X + b)

Decision: If P(y=1) > threshold → predict 1, else predict 0
          Default threshold = 0.5

Loss (Binary Cross-Entropy):
  L = -(1/n) * Σ[yᵢ * log(ŷᵢ) + (1-yᵢ) * log(1-ŷᵢ)]
\`\`\`

**Why not use MSE for classification?** The loss surface becomes non-convex with sigmoid + MSE, creating local minima. Cross-entropy gives a convex loss, guaranteeing convergence to the global minimum.

**Multiclass:** Use softmax (one-vs-rest or multinomial) to extend to multiple classes.

## Common Interview Questions

**Q: "What is the difference between linear and logistic regression?"**
A: Linear regression predicts continuous values with MSE loss. Logistic regression predicts probabilities with cross-entropy loss, using sigmoid to bound output to [0,1].

**Q: "How do you interpret logistic regression coefficients?"**
A: Each coefficient represents the change in log-odds for a one-unit increase in the feature. Exponentiated, it gives the odds ratio.

**Q: "Can logistic regression handle non-linear decision boundaries?"**
A: Not natively, but you can add polynomial features (x1*x2, x1^2) to create non-linear boundaries in the original feature space.

## Exercise

Implement both linear and logistic regression and interpret the results.`,
      starterCode: `import numpy as np
from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge, Lasso
from sklearn.datasets import load_diabetes, load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score

def linear_regression_demo():
    """Implement linear regression with regularization."""
    data = load_diabetes()
    X_train, X_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=0.2, random_state=42
    )
    # TODO: Train LinearRegression, Ridge, and Lasso
    # TODO: Print R2 score and RMSE for each
    # TODO: Compare number of non-zero coefficients
    pass

def logistic_regression_demo():
    """Implement logistic regression and interpret coefficients."""
    data = load_breast_cancer()
    X_train, X_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=0.2, random_state=42
    )
    # TODO: Train LogisticRegression
    # TODO: Print accuracy
    # TODO: Print top 5 most important features (by coefficient magnitude)
    pass

linear_regression_demo()
logistic_regression_demo()`,
      solutionCode: `import numpy as np
from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge, Lasso
from sklearn.datasets import load_diabetes, load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score
from sklearn.preprocessing import StandardScaler

def linear_regression_demo():
    """Implement linear regression with regularization."""
    data = load_diabetes()
    X_train, X_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=0.2, random_state=42
    )

    models = {
        "Linear Regression": LinearRegression(),
        "Ridge (alpha=1)": Ridge(alpha=1.0),
        "Lasso (alpha=1)": Lasso(alpha=1.0),
    }

    print("=== Linear Regression Comparison ===")
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        r2 = r2_score(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        nonzero = np.sum(np.abs(model.coef_) > 1e-10)
        print(f"  {name:25s}  R2={r2:.4f}  RMSE={rmse:.2f}  NonZero={nonzero}/{len(model.coef_)}")

def logistic_regression_demo():
    """Implement logistic regression and interpret coefficients."""
    data = load_breast_cancer()
    X_train, X_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=0.2, random_state=42
    )

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    model = LogisticRegression(max_iter=10000)
    model.fit(X_train_s, y_train)

    accuracy = accuracy_score(y_test, model.predict(X_test_s))
    print(f"\\n=== Logistic Regression ===")
    print(f"  Accuracy: {accuracy:.4f}")

    # Top features by coefficient magnitude
    coef_abs = np.abs(model.coef_[0])
    top_idx = np.argsort(coef_abs)[::-1][:5]
    print(f"  Top 5 Features:")
    for idx in top_idx:
        print(f"    {data.feature_names[idx]:30s}  coef={model.coef_[0][idx]:+.4f}")

linear_regression_demo()
logistic_regression_demo()`,
    },
    {
      id: "ml-classic-2",
      slug: "decision-trees-random-forests",
      title: "Decision Trees & Random Forests",
      content: `# Decision Trees & Random Forests

## Decision Trees

Decision trees recursively split data on feature thresholds to create a tree of decisions leading to predictions.

\`\`\`
Splitting Criteria:
  Classification:
    Gini Impurity:     G = 1 - Σpᵢ²
    Entropy:           H = -Σpᵢ * log₂(pᵢ)
    Information Gain:  IG = H(parent) - Σ(nⱼ/n) * H(childⱼ)

  Regression:
    Variance Reduction: Select split that minimizes MSE in children

At each node, select the feature and threshold that maximizes
the information gain (or minimizes impurity).
\`\`\`

**Pros:** Interpretable, no scaling needed, handles mixed feature types, captures non-linear relationships.

**Cons:** Prone to overfitting (high variance), unstable (small data changes create very different trees), greedy splitting is not globally optimal.

## Controlling Overfitting

\`\`\`
Hyperparameter           Effect
───────────────────────────────────────
max_depth                Limits tree depth (most important)
min_samples_split        Min samples to allow a split
min_samples_leaf         Min samples in a leaf node
max_features             Max features considered per split
max_leaf_nodes           Limits total leaf nodes
ccp_alpha                Cost complexity pruning parameter
\`\`\`

## Random Forests

Random Forests fix the high variance problem of decision trees by training many trees on different data subsets and averaging their predictions.

\`\`\`
Algorithm:
1. For each tree (n_estimators trees):
   a. Sample N points WITH replacement (bootstrap)
   b. At each split, consider only sqrt(p) random features
   c. Grow tree to full depth (or with max_depth)
2. Aggregate predictions:
   Classification: majority vote
   Regression: average

Why it works:
  - Bootstrap sampling creates diverse training sets
  - Random feature selection decorrelates the trees
  - Averaging reduces variance without increasing bias
\`\`\`

## Key Interview Concepts

**Bagging vs. Random Forest:** Bagging bootstraps data but considers all features at each split. Random Forest adds random feature selection, which further decorrelates trees.

**Feature Importance:** Trees naturally provide feature importance via mean decrease in impurity (MDI) across all splits. However, MDI is biased toward high-cardinality and correlated features. Permutation importance is more reliable.

**Out-of-Bag (OOB) Error:** Each tree does not see about 37% of the data (not selected by bootstrap). These unseen samples provide a free validation estimate without needing a separate validation set.

\`\`\`
OOB Error ≈ Cross-Validation Error
  - No additional computation
  - Converges as n_estimators increases
  - Set oob_score=True in sklearn
\`\`\`

## Exercise

Train a decision tree and random forest, compare performance, and analyze feature importance.`,
      starterCode: `import numpy as np
from sklearn.datasets import load_wine
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, train_test_split

def tree_vs_forest():
    """Compare Decision Tree and Random Forest."""
    data = load_wine()
    X, y = data.data, data.target

    # TODO: Train Decision Tree with different max_depth values
    # TODO: Train Random Forest
    # TODO: Compare CV scores
    # TODO: Print feature importances from Random Forest
    # TODO: Show OOB score
    pass

tree_vs_forest()`,
      solutionCode: `import numpy as np
from sklearn.datasets import load_wine
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, train_test_split

def tree_vs_forest():
    """Compare Decision Tree and Random Forest."""
    data = load_wine()
    X, y = data.data, data.target

    print("=== Decision Tree: Effect of max_depth ===")
    for depth in [2, 5, 10, None]:
        dt = DecisionTreeClassifier(max_depth=depth, random_state=42)
        scores = cross_val_score(dt, X, y, cv=5, scoring="accuracy")
        label = str(depth) if depth else "None (unlimited)"
        print(f"  max_depth={label:15s}  Accuracy: {scores.mean():.4f} (+/- {scores.std():.4f})")

    print("\\n=== Random Forest ===")
    rf = RandomForestClassifier(n_estimators=100, random_state=42, oob_score=True)
    rf.fit(X, y)
    scores = cross_val_score(
        RandomForestClassifier(n_estimators=100, random_state=42),
        X, y, cv=5, scoring="accuracy"
    )
    print(f"  CV Accuracy: {scores.mean():.4f} (+/- {scores.std():.4f})")
    print(f"  OOB Score:   {rf.oob_score_:.4f}")

    print("\\n=== Feature Importance (Top 5) ===")
    importances = rf.feature_importances_
    indices = np.argsort(importances)[::-1][:5]
    for rank, idx in enumerate(indices, 1):
        print(f"  {rank}. {data.feature_names[idx]:30s}  Importance: {importances[idx]:.4f}")

tree_vs_forest()`,
    },
    {
      id: "ml-classic-3",
      slug: "support-vector-machines",
      title: "Support Vector Machines",
      content: `# Support Vector Machines (SVMs)

## Core Concept

SVMs find the hyperplane that maximizes the margin between classes. The "support vectors" are the data points closest to the decision boundary — they define the margin.

\`\`\`
Decision boundary:  W^T * X + b = 0
Margin width:       2 / ||W||

Optimization:
  Minimize:    (1/2) * ||W||²
  Subject to:  yᵢ * (W^T * xᵢ + b) >= 1   for all i

The dual formulation uses Lagrange multipliers and only
depends on dot products between data points — enabling
the kernel trick.
\`\`\`

## Hard Margin vs. Soft Margin

\`\`\`
Hard Margin:  No misclassifications allowed.
              Only works for linearly separable data.
              Sensitive to outliers.

Soft Margin:  Allow some misclassifications.
              Controlled by C parameter:
                Large C → fewer misclassifications, smaller margin
                Small C → more misclassifications, larger margin
              C balances margin width vs. classification errors.
\`\`\`

## The Kernel Trick

When data is not linearly separable, SVMs project it into a higher-dimensional space where a linear separator exists. The kernel trick computes this without explicitly transforming the data.

\`\`\`
Kernel                    Formula                        Use Case
──────────────────────────────────────────────────────────────────────
Linear                    K(x,y) = x^T y                Linearly separable data
Polynomial                K(x,y) = (x^T y + c)^d        Polynomial relationships
RBF (Gaussian)            K(x,y) = exp(-γ||x-y||²)      Most common default
Sigmoid                   K(x,y) = tanh(αx^Ty + c)      Neural network-like
\`\`\`

**RBF kernel** is the most widely used. The gamma parameter controls the influence radius:
- Large gamma: each point has small influence → complex boundary → overfitting
- Small gamma: each point has large influence → smooth boundary → underfitting

## Key Hyperparameters

\`\`\`
C:       Regularization. Trade off margin width vs. errors.
         Default=1.0. Try [0.01, 0.1, 1, 10, 100]

gamma:   RBF kernel bandwidth. Controls decision boundary complexity.
         Default='scale'. Try ['scale', 'auto', 0.001, 0.01, 0.1, 1]

kernel:  Type of kernel function.
         Try ['linear', 'rbf', 'poly']
\`\`\`

## Pros and Cons

\`\`\`
Pros:
  - Effective in high-dimensional spaces
  - Memory efficient (only stores support vectors)
  - Versatile through kernel functions
  - Strong theoretical guarantees (margin maximization)

Cons:
  - Slow on large datasets O(n² to n³)
  - Sensitive to feature scaling (MUST scale)
  - No native probability outputs (use probability=True, but slow)
  - Hard to interpret (unlike trees or linear models)
  - Kernel selection and tuning can be tricky
\`\`\`

## Interview Questions

**Q: "When would you choose SVM over Random Forest?"**
A: SVMs excel with small-to-medium datasets with many features (e.g., text classification, genomics). Random Forests are better for large datasets and when you need feature importance.

**Q: "Why does SVM need feature scaling?"**
A: SVM optimizes based on distances. Unscaled features with large ranges dominate the distance calculation, biasing the decision boundary.

## Exercise

Implement SVM with different kernels and tune hyperparameters.`,
      starterCode: `from sklearn.datasets import load_breast_cancer
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score, GridSearchCV
from sklearn.pipeline import Pipeline

def svm_demo():
    """Compare SVM kernels and tune hyperparameters."""
    data = load_breast_cancer()
    X, y = data.data, data.target

    # TODO: Compare linear, rbf, and poly kernels with CV
    # TODO: Show the effect of C parameter
    # TODO: Use GridSearchCV to find optimal C and gamma for RBF
    pass

svm_demo()`,
      solutionCode: `from sklearn.datasets import load_breast_cancer
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score, GridSearchCV
from sklearn.pipeline import Pipeline

def svm_demo():
    """Compare SVM kernels and tune hyperparameters."""
    data = load_breast_cancer()
    X, y = data.data, data.target

    print("=== Kernel Comparison ===")
    for kernel in ['linear', 'rbf', 'poly']:
        pipe = Pipeline([('scaler', StandardScaler()), ('svm', SVC(kernel=kernel))])
        scores = cross_val_score(pipe, X, y, cv=5, scoring='accuracy')
        print(f"  {kernel:8s}: {scores.mean():.4f} (+/- {scores.std():.4f})")

    print("\\n=== Effect of C (RBF kernel) ===")
    for c in [0.01, 0.1, 1, 10, 100]:
        pipe = Pipeline([('scaler', StandardScaler()), ('svm', SVC(C=c, kernel='rbf'))])
        scores = cross_val_score(pipe, X, y, cv=5, scoring='accuracy')
        print(f"  C={c:6.2f}: {scores.mean():.4f} (+/- {scores.std():.4f})")

    print("\\n=== GridSearchCV (RBF) ===")
    pipe = Pipeline([('scaler', StandardScaler()), ('svm', SVC(kernel='rbf'))])
    param_grid = {
        'svm__C': [0.1, 1, 10, 100],
        'svm__gamma': ['scale', 0.01, 0.1, 1],
    }
    grid = GridSearchCV(pipe, param_grid, cv=5, scoring='accuracy')
    grid.fit(X, y)
    print(f"  Best Score:  {grid.best_score_:.4f}")
    print(f"  Best Params: {grid.best_params_}")

svm_demo()`,
    },
    {
      id: "ml-classic-4",
      slug: "k-nearest-neighbors",
      title: "K-Nearest Neighbors",
      content: `# K-Nearest Neighbors (KNN)

## The Simplest ML Algorithm

KNN is a lazy learner — it stores all training data and makes predictions by finding the K closest training points to a new query.

\`\`\`
Algorithm:
1. Store all training data (no training phase)
2. For a new point x:
   a. Compute distance to all training points
   b. Find K nearest neighbors
   c. Classification: majority vote among K neighbors
   d. Regression: average of K neighbors' values
\`\`\`

## Distance Metrics

\`\`\`
Euclidean (L2):    d = sqrt(Σ(xᵢ - yᵢ)²)
  Default choice. Works well for continuous features.

Manhattan (L1):    d = Σ|xᵢ - yᵢ|
  More robust to outliers. Better for high-dimensional data.

Minkowski (Lp):    d = (Σ|xᵢ - yᵢ|^p)^(1/p)
  Generalizes Euclidean (p=2) and Manhattan (p=1).

Cosine Similarity: cos(θ) = (x · y) / (||x|| * ||y||)
  Measures angle, not magnitude. Common for text/embeddings.
\`\`\`

## Choosing K

\`\`\`
K=1:     Very sensitive to noise (overfitting)
         Decision boundary is complex
         Training error = 0

K=N:     Always predicts the majority class (underfitting)
         Decision boundary is trivial

Sweet spot: Usually K = sqrt(N) or determined by cross-validation

Tips:
  - Use odd K for binary classification (avoid ties)
  - Smaller K → more complex boundary → higher variance
  - Larger K → smoother boundary → higher bias
\`\`\`

## Weighted KNN

Instead of equal votes, weight neighbors by inverse distance:

\`\`\`
Standard KNN:  Each neighbor gets 1 vote
Weighted KNN:  Each neighbor gets 1/distance votes

Closer neighbors have more influence on the prediction.
Use weights='distance' in sklearn.
\`\`\`

## Pros and Cons

\`\`\`
Pros:
  - No training phase (instant "training")
  - Simple to implement and understand
  - Naturally handles multi-class problems
  - Non-parametric (no assumptions about data distribution)
  - Adapts to any decision boundary shape

Cons:
  - Slow prediction: O(N*d) per query (must scan all data)
  - High memory: stores entire training set
  - Curse of dimensionality: distances lose meaning in high-D
  - Sensitive to irrelevant features (all features contribute equally)
  - MUST scale features (distance-based)
\`\`\`

## Speeding Up KNN

\`\`\`
KD-Tree:       Partitions space into regions. O(log N) average query.
               Degrades in high dimensions (d > 20).

Ball Tree:     Works better than KD-Tree in higher dimensions.
               Partitions data into nested hyperspheres.

Approximate NN: Libraries like FAISS, Annoy, ScaNN.
                Trade small accuracy loss for massive speed gains.
                Essential for production recommendation systems.
\`\`\`

## Interview Questions

**Q: "When would you use KNN in production?"**
A: Rarely as the final model due to latency. But KNN-based approaches power approximate nearest neighbor systems used in recommendation engines and semantic search (with learned embeddings).

**Q: "How does KNN handle imbalanced classes?"**
A: Poorly — the majority class dominates neighborhoods. Use weighted KNN, oversample minority class, or adjust the decision threshold.

## Exercise

Implement KNN and explore the effect of K and distance metrics.`,
      starterCode: `from sklearn.datasets import load_iris
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline
import numpy as np

def knn_exploration():
    """Explore KNN with different K values and distance metrics."""
    data = load_iris()
    X, y = data.data, data.target

    # TODO: Compare K values from 1 to 25 (odd numbers)
    # TODO: Find the best K
    # TODO: Compare distance metrics (euclidean, manhattan, cosine)
    # TODO: Compare uniform vs distance weighting
    pass

knn_exploration()`,
      solutionCode: `from sklearn.datasets import load_iris
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline
import numpy as np

def knn_exploration():
    """Explore KNN with different K values and distance metrics."""
    data = load_iris()
    X, y = data.data, data.target

    # Effect of K
    print("=== Effect of K ===")
    best_k, best_score = 1, 0
    for k in range(1, 26, 2):
        pipe = Pipeline([('scaler', StandardScaler()),
                         ('knn', KNeighborsClassifier(n_neighbors=k))])
        scores = cross_val_score(pipe, X, y, cv=5, scoring='accuracy')
        mean = scores.mean()
        if mean > best_score:
            best_k, best_score = k, mean
        if k <= 11 or k == 25:
            print(f"  K={k:2d}: {mean:.4f} (+/- {scores.std():.4f})")
    print(f"  Best K={best_k} with accuracy={best_score:.4f}")

    # Distance metrics
    print("\\n=== Distance Metrics (K=5) ===")
    for metric in ['euclidean', 'manhattan', 'chebyshev']:
        pipe = Pipeline([('scaler', StandardScaler()),
                         ('knn', KNeighborsClassifier(n_neighbors=5, metric=metric))])
        scores = cross_val_score(pipe, X, y, cv=5, scoring='accuracy')
        print(f"  {metric:12s}: {scores.mean():.4f} (+/- {scores.std():.4f})")

    # Weighting
    print("\\n=== Uniform vs Distance Weighting (K=5) ===")
    for weight in ['uniform', 'distance']:
        pipe = Pipeline([('scaler', StandardScaler()),
                         ('knn', KNeighborsClassifier(n_neighbors=5, weights=weight))])
        scores = cross_val_score(pipe, X, y, cv=5, scoring='accuracy')
        print(f"  {weight:10s}: {scores.mean():.4f} (+/- {scores.std():.4f})")

knn_exploration()`,
    },
    {
      id: "ml-classic-5",
      slug: "naive-bayes",
      title: "Naive Bayes",
      content: `# Naive Bayes

## Bayes' Theorem in Classification

Naive Bayes applies Bayes' theorem with the "naive" assumption that features are conditionally independent given the class label.

\`\`\`
Bayes' Theorem:
  P(class|features) = P(features|class) * P(class) / P(features)

  Posterior = (Likelihood * Prior) / Evidence

Since P(features) is constant for all classes:
  P(class|features) ∝ P(features|class) * P(class)

Naive assumption (conditional independence):
  P(x₁,x₂,...,xₙ|class) = P(x₁|class) * P(x₂|class) * ... * P(xₙ|class)

Prediction:
  ŷ = argmax_c  P(c) * Π P(xᵢ|c)

In log space (to avoid numerical underflow):
  ŷ = argmax_c  [log P(c) + Σ log P(xᵢ|c)]
\`\`\`

## Variants

\`\`\`
Gaussian Naive Bayes:
  Assumes features follow Gaussian distribution per class.
  P(xᵢ|c) = (1/sqrt(2πσ²)) * exp(-(xᵢ-μ)²/(2σ²))
  Use for: continuous features

Multinomial Naive Bayes:
  Assumes features are counts or frequencies.
  P(xᵢ|c) = (count of xᵢ in class c + α) / (total count in c + α*|V|)
  Use for: text classification with word counts/TF-IDF

Bernoulli Naive Bayes:
  Assumes features are binary (present/absent).
  P(xᵢ|c) = P(xᵢ=1|c)^xᵢ * P(xᵢ=0|c)^(1-xᵢ)
  Use for: binary features, short text classification

Complement Naive Bayes:
  Trained on complement of each class. Better for imbalanced datasets.
\`\`\`

## Why Naive Bayes Works Despite the Naive Assumption

The independence assumption is almost always violated in real data. Yet Naive Bayes often performs surprisingly well because:

1. **Classification only needs the correct ordering** of class probabilities, not their exact values
2. **Dependencies often cancel out** across features
3. **With limited data**, the simpler model avoids overfitting
4. **Calibration can be poor** but the argmax decision is often correct

## Laplace Smoothing

Without smoothing, if a feature value never appears with a class in training data, P(xᵢ|c) = 0, which zeros out the entire product.

\`\`\`
Laplace Smoothing (additive smoothing):
  P(xᵢ|c) = (count(xᵢ, c) + α) / (count(c) + α * |V|)

  α = 1: Laplace smoothing
  α < 1: Lidstone smoothing
  α = 0: No smoothing (risky)
\`\`\`

## Pros and Cons

\`\`\`
Pros:                              Cons:
  Very fast training/prediction      Independence assumption
  Works well with small data         Poor probability estimates
  Handles high dimensions            Cannot learn feature interactions
  Great for text classification      Continuous features need assumption
  Simple baseline                    Outperformed by complex models on
  No hyperparameter tuning             large, structured datasets
\`\`\`

## Interview Tip

Naive Bayes is the go-to baseline for text classification. If asked to "build a spam classifier," start with Multinomial Naive Bayes + TF-IDF. It trains in seconds and is often 90%+ accurate.

## Exercise

Implement Naive Bayes for text-like classification and compare variants.`,
      starterCode: `from sklearn.datasets import load_wine
from sklearn.naive_bayes import GaussianNB, MultinomialNB, BernoulliNB
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline
import numpy as np

def naive_bayes_comparison():
    """Compare Naive Bayes variants."""
    data = load_wine()
    X, y = data.data, data.target

    # TODO: Train GaussianNB and print CV score
    # TODO: Scale features to [0,1] and train MultinomialNB
    # TODO: Binarize features and train BernoulliNB
    # TODO: Compare all three
    pass

naive_bayes_comparison()`,
      solutionCode: `from sklearn.datasets import load_wine
from sklearn.naive_bayes import GaussianNB, MultinomialNB, BernoulliNB
from sklearn.preprocessing import MinMaxScaler, Binarizer
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline
import numpy as np

def naive_bayes_comparison():
    """Compare Naive Bayes variants."""
    data = load_wine()
    X, y = data.data, data.target

    print("=== Naive Bayes Variant Comparison ===")

    # Gaussian NB (works directly with continuous features)
    gnb_scores = cross_val_score(GaussianNB(), X, y, cv=5, scoring='accuracy')
    print(f"  GaussianNB:    {gnb_scores.mean():.4f} (+/- {gnb_scores.std():.4f})")

    # Multinomial NB (needs non-negative features)
    mnb_pipe = Pipeline([
        ('scaler', MinMaxScaler()),
        ('clf', MultinomialNB(alpha=1.0))
    ])
    mnb_scores = cross_val_score(mnb_pipe, X, y, cv=5, scoring='accuracy')
    print(f"  MultinomialNB: {mnb_scores.mean():.4f} (+/- {mnb_scores.std():.4f})")

    # Bernoulli NB (binarize features)
    bnb_pipe = Pipeline([
        ('scaler', MinMaxScaler()),
        ('binarizer', Binarizer(threshold=0.5)),
        ('clf', BernoulliNB(alpha=1.0))
    ])
    bnb_scores = cross_val_score(bnb_pipe, X, y, cv=5, scoring='accuracy')
    print(f"  BernoulliNB:   {bnb_scores.mean():.4f} (+/- {bnb_scores.std():.4f})")

    # Show Gaussian NB class priors and means
    gnb = GaussianNB()
    gnb.fit(X, y)
    print(f"\\n  Class Priors: {gnb.class_prior_}")
    print(f"  Feature means per class (first 3 features):")
    for c in range(3):
        print(f"    Class {c}: {gnb.theta_[c, :3].round(2)}")

naive_bayes_comparison()`,
    },
    {
      id: "ml-classic-6",
      slug: "ensemble-methods",
      title: "Ensemble Methods",
      content: `# Ensemble Methods

## The Power of Combining Models

Ensemble methods combine multiple models to achieve better performance than any single model. This is one of the most important topics in ML interviews — ensembles dominate competitions and production systems.

## Three Ensemble Strategies

### Bagging (Bootstrap Aggregating)

\`\`\`
1. Create B bootstrap samples (sample with replacement)
2. Train a model on each bootstrap sample
3. Aggregate predictions:
   Classification: majority vote
   Regression: average

Key insight: Reduces VARIANCE without increasing bias.
Best when base learner has high variance (e.g., deep trees).
Example: Random Forest
\`\`\`

### Boosting

\`\`\`
1. Train first model on the data
2. Compute errors/residuals
3. Train next model to correct those errors
4. Add the new model to the ensemble (with a learning rate)
5. Repeat

Key insight: Reduces BIAS by sequentially correcting errors.
Each model focuses on what previous models got wrong.
\`\`\`

**Major boosting algorithms:**

\`\`\`
AdaBoost:
  Reweights samples — misclassified points get higher weight.
  Final prediction: weighted vote of weak learners.

Gradient Boosting (GBM):
  Fits new trees to the negative gradient of the loss function.
  More flexible — works with any differentiable loss.

XGBoost:
  Optimized GBM with regularization, parallel processing,
  handling of missing values, and tree pruning.
  Dominant in competitions. Extremely fast.

LightGBM:
  Leaf-wise growth (vs. XGBoost level-wise).
  Faster on large datasets. Uses gradient-based one-side sampling.

CatBoost:
  Native handling of categorical features.
  Ordered boosting to reduce overfitting.
  Best out-of-the-box performance.
\`\`\`

### Stacking

\`\`\`
1. Train diverse base models (Level 0)
2. Use their predictions as features for a meta-model (Level 1)
3. Meta-model learns how to best combine base predictions

Level 0: [Random Forest, SVM, KNN, Logistic Regression]
            ↓         ↓      ↓        ↓
Level 1: [    Meta-model (e.g., Logistic Regression)    ]
            ↓
         Final Prediction

Important: Use cross-validated predictions from Level 0
to avoid data leakage into Level 1.
\`\`\`

## Comparison

\`\`\`
Method     Reduces   Base Learners   Training   Key Risk
────────────────────────────────────────────────────────────
Bagging    Variance  Independent     Parallel   Correlated trees
Boosting   Bias      Sequential      Sequential Overfitting
Stacking   Both      Diverse         Two-stage  Complexity/leakage
\`\`\`

## Key Hyperparameters for Gradient Boosting

\`\`\`
n_estimators:     Number of boosting rounds (trees). More = better, but slower.
learning_rate:    Step size. Smaller = needs more trees but generalizes better.
max_depth:        Tree depth. Shallow trees (3-8) are typical for boosting.
subsample:        Fraction of data per tree. < 1.0 adds randomness (stochastic GB).
min_child_weight: Min samples in a leaf. Prevents overfitting.
reg_alpha/lambda: L1/L2 regularization on leaf weights.
\`\`\`

**Golden rule:** Lower learning rate + more trees = better generalization. Use early stopping to find optimal n_estimators.

## Exercise

Compare bagging, boosting, and stacking approaches.`,
      starterCode: `from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import (
    RandomForestClassifier, GradientBoostingClassifier,
    AdaBoostClassifier, StackingClassifier
)
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

def ensemble_comparison():
    """Compare ensemble methods."""
    data = load_breast_cancer()
    X, y = data.data, data.target

    # TODO: Compare RandomForest (bagging), GradientBoosting, AdaBoost
    # TODO: Build a stacking ensemble
    # TODO: Show effect of n_estimators and learning_rate for GBM
    pass

ensemble_comparison()`,
      solutionCode: `from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import (
    RandomForestClassifier, GradientBoostingClassifier,
    AdaBoostClassifier, StackingClassifier
)
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

def ensemble_comparison():
    """Compare ensemble methods."""
    data = load_breast_cancer()
    X, y = data.data, data.target

    print("=== Ensemble Method Comparison ===")
    models = {
        "Random Forest (Bagging)": RandomForestClassifier(n_estimators=100, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, random_state=42),
        "AdaBoost": AdaBoostClassifier(n_estimators=100, random_state=42),
    }

    for name, model in models.items():
        scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
        print(f"  {name:30s}: {scores.mean():.4f} (+/- {scores.std():.4f})")

    # Stacking
    print("\\n=== Stacking Ensemble ===")
    estimators = [
        ('rf', RandomForestClassifier(n_estimators=50, random_state=42)),
        ('svm', Pipeline([('scaler', StandardScaler()), ('svm', SVC())])),
        ('knn', Pipeline([('scaler', StandardScaler()), ('knn', KNeighborsClassifier())])),
    ]
    stacking = StackingClassifier(
        estimators=estimators,
        final_estimator=LogisticRegression(max_iter=10000),
        cv=5
    )
    scores = cross_val_score(stacking, X, y, cv=5, scoring='accuracy')
    print(f"  Stacking:                       {scores.mean():.4f} (+/- {scores.std():.4f})")

    # Effect of learning rate
    print("\\n=== GBM: Learning Rate vs n_estimators ===")
    for lr, n_est in [(0.01, 500), (0.1, 100), (0.3, 50), (1.0, 20)]:
        gbm = GradientBoostingClassifier(
            learning_rate=lr, n_estimators=n_est, max_depth=3, random_state=42
        )
        scores = cross_val_score(gbm, X, y, cv=5, scoring='accuracy')
        print(f"  lr={lr:.2f}, n={n_est:3d}: {scores.mean():.4f} (+/- {scores.std():.4f})")

ensemble_comparison()`,
    },
  ],
};
