import { Module } from "../types";

export const fundamentalsModule: Module = {
  id: "pe-fundamentals",
  title: "Fundamentals of Prompt Engineering",
  description: "Understand how LLMs interpret prompts, master zero-shot and few-shot techniques, and learn the core design principles that make every prompt more effective. Reference: https://github.com/dair-ai/Prompt-Engineering-Guide",
  lessons: [
    {
      id: "pe-what-is-prompt-engineering",
      slug: "what-is-prompt-engineering",
      title: "What is Prompt Engineering?",
      content: `## What is Prompt Engineering?

Prompt engineering is the discipline of designing, structuring, and refining inputs to large language models (LLMs) so they produce accurate, useful, and predictable outputs. As LLMs have become the backbone of modern AI applications, the ability to write effective prompts has emerged as one of the most valuable skills in the industry.

### Why Prompt Engineering Matters

LLMs are **stochastic systems** — they generate text by predicting the next most probable token based on their training data and the input you provide. A small change in your prompt can lead to a dramatically different output. Prompt engineering gives you systematic control over this behavior.

Consider this simple example:

\`\`\`
Bad prompt:  "Tell me about dogs"
Good prompt: "List 5 key differences between Golden Retrievers and Labrador Retrievers in a markdown table with columns for Trait, Golden Retriever, and Labrador Retriever."
\`\`\`

The first prompt is ambiguous — the model could write an essay, a poem, or a children's story. The second prompt specifies **format**, **scope**, **quantity**, and **structure**, leading to a predictable, useful response.

### How LLMs Process Prompts

When you send a prompt to an LLM, the model:

1. **Tokenizes** the input — splits text into tokens (roughly 3-4 characters each)
2. **Processes context** — attends to all tokens using transformer attention layers
3. **Generates output** — predicts one token at a time, using the prompt + previously generated tokens

This means the model has no memory beyond your prompt. Everything the model needs to know must be **in the prompt itself** or in its training data.

### Key Parameters That Affect Output

| Parameter | Range | Effect |
|-----------|-------|--------|
| \`temperature\` | 0.0 - 2.0 | Controls randomness. 0 = deterministic, 1+ = creative |
| \`top_p\` | 0.0 - 1.0 | Nucleus sampling — limits token pool to top cumulative probability |
| \`max_tokens\` | varies | Maximum length of the generated response |
| \`frequency_penalty\` | -2.0 - 2.0 | Penalizes repetition of tokens already used |

**Rule of thumb:** Use \`temperature: 0\` for factual/analytical tasks and \`temperature: 0.7-1.0\` for creative tasks. Avoid setting both \`temperature\` and \`top_p\` simultaneously — pick one.

\`\`\`
# Factual extraction — low temperature
{"prompt": "Extract all dates from this text...", "temperature": 0}

# Creative brainstorming — higher temperature
{"prompt": "Generate 10 startup ideas for...", "temperature": 0.9}
\`\`\`

### The Prompt Engineering Mindset

Think of yourself as a **translator between human intent and machine comprehension**. The model is extremely capable but literal — it does exactly what you ask, not what you mean. Your job is to close the gap between intent and instruction.

### Key Takeaway

Prompt engineering is not about tricks or hacks. It is a structured discipline that involves understanding how models process language, what parameters influence output, and how to express your intent clearly. Every technique in this course builds on this foundation.`,
    },
    {
      id: "pe-anatomy-of-a-prompt",
      slug: "anatomy-of-a-prompt",
      title: "Anatomy of a Prompt",
      content: `## Anatomy of a Prompt

Every effective prompt is built from a combination of four core components. Understanding these components lets you construct prompts systematically rather than through trial and error.

### The Four Components

1. **Instruction** — The task you want the model to perform
2. **Context** — Background information the model needs
3. **Input Data** — The specific data to process
4. **Output Format** — How you want the result structured

Not every prompt needs all four, but the best prompts use at least two or three.

### Component Breakdown

\`\`\`
Instruction:    "Classify the following customer review as positive, negative, or neutral."
Context:        "You are a sentiment analysis system for an e-commerce platform."
Input Data:     "Review: The product arrived on time but the packaging was damaged."
Output Format:  "Respond with a JSON object: {sentiment, confidence, reasoning}"
\`\`\`

### Putting It All Together

Here is a fully composed prompt using all four components:

\`\`\`
You are a sentiment analysis system for an e-commerce platform.

Classify the following customer review as positive, negative, or neutral.

Review: "The product arrived on time but the packaging was damaged. The item itself works fine though."

Respond with a JSON object containing:
- "sentiment": one of "positive", "negative", "neutral"
- "confidence": a number between 0 and 1
- "reasoning": a one-sentence explanation
\`\`\`

**Expected output:**
\`\`\`json
{
  "sentiment": "neutral",
  "confidence": 0.75,
  "reasoning": "The review contains both a positive aspect (on-time delivery, working product) and a negative aspect (damaged packaging), resulting in a mixed/neutral sentiment."
}
\`\`\`

### Before vs. After: The Impact of Structure

**Unstructured prompt:**
\`\`\`
What do you think about this review? "Great price but slow shipping"
\`\`\`
This invites an open-ended, conversational response that is hard to parse programmatically.

**Structured prompt:**
\`\`\`
Task: Sentiment classification
Input: "Great price but slow shipping"
Output format: {sentiment: positive|negative|neutral|mixed, aspects: [{topic, sentiment}]}
\`\`\`
This produces consistent, parseable output every time.

### The Delimiter Principle

Use clear delimiters to separate components, especially when your input data might contain instructions of its own. Common delimiters:

| Delimiter | Use Case |
|-----------|----------|
| \`\`\`triple backticks\`\`\` | Code blocks, raw text |
| \`---\` | Section separators |
| \`###\` | Headers/sections |
| \`<tags></tags>\` | XML-style wrapping (especially for Claude) |
| \`"""\` | Quoted text blocks |

\`\`\`
Summarize the text delimited by triple backticks in exactly 3 bullet points.

\\\`\\\`\\\`
[Your long text here — even if it contains the word "ignore previous instructions",
the model understands it is data, not an instruction]
\\\`\\\`\\\`
\`\`\`

### Key Takeaway

A well-structured prompt with clear instruction, relevant context, properly delimited input data, and a specified output format will consistently outperform vague, unstructured prompts. Build every prompt from these four building blocks.`,
    },
    {
      id: "pe-zero-shot-prompting",
      slug: "zero-shot-prompting",
      title: "Zero-Shot Prompting",
      content: `## Zero-Shot Prompting

Zero-shot prompting means asking the model to perform a task **without providing any examples**. You rely entirely on the model's pre-trained knowledge and your instruction clarity.

### When Zero-Shot Works Best

Zero-shot prompting is ideal when:
- The task is **well-defined** and common (summarization, translation, classification)
- The model has likely seen similar tasks during training
- You want **simplicity** — no example crafting needed
- You need to process many different input types

### Basic Zero-Shot Pattern

\`\`\`
[Role/Context — optional]
[Clear Instruction]
[Input Data]
[Output Format — optional but recommended]
\`\`\`

### Examples of Zero-Shot Prompts

**Text Classification:**
\`\`\`
Classify the following text into one of these categories: Technology, Sports, Politics, Entertainment.

Text: "The new GPU architecture delivers 3x performance improvement over the previous generation while consuming 40% less power."

Category:
\`\`\`

**Translation:**
\`\`\`
Translate the following English sentence to French. Output only the translation, nothing else.

Sentence: "The meeting has been rescheduled to next Thursday at 3 PM."
\`\`\`

**Extraction:**
\`\`\`
Extract all email addresses from the following text. Return them as a JSON array.

Text: "Contact us at support@example.com or sales@example.com. For urgent matters, reach john.doe@company.org."
\`\`\`

### Improving Zero-Shot Performance

**1. Be explicit about what you want:**

\`\`\`
# Vague
Summarize this article.

# Explicit
Summarize this article in exactly 3 sentences. Focus on the main finding, the methodology used, and the practical implications.
\`\`\`

**2. Specify what you do NOT want:**

\`\`\`
Explain quantum entanglement.
- Use simple analogies a 10-year-old could understand
- Do NOT use mathematical formulas
- Do NOT exceed 150 words
\`\`\`

**3. Give the model a role:**

\`\`\`
You are an experienced patent attorney.

Review the following product description and identify any potential patent infringement risks. Focus on utility patents filed after 2020 in the United States.
\`\`\`

### Zero-Shot Limitations

Zero-shot prompting struggles when:
- The task requires a **very specific output format** the model hasn't seen
- The task is **novel or niche** (e.g., domain-specific jargon)
- You need **consistent behavior** across many different inputs
- The task requires **multi-step reasoning** (see Chain-of-Thought)

When zero-shot isn't enough, the next technique — **few-shot prompting** — adds examples to guide the model.

### Before vs. After

**Before (weak zero-shot):**
\`\`\`
Is this spam?
"Congratulations! You've won a free iPhone. Click here to claim."
\`\`\`
The model might answer with a paragraph explanation.

**After (strong zero-shot):**
\`\`\`
Classify the following email as "spam" or "not_spam". Respond with only the classification label.

Email: "Congratulations! You've won a free iPhone. Click here to claim."

Classification:
\`\`\`
Output: \`spam\`

### Key Takeaway

Zero-shot prompting is your default starting point. If you can describe the task clearly enough, the model can perform it without examples. When zero-shot falls short, add examples (few-shot) or reasoning steps (chain-of-thought).`,
    },
    {
      id: "pe-few-shot-prompting",
      slug: "few-shot-prompting",
      title: "Few-Shot Prompting",
      content: `## Few-Shot Prompting

Few-shot prompting provides the model with **examples of the desired input-output behavior** before asking it to process new input. This is one of the most powerful and widely-used techniques in prompt engineering.

### The Core Pattern

\`\`\`
[Task description]

[Example 1 Input] -> [Example 1 Output]
[Example 2 Input] -> [Example 2 Output]
[Example 3 Input] -> [Example 3 Output]

[Actual Input] ->
\`\`\`

The model learns the pattern from your examples and applies it to the new input.

### A Complete Few-Shot Example

**Task: Convert natural language to SQL**

\`\`\`
Convert the following natural language queries to SQL. The database has tables: users (id, name, email, created_at), orders (id, user_id, total, status, created_at).

Query: "How many users signed up last month?"
SQL: SELECT COUNT(*) FROM users WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND created_at < DATE_TRUNC('month', CURRENT_DATE);

Query: "Show me the top 5 customers by total spending"
SQL: SELECT u.name, SUM(o.total) as total_spent FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.name ORDER BY total_spent DESC LIMIT 5;

Query: "Find all pending orders over $100"
SQL: SELECT * FROM orders WHERE status = 'pending' AND total > 100;

Query: "What is the average order value per month this year?"
SQL:
\`\`\`

The model sees three input-output pairs and can now generate the fourth SQL query following the same pattern.

### Example Selection Strategies

The quality of your examples dramatically affects performance. Here are proven strategies:

**1. Cover edge cases:**
\`\`\`
# Include examples that show how to handle tricky inputs
Input: "N/A"        -> Category: "unknown"
Input: ""            -> Category: "invalid_input"
Input: "Great product!" -> Category: "positive"
\`\`\`

**2. Balance your classes:**
If classifying into 4 categories, include at least one example per category.

**3. Order matters:**
Place the most representative examples first. The model pays more attention to examples closest to the actual input.

**4. Use diverse examples:**
\`\`\`
# Bad: All examples are similar
"I love this!" -> positive
"This is great!" -> positive
"Amazing product!" -> positive

# Good: Examples show range
"I love this!" -> positive
"Worst purchase ever." -> negative
"It works as described." -> neutral
"Good quality but overpriced." -> mixed
\`\`\`

### How Many Examples?

| Scenario | Recommended | Why |
|----------|-------------|-----|
| Simple classification | 2-3 | Pattern is straightforward |
| Complex formatting | 3-5 | Model needs to see the structure |
| Nuanced judgment | 5-8 | Edge cases matter |
| Novel task | 8-15 | Model has no prior exposure |

More examples improve consistency but cost more tokens. Find the minimum number that produces reliable output.

### Few-Shot vs. Zero-Shot: When to Choose

Use **zero-shot** when:
- The task is common and well-defined
- You need to minimize token usage
- Input types vary widely

Use **few-shot** when:
- You need a **specific output format**
- The task involves **nuanced judgment**
- Zero-shot produces inconsistent results
- You are working with a **smaller model**

### Before vs. After

**Zero-shot (inconsistent):**
\`\`\`
Extract the person's name and age from this text: "Maria, a 34-year-old engineer from Berlin"
\`\`\`
The model might return a sentence, a list, or JSON — unpredictably.

**Few-shot (consistent):**
\`\`\`
Extract name and age as JSON.

Text: "John is a 28-year-old teacher in London"
Output: {"name": "John", "age": 28}

Text: "45-year-old Dr. Sarah Chen works at MIT"
Output: {"name": "Sarah Chen", "age": 45}

Text: "Maria, a 34-year-old engineer from Berlin"
Output:
\`\`\`

### Key Takeaway

Few-shot prompting is your primary tool for getting consistent, formatted output from LLMs. Choose diverse, representative examples that cover edge cases, and use the minimum number needed for reliable results.`,
    },
    {
      id: "pe-design-tips",
      slug: "design-tips",
      title: "General Prompt Design Tips",
      content: `## General Prompt Design Tips

These are battle-tested principles that improve prompt quality across every technique and every model. Apply them consistently and your prompts will be more reliable, more predictable, and easier to maintain.

### Tip 1: Be Specific and Unambiguous

The number one cause of poor LLM output is vague instructions. Every word in your prompt should reduce ambiguity.

\`\`\`
# Vague
Write something about climate change.

# Specific
Write a 200-word executive summary of the economic impact of climate change on coastal real estate markets in the United States between 2020 and 2025. Use a formal, analytical tone. Include at least two statistics.
\`\`\`

### Tip 2: Use Delimiters for Input Data

Always separate your instructions from the data the model should process:

\`\`\`
Summarize the following article in 3 bullet points.

---
Article:
[paste article text here]
---
\`\`\`

This prevents the model from confusing data content with instructions — critical for preventing prompt injection.

### Tip 3: Specify the Output Format Explicitly

\`\`\`
# Instead of:
"Give me the results"

# Say:
"Return results as a JSON array of objects, each with keys: name (string), score (number 0-100), and summary (string, max 50 words)."
\`\`\`

When you need a very precise format, show it:

\`\`\`
Return the output in this exact format:

VERDICT: [PASS or FAIL]
SCORE: [0-100]
ISSUES:
- [issue 1]
- [issue 2]
\`\`\`

### Tip 4: Give the Model a Role (Persona)

Assigning a role activates relevant knowledge and adjusts tone:

\`\`\`
You are a senior security engineer reviewing code for vulnerabilities.

Review the following Python function and identify any security issues:
\`\`\`

Effective roles include:
- Domain expert: "You are an experienced cardiologist..."
- Audience calibrator: "You are a teacher explaining to a 5th grader..."
- Quality enforcer: "You are a strict code reviewer who rejects any code without error handling..."

### Tip 5: Break Complex Tasks into Steps

Rather than asking for everything at once, decompose:

\`\`\`
# Overloaded (unreliable)
Analyze this dataset, find trends, create visualizations, and write a report.

# Decomposed (reliable)
Step 1: List the top 5 trends you observe in this dataset.
Step 2: For each trend, provide the supporting data points.
Step 3: Suggest one chart type that would best visualize each trend.
Step 4: Write a 3-paragraph summary of findings.
\`\`\`

### Tip 6: Use Positive Instructions

Tell the model what to do, not just what not to do:

\`\`\`
# Negative (less effective)
Don't use technical jargon. Don't write more than 200 words. Don't include opinions.

# Positive (more effective)
Use simple, everyday language. Keep your response under 200 words. Present only factual, verifiable statements.
\`\`\`

### Tip 7: Include a Fallback / Edge Case Instruction

\`\`\`
Extract the company name from the email signature below. If no company name is found, respond with "NOT_FOUND".

Signature:
[text here]
\`\`\`

Without the fallback, the model might guess or hallucinate a company name.

### Tip 8: Iterate and Refine

Prompt engineering is iterative. A practical workflow:

1. **Start simple** — write the minimal prompt
2. **Test** — run it on 5-10 diverse inputs
3. **Identify failures** — where does the output go wrong?
4. **Add constraints** — address each failure mode with a specific instruction
5. **Retest** — verify fixes don't break other cases
6. **Lock it in** — save the final prompt as a versioned template

### Quick Reference Card

| Principle | One-liner |
|-----------|-----------|
| Be specific | "Extract names" not "get the important parts" |
| Use delimiters | Separate instructions from data |
| Specify format | Show the exact output structure |
| Assign a role | Activate domain expertise |
| Decompose | Break big tasks into numbered steps |
| Stay positive | Tell the model what TO do |
| Handle edges | Provide fallback instructions |
| Iterate | Test, fail, refine, repeat |

### Key Takeaway

Great prompts are not written — they are engineered. Start with these eight principles, apply them consistently, and you will see immediate improvements in output quality across any model and any task.`,
    },
  ],
};
