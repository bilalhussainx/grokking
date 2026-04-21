import { Module } from "../types";

export const advancedModule: Module = {
  id: "pe-advanced",
  title: "Advanced Prompting Techniques",
  description: "Go beyond basics with RAG, program-aided language models, active prompting, directional stimulus, automatic prompt optimization, and multimodal prompting. Reference: https://github.com/dair-ai/Prompt-Engineering-Guide",
  lessons: [
    {
      id: "pe-rag",
      slug: "rag",
      title: "Retrieval Augmented Generation (RAG)",
      content: `## Retrieval Augmented Generation (RAG)

RAG is one of the most important patterns in production AI systems. It addresses a fundamental LLM limitation: **models only know what was in their training data**. RAG solves this by **retrieving relevant documents** at query time and including them in the prompt as context.

### The Problem RAG Solves

LLMs have a **knowledge cutoff** — they cannot answer questions about events after their training date, and they often lack domain-specific knowledge (your company docs, private databases, recent research).

\`\`\`
# Without RAG
User: "What is our company's refund policy?"
LLM: "I don't have access to your company's specific policies..." (or worse, hallucinate one)

# With RAG
[System retrieves refund-policy.pdf, injects relevant section into prompt]
User: "What is our company's refund policy?"
LLM: "According to your policy document, refunds are available within 30 days of purchase..."
\`\`\`

### The RAG Pipeline

\`\`\`
1. User asks a question
2. System converts question to an embedding (vector)
3. System searches a vector database for similar document chunks
4. Top-K relevant chunks are retrieved
5. Chunks are injected into the prompt as context
6. LLM generates an answer grounded in the retrieved context
\`\`\`

### RAG Prompt Template

\`\`\`
You are a helpful assistant. Answer the user's question using ONLY the provided context. If the context does not contain enough information to answer, say "I don't have enough information to answer this question."

Context:
---
[Retrieved Document Chunk 1]
---
[Retrieved Document Chunk 2]
---
[Retrieved Document Chunk 3]
---

Question: [User's question]

Answer:
\`\`\`

### Key Design Decisions in RAG

**1. Chunk Size**
| Size | Pros | Cons |
|------|------|------|
| Small (100-200 tokens) | Precise retrieval | May miss context |
| Medium (300-500 tokens) | Good balance | Standard choice |
| Large (500-1000 tokens) | More context per chunk | Less precise retrieval |

**2. Number of Retrieved Chunks (Top-K)**
- K=3: Minimal context, fast, low cost
- K=5-7: Good balance for most applications
- K=10+: Maximum coverage but risks diluting relevant info

**3. Retrieval Strategy**
\`\`\`
# Semantic search (embedding similarity)
query_embedding = embed("What is the refund policy?")
results = vector_db.search(query_embedding, top_k=5)

# Hybrid search (semantic + keyword)
results = search(
    semantic_query="refund policy",
    keyword_query="refund OR return OR money back",
    top_k=5
)
\`\`\`

### Preventing Hallucination in RAG

Even with retrieved context, models can still hallucinate. Use these prompt strategies:

\`\`\`
# Strategy 1: Strict grounding
"Answer ONLY based on the provided context. Do not use any outside knowledge."

# Strategy 2: Citation requirement
"For every claim in your answer, cite the specific context passage it came from using [Source N] notation."

# Strategy 3: Confidence signaling
"If you are less than 80% confident in your answer based on the provided context, prefix your response with [LOW CONFIDENCE]."
\`\`\`

### Before vs. After RAG

**Without RAG (hallucination risk):**
\`\`\`
Q: "What were our Q3 2024 revenue figures?"
A: "Based on typical industry growth, your Q3 revenue was likely around $12M..." (fabricated)
\`\`\`

**With RAG (grounded):**
\`\`\`
Q: "What were our Q3 2024 revenue figures?"
[Retrieved: quarterly-report-q3-2024.pdf, page 3]
A: "According to your Q3 2024 quarterly report, total revenue was $14.2M, representing a 15% increase over Q2." [Source: Q3 Report, p.3]
\`\`\`

### Key Takeaway

RAG is the standard approach for connecting LLMs to your own data. It retrieves relevant documents at query time, injects them as context, and grounds the model's responses in real information. The prompt template you use to frame the retrieved context is just as important as the retrieval system itself.`,
    },
    {
      id: "pe-pal",
      slug: "pal",
      title: "Program-Aided Language Models (PAL)",
      content: `## Program-Aided Language Models (PAL)

PAL, introduced by Gao et al. (2023), takes a different approach to reasoning: instead of asking the LLM to compute the answer directly, it asks the LLM to **generate a program** that computes the answer. The program is then executed by an interpreter to produce the final result.

### The Problem PAL Solves

LLMs are bad at arithmetic and precise computation. Chain-of-thought helps, but the model can still make calculation errors:

\`\`\`
# CoT attempt (error-prone)
Q: "If you invest $10,000 at 7.5% annual compound interest for 12 years, what is the final amount?"
A: "Let's think step by step... 10000 * 1.075^12 = ... approximately $23,817"
# (The model might get this wrong, especially with more complex calculations)
\`\`\`

### The PAL Approach

Instead of computing, the model writes code:

\`\`\`
Q: If you invest $10,000 at 7.5% annual compound interest for 12 years, what is the final amount?

# PAL prompt
Read the question and write a Python program to solve it. Do not compute the answer yourself.

principal = 10000
rate = 0.075
years = 12
final_amount = principal * (1 + rate) ** years
print(f"Final amount: \${final_amount:,.2f}")
\`\`\`

Run this code and you get the exact answer: **$23,817.80** — no calculation errors possible.

### PAL Prompt Template

\`\`\`
You are a problem solver that writes Python code to answer questions. Do not try to calculate the answer yourself — write a complete Python program that computes it.

Rules:
- Use only standard Python (no external libraries unless specified)
- Include comments explaining your logic
- The last line should print the final answer
- Handle edge cases

Question: [question here]

Python solution:
\`\`\`

### PAL for Complex Problems

**Word problem:**
\`\`\`
Q: A farmer has a rectangular field 120m long and 80m wide. He wants to fence it with 3 strands of wire, plus add a diagonal fence across the field. How many meters of wire does he need in total?

# Generated code
length = 120
width = 80
import math

# Perimeter with 3 strands
perimeter = 2 * (length + width)
fence_wire = perimeter * 3

# Diagonal
diagonal = math.sqrt(length**2 + width**2)

total_wire = fence_wire + diagonal
print(f"Total wire needed: {total_wire:.1f} meters")
# Output: Total wire needed: 1344.2 meters
\`\`\`

**Date calculation:**
\`\`\`
Q: How many business days are there between March 15, 2024 and June 30, 2024?

from datetime import date, timedelta

start = date(2024, 3, 15)
end = date(2024, 6, 30)
business_days = 0
current = start
while current <= end:
    if current.weekday() < 5:  # Monday=0 to Friday=4
        business_days += 1
    current += timedelta(days=1)
print(f"Business days: {business_days}")
\`\`\`

### When to Use PAL vs. CoT

| Task | Use CoT | Use PAL |
|------|---------|---------|
| Simple reasoning | Yes | Overkill |
| Math with 3+ operations | Maybe | Yes |
| Date/time calculations | No | Yes |
| Data processing | No | Yes |
| Logical arguments | Yes | No |
| String manipulation | No | Yes |

### PAL in Production

In a production system, PAL works as a two-step process:

\`\`\`
1. LLM generates code from the user's question
2. Sandbox executes the code safely
3. Output is returned to the user (or fed back to the LLM for interpretation)
\`\`\`

**Safety consideration:** Always execute generated code in a sandboxed environment. Never run LLM-generated code with access to your file system, network, or databases without strict controls.

### Key Takeaway

PAL offloads computation to code interpreters, where it belongs. LLMs are excellent at translating natural language problems into code but unreliable at doing the actual math. Use PAL for any problem involving precise calculation, data processing, or algorithmic logic.`,
    },
    {
      id: "pe-active-prompting",
      slug: "active-prompting",
      title: "Active Prompting",
      content: `## Active Prompting

Active Prompting, introduced by Diao et al. (2023), addresses a key weakness in few-shot prompting: **which examples should you use?** Instead of randomly selecting examples, active prompting uses the model's **uncertainty** to identify the most informative examples to annotate.

### The Problem

In few-shot CoT prompting, example selection significantly impacts performance. Random selection often includes easy examples that do not help the model learn, while ignoring difficult cases where guidance would matter most.

\`\`\`
# Random examples (suboptimal)
Easy: "What is 5 + 3?" -> "5 + 3 = 8" (model already knows this)
Easy: "What is 10 x 2?" -> "10 x 2 = 20" (no learning value)
Easy: "What is 100 / 4?" -> "100 / 4 = 25" (trivial)

# Active selection (optimal)
Hard: "A train leaves at 3:45 PM traveling at..." (model struggles here)
Tricky: "If 3/4 of students passed and..." (model uncertain)
Ambiguous: "The population grew by 15% then..." (model inconsistent)
\`\`\`

### How Active Prompting Works

**Step 1: Generate multiple answers per question**
For each candidate question, run the model K times (e.g., K=5) with temperature > 0:

\`\`\`
Question: "A farmer has 3 fields. The first is twice the size of the second..."
Run 1: Answer = 45 acres
Run 2: Answer = 45 acres
Run 3: Answer = 52 acres  <- disagreement!
Run 4: Answer = 45 acres
Run 5: Answer = 52 acres  <- disagreement!
\`\`\`

**Step 2: Measure uncertainty (disagreement)**
Questions where the model gives **inconsistent answers** are the most uncertain:

\`\`\`
Question A: 5/5 runs agree -> Low uncertainty (skip)
Question B: 4/5 runs agree -> Medium uncertainty
Question C: 3/5 runs agree -> High uncertainty (annotate this!)
\`\`\`

**Step 3: Annotate the most uncertain questions**
For the highest-uncertainty questions, create detailed CoT examples (either manually or with verification):

\`\`\`
Q: "A farmer has 3 fields. The first is twice the size of the second. The third is 10 acres more than the first. If the total area is 130 acres, what is each field's size?"
A: Let's define variables.
Let the second field = x acres.
First field = 2x acres.
Third field = 2x + 10 acres.
Total: x + 2x + (2x + 10) = 130
5x + 10 = 130
5x = 120
x = 24
Second field: 24 acres, First field: 48 acres, Third field: 58 acres.
\`\`\`

**Step 4: Use annotated examples as few-shot prompts**

### The Active Prompting Pipeline

\`\`\`
Pool of candidate questions
         |
    [Run model K times per question]
         |
    [Calculate uncertainty scores]
         |
    [Select top-N most uncertain]
         |
    [Human annotates CoT for these N questions]
         |
    [Use as few-shot examples]
         |
    [Deploy improved prompt]
\`\`\`

### Uncertainty Metrics

| Metric | Formula | Use When |
|--------|---------|----------|
| Disagreement | % of runs with different answers | Discrete answers (classification, numbers) |
| Entropy | -sum(p * log(p)) across answer distribution | Multiple possible answers |
| Variance | Statistical variance of numeric answers | Continuous numeric outputs |

### Practical Implementation

\`\`\`python
# Pseudocode for active prompting
from collections import Counter

def measure_uncertainty(question, model, k=5):
    answers = []
    for _ in range(k):
        response = model.complete(question, temperature=0.7)
        answer = extract_answer(response)
        answers.append(answer)

    counts = Counter(answers)
    most_common_count = counts.most_common(1)[0][1]
    uncertainty = 1 - (most_common_count / k)
    return uncertainty, answers

# Find most uncertain questions
uncertainties = []
for q in candidate_questions:
    score, answers = measure_uncertainty(q, model)
    uncertainties.append((q, score, answers))

# Select top-N for annotation
uncertain_questions = sorted(uncertainties, key=lambda x: x[1], reverse=True)[:N]
\`\`\`

### When to Use Active Prompting

- You have a **pool of representative questions** for your task
- You want to **maximize few-shot performance** with minimal annotation effort
- You have the ability to run the model multiple times (cost consideration)
- Your task has **clear correct answers** (math, classification, extraction)

### Key Takeaway

Active prompting replaces guesswork in example selection with a data-driven approach. By measuring the model's uncertainty across candidate questions, you identify exactly where the model needs the most guidance — and create targeted examples for those cases. It is few-shot prompting, optimized.`,
    },
    {
      id: "pe-directional-stimulus",
      slug: "directional-stimulus",
      title: "Directional Stimulus Prompting",
      content: `## Directional Stimulus Prompting

Directional Stimulus Prompting (DSP), introduced by Li et al. (2023), adds a **small guiding signal** (keywords, hints, or structural cues) to steer the model toward a desired output direction. Think of it as giving the model a compass bearing rather than a complete map.

### The Core Idea

Instead of hoping the model generates the right content, you provide **directional hints** — keywords, phrases, or structural elements that nudge generation in the right direction.

\`\`\`
# Without directional stimulus
"Write a summary of the benefits of remote work."
(Model might focus on any angle — productivity, work-life balance, cost savings, etc.)

# With directional stimulus
"Write a summary of the benefits of remote work.
Keywords to include: productivity metrics, commute elimination, talent pool expansion, office cost reduction."
\`\`\`

The keywords act as a directional stimulus, steering the model toward specific aspects you want covered.

### DSP Patterns

**1. Keyword Steering:**
\`\`\`
Write a product description for a wireless mouse.
Must include these selling points: ergonomic grip, 6-month battery, USB-C charging, quiet clicks, multi-device pairing.
\`\`\`

**2. Structural Hints:**
\`\`\`
Write a blog post about machine learning in healthcare.

Structure hint:
- Open with a patient story
- Transition to the technology explanation
- Include one case study with numbers
- End with a call to action for healthcare administrators
\`\`\`

**3. Tone/Style Anchors:**
\`\`\`
Explain blockchain technology.
Style: Use the tone of a friendly college professor who uses everyday analogies.
Anchor phrases: "think of it like...", "here's the key insight...", "in plain English..."
\`\`\`

**4. Output Anchoring:**
\`\`\`
Generate a project status update email.

Must start with: "Team — quick update on Project Atlas."
Must end with: "Let me know if you have questions. — [Name]"
\`\`\`

### How DSP Differs from Other Techniques

| Technique | What It Provides | Level of Control |
|-----------|-----------------|------------------|
| Zero-shot | Only the task instruction | Low |
| Few-shot | Complete input-output examples | Medium-High |
| CoT | Reasoning steps | Medium (process) |
| DSP | Keywords, hints, anchors | Medium (direction) |

DSP sits between zero-shot (minimal guidance) and few-shot (full examples). It is lighter-weight than few-shot but more targeted than zero-shot.

### Generating Stimulus Automatically

A powerful variant uses a small LLM to generate the directional stimulus, which then guides a larger LLM:

\`\`\`
# Step 1: Small model generates keywords
Prompt to small model: "What are the 5 most important points to cover when explaining quantum computing to a CEO?"
Output: "business value, competitive advantage, timeline to production, current limitations, investment required"

# Step 2: Large model uses keywords as stimulus
Prompt to large model: "Write a 500-word briefing on quantum computing for a CEO.
Key points to address: business value, competitive advantage, timeline to production, current limitations, investment required."
\`\`\`

### Practical Applications

**Content Generation:**
\`\`\`
Write a LinkedIn post announcing our new product launch.
Stimulus: professional but exciting, mention the problem it solves before the product, include a clear CTA, keep under 300 words, use line breaks for readability.
\`\`\`

**Code Review:**
\`\`\`
Review this code for issues.
Focus areas: SQL injection vulnerabilities, unhandled exceptions, memory leaks, race conditions.
\`\`\`

**Analysis:**
\`\`\`
Analyze this business proposal.
Evaluation dimensions: market viability, financial projections, team capability, competitive landscape, risk factors.
\`\`\`

### Before vs. After

**Without DSP:**
\`\`\`
"Write a cover letter for a software engineering position."
(Generic, unfocused output)
\`\`\`

**With DSP:**
\`\`\`
"Write a cover letter for a software engineering position.
Highlight: 5 years Python experience, open-source contributions to Django, led migration from monolith to microservices, reduced deployment time by 70%.
Tone: confident but not arrogant, show enthusiasm for the company's mission in climate tech."
\`\`\`

### Key Takeaway

Directional Stimulus Prompting gives the model a compass rather than a complete map. By providing keywords, structural hints, and tone anchors, you steer generation toward exactly the output you need — with less effort than crafting full few-shot examples.`,
    },
    {
      id: "pe-ape",
      slug: "ape",
      title: "Automatic Prompt Engineer (APE)",
      content: `## Automatic Prompt Engineer (APE)

What if the LLM could write better prompts than you? **Automatic Prompt Engineer (APE)**, introduced by Zhou et al. (2022), uses LLMs to **generate, evaluate, and optimize prompts automatically**. It treats prompt engineering as a search problem.

### The APE Pipeline

\`\`\`
1. Define the task with input-output examples
2. Ask the LLM to generate candidate prompts (instructions)
3. Evaluate each candidate prompt on a test set
4. Select the best-performing prompt
5. (Optional) Iteratively refine it
\`\`\`

### Step-by-Step Implementation

**Step 1: Define the task**
\`\`\`
Input: "The movie was absolutely terrible and a waste of time"
Output: "negative"

Input: "Best restaurant in town, highly recommend!"
Output: "positive"

Input: "It was okay, nothing special"
Output: "neutral"
\`\`\`

**Step 2: Generate candidate prompts**
\`\`\`
Given the following input-output examples, generate 10 different instruction prompts that would produce the correct output for each input.

[examples here]

Candidate instructions:
1. "Classify the sentiment of the following text as positive, negative, or neutral."
2. "Read the text and determine the emotional tone: positive, negative, or neutral."
3. "You are a sentiment analyzer. Categorize the text's sentiment."
4. "What is the overall feeling expressed in this text? Answer: positive, negative, or neutral."
...
\`\`\`

**Step 3: Evaluate candidates**
\`\`\`python
# Pseudocode for APE evaluation
test_set = load_test_examples()  # 50-100 labeled examples
results = {}

for prompt in candidate_prompts:
    correct = 0
    for example in test_set:
        response = model.complete(f"{prompt}\\n\\nText: {example.input}")
        if normalize(response) == example.expected_output:
            correct += 1
    results[prompt] = correct / len(test_set)

best_prompt = max(results, key=results.get)
print(f"Best prompt: {best_prompt} (accuracy: {results[best_prompt]:.1%})")
\`\`\`

**Step 4: Refine the winner**
\`\`\`
The following prompt achieved 87% accuracy on a sentiment classification task:
"Classify the sentiment of the following text as positive, negative, or neutral."

Generate 5 variations that might perform better. Consider:
- Adding output format constraints
- Adding examples of edge cases
- Clarifying ambiguous cases
- Adding role/persona framing

Variations:
1. ...
2. ...
\`\`\`

### APE vs. Manual Prompt Engineering

| Aspect | Manual | APE |
|--------|--------|-----|
| Speed | Hours of iteration | Minutes of generation |
| Coverage | Limited by human creativity | Explores many variations |
| Optimization | Intuition-based | Data-driven |
| Scalability | One task at a time | Batch across many tasks |
| Human insight | Full understanding of failures | May miss nuances |

### Practical APE Workflow

\`\`\`
# A lightweight APE you can run today:

1. Write your current best prompt

2. Ask the model:
   "Here is a prompt I use for [task]. Generate 5 alternative versions
   that might perform better. Vary the instruction style, structure,
   and level of detail."

3. Test all 6 versions (original + 5 alternatives) on 20 representative inputs

4. Pick the winner

5. Ask the model:
   "This prompt version scored highest. Suggest 3 specific improvements
   to handle these failure cases: [list failures]"

6. Test the refined versions

7. Deploy the champion
\`\`\`

### The "Let's Think Step by Step" Discovery

One of APE's most famous findings: when given a reasoning task, the system discovered that **"Let's work this out in a step by step way to be sure we have the right answer"** outperformed the human-designed prompt **"Let's think step by step"**. The LLM found a better prompt than the researchers.

### When to Use APE

- You have a **well-defined task** with measurable output quality
- You have a **labeled test set** (even 20-50 examples helps)
- You want to **squeeze maximum performance** from a prompt
- You are deploying a prompt at **scale** (thousands of calls per day)

### Key Takeaway

APE turns prompt optimization from an art into a science. By generating candidate prompts, evaluating them against test data, and iteratively refining the winners, you can systematically find prompts that outperform hand-crafted ones. It is especially valuable for production prompts that will be executed thousands of times.`,
    },
    {
      id: "pe-multimodal-prompting",
      slug: "multimodal-prompting",
      title: "Multimodal Prompting",
      content: `## Multimodal Prompting

Multimodal prompting involves providing **multiple types of input** — text, images, audio, or video — to LLMs that can process them. With the rise of models like GPT-4V, Claude 3, and Gemini, this capability has moved from experimental to essential.

### What Multimodal Models Can Process

| Model | Text | Images | Audio | Video | PDFs |
|-------|------|--------|-------|-------|------|
| GPT-4o | Yes | Yes | Yes | No | Yes |
| Claude 3.5 | Yes | Yes | No | No | Yes |
| Gemini 1.5 Pro | Yes | Yes | Yes | Yes | Yes |

### Basic Image + Text Prompting

The simplest multimodal prompt combines an image with a text instruction:

\`\`\`
[Image: photo of a receipt]
Text: "Extract all line items from this receipt. Return as JSON with fields: item_name, quantity, unit_price, total_price."
\`\`\`

\`\`\`
[Image: screenshot of a dashboard]
Text: "Describe what this dashboard shows. Identify any metrics that are trending negatively."
\`\`\`

### Effective Multimodal Prompt Patterns

**1. Describe-then-Analyze:**
\`\`\`
[Image: medical chart/graph]
First, describe what this chart shows in detail (axes, data points, trends).
Then, analyze the clinical significance of the trends you observe.
\`\`\`

**2. Compare Multiple Images:**
\`\`\`
[Image 1: UI design mockup version A]
[Image 2: UI design mockup version B]
Compare these two UI designs. Create a table of differences covering: layout, color scheme, typography, navigation, and accessibility.
\`\`\`

**3. Image-to-Code:**
\`\`\`
[Image: wireframe/mockup of a web page]
Generate HTML and CSS that recreates this design as closely as possible. Use modern CSS (flexbox/grid), semantic HTML, and make it responsive.
\`\`\`

**4. Diagram Understanding:**
\`\`\`
[Image: system architecture diagram]
Explain this system architecture. Identify:
- All components and their roles
- Data flow between components
- Potential bottlenecks or single points of failure
\`\`\`

### Tips for Better Multimodal Prompts

**Be specific about what to look at:**
\`\`\`
# Vague
"What do you see in this image?"

# Specific
"In this satellite image, identify all buildings that appear to be under construction. For each, estimate the approximate footprint in square meters and construction stage (foundation, framing, enclosed, finishing)."
\`\`\`

**Guide the model's attention:**
\`\`\`
"Focus on the top-right quadrant of this chart. What trend do you observe between January and March?"
\`\`\`

**Combine with reasoning techniques:**
\`\`\`
[Image: complex math problem written on a whiteboard]
"Read the problem from the whiteboard. Then solve it step by step, showing all work."
\`\`\`

### Multimodal Chain: Image -> Text -> Analysis

\`\`\`
Step 1: [Image: handwritten notes]
"Transcribe these handwritten notes into clean text."

Step 2: [Use transcription from Step 1]
"Organize these notes into a structured outline with main topics and sub-points."

Step 3: [Use outline from Step 2]
"Based on this outline, identify the 3 most important action items and create a task list."
\`\`\`

### Common Multimodal Use Cases

| Use Case | Input | Output |
|----------|-------|--------|
| Document processing | Scanned PDFs, receipts | Structured data (JSON) |
| Code from design | Wireframes, mockups | HTML/CSS/React code |
| Visual QA | Photos, screenshots | Answers about content |
| Chart analysis | Graphs, dashboards | Insights, summaries |
| Accessibility | Images | Alt text, descriptions |
| Quality inspection | Product photos | Defect detection |

### Limitations to Watch For

- Models may **misread fine text** in images — always verify OCR-critical data
- **Spatial reasoning** can be weak — counting objects, precise positioning
- Models cannot **modify** images — they can only analyze and describe
- **Image resolution** matters — low-res images produce low-quality analysis
- **Hallucination** applies to visual input too — models may "see" things that are not there

### Key Takeaway

Multimodal prompting extends all the techniques you have learned — zero-shot, few-shot, CoT, structured output — to image and document inputs. The same principles apply: be specific, specify output format, and verify results. As models improve their visual capabilities, multimodal prompting becomes an increasingly essential skill.`,
    },
  ],
};
