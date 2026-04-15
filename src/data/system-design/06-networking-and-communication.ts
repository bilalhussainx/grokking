import { Module } from "../types";

export const networkingAndCommunicationModule: Module = {
  id: "networking-and-communication",
  title: "Networking & Communication Protocols",
  description: "Master the communication patterns that connect distributed components: synchronous APIs, asynchronous queues, and real-time protocols.",
  lessons: [
    {
      id: "rest-vs-grpc-vs-graphql",
      slug: "rest-vs-grpc-vs-graphql",
      title: "REST vs gRPC vs GraphQL",
      content: `# REST vs gRPC vs GraphQL

Every distributed system faces the same fundamental question: *how do components talk to each other?* The API style you choose shapes latency, developer experience, payload size, and even team autonomy.

Three paradigms dominate production architectures in 2026:

- **REST** — resource-oriented, HTTP/1.1, the universal default
- **GraphQL** — client-driven queries, single endpoint, eliminates over-fetching
- **gRPC** — binary protocol over HTTP/2, built for machine-to-machine speed

The wrong mental model is treating this as a competition. The right model is a toolbox: each solves a different constraint. By the end of this lesson you'll have a decision framework you can apply immediately — in interviews and in production.

---

\`\`\`concept
{ "title": "Three Paradigms, Three Core Trade-offs", "variant": "mental-model", "content": "**REST** is a filing cabinet: every resource has a labeled drawer (URL), and you pull the whole folder — even if you only need one page.\\n\\n**GraphQL** is a custom order form: you specify exactly which fields you need, and the API returns precisely that — no more, no less.\\n\\n**gRPC** is a direct intercom between services: instead of fetching a resource, you call a function by name. Binary encoding over HTTP/2 makes it the fastest option for internal service communication.\\n\\nThe key insight: REST optimizes for *compatibility*, GraphQL for *bandwidth and flexibility*, gRPC for *performance and streaming*." }
\`\`\`

---

## How Each Protocol Works

The clearest way to grasp the trade-offs is to trace the *same operation* through all three: fetch a user profile and their five most recent orders.

\`\`\`tabs
{ "tabs": [ { "label": "REST", "icon": "🌐", "content": "## REST — Stateless, Resource-Oriented\\n\\n**Transport:** HTTP/1.1 &nbsp;|&nbsp; **Format:** JSON / XML &nbsp;|&nbsp; **One URL per resource**\\n\\n### Fetching user + orders: 2 separate round trips\\n\\n\`\`\`http\\nGET /api/users/123\\n→ { id, name, email, phone, address, preferences, createdAt, lastLogin, ... }\\n\\nGET /api/users/123/orders?limit=5\\n→ [{ id, product, qty, total, shippedAt, trackingNumber, ... }]\\n\`\`\`\\n\\n### Problems\\n- **Over-fetching**: the server always returns the full object — even if you only need \`name\` and \`email\`\\n- **Under-fetching**: orders aren't embedded in the user response, forcing a second request\\n- **N+1 problem**: fetching 100 users then their orders = 101 HTTP calls from the client\\n\\n### Strengths\\n- Universally understood — any HTTP client works (curl, Postman, SDKs)\\n- HTTP GET responses are cacheable by default — free CDN/proxy caching\\n- Ideal for public APIs exposed to third-party developers\\n- Lowest learning curve — massive ecosystem of tooling and examples" }, { "label": "GraphQL", "icon": "⚛️", "content": "## GraphQL — Client-Driven Queries\\n\\n**Transport:** HTTP &nbsp;|&nbsp; **Format:** JSON &nbsp;|&nbsp; **Single endpoint: \`/graphql\`**\\n\\n### Same fetch in exactly one request\\n\\n\`\`\`graphql\\nquery {\\n  user(id: 123) {\\n    name\\n    email\\n    orders(limit: 5) {\\n      product\\n      total\\n    }\\n  }\\n}\\n\`\`\`\\n\\nThe client declares exactly which fields it needs. The server returns *only* those fields — no \`phone\`, no \`address\`, no \`lastLogin\`.\\n\\n### Problems\\n- **Server-side N+1**: resolvers can fire many DB queries per field in a list (fixed with DataLoader batching)\\n- **Caching complexity**: POST requests bypass HTTP-layer caching by default\\n- **Query cost**: clients can craft deeply-nested queries that hammer the database\\n\\n### Strengths\\n- Eliminates over-fetching and under-fetching completely\\n- Strong type system — the schema is the single source of truth\\n- Schema introspection powers tools like GraphiQL and Apollo Sandbox\\n- One request for complex nested data spanning multiple resources\\n- Ideal for mobile clients where every byte of bandwidth counts" }, { "label": "gRPC", "icon": "⚡", "content": "## gRPC — High-Performance RPC\\n\\n**Transport:** HTTP/2 &nbsp;|&nbsp; **Format:** Protocol Buffers (binary) &nbsp;|&nbsp; **Contract via \`.proto\` files**\\n\\n### Service definition\\n\\n\`\`\`protobuf\\nservice UserService {\\n  rpc GetUser(GetUserRequest) returns (UserResponse);\\n  rpc StreamOrders(OrderRequest) returns (stream OrderUpdate);\\n}\\n\\nmessage UserResponse {\\n  int64  id    = 1;\\n  string name  = 2;\\n  string email = 3;\\n}\\n\`\`\`\\n\\n### Four streaming modes\\n\\n| Mode | Pattern | Use case |\\n|---|---|---|\\n| Unary | req → res | User lookup |\\n| Server streaming | req → stream | Live order feed |\\n| Client streaming | stream → res | Log ingestion |\\n| Bidirectional | stream ↔ stream | Chat, gaming, telemetry |\\n\\n### Strengths\\n- **Fastest**: binary protobuf is 5–10× smaller than JSON; HTTP/2 multiplexes streams over one connection\\n- **Built-in streaming**: four service methods at the protocol level — no SSE or WebSocket hacks needed\\n- **Type safety**: \`.proto\` schema is the contract — errors are caught at compile time, not runtime\\n- Language-agnostic stubs auto-generated for Go, Java, Python, Rust, C++, and more\\n\\n### Weaknesses\\n- Binary format is not human-readable — cannot debug with curl\\n- Limited browser support — requires a grpc-web proxy layer\\n- Not suitable for public APIs consumed by external developers unfamiliar with \`.proto\` tooling" } ] }
\`\`\`

---

## The Over-Fetching Problem, Quantified

REST's most common complaint is *over-fetching* — the server returns far more data than the client requested. On mobile networks or at high request volume, unused fields waste bandwidth and CPU. Run the simulation below to see the numbers.

\`\`\`playground
{ "title": "REST vs GraphQL: Over-Fetching Comparison", "language": "javascript", "code": "// Full user record stored in the database — 10 fields\\nconst userDB = {\\n  id: 123,\\n  name: \\"Alice Chen\\",\\n  email: \\"alice@example.com\\",\\n  phone: \\"+1-555-0123\\",\\n  address: \\"123 Main St, San Francisco, CA\\",\\n  preferences: { theme: \\"dark\\", notifications: true },\\n  createdAt: \\"2024-01-15\\",\\n  lastLogin: \\"2026-04-14\\",\\n  subscription: \\"pro\\",\\n  avatar: \\"https://cdn.example.com/avatars/123.jpg\\"\\n};\\n\\n// REST: server decides what to return — always the full object\\nfunction restGetUser(id) {\\n  return userDB;\\n}\\n\\n// GraphQL: client specifies exactly which fields it needs\\nfunction graphqlQuery(fields) {\\n  var result = {};\\n  fields.forEach(function(f) { result[f] = userDB[f]; });\\n  return result;\\n}\\n\\n// The UI only needs two fields for the navbar avatar\\nvar neededFields = [\\"name\\", \\"email\\"];\\n\\nconsole.log(\\"=== REST Response ===\\");\\nvar restResult = restGetUser(123);\\nconsole.log(JSON.stringify(restResult, null, 2));\\nvar restBytes = JSON.stringify(restResult).length;\\nconsole.log(\\"\\\\nFields returned : \\" + Object.keys(restResult).length);\\nconsole.log(\\"Fields needed   : \\" + neededFields.length);\\nconsole.log(\\"Payload size    : \\" + restBytes + \\" bytes\\");\\n\\nconsole.log(\\"\\\\n=== GraphQL Response ===\\");\\nvar gqlResult = graphqlQuery(neededFields);\\nconsole.log(JSON.stringify(gqlResult, null, 2));\\nvar gqlBytes = JSON.stringify(gqlResult).length;\\nconsole.log(\\"\\\\nFields returned : \\" + Object.keys(gqlResult).length);\\nconsole.log(\\"Fields needed   : \\" + neededFields.length);\\nconsole.log(\\"Payload size    : \\" + gqlBytes + \\" bytes\\");\\nconsole.log(\\"Bandwidth saved : \\" + (restBytes - gqlBytes) + \\" bytes (\\" + Math.round((restBytes - gqlBytes) / restBytes * 100) + \\"% reduction)\\");", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "GraphQL Doesn't Eliminate All N+1 Problems — It Moves Them", "content": "GraphQL moves the N+1 problem from the **client to the server**. Instead of 100 client-side HTTP calls, you get 100 database queries fired from resolvers — one per item in a list.\\n\\nThe standard fix is **DataLoader**: a batching utility that coalesces resolver calls into single queries (e.g., \`SELECT * FROM orders WHERE user_id IN (1,2,3,...100)\` instead of 100 individual selects).\\n\\nREST puts N+1 on the client. GraphQL puts it on the server. gRPC avoids it entirely by letting you define purpose-built RPCs with explicit JOIN logic." }
\`\`\`

---

## GraphQL Query Resolution: Under the Hood

Knowing how GraphQL *resolves* a query helps you spot performance bottlenecks and explain them clearly in system design interviews.

\`\`\`trace
{ "title": "GraphQL Query Resolution Step-by-Step", "language": "javascript", "code": "// Client sends: query { user(id:123) { name orders { product total } } }\\n\\nasync function resolveQuery(userId) {\\n  // Root resolver: fetch the user record\\n  const user = await db.users.findById(userId);\\n\\n  // Field resolver: fetch orders for this user\\n  const orders = await db.orders.findByUserId(userId);\\n\\n  // Assemble ONLY the fields the client requested\\n  return {\\n    name: user.name,\\n    orders: orders.map(function(o) {\\n      return { product: o.product, total: o.total };\\n    })\\n  };\\n}", "frames": [ { "line": 1, "vars": {}, "note": "Client POSTs GraphQL query to /graphql. Engine parses and validates query against the schema.", "stdout": "" }, { "line": 3, "vars": { "userId": 123 }, "note": "Root query resolver invoked. GraphQL engine passes args: { id: 123 }.", "stdout": "" }, { "line": 5, "vars": { "userId": 123 }, "note": "user resolver fires DB query: SELECT * FROM users WHERE id = 123. Returns full row with all columns.", "stdout": "" }, { "line": 8, "vars": { "user": "{ id:123, name:'Alice', email:'...', phone:'...' }" }, "note": "orders resolver fires: SELECT * FROM orders WHERE user_id = 123. If this were inside a list of 100 users, this line would fire 100 times — that's the N+1 problem.", "stdout": "" }, { "line": 11, "vars": { "user": "{ id:123, name:'Alice' }", "orders": "[{product:'Widget',total:29.99}]" }, "note": "GraphQL assembles response using ONLY the requested fields. Extra DB columns (email, phone, etc.) are discarded. Client receives exactly what it asked for.", "stdout": "{\\"name\\":\\"Alice\\",\\"orders\\":[{\\"product\\":\\"Widget\\",\\"total\\":29.99}]}" } ], "speed": 1000 }
\`\`\`

---

## What Production Architectures Actually Look Like

Most large-scale systems don't pick one API style — they layer all three strategically. Here's the pattern used by mature SaaS architectures:

\`\`\`sysdiag
{ "title": "Production API Architecture: Three Layers, Three Protocols", "width": 700, "height": 390, "nodes": [ { "id": "client", "label": "Browser /\\nMobile App", "x": 350, "y": 45, "kind": "service" }, { "id": "rest", "label": "Public\\nREST API", "x": 160, "y": 175, "kind": "service" }, { "id": "gql", "label": "GraphQL\\nGateway", "x": 460, "y": 175, "kind": "service" }, { "id": "user", "label": "User\\nService", "x": 110, "y": 315, "kind": "service" }, { "id": "order", "label": "Order\\nService", "x": 310, "y": 315, "kind": "service" }, { "id": "inv", "label": "Inventory\\nService", "x": 510, "y": 315, "kind": "service" }, { "id": "db", "label": "PostgreSQL", "x": 630, "y": 175, "kind": "database" } ], "edges": [ { "from": "client", "to": "rest", "label": "3rd-party SDK" }, { "from": "client", "to": "gql", "label": "web / mobile frontend" }, { "from": "rest", "to": "user", "label": "gRPC" }, { "from": "gql", "to": "user", "label": "gRPC" }, { "from": "gql", "to": "order", "label": "gRPC" }, { "from": "gql", "to": "inv", "label": "gRPC" }, { "from": "user", "to": "db", "label": "SQL" }, { "from": "order", "to": "db", "label": "SQL" } ], "annotations": { "rest": "Public REST API — stable, versioned, documented. Used by third-party developers, webhooks, and partner SDKs. HTTP/1.1 + JSON for maximum compatibility. Easy to document with OpenAPI/Swagger.", "gql": "Internal GraphQL gateway — serves your own web and mobile frontends. Clients request exactly the fields they need. Aggregates data from multiple gRPC microservices in a single query, eliminating round trips.", "user": "User Service — gRPC microservice. Handles auth, profiles, and preferences. .proto schema defines the contract. Binary Protocol Buffers + HTTP/2 for fast inter-service calls at scale.", "order": "Order Service — gRPC microservice. Manages cart, checkout, and fulfillment state. Called via gRPC by both the REST API and GraphQL gateway. Type safety guaranteed by .proto contract.", "db": "Shared PostgreSQL cluster. Each service owns its schema namespace. PgBouncer for connection pooling. pgvector extension for embedding-based recommendations." } }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "This Pattern Isn't Over-Engineering", "content": "Each layer serves a **different consumer** with different priorities:\\n\\n- **Public REST API** → third-party developers who need stability, documentation, and HTTP caching\\n- **GraphQL gateway** → your own frontend teams who need to move fast and control their data shape\\n- **gRPC services** → internal microservices where performance and type safety matter most\\n\\nFrameworks like Spring Boot 3.4 and Micronaut now make it trivial to run REST, gRPC, and GraphQL side-by-side in the same application." }
\`\`\`

---

## Comparison at a Glance

| | **REST** | **GraphQL** | **gRPC** |
|---|---|---|---|
| Transport | HTTP/1.1 | HTTP | HTTP/2 |
| Wire format | JSON / XML | JSON | Protocol Buffers (binary) |
| Type safety | Optional (OpenAPI) | Schema-enforced | \`.proto\` enforced |
| Over-fetching | Common | Eliminated | N/A — typed RPCs |
| Streaming | Limited (SSE) | Subscriptions | Native (4 modes) |
| Browser support | Native | Native | Needs grpc-web proxy |
| HTTP caching | Free | Complex | N/A |
| Best for | Public APIs | Frontend / mobile | Microservices |
| Learning curve | Low | Medium | High |

---

## Decision Framework

When facing this question in an interview, apply these rules in order:

**Default to REST** unless you have a specific reason not to. It's well understood, broadly compatible, and easily documented.

**Choose GraphQL when:** your frontend teams need autonomy over data shapes, you have mobile clients on bandwidth-constrained networks, or you're building dashboards that aggregate complex nested data.

**Choose gRPC when:** you're designing internal microservice communication, latency is measured in single-digit milliseconds, you need built-in streaming, or your system is polyglot (multiple languages need to call each other).

**Use all three together** once your system reaches the scale where the layered pattern above pays off.

---

\`\`\`quiz
{ "title": "REST vs gRPC vs GraphQL: Knowledge Check", "questions": [ { "question": "A mobile app's home screen shows a user's name, avatar URL, and their 3 most recent posts. Using REST, GET /users/:id returns 18 fields including billing info, admin flags, and internal metadata. Which problem does this illustrate?", "options": [ "Under-fetching — the client needs multiple requests to get related data", "Over-fetching — the server returns far more data than the client needs", "The N+1 problem — the server fires too many database queries per request", "Schema drift — the API contract is inconsistent with the database schema" ], "answer": 1, "explanation": "Over-fetching occurs when the server returns more data than the client requested. REST endpoints return a fixed shape defined by the server — the mobile client has no mechanism to request only specific fields. This wastes bandwidth (especially costly on cellular networks) and wastes CPU parsing JSON that's immediately discarded. GraphQL was designed specifically to solve this: the client declares exactly which fields it needs in the query itself." }, { "question": "A payments company is building internal microservices: order processing, fraud detection, and settlement. These services call each other 50,000 times per second and latency must stay under 5ms. Which API style is most appropriate for inter-service communication?", "options": [ "REST — it's well understood and easy to debug with standard tools", "GraphQL — each service can request only the fields it needs", "gRPC — HTTP/2 + Protocol Buffers minimize serialization overhead and latency", "WebSockets — they maintain persistent connections and avoid handshake overhead" ], "answer": 2, "explanation": "gRPC uses HTTP/2 (which multiplexes streams over a single connection, avoiding TCP handshake overhead) and Protocol Buffers (binary serialization is 5–10× more compact than JSON and faster to parse). For high-throughput, low-latency service-to-service calls, gRPC is the correct tool. REST's HTTP/1.1 and JSON parsing overhead compound significantly at 50k RPS. WebSockets are suited for real-time push scenarios, not request-response RPC." }, { "question": "A GraphQL API fetches a list of 100 orders. Each order has an \`items\` field that triggers a separate database query to resolve. How many total database queries execute for this request?", "options": [ "1 — GraphQL batches all queries automatically", "2 — one for orders, one for all items combined", "101 — one for the order list, one per order to fetch its items", "100 — one per order to fetch its items" ], "answer": 2, "explanation": "This is the classic GraphQL N+1 problem. First query: fetch 100 orders (1 query). Then the \`items\` resolver fires once for each order (100 queries) = 101 total. The standard fix is DataLoader, which intercepts these resolver calls and batches them into: SELECT * FROM order_items WHERE order_id IN (1, 2, 3, ... 100) — back to 2 queries total. Unlike REST (where N+1 is a client problem) or gRPC (where you define the JOIN explicitly), GraphQL N+1 is a server-side resolver problem." }, { "question": "A team is building a SaaS product. They need a public API for third-party integrations and an internal dashboard that displays complex nested data. What architecture should they use?", "options": [ "gRPC for everything — it's the most performant option available", "GraphQL for everything — a single endpoint simplifies the architecture", "REST for the public API, GraphQL for the internal dashboard", "REST for everything — it's the safest and most compatible choice" ], "answer": 2, "explanation": "This layered approach is the standard production pattern: a public REST API provides stability, versioning, and HTTP caching for external integrators who may not know GraphQL tooling. An internal GraphQL gateway serves the dashboard's complex data requirements efficiently — clients query exactly the nested data they need. As the research confirms: 'most production systems use more than one' API style, with REST for external contracts and GraphQL for internal frontends." } ] }
\`\`\`

---

## Practice: Match the Protocol to the Scenario

\`\`\`fillblank
{ "title": "Choose the Right API Style", "prompt": "Each comment describes a system requirement. Fill in the correct API style — REST, GraphQL, or gRPC — for each scenario.", "language": "javascript", "template": "// Scenario A: Public API for Stripe webhooks and partner SDK integrations.\\n// Needs broad compatibility, HTTP caching, and standard documentation.\\nconst publicApiStyle = \\"___\\";\\n\\n// Scenario B: Mobile app dashboard that fetches user profile + activity feed +\\n// recommended courses in a single request to conserve bandwidth.\\nconst mobileGatewayStyle = \\"___\\";\\n\\n// Scenario C: Order service calls inventory service 80,000 times per second.\\n// Needs binary encoding, HTTP/2 multiplexing, and built-in streaming.\\nconst internalServiceStyle = \\"__g__C\\";", "blanks": [ { "answer": "REST", "hint": "Public APIs need broad compatibility, HTTP caching, and easy documentation — no special client tooling required." }, { "answer": "GraphQL", "hint": "Mobile clients need to request exactly the fields they need to save bandwidth. One request for nested data across multiple resources." }, { "answer": "gRPC", "hint": "High-frequency inter-service calls need HTTP/2 multiplexing and binary Protocol Buffers to stay under 5ms latency." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "REST uses HTTP/1.1 + JSON, is resource-oriented, and is the right default for public APIs — but causes over-fetching (server decides the response shape) and under-fetching (related data requires extra round trips).", "GraphQL eliminates over-fetching and under-fetching by letting clients specify exactly which fields they need in a single query — but moves the N+1 problem to server-side resolvers (solved with DataLoader batching).", "gRPC uses HTTP/2 + Protocol Buffers for the fastest serialization, built-in 4-mode streaming, and strong type safety via .proto contracts — ideal for high-throughput microservice-to-microservice communication.", "Production systems typically layer all three: REST for the public contract, GraphQL for frontend flexibility, gRPC for the internal service backbone.", "The decision isn't about which protocol is best — it's about which constraint you're optimizing for: compatibility (REST), bandwidth efficiency (GraphQL), or raw performance and streaming (gRPC)." ] }
\`\`\``,
      starterCode: `# Exercise: API Paradigm Selector
#
# In this exercise, you'll implement a function that recommends the best
# API paradigm (REST, gRPC, or GraphQL) based on a set of requirements.
#
# Each paradigm has different trade-offs:
#   REST   - Simple, stateless, wide support, can over-fetch, HTTP/JSON
#   gRPC   - Low latency, strongly typed (Protobuf), great for streaming, binary
#   GraphQL - Flexible queries (no over-fetching), single endpoint, complex setup

from dataclasses import dataclass
from typing import Literal

ApiParadigm = Literal["REST", "gRPC", "GraphQL"]

@dataclass
class Requirements:
    needs_low_latency: bool        # Sub-millisecond or real-time performance needed
    needs_streaming: bool          # Server-push or bidirectional streaming needed
    needs_type_safety: bool        # Strongly-typed contract between client/server
    clients_need_flexibility: bool # Different clients need different subsets of data
    simple_crud: bool              # Basic create/read/update/delete operations
    public_api: bool               # Exposed to third-party or external developers


def recommend_api_paradigm(req: Requirements) -> tuple[ApiParadigm, str]:
    """
    Recommend the best API paradigm given a set of requirements.

    Returns a tuple of (paradigm_name, reason).

    Rules to implement:
    - If streaming OR low latency is needed AND it's not a public API → gRPC
      (gRPC excels at internal microservice communication with streaming/performance needs)
    - If clients need flexibility OR there are many different client types → GraphQL
      (GraphQL lets clients fetch exactly what they need, eliminating over-fetching)
    - Otherwise → REST
      (REST is the safe default for simple, public, or CRUD-heavy APIs)
    """
    # TODO 1: Check if gRPC is the best fit.
    # Condition: (needs_low_latency OR needs_streaming) AND NOT public_api
    # Return: ("gRPC", "<your reason here>")
    pass

    # TODO 2: Check if GraphQL is the best fit.
    # Condition: clients_need_flexibility OR (NOT simple_crud AND NOT public_api)
    # Return: ("GraphQL", "<your reason here>")
    pass

    # TODO 3: Default to REST.
    # Return: ("REST", "<your reason here>")
    pass


def score_paradigm(paradigm: ApiParadigm, req: Requirements) -> dict:
    """
    Return a scoring breakdown showing how well a paradigm fits the requirements.
    Scores are 0 (poor fit) or 1 (good fit) per dimension.
    """
    # TODO 4: Fill in the scoring table.
    # Each paradigm has known characteristics — map them to the requirements.
    #
    # Hint — paradigm characteristics:
    #   REST:    low_latency=0, streaming=0, type_safety=0, flexibility=0, simple_crud=1, public=1
    #   gRPC:    low_latency=1, streaming=1, type_safety=1, flexibility=0, simple_crud=0, public=0
    #   GraphQL: low_latency=0, streaming=1, type_safety=1, flexibility=1, simple_crud=0, public=1
    #
    # For each requirement that is True in \`req\`, add the paradigm's score for that dimension.
    scores = {
        "REST":    {"low_latency": 0, "streaming": 0, "type_safety": 0, "flexibility": 0, "simple_crud": 1, "public": 1},
        "gRPC":    {"low_latency": 1, "streaming": 1, "type_safety": 1, "flexibility": 0, "simple_crud": 0, "public": 0},
        "GraphQL": {"low_latency": 0, "streaming": 1, "type_safety": 1, "flexibility": 1, "simple_crud": 0, "public": 1},
    }

    paradigm_scores = scores[paradigm]
    req_flags = {
        "low_latency": req.needs_low_latency,
        "streaming": req.needs_streaming,
        "type_safety": req.needs_type_safety,
        "flexibility": req.clients_need_flexibility,
        "simple_crud": req.simple_crud,
        "public": req.public_api,
    }

    # TODO 5: Compute total_score as the sum of paradigm_scores[dim]
    # for each dimension where req_flags[dim] is True.
    total_score = 0  # replace this

    return {"paradigm": paradigm, "total_score": total_score, "breakdown": paradigm_scores}


# --- Tests ---
if __name__ == "__main__":
    # Test case 1: Internal microservice with real-time data
    ms = Requirements(
        needs_low_latency=True, needs_streaming=True,
        needs_type_safety=True, clients_need_flexibility=False,
        simple_crud=False, public_api=False
    )
    paradigm, reason = recommend_api_paradigm(ms)
    assert paradigm == "gRPC", f"Expected gRPC, got {paradigm}"
    print(f"Test 1 PASSED: {paradigm} — {reason}")

    # Test case 2: Mobile + web clients needing different data shapes
    flexible = Requirements(
        needs_low_latency=False, needs_streaming=False,
        needs_type_safety=False, clients_need_flexibility=True,
        simple_crud=False, public_api=False
    )
    paradigm, reason = recommend_api_paradigm(flexible)
    assert paradigm == "GraphQL", f"Expected GraphQL, got {paradigm}"
    print(f"Test 2 PASSED: {paradigm} — {reason}")

    # Test case 3: Simple public CRUD API
    crud = Requirements(
        needs_low_latency=False, needs_streaming=False,
        needs_type_safety=False, clients_need_flexibility=False,
        simple_crud=True, public_api=True
    )
    paradigm, reason = recommend_api_paradigm(crud)
    assert paradigm == "REST", f"Expected REST, got {paradigm}"
    print(f"Test 3 PASSED: {paradigm} — {reason}")

    # Test case 4: Score gRPC against the microservice requirements
    score = score_paradigm("gRPC", ms)
    print(f"Test 4 — gRPC score for microservice requirements: {score['total_score']}")
    assert score["total_score"] > 0, "Score should be > 0"
    print("Test 4 PASSED")

    print("\\nAll tests passed!")
`,
      solutionCode: `# Solution: API Paradigm Selector

from dataclasses import dataclass
from typing import Literal

ApiParadigm = Literal["REST", "gRPC", "GraphQL"]

@dataclass
class Requirements:
    needs_low_latency: bool
    needs_streaming: bool
    needs_type_safety: bool
    clients_need_flexibility: bool
    simple_crud: bool
    public_api: bool


def recommend_api_paradigm(req: Requirements) -> tuple[ApiParadigm, str]:
    """
    Recommend the best API paradigm given a set of requirements.

    Decision logic mirrors real-world guidance:
      - gRPC wins when performance or streaming matter AND the API is internal
        (gRPC's Protobuf contract and HTTP/2 multiplexing make it ideal for
         microservice-to-microservice calls that need speed or bidirectional streams)
      - GraphQL wins when different clients need different data shapes
        (avoids the over-fetching endemic to REST — one endpoint, client-driven queries)
      - REST is the sensible default for anything public, simple, or CRUD-heavy
        (universal tooling, human-readable, easy to cache and document)
    """
    # gRPC: internal services that need speed or real-time streaming
    if (req.needs_low_latency or req.needs_streaming) and not req.public_api:
        return (
            "gRPC",
            "Low latency / streaming required for an internal service — "
            "gRPC's binary Protobuf encoding and HTTP/2 multiplexing minimise "
            "overhead and support bidirectional streams out of the box."
        )

    # GraphQL: heterogeneous clients that each need a tailored data shape
    if req.clients_need_flexibility or (not req.simple_crud and not req.public_api):
        return (
            "GraphQL",
            "Clients need flexibility over the data they fetch — "
            "GraphQL's single endpoint with client-driven queries eliminates "
            "over-fetching and avoids the need for multiple versioned REST endpoints."
        )

    # REST: safe default for public, simple, or CRUD-centric APIs
    return (
        "REST",
        "Simple, public, or CRUD-focused API — REST's uniform interface, "
        "stateless design, and universal HTTP tooling make it the lowest-friction "
        "choice with the widest client support."
    )


def score_paradigm(paradigm: ApiParadigm, req: Requirements) -> dict:
    """
    Score how well a paradigm fits the requirements.

    Each dimension is scored 1 if the paradigm supports that characteristic,
    0 otherwise. The total is the sum across only the dimensions that the
    caller actually requires — so a paradigm is only penalised for gaps that
    matter to this specific use case.
    """
    # Known characteristic scores per paradigm
    scores = {
        #          lat  stream  type  flex  crud  public
        "REST":    {"low_latency": 0, "streaming": 0, "type_safety": 0, "flexibility": 0, "simple_crud": 1, "public": 1},
        "gRPC":    {"low_latency": 1, "streaming": 1, "type_safety": 1, "flexibility": 0, "simple_crud": 0, "public": 0},
        "GraphQL": {"low_latency": 0, "streaming": 1, "type_safety": 1, "flexibility": 1, "simple_crud": 0, "public": 1},
    }

    paradigm_scores = scores[paradigm]

    # Map requirement flags to dimension keys
    req_flags = {
        "low_latency": req.needs_low_latency,
        "streaming":   req.needs_streaming,
        "type_safety": req.needs_type_safety,
        "flexibility": req.clients_need_flexibility,
        "simple_crud": req.simple_crud,
        "public":      req.public_api,
    }

    # Only count dimensions the caller actually needs
    total_score = sum(
        paradigm_scores[dim]
        for dim, required in req_flags.items()
        if required
    )

    return {"paradigm": paradigm, "total_score": total_score, "breakdown": paradigm_scores}


# --- Tests ---
if __name__ == "__main__":
    # Test case 1: Internal microservice with real-time data → gRPC
    ms = Requirements(
        needs_low_latency=True, needs_streaming=True,
        needs_type_safety=True, clients_need_flexibility=False,
        simple_crud=False, public_api=False
    )
    paradigm, reason = recommend_api_paradigm(ms)
    assert paradigm == "gRPC", f"Expected gRPC, got {paradigm}"
    print(f"Test 1 PASSED: {paradigm} — {reason}")

    # Test case 2: Mobile + web clients needing different data shapes → GraphQL
    flexible = Requirements(
        needs_low_latency=False, needs_streaming=False,
        needs_type_safety=False, clients_need_flexibility=True,
        simple_crud=False, public_api=False
    )
    paradigm, reason = recommend_api_paradigm(flexible)
    assert paradigm == "GraphQL", f"Expected GraphQL, got {paradigm}"
    print(f"Test 2 PASSED: {paradigm} — {reason}")

    # Test case 3: Simple public CRUD API → REST
    crud = Requirements(
        needs_low_latency=False, needs_streaming=False,
        needs_type_safety=False, clients_need_flexibility=False,
        simple_crud=True, public_api=True
    )
    paradigm, reason = recommend_api_paradigm(crud)
    assert paradigm == "REST", f"Expected REST, got {paradigm}"
    print(f"Test 3 PASSED: {paradigm} — {reason}")

    # Test case 4: Score gRPC against microservice requirements
    score = score_paradigm("gRPC", ms)
    # ms requires: low_latency=T, streaming=T, type_safety=T → gRPC scores 1+1+1 = 3
    assert score["total_score"] == 3, f"Expected score 3, got {score['total_score']}"
    print(f"Test 4 PASSED — gRPC score for microservice requirements: {score['total_score']}")

    # Bonus: compare all three paradigms for the microservice case
    print("\\n--- Paradigm comparison for internal microservice ---")
    for p in ("REST", "gRPC", "GraphQL"):
        s = score_paradigm(p, ms)  # type: ignore[arg-type]
        print(f"  {p:8s} score: {s['total_score']}")

    print("\\nAll tests passed!")
`,
    },
    {
      id: "long-polling-vs-websockets-vs-sse",
      slug: "long-polling-vs-websockets-vs-sse",
      title: "Long Polling, WebSockets, and Server-Sent Events",
      content: `# Long Polling, WebSockets, and Server-Sent Events

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Networking & Communication Protocols**." }
\\\`\\\`\\\`

## What you'll learn here

Understand the connection lifecycle, server load, and client complexity of each real-time communication mechanism, and when to use each.

## Preview of topics

- The core ideas that make **Long Polling, WebSockets, and Server-Sent Events** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "message-queues-and-event-streaming",
      slug: "message-queues-and-event-streaming",
      title: "Message Queues and Event Streaming: Kafka vs RabbitMQ",
      content: `# Message Queues and Event Streaming: Kafka vs RabbitMQ

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Networking & Communication Protocols**." }
\\\`\\\`\\\`

## What you'll learn here

Compare point-to-point queuing with log-based event streaming. Understand Kafka's partitioned log, consumer groups, and exactly-once semantics.

## Preview of topics

- The core ideas that make **Message Queues and Event Streaming: Kafka vs RabbitMQ** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "api-gateway-and-bff",
      slug: "api-gateway-and-bff",
      title: "API Gateways and Backend-for-Frontend Pattern",
      content: `# API Gateways and Backend-for-Frontend Pattern

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Networking & Communication Protocols**." }
\\\`\\\`\\\`

## What you'll learn here

Understand how API gateways handle auth, rate limiting, SSL termination, and routing. Study the BFF pattern for tailoring APIs to different client types.

## Preview of topics

- The core ideas that make **API Gateways and Backend-for-Frontend Pattern** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "service-discovery-and-service-mesh",
      slug: "service-discovery-and-service-mesh",
      title: "Service Discovery and Service Mesh",
      content: `# Service Discovery and Service Mesh

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Networking & Communication Protocols**." }
\\\`\\\`\\\`

## What you'll learn here

Compare client-side and server-side service discovery, DNS-based routing, and how Envoy/Istio service meshes add observability and resilience.

## Preview of topics

- The core ideas that make **Service Discovery and Service Mesh** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "checkpoint-communication-design",
      slug: "checkpoint-communication-design",
      title: "Checkpoint: Design the Notification Delivery Pipeline",
      content: `# Checkpoint: Design the Notification Delivery Pipeline

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Networking & Communication Protocols**." }
\\\`\\\`\\\`

## What you'll learn here

Design a multi-channel (push, email, SMS) notification system handling 1M events/minute, applying the right communication protocols at each layer.

## Preview of topics

- The core ideas that make **Checkpoint: Design the Notification Delivery Pipeline** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
  ],
};
