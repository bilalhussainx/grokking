import { Module } from "../types";

export const applicationsModule: Module = {
  id: "pe-applications",
  title: "Real-World Applications",
  description:
    "Apply prompt engineering to code generation, data augmentation, classification, summarization, and creative writing tasks. Reference: https://github.com/dair-ai/Prompt-Engineering-Guide",
  lessons: [
    {
      id: "pe-code-generation",
      slug: "code-generation",
      title: "Code Generation",
      content: `## Code Generation with Prompt Engineering

Code generation is one of the highest-impact applications of prompt engineering. The difference between a mediocre code prompt and an excellent one can be the difference between buggy snippets and production-ready implementations.

### The Code Generation Prompt Template

\`\`\`
You are an expert [language] developer.

Task: [what to build]
Requirements:
- [requirement 1]
- [requirement 2]
- [requirement 3]

Constraints:
- [constraint 1: e.g., "No external dependencies"]
- [constraint 2: e.g., "Must handle edge cases"]

Output: Complete, runnable code with comments explaining key decisions.
\`\`\`

### Level 1: Basic Code Generation

\`\`\`
Write a Python function that takes a list of integers and returns the top K most frequent elements.

Requirements:
- Function signature: def top_k_frequent(nums: list[int], k: int) -> list[int]
- If multiple elements have the same frequency, return any of them
- Time complexity should be better than O(n log n)
- Include type hints and a docstring
\`\`\`

### Level 2: Code Explanation

\`\`\`
Explain the following code line by line. For each significant line, describe:
1. What it does
2. Why it is needed
3. Any edge cases it handles (or fails to handle)

\\\`\\\`\\\`python
def merge_intervals(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current in intervals[1:]:
        if current[0] <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], current[1])
        else:
            merged.append(current)
    return merged
\\\`\\\`\\\`
\`\`\`

### Level 3: Code Debugging

\`\`\`
The following function should return True if a string is a valid palindrome (ignoring case and non-alphanumeric characters), but it has a bug.

\\\`\\\`\\\`python
def is_palindrome(s):
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]
\\\`\\\`\\\`

Test case that fails: is_palindrome("A man, a plan, a canal: Panama") returns False when it should return True.

Step through the execution with this input and identify the bug. Then provide the corrected code.
\`\`\`

(Note: this particular code is actually correct — a good prompt should include a genuinely buggy example. The pattern shows the approach.)

### Level 4: Architecture and Design

\`\`\`
Design a rate limiter for a REST API with the following requirements:

Functional:
- Support per-user and per-endpoint rate limits
- Configurable time windows (per second, per minute, per hour)
- Return appropriate HTTP 429 responses with retry-after headers

Non-functional:
- Must work in a distributed environment (multiple server instances)
- Sub-millisecond lookup performance
- Graceful degradation if the rate limit store is unavailable

Provide:
1. High-level architecture (which components, how they interact)
2. Data structure choice with justification
3. Core implementation in Python
4. Example configuration
\`\`\`

### Prompt Patterns for Better Code Output

**1. Specify the interface first:**
\`\`\`
Design a caching module with this interface:
- cache.get(key) -> value or None
- cache.set(key, value, ttl_seconds) -> None
- cache.delete(key) -> bool
- cache.clear() -> None

Then implement it using an LRU eviction strategy.
\`\`\`

**2. Request test cases alongside code:**
\`\`\`
Write the function AND a set of test cases covering:
- Normal operation
- Edge cases (empty input, single element, duplicates)
- Error conditions (invalid input types)
\`\`\`

**3. Specify the development context:**
\`\`\`
I am working in a Next.js 14 project using TypeScript, Tailwind CSS, and Prisma ORM.
Write a server action that handles form submission for user profile updates.
Follow Next.js 14 conventions (app router, server actions).
\`\`\`

### Before vs. After

**Weak code prompt:**
\`\`\`
Write a function to validate emails.
\`\`\`

**Strong code prompt:**
\`\`\`
Write a TypeScript function that validates email addresses.

Requirements:
- Function signature: validateEmail(email: string): { valid: boolean; error?: string }
- Check for: presence of @, valid domain format, no spaces, reasonable length
- Do NOT use regex — implement manual validation for clarity
- Return specific error messages for each validation failure
- Include JSDoc documentation
\`\`\`

### Key Takeaway

Code generation prompts succeed when they specify language, interface, requirements, constraints, and expected output format. Treat the prompt like a technical specification — the more precise you are about what you need, the more production-ready the generated code will be.`,
    },
    {
      id: "pe-data-generation",
      slug: "data-generation",
      title: "Data Generation & Augmentation",
      content: `## Data Generation & Augmentation

LLMs can generate synthetic training data, augment existing datasets, and create test fixtures — tasks that traditionally required significant manual effort. With the right prompts, you can produce diverse, realistic data at scale.

### Why Generate Synthetic Data?

- **Cold start problem**: You need data to train a model but have no data yet
- **Class imbalance**: Your dataset has 10,000 positive examples but only 50 negative ones
- **Privacy**: You cannot share real customer data but need realistic test data
- **Edge cases**: Real data rarely covers unusual scenarios you need to test
- **Cost**: Labeling real data is expensive and slow

### Pattern 1: Generating Labeled Training Data

\`\`\`
Generate 20 customer support tickets for an e-commerce platform. For each ticket, provide:
- ticket_text: The customer's message (1-3 sentences, realistic tone)
- category: One of [billing, shipping, product_defect, return_request, account_issue]
- urgency: One of [low, medium, high]
- sentiment: One of [angry, frustrated, neutral, confused]

Requirements:
- Ensure at least 3 tickets per category
- Include a mix of urgency levels
- Make the language natural and varied (some formal, some casual, some with typos)
- Include at least 2 tickets that could belong to multiple categories

Return as a JSON array.
\`\`\`

### Pattern 2: Data Augmentation

\`\`\`
I have the following 3 product reviews. For each review, generate 5 paraphrased versions that preserve the meaning and sentiment but vary the wording, structure, and vocabulary.

Original reviews:
1. "This laptop is incredibly fast and the battery lasts all day. Best purchase I've made this year."
2. "Arrived broken. Customer service was unhelpful. Returning immediately."
3. "It's okay for the price. Not great, not terrible."

For each paraphrase, maintain:
- The same sentiment polarity and intensity
- The same key claims (battery life, speed, broken, etc.)
- Natural, human-like language

Vary:
- Sentence structure (simple vs. compound)
- Vocabulary (casual vs. formal)
- Length (shorter or longer than original)
\`\`\`

### Pattern 3: Generating Test Fixtures

\`\`\`
Generate a realistic test dataset for a hospital patient management system.

Generate 15 patient records as JSON with these fields:
- patient_id: UUID format
- name: Realistic full name (diverse ethnicities)
- date_of_birth: Between 1940-01-01 and 2010-12-31
- blood_type: Realistic distribution (O+ most common)
- allergies: Array of 0-3 allergies (use real medication/food allergies)
- current_medications: Array of 0-4 medications (use real medication names)
- emergency_contact: {name, relationship, phone}

Requirements:
- Ages should follow a realistic hospital population distribution (more elderly)
- Some patients should have no allergies or medications (healthy visits)
- Medications should be consistent with implied conditions (e.g., metformin implies diabetes)
- Include at least one pediatric patient
\`\`\`

### Pattern 4: Few-Shot Data Generation

When you need data that matches a specific pattern:

\`\`\`
Here are 3 examples of phishing email subject lines from our training data:

1. "URGENT: Your account has been compromised - verify now"
2. "Invoice #38291 attached - payment overdue"
3. "You've won a $500 Amazon gift card - claim here"

Generate 20 more phishing email subject lines in the same style. Vary the tactics:
- At least 5 using urgency/fear
- At least 5 using financial lures
- At least 5 impersonating known brands
- At least 5 using curiosity/clickbait

Do NOT repeat the patterns above verbatim — create novel variations.
\`\`\`

### Quality Control for Synthetic Data

Generated data needs verification. Build quality checks into your prompts:

\`\`\`
After generating the dataset, perform these quality checks:
1. Verify no duplicate entries
2. Confirm all fields match the specified formats
3. Check that the category distribution matches requirements
4. Flag any entries that seem unrealistic or contradictory
5. Report the checks at the end of your response
\`\`\`

### Synthetic Data Pitfalls

| Pitfall | Description | Mitigation |
|---------|-------------|------------|
| Lack of diversity | LLM generates similar patterns | Ask for explicit variation dimensions |
| Statistical bias | Distribution does not match reality | Specify target distributions |
| Unrealistic combinations | Contradictory field values | Add consistency constraints |
| Memorization | LLM reproduces training data | Add "generate novel examples" instruction |
| Format drift | Output format changes mid-generation | Use structured output (JSON) with schema |

### Key Takeaway

LLMs are powerful synthetic data generators when prompted correctly. Specify the schema, distribution requirements, diversity constraints, and quality checks in your prompt. Always validate generated data before using it for training or testing — synthetic data is only useful if it is realistic and correctly labeled.`,
    },
    {
      id: "pe-classification",
      slug: "classification",
      title: "Text Classification & Sentiment Analysis",
      content: `## Text Classification & Sentiment Analysis

Classification is one of the most common and well-understood applications of prompt engineering. With the right prompt structure, LLMs can match or exceed traditional ML classifiers — often without any training data at all.

### Zero-Shot Classification

The simplest approach — just describe the categories:

\`\`\`
Classify the following customer message into exactly one category.

Categories:
- billing: Questions about charges, invoices, payments, refunds
- technical: Issues with product functionality, bugs, errors
- account: Login problems, password resets, profile changes
- shipping: Delivery status, tracking, address changes
- general: Everything else

Message: "I was charged twice for my last order and I need one of the charges reversed."

Category:
\`\`\`

### Few-Shot Classification

Add examples for more consistent results:

\`\`\`
Classify each email into: spam, promotional, personal, or work.

Email: "Congratulations! You've been selected for a free cruise!" -> spam
Email: "30% off all items this weekend at TechStore" -> promotional
Email: "Hey, are we still on for dinner Saturday?" -> personal
Email: "Please review the Q3 report before tomorrow's meeting" -> work

Email: "Your subscription renewal is coming up. Save 20% if you renew today!"
Category:
\`\`\`

### Multi-Label Classification

When inputs can belong to multiple categories:

\`\`\`
Analyze the following product review and assign ALL applicable tags.

Available tags: [quality, price, delivery, packaging, customer_service, size_fit, durability, appearance]

Review: "The jacket looks amazing and the quality of the stitching is excellent, but it runs a bit small. Had to exchange for a larger size and customer service was very helpful."

Return a JSON object:
{
  "tags": ["list of applicable tags"],
  "confidence": {"tag": score} for each selected tag (0.0 to 1.0)
}
\`\`\`

### Sentiment Analysis Patterns

**Basic sentiment:**
\`\`\`
Rate the sentiment of each text on a scale of 1-5:
1 = Very Negative, 2 = Negative, 3 = Neutral, 4 = Positive, 5 = Very Positive

Text: "The service was okay but nothing to write home about."
Sentiment:
\`\`\`

**Aspect-based sentiment:**
\`\`\`
Analyze the sentiment for each aspect mentioned in this restaurant review.

Review: "The food was incredible and the ambiance was perfect, but the service was painfully slow and the prices are way too high for the portion sizes."

Return a JSON object:
{
  "aspects": [
    {"aspect": "food", "sentiment": "positive/negative/neutral", "quote": "relevant text"},
    ...
  ],
  "overall_sentiment": "positive/negative/neutral/mixed"
}
\`\`\`

### Building a Robust Classifier Prompt

A production-quality classification prompt includes:

\`\`\`
You are a content moderation classifier for a social media platform.

Task: Classify each post into one of the following categories:
- safe: Content appropriate for all audiences
- mild: Contains mild language or controversial opinions, but within policy
- flagged: Potentially violates community guidelines, needs human review
- violation: Clearly violates community guidelines

Rules:
- Political opinions alone are "safe" — do not flag disagreement
- Sarcasm about public figures is "mild" unless it contains threats
- Any mention of self-harm should be "flagged" regardless of context
- If uncertain between two categories, choose the more restrictive one

Output format: {"category": "...", "reason": "one sentence explanation"}

Post: "[content here]"
\`\`\`

### Handling Edge Cases

\`\`\`
If the text is:
- Empty or contains only whitespace -> {"category": "invalid", "reason": "empty input"}
- In a language you cannot confidently analyze -> {"category": "unknown_language", "reason": "detected [language], analysis may be unreliable"}
- Contains mixed sentiment that is impossible to classify -> {"category": "mixed", "aspects": [...]}
\`\`\`

### Batch Classification

For processing multiple items efficiently:

\`\`\`
Classify each of the following 10 texts. Return a JSON array with one object per text.

Texts:
1. "Absolutely love this product!"
2. "Worst customer service I have ever experienced."
3. "It works as described."
...

Output format:
[
  {"id": 1, "text_preview": "first 30 chars...", "sentiment": "...", "confidence": 0.0-1.0},
  ...
]
\`\`\`

### Key Takeaway

Prompt-based classification is fast to set up, requires no training data, and handles new categories without retraining. The keys to accuracy are clear category definitions, representative few-shot examples, explicit edge case handling, and structured output formats. For high-stakes classification, combine with self-consistency (multiple runs, majority vote) for higher reliability.`,
    },
    {
      id: "pe-summarization",
      slug: "summarization",
      title: "Summarization & Extraction",
      content: `## Summarization & Extraction

Summarization and information extraction are among the most practical applications of prompt engineering. Whether you need to condense a 10-page report into bullet points or extract specific data points from unstructured text, the right prompt structure makes all the difference.

### Summarization Levels

Different tasks require different levels of compression:

| Level | Ratio | Use Case |
|-------|-------|----------|
| TL;DR | 95%+ compression | One-sentence headline |
| Executive summary | 80-90% | 3-5 key points for decision-makers |
| Detailed summary | 50-70% | Preserve all important details |
| Extractive | Varies | Pull exact quotes, no paraphrasing |

### Pattern 1: Controlled Summarization

\`\`\`
Summarize the following article for a busy executive.

Constraints:
- Exactly 5 bullet points
- Each bullet must be one sentence, max 25 words
- Focus on: key findings, business impact, recommended actions
- Omit: methodology details, literature review, acknowledgments

Article:
---
[article text here]
---
\`\`\`

### Pattern 2: Progressive Summarization

Start broad, then zoom in:

\`\`\`
Provide three levels of summary for the following document:

Level 1 - Headline (1 sentence, max 15 words):
Level 2 - Abstract (3 sentences covering who, what, why):
Level 3 - Detailed summary (5-7 bullet points covering all key points):

Document:
---
[document text here]
---
\`\`\`

### Pattern 3: Entity Extraction

\`\`\`
Extract all structured information from this business email.

Email:
---
Hi Sarah,

Following up on our call yesterday — we've decided to go with the Enterprise plan
at $4,500/month starting March 1st. Can you send the contract to our legal team?
The point of contact is James Chen (james.chen@acmecorp.com, +1-555-0134).

We'll need onboarding for 50 users across our NYC and London offices.

Thanks,
David Park
VP of Engineering, Acme Corp
---

Extract as JSON:
{
  "sender": {"name": "", "title": "", "company": ""},
  "recipient": "",
  "plan": "",
  "price": "",
  "start_date": "",
  "legal_contact": {"name": "", "email": "", "phone": ""},
  "user_count": 0,
  "locations": [],
  "action_items": []
}
\`\`\`

### Pattern 4: Question-Answering over Documents

\`\`\`
Answer each question based ONLY on the provided document. If the document does not contain the answer, respond with "Not mentioned in the document."

Document:
---
[document text]
---

Questions:
1. What was the total revenue for Q3?
2. How many new customers were acquired?
3. What regions showed the strongest growth?
4. Were there any product launches mentioned?
\`\`\`

### Pattern 5: Comparison Extraction

\`\`\`
Read both articles below and create a comparison table.

Article A:
---
[text about Product A]
---

Article B:
---
[text about Product B]
---

Create a markdown table comparing both on these dimensions:
| Dimension | Product A | Product B |
|-----------|-----------|-----------|
| Price | | |
| Key features | | |
| Target audience | | |
| Pros | | |
| Cons | | |
\`\`\`

### Handling Long Documents

When the document exceeds context limits:

\`\`\`
# Strategy 1: Chunked summarization chain
Chunk 1 -> Summary 1
Chunk 2 -> Summary 2
Chunk 3 -> Summary 3
[Summary 1 + Summary 2 + Summary 3] -> Final Summary

# Strategy 2: Map-Reduce
Map: Summarize each section independently
Reduce: Merge all section summaries into a cohesive final summary

# Strategy 3: Refine
Start with Chunk 1 summary
Refine with Chunk 2 (add new info, update existing)
Refine with Chunk 3 (add new info, update existing)
...
\`\`\`

### Avoiding Common Summarization Failures

\`\`\`
Summarize the following text.

Rules:
- Do NOT introduce information not present in the original text
- Do NOT change the meaning of any statistics or claims
- If a claim is attributed to a specific person, maintain the attribution
- Preserve all numbers exactly as stated (do not round)
- If you are unsure about a detail, omit it rather than guess
\`\`\`

### Key Takeaway

Effective summarization and extraction prompts specify the compression level, format, focus areas, and constraints explicitly. Use progressive summarization for different audiences, structured JSON for extraction, and chunking strategies for long documents. Always include instructions to prevent hallucination — summaries should compress information, never invent it.`,
    },
    {
      id: "pe-creative-writing",
      slug: "creative-writing",
      title: "Creative Writing & Content Generation",
      content: `## Creative Writing & Content Generation

Creative prompting requires a different approach than analytical tasks. Instead of constraining output toward a single correct answer, you are guiding the model toward a specific **voice, style, and creative direction** while leaving room for genuine creativity.

### The Creative Prompt Framework

\`\`\`
Persona: [who is the writer?]
Audience: [who is reading this?]
Format: [blog post, email, story, ad copy, etc.]
Tone: [professional, casual, humorous, urgent, etc.]
Constraints: [word count, specific points to include, things to avoid]
\`\`\`

### Pattern 1: Persona-Based Writing

\`\`\`
Write as if you are a seasoned travel journalist who has visited over 80 countries. Your writing style is:
- Vivid sensory descriptions (sights, sounds, smells)
- Short, punchy sentences mixed with longer flowing ones
- Personal anecdotes that feel authentic
- Occasional humor, never sarcasm

Write a 300-word article about visiting a night market in Bangkok for the first time.
\`\`\`

### Pattern 2: Style Transfer

Transform existing content into a different voice:

\`\`\`
Rewrite the following technical documentation as a friendly, conversational blog post.

Rules:
- Replace jargon with plain language
- Add analogies to explain complex concepts
- Use "you" and "your" to address the reader directly
- Add a relevant example or anecdote for each concept
- Maintain all factual accuracy — do not simplify the meaning, only the language

Original:
---
"The API implements OAuth 2.0 authorization code flow with PKCE extension. Clients must first register to obtain a client_id. The authorization endpoint returns a temporary code that is exchanged for an access token via the token endpoint."
---
\`\`\`

### Pattern 3: Brainstorming

\`\`\`
Generate 15 blog post ideas for a startup that makes AI-powered project management tools.

For each idea, provide:
- Title (catchy, SEO-friendly, under 60 characters)
- Hook (the opening line that grabs attention)
- Target keyword (for SEO)
- Audience segment (project managers, developers, executives, or freelancers)

Ensure variety:
- At least 3 how-to guides
- At least 3 thought leadership pieces
- At least 3 case study angles
- At least 3 comparison/review style posts
\`\`\`

### Pattern 4: Structured Content Generation

\`\`\`
Write a product launch email sequence (3 emails) for a new fitness app.

Email 1 (Teaser - send 7 days before launch):
- Subject line: Create curiosity without revealing the product
- Body: 100-150 words, hint at the problem it solves
- CTA: "Join the waitlist"

Email 2 (Launch day):
- Subject line: Clear announcement with excitement
- Body: 200-250 words, introduce the product, 3 key features, social proof
- CTA: "Download now - free for the first month"

Email 3 (Follow-up - 3 days after launch):
- Subject line: Address common objections
- Body: 150-200 words, testimonial focus, limited-time offer
- CTA: "Start your free trial"

Brand voice: energetic but not aggressive, inclusive, focuses on feeling healthy rather than looking good.
\`\`\`

### Pattern 5: Constrained Creativity

Sometimes creative constraints produce the best output:

\`\`\`
Write a 100-word product description for wireless earbuds.

Hard constraints:
- Exactly 100 words (not 99, not 101)
- Must include the phrase "crystal-clear audio"
- Must mention battery life in hours
- First sentence must be a question
- Last sentence must be a call to action
- No exclamation marks
- Reading level: 8th grade
\`\`\`

### Creative Temperature Settings

| Content Type | Recommended Temperature | Why |
|-------------|------------------------|-----|
| Ad copy / marketing | 0.7 - 0.9 | Needs creative flair |
| Blog posts | 0.6 - 0.8 | Balance of creativity and coherence |
| Technical writing | 0.2 - 0.4 | Accuracy over creativity |
| Fiction / poetry | 0.8 - 1.2 | Maximum creativity |
| Social media posts | 0.7 - 1.0 | Voice variety |

### Avoiding "AI Voice"

LLMs default to a recognizable, generic style. Fight it:

\`\`\`
Avoid these overused AI writing patterns:
- Do not start with "In the ever-evolving landscape of..."
- Do not use "It's important to note that..."
- Do not end with "In conclusion, [restate everything]"
- Do not use the words: delve, utilize, leverage, robust, seamless, game-changer
- Write like a human who has opinions, not an AI trying to be neutral
\`\`\`

### Key Takeaway

Creative prompting is about guiding direction while leaving room for genuine creativity. Define the persona, audience, format, tone, and constraints clearly. Use style transfer for consistency, brainstorming prompts for volume, and constrained creativity for precision. And always fight the default "AI voice" by being explicit about the style you want.`,
    },
  ],
};
