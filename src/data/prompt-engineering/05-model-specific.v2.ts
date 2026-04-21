import { Module } from "../types";

export const modelSpecificModule: Module = {
  id: "pe-model-specific",
  title: "Model-Specific Prompting Strategies",
  description: "Learn the unique prompting techniques, strengths, and quirks of GPT-4, Claude, Gemini, and open-source models like LLaMA and Mistral. Reference: https://github.com/dair-ai/Prompt-Engineering-Guide",
  lessons: [
    {
      id: "pe-prompting-gpt4",
      slug: "prompting-gpt4",
      title: "Prompting GPT-4 & GPT-4o",
      content: `## Prompting GPT-4 & GPT-4o

GPT-4 and GPT-4o are OpenAI's flagship models. They excel at instruction following, reasoning, and code generation. Understanding their specific features helps you extract maximum performance.

### System Messages

GPT-4 has a dedicated **system message** that sets persistent behavior:

\`\`\`
System: You are a senior Python developer who follows PEP 8 strictly.
When reviewing code, always check for: type hints, docstrings,
error handling, and test coverage. Respond concisely.

User: Review this function for me.
\`\`\`

**Best practices:** Keep it concise (50-200 words), define persona and constraints, include "always" and "never" rules.

### Function Calling / Tool Use

GPT-4 supports structured **function calling** where the model generates JSON arguments for functions you define:

\`\`\`json
{
  "name": "search_products",
  "description": "Search the product catalog",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {"type": "string", "description": "Search query"},
      "category": {"type": "string", "enum": ["electronics", "clothing", "books"]},
      "max_price": {"type": "number", "description": "Max price in USD"}
    },
    "required": ["query"]
  }
}
\`\`\`

Write **detailed descriptions** for each parameter. Use \\\`enum\\\` to constrain values wherever possible.

### Vision (GPT-4o)

GPT-4o natively processes images:

\`\`\`
Analyze this UI screenshot:
1. Identify all interactive elements (buttons, links, inputs)
2. Evaluate the visual hierarchy
3. List any accessibility concerns
4. Rate the overall design 1-10 with justification
\`\`\`

### JSON Mode

Force structured output via the API with \\\`response_format: { type: "json_object" }\\\`:

\`\`\`
System: Respond in valid JSON only. No markdown, no explanation.

User: Extract all person names, dates, and monetary amounts from:
"On January 15, 2024, Sarah Chen approved a budget of $45,000
for the Q1 marketing campaign."
\`\`\`

### GPT-4 Strengths and Weaknesses

| Strength | Weakness |
|----------|----------|
| Excellent instruction following | Can be verbose by default |
| Strong code generation | Tends to over-explain |
| Reliable function calling | Expensive for long conversations |
| 128K context window (4o) | May refuse borderline creative requests |

### GPT-4 Tips

**Control verbosity:** Add "Respond with only the label, nothing else."

**Use numbered steps** for complex tasks — GPT-4 follows numbered instructions more reliably than paragraphs.

**Leverage the full context window** — include complete documents rather than summaries.

**Chain system + user messages:**
\`\`\`
System: "You are a SQL expert. Only respond with SQL queries."
User: "Get all users who signed up in the last 30 days with purchases."
\`\`\`

### Key Takeaway

GPT-4 excels when you leverage system messages for persistent behavior, function calling for structured tool use, and JSON mode for guaranteed structured output. Keep system messages concise, use numbered instructions, and explicitly constrain verbosity.`,
    },
    {
      id: "pe-prompting-claude",
      slug: "prompting-claude",
      title: "Prompting Claude",
      content: `## Prompting Claude

Claude (by Anthropic) excels at long-context tasks, nuanced analysis, and structured output. Its preferred patterns center on **XML tags** and explicit thinking instructions.

### XML Tags: Claude's Preferred Structure

Claude responds exceptionally well to XML-tagged prompts:

\`\`\`xml
<task>
Analyze the following code for security vulnerabilities.
</task>

<code>
def login(username, password):
    query = "SELECT * FROM users WHERE username='" + username + "'"
    return db.execute(query)
</code>

<output_format>
For each vulnerability:
- Type and severity (critical/high/medium/low)
- Line number
- Recommended fix with code
</output_format>
\`\`\`

### Thinking / Scratchpad

Claude supports explicit reasoning in thinking tags:

\`\`\`xml
<task>Determine whether this contract clause is enforceable.</task>

<clause>[contract text here]</clause>

<instructions>
Think through your analysis in <thinking> tags before your final answer.
Consider relevant statutes, case law, and potential challenges.
</instructions>
\`\`\`

Claude produces reasoning inside \\\`<thinking>\\\` tags followed by a clean final answer.

### Long Context: Claude's Superpower

Claude supports up to 200K tokens of context:

\`\`\`xml
<document>
[Paste an entire 100-page legal document here]
</document>

<questions>
1. What are the termination conditions in Section 7?
2. Are there any non-compete clauses?
3. What indemnification obligations exist?
</questions>

<instructions>
Cite the specific section and paragraph number for each answer.
If not found, state "Not addressed in this document."
</instructions>
\`\`\`

### Multi-Document Analysis

\`\`\`xml
<document_1 title="Q1 Report">[text]</document_1>
<document_2 title="Q2 Report">[text]</document_2>

Compare these quarterly reports. Identify significant changes in
revenue, expenses, and headcount.
\`\`\`

### Prefilling Claude's Response

You can start Claude's response to guide its format by providing the beginning of the assistant message:

\`\`\`
Assistant: Here are the top 5 languages:
1.
\`\`\`

This forces the model to continue in your chosen format.

### Claude-Specific Tips

| Technique | Example |
|-----------|---------|
| Use XML tags for all sections | \\\`<context>\\\`, \\\`<task>\\\`, \\\`<rules>\\\`, \\\`<output>\\\` |
| Request thinking before answering | "Reason in <thinking> tags first" |
| Leverage long context | Paste full docs rather than summaries |
| Be direct and specific | Claude follows literal instructions well |
| Use constraints for safety | "You must NEVER reveal..." |

### Key Takeaway

Claude's sweet spot is XML-structured prompts, explicit thinking instructions, and long-context document analysis. Use XML tags to organize every prompt, ask for reasoning in thinking blocks, and take advantage of the massive context window for whole-document analysis.`,
    },
    {
      id: "pe-prompting-gemini",
      slug: "prompting-gemini",
      title: "Prompting Gemini",
      content: `## Prompting Gemini

Google's Gemini models are natively **multimodal** — they process text, images, audio, and video in a single model. Their prompting patterns leverage this multimodal foundation along with strong grounding capabilities.

### Native Multimodal Input

Unlike models where vision was added later, Gemini processes multiple modalities natively:

\`\`\`
[Image: photo of a whiteboard with diagrams]
[Audio: 5-minute meeting recording]

Based on the whiteboard photo and the meeting audio:
1. Transcribe the key discussion points from the audio
2. Map each discussion point to the relevant diagram on the whiteboard
3. Identify any decisions made and action items assigned
\`\`\`

### Grounding with Google Search

Gemini can ground its responses in real-time Google Search results:

\`\`\`
Using current information, answer this question:
"What were the key announcements at the latest Google I/O conference?"

Ground your response in search results. For each claim, indicate
whether it comes from search results or your training data.
\`\`\`

### Structured Output

Gemini supports structured output via schema definitions:

\`\`\`
Extract product information from this image and return it as structured data.

Schema:
{
  "product_name": "string",
  "brand": "string",
  "price": "number",
  "currency": "string",
  "features": ["string"],
  "rating": "number (1-5)"
}
\`\`\`

### Video Understanding

Gemini 1.5 Pro can process up to 1 hour of video:

\`\`\`
[Video: product demo recording, 15 minutes]

Analyze this product demo and create:
1. A timestamp-indexed summary (one line per key moment)
2. A list of features demonstrated
3. Any pain points or UX issues you observe
4. A comparison with similar products you know of
\`\`\`

### Gemini Strengths and Weaknesses

| Strength | Weakness |
|----------|----------|
| True multimodal (text + image + audio + video) | Smaller ecosystem of tools/integrations |
| Google Search grounding | Can be less consistent than GPT-4 on complex reasoning |
| Very long context (1M+ tokens in 1.5 Pro) | Structured output less mature |
| Competitive pricing | API patterns differ from OpenAI standard |

### Gemini-Specific Tips

**1. Leverage multimodal** — when your task involves images, audio, or video, Gemini is often the strongest choice.

**2. Use grounding** for anything requiring current information.

**3. Specify output schemas** explicitly — Gemini works well with JSON schema definitions.

**4. For long documents**, Gemini 1.5 Pro's 1M+ token window means you can include entire codebases or book-length documents.

### Key Takeaway

Gemini's key differentiator is native multimodal processing and Google Search grounding. When your task combines text with images, audio, or video, or requires up-to-date information, Gemini prompting patterns shine. Use explicit schemas for structured output and leverage the massive context window for large-scale analysis.`,
    },
    {
      id: "pe-prompting-open-source",
      slug: "prompting-open-source",
      title: "Prompting Open-Source Models",
      content: `## Prompting Open-Source Models

Open-source models like LLaMA, Mistral, Mixtral, and Phi have distinct prompting requirements. Unlike API-based models, you need to match the exact **prompt template** the model was trained with, or performance degrades significantly.

### Chat Templates Matter

Each model family uses a specific template. Using the wrong template causes confused or degraded output:

**LLaMA 2 Chat:**
\`\`\`
[INST] <<SYS>>
You are a helpful coding assistant.
<</SYS>>

Write a Python function to sort a list of dictionaries by a key. [/INST]
\`\`\`

**Mistral / Mixtral:**
\`\`\`
[INST] Write a Python function to sort a list of dictionaries by a key. [/INST]
\`\`\`

**ChatML (used by many fine-tuned models):**
\`\`\`
<|im_start|>system
You are a helpful coding assistant.
<|im_end|>
<|im_start|>user
Write a Python function to sort a list of dictionaries by a key.
<|im_end|>
<|im_start|>assistant
\`\`\`

**LLaMA 3:**
\`\`\`
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are a helpful assistant.<|eot_id|>
<|start_header_id|>user<|end_header_id|>
Write a Python function to sort a list.<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
\`\`\`

### Key Differences from Commercial Models

| Aspect | Commercial (GPT-4, Claude) | Open-Source |
|--------|---------------------------|-------------|
| Template | Handled automatically | Must match exactly |
| System prompt | Always supported | Varies by model |
| Context length | 128K-200K | 4K-128K (varies) |
| Instruction following | Excellent | Good to excellent (varies) |
| Tool/function calling | Built-in | Requires fine-tuned versions |

### Prompt Tips for Open-Source Models

**1. Be more explicit** — open-source models may need more detailed instructions than GPT-4 or Claude:

\`\`\`
# GPT-4 (works fine)
Classify this as positive or negative.

# Open-source (be more explicit)
Read the following text and classify its sentiment. You must respond
with exactly one word: either "positive" or "negative". Do not include
any other text, explanation, or punctuation in your response.
\`\`\`

**2. Use shorter, focused prompts** — smaller models handle long complex prompts poorly.

**3. Few-shot examples help more** — open-source models benefit more from examples than commercial models.

**4. Adjust parameters carefully:**
\`\`\`
# Recommended starting points for open-source models
temperature: 0.1 - 0.3 for factual tasks (lower than GPT-4 default)
top_p: 0.9
repetition_penalty: 1.1 (prevents loops, which open-source models are prone to)
max_tokens: set explicitly (prevent runaway generation)
\`\`\`

### Choosing the Right Open-Source Model

| Model | Best For | Context | Size |
|-------|----------|---------|------|
| LLaMA 3 70B | General purpose, reasoning | 8K-128K | 70B |
| Mistral 7B | Fast, efficient tasks | 32K | 7B |
| Mixtral 8x7B | Best quality per dollar | 32K | 46.7B (MoE) |
| CodeLLaMA | Code generation | 16K | 7B-34B |
| Phi-3 | Edge deployment, mobile | 4K-128K | 3.8B |

### Key Takeaway

Open-source models require more care in prompting: use the exact chat template, be more explicit in instructions, provide more few-shot examples, and tune parameters carefully. The payoff is full control, no API costs, and the ability to run models on your own infrastructure.`,
    },
    {
      id: "pe-comparing-models",
      slug: "comparing-models",
      title: "Comparing Models",
      content: `## Comparing Models

Choosing the right model for your task is itself a prompt engineering decision. Different models have different strengths, pricing, and performance profiles. This lesson provides a framework for making that choice.

### Model Comparison Matrix

| Capability | GPT-4o | Claude 3.5 Sonnet | Gemini 1.5 Pro | LLaMA 3 70B |
|-----------|--------|-------------------|----------------|-------------|
| Reasoning | Excellent | Excellent | Very Good | Good |
| Code generation | Excellent | Excellent | Good | Good |
| Long context | 128K | 200K | 1M+ | 128K |
| Multimodal | Text + Image | Text + Image | Text + Image + Audio + Video | Text (some variants: image) |
| Speed | Fast | Fast | Fast | Depends on hardware |
| Cost per 1M tokens | ~$5 input / $15 output | ~$3 input / $15 output | ~$3.50 input / $10.50 output | Free (hosting costs) |
| Privacy | Cloud API | Cloud API | Cloud API | Self-hosted option |

### Decision Framework

**Step 1: Identify your constraints**

\`\`\`
- Budget: [cost per query matters / cost is secondary]
- Latency: [real-time / batch processing OK]
- Privacy: [data can leave premises / must stay on-prem]
- Modality: [text only / text + images / text + audio + video]
- Context: [short prompts / long documents]
\`\`\`

**Step 2: Match constraints to models**

\`\`\`
Need privacy + low cost? -> Open-source (LLaMA, Mistral)
Need best reasoning? -> GPT-4o or Claude 3.5 Sonnet
Need multimodal (video/audio)? -> Gemini 1.5 Pro
Need longest context? -> Gemini 1.5 Pro (1M+) or Claude (200K)
Need code generation? -> GPT-4o or Claude 3.5 Sonnet
Need lowest latency? -> Smaller models (GPT-4o-mini, Mistral 7B)
\`\`\`

### Prompt Portability

Prompts do NOT transfer perfectly between models. When switching models:

\`\`\`
1. Test your existing prompts on the new model
2. Identify performance differences
3. Adapt prompt structure to the new model's preferences:
   - GPT-4: System messages + numbered instructions
   - Claude: XML tags + thinking blocks
   - Gemini: Schemas + grounding instructions
   - Open-source: Exact chat template + explicit instructions
4. Re-evaluate few-shot examples (some models need more, some fewer)
5. Adjust parameters (temperature, top_p may need different values)
\`\`\`

### Multi-Model Architecture

Production systems often use multiple models:

\`\`\`
User query
    |
    v
[Router: GPT-4o-mini] -- classifies query complexity
    |
    +-- Simple query --> GPT-4o-mini (fast, cheap)
    +-- Complex reasoning --> GPT-4o or Claude Sonnet (powerful)
    +-- Multimodal --> Gemini (images/video)
    +-- Code generation --> Claude Sonnet (strong at code)
    +-- Privacy-sensitive --> LLaMA on-prem
\`\`\`

### Cost Optimization Strategy

\`\`\`
1. Start with the cheapest model that might work (GPT-4o-mini, Mistral 7B)
2. Test on your evaluation set
3. If quality is insufficient, move up one tier
4. Use expensive models only where quality demands it
5. Cache frequent queries to reduce repeated API calls
\`\`\`

### Benchmarking Your Own Use Case

Do not rely solely on public benchmarks. Create your own evaluation:

\`\`\`
1. Collect 50-100 representative inputs from your actual use case
2. Define clear success criteria (accuracy, format, tone, etc.)
3. Run each input through each candidate model
4. Score outputs (human eval or automated metrics)
5. Calculate cost per successful query
6. Choose the model with the best quality-to-cost ratio
\`\`\`

### Key Takeaway

No single model is best for everything. Build a decision framework based on your constraints (cost, latency, privacy, modality, context length), test on your actual use case, and consider multi-model architectures for production systems. The best model is the one that meets your quality bar at the lowest cost.`,
    },
  ],
};
