import { Module } from "../types";

export const advancedArchitecturesModule: Module = {
  id: "rag-advanced",
  title: "Advanced Architectures",
  description: "Explore cutting-edge RAG architectures — Graph RAG with knowledge graphs, RAPTOR recursive summarization, Self-RAG, Corrective RAG, and Agentic RAG.",
  lessons: [
    {
      id: "aa-graph-rag",
      slug: "graph-rag",
      title: "Graph RAG (Knowledge Graphs + Retrieval)",
      content: `## Graph RAG: Knowledge Graphs + Retrieval

**Graph RAG** combines vector-based retrieval with knowledge graph traversal. While standard RAG finds documents by semantic similarity, Graph RAG also discovers related information through explicit relationships between entities.

### The Limitation of Vector-Only RAG

Vector search finds documents similar to the query, but misses **relational** information:

\`\`\`
Query: "Who are the investors in companies led by former Google engineers?"

Vector search finds:
- Docs about Google engineers
- Docs about startup investors

But MISSES: The connections between specific people, companies, and investors
that aren't stated in any single document.
\`\`\`

### How Graph RAG Works

\`\`\`
Documents → Extract Entities & Relations → Build Knowledge Graph
                                                   ↓
Query → Vector Search → Retrieved Docs ──────┐
Query → Graph Traversal → Related Entities ──┤→ Combined Context → LLM
                                              └→ Answer
\`\`\`

### Building the Knowledge Graph

\`\`\`python
def extract_entities_and_relations(text: str) -> dict:
    """Use LLM to extract entities and relationships from text."""
    response = llm(
        f"Extract entities and relationships from this text.\\n\\n"
        f"Text: {text}\\n\\n"
        f"Return as JSON:\\n"
        f'{{"entities": [{{"name": "...", "type": "..."}}], '
        f'"relations": [{{"source": "...", "relation": "...", "target": "..."}}]}}'
    )
    return json.loads(response)

# Example output:
# {
#   "entities": [
#     {"name": "Acme Corp", "type": "company"},
#     {"name": "Jane Smith", "type": "person"},
#     {"name": "Sequoia Capital", "type": "investor"}
#   ],
#   "relations": [
#     {"source": "Jane Smith", "relation": "CEO_OF", "target": "Acme Corp"},
#     {"source": "Jane Smith", "relation": "WORKED_AT", "target": "Google"},
#     {"source": "Sequoia Capital", "relation": "INVESTED_IN", "target": "Acme Corp"}
#   ]
# }
\`\`\`

### Graph Traversal + Vector Search

\`\`\`python
import networkx as nx

class GraphRAG:
    def __init__(self, vector_collection):
        self.graph = nx.DiGraph()
        self.collection = vector_collection
        self.entity_docs = {}  # entity → list of doc_ids

    def add_knowledge(self, doc_id: str, text: str):
        # Extract and add to graph
        knowledge = extract_entities_and_relations(text)

        for entity in knowledge["entities"]:
            self.graph.add_node(entity["name"], type=entity["type"])
            self.entity_docs.setdefault(entity["name"], []).append(doc_id)

        for rel in knowledge["relations"]:
            self.graph.add_edge(
                rel["source"], rel["target"],
                relation=rel["relation"]
            )

        # Also index in vector store
        self.collection.add(documents=[text], ids=[doc_id])

    def search(self, query: str, n_results: int = 5) -> dict:
        # Vector search
        vector_results = self.collection.query(
            query_texts=[query], n_results=n_results
        )

        # Extract entities from query
        query_entities = extract_entities_and_relations(query)["entities"]

        # Graph traversal — find related entities
        related = set()
        for entity in query_entities:
            if entity["name"] in self.graph:
                # Get neighbors within 2 hops
                for neighbor in nx.single_source_shortest_path_length(
                    self.graph, entity["name"], cutoff=2
                ):
                    related.add(neighbor)

        # Get documents about related entities
        graph_docs = set()
        for entity_name in related:
            graph_docs.update(self.entity_docs.get(entity_name, []))

        return {
            "vector_results": vector_results["documents"][0],
            "graph_entities": list(related),
            "graph_documents": list(graph_docs)
        }
\`\`\`

### Microsoft's GraphRAG

Microsoft's GraphRAG implementation takes a community-detection approach:

1. Extract entities and relations from all documents
2. Build a global knowledge graph
3. Detect communities (clusters) of related entities
4. Generate summaries for each community
5. At query time, search community summaries for relevant clusters

This excels at **global questions** that span the entire corpus ("What are the main themes?").

### When to Use Graph RAG

| Query Type | Standard RAG | Graph RAG |
|-----------|:------------:|:---------:|
| Factual lookup | Good | Good |
| Multi-hop reasoning | Poor | Good |
| Entity relationships | Poor | Excellent |
| Global summarization | Poor | Excellent |
| Simple Q&A | Sufficient | Overkill |

### Key Takeaway

Graph RAG adds a relational dimension to retrieval. When your questions involve relationships between entities or require connecting information across multiple documents, Graph RAG dramatically outperforms standard vector search. The tradeoff is complexity — building and maintaining a knowledge graph requires significant engineering effort.

> **Resource**: [RAG Techniques — Graph RAG](https://github.com/NirDiamant/RAG_Techniques) covers both simple graph-enhanced RAG and Microsoft's community-based GraphRAG approach.`,
    },
    {
      id: "aa-raptor",
      slug: "raptor",
      title: "RAPTOR (Recursive Summarization)",
      content: `## RAPTOR: Recursive Abstractive Processing for Tree-Organized Retrieval

**RAPTOR** builds a tree of summaries from your documents. Leaf nodes are original chunks, internal nodes are summaries of clusters, and the root is a summary of summaries. This enables retrieval at any level of abstraction.

### The Insight

Different questions need different levels of detail:
- "What is the refund policy?" → Needs specific leaf-level detail
- "What are the main topics in this manual?" → Needs high-level summaries
- "Compare security and performance sections" → Needs mid-level summaries

### How RAPTOR Works

\`\`\`
Step 1: Chunk documents into leaf nodes
Step 2: Embed all leaves
Step 3: Cluster similar leaves together
Step 4: Summarize each cluster → create parent nodes
Step 5: Repeat Steps 2-4 on parent nodes
Step 6: Continue until a single root summary remains

Result: A tree where you can search at any level

        [Root Summary]
       /              \\
  [Summary A]      [Summary B]
   /    \\           /     \\
[Leaf1][Leaf2]  [Leaf3]  [Leaf4]
\`\`\`

### Implementation

\`\`\`python
from sklearn.cluster import KMeans
import numpy as np

class RAPTOR:
    def __init__(self, collection):
        self.collection = collection
        self.tree = {}  # level → list of nodes

    def build_tree(self, documents: list, max_levels: int = 3):
        """Build the RAPTOR tree from documents."""
        # Level 0: Leaf nodes (original chunks)
        leaves = []
        for doc in documents:
            chunks = chunk_text(doc, chunk_size=300)
            for chunk in chunks:
                leaves.append({
                    "content": chunk,
                    "embedding": embed(chunk),
                    "level": 0
                })
        self.tree[0] = leaves

        # Build upper levels
        current_nodes = leaves
        for level in range(1, max_levels + 1):
            if len(current_nodes) <= 1:
                break

            # Cluster similar nodes
            embeddings = np.array([n["embedding"] for n in current_nodes])
            n_clusters = max(1, len(current_nodes) // 5)
            kmeans = KMeans(n_clusters=n_clusters, random_state=42)
            labels = kmeans.fit_predict(embeddings)

            # Summarize each cluster
            parent_nodes = []
            for cluster_id in range(n_clusters):
                cluster_texts = [
                    current_nodes[i]["content"]
                    for i in range(len(current_nodes))
                    if labels[i] == cluster_id
                ]
                summary = llm(
                    f"Summarize these related passages into a coherent "
                    f"overview (2-3 sentences):\\n\\n"
                    + "\\n---\\n".join(cluster_texts)
                )
                parent_nodes.append({
                    "content": summary.strip(),
                    "embedding": embed(summary.strip()),
                    "level": level,
                    "children": [i for i in range(len(current_nodes))
                                if labels[i] == cluster_id]
                })

            self.tree[level] = parent_nodes
            current_nodes = parent_nodes

        # Index all nodes in vector store
        self._index_all()

    def _index_all(self):
        """Index all tree nodes for retrieval."""
        all_docs = []
        all_ids = []
        all_metas = []

        for level, nodes in self.tree.items():
            for i, node in enumerate(nodes):
                all_docs.append(node["content"])
                all_ids.append(f"level{level}_node{i}")
                all_metas.append({"level": level})

        self.collection.add(
            documents=all_docs,
            ids=all_ids,
            metadatas=all_metas
        )

    def search(self, query: str, n_results: int = 5) -> list:
        """Search across all tree levels."""
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results,
            include=["documents", "metadatas"]
        )
        return list(zip(results["documents"][0], results["metadatas"][0]))
\`\`\`

### RAPTOR vs Standard RAG

| Feature | Standard RAG | RAPTOR |
|---------|:------------:|:------:|
| Index structure | Flat | Tree |
| Abstraction levels | One (chunks) | Multiple |
| Global questions | Poor | Excellent |
| Specific questions | Good | Good |
| Build cost | Low | High (summarization) |
| Index size | 1x | 1.5-2x |

### Key Takeaway

RAPTOR creates a multi-level abstraction hierarchy over your documents. It excels when users ask questions at different levels of specificity — from broad overviews to specific details. The cost is higher indexing time (LLM summarization), but query-time performance is similar to standard RAG with better quality for abstract questions.`,
    },
    {
      id: "aa-self-rag",
      slug: "self-rag-architecture",
      title: "Self-RAG (Self-Reflective Generation)",
      content: `## Self-RAG: Self-Reflective Generation

**Self-RAG** adds reflection checkpoints throughout the RAG pipeline. The model evaluates its own retrieval and generation quality, deciding when to retrieve, filtering irrelevant documents, and verifying that answers are grounded in evidence.

### The Self-RAG Decision Points

\`\`\`
Query → [Need retrieval?] → Yes/No
                │
         If Yes → Retrieve → [Documents relevant?] → Filter
                                     │
                              Generate → [Answer supported?] → Verify
                                              │
                                       [Answer useful?] → Final check
\`\`\`

### Four Reflection Tokens

| Token | Question | Options |
|-------|----------|---------|
| **Retrieve** | Do I need external information? | Yes / No |
| **IsRelevant** | Is this document relevant to the query? | Relevant / Not Relevant |
| **IsSupported** | Is my answer supported by the documents? | Fully / Partially / Not Supported |
| **IsUseful** | Is my final answer helpful? | Useful / Not Useful |

### Complete Implementation

\`\`\`python
class SelfRAG:
    def __init__(self, collection):
        self.collection = collection

    def query(self, question: str) -> dict:
        """Self-reflective RAG pipeline."""

        # Decision 1: Do we need retrieval?
        need_retrieval = self._check_retrieval_need(question)

        if not need_retrieval:
            answer = llm(f"Answer this question: {question}")
            return {"answer": answer, "sources": [], "retrieval": False}

        # Retrieve documents
        results = self.collection.query(
            query_texts=[question], n_results=7
        )

        # Decision 2: Grade each document for relevance
        relevant_docs = []
        for doc in results["documents"][0]:
            if self._is_relevant(question, doc):
                relevant_docs.append(doc)

        if not relevant_docs:
            # No relevant docs — try web search or answer directly
            answer = llm(
                f"I couldn't find specific documents to answer this. "
                f"Based on general knowledge: {question}"
            )
            return {"answer": answer, "sources": [], "retrieval": True,
                    "note": "No relevant documents found"}

        # Generate answer
        context = "\\n\\n".join(relevant_docs)
        answer = llm(
            f"Answer based on the context:\\n{context}\\n\\n"
            f"Question: {question}"
        )

        # Decision 3: Is the answer supported?
        support_level = self._check_support(answer, context)

        if support_level == "NOT_SUPPORTED":
            # Regenerate with stricter grounding
            answer = llm(
                f"Answer ONLY using facts from the context. "
                f"If the context doesn't have the answer, say so.\\n\\n"
                f"Context: {context}\\nQuestion: {question}"
            )
            support_level = self._check_support(answer, context)

        # Decision 4: Is the answer useful?
        usefulness = self._check_usefulness(question, answer)

        return {
            "answer": answer,
            "sources": relevant_docs,
            "support_level": support_level,
            "usefulness": usefulness,
            "docs_retrieved": len(results["documents"][0]),
            "docs_relevant": len(relevant_docs)
        }

    def _check_retrieval_need(self, question: str) -> bool:
        response = llm(
            f"Does this question require looking up specific information, "
            f"or can it be answered from general knowledge?\\n"
            f"Question: {question}\\n"
            f"Answer RETRIEVE or DIRECT.",
            model="claude-haiku-4-20250414"
        )
        return "RETRIEVE" in response

    def _is_relevant(self, question: str, document: str) -> bool:
        response = llm(
            f"Is this document relevant to answering the question?\\n"
            f"Question: {question}\\n"
            f"Document: {document[:500]}\\n"
            f"Answer RELEVANT or NOT_RELEVANT.",
            model="claude-haiku-4-20250414"
        )
        return "RELEVANT" in response and "NOT_RELEVANT" not in response

    def _check_support(self, answer: str, context: str) -> str:
        response = llm(
            f"Is every claim in the answer supported by the context?\\n"
            f"Context: {context[:1000]}\\n"
            f"Answer: {answer}\\n"
            f"Rate: FULLY_SUPPORTED, PARTIALLY_SUPPORTED, or NOT_SUPPORTED.",
            model="claude-haiku-4-20250414"
        )
        for level in ["FULLY_SUPPORTED", "PARTIALLY_SUPPORTED", "NOT_SUPPORTED"]:
            if level in response:
                return level
        return "PARTIALLY_SUPPORTED"

    def _check_usefulness(self, question: str, answer: str) -> str:
        response = llm(
            f"Does this answer adequately address the question?\\n"
            f"Question: {question}\\nAnswer: {answer}\\n"
            f"Rate: USEFUL or NOT_USEFUL.",
            model="claude-haiku-4-20250414"
        )
        return "USEFUL" if "USEFUL" in response and "NOT_USEFUL" not in response else "NOT_USEFUL"
\`\`\`

### Self-RAG Trade-offs

| Benefit | Cost |
|---------|------|
| Higher faithfulness | 3-5x more LLM calls |
| Fewer hallucinations | Higher latency |
| Skips unnecessary retrieval | More complex implementation |
| Filters irrelevant docs | Higher cost per query |

### Key Takeaway

Self-RAG is the most reliable RAG architecture for high-stakes applications where hallucination is unacceptable. The four reflection checkpoints catch problems at every stage. Use fast/cheap models (Haiku) for reflection steps to manage cost, and measure the faithfulness improvement against the latency increase on your specific use case.`,
    },
    {
      id: "aa-crag",
      slug: "corrective-rag-architecture",
      title: "Corrective RAG (CRAG)",
      content: `## Corrective RAG (CRAG)

**Corrective RAG** evaluates retrieval quality and automatically corrects course when retrieval fails. If retrieved documents are irrelevant, CRAG falls back to web search rather than generating a hallucinated answer from poor context.

### CRAG vs Standard RAG

\`\`\`
Standard RAG: Retrieve → Generate (even if docs are irrelevant)
CRAG:         Retrieve → Evaluate → Correct if needed → Generate
\`\`\`

### The Three Outcomes

After retrieval, CRAG evaluates documents and takes one of three actions:

| Evaluation | Action | When |
|-----------|--------|------|
| **Correct** | Use retrieved docs as-is | Documents are relevant and sufficient |
| **Ambiguous** | Refine docs + supplement with web | Documents are partially relevant |
| **Incorrect** | Discard docs, use web search | Documents are irrelevant |

### Implementation

\`\`\`python
class CorrectiveRAG:
    def __init__(self, collection, web_search_fn):
        self.collection = collection
        self.web_search = web_search_fn

    def query(self, question: str) -> dict:
        # Step 1: Retrieve
        results = self.collection.query(
            query_texts=[question], n_results=5
        )
        documents = results["documents"][0]

        # Step 2: Evaluate retrieval quality
        quality = self._evaluate_quality(question, documents)

        # Step 3: Corrective action
        if quality == "CORRECT":
            context = "\\n\\n".join(documents)
            source = "knowledge_base"

        elif quality == "AMBIGUOUS":
            # Refine: extract relevant parts + supplement
            refined = self._refine_documents(question, documents)
            web_context = self.web_search(question)
            context = f"Knowledge base:\\n{refined}\\n\\nWeb sources:\\n{web_context}"
            source = "hybrid"

        else:  # INCORRECT
            context = self.web_search(question)
            source = "web_search"

        # Step 4: Generate answer
        answer = llm(
            f"Answer the question using the provided context.\\n\\n"
            f"Context:\\n{context}\\n\\n"
            f"Question: {question}"
        )

        return {
            "answer": answer,
            "quality": quality,
            "source": source
        }

    def _evaluate_quality(self, question: str, documents: list) -> str:
        """Evaluate if retrieved documents can answer the question."""
        doc_text = "\\n---\\n".join(documents)
        evaluation = llm(
            f"Can these documents answer the question?\\n\\n"
            f"Question: {question}\\n\\n"
            f"Documents:\\n{doc_text}\\n\\n"
            f"Rate as CORRECT (fully relevant), AMBIGUOUS (partially), "
            f"or INCORRECT (not relevant).",
            model="claude-haiku-4-20250414"
        )
        for q in ["CORRECT", "AMBIGUOUS", "INCORRECT"]:
            if q in evaluation:
                return q
        return "AMBIGUOUS"

    def _refine_documents(self, question: str, documents: list) -> str:
        """Extract only relevant portions from ambiguous documents."""
        refined_parts = []
        for doc in documents:
            extraction = llm(
                f"Extract sentences relevant to the question.\\n"
                f"Question: {question}\\nDocument: {doc}\\n"
                f"Relevant sentences (or NONE):",
                model="claude-haiku-4-20250414"
            )
            if "NONE" not in extraction:
                refined_parts.append(extraction.strip())
        return "\\n".join(refined_parts) if refined_parts else ""
\`\`\`

### CRAG with LangGraph

\`\`\`python
from langgraph.graph import StateGraph, END

def build_crag_graph():
    graph = StateGraph(dict)

    graph.add_node("retrieve", retrieve_node)
    graph.add_node("evaluate", evaluate_node)
    graph.add_node("refine", refine_node)
    graph.add_node("web_search", web_search_node)
    graph.add_node("generate", generate_node)

    graph.set_entry_point("retrieve")
    graph.add_edge("retrieve", "evaluate")
    graph.add_conditional_edges("evaluate", route_by_quality, {
        "correct": "generate",
        "ambiguous": "refine",
        "incorrect": "web_search"
    })
    graph.add_edge("refine", "generate")
    graph.add_edge("web_search", "generate")
    graph.add_edge("generate", END)

    return graph.compile()
\`\`\`

### When CRAG Saves You

Without CRAG:
\`\`\`
Query: "What is our new product announced last week?"
Retrieved: Old product docs from 2023 (knowledge base is outdated)
Generated: "Our latest product is X" (WRONG — uses outdated info)
\`\`\`

With CRAG:
\`\`\`
Query: "What is our new product announced last week?"
Retrieved: Old product docs from 2023
Evaluated: INCORRECT — docs don't mention recent announcements
Corrected: Web search → finds recent press release
Generated: "Last week, we announced Y" (CORRECT)
\`\`\`

### Key Takeaway

CRAG is your safety net against bad retrieval. By evaluating retrieval quality before generation, it prevents the most common RAG failure mode: confidently generating answers from irrelevant context. The web search fallback ensures users get an answer even when your knowledge base falls short. Implement CRAG whenever your knowledge base may have gaps or outdated information.`,
    },
    {
      id: "aa-agentic-rag",
      slug: "agentic-rag-architecture",
      title: "Agentic RAG",
      content: `## Agentic RAG

**Agentic RAG** puts an AI agent in full control of the RAG pipeline. Instead of a fixed retrieve-then-generate flow, the agent dynamically decides when to retrieve, what to search for, whether results are sufficient, and when to try different strategies.

### From Pipeline to Agent

\`\`\`
Standard RAG:
  Query → Retrieve → Generate → Done (fixed flow)

Agentic RAG:
  Query → Agent decides what to do next
    → Maybe retrieve from knowledge base
    → Maybe search the web
    → Maybe reformulate the query
    → Maybe ask for clarification
    → Evaluate results
    → Maybe retrieve more
    → Generate when ready
    → Verify the answer
    → Done (dynamic flow)
\`\`\`

### Implementation

\`\`\`python
class AgenticRAG:
    def __init__(self, collection, tools):
        self.collection = collection
        self.tools = tools
        self.max_iterations = 5

    def query(self, question: str) -> str:
        """Agent-driven RAG with dynamic strategy selection."""
        context = []
        strategy_log = []

        for iteration in range(self.max_iterations):
            # Agent decides next action
            action = self._decide_action(question, context, strategy_log)
            strategy_log.append(action)

            if action["type"] == "retrieve":
                docs = self.collection.query(
                    query_texts=[action["query"]],
                    n_results=action.get("k", 5)
                )["documents"][0]
                context.extend(docs)

            elif action["type"] == "web_search":
                results = self.tools["web_search"](action["query"])
                context.append(results)

            elif action["type"] == "reformulate":
                # Agent tries a different query
                continue

            elif action["type"] == "generate":
                # Agent is ready to answer
                answer = llm(
                    f"Context:\\n{'\\n'.join(context)}\\n\\n"
                    f"Question: {question}"
                )
                # Verify before returning
                if self._verify_answer(question, answer, context):
                    return answer
                else:
                    strategy_log.append({"type": "failed_verification"})
                    continue

            elif action["type"] == "answer_directly":
                return llm(f"Answer this question: {question}")

        return "Unable to find a satisfactory answer after multiple attempts."

    def _decide_action(self, question, context, history) -> dict:
        """Agent decides the next action based on current state."""
        context_summary = f"{len(context)} documents collected" if context else "No context yet"
        history_text = "\\n".join([str(h) for h in history]) if history else "None"

        response = llm(
            f"You are a RAG agent. Decide your next action.\\n\\n"
            f"Question: {question}\\n"
            f"Context so far: {context_summary}\\n"
            f"Actions taken: {history_text}\\n\\n"
            f"Choose one action (respond with JSON):\\n"
            f'- {{"type": "retrieve", "query": "...", "k": 5}} — search knowledge base\\n'
            f'- {{"type": "web_search", "query": "..."}} — search the web\\n'
            f'- {{"type": "reformulate", "query": "..."}} — try different search terms\\n'
            f'- {{"type": "generate"}} — ready to answer from context\\n'
            f'- {{"type": "answer_directly"}} — answer without retrieval'
        )
        return json.loads(response)
\`\`\`

### Agentic RAG Capabilities

| Capability | Description |
|-----------|-------------|
| **Adaptive retrieval** | Only retrieves when needed |
| **Query reformulation** | Tries different search terms on failure |
| **Source selection** | Chooses between KB, web, SQL, etc. |
| **Iterative refinement** | Retrieves more if context is insufficient |
| **Multi-hop reasoning** | Chains retrievals for complex questions |
| **Self-verification** | Checks answer quality before returning |

### Combining All Advanced RAG Patterns

The ultimate RAG architecture combines everything:

\`\`\`
Query → Adaptive Routing (route to best source)
  → Agentic control (agent decides strategy)
    → Fusion retrieval (BM25 + dense)
      → Reranking (cross-encoder)
        → Self-RAG (reflection on relevance)
          → CRAG (corrective fallback)
            → Contextual compression
              → Generate with verified context
\`\`\`

### When to Go Agentic

| Use Case | Standard RAG | Agentic RAG |
|----------|:------------:|:-----------:|
| Simple Q&A | Sufficient | Overkill |
| Complex research | Insufficient | Ideal |
| Multi-source queries | Difficult | Natural |
| Evolving conversations | Rigid | Adaptive |
| High-stakes answers | Risky | Self-verifying |

### Key Takeaway

Agentic RAG represents the frontier of retrieval-augmented generation. By giving an agent control of the entire pipeline, you get adaptive, self-correcting retrieval that handles complex queries gracefully. Start with simpler patterns (fusion, reranking, CRAG) and add agentic control when your use case demands dynamic strategy selection.

> **Resources**:
> - [RAG Techniques](https://github.com/NirDiamant/RAG_Techniques) — 25+ RAG strategies from basic to advanced
> - [GenAI Agents](https://github.com/NirDiamant/GenAI_Agents) — Agentic RAG implementations`,
    },
  ],
};
