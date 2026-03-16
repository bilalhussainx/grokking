import { Module } from "../types";

const templatesContent = `## Prompt Templates & Management

In production, prompts are not one-off strings — they are **versioned, tested, and managed assets**. This lesson covers the systems and practices for managing prompts at scale.

### Why Prompt Management Matters

A typical production AI application might have:
- 10-50 different prompts (system prompts, templates, few-shot examples)
- Multiple environments (dev, staging, production)
- Multiple model versions being tested simultaneously
- Prompts that change weekly based on user feedback

Without a management system, this becomes chaotic quickly.

### Prompt Template Pattern

Separate the static structure from dynamic variables:

\`\`\`python
# prompt_templates/classification.py

CLASSIFICATION_TEMPLATE = """You are a {role} specializing in {domain}.

Classify the following text into one of these categories: {categories}

Rules:
{rules}

Text: {input_text}

Output format: {output_format}"""

# Usage
prompt = CLASSIFICATION_TEMPLATE.format(
    role="content moderator",
    domain="social media posts",
    categories="safe, warning, violation",
    rules="- Political opinions are safe\\n- Threats are violations",
    input_text=user_input,
    output_format='{"category": "...", "confidence": 0.0-1.0}'
)
\`\`\`

### Prompt Versioning

Track prompt changes like code changes:

\`\`\`
prompts/
  classification/
    v1.0.txt    # Original prompt
    v1.1.txt    # Added edge case handling
    v2.0.txt    # Major rewrite for new model
    metadata.json
\`\`\`

\`\`\`json
{
  "current_version": "v2.0",
  "model": "gpt-4o",
  "last_updated": "2024-03-15",
  "author": "prompt-eng-team",
  "accuracy_on_test_set": 0.94,
  "changelog": [
    {"version": "v2.0", "change": "Restructured for GPT-4o, added JSON mode"},
    {"version": "v1.1", "change": "Added handling for multilingual input"},
    {"version": "v1.0", "change": "Initial prompt"}
  ]
}
\`\`\`

### A/B Testing Prompts

Run multiple prompt versions simultaneously:

\`\`\`python
# Pseudocode for prompt A/B testing
import random

def get_prompt(user_id, task):
    # Deterministic assignment based on user_id
    variant = "A" if hash(user_id) % 2 == 0 else "B"

    prompts = {
        "A": PROMPT_V1,  # Current production prompt
        "B": PROMPT_V2,  # Candidate prompt
    }

    # Log which variant was used
    log_experiment(user_id, task, variant)

    return prompts[variant]
\`\`\`

### Prompt Registry Pattern

Centralize all prompts in a registry:

\`\`\`python
# prompt_registry.py
REGISTRY = {
    "classify_support_ticket": {
        "template": "...",
        "model": "gpt-4o",
        "temperature": 0,
        "max_tokens": 100,
        "version": "2.1",
    },
    "summarize_document": {
        "template": "...",
        "model": "claude-3-sonnet",
        "temperature": 0.3,
        "max_tokens": 500,
        "version": "1.3",
    },
}

def get_prompt(task_name):
    config = REGISTRY[task_name]
    return config
\`\`\`

### Environment-Specific Prompts

\`\`\`
Development:  Use verbose prompts with debug output
Staging:      Match production prompts, test with real-like data
Production:   Optimized prompts, minimal token usage
\`\`\`

### Key Takeaway

Treat prompts as first-class software artifacts. Version them, test them, A/B test variants, and manage them through a registry. The discipline you apply to code deployment should apply equally to prompt deployment.`;

