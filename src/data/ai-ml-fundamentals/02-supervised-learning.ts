import { Module } from "../types";

export const supervisedLearningModule: Module = {
  id: "aiml-supervised-learning",
  title: "Supervised Learning",
  description:
    "Master the fundamentals of supervised learning: linear regression, logistic regression, loss functions, and the bias-variance tradeoff. Build models that learn from labeled data to make predictions.",
  lessons: [
    {
      id: "aiml-linear-regression",
      slug: "linear-regression",
      title: "Linear Regression from Scratch",
      content: `## Linear Regression from Scratch

<!-- voice:section_check -->

Linear regression is the "Hello World" of machine learning. It models the relationship between input features and a continuous output by fitting a straight line (or hyperplane) through the data.

### The Model

For a single feature, linear regression predicts:

\`\`\`
y_hat = w * x + b
\`\`\`

Where:
- **w** (weight) controls the slope — how much y changes per unit of x
- **b** (bias) controls the y-intercept — the prediction when x = 0
- **y_hat** is the predicted value

For multiple features: \`y_hat = w1*x1 + w2*x2 + ... + wn*xn + b\`

### The Loss Function

How do we know if our line fits well? We measure the **Mean Squared Error (MSE)**:

\`\`\`
MSE = (1/n) * sum((y_actual - y_predicted)^2)
\`\`\`

Squaring ensures:
- Positive and negative errors do not cancel out
- Large errors are penalized more heavily than small ones

<!-- voice:key_insight -->

### Why Not Just Solve It Analytically?

Linear regression has a closed-form solution (the Normal Equation):

\`\`\`python
w = np.linalg.inv(X.T @ X) @ X.T @ y
\`\`\`

But this approach:
- Requires inverting a matrix: O(n^3) complexity
- Does not scale to millions of features or examples
- Cannot be applied to non-linear models

This is why we learn **gradient descent** — an iterative optimization method that scales to any model.

### Intuition for Gradient Descent

Imagine you are on a foggy hillside and want to find the lowest point:
1. Feel the slope under your feet (compute the gradient)
2. Take a step downhill (update parameters)
3. Repeat until you reach the bottom (convergence)

The **learning rate** controls your step size:
- Too large: you overshoot and oscillate
- Too small: training takes forever
- Just right: steady convergence to the minimum

\`\`\`mermaid
graph LR
    D["Training Data"] --> F["Extract Features"]
    F --> M["Model (w, b)"]
    M --> P["Predictions"]
    P --> L["Loss Function"]
    L --> U["Update Weights"]
    U --> M

    style D fill:#0ea5e9,color:#fff
    style M fill:#7c3aed,color:#fff
    style L fill:#ef4444,color:#fff
    style U fill:#22c55e,color:#fff
\`\`\`

### Key Takeaway

Linear regression is the foundation of all supervised learning. The concepts of weights, bias, loss functions, and gradient descent appear in every model from logistic regression to deep neural networks.

### Further Reading

- Bishop, C. (2006). *Pattern Recognition and Machine Learning*, Chapter 3.
- Hastie, T., Tibshirani, R., & Friedman, J. (2009). *The Elements of Statistical Learning*, Chapter 3.`,
    },
    {
      id: "aiml-linear-regression-exercise",
      slug: "linear-regression-exercise",
      title: "Exercise: Implement Linear Regression",
      content: `## Exercise: Implement Linear Regression

Build a complete linear regression model from scratch using only NumPy. You will implement the forward pass, loss computation, gradient calculation, and training loop.

### The Algorithm

1. **Initialize** weights and bias to zeros (or small random values)
2. **Forward pass**: Compute predictions y_hat = X @ w + b
3. **Loss**: Compute MSE = mean((y - y_hat)^2)
4. **Gradients**: Compute dw = (-2/n) * X.T @ (y - y_hat) and db = (-2/n) * sum(y - y_hat)
5. **Update**: w = w - lr * dw, b = b - lr * db
6. **Repeat** for many epochs

### Gradient Derivation

The gradient of MSE with respect to w:
- dL/dw = (-2/n) * X^T * (y - y_hat)
- dL/db = (-2/n) * sum(y - y_hat)

These tell us the direction to adjust each parameter to reduce the loss.

### Hints

- Use \`np.dot()\` or \`@\` for matrix multiplication
- Initialize w as \`np.zeros(n_features)\`
- Track loss over epochs to verify convergence`,
      starterCode: `import numpy as np

class LinearRegression:
    """Linear Regression using gradient descent."""

    def __init__(self, learning_rate=0.01, n_epochs=1000):
        self.lr = learning_rate
        self.n_epochs = n_epochs
        self.weights = None
        self.bias = None
        self.losses = []

    def fit(self, X, y):
        """Train the model using gradient descent.

        Args:
            X: numpy array of shape (n_samples, n_features)
            y: numpy array of shape (n_samples,)
        """
        n_samples, n_features = X.shape

        # TODO: Initialize weights to zeros and bias to 0
        pass

        for epoch in range(self.n_epochs):
            # TODO: Forward pass - compute predictions
            y_hat = None

            # TODO: Compute MSE loss
            loss = None
            self.losses.append(loss)

            # TODO: Compute gradients
            dw = None
            db = None

            # TODO: Update parameters
            pass

    def predict(self, X):
        """Predict target values for input X.

        Args:
            X: numpy array of shape (n_samples, n_features)
        Returns:
            numpy array of predictions
        """
        # TODO: Return predictions using learned weights and bias
        pass

def mse(y_true, y_pred):
    """Compute Mean Squared Error.

    Args:
        y_true, y_pred: numpy arrays of same shape
    Returns:
        float: mean squared error
    """
    # TODO: Implement MSE
    pass

# Test cases
np.random.seed(42)
X = np.random.randn(100, 1)
y = 3.0 * X.squeeze() + 2.0 + np.random.randn(100) * 0.1

model = LinearRegression(learning_rate=0.1, n_epochs=500)
model.fit(X, y)
preds = model.predict(X)

print(f"Learned weight: {model.weights[0]:.4f}")
# Expected: ~3.0 (close to true weight of 3.0)

print(f"Learned bias: {model.bias:.4f}")
# Expected: ~2.0 (close to true bias of 2.0)

print(f"Final MSE: {model.losses[-1]:.4f}")
# Expected: ~0.01 (small, close to noise level)

print(f"MSE function: {mse(y, preds):.4f}")
# Expected: same as final loss`,
      solutionCode: `import numpy as np

class LinearRegression:
    """Linear Regression using gradient descent."""

    def __init__(self, learning_rate=0.01, n_epochs=1000):
        self.lr = learning_rate
        self.n_epochs = n_epochs
        self.weights = None
        self.bias = None
        self.losses = []

    def fit(self, X, y):
        """Train the model using gradient descent.

        Args:
            X: numpy array of shape (n_samples, n_features)
            y: numpy array of shape (n_samples,)
        """
        n_samples, n_features = X.shape

        # Initialize weights to zeros and bias to 0
        self.weights = np.zeros(n_features)
        self.bias = 0.0

        for epoch in range(self.n_epochs):
            # Forward pass - compute predictions
            y_hat = X @ self.weights + self.bias

            # Compute MSE loss
            loss = np.mean((y - y_hat) ** 2)
            self.losses.append(loss)

            # Compute gradients
            dw = (-2 / n_samples) * (X.T @ (y - y_hat))
            db = (-2 / n_samples) * np.sum(y - y_hat)

            # Update parameters
            self.weights -= self.lr * dw
            self.bias -= self.lr * db

    def predict(self, X):
        """Predict target values for input X.

        Args:
            X: numpy array of shape (n_samples, n_features)
        Returns:
            numpy array of predictions
        """
        return X @ self.weights + self.bias

def mse(y_true, y_pred):
    """Compute Mean Squared Error.

    Args:
        y_true, y_pred: numpy arrays of same shape
    Returns:
        float: mean squared error
    """
    return np.mean((y_true - y_pred) ** 2)

# Time complexity: O(n_epochs * n_samples * n_features) for training
# Space complexity: O(n_features) for weights + O(n_epochs) for loss history

# Test cases
np.random.seed(42)
X = np.random.randn(100, 1)
y = 3.0 * X.squeeze() + 2.0 + np.random.randn(100) * 0.1

model = LinearRegression(learning_rate=0.1, n_epochs=500)
model.fit(X, y)
preds = model.predict(X)

print(f"Learned weight: {model.weights[0]:.4f}")
# Expected: ~3.0 (close to true weight of 3.0)

print(f"Learned bias: {model.bias:.4f}")
# Expected: ~2.0 (close to true bias of 2.0)

print(f"Final MSE: {model.losses[-1]:.4f}")
# Expected: ~0.01 (small, close to noise level)

print(f"MSE function: {mse(y, preds):.4f}")
# Expected: same as final loss`,
    },
    {
      id: "aiml-logistic-regression",
      slug: "logistic-regression",
      title: "Logistic Regression & Classification",
      content: `## Logistic Regression & Classification

<!-- voice:section_check -->

What if the output is not a continuous number but a **category**? This is classification, and logistic regression is the simplest approach.

### From Regression to Classification

Linear regression outputs any real number. For classification (e.g., spam vs. not spam), we need a probability between 0 and 1. The **sigmoid function** does this:

\`\`\`python
def sigmoid(z):
    return 1 / (1 + np.exp(-z))
\`\`\`

The sigmoid squashes any real number into the range (0, 1):
- Large positive z -> sigmoid(z) approaches 1
- Large negative z -> sigmoid(z) approaches 0
- z = 0 -> sigmoid(z) = 0.5

### The Model

\`\`\`
z = w * x + b           # linear part (same as regression)
p = sigmoid(z)           # probability of class 1
prediction = 1 if p >= 0.5 else 0
\`\`\`

### Binary Cross-Entropy Loss

MSE does not work well for classification. Instead, we use **binary cross-entropy**:

\`\`\`
L = -(1/n) * sum(y*log(p) + (1-y)*log(1-p))
\`\`\`

<!-- voice:key_insight -->

Why this loss function?
- When y=1 and p is near 1: loss is near 0 (correct, confident)
- When y=1 and p is near 0: loss is very large (wrong, confident = bad!)
- This creates a strong gradient signal for wrong predictions

### The Decision Boundary

Logistic regression creates a **linear decision boundary** — a line (or hyperplane) that separates the classes. Points on one side are predicted as class 0, points on the other as class 1.

### Evaluation Metrics for Classification

Accuracy alone can be misleading (e.g., 99% accuracy on a dataset where 99% of samples are class 0). Better metrics:

| Metric | Formula | When to Use |
|--------|---------|-------------|
| **Accuracy** | (TP + TN) / Total | Balanced classes |
| **Precision** | TP / (TP + FP) | Cost of false positives is high |
| **Recall** | TP / (TP + FN) | Cost of false negatives is high |
| **F1 Score** | 2 * (P * R) / (P + R) | Imbalanced classes |

### Key Takeaway

Logistic regression adds a sigmoid activation to linear regression, converting continuous output into a probability. It is fast, interpretable, and often a strong baseline before trying complex models.

### Reflection Questions

- Why does MSE not work well as a loss function for classification?
- In what scenarios would you prioritize recall over precision?`,
    },
    {
      id: "aiml-logistic-regression-exercise",
      slug: "logistic-regression-exercise",
      title: "Exercise: Implement Logistic Regression",
      content: `## Exercise: Implement Logistic Regression

Build a binary classifier from scratch. This exercise reinforces the sigmoid function, cross-entropy loss, and gradient descent for classification.

### The Algorithm

1. Compute z = X @ w + b (linear combination)
2. Apply sigmoid: p = 1 / (1 + exp(-z))
3. Compute binary cross-entropy loss
4. Compute gradients (same form as linear regression but with sigmoid output)
5. Update weights and bias

### Hints

- Clip predictions to avoid log(0): use \`np.clip(p, 1e-7, 1 - 1e-7)\`
- Gradients: dw = (1/n) * X.T @ (p - y), db = (1/n) * sum(p - y)
- These gradients look identical to linear regression because the sigmoid derivative cancels elegantly`,
      starterCode: `import numpy as np

def sigmoid(z):
    """Compute the sigmoid function.

    Args:
        z: numpy array of any shape
    Returns:
        numpy array: sigmoid applied element-wise
    """
    # TODO: Return 1 / (1 + exp(-z))
    pass

def binary_cross_entropy(y_true, y_pred):
    """Compute binary cross-entropy loss.

    Args:
        y_true: numpy array of 0s and 1s
        y_pred: numpy array of probabilities
    Returns:
        float: mean binary cross-entropy
    """
    # TODO: Clip y_pred to avoid log(0)
    # TODO: Compute -mean(y*log(p) + (1-y)*log(1-p))
    pass

class LogisticRegression:
    """Logistic Regression binary classifier."""

    def __init__(self, learning_rate=0.1, n_epochs=1000):
        self.lr = learning_rate
        self.n_epochs = n_epochs
        self.weights = None
        self.bias = None

    def fit(self, X, y):
        """Train using gradient descent.

        Args:
            X: shape (n_samples, n_features)
            y: shape (n_samples,) with values 0 or 1
        """
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)
        self.bias = 0.0

        for epoch in range(self.n_epochs):
            # TODO: Forward pass (linear + sigmoid)
            z = None
            p = None

            # TODO: Compute gradients
            dw = None
            db = None

            # TODO: Update parameters
            pass

    def predict_proba(self, X):
        """Return probability of class 1."""
        # TODO: Compute sigmoid(X @ w + b)
        pass

    def predict(self, X, threshold=0.5):
        """Return class labels (0 or 1)."""
        # TODO: Return 1 where probability >= threshold, else 0
        pass

def accuracy(y_true, y_pred):
    """Compute classification accuracy."""
    # TODO: fraction of correct predictions
    pass

# Test cases
np.random.seed(42)
X = np.random.randn(200, 2)
y = (X[:, 0] + X[:, 1] > 0).astype(float)

model = LogisticRegression(learning_rate=0.5, n_epochs=1000)
model.fit(X, y)

preds = model.predict(X)
print(f"Accuracy: {accuracy(y, preds):.4f}")
# Expected: > 0.95

proba = model.predict_proba(np.array([[2.0, 2.0]]))
print(f"P(class=1 | [2,2]): {proba[0]:.4f}")
# Expected: > 0.95 (clearly positive)

proba = model.predict_proba(np.array([[-2.0, -2.0]]))
print(f"P(class=1 | [-2,-2]): {proba[0]:.4f}")
# Expected: < 0.05 (clearly negative)

print(f"BCE loss: {binary_cross_entropy(y, model.predict_proba(X)):.4f}")
# Expected: < 0.2`,
      solutionCode: `import numpy as np

def sigmoid(z):
    """Compute the sigmoid function.

    Args:
        z: numpy array of any shape
    Returns:
        numpy array: sigmoid applied element-wise
    """
    return 1 / (1 + np.exp(-z))

def binary_cross_entropy(y_true, y_pred):
    """Compute binary cross-entropy loss.

    Args:
        y_true: numpy array of 0s and 1s
        y_pred: numpy array of probabilities
    Returns:
        float: mean binary cross-entropy
    """
    y_pred = np.clip(y_pred, 1e-7, 1 - 1e-7)
    return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))

class LogisticRegression:
    """Logistic Regression binary classifier."""

    def __init__(self, learning_rate=0.1, n_epochs=1000):
        self.lr = learning_rate
        self.n_epochs = n_epochs
        self.weights = None
        self.bias = None

    def fit(self, X, y):
        """Train using gradient descent.

        Args:
            X: shape (n_samples, n_features)
            y: shape (n_samples,) with values 0 or 1
        """
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)
        self.bias = 0.0

        for epoch in range(self.n_epochs):
            # Forward pass (linear + sigmoid)
            z = X @ self.weights + self.bias
            p = sigmoid(z)

            # Compute gradients
            dw = (1 / n_samples) * (X.T @ (p - y))
            db = (1 / n_samples) * np.sum(p - y)

            # Update parameters
            self.weights -= self.lr * dw
            self.bias -= self.lr * db

    def predict_proba(self, X):
        """Return probability of class 1."""
        return sigmoid(X @ self.weights + self.bias)

    def predict(self, X, threshold=0.5):
        """Return class labels (0 or 1)."""
        return (self.predict_proba(X) >= threshold).astype(int)

def accuracy(y_true, y_pred):
    """Compute classification accuracy."""
    return np.mean(y_true == y_pred)

# Time complexity: O(n_epochs * n_samples * n_features)
# Space complexity: O(n_features) for weights

# Test cases
np.random.seed(42)
X = np.random.randn(200, 2)
y = (X[:, 0] + X[:, 1] > 0).astype(float)

model = LogisticRegression(learning_rate=0.5, n_epochs=1000)
model.fit(X, y)

preds = model.predict(X)
print(f"Accuracy: {accuracy(y, preds):.4f}")
# Expected: > 0.95

proba = model.predict_proba(np.array([[2.0, 2.0]]))
print(f"P(class=1 | [2,2]): {proba[0]:.4f}")
# Expected: > 0.95 (clearly positive)

proba = model.predict_proba(np.array([[-2.0, -2.0]]))
print(f"P(class=1 | [-2,-2]): {proba[0]:.4f}")
# Expected: < 0.05 (clearly negative)

print(f"BCE loss: {binary_cross_entropy(y, model.predict_proba(X)):.4f}")
# Expected: < 0.2`,
    },
    {
      id: "aiml-supervised-checkpoint",
      slug: "supervised-learning-checkpoint",
      title: "Checkpoint: Supervised Learning",
      content: `## Checkpoint: Supervised Learning

<!-- voice:section_check -->

Test your understanding of supervised learning fundamentals before we move on to neural networks.

---

### Question 1
In linear regression, what does the Mean Squared Error (MSE) loss function penalize most heavily?

A) Small errors close to zero
B) Large errors far from the true value
C) Errors exactly equal to the true value
D) Negative predictions

**Answer: B** — MSE squares the errors, so large deviations from the true value contribute disproportionately to the loss. A single prediction off by 10 contributes 100 to the sum of squares, while ten predictions off by 1 contribute only 10 total.

---

### Question 2
What happens if the learning rate in gradient descent is too large?

A) Training will be very slow but converge to the optimal solution
B) The model will underfit the data
C) The loss may oscillate or diverge instead of decreasing
D) The model will overfit the training data

**Answer: C** — A learning rate that is too large causes the parameter updates to overshoot the minimum, leading to oscillation or even divergence where the loss increases over time.

---

### Question 3
Why does logistic regression use binary cross-entropy instead of MSE as its loss function?

A) Cross-entropy is faster to compute
B) MSE creates a non-convex loss landscape with many local minima when combined with sigmoid
C) Cross-entropy only works with neural networks
D) MSE cannot handle binary labels

**Answer: B** — When MSE is combined with the sigmoid function, the resulting loss landscape has flat regions (vanishing gradients) and local minima. Binary cross-entropy creates a convex loss landscape for logistic regression, guaranteeing convergence to the global minimum.

---

### Question 4
A medical test for a rare disease has 99% accuracy. Out of 10,000 patients, 100 actually have the disease. A model that always predicts "no disease" achieves what accuracy?

A) 1%
B) 50%
C) 99%
D) 100%

**Answer: C** — With 9,900 healthy patients and 100 sick patients, predicting "no disease" for everyone yields 9,900/10,000 = 99% accuracy. This is why accuracy alone is misleading for imbalanced datasets — you need precision, recall, and F1.

---

### Question 5
The gradient dw = (-2/n) * X.T @ (y - y_hat) points in which direction?

A) Toward the loss minimum
B) Away from the loss minimum (steepest ascent)
C) Along the decision boundary
D) Perpendicular to the data distribution

**Answer: B** — The gradient points in the direction of steepest ascent (increasing loss). That is why we *subtract* the gradient during updates: w = w - lr * dw. We go in the opposite direction of the gradient to descend toward the minimum.`,
    },
  ],
};
