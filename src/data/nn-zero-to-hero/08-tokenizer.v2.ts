import { Module } from "../types";

export const tokenizerModule: Module = {
  id: "nn-tokenizer",
  title: "Tokenization & BPE",
  description: "Build a tokenizer from scratch using Byte Pair Encoding. Based on Karpathy's 'Let's build the GPT Tokenizer' (https://www.youtube.com/watch?v=zduSFxRajkE).",
  lessons: [
    {
      id: "nn-tokenizer-why",
      slug: "why-tokenization-matters",
      title: "Why Tokenization Matters",
      content: `## Why Tokenization Matters

> **Lecture Resource:** [Let's build the GPT Tokenizer](https://www.youtube.com/watch?v=zduSFxRajkE) by Andrej Karpathy

Tokenization is the process of converting raw text into the integer sequences that a language model actually processes. It is often treated as a "solved problem" or an afterthought, but Karpathy argues it is one of the most important and underappreciated aspects of LLMs.

### The Problem

Neural networks operate on numbers, not text. We need a mapping:

\`\`\`
"Hello world!" -> [15496, 995, 0]
\`\`\`

The choice of mapping has profound effects on model performance, cost, and behavior.

### Three Approaches

**Character-level:** Each character is a token.
\`\`\`
"Hello" -> [72, 101, 108, 108, 111]
Vocabulary: ~256 (one per byte)
\`\`\`

**Word-level:** Each word is a token.
\`\`\`
"Hello" -> [15496]
Vocabulary: ~50,000+
\`\`\`

**Subword-level (BPE):** Common character sequences become tokens.
\`\`\`
"Hello" -> [9906, 28]  (something like "Hel" + "lo")
Vocabulary: ~50,000 (tunable)
\`\`\`

### Why Not Characters?

Character-level tokenization has a tiny vocabulary (good!) but creates very long sequences (bad!). For the text "The transformer architecture uses self-attention":
- Characters: 47 tokens
- BPE: ~8 tokens

Attention cost is O(T^2), so 47 tokens costs ~35x more compute than 8 tokens.

### Why Not Words?

Word-level tokenization has short sequences (good!) but a massive vocabulary problem:
- Out-of-vocabulary (OOV) words: "ChatGPT" would be unknown
- Morphology blindness: "run", "running", "runs" are three unrelated tokens
- Multilingual nightmare: each language multiplies the vocabulary

### The Goldilocks Solution: Subword Tokenization

Byte Pair Encoding (BPE) finds a middle ground:
- Common words become single tokens: "the" -> [1]
- Rare words are split into pieces: "tokenization" -> ["token", "ization"]
- Any text can be encoded (no OOV problem)
- Vocabulary size is a tunable hyperparameter

### Tokenization Artifacts

Many puzzling LLM behaviors trace back to tokenization:

**Why is GPT bad at counting characters?** Because "hello" might be a single token — the model never sees individual characters.

**Why does GPT struggle with simple arithmetic?** "123456" might tokenize as ["123", "456"] — the digit boundaries do not align with token boundaries.

**Why does adding spaces change behavior?** "Hello" and " Hello" (with a leading space) are different tokens with different embeddings.

**Why is GPT worse at some languages?** Languages with non-Latin scripts get fewer merges during BPE training, resulting in longer token sequences and higher cost per word.

### Token Count = Cost

For API-based LLMs, you pay per token. Tokenization directly affects:
- Cost: more tokens = more money
- Latency: more tokens = slower generation
- Context window: more tokens = less space for content

### Key Takeaway

Tokenization is the interface between human text and neural networks. The choice of tokenizer affects model capabilities, costs, and even what kinds of tasks the model can perform. BPE provides the best balance of vocabulary size, sequence length, and coverage — which is why every major LLM uses some variant of it.`,
    },
    {
      id: "nn-tokenizer-bpe-algorithm",
      slug: "byte-pair-encoding",
      title: "Byte Pair Encoding",
      content: `## Byte Pair Encoding (BPE)

BPE was originally a data compression algorithm (Gage, 1994). Sennrich et al. (2015) adapted it for subword tokenization in NLP. It is now the foundation of tokenization in GPT, LLaMA, and most modern LLMs.

### The Core Idea

Start with individual bytes (characters). Repeatedly find the most common adjacent pair and merge them into a new token. Stop when you reach the desired vocabulary size.

### The Algorithm

\`\`\`
Input: training text, desired vocabulary size V
Start: vocabulary = all individual bytes (256 entries)

While vocabulary size < V:
    1. Count all adjacent token pairs in the corpus
    2. Find the most frequent pair
    3. Merge that pair into a new token
    4. Replace all occurrences in the corpus
    5. Add the new token to the vocabulary
\`\`\`

### Step-by-Step Example

Starting text: "aaabdaaabac"

Initial tokens: ['a', 'a', 'a', 'b', 'd', 'a', 'a', 'a', 'b', 'a', 'c']

**Iteration 1:** Most common pair is ('a', 'a') appearing 4 times.
Merge into new token 'Z' (representing "aa"):
\`\`\`
['Z', 'a', 'b', 'd', 'Z', 'a', 'b', 'a', 'c']
\`\`\`

**Iteration 2:** Most common pair is ('Z', 'a') appearing 2 times.
Merge into new token 'Y' (representing "aaa"):
\`\`\`
['Y', 'b', 'd', 'Y', 'b', 'a', 'c']
\`\`\`

**Iteration 3:** Most common pair is ('Y', 'b') appearing 2 times.
Merge into new token 'X' (representing "aaab"):
\`\`\`
['X', 'd', 'X', 'a', 'c']
\`\`\`

Each merge reduces the total number of tokens and creates a more compact representation.

### Implementation

\`\`\`python
def get_stats(ids):
    """Count all adjacent pairs in the token list."""
    counts = {}
    for pair in zip(ids, ids[1:]):
        counts[pair] = counts.get(pair, 0) + 1
    return counts

def merge(ids, pair, idx):
    """Replace all occurrences of pair with idx in the token list."""
    new_ids = []
    i = 0
    while i < len(ids):
        if i < len(ids) - 1 and ids[i] == pair[0] and ids[i+1] == pair[1]:
            new_ids.append(idx)
            i += 2
        else:
            new_ids.append(ids[i])
            i += 1
    return new_ids
\`\`\`

### Training the Tokenizer

\`\`\`python
# Start with raw bytes
text = "This is some training text for our tokenizer..."
tokens = list(text.encode("utf-8"))  # Convert to bytes

num_merges = 20  # Number of merges to perform
merges = {}      # (pair) -> new_token_id
vocab = {idx: bytes([idx]) for idx in range(256)}  # Initial vocabulary

for i in range(num_merges):
    stats = get_stats(tokens)
    if not stats:
        break
    top_pair = max(stats, key=stats.get)
    idx = 256 + i  # New token ID
    tokens = merge(tokens, top_pair, idx)
    merges[top_pair] = idx
    vocab[idx] = vocab[top_pair[0]] + vocab[top_pair[1]]
    print(f"Merge {i+1}: {top_pair} -> {idx} "
          f"({vocab[idx]}) (count: {stats[top_pair]})")
\`\`\`

### Compression Ratio

\`\`\`python
original_length = len(text.encode("utf-8"))
compressed_length = len(tokens)
ratio = original_length / compressed_length
print(f"Compression: {original_length} -> {compressed_length} ({ratio:.2f}x)")
\`\`\`

A well-trained BPE tokenizer on English text typically achieves 3-4x compression (each token represents 3-4 characters on average).

### The Merge Table

The ordered list of merges is the complete definition of the tokenizer. To tokenize new text, apply the merges in the same order they were learned:

\`\`\`
Merge table (in order):
1. ('t', 'h') -> 256
2. (256, 'e') -> 257  ("the")
3. (' ', 257) -> 258  (" the")
...
\`\`\`

### Key Takeaway

BPE iteratively merges the most common byte pairs, building a vocabulary of subword units. Common words become single tokens, rare words are split into familiar pieces. The merge table, learned from training data, completely defines the tokenizer.`,
      starterCode: `# Implement BPE from scratch

def get_stats(ids):
    """Count all consecutive pairs in the list."""
    # TODO: Return a dictionary mapping (pair) -> count
    pass

def merge(ids, pair, idx):
    """Replace all occurrences of pair in ids with idx."""
    # TODO: Walk through ids, replacing pair with idx
    pass

# Test data
text = "the cat sat on the mat. the cat ate the rat."
tokens = list(text.encode("utf-8"))
print(f"Initial tokens: {len(tokens)}")

# TODO: Perform 10 merges
# TODO: Print each merge (pair, new_id, count)
# TODO: Print final compression ratio
`,
      solutionCode: `def get_stats(ids):
    """Count all consecutive pairs in the list."""
    counts = {}
    for pair in zip(ids, ids[1:]):
        counts[pair] = counts.get(pair, 0) + 1
    return counts

def merge(ids, pair, idx):
    """Replace all occurrences of pair in ids with idx."""
    new_ids = []
    i = 0
    while i < len(ids):
        if i < len(ids) - 1 and ids[i] == pair[0] and ids[i+1] == pair[1]:
            new_ids.append(idx)
            i += 2
        else:
            new_ids.append(ids[i])
            i += 1
    return new_ids

# Test data
text = "the cat sat on the mat. the cat ate the rat."
tokens = list(text.encode("utf-8"))
original_len = len(tokens)
print(f"Initial tokens: {original_len}")

# Perform 10 merges
vocab = {idx: bytes([idx]) for idx in range(256)}
merges = {}

for i in range(10):
    stats = get_stats(tokens)
    if not stats:
        break
    top_pair = max(stats, key=stats.get)
    idx = 256 + i
    tokens = merge(tokens, top_pair, idx)
    merges[top_pair] = idx
    vocab[idx] = vocab[top_pair[0]] + vocab[top_pair[1]]
    print(f"Merge {i+1}: {top_pair} -> {idx} "
          f"({vocab[idx]!r}) count={stats[top_pair]}")

print(f"\\nFinal tokens: {len(tokens)}")
print(f"Compression ratio: {original_len / len(tokens):.2f}x")
`,
    },
    {
      id: "nn-tokenizer-bpe-impl",
      slug: "implementing-bpe-from-scratch",
      title: "Implementing BPE from Scratch",
      content: `## Implementing BPE from Scratch

Let us build a complete, usable tokenizer class with encode and decode functions.

### The Tokenizer Class

\`\`\`python
class BasicTokenizer:
    def __init__(self):
        self.merges = {}        # (int, int) -> int
        self.vocab = {}         # int -> bytes

    def train(self, text, vocab_size):
        """Train the tokenizer on text."""
        assert vocab_size >= 256
        num_merges = vocab_size - 256

        # Start with raw bytes
        tokens = list(text.encode("utf-8"))

        # Initialize base vocabulary
        self.vocab = {idx: bytes([idx]) for idx in range(256)}
        self.merges = {}

        for i in range(num_merges):
            stats = get_stats(tokens)
            if not stats:
                break
            pair = max(stats, key=stats.get)
            idx = 256 + i
            tokens = merge(tokens, pair, idx)
            self.merges[pair] = idx
            self.vocab[idx] = self.vocab[pair[0]] + self.vocab[pair[1]]

        print(f"Trained tokenizer: {len(self.vocab)} tokens")
        print(f"Compression: {len(text.encode('utf-8'))} -> {len(tokens)} "
              f"({len(text.encode('utf-8'))/len(tokens):.2f}x)")

    def encode(self, text):
        """Encode text into token IDs."""
        tokens = list(text.encode("utf-8"))

        while len(tokens) >= 2:
            stats = get_stats(tokens)
            # Find the pair with the lowest merge index
            pair = min(stats, key=lambda p: self.merges.get(p, float('inf')))
            if pair not in self.merges:
                break  # No more merges possible
            idx = self.merges[pair]
            tokens = merge(tokens, pair, idx)

        return tokens

    def decode(self, ids):
        """Decode token IDs back to text."""
        tokens = b"".join(self.vocab[idx] for idx in ids)
        text = tokens.decode("utf-8", errors="replace")
        return text
\`\`\`

### The Encode Algorithm: Apply Merges in Order

The critical insight for encoding: we must apply merges in the **same order** they were learned during training. The pair with the lowest merge index gets merged first.

\`\`\`python
# Why order matters:
# If merges are: (a, b) -> 256, (256, c) -> 257
# For text "abc":
#   Correct:  [a, b, c] -> [256, c] -> [257]
#   Wrong order: might try to merge (b, c) first, which has no merge rule
\`\`\`

### Testing the Tokenizer

\`\`\`python
tokenizer = BasicTokenizer()
tokenizer.train("some training text...", vocab_size=300)

# Encode-decode roundtrip
text = "Hello, world!"
encoded = tokenizer.encode(text)
decoded = tokenizer.decode(encoded)

print(f"Original:  {text}")
print(f"Encoded:   {encoded}")
print(f"Decoded:   {decoded}")
assert text == decoded, "Roundtrip failed!"
\`\`\`

### Handling Unicode and UTF-8

BPE operates on **bytes**, not characters. This means it naturally handles any Unicode text:

\`\`\`python
text = "Hello world! Caf\\u00e9 \\u{1F600}"
tokens = list(text.encode("utf-8"))
# "\\u00e9" (e with accent) = 2 bytes: [195, 169]
# "\\u{1F600}" (emoji) = 4 bytes: [240, 159, 152, 128]
\`\`\`

The tokenizer does not need to know about Unicode — it just sees bytes and learns to merge common byte patterns. Frequently used Unicode characters will eventually be merged into single tokens.

### Saving and Loading

\`\`\`python
import json

def save(self, path):
    """Save the tokenizer to a file."""
    data = {
        "merges": {f"{k[0]},{k[1]}": v for k, v in self.merges.items()},
    }
    with open(path, 'w') as f:
        json.dump(data, f)

def load(self, path):
    """Load the tokenizer from a file."""
    with open(path) as f:
        data = json.load(f)
    self.merges = {tuple(map(int, k.split(','))): v
                   for k, v in data["merges"].items()}
    # Rebuild vocab
    self.vocab = {idx: bytes([idx]) for idx in range(256)}
    for (p0, p1), idx in sorted(self.merges.items(), key=lambda x: x[1]):
        self.vocab[idx] = self.vocab[p0] + self.vocab[p1]
\`\`\`

### Inspecting the Vocabulary

\`\`\`python
# Most common tokens (highest merge index = most common pattern)
for idx in sorted(self.vocab.keys()):
    if idx >= 256:
        token_bytes = self.vocab[idx]
        try:
            token_str = token_bytes.decode('utf-8')
        except UnicodeDecodeError:
            token_str = str(token_bytes)
        print(f"{idx}: {token_str!r}")
\`\`\`

You will see that the first merges are very common byte pairs like \`th\`, \`in\`, \`er\`, \` t\` (space-t). Later merges combine these into longer tokens like \`the\`, \`tion\`, \`ing\`.

### Key Takeaway

A complete BPE tokenizer has three core functions: train (learn merges from text), encode (apply merges to convert text to IDs), and decode (convert IDs back to text). The encode function must apply merges in the order they were learned. Operating at the byte level means any text in any language can be tokenized without any special handling.`,
      starterCode: `# Build a complete tokenizer class

def get_stats(ids):
    counts = {}
    for pair in zip(ids, ids[1:]):
        counts[pair] = counts.get(pair, 0) + 1
    return counts

def merge(ids, pair, idx):
    new_ids = []
    i = 0
    while i < len(ids):
        if i < len(ids) - 1 and ids[i] == pair[0] and ids[i+1] == pair[1]:
            new_ids.append(idx)
            i += 2
        else:
            new_ids.append(ids[i])
            i += 1
    return new_ids

class BasicTokenizer:
    def __init__(self):
        self.merges = {}
        self.vocab = {}

    def train(self, text, vocab_size):
        # TODO: Implement training
        pass

    def encode(self, text):
        # TODO: Implement encoding
        # Remember: apply merges in order (lowest merge index first)
        pass

    def decode(self, ids):
        # TODO: Implement decoding
        pass

# Test
tokenizer = BasicTokenizer()
tokenizer.train("the cat sat on the mat the cat ate the rat", vocab_size=270)

test = "the cat"
encoded = tokenizer.encode(test)
decoded = tokenizer.decode(encoded)
print(f"'{test}' -> {encoded} -> '{decoded}'")
assert test == decoded
`,
      solutionCode: `def get_stats(ids):
    counts = {}
    for pair in zip(ids, ids[1:]):
        counts[pair] = counts.get(pair, 0) + 1
    return counts

def merge(ids, pair, idx):
    new_ids = []
    i = 0
    while i < len(ids):
        if i < len(ids) - 1 and ids[i] == pair[0] and ids[i+1] == pair[1]:
            new_ids.append(idx)
            i += 2
        else:
            new_ids.append(ids[i])
            i += 1
    return new_ids

class BasicTokenizer:
    def __init__(self):
        self.merges = {}
        self.vocab = {}

    def train(self, text, vocab_size):
        assert vocab_size >= 256
        num_merges = vocab_size - 256
        tokens = list(text.encode("utf-8"))
        self.vocab = {idx: bytes([idx]) for idx in range(256)}
        self.merges = {}

        for i in range(num_merges):
            stats = get_stats(tokens)
            if not stats:
                break
            pair = max(stats, key=stats.get)
            idx = 256 + i
            tokens = merge(tokens, pair, idx)
            self.merges[pair] = idx
            self.vocab[idx] = self.vocab[pair[0]] + self.vocab[pair[1]]
            print(f"Merge {i+1}: {self.vocab[idx]!r} (count={stats[pair]})")

        print(f"\\nVocab size: {len(self.vocab)}")
        print(f"Compression: {len(text.encode('utf-8'))} -> {len(tokens)}")

    def encode(self, text):
        tokens = list(text.encode("utf-8"))
        while len(tokens) >= 2:
            stats = get_stats(tokens)
            pair = min(stats, key=lambda p: self.merges.get(p, float('inf')))
            if pair not in self.merges:
                break
            idx = self.merges[pair]
            tokens = merge(tokens, pair, idx)
        return tokens

    def decode(self, ids):
        tokens = b"".join(self.vocab[idx] for idx in ids)
        return tokens.decode("utf-8", errors="replace")

# Test
tokenizer = BasicTokenizer()
tokenizer.train("the cat sat on the mat the cat ate the rat", vocab_size=270)

test = "the cat"
encoded = tokenizer.encode(test)
decoded = tokenizer.decode(encoded)
print(f"\\n'{test}' -> {encoded} -> '{decoded}'")
assert test == decoded, "Roundtrip failed!"
print("Roundtrip test passed!")
`,
    },
    {
      id: "nn-tokenizer-gpt-tokenizer",
      slug: "gpt-tokenizer",
      title: "GPT Tokenizer",
      content: `## The GPT Tokenizer

GPT models use a more sophisticated version of BPE with several important additions. Let us examine what makes the production GPT tokenizer different from our basic implementation.

### tiktoken: OpenAI's Tokenizer Library

\`\`\`python
import tiktoken

# Load GPT-4's tokenizer
enc = tiktoken.get_encoding("cl100k_base")

# Encode text
tokens = enc.encode("Hello, world!")
print(tokens)      # [9906, 11, 1917, 0]
print(len(tokens))  # 4

# Decode back
text = enc.decode(tokens)
print(text)  # "Hello, world!"
\`\`\`

### GPT Tokenizer Differences from Basic BPE

**1. Pre-tokenization with regex:**

Before applying BPE merges, the GPT tokenizer splits text into chunks using a regex pattern. This prevents merges across word boundaries:

\`\`\`python
import regex

# GPT-4's pre-tokenization pattern
GPT4_SPLIT_PATTERN = r"""'(?i:[sdmt]|ll|ve|re)|[^\\r\\n\\p{L}\\p{N}]?+\\p{L}+|\\p{N}{1,3}| ?[^\\s\\p{L}\\p{N}]++[\\r\\n]*|\\s*[\\r\\n]|\\s+(?!\\S)|\\s+"""

text = "Hello world! How's it going?"
chunks = regex.findall(GPT4_SPLIT_PATTERN, text)
print(chunks)
# ['Hello', ' world', '!', ' How', "'s", ' it', ' going', '?']
\`\`\`

This ensures that "Hello" and "world" are never merged into a single token, keeping the vocabulary more interpretable.

**2. Special tokens:**

GPT tokenizers include special tokens that are not learned through BPE:

\`\`\`python
# Special tokens in cl100k_base (GPT-4)
special_tokens = {
    "<|endoftext|>": 100257,
    "<|fim_prefix|>": 100258,
    "<|fim_middle|>": 100259,
    "<|fim_suffix|>": 100260,
    "<|endofprompt|>": 100276,
}
\`\`\`

Special tokens are used for:
- \`<|endoftext|>\` — separating documents in training data
- \`<|fim_*|>\` — fill-in-the-middle training (code completion)
- System/user/assistant role markers in chat models

**3. Byte-level BPE:**

The GPT tokenizer operates on **bytes** (not characters), which means it can encode any text without an "unknown token":

\`\`\`python
# Even unusual Unicode works
tokens = enc.encode("\\u{1F600}\\u{1F4BB}\\u{1F680}")  # Emoji sequence
decoded = enc.decode(tokens)
print(decoded)  # "\\u{1F600}\\u{1F4BB}\\u{1F680}" — perfect roundtrip
\`\`\`

### Token Inspection

\`\`\`python
# See what each token represents
text = "Tokenization is fascinating!"
tokens = enc.encode(text)

for token in tokens:
    decoded = enc.decode([token])
    print(f"  {token:6d} -> {decoded!r}")

# Output:
#   Token -> 'To'
#   54258 -> 'kenization'
#   374   -> ' is'
#   ...
\`\`\`

### Vocabulary Size Comparison

| Tokenizer | Vocab Size | Used In |
|-----------|-----------|---------|
| Our basic BPE | ~300 | This course |
| GPT-2 | 50,257 | GPT-2 |
| cl100k_base | 100,277 | GPT-3.5, GPT-4 |
| Llama 2 | 32,000 | LLaMA 2 |
| Llama 3 | 128,000 | LLaMA 3 |

Larger vocabularies mean:
- Shorter token sequences (more efficient)
- Larger embedding tables (more memory)
- Better coverage of rare words and non-English text

### The sentencepiece Alternative

Google's sentencepiece (used by LLaMA, T5) takes a different approach:
- Operates on Unicode code points, not bytes
- Includes the BPE training and inference in a single C++ library
- Supports both BPE and unigram language model tokenization
- Handles whitespace by replacing it with a special character (underscore)

### Common Tokenization Pitfalls

**Trailing whitespace matters:**
\`\`\`python
enc.encode("hello")     # [15339]
enc.encode("hello ")    # [15339, 220]  — different!
enc.encode(" hello")    # [24748]       — completely different token!
\`\`\`

**Numbers are tokenized inconsistently:**
\`\`\`python
enc.encode("123")       # [4513]        — one token
enc.encode("1234")      # [4513, 19]    — split differently
enc.encode("12345")     # [4513, 1774]  — split differently again
\`\`\`

This is why LLMs struggle with precise arithmetic — the digit boundaries do not align with token boundaries.

### Key Takeaway

Production tokenizers like GPT's tiktoken add regex-based pre-tokenization, special tokens, and byte-level encoding on top of basic BPE. These engineering decisions have real consequences for model behavior, especially for arithmetic, code, and multilingual text. Understanding tokenization helps explain many puzzling LLM behaviors.`,
    },
    {
      id: "nn-tokenizer-design",
      slug: "tokenizer-design-decisions",
      title: "Tokenizer Design Decisions",
      content: `## Tokenizer Design Decisions

Building a tokenizer involves consequential design choices. Each decision affects model performance, cost, and capabilities in non-obvious ways.

### Vocabulary Size

The most important decision: how many tokens should the vocabulary contain?

\`\`\`
Fewer tokens (e.g., 256 — raw bytes):
  + Tiny embedding table
  + No tokenizer training needed
  - Very long sequences (6-7x longer)
  - Attention cost O(T^2) becomes prohibitive

More tokens (e.g., 100,000 — GPT-4):
  + Short sequences (3-4 chars per token average)
  + Better coverage of words and phrases
  - Large embedding table (100K * hidden_dim parameters)
  - Rare tokens have poor embeddings (seen too few times)
\`\`\`

The sweet spot depends on training data size. GPT-4's 100K vocabulary works because it is trained on trillions of tokens — even rare tokens are seen enough times to learn good embeddings.

### Impact on Different Languages

BPE tokenizers trained primarily on English text penalize other languages:

\`\`\`python
# English: efficient tokenization
enc.encode("Hello, how are you?")  # ~6 tokens

# Japanese: much less efficient
enc.encode("\\u3053\\u3093\\u306B\\u3061\\u306F\\u3001\\u304A\\u5143\\u6C17\\u3067\\u3059\\u304B\\uFF1F")  # ~15 tokens

# Same semantic content, 2.5x more tokens!
\`\`\`

This means:
- Non-English text costs more (per-token pricing)
- Non-English text fills up the context window faster
- The model has less compute budget per "word" in non-English text

Solutions: train on multilingual data, use larger vocabularies, or use language-specific tokenizers.

### Pre-tokenization Pattern Design

The regex pattern that splits text before BPE matters enormously:

\`\`\`python
# Without pre-tokenization:
# "dog." and "dog!" might merge differently
# "the" in "the cat" might merge with the space: " the"

# GPT-4's pattern prevents:
# 1. Merges across word boundaries
# 2. Merges across number groups (max 3 digits per chunk)
# 3. Merges across whitespace types
\`\`\`

### Handling Special Characters

**Code:** Programming languages need tokens for operators, indentation, brackets:
\`\`\`python
# Good tokenization for code:
"def foo(x):" -> ["def", " foo", "(", "x", "):"]

# Bad tokenization:
"def foo(x):" -> ["def foo(", "x):"]  # Syntax units split awkwardly
\`\`\`

**Whitespace:** Some tokenizers (GPT-2+) include leading spaces as part of word tokens:
\`\`\`
" hello" = one token (space is part of the token)
"hello"  = different token (no space)
\`\`\`

### Training Data Considerations

The tokenizer should be trained on data similar to what the model will see:

\`\`\`python
# Tokenizer trained only on English prose:
#   "def __init__(self):" -> many tokens (unfamiliar pattern)

# Tokenizer trained on English + code:
#   "def __init__(self):" -> fewer tokens (common code pattern becomes a token)
\`\`\`

### Token Boundary Effects on Model Performance

Research has shown that model performance is affected by where token boundaries fall:

1. **Arithmetic:** Models perform better when digit boundaries align with token boundaries
2. **Spelling:** Character-level tasks are hard when characters are hidden inside tokens
3. **Code completion:** Indentation tokens affect code generation quality

### The Future: Byte-Level Models

A growing trend is to skip tokenization entirely and process raw bytes:
- **MegaByte** (Meta, 2023): Processes bytes with a two-level transformer
- **ByT5** (Google, 2021): Byte-level T5 that competitive with subword models

The advantage: no tokenizer artifacts, perfect for all languages. The challenge: sequences are 4-6x longer, requiring more efficient architectures.

### Practical Recommendations

1. **Use an existing tokenizer** (tiktoken, sentencepiece) unless you have a specific reason not to
2. **Match your tokenizer to your data** — a code-focused model should use a tokenizer trained on code
3. **Larger vocabulary = shorter sequences** but diminishing returns past ~100K
4. **Always check token boundaries** for your specific use case (arithmetic, code, multilingual)
5. **Test roundtrip encoding** — encode then decode should give back the original text

### Key Takeaway

Tokenizer design is a series of trade-offs: vocabulary size vs. embedding table cost, compression ratio vs. rare-token quality, English efficiency vs. multilingual fairness. These choices are made once but affect every interaction with the model. Understanding them helps you predict and explain LLM behavior, and is essential for building production AI systems.`,
    },
  ],
};
