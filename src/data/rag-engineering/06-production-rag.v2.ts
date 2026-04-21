import { Module } from "../types";

export const productionRagModule: Module = {
  id: "rag-production",
  title: "Production RAG",
  description: "Ship RAG to production with pipeline optimization, evaluation frameworks, caching, monitoring, and scaling strategies.",
  lessons: [
    {
      id: "prag-optimization",
      slug: "rag-pipeline-optimization",
      title: "RAG Pipeline Optimization",
      content: `## RAG Pipeline Optimization

Moving a RAG pipeline from prototype to production requires systematic optimization at every stage. This lesson covers the highest-impact optimizations with concrete implementation guidance.

### The Optimization Framework

Every RAG pipeline has four stages to optimize:

\`\`\`
Indexing → Retrieval → Augmentation → Generation
\`\`\`

### Indexing Optimizations

**1. Embedding Model Selection**

The embedding model has the single biggest impact on retrieval quality. Test multiple models on your data:

\`\`\`python
from mteb import MTEB  # Massive Text Embedding Benchmark

models_to_test = [
    "text-embedding-3-small",
    "text-embedding-3-large",
    "voyage-3",
    "all-MiniLM-L6-v2"
]

# Evaluate on your domain-specific data
for model_name in models_to_test:
    model = load_model(model_name)
    scores = evaluate_retrieval(model, your_eval_dataset)
    print(f"{model_name}: Recall@5={scores['recall']:.3f}, "
          f"Precision@5={scores['precision']:.3f}")
\`\`\`

**2. Chunk Size Tuning**

Test different chunk sizes systematically:

\`\`\`python
chunk_sizes = [200, 300, 500, 800, 1000]
for size in chunk_sizes:
    chunks = chunk_documents(docs, chunk_size=size)
    index(chunks)
    scores = evaluate_on_test_set()
    print(f"Chunk size {size}: {len(chunks)} chunks, recall={scores['recall']:.3f}")
\`\`\`

**3. Metadata Enrichment**

Add structured metadata during indexing for filtered search:

\`\`\`python
collection.add(
    documents=[chunk],
    metadatas=[{
        "source": "api-docs",
        "section": "authentication",
        "version": "3.2",
        "date": "2025-01",
        "doc_type": "reference"
    }],
    ids=[chunk_id]
)

# At query time, filter by metadata
results = collection.query(
    query_texts=[query],
    where={"doc_type": "reference", "version": "3.2"},
    n_results=5
)
\`\`\`

### Retrieval Optimizations

**1. Hybrid Search**: Always use BM25 + dense (15-30% recall improvement)

**2. Two-Stage Retrieval**: Retrieve 20-50 → rerank to top 5

**3. Query Enhancement**: Multi-query or HyDE for complex queries

### Generation Optimizations

**1. Prompt Engineering**: Test different prompt templates

\`\`\`python
# Track which prompt template performs best
templates = {
    "concise": "Answer briefly using the context: {context}\\nQ: {query}",
    "detailed": "Provide a thorough answer based on: {context}\\nQ: {query}",
    "cited": "Answer with inline citations [1][2] from: {context}\\nQ: {query}",
}

for name, template in templates.items():
    answers = [generate(template, q, c) for q, c in test_pairs]
    scores = evaluate_answers(answers, ground_truths)
    print(f"{name}: faithfulness={scores['faith']:.3f}, relevance={scores['rel']:.3f}")
\`\`\`

**2. Context Ordering**: Put the most relevant documents first (LLMs attend more to the beginning and end of context).

### End-to-End Optimization Checklist

| Stage | Optimization | Typical Impact |
|-------|-------------|:--------------:|
| Indexing | Better embedding model | 10-20% |
| Indexing | Optimal chunk size | 5-15% |
| Indexing | Contextual headers | 10-20% |
| Retrieval | Hybrid search (BM25 + dense) | 15-30% |
| Retrieval | Reranking | 15-25% |
| Retrieval | Multi-query | 10-20% |
| Generation | Prompt optimization | 5-15% |
| Generation | Context ordering | 5-10% |

### Key Takeaway

RAG optimization is systematic, not magical. Test one variable at a time, measure with a consistent evaluation dataset, and stack improvements. The highest-impact optimizations are: better embedding models, hybrid search, reranking, and contextual chunk headers. These four alone can improve your pipeline quality by 40-60%.

> **Resource**: [RAG Techniques](https://github.com/NirDiamant/RAG_Techniques) provides optimization benchmarks and A/B testing frameworks.`,
    },
    {
      id: "prag-evaluation",
      slug: "evaluation-frameworks",
      title: "Evaluation Frameworks (RAGAS, DeepEval)",
      content: `## Evaluation Frameworks

Production RAG requires automated evaluation. Two leading frameworks — **RAGAS** and **DeepEval** — provide comprehensive metrics and testing infrastructure.

### RAGAS (RAG Assessment)

RAGAS is the most widely used RAG evaluation framework. It provides four core metrics without requiring ground-truth answers for most of them:

\`\`\`python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
    context_entity_recall,
    answer_similarity,
)
from datasets import Dataset

# Prepare evaluation data
eval_data = Dataset.from_dict({
    "question": questions,
    "answer": generated_answers,
    "contexts": retrieved_contexts,  # list of list of strings
    "ground_truth": ground_truth_answers,
})

# Run evaluation
results = evaluate(
    dataset=eval_data,
    metrics=[
        faithfulness,          # Is the answer grounded in context?
        answer_relevancy,      # Does the answer address the question?
        context_precision,     # Are retrieved docs relevant?
        context_recall,        # Did we retrieve all relevant docs?
    ]
)

print(results)
# {'faithfulness': 0.87, 'answer_relevancy': 0.91,
#  'context_precision': 0.79, 'context_recall': 0.84}
\`\`\`

### DeepEval

DeepEval provides a testing framework similar to pytest, purpose-built for LLM evaluation:

\`\`\`python
from deepeval import assert_test
from deepeval.test_case import LLMTestCase
from deepeval.metrics import (
    FaithfulnessMetric,
    AnswerRelevancyMetric,
    ContextualPrecisionMetric,
    ContextualRecallMetric,
    HallucinationMetric,
)

# Create a test case
test_case = LLMTestCase(
    input="What is our refund policy?",
    actual_output="Full refund within 30 days of purchase.",
    expected_output="Full refund within 30 days.",
    retrieval_context=["Refund policy: Full refund within 30 days of purchase..."]
)

# Define metrics
faithfulness = FaithfulnessMetric(threshold=0.8)
relevancy = AnswerRelevancyMetric(threshold=0.8)
hallucination = HallucinationMetric(threshold=0.5)

# Assert all metrics pass
assert_test(test_case, [faithfulness, relevancy, hallucination])
\`\`\`

### Building an Evaluation Pipeline

\`\`\`python
class RAGEvaluator:
    def __init__(self, rag_pipeline, eval_dataset: list):
        self.pipeline = rag_pipeline
        self.dataset = eval_dataset

    def run_evaluation(self) -> dict:
        """Run full evaluation suite."""
        results = {
            "faithfulness": [],
            "relevance": [],
            "context_precision": [],
            "latency_ms": [],
        }

        for item in self.dataset:
            start = time.time()
            answer = self.pipeline.query(item["question"])
            latency = (time.time() - start) * 1000

            # Evaluate
            faith = evaluate_faithfulness(answer, item["context"])
            rel = evaluate_relevance(item["question"], answer)
            precision = evaluate_precision(item["question"], item["context"])

            results["faithfulness"].append(faith)
            results["relevance"].append(rel)
            results["context_precision"].append(precision)
            results["latency_ms"].append(latency)

        # Aggregate
        return {
            metric: {
                "mean": np.mean(values),
                "std": np.std(values),
                "min": np.min(values),
                "p50": np.percentile(values, 50),
                "p95": np.percentile(values, 95),
            }
            for metric, values in results.items()
        }
\`\`\`

### Creating Golden Datasets

The evaluation dataset is as important as the metrics:

\`\`\`python
def generate_eval_dataset(documents: list, n_questions: int = 50) -> list:
    """Auto-generate evaluation questions from documents."""
    dataset = []
    for doc in documents[:n_questions]:
        qa = llm(
            f"Generate a question-answer pair from this document.\\n"
            f"Document: {doc}\\n\\n"
            f"Return JSON: {{"question": "...", "answer": "..."}}"
        )
        pair = json.loads(qa)
        pair["source_document"] = doc
        dataset.append(pair)
    return dataset
\`\`\`

### Continuous Evaluation

Integrate evaluation into your CI/CD pipeline:

\`\`\`python
# In your test suite
def test_rag_faithfulness():
    results = evaluator.run_evaluation()
    assert results["faithfulness"]["mean"] >= 0.85, \\
        f"Faithfulness dropped to {results['faithfulness']['mean']:.3f}"

def test_rag_latency():
    results = evaluator.run_evaluation()
    assert results["latency_ms"]["p95"] <= 3000, \\
        f"P95 latency is {results['latency_ms']['p95']:.0f}ms"
\`\`\`

### Key Takeaway

Automated evaluation is the foundation of production RAG. Use RAGAS for comprehensive metrics or DeepEval for pytest-style testing. Build a golden evaluation dataset, measure after every change, and set quality gates in your CI/CD pipeline. Without evaluation, you're deploying blind.`,
    },
    {
      id: "prag-caching",
      slug: "caching-latency",
      title: "Caching & Latency Optimization",
      content: `## Caching & Latency Optimization

RAG pipelines involve multiple slow operations: embedding computation, vector search, and LLM generation. Strategic caching can reduce latency by 50-90% for common queries while significantly cutting costs.

### What to Cache

| Component | Cache Duration | Hit Rate | Impact |
|-----------|:-------------:|:--------:|:------:|
| Embedding computation | Long (days) | High | Medium |
| Query results | Medium (hours) | High | High |
| LLM responses | Short (minutes) | Medium | Highest |
| Reranker scores | Medium (hours) | Medium | Medium |

### Semantic Cache

Instead of exact match caching, use **semantic caching** — if a new query is semantically similar to a cached query, return the cached result:

\`\`\`python
class SemanticCache:
    def __init__(self, similarity_threshold: float = 0.92):
        self.cache = {}  # query_embedding → (answer, timestamp)
        self.threshold = similarity_threshold
        self.embeddings = []
        self.keys = []

    def get(self, query: str):
        """Check if a semantically similar query has been cached."""
        query_emb = embed(query)

        for i, cached_emb in enumerate(self.embeddings):
            sim = cosine_similarity(query_emb, cached_emb)
            if sim >= self.threshold:
                key = self.keys[i]
                answer, timestamp = self.cache[key]
                # Check TTL
                if time.time() - timestamp < 3600:  # 1 hour TTL
                    return answer
                else:
                    # Expired — remove from cache
                    del self.cache[key]
                    self.embeddings.pop(i)
                    self.keys.pop(i)
                    return None
        return None

    def set(self, query: str, answer: str):
        """Cache a query-answer pair."""
        query_emb = embed(query)
        key = hash(query)
        self.cache[key] = (answer, time.time())
        self.embeddings.append(query_emb)
        self.keys.append(key)

# Usage in RAG pipeline
cache = SemanticCache(similarity_threshold=0.92)

def cached_rag_query(question: str) -> str:
    # Check cache first
    cached = cache.get(question)
    if cached:
        return cached

    # Cache miss — run full pipeline
    answer = rag_pipeline(question)
    cache.set(question, answer)
    return answer
\`\`\`

### Embedding Cache

Cache embedding computations to avoid redundant API calls:

\`\`\`python
import hashlib
import json

class EmbeddingCache:
    def __init__(self, cache_dir: str = ".embedding_cache"):
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)

    def _key(self, text: str, model: str) -> str:
        return hashlib.md5(f"{model}:{text}".encode()).hexdigest()

    def get(self, text: str, model: str):
        path = os.path.join(self.cache_dir, f"{self._key(text, model)}.json")
        if os.path.exists(path):
            with open(path) as f:
                return json.load(f)
        return None

    def set(self, text: str, model: str, embedding: list):
        path = os.path.join(self.cache_dir, f"{self._key(text, model)}.json")
        with open(path, "w") as f:
            json.dump(embedding, f)

def cached_embed(text: str, model: str = "text-embedding-3-small") -> list:
    cache = EmbeddingCache()
    cached = cache.get(text, model)
    if cached:
        return cached
    embedding = embed(text, model=model)
    cache.set(text, model, embedding)
    return embedding
\`\`\`

### Latency Reduction Strategies

**1. Parallel Operations**
\`\`\`python
import asyncio

async def fast_rag(question: str) -> str:
    # Run embedding and query rewriting in parallel
    query_emb_task = asyncio.create_task(async_embed(question))
    rewrite_task = asyncio.create_task(async_rewrite(question))

    query_emb, rewritten = await asyncio.gather(query_emb_task, rewrite_task)

    # Run both searches in parallel
    original_results = asyncio.create_task(search(query_emb))
    rewrite_results = asyncio.create_task(search(embed(rewritten)))

    r1, r2 = await asyncio.gather(original_results, rewrite_results)
    merged = merge_results(r1, r2)

    return await generate(question, merged)
\`\`\`

**2. Streaming Generation**
Start streaming the LLM response while retrieval is still completing:
\`\`\`python
async def streaming_rag(question: str):
    docs = await retrieve(question)
    async for chunk in stream_generate(question, docs):
        yield chunk
\`\`\`

**3. Pre-computation**
Pre-compute answers for frequent queries during off-peak hours.

### Latency Budget

For a sub-2-second RAG response:

| Step | Budget | Optimization |
|------|:------:|-------------|
| Embedding | 50ms | Cache or local model |
| Vector search | 20ms | In-memory index |
| Reranking | 200ms | ColBERT or cached |
| LLM generation | 1500ms | Streaming, fast model |
| **Total** | **~1.8s** | |

### Key Takeaway

Caching and parallelization are essential for production RAG. Semantic caching provides the highest impact by serving similar queries from cache. Embedding caching eliminates redundant API calls. Parallel operations and streaming reduce perceived latency. Set a latency budget and optimize the slowest components first.`,
    },
    {
      id: "prag-monitoring",
      slug: "monitoring-observability",
      title: "Monitoring & Observability",
      content: `## Monitoring & Observability

Production RAG systems need comprehensive monitoring to detect quality degradation, performance issues, and cost overruns before they impact users. This lesson covers what to monitor and how.

### The Three Pillars

\`\`\`
Logs — What happened (detailed event records)
Metrics — How it performed (numeric measurements)
Traces — How it flowed (request path through the pipeline)
\`\`\`

### Key Metrics to Track

**Quality Metrics:**
- Retrieval relevance score (average similarity of retrieved docs)
- Answer faithfulness (sampled, LLM-judged)
- User satisfaction (thumbs up/down, if available)
- Empty result rate (queries with no relevant docs)

**Performance Metrics:**
- End-to-end latency (P50, P95, P99)
- Embedding latency
- Vector search latency
- LLM generation latency
- Cache hit rate

**Cost Metrics:**
- Tokens per query (input + output)
- Cost per query
- Daily/monthly LLM spend
- Embedding API calls per day

### Structured Logging

\`\`\`python
import logging
import json
import time
from dataclasses import dataclass, asdict

@dataclass
class RAGEvent:
    request_id: str
    query: str
    stage: str  # "embed", "retrieve", "rerank", "generate"
    duration_ms: float
    metadata: dict

    def to_json(self) -> str:
        return json.dumps(asdict(self), default=str)

logger = logging.getLogger("rag")

class InstrumentedRAG:
    def query(self, question: str) -> str:
        request_id = str(uuid.uuid4())
        total_start = time.time()

        # Embed
        start = time.time()
        query_emb = embed(question)
        embed_ms = (time.time() - start) * 1000
        logger.info(RAGEvent(
            request_id=request_id, query=question,
            stage="embed", duration_ms=embed_ms,
            metadata={"model": "text-embedding-3-small"}
        ).to_json())

        # Retrieve
        start = time.time()
        results = self.collection.query(query_texts=[question], n_results=5)
        retrieve_ms = (time.time() - start) * 1000
        logger.info(RAGEvent(
            request_id=request_id, query=question,
            stage="retrieve", duration_ms=retrieve_ms,
            metadata={
                "n_results": len(results["documents"][0]),
                "top_distance": results["distances"][0][0] if results["distances"][0] else None
            }
        ).to_json())

        # Generate
        start = time.time()
        answer = llm(f"Context: {results}\\nQuestion: {question}")
        generate_ms = (time.time() - start) * 1000

        total_ms = (time.time() - total_start) * 1000
        logger.info(RAGEvent(
            request_id=request_id, query=question,
            stage="generate", duration_ms=generate_ms,
            metadata={
                "total_ms": total_ms,
                "answer_length": len(answer)
            }
        ).to_json())

        return answer
\`\`\`

### Alerting Rules

Set up alerts for critical thresholds:

| Metric | Warning | Critical | Action |
|--------|:-------:|:--------:|--------|
| P95 latency | > 3s | > 5s | Investigate slow queries |
| Empty result rate | > 10% | > 20% | Check index health |
| Cache hit rate | < 20% | < 10% | Tune cache parameters |
| Daily cost | > $50 | > $100 | Review usage patterns |
| Error rate | > 1% | > 5% | Check LLM/DB availability |

### Quality Monitoring (Async)

Run quality checks asynchronously on a sample of queries:

\`\`\`python
import random

class QualityMonitor:
    def __init__(self, sample_rate: float = 0.05):
        self.sample_rate = sample_rate
        self.quality_scores = []

    def maybe_evaluate(self, question: str, answer: str, context: list):
        """Randomly sample queries for quality evaluation."""
        if random.random() > self.sample_rate:
            return

        # Run async quality check
        faithfulness = evaluate_faithfulness(answer, "\\n".join(context))
        relevance = evaluate_relevance(question, answer)

        self.quality_scores.append({
            "question": question,
            "faithfulness": faithfulness,
            "relevance": relevance,
            "timestamp": time.time()
        })

        # Alert if quality drops
        recent = self.quality_scores[-100:]
        avg_faith = np.mean([s["faithfulness"] for s in recent])
        if avg_faith < 0.75:
            alert(f"Faithfulness dropped to {avg_faith:.2f}")
\`\`\`

### Dashboard Essentials

A production RAG dashboard should show:

1. **Real-time**: Request rate, latency, error rate
2. **Quality**: Rolling average faithfulness, relevance scores
3. **Cost**: Tokens used, cost per query, daily spend
4. **Cache**: Hit rate, cache size, eviction rate
5. **Top queries**: Most frequent queries and their quality scores

### Key Takeaway

Monitoring is how you maintain RAG quality in production. Track latency at every stage, sample quality metrics asynchronously, set alerts for degradation, and build dashboards for visibility. The most important metric is faithfulness — if it drops, your RAG system is hallucinating, and users are getting wrong answers.`,
    },
    {
      id: "prag-scaling",
      slug: "scaling-rag-systems",
      title: "Scaling RAG Systems",
      content: `## Scaling RAG Systems

As your document corpus grows and user traffic increases, every component of the RAG pipeline needs to scale. This lesson covers strategies for scaling from thousands to millions of documents and from tens to thousands of concurrent users.

### Scaling Dimensions

| Dimension | Challenge | Solution |
|-----------|-----------|----------|
| **Document count** | Index grows, search slows | Sharding, hierarchical indexing |
| **Query throughput** | Concurrent requests | Load balancing, caching |
| **Freshness** | New docs need fast indexing | Incremental indexing |
| **Cost** | More queries = more spend | Tiered models, caching |

### Scaling Vector Search

**Sharding**: Split your index across multiple partitions:

\`\`\`python
class ShardedIndex:
    def __init__(self, n_shards: int = 4):
        self.shards = [create_collection(f"shard_{i}") for i in range(n_shards)]
        self.n_shards = n_shards

    def _get_shard(self, doc_id: str) -> int:
        return hash(doc_id) % self.n_shards

    def add(self, doc_id: str, document: str, metadata: dict):
        shard = self._get_shard(doc_id)
        self.shards[shard].add(
            documents=[document], ids=[doc_id], metadatas=[metadata]
        )

    def search(self, query: str, n_results: int = 5) -> list:
        # Search all shards in parallel
        all_results = []
        for shard in self.shards:
            results = shard.query(query_texts=[query], n_results=n_results)
            all_results.extend(zip(
                results["documents"][0],
                results["distances"][0]
            ))
        # Merge and return top results
        all_results.sort(key=lambda x: x[1])
        return [doc for doc, dist in all_results[:n_results]]
\`\`\`

**Approximate Nearest Neighbors**: At scale, use ANN algorithms that trade small accuracy for large speed gains:

| Algorithm | 1M docs | 10M docs | 100M docs | Recall@10 |
|-----------|:-------:|:--------:|:---------:|:---------:|
| Exact KNN | 500ms | 5s | 50s | 100% |
| HNSW | 2ms | 5ms | 15ms | 98.5% |
| IVF-PQ | 1ms | 3ms | 8ms | 95% |

### Incremental Indexing

Don't re-index everything when new documents arrive:

\`\`\`python
class IncrementalIndexer:
    def __init__(self, collection):
        self.collection = collection
        self.indexed_ids = set()

    def sync(self, documents: list):
        """Add new documents, skip already indexed ones."""
        new_docs = [d for d in documents if d["id"] not in self.indexed_ids]

        if not new_docs:
            return {"new": 0, "total": len(self.indexed_ids)}

        # Batch index new documents
        batch_size = 100
        for i in range(0, len(new_docs), batch_size):
            batch = new_docs[i:i+batch_size]
            self.collection.add(
                documents=[d["content"] for d in batch],
                ids=[d["id"] for d in batch],
                metadatas=[d.get("metadata", {}) for d in batch]
            )
            self.indexed_ids.update(d["id"] for d in batch)

        return {"new": len(new_docs), "total": len(self.indexed_ids)}
\`\`\`

### Cost Scaling Strategies

**1. Tiered Model Usage**
\`\`\`python
def cost_optimized_rag(query: str, importance: str = "normal") -> str:
    if importance == "low":
        # Cheap model, fewer results
        model = "claude-haiku-4-20250414"
        n_results = 3
    elif importance == "high":
        # Best model, more results, reranking
        model = "claude-sonnet-4-20250514"
        n_results = 10
    else:
        model = "claude-haiku-4-20250414"
        n_results = 5

    docs = retrieve(query, n_results)
    return generate(query, docs, model=model)
\`\`\`

**2. Query Classification for Cost Control**
\`\`\`python
def route_by_cost(query: str) -> str:
    """Route simple queries to cheap paths, complex to expensive."""
    complexity = classify_complexity(query)

    if complexity == "simple":
        # Check cache → direct answer (no RAG)
        return cached_or_direct(query)
    elif complexity == "standard":
        # Basic RAG with Haiku
        return basic_rag(query, model="claude-haiku-4-20250414")
    else:
        # Full pipeline with Sonnet
        return full_rag(query, model="claude-sonnet-4-20250514")
\`\`\`

### Production Architecture

\`\`\`
[Load Balancer]
      ↓
[API Servers (3x)] ← Horizontal scaling
      ↓
[Semantic Cache (Redis)]
      ↓
[Vector DB Cluster]     [BM25 Index]
  (Qdrant/Pinecone)     (Elasticsearch)
      ↓                      ↓
[Reranker Service] ← Results merged
      ↓
[LLM Gateway] ← Rate limiting, model routing
      ↓
[Response Cache]
\`\`\`

### Scaling Checklist

1. Start with semantic caching (biggest immediate win)
2. Add query routing (simple → cheap, complex → full pipeline)
3. Scale vector DB (managed service like Pinecone or Qdrant Cloud)
4. Add horizontal API scaling (stateless, behind load balancer)
5. Implement incremental indexing (avoid full re-index)
6. Monitor cost per query and set budgets

### Key Takeaway

Scaling RAG is primarily about caching, routing, and managed infrastructure. Semantic caching eliminates redundant work, query routing matches cost to complexity, and managed vector databases handle the scaling of search. Start with these three strategies before investing in more complex infrastructure.

> **Resource**: [RAG Techniques](https://github.com/NirDiamant/RAG_Techniques) — Production deployment patterns and scaling strategies for RAG systems.`,
    },
  ],
};
