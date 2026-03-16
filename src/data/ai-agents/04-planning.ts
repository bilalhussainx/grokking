import { Module } from "../types";

export const planningModule: Module = {
  id: "agent-planning",
  title: "Planning",
  description:
    "Master the planning design pattern — how agents decompose tasks, reason about actions, execute plans, and correct course through reflection.",
  lessons: [
    {
      id: "pl-design-pattern",
      slug: "planning-design-pattern",
      title: "Planning Design Pattern",
      content: `## Planning Design Pattern

Planning is one of the most powerful capabilities of AI agents. Rather than reacting step-by-step, a planning agent creates an upfront plan, then executes it methodically. This is how agents tackle complex, multi-step tasks reliably.

### Why Planning Matters

Consider asking an agent: "Refactor this codebase to use TypeScript instead of JavaScript."

**Without planning:**
\`\`\`
→ Starts converting the first file it finds
→ Breaks imports in other files
→ Realizes it needs to install TypeScript
→ Goes back and fixes things
→ Misses configuration files
→ Chaotic, inefficient, error-prone
\`\`\`

**With planning:**
\`\`\`
Plan:
1. Analyze the codebase structure (files, dependencies, build config)
2. Install TypeScript and create tsconfig.json
3. Rename .js files to .ts, starting from leaf modules (no dependents)
4. Add type annotations progressively
5. Update build scripts and CI configuration
6. Run type checker and fix errors
7. Run tests to verify nothing is broken

→ Execute each step in order
→ Systematic, efficient, comprehensive
\`\`\`

### The Planning Loop

\`\`\`
Goal → [Create Plan] → [Execute Step 1] → [Check Result]
                     → [Execute Step 2] → [Check Result]
                     → ...
                     → [All Steps Done] → [Verify Goal Met]
                     → [Deliver Result]
\`\`\`

If a step fails or produces unexpected results, the agent can **re-plan** — adjusting the remaining steps based on what it learned.

### Planning vs ReAct

| Aspect | ReAct (No Planning) | Plan-and-Execute |
|--------|-------------------|-----------------|
| **Approach** | Think one step at a time | Create full plan, then execute |
| **Efficiency** | May backtrack | Direct path to goal |
| **Parallelism** | None | Can parallelize independent steps |
| **Visibility** | Hidden reasoning | Inspectable plan |
| **Adaptability** | Naturally adaptive | Needs explicit re-planning |
| **Best for** | Exploratory tasks | Well-defined goals |

### Types of Plans

**1. Sequential Plans**: Steps execute one after another
\`\`\`
1. Search for data → 2. Analyze results → 3. Write report
\`\`\`

**2. Parallel Plans**: Independent steps run simultaneously
\`\`\`
1a. Search source A  ─┐
1b. Search source B  ─┤→ 2. Merge results → 3. Generate report
1c. Search source C  ─┘
\`\`\`

**3. Conditional Plans**: Steps depend on prior outcomes
\`\`\`
1. Check if API key exists
   → Yes: 2a. Call API directly
   → No:  2b. Prompt user for key → 3. Call API
\`\`\`

**4. Iterative Plans**: Steps repeat until a condition is met
\`\`\`
1. Write code → 2. Run tests → 3. If tests fail, go to 1
\`\`\`

### Implementing Basic Planning

\`\`\`python
def create_plan(goal: str, context: str = "") -> list:
    """Ask the LLM to create a step-by-step plan."""
    response = llm(
        f"Create a detailed step-by-step plan to achieve this goal.\\n\\n"
        f"Goal: {goal}\\n"
        f"Context: {context}\\n\\n"
        f"Return each step on a new line, numbered 1-N.\\n"
        f"Each step should be specific and actionable.\\n"
        f"Include which tools to use for each step."
    )
    steps = [line.strip() for line in response.split("\\n")
             if line.strip() and line.strip()[0].isdigit()]
    return steps

def execute_plan(goal: str, tools: dict) -> str:
    plan = create_plan(goal)
    results = []

    for i, step in enumerate(plan):
        print(f"Executing step {i+1}: {step}")
        result = execute_step(step, tools, results)
        results.append({"step": step, "result": result})

        # Check if we need to replan
        if "ERROR" in str(result) or "UNEXPECTED" in str(result):
            remaining = plan[i+1:]
            new_plan = replan(goal, results, remaining)
            plan = plan[:i+1] + new_plan

    return synthesize_results(goal, results)
\`\`\`

### Key Takeaway

Planning transforms agents from reactive systems into proactive problem-solvers. By creating a plan before acting, agents can tackle complex tasks efficiently, handle dependencies between steps, and maintain a clear path to the goal. The best agents combine planning with the flexibility to re-plan when reality doesn't match expectations.

> **Resource**: [Microsoft AI Agents for Beginners — Lesson 9: Planning](https://github.com/microsoft/ai-agents-for-beginners) covers planning design patterns in depth.`,
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