const evaluationContent = `## Evaluation & Benchmarking

How do you know if your prompt is good? Evaluation is the discipline of **measuring prompt quality** systematically, moving from "it seems to work" to "it works 94% of the time on our test set."

### The Evaluation Pipeline

\`\`\`
1. Define success criteria (what does "good output" mean?)
2. Build a test set (representative inputs with expected outputs)
3. Run the prompt against the test set
4. Score each output (automated metrics + human eval)
5. Aggregate scores and identify failure patterns
6. Iterate on the prompt to fix failures
7. Retest to confirm improvements
\`\`\`

### Building a Test Set

A good test set includes:

\`\`\`
- 50-100 examples minimum (more for high-stakes tasks)
- Diverse inputs covering the full range of expected use
- Edge cases that are likely to cause failures
- Adversarial inputs that try to break the prompt
- Clear expected outputs for each input
\`\`\`

Example test set structure:

\`\`\`json
[
  {
    "id": "test_001",
    "input": "The product is decent but overpriced",
    "expected_output": "mixed",
    "tags": ["edge_case", "multi-sentiment"],
    "difficulty": "medium"
  },
  {
    "id": "test_002",
    "input": "",
    "expected_output": "invalid_input",
    "tags": ["edge_case", "empty_input"],
    "difficulty": "easy"
  }
]
\`\`\`

### Automated Metrics

| Metric | Best For | How It Works |
|--------|----------|--------------|
| Exact match | Classification, extraction | Output matches expected exactly |
| F1 score | Classification | Precision-recall balance |
| BLEU/ROUGE | Summarization, translation | N-gram overlap with reference |
| Semantic similarity | Open-ended generation | Embedding cosine similarity |
| Pass rate | Code generation | Code compiles and passes tests |
| Format compliance | Structured output | Valid JSON, correct schema |

### LLM-as-Judge

Use a separate LLM to evaluate outputs:

\`\`\`
You are an expert evaluator. Rate the following AI response on a scale of 1-5 for each criterion:

Original question: {question}
AI response: {response}
Reference answer: {reference}

Criteria:
1. Accuracy (1-5): Is the information correct?
2. Completeness (1-5): Does it address all parts of the question?
3. Clarity (1-5): Is the response clear and well-structured?
4. Conciseness (1-5): Is it appropriately brief without losing important details?

Provide scores and one-sentence justifications for each.
\`\`\`

### Failure Analysis

When outputs fail, categorize the failure:

\`\`\`
Failure categories:
- WRONG_ANSWER: Factually incorrect
- WRONG_FORMAT: Correct answer, wrong structure
- INCOMPLETE: Missing required information
- HALLUCINATION: Contains fabricated information
- OFF_TOPIC: Does not address the question
- REFUSAL: Model refuses when it should not
- OVERGENERATION: Too verbose, includes unnecessary content
\`\`\`

### Regression Testing

After modifying a prompt, always re-run the full test set:

\`\`\`
v1.0 accuracy: 87% (baseline)
v1.1 accuracy: 91% (improved edge case handling)
v1.2 accuracy: 89% (regression! new change broke something)
  -> Analyze: Which test cases regressed?
  -> Fix: Adjust prompt to handle both old and new cases
v1.3 accuracy: 93% (fixed regression + kept improvements)
\`\`\`

### Key Takeaway

Evaluation transforms prompt engineering from guesswork into engineering. Build test sets, measure with automated metrics and LLM-as-judge, categorize failures, and regression test every change. The teams that evaluate systematically build the best prompts.`;

