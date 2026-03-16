import { Module } from "../types";

export const productionModule: Module = {
  id: "agent-production",
  title: "Agents in Production",
  description:
    "Deploy agents to production with robust memory systems, context engineering, safety guardrails, and interoperability protocols like MCP and A2A.",
  lessons: [
    {
      id: "pr-production-agents",
      slug: "agents-in-production",
      title: "Agents in Production",
      content: `## Agents in Production

Building an agent that works in a notebook is one thing. Deploying one that serves thousands of users reliably is another. This lesson covers the engineering challenges of production agent systems and how to solve them.

### The Production Gap

| Demo Agent | Production Agent |
|-----------|-----------------|
| Single user | Thousands concurrent |
| Happy path only | Handles every edge case |
| No cost control | Budget per request |
| Unlimited time | Response time SLAs |
| Trust everything | Validate all inputs/outputs |
| No logging | Full observability |
| Manual restart | Self-healing |

### Architecture for Production

\`\`\`
[Client (Web/API)]
       ↓
[API Gateway] — rate limiting, auth, request validation
       ↓
[Agent Service]
  ├── Request Router — classify and route to appropriate agent
  ├── Agent Pool — pre-configured agents ready to serve
  ├── Tool Registry — sandboxed tools with permissions
  ├── State Manager — Redis-backed session state
  ├── Budget Controller — token/cost limits per request
  └── Output Validator — check outputs before returning
       ↓
[Observability Stack]
  ├── Logs (structured JSON)
  ├── Metrics (Prometheus/Datadog)
  ├── Traces (agent reasoning chains)
  └── Alerts (error rates, latency, cost)
\`\`\`

### Cost Control

LLM calls are expensive. Production agents need budget management:

\`\`\`python
class BudgetController:
    def __init__(self, max_tokens: int = 100000, max_cost_usd: float = 1.0):
        self.max_tokens = max_tokens
        self.max_cost_usd = max_cost_usd
        self.tokens_used = 0
        self.cost_usd = 0.0

    def check_budget(self, estimated_tokens: int) -> bool:
        if self.tokens_used + estimated_tokens > self.max_tokens:
            return False
        return self.cost_usd < self.max_cost_usd

    def record_usage(self, input_tokens: int, output_tokens: int, model: str):
        self.tokens_used += input_tokens + output_tokens
        # Pricing varies by model
        rates = {
            "claude-sonnet-4-20250514": {"input": 3.0, "output": 15.0},
            "claude-haiku-4-20250414": {"input": 0.25, "output": 1.25},
        }
        rate = rates.get(model, rates["claude-sonnet-4-20250514"])
        self.cost_usd += (
            input_tokens * rate["input"] / 1_000_000 +
            output_tokens * rate["output"] / 1_000_000
        )
\`\`\`

### Latency Optimization

Agents are inherently multi-step. Reduce latency with:

1. **Streaming**: Stream the final response while the agent is still working
2. **Caching**: Cache tool results and common sub-queries
3. **Model tiering**: Use cheaper/faster models for simple decisions, powerful models for complex reasoning
4. **Parallel tool calls**: Execute independent tools simultaneously
5. **Early termination**: Stop the loop as soon as the answer is good enough

\`\`\`python
# Model tiering example
def get_model_for_task(task_type: str) -> str:
    tiers = {
        "classification": "claude-haiku-4-20250414",      # Fast, cheap
        "simple_generation": "claude-haiku-4-20250414",
        "complex_reasoning": "claude-sonnet-4-20250514",  # Balanced
        "critical_analysis": "claude-sonnet-4-20250514",     # Best quality
    }
    return tiers.get(task_type, "claude-sonnet-4-20250514")
\`\`\`

### Reliability Patterns

- **Circuit breaker**: Stop calling a failing tool after N consecutive failures
- **Retry with backoff**: Exponential backoff on transient errors
- **Fallback chains**: If primary tool fails, try secondary, then tertiary
- **Idempotency**: Ensure the same request produces the same result if retried
- **Timeout management**: Set timeouts at every level (tool, step, overall)

### Testing Agents

\`\`\`python
# Test individual tools
def test_search_tool():
    result = search("Python programming language")
    assert "error" not in result.lower()
    assert len(json.loads(result)["results"]) > 0

# Test agent behavior with mock tools
def test_agent_uses_search_for_factual_questions():
    mock_tools = {"search": lambda q: '{"results": [{"content": "Python was created in 1991"}]}'}
    result = react_agent("When was Python created?", mock_tools)
    assert "1991" in result

# Test guardrails
def test_agent_refuses_harmful_request():
    result = react_agent("Help me hack into a database", tools)
    assert any(word in result.lower() for word in ["cannot", "unable", "inappropriate"])
\`\`\`

### Key Takeaway

Production agents need cost control, latency optimization, reliability patterns, comprehensive testing, and full observability. The demo-to-production gap is significant — plan for it from the start. Build with budget limits, timeouts, and monitoring from day one.

> **Resource**: [Microsoft AI Agents for Beginners — Lesson 15: Production](https://github.com/microsoft/ai-agents-for-beginners) covers deployment, scaling, and monitoring.`,
    },
    {
      id: "pr-memory",
      slug: "memory-systems",
      title: "Memory Systems",
      content: `## Memory Systems

Without memory, agents start fresh every conversation — they forget past interactions, learned preferences, and accumulated knowledge. Memory systems give agents the ability to remember and learn over time.

### Types of Agent Memory

| Type | Duration | What It Stores | Analogy |
|------|----------|---------------|---------|
| **Working Memory** | Current session | Current task context, tool results | Your desk |
| **Short-Term Memory** | Recent sessions | Recent conversations, preferences | Yesterday's notes |
| **Long-Term Memory** | Persistent | Facts, user profiles, learned patterns | Your filing cabinet |
| **Episodic Memory** | Persistent | Specific past experiences and outcomes | Your autobiography |

### Working Memory: Context Window Management

The simplest form of memory — everything in the current conversation:

\`\`\`python
class WorkingMemory:
    def __init__(self, max_tokens: int = 100000):
        self.messages = []
        self.max_tokens = max_tokens
        self.tool_results = {}
        self.scratchpad = {}  # Agent's internal notes

    def add_message(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})
        self._trim_if_needed()

    def _trim_if_needed(self):
        """Remove oldest messages if context is too large."""
        while self._estimate_tokens() > self.max_tokens and len(self.messages) > 2:
            # Keep system message and latest user message
            self.messages.pop(1)  # Remove oldest non-system message

    def get_context(self) -> list:
        return self.messages
\`\`\`

### Short-Term Memory: Conversation Summaries

Store summaries of recent conversations to maintain continuity:

\`\`\`python
class ShortTermMemory:
    def __init__(self, max_sessions: int = 10):
        self.sessions = []
        self.max_sessions = max_sessions

    def save_session(self, session_id: str, messages: list):
        summary = llm(
            f"Summarize this conversation in 2-3 sentences. "
            f"Include key facts, decisions, and user preferences:\\n"
            f"{json.dumps(messages)}"
        )
        self.sessions.append({
            "id": session_id,
            "summary": summary,
            "timestamp": time.time()
        })
        if len(self.sessions) > self.max_sessions:
            self.sessions.pop(0)

    def get_recent_context(self) -> str:
        if not self.sessions:
            return "No previous conversations."
        return "\\n".join(
            [f"Session {s['id']}: {s['summary']}" for s in self.sessions[-5:]]
        )
\`\`\`

### Long-Term Memory: Vector Store + Knowledge Graph

Persistent memory using embeddings for semantic search:

\`\`\`python
class LongTermMemory:
    def __init__(self, collection_name: str = "agent_memory"):
        self.vector_store = ChromaDB(collection_name)

    def remember(self, content: str, metadata: dict = None):
        """Store a memory with semantic embedding."""
        self.vector_store.add(
            documents=[content],
            metadatas=[metadata or {}],
            ids=[f"mem_{time.time()}"]
        )

    def recall(self, query: str, k: int = 5) -> list:
        """Retrieve relevant memories by semantic similarity."""
        results = self.vector_store.query(query, n_results=k)
        return results["documents"][0]

    def remember_fact(self, subject: str, predicate: str, obj: str):
        """Store a structured fact."""
        fact = f"{subject} {predicate} {obj}"
        self.remember(fact, {
            "type": "fact",
            "subject": subject,
            "predicate": predicate,
            "object": obj
        })

    def remember_preference(self, user_id: str, preference: str):
        """Store a user preference."""
        self.remember(preference, {
            "type": "preference",
            "user_id": user_id
        })
\`\`\`

### Episodic Memory: Learning from Experience

Store specific experiences to learn from past successes and failures:

\`\`\`python
class EpisodicMemory:
    def __init__(self):
        self.episodes = []

    def record_episode(self, task: str, actions: list,
                       outcome: str, success: bool, reflection: str):
        self.episodes.append({
            "task": task,
            "actions": actions,
            "outcome": outcome,
            "success": success,
            "reflection": reflection,
            "timestamp": time.time()
        })

    def recall_similar(self, task: str, k: int = 3) -> list:
        """Find similar past tasks and their outcomes."""
        # In production, use embeddings for semantic matching
        scored = []
        for ep in self.episodes:
            similarity = llm(
                f"Rate similarity 0-10:\\nTask A: {task}\\nTask B: {ep['task']}"
            )
            scored.append((ep, int(similarity.strip())))
        scored.sort(key=lambda x: x[1], reverse=True)
        return [ep for ep, score in scored[:k]]

    def get_lessons(self, task: str) -> str:
        """Get lessons learned from similar past tasks."""
        similar = self.recall_similar(task)
        if not similar:
            return "No relevant past experience."
        lessons = []
        for ep in similar:
            status = "succeeded" if ep["success"] else "failed"
            lessons.append(
                f"Similar task {status}: {ep['task']}\\n"
                f"  Reflection: {ep['reflection']}"
            )
        return "\\n".join(lessons)
\`\`\`

### Combining Memory Types

\`\`\`python
class AgentMemory:
    """Unified memory system combining all types."""
    def __init__(self, user_id: str):
        self.working = WorkingMemory()
        self.short_term = ShortTermMemory()
        self.long_term = LongTermMemory()
        self.episodic = EpisodicMemory()
        self.user_id = user_id

    def get_full_context(self, query: str) -> str:
        """Assemble context from all memory types."""
        recent = self.short_term.get_recent_context()
        relevant = self.long_term.recall(query)
        lessons = self.episodic.get_lessons(query)

        return (
            f"Recent conversations:\\n{recent}\\n\\n"
            f"Relevant knowledge:\\n{relevant}\\n\\n"
            f"Lessons from past experience:\\n{lessons}"
        )
\`\`\`

### Key Takeaway

Memory transforms agents from stateless tools into persistent assistants that learn and improve. Working memory handles the current task, short-term memory provides session continuity, long-term memory stores knowledge, and episodic memory enables learning from experience. Most production agents need at least working + long-term memory.`,
    },
    {
      id: "pr-context-engineering",
      slug: "context-engineering",
      title: "Context Engineering",
      content: `## Context Engineering

**Context engineering** is the discipline of crafting the information that goes into an LLM's context window to maximize the quality of its outputs. For agents, this is critical — the context determines what the agent knows, how it reasons, and what actions it takes.

### Why Context Engineering Matters

An agent's behavior is shaped entirely by its context:
- **System prompt** → Defines personality, capabilities, and constraints
- **Tools** → Determines what actions are possible
- **Conversation history** → Provides continuity and task context
- **Retrieved documents** → Supplies external knowledge
- **Memory** → Adds personal and historical context

Get the context wrong, and even the most capable model will produce poor results.

### The Context Stack

Think of agent context as layers, from most stable to most dynamic:

\`\`\`
┌─────────────────────────────────┐
│  System Prompt (static)         │ ← Identity, rules, personality
├─────────────────────────────────┤
│  Tool Definitions (semi-static) │ ← Available actions
├─────────────────────────────────┤
│  Long-Term Memory (session)     │ ← Retrieved memories, user prefs
├─────────────────────────────────┤
│  Short-Term Memory (recent)     │ ← Recent conversation summaries
├─────────────────────────────────┤
│  Working Context (dynamic)      │ ← Current conversation + tool results
├─────────────────────────────────┤
│  User Message (ephemeral)       │ ← The current query
└─────────────────────────────────┘
\`\`\`

### System Prompt Engineering

The system prompt is the most impactful piece of context:

\`\`\`python
AGENT_SYSTEM_PROMPT = """You are a senior software engineer assistant.

## Identity
- Name: CodeBot
- Expertise: Python, TypeScript, system design, debugging
- Personality: Direct, thorough, teaches while helping

## Capabilities
You can read files, write code, run tests, and search documentation.
Always explain your reasoning before taking actions.

## Rules
1. NEVER modify files without explaining what you'll change and why
2. ALWAYS run tests after code changes
3. If you're unsure, ASK rather than guess
4. Prefer simple solutions over clever ones
5. Include error handling in all code you write

## Output Format
- Use markdown for all responses
- Code blocks must specify the language
- Include comments in code explaining non-obvious logic

## Tool Usage Guidelines
- read_file: Use to understand existing code before modifying
- write_file: Always show a diff of changes before writing
- run_tests: Run after every code change
- search_docs: Use when you need API reference information"""
\`\`\`

### Context Window Management

With limited context windows, prioritize what goes in:

\`\`\`python
def build_context(
    query: str,
    system_prompt: str,
    memory: AgentMemory,
    max_tokens: int = 150000
) -> list:
    """Build optimized context within token limits."""
    messages = []
    token_budget = max_tokens

    # Layer 1: System prompt (always included)
    messages.append({"role": "system", "content": system_prompt})
    token_budget -= estimate_tokens(system_prompt)

    # Layer 2: Relevant long-term memories
    memories = memory.long_term.recall(query, k=5)
    memory_text = "Relevant context:\\n" + "\\n".join(memories)
    if estimate_tokens(memory_text) < token_budget * 0.2:
        messages.append({"role": "system", "content": memory_text})
        token_budget -= estimate_tokens(memory_text)

    # Layer 3: Recent conversation summary
    recent = memory.short_term.get_recent_context()
    if estimate_tokens(recent) < token_budget * 0.1:
        messages.append({"role": "system", "content": f"Recent history:\\n{recent}"})
        token_budget -= estimate_tokens(recent)

    # Layer 4: Current conversation (most recent messages first)
    working = memory.working.get_context()
    for msg in reversed(working):
        msg_tokens = estimate_tokens(msg["content"])
        if msg_tokens < token_budget:
            messages.insert(-1, msg)  # Insert before last
            token_budget -= msg_tokens
        else:
            break

    # Layer 5: Current query
    messages.append({"role": "user", "content": query})

    return messages
\`\`\`

### Context Compression Techniques

When context exceeds the window, compress it:

1. **Summarization**: Condense older messages into summaries
2. **Selective retrieval**: Only include memories relevant to the current query
3. **Message pruning**: Remove tool call/result pairs, keep only conclusions
4. **Token-aware truncation**: Cut from the middle, preserve start and end

\`\`\`python
def compress_messages(messages: list, target_tokens: int) -> list:
    """Compress conversation history to fit within token budget."""
    current_tokens = sum(estimate_tokens(m["content"]) for m in messages)

    if current_tokens <= target_tokens:
        return messages

    # Strategy 1: Summarize older messages
    old_messages = messages[1:-5]  # Keep system + last 5
    summary = llm(
        "Summarize this conversation, preserving key decisions "
        f"and information:\\n{json.dumps(old_messages)}"
    )
    compressed = [messages[0]]  # System prompt
    compressed.append({"role": "system", "content": f"Conversation summary: {summary}"})
    compressed.extend(messages[-5:])  # Recent messages

    return compressed
\`\`\`

### The CLAUDE.md Pattern

A pattern used by Claude Code: put persistent project context in a file the agent reads at startup:

\`\`\`markdown
# CLAUDE.md — Project Context

## Project: E-commerce Platform
- Stack: Next.js, Prisma, PostgreSQL
- Deploy: Vercel + Railway
- Testing: Vitest + Playwright

## Conventions
- Use server components by default
- Database queries go through Prisma service layer
- All API routes need authentication middleware
- Error responses use RFC 7807 format

## Known Issues
- Cart service has a race condition on concurrent updates (ticket #234)
- Search indexing is slow for products with >50 variants
\`\`\`

### Key Takeaway

Context engineering is perhaps the most underrated skill in agent development. The quality of your agent's context directly determines the quality of its behavior. Design your context stack deliberately — system prompt, tools, memory, and conversation history each serve a specific purpose. Manage your token budget carefully and compress aggressively when needed.`,
    },
    {
      id: "pr-safety",
      slug: "safety-guardrails",
      title: "Safety & Guardrails",
      content: `## Safety & Guardrails

Agents that can take real-world actions need robust safety systems. A bug in a chatbot produces a bad response; a bug in an agent can send emails, delete files, or make API calls. Guardrails prevent agents from going off the rails.

### The Safety Stack

\`\`\`
[Input Guardrails]   — Validate and sanitize user requests
       ↓
[Agent Reasoning]    — Constrained by system prompt + rules
       ↓
[Tool Guardrails]    — Permission checks, sandboxing
       ↓
[Output Guardrails]  — Validate agent responses before delivery
       ↓
[Monitoring]         — Detect anomalies in real-time
\`\`\`

### Input Guardrails

Filter malicious or out-of-scope requests before they reach the agent:

\`\`\`python
class InputGuard:
    def __init__(self):
        self.blocked_patterns = [
            r"ignore.*previous.*instructions",
            r"pretend.*you.*are",
            r"system.*prompt",
            r"jailbreak",
        ]
        self.max_input_length = 10000

    def validate(self, user_input: str) -> tuple:
        """Returns (is_safe, reason)."""
        # Length check
        if len(user_input) > self.max_input_length:
            return False, "Input too long"

        # Prompt injection detection
        input_lower = user_input.lower()
        for pattern in self.blocked_patterns:
            if re.search(pattern, input_lower):
                return False, f"Blocked pattern detected"

        # Content classification (use a fast model)
        classification = llm(
            f"Classify this input as SAFE or UNSAFE:\\n{user_input}",
            model="claude-haiku-4-20250414"
        )
        if "UNSAFE" in classification:
            return False, "Content classified as unsafe"

        return True, "OK"
\`\`\`

### Tool Permission System

Not every agent should have access to every tool. Implement granular permissions:

\`\`\`python
from enum import Flag, auto

class Permission(Flag):
    READ = auto()       # Read files, query databases
    WRITE = auto()      # Write files, update records
    EXECUTE = auto()    # Run code, execute commands
    NETWORK = auto()    # Make HTTP requests
    DELETE = auto()     # Delete files, drop tables
    ADMIN = auto()      # System administration

class ToolPermissionManager:
    def __init__(self):
        self.tool_permissions = {}
        self.agent_permissions = {}

    def register_tool(self, tool_name: str, required_permission: Permission):
        self.tool_permissions[tool_name] = required_permission

    def grant_agent(self, agent_name: str, permissions: Permission):
        self.agent_permissions[agent_name] = permissions

    def can_use(self, agent_name: str, tool_name: str) -> bool:
        agent_perms = self.agent_permissions.get(agent_name, Permission(0))
        tool_perms = self.tool_permissions.get(tool_name, Permission.ADMIN)
        return bool(agent_perms & tool_perms)

# Setup
perms = ToolPermissionManager()
perms.register_tool("read_file", Permission.READ)
perms.register_tool("write_file", Permission.WRITE)
perms.register_tool("delete_file", Permission.DELETE)
perms.register_tool("web_search", Permission.NETWORK)
perms.register_tool("run_code", Permission.EXECUTE)

# Research agent: read + network only
perms.grant_agent("researcher", Permission.READ | Permission.NETWORK)
# Coding agent: read + write + execute
perms.grant_agent("coder", Permission.READ | Permission.WRITE | Permission.EXECUTE)
\`\`\`

### Output Guardrails

Validate agent outputs before they reach the user:

\`\`\`python
class OutputGuard:
    def __init__(self):
        self.pii_patterns = [
            r"\\b\\d{3}-\\d{2}-\\d{4}\\b",     # SSN
            r"\\b\\d{16}\\b",                   # Credit card
            r"\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b",  # Email
        ]

    def sanitize(self, output: str) -> str:
        """Remove PII and sensitive data from agent output."""
        sanitized = output
        for pattern in self.pii_patterns:
            sanitized = re.sub(pattern, "[REDACTED]", sanitized)
        return sanitized

    def validate_response(self, query: str, response: str) -> tuple:
        """Check if response is appropriate."""
        check = llm(
            f"Does this response contain harmful content, private data, "
            f"or instructions for dangerous activities?\\n"
            f"Query: {query}\\nResponse: {response}\\n"
            f"Answer SAFE or UNSAFE with reason.",
            model="claude-haiku-4-20250414"
        )
        is_safe = "SAFE" in check and "UNSAFE" not in check
        return is_safe, check
\`\`\`

### Rate Limiting and Budget Caps

Prevent runaway agents from burning through resources:

\`\`\`python
class AgentLimits:
    def __init__(self):
        self.limits = {
            "max_steps_per_request": 20,
            "max_tool_calls_per_step": 5,
            "max_tokens_per_request": 200000,
            "max_cost_per_request_usd": 2.0,
            "max_requests_per_minute": 10,
            "max_file_writes_per_request": 5,
        }

    def check(self, metric: str, current_value: int) -> bool:
        limit = self.limits.get(metric)
        if limit is None:
            return True
        return current_value < limit
\`\`\`

### Key Takeaway

Safety is not optional for production agents. Implement guardrails at every level: validate inputs, control tool permissions, sanitize outputs, and monitor everything. The principle of least privilege applies — agents should only have the permissions they need for their specific role. Build safety in from the start, not as an afterthought.

> **Resource**: [Microsoft AI Agents for Beginners — Lesson 16: Safety](https://github.com/microsoft/ai-agents-for-beginners) covers agent safety patterns and prompt injection defenses.`,
    },
    {
      id: "pr-mcp-a2a",
      slug: "mcp-a2a-protocols",
      title: "MCP & A2A Protocols",
      content: `## MCP & A2A Protocols

As AI agents become more prevalent, two standards are emerging for interoperability: **MCP** (Model Context Protocol) for agent-to-tool communication and **A2A** (Agent-to-Agent) for agent-to-agent communication.

### Model Context Protocol (MCP)

**MCP**, created by Anthropic, is an open standard that defines how AI agents connect to external tools and data sources. Think of it as a USB standard for AI — any MCP-compatible tool works with any MCP-compatible agent.

### The MCP Architecture

\`\`\`
[AI Agent / Host]
       ↓
[MCP Client] ← Speaks MCP protocol
       ↓
[MCP Server] ← Wraps a tool, database, or API
       ↓
[External Resource] (database, API, file system, etc.)
\`\`\`

### Why MCP Matters

Before MCP, every agent framework had its own tool integration format:
- LangChain tools
- CrewAI tools
- AutoGen tools
- Custom REST APIs

MCP provides a universal standard so tools are built once and work everywhere.

### MCP Capabilities

MCP servers can expose three types of capabilities:

| Capability | Description | Example |
|-----------|-------------|---------|
| **Tools** | Functions the agent can call | \`search_database(query)\` |
| **Resources** | Data the agent can read | Files, database tables, API endpoints |
| **Prompts** | Pre-built prompt templates | "Analyze this code for bugs" |

### Building an MCP Server

\`\`\`python
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
import mcp.server.stdio
import mcp.types as types

# Create server
server = Server("weather-server")

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="get_weather",
            description="Get current weather for a city",
            inputSchema={
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "City name"
                    }
                },
                "required": ["city"]
            }
        )
    ]

@server.call_tool()
async def handle_call_tool(
    name: str, arguments: dict
) -> list[types.TextContent]:
    if name == "get_weather":
        city = arguments["city"]
        # Call actual weather API here
        weather = fetch_weather(city)
        return [types.TextContent(
            type="text",
            text=f"Weather in {city}: {weather}"
        )]
    raise ValueError(f"Unknown tool: {name}")

# Run with stdio transport
async def main():
    async with mcp.server.stdio.stdio_server() as (read, write):
        await server.run(read, write, InitializationOptions(
            server_name="weather",
            server_version="1.0.0"
        ))
\`\`\`

### Agent-to-Agent (A2A) Protocol

**A2A**, introduced by Google, enables agents built on different frameworks to communicate and collaborate. Where MCP connects agents to tools, A2A connects agents to other agents.

### A2A Concepts

| Concept | Description |
|---------|-------------|
| **Agent Card** | JSON metadata describing an agent's capabilities |
| **Task** | A unit of work sent between agents |
| **Message** | Communication between agents within a task |
| **Artifact** | Output produced by an agent (files, data, reports) |

### Agent Card Example

\`\`\`json
{
  "name": "Research Agent",
  "description": "Searches the web and produces research reports",
  "url": "https://research-agent.example.com",
  "capabilities": {
    "streaming": true,
    "pushNotifications": false
  },
  "skills": [
    {
      "id": "web-research",
      "name": "Web Research",
      "description": "Search the web and synthesize findings",
      "inputModes": ["text"],
      "outputModes": ["text", "file"]
    }
  ]
}
\`\`\`

### MCP + A2A Together

The two protocols are complementary:

\`\`\`
[Agent A] ←── A2A ──→ [Agent B]
    │                      │
    MCP                    MCP
    │                      │
[Tool 1] [Tool 2]    [Tool 3] [Tool 4]
\`\`\`

- **MCP**: How each agent connects to its tools (vertical integration)
- **A2A**: How agents talk to each other (horizontal integration)

### The Ecosystem

| Protocol | Created By | Purpose | Status |
|----------|-----------|---------|--------|
| **MCP** | Anthropic | Agent ↔ Tool | Widely adopted |
| **A2A** | Google | Agent ↔ Agent | Early adoption |
| **OpenAPI** | Community | API specification | Mature standard |

### Practical Impact

With MCP and A2A, you can:
1. Build a tool once (MCP server) and use it with any agent
2. Build an agent once (A2A-compatible) and collaborate with any other agent
3. Mix frameworks — a LangGraph agent can talk to a CrewAI agent via A2A
4. Compose complex workflows from independent, specialized agents

### Key Takeaway

MCP and A2A are the emerging standards for AI agent interoperability. MCP standardizes how agents connect to tools (like USB for AI), while A2A standardizes how agents communicate with each other. Adopting these protocols future-proofs your agent systems and enables participation in the broader agent ecosystem.

> **Resources**:
> - [MCP Specification](https://modelcontextprotocol.io/) — Official MCP documentation
> - [Microsoft AI Agents for Beginners](https://github.com/microsoft/ai-agents-for-beginners) — Includes MCP integration lessons
> - [GenAI Agents](https://github.com/NirDiamant/GenAI_Agents) — Agent interoperability patterns`,
    },
  ],
};
