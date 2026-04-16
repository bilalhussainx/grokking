import { Module } from "../types";

export const module5: Module = {
  id: "langchain-langgraph",
  title: "LangChain, LangGraph & Agentic Workflows",
  description: "LangChain Expression Language (LCEL), chains, LangGraph for stateful multi-step agents, tool use, human-in-the-loop, and building reliable agentic systems",
  lessons: [
    {
      id: "langchain-langgraph",
      slug: "langchain-langgraph",
      title: "LangChain & LangGraph",
      content: `# LangChain, LangGraph & Agentic Workflows

LangChain provides composable building blocks for LLM apps. LangGraph adds stateful, cyclical workflows — allowing agents that loop, branch, and recover from failures. Together they're the production standard for complex AI workflows.

---

\`\`\`concept
{
  "title": "Why LangGraph Instead of Plain Agents",
  "variant": "mental-model",
  "content": "A simple ReAct agent is a while loop: think → act → observe → repeat. This works for simple tasks but fails for complex ones: it can get stuck, it loses state between steps, and errors cascade with no recovery. LangGraph models agent behavior as a directed graph: nodes are actions (call LLM, call tool, check condition), edges are transitions (success path, error path, human-review path). The state is explicitly managed and checkpointed. You get: interruption and resumption, parallel execution, conditional branching, and human-in-the-loop approval steps."
}
\`\`\`

---

## LCEL: LangChain Expression Language

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda

llm = ChatOpenAI(model="gpt-4o-mini")

# Basic chain:
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("user", "{question}"),
])
chain = prompt | llm | StrOutputParser()
result = chain.invoke({"question": "What is LoRA?"})

# Chain with structured output:
from pydantic import BaseModel, Field

class SentimentResult(BaseModel):
    sentiment: str = Field(description="positive, negative, or neutral")
    confidence: float = Field(description="confidence score 0-1")
    key_phrases: list[str] = Field(description="phrases that drove the sentiment")

structured_chain = (
    ChatPromptTemplate.from_template("Analyze the sentiment: {review}")
    | llm.with_structured_output(SentimentResult)
)
result = structured_chain.invoke({"review": "The product is amazing but expensive!"})
print(result.sentiment, result.confidence)

# Parallel chains:
from langchain_core.runnables import RunnableParallel

parallel_chain = RunnableParallel(
    summary=prompt_summary | llm | StrOutputParser(),
    sentiment=prompt_sentiment | llm | structured_parser,
    keywords=prompt_keywords | llm | list_parser,
)
# All three run concurrently:
results = parallel_chain.invoke({"text": long_document})

# Chain with RAG:
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | ChatPromptTemplate.from_template("""Answer based on context:
Context: {context}
Question: {question}""")
    | llm
    | StrOutputParser()
)
answer = rag_chain.invoke("What is the company's refund policy?")
\`\`\`

## LangGraph: Stateful Agents

\`\`\`python
from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode

# Define state:
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], lambda x, y: x + y]
    next_step: str

# Define tools:
from langchain_core.tools import tool

@tool
def search_web(query: str) -> str:
    """Search the web for current information."""
    # Implement web search (Tavily, SerpAPI, etc.)
    return tavily_client.search(query)

@tool
def calculate(expression: str) -> float:
    """Evaluate a mathematical expression."""
    return eval(expression)  # use safer eval in production

tools = [search_web, calculate]
tool_node = ToolNode(tools)

# LLM with tools bound:
llm_with_tools = ChatOpenAI(model="gpt-4o").bind_tools(tools)

# Agent node — calls LLM:
def agent(state: AgentState):
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}

# Routing logic:
def should_continue(state: AgentState):
    last_message = state["messages"][-1]
    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
        return "tools"  # LLM wants to call a tool
    return END          # LLM is done

# Build graph:
graph = StateGraph(AgentState)
graph.add_node("agent", agent)
graph.add_node("tools", tool_node)

graph.set_entry_point("agent")
graph.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
graph.add_edge("tools", "agent")  # after tools, go back to agent

app = graph.compile()

# Run:
result = app.invoke({
    "messages": [HumanMessage(content="What is the current price of Bitcoin?")]
})
print(result["messages"][-1].content)
\`\`\`

## Human-in-the-Loop

\`\`\`python
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import interrupt

# Checkpointing enables pause, review, and resume:
memory = MemorySaver()
app = graph.compile(checkpointer=memory, interrupt_before=["tools"])

config = {"configurable": {"thread_id": "conversation-123"}}

# Start the agent:
events = app.stream(
    {"messages": [HumanMessage(content="Send an email to all users about the outage")]},
    config=config,
)

for event in events:
    print(event)
    # Agent proposes tool call to send email → graph pauses

# Human reviews the proposed action:
state = app.get_state(config)
print("Proposed tool call:", state.values["messages"][-1].tool_calls)

# Human approves:
app.update_state(config, {"messages": []}, as_node="agent")
# Resume after approval:
for event in app.stream(None, config=config):
    print(event)

# --- Parallel subgraph execution ---
from langgraph.constants import Send

def research_router(state: ResearchState):
    # Fan out to multiple research agents in parallel:
    return [Send("research_agent", {"topic": topic}) for topic in state["topics"]]

graph.add_conditional_edges("plan", research_router)
# All research_agent nodes run concurrently, results merge back
\`\`\`

## Multi-Agent Systems

\`\`\`python
# Supervisor pattern: orchestrator delegates to specialist agents

from langchain_core.prompts import MessagesPlaceholder

def create_supervisor(agents: list[str]):
    prompt = ChatPromptTemplate.from_messages([
        ("system", f"""You are a supervisor managing these agents: {agents}
Given the user request, decide which agent should act next.
Respond with: {{"next": "agent_name"}} or {{"next": "FINISH"}}"""),
        MessagesPlaceholder(variable_name="messages"),
    ])
    return prompt | llm | JsonOutputParser()

supervisor = create_supervisor(["researcher", "writer", "editor"])

# Multi-agent graph:
team_graph = StateGraph(TeamState)
team_graph.add_node("supervisor", supervisor_node)
team_graph.add_node("researcher", researcher_agent)
team_graph.add_node("writer", writer_agent)
team_graph.add_node("editor", editor_agent)

team_graph.add_conditional_edges(
    "supervisor",
    lambda state: state["next"],
    {"researcher": "researcher", "writer": "writer",
     "editor": "editor", "FINISH": END}
)
# Each agent routes back to supervisor:
for agent in ["researcher", "writer", "editor"]:
    team_graph.add_edge(agent, "supervisor")
\`\`\`

\`\`\`takeaways
["LCEL's | operator chains runnables — prompt | llm | parser is the fundamental pattern.", "RunnableParallel runs multiple chains concurrently — use for independent enrichments (summary + sentiment + keywords).", "LangGraph checkpointing enables pause/review/resume — essential for any action with real-world consequences.", "interrupt_before='tools' pauses the graph before tool execution — human can review, modify, or reject.", "The supervisor pattern (orchestrator → specialists) scales better than single-agent loops for complex tasks.", "Always bind tools to the LLM (llm.bind_tools(tools)) — the model controls when and which tools to call."]
\`\`\`
`,
    },
  ],
};
