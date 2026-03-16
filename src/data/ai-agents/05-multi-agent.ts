import { Module } from "../types";

export const multiAgentModule: Module = {
  id: "agent-multi-agent",
  title: "Multi-Agent Systems",
  description:
    "Design and build multi-agent systems where specialized agents collaborate through supervisor architectures, debate patterns, and orchestrated workflows.",
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

The **Supervisor** pattern is the most common multi-agent architecture in production. A central supervisor agent receives tasks, delegates them to specialized worker agents, and synthesizes results. Think of it as a project manager coordinating a team.

### How It Works

\`\`\`
User Request
     ↓
[Supervisor Agent]
  → Analyzes the request
  → Creates a plan
  → Delegates to workers
  → Monitors progress
  → Synthesizes results
     ↓
Final Response
\`\`\`

### Implementation with LangGraph

\`\`\`python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Literal

class SupervisorState(TypedDict):
    query: str
    plan: list
    current_worker: str
    worker_results: dict
    final_answer: str

# Worker agents
def research_worker(state: SupervisorState) -> SupervisorState:
    """Worker specialized in web research."""
    query = state["plan"][0] if state["plan"] else state["query"]
    result = llm(
        f"You are a research specialist. Find comprehensive information on:\\n"
        f"{query}\\n\\nUse search tools to find accurate, cited data."
    )
    state["worker_results"]["research"] = result
    return state

def analysis_worker(state: SupervisorState) -> SupervisorState:
    """Worker specialized in data analysis."""
    research = state["worker_results"].get("research", "")
    result = llm(
        f"You are a data analyst. Analyze this information:\\n"
        f"{research}\\n\\n"
        f"Identify key trends, patterns, and insights."
    )
    state["worker_results"]["analysis"] = result
    return state

def writing_worker(state: SupervisorState) -> SupervisorState:
    """Worker specialized in writing reports."""
    analysis = state["worker_results"].get("analysis", "")
    research = state["worker_results"].get("research", "")
    result = llm(
        f"You are a report writer. Create a polished report from:\\n"
        f"Research: {research}\\n"
        f"Analysis: {analysis}\\n\\n"
        f"Write clearly for a non-technical audience."
    )
    state["worker_results"]["report"] = result
    return state

# Supervisor agent
def supervisor(state: SupervisorState) -> SupervisorState:
    """Supervisor that delegates and coordinates."""
    query = state["query"]
    results = state["worker_results"]

    if not results:
        # First call — create plan and delegate
        plan = llm(
            f"You are a project supervisor. A user needs: {query}\\n\\n"
            f"Available workers: research, analysis, writing\\n"
            f"Create a plan. Which worker should go first?"
        )
        state["plan"] = ["research", "analysis", "writing"]
        state["current_worker"] = "research"
    elif "report" in results:
        # All workers done — synthesize
        state["final_answer"] = results["report"]
        state["current_worker"] = "done"
    elif "analysis" in results:
        state["current_worker"] = "writing"
    elif "research" in results:
        state["current_worker"] = "analysis"

    return state

# Routing
def route_supervisor(state: SupervisorState) -> str:
    worker = state.get("current_worker", "")
    if worker == "done":
        return END
    return worker

# Build graph
graph = StateGraph(SupervisorState)
graph.add_node("supervisor", supervisor)
graph.add_node("research", research_worker)
graph.add_node("analysis", analysis_worker)
graph.add_node("writing", writing_worker)

graph.set_entry_point("supervisor")
graph.add_conditional_edges("supervisor", route_supervisor)
graph.add_edge("research", "supervisor")
graph.add_edge("analysis", "supervisor")
graph.add_edge("writing", "supervisor")

app = graph.compile()
\`\`\`

### Dynamic Worker Selection

A more advanced supervisor selects workers dynamically based on the task:

\`\`\`python
WORKER_REGISTRY = {
    "research": {
        "description": "Searches the web and finds information",
        "capabilities": ["web_search", "data_retrieval"]
    },
    "code": {
        "description": "Writes and executes code",
        "capabilities": ["code_generation", "debugging"]
    },
    "analysis": {
        "description": "Analyzes data and identifies patterns",
        "capabilities": ["statistics", "visualization"]
    },
    "writing": {
        "description": "Creates polished written content",
        "capabilities": ["reports", "summaries", "articles"]
    }
}

def dynamic_supervisor(query: str) -> str:
    worker_list = "\\n".join(
        [f"- {k}: {v['description']}" for k, v in WORKER_REGISTRY.items()]
    )
    plan = llm(
        f"Task: {query}\\n\\n"
        f"Available workers:\\n{worker_list}\\n\\n"
        f"Which workers are needed and in what order? "
        f"Return as JSON: [{{\"worker\": \"name\", \"task\": \"specific task\"}}]"
    )
    return json.loads(plan)
\`\`\`

### Supervisor Design Best Practices

1. **Keep workers focused**: Each worker should have a single, well-defined specialty
2. **Limit worker count**: 3-5 workers is optimal; more creates coordination overhead
3. **Include a fallback**: If no worker fits, the supervisor should handle it
4. **Log decisions**: Track which workers were called and why for debugging
5. **Set timeouts**: Workers should have time limits to prevent hanging

### Key Takeaway

The Supervisor pattern provides centralized coordination of specialized agents. The supervisor handles planning and delegation while workers focus on execution. This is the most production-ready multi-agent pattern — easy to reason about, debug, and extend with new workers.`,
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
