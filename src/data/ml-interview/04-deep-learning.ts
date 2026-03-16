import { Module } from "../types";

export const deepLearningModule: Module = {
  id: "ml-deep-learning",
  title: "Deep Learning",
  description:
    "Neural network fundamentals through transformers — activation functions, backpropagation, CNNs, RNNs, and the attention mechanism.",
  lessons: [
    {
      id: "ml-dl-1",
      slug: "neural-network-fundamentals",
      title: "Neural Network Fundamentals",
      content: `# Neural Network Fundamentals

## The Building Blocks

A neural network is a composition of simple functions organized into layers. Each layer applies a linear transformation followed by a non-linear activation.

\`\`\`
Single Neuron:
  z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b    (linear combination)
  a = f(z)                                 (activation function)

Layer:
  Z = W * X + b      (matrix multiplication + bias)
  A = f(Z)           (element-wise activation)

Network:
  Input → Hidden₁ → Hidden₂ → ... → Output
  Each arrow = linear transform + activation
\`\`\`

## Architecture Terminology

\`\`\`
Input Layer:    Receives raw features. Size = number of features.
Hidden Layers:  Transform representations. Depth = number of hidden layers.
Output Layer:   Produces predictions.
                  Regression: 1 neuron, no activation (or linear)
                  Binary classification: 1 neuron, sigmoid
                  Multi-class: N neurons, softmax

Width:   Number of neurons per layer
Depth:   Number of layers
Parameters: Total weights + biases
  For a layer with n_in inputs and n_out outputs:
  Parameters = n_in * n_out + n_out (weights + biases)
\`\`\`

## Universal Approximation Theorem

A feedforward network with a single hidden layer containing enough neurons can approximate any continuous function to arbitrary accuracy. However, "enough neurons" may be impractical — deeper networks can represent the same functions with exponentially fewer parameters.

## Forward Pass

The forward pass computes predictions by flowing data through the network:

\`\`\`
Input X
  → Z₁ = W₁X + b₁ → A₁ = f(Z₁)
  → Z₂ = W₂A₁ + b₂ → A₂ = f(Z₂)
  → ...
  → Output ŷ
\`\`\`

## Why Depth Matters

\`\`\`
Shallow (1 hidden layer):
  Can approximate any function, but may need exponentially
  many neurons. Learns flat feature representations.

Deep (many hidden layers):
  Learns hierarchical representations.
  Layer 1: edges and textures
  Layer 2: shapes and patterns
  Layer 3: object parts
  Layer 4: whole objects

  Each layer builds on the previous, creating increasingly
  abstract representations.
\`\`\`

## Interview Questions

**Q: "What is the difference between parameters and hyperparameters?"**
A: Parameters (weights, biases) are learned during training. Hyperparameters (learning rate, number of layers, batch size) are set before training and control the learning process.

**Q: "Why can't we use a linear activation function?"**
A: A composition of linear functions is still linear. Without non-linear activations, a 100-layer network would be equivalent to a single linear transformation, unable to learn complex patterns.

**Q: "How do you choose network architecture?"**
A: Start simple and increase complexity. Rules of thumb: hidden size between input and output size, 2-3 hidden layers for most tasks, use established architectures for images (CNN) and sequences (RNN/Transformer).

## Exercise

Build a simple neural network from scratch using numpy to understand the forward pass.`,
      starterCode: `import numpy as np

class SimpleNeuralNet:
    """A 2-layer neural network built from scratch."""

    def __init__(self, input_size, hidden_size, output_size):
        np.random.seed(42)
        # TODO: Initialize weights and biases for 2 layers
        # Use small random values for weights, zeros for biases
        pass

    def sigmoid(self, z):
        # TODO: Implement sigmoid activation
        pass

    def forward(self, X):
        """Forward pass through the network."""
        # TODO: Compute hidden layer output
        # TODO: Compute output layer output
        # TODO: Return predictions
        pass

    def count_parameters(self):
        """Count total trainable parameters."""
        # TODO: Return total number of weights + biases
        pass

# Test with sample data
net = SimpleNeuralNet(input_size=4, hidden_size=8, output_size=3)
X = np.random.randn(5, 4)  # 5 samples, 4 features
# output = net.forward(X)
# print(f"Input shape: {X.shape}")
# print(f"Output shape: {output.shape}")
# print(f"Parameters: {net.count_parameters()}")`,
      solutionCode: `import numpy as np

class SimpleNeuralNet:
    """A 2-layer neural network built from scratch."""

    def __init__(self, input_size, hidden_size, output_size):
        np.random.seed(42)
        self.W1 = np.random.randn(input_size, hidden_size) * 0.01
        self.b1 = np.zeros((1, hidden_size))
        self.W2 = np.random.randn(hidden_size, output_size) * 0.01
        self.b2 = np.zeros((1, output_size))

    def sigmoid(self, z):
        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

    def softmax(self, z):
        exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))
        return exp_z / np.sum(exp_z, axis=1, keepdims=True)

    def forward(self, X):
        """Forward pass through the network."""
        self.Z1 = X @ self.W1 + self.b1
        self.A1 = self.sigmoid(self.Z1)
        self.Z2 = self.A1 @ self.W2 + self.b2
        self.A2 = self.softmax(self.Z2)
        return self.A2

    def count_parameters(self):
        """Count total trainable parameters."""
        return (self.W1.size + self.b1.size +
                self.W2.size + self.b2.size)

# Test with sample data
net = SimpleNeuralNet(input_size=4, hidden_size=8, output_size=3)
X = np.random.randn(5, 4)
output = net.forward(X)
print(f"Input shape:  {X.shape}")
print(f"Output shape: {output.shape}")
print(f"Output (probabilities):\\n{output.round(4)}")
print(f"Row sums (should be 1.0): {output.sum(axis=1).round(4)}")
print(f"Total parameters: {net.count_parameters()}")
print(f"  W1: {net.W1.shape} = {net.W1.size}")
print(f"  b1: {net.b1.shape} = {net.b1.size}")
print(f"  W2: {net.W2.shape} = {net.W2.size}")
print(f"  b2: {net.b2.shape} = {net.b2.size}")`,
    },
    {
      id: "ml-dl-2",
      slug: "activation-loss-functions",
      title: "Activation & Loss Functions",
      content: `# Activation & Loss Functions

## Activation Functions

Activation functions introduce non-linearity, enabling neural networks to learn complex patterns.

\`\`\`
Sigmoid:   σ(z) = 1 / (1 + e^(-z))
  Output: (0, 1)
  Use: Output layer for binary classification
  Problem: Vanishing gradients for large |z|, not zero-centered

Tanh:      tanh(z) = (e^z - e^(-z)) / (e^z + e^(-z))
  Output: (-1, 1)
  Use: Hidden layers (zero-centered, stronger gradients than sigmoid)
  Problem: Still suffers from vanishing gradients

ReLU:      f(z) = max(0, z)
  Output: [0, ∞)
  Use: Default for hidden layers in most networks
  Pros: Fast computation, no vanishing gradient for z > 0
  Problem: "Dying ReLU" — neurons with z < 0 always output 0

Leaky ReLU: f(z) = max(αz, z)    where α = 0.01
  Fixes dying ReLU by allowing small gradient when z < 0

ELU:       f(z) = z if z > 0, else α(e^z - 1)
  Smooth version of Leaky ReLU. Mean activations closer to zero.

GELU:      f(z) = z * Φ(z)    where Φ = CDF of standard normal
  Used in Transformers (BERT, GPT). Smooth approximation of ReLU.

Swish:     f(z) = z * σ(z)
  Self-gated. Often outperforms ReLU in deep networks.

Softmax:   softmax(zᵢ) = e^(zᵢ) / Σe^(zⱼ)
  Output: probability distribution over classes (sums to 1)
  Use: Output layer for multi-class classification
\`\`\`

## How to Choose Activation Functions

\`\`\`
Hidden layers:   ReLU (default) → Leaky ReLU or GELU if dying ReLU
Output layer:
  Binary classification   → Sigmoid
  Multi-class             → Softmax
  Regression              → Linear (no activation)
  Regression (positive)   → ReLU or Softplus
\`\`\`

## Loss Functions

The loss function measures how wrong the model's predictions are.

\`\`\`
Regression:
  MSE:    L = (1/n) Σ(yᵢ - ŷᵢ)²
          Penalizes large errors heavily. Sensitive to outliers.

  MAE:    L = (1/n) Σ|yᵢ - ŷᵢ|
          More robust to outliers. Not differentiable at 0.

  Huber:  MSE when |error| < δ, MAE otherwise.
          Best of both worlds. δ controls transition.

Classification:
  Binary Cross-Entropy:
    L = -(1/n) Σ[yᵢ log(ŷᵢ) + (1-yᵢ) log(1-ŷᵢ)]
    Used with sigmoid output.

  Categorical Cross-Entropy:
    L = -(1/n) Σ Σ yᵢⱼ log(ŷᵢⱼ)
    Used with softmax output.

  Hinge Loss:
    L = Σ max(0, 1 - yᵢ * ŷᵢ)
    Used by SVMs. Focuses on margin violations.

  Focal Loss:
    L = -α(1-ŷ)^γ log(ŷ)
    Down-weights easy examples. Great for extreme class imbalance.
\`\`\`

## Common Interview Questions

**Q: "Why use cross-entropy instead of MSE for classification?"**
A: MSE + sigmoid creates a non-convex loss surface with vanishing gradients when predictions are very wrong. Cross-entropy provides strong gradients even for confident wrong predictions, leading to faster, more reliable training.

**Q: "What happens if you use sigmoid for multi-class instead of softmax?"**
A: Sigmoid treats each class independently — outputs do not sum to 1. This is actually useful for multi-label classification (where multiple classes can be true simultaneously). For mutually exclusive classes, softmax enforces the constraint that probabilities sum to 1.

## Exercise

Implement activation functions from scratch and visualize their behavior.`,
      starterCode: `import numpy as np

def implement_activations():
    """Implement common activation functions from scratch."""
    z = np.linspace(-5, 5, 100)

    # TODO: Implement sigmoid, tanh, relu, leaky_relu
    # TODO: For each, compute: output and derivative
    # TODO: Print value at z=-2, z=0, z=2 for each activation
    # TODO: Show which activations suffer from vanishing gradients
    pass

def implement_losses():
    """Implement common loss functions."""
    y_true = np.array([1, 0, 1, 1, 0])
    y_pred = np.array([0.9, 0.1, 0.8, 0.6, 0.3])

    # TODO: Implement MSE, Binary Cross-Entropy
    # TODO: Print both losses
    # TODO: Show what happens when prediction is very wrong (y=1, pred=0.01)
    pass

implement_activations()
implement_losses()`,
      solutionCode: `import numpy as np

def implement_activations():
    """Implement common activation functions from scratch."""
    z_vals = [-2.0, 0.0, 2.0]

    def sigmoid(z):
        return 1 / (1 + np.exp(-z))

    def sigmoid_deriv(z):
        s = sigmoid(z)
        return s * (1 - s)

    def relu(z):
        return np.maximum(0, z)

    def relu_deriv(z):
        return (z > 0).astype(float)

    def leaky_relu(z, alpha=0.01):
        return np.where(z > 0, z, alpha * z)

    def tanh(z):
        return np.tanh(z)

    def tanh_deriv(z):
        return 1 - np.tanh(z) ** 2

    activations = {
        'Sigmoid': (sigmoid, sigmoid_deriv),
        'Tanh': (tanh, tanh_deriv),
        'ReLU': (relu, relu_deriv),
    }

    print("=== Activation Functions ===")
    for name, (func, deriv) in activations.items():
        print(f"\\n{name}:")
        for z in z_vals:
            print(f"  z={z:+.1f}  f(z)={func(z):+.4f}  f'(z)={deriv(z):.4f}")
        # Check vanishing gradient at extremes
        extreme_deriv = deriv(np.array(5.0))
        if extreme_deriv < 0.01:
            print(f"  WARNING: Vanishing gradient at z=5 (f'={extreme_deriv:.6f})")

def implement_losses():
    """Implement common loss functions."""
    y_true = np.array([1, 0, 1, 1, 0])
    y_pred = np.array([0.9, 0.1, 0.8, 0.6, 0.3])

    # MSE
    mse = np.mean((y_true - y_pred) ** 2)

    # Binary Cross-Entropy
    eps = 1e-15
    y_pred_clipped = np.clip(y_pred, eps, 1 - eps)
    bce = -np.mean(y_true * np.log(y_pred_clipped) +
                   (1 - y_true) * np.log(1 - y_pred_clipped))

    print("\\n=== Loss Functions ===")
    print(f"  MSE:  {mse:.4f}")
    print(f"  BCE:  {bce:.4f}")

    # Very wrong prediction
    print("\\n  When prediction is very wrong (y=1, pred=0.01):")
    wrong_mse = (1 - 0.01) ** 2
    wrong_bce = -np.log(0.01)
    print(f"    MSE loss: {wrong_mse:.4f}")
    print(f"    BCE loss: {wrong_bce:.4f}  (much stronger signal!)")

implement_activations()
implement_losses()`,
    },
    {
      id: "ml-dl-3",
      slug: "backprop-optimization",
      title: "Backpropagation & Optimization",
      content: `# Backpropagation & Optimization

## Backpropagation

Backpropagation computes gradients of the loss with respect to every weight in the network using the chain rule of calculus. It is the algorithm that makes training deep networks possible.

\`\`\`
Chain Rule:
  If L = f(g(h(x))), then:
  dL/dx = dL/df * df/dg * dg/dh * dh/dx

For a network:
  Forward: X → Z₁ → A₁ → Z₂ → A₂ → Loss
  Backward: dL/dA₂ → dL/dZ₂ → dL/dW₂ → dL/dA₁ → dL/dZ₁ → dL/dW₁

Gradient computation for layer l:
  dL/dZₗ = dL/dAₗ * f'(Zₗ)           (activation gradient)
  dL/dWₗ = Aₗ₋₁ᵀ * dL/dZₗ            (weight gradient)
  dL/dbₗ = sum(dL/dZₗ, axis=0)        (bias gradient)
  dL/dAₗ₋₁ = dL/dZₗ * Wₗᵀ            (pass gradient to previous layer)
\`\`\`

## Gradient Descent Variants

\`\`\`
Batch Gradient Descent:
  Compute gradient on ENTIRE dataset, then update.
  Stable but slow. One update per epoch.
  W = W - α * (1/N) * Σ∇L

Stochastic Gradient Descent (SGD):
  Compute gradient on ONE sample, then update.
  Noisy but fast. N updates per epoch.
  W = W - α * ∇Lᵢ

Mini-Batch SGD:
  Compute gradient on a BATCH of B samples.
  Best of both worlds. Common batch sizes: 32, 64, 128, 256.
  W = W - α * (1/B) * Σ∇Lᵢ
\`\`\`

## Modern Optimizers

\`\`\`
SGD + Momentum:
  v = β * v - α * ∇L
  W = W + v
  Accumulates past gradients to smooth updates.
  β typically 0.9.

RMSprop:
  s = β * s + (1-β) * (∇L)²
  W = W - α * ∇L / (sqrt(s) + ε)
  Adapts learning rate per parameter.
  Divides by running average of gradient magnitude.

Adam (Adaptive Moment Estimation):
  m = β₁ * m + (1-β₁) * ∇L          (first moment: mean)
  v = β₂ * v + (1-β₂) * (∇L)²       (second moment: variance)
  m̂ = m / (1-β₁ᵗ)                    (bias correction)
  v̂ = v / (1-β₂ᵗ)                    (bias correction)
  W = W - α * m̂ / (sqrt(v̂) + ε)

  Default: β₁=0.9, β₂=0.999, ε=1e-8
  The default optimizer for most deep learning tasks.

AdamW:
  Adam with decoupled weight decay.
  Fixes a subtle bug in Adam's L2 regularization.
  Preferred for Transformers and large models.
\`\`\`

## Learning Rate Scheduling

\`\`\`
Step Decay:      Reduce LR by factor every N epochs
Cosine Annealing: LR follows cosine curve from max to min
Warmup:          Start with small LR, gradually increase
                 Critical for Transformers
One-Cycle:       Increase then decrease LR during training
ReduceOnPlateau: Reduce LR when validation loss stops improving
\`\`\`

## Common Problems and Solutions

\`\`\`
Vanishing Gradients:   Gradients shrink to near-zero in early layers.
  Solutions: ReLU activation, batch normalization, residual connections,
             proper initialization (He/Xavier)

Exploding Gradients:   Gradients grow exponentially.
  Solutions: Gradient clipping, proper initialization, batch norm

Saddle Points:         Gradient is zero but not a minimum.
  Solutions: Momentum-based optimizers (Adam) escape saddle points

Overfitting:           Model memorizes training data.
  Solutions: Dropout, weight decay, early stopping, data augmentation,
             batch normalization
\`\`\`

## Weight Initialization

\`\`\`
Xavier/Glorot:  W ~ N(0, 2/(n_in + n_out))
                Best for sigmoid/tanh activations.

He (Kaiming):   W ~ N(0, 2/n_in)
                Best for ReLU activations.

Why it matters: Bad initialization → vanishing/exploding gradients
from the very first forward pass.
\`\`\`

## Exercise

Implement gradient descent optimizers from scratch on a simple problem.`,
      starterCode: `import numpy as np

def gradient_descent_comparison():
    """Compare gradient descent optimizers on a quadratic function."""
    # Minimize f(x, y) = x^2 + 10*y^2
    # Optimal: (0, 0)

    def loss(params):
        x, y = params
        return x**2 + 10 * y**2

    def gradient(params):
        x, y = params
        return np.array([2*x, 20*y])

    # TODO: Implement vanilla SGD
    # TODO: Implement SGD with momentum
    # TODO: Implement Adam
    # TODO: Run each for 100 steps from starting point (5, 5)
    # TODO: Print final position and loss for each
    pass

gradient_descent_comparison()`,
      solutionCode: `import numpy as np

def gradient_descent_comparison():
    """Compare gradient descent optimizers on a quadratic function."""
    def loss(params):
        x, y = params
        return x**2 + 10 * y**2

    def gradient(params):
        x, y = params
        return np.array([2*x, 20*y])

    start = np.array([5.0, 5.0])
    lr = 0.01
    steps = 100

    # Vanilla SGD
    params = start.copy()
    for _ in range(steps):
        params -= lr * gradient(params)
    print(f"Vanilla SGD:    pos=({params[0]:+.6f}, {params[1]:+.6f})  loss={loss(params):.6f}")

    # SGD + Momentum
    params = start.copy()
    velocity = np.zeros_like(params)
    beta = 0.9
    for _ in range(steps):
        velocity = beta * velocity - lr * gradient(params)
        params += velocity
    print(f"SGD + Momentum: pos=({params[0]:+.6f}, {params[1]:+.6f})  loss={loss(params):.6f}")

    # Adam
    params = start.copy()
    m = np.zeros_like(params)
    v = np.zeros_like(params)
    beta1, beta2, eps = 0.9, 0.999, 1e-8
    for t in range(1, steps + 1):
        g = gradient(params)
        m = beta1 * m + (1 - beta1) * g
        v = beta2 * v + (1 - beta2) * g**2
        m_hat = m / (1 - beta1**t)
        v_hat = v / (1 - beta2**t)
        params -= lr * m_hat / (np.sqrt(v_hat) + eps)
    print(f"Adam:           pos=({params[0]:+.6f}, {params[1]:+.6f})  loss={loss(params):.6f}")

gradient_descent_comparison()`,
    },
    {
      id: "ml-dl-4",
      slug: "convolutional-neural-networks",
      title: "Convolutional Neural Networks (CNNs)",
      content: `# Convolutional Neural Networks (CNNs)

## Why CNNs?

Standard neural networks do not scale to images. A 224x224 RGB image has 150,528 input features — a single fully connected hidden layer of 1000 neurons would require 150 million parameters. CNNs exploit the spatial structure of images through three key ideas: local connectivity, weight sharing, and translation invariance.

## Core Operations

### Convolution

\`\`\`
A small filter (kernel) slides across the input, computing
dot products at each position.

Input:  [1, 2, 3, 4, 5]     Filter: [1, 0, -1]
Output: [1*1 + 2*0 + 3*(-1),    = [-2, -2, -2]
         2*1 + 3*0 + 4*(-1),
         3*1 + 4*0 + 5*(-1)]

2D Convolution:
  Input:  H_in × W_in × C_in
  Filter: K × K × C_in       (one filter)
  Output: H_out × W_out × 1  (one feature map)

  With N filters: Output = H_out × W_out × N

Output size: H_out = (H_in - K + 2P) / S + 1
  K = kernel size, P = padding, S = stride
\`\`\`

**Parameter sharing:** The same filter weights are used at every spatial position. A 3x3 filter on 64-channel input has only 3*3*64 + 1 = 577 parameters, regardless of image size.

### Pooling

\`\`\`
Max Pooling:     Take the maximum value in each window
                 Most common. Provides translation invariance.
                 2x2 pool with stride 2 → halves spatial dimensions.

Average Pooling: Take the average value in each window
                 Smoother, preserves more information.

Global Average Pooling: Average over entire spatial dimension
                        Outputs a single value per channel.
                        Replaces fully connected layers at the end.
\`\`\`

## Classic Architectures (Interview Must-Know)

\`\`\`
Architecture    Year   Key Innovation                Depth
──────────────────────────────────────────────────────────────
LeNet-5         1998   First practical CNN           5 layers
AlexNet         2012   ReLU, dropout, GPU training   8 layers
VGGNet          2014   Small 3x3 filters stacked     19 layers
GoogLeNet       2014   Inception modules (parallel)   22 layers
ResNet          2015   Skip connections (residual)    152 layers
EfficientNet    2019   Compound scaling               Variable
\`\`\`

## Residual Connections (ResNet)

The most important architectural innovation in deep learning:

\`\`\`
Standard:   output = F(x)
Residual:   output = F(x) + x     (skip connection)

Why it works:
  - Gradients flow directly through skip connections
  - Network can learn identity mapping (F(x) = 0)
  - Enables training of very deep networks (100+ layers)
  - Solves vanishing gradient problem
\`\`\`

## Key Concepts for Interviews

\`\`\`
Receptive Field:   The region of input that affects a neuron's output.
                   Deeper layers have larger receptive fields.
                   Stacking 3x3 convolutions: two 3x3 = one 5x5 receptive field

1x1 Convolutions:  Change number of channels without spatial change.
                   Acts as a fully connected layer across channels.
                   Used for dimensionality reduction.

Batch Normalization: Normalize activations within each mini-batch.
                     Stabilizes training, allows higher learning rates.
                     Applied after convolution, before activation.

Depthwise Separable Convolution:
  Split standard convolution into depthwise + pointwise.
  Reduces parameters by ~K² factor. Used in MobileNet.
\`\`\`

## Transfer Learning

In practice, you rarely train CNNs from scratch. Transfer learning uses a model pretrained on ImageNet and fine-tunes it for your task.

\`\`\`
Strategy 1 — Feature Extraction:
  Freeze pretrained layers, train only final classifier.
  Use when: small dataset, similar domain.

Strategy 2 — Fine-tuning:
  Unfreeze some/all pretrained layers, train with small LR.
  Use when: medium dataset, somewhat different domain.
\`\`\`

## Exercise

Understand CNN architecture by computing dimensions and parameter counts.`,
      starterCode: `import numpy as np

def cnn_calculations():
    """Compute CNN output dimensions and parameter counts."""
    # Architecture: Input(32x32x3) → Conv(16 filters, 3x3, padding=1)
    #               → MaxPool(2x2) → Conv(32 filters, 3x3, padding=1)
    #               → MaxPool(2x2) → FC(128) → FC(10)

    # TODO: Compute output dimensions after each layer
    # TODO: Compute parameter count for each layer
    # TODO: Compute total parameters
    # TODO: Compare with a fully connected network of same input/output
    pass

cnn_calculations()`,
      solutionCode: `import numpy as np

def cnn_calculations():
    """Compute CNN output dimensions and parameter counts."""
    def conv_output_size(h_in, kernel, padding, stride):
        return (h_in - kernel + 2 * padding) // stride + 1

    print("=== CNN Architecture Analysis ===")
    print("Input: 32x32x3\\n")

    # Layer 1: Conv(16 filters, 3x3, padding=1, stride=1)
    h1 = conv_output_size(32, 3, 1, 1)
    params1 = 16 * (3 * 3 * 3) + 16  # filters * (K*K*C_in) + bias
    print(f"Conv1 (16 filters 3x3, pad=1): {h1}x{h1}x16")
    print(f"  Parameters: {params1}")

    # MaxPool 2x2
    h2 = h1 // 2
    print(f"MaxPool 2x2:                   {h2}x{h2}x16")
    print(f"  Parameters: 0")

    # Layer 2: Conv(32 filters, 3x3, padding=1, stride=1)
    h3 = conv_output_size(h2, 3, 1, 1)
    params2 = 32 * (3 * 3 * 16) + 32
    print(f"Conv2 (32 filters 3x3, pad=1): {h3}x{h3}x32")
    print(f"  Parameters: {params2}")

    # MaxPool 2x2
    h4 = h3 // 2
    print(f"MaxPool 2x2:                   {h4}x{h4}x32")
    print(f"  Parameters: 0")

    # Flatten
    flat_size = h4 * h4 * 32
    print(f"Flatten:                       {flat_size}")

    # FC1: 128 neurons
    params_fc1 = flat_size * 128 + 128
    print(f"FC1 (128):                     128")
    print(f"  Parameters: {params_fc1}")

    # FC2: 10 neurons (output)
    params_fc2 = 128 * 10 + 10
    print(f"FC2 (10):                      10")
    print(f"  Parameters: {params_fc2}")

    total_cnn = params1 + params2 + params_fc1 + params_fc2
    print(f"\\nTotal CNN parameters:    {total_cnn:,}")

    # Compare with fully connected
    fc_total = 32*32*3 * 128 + 128 + 128 * 10 + 10
    print(f"Equivalent FC parameters: {fc_total:,}")
    print(f"CNN uses {total_cnn/fc_total*100:.1f}% of FC parameters")

cnn_calculations()`,
    },
    {
      id: "ml-dl-5",
      slug: "rnns-lstms",
      title: "RNNs & LSTMs",
      content: `# Recurrent Neural Networks & LSTMs

## Why Sequence Models?

Many real-world data types are sequential: text, time series, audio, video. Standard feedforward networks treat each input independently and cannot model temporal dependencies. Recurrent Neural Networks (RNNs) maintain a hidden state that carries information across time steps.

## Vanilla RNN

\`\`\`
At each time step t:
  hₜ = tanh(Wₕₕ * hₜ₋₁ + Wₓₕ * xₜ + bₕ)
  yₜ = Wₕᵧ * hₜ + bᵧ

Key insight: The same weights (Wₕₕ, Wₓₕ) are shared across all time steps.

Hidden state hₜ acts as "memory" of everything seen so far.

Unrolled view:
  x₁ → [RNN] → h₁ → [RNN] → h₂ → [RNN] → h₃ → y
            ↑              ↑              ↑
           h₀             h₁             h₂
\`\`\`

## The Vanishing Gradient Problem

When backpropagating through many time steps, gradients are multiplied at each step. If the multiplication factor is < 1, gradients vanish exponentially. If > 1, they explode.

\`\`\`
Gradient at step 1 from loss at step T:
  ∂L/∂h₁ = ∂L/∂hₜ * Π(∂hₖ₊₁/∂hₖ)

If each factor ≈ 0.9:  0.9^100 ≈ 0.00003  (vanished)
If each factor ≈ 1.1:  1.1^100 ≈ 13,781   (exploded)

Result: Vanilla RNNs cannot learn dependencies beyond ~10-20 steps.
\`\`\`

## LSTM (Long Short-Term Memory)

LSTMs solve the vanishing gradient problem with a gating mechanism that controls information flow.

\`\`\`
Three gates + cell state:

Forget Gate:   fₜ = σ(Wf * [hₜ₋₁, xₜ] + bf)
  "What to forget from cell state"

Input Gate:    iₜ = σ(Wi * [hₜ₋₁, xₜ] + bi)
               c̃ₜ = tanh(Wc * [hₜ₋₁, xₜ] + bc)
  "What new information to add"

Cell Update:   cₜ = fₜ * cₜ₋₁ + iₜ * c̃ₜ
  "Update cell state (the long-term memory)"

Output Gate:   oₜ = σ(Wo * [hₜ₋₁, xₜ] + bo)
               hₜ = oₜ * tanh(cₜ)
  "What to output from cell state"

Key insight: Cell state cₜ flows through with only element-wise
operations (multiply by forget gate, add input gate). Gradients
can flow unchanged through time — solving vanishing gradients.
\`\`\`

## GRU (Gated Recurrent Unit)

A simpler alternative to LSTM with two gates instead of three:

\`\`\`
Reset Gate:  rₜ = σ(Wr * [hₜ₋₁, xₜ])
Update Gate: zₜ = σ(Wz * [hₜ₋₁, xₜ])
Candidate:   h̃ₜ = tanh(W * [rₜ * hₜ₋₁, xₜ])
Output:      hₜ = (1-zₜ) * hₜ₋₁ + zₜ * h̃ₜ

Fewer parameters than LSTM. Similar performance in most tasks.
\`\`\`

## Bidirectional RNNs

Process the sequence in both directions and concatenate:

\`\`\`
Forward:   h→ₜ reads left-to-right
Backward:  h←ₜ reads right-to-left
Output:    hₜ = [h→ₜ ; h←ₜ]

Use when: Full sequence is available (text classification, NER).
Cannot use for: Autoregressive generation (future is unknown).
\`\`\`

## Sequence-to-Sequence (Encoder-Decoder)

\`\`\`
Encoder: Reads input sequence, produces context vector.
Decoder: Generates output sequence from context vector.

Applications: Machine translation, summarization, chatbots.
Limitation: Fixed-size context vector is a bottleneck.
Solution: Attention mechanism (next lesson).
\`\`\`

## When to Use What (2024+)

\`\`\`
Task                      Best Choice
──────────────────────────────────────────
Text classification       Transformer (BERT)
Text generation           Transformer (GPT)
Short time series         LSTM / GRU
Long time series          Transformer / S4 / Mamba
Speech recognition        Transformer (Whisper)
Simple sequence tasks     LSTM (still works well, simpler)
\`\`\`

## Exercise

Implement a simple RNN forward pass from scratch to understand the recurrence.`,
      starterCode: `import numpy as np

class SimpleRNN:
    """Vanilla RNN implementation from scratch."""

    def __init__(self, input_size, hidden_size, output_size):
        np.random.seed(42)
        scale = 0.01
        # TODO: Initialize Wxh, Whh, Why, bh, by
        pass

    def forward(self, inputs):
        """Process a sequence of inputs.
        inputs: list of input vectors, one per time step.
        Returns: list of outputs and list of hidden states.
        """
        # TODO: Initialize h to zeros
        # TODO: For each time step, compute new h and output y
        # TODO: Return outputs and hidden states
        pass

# Test: sequence of 5 time steps, input_size=3, hidden=4, output=2
rnn = SimpleRNN(input_size=3, hidden_size=4, output_size=2)
inputs = [np.random.randn(1, 3) for _ in range(5)]
# outputs, hiddens = rnn.forward(inputs)
# print(f"Sequence length: {len(outputs)}")
# print(f"Output shape: {outputs[0].shape}")
# print(f"Hidden state shape: {hiddens[0].shape}")`,
      solutionCode: `import numpy as np

class SimpleRNN:
    """Vanilla RNN implementation from scratch."""

    def __init__(self, input_size, hidden_size, output_size):
        np.random.seed(42)
        scale = 0.01
        self.hidden_size = hidden_size
        self.Wxh = np.random.randn(input_size, hidden_size) * scale
        self.Whh = np.random.randn(hidden_size, hidden_size) * scale
        self.Why = np.random.randn(hidden_size, output_size) * scale
        self.bh = np.zeros((1, hidden_size))
        self.by = np.zeros((1, output_size))

    def forward(self, inputs):
        """Process a sequence of inputs."""
        h = np.zeros((1, self.hidden_size))
        outputs = []
        hiddens = [h.copy()]

        for x in inputs:
            h = np.tanh(x @ self.Wxh + h @ self.Whh + self.bh)
            y = h @ self.Why + self.by
            outputs.append(y)
            hiddens.append(h.copy())

        return outputs, hiddens

# Test
rnn = SimpleRNN(input_size=3, hidden_size=4, output_size=2)
inputs = [np.random.randn(1, 3) for _ in range(5)]
outputs, hiddens = rnn.forward(inputs)

print(f"Sequence length: {len(outputs)}")
print(f"Output shape: {outputs[0].shape}")
print(f"Hidden state shape: {hiddens[0].shape}")
print(f"\\nHidden states evolve over time:")
for t, h in enumerate(hiddens):
    print(f"  t={t}: {h[0].round(4)}")
print(f"\\nOutputs:")
for t, y in enumerate(outputs):
    print(f"  t={t}: {y[0].round(4)}")

# Parameter count
total_params = (rnn.Wxh.size + rnn.Whh.size + rnn.Why.size +
                rnn.bh.size + rnn.by.size)
print(f"\\nTotal parameters: {total_params}")`,
    },
    {
      id: "ml-dl-6",
      slug: "transformers-attention",
      title: "Transformers & Attention",
      content: `# Transformers & Attention

## The Attention Revolution

The Transformer architecture, introduced in "Attention Is All You Need" (2017), replaced RNNs as the dominant sequence model. Every major language model (GPT, BERT, Claude, Gemini) and many vision models (ViT) use Transformers.

## Self-Attention Mechanism

The core idea: for each element in a sequence, compute how much to "attend to" every other element.

\`\`\`
Input: sequence of embeddings X = [x₁, x₂, ..., xₙ]

Three projections per element:
  Query:  Q = X * Wq    "What am I looking for?"
  Key:    K = X * Wk    "What do I contain?"
  Value:  V = X * Wv    "What information do I provide?"

Attention scores:
  Scores = Q * Kᵀ / sqrt(d_k)      (scaled dot-product)
  Weights = softmax(Scores)          (normalize to probabilities)
  Output = Weights * V               (weighted sum of values)

Full formula:
  Attention(Q, K, V) = softmax(Q * Kᵀ / sqrt(d_k)) * V

Why sqrt(d_k)?  Without scaling, dot products grow with dimension,
pushing softmax into extreme values with tiny gradients.
\`\`\`

## Multi-Head Attention

Instead of one attention function, use multiple "heads" that attend to different aspects of the input:

\`\`\`
MultiHead(Q, K, V) = Concat(head₁, head₂, ..., headₕ) * W_o

Each head:
  headᵢ = Attention(Q * Wᵢq, K * Wᵢk, V * Wᵢv)

If model dimension = 512 and num_heads = 8:
  Each head operates on 512/8 = 64 dimensions.

Why multiple heads?
  Head 1 might attend to syntactic relationships
  Head 2 might attend to semantic similarity
  Head 3 might attend to positional proximity
  Captures richer relationships than a single attention.
\`\`\`

## Transformer Architecture

\`\`\`
Encoder Block (repeat N times):
  Input → Multi-Head Self-Attention → Add & LayerNorm
        → Feed-Forward Network → Add & LayerNorm → Output

  Feed-Forward: two linear layers with ReLU/GELU
    FFN(x) = W₂ * GELU(W₁ * x + b₁) + b₂
    Typically inner dimension = 4 * model dimension

Decoder Block (repeat N times):
  Input → Masked Multi-Head Self-Attention → Add & LayerNorm
        → Cross-Attention (Q from decoder, K/V from encoder)
        → Add & LayerNorm → Feed-Forward → Add & LayerNorm

Key difference: Decoder uses MASKED attention — each position
can only attend to previous positions (prevents "seeing the future").
\`\`\`

## Positional Encoding

Attention is permutation-invariant — it does not know word order. Positional encodings inject position information.

\`\`\`
Sinusoidal (original):
  PE(pos, 2i)   = sin(pos / 10000^(2i/d))
  PE(pos, 2i+1) = cos(pos / 10000^(2i/d))

Learned positional embeddings: trainable vectors per position.
  Used by GPT, BERT.

Rotary Position Embeddings (RoPE): encode relative positions
  through rotation matrices. Used by modern LLMs (LLaMA, etc.).
\`\`\`

## Key Architectures

\`\`\`
BERT (Encoder-only):
  Bidirectional. Pre-trained with masked language modeling.
  Best for: classification, NER, question answering.

GPT (Decoder-only):
  Autoregressive. Pre-trained with next token prediction.
  Best for: text generation, few-shot learning, general tasks.

T5 (Encoder-Decoder):
  Frames all tasks as text-to-text.
  Best for: translation, summarization, structured generation.

Vision Transformer (ViT):
  Splits image into patches, treats as sequence.
  Competitive with CNNs on image tasks with enough data.
\`\`\`

## Computational Complexity

\`\`\`
Self-attention: O(n² * d) where n = sequence length, d = dimension
  Quadratic in sequence length — the main bottleneck.

Solutions for long sequences:
  Sparse Attention:  Attend to subset of positions (Longformer)
  Linear Attention:  Approximate softmax with kernels
  Flash Attention:   Hardware-optimized exact attention (faster, not approximate)
  State Space Models: Mamba — O(n) alternative to attention
\`\`\`

## Interview Questions

**Q: "Why did Transformers replace RNNs?"**
A: Three reasons. (1) Parallelizable — all positions compute simultaneously, unlike sequential RNNs. (2) Direct long-range connections — attention connects any two positions in O(1) vs O(n) for RNNs. (3) Scalability — Transformers scale more efficiently with data and compute.

**Q: "What is the difference between self-attention and cross-attention?"**
A: Self-attention: Q, K, V all come from the same sequence. Cross-attention: Q comes from one sequence (decoder), K and V come from another (encoder output).

## Exercise

Implement scaled dot-product attention from scratch.`,
      starterCode: `import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    """Implement scaled dot-product attention.

    Q: (batch, seq_len_q, d_k)
    K: (batch, seq_len_k, d_k)
    V: (batch, seq_len_k, d_v)
    mask: optional (batch, seq_len_q, seq_len_k)

    Returns: attention output and attention weights
    """
    # TODO: Compute attention scores (Q @ K^T)
    # TODO: Scale by sqrt(d_k)
    # TODO: Apply mask if provided (set masked positions to -inf)
    # TODO: Apply softmax
    # TODO: Multiply by V
    # TODO: Return output and weights
    pass

# Test
batch, seq_len, d_k, d_v = 1, 4, 8, 8
Q = np.random.randn(batch, seq_len, d_k)
K = np.random.randn(batch, seq_len, d_k)
V = np.random.randn(batch, seq_len, d_v)

# output, weights = scaled_dot_product_attention(Q, K, V)
# print(f"Output shape: {output.shape}")
# print(f"Attention weights:\\n{weights[0].round(3)}")`,
      solutionCode: `import numpy as np

def softmax(x, axis=-1):
    exp_x = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return exp_x / np.sum(exp_x, axis=axis, keepdims=True)

def scaled_dot_product_attention(Q, K, V, mask=None):
    """Implement scaled dot-product attention."""
    d_k = Q.shape[-1]

    # Compute attention scores
    scores = Q @ K.transpose(0, 2, 1)  # (batch, seq_q, seq_k)

    # Scale
    scores = scores / np.sqrt(d_k)

    # Apply mask
    if mask is not None:
        scores = np.where(mask == 0, -1e9, scores)

    # Softmax
    weights = softmax(scores, axis=-1)

    # Weighted sum of values
    output = weights @ V  # (batch, seq_q, d_v)

    return output, weights

# Test without mask
batch, seq_len, d_k, d_v = 1, 4, 8, 8
np.random.seed(42)
Q = np.random.randn(batch, seq_len, d_k)
K = np.random.randn(batch, seq_len, d_k)
V = np.random.randn(batch, seq_len, d_v)

output, weights = scaled_dot_product_attention(Q, K, V)
print(f"Output shape: {output.shape}")
print(f"Attention weights (each row sums to 1):")
print(f"{weights[0].round(3)}")
print(f"Row sums: {weights[0].sum(axis=-1).round(4)}")

# Test with causal mask (decoder)
print(f"\\n=== With Causal Mask (Decoder) ===")
mask = np.tril(np.ones((1, seq_len, seq_len)))
output_masked, weights_masked = scaled_dot_product_attention(Q, K, V, mask)
print(f"Causal attention weights:")
print(f"{weights_masked[0].round(3)}")
print(f"Note: upper triangle is zero (can't attend to future)")`,
    },
  ],
};
