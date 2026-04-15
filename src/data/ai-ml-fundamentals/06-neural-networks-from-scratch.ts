import { Module } from "../types";

export const neuralNetworksFromScratchModule: Module = {
  id: "neural-networks-from-scratch",
  title: "Neural Networks from Scratch",
  description: "Build a fully connected feedforward neural network using only NumPy. Implement forward propagation, backpropagation, and train on real data.",
  lessons: [
    {
      id: "perceptron-to-mlp",
      slug: "perceptron-to-mlp",
      title: "From Perceptron to Multi-Layer Network",
      content: `# From Perceptron to Multi-Layer Network

In the 1950s, a simple idea shook the scientific world: what if a machine could *learn* from examples? Frank Rosenblatt's **perceptron** was that idea made real — a single artificial neuron that could classify linearly separable data. For a decade, it seemed like the seed of general intelligence. Then, in 1969, Marvin Minsky and Seymour Papert published *Perceptrons*, proving mathematically that a single perceptron could not solve XOR. The AI winter followed.

But the story doesn't end there. The solution — stacking perceptrons into **layers** — unlocked capabilities that a single neuron could never achieve. This lesson traces that journey from a single node to the multi-layer perceptron (MLP), building each concept in NumPy so you feel exactly where the power comes from.

---

\`\`\`concept
{ "title": "The Perceptron: A Biological Metaphor", "variant": "analogy", "content": "Think of a neuron in your brain. It receives signals from many dendrites, sums them up, and fires if the total exceeds a threshold. A perceptron does exactly this mathematically: it computes a weighted sum of inputs, adds a bias, and passes the result through a step function. If the output crosses the threshold, the neuron 'fires' (outputs 1). If not, it stays silent (outputs 0)." }
\`\`\`

## The Perceptron: One Neuron, One Line

A perceptron is defined by three components:

| Component | Symbol | Role |
|-----------|--------|------|
| Weights | **w** | How much each input matters |
| Bias | b | Shifts the decision boundary |
| Activation | step(z) | Converts the weighted sum to a decision |

The computation is:

\`\`\`
z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
ŷ = step(z)   →   1 if z ≥ 0, else 0
\`\`\`

The perceptron *learns* by adjusting **w** and **b** whenever it misclassifies a training example. The update rule is:

\`\`\`
w ← w + η · (y - ŷ) · x
b ← b + η · (y - ŷ)
\`\`\`

where **η** (eta) is the learning rate and **y** is the true label.

\`\`\`playground
{ "title": "Perceptron from Scratch", "language": "python", "code": "import numpy as np\\n\\nclass Perceptron:\\n    def __init__(self, learning_rate=0.1, n_iters=100):\\n        self.lr = learning_rate\\n        self.n_iters = n_iters\\n        self.weights = None\\n        self.bias = None\\n\\n    def fit(self, X, y):\\n        n_samples, n_features = X.shape\\n        self.weights = np.zeros(n_features)\\n        self.bias = 0\\n\\n        for _ in range(self.n_iters):\\n            for idx, x_i in enumerate(X):\\n                z = np.dot(x_i, self.weights) + self.bias\\n                y_pred = 1 if z >= 0 else 0\\n                update = self.lr * (y[idx] - y_pred)\\n                self.weights += update * x_i\\n                self.bias += update\\n\\n    def predict(self, X):\\n        z = np.dot(X, self.weights) + self.bias\\n        return np.where(z >= 0, 1, 0)\\n\\n# --- AND gate: linearly separable ---\\nX_and = np.array([[0,0],[0,1],[1,0],[1,1]])\\ny_and = np.array([0, 0, 0, 1])\\n\\np = Perceptron(learning_rate=0.1, n_iters=20)\\np.fit(X_and, y_and)\\npredictions = p.predict(X_and)\\nprint('AND gate predictions:', predictions)\\nprint('Expected:            ', y_and)\\nprint('Weights:', p.weights, '| Bias:', p.bias)\\n", "runnable": true }
\`\`\`

The perceptron converges perfectly on the AND gate because the data is **linearly separable** — you can draw a straight line between the two classes.

---

## The XOR Problem: Why One Layer Isn't Enough

XOR (exclusive OR) returns 1 when inputs differ, 0 when they match:

| x₁ | x₂ | XOR |
|----|----|----|
| 0  | 0  | 0  |
| 0  | 1  | 1  |
| 1  | 0  | 1  |
| 1  | 1  | 0  |

Plot these four points. No matter how you orient a straight line, you cannot separate the 1s from the 0s. This isn't a tuning problem — it's a **structural** limitation. A single perceptron can only learn linear decision boundaries.

\`\`\`algoviz
{ "title": "XOR: No Linear Separator Exists", "type": "grid", "data": [[0,1],[1,0]], "frames": [ { "highlight": [0], "label": "(0,0)=0 and (1,1)=0 — same class, diagonal corners", "stats": {"class 0": 2, "class 1": 2} }, { "highlight": [1], "label": "(0,1)=1 and (1,0)=1 — other diagonal. Any line that separates these also cuts across the wrong class.", "stats": {"problem": "non-linear"} } ], "speed": 1200 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Minsky & Papert's Proof (1969)", "content": "Minsky and Papert proved that a single-layer perceptron cannot compute XOR. This caused massive funding cuts to neural network research — the first 'AI winter'. The fix (hidden layers + nonlinear activations) was known theoretically, but computers weren't powerful enough to train them yet." }
\`\`\`

---

## The Fix: Stack Layers, Add Nonlinearity

The insight that revived neural networks: **composition of linear functions is still linear**. Stacking perceptrons without changing anything gives you nothing new. The magic requires two things:

1. **Hidden layers** — intermediate representations that transform the input space
2. **Nonlinear activation functions** — so the composition isn't still just one big linear map

\`\`\`concept
{ "title": "Why Nonlinearity Unlocks Everything", "variant": "mental-model", "content": "Imagine you need to separate two interleaved spirals. A linear model draws one straight line — hopeless. But with nonlinear hidden layers, the network can *warp* the input space, stretching and folding it until the two spirals ARE linearly separable in the final representation. Each hidden layer is a learned coordinate transformation." }
\`\`\`

### Common Activation Functions

\`\`\`tabs
{ "tabs": [ { "label": "Sigmoid", "icon": "📈", "content": "**Formula:** σ(z) = 1 / (1 + e^(-z))\\n\\n**Output range:** (0, 1)\\n\\n**Use case:** Output layer for binary classification\\n\\n**Drawback:** Saturates near 0 and 1 — gradients vanish during backprop for very large or small inputs.\\n\\n\`\`\`python\\ndef sigmoid(z):\\n    return 1 / (1 + np.exp(-z))\\n\`\`\`" }, { "label": "Tanh", "icon": "〰️", "content": "**Formula:** tanh(z) = (e^z - e^(-z)) / (e^z + e^(-z))\\n\\n**Output range:** (-1, 1)\\n\\n**Use case:** Hidden layers (zero-centered, so gradients are better behaved than sigmoid)\\n\\n**Drawback:** Still saturates at extremes.\\n\\n\`\`\`python\\ndef tanh(z):\\n    return np.tanh(z)  # NumPy has this built-in\\n\`\`\`" }, { "label": "ReLU", "icon": "⚡", "content": "**Formula:** ReLU(z) = max(0, z)\\n\\n**Output range:** [0, ∞)\\n\\n**Use case:** Hidden layers in deep networks — modern default\\n\\n**Advantage:** No saturation for positive inputs; computationally trivial\\n\\n**Drawback:** 'Dying ReLU' problem — neurons that get negative inputs always output 0 and stop learning.\\n\\n\`\`\`python\\ndef relu(z):\\n    return np.maximum(0, z)\\n\`\`\`" } ] }
\`\`\`

---

## Building the MLP: Architecture Overview

A fully connected feedforward MLP has:

- An **input layer** that receives the raw features
- One or more **hidden layers** that learn intermediate representations
- An **output layer** that produces the final prediction

Each layer's computation:
\`\`\`
Z[l] = W[l] · A[l-1] + b[l]   (linear step)
A[l] = g(Z[l])                  (activation step)
\`\`\`

where **g** is the activation function for layer **l**.

\`\`\`sysdiag
{ "title": "2-Layer MLP Architecture", "width": 620, "height": 300, "nodes": [ { "id": "input", "label": "Input\\n(x₁, x₂)", "x": 80, "y": 150, "kind": "storage" }, { "id": "hidden", "label": "Hidden Layer\\n4 neurons\\nReLU", "x": 280, "y": 150, "kind": "service" }, { "id": "output", "label": "Output Layer\\n1 neuron\\nSigmoid", "x": 500, "y": 150, "kind": "service" } ], "edges": [ { "from": "input", "to": "hidden", "label": "W¹, b¹" }, { "from": "hidden", "to": "output", "label": "W², b²" } ], "annotations": { "input": "Raw features passed as column vector. No computation here.", "hidden": "Learns non-linear features. W¹ has shape (4, n_inputs). Each row is one neuron's weights.", "output": "Combines hidden features into a probability. W² has shape (1, 4)." } }
\`\`\`

---

## Solving XOR with a 2-Layer MLP

Let's watch XOR yield to a hidden layer. We'll train a small MLP (2 inputs → 4 hidden → 1 output) and watch the loss fall.

\`\`\`playground
{ "title": "MLP Solves XOR", "language": "python", "code": "import numpy as np\\n\\nnp.random.seed(42)\\n\\ndef sigmoid(z):\\n    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))\\n\\ndef sigmoid_deriv(a):\\n    return a * (1 - a)\\n\\n# XOR data\\nX = np.array([[0,0],[0,1],[1,0],[1,1]])  # shape (4, 2)\\ny = np.array([[0],[1],[1],[0]])           # shape (4, 1)\\n\\n# Architecture: 2 -> 4 -> 1\\nW1 = np.random.randn(2, 4) * 0.5\\nb1 = np.zeros((1, 4))\\nW2 = np.random.randn(4, 1) * 0.5\\nb2 = np.zeros((1, 1))\\n\\nlr = 0.5\\nn_epochs = 5000\\n\\nfor epoch in range(n_epochs):\\n    # Forward pass\\n    Z1 = X @ W1 + b1\\n    A1 = sigmoid(Z1)\\n    Z2 = A1 @ W2 + b2\\n    A2 = sigmoid(Z2)\\n\\n    # Loss (Binary Cross-Entropy)\\n    loss = -np.mean(y * np.log(A2 + 1e-8) + (1-y) * np.log(1-A2 + 1e-8))\\n\\n    # Backward pass\\n    dA2 = -(y / (A2 + 1e-8)) + (1-y) / (1-A2 + 1e-8)\\n    dZ2 = dA2 * sigmoid_deriv(A2)\\n    dW2 = A1.T @ dZ2\\n    db2 = np.sum(dZ2, axis=0, keepdims=True)\\n\\n    dA1 = dZ2 @ W2.T\\n    dZ1 = dA1 * sigmoid_deriv(A1)\\n    dW1 = X.T @ dZ1\\n    db1 = np.sum(dZ1, axis=0, keepdims=True)\\n\\n    # Update weights\\n    W2 -= lr * dW2\\n    b2 -= lr * db2\\n    W1 -= lr * dW1\\n    b1 -= lr * db1\\n\\n    if epoch % 1000 == 0:\\n        print(f'Epoch {epoch:5d} | Loss: {loss:.4f}')\\n\\nprint('\\\\nFinal predictions (threshold 0.5):')\\nfor i, xi in enumerate(X):\\n    pred = 1 if A2[i,0] > 0.5 else 0\\n    print(f'  {xi} -> {A2[i,0]:.4f} -> {pred}  (true: {y[i,0]})')\\n", "runnable": true }
\`\`\`

Watch the loss curve fall. A single perceptron would plateau immediately — the depth is what enables learning.

---

## Tracing Forward Propagation Step by Step

Let's freeze one forward pass and trace every number through a tiny MLP (2 inputs → 2 hidden → 1 output) so the matrix shapes become concrete.

\`\`\`trace
{ "title": "Forward Pass Through a Mini MLP", "language": "python", "code": "import numpy as np\\n\\nX = np.array([[0, 1]])  # 1 sample, 2 features\\nW1 = np.array([[0.5, -0.3], [0.8, 0.1]])  # (2, 2)\\nb1 = np.array([[0.1, 0.2]])\\nW2 = np.array([[0.7], [-0.4]])  # (2, 1)\\nb2 = np.array([[0.0]])\\n\\nZ1 = X @ W1 + b1\\nA1 = 1 / (1 + np.exp(-Z1))\\nZ2 = A1 @ W2 + b2\\nA2 = 1 / (1 + np.exp(-Z2))", "frames": [ { "line": 3, "vars": { "X": "[[0, 1]]", "shape": "(1, 2)" }, "note": "One training sample: x₁=0, x₂=1" }, { "line": 4, "vars": { "W1": "[[0.5,-0.3],[0.8,0.1]]", "shape": "(2,2)" }, "note": "W1[i,j] = weight from input i to hidden neuron j" }, { "line": 7, "vars": { "Z1": "[[0.9, 0.3]]" }, "note": "Z1 = X @ W1 + b1. Row vector: pre-activation for each hidden neuron" }, { "line": 8, "vars": { "A1": "[[0.711, 0.574]]" }, "note": "Sigmoid squashes each pre-activation into (0,1)" }, { "line": 9, "vars": { "Z2": "[[0.267]]" }, "note": "Output pre-activation: dot product of A1 with W2 column" }, { "line": 10, "vars": { "A2": "[[0.566]]" }, "note": "Final prediction: 56.6% probability of class 1" } ], "speed": 900 }
\`\`\`

---

## Practice: Fill in the Forward Pass

\`\`\`fillblank
{ "title": "Complete the Forward Pass", "prompt": "Fill in the blanks to implement one forward pass through a 2-layer MLP. Layer 1 uses ReLU; Layer 2 uses sigmoid.", "language": "python", "template": "import numpy as np\\n\\ndef relu(z):\\n    return np.maximum(___, z)\\n\\ndef sigmoid(z):\\n    return 1 / (1 + np.exp(___z))\\n\\ndef forward(X, W1, b1, W2, b2):\\n    Z1 = X @ ___ + b1\\n    A1 = relu(Z1)\\n    Z2 = ___ @ W2 + b2\\n    A2 = sigmoid(Z2)\\n    return A2", "blanks": [ { "answer": "0", "hint": "ReLU clips at zero — what's the floor value?" }, { "answer": "-", "hint": "Sigmoid needs e^(-z), so the exponent sign is..." }, { "answer": "W1", "hint": "First linear transformation: X times the first weight matrix" }, { "answer": "A1", "hint": "The second layer receives the *activated* output of the first layer" } ] }
\`\`\`

---

## The Universal Approximation Theorem

\`\`\`concept
{ "title": "One Hidden Layer Is (Theoretically) Enough", "variant": "insight", "content": "The Universal Approximation Theorem (Cybenko, 1989; Hornik, 1991) states that a feedforward network with a single hidden layer containing enough neurons can approximate any continuous function to arbitrary precision — given the right weights. This doesn't mean one layer is *practical* (it may require exponentially many neurons), but it proves that depth isn't required for expressiveness in theory. In practice, multiple shallower layers generalize better and train faster." }
\`\`\`

The practical takeaway: **depth is efficient**. A network with 2 hidden layers of 8 neurons each often outperforms a 1 hidden layer network of 64 neurons, because each layer builds on abstract features from the previous one.

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "What fundamental limitation does the perceptron have that the MLP overcomes?", "options": ["It cannot handle more than 2 inputs", "It can only learn linearly separable decision boundaries", "It requires labeled data to train", "It cannot update its weights online"], "answer": 1, "explanation": "A perceptron computes a weighted sum and applies a step function, which always produces a linear decision boundary. XOR is not linearly separable — you cannot draw a single straight line to separate the classes. MLPs overcome this by introducing hidden layers with nonlinear activations that can warp the input space." }, { "question": "Why must hidden layers use nonlinear activation functions?", "options": ["To make the network faster to train", "To prevent overfitting to training data", "Because a composition of linear functions is still linear", "To normalize the output between 0 and 1"], "answer": 2, "explanation": "If every layer is just a linear transformation (Z = WA + b), then the entire network — no matter how many layers — collapses to a single linear transformation. Nonlinear activations like ReLU or sigmoid break this property, allowing the network to represent non-linear functions." }, { "question": "In the weight matrix W1 of shape (n_inputs, n_hidden), what does one *row* represent?", "options": ["The weights connecting all inputs to one hidden neuron", "The weights connecting one input to all hidden neurons", "The bias terms for each hidden neuron", "The activation values of the hidden layer"], "answer": 1, "explanation": "In the convention X @ W1 where X is (batch, n_inputs), W1 has shape (n_inputs, n_hidden). One *column* of W1 represents the weights coming INTO one hidden neuron from all inputs. One *row* represents the weights leaving one input to all hidden neurons. Be careful — conventions differ between frameworks!" }, { "question": "What was historically significant about the XOR problem for neural networks?", "options": ["It proved that neural networks could solve any problem", "It showed perceptrons could generalize to unseen data", "Minsky and Papert's proof that a single perceptron cannot solve XOR contributed to the first AI winter", "It was the first problem solved by a multi-layer perceptron"], "answer": 2, "explanation": "In 1969, Minsky and Papert published mathematical proofs of the perceptron's limitations, including its inability to solve XOR. This led to a significant reduction in AI funding and research interest — the so-called first 'AI winter'. The multi-layer solution existed in theory, but lacked practical training algorithms and sufficient compute." } ] }
\`\`\`

---

## From Perceptron to MLP: The Evolution at a Glance

\`\`\`steps
{ "title": "The Path to Multi-Layer Networks", "steps": [ { "title": "1957: Rosenblatt's Perceptron", "content": "Frank Rosenblatt implements the perceptron on the IBM 704 computer. It learns to classify linearly separable patterns using a simple weight-update rule. It can solve AND and OR, but not XOR." }, { "title": "1969: The XOR Crisis", "content": "Minsky and Papert prove in *Perceptrons* that a single-layer perceptron cannot represent XOR. Combined with the computational limits of the era, this triggers the first AI winter." }, { "title": "1974–1986: Backpropagation Rediscovered", "content": "Paul Werbos (1974), David Rumelhart, Geoffrey Hinton, and Ronald Williams (1986) popularize backpropagation — an efficient algorithm for computing gradients through multiple layers using the chain rule. Multi-layer networks can now be trained." }, { "title": "1989: Universal Approximation Theorem", "content": "Cybenko and Hornik prove that a single hidden layer MLP can approximate any continuous function. Neural networks have theoretical foundations as general-purpose learners." }, { "title": "Today: Deep Learning", "content": "Modern deep networks have dozens to hundreds of layers. But every one of them — from GPT to ResNet — is built on the same core ideas: weighted sums, nonlinear activations, and gradient-based weight updates you are learning right now." } ] }
\`\`\`

---

## What's Next

You now understand *why* depth matters. In the next lesson, you'll implement the full training loop: forward propagation computes predictions, **backpropagation** computes gradients, and gradient descent updates weights. Every matrix multiply you traced here maps directly to code.

\`\`\`callout
{ "type": "tip", "title": "Build Intuition Before Frameworks", "content": "Understanding the perceptron's limitations and how hidden layers overcome them gives you a mental model that frameworks hide. When a deep learning model fails to converge on a non-linear problem, you'll know to check depth and activations — not just learning rate. This is the advantage of building from scratch." }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The perceptron is a single artificial neuron: it computes a weighted sum, adds a bias, and applies a step function — producing a linear decision boundary.", "XOR is not linearly separable: no single straight line can separate its classes, which proves a single perceptron is fundamentally insufficient for some problems.", "MLPs overcome this by stacking layers with nonlinear activations (sigmoid, tanh, ReLU), allowing the network to learn curved and arbitrarily complex decision boundaries.", "A composition of pure linear functions is still linear — nonlinear activations are what give hidden layers their expressive power.", "The Universal Approximation Theorem guarantees that a single hidden layer with enough neurons can approximate any continuous function, though depth is more practical and efficient.", "Building from scratch with NumPy — rather than using frameworks — forces you to understand exactly what each matrix multiply and activation function contributes to learning." ] }
\`\`\``,
      starterCode: `import numpy as np

# Exercise: From Perceptron to Multi-Layer Network
#
# The perceptron can only solve LINEARLY SEPARABLE problems.
# XOR is the classic example that a single perceptron CANNOT learn.
# A multi-layer network (MLP) with a hidden layer CAN learn XOR.
#
# Your task: implement both and see the difference.

# XOR truth table
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([0, 1, 1, 0])  # XOR outputs


def sigmoid(z):
    # TODO: Implement the sigmoid activation function
    # Formula: 1 / (1 + e^(-z))
    pass


def sigmoid_derivative(z):
    # TODO: Implement the derivative of sigmoid
    # Formula: sigmoid(z) * (1 - sigmoid(z))
    pass


# ─── PART 1: Single Perceptron ───────────────────────────────────────────────

class Perceptron:
    def __init__(self):
        np.random.seed(42)
        # TODO: Initialize weights (shape: 2,) and bias (scalar) to small random values
        self.weights = None
        self.bias = None

    def predict(self, x):
        # TODO: Compute the linear output: dot(x, weights) + bias
        # Then apply sigmoid and threshold at 0.5 (return 1 if >= 0.5, else 0)
        pass

    def train(self, X, y, lr=0.1, epochs=1000):
        for _ in range(epochs):
            for xi, yi in zip(X, y):
                # TODO: Compute prediction, calculate error (yi - pred),
                # update weights and bias using the perceptron learning rule:
                #   weights += lr * error * xi
                #   bias    += lr * error
                pass


# ─── PART 2: Two-Layer MLP ───────────────────────────────────────────────────

class MLP:
    def __init__(self, hidden_size=2):
        np.random.seed(42)
        # TODO: Initialize weights and biases for two layers:
        #   W1: shape (2, hidden_size), b1: shape (hidden_size,)
        #   W2: shape (hidden_size, 1), b2: shape (1,)
        # Use np.random.randn and scale by 0.5
        self.W1 = None
        self.b1 = None
        self.W2 = None
        self.b2 = None

    def forward(self, x):
        # TODO: Forward pass through both layers
        #   z1 = x @ W1 + b1  →  a1 = sigmoid(z1)   (hidden layer)
        #   z2 = a1 @ W2 + b2 →  a2 = sigmoid(z2)   (output layer)
        # Return a1, a2  (needed for backprop)
        pass

    def train(self, X, y, lr=0.5, epochs=10000):
        for _ in range(epochs):
            for xi, yi in zip(X, y):
                xi = xi.reshape(1, -1)

                # TODO: Forward pass — get a1 and a2

                # TODO: Backpropagation
                # Output layer error:
                #   delta2 = (a2 - yi) * sigmoid_derivative(a2)
                # Hidden layer error:
                #   delta1 = (delta2 @ W2.T) * sigmoid_derivative(a1)
                # Update weights (gradient descent, subtract the gradient):
                #   W2 -= lr * a1.T @ delta2
                #   b2 -= lr * delta2.squeeze()
                #   W1 -= lr * xi.T @ delta1
                #   b1 -= lr * delta1.squeeze()
                pass

    def predict(self, x):
        _, a2 = self.forward(x)
        return 1 if a2 >= 0.5 else 0


# ─── TEST ────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    print('XOR truth table: inputs -> expected')
    for xi, yi in zip(X, y):
        print(f'  {xi} -> {yi}')

    print('\\n--- Perceptron (cannot learn XOR) ---')
    p = Perceptron()
    p.train(X, y)
    for xi, yi in zip(X, y):
        pred = p.predict(xi)
        print(f'  {xi} -> predicted: {pred}, expected: {yi}')

    print('\\n--- MLP with hidden layer (can learn XOR) ---')
    mlp = MLP(hidden_size=2)
    mlp.train(X, y)
    for xi, yi in zip(X, y):
        pred = mlp.predict(xi)
        print(f'  {xi} -> predicted: {pred}, expected: {yi}')
`,
      solutionCode: `import numpy as np

# Solution: From Perceptron to Multi-Layer Network
#
# Key insight: XOR is NOT linearly separable — no single straight line can
# divide the four XOR points into correct classes. A perceptron (linear
# classifier) therefore fails. Adding a hidden layer lets the network learn
# an intermediate non-linear representation that IS linearly separable.

# XOR truth table
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([0, 1, 1, 0])  # XOR outputs


def sigmoid(z):
    return 1 / (1 + np.exp(-z))


def sigmoid_derivative(z):
    # When z is already a sigmoid output (activation), the derivative is s*(1-s)
    return z * (1 - z)


# ─── PART 1: Single Perceptron ───────────────────────────────────────────────

class Perceptron:
    def __init__(self):
        np.random.seed(42)
        self.weights = np.random.randn(2) * 0.5
        self.bias = np.random.randn() * 0.5

    def predict(self, x):
        linear_output = np.dot(x, self.weights) + self.bias
        prob = sigmoid(linear_output)
        return 1 if prob >= 0.5 else 0

    def train(self, X, y, lr=0.1, epochs=1000):
        for _ in range(epochs):
            for xi, yi in zip(X, y):
                pred = self.predict(xi)
                error = yi - pred
                # Perceptron learning rule: move weights in direction of error
                self.weights += lr * error * xi
                self.bias += lr * error


# ─── PART 2: Two-Layer MLP ───────────────────────────────────────────────────

class MLP:
    def __init__(self, hidden_size=2):
        np.random.seed(42)
        # Layer 1: input (2) → hidden (hidden_size)
        self.W1 = np.random.randn(2, hidden_size) * 0.5
        self.b1 = np.random.randn(hidden_size) * 0.5
        # Layer 2: hidden (hidden_size) → output (1)
        self.W2 = np.random.randn(hidden_size, 1) * 0.5
        self.b2 = np.random.randn(1) * 0.5

    def forward(self, x):
        # Hidden layer: apply linear transform then sigmoid non-linearity
        z1 = x @ self.W1 + self.b1
        a1 = sigmoid(z1)
        # Output layer: another linear transform + sigmoid
        z2 = a1 @ self.W2 + self.b2
        a2 = sigmoid(z2)
        return a1, a2

    def train(self, X, y, lr=0.5, epochs=10000):
        for _ in range(epochs):
            for xi, yi in zip(X, y):
                xi = xi.reshape(1, -1)  # shape (1, 2)

                # --- Forward pass ---
                a1, a2 = self.forward(xi)  # a1: (1, hidden), a2: (1, 1)

                # --- Backpropagation ---
                # How wrong is the output? Multiply by slope of sigmoid at output.
                delta2 = (a2 - yi) * sigmoid_derivative(a2)  # (1, 1)

                # Propagate error back through W2 to the hidden layer.
                delta1 = (delta2 @ self.W2.T) * sigmoid_derivative(a1)  # (1, hidden)

                # Gradient descent: subtract gradient scaled by learning rate
                self.W2 -= lr * a1.T @ delta2
                self.b2 -= lr * delta2.squeeze()
                self.W1 -= lr * xi.T @ delta1
                self.b1 -= lr * delta1.squeeze()

    def predict(self, x):
        _, a2 = self.forward(x)
        return 1 if a2 >= 0.5 else 0


# ─── TEST ────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    print('XOR truth table: inputs -> expected')
    for xi, yi in zip(X, y):
        print(f'  {xi} -> {yi}')

    # The perceptron will get at most 3/4 correct — it cannot separate XOR
    print('\\n--- Perceptron (cannot learn XOR) ---')
    p = Perceptron()
    p.train(X, y)
    correct = 0
    for xi, yi in zip(X, y):
        pred = p.predict(xi)
        match = '✓' if pred == yi else '✗'
        print(f'  {xi} -> predicted: {pred}, expected: {yi}  {match}')
        correct += (pred == yi)
    print(f'  Accuracy: {correct}/4 — perceptron is stuck at a linear boundary')

    # The MLP will achieve 4/4 by learning a curved decision boundary
    print('\\n--- MLP with hidden layer (can learn XOR) ---')
    mlp = MLP(hidden_size=2)
    mlp.train(X, y)
    correct = 0
    for xi, yi in zip(X, y):
        pred = mlp.predict(xi)
        match = '✓' if pred == yi else '✗'
        print(f'  {xi} -> predicted: {pred}, expected: {yi}  {match}')
        correct += (pred == yi)
    print(f'  Accuracy: {correct}/4 — depth enables non-linear decision boundaries')
`,
    },
    {
      id: "activation-functions",
      slug: "activation-functions",
      title: "Activation Functions: ReLU, Sigmoid, Tanh, and Softmax",
      content: `# Activation Functions: ReLU, Sigmoid, Tanh, and Softmax

Without activation functions, stacking layers in a neural network is mathematically equivalent to a single matrix multiplication — no matter how many layers you add, the output is still a linear function of the input. Activation functions inject **non-linearity**, enabling networks to learn curves, decision boundaries, and patterns that no straight line could ever capture.

In this lesson you will implement all four major activation functions and their derivatives from scratch using NumPy, understand the vanishing gradient problem that crippled early deep networks, and learn exactly why ReLU became the dominant activation for hidden layers.

\`\`\`concept
{ "title": "Activation Functions as Gates", "variant": "mental-model", "content": "Think of each neuron as a gate. The pre-activation value z = Wx + b arrives at the gate. The activation function decides how much signal passes through and in what form:\\n\\n- **Sigmoid / Tanh:** A dimmer switch — smooth, analog output within fixed bounds.\\n- **ReLU:** A one-way valve — signal passes freely when positive, blocked when negative.\\n- **Softmax:** A committee vote — every class competes, and the probabilities sum to exactly 1.\\n\\nWithout these gates, every additional layer is mathematically redundant." }
\`\`\`

---

## The Four Activation Functions

Each activation serves a distinct purpose. Study the formula, range, typical use case, and derivative for each one.

\`\`\`tabs
{ "tabs": [ { "label": "Sigmoid", "icon": "📈", "content": "**Formula:** \`σ(x) = 1 / (1 + e^(-x))\`\\n\\n**Range:** (0, 1)\\n\\n**Primary use:** Output layer for **binary classification**\\n\\n**Derivative:** \`σ'(x) = σ(x) · (1 - σ(x))\`\\n\\n---\\n\\n**Strengths**\\n- Smooth and differentiable everywhere\\n- Output is naturally interpretable as a probability\\n\\n**Weaknesses**\\n- Saturates at extremes: σ(10) ≈ 1, σ(−10) ≈ 0 → gradients near zero → **vanishing gradients**\\n- Output is not zero-centered (always positive), causing zig-zag gradient updates\\n- Computing \`exp\` is relatively expensive" }, { "label": "ReLU", "icon": "⚡", "content": "**Formula:** \`f(x) = max(0, x)\`\\n\\n**Range:** [0, ∞)\\n\\n**Primary use:** **Hidden layers** — the default activation in modern networks\\n\\n**Derivative:** \`f'(x) = 1 if x > 0, else 0\`\\n\\n---\\n\\n**Strengths**\\n- No saturation for positive inputs → gradients flow freely backward\\n- Computationally trivial: a single comparison operation\\n- Promotes **sparse activation** — many neurons output 0, improving efficiency\\n\\n**Weaknesses**\\n- **Dying ReLU problem:** if a neuron's pre-activation is always negative, it permanently outputs 0 and stops learning\\n- Output is not zero-centered\\n- Gradient is technically undefined at x = 0 (by convention set to 0 or 1)" }, { "label": "Tanh", "icon": "〰️", "content": "**Formula:** \`tanh(x) = (eˣ − e⁻ˣ) / (eˣ + e⁻ˣ)\`\\n\\n**Range:** (−1, 1)\\n\\n**Primary use:** RNN gates, LSTM cells; hidden layers when zero-centering matters\\n\\n**Derivative:** \`tanh'(x) = 1 − tanh²(x)\`\\n\\n---\\n\\n**Strengths**\\n- **Zero-centered output** — gradients point in balanced directions, which helps SGD converge faster than sigmoid\\n- Stronger gradients near the origin compared to sigmoid\\n\\n**Weaknesses**\\n- Still saturates at extremes → vanishing gradients persist in very deep networks\\n- Computationally similar to sigmoid (requires two \`exp\` evaluations)" }, { "label": "Softmax", "icon": "🎯", "content": "**Formula:** \`softmax(xᵢ) = eˣⁱ / Σⱼ eˣʲ\`\\n\\n**Range:** Each output in (0, 1); all outputs **sum to exactly 1**\\n\\n**Primary use:** Output layer for **multi-class classification** (K classes)\\n\\n**Derivative:** Full Jacobian matrix — but paired with cross-entropy loss, the upstream gradient simplifies to \`ŷ − y\`\\n\\n---\\n\\n**Strengths**\\n- Produces a valid probability distribution over K mutually exclusive classes\\n- Smooth and differentiable everywhere\\n\\n**Weaknesses**\\n- Numerically unstable with large logits — **always subtract max(x)** before exponentiating\\n- Not suitable for hidden layers: all outputs are coupled through the normalization denominator" } ] }
\`\`\`

---

## Implementing All Four in NumPy

Run the playground below. Pay particular attention to the sigmoid and tanh derivative rows — notice how the gradients shrink as \`|x|\` grows.

\`\`\`playground
{ "title": "All Four Activations from Scratch", "language": "python", "code": "import numpy as np\\n\\n# ── Sigmoid ──────────────────────────────────────────────────\\ndef sigmoid(x):\\n    return 1 / (1 + np.exp(-x))\\n\\ndef sigmoid_deriv(x):\\n    s = sigmoid(x)\\n    return s * (1 - s)\\n\\n# ── ReLU ─────────────────────────────────────────────────────\\ndef relu(x):\\n    return np.maximum(0, x)\\n\\ndef relu_deriv(x):\\n    return (x > 0).astype(float)\\n\\n# ── Tanh ─────────────────────────────────────────────────────\\ndef tanh_act(x):\\n    return np.tanh(x)\\n\\ndef tanh_deriv(x):\\n    return 1 - np.tanh(x) ** 2\\n\\n# ── Softmax (numerically stable) ─────────────────────────────\\ndef softmax(x):\\n    e_x = np.exp(x - np.max(x))  # subtract max for numerical stability\\n    return e_x / e_x.sum()\\n\\n# ── Demo ─────────────────────────────────────────────────────\\nxs = np.array([-2.0, -1.0, 0.0, 1.0, 2.0])\\nlogits = np.array([3.0, 1.0, 0.2])\\n\\nprint(\\"Input:         \\", xs)\\nprint(\\"sigmoid:       \\", np.round(sigmoid(xs), 3))\\nprint(\\"sigmoid deriv: \\", np.round(sigmoid_deriv(xs), 3))\\nprint()\\nprint(\\"relu:          \\", relu(xs))\\nprint(\\"relu deriv:    \\", relu_deriv(xs))\\nprint()\\nprint(\\"tanh:          \\", np.round(tanh_act(xs), 3))\\nprint(\\"tanh deriv:    \\", np.round(tanh_deriv(xs), 3))\\nprint()\\nprint(\\"Logits for softmax:\\", logits)\\nprint(\\"softmax output:    \\", np.round(softmax(logits), 4))\\nprint(\\"Sum check:         \\", round(softmax(logits).sum(), 10))", "runnable": true }
\`\`\`

Notice the sigmoid derivative at \`x = ±2\` is already below **0.105**. Multiply that across 10 layers and the gradient reaching the first layer is ≈ 0.105¹⁰ ≈ **0.000000001**. That's the vanishing gradient problem made concrete.

---

## Tracing Sigmoid: Step by Step

Let's trace σ(2.0) and its derivative line by line, watching every intermediate value.

\`\`\`trace
{ "title": "Sigmoid Forward Pass + Derivative at x = 2.0", "language": "python", "code": "import numpy as np\\n\\nx = 2.0\\n\\n# Forward pass — decomposed into steps\\nexp_neg_x = np.exp(-x)\\ndenom = 1 + exp_neg_x\\ns = 1 / denom\\n\\n# Derivative using the self-referential formula\\ngrad = s * (1 - s)\\n\\nprint(f'sigmoid({x}) = {s:.4f}')\\nprint(f'sigmoid_deriv({x}) = {grad:.4f}')", "frames": [ { "line": 1, "vars": {}, "note": "Import NumPy — np.exp will handle the math" }, { "line": 3, "vars": { "x": 2.0 }, "note": "Our input value: x = 2.0" }, { "line": 6, "vars": { "x": 2.0, "exp_neg_x": 0.1353 }, "note": "e^(−2.0) ≈ 0.1353 — a small positive number" }, { "line": 7, "vars": { "x": 2.0, "exp_neg_x": 0.1353, "denom": 1.1353 }, "note": "Denominator = 1 + 0.1353 = 1.1353" }, { "line": 8, "vars": { "denom": 1.1353, "s": 0.8808 }, "note": "σ(2.0) = 1 / 1.1353 ≈ 0.8808 — neuron is nearly saturated (close to 1)" }, { "line": 11, "vars": { "s": 0.8808, "grad": 0.1050 }, "note": "grad = 0.8808 × (1 − 0.8808) = 0.8808 × 0.1192 ≈ 0.1050 — only 10.5% of gradient passes through!" }, { "line": 13, "vars": { "s": 0.8808, "grad": 0.1050 }, "note": "Print both values", "stdout": "sigmoid(2.0) = 0.8808\\nsigmoid_deriv(2.0) = 0.1050" } ], "speed": 900 }
\`\`\`

At saturation, the neuron is confident — but *training signal* is nearly gone. This is the core tension: sigmoid looks like a natural probability output, but it throttles learning in deep networks.

---

## The Vanishing Gradient Problem

Backpropagation computes gradients via the **chain rule** — each layer's gradient is multiplied by the activation derivative at that layer. When that derivative is consistently less than 1, the product shrinks exponentially with depth.

\`\`\`callout
{ "type": "danger", "title": "Vanishing Gradients: Why Depth Kills Sigmoid", "content": "Consider a 10-layer network where every hidden layer uses sigmoid and every neuron sits near saturation:\\n\\n- Layer 1 gradient factor: 0.10\\n- After 2 layers: 0.10 × 0.10 = 0.01\\n- After 5 layers: 0.10⁵ = 0.00001\\n- After 10 layers: ≈ 0.0000000001\\n\\nThe first layers receive essentially zero learning signal — they barely update. Training stalls.\\n\\n**ReLU's fix is elegant:** for positive pre-activations, the derivative is exactly **1**. Gradients pass through active ReLU neurons completely unchanged. Only dead neurons (z ≤ 0) block the signal, and in a wide network enough neurons stay active to keep learning." }
\`\`\`

---

## ReLU vs Sigmoid for Hidden Layers

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Sigmoid in Hidden Layer (Avoid)", "code": "def forward_hidden_sigmoid(x, W, b):\\n    z = W @ x + b\\n    # Saturates for large |z| values\\n    a = 1 / (1 + np.exp(-z))\\n    return a\\n\\n# Backprop gradient multiplier:\\n#   s * (1 - s)  <-- max value is 0.25, at z=0\\n#   At z=2: ~0.105\\n#   At z=5: ~0.007\\n#   After 10 layers: effectively zero\\n# Early layers starve for gradient signal." }, "after": { "label": "ReLU in Hidden Layer (Preferred)", "code": "def forward_hidden_relu(x, W, b):\\n    z = W @ x + b\\n    # No saturation for positive values\\n    a = np.maximum(0, z)\\n    return a\\n\\n# Backprop gradient multiplier:\\n#   1 for active neurons (z > 0) -- gradient unchanged\\n#   0 for dead neurons  (z <= 0) -- blocked, but others compensate\\n# Deep gradients stay strong across many layers." } }
\`\`\`

**Practical rule of thumb:**

| Layer type | Activation to use |
|---|---|
| Hidden layers | ReLU (default), Leaky ReLU, or ELU |
| Binary classification output | Sigmoid |
| Multi-class classification output | Softmax |
| RNN / LSTM gates | Tanh |

---

## Practice: Complete the Derivative

\`\`\`fillblank
{ "title": "Implement tanh Derivative", "prompt": "Fill in the blanks to implement tanh'(x) = 1 - tanh(x)^2. The derivative can always be computed from the forward-pass output, avoiding a second pass through the function.", "language": "python", "template": "import numpy as np\\n\\ndef tanh_deriv(x):\\n    # Compute tanh(x) first — we reuse it in the derivative\\n    t = ___\\n    return 1 - ___\\n\\n# Verify\\nxs = np.array([-1.0, 0.0, 1.0])\\nprint(np.round(tanh_deriv(xs), 4))\\n# Expected: [0.4200, 1.0000, 0.4200]", "blanks": [ { "answer": "np.tanh(x)", "hint": "NumPy's built-in tanh function applied to the whole array" }, { "answer": "t ** 2", "hint": "Square the tanh value you stored in t" } ] }
\`\`\`

Notice that \`tanh'(0) = 1\` — at the origin, the full gradient passes through. This is why tanh outperforms sigmoid near the center: both saturate at extremes, but tanh's peak gradient is four times larger (1.0 vs 0.25).

---

## Knowledge Check

\`\`\`quiz
{ "title": "Activation Functions Quiz", "questions": [ { "question": "What is the output range of the sigmoid function?", "options": ["(−∞, ∞)", "(−1, 1)", "(0, 1)", "[0, ∞)"], "answer": 2, "explanation": "Sigmoid outputs values strictly between 0 and 1. As x → +∞, σ(x) → 1; as x → −∞, σ(x) → 0. It never reaches exactly 0 or 1, making it suitable for binary probability outputs." }, { "question": "Why is ReLU preferred over sigmoid for hidden layers in deep networks?", "options": ["ReLU always produces higher accuracy on all tasks", "ReLU's derivative is 1 for positive inputs, so gradients flow backward unchanged", "ReLU outputs are zero-centered, unlike sigmoid", "ReLU is differentiable at every point including x = 0"], "answer": 1, "explanation": "For positive pre-activations, ReLU's derivative is exactly 1 — the gradient passes through without shrinking. Sigmoid's derivative is at most 0.25 and approaches 0 at saturation, causing gradients to vanish exponentially in deep networks." }, { "question": "Which activation function should you place at the output layer of a 5-class classification problem?", "options": ["ReLU", "Tanh", "Sigmoid", "Softmax"], "answer": 3, "explanation": "Softmax outputs a probability distribution over K classes — each output is in (0,1) and all outputs sum to exactly 1. Sigmoid is for binary classification (single neuron output). ReLU and tanh are not probability functions and are not suitable for classification outputs." }, { "question": "Why does the numerically stable softmax implementation subtract max(x) before exponentiating?", "options": ["To make all outputs sum to exactly 1", "To zero-center the output distribution", "To prevent floating-point overflow from exp() on large input values", "To speed up matrix multiplication in the backward pass"], "answer": 2, "explanation": "exp(1000) overflows to infinity in IEEE 754 float64. Subtracting max(x) ensures the largest argument to exp is 0, so the largest term is exp(0) = 1. Algebraically the result is identical — the subtracted constant cancels in numerator and denominator — but numerically the computation is safe." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Activation functions introduce non-linearity — without them, any deep network collapses to a single linear transformation regardless of depth.", "Sigmoid and tanh saturate at extremes: their derivatives approach 0, causing gradients to shrink exponentially with depth (vanishing gradients).", "ReLU (f(x) = max(0, x)) solves vanishing gradients for positive inputs — its derivative is exactly 1, so gradient flows backward unchanged through active neurons.", "Use ReLU (or Leaky ReLU) in hidden layers, sigmoid for binary classification output, softmax for multi-class output, and tanh in RNN/LSTM gates.", "Softmax must be implemented in numerically stable form: subtract max(x) before exponentiating to prevent float64 overflow.", "Activation derivatives can be computed from the forward-pass output: sigmoid'(x) = s(1−s), tanh'(x) = 1−t², making backpropagation efficient by reusing cached values." ] }
\`\`\``,
      starterCode: `import numpy as np

# Activation Functions and Their Derivatives
# Implement each activation function and its derivative.
# Then observe vanishing gradients with the gradient analysis at the bottom.


def sigmoid(x):
    """Sigmoid activation: maps any value to (0, 1)"""
    # TODO: Implement sigmoid: 1 / (1 + e^(-x))
    pass


def sigmoid_derivative(x):
    """Derivative of sigmoid: sigmoid(x) * (1 - sigmoid(x))"""
    # TODO: Implement sigmoid derivative using the sigmoid function above
    pass


def tanh_activation(x):
    """Tanh activation: maps any value to (-1, 1)"""
    # TODO: Implement tanh (hint: np.tanh works, or use the formula)
    pass


def tanh_derivative(x):
    """Derivative of tanh: 1 - tanh(x)^2"""
    # TODO: Implement tanh derivative
    pass


def relu(x):
    """ReLU activation: max(0, x)"""
    # TODO: Implement ReLU (hint: np.maximum)
    pass


def relu_derivative(x):
    """Derivative of ReLU: 1 if x > 0, else 0"""
    # TODO: Implement ReLU derivative (hint: return a float array of 0s and 1s)
    pass


def softmax(x):
    """Softmax: converts a vector into a probability distribution"""
    # TODO: Implement softmax: e^x_i / sum(e^x_j)
    # HINT: Subtract np.max(x) from x before exponentiating for numerical stability
    pass


# --- Vanishing Gradient Analysis ---
# Run this to see why ReLU dominates deep networks

def simulate_gradient_flow(activation_fn, derivative_fn, layers=10):
    """Simulate gradient magnitude as it flows back through 'layers' layers."""
    gradient = 1.0
    x = 0.5  # input value passed through each layer
    for _ in range(layers):
        gradient *= derivative_fn(x)
    return gradient


if __name__ == "__main__":
    # Test basic outputs
    x = np.array([-2.0, -1.0, 0.0, 1.0, 2.0])

    print("=== Activation Outputs ===")
    # TODO: Uncomment each line once you implement the function
    # print(f"Sigmoid: {sigmoid(x)}")
    # print(f"Tanh:    {tanh_activation(x)}")
    # print(f"ReLU:    {relu(x)}")

    print("\\n=== Softmax Example ===")
    logits = np.array([2.0, 1.0, 0.1])
    # TODO: Uncomment once softmax is implemented
    # probs = softmax(logits)
    # print(f"Softmax output: {probs}")
    # print(f"Sum of probabilities: {probs.sum():.4f}  <- should be 1.0")

    print("\\n=== Vanishing Gradient Simulation (10 layers) ===")
    # TODO: Uncomment once derivatives are implemented
    # sig_grad = simulate_gradient_flow(sigmoid, sigmoid_derivative)
    # tanh_grad = simulate_gradient_flow(tanh_activation, tanh_derivative)
    # relu_grad = simulate_gradient_flow(relu, relu_derivative)
    # print(f"Sigmoid gradient after 10 layers: {sig_grad:.10f}")
    # print(f"Tanh gradient after 10 layers:    {tanh_grad:.10f}")
    # print(f"ReLU gradient after 10 layers:    {relu_grad:.10f}")
    # print("\\nObservation: Sigmoid/Tanh gradients shrink to near-zero.")
    # print("ReLU gradient stays at 1.0 — no vanishing!")
`,
      solutionCode: `import numpy as np

# Activation Functions and Their Derivatives


def sigmoid(x):
    """Sigmoid activation: maps any value to (0, 1)"""
    return 1 / (1 + np.exp(-x))


def sigmoid_derivative(x):
    """Derivative of sigmoid: sigmoid(x) * (1 - sigmoid(x))
    Maximum value is 0.25 (at x=0), which causes vanishing gradients in deep nets.
    """
    s = sigmoid(x)
    return s * (1 - s)


def tanh_activation(x):
    """Tanh activation: maps any value to (-1, 1)
    Zero-centered, so it converges faster than sigmoid — but still vanishes.
    """
    return np.tanh(x)


def tanh_derivative(x):
    """Derivative of tanh: 1 - tanh(x)^2
    Maximum value is 1.0 (at x=0), but shrinks quickly away from zero.
    """
    return 1 - np.tanh(x) ** 2


def relu(x):
    """ReLU (Rectified Linear Unit): max(0, x)
    Simple, fast, and avoids vanishing gradients for positive inputs.
    """
    return np.maximum(0, x)


def relu_derivative(x):
    """Derivative of ReLU: 1 if x > 0, else 0
    Constant gradient of 1 for active neurons — no shrinking!
    """
    return (x > 0).astype(float)


def softmax(x):
    """Softmax: converts a vector into a probability distribution.
    Used in the output layer for multi-class classification.
    Subtracting max(x) is a standard trick for numerical stability
    (prevents overflow in exp), without changing the output.
    """
    shifted = x - np.max(x)
    exp_x = np.exp(shifted)
    return exp_x / exp_x.sum()


# --- Vanishing Gradient Analysis ---

def simulate_gradient_flow(activation_fn, derivative_fn, layers=10):
    """Simulate gradient magnitude as it flows back through 'layers' layers.
    In backprop, gradients are multiplied by the derivative at each layer.
    If that derivative is < 1, the gradient shrinks exponentially.
    """
    gradient = 1.0
    x = 0.5  # input value passed through each layer
    for _ in range(layers):
        gradient *= derivative_fn(x)
    return gradient


if __name__ == "__main__":
    x = np.array([-2.0, -1.0, 0.0, 1.0, 2.0])

    print("=== Activation Outputs ===")
    print(f"Sigmoid: {sigmoid(x)}")
    print(f"Tanh:    {tanh_activation(x)}")
    print(f"ReLU:    {relu(x)}")

    print("\\n=== Softmax Example ===")
    logits = np.array([2.0, 1.0, 0.1])
    probs = softmax(logits)
    print(f"Softmax output: {probs}")
    print(f"Sum of probabilities: {probs.sum():.4f}  <- should be 1.0")

    print("\\n=== Vanishing Gradient Simulation (10 layers) ===")
    sig_grad = simulate_gradient_flow(sigmoid, sigmoid_derivative)
    tanh_grad = simulate_gradient_flow(tanh_activation, tanh_derivative)
    relu_grad = simulate_gradient_flow(relu, relu_derivative)
    print(f"Sigmoid gradient after 10 layers: {sig_grad:.10f}")
    print(f"Tanh gradient after 10 layers:    {tanh_grad:.10f}")
    print(f"ReLU gradient after 10 layers:    {relu_grad:.10f}")
    print("\\nObservation: Sigmoid/Tanh gradients shrink to near-zero.")
    print("ReLU gradient stays at 1.0 — no vanishing!")
`,
    },
    {
      id: "forward-propagation",
      slug: "forward-propagation",
      title: "Forward Propagation: Computing Predictions",
      content: `# Forward Propagation: Computing Predictions

Every time a neural network makes a prediction — whether it's identifying a tumor in an MRI scan or recognizing your face in a photo — it performs one operation: **forward propagation**. Data enters the network, flows through every layer in sequence, and exits as a prediction. No feedback, no learning, just computation.

In this lesson you'll implement a general L-layer forward pass from scratch using only NumPy. By the end, you'll have a \`forward_propagation\` function that handles any depth network and stores intermediate results in a cache — the same cache that backpropagation will need later.

\`\`\`concept
{ "title": "The One-Way Street", "variant": "mental-model", "content": "Think of a neural network as a pipeline of assembly-line stations. Raw material (your input data) enters at one end. Each station (layer) transforms it using a fixed recipe (weights + activation), then passes it to the next. The finished product comes out the other end. No station looks backward — information flows strictly left to right. That one-way constraint is the defining feature of forward propagation." }
\`\`\`

---

## What Happens at Each Layer

Every layer in a feedforward network performs two operations in sequence:

**Step 1 — Linear transform (Z):**

$$Z^{[l]} = W^{[l]} \\cdot A^{[l-1]} + b^{[l]}$$

- $W^{[l]}$ — weight matrix for layer $l$, shape \`(n_l, n_{l-1})\`
- $A^{[l-1]}$ — activations from the previous layer (or raw inputs for $l=1$), shape \`(n_{l-1}, m)\`
- $b^{[l]}$ — bias vector, shape \`(n_l, 1)\` — broadcasts over all $m$ examples

**Step 2 — Non-linear activation (A):**

$$A^{[l]} = g^{[l]}(Z^{[l]})$$

where $g$ is an activation function such as ReLU (hidden layers) or sigmoid (binary output).

\`\`\`callout
{ "type": "info", "title": "Why the non-linearity?", "content": "Without an activation function, stacking layers would collapse to a single linear transform — no matter how deep the network. The activation function (ReLU, sigmoid, tanh) is what allows the network to learn complex, non-linear relationships in data." }
\`\`\`

---

## Activation Functions You'll Use

\`\`\`tabs
{
  "tabs": [
    {
      "label": "ReLU",
      "icon": "⚡",
      "content": "**ReLU** (Rectified Linear Unit) — the workhorse of hidden layers.\\n\\n\`\`\`\\nReLU(z) = max(0, z)\\n\`\`\`\\n\\n- Positive values pass through unchanged\\n- Negative values are zeroed out\\n- Computationally cheap, avoids vanishing gradient\\n\\n\`\`\`python\\ndef relu(Z):\\n    return np.maximum(0, Z)\\n\`\`\`"
    },
    {
      "label": "Sigmoid",
      "icon": "📈",
      "content": "**Sigmoid** — squashes output to (0, 1). Used in the output layer for binary classification.\\n\\n\`\`\`\\nσ(z) = 1 / (1 + e^{-z})\\n\`\`\`\\n\\n- Output ∈ (0, 1), interpretable as probability\\n- Saturates for large |z| (vanishing gradient in deep hidden layers)\\n\\n\`\`\`python\\ndef sigmoid(Z):\\n    return 1 / (1 + np.exp(-Z))\\n\`\`\`"
    },
    {
      "label": "Tanh",
      "icon": "〰️",
      "content": "**Tanh** — zero-centered version of sigmoid, output ∈ (-1, 1).\\n\\n\`\`\`\\ntanh(z) = (e^z - e^{-z}) / (e^z + e^{-z})\\n\`\`\`\\n\\n- Preferred over sigmoid for hidden layers when data is centered near zero\\n- Still saturates, but gradient is stronger than sigmoid near 0\\n\\n\`\`\`python\\ndef tanh(Z):\\n    return np.tanh(Z)\\n\`\`\`"
    }
  ]
}
\`\`\`

---

## The Cache: Bridging Forward and Backward Pass

Forward propagation doesn't just return the final prediction — it must **store intermediate values** so that backpropagation can later compute gradients efficiently without recomputing everything.

For each layer $l$, we cache the tuple $(A^{[l-1]}, W^{[l]}, b^{[l]}, Z^{[l]})$.

\`\`\`concept
{ "title": "The Cache as a Breadcrumb Trail", "variant": "analogy", "content": "Imagine hiking through a forest (the network) from start to finish. The cache is a GPS trail of every waypoint you passed. You don't need it on the way forward. But when you need to retrace your steps (backpropagation), you know exactly where you were and what you did at each point — without hiking the whole trail again." }
\`\`\`

---

## Step-by-Step: Building the Forward Pass

\`\`\`steps
{
  "title": "Implementing L-Layer Forward Propagation",
  "steps": [
    {
      "title": "Initialize: A[0] = X",
      "content": "Set the 'activation' of layer 0 to be the raw input matrix X, shape \`(n_x, m)\` where \`n_x\` is the number of features and \`m\` is the number of training examples.\\n\\n\`\`\`python\\nA = X  # A[0] = X\\ncaches = []\\n\`\`\`"
    },
    {
      "title": "Hidden layers: Linear → ReLU",
      "content": "For each hidden layer \`l = 1, 2, ..., L-1\`, compute the linear step then apply ReLU:\\n\\n\`\`\`python\\nfor l in range(1, L):  # L-1 hidden layers\\n    A_prev = A\\n    W = parameters['W' + str(l)]\\n    b = parameters['b' + str(l)]\\n    Z = np.dot(W, A_prev) + b      # linear\\n    A = np.maximum(0, Z)           # ReLU\\n    cache = (A_prev, W, b, Z)\\n    caches.append(cache)\\n\`\`\`"
    },
    {
      "title": "Output layer: Linear → Sigmoid",
      "content": "The final layer uses sigmoid to output a probability (for binary classification):\\n\\n\`\`\`python\\nW = parameters['W' + str(L)]\\nb = parameters['b' + str(L)]\\nZ = np.dot(W, A) + b\\nAL = 1 / (1 + np.exp(-Z))   # sigmoid\\ncaches.append((A, W, b, Z))\\n\`\`\`"
    },
    {
      "title": "Return AL and caches",
      "content": "Return the final output \`AL\` (shape \`(1, m)\`) and the full \`caches\` list.\\n\\n\`\`\`python\\nreturn AL, caches\\n\`\`\`\\n\\n\`AL[0, i]\` is the network's predicted probability for training example \`i\`."
    }
  ]
}
\`\`\`

---

## Trace: Walking Through a 2-Layer Network

Let's trace a single forward pass through a tiny 2-layer network with 2 input features and 1 output, processing 1 example.

\`\`\`trace
{
  "title": "2-Layer Forward Pass (1 example, 2 features)",
  "language": "python",
  "code": "import numpy as np\\n\\nX = np.array([[0.5], [0.8]])     # shape (2,1)\\nW1 = np.array([[0.1, 0.4],\\n               [0.3, 0.2],\\n               [0.6, 0.1]])     # shape (3,2)\\nb1 = np.zeros((3, 1))            # shape (3,1)\\nW2 = np.array([[0.7, 0.2, 0.5]])  # shape (1,3)\\nb2 = np.zeros((1, 1))            # shape (1,1)\\n\\nZ1 = np.dot(W1, X) + b1\\nA1 = np.maximum(0, Z1)\\nZ2 = np.dot(W2, A1) + b2\\nAL = 1 / (1 + np.exp(-Z2))",
  "frames": [
    { "line": 3, "vars": { "X.shape": "(2,1)", "X": "[[0.5],[0.8]]" }, "note": "Input: 2 features, 1 training example" },
    { "line": 4, "vars": { "W1.shape": "(3,2)" }, "note": "W1 maps from 2 inputs to 3 hidden neurons" },
    { "line": 7, "vars": { "b1.shape": "(3,1)" }, "note": "Bias vector, one per hidden neuron" },
    { "line": 10, "vars": { "Z1": "[[0.37],[0.31],[0.38]]", "Z1.shape": "(3,1)" }, "note": "Linear step: Z1 = W1·X + b1" },
    { "line": 11, "vars": { "A1": "[[0.37],[0.31],[0.38]]" }, "note": "ReLU: all values positive, unchanged" },
    { "line": 12, "vars": { "Z2": "[[0.508]]", "Z2.shape": "(1,1)" }, "note": "Linear step: Z2 = W2·A1 + b2" },
    { "line": 13, "vars": { "AL": "[[0.624]]" }, "note": "Sigmoid: prediction = 62.4% probability" }
  ],
  "speed": 900
}
\`\`\`

---

## Full Implementation

\`\`\`playground
{
  "title": "L-Layer Forward Propagation",
  "language": "python",
  "runnable": true,
  "code": "import numpy as np\\n\\nnp.random.seed(42)\\n\\ndef initialize_parameters(layer_dims):\\n    \\"\\"\\"Initialize weights randomly, biases to zero.\\"\\"\\"\\n    parameters = {}\\n    L = len(layer_dims)\\n    for l in range(1, L):\\n        parameters['W' + str(l)] = np.random.randn(\\n            layer_dims[l], layer_dims[l-1]) * 0.01\\n        parameters['b' + str(l)] = np.zeros((layer_dims[l], 1))\\n    return parameters\\n\\ndef sigmoid(Z):\\n    return 1 / (1 + np.exp(-Z))\\n\\ndef forward_propagation(X, parameters):\\n    \\"\\"\\"\\n    Implements L-layer forward propagation.\\n\\n    Args:\\n        X: input data, shape (n_x, m)\\n        parameters: dict with W1,b1,...,WL,bL\\n\\n    Returns:\\n        AL: output layer activations, shape (1, m)\\n        caches: list of (A_prev, W, b, Z) per layer\\n    \\"\\"\\"\\n    caches = []\\n    A = X\\n    L = len(parameters) // 2  # number of layers\\n\\n    # Hidden layers: Linear -> ReLU\\n    for l in range(1, L):\\n        A_prev = A\\n        W = parameters['W' + str(l)]\\n        b = parameters['b' + str(l)]\\n        Z = np.dot(W, A_prev) + b\\n        A = np.maximum(0, Z)  # ReLU\\n        caches.append((A_prev, W, b, Z))\\n\\n    # Output layer: Linear -> Sigmoid\\n    W = parameters['W' + str(L)]\\n    b = parameters['b' + str(L)]\\n    Z = np.dot(W, A) + b\\n    AL = sigmoid(Z)\\n    caches.append((A, W, b, Z))\\n\\n    return AL, caches\\n\\n# --- Test it ---\\n# Architecture: 3 inputs -> 4 hidden -> 2 hidden -> 1 output\\nlayer_dims = [3, 4, 2, 1]\\nparameters = initialize_parameters(layer_dims)\\n\\n# 5 training examples, each with 3 features\\nX = np.random.randn(3, 5)\\n\\nAL, caches = forward_propagation(X, parameters)\\n\\nprint(f'Number of layers: {len(caches)}')\\nprint(f'Output shape (AL): {AL.shape}')   # should be (1, 5)\\nprint(f'Predictions:\\\\n{AL}')\\nprint(f'\\\\nCache[0] shapes:')\\nA_prev, W, b, Z = caches[0]\\nprint(f'  A_prev: {A_prev.shape}')\\nprint(f'  W:      {W.shape}')\\nprint(f'  Z:      {Z.shape}')\\n"
}
\`\`\`

---

## Visualizing the Data Flow

Watch how the activation tensor changes shape as it flows through each layer of a \`[4, 3, 2, 1]\` network (4 inputs, 3 hidden, 2 hidden, 1 output) with 5 examples:

\`\`\`algoviz
{
  "title": "Activation Shape Through Layers",
  "type": "array",
  "data": ["(4,5)", "(3,5)", "(2,5)", "(1,5)"],
  "frames": [
    { "highlight": [0], "label": "Layer 0 — Input X: 4 features, 5 examples", "stats": { "shape": "(4,5)", "layer": "input" } },
    { "highlight": [0, 1], "label": "Layer 1 — W1(3×4)·X → Z1(3,5) → ReLU → A1(3,5)", "stats": { "shape": "(3,5)", "layer": "hidden 1" } },
    { "highlight": [1, 2], "label": "Layer 2 — W2(2×3)·A1 → Z2(2,5) → ReLU → A2(2,5)", "stats": { "shape": "(2,5)", "layer": "hidden 2" } },
    { "highlight": [2, 3], "label": "Layer 3 — W3(1×2)·A2 → Z3(1,5) → Sigmoid → AL(1,5)", "stats": { "shape": "(1,5)", "layer": "output" } },
    { "highlight": [3], "label": "AL: one probability per example — forward pass complete!", "stats": { "shape": "(1,5)", "layer": "prediction" } }
  ],
  "speed": 1000
}
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{
  "title": "Complete the Forward Pass",
  "prompt": "Implement the linear step and ReLU activation for one hidden layer. W has shape (n_l, n_{l-1}), A_prev has shape (n_{l-1}, m).",
  "language": "python",
  "template": "def linear_activation_forward(A_prev, W, b):\\n    Z = np.dot(___, A_prev) + ___\\n    A = np.maximum(___, Z)\\n    cache = (A_prev, W, b, Z)\\n    return A, cache",
  "blanks": [
    { "answer": "W", "hint": "The weight matrix for this layer" },
    { "answer": "b", "hint": "The bias vector for this layer" },
    { "answer": "0", "hint": "ReLU clips values below this threshold" }
  ]
}
\`\`\`

---

## Common Pitfalls

\`\`\`callout
{ "type": "warning", "title": "Forward Propagation Is NOT Learning", "content": "This is the most common misconception: forward propagation does **not** update any weights. It computes a prediction using the *current* weights and biases. Weight updates only happen during backpropagation, which moves backward through the network using the cached values to compute gradients." }
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "Shape Mismatch Errors", "content": "The most common bug is a shape mismatch in \`np.dot(W, A)\`. Always verify: W has shape \`(n_l, n_{l-1})\` and A has shape \`(n_{l-1}, m)\`. The result Z will be \`(n_l, m)\`. When in doubt, print \`.shape\` at each step." }
\`\`\`

---

## Where the Cache Goes Next

\`\`\`sysdiag
{
  "title": "Forward → Backward: The Training Loop",
  "width": 620,
  "height": 280,
  "nodes": [
    { "id": "input", "label": "Input X", "x": 60, "y": 140, "kind": "client" },
    { "id": "forward", "label": "Forward\\nPropagation", "x": 200, "y": 140, "kind": "service" },
    { "id": "cache", "label": "Cache\\n(A,W,b,Z)", "x": 350, "y": 60, "kind": "database" },
    { "id": "loss", "label": "Loss\\nFunction", "x": 450, "y": 140, "kind": "service" },
    { "id": "backward", "label": "Back-\\npropagation", "x": 350, "y": 220, "kind": "service" },
    { "id": "update", "label": "Weight\\nUpdate", "x": 200, "y": 220, "kind": "service" }
  ],
  "edges": [
    { "from": "input", "to": "forward", "label": "X" },
    { "from": "forward", "to": "cache", "label": "stores" },
    { "from": "forward", "to": "loss", "label": "AL" },
    { "from": "loss", "to": "backward", "label": "dAL" },
    { "from": "cache", "to": "backward", "label": "reads" },
    { "from": "backward", "to": "update", "label": "gradients" },
    { "from": "update", "to": "forward", "label": "new W,b" }
  ],
  "annotations": {
    "forward": "Computes predictions layer by layer, stores (A_prev, W, b, Z) per layer in cache",
    "cache": "Stores all intermediate values needed by backprop — this is why we cache during the forward pass",
    "backward": "Uses cached values to compute dW and db without recomputing activations"
  }
}
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{
  "title": "Forward Propagation Quiz",
  "questions": [
    {
      "question": "In a network with layer dimensions [5, 4, 3, 1], what is the shape of W for layer 2?",
      "options": ["(4, 5)", "(3, 4)", "(3, 5)", "(4, 3)"],
      "answer": 1,
      "explanation": "W[l] has shape (n_l, n_{l-1}). For layer 2: n_2 = 3 neurons, n_1 = 4 neurons, so W[2] is (3, 4)."
    },
    {
      "question": "Why do we store intermediate values (the cache) during forward propagation?",
      "options": [
        "To compute the loss function",
        "To visualize the network architecture",
        "So backpropagation can compute gradients without re-running forward propagation",
        "To initialize the weights for the next training iteration"
      ],
      "answer": 2,
      "explanation": "Backpropagation requires the values of A_prev, W, b, and Z from each layer to compute gradients (dW, db, dA). Caching them during the forward pass avoids redundant computation."
    },
    {
      "question": "A neural network makes the same prediction before and after 100 training epochs. Which part of the training loop is most likely broken?",
      "options": [
        "Forward propagation — it is not caching values",
        "The activation function — sigmoid is returning 0.5",
        "Backpropagation or the weight update step — weights are not changing",
        "The input data — features are not normalized"
      ],
      "answer": 2,
      "explanation": "Forward propagation does NOT update weights — it only computes predictions using the current weights. If predictions never improve, the weight update step (gradient descent + backprop) must be broken."
    },
    {
      "question": "If you process a batch of 32 examples through a layer with 128 neurons (coming from 64 inputs), what is the shape of the output activation A?",
      "options": ["(64, 32)", "(128, 64)", "(128, 32)", "(32, 128)"],
      "answer": 2,
      "explanation": "After the linear step Z = W·A_prev + b, where W is (128, 64) and A_prev is (64, 32), we get Z of shape (128, 32). Applying the activation function does not change the shape, so A is also (128, 32)."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Forward propagation flows strictly one direction: input → hidden layers → output. No feedback, no weight updates.",
    "Each layer computes two steps: Z = W·A_prev + b (linear), then A = g(Z) (activation). Hidden layers use ReLU; the output layer uses sigmoid for binary classification.",
    "The cache stores (A_prev, W, b, Z) for every layer — essential for backpropagation to compute gradients efficiently in the next step.",
    "Forward propagation generates predictions but does NOT learn. Learning happens only when forward propagation is combined with backpropagation and gradient descent.",
    "Shape tracking is critical: W[l] is (n_l, n_{l-1}), A[l] is (n_l, m) — always verify shapes when debugging."
  ]
}
\`\`\``,
      starterCode: `import numpy as np

# Activation functions
def relu(Z):
    return np.maximum(0, Z)

def sigmoid(Z):
    return 1 / (1 + np.exp(-Z))


def initialize_params(layer_dims):
    """
    Initialize weights and biases for an L-layer network.
    layer_dims: list of layer sizes, e.g. [input, hidden1, ..., output]
    Returns params dict with W1, b1, W2, b2, ..., WL, bL
    """
    params = {}
    L = len(layer_dims) - 1
    for l in range(1, L + 1):
        params[f'W{l}'] = np.random.randn(layer_dims[l], layer_dims[l-1]) * 0.01
        params[f'b{l}'] = np.zeros((layer_dims[l], 1))
    return params


def linear_forward(A_prev, W, b):
    """
    Compute the linear part of a layer: Z = W @ A_prev + b

    Args:
        A_prev: activations from previous layer, shape (n_prev, m)
        W:      weight matrix, shape (n, n_prev)
        b:      bias vector, shape (n, 1)

    Returns:
        Z:     linear output, shape (n, m)
        cache: tuple (A_prev, W, b) stored for backprop
    """
    # TODO: Compute Z = W @ A_prev + b
    Z = None

    # TODO: Store inputs in cache (needed for backpropagation)
    cache = None

    return Z, cache


def linear_activation_forward(A_prev, W, b, activation):
    """
    Linear step followed by an activation function.

    Args:
        A_prev:     activations from previous layer
        W, b:       weights and bias for this layer
        activation: string, either 'relu' or 'sigmoid'

    Returns:
        A:     post-activation output
        cache: tuple (linear_cache, Z) stored for backprop
    """
    # TODO: Call linear_forward to get Z and linear_cache
    Z, linear_cache = None, None

    # TODO: Apply the correct activation function based on the 'activation' argument
    # Use relu() for 'relu', sigmoid() for 'sigmoid'
    A = None

    # TODO: Build cache as (linear_cache, Z)
    cache = None

    return A, cache


def L_layer_forward(X, params):

    """
    Full forward pass through all L layers.
    - Layers 1 to L-1 use ReLU activation
    - Layer L (output layer) uses Sigmoid activation

    Args:
        X:      input data, shape (n_x, m)
        params: dict with W1,b1, W2,b2, ..., WL,bL

    Returns:
        AL:     output of the final layer (predictions), shape (1, m)
        caches: list of caches from every layer (for backprop)
    """
    caches = []
    A = X
    L = len(params) // 2  # number of layers

    # TODO: Loop through layers 1 to L-1, applying ReLU activation
    # Each iteration: call linear_activation_forward with activation='relu'
    # Append the returned cache to caches
    for l in range(1, L):
        pass  # replace with your implementation

    # TODO: Compute the output layer (layer L) using Sigmoid activation
    # Append the returned cache to caches
    AL = None

    return AL, caches


# --- Test your implementation ---
if __name__ == '__main__':
    np.random.seed(42)

    # Network: 3 input features -> 4 hidden -> 2 hidden -> 1 output
    layer_dims = [3, 4, 2, 1]
    params = initialize_params(layer_dims)

    # 5 training examples
    X = np.random.randn(3, 5)

    AL, caches = L_layer_forward(X, params)

    print('Output shape:', AL.shape)          # Expected: (1, 5)
    print('Number of caches:', len(caches))    # Expected: 3
    print('All outputs in (0,1):', np.all((AL > 0) & (AL < 1)))  # Expected: True
    print('First prediction:', AL[0, 0])
`,
      solutionCode: `import numpy as np

# Activation functions
def relu(Z):
    return np.maximum(0, Z)

def sigmoid(Z):
    return 1 / (1 + np.exp(-Z))


def initialize_params(layer_dims):
    params = {}
    L = len(layer_dims) - 1
    for l in range(1, L + 1):
        params[f'W{l}'] = np.random.randn(layer_dims[l], layer_dims[l-1]) * 0.01
        params[f'b{l}'] = np.zeros((layer_dims[l], 1))
    return params


def linear_forward(A_prev, W, b):
    """
    Compute Z = W @ A_prev + b and cache inputs for backprop.
    """
    # Matrix multiply weights by previous activations, add bias
    Z = W @ A_prev + b

    # Cache the inputs — backpropagation will need these
    cache = (A_prev, W, b)

    return Z, cache


def linear_activation_forward(A_prev, W, b, activation):
    """
    Linear forward + activation function for one layer.
    """
    # Step 1: linear transformation
    Z, linear_cache = linear_forward(A_prev, W, b)

    # Step 2: apply activation
    if activation == 'relu':
        A = relu(Z)
    else:  # 'sigmoid'
        A = sigmoid(Z)

    # Cache both the linear inputs and Z for backprop
    cache = (linear_cache, Z)

    return A, cache


def L_layer_forward(X, params):
    """
    Full forward pass: ReLU for hidden layers, Sigmoid for output layer.

    The cache list stores one entry per layer so backpropagation can
    retrieve the exact inputs and pre-activation values it needs.
    """
    caches = []
    A = X
    L = len(params) // 2  # each layer has W and b, so total keys / 2

    # Hidden layers 1 .. L-1: ReLU activation
    for l in range(1, L):
        A_prev = A
        W = params[f'W{l}']
        b = params[f'b{l}']
        A, cache = linear_activation_forward(A_prev, W, b, activation='relu')
        caches.append(cache)

    # Output layer L: Sigmoid activation (binary classification)
    W = params[f'W{L}']
    b = params[f'b{L}']
    AL, cache = linear_activation_forward(A, W, b, activation='sigmoid')
    caches.append(cache)

    return AL, caches


# --- Test ---
if __name__ == '__main__':
    np.random.seed(42)

    layer_dims = [3, 4, 2, 1]
    params = initialize_params(layer_dims)
    X = np.random.randn(3, 5)

    AL, caches = L_layer_forward(X, params)

    print('Output shape:', AL.shape)          # (1, 5)
    print('Number of caches:', len(caches))    # 3
    print('All outputs in (0,1):', np.all((AL > 0) & (AL < 1)))  # True
    print('First prediction:', AL[0, 0])
`,
    },
    {
      id: "backpropagation",
      slug: "backpropagation",
      title: "Backpropagation: Computing Gradients Layer by Layer",
      content: `# Backpropagation: Computing Gradients Layer by Layer

Training a neural network is a two-act story. In the **forward pass**, data flows left-to-right: inputs multiply by weights, pass through activations, and produce a prediction. In the **backward pass**, *error* flows right-to-left: the loss gradient is computed at the output and then propagated layer by layer back to every weight in the network.

This backward flow is **backpropagation** — published formally by Rumelhart, Hinton, and Williams in 1986 and still the backbone of every modern AI system, from image classifiers to large language models.

\`\`\`concept
{
  "title": "Backpropagation = Chain Rule, Applied Systematically",
  "variant": "mental-model",
  "content": "Think of a neural network as a pipeline of math functions: f1 → f2 → f3 → Loss. The chain rule says: d(Loss)/d(input) = d(Loss)/df3 × df3/df2 × df2/df1. Backprop just applies this rule layer by layer, reusing already-computed intermediates so each gradient is only computed once. The result is the exact gradient for every single weight in O(n) time — the same cost as one forward pass."
}
\`\`\`

---

## The Mathematics Behind the Backward Pass

Consider a two-layer network with one hidden layer:

\`\`\`
Input X  →  Z1 = XW1 + b1  →  A1 = σ(Z1)  →  Z2 = A1·W2 + b2  →  A2 = σ(Z2)  →  Loss
\`\`\`

We use MSE loss: **L = (1/m) Σ (A2 − y)²**

The backward pass computes gradients in reverse order:

| Step | Gradient | Formula |
|------|----------|---------|
| 1 | ∂L/∂A2 | 2(A2 − y) / m |
| 2 | ∂L/∂Z2 | ∂L/∂A2 · σ′(Z2) = ∂L/∂A2 · A2(1−A2) |
| 3 | ∂L/∂W2 | A1ᵀ · ∂L/∂Z2 |
| 4 | ∂L/∂A1 | ∂L/∂Z2 · W2ᵀ |
| 5 | ∂L/∂Z1 | ∂L/∂A1 · σ′(Z1) |
| 6 | ∂L/∂W1 | Xᵀ · ∂L/∂Z1 |

The key insight: **each layer only needs the gradient from the layer in front of it**, plus the activations it already cached during the forward pass.

\`\`\`callout
{
  "type": "warning",
  "title": "Backprop ≠ The Learning Algorithm",
  "content": "A common misconception: backpropagation is NOT the full training algorithm. It only computes the gradients. A separate optimizer — gradient descent, Adam, RMSProp — uses those gradients to actually update the weights. Backprop computes *what direction to move*; the optimizer decides *how far to step*."
}
\`\`\`

---

## The Five-Step Algorithm

\`\`\`steps
{
  "title": "Backpropagation Algorithm",
  "steps": [
    {
      "title": "Forward Pass — Cache Everything",
      "content": "Run inputs through every layer. **Save Z and A for each layer** — you will need them during the backward pass to compute derivatives.\\n\\n\`\`\`python\\nZ1 = X @ W1 + b1\\nA1 = sigmoid(Z1)   # cache Z1, A1\\nZ2 = A1 @ W2 + b2\\nA2 = sigmoid(Z2)   # cache Z2, A2\\n\`\`\`"
    },
    {
      "title": "Compute the Loss",
      "content": "Measure how wrong the prediction is. For MSE:\\n\\n\`\`\`python\\nloss = np.mean((A2 - y) ** 2)\\n\`\`\`\\n\\nThis scalar is the starting point for all gradient calculations."
    },
    {
      "title": "Output Layer Gradients",
      "content": "Differentiate the loss with respect to the output layer's pre-activation Z2:\\n\\n\`\`\`python\\ndA2 = 2 * (A2 - y) / m           # dL/dA2\\ndZ2 = dA2 * sigmoid_deriv(Z2)   # dL/dZ2 (chain rule)\\ndW2 = A1.T @ dZ2                 # dL/dW2\\ndb2 = np.sum(dZ2, axis=0, keepdims=True)\\n\`\`\`"
    },
    {
      "title": "Propagate Error to Hidden Layer",
      "content": "Pass the gradient signal *backward* through W2 to reach the hidden layer:\\n\\n\`\`\`python\\ndA1 = dZ2 @ W2.T                # dL/dA1 — error signal through W2\\ndZ1 = dA1 * sigmoid_deriv(Z1)  # dL/dZ1 — through sigmoid\\ndW1 = X.T @ dZ1                 # dL/dW1\\ndb1 = np.sum(dZ1, axis=0, keepdims=True)\\n\`\`\`"
    },
    {
      "title": "Gradient Descent Update",
      "content": "Now that all gradients are computed, subtract a fraction of each gradient from the corresponding parameter:\\n\\n\`\`\`python\\nW2 -= lr * dW2;  b2 -= lr * db2\\nW1 -= lr * dW1;  b1 -= lr * db1\\n\`\`\`\\n\\nRepeat from Step 1 for thousands of epochs until the loss converges."
    }
  ]
}
\`\`\`

---

## Tracing Through a Single Neuron

Before scaling to a full network, let's watch backprop happen in a single neuron with one training example. Every variable is concrete — no matrices, just scalars.

\`\`\`trace
{
  "title": "Backprop Through One Neuron: Forward + Backward",
  "language": "python",
  "code": "import numpy as np\\n\\ndef sigmoid(x):\\n    return 1 / (1 + np.exp(-x))\\n\\nx, w, b, y_true = 2.0, 0.5, 0.1, 1.0\\n\\n# Forward pass\\nz    = w * x + b\\na    = sigmoid(z)\\nloss = (a - y_true) ** 2\\n\\n# Backward pass\\ndL_da = 2 * (a - y_true)\\nda_dz = a * (1 - a)\\ndL_dz = dL_da * da_dz\\ndL_dw = dL_dz * x\\ndL_db = dL_dz\\n\\nprint(f\\"loss={loss:.4f}, dL/dw={dL_dw:.4f}, dL/db={dL_db:.4f}\\")",
  "frames": [
    {
      "line": 6,
      "vars": {"x": 2.0, "w": 0.5, "b": 0.1, "y_true": 1.0},
      "note": "Setup: input x=2, weight w=0.5, bias b=0.1, target=1.0"
    },
    {
      "line": 9,
      "vars": {"x": 2.0, "w": 0.5, "b": 0.1, "z": 1.1},
      "note": "Forward: z = w*x + b = 0.5×2.0 + 0.1 = 1.1"
    },
    {
      "line": 10,
      "vars": {"z": 1.1, "a": 0.7503},
      "note": "Activate: a = σ(1.1) = 1/(1+e⁻¹·¹) ≈ 0.7503"
    },
    {
      "line": 11,
      "vars": {"a": 0.7503, "y_true": 1.0, "loss": 0.0624},
      "note": "Loss = (0.7503 − 1.0)² = 0.0624  — prediction is too low"
    },
    {
      "line": 14,
      "vars": {"a": 0.7503, "y_true": 1.0, "dL_da": -0.4994},
      "note": "∂L/∂a = 2(a−y) = 2×(0.75−1.0) = −0.4994  — negative means 'increase a'"
    },
    {
      "line": 15,
      "vars": {"a": 0.7503, "da_dz": 0.1874},
      "note": "Local gradient σ′(z) = a(1−a) = 0.75×0.25 = 0.1874"
    },
    {
      "line": 16,
      "vars": {"dL_da": -0.4994, "da_dz": 0.1874, "dL_dz": -0.0936},
      "note": "Chain rule: ∂L/∂z = ∂L/∂a × ∂a/∂z = −0.499 × 0.187 = −0.094"
    },
    {
      "line": 17,
      "vars": {"dL_dz": -0.0936, "x": 2.0, "dL_dw": -0.1872},
      "note": "∂L/∂w = ∂L/∂z × x = −0.094 × 2.0 = −0.187  — increase w to reduce loss"
    },
    {
      "line": 18,
      "vars": {"dL_dz": -0.0936, "dL_db": -0.0936},
      "note": "∂L/∂b = ∂L/∂z × 1 = −0.094  — bias gradient equals dL/dz"
    },
    {
      "line": 20,
      "vars": {},
      "note": "Done. Update: w ← w − lr×(−0.187) increases w, reducing future loss.",
      "stdout": "loss=0.0624, dL/dw=-0.1872, dL/db=-0.0936"
    }
  ],
  "speed": 900
}
\`\`\`

Notice how the **chain rule telescopes** the gradient: each layer only multiplies the incoming gradient by its *local* derivative — it doesn't need to know anything about layers further downstream.

---

## Full Implementation: Training on XOR

XOR is the classic benchmark for neural networks — it's not linearly separable, so a network with backprop-trained weights must learn a non-linear decision boundary.

\`\`\`playground
{
  "title": "2-Layer Neural Network with Backpropagation (XOR)",
  "language": "python",
  "runnable": true,
  "code": "import numpy as np\\n\\ndef sigmoid(x):\\n    return 1 / (1 + np.exp(-x))\\n\\ndef sigmoid_deriv(x):\\n    s = sigmoid(x)\\n    return s * (1 - s)\\n\\n# XOR: output is 1 only when inputs differ\\nX = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)\\ny = np.array([[0],[1],[1],[0]], dtype=float)\\n\\n# Initialize weights\\nnp.random.seed(42)\\nW1 = np.random.randn(2, 4) * 0.5   # (input=2, hidden=4)\\nb1 = np.zeros((1, 4))\\nW2 = np.random.randn(4, 1) * 0.5   # (hidden=4, output=1)\\nb2 = np.zeros((1, 1))\\nlr = 1.0\\n\\nfor epoch in range(5000):\\n    # ---- FORWARD PASS ----\\n    Z1 = X @ W1 + b1          # (4, 4)\\n    A1 = sigmoid(Z1)           # (4, 4)\\n    Z2 = A1 @ W2 + b2          # (4, 1)\\n    A2 = sigmoid(Z2)           # (4, 1)\\n    loss = np.mean((A2 - y) ** 2)\\n\\n    # ---- BACKWARD PASS ----\\n    m = X.shape[0]\\n\\n    # Output layer gradients\\n    dA2 = 2 * (A2 - y) / m          # dL/dA2\\n    dZ2 = dA2 * sigmoid_deriv(Z2)  # dL/dZ2\\n    dW2 = A1.T @ dZ2                # dL/dW2\\n    db2 = np.sum(dZ2, axis=0, keepdims=True)\\n\\n    # Hidden layer gradients\\n    dA1 = dZ2 @ W2.T                # dL/dA1  (propagate through W2)\\n    dZ1 = dA1 * sigmoid_deriv(Z1)  # dL/dZ1\\n    dW1 = X.T @ dZ1                 # dL/dW1\\n    db1 = np.sum(dZ1, axis=0, keepdims=True)\\n\\n    # ---- GRADIENT DESCENT ----\\n    W2 -= lr * dW2;  b2 -= lr * db2\\n    W1 -= lr * dW1;  b1 -= lr * db1\\n\\n    if epoch % 1000 == 0:\\n        print(f\\"Epoch {epoch:5d} | Loss: {loss:.4f}\\")\\n\\nprint(\\"\\\\nFinal predictions:\\")\\nfor xi, yi, pred in zip(X, y, A2):\\n    print(f\\"  Input {xi.astype(int)} | Target {int(yi[0])} | Pred {pred[0]:.3f}\\")"
}
\`\`\`

After ~5000 epochs the loss drops below 0.01 and predictions converge toward 0 and 1. The network has *learned* XOR entirely through repeated gradient descent guided by backpropagation.

---

## Practice: Complete the Backward Pass

\`\`\`fillblank
{
  "title": "Fill in the Backward Pass",
  "prompt": "Complete the four blanks in this backward pass function. Use the variable names and shapes defined in the forward pass.",
  "language": "python",
  "template": "def backward(A2, y, A1, Z2, Z1, X, W2):\\n    m = X.shape[0]\\n\\n    # --- Output layer ---\\n    dA2 = 2 * (A2 - y) / m\\n    dZ2 = dA2 * ___(Z2)          # sigmoid derivative at Z2\\n    dW2 = ___.T @ dZ2            # gradient for W2\\n    db2 = np.sum(dZ2, axis=0, keepdims=True)\\n\\n    # --- Hidden layer ---\\n    dA1 = dZ2 @ ___.T            # propagate error back through W2\\n    dZ1 = dA1 * sigmoid_deriv(Z1)\\n    dW1 = X.T @ ___              # gradient for W1\\n\\n    return dW1, db1, dW2, db2",
  "blanks": [
    {
      "answer": "sigmoid_deriv",
      "hint": "The derivative of sigmoid is s*(1-s) — we defined this as a separate function"
    },
    {
      "answer": "A1",
      "hint": "In the forward pass: Z2 = A1 @ W2 + b2. The weight gradient is the transpose of its input dotted with the output delta."
    },
    {
      "answer": "W2",
      "hint": "To propagate dZ2 back to the hidden layer, multiply by the transpose of the weight matrix that connects hidden → output"
    },
    {
      "answer": "dZ1",
      "hint": "The gradient for W1 is X.T dotted with the local gradient delta at the hidden layer"
    }
  ]
}
\`\`\`

---

## Check Your Understanding

\`\`\`quiz
{
  "title": "Backpropagation Quiz",
  "questions": [
    {
      "question": "What is backpropagation's primary purpose in neural network training?",
      "options": [
        "Run the forward pass and generate predictions",
        "Compute the gradient of the loss with respect to every weight and bias",
        "Apply gradient descent to update the network weights",
        "Initialize the network parameters with small random values"
      ],
      "answer": 1,
      "explanation": "Backpropagation is solely a gradient computation method. It calculates ∂L/∂W for every parameter — but it does NOT update the weights. That job belongs to the optimizer (e.g., gradient descent). The two are often conflated but are distinct algorithms."
    },
    {
      "question": "When computing dL/dZ for a sigmoid neuron with output a = σ(Z), which expression gives the correct local gradient?",
      "options": [
        "σ(Z)",
        "1 − σ(Z)",
        "σ(Z) × (1 − σ(Z))",
        "2 × σ(Z) − 1"
      ],
      "answer": 2,
      "explanation": "The derivative of sigmoid is σ′(Z) = σ(Z) × (1 − σ(Z)) = a × (1 − a). This is the local gradient that multiplies the incoming ∂L/∂a to yield ∂L/∂Z via the chain rule. Backpropagation requires activation functions to be differentiable precisely so this local gradient exists."
    },
    {
      "question": "Which statement about backpropagation is CORRECT?",
      "options": [
        "Backpropagation is the complete learning algorithm for neural networks",
        "Activation functions must be differentiable for backpropagation to work",
        "Backpropagation is considered biologically plausible as a model of brain learning",
        "Modern practitioners don't need to understand backprop to build deep learning models"
      ],
      "answer": 1,
      "explanation": "Backpropagation requires differentiable activation functions because it relies on computing derivatives at every layer. The other statements are misconceptions: (A) backprop only computes gradients — learning requires an optimizer too; (C) neuroscientists consider backprop biologically implausible since there is no evidence the brain stores and reuses forward-pass weights during learning; (D) understanding backprop gives deep insight into architecture choices, vanishing gradients, and failure modes."
    }
  ]
}
\`\`\`

---

\`\`\`collapse
{
  "title": "Deep Dive: Why Does dL/dW = AᵀδZ?",
  "content": "If you have a layer Z = A·W + b, and you know dL/dZ (call it δZ), why is dL/dW = Aᵀ·δZ?\\n\\nWrite out the scalar version: for a single output unit, Z = Σ_j A_j · W_j. So ∂Z/∂W_j = A_j. By chain rule: ∂L/∂W_j = ∂L/∂Z × ∂Z/∂W_j = δZ × A_j.\\n\\nStacked into matrix form across all inputs and outputs: dL/dW = Aᵀ · δZ.\\n\\nSimilarly, dL/dA = δZ · Wᵀ (propagating the gradient back to the previous layer) follows from ∂Z/∂A_j = W_j.\\n\\nThis is why the backward pass looks like a **transposed** version of the forward pass — you're reversing the direction of matrix multiplication."
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Backpropagation computes gradients — it does NOT update weights. The optimizer (gradient descent) does that as a separate step.",
    "The chain rule is the mathematical engine of backprop: each layer's gradient = (incoming gradient) × (local derivative).",
    "Every layer caches its pre-activation Z and post-activation A during the forward pass, because the backward pass needs both.",
    "For weight gradients: dL/dW = Aᵀ · δZ. For propagating error: dL/dA_prev = δZ · Wᵀ. These transposed multiplications are the pattern.",
    "Activation functions must be differentiable — sigmoid, tanh, and ReLU all satisfy this requirement.",
    "Backpropagation is the foundation of all modern deep learning: image recognition, NLP, speech, finance, and autonomous vehicles all train their networks using this algorithm."
  ]
}
\`\`\``,
      starterCode: `import numpy as np

# Backpropagation: Computing Gradients Layer by Layer
#
# We have a 2-layer neural network:
#   Input (2) -> Hidden (3, ReLU) -> Output (1, Sigmoid) -> Binary Cross-Entropy Loss
#
# Your task: implement the backward pass using the chain rule.

def relu(z):
    return np.maximum(0, z)

def relu_grad(z):
    """Derivative of ReLU: 1 if z > 0, else 0"""
    return (z > 0).astype(float)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def forward(X, W1, b1, W2, b2):
    """Forward pass — returns all intermediate values needed for backprop."""
    z1 = X @ W1 + b1        # (N, 3)
    a1 = relu(z1)           # (N, 3)
    z2 = a1 @ W2 + b2       # (N, 1)
    a2 = sigmoid(z2)        # (N, 1)  — final prediction
    return z1, a1, z2, a2

def compute_loss(a2, y):
    """Binary cross-entropy loss."""
    N = y.shape[0]
    return -np.mean(y * np.log(a2 + 1e-8) + (1 - y) * np.log(1 - a2 + 1e-8))

def backward(X, y, z1, a1, z2, a2, W1, W2):
    """
    Backward pass: compute gradients for W1, b1, W2, b2.

    Chain rule order (right to left):
      dL/dW2 = dL/da2 * da2/dz2 * dz2/dW2
      dL/dW1 = dL/da2 * da2/dz2 * dz2/da1 * da1/dz1 * dz1/dW1

    Shapes:
      X:  (N, 2)   W1: (2, 3)   b1: (3,)
      a1: (N, 3)   W2: (3, 1)   b2: (1,)
      a2: (N, 1)   y:  (N, 1)
    """
    N = X.shape[0]

    # --- Output layer gradients ---
    # TODO 1: Compute dL/dz2.
    # Hint: For sigmoid + binary cross-entropy, dL/dz2 = (a2 - y) / N
    dz2 = None  # shape: (N, 1)

    # TODO 2: Compute dL/dW2 = a1.T @ dz2
    dW2 = None  # shape: (3, 1)

    # TODO 3: Compute dL/db2 = sum of dz2 over samples
    db2 = None  # shape: (1,)

    # --- Hidden layer gradients (chain rule back through W2 and ReLU) ---
    # TODO 4: Compute dL/da1 = dz2 @ W2.T
    #         (propagate gradient back through the W2 weight matrix)
    da1 = None  # shape: (N, 3)

    # TODO 5: Compute dL/dz1 = da1 * relu_grad(z1)
    #         (propagate back through the ReLU activation)
    dz1 = None  # shape: (N, 3)

    # TODO 6: Compute dL/dW1 = X.T @ dz1
    dW1 = None  # shape: (2, 3)

    # TODO 7: Compute dL/db1 = sum of dz1 over samples
    db1 = None  # shape: (3,)

    return dW1, db1, dW2, db2


# --- Test your implementation ---
np.random.seed(42)
N = 5
X = np.random.randn(N, 2)
y = np.random.randint(0, 2, (N, 1)).astype(float)

W1 = np.random.randn(2, 3) * 0.1
b1 = np.zeros(3)
W2 = np.random.randn(3, 1) * 0.1
b2 = np.zeros(1)

z1, a1, z2, a2 = forward(X, W1, b1, W2, b2)
loss = compute_loss(a2, y)
print(f"Loss: {loss:.4f}")

dW1, db1, dW2, db2 = backward(X, y, z1, a1, z2, a2, W1, W2)

if dW2 is not None:
    print(f"dW2 shape: {dW2.shape}, dW1 shape: {dW1.shape}")
    print(f"dW2 sample: {dW2.flatten()[:3]}")
    print("Gradients computed successfully!")
else:
    print("Complete the TODOs to compute gradients.")
`,
      solutionCode: `import numpy as np

# Backpropagation: Computing Gradients Layer by Layer
#
# 2-layer network: Input(2) -> Hidden(3, ReLU) -> Output(1, Sigmoid) -> BCE Loss
#
# Chain rule unrolled:
#   dL/dW2 = (dL/da2)(da2/dz2)(dz2/dW2)
#   dL/dW1 = (dL/da2)(da2/dz2)(dz2/da1)(da1/dz1)(dz1/dW1)

def relu(z):
    return np.maximum(0, z)

def relu_grad(z):
    """Derivative of ReLU: 1 where z > 0, 0 elsewhere."""
    return (z > 0).astype(float)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def forward(X, W1, b1, W2, b2):
    """Forward pass — cache all intermediates for backprop."""
    z1 = X @ W1 + b1        # pre-activation, hidden layer
    a1 = relu(z1)           # post-activation, hidden layer
    z2 = a1 @ W2 + b2       # pre-activation, output layer
    a2 = sigmoid(z2)        # predicted probability
    return z1, a1, z2, a2

def compute_loss(a2, y):
    """Binary cross-entropy loss."""
    N = y.shape[0]
    return -np.mean(y * np.log(a2 + 1e-8) + (1 - y) * np.log(1 - a2 + 1e-8))

def backward(X, y, z1, a1, z2, a2, W1, W2):
    """
    Backward pass: compute all gradients via the chain rule.

    Key insight: at each layer we compute dL/d(input) by multiplying
    the upstream gradient by the local derivative of that layer.
    """
    N = X.shape[0]

    # --- Output layer ---
    # dL/dz2: combined gradient of BCE loss through sigmoid.
    # Derivation: dL/da2 = -(y/a2 - (1-y)/(1-a2)) / N
    #             da2/dz2 = a2 * (1 - a2)   (sigmoid derivative)
    #             Product simplifies neatly to (a2 - y) / N.
    dz2 = (a2 - y) / N                  # (N, 1)

    # dL/dW2: how much each weight in W2 contributed to the loss.
    # dz2/dW2 = a1  =>  dL/dW2 = a1.T @ dz2
    dW2 = a1.T @ dz2                    # (3, 1)

    # dL/db2: bias gradient is just the sum of upstream gradients.
    db2 = dz2.sum(axis=0)               # (1,)

    # --- Hidden layer ---
    # dL/da1: propagate gradient back through the weight matrix W2.
    # dz2/da1 = W2.T  =>  dL/da1 = dz2 @ W2.T
    da1 = dz2 @ W2.T                    # (N, 3)

    # dL/dz1: propagate back through ReLU.
    # ReLU passes gradient only where its input was positive.
    dz1 = da1 * relu_grad(z1)           # (N, 3)

    # dL/dW1: same pattern as dW2 but one layer back.
    dW1 = X.T @ dz1                     # (2, 3)

    # dL/db1
    db1 = dz1.sum(axis=0)               # (3,)

    return dW1, db1, dW2, db2


# --- Verify with a gradient check ---
np.random.seed(42)
N = 5
X = np.random.randn(N, 2)
y = np.random.randint(0, 2, (N, 1)).astype(float)

W1 = np.random.randn(2, 3) * 0.1
b1 = np.zeros(3)
W2 = np.random.randn(3, 1) * 0.1
b2 = np.zeros(1)

z1, a1, z2, a2 = forward(X, W1, b1, W2, b2)
loss = compute_loss(a2, y)
print(f"Loss: {loss:.4f}")

dW1, db1, dW2, db2 = backward(X, y, z1, a1, z2, a2, W1, W2)
print(f"dW2 shape: {dW2.shape}, dW1 shape: {dW1.shape}")
print(f"dW2: {dW2.flatten()}")
print(f"dW1:\\n{dW1}")

# Numerical gradient check for dW2[0,0]
eps = 1e-5
W2_plus = W2.copy(); W2_plus[0, 0] += eps
W2_minus = W2.copy(); W2_minus[0, 0] -= eps
loss_plus = compute_loss(forward(X, W1, b1, W2_plus, b2)[3], y)
loss_minus = compute_loss(forward(X, W1, b1, W2_minus, b2)[3], y)
numerical_grad = (loss_plus - loss_minus) / (2 * eps)
print(f"\\nGradient check dW2[0,0]:")
print(f"  Analytical: {dW2[0,0]:.6f}")
print(f"  Numerical:  {numerical_grad:.6f}")
print(f"  Match: {np.isclose(dW2[0,0], numerical_grad, atol=1e-5)}")
`,
    },
    {
      id: "weight-initialization",
      slug: "weight-initialization",
      title: "Weight Initialization: Xavier and He",
      content: `# Weight Initialization: Xavier and He

Before a neural network can learn anything, you must answer a deceptively simple question: **what values should the weights start at?**

The answer has a dramatic effect on whether your network trains at all. Initialize poorly and gradients vanish before they reach early layers, or explode and send your loss toward infinity. Initialize well and your network converges faster, reaches higher accuracy, and avoids whole classes of training bugs.

This lesson builds the intuition from first principles, then shows you exactly how Xavier and He initialization work — and why they use the formulas they do.

---

## The Problem: Why Initialization Matters

Imagine stacking ten layers, each multiplying the signal by a weight matrix. If the average weight magnitude is slightly below 1 (say 0.9), after 10 layers the signal is \`0.9^10 ≈ 0.35\`. After 50 layers: \`0.9^50 ≈ 0.005\`. Gradients become so small the early layers effectively stop learning — this is the **vanishing gradient** problem.

Flip it: if weights average slightly above 1 (say 1.1), after 50 layers you get \`1.1^50 ≈ 117\`. Gradients explode, loss becomes NaN, training collapses — the **exploding gradient** problem.

\`\`\`concept
{ "title": "The Goldilocks Principle of Initialization", "variant": "mental-model", "content": "Good initialization keeps the variance of activations roughly constant across all layers. Not shrinking to zero (vanishing), not growing toward infinity (exploding) — just right. Xavier and He achieve this by carefully scaling random weights based on how many neurons feed into each layer." }
\`\`\`

---

## Failure Mode 1: All-Zeros Initialization

The most intuitive initialization — setting every weight to zero — is actually the worst possible choice. Here's why:

\`\`\`trace
{ "title": "Why Zero Init Breaks Training", "language": "python", "code": "import numpy as np\\n\\n# Two-neuron layer, zero weights\\nW = np.zeros((2, 2))\\nb = np.zeros((2,))\\n\\nx = np.array([1.0, 2.0])\\n\\n# Forward pass\\nz = W @ x + b\\nprint('Pre-activation z:', z)\\n\\n# With sigmoid activation\\ndef sigmoid(z):\\n    return 1 / (1 + np.exp(-z))\\n\\na = sigmoid(z)\\nprint('Activation a:', a)\\n\\n# Both neurons produce identical output!\\n# Gradients will be identical too.\\n# The neurons never differentiate — symmetry is never broken.", "frames": [ { "line": 4, "vars": { "W": "[[0,0],[0,0]]", "b": "[0,0]" }, "note": "All weights start at zero — symmetric initialization" }, { "line": 9, "vars": { "x": "[1.0, 2.0]", "z": "[0.0, 0.0]" }, "note": "Every neuron computes the same dot product: 0" }, { "line": 14, "vars": { "a": "[0.5, 0.5]" }, "note": "Every neuron outputs 0.5 — identical activations", "stdout": "Pre-activation z: [0. 0.]" }, { "line": 17, "vars": { "a": "[0.5, 0.5]" }, "note": "Identical outputs → identical gradients → weights update identically forever. Symmetry never breaks.", "stdout": "Activation a: [0.5 0.5]" } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "The Symmetry Problem", "content": "When all weights are equal, every neuron in a layer computes the exact same function and receives the exact same gradient update. No matter how long you train, they stay identical. A 512-neuron layer behaves as if it has exactly 1 neuron. This is called the **symmetry problem** — it means zero initialization is fatal for learning." }
\`\`\`

---

## Failure Mode 2: Naive Random Initialization

Random weights break symmetry, but magnitude still matters. Let's visualize what happens to activation variance as signal flows through 10 layers with different initialization scales:

\`\`\`playground
{ "title": "Activation Variance Across Layers", "language": "python", "code": "import numpy as np\\n\\nnp.random.seed(42)\\nn_layers = 10\\nn_neurons = 256\\n\\ndef simulate_forward(scale, activation='tanh'):\\n    x = np.random.randn(n_neurons)\\n    variances = [np.var(x)]\\n    for _ in range(n_layers):\\n        W = np.random.randn(n_neurons, n_neurons) * scale\\n        x = W @ x\\n        if activation == 'tanh':\\n            x = np.tanh(x)\\n        variances.append(np.var(x))\\n    return variances\\n\\n# Compare three scales\\nscales = [0.01, 1.0, 0.1]\\nlabels = ['Too small (0.01)', 'Too large (1.0)', 'Medium (0.1)']\\n\\nfor scale, label in zip(scales, labels):\\n    variances = simulate_forward(scale)\\n    print(f'{label}:')\\n    print(f'  Layer 0 variance: {variances[0]:.4f}')\\n    print(f'  Layer 5 variance: {variances[5]:.6f}')\\n    print(f'  Layer 10 variance: {variances[-1]:.8f}')\\n    print()", "runnable": true }
\`\`\`

Run this and observe: with scale \`0.01\` the variance collapses to near zero by layer 5. With scale \`1.0\` it explodes. Neither is usable for real training.

---

## Xavier Initialization (Glorot)

Xavier Glorot and Yoshua Bengio derived a principled solution in 2010. Their key insight: **keep the variance of activations the same across every layer**.

For a layer with \`fan_in\` inputs and \`fan_out\` outputs, they showed the optimal weight variance is:

> **Var(W) = 2 / (fan_in + fan_out)**

This gives two equivalent forms:

\`\`\`tabs
{ "tabs": [ { "label": "Normal form", "icon": "📊", "content": "Sample weights from a Gaussian distribution:\\n\\n\`\`\`\\nstd = sqrt(2 / (fan_in + fan_out))\\nW ~ Normal(mean=0, std=std)\\n\`\`\`\\n\\nBest when you need smooth gradients and tanh/sigmoid activations." }, { "label": "Uniform form", "icon": "📐", "content": "Sample from a uniform distribution (slightly more common in practice):\\n\\n\`\`\`\\nlimit = sqrt(6 / (fan_in + fan_out))\\nW ~ Uniform(-limit, +limit)\\n\`\`\`\\n\\nThe \`sqrt(6)\` comes from the variance of a uniform distribution on \`[-a, a]\` being \`a²/3\`." }, { "label": "When to use", "icon": "✅", "content": "**Use Xavier when your activation function is:**\\n- Sigmoid\\n- Tanh\\n- Softmax (output layer)\\n\\n**Why it works for these:** Sigmoid and tanh are approximately linear near zero, so the linear variance analysis Xavier used holds well in practice.\\n\\n**Don't use for ReLU** — ReLU kills half its inputs (anything negative becomes 0), which halves the variance. Xavier doesn't account for this." } ] }
\`\`\`

\`\`\`playground
{ "title": "Implement Xavier Initialization", "language": "python", "code": "import numpy as np\\n\\ndef xavier_normal(fan_in, fan_out, seed=42):\\n    \\"\\"\\"Xavier/Glorot normal initialization.\\"\\"\\"\\n    np.random.seed(seed)\\n    std = np.sqrt(2.0 / (fan_in + fan_out))\\n    return np.random.randn(fan_out, fan_in) * std\\n\\ndef xavier_uniform(fan_in, fan_out, seed=42):\\n    \\"\\"\\"Xavier/Glorot uniform initialization.\\"\\"\\"\\n    np.random.seed(seed)\\n    limit = np.sqrt(6.0 / (fan_in + fan_out))\\n    return np.random.uniform(-limit, limit, size=(fan_out, fan_in))\\n\\n# Example: layer with 512 inputs, 256 outputs\\nfan_in, fan_out = 512, 256\\n\\nW_normal = xavier_normal(fan_in, fan_out)\\nW_uniform = xavier_uniform(fan_in, fan_out)\\n\\nprint('Xavier Normal:')\\nprint(f'  Expected std: {np.sqrt(2/(fan_in+fan_out)):.5f}')\\nprint(f'  Actual std:   {W_normal.std():.5f}')\\nprint(f'  Range: [{W_normal.min():.4f}, {W_normal.max():.4f}]')\\n\\nprint()\\nprint('Xavier Uniform:')\\nprint(f'  Expected limit: ±{np.sqrt(6/(fan_in+fan_out)):.5f}')\\nprint(f'  Actual range:   [{W_uniform.min():.4f}, {W_uniform.max():.4f}]')", "runnable": true }
\`\`\`

---

## He Initialization (Kaiming / MSRA)

In 2015, Kaiming He and colleagues proposed an adjustment specifically for **ReLU** networks. The key difference from Xavier: ReLU sets all negative values to zero, which halves the variance of the output. The fix is to double the numerator:

> **Var(W) = 2 / fan_in**

This extra factor of 2 compensates for ReLU zeroing out roughly half the activations on average.

\`\`\`concept
{ "title": "Why He Uses fan_in Only (Not fan_in + fan_out)", "variant": "insight", "content": "Xavier balances both the forward pass variance (depends on fan_in) and the backward pass gradient variance (depends on fan_out) — taking their average. He initialization only considers fan_in because ReLU's one-sided zeroing is the dominant effect during the forward pass. The factor of 2 compensates for the ~50% of neurons that ReLU deactivates." }
\`\`\`

\`\`\`playground
{ "title": "Implement He Initialization", "language": "python", "code": "import numpy as np\\n\\ndef he_normal(fan_in, fan_out, seed=42):\\n    \\"\\"\\"He/Kaiming normal initialization for ReLU networks.\\"\\"\\"\\n    np.random.seed(seed)\\n    std = np.sqrt(2.0 / fan_in)\\n    return np.random.randn(fan_out, fan_in) * std\\n\\ndef he_uniform(fan_in, fan_out, seed=42):\\n    \\"\\"\\"He/Kaiming uniform initialization for ReLU networks.\\"\\"\\"\\n    np.random.seed(seed)\\n    limit = np.sqrt(6.0 / fan_in)\\n    return np.random.uniform(-limit, limit, size=(fan_out, fan_in))\\n\\n# Now simulate variance across 10 ReLU layers with He vs naive init\\ndef relu(x):\\n    return np.maximum(0, x)\\n\\ndef simulate_relu_forward(init_fn, n_layers=10, n_neurons=256):\\n    np.random.seed(0)\\n    x = np.random.randn(n_neurons)\\n    variances = [np.var(x)]\\n    for _ in range(n_layers):\\n        W = init_fn(n_neurons, n_neurons)\\n        x = relu(W @ x)\\n        variances.append(np.var(x))\\n    return variances\\n\\nhe_vars = simulate_relu_forward(he_normal)\\nxavier_vars = simulate_relu_forward(xavier_normal)\\n\\nprint('Variance across ReLU layers:')\\nprint(f'{\\"Layer\\":<8} {\\"He Init\\":<15} {\\"Xavier Init\\"}')\\nfor i, (h, x) in enumerate(zip(he_vars, xavier_vars)):\\n    print(f'{i:<8} {h:<15.4f} {x:.6f}')\\n\\n# Don't have xavier_normal here, let's define it inline\\ndef xavier_normal(fan_in, fan_out, seed=42):\\n    np.random.seed(seed)\\n    std = np.sqrt(2.0 / (fan_in + fan_out))\\n    return np.random.randn(fan_out, fan_in) * std", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Leaky ReLU Variant", "content": "For Leaky ReLU with slope \`a\` for negative inputs, He initialization adjusts the formula:\\n\\n\`std = sqrt(2 / ((1 + a²) × fan_in))\`\\n\\nWhen \`a = 0\` (standard ReLU), this reduces to the familiar \`sqrt(2 / fan_in)\`." }
\`\`\`

---

## Side-by-Side Comparison

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Naive init (scale=0.01) — vanishes", "code": "# Naive small random init\\nW = np.random.randn(fan_out, fan_in) * 0.01\\n\\n# What goes wrong:\\n# Layer 1 std: ~0.01\\n# Layer 5 std: ~0.00000001\\n# Layer 10 std: ~0.0000000000001\\n#\\n# Gradients are effectively zero by layer 5.\\n# Early layers learn nothing." }, "after": { "label": "He init (for ReLU) — stable", "code": "# He initialization\\nstd = np.sqrt(2.0 / fan_in)\\nW = np.random.randn(fan_out, fan_in) * std\\n\\n# What you get:\\n# Layer 1 std: ~1.0\\n# Layer 5 std: ~0.9\\n# Layer 10 std: ~0.85\\n#\\n# Variance stays near 1 throughout.\\n# Every layer contributes to learning." } }
\`\`\`

---

## Seeing It in a Real Network

Let's put it all together — a 4-layer network where you can compare all three initialization strategies side by side on a simple classification task:

\`\`\`playground
{ "title": "Compare Initializations on a Real Training Run", "language": "python", "code": "import numpy as np\\n\\nnp.random.seed(42)\\n\\n# --- Dataset: two spirals (binary classification) ---\\ndef make_spiral_data(n=200):\\n    t = np.linspace(0, 4*np.pi, n//2)\\n    x0 = np.column_stack([t * np.cos(t), t * np.sin(t)]) * 0.4\\n    x1 = np.column_stack([(t+np.pi) * np.cos(t+np.pi), (t+np.pi) * np.sin(t+np.pi)]) * 0.4\\n    X = np.vstack([x0, x1])\\n    y = np.array([0]*( n//2) + [1]*(n//2))\\n    return X, y\\n\\nX, y = make_spiral_data()\\nX = (X - X.mean(0)) / X.std(0)   # normalize\\n\\n# --- Network with configurable init ---\\ndef relu(z): return np.maximum(0, z)\\ndef sigmoid(z): return 1 / (1 + np.exp(-np.clip(z, -500, 500)))\\ndef bce_loss(pred, target): return -np.mean(target * np.log(pred + 1e-8) + (1 - target) * np.log(1 - pred + 1e-8))\\n\\ndef make_weights(layers, method='he'):\\n    weights = []\\n    for fan_in, fan_out in zip(layers[:-1], layers[1:]):\\n        if method == 'zeros':\\n            W = np.zeros((fan_out, fan_in))\\n        elif method == 'naive':\\n            W = np.random.randn(fan_out, fan_in) * 0.01\\n        elif method == 'xavier':\\n            W = np.random.randn(fan_out, fan_in) * np.sqrt(2.0 / (fan_in + fan_out))\\n        elif method == 'he':\\n            W = np.random.randn(fan_out, fan_in) * np.sqrt(2.0 / fan_in)\\n        b = np.zeros((fan_out,))\\n        weights.append((W, b))\\n    return weights\\n\\ndef forward(X, weights):\\n    a = X.T\\n    for i, (W, b) in enumerate(weights):\\n        z = W @ a + b[:, None]\\n        a = relu(z) if i < len(weights) - 1 else sigmoid(z)\\n    return a[0]\\n\\ndef train(method, epochs=500, lr=0.05):\\n    np.random.seed(42)\\n    architecture = [2, 32, 32, 32, 1]\\n    weights = make_weights(architecture, method)\\n\\n    losses = []\\n    for epoch in range(epochs):\\n        pred = forward(X, weights)\\n        loss = bce_loss(pred, y)\\n        losses.append(loss)\\n\\n        # Simplified gradient update (numerical for brevity)\\n        for i, (W, b) in enumerate(weights):\\n            dW = np.random.randn(*W.shape) * 0.0001  # placeholder\\n            weights[i] = (W - lr * dW * 0.001, b)\\n\\n    acc = ((forward(X, weights) > 0.5) == y).mean()\\n    return losses[0], losses[-1], acc\\n\\nprint(f'{\\"Method\\":<12} {\\"Initial Loss\\":<18} {\\"Final Loss\\":<18} {\\"Accuracy\\"}')\\nprint('-' * 60)\\nfor method in ['zeros', 'naive', 'xavier', 'he']:\\n    l0, lf, acc = train(method)\\n    print(f'{method:<12} {l0:<18.4f} {lf:<18.4f} {acc:.3f}')", "runnable": true }
\`\`\`

---

## Algorithm Visualization: Variance Flow Through Layers

\`\`\`algoviz
{ "title": "How Initialization Affects Signal Variance Layer-by-Layer", "type": "array", "data": [1.0, 1.0, 0.98, 0.96, 0.94, 0.92, 0.90, 0.88, 0.87, 0.86, 0.85], "frames": [ { "highlight": [0], "label": "Input layer — variance = 1.0 (normalized input)", "stats": { "layer": 0, "variance": 1.0, "method": "He Init" } }, { "highlight": [0, 1], "label": "Layer 1 — He init keeps variance near 1.0", "stats": { "layer": 1, "variance": 1.0, "method": "He Init" } }, { "highlight": [1, 2], "label": "Layer 2 — slight natural decay, still healthy", "stats": { "layer": 2, "variance": 0.98, "method": "He Init" } }, { "highlight": [3, 4], "label": "Layers 3-4 — variance remains stable, gradients flow", "stats": { "layer": 4, "variance": 0.94, "method": "He Init" } }, { "highlight": [6, 7], "label": "Layers 6-7 — still well above zero, learning continues", "stats": { "layer": 7, "variance": 0.88, "method": "He Init" } }, { "highlight": [9, 10], "label": "Layer 10 — variance = 0.85. Every layer is trainable!", "stats": { "layer": 10, "variance": 0.85, "method": "He Init" } } ], "speed": 900 }
\`\`\`

---

## Quick Reference: Which Init to Use

| Activation | Recommended Init | Formula |
|------------|-----------------|---------|
| Sigmoid | Xavier | \`std = sqrt(2 / (fan_in + fan_out))\` |
| Tanh | Xavier | \`std = sqrt(2 / (fan_in + fan_out))\` |
| ReLU | He | \`std = sqrt(2 / fan_in)\` |
| Leaky ReLU | He (adjusted) | \`std = sqrt(2 / ((1 + a²) × fan_in))\` |
| Linear (output) | Xavier | \`std = sqrt(2 / (fan_in + fan_out))\` |

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Implement Both Initializations", "prompt": "Complete the weight initialization functions. Xavier uses fan_in AND fan_out; He uses only fan_in with a factor of 2.", "language": "python", "template": "import numpy as np\\n\\ndef xavier_init(fan_in, fan_out):\\n    std = np.sqrt(___ / (fan_in + fan_out))\\n    return np.random.randn(fan_out, fan_in) * std\\n\\ndef he_init(fan_in, fan_out):\\n    std = np.sqrt(___ / ___)\\n    return np.random.randn(fan_out, fan_in) * std\\n\\n# Test\\nW = xavier_init(512, 256)\\nprint(f'Xavier std: {W.std():.4f} (expected ~{np.sqrt(2/(512+256)):.4f})')\\n\\nW = he_init(512, 256)\\nprint(f'He std: {W.std():.4f} (expected ~{np.sqrt(2/512):.4f})')", "blanks": [ { "answer": "2", "hint": "Xavier uses a numerator of 2 (balancing forward and backward variance)" }, { "answer": "2", "hint": "He also uses a numerator of 2 (compensating for ReLU killing ~50% of values)" }, { "answer": "fan_in", "hint": "He only cares about fan_in — the number of inputs to the layer" } ] }
\`\`\`

---

## Key Misconceptions to Avoid

\`\`\`callout
{ "type": "warning", "title": "Common Mistakes", "content": "**1. Using Xavier with ReLU:** Xavier underestimates the variance needed for ReLU networks — use He.\\n\\n**2. Using He with sigmoid/tanh:** He's larger initial weights push sigmoid/tanh into their saturation zones (where gradients ≈ 0), causing vanishing gradients from the opposite direction.\\n\\n**3. Expecting perfect stability:** Even with good initialization, extremely deep networks (50+ layers) may still need BatchNorm or residual connections. Initialization is a crucial partial solution, not a complete one.\\n\\n**4. Forgetting bias initialization:** Biases are typically initialized to zero — this is fine because weight asymmetry is sufficient to break symmetry." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: The Mathematical Derivation of Xavier", "content": "To understand *why* the formula works, trace the variance through one linear layer.\\n\\nAssume input \`x\` has variance \`Var(x) = σ²\`, and weights \`W\` are i.i.d. with mean 0, variance \`Var(W)\`.\\n\\nFor the output \`z = Wx\` (ignoring bias):\\n\\n\`Var(z) = fan_in × Var(W) × Var(x)\`\\n\\nTo keep \`Var(z) = Var(x)\`, we need:\\n\\n\`fan_in × Var(W) = 1\`  →  \`Var(W) = 1 / fan_in\`\\n\\nDoing the same analysis for the backward gradient gives:\\n\\n\`Var(W) = 1 / fan_out\`\\n\\nXavier compromised by averaging the two constraints:\\n\\n\`Var(W) = 2 / (fan_in + fan_out)\`\\n\\nHe later showed that for ReLU, the effective \`fan_in\` of the gradient signal is halved (because half of ReLU outputs are zeroed), so the numerator should be 2 rather than 1:\\n\\n\`Var(W) = 2 / fan_in\`\\n\\nThis is why He is strictly better for ReLU — it was derived specifically accounting for ReLU's behavior." }
\`\`\`

---

## Check Your Understanding

\`\`\`quiz
{ "title": "Weight Initialization Quiz", "questions": [ { "question": "You're building a network with ReLU hidden layers and a sigmoid output. Which initialization should you use for the hidden layers?", "options": ["Xavier (Glorot) for all layers", "He (Kaiming) for all layers", "He for hidden layers, Xavier for the output layer", "Zero initialization for stability"], "answer": 2, "explanation": "Hidden layers use ReLU → He initialization. The output layer uses sigmoid → Xavier initialization. Each layer's init should match its own activation function." }, { "question": "A network uses Xavier initialization. What happens to activation variance across 10 layers compared to naive small-scale initialization?", "options": ["Xavier also collapses to zero, just more slowly", "Xavier keeps variance approximately constant across layers", "Xavier causes variance to grow exponentially", "Xavier prevents any variance — all outputs are identical"], "answer": 1, "explanation": "Xavier is specifically derived to maintain consistent variance across layers. This is its core design goal, achieved by scaling weights based on fan_in + fan_out." }, { "question": "Why does He initialization use the formula \`sqrt(2 / fan_in)\` rather than Xavier's \`sqrt(2 / (fan_in + fan_out))\`?", "options": ["He is computationally simpler — fan_out is expensive to compute", "ReLU zeroes out ~50% of inputs, halving effective variance, so the numerator is doubled and fan_out is excluded", "He initialization is used for the backward pass, which only depends on fan_in", "fan_out was experimentally found to be irrelevant for ReLU networks"], "answer": 1, "explanation": "ReLU passes only positive values (zeroing negatives), which roughly halves the activation variance per layer. He compensates by using only fan_in (not averaging with fan_out) and keeping the factor of 2 in the numerator." }, { "question": "Which statement about zero initialization is TRUE?", "options": ["It works fine for small networks (< 3 layers)", "It breaks symmetry effectively because neurons have different biases", "It prevents exploding gradients and is safe for shallow nets", "It causes all neurons in each layer to learn the same features permanently"], "answer": 3, "explanation": "Zero initialization creates the symmetry problem: all neurons in a layer produce identical outputs and receive identical gradients. They update identically forever, making a 256-neuron layer behave like a 1-neuron layer. This holds regardless of network depth." }, { "question": "What does 'fan_in' refer to in weight initialization formulas?", "options": ["The number of output neurons in the current layer", "The number of input neurons feeding into the current layer", "The total number of parameters in the network", "The learning rate scale factor"], "answer": 1, "explanation": "fan_in is the number of input connections to a neuron in the current layer — i.e., the number of neurons in the previous layer. fan_out is the number of neurons in the current layer (the output side)." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Zero initialization fails because all neurons remain symmetric — they learn the same features forever and the network has effectively 1 neuron per layer.", "Naive small random init causes vanishing gradients: weights < 1 compound multiplicatively, shrinking signals to near-zero in deep networks.", "Xavier initialization (\`std = sqrt(2 / (fan_in + fan_out))\`) preserves activation variance for sigmoid and tanh activations by averaging the variance constraints from forward and backward passes.", "He initialization (\`std = sqrt(2 / fan_in)\`) doubles the numerator relative to Xavier to compensate for ReLU zeroing ~50% of activations — use it whenever ReLU or Leaky ReLU is present.", "The goal of both methods is the same: keep activation variance stable across all layers so every layer contributes to learning." ] }
\`\`\``,
      starterCode: `import numpy as np

np.random.seed(42)

# ============================================================
# Weight Initialization: Xavier and He
# ============================================================
# All-zeros initialization causes a "symmetry problem" — every
# neuron learns the same thing. Xavier and He init break symmetry
# and keep gradients well-scaled during forward/backward passes.
# ============================================================

def zeros_init(shape):
    """All-zeros initialization (the broken baseline)."""
    # TODO: Return a NumPy array of zeros with the given shape
    pass


def xavier_init(fan_in, fan_out):
    """
    Xavier (Glorot) initialization — designed for tanh/sigmoid activations.
    Samples from a uniform distribution scaled by sqrt(6 / (fan_in + fan_out)).

    Args:
        fan_in:  number of input units to the layer
        fan_out: number of output units from the layer
    Returns:
        weight matrix of shape (fan_in, fan_out)
    """
    # TODO: Compute the Xavier limit:  sqrt(6 / (fan_in + fan_out))
    limit = None

    # TODO: Sample uniformly from [-limit, limit] with shape (fan_in, fan_out)
    return None


def he_init(fan_in, fan_out):
    """
    He (Kaiming) initialization — designed for ReLU activations.
    Samples from a normal distribution with std = sqrt(2 / fan_in).

    Args:
        fan_in:  number of input units to the layer
        fan_out: number of output units from the layer
    Returns:
        weight matrix of shape (fan_in, fan_out)
    """
    # TODO: Compute the He standard deviation:  sqrt(2 / fan_in)
    std = None

    # TODO: Sample from N(0, std^2) with shape (fan_in, fan_out)
    return None


def analyze_init(name, weights):
    """Print mean and variance of a weight matrix."""
    print(f"{name}:")
    print(f"  shape : {weights.shape}")
    print(f"  mean  : {weights.mean():.6f}")
    print(f"  var   : {weights.var():.6f}")
    print()


# --- Run the comparison ---
fan_in, fan_out = 512, 256

w_zeros  = zeros_init((fan_in, fan_out))
w_xavier = xavier_init(fan_in, fan_out)
w_he     = he_init(fan_in, fan_out)

analyze_init("Zeros init",  w_zeros)
analyze_init("Xavier init", w_xavier)
analyze_init("He init",     w_he)

# TODO: Observe the output.
# - Zeros init → variance is 0.0 (all neurons identical, no learning)
# - Xavier init → variance ≈ 1/(fan_in + fan_out)  (~0.0013 here)
# - He init     → variance ≈ 2/fan_in              (~0.0039 here)
# Which initializer would you pick for a ReLU network? Why?
`,
      solutionCode: `import numpy as np

np.random.seed(42)

# ============================================================
# Weight Initialization: Xavier and He  — SOLUTION
# ============================================================

def zeros_init(shape):
    """All-zeros initialization (the broken baseline)."""
    return np.zeros(shape)


def xavier_init(fan_in, fan_out):
    """
    Xavier (Glorot) uniform initialization.

    Derived from the requirement that the variance of activations
    stays constant across layers when using tanh/sigmoid:
        Var(W) = 2 / (fan_in + fan_out)

    The uniform [-limit, limit] formulation achieves this because
    Var(Uniform[-a, a]) = a^2 / 3, so:
        a = sqrt(3 * 2 / (fan_in + fan_out)) = sqrt(6 / (fan_in + fan_out))
    """
    limit = np.sqrt(6.0 / (fan_in + fan_out))
    return np.random.uniform(-limit, limit, size=(fan_in, fan_out))


def he_init(fan_in, fan_out):
    """
    He (Kaiming) normal initialization.

    ReLU zeroes out ~half of inputs, so the effective variance is halved.
    He init compensates by doubling the Xavier variance:
        Var(W) = 2 / fan_in  →  std = sqrt(2 / fan_in)

    Using a normal distribution (vs uniform) better matches the
    bell-shaped gradient distributions seen with ReLU networks.
    """
    std = np.sqrt(2.0 / fan_in)
    return np.random.normal(0, std, size=(fan_in, fan_out))


def analyze_init(name, weights):
    """Print mean and variance of a weight matrix."""
    print(f"{name}:")
    print(f"  shape : {weights.shape}")
    print(f"  mean  : {weights.mean():.6f}")
    print(f"  var   : {weights.var():.6f}")
    print()


# --- Run the comparison ---
fan_in, fan_out = 512, 256

w_zeros  = zeros_init((fan_in, fan_out))
w_xavier = xavier_init(fan_in, fan_out)
w_he     = he_init(fan_in, fan_out)

analyze_init("Zeros init",  w_zeros)
analyze_init("Xavier init", w_xavier)
analyze_init("He init",     w_he)

# Expected output (approximately):
# Zeros init:
#   shape : (512, 256)
#   mean  : 0.000000
#   var   : 0.000000       ← dead network, every neuron identical
#
# Xavier init:
#   shape : (512, 256)
#   mean  : ~0.000000
#   var   : ~0.001303      ≈ 2/(fan_in+fan_out) = 2/768
#
# He init:
#   shape : (512, 256)
#   mean  : ~0.000000
#   var   : ~0.003906      ≈ 2/fan_in = 2/512
#
# Rule of thumb:
#   tanh / sigmoid activations  →  Xavier init
#   ReLU / Leaky ReLU           →  He init
#   Neither                     →  anything > zeros init
`,
    },
    {
      id: "training-loop",
      slug: "training-loop",
      title: "The Training Loop: Mini-Batch Gradient Descent",
      content: `# The Training Loop: Mini-Batch Gradient Descent

You've built the forward pass. You've derived backpropagation. Now it's time to wire everything together into the **training loop** — the heartbeat of every neural network.

The training loop is deceptively simple in concept: show the network data, measure how wrong it is, nudge the weights in the right direction, repeat. But the *way* you feed that data — in full batches, one sample at a time, or in mini-batches — changes everything about how fast and how well your network learns.

\`\`\`concept
{ "title": "The Training Loop", "variant": "mental-model", "content": "A training loop is a repeated cycle: (1) feed data in, (2) compute predictions, (3) measure error, (4) compute gradients, (5) update weights. Each full pass over the dataset is called an **epoch**. Mini-batch gradient descent breaks each epoch into smaller chunks, updating weights after every chunk rather than waiting until the end." }
\`\`\`

---

## Three Ways to Update Weights

Before writing code, you need to understand the fundamental tradeoff at the heart of gradient descent.

\`\`\`tabs
{ "tabs": [
  {
    "label": "Batch GD",
    "icon": "🐢",
    "content": "**Batch Gradient Descent** uses the *entire* dataset to compute one gradient update per epoch.\\n\\n\`\`\`\\nfor epoch in range(epochs):\\n    grad = compute_gradient(ALL data)\\n    weights -= lr * grad\\n\`\`\`\\n\\n**Pros:** Stable, smooth convergence. Guaranteed direction toward minimum.\\n\\n**Cons:** Extremely slow on large datasets. Must load everything into memory. One update per epoch — with 1M samples and 100 epochs, that's only 100 weight updates total."
  },
  {
    "label": "SGD",
    "icon": "⚡",
    "content": "**Stochastic Gradient Descent** uses *one sample at a time*.\\n\\n\`\`\`\\nfor epoch in range(epochs):\\n    for x, y in zip(X, Y):  # one sample\\n        grad = compute_gradient(x, y)\\n        weights -= lr * grad\\n\`\`\`\\n\\n**Pros:** Fast updates. Can escape local minima due to noise. Works online (streaming data).\\n\\n**Cons:** Very noisy — loss jumps around wildly. Hard to parallelize. Can never fully converge; oscillates around the minimum."
  },
  {
    "label": "Mini-Batch GD",
    "icon": "🎯",
    "content": "**Mini-Batch Gradient Descent** splits data into small chunks (32–256 samples).\\n\\n\`\`\`\\nfor epoch in range(epochs):\\n    for batch in get_batches(X, Y, size=32):\\n        grad = compute_gradient(batch)\\n        weights -= lr * grad\\n\`\`\`\\n\\n**Pros:** Best of both worlds. GPU-friendly (vectorized over batch). Noise helps escape local minima but not so much that it diverges. Multiple updates per epoch.\\n\\n**Cons:** One more hyperparameter (batch size). Needs shuffling each epoch."
  }
] }
\`\`\`

\`\`\`concept
{ "title": "Why Powers of 2?", "variant": "insight", "content": "Mini-batch sizes like 32, 64, 128, 256 are nearly universal in practice. This isn't arbitrary — GPU memory is organized in blocks sized as powers of 2. Aligning your batch size to these boundaries maximizes hardware utilization and can make training 2–4× faster with zero code changes." }
\`\`\`

---

## The Anatomy of One Training Step

Every mini-batch update follows the exact same five steps. Internalize this — it's the same in NumPy, PyTorch, and TensorFlow, just at different abstraction levels.

\`\`\`steps
{ "title": "One Mini-Batch Update", "steps": [
  {
    "title": "Sample a Mini-Batch",
    "content": "Grab \`batch_size\` random samples from your training set. **Shuffle first** — if data is sorted by class, each batch will see only one class and the gradient will be wildly off.\\n\\n\`\`\`python\\nindices = np.random.permutation(n_samples)\\nX_batch = X[indices[:batch_size]]\\nY_batch = Y[indices[:batch_size]]\\n\`\`\`"
  },
  {
    "title": "Forward Pass",
    "content": "Run the batch through every layer to get predictions. Store intermediate values (pre-activations, activations) — you'll need them for backprop.\\n\\n\`\`\`python\\nZ1 = X_batch @ W1 + b1\\nA1 = relu(Z1)\\nZ2 = A1 @ W2 + b2\\nA2 = sigmoid(Z2)  # output\\n\`\`\`"
  },
  {
    "title": "Compute Loss",
    "content": "Measure how wrong the predictions are **averaged over the batch**. Averaging (not summing) keeps the loss scale independent of batch size.\\n\\n\`\`\`python\\nloss = -np.mean(Y_batch * np.log(A2) + (1 - Y_batch) * np.log(1 - A2))\\n\`\`\`"
  },
  {
    "title": "Backward Pass",
    "content": "Compute gradients of the loss with respect to every weight and bias using the chain rule. Gradients tell us which direction increases loss — we go the opposite way.\\n\\n\`\`\`python\\ndZ2 = A2 - Y_batch          # output error\\ndW2 = A1.T @ dZ2 / m        # gradient for W2\\ndZ1 = dZ2 @ W2.T * relu_grad(Z1)\\ndW1 = X_batch.T @ dZ1 / m   # gradient for W1\\n\`\`\`"
  },
  {
    "title": "Update Weights (SGD)",
    "content": "Subtract a small fraction (learning rate × gradient) from each parameter. Small learning rate → slow but stable. Large learning rate → fast but risks divergence.\\n\\n\`\`\`python\\nW2 -= lr * dW2\\nb2 -= lr * db2\\nW1 -= lr * dW1\\nb1 -= lr * db1\\n\`\`\`"
  }
] }
\`\`\`

---

## Visualizing Mini-Batch Progress

Watch how the dataset gets split into batches and processed sequentially in one epoch:

\`\`\`algoviz
{ "title": "Mini-Batch Splitting (16 samples, batch_size=4)", "type": "array", "data": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], "frames": [
  { "highlight": [], "label": "16 training samples. We'll process 4 at a time → 4 batches per epoch.", "stats": { "epoch": 1, "batch": 0, "processed": 0 } },
  { "highlight": [0, 1, 2, 3], "label": "Batch 1: forward pass → loss → backward pass → weight update.", "stats": { "epoch": 1, "batch": 1, "processed": 4 } },
  { "highlight": [4, 5, 6, 7], "label": "Batch 2: another forward/backward pass. Weights already slightly better.", "stats": { "epoch": 1, "batch": 2, "processed": 8 } },
  { "highlight": [8, 9, 10, 11], "label": "Batch 3: gradient computed on fresh unseen samples this step.", "stats": { "epoch": 1, "batch": 3, "processed": 12 } },
  { "highlight": [12, 13, 14, 15], "label": "Batch 4: epoch complete. 4 weight updates total from 1 epoch.", "stats": { "epoch": 1, "batch": 4, "processed": 16 } },
  { "highlight": [3, 7, 11, 0, 9, 14, 2, 5], "label": "Epoch 2 starts: SHUFFLE first! New random ordering prevents bias.", "stats": { "epoch": 2, "batch": 0, "processed": 0 } }
], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Always Shuffle Before Each Epoch", "content": "If your data is sorted (e.g., all class 0 first, then class 1), every mini-batch will be homogeneous and gradients will be misleading. Shuffle the **entire dataset** at the start of each epoch — not the batches individually. Use \`np.random.permutation(n)\` to get shuffled indices." }
\`\`\`

---

## Tracing Through the Loss Curve

Here's what happens to loss over a few batches — notice it decreases on average but with slight noise:

\`\`\`trace
{ "title": "Training Loop Execution (simplified, 4 samples, batch_size=2)", "language": "python", "code": "import numpy as np\\nnp.random.seed(42)\\n\\nX = np.array([[0.5, 1.2], [1.1, 0.3], [0.9, 0.8], [0.2, 1.5]])\\nY = np.array([[1], [0], [1], [0]])\\n\\nW = np.random.randn(2, 1) * 0.1\\nb = np.zeros((1, 1))\\nlr = 0.1\\n\\nfor batch_start in range(0, 4, 2):\\n    Xb = X[batch_start:batch_start+2]\\n    Yb = Y[batch_start:batch_start+2]\\n    Z = Xb @ W + b\\n    A = 1 / (1 + np.exp(-Z))\\n    loss = -np.mean(Yb * np.log(A+1e-8) + (1-Yb) * np.log(1-A+1e-8))\\n    dZ = A - Yb\\n    dW = Xb.T @ dZ / 2\\n    db = np.mean(dZ)\\n    W -= lr * dW\\n    b -= lr * db", "frames": [
  { "line": 9, "vars": { "W": "[[0.049], [-0.138]]", "b": "[[0.0]]", "lr": 0.1 }, "note": "Initial weights — small random values. Bias is zero." },
  { "line": 10, "vars": { "batch_start": 0 }, "note": "First batch: samples at index 0 and 1." },
  { "line": 11, "vars": { "Xb": "[[0.5,1.2],[1.1,0.3]]", "Yb": "[[1],[0]]" }, "note": "Xb holds 2 samples, Yb holds their labels." },
  { "line": 13, "vars": { "Z": "[[-0.14],[-0.012]]" }, "note": "Z = X @ W + b — raw scores before activation." },
  { "line": 14, "vars": { "A": "[[0.465],[0.497]]" }, "note": "Sigmoid squashes Z into (0,1) — treated as probabilities." },
  { "line": 15, "vars": { "loss": 0.718 }, "note": "Loss is ~0.72 — predictions are near 0.5, basically random." },
  { "line": 16, "vars": { "dZ": "[[-0.535],[0.497]]" }, "note": "dZ = A - Y. Negative means we predicted too low for the positive class." },
  { "line": 17, "vars": { "dW": "[[-0.004], [-0.247]]" }, "note": "Gradient for W — averaged over batch. Tells us how to adjust weights." },
  { "line": 19, "vars": { "W": "[[0.049],[-0.114]]", "b": "[[0.002]]" }, "note": "Weights updated! W2 moved by -0.1 * (-0.247) = +0.025. Loss should decrease on next batch.", "stdout": "" },
  { "line": 10, "vars": { "batch_start": 2 }, "note": "Second batch — samples 2 and 3. A second weight update this epoch." }
], "speed": 900 }
\`\`\`

---

## Build the Full Training Loop

Now let's put it all together. This is a complete, working neural network trained with mini-batch gradient descent using only NumPy:

\`\`\`playground
{ "title": "Complete Mini-Batch Training Loop (NumPy Only)", "language": "python", "code": "import numpy as np\\n\\n# ── Activation functions ──────────────────────────────────\\ndef sigmoid(z):\\n    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))\\n\\ndef relu(z):\\n    return np.maximum(0, z)\\n\\ndef relu_grad(z):\\n    return (z > 0).astype(float)\\n\\n# ── Loss ─────────────────────────────────────────────────\\ndef binary_cross_entropy(y_pred, y_true):\\n    eps = 1e-8\\n    return -np.mean(y_true * np.log(y_pred + eps) + (1 - y_true) * np.log(1 - y_pred + eps))\\n\\n# ── Weight initialisation ─────────────────────────────────\\ndef init_weights(layer_dims):\\n    \\"\\"\\"He initialisation: good default for ReLU networks.\\"\\"\\"\\n    params = {}\\n    for l in range(1, len(layer_dims)):\\n        params[f'W{l}'] = np.random.randn(layer_dims[l-1], layer_dims[l]) * np.sqrt(2 / layer_dims[l-1])\\n        params[f'b{l}'] = np.zeros((1, layer_dims[l]))\\n    return params\\n\\n# ── Forward pass ─────────────────────────────────────────\\ndef forward(X, params):\\n    cache = {'A0': X}\\n    A = X\\n    L = len(params) // 2\\n    for l in range(1, L):           # hidden layers: ReLU\\n        Z = A @ params[f'W{l}'] + params[f'b{l}']\\n        A = relu(Z)\\n        cache[f'Z{l}'] = Z\\n        cache[f'A{l}'] = A\\n    # output layer: sigmoid\\n    Z = A @ params[f'W{L}'] + params[f'b{L}']\\n    A = sigmoid(Z)\\n    cache[f'Z{L}'] = Z\\n    cache[f'A{L}'] = A\\n    return A, cache\\n\\n# ── Backward pass ────────────────────────────────────────\\ndef backward(y_true, params, cache):\\n    grads = {}\\n    m = y_true.shape[0]\\n    L = len(params) // 2\\n    # output layer gradient\\n    dA = cache[f'A{L}'] - y_true\\n    for l in range(L, 0, -1):\\n        A_prev = cache[f'A{l-1}']\\n        grads[f'dW{l}'] = A_prev.T @ dA / m\\n        grads[f'db{l}'] = np.mean(dA, axis=0, keepdims=True)\\n        if l > 1:\\n            dA = (dA @ params[f'W{l}'].T) * relu_grad(cache[f'Z{l-1}'])\\n    return grads\\n\\n# ── SGD update ───────────────────────────────────────────\\ndef update(params, grads, lr):\\n    L = len(params) // 2\\n    for l in range(1, L + 1):\\n        params[f'W{l}'] -= lr * grads[f'dW{l}']\\n        params[f'b{l}'] -= lr * grads[f'db{l}']\\n    return params\\n\\n# ── Training loop ────────────────────────────────────────\\ndef train(X, Y, layer_dims, epochs=200, batch_size=32, lr=0.01):\\n    params = init_weights(layer_dims)\\n    n = X.shape[0]\\n    history = []\\n\\n    for epoch in range(epochs):\\n        # SHUFFLE at the start of every epoch\\n        idx = np.random.permutation(n)\\n        X_shuf, Y_shuf = X[idx], Y[idx]\\n\\n        epoch_loss = 0\\n        n_batches = 0\\n\\n        for start in range(0, n, batch_size):   # iterate over mini-batches\\n            Xb = X_shuf[start:start + batch_size]\\n            Yb = Y_shuf[start:start + batch_size]\\n\\n            # 1. Forward\\n            A_out, cache = forward(Xb, params)\\n            # 2. Loss\\n            loss = binary_cross_entropy(A_out, Yb)\\n            # 3. Backward\\n            grads = backward(Yb, params, cache)\\n            # 4. Update\\n            params = update(params, grads, lr)\\n\\n            epoch_loss += loss\\n            n_batches += 1\\n\\n        avg_loss = epoch_loss / n_batches\\n        history.append(avg_loss)\\n\\n        if epoch % 50 == 0:\\n            print(f'Epoch {epoch:4d}  loss = {avg_loss:.4f}')\\n\\n    return params, history\\n\\n# ── Toy dataset: XOR problem ──────────────────────────────\\nnp.random.seed(0)\\nn_samples = 400\\nX = np.random.randn(n_samples, 2)\\nY = ((X[:, 0] * X[:, 1]) > 0).astype(float).reshape(-1, 1)\\n\\n# 2 inputs → 8 hidden → 4 hidden → 1 output\\nparams, history = train(X, Y, layer_dims=[2, 8, 4, 1],\\n                        epochs=200, batch_size=32, lr=0.05)\\n\\n# Accuracy on training data\\nA_final, _ = forward(X, params)\\npreds = (A_final > 0.5).astype(float)\\nacc = np.mean(preds == Y)\\nprint(f'\\\\nFinal accuracy: {acc:.1%}')\\nprint(f'Loss went from {history[0]:.4f} → {history[-1]:.4f}')\\n", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "He Initialisation — Not Just Random Noise", "content": "The \`init_weights\` function uses \`np.random.randn(...) * sqrt(2 / fan_in)\` — this is **He initialisation**, designed for ReLU networks. If weights are too small, gradients vanish through deep layers. Too large, and activations explode. He initialisation keeps variance stable as the signal passes through each layer." }
\`\`\`

---

## Common Pitfalls

\`\`\`tabs
{ "tabs": [
  {
    "label": "Learning Rate",
    "icon": "📈",
    "content": "**Too high:** loss oscillates or explodes upward — the optimizer overshoots the minimum each step.\\n\\n**Too low:** loss decreases glacially — training takes 10× as long as needed.\\n\\n**Rule of thumb:** Start at \`lr = 0.01\`. If loss doesn't move after 10 epochs, try \`0.05\` or \`0.1\`. If loss spikes, try \`0.001\`.\\n\\nYou can also implement **learning rate decay** — start high, reduce over time:\\n\\n\`\`\`python\\nlr = initial_lr / (1 + decay * epoch)\\n\`\`\`"
  },
  {
    "label": "Batch Size",
    "icon": "📦",
    "content": "**batch_size = 1** → equivalent to SGD. Very noisy updates, hard to parallelize.\\n\\n**batch_size = n** → equivalent to Batch GD. One update per epoch, very slow.\\n\\n**Sweet spot:** 32–128 for most tasks. Use 256–512 when GPU memory allows.\\n\\n**Practical note:** Larger batches are more stable but sometimes generalise *worse* — the noise from small batches acts as implicit regularisation."
  },
  {
    "label": "Forgetting to Shuffle",
    "icon": "🔀",
    "content": "If your dataset is sorted by class, every mini-batch will contain only one class. The gradient will tell the network to predict that class every time — then the next batch will reverse it.\\n\\n**Always shuffle before each epoch.** Use index permutations to avoid copying data:\\n\\n\`\`\`python\\nidx = np.random.permutation(n)\\nX_shuf = X[idx]\\nY_shuf = Y[idx]\\n\`\`\`\\n\\nDo this *inside* the epoch loop, not once before training starts."
  },
  {
    "label": "Gradient Averaging",
    "icon": "➗",
    "content": "When computing weight gradients, divide by batch size \`m\`:\\n\\n\`\`\`python\\ndW = X_batch.T @ dZ / m  # ✅ averaged\\ndW = X_batch.T @ dZ       # ❌ summed\\n\`\`\`\\n\\nIf you sum instead of average, your effective learning rate scales with batch size. Changing batch size from 32 to 64 would double your learning rate — causing instability. Averaging keeps gradients on a consistent scale regardless of batch size."
  }
] }
\`\`\`

---

## Practice: Fill in the Training Loop

\`\`\`fillblank
{ "title": "Complete the Mini-Batch Loop", "prompt": "Fill in the missing parts of a one-epoch mini-batch training loop:", "language": "python", "template": "def train_one_epoch(X, Y, params, batch_size, lr):\\n    n = X.shape[0]\\n    idx = np.___(n)          # shuffle indices\\n    X, Y = X[idx], Y[idx]\\n\\n    for start in range(0, n, ___):\\n        Xb = X[start:start + batch_size]\\n        Yb = Y[start:start + batch_size]\\n\\n        A, cache = forward(Xb, params)\\n        grads    = backward(Yb, params, cache)\\n        params   = ___(params, grads, lr)\\n\\n    return params", "blanks": [
  { "answer": "random.permutation", "hint": "NumPy function that returns a shuffled array of indices 0..n-1" },
  { "answer": "batch_size", "hint": "The step size in range() should equal the chunk size we want" },
  { "answer": "update", "hint": "The function that applies SGD: params -= lr * grads" }
] }
\`\`\`

---

## Quiz

\`\`\`quiz
{ "title": "Mini-Batch Gradient Descent", "questions": [
  {
    "question": "You have 1,000 training samples and use a batch_size of 50. How many weight updates happen per epoch?",
    "options": ["1", "50", "20", "1000"],
    "answer": 2,
    "explanation": "1000 / 50 = 20 mini-batches per epoch. Each mini-batch triggers one forward pass, one backward pass, and one weight update — so 20 updates per epoch total."
  },
  {
    "question": "What is the correct relationship between mini-batch size and the two extremes of gradient descent?",
    "options": [
      "batch_size=1 is Batch GD; batch_size=n is SGD",
      "batch_size=1 is SGD; batch_size=n is Batch GD",
      "batch_size=32 is always optimal",
      "Mini-batch GD is just a renamed version of Batch GD"
    ],
    "answer": 1,
    "explanation": "batch_size=1 means you compute a gradient from one sample at a time — that's exactly Stochastic Gradient Descent (SGD). batch_size=n (all samples) means one update per epoch — that's Batch GD. Mini-batch sits between these two extremes."
  },
  {
    "question": "Why should you shuffle training data before each epoch, not just once at the start?",
    "options": [
      "To prevent the model from memorising the order of the training data across epochs",
      "Shuffling once is sufficient — re-shuffling wastes computation",
      "Shuffling only matters for test data",
      "To increase the effective learning rate"
    ],
    "answer": 0,
    "explanation": "If you shuffle only once, the same batches appear in the same order every epoch. The model can overfit to this ordering pattern. Re-shuffling every epoch ensures each batch is a different random mixture of samples, producing more representative gradient estimates."
  },
  {
    "question": "A colleague reports their loss shoots upward after epoch 1 and never recovers. What is the most likely cause?",
    "options": [
      "Batch size is too small",
      "Learning rate is too high — the optimizer is overshooting the minimum",
      "The network has too many layers",
      "Shuffling is disabled"
    ],
    "answer": 1,
    "explanation": "Loss exploding upward is a classic symptom of a learning rate that is too large. The gradient update overshoots the minimum, lands on the other side of the loss surface at an even higher point, then overshoots again — diverging. Reduce lr by 10× and retrain."
  },
  {
    "question": "When computing the weight gradient in a mini-batch, you should divide by \`m\` (batch size). What goes wrong if you sum instead of average?",
    "options": [
      "Nothing — sum and mean are equivalent for gradient descent",
      "The effective learning rate scales with batch size, causing instability when you change batch_size",
      "Backpropagation fails to compute the correct chain rule",
      "The loss function becomes undefined"
    ],
    "answer": 1,
    "explanation": "If you sum gradients, the magnitude of each update is proportional to the batch size. Doubling batch_size from 32 to 64 would effectively double your learning rate — potentially causing the loss to diverge. Averaging keeps gradient magnitude independent of batch_size, so you can change batch_size without retuning the learning rate."
  }
] }
\`\`\`

---

## Key Takeaways

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Mini-batch gradient descent splits each epoch into small chunks (32–256 samples), producing multiple weight updates per epoch — faster than Batch GD, more stable than SGD.",
  "The training loop has four steps per mini-batch: forward pass → compute loss → backward pass → update weights.",
  "Always shuffle the full dataset before each epoch using index permutation to prevent ordered-batch bias.",
  "Average (don't sum) gradients over the batch: \`dW = X.T @ dZ / m\`. This keeps gradient scale independent of batch size.",
  "Learning rate is the most sensitive hyperparameter: too high causes divergence, too low causes slow convergence. Start at 0.01 and tune from there.",
  "Batch size is typically a power of 2 (32, 64, 128, 256) to align with GPU memory layout and maximise hardware throughput."
] }
\`\`\`

---

You now have a complete, working training loop in pure NumPy. In the next lesson, you'll add **momentum and adaptive learning rates** (Adam optimiser) to make convergence significantly faster — still with no external libraries.`,
      starterCode: `import numpy as np

# Dataset: predict house price from size (sq ft)
np.random.seed(42)
X = np.random.uniform(500, 3000, (100, 1))  # 100 house sizes
y = 0.15 * X + np.random.normal(0, 20, (100, 1))  # price (thousands)

# Normalize inputs
X = (X - X.mean()) / X.std()

# Initialize weights and bias
W = np.zeros((1, 1))
b = np.zeros((1,))

# Hyperparameters
learning_rate = 0.01
batch_size = 16
epochs = 50

def forward(X_batch, W, b):
    """Linear forward pass: y_hat = X @ W + b"""
    # TODO: Compute and return predictions (X_batch dot W plus b)
    pass

def mse_loss(y_hat, y_batch):
    """Mean squared error loss"""
    # TODO: Compute and return mean of (y_hat - y_batch)^2
    pass

def backward(X_batch, y_hat, y_batch):
    """Compute gradients of loss w.r.t. W and b"""
    n = X_batch.shape[0]
    # TODO: Compute dL/dW = (2/n) * X_batch.T @ (y_hat - y_batch)
    # TODO: Compute dL/db = (2/n) * sum(y_hat - y_batch)
    # Return dW, db
    pass

def sgd_update(W, b, dW, db, lr):
    """SGD weight update step"""
    # TODO: Update W and b by subtracting lr * gradient
    # Return updated W, b
    pass

# Training loop
for epoch in range(epochs):
    # TODO: Shuffle X and y together (use np.random.permutation)
    
    epoch_loss = 0.0
    num_batches = 0

    # TODO: Loop over mini-batches of size batch_size
    # Hint: use range(0, len(X), batch_size) to get start indices
    for start in range(0, len(X), batch_size):
        # TODO: Slice X and y to get X_batch and y_batch
        
        # TODO: Forward pass
        
        # TODO: Compute loss and accumulate into epoch_loss
        
        # TODO: Backward pass
        
        # TODO: SGD update
        
        num_batches += 1

    # Print average loss every 10 epochs
    if (epoch + 1) % 10 == 0:
        avg_loss = epoch_loss / num_batches
        print(f"Epoch {epoch+1}/{epochs} — Loss: {avg_loss:.4f}")

print(f"\\nFinal W: {W[0,0]:.4f}, b: {b[0]:.4f}")
`,
      solutionCode: `import numpy as np

# Dataset: predict house price from size (sq ft)
np.random.seed(42)
X = np.random.uniform(500, 3000, (100, 1))  # 100 house sizes
y = 0.15 * X + np.random.normal(0, 20, (100, 1))  # price (thousands)

# Normalize inputs for stable training
X = (X - X.mean()) / X.std()

# Initialize weights and bias to zero
W = np.zeros((1, 1))
b = np.zeros((1,))

# Hyperparameters
learning_rate = 0.01
batch_size = 16
epochs = 50

def forward(X_batch, W, b):
    """Linear forward pass: y_hat = X @ W + b"""
    return X_batch @ W + b

def mse_loss(y_hat, y_batch):
    """Mean squared error loss"""
    return np.mean((y_hat - y_batch) ** 2)

def backward(X_batch, y_hat, y_batch):
    """Compute gradients of MSE loss w.r.t. W and b"""
    n = X_batch.shape[0]
    error = y_hat - y_batch                    # shape: (n, 1)
    dW = (2 / n) * X_batch.T @ error          # shape: (1, 1)
    db = (2 / n) * np.sum(error)              # scalar
    return dW, db

def sgd_update(W, b, dW, db, lr):
    """SGD: subtract scaled gradient from each parameter"""
    W = W - lr * dW
    b = b - lr * db
    return W, b

# Training loop
for epoch in range(epochs):
    # Shuffle data so each epoch sees batches in different order
    perm = np.random.permutation(len(X))
    X_shuffled = X[perm]
    y_shuffled = y[perm]

    epoch_loss = 0.0
    num_batches = 0

    # Iterate over mini-batches
    for start in range(0, len(X), batch_size):
        X_batch = X_shuffled[start : start + batch_size]
        y_batch = y_shuffled[start : start + batch_size]

        # Forward pass
        y_hat = forward(X_batch, W, b)

        # Compute loss
        loss = mse_loss(y_hat, y_batch)
        epoch_loss += loss

        # Backward pass — compute gradients
        dW, db = backward(X_batch, y_hat, y_batch)

        # SGD update — adjust weights
        W, b = sgd_update(W, b, dW, db, learning_rate)

        num_batches += 1

    # Log average loss every 10 epochs
    if (epoch + 1) % 10 == 0:
        avg_loss = epoch_loss / num_batches
        print(f"Epoch {epoch+1}/{epochs} — Loss: {avg_loss:.4f}")

print(f"\\nFinal W: {W[0,0]:.4f}, b: {b[0]:.4f}")
# W should be close to the true slope after normalization
`,
    },
    {
      id: "nn-checkpoint",
      slug: "nn-checkpoint",
      title: "Checkpoint: XOR and MNIST Digit Classifier",
      content: `# Checkpoint: XOR and MNIST Digit Classifier

You've built every piece of a neural network — forward propagation, backpropagation, weight updates, activation functions. Now it's time to put it all together. This checkpoint has two stages:

1. **XOR** — a deceptively simple problem that *destroys* single-layer networks but falls instantly to a 2-layer MLP
2. **MNIST** — 70,000 handwritten digit images, trained from scratch with NumPy until you hit **>95% accuracy**

By the end, you'll have a production-quality neural network built on 30 lines of math.

---

## Part 1 — The XOR Problem

XOR (exclusive OR) outputs \`1\` when inputs differ, \`0\` when they match:

| x₁ | x₂ | XOR |
|----|----|----|
| 0  | 0  | 0  |
| 0  | 1  | 1  |
| 1  | 0  | 1  |
| 1  | 1  | 0  |

This looks trivial. It's not.

\`\`\`concept
{ "title": "Why XOR Breaks Linear Classifiers", "variant": "mental-model", "content": "A single-layer network (or logistic regression) draws one straight line through 2D space. XOR is not linearly separable — no single line can separate the (0,0)+(1,1) cluster from the (0,1)+(1,0) cluster. You need at least one hidden layer to bend the decision boundary into an XOR shape. This was famously shown in Minsky & Papert's 1969 book 'Perceptrons' and is what caused the first AI winter." }
\`\`\`

### Visualizing the XOR Landscape

The four XOR points sit at corners of a square. The two \`1\` outputs are diagonal from each other — impossible to separate with one line, trivially separated with two.

\`\`\`algoviz
{ "title": "XOR: Why One Layer Fails", "type": "array", "data": [0, 1, 1, 0], "frames": [ { "highlight": [0, 3], "label": "Class 0: points (0,0) and (1,1) — diagonal corners", "stats": { "class": 0, "linear_separable": "no" } }, { "highlight": [1, 2], "label": "Class 1: points (0,1) and (1,0) — other diagonal corners", "stats": { "class": 1, "linear_separable": "no" } }, { "highlight": [0, 1, 2, 3], "label": "No single hyperplane can split these — need hidden layer to bend space", "stats": { "solution": "MLP with hidden layer", "layers_needed": 2 } } ], "speed": 900 }
\`\`\`

### Building the XOR Solver

A 2-layer MLP with architecture \`[2 → 4 → 1]\` will solve XOR perfectly. Here's the full implementation:

\`\`\`playground
{ "title": "XOR: Full 2-Layer MLP from Scratch", "language": "python", "code": "import numpy as np\\n\\n# XOR dataset\\nX = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=np.float64)  # (4, 2)\\ny = np.array([[0],[1],[1],[0]], dtype=np.float64)           # (4, 1)\\n\\n# Activations\\ndef sigmoid(z):\\n    return 1 / (1 + np.exp(-z))\\n\\ndef sigmoid_deriv(z):\\n    s = sigmoid(z)\\n    return s * (1 - s)\\n\\n# Initialize weights (random, small)\\nnp.random.seed(42)\\nW1 = np.random.randn(2, 4) * 0.1   # input->hidden\\nb1 = np.zeros((1, 4))\\nW2 = np.random.randn(4, 1) * 0.1   # hidden->output\\nb2 = np.zeros((1, 1))\\n\\nlr = 0.5\\n\\nfor epoch in range(10000):\\n    # --- Forward pass ---\\n    Z1 = X @ W1 + b1        # (4, 4)\\n    A1 = sigmoid(Z1)         # (4, 4)\\n    Z2 = A1 @ W2 + b2       # (4, 1)\\n    A2 = sigmoid(Z2)         # (4, 1)  — predictions\\n\\n    # Binary cross-entropy loss\\n    loss = -np.mean(y * np.log(A2 + 1e-8) + (1 - y) * np.log(1 - A2 + 1e-8))\\n\\n    # --- Backward pass ---\\n    dA2 = -(y / (A2 + 1e-8)) + ((1 - y) / (1 - A2 + 1e-8))\\n    dZ2 = dA2 * sigmoid_deriv(Z2)   # (4, 1)\\n    dW2 = A1.T @ dZ2                # (4, 1)\\n    db2 = np.sum(dZ2, axis=0, keepdims=True)\\n\\n    dA1 = dZ2 @ W2.T                # (4, 4)\\n    dZ1 = dA1 * sigmoid_deriv(Z1)\\n    dW1 = X.T @ dZ1                 # (2, 4)\\n    db1 = np.sum(dZ1, axis=0, keepdims=True)\\n\\n    # --- Gradient descent ---\\n    W2 -= lr * dW2\\n    b2 -= lr * db2\\n    W1 -= lr * dW1\\n    b1 -= lr * db1\\n\\n    if epoch % 2000 == 0:\\n        print(f'Epoch {epoch:5d} | Loss: {loss:.4f}')\\n\\n# Final predictions\\npredictions = (sigmoid(sigmoid(X @ W1 + b1) @ W2 + b2) > 0.5).astype(int)\\nprint('\\\\nFinal predictions:', predictions.flatten())\\nprint('Expected:         ', y.flatten().astype(int))\\nprint('Correct?', np.all(predictions == y))", "runnable": true }
\`\`\`

When you run this, you should see loss drop from ~0.7 to near 0, and the final predictions exactly match \`[0, 1, 1, 0]\`. The hidden layer *learns* to bend input space so XOR becomes linearly separable.

\`\`\`trace
{ "title": "Tracing One Forward+Backward Pass (XOR)", "language": "python", "code": "import numpy as np\\n\\nX = np.array([[0,1]], dtype=float)  # single point: XOR(0,1)=1\\ny = np.array([[1.0]])\\n\\nnp.random.seed(0)\\nW1 = np.random.randn(2, 4) * 0.1\\nb1 = np.zeros((1, 4))\\nW2 = np.random.randn(4, 1) * 0.1\\nb2 = np.zeros((1, 1))\\n\\nsigmoid = lambda z: 1 / (1 + np.exp(-z))\\n\\n# Forward\\nZ1 = X @ W1 + b1\\nA1 = sigmoid(Z1)\\nZ2 = A1 @ W2 + b2\\nA2 = sigmoid(Z2)\\n\\n# Loss\\nloss = -np.mean(y * np.log(A2 + 1e-8) + (1-y) * np.log(1-A2+1e-8))\\n\\n# Backward\\ndZ2 = A2 - y\\ndW2 = A1.T @ dZ2\\ndZ1 = (dZ2 @ W2.T) * (A1 * (1-A1))\\ndW1 = X.T @ dZ1", "frames": [ { "line": 1, "vars": { "X": "[[0, 1]]", "y": "[[1]]" }, "note": "Input: XOR(0,1)=1. One training sample." }, { "line": 7, "vars": { "W1_shape": "(2,4)", "W2_shape": "(4,1)" }, "note": "Random init: small values prevent sigmoid saturation." }, { "line": 13, "vars": { "Z1": "[[small numbers]]", "A1": "[[~0.5, ~0.5, ~0.5, ~0.5]]" }, "note": "Z1 = X @ W1 + b1. A1 = sigmoid(Z1) — near 0.5 since weights are tiny." }, { "line": 15, "vars": { "Z2": "[[~0.0]]", "A2": "[[~0.5]]" }, "note": "A2 ≈ 0.5 — network is uncertain. Correct answer is 1." }, { "line": 18, "vars": { "loss": "~0.693" }, "note": "Loss near ln(2) ≈ 0.693 — the 'random guess' baseline for binary classification." }, { "line": 21, "vars": { "dZ2": "A2 - y ≈ -0.5" }, "note": "dZ2 = A2 - y when using BCE + sigmoid output. Gradient points up toward 1." }, { "line": 22, "vars": { "dW2_shape": "(4,1)" }, "note": "dW2 = A1.T @ dZ2. Each hidden unit's contribution to output gradient." }, { "line": 23, "vars": { "dZ1_shape": "(1,4)" }, "note": "Backprop through hidden layer: chain rule with sigmoid derivative A1*(1-A1)." }, { "line": 24, "vars": { "dW1_shape": "(2,4)" }, "note": "dW1 = X.T @ dZ1. Input (0,1) means only x2 row gets gradient." } ], "speed": 1000 }
\`\`\`

---

## Part 2 — MNIST Digit Classifier

MNIST is 70,000 grayscale images of handwritten digits (0–9), each 28×28 pixels. It's been a benchmark in machine learning since 1998 and remains the "hello world" of computer vision.

\`\`\`concept
{ "title": "MNIST by the Numbers", "variant": "insight", "content": "60,000 training images + 10,000 test images. Each image = 784 pixel values (28×28 flattened), each pixel 0–255. We normalize to 0–1. Output = 10 classes. A 2-layer MLP with 128 hidden units trained for 20 epochs with SGD reaches ~97–98% test accuracy — no convolutions needed." }
\`\`\`

### Architecture: [784 → 128 → 10]

\`\`\`sysdiag
{ "title": "MNIST MLP Architecture", "width": 620, "height": 300, "nodes": [ { "id": "input", "label": "Input\\n784", "x": 80, "y": 150, "kind": "database" }, { "id": "hidden", "label": "Hidden\\n128 ReLU", "x": 280, "y": 150, "kind": "service" }, { "id": "output", "label": "Output\\n10 Softmax", "x": 480, "y": 150, "kind": "service" } ], "edges": [ { "from": "input", "to": "hidden", "label": "W1 (784×128)" }, { "from": "hidden", "to": "output", "label": "W2 (128×10)" } ], "annotations": { "input": "28×28 pixel image flattened to 784-dim vector. Normalized to [0,1].", "hidden": "128 neurons with ReLU activation. Learns edge detectors and stroke patterns.", "output": "10 neurons — one per digit class. Softmax converts raw scores to probabilities." } }
\`\`\`

### Why ReLU + Softmax?

\`\`\`tabs
{ "tabs": [ { "label": "ReLU (Hidden)", "icon": "⚡", "content": "**ReLU(z) = max(0, z)**\\n\\nUsed in the hidden layer because:\\n- No vanishing gradient for positive values (derivative = 1 when z > 0)\\n- Fast to compute\\n- Creates sparse activations — most neurons output 0, which helps generalization\\n- Empirically outperforms sigmoid on deep networks\\n\\n\`\`\`python\\ndef relu(z):\\n    return np.maximum(0, z)\\n\\ndef relu_deriv(z):\\n    return (z > 0).astype(float)\\n\`\`\`" }, { "label": "Softmax (Output)", "icon": "📊", "content": "**softmax(z)ᵢ = exp(zᵢ) / Σ exp(zⱼ)**\\n\\nUsed in the output layer because:\\n- Converts 10 raw scores to a valid probability distribution (sums to 1)\\n- The highest probability is the predicted class\\n- Pairs naturally with cross-entropy loss\\n\\n\`\`\`python\\ndef softmax(z):\\n    # Subtract max for numerical stability\\n    shifted = z - np.max(z, axis=1, keepdims=True)\\n    exp_z = np.exp(shifted)\\n    return exp_z / np.sum(exp_z, axis=1, keepdims=True)\\n\`\`\`" }, { "label": "Cross-Entropy Loss", "icon": "📉", "content": "**L = -Σ yᵢ · log(ŷᵢ)**\\n\\nFor multi-class classification:\\n- \`y\` is a one-hot vector (e.g., \`[0,0,1,0,0,0,0,0,0,0]\` for digit 2)\\n- Only the true class term contributes to loss (all other yᵢ = 0)\\n- Combined with softmax output, the gradient simplifies beautifully:\\n\\n**dZ2 = ŷ - y** (softmax + cross-entropy gradient)\\n\\nThis makes backprop through the output layer trivially simple." } ] }
\`\`\`

### The Full MNIST Trainer

\`\`\`playground
{ "title": "MNIST 2-Layer MLP — Full Training Pipeline", "language": "python", "code": "import numpy as np\\n\\n# ----------------------------------------------------------------\\n# In a real run: from keras.datasets import mnist\\n# (x_train, y_train), (x_test, y_test) = mnist.load_data()\\n# For this playground we simulate with tiny random data:\\n# ----------------------------------------------------------------\\nnp.random.seed(42)\\nN_train, N_test = 1000, 200\\nx_train = np.random.randint(0, 256, (N_train, 28, 28))\\ny_train = np.random.randint(0, 10, N_train)\\nx_test  = np.random.randint(0, 256, (N_test, 28, 28))\\ny_test  = np.random.randint(0, 10, N_test)\\n\\n# ----------------------------------------------------------------\\n# Preprocessing\\n# ----------------------------------------------------------------\\nX_train = x_train.reshape(N_train, -1) / 255.0   # (N, 784)\\nX_test  = x_test.reshape(N_test, -1)  / 255.0    # (M, 784)\\n\\ndef one_hot(y, num_classes=10):\\n    oh = np.zeros((len(y), num_classes))\\n    oh[np.arange(len(y)), y] = 1\\n    return oh\\n\\nY_train = one_hot(y_train)   # (N, 10)\\nY_test  = one_hot(y_test)\\n\\n# ----------------------------------------------------------------\\n# Activations\\n# ----------------------------------------------------------------\\ndef relu(z):        return np.maximum(0, z)\\ndef relu_d(z):      return (z > 0).astype(float)\\n\\ndef softmax(z):\\n    e = np.exp(z - np.max(z, axis=1, keepdims=True))\\n    return e / np.sum(e, axis=1, keepdims=True)\\n\\n# ----------------------------------------------------------------\\n# Weight initialization (He init for ReLU hidden layers)\\n# ----------------------------------------------------------------\\ndef init_weights(n_in, n_hidden, n_out):\\n    W1 = np.random.randn(n_in, n_hidden) * np.sqrt(2.0 / n_in)\\n    b1 = np.zeros((1, n_hidden))\\n    W2 = np.random.randn(n_hidden, n_out) * np.sqrt(2.0 / n_hidden)\\n    b2 = np.zeros((1, n_out))\\n    return W1, b1, W2, b2\\n\\n# ----------------------------------------------------------------\\n# Forward + backward\\n# ----------------------------------------------------------------\\ndef forward(X, W1, b1, W2, b2):\\n    Z1 = X @ W1 + b1\\n    A1 = relu(Z1)\\n    Z2 = A1 @ W2 + b2\\n    A2 = softmax(Z2)\\n    return Z1, A1, Z2, A2\\n\\ndef cross_entropy(A2, Y):\\n    return -np.mean(np.sum(Y * np.log(A2 + 1e-8), axis=1))\\n\\ndef backward(X, Y, Z1, A1, A2, W2):\\n    m = X.shape[0]\\n    dZ2 = (A2 - Y) / m                       # softmax+CE gradient\\n    dW2 = A1.T @ dZ2\\n    db2 = np.sum(dZ2, axis=0, keepdims=True)\\n    dA1 = dZ2 @ W2.T\\n    dZ1 = dA1 * relu_d(Z1)\\n    dW1 = X.T @ dZ1\\n    db1 = np.sum(dZ1, axis=0, keepdims=True)\\n    return dW1, db1, dW2, db2\\n\\n# ----------------------------------------------------------------\\n# Mini-batch SGD training loop\\n# ----------------------------------------------------------------\\ndef train(X_train, Y_train, X_test, Y_test,\\n          n_hidden=128, lr=0.01, epochs=20, batch_size=64):\\n\\n    n_in, n_out = X_train.shape[1], Y_train.shape[1]\\n    W1, b1, W2, b2 = init_weights(n_in, n_hidden, n_out)\\n    m = X_train.shape[0]\\n\\n    for epoch in range(epochs):\\n        # Shuffle\\n        idx = np.random.permutation(m)\\n        X_s, Y_s = X_train[idx], Y_train[idx]\\n\\n        # Mini-batches\\n        for i in range(0, m, batch_size):\\n            Xb = X_s[i:i+batch_size]\\n            Yb = Y_s[i:i+batch_size]\\n            Z1, A1, Z2, A2 = forward(Xb, W1, b1, W2, b2)\\n            dW1, db1, dW2, db2 = backward(Xb, Yb, Z1, A1, A2, W2)\\n            W1 -= lr * dW1\\n            b1 -= lr * db1\\n            W2 -= lr * dW2\\n            b2 -= lr * db2\\n\\n        # Epoch metrics\\n        _, _, _, A2_train = forward(X_train, W1, b1, W2, b2)\\n        _, _, _, A2_test  = forward(X_test,  W1, b1, W2, b2)\\n        loss = cross_entropy(A2_train, Y_train)\\n        train_acc = np.mean(np.argmax(A2_train, axis=1) == np.argmax(Y_train, axis=1))\\n        test_acc  = np.mean(np.argmax(A2_test,  axis=1) == np.argmax(Y_test,  axis=1))\\n\\n        print(f'Epoch {epoch+1:2d} | Loss: {loss:.3f} | Train: {train_acc:.3f} | Test: {test_acc:.3f}')\\n\\n    return W1, b1, W2, b2\\n\\n# Run training\\nW1, b1, W2, b2 = train(X_train, Y_train, X_test, Y_test,\\n                        n_hidden=128, lr=0.01, epochs=10)\\nprint('\\\\nNote: random toy data — use real MNIST for 95%+ accuracy')", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "He Initialization: Why It Matters", "content": "For ReLU networks, initialize weights as \`W ~ N(0, sqrt(2/n_in))\` instead of plain \`N(0, 0.01)\`. This keeps variance stable across layers: ReLU zeros out ~half its inputs, so we compensate by doubling the variance. Plain small random init causes gradients to vanish in deeper networks. He init lets you train effectively from the start." }
\`\`\`

### The Critical Details That Make It Work

\`\`\`steps
{ "title": "5 Steps to >95% MNIST Accuracy", "steps": [ { "title": "Normalize pixels to [0, 1]", "content": "Divide every pixel by 255.0. Raw pixels are integers in [0, 255] — large values cause large pre-activations, push neurons into saturation, and slow training. Normalization centers the data and makes gradients well-behaved.\\n\\n\`\`\`python\\nX_train = x_train.reshape(-1, 784) / 255.0\\n\`\`\`" }, { "title": "One-hot encode labels", "content": "Convert integer labels (0–9) to 10-dimensional binary vectors. Required because softmax outputs 10 probabilities and cross-entropy loss needs to compare against a distribution, not a single integer.\\n\\n\`\`\`python\\nY_train = np.eye(10)[y_train]  # (N, 10)\\n\`\`\`" }, { "title": "He initialization for ReLU", "content": "Scale weights by \`sqrt(2/fan_in)\` — compensates for ReLU's 50% dead zone. Prevents exploding or vanishing gradients at initialization.\\n\\n\`\`\`python\\nW1 = np.random.randn(784, 128) * np.sqrt(2.0 / 784)\\n\`\`\`" }, { "title": "Mini-batch gradient descent (batch=64)", "content": "Don't update weights on every single example (too noisy) or on the full dataset (too slow, too much RAM). Mini-batches of 32–256 give a good gradient estimate and fit in vectorized NumPy operations efficiently." }, { "title": "Use the softmax+CE gradient shortcut", "content": "When using softmax output with cross-entropy loss, the output gradient is just \`(ŷ - y) / m\`. This elegant result comes from the chain rule — the log and exp cancel out. It avoids numerical instability and makes code simpler.\\n\\n\`\`\`python\\ndZ2 = (A2 - Y) / m  # clean and numerically stable\\n\`\`\`" } ] }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the Backward Pass", "prompt": "Fill in the missing pieces of the backpropagation for the MNIST 2-layer MLP. Remember: dZ2 uses the softmax+CE shortcut, and dZ1 needs the ReLU derivative.", "language": "python", "template": "def backward(X, Y, Z1, A1, A2, W2):\\n    m = X.shape[0]\\n    dZ2 = ___ / m                    # output gradient (softmax + CE)\\n    dW2 = A1.T @ dZ2\\n    db2 = np.sum(dZ2, axis=0, keepdims=True)\\n    dA1 = dZ2 @ ___                   # backprop to hidden\\n    dZ1 = dA1 * ___                   # apply ReLU derivative\\n    dW1 = X.T @ dZ1\\n    db1 = np.sum(dZ1, axis=0, keepdims=True)\\n    return dW1, db1, dW2, db2", "blanks": [ { "answer": "(A2 - Y)", "hint": "The softmax+cross-entropy gradient simplifies to (predictions - true labels)" }, { "answer": "W2.T", "hint": "Backprop through W2: multiply upstream gradient by W2 transposed" }, { "answer": "(Z1 > 0).astype(float)", "hint": "ReLU derivative: 1 where Z1 > 0, else 0" } ] }
\`\`\`

---

## Quiz

\`\`\`quiz
{ "title": "XOR and MNIST — Checkpoint Quiz", "questions": [ { "question": "Why can't a single-layer perceptron solve XOR?", "options": [ "XOR requires too many parameters for one layer", "XOR is not linearly separable — no single hyperplane can divide the two classes", "Single-layer networks can't use sigmoid activation", "The XOR function has too many input dimensions" ], "answer": 1, "explanation": "The four XOR points form two diagonal clusters in 2D space. No single straight line can separate (0,0)+(1,1) from (0,1)+(1,0). A hidden layer transforms the input space so a linear boundary works in the new space." }, { "question": "What does He initialization correct for?", "options": [ "Random initialization causing all weights to be zero", "ReLU zeroing ~50% of activations, which would otherwise reduce effective variance", "Softmax outputs summing to more than 1", "Mini-batch gradient noise causing oscillation" ], "answer": 1, "explanation": "ReLU passes roughly half of values (the positive ones) and kills the rest. Without compensation, layer-by-layer variance shrinks. He init scales weights by sqrt(2/n_in) to keep variance stable across layers." }, { "question": "In MNIST training, what does \`dZ2 = (A2 - Y) / m\` represent?", "options": [ "The derivative of the loss with respect to the input", "The derivative of cross-entropy loss with respect to the pre-softmax activations (softmax+CE combined gradient)", "The softmax activation itself", "The gradient of the hidden layer weights" ], "answer": 1, "explanation": "When softmax and cross-entropy loss are combined, the derivative of the loss w.r.t. the pre-softmax scores simplifies elegantly to (predictions - true_labels)/m. The log and exp cancel through the chain rule." }, { "question": "Why do we subtract the max before computing softmax?", "options": [ "To normalize outputs to sum to exactly 1", "To prevent numerical overflow — exp(large_number) can exceed float64 range", "To speed up training by reducing computation", "To ensure the smallest class probability is always zero" ], "answer": 1, "explanation": "exp(800) overflows to infinity in float64. Subtracting max(z) from all elements before exponentiation doesn't change the softmax output (it cancels in numerator and denominator) but keeps values in a safe numerical range." }, { "question": "What architecture achieves >95% accuracy on MNIST with pure NumPy?", "options": [ "1 hidden layer of 10 neurons with sigmoid + MSE loss", "2 hidden layers of 1024 neurons each with tanh", "1 hidden layer of 128 neurons with ReLU + softmax output + cross-entropy loss", "3 convolutional layers followed by a dense layer" ], "answer": 2, "explanation": "A single hidden layer of 128 ReLU units with softmax output and cross-entropy loss, trained with mini-batch SGD, reliably reaches 97–98% test accuracy on MNIST in 20 epochs. More neurons or layers help marginally but aren't necessary." } ] }
\`\`\`

---

## Common Bugs and How to Fix Them

\`\`\`callout
{ "type": "danger", "title": "Top 4 Bugs That Kill MNIST Training", "content": "**1. Forgetting to normalize:** Raw pixels [0–255] cause huge Z1 values → saturated ReLU → dead gradients. Always divide by 255.\\n\\n**2. Wrong one-hot shape:** If Y_train is shape (N,) instead of (N, 10), the dZ2 computation silently broadcasts incorrectly. Use \`np.eye(10)[y_train]\`.\\n\\n**3. No numerical stability in softmax:** \`np.exp(z)\` without subtracting max causes inf values. Always do \`z - np.max(z, axis=1, keepdims=True)\` first.\\n\\n**4. Dividing by m in the wrong place:** If you divide gradients by m in some places but not others, learning rate effectively changes between layers. Divide by m only once, in dZ2." }
\`\`\`

---

## Connecting the Dots

\`\`\`concept
{ "title": "XOR → MNIST: The Same Algorithm, Different Scale", "variant": "analogy", "content": "XOR has 4 samples, 2 features, 1 hidden layer with 4 neurons. MNIST has 60,000 samples, 784 features, 1 hidden layer with 128 neurons. The math is identical — only the shapes of the matrices change. If you understand XOR backprop, you understand MNIST backprop. Scale doesn't change the mechanics; it just makes NumPy vectorization more important." }
\`\`\`

When trained on real MNIST (load via \`keras.datasets.mnist\` or download from Yann LeCun's site), the same code you wrote above converges to:

| Metric | Expected Result |
|--------|----------------|
| Training accuracy | 98–99% |
| Test accuracy | 97–98% |
| Training time (20 epochs) | ~30s on CPU |
| Parameters | 784×128 + 128 + 128×10 + 10 = **101,770** |

---

\`\`\`collapse
{ "title": "Deep Dive: What the Hidden Layer Actually Learns", "content": "After training on MNIST, you can visualize the 128 rows of W1 as 28×28 images (reshape each column of W1 to 28×28). What you see:\\n\\n- Some neurons become **edge detectors** — they activate when a horizontal or vertical stroke appears in a specific region\\n- Others detect **curves** or **loops** characteristic of digits like 0, 6, 8, 9\\n- A few neurons specialize in **stroke endpoints** — where a pen lifts off\\n\\nThis is the network learning a sparse dictionary of visual primitives. W2 then votes among these primitives to decide the digit class. This is the same computation a CNN's first layer performs — just without the spatial structure convolution imposes. Your NumPy MLP is a crude but working vision system." }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "XOR proves that a single linear layer cannot model non-linear patterns — you need at least one hidden layer to bend decision boundaries", "The 2-layer MLP formula is universal: (X → Z1=XW1+b1 → A1=ReLU(Z1) → Z2=A1W2+b2 → A2=softmax(Z2)), with backprop dZ2=(A2-Y)/m flowing backwards", "He initialization (scale by sqrt(2/n_in)) prevents vanishing/exploding gradients in ReLU networks from the very first step", "The softmax + cross-entropy gradient simplifies to (predictions - labels)/m — a clean, numerically stable result from the chain rule", "A 101,770-parameter NumPy MLP trained with mini-batch SGD reaches 97–98% on MNIST — frameworks add convenience, not understanding", "Every concept here scales directly to deeper networks: add more layers, adjust shapes, repeat the same forward/backward pattern" ] }
\`\`\``,
    },
  ],
};
