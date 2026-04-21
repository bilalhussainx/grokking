import { Module } from "../types";

export const contextEnrichmentModule: Module = {
  id: "rag-context",
  title: "Context Enrichment",
  description: "Enrich retrieved context with techniques like contextual chunk headers, semantic chunking, parent-child retrieval, sentence window retrieval, and document augmentation.",
  lessons: [
    {
      id: "ce-chunk-headers",
      slug: "contextual-chunk-headers",
      title: "Contextual Chunk Headers",
      content: `## Contextual Chunk Headers

One of the simplest yet most effective RAG improvements: **prepend contextual metadata to each chunk** before embedding. This gives the embedding model (and later, the LLM) crucial context about where the chunk came from.

### The Problem

When you chunk a document, each chunk loses its context:

\`\`\`
Original document: "API Reference Guide > Authentication > JWT Tokens"

Chunk: "Tokens expire after 24 hours. To refresh, send a POST request
        to /auth/refresh with the current token in the Authorization header."
\`\`\`

This chunk is about JWT token refresh, but the text alone could be about any kind of token. The embedding won't capture that this is specifically about API authentication.

### The Solution: Prepend Context

\`\`\`
Enhanced chunk:
"Document: API Reference Guide | Section: Authentication | Topic: JWT Tokens

Tokens expire after 24 hours. To refresh, send a POST request to /auth/refresh
with the current token in the Authorization header."
\`\`\`

Now the embedding captures both the content and its context.

### Implementation

\`\`\`python
def add_chunk_headers(chunks: list, document_metadata: dict) -> list:
    """Prepend contextual headers to each chunk."""
    enhanced = []
    for chunk in chunks:
        header = build_header(chunk, document_metadata)
        enhanced_content = f"{header}\\n\\n{chunk['content']}"
        enhanced.append({
            **chunk,
            "content": enhanced_content,
            "original_content": chunk["content"]  # Keep original for display
        })
    return enhanced

def build_header(chunk: dict, doc_meta: dict) -> str:
    """Build a contextual header from metadata."""
    parts = []
    if doc_meta.get("title"):
        parts.append(f"Document: {doc_meta['title']}")
    if chunk.get("section"):
        parts.append(f"Section: {chunk['section']}")
    if doc_meta.get("date"):
        parts.append(f"Date: {doc_meta['date']}")
    if doc_meta.get("author"):
        parts.append(f"Author: {doc_meta['author']}")
    return " | ".join(parts)
\`\`\`

### LLM-Generated Context (Anthropic's Approach)

Use an LLM to generate a contextual summary for each chunk:

\`\`\`python
def add_llm_context(chunk: str, full_document: str) -> str:
    """Use LLM to generate situating context for a chunk."""
    context = llm(
        f"Here is the full document:\\n{full_document[:2000]}\\n\\n"
        f"Here is a chunk from that document:\\n{chunk}\\n\\n"
        f"Give a short (1-2 sentence) context that explains what this chunk "
        f"is about and where it fits in the document. This will be prepended "
        f"to the chunk to improve search retrieval."
    )
    return f"{context}\\n\\n{chunk}"
\`\`\`

**Example:**
\`\`\`
LLM context: "This section of the API Authentication guide explains how to
refresh expired JWT tokens using the /auth/refresh endpoint."

Chunk: "Tokens expire after 24 hours. To refresh, send a POST request..."
\`\`\`

### Types of Context to Add

| Context Type | When to Use | Example |
|-------------|------------|---------|
| **Document title** | Always | "API Reference Guide" |
| **Section hierarchy** | Structured docs | "Auth > JWT > Refresh" |
| **Date/version** | Time-sensitive content | "v3.2, March 2025" |
| **Summary** | Large, complex docs | LLM-generated situating context |
| **Tags/categories** | Multi-topic knowledge bases | "authentication, security" |

### Impact on Retrieval

Contextual headers typically improve retrieval by 10-20%:

| Metric | Without Headers | With Headers |
|--------|:---------------:|:------------:|
| Context Precision@5 | 0.71 | 0.84 |
| Context Recall@5 | 0.68 | 0.79 |
| Answer Faithfulness | 0.83 | 0.90 |

### Key Takeaway

Contextual chunk headers are the lowest-effort, highest-impact RAG optimization. Simply prepending document title, section name, and a short context summary to each chunk before embedding dramatically improves retrieval quality. Do this before trying any other optimization.

> **Resource**: [RAG Techniques — Contextual Chunk Headers](https://github.com/NirDiamant/RAG_Techniques) includes implementation details and benchmarks.`,
    },
    {
      id: "ce-semantic-chunking",
      slug: "semantic-chunking",
      title: "Semantic Chunking",
      content: `## Semantic Chunking

**Semantic chunking** splits documents at natural topic boundaries rather than at fixed character counts. It uses embedding similarity between adjacent sentences to detect where the topic changes, creating chunks that each contain a single coherent topic.

### How It Works

1. Split the document into sentences
2. Embed each sentence
3. Compare adjacent sentence embeddings
4. When similarity drops below a threshold, start a new chunk

\`\`\`
Sentence 1: "Python supports multiple programming paradigms." ─┐ Similar
Sentence 2: "It includes OOP, functional, and procedural."    ─┘ → Chunk 1
                                                            ← Topic shift!
Sentence 3: "Installation requires downloading from python.org."─┐ Similar
Sentence 4: "Run the installer and add Python to your PATH."    ─┘ → Chunk 2
\`\`\`

### Implementation

\`\`\`python
import nltk
import numpy as np

def semantic_chunk(
    text: str,
    threshold: float = 0.3,
    min_chunk_size: int = 100,
    max_chunk_size: int = 1000
) -> list:
    """Split text into semantically coherent chunks."""
    sentences = nltk.sent_tokenize(text)
    if len(sentences) <= 1:
        return [text]

    # Embed all sentences
    embeddings = [embed(s) for s in sentences]

    # Calculate similarity between consecutive sentences
    similarities = []
    for i in range(len(embeddings) - 1):
        sim = cosine_similarity(embeddings[i], embeddings[i + 1])
        similarities.append(sim)

    # Find breakpoints where similarity drops
    breakpoints = []
    for i, sim in enumerate(similarities):
        if sim < threshold:
            breakpoints.append(i + 1)

    # Build chunks from breakpoints
    chunks = []
    start = 0
    for bp in breakpoints:
        chunk_text = " ".join(sentences[start:bp])

        # Enforce size constraints
        if len(chunk_text) < min_chunk_size and chunks:
            # Too small — merge with previous
            chunks[-1] += " " + chunk_text
        elif len(chunk_text) > max_chunk_size:
            # Too large — split at midpoint
            mid = len(sentences[start:bp]) // 2
            chunks.append(" ".join(sentences[start:start + mid]))
            chunks.append(" ".join(sentences[start + mid:bp]))
        else:
            chunks.append(chunk_text)
        start = bp

    # Add remaining sentences
    if start < len(sentences):
        remaining = " ".join(sentences[start:])
        if len(remaining) < min_chunk_size and chunks:
            chunks[-1] += " " + remaining
        else:
            chunks.append(remaining)

    return chunks
\`\`\`

### Percentile-Based Thresholding

Instead of a fixed threshold, use percentile-based detection to adapt to each document:

\`\`\`python
def adaptive_semantic_chunk(text: str, percentile: int = 25) -> list:
    """Use percentile-based breakpoint detection."""
    sentences = nltk.sent_tokenize(text)
    embeddings = [embed(s) for s in sentences]

    similarities = [
        cosine_similarity(embeddings[i], embeddings[i+1])
        for i in range(len(embeddings) - 1)
    ]

    # Breakpoints at the lowest N% of similarities
    threshold = np.percentile(similarities, percentile)
    breakpoints = [i + 1 for i, sim in enumerate(similarities)
                   if sim < threshold]

    # Build chunks from breakpoints
    chunks = []
    start = 0
    for bp in breakpoints:
        chunks.append(" ".join(sentences[start:bp]))
        start = bp
    chunks.append(" ".join(sentences[start:]))

    return [c for c in chunks if c.strip()]
\`\`\`

### Semantic vs Other Chunking

| Strategy | Topic Coherence | Size Consistency | Speed | Cost |
|----------|:---------------:|:----------------:|:-----:|:----:|
| Fixed-size | Low | High | Fast | Free |
| Recursive | Medium | Medium | Fast | Free |
| **Semantic** | **High** | **Low** | Medium | Medium |
| Proposition | Highest | Very Low | Slow | High |

### When Semantic Chunking Shines

- Documents that cover multiple topics
- Long-form content (articles, reports, documentation)
- Content without clear structural markers (no headings)
- When retrieval precision matters more than speed

### Key Takeaway

Semantic chunking creates topic-coherent chunks by detecting natural breakpoints in the text using embedding similarity. It produces chunks that are more meaningful and self-contained than fixed-size chunking. Use percentile-based thresholding to adapt to different document styles, and always enforce minimum/maximum size constraints.`,
    },
    {
      id: "ce-parent-child",
      slug: "parent-child-retrieval",
      title: "Parent-Child Retrieval",
      content: `## Parent-Child Retrieval

**Parent-child retrieval** (also called small-to-big retrieval) solves a fundamental tension in RAG: small chunks are better for precise retrieval, but large chunks are better for comprehensive answers. The solution? Retrieve with small chunks but return their larger parent chunks.

### The Tension

\`\`\`
Small chunks (100 tokens):
  ✓ Precise retrieval — high signal-to-noise
  ✗ Lack context — answer may need surrounding information

Large chunks (500 tokens):
  ✓ Rich context — complete information
  ✗ Imprecise retrieval — diluted with irrelevant text
\`\`\`

### The Solution

\`\`\`
Index: Small chunks (for precise matching)
Return: Parent chunks (for comprehensive context)

Small chunk: "JWT tokens expire after 24 hours."
→ Match! High relevance score.
→ Return parent: "Authentication uses JWT tokens with RS256 signing.
   Tokens expire after 24 hours. To refresh, POST to /auth/refresh
   with the expired token. The refresh endpoint returns a new token
   pair (access + refresh). Store tokens in httpOnly cookies."
\`\`\`

### Implementation

\`\`\`python
class ParentChildRetriever:
    def __init__(self, collection):
        self.collection = collection
        self.parent_store = {}  # child_id → parent_content

    def index(self, documents: list):
        """Create parent and child chunks, index children."""
        for doc in documents:
            # Create parent chunks (large)
            parent_chunks = chunk_text(doc["content"], chunk_size=1000, overlap=100)

            for p_idx, parent in enumerate(parent_chunks):
                parent_id = f"{doc['id']}_parent_{p_idx}"

                # Create child chunks (small) within each parent
                child_chunks = chunk_text(parent, chunk_size=200, overlap=20)

                for c_idx, child in enumerate(child_chunks):
                    child_id = f"{parent_id}_child_{c_idx}"

                    # Store parent reference
                    self.parent_store[child_id] = {
                        "parent_content": parent,
                        "parent_id": parent_id,
                        "source": doc["source"]
                    }

                    # Index child chunk for retrieval
                    self.collection.add(
                        documents=[child],
                        ids=[child_id],
                        metadatas=[{
                            "parent_id": parent_id,
                            "source": doc["source"]
                        }]
                    )

    def search(self, query: str, n_results: int = 5) -> list:
        """Search children, return parents."""
        # Retrieve using small child chunks
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results * 2  # Over-retrieve to account for dedup
        )

        # Map back to parent chunks, deduplicating
        seen_parents = set()
        parent_results = []

        for child_id, metadata in zip(results["ids"][0], results["metadatas"][0]):
            parent_id = metadata["parent_id"]
            if parent_id not in seen_parents:
                seen_parents.add(parent_id)
                parent_data = self.parent_store[child_id]
                parent_results.append({
                    "content": parent_data["parent_content"],
                    "source": parent_data["source"],
                    "matched_by": child_id
                })

            if len(parent_results) >= n_results:
                break

        return parent_results
\`\`\`

### Multi-Level Hierarchy

You can extend this to three or more levels:

\`\`\`
Level 1 (Retrieval): 100-token chunks → precise matching
Level 2 (Context):   500-token chunks → surrounding context
Level 3 (Full):      Full document → complete information
\`\`\`

### Combining with Other Techniques

Parent-child works well with:
- **Reranking**: Rerank child chunks before mapping to parents
- **Contextual headers**: Add headers to child chunks for better retrieval
- **Compression**: Compress parent chunks to extract only relevant parts

\`\`\`python
def enhanced_parent_child(query: str, retriever: ParentChildRetriever) -> list:
    # Search with child chunks
    child_results = retriever.collection.query(
        query_texts=[query], n_results=20
    )

    # Rerank children
    reranked = rerank(query, child_results["documents"][0], top_k=10)

    # Map to parents
    parents = retriever.get_parents(reranked)

    # Compress parents
    compressed = compress_context(query, [p["content"] for p in parents])

    return compressed[:5]
\`\`\`

### Key Takeaway

Parent-child retrieval gets you the best of both worlds: precise retrieval with small chunks and comprehensive context with large chunks. It's one of the most practical RAG improvements — easy to implement and consistently effective. Use it whenever your chunks feel too small for good answers or too large for good retrieval.`,
    },
    {
      id: "ce-sentence-window",
      slug: "sentence-window-retrieval",
      title: "Sentence Window Retrieval",
      content: `## Sentence Window Retrieval

**Sentence window retrieval** is a variation of parent-child retrieval where you index individual sentences but retrieve a window of surrounding sentences. This provides even more precise matching while still returning sufficient context.

### How It Works

\`\`\`
Index: Individual sentences (maximum precision)
Return: Sentence + N surrounding sentences (context window)

Sentence 5: "The rate limit is 1000 requests per hour."  ← Matched!
Window (±2):
  Sentence 3: "All API calls require authentication."
  Sentence 4: "Include your API key in the X-API-Key header."
  Sentence 5: "The rate limit is 1000 requests per hour."  ← Center
  Sentence 6: "Exceeding the limit returns HTTP 429."
  Sentence 7: "Use exponential backoff for retries."
\`\`\`

### Implementation

\`\`\`python
class SentenceWindowRetriever:
    def __init__(self, collection, window_size: int = 2):
        self.collection = collection
        self.window_size = window_size
        self.sentence_store = {}  # Maps sentence_id → document sentences

    def index_document(self, doc_id: str, text: str):
        """Index individual sentences with their positions."""
        import nltk
        sentences = nltk.sent_tokenize(text)

        # Store all sentences for window retrieval
        self.sentence_store[doc_id] = sentences

        # Index each sentence
        for idx, sentence in enumerate(sentences):
            sent_id = f"{doc_id}_sent_{idx}"
            self.collection.add(
                documents=[sentence],
                ids=[sent_id],
                metadatas=[{
                    "doc_id": doc_id,
                    "position": idx,
                    "total_sentences": len(sentences)
                }]
            )

    def search(self, query: str, n_results: int = 5) -> list:
        """Search sentences, return windows."""
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results,
            include=["documents", "metadatas"]
        )

        windows = []
        seen_ranges = set()  # Avoid overlapping windows

        for sent, meta in zip(results["documents"][0], results["metadatas"][0]):
            doc_id = meta["doc_id"]
            pos = meta["position"]
            total = meta["total_sentences"]

            # Calculate window boundaries
            start = max(0, pos - self.window_size)
            end = min(total, pos + self.window_size + 1)
            range_key = (doc_id, start, end)

            if range_key in seen_ranges:
                continue
            seen_ranges.add(range_key)

            # Build window text
            sentences = self.sentence_store[doc_id]
            window_text = " ".join(sentences[start:end])

            windows.append({
                "content": window_text,
                "matched_sentence": sent,
                "doc_id": doc_id,
                "position": pos,
                "window_range": (start, end)
            })

        return windows[:n_results]
\`\`\`

### Choosing Window Size

| Window Size | Context | Precision | Tokens |
|:-----------:|---------|:---------:|:------:|
| ±0 | Sentence only | Highest | Minimal |
| ±1 | 3 sentences | High | Low |
| ±2 | 5 sentences | Good | Medium |
| ±3 | 7 sentences | Good | Higher |
| ±5 | 11 sentences | Lower | High |

The sweet spot is typically ±2 to ±3 for most use cases.

### Dynamic Window Sizing

Adjust window size based on the query:

\`\`\`python
def dynamic_window(query: str, base_window: int = 2) -> int:
    """Adjust window size based on query complexity."""
    complexity = llm(
        f"Rate this query's complexity 1-3:\\n"
        f"1 = Simple factual lookup\\n"
        f"2 = Moderate explanation needed\\n"
        f"3 = Complex, needs broad context\\n\\n"
        f"Query: {query}\\nRating:",
        model="claude-haiku-4-20250414"
    )
    multiplier = int(complexity.strip())
    return base_window * multiplier
\`\`\`

### Sentence Window vs Parent-Child

| Feature | Sentence Window | Parent-Child |
|---------|:---------------:|:------------:|
| Index granularity | Sentences | Small chunks |
| Context method | Fixed window | Pre-defined parents |
| Overlap control | Window size param | Overlap param |
| Context coherence | May cross topics | Pre-defined boundaries |
| Implementation | Simpler | More complex |
| Best for | Structured docs | Mixed-topic docs |

### Key Takeaway

Sentence window retrieval offers the most precise matching possible (individual sentences) while still returning sufficient context (surrounding window). It's simpler than parent-child retrieval and works excellently for well-structured documents. Tune the window size based on your typical query complexity and document density.`,
    },
    {
      id: "ce-augmentation",
      slug: "document-augmentation",
      title: "Document Augmentation",
      content: `## Document Augmentation

**Document augmentation** enriches your documents before indexing by adding questions, summaries, keywords, and other metadata that improve retrieval. The idea: if you know what questions a document can answer, you can match queries to documents more accurately.

### The Approach

Instead of indexing raw document text, augment each document with generated metadata:

\`\`\`
Original: "JWT tokens expire after 24 hours. POST to /auth/refresh to renew."

Augmented:
  Content: "JWT tokens expire after 24 hours. POST to /auth/refresh to renew."
  Questions: ["How long do JWT tokens last?", "How to refresh an expired token?",
              "What is the token refresh endpoint?"]
  Summary: "JWT token expiration and refresh mechanism via /auth/refresh endpoint"
  Keywords: ["JWT", "token", "expiration", "refresh", "authentication", "API"]
  Category: "Authentication"
\`\`\`

### Question Generation

Generate questions that each chunk can answer:

\`\`\`python
def generate_questions(chunk: str, n: int = 3) -> list:
    """Generate questions that this chunk answers."""
    response = llm(
        f"Generate {n} questions that this text passage can answer. "
        f"Questions should be natural, like what a user would actually ask.\\n\\n"
        f"Passage: {chunk}\\n\\n"
        f"Questions (one per line):"
    )
    return [q.strip().lstrip("0123456789.-) ")
            for q in response.split("\\n") if q.strip()]
\`\`\`

### Full Augmentation Pipeline

\`\`\`python
def augment_document(chunk: str, doc_meta: dict) -> dict:
    """Augment a document chunk with generated metadata."""
    # Generate questions
    questions = generate_questions(chunk, n=3)

    # Generate summary
    summary = llm(
        f"Summarize this text in one sentence:\\n{chunk}"
    )

    # Extract keywords
    keywords = llm(
        f"Extract 5-8 key terms from this text (comma-separated):\\n{chunk}"
    ).split(",")

    return {
        "content": chunk,
        "questions": questions,
        "summary": summary.strip(),
        "keywords": [k.strip() for k in keywords],
        "source": doc_meta.get("source", ""),
    }
\`\`\`

### Indexing Augmented Documents

Index the augmented text for better matching:

\`\`\`python
def index_augmented(collection, augmented_docs: list):
    """Index documents with augmented content for better retrieval."""
    for i, doc in enumerate(augmented_docs):
        # Create enriched text for embedding
        enriched = (
            f"{doc['summary']}\\n\\n"
            f"Questions this answers: {'; '.join(doc['questions'])}\\n\\n"
            f"Keywords: {', '.join(doc['keywords'])}\\n\\n"
            f"{doc['content']}"
        )

        collection.add(
            documents=[enriched],
            metadatas=[{
                "source": doc["source"],
                "summary": doc["summary"],
                "original_content": doc["content"]
            }],
            ids=[f"doc_{i}"]
        )
\`\`\`

### Question-Based Retrieval

Index generated questions separately for question-to-question matching:

\`\`\`python
class QuestionBasedRetriever:
    def __init__(self):
        self.question_collection = None  # Questions index
        self.question_to_chunk = {}  # Maps question → original chunk

    def index(self, chunks: list):
        for i, chunk in enumerate(chunks):
            questions = generate_questions(chunk, n=3)
            for j, question in enumerate(questions):
                q_id = f"q_{i}_{j}"
                self.question_collection.add(
                    documents=[question],
                    ids=[q_id]
                )
                self.question_to_chunk[q_id] = chunk

    def search(self, query: str, n_results: int = 5) -> list:
        # Match user query against generated questions
        results = self.question_collection.query(
            query_texts=[query],
            n_results=n_results
        )
        # Return the original chunks
        chunks = []
        seen = set()
        for q_id in results["ids"][0]:
            chunk = self.question_to_chunk[q_id]
            if chunk not in seen:
                seen.add(chunk)
                chunks.append(chunk)
        return chunks
\`\`\`

### Augmentation Strategies Summary

| Strategy | Cost | Impact | Best For |
|----------|:----:|:------:|----------|
| **Question generation** | Medium | High | FAQ-style queries |
| **Summary prepending** | Low | Medium | Long documents |
| **Keyword extraction** | Low | Medium | Technical docs |
| **Category tagging** | Low | Medium | Multi-topic KBs |
| **All combined** | High | Highest | Production systems |

### Cost Optimization

Augmentation is a one-time indexing cost, not per-query. To reduce costs:
- Use a fast/cheap model (Haiku) for augmentation
- Batch process documents
- Cache augmented results
- Only re-augment when documents change

### Key Takeaway

Document augmentation is a pre-processing investment that pays off at query time. By generating questions, summaries, and keywords for each chunk, you create multiple pathways for retrieval. Question-based retrieval is particularly effective because it matches user queries (questions) against generated questions, rather than trying to match questions against declarative text.

> **Resource**: [RAG Techniques — Document Augmentation](https://github.com/NirDiamant/RAG_Techniques) covers question generation, summary augmentation, and keyword extraction strategies.`,
    },
  ],
};
