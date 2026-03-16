import { Module } from "../types";

export const trainingOptimizationModule: Module = {
  id: "aiml-training-optimization",
  title: "Training & Optimization",
  description:
    "Master backpropagation, the chain rule, and modern optimization techniques. Understand overfitting, regularization, and the bias-variance tradeoff that governs every ML model.",
  lessons: [
    {
      id: "aiml-backpropagation",
      slug: "backpropagation",
      title: "Backpropagation Explained",
      content: `## Backpropagation Explained

<!-- voice:section_check -->

Backpropagation is the algorithm that makes neural network training possible. It computes how much each weight contributed to the error, so we know which direction to adjust it.

### The Core Idea: Chain Rule

Backpropagation is just the **chain rule** from calculus applied systematically through the network.

If we have a composition of functions f(g(x)), the derivative is:

\`\`\`
df/dx = (df/dg) * (dg/dx)
\`\`\`

In a neural network: loss depends on output, output depends on hidden activations, hidden activations depend on weights. The chain rule connects them all.

### Step-by-Step for a 2-Layer Network

Given: Input X -> Hidden a1 -> Output a2 -> Loss L

**Step 1: Output layer gradients**
\`\`\`python
dz2 = a2 - y                          # derivative of BCE + sigmoid
dW2 = (1/n) * a1.T @ dz2             # gradient for W2
db2 = (1/n) * np.sum(dz2, axis=0)    # gradient for b2
\`\`\`

**Step 2: Hidden layer gradients** (chain rule!)
\`\`\`python
da1 = dz2 @ W2.T                      # propagate error backward
dz1 = da1 * (z1 > 0)                  # ReLU derivative: 1 if z>0, else 0
dW1 = (1/n) * X.T @ dz1              # gradient for W1
db1 = (1/n) * np.sum(dz1, axis=0)    # gradient for b1
\`\`\`

<!-- voice:key_insight -->

### The ReLU Derivative

ReLU's derivative is beautifully simple:
- If z > 0: derivative = 1 (gradient passes through unchanged)
- If z <= 0: derivative = 0 (gradient is blocked)

This is why \`(z1 > 0)\` appears in the backward pass — it is a binary mask that "gates" the gradient.

### Computational Graph View

Think of the network as a graph of operations. Forward pass computes values left to right. Backward pass computes gradients right to left.

\`\`\`
Forward:  X -> [W1,b1] -> z1 -> [ReLU] -> a1 -> [W2,b2] -> z2 -> [sigmoid] -> a2 -> [loss] -> L
Backward: dX <- dW1,db1 <- dz1 <- dReLU <- da1 <- dW2,db2 <- dz2 <- dsigmoid <- da2 <- dL
\`\`\`

### Vanishing and Exploding Gradients

As networks get deeper, gradients can:
- **Vanish**: Multiply many small numbers (sigmoid derivatives < 0.25) together. Deep layers learn nothing.
- **Explode**: Multiply many large numbers together. Weights diverge to infinity.

Solutions:
- **ReLU activation**: Gradient is 1 for positive inputs
- **Careful initialization**: Xavier/He initialization scales weights appropriately
- **Batch normalization**: Normalizes activations between layers
- **Residual connections**: Skip connections allow gradients to flow directly

### Key Takeaway

Backpropagation is the chain rule applied systematically through the computational graph. Understanding it deeply is essential — every modern deep learning framework (PyTorch, TensorFlow) automates backprop, but knowing what happens under the hood helps you debug training issues.

### Further Reading

- Rumelhart, D., Hinton, G., & Williams, R. (1986). "Learning representations by back-propagating errors." *Nature*, 323, 533-536.
- Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*, Chapter 6.`,
    },
    {
      id: "aiml-backprop-exercise",
      slug: "backprop-exercise",
      title: "Exercise: Backpropagation from Scratch",
      content: `## Exercise: Backpropagation from Scratch

Implement a complete 2-layer neural network with both forward and backward passes. Train it to learn XOR — the problem that stumped single-layer networks.

### Architecture

Input (2) -> Hidden (8 neurons, ReLU) -> Output (1, sigmoid)

### Training Loop

1. Forward pass: compute predictions
2. Compute loss (binary cross-entropy)
3. Backward pass: compute gradients
4. Update weights: w -= lr * dw

### Hints

- XOR data: [[0,0],[0,1],[1,0],[1,1]] with labels [0,1,1,0]
- Use He initialization: W * sqrt(2/n_input) for ReLU layers
- Train for 5000+ epochs with learning rate 0.5-1.0`,
      starterCode: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def relu(z):
    return np.maximum(0, z)

class NeuralNetwork:
    """2-layer neural network for binary classification."""

    def __init__(self, n_input, n_hidden, n_output, lr=0.5):
        self.lr = lr
        np.random.seed(42)
        # He initialization for ReLU
        self.W1 = np.random.randn(n_input, n_hidden) * np.sqrt(2.0 / n_input)
        self.b1 = np.zeros((1, n_hidden))
        self.W2 = np.random.randn(n_hidden, n_output) * np.sqrt(2.0 / n_hidden)
        self.b2 = np.zeros((1, n_output))

    def forward(self, X):
        """Forward pass. Store intermediates for backprop."""
        self.z1 = X @ self.W1 + self.b1
        self.a1 = relu(self.z1)
        self.z2 = self.a1 @ self.W2 + self.b2
        self.a2 = sigmoid(self.z2)
        return self.a2

    def backward(self, X, y):
        """Backward pass. Compute and apply gradients.

        Args:
            X: input data, shape (n_samples, n_features)
            y: labels, shape (n_samples, 1)
        """
        n = X.shape[0]

        # TODO: Output layer gradients
        dz2 = None  # derivative of BCE loss w.r.t. z2
        dW2 = None  # gradient for W2
        db2 = None  # gradient for b2

        # TODO: Hidden layer gradients (chain rule)
        da1 = None  # propagate error backward through W2
        dz1 = None  # apply ReLU derivative
        dW1 = None  # gradient for W1
        db1 = None  # gradient for b1

        # TODO: Update all parameters
        pass

    def train(self, X, y, epochs=5000):
        """Train the network.

        Returns:
            list of losses over epochs
        """
        losses = []
        for epoch in range(epochs):
            # TODO: Forward pass
            output = None

            # TODO: Compute BCE loss
            loss = None
            losses.append(loss)

            # TODO: Backward pass
            pass

        return losses

# Test: Learn XOR
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y = np.array([[0], [1], [1], [0]], dtype=float)

nn = NeuralNetwork(2, 8, 1, lr=1.0)
losses = nn.train(X, y, epochs=5000)

preds = nn.forward(X)
print("XOR predictions:")
for i in range(4):
    print(f"  {X[i]} -> {preds[i][0]:.4f} (expected {y[i][0]:.0f})")

print(f"\\nFinal loss: {losses[-1]:.6f}")
# Expected: < 0.01

print(f"All predictions correct: {all((preds > 0.5).astype(int).flatten() == y.flatten())}")
# Expected: True`,
      solutionCode: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def relu(z):
    return np.maximum(0, z)

class NeuralNetwork:
    """2-layer neural network for binary classification."""

    def __init__(self, n_input, n_hidden, n_output, lr=0.5):
        self.lr = lr
        np.random.seed(42)
        # He initialization for ReLU
        self.W1 = np.random.randn(n_input, n_hidden) * np.sqrt(2.0 / n_input)
        self.b1 = np.zeros((1, n_hidden))
        self.W2 = np.random.randn(n_hidden, n_output) * np.sqrt(2.0 / n_hidden)
        self.b2 = np.zeros((1, n_output))

    def forward(self, X):
        """Forward pass. Store intermediates for backprop."""
        self.z1 = X @ self.W1 + self.b1
        self.a1 = relu(self.z1)
        self.z2 = self.a1 @ self.W2 + self.b2
        self.a2 = sigmoid(self.z2)
        return self.a2

    def backward(self, X, y):
        """Backward pass. Compute and apply gradients."""
        n = X.shape[0]

        # Output layer gradients
        dz2 = self.a2 - y
        dW2 = (1 / n) * self.a1.T @ dz2
        db2 = (1 / n) * np.sum(dz2, axis=0, keepdims=True)

        # Hidden layer gradients (chain rule)
        da1 = dz2 @ self.W2.T
        dz1 = da1 * (self.z1 > 0)  # ReLU derivative
        dW1 = (1 / n) * X.T @ dz1
        db1 = (1 / n) * np.sum(dz1, axis=0, keepdims=True)

        # Update all parameters
        self.W2 -= self.lr * dW2
        self.b2 -= self.lr * db2
        self.W1 -= self.lr * dW1
        self.b1 -= self.lr * db1

    def train(self, X, y, epochs=5000):
        """Train the network."""
        losses = []
        for epoch in range(epochs):
            # Forward pass
            output = self.forward(X)

            # Compute BCE loss
            eps = 1e-7
            loss = -np.mean(y * np.log(output + eps) + (1 - y) * np.log(1 - output + eps))
            losses.append(loss)

            # Backward pass
            self.backward(X, y)

        return losses

# Time complexity: O(epochs * n_samples * n_hidden * n_input) for training
# Space complexity: O(n_samples * n_hidden) for activations

# Test: Learn XOR
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y = np.array([[0], [1], [1], [0]], dtype=float)

nn = NeuralNetwork(2, 8, 1, lr=1.0)
losses = nn.train(X, y, epochs=5000)

preds = nn.forward(X)
print("XOR predictions:")
for i in range(4):
    print(f"  {X[i]} -> {preds[i][0]:.4f} (expected {y[i][0]:.0f})")

print(f"\\nFinal loss: {losses[-1]:.6f}")
# Expected: < 0.01

print(f"All predictions correct: {all((preds > 0.5).astype(int).flatten() == y.flatten())}")
# Expected: True`,
    },
    {
      id: "aiml-overfitting-regularization",
      slug: "overfitting-regularization",
      title: "Overfitting & Regularization",
      content: `## Overfitting & Regularization

<!-- voice:section_check -->

A model that memorizes the training data perfectly but fails on new data is useless. Understanding overfitting and how to prevent it is one of the most important skills in ML.

### The Bias-Variance Tradeoff

Every model's error can be decomposed into three components:

\`\`\`
Total Error = Bias^2 + Variance + Irreducible Noise
\`\`\`

- **Bias**: Error from oversimplifying the model. High bias = underfitting.
- **Variance**: Error from being too sensitive to training data fluctuations. High variance = overfitting.
- **Noise**: Inherent randomness in the data. Cannot be reduced.

| | Low Bias | High Bias |
|---|---|---|
| **Low Variance** | Ideal model | Underfitting |
| **High Variance** | Overfitting | Worst case |

### Signs of Overfitting

- Training loss is very low, but validation loss is much higher
- Training accuracy is 99%+, but test accuracy is 70%
- The loss curves diverge: training keeps dropping, validation starts rising

### Regularization Techniques

**L2 Regularization (Weight Decay)**

Add the squared magnitude of weights to the loss:

\`\`\`
L_total = L_data + lambda * sum(w^2)
\`\`\`

This pushes weights toward zero, preventing any single feature from dominating. Lambda controls the strength.

<!-- voice:key_insight -->

**Dropout**

During training, randomly "drop" (set to zero) a fraction of neurons in each layer. This forces the network to learn redundant representations — no single neuron can be essential.

- Typical dropout rate: 20-50%
- Applied during training only; at test time, all neurons are active
- Introduced by Srivastava et al. (2014)

**Early Stopping**

Monitor validation loss during training. Stop when it starts increasing. This prevents the model from memorizing training noise.

**Data Augmentation**

Create more training data by transforming existing examples (flipping, rotating, adding noise). More data naturally reduces overfitting.

### Train/Validation/Test Split

Never evaluate your final model on data it has seen during training or hyperparameter tuning:

\`\`\`
Total Data
  |-- Training Set (70%): Fit model parameters
  |-- Validation Set (15%): Tune hyperparameters
  |-- Test Set (15%): Final evaluation (touch ONCE)
\`\`\`

### Key Takeaway

Overfitting is the central challenge of machine learning. Regularization techniques — L2, dropout, early stopping, and data augmentation — help models generalize to unseen data. The bias-variance tradeoff guides all model selection decisions.

### Reflection Questions

- If your training accuracy is 98% but validation accuracy is 65%, what is likely happening? What would you try first?
- Why is it critical to never look at the test set until final evaluation?`,
    },
    {
      id: "aiml-training-checkpoint",
      slug: "training-checkpoint",
      title: "Checkpoint: Training & Optimization",
      content: `## Checkpoint: Training & Optimization

<!-- voice:section_check -->

Review your understanding of backpropagation, optimization, and regularization.

---

### Question 1
In backpropagation, the chain rule is applied in which direction through the network?

A) Input to output (forward)
B) Output to input (backward)
C) Both directions simultaneously
D) Random order

**Answer: B** — Backpropagation computes gradients from the output layer backward to the input layer. Each layer's gradient depends on the gradient from the layer above it (closer to the output), hence the backward direction.

---

### Question 2
The ReLU derivative for an input z = -3 is:

A) -3
B) 3
C) 1
D) 0

**Answer: D** — ReLU(z) = max(0, z). For z < 0, the output is 0 and the derivative is 0. The gradient is "blocked" for negative inputs. For z > 0, the derivative is 1.

---

### Question 3
A model achieves 99% training accuracy but only 60% test accuracy. This is a sign of:

A) Underfitting (high bias)
B) Overfitting (high variance)
C) A well-calibrated model
D) Insufficient training epochs

**Answer: B** — The large gap between training and test performance indicates the model has memorized the training data (including its noise) rather than learning generalizable patterns. Regularization, more data, or a simpler model would help.

---

### Question 4
L2 regularization works by:

A) Removing features from the dataset
B) Adding random noise to the weights during training
C) Adding the squared magnitude of weights to the loss, pushing them toward zero
D) Stopping training when validation loss increases

**Answer: C** — L2 regularization adds lambda * sum(w^2) to the loss. The gradient of this term pushes weights toward zero, preventing any weight from growing too large. This is also called weight decay.

---

### Question 5
Why do we need a separate validation set (not just train and test)?

A) To have more data for training
B) To tune hyperparameters without contaminating the test set evaluation
C) To speed up training
D) To detect corrupted data points

**Answer: B** — If we use the test set to tune hyperparameters (learning rate, regularization strength, architecture), we effectively "train" on the test set indirectly. The validation set provides an unbiased signal for hyperparameter tuning, preserving the test set for a single, final, unbiased evaluation.`,
    },
  ],
};
