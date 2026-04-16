import { Module } from "../types";

export const nlpFundamentalsModule: Module = {
  id: "nlp-fundamentals",
  title: "NLP Fundamentals and Text Pipelines",
  description: "Process raw text into ML-ready features. Learn tokenization, TF-IDF, word embeddings, and the sequence models (RNN, LSTM) that paved the way for Transformers.",
  lessons: [
    {
      id: "text-preprocessing",
      slug: "text-preprocessing",
      title: "Text Preprocessing and Tokenization",
      content: `# Text Preprocessing and Tokenization

Machines don't understand words — they understand numbers. Before any model can process text, it must be converted into a numerical representation. This pipeline: raw text → tokens → integer IDs → tensors, is the foundation of every NLP system.

\`\`\`concept
{ "title": "The Text-to-Tensor Pipeline", "variant": "info", "content": "NLP pipeline: (1) Normalize — lowercase, strip punctuation, handle contractions. (2) Tokenize — split into tokens (words, subwords, or characters). (3) Build vocabulary — assign an integer ID to each unique token. (4) Encode — convert tokens to integer sequences. (5) Pad/truncate — make sequences the same length for batch processing." }
\`\`\`

## Tokenization Strategies

\`\`\`tabs
{ "tabs": [ { "label": "Word tokenization", "content": "Split on whitespace and punctuation.\\nVocab: all unique words. Problem: 'run', 'runs', 'running' are 3 separate tokens.\\nOOV (out-of-vocabulary) problem: unseen words at inference time.\\nGood for: simple baselines, bag-of-words models." }, { "label": "Subword (BPE)", "content": "Byte Pair Encoding: starts with character vocab, iteratively merges the most frequent adjacent pair.\\n'running' → 'run' + 'ning' → 'run' + '##ning'.\\nNo OOV — unknown words decompose into known subwords.\\nUsed by: BERT, GPT, RoBERTa. Vocab size: 30K-50K." }, { "label": "Character tokenization", "content": "Each character is a token. Tiny vocab (~100 chars).\\nHandles any word, including typos and new words.\\nDisadvantage: very long sequences — 'hello' = 5 tokens.\\nUsed in: character-level language models, some multilingual models." } ] }
\`\`\`

\`\`\`playground
{ "title": "Simple Tokenizer from Scratch", "language": "python", "code": "import re\\nfrom collections import Counter\\n\\nclass SimpleTokenizer:\\n    def __init__(self, max_vocab=10000):\\n        self.max_vocab = max_vocab\\n        self.word2id = {'<PAD>': 0, '<UNK>': 1, '<BOS>': 2, '<EOS>': 3}\\n        self.id2word = {0: '<PAD>', 1: '<UNK>', 2: '<BOS>', 3: '<EOS>'}\\n\\n    def _tokenize(self, text):\\n        text = text.lower()\\n        text = re.sub(r'[^a-z0-9\\\\s]', '', text)\\n        return text.split()\\n\\n    def fit(self, texts):\\n        counter = Counter()\\n        for text in texts:\\n            counter.update(self._tokenize(text))\\n        for word, _ in counter.most_common(self.max_vocab - 4):\\n            idx = len(self.word2id)\\n            self.word2id[word] = idx\\n            self.id2word[idx] = word\\n        print(f'Vocabulary size: {len(self.word2id)}')\\n\\n    def encode(self, text, max_len=20):\\n        tokens = self._tokenize(text)[:max_len]\\n        ids = [self.word2id.get(t, 1) for t in tokens]  # 1 = <UNK>\\n        ids += [0] * (max_len - len(ids))  # pad with 0\\n        return ids\\n\\n# Demo\\ncorpus = [\\n    'the cat sat on the mat',\\n    'the dog ran in the park',\\n    'a quick brown fox jumps over the lazy dog',\\n]\\ntokenizer = SimpleTokenizer()\\ntokenizer.fit(corpus)\\nprint('Sample encoding:')\\ntext = 'the cat ran fast'\\nids = tokenizer.encode(text, max_len=8)\\nprint(f'  Input: \\\"{text}\\\"')\\nprint(f'  IDs:   {ids}')\\nprint(f'  Back:  {[tokenizer.id2word[i] for i in ids]}')\\n", "runnable": true }
\`\`\`

## Special Tokens

Every modern NLP model uses special tokens with reserved IDs:

| Token | Purpose |
|-------|---------|
| \`[PAD]\` | Fill shorter sequences to match batch length |
| \`[UNK]\` | Replace out-of-vocabulary words |
| \`[BOS]\`/\`[CLS]\` | Beginning of sequence (generation start or classification token) |
| \`[EOS]\`/\`[SEP]\` | End of sequence or separator between segments |

\`\`\`quiz
{ "question": "A tokenizer encounters the word 'cryptocurrency' at inference time, but it was not in the training vocabulary. Subword tokenization (BPE) handles this differently than word tokenization. How?", "options": ["BPE maps 'cryptocurrency' to a random known token", "BPE decomposes it into known subword pieces like 'crypto' + 'currency' — no OOV; word tokenization maps it to <UNK>", "BPE skips unknown words entirely, word tokenization replaces with the nearest neighbor", "Both methods handle OOV identically"], "answer": 1, "explanation": "BPE builds a vocabulary of subword pieces by merging frequent character pairs. 'cryptocurrency' can be split into 'crypto' + 'currency' or even smaller pieces — all of which may have been seen during training. Word-level tokenization has no mechanism to handle unseen words and must use a generic <UNK> token, losing all semantic information." }
\`\`\`

\`\`\`takeaways
{ "points": ["Pipeline: normalize → tokenize → encode to integer IDs → pad/truncate to fixed length", "Word tokenization: simple but suffers from OOV; BPE subword tokenization: no OOV, used by BERT/GPT", "Special tokens: PAD (fill), UNK (unknown), BOS/CLS (start), EOS/SEP (end) — reserve IDs 0-3 by convention", "Vocabulary size trade-off: large vocab = fewer UNK but more embedding parameters to learn"] }
\`\`\``,
    },
    {
      id: "tf-idf-bow",
      slug: "tf-idf-bow",
      title: "Bag of Words and TF-IDF",
      content: `# Bag of Words and TF-IDF

Before dense embeddings, text was represented as sparse feature vectors. Bag-of-Words and TF-IDF are still competitive baselines for many classification tasks and require no training data beyond the documents themselves.

\`\`\`concept
{ "title": "Bag of Words: Throwing Away Order", "variant": "info", "content": "BoW represents a document as a vector of word counts, ignoring word order. 'The dog bit the man' and 'The man bit the dog' have identical BoW representations. This is obviously lossy — but for many tasks (sentiment, topic classification) word frequency is more predictive than word order." }
\`\`\`

## TF-IDF: Weighting by Importance

Raw word counts disadvantage rare but meaningful words. "the" appears in every document but carries no discriminative power. TF-IDF balances this:

\`\`\`
TF(t, d) = count(t in d) / total words in d
IDF(t) = log(N / df(t))       where df(t) = documents containing t
TF-IDF(t, d) = TF(t, d) × IDF(t)
\`\`\`

Common words: high TF, low IDF (many docs contain them) → low score. Rare but relevant words: moderate TF, high IDF → high score.

\`\`\`playground
{ "title": "TF-IDF from Scratch", "language": "python", "code": "import numpy as np\\nfrom collections import Counter\\nimport math\\n\\nclass TFIDF:\\n    def __init__(self):\\n        self.vocab = {}\\n        self.idf = {}\\n        self.N = 0\\n\\n    def _tokenize(self, text):\\n        return text.lower().split()\\n\\n    def fit(self, docs):\\n        self.N = len(docs)\\n        df = Counter()\\n        all_words = set()\\n        for doc in docs:\\n            words = set(self._tokenize(doc))\\n            df.update(words)\\n            all_words.update(words)\\n        self.vocab = {w: i for i, w in enumerate(sorted(all_words))}\\n        self.idf = {w: math.log(self.N / (df[w] + 1)) for w in self.vocab}\\n\\n    def transform(self, doc):\\n        tokens = self._tokenize(doc)\\n        tf = Counter(tokens)\\n        total = len(tokens)\\n        vec = np.zeros(len(self.vocab))\\n        for word, count in tf.items():\\n            if word in self.vocab:\\n                tf_val = count / total\\n                idf_val = self.idf[word]\\n                vec[self.vocab[word]] = tf_val * idf_val\\n        return vec\\n\\ndocs = [\\n    'machine learning is great for data analysis',\\n    'deep learning neural networks are powerful',\\n    'data analysis with pandas and numpy',\\n    'natural language processing with transformers',\\n]\\n\\ntf = TFIDF()\\ntf.fit(docs)\\nvec = tf.transform('machine learning transforms data')\\n\\n# Show top scoring words\\nscores = [(score, word) for word, idx in tf.vocab.items() for score in [vec[idx]] if score > 0]\\nscores.sort(reverse=True)\\nprint('Top TF-IDF words for query doc:')\\nfor score, word in scores[:6]:\\n    print(f'  {word:<20} {score:.4f}')\\n", "runnable": true }
\`\`\`

\`\`\`compare
{ "title": "BoW / TF-IDF vs Dense Embeddings", "left": { "label": "TF-IDF", "points": ["Sparse vector (vocab_size dimensions)", "No training — computed analytically", "Interpretable: each dimension = one word", "Ignores word order and semantics", "Competitive on short text classification", "Works with tiny datasets"] }, "right": { "label": "Dense Embeddings (Word2Vec, GloVe)", "points": ["Dense vector (50-300 dimensions)", "Trained on large corpora", "Captures semantic similarity (king-queen, dog-cat)", "Context-independent — one vector per word", "Better for semantic tasks", "Requires large training corpus"] } }
\`\`\`

\`\`\`quiz
{ "question": "The word 'the' appears in 9,000 out of 10,000 documents. Its IDF score is log(10000/9000)=log(1.11)≈0.1. A rare term 'eigenvalue' appears in 5 documents: IDF=log(10000/5)=log(2000)≈7.6. What does this tell us about TF-IDF?", "options": ["'the' gets a higher TF-IDF score because it appears more frequently in each document", "'eigenvalue' will have a higher TF-IDF score than 'the' in a linear algebra document, because its rarity (high IDF) outweighs any TF advantage 'the' has", "Both words get equal scores after TF-IDF normalization", "TF-IDF cannot handle rare words and assigns them score 0"], "answer": 1, "explanation": "TF-IDF multiplies TF by IDF. Even if 'the' has TF=0.1 in a document, its TF-IDF=0.1×0.1=0.01. 'eigenvalue' might have TF=0.02, but TF-IDF=0.02×7.6=0.152 — 15× higher. This is exactly the goal: suppress common words, amplify rare but relevant ones." }
\`\`\`

\`\`\`takeaways
{ "points": ["BoW: word count vector, ignores order — simple baseline that works surprisingly well for classification", "TF-IDF: TF × IDF suppresses common words (low IDF) and highlights rare discriminative terms (high IDF)", "TF-IDF is still a strong baseline: Naïve Bayes + TF-IDF often matches deep learning on short text with small data", "Limitation: no semantic similarity — 'happy' and 'joyful' are completely unrelated in TF-IDF space"] }
\`\`\``,
    },
    {
      id: "word-embeddings",
      slug: "word-embeddings",
      title: "Word Embeddings: Word2Vec and GloVe",
      content: `# Word Embeddings: Word2Vec and GloVe

TF-IDF treats every word as independent — "king" and "queen" share zero similarity. **Word embeddings** map words to dense vectors in a semantic space where similar words are nearby. The famous result: king − man + woman ≈ queen.

\`\`\`concept
{ "title": "The Distributional Hypothesis", "variant": "info", "content": "Words that occur in similar contexts tend to have similar meanings (Firth, 1957). 'Dog' and 'cat' both appear after 'my pet', 'feed the', 'the friendly'. Word2Vec exploits this: train a shallow network to predict context words from a center word (or vice versa). After training, the network's weight matrix IS the embedding table — each row is the embedding for one word." }
\`\`\`

## Word2Vec: Skip-Gram Architecture

\`\`\`steps
{ "steps": [ { "title": "Choose center word and context window", "description": "For sentence 'the cat sat on the mat', center='sat', window=2: context = ['cat', 'on']. Positive pairs: (sat, cat), (sat, on)." }, { "title": "Forward pass through shallow network", "description": "Input: one-hot encoding of center word (vocab_size). Hidden layer: embedding lookup → dense vector (e.g., 100 dims). Output: softmax over vocab_size — predicts which words appear in context." }, { "title": "Negative sampling", "description": "Computing softmax over 50K vocab is expensive. Negative sampling: treat correct context as positive, sample k=5 random words as negatives. Binary cross-entropy instead of full softmax." }, { "title": "Extract embeddings", "description": "After training, the weight matrix between input and hidden layer is the embedding table. Row i = embedding for word i." } ] }
\`\`\`

\`\`\`playground
{ "title": "Embedding Similarity with Pretrained Vectors", "language": "python", "code": "import numpy as np\\n\\n# Simulate small word embeddings (in practice, load GloVe 300d)\\nnp.random.seed(42)\\nvocab = ['king', 'queen', 'man', 'woman', 'dog', 'cat', 'paris', 'france']\\n\\n# Manually crafted embeddings demonstrating semantic structure\\n# Dimensions: [royalty, gender_female, animal, french]\\nembeddings = np.array([\\n    [ 0.9,  0.1,  0.0,  0.1],  # king\\n    [ 0.9,  0.9,  0.0,  0.1],  # queen\\n    [ 0.1,  0.1,  0.0,  0.0],  # man\\n    [ 0.1,  0.9,  0.0,  0.0],  # woman\\n    [ 0.0,  0.0,  0.9,  0.0],  # dog\\n    [ 0.0,  0.1,  0.9,  0.1],  # cat\\n    [ 0.0,  0.0,  0.1,  0.9],  # paris\\n    [ 0.0,  0.0,  0.0,  0.9],  # france\\n])\\n\\ndef cosine_similarity(a, b):\\n    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8)\\n\\ndef most_similar(word, top_k=3):\\n    idx = vocab.index(word)\\n    sims = [(cosine_similarity(embeddings[idx], embeddings[j]), vocab[j])\\n            for j in range(len(vocab)) if j != idx]\\n    return sorted(sims, reverse=True)[:top_k]\\n\\nprint('Most similar to \\'king\\':')\\nfor sim, w in most_similar('king'):\\n    print(f'  {w:<10} {sim:.3f}')\\n\\n# Analogy: king - man + woman = ?\\nresult = embeddings[0] - embeddings[2] + embeddings[3]\\nsims = [(cosine_similarity(result, embeddings[j]), vocab[j]) for j in range(len(vocab))]\\nprint('\\\\nking - man + woman =', max(sims)[1])\\n", "runnable": true }
\`\`\`

## GloVe: Global Co-occurrence Statistics

Word2Vec trains on local context windows. GloVe (Global Vectors) uses the global word co-occurrence matrix — how often word i appears with word j across the entire corpus — and factorizes it. GloVe embeddings often outperform Word2Vec on analogy tasks.

\`\`\`quiz
{ "question": "After training Word2Vec, you compute king − man + woman. The closest vector in the embedding space is 'queen'. What property of the embedding space makes this arithmetic meaningful?", "options": ["Word2Vec uses L2 distance so arithmetic operations are always valid", "The embedding space encodes semantic relationships as linear directions — 'royalty' direction, 'gender' direction — so arithmetic navigates those directions predictably", "The model was explicitly trained on analogy pairs like king:queen::man:woman", "Cosine similarity is equivalent to vector addition in embedding spaces"], "answer": 1, "explanation": "Word2Vec's training objective (predict context from center word) causes semantic relationships to be encoded as linear directions. The vector 'queen - king' points in roughly the same direction as 'woman - man' (the gender direction). Subtracting man and adding woman cancels the gender component of king and adds the female component, arriving near queen. This was an emergent property — not explicitly trained." }
\`\`\`

\`\`\`takeaways
{ "points": ["Word embeddings map words to dense vectors where semantic similarity = geometric proximity", "Word2Vec Skip-Gram: predict context words from center word; negative sampling makes training tractable", "Embedding arithmetic encodes semantic relationships as linear directions: king - man + woman ≈ queen", "GloVe uses global co-occurrence counts; embeddings encode ratio of co-occurrence probabilities"] }
\`\`\``,
    },
    {
      id: "rnn-and-lstm",
      slug: "rnn-and-lstm",
      title: "Recurrent Networks: RNN, LSTM, and GRU",
      content: `# Recurrent Networks: RNN, LSTM, and GRU

Word embeddings represent words independently. But "not good" has the opposite sentiment of "good" — meaning depends on sequence context. **Recurrent Neural Networks** process sequences step-by-step, maintaining a hidden state that accumulates context from all previous tokens.

\`\`\`concept
{ "title": "The Hidden State as Memory", "variant": "analogy", "content": "Imagine reading a book sentence by sentence, keeping notes. After each sentence your notes update — they carry forward only what's important from previous sentences. The RNN hidden state h_t is those notes: updated at every time step, carrying context forward. The challenge: handwriting (gradient) fades over many pages (time steps) — this is the vanishing gradient problem." }
\`\`\`

## Vanilla RNN

\`\`\`
h_t = tanh(W_h · h_{t-1} + W_x · x_t + b)
y_t = W_y · h_t + b_y
\`\`\`

The same weight matrices are applied at every time step (parameter sharing across time). This means gradients must flow backward through every step — leading to vanishing gradients over long sequences.

\`\`\`playground
{ "title": "Vanilla RNN from Scratch", "language": "python", "code": "import numpy as np\\n\\nclass VanillaRNN:\\n    def __init__(self, input_size, hidden_size, output_size):\\n        scale = 0.01\\n        self.Wx = np.random.randn(hidden_size, input_size) * scale\\n        self.Wh = np.random.randn(hidden_size, hidden_size) * scale\\n        self.bh = np.zeros((hidden_size, 1))\\n        self.Wy = np.random.randn(output_size, hidden_size) * scale\\n        self.by = np.zeros((output_size, 1))\\n        self.hidden_size = hidden_size\\n\\n    def forward(self, xs):\\n        h = np.zeros((self.hidden_size, 1))\\n        outputs = []\\n        for x in xs:\\n            x = x.reshape(-1, 1)\\n            h = np.tanh(self.Wx @ x + self.Wh @ h + self.bh)\\n            y = self.Wy @ h + self.by\\n            outputs.append(y)\\n        return outputs, h\\n\\n# Process a sequence of 5 token embeddings (4-dim each)\\nnp.random.seed(42)\\nrnn = VanillaRNN(input_size=4, hidden_size=8, output_size=2)\\nsequence = [np.random.randn(4) for _ in range(5)]\\noutputs, final_h = rnn.forward(sequence)\\nprint(f'Input sequence length: {len(sequence)}, each token dim: 4')\\nprint(f'Hidden state size: {rnn.hidden_size}')\\nprint(f'Final hidden state (context vector): {final_h.flatten().round(3)}')\\nprint(f'Output at each step: shape {outputs[0].shape}')\\nprint(f'Last output (e.g., for classification): {outputs[-1].flatten().round(3)}')\\n", "runnable": true }
\`\`\`

## LSTM: Long Short-Term Memory

\`\`\`concept
{ "title": "Three Gates, One Cell State", "variant": "info", "content": "LSTM adds a cell state c_t (separate from hidden state h_t) that runs straight through time with only minor linear interactions — gradients flow much more easily. Three gates control information flow: (1) Forget gate: what to erase from cell state. (2) Input gate: what new information to write. (3) Output gate: what to read from cell state into hidden state. Gates are sigmoid (0-1) — continuous on/off switches." }
\`\`\`

\`\`\`compare
{ "title": "RNN vs LSTM vs GRU", "left": { "label": "Vanilla RNN", "points": ["Single hidden state h_t", "Vanishing gradients over long sequences", "Forgets context >10-20 steps back", "Fastest to compute", "Use only for very short sequences"] }, "right": { "label": "LSTM / GRU", "points": ["LSTM: cell state + hidden state + 3 gates", "GRU: 2 gates, merged cell+hidden — simpler", "Handles dependencies 100+ steps long", "GRU: ~same accuracy as LSTM, 33% fewer params", "Both largely replaced by Transformers for NLP"] } }
\`\`\`

\`\`\`quiz
{ "question": "In an LSTM, the forget gate output is 0.05 for the 'year' dimension of the cell state after reading the token 'however'. What does this mean?", "options": ["The LSTM will output 'year' information with weight 0.05", "The cell state's 'year' information will be multiplied by 0.05 — nearly erased — at this time step", "The LSTM's gradient for the 'year' dimension is 0.05", "The input gate will amplify 'year' by a factor of 1/0.05=20"], "answer": 1, "explanation": "The forget gate value f_t is multiplied element-wise with the previous cell state: c_t = f_t ⊙ c_{t-1} + i_t ⊙ g_t. A forget gate of 0.05 means the 'year' dimension of c_{t-1} is multiplied by 0.05 — nearly zeroed out. The LSTM has learned that the token 'however' signals a topic change, making previously tracked 'year' information irrelevant going forward." }
\`\`\`

\`\`\`takeaways
{ "points": ["RNN: same weights at every step — vanishing gradients make it forget context beyond ~20 steps", "LSTM: cell state as a highway for gradients; three gates control read/write/erase", "GRU: two gates, merged cell/hidden state — simpler than LSTM, similar accuracy, 33% fewer parameters", "Both are now largely replaced by Transformers for NLP, but still used for time-series and short sequences"] }
\`\`\``,
    },
    {
      id: "attention-mechanism",
      slug: "attention-mechanism",
      title: "The Attention Mechanism",
      content: `# The Attention Mechanism

LSTMs encode an entire sequence into a fixed-size vector — a bottleneck when translating long sentences. The encoder must compress "the old man who had lived in the house by the river for forty years looked up" into a single vector that the decoder decodes word by word. Critical information gets lost.

**Attention** lets the decoder look back at all encoder states at every decoding step, focusing on relevant parts dynamically.

\`\`\`concept
{ "title": "Attention: Soft Search over Memory", "variant": "analogy", "content": "Imagine translating a sentence. You don't compress the entire source into your head first. Instead, when writing each target word, you glance back at the source and focus on the relevant words. When translating 'the cat', you focus on 'le chat'. When translating 'sat', you focus on 'assis'. Attention gives the model exactly this glance-back mechanism — dynamically weighted access to all encoder states." }
\`\`\`

## Bahdanau Attention

\`\`\`steps
{ "steps": [ { "title": "Compute alignment scores", "description": "For each encoder hidden state h_i, compute alignment with current decoder state s_t: e_{t,i} = score(s_t, h_i). Score function: a small feedforward network (Bahdanau) or dot product (Luong)." }, { "title": "Normalize with softmax", "description": "alpha_{t,i} = softmax(e_{t,i}). These are attention weights — they sum to 1 and represent how much to focus on encoder position i when decoding step t." }, { "title": "Compute context vector", "description": "c_t = sum_i(alpha_{t,i} * h_i). A weighted sum of all encoder states, where high-attention positions contribute more." }, { "title": "Decode with context", "description": "New decoder state: s_t = LSTM(s_{t-1}, [y_{t-1}, c_t]). The context vector is concatenated with the previous output token before the LSTM step." } ] }
\`\`\`

\`\`\`playground
{ "title": "Dot-Product Attention from Scratch", "language": "python", "code": "import numpy as np\\n\\ndef softmax(x):\\n    e = np.exp(x - x.max())\\n    return e / e.sum()\\n\\ndef dot_product_attention(query, keys, values):\\n    '''\\n    query: decoder state (d_k,)\\n    keys:  encoder states (seq_len, d_k)\\n    values: encoder states (seq_len, d_v)\\n    Returns: context vector (d_v,), attention weights (seq_len,)\\n    '''\\n    d_k = keys.shape[1]\\n    # Scaled dot-product scores\\n    scores = (keys @ query) / np.sqrt(d_k)\\n    weights = softmax(scores)\\n    context = weights @ values\\n    return context, weights\\n\\n# Simulate: encoder processed 5 tokens, hidden dim=4\\nnp.random.seed(42)\\nseq_len, d_k = 5, 4\\nencoder_states = np.random.randn(seq_len, d_k)\\ndecoder_query = np.random.randn(d_k)\\n\\ncontext, weights = dot_product_attention(decoder_query, encoder_states, encoder_states)\\nprint('Encoder positions: 0 1 2 3 4')\\nprint(f'Attention weights: {weights.round(3)}')\\nprint(f'Sum of weights: {weights.sum():.4f}')\\nprint(f'Most attended position: {weights.argmax()}')\\nprint(f'Context vector shape: {context.shape}')\\n", "runnable": true }
\`\`\`

## Scaled Dot-Product: Why the 1/√d_k Scaling?

In high dimensions, dot products grow large — after softmax, one score dominates (near 1, rest near 0), gradient vanishes. Dividing by √d_k keeps scores in a reasonable range and softmax gradients healthy.

\`\`\`quiz
{ "question": "In sequence-to-sequence translation with attention, the model translates English to French. When generating the French word 'chat' (cat), the attention weights are highest on the English word 'cat'. What does this tell us?", "options": ["The model memorized the English-French dictionary", "The attention mechanism learned to align source and target words by position in the sentence", "The model discovered that 'cat' and 'chat' are the most semantically relevant source-target pair at this decoding step, without explicit alignment supervision", "Attention forces a one-to-one word mapping between languages"], "answer": 2, "explanation": "Attention weights are learned end-to-end from the translation objective alone — no explicit word alignment labels are provided. The model discovers that when generating 'chat', the encoder representation for 'cat' is most useful (highest alignment score). This emergent alignment was one of the first pieces of evidence that attention learns interpretable word correspondences." }
\`\`\`

\`\`\`takeaways
{ "points": ["Attention solves the LSTM bottleneck: decoder can attend to all encoder states instead of only the final one", "Attention weights = softmax(score(query, keys)) — sum to 1, each is 'how much to focus on encoder position i'", "Scaled dot-product: divide by sqrt(d_k) to prevent attention from becoming one-hot in high dimensions", "Multi-head attention (Transformers): run H attention heads in parallel, each learning different relationships"] }
\`\`\``,
    },
    {
      id: "transformer-intuition",
      slug: "transformer-intuition",
      title: "Transformer Architecture Intuition",
      content: `# Transformer Architecture Intuition

RNNs process sequences one token at a time — inherently sequential, can't parallelize. The **Transformer** (Vaswani et al., 2017) replaces recurrence with self-attention: every token directly attends to every other token simultaneously. This enables full parallelism and has dominated NLP since 2018.

\`\`\`concept
{ "title": "Self-Attention: Every Token Talks to Every Token", "variant": "info", "content": "In a Transformer encoder, the word 'bank' in 'river bank' and 'bank account' should have different representations. Self-attention computes each token's representation as a weighted sum of ALL other tokens in the same sequence — context-dependent. The weights come from attention between the token's query and every other token's key." }
\`\`\`

## Queries, Keys, and Values

Each token x produces three vectors via learned projections:
- **Query (Q)**: "What am I looking for?"
- **Key (K)**: "What do I contain?"
- **Value (V)**: "What information do I provide?"

Attention: Softmax(QK^T / √d_k) · V

\`\`\`playground
{ "title": "Self-Attention Layer from Scratch", "language": "python", "code": "import numpy as np\\n\\ndef softmax(x, axis=-1):\\n    e = np.exp(x - x.max(axis=axis, keepdims=True))\\n    return e / e.sum(axis=axis, keepdims=True)\\n\\nclass SelfAttention:\\n    def __init__(self, d_model, d_k):\\n        np.random.seed(42)\\n        scale = 0.1\\n        self.Wq = np.random.randn(d_model, d_k) * scale\\n        self.Wk = np.random.randn(d_model, d_k) * scale\\n        self.Wv = np.random.randn(d_model, d_k) * scale\\n        self.d_k = d_k\\n\\n    def forward(self, X, mask=None):\\n        # X: (seq_len, d_model)\\n        Q = X @ self.Wq  # (seq_len, d_k)\\n        K = X @ self.Wk\\n        V = X @ self.Wv\\n        scores = Q @ K.T / np.sqrt(self.d_k)  # (seq_len, seq_len)\\n        if mask is not None:\\n            scores = np.where(mask, scores, -1e9)\\n        weights = softmax(scores, axis=-1)\\n        return weights @ V, weights  # (seq_len, d_k)\\n\\n# Sequence of 4 tokens, embedding dim=8\\nseq_len, d_model, d_k = 4, 8, 4\\nX = np.random.randn(seq_len, d_model)\\nattn = SelfAttention(d_model, d_k)\\nout, weights = attn.forward(X)\\n\\nprint(f'Input: {seq_len} tokens, d_model={d_model}')\\nprint(f'Output shape: {out.shape}  (same seq_len, now d_k={d_k})')\\nprint(f'Attention matrix (each row sums to 1):')\\nprint(weights.round(3))\\n", "runnable": true }
\`\`\`

## Why Transformers Dominate

\`\`\`compare
{ "title": "RNN vs Transformer", "left": { "label": "RNN / LSTM", "points": ["Sequential — must process t before t+1", "O(n) sequential operations — can't parallelize", "Maximum path length O(n) — long-range dependencies hard", "Relatively small model size", "Still useful for streaming/online tasks"] }, "right": { "label": "Transformer", "points": ["Fully parallel — all tokens processed simultaneously", "O(1) sequential operations", "Direct attention between any two positions — O(1) path length", "Scales to billions of parameters", "Basis for BERT, GPT, T5, LLaMA, Claude"] } }
\`\`\`

## Positional Encoding

Self-attention has no notion of token order — "the dog bit the man" and "the man bit the dog" would produce identical attention patterns without positional information. Positional encodings (sinusoidal or learned) are added to token embeddings before the first attention layer.

\`\`\`quiz
{ "question": "A Transformer encoder processes a 10-token sequence. Without positional encodings, what problem arises?", "options": ["The attention matrix becomes too large to compute", "The model treats the sequence as a bag of words — word order is invisible to the model, making 'dog bites man' and 'man bites dog' identical", "Gradients vanish through the attention layers", "The softmax in attention produces uniform weights across all positions"], "answer": 1, "explanation": "Self-attention computes attention scores based on the content of Query and Key vectors, not their positions. Without positional encodings, permuting the input tokens produces identical attention scores (just permuted rows/columns) — the model is permutation-invariant. Positional encodings inject position information into the token embeddings, making the model aware of token order." }
\`\`\`

\`\`\`takeaways
{ "points": ["Self-attention: each token attends to all others simultaneously — O(1) sequential depth, fully parallelizable", "Q, K, V: query asks 'what am I looking for', key answers 'what do I have', value is 'what I contribute'", "Scale by 1/sqrt(d_k) to prevent attention from collapsing to one-hot in high dimensions", "Positional encodings add token position information — without them, Transformers are order-invariant"] }
\`\`\``,
    },
    {
      id: "nlp-checkpoint",
      slug: "nlp-checkpoint",
      title: "Checkpoint: Sentiment Classifier Pipeline",
      content: `# Checkpoint: Sentiment Classifier Pipeline

\`\`\`callout
{ "variant": "info", "title": "Module Checkpoint", "content": "Apply text preprocessing, TF-IDF, and sequence modeling concepts to build an end-to-end sentiment classifier. Work through the quiz battery, then implement the TF-IDF baseline." }
\`\`\`

## End-to-End Sentiment Pipeline

\`\`\`playground
{ "title": "TF-IDF + Logistic Regression Sentiment Classifier", "language": "python", "code": "import numpy as np\\nfrom collections import Counter\\nimport math\\n\\n# Minimal TF-IDF + Logistic Regression sentiment classifier\\nreviews = [\\n    ('this movie was absolutely amazing and wonderful', 1),\\n    ('great acting and brilliant storyline loved it', 1),\\n    ('fantastic film highly recommend to everyone', 1),\\n    ('terrible waste of time boring and awful', 0),\\n    ('worst movie ever seen completely disappointing', 0),\\n    ('bad acting poor plot would not recommend', 0),\\n    ('decent film some good moments but slow', 1),\\n    ('not bad but not great either mediocre', 0),\\n]\\n\\ntexts = [r[0] for r in reviews]\\nlabels = np.array([r[1] for r in reviews])\\n\\n# Build vocabulary\\nall_words = [w for t in texts for w in t.split()]\\nvocab = list(set(all_words))\\nword2id = {w: i for i, w in enumerate(vocab)}\\nN = len(texts)\\n\\n# TF-IDF features\\ndef tfidf_vec(text):\\n    tokens = text.split()\\n    tf = Counter(tokens)\\n    total = len(tokens)\\n    vec = np.zeros(len(vocab))\\n    for word, count in tf.items():\\n        if word in word2id:\\n            df = sum(1 for t in texts if word in t.split())\\n            idf = math.log(N / (df + 1))\\n            vec[word2id[word]] = (count/total) * idf\\n    return vec\\n\\nX = np.array([tfidf_vec(t) for t in texts])\\n\\n# Logistic regression (gradient descent)\\nW = np.zeros(len(vocab))\\nb = 0.0\\nlr = 0.5\\nfor epoch in range(200):\\n    z = X @ W + b\\n    pred = 1 / (1 + np.exp(-z))\\n    err = pred - labels\\n    W -= lr * (X.T @ err) / N\\n    b -= lr * err.mean()\\n\\n# Evaluate\\npreds = (1 / (1 + np.exp(-(X @ W + b))) > 0.5).astype(int)\\nacc = (preds == labels).mean()\\nprint(f'Train accuracy: {acc:.0%}')\\nprint()\\nprint('Top positive words:')\\ntop_pos = sorted(zip(W, vocab), reverse=True)[:5]\\nfor score, word in top_pos:\\n    print(f'  {word:<20} {score:+.3f}')\\nprint('Top negative words:')\\ntop_neg = sorted(zip(W, vocab))[:5]\\nfor score, word in top_neg:\\n    print(f'  {word:<20} {score:+.3f}')\\n", "runnable": true }
\`\`\`

## Quiz Battery

\`\`\`quiz
{ "question": "A sentiment model performs well on movie reviews (training domain) but poorly on product reviews (test domain). This is:", "options": ["Overfitting — the model memorized training reviews", "Domain shift — the vocabulary and writing style differ between movie and product reviews", "Underfitting — the model didn't train long enough", "A tokenization error — product reviews use different punctuation"], "answer": 1, "explanation": "Domain shift (covariate shift) occurs when the test distribution differs from training. Movie reviews ('storyline', 'acting', 'cinematography') use different vocabulary than product reviews ('shipping', 'packaging', 'durable'). The TF-IDF features trained on movie vocab have zero value for product-specific terms. Solution: fine-tune on a small set of labeled product reviews, or use domain-adapted embeddings." }
\`\`\`

\`\`\`quiz
{ "question": "An LSTM sentiment classifier processes 'The food was not bad'. At which step does the LSTM context become critical for correct classification?", "options": ["Step 1 — 'The' sets the positive sentiment", "Step 4 — 'not' must be remembered when processing 'bad' at step 5 to understand negation", "Step 5 — 'bad' determines sentiment alone", "The LSTM processes all tokens simultaneously so no single step is critical"], "answer": 1, "explanation": "Sentiment depends on negation: 'not bad' = positive, 'bad' = negative. The LSTM must retain the 'not' signal through the hidden state until 'bad' is processed. This is exactly the kind of short-range dependency (distance 1) that even vanilla RNNs handle well. For long-range negation ('The movie, despite its many flaws, was not entirely without merit'), LSTMs struggle — Transformers handle this better via direct attention." }
\`\`\`

\`\`\`quiz
{ "question": "You fine-tune a pretrained BERT model for sentiment classification. The final layer is a linear classifier on the [CLS] token representation. Which approach to training gives the best accuracy?", "options": ["Freeze all BERT layers, only train the linear classifier", "Unfreeze all layers, train with the same LR used for BERT's pretraining (1e-3)", "Unfreeze all layers, use a very small LR (2e-5) with warmup — standard for fine-tuning BERT", "Only unfreeze the last 2 layers to avoid catastrophic forgetting"], "answer": 2, "explanation": "BERT fine-tuning best practices: (1) unfreeze all layers, (2) use very small LR (1e-5 to 5e-5 — 50-100× smaller than Adam default 1e-3), (3) use linear warmup for the first 10% of steps, (4) train for 2-4 epochs. The small LR prevents catastrophic forgetting — large updates would destroy BERT's pretrained representations. This is the approach used in the original BERT paper." }
\`\`\`

\`\`\`takeaways
{ "points": ["TF-IDF + Logistic Regression is a strong baseline — always try it before building a neural model", "Domain shift is the most common real-world deployment failure — evaluate on target domain early", "BERT fine-tuning: all layers unfrozen, LR=2e-5, 2-4 epochs, warmup — these specific values matter", "Attention weights are interpretable — visualize them to understand what the model focuses on"] }
\`\`\``,
    },
  ],
};