const costContent = `## Cost Optimization

LLM API costs can escalate quickly at scale. Prompt engineering plays a direct role in cost optimization — every token in your prompt and response costs money.

### Understanding Token Economics

\`\`\`
Cost = (input_tokens x input_price) + (output_tokens x output_price)

Example (GPT-4o):
- Input: $5 per 1M tokens
- Output: $15 per 1M tokens

A prompt with 500 input tokens + 200 output tokens:
- Cost per call: (500 x $0.000005) + (200 x $0.000015) = $0.0055
- At 100,000 calls/day: $550/day = $16,500/month
\`\`\`

### Strategy 1: Prompt Compression

Reduce input tokens without losing effectiveness:

\`\`\`
# Verbose (87 tokens)
You are a highly skilled and experienced sentiment analysis expert.
Your task is to carefully read the following text and determine
whether the overall sentiment expressed is positive, negative,
or neutral. Please provide your classification.

# Compressed (23 tokens)
Classify sentiment as positive/negative/neutral. Output the label only.
\`\`\`

Same accuracy, 74% fewer tokens.

### Strategy 2: Model Tiering

Use expensive models only when needed:

\`\`\`python
# Pseudocode: Route by complexity
def process_query(query):
    complexity = classify_complexity(query)  # cheap, fast model

    if complexity == "simple":
        return call_model("gpt-4o-mini", query)    # $0.15/1M input
    elif complexity == "medium":
        return call_model("gpt-4o", query)          # $5/1M input
    else:
        return call_model("claude-opus", query)      # $15/1M input
\`\`\`

### Strategy 3: Caching

Cache responses for repeated or similar queries:

\`\`\`python
import hashlib

def get_response(prompt):
    # Create a cache key from the prompt
    cache_key = hashlib.sha256(prompt.encode()).hexdigest()

    # Check cache first
    cached = cache.get(cache_key)
    if cached:
        return cached  # Free!

    # Call API only on cache miss
    response = llm.complete(prompt)
    cache.set(cache_key, response, ttl=3600)  # Cache for 1 hour
    return response
\`\`\`

### Strategy 4: Constrain Output Length

\`\`\`
# Unconstrained (might generate 500 tokens)
"Explain the benefits of microservices architecture."

# Constrained (generates ~50 tokens)
"List 3 benefits of microservices architecture. One sentence each. No introduction or conclusion."
\`\`\`

Also use the \\\`max_tokens\\\` API parameter as a hard cap.

### Strategy 5: Batch Processing

\`\`\`
# Expensive: 10 separate API calls
for item in items:
    result = classify(item)

# Cheaper: 1 API call with batch prompt
"Classify each of the following 10 items. Return a JSON array."
[all 10 items in one prompt]
\`\`\`

### Cost Comparison Table

| Strategy | Token Reduction | Implementation Effort |
|----------|----------------|----------------------|
| Prompt compression | 30-70% input | Low |
| Model tiering | 60-90% cost | Medium |
| Response caching | 50-95% calls | Medium |
| Output constraints | 30-60% output | Low |
| Batch processing | 20-40% overhead | Low |

### Monitoring Costs

Track these metrics:

\`\`\`
- Cost per query (average and P95)
- Tokens per query (input and output separately)
- Cache hit rate
- Model tier distribution
- Cost per successful query (exclude failures)
\`\`\`

### Key Takeaway

Cost optimization is not about using the cheapest model everywhere — it is about using the right model at the right time with the right prompt length. Compress prompts, tier models by complexity, cache repeated queries, constrain output length, and batch when possible. Monitor continuously to catch cost spikes early.`;

