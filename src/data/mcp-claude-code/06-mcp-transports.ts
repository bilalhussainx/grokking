import { Module } from "../types";

export const mcpTransportsModule: Module = {
  id: "mcp-transports",
  title: "MCP Transports Deep Dive",
  description:
    "Understand every MCP transport at the protocol level — stdio, SSE, and streamable HTTP. Covers framing, latency budgets, failover patterns, and the decision framework interviewers expect you to recite cold.",
  lessons: [
    {
      id: "stdio-transport-internals",
      slug: "stdio-transport-internals",
      title: "stdio Transport — Architecture & Internals",
      content: `## stdio Transport — Architecture & Internals

The **stdio transport** is the simplest and most performant MCP transport. It requires zero network infrastructure because the MCP host spawns the server as a **child process** and communicates through the process's standard streams.

---

### How It Works

1. The MCP host (e.g. Claude Desktop, Claude Code) calls \`child_process.spawn()\` with the server command.
2. The host writes JSON-RPC 2.0 messages to the child's **stdin**.
3. The child writes JSON-RPC 2.0 responses to its **stdout**.
4. The child writes log lines, debug output, and errors to **stderr** — entirely separate from the protocol channel.

This separation is critical. **Mixing stderr content into stdout corrupts the protocol stream.** Every MCP SDK enforces this by routing all internal logging to stderr automatically.

---

### Message Framing

stdio does not have a built-in framing mechanism — raw bytes stream in both directions. MCP solves this with an HTTP-style header:

\`\`\`
Content-Length: 127\\r\\n
\\r\\n
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"read_file","arguments":{"path":"/notes/daily.md"}}}
\`\`\`

The reader buffers incoming bytes, parses \`Content-Length\`, then reads exactly that many bytes as the JSON body. This is identical to the Language Server Protocol (LSP) framing — intentional, since MCP was designed by many of the same people.

**Interview answer:** "stdio uses Content-Length header framing over raw pipes — same as LSP — so the reader knows exactly how many bytes to consume before parsing JSON."

---

### Latency Characteristics

| Metric | Value |
|--------|-------|
| Network overhead | 0 ms (IPC, not TCP) |
| Serialization (JSON stringify/parse) | 1–3 ms |
| Kernel pipe round-trip | <1 ms |
| **Total typical round-trip** | **1–5 ms** |

This is the fastest MCP transport by a wide margin. No TCP handshake, no HTTP headers, no TLS negotiation.

---

### Process Lifecycle Management

The host is responsible for:

- **Spawning** the server process on startup or first use
- **Health checking** — detecting if the process has crashed (exit event, or no response within timeout)
- **Restarting** with exponential backoff (e.g. 1s, 2s, 4s, 8s, cap at 60s)
- **Graceful shutdown** — sending SIGTERM, waiting for the process to flush stdout, then SIGKILL after a timeout

\`\`\`typescript
import { spawn, ChildProcess } from "child_process";

function spawnMcpServer(command: string, args: string[]): ChildProcess {
  return spawn(command, args, {
    stdio: ["pipe", "pipe", "inherit"], // stdin=pipe, stdout=pipe, stderr=passthrough
    env: { ...process.env },
  });
}
\`\`\`

The \`"inherit"\` for stderr means the child's log output appears directly in the host's terminal — perfect for debugging.

---

### When to Use stdio

- Local developer tools (file system access, git operations, shell commands)
- CLI integrations that run on the same machine as the AI host
- Any scenario where sub-5ms latency matters
- Tools that require local credentials (SSH keys, local databases)
- Situations where running a network server is operationally undesirable

**What stdio cannot do:** serve multiple clients simultaneously, or be called from a remote machine. One process = one client session.

---

### Exercise

Build a minimal stdio MCP server in Node.js using the official SDK. It should expose one tool: \`echo\`, which returns whatever string the caller passes in. Implement correct Content-Length framing in your understanding, and verify that your server handles the \`initialize\` handshake before responding to tool calls.`,
      starterCode: `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// TODO 1: Create an MCP Server instance with name "echo-server" and version "1.0.0"
const server = null as any;

// TODO 2: Register a handler for ListToolsRequestSchema that returns one tool:
// name: "echo", description: "Returns the input string unchanged",
// inputSchema: { type: "object", properties: { message: { type: "string" } }, required: ["message"] }
server?.setRequestHandler(ListToolsRequestSchema, async () => {
  // fill in
});

// TODO 3: Register a handler for CallToolRequestSchema.
// If tool name is "echo", return the message from args as a text content item.
// If tool name is unknown, throw an Error("Unknown tool").
server?.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  // fill in
});

// TODO 4: Create a StdioServerTransport and connect the server to it.
// Then log "Echo MCP server running on stdio" to stderr (NOT stdout).
async function main() {
  // fill in
}

main().catch((err) => {
  console.error("Server error:", err);
  process.exit(1);
});
`,
      solutionCode: `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// 1. Create the server instance
const server = new Server(
  { name: "echo-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 2. List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "echo",
      description: "Returns the input string unchanged",
      inputSchema: {
        type: "object",
        properties: {
          message: { type: "string", description: "The string to echo back" },
        },
        required: ["message"],
      },
    },
  ],
}));

// 3. Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "echo") {
    const message = (args as { message: string }).message;
    return {
      content: [{ type: "text", text: message }],
    };
  }

  throw new Error(\`Unknown tool: \${name}\`);
});

// 4. Connect via stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Always log to stderr — stdout is the protocol channel
  console.error("Echo MCP server running on stdio");
}

main().catch((err) => {
  console.error("Server error:", err);
  process.exit(1);
});
`,
    },
    {
      id: "sse-transport-internals",
      slug: "sse-transport-internals",
      title: "SSE Transport — Server-Sent Events for MCP",
      content: `## SSE Transport — Server-Sent Events for MCP

The **SSE transport** enables MCP over a network boundary. It uses two HTTP endpoints working together: one for the server-to-client stream (SSE) and one for client-to-server messages (POST).

---

### How SSE Transport Works

SSE is a one-way streaming protocol built on HTTP. Because MCP is bidirectional, the SSE transport uses an asymmetric pattern:

| Direction | Mechanism |
|-----------|-----------|
| Server → Client | SSE stream (long-lived GET response, \`text/event-stream\`) |
| Client → Server | HTTP POST requests to a dynamically assigned endpoint |

**Connection lifecycle:**

1. Client opens a GET request to \`/sse\` — this is a long-lived connection.
2. Server immediately sends an \`endpoint\` event containing the POST URL:
   \`\`\`
   event: endpoint
   data: /message?sessionId=abc123
   \`\`\`
3. Client sends JSON-RPC messages via POST to that URL (e.g. \`/message?sessionId=abc123\`).
4. Server sends JSON-RPC responses back through the open SSE stream.

**Interview answer:** "SSE transport is asymmetric — the client POSTs requests and the server pushes responses through a persistent SSE stream. The session ID ties the two channels together."

---

### The SSE Protocol Wire Format

SSE frames look like:

\`\`\`
event: message
data: {"jsonrpc":"2.0","id":1,"result":{"tools":[...]}}

\`\`\`

Each field is on its own line. A blank line terminates the event. The \`event:\` field is optional; \`data:\` is required. Large payloads can be split across multiple \`data:\` lines.

---

### Reconnection Strategy

The \`EventSource\` API in browsers (and equivalents in Node.js) handles reconnection automatically:

- If the connection drops, the browser retries after a configurable delay (default: 3 seconds).
- The browser sends a \`Last-Event-ID\` header with the ID of the last received event.
- The server uses this to replay missed events from a buffer, enabling **resumable sessions**.

For robust MCP deployments, set a \`retry:\` field in SSE events to control the reconnection delay:
\`\`\`
retry: 5000
data: {"jsonrpc":"2.0",...}
\`\`\`

---

### Latency Characteristics

| Metric | Value |
|--------|-------|
| TCP + TLS handshake (first connection) | 50–200 ms |
| HTTP overhead per message | 10–50 ms |
| Keep-alive heartbeat interval | 15–30 s |
| **Steady-state round-trip** | **10–50 ms** |

Much slower than stdio for local use, but SSE is the only option when the server lives on a different machine.

---

### CORS Considerations

When a browser-based client connects to an MCP SSE server, CORS headers are required:

\`\`\`typescript
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://your-client.com");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Last-Event-ID");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
\`\`\`

For CLI or server-to-server clients, CORS is irrelevant — only browser-based clients are restricted by the same-origin policy.

---

### Keep-Alive Heartbeats

SSE connections time out if no data flows. Proxies (nginx, AWS ALB) often have hard 60-second idle timeouts. Send a comment heartbeat every 15–30 seconds:

\`\`\`typescript
const heartbeat = setInterval(() => {
  res.write(": heartbeat\\n\\n");
}, 15000);

req.on("close", () => clearInterval(heartbeat));
\`\`\`

Comments (lines starting with \`:\`) are valid SSE syntax and are ignored by the client, but they reset the idle timer on every proxy hop.

---

### When to Use SSE

- Remote MCP servers hosted in the cloud
- Multi-client scenarios (multiple Claude instances hitting one server)
- When the server needs to be shared across a team
- Containerized deployments behind a load balancer (with sticky sessions or external state)

---

### Exercise

Build an Express-based SSE MCP server. It should handle the GET \`/sse\` endpoint (returning the SSE stream with the endpoint event), the POST \`/message\` endpoint, and implement heartbeats. Expose one tool: \`get_time\` that returns the current ISO timestamp.`,
      starterCode: `import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const app = express();
app.use(express.json());

// TODO 1: Create the MCP server with name "time-server" and version "1.0.0"
const server = null as any;

// TODO 2: Register ListToolsRequestSchema — expose one tool: "get_time"
// inputSchema: { type: "object", properties: {} }

// TODO 3: Register CallToolRequestSchema — if name is "get_time", return new Date().toISOString()

// TODO 4: Implement GET /sse endpoint
// - Create an SSEServerTransport("/message", res)
// - Set appropriate SSE headers (Content-Type: text/event-stream, Cache-Control: no-cache, etc.)
// - Connect server to the transport
// - Add a heartbeat comment every 15 seconds
// - Clear the heartbeat when the client disconnects
app.get("/sse", async (req, res) => {
  // fill in
});

// TODO 5: Implement POST /message endpoint
// The SSEServerTransport handles this — you need to call transport.handlePostMessage(req, res)
// But you need to match the session. Use a Map<string, SSEServerTransport> to store transports by session.
app.post("/message", async (req, res) => {
  // fill in
});

app.listen(3000, () => console.error("SSE MCP server listening on :3000"));
`,
      solutionCode: `import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const app = express();
app.use(express.json());

// Map session IDs to active transports
const transports = new Map<string, SSEServerTransport>();

// 1. Create the MCP server
const server = new Server(
  { name: "time-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 2. List tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_time",
      description: "Returns the current date and time as an ISO 8601 string",
      inputSchema: { type: "object", properties: {} },
    },
  ],
}));

// 3. Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_time") {
    return { content: [{ type: "text", text: new Date().toISOString() }] };
  }
  throw new Error(\`Unknown tool: \${request.params.name}\`);
});

// 4. SSE endpoint — opens the persistent server→client stream
app.get("/sse", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // disable nginx buffering

  const transport = new SSEServerTransport("/message", res);
  transports.set(transport.sessionId, transport);

  // Heartbeat to prevent proxy idle timeouts
  const heartbeat = setInterval(() => res.write(": heartbeat\\n\\n"), 15000);

  req.on("close", () => {
    clearInterval(heartbeat);
    transports.delete(transport.sessionId);
  });

  await server.connect(transport);
});

// 5. Message endpoint — client→server POST
app.post("/message", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports.get(sessionId);

  if (!transport) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  await transport.handlePostMessage(req, res);
});

app.listen(3000, () =>
  console.error("SSE MCP server listening on http://localhost:3000")
);
`,
    },
    {
      id: "streamable-http-transport",
      slug: "streamable-http-transport",
      title: "Streamable HTTP Transport — The Modern Standard",
      content: `## Streamable HTTP Transport — The Modern Standard

In 2025, the MCP specification introduced **Streamable HTTP** as the replacement for the SSE transport. It resolves the key operational weaknesses of SSE while retaining network accessibility.

---

### Why Streamable HTTP Was Introduced

The SSE transport has two painful limitations:

1. **Stateful connections** — every client needs a dedicated persistent SSE connection. Load balancers must use sticky sessions, which complicates horizontal scaling.
2. **Dual endpoint complexity** — maintaining two separate endpoints (\`/sse\` and \`/message\`) with session correlation is error-prone.

Streamable HTTP collapses this into a **single endpoint** with a flexible response model.

---

### How Streamable HTTP Works

**Everything goes through one HTTP endpoint** — typically \`POST /mcp\`.

The server can respond in two modes:

| Mode | Response Type | Use Case |
|------|--------------|----------|
| **Request/Response** | Regular HTTP response (200 + JSON) | Simple tool calls, short results |
| **Streaming** | \`text/event-stream\` response (SSE in the response body) | Long-running tools, progress updates, large results |

The client sends a standard JSON-RPC POST. The server inspects the request, decides whether to stream, and responds accordingly. The client checks the \`Content-Type\` of the response to detect streaming.

---

### Session Management via Mcp-Session-Id

Sessions are tracked through an HTTP header instead of a URL query parameter:

\`\`\`
POST /mcp HTTP/1.1
Content-Type: application/json
Mcp-Session-Id: sess_abc123

{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}
\`\`\`

On first contact (the \`initialize\` request), the server generates a session ID and returns it in the response header. All subsequent requests include it. This works cleanly with load balancers because the header can be used as a routing key.

---

### Stateless vs Stateful Server Modes

**Stateless mode:** Each request is independent. No session ID is issued. Every tool call must carry all necessary context. This is ideal for serverless deployments (Vercel, AWS Lambda) where there is no in-memory state between invocations.

**Stateful mode:** A session is established at \`initialize\`. The server maintains per-session state in memory or an external store. This is required if your tools have conversation-level state (e.g. a multi-turn code review agent).

**Interview answer:** "Streamable HTTP supports both stateless and stateful modes. For serverless I skip session IDs entirely; for agents with conversational memory I issue a session ID and store state in Redis."

---

### Transport Comparison Table

| Property | stdio | SSE | Streamable HTTP |
|----------|-------|-----|-----------------|
| Latency | 1–5 ms | 10–50 ms | 10–60 ms |
| Network required | No | Yes | Yes |
| Multi-client | No (1:1) | Yes (sticky) | Yes (stateless OK) |
| Serverless compatible | No | No | Yes |
| Load balancer friendly | N/A | Sticky required | Yes (header routing) |
| Streaming support | Native | Yes | Optional per-request |
| SDK support (2025) | Full | Legacy | Full |
| Recommended for | Local tools | Legacy systems | All new remote deployments |

---

### Streaming Response Example

When a tool produces incremental output (e.g. a file scan that emits results as it finds them), the server responds with \`text/event-stream\`:

\`\`\`
HTTP/1.1 200 OK
Content-Type: text/event-stream
Mcp-Session-Id: sess_abc123

event: message
data: {"jsonrpc":"2.0","id":1,"result":{"content":[{"type":"text","text":"Scanning..."}]}}

event: message
data: {"jsonrpc":"2.0","id":1,"result":{"content":[{"type":"text","text":"Found 42 results"}]}}

\`\`\`

---

### When to Use Streamable HTTP

- Any new remote MCP server deployment (this is the current spec standard)
- Serverless functions (Lambda, Vercel Edge, Cloudflare Workers) — use stateless mode
- Multi-tenant platforms where many users share one server
- Anywhere you would have previously used SSE transport

---

### Exercise

Implement a Streamable HTTP MCP server using Express. Expose a \`scan_directory\` tool that streams back filenames from a path. Implement session ID issuance on \`initialize\` and validate the session ID on subsequent requests.`,
      starterCode: `import express from "express";
import { randomUUID } from "crypto";
import { readdirSync } from "fs";

const app = express();
app.use(express.json());

// In-memory session store { sessionId -> { initialized: boolean } }
const sessions = new Map<string, { initialized: boolean }>();

// TODO 1: Handle POST /mcp for initialize requests.
// If request.params.method === "initialize":
//   - Generate a sessionId with randomUUID()
//   - Store it in the sessions map
//   - Return JSON-RPC result with serverInfo and capabilities
//   - Set the Mcp-Session-Id response header
app.post("/mcp", async (req, res) => {
  const body = req.body;
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  if (body.method === "initialize") {
    // TODO: issue session, return capabilities
    return;
  }

  // TODO 2: For non-initialize requests, validate the session ID.
  // If missing or unknown, return 401 JSON-RPC error.

  // TODO 3: Handle tools/list — return one tool: "scan_directory"
  // inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] }

  // TODO 4: Handle tools/call for "scan_directory"
  // Check if the client accepts text/event-stream (req.headers.accept includes "text/event-stream")
  // If yes: respond with SSE stream, emit one event per filename, then close
  // If no: respond with regular JSON listing all files at once
});

app.listen(3001, () =>
  console.error("Streamable HTTP MCP server on http://localhost:3001")
);
`,
      solutionCode: `import express from "express";
import { randomUUID } from "crypto";
import { readdirSync } from "fs";

const app = express();
app.use(express.json());

const sessions = new Map<string, { initialized: boolean }>();

function jsonRpcResult(id: number | string | null, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}

function jsonRpcError(id: number | string | null, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

app.post("/mcp", async (req, res) => {
  const body = req.body;
  const incomingSessionId = req.headers["mcp-session-id"] as string | undefined;

  // 1. Handle initialize — create new session
  if (body.method === "initialize") {
    const sessionId = randomUUID();
    sessions.set(sessionId, { initialized: true });
    res.setHeader("Mcp-Session-Id", sessionId);
    res.json(
      jsonRpcResult(body.id, {
        protocolVersion: "2024-11-05",
        serverInfo: { name: "streamable-http-demo", version: "1.0.0" },
        capabilities: { tools: {} },
      })
    );
    return;
  }

  // 2. Validate session for all other requests
  if (!incomingSessionId || !sessions.has(incomingSessionId)) {
    res.status(401).json(jsonRpcError(body.id, -32001, "Invalid or missing session ID"));
    return;
  }

  // 3. tools/list
  if (body.method === "tools/list") {
    res.json(
      jsonRpcResult(body.id, {
        tools: [
          {
            name: "scan_directory",
            description: "Lists all files in the given directory path",
            inputSchema: {
              type: "object",
              properties: { path: { type: "string", description: "Absolute directory path" } },
              required: ["path"],
            },
          },
        ],
      })
    );
    return;
  }

  // 4. tools/call
  if (body.method === "tools/call" && body.params?.name === "scan_directory") {
    const dirPath = body.params.arguments?.path as string;
    let files: string[];
    try {
      files = readdirSync(dirPath);
    } catch {
      res.json(jsonRpcError(body.id, -32602, \`Cannot read directory: \${dirPath}\`));
      return;
    }

    const acceptsStream = (req.headers.accept ?? "").includes("text/event-stream");

    if (acceptsStream) {
      // Streaming response — one SSE event per file
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Mcp-Session-Id", incomingSessionId);

      for (const file of files) {
        const event = JSON.stringify(
          jsonRpcResult(body.id, { content: [{ type: "text", text: file }] })
        );
        res.write(\`event: message\\ndata: \${event}\\n\\n\`);
      }
      res.end();
    } else {
      // Regular JSON response
      res.json(
        jsonRpcResult(body.id, {
          content: [{ type: "text", text: files.join("\\n") }],
        })
      );
    }
    return;
  }

  res.json(jsonRpcError(body.id, -32601, "Method not found"));
});

app.listen(3001, () =>
  console.error("Streamable HTTP MCP server on http://localhost:3001")
);
`,
    },
    {
      id: "transport-selection-latency-budgets",
      slug: "transport-selection-latency-budgets",
      title: "Transport Selection & Latency Budgets",
      content: `## Transport Selection & Latency Budgets

Choosing the wrong transport is the most common MCP architecture mistake. This lesson gives you a decision framework and the latency numbers to back up every choice in an interview.

---

### The Decision Framework

Answer these four questions in order:

**1. Is the MCP server on the same machine as the AI host?**
- Yes → use **stdio**. No exceptions. It is faster, simpler, and requires no open port.
- No → continue to question 2.

**2. Does the deployment need to be stateless (serverless, Lambda, Edge)?**
- Yes → use **Streamable HTTP** in stateless mode.
- No → continue to question 3.

**3. Are you targeting a modern MCP client (2025+)?**
- Yes → use **Streamable HTTP** in stateful mode.
- No (legacy client) → use **SSE** (deprecated but still supported).

**4. Do you need streaming progress updates from long-running tools?**
- Yes → ensure your HTTP transport uses streaming mode responses.
- No → regular request/response mode is fine.

**Interview one-liner:** "stdio for local, Streamable HTTP for remote. SSE only for legacy compatibility."

---

### Latency Budget Planning

A common interview question: "How do you ensure tool calls complete within 300ms?"

Break the budget into components:

| Component | stdio | SSE / HTTP |
|-----------|-------|------------|
| Transport overhead | 1–5 ms | 10–60 ms |
| JSON serialization | 1–3 ms | 1–3 ms |
| Tool execution | 50–200 ms | 50–200 ms |
| Response serialization | 1–3 ms | 1–3 ms |
| Network (remote) | 0 ms | 5–50 ms (RTT) |
| **Total** | **53–211 ms** | **67–316 ms** |

For HTTP transports, staying within 300ms requires either fast tool execution (<150ms) or accepting that some calls will miss the budget and designing accordingly (streaming, progress events, or async with callbacks).

---

### Hybrid Architecture Pattern

The most resilient production architecture uses both transports:

\`\`\`
Claude Code
    │
    ├── stdio ──────── local-vault-server (file system, SSH keys, local DB)
    │
    └── HTTP ────────── cloud-api-server (GitHub, Slack, linear.app, web search)
\`\`\`

Local tools are stdio — zero latency, no network dependency. Remote tools are HTTP — accessible from anywhere but with network cost accepted.

**Interview answer:** "I run two MCP servers: one via stdio for anything touching the local machine, and one via Streamable HTTP for cloud API integrations. This keeps latency-sensitive operations fast while exposing remote capabilities without a VPN."

---

### Measuring Transport Latency

Before committing to a transport decision in production, benchmark it:

\`\`\`typescript
async function measureRoundTrip(
  client: Client,
  iterations: number
): Promise<{ p50: number; p95: number; p99: number }> {
  const timings: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await client.request({ method: "tools/list" }, ListToolsResultSchema);
    timings.push(performance.now() - start);
  }

  timings.sort((a, b) => a - b);
  return {
    p50: timings[Math.floor(iterations * 0.5)],
    p95: timings[Math.floor(iterations * 0.95)],
    p99: timings[Math.floor(iterations * 0.99)],
  };
}
\`\`\`

Always report p50, p95, and p99 — not averages. Averages hide tail latency, which is what users actually notice.

---

### Common Interview Questions on Transport Selection

**Q: "When would you NOT use stdio?"**
A: When the server must be shared across multiple clients, when it's deployed remotely, or when it needs to be invoked from a serverless function that can't spawn child processes.

**Q: "How does SSE differ from WebSockets for MCP?"**
A: MCP never standardized WebSocket transport. SSE is HTTP-native (works through existing proxies and CDNs), while WebSockets require separate infrastructure. Streamable HTTP also avoids WebSockets for the same reason.

**Q: "What's the cost of SSE in a serverless environment?"**
A: SSE requires a persistent connection, which conflicts with serverless execution model (short-lived function invocations). This is exactly why Streamable HTTP in stateless mode exists — it works with regular HTTP, so any serverless platform supports it natively.

---

### Exercise

Write a benchmark harness that measures round-trip latency for an MCP \`tools/list\` call. Run it against a stdio server and report p50/p95/p99. Add a comparison function that determines which transport wins for a given latency budget.`,
      starterCode: `import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ListToolsResultSchema } from "@modelcontextprotocol/sdk/types.js";

// TODO 1: Create a function measureRoundTrip(client, iterations)
// - Runs tools/list request \`iterations\` times
// - Records the duration of each call using performance.now()
// - Returns { p50, p95, p99 } in milliseconds
async function measureRoundTrip(
  client: Client,
  iterations: number
): Promise<{ p50: number; p95: number; p99: number }> {
  // fill in
  return { p50: 0, p95: 0, p99: 0 };
}

// TODO 2: Create a function pickTransport(latencyBudgetMs, isRemote)
// Returns "stdio" if not remote, "streamable-http" if remote and budget > 60ms,
// "streamable-http-streaming" if remote and budget <= 60ms (needs streaming progress)
function pickTransport(latencyBudgetMs: number, isRemote: boolean): string {
  // fill in
  return "";
}

// TODO 3: Connect to the echo-server built in lesson 1 via stdio transport,
// run 100 iterations, print the results, and recommend a transport for
// a 200ms budget, local deployment.
async function main() {
  // fill in
}

main().catch(console.error);
`,
      solutionCode: `import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ListToolsResultSchema } from "@modelcontextprotocol/sdk/types.js";

// 1. Latency measurement with percentiles
async function measureRoundTrip(
  client: Client,
  iterations: number
): Promise<{ p50: number; p95: number; p99: number }> {
  const timings: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await client.request({ method: "tools/list" }, ListToolsResultSchema);
    timings.push(performance.now() - start);
  }

  timings.sort((a, b) => a - b);
  const pct = (p: number) => timings[Math.floor((iterations - 1) * p)];

  return {
    p50: Math.round(pct(0.5) * 100) / 100,
    p95: Math.round(pct(0.95) * 100) / 100,
    p99: Math.round(pct(0.99) * 100) / 100,
  };
}

// 2. Transport selection logic
function pickTransport(latencyBudgetMs: number, isRemote: boolean): string {
  if (!isRemote) return "stdio";
  // Remote transports add ~10-60ms overhead; if budget is very tight, warn
  if (latencyBudgetMs <= 60) {
    return "streamable-http-streaming"; // Use streaming to return partial results early
  }
  return "streamable-http";
}

// 3. Benchmark the echo server
async function main() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["./echo-server.js"], // built in lesson 1
  });

  const client = new Client(
    { name: "benchmark-client", version: "1.0.0" },
    { capabilities: {} }
  );

  await client.connect(transport);

  console.log("Running 100 round-trips against stdio transport...");
  const results = await measureRoundTrip(client, 100);

  console.log("Results:");
  console.log(\`  p50: \${results.p50} ms\`);
  console.log(\`  p95: \${results.p95} ms\`);
  console.log(\`  p99: \${results.p99} ms\`);

  const recommendation = pickTransport(200, false);
  console.log(\`\\nFor 200ms budget, local deployment: use \${recommendation}\`);

  await client.close();
}

main().catch(console.error);
`,
    },
    {
      id: "transport-failover-reconnection",
      slug: "transport-failover-reconnection",
      title: "Transport Failover & Reconnection Patterns",
      content: `## Transport Failover & Reconnection Patterns

Production MCP deployments fail. Processes crash, networks drop, servers restart. This lesson covers the exact reconnection strategies for each transport type and the patterns interviewers expect you to know.

---

### stdio: Process Crash Detection & Respawn

When an stdio MCP server crashes, the child process exits. The host detects this via the \`exit\` or \`close\` event on the child process object.

**Respawn with exponential backoff:**

\`\`\`typescript
class StdioServerManager {
  private retryDelay = 1000; // ms
  private maxDelay = 60000;  // 60 second cap
  private attempts = 0;

  async spawnWithBackoff(command: string, args: string[]) {
    while (true) {
      try {
        await this.connect(command, args);
        this.retryDelay = 1000; // reset on success
        this.attempts = 0;
      } catch {
        this.attempts++;
        const jitter = Math.random() * 500; // prevent thundering herd
        const delay = Math.min(this.retryDelay * 2 ** this.attempts, this.maxDelay) + jitter;
        console.error(\`Server crashed. Retry \${this.attempts} in \${Math.round(delay)}ms\`);
        await sleep(delay);
      }
    }
  }
}
\`\`\`

**Interview answer:** "For stdio crashes, I detect the child process exit event and respawn with exponential backoff starting at 1 second, doubling each time, capped at 60 seconds with jitter to avoid thundering herd."

---

### SSE: Session Resumption with Last-Event-ID

The browser's \`EventSource\` auto-reconnects, but the real challenge is **replaying missed messages**. The server must buffer recent events and replay them when a client reconnects with a \`Last-Event-ID\` header.

\`\`\`typescript
// Server-side: assign IDs to every SSE event
let eventId = 0;
const recentEvents: Array<{ id: number; data: string }> = [];
const BUFFER_SIZE = 100;

function sendEvent(res: Response, data: string) {
  eventId++;
  const event = \`id: \${eventId}\\nevent: message\\ndata: \${data}\\n\\n\`;
  res.write(event);
  recentEvents.push({ id: eventId, data });
  if (recentEvents.length > BUFFER_SIZE) recentEvents.shift();
}

// On reconnect: replay from Last-Event-ID
function replayMissed(res: Response, lastEventId: string) {
  const fromId = parseInt(lastEventId, 10);
  const missed = recentEvents.filter((e) => e.id > fromId);
  for (const event of missed) {
    res.write(\`id: \${event.id}\\nevent: message\\ndata: \${event.data}\\n\\n\`);
  }
}
\`\`\`

---

### HTTP: Retry with Exponential Backoff + Circuit Breaker

For Streamable HTTP, transient failures (503, 429, network errors) should be retried. Permanent failures (401, 404) should not.

**Circuit breaker pattern:**

| State | Behavior |
|-------|----------|
| **Closed** (normal) | All requests go through |
| **Open** (failing) | Requests fail immediately without hitting the server |
| **Half-Open** (probing) | One request allowed through to test recovery |

The circuit opens after N consecutive failures and transitions to half-open after a timeout. This prevents a struggling server from being overwhelmed with retries.

\`\`\`typescript
class CircuitBreaker {
  private failures = 0;
  private state: "closed" | "open" | "half-open" = "closed";
  private openedAt = 0;

  constructor(
    private threshold = 5,      // failures before opening
    private resetTimeout = 30000 // ms before half-open probe
  ) {}

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.openedAt > this.resetTimeout) {
        this.state = "half-open";
      } else {
        throw new Error("Circuit open — fast fail");
      }
    }
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = "closed";
  }

  private onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = "open";
      this.openedAt = Date.now();
    }
  }
}
\`\`\`

---

### Health Check Endpoints

Every production MCP server should expose a health check that the host can poll without sending a full JSON-RPC request:

\`\`\`typescript
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    activeSessions: sessions.size,
    timestamp: new Date().toISOString(),
  });
});
\`\`\`

For stdio servers, the equivalent is a lightweight \`ping\` tool that returns immediately — your health check script can call it and measure response time.

---

### PM2 Integration for stdio Processes

For production stdio MCP servers, use PM2 to manage process lifecycle:

\`\`\`json
// ecosystem.config.js
{
  "apps": [{
    "name": "mcp-local-vault",
    "script": "dist/server.js",
    "restart_delay": 1000,
    "max_restarts": 10,
    "exp_backoff_restart_delay": 100,
    "watch": false,
    "env": { "NODE_ENV": "production" }
  }]
}
\`\`\`

PM2 handles exponential backoff restarts, logging to disk, and startup-on-boot — removing the need to implement this yourself in the host process.

---

### Graceful Degradation

When a transport fails completely, the application should degrade gracefully rather than crash:

1. **Tool call fails** → Return a structured error to the model, let it inform the user
2. **Server unreachable** → Disable dependent features, log the outage, alert on-call
3. **Repeated failures** → Circuit-break and surface a status indicator in the UI

**Interview answer:** "I wrap every MCP tool call in a try/catch. On failure I return a structured error result rather than throwing — the model can then inform the user that the tool is temporarily unavailable and suggest alternatives."

---

### Exercise

Build a resilient transport wrapper class that wraps any MCP client and adds: automatic reconnection with exponential backoff, a circuit breaker with configurable threshold, and a \`getStatus()\` method returning current health state. The wrapper should be transport-agnostic — it works the same for stdio and HTTP clients.`,
      starterCode: `import { Client } from "@modelcontextprotocol/sdk/client/index.js";

type TransportFactory = () => Promise<Client>;

// TODO 1: Implement ResilientMcpClient wrapping any Client.
// Constructor accepts: transportFactory (async fn returning a connected Client),
// retryOptions: { maxRetries: number, initialDelay: number, maxDelay: number },
// circuitBreakerOptions: { threshold: number, resetTimeout: number }

class ResilientMcpClient {
  private client: Client | null = null;
  private failures = 0;
  private circuitState: "closed" | "open" | "half-open" = "closed";
  private openedAt = 0;

  constructor(
    private factory: TransportFactory,
    private retryOpts = { maxRetries: 5, initialDelay: 1000, maxDelay: 60000 },
    private cbOpts = { threshold: 5, resetTimeout: 30000 }
  ) {}

  // TODO 2: Implement connect() — use the factory, retry with exponential backoff + jitter
  async connect(): Promise<void> {
    // fill in
  }

  // TODO 3: Implement call<T>(fn) — check circuit breaker state first,
  // run the fn, handle success/failure, update circuit state
  async call<T>(fn: (client: Client) => Promise<T>): Promise<T> {
    // fill in
    throw new Error("Not implemented");
  }

  // TODO 4: Implement getStatus() returning { state, failures, client: "connected" | "disconnected" }
  getStatus(): { state: string; failures: number; clientConnected: boolean } {
    // fill in
    return { state: this.circuitState, failures: this.failures, clientConnected: false };
  }

  // TODO 5: Implement reconnect() — close current client (if any), call connect() again
  async reconnect(): Promise<void> {
    // fill in
  }
}

export { ResilientMcpClient };
`,
      solutionCode: `import { Client } from "@modelcontextprotocol/sdk/client/index.js";

type TransportFactory = () => Promise<Client>;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class ResilientMcpClient {
  private client: Client | null = null;
  private failures = 0;
  private circuitState: "closed" | "open" | "half-open" = "closed";
  private openedAt = 0;

  constructor(
    private factory: TransportFactory,
    private retryOpts = { maxRetries: 5, initialDelay: 1000, maxDelay: 60000 },
    private cbOpts = { threshold: 5, resetTimeout: 30000 }
  ) {}

  // 2. Connect with exponential backoff + jitter
  async connect(): Promise<void> {
    let attempt = 0;
    let delay = this.retryOpts.initialDelay;

    while (attempt <= this.retryOpts.maxRetries) {
      try {
        this.client = await this.factory();
        console.error("MCP client connected successfully");
        return;
      } catch (err) {
        attempt++;
        if (attempt > this.retryOpts.maxRetries) {
          throw new Error(\`Failed to connect after \${attempt} attempts: \${err}\`);
        }
        const jitter = Math.random() * 500;
        const wait = Math.min(delay * 2 ** (attempt - 1), this.retryOpts.maxDelay) + jitter;
        console.error(\`Connect attempt \${attempt} failed. Retrying in \${Math.round(wait)}ms...\`);
        await sleep(wait);
      }
    }
  }

  // 3. Circuit-breaker-wrapped call
  async call<T>(fn: (client: Client) => Promise<T>): Promise<T> {
    // Check circuit state
    if (this.circuitState === "open") {
      const elapsed = Date.now() - this.openedAt;
      if (elapsed > this.cbOpts.resetTimeout) {
        this.circuitState = "half-open";
        console.error("Circuit half-open — probing...");
      } else {
        throw new Error(
          \`Circuit breaker OPEN — fast fail. Resets in \${Math.round((this.cbOpts.resetTimeout - elapsed) / 1000)}s\`
        );
      }
    }

    if (!this.client) {
      await this.connect();
    }

    try {
      const result = await fn(this.client!);
      // Success — reset circuit
      this.failures = 0;
      if (this.circuitState === "half-open") {
        console.error("Circuit closed — server recovered");
      }
      this.circuitState = "closed";
      return result;
    } catch (err) {
      this.failures++;
      console.error(\`Tool call failed (\${this.failures}/\${this.cbOpts.threshold}):  \${err}\`);

      if (this.failures >= this.cbOpts.threshold) {
        this.circuitState = "open";
        this.openedAt = Date.now();
        console.error("Circuit OPEN — too many failures");
      }
      throw err;
    }
  }

  // 4. Status report
  getStatus(): { state: string; failures: number; clientConnected: boolean } {
    return {
      state: this.circuitState,
      failures: this.failures,
      clientConnected: this.client !== null,
    };
  }

  // 5. Reconnect — tear down and reconnect
  async reconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.close();
      } catch {
        // ignore close errors
      }
      this.client = null;
    }
    await this.connect();
  }
}

export { ResilientMcpClient };

// --- Usage example ---
// const resilientClient = new ResilientMcpClient(
//   async () => {
//     const transport = new StdioClientTransport({ command: "node", args: ["./server.js"] });
//     const client = new Client({ name: "resilient-client", version: "1.0.0" }, { capabilities: {} });
//     await client.connect(transport);
//     return client;
//   },
//   { maxRetries: 5, initialDelay: 1000, maxDelay: 60000 },
//   { threshold: 5, resetTimeout: 30000 }
// );
//
// await resilientClient.connect();
// const tools = await resilientClient.call((c) =>
//   c.request({ method: "tools/list" }, ListToolsResultSchema)
// );
`,
    },
  ],
};
