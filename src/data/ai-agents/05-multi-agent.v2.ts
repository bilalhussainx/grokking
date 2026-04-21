import { Module } from "../types";

export const multiAgentModule: Module = {
  id: "agent-multi-agent",
  title: "Multi-Agent Systems",
  description: "Design and build multi-agent systems where specialized agents collaborate through supervisor architectures, debate patterns, and orchestrated workflows.",
  lessons: [
    {
      id: "ma-design-patterns",
      slug: "multi-agent-design-patterns",
      title: "Multi-Agent Design Patterns",
      content: `## Multi-Agent Design Patterns

A single agent can only do so much. **Multi-agent systems** use multiple specialized agents that collaborate to solve problems no single agent could handle alone. This mirrors how human teams work — a researcher, writer, and editor produce better articles than one person doing everything.

### Why Multi-Agent?

| Single Agent | Multi-Agent |
|-------------|-------------|
| One prompt, one persona | Specialized roles |
| One context window | Distributed context |
| Jack of all trades | Expert at one thing |
| Simple but limited | Complex but powerful |
| Prone to context overload | Each agent has focused context |

### The Four Core Patterns

**Pattern 1: Sequential (Pipeline)**

Agents work in sequence, each building on the previous output:

\`\`\`
[Researcher] → research → [Writer] → draft → [Editor] → final
\`\`\`

Best for: Content creation, data processing pipelines, review workflows.

**Pattern 2: Supervisor (Hierarchical)**

A supervisor agent delegates tasks to worker agents and aggregates results:

\`\`\`
              [Supervisor]
             /     |      \\
      [Agent A] [Agent B] [Agent C]
\`\`\`

Best for: Complex tasks requiring coordination, dynamic task assignment.

**Pattern 3: Debate (Peer-to-Peer)**

Agents discuss and critique each other's outputs:

\`\`\`
[Agent A] ←→ debate ←→ [Agent B]
              ↓
         [Consensus]
\`\`\`

Best for: Decision-making, code review, research validation.

**Pattern 4: Swarm (Decentralized)**

Agents operate independently with minimal coordination:

\`\`\`
[Agent A] ──→ shared_state ←── [Agent B]
[Agent C] ──→ shared_state ←── [Agent D]
\`\`\`

Best for: Parallel data processing, distributed search, independent sub-tasks.

### Implementing a Simple Sequential Pipeline

\`\`\`python
class Agent:
    def __init__(self, name: str, role: str, instructions: str):
        self.name = name
        self.role = role
        self.instructions = instructions

    def run(self, input_text: str) -> str:
        return llm(
            f"You are {self.name}, a {self.role}.\\n\\n"
            f"{self.instructions}\\n\\n"
            f"Input:\\n{input_text}"
        )

# Define the pipeline
researcher = Agent(
    "Alex", "Research Analyst",
    "Find and summarize key data points. Be thorough and cite sources."
)
writer = Agent(
    "Sam", "Content Writer",
    "Write a clear, engaging article based on the research. Use simple language."
)
editor = Agent(
    "Pat", "Editor",
    "Review for accuracy, clarity, and grammar. Fix issues and polish."
)

def sequential_pipeline(topic: str) -> str:
    research = researcher.run(f"Research this topic: {topic}")
    draft = writer.run(f"Write an article based on this research:\\n{research}")
    final = editor.run(f"Edit this article:\\n{draft}")
    return final
\`\`\`

### When to Use Each Pattern

| Scenario | Pattern |
|----------|---------|
| Content creation pipeline | Sequential |
| Customer support with escalation | Supervisor |
| Code review process | Debate |
| Large-scale data analysis | Swarm |
| Complex project management | Supervisor + Sequential |

### Communication Between Agents

Agents can communicate through:
- **Direct messaging**: One agent's output becomes another's input
- **Shared state**: A common data store all agents can read/write
- **Event bus**: Publish/subscribe for loose coupling
- **Conversation thread**: Agents participate in a shared chat

### Key Takeaway

Multi-agent systems distribute complexity across specialized roles. The four core patterns — Sequential, Supervisor, Debate, and Swarm — cover most use cases. Start with Sequential for simple workflows, graduate to Supervisor for dynamic orchestration, and use Debate when quality verification matters.

> **Resource**: [Microsoft AI Agents for Beginners — Lesson 13: Multi-Agent](https://github.com/microsoft/ai-agents-for-beginners) covers multi-agent design patterns with hands-on examples.`,
    },
    {
      id: "ma-supervisor",
      slug: "supervisor-architecture",
      title: "Supervisor Architecture",
      content: `## Supervisor Architecture

The **Supervisor** pattern is the most widely deployed multi-agent architecture in production. A central supervisor agent receives a task, breaks it into sub-tasks, delegates each to a specialized worker, then synthesizes results into a final response.

\`\`\`concept
{ "title": "The Supervisor Pattern", "variant": "analogy", "content": "Think of a project manager at a consulting firm. When a client brings a complex request, the PM does not execute everything directly — they scope the problem, assign research to a researcher, analysis to an analyst, and writing to a writer. The PM owns the plan and the final deliverable; specialists own execution. A Supervisor agent plays exactly the PM role." }
\`\`\`

### Architecture Overview

The supervisor sits at the center of the graph. Every worker — no matter what it produces — routes its result back to the supervisor, which re-evaluates state and picks the next step.

\`\`\`sysdiag
{
  "title": "Supervisor Architecture",
  "width": 720,
  "height": 400,
  "nodes": [
    { "id": "user", "label": "User Request", "x": 360, "y": 30, "kind": "service" },
    { "id": "sup", "label": "Supervisor Agent", "x": 360, "y": 180, "kind": "service" },
    { "id": "r", "label": "Research Worker", "x": 90, "y": 340, "kind": "service" },
    { "id": "a", "label": "Analysis Worker", "x": 360, "y": 340, "kind": "service" },
    { "id": "w", "label": "Writing Worker", "x": 630, "y": 340, "kind": "service" }
  ],
  "edges": [
    { "from": "user", "to": "sup", "label": "task" },
    { "from": "sup", "to": "r", "label": "delegate" },
    { "from": "sup", "to": "a", "label": "delegate" },
    { "from": "sup", "to": "w", "label": "delegate" },
    { "from": "r", "to": "sup", "label": "result" },
    { "from": "a", "to": "sup", "label": "result" },
    { "from": "w", "to": "sup", "label": "result" }
  ],
  "annotations": {
    "sup": "Plans, routes, and synthesizes — never does substantive work itself. Pure coordination.",
    "r": "Web search and fact retrieval only. No analysis, no writing.",
    "a": "Identifies trends and patterns from research output.",
    "w": "Produces polished prose from structured data and analysis."
  }
}
\`\`\`

### Implementation with LangGraph

LangGraph models this as a stateful graph where the supervisor node acts as a central router — it runs first, picks the next worker, and regains control after each worker completes.

\`\`\`steps
{
  "title": "Building the Supervisor Graph",
  "steps": [
    {
      "title": "Define shared state",
      "content": "All nodes read from and write to a single \`TypedDict\` — the shared whiteboard every agent can see:\\n\\n\`\`\`python\\nfrom typing import TypedDict\\n\\nclass SupervisorState(TypedDict):\\n    query: str           # Original user request\\n    plan: list           # Ordered list of workers\\n    current_worker: str  # Which worker runs next\\n    worker_results: dict # Accumulated outputs\\n    final_answer: str    # Set when complete\\n\`\`\`"
    },
    {
      "title": "Implement worker nodes",
      "content": "Each worker reads from state, does its specialized job, and writes its result back. Keep each worker **narrowly focused** — it should not know about other workers:\\n\\n\`\`\`python\\ndef research_worker(state: SupervisorState) -> SupervisorState:\\n    query = state['query']\\n    result = llm(f'Research specialist. Find information on: {query}')\\n    state['worker_results']['research'] = result\\n    return state\\n\\ndef analysis_worker(state: SupervisorState) -> SupervisorState:\\n    research = state['worker_results'].get('research', '')\\n    result = llm(f'Data analyst. Identify trends in: {research}')\\n    state['worker_results']['analysis'] = result\\n    return state\\n\`\`\`"
    },
    {
      "title": "Implement the supervisor node",
      "content": "The supervisor inspects \`worker_results\` to determine what has been done, then sets \`current_worker\` to route to the next step:\\n\\n\`\`\`python\\ndef supervisor(state: SupervisorState) -> SupervisorState:\\n    results = state['worker_results']\\n    if not results:\\n        state['current_worker'] = 'research'\\n    elif 'research' in results:\\n        state['current_worker'] = 'analysis'\\n    elif 'analysis' in results:\\n        state['current_worker'] = 'writing'\\n    else:\\n        state['final_answer'] = results['report']\\n        state['current_worker'] = 'done'\\n    return state\\n\`\`\`"
    },
    {
      "title": "Add conditional routing",
      "content": "A routing function reads \`current_worker\` and returns the node name — or \`END\`:\\n\\n\`\`\`python\\nfrom langgraph.graph import END\\n\\ndef route_supervisor(state: SupervisorState) -> str:\\n    worker = state.get('current_worker', '')\\n    return END if worker == 'done' else worker\\n\`\`\`"
    },
    {
      "title": "Compile the graph",
      "content": "Wire all nodes. Every worker feeds back to the supervisor so it can re-evaluate:\\n\\n\`\`\`python\\nfrom langgraph.graph import StateGraph\\n\\ngraph = StateGraph(SupervisorState)\\ngraph.add_node('supervisor', supervisor)\\ngraph.add_node('research', research_worker)\\ngraph.add_node('analysis', analysis_worker)\\ngraph.add_node('writing', writing_worker)\\n\\ngraph.set_entry_point('supervisor')\\ngraph.add_conditional_edges('supervisor', route_supervisor)\\ngraph.add_edge('research', 'supervisor')\\ngraph.add_edge('analysis', 'supervisor')\\ngraph.add_edge('writing', 'supervisor')\\n\\napp = graph.compile()\\n\`\`\`\\n\\nThe supervisor is invoked **four times** total: once to plan, and once after each worker returns."
    }
  ]
}
\`\`\`

### Tracing State Through Execution

Watch how \`current_worker\` and \`worker_results\` evolve across all four supervisor invocations for a three-worker pipeline:

\`\`\`trace
{
  "title": "Supervisor State Machine — 3-Worker Pipeline",
  "language": "python",
  "code": "def supervisor(state):\\n    results = state['worker_results']\\n    if not results:\\n        state['current_worker'] = 'research'\\n    elif 'research' in results:\\n        state['current_worker'] = 'analysis'\\n    elif 'analysis' in results:\\n        state['current_worker'] = 'writing'\\n    else:\\n        state['final_answer'] = results['report']\\n        state['current_worker'] = 'done'\\n    return state",
  "frames": [
    { "line": 2, "vars": { "results": "{}", "current_worker": "—" }, "note": "Invocation 1: supervisor runs first. No results yet." },
    { "line": 3, "vars": { "results": "{}", "current_worker": "—" }, "note": "\`not results\` is True — enter first branch." },
    { "line": 4, "vars": { "results": "{}", "current_worker": "research" }, "note": "Route to research worker. Graph transitions to research node." },
    { "line": 2, "vars": { "results": "{'research': '...'}", "current_worker": "research" }, "note": "Invocation 2: research_worker has completed and returned." },
    { "line": 5, "vars": { "results": "{'research': '...'}", "current_worker": "research" }, "note": "'research' found in results — enter second branch." },
    { "line": 6, "vars": { "results": "{'research': '...'}", "current_worker": "analysis" }, "note": "Route to analysis worker." },
    { "line": 2, "vars": { "results": "{'research': '...', 'analysis': '...'}", "current_worker": "analysis" }, "note": "Invocation 3: analysis complete." },
    { "line": 7, "vars": { "results": "{'research': '...', 'analysis': '...'}", "current_worker": "analysis" }, "note": "'analysis' found — enter third branch." },
    { "line": 8, "vars": { "results": "{'research': '...', 'analysis': '...'}", "current_worker": "writing" }, "note": "Route to writing worker." },
    { "line": 2, "vars": { "results": "{'research':'...','analysis':'...','report':'...'}", "current_worker": "writing" }, "note": "Invocation 4: writing complete. All workers done." },
    { "line": 9, "vars": { "results": "{'research':'...','analysis':'...','report':'...'}", "current_worker": "done", "final_answer": "Full polished report" }, "note": "else branch — set final_answer, route to END." }
  ],
  "speed": 900
}
\`\`\`

### Static Pipeline vs Dynamic Worker Selection

The example above uses a hard-coded pipeline. Production supervisors select workers dynamically based on what the task actually requires, skipping unnecessary steps entirely.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Static pipeline — always runs all 3 workers",
    "code": "def supervisor(state):\\n    results = state['worker_results']\\n    if not results:\\n        state['current_worker'] = 'research'\\n    elif 'research' in results:\\n        state['current_worker'] = 'analysis'\\n    elif 'analysis' in results:\\n        state['current_worker'] = 'writing'\\n    else:\\n        state['current_worker'] = 'done'\\n    return state\\n\\n# Problem: 'What is the capital of France?'\\n# still runs research -> analysis -> writing"
  },
  "after": {
    "label": "Dynamic selection — LLM picks only needed workers",
    "code": "WORKER_REGISTRY = {\\n    'research': 'Search the web for facts',\\n    'code':     'Write and execute code',\\n    'analysis': 'Identify trends and patterns',\\n    'writing':  'Produce polished content'\\n}\\n\\ndef select_workers(query: str) -> list:\\n    desc = [k + ': ' + v for k, v in WORKER_REGISTRY.items()]\\n    plan = llm(\\n        'Task: ' + query + ' | '\\n        'Workers: ' + str(desc) + ' | '\\n        'Which are needed in order? Return as JSON list.'\\n    )\\n    return json.loads(plan)\\n\\n# Simple fact  -> ['research']\\n# Full report  -> ['research', 'analysis', 'writing']"
  }
}
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Validate LLM-generated plans", "content": "When the supervisor uses an LLM to select workers dynamically, it may hallucinate worker names that don't exist in your registry. Always validate the returned plan against \`WORKER_REGISTRY.keys()\` before executing. Add a fallback for unrecognized names — fail loudly rather than silently skipping steps." }
\`\`\`

### Design Best Practices

| Practice | Why It Matters |
|---|---|
| **Single responsibility per worker** | Simplifies debugging — you always know which agent produced bad output |
| **Supervisor only coordinates** | Never let the supervisor do substantive work itself; plan, route, and synthesize only |
| **Limit to 3–5 workers** | Each additional worker multiplies LLM calls and coordination overhead |
| **Include a fallback path** | If no worker fits, the supervisor must handle the edge case gracefully |
| **Log routing decisions** | Store \`current_worker\` transitions — they are your primary debugging tool in production |
| **Set per-worker timeouts** | Workers calling external tools can hang; cap them so the supervisor can retry or reroute |

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "In LangGraph's supervisor pattern, how many times is the supervisor node invoked for a 3-worker pipeline (research → analysis → writing)?",
      "options": ["Once, at the very start only", "Twice — start and end", "Three times — once per worker", "Four times — once to plan, once after each worker"],
      "answer": 3,
      "explanation": "The supervisor runs before the first worker to create the plan, then regains control after each of the three workers completes: that is 1 + 3 = 4 total invocations."
    },
    {
      "question": "What is the primary advantage of dynamic worker selection over a static pipeline?",
      "options": ["It always runs faster because fewer LLM calls are made overall", "It selects only the workers a specific task actually requires, skipping unnecessary steps", "It removes the need for a supervisor node entirely", "It prevents hallucination in individual worker outputs"],
      "answer": 1,
      "explanation": "Dynamic selection lets the supervisor pick only the workers relevant to the task at hand. A simple factual question might only need the research worker; a static pipeline would still run analysis and writing unnecessarily, wasting LLM calls and latency."
    },
    {
      "question": "Which statement best describes the supervisor's role in this architecture?",
      "options": ["It directly answers the user's query using its own specialized tools", "It plans, delegates, and synthesizes — but never does the substantive work itself", "It acts as a worker with higher priority than the other agents", "It stores state and acts as a database for all other agents"],
      "answer": 1,
      "explanation": "The supervisor's job is pure coordination: analyzing the request, creating a plan, routing to workers, and synthesizing their outputs. Doing the actual research, analysis, or writing itself would break the single-responsibility principle and make the system harder to debug."
    },
    {
      "question": "Why should you validate the supervisor's LLM-generated worker plan before executing it?",
      "options": ["LLMs are slow and validation speeds up the pipeline", "LLMs may hallucinate worker names not present in the registry, causing runtime failures", "Validation is only required when workers use external API calls", "The supervisor always returns plans in the wrong execution order"],
      "answer": 1,
      "explanation": "When the supervisor uses an LLM to dynamically select workers, it can generate names that don't match any key in your WORKER_REGISTRY. Attempting to route to a non-existent graph node causes a runtime error. Always validate the plan first and apply a fallback for unrecognized names."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The Supervisor pattern uses a central coordinator to plan, delegate, and synthesize — it never executes substantive work itself.",
    "In LangGraph, every worker routes back to the supervisor, which re-evaluates shared state and picks the next step.",
    "A 3-worker pipeline invokes the supervisor 4 times: once to plan, once after each worker completes.",
    "Dynamic worker selection via LLM planning beats static pipelines — only the specialists a task actually needs are invoked.",
    "Validate LLM-generated plans against your worker registry; always include a fallback for hallucinated or unrecognized names.",
    "Log every routing decision — supervisor state transitions are your primary debugging tool in production multi-agent systems."
  ]
}
\`\`\``,
    },
    {
      id: "ma-debate",
      slug: "debate-consensus",
      title: "Debate & Consensus",
      content: `## Debate & Consensus

The **Debate** pattern puts multiple agents in conversation with each other. Agents propose solutions, critique each other's reasoning, and converge on a consensus. This produces higher-quality outputs than any single agent could achieve.

### Why Debate Works

Research shows that when LLMs are asked to debate, they:
- Catch errors that a single pass would miss
- Consider more perspectives and edge cases
- Produce more nuanced, balanced outputs
- Self-correct through peer critique

### The Debate Loop

\`\`\`
Round 1: Each agent proposes an initial answer
Round 2: Each agent critiques the others' answers
Round 3: Each agent revises their answer based on critiques
...
Final: A judge agent selects or synthesizes the best answer
\`\`\`

### Implementation

\`\`\`python
class DebateAgent:
    def __init__(self, name: str, perspective: str):
        self.name = name
        self.perspective = perspective

    def propose(self, question: str) -> str:
        return llm(
            f"You are {self.name}. Your perspective: {self.perspective}\\n\\n"
            f"Question: {question}\\n\\n"
            f"Provide your analysis and answer."
        )

    def critique(self, question: str, other_proposals: list) -> str:
        proposals_text = "\\n\\n".join(
            [f"{p['agent']}: {p['proposal']}" for p in other_proposals]
        )
        return llm(
            f"You are {self.name}. Your perspective: {self.perspective}\\n\\n"
            f"Question: {question}\\n\\n"
            f"Other agents' proposals:\\n{proposals_text}\\n\\n"
            f"Critique these proposals. What are the strengths and weaknesses?"
        )

    def revise(self, question: str, original: str, critiques: list) -> str:
        critiques_text = "\\n\\n".join(
            [f"{c['agent']}: {c['critique']}" for c in critiques]
        )
        return llm(
            f"You are {self.name}. Your perspective: {self.perspective}\\n\\n"
            f"Question: {question}\\n\\n"
            f"Your original proposal: {original}\\n\\n"
            f"Critiques received:\\n{critiques_text}\\n\\n"
            f"Revise your proposal to address valid critiques while "
            f"maintaining your strongest points."
        )

def run_debate(question: str, agents: list, rounds: int = 2) -> str:
    """Run a multi-round debate between agents."""
    # Round 1: Initial proposals
    proposals = []
    for agent in agents:
        proposal = agent.propose(question)
        proposals.append({"agent": agent.name, "proposal": proposal})

    # Debate rounds
    for round_num in range(rounds):
        # Critique phase
        all_critiques = []
        for agent in agents:
            others = [p for p in proposals if p["agent"] != agent.name]
            critique = agent.critique(question, others)
            all_critiques.append({"agent": agent.name, "critique": critique})

        # Revision phase
        new_proposals = []
        for agent in agents:
            original = next(p["proposal"] for p in proposals
                          if p["agent"] == agent.name)
            other_critiques = [c for c in all_critiques
                              if c["agent"] != agent.name]
            revised = agent.revise(question, original, other_critiques)
            new_proposals.append({"agent": agent.name, "proposal": revised})

        proposals = new_proposals

    # Judge synthesizes the final answer
    final_proposals = "\\n\\n".join(
        [f"{p['agent']}: {p['proposal']}" for p in proposals]
    )
    return llm(
        f"You are a judge. Multiple experts have debated this question:\\n"
        f"{question}\\n\\n"
        f"Their final positions:\\n{final_proposals}\\n\\n"
        f"Synthesize the best answer, incorporating the strongest points "
        f"from each expert."
    )
\`\`\`

### Example: Code Review Debate

\`\`\`python
# Create agents with different review perspectives
security_reviewer = DebateAgent(
    "Security Expert",
    "Focus on security vulnerabilities, injection attacks, and data protection"
)
performance_reviewer = DebateAgent(
    "Performance Engineer",
    "Focus on efficiency, scalability, and resource usage"
)
maintainability_reviewer = DebateAgent(
    "Software Architect",
    "Focus on code readability, design patterns, and maintainability"
)

code = """
def process_user_data(user_input):
    query = f"SELECT * FROM users WHERE name = '{user_input}'"
    results = db.execute(query)
    return [dict(r) for r in results]
"""

review = run_debate(
    f"Review this code and suggest improvements:\\n{code}",
    [security_reviewer, performance_reviewer, maintainability_reviewer],
    rounds=2
)
# Security catches SQL injection, performance suggests parameterized queries
# with indexing, maintainability suggests error handling and type hints.
\`\`\`

### Debate vs Other Patterns

| Feature | Sequential | Supervisor | Debate |
|---------|-----------|-----------|--------|
| **Interaction** | One-way | Hub-spoke | Peer-to-peer |
| **Quality check** | None built-in | Supervisor judges | Mutual critique |
| **Cost** | Lowest | Medium | Highest (many LLM calls) |
| **Best for** | Pipelines | Task delegation | Quality-critical decisions |

### When to Use Debate

- **High-stakes decisions**: Legal analysis, medical recommendations, investment advice
- **Code review**: Multiple perspectives catch different bug categories
- **Content quality**: Fact-checking, balanced reporting, thorough analysis
- **Research synthesis**: Combining findings from different angles

### Key Takeaway

The Debate pattern leverages the power of multiple perspectives and mutual critique. Agents propose, critique, and revise — converging on answers that are more accurate and comprehensive than any single agent's output. Use it when quality matters more than speed or cost.`,
    },
    {
      id: "ma-specialized-teams",
      slug: "specialized-agent-teams",
      title: "Specialized Agent Teams",
      content: `## Specialized Agent Teams

Specialized agent teams assign distinct roles, tools, and system prompts to each agent, creating a crew where each member excels at one type of task. This is the approach popularized by CrewAI and used in many production multi-agent systems.

### Designing Agent Roles

Each agent in a team needs:

1. **Role**: What they do (e.g., "Senior Data Analyst")
2. **Goal**: What they aim to achieve (e.g., "Extract actionable insights from data")
3. **Backstory**: Context that shapes their behavior (e.g., "10 years at McKinsey")
4. **Tools**: Specific tools only they can access
5. **Constraints**: What they should and should not do

### Example: Startup Research Team

\`\`\`python
from dataclasses import dataclass, field
from typing import List, Callable

@dataclass
class TeamAgent:
    role: str
    goal: str
    backstory: str
    tools: List[str] = field(default_factory=list)
    constraints: List[str] = field(default_factory=list)

    def system_prompt(self) -> str:
        tools_str = ", ".join(self.tools) if self.tools else "None"
        constraints_str = "\\n".join(f"- {c}" for c in self.constraints)
        return (
            f"You are a {self.role}.\\n"
            f"Goal: {self.goal}\\n"
            f"Background: {self.backstory}\\n"
            f"Available tools: {tools_str}\\n"
            f"Constraints:\\n{constraints_str}"
        )

# Define the team
market_researcher = TeamAgent(
    role="Market Research Analyst",
    goal="Find comprehensive market data, competitor analysis, and industry trends",
    backstory="Former Gartner analyst with deep expertise in tech market research. "
              "Known for finding data others miss.",
    tools=["web_search", "news_search", "company_database"],
    constraints=[
        "Always cite your sources with URLs",
        "Distinguish between facts and estimates",
        "Flag data older than 6 months as potentially outdated"
    ]
)

financial_analyst = TeamAgent(
    role="Financial Analyst",
    goal="Analyze revenue models, unit economics, and financial projections",
    backstory="CFA charterholder with 8 years at Goldman Sachs. "
              "Expert in startup valuation and financial modeling.",
    tools=["calculator", "financial_database", "spreadsheet"],
    constraints=[
        "Always show your calculations",
        "Provide bull, base, and bear case scenarios",
        "Flag assumptions explicitly"
    ]
)

strategy_lead = TeamAgent(
    role="Strategy Consultant",
    goal="Synthesize research and analysis into actionable strategic recommendations",
    backstory="Former BCG partner. Excels at turning complex data into "
              "clear, actionable frameworks.",
    tools=["document_writer"],
    constraints=[
        "Limit recommendations to 3-5 key points",
        "Each recommendation must be backed by data from the team",
        "Include implementation timeline and risk assessment"
    ]
)
\`\`\`

### Running the Team

\`\`\`python
@dataclass
class Task:
    description: str
    assigned_to: TeamAgent
    depends_on: List[str] = field(default_factory=list)
    output: str = ""

def run_team(query: str, tasks: List[Task], tools: dict) -> str:
    """Execute a team workflow with task dependencies."""
    completed = {}

    for task in tasks:
        # Gather dependency outputs
        context = ""
        for dep in task.depends_on:
            if dep in completed:
                context += f"\\n\\n{dep}:\\n{completed[dep]}"

        # Execute task with the assigned agent
        prompt = (
            f"{task.assigned_to.system_prompt()}\\n\\n"
            f"Your task: {task.description}\\n"
        )
        if context:
            prompt += f"\\nContext from teammates:{context}"

        result = llm(prompt)
        task.output = result
        completed[task.assigned_to.role] = result
        print(f"[{task.assigned_to.role}] completed task")

    return completed

# Define tasks
tasks = [
    Task(
        "Research the AI agent market: size, growth rate, key players, trends",
        assigned_to=market_researcher
    ),
    Task(
        "Analyze the financial viability of entering the AI agent market",
        assigned_to=financial_analyst,
        depends_on=["Market Research Analyst"]
    ),
    Task(
        "Create a go-to-market strategy with specific recommendations",
        assigned_to=strategy_lead,
        depends_on=["Market Research Analyst", "Financial Analyst"]
    ),
]

results = run_team("Should we build an AI agent platform?", tasks, tools)
\`\`\`

### Team Design Patterns

**The Content Team**: Researcher → Writer → Editor → SEO Specialist

**The Engineering Team**: Architect → Developer → Tester → DevOps

**The Analysis Team**: Data Collector → Analyst → Visualizer → Presenter

**The Support Team**: Classifier → Specialist → Reviewer → Escalation Manager

### Best Practices for Team Design

| Principle | Description |
|-----------|-------------|
| **3-5 agents max** | More agents = more coordination overhead |
| **Clear handoff points** | Define exactly what each agent passes to the next |
| **Minimal tool overlap** | Each agent should have unique tool access |
| **Explicit constraints** | Tell agents what NOT to do as much as what to do |
| **Output formats** | Standardize output formats for smooth handoffs |

### Key Takeaway

Specialized agent teams are powerful because each agent can excel in its narrow domain. The key to success is clear role definitions, explicit constraints, well-defined task dependencies, and standardized output formats. Start with 3 agents and add more only when you identify clear gaps.

> **Resource**: [CrewAI Documentation](https://docs.crewai.com) — The leading framework for building specialized agent teams.`,
    },
    {
      id: "ma-orchestration",
      slug: "orchestrating-multi-agent-workflows",
      title: "Orchestrating Multi-Agent Workflows",
      content: `## Orchestrating Multi-Agent Workflows

Orchestration is the art of coordinating multiple agents into a cohesive system. This lesson covers the practical engineering of multi-agent workflows — state management, error handling, monitoring, and the patterns that make complex agent systems reliable.

### The Orchestration Layer

Between your agents and the outside world, you need an orchestration layer that handles:

\`\`\`
[User Request]
      ↓
[Orchestrator]
  ├── State Management (shared context, results)
  ├── Task Queue (what needs to be done)
  ├── Routing (which agent handles what)
  ├── Error Handling (retries, fallbacks)
  ├── Monitoring (logs, metrics, traces)
  └── Human-in-the-Loop (approvals, escalation)
      ↓
[Agents do the work]
      ↓
[Final Result]
\`\`\`

### State Management

The most critical piece — agents need shared state to collaborate:

\`\`\`python
from dataclasses import dataclass, field
from typing import Any
import threading

@dataclass
class WorkflowState:
    """Thread-safe shared state for multi-agent workflows."""
    _data: dict = field(default_factory=dict)
    _lock: threading.Lock = field(default_factory=threading.Lock)
    _history: list = field(default_factory=list)

    def get(self, key: str, default: Any = None) -> Any:
        with self._lock:
            return self._data.get(key, default)

    def set(self, key: str, value: Any, agent: str = "system"):
        with self._lock:
            self._data[key] = value
            self._history.append({
                "agent": agent,
                "action": "set",
                "key": key,
                "timestamp": time.time()
            })

    def get_history(self) -> list:
        with self._lock:
            return list(self._history)
\`\`\`

### Error Handling and Recovery

Multi-agent systems need robust error handling:

\`\`\`python
class AgentError(Exception):
    def __init__(self, agent_name: str, message: str, recoverable: bool = True):
        self.agent_name = agent_name
        self.recoverable = recoverable
        super().__init__(f"[{agent_name}] {message}")

def execute_with_retry(
    agent_fn,
    state: WorkflowState,
    max_retries: int = 3,
    fallback_fn=None
):
    """Execute an agent with retry logic and fallback."""
    for attempt in range(max_retries):
        try:
            return agent_fn(state)
        except AgentError as e:
            if not e.recoverable:
                if fallback_fn:
                    return fallback_fn(state)
                raise
            print(f"Retry {attempt + 1}/{max_retries}: {e}")
            time.sleep(2 ** attempt)  # Exponential backoff

    # All retries exhausted
    if fallback_fn:
        return fallback_fn(state)
    raise AgentError("orchestrator", "Max retries exceeded", recoverable=False)
\`\`\`

### Parallel Execution

Run independent agents simultaneously for speed:

\`\`\`python
from concurrent.futures import ThreadPoolExecutor, as_completed

def run_parallel_agents(agents: list, state: WorkflowState) -> dict:
    """Run independent agents in parallel."""
    results = {}

    with ThreadPoolExecutor(max_workers=len(agents)) as executor:
        future_to_agent = {
            executor.submit(agent.run, state): agent
            for agent in agents
        }

        for future in as_completed(future_to_agent):
            agent = future_to_agent[future]
            try:
                result = future.result(timeout=60)
                results[agent.name] = result
                state.set(f"{agent.name}_result", result, agent.name)
            except Exception as e:
                results[agent.name] = f"Error: {e}"

    return results
\`\`\`

### Monitoring and Observability

Track everything for debugging and optimization:

\`\`\`python
import logging
import time

class WorkflowMonitor:
    def __init__(self):
        self.logger = logging.getLogger("multi-agent")
        self.metrics = {
            "total_llm_calls": 0,
            "total_tool_calls": 0,
            "total_tokens": 0,
            "agent_durations": {},
            "errors": []
        }

    def log_agent_start(self, agent_name: str, task: str):
        self.logger.info(f"[START] {agent_name}: {task}")
        self.metrics["agent_durations"][agent_name] = {"start": time.time()}

    def log_agent_end(self, agent_name: str, result_summary: str):
        duration = time.time() - self.metrics["agent_durations"][agent_name]["start"]
        self.metrics["agent_durations"][agent_name]["duration"] = duration
        self.logger.info(f"[END] {agent_name}: {duration:.1f}s - {result_summary}")

    def log_error(self, agent_name: str, error: str):
        self.metrics["errors"].append({"agent": agent_name, "error": error})
        self.logger.error(f"[ERROR] {agent_name}: {error}")

    def summary(self) -> dict:
        return {
            "total_duration": sum(
                d.get("duration", 0)
                for d in self.metrics["agent_durations"].values()
            ),
            "agent_count": len(self.metrics["agent_durations"]),
            "error_count": len(self.metrics["errors"]),
            **self.metrics
        }
\`\`\`

### Human-in-the-Loop

For high-stakes workflows, add approval checkpoints:

\`\`\`python
def checkpoint(state: WorkflowState, description: str, auto_approve: bool = False):
    """Pause workflow for human approval."""
    if auto_approve:
        return True

    print(f"\\n{'='*50}")
    print(f"CHECKPOINT: {description}")
    print(f"Current state: {json.dumps(state._data, indent=2, default=str)}")
    approval = input("Approve and continue? (y/n): ")
    return approval.lower() == "y"
\`\`\`

### Production Architecture

\`\`\`
[API Gateway] → [Task Queue (Redis/SQS)] → [Orchestrator]
                                                ├── [Agent Pool]
                                                ├── [State Store (Redis)]
                                                ├── [Tool Registry]
                                                └── [Monitor (Prometheus)]
\`\`\`

### Key Takeaway

Orchestration is what makes multi-agent systems production-ready. Shared state management, robust error handling, parallel execution, monitoring, and human-in-the-loop checkpoints transform a collection of agents into a reliable system. Start simple with sequential execution, then add parallelism and monitoring as your system matures.

> **Resources**:
> - [Microsoft AI Agents for Beginners](https://github.com/microsoft/ai-agents-for-beginners) — Multi-agent orchestration patterns
> - [GenAI Agents](https://github.com/NirDiamant/GenAI_Agents) — Advanced multi-agent implementations`,
    },
  ],
};
