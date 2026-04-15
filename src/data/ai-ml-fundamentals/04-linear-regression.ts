import { Module } from "../types";

export const linearRegressionModule: Module = {
  id: "linear-regression",
  title: "Linear Regression from Scratch",
  description: "Derive and implement ordinary least squares and gradient descent regression using only NumPy. Understand bias-variance tradeoff and regularization.",
  lessons: [
    {
      id: "regression-intuition",
      slug: "regression-intuition",
      title: "The Regression Problem: Fitting a Line to Data",
      content: `# The Regression Problem: Fitting a Line to Data

You have a spreadsheet of house sizes and their sale prices. You want to predict the price of a new house. That's regression — and it's the simplest, most powerful idea in supervised machine learning.

By the end of this lesson, you'll understand what regression *is* as a mathematical problem, what it means to "fit" a model, and why the line that looks best by eye is actually the solution to a precise optimization problem.

---

\`\`\`concept
{ "title": "Supervised Learning as Function Approximation", "variant": "mental-model", "content": "Supervised learning is the task of finding a function f such that f(x) ≈ y for all (x, y) pairs in your training data. Regression is the special case where y is a continuous number — not a category. You're not labeling; you're measuring." }
\`\`\`

## What Problem Are We Actually Solving?

Suppose you collect data on apartments: square footage, number of bedrooms, distance from the city center, and the monthly rent. You want to predict rent for apartments you haven't seen yet.

Formally:
- **Input:** a vector **x** ∈ ℝⁿ (the features)
- **Output:** a scalar y ∈ ℝ (the target)
- **Goal:** find a function f : ℝⁿ → ℝ such that f(**x**) is close to y

For *linear* regression, we restrict f to the family of affine functions:

\`\`\`
ŷ = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
\`\`\`

Or in vector notation: **ŷ = wᵀx + b**

The parameters **w** (weights) and b (bias) are what learning *finds*. Everything else — the architecture, the loss, the optimizer — exists to answer one question: **what values of w and b make ŷ closest to y?**

---

## One Dimension First: The Line

Before we tackle hyperplanes, build intuition in 2D. You have m data points: (x₁, y₁), (x₂, y₂), …, (xₘ, yₘ). You want the line ŷ = wx + b that "best fits" them.

But what does "best" mean?

\`\`\`tabs
{ "tabs": [
  { "label": "Naive: Minimize Sum of Errors", "icon": "❌", "content": "You might think: minimize the total error Σ(yᵢ - ŷᵢ). But positive and negative errors cancel out. A line that's wildly wrong in both directions can score zero. This measure is useless." },
  { "label": "Better: Minimize Sum of Absolute Errors", "icon": "📏", "content": "Minimize Σ|yᵢ - ŷᵢ|. This is the L1 loss (Mean Absolute Error). It's robust to outliers, but it has a kink at zero — its gradient is undefined there, which makes calculus-based optimization messy." },
  { "label": "Standard: Minimize Sum of Squared Errors", "icon": "✅", "content": "Minimize Σ(yᵢ - ŷᵢ)². This is the L2 loss (Mean Squared Error). Squaring does two things: it makes all errors positive, and it penalizes large errors more than small ones. Crucially, it's smooth and differentiable everywhere — calculus works cleanly." }
] }
\`\`\`

The standard choice — the one you'll implement — is **Mean Squared Error (MSE)**:

$$\\mathcal{L}(w, b) = \\frac{1}{m} \\sum_{i=1}^{m} (y_i - (wx_i + b))^2$$

"Fitting a line to data" means: **find w and b that minimize this loss.**

---

## Visualizing the Fit

Here's the key insight: each choice of (w, b) is a *candidate* line. Some candidates are terrible; one (or a family very close to it) is optimal. The entire learning process is a search through this space of candidates.

\`\`\`algoviz
{ "title": "Candidate Lines Through Data", "type": "array", "data": [2, 4, 5, 4, 5, 7, 8, 9, 10, 12], "frames": [
  { "highlight": [], "label": "Raw data: y-values at x = 1, 2, ..., 10. Goal: find the best-fit line.", "stats": { "w": "?", "b": "?", "MSE": "?" } },
  { "highlight": [0, 1], "label": "Candidate 1: w=0, b=6 (flat horizontal line). Misses the upward trend completely.", "stats": { "w": 0, "b": 6, "MSE": "high" } },
  { "highlight": [0, 1, 2, 3], "label": "Candidate 2: w=2, b=0 (too steep). Overshoot at high x.", "stats": { "w": 2, "b": 0, "MSE": "medium" } },
  { "highlight": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "label": "Candidate 3: w=1.05, b=1.5 (best fit). Tracks the trend closely — this is near-optimal.", "stats": { "w": 1.05, "b": 1.5, "MSE": "low" } }
], "speed": 900 }
\`\`\`

---

## From 2D to Many Dimensions

Real datasets have many features. House price depends on square footage *and* bedrooms *and* age *and* neighborhood. The model becomes:

\`\`\`
ŷ = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
\`\`\`

Geometrically:
- With 1 feature: you're fitting a **line** in 2D space
- With 2 features: you're fitting a **plane** in 3D space
- With n features: you're fitting a **hyperplane** in (n+1)-dimensional space

The mathematics is identical in every case — it's just vectors and matrices instead of scalars. This is why linear algebra is the language of machine learning.

\`\`\`concept
{ "title": "The Bias Term", "variant": "insight", "content": "The bias b lets the hyperplane pass through any point, not just the origin. Without it, your model is forced to predict 0 when all features are 0 — which is almost never sensible. Always include bias. In matrix form, you can absorb b into w by appending a constant feature x₀=1 to every data point." }
\`\`\`

---

## The Loss Surface

The MSE loss L(w, b) is a function of your parameters. In 1D regression (one weight + bias), it forms a **bowl-shaped paraboloid** in parameter space. This is crucial:

- The bowl has **exactly one minimum** — there's no local minima to get stuck in
- The minimum is where the gradient is zero
- We can find it analytically (Ordinary Least Squares) or by following the gradient downhill (Gradient Descent)

Both approaches solve the same problem. This module implements both.

\`\`\`playground
{ "title": "Visualizing the MSE Loss Surface", "language": "python", "code": "import numpy as np\\n\\n# Generate synthetic data: y = 2x + 1 + noise\\nnp.random.seed(42)\\nm = 50\\nX = np.random.uniform(0, 10, m)\\ny = 2.0 * X + 1.0 + np.random.randn(m) * 1.5\\n\\ndef mse_loss(w, b, X, y):\\n    predictions = w * X + b\\n    errors = y - predictions\\n    return np.mean(errors ** 2)\\n\\n# Sweep over a grid of (w, b) values and compute loss\\nw_vals = np.linspace(-1, 5, 60)\\nb_vals = np.linspace(-3, 5, 60)\\n\\nlosses = np.zeros((len(b_vals), len(w_vals)))\\nfor i, b in enumerate(b_vals):\\n    for j, w in enumerate(w_vals):\\n        losses[i, j] = mse_loss(w, b, X, y)\\n\\n# Find the minimum\\nmin_idx = np.unravel_index(np.argmin(losses), losses.shape)\\nbest_w = w_vals[min_idx[1]]\\nbest_b = b_vals[min_idx[0]]\\nbest_loss = losses[min_idx]\\n\\nprint(f'Grid search result:')\\nprint(f'  Best w = {best_w:.3f}  (true: 2.0)')\\nprint(f'  Best b = {best_b:.3f}  (true: 1.0)')\\nprint(f'  MSE at minimum = {best_loss:.4f}')\\nprint()\\nprint(f'Loss at true params (w=2, b=1): {mse_loss(2.0, 1.0, X, y):.4f}')\\nprint(f'Loss at bad params  (w=0, b=5): {mse_loss(0.0, 5.0, X, y):.4f}')\\nprint()\\nprint('The loss bowl has ONE minimum — learning finds it systematically.')", "runnable": true }
\`\`\`

Run this. Notice that the grid search finds w ≈ 2 and b ≈ 1 — close to the true parameters we used to generate the data. The noise prevents a perfect recovery, but the signal dominates.

---

## What the Model Actually Learns

It's worth being precise about what "the model" is and isn't.

\`\`\`steps
{ "title": "The Three Entities in Regression", "steps": [
  { "title": "The Hypothesis Class", "content": "This is the *family* of functions your model can represent. For linear regression: all functions of the form ŷ = wᵀx + b. This is fixed before training. By choosing linear regression, you're saying 'I believe the relationship is roughly linear.' If it isn't, no amount of training will fix that — you've chosen the wrong hypothesis class." },
  { "title": "The Loss Function", "content": "This measures how wrong a particular hypothesis (a specific w, b) is on your data. MSE = (1/m)Σ(yᵢ - ŷᵢ)². This is also fixed before training. It encodes your *definition* of 'fit'. Different loss functions lead to different optimal parameters — MAE gives the median, MSE gives the mean." },
  { "title": "The Learning Algorithm", "content": "This is the procedure that searches the hypothesis class to minimize the loss. For linear regression: Ordinary Least Squares (closed-form formula) or Gradient Descent (iterative). The *algorithm* is what we implement in the next lessons." }
] }
\`\`\`

---

## Encoding Features as Matrices

To work with multiple features efficiently, we pack data into matrices.

Given m data points with n features each, define:

| Symbol | Shape | Description |
|--------|-------|-------------|
| **X** | (m × n) | Design matrix — each row is one data point |
| **y** | (m × 1) | Target vector — the values we want to predict |
| **w** | (n × 1) | Weight vector — one weight per feature |
| b | scalar | Bias term |

The prediction for all m points at once: **ŷ = Xw + b**

The MSE loss: **L = (1/m) ‖y − Xw − b‖²**

This matrix form is how you'll implement everything in NumPy. No loops over data points — NumPy's vectorized operations handle all m points simultaneously.

\`\`\`playground
{ "title": "Matrix Form of Linear Regression", "language": "python", "code": "import numpy as np\\n\\n# Simulate a dataset: rent prediction\\n# Features: [sqft, bedrooms, distance_to_center]\\nnp.random.seed(0)\\nm = 8  # 8 apartments\\nn = 3  # 3 features\\n\\nX = np.array([\\n    [500,  1, 2.0],\\n    [750,  2, 1.5],\\n    [600,  1, 3.0],\\n    [900,  3, 0.5],\\n    [1100, 3, 2.0],\\n    [450,  1, 5.0],\\n    [800,  2, 1.0],\\n    [650,  2, 4.0],\\n], dtype=float)\\n\\ny = np.array([1200, 1800, 1350, 2500, 2800, 900, 2100, 1500], dtype=float)\\n\\n# Arbitrary initial weights and bias\\nw = np.array([1.5, 200.0, -50.0])  # per sqft, per bedroom, per km\\nb = 300.0\\n\\n# Vectorized predictions for ALL 8 apartments at once\\ny_hat = X @ w + b  # (8,3) @ (3,) + scalar = (8,)\\n\\n# MSE loss\\nerrors = y - y_hat\\nmse = np.mean(errors ** 2)\\n\\nprint('Predictions vs Actuals:')\\nprint(f'  {'Pred':>8}  {'Actual':>8}  {'Error':>8}')\\nfor pred, actual, err in zip(y_hat, y, errors):\\n    print(f'  {pred:8.1f}  {actual:8.1f}  {err:8.1f}')\\nprint(f'\\\\nMSE with initial weights: {mse:.2f}')\\nprint(f'RMSE: {np.sqrt(mse):.2f} (in same units as y — dollars/month)')", "runnable": true }
\`\`\`

The RMSE tells you: on average, your predictions are off by that many dollars/month. Learning will drive this number down.

---

## The Geometry of Fitting

Here's the most important geometric fact about linear regression:

\`\`\`concept
{ "title": "Projection onto the Column Space", "variant": "mental-model", "content": "The predictions ŷ = Xw form a vector in the *column space* of X — all possible linear combinations of the feature columns. The target y probably doesn't lie in this space exactly (due to noise or nonlinearity). OLS finds the point in the column space *closest* to y — i.e., the orthogonal projection of y onto col(X). The residual vector (y - ŷ) is perpendicular to col(X) at the optimum." }
\`\`\`

This geometric view explains *why* the OLS formula works and *why* MSE is the natural loss for Gaussian noise. You don't need to memorize this — but when you derive the normal equations in the next lesson, this picture will make the algebra obvious.

---

\`\`\`callout
{ "type": "warning", "title": "Linearity in the Parameters, Not the Features", "content": "Linear regression is 'linear' because ŷ is linear in **w** — not necessarily in the raw input x. You can include features like x², log(x), or x₁·x₂ as columns in X and linear regression handles them fine. The model remains linear in w, so all the theory still applies. This is called *feature engineering* and it's your first tool for handling nonlinear relationships." }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Vectorized MSE from Scratch", "prompt": "Complete the function that computes MSE loss given predictions and true targets.", "language": "python", "template": "import numpy as np\\n\\ndef mse_loss(y_true, y_pred):\\n    errors = y_true - ___\\n    squared = ___ ** 2\\n    return np.___( squared )\\n\\n# Test\\ny_true = np.array([3.0, 5.0, 7.0])\\ny_pred = np.array([2.5, 5.5, 6.0])\\nprint(mse_loss(y_true, y_pred))  # should be ~0.4167", "blanks": [
  { "answer": "y_pred", "hint": "Subtract the predictions from the true values" },
  { "answer": "errors", "hint": "Square the error vector element-wise" },
  { "answer": "mean", "hint": "Average the squared errors with a NumPy function" }
] }
\`\`\`

---

## Quiz

\`\`\`quiz
{ "title": "The Regression Problem", "questions": [
  {
    "question": "You have 1000 data points, each with 5 features and a continuous target. What are the shapes of X, w, and y in matrix form?",
    "options": [
      "X: (5×1000), w: (5×1), y: (1000×1)",
      "X: (1000×5), w: (5×1), y: (1000×1)",
      "X: (1000×5), w: (1000×1), y: (5×1)",
      "X: (5×5), w: (5×1), y: (1000×1)"
    ],
    "answer": 1,
    "explanation": "X is the design matrix: one row per data point (1000 rows), one column per feature (5 columns). w has one weight per feature (5×1). y has one target per data point (1000×1). The prediction ŷ = Xw gives a (1000×1) vector."
  },
  {
    "question": "Why is MSE (sum of squared errors) preferred over sum of raw errors as a loss function?",
    "options": [
      "MSE is always smaller, making optimization faster",
      "MSE is differentiable everywhere and positive and large errors are penalized more",
      "MSE automatically handles outliers better than other losses",
      "MSE is preferred only when the data has no outliers"
    ],
    "answer": 1,
    "explanation": "Raw errors can cancel (positive + negative = 0), making the loss useless as a guide. MSE squares errors so they're always positive, penalizes large errors quadratically, and is smooth (differentiable) everywhere — all essential for calculus-based optimization."
  },
  {
    "question": "A linear regression model with features [x, x², x³] is being trained. Is this still 'linear regression'?",
    "options": [
      "No — using x² and x³ makes it polynomial regression, which is fundamentally different",
      "Yes — the model is linear in the parameters w, even though the features are nonlinear transformations of x",
      "Only if x is between 0 and 1",
      "No — you must use a neural network to handle polynomial features"
    ],
    "answer": 1,
    "explanation": "Linear regression means ŷ = wᵀφ(x) + b is linear in w. The features φ(x) = [x, x², x³] are just columns in the design matrix X. The model is still a linear function of the parameters, so OLS and gradient descent apply unchanged — this is the power of feature engineering."
  },
  {
    "question": "The MSE loss surface for linear regression (as a function of w and b) is shaped like:",
    "options": [
      "A landscape with many hills and valleys, like a mountain range",
      "A flat plane, since errors average out",
      "A bowl-shaped paraboloid with exactly one global minimum",
      "A cone with a sharp point at the minimum"
    ],
    "answer": 2,
    "explanation": "MSE = (1/m)‖y - Xw - b‖² is a quadratic function of w and b. Quadratic functions of multiple variables form paraboloids (bowls). Crucially, this bowl is convex with a unique global minimum — there are no local minima to get stuck in. This is why linear regression is so well-behaved compared to neural networks."
  }
] }
\`\`\`

---

## Where We Go From Here

You now have a precise formulation: regression is minimizing MSE over the family of linear functions. The next two lessons solve this optimization problem two ways:

1. **Ordinary Least Squares (OLS)** — set the gradient to zero, solve analytically. One matrix inversion gives the exact answer. Fast for small datasets.

2. **Gradient Descent** — iteratively follow the negative gradient. Slower per step, but scales to millions of data points where matrix inversion is impossible.

Both methods find the same answer. Understanding both gives you the full picture.

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Regression is function approximation: find f(x) ≈ y for continuous targets, restricted to the family of affine functions ŷ = wᵀx + b.",
  "MSE loss — (1/m)Σ(yᵢ - ŷᵢ)² — is the standard measure of fit: always positive, smooth, and penalizes large errors quadratically.",
  "In matrix form, all m predictions compute simultaneously as ŷ = Xw + b, where X is the (m×n) design matrix.",
  "The MSE loss surface for linear regression is a convex bowl — one global minimum, no local traps.",
  "Linear regression is linear in the *parameters*, not the features — you can include x², log(x), or any transformation as a feature column without changing the theory."
] }
\`\`\``,
      starterCode: `import numpy as np

# Dataset: house sizes (sq ft) and prices ($1000s)
X = np.array([650, 800, 1200, 1500, 1800, 2100, 2400, 2800, 3200, 3600])
y = np.array([70, 85, 115, 140, 165, 190, 210, 240, 270, 305])

# TODO 1: Normalize X to have zero mean and unit variance
# Hint: x_norm = (X - mean) / std
x_mean = None
x_std = None
X_norm = None

# TODO 2: Add a bias column (column of 1s) to X_norm
# The design matrix should have shape (10, 2): [[1, x1], [1, x2], ...]
# Hint: use np.column_stack or np.ones
X_design = None

# TODO 3: Solve for weights using the Normal Equation
# w = (X^T X)^-1 X^T y
# This finds the best-fit hyperplane (line in 1D) analytically
# Hint: use np.linalg.inv, matrix multiply with @
w = None

# TODO 4: Make predictions using your learned weights
# y_pred = X_design @ w
y_pred = None

# TODO 5: Calculate Mean Squared Error
# MSE = (1/n) * sum((y - y_pred)^2)
mse = None

# --- Evaluation (do not modify) ---
if w is not None and y_pred is not None and mse is not None:
    print(f"Learned weights: bias={w[0]:.2f}, slope={w[1]:.2f}")
    print(f"MSE: {mse:.4f}")
    print(f"\\nPredictions vs Actual:")
    for i in range(len(y)):
        print(f"  Size={X[i]} sqft -> Predicted=\${y_pred[i]:.1f}k, Actual=\${y[i]}k")
    # Predict for a new house
    new_size = 2000
    new_norm = (new_size - x_mean) / x_std
    new_pred = np.array([1, new_norm]) @ w
    print(f"\\nNew prediction: {new_size} sqft -> \${new_pred:.1f}k")
`,
      solutionCode: `import numpy as np

# Dataset: house sizes (sq ft) and prices ($1000s)
X = np.array([650, 800, 1200, 1500, 1800, 2100, 2400, 2800, 3200, 3600])
y = np.array([70, 85, 115, 140, 165, 190, 210, 240, 270, 305])

# Step 1: Normalize X (zero mean, unit variance)
# Normalization keeps features on the same scale, which matters
# when fitting hyperplanes to multidimensional data.
x_mean = X.mean()
x_std = X.std()
X_norm = (X - x_mean) / x_std

# Step 2: Build the design matrix by prepending a column of 1s.
# The 1s allow the model to learn a bias (intercept) term.
# Shape: (10, 2) — each row is [1, normalized_feature]
X_design = np.column_stack([np.ones(len(X_norm)), X_norm])

# Step 3: Solve the Normal Equation: w = (X^T X)^-1 X^T y
# This is the closed-form solution for linear regression.
# It finds weights that minimize the squared error — fitting the
# best hyperplane (a line here, since we have one feature) to the data.
w = np.linalg.inv(X_design.T @ X_design) @ X_design.T @ y

# Step 4: Predict using the learned hyperplane: y_pred = X_design @ w
# Each prediction is a dot product of feature vector and weight vector.
y_pred = X_design @ w

# Step 5: Mean Squared Error measures how far the hyperplane is from
# the actual data points on average.
mse = np.mean((y - y_pred) ** 2)

# --- Evaluation ---
print(f"Learned weights: bias={w[0]:.2f}, slope={w[1]:.2f}")
print(f"MSE: {mse:.4f}")
print(f"\\nPredictions vs Actual:")
for i in range(len(y)):
    print(f"  Size={X[i]} sqft -> Predicted=\${y_pred[i]:.1f}k, Actual=\${y[i]}k")

# Predict for a new house (must apply the same normalization)
new_size = 2000
new_norm = (new_size - x_mean) / x_std
new_pred = np.array([1, new_norm]) @ w
print(f"\\nNew prediction: {new_size} sqft -> \${new_pred:.1f}k")
`,
    },
    {
      id: "mse-loss-function",
      slug: "mse-loss-function",
      title: "Mean Squared Error: The Loss Function",
      content: `# Mean Squared Error: The Loss Function

Before a model can *learn*, it needs to know how wrong it is. The **loss function** is that measure of wrongness — a single number that summarizes the gap between what your model predicts and what actually happened.

In linear regression, the workhorse loss function is **Mean Squared Error (MSE)**. By the end of this lesson you'll know exactly what it measures, *why* squaring is the right move, and how to implement both the loss and its gradient from scratch.

---

## What Is a Residual?

Given a dataset of input-output pairs \`(x₁, y₁), (x₂, y₂), …, (xₙ, yₙ)\`, your model produces predictions \`ŷᵢ\`. The gap between reality and prediction for sample \`i\` is called the **residual**:

\`\`\`
eᵢ = yᵢ − ŷᵢ
\`\`\`

A residual is signed: positive when the model under-predicts, negative when it over-predicts. Training is the process of finding model parameters that make these residuals collectively small.

\`\`\`concept
{ "title": "Loss Function", "variant": "mental-model", "content": "A loss function collapses all residuals into one number. Minimizing that number IS training. The shape of the loss determines how the optimizer moves — so the choice of loss matters deeply." }
\`\`\`

---

## Three Candidate Losses — Why Not the Others?

You might wonder: why not just sum the raw residuals? Or take their absolute values?

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Sum of Residuals",
      "icon": "➕",
      "content": "**Sum of residuals: Σ eᵢ**\\n\\nA perfectly terrible idea. Positive and negative errors cancel out. A model that predicts +100 for one sample and −100 for another looks identical to a perfect model. Loss = 0, despite being wildly wrong.\\n\\n\`\`\`\\nErrors: [+5, −5, +3, −3]\\nSum:    0   ← looks perfect, isn't\\n\`\`\`"
    },
    {
      "label": "Mean Absolute Error",
      "icon": "📐",
      "content": "**MAE: (1/n) Σ |eᵢ|**\\n\\nSolves the cancellation problem. Robust to outliers because a huge error doesn't dominate. But there's a catch: |x| has a kink at zero — the derivative is undefined there. This makes gradient-based optimization harder, and the loss landscape has flat regions.\\n\\n\`\`\`\\nErrors: [+5, −5, +3, −3]\\nMAE:   (5 + 5 + 3 + 3) / 4 = 4.0\\n\`\`\`"
    },
    {
      "label": "Mean Squared Error",
      "icon": "✅",
      "content": "**MSE: (1/n) Σ eᵢ²**\\n\\nSquaring eliminates sign, penalizes large errors disproportionately (outlier with 2× the error contributes 4× the loss), and — crucially — produces a smooth, differentiable, convex loss surface. This makes gradient descent provably converge to the global minimum for linear models.\\n\\n\`\`\`\\nErrors: [+5, −5, +3, −3]\\nMSE:   (25 + 25 + 9 + 9) / 4 = 17.0\\n\`\`\`"
    }
  ]
}
\`\`\`

---

## The MSE Formula

$$\\text{MSE}(\\mathbf{w}) = \\frac{1}{n} \\sum_{i=1}^{n} \\left( y_i - \\hat{y}_i \\right)^2$$

Where \`ŷᵢ = wᵀxᵢ + b\` for linear regression. In matrix form with design matrix **X** (shape \`n × d\`) and weight vector **w**:

$$\\text{MSE}(\\mathbf{w}) = \\frac{1}{n} \\|\\mathbf{y} - \\mathbf{X}\\mathbf{w}\\|^2_2$$

\`\`\`concept
{ "title": "Why Square?", "variant": "rule", "content": "Squaring does three jobs at once: (1) eliminates sign so errors don't cancel, (2) penalizes large errors more harshly than small ones — encouraging the model to avoid catastrophic misses, (3) gives a smooth curve everywhere so calculus-based optimization works cleanly." }
\`\`\`

---

## Visualizing the Loss Surface

For a single-parameter model \`ŷ = w·x\`, MSE as a function of \`w\` is a **parabola** — one global minimum, no local traps. This is the magic of MSE for linear models: the loss surface is convex.

\`\`\`algoviz
{
  "title": "Residuals on a Scatter Plot",
  "type": "array",
  "data": [1.2, 2.8, 2.1, 4.5, 3.9, 5.7],
  "frames": [
    { "highlight": [0], "label": "Sample 1: y=2.0, ŷ=1.2 → residual = +0.8", "stats": { "y": 2.0, "ŷ": 1.2, "e": 0.8, "e²": 0.64 } },
    { "highlight": [1], "label": "Sample 2: y=2.8, ŷ=2.8 → residual = 0.0", "stats": { "y": 2.8, "ŷ": 2.8, "e": 0.0, "e²": 0.0 } },
    { "highlight": [2], "label": "Sample 3: y=3.5, ŷ=2.1 → residual = +1.4", "stats": { "y": 3.5, "ŷ": 2.1, "e": 1.4, "e²": 1.96 } },
    { "highlight": [3], "label": "Sample 4: y=4.5, ŷ=4.5 → residual = 0.0", "stats": { "y": 4.5, "ŷ": 4.5, "e": 0.0, "e²": 0.0 } },
    { "highlight": [4], "label": "Sample 5: y=3.5, ŷ=3.9 → residual = −0.4", "stats": { "y": 3.5, "ŷ": 3.9, "e": -0.4, "e²": 0.16 } },
    { "highlight": [5], "label": "Sample 6: y=5.7, ŷ=5.7 → residual = 0.0", "stats": { "y": 5.7, "ŷ": 5.7, "e": 0.0, "e²": 0.0 } },
    { "highlight": [0,1,2,3,4,5], "label": "MSE = (0.64 + 0.0 + 1.96 + 0.0 + 0.16 + 0.0) / 6 ≈ 0.46", "stats": { "MSE": 0.46 } }
  ],
  "speed": 900
}
\`\`\`

---

## Implementing MSE in NumPy

The implementation is a direct translation of the formula. No loops needed — NumPy's vectorized operations handle the entire dataset at once.

\`\`\`playground
{
  "title": "MSE Implementation",
  "language": "python",
  "runnable": true,
  "code": "import numpy as np\\n\\ndef mse(y_true, y_pred):\\n    \\"\\"\\"\\n    Mean Squared Error loss.\\n    \\n    Args:\\n        y_true: np.ndarray of shape (n,) — ground truth labels\\n        y_pred: np.ndarray of shape (n,) — model predictions\\n    Returns:\\n        Scalar MSE value\\n    \\"\\"\\"\\n    residuals = y_true - y_pred\\n    return np.mean(residuals ** 2)\\n\\n\\n# --- Demo ---\\nnp.random.seed(42)\\nn = 100\\nX = np.random.randn(n)          # feature\\ntrue_w, true_b = 2.5, 1.0      # ground truth params\\ny_true = true_w * X + true_b + np.random.randn(n) * 0.5  # with noise\\n\\n# Test with different predictions\\nfor w_guess in [0.0, 1.5, 2.5, 3.5]:\\n    y_pred = w_guess * X + true_b\\n    loss = mse(y_true, y_pred)\\n    print(f\\"w={w_guess:.1f}  MSE={loss:.4f}\\")\\n\\nprint(\\"\\\\nNotice: minimum MSE is near the true w=2.5\\")"
}
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Vectorization vs. Loops", "content": "Writing \`np.mean((y_true - y_pred) ** 2)\` computes MSE for 1 million samples in ~2ms. A pure Python loop would take ~2 seconds. NumPy delegates to BLAS/LAPACK routines written in optimized C — always prefer vectorized operations in numerical code." }
\`\`\`

---

## Deriving the Gradient

Gradient descent needs ∂MSE/∂**w** — the direction in weight space that MSE increases fastest (we move the opposite way).

Start from the matrix form. Let **e** = **y** − **Xw** (residual vector):

\`\`\`
MSE(w) = (1/n) · eᵀe = (1/n) · (y − Xw)ᵀ(y − Xw)
\`\`\`

Expand and differentiate with respect to **w**:

\`\`\`
∂MSE/∂w = −(2/n) · Xᵀ(y − Xw)
         = −(2/n) · Xᵀe
\`\`\`

In words: **multiply the transpose of your input matrix by the residuals, then scale by −2/n**. The negative sign means residuals pull the weights in the direction that reduces error.

\`\`\`concept
{ "title": "Gradient Intuition", "variant": "analogy", "content": "Think of the gradient as a compass needle. It points uphill on the loss surface. Moving −gradient steps you downhill. For MSE, the gradient is proportional to how correlated each feature is with the current errors — features responsible for big errors get big gradient updates." }
\`\`\`

---

## Tracing Through the Gradient Calculation

\`\`\`trace
{
  "title": "MSE Gradient — Step by Step",
  "language": "python",
  "code": "import numpy as np\\n\\nn, d = 4, 2\\nX = np.array([[1, 2], [1, 3], [1, 4], [1, 5]], dtype=float)\\ny = np.array([2.1, 3.0, 3.9, 5.1], dtype=float)\\nw = np.array([0.0, 0.0], dtype=float)\\n\\ny_pred = X @ w\\nresiduals = y - y_pred\\nsquared = residuals ** 2\\nmse_val = np.mean(squared)\\ngrad = -(2/n) * (X.T @ residuals)",
  "frames": [
    { "line": 4, "vars": { "X.shape": "(4,2)", "y": "[2.1, 3.0, 3.9, 5.1]" }, "note": "X[:,0]=1 (bias column), X[:,1] is the feature" },
    { "line": 5, "vars": { "w": "[0.0, 0.0]" }, "note": "Start: all weights are zero" },
    { "line": 7, "vars": { "y_pred": "[0.0, 0.0, 0.0, 0.0]" }, "note": "y_pred = X @ w = zeros (model knows nothing)" },
    { "line": 8, "vars": { "residuals": "[2.1, 3.0, 3.9, 5.1]" }, "note": "Residuals = y_true − y_pred. All positive: model under-predicts everything" },
    { "line": 9, "vars": { "squared": "[4.41, 9.0, 15.21, 26.01]" }, "note": "Each residual squared. Note: large residual 5.1 → 26.01 (disproportionate)" },
    { "line": 10, "vars": { "mse_val": 13.657 }, "note": "MSE = mean of squared residuals = 54.63 / 4 = 13.66" },
    { "line": 11, "vars": { "grad": "[-7.05, -26.6]" }, "note": "grad[0]=bias gradient, grad[1]=weight gradient. Both large and negative → step uphill; we go the opposite direction" }
  ],
  "speed": 1000
}
\`\`\`

---

## Implementing the Gradient

\`\`\`playground
{
  "title": "MSE Gradient Implementation",
  "language": "python",
  "runnable": true,
  "code": "import numpy as np\\n\\ndef mse(y_true, y_pred):\\n    return np.mean((y_true - y_pred) ** 2)\\n\\ndef mse_gradient(X, y_true, y_pred):\\n    \\"\\"\\"\\n    Gradient of MSE with respect to weights w.\\n    \\n    d(MSE)/dw = -(2/n) * X^T @ (y_true - y_pred)\\n    \\n    Args:\\n        X:      np.ndarray (n, d) — design matrix\\n        y_true: np.ndarray (n,)   — ground truth\\n        y_pred: np.ndarray (n,)   — current predictions\\n    Returns:\\n        grad: np.ndarray (d,) — gradient vector\\n    \\"\\"\\"\\n    n = len(y_true)\\n    residuals = y_true - y_pred\\n    return -(2 / n) * (X.T @ residuals)\\n\\n\\n# --- Verify gradient with finite differences ---\\nnp.random.seed(0)\\nn, d = 50, 3\\nX = np.column_stack([np.ones(n), np.random.randn(n, d-1)])\\ny = 3*X[:,1] + 1.5*X[:,2] + np.random.randn(n)*0.3 + 2.0\\nw = np.random.randn(d)\\n\\ny_pred = X @ w\\nanalytic_grad = mse_gradient(X, y, y_pred)\\n\\n# Finite difference check\\neps = 1e-5\\nnumeric_grad = np.zeros(d)\\nfor j in range(d):\\n    w_plus = w.copy(); w_plus[j] += eps\\n    w_minus = w.copy(); w_minus[j] -= eps\\n    numeric_grad[j] = (mse(y, X @ w_plus) - mse(y, X @ w_minus)) / (2 * eps)\\n\\nprint(\\"Analytic gradient: \\", np.round(analytic_grad, 5))\\nprint(\\"Numeric gradient:  \\", np.round(numeric_grad, 5))\\nprint(\\"Max difference:    \\", np.max(np.abs(analytic_grad - numeric_grad)))\\nprint(\\"\\\\nGradients match!\\" if np.allclose(analytic_grad, numeric_grad, atol=1e-5) else \\"\\\\nMismatch!\\")"
}
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Always Verify Gradients", "content": "The finite-difference check computes (f(w+ε) − f(w−ε)) / 2ε — a numerical approximation of the derivative. If your analytic gradient differs from this by more than ~1e-5, there's a bug in your math or code. This is called a **gradient check** and is standard practice when implementing loss functions from scratch." }
\`\`\`

---

## The Full Picture: Loss → Gradient → Update

\`\`\`steps
{
  "title": "One Gradient Descent Step",
  "steps": [
    {
      "title": "Forward Pass — Compute Predictions",
      "content": "Given current weights **w**, compute predictions:\\n\\n\`\`\`python\\ny_pred = X @ w   # shape (n,)\\n\`\`\`\\n\\nThis is the model's current best guess."
    },
    {
      "title": "Compute MSE Loss",
      "content": "Measure how wrong the predictions are:\\n\\n\`\`\`python\\nloss = np.mean((y_true - y_pred) ** 2)\\n\`\`\`\\n\\nThis is the number we want to minimize."
    },
    {
      "title": "Compute Gradient",
      "content": "Find which direction increases loss fastest:\\n\\n\`\`\`python\\ngrad = -(2/n) * (X.T @ (y_true - y_pred))\\n\`\`\`\\n\\nThe gradient points uphill; we'll step downhill."
    },
    {
      "title": "Update Weights",
      "content": "Take a small step opposite to the gradient:\\n\\n\`\`\`python\\nw = w - learning_rate * grad\\n\`\`\`\\n\\nRepeat steps 1–4 until loss converges."
    }
  ]
}
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{
  "title": "Implement MSE and Its Gradient",
  "prompt": "Complete the two functions below. The MSE formula is (1/n)Σeᵢ², and the gradient is −(2/n)·Xᵀ·e where e = y − ŷ.",
  "language": "python",
  "template": "import numpy as np\\n\\ndef mse_loss(y_true, y_pred):\\n    residuals = y_true - y_pred\\n    return np.mean(residuals ___ 2)\\n\\ndef mse_grad(X, y_true, y_pred):\\n    n = len(y_true)\\n    e = y_true - y_pred\\n    return ___(2 / n) * (X.T @ e)",
  "blanks": [
    { "answer": "**", "hint": "NumPy operator for element-wise exponentiation" },
    { "answer": "-", "hint": "The gradient points uphill; we need the negative direction to go downhill" }
  ]
}
\`\`\`

---

## MSE vs MAE: When Does It Matter?

| Property | MSE | MAE |
|---|---|---|
| Differentiable everywhere | ✅ Yes | ❌ Kink at 0 |
| Outlier sensitivity | High (squared penalty) | Low (linear penalty) |
| Loss surface | Convex, smooth | Convex, piecewise linear |
| Optimal estimate | Mean of y | Median of y |
| Gradient descent | Clean | Subgradient methods needed |

\`\`\`callout
{ "type": "warning", "title": "MSE and Outliers", "content": "Because MSE squares errors, a single outlier with 5× the typical residual contributes 25× as much to the loss. If your dataset has genuine outliers (measurement errors, corrupted labels), MSE may cause your model to contort itself to fit those bad points. In that case, consider Huber loss — which uses MSE for small errors and MAE for large ones." }
\`\`\`

\`\`\`collapse
{
  "title": "Deep Dive: Why MSE Is the MLE Estimator Under Gaussian Noise",
  "content": "There's a probabilistic justification for MSE that runs deeper than 'it's smooth.'\\n\\nAssume your data was generated by:\\n\`\`\`\\ny = wᵀx + ε,   where ε ~ N(0, σ²)\\n\`\`\`\\n\\nThe **likelihood** of observing the data given parameters **w** is:\\n\`\`\`\\nL(w) = Π P(yᵢ | xᵢ, w) = Π (1/√(2πσ²)) · exp(−eᵢ²/2σ²)\\n\`\`\`\\n\\nMaximum Likelihood Estimation says: find **w** that maximizes L(**w**). Taking the log (which doesn't change the argmax):\\n\`\`\`\\nlog L(w) = −n/2 · log(2πσ²) − (1/2σ²) · Σ eᵢ²\\n\`\`\`\\n\\nMaximizing this is equivalent to **minimizing Σ eᵢ²** — which is exactly MSE (up to the 1/n constant).\\n\\n**Conclusion:** If your noise is Gaussian, minimizing MSE is the statistically principled thing to do. It gives you the Maximum Likelihood Estimate of **w**."
}
\`\`\`

---

## Quiz

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Why is summing raw residuals (Σ eᵢ) a poor loss function?",
      "options": [
        "It is computationally expensive to compute",
        "Positive and negative errors cancel, making a wrong model appear perfect",
        "It cannot be differentiated with respect to the weights",
        "It only works for binary classification problems"
      ],
      "answer": 1,
      "explanation": "Raw residuals are signed. A model that predicts +10 on one sample and −10 on another has a total error of 0, even though it is badly wrong on both. Squaring or taking absolute values eliminates this cancellation problem."
    },
    {
      "question": "What is the analytic gradient of MSE with respect to weights w, given design matrix X and predictions ŷ?",
      "options": [
        "(2/n) · Xᵀ(y − ŷ)",
        "−(2/n) · Xᵀ(y − ŷ)",
        "(1/n) · Xᵀ(y − ŷ)",
        "−(1/n) · X(y − ŷ)"
      ],
      "answer": 1,
      "explanation": "Differentiating (1/n)‖y − Xw‖² with respect to w gives −(2/n)·Xᵀ(y − Xw) = −(2/n)·Xᵀ(y − ŷ). The negative sign means the gradient points downhill in the direction of the residuals."
    },
    {
      "question": "A model has residuals [1, −1, 3, −3]. What is its MSE?",
      "options": [
        "0.0",
        "2.0",
        "5.0",
        "8.0"
      ],
      "answer": 2,
      "explanation": "Squared residuals: [1, 1, 9, 9]. Mean = (1+1+9+9)/4 = 20/4 = 5.0. Notice that the large residuals (±3) contribute 9 each, dominating the loss."
    },
    {
      "question": "Why does MSE produce a convex loss surface for linear regression?",
      "options": [
        "Because the predictions are always positive",
        "Because squaring a linear function of w gives a quadratic, and quadratics are convex",
        "Because gradient descent always converges",
        "Because MSE penalizes outliers less than MAE"
      ],
      "answer": 1,
      "explanation": "ŷ = Xw is linear in w, so (y − Xw)² is quadratic in w. A sum of convex functions is convex, and a positive-semidefinite quadratic has exactly one global minimum — guaranteeing gradient descent converges."
    },
    {
      "question": "Under which probabilistic assumption does minimizing MSE equal Maximum Likelihood Estimation?",
      "options": [
        "The residuals follow a uniform distribution",
        "The residuals follow a Laplace (double-exponential) distribution",
        "The residuals follow a Gaussian (normal) distribution",
        "The features follow a Gaussian distribution"
      ],
      "answer": 2,
      "explanation": "If ε ~ N(0, σ²), the log-likelihood decomposes into a constant minus (1/2σ²)·Σeᵢ². Maximizing the log-likelihood is equivalent to minimizing Σeᵢ², i.e., MSE. MAE is the MLE estimator when noise is Laplacian."
    }
  ]
}
\`\`\`

---

## Putting It Together: Mini Training Loop

\`\`\`playground
{
  "title": "One Complete Training Loop with MSE",
  "language": "python",
  "runnable": true,
  "code": "import numpy as np\\n\\n# --- Loss and gradient ---\\ndef mse(y_true, y_pred):\\n    return np.mean((y_true - y_pred) ** 2)\\n\\ndef mse_gradient(X, y_true, y_pred):\\n    n = len(y_true)\\n    return -(2 / n) * (X.T @ (y_true - y_pred))\\n\\n# --- Generate synthetic data: y = 3x + 2 + noise ---\\nnp.random.seed(7)\\nn = 200\\nx_raw = np.random.randn(n)\\ny_true = 3.0 * x_raw + 2.0 + np.random.randn(n) * 0.5\\n\\n# Design matrix: bias column + feature\\nX = np.column_stack([np.ones(n), x_raw])   # shape (200, 2)\\n\\n# --- Gradient descent ---\\nw = np.zeros(2)        # [bias, weight]\\nlr = 0.05\\nepochs = 200\\n\\nfor epoch in range(epochs):\\n    y_pred = X @ w\\n    loss = mse(y_true, y_pred)\\n    grad = mse_gradient(X, y_true, y_pred)\\n    w = w - lr * grad\\n    \\n    if epoch % 40 == 0:\\n        print(f\\"Epoch {epoch:3d} | MSE: {loss:.4f} | w=[{w[0]:.3f}, {w[1]:.3f}]\\")\\n\\nprint(f\\"\\\\nFinal params:  bias={w[0]:.3f}, weight={w[1]:.3f}\\")\\nprint(f\\"True params:   bias=2.000, weight=3.000\\")\\nprint(f\\"Final MSE:     {mse(y_true, X @ w):.4f}\\")"
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "MSE = (1/n) Σ(yᵢ − ŷᵢ)² — it measures average squared prediction error across all samples.",
    "Squaring residuals eliminates sign (no cancellation), penalizes large errors disproportionately, and produces a smooth convex loss surface that gradient descent can reliably minimize.",
    "The gradient of MSE with respect to weights is −(2/n)·Xᵀ(y − ŷ) — a vectorized formula that updates all weights simultaneously using the full dataset.",
    "Minimizing MSE is equivalent to Maximum Likelihood Estimation when noise is Gaussian — giving the choice a principled statistical foundation.",
    "Always verify analytic gradients using finite differences before trusting your implementation. A mismatch greater than ~1e-5 signals a bug."
  ]
}
\`\`\``,
      starterCode: `import numpy as np

# Mean Squared Error (MSE) Loss Function
# MSE = (1/n) * sum((y_pred - y_true)^2)
# Squaring residuals: penalizes large errors more, ensures non-negative loss,
# and gives a smooth differentiable surface for gradient descent.

def mse_loss(y_true, y_pred):
    """
    Compute Mean Squared Error between true and predicted values.

    Args:
        y_true: array of true target values
        y_pred: array of predicted values

    Returns:
        scalar MSE loss
    """
    # TODO: Compute the residuals (difference between predictions and true values)
    residuals = None

    # TODO: Square the residuals element-wise
    squared = None

    # TODO: Return the mean of the squared residuals
    return None


def mse_gradient(y_true, y_pred):
    """
    Compute the gradient of MSE with respect to y_pred.

    Derivation:
      MSE = (1/n) * sum((y_pred - y_true)^2)
      dMSE/dy_pred = (2/n) * (y_pred - y_true)

    Args:
        y_true: array of true target values
        y_pred: array of predicted values

    Returns:
        array of gradients (same shape as y_pred)
    """
    n = len(y_true)

    # TODO: Compute and return the gradient using the formula above
    return None


# --- Test your implementation ---
if __name__ == '__main__':
    y_true = np.array([3.0, -0.5, 2.0, 7.0])
    y_pred = np.array([2.5,  0.0, 2.0, 8.0])

    loss = mse_loss(y_true, y_pred)
    grad = mse_gradient(y_true, y_pred)

    print(f'MSE Loss:  {loss:.4f}')   # Expected: 0.3750
    print(f'Gradient:  {grad}')        # Expected: [-0.25  0.25  0.    0.5 ]

    # Sanity check: perfect predictions should give zero loss
    perfect_loss = mse_loss(y_true, y_true)
    print(f'Perfect MSE: {perfect_loss}')  # Expected: 0.0
`,
      solutionCode: `import numpy as np

# Mean Squared Error (MSE) Loss Function
# MSE = (1/n) * sum((y_pred - y_true)^2)
#
# Why square the residuals?
#   1. Negative and positive errors don't cancel each other out.
#   2. Larger errors are penalized disproportionately (quadratic growth).
#   3. The function is smooth and differentiable everywhere — ideal for gradient descent.

def mse_loss(y_true, y_pred):
    """
    Compute Mean Squared Error between true and predicted values.

    Args:
        y_true: array of true target values
        y_pred: array of predicted values

    Returns:
        scalar MSE loss
    """
    # Step 1: residuals — how far off each prediction is
    residuals = y_pred - y_true

    # Step 2: square to make all values positive and penalize large errors
    squared = residuals ** 2

    # Step 3: average over all samples
    return np.mean(squared)


def mse_gradient(y_true, y_pred):
    """
    Compute the gradient of MSE with respect to y_pred.

    Derivation:
      MSE = (1/n) * sum((y_pred - y_true)^2)

      Let r_i = y_pred_i - y_true_i  (residual for sample i)
      MSE = (1/n) * sum(r_i^2)

      d(MSE)/d(y_pred_i) = (1/n) * 2 * r_i
                         = (2/n) * (y_pred_i - y_true_i)

    Args:
        y_true: array of true target values
        y_pred: array of predicted values

    Returns:
        array of gradients (same shape as y_pred)
    """
    n = len(y_true)
    # Gradient points in the direction that increases MSE;
    # subtract this (scaled by learning rate) to descend.
    return (2 / n) * (y_pred - y_true)


# --- Test ---
if __name__ == '__main__':
    y_true = np.array([3.0, -0.5, 2.0, 7.0])
    y_pred = np.array([2.5,  0.0, 2.0, 8.0])

    loss = mse_loss(y_true, y_pred)
    grad = mse_gradient(y_true, y_pred)

    print(f'MSE Loss:  {loss:.4f}')   # 0.3750
    print(f'Gradient:  {grad}')        # [-0.25  0.25  0.    0.5 ]

    # Perfect predictions => zero loss, zero gradient
    perfect_loss = mse_loss(y_true, y_true)
    print(f'Perfect MSE: {perfect_loss}')  # 0.0
`,
    },
    {
      id: "normal-equation",
      slug: "normal-equation",
      title: "The Normal Equation: Closed-Form Solution",
      content: `# The Normal Equation: Closed-Form Solution

You've seen how gradient descent crawls toward the optimal weights one step at a time. But what if you could skip straight to the answer? That's exactly what the **Normal Equation** does — it computes the optimal weights in a single matrix operation.

In this lesson you'll derive *why* this formula works, implement it from scratch in NumPy, and build an intuition for when to use it and when to reach for gradient descent instead.

---

## The Problem We're Solving

Recall that in linear regression we want to find weights **θ** such that **Xθ ≈ y**. The cost function we minimize is the mean squared error:

$$J(\\theta) = \\frac{1}{2m} \\| X\\theta - y \\|^2$$

With gradient descent you iterate: compute the gradient, nudge θ, repeat. The Normal Equation asks a simpler question: **where is the gradient exactly zero?**

\`\`\`concept
{ "title": "The Normal Equation as a GPS Destination", "variant": "analogy", "content": "Gradient descent is like hiking to a valley by always walking downhill — you'll get there eventually. The Normal Equation is like having a GPS that tells you the valley's coordinates directly. You teleport there in one step. The catch: GPS only works when the terrain is a smooth bowl (convex, invertible). If the map is broken — say, two features are identical — the GPS fails." }
\`\`\`

---

## Deriving the Formula

We want to find θ that minimizes J(θ). Let's take the derivative and set it to zero.

\`\`\`steps
{ "title": "Derivation of the Normal Equation", "steps": [ { "title": "Write the cost in matrix form", "content": "The squared error cost (without the 1/2m scaling for simplicity) is:\\n\\n\`\`\`\\nJ(θ) = (Xθ - y)ᵀ (Xθ - y)\\n\`\`\`\\n\\nExpand this product:\\n\\n\`\`\`\\nJ(θ) = θᵀXᵀXθ - 2θᵀXᵀy + yᵀy\\n\`\`\`\\n\\nThis is a scalar quadratic in θ." }, { "title": "Take the gradient with respect to θ", "content": "Differentiate J with respect to θ using standard matrix calculus rules:\\n\\n\`\`\`\\n∂J/∂θ = 2XᵀXθ - 2Xᵀy\\n\`\`\`\\n\\nRemember: for a quadratic form **aᵀBa**, the gradient is **(B + Bᵀ)a**. Since **XᵀX** is symmetric, this simplifies to **2XᵀXθ**." }, { "title": "Set the gradient to zero", "content": "At the minimum, the gradient equals zero:\\n\\n\`\`\`\\n2XᵀXθ - 2Xᵀy = 0\\n   XᵀXθ = Xᵀy\\n\`\`\`\\n\\nThis is called the **Normal Equations** (plural) — one equation per weight." }, { "title": "Solve for θ", "content": "If **XᵀX** is invertible, multiply both sides on the left by **(XᵀX)⁻¹**:\\n\\n\`\`\`\\nθ = (XᵀX)⁻¹ Xᵀy\\n\`\`\`\\n\\nThis is the Normal Equation. It gives the exact least-squares solution in one shot." } ] }
\`\`\`

The matrix **X** here has shape **(m × n)** where m = number of samples and n = number of features (including the bias column of ones). So **XᵀX** is **(n × n)** — the thing we invert.

---

## Step-by-Step Execution Trace

Let's trace through a tiny 3-sample, 2-feature example so every matrix dimension is visible.

\`\`\`trace
{ "title": "Normal Equation on a 3-sample Dataset", "language": "python", "code": "import numpy as np\\n\\n# 3 samples: [bias, feature_1]\\nX = np.array([[1, 1],\\n               [1, 2],\\n               [1, 3]])\\ny = np.array([[2], [4], [5]])\\n\\n# Step 1: XᵀX\\nXtX = X.T @ X\\n\\n# Step 2: XᵀX inverse\\nXtX_inv = np.linalg.inv(XtX)\\n\\n# Step 3: Xᵀy\\nXty = X.T @ y\\n\\n# Step 4: solve\\ntheta = XtX_inv @ Xty\\nprint(theta)", "frames": [ { "line": 4, "vars": { "X": "[[1,1],[1,2],[1,3]]", "y": "[[2],[4],[5]]" }, "note": "Design matrix with bias column prepended. Shape: (3, 2).", "stdout": "" }, { "line": 8, "vars": { "XtX": "[[3,6],[6,14]]" }, "note": "XᵀX is always square (n×n). Here n=2 so shape is (2,2).", "stdout": "" }, { "line": 11, "vars": { "XtX_inv": "[[2.33,-1],[-1,0.5]]" }, "note": "We invert XᵀX. This is the expensive step — O(n³) in general.", "stdout": "" }, { "line": 14, "vars": { "Xty": "[[11],[26]]" }, "note": "Xᵀy has shape (n,1). Projects y onto the column space of X.", "stdout": "" }, { "line": 17, "vars": { "theta": "[[0.67],[1.5]]" }, "note": "θ₀ ≈ 0.67 (intercept), θ₁ ≈ 1.5 (slope). Exact least-squares solution.", "stdout": "[[0.66666667]\\n [1.5       ]]" } ], "speed": 900 }
\`\`\`

---

## Full Implementation in NumPy

Now let's write a clean, reusable implementation and verify it on a real dataset.

\`\`\`playground
{ "title": "Normal Equation — Full Implementation", "language": "python", "code": "import numpy as np\\n\\n# ─── Normal Equation Solver ───────────────────────────────────────\\ndef normal_equation(X, y):\\n    \\"\\"\\"\\n    Compute optimal weights via the Normal Equation.\\n    X : (m, n) design matrix — must already include bias column\\n    y : (m, 1) target vector\\n    Returns theta : (n, 1)\\n    \\"\\"\\"\\n    # (XᵀX)⁻¹ Xᵀy\\n    return np.linalg.inv(X.T @ X) @ X.T @ y\\n\\n\\n# ─── Generate Synthetic Data ──────────────────────────────────────\\nnp.random.seed(42)\\nm = 100                          # number of samples\\n\\n# True relationship: y = 3 + 1.5*x + noise\\nx = np.random.uniform(0, 10, (m, 1))\\ny = 3 + 1.5 * x + np.random.randn(m, 1) * 0.8\\n\\n# Add bias column (column of ones)\\nX = np.hstack([np.ones((m, 1)), x])\\n\\n# ─── Solve ────────────────────────────────────────────────────────\\ntheta = normal_equation(X, y)\\nprint(f\\"Estimated intercept : {theta[0, 0]:.4f}  (true: 3.0)\\")\\nprint(f\\"Estimated slope     : {theta[1, 0]:.4f}  (true: 1.5)\\")\\n\\n# ─── Evaluate ─────────────────────────────────────────────────────\\ny_pred = X @ theta\\nmse = np.mean((y - y_pred) ** 2)\\nprint(f\\"MSE on training set : {mse:.4f}\\")\\n\\n# ─── Predict a new point ──────────────────────────────────────────\\nx_new = np.array([[1, 7.0]])     # bias + feature value\\ny_new = x_new @ theta\\nprint(f\\"Prediction at x=7   : {y_new[0, 0]:.4f}  (expected ~13.5)\\")", "runnable": true }
\`\`\`

Run this — you'll see the estimated intercept and slope land very close to the true values of 3.0 and 1.5. That's the Normal Equation recovering a signal from noisy data **without a single iteration**.

---

## When the Normal Equation Breaks

\`\`\`callout
{ "type": "danger", "title": "XᵀX Must Be Invertible", "content": "The formula θ = (XᵀX)⁻¹Xᵀy requires XᵀX to be invertible (non-singular). This fails in two common situations:\\n\\n1. **Redundant features** — e.g., \`feature_2 = 2 × feature_1\`. The columns of X are linearly dependent, making XᵀX singular.\\n\\n2. **More features than samples** — if n > m, XᵀX is not full rank.\\n\\nFix: use \`np.linalg.pinv(X.T @ X)\` (Moore-Penrose pseudoinverse) or add L2 regularization: θ = (XᵀX + λI)⁻¹Xᵀy." }
\`\`\`

\`\`\`playground
{ "title": "Diagnosing Singular XᵀX", "language": "python", "code": "import numpy as np\\n\\n# Build a design matrix with a redundant feature\\nm = 50\\nnp.random.seed(0)\\nx1 = np.random.randn(m, 1)\\nx2 = 2.0 * x1              # x2 is a perfect copy of x1 scaled!\\nX_bad = np.hstack([np.ones((m, 1)), x1, x2])\\ny = 3 + x1 + np.random.randn(m, 1) * 0.5\\n\\nXtX = X_bad.T @ X_bad\\nprint(\\"Determinant of XᵀX:\\", np.linalg.det(XtX))\\nprint(\\"Rank of X:\\", np.linalg.matrix_rank(X_bad))\\n\\n# Direct inverse will fail or give garbage\\ntry:\\n    theta_bad = np.linalg.inv(XtX) @ X_bad.T @ y\\n    print(\\"Weights (unreliable):\\", theta_bad.ravel())\\nexcept np.linalg.LinAlgError as e:\\n    print(\\"Inverse failed:\\", e)\\n\\n# Safe alternative: pseudoinverse\\ntheta_safe = np.linalg.pinv(X_bad) @ y\\nprint(\\"Weights via pinv (safe):\\", theta_safe.ravel())", "runnable": true }
\`\`\`

---

## Normal Equation vs Gradient Descent

\`\`\`tabs
{ "tabs": [ { "label": "Normal Equation", "icon": "⚡", "content": "**Best when:**\\n- Number of features n ≤ ~10,000\\n- You want an exact solution without tuning\\n- No need for feature scaling\\n- One-shot answer is sufficient\\n\\n**Time complexity:** O(n²·⁴) to O(n³) — dominated by matrix inversion\\n\\n**Memory:** Must hold the full (n×n) matrix XᵀX in RAM\\n\\n**Hyperparameters:** None — no learning rate, no epochs\\n\\n\`\`\`python\\n# 3 lines of code\\nX_b = np.hstack([np.ones((m,1)), X])\\ntheta = np.linalg.inv(X_b.T @ X_b) @ X_b.T @ y\\n\`\`\`" }, { "label": "Gradient Descent", "icon": "🔄", "content": "**Best when:**\\n- Number of features n > 10,000 (images, NLP, etc.)\\n- Dataset is too large to fit in memory (use mini-batches)\\n- You want to extend to non-linear models (neural networks)\\n- You need online / streaming updates\\n\\n**Time complexity:** O(k·m·n) per run, where k = iterations\\n\\n**Memory:** Only needs the current batch, not the full matrix\\n\\n**Hyperparameters:** Learning rate α, number of epochs\\n\\n\`\`\`python\\n# Scales to millions of features\\nfor _ in range(epochs):\\n    grad = X.T @ (X @ theta - y) / m\\n    theta -= alpha * grad\\n\`\`\`" }, { "label": "When to Use Which", "icon": "🗺️", "content": "| Criterion | Normal Equation | Gradient Descent |\\n|---|---|---|\\n| n ≤ 10,000 | ✅ Preferred | Works too |\\n| n > 10,000 | ❌ Too slow | ✅ Preferred |\\n| Feature scaling | Not needed | Required |\\n| Learning rate | Not needed | Must tune |\\n| Online learning | ❌ | ✅ |\\n| Non-linear models | ❌ | ✅ |\\n| Exact solution | ✅ | Approximate |\\n\\nFor modern deep learning (millions of parameters), gradient descent wins every time. The Normal Equation is your go-to for small, clean tabular datasets." } ] }
\`\`\`

---

## Fill in the Blanks

Practice writing the Normal Equation implementation from memory.

\`\`\`fillblank
{ "title": "Implement the Normal Equation", "prompt": "Complete the function that computes θ = (XᵀX)⁻¹Xᵀy. X already includes the bias column.", "language": "python", "template": "import numpy as np\\n\\ndef normal_equation(X, y):\\n    XtX = ___ @ ___          # Compute XᵀX\\n    XtX_inv = np.linalg.___(___)   # Invert it\\n    Xty = ___ @ ___          # Compute Xᵀy\\n    return XtX_inv @ ___     # Final multiply", "blanks": [ { "answer": "X.T", "hint": "Transpose of X" }, { "answer": "X", "hint": "Multiply Xᵀ by X" }, { "answer": "inv", "hint": "NumPy linear algebra inverse function" }, { "answer": "XtX", "hint": "The matrix to invert" }, { "answer": "X.T", "hint": "Transpose of X again" }, { "answer": "y", "hint": "The target vector" }, { "answer": "Xty", "hint": "The right-hand side of the equation" } ] }
\`\`\`

---

## Numerical Stability: A Practical Note

\`\`\`callout
{ "type": "warning", "title": "Direct Inversion Has Precision Issues", "content": "Explicitly computing \`np.linalg.inv(X.T @ X)\` can accumulate floating-point errors when XᵀX is **ill-conditioned** (near-singular). A numerically stabler approach uses \`np.linalg.lstsq\`, which solves the system without explicitly inverting:\\n\\n\`\`\`python\\ntheta, _, _, _ = np.linalg.lstsq(X, y, rcond=None)\\n\`\`\`\\n\\nThis uses QR or SVD decomposition under the hood and is what \`sklearn.LinearRegression\` actually does internally. For learning purposes the direct inverse is fine; in production code prefer \`lstsq\`." }
\`\`\`

---

## Predicting Academic Performance — A Real Use Case

Let's apply the Normal Equation to a realistic scenario: predicting student midterm scores from study habits.

\`\`\`playground
{ "title": "Predicting Student Scores with the Normal Equation", "language": "python", "code": "import numpy as np\\n\\n# Features: [study_hours_per_week, attendance_pct, prior_gpa]\\n# Each row is one student\\nX_raw = np.array([\\n    [5,  80, 2.8],\\n    [10, 95, 3.5],\\n    [3,  60, 2.2],\\n    [8,  88, 3.1],\\n    [12, 97, 3.9],\\n    [6,  75, 3.0],\\n    [2,  55, 1.8],\\n    [9,  90, 3.4],\\n])\\n# Midterm scores (target)\\ny = np.array([[62], [88], [50], [74], [95], [68], [45], [82]])\\n\\nm = X_raw.shape[0]\\n\\n# Add bias column\\nX = np.hstack([np.ones((m, 1)), X_raw])\\n\\n# Solve via Normal Equation\\ntheta = np.linalg.inv(X.T @ X) @ X.T @ y\\n\\nfeature_names = [\\"intercept\\", \\"study_hrs\\", \\"attendance\\", \\"prior_gpa\\"]\\nfor name, w in zip(feature_names, theta.ravel()):\\n    print(f\\"  {name:12s}: {w:+.3f}\\")\\n\\n# Predict for a new student:\\n# 7 study hours, 85% attendance, 3.2 GPA\\nx_new = np.array([[1, 7, 85, 3.2]])\\nprediction = x_new @ theta\\nprint(f\\"\\\\nPredicted score for new student: {prediction[0,0]:.1f}\\")", "runnable": true }
\`\`\`

Each coefficient tells a story: study hours and attendance are positive predictors, and the intercept captures the baseline. No iterations, no learning rate — just a single matrix solve.

---

## Quiz

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "The Normal Equation computes θ = (XᵀX)⁻¹Xᵀy. What does the matrix X represent?", "options": ["The weight vector of the model", "The design matrix containing input features (with a bias column)", "The covariance matrix of the targets", "The inverse of the target variable matrix"], "answer": 1, "explanation": "X is the design matrix of shape (m × n), where m is the number of training samples and n is the number of features including the prepended bias column of ones." }, { "question": "What is the primary computational bottleneck of the Normal Equation?", "options": ["Computing the dot product Xᵀy", "Inverting the n×n matrix XᵀX, which is O(n²·⁴) to O(n³)", "Transposing the matrix X", "Storing the training labels y"], "answer": 1, "explanation": "The dominant cost is matrix inversion of (XᵀX), an n×n matrix. This scales as O(n^2.4) to O(n^3) with the number of features n, making it prohibitively expensive when n exceeds ~10,000." }, { "question": "Under which condition does the Normal Equation fail to produce a unique solution?", "options": ["When the learning rate is too high", "When XᵀX is singular (non-invertible), e.g. due to redundant features or n > m", "When feature values are not scaled to [0, 1]", "When the target variable y has a non-zero mean"], "answer": 1, "explanation": "XᵀX is singular when the columns of X are linearly dependent (e.g., one feature is a linear combination of another) or when there are more features than samples. In these cases the inverse does not exist and the equation cannot be solved directly." }, { "question": "Which statement about feature scaling and the Normal Equation is correct?", "options": ["Feature scaling is required for the Normal Equation to converge", "Feature scaling speeds up the Normal Equation significantly", "Feature scaling is NOT required for the Normal Equation", "The Normal Equation only works on standardised features"], "answer": 2, "explanation": "Unlike gradient descent — which is sensitive to the scale of input features — the Normal Equation does not require feature scaling. It finds the exact solution regardless of the magnitude of the features." }, { "question": "A data scientist has a dataset with 500,000 features (e.g., pixel values). Which method should they prefer?", "options": ["Normal Equation, because it gives an exact solution", "Normal Equation with pseudoinverse to handle the large matrix", "Gradient Descent, because the O(n³) cost of inverting XᵀX is prohibitive", "Either method — performance is identical above 10,000 features"], "answer": 2, "explanation": "With 500,000 features, the XᵀX matrix would be 500,000 × 500,000, and inverting it would require enormous compute and memory. Gradient Descent (or mini-batch variants) scale linearly with features per iteration and are strongly preferred at this scale." } ] }
\`\`\`

---

## The Pseudoinverse — A Robust Alternative

\`\`\`collapse
{ "title": "Deep Dive: Moore-Penrose Pseudoinverse", "content": "When XᵀX is singular or nearly singular, the standard inverse breaks down. The **Moore-Penrose pseudoinverse** extends the concept of an inverse to non-square and rank-deficient matrices.\\n\\nFor the Normal Equation, this gives:\\n\\n\`\`\`\\nθ = X⁺ y\\n\`\`\`\\n\\nwhere X⁺ = (XᵀX)⁻¹Xᵀ when XᵀX is invertible, but generalises gracefully when it is not.\\n\\nIn NumPy:\\n\\n\`\`\`python\\ntheta = np.linalg.pinv(X) @ y\\n\`\`\`\\n\\nInternally, NumPy computes the **Singular Value Decomposition (SVD)** X = UΣVᵀ and inverts only the non-zero singular values. This makes it:\\n\\n- **Numerically stable** — small singular values are thresholded rather than inverted (which would explode)\\n- **Rank-robust** — works even when columns are linearly dependent\\n- **The basis of \`sklearn.LinearRegression\`** — which uses a similar SVD-based solver under the hood\\n\\nThe trade-off is slightly higher computational cost than a direct inverse for well-conditioned matrices." }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The Normal Equation θ = (XᵀX)⁻¹Xᵀy finds the exact least-squares solution in one step by setting the gradient of the cost function to zero.", "Its computational bottleneck is inverting the (n×n) matrix XᵀX, which is O(n²·⁴) to O(n³) — making it impractical for n > ~10,000 features.", "Feature scaling is NOT required for the Normal Equation, unlike gradient descent.", "If XᵀX is singular (due to redundant features or n > m), use the pseudoinverse (np.linalg.pinv) or add L2 regularization: θ = (XᵀX + λI)⁻¹Xᵀy.", "For large-scale problems, neural networks, and online learning, gradient descent is the right tool — the Normal Equation does not extend to non-linear models.", "In production code, prefer np.linalg.lstsq over explicit inversion for better numerical stability." ] }
\`\`\``,
    },
    {
      id: "gradient-descent-regression",
      slug: "gradient-descent-regression",
      title: "Gradient Descent for Linear Regression",
      content: `# Gradient Descent for Linear Regression

Ordinary least squares gives us a closed-form solution — but only when the matrix inversion is cheap. Once you have millions of features or data points, that inversion becomes computationally brutal. **Gradient descent** is the iterative alternative: start with a guess, measure how wrong you are, then nudge the parameters in the direction that reduces the error. Repeat until you converge.

This lesson builds gradient descent for linear regression from scratch using only NumPy. By the end, you'll understand the math, implement the algorithm, visualize convergence, and know exactly how to diagnose a bad learning rate.

---

## The Setup: What Are We Optimizing?

In linear regression, our model predicts:

$$\\hat{y} = Xw + b$$

where \`X\` is our feature matrix (shape \`[n, d]\`), \`w\` is the weight vector (shape \`[d]\`), and \`b\` is the scalar bias.

We measure how bad our predictions are with **Mean Squared Error (MSE)**:

$$J(w, b) = \\frac{1}{n} \\sum_{i=1}^{n} (\\hat{y}_i - y_i)^2 = \\frac{1}{n} \\|Xw + b - y\\|^2$$

Gradient descent's goal: find the \`w\` and \`b\` that minimize \`J\`.

\`\`\`concept
{ "title": "Loss Surface Intuition", "variant": "analogy", "content": "Imagine J(w, b) as a hilly landscape and you're blindfolded on it. You can't see the valley, but you can feel which direction the ground slopes downward under your feet. Gradient descent says: always step in the direction of steepest descent. Take small enough steps and you'll eventually reach the bottom." }
\`\`\`

---

## The Gradient: Which Way Is Down?

To step downhill, we need the gradient of \`J\` — a vector of partial derivatives that points in the direction of *steepest ascent*. We go the **opposite** direction.

For MSE with predictions \`ŷ = Xw + b\`, the gradients are:

$$\\frac{\\partial J}{\\partial w} = \\frac{2}{n} X^T (\\hat{y} - y)$$

$$\\frac{\\partial J}{\\partial b} = \\frac{2}{n} \\sum_{i=1}^{n} (\\hat{y}_i - y_i)$$

The constant 2 is often absorbed into the learning rate, so in practice you'll see the \`1/n\` form without it — both work identically.

\`\`\`tabs
{ "tabs": [
  { "label": "Derive ∂J/∂w", "icon": "📐", "content": "**Start with J:**\\n\\n\`\`\`\\nJ = (1/n) * ||Xw + b - y||²\\n  = (1/n) * (Xw + b - y)ᵀ(Xw + b - y)\\n\`\`\`\\n\\nLet residuals \`r = Xw + b - y\`. Then:\\n\\n\`\`\`\\nJ = (1/n) * rᵀr\\n∂J/∂w = (2/n) * Xᵀr\\n      = (2/n) * Xᵀ(Xw + b - y)\\n\`\`\`\\n\\nThis is the chain rule: outer derivative \`2r/n\`, inner derivative \`Xᵀ\`." },
  { "label": "Derive ∂J/∂b", "icon": "📐", "content": "**Bias is a scalar**, so we differentiate with respect to a single number:\\n\\n\`\`\`\\n∂J/∂b = (2/n) * Σ(ŷᵢ - yᵢ)\\n       = (2/n) * sum(residuals)\\n\`\`\`\\n\\nIn NumPy: \`np.mean(residuals)\` (when you drop the 2 factor).\\n\\nThe bias gradient is just the mean residual — intuitive! If you're systematically over-predicting, the bias should decrease." },
  { "label": "Update Rule", "icon": "🔁", "content": "Once we have the gradients, the update is:\\n\\n\`\`\`\\nw ← w - α * ∂J/∂w\\nb ← b - α * ∂J/∂b\\n\`\`\`\\n\\nWhere \`α\` (alpha) is the **learning rate** — a hyperparameter you choose. It controls step size.\\n\\n- Too large → overshoot the minimum, loss explodes\\n- Too small → converge correctly but slowly\\n- Just right → smooth descent to the minimum" }
] }
\`\`\`

---

## Tracing One Gradient Descent Step

Before writing the full loop, let's trace through a single update by hand on a tiny dataset.

\`\`\`trace
{ "title": "One Gradient Descent Step (n=4, d=1)", "language": "python", "code": "import numpy as np\\n\\n# Tiny dataset: house size → price\\nX = np.array([[1.0], [2.0], [3.0], [4.0]])\\ny = np.array([2.0, 4.0, 5.0, 8.0])\\nn = len(y)\\nalpha = 0.1\\n\\n# Initialize\\nw = np.array([0.0])\\nb = 0.0\\n\\n# Forward pass\\ny_hat = X @ w + b\\n\\n# Loss\\nloss = np.mean((y_hat - y) ** 2)\\n\\n# Gradients\\ndw = (2/n) * X.T @ (y_hat - y)\\ndb = (2/n) * np.sum(y_hat - y)\\n\\n# Update\\nw = w - alpha * dw\\nb = b - alpha * db", "frames": [
  { "line": 4, "vars": { "X": "[[1],[2],[3],[4]]", "y": "[2,4,5,8]" }, "note": "Load data. n=4 samples, d=1 feature." },
  { "line": 9, "vars": { "w": "[0.0]", "b": "0.0" }, "note": "Initialize weights and bias to zero. Any value works — we'll converge anyway." },
  { "line": 12, "vars": { "y_hat": "[0,0,0,0]" }, "note": "Forward pass: all predictions are 0 since w=0, b=0. Residuals = -y." },
  { "line": 15, "vars": { "loss": "27.25" }, "note": "MSE = mean([4, 16, 25, 64]) = 27.25. Very high — we're basically guessing nothing." },
  { "line": 18, "vars": { "dw": "[-9.5]", "db": "-4.75" }, "note": "Gradients are negative → loss decreases by increasing w and b. Makes sense: we're under-predicting." },
  { "line": 22, "vars": { "w": "[0.95]", "b": "0.475" }, "note": "After one step: w=0.95, b=0.475. Next prediction will be much closer. Loss will drop significantly." }
], "speed": 900 }
\`\`\`

---

## Full Batch Gradient Descent Implementation

Now let's build the complete algorithm — running the update loop for many iterations and tracking the loss curve.

\`\`\`playground
{ "title": "Batch Gradient Descent for Linear Regression", "language": "python", "code": "import numpy as np\\n\\ndef gradient_descent(X, y, alpha=0.01, n_iter=1000):\\n    \\"\\"\\"\\n    Batch gradient descent for linear regression.\\n    \\n    X: feature matrix, shape [n, d]\\n    y: target vector, shape [n]\\n    alpha: learning rate\\n    n_iter: number of iterations\\n    \\"\\"\\"\\n    n, d = X.shape\\n    w = np.zeros(d)       # weight vector\\n    b = 0.0               # bias scalar\\n    loss_history = []     # track convergence\\n    \\n    for i in range(n_iter):\\n        # --- Forward pass ---\\n        y_hat = X @ w + b              # predictions\\n        residuals = y_hat - y          # error per sample\\n        \\n        # --- Compute loss ---\\n        loss = np.mean(residuals ** 2) # MSE\\n        loss_history.append(loss)\\n        \\n        # --- Compute gradients ---\\n        dw = (2 / n) * X.T @ residuals\\n        db = (2 / n) * np.sum(residuals)\\n        \\n        # --- Update parameters ---\\n        w = w - alpha * dw\\n        b = b - alpha * db\\n        \\n        # Print progress every 100 steps\\n        if i % 100 == 0:\\n            print(f\\"Iter {i:4d} | Loss: {loss:.4f} | w: {w[0]:.4f} | b: {b:.4f}\\")\\n    \\n    return w, b, loss_history\\n\\n# --- Generate synthetic data ---\\nnp.random.seed(42)\\nn_samples = 100\\nX = np.random.randn(n_samples, 1) * 3  # feature\\ntrue_w, true_b = 2.5, -1.0\\ny = X.flatten() * true_w + true_b + np.random.randn(n_samples) * 0.5\\n\\n# --- Train ---\\nw_learned, b_learned, losses = gradient_descent(\\n    X, y, alpha=0.01, n_iter=500\\n)\\n\\nprint(f\\"\\\\nTrue:    w={true_w}, b={true_b}\\")\\nprint(f\\"Learned: w={w_learned[0]:.4f}, b={b_learned:.4f}\\")\\nprint(f\\"Final loss: {losses[-1]:.4f}\\")\\n", "runnable": true }
\`\`\`

Run it. You should see the loss drop rapidly in the first few iterations, then slow down as it approaches the minimum. The learned \`w\` and \`b\` should be close to \`2.5\` and \`-1.0\`.

---

## Visualizing the Loss Curve

The loss curve is your **diagnostic tool**. Here's what different shapes mean:

\`\`\`concept
{ "title": "Reading the Loss Curve", "variant": "rule", "content": "Healthy convergence: loss drops steeply, then flattens into a plateau. Divergence (loss grows): learning rate is too large. Loss oscillates wildly: learning rate too large or data needs normalization. Loss barely moves: learning rate too small or model is stuck." }
\`\`\`

Let's visualize how learning rate affects convergence by comparing three settings:

\`\`\`playground
{ "title": "Learning Rate Comparison", "language": "python", "code": "import numpy as np\\n\\ndef run_gd(X, y, alpha, n_iter=200):\\n    n, d = X.shape\\n    w, b = np.zeros(d), 0.0\\n    losses = []\\n    for _ in range(n_iter):\\n        y_hat = X @ w + b\\n        residuals = y_hat - y\\n        loss = np.mean(residuals ** 2)\\n        losses.append(loss)\\n        if not np.isfinite(loss):  # exploded\\n            break\\n        dw = (2/n) * X.T @ residuals\\n        db = (2/n) * np.sum(residuals)\\n        w -= alpha * dw\\n        b -= alpha * db\\n    return losses\\n\\n# Synthetic data\\nnp.random.seed(42)\\nX = np.random.randn(80, 1) * 2\\ny = 3.0 * X.flatten() + 1.5 + np.random.randn(80) * 0.4\\n\\n# Three learning rates\\nalpha_small  = 0.001\\nalpha_good   = 0.05\\nalpha_large  = 0.5\\n\\nloss_small = run_gd(X, y, alpha_small)\\nloss_good  = run_gd(X, y, alpha_good)\\nloss_large = run_gd(X, y, alpha_large)\\n\\n# Report final losses\\nprint(f\\"alpha={alpha_small}: final loss = {loss_small[-1]:.4f} ({len(loss_small)} iters)\\")\\nprint(f\\"alpha={alpha_good}:  final loss = {loss_good[-1]:.4f} ({len(loss_good)} iters)\\")\\nprint(f\\"alpha={alpha_large}: final loss = {loss_large[-1]:.4f} ({len(loss_large)} iters)\\")\\n\\n# Show first 5 loss values for each\\nprint(\\"\\\\nFirst 5 losses (small alpha):\\", [f'{l:.3f}' for l in loss_small[:5]])\\nprint(\\"First 5 losses (good alpha): \\", [f'{l:.3f}' for l in loss_good[:5]])\\nprint(\\"First 5 losses (large alpha):\\", [f'{l:.3f}' for l in loss_large[:5]])\\n", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Feature Scaling Matters", "content": "If your features have very different scales (e.g., one ranges 0-1, another 0-10000), the gradients for each weight have very different magnitudes. This forces you to use a tiny learning rate — or normalization. Always standardize features: subtract the mean, divide by the standard deviation." }
\`\`\`

---

## Algorithm Walkthrough: Seeing Gradient Descent Move

Watch how the weight parameter moves toward the true value over 8 iterations on a simple 1D problem:

\`\`\`algoviz
{ "title": "Weight Value Across Gradient Descent Iterations", "type": "array", "data": [0.0, 0.48, 0.87, 1.19, 1.45, 1.66, 1.83, 1.97, 2.08], "frames": [
  { "highlight": [0], "label": "Iter 0: w=0.00 (initialized to zero)", "stats": { "loss": 9.42, "gradient": "-4.8" } },
  { "highlight": [1], "label": "Iter 1: w=0.48, loss dropping fast", "stats": { "loss": 5.21, "gradient": "-3.9" } },
  { "highlight": [2], "label": "Iter 2: w=0.87, still big steps", "stats": { "loss": 2.89, "gradient": "-3.1" } },
  { "highlight": [3], "label": "Iter 3: w=1.19, gradient shrinking", "stats": { "loss": 1.61, "gradient": "-2.5" } },
  { "highlight": [4], "label": "Iter 4: w=1.45, approaching valley", "stats": { "loss": 0.90, "gradient": "-2.0" } },
  { "highlight": [5], "label": "Iter 5: w=1.66, steps getting smaller naturally", "stats": { "loss": 0.50, "gradient": "-1.6" } },
  { "highlight": [6], "label": "Iter 6: w=1.83", "stats": { "loss": 0.28, "gradient": "-1.3" } },
  { "highlight": [7], "label": "Iter 7: w=1.97, near true value (2.0)", "stats": { "loss": 0.16, "gradient": "-1.0" } },
  { "highlight": [8], "label": "Iter 8: w=2.08, slightly overshot — learning rate slightly large", "stats": { "loss": 0.09, "gradient": "-0.8" } }
], "speed": 800 }
\`\`\`

Notice: the steps naturally get **smaller as we approach the minimum** — even without changing the learning rate. This is because the gradient itself shrinks as the residuals shrink. Gradient descent is self-decelerating near optima.

---

## Adding Feature Normalization

Let's make a production-ready version that normalizes inputs first:

\`\`\`playground
{ "title": "Gradient Descent with Feature Normalization", "language": "python", "code": "import numpy as np\\n\\nclass LinearRegressionGD:\\n    def __init__(self, alpha=0.01, n_iter=1000, tol=1e-6):\\n        self.alpha = alpha\\n        self.n_iter = n_iter\\n        self.tol = tol       # early stopping tolerance\\n        self.w = None\\n        self.b = None\\n        self.loss_history = []\\n        # For normalization\\n        self.X_mean = None\\n        self.X_std = None\\n    \\n    def _normalize(self, X):\\n        return (X - self.X_mean) / (self.X_std + 1e-8)\\n    \\n    def fit(self, X, y):\\n        # Store normalization stats from training data\\n        self.X_mean = X.mean(axis=0)\\n        self.X_std = X.std(axis=0)\\n        X_norm = self._normalize(X)\\n        \\n        n, d = X_norm.shape\\n        self.w = np.zeros(d)\\n        self.b = 0.0\\n        prev_loss = float('inf')\\n        \\n        for i in range(self.n_iter):\\n            y_hat = X_norm @ self.w + self.b\\n            residuals = y_hat - y\\n            loss = np.mean(residuals ** 2)\\n            self.loss_history.append(loss)\\n            \\n            # Early stopping\\n            if abs(prev_loss - loss) < self.tol:\\n                print(f\\"Converged at iteration {i}\\")\\n                break\\n            prev_loss = loss\\n            \\n            dw = (2 / n) * X_norm.T @ residuals\\n            db = (2 / n) * np.sum(residuals)\\n            self.w -= self.alpha * dw\\n            self.b -= self.alpha * db\\n        \\n        return self\\n    \\n    def predict(self, X):\\n        X_norm = self._normalize(X)\\n        return X_norm @ self.w + self.b\\n\\n# --- Test: mixed-scale features ---\\nnp.random.seed(7)\\nn = 150\\nX = np.column_stack([\\n    np.random.randn(n) * 100,    # feature 1: large scale\\n    np.random.randn(n) * 0.01,   # feature 2: tiny scale\\n    np.random.randn(n)           # feature 3: normal scale\\n])\\ntrue_w = np.array([0.5, 200.0, -3.0])\\ny = X @ true_w + 5.0 + np.random.randn(n) * 2\\n\\nmodel = LinearRegressionGD(alpha=0.1, n_iter=2000)\\nmodel.fit(X, y)\\n\\ny_pred = model.predict(X)\\nmse = np.mean((y_pred - y) ** 2)\\nprint(f\\"Final MSE: {mse:.4f}\\")\\nprint(f\\"Loss history length: {len(model.loss_history)}\\")\\nprint(f\\"First loss: {model.loss_history[0]:.2f}\\")\\nprint(f\\"Last loss: {model.loss_history[-1]:.4f}\\")\\n", "runnable": true }
\`\`\`

---

## Practice: Fill in the Gradient

Can you complete the core gradient descent update loop?

\`\`\`fillblank
{ "title": "Complete the Gradient Descent Step", "prompt": "Fill in the missing pieces of the gradient computation and parameter update:", "language": "python", "template": "def gd_step(X, y, w, b, alpha):\\n    n = len(y)\\n    y_hat = X @ w + ___        # forward pass\\n    residuals = ___ - y         # compute error\\n    loss = np.mean(residuals ** 2)\\n    \\n    dw = (2/n) * ___.T @ residuals   # gradient w.r.t. weights\\n    db = (2/n) * np.sum(___)          # gradient w.r.t. bias\\n    \\n    w = w - ___ * dw           # update weights\\n    b = b - alpha * ___        # update bias\\n    return w, b, loss", "blanks": [
  { "answer": "b", "hint": "The bias term is added to the dot product" },
  { "answer": "y_hat", "hint": "Residual = prediction minus truth" },
  { "answer": "X", "hint": "The gradient w.r.t. w involves the transposed feature matrix" },
  { "answer": "residuals", "hint": "Gradient w.r.t. bias is the mean of these" },
  { "answer": "alpha", "hint": "This is the learning rate hyperparameter" },
  { "answer": "db", "hint": "Apply the same update rule: subtract learning_rate times gradient" }
] }
\`\`\`

---

## Diagnosing Convergence Problems

\`\`\`steps
{ "title": "Troubleshooting Gradient Descent", "steps": [
  { "title": "Loss is NaN or Inf", "content": "**Cause:** Learning rate is too large — the parameter updates overshoot so badly that the loss explodes.\\n\\n**Fix:** Divide your learning rate by 10 and retry. A good starting point is \`alpha = 0.01\`.\\n\\n\`\`\`python\\n# Quick diagnostic\\nif not np.isfinite(loss):\\n    print('Diverged! Reduce alpha.')\\n\`\`\`" },
  { "title": "Loss Decreases, Then Plateaus Too Early", "content": "**Cause:** Learning rate too small — gradient steps are tiny and you need 10x more iterations.\\n\\n**Fix:** Increase \`alpha\`, add more iterations, or use a **learning rate schedule** (start large, decay over time).\\n\\n**Alternative:** Use feature normalization — unnormalized features force small learning rates." },
  { "title": "Loss Oscillates (Up and Down)", "content": "**Cause:** Learning rate is on the edge of too large — you're bouncing between two sides of the valley without settling.\\n\\n**Fix:** Reduce \`alpha\` by 2-3x. Watch for features at very different scales; normalize them first." },
  { "title": "Loss Converges But Predictions Are Still Bad", "content": "**Cause:** The model has **high bias** — the linear function can't fit the data's true shape (the problem is underfitting, not optimization).\\n\\n**Fix:** Add polynomial features, try a different model class, or gather more informative features. Gradient descent did its job; the model isn't expressive enough." },
  { "title": "Confirming Convergence", "content": "Use an early stopping condition: stop when the loss improvement per iteration falls below a threshold \`tol\`.\\n\\n\`\`\`python\\nif abs(prev_loss - loss) < 1e-6:\\n    print(f'Converged at iter {i}')\\n    break\\n\`\`\`\\n\\nAlso plot the loss curve — a healthy run looks like an exponential decay that flattens." }
] }
\`\`\`

---

## Batch, Mini-Batch, and Stochastic

The version we built is called **batch gradient descent** — every gradient update uses the entire dataset. There are two important variants:

| Variant | Data per update | Noise | Speed | Memory |
|---------|----------------|-------|-------|--------|
| Batch GD | All \`n\` samples | Low (smooth) | Slow on large \`n\` | High |
| Mini-batch GD | \`k\` samples (e.g., 32) | Medium | Fast | Medium |
| Stochastic GD (SGD) | 1 sample | High (noisy) | Very fast | Low |

\`\`\`callout
{ "type": "info", "title": "Why Mini-Batch Dominates Deep Learning", "content": "Neural networks almost always use mini-batch gradient descent. The noise from small batches acts as implicit regularization, helping escape shallow local minima. GPUs also vectorize batch operations efficiently — batch size 32 or 64 is often faster per epoch than batch size 1, even though each update is less accurate." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Mini-Batch Gradient Descent Implementation", "content": "Mini-batch GD shuffles the data and processes it in chunks:\\n\\n\`\`\`python\\ndef minibatch_gd(X, y, alpha=0.01, n_iter=100, batch_size=32):\\n    n, d = X.shape\\n    w, b = np.zeros(d), 0.0\\n    losses = []\\n    \\n    for epoch in range(n_iter):\\n        # Shuffle data each epoch\\n        idx = np.random.permutation(n)\\n        X_shuffled, y_shuffled = X[idx], y[idx]\\n        \\n        epoch_loss = 0.0\\n        n_batches = 0\\n        \\n        for start in range(0, n, batch_size):\\n            Xb = X_shuffled[start:start+batch_size]\\n            yb = y_shuffled[start:start+batch_size]\\n            nb = len(yb)\\n            \\n            y_hat = Xb @ w + b\\n            residuals = y_hat - yb\\n            loss = np.mean(residuals ** 2)\\n            epoch_loss += loss\\n            n_batches += 1\\n            \\n            dw = (2/nb) * Xb.T @ residuals\\n            db = (2/nb) * np.sum(residuals)\\n            w -= alpha * dw\\n            b -= alpha * db\\n        \\n        losses.append(epoch_loss / n_batches)\\n    \\n    return w, b, losses\\n\`\`\`\\n\\nThe loss curve for mini-batch GD is noisier than batch GD but converges to the same region — often faster in wall-clock time." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Gradient Descent Concepts", "questions": [
  {
    "question": "In MSE loss for linear regression, what does the gradient ∂J/∂w equal?",
    "options": [
      "(1/n) * Xᵀ(ŷ - y)",
      "(2/n) * Xᵀ(ŷ - y)",
      "(2/n) * X(ŷ - y)",
      "(1/n) * X(ŷ - y)"
    ],
    "answer": 1,
    "explanation": "The gradient of MSE with respect to w is (2/n) * Xᵀ(ŷ - y). The factor of 2 comes from the chain rule on the squared term, and Xᵀ appears because we differentiate the matrix product Xw."
  },
  {
    "question": "Your loss curve shows the loss increasing after every iteration. What is most likely the cause?",
    "options": [
      "The learning rate is too small",
      "The model has too many features",
      "The learning rate is too large",
      "The data is not normalized"
    ],
    "answer": 2,
    "explanation": "A monotonically increasing loss curve (divergence) is the classic symptom of a learning rate that is too large. The parameter updates overshoot the minimum, and each step actually increases the loss. Fix: reduce alpha by 10x."
  },
  {
    "question": "Why do gradient steps naturally get smaller as gradient descent approaches the minimum?",
    "options": [
      "The learning rate automatically decays",
      "The gradient itself shrinks as residuals decrease",
      "NumPy truncates small floating point numbers",
      "Batch size decreases near convergence"
    ],
    "answer": 1,
    "explanation": "The update is w ← w - α * ∂J/∂w. As we approach the minimum, residuals (ŷ - y) shrink, which means the gradient ∂J/∂w = (2/n)Xᵀ(ŷ-y) also shrinks. With a fixed learning rate α, the step size |α * gradient| naturally decreases. No explicit decay is needed."
  },
  {
    "question": "What is the key advantage of mini-batch gradient descent over batch gradient descent?",
    "options": [
      "It always finds a lower loss value",
      "It eliminates the need for a learning rate",
      "Each update is computed exactly",
      "It scales better to large datasets and its noise can help escape shallow local minima"
    ],
    "answer": 3,
    "explanation": "Mini-batch GD processes small subsets of data per update, making each iteration much faster for large datasets. The gradient noise from small batches also acts as implicit regularization, which can help in non-convex settings like deep learning."
  },
  {
    "question": "You train gradient descent on a dataset where one feature ranges from 0 to 10,000 and another from 0 to 1. What problem will this cause?",
    "options": [
      "The model will fail to converge entirely",
      "The large-scale feature's gradient will dominate, requiring a very small learning rate that makes the small-scale feature converge slowly",
      "The bias term will be ignored",
      "NumPy will raise an overflow error"
    ],
    "answer": 1,
    "explanation": "When features have very different scales, their gradients have very different magnitudes. The large-scale feature produces huge gradients that dominate, forcing a tiny learning rate. The small-scale feature then barely updates. Solution: standardize features (subtract mean, divide by std) before training."
  }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Gradient descent minimizes MSE by iteratively moving parameters in the direction of the negative gradient: w ← w - α * (2/n) * Xᵀ(ŷ - y).",
  "The learning rate α is the most important hyperparameter: too large diverges, too small converges slowly. Start at 0.01 and tune from there.",
  "Gradient steps naturally shrink near the minimum because the gradient itself (the residuals) shrinks — gradient descent is self-decelerating.",
  "Always normalize features before training. Unscaled features create gradient imbalance that forces impractically small learning rates.",
  "Use early stopping (stop when loss improvement < tol) to avoid wasted compute and detect convergence.",
  "Batch GD is stable and exact per step. Mini-batch GD scales to large data and its noise often helps in non-convex problems like neural networks."
] }
\`\`\``,
      starterCode: `import numpy as np

# Dataset: predict house prices from size (sq ft)
np.random.seed(42)
X = np.array([650, 800, 1200, 1500, 1800, 2100, 2400, 2800, 3200, 3500], dtype=float)
y = np.array([150, 185, 240, 310, 360, 420, 480, 540, 620, 680], dtype=float)

# Normalize features for stable gradient descent
X_norm = (X - X.mean()) / X.std()

# Hyperparameters
learning_rate = 0.01
n_iterations = 1000
m = len(X_norm)  # number of training examples

# Initialize parameters
theta_0 = 0.0  # bias
theta_1 = 0.0  # weight
loss_history = []

def compute_loss(theta_0, theta_1, X, y):
    """Compute Mean Squared Error loss."""
    # TODO: Compute predictions: y_hat = theta_0 + theta_1 * X
    
    # TODO: Compute MSE loss = (1 / 2m) * sum((y_hat - y)^2)
    
    pass

def gradient_descent_step(theta_0, theta_1, X, y, learning_rate):
    """Perform one step of batch gradient descent."""
    m = len(X)
    
    # TODO: Compute predictions
    
    # TODO: Compute gradients
    # d_theta_0 = (1/m) * sum(y_hat - y)
    # d_theta_1 = (1/m) * sum((y_hat - y) * X)
    
    # TODO: Update parameters simultaneously
    # new_theta_0 = theta_0 - learning_rate * d_theta_0
    # new_theta_1 = theta_1 - learning_rate * d_theta_1
    
    # TODO: Return updated theta_0, theta_1
    pass

# Training loop
for i in range(n_iterations):
    # TODO: Record current loss using compute_loss()
    
    # TODO: Update parameters using gradient_descent_step()
    pass

# Print results
print(f"Final parameters: theta_0={theta_0:.2f}, theta_1={theta_1:.2f}")
print(f"Initial loss: {loss_history[0]:.2f}")
print(f"Final loss:   {loss_history[-1]:.2f}")
print(f"Converged: {loss_history[-1] < 100}")

# Predict price for a 2000 sq ft house
X_new = (2000 - X.mean()) / X.std()
y_pred = theta_0 + theta_1 * X_new
print(f"Predicted price for 2000 sq ft: \${y_pred:.0f}k")
`,
      solutionCode: `import numpy as np

# Dataset: predict house prices from size (sq ft)
np.random.seed(42)
X = np.array([650, 800, 1200, 1500, 1800, 2100, 2400, 2800, 3200, 3500], dtype=float)
y = np.array([150, 185, 240, 310, 360, 420, 480, 540, 620, 680], dtype=float)

# Normalize features for stable gradient descent
X_norm = (X - X.mean()) / X.std()

# Hyperparameters
learning_rate = 0.01
n_iterations = 1000
m = len(X_norm)  # number of training examples

# Initialize parameters
theta_0 = 0.0  # bias (intercept)
theta_1 = 0.0  # weight (slope)
loss_history = []

def compute_loss(theta_0, theta_1, X, y):
    """Compute Mean Squared Error loss."""
    m = len(X)
    y_hat = theta_0 + theta_1 * X          # predictions
    loss = (1 / (2 * m)) * np.sum((y_hat - y) ** 2)  # MSE with 1/2m convention
    return loss

def gradient_descent_step(theta_0, theta_1, X, y, learning_rate):
    """Perform one step of batch gradient descent.
    
    Uses all training examples (batch) to compute gradients,
    then updates both parameters simultaneously.
    """
    m = len(X)
    y_hat = theta_0 + theta_1 * X          # compute predictions

    # Partial derivatives of MSE loss w.r.t. each parameter
    d_theta_0 = (1 / m) * np.sum(y_hat - y)       # dL/d(theta_0)
    d_theta_1 = (1 / m) * np.sum((y_hat - y) * X) # dL/d(theta_1)

    # Simultaneous update — both use OLD theta values (already computed above)
    new_theta_0 = theta_0 - learning_rate * d_theta_0
    new_theta_1 = theta_1 - learning_rate * d_theta_1

    return new_theta_0, new_theta_1

# Training loop
for i in range(n_iterations):
    # Track loss before updating (so history[0] = initial loss)
    loss_history.append(compute_loss(theta_0, theta_1, X_norm, y))
    
    # One gradient descent step
    theta_0, theta_1 = gradient_descent_step(theta_0, theta_1, X_norm, y, learning_rate)

# Print results
print(f"Final parameters: theta_0={theta_0:.2f}, theta_1={theta_1:.2f}")
print(f"Initial loss: {loss_history[0]:.2f}")
print(f"Final loss:   {loss_history[-1]:.2f}")
print(f"Converged: {loss_history[-1] < 100}")

# Predict price for a 2000 sq ft house
X_new = (2000 - X.mean()) / X.std()  # normalize using same stats as training
y_pred = theta_0 + theta_1 * X_new
print(f"Predicted price for 2000 sq ft: \${y_pred:.0f}k")
`,
    },
    {
      id: "ridge-lasso-regularization",
      slug: "ridge-lasso-regularization",
      title: "Ridge and Lasso Regularization",
      content: `When ordinary least squares fits a model, it has one objective: minimize training error. With enough features — or noisy data — it will grow coefficients to any size necessary to fit the training set. The result is a model that *memorizes* training noise rather than learning real patterns, and collapses on anything new.

**Regularization** adds a penalty for large weights directly to the loss. The optimizer must now balance two competing goals: fit the data *and* keep coefficients small. Ridge and Lasso implement this with different norms — L2 and L1 — producing subtly different but critically important behaviors.

\`\`\`concept
{ "title": "The Regularization Mental Model", "variant": "mental-model", "content": "OLS is a student who memorizes every word in the textbook. They ace every practice problem but fail novel exam questions. Regularization says: 'You lose points for every extra page of notes you use.' The student is forced to find essential patterns rather than memorize noise. λ (lambda) controls how strict the penalty is — higher λ means fewer allowed notes, producing a simpler model." }
\`\`\`

## The Math: Augmenting the Loss

The OLS objective minimizes mean squared error:

$$\\mathcal{L}_{OLS}(\\mathbf{w}) = \\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2$$

Ridge and Lasso keep this term and append a regularization penalty scaled by **λ**:

| Method | Loss | Penalty type |
|--------|------|-------------|
| OLS | MSE | None |
| **Ridge** | MSE + λ·Σwⱼ² | L2 norm squared |
| **Lasso** | MSE + λ·Σ\\|wⱼ\\| | L1 norm |

The two penalties look almost identical on paper. The difference is in their gradients — and that difference changes everything.

\`\`\`tabs
{ "tabs": [ { "label": "Ridge (L2)", "icon": "🔵", "content": "**Ridge Regression** adds the squared sum of all coefficients:\\n\\n**Loss = MSE + λ · (w₁² + w₂² + ... + wₚ²)**\\n\\nThe penalty gradient with respect to wⱼ is **2λwⱼ** — proportional to the weight itself. Large weights get a large penalty nudge; small weights get a tiny one. As a weight approaches zero, the penalty's push approaches zero too. This is why Ridge shrinks weights *smoothly toward zero* but almost never reaches exactly zero.\\n\\n**Closed-form solution exists:**\\n\`w = (XᵀX + λI)⁻¹ Xᵀy\`\\n\\nAdding λI to XᵀX makes the matrix invertible even when features are perfectly correlated — Ridge's superpower against multicollinearity.\\n\\n**Use Ridge when:** Most features genuinely contribute, features are correlated, or you want a stable dense model." }, { "label": "Lasso (L1)", "icon": "🟡", "content": "**Lasso Regression** (Least Absolute Shrinkage and Selection Operator) adds the sum of absolute values:\\n\\n**Loss = MSE + λ · (|w₁| + |w₂| + ... + |wₚ|)**\\n\\nThe penalty gradient with respect to wⱼ is **λ · sign(wⱼ)** — a *constant* ±λ regardless of how small the weight is. Even a tiny weight like 0.001 gets the full constant push toward zero. Ridge backs off; Lasso does not. This constant pressure drives small coefficients all the way to **exactly zero** — automatic feature selection.\\n\\n**No closed-form solution** — requires iterative gradient descent or coordinate descent.\\n\\n**Use Lasso when:** Only a few features truly matter, you need an interpretable sparse model, or you have many potentially irrelevant features in high-dimensional data." }, { "label": "Side-by-Side Comparison", "icon": "⚖️", "content": "**The single critical difference:**\\n\\n| Property | Ridge | Lasso |\\n|----------|-------|-------|\\n| Penalty gradient | 2λwⱼ (proportional to w) | λ·sign(wⱼ) (constant ±λ) |\\n| Zeroes out weights? | Almost never | Yes — sparse models |\\n| Feature selection | No | Yes |\\n| Multicollinearity | Excellent (distributes weight) | Poor (picks one, drops others) |\\n| Closed-form solution | Yes | No |\\n| Model type | Dense | Sparse |\\n\\n**The core insight:** When wⱼ is very small (say 0.001):\\n- Ridge nudge = 2λ × 0.001 ≈ near zero — backs off\\n- Lasso nudge = λ × 1 = full constant — keeps pushing\\n\\nRidge always backs off. Lasso never does. That's the whole story." } ] }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Always Scale Features Before Regularizing", "content": "Ridge and Lasso penalize coefficient magnitude — but magnitude depends on scale. A feature measured in kilometers produces small coefficients; the same information in millimeters produces huge ones. The regularizer will over-penalize the millimeter feature regardless of its actual importance.\\n\\nAlways standardize before fitting: \`X_scaled = (X - X.mean(axis=0)) / X.std(axis=0)\`\\n\\nThe bias/intercept b is NOT penalized — only the slope weights wⱼ. Penalizing the intercept would shift predictions away from the data mean, which is never what you want." }
\`\`\`

## Gradient Descent with the Ridge Penalty

The Ridge gradient is the OLS gradient plus the derivative of the L2 penalty:

$$\\frac{\\partial \\mathcal{L}_{Ridge}}{\\partial \\mathbf{w}} = \\underbrace{\\frac{2}{n} X^T(\\hat{\\mathbf{y}} - \\mathbf{y})}_{\\text{OLS gradient}} + \\underbrace{2\\lambda\\mathbf{w}}_{\\text{Ridge penalty gradient}}$$

For Lasso, replace \`2λw\` with \`λ·sign(w)\`. Let's trace through one complete Ridge step with concrete numbers:

\`\`\`trace
{ "title": "One Ridge Gradient Step — Traced", "language": "python", "code": "import numpy as np\\n\\nX = np.array([[1, 2], [3, 4]])\\ny = np.array([3.0, 7.0])\\nw = np.array([1.0, 0.5])\\nalpha = 0.5\\nlr = 0.1\\nn = len(y)\\n\\ny_pred = X @ w\\nresiduals = y_pred - y\\nmse = np.mean(residuals ** 2)\\npenalty = alpha * np.sum(w ** 2)\\nloss = mse + penalty\\ngrad_w = (2/n) * X.T @ residuals + 2 * alpha * w\\nw = w - lr * grad_w\\nprint('Updated weights:', np.round(w, 4))", "frames": [ { "line": 3, "vars": { "X": "[[1,2],[3,4]]" }, "note": "Design matrix: 2 samples, 2 features" }, { "line": 5, "vars": { "w": "[1.0, 0.5]", "alpha": 0.5, "lr": 0.1, "n": 2 }, "note": "Current weights and hyperparameters" }, { "line": 10, "vars": { "y_pred": "[2.0, 5.0]" }, "note": "Forward pass: [1×1+2×0.5, 3×1+4×0.5] = [2.0, 5.0]" }, { "line": 11, "vars": { "residuals": "[-1.0, -2.0]" }, "note": "Errors: predictions - targets = [2.0-3.0, 5.0-7.0]" }, { "line": 12, "vars": { "mse": 2.5 }, "note": "MSE = mean([(-1.0)², (-2.0)²]) = mean([1.0, 4.0]) = 2.5" }, { "line": 13, "vars": { "penalty": 0.625 }, "note": "L2 penalty = 0.5 × (1.0² + 0.5²) = 0.5 × 1.25 = 0.625" }, { "line": 14, "vars": { "loss": 3.125 }, "note": "Ridge loss = MSE + penalty = 2.5 + 0.625 = 3.125" }, { "line": 15, "vars": { "grad_w": "[-6.0, -9.5]" }, "note": "OLS grad = (2/2)×XᵀR = [-7.0, -10.0]. Ridge adds 2×0.5×[1.0,0.5]=[1.0,0.5]. Total: [-6.0, -9.5]. Notice the penalty gradient pushes AWAY from zero (opposing the direction of shrinkage)." }, { "line": 16, "vars": { "w": "[1.6, 1.45]" }, "note": "w = [1.0, 0.5] - 0.1×[-6.0,-9.5] = [1.6, 1.45]. The penalty term slows the gradient descent step, preventing runaway coefficient growth." } ], "speed": 900 }
\`\`\`

## The Regularization Path: Watching Features Survive

As λ grows, Lasso eliminates features one by one in order of their importance. Ridge shrinks all coefficients but keeps every feature. The highlighted indices below are **active (nonzero) features**:

\`\`\`algoviz
{ "title": "Lasso vs Ridge: Which Features Survive as λ Grows?", "type": "array", "data": [4.2, -3.8, 2.1, -1.5, 0.3, -0.1], "frames": [ { "highlight": [0, 1, 2, 3, 4, 5], "label": "λ=0 (OLS): all 6 features active — coefficients [4.2, -3.8, 2.1, -1.5, 0.3, -0.1]", "stats": { "lambda": 0, "active": 6 } }, { "highlight": [0, 1, 2, 3], "label": "Lasso λ=0.2: weakest coefficients (indices 4, 5) driven to zero — 4 features remain", "stats": { "lambda": 0.2, "active": 4 } }, { "highlight": [0, 1, 2], "label": "Lasso λ=0.8: index 3 eliminated next — 3 features remain", "stats": { "lambda": 0.8, "active": 3 } }, { "highlight": [0, 1], "label": "Lasso λ=1.5: only the 2 strongest coefficients survive", "stats": { "lambda": 1.5, "active": 2 } }, { "highlight": [0, 1, 2, 3, 4, 5], "label": "Ridge λ=1.5 (same λ): ALL features kept — Ridge shrinks but never eliminates", "stats": { "lambda": 1.5, "active": 6 } } ], "speed": 1000 }
\`\`\`

## Implementation: Ridge and Lasso in Pure NumPy

Both algorithms are identical to OLS gradient descent — the only change is one extra line for the penalty gradient:

\`\`\`playground
{ "title": "Ridge & Lasso Regression from Scratch", "language": "python", "code": "import numpy as np\\n\\nnp.random.seed(42)\\nn_samples = 80\\n\\n# Ground truth: only features 0, 1, and 4 matter — the rest are noise\\nX = np.random.randn(n_samples, 6)\\ntrue_w = np.array([3.0, -2.0, 0.0, 0.0, 1.5, 0.0])\\ny = X @ true_w + np.random.randn(n_samples) * 0.8\\n\\n# Scale features (critical before regularizing!)\\nX_mu, X_sigma = X.mean(axis=0), X.std(axis=0)\\nXs = (X - X_mu) / X_sigma\\n\\n\\ndef ridge_fit(X, y, alpha=1.0, lr=0.005, epochs=3000):\\n    n, p = X.shape\\n    w, b = np.zeros(p), 0.0\\n    for _ in range(epochs):\\n        residuals = X @ w + b - y\\n        # Ridge: OLS gradient + 2*alpha*w  (bias NOT penalized)\\n        dw = (2/n) * X.T @ residuals + 2 * alpha * w\\n        db = (2/n) * residuals.sum()\\n        w -= lr * dw\\n        b -= lr * db\\n    return w, b\\n\\n\\ndef lasso_fit(X, y, alpha=0.1, lr=0.005, epochs=3000):\\n    n, p = X.shape\\n    w, b = np.zeros(p), 0.0\\n    for _ in range(epochs):\\n        residuals = X @ w + b - y\\n        # Lasso: OLS gradient + alpha*sign(w) -- constant push regardless of weight size\\n        dw = (2/n) * X.T @ residuals + alpha * np.sign(w)\\n        db = (2/n) * residuals.sum()\\n        w -= lr * dw\\n        b -= lr * db\\n    return w, b\\n\\n\\nridge_w, _ = ridge_fit(Xs, y, alpha=0.5)\\nlasso_w, _ = lasso_fit(Xs, y, alpha=0.15)\\n\\nprint('True weights:  ', true_w)\\nprint('Ridge weights: ', np.round(ridge_w, 3))\\nprint('Lasso weights: ', np.round(lasso_w, 3))\\nprint()\\nprint('Ridge near-zero (< 0.05):', np.sum(np.abs(ridge_w) < 0.05), '/ 6')\\nprint('Lasso near-zero (< 0.05):', np.sum(np.abs(lasso_w) < 0.05), '/ 6')\\nprint()\\nprint('Lasso selected features:', np.where(np.abs(lasso_w) >= 0.05)[0].tolist())\\nprint('True active features:   [0, 1, 4]')", "runnable": true }
\`\`\`

Run this and observe: Lasso correctly identifies features 0, 1, and 4 as the important ones and sets the rest near zero. Ridge keeps all six features but with varying weights — none eliminated.

\`\`\`collapse
{ "title": "Deep Dive: Why Does Lasso Create Exact Zeros? (Geometry)", "content": "The geometric view makes sparsity intuitive. Both methods can be written as constrained optimization:\\n\\n- **Ridge:** minimize MSE subject to Σwⱼ² ≤ t → constraint region is a **sphere**\\n- **Lasso:** minimize MSE subject to Σ|wⱼ| ≤ t → constraint region is a **diamond** (cross-polytope)\\n\\nThe MSE loss has elliptical contours centered at the unconstrained OLS solution. The regularized solution is where the smallest MSE ellipse *first touches* the constraint region.\\n\\n**Ridge (sphere):** The ellipse typically touches the sphere at a smooth curved point — all coordinates are nonzero.\\n\\n**Lasso (diamond):** The diamond has sharp corners aligned with coordinate axes. In 2D these corners are (t,0), (-t,0), (0,t), (0,-t). The MSE ellipse almost always first touches a corner — and corners have one or more zero coordinates.\\n\\nIn p dimensions, the diamond has 2p corners and exponentially many edges. As p grows, the probability of touching a corner (versus a smooth face) approaches 1. **Sparsity is the geometric consequence of the L1 ball's shape** — not an accident of the algorithm.\\n\\nThis also explains why Lasso handles correlated features poorly: among two correlated features, the diamond corner can be at either axis, so Lasso picks one arbitrarily and drops the other." }
\`\`\`

## Practice: Write the Gradient Terms

\`\`\`fillblank
{ "title": "Complete the Ridge and Lasso Gradient Functions", "prompt": "Both regularizers only modify the weight gradient. The bias gradient (2/n * residuals.sum()) is the same as OLS — never penalize the intercept. Fill in the missing penalty terms.", "language": "python", "template": "def ridge_gradient(X, y, w, alpha):\\n    n = len(y)\\n    residuals = X @ w - y\\n    ols_grad = (2/n) * X.T @ residuals\\n    penalty_grad = ___ * alpha * w   # d/dw of alpha * sum(w^2)\\n    return ols_grad + penalty_grad\\n\\ndef lasso_gradient(X, y, w, alpha):\\n    n = len(y)\\n    residuals = X @ w - y\\n    ols_grad = (2/n) * X.T @ residuals\\n    penalty_grad = alpha * ___(w)    # subgradient of alpha * sum(|w|)\\n    return ols_grad + penalty_grad", "blanks": [ { "answer": "2", "hint": "The derivative of w² is 2w. So d/dwⱼ of λΣwⱼ² is 2λwⱼ." }, { "answer": "np.sign", "hint": "The subgradient of |w| is sign(w): returns +1 when w > 0, -1 when w < 0, 0 when w = 0." } ] }
\`\`\`

## Knowledge Check

\`\`\`quiz
{ "title": "Ridge and Lasso: Knowledge Check", "questions": [ { "question": "You're predicting customer lifetime value using 150 features (demographics, purchase history, product preferences). You believe most features contribute at least a little. Which regularizer is more appropriate?", "options": ["Lasso — it will automatically find the best features", "Ridge — it retains all features while preventing any coefficient from dominating", "OLS without regularization — 150 features is manageable", "Neither — regularization only helps with very small datasets"], "answer": 1, "explanation": "Ridge is better here. When most features genuinely contribute (even modestly), you want to keep them while reducing overfitting. Ridge shrinks all coefficients proportionally but keeps every feature. Lasso would arbitrarily zero out features that have moderate but real predictive value — potentially discarding useful signal." }, { "question": "After fitting Lasso with λ=0.5, exactly 40 out of 100 coefficients are 0.0. What is the correct interpretation?", "options": ["The optimizer failed to converge — all coefficients should be nonzero with Lasso", "Lasso performed automatic feature selection, determining those 40 features add no predictive value", "λ is too large — you should reduce it until all coefficients are retained", "This indicates severe multicollinearity in your dataset"], "answer": 1, "explanation": "Lasso's L1 penalty drives small coefficients to exactly zero — this is the intended behavior, not a failure. The 40 zero coefficients mean Lasso determined those features don't improve the model enough to justify their inclusion. Lasso has performed automatic feature selection, keeping only the 60 most informative features. This is exactly what you want when building sparse, interpretable models." }, { "question": "The Ridge penalty gradient with respect to weight wⱼ is:", "options": ["λ · sign(wⱼ)", "λ · |wⱼ|", "2λ · wⱼ", "λ · wⱼ"], "answer": 2, "explanation": "Ridge adds λΣwⱼ² to the loss. Differentiating with respect to wⱼ gives 2λwⱼ. This gradient is proportional to the weight itself — large weights get pushed hard, small weights get a gentle nudge. This proportionality is exactly why Ridge shrinks smoothly but never reaches zero: as wⱼ → 0, the nudge → 0 too." }, { "question": "Features A and B have a correlation of 0.97. How do Ridge and Lasso handle them differently?", "options": ["Both methods eliminate one of the correlated features", "Ridge distributes weight between A and B with similar coefficients; Lasso tends to keep one and zero the other", "Lasso distributes weight evenly; Ridge selects one arbitrarily", "Both methods handle correlated features equally well"], "answer": 1, "explanation": "Ridge's L2 penalty distributes weight smoothly among correlated features — both A and B get similar, moderate nonzero coefficients. Lasso tends to arbitrarily select one correlated feature and zero out the other, because from Lasso's perspective, the two features carry redundant information and eliminating one saves L1 penalty cost. Ridge is strongly preferred when multicollinearity is present." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Ridge (L2) adds λ·Σwⱼ² to the loss. Its gradient term 2λwⱼ is proportional to the weight — all coefficients shrink smoothly toward zero but almost never reach it.", "Lasso (L1) adds λ·Σ|wⱼ| to the loss. Its gradient term λ·sign(wⱼ) is a constant — small weights get the same push as large ones, driving them to exactly zero.", "Lasso performs automatic feature selection by zeroing unimportant weights. Ridge retains all features with reduced influence.", "Ridge excels with multicollinearity, distributing weight among correlated features. Lasso arbitrarily picks one correlated feature and drops the rest.", "Always standardize features before regularizing — coefficients must be on the same scale for the penalty to treat all features fairly.", "Find the optimal λ via cross-validation across a log-spaced grid. λ=0 is plain OLS (high variance); λ→∞ produces a flat constant model (high bias). The sweet spot minimizes validation error." ] }
\`\`\``,
      starterCode: `import numpy as np

# Ridge and Lasso Regularization Exercise
# Goal: Implement Ridge (L2) and Lasso (L1) regression cost functions
# and observe how the lambda (alpha) parameter shrinks coefficients.

np.random.seed(42)

# Dataset: predict house prices from 3 features
# Features: [size_sqft, num_rooms, age_years]
X = np.array([
    [1500, 3, 10],
    [2000, 4, 5],
    [1200, 2, 20],
    [1800, 3, 8],
    [2500, 5, 2],
    [1100, 2, 25],
    [2200, 4, 6],
    [1600, 3, 12],
])
y = np.array([300, 400, 220, 350, 500, 200, 430, 320])  # prices in $1000s

# Normalize features (important for regularization to work fairly)
X_norm = (X - X.mean(axis=0)) / X.std(axis=0)
# Add bias column
X_b = np.hstack([np.ones((X_norm.shape[0], 1)), X_norm])

def mse_loss(X, y, weights):
    """Plain MSE loss (no regularization)."""
    predictions = X @ weights
    return np.mean((predictions - y) ** 2)

# TODO 1: Implement Ridge (L2) cost function.
# Ridge cost = MSE + alpha * sum(w_i^2)  [exclude bias term w[0]]
# The L2 penalty discourages large weights by adding squared magnitudes.
def ridge_cost(X, y, weights, alpha):
    mse = mse_loss(X, y, weights)
    # TODO: compute the L2 penalty on weights[1:] (skip the bias)
    l2_penalty = None
    return mse + l2_penalty

# TODO 2: Implement Lasso (L1) cost function.
# Lasso cost = MSE + alpha * sum(|w_i|)  [exclude bias term w[0]]
# The L1 penalty can shrink coefficients all the way to zero (sparse solutions).
def lasso_cost(X, y, weights, alpha):
    mse = mse_loss(X, y, weights)
    # TODO: compute the L1 penalty on weights[1:] (skip the bias)
    l1_penalty = None
    return mse + l1_penalty

# TODO 3: Implement Ridge gradient descent update.
# Ridge gradient w.r.t. w_i (i > 0): (2/n) * X_i^T(Xw - y) + 2*alpha*w_i
# Bias gradient (i = 0):             (2/n) * sum(Xw - y)  [no penalty]
def ridge_gradient(X, y, weights, alpha):
    n = len(y)
    residuals = X @ weights - y
    grad = (2 / n) * (X.T @ residuals)
    # TODO: add the L2 regularization term to grad[1:] (not the bias)
    return grad

# TODO 4: Implement gradient descent training loop.
def train(X, y, alpha, cost_fn, grad_fn, lr=0.01, epochs=500):
    weights = np.zeros(X.shape[1])
    for epoch in range(epochs):
        # TODO: compute gradient and update weights
        pass
    return weights

# --- Run experiments ---
alpha_values = [0.0, 0.1, 1.0, 10.0]
print(f"{'Alpha':>8} | {'w_bias':>8} | {'w_size':>8} | {'w_rooms':>8} | {'w_age':>8}")
print("-" * 55)
for alpha in alpha_values:
    # TODO 5: Call train() with ridge_gradient and ridge_cost, print results
    pass
`,
      solutionCode: `import numpy as np

# Ridge and Lasso Regularization — Complete Solution
# Demonstrates how L2 (Ridge) and L1 (Lasso) penalties shrink coefficients.

np.random.seed(42)

# Dataset: predict house prices from 3 features
X = np.array([
    [1500, 3, 10],
    [2000, 4, 5],
    [1200, 2, 20],
    [1800, 3, 8],
    [2500, 5, 2],
    [1100, 2, 25],
    [2200, 4, 6],
    [1600, 3, 12],
])
y = np.array([300, 400, 220, 350, 500, 200, 430, 320])

# Normalize features so regularization penalizes all weights equally
X_norm = (X - X.mean(axis=0)) / X.std(axis=0)
X_b = np.hstack([np.ones((X_norm.shape[0], 1)), X_norm])

def mse_loss(X, y, weights):
    predictions = X @ weights
    return np.mean((predictions - y) ** 2)

# --- Ridge (L2) ---
# Penalty = alpha * ||w||^2 = alpha * sum(w_i^2)
# Effect: shrinks all weights smoothly toward zero; no weight becomes exactly 0.
def ridge_cost(X, y, weights, alpha):
    mse = mse_loss(X, y, weights)
    l2_penalty = alpha * np.sum(weights[1:] ** 2)  # skip bias
    return mse + l2_penalty

def ridge_gradient(X, y, weights, alpha):
    n = len(y)
    residuals = X @ weights - y
    grad = (2 / n) * (X.T @ residuals)
    # d/dw (alpha * w^2) = 2*alpha*w  — added to all weights except bias
    grad[1:] += 2 * alpha * weights[1:]
    return grad

# --- Lasso (L1) ---
# Penalty = alpha * ||w||_1 = alpha * sum(|w_i|)
# Effect: can push weights to exactly zero, producing sparse models.
def lasso_cost(X, y, weights, alpha):
    mse = mse_loss(X, y, weights)
    l1_penalty = alpha * np.sum(np.abs(weights[1:]))  # skip bias
    return mse + l1_penalty

def lasso_gradient(X, y, weights, alpha):
    n = len(y)
    residuals = X @ weights - y
    grad = (2 / n) * (X.T @ residuals)
    # d/dw (alpha * |w|) = alpha * sign(w) — subgradient at w=0
    grad[1:] += alpha * np.sign(weights[1:])
    return grad

def train(X, y, alpha, cost_fn, grad_fn, lr=0.01, epochs=500):
    weights = np.zeros(X.shape[1])
    for epoch in range(epochs):
        grad = grad_fn(X, y, weights, alpha)
        weights -= lr * grad
    return weights

# --- Ridge: observe coefficient shrinkage as alpha increases ---
print("RIDGE (L2) — coefficients shrink but stay non-zero")
print(f"{'Alpha':>8} | {'w_bias':>8} | {'w_size':>8} | {'w_rooms':>8} | {'w_age':>8}")
print("-" * 55)
for alpha in [0.0, 0.1, 1.0, 10.0]:
    w = train(X_b, y, alpha, ridge_cost, ridge_gradient)
    print(f"{alpha:>8.1f} | {w[0]:>8.2f} | {w[1]:>8.2f} | {w[2]:>8.2f} | {w[3]:>8.2f}")

# --- Lasso: some coefficients driven to zero ---
print("\\nLASSO (L1) — less important features can be zeroed out")
print(f"{'Alpha':>8} | {'w_bias':>8} | {'w_size':>8} | {'w_rooms':>8} | {'w_age':>8}")
print("-" * 55)
for alpha in [0.0, 0.1, 1.0, 10.0]:
    w = train(X_b, y, alpha, lasso_cost, lasso_gradient, lr=0.005)
    print(f"{alpha:>8.1f} | {w[0]:>8.2f} | {w[1]:>8.2f} | {w[2]:>8.2f} | {w[3]:>8.2f}")

# Expected insight:
# Ridge (alpha=10): all weights near zero, none exactly zero.
# Lasso (alpha=10): least informative weights collapse to ~0 (sparsity).
`,
    },
    {
      id: "polynomial-features",
      slug: "polynomial-features",
      title: "Polynomial Features and the Bias-Variance Tradeoff",
      content: `# Polynomial Features and the Bias-Variance Tradeoff

When a straight line simply isn't enough, polynomial features let linear models bend and curve — but there's a catch. Push the complexity too far and your model memorises the training data instead of learning from it. This lesson shows you exactly where that line is, and how to find it with validation curves built entirely in NumPy.

---

## Why Linear Isn't Always Enough

Consider predicting house prices from square footage. The relationship isn't perfectly linear — a 3,000 sq ft house isn't exactly 3× the price of a 1,000 sq ft house. There are diminishing returns, neighbourhood effects, and non-linearities baked into the data.

Linear regression fits:

$$\\hat{y} = w_0 + w_1 x$$

But the real relationship might follow a curve. The trick: **we don't need a non-linear algorithm — we need non-linear features**.

\`\`\`concept
{ "title": "The Core Insight", "variant": "mental-model", "content": "Polynomial regression is still linear regression — the model is linear in its *parameters* (weights). We just feed it engineered features like x², x³. The learning algorithm stays identical; only the input matrix changes." }
\`\`\`

---

## Building Polynomial Features from Scratch

Given a single feature \`x\`, we create a design matrix by stacking powers:

$$\\Phi(x) = [1,\\ x,\\ x^2,\\ x^3,\\ \\ldots,\\ x^d]$$

For degree \`d = 3\`, a single sample \`x = 2\` becomes \`[1, 2, 4, 8]\`.

\`\`\`steps
{ "title": "Constructing the Polynomial Feature Matrix", "steps": [ { "title": "Start with raw data", "content": "You have \`X\` of shape \`(n_samples,)\`. Each value is a single measurement — say, square footage or temperature." }, { "title": "Choose a degree d", "content": "Degree \`d\` is your key hyperparameter. \`d=1\` → plain linear regression. \`d=2\` → quadratic. \`d=10\` → extreme flexibility (and danger)." }, { "title": "Stack powered columns", "content": "Build a matrix where column \`k\` is \`X ** k\` for \`k\` from \`0\` to \`d\`. Column 0 is all ones (the bias/intercept term).\\n\\n\`\`\`python\\nPhi = np.column_stack([X ** k for k in range(d + 1)])\\n\`\`\`" }, { "title": "Fit ordinary least squares", "content": "Solve \`w = (PhiᵀPhi)⁻¹ Phiᵀ y\` — the exact same closed-form OLS you already know. The weights \`w\` now capture the polynomial curve." }, { "title": "Predict on new data", "content": "Transform new inputs the same way: \`Phi_new = np.column_stack([X_new ** k for k in range(d+1)])\`, then \`y_hat = Phi_new @ w\`." } ] }
\`\`\`

\`\`\`playground
{ "title": "Polynomial Feature Matrix Builder", "language": "python", "code": "import numpy as np\\n\\ndef poly_features(X, degree):\\n    \\"\\"\\"Build polynomial design matrix.\\n    X: 1D array of shape (n,)\\n    Returns: matrix of shape (n, degree+1)\\n    \\"\\"\\"\\n    return np.column_stack([X ** k for k in range(degree + 1)])\\n\\ndef ols_fit(Phi, y):\\n    \\"\\"\\"Ordinary least squares via normal equations.\\"\\"\\"\\n    return np.linalg.pinv(Phi.T @ Phi) @ Phi.T @ y\\n\\n# Generate noisy quadratic data\\nnp.random.seed(42)\\nX = np.linspace(-3, 3, 40)\\ny = 0.5 * X**2 - X + 2 + np.random.randn(40) * 0.8\\n\\n# Fit degree-1 (linear) vs degree-2 (quadratic)\\nfor d in [1, 2, 8]:\\n    Phi = poly_features(X, d)\\n    w = ols_fit(Phi, y)\\n    y_hat = Phi @ w\\n    mse = np.mean((y - y_hat) ** 2)\\n    print(f\\"Degree {d}: train MSE = {mse:.4f}, weights shape = {w.shape}\\")\\n\\nprint(\\"\\\\nDesign matrix (degree=2) for first 3 samples:\\")\\nprint(poly_features(X[:3], degree=2).round(3))\\nprint(\\"  [bias, x, x^2]\\")", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Scale Before You Polynomialize", "content": "If \`x\` ranges from 0–1000, then \`x¹⁰\` is astronomically large (~10³⁰). This causes numerical instability in \`(ΦᵀΦ)⁻¹\`. Always normalize \`X\` to zero mean and unit variance *before* computing polynomial features." }
\`\`\`

---

## The Bias-Variance Tradeoff

This is the central tension of all of machine learning. Every modelling choice you make shifts you along a spectrum between two failure modes.

\`\`\`tabs
{ "tabs": [ { "label": "High Bias (Underfitting)", "icon": "😴", "content": "**What it looks like:** The model is too simple to capture the true pattern. A degree-1 line trying to fit a curve.\\n\\n**Symptoms:**\\n- High training error\\n- High validation error (similar to training)\\n- Model predictions look flat/wrong even on training data\\n\\n**Cause:** Model lacks the expressiveness to represent the true relationship.\\n\\n**Fix:** Increase model complexity (higher degree, more features, more layers)." }, { "label": "High Variance (Overfitting)", "icon": "🤪", "content": "**What it looks like:** The model is too complex and memorises training noise. A degree-15 polynomial zigzagging through 20 data points.\\n\\n**Symptoms:**\\n- Very low training error\\n- Much higher validation error\\n- Predictions swing wildly between training points\\n\\n**Cause:** Too many parameters for the amount of data available.\\n\\n**Fix:** Reduce complexity, add regularisation (Ridge/Lasso), or collect more data." }, { "label": "The Sweet Spot", "icon": "🎯", "content": "**What it looks like:** The model captures the true pattern without chasing noise.\\n\\n**How to find it:**\\n1. Try multiple degrees (1 → 2 → 3 → … → 10)\\n2. Plot *both* training error and validation error vs degree\\n3. The optimal degree is where validation error is minimised\\n\\nThis plot is called a **validation curve** and is the primary diagnostic tool for the bias-variance tradeoff." } ] }
\`\`\`

\`\`\`concept
{ "title": "The Decomposition Formula", "variant": "rule", "content": "Expected prediction error = Bias² + Variance + Irreducible Noise\\n\\nBias² → How wrong is the average prediction? (systematic error)\\nVariance → How much do predictions vary across different training sets?\\nIrreducible Noise → The inherent randomness in the data — no model can remove this." }
\`\`\`

---

## Visualising the Tradeoff: Algorithm Execution

Let's trace what happens to training and validation error as we increase polynomial degree on a noisy sine curve.

\`\`\`algoviz
{ "title": "Validation Curve: Degree vs Error", "type": "array", "data": [3.2, 1.8, 0.9, 0.6, 0.55, 0.58, 0.72, 1.1, 1.8, 2.9], "frames": [ { "highlight": [0], "label": "Degree 1 (linear): val error=3.2, train error=3.0. Both high → underfitting", "stats": { "degree": 1, "train_err": 3.0, "val_err": 3.2, "regime": "underfit" } }, { "highlight": [0, 1], "label": "Degree 2: val error=1.8, train error=1.5. Improving — capturing curvature", "stats": { "degree": 2, "train_err": 1.5, "val_err": 1.8, "regime": "improving" } }, { "highlight": [0, 1, 2], "label": "Degree 3: val error=0.9, train error=0.7. Good fit emerging", "stats": { "degree": 3, "train_err": 0.7, "val_err": 0.9, "regime": "improving" } }, { "highlight": [0, 1, 2, 3], "label": "Degree 4: val error=0.6, train error=0.5. Near optimal", "stats": { "degree": 4, "train_err": 0.5, "val_err": 0.6, "regime": "near-optimal" } }, { "highlight": [0, 1, 2, 3, 4], "label": "Degree 5: val error=0.55 — MINIMUM. This is the sweet spot!", "stats": { "degree": 5, "train_err": 0.42, "val_err": 0.55, "regime": "OPTIMAL" } }, { "highlight": [0, 1, 2, 3, 4, 5], "label": "Degree 6: val error starts rising (0.58) while train error falls — overfitting begins", "stats": { "degree": 6, "train_err": 0.35, "val_err": 0.58, "regime": "overfitting" } }, { "highlight": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "label": "Degree 10: val error=2.9, train error≈0. Classic overfit — memorised the noise", "stats": { "degree": 10, "train_err": 0.01, "val_err": 2.9, "regime": "severe overfit" } } ], "speed": 900 }
\`\`\`

The array above represents **validation error** at each degree. Notice: the optimal degree (index 4, degree 5) is where validation error bottoms out, not where training error is lowest.

---

## Code Trace: Watching the Weights Explode

High-degree polynomials produce enormous, oscillating weights. Let's trace this:

\`\`\`trace
{ "title": "Weight Magnitude vs Polynomial Degree", "language": "python", "code": "import numpy as np\\n\\nnp.random.seed(0)\\nX = np.linspace(-1, 1, 20)\\ny = np.sin(2 * X) + 0.1 * np.random.randn(20)\\n\\nfor degree in [1, 3, 6, 10]:\\n    Phi = np.column_stack([X**k for k in range(degree+1)])\\n    w = np.linalg.pinv(Phi.T @ Phi) @ Phi.T @ y\\n    max_w = np.max(np.abs(w))\\n    print(f\\"degree={degree}: max |weight| = {max_w:.1f}\\")", "frames": [ { "line": 4, "vars": { "X_shape": "(20,)", "range": "[-1, 1]" }, "note": "Generate 20 evenly spaced points in [-1,1]. Normalised range prevents numerical explosion." }, { "line": 5, "vars": { "y_signal": "sin(2x)", "noise_std": 0.1 }, "note": "True signal is a sine wave plus small Gaussian noise." }, { "line": 7, "vars": { "degree": 1, "Phi_shape": "(20, 2)" }, "note": "Degree 1: design matrix has 2 columns [1, x]. Only 2 parameters to fit." }, { "line": 8, "vars": { "degree": 1, "max_w": 1.2 }, "note": "Weights are small and interpretable. But the fit is poor — a line can't capture a sine wave.", "stdout": "degree=1: max |weight| = 1.2" }, { "line": 7, "vars": { "degree": 6, "Phi_shape": "(20, 7)" }, "note": "Degree 6: 7 columns now. More parameters than needed for a sine wave, but manageable." }, { "line": 8, "vars": { "degree": 6, "max_w": 18.4 }, "note": "Weights are getting large — the model is starting to overfit the 20 training points.", "stdout": "degree=6: max |weight| = 18.4" }, { "line": 7, "vars": { "degree": 10, "Phi_shape": "(20, 11)" }, "note": "Degree 10: 11 parameters for 20 points. Now the model can nearly interpolate each point." }, { "line": 8, "vars": { "degree": 10, "max_w": 3847.2 }, "note": "Weights are enormous! The model is oscillating wildly between training points — Runge's phenomenon.", "stdout": "degree=10: max |weight| = 3847.2" } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "insight", "title": "Runge's Phenomenon", "content": "High-degree polynomial interpolation at evenly spaced points oscillates wildly near the edges of the domain — even when the underlying function is smooth. This is why weight magnitude is a useful proxy for detecting overfitting." }
\`\`\`

---

## Building a Validation Curve — Full Implementation

Now let's build the complete diagnostic pipeline from scratch:

\`\`\`playground
{ "title": "Validation Curve Builder (NumPy Only)", "language": "python", "code": "import numpy as np\\n\\n# ── Data generation ──────────────────────────────────────────\\nnp.random.seed(42)\\nn = 60\\nX = np.sort(np.random.uniform(-3, 3, n))\\ny_true = 0.3 * X**3 - 0.5 * X**2 + X + np.sin(X)\\ny = y_true + np.random.randn(n) * 1.5  # add noise\\n\\n# ── Train/validation split ───────────────────────────────────\\nsplit = int(0.75 * n)\\nX_train, X_val = X[:split], X[split:]\\ny_train, y_val = y[:split], y[split:]\\n\\n# ── Helper functions ─────────────────────────────────────────\\ndef poly_features(X, degree):\\n    return np.column_stack([X**k for k in range(degree + 1)])\\n\\ndef ols_fit(Phi, y):\\n    return np.linalg.pinv(Phi.T @ Phi) @ Phi.T @ y\\n\\ndef mse(y_true, y_pred):\\n    return np.mean((y_true - y_pred) ** 2)\\n\\n# ── Sweep over degrees ───────────────────────────────────────\\ndegrees = range(1, 12)\\ntrain_errors = []\\nval_errors   = []\\n\\nfor d in degrees:\\n    Phi_train = poly_features(X_train, d)\\n    Phi_val   = poly_features(X_val,   d)\\n    \\n    w = ols_fit(Phi_train, y_train)\\n    \\n    train_errors.append(mse(y_train, Phi_train @ w))\\n    val_errors.append(  mse(y_val,   Phi_val   @ w))\\n\\n# ── Print validation curve ────────────────────────────────────\\nprint(f\\"{'Degree':>7} {'Train MSE':>12} {'Val MSE':>12} {'Regime':>15}\\")\\nprint(\\"-\\" * 50)\\nfor d, tr, va in zip(degrees, train_errors, val_errors):\\n    gap   = va - tr\\n    if tr > 3.0:\\n        regime = \\"UNDERFIT\\"\\n    elif gap > 2.0:\\n        regime = \\"OVERFIT\\"\\n    else:\\n        regime = \\"good\\"\\n    print(f\\"{d:>7} {tr:>12.3f} {va:>12.3f} {regime:>15}\\")\\n\\nbest_d = list(degrees)[np.argmin(val_errors)]\\nprint(f\\"\\\\nOptimal degree: {best_d} (val MSE = {min(val_errors):.3f})\\")", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Reading the Validation Curve", "content": "**Both errors high** → Underfitting (increase degree)\\n\\n**Train error low, val error high** → Overfitting (decrease degree or regularise)\\n\\n**Both errors low and close together** → Good generalisation" }
\`\`\`

---

## The Misconceptions, Debunked

\`\`\`concept
{ "title": "Misconception: Lower Bias is Always Better", "variant": "insight", "content": "Minimising bias by cranking up degree also cranks up variance. The total error is Bias² + Variance + Noise. A degree-10 polynomial might have near-zero bias on training data but a validation error 10× worse than a degree-3 model. You are optimising *total error*, not just bias." }
\`\`\`

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Bad: Chasing Training Error", "code": "# Pick the degree with lowest TRAINING error\\nbest_d = degrees[np.argmin(train_errors)]\\n# Result: always picks the highest degree\\n# → severe overfitting on new data" }, "after": { "label": "Good: Optimise Validation Error", "code": "# Pick the degree with lowest VALIDATION error\\nbest_d = degrees[np.argmin(val_errors)]\\n# Result: picks the model that generalises\\n# → actual predictive performance" } }
\`\`\`

---

## Adding Regularisation as a Fix

When you can't reduce degree (maybe you need the flexibility), Ridge regularisation penalises large weights directly:

$$w^* = (\\Phi^T\\Phi + \\lambda I)^{-1} \\Phi^T y$$

The \`λ\` hyperparameter controls how harshly large weights are penalised. As \`λ → ∞\`, weights → 0 (a flat line). As \`λ → 0\`, you recover ordinary OLS.

\`\`\`playground
{ "title": "Ridge Regularisation on High-Degree Polynomials", "language": "python", "code": "import numpy as np\\n\\nnp.random.seed(7)\\nX = np.linspace(-2, 2, 30)\\ny = np.sin(X * np.pi) + 0.3 * np.random.randn(30)\\n\\ndef poly_features(X, degree):\\n    # Normalise first — critical for numerical stability!\\n    X_norm = (X - X.mean()) / X.std()\\n    return np.column_stack([X_norm**k for k in range(degree + 1)])\\n\\ndef ridge_fit(Phi, y, lam):\\n    n_features = Phi.shape[1]\\n    I = np.eye(n_features)\\n    I[0, 0] = 0  # don't penalise the bias term\\n    return np.linalg.solve(Phi.T @ Phi + lam * I, Phi.T @ y)\\n\\nsplit = 20\\nPhi_train = poly_features(X[:split], degree=9)\\nPhi_val   = poly_features(X[split:], degree=9)\\n\\nprint(f\\"Degree 9 polynomial — effect of Ridge regularisation:\\")\\nprint(f\\"{'Lambda':>10} {'Train MSE':>12} {'Val MSE':>12} {'Max |w|':>10}\\")\\nprint(\\"-\\" * 48)\\n\\nfor lam in [0, 0.001, 0.01, 0.1, 1.0, 10.0]:\\n    w = ridge_fit(Phi_train, y[:split], lam)\\n    train_mse = np.mean((y[:split] - Phi_train @ w)**2)\\n    val_mse   = np.mean((y[split:] - Phi_val   @ w)**2)\\n    print(f\\"{lam:>10.3f} {train_mse:>12.4f} {val_mse:>12.4f} {np.max(np.abs(w)):>10.2f}\\")", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "What You Should See", "content": "As \`λ\` increases from 0 to ~0.1, validation MSE drops significantly while training MSE rises slightly. This is regularisation working — it trades a small amount of bias for a large reduction in variance. Past a certain \`λ\`, both errors rise (too much bias). The optimal \`λ\` is found the same way as optimal degree: via a validation curve." }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the Validation Curve Loop", "prompt": "Fill in the missing pieces to compute training and validation MSE for each polynomial degree:", "language": "python", "template": "for d in range(1, 10):\\n    Phi_tr = np.column_stack([X_train ** k for k in range(___ + 1)])\\n    Phi_va = np.column_stack([X_val   ** k for k in range(___ + 1)])\\n    w = np.linalg.pinv(Phi_tr.T @ Phi_tr) @ Phi_tr.T @ y_train\\n    train_mse = np.mean((y_train - Phi_tr @ ___) ** 2)\\n    val_mse   = np.mean((y_val   - ___ @ w)   ** 2)", "blanks": [ { "answer": "d", "hint": "The degree variable controls how many powers to include" }, { "answer": "d", "hint": "Both train and val matrices must use the same degree" }, { "answer": "w", "hint": "Matrix multiply design matrix by the fitted weight vector" }, { "answer": "Phi_va", "hint": "Which design matrix holds the validation features?" } ] }
\`\`\`

---

## Quiz

\`\`\`quiz
{ "title": "Bias-Variance Tradeoff & Polynomial Features", "questions": [ { "question": "A degree-2 polynomial model has training MSE = 4.1 and validation MSE = 4.5. A degree-8 model has training MSE = 0.2 and validation MSE = 9.3. What does this tell you?", "options": [ "The degree-8 model is better because its training error is lower", "The degree-2 model is underfitting; you need at least degree-8", "The degree-8 model is overfitting; degree-2 generalises much better", "Both models are underfitting since validation error is high" ], "answer": 2, "explanation": "The degree-8 model has a huge gap between training and validation error — the hallmark of overfitting (high variance). The degree-2 model's errors are close together and both moderate, indicating far better generalisation. Always optimise validation error, not training error." }, { "question": "Why must you normalise features BEFORE computing polynomial features of degree 10?", "options": [ "Because normalisation reduces the degree of the polynomial automatically", "Because x^10 for large x produces values that cause numerical instability in OLS", "Because unnormalised features always lead to underfitting", "Because polynomial regression doesn't work with negative values" ], "answer": 1, "explanation": "If x = 1000, then x^10 = 10^30 — far beyond float64 precision. The matrix (ΦᵀΦ)^(-1) becomes numerically singular or unstable. Normalising x to [-1, 1] or zero-mean/unit-variance keeps all powered terms in a manageable range." }, { "question": "You add Ridge regularisation (λ > 0) to a degree-9 polynomial. Which of the following best describes the effect on bias and variance?", "options": [ "Bias decreases, variance decreases", "Bias increases, variance decreases", "Bias decreases, variance increases", "Bias and variance both stay the same; only computation time changes" ], "answer": 1, "explanation": "Ridge penalises large weights, effectively shrinking the model toward simpler solutions. This introduces some bias (the model can no longer fit the training data as tightly) but reduces variance (predictions are less sensitive to noise in the training set). The net effect is usually lower total error on unseen data." }, { "question": "On a validation curve, training error keeps decreasing as degree increases, but validation error has a clear minimum at degree 4 then rises. What is the correct action?", "options": [ "Keep increasing degree until training error reaches 0", "Use degree 4 — it minimises validation error, which is the actual goal", "Use the highest degree tested, since more complexity is always better", "Use degree 1 because high variance is too risky" ], "answer": 1, "explanation": "The minimum of the validation curve identifies the optimal model complexity. Beyond that point, the model is memorising training noise — adding more degrees hurts generalisation. Degree 4 is the sweet spot where Bias² + Variance is minimised." }, { "question": "Which formula correctly computes polynomial features for a 1D input array X and degree d in NumPy?", "options": [ "np.stack([X * k for k in range(d+1)], axis=1)", "np.column_stack([X ** k for k in range(d+1)])", "np.hstack([X, X**2, X**d])", "np.poly1d(X, d)" ], "answer": 1, "explanation": "\`np.column_stack([X ** k for k in range(d+1)])\` creates columns X^0=1, X^1, X^2, ..., X^d — exactly the polynomial design matrix Φ. Option A multiplies by k instead of raising to power k. Option C hardcodes columns and misses intermediate degrees. Option D is for evaluating polynomials, not building feature matrices." } ] }
\`\`\`

---

## The Complete Picture

\`\`\`collapse
{ "title": "Deep Dive: The Bias-Variance Decomposition Proof", "content": "For a squared loss regression problem, the expected generalisation error at a point x can be written:\\n\\n$$\\\\mathbb{E}[(y - \\\\hat{f}(x))^2] = \\\\text{Bias}[\\\\hat{f}(x)]^2 + \\\\text{Var}[\\\\hat{f}(x)] + \\\\sigma^2$$\\n\\nwhere:\\n- $\\\\text{Bias}[\\\\hat{f}(x)] = \\\\mathbb{E}[\\\\hat{f}(x)] - f(x)$ — how far off is the *average* prediction from the truth?\\n- $\\\\text{Var}[\\\\hat{f}(x)] = \\\\mathbb{E}[(\\\\hat{f}(x) - \\\\mathbb{E}[\\\\hat{f}(x)])^2]$ — how much does the prediction fluctuate across different training datasets?\\n- $\\\\sigma^2$ — irreducible noise in the target (can't be fixed by any model)\\n\\n**Key insight:** Both bias and variance are expectations *over possible training datasets*, not just a single dataset. Variance measures how sensitive your model is to which particular 60 samples you happened to collect.\\n\\nThis decomposition tells us: there is a floor to prediction error set by the noise level $\\\\sigma^2$. No model, no matter how complex, can beat this floor. The art of machine learning is getting Bias² + Variance as close to zero as possible without exceeding $\\\\sigma^2$ in the process." }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Polynomial features transform a linear model's input space — the model stays linear in its weights, only the features change. Degree d adds columns x², x³, …, xᵈ to the design matrix.", "The bias-variance tradeoff is not a choice — it's a law. Reducing bias (via higher complexity) mechanically increases variance, and vice versa. You optimise the sum, not either one in isolation.", "Validation curves are your primary diagnostic tool: plot both training and validation error vs polynomial degree. The optimal degree is where validation error is minimised — not where training error is lowest.", "Always normalise features before computing high-degree polynomial terms. Unnormalised x^10 causes numerical instability in OLS and blows up weight magnitudes.", "Ridge regularisation (λ > 0) adds a penalty that shrinks weights toward zero, trading a small amount of bias for a large reduction in variance — often the right fix when you need a higher-degree polynomial but see overfitting." ] }
\`\`\``,
      starterCode: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import validation_curve

# Generate noisy curve data
np.random.seed(42)
X = np.linspace(-3, 3, 100).reshape(-1, 1)
y = 0.5 * X.ravel()**3 - X.ravel()**2 + 2 + np.random.randn(100) * 2

# TODO 1: Create three polynomial regression models with degrees 1, 4, and 15
# Use make_pipeline(PolynomialFeatures(degree=?), LinearRegression())
# Store them in a dict: models = {1: ..., 4: ..., 15: ...}
models = {}

# TODO 2: Fit each model on the full dataset (X, y)

# TODO 3: Plot predictions for each degree
# Use X_plot = np.linspace(-3, 3, 300).reshape(-1, 1) for smooth curves
X_plot = np.linspace(-3, 3, 300).reshape(-1, 1)

plt.figure(figsize=(14, 4))
for i, degree in enumerate([1, 4, 15]):
    plt.subplot(1, 3, i + 1)
    plt.scatter(X, y, s=15, alpha=0.5, label='Data')
    # TODO 3a: Predict using models[degree] on X_plot and plot the curve
    plt.title(f'Degree {degree}')
    plt.ylim(-20, 20)
    plt.legend()
plt.tight_layout()
plt.show()

# TODO 4: Use validation_curve to compute train/validation scores
# across degrees 1..15 for a single pipeline
# Hint: validation_curve(estimator, X, y, param_name=?, param_range=?)
# param_name for the PolynomialFeatures step inside a pipeline is:
#   'polynomialfeatures__degree'
param_range = np.arange(1, 16)

# train_scores, val_scores = validation_curve(...)

# TODO 5: Plot the validation curve
# Show mean train score and mean val score vs degree
# Mark where underfitting ends and overfitting begins
plt.figure(figsize=(8, 5))
# plt.plot(param_range, train_scores.mean(axis=1), label='Train score')
# plt.plot(param_range, val_scores.mean(axis=1), label='Validation score')
plt.xlabel('Polynomial Degree')
plt.ylabel('R² Score')
plt.title('Validation Curve — Bias-Variance Tradeoff')
plt.legend()
plt.show()

# TODO 6: Print the degree that achieves the best mean validation score
# best_degree = param_range[np.argmax(val_scores.mean(axis=1))]
# print(f'Best degree: {best_degree}')
`,
      solutionCode: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import validation_curve

# Generate noisy curve data
np.random.seed(42)
X = np.linspace(-3, 3, 100).reshape(-1, 1)
y = 0.5 * X.ravel()**3 - X.ravel()**2 + 2 + np.random.randn(100) * 2

# Step 1: Build three models — underfit, good fit, overfit
models = {
    1:  make_pipeline(PolynomialFeatures(degree=1),  LinearRegression()),  # underfit
    4:  make_pipeline(PolynomialFeatures(degree=4),  LinearRegression()),  # good fit
    15: make_pipeline(PolynomialFeatures(degree=15), LinearRegression()),  # overfit
}

# Step 2: Fit every model
for model in models.values():
    model.fit(X, y)

# Step 3: Plot predictions — see bias vs variance visually
X_plot = np.linspace(-3, 3, 300).reshape(-1, 1)

plt.figure(figsize=(14, 4))
for i, degree in enumerate([1, 4, 15]):
    plt.subplot(1, 3, i + 1)
    plt.scatter(X, y, s=15, alpha=0.5, label='Data')
    y_pred = models[degree].predict(X_plot)  # smooth curve prediction
    plt.plot(X_plot, y_pred, color='red', linewidth=2, label=f'Deg {degree}')
    plt.title(f'Degree {degree}')
    plt.ylim(-20, 20)
    plt.legend()
plt.tight_layout()
plt.show()
# Degree 1  → straight line, high bias (underfitting)
# Degree 4  → captures the curve, low bias + low variance (sweet spot)
# Degree 15 → wiggles wildly, high variance (overfitting)

# Step 4: Validation curve — sweep degrees 1-15 with cross-validation
param_range = np.arange(1, 16)
base_pipeline = make_pipeline(PolynomialFeatures(), LinearRegression())

train_scores, val_scores = validation_curve(
    base_pipeline,
    X, y,
    param_name='polynomialfeatures__degree',  # target the degree inside the pipeline
    param_range=param_range,
    cv=5,           # 5-fold cross-validation
    scoring='r2',
)

# Step 5: Plot the validation curve
plt.figure(figsize=(8, 5))
plt.plot(param_range, train_scores.mean(axis=1), label='Train R²', marker='o')
plt.plot(param_range, val_scores.mean(axis=1),   label='Validation R²', marker='o')
plt.fill_between(param_range,
                 val_scores.mean(axis=1) - val_scores.std(axis=1),
                 val_scores.mean(axis=1) + val_scores.std(axis=1),
                 alpha=0.2)
plt.xlabel('Polynomial Degree')
plt.ylabel('R² Score')
plt.title('Validation Curve — Bias-Variance Tradeoff')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
# Left region (low degree):  train ≈ val but both low  → high bias / underfitting
# Middle region:              both scores are high       → sweet spot
# Right region (high degree): train high, val drops     → high variance / overfitting

# Step 6: Identify the optimal degree
best_degree = param_range[np.argmax(val_scores.mean(axis=1))]
print(f'Best polynomial degree: {best_degree}')
# Expected output: Best polynomial degree: 3 or 4
`,
    },
    {
      id: "regression-checkpoint",
      slug: "regression-checkpoint",
      title: "Checkpoint: Predict Housing Prices",
      content: `# Checkpoint: Predict Housing Prices

You've spent this module deriving gradients, implementing weight updates, and wrestling with regularization theory. Now it's time to put it all together. In this checkpoint you will build a **complete regression pipeline** — from raw data to a tuned model — using nothing but NumPy.

By the end you will have:
- Preprocessed a housing dataset (mean-centering, std-normalization)
- Trained a ridge-regularized linear model with gradient descent
- Evaluated performance with RMSE on a held-out test set
- Tuned the regularization strength λ and understood its effect

\`\`\`concept
{ "title": "The ML Pipeline Mental Model", "variant": "mental-model", "content": "Every supervised learning project follows the same five-stage loop: Load → Preprocess → Train → Evaluate → Tune. Skipping any stage leads to deceptively good metrics during development but poor generalization in production. This checkpoint runs all five." }
\`\`\`

---

## Stage 1 — The Dataset

We'll work with a synthetic but realistic housing dataset. Each row is a house; the features are:

| Feature | Description | Raw Scale |
|---|---|---|
| \`sqft\` | Interior square footage | 500–4000 ft² |
| \`bedrooms\` | Number of bedrooms | 1–6 |
| \`bathrooms\` | Number of bathrooms | 1–4 |
| \`age\` | Age of house in years | 0–80 |
| \`distance\` | Distance to city center (km) | 1–50 |

The target \`price\` is in thousands of USD.

\`\`\`callout
{ "type": "warning", "title": "Scale Mismatch Kills Gradient Descent", "content": "sqft ranges 0–4000 while bedrooms ranges 1–6. Without normalization, the gradient for sqft will be ~700× larger, causing wildly unequal weight updates. Always normalize before training." }
\`\`\`

---

## Stage 2 — Preprocessing Pipeline

\`\`\`steps
{ "title": "Preprocessing: 4 Steps to Clean Data", "steps": [ { "title": "Generate / Load Data", "content": "Create or load the raw feature matrix \`X\` (shape \`[N, 5]\`) and target vector \`y\` (shape \`[N]\`).\\n\\nFor reproducibility always set a random seed:\\n\`\`\`python\\nnp.random.seed(42)\\n\`\`\`" }, { "title": "Train / Test Split", "content": "Hold out 20% for final evaluation. Never touch test data during training or hyperparameter search:\\n\`\`\`python\\nsplit = int(0.8 * N)\\nX_train, X_test = X[:split], X[split:]\\ny_train, y_test = y[:split], y[split:]\\n\`\`\`" }, { "title": "Compute Normalization Stats on Train Only", "content": "Fit mean and standard deviation **only on training data**, then apply the same transform to test data. Computing stats on the full dataset is called *data leakage*:\\n\`\`\`python\\nmean = X_train.mean(axis=0)\\nstd  = X_train.std(axis=0)\\nX_train_norm = (X_train - mean) / std\\nX_test_norm  = (X_test  - mean) / std   # use train stats!\\n\`\`\`" }, { "title": "Add Bias Column", "content": "Prepend a column of ones so the bias term \`b\` becomes part of the weight vector \`w\`:\\n\`\`\`python\\nones = np.ones((X_train_norm.shape[0], 1))\\nX_train_b = np.hstack([ones, X_train_norm])\\n\`\`\`\\nNow \`w[0]\` is the bias and \`w[1:]\` are the feature weights." } ] }
\`\`\`

---

## Stage 3 — Gradient Descent with Ridge Regularization

The cost function we minimize is:

$$J(w) = \\frac{1}{2N} \\sum_{i=1}^{N}(\\hat{y}_i - y_i)^2 + \\frac{\\lambda}{2}\\|w_{1:}\\|^2$$

The regularization term penalizes the **non-bias** weights only (by convention we don't regularize \`w[0]\`).

The gradient is:

$$\\nabla_w J = \\frac{1}{N} X^T(Xw - y) + \\lambda \\cdot w_{\\text{reg}}$$

where $w_{\\text{reg}}$ is \`w\` with \`w[0]\` zeroed out.

\`\`\`trace
{ "title": "One Gradient Descent Step — Traced", "language": "python", "code": "import numpy as np\\n\\n# Tiny example: 4 houses, 2 features + bias\\nX = np.array([[1, 0.5, -1.2],\\n              [1, 1.3,  0.4],\\n              [1,-0.8,  1.1],\\n              [1, 2.0, -0.3]])\\ny = np.array([250, 310, 220, 380])\\nw = np.zeros(3)\\nlr = 0.01\\nlam = 0.1\\nN = len(y)\\n\\n# Forward pass\\ny_hat = X @ w\\n\\n# Loss\\nerrors = y_hat - y\\nloss = (errors**2).mean() / 2\\n\\n# Gradient\\ngrad = (X.T @ errors) / N\\n\\n# Ridge penalty (skip w[0])\\nw_reg = w.copy()\\nw_reg[0] = 0\\ngrad_total = grad + lam * w_reg\\n\\n# Update\\nw = w - lr * grad_total", "frames": [ { "line": 12, "vars": {"w": "[0, 0, 0]", "N": 4}, "note": "Weights start at zero", "stdout": "" }, { "line": 15, "vars": {"y_hat": "[0, 0, 0, 0]"}, "note": "Forward pass: all predictions are 0 initially", "stdout": "" }, { "line": 18, "vars": {"errors": "[-250,-310,-220,-380]", "loss": 32137.5}, "note": "Large loss — model knows nothing yet", "stdout": "" }, { "line": 22, "vars": {"grad": "[-290.0, 56.5, -73.5]"}, "note": "Gradient points in direction of steepest increase", "stdout": "" }, { "line": 26, "vars": {"w_reg": "[0, 0, 0]"}, "note": "w=0 so ridge penalty adds nothing this step", "stdout": "" }, { "line": 30, "vars": {"w": "[2.9, -0.565, 0.735]"}, "note": "Weights move in -gradient direction — first step taken!", "stdout": "" } ], "speed": 900 }
\`\`\`

---

## Stage 4 — Full Implementation

Run the complete pipeline below. Try changing \`learning_rate\`, \`lambda_reg\`, and \`epochs\` to see how RMSE changes.

\`\`\`playground
{ "title": "Complete Housing Price Pipeline", "language": "python", "code": "import numpy as np\\n\\n# ── Reproducibility ──────────────────────────────────────────\\nnp.random.seed(42)\\nN = 300\\n\\n# ── Synthetic Dataset ─────────────────────────────────────────\\n# Features: sqft, bedrooms, bathrooms, age, distance\\nX_raw = np.column_stack([\\n    np.random.uniform(500, 4000, N),   # sqft\\n    np.random.randint(1, 7, N),        # bedrooms\\n    np.random.randint(1, 5, N),        # bathrooms\\n    np.random.uniform(0, 80, N),       # age\\n    np.random.uniform(1, 50, N),       # distance\\n])\\n\\n# True relationship (what we want the model to learn)\\ntrue_w = np.array([0.12, 15.0, 8.0, -0.8, -3.5])\\ny_raw  = X_raw @ true_w + 50 + np.random.normal(0, 15, N)\\n\\n# ── Train/Test Split ──────────────────────────────────────────\\nsplit    = int(0.8 * N)\\nX_train  = X_raw[:split];  X_test  = X_raw[split:]\\ny_train  = y_raw[:split];  y_test  = y_raw[split:]\\n\\n# ── Normalise (fit on train only) ─────────────────────────────\\nmean = X_train.mean(axis=0)\\nstd  = X_train.std(axis=0) + 1e-8   # avoid /0\\n\\nX_tr = (X_train - mean) / std\\nX_te = (X_test  - mean) / std\\n\\n# Add bias column\\nones_tr = np.ones((X_tr.shape[0], 1))\\nones_te = np.ones((X_te.shape[0], 1))\\nX_tr = np.hstack([ones_tr, X_tr])   # shape [240, 6]\\nX_te = np.hstack([ones_te, X_te])   # shape [60, 6]\\n\\n# ── Hyperparameters ───────────────────────────────────────────\\nlearning_rate = 0.05\\nlambda_reg    = 0.01    # Ridge: try 0, 0.001, 0.1, 1.0\\nepochs        = 500\\nn_train       = X_tr.shape[0]\\n\\n# ── Initialise Weights ────────────────────────────────────────\\nw = np.zeros(X_tr.shape[1])   # [bias, w1..w5]\\n\\n# ── Training Loop ─────────────────────────────────────────────\\nloss_history = []\\nfor epoch in range(epochs):\\n    y_hat  = X_tr @ w\\n    errors = y_hat - y_train\\n    loss   = (errors**2).mean() / 2\\n    loss_history.append(loss)\\n\\n    # Gradient\\n    grad = (X_tr.T @ errors) / n_train\\n\\n    # Ridge: don't penalise bias term\\n    w_reg    = w.copy()\\n    w_reg[0] = 0.0\\n    grad    += lambda_reg * w_reg\\n\\n    w -= learning_rate * grad\\n\\n# ── Evaluation ────────────────────────────────────────────────\\ndef rmse(y_true, y_pred):\\n    return np.sqrt(((y_true - y_pred)**2).mean())\\n\\ntrain_rmse = rmse(y_train, X_tr @ w)\\ntest_rmse  = rmse(y_test,  X_te @ w)\\n\\nprint(f'Final train RMSE : {train_rmse:.2f}')\\nprint(f'Final test  RMSE : {test_rmse:.2f}')\\nprint(f'Loss at epoch 0  : {loss_history[0]:.1f}')\\nprint(f'Loss at epoch {epochs} : {loss_history[-1]:.1f}')\\nprint(f'Learned weights  : {np.round(w, 3)}')\\n", "runnable": true }
\`\`\`

---

## Stage 5 — Understanding RMSE

RMSE (Root Mean Squared Error) is the most natural metric for regression:

$$\\text{RMSE} = \\sqrt{\\frac{1}{N}\\sum_{i=1}^{N}(y_i - \\hat{y}_i)^2}$$

It lives in the **same units as the target** (here: thousands of USD). A model with RMSE = 18 is wrong by roughly ±\\$18k on average.

\`\`\`tabs
{ "tabs": [ { "label": "RMSE vs MAE", "icon": "📐", "content": "| Metric | Formula | Sensitive to outliers? | Units |\\n|--------|---------|----------------------|-------|\\n| RMSE | sqrt(mean(errors²)) | Yes — squares amplify | Same as target |\\n| MAE | mean(\\\\|errors\\\\|) | No | Same as target |\\n| R² | 1 - SS_res/SS_tot | Moderate | Unitless (0–1) |\\n\\n**Choose RMSE** when large errors are especially costly (e.g., a $100k pricing error is worse than ten $10k errors).\\n\\n**Choose MAE** when all errors are equally bad regardless of magnitude." }, { "label": "Interpreting Your RMSE", "icon": "🏠", "content": "For our synthetic dataset where prices range roughly $200k–$900k:\\n\\n- **RMSE < 20** — Excellent fit; model captures signal well\\n- **RMSE 20–40** — Good; acceptable for a linear model with noise\\n- **RMSE > 60** — Something is wrong: too few epochs, too high λ, or learning rate issue\\n\\nAlways compare train RMSE vs test RMSE:\\n\\n- \`train ≪ test\` → **Overfitting** — lower λ or more data\\n- \`train ≈ test\` (both high) → **Underfitting** — more features or fewer constraints" }, { "label": "Regularization Effect", "icon": "⚖️", "content": "Ridge (L2) regularization shrinks weights toward zero:\\n\\n| λ value | Effect |\\n|---------|--------|\\n| 0 | No regularization — pure OLS |\\n| 0.001 | Gentle shrinkage; negligible on large datasets |\\n| 0.01 | Moderate; good default starting point |\\n| 0.1 | Noticeable weight reduction; useful with correlated features |\\n| 1.0 | Aggressive; underfits on simple problems |\\n| 10.0 | Extreme — weights approach 0, all predictions near mean |\\n\\nThe sweet spot is found via **cross-validation**, not gut feeling." } ] }
\`\`\`

---

## Stage 6 — Gradient Descent Convergence

Watch how the loss landscape changes across epochs for different learning rates:

\`\`\`algoviz
{ "title": "Loss Curve: Gradient Descent Over Epochs", "type": "array", "data": [32000, 18000, 9500, 4800, 2200, 980, 420, 180, 75, 31, 22, 19, 18, 18, 18], "frames": [ { "highlight": [0], "label": "Epoch 0 — Loss: 32000 (random init)", "stats": {"epoch": 0, "loss": 32000} }, { "highlight": [0, 1], "label": "Epoch 50 — Steep descent phase", "stats": {"epoch": 50, "loss": 18000} }, { "highlight": [0, 1, 2], "label": "Epoch 100 — Still learning fast", "stats": {"epoch": 100, "loss": 9500} }, { "highlight": [0, 1, 2, 3], "label": "Epoch 150 — Slowing down", "stats": {"epoch": 150, "loss": 4800} }, { "highlight": [0, 1, 2, 3, 4], "label": "Epoch 200 — Approaching basin", "stats": {"epoch": 200, "loss": 2200} }, { "highlight": [0, 1, 2, 3, 4, 5], "label": "Epoch 250 — Near convergence", "stats": {"epoch": 250, "loss": 980} }, { "highlight": [0, 1, 2, 3, 4, 5, 6], "label": "Epoch 300 — Almost flat", "stats": {"epoch": 300, "loss": 420} }, { "highlight": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], "label": "Epoch 500 — Converged", "stats": {"epoch": 500, "loss": 18} } ], "speed": 700 }
\`\`\`

---

## Practice: Fill in the Pipeline

Complete the two critical missing pieces of the gradient descent update:

\`\`\`fillblank
{ "title": "Implement the Gradient and Ridge Update", "prompt": "Fill in the gradient computation and the ridge regularization step inside the training loop.", "language": "python", "template": "def train(X, y, lr=0.05, lam=0.01, epochs=300):\\n    n, d = X.shape\\n    w = np.zeros(d)\\n    for _ in range(epochs):\\n        y_hat  = X @ w\\n        errors = y_hat - y\\n        # Gradient of MSE loss\\n        grad = (X.T @ ___) / n\\n        # Ridge: zero out bias penalty\\n        w_reg    = w.copy()\\n        w_reg[0] = ___\\n        grad    += lam * w_reg\\n        w -= lr * grad\\n    return w", "blanks": [ { "answer": "errors", "hint": "The gradient of 0.5 * MSE is X^T times the prediction errors, divided by N." }, { "answer": "0.0", "hint": "By convention we do NOT penalize the bias term — set it to zero in the regularization copy." } ] }
\`\`\`

---

## Stage 7 — Hyperparameter Search

A principled way to find the best λ is to scan a log-scale grid on a validation set. Add this after your training loop:

\`\`\`playground
{ "title": "Lambda Grid Search", "language": "python", "code": "import numpy as np\\n\\nnp.random.seed(42)\\nN = 300\\n\\nX_raw = np.column_stack([\\n    np.random.uniform(500, 4000, N),\\n    np.random.randint(1, 7, N),\\n    np.random.randint(1, 5, N),\\n    np.random.uniform(0, 80, N),\\n    np.random.uniform(1, 50, N),\\n])\\ntrue_w = np.array([0.12, 15.0, 8.0, -0.8, -3.5])\\ny_raw  = X_raw @ true_w + 50 + np.random.normal(0, 15, N)\\n\\n# 60/20/20 split: train / val / test\\nn_train = int(0.6 * N); n_val = int(0.2 * N)\\nX_train = X_raw[:n_train];  y_train = y_raw[:n_train]\\nX_val   = X_raw[n_train:n_train+n_val]; y_val = y_raw[n_train:n_train+n_val]\\nX_test  = X_raw[n_train+n_val:];        y_test = y_raw[n_train+n_val:]\\n\\nmean = X_train.mean(axis=0); std = X_train.std(axis=0) + 1e-8\\n\\ndef prep(X):\\n    Xn = (X - mean) / std\\n    return np.hstack([np.ones((Xn.shape[0], 1)), Xn])\\n\\nXtr = prep(X_train); Xva = prep(X_val); Xte = prep(X_test)\\n\\ndef fit(X, y, lr=0.05, lam=0.0, epochs=400):\\n    w = np.zeros(X.shape[1])\\n    n = X.shape[0]\\n    for _ in range(epochs):\\n        err  = X @ w - y\\n        g    = X.T @ err / n\\n        wr   = w.copy(); wr[0] = 0\\n        g   += lam * wr\\n        w   -= lr * g\\n    return w\\n\\ndef rmse(y, yh):\\n    return np.sqrt(((y - yh)**2).mean())\\n\\n# Grid search over lambda\\nlambdas = [0, 0.0001, 0.001, 0.01, 0.1, 1.0, 10.0]\\nprint(f'{\\"lambda\\":>10}  {\\"train RMSE\\":>12}  {\\"val RMSE\\":>10}')\\nprint('-' * 38)\\nbest_lam, best_rmse = None, float('inf')\\nfor lam in lambdas:\\n    w = fit(Xtr, y_train, lam=lam)\\n    tr = rmse(y_train, Xtr @ w)\\n    va = rmse(y_val,   Xva @ w)\\n    flag = '  <-- best' if va < best_rmse else ''\\n    if va < best_rmse:\\n        best_rmse = va; best_lam = lam\\n    print(f'{lam:>10.4f}  {tr:>12.3f}  {va:>10.3f}{flag}')\\n\\n# Final evaluation on test set\\nw_final = fit(Xtr, y_train, lam=best_lam)\\ntest_r   = rmse(y_test, Xte @ w_final)\\nprint(f'\\\\nBest lambda: {best_lam}   Test RMSE: {test_r:.3f}')\\n", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "Never Tune on the Test Set", "content": "The test set must remain completely unseen until your final evaluation. Choosing λ based on test RMSE gives an overly optimistic estimate because you've implicitly fit the test set. Always use a separate validation split or k-fold cross-validation for hyperparameter selection." }
\`\`\`

---

## Checkpoint Quiz

\`\`\`quiz
{ "title": "Checkpoint: Predict Housing Prices", "questions": [ { "question": "You fit normalization statistics (mean, std) on the full dataset before splitting into train and test. What problem does this cause?", "options": [ "Gradient descent will diverge", "Data leakage — test statistics influence the normalization transform", "The model will underfit because features are zero-mean", "No problem — normalization is always computed on all available data" ], "answer": 1, "explanation": "Computing stats on the full dataset leaks test information into the training pipeline. You must compute mean and std only on the training split, then apply those same values to transform the test set." }, { "question": "Your model achieves train RMSE = 12 and test RMSE = 58. Which of the following is the most appropriate next step?", "options": [ "Increase the learning rate to train faster", "Increase regularization strength λ to reduce overfitting", "Decrease λ to zero so the model can fit better", "Add more epochs — the model hasn't converged" ], "answer": 1, "explanation": "train RMSE ≪ test RMSE is the classic overfitting signature. Increasing λ (ridge penalty) shrinks the weights and reduces variance, helping the model generalize better to unseen data." }, { "question": "In ridge regression the gradient update includes the term \`lam * w_reg\` where \`w_reg[0] = 0\`. Why is the bias term excluded from regularization?", "options": [ "The bias gradient is always zero so it doesn't matter", "Regularizing the bias would shift all predictions toward zero, hurting fit without reducing overfitting", "NumPy does not support indexing at position 0", "Ridge regression only applies to the last feature weight" ], "answer": 1, "explanation": "The bias term shifts the entire prediction surface up or down. Penalizing it forces predictions toward zero regardless of the true mean of y, which artificially increases error. Feature weights, not the bias, control model complexity." }, { "question": "You run the lambda grid search and find val RMSE is U-shaped: high at λ=0, lowest at λ=0.01, then rising again at λ=1. What does this tell you?", "options": [ "The dataset has too many features and should be reduced", "λ=0.01 balances bias and variance optimally for this problem", "You should always pick λ=0 for minimum training loss", "The U-shape indicates a bug in the training loop" ], "answer": 1, "explanation": "A U-shaped validation curve is textbook bias-variance tradeoff. At λ=0 the model overfits (high variance). At large λ it underfits (high bias). The minimum of the curve identifies the regularization strength that best balances the two." }, { "question": "RMSE is reported in the same units as the target variable. If your housing model has RMSE = 22 and house prices range from $150k to $800k, which statement best characterizes model quality?", "options": [ "The model is useless — 22 is too high", "The model is strong — average error of $22k on a $150k–$800k range is reasonable", "RMSE tells us nothing without knowing R²", "A good model must have RMSE below 1.0" ], "answer": 1, "explanation": "Context matters. RMSE = 22 means average error of ~$22k. On prices spanning $650k, this is roughly 3–15% relative error — reasonable for a linear model on a noisy dataset. Always interpret RMSE relative to the target range." } ] }
\`\`\`

---

## Common Pitfalls Recap

\`\`\`collapse
{ "title": "Deep Dive: Debugging a Broken Training Loop", "content": "If your loss is **not decreasing** after 100 epochs, check in this order:\\n\\n1. **Learning rate too high** — loss oscillates or explodes. Try dividing lr by 10.\\n2. **Features not normalized** — sqft dominates gradient. Check \`X_train.std(axis=0)\` — all values should be ~1.0 after normalization.\\n3. **Bias column missing** — model can't shift the prediction surface. Confirm \`X_train_b.shape[1] == n_features + 1\`.\\n4. **Gradient sign flipped** — must be \`w -= lr * grad\` not \`w += lr * grad\`.\\n5. **Target not in range** — if prices are in raw dollars (200000–800000) vs thousands (200–800), the gradient magnitude is 1000× larger. Normalize y too, or use a smaller lr.\\n\\nIf loss decreases then **plateaus too early**:\\n- Increase epochs\\n- Try lr warm-up: start at 0.001, increase to 0.05 after 50 epochs\\n- Check for correlated features (multicollinearity) — ridge regularization helps here" }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Always fit normalization stats on training data only — applying them to the test set is correct; recomputing them on the test set is data leakage.", "Ridge regularization penalizes all feature weights (not the bias) to reduce overfitting — the strength λ controls the bias-variance tradeoff.", "RMSE lives in the same units as the target, making it the most interpretable regression metric for communicating results.", "Train RMSE ≪ Test RMSE signals overfitting → increase λ. Both high signals underfitting → decrease λ or add features.", "Hyperparameter tuning belongs on a validation set — the test set is touched exactly once, at the very end.", "The complete pipeline is: generate/load → split → normalize → add bias → train loop → evaluate → tune λ on val → final RMSE on test." ] }
\`\`\``,
      starterCode: `import numpy as np

# Housing dataset: [size_sqft, bedrooms, age_years] -> price ($1000s)
np.random.seed(42)
X_raw = np.column_stack([
    np.random.uniform(500, 3500, 100),
    np.random.randint(1, 6, 100),
    np.random.uniform(0, 50, 100)
])
true_w = np.array([0.15, 20.0, -0.5])
y = X_raw @ true_w + 50 + np.random.normal(0, 10, 100)

# TODO 1: Normalize features
# Compute mean and std for each feature column, then standardize X_raw.
# Store as X_norm (shape: 100x3), mean as X_mean, std as X_std.
X_mean = None
X_std = None
X_norm = None

# TODO 2: Add bias column
# Prepend a column of ones to X_norm so shape becomes (100, 4).
X = None

# Split into train/test (80/20)
train_size = 80
X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

def predict(X, w):
    """Linear prediction: X @ w"""
    return X @ w

def compute_loss(X, y, w, lam):
    """
    TODO 3: Compute Ridge loss = MSE + lambda * sum(w[1:]^2)
    Do NOT regularize the bias term (w[0]).
    Return a scalar.
    """
    pass

def gradient_descent(X, y, lam=0.01, lr=0.01, epochs=500):
    """
    TODO 4: Implement gradient descent with Ridge regularization.
    - Initialize w as zeros (length = X.shape[1])
    - Each epoch:
        a. Compute predictions
        b. Compute MSE gradient: (2/n) * X.T @ (preds - y)
        c. Add Ridge gradient: 2 * lam * w  (zero out index 0 for bias)
        d. Update w
    - Return final w
    """
    pass

def rmse(y_true, y_pred):
    """TODO 5: Return sqrt(mean squared error)."""
    pass

# TODO 6: Train with lambda=0.1, lr=0.01, epochs=500
# Then compute and print train RMSE and test RMSE.
w = None

# Expected output: test RMSE roughly between 8 and 15
`,
      solutionCode: `import numpy as np

# Housing dataset: [size_sqft, bedrooms, age_years] -> price ($1000s)
np.random.seed(42)
X_raw = np.column_stack([
    np.random.uniform(500, 3500, 100),
    np.random.randint(1, 6, 100),
    np.random.uniform(0, 50, 100)
])
true_w = np.array([0.15, 20.0, -0.5])
y = X_raw @ true_w + 50 + np.random.normal(0, 10, 100)

# Step 1: Normalize features (zero mean, unit variance)
X_mean = X_raw.mean(axis=0)
X_std = X_raw.std(axis=0)
X_norm = (X_raw - X_mean) / X_std

# Step 2: Add bias column of ones
X = np.column_stack([np.ones(len(X_norm)), X_norm])

# Split into train/test (80/20)
train_size = 80
X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

def predict(X, w):
    """Linear prediction: X @ w"""
    return X @ w

def compute_loss(X, y, w, lam):
    """
    Ridge loss = MSE + lambda * ||w[1:]||^2
    Bias term (w[0]) is excluded from regularization.
    """
    n = len(y)
    preds = predict(X, w)
    mse = np.mean((preds - y) ** 2)
    ridge_penalty = lam * np.sum(w[1:] ** 2)  # skip bias
    return mse + ridge_penalty

def gradient_descent(X, y, lam=0.01, lr=0.01, epochs=500):
    """
    Gradient descent with Ridge regularization.
    MSE gradient:   (2/n) * X.T @ (preds - y)
    Ridge gradient: 2 * lam * w  (bias term zeroed out)
    """
    n, d = X.shape
    w = np.zeros(d)

    for _ in range(epochs):
        preds = predict(X, w)
        error = preds - y

        # MSE gradient
        grad = (2 / n) * X.T @ error

        # Ridge gradient (skip bias at index 0)
        ridge_grad = 2 * lam * w
        ridge_grad[0] = 0.0

        w -= lr * (grad + ridge_grad)

    return w

def rmse(y_true, y_pred):
    """Root Mean Squared Error"""
    return np.sqrt(np.mean((y_true - y_pred) ** 2))

# Step 6: Train model and evaluate
w = gradient_descent(X_train, y_train, lam=0.1, lr=0.01, epochs=500)

train_rmse = rmse(y_train, predict(X_train, w))
test_rmse = rmse(y_test, predict(X_test, w))

print(f"Train RMSE: {train_rmse:.2f}")
print(f"Test RMSE:  {test_rmse:.2f}")
# Test RMSE should be roughly 8-15, confirming the model generalizes
`,
    },
  ],
};
