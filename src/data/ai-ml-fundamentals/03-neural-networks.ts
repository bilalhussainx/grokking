import { Module } from "../types";

export const neuralNetworksModule: Module = {
  id: "aiml-neural-networks",
  title: "Neural Networks Basics",
  description:
    "Understand how neurons, layers, and activation functions combine to form neural networks. Implement a multi-layer perceptron from scratch and see how non-linear decision boundaries emerge.",
  lessons: [
    {
      id: "aiml-perceptron-to-network",
      slug: "perceptron-to-network",
      title: "From Perceptron to Neural Network",
      content: `## From Perceptron to Neural Network

<!-- voice:section_check -->

A neural network is just layers of logistic regression units chained together. That single insight demystifies the entire field.

### The Perceptron (1957)

Frank Rosenblatt's **perceptron** was the first neural network model. It computes:

\`\`\`
output = step_function(w1*x1 + w2*x2 + ... + b)
\`\`\`

The step function outputs 1 if the sum is positive, 0 otherwise. This is a binary classifier — exactly logistic regression with a hard threshold.

### The XOR Problem

In 1969, Minsky and Papert proved that a single perceptron **cannot learn XOR**:

| x1 | x2 | XOR |
|----|----|----|
| 0  | 0  | 0  |
| 0  | 1  | 1  |
| 1  | 0  | 1  |
| 1  | 1  | 0  |

No single straight line can separate the 1s from the 0s. This killed neural network research for a decade.

### The Solution: Multiple Layers

Stack two or more layers of neurons and suddenly you can learn XOR and **any** continuous function (Universal Approximation Theorem, Hornik et al., 1989).

\`\`\`
Input Layer    Hidden Layer    Output Layer
   x1 ------>  h1 -------->
                               output
   x2 ------>  h2 -------->
\`\`\`

<!-- voice:key_insight -->

Each hidden neuron learns a different linear boundary. The output layer combines these boundaries to create complex, non-linear decision regions.

\`\`\`mermaid
graph LR
    subgraph Input Layer
        x1["x1"]
        x2["x2"]
        x3["x3"]
    end
    subgraph Hidden Layer
        h1["h1"]
        h2["h2"]
        h3["h3"]
        h4["h4"]
    end
    subgraph Output Layer
        o1["output"]
    end

    x1 --> h1 & h2 & h3 & h4
    x2 --> h1 & h2 & h3 & h4
    x3 --> h1 & h2 & h3 & h4
    h1 & h2 & h3 & h4 --> o1

    style x1 fill:#0ea5e9,color:#fff
    style x2 fill:#0ea5e9,color:#fff
    style x3 fill:#0ea5e9,color:#fff
    style h1 fill:#7c3aed,color:#fff
    style h2 fill:#7c3aed,color:#fff
    style h3 fill:#7c3aed,color:#fff
    style h4 fill:#7c3aed,color:#fff
    style o1 fill:#ef4444,color:#fff
\`\`\`

### Activation Functions

The key to non-linearity. Without activation functions, stacking layers is pointless (a linear function of linear functions is still linear).

| Function | Formula | Range | Use Case |
|----------|---------|-------|----------|
| **Sigmoid** | 1/(1+e^(-z)) | (0, 1) | Output layer for binary classification |
| **Tanh** | (e^z - e^(-z))/(e^z + e^(-z)) | (-1, 1) | Hidden layers (centered at 0) |
| **ReLU** | max(0, z) | [0, inf) | Hidden layers (most common today) |
| **Softmax** | e^zi / sum(e^zj) | (0, 1), sums to 1 | Output layer for multi-class |

### Why ReLU Dominates

ReLU (Rectified Linear Unit) solved the **vanishing gradient problem**. Sigmoid and tanh have gradients near zero for large inputs, which kills learning in deep networks. ReLU's gradient is either 0 or 1 — no vanishing.

### Key Takeaway

Neural networks gain their power from non-linear activation functions applied across multiple layers. Each layer transforms the data into a representation that makes the next layer's job easier.

### Reflection Questions

- Why did the XOR problem halt neural network research? What was the key insight that resolved it?
- What would happen if you used a linear activation function in every layer?`,
    },
    {
      id: "aiml-forward-pass-exercise",
      slug: "forward-pass-exercise",
      title: "Exercise: Neural Network Forward Pass",
      content: `## Exercise: Neural Network Forward Pass

Implement the forward pass of a 2-layer neural network. This is the foundation — before we can train a network, we need to compute its predictions.

### Architecture

\`\`\`
Input (2 features) -> Hidden (4 neurons, ReLU) -> Output (1 neuron, sigmoid)
\`\`\`

### Forward Pass Steps

1. Compute z1 = X @ W1 + b1 (linear transformation)
2. Compute a1 = relu(z1) (activation)
3. Compute z2 = a1 @ W2 + b2 (linear transformation)
4. Compute a2 = sigmoid(z2) (output probability)

### Hints

- W1 shape: (n_features, n_hidden) = (2, 4)
- W2 shape: (n_hidden, 1) = (4, 1)
- ReLU: \`np.maximum(0, z)\`
- Sigmoid: \`1 / (1 + np.exp(-z))\``,
      starterCode: `import numpy as np

def relu(z):
    """ReLU activation: max(0, z).

    Args:
        z: numpy array
    Returns:
        numpy array with negative values replaced by 0
    """
    # TODO: Return element-wise maximum of 0 and z
    pass

def sigmoid(z):
    """Sigmoid activation: 1 / (1 + exp(-z))."""
    # TODO: Implement sigmoid
    pass

def initialize_parameters(n_input, n_hidden, n_output, seed=42):
    """Initialize weights with small random values and biases with zeros.

    Args:
        n_input: number of input features
        n_hidden: number of hidden neurons
        n_output: number of output neurons
    Returns:
        dict with keys W1, b1, W2, b2
    """
    np.random.seed(seed)
    # TODO: Initialize W1 as random * 0.01, shape (n_input, n_hidden)
    # TODO: Initialize b1 as zeros, shape (1, n_hidden)
    # TODO: Initialize W2 as random * 0.01, shape (n_hidden, n_output)
    # TODO: Initialize b2 as zeros, shape (1, n_output)
    pass

def forward(X, params):
    """Compute the forward pass of a 2-layer neural network.

    Args:
        X: input data, shape (n_samples, n_features)
        params: dict with W1, b1, W2, b2
    Returns:
        tuple: (output probabilities, cache dict with z1, a1, z2, a2)
    """
    # TODO: Layer 1: z1 = X @ W1 + b1, a1 = relu(z1)
    # TODO: Layer 2: z2 = a1 @ W2 + b2, a2 = sigmoid(z2)
    # TODO: Return (a2, cache)
    pass

# Test cases
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
params = initialize_parameters(2, 4, 1)

output, cache = forward(X, params)
print(f"Output shape: {output.shape}")
# Expected: (4, 1)

print(f"Output values:\\n{output}")
# Expected: 4 values each close to 0.5 (random init, untrained)

print(f"All outputs between 0 and 1: {np.all((output >= 0) & (output <= 1))}")
# Expected: True

print(f"Hidden activations (a1) shape: {cache['a1'].shape}")
# Expected: (4, 4)

print(f"No negative values in a1: {np.all(cache['a1'] >= 0)}")
# Expected: True (ReLU ensures non-negative)`,
      solutionCode: `import numpy as np

def relu(z):
    """ReLU activation: max(0, z).

    Args:
        z: numpy array
    Returns:
        numpy array with negative values replaced by 0
    """
    return np.maximum(0, z)

def sigmoid(z):
    """Sigmoid activation: 1 / (1 + exp(-z))."""
    return 1 / (1 + np.exp(-z))

def initialize_parameters(n_input, n_hidden, n_output, seed=42):
    """Initialize weights with small random values and biases with zeros.

    Args:
        n_input: number of input features
        n_hidden: number of hidden neurons
        n_output: number of output neurons
    Returns:
        dict with keys W1, b1, W2, b2
    """
    np.random.seed(seed)
    params = {
        'W1': np.random.randn(n_input, n_hidden) * 0.01,
        'b1': np.zeros((1, n_hidden)),
        'W2': np.random.randn(n_hidden, n_output) * 0.01,
        'b2': np.zeros((1, n_output)),
    }
    return params

def forward(X, params):
    """Compute the forward pass of a 2-layer neural network.

    Args:
        X: input data, shape (n_samples, n_features)
        params: dict with W1, b1, W2, b2
    Returns:
        tuple: (output probabilities, cache dict with z1, a1, z2, a2)
    """
    # Layer 1
    z1 = X @ params['W1'] + params['b1']
    a1 = relu(z1)

    # Layer 2
    z2 = a1 @ params['W2'] + params['b2']
    a2 = sigmoid(z2)

    cache = {'z1': z1, 'a1': a1, 'z2': z2, 'a2': a2}
    return a2, cache

# Time complexity: O(n_samples * n_hidden * n_features) per forward pass
# Space complexity: O(n_samples * n_hidden) for activations cache

# Test cases
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
params = initialize_parameters(2, 4, 1)

output, cache = forward(X, params)
print(f"Output shape: {output.shape}")
# Expected: (4, 1)

print(f"Output values:\\n{output}")
# Expected: 4 values each close to 0.5 (random init, untrained)

print(f"All outputs between 0 and 1: {np.all((output >= 0) & (output <= 1))}")
# Expected: True

print(f"Hidden activations (a1) shape: {cache['a1'].shape}")
# Expected: (4, 4)

print(f"No negative values in a1: {np.all(cache['a1'] >= 0)}")
# Expected: True (ReLU ensures non-negative)`,
    },
    {
      id: "aiml-nn-checkpoint",
      slug: "neural-networks-checkpoint",
      title: "Checkpoint: Neural Networks Basics",
      content: `## Checkpoint: Neural Networks Basics

<!-- voice:section_check -->

Test your understanding of neural network architecture before we tackle training and backpropagation.

---

### Question 1
Why can a single perceptron not learn the XOR function?

A) XOR has too many inputs
B) XOR is not a real function
C) XOR is not linearly separable — no single straight line can divide the classes
D) The perceptron learning algorithm is too slow

**Answer: C** — XOR outputs 1 when exactly one input is 1. If you plot the four data points, the 0s and 1s are diagonally opposite — no single line can separate them. This requires at least one hidden layer.

---

### Question 2
What is the purpose of activation functions in neural networks?

A) To speed up computation
B) To introduce non-linearity, enabling the network to learn complex patterns
C) To regularize the model and prevent overfitting
D) To normalize the inputs

**Answer: B** — Without activation functions, a multi-layer network computes a composition of linear functions, which is itself linear. Activation functions like ReLU introduce non-linearity, giving the network the power to learn any continuous function.

---

### Question 3
Why has ReLU largely replaced sigmoid and tanh in hidden layers of deep networks?

A) ReLU is differentiable everywhere
B) ReLU outputs are always positive
C) ReLU avoids the vanishing gradient problem because its gradient is 1 for positive inputs
D) ReLU is more mathematically elegant

**Answer: C** — Sigmoid and tanh saturate for large inputs, producing gradients near zero that prevent learning in deep networks. ReLU has a constant gradient of 1 for positive inputs, allowing gradients to flow freely through many layers.

---

### Question 4
In a network with input size 3, hidden layer size 8, and output size 2, how many total parameters (weights + biases) are there?

A) 13
B) 34
C) 42
D) 50

**Answer: C** — Layer 1: 3*8 weights + 8 biases = 32. Layer 2: 8*2 weights + 2 biases = 18. Total = 32 + 18 = 50. Wait, let me recount: W1 is (3,8)=24 weights + 8 biases = 32. W2 is (8,2)=16 weights + 2 biases = 18. Total = 32 + 18 = 50. **The correct answer is D) 50.**

---

### Question 5
The Universal Approximation Theorem states that:

A) Any neural network can perfectly memorize any dataset
B) A single hidden layer with enough neurons can approximate any continuous function
C) Deep networks always outperform shallow networks
D) Neural networks can solve any computational problem

**Answer: B** — Hornik et al. (1989) proved that a feed-forward network with a single hidden layer containing a finite number of neurons can approximate any continuous function on compact subsets of R^n, given appropriate weights. However, the theorem says nothing about how to *find* those weights or how many neurons are needed.`,
    },
  ],
};