const buildingContent = `## Building LLM Applications

Prompt engineering is the foundation of every LLM application — from simple chatbots to complex autonomous agents. This lesson covers the architectural patterns for building production LLM systems.

### The Application Spectrum

\`\`\`
Simple                                          Complex
|-------|---------|---------|---------|---------|
Single    Prompt    RAG      Agent    Multi-Agent
Prompt    Chain     System   + Tools  Orchestration
\`\`\`

### Pattern 1: Tool-Using Agents

Agents combine reasoning with tool execution:

\`\`\`
You are a data analyst assistant with access to these tools:

1. query_database(sql) - Execute a SQL query
2. create_chart(data, chart_type, title) - Generate a visualization
3. send_email(to, subject, body) - Send an email

Process: Think step by step about what tools to use.

User: "Show me a chart of monthly revenue for 2024 and email it to the CFO."

Step 1: I need to query the database for monthly revenue data.
Action: query_database("SELECT month, SUM(revenue) FROM sales
        WHERE year=2024 GROUP BY month ORDER BY month")

Step 2: Create a visualization from the data.
Action: create_chart(query_results, "bar", "Monthly Revenue 2024")

Step 3: Email the chart to the CFO.
Action: send_email("cfo@company.com", "Monthly Revenue 2024", chart_attachment)
\`\`\`

### Pattern 2: Workflow Orchestration

Chain multiple specialized prompts:

\`\`\`
User submits a support ticket
    |
    v
[Classifier Agent] -> Categorize ticket (billing/technical/account)
    |
    v
[Router] -> Route to specialized agent
    |
    +-- Billing Agent (system prompt: billing expert, access to payment tools)
    +-- Technical Agent (system prompt: engineer, access to logs/diagnostics)
    +-- Account Agent (system prompt: account specialist, access to user DB)
    |
    v
[Quality Agent] -> Review response before sending to customer
    |
    v
[Response delivered]
\`\`\`

### Pattern 3: Function Calling Architecture

Define functions for structured tool use:

\`\`\`json
{
  "tools": [
    {
      "name": "get_weather",
      "description": "Get current weather for a city",
      "parameters": {
        "city": {"type": "string", "required": true},
        "units": {"type": "string", "enum": ["celsius", "fahrenheit"]}
      }
    },
    {
      "name": "book_restaurant",
      "description": "Make a restaurant reservation",
      "parameters": {
        "restaurant": {"type": "string", "required": true},
        "date": {"type": "string", "format": "YYYY-MM-DD", "required": true},
        "party_size": {"type": "integer", "required": true}
      }
    }
  ]
}
\`\`\`

The model decides which function to call based on the user's request and generates the appropriate arguments.

### Pattern 4: Guardrailed Applications

Wrap your core logic in safety layers:

\`\`\`
[Input Validation]
    - Check for injection attempts
    - Validate input format
    - Rate limiting
        |
        v
[Core LLM Processing]
    - System prompt with safety rules
    - Task execution
        |
        v
[Output Validation]
    - Check for PII leakage
    - Verify format compliance
    - Content safety check
        |
        v
[Logging & Monitoring]
    - Log prompt, response, latency, cost
    - Alert on anomalies
\`\`\`

### Pattern 5: Human-in-the-Loop

\`\`\`
[AI generates draft] -> [Confidence check]
    |                        |
    |                  High confidence -> Auto-deliver
    |                        |
    |                  Low confidence -> Queue for human review
    |                        |
    |                  Human approves/edits -> Deliver
    |                        |
    +-- Human feedback fed back to improve prompts
\`\`\`

### Architecture Best Practices

| Practice | Why |
|----------|-----|
| Separate prompts from application code | Enables independent iteration |
| Log every LLM call (input + output) | Essential for debugging and improvement |
| Implement graceful degradation | Fallback when LLM is slow or down |
| Use structured output (JSON) | Easier to parse and integrate |
| Version your prompts | Track what changed and when |
| Monitor latency, cost, and quality | Catch issues before users do |

### Key Takeaway

Building LLM applications is about combining prompt engineering with software engineering patterns. Use tool-calling agents for interactive tasks, workflow orchestration for complex multi-step processes, and guardrailed architectures for safety. Always log, monitor, and iterate on your prompts based on real-world performance data.`;

