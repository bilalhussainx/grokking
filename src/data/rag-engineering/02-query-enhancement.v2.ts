import { Module } from "../types";

export const queryEnhancementModule: Module = {
  id: "rag-query",
  title: "Query Enhancement",
  description: "Transform user queries for better retrieval — using HyDE, multi-query expansion, intelligent routing, and step-back prompting techniques.",
  lessons: [
    {
      id: "qe-transformations",
      slug: "query-transformations",
      title: "Query Transformations",
      content: `## Query Transformations

The user's query is often the weakest link in a RAG pipeline. Users ask vague, ambiguous, or poorly-worded questions that don't match the language in your documents. **Query transformation** rewrites the query before retrieval to bridge this gap.

### The Problem

\`\`\`
User asks: "Why is my app slow?"
Documents contain: "Performance optimization: reduce API response times by implementing caching..."

Direct embedding search may miss this because "slow" and "performance optimization"
are semantically related but not identical.
\`\`\`

### Transformation Techniques

**1. Query Rewriting**: Rephrase for clarity

\`\`\`python
def rewrite_query(query: str) -> str:
    return llm(
        f"Rewrite this search query to be more specific and use "
        f"technical terminology that would appear in documentation:\\n\\n"
        f"Original: {query}\\n"
        f"Rewritten:"
    )

# "Why is my app slow?" → "How to diagnose and fix application performance issues
#  including response time, latency, and throughput optimization"
\`\`\`

**2. Query Expansion**: Generate multiple related queries

\`\`\`python
def expand_query(query: str, n: int = 3) -> list:
    response = llm(
        f"Generate {n} alternative search queries that would help find "
        f"the answer to this question. Each should approach the topic "
        f"from a different angle:\\n\\n"
        f"Original: {query}\\n"
        f"Alternatives (one per line):"
    )
    alternatives = [q.strip() for q in response.split("\\n") if q.strip()]
    return [query] + alternatives[:n]
\`\`\`

**3. Query Decomposition**: Break complex queries into sub-queries

\`\`\`python
def decompose_query(query: str) -> list:
    response = llm(
        f"This question requires multiple pieces of information. "
        f"Break it into simpler sub-questions:\\n\\n"
        f"Question: {query}\\n"
        f"Sub-questions (one per line):"
    )
    return [q.strip().lstrip("0123456789.-) ")
            for q in response.split("\\n") if q.strip()]

# "Compare React and Vue performance on mobile" →
# 1. "What is React's performance on mobile devices?"
# 2. "What is Vue's performance on mobile devices?"
# 3. "What benchmarks compare React vs Vue mobile performance?"
\`\`\`

### Combining Transformations

\`\`\`python
def enhanced_retrieval(query: str, collection, n_results: int = 5) -> list:
    """Retrieve using multiple query transformations."""
    # Generate query variants
    rewritten = rewrite_query(query)
    expanded = expand_query(query, n=2)
    all_queries = [query, rewritten] + expanded

    # Retrieve for each variant
    all_results = {}
    for q in all_queries:
        results = collection.query(query_texts=[q], n_results=n_results)
        for doc_id, doc, score in zip(
            results["ids"][0], results["documents"][0], results["distances"][0]
        ):
            if doc_id not in all_results or score < all_results[doc_id][1]:
                all_results[doc_id] = (doc, score)

    # Return unique results sorted by best score
    sorted_results = sorted(all_results.values(), key=lambda x: x[1])
    return [doc for doc, score in sorted_results[:n_results]]
\`\`\`

### Measuring Query Transformation Impact

Always A/B test transformations:

\`\`\`python
# Baseline: direct query
baseline_recall = evaluate_recall(queries, collection, transform=None)

# With rewriting
rewrite_recall = evaluate_recall(queries, collection, transform=rewrite_query)

# With expansion
expand_recall = evaluate_recall(queries, collection, transform=expand_query)

print(f"Baseline recall: {baseline_recall:.3f}")
print(f"Rewrite recall:  {rewrite_recall:.3f}")
print(f"Expansion recall: {expand_recall:.3f}")
\`\`\`

### Key Takeaway

Query transformation is one of the highest-ROI improvements you can make to a RAG pipeline. Rewriting, expansion, and decomposition help bridge the gap between how users ask questions and how your documents phrase answers. The cost is one extra LLM call per query, but the retrieval improvement is often dramatic.

> **Resource**: [RAG Techniques — Query Enhancement](https://github.com/NirDiamant/RAG_Techniques) includes implementations of all major query transformation strategies.`,
    },
    {
      id: "qe-hyde",
      slug: "hyde",
      title: "HyDE (Hypothetical Document Embedding)",
      content: `## HyDE: Hypothetical Document Embedding

**HyDE** (Hypothetical Document Embedding) is a clever trick: instead of embedding the user's question and searching for similar documents, you first generate a hypothetical answer, embed that, and search. The hypothetical answer is closer in language to the actual documents, leading to better retrieval.

### The Insight

Questions and answers use different language:
- Question: "What causes memory leaks in Node.js?"
- Document: "Common sources of memory leaks include unclosed event listeners, global variable accumulation, and circular references in closures..."

The question is short and interrogative. The document is long and declarative. Their embeddings may not be close enough for accurate retrieval.

### How HyDE Works

\`\`\`
User Question → LLM generates hypothetical answer → Embed the answer → Search
\`\`\`

Instead of:
\`\`\`
User Question → Embed the question → Search
\`\`\`

### Implementation

\`\`\`python
def hyde_search(query: str, collection, n_results: int = 5) -> list:
    """Search using Hypothetical Document Embedding."""

    # Step 1: Generate a hypothetical answer
    hypothetical = llm(
        f"Write a detailed paragraph that would answer this question. "
        f"Write as if you're an expert writing documentation. "
        f"Don't worry about accuracy — focus on using the right "
        f"technical terminology and language style.\\n\\n"
        f"Question: {query}\\n\\n"
        f"Answer paragraph:"
    )

    # Step 2: Search using the hypothetical answer as the query
    results = collection.query(
        query_texts=[hypothetical],
        n_results=n_results
    )

    return results["documents"][0]
\`\`\`

### Example in Action

\`\`\`
Query: "How do I handle authentication in Next.js?"

Hypothetical Answer (generated by LLM):
"Authentication in Next.js can be implemented using NextAuth.js or a custom
solution. For server-side authentication, use middleware to check session tokens
in the request headers. Protected API routes should validate JWT tokens using
the jose library. For client-side auth state, create an AuthContext provider
that wraps the application and provides user session data to all components.
Store tokens in httpOnly cookies for security..."

This hypothetical answer shares much more vocabulary with your actual
documentation than the short question does.
\`\`\`

### When HyDE Helps Most

| Scenario | HyDE Improvement |
|----------|:---------------:|
| Short, vague queries | High |
| Technical documentation | High |
| FAQ-style documents | Medium |
| Already well-matched queries | Low |
| Factual lookups (names, dates) | Low or negative |

### HyDE Variations

**Multi-HyDE**: Generate multiple hypothetical documents and search with each:

\`\`\`python
def multi_hyde(query: str, collection, n_hypotheticals: int = 3) -> list:
    """Generate multiple hypothetical docs for broader coverage."""
    hypotheticals = []
    for i in range(n_hypotheticals):
        hypo = llm(
            f"Write a unique paragraph answering this question. "
            f"Use a different angle or focus than previous attempts.\\n\\n"
            f"Question: {query}\\n"
            f"Variation {i+1}:"
        )
        hypotheticals.append(hypo)

    # Search with each and merge results
    all_docs = {}
    for hypo in hypotheticals:
        results = collection.query(query_texts=[hypo], n_results=5)
        for doc_id, doc in zip(results["ids"][0], results["documents"][0]):
            all_docs[doc_id] = doc

    return list(all_docs.values())[:5]
\`\`\`

### HyDE + Direct Search (Hybrid)

Combine both approaches for robustness:

\`\`\`python
def hybrid_hyde_search(query: str, collection, n_results: int = 5) -> list:
    """Combine direct search with HyDE for best coverage."""
    # Direct search
    direct = collection.query(query_texts=[query], n_results=n_results)

    # HyDE search
    hypothetical = llm(f"Write a paragraph answering: {query}")
    hyde = collection.query(query_texts=[hypothetical], n_results=n_results)

    # Merge and deduplicate, preferring higher scores
    seen = set()
    merged = []
    for doc_id, doc in zip(direct["ids"][0] + hyde["ids"][0],
                           direct["documents"][0] + hyde["documents"][0]):
        if doc_id not in seen:
            seen.add(doc_id)
            merged.append(doc)

    return merged[:n_results]
\`\`\`

### Limitations

- **Extra latency**: One additional LLM call before search
- **Hallucination risk**: The hypothetical answer may mislead retrieval if it uses wrong terminology
- **Not for factual lookups**: If the user asks for a specific document or fact, HyDE can hurt

### Key Takeaway

HyDE bridges the vocabulary gap between questions and documents by generating a hypothetical answer first. It's most effective for technical documentation and vague queries. Always combine with direct search (hybrid approach) for robustness, and measure the impact on your specific dataset.`,
    },
    {
      id: "qe-multi-query",
      slug: "multi-query-retrieval",
      title: "Multi-Query Retrieval",
      content: `## Multi-Query Retrieval

**Multi-query retrieval** generates multiple variations of the user's question, retrieves documents for each, and merges the results. This dramatically improves recall by capturing different aspects of the question that a single query might miss.

### Why Multiple Queries?

A single query captures one perspective. Consider:

\`\`\`
Original: "How to improve database performance?"

Variation 1: "Database query optimization techniques" (focuses on queries)
Variation 2: "Database indexing best practices" (focuses on indexing)
Variation 3: "How to reduce database latency" (focuses on latency)
Variation 4: "Database caching strategies" (focuses on caching)
\`\`\`

Each variation retrieves different relevant documents that the original query alone might miss.

### Implementation

\`\`\`python
def multi_query_retrieve(
    query: str,
    collection,
    n_queries: int = 4,
    n_per_query: int = 5
) -> list:
    """Generate multiple query variations and merge retrieval results."""

    # Generate query variations
    response = llm(
        f"Generate {n_queries} different search queries that would help answer "
        f"this question. Each should focus on a different aspect or use "
        f"different terminology.\\n\\n"
        f"Original question: {query}\\n\\n"
        f"Queries (one per line):"
    )
    queries = [query]  # Always include original
    queries += [q.strip().lstrip("0123456789.-) ")
                for q in response.split("\\n") if q.strip()]
    queries = queries[:n_queries + 1]

    # Retrieve for each query
    all_docs = {}  # doc_id → (document, best_score, source_queries)
    for q in queries:
        results = collection.query(
            query_texts=[q],
            n_results=n_per_query,
            include=["documents", "distances"]
        )
        for doc_id, doc, dist in zip(
            results["ids"][0],
            results["documents"][0],
            results["distances"][0]
        ):
            if doc_id not in all_docs or dist < all_docs[doc_id][1]:
                all_docs[doc_id] = (doc, dist)

    # Sort by relevance score
    sorted_docs = sorted(all_docs.values(), key=lambda x: x[1])
    return [doc for doc, score in sorted_docs]
\`\`\`

### Reciprocal Rank Fusion (RRF)

When merging results from multiple queries, **Reciprocal Rank Fusion** is the gold standard — it combines rankings without needing comparable scores:

\`\`\`python
def reciprocal_rank_fusion(
    result_lists: list,
    k: int = 60
) -> list:
    """Merge multiple ranked lists using Reciprocal Rank Fusion.

    Args:
        result_lists: List of lists, each containing (doc_id, document) tuples
        k: Constant to prevent high-ranked items from dominating (default 60)
    """
    scores = {}  # doc_id → cumulative RRF score
    docs = {}    # doc_id → document content

    for results in result_lists:
        for rank, (doc_id, document) in enumerate(results):
            if doc_id not in scores:
                scores[doc_id] = 0
                docs[doc_id] = document
            scores[doc_id] += 1 / (rank + k)

    # Sort by RRF score (higher is better)
    sorted_ids = sorted(scores, key=scores.get, reverse=True)
    return [(doc_id, docs[doc_id], scores[doc_id]) for doc_id in sorted_ids]
\`\`\`

### Multi-Query with Decomposition

For complex questions, decompose into sub-questions and retrieve for each:

\`\`\`python
def decompose_and_retrieve(query: str, collection) -> dict:
    """Decompose complex query, retrieve for each sub-question."""
    sub_questions = llm(
        f"Break this into 2-4 independent sub-questions:\\n{query}"
    ).split("\\n")

    sub_results = {}
    for sq in sub_questions:
        sq = sq.strip().lstrip("0123456789.-) ")
        if not sq:
            continue
        docs = collection.query(query_texts=[sq], n_results=3)
        sub_results[sq] = docs["documents"][0]

    return sub_results
\`\`\`

### Performance Impact

Multi-query retrieval typically improves recall by 15-30% at the cost of:
- N additional LLM calls for query generation
- N additional vector DB searches
- Additional latency (can be parallelized)

| Metric | Single Query | Multi-Query (4x) |
|--------|:-----------:|:----------------:|
| Recall@5 | 0.65 | 0.82 |
| Precision@5 | 0.78 | 0.71 |
| Latency | 200ms | 350ms (parallel) |

Note: Precision may decrease slightly (more results = some less relevant), but recall improvement usually outweighs this.

### Key Takeaway

Multi-query retrieval is one of the most reliable ways to improve RAG recall. By searching with multiple phrasings, you capture relevant documents that any single query would miss. Use RRF for merging results, parallelize queries for speed, and always measure the impact on your evaluation dataset.`,
    },
    {
      id: "qe-routing",
      slug: "query-routing",
      title: "Query Routing",
      content: `## Query Routing

**Query routing** directs each query to the most appropriate data source or retrieval strategy. Not every question should be answered the same way — some need your knowledge base, others need web search, and some don't need retrieval at all.

### Why Route Queries?

\`\`\`
"What is 2 + 2?"              → Direct LLM (no retrieval needed)
"What's our vacation policy?"  → Internal knowledge base
"What happened in the news?"   → Web search
"Show me Q3 revenue"           → SQL database
"Find bug in auth.py"          → Code repository
\`\`\`

Using the wrong source wastes time and returns irrelevant results.

### Routing Strategies

**1. LLM-Based Routing**: Use an LLM to classify the query

\`\`\`python
def route_query(query: str) -> str:
    """Classify query to determine the best data source."""
    route = llm(
        f"Classify this query into exactly one category:\\n\\n"
        f"DIRECT - Can be answered from general knowledge\\n"
        f"KB - Needs company/product-specific information\\n"
        f"WEB - Needs current/real-time information\\n"
        f"SQL - Needs data from a database\\n"
        f"CODE - Needs information from the codebase\\n\\n"
        f"Query: {query}\\n"
        f"Category:",
        model="claude-haiku-4-20250414"  # Fast model for classification
    )
    return route.strip().upper()
\`\`\`

**2. Semantic Routing**: Embed the query and compare to route descriptions

\`\`\`python
ROUTES = {
    "kb": "Internal company policies, product documentation, and procedures",
    "web": "Current events, latest news, real-time data, and recent updates",
    "sql": "Revenue, sales figures, customer counts, and business metrics",
    "code": "Source code, functions, classes, and technical implementation",
    "direct": "General knowledge, definitions, and common information"
}

def semantic_route(query: str) -> str:
    query_embedding = embed(query)
    route_embeddings = {k: embed(v) for k, v in ROUTES.items()}

    best_route = max(
        route_embeddings.items(),
        key=lambda x: cosine_similarity(query_embedding, x[1])
    )
    return best_route[0]
\`\`\`

**3. Keyword-Based Routing**: Simple pattern matching for speed

\`\`\`python
ROUTE_PATTERNS = {
    "sql": ["revenue", "sales", "count", "how many", "total", "average"],
    "web": ["latest", "today", "current", "news", "recent"],
    "code": ["function", "class", "bug", "error", "implement", ".py", ".ts"],
}

def keyword_route(query: str) -> str:
    query_lower = query.lower()
    for route, keywords in ROUTE_PATTERNS.items():
        if any(kw in query_lower for kw in keywords):
            return route
    return "kb"  # Default to knowledge base
\`\`\`

### Multi-Source Routing

Some queries benefit from multiple sources:

\`\`\`python
def multi_source_retrieve(query: str) -> dict:
    """Route to multiple sources and merge results."""
    routes = llm(
        f"Which data sources should be consulted? "
        f"Return comma-separated: kb, web, sql, code, direct\\n"
        f"Query: {query}"
    ).strip().split(",")

    results = {}
    for route in routes:
        route = route.strip().lower()
        if route == "kb":
            results["kb"] = kb_search(query)
        elif route == "web":
            results["web"] = web_search(query)
        elif route == "sql":
            results["sql"] = sql_query(query)
        elif route == "code":
            results["code"] = code_search(query)

    return results
\`\`\`

### Routing with Collection Selection

If you have multiple vector collections:

\`\`\`python
COLLECTIONS = {
    "product_docs": "Product documentation, user guides, and feature descriptions",
    "engineering": "Technical architecture, API references, and system design",
    "support": "Customer support tickets, FAQs, and troubleshooting guides",
    "legal": "Terms of service, privacy policy, and compliance documents",
}

def route_to_collection(query: str) -> list:
    """Select the most relevant collection(s) for a query."""
    selection = llm(
        f"Available collections:\\n"
        + "\\n".join(f"- {k}: {v}" for k, v in COLLECTIONS.items())
        + f"\\n\\nQuery: {query}\\n"
        f"Select 1-2 best collections (comma-separated):"
    )
    return [c.strip() for c in selection.split(",")]
\`\`\`

### Key Takeaway

Query routing ensures each question reaches the data source best equipped to answer it. Use LLM-based routing for accuracy, semantic routing for speed, or keyword routing for simplicity. Multi-source routing handles complex queries that span multiple data sources. Routing is a cheap operation (one fast LLM call) with a large impact on answer quality.`,
    },
    {
      id: "qe-step-back",
      slug: "step-back-prompting",
      title: "Step-Back Prompting",
      content: `## Step-Back Prompting

**Step-back prompting** takes a specific question and generates a broader, more abstract version of it before retrieval. This retrieves higher-level context that helps answer the specific question more thoroughly.

### The Insight

Specific questions often need general context to answer well:

\`\`\`
Specific: "Why does my React useEffect cleanup run on every re-render?"
Step-back: "How does the React useEffect lifecycle work, including cleanup?"
\`\`\`

The step-back query retrieves comprehensive documentation about useEffect, which contains the specific answer plus helpful context.

### How Step-Back Prompting Works

\`\`\`
Original Question → Generate Step-Back Question → Retrieve for Both
→ Combine Context → Generate Answer
\`\`\`

### Implementation

\`\`\`python
def step_back_prompting(query: str, collection) -> str:
    """Use step-back prompting for more comprehensive retrieval."""

    # Step 1: Generate step-back question
    step_back = llm(
        f"Given this specific question, generate a broader, more general "
        f"question that would provide useful background context.\\n\\n"
        f"Specific question: {query}\\n"
        f"Broader question:"
    )

    # Step 2: Retrieve for both queries
    specific_docs = collection.query(
        query_texts=[query], n_results=3
    )["documents"][0]

    general_docs = collection.query(
        query_texts=[step_back], n_results=3
    )["documents"][0]

    # Step 3: Combine context (general first, then specific)
    context = "Background context:\\n"
    context += "\\n\\n".join(general_docs)
    context += "\\n\\nSpecific information:\\n"
    context += "\\n\\n".join(specific_docs)

    # Step 4: Generate answer with combined context
    answer = llm(
        f"Using the background context and specific information below, "
        f"answer the question thoroughly.\\n\\n"
        f"{context}\\n\\n"
        f"Question: {query}"
    )

    return answer
\`\`\`

### Examples of Step-Back Questions

| Specific Question | Step-Back Question |
|-------------------|-------------------|
| "Why is my Docker container running out of memory?" | "How does Docker memory management and resource limits work?" |
| "How do I fix CORS errors in my Express API?" | "What is CORS and how do web servers handle cross-origin requests?" |
| "Why is my Postgres query slow with a JOIN?" | "How does PostgreSQL execute JOIN operations and what affects performance?" |
| "How do I handle token refresh in NextAuth?" | "What is the complete authentication token lifecycle in NextAuth.js?" |

### Multi-Level Step-Back

For very specific questions, step back multiple times:

\`\`\`python
def multi_step_back(query: str, levels: int = 2) -> list:
    """Generate increasingly general questions."""
    questions = [query]
    current = query

    for i in range(levels):
        stepped = llm(
            f"Generate a broader version of this question:\\n{current}"
        )
        questions.append(stepped.strip())
        current = stepped.strip()

    return questions

# "Why does useEffect cleanup run when deps change?"
# → "How does React useEffect handle dependencies and cleanup?"
# → "What is the React component lifecycle and side effect model?"
\`\`\`

### When Step-Back Helps

| Query Type | Step-Back Benefit |
|-----------|:-----------------:|
| Debugging questions ("why is X broken?") | High |
| Implementation questions ("how do I do X?") | Medium |
| Conceptual questions ("what is X?") | Low (already general) |
| Factual lookups ("what is the API key for?") | None |

### Combining with Other Techniques

Step-back prompting works well combined with:
- **Multi-query**: Generate both step-back and specific variations
- **HyDE**: Generate hypothetical answers for both levels
- **Reranking**: Use a reranker to pick the best documents from both retrievals

\`\`\`python
def comprehensive_retrieve(query: str, collection) -> list:
    """Combine step-back + multi-query + reranking."""
    # Step-back query
    general = generate_step_back(query)

    # Multi-query variations
    variations = expand_query(query, n=2)

    # Retrieve for all queries
    all_queries = [query, general] + variations
    all_docs = merge_results([
        collection.query(query_texts=[q], n_results=3)
        for q in all_queries
    ])

    # Rerank by relevance to original query
    reranked = rerank(query, all_docs)
    return reranked[:5]
\`\`\`

### Key Takeaway

Step-back prompting retrieves broader context that helps answer specific questions more thoroughly. It's particularly effective for debugging and implementation questions where understanding the bigger picture is essential. The cost is one extra LLM call and one extra retrieval, but the improvement in answer quality — especially for complex technical questions — is significant.

> **Resource**: [RAG Techniques — Query Enhancement](https://github.com/NirDiamant/RAG_Techniques) includes step-back prompting implementations alongside other query transformation techniques.`,
    },
  ],
};
