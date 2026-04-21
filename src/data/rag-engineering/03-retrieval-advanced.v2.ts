import { Module } from "../types";

export const retrievalAdvancedModule: Module = {
  id: "rag-retrieval",
  title: "Advanced Retrieval",
  description: "Master advanced retrieval techniques — fusion retrieval, reranking, hierarchical strategies, multi-modal RAG, and contextual compression.",
  lessons: [
    {
      id: "ra-fusion",
      slug: "fusion-retrieval",
      title: "Fusion Retrieval (BM25 + Dense)",
      content: `## Fusion Retrieval: Combining BM25 + Dense

**Fusion retrieval** (also called hybrid search) combines two fundamentally different search strategies: keyword-based search (BM25) and semantic search (dense embeddings). Each has strengths the other lacks — combining them produces consistently better results.

### Why Hybrid?

**BM25 (Keyword Search)** excels at:
- Exact term matching ("error code 404", "function_name")
- Rare or technical terms the embedding model may not understand
- Simple factual lookups

**Dense Retrieval (Semantic Search)** excels at:
- Understanding meaning despite different wording
- Handling synonyms and paraphrases
- Complex, conceptual queries

\`\`\`
Query: "Python GIL performance impact"

BM25 finds: Documents containing "GIL", "Python", "performance" literally
Dense finds: Documents about "Global Interpreter Lock threading limitations"

Both are relevant — fusion finds both!
\`\`\`

### Implementation with BM25 + Vector Search

\`\`\`python
from rank_bm25 import BM25Okapi
import numpy as np

class HybridRetriever:
    def __init__(self, documents: list, collection):
        self.documents = documents
        self.collection = collection  # Vector store

        # Build BM25 index
        tokenized = [doc.lower().split() for doc in documents]
        self.bm25 = BM25Okapi(tokenized)
        self.doc_ids = [f"doc_{i}" for i in range(len(documents))]

    def search(self, query: str, k: int = 10, alpha: float = 0.5) -> list:
        """
        Hybrid search combining BM25 and dense retrieval.
        alpha: weight for dense search (0 = all BM25, 1 = all dense)
        """
        # BM25 search
        bm25_scores = self.bm25.get_scores(query.lower().split())
        bm25_ranked = np.argsort(bm25_scores)[::-1][:k]

        # Dense search
        dense_results = self.collection.query(
            query_texts=[query],
            n_results=k,
            include=["distances"]
        )

        # Normalize scores to 0-1 range
        bm25_norm = self._normalize(bm25_scores)
        dense_scores = {}
        for doc_id, dist in zip(dense_results["ids"][0],
                                dense_results["distances"][0]):
            idx = int(doc_id.split("_")[1])
            dense_scores[idx] = 1 - dist  # Convert distance to similarity

        # Combine scores
        combined = {}
        for i in range(len(self.documents)):
            bm25_s = bm25_norm[i] if i < len(bm25_norm) else 0
            dense_s = dense_scores.get(i, 0)
            combined[i] = (1 - alpha) * bm25_s + alpha * dense_s

        # Return top-k by combined score
        top_k = sorted(combined, key=combined.get, reverse=True)[:k]
        return [(self.documents[i], combined[i]) for i in top_k]

    def _normalize(self, scores):
        min_s, max_s = min(scores), max(scores)
        if max_s == min_s:
            return [0] * len(scores)
        return [(s - min_s) / (max_s - min_s) for s in scores]
\`\`\`

### Reciprocal Rank Fusion (RRF) Alternative

Instead of score combination, use RRF for robust rank merging:

\`\`\`python
def hybrid_rrf(query: str, bm25_retriever, dense_retriever, k: int = 60):
    bm25_results = bm25_retriever.search(query, n=20)
    dense_results = dense_retriever.search(query, n=20)

    rrf_scores = {}
    for rank, (doc_id, _) in enumerate(bm25_results):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0) + 1 / (rank + k)
    for rank, (doc_id, _) in enumerate(dense_results):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0) + 1 / (rank + k)

    return sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
\`\`\`

### Tuning the Alpha Parameter

The alpha (weight between BM25 and dense) should be tuned on your evaluation dataset:

| Query Type | Recommended Alpha |
|-----------|:-----------------:|
| Exact keyword lookups | 0.2 (more BM25) |
| Natural language questions | 0.7 (more dense) |
| Technical with code terms | 0.4 (balanced) |
| General balanced | 0.5 |

### Native Hybrid Search

Many vector databases now support hybrid search natively:

\`\`\`python
# Weaviate hybrid search
result = client.query.get("Document", ["content"]).with_hybrid(
    query="Python GIL performance",
    alpha=0.5  # Balance between BM25 and vector
).with_limit(5).do()

# Qdrant hybrid search
from qdrant_client.models import SparseVector
results = qdrant.query_points(
    collection_name="docs",
    query=dense_vector,
    using="dense",
    query_filter=None,
).points
\`\`\`

### Key Takeaway

Fusion retrieval is one of the most impactful improvements you can make to a RAG pipeline. BM25 catches exact matches that semantic search misses, while dense retrieval understands meaning that keywords can't capture. Use RRF for robust merging, tune your alpha parameter, and always benchmark against pure dense search on your evaluation dataset.

> **Resource**: [RAG Techniques — Fusion Retrieval](https://github.com/NirDiamant/RAG_Techniques) includes comprehensive implementations of hybrid search patterns.`,
    },
    {
      id: "ra-reranking",
      slug: "reranking",
      title: "Reranking (Cross-Encoder, ColBERT)",
      content: `## Reranking

**Reranking** is a two-stage retrieval pattern: first, retrieve a broad set of candidates cheaply, then use a more powerful model to re-score and reorder them for precision. This dramatically improves the quality of your top results.

### Why Rerank?

Initial retrieval (BM25 or dense) uses **bi-encoders** — they embed the query and documents independently. This is fast but imprecise because the query and document never "see" each other.

**Cross-encoders** take both the query and a document as input together, enabling deep interaction between them. This is much more accurate but too slow to run on your entire corpus.

\`\`\`
Stage 1 (Fast, Broad): Retrieve 50-100 candidates using bi-encoder
Stage 2 (Slow, Precise): Rerank top candidates using cross-encoder
→ Return top 5 reranked results
\`\`\`

### Cross-Encoder Reranking

\`\`\`python
from sentence_transformers import CrossEncoder

# Load a cross-encoder model
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-12-v2")

def rerank(query: str, documents: list, top_k: int = 5) -> list:
    """Rerank documents using a cross-encoder."""
    # Score each document against the query
    pairs = [(query, doc) for doc in documents]
    scores = reranker.predict(pairs)

    # Sort by score (highest first)
    scored_docs = list(zip(documents, scores))
    scored_docs.sort(key=lambda x: x[1], reverse=True)

    return scored_docs[:top_k]

# Usage in RAG pipeline
initial_results = collection.query(query_texts=[query], n_results=20)
reranked = rerank(query, initial_results["documents"][0], top_k=5)
\`\`\`

### Cohere Reranker (API)

\`\`\`python
import cohere

co = cohere.Client("YOUR_API_KEY")

def cohere_rerank(query: str, documents: list, top_k: int = 5) -> list:
    response = co.rerank(
        model="rerank-english-v3.0",
        query=query,
        documents=documents,
        top_n=top_k
    )
    return [(documents[r.index], r.relevance_score) for r in response.results]
\`\`\`

### ColBERT: Late Interaction

**ColBERT** (Contextualized Late Interaction over BERT) is a middle ground — it encodes queries and documents independently (like bi-encoders) but uses token-level interaction at search time (like cross-encoders). This gives cross-encoder quality at near bi-encoder speed.

\`\`\`
Bi-Encoder:    query → [CLS] embedding ↔ doc → [CLS] embedding (fast, less precise)
Cross-Encoder: [query + doc] → single score (slow, most precise)
ColBERT:       query → [token embeddings] ↔ doc → [token embeddings] (balanced)
\`\`\`

\`\`\`python
from ragatouille import RAGPretrainedModel

# Load ColBERT
colbert = RAGPretrainedModel.from_pretrained("colbert-ir/colbertv2.0")

# Index documents
colbert.index(
    collection=documents,
    index_name="my_index",
    split_documents=True
)

# Search (retrieval + reranking in one step)
results = colbert.search(query="How to optimize database queries?", k=5)
\`\`\`

### Comparison

| Method | Speed | Quality | Cost | Best For |
|--------|:-----:|:-------:|:----:|----------|
| **Bi-Encoder** | Fast | Good | Low | Initial retrieval |
| **Cross-Encoder** | Slow | Best | Medium | Reranking top 20-50 |
| **ColBERT** | Medium | Very Good | Medium | Retrieval + reranking |
| **Cohere Rerank** | Medium | Very Good | API cost | Easy integration |

### Two-Stage Pipeline

\`\`\`python
def two_stage_retrieve(query: str, collection, initial_k: int = 20, final_k: int = 5):
    """Two-stage retrieval: broad initial search, then precise reranking."""
    # Stage 1: Fast initial retrieval
    initial = collection.query(
        query_texts=[query],
        n_results=initial_k
    )

    # Stage 2: Precise reranking
    reranked = rerank(query, initial["documents"][0], top_k=final_k)

    return reranked
\`\`\`

### Impact on RAG Quality

Reranking typically improves precision@5 by 15-25%:

| Metric | Without Reranking | With Reranking |
|--------|:-----------------:|:--------------:|
| Precision@5 | 0.72 | 0.89 |
| NDCG@5 | 0.68 | 0.84 |
| Faithfulness | 0.81 | 0.91 |

### Key Takeaway

Reranking is one of the most effective RAG optimizations with minimal implementation effort. Retrieve broadly (20-50 candidates), then rerank precisely to get the best 5. Cross-encoders provide the highest quality; Cohere Rerank offers the easiest integration; ColBERT provides the best speed-quality tradeoff.`,
    },
    {
      id: "ra-hierarchical",
      slug: "hierarchical-retrieval",
      title: "Hierarchical Retrieval",
      content: `## Hierarchical Retrieval

**Hierarchical retrieval** uses a multi-level indexing strategy: retrieve at a high level first (e.g., document summaries), then drill down to specific chunks within the selected documents. This mirrors how humans search — scan headings first, then read relevant sections.

### The Problem with Flat Retrieval

Standard RAG treats all chunks equally in a flat index. This causes:
- Small chunks lack context (what document is this from?)
- Similar chunks from different documents compete unfairly
- No way to enforce document-level diversity

### Hierarchical Index Structure

\`\`\`
Level 1: Document Summaries
  "API Guide: Covers authentication, rate limits, and endpoints"
  "Database Guide: Covers schema design, queries, and optimization"

Level 2: Section Summaries
  "API Auth: JWT tokens, OAuth flows, API keys"
  "API Rate Limits: Throttling, quotas, retry headers"

Level 3: Detailed Chunks
  "To authenticate, include a Bearer token in the Authorization header..."
  "Rate limits are set to 1000 requests per hour per API key..."
\`\`\`

### Implementation

\`\`\`python
class HierarchicalRetriever:
    def __init__(self):
        self.doc_summaries = {}     # doc_id → summary embedding
        self.section_chunks = {}     # doc_id → [section chunks]
        self.detail_chunks = {}      # section_id → [detail chunks]

    def index_document(self, doc_id: str, document: str):
        # Level 1: Document summary
        summary = llm(f"Summarize this document in 2-3 sentences:\\n{document}")
        self.doc_summaries[doc_id] = {
            "summary": summary,
            "embedding": embed(summary)
        }

        # Level 2: Section summaries
        sections = split_by_sections(document)
        self.section_chunks[doc_id] = []
        for i, section in enumerate(sections):
            sec_summary = llm(f"Summarize this section:\\n{section}")
            section_id = f"{doc_id}_sec_{i}"
            self.section_chunks[doc_id].append({
                "id": section_id,
                "summary": sec_summary,
                "embedding": embed(sec_summary)
            })

            # Level 3: Detail chunks within each section
            chunks = chunk_text(section, chunk_size=300)
            self.detail_chunks[section_id] = [
                {"content": c, "embedding": embed(c)} for c in chunks
            ]

    def search(self, query: str, top_docs: int = 3, top_chunks: int = 5):
        query_emb = embed(query)

        # Level 1: Find relevant documents
        doc_scores = []
        for doc_id, data in self.doc_summaries.items():
            score = cosine_similarity(query_emb, data["embedding"])
            doc_scores.append((doc_id, score))
        doc_scores.sort(key=lambda x: x[1], reverse=True)
        selected_docs = [d[0] for d in doc_scores[:top_docs]]

        # Level 2: Find relevant sections within selected docs
        section_scores = []
        for doc_id in selected_docs:
            for section in self.section_chunks.get(doc_id, []):
                score = cosine_similarity(query_emb, section["embedding"])
                section_scores.append((section["id"], score))
        section_scores.sort(key=lambda x: x[1], reverse=True)
        selected_sections = [s[0] for s in section_scores[:top_docs * 2]]

        # Level 3: Get detailed chunks from selected sections
        chunk_scores = []
        for sec_id in selected_sections:
            for chunk in self.detail_chunks.get(sec_id, []):
                score = cosine_similarity(query_emb, chunk["embedding"])
                chunk_scores.append((chunk["content"], score))
        chunk_scores.sort(key=lambda x: x[1], reverse=True)

        return [c[0] for c in chunk_scores[:top_chunks]]
\`\`\`

### Benefits of Hierarchical Retrieval

| Benefit | Description |
|---------|-------------|
| **Better precision** | Pre-filters to relevant documents before chunk search |
| **Document diversity** | Ensures results come from multiple documents |
| **Context preservation** | Summaries provide context that individual chunks lack |
| **Efficiency** | Searches fewer chunks (only within relevant documents) |

### Summary-Based Retrieval

A simpler variant — search summaries, return full documents:

\`\`\`python
def summary_then_retrieve(query: str, summaries: dict, full_docs: dict):
    """Search document summaries, then return chunks from best matches."""
    # Find documents by summary similarity
    query_emb = embed(query)
    scores = [(doc_id, cosine_similarity(query_emb, embed(summary)))
              for doc_id, summary in summaries.items()]
    scores.sort(key=lambda x: x[1], reverse=True)

    # Get chunks from top documents
    top_doc_ids = [s[0] for s in scores[:3]]
    context_chunks = []
    for doc_id in top_doc_ids:
        doc_chunks = chunk_text(full_docs[doc_id])
        # Search within this document's chunks
        chunk_scores = [(c, cosine_similarity(query_emb, embed(c)))
                        for c in doc_chunks]
        chunk_scores.sort(key=lambda x: x[1], reverse=True)
        context_chunks.extend([c[0] for c in chunk_scores[:3]])

    return context_chunks
\`\`\`

### Key Takeaway

Hierarchical retrieval adds structure to the search process — find the right documents first, then find the right chunks within them. This improves both precision and context compared to flat chunk search. Use it when your knowledge base contains many documents with distinct topics.`,
    },
    {
      id: "ra-multimodal",
      slug: "multi-modal-rag",
      title: "Multi-Modal RAG",
      content: `## Multi-Modal RAG

Standard RAG works only with text. **Multi-modal RAG** extends the pipeline to handle images, tables, charts, diagrams, and other non-text content. This is essential for documents like technical manuals, financial reports, and slide decks.

### The Challenge

Many important documents contain critical information in non-text formats:
- **Tables**: Financial data, comparison matrices, specifications
- **Diagrams**: Architecture diagrams, flowcharts, UML
- **Charts**: Trend data, performance graphs, analytics
- **Images**: Screenshots, product photos, medical images

Standard text chunking loses all of this information.

### Approach 1: Text Extraction + Summarization

Convert visual content to text using vision models:

\`\`\`python
import base64
from anthropic import Anthropic

client = Anthropic()

def describe_image(image_path: str) -> str:
    """Use a vision model to describe an image."""
    with open(image_path, "rb") as f:
        image_data = base64.standard_b64encode(f.read()).decode()

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": image_data
                    }
                },
                {
                    "type": "text",
                    "text": "Describe this image in detail, including any text, "
                            "data, or structural information visible."
                }
            ]
        }]
    )
    return response.content[0].text

def extract_table_data(image_path: str) -> str:
    """Extract structured data from a table image."""
    with open(image_path, "rb") as f:
        image_data = base64.standard_b64encode(f.read()).decode()

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": image_data
                    }
                },
                {
                    "type": "text",
                    "text": "Extract all data from this table as structured markdown."
                }
            ]
        }]
    )
    return response.content[0].text
\`\`\`

### Approach 2: Multi-Modal Embeddings

Use models that can embed both text and images into the same vector space:

\`\`\`python
# Using CLIP or similar multi-modal embedding models
from sentence_transformers import SentenceTransformer
from PIL import Image

model = SentenceTransformer("clip-ViT-B-32")

# Embed text and images into the same space
text_embedding = model.encode("architecture diagram showing microservices")
image_embedding = model.encode(Image.open("architecture.png"))

# Now text queries can find relevant images and vice versa
similarity = cosine_similarity(text_embedding, image_embedding)
\`\`\`

### Approach 3: Hybrid Text + Visual Pipeline

The most robust approach combines text extraction with visual context:

\`\`\`python
class MultiModalRAG:
    def __init__(self, collection):
        self.collection = collection

    def index_document(self, doc_path: str):
        """Index a document with both text and visual content."""
        # Extract text content
        text_chunks = extract_text(doc_path)

        # Extract visual elements
        images = extract_images(doc_path)
        tables = extract_tables(doc_path)

        # Process visual elements into text descriptions
        for img_path in images:
            description = describe_image(img_path)
            text_chunks.append({
                "content": f"[IMAGE] {description}",
                "source": doc_path,
                "type": "image",
                "image_path": img_path
            })

        for table_img in tables:
            table_text = extract_table_data(table_img)
            text_chunks.append({
                "content": f"[TABLE] {table_text}",
                "source": doc_path,
                "type": "table"
            })

        # Index all chunks
        self.collection.add(
            documents=[c["content"] for c in text_chunks],
            metadatas=[{"source": c["source"], "type": c.get("type", "text")}
                      for c in text_chunks],
            ids=[f"chunk_{i}" for i in range(len(text_chunks))]
        )

    def query(self, question: str, n_results: int = 5) -> list:
        results = self.collection.query(
            query_texts=[question],
            n_results=n_results,
            include=["documents", "metadatas"]
        )
        return list(zip(results["documents"][0], results["metadatas"][0]))
\`\`\`

### PDF Processing Pipeline

\`\`\`python
def process_pdf(pdf_path: str) -> list:
    """Extract text, tables, and images from a PDF."""
    import fitz  # PyMuPDF

    doc = fitz.open(pdf_path)
    chunks = []

    for page_num, page in enumerate(doc):
        # Extract text
        text = page.get_text()
        if text.strip():
            chunks.append({
                "content": text,
                "type": "text",
                "page": page_num + 1
            })

        # Extract images
        for img_idx, img in enumerate(page.get_images()):
            xref = img[0]
            pix = fitz.Pixmap(doc, xref)
            img_path = f"/tmp/page{page_num}_img{img_idx}.png"
            pix.save(img_path)
            description = describe_image(img_path)
            chunks.append({
                "content": f"[IMAGE on page {page_num+1}] {description}",
                "type": "image",
                "page": page_num + 1
            })

    return chunks
\`\`\`

### Key Takeaway

Multi-modal RAG ensures you don't lose information trapped in images, tables, and diagrams. The most practical approach is vision model extraction — use Claude or GPT-4V to convert visual content to text descriptions, then index and search normally. This works with existing vector databases and requires no special multi-modal infrastructure.

> **Resource**: [RAG Techniques — Multi-Modal RAG](https://github.com/NirDiamant/RAG_Techniques) includes implementations for PDF, image, and table processing pipelines.`,
    },
    {
      id: "ra-compression",
      slug: "contextual-compression",
      title: "Contextual Compression",
      content: `## Contextual Compression

**Contextual compression** reduces the size of retrieved documents by extracting only the parts relevant to the query. Instead of passing entire chunks to the LLM, you pass only the sentences or paragraphs that actually matter.

### The Problem

Retrieved chunks often contain mostly irrelevant text:

\`\`\`
Retrieved chunk (300 words):
"The Python programming language was created by Guido van Rossum and first
released in 1991. [150 words of history...] Python's GIL (Global Interpreter
Lock) prevents true multi-threading. This means CPU-bound tasks don't benefit
from threading. [100 words of other features...]"

Query: "Does Python support multi-threading?"
Relevant part: "Python's GIL prevents true multi-threading. CPU-bound tasks
don't benefit from threading."
\`\`\`

### How Compression Works

\`\`\`
Query + Retrieved Chunks → Compressor → Relevant Extracts Only → LLM
\`\`\`

### LLM-Based Compression

\`\`\`python
def compress_context(query: str, documents: list) -> list:
    """Extract only query-relevant content from each document."""
    compressed = []
    for doc in documents:
        extraction = llm(
            f"Extract only the sentences from this document that are "
            f"directly relevant to answering the question. Return only "
            f"the relevant sentences, nothing else. If nothing is relevant, "
            f"return NONE.\\n\\n"
            f"Question: {query}\\n"
            f"Document: {doc}\\n\\n"
            f"Relevant content:",
            model="claude-haiku-4-20250414"  # Fast model for extraction
        )
        if "NONE" not in extraction:
            compressed.append(extraction.strip())

    return compressed
\`\`\`

### Embedding-Based Compression

Faster than LLM-based — use sentence embeddings to filter:

\`\`\`python
import nltk

def embedding_compress(query: str, document: str, threshold: float = 0.5) -> str:
    """Keep only sentences with high similarity to the query."""
    sentences = nltk.sent_tokenize(document)
    query_emb = embed(query)

    relevant = []
    for sentence in sentences:
        sent_emb = embed(sentence)
        sim = cosine_similarity(query_emb, sent_emb)
        if sim > threshold:
            relevant.append(sentence)

    return " ".join(relevant) if relevant else document[:200]
\`\`\`

### Contextual Compression Pipeline

\`\`\`python
def rag_with_compression(
    query: str,
    collection,
    n_retrieve: int = 10,
    n_final: int = 5
) -> str:
    """RAG pipeline with contextual compression."""
    # Step 1: Retrieve broadly
    results = collection.query(
        query_texts=[query],
        n_results=n_retrieve
    )

    # Step 2: Compress each document
    compressed_docs = compress_context(query, results["documents"][0])

    # Step 3: Filter empty results
    compressed_docs = [d for d in compressed_docs if d.strip()]

    if not compressed_docs:
        return "No relevant information found."

    # Step 4: Take top N compressed docs
    context = "\\n\\n---\\n\\n".join(compressed_docs[:n_final])

    # Step 5: Generate answer with compressed context
    answer = llm(
        f"Answer based on the following context:\\n{context}\\n\\n"
        f"Question: {query}"
    )

    return answer
\`\`\`

### Benefits of Compression

| Benefit | Description |
|---------|-------------|
| **Reduced tokens** | Send less to the LLM → lower cost |
| **Better focus** | LLM sees only relevant content → better answers |
| **More documents** | Can include more source documents in same context |
| **Less noise** | Irrelevant text can confuse the LLM |

### Compression + Reranking

Combine both for maximum quality:

\`\`\`python
def full_pipeline(query: str, collection) -> str:
    # Stage 1: Broad retrieval (20 candidates)
    candidates = collection.query(query_texts=[query], n_results=20)

    # Stage 2: Rerank to top 10
    reranked = rerank(query, candidates["documents"][0], top_k=10)

    # Stage 3: Compress each of the top 10
    compressed = compress_context(query, [doc for doc, score in reranked])

    # Stage 4: Generate with compressed, reranked context
    context = "\\n\\n".join(compressed[:5])
    return llm(f"Context: {context}\\nQuestion: {query}")
\`\`\`

### When to Use Compression

- Your chunks are large (500+ tokens)
- Your context window is limited
- Cost optimization is a priority
- Documents contain mixed-topic content
- You want to fit more source documents in context

### Key Takeaway

Contextual compression extracts the signal from the noise in retrieved documents. By passing only relevant sentences to the LLM, you get better answers at lower cost. Use LLM-based compression for accuracy or embedding-based for speed. Combine with reranking for the best retrieval pipeline.`,
    },
  ],
};
