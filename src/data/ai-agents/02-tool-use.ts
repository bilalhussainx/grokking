import { Module } from "../types";

export const toolUseModule: Module = {
  id: "agent-tool-use",
  title: "Tool Use",
  description:
    "Master the tool use design pattern — how LLMs call functions, how to build custom tools, and how to integrate web search, APIs, and databases.",
  lessons: [
    {
      id: "tu-design-pattern",
      slug: "tool-use-design-pattern",
      title: "Tool Use Design Pattern",
      content: `## Tool Use Design Pattern

Tool use (also called "function calling") is the most important capability that separates agents from chatbots. It allows an LLM to reach beyond its training data and interact with the real world.

### The Core Pattern

Instead of generating only text, the LLM generates a **structured tool call** that your application executes:

\`\`\`
User: "What's the weather in Tokyo?"

LLM Response (without tools): "I don't have real-time data, but Tokyo typically..."
LLM Response (with tools): { "tool": "get_weather", "args": { "city": "Tokyo" } }

Your App: Calls weather API → Returns {"temp": 22, "condition": "sunny"}
LLM Final Response: "It's currently 22°C and sunny in Tokyo."
\`\`\`

### How Tool Use Works

The flow has four stages:

1. **Define tools**: You describe available tools to the LLM (name, description, parameters)
2. **LLM decides**: Given the user's query, the LLM decides whether to call a tool and which one
3. **Execute**: Your code runs the tool and gets the result
4. **Synthesize**: The LLM incorporates the tool result into its response

\`\`\`python
# Tool definition (JSON Schema format)
tools = [{
    "name": "get_weather",
    "description": "Get current weather for a city",
    "input_schema": {
        "type": "object",
        "properties": {
            "city": {"type": "string", "description": "City name"},
            "units": {"type": "string", "enum": ["celsius", "fahrenheit"]}
        },
        "required": ["city"]
    }
}]
\`\`\`

### Tool Definition Best Practices

The quality of your tool definitions directly impacts how well the LLM uses them:

| Practice | Bad | Good |
|----------|-----|------|
| **Name** | \`func1\` | \`search_database\` |
| **Description** | \`"Does search"\` | \`"Search the product database by name, category, or price range"\` |
| **Parameters** | No descriptions | Each param has a clear description |
| **Examples** | None | Include example values in descriptions |

### Single vs Multi-Tool Calls

Modern LLMs can call **multiple tools in parallel** when the calls are independent:

\`\`\`
User: "Compare weather in Tokyo and London"

LLM: [
  { "tool": "get_weather", "args": { "city": "Tokyo" } },
  { "tool": "get_weather", "args": { "city": "London" } }
]
\`\`\`

This is more efficient than sequential calls — both execute simultaneously.

### Tool Use vs RAG

Both give LLMs access to external information, but they differ:

- **RAG** retrieves pre-indexed documents passively
- **Tool Use** actively calls functions and APIs on demand
- **Best practice**: Combine both — use RAG for static knowledge, tools for dynamic data

### Common Tool Categories

| Category | Examples |
|----------|---------|
| **Information** | Web search, database queries, API calls |
| **Computation** | Calculator, code execution, data analysis |
| **Action** | Send email, create file, update database |
| **Communication** | Slack message, GitHub PR, calendar invite |

### Key Takeaway

Tool use is how agents interact with the world. The LLM decides when and how to use tools based on your definitions, your application executes them, and the LLM synthesizes the results. Good tool definitions are as important as good prompts.

> **Resource**: [Microsoft AI Agents for Beginners — Lesson 4: Tool Use](https://github.com/microsoft/ai-agents-for-beginners) provides detailed walkthroughs of tool use patterns.`,
    },
    {
      id: "tu-function-calling",
      slug: "function-calling-with-llms",
      title: "Function Calling with LLMs",
      content: `## Function Calling with LLMs

Function calling is the mechanism that allows LLMs to request tool execution in a structured way. Each major LLM provider implements this slightly differently, but the core concept is the same.

### Anthropic (Claude) Function Calling

Claude uses a \`tools\` parameter with JSON Schema definitions:

\`\`\`python
from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    tools=[{
        "name": "get_stock_price",
        "description": "Get the current stock price for a ticker symbol",
        "input_schema": {
            "type": "object",
            "properties": {
                "ticker": {
                    "type": "string",
                    "description": "Stock ticker symbol (e.g., AAPL, GOOGL)"
                }
            },
            "required": ["ticker"]
        }
    }],
    messages=[{"role": "user", "content": "What's Apple's stock price?"}]
)

# Check if the LLM wants to call a tool
for block in response.content:
    if block.type == "tool_use":
        print(f"Tool: {block.name}")
        print(f"Args: {block.input}")
        # → Tool: get_stock_price
        # → Args: {"ticker": "AAPL"}
\`\`\`

### The Tool Use Conversation Flow

A complete tool use exchange requires multiple messages:

\`\`\`python
# Step 1: User asks a question
messages = [{"role": "user", "content": "What's Apple's stock price?"}]

# Step 2: LLM returns a tool_use block
response = client.messages.create(model="claude-sonnet-4-20250514", tools=tools, messages=messages)
# response.stop_reason == "tool_use"

# Step 3: Execute the tool and return the result
messages.append({"role": "assistant", "content": response.content})
messages.append({
    "role": "user",
    "content": [{
        "type": "tool_result",
        "tool_use_id": response.content[0].id,
        "content": '{"price": 198.50, "currency": "USD"}'
    }]
})

# Step 4: LLM synthesizes the final answer
final = client.messages.create(model="claude-sonnet-4-20250514", tools=tools, messages=messages)
# "Apple (AAPL) is currently trading at $198.50 USD."
\`\`\`

### OpenAI Function Calling

OpenAI uses a similar but slightly different format:

\`\`\`python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o",
    tools=[{
        "type": "function",
        "function": {
            "name": "get_stock_price",
            "description": "Get the current stock price",
            "parameters": {
                "type": "object",
                "properties": {
                    "ticker": {"type": "string"}
                },
                "required": ["ticker"]
            }
        }
    }],
    messages=[{"role": "user", "content": "What's Apple's stock price?"}]
)
\`\`\`

### Handling Multiple Tool Calls

When the LLM requests multiple tools simultaneously:

\`\`\`python
for block in response.content:
    if block.type == "tool_use":
        # Execute each tool
        result = execute_tool(block.name, block.input)
        tool_results.append({
            "type": "tool_result",
            "tool_use_id": block.id,
            "content": json.dumps(result)
        })
\`\`\`

### Error Handling

Always handle tool failures gracefully — the LLM can adapt:

\`\`\`python
try:
    result = execute_tool(name, args)
    content = json.dumps(result)
except Exception as e:
    content = json.dumps({"error": str(e)})
    # The LLM will see the error and may try a different approach
\`\`\`

### Key Takeaway

Function calling is the bridge between LLM reasoning and real-world actions. The LLM generates structured tool calls, your code executes them, and the results flow back for the LLM to interpret. Master this pattern and you can build agents that interact with any API or system.`,
    },
    {
      id: "tu-custom-tools",
      slug: "building-custom-tools",
      title: "Building Custom Tools",
      content: `## Building Custom Tools

Off-the-shelf tools (web search, calculators) are useful, but the real power of agents comes from custom tools tailored to your specific domain. Let's learn how to design and build them.

### Anatomy of a Good Tool

Every custom tool needs four things:

1. **Clear name**: Verb-noun format (\`search_products\`, \`create_invoice\`)
2. **Precise description**: What it does, when to use it, what it returns
3. **Typed parameters**: JSON Schema with descriptions for each parameter
4. **Robust implementation**: Handles errors, validates input, returns structured output

### Example: Building a Database Query Tool

\`\`\`python
import sqlite3
import json

def query_products(
    category: str = None,
    min_price: float = None,
    max_price: float = None,
    search_term: str = None,
    limit: int = 10
) -> str:
    """Search the product database with optional filters.

    Returns matching products with name, price, category, and rating.
    Use this when the user asks about products, prices, or inventory.
    """
    conn = sqlite3.connect("products.db")
    query = "SELECT name, price, category, rating FROM products WHERE 1=1"
    params = []

    if category:
        query += " AND category = ?"
        params.append(category)
    if min_price is not None:
        query += " AND price >= ?"
        params.append(min_price)
    if max_price is not None:
        query += " AND price <= ?"
        params.append(max_price)
    if search_term:
        query += " AND name LIKE ?"
        params.append(f"%{search_term}%")

    query += " ORDER BY rating DESC LIMIT ?"
    params.append(limit)

    cursor = conn.execute(query, params)
    results = [dict(zip(["name", "price", "category", "rating"], row))
               for row in cursor.fetchall()]
    conn.close()

    return json.dumps(results, indent=2)
\`\`\`

### The Tool Definition

\`\`\`python
product_tool = {
    "name": "query_products",
    "description": (
        "Search the product database. Use when the user asks about "
        "products, prices, availability, or wants recommendations. "
        "Returns a list of matching products with name, price, category, and rating."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "category": {
                "type": "string",
                "description": "Product category (e.g., 'electronics', 'clothing')",
                "enum": ["electronics", "clothing", "books", "home", "sports"]
            },
            "min_price": {
                "type": "number",
                "description": "Minimum price filter"
            },
            "max_price": {
                "type": "number",
                "description": "Maximum price filter"
            },
            "search_term": {
                "type": "string",
                "description": "Search term to match against product names"
            },
            "limit": {
                "type": "integer",
                "description": "Maximum number of results (default 10)",
                "default": 10
            }
        }
    }
}
\`\`\`

### Design Principles for Custom Tools

**1. Single Responsibility**
Each tool should do one thing well. Don't create a "do_everything" tool.

\`\`\`
Bad:  manage_database(action, table, query, data, ...)
Good: search_products(...), create_order(...), update_inventory(...)
\`\`\`

**2. Return Structured Data**
Return JSON, not prose. The LLM can format it for the user.

**3. Include Metadata**
Return counts, pagination info, and status codes:

\`\`\`python
return json.dumps({
    "results": products,
    "total_count": total,
    "page": page,
    "has_more": total > offset + limit
})
\`\`\`

**4. Validate Input**
Don't trust the LLM to always send valid parameters:

\`\`\`python
def safe_tool(param: str) -> str:
    if not param or len(param) > 1000:
        return json.dumps({"error": "Invalid parameter"})
    # ... proceed with valid input
\`\`\`

**5. Rate Limit and Timeout**
Protect against runaway agents:

\`\`\`python
import time

MAX_CALLS_PER_MINUTE = 30
call_timestamps = []

def rate_limited_tool(args):
    now = time.time()
    call_timestamps[:] = [t for t in call_timestamps if now - t < 60]
    if len(call_timestamps) >= MAX_CALLS_PER_MINUTE:
        return {"error": "Rate limit exceeded. Try again in a moment."}
    call_timestamps.append(now)
    return execute_tool(args)
\`\`\`

### Key Takeaway

Custom tools are where agents become truly useful for your specific domain. Design them with clear names, precise descriptions, structured output, and robust error handling. The LLM's ability to use your tools is only as good as your tool definitions.`,
    },
    {
      id: "tu-web-search",
      slug: "web-search-api-integration",
      title: "Web Search & API Integration",
      content: `## Web Search & API Integration

Web search and API tools give agents access to real-time information beyond their training data. These are among the most commonly used tools in production agents.

### Web Search Tools

Two popular search APIs purpose-built for AI agents:

**Tavily Search** (recommended for AI applications):

\`\`\`python
import requests
import json

def tavily_search(query: str, max_results: int = 5) -> str:
    """Search the web using Tavily. Returns relevant results with snippets."""
    response = requests.post(
        "https://api.tavily.com/search",
        json={
            "query": query,
            "search_depth": "advanced",
            "max_results": max_results,
            "include_answer": True
        },
        headers={"Authorization": "Bearer YOUR_TAVILY_KEY"}
    )
    data = response.json()
    results = []
    for r in data.get("results", []):
        results.append({
            "title": r["title"],
            "url": r["url"],
            "content": r["content"][:300]
        })
    return json.dumps({
        "answer": data.get("answer", ""),
        "results": results
    }, indent=2)
\`\`\`

**Brave Search** (broad web coverage):

\`\`\`python
def brave_search(query: str, count: int = 5) -> str:
    """Search the web using Brave Search API."""
    response = requests.get(
        "https://api.search.brave.com/res/v1/web/search",
        params={"q": query, "count": count},
        headers={"X-Subscription-Token": "YOUR_BRAVE_KEY"}
    )
    data = response.json()
    results = []
    for r in data.get("web", {}).get("results", []):
        results.append({
            "title": r["title"],
            "url": r["url"],
            "description": r.get("description", "")[:300]
        })
    return json.dumps(results, indent=2)
\`\`\`

### REST API Integration Pattern

Any REST API can become an agent tool. Here's a reusable pattern:

\`\`\`python
def create_api_tool(base_url: str, headers: dict):
    """Factory for creating API tools."""

    def api_get(endpoint: str, params: dict = None) -> str:
        """Make a GET request to the API."""
        try:
            response = requests.get(
                f"{base_url}{endpoint}",
                params=params,
                headers=headers,
                timeout=10
            )
            response.raise_for_status()
            return json.dumps(response.json(), indent=2)
        except requests.RequestException as e:
            return json.dumps({"error": str(e)})

    def api_post(endpoint: str, data: dict) -> str:
        """Make a POST request to the API."""
        try:
            response = requests.post(
                f"{base_url}{endpoint}",
                json=data,
                headers=headers,
                timeout=10
            )
            response.raise_for_status()
            return json.dumps(response.json(), indent=2)
        except requests.RequestException as e:
            return json.dumps({"error": str(e)})

    return api_get, api_post
\`\`\`

### Chaining Search with Verification

A common agent pattern is to search, then verify by fetching the source:

\`\`\`python
def research_topic(query: str) -> str:
    """Search for a topic and verify with primary sources."""
    # Step 1: Search
    search_results = tavily_search(query, max_results=3)
    results = json.loads(search_results)

    # Step 2: Fetch primary source for verification
    verified = []
    for r in results["results"]:
        try:
            page = requests.get(r["url"], timeout=5)
            if page.status_code == 200:
                r["verified"] = True
                verified.append(r)
        except Exception:
            r["verified"] = False

    return json.dumps({"verified_results": verified}, indent=2)
\`\`\`

### Common API Integrations for Agents

| API | Use Case | Tool Name |
|-----|----------|-----------|
| **GitHub** | Code search, PR management | \`search_repos\`, \`create_issue\` |
| **Notion** | Knowledge base queries | \`search_pages\`, \`create_page\` |
| **Slack** | Team communication | \`send_message\`, \`search_messages\` |
| **Stripe** | Payment operations | \`get_invoice\`, \`create_refund\` |
| **Jira** | Project management | \`create_ticket\`, \`update_status\` |

### Security Considerations

When giving agents API access, always:

- **Use read-only tokens** where possible
- **Scope permissions** to the minimum required
- **Log all API calls** for audit trails
- **Implement approval flows** for destructive actions (delete, update)
- **Rate limit** to prevent runaway costs

### Key Takeaway

Web search and API tools are the most practical way to make agents useful. Tavily and Brave provide AI-optimized search, while any REST API can be wrapped into a tool. Always prioritize security — agents with API access can take real-world actions.`,
    },
    {
      id: "tu-filesystem",
      slug: "filesystem-database-tools",
      title: "File System & Database Tools",
      content: `## File System & Database Tools

File system and database tools let agents read, write, and query persistent data. These tools are essential for coding agents, data analysis agents, and any agent that needs to work with files or structured data.

### File System Tools

A complete set of file tools for a coding agent:

\`\`\`python
import os
import json

def read_file(file_path: str) -> str:
    """Read the contents of a file. Returns the file content as text."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        return json.dumps({
            "path": file_path,
            "content": content,
            "size_bytes": os.path.getsize(file_path)
        })
    except FileNotFoundError:
        return json.dumps({"error": f"File not found: {file_path}"})
    except Exception as e:
        return json.dumps({"error": str(e)})

def write_file(file_path: str, content: str) -> str:
    """Write content to a file. Creates the file if it doesn't exist."""
    try:
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        return json.dumps({"status": "success", "path": file_path})
    except Exception as e:
        return json.dumps({"error": str(e)})

def list_directory(dir_path: str, pattern: str = "*") -> str:
    """List files in a directory with optional glob pattern filtering."""
    import glob
    try:
        files = glob.glob(os.path.join(dir_path, pattern))
        entries = []
        for f in sorted(files):
            stat = os.stat(f)
            entries.append({
                "name": os.path.basename(f),
                "path": f,
                "is_dir": os.path.isdir(f),
                "size": stat.st_size
            })
        return json.dumps(entries, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})

def search_files(directory: str, pattern: str) -> str:
    """Search for files containing a text pattern (like grep)."""
    import re
    matches = []
    for root, dirs, files in os.walk(directory):
        for fname in files:
            fpath = os.path.join(root, fname)
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    for i, line in enumerate(f, 1):
                        if re.search(pattern, line):
                            matches.append({
                                "file": fpath,
                                "line": i,
                                "content": line.strip()
                            })
            except (UnicodeDecodeError, PermissionError):
                continue
    return json.dumps(matches[:50], indent=2)  # Limit results
\`\`\`

### Database Tools

SQL database tools for data analysis agents:

\`\`\`python
import sqlite3

def query_database(sql: str, database: str = "app.db") -> str:
    """Execute a read-only SQL query and return results as JSON.

    Only SELECT queries are allowed for safety.
    """
    # Safety check: only allow SELECT
    if not sql.strip().upper().startswith("SELECT"):
        return json.dumps({"error": "Only SELECT queries are allowed"})

    try:
        conn = sqlite3.connect(database)
        conn.row_factory = sqlite3.Row
        cursor = conn.execute(sql)
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return json.dumps({
            "rows": rows,
            "count": len(rows)
        }, indent=2, default=str)
    except Exception as e:
        return json.dumps({"error": str(e)})

def describe_tables(database: str = "app.db") -> str:
    """List all tables and their schemas in the database."""
    conn = sqlite3.connect(database)
    tables = conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table'"
    ).fetchall()

    schema = {}
    for (table_name,) in tables:
        columns = conn.execute(f"PRAGMA table_info({table_name})").fetchall()
        schema[table_name] = [
            {"name": col[1], "type": col[2], "nullable": not col[3]}
            for col in columns
        ]
    conn.close()
    return json.dumps(schema, indent=2)
\`\`\`

### Safety Patterns

File and database tools carry real risks. Always implement guardrails:

\`\`\`python
# Sandbox: restrict to allowed directories
ALLOWED_DIRS = ["/workspace", "/tmp/agent"]

def safe_read_file(file_path: str) -> str:
    abs_path = os.path.abspath(file_path)
    if not any(abs_path.startswith(d) for d in ALLOWED_DIRS):
        return json.dumps({"error": "Access denied: path outside sandbox"})
    return read_file(abs_path)

# Read-only database: use a copy or read-only connection
def safe_query(sql: str) -> str:
    # Connect in read-only mode (SQLite URI)
    conn = sqlite3.connect("file:app.db?mode=ro", uri=True)
    # ... execute query
\`\`\`

### Approval Workflows

For write operations, implement human-in-the-loop:

\`\`\`python
def write_file_with_approval(path: str, content: str) -> str:
    """Write a file after showing the user what will be written."""
    return json.dumps({
        "status": "pending_approval",
        "action": "write_file",
        "path": path,
        "preview": content[:500],
        "message": "Please approve this file write operation."
    })
\`\`\`

### Key Takeaway

File system and database tools make agents capable of real work — reading codebases, writing files, querying data. But with great power comes great responsibility: always sandbox file access, restrict database operations to read-only where possible, and implement approval workflows for destructive actions.

> **Resource**: [Microsoft AI Agents for Beginners](https://github.com/microsoft/ai-agents-for-beginners) covers tool use patterns including file and database integration.`,
    },
  ],
};