const caseStudiesContent = `## Case Studies: Prompt Engineering at Scale

This lesson examines how leading organizations apply prompt engineering in production, revealing patterns and lessons learned from deploying LLMs at scale.

### Case Study 1: Customer Support Automation

**The Challenge:** A SaaS company receives 50,000 support tickets per month. Human agents handle all of them, with an average resolution time of 4 hours.

**The Prompt Engineering Solution:**

\`\`\`
Tier 1 - Auto-Resolve (prompt-based):
System: "You are a support agent for [Product]. Using the knowledge base
provided, answer the customer's question. If you are more than 90%
confident in your answer, provide it directly. If less confident,
escalate to a human agent."

Tier 2 - Agent Assist (prompt-based):
System: "You are an assistant to human support agents. Given the customer's
ticket and relevant knowledge base articles, draft a response for the
agent to review and send. Include the sources you used."

Tier 3 - Human Only:
Complex issues, complaints, account modifications
\`\`\`

**Results:**
- 40% of tickets auto-resolved (Tier 1)
- 35% resolved faster with AI drafts (Tier 2)
- Average resolution time dropped from 4 hours to 1.5 hours
- Customer satisfaction maintained at 4.6/5

**Key prompt lesson:** The confidence threshold ("more than 90% confident") was critical. Without it, the system would answer questions incorrectly and create more tickets.

### Case Study 2: Code Review Automation

**The Challenge:** A development team of 200 engineers spends 30% of their time on code reviews. Many reviews catch the same common issues repeatedly.

**The Prompt Engineering Solution:**

\`\`\`
You are a senior code reviewer. Analyze the following pull request diff.

Check for:
1. Security vulnerabilities (SQL injection, XSS, auth bypass)
2. Performance issues (N+1 queries, unbounded loops, memory leaks)
3. Logic errors (off-by-one, null handling, race conditions)
4. Style violations (per team style guide provided below)

For each issue found:
- Severity: critical / warning / suggestion
- Line number and file
- Explanation of the issue
- Suggested fix (with code)

If no issues found in a category, explicitly state "No issues found."

Team style guide:
[style guide content]

Pull request diff:
[diff content]
\`\`\`

**Results:**
- Catches 85% of issues that human reviewers would find
- Reduced review time by 50%
- Developers focus on architectural and design feedback
- False positive rate: 12% (acceptable for auto-comments)

**Key prompt lesson:** Including the team's specific style guide in the prompt was essential. Generic code review prompts had a 40% false positive rate because they flagged things that were acceptable per team conventions.

### Case Study 3: Content Generation Pipeline

**The Challenge:** A media company needs to produce 500 pieces of content per week across multiple formats and channels.

**The Prompt Chain:**

\`\`\`
Step 1: Topic Generation
"Given this week's trending topics and our editorial calendar,
suggest 20 article ideas with headline, angle, and target keyword."

Step 2: Outline Generation
"Create a detailed outline for [selected topic] with sections,
key points, and suggested data/quotes to include."

Step 3: First Draft
"Write a [word count]-word article following this outline.
Match our brand voice guide: [voice description]."

Step 4: Editorial Review (LLM-as-editor)
"Review this draft for: factual accuracy, brand voice consistency,
SEO optimization, and engagement. Suggest specific improvements."

Step 5: Human Editor
Final review, fact-check, and approval
\`\`\`

**Results:**
- Content production increased 3x with the same team size
- Quality maintained (human editor as final gate)
- Time from idea to published: 2 hours (was 2 days)

**Key prompt lesson:** The multi-step chain with an LLM editorial review (Step 4) before human review reduced human editing time by 60%. The editor could focus on high-level judgment rather than fixing basic issues.

### Lessons Learned Across Case Studies

| Lesson | Detail |
|--------|--------|
| Start with human-in-the-loop | Automate incrementally as confidence grows |
| Measure before and after | Without baselines, you cannot prove value |
| Prompt iteration never stops | The best prompts are continuously improved |
| Domain-specific context matters | Generic prompts underperform by 20-40% |
| Failure modes must be defined | Know what happens when the AI is wrong |
| Cost modeling is essential | Token costs at scale can surprise you |

### Building Your Own Case Study

\`\`\`
1. Identify a high-volume, repetitive task in your organization
2. Measure current performance (time, cost, quality)
3. Build a prompt prototype and test on 50-100 real inputs
4. Calculate ROI: (time saved x hourly cost) - API costs
5. Deploy with human review, monitor quality
6. Gradually reduce human review as confidence builds
7. Document and share results
\`\`\`

### Key Takeaway

The most successful prompt engineering deployments share common patterns: they start with human-in-the-loop, use multi-step prompt chains, include domain-specific context, define explicit confidence thresholds, and iterate continuously based on real-world performance data. The prompt is never "done" — it is a living asset that improves with every deployment cycle.`;

export const productionModule: Module = {
  id: "pe-production",
  title: "Production Prompt Engineering",
  description:
    "Take prompts to production with template management, evaluation frameworks, cost optimization, application architecture, and real-world case studies. Reference: https://github.com/dair-ai/Prompt-Engineering-Guide",
  lessons: [
    {
      id: "pe-templates-management",
      slug: "templates-management",
      title: "Prompt Templates & Management",
      content: templatesContent,
    },
    {
      id: "pe-evaluation",
      slug: "evaluation",
      title: "Evaluation & Benchmarking",
      content: evaluationContent,
    },
    {
      id: "pe-cost-optimization",
      slug: "cost-optimization",
      title: "Cost Optimization",
      content: costContent,
    },
    {
      id: "pe-building-apps",
      slug: "building-apps",
      title: "Building LLM Applications",
      content: buildingContent,
    },
    {
      id: "pe-case-studies",
      slug: "case-studies",
      title: "Case Studies",
      content: caseStudiesContent,
    },
  ],
};
