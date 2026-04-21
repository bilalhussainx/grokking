import { Module } from "../types";

export const batchNormModule: Module = {
  id: "nn-batchnorm",
  title: "Activations & Batch Normalization",
  description: "Diagnose and fix training problems with proper initialization and normalization. Based on Karpathy's 'Building makemore Part 3: Activations & Gradients, BatchNorm' (https://www.youtube.com/watch?v=P6sfmUTpUmc).",
  lessons: [
    {
      id: "nn-batchnorm-activation-stats",
      slug: "activation-statistics",
      title: "Activation Statistics",
      content: `## Activation Statistics

> **Lecture Resource:** [Building makemore Part 3: Activations & Gradients, BatchNorm](https://www.youtube.com/watch?v=P6sfmUTpUmc) by Andrej Karpathy

Before throwing more data or bigger models at a problem, you should **look inside the network**. Activation statistics reveal common pathologies that silently kill training.

### The Hidden Layer Output Distribution

After the hidden layer, every activation passes through tanh, which outputs values between -1 and 1. Let us examine the distribution:

\`\`\`python
# Forward pass with statistics tracking
emb = C[Xtr]
h_preact = emb.view(-1, n_embd * block_size) @ W1 + b1  # Pre-activation
h = torch.tanh(h_preact)                                   # Post-activation

# Plot the distribution
plt.hist(h.view(-1).data, bins=50, density=True)
plt.title("Tanh activation distribution")
\`\`\`

### The Saturation Problem

If the pre-activation values are too large (e.g., +-10), then tanh outputs are pushed to exactly -1 or +1. These are the **flat regions** of tanh where the gradient is nearly zero:

\`\`\`
tanh(10) = 0.99999999...  -> gradient ≈ 0
tanh(-10) = -0.99999999... -> gradient ≈ 0
\`\`\`

When a neuron is saturated, it receives essentially zero gradient during backpropagation. It becomes a **dead neuron** — it cannot learn.

\`\`\`python
# Check for saturation
saturated = (h.abs() > 0.99).float().mean()
print(f"Fraction of saturated activations: {saturated:.2%}")
# If this is > 10%, you have a problem
\`\`\`

### Visualizing Per-Neuron Statistics

\`\`\`python
# Mean activation per neuron
plt.figure(figsize=(20, 4))
plt.subplot(1, 2, 1)
plt.bar(range(n_hidden), h.mean(dim=0).data)
plt.title("Mean activation per neuron")

# Saturation per neuron
plt.subplot(1, 2, 2)
plt.bar(range(n_hidden), (h.abs() > 0.99).float().mean(dim=0).data)
plt.title("Fraction saturated per neuron")
\`\`\`

A healthy network should have:
- Mean activations near 0 (balanced positive and negative)
- Very few saturated activations (< 5%)
- Gradients that are neither vanishing nor exploding

### The Gradient Distribution

Just as important as activation statistics:

\`\`\`python
# After backward pass, check gradient magnitudes
for name, p in zip(['C', 'W1', 'b1', 'W2', 'b2'], parameters):
    print(f"{name}: mean={p.grad.mean():.6f}, std={p.grad.std():.6f}")
\`\`\`

If gradients are extremely small (1e-10) for early layers, you have **vanishing gradients**. If they are extremely large, you have **exploding gradients**.

### The Root Cause: Bad Initialization

Most activation problems trace back to **initialization**. If weights are initialized too large, pre-activations will be large, causing saturation. If too small, the signal dies out through layers.

\`\`\`python
# BAD: weights too large
W1 = torch.randn((30, 200)) * 1.0  # Pre-activations ~ N(0, 30), almost all saturated

# BAD: weights too small
W1 = torch.randn((30, 200)) * 0.001  # Pre-activations ~ N(0, 0.03), all near zero

# BETTER: scaled appropriately
W1 = torch.randn((30, 200)) * 0.2  # Pre-activations ~ N(0, 1.2), some saturation
\`\`\`

### Diagnostic Checklist

When training seems stuck or slow:

1. Plot activation distributions — are neurons saturated?
2. Plot gradient distributions — are gradients vanishing or exploding?
3. Check the loss curve — is it decreasing at all?
4. Compare train vs. val loss — is the model learning anything general?

### Key Takeaway

Looking at activation and gradient statistics is like taking a medical scan of your neural network. It reveals problems that the loss curve alone cannot show. The two most common issues are saturation (from bad initialization) and vanishing gradients (from too many layers without proper normalization). Both are fixable, as we will see in the next lessons.`,
    },
    {
      id: "nn-batchnorm-batch-norm",
      slug: "batch-normalization",
      title: "Batch Normalization",
      content: `## Batch Normalization

Batch normalization (BatchNorm), introduced by Ioffe and Szegedy in 2015, is one of the most important innovations in deep learning. It normalizes activations within each mini-batch, dramatically stabilizing and accelerating training.

### The Core Idea

Before each activation function, normalize the pre-activations to have zero mean and unit variance across the mini-batch:

\`\`\`
h_preact_normalized = (h_preact - mean) / sqrt(variance + epsilon)
\`\`\`

Then apply learnable scale (gamma) and shift (beta) parameters:

\`\`\`
h_bn = gamma * h_preact_normalized + beta
\`\`\`

### Implementation

\`\`\`python
# During training
bn_mean = h_preact.mean(dim=0, keepdim=True)         # (1, n_hidden)
bn_var = h_preact.var(dim=0, keepdim=True)             # (1, n_hidden)
h_preact_norm = (h_preact - bn_mean) / torch.sqrt(bn_var + 1e-5)
h_bn = bn_gain * h_preact_norm + bn_bias               # Learnable params
h = torch.tanh(h_bn)
\`\`\`

Where:
- \`bn_gain\` (gamma) is initialized to 1.0, shape \`(1, n_hidden)\`
- \`bn_bias\` (beta) is initialized to 0.0, shape \`(1, n_hidden)\`
- \`1e-5\` is epsilon, preventing division by zero

### Why It Works

1. **Prevents internal covariate shift** — each layer receives inputs with a consistent distribution, regardless of how earlier layers change during training
2. **Enables higher learning rates** — the normalization stabilizes gradients, so you can take bigger steps
3. **Reduces sensitivity to initialization** — even poorly initialized weights produce reasonable pre-activations after normalization
4. **Acts as a regularizer** — the mini-batch statistics introduce noise, similar to dropout

### Training vs. Inference Mode

During training, we compute mean and variance from the current mini-batch. During inference, we use a **running average** computed during training:

\`\`\`python
# Initialize running statistics
bn_mean_running = torch.zeros((1, n_hidden))
bn_var_running = torch.ones((1, n_hidden))
momentum = 0.001

# During training, update running stats
with torch.no_grad():
    bn_mean_running = (1 - momentum) * bn_mean_running + momentum * bn_mean
    bn_var_running = (1 - momentum) * bn_var_running + momentum * bn_var

# During inference, use running stats
h_preact_norm = (h_preact - bn_mean_running) / torch.sqrt(bn_var_running + 1e-5)
\`\`\`

This is critical: you cannot use batch statistics during inference because (a) you might have a batch size of 1, and (b) predictions should be deterministic.

### Effect on Activation Distribution

Before BatchNorm:
\`\`\`
Pre-activations: mean=2.3, std=8.7  -> 85% of tanh activations saturated
\`\`\`

After BatchNorm:
\`\`\`
Pre-activations: mean≈0, std≈1 -> ~5% of tanh activations saturated
\`\`\`

### When to Apply BatchNorm

The standard placement is **after the linear layer, before the activation**:

\`\`\`
Linear -> BatchNorm -> Activation (tanh/ReLU)
\`\`\`

Note: when using BatchNorm, the bias in the linear layer is redundant (BatchNorm's beta serves the same purpose), so you can remove it:

\`\`\`python
# No bias needed in linear layer when followed by BatchNorm
h_preact = emb.view(-1, n_embd * block_size) @ W1  # No + b1
h_bn = bn_gain * ((h_preact - bn_mean) / torch.sqrt(bn_var + 1e-5)) + bn_bias
h = torch.tanh(h_bn)
\`\`\`

### Limitations of BatchNorm

- Behaves differently during training and inference (a common source of bugs)
- Does not work well with very small batch sizes (unstable statistics)
- Introduces coupling between examples in a batch
- Being gradually replaced by Layer Normalization in transformers

### Key Takeaway

Batch normalization normalizes pre-activations to prevent saturation, enabling faster and more stable training. It requires tracking running statistics for inference mode. Despite its quirks, it was a breakthrough that made training deeper networks practical.`,
      starterCode: `import torch
import torch.nn.functional as F

# Assume training data Xtr, Ytr and parameters are set up
# Add batch normalization to the forward pass

vocab_size = 27
block_size = 3
n_embd = 10
n_hidden = 200

# Parameters (no bias in linear layer — BatchNorm replaces it)
C = torch.randn((vocab_size, n_embd))
W1 = torch.randn((n_embd * block_size, n_hidden)) * 0.2
W2 = torch.randn((n_hidden, vocab_size)) * 0.1
b2 = torch.randn(vocab_size) * 0.01

# BatchNorm parameters
bn_gain = torch.ones((1, n_hidden))
bn_bias = torch.zeros((1, n_hidden))

# Running statistics for inference
bn_mean_running = torch.zeros((1, n_hidden))
bn_var_running = torch.ones((1, n_hidden))

parameters = [C, W1, W2, b2, bn_gain, bn_bias]
for p in parameters:
    p.requires_grad = True

# TODO: Implement forward pass with batch normalization
# TODO: Update running statistics with momentum=0.001
# TODO: Implement inference mode using running statistics
`,
      solutionCode: `import torch
import torch.nn.functional as F

vocab_size = 27
block_size = 3
n_embd = 10
n_hidden = 200
batch_size = 32

C = torch.randn((vocab_size, n_embd))
W1 = torch.randn((n_embd * block_size, n_hidden)) * (5/3) / (n_embd * block_size)**0.5
W2 = torch.randn((n_hidden, vocab_size)) * 0.01
b2 = torch.randn(vocab_size) * 0

bn_gain = torch.ones((1, n_hidden))
bn_bias = torch.zeros((1, n_hidden))
bn_mean_running = torch.zeros((1, n_hidden))
bn_var_running = torch.ones((1, n_hidden))

parameters = [C, W1, W2, b2, bn_gain, bn_bias]
for p in parameters:
    p.requires_grad = True

momentum = 0.001

# Training step (called inside loop)
def train_step(Xb, Yb):
    emb = C[Xb]
    h_preact = emb.view(-1, n_embd * block_size) @ W1

    # Batch normalization (training mode)
    bn_mean = h_preact.mean(dim=0, keepdim=True)
    bn_var = h_preact.var(dim=0, keepdim=True)
    h_preact_norm = (h_preact - bn_mean) / torch.sqrt(bn_var + 1e-5)
    h_bn = bn_gain * h_preact_norm + bn_bias

    # Update running stats
    with torch.no_grad():
        bn_mean_running.copy_((1 - momentum) * bn_mean_running + momentum * bn_mean)
        bn_var_running.copy_((1 - momentum) * bn_var_running + momentum * bn_var)

    h = torch.tanh(h_bn)
    logits = h @ W2 + b2
    loss = F.cross_entropy(logits, Yb)
    return loss

# Inference step
@torch.no_grad()
def inference(X):
    emb = C[X]
    h_preact = emb.view(-1, n_embd * block_size) @ W1
    h_preact_norm = (h_preact - bn_mean_running) / torch.sqrt(bn_var_running + 1e-5)
    h_bn = bn_gain * h_preact_norm + bn_bias
    h = torch.tanh(h_bn)
    logits = h @ W2 + b2
    return logits

print("BatchNorm implementation complete")
print(f"Total parameters: {sum(p.nelement() for p in parameters)}")
`,
    },
    {
      id: "nn-batchnorm-residual",
      slug: "residual-connections",
      title: "Residual Connections",
      content: `## Residual Connections

Residual connections (skip connections) were introduced in the ResNet paper (He et al., 2015). They are one of the key architectural innovations that enabled training very deep networks, and they appear in every modern transformer.

### The Vanishing Gradient Problem

In deep networks, gradients must flow backward through many layers. Each layer applies its own transformation to the gradient. After many layers, the gradient can become vanishingly small:

\`\`\`
Layer 10 gradient = g * W10 * W9 * W8 * ... * W1
\`\`\`

If each weight matrix shrinks the gradient slightly (eigenvalues < 1), the product quickly approaches zero. The early layers learn extremely slowly — or not at all.

### The Residual Solution

Instead of learning \`H(x)\` directly, learn the **residual** \`F(x) = H(x) - x\`:

\`\`\`
output = x + F(x)
\`\`\`

This is called a **skip connection** or **residual connection**. The input \`x\` bypasses the layer and is added directly to the output.

\`\`\`python
# Without residual connection
h = tanh(h @ W + b)

# With residual connection
h = h + tanh(h @ W + b)
\`\`\`

### Why Residuals Fix Gradient Flow

During backpropagation, the gradient through a residual block is:

\`\`\`
d(output)/d(x) = 1 + dF/dx
\`\`\`

The \`+1\` is the gradient flowing directly through the skip connection. Even if \`dF/dx\` is small, the gradient is at least 1. This creates a **gradient highway** that allows gradients to flow unimpeded from the loss all the way back to the first layer.

### Implementation Pattern

\`\`\`python
class ResidualBlock:
    def __init__(self, n):
        self.W = torch.randn(n, n) * 0.1
        self.b = torch.zeros(n)
        self.bn_gain = torch.ones(1, n)
        self.bn_bias = torch.zeros(1, n)

    def forward(self, x):
        # The residual branch
        h = x @ self.W + self.b
        # BatchNorm
        h = self.bn_gain * (h - h.mean(0)) / (h.std(0) + 1e-5) + self.bn_bias
        # Activation
        h = torch.tanh(h)
        # Add residual
        return x + h
\`\`\`

**Important:** for the addition to work, the input and output must have the same dimension. This is why residual blocks typically do not change the hidden size.

### Stacking Residual Blocks

\`\`\`python
# A deep residual network
blocks = [ResidualBlock(n_hidden) for _ in range(10)]

def forward(x):
    for block in blocks:
        x = block.forward(x)
    return x
\`\`\`

Without residual connections, training 10+ layers is very difficult. With them, you can train 100+ layers.

### Residuals in Transformers

Every transformer block uses residual connections:

\`\`\`
x = x + Attention(LayerNorm(x))
x = x + FeedForward(LayerNorm(x))
\`\`\`

The input to each sub-layer is added back to its output. This is why transformers can be stacked so deep (GPT-3 has 96 layers).

### Pre-Norm vs. Post-Norm

Two common placements:

\`\`\`python
# Post-norm (original transformer)
x = LayerNorm(x + Sublayer(x))

# Pre-norm (more stable, used in GPT)
x = x + Sublayer(LayerNorm(x))
\`\`\`

Pre-norm is generally more stable and is the default in modern architectures.

### Key Takeaway

Residual connections create a gradient highway through deep networks, solving the vanishing gradient problem. Combined with normalization, they enable training networks with hundreds of layers. Every modern architecture — ResNet, Transformer, GPT — relies on residual connections.`,
    },
    {
      id: "nn-batchnorm-kaiming-init",
      slug: "kaiming-initialization",
      title: "Kaiming Initialization",
      content: `## Kaiming Initialization

Proper weight initialization is crucial. Too large, and activations saturate. Too small, and the signal dies. Kaiming initialization (He et al., 2015) provides a principled formula for setting initial weight scales.

### The Problem

Consider a single layer: \`y = W @ x\`. If \`x\` has variance 1 and \`W\` has variance \`sigma^2\`, then each element of \`y\` is a sum of \`n\` terms (where \`n\` is the input dimension), so:

\`\`\`
Var(y) = n * sigma^2 * Var(x)
\`\`\`

If \`sigma = 1\`, then \`Var(y) = n * Var(x)\`. After 10 layers with \`n = 1000\`, the variance is \`1000^10\` — the activations explode.

### The Solution: Scale by \`1/sqrt(n)\`

Set \`sigma = 1/sqrt(n)\` so that \`Var(y) = Var(x)\`:

\`\`\`python
# Xavier/Glorot initialization (for tanh/sigmoid)
W = torch.randn(fan_in, fan_out) * (1.0 / fan_in**0.5)

# Kaiming initialization (for ReLU)
W = torch.randn(fan_in, fan_out) * (2.0 / fan_in)**0.5
\`\`\`

The factor of 2 in Kaiming accounts for the fact that ReLU zeros out half the activations (so the effective variance is halved).

### Gain Factors for Different Activations

Each activation function has a **gain factor** that accounts for how it transforms the variance:

| Activation | Gain | Initialization Scale |
|-----------|------|---------------------|
| Linear | 1.0 | \`1/sqrt(fan_in)\` |
| Tanh | 5/3 | \`(5/3)/sqrt(fan_in)\` |
| ReLU | sqrt(2) | \`sqrt(2/fan_in)\` |
| Sigmoid | 1.0 | \`1/sqrt(fan_in)\` |

\`\`\`python
# For our tanh network:
gain = 5.0 / 3.0
W1 = torch.randn(fan_in, n_hidden) * gain / fan_in**0.5
\`\`\`

### Verifying the Initialization

After initializing, check that activations maintain unit variance through layers:

\`\`\`python
x = torch.randn(1000, fan_in)  # Random input with unit variance

# Forward through layer
h_preact = x @ W1
print(f"Pre-activation std: {h_preact.std():.4f}")  # Should be ~1.0

h = torch.tanh(h_preact)
print(f"Post-activation std: {h.std():.4f}")  # Should be ~0.65 for tanh
\`\`\`

If the standard deviation is much larger than 1, weights are too large. If much smaller, weights are too small.

### Deep Network Initialization Check

\`\`\`python
# Initialize a 5-layer network and check signal propagation
dims = [30, 200, 200, 200, 200, 27]
layers = []
for i in range(len(dims) - 1):
    gain = 5/3 if i < len(dims) - 2 else 1.0  # No gain for output layer
    W = torch.randn(dims[i], dims[i+1]) * gain / dims[i]**0.5
    layers.append(W)

# Check activation std at each layer
x = torch.randn(1000, 30)
for i, W in enumerate(layers):
    x = x @ W
    if i < len(layers) - 1:
        x = torch.tanh(x)
    print(f"Layer {i}: std = {x.std():.4f}")
\`\`\`

With proper initialization, the standard deviation should stay roughly constant across layers. Without it, it either explodes or vanishes.

### BatchNorm Reduces Initialization Sensitivity

With batch normalization, initialization matters less because the normalization corrects the distribution at each layer. However, good initialization still helps:
- Faster early training (first few steps are not wasted correcting bad activations)
- More stable gradient flow before running averages converge

### PyTorch Built-in Initialization

\`\`\`python
import torch.nn as nn

# PyTorch handles this automatically for nn.Linear:
layer = nn.Linear(30, 200)
# Default: Kaiming uniform initialization

# Or manually:
nn.init.kaiming_normal_(layer.weight, nonlinearity='relu')
nn.init.kaiming_normal_(layer.weight, nonlinearity='tanh')
\`\`\`

### Key Takeaway

Kaiming initialization scales weights by \`1/sqrt(fan_in)\` with a gain factor for the activation function. This keeps the variance of activations stable across layers, preventing both vanishing and exploding signals. Combined with batch normalization, it enables reliable training of deep networks.`,
    },
    {
      id: "nn-batchnorm-diagnostics",
      slug: "diagnostic-tools",
      title: "Diagnostic Tools",
      content: `## Diagnostic Tools

Training a neural network without diagnostics is like driving blindfolded. This lesson covers the visualization and analysis tools that help you understand what your network is doing.

### Activation Histograms

Plot the distribution of activations at each layer during a forward pass:

\`\`\`python
def plot_activation_histograms(model, X_sample):
    """Visualize activation distributions through the network."""
    activations = {}

    # Forward pass, storing activations
    emb = model.C[X_sample]
    x = emb.view(-1, model.n_embd * model.block_size)

    for i, (W, b, gain, bias) in enumerate(zip(model.weights, model.biases,
                                                  model.bn_gains, model.bn_biases)):
        x = x @ W
        # BatchNorm
        x = gain * (x - x.mean(0)) / (x.std(0) + 1e-5) + bias
        x = torch.tanh(x)
        activations[f'Layer {i}'] = x.detach()

    fig, axes = plt.subplots(1, len(activations), figsize=(20, 4))
    for ax, (name, act) in zip(axes, activations.items()):
        ax.hist(act.view(-1).numpy(), bins=50, density=True)
        ax.set_title(f"{name}\\nmean={act.mean():.3f}, std={act.std():.3f}")
        sat = (act.abs() > 0.97).float().mean()
        ax.set_xlabel(f"Saturated: {sat:.1%}")
\`\`\`

**Healthy pattern:** Bell-shaped distribution centered near 0, with few values at the extremes (-1 or +1).

**Unhealthy patterns:**
- Bimodal at -1 and +1: severe saturation
- Concentrated near 0: dead neurons (signal is too weak)
- Asymmetric: biased activations (bad bias initialization)

### Gradient Flow Visualization

Track the ratio of gradient magnitude to parameter magnitude at each layer:

\`\`\`python
def plot_gradient_flow(parameters, names):
    """Visualize gradient magnitudes relative to parameters."""
    ratios = []
    for p, name in zip(parameters, names):
        if p.grad is not None:
            ratio = p.grad.std() / p.data.std()
            ratios.append((name, ratio.item()))
            print(f"{name:10s} | grad:data ratio = {ratio:.6f}")

    # The ratio should be roughly similar across layers
    # A ratio of ~1e-3 is typical for a healthy network
\`\`\`

If the ratio is much smaller for early layers than late layers, gradients are vanishing. If it is much larger, gradients are exploding.

### Learning Rate Sensitivity Analysis

\`\`\`python
def lr_finder(model, X, Y, lr_min=1e-5, lr_max=1.0, steps=200):
    """Find the optimal learning rate by sweeping."""
    lrs = torch.logspace(
        torch.tensor(lr_min).log10(),
        torch.tensor(lr_max).log10(),
        steps
    )
    losses = []

    # Save initial parameters
    initial_params = [p.data.clone() for p in model.parameters()]

    for lr in lrs:
        # Forward
        logits = model(X)
        loss = F.cross_entropy(logits, Y)
        losses.append(loss.item())

        # Backward
        model.zero_grad()
        loss.backward()

        # Update
        for p in model.parameters():
            p.data -= lr * p.grad

    # Restore parameters
    for p, init in zip(model.parameters(), initial_params):
        p.data = init

    plt.plot(lrs.numpy(), losses)
    plt.xscale('log')
    plt.xlabel('Learning Rate')
    plt.ylabel('Loss')
    plt.title('LR Finder')
\`\`\`

The best learning rate is where the loss is decreasing most steeply — typically one order of magnitude before the minimum.

### Update-to-Data Ratio

Karpathy recommends tracking the ratio of parameter updates to parameter values:

\`\`\`python
# After each update step:
for p, name in zip(parameters, names):
    update = -lr * p.grad
    ratio = update.std() / p.data.std()
    # Ideal ratio: ~1e-3
    # Too high (>1e-1): learning rate too large
    # Too low (<1e-5): learning rate too small
\`\`\`

This ratio should be roughly 1e-3 (0.1%). If it is much higher, the learning rate is too large and training will be unstable. If much lower, the learning rate is too small and training will be unnecessarily slow.

### Loss Curve Analysis

\`\`\`python
# Plot training dynamics
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# 1. Raw loss
axes[0].plot(train_losses)
axes[0].set_title("Training Loss")

# 2. Log loss (shows exponential phases)
axes[1].plot(torch.tensor(train_losses).log())
axes[1].set_title("Log Training Loss")

# 3. Train vs Val
axes[2].plot(train_losses, label='train')
axes[2].plot(val_losses, label='val')
axes[2].legend()
axes[2].set_title("Train vs Validation")
\`\`\`

### Dead Neuron Detection

\`\`\`python
def detect_dead_neurons(activations, threshold=0.01):
    """Find neurons that rarely activate."""
    active_fraction = (activations.abs() > threshold).float().mean(dim=0)
    dead = (active_fraction < 0.05).sum()
    print(f"Dead neurons: {dead}/{activations.shape[1]}")
    return active_fraction
\`\`\`

Dead neurons (always outputting the same value) waste capacity. Common causes: too-large initial weights, too-high learning rate, or no batch normalization.

### Key Takeaway

Diagnostic tools transform neural network training from guesswork into engineering. The most important tools are: activation histograms (detect saturation), gradient flow plots (detect vanishing/exploding gradients), the update-to-data ratio (calibrate learning rate), and train vs. validation curves (detect overfitting). Build the habit of checking these early in any new project.`,
    },
  ],
};
