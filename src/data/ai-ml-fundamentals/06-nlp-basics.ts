import { Module } from "../types";

export const nlpBasicsModule: Module = {
  id: "aiml-nlp-basics",
  title: "NLP Basics",
  description:
    "Learn how machines process human language through tokenization, embeddings, and the attention mechanism. Understand the Transformer architecture that powers modern language models.",
  lessons: [
    {
      id: "aiml-text-representation",
      slug: "text-representation",
      title: "Text Representation for Machines",
      content: `## Text Representation for Machines

<!-- voice:section_check -->

Machines operate on numbers, not words. The first challenge in NLP is converting text into numerical representations that preserve meaning.

### Tokenization

**Tokenization** splits text into discrete units (tokens):

\`\`\`python
# Word-level tokenization
"The cat sat on the mat" -> ["The", "cat", "sat", "on", "the", "mat"]

# Subword tokenization (BPE — used by GPT, Claude)
"unhappiness" -> ["un", "happi", "ness"]
\`\`\`

Subword tokenization (Byte Pair Encoding) is the modern standard because it:
- Handles unknown words by breaking them into known subwords
- Keeps vocabulary size manageable (30K-50K tokens vs. millions of words)
- Preserves meaningful morphological units

### Bag of Words

The simplest text representation. Count word occurrences:

\`\`\`python
"the cat sat on the mat" -> {the: 2, cat: 1, sat: 1, on: 1, mat: 1}
\`\`\`

Problems: ignores word order ("dog bites man" = "man bites dog") and treats each word as independent.

### TF-IDF

**Term Frequency - Inverse Document Frequency** weights words by how important they are:
- Common words like "the" get low weight (appear in many documents)
- Distinctive words like "backpropagation" get high weight (appear in few documents)

\`\`\`
TF-IDF(word, doc) = count(word in doc) * log(total_docs / docs_containing_word)
\`\`\`

<!-- voice:key_insight -->

### Word Embeddings

The breakthrough: represent words as **dense vectors** where similar words are nearby in vector space.

\`\`\`python
# Word2Vec-style embeddings (300 dimensions, shown simplified)
king  = [0.5, 0.3, -0.1, 0.8, ...]
queen = [0.5, 0.3, -0.1, 0.6, ...]
man   = [0.2, 0.1, 0.4, 0.7, ...]
woman = [0.2, 0.1, 0.4, 0.5, ...]

# Famous analogy: king - man + woman ≈ queen
\`\`\`

Word2Vec (Mikolov et al., 2013) learns embeddings by predicting a word from its context (or vice versa). Words appearing in similar contexts get similar vectors.

### From Words to Sentences

Modern models (BERT, GPT, Claude) produce **contextual embeddings** — the same word gets different vectors depending on context:

- "I went to the **bank** to deposit money" (financial institution)
- "I sat on the river **bank**" (riverbank)

In Word2Vec, "bank" has one fixed vector. In BERT/GPT, it gets different vectors based on surrounding words.

### Key Takeaway

Text representation has evolved from simple word counts (BoW) to contextual embeddings (Transformers). Each advance captures more semantic nuance. Modern language models learn rich, context-dependent representations that enable remarkable language understanding.

### Reflection Questions

- Why is subword tokenization preferred over word-level tokenization for modern models?
- What information does Bag of Words lose that word embeddings preserve?`,
    },
    {
      id: "aiml-tfidf-exercise",
      slug: "tfidf-exercise",
      title: "Exercise: Build a TF-IDF Vectorizer",
      content: `## Exercise: Build a TF-IDF Vectorizer

Implement TF-IDF from scratch. This classic NLP technique is still widely used and teaches you how to convert text into meaningful numerical features.

### Algorithm

1. **Tokenize**: Split documents into words (lowercase, split on spaces)
2. **Build vocabulary**: Collect all unique words across all documents
3. **Compute TF**: For each word in each document, count occurrences / total words in doc
4. **Compute IDF**: For each word, log(total documents / documents containing word)
5. **TF-IDF**: TF * IDF for each word-document pair

### Hints

- Use Python sets to find unique words
- Use \`math.log()\` for natural log
- The output is a matrix: rows = documents, columns = vocabulary words`,
      starterCode: `import numpy as np
import math

def tokenize(text):
    """Convert text to lowercase tokens (split on whitespace).

    Args:
        text: string
    Returns:
        list of lowercase word strings
    """
    # TODO: lowercase and split
    pass

def build_vocabulary(documents):
    """Build a sorted list of unique words across all documents.

    Args:
        documents: list of strings
    Returns:
        list: sorted unique words
    """
    # TODO: Tokenize each document, collect unique words, sort
    pass

def compute_tf(document, vocabulary):
    """Compute term frequency for each word in vocabulary.

    TF(word, doc) = count(word in doc) / total_words_in_doc

    Args:
        document: string
        vocabulary: list of words
    Returns:
        numpy array of TF values (one per vocab word)
    """
    # TODO: Tokenize, count each vocab word, divide by total
    pass

def compute_idf(documents, vocabulary):
    """Compute inverse document frequency for each word.

    IDF(word) = log(total_docs / docs_containing_word)

    Args:
        documents: list of strings
        vocabulary: list of words
    Returns:
        numpy array of IDF values (one per vocab word)
    """
    # TODO: For each vocab word, count how many docs contain it
    # TODO: Compute log(N / count) for each word
    pass

def tfidf_matrix(documents):
    """Compute the full TF-IDF matrix.

    Args:
        documents: list of strings
    Returns:
        tuple: (tfidf numpy array of shape (n_docs, n_vocab), vocabulary list)
    """
    # TODO: Build vocab, compute TF for each doc, compute IDF, multiply
    pass

# Test cases
docs = [
    "the cat sat on the mat",
    "the dog sat on the log",
    "cats and dogs are friends"
]

vocab = build_vocabulary(docs)
print(f"Vocabulary: {vocab}")
# Expected: sorted unique words from all docs

tf_values = compute_tf(docs[0], vocab)
print(f"\\nTF for doc 0: {tf_values}")
# Expected: array with 'the' having highest TF (appears twice)

idf_values = compute_idf(docs, vocab)
print(f"\\nIDF values: {idf_values}")
# Expected: 'the' and 'sat' have low IDF (common), 'friends' has high IDF (rare)

matrix, v = tfidf_matrix(docs)
print(f"\\nTF-IDF matrix shape: {matrix.shape}")
# Expected: (3, n_vocab)

print(f"TF-IDF matrix:\\n{np.round(matrix, 3)}")`,
      solutionCode: `import numpy as np
import math

def tokenize(text):
    """Convert text to lowercase tokens (split on whitespace).

    Args:
        text: string
    Returns:
        list of lowercase word strings
    """
    return text.lower().split()

def build_vocabulary(documents):
    """Build a sorted list of unique words across all documents.

    Args:
        documents: list of strings
    Returns:
        list: sorted unique words
    """
    vocab = set()
    for doc in documents:
        vocab.update(tokenize(doc))
    return sorted(vocab)

def compute_tf(document, vocabulary):
    """Compute term frequency for each word in vocabulary.

    TF(word, doc) = count(word in doc) / total_words_in_doc
    """
    tokens = tokenize(document)
    total = len(tokens)
    tf = np.zeros(len(vocabulary))
    for i, word in enumerate(vocabulary):
        tf[i] = tokens.count(word) / total
    return tf

def compute_idf(documents, vocabulary):
    """Compute inverse document frequency for each word.

    IDF(word) = log(total_docs / docs_containing_word)
    """
    n_docs = len(documents)
    idf = np.zeros(len(vocabulary))
    for i, word in enumerate(vocabulary):
        doc_count = sum(1 for doc in documents if word in tokenize(doc))
        idf[i] = math.log(n_docs / max(doc_count, 1))
    return idf

def tfidf_matrix(documents):
    """Compute the full TF-IDF matrix."""
    vocab = build_vocabulary(documents)
    idf = compute_idf(documents, vocab)
    matrix = np.zeros((len(documents), len(vocab)))
    for i, doc in enumerate(documents):
        tf = compute_tf(doc, vocab)
        matrix[i] = tf * idf
    return matrix, vocab

# Time complexity: O(n_docs * n_vocab * avg_doc_length) for full matrix
# Space complexity: O(n_docs * n_vocab)

# Test cases
docs = [
    "the cat sat on the mat",
    "the dog sat on the log",
    "cats and dogs are friends"
]

vocab = build_vocabulary(docs)
print(f"Vocabulary: {vocab}")
# Expected: sorted unique words from all docs

tf_values = compute_tf(docs[0], vocab)
print(f"\\nTF for doc 0: {tf_values}")
# Expected: array with 'the' having highest TF (appears twice)

idf_values = compute_idf(docs, vocab)
print(f"\\nIDF values: {idf_values}")
# Expected: 'the' and 'sat' have low IDF (common), 'friends' has high IDF (rare)

matrix, v = tfidf_matrix(docs)
print(f"\\nTF-IDF matrix shape: {matrix.shape}")
# Expected: (3, n_vocab)

print(f"TF-IDF matrix:\\n{np.round(matrix, 3)}")`,
    },
    {
      id: "aiml-attention-transformers",
      slug: "attention-transformers",
      title: "Attention & Transformers",
      content: `## Attention & Transformers

<!-- voice:section_check -->

The **Transformer** architecture, introduced in "Attention Is All You Need" (Vaswani et al., 2017), is the foundation of GPT, BERT, Claude, and virtually every modern language model.

### The Problem with Sequences

Before Transformers, NLP used **Recurrent Neural Networks (RNNs)** that processed words one at a time:

\`\`\`
"The" -> "cat" -> "sat" -> "on" -> "the" -> "mat"
\`\`\`

Problems:
- **Sequential**: Cannot parallelize (must process word by word)
- **Long-range dependencies**: By the time the model reaches word 100, it may have "forgotten" word 1
- **Vanishing gradients**: Same problem as deep feed-forward networks

### The Attention Mechanism

**Self-attention** lets every word attend to every other word simultaneously:

\`\`\`
"The cat sat on the mat"

When processing "sat":
  - attend to "cat" (who sat?)     -> high attention
  - attend to "on the mat" (where?) -> medium attention
  - attend to "The" (article)       -> low attention
\`\`\`

<!-- voice:key_insight -->

### Query, Key, Value

Each word produces three vectors:
- **Query (Q)**: "What am I looking for?"
- **Key (K)**: "What do I contain?"
- **Value (V)**: "What information do I provide?"

Attention score between words i and j:

\`\`\`
score(i, j) = (Q_i . K_j) / sqrt(d_k)
\`\`\`

The scores are passed through softmax (so they sum to 1), then used to take a weighted sum of the Value vectors.

### Multi-Head Attention

Instead of one attention mechanism, use multiple "heads" that each attend to different aspects:
- Head 1 might focus on syntactic relationships
- Head 2 might focus on semantic similarity
- Head 3 might focus on positional proximity

### The Transformer Block

\`\`\`
Input -> Multi-Head Attention -> Add & Normalize
      -> Feed-Forward Network -> Add & Normalize
      -> Output
\`\`\`

Stack 6-96 of these blocks to get GPT, BERT, or Claude.

### Why Transformers Win

| Feature | RNN | Transformer |
|---------|-----|-------------|
| Parallelization | No (sequential) | Yes (all positions at once) |
| Long-range deps | Degrades over distance | Direct attention to any position |
| Training speed | Slow | Fast (parallelizable on GPUs) |
| Scalability | Limited | Scales to billions of parameters |

### Key Takeaway

Transformers replaced RNNs by computing attention across all positions simultaneously. The Query-Key-Value mechanism allows each word to dynamically decide which other words are relevant, enabling powerful language understanding at scale.

### Further Reading

- Vaswani, A. et al. (2017). "Attention Is All You Need." *NeurIPS*.
- Devlin, J. et al. (2019). "BERT: Pre-training of Deep Bidirectional Transformers." *NAACL*.
- Jay Alammar's "The Illustrated Transformer" (blog post).`,
    },
    {
      id: "aiml-nlp-checkpoint",
      slug: "nlp-checkpoint",
      title: "Checkpoint: NLP Basics",
      content: `## Checkpoint: NLP Basics

<!-- voice:section_check -->

Test your understanding of how machines process language.

---

### Question 1
Why is subword tokenization (BPE) preferred over word-level tokenization?

A) It produces shorter token sequences
B) It handles unseen words by breaking them into known subwords, keeping vocabulary manageable
C) It is faster to compute
D) It preserves punctuation better

**Answer: B** — Byte Pair Encoding can represent any word by combining subword units. The word "unhappiness" becomes ["un", "happi", "ness"]. This handles rare and unseen words gracefully while keeping vocabulary size at 30-50K tokens.

---

### Question 2
What is the key limitation of Bag of Words representation?

A) It cannot handle numbers
B) It ignores word order — "dog bites man" and "man bites dog" have the same representation
C) It produces too many features
D) It only works for English text

**Answer: B** — Bag of Words treats each document as an unordered set of word counts. The sentences "dog bites man" and "man bites dog" produce identical representations despite having opposite meanings.

---

### Question 3
In the TF-IDF formula, what does the IDF component accomplish?

A) It counts how often a word appears in a document
B) It downweights words that appear in many documents (common words) and upweights rare, distinctive words
C) It normalizes document length
D) It removes stop words

**Answer: B** — IDF = log(total_docs / docs_containing_word). Common words like "the" appear in nearly every document, giving them low IDF. Rare, topic-specific words get high IDF, making them more influential in the representation.

---

### Question 4
In the Transformer's attention mechanism, what do the Query, Key, and Value vectors represent?

A) Input, hidden state, and output
B) "What am I looking for?", "What do I contain?", and "What information do I provide?"
C) Past, present, and future context
D) Subject, verb, and object

**Answer: B** — The Query vector represents what a word is searching for. The Key vector represents what a word offers as a match target. The attention score (Q dot K) determines relevance, and the Value vector provides the actual information to aggregate.

---

### Question 5
What fundamental advantage do Transformers have over RNNs?

A) Transformers use less memory
B) Transformers are simpler to implement
C) Transformers process all positions in parallel, enabling faster training and direct long-range dependencies
D) Transformers do not require training data

**Answer: C** — RNNs must process tokens sequentially, creating a bottleneck. Transformers compute attention across all positions simultaneously, enabling massive parallelization on GPUs and direct attention between any two positions regardless of distance.`,
    },
  ],
};
