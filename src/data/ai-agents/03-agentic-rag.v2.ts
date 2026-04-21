import { Module } from "../types";

export const agenticRagModule: Module = {
  id: "agent-rag",
  title: "Agentic RAG",
  description: "Go beyond basic RAG with self-reflective, corrective, and adaptive retrieval strategies that give agents intelligent control over their knowledge retrieval.",
  lessons: [
    {
      id: "ar-what-is-agentic-rag",
      slug: "what-is-agentic-rag",
      title: "What is Agentic RAG?",
      content: `## What is Agentic RAG?

Standard RAG (Retrieval-Augmented Generation) follows a simple pipeline: embed the query, retrieve documents, generate an answer. **Agentic RAG** puts an LLM agent in control of that entire pipeline — deciding *when* to retrieve, *what* to retrieve, whether the retrieved documents are good enough, and *when* to try a completely different strategy.

\`\`\`concept
{ "title": "Agentic RAG in One Sentence", "variant": "mental-model", "content": "Traditional RAG is a conveyor belt — input goes in one end, answer comes out the other. Agentic RAG is a knowledge worker — it reads the task, decides what to look up, judges whether it found the right things, and keeps trying until it's confident in the answer." }
\`\`\`

---

### The Problem with Basic RAG

Basic RAG has a fixed, linear pipeline that cannot recover from its own mistakes:

\`\`\`mermaid
flowchart LR
    Q[Query] --> E[Embed] --> R[Retrieve Top-K] --> G[Generate Answer]
    style Q fill:#6366f1,color:#fff
    style G fill:#6366f1,color:#fff
\`\`\`

This works well for simple factual questions but breaks down in real-world scenarios:

- The initial query is vague or ambiguous
- Retrieved documents are irrelevant or off-topic
- The answer requires synthesising information across multiple sources
- The question needs multi-step reasoning, not just a single lookup

\`\`\`callout
{ "type": "warning", "title": "The Silent Failure Problem", "content": "Basic RAG never knows it failed. It will confidently generate an answer even when the retrieved documents are completely unrelated to the question. There is no feedback loop, no quality check, and no retry mechanism." }
\`\`\`

---

### How Agentic RAG Differs

Agentic RAG wraps the retrieval pipeline in an **agent loop**. The LLM becomes an active controller — not just a generator.

\`\`\`sysdiag
{ "title": "The Agentic RAG Control Loop", "width": 680, "height": 400, "nodes": [ { "id": "query", "label": "User Query", "x": 80, "y": 200, "kind": "client" }, { "id": "agent", "label": "Agent Controller", "x": 280, "y": 200, "kind": "service" }, { "id": "retrieve", "label": "Vector Store", "x": 480, "y": 120, "kind": "database" }, { "id": "web", "label": "Web Search", "x": 480, "y": 280, "kind": "external" }, { "id": "answer", "label": "Final Answer", "x": 620, "y": 200, "kind": "client" } ], "edges": [ { "from": "query", "to": "agent", "label": "sends" }, { "from": "agent", "to": "retrieve", "label": "retrieves (if needed)" }, { "from": "agent", "to": "web", "label": "escalates (if needed)" }, { "from": "retrieve", "to": "agent", "label": "docs + relevance eval" }, { "from": "web", "to": "agent", "label": "results + relevance eval" }, { "from": "agent", "to": "answer", "label": "validated response" } ], "annotations": { "agent": "Makes all decisions: whether to retrieve, which source to use, whether results are good enough, when to retry, and when to stop.", "retrieve": "Primary knowledge source — embedded documents from your corpus.", "web": "Fallback for questions outside the knowledge base or requiring fresh data." } }
\`\`\`

The agent evaluates each step before proceeding — reformulating queries when retrieval fails, switching sources when needed, and verifying the final answer before returning it.

---

### The Four Pillars of Agentic RAG

\`\`\`tabs
{ "tabs": [ { "label": "Routing", "icon": "🔀", "content": "**What it does:** The agent decides upfront whether to use retrieval, web search, direct generation, or some combination.\\n\\n**Example:** A question like *\\"What is 2+2?\\"* doesn't need retrieval — the agent answers directly. *\\"Summarise the Q3 earnings report\\"* routes to your internal vector store. *\\"What happened in the news today?\\"* routes to web search.\\n\\n**Why it matters:** Routing avoids unnecessary retrieval calls (saving latency and cost) and prevents irrelevant documents from polluting the context." }, { "label": "Self-Reflection", "icon": "🪞", "content": "**What it does:** After retrieval, the agent critically evaluates whether the returned documents are actually relevant to the query.\\n\\n**Self-RAG** formalized this with *reflection tokens* — the model learns to emit special tokens like \`[Retrieve]\`, \`[IsRel]\`, and \`[IsSup]\` to decide whether to retrieve, whether docs are relevant, and whether the answer is supported. Research shows Self-RAG generates only 2% of correct predictions outside the provided passages, meaning it is tightly grounded.\\n\\n**Why it matters:** Without self-reflection, irrelevant documents get passed to the generator, producing hallucinated or misgrounded answers." }, { "label": "Correction", "icon": "🔄", "content": "**What it does:** When the agent determines that retrieved documents are insufficient or irrelevant, it reformulates the query and tries again rather than giving up.\\n\\n**Example:** Original query: *\\"ML model performance\\"* → retrieves generic articles. Agent corrects to: *\\"precision-recall trade-off in binary classification\\"* → retrieves exactly the right documents.\\n\\n**Corrective RAG (CRAG)** extends this by triggering a web search as a fallback when internal retrieval confidence drops below a threshold.\\n\\n**Why it matters:** A single fixed query rarely captures the full information need. Correction turns retrieval into an iterative search." }, { "label": "Adaptation", "icon": "🧠", "content": "**What it does:** The agent dynamically switches retrieval strategies based on query complexity — using simple lookup for factual questions, multi-hop chaining for reasoning tasks, and broader web search for open-ended research.\\n\\n**Adaptive RAG** classifies queries into complexity levels and applies the appropriate strategy — no retrieval, single-shot RAG, or iterative agent-driven RAG.\\n\\n**Why it matters:** One-size-fits-all retrieval is wasteful. Simple questions pay the cost of complex retrieval. Complex questions get the shallow treatment of simple retrieval. Adaptation matches strategy to need." } ] }
\`\`\`

---

### Basic RAG vs. Agentic RAG: Side by Side

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Basic RAG — Fixed Pipeline", "code": "def basic_rag(query: str) -> str:\\n    # Step 1: Embed and retrieve (always, no routing)\\n    docs = vector_store.search(query, k=5)\\n\\n    # Step 2: Generate (no relevance check)\\n    answer = llm(f\\"Context: {docs}\\\\nQuestion: {query}\\")\\n\\n    # Step 3: Return (no faithfulness check)\\n    return answer\\n\\n# Problems:\\n# - Retrieves even when unnecessary\\n# - Never checks if docs are relevant\\n# - Never validates the answer\\n# - Cannot recover from bad retrieval" }, "after": { "label": "Agentic RAG — Adaptive Loop", "code": "def agentic_rag(query: str) -> str:\\n    # Step 1: Agent routes the query\\n    plan = llm(f\\"Do I need retrieval for: {query}? Answer: yes/no\\")\\n    if \\"no\\" in plan.lower():\\n        return llm(f\\"Answer directly: {query}\\")\\n\\n    # Step 2: Retrieve and evaluate relevance\\n    docs = vector_store.search(query, k=5)\\n    relevance = llm(f\\"Are these docs relevant to '{query}'?\\\\n{docs}\\")\\n\\n    # Step 3: Correct if needed\\n    if \\"not relevant\\" in relevance.lower():\\n        refined = llm(f\\"Reformulate for better retrieval: {query}\\")\\n        docs = vector_store.search(refined, k=5)\\n\\n    # Step 4: Generate and validate faithfulness\\n    answer = llm(f\\"Answer using only these docs:\\\\n{docs}\\\\nQuery: {query}\\")\\n    check = llm(f\\"Is this answer supported by the docs?\\\\n{answer}\\\\n{docs}\\")\\n\\n    if \\"not supported\\" in check.lower():\\n        answer = llm(f\\"Retry, stay strictly within the docs:\\\\n{docs}\\")\\n\\n    return answer\\n\\n# Benefits:\\n# + Skips retrieval when unnecessary\\n# + Detects and corrects irrelevant results\\n# + Validates faithfulness before returning" } }
\`\`\`

---

### When to Choose Each Approach

| Scenario | Basic RAG | Agentic RAG |
|----------|-----------|-------------|
| Simple factual lookup | Works well | Overkill — adds unnecessary latency |
| Ambiguous query | Often fails silently | Agent clarifies and reformulates |
| Multi-hop reasoning | Fails — single pass only | Agent chains retrievals across steps |
| Mixed source requirements | Single corpus only | Agent routes to the best source |
| Quality-critical answers | No verification | Agent validates and retries |

\`\`\`callout
{ "type": "info", "title": "The Cost Trade-off", "content": "Agentic RAG makes multiple LLM calls per query — routing, relevance evaluation, faithfulness checking, and potentially query reformulation. For simple lookup tasks, this is wasteful. The right choice depends on your query distribution: if most queries are simple and factual, Basic RAG wins on cost and latency. If queries are complex and varied, Agentic RAG's accuracy gains justify the overhead." }
\`\`\`

---

### Seeing the Agent Loop in Action

\`\`\`trace
{ "title": "Agentic RAG — Step-by-Step Trace", "language": "python", "code": "def agentic_rag(query):\\n    plan = llm(f\\"Need retrieval for: {query}?\\")\\n    docs = vector_store.search(query, k=5)\\n    relevance = llm(f\\"Docs relevant to '{query}'?\\\\n{docs}\\")\\n    if 'not relevant' in relevance:\\n        query = llm(f\\"Reformulate: {query}\\")\\n        docs = vector_store.search(query, k=5)\\n    answer = llm(f\\"Answer from docs:\\\\n{docs}\\")\\n    check = llm(f\\"Answer supported?\\\\n{answer}\\")\\n    return answer", "frames": [ { "line": 2, "vars": { "query": "\\"explain attention mechanism in transformers\\"" }, "note": "Agent evaluates: this is a technical concept — retrieval needed.", "stdout": "" }, { "line": 3, "vars": { "query": "\\"explain attention mechanism in transformers\\"", "plan": "\\"yes, retrieval needed\\"" }, "note": "Vector store returns 5 candidate chunks from ML papers.", "stdout": "" }, { "line": 4, "vars": { "docs": "[chunk_1: 'softmax(QK^T/√d)V...', chunk_2: 'multi-head attention...', ...]" }, "note": "Agent reads docs and evaluates: are these about attention? Yes — relevant.", "stdout": "" }, { "line": 9, "vars": { "relevance": "\\"relevant\\"", "docs": "[chunk_1, chunk_2, ...]" }, "note": "No reformulation needed — proceeding to generation.", "stdout": "" }, { "line": 10, "vars": {} }, { "line": 11, "vars": { "answer": "\\"Attention computes a weighted sum of values V, where weights come from softmax(QK^T/√d_k)...\\"" }, "note": "Faithfulness check: is every claim in the answer supported by the retrieved chunks?", "stdout": "" }, { "line": 12, "vars": { "check": "\\"supported\\"" }, "note": "Answer is grounded — return to user.", "stdout": "✓ Grounded answer returned" } ], "speed": 900 }
\`\`\`

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "What is the core structural difference between Basic RAG and Agentic RAG?", "options": [ "Agentic RAG uses a larger language model", "Agentic RAG wraps retrieval in an agent loop that can evaluate, correct, and retry", "Agentic RAG retrieves more documents per query", "Agentic RAG does not use a vector store" ], "answer": 1, "explanation": "The defining characteristic of Agentic RAG is the agent loop — the LLM actively controls retrieval, evaluates results, and can reformulate queries or switch strategies. The model size and number of retrieved documents are not what distinguish it." }, { "question": "Self-RAG introduced 'reflection tokens' to help the model decide certain things. Which of the following is a reflection token decision Self-RAG makes?", "options": [ "Whether to fine-tune on new data", "Whether retrieved documents are relevant and whether the answer is supported by them", "Which vector embedding model to use", "Whether to compress the context window" ], "answer": 1, "explanation": "Self-RAG uses reflection tokens like [Retrieve], [IsRel], and [IsSup] to decide: should I retrieve? are the docs relevant? is my answer supported by the docs? Research shows Self-RAG generates only 2% of correct predictions outside the provided passages — it stays tightly grounded." }, { "question": "You are building a customer support bot that answers questions from a product manual. Most questions are simple and factual ('How do I reset my password?'). Which approach is most appropriate?", "options": [ "Agentic RAG with full routing, self-reflection, and correction", "Basic RAG — it handles simple factual questions well at lower cost and latency", "No retrieval — generate answers directly from the LLM", "Adaptive RAG that classifies each query and applies the right strategy" ], "answer": 1, "explanation": "For predominantly simple, factual queries from a stable corpus, Basic RAG is the right choice. Agentic RAG's multiple LLM calls add latency and cost without meaningful accuracy improvement for this use case. Adaptive RAG (option D) could also work, but adds complexity that isn't justified here." }, { "question": "An agent retrieves documents about 'machine learning performance' when the user asked about 'reducing false negatives in fraud detection'. What Agentic RAG capability handles this failure?", "options": [ "Routing — the agent should have used web search instead", "Self-reflection — the agent detects the docs are irrelevant, then Correction — it reformulates the query", "Adaptation — the agent switches to a simpler retrieval strategy", "Faithfulness checking — the agent rejects the final answer" ], "answer": 1, "explanation": "Self-reflection detects that the retrieved documents don't match the query intent. Correction then kicks in — the agent reformulates to something more specific like 'recall optimization in imbalanced classification for fraud detection' and retrieves again. These two pillars work together to recover from bad retrieval." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Basic RAG is a fixed pipeline — it cannot detect or recover from failed retrieval; Agentic RAG adds a feedback loop so the agent evaluates and corrects at every step.", "The four pillars of Agentic RAG are Routing (decide the right source), Self-Reflection (evaluate relevance), Correction (reformulate and retry), and Adaptation (match strategy to query complexity).", "Self-RAG formalized self-reflection with special reflection tokens, producing answers that are tightly grounded — only ~2% of correct predictions fall outside the provided passages.", "Agentic RAG makes multiple LLM calls per query, so it is not always the right choice — for simple factual queries, Basic RAG wins on cost and latency.", "The agent loop transforms retrieval from a rigid conveyor belt into an intelligent search process that knows when it has found the right answer." ] }
\`\`\`

> **Resource:** [GenAI Agents — Agentic RAG](https://github.com/NirDiamant/GenAI_Agents) includes open-source implementations of Self-RAG, Corrective RAG (CRAG), and Adaptive RAG patterns.`,
    },
    {
      id: "ar-self-rag",
      slug: "self-rag",
      title: "Self-RAG (Self-Reflection on Retrieval)",
      content: `## Self-RAG: Self-Reflection on Retrieval

Basic RAG always retrieves — it blindly fetches the top-K documents regardless of whether the query needs them. **Self-RAG** (Self-Reflective Retrieval-Augmented Generation, Asai et al. 2023) fixes this by teaching the model to *think about its own retrieval and generation* at every step. Instead of retrieving once and hoping for the best, the model continuously asks: *Should I retrieve? Is this relevant? Am I making things up?*

\`\`\`concept
{ "title": "Self-RAG Mental Model", "variant": "analogy", "content": "Think of Self-RAG like a careful research assistant who, before answering, first asks: 'Do I even need to look this up?' Then — after finding sources — asks: 'Is this source actually relevant?' And after drafting an answer: 'Can I point to exactly where in the sources I got this from?' Each question gates the next step, filtering noise before it reaches the final answer." }
\`\`\`

### The Four Reflection Tokens

Self-RAG extends the LLM's vocabulary with special **reflection tokens** — learned signals that let the model critique itself inline. These aren't prompting tricks; in the original paper they're baked into the model via fine-tuning. But you can approximate them with prompting chains.

\`\`\`steps
{ "title": "Self-RAG Reflection Tokens", "steps": [ { "title": "[Retrieve] — Should I fetch external knowledge?", "content": "The model first decides whether the query even needs retrieval. Factual questions about recent events → retrieve. General reasoning or math problems → skip retrieval and answer directly. This adaptive step prevents unnecessary latency and context pollution for queries that can be answered from parametric knowledge." }, { "title": "[IsRelevant] — Is this document actually useful?", "content": "For each retrieved document, the model grades **RELEVANT** or **NOT_RELEVANT**. Irrelevant documents are discarded before generation begins. This is the key difference from basic RAG — you're not passing garbage context to the generator just because the vector similarity score was high enough." }, { "title": "[IsSupported] — Is my answer grounded in the evidence?", "content": "After generating a response segment from a document, the model checks: is this answer **FULLY_SUPPORTED**, **PARTIALLY_SUPPORTED**, or **NOT_SUPPORTED** by the context? Not-supported segments get regenerated with stricter instructions or discarded. This is the primary hallucination-prevention mechanism." }, { "title": "[IsUseful] — Is the final answer actually helpful?", "content": "The last gate checks overall utility. When multiple candidate segments exist (one per relevant document), this token scores them and selects the best. Think of it as a final editorial pass before returning to the user." } ] }
\`\`\`

### The Full Execution Flow

\`\`\`trace
{ "title": "Self-RAG: Tracing a Query Step-by-Step", "language": "python", "code": "query = 'What were Self-RAG's benchmark results vs ChatGPT?'\\n\\n# Step 1: Retrieval decision\\nneed_retrieval = llm('RETRIEVE or DIRECT?', query)\\n# → 'RETRIEVE'\\n\\n# Step 2: Fetch candidates\\ndocs = vector_store.search(query, k=5)\\n# → [doc_A, doc_B, doc_C, doc_D, doc_E]\\n\\n# Step 3: Grade each doc\\nfor doc in docs:\\n    grade = llm('RELEVANT or NOT_RELEVANT?', query, doc)\\n    # doc_A → RELEVANT, doc_B → RELEVANT, doc_C → NOT_RELEVANT ...\\nrelevant_docs = [doc_A, doc_B]  # 2 of 5 survive\\n\\n# Step 4: Generate + faithfulness check\\nanswer = llm('Answer using context', context=relevant_docs, query)\\nfaithfulness = llm('FULLY/PARTIALLY/NOT_SUPPORTED?', context, answer)\\n# → 'FULLY_SUPPORTED'\\n\\n# Step 5: Utility check\\nfinal_score = llm('Rate utility 1-5', answer)\\n# → 5 → return answer", "frames": [ { "line": 1, "vars": { "query": "benchmark results vs ChatGPT?", "step": "Input" }, "note": "Query arrives — could be answered from memory or may need retrieval", "stdout": "" }, { "line": 4, "vars": { "need_retrieval": "RETRIEVE", "step": "[Retrieve] token" }, "note": "Model decides this is a factual claim that needs external grounding", "stdout": "[Retrieve] → RETRIEVE" }, { "line": 8, "vars": { "docs_fetched": 5, "step": "Vector search" }, "note": "k=5 candidates returned — but not all will be relevant", "stdout": "Fetched 5 candidate documents" }, { "line": 12, "vars": { "doc_A": "RELEVANT", "doc_B": "RELEVANT", "doc_C": "NOT_RELEVANT", "survivors": 2, "step": "[IsRelevant] token" }, "note": "3 of 5 docs are filtered out — only 2 pass the relevance gate", "stdout": "[IsRelevant] 2/5 documents survive" }, { "line": 18, "vars": { "faithfulness": "FULLY_SUPPORTED", "step": "[IsSupported] token" }, "note": "Generated answer can be traced back to source text — no hallucination detected", "stdout": "[IsSupported] → FULLY_SUPPORTED" }, { "line": 23, "vars": { "utility_score": 5, "step": "[IsUseful] token" }, "note": "Final answer scores high on utility — returned to user", "stdout": "[IsUseful] → 5/5 ✓" } ], "speed": 900 }
\`\`\`

### Implementing Self-RAG via Prompting

You don't need a specially fine-tuned model to get most of Self-RAG's benefits. The reflection tokens can be approximated with a multi-step prompting chain:

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Basic RAG — blind retrieval", "code": "def basic_rag(query, vector_store):\\n    # Always retrieves, never grades\\n    docs = vector_store.search(query, k=5)\\n    context = '\\\\n'.join([d.content for d in docs])\\n    return llm(f'Answer: {query}\\\\nContext: {context}')" }, "after": { "label": "Self-RAG — reflective retrieval", "code": "def self_rag(query, vector_store):\\n    # Gate 1: Do we even need retrieval?\\n    decision = llm(\\n        f'Does this need external lookup?\\\\n'\\n        f'Question: {query}\\\\n'\\n        f'Reply RETRIEVE or DIRECT.'\\n    )\\n    if 'DIRECT' in decision:\\n        return llm(f'Answer from memory: {query}')\\n\\n    # Retrieve then grade relevance\\n    docs = vector_store.search(query, k=5)\\n    relevant = [\\n        d for d in docs\\n        if 'RELEVANT' in llm(\\n            f'Relevant to: {query}?\\\\nDoc: {d.content}\\\\nRELEVANT/NOT_RELEVANT'\\n        )\\n    ]\\n    if not relevant:\\n        return web_search_fallback(query)\\n\\n    context = '\\\\n'.join([d.content for d in relevant])\\n    answer = llm(f'Answer using context:\\\\n{context}\\\\nQ: {query}')\\n\\n    # Gate 3: Is the answer grounded?\\n    support = llm(\\n        f'Supported by context?\\\\nCtx: {context}\\\\nAns: {answer}\\\\n'\\n        f'FULLY_SUPPORTED/PARTIALLY_SUPPORTED/NOT_SUPPORTED'\\n    )\\n    if 'NOT_SUPPORTED' in support:\\n        answer = llm(\\n            f'Answer ONLY from context. Say \\\\'I don\\\\'t know\\\\' if absent.\\\\n'\\n            f'Context: {context}\\\\nQ: {query}'\\n        )\\n    return answer" } }
\`\`\`

### Self-RAG vs Basic RAG: When Does It Matter?

| Dimension | Basic RAG | Self-RAG |
|-----------|-----------|----------|
| **Retrieval trigger** | Always | Adaptive — skips when unnecessary |
| **Document filtering** | Top-K by vector score | Graded by LLM relevance |
| **Faithfulness** | Unchecked — may hallucinate | Verified against source |
| **LLM calls per query** | 1 | 3–5 |
| **Factual accuracy (bio tasks)** | ~71% (ChatGPT baseline) | ~80% (Self-RAG 7B–13B) |
| **Best for** | Speed-sensitive, low-stakes | High-stakes, accuracy-critical |

\`\`\`callout
{ "type": "info", "title": "Benchmark Reality Check", "content": "According to Asai et al. (2023), Self-RAG at 7B and 13B parameters outperforms ChatGPT and retrieval-augmented Llama 2-chat on open-domain QA, reasoning, and fact verification tasks. For Llama-3-8B with SFT, Self-RAG achieves 81.3 F1 — beating Retrieval-Augmented Instruction Tuning (RA-IT) at 79.6 F1. The gains are largest on biographical generation tasks where hallucination risk is highest." }
\`\`\`

### When to Use Self-RAG

\`\`\`tabs
{ "tabs": [ { "label": "Use Self-RAG", "icon": "✅", "content": "**High-stakes domains** where hallucination has real consequences:\\n- Medical Q&A (wrong dosage kills people)\\n- Legal research (wrong precedent loses cases)\\n- Financial analysis (wrong data costs money)\\n\\n**Mixed query portfolios** — when some queries need retrieval and others don't. Self-RAG saves tokens by skipping retrieval for simple questions.\\n\\n**Quality-over-latency** systems where a user will wait 3–5 seconds for a verified answer rather than receive a fast but hallucinated one." }, { "label": "Skip Self-RAG", "icon": "⚡", "content": "**Latency-critical applications** — chatbots, real-time assistants, autocomplete. The 3–5x LLM call overhead is often unacceptable.\\n\\n**High-volume, low-risk queries** where basic RAG at scale is cheaper and fast enough.\\n\\n**Well-curated knowledge bases** — if your retrieval index is already clean and precise, the extra relevance-grading step adds cost without meaningful accuracy gain." }, { "label": "Hybrid Strategy", "icon": "⚖️", "content": "Many production systems route by query type:\\n- Simple factual questions → basic RAG or direct LLM\\n- High-stakes or ambiguous queries → Self-RAG pipeline\\n- Unknown query type → route with a cheap classifier first\\n\\nThis keeps average latency low while getting Self-RAG's accuracy where it matters." } ] }
\`\`\`

\`\`\`quiz
{ "title": "Self-RAG Comprehension Check", "questions": [ { "question": "What is the primary purpose of the [IsSupported] reflection token in Self-RAG?", "options": [ "To decide whether retrieval is necessary for the query", "To check if the generated answer is grounded in the retrieved context", "To score the overall utility of the final response", "To grade whether retrieved documents are relevant to the query" ], "answer": 1, "explanation": "[IsSupported] checks whether the model's generated answer is actually backed by the retrieved documents — returning FULLY_SUPPORTED, PARTIALLY_SUPPORTED, or NOT_SUPPORTED. This is the primary hallucination-detection gate. [Retrieve] handles retrieval necessity, [IsRelevant] handles document relevance, and [IsUseful] handles utility scoring." }, { "question": "Self-RAG (7B–13B parameters) outperformed ChatGPT on biographical generation tasks. Approximately what were the accuracy figures?", "options": [ "Self-RAG 62% vs ChatGPT 55%", "Self-RAG 80% vs ChatGPT 71%", "Self-RAG 95% vs ChatGPT 88%", "They performed equally at ~75%" ], "answer": 1, "explanation": "According to Asai et al. (2023), Self-RAG demonstrated ~80% accuracy on biographical generation vs ~71% for ChatGPT, one of the clearest demonstrations that reflection tokens improve factual accuracy on tasks where hallucination is easy." }, { "question": "A user asks your Self-RAG system: 'What is 15% of 240?' What should the [Retrieve] token return, and why?", "options": [ "RETRIEVE — math problems always benefit from external context", "RETRIEVE — the system should verify against a calculator database", "DIRECT — this is a calculation answerable from parametric knowledge without retrieval", "DIRECT — retrieval should only be skipped for greetings" ], "answer": 2, "explanation": "The [Retrieve] token's key insight is that not all queries need external knowledge. A straightforward arithmetic calculation (15% of 240 = 36) is answerable from the model's own reasoning — retrieving documents would add latency and noise with zero accuracy benefit." }, { "question": "In a prompting-based Self-RAG implementation, 5 documents are retrieved but all fail the [IsRelevant] check. What should happen next?", "options": [ "Return an empty response to the user", "Use the least-irrelevant document anyway", "Fall back to a web search or return a 'cannot answer' response", "Increase k and retry vector search with the same query" ], "answer": 2, "explanation": "When all retrieved documents are filtered as NOT_RELEVANT, the pipeline has no grounded context to generate from. The correct response is either a fallback strategy (like web search) or an honest 'I don't have relevant information' — never fabricating an answer from zero grounded context." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Self-RAG adds four reflection gates — [Retrieve], [IsRelevant], [IsSupported], [IsUseful] — that let the model evaluate its own retrieval and generation quality at every step.", "Adaptive retrieval means Self-RAG skips fetching documents entirely when the query can be answered from parametric knowledge, reducing unnecessary latency and context noise.", "The [IsSupported] token is the primary hallucination guard: answers rated NOT_SUPPORTED are regenerated with stricter grounding constraints before being returned.", "Self-RAG (7B–13B) outperforms ChatGPT on open-domain QA, reasoning, and fact verification — with ~80% vs ~71% biographical accuracy — at the cost of 3–5x more LLM calls per query.", "Use Self-RAG when accuracy is paramount (medical, legal, financial); prefer basic RAG when latency or cost is the binding constraint." ] }
\`\`\``,
    },
    {
      id: "ar-corrective-rag",
      slug: "corrective-rag",
      title: "Corrective RAG (CRAG)",
      content: `## Corrective RAG (CRAG)

Standard RAG has a silent failure mode: if your vector store returns bad documents, the LLM confidently generates a bad answer. **Corrective RAG (CRAG)** fixes this by adding a retrieval evaluator that intercepts low-quality results and triggers corrective actions — including falling back to live web search — before generation ever happens.

\`\`\`concept
{ "title": "CRAG's Core Idea", "variant": "mental-model", "content": "Think of CRAG as a quality-control checkpoint between retrieval and generation. Standard RAG is like a factory that ships whatever comes off the assembly line. CRAG adds an inspector who can say: 'This batch is fine', 'Strip the bad parts and supplement', or 'Throw this out and get fresh materials from outside.' The inspector (retrieval evaluator) prevents bad inputs from contaminating the final answer." }
\`\`\`

### The Problem CRAG Solves

Standard RAG blindly generates from whatever documents it retrieves. If those documents are irrelevant, outdated, or misleading, the generated answer will be too. Research shows this failure mode is serious: CRAG demonstrated a **36.6% accuracy gain** over standard RAG on the PubHealth dataset — a high-hallucination-risk benchmark — and a **72% relative improvement in factual consistency** over a T5 generator baseline, with 84% of outputs rated as factually aligned with retrieved passages.

\`\`\`callout
{ "type": "warning", "title": "The Silent Failure", "content": "Standard RAG has no feedback loop. If your vector store has gaps, outdated content, or simply doesn't cover the user's question, the LLM will still generate an answer — it just won't tell you it's guessing. CRAG breaks this silence by making retrieval quality explicit." }
\`\`\`

### The CRAG Pipeline

CRAG introduces a three-way decision gate after retrieval. The retrieved documents are scored by a lightweight evaluator, and one of three corrective actions is triggered:

\`\`\`steps
{ "title": "The CRAG Pipeline", "steps": [ { "title": "Retrieve", "content": "Query the vector store as usual. Fetch top-k candidate documents. Nothing is different here from standard RAG." }, { "title": "Evaluate Retrieval Quality", "content": "A lightweight LLM call (or fine-tuned classifier) scores the retrieved documents against the query. The evaluator assigns one of three confidence levels:\\n\\n- **CORRECT** — documents are clearly relevant\\n- **AMBIGUOUS** — partially relevant (some useful content, some noise)\\n- **INCORRECT** — documents are irrelevant or misleading" }, { "title": "Apply Corrective Action", "content": "Based on the evaluation:\\n\\n| Verdict | Action |\\n|---------|--------|\\n| CORRECT | Pass documents directly to generation |\\n| AMBIGUOUS | Run *knowledge refinement* (extract relevant sentences) + supplement with web search |\\n| INCORRECT | Discard local docs entirely, fall back to web search |" }, { "title": "Knowledge Refinement (Ambiguous path)", "content": "A decompose-then-recompose algorithm strips irrelevant sentences from partially relevant documents. Each document is passed through a focused extraction prompt: *'Extract only the sentences that directly answer the question.'* Empty extractions are discarded." }, { "title": "Generate", "content": "The LLM generates the final answer from the corrected context — whether that's the original docs, refined fragments, web results, or a blend." } ] }
\`\`\`

### Implementation

\`\`\`playground
{ "title": "CRAG Pipeline in Python", "language": "python", "runnable": false, "code": "from enum import Enum\\n\\nclass RetrievalQuality(Enum):\\n    CORRECT = \\"correct\\"\\n    AMBIGUOUS = \\"ambiguous\\"\\n    INCORRECT = \\"incorrect\\"\\n\\ndef evaluate_retrieval(query: str, documents: list) -> RetrievalQuality:\\n    \\"\\"\\"Use LLM to evaluate if retrieved documents answer the query.\\"\\"\\"\\n    doc_texts = \\"\\\\n---\\\\n\\".join([d.content for d in documents])\\n    evaluation = llm(\\n        f\\"Evaluate whether these documents can answer the question.\\\\n\\\\n\\"\\n        f\\"Question: {query}\\\\n\\\\n\\"\\n        f\\"Documents:\\\\n{doc_texts}\\\\n\\\\n\\"\\n        f\\"Rate as CORRECT (fully relevant), AMBIGUOUS (partially relevant), \\"\\n        f\\"or INCORRECT (not relevant at all).\\"\\n    )\\n    if \\"CORRECT\\" in evaluation:\\n        return RetrievalQuality.CORRECT\\n    elif \\"AMBIGUOUS\\" in evaluation:\\n        return RetrievalQuality.AMBIGUOUS\\n    else:\\n        return RetrievalQuality.INCORRECT\\n\\ndef knowledge_refinement(query: str, documents: list) -> str:\\n    \\"\\"\\"Extract only the relevant parts from partially relevant documents.\\"\\"\\"\\n    refined = []\\n    for doc in documents:\\n        extraction = llm(\\n            f\\"Extract only the sentences relevant to this question:\\\\n\\"\\n            f\\"Question: {query}\\\\n\\"\\n            f\\"Document: {doc.content}\\\\n\\"\\n            f\\"If nothing is relevant, return EMPTY.\\"\\n        )\\n        if \\"EMPTY\\" not in extraction:\\n            refined.append(extraction)\\n    return \\"\\\\n\\".join(refined)\\n\\ndef corrective_rag(query: str) -> str:\\n    \\"\\"\\"CRAG pipeline: retrieve, evaluate, correct, generate.\\"\\"\\"\\n    # Step 1: Initial retrieval\\n    documents = vector_store.search(query, k=5)\\n\\n    # Step 2: Evaluate retrieval quality\\n    quality = evaluate_retrieval(query, documents)\\n\\n    # Step 3: Corrective action based on evaluation\\n    if quality == RetrievalQuality.CORRECT:\\n        context = \\"\\\\n\\".join([d.content for d in documents])\\n\\n    elif quality == RetrievalQuality.AMBIGUOUS:\\n        # Refine existing docs + supplement with web search\\n        refined = knowledge_refinement(query, documents)\\n        web_results = web_search(query)\\n        context = f\\"Local sources:\\\\n{refined}\\\\n\\\\nWeb sources:\\\\n{web_results}\\"\\n\\n    elif quality == RetrievalQuality.INCORRECT:\\n        # Discard local docs entirely, use web search\\n        context = web_search(query)\\n\\n    # Step 4: Generate with corrected context\\n    answer = llm(\\n        f\\"Answer this question using the provided context.\\\\n\\\\n\\"\\n        f\\"Context:\\\\n{context}\\\\n\\\\n\\"\\n        f\\"Question: {query}\\"\\n    )\\n    return answer" }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Lightweight Evaluator = Lower Latency Cost", "content": "The retrieval evaluator doesn't need to be a large model. A smaller, fine-tuned classifier or a concise LLM call is sufficient — the evaluation prompt is short and the output space is just three labels. Reserve the larger model for the final generation step where reasoning depth matters." }
\`\`\`

### CRAG vs Self-RAG

Both strategies add self-reflection to RAG, but they intervene at different stages and for different reasons.

\`\`\`tabs
{ "tabs": [ { "label": "Self-RAG", "icon": "🔄", "content": "**Self-RAG** reflects at every generation step. It uses special tokens (\`[Retrieve]\`, \`[IsRel]\`, \`[IsSup]\`, \`[IsUse]\`) to decide whether to retrieve at all, whether each retrieved passage is relevant, and whether the generated output is supported by evidence.\\n\\n- Granular control over retrieval necessity\\n- Can decide mid-generation that more retrieval is needed\\n- Multiple reflection points increase latency\\n- Best for: high-stakes accuracy where hallucination cost is very high" }, { "label": "CRAG", "icon": "🛡️", "content": "**CRAG** intervenes once — right after initial retrieval — with a three-way quality gate. If retrieval fails, it reroutes to web search before generation begins.\\n\\n- Single evaluation checkpoint (lower overhead vs Self-RAG)\\n- Hard fallback to web search for irrelevant docs\\n- Knowledge refinement strips noise from ambiguous results\\n- Best for: robust production systems where the vector store may have gaps or stale content" }, { "label": "When to Use Which", "icon": "🎯", "content": "| Scenario | Use |\\n|----------|-----|\\n| Every answer must cite evidence | Self-RAG |\\n| Index may have gaps / be outdated | CRAG |\\n| Real-time queries on evolving topics | CRAG |\\n| Controlled corpus, no web access | Self-RAG |\\n| Need graceful degradation in production | CRAG |\\n| Want sentence-level faithfulness checks | Self-RAG |" } ] }
\`\`\`

### Visualizing the Decision Flow

\`\`\`mermaid
flowchart TD
    Q[User Query] --> R[Vector Store Retrieval]
    R --> E{Retrieval Evaluator}
    E -->|CORRECT| G[Generate Answer]
    E -->|AMBIGUOUS| KR[Knowledge Refinement]
    KR --> WS1[Supplement with Web Search]
    WS1 --> G
    E -->|INCORRECT| WS2[Web Search Fallback]
    WS2 --> G
    G --> A[Final Answer]

    style E fill:#f59e0b,color:#000
    style KR fill:#3b82f6,color:#fff
    style WS1 fill:#10b981,color:#fff
    style WS2 fill:#ef4444,color:#fff
\`\`\`

### Trade-offs to Know

\`\`\`collapse
{ "title": "Deep Dive: CRAG's Latency vs Reliability Trade-off", "content": "CRAG's evaluation step adds latency to every query — you're making an extra LLM call before generation. In the AMBIGUOUS path, you also pay for knowledge refinement AND a web search, making it potentially 3× the cost of a standard RAG call.\\n\\nMitigations:\\n\\n1. **Use a small evaluator model** — a 7B-parameter model fine-tuned on relevance judgments is far cheaper than using GPT-4 for evaluation.\\n2. **Cache evaluator results** — if the same query hits your system repeatedly, cache the quality verdict and skip re-evaluation.\\n3. **Set confidence thresholds** — instead of a three-class output, use confidence scores. Only trigger INCORRECT-path fallback below a hard threshold (e.g., 0.3). AMBIGUOUS triggers for 0.3–0.7. CORRECT above 0.7.\\n4. **Rate-limit web search** — web search is expensive and slow. Consider a hybrid: query a secondary index (e.g., a news corpus) before hitting the open web.\\n\\nBottom line: CRAG trades some latency and cost for significantly better reliability in production, where you can't guarantee every query will match your indexed content." }
\`\`\`

### When to Use CRAG

- Your vector store may have **gaps or outdated information** (time-sensitive domains)
- Users ask questions that **go beyond your indexed content**
- You need a **reliable fallback** when local retrieval fails
- You want **graceful degradation** rather than hallucinated answers in production
- Your domain shifts faster than you can re-index (news, market data, research)

\`\`\`quiz
{ "title": "Check Your Understanding: Corrective RAG", "questions": [ { "question": "What is the primary problem that CRAG addresses in standard RAG pipelines?", "options": [ "LLMs are too slow to generate answers in real time", "Retrieved documents may be irrelevant, but the LLM generates confidently anyway", "Vector stores are too expensive to maintain at scale", "Embedding models produce inaccurate representations" ], "answer": 1, "explanation": "Standard RAG has no quality gate — it passes retrieved documents to the LLM regardless of relevance. If those documents are wrong or unrelated, the LLM still generates an answer, silently hallucinating. CRAG's retrieval evaluator intercepts this failure before generation." }, { "question": "In the AMBIGUOUS evaluation path, what does CRAG do?", "options": [ "Discards all retrieved documents and runs a web search", "Uses retrieved documents as-is without modification", "Runs knowledge refinement on retrieved docs AND supplements with web search", "Asks the user to rephrase the query" ], "answer": 2, "explanation": "The AMBIGUOUS path combines two strategies: knowledge refinement (extracting only the relevant sentences from partially useful documents) and a web search to fill in what the local docs couldn't cover. This blended context is then passed to the generator." }, { "question": "A research team uses CRAG on a medical QA system. Their vector store contains clinical guidelines last updated 6 months ago. A user asks about a drug approved 3 months ago. Which CRAG path is most likely triggered, and why?", "options": [ "CORRECT — clinical guidelines are authoritative sources", "AMBIGUOUS — the guidelines are related to medicine generally", "INCORRECT — retrieved documents won't contain information about the new drug", "The query is rejected before retrieval" ], "answer": 2, "explanation": "Since the drug was approved after the last index update, the vector store likely returns documents about the drug class or related medications but not the specific approval. The evaluator would score this as INCORRECT (no relevant documents exist) and trigger web search to find current prescribing information." }, { "question": "What is the 'decompose-then-recompose' algorithm in CRAG?", "options": [ "Breaking a query into sub-queries, retrieving for each, then merging results", "Splitting retrieved documents into sentences, filtering for relevance, then joining the relevant ones", "Decomposing the LLM's output into claims and verifying each", "A chunking strategy for embedding long documents" ], "answer": 1, "explanation": "Knowledge refinement in CRAG works by decomposing documents into their constituent sentences (or passages), scoring each for relevance to the query, discarding irrelevant ones, and recomposing the survivors into a filtered context. This prevents irrelevant noise from polluting the generation step." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "CRAG adds a retrieval evaluator between retrieval and generation that assigns CORRECT, AMBIGUOUS, or INCORRECT confidence levels to retrieved documents", "The INCORRECT path triggers a full web search fallback — discarding local docs entirely — making CRAG resilient to vector store gaps and stale content", "Knowledge refinement (decompose-then-recompose) extracts only relevant sentences from partially useful documents in the AMBIGUOUS path", "CRAG demonstrated a 36.6% accuracy gain over standard RAG on high-hallucination benchmarks and 72% improvement in factual consistency", "The evaluation step adds latency cost; mitigate with a small fine-tuned evaluator model, caching, and confidence thresholds rather than hard three-way classification" ] }
\`\`\`

> **Resource**: [RAG Techniques](https://github.com/NirDiamant/RAG_Techniques) covers CRAG implementation patterns alongside dozens of other retrieval strategies.`,
    },
    {
      id: "ar-adaptive-rag",
      slug: "adaptive-rag",
      title: "Adaptive RAG (Routing Queries)",
      content: `## Adaptive RAG: Routing Queries

Static RAG systems treat every query identically — fire a vector search, stuff context, call the LLM. That works fine until you realize you're running a full retrieval pipeline to answer "What does HTTP stand for?" while barely scraping by on "Compare our Q3 revenue across all product lines against industry benchmarks."

**Adaptive RAG** solves this with a decision layer: classify the query first, then route it to the cheapest pipeline that can actually answer it well.

\`\`\`concept
{ "title": "The Routing Insight", "variant": "mental-model", "content": "Every query has a natural 'resolution level'. Adaptive RAG matches retrieval cost to query complexity — simple questions get direct LLM answers, complex questions trigger multi-step multi-source pipelines. The classifier is the agent's judgment call made explicit." }
\`\`\`

### The Four Query Categories

\`\`\`tabs
{
  "tabs": [
    {
      "label": "SIMPLE",
      "icon": "💡",
      "content": "**General knowledge — no retrieval needed.**\\n\\nExamples:\\n- \\"What is photosynthesis?\\"\\n- \\"Who wrote Pride and Prejudice?\\"\\n- \\"Explain recursion.\\"\\n\\nThe LLM already knows this. Routing to retrieval adds latency and hallucination risk from irrelevant chunks. Answer directly.\\n\\n**Cost:** One LLM call."
    },
    {
      "label": "STANDARD",
      "icon": "🔍",
      "content": "**Domain-specific — single retrieval pass.**\\n\\nExamples:\\n- \\"What does our refund policy say?\\"\\n- \\"What's the API rate limit for the v2 endpoint?\\"\\n- \\"Summarize the Q3 board memo.\\"\\n\\nThe answer lives in your knowledge base but not in the LLM's weights. One vector search, retrieve top-k chunks, answer.\\n\\n**Cost:** One vector search + one LLM call."
    },
    {
      "label": "COMPLEX",
      "icon": "🧩",
      "content": "**Multi-faceted — requires decomposition and synthesis.**\\n\\nExamples:\\n- \\"Compare Q3 revenue across all product lines against industry benchmarks.\\"\\n- \\"What are the security implications of our current auth flow vs. OAuth 2.0?\\"\\n\\nDecompose into sub-questions, retrieve independently for each, synthesize a final answer.\\n\\n**Cost:** N vector searches + (N+1) LLM calls."
    },
    {
      "label": "REAL_TIME",
      "icon": "🌐",
      "content": "**Temporally sensitive — needs live information.**\\n\\nExamples:\\n- \\"What is the current Bitcoin price?\\"\\n- \\"Did GPT-5 release yet?\\"\\n- \\"What are today's top headlines about the Fed?\\"\\n\\nThe knowledge base is stale by definition. Route to a web search tool, then answer from the live results.\\n\\n**Cost:** One web search + one LLM call."
    }
  ]
}
\`\`\`

### The Adaptive RAG Pipeline

\`\`\`sysdiag
{
  "title": "Adaptive RAG Routing Architecture",
  "width": 700,
  "height": 380,
  "nodes": [
    { "id": "query", "label": "User Query", "x": 60, "y": 180, "kind": "client" },
    { "id": "classifier", "label": "Query Classifier", "x": 220, "y": 180, "kind": "service" },
    { "id": "simple", "label": "Direct LLM", "x": 420, "y": 60, "kind": "service" },
    { "id": "standard", "label": "Single-Pass RAG", "x": 420, "y": 150, "kind": "service" },
    { "id": "complex", "label": "Multi-Step RAG", "x": 420, "y": 240, "kind": "service" },
    { "id": "realtime", "label": "Web Search RAG", "x": 420, "y": 330, "kind": "service" },
    { "id": "answer", "label": "Final Answer", "x": 610, "y": 180, "kind": "client" }
  ],
  "edges": [
    { "from": "query", "to": "classifier", "label": "classify" },
    { "from": "classifier", "to": "simple", "label": "SIMPLE" },
    { "from": "classifier", "to": "standard", "label": "STANDARD" },
    { "from": "classifier", "to": "complex", "label": "COMPLEX" },
    { "from": "classifier", "to": "realtime", "label": "REAL_TIME" },
    { "from": "simple", "to": "answer" },
    { "from": "standard", "to": "answer" },
    { "from": "complex", "to": "answer" },
    { "from": "realtime", "to": "answer" }
  ],
  "annotations": {
    "classifier": "LLM-based classifier analyzes query intent, complexity, and temporal sensitivity to select the appropriate pipeline",
    "complex": "Decomposes query into 2–4 sub-questions, retrieves independently for each, then synthesizes. Most expensive path — only triggered when necessary.",
    "realtime": "Routes to a web search tool (e.g., Tavily, SerpAPI) when the knowledge base is insufficient for temporally sensitive queries"
  }
}
\`\`\`

### Implementation

The classifier is the core of the system — it must be fast and reliable. Using the LLM itself to classify is straightforward but adds one round-trip. For production systems, a fine-tuned small classifier (e.g., a distilled BERT model) can reduce this to milliseconds.

\`\`\`playground
{
  "title": "Query Classifier + Router",
  "language": "python",
  "runnable": false,
  "code": "from enum import Enum\\n\\nclass QueryType(Enum):\\n    SIMPLE   = \\"simple\\"     # General knowledge, no retrieval\\n    STANDARD = \\"standard\\"   # Single-pass RAG\\n    COMPLEX  = \\"complex\\"    # Multi-step, multi-source\\n    REAL_TIME = \\"real_time\\" # Needs current information\\n\\ndef classify_query(query: str) -> QueryType:\\n    \\"\\"\\"Use LLM to classify query complexity.\\"\\"\\"\\n    classification = llm(\\n        f\\"Classify this query into exactly one category:\\\\n\\\\n\\"\\n        f\\"SIMPLE: Can be answered from general knowledge\\\\n\\"\\n        f\\"STANDARD: Needs a single document lookup\\\\n\\"\\n        f\\"COMPLEX: Needs multiple sources or multi-step reasoning\\\\n\\"\\n        f\\"REAL_TIME: Needs current/live information\\\\n\\\\n\\"\\n        f\\"Query: {query}\\\\n\\"\\n        f\\"Category:\\"\\n    )\\n    for qt in QueryType:\\n        if qt.value.upper() in classification.upper():\\n            return qt\\n    return QueryType.STANDARD  # Safe default\\n\\ndef adaptive_rag(query: str) -> str:\\n    \\"\\"\\"Route queries to the appropriate RAG strategy.\\"\\"\\"\\n    query_type = classify_query(query)\\n\\n    if query_type == QueryType.SIMPLE:\\n        return llm(f\\"Answer this question: {query}\\")\\n\\n    elif query_type == QueryType.STANDARD:\\n        docs = vector_store.search(query, k=5)\\n        context = \\"\\\\n\\".join([d.content for d in docs])\\n        return llm(f\\"Context: {context}\\\\nQuestion: {query}\\")\\n\\n    elif query_type == QueryType.COMPLEX:\\n        return complex_rag_pipeline(query)\\n\\n    elif query_type == QueryType.REAL_TIME:\\n        web_results = web_search(query)\\n        return llm(f\\"Web results: {web_results}\\\\nQuestion: {query}\\")"
}
\`\`\`

### The Complex Pipeline: Decompose → Retrieve → Synthesize

\`\`\`trace
{
  "title": "Complex Query Execution: 'Compare our Q3 revenue vs industry benchmarks'",
  "language": "python",
  "code": "def complex_rag_pipeline(query):\\n    sub_questions = decompose(query)\\n    sub_answers = []\\n    for sq in sub_questions:\\n        docs = vector_store.search(sq, k=3)\\n        answer = llm(docs, sq)\\n        sub_answers.append((sq, answer))\\n    return synthesize(sub_answers, query)",
  "speed": 1000,
  "frames": [
    {
      "line": 2,
      "vars": { "query": "Compare Q3 revenue vs benchmarks", "sub_questions": "pending" },
      "note": "Decompose the complex query into atomic sub-questions the retriever can handle independently"
    },
    {
      "line": 3,
      "vars": { "sub_questions": ["What was our Q3 revenue?", "What are industry benchmarks for Q3?", "How do our margins compare?"] },
      "note": "LLM produces 3 focused sub-questions. Each can now be sent to the vector store independently."
    },
    {
      "line": 4,
      "vars": { "sq": "What was our Q3 revenue?", "iteration": 1 },
      "note": "Iteration 1: retrieve documents relevant to Q3 internal revenue data"
    },
    {
      "line": 5,
      "vars": { "docs": "[Q3_report.pdf:p4, finance_summary.xlsx:sheet2, board_memo.docx:p1]" },
      "note": "k=3 is intentional — smaller context per sub-question keeps answers focused"
    },
    {
      "line": 6,
      "vars": { "answer": "Q3 total revenue was $4.2M across all product lines" },
      "note": "Sub-answer 1 produced from the 3 retrieved chunks"
    },
    {
      "line": 4,
      "vars": { "sq": "What are industry benchmarks for Q3?", "iteration": 2 },
      "note": "Iteration 2: retrieve from a different part of the knowledge base (external benchmarks)"
    },
    {
      "line": 7,
      "vars": { "sub_answers": [["Q3 revenue?", "$4.2M"], ["Industry benchmarks?", "Median $3.8M"], ["Margins?", "Our 34% vs industry 28%"]] },
      "note": "All 3 sub-answers collected after 3 independent retrievals"
    },
    {
      "line": 8,
      "vars": { "result": "Our Q3 revenue of $4.2M exceeds the industry median of $3.8M by 10.5%, with margins 6pp above sector average." },
      "note": "Synthesizer LLM call combines all sub-answers into a coherent final response"
    }
  ]
}
\`\`\`

### Multi-Source Routing

For enterprise systems, different query types may map to entirely different data stores — not just different retrieval strategies:

\`\`\`playground
{
  "title": "Multi-Source Router",
  "language": "python",
  "runnable": false,
  "code": "SOURCES = {\\n    \\"internal_docs\\": internal_vector_store,\\n    \\"code_base\\":     code_vector_store,\\n    \\"customer_data\\": customer_db,\\n    \\"web\\":           web_search_tool,\\n}\\n\\ndef route_to_sources(query: str) -> list[str]:\\n    \\"\\"\\"LLM selects which data sources are relevant for this query.\\"\\"\\"\\n    routing = llm(\\n        f\\"Which sources should be consulted for this query?\\\\n\\"\\n        f\\"Available: internal_docs, code_base, customer_data, web\\\\n\\\\n\\"\\n        f\\"Query: {query}\\\\n\\"\\n        f\\"Return a comma-separated list of relevant source names only.\\"\\n    )\\n    return [\\n        s.strip() for s in routing.split(\\",\\")\\n        if s.strip() in SOURCES\\n    ]\\n\\ndef multi_source_rag(query: str) -> str:\\n    sources = route_to_sources(query)\\n    all_docs = []\\n    for source_name in sources:\\n        results = SOURCES[source_name].search(query, k=3)\\n        all_docs.extend(results)\\n    context = \\"\\\\n\\".join([d.content for d in all_docs])\\n    return llm(f\\"Context from {sources}:\\\\n{context}\\\\nQuestion: {query}\\")"
}
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Production Classifier Strategies", "content": "Using a full LLM call to classify adds ~200–500ms of latency on every request. For production systems, consider:\\n\\n- **Fine-tuned small model** (e.g., DistilBERT on your query logs) — sub-10ms classification\\n- **Keyword heuristics first** (contains 'today', 'currently', 'latest' → REAL_TIME; contains multiple 'vs', 'compare', 'across' → COMPLEX)\\n- **Hybrid**: fast heuristics as pre-filter, LLM classifier only for ambiguous cases\\n\\nThe classifier's accuracy directly determines whether you pay for expensive multi-step pipelines when cheap single-pass would have worked." }
\`\`\`

### Combining All Three Agentic RAG Patterns

Adaptive, Self-RAG, and Corrective RAG are complementary — the most robust systems layer all three:

\`\`\`mermaid
flowchart TD
    Q[User Query] --> AR[Adaptive RAG\\nclassify + route]
    AR -->|SIMPLE| LLM[Direct LLM]
    AR -->|STANDARD| SR[Self-RAG\\nreflect at each step]
    AR -->|COMPLEX| MS[Multi-step + Self-RAG]
    AR -->|REAL_TIME| WS[Web Search + Self-RAG]
    SR -->|retrieval poor| CRAG[Corrective RAG\\nfallback / reformulate]
    MS -->|retrieval poor| CRAG
    CRAG --> Final[Final Answer]
    LLM --> Final
    SR --> Final
    MS --> Final
    WS --> Final
\`\`\`

The three patterns form a stack:
- **Adaptive RAG** decides *which* pipeline to run (outer loop)
- **Self-RAG** adds reflection *within* each pipeline step (inner loop)
- **Corrective RAG** handles failures when retrieved docs are insufficient (error handling)

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "A user asks: 'What is the current EUR/USD exchange rate?' Which QueryType should the classifier assign?",
      "options": ["SIMPLE — general financial knowledge", "STANDARD — look it up in the knowledge base", "COMPLEX — requires multi-step reasoning", "REAL_TIME — requires live data"],
      "answer": 3,
      "explanation": "Exchange rates change by the second. The knowledge base is stale by definition for live market data. REAL_TIME routes to a web search tool to fetch current information before generating an answer."
    },
    {
      "question": "The complex_rag_pipeline decomposes a query into sub-questions and retrieves k=3 docs per sub-question rather than k=10 for the whole query. Why?",
      "options": ["To reduce vector store costs", "To keep each retrieval focused — smaller, targeted context prevents the LLM from getting confused by irrelevant chunks", "Because the vector store has a limit of 3 results", "To avoid rate limiting on the LLM API"],
      "answer": 1,
      "explanation": "Each sub-question is narrow and specific. Retrieving k=3 highly relevant chunks per sub-question produces cleaner, more focused sub-answers than retrieving k=10 mixed chunks for a broad complex query. The synthesis step then combines the focused answers."
    },
    {
      "question": "A company uses Adaptive RAG with four data sources: internal_docs, code_base, customer_data, web. A user asks: 'Why are customers on the Enterprise plan churning this quarter?' Which sources should route_to_sources most likely return?",
      "options": ["web only", "internal_docs only", "customer_data and internal_docs", "code_base and web"],
      "answer": 2,
      "explanation": "Churn analysis requires customer_data (usage patterns, cancellation reasons, support tickets) AND internal_docs (internal reports, meeting notes, strategy docs). The web and code_base are unlikely to contain proprietary customer churn signals."
    },
    {
      "question": "What is the primary cost-optimization benefit of Adaptive RAG compared to always using the COMPLEX pipeline?",
      "options": ["It reduces the size of the vector store", "It avoids running expensive multi-step retrieval on queries that a direct LLM call or single-pass RAG can handle", "It eliminates the need for a vector database entirely", "It caches query results automatically"],
      "answer": 1,
      "explanation": "COMPLEX queries require N vector searches and N+1 LLM calls. Running this for every query — including simple factual questions — wastes tokens and adds latency. Adaptive RAG ensures you only pay the multi-step cost when query complexity actually warrants it."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Adaptive RAG adds a classification layer that routes each query to the cheapest pipeline that can answer it correctly — SIMPLE (direct LLM), STANDARD (single-pass RAG), COMPLEX (multi-step), or REAL_TIME (web search).",
    "The COMPLEX pipeline decomposes a query into 2–4 atomic sub-questions, retrieves independently for each, then synthesizes — this produces better answers than stuffing one large retrieval context into a single LLM call.",
    "Multi-source routing extends the pattern: the classifier selects not just a retrieval strategy but which data stores (vector DB, relational DB, web) are relevant for the query.",
    "Adaptive, Self-RAG, and Corrective RAG are complementary: Adaptive selects the outer pipeline, Self-RAG reflects within each step, and Corrective RAG handles retrieval failures as a fallback.",
    "In production, LLM-based classification adds latency — fast keyword heuristics or fine-tuned small classifiers can reduce this to milliseconds while preserving routing accuracy."
  ]
}
\`\`\``,
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
