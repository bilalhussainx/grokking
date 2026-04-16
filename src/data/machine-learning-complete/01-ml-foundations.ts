import { Module } from "../types";

export const module1: Module = {
  id: "ml-foundations",
  title: "Machine Learning Foundations",
  description: "Supervised vs unsupervised, bias-variance tradeoff, the learning process, and how gradient descent actually works",
  lessons: [
    {
      id: "ml-taxonomy",
      slug: "ml-taxonomy",
      title: "The ML Landscape: Types, Tasks & the Learning Process",
      content: `# Machine Learning Foundations

Machine learning is the practice of getting computers to learn from data instead of following explicit rules. Understanding the taxonomy is the foundation.

---

\`\`\`concept
{
  "title": "What Does 'Learning' Mean in ML?",
  "variant": "mental-model",
  "content": "An ML model 'learns' by adjusting parameters (weights) to minimize a loss function — a measure of how wrong its predictions are. Training is numerical optimization: find the parameter values that make the model's predictions as close to reality as possible on the training set, while generalizing to unseen data."
}
\`\`\`

---

## The ML Taxonomy

\`\`\`compare
{
  "title": "Types of Machine Learning",
  "items": [
    {
      "name": "Supervised Learning",
      "description": "Labeled training data (X, y). Model learns to map X → y. Classification: predict category (spam/not-spam, cat/dog). Regression: predict continuous value (price, temperature). Most common in industry."
    },
    {
      "name": "Unsupervised Learning",
      "description": "No labels — just X. Find structure in data. Clustering (K-means, DBSCAN): group similar data. Dimensionality reduction (PCA, t-SNE): compress while preserving structure. Anomaly detection."
    },
    {
      "name": "Reinforcement Learning",
      "description": "Agent takes actions in environment, receives rewards/penalties. Learns policy that maximizes cumulative reward. Powers: game AI (AlphaGo), robotics, recommendation systems."
    },
    {
      "name": "Self-Supervised / Foundation Models",
      "description": "Train on unlabeled data with a pretext task (predict next word, fill in masked text). Learns rich representations. Basis of modern LLMs (GPT, BERT, LLaMA)."
    }
  ]
}
\`\`\`

## The Bias-Variance Tradeoff

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score

np.random.seed(42)
X = np.sort(np.random.rand(30, 1) * 10, axis=0)
y = np.sin(X).ravel() + np.random.randn(30) * 0.3   # True function + noise

fig, axes = plt.subplots(1, 3, figsize=(15, 4))
degrees = [1, 3, 15]  # underfit, good, overfit

for i, deg in enumerate(degrees):
    model = make_pipeline(PolynomialFeatures(deg), LinearRegression())
    model.fit(X, y)

    X_test = np.linspace(0, 10, 200).reshape(-1, 1)
    axes[i].scatter(X, y, alpha=0.5, label='Data')
    axes[i].plot(X_test, model.predict(X_test), 'r-', label=f'Degree {deg}')
    axes[i].set_title(
        'Underfitting (high bias)' if deg == 1
        else 'Good fit' if deg == 3
        else 'Overfitting (high variance)'
    )
    axes[i].legend()

plt.tight_layout()
plt.show()

# Bias-variance decomposition:
# Total Error = Bias² + Variance + Irreducible Noise
# Bias: model too simple to capture true pattern (underfitting)
# Variance: model memorizes training data, fails on new data (overfitting)
# Trade-off: increasing complexity ↓ bias but ↑ variance
\`\`\`

## How Gradient Descent Works

\`\`\`python
# Gradient Descent: move parameters in the direction that reduces loss
# Loss function: L(w) — how wrong are we?
# Gradient: dL/dw — which direction increases loss?
# Update rule: w = w - learning_rate * dL/dw

# --- Simple example: linear regression from scratch ---
np.random.seed(42)
X = 2 * np.random.rand(100, 1)
y = 4 + 3 * X + np.random.randn(100, 1)  # true: y = 4 + 3x + noise

# Initialize weights randomly:
w0, w1 = np.random.randn(), np.random.randn()
lr = 0.1
n = len(X)

losses = []
for epoch in range(1000):
    # Forward pass:
    y_pred = w0 + w1 * X.ravel()

    # Compute MSE loss:
    loss = np.mean((y_pred - y.ravel()) ** 2)
    losses.append(loss)

    # Compute gradients:
    dL_dw0 = (2/n) * np.sum(y_pred - y.ravel())
    dL_dw1 = (2/n) * np.sum((y_pred - y.ravel()) * X.ravel())

    # Update parameters:
    w0 = w0 - lr * dL_dw0
    w1 = w1 - lr * dL_dw1

print(f"Learned: y = {w0:.2f} + {w1:.2f}x")  # ~y = 4.0 + 3.0x
print(f"True:    y = 4.00 + 3.00x")
\`\`\`

## Variants of Gradient Descent

\`\`\`sysdiag
{
  "type": "compare-table",
  "title": "Gradient Descent Variants",
  "columns": ["Type", "Batch Size", "Update Frequency", "Best For"],
  "rows": [
    ["Batch GD", "All N samples", "Once per epoch", "Convex problems, small datasets"],
    ["Stochastic GD", "1 sample", "N times per epoch", "Large datasets, online learning"],
    ["Mini-batch GD", "32-512 samples", "N/batch_size per epoch", "Modern deep learning (standard)"]
  ]
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "A model has 98% training accuracy and 62% test accuracy. What is the primary problem?",
      "options": [
        "Underfitting — the model is too simple",
        "Overfitting — the model has high variance, memorized training data and doesn't generalize",
        "The dataset is too small to evaluate",
        "The model needs more training epochs"
      ],
      "answer": 1,
      "explanation": "The large gap between training (98%) and test (62%) accuracy is the hallmark of overfitting (high variance). The model memorized the training data — including noise — instead of learning the true underlying pattern. Fixes: more training data, regularization (L1/L2/dropout), simpler model, early stopping, ensemble methods."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
