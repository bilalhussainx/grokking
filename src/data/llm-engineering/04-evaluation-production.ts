import { Module } from "../types";

export const module4: Module = {
  id: "evaluation-production",
  title: "LLM Evaluation & Production Systems",
  description: "Evaluation frameworks (LLM-as-judge, RAGAS, BLEU/ROUGE), cost optimization with caching and model routing, latency optimization, observability, and production LLM architecture",
  lessons: [
    {
      id: "evaluation-production",
      slug: "evaluation-production",
      title: "LLM Evaluation & Production",
      content: `# LLM Evaluation & Production Systems

Shipping an LLM feature without evaluation is like deploying code without tests. You'll discover failures in production — which is exactly where you don't want to.

---

\`\`\`concept
{
  "title": "The LLM Evaluation Stack",
  "variant": "mental-model",
  "content": "LLM outputs are probabilistic and hard to evaluate with traditional metrics. A generated answer might be factually correct but worded differently from the reference — BLEU score says it's bad, humans say it's good. Modern evaluation combines: (1) automated metrics for cheap regression testing, (2) LLM-as-judge for semantic quality at scale, (3) human evaluation for ground truth on critical decisions, and (4) domain-specific evals for your actual task. You need all four layers for a production system."
}
\`\`\`

---

## Automated Evaluation Metrics

\`\`\`python
# --- RAGAS: RAG evaluation framework ---
from ragas import evaluate
from ragas.metrics import (
    faithfulness,       # Does answer stick to retrieved context? (hallucination check)
    answer_relevancy,   # Is answer relevant to the question?
    context_recall,     # Did retrieval get the right documents?
    context_precision,  # Are retrieved docs relevant (not noisy)?
)
from datasets import Dataset

questions = ["What is LoRA?", "How does FAISS work?"]
answers = ["LoRA is a fine-tuning method...", "FAISS is a library..."]
contexts = [["LoRA paper context..."], ["FAISS documentation..."]]
ground_truths = [["LoRA adds adapter matrices..."], ["FAISS indexes vectors..."]]

dataset = Dataset.from_dict({
    "question": questions,
    "answer": answers,
    "contexts": contexts,
    "ground_truth": ground_truths,
})

result = evaluate(dataset, metrics=[faithfulness, answer_relevancy, context_recall])
print(result)
# {'faithfulness': 0.87, 'answer_relevancy': 0.91, 'context_recall': 0.78}

# faithfulness < 0.8 → hallucination problem
# context_recall < 0.7 → retrieval problem (embedding model or chunk size)
# answer_relevancy < 0.8 → prompt or generation problem

# --- DeepEval: comprehensive evaluation ---
from deepeval import evaluate
from deepeval.metrics import GEval, AnswerRelevancyMetric, FaithfulnessMetric
from deepeval.test_case import LLMTestCase

test_case = LLMTestCase(
    input="What are the symptoms of diabetes?",
    actual_output=llm_response,
    expected_output="Frequent urination, excessive thirst...",
    retrieval_context=["Medical document about diabetes..."],
)

metric = GEval(
    name="Correctness",
    criteria="The output must be medically accurate and complete.",
    evaluation_steps=["Check factual accuracy", "Check completeness"],
    threshold=0.8,
)

results = evaluate([test_case], [metric])
\`\`\`

## LLM-as-Judge

\`\`\`python
# Use a powerful LLM to evaluate outputs from a weaker LLM
# Cost-effective for semantic quality at scale

from openai import OpenAI
client = OpenAI()

def judge_response(question: str, response: str, reference: str) -> dict:
    judge_prompt = f"""You are an expert evaluator. Rate the following response.

Question: {question}
Response: {response}
Reference Answer: {reference}

Evaluate on:
1. Correctness (0-10): Is the response factually accurate?
2. Completeness (0-10): Does it address all aspects?
3. Conciseness (0-10): Is it appropriately brief?

Return JSON: {{"correctness": N, "completeness": N, "conciseness": N, "reasoning": "..."}}"""

    result = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": judge_prompt}],
        response_format={"type": "json_object"},
    )
    return json.loads(result.choices[0].message.content)

# Scale across your eval set:
eval_results = [
    judge_response(q, r, ref)
    for q, r, ref in zip(questions, responses, references)
]

# Aggregate:
avg_correctness = sum(r['correctness'] for r in eval_results) / len(eval_results)
print(f"Average correctness: {avg_correctness:.1f}/10")

# Bias note: LLM judges prefer longer, more confident answers
# Mitigate: randomize order of compared answers, use multiple judge models
\`\`\`

## Cost Optimization

\`\`\`python
import hashlib
import json
from functools import lru_cache

# --- Semantic caching (exact + approximate) ---
import redis
from sentence_transformers import SentenceTransformer

cache = redis.Redis()
encoder = SentenceTransformer('all-MiniLM-L6-v2')

def cached_llm_call(prompt: str, threshold: float = 0.95) -> str:
    # 1. Check exact match first (fast):
    cache_key = hashlib.md5(prompt.encode()).hexdigest()
    cached = cache.get(cache_key)
    if cached:
        return cached.decode()

    # 2. Check semantic similarity (approximate match):
    embedding = encoder.encode(prompt).tolist()
    # Query vector store for similar cached prompts
    similar = vector_store.similarity_search(embedding, k=1)
    if similar and similar[0].score > threshold:
        return similar[0].cached_response

    # 3. Call LLM and cache:
    response = call_llm(prompt)
    cache.setex(cache_key, 3600, response)  # expire after 1 hour
    vector_store.upsert(embedding, response)
    return response

# --- Model routing (use cheaper models for simple tasks) ---
def route_request(prompt: str, task_type: str) -> str:
    # Simple classification/extraction → GPT-3.5 or Haiku (cheap)
    if task_type in ('classify', 'extract', 'summarize_short'):
        return call_model('gpt-3.5-turbo', prompt)

    # Complex reasoning → GPT-4o or Sonnet (expensive)
    if task_type in ('analyze', 'write', 'reason'):
        return call_model('gpt-4o', prompt)

    # Very complex → o1 or Opus (most expensive)
    if task_type in ('math', 'code_complex', 'plan'):
        return call_model('o1-mini', prompt)

# Cost example:
# gpt-3.5-turbo: \$0.50/M input, \$1.50/M output
# gpt-4o:        \$5/M input,   \$15/M output
# Routing 80% of queries to 3.5 → 10x cost reduction

# --- Token optimization ---
# Compress system prompt (remove redundancy):
# Before: 2,000 token system prompt → After: 800 tokens with same quality
# Use prompt compression libraries: LLMLingua, RECOMP

# Reduce output tokens with structured output:
# "Respond with JSON: {'sentiment': 'positive/negative/neutral'}"
# vs "Analyze the sentiment of this review and explain your reasoning..."
\`\`\`

## LLM Observability

\`\`\`python
# Langfuse: open-source LLM observability
from langfuse.openai import openai as langfuse_openai

# Wrap the OpenAI client — all calls are automatically traced:
client = langfuse_openai.OpenAI()

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Explain LoRA"}],
    # Langfuse metadata:
    name="explain-concept",
    user_id="user-123",
    session_id="session-456",
    metadata={"course": "llm-engineering", "lesson": "fine-tuning"},
)

# Langfuse dashboard shows:
# - Latency per call (p50, p95, p99)
# - Token usage and cost per call
# - Error rates
# - Trace through multi-step pipelines (prompt → retrieval → generation → output)
# - Score distributions from evaluation runs

# Alternative: Helicone, Braintrust, LangSmith (LangChain's observability)

# What to monitor in production:
# 1. Latency: p95 < 3 seconds for user-facing features
# 2. Cost: cost per request × daily volume = monthly bill
# 3. Error rate: 5xx from API, context length exceeded, content policy violations
# 4. Quality: LLM-as-judge score on sample of production traffic
# 5. Cache hit rate: target > 30% for common use cases
\`\`\`

\`\`\`takeaways
["RAGAS evaluates RAG pipelines across faithfulness, answer relevancy, and context recall — run it on every pipeline change.", "LLM-as-judge scales semantic evaluation — use GPT-4o to evaluate GPT-3.5 outputs across thousands of examples.", "Route simple tasks to cheap models (GPT-3.5/Haiku) — 80% of queries are simple, routing cuts costs 5-10x.", "Semantic caching hits for paraphrased queries — exact hash + approximate similarity (cosine > 0.95) together give 30%+ hit rates.", "Compress prompts — redundant system prompts often shrink 60% with no quality loss (try LLMLingua).", "Instrument every production call with observability — you need latency, cost, and quality metrics to optimize anything."]
\`\`\`
`,
    },
  ],
};
