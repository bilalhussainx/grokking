import { Module } from "../types";

export const microservicesAndArchitecturePatternsModule: Module = {
  id: "microservices-and-architecture-patterns",
  title: "Microservices & Modern Architecture Patterns",
  description: "Master microservices decomposition, event-driven architecture, CQRS, and the operational patterns that make distributed services maintainable at scale.",
  lessons: [
    {
      id: "monolith-to-microservices",
      slug: "monolith-to-microservices",
      title: "Monolith to Microservices: When and How to Decompose",
      content: `# Monolith to Microservices: When and How to Decompose

\`\`\`concept
{
  "title": "The Migration Fallacy",
  "body": "Microservices don't automatically make systems faster, cheaper, or more reliable. They trade **deployment coupling** for **operational complexity**. You should migrate when: independent scaling of components would save significant cost, teams are blocked by deployment coupling, or fault isolation is critical. You should stay monolithic when: the team is small, the domain is not well-understood, or operational maturity is low."
}
\`\`\`

## When NOT to Decompose

\`\`\`compare
{
  "title": "Monolith vs Microservices",
  "left": {
    "label": "Stay Monolithic When...",
    "points": [
      "Team < 10 engineers (communication overhead wins)",
      "Domain not yet understood — early-stage product",
      "No DevOps maturity (K8s, observability, CI/CD pipelines)",
      "Low traffic — single server handles load easily",
      "Transactions span many entities (complex distributed tx)"
    ]
  },
  "right": {
    "label": "Decompose When...",
    "points": [
      "Deployment of one feature blocks all other teams",
      "Components have radically different scaling needs",
      "Failure in one area cascades to the entire product",
      "Teams own clear bounded contexts (DDD)",
      "Performance bottleneck is isolated to one subsystem"
    ]
  }
}
\`\`\`

## Domain-Driven Decomposition

\`\`\`concept
{
  "title": "Bounded Contexts — The Unit of Decomposition",
  "body": "A bounded context is a domain area with a clear boundary where a specific domain model applies. In e-commerce: Order Management, Inventory, Payments, Shipping, User Profiles are bounded contexts. A microservice should own exactly one bounded context. The boundary is defined by where the ubiquitous language (domain terminology) changes — 'order' means something different to fulfillment vs accounting."
}
\`\`\`

## The Strangler Fig Pattern

\`\`\`steps
{
  "steps": [
    { "title": "Route all traffic through a facade", "description": "Place an API Gateway / facade in front of the monolith. Initially it proxies 100% of requests to the monolith unchanged." },
    { "title": "Extract one bounded context", "description": "Identify a low-risk, well-bounded feature (e.g., User Profiles). Build it as a new microservice. Migrate its DB tables out of the monolith DB." },
    { "title": "Redirect traffic", "description": "Update the facade to route /users/* to the new service. Monolith no longer handles user requests. Dual-write period during migration if zero-downtime needed." },
    { "title": "Repeat until monolith is empty", "description": "Iteratively extract bounded contexts. The monolith 'strangled' by the fig vine — eventually removed entirely or left as a residual service." }
  ]
}
\`\`\`

## Conway's Law

\`\`\`concept
{
  "title": "Organizations Build Systems that Mirror Their Structure",
  "body": "Conway's Law: 'Organizations design systems that mirror their own communication structure.' If your org has 3 teams, you'll build 3 subsystems whether or not that's the right decomposition. The **Inverse Conway Maneuver**: design your team structure to match the target architecture, then let the architecture emerge naturally. Don't fight Conway — use it."
}
\`\`\`

\`\`\`quiz
{
  "question": "A startup with 5 engineers has a working monolith handling 1,000 requests/minute. The CTO proposes migrating to microservices to 'be ready for scale'. What is the most important concern?",
  "options": [
    "Microservices require a different programming language",
    "The operational overhead of service discovery, distributed tracing, and independent deployments outweighs the benefits at this scale",
    "Microservices always have higher latency than monoliths",
    "The database cannot be split without downtime"
  ],
  "answer": 1,
  "explanation": "At 5 engineers and 1,000 RPM, the monolith is not the bottleneck. Microservices require operational maturity: container orchestration, service meshes, distributed tracing, circuit breakers, and independent CI/CD pipelines. These demand significant DevOps investment. The premature migration often slows product velocity and introduces failure modes (network partitions, partial failures) the team isn't equipped to handle."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Decompose along bounded contexts (domain-driven design), not along technical layers (MVC split is wrong)",
    "The Strangler Fig pattern enables zero-downtime incremental migration via a routing facade",
    "Conway's Law: your system will mirror your org structure — use the Inverse Conway Maneuver to design teams before architecture",
    "Operational maturity (K8s, tracing, CI/CD) is a prerequisite for microservices, not a consequence of them"
  ]
}
\`\`\``,
    },
    {
      id: "event-driven-architecture",
      slug: "event-driven-architecture",
      title: "Event-Driven Architecture and the Outbox Pattern",
      content: `# Event-Driven Architecture and the Outbox Pattern

\`\`\`concept
{
  "title": "The Dual Write Problem",
  "body": "In microservices, a common pattern is: save data to DB, then publish an event to Kafka. This **dual write** has a fatal flaw: the DB write can succeed and the Kafka publish can fail (or vice versa). Now your DB and event stream are inconsistent. Two services disagree about what happened. The Outbox Pattern solves this atomically."
}
\`\`\`

## Event-Driven vs Request-Driven

\`\`\`compare
{
  "title": "Orchestration vs Choreography",
  "left": {
    "label": "Orchestration (request-driven)",
    "points": [
      "Central orchestrator calls each service",
      "Easy to trace and debug (single flow)",
      "Tight coupling: orchestrator knows all services",
      "Single point of failure at orchestrator",
      "Good for: business workflows with clear steps"
    ]
  },
  "right": {
    "label": "Choreography (event-driven)",
    "points": [
      "Services react to events, no central controller",
      "Loose coupling: services don't know each other",
      "Hard to trace end-to-end flow without tooling",
      "Highly resilient: failure is isolated",
      "Good for: decoupled, scalable integrations"
    ]
  }
}
\`\`\`

## The Outbox Pattern

\`\`\`concept
{
  "title": "Atomic DB Write + Event Publish",
  "body": "Write the business record AND an outbox event row in a single DB transaction. A separate **Relay** process reads unsent outbox rows and publishes them to Kafka, then marks them sent. Because the DB transaction is atomic, either both the business record and the outbox row commit, or neither does. The relay handles the eventual publish — never lost, never duplicated (idempotent consumer)."
}
\`\`\`

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Application code (single tx)",
      "content": "BEGIN;\\nINSERT INTO orders (id, user_id, total) VALUES (\\$1, \\$2, \\$3);\\nINSERT INTO outbox (event_type, payload, sent)\\n  VALUES ('ORDER_CREATED', '{\\\"orderId\\\": \\$1}', false);\\nCOMMIT;\\n-- If Kafka is down, outbox row stays. Relay retries."
    },
    {
      "label": "Relay process",
      "content": "Loop:\\n  SELECT * FROM outbox WHERE sent=false ORDER BY created_at LIMIT 100;\\n  FOR each row:\\n    publish(row.event_type, row.payload) to Kafka;\\n    UPDATE outbox SET sent=true WHERE id=row.id;\\n  SLEEP 100ms"
    },
    {
      "label": "CDC alternative (Debezium)",
      "content": "No relay code needed.\\nDebezium reads PostgreSQL WAL (write-ahead log) directly.\\nEvery INSERT/UPDATE/DELETE becomes a Kafka event.\\nZero application change — DB as event log.\\nTrade-off: operational complexity of running Debezium."
    }
  ]
}
\`\`\`

## Event Sourcing

\`\`\`concept
{
  "title": "Events as the Source of Truth",
  "body": "Instead of storing current state (balance = \\$100), store the event log (CREDITED +50, DEBITED -30, CREDITED +80). Current state is derived by replaying events. Benefits: full audit trail, time-travel queries, easy event replay for new consumers. Cost: event schema evolution is hard, replaying millions of events for current state requires periodic **snapshots**."
}
\`\`\`

\`\`\`sysdiag
{
  "title": "Outbox Pattern Architecture",
  "nodes": [
    { "id": "api", "label": "Order Service API", "type": "service" },
    { "id": "db", "label": "PostgreSQL (orders + outbox)", "type": "database" },
    { "id": "relay", "label": "Outbox Relay / Debezium", "type": "service" },
    { "id": "kafka", "label": "Kafka", "type": "queue" },
    { "id": "inv", "label": "Inventory Service", "type": "service" },
    { "id": "notif", "label": "Notification Service", "type": "service" }
  ],
  "edges": [
    { "from": "api", "to": "db", "label": "single transaction" },
    { "from": "db", "to": "relay", "label": "poll unsent / WAL" },
    { "from": "relay", "to": "kafka", "label": "publish event" },
    { "from": "kafka", "to": "inv", "label": "ORDER_CREATED" },
    { "from": "kafka", "to": "notif", "label": "ORDER_CREATED" }
  ]
}
\`\`\`

\`\`\`quiz
{
  "question": "An Order Service writes to PostgreSQL and then publishes to Kafka. The publish fails after the DB commit. What is the resulting system state?",
  "options": [
    "The DB rolls back automatically when Kafka fails",
    "The order exists in the DB but downstream services (inventory, notifications) never receive the event",
    "Kafka will retry and eventually deliver the event",
    "The order is written twice — once successfully, once in a compensating transaction"
  ],
  "answer": 1,
  "explanation": "Without the Outbox Pattern, a dual write failure leaves the DB committed but Kafka unpublished. Downstream services never see the ORDER_CREATED event. Inventory is not reserved. Confirmation email is never sent. The DB and event bus are inconsistent. The Outbox Pattern solves this by keeping the event in the DB until the relay successfully publishes it."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Dual write (DB + Kafka in separate operations) is unsafe — either can fail after the other succeeds",
    "Outbox Pattern: write business row + outbox event in one DB transaction; relay publishes asynchronously",
    "Debezium CDC reads the PostgreSQL WAL to publish events without any application code change",
    "Event sourcing stores events as the source of truth; snapshots prevent full replay on read"
  ]
}
\`\`\``,
    },
    {
      id: "cqrs-and-event-sourcing",
      slug: "cqrs-and-event-sourcing",
      title: "CQRS and Event Sourcing",
      content: `# CQRS and Event Sourcing

\`\`\`concept
{
  "title": "Separating Reads and Writes",
  "body": "CQRS — Command Query Responsibility Segregation — uses separate models for writes (Commands) and reads (Queries). The write model enforces business rules and emits events. The read model is a denormalized, query-optimized projection built from those events. Result: writes are normalized and consistent; reads are fast, pre-joined, and tailored to each UI view."
}
\`\`\`

## The Problem CQRS Solves

\`\`\`compare
{
  "title": "Traditional vs CQRS",
  "left": {
    "label": "Traditional CRUD",
    "points": [
      "Same model for reads and writes",
      "Complex JOIN queries for every read",
      "Write optimizations hurt read performance",
      "Read optimizations (indexes) slow writes",
      "Hard to scale reads and writes independently"
    ]
  },
  "right": {
    "label": "CQRS",
    "points": [
      "Write model: normalized, consistent, event-emitting",
      "Read model: denormalized projections per use case",
      "Scale read replicas independently of write primary",
      "Each read model optimized for one query pattern",
      "Eventual consistency between write and read sides"
    ]
  }
}
\`\`\`

## Event Sourcing with Projections

\`\`\`steps
{
  "steps": [
    { "title": "Command arrives", "description": "PlaceOrder command validated by domain logic. If valid, emits OrderPlaced event to event store." },
    { "title": "Event stored", "description": "Event appended to append-only event log (Kafka or EventStoreDB). This is the write-side source of truth." },
    { "title": "Projections consume events", "description": "Multiple projectors read the event stream. Each builds a different read model: OrderSummaryView (for customer), OrderFulfillmentView (for warehouse), AnalyticsDailyView (for BI)." },
    { "title": "Reads hit projections", "description": "API queries hit denormalized read tables — simple SELECT, no JOINs. Sub-millisecond responses from pre-built views." },
    { "title": "Snapshot periodically", "description": "After N events, snapshot current aggregate state. Future replay starts from latest snapshot, not event 0." }
  ]
}
\`\`\`

\`\`\`sysdiag
{
  "title": "CQRS + Event Sourcing Architecture",
  "nodes": [
    { "id": "cmd", "label": "Command Handler", "type": "service" },
    { "id": "es", "label": "Event Store (append-only)", "type": "database" },
    { "id": "proj1", "label": "Customer View Projector", "type": "service" },
    { "id": "proj2", "label": "Fulfillment View Projector", "type": "service" },
    { "id": "read1", "label": "customer_orders table", "type": "database" },
    { "id": "read2", "label": "fulfillment_queue table", "type": "database" },
    { "id": "api", "label": "Query API", "type": "service" }
  ],
  "edges": [
    { "from": "cmd", "to": "es", "label": "append event" },
    { "from": "es", "to": "proj1", "label": "stream events" },
    { "from": "es", "to": "proj2", "label": "stream events" },
    { "from": "proj1", "to": "read1", "label": "upsert" },
    { "from": "proj2", "to": "read2", "label": "upsert" },
    { "from": "api", "to": "read1", "label": "SELECT" },
    { "from": "api", "to": "read2", "label": "SELECT" }
  ]
}
\`\`\`

## Eventual Consistency Trade-off

\`\`\`concept
{
  "title": "The Read Lag Problem",
  "body": "Between event written and projection updated, there is a lag (typically 10-100 ms). A user places an order and immediately refreshes — they might not see it. Mitigation strategies: (1) Return the command result directly to the client (optimistic UI update), (2) Poll with exponential backoff until the projection catches up, (3) Include event sequence number in responses and reject stale reads."
}
\`\`\`

\`\`\`quiz
{
  "question": "In a CQRS system, a customer places an order (command), then immediately queries their order list (query). The projection has not yet updated. What is the BEST mitigation?",
  "options": [
    "Query the write-side event store directly for read operations",
    "Return the new order data from the command response and update the UI optimistically, without waiting for the projection",
    "Block the command handler until all projections have updated",
    "Use a 5-second delay before all query responses to guarantee projection consistency"
  ],
  "answer": 1,
  "explanation": "Optimistic UI update: the command API returns the new order in its response body. The client displays it immediately without waiting for the query side. The projection will catch up within milliseconds. Blocking the command until projections update defeats CQRS's purpose (decoupling). Querying the event store on every read re-introduces the write-side query problem."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "CQRS: separate write model (normalized, event-emitting) from read model (denormalized, query-optimized projections)",
    "Event sourcing: append events to an immutable log; derive current state by replaying; periodic snapshots for efficiency",
    "Each projection is an independent read model optimized for one query pattern — add projections without changing write side",
    "Eventual consistency lag (10-100 ms) is mitigated by optimistic UI updates from command responses"
  ]
}
\`\`\``,
    },
    {
      id: "data-mesh-and-lake-architecture",
      slug: "data-mesh-and-lake-architecture",
      title: "Data Mesh, Data Lake, and Analytical Architectures",
      content: `# Data Mesh, Data Lake, and Analytical Architectures

\`\`\`concept
{
  "title": "OLTP vs OLAP — Two Fundamentally Different Workloads",
  "body": "OLTP (Online Transaction Processing): high concurrency, small row-level reads/writes, normalized schema, millisecond latency. OLAP (Online Analytical Processing): low concurrency, full-table scans, aggregations over billions of rows, columnar storage, minute-level latency. Running analytics on your OLTP database is the most common performance mistake in growing systems."
}
\`\`\`

## Lambda Architecture

\`\`\`compare
{
  "title": "Lambda vs Kappa Architecture",
  "left": {
    "label": "Lambda (batch + streaming)",
    "points": [
      "Batch layer: recompute full dataset periodically (accurate)",
      "Speed layer: streaming for recent data (approximate)",
      "Serving layer: merges batch + speed results",
      "Complexity: maintain two separate processing paths",
      "Use when: historical accuracy matters, late-arriving data common"
    ]
  },
  "right": {
    "label": "Kappa (streaming only)",
    "points": [
      "Single streaming pipeline handles all data",
      "Reprocessing: replay the event log with new logic",
      "Simpler: one code path, one framework",
      "Requires replayable event log (Kafka retention)",
      "Use when: reprocessing is fast, late data is bounded"
    ]
  }
}
\`\`\`

## Medallion Architecture (Data Lake)

\`\`\`steps
{
  "steps": [
    { "title": "Bronze (raw ingestion)", "description": "Raw data landed as-is from source systems. No transformation. Schema-on-read. Preserves original data for reprocessing. Stored in object storage (S3/GCS) as Parquet or JSON." },
    { "title": "Silver (cleansed)", "description": "Deduplication, type casting, null handling, schema enforcement applied. Joins across sources normalized. Used by data analysts and ML feature engineering." },
    { "title": "Gold (business aggregates)", "description": "Pre-computed aggregations, KPIs, denormalized tables for BI dashboards and business reporting. Schema optimized for query tools (Tableau, Looker, Redash)." }
  ]
}
\`\`\`

## Columnar Storage — Why Parquet

\`\`\`concept
{
  "title": "Column-Oriented Storage for Analytics",
  "body": "Row-oriented storage (PostgreSQL): each row stored contiguously — fast for full-row reads. Column-oriented storage (Parquet, ORC): each column stored contiguously — SELECT SUM(revenue) reads only the revenue column, skipping all other columns. For a 1 TB table with 100 columns and a query touching 3 columns, Parquet reads 30 GB vs 1 TB for row storage. 33× less I/O."
}
\`\`\`

## Data Mesh

\`\`\`concept
{
  "title": "Distributed Data Ownership",
  "body": "Data Mesh challenges the centralized data lake model. Instead of a central data engineering team owning all pipelines, each **domain team** owns their data as a product: they publish clean, versioned, documented data products that other teams consume. Four principles: (1) domain ownership, (2) data as a product, (3) self-serve data platform, (4) federated computational governance."
}
\`\`\`

\`\`\`sysdiag
{
  "title": "Modern Data Platform",
  "nodes": [
    { "id": "oltp", "label": "OLTP DBs (PostgreSQL, MySQL)", "type": "database" },
    { "id": "kafka", "label": "Kafka (event streams)", "type": "queue" },
    { "id": "ingest", "label": "Ingestion (Debezium/Fivetran)", "type": "service" },
    { "id": "bronze", "label": "Bronze Layer (S3/GCS raw)", "type": "database" },
    { "id": "silver", "label": "Silver Layer (cleansed Parquet)", "type": "database" },
    { "id": "gold", "label": "Gold Layer (aggregates)", "type": "database" },
    { "id": "dw", "label": "Data Warehouse (Snowflake/BigQuery)", "type": "database" },
    { "id": "bi", "label": "BI Tools (Tableau/Looker)", "type": "client" }
  ],
  "edges": [
    { "from": "oltp", "to": "kafka", "label": "CDC" },
    { "from": "kafka", "to": "ingest" },
    { "from": "ingest", "to": "bronze" },
    { "from": "bronze", "to": "silver", "label": "Spark/dbt" },
    { "from": "silver", "to": "gold", "label": "dbt models" },
    { "from": "gold", "to": "dw", "label": "load" },
    { "from": "dw", "to": "bi" }
  ]
}
\`\`\`

\`\`\`quiz
{
  "question": "An analytics query runs SELECT SUM(revenue) FROM sales WHERE year=2025. The table has 500 columns and 1 B rows. Why is Parquet dramatically faster than PostgreSQL row storage for this query?",
  "options": [
    "Parquet uses better compression algorithms than PostgreSQL",
    "Parquet stores each column contiguously, so only the revenue column is read from disk — skipping all 499 other columns",
    "Parquet precomputes SUM aggregations at write time",
    "PostgreSQL cannot handle 1 B rows but Parquet can"
  ],
  "answer": 1,
  "explanation": "Columnar storage reads only the queried columns. For 500 columns touching 2 (revenue + year filter), that's 2/500 = 0.4% of the data. Row storage reads every column for every row even though 498 columns are discarded. The I/O advantage is proportional to (columns scanned / total columns). Combined with predicate pushdown (year filter applied at storage level), columnar reads are typically 10-100× faster for analytics queries."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "OLTP and OLAP have opposite optimization requirements — never run analytics on your production OLTP database",
    "Lambda architecture: batch (accuracy) + streaming (recency) merged at serving layer; Kappa: streaming only with replay",
    "Medallion architecture: Bronze (raw) → Silver (cleansed) → Gold (aggregates) in a data lake",
    "Parquet columnar storage reads only queried columns — 10-100× less I/O than row storage for analytical queries"
  ]
}
\`\`\``,
    },
    {
      id: "multi-region-deployment",
      slug: "multi-region-deployment",
      title: "Multi-Region Deployment and Global Traffic Routing",
      content: `# Multi-Region Deployment and Global Traffic Routing

\`\`\`concept
{
  "title": "Why Multi-Region?",
  "body": "Three drivers: (1) **Latency** — users in Tokyo shouldn't wait for a response from us-east-1 (200 ms RTT vs 5 ms local), (2) **Availability** — a regional AWS outage shouldn't take down the global service, (3) **Data sovereignty** — GDPR requires EU user data to stay in EU. Multi-region adds significant complexity — only adopt it when these drivers justify the cost."
}
\`\`\`

## Active-Active vs Active-Passive

\`\`\`compare
{
  "title": "Multi-Region Topologies",
  "left": {
    "label": "Active-Passive (Primary + DR)",
    "points": [
      "All traffic served from primary region",
      "Secondary region is standby (replica, not serving)",
      "Failover: manual or automatic, minutes to switch",
      "Simpler: no cross-region consistency to manage",
      "Cost: secondary region runs at reduced capacity",
      "RTO: minutes; RPO: seconds (async replication lag)"
    ]
  },
  "right": {
    "label": "Active-Active (All regions serve)",
    "points": [
      "All regions serve traffic simultaneously",
      "Users routed to nearest region (GeoDNS)",
      "Much lower latency globally",
      "Complexity: cross-region conflict resolution for writes",
      "Cost: full capacity in every region",
      "RTO: seconds (automatic reroute); RPO: near-zero"
    ]
  }
}
\`\`\`

## Global Traffic Routing

\`\`\`steps
{
  "steps": [
    { "title": "GeoDNS", "description": "DNS resolver returns different IP addresses based on the client's geography. Tokyo user → ap-northeast-1 load balancer. London user → eu-west-1 load balancer. TTL 60 s — fast rerouting on region failure." },
    { "title": "Anycast", "description": "Multiple servers share the same IP address. BGP routing sends client to the topologically nearest server. Used by CDNs (Cloudflare) and DNS resolvers. No DNS TTL delay — routing is at IP layer." },
    { "title": "Health-based failover", "description": "Health checks on regional endpoints. If ap-northeast-1 health check fails, GeoDNS/Global Load Balancer removes it from rotation. Traffic shifts to next-nearest region." }
  ]
}
\`\`\`

## Data Replication Challenges

\`\`\`concept
{
  "title": "The Write Conflict Problem",
  "body": "In active-active, if a user updates their profile in Tokyo and New York simultaneously (network partition), both regions accept the write. When the partition heals, you have two versions. Conflict resolution strategies: Last-Write-Wins (LWW, timestamp-based, risk of data loss), CRDT (convergent data types, merge mathematically), or Application-level conflict resolution (vector clocks + business logic)."
}
\`\`\`

## Cell Architecture

\`\`\`concept
{
  "title": "Failure Blast Radius Reduction",
  "body": "Rather than 'region = unit of failure', cell architecture divides users into isolated **cells** (e.g., user 1-10M in cell-1, 10M-20M in cell-2). A bug or outage in cell-1 doesn't affect cell-2. Traffic routing sends each user deterministically to their cell. Cells are typically within a region; cells in multiple regions provide geo + isolation benefits together."
}
\`\`\`

\`\`\`sysdiag
{
  "title": "Active-Active Multi-Region",
  "nodes": [
    { "id": "dns", "label": "GeoDNS / Global LB", "type": "service" },
    { "id": "us", "label": "us-east-1 (App + DB Primary)", "type": "service" },
    { "id": "eu", "label": "eu-west-1 (App + DB Primary)", "type": "service" },
    { "id": "ap", "label": "ap-northeast-1 (App + DB Primary)", "type": "service" },
    { "id": "repl", "label": "Async Cross-Region Replication", "type": "queue" }
  ],
  "edges": [
    { "from": "dns", "to": "us", "label": "US users" },
    { "from": "dns", "to": "eu", "label": "EU users" },
    { "from": "dns", "to": "ap", "label": "APAC users" },
    { "from": "us", "to": "repl" },
    { "from": "eu", "to": "repl" },
    { "from": "ap", "to": "repl" },
    { "from": "repl", "to": "us", "label": "replicate" },
    { "from": "repl", "to": "eu", "label": "replicate" },
    { "from": "repl", "to": "ap", "label": "replicate" }
  ]
}
\`\`\`

\`\`\`quiz
{
  "question": "Your app uses active-passive multi-region. The primary region (us-east-1) fails. Async replication was running with a 5-second lag. What is the RPO of your system?",
  "options": [
    "Zero — async replication has no data loss",
    "5 seconds — writes in the last 5 seconds before failure are lost",
    "The time it takes to promote the secondary — typically 5-10 minutes",
    "Indeterminate — cannot be calculated without knowing write frequency"
  ],
  "answer": 1,
  "explanation": "RPO (Recovery Point Objective) = maximum data loss accepted. With 5-second async replication lag, any writes that reached the primary but hadn't yet replicated to the secondary are lost when the primary fails. RPO = replication lag at the time of failure. RTO (Recovery Time Objective) is how long to restore service — the failover/promotion time, which is separate from RPO."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Active-passive: simpler, but minutes-scale RTO and seconds-scale RPO (async lag); active-active: seconds RTO but requires conflict resolution",
    "GeoDNS routes users to nearest region by geography; Anycast routes at IP layer with no DNS TTL delay",
    "Write conflicts in active-active require a resolution strategy: LWW (risk loss), CRDT (merge), or application logic",
    "Cell architecture limits blast radius — a bug or outage in one cell doesn't affect other cells even within the same region"
  ]
}
\`\`\``,
    },
    {
      id: "checkpoint-architecture-patterns",
      slug: "checkpoint-architecture-patterns",
      title: "Checkpoint: Refactor a Monolith into Event-Driven Microservices",
      content: `# Checkpoint: Refactor a Monolith into Event-Driven Microservices

\`\`\`callout
{ "variant": "info", "title": "Module Checkpoint", "content": "Apply everything from this module: bounded context identification, the Strangler Fig migration, Outbox Pattern for reliable event publishing, and CQRS for scalable reads. Work through the case study below before checking answers." }
\`\`\`

## Case Study: E-Commerce Monolith

A monolithic e-commerce application handles: user registration, product catalog, inventory, order placement, payment processing, email notifications, and analytics reporting — all in one Rails app with a single PostgreSQL database.

**Problems:** Deploying a payment bug fix requires redeploying the entire app. Analytics queries slow down the production DB. Email notification failures roll back orders. The inventory team and payment team are blocked by each other's deployments.

## Step 1: Identify Bounded Contexts

\`\`\`collapse
{
  "title": "Answer: Bounded Context Map",
  "content": "1. User Identity (registration, auth, profiles)\\n2. Product Catalog (browsing, search, product data)\\n3. Inventory (stock levels, reservations)\\n4. Order Management (cart, checkout, order lifecycle)\\n5. Payments (payment processing, refunds, ledger)\\n6. Notifications (email, SMS, push)\\n7. Analytics (reporting, dashboards)\\n\\nEach context gets its own service and DB schema. Payments and Inventory are highest priority — they have the most isolation benefit."
}
\`\`\`

## Step 2: Define Domain Events

\`\`\`collapse
{
  "title": "Answer: Key Domain Events",
  "content": "ORDER_PLACED → triggers: Inventory.reserve(), Payments.charge(), Notifications.sendConfirmation()\\nPAYMENT_SUCCEEDED → triggers: Order.markPaid(), Notifications.sendReceipt()\\nPAYMENT_FAILED → triggers: Order.markFailed(), Inventory.release(), Notifications.sendFailure()\\nINVENTORY_RESERVED → triggers: Order.proceedToPayment()\\nINVENTORY_INSUFFICIENT → triggers: Order.cancel(), Notifications.sendOutOfStock()"
}
\`\`\`

## Step 3: Migration Plan

\`\`\`steps
{
  "steps": [
    { "title": "Add API facade", "description": "Route all traffic through an API Gateway. Monolith still handles everything." },
    { "title": "Extract Notifications first", "description": "Low risk, no DB dependencies from other services. Build standalone. Redirect notification calls." },
    { "title": "Extract Payments", "description": "Highest isolation value. New Payments service + dedicated DB. Use Outbox Pattern for payment events." },
    { "title": "Extract Inventory", "description": "Add optimistic locking to inventory DB. Emit INVENTORY_RESERVED events via Outbox." },
    { "title": "Wire events between services", "description": "Order Service emits ORDER_PLACED to Kafka. Inventory and Payments subscribe. Remove direct RPC calls." },
    { "title": "Add CQRS for Analytics", "description": "Analytics consumes all domain events, builds denormalized read tables. Remove analytics queries from OLTP DB." }
  ]
}
\`\`\`

## Quiz Battery

\`\`\`quiz
{
  "question": "The Order Service saves the order and then calls the Notification Service's REST API to send a confirmation email. The notification call fails due to a network timeout. What happens to the order?",
  "options": [
    "The order remains but no email is sent — system is inconsistent",
    "The order transaction rolls back automatically",
    "The notification is retried by the HTTP client indefinitely",
    "The user receives a 500 error and must re-place the order"
  ],
  "answer": 0,
  "explanation": "Synchronous cross-service calls create coupling. A notification failure should not fail the order — these are different bounded contexts. The fix: Order Service publishes ORDER_PLACED event via Outbox Pattern. Notification Service subscribes and sends email independently. Order placement never fails because of a notification issue."
}
\`\`\`

\`\`\`quiz
{
  "question": "You want the Analytics team to query order and payment data without hitting the production OLTP databases. Which pattern best solves this?",
  "options": [
    "Add read replicas to each service's database and grant Analytics direct access",
    "Analytics service subscribes to domain events (ORDER_PLACED, PAYMENT_SUCCEEDED) and builds its own denormalized read models",
    "Move all services to a single shared database for Analytics convenience",
    "Create a nightly export from each database to Analytics via ETL"
  ],
  "answer": 1,
  "explanation": "The Analytics service consuming domain events is the CQRS/event-driven approach: each domain emits its events, Analytics builds read-optimized projections tailored to reporting queries. This decouples Analytics completely from OLTP DBs. Read replicas still couple Analytics to individual DB schemas. A shared DB reintroduces the monolith problem. Nightly ETL has 24-hour staleness."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Decompose by business bounded context (Payments, Inventory, Notifications) not by technical layer",
    "Strangler Fig: extract lowest-risk services first (Notifications), highest-value second (Payments)",
    "Replace synchronous cross-service calls with domain events + Outbox Pattern for resilience",
    "Analytics is a natural CQRS read model: subscribes to all events, builds denormalized tables, never touches OLTP DBs"
  ]
}
\`\`\``,
    },
  ],
};
