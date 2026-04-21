import { Module } from "../types";

export const agentFundamentalsModule: Module = {
  id: "agent-fundamentals",
  title: "Agent Fundamentals",
  description: "Understand what AI agents are, how they differ from chatbots, and explore the major architectures and frameworks powering modern agentic systems.",
  lessons: [
    {
      id: "af-what-are-agents",
      slug: "what-are-ai-agents",
      title: "What Are AI Agents?",
      content: `## What Are AI Agents?

A **chatbot** answers your question and stops. An **AI agent** answers your question, realizes it needs more information, searches the web, writes code to verify its reasoning, notices an error, corrects itself, and then gives you a final answer — all without you asking twice.

That difference is the entire field of agentic AI.

\`\`\`concept
{ "title": "AI Agent — Canonical Definition", "variant": "mental-model", "content": "An AI agent is a software system that uses an LLM as its reasoning engine to autonomously perceive its environment, plan a course of action, execute steps through tools, and iterate based on feedback — until a goal is achieved. Unlike a chatbot, it is not limited to a single prompt-response exchange." }
\`\`\`

### Agents vs. Chatbots: A Clear Line

The distinction isn't about how smart the model is — it's about autonomy and action.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Chatbot", "code": "User: Summarize this PDF for me.\\nBot: [reads PDF text from message]\\nBot: Here is a summary...\\n\\n# One prompt. One response. Done.\\n# Cannot fetch the PDF itself.\\n# Cannot verify claims.\\n# Cannot retry if wrong." }, "after": { "label": "AI Agent", "code": "User: Summarize the Q4 report from our Google Drive.\\nAgent: [tool: search_drive('Q4 report')] -> found report.pdf\\nAgent: [tool: read_pdf('report.pdf')] -> 42 pages extracted\\nAgent: [reasoning: identify key metrics...]\\nAgent: [tool: web_search('industry benchmarks Q4 2025')] -> comparing\\nAgent: Here is the summary with industry context...\\n\\n# Multi-step. Tool-using. Self-directed." } }
\`\`\`

### The Agent Loop

Every AI agent — regardless of framework or architecture — runs the same fundamental cycle. This is sometimes called the **ReAct loop** (Reason + Act):

\`\`\`steps
{ "title": "The Agent Loop", "steps": [ { "title": "Perceive", "content": "The agent receives input: a user query, tool output, environment state, or feedback from a previous action. This becomes its current *observation*." }, { "title": "Reason", "content": "The LLM processes the observation and decides what to do next. It may break the goal into sub-tasks, select a tool, or determine the task is complete." }, { "title": "Act", "content": "The agent executes the chosen action — calling a web search API, running code, querying a database, writing a file, or calling another agent." }, { "title": "Observe", "content": "The result of the action is fed back into the agent's context. This updated state becomes the next *Perceive* step." }, { "title": "Repeat or Stop", "content": "The agent loops until: (a) the goal is achieved, (b) a stopping condition is met, or (c) maximum iterations are reached. Most production agents enforce explicit stopping rules." } ] }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why Stopping Rules Matter", "content": "Agents operate within **predefined boundaries** — tools, prompts, and explicit stopping rules set by developers. This is conditional automation, not open-ended autonomy. Skipping guardrails is how agents cause real-world harm (deleting files, sending emails, making purchases). Every agent you build needs a stopping condition." }
\`\`\`

### The Agent Spectrum

Not every problem needs a fully autonomous agent. Real systems live on a spectrum — and moving up the spectrum means more power, more cost, and more things that can go wrong.

\`\`\`tabs
{ "tabs": [ { "label": "Level 0 — LLM Call", "icon": "💬", "content": "**Single prompt → single response. No tools, no loops.**\\n\\nExample: Asking GPT to explain a concept.\\n\\n- Latency: lowest\\n- Cost: lowest\\n- Reliability: highest\\n- Use when: the task fits in one response" }, { "label": "Level 1 — Tool Use", "icon": "🔧", "content": "**LLM can invoke functions in a single turn.**\\n\\nExample: A model that can call \`get_weather(city)\` or \`search_web(query)\` within one response.\\n\\n- One round of tool calls, then done\\n- OpenAI function calling, Claude tool use\\n- Use when: a single lookup or calculation is needed" }, { "label": "Level 2 — ReAct Agent", "icon": "🔄", "content": "**LLM reasons and acts in a loop until done.**\\n\\nExample: GPT Researcher — searches, synthesizes, searches again for gaps, writes report.\\n\\n- Multiple tool calls across multiple steps\\n- Can self-correct based on observations\\n- Latency and cost scale with steps\\n- Use when: tasks require multi-step problem-solving" }, { "label": "Level 3 — Multi-Agent", "icon": "🤝", "content": "**Multiple specialized agents collaborate.**\\n\\nExample: Devin — a planning agent decomposes the task, a coding agent writes code, a testing agent runs tests, an orchestrator coordinates.\\n\\n- Agents can run in parallel\\n- Specialization improves reliability per sub-task\\n- Coordination overhead adds complexity\\n- Use when: tasks are too large or varied for one agent" } ] }
\`\`\`

### Real-World Agents in Production

| Agent | Architecture | What It Does |
|-------|-------------|--------------|
| **Claude Code** | ReAct | Reads codebases, edits files, runs tests, creates commits |
| **Devin** | Multi-Agent | Autonomous software engineer: plans, codes, debugs |
| **GPT Researcher** | ReAct | Searches the web, synthesizes research reports |
| **AutoGPT** | ReAct | General-purpose: decomposes goals into sub-tasks |

### Major Agent Architectures

The research field distinguishes three foundational approaches. Most production systems today use the hybrid model:

\`\`\`tabs
{ "tabs": [ { "label": "Reactive", "icon": "⚡", "content": "**Maps situations directly to actions. No internal world model.**\\n\\n- Fast and deterministic\\n- Great for real-time systems\\n- Cannot plan ahead or learn from history\\n\\nAnalogy: a smoke detector — detects smoke, triggers alarm. No planning involved." }, { "label": "Deliberative", "icon": "🧠", "content": "**Builds an internal symbolic model of the world, then plans.**\\n\\n- Strategic multi-step reasoning\\n- Can anticipate consequences\\n- Computationally expensive, slower response\\n\\nAnalogy: a chess engine — builds a game tree, evaluates positions, picks the best move." }, { "label": "Hybrid (Production)", "icon": "🏗️", "content": "**Combines reactive speed with deliberative planning.**\\n\\nHierarchical structure:\\n- Lower layers handle immediate reactions (tool calls, error recovery)\\n- Higher layers manage planning and goal decomposition\\n\\nThis is what LangGraph, AutoGen, and CrewAI implement. Most production agents use hybrid approaches." } ] }
\`\`\`

### Key Frameworks (2026)

| Framework | Best For | Notable Stats |
|-----------|---------|---------------|
| **LangChain** | Custom LLM workflows, RAG pipelines | Most widely adopted |
| **AutoGen** (Microsoft) | Multi-agent conversation, event-driven | 54,600+ GitHub stars |
| **CrewAI** | Role-based multi-agent orchestration | 44,300+ GitHub stars |
| **LangGraph** | Stateful, cyclical agent graphs | Part of LangChain ecosystem (2024) |

\`\`\`callout
{ "type": "tip", "title": "Framework vs. From Scratch", "content": "Frameworks give you memory, state management, tool wiring, and retry logic for free. In this course you'll learn the concepts first (so you understand *why* frameworks make the choices they do), then use them to build real systems." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "What is the fundamental difference between a chatbot and an AI agent?", "options": [ "Chatbots use smaller models than agents", "Agents can reason, use tools, and act in a loop toward a goal; chatbots are limited to single prompt-response exchanges", "Agents always require more than one AI model working together", "Chatbots cannot understand complex questions" ], "answer": 1, "explanation": "The core distinction is autonomy and action: an agent perceives, reasons, acts, and iterates across multiple steps using external tools — a chatbot maps a prompt to a response and stops." }, { "question": "A developer builds a system where an LLM searches the web, reads the results, then searches again to fill in gaps, and finally writes a report. What level is this on the Agent Spectrum?", "options": [ "Level 0 — LLM Call", "Level 1 — Tool Use", "Level 2 — ReAct Agent", "Level 3 — Multi-Agent System" ], "answer": 2, "explanation": "The system loops: search → observe → reason → search again → write. This is the ReAct loop (Reason + Act), which defines a Level 2 agent. No multiple collaborating agents are involved, so it's not Level 3." }, { "question": "Why do production AI agents require explicit stopping rules?", "options": [ "LLMs cannot determine on their own when a task is finished, so they loop forever by default", "Stopping rules reduce the cost of API calls", "Agents operate within conditional automation boundaries — without stopping rules, unconstrained autonomy can lead to unintended real-world actions", "Stopping rules are only needed for multi-agent systems, not single agents" ], "answer": 2, "explanation": "Agent autonomy is conditional, not absolute. Without stopping rules, an agent might take harmful actions (sending emails, deleting files, making purchases) while pursuing its goal. This is a fundamental safety consideration in agentic system design." }, { "question": "Which architecture type does AutoGen (Microsoft) implement for its multi-agent collaboration?", "options": [ "Pure reactive architecture", "Pure deliberative architecture", "Hybrid architecture with event-driven coordination", "Level 1 tool-augmented LLM" ], "answer": 2, "explanation": "AutoGen uses an event-driven, hybrid architecture — combining reactive message passing between agents with deliberative reasoning inside each agent. Most production frameworks (LangGraph, CrewAI, AutoGen) use hybrid approaches." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "An AI agent uses an LLM as a reasoning engine to perceive, plan, act, and iterate — it's not a chatbot with more features, it's a fundamentally different system design.", "The agent loop (Perceive → Reason → Act → Observe → Repeat) is the universal pattern. Every framework you encounter is an implementation of this loop.", "The Agent Spectrum (Levels 0–3) lets you match architecture to problem complexity — don't reach for multi-agent systems when a single ReAct loop will do.", "More autonomy means more power and more risk. Stopping rules, tool guardrails, and explicit boundaries are not optional — they're what makes agents deployable.", "Hybrid architectures dominate production: reactive speed at the bottom, deliberative planning at the top. This is the model behind LangGraph, AutoGen, and CrewAI." ] }
\`\`\`

> **Resource**: [Microsoft AI Agents for Beginners](https://github.com/microsoft/ai-agents-for-beginners) — An 18-lesson open-source curriculum covering agent fundamentals, tool use, RAG, and multi-agent patterns. A strong companion to this course.`,
    },
    {
      id: "af-agent-vs-chatbot",
      slug: "agent-vs-chatbot",
      title: "Agent vs Chatbot",
      content: `## Agent vs Chatbot

The terms "chatbot" and "agent" are often used interchangeably, but they represent fundamentally different architectures. Understanding the distinction is critical for choosing the right approach for your application.

### Chatbot: Stateless Q&A

A traditional LLM chatbot is essentially a sophisticated question-answering system:

\`\`\`
User: "What is the capital of France?"
Chatbot: "The capital of France is Paris."
\`\`\`

**Characteristics of chatbots:**
- Single turn or multi-turn conversation
- No ability to take actions in the real world
- No access to external tools or data sources (unless hardcoded)
- Output is always text
- The human drives every step

### Agent: Autonomous Task Completion

An agent receives a goal and works independently to achieve it:

\`\`\`
User: "Find all bugs in this codebase and fix them"
Agent:
  → Reads the project structure
  → Runs the test suite, finds 3 failing tests
  → Analyzes root causes
  → Edits 2 files to fix the bugs
  → Re-runs tests to verify
  → Reports: "Fixed 3 bugs in auth.py and database.py"
\`\`\`

### Side-by-Side Comparison

| Feature | Chatbot | Agent |
|---------|---------|-------|
| **Control flow** | Human-driven | Agent-driven |
| **Tools** | None or limited | Multiple, dynamic |
| **Iteration** | Single response | Loop until goal met |
| **State** | Conversation history | Working memory + tool state |
| **Output** | Text only | Text + actions + artifacts |
| **Error handling** | Returns error text | Retries with different approach |
| **Autonomy** | None | Partial to full |

### The "Inner Monologue" Difference

When a chatbot encounters a hard question, it guesses or says "I don't know." When an agent encounters a hard question:

\`\`\`python
# Agent's internal reasoning
thought = "I don't know the answer. Let me search for it."
result = search_tool("latest GDP figures 2025")
thought = "The search returned 5 results. Let me verify with a second source."
result2 = search_tool("World Bank GDP data 2025")
thought = "Both sources agree. I can now give a confident answer."
\`\`\`

### When to Use What

**Use a chatbot when:**
- The task is conversational (customer support, FAQ)
- No external actions are needed
- Latency must be minimal (single LLM call)
- You want full human control over every step

**Use an agent when:**
- The task requires multiple steps
- External tools or data sources are needed
- The user cares about the result, not the process
- Self-correction and iteration add value

### Hybrid Approaches

Many production systems blend both patterns. A customer support bot might be a chatbot for simple queries but escalate to an agent for complex tasks like processing refunds or investigating account issues.

### Key Takeaway

Chatbots respond. Agents act. The fundamental difference is autonomy — agents can decide what to do next, use tools to do it, and iterate until the job is done. Most modern AI applications are moving toward agentic architectures.`,
    },
    {
      id: "af-architectures",
      slug: "agent-architectures",
      title: "Agent Architectures (ReAct, Plan-and-Execute)",
      content: `## Agent Architectures: ReAct and Plan-and-Execute

How an agent reasons and acts is determined by its **architecture** — the pattern governing its control flow. Two dominant architectures have emerged from research and production use: **ReAct** and **Plan-and-Execute**. Choosing between them shapes everything: token cost, debuggability, reliability, and how the agent handles surprises.

\`\`\`concept
{ "title": "Architecture = Control Flow", "variant": "mental-model", "content": "An agent architecture is not the model or the tools — it's the *loop*. It decides: when does the agent think? When does it act? Does it plan ahead or react step-by-step? The same LLM can behave very differently depending on which loop wraps it." }
\`\`\`

---

## Architecture 1: ReAct (Reasoning + Acting)

ReAct interleaves **reasoning** (thinking) with **acting** (tool use) in a tight loop. The agent produces one thought, takes one action, observes the result, then thinks again. There is no upfront plan — the next step is always informed by the latest observation.

\`\`\`trace
{ "title": "ReAct Loop — Calculating AAPL P/E Ratio", "language": "python", "code": "# ReAct agent processing the query:\\n# 'What is Apple's current P/E ratio?'\\n\\nthought_1 = 'I need to find the current stock price of AAPL.'\\naction_1  = search('AAPL stock price today')\\nobs_1     = 'AAPL is trading at $198.50'\\n\\nthought_2 = 'Now I need the EPS to compute the P/E ratio.'\\naction_2  = search('AAPL earnings per share 2025')\\nobs_2     = 'AAPL EPS is $6.42'\\n\\nthought_3 = 'P/E = 198.50 / 6.42 = 30.9. I can answer now.'\\nanswer    = 'Apple P/E ratio is approximately 30.9'", "frames": [ { "line": 3, "vars": { "thought": "I need the stock price" }, "note": "Agent reasons about what information it needs first", "stdout": "" }, { "line": 4, "vars": { "action": "search('AAPL stock price today')" }, "note": "Agent calls a tool based on its current thought", "stdout": "" }, { "line": 5, "vars": { "obs_1": "$198.50" }, "note": "Observation feeds directly into the next thought — no plan needed", "stdout": "Observation: AAPL is trading at $198.50" }, { "line": 7, "vars": { "thought": "Now I need EPS" }, "note": "Previous observation shapes the next reasoning step", "stdout": "" }, { "line": 8, "vars": { "action": "search('AAPL EPS 2025')" }, "note": "Second tool call — only triggered because step 1 succeeded", "stdout": "" }, { "line": 9, "vars": { "obs_2": "$6.42" }, "note": "With both pieces, the agent can now compute the answer", "stdout": "Observation: AAPL EPS is $6.42" }, { "line": 11, "vars": { "pe_ratio": 30.9 }, "note": "Agent performs reasoning inline — no separate 'calculator' needed", "stdout": "" }, { "line": 12, "vars": {}, "note": "Final answer delivered after 2 tool calls and 3 reasoning steps", "stdout": "Answer: Apple's P/E ratio is approximately 30.9" } ], "speed": 900 }
\`\`\`

**Strengths of ReAct:**
- Simple to implement — just a loop with \`Thought → Action → Observation\`
- Naturally self-correcting — each observation informs the next thought
- Works well when the next step truly depends on the previous result

**Weaknesses of ReAct:**
- Can get stuck in loops (repeating the same action)
- No upfront planning — may take inefficient paths on structured tasks
- Token-expensive for long tasks (full history carried in context)

---

## Architecture 2: Plan-and-Execute

Plan-and-Execute **separates** planning from execution. The agent first produces a complete plan, then executes each step independently. The planner and executor can even be different models — a powerful, expensive model plans; a cheaper, faster model executes.

\`\`\`steps
{ "title": "Plan-and-Execute: AAPL P/E Ratio", "steps": [ { "title": "Phase 1 — Plan", "content": "The planner LLM receives the task and outputs a structured plan:\\n\\n1. Search for AAPL current stock price\\n2. Search for AAPL earnings per share\\n3. Calculate P/E ratio\\n4. Return the result\\n\\nThis plan is inspectable — you can log it, validate it, or show it to the user before execution begins." }, { "title": "Phase 2 — Execute Step 1", "content": "\`search('AAPL stock price')\` → **$198.50**\\n\\nThe executor runs each step independently. Steps with no dependencies on each other can potentially run in **parallel**." }, { "title": "Phase 2 — Execute Step 2", "content": "\`search('AAPL EPS 2025')\` → **$6.42**\\n\\nStep 2 is also independent of step 1, so in a parallelized implementation both searches could fire simultaneously." }, { "title": "Phase 2 — Execute Step 3", "content": "\`calculate(198.50 / 6.42)\` → **30.9**\\n\\nStep 3 depends on steps 1 and 2, so it waits. The executor uses a simple dependency graph to determine order." }, { "title": "Phase 3 — Return", "content": "\\"Apple's P/E ratio is approximately **30.9**\\"\\n\\nIf any step returned an unexpected result, the agent can **re-plan** from that point rather than starting over — this is the key to making Plan-and-Execute robust in production." } ] }
\`\`\`

**Strengths of Plan-and-Execute:**
- More efficient for well-defined tasks — parallel execution possible
- Easier to debug: you can inspect the plan before any tools fire
- Better for long-horizon tasks where the goal is clear upfront
- Planner and executor can be different models (cost optimization)

**Weaknesses of Plan-and-Execute:**
- Plan may become invalid if early steps return unexpected results
- Requires a re-planning capability for robustness
- More complex to implement than a simple ReAct loop

---

## Comparing the Two Architectures

\`\`\`tabs
{ "tabs": [ { "label": "Side-by-Side", "icon": "⚖️", "content": "| Aspect | ReAct | Plan-and-Execute |\\n|--------|-------|------------------|\\n| **Planning** | None (step-by-step) | Upfront plan |\\n| **Adaptability** | High — reacts each step | Requires re-planning |\\n| **Efficiency** | Lower — no parallelism | Higher — can parallelize |\\n| **Best for** | Exploratory tasks | Well-defined tasks |\\n| **Debuggability** | Hard — state evolves implicitly | Easy — plan is inspectable |\\n| **Complexity** | Simple | Moderate |\\n| **Token cost** | High (full history in context) | Lower per step |" }, { "label": "When to Use ReAct", "icon": "🔄", "content": "Choose **ReAct** when:\\n\\n- The task is **exploratory** — you don't know what steps are needed until you start\\n- Each step's output **determines** what the next step should be\\n- You want the **simplest possible implementation** to prototype quickly\\n- The task is **short** — fewer than ~5 steps before the context window bloat matters\\n\\n**Example tasks:** answering open-ended research questions, debugging unknown errors, interactive Q&A with tool use." }, { "label": "When to Use Plan-and-Execute", "icon": "📋", "content": "Choose **Plan-and-Execute** when:\\n\\n- The task is **well-defined** with clear sub-goals\\n- Some steps are **independent** and could run in parallel\\n- You need the plan to be **auditable** (compliance, safety, user review)\\n- The task is **long-horizon** — 10+ steps where ReAct's context window cost is prohibitive\\n\\n**Example tasks:** generating a full report, orchestrating multi-step data pipelines, code generation with tests and review." } ] }
\`\`\`

---

## Other Notable Architectures

\`\`\`collapse
{ "title": "Deep Dive: Reflexion, LATS, and LLMCompiler", "content": "Three architectures extend the ideas above in different directions:\\n\\n### Reflexion\\nAfter each attempt, the agent generates a **reflection** — a self-critique of what went wrong and what to try differently. The reflection is stored in a short-term memory buffer and conditions the next attempt. This turns a single-shot agent into an iterative improver without any external evaluator.\\n\\n**Best for:** tasks with a clear success/failure signal (coding, math, structured generation).\\n\\n### LATS (Language Agent Tree Search)\\nInstead of committing to one action at each step, LATS **branches** — exploring multiple possible actions like a tree search (similar to Monte Carlo Tree Search). Each branch is evaluated, and the best-scoring path is followed.\\n\\n**Best for:** tasks where you want to maximize quality over speed, and where evaluating candidate paths is feasible.\\n\\n### LLMCompiler\\nLLMCompiler analyzes the **dependency graph** of a task up front and automatically parallelizes tool calls that have no dependencies on each other. Unlike Plan-and-Execute (which parallelizes manually), LLMCompiler derives the execution schedule from the task structure.\\n\\n**Best for:** tasks with many independent sub-tasks where latency matters (e.g., answering questions requiring multiple independent lookups)." }
\`\`\`

---

## Choosing an Architecture

\`\`\`callout
{ "type": "tip", "title": "The Production Hybrid", "content": "Most production agents don't pick just one architecture. A common pattern:\\n\\n1. **Plan first** (Plan-and-Execute) for efficiency and auditability\\n2. **Execute with ReAct** at each step — so individual steps can adapt if their sub-task is exploratory\\n3. **Re-plan** when an observation deviates significantly from expectations\\n\\nThis gives you upfront structure *and* step-level adaptability." }
\`\`\`

---

\`\`\`quiz
{ "title": "Test Your Understanding: Agent Architectures", "questions": [ { "question": "Which architecture carries the full thought/action/observation history in the LLM's context window throughout execution?", "options": [ "Plan-and-Execute", "ReAct", "LLMCompiler", "Reflexion" ], "answer": 1, "explanation": "ReAct keeps the full Thought→Action→Observation chain in context at every step. This is what makes it self-correcting but also increasingly token-expensive for long tasks." }, { "question": "In Plan-and-Execute, which phase creates the opportunity for parallelizing tool calls?", "options": [ "The reflection phase", "The re-planning phase", "The execution phase — independent steps can run concurrently", "The planning phase — the planner issues parallel searches" ], "answer": 2, "explanation": "The execution phase runs each planned step. Steps with no dependency on each other can execute in parallel, which is a key efficiency advantage over ReAct's strictly sequential loop." }, { "question": "A customer support agent must handle an open-ended complaint: it doesn't know whether it needs to check order status, refund history, or shipping data until it starts investigating. Which architecture fits best?", "options": [ "Plan-and-Execute — it produces a structured plan first", "ReAct — each observation determines the next action adaptively", "LLMCompiler — it parallelizes all lookups immediately", "Reflexion — it retries after each failed attempt" ], "answer": 1, "explanation": "ReAct shines for exploratory tasks where the required steps are unknown upfront. Each observation (e.g., 'order was delivered') shapes the next action (e.g., 'check refund eligibility'), making the loop naturally adaptive." }, { "question": "What is the primary weakness that Plan-and-Execute must address to be robust in production?", "options": [ "It cannot use more than one tool", "The plan may become invalid if an early step returns unexpected results — requiring re-planning", "It always runs more slowly than ReAct", "It cannot inspect its own outputs" ], "answer": 1, "explanation": "Because the plan is generated upfront, it assumes certain results. If step 2 returns an error or a value outside the expected range, the remaining plan steps may be based on false assumptions. Production implementations add a re-planning trigger to handle this." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "ReAct is the 'think-then-act' loop — simple, adaptive, and widely used for exploratory tasks where each step depends on the previous observation.", "Plan-and-Execute separates planning from execution, enabling parallelism, auditability, and better token efficiency for long-horizon tasks.", "ReAct's weakness is inefficiency and loop-getting-stuck; Plan-and-Execute's weakness is that its upfront plan can become stale — robust agents add re-planning.", "Reflexion, LATS, and LLMCompiler extend these base patterns with self-critique, tree search, and automatic dependency-based parallelism.", "Most production agents use a hybrid: plan first for structure, execute with step-level ReAct for adaptability, and re-plan when observations deviate from expectations." ] }
\`\`\``,
    },
    {
      id: "af-frameworks",
      slug: "agentic-frameworks-overview",
      title: "Agentic Frameworks Overview",
      content: `You don't need to build agents from scratch. Several mature frameworks provide the core building blocks — tool integration, memory, orchestration, and multi-agent coordination — so you can focus on logic rather than infrastructure.

\`\`\`concept
{ "title": "What a Framework Actually Gives You", "variant": "mental-model", "content": "Think of an agentic framework as the runtime for your agent. You supply the goal and the LLM; the framework supplies state persistence across steps, tool routing and retry logic, agent-to-agent communication, and termination conditions. Without a framework, you rebuild all this plumbing from scratch on every project." }
\`\`\`

## The Major Frameworks

Four frameworks dominate the current ecosystem. Each makes different trade-offs between control granularity, simplicity, and multi-agent coordination power.

\`\`\`tabs
{ "tabs": [ { "label": "LangGraph", "icon": "🔀", "content": "**By LangChain** — builds stateful, multi-step agent workflows as directed graphs.\\n\\n**Core concepts:**\\n- **Nodes** — processing steps: LLM calls, tool calls, or pure logic\\n- **Edges** — transitions between nodes, conditional or unconditional\\n- **State** — a shared typed object that flows through every node\\n\\nThe key differentiator is **cycles**: unlike a simple pipeline, LangGraph lets the agent loop back — enabling true ReAct-style reason → act → reason iteration.\\n\\n**Best for:** Complex workflows with branching logic, cycles, and human-in-the-loop approval checkpoints." }, { "label": "CrewAI", "icon": "👥", "content": "**Role-based multi-agent orchestration** — agents work together as a crew on a shared project.\\n\\n**Core concepts:**\\n- **Agent** — a persona with a role, goal, and backstory\\n- **Task** — a unit of work assigned to a specific agent\\n- **Crew** — a team with a defined process: sequential or hierarchical\\n\\nThe abstraction is intentionally high-level: you describe *who* the agent is and *what outcome* it owns, not step-by-step mechanics.\\n\\n**Best for:** Pipelines of specialized agents (researcher → writer → editor) where each agent has a distinct identity and responsibility." }, { "label": "AutoGen", "icon": "💬", "content": "**By Microsoft** — multi-agent conversations where agents discuss problems and write/execute code to solve them.\\n\\n**Core concepts:**\\n- **ConversableAgent** — an agent that participates in group conversations\\n- **GroupChat** — multiple agents sharing a single message thread\\n- **Code execution** — agents propose code, run it, observe output, and iterate\\n\\nAutoGen's built-in code execution sandbox is its standout feature: an agent can write a Python script, run it, observe the result, and fix bugs — all autonomously.\\n\\n**Best for:** Research tasks, code generation, and review loops where agents need to debate or peer-review each other's outputs." }, { "label": "Smolagents", "icon": "🤗", "content": "**By Hugging Face** — minimal, code-first agent framework. Agents write Python to invoke tools rather than emitting JSON.\\n\\n**Core concepts:**\\n- **CodeAgent** — generates executable Python (e.g., result = search_web(query)) instead of JSON tool call payloads\\n- **ToolCallingAgent** — classic JSON-based tool calls, also supported\\n- Intentionally tiny codebase — easy to read the entire source\\n\\nInstead of a JSON blob describing a tool call, the agent writes real Python and executes it — making multi-step tool chaining natural and composable.\\n\\n**Best for:** Quick prototyping, simple single-agent workflows, and when you want minimal abstraction over the raw LLM." } ] }
\`\`\`

## How LangGraph's Cycle Works

Unlike a simple pipeline (A → B → C → done), LangGraph supports **cycles** — the core mechanism behind ReAct-style agents. After the agent acts, it can loop back to reason again until a stopping condition is met.

\`\`\`mermaid
flowchart LR
    Start([▶ Start]) --> Reason["🧠 Reason Node\\nLLM picks next action"]
    Reason --> Act["🔧 Act Node\\nExecute tool"]
    Act -->|"should_continue = continue"| Reason
    Act -->|"should_continue = end"| End([✅ END])
    style Reason fill:#4f46e5,color:#fff,stroke:#4f46e5
    style Act fill:#0891b2,color:#fff,stroke:#0891b2
\`\`\`

The \`should_continue\` function inspects the agent's state after each action and returns either \`"continue"\` (loop back) or \`"end"\` (exit). This single conditional edge is what makes the agent autonomous. Here's the full skeleton:

\`\`\`playground
{ "title": "LangGraph: ReAct Agent Skeleton", "language": "python", "code": "from langgraph.graph import StateGraph, END\\nfrom typing import TypedDict, List\\n\\n# 1. Define shared state\\nclass AgentState(TypedDict):\\n    messages: List[str]\\n    next_action: str\\n\\n# 2. Define nodes (processing steps)\\ndef reason_node(state: AgentState) -> AgentState:\\n    # Call LLM here - parse its response to decide next tool\\n    state['next_action'] = 'search'  # simplified\\n    return state\\n\\ndef act_node(state: AgentState) -> AgentState:\\n    # Dispatch to the appropriate tool\\n    state['messages'].append('Tokyo population: 13.96 million (2023)')\\n    state['next_action'] = 'finish'  # signal we are done\\n    return state\\n\\n# 3. Routing logic - loop or stop?\\ndef should_continue(state: AgentState) -> str:\\n    return 'continue' if state['next_action'] != 'finish' else 'end'\\n\\n# 4. Wire the graph\\ngraph = StateGraph(AgentState)\\ngraph.add_node('reason', reason_node)\\ngraph.add_node('act', act_node)\\ngraph.add_edge('reason', 'act')             # always: reason -> act\\ngraph.add_conditional_edges(                # conditional: act -> reason OR END\\n    'act', should_continue,\\n    {'continue': 'reason', 'end': END}\\n)\\ngraph.set_entry_point('reason')\\nagent = graph.compile()\\n\\n# 5. Run\\nresult = agent.invoke({\\n    'messages': ['What is the population of Tokyo?'],\\n    'next_action': ''\\n})\\nprint(result['messages'])\\n# ['What is the population of Tokyo?', 'Tokyo population: 13.96 million (2023)']", "runnable": false }
\`\`\`

## Framework Comparison

| Framework | Multi-Agent | Graph / Cycles | Code Execution | Complexity |
|-----------|:-----------:|:--------------:|:--------------:|:----------:|
| **LangGraph** | Yes | Yes (core feature) | Via tools | Medium |
| **CrewAI** | Yes (core) | Limited | Via tools | Low |
| **AutoGen** | Yes (core) | Limited | Built-in | Medium |
| **Smolagents** | Limited | No | Core feature | Low |

## How to Choose

\`\`\`steps
{ "title": "Picking the Right Framework", "steps": [ { "title": "Building a single complex agent?", "content": "→ **LangGraph**\\n\\nWhen you need fine-grained control over a single agent's decision loop — branching, retries, human approval gates, or custom cycle termination — LangGraph's graph model gives you the most expressive control flow." }, { "title": "Coordinating specialized agent teams?", "content": "→ **CrewAI**\\n\\nWhen your task naturally decomposes into roles (researcher, analyst, writer, reviewer), CrewAI's high-level role abstraction maps directly to that structure. Sequential or hierarchical execution is a single parameter." }, { "title": "Need agents that discuss, debate, or co-write code?", "content": "→ **AutoGen**\\n\\nWhen the value comes from agents challenging each other — peer review, adversarial verification, collaborative debugging — AutoGen's GroupChat model shines. Its built-in code execution sandbox makes it especially powerful for autonomous coding tasks." }, { "title": "Want the simplest possible setup?", "content": "→ **Smolagents**\\n\\nWhen you need a working agent in under 50 lines of code, Smolagents' minimal surface area and code-as-action model gets you there fastest. Ideal for learning and rapid prototyping before committing to a heavier framework." }, { "title": "Need maximum control?", "content": "→ **Build from scratch with raw LLM APIs**\\n\\nFrameworks are abstractions — they make common cases easy but can obscure edge cases. If you need complete control over every token, retry, and state transition, building directly on top of the LLM API remains a valid choice." } ] }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "Which framework was created by Microsoft and allows agents to autonomously write and execute code as part of solving a problem?", "options": ["LangGraph", "CrewAI", "AutoGen", "Smolagents"], "answer": 2, "explanation": "AutoGen (by Microsoft) is built around ConversableAgent and GroupChat. Its built-in code execution sandbox lets agents write, run, and debug code autonomously — no external tool setup required." }, { "question": "What is the key structural feature that distinguishes LangGraph from a simple linear pipeline?", "options": ["It supports multiple agents working in parallel roles", "Conditional edges can route back to earlier nodes, creating cycles", "It has a built-in Python code execution sandbox", "It uses role-based agent personas with backstories"], "answer": 1, "explanation": "LangGraph supports cycles via conditional edges. After the act node, the graph can route back to the reason node until the stopping condition is met — this is how ReAct-style reason → act → reason loops are implemented." }, { "question": "Smolagents' CodeAgent pattern differs from other framework tool-calling approaches because it:", "options": ["Requires a GPU to run locally", "Generates executable Python to invoke tools rather than JSON tool call payloads", "Only works with Hugging Face-hosted models", "Uses a hidden graph structure to manage workflow state"], "answer": 1, "explanation": "Smolagents' CodeAgent generates real Python code (e.g., result = search_web(query)) rather than a JSON object describing the tool call. This makes multi-step chaining natural — agents can use Python variables to pass results between tool calls." }, { "question": "You're building a content pipeline with three specialized agents: one that researches, one that writes, and one that edits. Which framework's design maps most directly to this structure?", "options": ["LangGraph — for fine-grained graph control flow", "CrewAI — for role-based multi-agent crews with defined processes", "AutoGen — for multi-agent group chat and debate", "Smolagents — for its minimal code-first abstraction"], "answer": 1, "explanation": "CrewAI is designed precisely for this pattern. Each agent gets a role, goal, and backstory, and the Crew runs them sequentially (researcher → writer → editor) with process='sequential'. The high-level role abstraction maps directly to the team structure." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["Frameworks handle state management, tool routing, and orchestration — so you focus on logic, not plumbing.", "LangGraph excels at single-agent workflows with cycles and branching; CrewAI excels at coordinating teams of specialized agents.", "AutoGen's built-in code execution sandbox makes it the strongest choice when agents need to write, run, and iterate on code autonomously.", "Smolagents' code-as-action model trades multi-agent power for simplicity — ideal for learning and fast prototyping.", "Start with a simpler framework (CrewAI or Smolagents), then graduate to LangGraph when you need finer control over complex production workflows."] }
\`\`\`

> **Resource:** [Microsoft AI Agents for Beginners — Lesson 2: Agentic Frameworks](https://github.com/microsoft/ai-agents-for-beginners) covers framework selection in depth with hands-on notebooks for each framework covered here.`,
    },
    {
      id: "af-first-agent",
      slug: "building-your-first-agent",
      title: "Building Your First Agent",
      content: `## Building Your First Agent

Let's build a ReAct agent from scratch — no frameworks, just the core loop. By the end, you'll understand exactly what every framework is abstracting for you.

\`\`\`concept
{ "title": "The ReAct Loop", "variant": "mental-model", "content": "ReAct = Reason + Act. The agent alternates between two phases: the LLM **reasons** about what it needs next, then **acts** by calling a tool. The tool's result is fed back as an observation, and the cycle repeats. This loop — Reason → Act → Observe → Reason → ... — is the foundation of every modern AI agent." }
\`\`\`

### What We'll Build

A 50-line agent that answers questions requiring web search and math — built from first principles, so no framework magic hides what's happening.

\`\`\`steps
{ "title": "The Agent's Execution Plan", "steps": [ { "title": "Receive the question", "content": "The user asks something requiring external data or multi-step computation — e.g., *What is the square root of France's population?*" }, { "title": "LLM reasons about its next action", "content": "Given the question and tool descriptions, the model decides what to do first. It emits a structured \`TOOL: name(arg)\` response." }, { "title": "Execute the tool", "content": "Our Python loop parses the tool name and argument, calls the matching function, and captures the return value — the **observation**." }, { "title": "Feed the observation back", "content": "The observation is appended to the conversation history as a new user message. The LLM now has fresh information and reasons again." }, { "title": "Detect the stopping condition", "content": "When the LLM is confident, it emits \`ANSWER: ...\` and the loop exits. A \`max_steps\` guard prevents runaway loops." } ] }
\`\`\`

---

### Step 1: Define the Tools

Tools are ordinary Python functions. The LLM reads the **docstring** to decide when and how to invoke each one.

\`\`\`playground
{ "title": "Tool Definitions", "language": "python", "code": "import math\\nimport requests\\n\\ndef calculator(expression: str) -> str:\\n    \\"\\"\\"Evaluate a mathematical expression. Example: '2 + 3 * 4'\\"\\"\\"\\n    try:\\n        result = eval(expression, {\\"__builtins__\\": {}}, {\\"math\\": math})\\n        return str(result)\\n    except Exception as e:\\n        return \\"Error: \\" + str(e)\\n\\ndef search(query: str) -> str:\\n    \\"\\"\\"Search the web for information. Returns a summary of top results.\\"\\"\\"\\n    response = requests.get(\\n        \\"https://api.tavily.com/search\\",\\n        params={\\"query\\": query, \\"max_results\\": 3},\\n        headers={\\"Authorization\\": \\"Bearer YOUR_API_KEY\\"}\\n    )\\n    results = response.json().get(\\"results\\", [])\\n    return \\" | \\".join(r[\\"content\\"][:200] for r in results)\\n\\n# Tool registry: maps string names to Python callables\\nTOOLS = {\\n    \\"calculator\\": calculator,\\n    \\"search\\": search,\\n}", "runnable": false }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "eval() is for learning only", "content": "Never use \`eval()\` on untrusted input in production — it executes arbitrary Python code and is a code injection vector. Use a sandboxed library like \`sympy\` or a dedicated math API instead." }
\`\`\`

---

### Step 2: Build the Agent Loop

The system prompt defines the tool protocol. The loop then drives the Reason → Act → Observe cycle until the agent emits an answer or hits \`max_steps\`.

\`\`\`playground
{ "title": "The ReAct Agent Loop", "language": "python", "code": "from anthropic import Anthropic\\n\\nclient = Anthropic()\\n\\nSYSTEM_PROMPT = \\"\\"\\"You are a helpful agent with access to these tools:\\n- calculator(expression): Evaluate math expressions\\n- search(query): Search the web for real-world information\\n\\nTo call a tool, respond with:\\nTOOL: tool_name(argument)\\n\\nWhen you have the final answer, respond with:\\nANSWER: your answer here\\n\\nThink step by step before acting.\\"\\"\\"\\n\\ndef run_agent(user_query: str, max_steps: int = 10) -> str:\\n    messages = [{\\"role\\": \\"user\\", \\"content\\": user_query}]\\n\\n    for step in range(max_steps):\\n        response = client.messages.create(\\n            model=\\"claude-sonnet-4-20250514\\",\\n            max_tokens=1024,\\n            system=SYSTEM_PROMPT,\\n            messages=messages\\n        )\\n        text = response.content[0].text\\n        print(f\\"Step {step + 1}: {text}\\")\\n\\n        if text.startswith(\\"TOOL:\\"):\\n            # Parse \\"TOOL: calculator(math.sqrt(4))\\" into name + arg\\n            raw       = text[5:].strip()\\n            tool_name = raw.split(\\"(\\")[0]\\n            tool_arg  = raw.split(\\"(\\")[1].rstrip(\\")\\")\\n\\n            observation = TOOLS.get(tool_name, lambda _: \\"Unknown tool\\")(tool_arg)\\n\\n            messages.append({\\"role\\": \\"assistant\\", \\"content\\": text})\\n            messages.append({\\"role\\": \\"user\\",      \\"content\\": \\"Observation: \\" + observation})\\n\\n        elif \\"ANSWER:\\" in text:\\n            return text.split(\\"ANSWER:\\")[1].strip()\\n\\n        else:\\n            messages.append({\\"role\\": \\"assistant\\", \\"content\\": text})\\n            messages.append({\\"role\\": \\"user\\",      \\"content\\": \\"Continue reasoning.\\"})\\n\\n    return \\"Max steps reached without an answer.\\"", "runnable": false }
\`\`\`

---

### Step 3: Watch It Run

\`\`\`python
result = run_agent("What is the square root of the population of France?")
print(result)
\`\`\`

Step through the agent's exact execution on this query:

\`\`\`trace
{ "title": "Agent Trace: sqrt(population of France)", "language": "python", "code": "messages = [{\\"role\\": \\"user\\", \\"content\\": query}]\\nfor step in range(max_steps):\\n    text = llm(messages)\\n    if text.startswith(\\"TOOL:\\"):\\n        tool_name, tool_arg = parse(text)\\n        obs = TOOLS[tool_name](tool_arg)\\n        messages += [assistant(text), user(\\"Observation: \\" + obs)]\\n    elif \\"ANSWER:\\" in text:\\n        return text.split(\\"ANSWER:\\")[1].strip()", "frames": [ { "line": 1, "vars": { "query": "What is sqrt(population of France)?", "messages": "1 item" }, "note": "Conversation initialized with the user question", "stdout": "" }, { "line": 3, "vars": { "step": 0, "text": "TOOL: search(population of France 2025)" }, "note": "LLM reasons it needs real-world data first — emits a TOOL call", "stdout": "Step 1: I need to find France's current population.\\nTOOL: search(population of France 2025)" }, { "line": 5, "vars": { "tool_name": "search", "tool_arg": "population of France 2025", "obs": "France population ~68.4 million (2025)" }, "note": "search() executes and returns a real-world observation", "stdout": "" }, { "line": 6, "vars": { "messages": "3 items (user, assistant, observation)" }, "note": "Observation injected into history — LLM sees it on the next iteration", "stdout": "" }, { "line": 3, "vars": { "step": 1, "text": "TOOL: calculator(math.sqrt(68400000))" }, "note": "LLM now has the data it needs — reasons to compute sqrt", "stdout": "Step 2: Now I can calculate the square root.\\nTOOL: calculator(math.sqrt(68400000))" }, { "line": 5, "vars": { "tool_name": "calculator", "tool_arg": "math.sqrt(68400000)", "obs": "8270.43" }, "note": "calculator() evaluates the expression — result: 8270.43", "stdout": "" }, { "line": 8, "vars": { "step": 2, "text": "ANSWER: ~8,270" }, "note": "LLM has all required data. Emits ANSWER — loop exits cleanly.", "stdout": "Step 3: ANSWER: The square root of France's population (~68.4M) is approximately 8,270." } ], "speed": 900 }
\`\`\`

---

### What You Just Built

Every component in this 50-line agent maps directly to what production frameworks provide:

| Component | Role |
|-----------|------|
| **System prompt** | Defines available tools and the \`TOOL:\`/\`ANSWER:\` protocol |
| **Tool registry** | Maps string names → callable Python functions |
| **Agent loop** | Drives the Reason → Act → Observe cycle |
| **Observation routing** | Tool result re-entered as a user message |
| **Stopping conditions** | \`ANSWER:\` detected **or** \`max_steps\` hit |

### String Parsing vs. Structured Tool Calling

The \`TOOL:\`/\`ANSWER:\` format is simple but fragile — a stray space or extra quote breaks parsing silently. Production agents use JSON schemas:

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Text Parsing (this lesson)", "code": "if text.startswith(\\"TOOL:\\"):\\n    raw       = text[5:].strip()\\n    tool_name = raw.split(\\"(\\")[0]\\n    tool_arg  = raw.split(\\"(\\")[1].rstrip(\\")\\")\\n\\n# Breaks silently if LLM writes:\\n#   TOOL: search( france population )\\n#   TOOL: search('france population')" }, "after": { "label": "Structured Tool Calling (production)", "code": "response = client.messages.create(\\n    model=\\"claude-sonnet-4-20250514\\",\\n    tools=[{\\n        \\"name\\": \\"search\\",\\n        \\"description\\": \\"Search the web for information\\",\\n        \\"input_schema\\": {\\n            \\"type\\": \\"object\\",\\n            \\"properties\\": {\\"query\\": {\\"type\\": \\"string\\"}},\\n            \\"required\\": [\\"query\\"]\\n        }\\n    }],\\n    messages=messages\\n)\\nif response.stop_reason == \\"tool_use\\":\\n    block = next(b for b in response.content if b.type == \\"tool_use\\")\\n    result = TOOLS[block.name](**block.input)" } }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: What Production Agents Add", "content": "Once you understand the core loop, every framework feature has a clear purpose:\\n\\n**Structured tool calling** — The LLM returns typed JSON instead of free text. No parsing errors, complex input schemas, automatic validation.\\n\\n**Error handling** — Tools fail. Production loops catch exceptions, inject the error as an observation (\`Observation: Error: connection timeout\`), and let the LLM decide to retry, try a different tool, or give up gracefully.\\n\\n**Memory** — Short-term memory is already in \`messages\`. Long-term memory requires persisting key facts to a vector store (e.g., Supabase + pgvector) and retrieving relevant context at session start.\\n\\n**Streaming** — Stream tokens to the UI as they arrive. Buffer until you detect \`TOOL:\` or \`ANSWER:\` to decide the next action — same loop, lower perceived latency.\\n\\n**Guardrails** — Allowlist which tools each user role can call, sanitize tool inputs before execution, and filter outputs before returning to the caller." }
\`\`\`

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "In the ReAct loop, what is the purpose of the Observe step?", "options": [ "The LLM summarizes its reasoning before acting", "The tool's output is fed back into the conversation as context for the next reasoning step", "The agent checks whether max_steps has been reached", "The user reviews and approves the tool result" ], "answer": 1, "explanation": "Observation is the tool's return value, injected as a new user message. This gives the LLM fresh, real-world data to reason with on the next iteration — it's how the agent 'learns' from its actions within a session." }, { "question": "Why does the agent append the tool call as an assistant message and the result as a user message?", "options": [ "Anthropic's API only allows alternating roles", "It mirrors the actual conversation flow so the LLM can attribute the observation to its own prior action", "Only user messages are included in the context window", "Assistant messages count differently toward the token limit" ], "answer": 1, "explanation": "The LLM needs the full Reason → Act → Observe chain in its history. The assistant turn records what the agent decided to do; the user turn records what the environment returned. This lets the model correctly reason about the consequence of its own action." }, { "question": "What is the risk of omitting the max_steps guard?", "options": [ "The agent always returns an empty string", "The LLM refuses to call tools after a few iterations", "A confused agent could loop indefinitely, consuming tokens and money without producing an answer", "The Anthropic API enforces its own iteration limit automatically" ], "answer": 2, "explanation": "Without a hard exit condition, a confused or stuck agent calls the LLM repeatedly with no bound. max_steps is a cheap safety net — it caps worst-case cost and latency." }, { "question": "Why is parsing tool calls from raw LLM text considered fragile?", "options": [ "LLMs cannot reliably produce a consistent string format", "Minor formatting variations — extra spaces, different quote styles — cause silent parse failures or wrong tool arguments", "String parsing is too slow at production scale", "The Anthropic API does not allow plain-text responses" ], "answer": 1, "explanation": "LLMs are probabilistic. They might write 'TOOL: search( query )' with extra spaces, or wrap the argument in quotes. String splitting then silently extracts the wrong tool_name or tool_arg. Structured tool calling returns typed JSON, eliminating this class of error entirely." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "An agent is a loop: LLM reasons, calls a tool, observes the result, and repeats until it has a final answer.", "Tools are plain Python functions — the docstring tells the LLM when and how to invoke each one.", "The message history IS the agent's working memory: every action and observation is appended to it.", "max_steps is a critical safety guard — without it, a confused agent loops indefinitely, burning tokens.", "Text parsing is fine for learning; structured JSON tool calling is the production standard.", "Every major framework (LangChain, AutoGen, LangGraph) is a polished, feature-rich version of this same core loop." ] }
\`\`\`

> **Resource:** [GenAI Agents — Tutorials](https://github.com/NirDiamant/GenAI_Agents) includes Jupyter notebooks for building agents from scratch across multiple architectures.`,
    },
  ],
};
