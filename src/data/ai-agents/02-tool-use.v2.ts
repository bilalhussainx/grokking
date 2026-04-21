import { Module } from "../types";

export const toolUseModule: Module = {
  id: "agent-tool-use",
  title: "Tool Use",
  description: "Master the tool use design pattern — how LLMs call functions, how to build custom tools, and how to integrate web search, APIs, and databases.",
  lessons: [
    {
      id: "tu-design-pattern",
      slug: "tool-use-design-pattern",
      title: "Tool Use Design Pattern",
      content: `## Tool Use Design Pattern

Tool use — also called **function calling** — is the capability that most clearly separates agents from chatbots. A chatbot is confined to its training data; an agent with tools can reach into the real world and act.

\`\`\`concept
{ "title": "The Tool Use Mental Model", "variant": "mental-model", "content": "The LLM is a brilliant strategist who cannot leave the room. Tools are couriers it can dispatch. The LLM writes a precise instruction slip (a structured JSON object), hands it to your application, and your application runs the errand and brings back a result. The LLM never executes code directly — it only decides *what* to request." }
\`\`\`

### The Contrast: With vs Without Tools

\`\`\`
User: "What's the weather in Tokyo?"

Without tools → LLM: "I don't have real-time data, but Tokyo typically..."
With tools    → LLM: { "tool": "get_weather", "args": { "city": "Tokyo" } }
               App:  Calls weather API → { "temp": 22, "condition": "sunny" }
               LLM:  "It's currently 22°C and sunny in Tokyo."
\`\`\`

The LLM doesn't know the temperature — it knows *how to ask for it*.

---

### The Four-Stage Flow

\`\`\`steps
{ "title": "How Tool Use Works", "steps": [ { "title": "Define tools", "content": "You describe each available tool to the LLM in JSON Schema format — its name, purpose, and parameter types. This is like handing someone a menu of services they can request.\\n\\n\`\`\`json\\n{\\n  \\"name\\": \\"get_weather\\",\\n  \\"description\\": \\"Get current weather for a city\\",\\n  \\"input_schema\\": {\\n    \\"type\\": \\"object\\",\\n    \\"properties\\": {\\n      \\"city\\": { \\"type\\": \\"string\\", \\"description\\": \\"City name, e.g. 'Tokyo'\\" },\\n      \\"units\\": { \\"type\\": \\"string\\", \\"enum\\": [\\"celsius\\", \\"fahrenheit\\"] }\\n    },\\n    \\"required\\": [\\"city\\"]\\n  }\\n}\\n\`\`\`" }, { "title": "LLM decides", "content": "Given the user's query and the tool definitions, the LLM reasons about whether a tool is needed, which one, and with what arguments. If no tool is appropriate, it responds directly.\\n\\nThis decision is based entirely on your **tool descriptions** — they act as the LLM's instructions for when to use each tool." }, { "title": "Your app executes", "content": "Your application receives the structured tool call from the LLM, runs the actual function, and collects the result. The LLM is not involved in this step at all.\\n\\n\`\`\`python\\ndef get_weather(city: str, units: str = \\"celsius\\") -> dict:\\n    response = requests.get(f\\"https://api.weather.com/v1/{city}\\")\\n    return response.json()\\n\\n# Your framework calls this based on the LLM's request\\nresult = get_weather(**tool_call.args)\\n\`\`\`" }, { "title": "LLM synthesizes", "content": "The tool result is injected back into the conversation as context. The LLM then generates a natural-language response that incorporates the real data.\\n\\nThis is the loop that can repeat — the LLM may call multiple tools in sequence before giving a final answer." } ] }
\`\`\`

---

### Writing Good Tool Definitions

The quality of your tool definitions has the same impact on tool-use accuracy as the quality of your prompts has on text generation. Vague descriptions produce wrong tool calls.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Weak definition", "code": "{\\n  \\"name\\": \\"func1\\",\\n  \\"description\\": \\"Does search\\",\\n  \\"input_schema\\": {\\n    \\"type\\": \\"object\\",\\n    \\"properties\\": {\\n      \\"q\\": { \\"type\\": \\"string\\" }\\n    }\\n  }\\n}" }, "after": { "label": "Strong definition", "code": "{\\n  \\"name\\": \\"search_products\\",\\n  \\"description\\": \\"Search the product catalog by name, category, or price range. Use this when the user asks about available products or wants to find items matching specific criteria.\\",\\n  \\"input_schema\\": {\\n    \\"type\\": \\"object\\",\\n    \\"properties\\": {\\n      \\"query\\": {\\n        \\"type\\": \\"string\\",\\n        \\"description\\": \\"Search terms, e.g. 'wireless headphones under $50'\\"\\n      },\\n      \\"category\\": {\\n        \\"type\\": \\"string\\",\\n        \\"enum\\": [\\"electronics\\", \\"clothing\\", \\"books\\"],\\n        \\"description\\": \\"Optional category filter\\"\\n      },\\n      \\"max_price\\": {\\n        \\"type\\": \\"number\\",\\n        \\"description\\": \\"Maximum price in USD\\"\\n      }\\n    },\\n    \\"required\\": [\\"query\\"]\\n  }\\n}" } }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "The 'When to Use' Sentence", "content": "Add a sentence to every tool description that starts with 'Use this when...' — it gives the LLM an explicit policy for when to reach for that tool vs. responding from its own knowledge. Without it, the LLM has to guess." }
\`\`\`

---

### Sequential vs Parallel Tool Calls

Modern LLMs can emit **multiple tool calls in a single response** when the calls are independent. Your application should execute independent calls concurrently.

\`\`\`tabs
{ "tabs": [ { "label": "Sequential (slow)", "icon": "🐢", "content": "The LLM calls one tool, waits for the result, then decides to call another:\\n\\n\`\`\`\\nTurn 1: LLM → get_weather(city=\\"Tokyo\\")\\nApp returns: {temp: 22, condition: \\"sunny\\"}\\n\\nTurn 2: LLM → get_weather(city=\\"London\\")\\nApp returns: {temp: 14, condition: \\"rainy\\"}\\n\\nTurn 3: LLM → \\"Tokyo is warmer at 22°C...\\"\\n\`\`\`\\n\\nTotal latency: 2 API calls × latency each." }, { "label": "Parallel (fast)", "icon": "⚡", "content": "The LLM recognizes both calls are independent and emits them together:\\n\\n\`\`\`\\nTurn 1: LLM → [\\n  get_weather(city=\\"Tokyo\\"),\\n  get_weather(city=\\"London\\")\\n]\\nApp runs both concurrently.\\nResults arrive together.\\n\\nTurn 2: LLM → \\"Tokyo is warmer at 22°C vs London's 14°C...\\"\\n\`\`\`\\n\\nTotal latency: 1 API call (both run simultaneously)." }, { "label": "When to use each", "icon": "🧭", "content": "**Use parallel calls when:**\\n- Queries are independent (different cities, different stocks)\\n- Results don't depend on each other\\n\\n**Use sequential calls when:**\\n- Step 2 depends on step 1's output (search → then fetch details for top result)\\n- You need to decide what to do next based on intermediate results\\n\\nWell-designed agents recognize both patterns automatically." } ] }
\`\`\`

---

### Tool Use vs RAG

Both patterns extend what the LLM knows, but they work very differently:

| | RAG | Tool Use |
|---|---|---|
| **Mechanism** | Retrieve pre-indexed documents | Call functions on demand |
| **Data type** | Static, text-based | Dynamic, structured |
| **Latency** | Low (vector search) | Higher (external API calls) |
| **Best for** | Internal docs, historical data | Live prices, real-time APIs, actions |
| **Can modify state?** | No | Yes (send email, write DB) |

\`\`\`callout
{ "type": "info", "title": "Use Both Together", "content": "The strongest production agents combine RAG and tool use: RAG for static knowledge bases (product docs, policy PDFs), tool use for dynamic data (live inventory, current prices, user account state). They solve different problems." }
\`\`\`

---

### Common Tool Categories

\`\`\`tabs
{ "tabs": [ { "label": "Information", "icon": "🔍", "content": "Tools that fetch data the LLM doesn't have:\\n\\n- **Web search** — current events, recent documentation\\n- **Database queries** — structured records, user data\\n- **API calls** — weather, stock prices, flight status\\n- **File reading** — PDFs, spreadsheets, CSVs\\n\\nThese are read-only and generally safe to call." }, { "label": "Computation", "icon": "🧮", "content": "Tools that perform calculations the LLM shouldn't attempt in its head:\\n\\n- **Calculator** — precise arithmetic, unit conversion\\n- **Code interpreter** — run Python, analyze data\\n- **Data analysis** — stats, aggregations over large datasets\\n- **Date/time arithmetic** — business days, timezone conversions\\n\\nLLMs hallucinate numbers — offload math to tools." }, { "label": "Action", "icon": "⚡", "content": "Tools that change state in the world — use with guardrails:\\n\\n- **Write to database** — create/update records\\n- **Send email or Slack** — external communications\\n- **Create GitHub PR/issue** — dev workflow automation\\n- **File operations** — create, modify, delete files\\n\\n⚠️ Always confirm irreversible actions before executing." }, { "label": "Integration", "icon": "🔗", "content": "Tools that bridge to third-party systems:\\n\\n- **Calendar** — read availability, create events\\n- **CRM** — look up contacts, log interactions\\n- **Payment systems** — check balances, initiate transfers\\n- **IoT/sensors** — read device state, trigger actions\\n\\nThese often need OAuth and careful permission scoping." } ] }
\`\`\`

---

### Seeing the Full Loop

Here's a complete, annotated execution trace — a user asks a question that requires one tool call:

\`\`\`trace
{ "title": "Full Tool Use Execution", "language": "python", "code": "import anthropic\\nimport json\\n\\nclient = anthropic.Anthropic()\\n\\ntools = [{\\n    \\"name\\": \\"get_weather\\",\\n    \\"description\\": \\"Get current weather for a city. Use this when user asks about weather.\\",\\n    \\"input_schema\\": {\\n        \\"type\\": \\"object\\",\\n        \\"properties\\": {\\n            \\"city\\": {\\"type\\": \\"string\\"}\\n        },\\n        \\"required\\": [\\"city\\"]\\n    }\\n}]\\n\\nmessages = [{\\"role\\": \\"user\\", \\"content\\": \\"What's the weather in Tokyo?\\"}]\\n\\nresponse = client.messages.create(\\n    model=\\"claude-opus-4-6\\",\\n    max_tokens=1024,\\n    tools=tools,\\n    messages=messages\\n)\\n\\ntool_call = response.content[0]\\nresult = get_weather(tool_call.input[\\"city\\"])\\n\\nmessages += [\\n    {\\"role\\": \\"assistant\\", \\"content\\": response.content},\\n    {\\"role\\": \\"user\\", \\"content\\": [{\\"type\\": \\"tool_result\\", \\"tool_use_id\\": tool_call.id, \\"content\\": json.dumps(result)}]}\\n]\\n\\nfinal = client.messages.create(model=\\"claude-opus-4-6\\", max_tokens=1024, tools=tools, messages=messages)\\nprint(final.content[0].text)", "frames": [ { "line": 6, "vars": {}, "note": "Tool schema defined — name, description, and JSON Schema for parameters", "stdout": "" }, { "line": 16, "vars": {"messages": "[user: 'What's the weather in Tokyo?']"}, "note": "First API call — LLM sees the user query and tool definitions", "stdout": "" }, { "line": 23, "vars": {"response.stop_reason": "\\"tool_use\\"", "tool_call.name": "\\"get_weather\\"", "tool_call.input": "{city: 'Tokyo'}"}, "note": "LLM returns stop_reason='tool_use' — it wants to call get_weather", "stdout": "" }, { "line": 24, "vars": {"result": "{temp: 22, condition: 'sunny'}"}, "note": "Your application executes the real function — LLM not involved here", "stdout": "" }, { "line": 27, "vars": {"messages.length": 3}, "note": "Tool result injected as a 'tool_result' message — now the LLM has the data", "stdout": "" }, { "line": 31, "vars": {"final.content[0].text": "\\"It's currently 22°C and sunny in Tokyo.\\""}, "note": "Second API call — LLM synthesizes the result into a natural response", "stdout": "It's currently 22°C and sunny in Tokyo." } ], "speed": 900 }
\`\`\`

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "What does the LLM actually generate when it 'calls a tool'?", "options": ["It executes the tool's code directly in its runtime", "A structured JSON object with the tool name and arguments", "A natural-language description of what it wants to do", "A function pointer that your app resolves at runtime"], "answer": 1, "explanation": "The LLM only generates a structured output — typically a JSON object containing the tool name and its arguments. Your application (the 'agent scaffolding') is responsible for executing the actual function and returning results." }, { "question": "Why do LLMs need tools for precise calculations?", "options": ["LLMs cannot process numbers in their input", "LLMs lack access to mathematical libraries", "LLMs can hallucinate or approximate when doing arithmetic in their 'head'", "The JSON Schema format doesn't support numeric types"], "answer": 2, "explanation": "LLMs generate text token-by-token and can produce plausible-looking but incorrect arithmetic. Offloading computation to a dedicated calculator tool guarantees precision — the LLM decides *what* to compute; the tool computes it exactly." }, { "question": "When should an agent use parallel tool calls instead of sequential ones?", "options": ["Always — parallel calls are always faster", "When the queries are independent and their results don't depend on each other", "When calling the same tool multiple times with the same arguments", "When the LLM has low confidence in its tool selection"], "answer": 1, "explanation": "Parallel tool calls work when queries are independent — comparing weather in two cities, fetching multiple stock prices at once. Sequential calls are necessary when step N+1 depends on the output of step N (e.g., search for a product, then fetch details for the top result)." }, { "question": "What is the most important thing to include in a tool description to help the LLM use it correctly?", "options": ["The implementation language (Python, JavaScript, etc.)", "The return type of the function", "Explicit guidance on *when* to invoke the tool vs. respond directly", "The maximum number of calls allowed per session"], "answer": 2, "explanation": "Without explicit 'when to use' guidance, the LLM has to guess. A sentence like 'Use this when the user asks about live stock prices' gives the LLM a clear policy, dramatically improving tool selection accuracy." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Tool use lets LLMs interact with the real world by generating structured JSON requests — they decide *what* to call; your application executes it.", "The four stages are: define tools → LLM decides → app executes → LLM synthesizes. The loop can repeat.", "Tool descriptions are as important as prompts — vague names and descriptions cause wrong tool selections.", "Modern LLMs support parallel tool calls for independent queries; use sequential calls when step N+1 depends on step N's result.", "RAG and tool use are complementary: RAG for static knowledge, tools for dynamic data and state-changing actions.", "Always add confirmation steps before executing irreversible actions (send email, write to DB, delete records)." ] }
\`\`\``,
    },
    {
      id: "tu-function-calling",
      slug: "function-calling-with-llms",
      title: "Function Calling with LLMs",
      content: `## Function Calling with LLMs

Function calling is what lets an LLM cross the "execution wall" — the boundary between reasoning about what should happen and actually making it happen. Without it, a model can only describe actions. With it, the model can request that your code perform them.

\`\`\`concept
{ "title": "The LLM as Orchestrator, Not Executor", "variant": "mental-model", "content": "Think of an LLM as a highly intelligent dispatcher. It reads a request, decides which function to call and with what arguments, then hands the job to your application. Your code executes the function, returns the result, and the LLM uses that result to compose the final answer. The LLM orchestrates — it never executes." }
\`\`\`

This separation is intentional. Your application is the security boundary: it decides which tools exist, validates arguments before execution, and controls what side effects are permitted. The model reasons about *which* tool to call; your code decides whether it's *allowed* to.

\`\`\`sysdiag
{ "title": "Function Calling Architecture", "width": 720, "height": 320, "nodes": [ { "id": "user", "label": "User", "x": 80, "y": 160, "kind": "client" }, { "id": "app", "label": "Your App", "x": 300, "y": 160, "kind": "service" }, { "id": "llm", "label": "LLM (Claude)", "x": 540, "y": 80, "kind": "service" }, { "id": "tool", "label": "External API", "x": 540, "y": 240, "kind": "database" } ], "edges": [ { "from": "user", "to": "app", "label": "question" }, { "from": "app", "to": "llm", "label": "messages + tools" }, { "from": "llm", "to": "app", "label": "tool_use block" }, { "from": "app", "to": "tool", "label": "execute" }, { "from": "tool", "to": "app", "label": "result" }, { "from": "app", "to": "llm", "label": "tool_result" }, { "from": "llm", "to": "app", "label": "final answer" } ], "annotations": { "llm": "Reasons about which tool to call and what arguments to pass. Generates structured JSON output — never executes functions directly.", "app": "The orchestration layer. Sends requests, runs tools, and routes results back to the LLM.", "tool": "Any external system: REST API, SQL database, calculator, search engine, or file system." } }
\`\`\`

### Defining Tools with the Anthropic API

Each tool is a JSON Schema declaration: a name, description, and the parameters it expects. The description is consumed by the model at inference time — write it as you would a docstring for a thoughtful colleague.

\`\`\`playground
{ "title": "Defining and Calling a Tool (Claude)", "language": "python", "code": "from anthropic import Anthropic\\n\\nclient = Anthropic()\\n\\n# Step 1: Define the tool schema\\ntools = [{\\n    \\"name\\": \\"get_stock_price\\",\\n    \\"description\\": \\"Get the current stock price for a ticker symbol\\",\\n    \\"input_schema\\": {\\n        \\"type\\": \\"object\\",\\n        \\"properties\\": {\\n            \\"ticker\\": {\\n                \\"type\\": \\"string\\",\\n                \\"description\\": \\"Stock ticker symbol (e.g., AAPL, GOOGL)\\"\\n            }\\n        },\\n        \\"required\\": [\\"ticker\\"]\\n    }\\n}]\\n\\n# Step 2: Send the request with tools attached\\nresponse = client.messages.create(\\n    model=\\"claude-sonnet-4-20250514\\",\\n    max_tokens=1024,\\n    tools=tools,\\n    messages=[{\\"role\\": \\"user\\", \\"content\\": \\"What's Apple's stock price?\\"}]\\n)\\n\\n# Step 3: Check if the LLM wants to call a tool\\nfor block in response.content:\\n    if block.type == \\"tool_use\\":\\n        print(f\\"Tool requested: {block.name}\\")\\n        print(f\\"Arguments: {block.input}\\")\\n        # Output:\\n        # Tool requested: get_stock_price\\n        # Arguments: {'ticker': 'AAPL'}", "runnable": false }
\`\`\`

When the model wants to call a tool, \`response.stop_reason\` equals \`"tool_use"\`. This is your signal to execute the function before continuing the conversation.

### The Complete Conversation Flow

Tool use is not a single API call — it's a multi-turn exchange. The conversation continues until the LLM has all the information it needs to form a final answer.

\`\`\`steps
{ "title": "The 4-Step Tool Use Exchange", "steps": [ { "title": "User asks a question", "content": "The conversation starts like any other. Your code sends the user message with the available tool definitions attached. The model now knows what it can request.\\n\\nKey: include \`tools=tools\` in every \`messages.create\` call throughout this conversation, not just the first one." }, { "title": "LLM returns a tool_use block", "content": "Instead of a text response, the model returns a structured block with \`type == \\"tool_use\\"\`. It contains:\\n\\n- \`block.name\` — which tool to call\\n- \`block.input\` — a validated JSON object with the arguments\\n- \`block.id\` — a unique ID you **must** reference in the next step\\n\\n\`response.stop_reason\` will be \`\\"tool_use\\"\` — use this as your loop condition." }, { "title": "Your app executes the tool and returns the result", "content": "Append the assistant's full response to the messages list, then add a \`tool_result\` turn:\\n\\n\`\`\`python\\nmessages.append({\\"role\\": \\"assistant\\", \\"content\\": response.content})\\nmessages.append({\\n    \\"role\\": \\"user\\",\\n    \\"content\\": [{\\n        \\"type\\": \\"tool_result\\",\\n        \\"tool_use_id\\": block.id,\\n        \\"content\\": '{\\"price\\": 198.50, \\"currency\\": \\"USD\\"}'\\n    }]\\n})\\n\`\`\`\\n\\nYou can also return an error object here — the model will adapt rather than crash." }, { "title": "LLM synthesizes the final answer", "content": "Send the updated messages back. The model now has the tool result in context and generates a natural-language response:\\n\\n> *\\"Apple (AAPL) is currently trading at $198.50 USD.\\"*\\n\\nIf it needs more data, it may request additional tool calls. Keep looping until \`stop_reason == \\"end_turn\\"\`." } ] }
\`\`\`

### Claude vs OpenAI: Schema Differences

Both providers implement tool calling with JSON Schema, but the envelope format differs. This matters when building provider-agnostic wrappers.

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Anthropic / Claude", "code": "tools = [{\\n    \\"name\\": \\"get_weather\\",\\n    \\"description\\": \\"Get current weather for a city\\",\\n    \\"input_schema\\": {          # top-level key\\n        \\"type\\": \\"object\\",\\n        \\"properties\\": {\\n            \\"city\\": {\\"type\\": \\"string\\"}\\n        },\\n        \\"required\\": [\\"city\\"]\\n    }\\n}]\\n\\n# Reading the response:\\nfor block in response.content:\\n    if block.type == \\"tool_use\\":\\n        name = block.name\\n        args = block.input     # already a dict" }, "after": { "label": "OpenAI / GPT-4o", "code": "tools = [{\\n    \\"type\\": \\"function\\",        # extra wrapper layer\\n    \\"function\\": {\\n        \\"name\\": \\"get_weather\\",\\n        \\"description\\": \\"Get current weather for a city\\",\\n        \\"parameters\\": {        # 'parameters', not 'input_schema'\\n            \\"type\\": \\"object\\",\\n            \\"properties\\": {\\n                \\"city\\": {\\"type\\": \\"string\\"}\\n            },\\n            \\"required\\": [\\"city\\"]\\n        }\\n    }\\n}]\\n\\n# Reading the response:\\ntool_calls = response.choices[0].message.tool_calls\\nfor tc in tool_calls:\\n    name = tc.function.name\\n    args = json.loads(tc.function.arguments)  # string, not dict" } }
\`\`\`

### Handling Multiple Tool Calls and Errors

The LLM can request several tools in a single turn — for example, fetching stock prices for three tickers simultaneously. Always iterate over all content blocks and collect results before making the next API call.

\`\`\`callout
{ "type": "tip", "title": "Return a Result for Every Tool Call", "content": "If the LLM requests three tools and you return only two results, the next API call fails with a validation error. Collect all \`tool_use\` blocks, execute them (in parallel if possible), and return a \`tool_result\` for every \`block.id\`." }
\`\`\`

Errors should flow back as \`tool_result\` content — not raised as Python exceptions. The model reads the error and decides what to do next:

\`\`\`python
tool_results = []
for block in response.content:
    if block.type == "tool_use":
        try:
            result = execute_tool(block.name, block.input)
            content = json.dumps(result)
        except Exception as e:
            # Return the error — let the LLM adapt
            content = json.dumps({"error": str(e), "tool": block.name})

        tool_results.append({
            "type": "tool_result",
            "tool_use_id": block.id,
            "content": content
        })
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Tool Definitions Consume Tokens", "content": "Every tool schema you attach is sent to the model with each request, eating into your available context window. For agents with many tools, dynamically select only the subset relevant to the current task rather than attaching everything up front." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "When a Claude response has stop_reason == 'tool_use', what should your application do next?", "options": [ "Display the model's partial response to the user immediately", "Execute the requested tool and send the result back in a new message", "Restart the conversation with a new system prompt", "Increase max_tokens and retry the identical request" ], "answer": 1, "explanation": "A stop_reason of 'tool_use' means the model is pausing for function execution. Your code must run the tool and return the result as a tool_result message before the model can generate its final answer." }, { "question": "What is the key structural difference between Claude and OpenAI tool definitions?", "options": [ "Claude supports more parameter types than OpenAI", "OpenAI wraps the schema in a 'function' object using 'parameters'; Claude uses 'input_schema' at the top level", "Only OpenAI supports the 'required' field in tool schemas", "Claude uses XML format while OpenAI uses JSON" ], "answer": 1, "explanation": "Claude's format uses 'input_schema' directly in the tool object. OpenAI wraps everything inside a 'function' sub-object and uses 'parameters' as the key. Both use JSON Schema internally, but the outer envelope differs — important for provider-agnostic code." }, { "question": "The LLM requests two tools in one turn. The first succeeds but the second raises an exception. What is the correct approach?", "options": [ "Raise the Python exception and let the caller handle it", "Skip the failed tool and only return the successful result", "Return both results, passing a JSON error object for the failed tool", "Cancel the conversation and ask the user to rephrase" ], "answer": 2, "explanation": "You must return a tool_result for every tool_use block — missing one causes an API validation error on the next call. For failed tools, return a JSON object describing the error. The model can read it and adapt: retrying, using a fallback, or explaining the failure to the user." }, { "question": "Why is it architecturally correct that the LLM does not execute function calls directly?", "options": [ "LLMs are too slow to run functions in real time", "Your application is the security boundary — it validates arguments, controls permissions, and decides what side effects are allowed", "Function execution requires internet access that LLMs lack", "It is technically possible but increases latency" ], "answer": 1, "explanation": "The separation between 'deciding what to call' and 'executing the call' is a deliberate security design. The LLM is an untrusted input source just like a user. Your application validates every tool call before running it, preventing the model from triggering unintended or malicious actions." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Function calling lets LLMs request structured tool execution — the LLM dispatches, your application controls and executes.", "A complete tool use exchange is multi-turn: user → model (tool_use) → app executes → model (final answer).", "Claude uses 'input_schema' at the tool's top level; OpenAI wraps the schema in a 'function' object with 'parameters'.", "Return a tool_result for every tool_use block — including failures. Pass errors as JSON so the model can adapt.", "Tool definitions consume tokens and shrink your effective context window. Attach only the tools relevant to the current task." ] }
\`\`\``,
    },
    {
      id: "tu-custom-tools",
      slug: "building-custom-tools",
      title: "Building Custom Tools",
      content: `## Building Custom Tools

Off-the-shelf tools (web search, calculators) cover common cases, but the real power of agents emerges when you build tools tailored to your domain. A custom tool lets an LLM reach into your database, call your internal API, or trigger your business logic — all through natural language.

\`\`\`concept
{ "title": "What Custom Tools Actually Are", "variant": "mental-model", "content": "LLMs don't execute code or call APIs directly. Instead, they generate structured JSON describing *which* function to call and *what arguments* to pass. Your application intercepts that JSON, runs the real function, and feeds the result back. The LLM is the decision-maker; your tool is the actuator." }
\`\`\`

---

### Anatomy of a Good Tool

Every custom tool has four required components. Miss any one and the LLM will either ignore the tool, misuse it, or produce malformed calls.

\`\`\`steps
{ "title": "The Four Components of a Custom Tool", "steps": [ { "title": "Clear Name", "content": "Use a **verb-noun** format that unambiguously declares intent.\\n\\n✅ \`search_products\`, \`create_invoice\`, \`get_order_status\`\\n\\n❌ \`data\`, \`process\`, \`handle_stuff\`\\n\\nThe LLM selects tools by name — ambiguity leads to wrong choices." }, { "title": "Precise Description", "content": "The description is **training signal for the LLM at inference time**. It must answer:\\n- What does this tool do?\\n- When *should* the LLM call it?\\n- What does it return?\\n\\nBad: \`\\"Queries the database.\\"\`\\n\\nGood: \`\\"Search the product database. Use when the user asks about products, prices, availability, or wants recommendations. Returns a list of matching products with name, price, category, and rating.\\"\`" }, { "title": "Typed Parameters (JSON Schema)", "content": "Each parameter needs a \`type\`, a \`description\`, and optionally \`enum\` constraints or a \`default\`.\\n\\nThe schema is how the LLM learns *what shape* its arguments must take. A loose schema produces loose, error-prone calls." }, { "title": "Robust Implementation", "content": "The function body must:\\n- **Validate input** before touching external systems\\n- **Handle errors** and return structured error objects (not Python exceptions)\\n- **Return JSON**, not prose — the LLM formats it for the user\\n- **Include metadata** (counts, pagination) in the response" } ] }
\`\`\`

---

### Full Example: A Database Query Tool

Here is a complete tool — implementation and schema together.

\`\`\`playground
{ "title": "Product Database Query Tool", "language": "python", "runnable": false, "code": "import sqlite3\\nimport json\\n\\ndef query_products(\\n    category: str = None,\\n    min_price: float = None,\\n    max_price: float = None,\\n    search_term: str = None,\\n    limit: int = 10\\n) -> str:\\n    \\"\\"\\"Search the product database with optional filters.\\n\\n    Returns matching products with name, price, category, and rating.\\n    Use this when the user asks about products, prices, or inventory.\\n    \\"\\"\\"\\n    conn = sqlite3.connect(\\"products.db\\")\\n    query = \\"SELECT name, price, category, rating FROM products WHERE 1=1\\"\\n    params = []\\n\\n    if category:\\n        query += \\" AND category = ?\\"\\n        params.append(category)\\n    if min_price is not None:\\n        query += \\" AND price >= ?\\"\\n        params.append(min_price)\\n    if max_price is not None:\\n        query += \\" AND price <= ?\\"\\n        params.append(max_price)\\n    if search_term:\\n        query += \\" AND name LIKE ?\\"\\n        params.append(f\\"%{search_term}%\\")\\n\\n    query += \\" ORDER BY rating DESC LIMIT ?\\"\\n    params.append(limit)\\n\\n    cursor = conn.execute(query, params)\\n    results = [\\n        dict(zip([\\"name\\", \\"price\\", \\"category\\", \\"rating\\"], row))\\n        for row in cursor.fetchall()\\n    ]\\n    conn.close()\\n    return json.dumps(results, indent=2)\\n\\n\\n# --- Tool definition sent to the LLM ---\\nproduct_tool = {\\n    \\"name\\": \\"query_products\\",\\n    \\"description\\": (\\n        \\"Search the product database. Use when the user asks about \\"\\n        \\"products, prices, availability, or wants recommendations. \\"\\n        \\"Returns a list of matching products with name, price, category, and rating.\\"\\n    ),\\n    \\"input_schema\\": {\\n        \\"type\\": \\"object\\",\\n        \\"properties\\": {\\n            \\"category\\": {\\n                \\"type\\": \\"string\\",\\n                \\"description\\": \\"Product category\\",\\n                \\"enum\\": [\\"electronics\\", \\"clothing\\", \\"books\\", \\"home\\", \\"sports\\"]\\n            },\\n            \\"min_price\\": {\\n                \\"type\\": \\"number\\",\\n                \\"description\\": \\"Minimum price filter\\"\\n            },\\n            \\"max_price\\": {\\n                \\"type\\": \\"number\\",\\n                \\"description\\": \\"Maximum price filter\\"\\n            },\\n            \\"search_term\\": {\\n                \\"type\\": \\"string\\",\\n                \\"description\\": \\"Search term to match against product names\\"\\n            },\\n            \\"limit\\": {\\n                \\"type\\": \\"integer\\",\\n                \\"description\\": \\"Maximum number of results (default 10)\\",\\n                \\"default\\": 10\\n            }\\n        }\\n    }\\n}" }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Enum Constraints Are Free Validation", "content": "Adding \`\\"enum\\": [\\"electronics\\", \\"clothing\\", ...]\` to a parameter does two things: it tells the LLM exactly which values are valid, and it rejects hallucinated values before they reach your database. Always use enums for bounded categorical inputs." }
\`\`\`

---

### Design Principles

\`\`\`tabs
{ "tabs": [ { "label": "Single Responsibility", "icon": "🎯", "content": "Each tool should do **one thing well**. When a tool tries to do too much, the LLM struggles to fill its parameters correctly — and you lose the ability to reason about what the agent is doing.\\n\\n**Bad:** \`manage_database(action, table, query, data, format, ...)\`\\n\\n**Good:** \`search_products(...)\`, \`create_order(...)\`, \`update_inventory(...)\`\\n\\nWhen in doubt, split." }, { "label": "Structured Output", "icon": "📦", "content": "Always return JSON, not prose. The LLM is an excellent formatter — let it decide how to present data to the user. Your job is to give it clean, structured data to work with.\\n\\n\`\`\`python\\n# Bad\\nreturn f\\"Found {len(results)} products in {category}.\\"\\n\\n# Good\\nreturn json.dumps({\\n    \\"results\\": results,\\n    \\"total_count\\": total,\\n    \\"page\\": page,\\n    \\"has_more\\": total > offset + limit\\n})\\n\`\`\`" }, { "label": "Input Validation", "icon": "🛡️", "content": "The LLM will occasionally send malformed, out-of-range, or missing parameters. Validate at the function boundary — never trust the caller.\\n\\n\`\`\`python\\ndef safe_query(search_term: str) -> str:\\n    if not search_term or len(search_term) > 200:\\n        return json.dumps({\\"error\\": \\"search_term must be 1-200 characters\\"})\\n    # safe to proceed\\n    ...\\n\`\`\`\\n\\nReturn a structured \`{\\"error\\": \\"...\\"}\` object rather than raising an exception — the LLM can read errors and self-correct." }, { "label": "Rate Limiting", "icon": "⏱️", "content": "Agents can enter feedback loops where they call the same tool dozens of times. Add a lightweight rate limiter to protect downstream systems.\\n\\n\`\`\`python\\nimport time\\n\\nMAX_CALLS_PER_MINUTE = 30\\ncall_timestamps = []\\n\\ndef rate_limited_tool(args):\\n    now = time.time()\\n    call_timestamps[:] = [t for t in call_timestamps if now - t < 60]\\n    if len(call_timestamps) >= MAX_CALLS_PER_MINUTE:\\n        return json.dumps({\\"error\\": \\"Rate limit exceeded. Retry in a moment.\\"})\\n    call_timestamps.append(now)\\n    return execute_tool(args)\\n\`\`\`" }, { "label": "Metadata in Responses", "icon": "📊", "content": "Include pagination and status metadata alongside results. This lets the LLM reason about completeness — it can tell the user \\"I found 47 results, showing the top 10\\" rather than silently truncating.\\n\\n\`\`\`python\\nreturn json.dumps({\\n    \\"results\\": products,\\n    \\"total_count\\": total,\\n    \\"page\\": page,\\n    \\"has_more\\": total > offset + limit\\n})\\n\`\`\`" } ] }
\`\`\`

---

### Good vs. Bad: Tool Design at a Glance

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Poorly Designed Tool", "code": "# One massive tool trying to do everything\\nmanage_database_tool = {\\n    \\"name\\": \\"manage_database\\",\\n    \\"description\\": \\"Manages database operations.\\",\\n    \\"input_schema\\": {\\n        \\"type\\": \\"object\\",\\n        \\"properties\\": {\\n            \\"action\\": {\\"type\\": \\"string\\"},\\n            \\"table\\": {\\"type\\": \\"string\\"},\\n            \\"query\\": {\\"type\\": \\"string\\"},\\n            \\"data\\": {\\"type\\": \\"object\\"}\\n        }\\n    }\\n}\\n# Problems:\\n# - Vague description gives LLM no guidance\\n# - 'action' has no enum — LLM can hallucinate values\\n# - Mixed read/write responsibilities\\n# - No input size limits" }, "after": { "label": "Well-Designed Tools", "code": "# Split into focused, self-describing tools\\nsearch_products_tool = {\\n    \\"name\\": \\"search_products\\",\\n    \\"description\\": (\\n        \\"Search the product catalog. Use when the user asks about \\"\\n        \\"products, prices, or availability. Returns structured product list.\\"\\n    ),\\n    \\"input_schema\\": {\\n        \\"type\\": \\"object\\",\\n        \\"properties\\": {\\n            \\"category\\": {\\n                \\"type\\": \\"string\\",\\n                \\"enum\\": [\\"electronics\\", \\"clothing\\", \\"books\\"]\\n            },\\n            \\"max_price\\": {\\"type\\": \\"number\\"},\\n            \\"limit\\": {\\"type\\": \\"integer\\", \\"default\\": 10}\\n        }\\n    }\\n}\\n# Benefits:\\n# - Name signals exact intent\\n# - Description tells LLM when to call it\\n# - enum on category prevents hallucination\\n# - Single read responsibility" } }
\`\`\`

---

### How Tool Calling Actually Flows

\`\`\`trace
{ "title": "Tool Call Lifecycle: query_products in Action", "language": "python", "code": "# User: 'Show me electronics under $100'\\n\\n# Step 1: LLM receives user message + tool definitions\\nmessage = client.messages.create(\\n    model=\\"claude-opus-4-6\\",\\n    tools=[product_tool],\\n    messages=[{\\"role\\": \\"user\\", \\"content\\": \\"Show me electronics under $100\\"}]\\n)\\n\\n# Step 2: LLM outputs a tool_use block\\ntool_call = message.content[0]  # type='tool_use'\\n# tool_call.input = {\\"category\\": \\"electronics\\", \\"max_price\\": 100}\\n\\n# Step 3: Application executes the real function\\nresult = query_products(**tool_call.input)\\n\\n# Step 4: Feed result back to LLM\\nfinal = client.messages.create(\\n    model=\\"claude-opus-4-6\\",\\n    tools=[product_tool],\\n    messages=[\\n        {\\"role\\": \\"user\\",    \\"content\\": \\"Show me electronics under $100\\"},\\n        {\\"role\\": \\"assistant\\", \\"content\\": message.content},\\n        {\\"role\\": \\"user\\",    \\"content\\": [{\\"type\\": \\"tool_result\\", \\"tool_use_id\\": tool_call.id, \\"content\\": result}]}\\n    ]\\n)", "frames": [ { "line": 3, "vars": { "user_input": "Show me electronics under $100", "tools_provided": 1 }, "note": "LLM receives message + tool schema", "stdout": "" }, { "line": 10, "vars": { "stop_reason": "tool_use", "tool_name": "query_products" }, "note": "LLM decides to call the tool — stop_reason is 'tool_use'", "stdout": "" }, { "line": 14, "vars": { "category": "electronics", "max_price": 100 }, "note": "LLM generated these args from the natural language input", "stdout": "" }, { "line": 17, "vars": { "result_items": 8 }, "note": "Your Python code runs the real SQL query", "stdout": "[{\\"name\\": \\"Wireless Earbuds\\", \\"price\\": 49.99, ...}]" }, { "line": 20, "vars": { "final_stop_reason": "end_turn" }, "note": "LLM formats the JSON results into a natural language response", "stdout": "Here are 8 electronics under $100, sorted by rating..." } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Tool Calling Adds Latency", "content": "Every tool invocation introduces a round-trip: LLM → your code → LLM. This adds latency compared to a plain completion. For latency-sensitive applications, minimize the number of sequential tool calls and consider running independent tools in parallel where your framework supports it." }
\`\`\`

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "An LLM is configured with a \`manage_database\` tool that accepts an \`action\` parameter with no enum. The LLM calls the tool with \`action: \\"delete_all\\"\`. What design principle was violated?", "options": ["Single Responsibility — the tool does too much", "Structured Output — result should be JSON", "Input Validation — no bounds on the action value", "Both A and C"], "answer": 3, "explanation": "The tool violates Single Responsibility (read and write operations should be separate tools) AND lacks enum constraints on \`action\`, which allows the LLM to hallucinate dangerous values like 'delete_all'. Both failures contributed to the unsafe call." }, { "question": "A tool returns the string: \`\\"Found 3 products matching your search.\\"\` What is the primary problem with this output?", "options": ["It's too short", "It's prose, not structured JSON — the LLM can't reason over it", "It should use XML instead", "It needs a status code prefix"], "answer": 1, "explanation": "Tools should return structured JSON so the LLM can reason over the data, combine it with other results, and format it appropriately for the user. Prose output locks the LLM into a fixed presentation it can't work with programmatically." }, { "question": "When should a tool return \`{\\"error\\": \\"Invalid input\\"}\` as JSON rather than raising a Python exception?", "options": ["Never — exceptions are more Pythonic", "Always — so the LLM can read the error and self-correct on the next turn", "Only for network errors, not input errors", "Only if the LLM is Claude-class; GPT-class models handle exceptions directly"], "answer": 1, "explanation": "The LLM reads the tool result text. If your function raises an exception, the agent framework typically catches it and returns an error string — but if you return a structured {\\"error\\": \\"...\\"} JSON object, the LLM can parse the reason, adjust its parameters, and retry intelligently." }, { "question": "You have a \`create_order\` and a \`cancel_order\` tool. A colleague suggests merging them into \`manage_order(action, ...)\` to reduce tool count. What is the strongest argument against this?", "options": ["It doubles the token count in the system prompt", "Fewer tools always means worse LLM reasoning", "A vague action parameter lets the LLM hallucinate dangerous actions; separate tools make intent and constraints explicit", "LLMs cannot handle tools with more than 3 parameters"], "answer": 2, "explanation": "Separate, narrowly scoped tools make it impossible for the LLM to accidentally invoke dangerous actions. A \`cancel_order\` tool can only cancel; it cannot create, modify, or delete in unintended ways. The clarity of naming also improves tool selection accuracy." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "LLMs generate structured JSON describing a function call — your application executes it and feeds the result back. The LLM decides; your tool acts.", "A good custom tool requires four things: a verb-noun name, a precise description that teaches the LLM when to call it, a typed JSON Schema, and a robust implementation.", "Single Responsibility is the highest-leverage design principle: narrow, focused tools are easier to select correctly, safer to invoke, and simpler to validate.", "Always return structured JSON — never prose. Include metadata like total_count and has_more so the LLM can reason about completeness.", "Validate input at the function boundary and return {\\"error\\": \\"...\\"} objects so the LLM can self-correct rather than crashing the agent." ] }
\`\`\``,
    },
    {
      id: "tu-web-search",
      slug: "web-search-api-integration",
      title: "Web Search & API Integration",
      content: `## Web Search & API Integration

Agents trained on static data go stale the moment the world changes. Web search and API tools solve this by giving the agent a live connection to the internet and your internal systems — transforming a clever text predictor into an active participant in real workflows.

\`\`\`concept
{ "title": "The Tool Execution Model", "variant": "mental-model", "content": "The LLM never executes API calls itself. When the model decides it needs information, it outputs a structured JSON object naming the tool and its arguments. Your application code intercepts that output, runs the actual HTTP request, and returns the result as a new context message. The LLM then reasons over that result to form its final answer. The split is deliberate: the model handles reasoning; your infrastructure handles execution." }
\`\`\`

### Why Real-Time Data Matters

LLMs have a training cutoff. Without tool access, an agent asked "what is the current price of ETH?" will either hallucinate a number confidently or refuse to answer. With a search tool, it can fetch the live answer and cite the source. This also reduces hallucinations — the model is grounding its answer in retrieved evidence rather than pattern-matching from stale weights.

The trade-off is latency. Every API call adds a round-trip. For production agents running multiple retrieval calls per query, optimizing search latency is as important as prompt design.

### Web Search APIs: Tavily vs. Brave

\`\`\`tabs
{ "tabs": [
  {
    "label": "Tavily",
    "icon": "🔍",
    "content": "**Best for:** AI-native search with summarised answers\\n\\nTavily is purpose-built for LLM applications. Its \`include_answer\` flag returns a pre-synthesised answer alongside raw results, saving a reasoning step. It also supports \`search_depth: \\"advanced\\"\` for deeper crawling.\\n\\n\`\`\`python\\nimport requests, json\\n\\ndef tavily_search(query: str, max_results: int = 5) -> str:\\n    response = requests.post(\\n        \\"https://api.tavily.com/search\\",\\n        json={\\n            \\"query\\": query,\\n            \\"search_depth\\": \\"advanced\\",\\n            \\"max_results\\": max_results,\\n            \\"include_answer\\": True\\n        },\\n        headers={\\"Authorization\\": \\"Bearer YOUR_TAVILY_KEY\\"}\\n    )\\n    data = response.json()\\n    results = [{\\n        \\"title\\": r[\\"title\\"],\\n        \\"url\\": r[\\"url\\"],\\n        \\"content\\": r[\\"content\\"][:300]\\n    } for r in data.get(\\"results\\", [])]\\n    return json.dumps({\\n        \\"answer\\": data.get(\\"answer\\", \\"\\"),\\n        \\"results\\": results\\n    }, indent=2)\\n\`\`\`"
  },
  {
    "label": "Brave Search",
    "icon": "🦁",
    "content": "**Best for:** Broad web coverage, model-agnostic pipelines\\n\\nBrave Search's API is model-agnostic — it works identically whether your agent runs on Claude, GPT-4, or a local model. No vendor lock-in. Useful when you need wide crawl coverage or want to switch LLMs without changing your search layer.\\n\\n\`\`\`python\\ndef brave_search(query: str, count: int = 5) -> str:\\n    response = requests.get(\\n        \\"https://api.search.brave.com/res/v1/web/search\\",\\n        params={\\"q\\": query, \\"count\\": count},\\n        headers={\\"X-Subscription-Token\\": \\"YOUR_BRAVE_KEY\\"}\\n    )\\n    data = response.json()\\n    results = [{\\n        \\"title\\": r[\\"title\\"],\\n        \\"url\\": r[\\"url\\"],\\n        \\"description\\": r.get(\\"description\\", \\"\\")[:300]\\n    } for r in data.get(\\"web\\", {}).get(\\"results\\", [])]\\n    return json.dumps(results, indent=2)\\n\`\`\`"
  },
  {
    "label": "Choosing an API",
    "icon": "⚖️",
    "content": "| Criterion | Tavily | Brave |\\n|---|---|---|\\n| AI-synthesised answer | ✅ \`include_answer\` flag | ❌ snippets only |\\n| Model agnostic | ✅ | ✅ |\\n| Full page content | Via Firecrawl add-on | ❌ |\\n| Pricing model | Per-query | Per-query |\\n| Best use case | Agentic reasoning pipelines | Broad search, open-source stacks |\\n\\n**Rule of thumb:** use Tavily when you want the API to do some synthesis for you; use Brave (or SerpAPI, Exa) when you need raw breadth or want full control over result processing."
  }
] }
\`\`\`

### Wrapping Any REST API as a Tool

Web search is just one category. Any REST API — GitHub, Notion, Slack, Stripe — can become an agent tool using the same pattern: call, handle errors, return structured JSON.

\`\`\`playground
{ "title": "Reusable REST API Tool Factory", "language": "python", "code": "import requests\\nimport json\\n\\ndef create_api_tool(base_url: str, headers: dict):\\n    \\"\\"\\"Factory: wraps a REST API as a pair of agent tools.\\"\\"\\"\\n\\n    def api_get(endpoint: str, params: dict = None) -> str:\\n        \\"\\"\\"GET request — use for reads.\\"\\"\\"\\n        try:\\n            response = requests.get(\\n                f\\"{base_url}{endpoint}\\",\\n                params=params,\\n                headers=headers,\\n                timeout=10\\n            )\\n            response.raise_for_status()\\n            return json.dumps(response.json(), indent=2)\\n        except requests.RequestException as e:\\n            return json.dumps({\\"error\\": str(e)})\\n\\n    def api_post(endpoint: str, data: dict) -> str:\\n        \\"\\"\\"POST request — use for writes/mutations.\\"\\"\\"\\n        try:\\n            response = requests.post(\\n                f\\"{base_url}{endpoint}\\",\\n                json=data,\\n                headers=headers,\\n                timeout=10\\n            )\\n            response.raise_for_status()\\n            return json.dumps(response.json(), indent=2)\\n        except requests.RequestException as e:\\n            return json.dumps({\\"error\\": str(e)})\\n\\n    return api_get, api_post\\n\\n# Example: GitHub API\\ngithub_get, github_post = create_api_tool(\\n    base_url=\\"https://api.github.com\\",\\n    headers={\\"Authorization\\": \\"Bearer YOUR_GITHUB_TOKEN\\", \\"Accept\\": \\"application/vnd.github+json\\"}\\n)\\n\\n# Now pass these as tools to your agent\\nresult = github_get(\\"/repos/openai/openai-python/issues\\", {\\"state\\": \\"open\\", \\"per_page\\": 5})\\nprint(result)", "runnable": true }
\`\`\`

### The Search-Verify Pattern

A single search result can be wrong, outdated, or hallucinated by the search API itself. Production agents often chain two steps: search broadly, then verify against primary sources.

\`\`\`steps
{ "title": "Search-Then-Verify Workflow", "steps": [
  {
    "title": "Step 1 — Broad search",
    "content": "Issue a high-level query to the search API (\`tavily_search\` or \`brave_search\`). Request 3–5 results. The goal here is **candidate gathering**, not final answers — you want source URLs more than you want the snippets."
  },
  {
    "title": "Step 2 — Fetch primary sources",
    "content": "For each candidate URL, attempt a direct HTTP GET. A \`200 OK\` means the page is reachable and the result isn't dead. Optionally, use a scraping layer (e.g. Firecrawl) to extract clean Markdown from the page body for richer context."
  },
  {
    "title": "Step 3 — Mark and filter",
    "content": "Tag each result with \`\\"verified\\": true/false\`. Drop or deprioritise unreachable URLs. Pass only the verified subset to the LLM as grounding context.\\n\\n\`\`\`python\\ndef research_topic(query: str) -> str:\\n    results = json.loads(tavily_search(query, max_results=3))[\\"results\\"]\\n    verified = []\\n    for r in results:\\n        try:\\n            page = requests.get(r[\\"url\\"], timeout=5)\\n            r[\\"verified\\"] = page.status_code == 200\\n        except Exception:\\n            r[\\"verified\\"] = False\\n        verified.append(r)\\n    return json.dumps({\\"verified_results\\": verified}, indent=2)\\n\`\`\`"
  },
  {
    "title": "Step 4 — Ground the LLM",
    "content": "Inject the verified results into the LLM's context as a tool response. Instruct the model to cite sources inline (\`[1]\`, \`[2]\`). This keeps the answer traceable and dramatically reduces the chance of fabrication."
  }
] }
\`\`\`

### Security: The Non-Negotiable Layer

\`\`\`callout
{ "type": "danger", "title": "API Access = Real-World Action", "content": "An agent with a Stripe token can issue refunds. An agent with a GitHub token can delete branches. An agent with a Slack token can message your entire company. Unlike a chatbot that only produces text, tool-equipped agents have **blast radius**. Every access decision must be made deliberately." }
\`\`\`

When granting agents API access, enforce these rules:

| Control | Why it matters |
|---|---|
| **Read-only tokens where possible** | Bounds the worst-case action to information disclosure |
| **Minimum scope permissions** | An agent that only needs to search GitHub Issues should not have \`repo:write\` |
| **Structured audit log every call** | Essential for debugging runaway loops and compliance |
| **Approval flows for destructive actions** | Delete, update, send — route through human confirmation or a separate authorisation agent |
| **Per-agent rate limits** | Prevents runaway loops from draining your API budget in minutes |

\`\`\`collapse
{ "title": "Deep Dive: Integration Complexity in Production", "content": "Building a single tool for demo purposes is straightforward. Productionising it is not. Multi-tenant deployments must manage **OAuth token lifecycles per user** — tokens expire, rotate, and can be revoked at any time. APIs use **inconsistent pagination** (cursor-based, offset-based, link-header-based). Error codes are not standardised across providers.\\n\\nA common architectural pattern is to introduce a **proxy layer** between your agent runtime and external APIs. This proxy handles:\\n- Token refresh and per-user credential storage\\n- Pagination normalisation (returns a flat list regardless of upstream format)\\n- Unified error mapping (maps provider-specific codes to a consistent schema your agent can reason about)\\n- Rate-limit backoff and retry logic\\n\\nThis separation keeps the LLM's reasoning layer clean — the agent calls \`github_search_issues(query)\` and gets back a normalised JSON list. It never has to handle a \`401 Unauthorized\` mid-reasoning loop." }
\`\`\`

### Common Integrations Reference

| API | Tool name examples | Notes |
|---|---|---|
| **GitHub** | \`search_repos\`, \`create_issue\`, \`list_prs\` | Scope: \`repo:read\` for most agent tasks |
| **Notion** | \`search_pages\`, \`create_page\`, \`append_block\` | Requires Notion integration bot |
| **Slack** | \`send_message\`, \`search_messages\` | Use Bot tokens, not User tokens |
| **Stripe** | \`get_invoice\`, \`create_refund\` | Restricted key — never full access |
| **Jira** | \`create_ticket\`, \`update_status\` | API token + Basic Auth |

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [
  {
    "question": "An LLM with a web search tool is asked for today's ETH price. What actually happens when the LLM 'decides to search'?",
    "options": [
      "The LLM directly makes an HTTP request to the search API",
      "The LLM outputs a structured JSON object; your application code makes the actual API call",
      "The LLM checks its training data and returns the most recent price it was trained on",
      "The search query is sent to the LLM provider, which executes it on the LLM's behalf"
    ],
    "answer": 1,
    "explanation": "The LLM never executes API calls. It outputs a tool-call JSON (e.g. {\\"name\\": \\"tavily_search\\", \\"args\\": {\\"query\\": \\"ETH price\\"}}). Your runtime intercepts this, calls the API, and returns the result as a new context message. This design is why tool use works with any LLM that supports structured output."
  },
  {
    "question": "You are building a billing support agent that needs to look up invoices. Which token scope is most appropriate?",
    "options": [
      "Full Stripe API key — the agent needs flexibility to handle any billing issue",
      "A restricted key scoped to invoice reads only",
      "No token needed — the agent can infer invoice data from the user's description",
      "Admin token stored in the LLM's system prompt"
    ],
    "answer": 1,
    "explanation": "The principle of minimum scope: grant only the permissions actually needed. A billing lookup agent needs read access to invoices — not the ability to create refunds, delete customers, or change subscription plans. Restricted keys limit blast radius if the agent misbehaves or the token is compromised."
  },
  {
    "question": "Tavily's \`include_answer\` flag is useful because it:",
    "options": [
      "Guarantees the answer is factually correct by cross-referencing multiple sources",
      "Returns a pre-synthesised answer alongside raw results, saving a reasoning step",
      "Bypasses the need for an LLM altogether for simple queries",
      "Enables the agent to answer without making additional HTTP requests"
    ],
    "answer": 1,
    "explanation": "Tavily's \`include_answer\` flag returns a synthesised summary answer in addition to the raw result snippets. This can reduce the LLM's reasoning load — instead of processing five raw snippets, it can use the pre-synthesised answer as a starting point. It does not guarantee factual correctness; the LLM should still treat it as one input, not ground truth."
  },
  {
    "question": "What is the primary advantage of model-agnostic search APIs (like Brave) over platform-built search tools (like Anthropic's or OpenAI's)?",
    "options": [
      "They are always faster and cheaper",
      "They return more search results per query",
      "They work with any LLM, including open-source and local models, without vendor lock-in",
      "They provide structured data rather than unstructured web content"
    ],
    "answer": 2,
    "explanation": "Platform-built search tools (e.g. Anthropic's web search, OpenAI's Bing plugin) are tightly coupled to a specific provider's ecosystem. Model-agnostic APIs like Brave, Exa, or SerpAPI can be used with Claude, GPT-4, Llama, or any local model — giving you the freedom to switch LLMs, run multi-model pipelines, or use open-source infrastructure without changing your search layer."
  }
] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "The LLM never makes API calls directly — it outputs a tool-call JSON that your application code executes, then feeds the result back as context.",
  "Tavily is optimised for AI-native pipelines (pre-synthesised answers, deep search); Brave and other model-agnostic APIs avoid vendor lock-in and work with any LLM.",
  "Any REST API becomes an agent tool with the same pattern: issue request → handle errors → return structured JSON.",
  "The search-verify chain (search broadly, then GET primary sources) guards against stale or incorrect search results before grounding the LLM.",
  "Security is non-negotiable: use minimum-scope tokens, log every call, and route destructive actions through human approval flows — agents have real-world blast radius."
] }
\`\`\``,
    },
    {
      id: "tu-filesystem",
      slug: "filesystem-database-tools",
      title: "File System & Database Tools",
      content: `## File System & Database Tools

File system and database tools are what transform an LLM from a text predictor into an agent capable of real work — reading codebases, analyzing data, and persisting results. The LLM doesn't execute these operations directly; it generates a structured JSON request describing *which* tool to call and with *what* parameters. Your application executes the call and feeds the result back.

\`\`\`concept
{ "title": "The LLM Never Touches Your Files", "variant": "mental-model", "content": "An LLM cannot open a file or run a SQL query. What it *can* do is emit a structured function call: { \\"name\\": \\"read_file\\", \\"args\\": { \\"path\\": \\"/workspace/main.py\\" } }. Your executor picks that up, runs the real I/O, and returns the result. The LLM reasons about the result — it never touches the disk." }
\`\`\`

---

### File System Tools

A well-designed file toolkit gives the agent four primitives: **read**, **write**, **list**, and **search**. Keep tools granular — one tool per action makes it easier to write clear descriptions for the LLM *and* apply targeted security policies per operation.

\`\`\`tabs
{ "tabs": [
  {
    "label": "read_file",
    "icon": "📖",
    "content": "\`\`\`python\\nimport os, json\\n\\ndef read_file(file_path: str) -> str:\\n    \\"\\"\\"Read the contents of a file. Returns content as text.\\"\\"\\"\\n    try:\\n        with open(file_path, \\"r\\", encoding=\\"utf-8\\") as f:\\n            content = f.read()\\n        return json.dumps({\\n            \\"path\\": file_path,\\n            \\"content\\": content,\\n            \\"size_bytes\\": os.path.getsize(file_path)\\n        })\\n    except FileNotFoundError:\\n        return json.dumps({\\"error\\": f\\"File not found: {file_path}\\"})\\n    except Exception as e:\\n        return json.dumps({\\"error\\": str(e)})\\n\`\`\`\\nAlways return JSON — including on error. The LLM must be able to parse every response, including failures."
  },
  {
    "label": "write_file",
    "icon": "✏️",
    "content": "\`\`\`python\\ndef write_file(file_path: str, content: str) -> str:\\n    \\"\\"\\"Write content to a file. Creates directories as needed.\\"\\"\\"\\n    try:\\n        os.makedirs(os.path.dirname(file_path) or \\".\\", exist_ok=True)\\n        with open(file_path, \\"w\\", encoding=\\"utf-8\\") as f:\\n            f.write(content)\\n        return json.dumps({\\"status\\": \\"success\\", \\"path\\": file_path})\\n    except Exception as e:\\n        return json.dumps({\\"error\\": str(e)})\\n\`\`\`\\n\`os.makedirs(..., exist_ok=True)\` is idempotent — safe for the agent to call repeatedly without raising errors when the directory already exists."
  },
  {
    "label": "list_directory",
    "icon": "📁",
    "content": "\`\`\`python\\nimport glob\\n\\ndef list_directory(dir_path: str, pattern: str = \\"*\\") -> str:\\n    \\"\\"\\"List files in a directory with optional glob filtering.\\"\\"\\"\\n    try:\\n        files = glob.glob(os.path.join(dir_path, pattern))\\n        entries = []\\n        for f in sorted(files):\\n            stat = os.stat(f)\\n            entries.append({\\n                \\"name\\": os.path.basename(f),\\n                \\"path\\": f,\\n                \\"is_dir\\": os.path.isdir(f),\\n                \\"size\\": stat.st_size\\n            })\\n        return json.dumps(entries, indent=2)\\n    except Exception as e:\\n        return json.dumps({\\"error\\": str(e)})\\n\`\`\`"
  },
  {
    "label": "search_files",
    "icon": "🔍",
    "content": "\`\`\`python\\nimport re\\n\\ndef search_files(directory: str, pattern: str) -> str:\\n    \\"\\"\\"Search for files containing a text pattern (like grep).\\"\\"\\"\\n    matches = []\\n    for root, dirs, files in os.walk(directory):\\n        for fname in files:\\n            fpath = os.path.join(root, fname)\\n            try:\\n                with open(fpath, \\"r\\", encoding=\\"utf-8\\") as f:\\n                    for i, line in enumerate(f, 1):\\n                        if re.search(pattern, line):\\n                            matches.append({\\n                                \\"file\\": fpath,\\n                                \\"line\\": i,\\n                                \\"content\\": line.strip()\\n                            })\\n            except (UnicodeDecodeError, PermissionError):\\n                continue\\n    return json.dumps(matches[:50], indent=2)  # Cap at 50 results\\n\`\`\`\\nCapping results at 50 prevents the agent from flooding its context window. Return the *most relevant* slice, not everything."
  }
] }
\`\`\`

---

### Database Tools

LLMs excel at translating natural language into SQL. Given a schema, an agent can answer questions like *"list all customers who upgraded to Pro in the last 60 days"* by emitting the right \`SELECT\` — no hardcoded queries required.

\`\`\`playground
{ "title": "SQL Tool: query_database + describe_tables", "language": "python", "runnable": false, "code": "import sqlite3, json\\n\\ndef describe_tables(database: str = \\"app.db\\") -> str:\\n    \\"\\"\\"List all tables and their column schemas.\\"\\"\\"\\n    conn = sqlite3.connect(database)\\n    tables = conn.execute(\\n        \\"SELECT name FROM sqlite_master WHERE type='table'\\"\\n    ).fetchall()\\n\\n    schema = {}\\n    for (table_name,) in tables:\\n        columns = conn.execute(f\\"PRAGMA table_info({table_name})\\").fetchall()\\n        schema[table_name] = [\\n            {\\"name\\": col[1], \\"type\\": col[2], \\"nullable\\": not col[3]}\\n            for col in columns\\n        ]\\n    conn.close()\\n    return json.dumps(schema, indent=2)\\n\\n\\ndef query_database(sql: str, database: str = \\"app.db\\") -> str:\\n    \\"\\"\\"Execute a read-only SQL query and return results as JSON.\\"\\"\\"\\n    if not sql.strip().upper().startswith(\\"SELECT\\"):\\n        return json.dumps({\\"error\\": \\"Only SELECT queries are allowed\\"})\\n\\n    try:\\n        conn = sqlite3.connect(database)\\n        conn.row_factory = sqlite3.Row\\n        cursor = conn.execute(sql)\\n        rows = [dict(row) for row in cursor.fetchall()]\\n        conn.close()\\n        return json.dumps({\\"rows\\": rows, \\"count\\": len(rows)}, indent=2, default=str)\\n    except Exception as e:\\n        return json.dumps({\\"error\\": str(e)})" }
\`\`\`

The typical two-step agent flow for database tasks:

\`\`\`steps
{ "title": "Agent Database Workflow", "steps": [
  { "title": "Discover the schema", "content": "The agent calls \`describe_tables()\` first. It receives a JSON map of every table and column — this becomes the context for generating correct SQL.\\n\\n\`\`\`json\\n{\\n  \\"customers\\": [\\n    { \\"name\\": \\"id\\", \\"type\\": \\"INTEGER\\", \\"nullable\\": false },\\n    { \\"name\\": \\"plan\\", \\"type\\": \\"TEXT\\", \\"nullable\\": true },\\n    { \\"name\\": \\"upgraded_at\\", \\"type\\": \\"DATETIME\\", \\"nullable\\": true }\\n  ]\\n}\\n\`\`\`" },
  { "title": "Generate the query", "content": "Given the schema and the natural language goal, the LLM emits a \`query_database\` call:\\n\\n\`\`\`sql\\nSELECT id, email, plan, upgraded_at\\nFROM customers\\nWHERE plan = 'pro'\\n  AND upgraded_at >= datetime('now', '-60 days')\\nORDER BY upgraded_at DESC;\\n\`\`\`\\nThe LLM never guesses column names — it reads them from step 1." },
  { "title": "Return and reason", "content": "Your executor runs the query and returns JSON rows to the LLM. The LLM summarizes, filters further, or chains another tool call — for example writing the results to a CSV file using \`write_file\`." }
] }
\`\`\`

---

### Safety Patterns — The Sandbox Principle

File and database tools carry real risk. An unsandboxed agent could read \`/etc/passwd\`, overwrite system configs, or exfiltrate data. The fix is a **sandbox**: a whitelist of directories the agent is permitted to access, checked *before* any I/O.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Unsafe — No path validation", "code": "def read_file(file_path: str) -> str:\\n    with open(file_path, \\"r\\") as f:\\n        return f.read()\\n# Agent asks: read_file(\\"/etc/shadow\\")\\n# Result: password hashes returned to LLM" }, "after": { "label": "Safe — Sandbox enforced", "code": "ALLOWED_DIRS = [\\"/workspace\\", \\"/tmp/agent\\"]\\n\\ndef safe_read_file(file_path: str) -> str:\\n    abs_path = os.path.abspath(file_path)\\n    if not any(abs_path.startswith(d) for d in ALLOWED_DIRS):\\n        return json.dumps({\\"error\\": \\"Access denied: path outside sandbox\\"})\\n    return read_file(abs_path)\\n\\n# Agent asks: safe_read_file(\\"/etc/shadow\\")\\n# Result: {\\"error\\": \\"Access denied: path outside sandbox\\"}\\n\\n# Also: connect databases read-only via URI\\nconn = sqlite3.connect(\\"file:app.db?mode=ro\\", uri=True)" } }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Always Resolve to Absolute Paths First", "content": "An LLM might pass \`../../etc/passwd\` as a path. \`os.path.abspath()\` resolves all \`..\` traversals before the sandbox check runs — without this step, a relative path can escape any prefix check." }
\`\`\`

---

### Approval Workflows for Write Operations

Read operations are generally safe to automate. Write operations — especially \`write_file\` or any destructive SQL — should surface a **pending approval** response that your UI can display to the user before execution.

\`\`\`playground
{ "title": "Human-in-the-Loop Write", "language": "python", "runnable": false, "code": "def write_file_with_approval(path: str, content: str) -> str:\\n    \\"\\"\\"Stage a file write for human approval before executing.\\"\\"\\"\\n    return json.dumps({\\n        \\"status\\": \\"pending_approval\\",\\n        \\"action\\": \\"write_file\\",\\n        \\"path\\": path,\\n        \\"preview\\": content[:500] + (\\"...\\" if len(content) > 500 else \\"\\"),\\n        \\"message\\": \\"Review this file write and approve to proceed.\\"\\n    })\\n\\n# Your orchestrator checks status:\\n# if result[\\"status\\"] == \\"pending_approval\\":\\n#     show_diff_to_user(result)\\n#     if user_approves():\\n#         execute_write(result[\\"path\\"], full_content)" }
\`\`\`

The key insight: the tool doesn't do the work — it *describes* the work. The orchestrator decides whether to execute, and the human decides whether to approve.

\`\`\`callout
{ "type": "tip", "title": "Tiered Trust: Read vs. Write vs. Destructive", "content": "A practical three-tier model:\\n\\n- **Read** → Auto-execute within sandbox\\n- **Write/Create** → Show preview, require approval\\n- **Delete/Overwrite** → Require explicit confirmation with diff" }
\`\`\`

---

### Knowledge Check

\`\`\`quiz
{ "title": "File System & Database Tools", "questions": [
  {
    "question": "An LLM agent calls \`read_file(\\"../../etc/passwd\\")\`. Your sandbox checks \`if path.startswith(\\"/workspace\\")\`. Does this check catch the attack?",
    "options": [
      "Yes — the string doesn't start with /workspace so it's blocked",
      "No — you must call os.path.abspath() first to resolve traversal sequences",
      "Yes — startswith() handles all relative path attacks",
      "No — LLMs cannot generate paths with .. sequences"
    ],
    "answer": 1,
    "explanation": "The raw string \`../../etc/passwd\` does not start with \`/workspace\`, so the startswith check would catch *this specific input* — but only by accident. A crafted path like \`/workspace/../../etc/passwd\` bypasses it. Always call \`os.path.abspath()\` first to resolve all traversal before the sandbox check."
  },
  {
    "question": "Why does the \`query_database\` tool begin with a check that the SQL starts with SELECT?",
    "options": [
      "For performance — SELECT queries are faster than others",
      "To prevent the LLM from accidentally issuing INSERT, UPDATE, or DROP commands",
      "Because SQLite only supports SELECT",
      "To make the tool description shorter for the LLM"
    ],
    "answer": 1,
    "explanation": "A data analysis agent only needs to read data, never modify it. Blocking non-SELECT statements at the tool layer enforces read-only access regardless of what the LLM generates. This is defense-in-depth on top of the read-only database connection."
  },
  {
    "question": "Why should file and database tools return JSON even when an error occurs?",
    "options": [
      "JSON is required by the OpenAI function calling spec",
      "So the LLM can parse the error and decide how to recover or report it",
      "To avoid raising Python exceptions in the executor",
      "So logs are structured for human operators"
    ],
    "answer": 1,
    "explanation": "The LLM can only reason about what it receives as a string. If an error causes an unformatted exception message or an empty string, the LLM loses context. A structured JSON error like \`{\\"error\\": \\"File not found: main.py\\"}\` lets the agent report the issue accurately, retry with a corrected path, or escalate to the user."
  },
  {
    "question": "What is the purpose of \`describe_tables\` in the database toolkit?",
    "options": [
      "To cache the database schema for faster subsequent queries",
      "To provide the LLM with column names and types so it can generate valid SQL",
      "To verify the database is accessible before running queries",
      "To list which tables the agent has permission to read"
    ],
    "answer": 1,
    "explanation": "LLMs don't know your schema in advance. Calling \`describe_tables\` first gives the model the column names, types, and nullability it needs to write a correct SQL query — avoiding guesses like \`SELECT * FROM users\` when the table is actually named \`customers\`."
  }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "LLMs never execute I/O — they emit structured function calls; your executor runs the real operation and returns results",
  "Design fine-grained tools (read, write, list, search) rather than one mega-tool — clearer LLM descriptions and targeted security per operation",
  "Always resolve paths to absolute before sandbox checks — raw startswith() is bypassed by traversal sequences like ../../etc",
  "Read operations can be auto-approved; write and destructive operations should surface a pending_approval response for human review",
  "Supply schema context via describe_tables before SQL generation — the LLM cannot produce valid queries for a schema it has never seen"
] }
\`\`\``,
    },
  ],
};
