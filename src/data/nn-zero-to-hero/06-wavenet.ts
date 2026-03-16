import { Module } from "../types";

export const wavenetModule: Module = {
  id: "nn-wavenet",
  title: "WaveNet & Deeper Models",
  description:
    "Build a hierarchical language model inspired by DeepMind's WaveNet. Based on Karpathy's 'Building makemore Part 5: Building a WaveNet' (https://www.youtube.com/watch?v=t3YJ5hKiMQ0).",
  lessons: [
    {
      id: "nn-wavenet-architecture",
      slug: "wavenet-architecture",
      title: "WaveNet Architecture",
      content: `## WaveNet Architecture

> **Lecture Resource:** [Building makemore Part 5: Building a WaveNet](https://www.youtube.com/watch?v=t3YJ5hKiMQ0) by Andrej Karpathy

WaveNet, originally developed by DeepMind for audio generation, introduced **dilated causal convolutions** — a way to efficiently process sequences with a large receptive field. We adapt the core idea for our character-level language model.

### The Problem with Flat MLPs

Our MLP concatenates all context characters into one flat vector and processes them through a single hidden layer. This has limitations:

\`\`\`
Context: [a, b, c, d, e, f, g, h]  (8 characters)
MLP: Concatenate all 8 embeddings → one giant hidden layer
\`\`\`

The MLP treats all context positions equally — it has no notion of which characters are close together versus far apart. Every character interacts with every other character immediately.

### The WaveNet Insight: Hierarchical Processing

Instead of processing all characters at once, WaveNet processes them **hierarchically** — first combining nearby characters, then combining those combinations:

\`\`\`
Level 0: [a] [b] [c] [d] [e] [f] [g] [h]
Level 1: [ab]   [cd]   [ef]   [gh]
Level 2: [abcd]       [efgh]
Level 3: [abcdefgh]
\`\`\`

At each level, pairs of adjacent representations are merged using a small neural network. This is called a **tree-structured** or **hierarchical** architecture.

### Dilated Causal Convolutions

The original WaveNet uses **dilated convolutions** to achieve the same hierarchical effect without explicitly building a tree:

\`\`\`
Dilation 1: each output looks at 2 adjacent inputs
Dilation 2: each output looks at inputs 2 apart
Dilation 4: each output looks at inputs 4 apart
\`\`\`

The **receptive field** doubles at each layer:
- After 1 layer: 2 characters
- After 2 layers: 4 characters
- After 3 layers: 8 characters
- After 10 layers: 1024 characters

This exponential growth means you can cover a very long context with relatively few layers.

### Causal Constraint

A critical requirement for language models: each position can only attend to **past** positions (not future ones). This is the "causal" in causal convolutions:

\`\`\`
Output at position t depends only on inputs at positions <= t
\`\`\`

This ensures the model can be used for autoregressive generation — predicting one character at a time, left to right.

### Why WaveNet Matters for Our Course

Even though we are building a character-level name generator (not an audio model), the WaveNet architecture teaches important principles:
1. **Hierarchical feature extraction** — process local context first, then global
2. **Efficient receptive field growth** — logarithmic depth for linear context
3. **Modular design** — stack identical blocks with different dilation rates

These same principles appear in transformers (stacked attention layers) and modern convolutional architectures.

### Advantages Over Flat MLPs

| Property | MLP | WaveNet-style |
|----------|-----|---------------|
| Receptive field | Fixed (block_size) | Grows exponentially with depth |
| Parameter efficiency | O(block_size * hidden) | O(depth * hidden) |
| Local patterns | Treated same as global | Processed first |
| Depth | 1-2 layers typical | Many layers, each small |

### Key Takeaway

WaveNet's dilated causal convolutions are a way to process sequences hierarchically, combining nearby elements first and then merging those combinations. This gives a large receptive field with relatively few parameters and layers, and introduces the idea of **deep, modular architectures** that we will see again in transformers.`,
    },
    {
      id: "nn-wavenet-tree-structure",
      slug: "tree-structured-network",
      title: "Building a Tree-Structured Network",
      content: `## Building a Tree-Structured Network

We implement the WaveNet idea in our makemore framework by building a tree that merges pairs of character embeddings hierarchically.

### The Architecture

For a context of 8 characters with 10-dimensional embeddings:

\`\`\`python
# Level 0: 8 embeddings of dim 10
# Level 1: 4 merged embeddings (pairs merged via linear + tanh)
# Level 2: 2 merged embeddings
# Level 3: 1 final embedding → output logits
\`\`\`

### The FlattenConsecutive Layer

The key building block: take consecutive groups of features and flatten them:

\`\`\`python
class FlattenConsecutive:
    def __init__(self, n):
        self.n = n

    def __call__(self, x):
        B, T, C = x.shape
        x = x.view(B, T // self.n, C * self.n)
        if x.shape[1] == 1:
            x = x.squeeze(1)
        return x
\`\`\`

For input shape \`(B, 8, 10)\` with \`n=2\`:
- Output: \`(B, 4, 20)\` — pairs of embeddings concatenated

### The Linear Layer

A standard linear transformation, applied identically to each position:

\`\`\`python
class Linear:
    def __init__(self, fan_in, fan_out, bias=True):
        self.weight = torch.randn((fan_in, fan_out)) / fan_in**0.5
        self.bias = torch.zeros(fan_out) if bias else None

    def __call__(self, x):
        self.out = x @ self.weight
        if self.bias is not None:
            self.out += self.bias
        return self.out

    def parameters(self):
        return [self.weight] + ([] if self.bias is None else [self.bias])
\`\`\`

### The BatchNorm Layer

Adapted to work with both 2D and 3D tensors:

\`\`\`python
class BatchNorm1d:
    def __init__(self, dim, eps=1e-5, momentum=0.001):
        self.eps = eps
        self.momentum = momentum
        self.training = True
        self.gamma = torch.ones(dim)
        self.beta = torch.zeros(dim)
        self.running_mean = torch.zeros(dim)
        self.running_var = torch.ones(dim)

    def __call__(self, x):
        if self.training:
            if x.ndim == 2:
                dim = 0
            elif x.ndim == 3:
                dim = (0, 1)
            xmean = x.mean(dim, keepdim=True)
            xvar = x.var(dim, keepdim=True)
        else:
            xmean = self.running_mean
            xvar = self.running_var
        xhat = (x - xmean) / torch.sqrt(xvar + self.eps)
        self.out = self.gamma * xhat + self.beta
        if self.training:
            with torch.no_grad():
                self.running_mean = (1 - self.momentum) * self.running_mean + self.momentum * xmean.mean((0,1) if x.ndim==3 else 0)
                self.running_var = (1 - self.momentum) * self.running_var + self.momentum * xvar.mean((0,1) if x.ndim==3 else 0)
        return self.out

    def parameters(self):
        return [self.gamma, self.beta]
\`\`\`

### The Tanh Layer

\`\`\`python
class Tanh:
    def __call__(self, x):
        self.out = torch.tanh(x)
        return self.out
    def parameters(self):
        return []
\`\`\`

### Assembling the WaveNet

\`\`\`python
n_embd = 24
n_hidden = 128
block_size = 8
vocab_size = 27

model = Sequential([
    Embedding(vocab_size, n_embd),
    FlattenConsecutive(2), Linear(n_embd * 2, n_hidden, bias=False), BatchNorm1d(n_hidden), Tanh(),
    FlattenConsecutive(2), Linear(n_hidden * 2, n_hidden, bias=False), BatchNorm1d(n_hidden), Tanh(),
    FlattenConsecutive(2), Linear(n_hidden * 2, n_hidden, bias=False), BatchNorm1d(n_hidden), Tanh(),
    Linear(n_hidden, vocab_size),
])
\`\`\`

### Tracing the Shapes

\`\`\`
Input:               (B, 8)        — 8 character indices
After Embedding:     (B, 8, 24)    — 8 embeddings of dim 24
After Flatten(2):    (B, 4, 48)    — pairs merged
After Linear:        (B, 4, 128)   — projected to hidden dim
After BN + Tanh:     (B, 4, 128)
After Flatten(2):    (B, 2, 256)   — pairs merged again
After Linear:        (B, 2, 128)
After BN + Tanh:     (B, 2, 128)
After Flatten(2):    (B, 256)      — final merge (squeezed)
After Linear:        (B, 128)
After BN + Tanh:     (B, 128)
After Linear:        (B, 27)       — logits
\`\`\`

### Results

The WaveNet-style architecture typically achieves a lower validation loss than the flat MLP, because it processes local patterns (common bigrams and trigrams) in the early layers and global patterns (full name structure) in the later layers.

### Key Takeaway

The tree-structured WaveNet processes sequences hierarchically by merging consecutive elements at each level. This modular design — stack of (Flatten + Linear + BatchNorm + Activation) blocks — is a pattern you will see throughout deep learning, culminating in the transformer block.`,
    },
    {
      id: "nn-wavenet-nn-module",
      slug: "pytorch-nn-module",
      title: "PyTorch nn.Module",
      content: `## PyTorch nn.Module

After building everything from raw tensors, it is time to understand PyTorch's \`nn.Module\` — the standard way to define neural network components in production code.

### Why nn.Module?

Our custom classes (Linear, BatchNorm, Tanh, etc.) work, but they lack features that production code needs:
- Automatic parameter collection
- Easy GPU/CPU device management
- Serialization (saving and loading models)
- Training/eval mode switching
- Integration with PyTorch optimizers

### The nn.Module Pattern

\`\`\`python
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self, vocab_size, n_embd, n_hidden, block_size):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, n_embd)
        self.flatten = nn.Flatten()
        self.layers = nn.Sequential(
            nn.Linear(n_embd * block_size, n_hidden),
            nn.BatchNorm1d(n_hidden),
            nn.Tanh(),
            nn.Linear(n_hidden, n_hidden),
            nn.BatchNorm1d(n_hidden),
            nn.Tanh(),
            nn.Linear(n_hidden, vocab_size),
        )

    def forward(self, x):
        emb = self.embedding(x)           # (B, T, C)
        emb = emb.view(emb.shape[0], -1)  # (B, T*C)
        logits = self.layers(emb)          # (B, vocab_size)
        return logits
\`\`\`

### Key nn.Module Features

**Automatic parameter collection:**
\`\`\`python
model = MLP(27, 10, 200, 3)
print(f"Parameters: {sum(p.numel() for p in model.parameters())}")
# Automatically finds all parameters in all sub-modules
\`\`\`

**Training/eval mode:**
\`\`\`python
model.train()  # BatchNorm uses batch statistics, dropout is active
model.eval()   # BatchNorm uses running statistics, dropout is off
\`\`\`

**Device management:**
\`\`\`python
model = model.to('cuda')   # Move all parameters to GPU
model = model.to('cpu')    # Move back to CPU
\`\`\`

**Saving and loading:**
\`\`\`python
torch.save(model.state_dict(), 'model.pt')
model.load_state_dict(torch.load('model.pt'))
\`\`\`

### nn.Sequential

For simple architectures where data flows straight through layers:

\`\`\`python
model = nn.Sequential(
    nn.Embedding(27, 10),
    nn.Flatten(),
    nn.Linear(30, 200),
    nn.BatchNorm1d(200),
    nn.Tanh(),
    nn.Linear(200, 27),
)
\`\`\`

### Common nn Layers

| Layer | Purpose | Our Equivalent |
|-------|---------|---------------|
| \`nn.Linear(in, out)\` | Linear transformation | \`x @ W + b\` |
| \`nn.Embedding(V, D)\` | Lookup table | \`C[indices]\` |
| \`nn.BatchNorm1d(D)\` | Batch normalization | Our BatchNorm class |
| \`nn.Tanh()\` | Activation | \`torch.tanh(x)\` |
| \`nn.ReLU()\` | Activation | \`torch.relu(x)\` |
| \`nn.Dropout(p)\` | Regularization | Random zero mask |
| \`nn.LayerNorm(D)\` | Layer normalization | Normalize per-example |

### Optimizers

PyTorch provides optimizers that implement gradient descent variants:

\`\`\`python
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)

for step in range(max_steps):
    logits = model(Xb)
    loss = F.cross_entropy(logits, Yb)

    optimizer.zero_grad()  # Zero all gradients
    loss.backward()        # Compute gradients
    optimizer.step()       # Update parameters
\`\`\`

AdamW is the standard optimizer in modern deep learning. It adapts the learning rate per-parameter based on gradient history and includes proper weight decay.

### From Custom to PyTorch: A Translation Guide

\`\`\`python
# Custom:
for p in parameters:
    p.grad = None
loss.backward()
for p in parameters:
    p.data += -lr * p.grad

# PyTorch equivalent:
optimizer.zero_grad()
loss.backward()
optimizer.step()
\`\`\`

### Key Takeaway

\`nn.Module\` is PyTorch's standard abstraction for neural network components. It provides automatic parameter tracking, device management, and serialization. Now that you understand what happens under the hood (from our from-scratch implementations), using \`nn.Module\` is simply a cleaner way to express the same computations.`,
    },
    {
      id: "nn-wavenet-performance",
      slug: "performance-analysis",
      title: "Performance Analysis",
      content: `## Performance Analysis

As models grow, performance optimization becomes essential. This lesson covers profiling techniques, common bottlenecks, and practical strategies for faster training.

### Timing Your Code

The simplest profiling: measure wall-clock time for different parts of the training loop.

\`\`\`python
import time

# Time the forward pass
start = time.time()
for _ in range(100):
    logits = model(Xb)
    loss = F.cross_entropy(logits, Yb)
fwd_time = (time.time() - start) / 100

# Time the backward pass
start = time.time()
for _ in range(100):
    loss.backward(retain_graph=True)
bwd_time = (time.time() - start) / 100

print(f"Forward:  {fwd_time*1000:.2f} ms")
print(f"Backward: {bwd_time*1000:.2f} ms")
# Backward is typically 2-3x slower than forward
\`\`\`

### PyTorch Profiler

For detailed analysis:

\`\`\`python
from torch.profiler import profile, record_function, ProfilerActivity

with profile(activities=[ProfilerActivity.CPU], record_shapes=True) as prof:
    with record_function("forward"):
        logits = model(Xb)
        loss = F.cross_entropy(logits, Yb)
    with record_function("backward"):
        loss.backward()

print(prof.key_averages().table(sort_by="cpu_time_total", row_limit=10))
\`\`\`

This shows exactly which operations take the most time.

### Common Bottlenecks

**1. Data loading** — Reading from disk is often slower than computation:
\`\`\`python
# Bad: load data inside the loop
for step in range(max_steps):
    data = load_from_disk()  # Slow!

# Good: preload into memory
X, Y = build_dataset(words)  # Load once
X, Y = X.to(device), Y.to(device)  # Move to GPU once
\`\`\`

**2. Unnecessary tensor operations** — Creating new tensors in the loop:
\`\`\`python
# Bad: creates a new tensor every iteration
mask = torch.zeros(N, dtype=torch.bool)

# Good: pre-allocate and reuse
mask = torch.zeros(N, dtype=torch.bool, device=device)
\`\`\`

**3. Python overhead** — Pure Python loops are slow:
\`\`\`python
# Bad: Python loop over examples
for i in range(N):
    output[i] = model(X[i])

# Good: batched operation
output = model(X)  # Process all N at once
\`\`\`

### Batch Size and Throughput

Larger batch sizes are more computationally efficient (better GPU utilization) but require more memory:

\`\`\`python
for batch_size in [32, 64, 128, 256, 512]:
    start = time.time()
    for _ in range(100):
        ix = torch.randint(0, Xtr.shape[0], (batch_size,))
        logits = model(Xtr[ix])
        loss = F.cross_entropy(logits, Ytr[ix])
        loss.backward()
    elapsed = time.time() - start
    throughput = batch_size * 100 / elapsed
    print(f"Batch {batch_size:4d}: {throughput:.0f} examples/sec")
\`\`\`

### Memory Analysis

\`\`\`python
# Check parameter memory
param_memory = sum(p.nelement() * p.element_size() for p in model.parameters())
print(f"Parameter memory: {param_memory / 1e6:.2f} MB")

# Gradient memory is roughly equal to parameter memory
# Activation memory depends on batch size and model depth
\`\`\`

### GPU vs. CPU

For our small character-level models, CPU is often faster because the overhead of CPU-to-GPU transfer exceeds the computation time. GPU becomes essential when:
- Model has > 100K parameters
- Batch size is > 128
- Sequence length is > 100

\`\`\`python
if torch.cuda.is_available():
    device = 'cuda'
    model = model.to(device)
    Xtr = Xtr.to(device)
    Ytr = Ytr.to(device)
else:
    device = 'cpu'
\`\`\`

### Comparing Model Architectures

Build a benchmark to compare flat MLP vs. WaveNet:

\`\`\`python
results = {}
for name, model in [("MLP", mlp_model), ("WaveNet", wavenet_model)]:
    # Train both for the same number of steps
    # Record: final val loss, training time, parameter count
    results[name] = {
        'val_loss': val_loss,
        'train_time': elapsed,
        'params': sum(p.numel() for p in model.parameters()),
    }

for name, r in results.items():
    print(f"{name}: val_loss={r['val_loss']:.4f}, "
          f"time={r['train_time']:.1f}s, "
          f"params={r['params']}")
\`\`\`

### Key Takeaway

Performance optimization follows the 80/20 rule: a few bottlenecks account for most of the slowdown. Profile before optimizing, batch operations whenever possible, and choose batch sizes that balance throughput with memory. For small models, CPU is fine; for anything resembling a real language model, GPU is essential.`,
    },
  ],
};
