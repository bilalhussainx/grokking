import { Module } from "../types";

export const interviewQaMasterclassModule: Module = {
  id: "interview-qa-masterclass",
  title: "Interview Q&A Masterclass",
  description: "Seven lessons covering every question you will face in a Second Brain / MCP integration interview — with structured answers, weak-area drills, and practical code exercises. Built from real interview experience.",
  lessons: [
    {
      id: "interview-qa-1",
      slug: "mcp-fundamentals-qa",
      title: "MCP Fundamentals — Interview Q&A",
      content: `# MCP Fundamentals — Interview Q&A

## How to Use These Lessons

Every answer follows the same structure: **the point you lead with**, the depth you add if probed, and the one-liner that closes the thought. Questions marked 🔴 are weak areas — prioritise drilling these until they feel natural.

---

## Q: What is the Model Context Protocol and why does it exist?

**Lead with:** MCP is an open standard developed by Anthropic that defines how AI models communicate with external tools, data sources, and services.

**Depth:** Before MCP, every AI integration was a one-off bespoke connection — each tool needed its own custom implementation, and the AI had no standardised way to discover what capabilities were available. MCP solves this by defining three primitives: **tools** (actions the model can invoke), **resources** (readable data it can pull), and **prompts** (pre-defined templates). Any MCP-compliant server exposes these three primitives, and any MCP-compliant client — like Claude Code — can automatically discover and use them without custom integration work per tool.

**Close:** The value proposition is interoperability: you build one MCP server for GoHighLevel once, and it works with any MCP client, now and in the future.

---

## Q: What are the three core primitives of MCP and how do they differ?

**Lead with:** Tools are the action primitive, resources are the read primitive, prompts are the template primitive.

**Depth:**
- **Tools** are callable functions with defined input schemas that produce a result. Think of them as POST endpoints: they change state or retrieve something in response to specific parameters.
- **Resources** are URI-addressable data sources the model can pull context from without invoking an action. Think of them as GET endpoints: stable, cacheable, noun-shaped.
- **Prompts** are pre-defined instruction templates that can be parameterised and reused across conversations.

In the codeswitcher system, GoHighLevel contact operations are tools, Obsidian vault files are resources, and voice governance instructions are prompts. The distinction matters because Claude treats them differently: it reads resources to build context, invokes tools to take action, and applies prompts as behavioural constraints.

---

## Q: What is the difference between an MCP server and an MCP client?

**Lead with:** The server exposes capabilities — it registers tools, resources, and prompts and handles execution. The client discovers and consumes those capabilities.

**Depth:** Claude Code is the client in the codeswitcher architecture. The Obsidian MCP server, the GoHighLevel MCP server, and the Missive MCP server are each separate server processes that Claude Code connects to simultaneously. One client can connect to many servers; each server runs as its own process with its own transport connection.

---

## Q: What is JSON-RPC 2.0 and why does MCP use it?

**Lead with:** JSON-RPC 2.0 is a lightweight remote procedure call protocol using JSON as its data format. Every MCP message is encoded as a JSON-RPC 2.0 message.

**Depth:** The protocol defines four message types:
- **Requests** — have an \`id\`, expect a response
- **Responses** — carry the result or error for a matching request \`id\`
- **Notifications** — no \`id\`, no response expected (fire and forget)
- **Batches** — an array of requests sent together

MCP uses JSON-RPC because it is transport-agnostic — the same message format works whether the underlying transport is stdio, SSE, or HTTP. It also has a well-defined error code system, which MCP extends with its own error codes.

---

## 🔴 Q: What is a JSON-RPC 2.0 batch request and when would you use one?

**Lead with:** A batch request is a JSON array containing multiple request objects sent in a single transmission.

**Depth:** Instead of sending five tool registration requests one at a time, you wrap all five in an array and send them together. The server processes them — potentially in parallel — and returns an array of response objects. **Critical detail:** the response array is not guaranteed to be in the same order as the request array, so you always match responses to requests using the \`id\` field, never by position.

**Use cases:** Registering multiple tools at startup, making several independent reads simultaneously, or when latency matters and you cannot afford five sequential round-trips. Pre-loading Obsidian context from three different vault files in one batch read is a practical example.

---

## 🔴 Q: What does idempotency mean in the context of MCP tool registration?

**Lead with:** Performing the same operation multiple times produces the same result as performing it once, with no side effects.

**Depth:** For tool registration, registering a tool that is already registered — with the identical name and schema — is a no-op: no duplicate, no error, identical success response. The server achieves this by fingerprinting each tool's schema (typically a hash of the name plus the full input schema) and comparing against what is already registered. If the fingerprint matches, return success. If it differs (schema changed), reject or version the tool.

**Why it matters:** At startup when Claude Code reconnects and re-discovers tools, you want restarts to be safe without manual cleanup.
`,
      starterCode: `// Exercise: Implement a JSON-RPC 2.0 batch request builder
// and response matcher that correctly handles out-of-order responses.

class JsonRpcBatch {
  private requests: any[] = [];
  private nextId = 1;

  // TODO: Add a request to the batch. Return the assigned id.
  addRequest(method: string, params: any): number {
    // Your code here
  }

  // TODO: Build the batch array ready to send
  toBatchArray(): any[] {
    // Your code here
  }

  // TODO: Match an array of responses back to requests by id.
  // Return a Map<number, { result?: any; error?: any }>
  matchResponses(responses: any[]): Map<number, any> {
    // Your code here
  }
}

// Test your implementation
const batch = new JsonRpcBatch();
const id1 = batch.addRequest("tools/list", {});
const id2 = batch.addRequest("resources/read", { uri: "obsidian://vault/deal-123" });
const id3 = batch.addRequest("resources/read", { uri: "obsidian://vault/client-acme" });

console.log("Batch:", JSON.stringify(batch.toBatchArray(), null, 2));

// Simulate out-of-order responses
const responses = [
  { jsonrpc: "2.0", id: id3, result: { content: "Acme profile data" } },
  { jsonrpc: "2.0", id: id1, result: { tools: ["ghl_search", "obsidian_read"] } },
  { jsonrpc: "2.0", id: id2, result: { content: "Deal 123 details" } },
];

const matched = batch.matchResponses(responses);
console.log("\\nMatched results:");
console.log("tools/list ->", matched.get(id1));
console.log("deal-123 ->", matched.get(id2));
console.log("client-acme ->", matched.get(id3));`,
      solutionCode: `class JsonRpcBatch {
  private requests: { id: number; method: string; params: any }[] = [];
  private nextId = 1;

  addRequest(method: string, params: any): number {
    const id = this.nextId++;
    this.requests.push({ id, method, params });
    return id;
  }

  toBatchArray(): any[] {
    return this.requests.map(req => ({
      jsonrpc: "2.0",
      id: req.id,
      method: req.method,
      params: req.params,
    }));
  }

  matchResponses(responses: any[]): Map<number, any> {
    const resultMap = new Map<number, any>();
    for (const res of responses) {
      // Always match by id, never by position
      if (res.id !== undefined) {
        resultMap.set(res.id, {
          result: res.result,
          error: res.error,
        });
      }
    }
    return resultMap;
  }
}

// Test
const batch = new JsonRpcBatch();
const id1 = batch.addRequest("tools/list", {});
const id2 = batch.addRequest("resources/read", { uri: "obsidian://vault/deal-123" });
const id3 = batch.addRequest("resources/read", { uri: "obsidian://vault/client-acme" });

console.log("Batch:", JSON.stringify(batch.toBatchArray(), null, 2));

const responses = [
  { jsonrpc: "2.0", id: id3, result: { content: "Acme profile data" } },
  { jsonrpc: "2.0", id: id1, result: { tools: ["ghl_search", "obsidian_read"] } },
  { jsonrpc: "2.0", id: id2, result: { content: "Deal 123 details" } },
];

const matched = batch.matchResponses(responses);
console.log("\\nMatched results:");
console.log("tools/list ->", matched.get(id1));
console.log("deal-123 ->", matched.get(id2));
console.log("client-acme ->", matched.get(id3));`,
    },
    {
      id: "interview-qa-2",
      slug: "transport-layers-qa",
      title: "Transport Layers — Interview Q&A",
      content: `# Transport Layers — Interview Q&A

---

## 🔴 Q: What transport options does MCP support and what are the differences?

**Lead with:** MCP supports three transports: stdio, SSE, and HTTP Streamable.

**Depth:**
- **stdio** is the default for local servers: the MCP server runs as a child process and communicates via standard input and standard output. No network, no port, no TLS — simplest possible setup and the right choice for same-machine servers.
- **SSE (Server-Sent Events)** is for remote servers: persistent HTTP connection where the server pushes messages to the client. SSE is unidirectional in the HTTP sense, so MCP uses a companion POST endpoint for client-to-server requests.
- **HTTP Streamable** is a more capable alternative to SSE supporting full bidirectional streaming over HTTP, suited for high-throughput production deployments.

---

## 🔴 Q: How do you decide which transport to use for a given MCP server?

**Lead with:** If the server runs on the same machine as Claude Code, use stdio — full stop.

**Decision tree:**
1. **Same machine** → stdio (zero network overhead, simplest)
2. **Remote, read-heavy/notification-heavy** → SSE
3. **Remote, full bidirectional streaming needed** → HTTP Streamable

**Interview key phrase:** "stdio is correct for same-machine processes and SSE introduces unnecessary network complexity for what is already a local IPC channel."

For the codeswitcher stack: GoHighLevel bridge, Obsidian MCP server, and Missive bridge all run locally during development → all use stdio. When deploying to a VPS where Claude Code connects remotely → migrate to SSE or HTTP Streamable.

---

## Q: What happens at the transport level when Claude Code starts up and connects to an MCP server?

**Lead with:** Claude Code reads its config, spawns each server process (stdio) or opens HTTP connections (SSE/HTTP), then performs a handshake.

**The full sequence:**
1. Claude Code reads \`~/.claude.json\` or \`.claude/settings.json\`
2. For each configured server: spawn process (stdio) or open HTTP connection (SSE/HTTP)
3. Send JSON-RPC \`initialize\` request with client's protocol version and capabilities
4. Server responds with its protocol version and capabilities
5. Client sends \`initialized\` notification to confirm handshake
6. Client sends \`tools/list\`, \`resources/list\`, \`prompts/list\` to discover everything
7. Only after discovery are tools/resources available in conversation

The whole handshake happens in the background before you type your first message.

---

## Q: What is the MCP capability negotiation handshake and why does it matter?

**Lead with:** During initialize/initialized, client and server each declare which optional MCP features they support.

**Optional capabilities include:**
- Streaming responses
- Resource subscriptions (server pushes updates when a resource changes)
- Sampling (server can ask the client to run an LLM inference)
- Roots (client exposes filesystem paths)

**Why it matters:** If the server declares it supports resource subscriptions but the client does not, the server knows not to push subscription updates. In the codeswitcher system, if you want the Obsidian MCP server to push live updates when a vault file changes, both sides must negotiate the subscription capability during the handshake.
`,
      starterCode: `// Exercise: Implement MCP transport selection logic
// Given a server configuration, determine the correct transport.

interface McpServerConfig {
  name: string;
  host: "local" | "remote";
  pattern: "read-heavy" | "write-heavy" | "bidirectional" | "balanced";
  throughput: "low" | "medium" | "high";
}

type Transport = "stdio" | "sse" | "http-streamable";

// TODO: Implement the transport selection decision tree
function selectTransport(config: McpServerConfig): Transport {
  // Your code here — follow the decision tree from the lesson
}

// TODO: Implement the initialize handshake sequence
// Return the messages that would be exchanged
function generateHandshakeSequence(
  clientCapabilities: string[],
  serverCapabilities: string[]
): { sender: string; type: string; content: any }[] {
  // Your code here
}

// Test cases
const configs: McpServerConfig[] = [
  { name: "obsidian-mcp", host: "local", pattern: "read-heavy", throughput: "low" },
  { name: "ghl-bridge", host: "local", pattern: "bidirectional", throughput: "medium" },
  { name: "remote-analytics", host: "remote", pattern: "read-heavy", throughput: "low" },
  { name: "remote-streaming", host: "remote", pattern: "bidirectional", throughput: "high" },
];

for (const config of configs) {
  console.log(\`\${config.name}: \${selectTransport(config)}\`);
}

console.log("\\nHandshake sequence:");
const handshake = generateHandshakeSequence(
  ["streaming", "roots"],
  ["streaming", "subscriptions"]
);
handshake.forEach(msg => console.log(\`  \${msg.sender} -> \${msg.type}: \${JSON.stringify(msg.content)}\`));`,
      solutionCode: `interface McpServerConfig {
  name: string;
  host: "local" | "remote";
  pattern: "read-heavy" | "write-heavy" | "bidirectional" | "balanced";
  throughput: "low" | "medium" | "high";
}

type Transport = "stdio" | "sse" | "http-streamable";

function selectTransport(config: McpServerConfig): Transport {
  // Rule 1: Local servers ALWAYS use stdio
  if (config.host === "local") return "stdio";

  // Rule 2: Remote + high throughput bidirectional → HTTP Streamable
  if (config.pattern === "bidirectional" && config.throughput === "high") {
    return "http-streamable";
  }

  // Rule 3: Remote read-heavy or notification-heavy → SSE
  if (config.pattern === "read-heavy") return "sse";

  // Rule 4: Everything else remote → SSE (safer default)
  return "sse";
}

function generateHandshakeSequence(
  clientCapabilities: string[],
  serverCapabilities: string[]
): { sender: string; type: string; content: any }[] {
  return [
    {
      sender: "client",
      type: "request (initialize)",
      content: {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: Object.fromEntries(clientCapabilities.map(c => [c, {}])),
          clientInfo: { name: "claude-code", version: "1.0.0" },
        },
      },
    },
    {
      sender: "server",
      type: "response (initialize)",
      content: {
        jsonrpc: "2.0",
        id: 1,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: Object.fromEntries(serverCapabilities.map(c => [c, {}])),
          serverInfo: { name: "obsidian-mcp", version: "1.0.0" },
        },
      },
    },
    {
      sender: "client",
      type: "notification (initialized)",
      content: {
        jsonrpc: "2.0",
        method: "notifications/initialized",
      },
    },
    {
      sender: "client",
      type: "request (tools/list)",
      content: { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
    },
    {
      sender: "client",
      type: "request (resources/list)",
      content: { jsonrpc: "2.0", id: 3, method: "resources/list", params: {} },
    },
    {
      sender: "client",
      type: "request (prompts/list)",
      content: { jsonrpc: "2.0", id: 4, method: "prompts/list", params: {} },
    },
  ];
}

// Test
const configs: McpServerConfig[] = [
  { name: "obsidian-mcp", host: "local", pattern: "read-heavy", throughput: "low" },
  { name: "ghl-bridge", host: "local", pattern: "bidirectional", throughput: "medium" },
  { name: "remote-analytics", host: "remote", pattern: "read-heavy", throughput: "low" },
  { name: "remote-streaming", host: "remote", pattern: "bidirectional", throughput: "high" },
];

for (const config of configs) {
  console.log(\`\${config.name}: \${selectTransport(config)}\`);
}

console.log("\\nHandshake sequence:");
const handshake = generateHandshakeSequence(
  ["streaming", "roots"],
  ["streaming", "subscriptions"]
);
handshake.forEach(msg =>
  console.log(\`  \${msg.sender} -> \${msg.type}: \${JSON.stringify(msg.content)}\`)
);`,
    },
    {
      id: "interview-qa-3",
      slug: "retry-resilience-qa",
      title: "Retry Logic & Resilience — Interview Q&A",
      content: `# Retry Logic & Resilience — Interview Q&A

---

## 🔴 Q: What happens when the stdio transport closes unexpectedly and how should your server handle it?

**Lead with:** The server receives an end-of-file on stdin and a broken pipe error on stdout. Without handling, it hangs or crashes silently.

**Three layers of correct handling:**

1. **Stream event listeners** — Listen for \`close\` and \`error\` events on stdin/stdout. Clean up resources and exit cleanly. A hung server process blocks Claude Code from reconnecting.

2. **Heartbeat writes** — Periodic write to stdout as both a liveness check and broken-pipe detector. If the heartbeat write fails, you know the connection is dead before a tool call fails mid-execution.

3. **Process manager restart** — PM2 or systemd restarts the server process after exit, with exponential backoff to avoid crash-loop behaviour. The reconnection strategy lives in the process manager, not the server itself.

---

## 🔴 Q: Explain exponential backoff with jitter and why both components are necessary.

**Lead with:** Exponential backoff doubles the wait between retries. Jitter adds randomness to prevent synchronised retry storms.

**Backoff:** First retry after 1s, second after 2s, third after 4s, fourth after 8s, up to a configured max (typically 60s). Prevents hammering a failing service.

**Jitter:** Random offset added to each interval. Without jitter, if multiple clients all fail at the same time, they all retry at the same intervals — creating repeated synchronised bursts. This is called the **thundering herd problem**.

**Formula:** \`delay = min(maxDelay, baseDelay * 2^attempt) + random(0, jitterRange)\`

**In practice:** BullMQ's built-in exponential backoff handles job retries. The circuit breaker's reconnect schedule uses jitter when re-establishing MCP server connections.

---

## 🔴 Q: What is a circuit breaker and what are its three states?

**Lead with:** A stability pattern that prevents repeatedly calling a failing dependency, giving it time to recover.

**Three states:**

| State | Behaviour | Transition |
|-------|-----------|------------|
| **Closed** | All calls pass through. Counts failures in a rolling window. | Failure threshold crossed → Open |
| **Open** | All calls rejected immediately (fast failure). Returns fallback. | Cooldown expires → Half-Open |
| **Half-Open** | One probe request allowed through. | Probe succeeds → Closed; Probe fails → Open |

**In the codeswitcher architecture:** A circuit breaker wraps every Claude Code call in the BullMQ worker. If Claude's response pipeline fails three times in a row, the breaker opens and the worker returns a pre-written fallback draft to Missive instead of hanging.

---

## Q: How does PM2 complement the circuit breaker pattern rather than replace it?

**Lead with:** PM2 operates at the **process level**. The circuit breaker operates at the **call level**. They are complementary.

**Why you need both:**
- A process can be running and healthy at the OS level while failing every API call internally — PM2 cannot detect this, but the circuit breaker can.
- If the process crashes, the circuit breaker state is lost — PM2 handles restarting it.

**Mental model:** PM2 is the outer safety net for process-level failures, the circuit breaker is the inner safety net for call-level failures.

---

## Q: What is a dead letter queue and when would you use one?

**Lead with:** Where BullMQ moves jobs after they exhaust all retry attempts without succeeding.

**Purpose:** Instead of being silently discarded, failed jobs land in the DLQ for manual inspection, alerting, or replay.

**Codeswitcher example:** If a Missive webhook job fails three times (Claude's API down, Obsidian unreachable), the job moves to the DLQ. You get an alert, inspect the payload to see which email it was processing, and manually replay it once the issue is resolved.

**Without a DLQ:** Silent data loss — emails received but never processed, with no record of what was missed.
`,
      starterCode: `// Exercise: Implement a circuit breaker with all three states
// and exponential backoff with jitter for the retry mechanism.

type CircuitState = "closed" | "open" | "half-open";

class CircuitBreaker {
  private state: CircuitState = "closed";
  private failureCount = 0;
  private lastFailureTime = 0;

  constructor(
    private failureThreshold: number = 3,
    private cooldownMs: number = 30000,
    private fallbackFn: () => any = () => ({ fallback: true })
  ) {}

  // TODO: Get current state
  getState(): CircuitState {
    // Your code here — check if cooldown has expired for open→half-open
  }

  // TODO: Execute a function through the circuit breaker
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Your code here:
    // - If open and cooldown not expired → return fallback
    // - If open and cooldown expired → transition to half-open, try probe
    // - If closed or half-open → execute fn
    // - On success → close breaker, reset failures
    // - On failure → increment failures, check threshold
  }

  // TODO: Record a failure
  private recordFailure(): void {
    // Your code here
  }

  // TODO: Record a success
  private recordSuccess(): void {
    // Your code here
  }
}

// TODO: Implement exponential backoff with jitter
function calculateBackoff(
  attempt: number,
  baseDelayMs: number = 1000,
  maxDelayMs: number = 60000,
  jitterMs: number = 1000
): number {
  // Your code here
}

// Test
const breaker = new CircuitBreaker(3, 5000, () => "fallback-draft");

async function simulateCall(shouldFail: boolean) {
  return breaker.execute(async () => {
    if (shouldFail) throw new Error("API down");
    return "success";
  });
}

// Test backoff
for (let i = 0; i < 6; i++) {
  console.log(\`Attempt \${i}: delay = \${calculateBackoff(i)}ms\`);
}`,
      solutionCode: `type CircuitState = "closed" | "open" | "half-open";

class CircuitBreaker {
  private state: CircuitState = "closed";
  private failureCount = 0;
  private lastFailureTime = 0;

  constructor(
    private failureThreshold: number = 3,
    private cooldownMs: number = 30000,
    private fallbackFn: () => any = () => ({ fallback: true })
  ) {}

  getState(): CircuitState {
    if (this.state === "open") {
      const elapsed = Date.now() - this.lastFailureTime;
      if (elapsed >= this.cooldownMs) {
        this.state = "half-open";
      }
    }
    return this.state;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const currentState = this.getState();

    if (currentState === "open") {
      console.log("[CircuitBreaker] OPEN — returning fallback");
      return this.fallbackFn() as T;
    }

    try {
      const result = await fn();
      this.recordSuccess();
      return result;
    } catch (err) {
      this.recordFailure();
      if (this.state === "open") {
        console.log("[CircuitBreaker] Threshold reached — OPENED");
        return this.fallbackFn() as T;
      }
      throw err;
    }
  }

  private recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = "open";
    }
  }

  private recordSuccess(): void {
    this.failureCount = 0;
    this.state = "closed";
  }
}

function calculateBackoff(
  attempt: number,
  baseDelayMs: number = 1000,
  maxDelayMs: number = 60000,
  jitterMs: number = 1000
): number {
  const exponential = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
  const jitter = Math.random() * jitterMs;
  return Math.floor(exponential + jitter);
}

// Test breaker
const breaker = new CircuitBreaker(3, 5000, () => "fallback-draft");

async function simulateCall(shouldFail: boolean) {
  return breaker.execute(async () => {
    if (shouldFail) throw new Error("API down");
    return "success";
  });
}

// Test backoff
for (let i = 0; i < 6; i++) {
  console.log(\`Attempt \${i}: delay = \${calculateBackoff(i)}ms\`);
}`,
    },
    {
      id: "interview-qa-4",
      slug: "obsidian-second-brain-qa",
      title: "Obsidian Second Brain — Interview Q&A",
      content: `# Obsidian Vault as Second Brain — Interview Q&A

---

## Q: How does Obsidian fit into the Second Brain architecture and what role does MCP play?

**Lead with:** Obsidian is the persistent memory layer. Claude Code has no memory between sessions — Obsidian solves this.

**Depth:** Obsidian stores structured knowledge as markdown files: client profiles, deal histories, communication logs, entity configurations, and voice governance rules. An Obsidian MCP server exposes vault files as MCP resources with addressable URIs. Before Claude drafts any response, it reads the relevant resources: deal file, client profile, entity voice file, governance rules. Claude never reads the vault directly — it reads through MCP, which means access is controlled, logged, and consistent.

**Close:** Obsidian is the database; MCP is the query interface.

---

## Q: How would you design the folder structure of an Obsidian vault for multi-entity AI orchestration?

**Lead with:** The folder structure should mirror the access patterns — the way Claude looks things up determines how files should be organised.

**Top-level folders:**
- \`clients/\` — one subfolder per client (profile + communication history)
- \`deals/\` — one file per deal, named by deal ID (primary lookup key from incoming messages)
- \`entities/\` — configuration for each business entity (voice settings, etc.)
- \`threads/\` — cached summaries of Slack threads and email conversations
- \`templates/\` — response templates per channel and entity
- \`system/\` — global rules: voice governance, channel norms, escalation policies

**Key design principle:** Every lookup Claude needs should resolve in one hop using a URI it can construct from information already in the incoming message. If Claude has to do a directory listing to find a file, the structure is wrong.

---

## Q: What is the YAML frontmatter schema and why is it critical for AI-readable vault files?

**Lead with:** YAML frontmatter is structured metadata at the top of each markdown file — the machine-readable index.

**Why it matters:** Claude cannot efficiently scan hundreds of files' prose content. But it can read frontmatter fields to quickly determine relevance.

**Example deal file frontmatter:**
\`\`\`yaml
---
deal_id: DEAL-2847
client: Acme Corp
client_file: clients/AcmeCorp/profile.md
stage: proposal
owner: Jane
value: 45000
last_contact: 2026-03-10
slack_channel: C04ABC123
ghl_contact_id: ghl_12345
---
\`\`\`

When a Slack message mentions deal DEAL-2847, Claude reads that one file's frontmatter and immediately knows the client, stage, last contact, and GHL record — without reading the full body.

**Critical requirement:** Every deal file must have the same frontmatter schema. Inconsistency breaks Claude's prompts.

---

## Q: What is an MCP resource URI and how do you design a URI scheme for an Obsidian vault?

**Lead with:** A resource URI is the address of a readable data source exposed by an MCP server.

**URI structure:** \`scheme://authority/path\`

**Obsidian vault scheme:**
- \`obsidian://second-brain/deals/DEAL-2847\`
- \`obsidian://second-brain/clients/AcmeCorp/profile\`
- \`obsidian://second-brain/system/voice-governance\`

**Key requirement:** The URI scheme must be **deterministic** — Claude can construct the URI from data it already has in the message, without a discovery call first. This is why deal ID is the primary key: it appears in the Slack thread subject, maps directly to a filename, and resolves to a URI in zero additional lookups.

---

## Q: How does Claude retrieve Obsidian context before drafting a reply — step by step?

**The sequence:**
1. BullMQ worker picks up a job with deal ID, client name, entity ID, channel type
2. Worker constructs MCP resource URIs for four context sources: deal file, client profile, entity voice config, voice governance rules
3. Parallel batch read of all four resources through the Obsidian MCP server
4. Combined text assembled into structured prompt with labelled sections: brand foundation, entity voice, channel norms, relationship context, thread context
5. Prompt sent to Claude Code with original message appended and task instruction
6. Claude returns the draft
7. Worker posts draft back to Missive or Slack

**Critical detail:** At no point does Claude decide what context to retrieve — the worker hardcodes the retrieval pattern based on the job type.

---

## Q: How does Claude's memory persist across sessions in this architecture?

**Lead with:** It doesn't persist in Claude's model weights — it persists in the Obsidian vault.

**Write-back loop:** After each significant interaction, the worker writes a summary back to the vault:
- Appends to client's communication log
- Updates deal file's \`last_contact\` date
- Creates or updates a thread summary file

The next time a message arrives for the same deal, Claude reads the updated vault files and has full context — not because it remembers, but because information was written to structured storage and read back through MCP.

**This is the "Second Brain" concept:** The vault is the externalised, persistent memory that makes Claude appear to have continuity.
`,
      starterCode: `// Exercise: Build an Obsidian MCP resource URI resolver
// and a context assembly pipeline.

interface DealFrontmatter {
  deal_id: string;
  client: string;
  client_file: string;
  stage: string;
  owner: string;
  value: number;
  last_contact: string;
  slack_channel: string;
  ghl_contact_id: string;
}

interface JobPayload {
  dealId: string;
  clientName: string;
  entityId: string;
  channelType: "slack" | "email" | "sms";
  messageBody: string;
}

const VAULT_NAME = "second-brain";

// TODO: Construct the four MCP resource URIs needed for context
function buildContextURIs(job: JobPayload): {
  deal: string;
  client: string;
  entityVoice: string;
  governance: string;
} {
  // Your code here — use the obsidian:// scheme
}

// TODO: Parse YAML frontmatter from a markdown string
function parseFrontmatter(markdown: string): Record<string, any> {
  // Your code here — extract between --- delimiters
}

// TODO: Assemble the structured prompt from four context documents
function assemblePrompt(
  dealContent: string,
  clientContent: string,
  voiceContent: string,
  governanceContent: string,
  originalMessage: string,
  channelType: string
): string {
  // Your code here — create labelled sections
}

// Test
const job: JobPayload = {
  dealId: "DEAL-2847",
  clientName: "AcmeCorp",
  entityId: "entity-3",
  channelType: "email",
  messageBody: "Following up on our proposal discussion last week...",
};

const uris = buildContextURIs(job);
console.log("URIs:", uris);

const testMarkdown = \`---
deal_id: DEAL-2847
client: Acme Corp
stage: proposal
value: 45000
---
# Deal Notes
Sent proposal on March 5th.\`;

console.log("\\nFrontmatter:", parseFrontmatter(testMarkdown));`,
      solutionCode: `interface DealFrontmatter {
  deal_id: string;
  client: string;
  client_file: string;
  stage: string;
  owner: string;
  value: number;
  last_contact: string;
  slack_channel: string;
  ghl_contact_id: string;
}

interface JobPayload {
  dealId: string;
  clientName: string;
  entityId: string;
  channelType: "slack" | "email" | "sms";
  messageBody: string;
}

const VAULT_NAME = "second-brain";

function buildContextURIs(job: JobPayload): {
  deal: string;
  client: string;
  entityVoice: string;
  governance: string;
} {
  return {
    deal: \`obsidian://\${VAULT_NAME}/deals/\${job.dealId}\`,
    client: \`obsidian://\${VAULT_NAME}/clients/\${job.clientName}/profile\`,
    entityVoice: \`obsidian://\${VAULT_NAME}/entities/\${job.entityId}/voice\`,
    governance: \`obsidian://\${VAULT_NAME}/system/voice-governance\`,
  };
}

function parseFrontmatter(markdown: string): Record<string, any> {
  const match = markdown.match(/^---\\n([\\s\\S]*?)\\n---/);
  if (!match) return {};

  const result: Record<string, any> = {};
  const lines = match[1].split("\\n");
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: any = line.slice(colonIdx + 1).trim();
    // Try to parse numbers
    if (!isNaN(Number(value)) && value !== "") value = Number(value);
    result[key] = value;
  }
  return result;
}

function assemblePrompt(
  dealContent: string,
  clientContent: string,
  voiceContent: string,
  governanceContent: string,
  originalMessage: string,
  channelType: string
): string {
  return \`## BRAND FOUNDATION & VOICE GOVERNANCE
\${governanceContent}

## ENTITY VOICE CONFIGURATION
\${voiceContent}

## CHANNEL NORMS
Channel: \${channelType}
\${channelType === "email" ? "Formal, 2-4 paragraphs, professional sign-off." :
  channelType === "slack" ? "Conversational, concise, emoji acceptable." :
  "Brief, 1-2 sentences max."}

## RELATIONSHIP CONTEXT — CLIENT PROFILE
\${clientContent}

## DEAL CONTEXT
\${dealContent}

## ORIGINAL MESSAGE
\${originalMessage}

## TASK
Draft a reply to the original message using the context above. Match the entity voice, follow governance rules, and adapt to the channel norms.\`;
}

// Test
const job: JobPayload = {
  dealId: "DEAL-2847",
  clientName: "AcmeCorp",
  entityId: "entity-3",
  channelType: "email",
  messageBody: "Following up on our proposal discussion last week...",
};

const uris = buildContextURIs(job);
console.log("URIs:", uris);

const testMarkdown = \`---
deal_id: DEAL-2847
client: Acme Corp
stage: proposal
value: 45000
---
# Deal Notes
Sent proposal on March 5th.\`;

console.log("\\nFrontmatter:", parseFrontmatter(testMarkdown));`,
    },
    {
      id: "interview-qa-5",
      slug: "slack-missive-integration-qa",
      title: "Slack & Missive Integration — Interview Q&A",
      content: `# Slack & Missive Integration — Interview Q&A

---

## Q: How does the Slack-to-Missive bridge work at the transport and protocol level?

**Lead with:** Slack sends HTTP POST via Events API → your bridge validates, acknowledges within 3 seconds, and enqueues a BullMQ job.

**Full flow:**
1. Message posted in monitored Slack channel
2. Slack sends HTTP POST to your webhook endpoint
3. Bridge validates HMAC-SHA256 signature using Slack signing secret
4. Bridge returns 200 OK immediately (Slack requires response within 3 seconds)
5. Bridge enqueues BullMQ job with message payload
6. Worker picks up job, reads Obsidian context, calls Missive API to create conversation

**Bidirectional threading:** Store \`thread_ts\` (Slack thread timestamp) in Missive conversation metadata. When a Missive reply is sent → Missive webhook fires → bridge reads \`thread_ts\` → posts reply into the original Slack thread.

---

## Q: What is the Slack signing secret and how do you validate a webhook request?

**Lead with:** A shared secret between your app and Slack used to verify that requests genuinely come from Slack.

**Validation steps:**
1. Construct signature base: \`v0:\` + timestamp header + \`:\` + raw request body
2. Compute HMAC-SHA256 of that string using your signing secret
3. Compare to the signature in the request header (constant-time comparison to prevent timing attacks)
4. Check timestamp is within 5 minutes of current time (prevents replay attacks)

---

## Q: How do you handle Slack's retry behaviour when your webhook endpoint is slow?

**Lead with:** Acknowledge immediately and process asynchronously.

**The problem:** Slack retries if it doesn't receive a 200 within 3 seconds, up to 3 times with increasing delays.

**The solution:**
1. Webhook handler validates request → enqueues BullMQ job → returns 200
2. All actual processing happens in the async worker
3. Redis SETNX deduplication catches any retried deliveries

If you try to do Obsidian lookup + Claude call + Missive API all within 3 seconds, you will time out and receive duplicates.

---

## Q: How do you handle a Slack message mentioning a deal that doesn't exist in the vault?

**Lead with:** Graceful degradation — never a hard failure.

**Strategy:**
1. If Obsidian resource read returns not-found → proceed with reduced context (client profile + voice governance only)
2. Flag the draft in Missive noting the deal file was not found
3. Create a **stub deal file** in the vault with deal ID, timestamp, and Slack channel ID as frontmatter

The stub ensures the next message for that deal ID finds a file. Incomplete context produces a weaker draft; no draft at all is a worse outcome.

---

## Q: Describe the full end-to-end flow when a new email arrives in Missive.

**Seven stages:**
1. Missive sends HTTP POST webhook → Express handler validates HMAC-SHA256 using **raw request body** → returns 200
2. Redis SETNX with event ID (24-hour TTL) — if exists, discard duplicate
3. Extract deal ID from subject/body via regex + conversation ID, sender, entity routing info → enqueue BullMQ job
4. Worker picks up job → parallel batch read of 4 Obsidian resources (deal, client, entity voice, governance)
5. Check circuit breaker — if open, skip to fallback; if closed/half-open, proceed
6. Send structured prompt to Claude Code → receive draft reply
7. Call Missive API to create draft on conversation → appears for human review

---

## Q: Why does Missive webhook validation require the raw request body rather than parsed JSON?

**Lead with:** HMAC-SHA256 is computed over a byte sequence. Parsed-and-re-serialised JSON may differ from the original bytes.

**The bug:** Express auto-parses JSON, discards original bytes. \`JSON.stringify()\` doesn't guarantee same key ordering, whitespace, or encoding. The signature Missive computed was over the original bytes — your HMAC must be over those same bytes.

**Fix:** Configure Express to provide the raw buffer to your webhook handler before JSON parsing. This is one of the most common webhook implementation bugs.

---

## Q: How do you use Redis SETNX for webhook deduplication?

**Lead with:** SETNX (Set if Not Exists) is atomic — safe for deduplication even under concurrent access.

**How it works:**
- Key = event ID from webhook payload
- TTL = 24 hours (prevents unbounded Redis growth)
- If SETNX returns "set" → first time, process the event
- If SETNX returns "already exists" → duplicate, discard

**Why not GET then SET?** Race condition: two processes could both find the key absent, both proceed, both process the same event. SETNX eliminates this with a single atomic step.

---

## Q: What is the fallback when the Claude circuit breaker is open?

**Lead with:** Post a pre-written generic acknowledgement draft to Missive.

**Example:** "Thank you for your message. We will follow up within one business day."

**Key details:**
- Draft is tagged with metadata indicating it's a fallback (not personalised)
- Human reviewer in Missive knows to write a proper reply
- Preferable to blocking (delays all responses) or exhausting retries (no draft for hours)
- The fallback produces a safe, low-risk output immediately while the circuit breaker gives Claude time to recover

---

## Q: How does entity routing work across seven business entities?

**Lead with:** Routing happens at BullMQ job creation, before the Obsidian lookup.

**Routing signals:**
- Missive inbox or label (each entity has a dedicated shared label)
- Email domain of sender/recipient
- Keywords in subject line
- Explicit conversation tags

The worker looks up the entity configuration from the Obsidian \`system/\` folder. The entity map defines which signals → which entity IDs. All subsequent Obsidian reads use that entity ID for the correct voice configuration.

**Result:** Voice, tone, sign-off, and escalation rules are all entity-specific without any hardcoding in the worker.
`,
      starterCode: `// Exercise: Implement webhook validation and Redis deduplication

// TODO: Validate a Slack webhook request
function validateSlackWebhook(
  rawBody: string,
  timestamp: string,
  signature: string,
  signingSecret: string
): { valid: boolean; reason?: string } {
  // Your code here:
  // 1. Check timestamp is within 5 minutes
  // 2. Construct signature base string: "v0:" + timestamp + ":" + rawBody
  // 3. Compute HMAC-SHA256
  // 4. Compare signatures (constant-time)
}

// TODO: Implement Redis SETNX deduplication (simulated)
class RedisDedup {
  private store = new Map<string, number>(); // key -> expiry timestamp

  // TODO: Returns true if this is a NEW event, false if duplicate
  checkAndSet(eventId: string, ttlMs: number = 86400000): boolean {
    // Your code here — simulate SETNX with TTL
  }

  // Clean expired keys (call periodically)
  cleanup(): void {
    const now = Date.now();
    for (const [key, expiry] of this.store) {
      if (now > expiry) this.store.delete(key);
    }
  }
}

// TODO: Implement the webhook handler logic
function handleMissiveWebhook(
  rawBody: string,
  eventId: string,
  dedup: RedisDedup
): { action: "process" | "discard" | "reject"; reason: string } {
  // Your code here:
  // 1. Check dedup
  // 2. Parse the body
  // 3. Extract deal ID
  // 4. Return action
}

// Test
const dedup = new RedisDedup();

console.log("First event:", dedup.checkAndSet("evt_001")); // true
console.log("Same event:", dedup.checkAndSet("evt_001")); // false
console.log("New event:", dedup.checkAndSet("evt_002")); // true

const result = handleMissiveWebhook(
  JSON.stringify({ event_id: "evt_003", conversation: { subject: "Re: DEAL-2847 Proposal" } }),
  "evt_003",
  dedup
);
console.log("\\nWebhook result:", result);`,
      solutionCode: `const crypto = require("crypto");

function validateSlackWebhook(
  rawBody: string,
  timestamp: string,
  signature: string,
  signingSecret: string
): { valid: boolean; reason?: string } {
  // Check timestamp freshness (5 minute window)
  const now = Math.floor(Date.now() / 1000);
  const ts = parseInt(timestamp, 10);
  if (Math.abs(now - ts) > 300) {
    return { valid: false, reason: "Timestamp too old — possible replay attack" };
  }

  // Construct signature base string
  const sigBase = \`v0:\${timestamp}:\${rawBody}\`;

  // Compute HMAC-SHA256
  const computed = "v0=" + crypto
    .createHmac("sha256", signingSecret)
    .update(sigBase)
    .digest("hex");

  // Constant-time comparison
  try {
    const isValid = crypto.timingSafeEqual(
      Buffer.from(computed),
      Buffer.from(signature)
    );
    return isValid
      ? { valid: true }
      : { valid: false, reason: "Signature mismatch" };
  } catch {
    return { valid: false, reason: "Signature length mismatch" };
  }
}

class RedisDedup {
  private store = new Map<string, number>();

  checkAndSet(eventId: string, ttlMs: number = 86400000): boolean {
    this.cleanup(); // Clean expired first
    const existing = this.store.get(eventId);
    if (existing && Date.now() < existing) {
      return false; // Duplicate — already exists
    }
    // SETNX equivalent: set with expiry
    this.store.set(eventId, Date.now() + ttlMs);
    return true; // New event
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, expiry] of this.store) {
      if (now > expiry) this.store.delete(key);
    }
  }
}

function handleMissiveWebhook(
  rawBody: string,
  eventId: string,
  dedup: RedisDedup
): { action: "process" | "discard" | "reject"; reason: string } {
  // Step 1: Dedup check
  const isNew = dedup.checkAndSet(eventId);
  if (!isNew) {
    return { action: "discard", reason: "Duplicate event — already processed" };
  }

  // Step 2: Parse body
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return { action: "reject", reason: "Invalid JSON body" };
  }

  // Step 3: Extract deal ID from subject
  const subject = payload.conversation?.subject || "";
  const dealMatch = subject.match(/DEAL-\\d+/);
  const dealId = dealMatch ? dealMatch[0] : null;

  return {
    action: "process",
    reason: dealId
      ? \`Processing event \${eventId} for deal \${dealId}\`
      : \`Processing event \${eventId} — no deal ID found, will use reduced context\`,
  };
}

// Test
const dedup = new RedisDedup();

console.log("First event:", dedup.checkAndSet("evt_001"));
console.log("Same event:", dedup.checkAndSet("evt_001"));
console.log("New event:", dedup.checkAndSet("evt_002"));

const result = handleMissiveWebhook(
  JSON.stringify({ event_id: "evt_003", conversation: { subject: "Re: DEAL-2847 Proposal" } }),
  "evt_003",
  dedup
);
console.log("\\nWebhook result:", result);`,
    },
    {
      id: "interview-qa-6",
      slug: "claude-code-orchestration-qa",
      title: "Claude Code Orchestration — Interview Q&A",
      content: `# Claude Code as the Orchestration Layer — Interview Q&A

---

## Q: What is Claude Code's role in this architecture — is it a language model, an orchestrator, or both?

**Lead with:** Claude Code is both the orchestration layer and the reasoning engine simultaneously.

**As orchestrator:** It decides which MCP tools to call, in what order, and with what parameters.

**As reasoning engine:** It interprets results, synthesises context from MCP resources, and produces output (drafts, analyses, action plans).

**Key distinction from raw API:** Claude Code runs as a CLI agent with persistent MCP server connections, a working directory context, and multi-step autonomous planning. It's what connects an incoming Slack message → Obsidian context → GoHighLevel lookup → final draft back to Missive.

---

## Q: How does Claude Code discover and call tools from multiple MCP servers simultaneously?

**Lead with:** Claude Code builds a unified tool registry — a flat namespace — from all connected servers at startup.

**How it works:**
1. At startup, discovery handshake with every configured MCP server
2. All tools from all servers merged into one flat namespace
3. When Claude selects a tool, the MCP client layer routes the call to the correct server transparently
4. Claude doesn't know which server owns which tool — it just calls by name

**Design implication:** Tool names must be globally unique across all servers since they share a flat namespace. \`ghl_search_contacts\` and \`obsidian_read_note\` live on different servers but coexist in one registry.

---

## Q: What is a Claude Code skill and how does it differ from an MCP tool?

**Lead with:** A skill is markdown instructions. A tool is executable code.

**Skill:** A markdown file (\`CLAUDE.md\` or in \`.claude/\`) containing prose instructions telling Claude how to behave or perform tasks. Not executable — it's behavioural rules Claude reads and internalises.

**Tool:** An executable function registered on an MCP server that Claude can invoke and that returns a result.

**The relationship:** Skills tell Claude *when* and *how* to use tools. The draft-reply skill might instruct Claude to always read the deal resource before drafting, never use first person singular, and limit drafts to three paragraphs. The GoHighLevel tools give Claude the *capability* to look up contacts. The skill governs the *decision-making* around that capability.

---

## Q: How do you prevent Claude from taking destructive actions autonomously in an agentic pipeline?

**Lead with:** Tool design — you only expose tools that match the autonomy level you're comfortable with.

**Four layers of protection:**

1. **Tool scoping:** Don't expose \`ghl_delete_contact\` — Claude can't call what isn't registered
2. **Human-in-the-loop:** Claude creates drafts, humans approve and send. The draft step is the safety gate
3. **Explicit confirmation:** For irreversible writes (updating deal stage, sending email), require human confirmation
4. **Resource vs tool distinction:** Exposing data as a read-only resource (not a tool) prevents accidental write paths

**Principle:** Claude proposes; humans approve.

---

## Q: How does the 6-layer voice governance system constrain Claude's output?

**The six layers (most general → most specific):**

| Layer | Name | What It Controls |
|-------|------|-----------------|
| 1 | Brand Foundation | Company-wide values, things never said, core identity |
| 2 | Entity Voice | Specific tone/personality for each of 7 entities |
| 3 | Channel Norms | Email vs Slack vs SMS formatting, length, formality |
| 4 | Relationship Stage | New prospect vs long-term client communication style |
| 5 | Thread Context | Specific conversation history, deal stage, last thing said |
| 6 | Override | One-time human instruction for this specific reply |

**Conflict resolution:** More specific layers override more general ones. Layer 6 (human override) always wins. If entity voice says "be formal" but relationship stage says "this is a long-term informal client," the relationship stage wins.

Claude reads all six layers as MCP resources before generating output.
`,
      starterCode: `// Exercise: Implement a unified tool registry and voice governance resolver

interface McpTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  serverId: string;
}

// TODO: Build a unified tool registry from multiple servers
class ToolRegistry {
  private tools = new Map<string, McpTool>();

  // TODO: Register tools from a server. Throw if name conflict.
  registerServer(serverId: string, tools: Omit<McpTool, "serverId">[]): void {
    // Your code here
  }

  // TODO: Look up a tool and return which server owns it
  resolve(toolName: string): { tool: McpTool; serverId: string } | null {
    // Your code here
  }

  // List all available tools
  listAll(): string[] {
    return Array.from(this.tools.keys());
  }
}

// Voice governance layers (most general → most specific)
interface VoiceLayer {
  priority: number; // 1 = lowest (brand), 6 = highest (override)
  name: string;
  rules: Record<string, string>;
}

// TODO: Resolve conflicting voice rules across layers
// Higher priority layers override lower ones
function resolveVoiceRules(layers: VoiceLayer[]): Record<string, string> {
  // Your code here
}

// Test tool registry
const registry = new ToolRegistry();
registry.registerServer("obsidian-mcp", [
  { name: "obsidian_read_note", description: "Read a vault file", inputSchema: { uri: "string" } },
  { name: "obsidian_write_note", description: "Write a vault file", inputSchema: { uri: "string", content: "string" } },
]);
registry.registerServer("ghl-mcp", [
  { name: "ghl_search_contacts", description: "Search CRM contacts", inputSchema: { query: "string" } },
  { name: "ghl_get_deal", description: "Get deal details", inputSchema: { dealId: "string" } },
]);

console.log("All tools:", registry.listAll());
console.log("Resolve ghl_search_contacts:", registry.resolve("ghl_search_contacts"));

// Test voice governance
const layers: VoiceLayer[] = [
  { priority: 1, name: "Brand Foundation", rules: { tone: "professional", signoff: "Best regards", emoji: "never" } },
  { priority: 2, name: "Entity Voice", rules: { tone: "warm and approachable", personality: "friendly expert" } },
  { priority: 3, name: "Channel Norms", rules: { length: "2-4 paragraphs", emoji: "sparingly" } },
  { priority: 4, name: "Relationship", rules: { tone: "casual and familiar" } },
  { priority: 6, name: "Override", rules: { signoff: "Cheers" } },
];

console.log("\\nResolved voice rules:", resolveVoiceRules(layers));`,
      solutionCode: `interface McpTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  serverId: string;
}

class ToolRegistry {
  private tools = new Map<string, McpTool>();

  registerServer(serverId: string, tools: Omit<McpTool, "serverId">[]): void {
    for (const tool of tools) {
      if (this.tools.has(tool.name)) {
        const existing = this.tools.get(tool.name)!;
        throw new Error(
          \`Tool name conflict: "\${tool.name}" already registered by server "\${existing.serverId}"\`
        );
      }
      this.tools.set(tool.name, { ...tool, serverId });
    }
  }

  resolve(toolName: string): { tool: McpTool; serverId: string } | null {
    const tool = this.tools.get(toolName);
    if (!tool) return null;
    return { tool, serverId: tool.serverId };
  }

  listAll(): string[] {
    return Array.from(this.tools.keys());
  }
}

interface VoiceLayer {
  priority: number;
  name: string;
  rules: Record<string, string>;
}

function resolveVoiceRules(layers: VoiceLayer[]): Record<string, string> {
  // Sort by priority ascending — lower priority first, higher overrides
  const sorted = [...layers].sort((a, b) => a.priority - b.priority);
  const resolved: Record<string, string> = {};

  for (const layer of sorted) {
    for (const [key, value] of Object.entries(layer.rules)) {
      resolved[key] = value; // Higher priority overwrites lower
    }
  }

  return resolved;
}

// Test tool registry
const registry = new ToolRegistry();
registry.registerServer("obsidian-mcp", [
  { name: "obsidian_read_note", description: "Read a vault file", inputSchema: { uri: "string" } },
  { name: "obsidian_write_note", description: "Write a vault file", inputSchema: { uri: "string", content: "string" } },
]);
registry.registerServer("ghl-mcp", [
  { name: "ghl_search_contacts", description: "Search CRM contacts", inputSchema: { query: "string" } },
  { name: "ghl_get_deal", description: "Get deal details", inputSchema: { dealId: "string" } },
]);

console.log("All tools:", registry.listAll());
console.log("Resolve ghl_search_contacts:", registry.resolve("ghl_search_contacts"));

// Test voice governance
const layers: VoiceLayer[] = [
  { priority: 1, name: "Brand Foundation", rules: { tone: "professional", signoff: "Best regards", emoji: "never" } },
  { priority: 2, name: "Entity Voice", rules: { tone: "warm and approachable", personality: "friendly expert" } },
  { priority: 3, name: "Channel Norms", rules: { length: "2-4 paragraphs", emoji: "sparingly" } },
  { priority: 4, name: "Relationship", rules: { tone: "casual and familiar" } },
  { priority: 6, name: "Override", rules: { signoff: "Cheers" } },
];

console.log("\\nResolved voice rules:", resolveVoiceRules(layers));
// Expected: tone="casual and familiar", signoff="Cheers", emoji="sparingly",
//           personality="friendly expert", length="2-4 paragraphs"`,
    },
    {
      id: "interview-qa-7",
      slug: "operations-interview-traps-qa",
      title: "Operations & Interview Traps — Interview Q&A",
      content: `# Operations, Deployment & Interview Traps — Interview Q&A

---

## Q: How would you deploy the full codeswitcher MCP stack to a VPS for 24/7 operation?

**Four deployment layers:**

1. **Runtime environment:** Ubuntu 22.04 VPS, Node.js 20 LTS, Redis, Nginx
2. **Process management:** PM2 manages all Node.js processes (webhook bridge, BullMQ worker, MCP servers). Configured for crash restart with exponential backoff. Integrated with systemd for server reboots
3. **MCP transport:** If Claude Code runs on same VPS → stdio. If Claude Code connects remotely → SSE or HTTP Streamable
4. **Observability:** PM2 logs shipped to centralised store, \`/health\` endpoints polled every 60 seconds, failures trigger Slack alert

---

## Q: How does the heartbeat agent work?

**Lead with:** Lightweight process (cron or PM2) that periodically calls \`/health\` on each service.

**What each health endpoint reports:**
- Can reach Redis?
- MCP server connection established?
- Circuit breaker state (closed/open/half-open)?
- Timestamp of last successful job

**Alerting:** Two consecutive unhealthy checks → Slack alert. Two checks (not one) to avoid false positives from transient network blips.

**Why it matters:** Solo-operated system where no one watches a dashboard 24/7 — alerts pull attention only when genuinely needed.

---

## Q: How do you handle secret rotation without downtime?

**Lead with:** Grace period window where both old and new secrets are accepted.

**Strategy:**
1. When Missive/Slack rotates the webhook secret, implement dual-secret validation
2. Try new secret first, fall back to old secret — if either matches, request is valid
3. After 24-48 hours (all traffic confirmed on new secret), remove old secret
4. Use \`pm2 reload\` (graceful rolling restart) not \`pm2 restart\` for zero-downtime config change

---

## Q: What observability would you add to debug a silent failure where drafts stop being generated?

**Four layers:**

1. **Job lifecycle events:** Log every BullMQ state transition (waiting → active → completed → failed → stalled) with job ID, deal ID, and timestamp
2. **Stall detector:** BullMQ marks a job as stalled if worker picks it up but never completes/fails it. Indicates the worker process died mid-execution
3. **DLQ monitor:** Any job in the dead letter queue → immediate alert with full payload and error
4. **Business-level metric:** Track Missive drafts created per hour. Alert if it drops below threshold. Catches cases where jobs complete in BullMQ but the Missive API call silently fails

---

# COMMON INTERVIEW TRAPS

---

## Q: Why not just call Claude's API directly from the webhook handler?

**Three reasons — hit all three:**

1. **Latency:** Claude takes 5-30 seconds. Missive/Slack require webhook acknowledgement within 3-5 seconds. Synchronous = timeout.
2. **Reliability:** If Claude's API is down, synchronous = every message fails with no retry. BullMQ decouples receipt from processing with automatic retries.
3. **Context assembly:** Before calling Claude you need Obsidian reads, GHL lookups, prompt assembly. This orchestration belongs in a worker, not a webhook handler. MCP makes context retrieval structured and reusable.

---

## Q: Could you use a vector database like Pinecone instead of Obsidian?

**Lead with:** You could, but it would be the wrong choice for this system.

**Why not:**
- Vector DBs are for **semantic similarity search** — "find conceptually related content" when you don't know which documents you need
- In codeswitcher, you **always know** which documents you need: deal DEAL-2847, entity 3 voice, governance rules → direct lookups by known key
- Obsidian files are human-readable and human-editable — a non-technical operator can update client profiles with a text editor
- Vector DB requires re-embedding on every change and can't be edited with a text editor

**When to add vectors:** If the vault grows beyond a few thousand files and Claude needs to semantically search the entire corpus.

---

## Q: What is the difference between an MCP notification and a resource subscription?

**Notification:** Fire-and-forget message from server to client. No \`id\` field, no response expected. Example: \`notifications/tools/list_changed\` tells Claude Code to re-run \`tools/list\`.

**Resource subscription:** Higher-level capability built on notifications. Client subscribes to a specific resource URI → server sends \`notifications/resources/updated\` when content changes.

**Codeswitcher use case:** If a human edits the voice governance document in Obsidian mid-session, a resource subscription lets Claude Code refresh automatically without restarting. Requires both sides to declare subscription capability during initialize handshake.

---

## Q: If you had to explain MCP to a non-technical client, how would you describe it?

> "MCP is the universal adapter that lets Claude plug into any tool or data source. Think of Claude's brain as a laptop — powerful but it needs cables to connect to things. Before MCP, every cable was custom. MCP is like USB — one standard port that any device can plug into. We build USB devices, plug them all into Claude's USB hub, and when you want to add a new tool in the future, it's one more USB device — not a whole new custom cable."

---

# QUICK-FIRE REFERENCE

| Term | Definition |
|------|-----------|
| **stdio** | Standard input/output — default Unix streams for inter-process communication |
| **SETNX** | Redis "set if not exists" — atomic, used for distributed locks and deduplication |
| **HMAC** | Hash-based Message Authentication Code — shared secret for signing + verifying messages |
| **thread_ts** | Slack thread parent timestamp — unique thread identifier for posting replies |
| **conversation_id** | Missive conversation unique identifier — required for all API operations |
| **Default local transport** | stdio |
| **Initialize handshake** | Client sends \`initialize\` → server responds → client sends \`initialized\`. No calls before this |
| **Batch response ordering** | Not guaranteed — always match by \`id\`, never by array index |
| **Half-open** | Circuit breaker probe state after cooldown — one test request allowed through |
| **BullMQ worker** | Process that listens for jobs, executes handler, reports completion or failure |
`,
      starterCode: `// Exercise: Build a health check system with heartbeat monitoring

interface ServiceHealth {
  name: string;
  healthy: boolean;
  redis: boolean;
  mcpConnected: boolean;
  circuitBreaker: "closed" | "open" | "half-open";
  lastSuccessfulJob: number; // timestamp
}

// TODO: Implement the health endpoint response generator
function generateHealthResponse(
  redisOk: boolean,
  mcpConnected: boolean,
  breakerState: "closed" | "open" | "half-open",
  lastJobTimestamp: number
): { status: number; body: ServiceHealth } {
  // Your code here
  // - 200 if all checks pass
  // - 503 if any critical check fails
  // - Include all diagnostics in body
}

// TODO: Implement heartbeat monitor that tracks consecutive failures
class HeartbeatMonitor {
  private consecutiveFailures = new Map<string, number>();

  // TODO: Check a service health and track failures
  // Return alert message if 2+ consecutive failures
  checkService(serviceName: string, health: ServiceHealth): string | null {
    // Your code here
  }

  // TODO: Generate summary of all monitored services
  getSummary(): { healthy: string[]; unhealthy: string[] } {
    // Your code here
  }
}

// TODO: Explain why calling Claude directly from webhook is wrong
// Return the three reasons as structured data
function whyNotDirectApiCall(): { reason: string; explanation: string }[] {
  // Your code here
}

// Test
const health1 = generateHealthResponse(true, true, "closed", Date.now());
console.log("Healthy service:", health1.status, health1.body);

const health2 = generateHealthResponse(false, true, "open", Date.now() - 3600000);
console.log("Unhealthy service:", health2.status, health2.body);

const monitor = new HeartbeatMonitor();
const alert1 = monitor.checkService("webhook-bridge", { ...health1.body, name: "webhook-bridge" });
console.log("\\nFirst check (healthy):", alert1);

const alert2 = monitor.checkService("worker", { name: "worker", healthy: false, redis: false, mcpConnected: true, circuitBreaker: "open", lastSuccessfulJob: Date.now() - 7200000 });
console.log("Second check (unhealthy):", alert2);

const alert3 = monitor.checkService("worker", { name: "worker", healthy: false, redis: false, mcpConnected: true, circuitBreaker: "open", lastSuccessfulJob: Date.now() - 7200000 });
console.log("Third check (still unhealthy):", alert3);

console.log("\\nMonitor summary:", monitor.getSummary());
console.log("\\nWhy not direct API call:", whyNotDirectApiCall());`,
      solutionCode: `interface ServiceHealth {
  name: string;
  healthy: boolean;
  redis: boolean;
  mcpConnected: boolean;
  circuitBreaker: "closed" | "open" | "half-open";
  lastSuccessfulJob: number;
}

function generateHealthResponse(
  redisOk: boolean,
  mcpConnected: boolean,
  breakerState: "closed" | "open" | "half-open",
  lastJobTimestamp: number
): { status: number; body: ServiceHealth } {
  const healthy = redisOk && mcpConnected && breakerState !== "open";

  return {
    status: healthy ? 200 : 503,
    body: {
      name: "mcp-worker",
      healthy,
      redis: redisOk,
      mcpConnected,
      circuitBreaker: breakerState,
      lastSuccessfulJob: lastJobTimestamp,
    },
  };
}

class HeartbeatMonitor {
  private consecutiveFailures = new Map<string, number>();
  private knownServices = new Set<string>();

  checkService(serviceName: string, health: ServiceHealth): string | null {
    this.knownServices.add(serviceName);

    if (health.healthy) {
      this.consecutiveFailures.set(serviceName, 0);
      return null;
    }

    const current = (this.consecutiveFailures.get(serviceName) || 0) + 1;
    this.consecutiveFailures.set(serviceName, current);

    if (current >= 2) {
      const issues: string[] = [];
      if (!health.redis) issues.push("Redis unreachable");
      if (!health.mcpConnected) issues.push("MCP disconnected");
      if (health.circuitBreaker === "open") issues.push("Circuit breaker OPEN");

      return \`ALERT: \${serviceName} unhealthy for \${current} consecutive checks. Issues: \${issues.join(", ")}\`;
    }

    return null; // First failure — wait for second check
  }

  getSummary(): { healthy: string[]; unhealthy: string[] } {
    const healthy: string[] = [];
    const unhealthy: string[] = [];

    for (const name of this.knownServices) {
      const failures = this.consecutiveFailures.get(name) || 0;
      if (failures >= 2) {
        unhealthy.push(name);
      } else {
        healthy.push(name);
      }
    }

    return { healthy, unhealthy };
  }
}

function whyNotDirectApiCall(): { reason: string; explanation: string }[] {
  return [
    {
      reason: "Latency",
      explanation: "Claude takes 5-30 seconds. Missive/Slack require webhook acknowledgement within 3-5 seconds. Synchronous call = timeout and retries.",
    },
    {
      reason: "Reliability",
      explanation: "If Claude's API is down, every incoming message fails with no retry capability. BullMQ decouples receipt from processing with automatic retries and backoff.",
    },
    {
      reason: "Context Assembly",
      explanation: "Before calling Claude you need Obsidian reads, GHL lookups, and prompt assembly. This orchestration belongs in a worker, not a webhook handler. MCP makes retrieval structured and reusable.",
    },
  ];
}

// Test
const health1 = generateHealthResponse(true, true, "closed", Date.now());
console.log("Healthy service:", health1.status, health1.body);

const health2 = generateHealthResponse(false, true, "open", Date.now() - 3600000);
console.log("Unhealthy service:", health2.status, health2.body);

const monitor = new HeartbeatMonitor();
const alert1 = monitor.checkService("webhook-bridge", { ...health1.body, name: "webhook-bridge" });
console.log("\\nFirst check (healthy):", alert1);

const alert2 = monitor.checkService("worker", { name: "worker", healthy: false, redis: false, mcpConnected: true, circuitBreaker: "open", lastSuccessfulJob: Date.now() - 7200000 });
console.log("Second check (unhealthy):", alert2);

const alert3 = monitor.checkService("worker", { name: "worker", healthy: false, redis: false, mcpConnected: true, circuitBreaker: "open", lastSuccessfulJob: Date.now() - 7200000 });
console.log("Third check (still unhealthy):", alert3);

console.log("\\nMonitor summary:", monitor.getSummary());
console.log("\\nWhy not direct API call:", whyNotDirectApiCall());`,
    },
  ],
};
