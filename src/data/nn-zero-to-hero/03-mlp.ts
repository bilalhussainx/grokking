import { Module } from "../types";

export const mlpModule: Module = {
  id: "nn-mlp",
  title: "MLP Language Model",
  description:
    "Build a multi-layer perceptron language model following Bengio et al. 2003. Based on Karpathy's 'Building makemore Part 2: MLP' (https://www.youtube.com/watch?v=TCH_1BHY58I).",
  lessons: [
    {
      id: "nn-mlp-architecture",
      slug: "mlp-architecture",
      title: "Multi-Layer Perceptrons",
      content: `## Multi-Layer Perceptrons for Language Modeling

> **Lecture Resource:** [Building makemore Part 2: MLP](https://www.youtube.com/watch?v=TCH_1BHY58I) by Andrej Karpathy

The bigram model has a fundamental limitation: it only looks at one character of context. The MLP language model, based on the landmark paper by Bengio et al. (2003), uses **multiple characters of context** to make predictions.

### The Key Idea

Instead of predicting the next character from just the previous one, we predict from the previous \`n\` characters. For example, with a context length of 3:

\`\`\`
Given "ell" -> predict 'a' (in "isabella")
Given "isa" -> predict 'b'
Given "sab" -> predict 'e'
\`\`\`

### The Architecture

\`\`\`
[char1, char2, char3] -> Embedding -> Concatenate -> Hidden Layer -> Output Layer -> Softmax
\`\`\`

Step by step:
1. Each input character is mapped to an embedding vector via a lookup table
2. The embedding vectors are concatenated into a single long vector
3. This vector passes through a hidden layer with tanh activation
4. The output layer produces logits over the vocabulary
5. Softmax converts logits to probabilities

### Building the Dataset

\`\`\`python
block_size = 3  # Context length

def build_dataset(words):
    X, Y = [], []
    for w in words:
        context = [0] * block_size  # Start with all '.' tokens
        for ch in w + '.':
            ix = stoi[ch]
            X.append(context)
            Y.append(ix)
            context = context[1:] + [ix]  # Slide window
    X = torch.tensor(X)
    Y = torch.tensor(Y)
    return X, Y
\`\`\`

For the name "emma":
| Context (X) | Target (Y) |
|-------------|------------|
| [., ., .] | e |
| [., ., e] | m |
| [., e, m] | m |
| [e, m, m] | a |
| [m, m, a] | . |

### The Embedding Table

Instead of one-hot encoding (27 dimensions per character), we embed each character into a smaller space:

\`\`\`python
C = torch.randn((27, 10))  # 27 chars, each embedded in 10 dims

# Lookup: just index into the table
emb = C[X]  # Shape: (N, block_size, 10) = (N, 3, 10)
\`\`\`

For a context of 3 characters with 10-dimensional embeddings, the concatenated input to the hidden layer is 30-dimensional. This is much more compact than one-hot (which would be 81-dimensional for 3 characters).

### The Full Forward Pass

\`\`\`python
# Embedding
emb = C[X]                           # (N, 3, 10)
# Concatenate embeddings
h_input = emb.view(-1, 30)           # (N, 30) — flatten the 3x10 into 30
# Hidden layer
h = torch.tanh(h_input @ W1 + b1)   # (N, 200)
# Output layer
logits = h @ W2 + b2                  # (N, 27)
# Loss
loss = F.cross_entropy(logits, Y)
\`\`\`

### Parameter Count

\`\`\`python
# Embedding: 27 * 10 = 270
# W1: 30 * 200 = 6,000
# b1: 200
# W2: 200 * 27 = 5,400
# b2: 27
# Total: ~11,897 parameters
\`\`\`

Compare this to the bigram model (729 parameters). More parameters means more capacity to learn complex patterns.

### Why This Architecture Works

The embedding layer learns a **distributed representation** of characters. Instead of treating each character as an isolated symbol, the model can learn that similar characters (vowels, consonants) have similar embeddings. This sharing of information is what allows the MLP to generalize from training data to unseen character combinations.

### Key Takeaway

The MLP language model extends the bigram approach by using multiple characters of context, connected through embeddings and hidden layers. It is the architecture from Bengio et al. (2003), one of the foundational papers in neural language modeling, and a stepping stone to modern transformers.`,
    },
    {
      id: "nn-mlp-embeddings",
      slug: "embedding-layers",
      title: "Embedding Layers",
      content: `## Embedding Layers

Embedding layers are one of the most important ideas in deep learning for discrete data. They convert integer tokens into dense, learnable vectors.

### Why Not One-Hot?

One-hot encoding has problems:
1. **High dimensionality** — vocabulary of 27 characters means 27-dimensional vectors
2. **No similarity** — all characters are equally distant from each other
3. **Wastes computation** — multiplying a one-hot vector by a matrix is equivalent to just selecting a row

### The Embedding Matrix

An embedding is a lookup table stored as a matrix \`C\` of shape \`(vocab_size, embedding_dim)\`:

\`\`\`python
C = torch.randn((27, 2))  # Embed each of 27 chars into 2D (for visualization)
\`\`\`

To embed character 5 ('e'), we simply take row 5:

\`\`\`python
C[5]  # tensor([0.3421, -1.2058])  (random initial values)
\`\`\`

This is mathematically identical to one-hot encoding followed by matrix multiplication, but **much faster** because we skip the multiplication and just do an array lookup.

### Visualizing Embeddings in 2D

After training with 2-dimensional embeddings, we can plot each character's learned position:

\`\`\`python
import matplotlib.pyplot as plt

plt.figure(figsize=(8, 8))
plt.scatter(C[:, 0].data, C[:, 1].data, s=200)
for i in range(27):
    plt.annotate(itos[i], (C[i, 0].item(), C[i, 1].item()),
                 fontsize=14, ha='center', va='center')
plt.grid(True)
plt.title("Character Embeddings (2D)")
\`\`\`

You will typically see that vowels cluster together, common consonants cluster together, and rare characters are isolated. The model has learned **character similarity** purely from the statistics of names.

### Embedding Dimension Trade-offs

| Dimension | Capacity | Overfitting Risk | Speed |
|-----------|----------|------------------|-------|
| 2 | Very low, good for visualization | Low | Very fast |
| 10 | Moderate, good for small datasets | Moderate | Fast |
| 64-128 | High, good for larger datasets | Higher | Slower |
| 768 | Very high (GPT-2 scale) | Needs lots of data | GPU needed |

For our character-level model with ~27 characters, 10-dimensional embeddings work well. For word-level models with 50,000+ tokens, you need much higher dimensions.

### Concatenating Context Embeddings

When our context is 3 characters, we look up 3 embedding vectors and concatenate them:

\`\`\`python
C = torch.randn((27, 10))       # Embedding table
X = torch.tensor([[5, 13, 13]])  # Context: 'e', 'm', 'm'

emb = C[X]                       # Shape: (1, 3, 10)
emb_flat = emb.view(1, -1)       # Shape: (1, 30)
\`\`\`

The \`view\` operation reshapes without copying data. The hidden layer receives a 30-dimensional vector that encodes all three context characters.

### Batch Processing

The beauty of embeddings: they naturally handle batches:

\`\`\`python
X_batch = torch.tensor([
    [5, 13, 13],   # 'emm'
    [13, 13, 1],   # 'mma'
    [0, 0, 5],     # '..e'
])
emb_batch = C[X_batch]   # Shape: (3, 3, 10) — 3 examples, 3 chars, 10 dims
emb_flat = emb_batch.view(3, -1)  # Shape: (3, 30)
\`\`\`

All three examples are processed simultaneously through the same weight matrices.

### Embeddings Are Learned

The embedding matrix \`C\` starts random and is updated through backpropagation just like any other parameter:

\`\`\`python
parameters = [C, W1, b1, W2, b2]
for p in parameters:
    p.requires_grad = True
\`\`\`

During training, the gradients flow back through the lookup operation to update the embedding vectors. Characters that appear in similar contexts will develop similar embeddings.

### Key Takeaway

Embeddings transform discrete tokens into continuous vectors that can be processed by neural networks. They are learned end-to-end during training and automatically capture similarity between tokens. Every language model — from our tiny character model to GPT-4 — starts with an embedding layer.`,
    },
    {
      id: "nn-mlp-training",
      slug: "training-mlps",
      title: "Training MLPs",
      content: `## Training MLPs

Training a neural network well requires more than just a training loop. We need proper data splitting, learning rate scheduling, and careful monitoring of train vs. validation performance.

### Initializing Parameters

\`\`\`python
# Hyperparameters
vocab_size = 27
block_size = 3
n_embd = 10       # Embedding dimension
n_hidden = 200    # Hidden layer size

# Parameters
C = torch.randn((vocab_size, n_embd))
W1 = torch.randn((n_embd * block_size, n_hidden))
b1 = torch.randn(n_hidden)
W2 = torch.randn((n_hidden, vocab_size))
b2 = torch.randn(vocab_size)

parameters = [C, W1, b1, W2, b2]
for p in parameters:
    p.requires_grad = True

print(f"Total parameters: {sum(p.nelement() for p in parameters)}")
\`\`\`

### Train/Validation/Test Split

\`\`\`python
import random
random.seed(42)
random.shuffle(words)

n1 = int(0.8 * len(words))
n2 = int(0.9 * len(words))

Xtr, Ytr = build_dataset(words[:n1])    # 80% train
Xval, Yval = build_dataset(words[n1:n2]) # 10% validation
Xte, Yte = build_dataset(words[n2:])     # 10% test
\`\`\`

### Mini-Batch Training

Processing the entire dataset at once is slow. Mini-batches give noisy but fast gradient estimates:

\`\`\`python
batch_size = 32

for step in range(200000):
    # Mini-batch
    ix = torch.randint(0, Xtr.shape[0], (batch_size,))
    Xb, Yb = Xtr[ix], Ytr[ix]

    # Forward pass
    emb = C[Xb]                          # (batch_size, block_size, n_embd)
    h = torch.tanh(emb.view(-1, n_embd * block_size) @ W1 + b1)
    logits = h @ W2 + b2
    loss = F.cross_entropy(logits, Yb)

    # Backward pass
    for p in parameters:
        p.grad = None
    loss.backward()

    # Update
    lr = 0.1 if step < 100000 else 0.01
    for p in parameters:
        p.data += -lr * p.grad
\`\`\`

### Learning Rate Scheduling

The learning rate is the most important hyperparameter. A common strategy:

1. **Start high** (0.1) — make big steps while far from the optimum
2. **Decay later** (0.01) — fine-tune near the optimum

### Finding the Optimal Learning Rate

Karpathy demonstrates a practical technique: sweep through learning rates exponentially and plot the loss:

\`\`\`python
lre = torch.linspace(-3, 0, 1000)  # Exponents from 10^-3 to 10^0
lrs = 10 ** lre                     # Learning rates from 0.001 to 1.0

losses = []
for i in range(1000):
    # ... forward pass ...
    lr = lrs[i]
    for p in parameters:
        p.data += -lr * p.grad
    losses.append(loss.item())

plt.plot(lrs, losses)
plt.xscale('log')
\`\`\`

The optimal learning rate is typically where the loss is decreasing fastest (not the minimum — that often overshoots).

### Tracking Training vs Validation Loss

\`\`\`python
@torch.no_grad()
def eval_loss(X, Y):
    emb = C[X]
    h = torch.tanh(emb.view(-1, n_embd * block_size) @ W1 + b1)
    logits = h @ W2 + b2
    loss = F.cross_entropy(logits, Y)
    return loss.item()

# Evaluate periodically
if step % 10000 == 0:
    train_loss = eval_loss(Xtr, Ytr)
    val_loss = eval_loss(Xval, Yval)
    print(f"Step {step}: train={train_loss:.4f}, val={val_loss:.4f}")
\`\`\`

The \`@torch.no_grad()\` decorator disables gradient computation for efficiency during evaluation.

### Interpreting the Gap

| Situation | Train Loss | Val Loss | Diagnosis |
|-----------|-----------|----------|-----------|
| Both high | 2.50 | 2.52 | **Underfitting** — model too small |
| Train low, val high | 1.80 | 2.40 | **Overfitting** — model too big for data |
| Both low, close | 2.05 | 2.10 | **Good fit** — well balanced |

### Key Takeaway

Training a neural network well is an iterative process of tuning the learning rate, monitoring train vs. validation loss, and adjusting model size. The mini-batch approach trades some gradient accuracy for much faster iteration, and learning rate scheduling ensures we get both fast initial progress and fine convergence.`,
      starterCode: `import torch
import torch.nn.functional as F

# Assume stoi, itos, words, build_dataset are defined
# Hyperparameters
vocab_size = 27
block_size = 3
n_embd = 10
n_hidden = 200
batch_size = 32

# TODO: Initialize parameters C, W1, b1, W2, b2
# TODO: Split words into train/val/test and build datasets
# TODO: Training loop with mini-batches
# TODO: Learning rate schedule: 0.1 for first half, 0.01 for second half
# TODO: Print train and val loss every 10000 steps
`,
      solutionCode: `import torch
import torch.nn.functional as F
import random

# Simplified example with small word list
words = ['emma', 'olivia', 'ava', 'isabella', 'sophia',
         'mia', 'charlotte', 'amelia', 'harper', 'evelyn',
         'abigail', 'emily', 'ella', 'elizabeth', 'camila',
         'luna', 'sofia', 'avery', 'mila', 'aria']

chars = sorted(list(set(''.join(words))))
stoi = {s: i+1 for i, s in enumerate(chars)}
stoi['.'] = 0
itos = {i: s for s, i in stoi.items()}
vocab_size = len(itos)
block_size = 3
n_embd = 10
n_hidden = 200

def build_dataset(words):
    X, Y = [], []
    for w in words:
        context = [0] * block_size
        for ch in w + '.':
            ix = stoi[ch]
            X.append(context)
            Y.append(ix)
            context = context[1:] + [ix]
    return torch.tensor(X), torch.tensor(Y)

random.seed(42)
random.shuffle(words)
n1 = int(0.8 * len(words))
Xtr, Ytr = build_dataset(words[:n1])
Xval, Yval = build_dataset(words[n1:])

# Initialize parameters
C = torch.randn((vocab_size, n_embd))
W1 = torch.randn((n_embd * block_size, n_hidden)) * 0.1
b1 = torch.randn(n_hidden) * 0.01
W2 = torch.randn((n_hidden, vocab_size)) * 0.1
b2 = torch.randn(vocab_size) * 0.01
parameters = [C, W1, b1, W2, b2]
for p in parameters:
    p.requires_grad = True

print(f"Total parameters: {sum(p.nelement() for p in parameters)}")

batch_size = 32
max_steps = 50000

for step in range(max_steps):
    ix = torch.randint(0, Xtr.shape[0], (batch_size,))
    Xb, Yb = Xtr[ix], Ytr[ix]

    emb = C[Xb]
    h = torch.tanh(emb.view(-1, n_embd * block_size) @ W1 + b1)
    logits = h @ W2 + b2
    loss = F.cross_entropy(logits, Yb)

    for p in parameters:
        p.grad = None
    loss.backward()

    lr = 0.1 if step < max_steps // 2 else 0.01
    for p in parameters:
        p.data += -lr * p.grad

    if step % 10000 == 0:
        print(f"Step {step}, Loss: {loss.item():.4f}")

# Evaluate
@torch.no_grad()
def eval_loss(X, Y):
    emb = C[X]
    h = torch.tanh(emb.view(-1, n_embd * block_size) @ W1 + b1)
    logits = h @ W2 + b2
    return F.cross_entropy(logits, Y).item()

print(f"\\nTrain loss: {eval_loss(Xtr, Ytr):.4f}")
print(f"Val loss: {eval_loss(Xval, Yval):.4f}")
`,
    },
    {
      id: "nn-mlp-hyperparams",
      slug: "hyperparameter-tuning",
      title: "Hyperparameter Tuning",
      content: `## Hyperparameter Tuning

Hyperparameters are the settings you choose **before** training begins. Getting them right can mean the difference between a model that barely works and one that generates impressively realistic names.

### The Key Hyperparameters

For our MLP language model, the main hyperparameters are:

| Hyperparameter | Typical Range | Effect |
|----------------|---------------|--------|
| Embedding dimension (\`n_embd\`) | 2–64 | Capacity to represent characters |
| Hidden layer size (\`n_hidden\`) | 64–500 | Model capacity |
| Context length (\`block_size\`) | 2–8 | How much history the model sees |
| Learning rate | 0.001–1.0 | Speed vs. stability of training |
| Batch size | 16–256 | Gradient noise vs. speed |

### Embedding Dimension

Smaller embeddings mean each character has fewer numbers to describe it. With only 27 characters, you do not need huge embeddings:

\`\`\`python
# Experiment: try different embedding sizes
for n_embd in [2, 5, 10, 20]:
    C = torch.randn((27, n_embd))
    W1 = torch.randn((n_embd * block_size, n_hidden))
    # ... train and evaluate ...
    print(f"n_embd={n_embd}, val_loss={val_loss:.4f}")
\`\`\`

Typical finding: 10 dimensions works nearly as well as 20 for character-level modeling. Beyond 10, you get diminishing returns.

### Hidden Layer Size

The hidden layer is where the model does its "thinking." Larger hidden layers can represent more complex patterns:

\`\`\`python
for n_hidden in [64, 100, 200, 300]:
    W1 = torch.randn((n_embd * block_size, n_hidden))
    b1 = torch.randn(n_hidden)
    W2 = torch.randn((n_hidden, 27))
    b2 = torch.randn(27)
    # ... train and evaluate ...
\`\`\`

But larger is not always better — with limited data, a large hidden layer will overfit.

### Context Length

Longer context means the model can learn longer-range dependencies:

\`\`\`python
for block_size in [2, 3, 4, 5, 6]:
    Xtr, Ytr = build_dataset(train_words, block_size)
    Xval, Yval = build_dataset(val_words, block_size)
    # ... adjust W1 shape and train ...
\`\`\`

For names (average length ~6 characters), block_size=3 captures most of the useful context. Longer contexts help for longer sequences.

### The Systematic Approach

Instead of random guessing, tune hyperparameters systematically:

1. **Fix everything except one hyperparameter**
2. **Try several values** and evaluate on the validation set
3. **Pick the best value** and move to the next hyperparameter
4. **Repeat** — because changing one hyperparameter can shift the optimal value of others

### Learning Rate Finder (Practical Technique)

\`\`\`python
# 1. Initialize fresh parameters
# 2. Do one epoch with exponentially increasing learning rate
# 3. Plot loss vs. learning rate
# 4. Pick the LR where loss is decreasing fastest

lrs = torch.logspace(-3, 0, steps=200)
losses = []
for i, lr in enumerate(lrs):
    # Forward, backward
    for p in parameters:
        p.data += -lr * p.grad
    losses.append(loss.item())
\`\`\`

### Total Parameter Budget

For a given dataset size, there is a rough limit on how many parameters are useful:

\`\`\`
Rule of thumb: parameters <= 10 * number of training examples
\`\`\`

With 200,000 bigrams in training, a model with 20,000 parameters is safe. A model with 200,000 parameters might overfit.

\`\`\`python
total_params = sum(p.nelement() for p in parameters)
print(f"Parameters: {total_params}")
print(f"Training examples: {Xtr.shape[0]}")
print(f"Ratio: {Xtr.shape[0] / total_params:.1f}x")
\`\`\`

### Comparing Configurations

Keep a log of experiments:

\`\`\`python
# Experiment log
# n_embd=10, n_hidden=200, block=3, lr=0.1->0.01: val_loss=2.17
# n_embd=10, n_hidden=300, block=3, lr=0.1->0.01: val_loss=2.15
# n_embd=15, n_hidden=200, block=4, lr=0.1->0.01: val_loss=2.12
# n_embd=15, n_hidden=300, block=4, lr=0.1->0.01: val_loss=2.10 <-- best
\`\`\`

### Key Takeaway

Hyperparameter tuning is part science, part craft. The validation set is your guide — never tune on the test set. Start with a reasonable baseline, change one thing at a time, and let the validation loss tell you what works.`,
    },
    {
      id: "nn-mlp-regularization",
      slug: "overfitting-and-regularization",
      title: "Overfitting & Regularization",
      content: `## Overfitting & Regularization

When a model memorizes the training data instead of learning general patterns, it **overfits**. Regularization techniques prevent this.

### Detecting Overfitting

The telltale sign: training loss keeps going down, but validation loss stops improving or gets worse.

\`\`\`python
# During training, track both:
train_losses = []
val_losses = []

for step in range(max_steps):
    # ... training step ...
    if step % 1000 == 0:
        train_losses.append(eval_loss(Xtr, Ytr))
        val_losses.append(eval_loss(Xval, Yval))

# Plot
plt.plot(train_losses, label='train')
plt.plot(val_losses, label='val')
plt.legend()
\`\`\`

When the curves diverge, you are overfitting.

### Weight Decay (L2 Regularization)

Add a penalty proportional to the sum of squared weights:

\`\`\`python
# In the loss computation:
loss = F.cross_entropy(logits, Yb) + 0.001 * sum((p**2).sum() for p in parameters)
\`\`\`

Equivalently, in the update step:

\`\`\`python
for p in parameters:
    p.data *= (1 - lr * weight_decay)  # Shrink weights
    p.data += -lr * p.grad              # Normal gradient step
\`\`\`

Weight decay pushes weights toward zero, preventing the model from relying too heavily on any single feature. It is the most common regularizer in deep learning.

### Dropout

During training, randomly set a fraction of activations to zero:

\`\`\`python
# During training:
mask = (torch.rand(h.shape) > dropout_rate).float()
h = h * mask / (1 - dropout_rate)  # Scale to maintain expected value

# During evaluation:
# Don't apply dropout — use all activations
\`\`\`

The division by \`(1 - dropout_rate)\` ensures the expected value of each activation stays the same during training and evaluation. Common dropout rates are 0.1 to 0.5.

Dropout forces the model to learn redundant representations — no single neuron can be relied upon because it might be dropped.

### Early Stopping

The simplest regularizer: stop training when validation loss stops improving.

\`\`\`python
best_val_loss = float('inf')
patience = 10
patience_counter = 0

for step in range(max_steps):
    # ... training step ...
    if step % eval_interval == 0:
        val_loss = eval_loss(Xval, Yval)
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
            # Save best parameters
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print(f"Early stopping at step {step}")
                break
\`\`\`

### Data Augmentation

For language models, data augmentation is limited, but for other tasks (image classification, etc.) it is very powerful. The idea: create modified versions of training examples that preserve the label.

For character models, one option is to train on reversed names too, doubling the data.

### Reducing Model Size

Sometimes the best regularizer is a smaller model. If you have 10,000 training examples, a model with 100,000 parameters will almost certainly overfit.

\`\`\`python
# Underfitting: model too small
# n_embd=2, n_hidden=20  -> train=2.60, val=2.62

# Good fit: model matches data
# n_embd=10, n_hidden=100 -> train=2.15, val=2.20

# Overfitting: model too large
# n_embd=30, n_hidden=500 -> train=1.70, val=2.35
\`\`\`

### The Bias-Variance Trade-off

| Model Size | Bias | Variance | Result |
|-----------|------|----------|--------|
| Too small | High | Low | Underfits — cannot capture patterns |
| Just right | Medium | Medium | Best generalization |
| Too large | Low | High | Overfits — memorizes noise |

### Key Takeaway

Overfitting is the central challenge of machine learning. The three main defenses are: regularization (weight decay, dropout), early stopping, and choosing an appropriately sized model. Always evaluate on held-out data, and remember that a slightly worse training loss with better validation loss means a better model.`,
    },
  ],
};
