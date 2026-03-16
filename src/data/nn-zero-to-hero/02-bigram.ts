import { Module } from "../types";

export const bigramModule: Module = {
  id: "nn-bigram",
  title: "Bigram Language Model",
  description:
    "Build a character-level language model from counting to neural networks. Based on Karpathy's 'The spelled-out intro to language modeling: building makemore' (https://www.youtube.com/watch?v=PaCmpygFfXo).",
  lessons: [
    {
      id: "nn-bigram-lm-basics",
      slug: "language-modeling-basics",
      title: "Language Modeling Basics",
      content: `## Language Modeling Basics

> **Lecture Resource:** [The spelled-out intro to language modeling: building makemore](https://www.youtube.com/watch?v=PaCmpygFfXo) by Andrej Karpathy

A **language model** assigns probabilities to sequences of tokens. Given some context, it predicts what comes next. This seemingly simple task is the foundation of modern AI — GPT, Claude, and every large language model is, at its core, a next-token predictor.

### What is a Token?

A token is the basic unit of text that the model works with. There are two main approaches:

| Level | Example for "hello" | Vocabulary Size | Pros | Cons |
|-------|---------------------|-----------------|------|------|
| Character-level | ['h', 'e', 'l', 'l', 'o'] | ~65 (a-z, A-Z, digits, punctuation) | Tiny vocabulary | Long sequences |
| Word-level | ['hello'] | ~50,000+ | Short sequences | Huge vocabulary, rare word problem |
| Subword (BPE) | ['hel', 'lo'] | ~50,000 | Good balance | Requires tokenizer training |

In this module, we work at the **character level**. The vocabulary is tiny (just 26 letters plus a special start/end token), making it easy to understand and debug.

### The Dataset: Names

We will use a dataset of human names (one per line). The model will learn the statistical patterns of how characters follow each other in English names, then generate new, plausible-sounding names.

\`\`\`python
# Sample names from the dataset
words = open('names.txt', 'r').read().splitlines()
print(words[:5])  # ['emma', 'olivia', 'ava', 'isabella', 'sophia']
print(f"Total names: {len(words)}")  # ~32,000
\`\`\`

### The Special Token

We use a special character \`'.'\` to mark the beginning and end of each name:

\`\`\`
'.emma.' -> the model sees: . -> e, e -> m, m -> m, m -> a, a -> .
\`\`\`

The start token tells the model "a new name is beginning." The end token tells it "this name is done." This is how the model knows when to stop generating.

### Character-to-Integer Mapping

Neural networks work with numbers, not characters. We create a mapping:

\`\`\`python
chars = sorted(list(set(''.join(words))))
stoi = {s: i+1 for i, s in enumerate(chars)}
stoi['.'] = 0
itos = {i: s for s, i in stoi.items()}
print(itos)
# {0: '.', 1: 'a', 2: 'b', ..., 26: 'z'}
\`\`\`

### What Makes a Good Language Model?

A good model assigns **high probability** to sequences that look real and **low probability** to sequences that look like nonsense. We measure this with **negative log likelihood**:

\`\`\`
NLL = -mean(log(P(next_char | context)))
\`\`\`

Lower NLL means the model is better at predicting. A perfect model that always guesses correctly would have NLL = 0. A model that assigns equal probability to all characters would have NLL = log(27) = 3.30.

### The Roadmap for This Module

1. **Counting bigrams** — the simplest possible language model (no neural network)
2. **PyTorch tensors** — the tools we need for the neural approach
3. **Neural bigram** — replicating the counting approach with a neural network
4. **Sampling and evaluation** — generating text and measuring quality

### Key Takeaway

Language modeling is about learning the statistical patterns in text. We start with the simplest case — predicting the next character from a single previous character. This is called a **bigram model**, and it forms the foundation for understanding everything up to GPT.`,
    },
    {
      id: "nn-bigram-counting",
      slug: "bigram-model",
      title: "Bigram Model",
      content: `## The Bigram Model

A bigram model predicts the next character using only the **immediately preceding character**. Despite its simplicity, it captures real patterns: 'q' is almost always followed by 'u', names rarely start with 'x', and so on.

### Counting Bigrams

The simplest approach: count how many times each character pair appears, then normalize to get probabilities.

\`\`\`python
import torch

# Count all bigrams
N = torch.zeros((27, 27), dtype=torch.int32)

for w in words:
    chs = ['.'] + list(w) + ['.']
    for ch1, ch2 in zip(chs, chs[1:]):
        ix1 = stoi[ch1]
        ix2 = stoi[ch2]
        N[ix1, ix2] += 1
\`\`\`

\`N[i][j]\` stores how many times character \`j\` followed character \`i\` in the training data.

### Visualizing the Count Matrix

\`\`\`python
import matplotlib.pyplot as plt

plt.figure(figsize=(16, 16))
plt.imshow(N, cmap='Blues')
for i in range(27):
    for j in range(27):
        chstr = itos[i] + itos[j]
        plt.text(j, i, chstr, ha='center', va='bottom')
        plt.text(j, i, N[i, j].item(), ha='center', va='top', fontsize=8)
plt.axis('off')
\`\`\`

You will see that some cells are very bright (common bigrams like 'an', 'er', 'th') and many cells are dark or zero (rare combinations like 'qz', 'xx').

### Converting Counts to Probabilities

To get a probability distribution, normalize each row to sum to 1:

\`\`\`python
P = (N + 1).float()  # Add 1 for smoothing (avoid zero probabilities)
P = P / P.sum(dim=1, keepdim=True)
\`\`\`

Now \`P[i][j]\` is the probability of character \`j\` following character \`i\`. Each row sums to 1.0.

The \`+1\` is called **Laplace smoothing** (or add-one smoothing). Without it, any unseen bigram would have probability zero, which would cause the log-likelihood to become negative infinity.

### Sampling from the Model

To generate a name, start with the start token and repeatedly sample the next character:

\`\`\`python
g = torch.Generator().manual_seed(2147483647)

for _ in range(10):
    ix = 0  # Start token
    name = []
    while True:
        p = P[ix]
        ix = torch.multinomial(p, num_samples=1, replacement=True, generator=g).item()
        if ix == 0:
            break  # End token
        name.append(itos[ix])
    print(''.join(name))
\`\`\`

Sample output might look like: \`mor\`, \`axx\`, \`minaymorede\`, \`kondlede\`. Not great, but recognizably name-like!

### Evaluating with Negative Log Likelihood

\`\`\`python
log_likelihood = 0.0
n = 0

for w in words:
    chs = ['.'] + list(w) + ['.']
    for ch1, ch2 in zip(chs, chs[1:]):
        ix1, ix2 = stoi[ch1], stoi[ch2]
        prob = P[ix1, ix2]
        logprob = torch.log(prob)
        log_likelihood += logprob
        n += 1

nll = -log_likelihood / n
print(f"Negative log likelihood: {nll:.4f}")
# Typically around 2.45
\`\`\`

This gives us a baseline: 2.45. Any neural network we build should beat this to be worthwhile.

### Key Takeaway

The bigram counting model is our baseline. It is simple, interpretable, and fast. The neural network version (coming in a few lessons) will learn the same probability table through gradient descent — but it will generalize to contexts larger than a single character, which counting cannot easily do.`,
      starterCode: `import torch

# Create character mappings
words = ['emma', 'olivia', 'ava', 'isabella', 'sophia',
         'mia', 'charlotte', 'amelia', 'harper', 'evelyn']

chars = sorted(list(set(''.join(words))))
stoi = {s: i+1 for i, s in enumerate(chars)}
stoi['.'] = 0
itos = {i: s for s, i in stoi.items()}

vocab_size = len(itos)
print(f"Vocabulary size: {vocab_size}")

# TODO: Count all bigrams into a matrix N
N = torch.zeros((vocab_size, vocab_size), dtype=torch.int32)

for w in words:
    chs = ['.'] + list(w) + ['.']
    # TODO: Count each bigram pair
    pass

# TODO: Convert counts to probabilities (with smoothing)
# P = ...

# TODO: Sample 5 names from the model
`,
      solutionCode: `import torch

words = ['emma', 'olivia', 'ava', 'isabella', 'sophia',
         'mia', 'charlotte', 'amelia', 'harper', 'evelyn']

chars = sorted(list(set(''.join(words))))
stoi = {s: i+1 for i, s in enumerate(chars)}
stoi['.'] = 0
itos = {i: s for s, i in stoi.items()}

vocab_size = len(itos)
print(f"Vocabulary size: {vocab_size}")

# Count all bigrams
N = torch.zeros((vocab_size, vocab_size), dtype=torch.int32)
for w in words:
    chs = ['.'] + list(w) + ['.']
    for ch1, ch2 in zip(chs, chs[1:]):
        ix1 = stoi[ch1]
        ix2 = stoi[ch2]
        N[ix1, ix2] += 1

# Convert to probabilities with smoothing
P = (N + 1).float()
P = P / P.sum(dim=1, keepdim=True)

# Sample 5 names
g = torch.Generator().manual_seed(42)
for _ in range(5):
    ix = 0
    name = []
    while True:
        p = P[ix]
        ix = torch.multinomial(p, num_samples=1, replacement=True, generator=g).item()
        if ix == 0:
            break
        name.append(itos[ix])
    print(''.join(name))
`,
    },
    {
      id: "nn-bigram-pytorch-tensors",
      slug: "pytorch-tensors-broadcasting",
      title: "PyTorch Tensors & Broadcasting",
      content: `## PyTorch Tensors & Broadcasting

Before building a neural bigram model, we need to understand PyTorch tensors — the multi-dimensional arrays that are the workhorses of deep learning.

### Creating Tensors

\`\`\`python
import torch

# From Python lists
a = torch.tensor([1, 2, 3])
b = torch.tensor([[1, 2], [3, 4], [5, 6]])

# Special constructors
zeros = torch.zeros(3, 4)        # 3x4 matrix of zeros
ones = torch.ones(2, 3)          # 2x3 matrix of ones
rand = torch.randn(5, 10)       # 5x10 matrix of random normals
arange = torch.arange(27)       # [0, 1, 2, ..., 26]
\`\`\`

### Key Tensor Properties

\`\`\`python
t = torch.randn(3, 4, 5)
print(t.shape)    # torch.Size([3, 4, 5])
print(t.dtype)    # torch.float32
print(t.device)   # cpu (or cuda:0 if on GPU)
print(t.ndim)     # 3
\`\`\`

### Indexing

PyTorch indexing follows NumPy conventions:

\`\`\`python
t = torch.tensor([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

t[0]        # First row: tensor([1, 2, 3])
t[:, 1]     # Second column: tensor([2, 5, 8])
t[0:2, 1:]  # Rows 0-1, columns 1+: tensor([[2, 3], [5, 6]])
t[t > 5]    # Boolean indexing: tensor([6, 7, 8, 9])
\`\`\`

### Integer Array Indexing (Critical for Embeddings)

This is used constantly in language models:

\`\`\`python
W = torch.randn(27, 10)  # 27 characters, each embedded in 10 dimensions
indices = torch.tensor([5, 13, 1])  # Characters 'e', 'm', 'a'
embeddings = W[indices]   # Shape: (3, 10) — pulls out 3 rows
\`\`\`

This is equivalent to a **lookup table** or **embedding layer**. Instead of one-hot encoding and matrix multiplication, we just index directly.

### Broadcasting Rules

When operating on tensors of different shapes, PyTorch **broadcasts** — automatically expanding dimensions to make shapes compatible.

The rules:
1. Align dimensions from the right
2. Dimensions must either match or one of them must be 1
3. A dimension of size 1 is "stretched" to match the other

\`\`\`python
a = torch.tensor([[1], [2], [3]])  # Shape: (3, 1)
b = torch.tensor([10, 20, 30])     # Shape: (3,)

c = a + b
# a is (3, 1), b is broadcast to (1, 3), then both become (3, 3)
# Result:
# tensor([[11, 21, 31],
#         [12, 22, 32],
#         [13, 23, 33]])
\`\`\`

### Broadcasting in Practice: Row Normalization

This pattern appears everywhere in language models:

\`\`\`python
counts = torch.tensor([[5.0, 3.0, 2.0],
                        [1.0, 8.0, 1.0]])

# Normalize each row to sum to 1
row_sums = counts.sum(dim=1, keepdim=True)  # Shape: (2, 1)
probs = counts / row_sums                    # Broadcasting! (2, 3) / (2, 1)
# Result: each row sums to 1.0
\`\`\`

The \`keepdim=True\` is essential — without it, \`row_sums\` would have shape \`(2,)\` instead of \`(2, 1)\`, and broadcasting would produce the wrong result.

### One-Hot Encoding

Converting integer labels to vectors:

\`\`\`python
import torch.nn.functional as F

indices = torch.tensor([3, 7, 0])
one_hot = F.one_hot(indices, num_classes=27).float()
# Shape: (3, 27) — each row is all zeros except a 1 at the index position
\`\`\`

One-hot encoding is important for the neural bigram model because it converts characters into vectors that can be multiplied by weight matrices.

### GPU Acceleration

\`\`\`python
if torch.cuda.is_available():
    t = t.to('cuda')     # Move to GPU
    t = t.to('cpu')      # Move back to CPU
\`\`\`

### Key Takeaway

Tensors are the universal data structure of deep learning. Master indexing and broadcasting, and you will be able to read and write any neural network code. The most important skill: being able to predict the shape of a tensor after each operation.`,
    },
    {
      id: "nn-bigram-neural",
      slug: "training-neural-bigram",
      title: "Training a Neural Bigram",
      content: `## Training a Neural Bigram Model

Now we rebuild the bigram model as a neural network. The result will be mathematically equivalent to the counting approach, but the neural version generalizes to bigger architectures.

### The Architecture

The neural bigram model is just one linear layer:

\`\`\`
input (one-hot, 27 dims) -> Linear(27, 27) -> softmax -> probabilities (27 dims)
\`\`\`

The weight matrix \`W\` has shape (27, 27) — one row per input character, one column per output character. After training, \`W\` will approximate the log-counts from our counting model.

### Building the Training Set

\`\`\`python
import torch
import torch.nn.functional as F

# Build dataset of bigrams
xs, ys = [], []
for w in words:
    chs = ['.'] + list(w) + ['.']
    for ch1, ch2 in zip(chs, chs[1:]):
        xs.append(stoi[ch1])
        ys.append(stoi[ch2])

xs = torch.tensor(xs)
ys = torch.tensor(ys)
num = xs.nelement()
print(f"Number of bigrams: {num}")
\`\`\`

### Forward Pass: From Integers to Probabilities

\`\`\`python
# Initialize weights
W = torch.randn((27, 27), requires_grad=True)

# One-hot encode the inputs
xenc = F.one_hot(xs, num_classes=27).float()  # Shape: (N, 27)

# Matrix multiply to get logits
logits = xenc @ W  # Shape: (N, 27)

# Softmax to get probabilities
counts = logits.exp()
probs = counts / counts.sum(dim=1, keepdim=True)
\`\`\`

The softmax converts raw scores (logits) into a valid probability distribution. Each row of \`probs\` sums to 1.

### The Loss Function: Cross-Entropy

We want to maximize the probability assigned to the correct next character. Equivalently, we minimize the **negative log likelihood**:

\`\`\`python
# For each bigram, grab the probability assigned to the correct next char
loss = -probs[torch.arange(num), ys].log().mean()
print(f"Loss: {loss.item():.4f}")
\`\`\`

This is exactly **cross-entropy loss**. PyTorch provides \`F.cross_entropy(logits, ys)\` which is numerically more stable, but the manual version helps you understand what is happening.

### Regularization

To prevent overfitting, we add a regularization term that penalizes large weights:

\`\`\`python
loss = -probs[torch.arange(num), ys].log().mean() + 0.01 * (W**2).mean()
\`\`\`

This is **L2 regularization** (weight decay). It keeps weights small, which acts like the smoothing we used in the counting model.

### The Training Loop

\`\`\`python
W = torch.randn((27, 27), requires_grad=True)

for step in range(200):
    # Forward pass
    xenc = F.one_hot(xs, num_classes=27).float()
    logits = xenc @ W
    counts = logits.exp()
    probs = counts / counts.sum(dim=1, keepdim=True)
    loss = -probs[torch.arange(num), ys].log().mean() + 0.01 * (W**2).mean()

    # Backward pass
    W.grad = None  # Zero gradients (PyTorch style)
    loss.backward()

    # Update
    W.data += -50.0 * W.grad  # Learning rate = 50 (large because one-hot is sparse)

    if step % 20 == 0:
        print(f"Step {step}, Loss: {loss.item():.4f}")
\`\`\`

### Sampling from the Neural Model

\`\`\`python
g = torch.Generator().manual_seed(2147483647)

for _ in range(10):
    ix = 0
    name = []
    while True:
        xenc = F.one_hot(torch.tensor([ix]), num_classes=27).float()
        logits = xenc @ W
        counts = logits.exp()
        p = counts / counts.sum(dim=1, keepdim=True)
        ix = torch.multinomial(p, num_samples=1, replacement=True, generator=g).item()
        if ix == 0:
            break
        name.append(itos[ix])
    print(''.join(name))
\`\`\`

The generated names should be similar quality to the counting model — because they are learning the same bigram distribution.

### Why Bother with Neural Networks?

If the result is the same, why use a neural network? Because the neural framework **scales**:
- Counting: context = 1 character, memory = O(V^2)
- Counting: context = 5 characters, memory = O(V^6) — impossible!
- Neural: context = 5 characters, just add more parameters — works fine

### Key Takeaway

The neural bigram model replaces the count table with a weight matrix learned through gradient descent. The predictions are equivalent, but the neural approach scales to much larger contexts — which is exactly what we will do in the next modules with MLPs and transformers.`,
      starterCode: `import torch
import torch.nn.functional as F

words = ['emma', 'olivia', 'ava', 'isabella', 'sophia',
         'mia', 'charlotte', 'amelia', 'harper', 'evelyn']

chars = sorted(list(set(''.join(words))))
stoi = {s: i+1 for i, s in enumerate(chars)}
stoi['.'] = 0
itos = {i: s for s, i in stoi.items()}
vocab_size = len(itos)

# Build training set
xs, ys = [], []
for w in words:
    chs = ['.'] + list(w) + ['.']
    for ch1, ch2 in zip(chs, chs[1:]):
        xs.append(stoi[ch1])
        ys.append(stoi[ch2])
xs = torch.tensor(xs)
ys = torch.tensor(ys)
num = xs.nelement()

# TODO: Initialize weight matrix W (vocab_size x vocab_size)
# TODO: Training loop for 200 steps
#   - One-hot encode xs
#   - Compute logits = xenc @ W
#   - Softmax to get probabilities
#   - Compute cross-entropy loss
#   - Backward and update
`,
      solutionCode: `import torch
import torch.nn.functional as F

words = ['emma', 'olivia', 'ava', 'isabella', 'sophia',
         'mia', 'charlotte', 'amelia', 'harper', 'evelyn']

chars = sorted(list(set(''.join(words))))
stoi = {s: i+1 for i, s in enumerate(chars)}
stoi['.'] = 0
itos = {i: s for s, i in stoi.items()}
vocab_size = len(itos)

# Build training set
xs, ys = [], []
for w in words:
    chs = ['.'] + list(w) + ['.']
    for ch1, ch2 in zip(chs, chs[1:]):
        xs.append(stoi[ch1])
        ys.append(stoi[ch2])
xs = torch.tensor(xs)
ys = torch.tensor(ys)
num = xs.nelement()

# Initialize weights
W = torch.randn((vocab_size, vocab_size), requires_grad=True)

# Training loop
for step in range(200):
    xenc = F.one_hot(xs, num_classes=vocab_size).float()
    logits = xenc @ W
    counts = logits.exp()
    probs = counts / counts.sum(dim=1, keepdim=True)
    loss = -probs[torch.arange(num), ys].log().mean() + 0.01 * (W**2).mean()

    W.grad = None
    loss.backward()
    W.data += -50.0 * W.grad

    if step % 20 == 0:
        print(f"Step {step}, Loss: {loss.item():.4f}")

# Sample names
g = torch.Generator().manual_seed(42)
print("\\nGenerated names:")
for _ in range(5):
    ix = 0
    name = []
    while True:
        xenc = F.one_hot(torch.tensor([ix]), num_classes=vocab_size).float()
        logits = xenc @ W
        counts = logits.exp()
        p = counts / counts.sum(dim=1, keepdim=True)
        ix = torch.multinomial(p, num_samples=1, replacement=True, generator=g).item()
        if ix == 0:
            break
        name.append(itos[ix])
    print(''.join(name))
`,
    },
    {
      id: "nn-bigram-sampling-eval",
      slug: "sampling-and-evaluation",
      title: "Sampling & Evaluation",
      content: `## Sampling & Evaluation

How do we know if our language model is any good? We need principled ways to **sample** from the model and **evaluate** its quality.

### Sampling Strategies

**Greedy sampling** always picks the most probable next character:

\`\`\`python
# Greedy: always take the argmax
ix = torch.argmax(probs, dim=1).item()
\`\`\`

The problem: greedy sampling produces repetitive, boring output. It always generates the single most common name.

**Random sampling** draws from the full distribution:

\`\`\`python
# Random: sample according to probabilities
ix = torch.multinomial(probs, num_samples=1).item()
\`\`\`

This gives diverse output that reflects the training distribution.

**Temperature scaling** controls the randomness:

\`\`\`python
# Temperature: scale logits before softmax
temperature = 0.5  # Lower = more conservative, higher = more random
scaled_logits = logits / temperature
probs = F.softmax(scaled_logits, dim=1)
ix = torch.multinomial(probs, num_samples=1).item()
\`\`\`

| Temperature | Effect | Names |
|------------|--------|-------|
| 0.1 | Nearly greedy | anna, anna, anna |
| 1.0 | Normal | anna, mia, charlotte |
| 2.0 | Very random | xqpmz, aoeui, zzk |

### Evaluation: Negative Log Likelihood

The standard metric for language models is **negative log likelihood (NLL)**, also called **cross-entropy loss**:

\`\`\`python
def evaluate(model_probs, words):
    log_likelihood = 0.0
    n = 0
    for w in words:
        chs = ['.'] + list(w) + ['.']
        for ch1, ch2 in zip(chs, chs[1:]):
            ix1, ix2 = stoi[ch1], stoi[ch2]
            prob = model_probs[ix1, ix2]
            log_likelihood += torch.log(prob)
            n += 1
    return -log_likelihood / n
\`\`\`

### Interpreting NLL

The NLL has an intuitive interpretation: it is the average number of bits needed to encode the next character, using the model's predictions as a code.

| NLL | Meaning |
|-----|---------|
| 3.30 | Random guessing among 27 characters |
| 2.45 | Bigram counting model |
| 2.10 | Good neural model with larger context |
| 0.00 | Perfect prediction (impossible for real data) |

### Train/Validation/Test Split

To check if the model **generalizes** (works on names it has not seen), we split the data:

\`\`\`python
import random
random.shuffle(words)

n1 = int(0.8 * len(words))
n2 = int(0.9 * len(words))

train_words = words[:n1]      # 80% for training
val_words = words[n1:n2]      # 10% for validation (tuning)
test_words = words[n2:]       # 10% for final evaluation
\`\`\`

Rules:
- **Train** on train_words only
- **Tune hyperparameters** (learning rate, etc.) using val_words
- **Report final performance** on test_words (evaluate once, at the very end)

If train NLL is much lower than val NLL, the model is **overfitting** — memorizing training data rather than learning general patterns.

### Perplexity

Another common metric is **perplexity**, which is simply \`exp(NLL)\`:

\`\`\`python
perplexity = torch.exp(nll)
\`\`\`

Perplexity has an intuitive interpretation: it is the effective number of equally likely characters the model is choosing between at each step. A perplexity of 10 means the model is, on average, as uncertain as if it were choosing between 10 equally likely options.

### Qualitative Evaluation

Numbers tell part of the story, but you should also **look at the generated samples**. Do the names look plausible? Do they follow English phonetic patterns? A model could have decent NLL but generate clearly broken output due to systematic biases.

\`\`\`python
# Generate 20 names and eyeball them
for _ in range(20):
    name = sample(model)
    print(name)
\`\`\`

### Key Takeaway

Evaluation is how we know our model is learning real patterns rather than memorizing noise. NLL gives us a single number to compare models, train/val/test splits protect against overfitting, and qualitative sampling reveals patterns that numbers miss. Always use all three.`,
    },
  ],
};
