import { Module } from "../types";

export const ragFundamentalsModule: Module = {
  id: "rag-fundamentals",
  title: "RAG Fundamentals",
  description: "Understand the core concepts of Retrieval-Augmented Generation — vector databases, embeddings, the basic RAG pipeline, chunking strategies, and evaluation metrics.",
  lessons: [
    {
      id: "rf-what-is-rag",
      slug: "what-is-rag",
      title: "What is RAG?",
      content: `## What is RAG?

**Retrieval-Augmented Generation (RAG)** is a technique that enhances LLM responses by retrieving relevant information from external knowledge sources before generating an answer. Instead of relying solely on the model's training data, RAG grounds responses in your specific documents, databases, or knowledge bases.

### The Problem RAG Solves

LLMs have three fundamental limitations:

1. **Knowledge cutoff**: They don't know about events after their training date
2. **Hallucination**: They can confidently state things that aren't true
3. **No private data**: They can't access your company's internal documents

RAG addresses all three by giving the LLM access to external, up-to-date, private data at query time.

### The Basic RAG Pipeline

\`\`\`
Indexing Phase (done once):
  Documents → Chunk → Embed → Store in Vector Database

Query Phase (every question):
  User Query → Embed → Search Vector DB → Retrieve Top-K Documents
  → Augment Prompt with Documents → Generate Answer
\`\`\`

### A Concrete Example

**Without RAG:**
\`\`\`
User: "What is our company's vacation policy?"
LLM: "I don't have access to your company's policies. Generally, companies offer..."
\`\`\`

**With RAG:**
\`\`\`
User: "What is our company's vacation policy?"
→ Search vector DB for "vacation policy"
→ Retrieved: "Employees receive 20 days PTO annually, accruing 1.67 days per month..."
→ LLM: "According to your company policy, employees receive 20 days of PTO per year,
         which accrues at a rate of 1.67 days per month..."
\`\`\`

### Why RAG Over Fine-Tuning?

| Aspect | Fine-Tuning | RAG |
|--------|------------|-----|
| **Data freshness** | Frozen at training time | Always up-to-date |
| **Cost** | Expensive ($$$) | Cheap per update |
| **Transparency** | Black box | Can cite sources |
| **Accuracy** | May still hallucinate | Grounded in retrieved docs |
| **Speed to update** | Hours/days to retrain | Minutes to re-index |
| **Best for** | Teaching new skills/style | Providing knowledge |

### RAG Architecture Components

\`\`\`
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Data Sources │   │   Embeddings │   │ Vector Store │
│  (docs, PDFs, │ → │   (convert   │ → │  (store and  │
│   APIs, DBs)  │   │  to vectors) │   │   search)    │
└──────────────┘   └──────────────┘   └──────────────┘
                                             ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  LLM Output  │ ← │   LLM Call   │ ← │  Retrieved   │
│  (grounded   │   │  (augmented  │   │  Documents   │
│   answer)    │   │   prompt)    │   │  (top-K)     │
└──────────────┘   └──────────────┘   └──────────────┘
\`\`\`

### When to Use RAG

- **Question answering** over private documents
- **Customer support** with product-specific knowledge
- **Legal/medical** systems that need source citations
- **Code assistance** with project-specific context
- **Enterprise search** with natural language queries

### Key Takeaway

RAG is the most practical way to give LLMs access to your specific data without retraining them. The core idea is simple: search for relevant documents, include them in the prompt, and let the LLM generate a grounded answer. The complexity lies in doing each step well — which is what the rest of this course covers.

> **Resource**: [RAG Techniques](https://github.com/NirDiamant/RAG_Techniques) — A comprehensive collection of 25+ RAG strategies with implementations and tutorials.`,
    },
    {
      id: "rf-vector-dbs",
      slug: "vector-databases-embeddings",
      title: "Vector Databases & Embeddings",
      content: `## Vector Databases & Embeddings

The foundation of every RAG system is the ability to convert text into numerical vectors (embeddings) and efficiently search through them. This lesson covers how embeddings work and the vector databases that store them.

### What Are Embeddings?

An **embedding** is a dense numerical vector that captures the semantic meaning of a piece of text. Similar meanings produce similar vectors.

\`\`\`
"The cat sat on the mat"  → [0.23, -0.41, 0.87, 0.12, ...]  (768 dimensions)
"A kitten rested on the rug" → [0.21, -0.39, 0.85, 0.14, ...]  (very similar!)
"Stock prices rose today"    → [-0.52, 0.78, -0.11, 0.45, ...] (very different)
\`\`\`

### How Embeddings Are Created

Embedding models are trained on massive text datasets to learn semantic relationships:

\`\`\`python
from openai import OpenAI
client = OpenAI()

response = client.embeddings.create(
    model="text-embedding-3-small",
    input="What is the meaning of life?"
)
vector = response.data[0].embedding
print(f"Dimensions: {len(vector)}")  # 1536
print(f"First 5 values: {vector[:5]}")
\`\`\`

### Popular Embedding Models

| Model | Dimensions | Provider | Best For |
|-------|-----------|----------|----------|
| **text-embedding-3-small** | 1536 | OpenAI | General purpose, cost-effective |
| **text-embedding-3-large** | 3072 | OpenAI | Maximum quality |
| **voyage-3** | 1024 | Voyage AI | Code and technical content |
| **all-MiniLM-L6-v2** | 384 | Sentence Transformers | Free, local, fast |
| **nomic-embed-text** | 768 | Nomic AI | Open source, good quality |

### Similarity Search

Once text is embedded, we can find similar documents using distance metrics:

\`\`\`python
import numpy as np

def cosine_similarity(a, b):
    """Higher = more similar. Range: -1 to 1."""
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Embed query and documents
query_vec = embed("How do I reset my password?")
doc_vecs = [embed(doc) for doc in documents]

# Find most similar
similarities = [cosine_similarity(query_vec, dv) for dv in doc_vecs]
top_indices = np.argsort(similarities)[::-1][:5]  # Top 5

for i in top_indices:
    print(f"Score: {similarities[i]:.3f} | {documents[i][:80]}...")
\`\`\`

### Vector Databases

Vector databases are optimized for storing and searching embedding vectors at scale:

| Database | Type | Best For | Key Feature |
|----------|------|----------|-------------|
| **Chroma** | Embedded | Prototyping, small data | Simple Python API |
| **Pinecone** | Cloud | Production, managed | Serverless, auto-scaling |
| **Weaviate** | Self-hosted/Cloud | Hybrid search | Built-in ML models |
| **Qdrant** | Self-hosted/Cloud | Performance | Rust-based, fast |
| **pgvector** | PostgreSQL extension | Existing Postgres users | No new infra needed |
| **FAISS** | Library (Meta) | Large-scale, local | Billion-scale search |

### Using Chroma (Quick Start)

\`\`\`python
import chromadb

# Create client and collection
client = chromadb.Client()
collection = client.create_collection("my_docs")

# Add documents (Chroma embeds automatically)
collection.add(
    documents=[
        "Password reset: Go to Settings > Security > Reset Password",
        "Billing: View invoices under Account > Billing History",
        "Two-factor auth: Enable 2FA in Settings > Security > 2FA",
    ],
    ids=["doc1", "doc2", "doc3"]
)

# Query
results = collection.query(
    query_texts=["How do I change my password?"],
    n_results=2
)
print(results["documents"])
# [['Password reset: Go to Settings > Security > Reset Password',
#   'Two-factor auth: Enable 2FA in Settings > Security > 2FA']]
\`\`\`

### Indexing Strategies

Vector databases use approximate nearest neighbor (ANN) algorithms for fast search:

- **HNSW (Hierarchical Navigable Small World)**: Best balance of speed and accuracy. Used by most modern vector DBs.
- **IVF (Inverted File Index)**: Partitions vectors into clusters. Good for large datasets.
- **PQ (Product Quantization)**: Compresses vectors for memory efficiency. Trades accuracy for speed.

### Key Takeaway

Embeddings convert text into searchable vectors that capture semantic meaning. Vector databases store these embeddings and provide fast similarity search. For prototyping, use Chroma or FAISS. For production, evaluate Pinecone, Qdrant, or pgvector based on your infrastructure. The choice of embedding model matters as much as the database — test different models on your specific data.`,
    },
    {
      id: "rf-basic-pipeline",
      slug: "basic-rag-pipeline",
      title: "Basic RAG Pipeline",
      content: `## Basic RAG Pipeline

Let's build a complete RAG pipeline from scratch. This covers the end-to-end flow: loading documents, chunking, embedding, storing, retrieving, and generating answers.

### The Complete Pipeline

\`\`\`
Phase 1 — Indexing:
  Load Documents → Split into Chunks → Generate Embeddings → Store in Vector DB

Phase 2 — Querying:
  User Question → Embed Question → Search Vector DB → Retrieve Top-K
  → Build Prompt (question + context) → LLM Generates Answer
\`\`\`

### Step 1: Load Documents

\`\`\`python
import os

def load_documents(directory: str) -> list:
    """Load all text and markdown files from a directory."""
    documents = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith((".txt", ".md", ".py", ".ts")):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                documents.append({
                    "content": content,
                    "source": path,
                    "filename": file
                })
    return documents

docs = load_documents("./knowledge-base")
print(f"Loaded {len(docs)} documents")
\`\`\`

### Step 2: Chunk Documents

\`\`\`python
def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list:
    """Split text into overlapping chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]

        # Try to break at a sentence boundary
        if end < len(text):
            last_period = chunk.rfind(".")
            last_newline = chunk.rfind("\\n")
            break_point = max(last_period, last_newline)
            if break_point > chunk_size * 0.5:
                chunk = chunk[:break_point + 1]
                end = start + break_point + 1

        chunks.append(chunk.strip())
        start = end - overlap  # Overlap for context continuity

    return [c for c in chunks if len(c) > 20]  # Filter tiny chunks

# Chunk all documents
all_chunks = []
for doc in docs:
    chunks = chunk_text(doc["content"])
    for chunk in chunks:
        all_chunks.append({
            "content": chunk,
            "source": doc["source"],
            "filename": doc["filename"]
        })

print(f"Created {len(all_chunks)} chunks from {len(docs)} documents")
\`\`\`

### Step 3: Embed and Store

\`\`\`python
import chromadb
from chromadb.utils import embedding_functions

# Use OpenAI embeddings (or any other provider)
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key="YOUR_API_KEY",
    model_name="text-embedding-3-small"
)

# Create collection with embedding function
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(
    name="knowledge_base",
    embedding_function=openai_ef
)

# Add chunks in batches
batch_size = 100
for i in range(0, len(all_chunks), batch_size):
    batch = all_chunks[i:i+batch_size]
    collection.add(
        documents=[c["content"] for c in batch],
        metadatas=[{"source": c["source"], "filename": c["filename"]}
                   for c in batch],
        ids=[f"chunk_{i+j}" for j in range(len(batch))]
    )

print(f"Indexed {len(all_chunks)} chunks in vector database")
\`\`\`

### Step 4: Retrieve and Generate

\`\`\`python
from anthropic import Anthropic

llm_client = Anthropic()

def rag_query(question: str, n_results: int = 5) -> str:
    """Complete RAG pipeline: retrieve context, then generate answer."""

    # Retrieve relevant chunks
    results = collection.query(
        query_texts=[question],
        n_results=n_results,
        include=["documents", "metadatas", "distances"]
    )

    # Build context from retrieved chunks
    context_parts = []
    sources = set()
    for doc, meta, distance in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    ):
        context_parts.append(doc)
        sources.add(meta["source"])

    context = "\\n\\n---\\n\\n".join(context_parts)

    # Generate answer with context
    response = llm_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": (
                f"Answer the question based on the provided context. "
                f"If the context doesn't contain the answer, say so.\\n\\n"
                f"Context:\\n{context}\\n\\n"
                f"Question: {question}"
            )
        }]
    )

    answer = response.content[0].text
    source_list = "\\n".join(f"- {s}" for s in sources)

    return f"{answer}\\n\\nSources:\\n{source_list}"

# Use it
answer = rag_query("How do I reset my password?")
print(answer)
\`\`\`

### The Prompt Template

The prompt template is crucial for RAG quality:

\`\`\`python
RAG_PROMPT = """You are a helpful assistant. Answer the user's question based
on the provided context documents.

Rules:
1. Only use information from the context to answer
2. If the context doesn't contain the answer, say "I don't have information about that"
3. Cite which document(s) you used by referencing the source
4. Be concise but thorough

Context:
{context}

Question: {question}

Answer:"""
\`\`\`

### Key Takeaway

A basic RAG pipeline has two phases: indexing (chunk, embed, store) and querying (embed query, retrieve, generate). Each step can be optimized — better chunking, better embeddings, better retrieval, better prompts. The rest of this course covers these optimizations in depth.

> **Resource**: [RAG Techniques — Basic RAG](https://github.com/NirDiamant/RAG_Techniques) includes Jupyter notebooks implementing this exact pipeline with various configurations.`,
    },
    {
      id: "rf-chunking",
      slug: "chunking-strategies",
      title: "Chunking Strategies",
      content: `## Chunking Strategies

Chunking — how you split documents into smaller pieces — is one of the most impactful decisions in RAG pipeline design. Bad chunking leads to irrelevant retrieval, lost context, and poor answers. Good chunking preserves meaning and enables precise retrieval.

### Why Chunking Matters

Embedding models have input limits (typically 512-8192 tokens), and smaller, focused chunks retrieve more precisely than large, diffuse ones. But chunks too small lose context. The goal: **each chunk should contain one coherent idea with enough context to be useful on its own.**

### Strategy 1: Fixed-Size Chunking

The simplest approach — split every N characters/tokens with overlap:

\`\`\`python
def fixed_size_chunk(text: str, size: int = 500, overlap: int = 50) -> list:
    chunks = []
    for i in range(0, len(text), size - overlap):
        chunks.append(text[i:i+size])
    return chunks
\`\`\`

**Pros**: Simple, predictable chunk sizes
**Cons**: Splits mid-sentence, mid-paragraph, mid-idea

### Strategy 2: Recursive Character Splitting

Split on natural boundaries in order of preference: paragraphs, sentences, words:

\`\`\`python
def recursive_split(text: str, chunk_size: int = 500, separators: list = None) -> list:
    if separators is None:
        separators = ["\\n\\n", "\\n", ". ", " "]

    chunks = []
    separator = separators[0]
    parts = text.split(separator)

    current_chunk = ""
    for part in parts:
        if len(current_chunk) + len(part) + len(separator) <= chunk_size:
            current_chunk += (separator if current_chunk else "") + part
        else:
            if current_chunk:
                chunks.append(current_chunk)
            if len(part) > chunk_size and len(separators) > 1:
                # Recursively split with next separator
                sub_chunks = recursive_split(part, chunk_size, separators[1:])
                chunks.extend(sub_chunks)
            else:
                current_chunk = part

    if current_chunk:
        chunks.append(current_chunk)

    return chunks
\`\`\`

**Pros**: Respects document structure, preserves sentences
**Cons**: Variable chunk sizes, may still split related content

### Strategy 3: Semantic Chunking

Group sentences by semantic similarity — sentences about the same topic stay together:

\`\`\`python
def semantic_chunk(text: str, threshold: float = 0.5) -> list:
    """Group sentences by semantic similarity."""
    import nltk
    sentences = nltk.sent_tokenize(text)

    # Embed each sentence
    embeddings = [embed(s) for s in sentences]

    # Group sentences with high similarity to their neighbors
    chunks = []
    current_chunk = [sentences[0]]

    for i in range(1, len(sentences)):
        sim = cosine_similarity(embeddings[i-1], embeddings[i])
        if sim > threshold:
            current_chunk.append(sentences[i])
        else:
            chunks.append(" ".join(current_chunk))
            current_chunk = [sentences[i]]

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks
\`\`\`

**Pros**: Chunks are semantically coherent, natural topic boundaries
**Cons**: Requires embedding each sentence (expensive), variable sizes

### Strategy 4: Proposition-Based Chunking

Decompose documents into atomic "propositions" — single, self-contained facts:

\`\`\`python
def proposition_chunk(text: str) -> list:
    """Extract atomic propositions from text using an LLM."""
    propositions = llm(
        f"Decompose this text into atomic propositions. "
        f"Each proposition should:\\n"
        f"1. Express a single, complete fact\\n"
        f"2. Be understandable without additional context\\n"
        f"3. Include necessary entities (replace pronouns)\\n\\n"
        f"Text: {text}\\n\\n"
        f"Return one proposition per line."
    )
    return [p.strip() for p in propositions.split("\\n") if p.strip()]
\`\`\`

**Example:**
\`\`\`
Input: "Apple, founded in 1976 by Steve Jobs, Steve Wozniak, and Ronald Wayne,
        is now the world's most valuable company. Its iPhone revolutionized
        the smartphone industry when it launched in 2007."

Propositions:
1. Apple was founded in 1976.
2. Apple was co-founded by Steve Jobs, Steve Wozniak, and Ronald Wayne.
3. Apple is the world's most valuable company.
4. The iPhone was created by Apple.
5. The iPhone launched in 2007.
6. The iPhone revolutionized the smartphone industry.
\`\`\`

**Pros**: Maximum precision in retrieval, self-contained facts
**Cons**: Very expensive (LLM call per document), many small chunks

### Strategy 5: Document-Structure-Aware Chunking

Use the document's structure (headings, sections, code blocks) as natural boundaries:

\`\`\`python
def markdown_chunk(text: str) -> list:
    """Split markdown by headers, preserving hierarchy."""
    chunks = []
    current_chunk = ""
    current_header = ""

    for line in text.split("\\n"):
        if line.startswith("#"):
            if current_chunk.strip():
                chunks.append(f"{current_header}\\n{current_chunk}".strip())
            current_header = line
            current_chunk = ""
        else:
            current_chunk += line + "\\n"

    if current_chunk.strip():
        chunks.append(f"{current_header}\\n{current_chunk}".strip())

    return chunks
\`\`\`

### Choosing a Strategy

| Strategy | Best For | Chunk Quality | Cost |
|----------|---------|:------------:|:----:|
| Fixed-size | Quick prototyping | Low | Free |
| Recursive | General use | Medium | Free |
| Semantic | Mixed-topic documents | High | Medium |
| Proposition | Fact-heavy documents | Highest | High |
| Structure-aware | Markdown, HTML, code | High | Free |

### Key Takeaway

Chunking is not a one-size-fits-all problem. Start with recursive character splitting for prototyping, then experiment with semantic or structure-aware chunking for production. The best strategy depends on your document types, query patterns, and quality requirements. Always evaluate chunk quality by testing retrieval on real queries.`,
    },
    {
      id: "rf-evaluation",
      slug: "evaluation-basics",
      title: "Evaluation Basics",
      content: `## Evaluation Basics

You can't improve what you can't measure. RAG evaluation tells you whether your pipeline retrieves the right documents and generates faithful answers. Without evaluation, you're optimizing blind.

### The Three Pillars of RAG Evaluation

\`\`\`
                    RAG Pipeline
                   /     |      \\
            Retrieval  Generation  End-to-End
            Quality    Quality     Quality
\`\`\`

### Pillar 1: Retrieval Quality

Does the retriever find the right documents?

**Context Precision**: What fraction of retrieved documents are relevant?
\`\`\`
Retrieved: [Doc A (relevant), Doc B (irrelevant), Doc C (relevant), Doc D (irrelevant)]
Context Precision = 2/4 = 0.50
\`\`\`

**Context Recall**: What fraction of relevant documents were retrieved?
\`\`\`
All relevant docs: [Doc A, Doc C, Doc E]
Retrieved relevant: [Doc A, Doc C]
Context Recall = 2/3 = 0.67
\`\`\`

**Mean Reciprocal Rank (MRR)**: Where does the first relevant document appear?
\`\`\`
Query 1: First relevant at position 1 → RR = 1/1 = 1.0
Query 2: First relevant at position 3 → RR = 1/3 = 0.33
MRR = (1.0 + 0.33) / 2 = 0.67
\`\`\`

### Pillar 2: Generation Quality

Does the LLM generate accurate answers from the retrieved context?

**Faithfulness**: Is the answer supported by the retrieved documents?
\`\`\`python
def evaluate_faithfulness(answer: str, context: str) -> float:
    """Use LLM to check if every claim in the answer is supported."""
    evaluation = llm(
        f"Check each claim in the answer against the context.\\n\\n"
        f"Context: {context}\\n"
        f"Answer: {answer}\\n\\n"
        f"For each claim, mark SUPPORTED or UNSUPPORTED.\\n"
        f"Return the fraction of supported claims as a decimal."
    )
    return float(evaluation.strip())
\`\`\`

**Answer Relevance**: Does the answer actually address the question?
\`\`\`python
def evaluate_relevance(question: str, answer: str) -> float:
    """Check if the answer is relevant to the question asked."""
    evaluation = llm(
        f"On a scale of 0.0 to 1.0, how relevant is this answer "
        f"to the question?\\n\\n"
        f"Question: {question}\\n"
        f"Answer: {answer}\\n\\n"
        f"Return only a decimal number."
    )
    return float(evaluation.strip())
\`\`\`

### Pillar 3: End-to-End Quality

Does the complete system give users correct, helpful answers?

**Answer Correctness**: Compare generated answer against a ground truth:
\`\`\`python
def evaluate_correctness(generated: str, ground_truth: str) -> float:
    evaluation = llm(
        f"Compare these two answers. Rate similarity 0.0-1.0:\\n"
        f"Generated: {generated}\\n"
        f"Ground Truth: {ground_truth}"
    )
    return float(evaluation.strip())
\`\`\`

### Building an Evaluation Dataset

You need a test set of questions with known answers:

\`\`\`python
eval_dataset = [
    {
        "question": "What is our refund policy?",
        "ground_truth": "Full refund within 30 days of purchase",
        "relevant_docs": ["policy-doc-1", "faq-doc-3"]
    },
    {
        "question": "How do I enable 2FA?",
        "ground_truth": "Go to Settings > Security > Enable Two-Factor Auth",
        "relevant_docs": ["security-guide-1"]
    },
    # ... 50-100 more examples
]
\`\`\`

### Automated Evaluation with RAGAS

RAGAS is a popular framework for RAG evaluation:

\`\`\`python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)
from datasets import Dataset

# Prepare evaluation data
eval_data = {
    "question": [d["question"] for d in eval_dataset],
    "answer": [rag_query(d["question"]) for d in eval_dataset],
    "contexts": [retrieve_docs(d["question"]) for d in eval_dataset],
    "ground_truth": [d["ground_truth"] for d in eval_dataset],
}

dataset = Dataset.from_dict(eval_data)

# Run evaluation
results = evaluate(
    dataset,
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall]
)
print(results)
# {'faithfulness': 0.87, 'answer_relevancy': 0.92,
#  'context_precision': 0.78, 'context_recall': 0.85}
\`\`\`

### Evaluation Benchmarks

| Metric | Poor | Acceptable | Good | Excellent |
|--------|------|-----------|------|-----------|
| Faithfulness | < 0.7 | 0.7-0.8 | 0.8-0.9 | > 0.9 |
| Answer Relevance | < 0.6 | 0.6-0.75 | 0.75-0.9 | > 0.9 |
| Context Precision | < 0.5 | 0.5-0.7 | 0.7-0.85 | > 0.85 |
| Context Recall | < 0.5 | 0.5-0.7 | 0.7-0.85 | > 0.85 |

### Key Takeaway

RAG evaluation is not optional — it's how you know if your pipeline actually works. Measure retrieval quality (are you finding the right documents?) and generation quality (is the answer faithful and relevant?). Build an evaluation dataset early and measure after every change. Use frameworks like RAGAS to automate the process.

> **Resource**: [RAG Techniques — Evaluation](https://github.com/NirDiamant/RAG_Techniques) includes evaluation notebooks with RAGAS, DeepEval, and custom metrics.`,
    },
  ],
};
