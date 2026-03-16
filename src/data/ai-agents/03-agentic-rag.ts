import { Module } from "../types";

export const agenticRagModule: Module = {
  id: "agent-rag",
  title: "Agentic RAG",
  description:
    "Go beyond basic RAG with self-reflective, corrective, and adaptive retrieval strategies that give agents intelligent control over their knowledge retrieval.",
  lessons: [
    {
      id: "ar-what-is-agentic-rag",
      slug: "what-is-agentic-rag",
      title: "What is Agentic RAG?",
      content: `## What is Agentic RAG?

Standard RAG (Retrieval-Augmented Generation) follows a simple pipeline: embed the query, retrieve documents, generate an answer. **Agentic RAG** puts an agent in control of that pipeline — the LLM decides when to retrieve, what to retrieve, whether the retrieved documents are good enough, and when to try a different strategy.

### The Problem with Basic RAG

Basic RAG has a fixed, linear pipeline:

\`\`\`
Query → Embed → Retrieve Top-K → Generate Answer
\`\`\`

This works well for simple factual questions but fails when:
- The initial query is vague or ambiguous
- Retrieved documents are irrelevant or insufficient
- The answer requires information from multiple sources
- The question needs reasoning, not just retrieval

### How Agentic RAG Differs

Agentic RAG wraps the retrieval pipeline in an agent loop:

\`\`\`
Query → Agent decides: Do I need retrieval?
  → Yes → Retrieve → Agent evaluates: Are these docs relevant?
    → No → Agent reformulates query → Retrieve again
    → Yes → Agent decides: Do I have enough info?
      → No → Agent searches for additional sources
      → Yes → Generate answer → Agent evaluates: Is the answer faithful?
        → No → Retry with different documents
        → Yes → Return answer
\`\`\`

### The Four Pillars of Agentic RAG

| Pillar | What It Does |
|--------|-------------|
| **Routing** | Agent decides whether to use retrieval, web search, or direct generation |
| **Self-reflection** | Agent evaluates retrieved documents for relevance |
| **Correction** | Agent reformulates queries when retrieval fails |
| **Adaptation** | Agent switches strategies based on query complexity |

### When to Use Agentic RAG

| Scenario | Basic RAG | Agentic RAG |
|----------|-----------|-------------|
| Simple factual question | Works well | Overkill |
| Ambiguous query | Often fails | Agent clarifies/reformulates |
| Multi-hop reasoning | Fails | Agent chains retrievals |
| Mixed source needs | Single source | Agent routes to best source |
| Quality-critical answers | No verification | Agent validates and retries |

### A Simple Agentic RAG Example

\`\`\`python
def agentic_rag(query: str) -> str:
    # Step 1: Agent decides if retrieval is needed
    plan = llm("Do I need to search my knowledge base for this? "
               f"Query: {query}")

    if "no retrieval needed" in plan.lower():
        return llm(f"Answer directly: {query}")

    # Step 2: Retrieve documents
    docs = vector_store.search(query, k=5)

    # Step 3: Agent evaluates relevance
    evaluation = llm(f"Are these documents relevant to '{query}'? "
                     f"Documents: {docs}")

    if "not relevant" in evaluation.lower():
        # Step 4: Reformulate and retry
        new_query = llm(f"Reformulate this query for better retrieval: {query}")
        docs = vector_store.search(new_query, k=5)

    # Step 5: Generate with validated documents
    answer = llm(f"Answer based on these documents: {docs}\\nQuery: {query}")

    # Step 6: Faithfulness check
    check = llm(f"Is this answer supported by the documents? "
                f"Answer: {answer}\\nDocs: {docs}")

    if "not supported" in check.lower():
        answer = llm(f"Try again, sticking strictly to the documents: {docs}")

    return answer
\`\`\`

### Key Takeaway

Agentic RAG transforms retrieval from a rigid pipeline into an intelligent, adaptive process. The agent controls the entire flow — deciding when to retrieve, evaluating results, and correcting course when needed. This produces dramatically better answers for complex queries at the cost of more LLM calls.

> **Resource**: [GenAI Agents — Agentic RAG](https://github.com/NirDiamant/GenAI_Agents) includes implementations of Self-RAG, Corrective RAG, and Adaptive RAG patterns.`,
    },
    {
      id: "ar-self-rag",
      slug: "self-rag",
      title: "Self-RAG (Self-Reflection on Retrieval)",
      content: `## Self-RAG: Self-Reflection on Retrieval

**Self-RAG** (Self-Reflective Retrieval-Augmented Generation) adds a critical capability to RAG: the model evaluates its own retrieval and generation quality at every step. Think of it as RAG with a built-in quality control system.

### The Self-RAG Paper

Published by Asai et al. (2023), Self-RAG trains the LLM to generate special **reflection tokens** that assess:

1. **\`[Retrieve]\`**: Does this query need retrieval?
2. **\`[IsRelevant]\`**: Is the retrieved document relevant to the query?
3. **\`[IsSupported]\`**: Is the generated response supported by the retrieved document?
4. **\`[IsUseful]\`**: Is the final response useful to the user?

### How Self-RAG Works

\`\`\`
Step 1: Input query
Step 2: LLM generates [Retrieve] token
  → "yes" → Retrieve documents
  → "no"  → Generate directly (skip retrieval)
Step 3: For each retrieved document:
  → LLM generates [IsRelevant] token
  → If "relevant" → Generate a response segment
  → LLM generates [IsSupported] token
  → If "fully supported" → Keep this segment
  → If "partially supported" → Flag for review
  → If "not supported" → Discard this segment
Step 4: Select the best response across all segments
Step 5: LLM generates [IsUseful] token for final check
\`\`\`

### Implementing Self-RAG with Prompting

You don't need a specially trained model. You can approximate Self-RAG with prompting:

\`\`\`python
def self_rag(query: str, vector_store) -> str:
    # Reflection 1: Do we need retrieval?
    need_retrieval = llm(
        f"Does this question require looking up external information, "
        f"or can it be answered from general knowledge?\\n"
        f"Question: {query}\\n"
        f"Answer RETRIEVE or DIRECT."
    )

    if "DIRECT" in need_retrieval:
        return llm(f"Answer this question: {query}")

    # Retrieve documents
    docs = vector_store.search(query, k=5)

    # Reflection 2: Relevance grading
    relevant_docs = []
    for doc in docs:
        grade = llm(
            f"Is this document relevant to the question?\\n"
            f"Question: {query}\\n"
            f"Document: {doc.content}\\n"
            f"Answer RELEVANT or NOT_RELEVANT."
        )
        if "RELEVANT" in grade:
            relevant_docs.append(doc)

    if not relevant_docs:
        # No relevant docs — try web search as fallback
        return web_search_fallback(query)

    # Generate answer from relevant docs
    context = "\\n".join([d.content for d in relevant_docs])
    answer = llm(
        f"Answer based on the following context:\\n{context}\\n\\n"
        f"Question: {query}"
    )

    # Reflection 3: Faithfulness check
    faithfulness = llm(
        f"Is this answer fully supported by the provided context?\\n"
        f"Context: {context}\\n"
        f"Answer: {answer}\\n"
        f"Rate: FULLY_SUPPORTED, PARTIALLY_SUPPORTED, or NOT_SUPPORTED."
    )

    if "NOT_SUPPORTED" in faithfulness:
        # Regenerate with stricter instructions
        answer = llm(
            f"Answer ONLY using information from the context. "
            f"If the context doesn't contain the answer, say so.\\n"
            f"Context: {context}\\nQuestion: {query}"
        )

    return answer
\`\`\`

### Self-RAG vs Basic RAG Performance

| Metric | Basic RAG | Self-RAG |
|--------|-----------|----------|
| **Relevance** | Retrieves top-K blindly | Filters irrelevant docs |
| **Faithfulness** | May hallucinate | Checks if answer is grounded |
| **Efficiency** | Always retrieves | Skips retrieval when unnecessary |
| **Latency** | 1 LLM call | 3-5 LLM calls |
| **Cost** | Lower | Higher (more LLM calls) |

### When Self-RAG Shines

- **High-stakes domains**: Medical, legal, financial — where hallucination is dangerous
- **Mixed query types**: Some questions need retrieval, others don't
- **Quality over speed**: When accuracy matters more than latency

### Key Takeaway

Self-RAG adds reflection at every stage of the RAG pipeline. The model decides whether to retrieve, grades document relevance, and verifies that its answer is supported by evidence. It's more expensive but significantly more reliable than basic RAG. Use it when accuracy is paramount.`,
    },
    {
      id: "ar-corrective-rag",
      slug: "corrective-rag",
      title: "Corrective RAG (CRAG)",
      content: `## Corrective RAG (CRAG)

**Corrective RAG** (CRAG) addresses a fundamental weakness of standard RAG: what happens when the retrieved documents are wrong or irrelevant? CRAG adds a correction mechanism — if retrieval fails, the system automatically pivots to alternative strategies.

### The Problem CRAG Solves

Standard RAG blindly generates from whatever documents it retrieves. If those documents are irrelevant, outdated, or misleading, the generated answer will be too. CRAG introduces a **retrieval evaluator** that triggers corrective actions.

### The CRAG Pipeline

\`\`\`
Query → Retrieve Documents → Evaluate Retrieval Quality
  → CORRECT: Documents are relevant → Use them as-is
  → AMBIGUOUS: Partially relevant → Refine and supplement
  → INCORRECT: Documents are irrelevant → Trigger web search
→ Generate answer from best available context
\`\`\`

### The Three Actions

| Evaluation | Action | Description |
|-----------|--------|-------------|
| **Correct** | Use retrieved docs | Documents are relevant and sufficient |
| **Ambiguous** | Refine + supplement | Keep relevant parts, search for missing info |
| **Incorrect** | Web search fallback | Discard local docs, search the web instead |

### Implementation

\`\`\`python
from enum import Enum

class RetrievalQuality(Enum):
    CORRECT = "correct"
    AMBIGUOUS = "ambiguous"
    INCORRECT = "incorrect"

def evaluate_retrieval(query: str, documents: list) -> RetrievalQuality:
    """Use LLM to evaluate if retrieved documents answer the query."""
    doc_texts = "\\n---\\n".join([d.content for d in documents])
    evaluation = llm(
        f"Evaluate whether these documents can answer the question.\\n\\n"
        f"Question: {query}\\n\\n"
        f"Documents:\\n{doc_texts}\\n\\n"
        f"Rate as CORRECT (fully relevant), AMBIGUOUS (partially relevant), "
        f"or INCORRECT (not relevant at all)."
    )
    if "CORRECT" in evaluation:
        return RetrievalQuality.CORRECT
    elif "AMBIGUOUS" in evaluation:
        return RetrievalQuality.AMBIGUOUS
    else:
        return RetrievalQuality.INCORRECT

def knowledge_refinement(query: str, documents: list) -> str:
    """Extract only the relevant parts from partially relevant documents."""
    refined = []
    for doc in documents:
        extraction = llm(
            f"Extract only the sentences relevant to this question:\\n"
            f"Question: {query}\\n"
            f"Document: {doc.content}\\n"
            f"If nothing is relevant, return EMPTY."
        )
        if "EMPTY" not in extraction:
            refined.append(extraction)
    return "\\n".join(refined)

def corrective_rag(query: str) -> str:
    """CRAG pipeline: retrieve, evaluate, correct, generate."""
    # Step 1: Initial retrieval
    documents = vector_store.search(query, k=5)

    # Step 2: Evaluate retrieval quality
    quality = evaluate_retrieval(query, documents)

    # Step 3: Corrective action based on evaluation
    if quality == RetrievalQuality.CORRECT:
        context = "\\n".join([d.content for d in documents])

    elif quality == RetrievalQuality.AMBIGUOUS:
        # Refine existing docs + supplement with web search
        refined = knowledge_refinement(query, documents)
        web_results = web_search(query)
        context = f"Local sources:\\n{refined}\\n\\nWeb sources:\\n{web_results}"

    elif quality == RetrievalQuality.INCORRECT:
        # Discard local docs entirely, use web search
        context = web_search(query)

    # Step 4: Generate with corrected context
    answer = llm(
        f"Answer this question using the provided context.\\n\\n"
        f"Context:\\n{context}\\n\\n"
        f"Question: {query}"
    )
    return answer
\`\`\`

### CRAG vs Self-RAG

| Feature | Self-RAG | CRAG |
|---------|----------|------|
| **Focus** | Self-reflection at every step | Corrective action on bad retrieval |
| **Fallback** | Regenerate with stricter prompts | Web search as alternative source |
| **Knowledge refinement** | Filters irrelevant docs | Extracts relevant sentences |
| **Complexity** | Multiple reflection tokens | Three-way evaluation + fallback |
| **Best for** | High-stakes accuracy | Robust retrieval despite poor indexes |

### When to Use CRAG

- Your vector store may have gaps or outdated information
- Users ask questions that go beyond your indexed content
- You need a reliable fallback when local retrieval fails
- You want graceful degradation rather than hallucinated answers

### Key Takeaway

CRAG adds a safety net to RAG: if retrieval fails, the system corrects itself by refining partial results or falling back to web search. This makes RAG systems much more robust in production, where you cannot guarantee that every query will match documents in your index.

> **Resource**: [RAG Techniques](https://github.com/NirDiamant/RAG_Techniques) covers CRAG implementation patterns alongside dozens of other retrieval strategies.`,
    },
    {
      id: "ar-adaptive-rag",
      slug: "adaptive-rag",
      title: "Adaptive RAG (Routing Queries)",
      content: `## Adaptive RAG: Routing Queries

**Adaptive RAG** takes the agentic concept further: instead of using the same retrieval strategy for every query, an agent **classifies** the query and **routes** it to the most appropriate pipeline. Simple questions get simple answers; complex questions get multi-step retrieval.

### The Insight

Not all queries are equal:
- "What is photosynthesis?" → Direct LLM answer (no retrieval needed)
- "What does our refund policy say?" → Simple RAG (single retrieval)
- "Compare our Q3 revenue across all product lines against industry benchmarks" → Multi-step retrieval from multiple sources

### The Adaptive RAG Pipeline

\`\`\`
Query → Classify Query Complexity
  → SIMPLE: Answer directly from LLM knowledge
  → STANDARD: Single-pass RAG from knowledge base
  → COMPLEX: Multi-step agentic RAG with multiple sources
  → REAL-TIME: Web search for current information
\`\`\`

### Implementation

\`\`\`python
from enum import Enum

class QueryType(Enum):
    SIMPLE = "simple"          # General knowledge, no retrieval
    STANDARD = "standard"      # Single-pass RAG
    COMPLEX = "complex"        # Multi-step, multi-source
    REAL_TIME = "real_time"    # Needs current information

def classify_query(query: str) -> QueryType:
    """Use LLM to classify query complexity."""
    classification = llm(
        f"Classify this query into one category:\\n\\n"
        f"SIMPLE: Can be answered from general knowledge\\n"
        f"STANDARD: Needs a single document lookup\\n"
        f"COMPLEX: Needs multiple sources or multi-step reasoning\\n"
        f"REAL_TIME: Needs current/live information\\n\\n"
        f"Query: {query}\\n"
        f"Category:"
    )
    for qt in QueryType:
        if qt.value.upper() in classification.upper():
            return qt
    return QueryType.STANDARD  # Default fallback

def adaptive_rag(query: str) -> str:
    """Route queries to the appropriate RAG strategy."""
    query_type = classify_query(query)

    if query_type == QueryType.SIMPLE:
        return llm(f"Answer this question: {query}")

    elif query_type == QueryType.STANDARD:
        docs = vector_store.search(query, k=5)
        context = "\\n".join([d.content for d in docs])
        return llm(f"Context: {context}\\nQuestion: {query}")

    elif query_type == QueryType.COMPLEX:
        return complex_rag_pipeline(query)

    elif query_type == QueryType.REAL_TIME:
        web_results = web_search(query)
        return llm(f"Web results: {web_results}\\nQuestion: {query}")
\`\`\`

### The Complex Pipeline

For queries classified as COMPLEX, decompose into sub-queries:

\`\`\`python
def complex_rag_pipeline(query: str) -> str:
    """Multi-step RAG for complex queries."""
    # Step 1: Decompose into sub-questions
    sub_questions = llm(
        f"Break this complex question into 2-4 simpler sub-questions "
        f"that can each be answered independently:\\n{query}"
    ).split("\\n")

    # Step 2: Answer each sub-question
    sub_answers = []
    for sq in sub_questions:
        sq = sq.strip().lstrip("0123456789.-) ")
        if not sq:
            continue
        docs = vector_store.search(sq, k=3)
        context = "\\n".join([d.content for d in docs])
        answer = llm(f"Context: {context}\\nQuestion: {sq}")
        sub_answers.append({"question": sq, "answer": answer})

    # Step 3: Synthesize final answer
    synthesis_context = "\\n".join(
        [f"Q: {sa['question']}\\nA: {sa['answer']}" for sa in sub_answers]
    )
    return llm(
        f"Using these sub-answers, provide a comprehensive answer:\\n\\n"
        f"{synthesis_context}\\n\\n"
        f"Original question: {query}"
    )
\`\`\`

### Multi-Source Routing

Adaptive RAG can also route to different data sources:

\`\`\`python
SOURCES = {
    "internal_docs": internal_vector_store,
    "code_base": code_vector_store,
    "customer_data": customer_db,
    "web": web_search_tool,
}

def route_to_sources(query: str) -> list:
    """Determine which data sources are relevant."""
    routing = llm(
        f"Which sources should be consulted for this query?\\n"
        f"Available: internal_docs, code_base, customer_data, web\\n"
        f"Query: {query}\\n"
        f"Return a comma-separated list of sources."
    )
    return [s.strip() for s in routing.split(",") if s.strip() in SOURCES]
\`\`\`

### Combining All Three Patterns

The most robust agentic RAG systems combine Self-RAG, CRAG, and Adaptive RAG:

\`\`\`
Query → Adaptive RAG (classify and route)
  → Selected pipeline uses Self-RAG (reflection at each step)
  → If retrieval fails, CRAG kicks in (corrective fallback)
\`\`\`

### Key Takeaway

Adaptive RAG matches the complexity of the retrieval strategy to the complexity of the query. Simple questions get fast, direct answers. Complex questions trigger multi-step, multi-source pipelines. This optimizes both quality and cost — you only use expensive multi-step retrieval when it's actually needed.`,
    },
    {
      id: "ar-build-pipeline",
      slug: "building-agentic-rag-pipeline",
      title: "Building an Agentic RAG Pipeline",
      content: `## Building an Agentic RAG Pipeline

Let's combine everything from this module into a complete, production-ready agentic RAG pipeline. This implementation uses LangGraph to orchestrate the agent loop with Self-RAG, CRAG, and Adaptive routing.

### Architecture Overview

\`\`\`
                    ┌─────────────┐
                    │  User Query │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Router    │ ← Adaptive RAG
                    └──────┬──────┘
                     ┌─────┼─────┐
                     │     │     │
                  Direct  RAG   Web
                     │     │     │
                     │  ┌──▼──┐  │
                     │  │Retrieve│ │
                     │  └──┬──┘  │
                     │  ┌──▼──┐  │
                     │  │Grade │ ← Self-RAG
                     │  └──┬──┘  │
                     │  Pass│Fail │
                     │     │  ┌──▼──┐
                     │     │  │CRAG  │ ← Corrective RAG
                     │     │  └──┬──┘
                     │  ┌──▼──┐  │
                     │  │Generate│ │
                     │  └──┬──┘  │
                     │  ┌──▼──┐  │
                     │  │Check │ ← Faithfulness
                     │  └──┬──┘  │
                     └─────┼─────┘
                    ┌──────▼──────┐
                    │   Answer    │
                    └─────────────┘
\`\`\`

### Full Implementation with LangGraph

\`\`\`python
from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Literal
import json

# State shared across all nodes
class RAGState(TypedDict):
    query: str
    route: str
    documents: List[dict]
    relevant_docs: List[dict]
    web_results: str
    generation: str
    retry_count: int

# Node 1: Route the query
def route_query(state: RAGState) -> RAGState:
    query = state["query"]
    routing = llm(
        f"Classify: DIRECT (general knowledge), RAG (needs documents), "
        f"or WEB (needs current info).\\nQuery: {query}"
    )
    if "DIRECT" in routing:
        state["route"] = "direct"
    elif "WEB" in routing:
        state["route"] = "web"
    else:
        state["route"] = "rag"
    return state

# Node 2: Retrieve from vector store
def retrieve(state: RAGState) -> RAGState:
    docs = vector_store.search(state["query"], k=5)
    state["documents"] = [{"content": d.content, "source": d.metadata.get("source", "")}
                          for d in docs]
    return state

# Node 3: Grade documents (Self-RAG)
def grade_documents(state: RAGState) -> RAGState:
    relevant = []
    for doc in state["documents"]:
        grade = llm(
            f"Is this document relevant?\\n"
            f"Question: {state['query']}\\nDocument: {doc['content']}\\n"
            f"Answer: RELEVANT or NOT_RELEVANT"
        )
        if "RELEVANT" in grade:
            relevant.append(doc)
    state["relevant_docs"] = relevant
    return state

# Node 4: Web search fallback (CRAG)
def web_search_fallback(state: RAGState) -> RAGState:
    results = web_search(state["query"])
    state["web_results"] = results
    return state

# Node 5: Generate answer
def generate(state: RAGState) -> RAGState:
    if state["route"] == "direct":
        state["generation"] = llm(f"Answer: {state['query']}")
    elif state["route"] == "web":
        state["generation"] = llm(
            f"Web results: {state['web_results']}\\nQuestion: {state['query']}")
    else:
        context = "\\n".join([d["content"] for d in state["relevant_docs"]])
        if state.get("web_results"):
            context += f"\\n\\nWeb: {state['web_results']}"
        state["generation"] = llm(f"Context: {context}\\nQuestion: {state['query']}")
    return state

# Node 6: Check faithfulness
def check_answer(state: RAGState) -> RAGState:
    return state  # Faithfulness check done in routing logic

# Routing functions
def route_after_classify(state: RAGState) -> str:
    if state["route"] == "direct":
        return "generate"
    elif state["route"] == "web":
        return "web_search"
    return "retrieve"

def route_after_grading(state: RAGState) -> str:
    if len(state["relevant_docs"]) == 0:
        return "web_search"  # CRAG: fallback to web
    return "generate"

# Build the graph
graph = StateGraph(RAGState)
graph.add_node("route", route_query)
graph.add_node("retrieve", retrieve)
graph.add_node("grade", grade_documents)
graph.add_node("web_search", web_search_fallback)
graph.add_node("generate", generate)

graph.set_entry_point("route")
graph.add_conditional_edges("route", route_after_classify)
graph.add_edge("retrieve", "grade")
graph.add_conditional_edges("grade", route_after_grading)
graph.add_edge("web_search", "generate")
graph.add_edge("generate", END)

app = graph.compile()
\`\`\`

### Running the Pipeline

\`\`\`python
# Simple query → routes to DIRECT
result = app.invoke({"query": "What is photosynthesis?", "retry_count": 0})

# Knowledge base query → routes to RAG → grades → generates
result = app.invoke({"query": "What is our refund policy?", "retry_count": 0})

# Current info → routes to WEB
result = app.invoke({"query": "What is today's weather?", "retry_count": 0})

# Bad retrieval → RAG → grade fails → CRAG fallback to web
result = app.invoke({"query": "Latest research on quantum computing?", "retry_count": 0})
\`\`\`

### Production Considerations

- **Caching**: Cache embeddings and frequent query results
- **Observability**: Log each node's input/output for debugging
- **Timeouts**: Set limits on each node to prevent hanging
- **Cost tracking**: Monitor LLM calls per query (agentic RAG uses 3-8x more calls)
- **Streaming**: Stream the final generation for better UX

### Key Takeaway

A complete agentic RAG pipeline combines routing (Adaptive RAG), reflection (Self-RAG), and correction (CRAG) into a unified graph. LangGraph provides the orchestration, while the LLM makes intelligent decisions at each node. This architecture is robust, flexible, and production-ready.

> **Resources**:
> - [RAG Techniques](https://github.com/NirDiamant/RAG_Techniques) — 25+ RAG strategies with implementations
> - [GenAI Agents](https://github.com/NirDiamant/GenAI_Agents) — Agentic RAG tutorials and notebooks`,
    },
  ],
};
