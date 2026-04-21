import { Module } from "../types";

export const mcpFundamentalsModule: Module = {
  id: "mcp-fundamentals",
  title: "MCP Architecture & Fundamentals",
  description: "Understand the Model Context Protocol at the transport layer, build custom MCP servers, configure and debug deployments, and design production-grade MCP ecosystems for AI Second Brain platforms.",
  lessons: [
    {
      id: "mcp-protocol-deep-dive",
      slug: "mcp-protocol-deep-dive",
      title: "MCP Protocol Deep Dive",
      content: `## MCP Protocol Deep Dive

The **Model Context Protocol (MCP)** is an open standard that lets AI models communicate with external data sources and tools through a well-defined interface. It is not an API convention — it is a **transport-level protocol** built on JSON-RPC 2.0.

---

### Transport Layer

MCP messages are JSON-RPC 2.0 envelopes exchanged over one of two transports:

| Transport | When to Use |
|-----------|-------------|
| **stdio** | Local processes. Claude Desktop spawns the server as a child process and pipes stdin/stdout. Zero network overhead, ideal for local tools. |
| **SSE (Server-Sent Events)** | Remote servers. The client opens an HTTP connection; the server streams events. Used when the MCP server lives on a different machine or in the cloud. |

A raw stdio message looks like:

\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "search_notes",
    "arguments": { "query": "weekly review" }
  }
}
\`\`\`

---

### Server vs Client

- **MCP Server** — exposes capabilities (tools, resources, prompts). It is passive: it responds to requests.
- **MCP Client** — the AI host (Claude Desktop, Claude Code, a custom agent). It discovers capabilities and decides when to invoke them.
- **Host** — the application embedding the client (e.g. Claude Desktop itself).

---

### The Three MCP Primitives

| Primitive | Purpose | Example |
|-----------|---------|---------|
| **Tools** | Executable actions the model can invoke | \`search_notes\`, \`create_task\`, \`send_email\` |
| **Resources** | Read-only data exposed to the model as context | A markdown file, a database row, a calendar event |
| **Prompts** | Pre-built prompt templates the model or user can invoke | "Summarise this thread", "Draft a reply" |

Tools are the most important primitive for agentic workflows. Resources provide ambient context. Prompts are reusable instruction packages.

---

### How MCP Differs From Function Calling

OpenAI-style **function calling** is a single-model feature baked into a specific API. MCP is model-agnostic and transport-agnostic:

- Any client can discover any server's tools at runtime via \`tools/list\`
- Servers can be added or removed without redeploying the model
- The same MCP server works with Claude, GPT-4o, Gemini, or a local Ollama model
- MCP schemas are richer: resources have URIs, prompts have arguments with descriptions

---

### Exercise

Implement a minimal JSON-RPC 2.0 dispatcher in Node.js. It must:
1. Accept a raw JSON-RPC request object
2. Route \`tools/list\` to return one tool definition
3. Route \`tools/call\` to execute the tool and return a result
4. Return a proper JSON-RPC error for unknown methods`,
      starterCode: `// Minimal MCP-style JSON-RPC dispatcher (no SDK — raw protocol)
// Your task: implement handleRequest so all three test cases pass.

const TOOLS = [
  {
    name: "echo",
    description: "Returns the input string unchanged",
    inputSchema: {
      type: "object",
      properties: {
        message: { type: "string", description: "The text to echo" },
      },
      required: ["message"],
    },
  },
];

function handleRequest(request) {
  // TODO: handle "tools/list" — return { tools: TOOLS }
  // TODO: handle "tools/call" — execute the "echo" tool
  // TODO: return JSON-RPC error for unknown methods
  // All responses must be wrapped: { jsonrpc: "2.0", id: request.id, result: ... }
  // Errors must be: { jsonrpc: "2.0", id: request.id, error: { code, message } }
}

// --- Tests ---
const listReq = { jsonrpc: "2.0", id: 1, method: "tools/list", params: {} };
const callReq = {
  jsonrpc: "2.0",
  id: 2,
  method: "tools/call",
  params: { name: "echo", arguments: { message: "hello MCP" } },
};
const badReq = { jsonrpc: "2.0", id: 3, method: "unknown/method", params: {} };

console.log("tools/list:", JSON.stringify(handleRequest(listReq), null, 2));
console.log("tools/call:", JSON.stringify(handleRequest(callReq), null, 2));
console.log("unknown method:", JSON.stringify(handleRequest(badReq), null, 2));
`,
      solutionCode: `// Minimal MCP-style JSON-RPC dispatcher (no SDK — raw protocol)

const TOOLS = [
  {
    name: "echo",
    description: "Returns the input string unchanged",
    inputSchema: {
      type: "object",
      properties: {
        message: { type: "string", description: "The text to echo" },
      },
      required: ["message"],
    },
  },
];

function handleRequest(request) {
  const { jsonrpc, id, method, params } = request;

  if (method === "tools/list") {
    return { jsonrpc, id, result: { tools: TOOLS } };
  }

  if (method === "tools/call") {
    const { name, arguments: args } = params;
    if (name === "echo") {
      return {
        jsonrpc,
        id,
        result: {
          content: [{ type: "text", text: args.message }],
        },
      };
    }
    return {
      jsonrpc,
      id,
      error: { code: -32602, message: \`Unknown tool: \${name}\` },
    };
  }

  // JSON-RPC method not found
  return {
    jsonrpc,
    id,
    error: { code: -32601, message: \`Method not found: \${method}\` },
  };
}

// --- Tests ---
const listReq = { jsonrpc: "2.0", id: 1, method: "tools/list", params: {} };
const callReq = {
  jsonrpc: "2.0",
  id: 2,
  method: "tools/call",
  params: { name: "echo", arguments: { message: "hello MCP" } },
};
const badReq = { jsonrpc: "2.0", id: 3, method: "unknown/method", params: {} };

console.log("tools/list:", JSON.stringify(handleRequest(listReq), null, 2));
console.log("tools/call:", JSON.stringify(handleRequest(callReq), null, 2));
console.log("unknown method:", JSON.stringify(handleRequest(badReq), null, 2));
`,
    },
    {
      id: "mcp-building-servers",
      slug: "building-mcp-servers",
      title: "Building Custom MCP Servers",
      content: `## Building Custom MCP Servers

The official **\`@modelcontextprotocol/sdk\`** package removes the need to write raw JSON-RPC handling. It manages the protocol lifecycle, routing, and schema validation so you can focus on tool logic.

---

### Server Lifecycle

When Claude connects to your MCP server three things happen in order:

1. **Initialize** — handshake where client and server exchange protocol versions and capabilities
2. **tools/list** — client discovers what tools your server exposes
3. **tools/call** — client invokes a specific tool with validated arguments

The SDK handles steps 1 and 2 automatically. You declare tools; the SDK registers them.

---

### Basic Server Structure

\`\`\`js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "my-server",
  version: "1.0.0",
});

server.tool(
  "my_tool",
  "What this tool does",
  { query: z.string().describe("Search query") },
  async ({ query }) => ({
    content: [{ type: "text", text: \`Result for: \${query}\` }],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
\`\`\`

---

### Schema Validation with Zod

MCP tool arguments are validated against a JSON Schema. The SDK accepts **Zod schemas** and converts them automatically:

| Zod | JSON Schema | Notes |
|-----|-------------|-------|
| \`z.string()\` | \`{ type: "string" }\` | Use \`.describe()\` to add description |
| \`z.number().int()\` | \`{ type: "integer" }\` | Integers vs floats matter |
| \`z.enum(["a","b"])\` | \`{ enum: ["a","b"] }\` | Restricts allowed values |
| \`z.object({...})\` | \`{ type: "object", properties: {...} }\` | Nested schemas |
| \`.optional()\` | Removes from \`required\` array | Optional arguments |

---

### Error Handling

Return structured errors rather than throwing:

\`\`\`js
// Recoverable error — client can retry
return {
  content: [{ type: "text", text: "Note not found" }],
  isError: true,
};

// Use throw only for unexpected failures (SDK converts to JSON-RPC error)
throw new Error("Database connection lost");
\`\`\`

---

### Exercise

Build an MCP server that exposes a \`search_notes\` tool. The tool accepts a \`query\` string and an optional \`limit\` integer. It searches a mock notes array (case-insensitive substring match on title and body) and returns matching notes as formatted text.`,
      starterCode: `// MCP server with search_notes tool
// Run: node solution.js  (or wire into Claude Desktop config)
// Uses the real @modelcontextprotocol/sdk API shape — implement the logic.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Mock data — do not change
const NOTES = [
  { id: "1", title: "Weekly Review", body: "Completed sprint goals. Need to follow up on MCP research." },
  { id: "2", title: "MCP Architecture Notes", body: "JSON-RPC 2.0 over stdio. Three primitives: tools, resources, prompts." },
  { id: "3", title: "Second Brain Setup", body: "Obsidian vault connected via MCP. Missive and Slack next." },
  { id: "4", title: "Meeting — Head of IT", body: "Discuss AI automation stack. Prepare MCP demo." },
  { id: "5", title: "Reading List", body: "MCP spec, LangGraph docs, Anthropic cookbook." },
];

const server = new McpServer({ name: "second-brain", version: "1.0.0" });

// TODO: Register a tool called "search_notes"
// Description: "Search notes by keyword"
// Args: query (string, required), limit (number, optional, default 3)
// Logic: filter NOTES where title or body includes query (case-insensitive)
//        apply limit, format results as text, return content array

const transport = new StdioServerTransport();
await server.connect(transport);
`,
      solutionCode: `// MCP server with search_notes tool — solution

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const NOTES = [
  { id: "1", title: "Weekly Review", body: "Completed sprint goals. Need to follow up on MCP research." },
  { id: "2", title: "MCP Architecture Notes", body: "JSON-RPC 2.0 over stdio. Three primitives: tools, resources, prompts." },
  { id: "3", title: "Second Brain Setup", body: "Obsidian vault connected via MCP. Missive and Slack next." },
  { id: "4", title: "Meeting — Head of IT", body: "Discuss AI automation stack. Prepare MCP demo." },
  { id: "5", title: "Reading List", body: "MCP spec, LangGraph docs, Anthropic cookbook." },
];

const server = new McpServer({ name: "second-brain", version: "1.0.0" });

server.tool(
  "search_notes",
  "Search notes by keyword across title and body",
  {
    query: z.string().describe("Keyword or phrase to search for"),
    limit: z.number().int().min(1).max(20).optional().describe("Max results to return (default 3)"),
  },
  async ({ query, limit = 3 }) => {
    const lower = query.toLowerCase();
    const matches = NOTES
      .filter(n => n.title.toLowerCase().includes(lower) || n.body.toLowerCase().includes(lower))
      .slice(0, limit);

    if (matches.length === 0) {
      return {
        content: [{ type: "text", text: \`No notes found for query: "\${query}"\` }],
      };
    }

    const formatted = matches
      .map(n => \`**[\${n.id}] \${n.title}**\\n\${n.body}\`)
      .join("\\n\\n---\\n\\n");

    return {
      content: [
        {
          type: "text",
          text: \`Found \${matches.length} note(s) for "\${query}":\\n\\n\${formatted}\`,
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
`,
    },
    {
      id: "mcp-config-troubleshooting",
      slug: "mcp-config-troubleshooting",
      title: "MCP Configuration & Troubleshooting",
      content: `## MCP Configuration & Troubleshooting

Getting MCP servers connected and stable is where most implementation time goes. This lesson covers config files, transport trade-offs, and a systematic debugging approach.

---

### Configuration Files

**Claude Desktop** reads from \`claude_desktop_config.json\`:

\`\`\`json
{
  "mcpServers": {
    "second-brain": {
      "command": "node",
      "args": ["/absolute/path/to/server.js"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/Users/bilal/Documents/Brain"
      }
    }
  }
}
\`\`\`

**Claude Code** reads from \`.claude/settings.json\` in the project root:

\`\`\`json
{
  "mcpServers": {
    "second-brain": {
      "command": "node",
      "args": ["./mcp-bridge/server.js"],
      "type": "stdio"
    }
  }
}
\`\`\`

Key rules:
- Always use **absolute paths** in Claude Desktop config — relative paths break when Claude is launched from a different working directory
- Every server gets its own key under \`mcpServers\`
- Environment variables go in the \`env\` object, not in your shell profile

---

### stdio vs SSE — When to Use Which

| Concern | stdio | SSE |
|---------|-------|-----|
| Deployment | Local only (same machine) | Local or remote |
| Auth | OS process isolation | Must implement your own (API key, JWT) |
| Latency | Lowest (no network) | Adds HTTP round-trip |
| Restart on crash | Host restarts process automatically | Must use a process manager (PM2, systemd) |
| Multiple clients | One client per process | Many clients share one server |
| Debugging | Easiest — read stderr directly | Need HTTP log inspection |

**Rule of thumb:** use stdio for local tools during development, SSE only when the server must be shared or remote.

---

### Common Failure Modes

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Server disappears from tool list | Process crashed on startup | Check stderr; run server manually with \`node server.js\` |
| \`Method not found\` error | SDK version mismatch or wrong method name | Pin SDK version; check \`tools/list\` response |
| Tool silently returns empty | Zod validation rejected the argument | Add \`.describe()\` and check schema matches what Claude sends |
| Timeout on first call | Server taking too long to initialize | Move heavy I/O out of top-level \`await\` at startup |
| Works locally, fails in Claude Desktop | Relative path or missing env var | Use absolute paths; add env to config |

---

### Debugging with MCP Inspector

The official **MCP Inspector** (\`npx @modelcontextprotocol/inspector node server.js\`) opens a browser UI where you can:

1. See the \`tools/list\` response your server sends
2. Call individual tools with custom arguments
3. Inspect the raw JSON-RPC messages in both directions
4. Confirm error shapes match the protocol spec

**Validate server health before connecting to Claude:**

\`\`\`bash
# 1. Run server manually — should not exit immediately
node server.js

# 2. Open inspector
npx @modelcontextprotocol/inspector node server.js

# 3. In inspector, verify:
#    - tools/list returns your tool definitions
#    - tools/call with valid args returns expected content
#    - tools/call with invalid args returns isError: true (not a crash)
\`\`\`

---

### Checklist Before Calling It Production-Ready

- [ ] Server stays running for 10+ minutes without crashing
- [ ] All tools handle missing/invalid arguments gracefully (no unhandled throws)
- [ ] Errors return \`isError: true\` in content, not raw exceptions
- [ ] Absolute paths used in all config files
- [ ] Sensitive values (API keys, vault paths) are in \`env\` not hardcoded
- [ ] Inspector confirms correct tool schemas before connecting to Claude`,
    },
    {
      id: "mcp-second-brain",
      slug: "mcp-second-brain",
      title: "MCP in Production — Second Brain Architecture",
      content: `## MCP in Production — Second Brain Architecture

A **Second Brain** platform connects Claude to everything an operator knows: their emails, Slack messages, CRM records, and knowledge base. MCP is the glue layer that makes this possible without building a custom API for each integration.

---

### The Target Architecture

\`\`\`
Claude (client)
  ├── obsidian-mcp        → Obsidian vault (markdown files as Resources)
  ├── missive-mcp         → Email threads (Tools: read, search, draft, send)
  ├── slack-mcp           → Channel messages (Tools: read, post, search)
  └── crm-mcp             → Contact & deal records (Tools: lookup, update, log)
\`\`\`

Each server is independently deployed and versioned. Adding a new integration means writing one new MCP server — no changes to Claude's system prompt or the other servers.

---

### How Claude Selects Which Server to Call

Claude does **not** broadcast a query to all servers. It uses tool descriptions to decide:

1. Claude reads every tool's name and description from \`tools/list\` at session start
2. When the user asks a question, Claude reasons about which tool description matches
3. It calls exactly the tools it needs, in whatever order makes sense

**Implication for design:** tool descriptions are your API contract with the model. Write them like function docstrings for a senior engineer who has never seen your codebase.

\`\`\`js
// Bad — too vague
"Get notes"

// Good — Claude knows exactly when to call this
"Search the Obsidian knowledge base for notes matching a keyword.
Returns title, last-modified date, and first 200 characters of body.
Use this when the user asks about something they may have previously written down."
\`\`\`

---

### Memory Persistence via Obsidian Resources

Obsidian markdown files work naturally as MCP **Resources** because:
- Each file has a stable URI (\`obsidian://vault/Weekly Review.md\`)
- Resources are read-only — Claude reads them for context, tools write them
- The vault is already structured (folders, tags, backlinks)

Pattern: expose the vault as Resources for reading, and a \`create_note\` / \`append_to_note\` tool pair for writing. Claude can then maintain its own memory by writing summaries after each session.

---

### Connecting Email, Chat, and Knowledge

The real power emerges when Claude can cross-reference across servers in a single reasoning chain:

> "Summarise the thread from Head of IT in Missive, check if we have any notes on that topic in Obsidian, and draft a reply that references our existing research."

This requires:
1. \`missive-mcp\` → \`search_threads({ from: "Head of IT" })\`
2. \`obsidian-mcp\` → \`search_notes({ query: "MCP architecture" })\`
3. \`missive-mcp\` → \`draft_reply({ threadId, body })\`

No orchestration code needed — Claude reasons through the chain itself given good tool descriptions.

---

### Interview-Ready Architecture Talking Points

**On server isolation:** "Each MCP server owns one integration domain. A bug in the Slack server can't corrupt the CRM. We can redeploy, version, or disable any server independently."

**On context limits:** "MCP Resources let us inject only the relevant notes into context rather than dumping the entire vault. We use search tools to retrieve-then-read rather than loading everything upfront."

**On security:** "stdio servers run as a separate OS process with its own permissions. The Obsidian server only has read access to the vault path. The CRM server uses a scoped API key. Claude itself never touches credentials."

**On why not just use the API directly:** "MCP gives us a standard interface that works across Claude Desktop, Claude Code, and any future Claude-powered product. We write the integration once; it works everywhere."

---

### Scaling Considerations

| Challenge | MCP Solution |
|-----------|-------------|
| Too many tools confuse the model | Group related tools under one server; use clear naming prefixes |
| Large vault slows search | Implement vector search in the MCP server; return only top-k results |
| Rate limits on external APIs | Add caching layer inside the MCP server — transparent to Claude |
| Multi-user platform | Each user gets their own MCP server instance (scoped to their data) |`,
    },
  ],
};
