import { Module } from "../types";

export const agentFundamentalsModule: Module = {
  id: "agent-fundamentals",
  title: "Agent Fundamentals",
  description:
    "Understand what AI agents are, how they differ from chatbots, and explore the major architectures and frameworks powering modern agentic systems.",
  lessons: [
    {
      id: "af-what-are-agents",
      slug: "what-are-ai-agents",
      title: "What Are AI Agents?",
      content: `## What Are AI Agents?

An **AI agent** is a software system that uses a large language model (LLM) as its reasoning engine to autonomously plan, decide, and act toward achieving a goal. Unlike a simple prompt-response chatbot, an agent can observe its environment, make decisions, take actions through tools, and iterate based on feedback.

### The Agent Loop

At its core, every AI agent follows a loop:

1. **Perceive** — Receive input (user query, environment state, tool output)
2. **Reason** — The LLM thinks about what to do next
3. **Act** — Execute an action (call a tool, write code, search the web)
4. **Observe** — Check the result of the action
5. **Repeat** — Continue until the goal is achieved or a stopping condition is met

\`\`\`
User Goal → [Reason] → [Act] → [Observe] → [Reason] → [Act] → ... → Final Answer
\`\`\`

### Why Agents Matter

Traditional software follows rigid, pre-programmed paths. Agents bring flexibility:

- **Dynamic problem-solving**: They can adapt their approach based on intermediate results
- **Tool augmentation**: They can search the web, run code, query databases, and call APIs
- **Multi-step reasoning**: They can break complex problems into sub-tasks and solve them sequentially
- **Self-correction**: They can recognize mistakes and try alternative approaches

### Real-World Agent Examples

| Agent | What It Does |
|-------|-------------|
| **Claude Code** | Reads codebases, edits files, runs tests, creates commits |
| **Devin** | Autonomous software engineer that plans, codes, and debugs |
| **AutoGPT** | General-purpose agent that decomposes goals into sub-tasks |
| **GPT Researcher** | Searches the web, synthesizes information into research reports |

### The Agent Spectrum

Not every system needs full autonomy. Think of it as a spectrum:

- **Level 0 — Simple LLM Call**: Single prompt → single response, no tools
- **Level 1 — Tool-Augmented LLM**: LLM can call functions/tools in a single turn
- **Level 2 — ReAct Agent**: LLM reasons and acts in a loop until done
- **Level 3 — Multi-Agent System**: Multiple specialized agents collaborate

### Key Takeaway

AI agents are LLM-powered systems that can reason, plan, use tools, and act autonomously. They represent the next evolution beyond chatbots — from answering questions to completing tasks. The rest of this course will teach you how to build them.

> **Resource**: [Microsoft AI Agents for Beginners](https://github.com/microsoft/ai-agents-for-beginners) — A comprehensive 18-lesson open-source curriculum covering agent fundamentals, tool use, RAG, and multi-agent patterns.`,
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
      content: `## Agent Architectures

How an agent reasons and acts is determined by its **architecture** — the pattern that governs its control flow. Two dominant architectures have emerged: **ReAct** and **Plan-and-Execute**.

### Architecture 1: ReAct (Reasoning + Acting)

ReAct interleaves reasoning (thinking) with acting (tool use) in a tight loop. The agent thinks one step at a time.

\`\`\`
Thought: I need to find the current stock price of AAPL.
Action: search("AAPL stock price today")
Observation: AAPL is trading at $198.50
Thought: Now I need to calculate the P/E ratio. I need the EPS.
Action: search("AAPL earnings per share 2025")
Observation: AAPL EPS is $6.42
Thought: P/E = 198.50 / 6.42 = 30.9. I can now answer.
Answer: Apple's P/E ratio is approximately 30.9
\`\`\`

**Strengths:**
- Simple to implement — just a loop with thought/action/observation
- Naturally self-correcting — each observation informs the next thought
- Works well for tasks where the next step depends on the previous result

**Weaknesses:**
- Can get stuck in loops (repeating the same action)
- No upfront planning — may take inefficient paths
- Token-expensive for long tasks (full history in context)

### Architecture 2: Plan-and-Execute

Plan-and-Execute separates planning from execution. First, create a plan. Then, execute each step.

\`\`\`
Plan:
  1. Search for AAPL current stock price
  2. Search for AAPL earnings per share
  3. Calculate P/E ratio
  4. Return the result

Execute Step 1: search("AAPL stock price") → $198.50
Execute Step 2: search("AAPL EPS 2025") → $6.42
Execute Step 3: calculate(198.50 / 6.42) → 30.9
Execute Step 4: Return "Apple's P/E ratio is 30.9"
\`\`\`

**Strengths:**
- More efficient for well-defined tasks
- Can parallelize independent steps
- Easier to debug (you can inspect the plan)
- Better for long-horizon tasks

**Weaknesses:**
- Plan may become invalid if early steps return unexpected results
- Requires re-planning capability for robustness
- More complex to implement

### Comparing the Two

| Aspect | ReAct | Plan-and-Execute |
|--------|-------|-----------------|
| **Planning** | None (step-by-step) | Upfront plan |
| **Adaptability** | High (reacts each step) | Requires re-planning |
| **Efficiency** | Lower (no parallelism) | Higher (can parallelize) |
| **Best for** | Exploratory tasks | Well-defined tasks |
| **Complexity** | Simple | Moderate |

### Other Notable Architectures

- **Reflexion**: Agent reflects on its own outputs and improves iteratively. Adds a "reflection" step after each attempt.
- **LATS (Language Agent Tree Search)**: Explores multiple solution paths like a tree search, picking the best one.
- **LLMCompiler**: Automatically parallelizes tool calls by analyzing dependencies in the task graph.

### Choosing an Architecture

\`\`\`
Is the task exploratory with unknown steps?  → ReAct
Is the task well-defined with clear sub-goals? → Plan-and-Execute
Do you need maximum reliability?              → Plan-and-Execute + Re-planning
Do you need fast iteration?                   → ReAct (simpler to build)
\`\`\`

### Key Takeaway

ReAct is the "think-then-act" loop — simple, adaptive, and widely used. Plan-and-Execute adds upfront planning for better efficiency on structured tasks. Most production agents use a hybrid: plan first, but allow re-planning when observations deviate from expectations.

> **Resource**: [GenAI Agents](https://github.com/NirDiamant/GenAI_Agents) — A curated collection of agent architectures with tutorials and implementations covering ReAct, Plan-and-Execute, Reflexion, and more.`,
    },
    {
      id: "af-frameworks",
      slug: "agentic-frameworks-overview",
      title: "Agentic Frameworks Overview",
      content: `## Agentic Frameworks Overview

You don't need to build agents from scratch. Several mature frameworks provide the building blocks — tool integration, memory, orchestration, and multi-agent coordination. Here's a practical overview of the major players.

### LangGraph

**What it is**: A library from LangChain for building stateful, multi-step agent workflows as directed graphs.

**Key concepts:**
- **Nodes** = processing steps (LLM calls, tool calls, logic)
- **Edges** = transitions between steps (conditional or unconditional)
- **State** = a shared object that flows through the graph

\`\`\`python
from langgraph.graph import StateGraph, END

# Define a simple ReAct agent as a graph
graph = StateGraph(AgentState)
graph.add_node("reason", reason_node)
graph.add_node("act", act_node)
graph.add_edge("reason", "act")
graph.add_conditional_edges("act", should_continue, {
    "continue": "reason",
    "end": END
})
agent = graph.compile()
\`\`\`

**Best for**: Complex workflows with branching logic, cycles, and human-in-the-loop checkpoints.

### CrewAI

**What it is**: A framework for orchestrating multiple AI agents that work together as a "crew."

**Key concepts:**
- **Agent** = a persona with a role, goal, and backstory
- **Task** = a unit of work assigned to an agent
- **Crew** = a team of agents with a defined process (sequential or hierarchical)

\`\`\`python
from crewai import Agent, Task, Crew

researcher = Agent(
    role="Research Analyst",
    goal="Find comprehensive data on the topic",
    tools=[search_tool, web_scraper]
)
writer = Agent(
    role="Content Writer",
    goal="Write a clear, engaging article",
    tools=[writing_tool]
)
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process="sequential"  # researcher finishes before writer starts
)
result = crew.kickoff()
\`\`\`

**Best for**: Teams of specialized agents working on a shared project.

### AutoGen (Microsoft)

**What it is**: A framework for building multi-agent conversations where agents can talk to each other.

**Key concepts:**
- **ConversableAgent** = an agent that can participate in conversations
- **GroupChat** = multiple agents discussing in a shared thread
- **Code execution** = agents can write and run code automatically

**Best for**: Research tasks, code generation, and scenarios where agents debate or review each other's work.

### Smolagents (Hugging Face)

**What it is**: A lightweight framework focused on code-based tool calling. Agents write Python code to use tools rather than generating JSON function calls.

**Best for**: Quick prototyping, simple single-agent workflows, and when you want minimal abstraction.

### Framework Comparison

| Framework | Multi-Agent | Graph Workflows | Code Execution | Complexity |
|-----------|:-----------:|:---------------:|:--------------:|:----------:|
| **LangGraph** | Yes | Yes (core feature) | Via tools | Medium |
| **CrewAI** | Yes (core) | Limited | Via tools | Low |
| **AutoGen** | Yes (core) | Limited | Built-in | Medium |
| **Smolagents** | Limited | No | Core feature | Low |

### How to Choose

- **Building a single complex agent?** → LangGraph
- **Coordinating specialized agent teams?** → CrewAI
- **Need agents that discuss and debate?** → AutoGen
- **Want the simplest possible setup?** → Smolagents
- **Need maximum control?** → Build from scratch with raw LLM APIs

### Key Takeaway

Frameworks handle the plumbing — state management, tool routing, agent orchestration — so you can focus on the logic. Start with a simple framework (CrewAI or Smolagents) for learning, then graduate to LangGraph for production workflows. The best framework is the one that matches your use case.

> **Resource**: [Microsoft AI Agents for Beginners — Lesson 2: Agentic Frameworks](https://github.com/microsoft/ai-agents-for-beginners) covers framework selection in depth with hands-on notebooks.`,
    },
    {
      id: "af-first-agent",
      slug: "building-your-first-agent",
      title: "Building Your First Agent",
      content: `## Building Your First Agent

Let's build a simple ReAct agent from scratch using Python and an LLM API. No frameworks — just the core loop, so you understand what's happening under the hood.

### The Architecture

Our agent will:
1. Receive a user question
2. Decide if it needs to use a tool
3. Call the tool and observe the result
4. Repeat until it can answer
5. Return the final answer

### Step 1: Define Tools

Tools are just Python functions with descriptions the LLM can understand:

\`\`\`python
import math
import requests

def calculator(expression: str) -> str:
    """Evaluate a mathematical expression. Example: '2 + 3 * 4'"""
    try:
        result = eval(expression, {"__builtins__": {}}, {"math": math})
        return str(result)
    except Exception as e:
        return f"Error: \{e\}"

def search(query: str) -> str:
    """Search the web for information. Returns top result summary."""
    # In production, use a real search API (Tavily, Brave, etc.)
    response = requests.get(
        "https://api.tavily.com/search",
        params={"query": query, "max_results": 3},
        headers={"Authorization": "Bearer YOUR_API_KEY"}
    )
    results = response.json().get("results", [])
    return "\\n".join([r["content"][:200] for r in results])

TOOLS = {
    "calculator": calculator,
    "search": search,
}
\`\`\`

### Step 2: Build the Agent Loop

\`\`\`python
from anthropic import Anthropic

client = Anthropic()

SYSTEM_PROMPT = """You are a helpful agent. You can use these tools:
- calculator(expression): Evaluate math expressions
- search(query): Search the web for information

To use a tool, respond with:
TOOL: tool_name(argument)

When you have the final answer, respond with:
ANSWER: your final answer

Always think step by step before acting."""

def run_agent(user_query: str, max_steps: int = 10) -> str:
    messages = [{"role": "user", "content": user_query}]

    for step in range(max_steps):
        # Get LLM response
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=messages
        )
        text = response.content[0].text
        print(f"Step {step + 1}: {text}")

        # Check if agent wants to use a tool
        if text.startswith("TOOL:"):
            tool_call = text[5:].strip()
            tool_name = tool_call.split("(")[0]
            tool_arg = tool_call.split("(")[1].rstrip(")")

            # Execute the tool
            if tool_name in TOOLS:
                observation = TOOLS[tool_name](tool_arg)
            else:
                observation = f"Unknown tool: {tool_name}"

            # Add the exchange to messages
            messages.append({"role": "assistant", "content": text})
            messages.append({"role": "user", "content": f"Observation: {observation}"})

        elif "ANSWER:" in text:
            return text.split("ANSWER:")[1].strip()

        else:
            messages.append({"role": "assistant", "content": text})
            messages.append({"role": "user", "content": "Continue reasoning."})

    return "Agent reached maximum steps without an answer."
\`\`\`

### Step 3: Run It

\`\`\`python
result = run_agent("What is the square root of the population of France?")
print(f"Final answer: {result}")
\`\`\`

**Expected agent trace:**
\`\`\`
Step 1: I need to find the population of France first.
        TOOL: search(population of France 2025)
Step 2: Observation: France has a population of approximately 68.4 million
        Now I can calculate the square root.
        TOOL: calculator(math.sqrt(68400000))
Step 3: Observation: 8270.43
        ANSWER: The square root of France's population (~68.4M) is approximately 8,270.
\`\`\`

### What You Just Built

This 50-line agent demonstrates every core concept:
- **Tool definitions** with descriptions
- **The ReAct loop** (Reason → Act → Observe → Repeat)
- **Stopping conditions** (ANSWER or max steps)
- **Observation routing** (tool output back to the LLM)

### Going Further

Production agents add:
- **Structured tool calling** (JSON schemas instead of string parsing)
- **Error handling** (retry on tool failures)
- **Memory** (persist state across sessions)
- **Streaming** (show reasoning in real-time)
- **Guardrails** (limit which tools can be called)

### Key Takeaway

An agent is just a loop: LLM reasons, calls a tool, observes the result, and repeats. Once you understand this loop, every framework is just a more polished version of what you built here. Start simple, then adopt frameworks when you need their specific features.

> **Resource**: [GenAI Agents — Tutorials](https://github.com/NirDiamant/GenAI_Agents) includes Jupyter notebooks for building agents from scratch with various architectures.`,
    },
  ],
};
