import { Module } from "../types";

export const planningModule: Module = {
  id: "agent-planning",
  title: "Planning",
  description: "Master the planning design pattern — how agents decompose tasks, reason about actions, execute plans, and correct course through reflection.",
  lessons: [
    {
      id: "pl-design-pattern",
      slug: "planning-design-pattern",
      title: "Planning Design Pattern",
      content: `## Planning Design Pattern

Planning is one of the most powerful capabilities of AI agents. Rather than reacting step-by-step to each new piece of information, a **planning agent** formulates a structured sequence of actions upfront, then executes them methodically. This shifts agents from reactive systems into proactive problem-solvers capable of tackling complex, multi-step tasks reliably.

\`\`\`concept
{ "title": "The Planning Mental Model", "variant": "mental-model", "content": "A planning agent separates **reasoning** from **acting**. First it thinks: 'What is the complete sequence of steps that leads from my current state to the goal?' Then it executes that sequence — checking results and re-planning when reality diverges from expectation. This deliberate separation is what enables AI agents to handle long-horizon tasks that would confuse a purely reactive (ReAct-style) agent." }
\`\`\`

### Why Planning Matters

Consider asking an agent: "Refactor this codebase to use TypeScript instead of JavaScript."

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Without Planning — Chaotic Execution", "code": "→ Converts the first file it finds\\n→ Breaks imports in other files\\n→ Realises TypeScript is not installed\\n→ Goes back and installs it\\n→ Misses tsconfig.json and build scripts\\n→ Chaotic, inefficient, error-prone" }, "after": { "label": "With Planning — Systematic Execution", "code": "Plan:\\n1. Analyse codebase (files, deps, build config)\\n2. Install TypeScript, create tsconfig.json\\n3. Rename .js → .ts (leaf modules first)\\n4. Add type annotations progressively\\n5. Update build scripts and CI\\n6. Run type checker, fix errors\\n7. Run tests to verify nothing broken\\n\\n→ Execute in order. Systematic and comprehensive." } }
\`\`\`

The difference is profound: planning surfaces dependencies between steps *before* execution begins, allowing the agent to choose the correct order and avoid cascading failures.

### The Planning Loop

\`\`\`mermaid
flowchart LR
    G([Goal]) --> P[Create Plan]
    P --> E1[Execute Step 1]
    E1 --> C1{Result OK?}
    C1 -->|yes| E2[Execute Step 2]
    C1 -->|no| RP[Re-Plan]
    RP --> E2
    E2 --> EN[... Step N]
    EN --> V{Goal Met?}
    V -->|yes| D([Deliver Result])
    V -->|no| RP2[Re-Plan]
    RP2 --> EN
\`\`\`

When a step fails or produces unexpected results, the agent **re-plans** — adjusting the remaining steps based on what it has learned so far. This adaptive loop is what separates a rigid script from an intelligent agent.

### Planning vs ReAct

| Aspect | ReAct (No Planning) | Plan-and-Execute |
|--------|-------------------|-----------------|
| **Approach** | Think one step at a time | Create full plan, then execute |
| **Efficiency** | May backtrack frequently | Direct path to goal |
| **Parallelism** | None | Can parallelize independent steps |
| **Visibility** | Implicit, hidden reasoning | Explicit, inspectable plan |
| **Adaptability** | Naturally adaptive | Needs explicit re-planning |
| **Best for** | Exploratory / dynamic tasks | Well-defined goals |

\`\`\`callout
{ "type": "info", "title": "Deliberative vs Reactive Planning", "content": "The research literature frames this as **deliberative planning** (full reasoning upfront, globally optimized but compute-intensive) vs **reactive planning** (fast responses via predefined rules, great for time-critical tasks). Most production agent frameworks use a **hybrid model** — plan at the task level, react at the tool-call level." }
\`\`\`

### Types of Plans

\`\`\`tabs
{ "tabs": [ { "label": "Sequential", "icon": "➡️", "content": "Steps execute one after another in a fixed order. Each step depends on the result of the previous.\\n\\n\`\`\`\\n1. Search for data\\n2. Analyse results\\n3. Write report\\n\`\`\`\\n\\n**When to use:** Tasks where each step depends on the output of the prior step, or where ordering is safety-critical (e.g., install dependencies before running code)." }, { "label": "Parallel", "icon": "⚡", "content": "Independent steps run simultaneously, then results are merged.\\n\\n\`\`\`\\n1a. Search source A ─┐\\n1b. Search source B ─┼→ 2. Merge → 3. Report\\n1c. Search source C ─┘\\n\`\`\`\\n\\n**When to use:** Any steps with no data dependency between them. Parallel plans dramatically reduce wall-clock time for I/O-bound tasks like multi-source research." }, { "label": "Conditional", "icon": "🔀", "content": "Later steps depend on the outcome of earlier ones — the plan branches based on what is discovered.\\n\\n\`\`\`\\n1. Check if API key exists\\n   → Yes: 2a. Call API directly\\n   → No:  2b. Prompt user for key\\n          → 3. Call API\\n\`\`\`\\n\\n**When to use:** Tasks where environmental state is unknown at plan-creation time. The planner generates both branches; the executor picks the right path at runtime." }, { "label": "Iterative", "icon": "🔄", "content": "A step (or group of steps) repeats until a condition is satisfied.\\n\\n\`\`\`\\n1. Write code\\n2. Run tests\\n3. If tests fail → go to 1\\n4. If tests pass → Done\\n\`\`\`\\n\\n**When to use:** Refinement loops — code generation, numerical optimization, multi-draft writing. The agent improves its output across iterations rather than getting a single shot." } ] }
\`\`\`

### Implementing Basic Planning

The core pattern is two functions: one that *creates* the plan (asks the LLM for a numbered list of steps), and one that *executes* it (runs each step, collects results, and triggers re-planning on error).

\`\`\`playground
{ "title": "Plan-and-Execute Agent", "language": "python", "code": "def create_plan(goal: str, context: str = \\"\\") -> list[str]:\\n    \\"\\"\\"Ask the LLM to generate a numbered action plan.\\"\\"\\"\\n    response = llm(\\n        f\\"Create a step-by-step plan for this goal.\\\\n\\\\n\\"\\n        f\\"Goal: {goal}\\\\n\\"\\n        f\\"Context: {context}\\\\n\\\\n\\"\\n        f\\"Return each step numbered 1-N. Be specific about which tools to use.\\"\\n    )\\n    steps = [\\n        line.strip() for line in response.split(\\"\\\\n\\")\\n        if line.strip() and line.strip()[0].isdigit()\\n    ]\\n    return steps\\n\\n\\ndef execute_plan(goal: str, tools: dict) -> str:\\n    plan = create_plan(goal)\\n    results = []\\n\\n    for i, step in enumerate(plan):\\n        print(f\\"Step {i+1}/{len(plan)}: {step}\\")\\n        result = execute_step(step, tools, results)\\n        results.append({\\"step\\": step, \\"result\\": result})\\n\\n        # Re-plan if a step fails\\n        if \\"ERROR\\" in str(result) or \\"UNEXPECTED\\" in str(result):\\n            remaining = plan[i+1:]\\n            revised = replan(goal, results, remaining)\\n            plan = plan[:i+1] + revised\\n            print(f\\"Re-planned: {len(revised)} steps revised\\")\\n\\n    return synthesize_results(goal, results)", "runnable": false }
\`\`\`

\`\`\`trace
{ "title": "Tracing execute_plan: 'Refactor codebase to TypeScript'", "language": "python", "code": "plan = create_plan(goal)\\nresults = []\\n\\nfor i, step in enumerate(plan):\\n    result = execute_step(step, tools, results)\\n    results.append({\\"step\\": step, \\"result\\": result})\\n    if \\"ERROR\\" in str(result):\\n        plan = plan[:i+1] + replan(goal, results, plan[i+1:])", "frames": [ { "line": 1, "vars": { "goal": "Refactor to TypeScript", "plan": "[]" }, "note": "LLM generates a 7-step plan from the goal description", "stdout": "" }, { "line": 4, "vars": { "i": 0, "step": "1. Analyse codebase structure" }, "note": "First step: understand what we're working with before touching anything", "stdout": "Step 1/7: Analyse codebase structure" }, { "line": 5, "vars": { "result": "{ files: 42, jsFiles: 38, deps: ['react', 'express'] }" }, "note": "Tool reads the file tree and package.json — results stored for later steps", "stdout": "" }, { "line": 4, "vars": { "i": 1, "step": "2. Install TypeScript, create tsconfig.json" }, "note": "Step 2 has context from step 1 (knows exact dependencies)", "stdout": "Step 2/7: Install TypeScript, create tsconfig.json" }, { "line": 5, "vars": { "result": "ERROR: npm not found in PATH" }, "note": "Unexpected failure — the executor detects ERROR in the result string", "stdout": "" }, { "line": 7, "vars": { "revised": "['2b. Use yarn add typescript', '3. Create tsconfig.json manually', '4. Rename .js to .ts ...']" }, "note": "Re-planner revises remaining steps around the failure — execution continues", "stdout": "Re-planned: 6 steps revised" } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Where to Put the Intelligence", "content": "The \`create_plan\` call is cheap — one LLM call upfront. The expensive work is in \`execute_step\`. Keep \`execute_step\` focused on tool calls and observation, and reserve LLM reasoning for the planner and the re-planner. This keeps token costs predictable and makes the plan **inspectable** by users or downstream systems before any irreversible actions are taken." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: PDDL and Classical AI Planning", "content": "Long before LLMs, AI researchers formalized planning with languages like **PDDL (Planning Domain Definition Language)**. A PDDL problem has:\\n\\n- **Initial state:** What is true right now\\n- **Goal state:** What we want to be true\\n- **Actions:** Preconditions + effects (what must hold before, what changes after)\\n\\nThe planner searches the state space for a sequence of actions that bridges initial → goal.\\n\\nA key theoretical result: deciding whether a plan *exists* for a propositional STRIPS (Stanford Research Institute Problem Solver) instance is **PSPACE-complete** — harder than NP in the worst case, even when operators are restricted to two preconditions and two postconditions. In practice, domain-independent planners (like Fast Downward) use heuristics to find satisficing (good enough, not necessarily optimal) plans quickly for most real-world problems.\\n\\nLLM-based agents inherit the same core structure — goal, actions, effects — but express it in natural language rather than formal logic, trading mathematical guarantees for flexibility and the ability to handle open-ended, underspecified domains." }
\`\`\`

### Knowledge Check

\`\`\`quiz
{ "title": "Planning Design Pattern", "questions": [ { "question": "An agent needs to scrape three independent websites and combine the results into a single report. Which plan type is most efficient?", "options": ["Sequential — scrape site 1, then 2, then 3", "Parallel — scrape all three simultaneously, then merge", "Iterative — keep scraping until enough data is collected", "Conditional — check if each site is reachable before scraping"], "answer": 1, "explanation": "The three scraping steps have no data dependency on each other, making them ideal candidates for parallel execution. This reduces total wall-clock time from 3× (sequential) to approximately 1× the cost of a single scrape." }, { "question": "An agent's Step 3 fails with an unexpected error mid-execution. In the Plan-and-Execute pattern, what is the correct response?", "options": ["Abort the entire task and report failure to the user", "Retry Step 3 with the exact same parameters", "Re-plan the remaining steps using results collected so far", "Skip Step 3 and continue with Step 4 unchanged"], "answer": 2, "explanation": "Re-planning adjusts the *remaining* steps based on what the agent has learned — including the failure context. The agent may revise its approach, insert a recovery step, or find an alternative path. Skipping or blindly retrying without re-planning ignores the information the failure provides." }, { "question": "What is the primary visibility advantage of Plan-and-Execute over ReAct?", "options": ["ReAct produces a visible plan; Plan-and-Execute does not", "Plan-and-Execute generates an explicit, inspectable plan before acting; ReAct's reasoning is implicit", "Both approaches produce equally visible plans before execution", "Neither approach exposes its reasoning to users or other systems"], "answer": 1, "explanation": "Plan-and-Execute generates an explicit, numbered sequence of steps before any tools are called. Users and systems can review (and even approve) the plan. ReAct interleaves thought with action, making the reasoning implicit and harder to audit or interrupt." }, { "question": "According to computational complexity theory, what is the difficulty of deciding whether a plan exists for a propositional STRIPS problem?", "options": ["P (solvable in polynomial time)", "NP-complete", "PSPACE-complete", "Undecidable (no algorithm can solve it)"], "answer": 2, "explanation": "Determining plan existence for propositional STRIPS is PSPACE-complete — harder than NP in the worst case. This is why real planners rely on heuristics to find satisficing (sufficient, not necessarily optimal) plans rather than exhaustive search." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Planning separates reasoning from acting — the agent thinks through the full task before touching any tools, making complex multi-step work systematic and auditable.", "Re-planning is not a failure mode; it is a feature. A good planning agent treats unexpected results as information and revises its remaining steps accordingly.", "Four plan structures cover most tasks: sequential (ordered dependencies), parallel (independent steps), conditional (branching on discovered state), and iterative (refinement loops).", "Plan-and-Execute suits well-defined goals with predictable structure; ReAct is better for exploratory tasks where the path forward is genuinely unknown upfront.", "Classical AI planning (STRIPS, PDDL) and LLM-based planning share the same core structure — goal, actions, effects — but LLM agents trade formal guarantees for natural-language flexibility and the ability to operate in open-ended domains." ] }
\`\`\``,
    },
    {
      id: "pl-task-decomposition",
      slug: "task-decomposition",
      title: "Task Decomposition Strategies",
      content: `## Task Decomposition Strategies

Task decomposition is the art of breaking a complex goal into smaller, manageable sub-tasks. This is often the most critical step in agent planning — a good decomposition makes execution straightforward, while a bad one leads to confusion and failure.

### Why Decompose?

LLMs work best on focused, well-defined tasks. A single prompt asking "Build me a full-stack e-commerce app" will fail. But a series of focused tasks — "Create the database schema," "Build the product API," "Create the checkout flow" — each succeed individually.

### Strategy 1: Top-Down Decomposition

Start with the high-level goal and recursively break it down:

\`\`\`
Goal: "Create a blog application"

Level 1:
  1. Set up the project
  2. Build the backend
  3. Build the frontend
  4. Deploy

Level 2 (expanding "Build the backend"):
  2.1. Design the database schema
  2.2. Create CRUD API endpoints
  2.3. Add authentication
  2.4. Write tests

Level 3 (expanding "Create CRUD API endpoints"):
  2.2.1. Create POST /posts endpoint
  2.2.2. Create GET /posts endpoint
  2.2.3. Create GET /posts/:id endpoint
  2.2.4. Create PUT /posts/:id endpoint
  2.2.5. Create DELETE /posts/:id endpoint
\`\`\`

### Strategy 2: Dependency-Based Decomposition

Identify dependencies between tasks and order accordingly:

\`\`\`python
def decompose_with_dependencies(goal: str) -> dict:
    """Decompose a goal into tasks with explicit dependencies."""
    response = llm(
        f"Break this goal into tasks. For each task, list its dependencies "
        f"(which other tasks must complete first).\\n\\n"
        f"Goal: {goal}\\n\\n"
        f"Format each task as:\\n"
        f"Task: [description]\\n"
        f"Depends on: [task numbers or 'none']\\n"
        f"Tools needed: [tools]"
    )
    return parse_dependency_graph(response)
\`\`\`

**Example output:**
\`\`\`
Task 1: Install dependencies       | Depends on: none
Task 2: Create database schema      | Depends on: 1
Task 3: Build API endpoints         | Depends on: 2
Task 4: Create frontend components  | Depends on: 1 (can run parallel with 2, 3)
Task 5: Connect frontend to API     | Depends on: 3, 4
Task 6: Write tests                 | Depends on: 3, 5
Task 7: Deploy                      | Depends on: 6
\`\`\`

Tasks 2-3 and 4 can run in parallel since they don't depend on each other.

### Strategy 3: Least-to-Most Prompting

Start with the simplest sub-problem and progressively solve harder ones, using earlier solutions as context:

\`\`\`python
def least_to_most(goal: str) -> str:
    # Step 1: Decompose into sub-problems, ordered by difficulty
    sub_problems = llm(
        f"List the sub-problems for this goal, from simplest to hardest:\\n{goal}"
    ).split("\\n")

    # Step 2: Solve each, feeding previous solutions as context
    solutions = []
    for problem in sub_problems:
        context = "\\n".join(solutions) if solutions else "None yet"
        solution = llm(
            f"Previous solutions:\\n{context}\\n\\n"
            f"Now solve: {problem}"
        )
        solutions.append(f"{problem}: {solution}")

    return solutions[-1]  # Final solution builds on all previous
\`\`\`

### Strategy 4: Analogical Decomposition

Use similar solved problems as templates:

\`\`\`python
def decompose_by_analogy(goal: str, similar_plans: list) -> list:
    """Use previous successful plans as decomposition templates."""
    examples = "\\n\\n".join([
        f"Goal: {p['goal']}\\nPlan: {p['steps']}"
        for p in similar_plans
    ])
    response = llm(
        f"Here are plans for similar goals:\\n{examples}\\n\\n"
        f"Create a plan for this new goal, using the above as inspiration:\\n"
        f"Goal: {goal}"
    )
    return parse_plan(response)
\`\`\`

### Decomposition Quality Checklist

A good decomposition has these properties:

| Property | Description | Check |
|----------|-------------|-------|
| **Atomic** | Each task does one thing | Can it be described in one sentence? |
| **Measurable** | Clear success criteria | How do you know it's done? |
| **Independent** | Minimal coupling | Can it run without other tasks' state? |
| **Ordered** | Dependencies are explicit | Is the execution order clear? |
| **Complete** | All tasks cover the goal | Does completing all tasks achieve the goal? |

### Common Decomposition Mistakes

1. **Tasks too large**: "Build the backend" is not atomic enough
2. **Missing dependencies**: Forgetting that the frontend needs the API to be ready
3. **Over-decomposition**: Creating 50 micro-tasks when 10 would suffice
4. **Ambiguous tasks**: "Make it work" — what does "work" mean?

### Key Takeaway

Task decomposition is the foundation of effective agent planning. Use top-down for broad goals, dependency-based for complex workflows, least-to-most for progressive problem-solving, and analogical for recurring patterns. The quality of decomposition directly determines the quality of execution.`,
    },
    {
      id: "pl-react-loop",
      slug: "react-loop",
      title: "ReAct Loop (Reasoning + Acting)",
      content: `## ReAct Loop: Reasoning + Acting

The **ReAct** pattern (Yao et al., 2022) is the most widely used agent architecture. It interleaves reasoning (thinking about what to do) with acting (using tools to do it), creating a natural problem-solving loop.

### The ReAct Format

Each iteration of the loop has three parts:

\`\`\`
Thought: I need to find the population of Tokyo to answer this question.
Action: search("Tokyo population 2025")
Observation: Tokyo's population is approximately 13.96 million (2025 estimate).

Thought: Now I have the population. The question asks for the population density.
         I need the area of Tokyo as well.
Action: search("Tokyo area square kilometers")
Observation: Tokyo covers 2,194 square kilometers.

Thought: Population density = 13,960,000 / 2,194 = 6,362 people per km².
Action: calculator("13960000 / 2194")
Observation: 6362.35

Thought: I now have all the information to answer the question.
Answer: Tokyo has a population density of approximately 6,362 people per km².
\`\`\`

### Why Thoughts Matter

The "Thought" step is not just decoration — it significantly improves performance:

| Approach | Accuracy | Why |
|----------|----------|-----|
| **Act only** (no thinking) | Lower | Model may call wrong tool or wrong arguments |
| **Think only** (no tools) | Moderate | Model hallucinates when it lacks information |
| **ReAct** (think + act) | Highest | Thinking guides tool use; tools ground thinking |

### Implementation

\`\`\`python
from anthropic import Anthropic

client = Anthropic()

REACT_SYSTEM = """You are an agent that solves problems step by step.

For each step, use this exact format:

Thought: [your reasoning about what to do next]
Action: [tool_name(arguments)]

After receiving an observation, continue with another Thought/Action pair.
When you have the final answer:

Thought: [why you're confident in the answer]
Answer: [your final answer]

Available tools:
- search(query): Search the web for information
- calculator(expression): Evaluate a math expression
- read_file(path): Read a file's contents
- write_file(path, content): Write content to a file"""

def react_agent(query: str, tools: dict, max_iterations: int = 10) -> str:
    messages = [{"role": "user", "content": query}]

    for i in range(max_iterations):
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2048,
            system=REACT_SYSTEM,
            messages=messages
        )
        text = response.content[0].text

        # Check for final answer
        if "Answer:" in text:
            return text.split("Answer:")[-1].strip()

        # Parse and execute action
        if "Action:" in text:
            action_line = text.split("Action:")[-1].strip().split("\\n")[0]
            tool_name = action_line.split("(")[0].strip()
            tool_args = action_line.split("(", 1)[1].rstrip(")")

            if tool_name in tools:
                observation = tools[tool_name](tool_args)
            else:
                observation = f"Error: Unknown tool '{tool_name}'"

            messages.append({"role": "assistant", "content": text})
            messages.append({
                "role": "user",
                "content": f"Observation: {observation}"
            })
        else:
            # No action — nudge the agent
            messages.append({"role": "assistant", "content": text})
            messages.append({
                "role": "user",
                "content": "Continue with a Thought and Action."
            })

    return "Agent reached maximum iterations without a final answer."
\`\`\`

### ReAct with Native Tool Calling

Modern LLMs support structured tool calling, which is more reliable than string parsing:

\`\`\`python
def react_with_native_tools(query: str, tools_schema: list, tools_impl: dict):
    messages = [{"role": "user", "content": query}]

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2048,
            tools=tools_schema,
            messages=messages
        )

        # Process response blocks
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            # Agent has finished — extract text response
            return next(b.text for b in response.content if b.type == "text")

        if response.stop_reason == "tool_use":
            # Execute all tool calls
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = tools_impl[block.name](**block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": str(result)
                    })
            messages.append({"role": "user", "content": tool_results})
\`\`\`

### Common ReAct Failure Modes

1. **Infinite loops**: Agent keeps repeating the same action. Fix: track actions and detect repetition.
2. **Wrong tool selection**: Agent picks a tool that can't help. Fix: improve tool descriptions.
3. **Observation blindness**: Agent ignores tool output. Fix: explicitly reference observations in thoughts.

### Key Takeaway

ReAct is the workhorse of agent architectures — simple to implement, effective across domains, and naturally self-correcting. The key insight is that interleaving reasoning with action produces better results than either alone. Start here when building any agent.`,
    },
    {
      id: "pl-plan-execute",
      slug: "plan-and-execute-pattern",
      title: "Plan-and-Execute Pattern",
      content: `## Plan-and-Execute Pattern

While ReAct thinks one step at a time, **Plan-and-Execute** creates a complete plan upfront, then executes each step with a dedicated executor. This architecture excels at complex, multi-step tasks where efficiency and structure matter.

### Architecture

\`\`\`
                ┌───────────┐
                │  Planner  │ ← Creates the plan (LLM call)
                └─────┬─────┘
                      │
                ┌─────▼─────┐
                │ Plan Steps│ [Step 1, Step 2, Step 3, ...]
                └─────┬─────┘
                      │
           ┌──────────▼──────────┐
           │   Executor (loop)   │ ← Executes each step (may use tools)
           │  for step in plan:  │
           │    result = exec(step)│
           │    if failed: replan │
           └──────────┬──────────┘
                      │
                ┌─────▼─────┐
                │  Re-planner│ ← Adjusts remaining plan if needed
                └─────┬─────┘
                      │
                ┌─────▼─────┐
                │   Result   │
                └────────────┘
\`\`\`

### Implementation

\`\`\`python
from typing import List, Optional
from dataclasses import dataclass

@dataclass
class Step:
    description: str
    tools_needed: List[str]
    status: str = "pending"  # pending, completed, failed
    result: Optional[str] = None

@dataclass
class Plan:
    goal: str
    steps: List[Step]
    current_step: int = 0

def create_plan(goal: str, available_tools: list) -> Plan:
    """Use LLM to create a structured plan."""
    tool_list = ", ".join(available_tools)
    response = llm(
        f"Create a plan to achieve this goal:\\n{goal}\\n\\n"
        f"Available tools: {tool_list}\\n\\n"
        f"For each step, specify:\\n"
        f"- What to do (be specific)\\n"
        f"- Which tools are needed\\n\\n"
        f"Format as JSON array of objects with 'description' and 'tools_needed' fields."
    )
    steps_data = json.loads(response)
    steps = [Step(**s) for s in steps_data]
    return Plan(goal=goal, steps=steps)

def execute_step(step: Step, tools: dict, context: str) -> str:
    """Execute a single step using available tools."""
    response = llm(
        f"Execute this step: {step.description}\\n\\n"
        f"Context from previous steps:\\n{context}\\n\\n"
        f"Available tools: {', '.join(step.tools_needed)}\\n"
        f"Use tools as needed, then provide the result."
    )
    # In practice, parse and execute tool calls from the response
    return response

def replan(plan: Plan, failed_step: int, error: str) -> Plan:
    """Create a new plan for remaining steps after a failure."""
    completed = plan.steps[:failed_step]
    completed_summary = "\\n".join(
        [f"Done: {s.description} → {s.result}" for s in completed]
    )
    response = llm(
        f"Original goal: {plan.goal}\\n\\n"
        f"Completed steps:\\n{completed_summary}\\n\\n"
        f"Step {failed_step + 1} failed: {plan.steps[failed_step].description}\\n"
        f"Error: {error}\\n\\n"
        f"Create a new plan for the remaining work, accounting for the failure."
    )
    new_steps_data = json.loads(response)
    new_steps = [Step(**s) for s in new_steps_data]
    plan.steps = list(completed) + new_steps
    plan.current_step = failed_step
    return plan

def plan_and_execute(goal: str, tools: dict) -> str:
    """Full Plan-and-Execute pipeline."""
    available_tools = list(tools.keys())
    plan = create_plan(goal, available_tools)

    print(f"Plan created with {len(plan.steps)} steps:")
    for i, step in enumerate(plan.steps):
        print(f"  {i+1}. {step.description}")

    context_parts = []

    for i, step in enumerate(plan.steps):
        plan.current_step = i
        print(f"\\nExecuting step {i+1}: {step.description}")

        try:
            context = "\\n".join(context_parts)
            result = execute_step(step, tools, context)
            step.status = "completed"
            step.result = result
            context_parts.append(f"Step {i+1}: {step.description} → {result}")
            print(f"  ✓ Result: {result[:100]}...")

        except Exception as e:
            step.status = "failed"
            print(f"  ✗ Failed: {e}")
            plan = replan(plan, i, str(e))
            print(f"  Replanned: {len(plan.steps) - i} steps remaining")

    # Synthesize final result
    all_results = "\\n".join(context_parts)
    return llm(
        f"Goal: {plan.goal}\\n\\n"
        f"All completed steps and results:\\n{all_results}\\n\\n"
        f"Synthesize a final answer."
    )
\`\`\`

### When Plan-and-Execute Beats ReAct

| Scenario | Winner | Why |
|----------|--------|-----|
| 2-3 step task | ReAct | Planning overhead not worth it |
| 10+ step task | Plan-and-Execute | Structure prevents drift |
| Parallelizable steps | Plan-and-Execute | Can identify and parallelize |
| Highly uncertain task | ReAct | Can't plan what you don't know |
| Repeatable workflow | Plan-and-Execute | Plan can be cached and reused |

### Advanced: Hierarchical Planning

For very complex tasks, use multi-level planning:

\`\`\`
High-level plan: [Phase 1: Research] [Phase 2: Design] [Phase 3: Build] [Phase 4: Test]
Phase 2 sub-plan: [2.1: Schema] [2.2: API design] [2.3: UI wireframes]
Step 2.1 execution: Direct tool use with ReAct
\`\`\`

The planner creates high-level phases, each phase is decomposed into steps, and each step is executed with a ReAct-style executor.

### Key Takeaway

Plan-and-Execute separates strategic thinking (what to do) from tactical execution (how to do it). This produces more efficient, structured, and debuggable agent behavior for complex tasks. The re-planning capability makes it robust to failures. Combine with ReAct at the execution level for the best of both worlds.`,
    },
    {
      id: "pl-reflection",
      slug: "reflection-self-correction",
      title: "Reflection & Self-Correction",
      content: `## Reflection & Self-Correction

**Reflection** is the ability of an agent to evaluate its own outputs and improve them. This is one of the most impactful patterns in agent design — a single reflection step can dramatically improve quality without any additional tools or data.

### Why Reflection Works

LLMs are better at evaluating work than generating it from scratch. When you ask a model to:
1. Generate a solution, then
2. Critique that solution, then
3. Improve based on the critique

The final output is consistently better than the initial generation.

### The Reflection Pattern

\`\`\`
Generate → Reflect → Improve → (Repeat if needed) → Final Output
\`\`\`

### Basic Reflection Implementation

\`\`\`python
def generate_with_reflection(
    task: str,
    max_reflections: int = 3
) -> str:
    """Generate content, then iteratively improve through reflection."""

    # Step 1: Initial generation
    draft = llm(f"Complete this task:\\n{task}")

    for i in range(max_reflections):
        # Step 2: Reflect — critique the draft
        critique = llm(
            f"Task: {task}\\n\\n"
            f"Current draft:\\n{draft}\\n\\n"
            f"Critique this draft. Identify specific issues with:\\n"
            f"- Accuracy: Are there factual errors?\\n"
            f"- Completeness: Is anything missing?\\n"
            f"- Clarity: Is anything confusing?\\n"
            f"- Quality: How could this be improved?\\n\\n"
            f"If the draft is excellent and needs no changes, say APPROVED."
        )

        if "APPROVED" in critique:
            print(f"Draft approved after {i} reflection(s)")
            break

        # Step 3: Improve based on critique
        draft = llm(
            f"Original task: {task}\\n\\n"
            f"Current draft:\\n{draft}\\n\\n"
            f"Critique:\\n{critique}\\n\\n"
            f"Improve the draft to address all critique points."
        )
        print(f"Reflection {i+1}: Improved draft based on critique")

    return draft
\`\`\`

### Reflexion: Reflection with Memory

The **Reflexion** pattern (Shinn et al., 2023) adds persistent memory to reflection. The agent remembers past failures and uses them to avoid repeating mistakes:

\`\`\`python
class ReflexionAgent:
    def __init__(self):
        self.memory = []  # Stores past reflections

    def solve(self, task: str, max_attempts: int = 3) -> str:
        for attempt in range(max_attempts):
            # Include past reflections as context
            memory_context = ""
            if self.memory:
                memory_context = (
                    "Past attempts and lessons learned:\\n"
                    + "\\n".join(self.memory)
                    + "\\n\\nAvoid repeating these mistakes.\\n\\n"
                )

            # Generate solution
            solution = llm(
                f"{memory_context}"
                f"Task: {task}\\n"
                f"Attempt {attempt + 1}. Provide your best solution."
            )

            # Test the solution
            test_result = self.evaluate(solution, task)

            if test_result["passed"]:
                return solution

            # Reflect on failure and store in memory
            reflection = llm(
                f"Task: {task}\\n"
                f"My solution: {solution}\\n"
                f"Test result: {test_result['feedback']}\\n\\n"
                f"What went wrong? What should I do differently next time?"
            )
            self.memory.append(
                f"Attempt {attempt + 1}: {reflection}"
            )

        return f"Failed after {max_attempts} attempts. Reflections: {self.memory}"
\`\`\`

### Self-Correction in Agent Loops

Integrate reflection directly into the ReAct loop:

\`\`\`python
def react_with_reflection(query: str, tools: dict) -> str:
    messages = [{"role": "user", "content": query}]
    trajectory = []  # Track all actions and results

    for step in range(MAX_STEPS):
        response = get_agent_response(messages)

        if is_final_answer(response):
            # Reflect before returning
            reflection = llm(
                f"Query: {query}\\n\\n"
                f"Trajectory:\\n{format_trajectory(trajectory)}\\n\\n"
                f"Final answer: {response}\\n\\n"
                f"Is this answer correct and complete? "
                f"If not, what should be done differently?"
            )
            if "correct" in reflection.lower():
                return extract_answer(response)
            else:
                # Continue with reflection as guidance
                messages.append({"role": "user", "content":
                    f"Self-reflection: {reflection}. Please try again."})
                continue

        # Execute action and continue loop...
        result = execute_action(response, tools)
        trajectory.append({"action": response, "result": result})
\`\`\`

### Types of Reflection

| Type | When | What It Checks |
|------|------|----------------|
| **Output reflection** | After generation | Quality, accuracy, completeness |
| **Process reflection** | After task completion | Was the approach efficient? |
| **Trajectory reflection** | During agent loop | Are we on the right track? |
| **Failure reflection** | After errors | What went wrong and why? |

### Reflection Prompting Tips

- Be specific about evaluation criteria (don't just ask "is this good?")
- Ask for concrete improvements, not vague suggestions
- Set a maximum number of reflections to avoid infinite loops
- Use a different "temperature" for reflection (lower = more critical)
- Grade on a scale (1-10) to make stopping decisions easier

### Key Takeaway

Reflection is the simplest yet most impactful agent improvement technique. A single reflection step can catch errors, fill gaps, and improve quality significantly. For maximum impact, combine reflection with memory (Reflexion) so the agent learns from past mistakes across attempts.

> **Resource**: [GenAI Agents — Reflexion](https://github.com/NirDiamant/GenAI_Agents) includes implementations of Reflexion and other self-improvement patterns.`,
    },
  ],
};
