import { Module } from "../types";

export const backpropManualModule: Module = {
  id: "nn-manual-backprop",
  title: "Manual Backpropagation",
  description: "Derive and implement gradients by hand for every operation in the MLP. Based on Karpathy's 'Building makemore Part 4: Becoming a Backprop Ninja' (https://www.youtube.com/watch?v=q8SA3rM6ckI).",
  lessons: [
    {
      id: "nn-manual-backprop-why",
      slug: "why-manual-backprop",
      title: "Why Manual Backprop?",
      content: `## Why Manual Backprop?

> **Lecture Resource:** [Building makemore Part 4: Becoming a Backprop Ninja](https://www.youtube.com/watch?v=q8SA3rM6ckI) by Andrej Karpathy

PyTorch computes gradients automatically with \`loss.backward()\`. So why would you ever compute them by hand? Because understanding the gradient flow is the difference between being a deep learning **user** and a deep learning **engineer**.

### The Practical Benefits

1. **Debugging** — When training goes wrong (NaN loss, diverging gradients), you need to understand where gradients come from to diagnose the issue
2. **Custom operations** — Sometimes you need a custom backward pass (e.g., for efficiency or for operations PyTorch does not support)
3. **Architecture intuition** — Knowing how gradients flow tells you which parts of the network learn fast vs. slow
4. **Interview preparation** — Top AI companies expect you to derive gradients on a whiteboard

### What We Will Derive

We will manually compute the backward pass for our entire MLP:

\`\`\`
Forward:
emb = C[X]                                    # Embedding lookup
h_preact = emb.view(-1, 30) @ W1 + b1         # Linear layer
h_bn = bn_gain * (h_preact - mean) / std + bn_bias  # BatchNorm
h = tanh(h_bn)                                # Activation
logits = h @ W2 + b2                           # Output layer
loss = cross_entropy(logits, Y)               # Loss
\`\`\`

For each operation, we need to derive: how does changing each input affect the loss?

### The Strategy

We work backward, one operation at a time:

1. Start with \`dloss/dlogits\` (gradient of loss with respect to logits)
2. Use that to compute \`dloss/dh\`, \`dloss/dW2\`, \`dloss/db2\`
3. Use \`dloss/dh\` to compute \`dloss/dh_bn\`
4. Use \`dloss/dh_bn\` to compute \`dloss/dh_preact\`, \`dloss/dbn_gain\`, \`dloss/dbn_bias\`
5. Continue until we reach \`dloss/dC\`, \`dloss/dW1\`, \`dloss/db1\`

### Verification: The Most Important Step

For every gradient we derive, we compare it against PyTorch's autograd:

\`\`\`python
# Our manual gradient
dW2_manual = h.T @ dlogits

# PyTorch's gradient
loss.backward()
dW2_auto = W2.grad

# Compare
diff = (dW2_manual - dW2_auto).abs().max()
print(f"Max difference: {diff:.10f}")  # Should be < 1e-5
\`\`\`

If the difference is tiny (< 1e-5), our derivation is correct. If it is large, we made a mistake.

### Tensor Shape Discipline

The key to getting manual backprop right is **shape matching**. For every gradient:

\`\`\`
shape(dL/dX) == shape(X)
\`\`\`

The gradient of the loss with respect to any tensor must have the same shape as that tensor. If \`W2\` has shape \`(200, 27)\`, then \`dL/dW2\` must also have shape \`(200, 27)\`. This constraint helps you figure out whether to transpose, sum, or reshape.

### The Plan

In the following lessons, we derive gradients for:
1. **Linear layers** — matrix multiplication and bias addition
2. **Batch normalization** — the hardest part
3. **Cross-entropy and softmax** — numerical stability tricks
4. **The full backward pass** — putting it all together

### Key Takeaway

Manual backpropagation is an exercise in applied calculus. It builds the deep, intuitive understanding that separates engineers who can design new architectures from those who can only use existing ones. The pattern is always the same: apply the chain rule, match tensor shapes, verify against autograd.`,
    },
    {
      id: "nn-manual-backprop-linear",
      slug: "gradients-through-linear-layers",
      title: "Gradients Through Linear Layers",
      content: `## Gradients Through Linear Layers

The linear layer \`y = x @ W + b\` is the most common operation in neural networks. Let us derive its backward pass.

### Setup

\`\`\`python
# Forward pass
# x: (N, D_in)   — N examples, D_in features
# W: (D_in, D_out) — weight matrix
# b: (D_out,)    — bias vector
# y: (N, D_out)  — output

y = x @ W + b
\`\`\`

We are given \`dL/dy\` (the gradient flowing back from downstream). We need to compute \`dL/dx\`, \`dL/dW\`, and \`dL/db\`.

### Gradient of the Bias: \`dL/db\`

The bias is added to every row of the output. Its gradient is the sum of incoming gradients across the batch:

\`\`\`python
# y[i, j] = (x @ W)[i, j] + b[j]
# dy/db[j] = 1 for all i
# dL/db[j] = sum over i of dL/dy[i, j]

db = dlogits.sum(dim=0)  # Sum across batch dimension
# Shape: (D_out,) ✓
\`\`\`

### Gradient of the Weights: \`dL/dW\`

Using the chain rule for matrix multiplication:

\`\`\`python
# y = x @ W
# dL/dW = x.T @ dL/dy

dW = x.T @ dlogits
# Shape: (D_in, D_out) ✓
\`\`\`

**Intuition:** \`dW[i, j]\` tells us how the loss changes when we change \`W[i, j]\`. It is the dot product of the i-th input feature across all examples with the j-th output gradient across all examples.

### Gradient of the Input: \`dL/dx\`

\`\`\`python
# y = x @ W
# dL/dx = dL/dy @ W.T

dx = dlogits @ W.T
# Shape: (N, D_in) ✓
\`\`\`

### Shape-Based Reasoning

When you forget the formula, use shapes to reconstruct it:

\`\`\`
dL/dW must have shape (D_in, D_out)
We have: x with shape (N, D_in) and dL/dy with shape (N, D_out)
The only way to get (D_in, D_out) from these: x.T @ dL/dy
    (D_in, N) @ (N, D_out) = (D_in, D_out) ✓
\`\`\`

This shape-matching trick works for almost any gradient derivation.

### Full Example

\`\`\`python
# Forward
h = emb.view(-1, 30)  # (N, 30) — flattened embeddings
logits = h @ W2 + b2   # (N, 27)
loss = F.cross_entropy(logits, Y)

# Backward (given dlogits = dL/dlogits)
# Step 1: Gradient of loss w.r.t. logits
# (We'll derive this in the cross-entropy lesson)
dlogits = probs.clone()
dlogits[range(N), Y] -= 1
dlogits /= N

# Step 2: Gradient w.r.t. W2, b2, h
dW2 = h.T @ dlogits        # (200, 27)
db2 = dlogits.sum(0)        # (27,)
dh = dlogits @ W2.T         # (N, 200)

# Verify shapes
assert dW2.shape == W2.shape
assert db2.shape == b2.shape
assert dh.shape == h.shape
\`\`\`

### The Jacobian Perspective

Formally, the Jacobian of \`y = x @ W\` with respect to \`x\` is a 4-dimensional tensor. But we never need to construct it explicitly. The chain rule with matrix multiplication handles everything:

\`\`\`
dL/dx = dL/dy @ (dy/dx)
\`\`\`

Because the operation is linear, the "Jacobian-vector product" simplifies to simple matrix multiplication — which is why backprop through linear layers is so clean.

### Multiple Linear Layers

For a sequence of linear layers, gradients chain naturally:

\`\`\`python
# Forward: x -> h1 -> h2 -> logits
h1 = x @ W1 + b1
h2 = h1 @ W2 + b2
logits = h2 @ W3 + b3

# Backward:
dlogits = ...              # Given
dW3 = h2.T @ dlogits
db3 = dlogits.sum(0)
dh2 = dlogits @ W3.T

dW2 = h1.T @ dh2
db2 = dh2.sum(0)
dh1 = dh2 @ W2.T

dW1 = x.T @ dh1
db1 = dh1.sum(0)
dx = dh1 @ W1.T
\`\`\`

### Key Takeaway

Gradients through linear layers follow three simple rules: (1) weight gradient = input transposed times output gradient, (2) bias gradient = sum of output gradients, (3) input gradient = output gradient times weight transposed. These three formulas account for the majority of gradient computation in any neural network.`,
      starterCode: `import torch

# Setup
N = 32      # Batch size
D_in = 30   # Input features
D_out = 27  # Output features

x = torch.randn(N, D_in, requires_grad=True)
W = torch.randn(D_in, D_out, requires_grad=True)
b = torch.randn(D_out, requires_grad=True)

# Forward pass
y = x @ W + b

# Simulate upstream gradient
dy = torch.randn_like(y)

# TODO: Manually compute gradients
# dx_manual = ?
# dW_manual = ?
# db_manual = ?

# Verify against autograd
y.backward(dy)
print(f"dx matches: {torch.allclose(dx_manual, x.grad, atol=1e-5)}")
print(f"dW matches: {torch.allclose(dW_manual, W.grad, atol=1e-5)}")
print(f"db matches: {torch.allclose(db_manual, b.grad, atol=1e-5)}")
`,
      solutionCode: `import torch

N = 32
D_in = 30
D_out = 27

x = torch.randn(N, D_in, requires_grad=True)
W = torch.randn(D_in, D_out, requires_grad=True)
b = torch.randn(D_out, requires_grad=True)

# Forward pass
y = x @ W + b

# Simulate upstream gradient
dy = torch.randn_like(y)

# Manual gradients
dx_manual = dy @ W.T.detach()       # (N, D_in)
dW_manual = x.T.detach() @ dy       # (D_in, D_out)
db_manual = dy.sum(0)                # (D_out,)

# Verify against autograd
y.backward(dy)
print(f"dx matches: {torch.allclose(dx_manual, x.grad, atol=1e-5)}")
print(f"dW matches: {torch.allclose(dW_manual, W.grad, atol=1e-5)}")
print(f"db matches: {torch.allclose(db_manual, b.grad, atol=1e-5)}")
`,
    },
    {
      id: "nn-manual-backprop-batchnorm",
      slug: "gradients-through-batch-norm",
      title: "Gradients Through Batch Norm",
      content: `## Gradients Through Batch Normalization

Batch normalization is the hardest layer to backpropagate through manually. It involves normalization with respect to batch statistics, which creates dependencies between all examples in a batch.

### The Forward Pass (Expanded)

Let us write batch normalization step by step:

\`\`\`python
# Input: h_preact of shape (N, D)
# Step 1: Compute batch mean
mean = h_preact.mean(dim=0)                  # (D,)

# Step 2: Center the data
diff = h_preact - mean                       # (N, D)

# Step 3: Compute batch variance
var = (diff**2).mean(dim=0)                  # (D,)

# Step 4: Compute inverse standard deviation
inv_std = (var + 1e-5)**(-0.5)              # (D,)

# Step 5: Normalize
h_norm = diff * inv_std                      # (N, D)

# Step 6: Scale and shift
h_bn = bn_gain * h_norm + bn_bias           # (N, D)
\`\`\`

### Backward Pass: Step by Step

Given \`dh_bn\` (the gradient from downstream), we work backward through each step.

**Step 6 backward:** \`h_bn = bn_gain * h_norm + bn_bias\`

\`\`\`python
dbn_gain = (dh_bn * h_norm).sum(dim=0, keepdim=True)  # (1, D)
dbn_bias = dh_bn.sum(dim=0, keepdim=True)              # (1, D)
dh_norm = dh_bn * bn_gain                               # (N, D)
\`\`\`

**Step 5 backward:** \`h_norm = diff * inv_std\`

\`\`\`python
ddiff_1 = dh_norm * inv_std                              # (N, D)
dinv_std = (dh_norm * diff).sum(dim=0)                   # (D,)
\`\`\`

**Step 4 backward:** \`inv_std = (var + eps)^(-0.5)\`

\`\`\`python
# d/dx of x^(-0.5) = -0.5 * x^(-1.5)
dvar = -0.5 * (var + 1e-5)**(-1.5) * dinv_std           # (D,)
\`\`\`

**Step 3 backward:** \`var = mean(diff^2)\`

\`\`\`python
ddiff_2 = (2.0 * diff) * (dvar / N)                     # (N, D)
\`\`\`

**Step 2 backward:** \`diff = h_preact - mean\`, accumulate from steps 3 and 5

\`\`\`python
ddiff = ddiff_1 + ddiff_2                                # (N, D)
dh_preact_1 = ddiff                                       # (N, D)
dmean = -ddiff.sum(dim=0)                                 # (D,)
\`\`\`

**Step 1 backward:** \`mean = h_preact.mean(dim=0)\`

\`\`\`python
dh_preact_2 = dmean / N                                  # Broadcast to (N, D)
\`\`\`

**Combine:**

\`\`\`python
dh_preact = dh_preact_1 + dh_preact_2                    # (N, D)
\`\`\`

### The Compact Form

All of the above simplifies to a single elegant expression:

\`\`\`python
dh_preact = (1.0 / N) * inv_std * (
    N * dh_norm
    - dh_norm.sum(dim=0)
    - h_norm * (dh_norm * h_norm).sum(dim=0)
)
\`\`\`

This compact form is what production code uses. It avoids storing all intermediate variables.

### Why This Is Hard

The difficulty comes from the fact that batch normalization creates **dependencies between examples**. When you change one element of \`h_preact\`, it changes the mean and variance, which affects the normalization of **every other example** in the batch. This is why the gradient involves sums over the batch dimension.

### Verification

\`\`\`python
# Compare manual gradient to PyTorch
print(f"dh_preact correct: {torch.allclose(dh_preact, h_preact.grad, atol=1e-5)}")
print(f"dbn_gain correct: {torch.allclose(dbn_gain, bn_gain.grad, atol=1e-5)}")
print(f"dbn_bias correct: {torch.allclose(dbn_bias, bn_bias.grad, atol=1e-5)}")
\`\`\`

### Key Takeaway

Batch normalization backpropagation is the hardest manual gradient derivation in standard deep learning. The key insight is that changing one input affects all outputs through the shared mean and variance. Working through this derivation step by step — and verifying each step against autograd — is the best way to truly understand backpropagation.`,
    },
    {
      id: "nn-manual-backprop-crossentropy",
      slug: "gradients-through-cross-entropy",
      title: "Gradients Through Cross-Entropy & Softmax",
      content: `## Gradients Through Cross-Entropy & Softmax

The loss computation involves two steps: softmax (converting logits to probabilities) and cross-entropy (measuring prediction error). Together, they produce a beautifully simple gradient.

### The Forward Pass

\`\`\`python
# Step 1: Softmax
logit_maxes = logits.max(dim=1, keepdim=True).values  # Numerical stability
norm_logits = logits - logit_maxes                      # Subtract max
counts = norm_logits.exp()                              # Exponentiate
counts_sum = counts.sum(dim=1, keepdim=True)            # Sum
probs = counts / counts_sum                             # Normalize

# Step 2: Cross-entropy
logprobs = probs.log()                                  # Log probabilities
loss = -logprobs[range(N), Y].mean()                   # NLL of correct class
\`\`\`

### Why Subtract the Max?

Softmax involves \`exp(x)\`, which overflows for large \`x\`. Subtracting the maximum value makes the largest exponent 0, preventing overflow:

\`\`\`
softmax(x) = exp(x - max(x)) / sum(exp(x - max(x)))
\`\`\`

This is mathematically identical but numerically stable.

### Backward Through Cross-Entropy + Softmax

The gradient of cross-entropy loss with respect to logits has a remarkably simple form:

\`\`\`python
dlogits = probs.clone()
dlogits[range(N), Y] -= 1
dlogits /= N
\`\`\`

That is it. The gradient is simply **probabilities minus one-hot targets**, divided by the batch size.

### Deriving This Result

Let us work through it. For a single example, the loss is:

\`\`\`
L = -log(softmax(z)_y) = -z_y + log(sum(exp(z_j)))
\`\`\`

Taking the derivative with respect to logit \`z_i\`:

\`\`\`
If i != y:  dL/dz_i = exp(z_i) / sum(exp(z_j)) = softmax(z)_i = p_i
If i == y:  dL/dz_i = -1 + exp(z_y) / sum(exp(z_j)) = p_y - 1
\`\`\`

Combining both cases: \`dL/dz_i = p_i - 1{i=y}\`, which is exactly "probabilities minus the one-hot target."

### Step-by-Step Backward (The Long Way)

For completeness, here is the gradient computed through each intermediate step:

\`\`\`python
# dL/dlogprobs: gradient of loss w.r.t. log probabilities
dlogprobs = torch.zeros_like(logprobs)
dlogprobs[range(N), Y] = -1.0 / N

# dL/dprobs: through log
dprobs = dlogprobs / probs

# dL/dcounts and dL/dcounts_sum: through division
dcounts_sum = -(counts * dprobs / counts_sum**2).sum(dim=1, keepdim=True)
dcounts = dprobs / counts_sum + dcounts_sum  # Broadcast

# dL/dnorm_logits: through exp
dnorm_logits = counts * dcounts

# dL/dlogits: through max subtraction
# Subtracting the max does not change the gradient (it's a constant)
dlogits = dnorm_logits.clone()
dlogit_maxes = -dnorm_logits.sum(dim=1, keepdim=True)
# The max operation routes gradient to the max element only
# But since we subtract it, the effect cancels
\`\`\`

The long way gives the same result as the short formula, but the short formula is preferred for both clarity and numerical stability.

### Why This Simplification Matters

In practice, you always use the combined softmax + cross-entropy gradient, never the step-by-step version. PyTorch's \`F.cross_entropy\` computes both forward and backward in a numerically stable way using this simplification.

\`\`\`python
# PyTorch does this internally:
# Forward: uses log-sum-exp trick for stability
# Backward: returns (softmax(logits) - one_hot(targets)) / N
\`\`\`

### Verifying

\`\`\`python
# Manual gradient
dlogits_manual = probs.clone()
dlogits_manual[range(N), Y] -= 1
dlogits_manual /= N

# PyTorch gradient
loss.backward()
dlogits_auto = logits.grad

print(f"Match: {torch.allclose(dlogits_manual, dlogits_auto, atol=1e-5)}")
\`\`\`

### Key Takeaway

The cross-entropy + softmax gradient simplifies to (probabilities - targets) / batch_size. This elegant result is one of the most important formulas in deep learning. It means the gradient is large when the model is wrong (probability far from 1 for the correct class) and small when the model is right.`,
    },
    {
      id: "nn-manual-backprop-full",
      slug: "putting-it-all-together",
      title: "Putting It All Together",
      content: `## Putting It All Together

Now we combine all the gradient derivations into one complete manual backward pass, implementing every gradient from the loss all the way back to the embedding table.

### The Complete Forward Pass

\`\`\`python
# Assume: X (N, block_size), Y (N,), and all parameters are defined

# 1. Embedding
emb = C[X]                                               # (N, block_size, n_embd)
emb_cat = emb.view(-1, n_embd * block_size)               # (N, 30)

# 2. Hidden layer (linear + batchnorm + tanh)
h_preact = emb_cat @ W1                                   # (N, n_hidden)
# BatchNorm
bn_mean = h_preact.mean(dim=0, keepdim=True)
bn_diff = h_preact - bn_mean
bn_var = (bn_diff**2).mean(dim=0, keepdim=True)
bn_inv_std = (bn_var + 1e-5)**(-0.5)
h_norm = bn_diff * bn_inv_std
h_bn = bn_gain * h_norm + bn_bias
# Activation
h = torch.tanh(h_bn)                                     # (N, n_hidden)

# 3. Output layer
logits = h @ W2 + b2                                      # (N, vocab_size)

# 4. Loss
probs = F.softmax(logits, dim=1)
loss = F.cross_entropy(logits, Y)
\`\`\`

### The Complete Backward Pass

\`\`\`python
N = X.shape[0]

# --- dlogits ---
dlogits = probs.clone()
dlogits[range(N), Y] -= 1
dlogits /= N                                    # (N, vocab_size)

# --- Output layer gradients ---
dW2 = h.T @ dlogits                             # (n_hidden, vocab_size)
db2 = dlogits.sum(0)                             # (vocab_size,)
dh = dlogits @ W2.T                              # (N, n_hidden)

# --- Tanh backward ---
dh_bn = dh * (1 - h**2)                         # (N, n_hidden)

# --- BatchNorm backward ---
dbn_gain = (dh_bn * h_norm).sum(0, keepdim=True)   # (1, n_hidden)
dbn_bias = dh_bn.sum(0, keepdim=True)                # (1, n_hidden)

dh_norm = dh_bn * bn_gain                            # (N, n_hidden)
dh_preact = (1.0 / N) * bn_inv_std * (
    N * dh_norm
    - dh_norm.sum(0)
    - h_norm * (dh_norm * h_norm).sum(0)
)                                                     # (N, n_hidden)

# --- Hidden layer linear backward ---
dW1 = emb_cat.T @ dh_preact                          # (30, n_hidden)
demb_cat = dh_preact @ W1.T                           # (N, 30)

# --- Embedding backward ---
demb = demb_cat.view(emb.shape)                       # (N, block_size, n_embd)

# --- Embedding table gradient ---
dC = torch.zeros_like(C)
for k in range(X.shape[0]):
    for j in range(X.shape[1]):
        dC[X[k, j]] += demb[k, j]
# Or more efficiently:
# dC = torch.zeros_like(C)
# dC.index_add_(0, X.view(-1), demb.view(-1, n_embd))
\`\`\`

### Verification

\`\`\`python
# Run PyTorch autograd for comparison
loss.backward()

# Check every gradient
checks = [
    ("dW2", dW2, W2.grad),
    ("db2", db2, b2.grad),
    ("dW1", dW1, W1.grad),
    ("dbn_gain", dbn_gain, bn_gain.grad),
    ("dbn_bias", dbn_bias, bn_bias.grad),
    ("dC", dC, C.grad),
]

for name, manual, auto in checks:
    match = torch.allclose(manual, auto, atol=1e-5)
    max_diff = (manual - auto).abs().max().item()
    print(f"{name:12s} | match={match} | max_diff={max_diff:.2e}")
\`\`\`

All should match within floating point tolerance (~1e-7).

### Performance Comparison

\`\`\`python
import time

# Autograd timing
start = time.time()
for _ in range(100):
    loss.backward(retain_graph=True)
autograd_time = time.time() - start

# Manual timing
start = time.time()
for _ in range(100):
    # ... all manual gradient code ...
    pass
manual_time = time.time() - start

print(f"Autograd: {autograd_time:.3f}s")
print(f"Manual: {manual_time:.3f}s")
\`\`\`

Manual backprop can sometimes be faster because you can fuse operations and avoid storing unnecessary intermediates. This is why libraries like FlashAttention implement custom backward passes.

### The Embedding Gradient: A Scatter Operation

The embedding gradient is special because multiple input positions may refer to the same character. The gradient must be **accumulated**:

\`\`\`python
# If X = [[3, 5, 3], ...], character 3 appears twice in the first example
# dC[3] must include gradients from both positions
dC = torch.zeros_like(C)
dC.index_add_(0, X.view(-1), demb.view(-1, n_embd))
\`\`\`

This is a **scatter-add** operation — the gradient version of a gather (embedding lookup).

### What You Have Achieved

You have now implemented the complete backward pass for an MLP language model with batch normalization — entirely by hand. This covers:
- Cross-entropy + softmax gradients
- Linear layer gradients (two layers)
- Batch normalization gradients
- Tanh activation gradients
- Embedding table gradients

Every gradient computation in modern deep learning is a composition of these basic building blocks.

### Key Takeaway

Manual backpropagation through a full network is the ultimate test of understanding. Every operation — matrix multiply, normalization, activation, loss — has a clean gradient rule. Chaining them together through the network gives you the complete gradient for every parameter. This is exactly what PyTorch's autograd does, but now you understand it at the deepest level.`,
      starterCode: `import torch
import torch.nn.functional as F

# Small example setup
N = 32
block_size = 3
n_embd = 10
n_hidden = 64
vocab_size = 27

# Random data
X = torch.randint(0, vocab_size, (N, block_size))
Y = torch.randint(0, vocab_size, (N,))

# Parameters (all require grad for autograd verification)
C = torch.randn(vocab_size, n_embd, requires_grad=True)
W1 = torch.randn(n_embd * block_size, n_hidden, requires_grad=True)
bn_gain = torch.ones(1, n_hidden, requires_grad=True)
bn_bias = torch.zeros(1, n_hidden, requires_grad=True)
W2 = torch.randn(n_hidden, vocab_size, requires_grad=True) * 0.1
b2 = torch.zeros(vocab_size, requires_grad=True)

# Forward pass
emb = C[X]
emb_cat = emb.view(N, -1)
h_preact = emb_cat @ W1
bn_mean = h_preact.mean(0, keepdim=True)
bn_diff = h_preact - bn_mean
bn_var = (bn_diff**2).mean(0, keepdim=True)
bn_inv_std = (bn_var + 1e-5)**(-0.5)
h_norm = bn_diff * bn_inv_std
h_bn = bn_gain * h_norm + bn_bias
h = torch.tanh(h_bn)
logits = h @ W2 + b2
loss = F.cross_entropy(logits, Y)

# TODO: Implement complete manual backward pass
# TODO: Verify each gradient against autograd
`,
      solutionCode: `import torch
import torch.nn.functional as F

N = 32
block_size = 3
n_embd = 10
n_hidden = 64
vocab_size = 27

X = torch.randint(0, vocab_size, (N, block_size))
Y = torch.randint(0, vocab_size, (N,))

C = torch.randn(vocab_size, n_embd, requires_grad=True)
W1 = torch.randn(n_embd * block_size, n_hidden, requires_grad=True)
bn_gain = torch.ones(1, n_hidden, requires_grad=True)
bn_bias = torch.zeros(1, n_hidden, requires_grad=True)
W2 = torch.randn(n_hidden, vocab_size, requires_grad=True) * 0.1
b2 = torch.zeros(vocab_size, requires_grad=True)

# Forward pass (store intermediates)
emb = C[X]
emb_cat = emb.view(N, -1)
h_preact = emb_cat @ W1
bn_mean = h_preact.mean(0, keepdim=True)
bn_diff = h_preact - bn_mean
bn_var = (bn_diff**2).mean(0, keepdim=True)
bn_inv_std = (bn_var + 1e-5)**(-0.5)
h_norm = bn_diff * bn_inv_std
h_bn = bn_gain * h_norm + bn_bias
h = torch.tanh(h_bn)
logits = h @ W2 + b2
loss = F.cross_entropy(logits, Y)

# === Manual backward pass ===
probs = F.softmax(logits, dim=1)
dlogits = probs.clone()
dlogits[range(N), Y] -= 1
dlogits /= N

dW2 = h.T @ dlogits
db2 = dlogits.sum(0)
dh = dlogits @ W2.T

dh_bn = dh * (1 - h**2)

dbn_gain = (dh_bn * h_norm).sum(0, keepdim=True)
dbn_bias = dh_bn.sum(0, keepdim=True)
dh_norm = dh_bn * bn_gain

dh_preact = (1.0/N) * bn_inv_std * (
    N * dh_norm - dh_norm.sum(0) - h_norm * (dh_norm * h_norm).sum(0)
)

dW1 = emb_cat.T @ dh_preact
demb_cat = dh_preact @ W1.T
demb = demb_cat.view(emb.shape)

dC = torch.zeros_like(C)
dC.index_add_(0, X.view(-1), demb.view(-1, n_embd))

# Verify
loss.backward()
for name, manual, auto in [
    ("dW2", dW2, W2.grad), ("db2", db2, b2.grad),
    ("dW1", dW1, W1.grad), ("dbn_gain", dbn_gain, bn_gain.grad),
    ("dbn_bias", dbn_bias, bn_bias.grad), ("dC", dC, C.grad),
]:
    ok = torch.allclose(manual, auto, atol=1e-5)
    print(f"{name:12s} match={ok} max_diff={(manual-auto).abs().max():.2e}")
`,
    },
  ],
};
