import { Module } from "../types";

export const foundationsModule: Module = {
  id: "modern-foundations",
  title: "Foundations of Modern System Design",
  description:
    "Core principles of distributed systems: architectural styles, domain-driven design, and API infrastructure.",
  lessons: [
    {
      id: "intro-modern-system-design",
      slug: "intro-modern-system-design",
      title: "Intro to Modern System Design",
      content: `# Intro to Modern System Design

## Why Modern System Design?

The systems we use daily — messaging apps, streaming platforms, ride-sharing services — serve hundreds of millions of users across the globe. Designing them requires a fundamentally different mindset than building a single-server application.

Modern system design is about making **trade-offs** under constraints: consistency vs. availability, latency vs. throughput, simplicity vs. scalability.

## The Scale of Modern Systems

Consider the numbers behind everyday platforms:

| System | Daily Active Users | QPS (peak) | Data Stored |
|--------|-------------------|------------|-------------|
| Slack | 30M+ | ~500K msg/s | Petabytes |
| Netflix | 230M+ | ~1M stream/s | Exabytes |
| Uber | 130M+ users | ~100K ride/s | Petabytes |
| Stripe | Millions of businesses | ~10K txn/s | Petabytes |

These numbers dictate architectural decisions. A system handling 100 QPS can run on a single server; one handling 500K QPS needs a distributed fleet of thousands.

## The Design Process

Every system design follows a consistent flow:

\`\`\`
1. Requirements → Functional + Non-functional
2. Estimation  → QPS, Storage, Bandwidth
3. High-Level  → Components + Data Flow
4. Deep Dives  → Specific subsystems
5. Trade-offs  → What did we sacrifice?
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

- **Design for failure** — Everything will fail. Your system should survive it.
- **Scale horizontally** — Add machines, not bigger machines.
- **Embrace eventual consistency** — Strict consistency rarely scales.
- **Measure everything** — You cannot improve what you cannot observe.

Let's begin.`,
    },
    {
      id: "monolith-vs-microservices",
      slug: "monolith-vs-microservices",
      title: "Monolith vs Microservices",
      content: `# Monolith vs Microservices

## The Monolith

A monolithic architecture packages all functionality into a single deployable unit. Every feature — authentication, messaging, billing, notifications — lives in one codebase and one process.

\`\`\`
┌────────────────────────────────────┐
│          Monolith Application      │
│  ┌──────┐ ┌──────┐ ┌───────────┐  │
│  │ Auth │ │ Msg  │ │ Billing   │  │
│  └──────┘ └──────┘ └───────────┘  │
│  ┌──────┐ ┌──────┐ ┌───────────┐  │
│  │ Feed │ │Search│ │ Notif.    │  │
│  └──────┘ └──────┘ └───────────┘  │
│         Shared Database            │
└────────────────────────────────────┘
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

\`\`\`
┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
│ Auth │  │ Msg  │  │ Bill │  │ Feed │
│ Svc  │  │ Svc  │  │ Svc  │  │ Svc  │
└──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘
   │         │         │         │
┌──┴──┐  ┌──┴──┐  ┌──┴───┐  ┌──┴──┐
│ DB  │  │ DB  │  │  DB  │  │ DB  │
└─────┘  └─────┘  └──────┘  └─────┘
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

## When to Choose What

| Factor | Monolith | Microservices |
|--------|----------|---------------|
| Team size | < 10 engineers | > 20 engineers |
| Scale needs | Uniform | Highly variable per feature |
| Deployment frequency | Weekly | Multiple times per day |
| Domain complexity | Low-medium | High (many bounded contexts) |

## The Practical Path

Most successful systems start as a monolith and extract microservices as scaling demands emerge. This is the "monolith-first" approach advocated by Martin Fowler and used by companies like Shopify and Basecamp.

**Key insight:** Microservices are not a goal — they are a tool for managing complexity at scale. If your system does not need to scale independently, a well-structured monolith is simpler and cheaper.

## The Modular Monolith Compromise

A middle ground gaining popularity: keep a single deployment but enforce strict module boundaries with separate databases per module.

\`\`\`
┌────────────────────────────────────┐
│         Modular Monolith           │
│  ┌──────────┐  ┌──────────┐       │
│  │ Auth Mod │  │ Msg Mod  │       │
│  │  ┌────┐  │  │  ┌────┐  │       │
│  │  │ DB │  │  │  │ DB │  │       │
│  │  └────┘  │  │  └────┘  │       │
│  └──────────┘  └──────────┘       │
└────────────────────────────────────┘
\`\`\`

This gives you module isolation without distributed systems complexity. When a module needs independent scaling, you extract it into a service.`,
    },
    {
      id: "event-driven-architecture",
      slug: "event-driven-architecture",
      title: "Event-Driven Architecture",
      content: `# Event-Driven Architecture

## Beyond Request-Response

In traditional architectures, services communicate through synchronous request-response: Service A calls Service B and waits for a reply. This creates **tight coupling** — A must know about B, B must be available, and A blocks until B responds.

Event-driven architecture (EDA) inverts this pattern. Instead of calling services directly, a service **publishes an event** describing what happened. Other services **subscribe** to events they care about and react independently.

\`\`\`
Request-Response:          Event-Driven:
A ──req──▶ B               A ──event──▶ [Event Bus]
A ◀──res── B                            ├──▶ B
                                        ├──▶ C
                                        └──▶ D
\`\`\`

## Core Concepts

### Events vs Commands

- **Event**: A fact that already happened. "OrderPlaced", "PaymentReceived", "UserSignedUp"
- **Command**: A request for something to happen. "PlaceOrder", "ProcessPayment"

Events are immutable facts. They cannot be rejected — they already happened. Commands can succeed or fail.

### Event Producers and Consumers

\`\`\`
┌──────────┐    ┌─────────────┐    ┌──────────┐
│ Producer │───▶│  Message     │───▶│ Consumer │
│ (Order   │    │  Broker      │    │ (Email   │
│  Service)│    │  (Kafka,     │    │  Service)│
└──────────┘    │   RabbitMQ)  │    └──────────┘
                └──────┬──────┘
                       │
                ┌──────┴──────┐
                │ Consumer    │
                │ (Analytics) │
                └─────────────┘
\`\`\`

The producer does not know (or care) who consumes the event. This is the key decoupling.

## Message Brokers

### Apache Kafka

Kafka is the dominant event streaming platform for high-throughput systems.

\`\`\`
Topic: "orders" (partitioned by order_id)
┌─────────────────────────────────────┐
│ Partition 0: [msg1] [msg4] [msg7]  │
│ Partition 1: [msg2] [msg5] [msg8]  │
│ Partition 2: [msg3] [msg6] [msg9]  │
└─────────────────────────────────────┘
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

## Event Sourcing

Instead of storing current state, store the sequence of events that produced that state.

\`\`\`
Traditional:                Event Sourced:
┌──────────────────┐        ┌───────────────────────────┐
│ Account          │        │ Event Log                 │
│ balance: \$500    │        │ 1. AccountCreated(\$0)     │
└──────────────────┘        │ 2. Deposited(\$1000)       │
                            │ 3. Withdrawn(\$400)        │
                            │ 4. Deposited(\$200)        │
                            │ 5. Withdrawn(\$300)        │
                            │ Current state: \$500       │
                            └───────────────────────────┘
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

\`\`\`
┌─────────┐    ┌────────────┐    ┌──────────┐
│ Command │───▶│ Write DB   │    │ Read DB  │◀──── Queries
│ (Write) │    │ (Events)   │───▶│ (Views)  │
└─────────┘    └────────────┘    └──────────┘
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
- You cannot tolerate eventual consistency`,
    },
    {
      id: "ddd-basics",
      slug: "ddd-basics",
      title: "DDD Basics",
      content: `# Domain-Driven Design Basics

## Why DDD Matters for System Design

Domain-Driven Design (DDD) provides a framework for decomposing complex systems into well-defined boundaries. In system design interviews, DDD helps you decide **where to draw service boundaries** — the single most important architectural decision.

## Core Concepts

### Ubiquitous Language

Every team (engineers, product, business) uses the same terms for the same concepts. If the business calls it an "Order," the code calls it an \`Order\`. Not \`PurchaseRequest\`, not \`Transaction\`, not \`Item\`.

This sounds trivial but prevents an entire category of bugs caused by translation errors between business logic and code.

### Bounded Contexts

A bounded context is a boundary within which a particular domain model is defined and applicable. The same word can mean different things in different contexts.

\`\`\`
┌─────────────────┐    ┌─────────────────┐
│  E-Commerce      │    │  Shipping        │
│  Context         │    │  Context         │
│                  │    │                  │
│  "Order" =       │    │  "Order" =       │
│  items + prices  │    │  address + weight│
│  + discounts     │    │  + tracking #    │
└─────────────────┘    └─────────────────┘
\`\`\`

**Key insight**: Each bounded context maps naturally to a microservice. This is why DDD and microservices are frequently discussed together.

### Aggregates

An aggregate is a cluster of domain objects treated as a single unit for data changes. Every aggregate has a **root entity** that controls access to the cluster.

\`\`\`
Aggregate: Order
┌──────────────────────────────┐
│  Order (Root)                │
│  ├── OrderItem               │
│  ├── OrderItem               │
│  └── ShippingAddress         │
└──────────────────────────────┘

Rules:
- External objects reference only the root (Order)
- All changes go through the root
- The aggregate is the unit of consistency
\`\`\`

### Domain Events

When something important happens in a bounded context, it publishes a domain event. Other contexts can subscribe and react.

\`\`\`
E-Commerce Context              Shipping Context
┌───────────────┐               ┌───────────────┐
│ Order.place() │──▶ OrderPlaced│──▶ Create      │
│               │    Event      │    Shipment    │
└───────────────┘               └───────────────┘
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

\`\`\`
┌──────────┐         ┌──────────┐
│ Ordering │──event──▶│ Payment  │
│          │◀─event───│          │
└────┬─────┘         └──────────┘
     │ event
     ▼
┌──────────┐
│ Shipping │
└──────────┘
\`\`\`

### Step 3: Design Anti-Corruption Layers

When integrating with external systems (payment gateways, shipping APIs), use an **anti-corruption layer** (ACL) to translate between their model and yours.

\`\`\`
Your Domain          ACL                External API
┌──────────┐    ┌──────────┐    ┌──────────────────┐
│ Payment  │───▶│Translate │───▶│ Stripe API       │
│ (your    │    │ models   │    │ (their concepts) │
│  model)  │◀───│          │◀───│                  │
└──────────┘    └──────────┘    └──────────────────┘
\`\`\`

## Strategic Patterns

### Context Map

A visual representation of all bounded contexts and their relationships:

- **Conformist**: One context adopts another's model as-is
- **Customer-Supplier**: Upstream context serves downstream's needs
- **Shared Kernel**: Two contexts share a small common model
- **Anticorruption Layer**: Translate between incompatible models

## Common Mistakes

1. **Making aggregates too large** — An aggregate should be as small as possible while maintaining consistency
2. **Sharing databases between contexts** — Each bounded context owns its data
3. **Ignoring ubiquitous language** — Inconsistent naming causes real bugs
4. **Premature decomposition** — Start with fewer, larger contexts and split as understanding grows

## DDD in Interviews

When designing a system, explicitly identify bounded contexts early. It demonstrates mature architectural thinking and naturally leads to clean service boundaries.`,
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

## API Gateway

An API Gateway is a single entry point for all client requests. It sits between clients and backend services.

\`\`\`
┌─────────┐
│ Mobile  │──┐
└─────────┘  │     ┌──────────────┐     ┌──────────┐
             ├────▶│  API Gateway │────▶│ Auth Svc │
┌─────────┐  │     │              │     └──────────┘
│  Web    │──┤     │  - Routing   │     ┌──────────┐
└─────────┘  │     │  - Auth      │────▶│ User Svc │
             │     │  - Rate Limit│     └──────────┘
┌─────────┐  │     │  - TLS Term  │     ┌──────────┐
│ Partner │──┘     │  - Caching   │────▶│ Order Svc│
│   API   │        └──────────────┘     └──────────┘
└─────────┘
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

\`\`\`
┌────────┐     ┌──────────────┐
│ Mobile │────▶│ Mobile BFF   │──┐
└────────┘     └──────────────┘  │    ┌──────────┐
                                 ├───▶│ Services │
┌────────┐     ┌──────────────┐  │    └──────────┘
│  Web   │────▶│  Web BFF     │──┘
└────────┘     └──────────────┘
\`\`\`

Mobile BFF returns compressed, minimal payloads. Web BFF returns richer data. Each optimizes for its client's needs.

## Service Mesh

A service mesh handles **service-to-service** communication within the cluster. It deploys a sidecar proxy alongside every service instance.

\`\`\`
┌─────────────────────┐  ┌─────────────────────┐
│  Service A Pod      │  │  Service B Pod      │
│  ┌───────┐ ┌──────┐│  │┌──────┐ ┌───────┐  │
│  │ App A │─│Proxy ││──▶││Proxy │─│ App B │  │
│  └───────┘ └──────┘│  │└──────┘ └───────┘  │
└─────────────────────┘  └─────────────────────┘
         ▲                        ▲
         └────────┬───────────────┘
           ┌──────┴──────┐
           │ Control     │
           │ Plane       │
           │ (Config,    │
           │  Certs,     │
           │  Policies)  │
           └─────────────┘
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

A production setup at Uber scale might handle 100K+ requests/second through the gateway layer, requiring dozens of gateway instances with health checking and automatic failover.`,
    },
  ],
};
