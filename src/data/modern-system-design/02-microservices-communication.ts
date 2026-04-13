import { Module } from "../types";

export const microservicesCommunicationModule: Module = {
  id: "modern-communication",
  title: "Microservices Communication Patterns",
  description: "Master synchronous and asynchronous communication, resilience patterns, and distributed transactions in microservices.",
  lessons: [
    {
      id: "synchronous-rest-grpc",
      slug: "synchronous-rest-grpc",
      title: "Synchronous Communication: REST & gRPC",
      content: `\`\`\`concept
{ "title": "Synchronous Communication", "variant": "mental-model", "content": "Think of synchronous communication like a phone call: you dial, wait for someone to pick up, have a conversation, and only hang up when you get the answer. The caller is **blocked** until the entire interaction completes. This creates tight coupling between services — if the callee is slow or unavailable, the caller cannot proceed." }
\`\`\`

## Overview

Synchronous communication means the caller sends a request and **blocks** until the response arrives. It's the simplest model and maps directly to how most developers think about function calls — but in a distributed system, that blocking behavior carries real cost.

The two dominant protocols are **REST** (HTTP + JSON) and **gRPC** (HTTP/2 + Protocol Buffers). They make different trade-offs between universality and performance.

---

## REST (Representational State Transfer)

REST uses HTTP verbs, standard status codes, and JSON payloads. It's the lingua franca of public APIs because every language, tool, and browser already speaks it.

### Design Principles

| Principle | Good | Bad |
|-----------|------|-----|
| Resource-based URLs | \`/users/123/orders\` | \`/getOrdersByUser?id=123\` |
| HTTP verbs for intent | \`POST /orders\` (create) | \`GET /orders/create\` |
| Stateless requests | Auth token in every header | Server-side session cookie |
| Meaningful status codes | \`404 Not Found\`, \`429 Too Many Requests\` | \`200 OK\` with \`{"error": true}\` in body |

### Latency Anatomy of a REST Call

Even a fast REST call carries measurable overhead. In the same cloud region with keep-alive and TLS session resumption:

\`\`\`
DNS resolution:        ~1ms  (cached after first call)
TCP handshake:         ~1ms  (reused with keep-alive)
TLS handshake:         ~2ms  (session resumption)
JSON serialization:    ~0.5ms
Network transit:       ~1–5ms (same region)
JSON deserialization:  ~0.5ms
──────────────────────────────
Total:                 ~6–10ms per call
\`\`\`

This overhead is acceptable for human-facing APIs and moderate load. At high inter-service call rates (thousands per second), it becomes the bottleneck.

---

## gRPC (Google Remote Procedure Call)

gRPC replaces HTTP/1.1 + JSON with **HTTP/2 + Protocol Buffers** — a binary, schema-first serialization format that is both smaller and faster to parse than JSON.

You define your service in a \`.proto\` file; gRPC generates type-safe client and server stubs for any supported language automatically.

\`\`\`tabs
{ "tabs": [
  { "label": "Proto Definition", "icon": "📄", "content": "\`\`\`protobuf\\n// order.proto\\nservice OrderService {\\n  rpc CreateOrder(CreateOrderRequest) returns (Order);\\n  rpc GetOrder(GetOrderRequest) returns (Order);\\n  rpc StreamOrders(StreamRequest) returns (stream Order);\\n}\\n\\nmessage CreateOrderRequest {\\n  string user_id = 1;\\n  repeated OrderItem items = 2;\\n}\\n\\nmessage Order {\\n  string id = 1;\\n  string user_id = 2;\\n  OrderStatus status = 3;\\n  int64 created_at = 4;\\n}\\n\`\`\`" },
  { "label": "Generated Go Client", "icon": "🐹", "content": "\`\`\`go\\n// Auto-generated — never edit by hand\\nconn, _ := grpc.Dial(\\"order-service:50051\\", grpc.WithTransportCredentials(...))\\nclient := pb.NewOrderServiceClient(conn)\\n\\n// Fully type-safe call\\norder, err := client.CreateOrder(ctx, &pb.CreateOrderRequest{\\n    UserId: \\"u-123\\",\\n    Items:  []*pb.OrderItem{{Sku: \\"BOOK-42\\", Qty: 1}},\\n})\\n\`\`\`" },
  { "label": "Streaming Example", "icon": "📡", "content": "\`\`\`go\\n// Server streaming: one request, many responses\\nstream, err := client.StreamOrders(ctx, &pb.StreamRequest{\\n    UserId: \\"u-123\\",\\n})\\nfor {\\n    order, err := stream.Recv()\\n    if err == io.EOF {\\n        break  // server finished streaming\\n    }\\n    fmt.Printf(\\"Order update: %s -> %s\\\\n\\", order.Id, order.Status)\\n}\\n\`\`\`" }
] }
\`\`\`

### gRPC vs REST: Head-to-Head

| Dimension | REST | gRPC |
|-----------|------|------|
| Serialization | JSON — text, ~100 bytes | Protobuf — binary, ~30 bytes |
| HTTP version | HTTP/1.1 (one request per connection) | HTTP/2 (multiplexed streams) |
| Streaming | WebSocket (separate upgrade) | Built-in (4 modes) |
| Code generation | Manual or OpenAPI tooling | Auto from \`.proto\` — any language |
| Latency (same region) | ~6–10ms | ~2–4ms |
| Browser support | Native | Requires gRPC-Web proxy |
| Human readability | High (JSON) | Low (binary) |

\`\`\`algoviz
{ "title": "REST vs gRPC: Latency per Call (ms)", "type": "array", "data": [10, 8, 9, 7, 11, 3, 4, 2, 3, 4], "frames": [
  { "highlight": [0], "label": "REST call 1 — 10ms (HTTP/1.1 + JSON parse)", "stats": { "protocol": "HTTP/1.1", "format": "JSON" } },
  { "highlight": [1], "label": "REST call 2 — 8ms (keep-alive saves TCP handshake)", "stats": { "protocol": "HTTP/1.1", "format": "JSON" } },
  { "highlight": [2], "label": "REST call 3 — 9ms (JSON still dominant cost)", "stats": { "protocol": "HTTP/1.1", "format": "JSON" } },
  { "highlight": [3, 4], "label": "REST calls 4–5 — 7ms and 11ms (network jitter)", "stats": { "protocol": "HTTP/1.1", "format": "JSON" } },
  { "highlight": [5], "label": "gRPC call 1 — 3ms (HTTP/2 + protobuf binary)", "stats": { "protocol": "HTTP/2", "format": "Protobuf" } },
  { "highlight": [6], "label": "gRPC call 2 — 4ms (multiplexed on same connection)", "stats": { "protocol": "HTTP/2", "format": "Protobuf" } },
  { "highlight": [7], "label": "gRPC call 3 — 2ms (binary deserialization is fast)", "stats": { "protocol": "HTTP/2", "format": "Protobuf" } },
  { "highlight": [5, 6, 7, 8, 9], "label": "gRPC average ~3ms vs REST average ~9ms — ~3x improvement", "stats": { "REST avg": "9ms", "gRPC avg": "3ms", "speedup": "3x" } }
], "speed": 900 }
\`\`\`

### gRPC Streaming Modes

gRPC has four call patterns — a major advantage over REST's request-response-only model:

\`\`\`
Unary (like REST):    Client ──req──▶ Server ──res──▶ Client
Server streaming:     Client ──req──▶ Server ══res1,res2,res3══▶ Client
Client streaming:     Client ══req1,req2,req3══▶ Server ──res──▶ Client
Bidirectional:        Client ══req══▶ Server ══res══▶ Client (concurrent)
\`\`\`

**Server streaming** is ideal for real-time feeds (stock prices, order status updates) — the client opens one connection and receives a continuous stream without polling.

---

## Decision Guide: REST or gRPC?

\`\`\`tabs
{ "tabs": [
  { "label": "Use REST when…", "icon": "🌐", "content": "- **Public API** for third-party developers — universal HTTP/JSON tooling\\n- **Browser clients** — no native gRPC support without a proxy layer\\n- **Simple CRUD operations** — REST's resource model fits naturally\\n- **Debugging priority** — JSON is human-readable in browser DevTools\\n- **Team unfamiliar with protobuf** — lower onboarding cost\\n\\n> In the e-commerce example: the customer-facing product catalog API is REST." },
  { "label": "Use gRPC when…", "icon": "⚡", "content": "- **Internal service-to-service** calls at high volume (>1K QPS)\\n- **Polyglot teams** — auto-generate clients for Python, Go, Java, Node, etc.\\n- **Real-time streams** — server or bidirectional streaming built-in\\n- **Latency-sensitive paths** — payment ↔ inventory ↔ order at checkout\\n- **Strong contracts** — protobuf schema enforces API compatibility\\n\\n> In the e-commerce example: the Order ↔ Payment ↔ Inventory triangle is gRPC." },
  { "label": "Hybrid (Real-world)", "icon": "🏗️", "content": "Most production microservices systems use **both**:\\n\\n\`\`\`\\nExternal clients\\n    │\\n    ▼ REST (public API gateway)\\nAPI Gateway\\n    │\\n    ├──▶ Order Service  ◀──gRPC──▶ Payment Service\\n    │         │\\n    │         └──gRPC──▶ Inventory Service\\n    │\\n    └──▶ User Service  ◀──gRPC──▶ Auth Service\\n\`\`\`\\n\\nREST at the perimeter, gRPC on the interior data plane." }
] }
\`\`\`

---

## Cascade Failures: The Hidden Cost of Synchronous Coupling

When services call each other synchronously, a slow or failed downstream service can freeze the entire call chain. This is called a **cascade failure**.

\`\`\`concept
{ "title": "Cascade Failure", "variant": "rule", "content": "In a synchronous call chain A → B → C, if C becomes slow, B's thread pool fills waiting for C, then A's thread pool fills waiting for B. One slow service can bring down a healthy system." }
\`\`\`

\`\`\`trace
{ "title": "Cascade Failure: Thread Blocking in Action", "language": "python", "code": "import time\\n\\ndef service_c():\\n    time.sleep(5)  # simulating a slow DB query\\n    return \\"C response\\"\\n\\ndef service_b():\\n    print(\\"B: calling C...\\")\\n    result = service_c()   # B BLOCKS here for 5s\\n    print(\\"B: got response from C\\")\\n    return f\\"B processed: {result}\\"\\n\\ndef service_a():\\n    print(\\"A: calling B...\\")\\n    result = service_b()   # A BLOCKS here (waiting for B to wait for C)\\n    print(\\"A: got response from B\\")\\n    return f\\"A processed: {result}\\"\\n\\nstart = time.time()\\nresult = service_a()\\nprint(f\\"Total wall time: {time.time() - start:.1f}s\\")", "frames": [
  { "line": 3, "vars": {}, "note": "Service C starts a slow operation (5s DB query)", "stdout": "" },
  { "line": 8, "vars": {}, "note": "Service B makes its call and immediately blocks", "stdout": "B: calling C...\\n" },
  { "line": 13, "vars": {}, "note": "Service A makes its call and also blocks — call chain is now fully frozen", "stdout": "A: calling B...\\n" },
  { "line": 4, "vars": {}, "note": "5 seconds pass... C finally returns", "stdout": "" },
  { "line": 9, "vars": {}, "note": "B unblocks and can proceed", "stdout": "B: got response from C\\n" },
  { "line": 14, "vars": {}, "note": "A unblocks. Total latency = sum of all hops (5s+ instead of ms)", "stdout": "A: got response from B\\n" },
  { "line": 19, "vars": { "elapsed": "5.0s" }, "note": "Entire chain paid C's 5s penalty. Under load, B and A exhaust their thread pools long before this.", "stdout": "Total wall time: 5.0s\\n" }
], "speed": 900 }
\`\`\`

### Mitigation Patterns

| Pattern | What It Does | Rule of Thumb |
|---------|-------------|---------------|
| **Timeouts** | Fail fast instead of blocking forever | Set at 2–5× P99 latency of the callee |
| **Circuit breaker** | Stop calling a failing service entirely | Open after N failures; half-open after backoff |
| **Retry with backoff** | Retry transient failures, but space them out | Max 3 retries; double delay each time |
| **Bulkhead** | Separate thread pools per downstream dependency | One slow service can't exhaust all threads |

\`\`\`callout
{ "type": "warning", "title": "Never call synchronously without a timeout", "content": "The default for most HTTP clients is **no timeout** — meaning a single hung downstream will hold your thread forever. Always configure explicit timeouts on every outbound call. A safe starting point: \`timeout = 3 × observed P99 latency\`." }
\`\`\`

---

## Scale Estimation

For an order service handling **50K orders/hour**:

\`\`\`
Average QPS  = 50,000 / 3,600 ≈ 14 req/s
Peak QPS     = 14 × 5 = 70 req/s  (5x peak multiplier)

With gRPC at ~3ms/call:
  Throughput per instance ≈ 1000ms / 3ms = ~333 req/s
  Instances at peak = ceil(70 / 333) = 1

With REST at ~9ms/call:
  Throughput per instance ≈ 1000ms / 9ms = ~111 req/s
  Instances at peak = ceil(70 / 111) = 1  (but 3x tighter margin)

In both cases, run ≥3 instances for HA. gRPC gives ~3x more headroom per instance.
\`\`\`

The efficiency gap becomes decisive at 10–100× higher load, where gRPC meaningfully reduces your instance count and cost.

---

\`\`\`quiz
{ "title": "REST & gRPC: Check Your Understanding", "questions": [
  {
    "question": "You're building a public API for third-party developers who'll use Python, Ruby, Java, and JavaScript clients. Which protocol is the better default choice?",
    "options": ["gRPC — faster and more efficient", "REST — universally supported with human-readable JSON", "Either is equally appropriate", "WebSocket — lower latency than both"],
    "answer": 1,
    "explanation": "REST is the correct choice for public APIs. It has universal support across languages and platforms, human-readable JSON for easier debugging, and extensive ecosystem tooling. gRPC requires protobuf toolchain setup, which is a friction point for external developers."
  },
  {
    "question": "Your internal microservices need to stream real-time stock price updates to subscriber services. What's the most efficient approach?",
    "options": ["REST with polling every 500ms", "REST with a WebSocket upgrade", "gRPC server streaming", "gRPC unary calls in a loop"],
    "answer": 2,
    "explanation": "gRPC server streaming is ideal here: the client opens one connection, the server pushes updates continuously, and backpressure is handled automatically by HTTP/2 flow control. REST polling wastes cycles on empty responses, and WebSocket is a separate protocol requiring additional infrastructure."
  },
  {
    "question": "Service A calls Service B (timeout: 30s). Service B calls Service C (no timeout set). Service C hangs indefinitely. What happens?",
    "options": ["A returns an error after 30s; B and C keep running", "A, B, and C all hang indefinitely because B has no timeout", "B times out after 30s by inheriting A's timeout", "C's connection is dropped by the OS after 60s automatically"],
    "answer": 1,
    "explanation": "Timeouts do NOT propagate automatically. B has no timeout on its call to C, so B's thread blocks forever waiting for C. A eventually times out after 30s, but B's thread is still stuck — leak enough of these and B's thread pool is exhausted, making B unavailable to all callers."
  },
  {
    "question": "A team has services in Go, Python, and Java that all need to call each other frequently. What is gRPC's key advantage in this polyglot environment?",
    "options": ["gRPC only works with Go, so the team should standardize on Go", "gRPC auto-generates type-safe client and server stubs from .proto files for each language", "gRPC uses JSON, making it easier to work with than REST in polyglot environments", "gRPC eliminates the need for API versioning across language boundaries"],
    "answer": 1,
    "explanation": "gRPC generates strongly-typed client libraries directly from the .proto schema for any supported language. The schema is the single source of truth — no manual client library maintenance, and breaking changes in the .proto cause compile errors before they reach production."
  }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Synchronous communication blocks the caller — the entire call chain waits until the deepest dependency responds",
  "REST excels at public APIs: universal HTTP/JSON support, human-readable, easy to debug across any language or tool",
  "gRPC delivers ~3x lower latency via HTTP/2 multiplexing and binary protobuf — the right default for high-volume internal service calls",
  "gRPC's four streaming modes (unary, server, client, bidirectional) enable real-time data flows that REST cannot match natively",
  "Real-world architectures use both: REST at the public perimeter, gRPC on the internal data plane",
  "Every synchronous call needs a timeout — without one, a single slow downstream can cascade into a full system outage"
] }
\`\`\``,
    },
    {
      id: "asynchronous-messaging",
      slug: "asynchronous-messaging",
      title: "Asynchronous Messaging",
      content: `# Asynchronous Messaging

## Why Async?

Synchronous communication creates tight coupling and cascading failures. When Service A blocks waiting for Service B, a single slow dependency freezes the entire call chain. Asynchronous messaging breaks this by decoupling services in both **time** (the consumer processes when ready) and **knowledge** (the producer never knows who consumes).

\`\`\`concept
{ "title": "Decoupling in Time and Space", "variant": "mental-model", "content": "Asynchronous messaging creates a temporal buffer between services. The producer doesn't wait for the consumer to be available, and the consumer processes at its own pace. This is like leaving a voicemail instead of making a phone call — the caller continues their day while the recipient listens when convenient. The key insight: services no longer need to be simultaneously available to collaborate." }
\`\`\`

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Synchronous (Tightly Coupled)", "code": "// Service A blocks waiting for Service B\\nconst response = await fetch('/service-b/process', {\\n  method: 'POST',\\n  body: JSON.stringify(order)\\n});\\n// A is frozen until B responds — if B is slow or down, A fails too\\nreturn response.json();" }, "after": { "label": "Asynchronous (Loosely Coupled)", "code": "// Service A publishes and continues immediately\\nawait messageQueue.publish('orders', {\\n  type: 'OrderPlaced',\\n  data: order,\\n  timestamp: Date.now()\\n});\\n// A continues — B's availability is irrelevant right now\\nreturn { status: 'accepted' };" } }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "When to Choose Async", "content": "Use asynchronous communication when: (1) the result isn't needed to move the current process forward, (2) you want to buffer load spikes — messages accumulate and are processed when the consumer is ready, (3) multiple services care about the same event. Use synchronous when: the result is needed immediately, or the operation is a simple query that doesn't change state." }
\`\`\`

---

## Messaging Patterns

### Point-to-Point (Queue)

One producer, one consumer. Each message is delivered to **exactly one** consumer instance — ideal for distributing work.

\`\`\`algoviz
{ "title": "Point-to-Point Queue Processing", "type": "array", "data": ["msg1", "msg2", "msg3", "msg4"], "frames": [ { "highlight": [0], "label": "Consumer picks up msg1 — removes it from queue", "stats": { "queue_size": 4, "processed": 0 } }, { "highlight": [1], "label": "msg1 processed and acknowledged; Consumer picks up msg2", "stats": { "queue_size": 3, "processed": 1 } }, { "highlight": [2], "label": "msg2 done; msg3 next", "stats": { "queue_size": 2, "processed": 2 } }, { "highlight": [3], "label": "Queue drained — all messages processed exactly once", "stats": { "queue_size": 1, "processed": 3 } } ], "speed": 900 }
\`\`\`

**Use case:** Task processing (send email, resize image, charge payment). You want one worker handling each task, not every worker handling every task.

---

### Publish-Subscribe (Topic)

One producer, **many consumers**. Every subscriber receives a copy of every message.

\`\`\`sysdiag
{ "title": "Publish-Subscribe Pattern", "width": 620, "height": 320, "nodes": [ { "id": "producer", "label": "Order Service", "x": 90, "y": 160, "kind": "service" }, { "id": "topic", "label": "orders topic", "x": 300, "y": 160, "kind": "queue" }, { "id": "email", "label": "Email Service", "x": 520, "y": 60, "kind": "service" }, { "id": "analytics", "label": "Analytics", "x": 520, "y": 160, "kind": "service" }, { "id": "inventory", "label": "Inventory", "x": 520, "y": 260, "kind": "service" } ], "edges": [ { "from": "producer", "to": "topic", "label": "publish" }, { "from": "topic", "to": "email", "label": "broadcast" }, { "from": "topic", "to": "analytics", "label": "broadcast" }, { "from": "topic", "to": "inventory", "label": "broadcast" } ], "annotations": { "topic": "All subscribers receive every message. The producer has no knowledge of who is listening — new consumers can be added with zero changes to the producer.", "producer": "Publishes one OrderPlaced event and returns immediately." } }
\`\`\`

**Use case:** Event notification — \`OrderPlaced\` triggers email, analytics update, and inventory reservation simultaneously.

---

### Fan-out / Fan-in

Fan-out dispatches one message to **multiple parallel workers**. Fan-in aggregates their results back. A common pattern for parallel search across multiple data stores or shards.

---

## Message Brokers Compared

| Feature | Kafka | RabbitMQ | Amazon SQS |
|---------|-------|----------|-----------|
| Model | Log-based (append-only) | Queue-based (consume & ack) | Managed queue |
| Throughput | ~1M msg/s per cluster | ~50K msg/s per node | Scales automatically |
| Ordering | Strict per partition | Per queue | Best-effort (FIFO queues available) |
| Retention | Configurable (hours → forever) | Until consumed | 14 days max |
| Replay | Yes — re-read from any offset | No — once consumed, gone | No |
| Best for | Event streaming, audit logs | Task queues, RPC-style async | Simple cloud-native queues |

\`\`\`collapse
{ "title": "Deep Dive: Kafka's Log-Based Architecture", "content": "Kafka differs from traditional brokers fundamentally: messages are written to an **append-only log** (a partition), not removed when consumed. Each consumer maintains its own **offset** — a pointer to the last message it read.\\n\\nThis enables:\\n- **Replay**: A new service can consume the entire history from offset 0\\n- **Consumer groups**: Multiple independent consumers read the same partition at different speeds\\n- **Time-travel debugging**: Reprocess historical events after deploying a bug fix\\n\\nThe tradeoff: Kafka requires more operational expertise. For simple task queues, RabbitMQ or SQS is usually sufficient." }
\`\`\`

---

## Delivery Guarantees

| Guarantee | Meaning | Implementation |
|-----------|---------|----------------|
| At-most-once | Message may be lost | Fire and forget — no acknowledgement |
| At-least-once | Message may be duplicated | Ack after processing; retry on failure |
| Exactly-once | Processed precisely once | Idempotent consumers + deduplication |

\`\`\`callout
{ "type": "warning", "title": "The Exactly-Once Myth", "content": "True exactly-once delivery requires distributed coordination that is extremely expensive to implement correctly. Most vendor 'exactly-once' guarantees are actually at-least-once delivery with idempotent processing layered on top. The complexity isn't worth it — design for idempotency instead and get the same safety guarantee at a fraction of the cost." }
\`\`\`

**At-least-once + idempotent consumers** is the industry standard approach.

### Idempotent Consumer Pattern

\`\`\`trace
{ "title": "Idempotent Message Processing", "language": "python", "code": "def process_order_message(msg):\\n    msg_id = msg['id']\\n\\n    # Check if already processed\\n    if redis.exists(f'processed:{msg_id}'):\\n        print(f'Skipping duplicate: {msg_id}')\\n        msg.ack()\\n        return\\n\\n    # Process the message\\n    order = msg['payload']\\n    handle_order(order)\\n\\n    # Mark as processed with TTL\\n    redis.set(f'processed:{msg_id}', '1', ex=86400)\\n\\n    # Acknowledge\\n    msg.ack()\\n    print(f'Processed: {msg_id}')", "frames": [ { "line": 1, "vars": { "msg": { "id": "order-123", "payload": { "item": "laptop" } } }, "note": "First delivery of order-123", "stdout": "" }, { "line": 4, "vars": { "msg_id": "order-123" }, "note": "Checking deduplication store in Redis", "stdout": "" }, { "line": 5, "vars": { "redis.exists": false }, "note": "Not seen before — proceed", "stdout": "" }, { "line": 9, "vars": { "order": { "item": "laptop" } }, "note": "Handling the order", "stdout": "Handling order for laptop" }, { "line": 13, "vars": {}, "note": "Store message ID with 24h TTL to catch late duplicates", "stdout": "" }, { "line": 16, "vars": {}, "note": "Ack the message — broker won't redeliver it", "stdout": "Processed: order-123" }, { "line": 1, "vars": { "msg": { "id": "order-123", "payload": { "item": "laptop" } } }, "note": "Network retry delivers order-123 again", "stdout": "" }, { "line": 5, "vars": { "redis.exists": true }, "note": "Already in deduplication store — skip safely", "stdout": "Skipping duplicate: order-123" } ], "speed": 800 }
\`\`\`

---

## Dead Letter Queues (DLQ)

Messages that fail processing repeatedly (typically 3–5 retries) are moved to a **dead letter queue** for manual inspection rather than being lost or blocking the main queue indefinitely.

\`\`\`sysdiag
{ "title": "Dead Letter Queue Flow", "width": 560, "height": 240, "nodes": [ { "id": "main", "label": "Main Queue", "x": 100, "y": 120, "kind": "queue" }, { "id": "consumer", "label": "Consumer", "x": 280, "y": 120, "kind": "service" }, { "id": "dlq", "label": "Dead Letter Queue", "x": 460, "y": 200, "kind": "queue" }, { "id": "alert", "label": "Alert + Review", "x": 460, "y": 80, "kind": "service" } ], "edges": [ { "from": "main", "to": "consumer", "label": "deliver" }, { "from": "consumer", "to": "main", "label": "nack (retry)" }, { "from": "consumer", "to": "dlq", "label": "3 failures → DLQ" }, { "from": "dlq", "to": "alert", "label": "notify" } ], "annotations": { "dlq": "Stores poison messages indefinitely. Operations team inspects, fixes the root cause, then re-queues or discards.", "consumer": "Each failure increments a retry counter. After the threshold, the message is dead-lettered instead of re-queued." } }
\`\`\`

---

## Backpressure

When consumers cannot keep up with producers, messages accumulate in the queue. Without backpressure, the queue grows unbounded until memory is exhausted or latency becomes unacceptable.

\`\`\`tabs
{ "tabs": [ { "label": "Bounded Queues", "icon": "🔒", "content": "**Reject messages when the queue reaches capacity**\\n\\n\`\`\`python\\n# RabbitMQ: declare a bounded queue\\nchannel.queue_declare(\\n    queue='tasks',\\n    arguments={\\n        'x-max-length': 1000,\\n        'x-overflow': 'reject-publish'  # or 'drop-head'\\n    }\\n)\\n\`\`\`\\n\\nWhen the queue is full, the broker rejects new publishes with a \`channel.flow\` signal. This forces the producer to slow down or handle the rejection explicitly — propagating the pressure upstream rather than hiding it." }, { "label": "Consumer Auto-Scaling", "icon": "📈", "content": "**Scale consumers horizontally based on queue depth**\\n\\n\`\`\`yaml\\napiVersion: autoscaling/v2\\nkind: HorizontalPodAutoscaler\\nspec:\\n  scaleTargetRef:\\n    name: order-processor\\n  minReplicas: 2\\n  maxReplicas: 20\\n  metrics:\\n  - type: Object\\n    object:\\n      metric:\\n        name: rabbitmq_queue_messages\\n      target:\\n        type: Value\\n        value: \\"30\\"  # scale up when >30 msgs per consumer\\n\`\`\`\\n\\nKubernetes adds consumer pods when the queue grows. KEDA (Kubernetes Event-Driven Autoscaler) has native support for Kafka, RabbitMQ, and SQS." }, { "label": "Rate Limiting at Source", "icon": "🚦", "content": "**Throttle producers before messages enter the system**\\n\\n\`\`\`javascript\\n// API Gateway — limit inbound order rate\\napp.use('/api/orders', rateLimit({\\n  windowMs: 60 * 1000,   // 1 minute window\\n  max: 100,              // max 100 requests per IP per minute\\n  message: 'Order rate limit exceeded — try again shortly'\\n}));\\n\`\`\`\\n\\nRate limiting is the most upstream defense. Combine with bounded queues for defense-in-depth: limit the inflow *and* cap the queue size." } ] }
\`\`\`

---

## Capacity Planning: Notification System

**Example calculation** for a notification system at scale:

- **Users:** 100M
- **Notifications per user per day:** 10
- **Total per day:** 1 billion
- **Average QPS:** 1B ÷ 86,400 ≈ **11,600 msg/s**
- **Peak (5× multiplier):** ≈ **58,000 msg/s**

At Kafka's ~5,000 msg/s per partition:
- **Partitions needed:** 58,000 ÷ 5,000 ≈ **12 partitions**
- **Consumer instances:** 12 (one per partition for maximum throughput)

This is why Kafka is the standard choice for notification systems at this scale — RabbitMQ's ~50K msg/s per node leaves almost no headroom at peak.

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Asynchronous messaging decouples services in time and space — producers and consumers no longer need to be simultaneously available", "Choose Point-to-Point for tasks (one consumer per message), Pub-Sub for events (all subscribers get every message), Fan-out/Fan-in for parallel processing", "Design for at-least-once delivery with idempotent consumers — deduplicate on a message ID stored in Redis or a database with a short TTL", "Dead letter queues catch poison messages before they block the main queue; always monitor DLQ depth as a health signal", "Implement backpressure before you need it: bounded queues + consumer auto-scaling is the standard combination", "Kafka's log-based model enables replay and multi-consumer reads from the same partition — this is its key advantage over traditional queue brokers" ] }
\`\`\`

\`\`\`quiz
{ "title": "Asynchronous Messaging Quiz", "questions": [ { "question": "Which messaging pattern guarantees each message is consumed by exactly one consumer instance?", "options": ["Publish-Subscribe", "Point-to-Point Queue", "Fan-out", "Event sourcing"], "answer": 1, "explanation": "Point-to-Point queues deliver each message to exactly one consumer. This is why they're ideal for task processing (e.g., charging a payment) where processing the same message twice would be harmful." }, { "question": "What is the most practical delivery guarantee for most microservices?", "options": ["At-most-once (fire and forget)", "Exactly-once (native broker guarantee)", "At-least-once with idempotent consumers", "Synchronous acknowledgement only"], "answer": 2, "explanation": "At-least-once with idempotent consumers balances reliability and implementation complexity. True exactly-once is extremely costly to implement correctly — designing consumers to safely handle duplicate deliveries achieves the same safety guarantee at far lower cost." }, { "question": "Which broker uniquely allows consumers to replay historical messages from an arbitrary offset?", "options": ["RabbitMQ", "Amazon SQS", "Apache Kafka", "Redis Pub/Sub"], "answer": 2, "explanation": "Kafka's append-only log retains messages for a configurable retention period. Each consumer tracks its own offset, allowing it to re-read from any point in history — essential for replaying events after deploying a bug fix or onboarding a new service." }, { "question": "A consumer receives the same order message twice due to a network retry. What pattern prevents the order from being charged twice?", "options": ["Dead Letter Queue", "Bounded Queue", "Idempotent Consumer with deduplication store", "Fan-in aggregation"], "answer": 2, "explanation": "The idempotent consumer pattern checks a deduplication store (e.g., Redis key keyed on message ID) before processing. If the message was already handled, it acknowledges and skips. The TTL on the dedup key should cover the maximum expected retry window." }, { "question": "What happens when a message fails processing 5 times in a row in a well-designed system?", "options": ["It is permanently deleted from the broker", "It is moved to a Dead Letter Queue for manual inspection", "The consumer scales up automatically to retry", "It is republished to a new topic"], "answer": 1, "explanation": "After exceeding the retry threshold, messages are moved to a Dead Letter Queue. This prevents a single bad message (a 'poison pill') from blocking the main queue while preserving the message for inspection and potential re-processing after the root cause is fixed." } ] }
\`\`\``,
    },
    {
      id: "service-discovery-load-balancing",
      slug: "service-discovery-load-balancing",
      title: "Service Discovery & Load Balancing",
      content: `# Service Discovery & Load Balancing

In a microservices environment, services are dynamic — instances start, stop, scale up, and scale down continuously. Hardcoding IP addresses is impossible. How does Service A find Service B when Service B has 50 instances that change every minute?

\`\`\`concept
{ "title": "The Dynamic Instance Problem", "variant": "mental-model", "content": "Imagine a restaurant where waiters change tables every minute. Customers need a way to locate their assigned waiter without memorizing table numbers. Service discovery acts like the restaurant host who maintains a real-time seating chart, directing customers to the right waiter no matter how often they move." }
\`\`\`

## Service Discovery

Service discovery is the mechanism by which services find each other's network locations. There are two primary patterns, and your choice affects where the complexity lives.

\`\`\`tabs
{ "tabs": [ { "label": "Client-Side Discovery", "icon": "🖥️", "content": "The client queries a service registry directly and selects an instance itself.\\n\\n\`\`\`mermaid\\ngraph LR\\n    A[Service A] -->|query| R[Service Registry\\\\nConsul/Eureka]\\n    R -->|instances list| A\\n    A -->|select + call| B[Service B\\\\n10.0.1.5:8080]\\n\`\`\`\\n\\n**Pros**\\n- No extra network hop between client and target\\n- Client can implement smart, context-aware load balancing\\n- Works without a centralized router\\n\\n**Cons**\\n- Every client SDK must implement discovery logic\\n- Harder to enforce consistent routing policies across languages" }, { "label": "Server-Side Discovery", "icon": "⚖️", "content": "The client sends requests to a load balancer or router, which queries the registry on the client's behalf.\\n\\n\`\`\`mermaid\\ngraph TD\\n    A[Service A] -->|request| LB[Load Balancer]\\n    LB -->|query| R[Service Registry]\\n    LB -->|forward| B1[Service B Instance 1]\\n    LB -->|forward| B2[Service B Instance 2]\\n    LB -->|forward| B3[Service B Instance 3]\\n\`\`\`\\n\\n**Pros**\\n- Client code stays simple — just send the request\\n- Discovery and routing logic is centralized and consistent\\n- Works regardless of the client's language\\n\\n**Cons**\\n- Extra network hop adds latency\\n- Load balancer becomes a potential bottleneck and SPOF if not clustered" } ] }
\`\`\`

### Service Registry Implementations

| Tool | CAP Stance | Health Check | Key Feature |
|------|-----------|--------------|-------------|
| **Consul** | CP (consistent) | HTTP, TCP, gRPC | Multi-datacenter, service mesh |
| **etcd** | CP (Raft consensus) | Lease-based TTL | Kubernetes backing store |
| **ZooKeeper** | CP (ZAB protocol) | Ephemeral nodes | Battle-tested, operationally complex |
| **Eureka** | AP (available) | Heartbeat-based | Netflix OSS, prefers availability over consistency |

\`\`\`concept
{ "title": "CP vs AP Registries", "variant": "rule", "content": "Consul, etcd, and ZooKeeper prioritize **Consistency** — during a network partition, they refuse to return potentially stale data. Eureka prioritizes **Availability** — it will serve a stale instance list rather than failing the lookup. For most microservice workloads, a slightly stale list with retries beats a hard discovery failure." }
\`\`\`

### Kubernetes Service Discovery

Kubernetes provides built-in service discovery that eliminates the need for an external registry in most cases:

\`\`\`mermaid
graph TD
    subgraph K8s Cluster
        SVC[Service: order-svc\\nVirtual IP 10.96.0.5]
        SVC --> P1[Pod 1\\n10.244.1.7]
        SVC --> P2[Pod 2\\n10.244.2.3]
        SVC --> P3[Pod 3\\n10.244.3.9]
    end
    Client[Other Pod] -->|http://order-svc:8080| SVC
\`\`\`

CoreDNS resolves \`order-svc\` to its stable ClusterIP. The \`Service\` resource acts as a virtual IP that iptables/IPVS rules route to healthy pods — pod churn is invisible to the caller.

## Load Balancing

Once you've discovered the instances, you need to decide *which one* to call. Load balancing algorithms make that decision.

\`\`\`algoviz
{ "title": "Round Robin vs Least Connections — 4 instances, active connection counts shown", "type": "array", "data": [5, 3, 1, 4], "frames": [ { "highlight": [], "label": "State: instances have [5, 3, 1, 4] active connections", "stats": { "algorithm": "—", "decision": "choosing..." } }, { "highlight": [0], "label": "Round Robin: send to index 0 regardless of load (5 active)", "stats": { "algorithm": "Round Robin", "sent_to": 0, "active": 5 } }, { "highlight": [1], "label": "Round Robin: next → index 1 (3 active)", "stats": { "algorithm": "Round Robin", "sent_to": 1, "active": 3 } }, { "highlight": [2], "label": "Round Robin: next → index 2 (1 active)", "stats": { "algorithm": "Round Robin", "sent_to": 2, "active": 1 } }, { "highlight": [3], "label": "Round Robin: next → index 3 (4 active) — even though index 2 is idle!", "stats": { "algorithm": "Round Robin", "sent_to": 3, "active": 4 } }, { "highlight": [2], "label": "Least Connections: always picks index 2 (fewest active = 1)", "stats": { "algorithm": "Least Connections", "sent_to": 2, "active": 1 } } ], "speed": 1000 }
\`\`\`

### Algorithm Comparison

| Algorithm | Description | Best For |
|-----------|-------------|----------|
| **Round Robin** | Rotate through instances sequentially | Uniform, short-lived requests |
| **Weighted Round Robin** | More traffic to beefier instances | Heterogeneous fleet (different CPU/RAM) |
| **Least Connections** | Route to instance with fewest active connections | Variable-duration requests (e.g., streaming) |
| **Consistent Hashing** | Same key always routes to same instance | Caching, sticky sessions |
| **Random** | Pick a random instance | Simple deployments; surprisingly effective at scale |

### Layer 4 vs Layer 7 Load Balancing

\`\`\`tabs
{ "tabs": [ { "label": "Layer 4 — Transport", "icon": "⚡", "content": "Routes at the TCP/UDP level using IP address and port only. The load balancer never reads the HTTP payload.\\n\\n**Examples:** AWS NLB, HAProxy (TCP mode)\\n\\n**Characteristics:**\\n- Extremely fast — millions of connections/sec\\n- No content inspection overhead\\n- Cannot route by URL, headers, or cookies\\n- Cannot do SSL termination per-path\\n\\n**Use when:** Raw throughput matters more than routing intelligence — database proxies, game servers, any non-HTTP protocol." }, { "label": "Layer 7 — Application", "icon": "🧠", "content": "Routes at the HTTP/gRPC level. The load balancer fully parses the request before forwarding.\\n\\n**Examples:** AWS ALB, NGINX, Envoy, Traefik\\n\\n**Characteristics:**\\n- Routes by URL path, hostname, headers, cookies\\n- SSL termination and re-encryption\\n- Request transformation, retry policies\\n- A/B traffic splitting by percentage or header\\n- Higher CPU cost per connection than L4\\n\\n**Use when:** You need path-based routing (\`/api/*\` → service A, \`/static/*\` → CDN), canary deployments, or header-based auth." } ] }
\`\`\`

### Load Balancing at Scale

A system handling 500K QPS typically layers multiple tiers:

\`\`\`mermaid
graph TD
    Internet --> DNS[GeoDNS]
    DNS --> L4[Regional L4 LB\\nAWS NLB / CloudFront]
    L4 --> L7[L7 LB Pool\\nALB / Envoy]
    L7 --> App1[App Instance 1]
    L7 --> App2[App Instance 2]
    L7 --> AppN[App Instance N]
\`\`\`

GeoDNS routes users to the nearest region, reducing latency before a single packet hits your application. L4 load balancers distribute across the L7 pool (protecting L7 from raw connection storms). L7 load balancers apply intelligent routing to the application instances.

## Health Checking

A load balancer is only as good as its knowledge of which instances are healthy. Two distinct checks serve different purposes:

- **Liveness check** — "Is the process alive?" A TCP connect or simple \`HTTP 200\` proves the process hasn't crashed.
- **Readiness check** — "Can this instance handle traffic *right now*?" Checks whether downstream dependencies (DB, cache, queue) are reachable and the instance has warmed up.

Unhealthy instances must be removed from rotation immediately. A single broken instance in a round-robin pool of N degrades the experience for 1/N of *all* requests — not just requests to that instance.

\`\`\`callout
{ "type": "warning", "title": "Health Check Pitfall", "content": "A naive \`/health\` endpoint that always returns HTTP 200 hides real issues. Include downstream dependency checks (DB connectivity, cache reachability, queue lag) in your **readiness** probe. The load balancer must stop sending traffic to instances that can't actually serve requests — not just instances that haven't crashed." }
\`\`\`

\`\`\`quiz
{ "title": "Service Discovery & Load Balancing", "questions": [ { "question": "In client-side discovery, who selects the specific service instance to call?", "options": ["The service registry", "The load balancer", "The calling client", "A DNS server"], "answer": 2, "explanation": "The client queries the registry for all healthy instances and applies its own load-balancing logic to pick one. This gives the client flexibility but requires every client to implement discovery." }, { "question": "Which service registry favors availability over consistency during a network partition?", "options": ["Consul", "etcd", "ZooKeeper", "Eureka"], "answer": 3, "explanation": "Eureka is AP (Available, Partition-tolerant). It continues serving potentially stale instance lists rather than refusing lookups. Consul, etcd, and ZooKeeper are all CP and will refuse to return data they cannot confirm is current." }, { "question": "What is the primary drawback of server-side discovery compared to client-side?", "options": ["Clients become more complex", "An extra network hop through the load balancer", "Discovery is slower because DNS TTLs apply", "No health checking is possible"], "answer": 1, "explanation": "Every request traverses the load balancer, adding latency and creating a potential bottleneck. The load balancer itself must be clustered and highly available to avoid becoming a single point of failure." }, { "question": "Which load balancing algorithm would you choose for a video transcoding service where jobs take wildly different amounts of time?", "options": ["Round Robin", "Consistent Hashing", "Random", "Least Connections"], "answer": 3, "explanation": "Least Connections routes new work to the instance currently handling the fewest active jobs, naturally avoiding overloading a worker that is still busy with a long-running transcode while others have finished." }, { "question": "A Layer 7 load balancer can do something a Layer 4 load balancer cannot. Which of the following is a Layer 7-only capability?", "options": ["TCP connection load balancing", "Routing /api/* to one service and /static/* to another", "Handling millions of connections per second", "Non-HTTP protocol support"], "answer": 1, "explanation": "URL-path-based routing requires inspecting the HTTP request, which is a Layer 7 operation. Layer 4 load balancers only see IP addresses and ports, not the request content." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Service discovery solves the dynamic IP problem — use client-side for smart routing flexibility, server-side to keep client code simple.", "Consul/etcd/ZooKeeper are CP (consistent); Eureka is AP (available) — choose based on whether stale instance lists or lookup failures are the worse failure mode for your system.", "Kubernetes Service resources provide built-in DNS-based discovery, removing the need for an external registry in most cloud-native deployments.", "Round Robin works well for uniform workloads; Least Connections is superior when request duration varies significantly; Consistent Hashing is the right choice when sticky routing matters (caches, sessions).", "Layer 4 load balancers win on raw throughput; Layer 7 load balancers win on routing intelligence — production systems typically layer both.", "Readiness probes must check downstream dependencies, not just process liveness — one broken instance in a round-robin pool poisons 1/N of all traffic." ] }
\`\`\``,
    },
    {
      id: "circuit-breaker-retry",
      slug: "circuit-breaker-retry",
      title: "Circuit Breaker & Retry Patterns",
      content: `# Circuit Breaker & Retry Patterns

## The Cascade Failure Problem

In a microservices system, one slow or failing service can bring down the entire system:

\`\`\`mermaid
graph TD
    User[User] --> API[API Gateway]
    API --> Order[Order Service]
    Order --> Payment[Payment Service<br/>DOWN]
    Order -.->|"threads blocked<br/>waiting for Payment"| Blocked1[Thread Pool Exhausted]
    Order -.->|"stops responding"| Down1[Service Unresponsive]
    API -.->|"threads blocked"| Blocked2[API GW Thread Pool Exhausted]
    Blocked2 -.->|"Everything is down"| Down2[System Down]
\`\`\`

This is a **cascade failure**. The circuit breaker pattern prevents it.

\`\`\`concept
{ "title": "Cascade Failure", "variant": "analogy", "content": "Think of cascade failure like a traffic jam: one broken-down car (Payment Service) blocks the highway, causing miles of backed-up traffic (thread pools). Circuit breakers act like detour signs — they redirect traffic before the jam spreads system-wide." }
\`\`\`

---

## Circuit Breaker

Popularized by Michael Nygard in *Release It!*, this pattern monitors calls to a downstream service and "opens the circuit" — stopping all calls immediately — when failures exceed a threshold. This protects your resources and gives the struggling service breathing room to recover.

### Three States

\`\`\`mermaid
stateDiagram-v2
    [*] --> CLOSED: normal operation
    CLOSED --> OPEN: failures > threshold
    OPEN --> HALF_OPEN: timeout expires
    HALF_OPEN --> CLOSED: success
    HALF_OPEN --> OPEN: failure
\`\`\`

- **CLOSED**: Normal operation. Requests pass through. Failures are counted in a rolling window.
- **OPEN**: Failures exceeded threshold. All requests immediately fail (fast-fail) without calling the downstream service. A timer starts.
- **HALF-OPEN**: Timer expired. One test request is allowed through. Success → CLOSED. Failure → OPEN.

\`\`\`tabs
{ "tabs": [
  { "label": "Client-Side", "icon": "💻", "content": "Each client has its own circuit breaker intercepting calls to all external services it invokes. Simple to implement but state is not shared across instances." },
  { "label": "Service-Side", "icon": "🏗️", "content": "The downstream service itself hosts an internal circuit breaker that decides whether to process incoming requests. Protects the service from overload, but the client still blocks waiting for the fast-fail response." },
  { "label": "Proxy (Service Mesh)", "icon": "🔀", "content": "A proxy (e.g., Envoy in Istio) sits between services and manages all circuit-breaking centrally. State is shared cluster-wide, no code changes needed. This is the preferred approach at scale." }
] }
\`\`\`

### Implementation

\`\`\`playground
{ "title": "Circuit Breaker in Action", "language": "python", "code": "import time\\nimport random\\nfrom enum import Enum\\n\\nclass State(Enum):\\n    CLOSED = \\"closed\\"\\n    OPEN = \\"open\\"\\n    HALF_OPEN = \\"half_open\\"\\n\\nclass CircuitBreaker:\\n    def __init__(self, failure_threshold=3, recovery_timeout=5):\\n        self.state = State.CLOSED\\n        self.failure_count = 0\\n        self.failure_threshold = failure_threshold\\n        self.recovery_timeout = recovery_timeout\\n        self.last_failure_time = 0\\n\\n    def call(self, func, *args, **kwargs):\\n        if self.state == State.OPEN:\\n            if time.time() - self.last_failure_time > self.recovery_timeout:\\n                self.state = State.HALF_OPEN\\n                print(\\"Timeout expired -> HALF_OPEN\\")\\n            else:\\n                print(\\"Circuit OPEN -- failing fast\\")\\n                raise Exception(\\"Circuit is OPEN\\")\\n\\n        try:\\n            result = func(*args, **kwargs)\\n            self._on_success()\\n            return result\\n        except Exception as e:\\n            self._on_failure()\\n            raise e\\n\\n    def _on_success(self):\\n        self.failure_count = 0\\n        if self.state == State.HALF_OPEN:\\n            print(\\"Test succeeded -> CLOSED\\")\\n        self.state = State.CLOSED\\n\\n    def _on_failure(self):\\n        self.failure_count += 1\\n        self.last_failure_time = time.time()\\n        if self.failure_count >= self.failure_threshold:\\n            print(f\\"{self.failure_count} failures -> OPEN\\")\\n            self.state = State.OPEN\\n\\ndef flaky_service():\\n    if random.random() < 0.7:  # 70% failure rate\\n        raise Exception(\\"Service unavailable\\")\\n    return \\"Success!\\"\\n\\nbreaker = CircuitBreaker(failure_threshold=3, recovery_timeout=5)\\n\\nfor i in range(10):\\n    try:\\n        result = breaker.call(flaky_service)\\n        print(f\\"Request {i+1}: {result}\\")\\n    except Exception as e:\\n        print(f\\"Request {i+1}: {e}\\")\\n    time.sleep(0.1)", "runnable": true }
\`\`\`

### Configuration Reference

| Parameter | Typical Value | Purpose |
|-----------|--------------|---------|
| Failure threshold | 5–10 failures | Consecutive/windowed failures before opening |
| Recovery timeout | 15–60 seconds | Time before probing recovery |
| Success threshold | 3–5 successes | Successes in half-open before closing |
| Monitoring window | 60 seconds | Rolling window for counting failures |

\`\`\`callout
{ "type": "warning", "title": "Avoid Single-Count Thresholds in Production", "content": "Never trip on a raw failure count alone. Use a sliding window (e.g., 5 failures in 60 seconds AND at least 20 requests) to avoid opening the circuit during low-traffic periods when two failures would otherwise hit 100% error rate." }
\`\`\`

---

## Retry Pattern

Retries handle **transient** failures — network blips, temporary overload, brief downtime during rolling deployments. The goal is eventual success on a later attempt without human intervention.

### Exponential Backoff with Jitter

\`\`\`trace
{ "title": "Retry Backoff Walkthrough", "language": "python", "code": "import random\\nimport time\\n\\ndef retry_with_backoff(func, max_retries=3, base_delay=1.0):\\n    for attempt in range(max_retries + 1):\\n        try:\\n            return func()\\n        except Exception as e:\\n            if attempt == max_retries:\\n                raise e\\n            delay = base_delay * (2 ** attempt)\\n            jitter = random.uniform(0, delay * 0.5)\\n            actual_delay = delay + jitter\\n            time.sleep(actual_delay)", "frames": [
  { "line": 3, "vars": { "attempt": 0, "max_retries": 3 }, "note": "First attempt — no delay yet" },
  { "line": 7, "vars": { "attempt": 0 }, "note": "Attempt 0 fails with transient error" },
  { "line": 9, "vars": { "delay": 1.0, "jitter": 0.3, "actual_delay": 1.3 }, "note": "Backoff: 1s base + 0.3s jitter = 1.3s wait" },
  { "line": 3, "vars": { "attempt": 1 }, "note": "Second attempt after 1.3s" },
  { "line": 7, "vars": { "attempt": 1 }, "note": "Attempt 1 also fails" },
  { "line": 9, "vars": { "delay": 2.0, "jitter": 0.7, "actual_delay": 2.7 }, "note": "Backoff: 2s base + 0.7s jitter = 2.7s wait" },
  { "line": 3, "vars": { "attempt": 2 }, "note": "Third attempt after 2.7s" },
  { "line": 5, "vars": { "attempt": 2 }, "note": "Success! Returns result without reaching max_retries" }
], "speed": 900 }
\`\`\`

**Why jitter?** Without it, if 1,000 clients all fail at the same moment, they retry in lockstep — every 1s, every 2s, every 4s — causing repeated spikes that re-trigger the failure. Jitter spreads retries randomly across time, smoothing the load curve.

### What to Retry

| ✅ Safe to Retry | ❌ Never Retry Blindly |
|-----------------|----------------------|
| 500 Internal Server Error | 400 Bad Request |
| 503 Service Unavailable | 401 Unauthorized |
| Connection timeout | 404 Not Found |
| DNS resolution failure | 422 Validation Error |
| 429 Too Many Requests (with \`Retry-After\`) | Non-idempotent writes (charge card, send email) |

\`\`\`callout
{ "type": "danger", "title": "Idempotency Is Non-Negotiable for Retries", "content": "Never retry non-idempotent operations (e.g., charging a credit card, sending a notification) without an idempotency key. Without it, retries can double-charge customers or send duplicate emails. Include a client-generated UUID in each request header so the server can detect and deduplicate replays." }
\`\`\`

---

## Bulkhead Pattern

Even with circuit breakers, a flood of blocked requests can exhaust your single shared thread pool. The bulkhead pattern allocates **separate, bounded resource pools** per dependency so one failing service cannot consume all threads.

\`\`\`sysdiag
{ "title": "Bulkhead Isolation in Order Service", "width": 600, "height": 300, "nodes": [
  { "id": "order", "label": "Order Service", "x": 300, "y": 150, "kind": "service" },
  { "id": "payment", "label": "Payment Pool\\n20 threads\\n(Circuit Breaker)", "x": 130, "y": 70, "kind": "storage" },
  { "id": "inventory", "label": "Inventory Pool\\n10 threads", "x": 130, "y": 155, "kind": "storage" },
  { "id": "email", "label": "Email Pool\\n5 threads", "x": 130, "y": 235, "kind": "storage" }
], "edges": [
  { "from": "order", "to": "payment", "label": "isolated" },
  { "from": "order", "to": "inventory", "label": "isolated" },
  { "from": "order", "to": "email", "label": "isolated" }
], "annotations": {
  "payment": "If payment is down, only this pool exhausts. Its circuit breaker opens after threshold.",
  "inventory": "Inventory calls remain healthy even when payment is failing.",
  "email": "Non-critical notifications keep working regardless of payment state."
} }
\`\`\`

Named after the watertight compartments in a ship's hull: flooding one compartment doesn't sink the whole vessel.

---

## Combining All Three Patterns

In production these patterns compose into a resilience pipeline. The order matters:

\`\`\`mermaid
graph LR
    Request[Request] --> Bulkhead[Bulkhead]
    Bulkhead --> CB[Circuit Breaker]
    CB --> Retry[Retry]
    Retry --> Timeout[Timeout: 2s]
    Timeout --> Service[Downstream Service]
\`\`\`

\`\`\`steps
{ "title": "Request Flow Through the Resilience Stack", "steps": [
  { "title": "Bulkhead — Resource Isolation", "content": "The request is assigned to a dedicated, bounded thread pool for its dependency type. If the payment pool is full, the request is rejected immediately — other pools are unaffected. This is the outermost gate." },
  { "title": "Circuit Breaker — Fast-Fail Check", "content": "Before making any network call, the circuit breaker checks its state. If **OPEN**, the call is rejected in microseconds (no network I/O wasted). If **CLOSED** or **HALF_OPEN**, the call proceeds. This prevents resources from being wasted on known-failing services." },
  { "title": "Retry — Transient Fault Recovery", "content": "If the call fails with a retryable error code (500, 503, timeout), it is retried with exponential backoff and jitter. Each failed attempt increments the circuit breaker's failure counter. Once the threshold is hit, the circuit opens and retries stop immediately." },
  { "title": "Timeout — Hard Deadline Enforcement", "content": "Each individual attempt has a strict deadline (e.g., 2 seconds). This prevents indefinite blocking and ensures thread pool slots are returned quickly. Set timeout < retry_delay so you don't retry before the previous attempt has released its thread." }
] }
\`\`\`

\`\`\`concept
{ "title": "Circuit Breaker + Retry Complementarity", "variant": "rule", "content": "Retries handle transient blips (milliseconds to seconds). Circuit breakers handle persistent problems (seconds to minutes). When the circuit is OPEN, smart retry logic should not bother — there is no point retrying when the breaker has already declared the service unavailable. The two patterns hand off naturally: retries drive the failure counter up, the breaker opens, retries cease." }
\`\`\`

### Library Implementations

You rarely need to build these from scratch. Mature libraries cover all three patterns:

| Library | Language | Notes |
|---------|----------|-------|
| **Resilience4j** | Java | Lightweight, functional, replaces Hystrix |
| **Polly** | .NET | Policy-based, composable |
| **Hystrix** | Java (legacy) | Netflix OSS, now in maintenance mode |
| **Envoy / Istio** | Any (sidecar) | Service-mesh approach, zero code changes |
| **go-resiliency** | Go | Simple, idiomatic |

---

\`\`\`quiz
{ "title": "Circuit Breaker & Retry Patterns", "questions": [
  {
    "question": "Your Order Service gets a 503 with 'Database connection pool exhausted'. Which pattern should fire first?",
    "options": ["Open the circuit breaker immediately", "Retry with exponential backoff", "Drop the request with a 503", "Increase the thread pool size"],
    "answer": 1,
    "explanation": "503 with connection pool exhaustion is typically transient — the database will recover as load drops. Retry with exponential backoff gives it time to stabilize. The circuit breaker should only open if failures persist beyond the configured threshold."
  },
  {
    "question": "A downstream service has been returning 500 errors for 5 minutes straight. What is the correct response?",
    "options": ["Keep retrying every second with fixed delay", "Open the circuit breaker to stop all calls", "Increase the retry count to 20", "Switch to a longer exponential backoff"],
    "answer": 1,
    "explanation": "Five minutes of continuous failures is not a transient fault — it is a real outage. Circuit breaker prevents resource exhaustion and gives the service breathing room to recover without being overwhelmed by retry storms."
  },
  {
    "question": "Which HTTP status codes should NEVER be retried automatically?",
    "options": ["500, 503, 504", "408, 429", "400, 401, 404", "All should be retried with long backoffs"],
    "answer": 2,
    "explanation": "4xx errors indicate client-side problems that are permanent. 400 Bad Request, 401 Unauthorized, and 404 Not Found will return the same response on every retry — retrying them wastes resources and adds latency for no benefit."
  },
  {
    "question": "Why is jitter added to exponential backoff delays?",
    "options": ["To make retries unpredictable so servers can't detect them", "To prevent all failed clients from retrying simultaneously and re-triggering the failure", "To ensure retries happen faster on average", "To satisfy rate-limiter requirements on the downstream service"],
    "answer": 1,
    "explanation": "Without jitter, all clients that fail at time T will retry at T+1s, T+3s, T+7s — in perfect lockstep, causing thundering herd surges. Jitter randomizes each client's delay so retries are spread across the interval, smoothing load on the recovering service."
  }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Circuit breakers prevent cascade failures by fast-failing calls to unhealthy services, giving them recovery time without being overwhelmed",
  "Three states drive the circuit breaker lifecycle: CLOSED (normal) → OPEN (fast-fail) → HALF-OPEN (probe) → CLOSED (recovered)",
  "Retries with exponential backoff handle transient faults, but jitter is essential to prevent thundering herd when many clients fail simultaneously",
  "Only retry idempotent operations or use idempotency keys — retrying a payment charge without one can double-bill customers",
  "Bulkhead isolation assigns separate thread pools per dependency so one failing service cannot exhaust all system resources",
  "The correct composition order is: Bulkhead → Circuit Breaker → Retry → Timeout — each layer protects the layers inside it"
] }
\`\`\``,
    },
    {
      id: "saga-pattern",
      slug: "saga-pattern",
      title: "Saga Pattern for Distributed Transactions",
      content: `# Saga Pattern for Distributed Transactions

## The Problem with Distributed Transactions

In a monolith, a single database transaction can atomically update orders, payments, and inventory:

\`\`\`sql
BEGIN TRANSACTION;
  INSERT INTO orders (...);
  UPDATE inventory SET stock = stock - 1;
  INSERT INTO payments (...);
COMMIT;
\`\`\`

In microservices, each service owns its own database. There is no single transaction spanning multiple databases. If payment succeeds but inventory update fails, you have **data inconsistency** with no built-in rollback.

\`\`\`concept
{
  "title": "The Distributed Transaction Dilemma",
  "variant": "insight",
  "content": "Traditional ACID transactions break down across service boundaries. Once you split your system into microservices, you lose the ability to rollback changes atomically across multiple databases. This forces architects to choose between consistency and availability — a fundamental trade-off captured by the CAP theorem. Sagas resolve this by trading atomicity for eventual consistency."
}
\`\`\`

## Two-Phase Commit (2PC) — And Why It Fails at Scale

2PC uses a coordinator to ensure all participants commit or all abort. In the prepare phase, every participant locks its resources and confirms readiness. In the commit phase, they all finalize together.

**Problems at scale:**
- **Blocking** — All participants lock resources during the prepare phase
- **Single point of failure** — A coordinator crash leaves participants locked indefinitely
- **Cascading latency** — Overall latency equals the slowest participant
- **Availability** — Any unavailable participant blocks the entire transaction

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "2PC Approach",
    "code": "# Centralized coordinator locks all participants\\nclass TwoPhaseCommit:\\n    def execute(self, order):\\n        # Phase 1: Lock resources everywhere\\n        order_db.prepare(order)\\n        payment_db.prepare(order.total)\\n        inventory_db.prepare(order.items)\\n        # Phase 2: Commit — blocks until all confirm\\n        order_db.commit()\\n        payment_db.commit()\\n        inventory_db.commit()"
  },
  "after": {
    "label": "Saga Pattern",
    "code": "# Decentralized: each service commits independently\\nclass OrderSaga:\\n    def execute(self, order):\\n        order_service.create(order)            # T1: local commit\\n        payment_service.charge(order.total)    # T2: local commit\\n        inventory_service.reserve(order.items) # T3: local commit\\n        # No global locks — compensate on failure instead"
  }
}
\`\`\`

2PC works for 2–3 participants in the same datacenter. It does not scale to microservices across networks.

## The Saga Pattern

A saga is a sequence of **local transactions**. Each service runs its own transaction, publishes an event, and moves forward. If any step fails, **compensating transactions** undo previous steps — not a technical rollback, but a **semantic reversal**.

\`\`\`concept
{
  "title": "Sagas Trade ACID for BASE",
  "variant": "mental-model",
  "content": "Sagas give up atomicity across services in exchange for availability and scalability. The system becomes **basically available, soft-state, eventually consistent (BASE)**. Each step commits locally and immediately. Consistency is restored through compensation if a later step fails. You stop asking 'did everything succeed atomically?' and start asking 'is the system in a consistent state eventually?'"
}
\`\`\`

\`\`\`algoviz
{
  "title": "Saga: Happy Path vs. Failure + Compensation",
  "type": "array",
  "data": ["Order Created", "Payment Charged", "Inventory Reserved", "Order Shipped"],
  "frames": [
    {"highlight": [0], "label": "T1: Order service creates order — local commit", "stats": {"step": "T1", "status": "ok"}},
    {"highlight": [0, 1], "label": "T2: Payment service charges card — local commit", "stats": {"step": "T2", "status": "ok"}},
    {"highlight": [0, 1, 2], "label": "T3: Inventory service tries to reserve — FAILS (out of stock)", "stats": {"step": "T3", "status": "failed"}},
    {"highlight": [0, 1], "label": "C2: Compensation — payment service issues refund", "stats": {"step": "C2", "status": "compensating"}},
    {"highlight": [0], "label": "C1: Compensation — order service cancels the order", "stats": {"step": "C1", "status": "compensating"}},
    {"highlight": [], "label": "Saga complete — eventual consistency restored", "stats": {"step": "done", "status": "compensated"}}
  ],
  "speed": 1000
}
\`\`\`

## Two Coordination Approaches

### Choreography — Event-Driven

Services communicate through events. No central coordinator exists. Each service listens for events, runs its local transaction, and emits the next event.

\`\`\`mermaid
flowchart LR
  OS[Order Service] --OrderCreated--> EB[(Event Bus)]
  EB --OrderCreated--> PS[Payment Service]
  PS --PaymentSucceeded--> EB
  EB --PaymentSucceeded--> IS[Inventory Service]
  IS --StockFailed--> EB
  EB --StockFailed: refund--> PS
  EB --StockFailed: cancel--> OS
\`\`\`

**Pros:** No coordinator, loosely coupled, each service is independently deployable.  
**Cons:** Saga state is distributed across services; hard to trace overall flow; risk of cyclic event dependencies with 5+ steps.

### Orchestration — Central Coordinator

A **saga orchestrator** explicitly directs each step and handles failures. It holds the full workflow and knows which compensations to trigger.

\`\`\`sysdiag
{
  "title": "Orchestration-Based Saga",
  "width": 640,
  "height": 360,
  "nodes": [
    {"id": "orch", "label": "Saga Orchestrator", "x": 320, "y": 180, "kind": "service"},
    {"id": "order", "label": "Order Service", "x": 80, "y": 80, "kind": "service"},
    {"id": "payment", "label": "Payment Service", "x": 560, "y": 80, "kind": "service"},
    {"id": "inventory", "label": "Inventory Service", "x": 80, "y": 290, "kind": "service"},
    {"id": "shipping", "label": "Shipping Service", "x": 560, "y": 290, "kind": "service"}
  ],
  "edges": [
    {"from": "orch", "to": "order", "label": "1. Create"},
    {"from": "orch", "to": "payment", "label": "2. Charge"},
    {"from": "orch", "to": "inventory", "label": "3. Reserve"},
    {"from": "orch", "to": "shipping", "label": "4. Ship"},
    {"from": "order", "to": "orch", "label": "ack"},
    {"from": "payment", "to": "orch", "label": "ack"},
    {"from": "inventory", "to": "orch", "label": "ack / fail"},
    {"from": "shipping", "to": "orch", "label": "ack"}
  ],
  "annotations": {
    "orch": "Holds full saga state. Drives each step in sequence. On failure at step N, runs compensations C(N-1)...C(1) in reverse order.",
    "order": "Executes local create or cancel transaction on command from orchestrator.",
    "payment": "Executes local charge or refund transaction on command from orchestrator.",
    "inventory": "Executes local reserve or release transaction on command from orchestrator.",
    "shipping": "Executes local ship transaction — typically a retryable step after the pivot."
  }
}
\`\`\`

**Pros:** Clear workflow; saga state in one place; easy to test and modify.  
**Cons:** Orchestrator can become a bottleneck; services are more coupled to the coordinator.

## Implementation: Orchestration-Based Saga

\`\`\`playground
{
  "title": "OrderSaga — Orchestration with Compensation",
  "language": "python",
  "code": "class OrderSaga:\\n    \\"\\"\\"Orchestration-based saga for order processing.\\"\\"\\"\\n\\n    def __init__(self, order_svc, payment_svc, inventory_svc):\\n        self.order_svc = order_svc\\n        self.payment_svc = payment_svc\\n        self.inventory_svc = inventory_svc\\n        self.completed_steps = []\\n\\n    def execute(self, order):\\n        try:\\n            self.order_svc.create(order)\\n            self.completed_steps.append('order')\\n\\n            self.payment_svc.charge(order.user_id, order.total)\\n            self.completed_steps.append('payment')\\n\\n            self.inventory_svc.reserve(order.items)\\n            self.completed_steps.append('inventory')\\n\\n            return {'status': 'success', 'order_id': order.id}\\n\\n        except Exception as e:\\n            self._compensate(order)\\n            return {'status': 'failed', 'reason': str(e)}\\n\\n    def _compensate(self, order):\\n        \\"\\"\\"Run compensating transactions in reverse order.\\"\\"\\"\\n        compensations = {\\n            'inventory': lambda: self.inventory_svc.release(order.items),\\n            'payment':   lambda: self.payment_svc.refund(order.user_id, order.total),\\n            'order':     lambda: self.order_svc.cancel(order.id),\\n        }\\n        for step in reversed(self.completed_steps):\\n            try:\\n                compensations[step]()\\n            except Exception as comp_err:\\n                # Log and alert — manual intervention may be needed\\n                print(f'Compensation failed for {step}: {comp_err}')\\n",
  "runnable": false
}
\`\`\`

\`\`\`trace
{
  "title": "Saga Execution — Failure at Inventory Step",
  "language": "python",
  "code": "saga = OrderSaga(order_svc, payment_svc, inventory_svc)\\nresult = saga.execute(order)",
  "frames": [
    {"line": 1, "vars": {"saga.completed_steps": "[]"}, "note": "Saga initialized with three service references"},
    {"line": 2, "vars": {"saga.completed_steps": "[]"}, "note": "execute() called — T1 begins"},
    {"line": 2, "vars": {"saga.completed_steps": "['order']"}, "note": "T1 success: order created, committed locally"},
    {"line": 2, "vars": {"saga.completed_steps": "['order', 'payment']"}, "note": "T2 success: card charged, committed locally"},
    {"line": 2, "vars": {"saga.completed_steps": "['order', 'payment']", "exception": "StockUnavailableError"}, "note": "T3 fails — StockUnavailableError raised, entering _compensate()"},
    {"line": 2, "vars": {"saga.completed_steps": "['order', 'payment']"}, "note": "C2: payment.refund() called — reverses the charge"},
    {"line": 2, "vars": {"saga.completed_steps": "['order']"}, "note": "C1: order.cancel() called — reverses the create"},
    {"line": 2, "vars": {"result": "{'status': 'failed', 'reason': 'StockUnavailableError'}"}, "note": "Saga returns — system eventually consistent again"}
  ],
  "speed": 800
}
\`\`\`

## Compensating Transactions

Compensations are not simply "undo." They are **semantic reversals** — new forward transactions that logically reverse a previous effect.

| Action | Compensation | Key Property |
|--------|-------------|--------------|
| Create order | Cancel order | Set status → "cancelled" |
| Charge $50 | Refund $50 | New refund transaction |
| Reserve stock | Release stock | Increment available count |
| Send confirmation email | Send cancellation email | Cannot unsend — compensate semantically |

**Three transaction categories** relevant to every saga:
- **Compensable** — can be reversed by a compensating transaction
- **Pivot** — the go/no-go point; once this commits, the saga drives forward, not backward
- **Retryable** — follow the pivot; guaranteed to succeed eventually (idempotent, safe to retry)

\`\`\`callout
{
  "type": "warning",
  "title": "Compensations Must Be Idempotent",
  "content": "Never assume a compensation runs exactly once. Network retries and message redelivery mean it may fire multiple times. A refund compensation must check whether the payment was already refunded before creating a new one. Design every compensation to be safely repeatable — running it twice must produce the same result as running it once."
}
\`\`\`

## Choreography vs. Orchestration: Decision Guide

| Factor | Choreography | Orchestration |
|--------|-------------|---------------|
| Coupling | Low — events only | Medium — orchestrator knows services |
| Complexity | Grows quickly with steps | Linear growth |
| Visibility | Hard — state distributed | Clear — centralized workflow |
| Testing | Hard — distributed events | Easier — test orchestrator in isolation |
| Best for | 2–4 simple, stable steps | 5+ steps or complex branching logic |

\`\`\`steps
{
  "title": "Choosing Between Choreography and Orchestration",
  "steps": [
    {
      "title": "Count your steps",
      "content": "2–4 simple steps with stable event contracts? Choreography is a natural fit. Five or more steps, or logic that branches or retries conditionally? Orchestration gives you the control you need."
    },
    {
      "title": "Consider team structure",
      "content": "Multiple autonomous teams each owning a service? Choreography reduces inter-team coordination. One team owns the full workflow end-to-end? Orchestration provides better visibility and easier debugging."
    },
    {
      "title": "Evaluate debugging needs",
      "content": "Orchestration centralizes saga state and logging — a single place to see where a transaction stalled. Choreography distributes state across services, requiring distributed tracing tools (e.g. Jaeger, Zipkin) to reconstruct what happened."
    },
    {
      "title": "Design compensations up front",
      "content": "Before writing any saga code, identify which steps are compensable, which is the pivot, and which are retryable. Map out the full compensation chain. If a step has no clean compensation, that is a design signal to rethink the saga boundary."
    }
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Saga Pattern — Check Your Understanding",
  "questions": [
    {
      "question": "Why does Two-Phase Commit (2PC) fail at microservice scale?",
      "options": [
        "It requires all databases to use the same vendor",
        "It blocks resources during the prepare phase and has a single coordinator failure point",
        "It cannot handle more than two services",
        "It requires synchronous HTTP calls between all participants"
      ],
      "answer": 1,
      "explanation": "2PC blocks resources across all participants during the prepare phase, and a coordinator crash leaves those participants locked indefinitely. This makes it unsuitable for distributed microservices where services may be unavailable or slow."
    },
    {
      "question": "What makes a compensating transaction different from a database ROLLBACK?",
      "options": [
        "Compensations are issued by the database engine automatically",
        "Compensations are faster than rollbacks",
        "Compensations are new semantic transactions that logically reverse an effect, not technical undos",
        "Compensations only apply to payment services"
      ],
      "answer": 2,
      "explanation": "A compensation is a new forward transaction that semantically reverses a previous step. You cannot unsend a confirmation email with a ROLLBACK — you send a cancellation email instead. This is fundamentally different from a database rollback."
    },
    {
      "question": "A compensation fires, but a network timeout prevents the acknowledgment from arriving. The broker retries and fires the compensation again. What property must compensations have to handle this safely?",
      "options": [
        "Atomicity",
        "Isolation",
        "Idempotency",
        "Durability"
      ],
      "answer": 2,
      "explanation": "Idempotency means running an operation multiple times produces the same result as running it once. Compensations must be idempotent so that retries do not cause double-refunds or double-cancellations."
    },
    {
      "question": "Your checkout flow has 7 steps with conditional branching (digital vs. physical goods take different paths). Which coordination approach should you choose?",
      "options": [
        "Choreography — lower coupling between services",
        "Orchestration — centralized workflow handles complexity",
        "Both are equally suited for 7-step flows",
        "2PC because it provides stronger consistency"
      ],
      "answer": 1,
      "explanation": "Orchestration is better for complex workflows with 5+ steps or branching logic. The workflow is centralized in the orchestrator, making conditional paths, error handling, and saga state much easier to manage and observe."
    }
  ]
}
\`\`\`

## Design Tips

1. **Keep sagas short** — Fewer steps means fewer failure modes and simpler compensation chains
2. **Make all steps idempotent** — Messages may be delivered more than once; design for it from the start
3. **Store saga state persistently** — Persist which steps completed so you can resume or compensate after a crash
4. **Set timeouts** — A step that never responds should trigger compensation, not wait indefinitely
5. **Define the pivot explicitly** — Once the pivot commits, shift from compensation to retry; make this boundary clear in code
6. **Plan for partial success** — Some failures are acceptable ("best effort"); document which compensations are critical vs. advisory

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Sagas replace ACID distributed transactions with eventual consistency — each service commits locally and compensations restore consistency on failure",
    "Choreography suits 2–4 simple event-driven steps; orchestration suits 5+ steps or workflows with complex branching and visibility requirements",
    "Compensating transactions are semantic reversals, not rollbacks — they must be idempotent and designed up front alongside each forward step",
    "Classify every saga step as compensable, pivot, or retryable — the pivot is the point of no return that determines whether the saga drives forward or compensates backward",
    "Store saga state persistently and set per-step timeouts so crashes and slow services never leave the system in an unrecoverable limbo"
  ]
}
\`\`\``,
    },
  ],
};
