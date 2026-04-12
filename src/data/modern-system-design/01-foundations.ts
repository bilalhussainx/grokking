import { Module } from "../types";

export const foundationsModule: Module = {
  id: "modern-foundations",
  title: "Foundations of Modern System Design",
  description: "Core principles of distributed systems: architectural styles, domain-driven design, and API infrastructure.",
  lessons: [
    {
      id: "intro-modern-system-design",
      slug: "intro-modern-system-design",
      title: "Intro to Modern System Design",
      content: `# Intro to Modern System Design

## Why Modern System Design?

The systems we use daily — messaging apps, streaming platforms, ride-sharing services — serve hundreds of millions of users across the globe. Designing them requires a fundamentally different mindset than building a single-server application.

Modern system design is about making **trade-offs** under constraints: consistency vs. availability, latency vs. throughput, simplicity vs. scalability.

\`\`\`concept
{
  "title": "The Distributed Systems Mindset",
  "variant": "mental-model",
  "content": "A distributed system is a collection of interconnected computational nodes that communicate and coordinate actions by passing messages over a network to achieve a common, shared goal, appearing as a single coherent entity to the end-user. This means your design must account for network failures, partial system outages, and the fundamental impossibility of perfect consistency and availability simultaneously."
}
\`\`\`

## The Scale of Modern Systems

Consider the numbers behind everyday platforms:

| System | Daily Active Users | QPS (peak) | Data Stored |
|--------|-------------------|------------|-------------|
| Slack | 30M+ | ~500K msg/s | Petabytes |
| Netflix | 230M+ | ~1M stream/s | Exabytes |
| Uber | 130M+ users | ~100K ride/s | Petabytes |
| Stripe | Millions of businesses | ~10K txn/s | Petabytes |

These numbers dictate architectural decisions. A system handling 100 QPS can run on a single server; one handling 500K QPS needs a distributed fleet of thousands.

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Scale Impact Calculator",
  "inputs": [
    { "id": "users", "label": "Daily Active Users", "default": 1000000, "min": 1000, "max": 1000000000 },
    { "id": "actions", "label": "Actions per User per Day", "default": 10, "min": 1, "max": 1000 },
    { "id": "size", "label": "Data per Action (bytes)", "default": 200, "min": 10, "max": 10000 }
  ]
}
\`\`\`

## The Design Process

Every system design follows a consistent flow:

\`\`\`steps
{
  "title": "The 5-Step System Design Process",
  "steps": [
    {
      "title": "1. Requirements",
      "content": "Define functional (what the system does) and non-functional (how well it performs) requirements. Example: 'Users can send messages' (functional) vs 'Messages deliver in <100ms' (non-functional)."
    },
    {
      "title": "2. Estimation",
      "content": "Calculate QPS, storage needs, and bandwidth. Quick math prevents over-engineering: 1M users × 10 actions/day = 10M actions/day ≈ 115 QPS average."
    },
    {
      "title": "3. High-Level Architecture",
      "content": "Sketch components and data flow. Identify major services: API gateway, authentication, business logic, data layer."
    },
    {
      "title": "4. Deep Dives",
      "content": "Zoom into hardest subproblems: message ordering, video encoding, payment idempotency. Design specific solutions for each."
    },
    {
      "title": "5. Trade-offs",
      "content": "Articulate what you sacrificed and why. Document alternatives considered and reasons for rejection."
    }
  ]
}
\`\`\`

### Step 1: Requirements

**Functional requirements** describe *what* the system does (send messages, process payments). **Non-functional requirements** describe *how well* it does it (99.99% availability, <200ms latency).

### Step 2: Back-of-the-Envelope Estimation

Quick math prevents over-engineering or under-provisioning:

\`\`\`
Daily messages = 30M users × 40 msgs/day = 1.2B msgs/day
QPS = 1.2B / 86,400 ≈ 14,000 msg/s (average)
Peak QPS = 14,000 × 3 ≈ 42,000 msg/s
Storage per day = 1.2B × 200 bytes = 240 GB/day
\`\`\`

### Step 3: High-Level Architecture

\`\`\`
┌─────────┐     ┌──────────┐     ┌──────────────┐
│ Clients │────▶│ API GW / │────▶│  Services    │
│ (Web,   │     │ Load     │     │  (Auth, Msg, │
│  Mobile)│◀────│ Balancer │◀────│   Feed, etc.)│
└─────────┘     └──────────┘     └──────┬───────┘
                                        │
                              ┌─────────┴─────────┐
                              │  Data Layer        │
                              │  (DB, Cache, Queue)│
                              └────────────────────┘
\`\`\`

### Step 4: Deep Dives

This is where the real engineering lives. We zoom into the hardest subproblems — message ordering, video encoding, payment idempotency — and design specific solutions.

### Step 5: Trade-offs

No design is perfect. Every choice has a cost. The best engineers articulate *why* they chose one option over another.

\`\`\`quiz
{
  "title": "System Design Trade-offs",
  "questions": [
    {
      "question": "If your system needs to handle 1M requests/day with peak traffic 3x average, what's your peak QPS?",
      "options": ["12 QPS", "35 QPS", "115 QPS", "347 QPS"],
      "answer": 1,
      "explanation": "1M requests/day ÷ 86,400 seconds ≈ 11.6 QPS average. Peak = 11.6 × 3 ≈ 35 QPS."
    },
    {
      "question": "Which requirement is NON-functional?",
      "options": ["Users can upload videos", "System has 99.9% uptime", "Users can search for content", "Users can send messages"],
      "answer": 1,
      "explanation": "Uptime is a quality attribute (how well), not a feature (what the system does)."
    },
    {
      "question": "Why do we multiply average QPS by 3 for peak estimation?",
      "options": ["Industry standard buffer", "Accounts for daily patterns", "Handles failure scenarios", "All of the above"],
      "answer": 3,
      "explanation": "The 3x multiplier accounts for daily usage patterns, provides safety buffer, and helps handle partial failures gracefully."
    }
  ]
}
\`\`\`

## What You Will Learn

In this course, we design six real-world systems from scratch:

1. **Slack** — Real-time messaging at scale
2. **Netflix** — Video streaming and CDN architecture
3. **Uber** — Location-aware ride matching
4. **Stripe** — Payment processing with guarantees
5. **Google Docs** — Real-time collaborative editing
6. **Social Network** — News feed and graph-based features

Each module follows the same design process so you build a repeatable framework for any system design interview or real-world architecture decision.

## Key Principles

\`\`\`takeaways
{
  "title": "Key Principles of Modern System Design",
  "items": [
    "Design for failure — Everything will fail. Your system should survive it.",
    "Scale horizontally — Add machines, not bigger machines.",
    "Embrace eventual consistency — Strict consistency rarely scales.",
    "Measure everything — You cannot improve what you cannot observe."
  ]
}
\`\`\`

Let's begin.`,
    },
    {
      id: "monolith-vs-microservices",
      slug: "monolith-vs-microservices",
      title: "Monolith vs Microservices",
      content: `# Monolith vs Microservices

\`\`\`concept
{"title": "Monolith vs Microservices", "variant": "mental-model", "content": "Think of a monolith as a single large factory where every department shares the same building, power supply, and management. Microservices are like a network of specialized workshops, each with its own tools and inventory, connected by delivery trucks."}
\`\`\`

## The Monolith

A monolithic architecture packages all functionality into a single deployable unit. Every feature — authentication, messaging, billing, notifications — lives in one codebase and one process.

\`\`\`sysdiag
{"title": "Monolith Architecture", "width": 600, "height": 300,
 "nodes": [
   {"id": "app", "label": "Monolith Application", "x": 300, "y": 150, "kind": "service"},
   {"id": "auth", "label": "Auth Module", "x": 150, "y": 100, "kind": "component"},
   {"id": "msg", "label": "Messaging", "x": 300, "y": 100, "kind": "component"},
   {"id": "bill", "label": "Billing", "x": 450, "y": 100, "kind": "component"},
   {"id": "db", "label": "Shared Database", "x": 300, "y": 250, "kind": "database"}
 ],
 "edges": [
   {"from": "auth", "to": "app", "label": "calls"},
   {"from": "msg", "to": "app", "label": "calls"},
   {"from": "bill", "to": "app", "label": "calls"},
   {"from": "app", "to": "db", "label": "queries"}
 ],
 "annotations": {
   "app": "Single deployable unit containing all modules",
   "db": "All modules share the same database and transactions"
 }}
\`\`\`

### Advantages
- **Simple to develop** — One repo, one build, one deployment
- **Easy debugging** — In-process calls, single stack trace
- **Low latency** — No network hops between modules
- **ACID transactions** — One database means real transactions

### Disadvantages
- **Scaling is all-or-nothing** — Cannot scale messaging independently of billing
- **Deployment risk** — A bug in notifications can take down the entire application
- **Tech lock-in** — Entire app must use the same language and framework
- **Team coupling** — 50 engineers working in one codebase creates merge conflicts and coordination overhead

## Microservices

Microservices decompose the system into small, independently deployable services, each owning its own data.

\`\`\`sysdiag
{"title": "Microservices Architecture", "width": 600, "height": 350,
 "nodes": [
   {"id": "auth", "label": "Auth Service", "x": 100, "y": 100, "kind": "service"},
   {"id": "msg", "label": "Msg Service", "x": 250, "y": 100, "kind": "service"},
   {"id": "bill", "label": "Bill Service", "x": 400, "y": 100, "kind": "service"},
   {"id": "feed", "label": "Feed Service", "x": 550, "y": 100, "kind": "service"},
   {"id": "authdb", "label": "Auth DB", "x": 100, "y": 250, "kind": "database"},
   {"id": "msgdb", "label": "Msg DB", "x": 250, "y": 250, "kind": "database"},
   {"id": "billdb", "label": "Bill DB", "x": 400, "y": 250, "kind": "database"},
   {"id": "feeddb", "label": "Feed DB", "x": 550, "y": 250, "kind": "database"}
 ],
 "edges": [
   {"from": "auth", "to": "authdb", "label": "owns"},
   {"from": "msg", "to": "msgdb", "label": "owns"},
   {"from": "bill", "to": "billdb", "label": "owns"},
   {"from": "feed", "to": "feeddb", "label": "owns"}
 ],
 "annotations": {
   "auth": "Independent service with its own deployment cycle",
   "msg": "Can be scaled independently based on messaging load"
 }}
\`\`\`

### Advantages
- **Independent scaling** — Scale the messaging service to 100 instances while billing stays at 5
- **Independent deployment** — Ship messaging fixes without touching billing
- **Technology freedom** — Messaging in Go, ML pipeline in Python, billing in Java
- **Team autonomy** — Small teams own small services end-to-end

### Disadvantages
- **Distributed complexity** — Network failures, partial failures, data inconsistency
- **Operational overhead** — Dozens of services to monitor, deploy, and debug
- **Data consistency** — No cross-service transactions; must use sagas or eventual consistency
- **Latency** — Network calls (1-10ms) replace in-process calls (<1μs)

\`\`\`quiz
{"title": "Architecture Trade-offs", "questions": [
  {"question": "Which architecture allows you to scale only the messaging component during high traffic?", "options": ["Monolith only", "Microservices only", "Both architectures", "Neither architecture"], "answer": 1, "explanation": "Microservices allow independent scaling of individual services. In a monolith, you must scale the entire application even if only one component needs more resources."},
  {"question": "What is the primary advantage of a monolith's shared database?", "options": ["Better performance", "ACID transactions", "Easier debugging", "All of the above"], "answer": 3, "explanation": "A shared database enables ACID transactions across all modules, eliminates network calls between services, and provides a single source of truth for debugging."},
  {"question": "When should you consider microservices over a monolith?", "options": ["Team size > 20 engineers", "Need to deploy multiple times daily", "Highly variable scaling needs per feature", "All of the above"], "answer": 3, "explanation": "All these factors indicate that the complexity and scale of your system may benefit from microservices architecture."}
]}
\`\`\`

## When to Choose What

| Factor | Monolith | Microservices |
|--------|----------|---------------|
| Team size | < 10 engineers | > 20 engineers |
| Scale needs | Uniform | Highly variable per feature |
| Deployment frequency | Weekly | Multiple times per day |
| Domain complexity | Low-medium | High (many bounded contexts) |

## The Practical Path

Most successful systems start as a monolith and extract microservices as scaling demands emerge. This is the "monolith-first" approach advocated by Martin Fowler and used by companies like Shopify and Basecamp.

\`\`\`concept
{"title": "Key Insight", "variant": "insight", "content": "Microservices are not a goal — they are a tool for managing complexity at scale. If your system does not need to scale independently, a well-structured monolith is simpler and cheaper."}
\`\`\`

## The Modular Monolith Compromise

A middle ground gaining popularity: keep a single deployment but enforce strict module boundaries with separate databases per module.

\`\`\`compare
{"variant": "before-after", 
 "before": {"label": "Traditional Monolith", "code": "// Everything in one codebase\\nclass Application {\\n  AuthService auth;\\n  MessageService msg;\\n  BillingService bill;\\n  // All share same database connection\\n}"},
 "after": {"label": "Modular Monolith", "code": "// Strict module boundaries\\nmodule AuthModule {\\n  AuthService service;\\n  AuthDatabase db; // Separate DB\\n}\\nmodule MessageModule {\\n  MessageService service;\\n  MessageDatabase db; // Separate DB\\n}"}}
\`\`\`

This gives you module isolation without distributed systems complexity. When a module needs independent scaling, you extract it into a service.

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Start with a monolith unless you have clear scaling needs that require microservices",
  "Microservices trade development simplicity for operational complexity",
  "The modular monolith offers a pragmatic middle ground with module isolation",
  "Extract services gradually as your team size and scaling needs grow",
  "Choose architecture based on your team's size, deployment frequency, and scaling patterns"
]}
\`\`\``,
    },
    {
      id: "event-driven-architecture",
      slug: "event-driven-architecture",
      title: "Event-Driven Architecture",
      content: `# Event-Driven Architecture

## Beyond Request-Response

In traditional architectures, services communicate through synchronous request-response: Service A calls Service B and waits for a reply. This creates **tight coupling** — A must know about B, B must be available, and A blocks until B responds.

Event-driven architecture (EDA) inverts this pattern. Instead of calling services directly, a service **publishes an event** describing what happened. Other services **subscribe** to events they care about and react independently.

\`\`\`concept
{
  "title": "The Mental Model Shift",
  "variant": "mental-model",
  "content": "Think of EDA like a newspaper system. Publishers (services) don't know who reads their articles (events). Subscribers (other services) choose which sections to read without the publisher's knowledge. This creates natural decoupling — publishers and subscribers operate independently."
}
\`\`\`

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Request-Response (Tightly Coupled)",
    "code": "# Service A must know about Service B\\n# A blocks until B responds\\nresponse = requests.post(\\"http://service-b/api/order\\", json=order_data)\\nif response.status_code != 200:\\n    # Handle failure - what if B is down?\\n    raise Exception(\\"Service B unavailable\\")"
  },
  "after": {
    "label": "Event-Driven (Loosely Coupled)",
    "code": "# Service A just publishes an event\\n# Doesn't know or care who consumes it\\nevent_bus.publish(\\"OrderPlaced\\", {\\n    \\"orderId\\": \\"12345\\",\\n    \\"customerId\\": \\"67890\\",\\n    \\"amount\\": 99.99\\n})\\n# Service A continues immediately"
  }
}
\`\`\`

## Core Concepts

### Events vs Commands

- **Event**: A fact that already happened. "OrderPlaced", "PaymentReceived", "UserSignedUp"
- **Command**: A request for something to happen. "PlaceOrder", "ProcessPayment"

Events are immutable facts. They cannot be rejected — they already happened. Commands can succeed or fail.

\`\`\`quiz
{
  "title": "Events vs Commands",
  "questions": [
    {
      "question": "Which of these is an event?",
      "options": ["PlaceOrder", "ProcessPayment", "OrderPlaced", "ChargeCard"],
      "answer": 2,
      "explanation": "\\"OrderPlaced\\" is an event because it describes something that has already happened. The others are commands requesting action."
    },
    {
      "question": "Why can't events be rejected?",
      "options": ["They're immutable facts", "They're encrypted", "They're too large", "They're asynchronous"],
      "answer": 0,
      "explanation": "Events represent things that have already occurred - you can't change the past. This immutability is fundamental to event-driven systems."
    },
    {
      "question": "In EDA, what happens if no service subscribes to an event?",
      "options": ["The event fails", "The producer crashes", "The event is still published", "The system blocks"],
      "answer": 2,
      "explanation": "Producers don't know about consumers in EDA. Events are published regardless of whether anyone is listening, maintaining loose coupling."
    }
  ]
}
\`\`\`

### Event Producers and Consumers

The producer does not know (or care) who consumes the event. This is the key decoupling.

\`\`\`sysdiag
{
  "title": "Event Flow Architecture",
  "width": 600,
  "height": 320,
  "nodes": [
    {"id": "producer", "label": "Order Service", "x": 100, "y": 160, "kind": "service"},
    {"id": "broker", "label": "Message Broker\\n(Kafka/RabbitMQ)", "x": 300, "y": 160, "kind": "storage"},
    {"id": "email", "label": "Email Service", "x": 500, "y": 80, "kind": "service"},
    {"id": "analytics", "label": "Analytics Service", "x": 500, "y": 160, "kind": "service"},
    {"id": "inventory", "label": "Inventory Service", "x": 500, "y": 240, "kind": "service"}
  ],
  "edges": [
    {"from": "producer", "to": "broker", "label": "publishes event"},
    {"from": "broker", "to": "email", "label": "delivers"},
    {"from": "broker", "to": "analytics", "label": "delivers"},
    {"from": "broker", "to": "inventory", "label": "delivers"}
  ],
  "annotations": {
    "producer": "Publishes events without knowing consumers",
    "broker": "Reliable event delivery and storage",
    "email": "Reacts to OrderPlaced events"
  }
}
\`\`\`

## Message Brokers

### Apache Kafka

Kafka is the dominant event streaming platform for high-throughput systems.

\`\`\`algoviz
{
  "title": "Kafka Topic Partitioning",
  "type": "array",
  "data": ["msg1", "msg2", "msg3", "msg4", "msg5", "msg6", "msg7", "msg8", "msg9"],
  "frames": [
    {"highlight": [0], "label": "Partition 0: msg1, msg4, msg7", "stats": {"partition": 0}},
    {"highlight": [1], "label": "Partition 1: msg2, msg5, msg8", "stats": {"partition": 1}},
    {"highlight": [2], "label": "Partition 2: msg3, msg6, msg9", "stats": {"partition": 2}}
  ],
  "speed": 1000
}
\`\`\`

- **Throughput**: Millions of messages/second per cluster
- **Retention**: Messages persist on disk (days to forever)
- **Ordering**: Guaranteed within a partition
- **Consumer groups**: Multiple consumers can process in parallel

### RabbitMQ

Better suited for task queues and complex routing:

- **Lower throughput** than Kafka (~50K msg/s per node)
- **Message acknowledgment** — messages are removed after processing
- **Flexible routing** — topic exchanges, fanout, headers-based routing

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Kafka Use Cases",
      "content": "**Best for:**\\n- Event streaming and log aggregation\\n- High-throughput data pipelines\\n- Event sourcing with long retention\\n- Real-time analytics\\n\\n**Example:** Netflix processes 2 trillion events/day through Kafka for recommendation engines."
    },
    {
      "label": "RabbitMQ Use Cases",
      "content": "**Best for:**\\n- Task queues and worker pools\\n- Complex message routing\\n- Request-reply patterns\\n- Guaranteed single delivery\\n\\n**Example:** Instagram uses RabbitMQ for photo processing workflows with retry logic."
    }
  ]
}
\`\`\`

## Event Sourcing

Instead of storing current state, store the sequence of events that produced that state.

\`\`\`trace
{
  "title": "Event Sourcing in Action",
  "language": "python",
  "code": "class Account:\\n    def __init__(self):\\n        self.balance = 0\\n        self.events = []\\n    \\n    def deposit(self, amount):\\n        self.events.append(f\\"Deposited(\\\\\${amount})\\")\\n        self.balance += amount\\n    \\n    def withdraw(self, amount):\\n        if self.balance >= amount:\\n            self.events.append(f\\"Withdrawn(\\\\\${amount})\\")\\n            self.balance -= amount\\n    \\n    def get_state(self):\\n        return f\\"Current balance: \\\\\${self.balance}\\"\\n\\n# Reconstruct state from events\\naccount = Account()\\naccount.deposit(1000)\\naccount.withdraw(400)\\naccount.deposit(200)\\nprint(account.get_state())",
  "frames": [
    {"line": 1, "vars": {"account": "Account object"}, "note": "New account created"},
    {"line": 11, "vars": {"events": [], "balance": 0}, "note": "Initial state"},
    {"line": 12, "vars": {"events": ["Deposited($1000)"], "balance": 1000}, "note": "First deposit"},
    {"line": 13, "vars": {"events": ["Deposited($1000)", "Withdrawn($400)"], "balance": 600}, "note": "Withdrawal"},
    {"line": 14, "vars": {"events": ["Deposited($1000)", "Withdrawn($400)", "Deposited($200)"], "balance": 800}, "note": "Final deposit"}
  ],
  "speed": 1200
}
\`\`\`

### Benefits
- **Complete audit trail** — Every state change is recorded
- **Temporal queries** — "What was the balance on March 1st?"
- **Debugging** — Replay events to reproduce bugs
- **Event replay** — Rebuild read models or fix data

### Challenges
- **Storage growth** — Events accumulate forever (use snapshots)
- **Eventual consistency** — Read models lag behind writes
- **Schema evolution** — Old events must remain readable as schemas change

## CQRS (Command Query Responsibility Segregation)

Separate the write model (commands) from the read model (queries). Events bridge the two.

\`\`\`concept
{
  "title": "CQRS Separation of Concerns",
  "variant": "insight",
  "content": "CQRS is like having separate entrances for delivery trucks and customers at a warehouse. Delivery trucks (commands) use the loading dock optimized for receiving goods. Customers (queries) use the front entrance designed for browsing. Both serve different needs efficiently without interfering with each other."
}
\`\`\`

This allows you to optimize reads and writes independently — a common need at scale. The write side can use event sourcing while the read side uses denormalized views in Redis or Elasticsearch.

## When to Use EDA

Use event-driven architecture when:
- Multiple services need to react to the same event
- You need to decouple producers from consumers
- You want asynchronous processing (user does not wait)
- You need an audit trail of everything that happened

Avoid when:
- You need immediate, synchronous responses
- Your system is simple enough that direct calls suffice
- You cannot tolerate eventual consistency

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "EDA transforms tight coupling into loose coupling by introducing asynchronous event communication",
    "Events are immutable facts; commands are requests that can fail",
    "Message brokers like Kafka and RabbitMQ serve different use cases - choose based on throughput and routing needs",
    "Event sourcing provides complete audit trail but requires handling storage growth and schema evolution",
    "CQRS separates read and write models, allowing independent optimization of each"
  ]
}
\`\`\``,
    },
    {
      id: "ddd-basics",
      slug: "ddd-basics",
      title: "DDD Basics",
      content: `# Domain-Driven Design Basics

## Why DDD Matters for System Design

Domain-Driven Design (DDD) provides a framework for decomposing complex systems into well-defined boundaries. In system design interviews, DDD helps you decide **where to draw service boundaries** — the single most important architectural decision.

\`\`\`concept
{
  "title": "DDD Philosophy",
  "variant": "mental-model",
  "content": "DDD is a software development philosophy that prioritizes understanding and modeling the core business domain to align software more closely with business needs. Introduced by Eric Evans in 2003, it provides a strategy for navigating complexity by focusing development on the specific business context in which the software operates."
}
\`\`\`

## Core Concepts

### Ubiquitous Language

Every team (engineers, product, business) uses the same terms for the same concepts. If the business calls it an "Order," the code calls it an \`Order\`. Not \`PurchaseRequest\`, not \`Transaction\`, not \`Item\`.

This sounds trivial but prevents an entire category of bugs caused by translation errors between business logic and code.

\`\`\`callout
{
  "type": "warning",
  "title": "Translation Bugs Are Expensive",
  "content": "When engineers use different terms than the business, subtle misunderstandings creep in. A \\"Transaction\\" might be a financial record to engineers but a completed sale to the business. These mismatches cause real production bugs that are hard to catch in testing."
}
\`\`\`

### Bounded Contexts

A bounded context is a boundary within which a particular domain model is defined and applicable. The same word can mean different things in different contexts.

\`\`\`mermaid
graph TD
    A[E-Commerce Context] -->|"Order = items + prices + discounts"| B[Order Entity]
    C[Shipping Context] -->|"Order = address + weight + tracking #"| D[Order Entity]
    
    style A fill:#e1f5fe
    style C fill:#fff3e0
\`\`\`

**Key insight**: Each bounded context maps naturally to a microservice. This is why DDD and microservices are frequently discussed together.

\`\`\`quiz
{
  "title": "Bounded Contexts Quiz",
  "questions": [
    {
      "question": "In an e-commerce system, what does 'Order' mean in the Payment context?",
      "options": ["Items and quantities", "Financial transaction details", "Shipping address", "Customer profile"],
      "answer": 1,
      "explanation": "In the Payment context, 'Order' refers to the financial transaction details - amount, payment method, currency, and payment status."
    },
    {
      "question": "Why should the same term have different meanings in different bounded contexts?",
      "options": ["To confuse developers", "Because business concepts are context-specific", "To make the system more complex", "To avoid naming conflicts"],
      "answer": 1,
      "explanation": "Business concepts naturally have different meanings in different contexts. A shipping department cares about different order attributes than a payment processor."
    },
    {
      "question": "What is the relationship between bounded contexts and microservices?",
      "options": ["No relationship", "Each bounded context maps to a database", "Each bounded context naturally maps to a microservice", "Microservices contain multiple bounded contexts"],
      "answer": 2,
      "explanation": "Bounded contexts provide natural service boundaries. Each context has its own model, language, and data, making them ideal candidates for microservices."
    }
  ]
}
\`\`\`

### Aggregates

An aggregate is a cluster of domain objects treated as a single unit for data changes. Every aggregate has a **root entity** that controls access to the cluster.

\`\`\`sysdiag
{
  "title": "Order Aggregate Structure",
  "width": 600,
  "height": 300,
  "nodes": [
    {"id": "order", "label": "Order\\n(Root Entity)", "x": 300, "y": 150, "kind": "service"},
    {"id": "item1", "label": "OrderItem", "x": 150, "y": 80, "kind": "storage"},
    {"id": "item2", "label": "OrderItem", "x": 150, "y": 220, "kind": "storage"},
    {"id": "address", "label": "ShippingAddress", "x": 450, "y": 150, "kind": "storage"}
  ],
  "edges": [
    {"from": "order", "to": "item1", "label": "contains"},
    {"from": "order", "to": "item2", "label": "contains"},
    {"from": "order", "to": "address", "label": "has"}
  ],
  "annotations": {
    "order": "External objects reference only the root. All changes go through Order.",
    "item1": "OrderItems cannot be accessed directly from outside the aggregate."
  }
}
\`\`\`

**Rules:**
- External objects reference only the root (Order)
- All changes go through the root
- The aggregate is the unit of consistency

### Domain Events

When something important happens in a bounded context, it publishes a domain event. Other contexts can subscribe and react.

\`\`\`mermaid
sequenceDiagram
    participant E as E-Commerce Context
    participant M as Message Bus
    participant S as Shipping Context
    
    E->>E: Order.place()
    E->>M: Publish OrderPlaced Event
    M->>S: Deliver OrderPlaced Event
    S->>S: Create Shipment
\`\`\`

This is how bounded contexts communicate without tight coupling — through events at their boundaries.

## Applying DDD to System Design

### Step 1: Identify Bounded Contexts

For an e-commerce system:

| Context | Responsibility | Core Entities |
|---------|---------------|---------------|
| Catalog | Product info, search | Product, Category |
| Ordering | Cart, checkout, order lifecycle | Order, Cart, OrderItem |
| Payment | Charge processing, refunds | Payment, Refund |
| Shipping | Fulfillment, tracking | Shipment, Carrier |
| Identity | Auth, profiles | User, Session |

### Step 2: Define Context Relationships

Contexts interact through well-defined patterns:

\`\`\`mermaid
graph LR
    O[Ordering] -->|OrderPlaced| P[Payment]
    P -->|PaymentProcessed| O
    O -->|OrderConfirmed| S[Shipping]
    
    style O fill:#e3f2fd
    style P fill:#f3e5f5
    style S fill:#e8f5e9
\`\`\`

### Step 3: Design Anti-Corruption Layers

When integrating with external systems (payment gateways, shipping APIs), use an **anti-corruption layer** (ACL) to translate between their model and yours.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Direct Integration",
    "code": "// Tight coupling to external API\\nclass PaymentService {\\n  async processPayment(order) {\\n    // Forced to use Stripe's terminology\\n    const paymentIntent = await stripe.createPaymentIntent({\\n      amount: order.total_cents,\\n      currency: order.currency_code,\\n      customer: order.buyer_id\\n    });\\n    return paymentIntent.status;\\n  }\\n}"
  },
  "after": {
    "label": "With Anti-Corruption Layer",
    "code": "// Your domain model remains pure\\nclass PaymentService {\\n  async processPayment(order) {\\n    // Work with your domain concepts\\n    const payment = new Payment(order.id, order.total);\\n    return await paymentGateway.process(payment);\\n  }\\n}\\n\\n// ACL handles translation\\nclass StripePaymentGateway {\\n  async process(payment) {\\n    const intent = await stripe.createPaymentIntent({\\n      amount: payment.amountInCents,\\n      currency: payment.currency,\\n      metadata: {orderId: payment.orderId}\\n    });\\n    return this.translateStatus(intent.status);\\n  }\\n}"
  }
}
\`\`\`

## Strategic Patterns

### Context Map

A visual representation of all bounded contexts and their relationships:

- **Conformist**: One context adopts another's model as-is
- **Customer-Supplier**: Upstream context serves downstream's needs
- **Shared Kernel**: Two contexts share a small common model
- **Anticorruption Layer**: Translate between incompatible models

## Common Mistakes

\`\`\`steps
{
  "title": "DDD Pitfalls to Avoid",
  "steps": [
    {
      "title": "Making Aggregates Too Large",
      "content": "An aggregate should be as small as possible while maintaining consistency. A common mistake is including unrelated entities in the same aggregate, leading to performance issues and complex transactions."
    },
    {
      "title": "Sharing Databases Between Contexts",
      "content": "Each bounded context should own its data. Sharing databases creates tight coupling and prevents independent evolution of contexts. Use integration events instead."
    },
    {
      "title": "Ignoring Ubiquitous Language",
      "content": "Inconsistent naming between business and code causes real bugs. If the business calls it a 'Reservation' but code calls it a 'Booking', confusion will arise."
    },
    {
      "title": "Premature Decomposition",
      "content": "Don't start with too many small contexts. Begin with fewer, larger contexts and split as your understanding of the domain grows."
    }
  ]
}
\`\`\`

## DDD in Interviews

When designing a system, explicitly identify bounded contexts early. It demonstrates mature architectural thinking and naturally leads to clean service boundaries.

\`\`\`callout
{
  "type": "tip",
  "title": "Interview Strategy",
  "content": "In system design interviews, start by asking about the business domain and identifying different areas of responsibility. Map these to bounded contexts, then derive your service boundaries. This approach shows you understand both technical and business concerns."
}

\`\`\``,
    },
    {
      id: "api-gateway-service-mesh",
      slug: "api-gateway-service-mesh",
      title: "API Gateway & Service Mesh",
      content: `# API Gateway & Service Mesh

## The Problem

In a microservices architecture, clients need to communicate with dozens of services. Without infrastructure to manage this, every client must:

- Know the address of every service
- Handle authentication for each service
- Implement retry logic, circuit breaking, and timeouts
- Deal with different protocols (REST, gRPC, WebSocket)

This is unsustainable. Two patterns solve this: **API Gateways** (for external traffic) and **Service Meshes** (for internal traffic).

\`\`\`concept
{
  "title": "Traffic Direction Matters",
  "variant": "mental-model",
  "content": "Think of your system as a city:\\n\\n- **North-South traffic** = Highways bringing cars into the city (external clients → services)\\n- **East-West traffic** = Local roads connecting neighborhoods (service → service)\\n\\nAPI Gateways manage the highways. Service Meshes manage the local roads."
}
\`\`\`

## API Gateway

An API Gateway is a single entry point for all client requests. It sits between clients and backend services.

\`\`\`sysdiag
{
  "title": "API Gateway Architecture",
  "width": 600,
  "height": 320,
  "nodes": [
    { "id": "mobile", "label": "Mobile", "x": 80, "y": 60, "kind": "client" },
    { "id": "web", "label": "Web", "x": 80, "y": 160, "kind": "client" },
    { "id": "partner", "label": "Partner API", "x": 80, "y": 260, "kind": "client" },
    { "id": "gateway", "label": "API Gateway", "x": 280, "y": 160, "kind": "gateway" },
    { "id": "auth", "label": "Auth Svc", "x": 480, "y": 60, "kind": "service" },
    { "id": "user", "label": "User Svc", "x": 480, "y": 160, "kind": "service" },
    { "id": "order", "label": "Order Svc", "x": 480, "y": 260, "kind": "service" }
  ],
  "edges": [
    { "from": "mobile", "to": "gateway", "label": "HTTPS" },
    { "from": "web", "to": "gateway", "label": "HTTPS" },
    { "from": "partner", "to": "gateway", "label": "HTTPS" },
    { "from": "gateway", "to": "auth", "label": "route /auth" },
    { "from": "gateway", "to": "user", "label": "route /users" },
    { "from": "gateway", "to": "order", "label": "route /orders" }
  ],
  "annotations": {
    "gateway": "Centralized entry point handling routing, auth, rate limiting, and TLS termination"
  }
}
\`\`\`

### Core Responsibilities

| Function | Description |
|----------|-------------|
| **Routing** | Route requests to the correct backend service |
| **Authentication** | Validate JWT tokens, API keys |
| **Rate Limiting** | Protect backends from traffic spikes (e.g., 1000 req/s per user) |
| **TLS Termination** | Handle HTTPS at the edge |
| **Request Transformation** | Translate between client and service protocols |
| **Response Aggregation** | Combine responses from multiple services into one |
| **Caching** | Cache frequent read requests at the edge |

### Popular API Gateways

- **Kong** — Open-source, Lua-based, plugin ecosystem
- **AWS API Gateway** — Managed, integrates with Lambda
- **Envoy** — High-performance C++ proxy (also used in service mesh)
- **NGINX** — Widely used reverse proxy with API gateway features

### BFF Pattern (Backend for Frontend)

Instead of one gateway for all clients, create specialized gateways per client type:

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Mobile BFF",
      "content": "**Optimized for mobile clients:**\\n- Compressed payloads (Protobuf/MsgPack)\\n- Pagination by default\\n- Offline-first data models\\n- Network-aware retry strategies\\n- Minimal field sets to reduce bandwidth"
    },
    {
      "label": "Web BFF",
      "content": "**Optimized for web clients:**\\n- Rich JSON responses\\n- GraphQL endpoints for flexible queries\\n- Server-sent events for real-time updates\\n- Larger payload sizes acceptable\\n- SEO-optimized responses"
    },
    {
      "label": "Partner API",
      "content": "**Optimized for third-party integration:**\\n- Strict versioning (v1, v2, etc.)\\n- Comprehensive documentation\\n- Webhook support for async updates\\n- Rate limiting per API key\\n- Detailed error codes and troubleshooting"
    }
  ]
}
\`\`\`

## Service Mesh

A service mesh handles **service-to-service** communication within the cluster. It deploys a sidecar proxy alongside every service instance.

\`\`\`algoviz
{
  "title": "Service Mesh Request Flow",
  "type": "array",
  "data": ["Service A", "Sidecar A", "Sidecar B", "Service B"],
  "frames": [
    { "highlight": [0], "label": "Service A initiates request to Service B", "stats": {"step": 1} },
    { "highlight": [0, 1], "label": "Request intercepted by Sidecar A proxy", "stats": {"step": 2} },
    { "highlight": [1, 2], "label": "Sidecar A handles mTLS, load balancing, retries", "stats": {"step": 3} },
    { "highlight": [2, 3], "label": "Sidecar B receives request, validates mTLS", "stats": {"step": 4} },
    { "highlight": [3], "label": "Service B processes request", "stats": {"step": 5} }
  ],
  "speed": 1000
}
\`\`\`

### What the Sidecar Handles

- **mTLS** — Automatic encryption between every service pair
- **Load balancing** — Intelligent routing (least connections, weighted)
- **Circuit breaking** — Stop calling a failing service
- **Retries with backoff** — Automatic retry with exponential backoff
- **Observability** — Distributed tracing, metrics, access logs
- **Traffic management** — Canary deployments, A/B testing, traffic mirroring

### Popular Service Meshes

- **Istio** — Most feature-rich, uses Envoy sidecars, complex to operate
- **Linkerd** — Lightweight, Rust-based proxy, simpler than Istio
- **Consul Connect** — HashiCorp's mesh, integrates with Consul service discovery

## Gateway vs Mesh: When to Use What

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Without Infrastructure",
    "code": "# Client-side complexity\\nmobile_app:\\n  - hardcode 15 service URLs\\n  - implement OAuth2 flow\\n  - handle circuit breakers\\n  - manage retry logic\\n  - parse different response formats\\n\\n# Service-to-service chaos\\nuser_service:\\n  - manual service discovery\\n  - no encryption between services\\n  - custom retry logic in code\\n  - no traffic shaping\\n  - limited observability"
  },
  "after": {
    "label": "With Gateway + Mesh",
    "code": "# Client-side simplicity\\nmobile_app:\\n  - single API Gateway URL\\n  - gateway handles auth\\n  - automatic resilience\\n  - consistent response format\\n\\n# Service-to-service reliability\\nuser_service:\\n  - automatic service discovery\\n  - mTLS encryption by default\\n  - sidecar handles retries\\n  - canary deployments\\n  - full observability stack"
  }
}
\`\`\`

| Concern | API Gateway | Service Mesh |
|---------|------------|--------------|
| Traffic type | North-south (external) | East-west (internal) |
| Auth | Client authentication | Service-to-service mTLS |
| Rate limiting | Per-client/API key | Per-service |
| Protocol | REST/GraphQL to clients | gRPC/HTTP between services |
| Deployment | Central instance(s) | Sidecar per pod |

## Scale Considerations

At scale, the API gateway itself becomes a bottleneck. Solutions:
- **Horizontal scaling** — Run multiple gateway instances behind a load balancer
- **Regional gateways** — Deploy gateways in each region
- **Edge computing** — Push logic to CDN edge nodes (Cloudflare Workers, Lambda@Edge)

\`\`\`quiz
{
  "title": "Gateway vs Mesh Knowledge Check",
  "questions": [
    {
      "question": "Which component handles authentication for external API clients?",
      "options": ["Service Mesh", "API Gateway", "Both equally", "Neither"],
      "answer": 1,
      "explanation": "API Gateways handle external client authentication (OAuth2, API keys) at the edge, while Service Meshes focus on service-to-service mTLS."
    },
    {
      "question": "What type of traffic does a Service Mesh primarily manage?",
      "options": ["North-south traffic", "East-west traffic", "Both directions equally", "Only database traffic"],
      "answer": 1,
      "explanation": "Service Meshes handle east-west traffic - internal service-to-service communication within the cluster."
    },
    {
      "question": "In the BFF pattern, why might a Mobile BFF return different data than a Web BFF?",
      "options": ["Mobile has different authentication", "Mobile requires optimized payloads for bandwidth", "Web BFF is more secure", "Mobile doesn't support JSON"],
      "answer": 1,
      "explanation": "Mobile BFFs optimize for bandwidth-constrained environments with compressed payloads and minimal field sets, while Web BFFs can return richer data."
    }
  ]
}
\`\`\`

A production setup at Uber scale might handle 100K+ requests/second through the gateway layer, requiring dozens of gateway instances with health checking and automatic failover.`,
    },
  ],
};
