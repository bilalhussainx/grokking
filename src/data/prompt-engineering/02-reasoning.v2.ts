import { Module } from "../types";

export const reasoningModule: Module = {
  id: "pe-reasoning",
  title: "Reasoning & Chain-of-Thought Techniques",
  description: "Unlock step-by-step reasoning in LLMs with chain-of-thought, self-consistency, tree of thoughts, ReAct, and prompt chaining. Reference: https://github.com/dair-ai/Prompt-Engineering-Guide",
  lessons: [
    {
      id: "pe-chain-of-thought",
      slug: "chain-of-thought",
      title: "Chain-of-Thought Prompting",
      content: `## Chain-of-Thought Prompting

Chain-of-Thought (CoT) prompting is one of the most impactful discoveries in prompt engineering. By asking the model to **show its reasoning step by step**, you dramatically improve accuracy on tasks that require logic, math, or multi-step analysis.

### The Problem CoT Solves

Standard prompting asks for a direct answer. For complex problems, the model often skips reasoning steps and lands on a wrong answer:

\`\`\`
Q: A store has 45 apples. They sell 12 in the morning, receive a shipment of 30, then sell 18 in the afternoon. How many apples remain?

A: 55
\`\`\`

This is wrong (correct answer: 45). The model jumped to an answer without computing the intermediate steps.

### The CoT Solution

Add **"Let's think step by step"** or provide a worked example that shows reasoning:

\`\`\`
Q: A store has 45 apples. They sell 12 in the morning, receive a shipment of 30, then sell 18 in the afternoon. How many apples remain?

A: Let's think step by step.
- Start: 45 apples
- After morning sales: 45 - 12 = 33 apples
- After shipment: 33 + 30 = 63 apples
- After afternoon sales: 63 - 18 = 45 apples

The store has 45 apples remaining.
\`\`\`

### Two Flavors of CoT

**1. Zero-Shot CoT** — Just add "Let's think step by step":

\`\`\`
Determine if the following argument is logically valid. Think step by step before giving your final answer.

Premise 1: All mammals are warm-blooded.
Premise 2: All whales are mammals.
Conclusion: All whales are warm-blooded.
\`\`\`

**2. Few-Shot CoT** — Provide examples with reasoning chains:

\`\`\`
Q: If a train travels at 60 mph for 2.5 hours, how far does it go?
A: Distance = speed x time = 60 x 2.5 = 150 miles. The answer is 150 miles.

Q: If a car uses 4 gallons per 100 miles, how many gallons for 350 miles?
A: Gallons = (4/100) x 350 = 14 gallons. The answer is 14 gallons.

Q: A plane flies at 500 mph. How long to travel 1,750 miles?
A:
\`\`\`

### When CoT Makes the Biggest Difference

| Task Type | Without CoT | With CoT |
|-----------|-------------|----------|
| Arithmetic word problems | ~58% accuracy | ~93% accuracy |
| Logical reasoning | ~60% accuracy | ~85% accuracy |
| Multi-step analysis | Often wrong | Usually correct |
| Simple factual lookup | ~95% accuracy | ~95% accuracy (no benefit) |

CoT helps most when the task requires **multiple reasoning steps**. For simple factual questions, it adds unnecessary tokens without improving accuracy.

### Practical CoT Patterns

**For analysis tasks:**
\`\`\`
Analyze whether this startup idea is viable. Think through it systematically:
1. First, identify the target market and its size
2. Then, evaluate the competition
3. Next, assess the revenue model
4. Finally, give your overall verdict with a confidence level (low/medium/high)
\`\`\`

**For debugging:**
\`\`\`
This code produces incorrect output. Walk through the execution step by step, tracking variable values at each line, to identify the bug.
\`\`\`

**For decision-making:**
\`\`\`
Should we use PostgreSQL or MongoDB for this project? Evaluate step by step:
1. Analyze the data structure requirements
2. Consider query patterns
3. Evaluate scalability needs
4. Assess team expertise
5. Make a recommendation with reasoning
\`\`\`

### Key Takeaway

Chain-of-thought prompting transforms LLMs from answer-guessers into step-by-step reasoners. Add "think step by step" for a quick boost, or provide worked examples for maximum reliability. Use CoT whenever your task involves math, logic, or multi-step analysis.`,
    },
    {
      id: "pe-self-consistency",
      slug: "self-consistency",
      title: "Self-Consistency",
      content: `## Self-Consistency

Self-consistency is an enhancement to chain-of-thought prompting that generates **multiple reasoning paths** and selects the most common answer through **majority voting**. It was introduced by Wang et al. (2022) and consistently improves accuracy on reasoning tasks.

### The Problem with Single-Path Reasoning

Even with CoT, the model might take a wrong reasoning path on any single attempt. Different runs of the same prompt can produce different (sometimes wrong) answers:

\`\`\`
Run 1: "... 45 - 12 = 33, 33 + 30 = 63, 63 - 18 = 45. Answer: 45" (correct)
Run 2: "... 45 - 12 = 33, 33 - 18 = 15, 15 + 30 = 45. Answer: 45" (correct, different path)
Run 3: "... 45 - 12 - 18 = 15, 15 + 30 = 45. Answer: 45" (correct, simplified)
\`\`\`

But sometimes one run produces a wrong answer. Self-consistency mitigates this.

### How Self-Consistency Works

1. Prompt the model with chain-of-thought (using \`temperature > 0\`)
2. Generate **N independent completions** (typically 5-10)
3. Extract the final answer from each completion
4. Take the **majority vote** as the final answer

\`\`\`
# Step 1: Send the same CoT prompt N times with temperature=0.7

Prompt: "Roger has 5 tennis balls. He buys 2 more cans of tennis balls.
Each can has 3 tennis balls. How many does he have now? Think step by step."

# Step 2: Collect answers
Completion 1: "5 + (2 x 3) = 5 + 6 = 11" -> Answer: 11
Completion 2: "5 + 2*3 = 5 + 6 = 11"      -> Answer: 11
Completion 3: "5 + 2 + 3 = 10"             -> Answer: 10 (wrong reasoning)
Completion 4: "5 + 6 = 11"                 -> Answer: 11
Completion 5: "5 + (2 x 3) = 11"           -> Answer: 11

# Step 3: Majority vote
Answer 11: 4 votes | Answer 10: 1 vote
Final answer: 11
\`\`\`

### Implementation Pattern

In practice, you implement self-consistency by calling the API multiple times:

\`\`\`python
# Pseudocode for self-consistency
answers = []
for i in range(5):
    response = llm.complete(
        prompt="[CoT prompt here]",
        temperature=0.7  # Must be > 0 for diversity
    )
    answer = extract_final_answer(response)
    answers.append(answer)

# Majority vote
from collections import Counter
final_answer = Counter(answers).most_common(1)[0][0]
\`\`\`

### When to Use Self-Consistency

| Scenario | Use Self-Consistency? | Why |
|----------|----------------------|-----|
| Math/logic problems | Yes | Reasoning errors are random, voting filters them |
| Classification | Sometimes | If accuracy matters more than cost |
| Creative writing | No | There is no single "correct" answer |
| Code generation | Sometimes | Useful for algorithm problems |
| Simple factual Q&A | No | Overkill, single pass is sufficient |

### Cost vs. Accuracy Tradeoff

Self-consistency multiplies your API costs by N (the number of completions). The accuracy gain follows diminishing returns:

- **N=3**: Good cost-accuracy balance for most tasks
- **N=5**: Recommended for important decisions
- **N=10+**: Marginal improvement, significant cost

### Weighted Self-Consistency

An advanced variant weights each answer by the model's confidence:

\`\`\`
Completion 1: Answer=11 (confidence: 0.95) -> weighted: 0.95
Completion 2: Answer=11 (confidence: 0.88) -> weighted: 0.88
Completion 3: Answer=10 (confidence: 0.62) -> weighted: 0.62

Weighted vote for 11: 1.83 vs 10: 0.62 -> Answer: 11
\`\`\`

### Key Takeaway

Self-consistency is a simple but powerful technique: generate multiple chain-of-thought reasoning paths and take the majority vote. It reduces the impact of random reasoning errors and is especially valuable for math, logic, and high-stakes classification tasks.`,
    },
    {
      id: "pe-tree-of-thoughts",
      slug: "tree-of-thoughts",
      title: "Tree of Thoughts",
      content: `## Tree of Thoughts

Tree of Thoughts (ToT) extends chain-of-thought by allowing the model to **explore multiple reasoning branches**, evaluate them, and **backtrack** when a path looks unpromising. Introduced by Yao et al. (2023), it enables deliberate planning and search over thought processes.

### How ToT Differs from CoT

| Aspect | Chain-of-Thought | Tree of Thoughts |
|--------|-----------------|------------------|
| Reasoning | Single linear path | Multiple branching paths |
| Backtracking | Not possible | Can abandon bad branches |
| Evaluation | No intermediate checks | Evaluates each step |
| Best for | Straightforward reasoning | Problems requiring exploration |

### The ToT Framework

Think of it as a tree search where each node is a "thought" (a partial solution):

\`\`\`
                    [Problem]
                   /    |    \\
            [Thought A] [Thought B] [Thought C]
              /    \\        |          (pruned)
         [A1]    [A2]    [B1]
          |     (pruned)    |
        [A1a]             [B1a]
          |                 |
       [Solution]       [Solution]
\`\`\`

At each level, the model:
1. **Generates** multiple possible next thoughts
2. **Evaluates** each thought (is this path promising?)
3. **Selects** the best thoughts to continue
4. **Backtracks** if all paths from a node are poor

### Implementing ToT with Prompts

You can implement ToT without special frameworks by using structured prompts:

**Step 1: Generate candidate thoughts**
\`\`\`
You are solving a complex problem. Generate 3 different possible first steps.

Problem: "Arrange the digits 1-9 into a 3x3 grid where each row, column, and diagonal sums to 15."

Possible first steps:
1. [first approach]
2. [second approach]
3. [third approach]
\`\`\`

**Step 2: Evaluate each thought**
\`\`\`
Evaluate each approach on a scale of 1-10 for how promising it is. Consider whether it leads to a valid solution.

Approach 1: [description]
Evaluation: [score and reasoning]

Approach 2: [description]
Evaluation: [score and reasoning]

Approach 3: [description]
Evaluation: [score and reasoning]
\`\`\`

**Step 3: Expand the best branch**
\`\`\`
Continue with the highest-rated approach. Generate the next 3 possible steps from that point.
\`\`\`

### A Practical ToT Example

\`\`\`
I need to write a persuasive email to a client who is threatening to cancel their contract.

Generate 3 different strategies for this email:

Strategy A: Lead with empathy and acknowledgment of their frustration
Strategy B: Lead with data showing the value they have received
Strategy C: Lead with a special retention offer

For each strategy, rate (1-10):
- Likelihood of retention
- Risk of seeming desperate
- Alignment with long-term relationship

Then develop the highest-rated strategy into a full email draft.
\`\`\`

### BFS vs. DFS in ToT

Two search strategies apply:

**Breadth-First Search (BFS):**
- Explore all thoughts at one level before going deeper
- Better when you need to compare multiple approaches early
- Higher token cost per level

**Depth-First Search (DFS):**
- Follow one branch deep before trying alternatives
- Better when depth matters more than breadth
- Lower token cost but may miss better branches

\`\`\`
# BFS pattern
"Generate 3 approaches. Evaluate all 3. Take the best 2 forward.
For each, generate 3 next steps. Evaluate all 6. Take the best 2 forward..."

# DFS pattern
"Generate 3 approaches. Take the most promising one.
Go deeper. If stuck, backtrack to the second approach..."
\`\`\`

### When to Use ToT

- **Planning problems**: project plans, strategies, architectures
- **Creative exploration**: brainstorming where you want to explore before committing
- **Puzzle-solving**: constraint satisfaction, optimization
- **Decision-making**: when you need to weigh multiple paths

### Key Takeaway

Tree of Thoughts gives LLMs the ability to explore, evaluate, and backtrack — capabilities that linear chain-of-thought lacks. Use it for problems that require deliberate exploration of multiple approaches before committing to a solution.`,
    },
    {
      id: "pe-react-prompting",
      slug: "react-prompting",
      title: "ReAct Prompting",
      content: `## ReAct Prompting

ReAct (Reasoning + Acting) is a prompting framework where the model alternates between **thinking** (reasoning about what to do) and **acting** (taking an action like searching or calculating). Introduced by Yao et al. (2022), it is the foundation of most modern AI agent architectures.

### The ReAct Loop

\`\`\`
Thought -> Action -> Observation -> Thought -> Action -> Observation -> ... -> Answer
\`\`\`

- **Thought**: The model reasons about the current state and what to do next
- **Action**: The model invokes a tool (search, calculator, API, etc.)
- **Observation**: The result of the action is fed back to the model
- Repeat until the model has enough information to answer

### A ReAct Example

\`\`\`
Question: What is the population of the country where the Eiffel Tower is located, as of 2024?

Thought 1: I need to find which country the Eiffel Tower is in, then look up its population.
Action 1: Search("Eiffel Tower location country")
Observation 1: The Eiffel Tower is located in Paris, France.

Thought 2: The Eiffel Tower is in France. Now I need the 2024 population of France.
Action 2: Search("France population 2024")
Observation 2: The population of France in 2024 is approximately 68.4 million.

Thought 3: I now have all the information needed.
Answer: The population of France, where the Eiffel Tower is located, is approximately 68.4 million as of 2024.
\`\`\`

### Implementing ReAct with Prompts

You can set up a ReAct agent with a system prompt that defines available tools:

\`\`\`
You are a research assistant with access to the following tools:

1. Search(query) - Search the web for information
2. Calculator(expression) - Evaluate a mathematical expression
3. Lookup(term) - Look up a term in a knowledge base

To use a tool, write:
Action: ToolName(input)

You will then receive an Observation with the result.

Always follow this format:
Thought: [your reasoning about what to do next]
Action: [tool call]
Observation: [result - will be provided]

When you have enough information, respond with:
Thought: I now have the answer.
Answer: [your final answer]

Question: [user's question here]
\`\`\`

### Why ReAct Outperforms Pure Reasoning

| Approach | Limitation | ReAct Advantage |
|----------|-----------|-----------------|
| CoT only | Can hallucinate facts | Grounds answers in real data |
| Action only | Doesn't plan or reason | Makes strategic tool choices |
| ReAct | Combines both | Plans, acts, and verifies |

### ReAct in Practice: Multi-Step Research

\`\`\`
Question: Compare the GDP per capita of the top 3 most visited countries in 2023.

Thought 1: I need to find the top 3 most visited countries in 2023.
Action 1: Search("most visited countries 2023 ranking")
Observation 1: 1. France (100M tourists), 2. Spain (85M), 3. United States (66M)

Thought 2: Now I need GDP per capita for each. Let me start with France.
Action 2: Search("France GDP per capita 2023")
Observation 2: France GDP per capita 2023: approximately $44,408

Thought 3: Next, Spain.
Action 3: Search("Spain GDP per capita 2023")
Observation 3: Spain GDP per capita 2023: approximately $32,280

Thought 4: Finally, the United States.
Action 4: Search("United States GDP per capita 2023")
Observation 4: US GDP per capita 2023: approximately $80,034

Thought 5: I have all the data. Let me compile the comparison.
Answer:
| Country | Tourists (2023) | GDP per Capita |
|---------|----------------|----------------|
| France  | 100M           | $44,408        |
| Spain   | 85M            | $32,280        |
| USA     | 66M            | $80,034        |
\`\`\`

### Common ReAct Patterns

**Fact-checking:** Thought (claim to verify) -> Action (search for evidence) -> Observation -> Thought (evaluate evidence)

**Data analysis:** Thought (what to calculate) -> Action (run calculation) -> Observation -> Thought (interpret result)

**Troubleshooting:** Thought (hypothesis) -> Action (test/check) -> Observation -> Thought (refine diagnosis)

### Key Takeaway

ReAct combines the reasoning capabilities of chain-of-thought with the ability to take actions and observe real-world results. It is the fundamental pattern behind AI agents and is essential for tasks that require factual grounding, multi-step research, or tool use.`,
    },
    {
      id: "pe-auto-cot",
      slug: "auto-cot",
      title: "Automatic Chain-of-Thought (Auto-CoT)",
      content: `## Automatic Chain-of-Thought (Auto-CoT)

Manual chain-of-thought prompting requires you to write out reasoning examples by hand. **Auto-CoT**, introduced by Zhang et al. (2022), automates this process by having the LLM **generate its own reasoning chains** which are then used as few-shot examples.

### The Problem with Manual CoT

Creating high-quality CoT examples is time-consuming and error-prone:
- You need to write step-by-step reasoning for each example
- Poor examples can hurt more than help
- Different tasks need different reasoning styles
- It does not scale when you have many task types

### How Auto-CoT Works

The Auto-CoT pipeline has two stages:

**Stage 1: Question Clustering**
Group your questions by similarity so you get diverse, representative examples:

\`\`\`
Cluster 1 (arithmetic): "What is 15% of 200?", "If 3 apples cost $2.40..."
Cluster 2 (logic): "All cats are animals. Some animals are pets..."
Cluster 3 (comparison): "Which country has a larger population..."
\`\`\`

**Stage 2: Reasoning Chain Generation**
For each cluster, select a representative question and prompt the model with "Let's think step by step" to generate the chain:

\`\`\`
Q: What is 15% of 200?
A: Let's think step by step.
15% means 15/100.
15/100 x 200 = 15 x 2 = 30.
The answer is 30.
\`\`\`

These auto-generated chains become your few-shot examples.

### Implementing Auto-CoT

Here is the practical workflow:

\`\`\`
Step 1: Collect 20-50 representative questions from your task domain

Step 2: Cluster them (using embeddings or simple keyword matching)

Step 3: For each cluster, pick one question and run:
  "[question]\\nLet's think step by step."

Step 4: Verify the generated reasoning is correct (critical!)

Step 5: Assemble the verified examples into your few-shot prompt template
\`\`\`

**Practical example — building an Auto-CoT prompt for math:**

\`\`\`
# Auto-generated example 1 (arithmetic cluster)
Q: A store sells shirts for $25 each. During a sale, they offer 20% off. What is the sale price?
A: Let's think step by step.
The discount is 20% of $25.
20% of $25 = 0.20 x 25 = $5.
Sale price = $25 - $5 = $20.
The answer is $20.

# Auto-generated example 2 (rate/ratio cluster)
Q: A car travels 180 miles in 3 hours. What is its average speed?
A: Let's think step by step.
Average speed = total distance / total time.
Average speed = 180 miles / 3 hours = 60 mph.
The answer is 60 mph.

# Auto-generated example 3 (multi-step cluster)
Q: [your actual question here]
A: Let's think step by step.
\`\`\`

### Why Clustering Matters

Without clustering, you might accidentally select examples that are all the same type. Diversity in examples is crucial:

\`\`\`
# Bad: All examples are simple arithmetic (no diversity)
Example 1: 5 + 3 = 8
Example 2: 12 - 4 = 8
Example 3: 7 x 2 = 14

# Good: Diverse examples from different clusters
Example 1: Simple arithmetic -> "15% of 200 = 30"
Example 2: Rate problem -> "180 miles / 3 hours = 60 mph"
Example 3: Multi-step -> "Buy 3 at $5, get 20% off total..."
\`\`\`

### Auto-CoT vs. Manual CoT

| Aspect | Manual CoT | Auto-CoT |
|--------|-----------|----------|
| Setup time | High (write examples by hand) | Low (model generates them) |
| Quality control | Full control | Need to verify generated chains |
| Scalability | Poor (new examples per domain) | Good (automate across domains) |
| Performance | Slightly higher (human-optimized) | Comparable (within 1-2%) |

### Quality Verification

Auto-generated reasoning chains can contain errors. Always verify:

1. **Check the math** — Does each step follow logically?
2. **Check the answer** — Is the final answer correct?
3. **Check the format** — Is the reasoning clear and well-structured?
4. **Discard bad chains** — Regenerate if the reasoning is flawed

### Key Takeaway

Auto-CoT removes the manual effort of writing reasoning examples by leveraging the model to generate its own chains. Combined with question clustering for diversity, it produces few-shot prompts that rival hand-crafted examples while scaling across many task types.`,
    },
    {
      id: "pe-prompt-chaining",
      slug: "prompt-chaining",
      title: "Prompt Chaining",
      content: `## Prompt Chaining

Prompt chaining breaks a complex task into a **sequence of simpler prompts**, where the output of one prompt becomes the input to the next. It is the simplest form of AI workflow orchestration and is essential for building reliable LLM applications.

### Why Chain Prompts?

A single monolithic prompt for a complex task is fragile:
- The model may lose focus partway through
- Errors in early reasoning corrupt everything that follows
- You cannot debug or retry individual steps
- Quality degrades as prompt length increases

Chaining solves all of these problems.

### The Basic Pattern

\`\`\`
[Input] -> Prompt 1 -> [Output 1] -> Prompt 2 -> [Output 2] -> Prompt 3 -> [Final Output]
\`\`\`

Each prompt is focused, testable, and can be independently improved.

### Example: Research Report Generation

Instead of one massive prompt, chain three focused prompts:

**Prompt 1: Extract key topics**
\`\`\`
Read the following article and extract the 5 most important topics discussed. Return them as a numbered list.

Article: [article text]
\`\`\`

**Prompt 2: Research each topic** (uses Prompt 1 output)
\`\`\`
For each of the following topics, provide:
- A 2-sentence summary
- One supporting statistic or fact
- One counter-argument or limitation

Topics:
[output from Prompt 1]
\`\`\`

**Prompt 3: Synthesize into report** (uses Prompt 2 output)
\`\`\`
Using the research below, write a 500-word executive summary. Structure it with an introduction, key findings, and recommendations.

Research:
[output from Prompt 2]
\`\`\`

### Chaining Patterns

**1. Sequential Pipeline:**
\`\`\`
Extract -> Transform -> Generate -> Review
\`\`\`
Each step has one input and one output. The simplest pattern.

**2. Fan-Out / Fan-In:**
\`\`\`
                   -> Analyze Aspect A ->
[Input] -> Split  -> Analyze Aspect B  -> Merge -> [Output]
                   -> Analyze Aspect C ->
\`\`\`
Split a task into parallel sub-tasks, then merge the results.

**3. Conditional Routing:**
\`\`\`
[Input] -> Classify -> if (type A) -> Prompt A -> [Output]
                    -> if (type B) -> Prompt B -> [Output]
                    -> if (type C) -> Prompt C -> [Output]
\`\`\`
Route inputs to different prompts based on a classification step.

**4. Iterative Refinement:**
\`\`\`
[Draft] -> Critique -> Revise -> Critique -> Revise -> [Final]
\`\`\`
Generate, evaluate, and refine in a loop.

### Implementing a Chain

\`\`\`python
# Pseudocode for a prompt chain
def research_chain(article):
    # Step 1: Extract topics
    topics = llm.complete(f"Extract 5 key topics from:\\n{article}")

    # Step 2: Research each topic
    research = llm.complete(f"For each topic, provide summary and facts:\\n{topics}")

    # Step 3: Write report
    report = llm.complete(f"Write an executive summary from:\\n{research}")

    return report
\`\`\`

### Chain Design Best Practices

| Practice | Why |
|----------|-----|
| Keep each prompt focused on one task | Reduces errors, improves quality |
| Include validation between steps | Catch errors before they cascade |
| Log intermediate outputs | Essential for debugging |
| Design prompts that are independently testable | Faster iteration |
| Use structured output (JSON) between steps | Easier to parse and pass along |

### When to Chain vs. Single Prompt

**Use a single prompt when:**
- The task is simple and well-defined
- Output is short (< 500 tokens)
- No intermediate verification is needed

**Use chaining when:**
- The task has multiple distinct phases
- You need to verify intermediate results
- Different steps benefit from different system prompts or temperatures
- The total output would exceed the model's effective context window

### Validation Gates

Insert checks between chain steps:

\`\`\`
Step 1 output -> Validation: "Does this output contain exactly 5 items?"
  -> If yes: proceed to Step 2
  -> If no: retry Step 1 with refined prompt
\`\`\`

### Key Takeaway

Prompt chaining is how you build reliable, debuggable LLM workflows. Break complex tasks into focused steps, pass structured output between them, and validate at each stage. It is the foundational architecture pattern for production LLM applications.`,
    },
  ],
};
