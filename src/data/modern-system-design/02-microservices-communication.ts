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
      content: `# Synchronous Communication: REST & gRPC

\`\`\`concept
{"title": "Synchronous Communication", "variant": "mental-model", "content": "Think of synchronous communication like a phone call: you dial, wait for someone to pick up, have a conversation, and only hang up when you get the answer. The caller is blocked until the entire interaction completes. This creates tight coupling between services - if the callee is slow or unavailable, the caller can't proceed."}
\`\`\`

## Overview

Synchronous communication means the caller sends a request and **blocks** until the response arrives. This is the simplest model but introduces coupling: the caller depends on the callee being available and responsive.

## REST (Representational State Transfer)

REST is the most common API style for microservices. It uses HTTP verbs, status codes, and JSON payloads.

\`\`\`
Client ──POST /api/orders──▶ Order Service
Client ◀──201 Created───────  Order Service
\`\`\`

### REST Design Principles

| Principle | Example |
|-----------|---------|
| Resource-based URLs | \`/users/123/orders\` not \`/getOrdersByUser\` |
| HTTP verbs for actions | GET (read), POST (create), PUT (update), DELETE |
| Stateless | No server-side session; each request is self-contained |
| Standard status codes | 200 OK, 201 Created, 404 Not Found, 429 Too Many Requests |

### REST at Scale

REST works well up to moderate scale (~10K QPS per service). Beyond that, the overhead of HTTP/1.1 + JSON serialization becomes significant.

**Latency breakdown** of a typical REST call:
\`\`\`
DNS resolution:       ~1ms (cached)
TCP handshake:        ~1ms (keep-alive)
TLS handshake:        ~2ms (session resumption)
JSON serialization:   ~0.5ms
Network transit:      ~1-5ms (same region)
JSON deserialization: ~0.5ms
─────────────────────────────
Total:                ~6-10ms per call
\`\`\`

\`\`\`algoviz
{"title": "REST vs gRPC Latency Comparison", "type": "array", "data": [10, 8, 9, 7, 11, 3, 4, 2, 3, 4], "frames": [{"highlight": [0], "label": "REST call 1: 10ms", "stats": {"protocol": "HTTP/1.1 + JSON", "serialization": "text"}}, {"highlight": [1], "label": "REST call 2: 8ms", "stats": {"protocol": "HTTP/1.1 + JSON", "serialization": "text"}}, {"highlight": [2], "label": "REST call 3: 9ms", "stats": {"protocol": "HTTP/1.1 + JSON", "serialization": "text"}}, {"highlight": [5], "label": "gRPC call 1: 3ms", "stats": {"protocol": "HTTP/2 + Protobuf", "serialization": "binary"}}, {"highlight": [6], "label": "gRPC call 2: 4ms", "stats": {"protocol": "HTTP/2 + Protobuf", "serialization": "binary"}}, {"highlight": [7], "label": "gRPC call 3: 2ms", "stats": {"protocol": "HTTP/2 + Protobuf", "serialization": "binary"}}], "speed": 1000}
\`\`\`

## gRPC (Google Remote Procedure Call)

gRPC uses HTTP/2 and Protocol Buffers (protobuf) for efficient binary serialization.

\`\`\`protobuf
// order.proto
service OrderService {
  rpc CreateOrder(CreateOrderRequest) returns (Order);
  rpc GetOrder(GetOrderRequest) returns (Order);
  rpc StreamOrders(StreamRequest) returns (stream Order);
}

message CreateOrderRequest {
  string user_id = 1;
  repeated OrderItem items = 2;
}
\`\`\`

### gRPC Advantages Over REST

| Feature | REST | gRPC |
|---------|------|------|
| Serialization | JSON (text, ~100 bytes) | Protobuf (binary, ~30 bytes) |
| HTTP version | HTTP/1.1 | HTTP/2 (multiplexed) |
| Streaming | WebSocket (separate) | Built-in (unary, server, client, bidirectional) |
| Code generation | Manual or OpenAPI | Automatic from .proto files |
| Latency | ~6-10ms | ~2-4ms |

### gRPC Streaming Modes

\`\`\`
Unary:           Client ──req──▶ Server ──res──▶ Client
Server stream:   Client ──req──▶ Server ══res══▶ Client (multiple)
Client stream:   Client ══req══▶ Server ──res──▶ Client
Bidirectional:   Client ══req══▶ Server ══res══▶ Client
\`\`\`

Server streaming is particularly useful for real-time updates (stock prices, order status changes) without polling.

\`\`\`quiz
{"title": "REST vs gRPC Decision Making", "questions": [{"question": "You're building a public API for third-party developers. Which should you choose?", "options": ["REST - widely supported and human-readable", "gRPC - faster and more efficient", "Either works fine", "GraphQL instead"], "answer": 0, "explanation": "REST is the clear choice for public APIs due to universal support across languages and platforms, human-readable JSON, and extensive tooling."}, {"question": "Your microservice needs to stream real-time stock prices to clients. What's the best approach?", "options": ["REST with polling every second", "REST with WebSocket upgrade", "gRPC server streaming", "gRPC unary calls"], "answer": 2, "explanation": "gRPC server streaming provides built-in, efficient streaming with backpressure handling, making it ideal for real-time data feeds."}, {"question": "You have a polyglot environment with services in Python, Java, and Go. How does gRPC help?", "options": ["Requires manual client libraries", "Auto-generates type-safe clients from .proto files", "Only works with Google's languages", "Same as REST with OpenAPI"], "answer": 1, "explanation": "gRPC automatically generates strongly-typed client libraries from Protocol Buffer definitions for any supported language."}]}
\`\`\`

## When to Use Which

| Scenario | Choice | Why |
|----------|--------|-----|
| Public API for external clients | REST | Universal support, human-readable |
| Internal service-to-service | gRPC | Lower latency, type safety, streaming |
| Browser clients | REST or gRPC-Web | Browsers lack native gRPC support |
| Real-time data streams | gRPC streaming | Built-in, efficient, backpressure |
| Polyglot environment | gRPC | Auto-generated clients for any language |

## Handling Failures in Sync Communication

Synchronous calls propagate failures upstream. If Service C is slow, Service B blocks, which makes Service A block, creating a **cascade failure**.

\`\`\`
A ──▶ B ──▶ C (slow/down)
A blocks    B blocks
\`\`\`

Mitigation strategies:
- **Timeouts** — Never wait indefinitely (set timeouts at 2-5x P99 latency)
- **Circuit breakers** — Stop calling a failing service (covered in later lesson)
- **Retries with backoff** — Retry transient failures with exponential delay
- **Bulkheads** — Isolate call pools so one slow service cannot exhaust all threads

\`\`\`trace
{"title": "Cascade Failure Simulation", "language": "python", "code": "import time\\nimport random\\n\\ndef service_c():\\n    # Simulate slow service\\n    time.sleep(5)  # 5 second delay\\n    return \\"C response\\"\\n\\ndef service_b():\\n    # Calls service C synchronously\\n    print(\\"B: Calling service C...\\")\\n    result = service_c()\\n    print(\\"B: Got response from C\\")\\n    return f\\"B processed: {result}\\"\\n\\ndef service_a():\\n    # Calls service B synchronously\\n    print(\\"A: Calling service B...\\")\\n    result = service_b()\\n    print(\\"A: Got response from B\\")\\n    return f\\"A processed: {result}\\"\\n\\n# Simulate the cascade\\nprint(\\"Starting request chain...\\")\\nstart = time.time()\\ntry:\\n    result = service_a()\\n    print(f\\"Final result: {result}\\")\\nexcept Exception as e:\\n    print(f\\"Chain failed: {e}\\")\\nprint(f\\"Total time: {time.time() - start:.1f}s\\")", "frames": [{"line": 4, "vars": {}, "note": "Service C is slow (5s delay)", "stdout": ""}, {"line": 11, "vars": {}, "note": "Service B blocks waiting for C", "stdout": "B: Calling service C...\\n"}, {"line": 18, "vars": {}, "note": "Service A blocks waiting for B", "stdout": "A: Calling service B...\\n"}, {"line": 6, "vars": {}, "note": "After 5s delay, C responds", "stdout": ""}, {"line": 12, "vars": {}, "note": "B can now proceed", "stdout": "B: Got response from C\\n"}, {"line": 19, "vars": {}, "note": "A can now proceed", "stdout": "A: Got response from B\\n"}], "speed": 1000}
\`\`\`

## Scale Estimation Example

For an order service handling 50K orders/hour:
\`\`\`
QPS = 50,000 / 3,600 ≈ 14 req/s (average)
Peak = 14 × 5 = 70 req/s
With gRPC at 3ms/call: single instance handles ~300 req/s
Instances needed at peak: ceil(70/300) = 1 (with headroom, run 3)
\`\`\`

For internal services, gRPC's efficiency means you need fewer instances to handle the same load.

\`\`\`calculator
{"type": "compound-interest", "title": "Service Scaling Calculator", "inputs": [{"id": "qps", "label": "Peak QPS", "default": 70, "min": 1, "max": 10000}, {"id": "latency", "label": "Latency (ms)", "default": 3, "min": 1, "max": 100}, {"id": "headroom", "label": "Headroom Factor", "default": 3, "min": 1, "max": 10}]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Synchronous communication creates tight coupling - the caller blocks until the callee responds", "REST is ideal for public APIs due to universal support and human-readable JSON", "gRPC offers 3-5x lower latency through HTTP/2 and binary protobuf serialization", "gRPC's built-in streaming modes enable real-time data flows without polling", "Always implement timeouts and circuit breakers to prevent cascade failures in sync architectures"]}
\`\`\``,
    },
    {
      id: "asynchronous-messaging",
      slug: "asynchronous-messaging",
      title: "Asynchronous Messaging",
      content: `# Asynchronous Messaging

## Why Async?

Synchronous communication creates tight coupling and cascading failures. Asynchronous messaging decouples services in both **time** (consumer processes when ready) and **knowledge** (producer does not know who consumes).

\`\`\`concept
{
  "title": "Decoupling in Time and Space",
  "variant": "mental-model",
  "content": "Asynchronous messaging creates a temporal buffer between services. The producer doesn't wait for the consumer to be available, and the consumer can process messages at its own pace. This is like leaving a voicemail instead of making a phone call — the caller continues their day while the recipient listens when convenient."
}
\`\`\`

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Synchronous (Tightly Coupled)",
    "code": "// Service A blocks waiting for Service B\\nconst response = await fetch('/service-b/process', {\\n  method: 'POST',\\n  body: JSON.stringify(order)\\n});\\n// A is frozen until B responds\\nreturn response.json();"
  },
  "after": {
    "label": "Asynchronous (Loosely Coupled)",
    "code": "// Service A sends and continues\\nawait messageQueue.publish('orders', {\\n  type: 'OrderPlaced',\\n  data: order,\\n  timestamp: Date.now()\\n});\\n// A continues immediately\\nreturn { status: 'accepted' };"
  }
}
\`\`\`

## Messaging Patterns

### Point-to-Point (Queue)

One producer, one consumer. Each message is processed exactly once.

\`\`\`algoviz
{
  "title": "Point-to-Point Queue Processing",
  "type": "array",
  "data": ["msg1", "msg2", "msg3", "msg4"],
  "frames": [
    { "highlight": [0], "label": "Consumer picks up msg1", "stats": {"queue_size": 4} },
    { "highlight": [1], "label": "Consumer processes msg2", "stats": {"queue_size": 3} },
    { "highlight": [2], "label": "Consumer handles msg3", "stats": {"queue_size": 2} }
  ],
  "speed": 1000
}
\`\`\`

**Use case**: Task processing (send email, resize image, process payment).

### Publish-Subscribe (Topic)

One producer, many consumers. Each consumer gets a copy of every message.

\`\`\`sysdiag
{
  "title": "Publish-Subscribe Pattern",
  "width": 600,
  "height": 300,
  "nodes": [
    { "id": "producer", "label": "Order Service", "x": 100, "y": 150, "kind": "service" },
    { "id": "topic", "label": "Order Events", "x": 300, "y": 150, "kind": "queue" },
    { "id": "email", "label": "Email Service", "x": 500, "y": 50, "kind": "service" },
    { "id": "analytics", "label": "Analytics", "x": 500, "y": 150, "kind": "service" },
    { "id": "inventory", "label": "Inventory", "x": 500, "y": 250, "kind": "service" }
  ],
  "edges": [
    { "from": "producer", "to": "topic", "label": "publish" },
    { "from": "topic", "to": "email", "label": "broadcast" },
    { "from": "topic", "to": "analytics", "label": "broadcast" },
    { "from": "topic", "to": "inventory", "label": "broadcast" }
  ],
  "annotations": {
    "topic": "All subscribers receive every message. The producer doesn't know who is listening."
  }
}
\`\`\`

**Use case**: Event notification (OrderPlaced triggers email, analytics, and inventory).

### Fan-out / Fan-in

Fan-out: One message triggers multiple parallel tasks. Fan-in: Results are aggregated.

**Use case**: Parallel search across multiple data stores.

## Message Brokers Compared

| Feature | Kafka | RabbitMQ | Amazon SQS |
|---------|-------|----------|-----------|
| Model | Log-based (append) | Queue-based (consume & ack) | Managed queue |
| Throughput | ~1M msg/s per cluster | ~50K msg/s per node | ~3K msg/s (scales automatically) |
| Ordering | Per partition | Per queue | Best-effort (FIFO queues available) |
| Retention | Configurable (days-forever) | Until consumed | 14 days max |
| Replay | Yes (re-read from offset) | No (once consumed, gone) | No |
| Best for | Event streaming, logs | Task queues, RPC | Simple cloud-native queues |

## Delivery Guarantees

| Guarantee | Meaning | Implementation |
|-----------|---------|----------------|
| At-most-once | Message may be lost | Fire and forget (no ack) |
| At-least-once | Message may be duplicated | Ack after processing; retry on failure |
| Exactly-once | Message processed exactly once | Idempotent consumers + deduplication |

\`\`\`callout
{
  "type": "warning",
  "title": "The Exactly-Once Myth",
  "content": "True exactly-once delivery is extremely difficult to achieve in distributed systems. Most \\"exactly-once\\" implementations are actually \\"at-least-once\\" with idempotent processing. The complexity isn't worth it — design for idempotency instead."
}
\`\`\`

**At-least-once + idempotent consumers** is the most practical approach.

### Idempotent Consumer Pattern

\`\`\`trace
{
  "title": "Idempotent Message Processing",
  "language": "python",
  "code": "def process_order_message(msg):\\n    msg_id = msg['id']\\n    \\n    # Check if already processed\\n    if redis.exists(f'processed:{msg_id}'):\\n        print(f'Skipping duplicate: {msg_id}')\\n        msg.ack()\\n        return\\n    \\n    # Process the message\\n    order = msg['payload']\\n    handle_order(order)\\n    \\n    # Mark as processed with TTL\\n    redis.set(f'processed:{msg_id}', '1', ex=86400)\\n    \\n    # Acknowledge\\n    msg.ack()\\n    print(f'Processed: {msg_id}')",
  "frames": [
    { "line": 1, "vars": {"msg": {"id": "order-123", "payload": {"item": "laptop"}}}, "note": "First time processing", "stdout": "" },
    { "line": 5, "vars": {"msg_id": "order-123", "redis.exists": false}, "note": "Not processed before", "stdout": "" },
    { "line": 10, "vars": {"order": {"item": "laptop"}}, "note": "Processing order", "stdout": "Handling order for laptop" },
    { "line": 14, "vars": {}, "note": "Marking as processed", "stdout": "" },
    { "line": 17, "vars": {}, "note": "Acknowledging message", "stdout": "Processed: order-123" },
    { "line": 1, "vars": {"msg": {"id": "order-123", "payload": {"item": "laptop"}}}, "note": "Duplicate arrives", "stdout": "" },
    { "line": 5, "vars": {"msg_id": "order-123", "redis.exists": true}, "note": "Already processed", "stdout": "Skipping duplicate: order-123" }
  ],
  "speed": 800
}
\`\`\`

## Dead Letter Queues (DLQ)

Messages that fail processing repeatedly are moved to a dead letter queue for manual inspection.

\`\`\`
[Main Queue] ──▶ Consumer
                   │ (fails 3 times)
                   ▼
              [Dead Letter Queue] ──▶ Alert + Manual Review
\`\`\`

## Backpressure

When consumers cannot keep up with producers, messages accumulate. Strategies:

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Bounded Queues",
      "content": "**Reject messages when queue is full**\\n\\n\`\`\`python\\n# RabbitMQ example\\nchannel.queue_declare(queue='tasks', arguments={\\n    'x-max-length': 1000,\\n    'x-overflow': 'reject-publish'\\n})\\n\`\`\`\\n\\nForces producer to slow down or handle rejection."
    },
    {
      "label": "Auto-scaling",
      "content": "**Scale consumers based on queue depth**\\n\\n\`\`\`yaml\\n# Kubernetes HPA example\\napiVersion: autoscaling/v2\\nkind: HorizontalPodAutoscaler\\nspec:\\n  scaleTargetRef:\\n    name: order-processor\\n  metrics:\\n  - type: Object\\n    object:\\n      metric:\\n        name: rabbitmq_queue_messages\\n      target:\\n        type: Value\\n        value: \\"30\\"\\n\`\`\`\\n\\nAdd consumers when queue grows."
    },
    {
      "label": "Rate Limiting",
      "content": "**Throttle at the source**\\n\\n\`\`\`javascript\\n// API Gateway rate limiting\\napp.use('/api/orders', rateLimit({\\n  windowMs: 60 * 1000, // 1 minute\\n  max: 100, // limit each IP to 100 requests per minute\\n  message: 'Too many orders created'\\n}));\\n\`\`\`\\n\\nPrevents overwhelming the system."
    }
  ]
}
\`\`\`

## Scale Example: Notification System

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Notification System Scale Calculator",
  "inputs": [
    { "id": "users", "label": "Total Users", "default": 100000000, "min": 1000, "max": 1000000000 },
    { "id": "notifications", "label": "Notifications per User per Day", "default": 10, "min": 1, "max": 100 },
    { "id": "peak", "label": "Peak Multiplier", "default": 5, "min": 1, "max": 20 }
  ]
}
\`\`\`

**Example calculation**:
- Users: 100M
- Notifications/user/day: 10
- Total: 1B notifications/day
- QPS: 1B / 86,400 ≈ 11,600 msg/s (average)
- Peak: 11,600 × 5 ≈ 58,000 msg/s

Kafka partitions needed: 58,000 / 5,000 per partition ≈ 12 partitions
Consumer instances: 12 (one per partition for max throughput)

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Asynchronous messaging decouples services in time and space, preventing cascading failures",
    "Choose the right pattern: Point-to-Point for tasks, Pub-Sub for events, Fan-out/Fan-in for parallel processing",
    "Design for at-least-once delivery with idempotent consumers — it's more practical than exactly-once",
    "Use dead letter queues to handle poison messages and monitor system health",
    "Implement backpressure strategies before your queues become bottlenecks"
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Asynchronous Messaging Quiz",
  "questions": [
    {
      "question": "Which messaging pattern ensures each message is processed exactly once?",
      "options": ["Publish-Subscribe", "Point-to-Point Queue", "Fan-out", "Dead Letter Queue"],
      "answer": 1,
      "explanation": "Point-to-Point queues guarantee that each message is consumed by exactly one consumer, making them ideal for task processing where duplication would be problematic."
    },
    {
      "question": "What's the most practical delivery guarantee for most microservices?",
      "options": ["At-most-once", "Exactly-once", "At-least-once with idempotent consumers", "Fire-and-forget"],
      "answer": 2,
      "explanation": "At-least-once with idempotent consumers balances reliability and complexity. It's easier to implement than exactly-once while preventing data loss."
    },
    {
      "question": "Which broker is best for replaying historical messages?",
      "options": ["RabbitMQ", "Amazon SQS", "Apache Kafka", "Redis Pub/Sub"],
      "answer": 2,
      "explanation": "Kafka's log-based architecture retains messages for configurable periods (days to forever) and allows consumers to replay from any offset."
    }
  ]
}
\`\`\``,
    },
    {
      id: "service-discovery-load-balancing",
      slug: "service-discovery-load-balancing",
      title: "Service Discovery & Load Balancing",
      content: `# Service Discovery & Load Balancing

In a microservices environment, services are dynamic — instances start, stop, scale up, and scale down continuously. Hardcoding IP addresses is impossible. How does Service A find Service B when Service B has 50 instances that change every minute?

\`\`\`concept
{
  "title": "The Dynamic Instance Problem",
  "variant": "mental-model",
  "content": "Imagine a restaurant where waiters change tables every minute. Customers need a way to locate their assigned waiter without memorizing table numbers. Service discovery acts like the restaurant host who maintains a real-time seating chart, directing customers to the right waiter no matter how often they move."
}
\`\`\`

## Service Discovery

Service discovery is the mechanism by which services find each other's network locations.

### Client-Side Discovery

The client queries a service registry and selects an instance.

\`\`\`mermaid
graph LR
    A[Service A] -->|query| R[Service Registry<br/>Consul/Eureka]
    R -->|instances| A
    A -->|select| B[Service B<br/>10.0.1.5:8080]
\`\`\`

**Pros**: No extra hop; client can implement smart load balancing.  
**Cons**: Every client must implement discovery logic.

### Server-Side Discovery

The client sends requests to a load balancer/router, which queries the registry.

\`\`\`mermaid
graph TD
    A[Service A] -->|request| LB[Load Balancer]
    LB -->|query| R[Service Registry]
    LB -->|forward| B1[Service B<br/>Instance 1]
    LB -->|forward| B2[Service B<br/>Instance 2]
    LB -->|forward| B3[Service B<br/>Instance 3]
\`\`\`

**Pros**: Client is simple; discovery logic is centralized.  
**Cons**: Extra network hop; load balancer can be a bottleneck.

### Service Registry Implementations

| Tool | Type | Health Check | Key Feature |
|------|------|-------------|-------------|
| **Consul** | CP (consistent) | HTTP, TCP, gRPC | Multi-datacenter, service mesh |
| **etcd** | CP (Raft consensus) | Lease-based TTL | Kubernetes backing store |
| **ZooKeeper** | CP (ZAB protocol) | Ephemeral nodes | Battle-tested, complex |
| **Eureka** | AP (available) | Heartbeat-based | Netflix OSS, eventual consistency |

\`\`\`quiz
{
  "title": "Service Discovery Patterns",
  "questions": [
    {
      "question": "In client-side discovery, who selects the specific service instance?",
      "options": ["Service registry", "Load balancer", "Client", "DNS server"],
      "answer": 2,
      "explanation": "The client queries the registry for all healthy instances and then applies its own load-balancing logic to pick one."
    },
    {
      "question": "Which registry is AP (Available, Partition-tolerant) rather than CP?",
      "options": ["Consul", "etcd", "ZooKeeper", "Eureka"],
      "answer": 3,
      "explanation": "Eureka favors availability over consistency, accepting that clients may see slightly stale instance lists during network partitions."
    },
    {
      "question": "What is the main drawback of server-side discovery?",
      "options": ["Clients are complex", "Extra network hop", "No health checking", "Requires DNS"],
      "answer": 1,
      "explanation": "Every request traverses the load balancer, adding latency and creating a potential bottleneck."
    }
  ]
}
\`\`\`

### Kubernetes Service Discovery

Kubernetes provides built-in service discovery:

\`\`\`mermaid
graph TD
    subgraph K8s Cluster
        SVC[Service: order-svc<br/>Virtual IP 10.96.0.5]
        SVC --> P1[Pod 1<br/>10.244.1.7]
        SVC --> P2[Pod 2<br/>10.244.2.3]
        SVC --> P3[Pod 3<br/>10.244.3.9]
    end
    Client[Other Pod] -->|http://order-svc:8080| SVC
\`\`\`

DNS-based discovery via CoreDNS. The \`Service\` resource acts as a stable virtual IP that routes to healthy pods.

## Load Balancing

### Algorithms

| Algorithm | Description | Best For |
|-----------|-------------|----------|
| **Round Robin** | Rotate through instances sequentially | Uniform workloads |
| **Weighted Round Robin** | More traffic to beefier instances | Heterogeneous fleet |
| **Least Connections** | Route to instance with fewest active connections | Variable request duration |
| **Consistent Hashing** | Same key always routes to same instance | Caching, sticky sessions |
| **Random** | Pick a random instance | Simple, surprisingly effective |

\`\`\`algoviz
{
  "title": "Round Robin vs Least Connections",
  "type": "array",
  "data": [5, 3, 1, 4],
  "frames": [
    { "highlight": [0], "label": "RR: send to instance 0 (5 active)", "stats": { "algorithm": "Round Robin", "next": 1 } },
    { "highlight": [1], "label": "RR: send to instance 1 (3 active)", "stats": { "algorithm": "Round Robin", "next": 2 } },
    { "highlight": [2], "label": "RR: send to instance 2 (1 active)", "stats": { "algorithm": "Round Robin", "next": 3 } },
    { "highlight": [2], "label": "LC: pick least loaded (1 active)", "stats": { "algorithm": "Least Connections", "best": 2 } }
  ],
  "speed": 1000
}
\`\`\`

### Layer 4 vs Layer 7

\`\`\`
Layer 4 (Transport):              Layer 7 (Application):
┌──────────┐                      ┌──────────┐
│ TCP/UDP  │                      │ HTTP/    │
│ routing  │                      │ gRPC     │
│ by IP:   │                      │ routing  │
│ port     │                      │ by URL,  │
└──────────┘                      │ headers, │
                                  │ cookies  │
Fast, no inspection               └──────────┘
                                  Smart, slower
\`\`\`

**Layer 4** (AWS NLB, HAProxy TCP mode): Routes by IP/port. Very fast, handles millions of connections.

**Layer 7** (AWS ALB, NGINX, Envoy): Routes by URL path, headers, cookies. Can do content-based routing, SSL termination, and request transformation.

### Load Balancing at Scale

A system handling 500K QPS might use this topology:

\`\`\`mermaid
graph TD
    Internet --> DNS[GeoDNS]
    DNS --> L4[Regional L4 LB]
    L4 --> L7[L7 LB Pool]
    L7 --> App1[App 1]
    L7 --> App2[App 2]
    L7 --> AppN[App N]
\`\`\`

GeoDNS routes users to the nearest region. L4 load balancers distribute across L7 load balancers. L7 load balancers route to application instances based on URL path.

## Health Checking

Load balancers must know which instances are healthy:

- **Liveness check**: "Is the process alive?" (TCP connect, HTTP 200)
- **Readiness check**: "Can it handle traffic?" (DB connected, cache warm)

Unhealthy instances are removed from the rotation immediately. This is essential — a single unhealthy instance in a round-robin pool degrades the experience for 1/N of all requests.

\`\`\`callout
{
  "type": "warning",
  "title": "Health Check Pitfall",
  "content": "A naive \`/health\` endpoint that always returns HTTP 200 can hide real issues. Include downstream dependency checks (DB, cache, queue) in your readiness probe so the load balancer stops sending traffic to instances that can't actually serve requests."
}
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
{
  "title": "Cascade Failure",
  "variant": "mental-model",
  "content": "Think of cascade failure like a traffic jam: one broken-down car (Payment Service) blocks the highway, causing miles of backed-up traffic (thread pools). Circuit breakers act like detour signs — they redirect traffic before the jam spreads."
}
\`\`\`

## Circuit Breaker

Inspired by electrical circuit breakers, this pattern monitors calls to a service and "opens the circuit" (stops calling) when failures exceed a threshold.

### Three States

\`\`\`mermaid
stateDiagram-v2
    [*] --> CLOSED: normal operation
    CLOSED --> OPEN: failures > threshold
    OPEN --> HALF_OPEN: timeout expires
    HALF_OPEN --> CLOSED: success
    HALF_OPEN --> OPEN: failure
\`\`\`

- **CLOSED**: Normal operation. Requests pass through. Failures are counted.
- **OPEN**: Failures exceeded threshold. All requests immediately fail (fast-fail) without calling the downstream service. A timer starts.
- **HALF-OPEN**: Timer expired. Allow one test request through. If it succeeds, go to CLOSED. If it fails, go back to OPEN.

### Implementation

\`\`\`playground
{
  "title": "Circuit Breaker in Action",
  "language": "python",
  "code": "import time\\nimport random\\nfrom enum import Enum\\n\\nclass State(Enum):\\n    CLOSED = \\"closed\\"\\n    OPEN = \\"open\\"\\n    HALF_OPEN = \\"half_open\\"\\n\\nclass CircuitBreaker:\\n    def __init__(self, failure_threshold=3, recovery_timeout=5):\\n        self.state = State.CLOSED\\n        self.failure_count = 0\\n        self.failure_threshold = failure_threshold\\n        self.recovery_timeout = recovery_timeout\\n        self.last_failure_time = 0\\n\\n    def call(self, func, *args, **kwargs):\\n        if self.state == State.OPEN:\\n            if time.time() - self.last_failure_time > self.recovery_timeout:\\n                self.state = State.HALF_OPEN\\n                print(\\"⏰ Timeout expired → HALF_OPEN\\")\\n            else:\\n                print(\\"🚫 Circuit OPEN — failing fast\\")\\n                raise Exception(\\"Circuit is OPEN\\")\\n\\n        try:\\n            result = func(*args, **kwargs)\\n            self._on_success()\\n            return result\\n        except Exception as e:\\n            self._on_failure()\\n            raise e\\n\\n    def _on_success(self):\\n        self.failure_count = 0\\n        if self.state == State.HALF_OPEN:\\n            print(\\"✅ Test succeeded → CLOSED\\")\\n        self.state = State.CLOSED\\n\\n    def _on_failure(self):\\n        self.failure_count += 1\\n        self.last_failure_time = time.time()\\n        if self.failure_count >= self.failure_threshold:\\n            print(f\\"💥 {self.failure_count} failures → OPEN\\")\\n            self.state = State.OPEN\\n\\n# Simulate a flaky service\\ndef flaky_service():\\n    if random.random() < 0.7:  # 70% failure rate\\n        raise Exception(\\"Service unavailable\\")\\n    return \\"Success!\\"\\n\\n# Usage\\nbreaker = CircuitBreaker(failure_threshold=3, recovery_timeout=5)\\n\\nfor i in range(10):\\n    try:\\n        result = breaker.call(flaky_service)\\n        print(f\\"Request {i+1}: {result}\\")\\n    except Exception as e:\\n        print(f\\"Request {i+1}: {e}\\")\\n    time.sleep(1)",
  "runnable": true
}
\`\`\`

### Configuration

| Parameter | Typical Value | Purpose |
|-----------|--------------|---------|
| Failure threshold | 5-10 failures | Consecutive failures before opening |
| Recovery timeout | 15-60 seconds | Time before testing recovery |
| Success threshold | 3-5 successes | Successes in half-open before closing |
| Monitoring window | 60 seconds | Window for counting failures |

\`\`\`callout
{
  "type": "warning",
  "title": "Production Tip",
  "content": "Never use a single failure count. Always use a sliding window (e.g., 5 failures in 60 seconds) to avoid false positives from occasional hiccups."
}
\`\`\`

## Retry Pattern

Retries handle transient failures — network blips, temporary overload, brief downtime during deployments.

### Exponential Backoff with Jitter

\`\`\`playground
{
  "title": "Retry with Exponential Backoff",
  "language": "python",
  "code": "import random\\nimport time\\n\\ndef retry_with_backoff(func, max_retries=3, base_delay=1.0):\\n    \\"\\"\\"Retry with exponential backoff and jitter\\"\\"\\"\\n    for attempt in range(max_retries + 1):\\n        try:\\n            return func()\\n        except Exception as e:\\n            if attempt == max_retries:\\n                print(f\\"❌ Final attempt {attempt + 1} failed\\")\\n                raise e\\n\\n            # Exponential backoff: 1s, 2s, 4s\\n            delay = base_delay * (2 ** attempt)\\n            \\n            # Add jitter to prevent thundering herd\\n            jitter = random.uniform(0, delay * 0.5)\\n            actual_delay = delay + jitter\\n            \\n            print(f\\"🔄 Attempt {attempt + 1} failed. \\"\\n                  f\\"Retrying in {actual_delay:.1f}s\\")\\n            time.sleep(actual_delay)\\n\\n# Simulate transient failures\\ndef sometimes_fails():\\n    if not hasattr(sometimes_fails, 'calls'):\\n        sometimes_fails.calls = 0\\n    sometimes_fails.calls += 1\\n    \\n    if sometimes_fails.calls < 3:  # Fail first 2 times\\n        raise Exception(\\"Transient network error\\")\\n    return \\"Success on try #3!\\"\\n\\n# Test the retry\\nresult = retry_with_backoff(sometimes_fails)\\nprint(f\\"🎉 {result}\\")",
  "runnable": true
}
\`\`\`

**Why jitter?** Without jitter, if 1000 clients fail at the same time, they all retry at the same time (thundering herd), causing another failure. Jitter spreads retries across time.

### What to Retry

| Retry | Do Not Retry |
|-------|-------------|
| 500 Internal Server Error | 400 Bad Request |
| 503 Service Unavailable | 401 Unauthorized |
| Connection timeout | 404 Not Found |
| DNS resolution failure | 422 Validation Error |

\`\`\`quiz
{
  "title": "Retry or Circuit Breaker?",
  "questions": [
    {
      "question": "Your service gets a 503 Service Unavailable with 'Database connection pool exhausted'. Which pattern should you use?",
      "options": ["Retry with exponential backoff", "Circuit breaker", "Both", "Neither"],
      "answer": 0,
      "explanation": "503 with connection pool exhaustion is typically transient — the database will recover. Retry with backoff gives it time to stabilize."
    },
    {
      "question": "A downstream service has been returning 500 errors for 5 minutes straight. What should you do?",
      "options": ["Keep retrying every second", "Open the circuit breaker", "Increase retry count", "Use longer backoff"],
      "answer": 1,
      "explanation": "Persistent failures indicate a real problem, not a transient one. Circuit breaker prevents resource exhaustion and gives the service time to recover."
    },
    {
      "question": "Which HTTP status codes should NEVER be retried without special handling?",
      "options": ["500, 503", "408, 429", "400, 401, 404", "All should be retried"],
      "answer": 2,
      "explanation": "4xx errors indicate client-side problems that won't resolve with retries. 400 Bad Request, 401 Unauthorized, and 404 Not Found are permanent failures."
    }
  ]
}
\`\`\`

**Never retry non-idempotent operations** (like charging a credit card) without idempotency keys.

## Bulkhead Pattern

Isolate different call paths so one failing dependency cannot exhaust all resources.

\`\`\`sysdiag
{
  "title": "Bulkhead Isolation in Order Service",
  "width": 600,
  "height": 300,
  "nodes": [
    {"id": "order", "label": "Order Service", "x": 300, "y": 150, "kind": "service"},
    {"id": "payment", "label": "Payment Pool\\n20 threads\\n(Circuit Breaker)", "x": 150, "y": 80, "kind": "storage"},
    {"id": "inventory", "label": "Inventory Pool\\n10 threads", "x": 150, "y": 150, "kind": "storage"},
    {"id": "email", "label": "Email Pool\\n5 threads", "x": 150, "y": 220, "kind": "storage"}
  ],
  "edges": [
    {"from": "order", "to": "payment", "label": "isolated"},
    {"from": "order", "to": "inventory", "label": "isolated"},
    {"from": "order", "to": "email", "label": "isolated"}
  ],
  "annotations": {
    "payment": "If payment service is down, only this pool exhausts. Others keep working.",
    "inventory": "Inventory calls remain healthy even if payment fails.",
    "email": "Non-critical email notifications continue working."
  }
}
\`\`\`

If the payment service is down, only the payment thread pool is exhausted. Inventory and email continue working.

## Combining Patterns

In production, these patterns work together:

\`\`\`mermaid
graph LR
    Request[Request] --> Bulkhead[Bulkhead]
    Bulkhead --> CB[Circuit Breaker]
    CB --> Retry[Retry]
    Retry --> Timeout[Timeout: 2s]
    Timeout --> Service[Service]
\`\`\`

\`\`\`steps
{
  "title": "Request Flow Through Resilience Patterns",
  "steps": [
    {
      "title": "1. Bulkhead Isolation",
      "content": "Request enters a dedicated thread pool for its dependency type. If one pool exhausts, others remain unaffected."
    },
    {
      "title": "2. Circuit Breaker Check",
      "content": "Before making the call, check if circuit is OPEN (fail fast) or CLOSED/HALF_OPEN (proceed). This prevents wasted calls to known-failing services."
    },
    {
      "title": "3. Retry with Backoff",
      "content": "If the call fails with a transient error, retry with exponential backoff and jitter. This handles temporary glitches."
    },
    {
      "title": "4. Timeout Protection",
      "content": "Each attempt has a hard timeout (e.g., 2s) to prevent indefinite blocking. This ensures resources are freed quickly."
    }
  ]
}
\`\`\`

Libraries that implement all of these: **Resilience4j** (Java), **Polly** (.NET), **Hystrix** (legacy Java, Netflix), or implement your own in Python/Go.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Circuit breakers prevent cascade failures by failing fast when a service is unhealthy, giving it time to recover",
    "Retries with exponential backoff handle transient failures but must be used carefully to avoid retry storms",
    "Bulkhead isolation prevents one failing dependency from exhausting all system resources",
    "These patterns work best together: bulkhead → circuit breaker → retry → timeout",
    "Always consider idempotency when retrying operations, especially for financial transactions"
  ]
}
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

In microservices, each service owns its own database. There is no single transaction that spans multiple databases. If the payment succeeds but inventory update fails, you have **data inconsistency**.

\`\`\`concept
{
  "title": "The Distributed Transaction Dilemma",
  "variant": "insight",
  "content": "Traditional ACID transactions break down across service boundaries. Once you split your system into microservices, you lose the ability to rollback changes atomically across multiple databases. This forces architects to choose between consistency and availability — a fundamental trade-off captured by the CAP theorem."
}
\`\`\`

## Two-Phase Commit (2PC) — And Why It Fails at Scale

2PC uses a coordinator to ensure all participants commit or all abort:

\`\`\`
Coordinator ──prepare──▶ Order DB    ✓
            ──prepare──▶ Payment DB  ✓
            ──prepare──▶ Inventory DB ✓
            ──commit───▶ All         ✓
\`\`\`

**Problems at scale:**
- **Blocking** — All participants lock resources during prepare phase
- **Single point of failure** — Coordinator crash leaves participants in limbo
- **Performance** — Latency of the slowest participant × number of participants
- **Availability** — If any participant is unavailable, the entire transaction fails

2PC works for 2-3 participants in the same datacenter. It does not work for microservices at scale.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "2PC Approach",
    "code": "# Centralized coordinator\\nclass TwoPhaseCommit:\\n    def execute(self, order):\\n        # Prepare phase - locks everywhere\\n        order_db.prepare(order)\\n        payment_db.prepare(order.total)\\n        inventory_db.prepare(order.items)\\n        \\n        # Commit phase\\n        order_db.commit()\\n        payment_db.commit()\\n        inventory_db.commit()"
  },
  "after": {
    "label": "Saga Pattern",
    "code": "# Decentralized sequence\\nclass OrderSaga:\\n    def execute(self, order):\\n        order_service.create(order)           # Step 1\\n        payment_service.charge(order.total)   # Step 2\\n        inventory_service.reserve(order.items) # Step 3\\n        # Each step commits independently"
  }
}
\`\`\`

## The Saga Pattern

A saga is a sequence of local transactions. Each service performs its own transaction and publishes an event. If any step fails, compensating transactions undo the previous steps.

\`\`\`
Happy Path:
Order Svc ──create──▶ Payment Svc ──charge──▶ Inventory Svc ──reserve──▶ Done
  (T1)                  (T2)                    (T3)

Failure + Compensation:
Order Svc ──create──▶ Payment Svc ──charge──▶ Inventory Svc ──FAIL
                                                    │
  (C1: cancel)◀──────(C2: refund)◀──────────────────┘
\`\`\`

\`\`\`algoviz
{
  "title": "Saga Execution Flow",
  "type": "array",
  "data": ["Order Created", "Payment Charged", "Inventory Reserved", "Order Shipped"],
  "frames": [
    {"highlight": [0], "label": "Step 1: Order service creates order", "stats": {"status": "running"}},
    {"highlight": [0, 1], "label": "Step 2: Payment service charges card", "stats": {"status": "running"}},
    {"highlight": [0, 1, 2], "label": "Step 3: Inventory service reserves items", "stats": {"status": "running"}},
    {"highlight": [0, 1, 2, 3], "label": "Step 4: Shipping service ships order", "stats": {"status": "success"}}
  ],
  "speed": 1000
}
\`\`\`

### Choreography-Based Saga

Services communicate through events. No central coordinator.

\`\`\`
┌──────────┐    OrderCreated    ┌──────────┐
│ Order    │──────────────────▶│ Payment  │
│ Service  │                   │ Service  │
│          │◀──PaymentFailed───│          │
│(cancel   │                   │          │
│ order)   │                   └────┬─────┘
└──────────┘                        │
                             PaymentSucceeded
                                    │
                                    ▼
                              ┌──────────┐
                              │Inventory │
                              │ Service  │
                              └──────────┘
\`\`\`

**Pros**: Simple, no coordinator, loosely coupled.
**Cons**: Hard to track overall saga state; complex with many steps; risk of cyclic dependencies.

### Orchestration-Based Saga

A central **saga orchestrator** directs each step.

\`\`\`
┌──────────────────────────┐
│    Saga Orchestrator      │
│                          │
│  Step 1: Create Order ───┼──▶ Order Svc
│  Step 2: Charge Payment ─┼──▶ Payment Svc
│  Step 3: Reserve Stock ──┼──▶ Inventory Svc
│  Step 4: Ship ───────────┼──▶ Shipping Svc
│                          │
│  On failure at step N:   │
│  Run compensations       │
│  C(N-1), C(N-2), ... C(1)│
└──────────────────────────┘
\`\`\`

**Pros**: Clear workflow; easy to reason about; saga state in one place.
**Cons**: Orchestrator is a potential bottleneck and single point of failure; more coupling to orchestrator.

\`\`\`quiz
{
  "title": "Choreography vs Orchestration",
  "questions": [
    {
      "question": "Which approach is better for complex workflows with 5+ steps?",
      "options": ["Choreography", "Orchestration", "Both are equally good", "Neither works well"],
      "answer": 1,
      "explanation": "Orchestration handles complexity better because the workflow logic is centralized in the orchestrator, making it easier to understand and modify."
    },
    {
      "question": "What is the main advantage of choreography-based sagas?",
      "options": ["Better visibility", "No single point of failure", "Easier testing", "Faster performance"],
      "answer": 1,
      "explanation": "Choreography avoids a central coordinator, eliminating a single point of failure and allowing services to operate more independently."
    },
    {
      "question": "Which approach makes it harder to understand the overall saga state?",
      "options": ["Choreography", "Orchestration", "Both equally", "Neither"],
      "answer": 0,
      "explanation": "In choreography, the saga state is distributed across multiple services, making it difficult to get a complete picture of the transaction status."
    }
  ]
}
\`\`\`

### Implementation Example

\`\`\`python
class OrderSaga:
    """Orchestration-based saga for order processing."""

    def __init__(self, order_svc, payment_svc, inventory_svc):
        self.order_svc = order_svc
        self.payment_svc = payment_svc
        self.inventory_svc = inventory_svc
        self.completed_steps = []

    def execute(self, order):
        try:
            # Step 1: Create order
            self.order_svc.create(order)
            self.completed_steps.append("order")

            # Step 2: Charge payment
            self.payment_svc.charge(order.user_id, order.total)
            self.completed_steps.append("payment")

            # Step 3: Reserve inventory
            self.inventory_svc.reserve(order.items)
            self.completed_steps.append("inventory")

            return {"status": "success", "order_id": order.id}

        except Exception as e:
            self._compensate(order)
            return {"status": "failed", "reason": str(e)}

    def _compensate(self, order):
        """Run compensating transactions in reverse order."""
        compensations = {
            "inventory": lambda: self.inventory_svc.release(order.items),
            "payment": lambda: self.payment_svc.refund(order.user_id, order.total),
            "order": lambda: self.order_svc.cancel(order.id),
        }

        for step in reversed(self.completed_steps):
            try:
                compensations[step]()
            except Exception as e:
                # Log and alert — manual intervention needed
                log.error(f"Compensation failed for {step}: {e}")
\`\`\`

\`\`\`trace
{
  "title": "Saga Execution Trace",
  "language": "python",
  "code": "saga = OrderSaga(order_svc, payment_svc, inventory_svc)\\nresult = saga.execute(order)\\nprint(f\\"Result: {result}\\")",
  "frames": [
    {"line": 1, "vars": {"saga": "OrderSaga instance", "order": "Order(id=123)"}, "note": "Initialize saga with services"},
    {"line": 2, "vars": {"saga.completed_steps": "[]", "order": "Order(id=123)"}, "note": "Starting saga execution"},
    {"line": 2, "vars": {"saga.completed_steps": "['order']", "order": "Order(id=123)"}, "note": "Order created successfully"},
    {"line": 2, "vars": {"saga.completed_steps": "['order', 'payment']", "order": "Order(id=123)"}, "note": "Payment charged successfully"},
    {"line": 2, "vars": {"saga.completed_steps": "['order', 'payment', 'inventory']", "order": "Order(id=123)"}, "note": "Inventory reserved successfully"},
    {"line": 3, "vars": {"result": "{'status': 'success', 'order_id': 123}"}, "note": "Saga completed successfully"}
  ],
  "speed": 800
}
\`\`\`

## Compensating Transactions

Compensations are not simply "undo." They are **semantic reversal**:

| Action | Compensation | Note |
|--------|-------------|------|
| Create order | Cancel order | Set status to "cancelled" |
| Charge $50 | Refund $50 | Creates a new refund transaction |
| Reserve stock | Release stock | Increment available count |
| Send email | Send cancellation email | Cannot unsend original |

**Key principle**: Compensations must be **idempotent** — running them multiple times produces the same result. This handles the case where the compensation message is delivered more than once.

\`\`\`callout
{
  "type": "warning",
  "title": "Compensation Design Pitfall",
  "content": "Never assume compensations will run exactly once. Design them to be safely repeatable. For example, a refund operation should check if the payment was already refunded before creating a new refund transaction."
}
\`\`\`

## Choreography vs Orchestration

| Factor | Choreography | Orchestration |
|--------|-------------|---------------|
| Coupling | Low (events only) | Medium (orchestrator knows services) |
| Complexity | Grows quickly with steps | Linear growth |
| Visibility | Hard to see overall flow | Clear workflow in one place |
| Testing | Hard (distributed events) | Easier (test orchestrator) |
| Best for | 2-4 simple steps | 4+ steps, complex workflows |

\`\`\`steps
{
  "title": "Choosing Between Choreography and Orchestration",
  "steps": [
    {
      "title": "Step 1: Count Your Steps",
      "content": "If you have 2-4 simple steps, choreography might work. For 5+ steps or complex branching logic, orchestration is usually better."
    },
    {
      "title": "Step 2: Consider Team Structure",
      "content": "Multiple teams owning different services? Choreography reduces coordination. Single team owns the workflow? Orchestration provides better control."
    },
    {
      "title": "Step 3: Evaluate Debugging Needs",
      "content": "Need to trace transaction flow easily? Orchestration provides centralized logging and state management. Choreography requires distributed tracing."
    }
  ]
}
\`\`\`

## Design Tips

1. **Keep sagas short** — Fewer steps means fewer failure modes
2. **Make all steps idempotent** — Messages may be delivered multiple times
3. **Store saga state** — Persist which steps completed for recovery after crashes
4. **Set timeouts** — A step that never responds should trigger compensation
5. **Consider partial success** — Sometimes "best effort" is acceptable (send email failed but order succeeded)

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Sagas replace ACID transactions with eventual consistency across microservices",
    "Choose orchestration for complex workflows, choreography for simple event-driven flows",
    "Compensating transactions must be idempotent and handle semantic reversal, not just technical rollback",
    "Design for failure: store saga state, set timeouts, and plan for manual intervention when compensations fail"
  ]
}
\`\`\``,
    },
  ],
};
