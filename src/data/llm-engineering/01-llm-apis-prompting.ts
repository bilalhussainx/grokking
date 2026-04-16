import { Module } from "../types";

export const module1: Module = {
  id: "llm-apis-prompting",
  title: "LLM APIs & Advanced Prompt Engineering",
  description: "OpenAI and Anthropic APIs, token economics, system prompts, chain-of-thought, structured outputs, and prompt patterns that actually work in production",
  lessons: [
    {
      id: "llm-fundamentals",
      slug: "llm-fundamentals",
      title: "LLM APIs: From First Call to Production Prompts",
      content: `# LLM Engineering: Building with Language Models

LLM engineering is the discipline of building reliable systems using large language models. The API is simple; building systems that work consistently is the hard part.

---

\`\`\`concept
{
  "title": "What LLMs Are (and Aren't)",
  "variant": "mental-model",
  "content": "An LLM is a probability distribution over the next token given prior context. It doesn't 'know' things — it pattern-matches from training data. This explains: hallucinations (plausible completions that aren't true), why it's confident when wrong, why temperature affects creativity, and why few-shot examples work (they shift the distribution toward your desired format)."
}
\`\`\`

---

## The OpenAI & Anthropic APIs

\`\`\`python
# OpenAI:
from openai import OpenAI

client = OpenAI(api_key="sk-...")  # or from env

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful data analyst."},
        {"role": "user",   "content": "Analyze this sales data: ..."},
    ],
    temperature=0.3,      # 0=deterministic, 1=creative, 2=chaotic
    max_tokens=1000,
    top_p=0.95,           # Nucleus sampling (use temperature OR top_p, not both)
    response_format={"type": "json_object"},  # Force JSON output
)

content = response.choices[0].message.content
usage   = response.usage   # input_tokens, output_tokens, total_tokens
\`\`\`

\`\`\`python
# Anthropic (Claude):
import anthropic

client = anthropic.Anthropic(api_key="sk-ant-...")

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1000,
    system="You are a helpful data analyst.",
    messages=[
        {"role": "user", "content": "Analyze this data: ..."}
    ],
    temperature=0.3,
)

content = response.content[0].text
usage   = response.usage   # input_tokens, output_tokens
\`\`\`

## Token Economics

\`\`\`python
import tiktoken   # OpenAI's tokenizer (also usable offline)

enc = tiktoken.encoding_for_model("gpt-4o")

text = "The quick brown fox jumps over the lazy dog."
tokens = enc.encode(text)
print(f"'{text}' = {len(tokens)} tokens")
# 'The quick brown fox jumps over the lazy dog.' = 9 tokens

# Rules of thumb (English):
# ~4 chars per token
# ~0.75 words per token (100 words ≈ 133 tokens)
# A page of text ≈ 750 tokens

# Cost calculation (2024 prices, approximate):
# GPT-4o:     $5/M input, $15/M output tokens
# Claude Opus: $15/M input, $75/M output tokens
# GPT-4o-mini: $0.15/M input, $0.60/M output tokens
# Llama 3.1 (via Groq): $0.59/M input, $0.79/M output tokens

# For 1M API calls, each with 1k input + 500 output tokens:
# GPT-4o: 1M × (1000 × \$5 + 500 × \$15) / 1M = \$12,500/month
# GPT-4o-mini: 1M × (1000 × \$0.15 + 500 × \$0.60) / 1M = \$450/month
# Choose model based on quality threshold, not just cheapness
\`\`\`

## Prompt Engineering Techniques

\`\`\`python
# --- 1. Chain of Thought (CoT) ---
prompt_cot = """
Analyze whether this customer review is positive, negative, or neutral.
Think step by step before concluding.

Review: "The product arrived on time and works as advertised,
         but the customer service was dismissive when I had a question."

Let's think step by step:
1. What positive aspects are mentioned?
2. What negative aspects are mentioned?
3. What is the overall sentiment?

Conclusion:
"""
# Adding "Let's think step by step" improves accuracy on complex tasks by ~20%

# --- 2. Few-Shot Prompting ---
prompt_few_shot = """
Classify the following customer messages as: SUPPORT, BILLING, FEATURE_REQUEST, or OTHER.

Message: "I can't log into my account" → SUPPORT
Message: "When will my invoice be sent?" → BILLING
Message: "Would love a dark mode option" → FEATURE_REQUEST
Message: "Great product, thanks!" → OTHER

Message: "My credit card was charged twice" →
"""
# Few-shot examples shift the model toward your desired format and classification logic

# --- 3. Structured Output (JSON) ---
prompt_structured = """
Extract the following information from the job posting and return as JSON:

Job Posting: "Senior Python Engineer at TechCorp, San Francisco.
5+ years Python required. Salary range \$150k-\$200k. Remote-friendly."

Return JSON with these fields:
{
  "title": string,
  "company": string,
  "location": string,
  "required_skills": string[],
  "experience_years": number,
  "salary_min": number | null,
  "salary_max": number | null,
  "remote": boolean
}
"""
# Always use response_format={"type": "json_object"} when expecting JSON

# --- 4. Role + Context + Task + Format ---
# The best prompts have four components:
system_prompt = """
Role: You are a senior TypeScript code reviewer with 10 years of experience.
Your reviews are thorough, constructive, and prioritize security and maintainability.

Context: The code below is part of a financial services API.
Strict TypeScript, no 'any' types, SOC2 compliance required.

Task: Review the provided function for:
1. Type safety issues
2. Security vulnerabilities
3. Performance concerns
4. Code clarity

Format: Return a JSON object with:
{
  "issues": [{"severity": "critical|high|medium|low", "description": string, "line": number, "fix": string}],
  "overall_score": 1-10,
  "summary": string
}
"""
\`\`\`

## Streaming Responses

\`\`\`python
# Streaming: show tokens as they arrive (critical for UX)

# OpenAI streaming:
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Write a short story."}],
    stream=True,
)

for chunk in stream:
    delta = chunk.choices[0].delta
    if delta.content:
        print(delta.content, end="", flush=True)

# FastAPI streaming endpoint:
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

@app.post("/chat")
async def chat(request: ChatRequest):
    async def generate():
        stream = client.chat.completions.create(
            model="gpt-4o",
            messages=request.messages,
            stream=True,
        )
        for chunk in stream:
            delta = chunk.choices[0].delta
            if delta.content:
                yield f"data: {json.dumps({'content': delta.content})}\\n\\n"
        yield "data: [DONE]\\n\\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
\`\`\`

\`\`\`takeaways
["Temperature 0 = deterministic (same output for same input). Use for extraction/classification. Temperature 0.7-1 = creative. Never use > 1 in production.", "Chain of thought: 'Let's think step by step' or 'Think through this before answering' — improves accuracy on multi-step reasoning tasks", "Few-shot examples are the most reliable way to control output format — 3-5 examples usually suffice", "response_format={'type': 'json_object'} forces JSON output — still validate with Pydantic, models can produce invalid JSON", "Stream responses for chat UI — users perceive streaming as faster even if total time is similar", "Token cost math: input tokens cheap, output tokens 3-5x more expensive. Optimize prompts to minimize unnecessary output."]
\`\`\`
`,
    },
  ],
};
