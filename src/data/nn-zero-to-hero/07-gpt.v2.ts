import { Module } from "../types";

export const gptModule: Module = {
  id: "nn-gpt",
  title: "Building GPT from Scratch",
  description: "Implement a transformer-based language model from scratch. Based on Karpathy's 'Let's build GPT: from scratch, in code, spelled out' (https://www.youtube.com/watch?v=kCc8FmEb1nY) and the paper 'Attention is All You Need' (https://arxiv.org/abs/1706.03762).",
  lessons: [
    {
      id: "nn-gpt-attention-paper",
      slug: "attention-is-all-you-need",
      title: "Attention is All You Need",
      content: `## Attention is All You Need

> **Lecture Resource:** [Let's build GPT: from scratch, in code, spelled out](https://www.youtube.com/watch?v=kCc8FmEb1nY) by Andrej Karpathy
> **Paper:** [Attention is All You Need](https://arxiv.org/abs/1706.03762) by Vaswani et al., 2017

The transformer architecture, introduced in the "Attention is All You Need" paper, replaced recurrent networks as the dominant architecture for sequence modeling. Every major language model — GPT, BERT, Claude, Llama — is based on transformers.

### The Key Innovation: Self-Attention

Before transformers, sequence models (RNNs, LSTMs) processed tokens one at a time, left to right. Information about early tokens had to survive through many sequential steps to influence predictions about later tokens.

Self-attention allows every token to **directly attend to every other token** in a single step. A token at position 100 can directly access information from position 1, without the signal degrading through 99 intermediate steps.

### The Transformer Architecture (High Level)

\`\`\`
Input Tokens
    ↓
Token Embedding + Positional Encoding
    ↓
┌─────────────────────┐
│ Transformer Block    │ × N layers
│  ├─ Self-Attention   │
│  ├─ Add & Norm       │
│  ├─ Feed-Forward     │
│  └─ Add & Norm       │
└─────────────────────┘
    ↓
Linear → Softmax → Predictions
\`\`\`

### The Transformer Block

Each block has two sub-layers:

1. **Multi-head self-attention** — tokens communicate with each other
2. **Position-wise feed-forward network** — tokens process information independently

Both sub-layers use **residual connections** and **layer normalization**:

\`\`\`python
# Pseudocode for one transformer block
x = x + self_attention(layer_norm(x))    # Communication
x = x + feed_forward(layer_norm(x))      # Computation
\`\`\`

### Encoder vs. Decoder

The original paper had both an encoder (for input) and a decoder (for output). For language modeling (GPT-style), we only need the **decoder**:

| Architecture | Attention Type | Use Case |
|-------------|---------------|----------|
| Encoder-only | Bidirectional (sees all tokens) | BERT, classification |
| Decoder-only | Causal (sees only past tokens) | GPT, text generation |
| Encoder-Decoder | Both | Translation, T5 |

For our GPT, we use **causal (masked) self-attention**: each token can only attend to tokens at the same or earlier positions.

### Scale of Transformers

| Model | Layers | Hidden Size | Heads | Parameters |
|-------|--------|-------------|-------|------------|
| Our GPT | 6 | 384 | 6 | ~10M |
| GPT-2 Small | 12 | 768 | 12 | 117M |
| GPT-2 Large | 36 | 1280 | 20 | 774M |
| GPT-3 | 96 | 12288 | 96 | 175B |

The architecture is the same — it is only the scale that differs. Understanding our 10M parameter GPT means understanding GPT-3.

### What We Will Build

In this module, we implement a complete GPT from scratch:
1. Self-attention mechanism (this is the hard part)
2. Multi-head attention (parallelism)
3. Transformer block (attention + feed-forward + residual + norm)
4. Positional encoding (so the model knows token order)
5. Training loop and text generation

### Key Takeaway

The transformer replaced sequential processing with parallel attention, enabling much faster training and much better performance on language tasks. The architecture is elegant: just stack identical blocks of attention + feed-forward, connected by residual connections and layer normalization.`,
    },
    {
      id: "nn-gpt-self-attention",
      slug: "self-attention-mechanism",
      title: "Self-Attention Mechanism",
      content: `## Self-Attention Mechanism

Self-attention is the core innovation of the transformer. It allows each token to look at all other tokens and decide which ones are relevant for its prediction.

### The Intuition

Consider the sentence: "The cat sat on the mat because it was tired."

What does "it" refer to? To answer this, the model needs to connect "it" back to "cat." Self-attention does exactly this: it computes a **relevance score** between every pair of tokens and uses those scores to create a weighted combination of information.

### Queries, Keys, and Values

Self-attention uses three projections of each token:

- **Query (Q):** "What am I looking for?"
- **Key (K):** "What do I contain?"
- **Value (V):** "What information do I provide?"

The attention score between tokens is the dot product of the query of one token with the key of another.

\`\`\`python
# For a single attention head
# x: (B, T, C) — B batches, T tokens, C channels

head_size = 16
key   = nn.Linear(C, head_size, bias=False)
query = nn.Linear(C, head_size, bias=False)
value = nn.Linear(C, head_size, bias=False)

k = key(x)    # (B, T, head_size)
q = query(x)  # (B, T, head_size)
v = value(x)  # (B, T, head_size)
\`\`\`

### Scaled Dot-Product Attention

\`\`\`
Attention(Q, K, V) = softmax(Q @ K.T / sqrt(d_k)) @ V
\`\`\`

Step by step:

\`\`\`python
# 1. Compute attention scores
wei = q @ k.transpose(-2, -1)  # (B, T, T)

# 2. Scale by sqrt(head_size) to prevent softmax saturation
wei = wei / (head_size ** 0.5)

# 3. Apply causal mask (prevent attending to future tokens)
tril = torch.tril(torch.ones(T, T))
wei = wei.masked_fill(tril == 0, float('-inf'))

# 4. Softmax to get attention weights (each row sums to 1)
wei = F.softmax(wei, dim=-1)  # (B, T, T)

# 5. Weighted aggregation of values
out = wei @ v  # (B, T, head_size)
\`\`\`

### Why Scale by sqrt(d_k)?

Without scaling, the dot products grow large as the head size increases. Large dot products push the softmax into regions where it produces very sharp (nearly one-hot) distributions with tiny gradients.

\`\`\`
Without scaling (head_size=64):
  dot products ~ N(0, 64) -> softmax is very peaked -> gradients vanish

With scaling:
  dot products ~ N(0, 1) -> softmax is smooth -> healthy gradients
\`\`\`

### The Causal Mask

For autoregressive language modeling, token at position \`t\` must not attend to positions \`t+1, t+2, ...\`:

\`\`\`
Mask (T=4):
1 0 0 0      Token 0 sees: [0]
1 1 0 0      Token 1 sees: [0, 1]
1 1 1 0      Token 2 sees: [0, 1, 2]
1 1 1 1      Token 3 sees: [0, 1, 2, 3]
\`\`\`

Setting masked positions to \`-inf\` before softmax ensures they get weight 0.

### Visualizing Attention Weights

The attention weight matrix tells you which tokens each position is attending to:

\`\`\`python
# After computing wei (before dropout)
plt.imshow(wei[0].detach(), cmap='hot')
plt.xlabel('Key position (attending to)')
plt.ylabel('Query position (attending from)')
plt.colorbar()
\`\`\`

### Complete Single-Head Attention

\`\`\`python
class Head(nn.Module):
    def __init__(self, head_size):
        super().__init__()
        self.key = nn.Linear(n_embd, head_size, bias=False)
        self.query = nn.Linear(n_embd, head_size, bias=False)
        self.value = nn.Linear(n_embd, head_size, bias=False)
        self.register_buffer('tril', torch.tril(torch.ones(block_size, block_size)))
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        B, T, C = x.shape
        k = self.key(x)
        q = self.query(x)
        v = self.value(x)
        wei = q @ k.transpose(-2, -1) * C**-0.5
        wei = wei.masked_fill(self.tril[:T, :T] == 0, float('-inf'))
        wei = F.softmax(wei, dim=-1)
        wei = self.dropout(wei)
        out = wei @ v
        return out
\`\`\`

### Key Takeaway

Self-attention computes relevance scores between all pairs of tokens using queries and keys, then uses those scores to create a weighted combination of values. The causal mask ensures autoregressive generation, and scaling by sqrt(d_k) keeps gradients healthy. This mechanism is the heart of every transformer.`,
      starterCode: `import torch
import torch.nn as nn
import torch.nn.functional as F

# Hyperparameters
B = 4        # Batch size
T = 8        # Sequence length
C = 32       # Embedding dimension
head_size = 16

# Random input (batch of token embeddings)
x = torch.randn(B, T, C)

# TODO: Implement single-head self-attention
# 1. Create key, query, value linear projections
# 2. Compute attention scores (Q @ K^T / sqrt(d_k))
# 3. Apply causal mask
# 4. Softmax
# 5. Weighted sum of values

# Print the output shape (should be B, T, head_size)
`,
      solutionCode: `import torch
import torch.nn as nn
import torch.nn.functional as F

B = 4
T = 8
C = 32
head_size = 16

x = torch.randn(B, T, C)

# Linear projections
key = nn.Linear(C, head_size, bias=False)
query = nn.Linear(C, head_size, bias=False)
value = nn.Linear(C, head_size, bias=False)

# Compute Q, K, V
k = key(x)    # (B, T, head_size)
q = query(x)  # (B, T, head_size)
v = value(x)  # (B, T, head_size)

# Attention scores
wei = q @ k.transpose(-2, -1) * head_size**-0.5  # (B, T, T)

# Causal mask
tril = torch.tril(torch.ones(T, T))
wei = wei.masked_fill(tril == 0, float('-inf'))

# Softmax
wei = F.softmax(wei, dim=-1)  # (B, T, T)

# Weighted aggregation
out = wei @ v  # (B, T, head_size)

print(f"Output shape: {out.shape}")  # torch.Size([4, 8, 16])
print(f"Attention weights shape: {wei.shape}")  # torch.Size([4, 8, 8])
print(f"Attention weights row sum: {wei[0, -1].sum():.4f}")  # 1.0
`,
    },
    {
      id: "nn-gpt-multi-head",
      slug: "multi-head-attention",
      title: "Multi-Head Attention",
      content: `## Multi-Head Attention

A single attention head can only focus on one type of relationship at a time. Multi-head attention runs **multiple attention heads in parallel**, each learning to attend to different aspects of the input.

### The Intuition

Consider the token "bank" in "I went to the river bank to fish." Different heads might attend to different things:
- Head 1 might learn syntactic relationships (subject-verb agreement)
- Head 2 might learn semantic relationships ("river" disambiguates "bank")
- Head 3 might learn positional patterns (nearby words matter more)

### Implementation

\`\`\`python
class MultiHeadAttention(nn.Module):
    def __init__(self, num_heads, head_size):
        super().__init__()
        self.heads = nn.ModuleList([Head(head_size) for _ in range(num_heads)])
        self.proj = nn.Linear(num_heads * head_size, n_embd)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        # Run all heads in parallel
        out = torch.cat([h(x) for h in self.heads], dim=-1)
        # Project back to embedding dimension
        out = self.dropout(self.proj(out))
        return out
\`\`\`

### How Dimensions Work

With \`n_embd = 384\` and \`num_heads = 6\`:

\`\`\`
Each head size: 384 / 6 = 64
Input: (B, T, 384)
Each head output: (B, T, 64)
Concatenated: (B, T, 384)   — back to original dimension
After projection: (B, T, 384)
\`\`\`

The total computation is the same as a single head with \`head_size = 384\`, but multi-head attention can learn **diverse attention patterns**.

### The Projection Layer

After concatenating the heads, a linear projection combines their outputs:

\`\`\`python
self.proj = nn.Linear(num_heads * head_size, n_embd)
\`\`\`

This allows the model to mix information from different heads. Without it, the heads would be completely independent.

### Efficient Implementation

In practice, the multi-head computation is done as a single matrix multiplication by reshaping:

\`\`\`python
class EfficientMultiHeadAttention(nn.Module):
    def __init__(self, n_embd, num_heads):
        super().__init__()
        assert n_embd % num_heads == 0
        self.num_heads = num_heads
        self.head_size = n_embd // num_heads

        self.qkv = nn.Linear(n_embd, 3 * n_embd, bias=False)
        self.proj = nn.Linear(n_embd, n_embd)

    def forward(self, x):
        B, T, C = x.shape

        # Compute Q, K, V all at once
        qkv = self.qkv(x)  # (B, T, 3*C)
        q, k, v = qkv.chunk(3, dim=-1)  # Each: (B, T, C)

        # Reshape for multi-head: (B, T, C) -> (B, num_heads, T, head_size)
        q = q.view(B, T, self.num_heads, self.head_size).transpose(1, 2)
        k = k.view(B, T, self.num_heads, self.head_size).transpose(1, 2)
        v = v.view(B, T, self.num_heads, self.head_size).transpose(1, 2)

        # Attention
        wei = q @ k.transpose(-2, -1) * self.head_size**-0.5
        tril = torch.tril(torch.ones(T, T, device=x.device))
        wei = wei.masked_fill(tril == 0, float('-inf'))
        wei = F.softmax(wei, dim=-1)

        out = wei @ v  # (B, num_heads, T, head_size)

        # Reshape back: (B, num_heads, T, head_size) -> (B, T, C)
        out = out.transpose(1, 2).contiguous().view(B, T, C)
        out = self.proj(out)
        return out
\`\`\`

This efficient version computes all heads with a single matrix multiplication, which is much faster on GPUs.

### The \`.transpose(1, 2)\` Trick

The reshape from \`(B, T, num_heads, head_size)\` to \`(B, num_heads, T, head_size)\` is crucial. It groups the sequence positions together within each head, so the attention computation \`q @ k.T\` operates on the \`(T, head_size)\` dimensions independently per head.

### Attention Head Specialization

After training, different heads learn different patterns. In language models:
- Some heads learn **positional patterns** (attend to adjacent tokens)
- Some heads learn **syntactic patterns** (attend to the subject/verb)
- Some heads learn **rare feature detectors** (activate on specific token combinations)

### Key Takeaway

Multi-head attention runs multiple attention mechanisms in parallel, each learning different relationships. The outputs are concatenated and projected back to the model dimension. The efficient implementation computes all heads simultaneously with a single batched matrix multiplication.`,
    },
    {
      id: "nn-gpt-transformer-block",
      slug: "transformer-block",
      title: "Transformer Block",
      content: `## The Transformer Block

A transformer block combines multi-head attention with a feed-forward network, connected by residual connections and layer normalization. It is the fundamental building block — the entire GPT model is just a stack of these blocks.

### The Architecture

\`\`\`python
class Block(nn.Module):
    def __init__(self, n_embd, n_head):
        super().__init__()
        head_size = n_embd // n_head
        self.sa = MultiHeadAttention(n_head, head_size)
        self.ffwd = FeedForward(n_embd)
        self.ln1 = nn.LayerNorm(n_embd)
        self.ln2 = nn.LayerNorm(n_embd)

    def forward(self, x):
        x = x + self.sa(self.ln1(x))    # Communication + residual
        x = x + self.ffwd(self.ln2(x))  # Computation + residual
        return x
\`\`\`

### The Two Sub-Layers

**Self-attention (communication):** Tokens exchange information with each other. After this step, each token's representation contains information from other relevant tokens.

**Feed-forward (computation):** Each token processes its information independently. This is where the model "thinks" about the combined information.

\`\`\`python
class FeedForward(nn.Module):
    def __init__(self, n_embd):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(n_embd, 4 * n_embd),
            nn.GELU(),
            nn.Linear(4 * n_embd, n_embd),
            nn.Dropout(dropout),
        )

    def forward(self, x):
        return self.net(x)
\`\`\`

The feed-forward network expands the dimension by 4x, applies a non-linearity (GELU), and projects back down. The 4x expansion gives the model more capacity to compute complex functions.

### GELU Activation

Modern transformers use GELU (Gaussian Error Linear Unit) instead of ReLU:

\`\`\`
GELU(x) = x * Phi(x)
\`\`\`

Where Phi is the cumulative distribution function of the standard normal. Unlike ReLU, GELU is smooth and does not have a hard zero cutoff, which helps gradient flow.

### Layer Normalization (Not Batch Normalization)

Transformers use **Layer Normalization** instead of Batch Normalization:

\`\`\`python
# BatchNorm: normalize across the batch dimension
# LayerNorm: normalize across the feature dimension

# For input x of shape (B, T, C):
# BatchNorm: normalize over B (and T) for each feature
# LayerNorm: normalize over C for each (batch, position)
\`\`\`

| Property | BatchNorm | LayerNorm |
|----------|-----------|-----------|
| Normalizes across | Batch | Features |
| Depends on batch size | Yes | No |
| Training/eval difference | Yes | No |
| Works with batch size 1 | No | Yes |

Layer normalization is simpler, has no training/eval mode distinction, and works with any batch size.

### Pre-Norm vs. Post-Norm

The original transformer paper used **post-norm**:
\`\`\`python
x = LayerNorm(x + Sublayer(x))
\`\`\`

Modern practice (including GPT) uses **pre-norm**:
\`\`\`python
x = x + Sublayer(LayerNorm(x))
\`\`\`

Pre-norm is more stable during training because the residual path is completely clean — no normalization interferes with the gradient highway.

### Residual Connections: The Gradient Highway

Without residual connections, gradients must pass through every attention and feed-forward layer. With them, there is a direct path from the loss to any layer:

\`\`\`
Loss
  ↓
Block N output = Block N input + Attention(LN(Block N input)) + FF(LN(...))
  ↓ (gradient flows directly through the '+')
Block N-1 output
  ↓
...
Block 1 output
  ↓
Embeddings
\`\`\`

The gradient of the loss with respect to the embeddings includes a term that passes through **no** transformations — just addition. This is why transformers can be stacked very deep.

### Stacking Blocks

\`\`\`python
self.blocks = nn.Sequential(*[Block(n_embd, n_head) for _ in range(n_layer)])
\`\`\`

Each block refines the representations. Early blocks tend to learn local, syntactic patterns. Later blocks learn more abstract, semantic patterns.

### Key Takeaway

The transformer block is the atom of modern language models. It alternates between communication (attention) and computation (feed-forward), with residual connections and layer normalization ensuring stable training. Stack enough of these blocks, and you get GPT.`,
    },
    {
      id: "nn-gpt-positional-encoding",
      slug: "positional-encoding",
      title: "Positional Encoding",
      content: `## Positional Encoding

Self-attention is **permutation invariant** — it treats tokens as a set, not a sequence. Without positional information, "the cat sat on the mat" would be indistinguishable from "mat the on sat cat the." Positional encoding injects order information.

### Why Attention Needs Position

In our MLP, position was implicit — the first embedding slot was always the first context character. In attention, every token attends to every other token through content-based matching (Q @ K). There is no inherent notion of "position 3 is before position 7."

### Learned Positional Embeddings (GPT Style)

The simplest approach: learn a separate embedding for each position.

\`\`\`python
class GPT(nn.Module):
    def __init__(self):
        super().__init__()
        self.token_embedding = nn.Embedding(vocab_size, n_embd)
        self.position_embedding = nn.Embedding(block_size, n_embd)
        self.blocks = nn.Sequential(*[Block(n_embd, n_head) for _ in range(n_layer)])
        self.ln_f = nn.LayerNorm(n_embd)
        self.lm_head = nn.Linear(n_embd, vocab_size)

    def forward(self, idx, targets=None):
        B, T = idx.shape

        # Token embeddings + position embeddings
        tok_emb = self.token_embedding(idx)                    # (B, T, C)
        pos_emb = self.position_embedding(torch.arange(T))     # (T, C)
        x = tok_emb + pos_emb                                  # (B, T, C) — broadcasting

        x = self.blocks(x)
        x = self.ln_f(x)
        logits = self.lm_head(x)                               # (B, T, vocab_size)

        if targets is None:
            loss = None
        else:
            B, T, C = logits.shape
            logits = logits.view(B*T, C)
            targets = targets.view(B*T)
            loss = F.cross_entropy(logits, targets)

        return logits, loss
\`\`\`

### Sinusoidal Positional Encoding (Original Transformer)

The original paper used fixed sinusoidal functions instead of learned embeddings:

\`\`\`
PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
\`\`\`

\`\`\`python
def sinusoidal_encoding(max_len, d_model):
    pe = torch.zeros(max_len, d_model)
    position = torch.arange(0, max_len).unsqueeze(1).float()
    div_term = torch.exp(torch.arange(0, d_model, 2).float() *
                         -(math.log(10000.0) / d_model))
    pe[:, 0::2] = torch.sin(position * div_term)
    pe[:, 1::2] = torch.cos(position * div_term)
    return pe
\`\`\`

### Sinusoidal vs. Learned

| Property | Sinusoidal | Learned |
|----------|-----------|---------|
| Extrapolation | Can generalize to longer sequences | Limited to trained length |
| Parameters | Zero | block_size * n_embd |
| Performance | Slightly worse | Slightly better |
| Simplicity | Fixed, no training needed | Requires training |

GPT-2 and GPT-3 use learned embeddings. The original transformer used sinusoidal. For our implementation, learned embeddings are simpler and work well.

### Relative Positional Encoding

Modern architectures (ALiBi, RoPE) encode **relative** positions (distance between tokens) rather than absolute positions:

\`\`\`
Standard: token at position 5 always gets the same position embedding
Relative: attention score between positions 5 and 3 depends on their distance (2)
\`\`\`

Relative encodings handle variable-length sequences better and are used in LLaMA, Mistral, and other recent models.

### The Maximum Context Length

Positional encoding imposes a maximum sequence length:

\`\`\`python
block_size = 256  # Our GPT can handle sequences up to 256 tokens
self.position_embedding = nn.Embedding(block_size, n_embd)
\`\`\`

During generation, we must truncate the context to the last \`block_size\` tokens:

\`\`\`python
# During generation
context = context[:, -block_size:]  # Keep only the last block_size tokens
\`\`\`

### Key Takeaway

Positional encoding injects order information into the permutation-invariant attention mechanism. Learned embeddings are simple and effective for fixed-length contexts. The position embedding is simply added to the token embedding — the model learns to use both content and position information for its attention computations.`,
    },
    {
      id: "nn-gpt-training",
      slug: "training-gpt",
      title: "Training GPT",
      content: `## Training GPT

Now we put everything together: a complete GPT model that we can train on text data and use to generate new text.

### The Complete Model

\`\`\`python
import torch
import torch.nn as nn
import torch.nn.functional as F

# Hyperparameters
batch_size = 64
block_size = 256
max_iters = 5000
eval_interval = 500
learning_rate = 3e-4
device = 'cuda' if torch.cuda.is_available() else 'cpu'
eval_iters = 200
n_embd = 384
n_head = 6
n_layer = 6
dropout = 0.2
\`\`\`

### Data Preparation

\`\`\`python
# Read text file
with open('input.txt', 'r') as f:
    text = f.read()

# Character-level tokenization
chars = sorted(list(set(text)))
vocab_size = len(chars)
stoi = {ch: i for i, ch in enumerate(chars)}
itos = {i: ch for i, ch in enumerate(chars)}
encode = lambda s: [stoi[c] for c in s]
decode = lambda l: ''.join([itos[i] for i in l])

# Train/val split
data = torch.tensor(encode(text), dtype=torch.long)
n = int(0.9 * len(data))
train_data = data[:n]
val_data = data[n:]

# Batch loader
def get_batch(split):
    data = train_data if split == 'train' else val_data
    ix = torch.randint(len(data) - block_size, (batch_size,))
    x = torch.stack([data[i:i+block_size] for i in ix])
    y = torch.stack([data[i+1:i+block_size+1] for i in ix])
    return x.to(device), y.to(device)
\`\`\`

### The Training Loop

\`\`\`python
model = GPT().to(device)
print(f"Parameters: {sum(p.numel() for p in model.parameters()) / 1e6:.2f}M")

optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate)

for iter in range(max_iters):
    # Evaluate periodically
    if iter % eval_interval == 0:
        model.eval()
        losses = {}
        for split in ['train', 'val']:
            batch_losses = []
            for _ in range(eval_iters):
                X, Y = get_batch(split)
                _, loss = model(X, Y)
                batch_losses.append(loss.item())
            losses[split] = sum(batch_losses) / len(batch_losses)
        print(f"Step {iter}: train loss {losses['train']:.4f}, val loss {losses['val']:.4f}")
        model.train()

    # Training step
    xb, yb = get_batch('train')
    logits, loss = model(xb, yb)
    optimizer.zero_grad(set_to_none=True)
    loss.backward()
    optimizer.step()
\`\`\`

### Text Generation

\`\`\`python
@torch.no_grad()
def generate(model, idx, max_new_tokens):
    """Generate text autoregressively."""
    model.eval()
    for _ in range(max_new_tokens):
        # Crop context to block_size
        idx_cond = idx[:, -block_size:]
        # Get predictions
        logits, _ = model(idx_cond)
        # Focus on the last time step
        logits = logits[:, -1, :]  # (B, vocab_size)
        # Sample from the distribution
        probs = F.softmax(logits, dim=-1)
        idx_next = torch.multinomial(probs, num_samples=1)  # (B, 1)
        # Append to the running sequence
        idx = torch.cat((idx, idx_next), dim=1)  # (B, T+1)
    return idx

# Generate text
context = torch.zeros((1, 1), dtype=torch.long, device=device)
generated = generate(model, context, max_new_tokens=500)
print(decode(generated[0].tolist()))
\`\`\`

### Training Dynamics

A typical training run looks like:

\`\`\`
Step 0:    train loss 4.2186, val loss 4.2206  (random guessing)
Step 500:  train loss 2.0321, val loss 2.1087  (learning structure)
Step 1000: train loss 1.6843, val loss 1.8276  (improving)
Step 2500: train loss 1.3127, val loss 1.5241  (gap growing = overfitting)
Step 5000: train loss 1.0824, val loss 1.4892  (convergence)
\`\`\`

### Key Training Details

**AdamW optimizer:** Uses momentum and adaptive learning rates per parameter. The "W" means proper weight decay (not L2 regularization — they differ for Adam).

**Learning rate:** 3e-4 is a common starting point for transformers. Larger models often use warmup + cosine decay.

**Dropout:** Applied after attention weights and in the feed-forward network. Helps prevent overfitting.

**set_to_none=True:** More efficient than zeroing gradients — sets them to None instead of filling with zeros.

### What the Model Learns

After training on Shakespeare:
\`\`\`
Generated text (early training):
"tHe xKjZ  mN qP"  — random characters

Generated text (mid training):
"THENGIO: Whe sore dith mear"  — learning structure

Generated text (late training):
"KING HENRY: What say you, lords?
The crown of England is at stake."  — coherent dialogue
\`\`\`

### Scaling Laws

The quality of generated text improves predictably with:
1. **More parameters** — wider and deeper models
2. **More data** — larger training corpus
3. **More compute** — longer training

These relationships follow power laws (Kaplan et al., 2020), meaning you can predict performance before training.

### Key Takeaway

Training GPT is the same loop as training our micrograd MLP: forward pass, compute loss, backward pass, update parameters. The magic is in the architecture (transformer blocks with attention) and the scale (millions of parameters, trained on large text corpora). You now understand every component, from the Value class to the full GPT.`,
      starterCode: `import torch
import torch.nn as nn
import torch.nn.functional as F

# Hyperparameters
batch_size = 16
block_size = 32
n_embd = 64
n_head = 4
n_layer = 4
dropout = 0.0
vocab_size = 27  # Character-level

# TODO: Implement the Head class (single attention head)
class Head(nn.Module):
    def __init__(self, head_size):
        super().__init__()
        # TODO: key, query, value projections
        # TODO: causal mask (register_buffer)

    def forward(self, x):
        # TODO: compute attention
        pass

# TODO: Implement MultiHeadAttention
class MultiHeadAttention(nn.Module):
    def __init__(self, num_heads, head_size):
        super().__init__()
        # TODO

    def forward(self, x):
        # TODO
        pass

# TODO: Implement FeedForward
class FeedForward(nn.Module):
    def __init__(self, n_embd):
        super().__init__()
        # TODO: Linear -> GELU -> Linear -> Dropout

    def forward(self, x):
        # TODO
        pass

# TODO: Implement Block (transformer block)
class Block(nn.Module):
    def __init__(self, n_embd, n_head):
        super().__init__()
        # TODO: attention, feedforward, layernorms

    def forward(self, x):
        # TODO: x = x + sa(ln1(x)); x = x + ffwd(ln2(x))
        pass

# TODO: Implement GPT
class GPT(nn.Module):
    def __init__(self):
        super().__init__()
        # TODO: token embedding, position embedding, blocks, ln_f, lm_head

    def forward(self, idx, targets=None):
        # TODO
        pass

model = GPT()
print(f"Parameters: {sum(p.numel() for p in model.parameters())}")
`,
      solutionCode: `import torch
import torch.nn as nn
import torch.nn.functional as F

batch_size = 16
block_size = 32
n_embd = 64
n_head = 4
n_layer = 4
dropout = 0.0
vocab_size = 27

class Head(nn.Module):
    def __init__(self, head_size):
        super().__init__()
        self.key = nn.Linear(n_embd, head_size, bias=False)
        self.query = nn.Linear(n_embd, head_size, bias=False)
        self.value = nn.Linear(n_embd, head_size, bias=False)
        self.register_buffer('tril', torch.tril(torch.ones(block_size, block_size)))
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        B, T, C = x.shape
        k = self.key(x)
        q = self.query(x)
        wei = q @ k.transpose(-2, -1) * C**-0.5
        wei = wei.masked_fill(self.tril[:T, :T] == 0, float('-inf'))
        wei = F.softmax(wei, dim=-1)
        wei = self.dropout(wei)
        v = self.value(x)
        out = wei @ v
        return out

class MultiHeadAttention(nn.Module):
    def __init__(self, num_heads, head_size):
        super().__init__()
        self.heads = nn.ModuleList([Head(head_size) for _ in range(num_heads)])
        self.proj = nn.Linear(num_heads * head_size, n_embd)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        out = torch.cat([h(x) for h in self.heads], dim=-1)
        out = self.dropout(self.proj(out))
        return out

class FeedForward(nn.Module):
    def __init__(self, n_embd):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(n_embd, 4 * n_embd),
            nn.GELU(),
            nn.Linear(4 * n_embd, n_embd),
            nn.Dropout(dropout),
        )

    def forward(self, x):
        return self.net(x)

class Block(nn.Module):
    def __init__(self, n_embd, n_head):
        super().__init__()
        head_size = n_embd // n_head
        self.sa = MultiHeadAttention(n_head, head_size)
        self.ffwd = FeedForward(n_embd)
        self.ln1 = nn.LayerNorm(n_embd)
        self.ln2 = nn.LayerNorm(n_embd)

    def forward(self, x):
        x = x + self.sa(self.ln1(x))
        x = x + self.ffwd(self.ln2(x))
        return x

class GPT(nn.Module):
    def __init__(self):
        super().__init__()
        self.token_embedding = nn.Embedding(vocab_size, n_embd)
        self.position_embedding = nn.Embedding(block_size, n_embd)
        self.blocks = nn.Sequential(*[Block(n_embd, n_head) for _ in range(n_layer)])
        self.ln_f = nn.LayerNorm(n_embd)
        self.lm_head = nn.Linear(n_embd, vocab_size)

    def forward(self, idx, targets=None):
        B, T = idx.shape
        tok_emb = self.token_embedding(idx)
        pos_emb = self.position_embedding(torch.arange(T, device=idx.device))
        x = tok_emb + pos_emb
        x = self.blocks(x)
        x = self.ln_f(x)
        logits = self.lm_head(x)

        if targets is None:
            loss = None
        else:
            B, T, C = logits.shape
            logits = logits.view(B*T, C)
            targets = targets.view(B*T)
            loss = F.cross_entropy(logits, targets)

        return logits, loss

model = GPT()
print(f"Parameters: {sum(p.numel() for p in model.parameters())}")

# Quick test
x = torch.randint(0, vocab_size, (batch_size, block_size))
y = torch.randint(0, vocab_size, (batch_size, block_size))
logits, loss = model(x, y)
print(f"Logits shape: {logits.shape}")
print(f"Loss: {loss.item():.4f}")
`,
    },
  ],
};
