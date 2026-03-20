import { Module } from "../types";

export const capstoneClassifierModule: Module = {
  id: "aiml-capstone",
  title: "Capstone: Build a Classifier",
  description:
    "Bring everything together by building a complete binary classifier from scratch using only NumPy. Apply data preprocessing, model training, evaluation, and analysis to a real classification task.",
  lessons: [
    {
      id: "aiml-capstone-overview",
      slug: "capstone-overview",
      title: "Capstone Project Overview",
      content: `## Capstone Project Overview

<!-- voice:section_check -->

You have learned the foundations of AI and ML across seven modules. Now it is time to prove your skills by building a complete machine learning pipeline from scratch.

### The Challenge

Build a **binary classifier** that predicts whether a tumor is malignant or benign based on numerical features. You will implement everything using only NumPy — no scikit-learn, no TensorFlow, no PyTorch.

### What You Will Build

1. **Data preprocessing**: Normalize features, split into train/test sets
2. **Model**: A 2-layer neural network with ReLU hidden layer and sigmoid output
3. **Training**: Backpropagation with gradient descent, loss tracking
4. **Evaluation**: Accuracy, precision, recall, F1 score, confusion matrix

### Architecture

\`\`\`
Input (n_features) -> Hidden (16 neurons, ReLU) -> Output (1 neuron, sigmoid)
\`\`\`

### Why This Matters

This capstone demonstrates that you understand every component:
- How data flows through a neural network (Module 3)
- How backpropagation computes gradients (Module 4)
- How loss functions guide learning (Module 2)
- How evaluation metrics reveal model quality (Module 2)
- How regularization prevents overfitting (Module 4)

<!-- voice:key_insight -->

\`\`\`mermaid
graph LR
    PROB["Define Problem"] --> DATA["Collect Data"]
    DATA --> PRE["Preprocessing"]
    PRE --> SEL["Model Selection"]
    SEL --> TRAIN["Training"]
    TRAIN --> EVAL["Evaluation"]
    EVAL -->|Iterate| SEL
    EVAL --> DEP["Deployment"]

    style PROB fill:#0ea5e9,color:#fff
    style DATA fill:#7c3aed,color:#fff
    style PRE fill:#a855f7,color:#fff
    style TRAIN fill:#f59e0b,color:#fff
    style EVAL fill:#22c55e,color:#fff
    style DEP fill:#ef4444,color:#fff
\`\`\`

### Synthetic Data

We will generate synthetic tumor data with features that mimic real medical datasets:
- Feature 1: Cell radius (correlated with malignancy)
- Feature 2: Cell texture (moderately correlated)
- Feature 3: Cell perimeter (highly correlated with radius)
- Feature 4: Cell smoothness (weak signal)

The data has realistic noise and class overlap, making it a genuine classification challenge.

### Grading Criteria

Your classifier should achieve:
- **Accuracy > 90%** on the test set
- **Recall > 85%** (missing a malignant tumor is worse than a false alarm)
- Converging loss curve (loss should decrease over epochs)

### Reflection Questions

- Why is recall more important than precision in medical diagnosis?
- What regularization technique would you consider if the model overfits?`,
    },
    {
      id: "aiml-capstone-exercise",
      slug: "capstone-exercise",
      title: "Exercise: Build the Classifier",
      content: `## Exercise: Build the Classifier

This is the capstone exercise. Implement a complete ML pipeline: data generation, preprocessing, model, training, and evaluation. Use only NumPy.

### Steps

1. Generate synthetic data with 4 features and 2 classes
2. Normalize features to zero mean, unit variance
3. Split into 80% train / 20% test
4. Build and train a 2-layer neural network
5. Evaluate with accuracy, precision, recall, F1

### Hints

- Use He initialization for ReLU layers
- Learning rate around 0.1, train for 2000+ epochs
- Monitor loss to verify convergence
- Use np.clip to avoid log(0) in cross-entropy`,
      starterCode: `import numpy as np

# ============ DATA GENERATION ============

def generate_data(n_samples=500, seed=42):
    """Generate synthetic binary classification data.

    Returns:
        X: shape (n_samples, 4) - features
        y: shape (n_samples, 1) - labels (0 or 1)
    """
    np.random.seed(seed)
    # Class 0: benign
    n0 = n_samples // 2
    X0 = np.random.randn(n0, 4) * 0.8 + np.array([1, 0.5, 1.2, 0])
    # Class 1: malignant
    n1 = n_samples - n0
    X1 = np.random.randn(n1, 4) * 0.8 + np.array([3, 1.5, 3.5, 0.5])
    X = np.vstack([X0, X1])
    y = np.vstack([np.zeros((n0, 1)), np.ones((n1, 1))])
    # Shuffle
    idx = np.random.permutation(n_samples)
    return X[idx], y[idx]

# ============ PREPROCESSING ============

def normalize(X_train, X_test):
    """Normalize features to zero mean, unit variance.
    Fit on train, apply to both.

    Args:
        X_train, X_test: numpy arrays
    Returns:
        tuple: (normalized X_train, normalized X_test)
    """
    # TODO: Compute mean and std from X_train
    # TODO: Apply (X - mean) / std to both sets
    pass

def train_test_split(X, y, test_ratio=0.2, seed=42):
    """Split data into train and test sets.

    Args:
        X, y: data arrays
        test_ratio: fraction for test set
    Returns:
        tuple: (X_train, X_test, y_train, y_test)
    """
    # TODO: Compute split index, split arrays
    pass

# ============ MODEL ============

def sigmoid(z):
    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

def relu(z):
    return np.maximum(0, z)

class BinaryClassifier:
    """2-layer neural network for binary classification."""

    def __init__(self, n_features, n_hidden=16, lr=0.1):
        self.lr = lr
        np.random.seed(42)
        self.W1 = np.random.randn(n_features, n_hidden) * np.sqrt(2.0 / n_features)
        self.b1 = np.zeros((1, n_hidden))
        self.W2 = np.random.randn(n_hidden, 1) * np.sqrt(2.0 / n_hidden)
        self.b2 = np.zeros((1, 1))

    def forward(self, X):
        """Forward pass. Store intermediates."""
        # TODO: Compute z1, a1 (ReLU), z2, a2 (sigmoid)
        pass

    def backward(self, X, y):
        """Backward pass with gradient descent update."""
        n = X.shape[0]
        # TODO: Compute gradients for W2, b2, W1, b1
        # TODO: Update all parameters
        pass

    def train(self, X, y, epochs=2000):
        """Train and return loss history."""
        losses = []
        for epoch in range(epochs):
            # TODO: Forward, compute loss, backward
            pass
        return losses

    def predict(self, X):
        """Return binary predictions (0 or 1)."""
        # TODO: Forward pass, threshold at 0.5
        pass

    def predict_proba(self, X):
        """Return probability of class 1."""
        # TODO: Forward pass, return probabilities
        pass

# ============ EVALUATION ============

def confusion_matrix(y_true, y_pred):
    """Compute confusion matrix values.

    Returns:
        tuple: (true_positives, false_positives, true_negatives, false_negatives)
    """
    # TODO: Count TP, FP, TN, FN
    pass

def evaluate(y_true, y_pred):
    """Compute accuracy, precision, recall, F1.

    Returns:
        dict with keys: accuracy, precision, recall, f1
    """
    # TODO: Use confusion_matrix to compute all metrics
    pass

# ============ MAIN PIPELINE ============

# Generate data
X, y = generate_data(500)
print(f"Data shape: {X.shape}, Labels shape: {y.shape}")

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y)
print(f"Train: {X_train.shape}, Test: {X_test.shape}")

# Normalize
X_train, X_test = normalize(X_train, X_test)

# Train
model = BinaryClassifier(n_features=4, n_hidden=16, lr=0.1)
losses = model.train(X_train, y_train, epochs=2000)

# Evaluate
preds = model.predict(X_test)
metrics = evaluate(y_test, preds)

print(f"\\nFinal loss: {losses[-1]:.4f}")
print(f"Accuracy:  {metrics['accuracy']:.4f}")
print(f"Precision: {metrics['precision']:.4f}")
print(f"Recall:    {metrics['recall']:.4f}")
print(f"F1 Score:  {metrics['f1']:.4f}")

# Expected: Accuracy > 0.90, Recall > 0.85
print(f"\\nLoss converged: {losses[-1] < losses[0]}")
# Expected: True`,
      solutionCode: `import numpy as np

# ============ DATA GENERATION ============

def generate_data(n_samples=500, seed=42):
    """Generate synthetic binary classification data."""
    np.random.seed(seed)
    n0 = n_samples // 2
    X0 = np.random.randn(n0, 4) * 0.8 + np.array([1, 0.5, 1.2, 0])
    n1 = n_samples - n0
    X1 = np.random.randn(n1, 4) * 0.8 + np.array([3, 1.5, 3.5, 0.5])
    X = np.vstack([X0, X1])
    y = np.vstack([np.zeros((n0, 1)), np.ones((n1, 1))])
    idx = np.random.permutation(n_samples)
    return X[idx], y[idx]

# ============ PREPROCESSING ============

def normalize(X_train, X_test):
    """Normalize features to zero mean, unit variance. Fit on train, apply to both."""
    mean = np.mean(X_train, axis=0)
    std = np.std(X_train, axis=0) + 1e-8
    return (X_train - mean) / std, (X_test - mean) / std

def train_test_split(X, y, test_ratio=0.2, seed=42):
    """Split data into train and test sets."""
    n = X.shape[0]
    split = int(n * (1 - test_ratio))
    return X[:split], X[split:], y[:split], y[split:]

# ============ MODEL ============

def sigmoid(z):
    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

def relu(z):
    return np.maximum(0, z)

class BinaryClassifier:
    """2-layer neural network for binary classification."""

    def __init__(self, n_features, n_hidden=16, lr=0.1):
        self.lr = lr
        np.random.seed(42)
        self.W1 = np.random.randn(n_features, n_hidden) * np.sqrt(2.0 / n_features)
        self.b1 = np.zeros((1, n_hidden))
        self.W2 = np.random.randn(n_hidden, 1) * np.sqrt(2.0 / n_hidden)
        self.b2 = np.zeros((1, 1))

    def forward(self, X):
        """Forward pass. Store intermediates."""
        self.z1 = X @ self.W1 + self.b1
        self.a1 = relu(self.z1)
        self.z2 = self.a1 @ self.W2 + self.b2
        self.a2 = sigmoid(self.z2)
        return self.a2

    def backward(self, X, y):
        """Backward pass with gradient descent update."""
        n = X.shape[0]
        # Output layer
        dz2 = self.a2 - y
        dW2 = (1 / n) * self.a1.T @ dz2
        db2 = (1 / n) * np.sum(dz2, axis=0, keepdims=True)
        # Hidden layer
        da1 = dz2 @ self.W2.T
        dz1 = da1 * (self.z1 > 0)
        dW1 = (1 / n) * X.T @ dz1
        db1 = (1 / n) * np.sum(dz1, axis=0, keepdims=True)
        # Update
        self.W2 -= self.lr * dW2
        self.b2 -= self.lr * db2
        self.W1 -= self.lr * dW1
        self.b1 -= self.lr * db1

    def train(self, X, y, epochs=2000):
        """Train and return loss history."""
        losses = []
        for epoch in range(epochs):
            output = self.forward(X)
            eps = 1e-7
            loss = -np.mean(y * np.log(output + eps) + (1 - y) * np.log(1 - output + eps))
            losses.append(loss)
            self.backward(X, y)
        return losses

    def predict(self, X):
        """Return binary predictions (0 or 1)."""
        return (self.forward(X) >= 0.5).astype(int)

    def predict_proba(self, X):
        """Return probability of class 1."""
        return self.forward(X)

# ============ EVALUATION ============

def confusion_matrix(y_true, y_pred):
    """Compute confusion matrix values."""
    tp = np.sum((y_true == 1) & (y_pred == 1))
    fp = np.sum((y_true == 0) & (y_pred == 1))
    tn = np.sum((y_true == 0) & (y_pred == 0))
    fn = np.sum((y_true == 1) & (y_pred == 0))
    return tp, fp, tn, fn

def evaluate(y_true, y_pred):
    """Compute accuracy, precision, recall, F1."""
    tp, fp, tn, fn = confusion_matrix(y_true, y_pred)
    accuracy = (tp + tn) / (tp + fp + tn + fn)
    precision = tp / (tp + fp + 1e-8)
    recall = tp / (tp + fn + 1e-8)
    f1 = 2 * precision * recall / (precision + recall + 1e-8)
    return {"accuracy": accuracy, "precision": precision, "recall": recall, "f1": f1}

# Time complexity: O(epochs * n_train * n_hidden * n_features)
# Space complexity: O(n_train * n_hidden) for activations

# ============ MAIN PIPELINE ============

# Generate data
X, y = generate_data(500)
print(f"Data shape: {X.shape}, Labels shape: {y.shape}")

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y)
print(f"Train: {X_train.shape}, Test: {X_test.shape}")

# Normalize
X_train, X_test = normalize(X_train, X_test)

# Train
model = BinaryClassifier(n_features=4, n_hidden=16, lr=0.1)
losses = model.train(X_train, y_train, epochs=2000)

# Evaluate
preds = model.predict(X_test)
metrics = evaluate(y_test, preds)

print(f"\\nFinal loss: {losses[-1]:.4f}")
print(f"Accuracy:  {metrics['accuracy']:.4f}")
print(f"Precision: {metrics['precision']:.4f}")
print(f"Recall:    {metrics['recall']:.4f}")
print(f"F1 Score:  {metrics['f1']:.4f}")

# Expected: Accuracy > 0.90, Recall > 0.85
print(f"\\nLoss converged: {losses[-1] < losses[0]}")
# Expected: True`,
    },
    {
      id: "aiml-capstone-checkpoint",
      slug: "capstone-checkpoint",
      title: "Checkpoint: Capstone Review",
      content: `## Checkpoint: Capstone Review

<!-- voice:section_check -->

Congratulations on completing the AI & Machine Learning Fundamentals course! Let us review the key concepts from across all modules.

---

### Question 1
You built a classifier that achieves 95% accuracy on training data but only 70% on test data. Which technique would most likely help?

A) Increasing the learning rate
B) Adding more hidden layers
C) Applying L2 regularization or dropout to reduce overfitting
D) Training for more epochs

**Answer: C** — The large gap between training and test performance indicates overfitting. Regularization techniques like L2 (weight decay) or dropout prevent the model from memorizing the training data. Adding more layers or training longer would likely worsen overfitting.

---

### Question 2
In your capstone classifier, why do we normalize features to zero mean and unit variance?

A) To make the model run faster
B) To ensure all features contribute equally to the initial gradients, preventing features with large scales from dominating
C) To convert categorical features to numerical ones
D) To reduce the number of features

**Answer: B** — Without normalization, a feature ranging from 0-1000 would dominate gradients compared to one ranging from 0-1. Normalization ensures all features start on equal footing, leading to more stable and faster training.

---

### Question 3
Why do we fit normalization parameters (mean, std) on the training set only, then apply them to the test set?

A) To save computation time
B) To prevent information leakage — the test set simulates unseen data that should not influence preprocessing
C) The test set is too small to compute reliable statistics
D) It makes no difference either way

**Answer: B** — If we compute mean and std using the full dataset (including test), we leak information about the test set into our preprocessing. In production, we will not have access to future data when preprocessing, so we must simulate this during evaluation.

---

### Question 4
In a medical diagnosis context, why might you optimize for recall rather than precision?

A) Recall is always a better metric
B) Missing a true positive (failing to detect a disease) is typically more dangerous than a false alarm
C) Recall is easier to compute
D) Precision requires more data

**Answer: B** — In medical diagnosis, a false negative (missing a malignant tumor) can be life-threatening, while a false positive (unnecessary follow-up test) is inconvenient but not dangerous. Optimizing for recall ensures we catch as many true cases as possible.

---

### Question 5
Rank these AI concepts in the order you would explain them to a complete beginner:

A) Backpropagation -> Gradient Descent -> Linear Regression -> Neural Networks
B) Linear Regression -> Gradient Descent -> Neural Networks -> Backpropagation
C) Neural Networks -> Linear Regression -> Backpropagation -> Gradient Descent
D) Gradient Descent -> Backpropagation -> Linear Regression -> Neural Networks

**Answer: B** — The natural learning progression builds from simple to complex: Linear Regression (simplest model) -> Gradient Descent (how to train it) -> Neural Networks (more powerful models) -> Backpropagation (how to train neural networks). Each concept builds on the previous one.`,
    },
  ],
};
