import { Module } from "../types";

export const dataStorageAndDatabasesModule: Module = {
  id: "data-storage-and-databases",
  title: "Data Storage & Database Design",
  description: "Choose the right database for every workload — relational, document, column-family, graph, time-series — and design schemas that scale.",
  lessons: [
    {
      id: "sql-vs-nosql",
      slug: "sql-vs-nosql",
      title: "SQL vs NoSQL: Choosing the Right Database",
      content: `# SQL vs NoSQL: Choosing the Right Database

Every system design decision eventually comes down to one question: *where does the data live, and how does it get retrieved?* Choose the wrong database and you'll either fight your schema every sprint or watch your system buckle under load. Choose right and the database becomes invisible — it just works.

This lesson gives you a durable mental model for making that choice.

---

## The Core Distinction

\`\`\`concept
{ "title": "The Fundamental Divide", "variant": "mental-model", "content": "SQL databases enforce a rigid, predefined schema — every row in a table has the same columns, and relationships are expressed through foreign keys and joins. NoSQL databases are schema-flexible — documents, key-value pairs, wide columns, or graph edges can evolve without a migration. This is not a quality difference. It is a structural philosophy difference that ripples into consistency, scalability, and query patterns." }
\`\`\`

Think of it this way:

\`\`\`concept
{ "title": "The Spreadsheet vs. the Notebook", "variant": "analogy", "content": "A SQL database is like a well-structured spreadsheet: every column is labelled, every cell has a type, and adding a new field requires adding a column for every row — even empty ones. A NoSQL database is like a dynamic notebook: each page (document) can have different fields. You can add 'phone_number' to the next entry without touching any prior entries. Both are useful. The spreadsheet excels at aggregation and joins; the notebook excels at flexibility and speed." }
\`\`\`

---

## SQL Databases: Structure and Consistency

\`\`\`tabs
{ "tabs": [
  {
    "label": "What They Are",
    "icon": "🗄️",
    "content": "SQL (Structured Query Language) databases are **relational** — data is stored in tables with rows and columns. Relationships between entities are modelled as foreign keys.\\n\\n**Schema:** Fixed and predefined. You define columns and types before inserting data.\\n\\n**Query language:** ANSI SQL — the same core syntax across MySQL, PostgreSQL, Oracle, and SQL Server.\\n\\n**Examples:** PostgreSQL, MySQL, MariaDB, Oracle, SQL Server."
  },
  {
    "label": "ACID Guarantees",
    "icon": "🔒",
    "content": "SQL databases follow **ACID** properties:\\n\\n- **Atomicity** — a transaction either fully commits or fully rolls back. No partial writes.\\n- **Consistency** — the database moves from one valid state to another. Constraints are always enforced.\\n- **Isolation** — concurrent transactions don't interfere with each other.\\n- **Durability** — once committed, data survives crashes.\\n\\nThis makes SQL the default for anything that touches money, inventory, or legal records."
  },
  {
    "label": "Scaling Model",
    "icon": "📈",
    "content": "SQL databases typically scale **vertically** — you add more CPU, RAM, or disk to a single machine.\\n\\nHorizontal scaling (adding more servers) is possible via **read replicas** and **sharding**, but joins across shards are expensive and schemas must be carefully designed to minimise cross-shard operations.\\n\\nAt very high write throughput, a single-node SQL primary becomes a bottleneck."
  },
  {
    "label": "Strengths & Weaknesses",
    "icon": "⚖️",
    "content": "**Strengths:**\\n- Strong consistency and integrity guarantees\\n- Powerful query engine — complex multi-table JOINs, aggregations, window functions\\n- Mature tooling, monitoring, and operational knowledge\\n- Ideal for complex relational data with many cross-references\\n\\n**Weaknesses:**\\n- Schema migrations can be painful at scale (ALTER TABLE on 500M rows)\\n- Vertical scaling has hardware limits\\n- Semi-structured or highly variable data is awkward to model\\n- Can become a write bottleneck under extreme load"
  }
]}
\`\`\`

---

## NoSQL Databases: Flexibility and Scale

NoSQL is not one thing — it's a family of four distinct storage models, each optimised for a different access pattern.

\`\`\`tabs
{ "tabs": [
  {
    "label": "Key-Value",
    "icon": "🔑",
    "content": "**Model:** Map of unique keys to arbitrary values (strings, bytes, JSON).\\n\\n**Access pattern:** O(1) reads and writes by key. No query language — you get exactly what you put in.\\n\\n**Best for:** Session storage, user preferences, caching, rate limiting.\\n\\n**Examples:** Redis, DynamoDB (in key-value mode), Memcached.\\n\\n**Real world:** Twitter stores user session tokens in Redis. A lookup for 'is this user authenticated?' must be sub-millisecond — a SQL JOIN would be orders of magnitude slower."
  },
  {
    "label": "Document",
    "icon": "📄",
    "content": "**Model:** JSON-like documents grouped into collections. Each document can have a different structure.\\n\\n**Access pattern:** Fetch a document by ID, or query by field values. Documents are self-contained — you rarely need to join across collections.\\n\\n**Best for:** User profiles, product catalogues, CMS content, any entity with variable fields.\\n\\n**Examples:** MongoDB, CouchDB, Firestore.\\n\\n**Real world:** An e-commerce product catalogue where electronics have 'voltage' and 'wattage' but clothing has 'size' and 'material'. A document store handles this naturally; SQL requires nullable columns or an EAV anti-pattern."
  },
  {
    "label": "Column-Family",
    "icon": "📊",
    "content": "**Model:** Rows identified by a key, but columns are grouped into families and sparse — a row only stores the columns it actually has.\\n\\n**Access pattern:** Extremely fast writes (append-only log structure); range scans by row key.\\n\\n**Best for:** Time-series, event logs, IoT sensor data, write-heavy workloads at scale.\\n\\n**Examples:** Apache Cassandra, HBase, Google Bigtable.\\n\\n**Real world:** Netflix uses Cassandra to store viewing history. Each user's history is a row; each show watched is a column. Billions of events per day with linear write throughput as nodes are added."
  },
  {
    "label": "Graph",
    "icon": "🕸️",
    "content": "**Model:** Nodes (entities) and edges (relationships), both with properties.\\n\\n**Access pattern:** Traverse multi-hop relationships efficiently. Finding 'friends of friends who live in London' is a graph query, not a chain of JOINs.\\n\\n**Best for:** Social networks, fraud detection, recommendation engines, knowledge graphs.\\n\\n**Examples:** Neo4j, Amazon Neptune, ArangoDB.\\n\\n**Real world:** LinkedIn models the professional graph in a graph database. 'Second-degree connections' is a two-hop traversal — trivial in Neo4j, but a self-join on a 900M-row users table in SQL would be catastrophic."
  }
]}
\`\`\`

---

## Head-to-Head: Key Differences

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "SQL — Banking Transaction", "code": "BEGIN;\\n  UPDATE accounts SET balance = balance - 500 WHERE id = 'alice';\\n  UPDATE accounts SET balance = balance + 500 WHERE id = 'bob';\\nCOMMIT;\\n-- If either UPDATE fails, the entire transaction rolls back.\\n-- Alice's money never disappears into the void." }, "after": { "label": "NoSQL — User Activity Log", "code": "// MongoDB — each event is a self-contained document\\ndb.events.insertOne({\\n  userId: 'alice',\\n  action: 'page_view',\\n  page: '/checkout',\\n  metadata: { referrer: 'email_campaign_42', device: 'mobile' },\\n  timestamp: new Date()\\n});\\n// Schema evolves freely — 'metadata' varies per event type.\\n// Write throughput scales horizontally across shards." } }
\`\`\`

| Dimension | SQL | NoSQL |
|---|---|---|
| Schema | Fixed, predefined | Flexible, schema-less |
| Consistency model | ACID | BASE (Basically Available, Soft state, Eventually consistent) |
| Scaling direction | Vertical (primary), Horizontal (with effort) | Horizontal by design |
| Query power | Rich — JOINs, aggregations, window functions | Limited — optimised for known access patterns |
| Relationship handling | Native — foreign keys, JOINs | Application-level |
| Migration cost | High — schema changes lock tables | Low — add fields freely |

\`\`\`callout
{ "type": "info", "title": "BASE vs ACID", "content": "Many NoSQL databases trade ACID for **BASE**: Basically Available (the system stays up), Soft state (data may be temporarily inconsistent across replicas), Eventually consistent (replicas converge given enough time). This trade-off enables the horizontal scalability that makes Cassandra or DynamoDB viable at billions of events per day — but it means your application must tolerate stale reads." }
\`\`\`

---

## The Decision Framework

When you're in a system design interview or architecting a real system, use this sequence:

\`\`\`steps
{ "title": "How to Choose a Database", "steps": [
  { "title": "Map your data's shape", "content": "**Is it structured and relational?** Entities have clear, stable fields and meaningful relationships to other entities (orders → line items → products → inventory). **→ SQL**.\\n\\n**Is it semi-structured or highly variable?** Fields differ per record, or the schema will evolve rapidly. **→ Document or Column-Family NoSQL**.\\n\\n**Is it a graph?** The primary queries traverse multi-hop relationships. **→ Graph NoSQL**." },
  { "title": "Analyse your access patterns", "content": "List your top 5 query types:\\n\\n- Mostly **point lookups by ID** at very high throughput → Key-Value or Document\\n- **Complex joins and aggregations** across multiple entities → SQL\\n- **Range scans** over time (last 30 days of events per user) → Column-Family\\n- **Traversal queries** (find path between two nodes) → Graph\\n\\nNoSQL databases are optimised for *predictable, pre-known* access patterns. If your queries are ad-hoc and exploratory, SQL's flexible query engine is a better fit." },
  { "title": "Determine your consistency requirements", "content": "**Is consistency non-negotiable?** Financial transactions, inventory deduction, booking systems — where two concurrent writes must never produce an impossible state. **→ SQL (ACID)**.\\n\\n**Is eventual consistency acceptable?** Social feeds, analytics counters, user preferences, activity logs. A user's follower count being 1 second stale is invisible to users. **→ NoSQL (BASE)** gives you the scalability headroom you need." },
  { "title": "Project your scale", "content": "- **Write throughput < 10k/sec, data < a few TB:** SQL handles this comfortably. Don't over-engineer.\\n- **Write throughput 10k–100k+/sec, data in hundreds of TB:** NoSQL (Cassandra, DynamoDB) scales linearly by adding nodes.\\n- **Read-heavy with caching:** Add Redis in front of SQL — the SQL store stays authoritative, Redis handles the hot path.\\n- **Schema migration velocity matters:** If your product iterates weekly with changing data fields, a document database removes the migration bottleneck." },
  { "title": "Consider operational maturity", "content": "SQL databases have **decades of operational tooling**: backup strategies, replication topologies, query optimisers, and an enormous pool of DBAs who know them cold.\\n\\nNoSQL databases require **expertise in their specific consistency models and operational quirks** — Cassandra's tunable consistency, DynamoDB's capacity planning, Redis's eviction policies. Don't adopt a new database type without someone on the team who has operated it in production." }
]}
\`\`\`

---

## Real-World Architecture Patterns

### How Major Systems Actually Choose

\`\`\`tabs
{ "tabs": [
  {
    "label": "Instagram",
    "icon": "📸",
    "content": "**PostgreSQL** for the social graph — user accounts, relationships, and posts where referential integrity and complex queries matter.\\n\\n**Cassandra** for media activity and timelines — write throughput from hundreds of millions of users generating events simultaneously.\\n\\n**Redis** for session tokens, feed caches, and counters.\\n\\n**Lesson:** Instagram started SQL-only. As write volume grew, they added Cassandra specifically for the parts of the system that couldn't scale vertically — not as a wholesale replacement."
  },
  {
    "label": "Netflix",
    "icon": "🎬",
    "content": "**MySQL** (via RDS) for billing, subscriber accounts, and anything involving money — ACID guarantees are non-negotiable.\\n\\n**Cassandra** for viewing history, playback state, and per-device progress — billions of writes per day, each user's state is independent, eventual consistency is fine.\\n\\n**DynamoDB** for personalisation metadata and feature flags.\\n\\n**Lesson:** Netflix's choice was driven by access pattern, not preference. Billing data and viewing history have completely different consistency and throughput requirements."
  },
  {
    "label": "Uber",
    "icon": "🚗",
    "content": "**PostgreSQL** for driver and rider profiles, trips, and payments.\\n\\n**Redis** for driver location (updated every 4 seconds per active driver — millions of concurrent writes, purely cache-like).\\n\\n**Schemaless (custom document store over MySQL)** for trip lifecycle events.\\n\\n**Lesson:** Uber found that even location data — seemingly a perfect Redis use case — had edge cases requiring durability, leading to a custom hybrid. The 'right' database is rarely obvious upfront."
  },
  {
    "label": "LinkedIn",
    "icon": "💼",
    "content": "**Espresso** (internal document store) for member profiles — flexible schema as new profile fields are added continuously.\\n\\n**Voldemort** (key-value) for session and A/B test data.\\n\\n**Neo4j-inspired** graph infrastructure for the professional connection graph — 'People You May Know' traverses hundreds of millions of edges.\\n\\n**MySQL** for billing, ads, and financial records.\\n\\n**Lesson:** LinkedIn's graph is their product differentiator. They built custom graph infrastructure rather than forcing a relational model onto a fundamentally graph-shaped problem."
  }
]}
\`\`\`

---

## The Hybrid Architecture

Most real systems at scale use both SQL and NoSQL — not as a compromise, but because different subsystems genuinely have different requirements.

\`\`\`sysdiag
{ "title": "Typical Hybrid Database Architecture", "width": 700, "height": 380, "nodes": [ { "id": "app", "label": "Application Layer", "x": 350, "y": 40, "kind": "service" }, { "id": "redis", "label": "Redis\\n(Cache / Sessions)", "x": 120, "y": 180, "kind": "cache" }, { "id": "pg", "label": "PostgreSQL\\n(Transactional)", "x": 350, "y": 220, "kind": "database" }, { "id": "mongo", "label": "MongoDB\\n(Catalogue / Profiles)", "x": 580, "y": 180, "kind": "database" }, { "id": "cassandra", "label": "Cassandra\\n(Event Log / Analytics)", "x": 350, "y": 340, "kind": "database" } ], "edges": [ { "from": "app", "to": "redis", "label": "hot reads" }, { "from": "app", "to": "pg", "label": "transactions" }, { "from": "app", "to": "mongo", "label": "flexible data" }, { "from": "app", "to": "cassandra", "label": "event writes" }, { "from": "pg", "to": "cassandra", "label": "async fan-out" } ], "annotations": { "redis": "Sub-millisecond reads for sessions, rate limiting, and feed caches. Data is ephemeral — Redis is never the source of truth.", "pg": "Source of truth for users, orders, and payments. ACID guarantees protect financial consistency.", "mongo": "Product catalogue and user profiles where schema evolves frequently. Documents are self-contained, avoiding JOIN overhead.", "cassandra": "Append-only event log. Scales linearly with write volume. Eventual consistency is acceptable for analytics." } }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Start with SQL, Add NoSQL Surgically", "content": "The most common mistake is adopting NoSQL prematurely. SQL handles the majority of workloads well up to hundreds of millions of rows. Add a specialised NoSQL store only when you can articulate *exactly* which access pattern SQL cannot serve — not because NoSQL 'sounds more scalable'." }
\`\`\`

---

## Common Misconceptions

\`\`\`collapse
{ "title": "Deep Dive: Myths about SQL vs NoSQL", "content": "**Myth 1: NoSQL is always faster.**\\nNoSQL is faster for its *target access pattern*. A Redis GET is faster than a SQL SELECT for a single key because Redis skips the query planner, holds data in memory, and has no schema validation overhead. But a SQL JOIN across three tables is far faster than the equivalent application-level join you'd have to write manually in MongoDB.\\n\\n**Myth 2: NoSQL doesn't support transactions.**\\nModern NoSQL databases increasingly support transactions. MongoDB added multi-document ACID transactions in 4.0. DynamoDB supports transactions across items. The trade-off is that these transactions are generally scoped to a single node or partition — cross-partition transactions are expensive.\\n\\n**Myth 3: SQL can't scale.**\\nPostgreSQL routinely handles billions of rows with proper indexing, partitioning, and read replicas. Instagram ran on PostgreSQL at 400M users. The bottleneck is usually the write primary — which is addressable with CQRS, read replicas, and connection pooling before you need to migrate away.\\n\\n**Myth 4: You must choose one.**\\nPolyglot persistence — using multiple database types in a single system — is the norm at scale. The question is not 'SQL or NoSQL' but 'SQL for what, and which NoSQL for what'." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "SQL vs NoSQL: Decision Scenarios", "questions": [
  {
    "question": "You are building a payment processing system for an e-commerce platform. Users can make concurrent purchases, and inventory must never go negative. Which database property is most critical?",
    "options": ["Horizontal scalability across many nodes", "ACID transactions for consistency guarantees", "Schema flexibility for evolving product fields", "Sub-millisecond key-value lookup speed"],
    "answer": 1,
    "explanation": "Payment and inventory systems require ACID guarantees — specifically atomicity (deduct inventory and create order together or not at all) and isolation (two concurrent buyers can't both take the last item). SQL databases like PostgreSQL are the default choice here."
  },
  {
    "question": "A social media platform needs to store user activity events — page views, likes, and shares — at 200,000 writes per second. Each event is independent and analysts can tolerate data that is a few seconds stale. Which database fits best?",
    "options": ["PostgreSQL with aggressive indexing", "A column-family store like Cassandra", "A graph database like Neo4j", "A document store like MongoDB"],
    "answer": 1,
    "explanation": "Column-family stores like Cassandra are purpose-built for high write throughput and time-series event data. They scale horizontally by adding nodes, tolerate eventual consistency, and handle write-heavy append-only workloads far better than SQL primaries at this volume."
  },
  {
    "question": "A product catalogue needs to store items where electronics have 'wattage' and 'voltage', clothing has 'size' and 'material', and new product categories are added monthly with unique fields. What is the primary advantage of a document database here?",
    "options": ["Faster JOIN performance across product categories", "Schema flexibility — each document can have different fields without migrations", "ACID transactions across all product updates", "Built-in graph traversal for related product recommendations"],
    "answer": 1,
    "explanation": "Document databases allow each document to have a different structure. Adding a new product category with unique fields requires no schema migration — you simply start inserting documents with those fields. In SQL, you'd need ALTER TABLE (expensive at scale) or an EAV (Entity-Attribute-Value) pattern, which is complex and slow to query."
  },
  {
    "question": "Which of the following is the most accurate description of the BASE consistency model used by many NoSQL databases?",
    "options": ["Data is always consistent immediately after a write", "The system guarantees atomic transactions across all nodes", "The system is available and replicas converge to consistency over time", "All reads return the most recent committed write"],
    "answer": 2,
    "explanation": "BASE stands for Basically Available, Soft state, Eventually consistent. Unlike ACID, BASE trades immediate consistency for availability and partition tolerance. Replicas may briefly hold different versions of data, but will converge. This is acceptable for social feeds or analytics but unacceptable for financial transactions."
  },
  {
    "question": "A startup is building a professional networking app where the core feature is 'People You May Know' — finding users connected by two degrees of separation. Which database type is most naturally suited to this query?",
    "options": ["Key-value store — fast point lookups", "Document store — flexible user profiles", "Graph database — multi-hop relationship traversal", "Column-family store — wide rows of connections"],
    "answer": 2,
    "explanation": "Graph databases represent nodes (users) and edges (connections) natively and traverse multi-hop relationships efficiently. Finding 'friends of friends' is a two-hop traversal query. In a relational database, this requires self-joins on a large users table — which becomes prohibitively slow as the graph grows to millions of nodes."
  }
]}
\`\`\`

---

## Putting It Together: A Decision Checklist

\`\`\`steps
{ "title": "Quick Decision Checklist", "steps": [
  { "title": "Ask: Is my schema fixed or evolving?", "content": "**Fixed and well-understood** → SQL. **Evolving rapidly or variable per record** → Document or Column-Family NoSQL." },
  { "title": "Ask: Do I need multi-entity transactions?", "content": "**Yes** (money, inventory, bookings) → SQL. **No** (events, logs, profiles that update independently) → NoSQL is safe." },
  { "title": "Ask: What are my query patterns?", "content": "**Ad-hoc complex queries** → SQL. **Predictable point lookups or range scans** → NoSQL. **Relationship traversal** → Graph." },
  { "title": "Ask: What is my write throughput target?", "content": "**< 10k writes/sec** → SQL handles it. **> 50k writes/sec sustained** → Consider Cassandra, DynamoDB, or a hybrid." },
  { "title": "Default to SQL; add NoSQL with purpose", "content": "Start with PostgreSQL. Add Redis for caching. Add Cassandra or DynamoDB when you can name the specific bottleneck. Avoid premature NoSQL adoption — operational complexity is real." }
]}
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "SQL databases use fixed schemas, ACID transactions, and are best for structured relational data — banking, inventory, and order management are canonical use cases.",
  "NoSQL databases (Key-Value, Document, Column-Family, Graph) trade schema rigidity and ACID for flexibility and horizontal scalability — choose based on your specific access pattern, not hype.",
  "The consistency model matters: ACID for correctness-critical writes, BASE for high-throughput eventually-consistent systems.",
  "Most production systems at scale use both SQL and NoSQL — polyglot persistence assigns each database type to the subsystem it serves best.",
  "The decision framework: examine data shape → access patterns → consistency requirements → scale projections → operational maturity. In that order.",
  "Default to SQL and add specialised NoSQL databases surgically, only when you can articulate exactly which access pattern SQL cannot serve at the required scale."
]}
\`\`\``,
    },
    {
      id: "nosql-database-families",
      slug: "nosql-database-families",
      title: "NoSQL Database Families: Document, Column, Key-Value, Graph",
      content: `# NoSQL Database Families: Document, Column, Key-Value, Graph

When relational databases emerged in the 1970s, the internet did not exist. They were designed for structured business data — ledgers, invoices, employee records. Then came Google, Amazon, and Facebook: billions of users, petabytes of data, access patterns that would bring a PostgreSQL cluster to its knees.

NoSQL databases were not a rejection of SQL — they were an acknowledgment that **different data shapes demand different storage engines**. This lesson gives you the mental model to choose the right engine for every workload, and the vocabulary to defend that choice in a system design interview.

\`\`\`concept
{ "title": "The Core Insight Behind NoSQL", "variant": "mental-model", "content": "SQL databases optimize for *relationships between rows* — joins, foreign keys, transactions across tables. NoSQL databases optimize for *access patterns* instead. Before picking a NoSQL store, ask: how will my application read and write this data? The answer dictates the family." }
\`\`\`

---

## The Four Families at a Glance

\`\`\`tabs
{ "tabs": [
  {
    "label": "Key-Value",
    "icon": "🗝️",
    "content": "**Abstraction:** A giant, distributed hash table.\\n\\n**Model:** Every value is addressed by a single opaque key. The database has no idea what the value contains — it could be a string, a JSON blob, a serialized object, or binary data.\\n\\n**Reads/writes:** O(1) lookups by key. No filtering, no sorting, no range scans (in the pure form).\\n\\n**Canonical systems:** Redis, Amazon DynamoDB (in key-value mode), Memcached\\n\\n**Sweet spot:** Session tokens, feature flags, rate-limit counters, shopping carts, leaderboards.\\n\\n**Limits:** You cannot query by value. If you lose the key, the data is unreachable."
  },
  {
    "label": "Document",
    "icon": "📄",
    "content": "**Abstraction:** A collection of self-describing JSON/BSON documents.\\n\\n**Model:** Each document is a hierarchical record that can contain nested objects and arrays. Documents in the same collection need not share a schema.\\n\\n**Reads/writes:** Fetch by ID (fast), query by any field (index-dependent), update nested fields in-place.\\n\\n**Canonical systems:** MongoDB, CouchDB, Couchbase, Amazon DocumentDB\\n\\n**Sweet spot:** User profiles, product catalogs, content management, event logs where shape varies per record.\\n\\n**Limits:** Multi-document transactions are available but expensive. Denormalization is necessary — the same data may appear in many documents."
  },
  {
    "label": "Column-Family",
    "icon": "🏛️",
    "content": "**Abstraction:** A distributed, sparse two-dimensional map.\\n\\n**Model:** Data is organized into rows and *column families*. Within a row, you can have millions of columns. Columns that are null simply don't exist on disk — no wasted space. Rows are sorted by row key.\\n\\n**Reads/writes:** Extremely fast sequential writes (log-structured merge trees). Reads are efficient when you know the row key and want a range of columns.\\n\\n**Canonical systems:** Apache Cassandra, Apache HBase, Google Bigtable\\n\\n**Sweet spot:** Time-series data, IoT sensor streams, activity feeds, write-heavy analytics.\\n\\n**Limits:** Query flexibility is limited — you must design your schema around your query patterns, not the other way around. Ad-hoc queries are painful."
  },
  {
    "label": "Graph",
    "icon": "🕸️",
    "content": "**Abstraction:** Nodes (entities) connected by edges (relationships), both with arbitrary properties.\\n\\n**Model:** First-class relationships. An edge is as important as the node — it has a direction, a type, and its own properties. Traversals follow edges without expensive joins.\\n\\n**Reads/writes:** Blazing-fast multi-hop traversals. Depth-first and breadth-first searches are native operations.\\n\\n**Canonical systems:** Neo4j, Amazon Neptune, ArangoDB\\n\\n**Sweet spot:** Social graphs, fraud detection, recommendation engines, knowledge graphs, network topology.\\n\\n**Limits:** Poor horizontal scalability (sharding a graph is an unsolved hard problem). Not suitable for tabular analytics or simple CRUD."
  }
]}
\`\`\`

---

## Internal Architecture Deep Dives

### DynamoDB — Key-Value at AWS Scale

DynamoDB is Amazon's fully managed NoSQL service, designed for single-digit millisecond latency at any scale. Its internal model is deceptively simple but demands careful key design.

Every table has a **partition key** (required) and an optional **sort key**. Together they form the primary key. DynamoDB hashes the partition key to determine which physical partition stores the item — this is why hot partitions are the most common performance pitfall.

\`\`\`callout
{ "type": "warning", "title": "Hot Partition Anti-Pattern", "content": "If you design a DynamoDB table where millions of requests all share the same partition key (e.g., \`date = '2026-01-01'\`), all that traffic lands on one server. The fix: add a random suffix or user ID to distribute load — e.g., \`2026-01-01#user_7392\`." }
\`\`\`

**Access Patterns Drive Everything**

Unlike SQL where you model data then query freely, DynamoDB requires you to enumerate your access patterns *before* schema design. A well-designed table handles all access patterns with single-digit millisecond reads and no full-table scans.

\`\`\`compare
{ "variant": "good-bad",
  "before": {
    "label": "Bad: Relational thinking in DynamoDB",
    "code": "Table: orders\\nPK: order_id\\n\\n# To get all orders for a user:\\nScan entire table where user_id = 'u123'\\n# Cost: reads EVERY item in the table"
  },
  "after": {
    "label": "Good: Access-pattern-driven design",
    "code": "Table: orders\\nPK: user_id   SK: order_date#order_id\\n\\n# To get all orders for a user:\\nQuery PK='u123'\\n# Cost: reads only that user's partition\\n\\n# To get orders in a date range:\\nQuery PK='u123' SK between '2026-01-01' and '2026-03-31'"
  }
}
\`\`\`

---

### Cassandra — Column-Family for Massive Write Throughput

Apache Cassandra was created at Facebook to power the Inbox search feature — a system ingesting billions of messages. Its architecture is masterclass in write-optimized design.

\`\`\`steps
{ "title": "How Cassandra Writes Data (LSM-Tree Architecture)", "steps": [
  { "title": "Write to MemTable", "content": "Every write first lands in a memory structure called the MemTable — an in-memory sorted map. This is why writes are so fast: no disk I/O on the hot path." },
  { "title": "Append to Commit Log", "content": "Simultaneously, the write is appended to a commit log on disk. This is *sequential* I/O — dramatically faster than random I/O. If the node crashes, the commit log allows replay." },
  { "title": "Flush to SSTable", "content": "When the MemTable fills up, it is flushed to disk as an immutable SSTable (Sorted Strings Table). SSTables are never modified in place — updates create new SSTables." },
  { "title": "Compaction", "content": "Background compaction merges SSTables, discards tombstones (deleted records), and produces a single sorted file. This is where read performance is recovered after heavy writes." },
  { "title": "Read Path", "content": "Reads must check the MemTable, any unflushed SSTables, and Bloom filters (probabilistic structures) to determine which SSTables might contain the row. This is why reads are slower than writes in Cassandra." }
]}
\`\`\`

**Query Design: Think in Partition Keys**

Cassandra's CQL (Cassandra Query Language) looks like SQL, but has hard rules: \`WHERE\` clauses must always start from the partition key. You cannot arbitrarily filter on a non-indexed column without a full-table scan (called \`ALLOW FILTERING\` — essentially forbidden in production).

\`\`\`callout
{ "type": "info", "title": "Cassandra's CAP Position: AP System", "content": "Cassandra is available and partition-tolerant by default — it will accept writes even when nodes are down, resolving conflicts via last-write-wins (LWW) timestamps. You can tune consistency per-query (ONE, QUORUM, ALL), but the default trades consistency for availability." }
\`\`\`

---

### MongoDB — Document Storage for Flexible Schemas

MongoDB stores data as BSON (Binary JSON) documents, grouped into collections. Its killer feature for development teams is **schemaless flexibility** — you can ship a new field without a migration. In production, you want to add validation anyway, but the ability to evolve quickly matters during early development.

A MongoDB document looks like this:

\`\`\`json
{
  "_id": "ObjectId('65f2a3b4c5d6e7f890123456')",
  "username": "alice",
  "preferences": {
    "theme": "dark",
    "notifications": ["email", "push"]
  },
  "courses_enrolled": [
    { "id": "python-fundamentals", "progress": 0.72, "last_seen": "2026-04-10" },
    { "id": "system-design", "progress": 0.15, "last_seen": "2026-04-14" }
  ]
}
\`\`\`

The entire user profile — preferences, nested settings, array of enrolled courses — lives in one document. There is no join to another table. **One read, complete object.**

\`\`\`collapse
{ "title": "Deep Dive: MongoDB's Aggregation Pipeline", "content": "MongoDB's aggregation pipeline is its most powerful query feature. You chain stages — \`$match\`, \`$group\`, \`$lookup\`, \`$sort\`, \`$project\` — to transform documents.\\n\\n\`\`\`\\ndb.courses.aggregate([\\n  { $match: { tier: 'pro' } },\\n  { $group: { _id: '$category', count: { $sum: 1 } } },\\n  { $sort: { count: -1 } }\\n])\\n\`\`\`\\n\\nThis computes a category histogram across all pro courses. The \`$lookup\` stage even performs left outer joins between collections — though this is a code smell if done frequently, suggesting your schema should be denormalized.\\n\\nFor time-series or heavy analytics workloads, MongoDB Atlas offers a Columnar format — it will reorganize data on-disk for scan-heavy aggregations, hybridizing document and column store approaches." }
\`\`\`

---

### Neo4j — Graph Traversal as a First-Class Operation

Consider finding all friends-of-friends who share a common interest with you. In SQL:

\`\`\`sql
SELECT u2.name
FROM users u1
JOIN friendships f1 ON u1.id = f1.user_id
JOIN users u2 ON f1.friend_id = u2.id
JOIN user_interests ui ON u2.id = ui.user_id
WHERE u1.id = 'alice'
AND ui.interest IN (SELECT interest FROM user_interests WHERE user_id = 'alice')
\`\`\`

In Neo4j's Cypher query language:

\`\`\`cypher
MATCH (alice:User {name: 'Alice'})-[:FRIEND]->(fof:User)-[:INTERESTED_IN]->(i:Interest)
WHERE (alice)-[:INTERESTED_IN]->(i)
RETURN fof.name, i.name
\`\`\`

The Cypher version not only reads more naturally — it runs dramatically faster on deep graph traversals because **Neo4j stores relationships as physical pointers between nodes**. There are no join tables to scan. Following a relationship is a pointer dereference.

\`\`\`concept
{ "title": "Index-Free Adjacency", "variant": "insight", "content": "Neo4j's superpower is *index-free adjacency*: each node directly stores references to its neighboring nodes. Traversing a relationship at depth 1, 2, or 10 costs the same per hop — O(1) per edge, not O(log N) for a B-tree lookup. This is why graph DBs win at multi-hop queries and SQL collapses." }
\`\`\`

---

## Choosing the Right Database

\`\`\`steps
{ "title": "Decision Framework: Which NoSQL Family?", "steps": [
  { "title": "Identify Your Primary Access Pattern", "content": "Ask: **how will 90% of queries access data?** By exact key lookup? By document content? By time range? By traversing relationships? This single question rules out most options." },
  { "title": "Model Your Relationships", "content": "Are relationships *incidental* (users own posts — simple foreign key)? Or *the point of the data* (social graph, fraud ring detection)? If relationships are central and multi-hop, graph wins. Otherwise, graph is overkill." },
  { "title": "Estimate Write vs Read Ratio", "content": "Write-heavy workloads (IoT sensors, event streams, metrics ingestion) favor Cassandra's LSM-tree architecture. Read-heavy workloads with complex queries favor MongoDB or PostgreSQL. Extreme read speed with simple lookups favor key-value stores." },
  { "title": "Consider Schema Stability", "content": "Is your schema stable and well-understood? Column-family and key-value stores reward careful up-front design. Is your schema evolving rapidly in early product development? Document stores let you move fast without migrations." },
  { "title": "Check Consistency Requirements", "content": "Do you need strong consistency (banking, inventory)? Consider DynamoDB with strong consistency reads, or stay with SQL. Can you tolerate eventual consistency for better availability and throughput? Cassandra and DynamoDB's default mode excel here." }
]}
\`\`\`

---

## Real-World System Design Mappings

| System | Data | Why This NoSQL |
|--------|------|----------------|
| Netflix user profiles | Nested preferences, watch history | MongoDB — heterogeneous schema per user |
| Amazon shopping cart | cart_id → item list | DynamoDB — pure key-value, millisecond reads |
| Discord message history | Messages ordered by time per channel | Cassandra — partition by channel, sort by timestamp |
| LinkedIn social graph | People, companies, connections | Neo4j / Neptune — multi-hop traversal for "People You May Know" |
| Uber surge pricing cache | region → surge_multiplier | Redis — TTL-based expiry, atomic counters |
| Twitter trending topics | Sorted sets by score | Redis — native sorted set commands |

\`\`\`callout
{ "type": "tip", "title": "Polyglot Persistence", "content": "Production systems almost always use multiple database types together. Instagram used PostgreSQL for user data, Cassandra for activity feeds, and Redis for caching. This is called *polyglot persistence* — picking the right storage engine for each data domain within one system. In a system design interview, naming the right mix demonstrates senior-level thinking." }
\`\`\`

---

## Visualizing the Architecture Differences

\`\`\`sysdiag
{ "title": "NoSQL Family Architecture Comparison", "width": 680, "height": 360,
  "nodes": [
    { "id": "kv", "label": "Key-Value\\n(DynamoDB)", "x": 100, "y": 100, "kind": "database" },
    { "id": "doc", "label": "Document\\n(MongoDB)", "x": 280, "y": 100, "kind": "database" },
    { "id": "col", "label": "Column-Family\\n(Cassandra)", "x": 460, "y": 100, "kind": "database" },
    { "id": "graph", "label": "Graph\\n(Neo4j)", "x": 340, "y": 260, "kind": "database" },
    { "id": "app", "label": "Application", "x": 340, "y": 30, "kind": "service" }
  ],
  "edges": [
    { "from": "app", "to": "kv", "label": "O(1) lookup" },
    { "from": "app", "to": "doc", "label": "rich query" },
    { "from": "app", "to": "col", "label": "time-range scan" },
    { "from": "app", "to": "graph", "label": "traversal" }
  ],
  "annotations": {
    "kv": "Hash-partitioned. No secondary indexes in pure form. Fastest single-record access.",
    "doc": "BSON documents. Rich secondary indexes. Aggregation pipeline for analytics.",
    "col": "LSM-tree writes. Partition key required in every query. Masterless ring topology.",
    "graph": "Nodes + edges with properties. Index-free adjacency. Cypher query language."
  }
}
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "NoSQL Database Families", "questions": [
  {
    "question": "A startup is building a real-time leaderboard for a mobile game — millions of players, scores updated every second, reads need to be sub-millisecond. Which database family is the best fit?",
    "options": [
      "Column-family (Cassandra) — write throughput handles score updates",
      "Key-Value (Redis) — native sorted sets give O(log N) rank lookups",
      "Document (MongoDB) — flexible schema accommodates player metadata",
      "Graph (Neo4j) — models player relationships and competition history"
    ],
    "answer": 1,
    "explanation": "Redis has native Sorted Set commands (ZADD, ZRANK, ZRANGE) specifically designed for leaderboards. Rank lookups are O(log N). While Cassandra handles high write volume, it doesn't have a native leaderboard primitive — you'd still need to sort in application code. Redis is the canonical answer for leaderboards."
  },
  {
    "question": "You're designing Cassandra's write path. A node receives a write. What is the correct order of operations?",
    "options": [
      "Write to SSTable → flush to MemTable → append to commit log",
      "Append to commit log → write to MemTable → flush to SSTable on full",
      "Write to MemTable only; commit log is optional for performance",
      "Write to SSTable directly; MemTable is a read cache only"
    ],
    "answer": 1,
    "explanation": "Cassandra writes simultaneously to the in-memory MemTable and the on-disk commit log (sequential I/O for durability). When the MemTable fills, it is flushed to an immutable SSTable. The commit log enables crash recovery by replaying writes that were in the MemTable but not yet flushed."
  },
  {
    "question": "A fraud detection system needs to find 'accounts that are connected to known fraudulent accounts within 3 hops of the transaction graph.' Which database type handles this query most efficiently and why?",
    "options": [
      "DynamoDB — partition key on account_id gives fast lookup",
      "MongoDB — aggregation pipeline with $lookup can join multiple collections",
      "Neo4j — index-free adjacency makes multi-hop traversal O(1) per edge",
      "Cassandra — denormalize the 3-hop connections into a wide row"
    ],
    "answer": 2,
    "explanation": "Neo4j's index-free adjacency stores physical pointers between nodes. Traversing 3 hops costs 3 pointer dereferences — it does not grow with the size of the database. MongoDB's $lookup requires B-tree index lookups at each hop (O(log N) per hop), and the join combinatorics explode. Cassandra would require pre-materializing all 3-hop connections, which becomes impossible to maintain as the graph evolves."
  },
  {
    "question": "Which CAP theorem position does Apache Cassandra take by default?",
    "options": [
      "CA — consistent and available, sacrifices partition tolerance",
      "CP — consistent and partition-tolerant, sacrifices availability",
      "AP — available and partition-tolerant, sacrifices strong consistency",
      "All three — Cassandra achieves full CAP through tunable consistency"
    ],
    "answer": 2,
    "explanation": "Cassandra is an AP system by default. It will accept writes and serve reads even when nodes are partitioned or unavailable, guaranteeing availability at the cost of immediate consistency. Updates propagate via eventual consistency. CAP theorem proves you cannot simultaneously guarantee all three properties — 'tunable consistency' lets you move along the CP/AP spectrum per query, but you can never be fully CA in a distributed system that must survive network partitions."
  }
]}
\`\`\`

---

## Summary

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "NoSQL is not one thing — there are four distinct families (key-value, document, column-family, graph), each optimized for a different access pattern and data shape.",
  "DynamoDB and Redis (key-value) excel at O(1) lookups by known key — ideal for sessions, caches, leaderboards, and rate limiters.",
  "MongoDB (document) lets you store heterogeneous, nested data and query by any field — ideal for user profiles, catalogs, and evolving schemas in early product development.",
  "Cassandra (column-family) uses LSM-trees to absorb millions of writes per second with sequential disk I/O — ideal for time-series, IoT feeds, and activity streams where the partition key is always known.",
  "Neo4j (graph) uses index-free adjacency to traverse relationships in O(1) per hop — the only sane choice when multi-hop relationship queries are central to the problem.",
  "Production systems practice polyglot persistence: PostgreSQL for transactional data, Cassandra for streams, Redis for caching, Neo4j for the social graph — choose the right engine per domain, not one engine for everything."
]}
\`\`\``,
    },
    {
      id: "acid-vs-base",
      slug: "acid-vs-base",
      title: "ACID vs BASE: Consistency Models",
      content: `# ACID vs BASE: Consistency Models

Every system that stores data makes a promise. The question is: *what kind of promise?*

When you transfer money between bank accounts, you need an ironclad guarantee — money doesn't vanish mid-transfer, the balance is always correct, and two concurrent transfers can't corrupt each other. That promise is **ACID**.

When Twitter counts your likes, or Amazon tallies product views across 50 data centers, a slightly stale number is perfectly acceptable — availability and speed matter far more than perfect synchronization. That promise is **BASE**.

These aren't just buzzwords. They represent a fundamental trade-off at the heart of distributed systems design: **consistency vs. availability at scale**.

---

## The CAP Context

Before diving in, one framing that makes everything click:

\`\`\`concept
{ "title": "The CAP Theorem Background", "variant": "mental-model", "content": "In a distributed system, you can only fully guarantee two of three properties at once: Consistency (every read sees the latest write), Availability (every request gets a response), and Partition Tolerance (the system works despite network failures). ACID prioritizes Consistency + Partition Tolerance. BASE prioritizes Availability + Partition Tolerance. You cannot have all three simultaneously." }
\`\`\`

In practice, network partitions are unavoidable in any real distributed system — so the real choice is between **consistency** and **availability**. ACID and BASE sit at opposite ends of this dial.

---

## ACID: The Strong Guarantee

ACID originated with relational databases and remains the gold standard for transactional integrity. Each letter is a concrete guarantee:

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Atomicity",
      "icon": "⚛️",
      "content": "**All or nothing.**\\n\\nA transaction either completes fully or not at all. If a bank transfer involves two operations — debit account A, credit account B — and the system crashes after the debit, the entire transaction is **rolled back**. Account A keeps its money.\\n\\n\`\`\`sql\\nBEGIN;\\n  UPDATE accounts SET balance = balance - 500 WHERE id = 'alice';\\n  UPDATE accounts SET balance = balance + 500 WHERE id = 'bob';\\nCOMMIT;  -- both succeed, or neither does\\n\`\`\`\\n\\nNo partial states. No half-transferred money."
    },
    {
      "label": "Consistency",
      "icon": "✅",
      "content": "**Rules are never violated.**\\n\\nEvery transaction takes the database from one *valid* state to another. Constraints, foreign keys, and business rules are always enforced.\\n\\nExample: A \`balance\` column with a \`CHECK (balance >= 0)\` constraint. No transaction can ever leave a negative balance — even under concurrent writes.\\n\\nThe database is the enforcer. Developers don't have to handle these invariants in application code."
    },
    {
      "label": "Isolation",
      "icon": "🔒",
      "content": "**Concurrent transactions don't interfere.**\\n\\nTwo transactions running simultaneously produce the same result as if they ran one after the other. This is achieved through locking or MVCC (Multi-Version Concurrency Control).\\n\\nWithout isolation, you get **dirty reads** (reading uncommitted data), **phantom reads** (rows appearing mid-query), and **non-repeatable reads** (same query returns different values).\\n\\nSQL databases offer isolation levels (READ COMMITTED, REPEATABLE READ, SERIALIZABLE) that let you tune the trade-off between safety and performance."
    },
    {
      "label": "Durability",
      "icon": "💾",
      "content": "**Committed data survives failures.**\\n\\nOnce a transaction is committed, it persists — even if the server crashes immediately after. This is achieved through **write-ahead logging (WAL)**: changes are written to a durable log before being applied to the database.\\n\\nPostgreSQL, MySQL, and Oracle all use WAL. The log is replayed on recovery, guaranteeing no committed transaction is ever lost.\\n\\n> Real-world implication: your payment processing system can commit a charge and be confident it will survive a subsequent server reboot."
    }
  ]
}
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Real-World ACID Systems", "content": "PostgreSQL, MySQL (InnoDB), Oracle, SQL Server, and CockroachDB all provide full ACID guarantees. Use cases: banking, e-commerce checkouts, healthcare records, inventory management — anywhere data correctness is non-negotiable." }
\`\`\`

---

## BASE: The Scalability Trade-off

BASE was coined by Eric Brewer (of CAP Theorem fame) as the natural counterpart to ACID for large-scale distributed systems. It's not a failure mode — it's a deliberate design choice.

\`\`\`concept
{ "title": "BASE Is a Philosophy, Not a Bug", "variant": "insight", "content": "BASE systems don't achieve eventual consistency by accident. They trade strict consistency for dramatic gains in availability, horizontal scalability, and fault tolerance. DynamoDB (Amazon), Cassandra, and Bigtable (Google) were built this way by design — because at petabyte scale, ACID overhead would collapse performance." }
\`\`\`

Each letter in BASE describes a property:

\`\`\`steps
{
  "title": "Breaking Down BASE",
  "steps": [
    {
      "title": "Basically Available",
      "content": "The system remains available for reads and writes even when parts of it are down. Instead of refusing requests during partial failures, the system returns the best data it has — which might be slightly stale.\\n\\n**Example:** When Amazon's DynamoDB detects a node failure, it continues serving reads from healthy replicas. You might get data that's a few seconds old, but the system never goes down."
    },
    {
      "title": "Soft State",
      "content": "The system's state is not guaranteed to be consistent at any given moment. Data may change over time *without explicit input* — simply because background replication processes are propagating updates.\\n\\n**Example:** A shopping cart stored in Cassandra might show different item counts from two data centers for a brief window. The state is 'soft' — it's converging, not yet settled.\\n\\nCritically, the **developer** is responsible for handling this inconsistency, not the database."
    },
    {
      "title": "Eventually Consistent",
      "content": "Given enough time with no new updates, all replicas will converge to the same value. The system doesn't guarantee *when*, but it guarantees *that* consistency will be reached.\\n\\n**Example:** A Twitter like count might differ by 1-2 across data centers for ~100ms after you click the button. Within seconds, all nodes agree.\\n\\nThis is the core promise: not 'always correct' but 'eventually correct.'"
    }
  ]
}
\`\`\`

---

## Head-to-Head Comparison

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "ACID: Bank Transfer",
    "code": "BEGIN TRANSACTION;\\n\\n-- Debit sender\\nUPDATE accounts\\nSET balance = balance - 1000\\nWHERE id = 'alice' AND balance >= 1000;\\n\\n-- Credit receiver\\nUPDATE accounts\\nSET balance = balance + 1000\\nWHERE id = 'bob';\\n\\n-- Either BOTH succeed or NEITHER does\\nCOMMIT;\\n\\n-- Guarantees:\\n-- Atomicity:   no partial transfer\\n-- Consistency: balance never goes negative\\n-- Isolation:   concurrent transfers can't corrupt\\n-- Durability:  committed = permanently stored"
  },
  "after": {
    "label": "BASE: Social Media Like Count",
    "code": "// Cassandra write — fire and forget\\nawait cassandra.execute(\\n  'UPDATE posts SET likes = likes + 1 WHERE post_id = ?',\\n  [postId],\\n  { consistency: 'ONE' }  // only 1 replica confirms\\n);\\n\\n// Reader might see:\\n// Replica A: likes = 1,042\\n// Replica B: likes = 1,041  (replication lag)\\n// Replica C: likes = 1,042\\n\\n// Within ~100ms, all nodes converge.\\n// 1 stale like count is an acceptable trade-off\\n// for handling 100,000 writes/second globally."
  }
}
\`\`\`

Here's the full feature breakdown:

| Property | ACID | BASE |
|---|---|---|
| **Data Integrity** | Strong — always consistent | Eventual — converges over time |
| **Availability** | May reject requests on conflict | Always responds (possibly stale) |
| **Scalability** | Vertical scaling + read replicas | Horizontal scaling across nodes |
| **Concurrency** | Locks / MVCC (overhead) | No locks — optimistic / eventual |
| **Failure Handling** | Reject or rollback | Accept with best-effort |
| **Developer Burden** | DB enforces invariants | Developer handles inconsistency |
| **Typical Databases** | PostgreSQL, MySQL, Oracle | Cassandra, DynamoDB, MongoDB |

---

## The Consistency Spectrum

ACID and BASE aren't a binary switch — modern databases expose a **dial** of consistency levels, especially in distributed systems like Cassandra and DynamoDB:

\`\`\`concept
{ "title": "Consistency Is a Spectrum", "variant": "rule", "content": "From strongest to weakest: Linearizability (reads always see latest write) → Sequential Consistency (global ordering) → Causal Consistency (causally related ops are ordered) → Read-Your-Writes (you see your own changes) → Eventual Consistency (converges eventually). Most production systems pick a point on this spectrum based on their use case — not just 'ACID or BASE'." }
\`\`\`

**Cassandra example — tunable consistency:**

\`\`\`tabs
{
  "tabs": [
    {
      "label": "ALL (Strongest)",
      "icon": "🔒",
      "content": "Every replica must respond to a write before it's confirmed. Maximum consistency — if even one replica is down, the write fails.\\n\\n\`\`\`\\nWRITE quorum: ALL 3 replicas must confirm\\nREAD quorum: ALL 3 replicas must respond\\n\`\`\`\\n\\n**Use when:** Financial records, audit logs — correctness over availability."
    },
    {
      "label": "QUORUM (Balanced)",
      "icon": "⚖️",
      "content": "A majority of replicas must confirm (e.g., 2 of 3). Balances consistency and availability — can tolerate 1 replica being down.\\n\\n\`\`\`\\nWRITE quorum: 2/3 replicas confirm\\nREAD quorum: 2/3 replicas respond\\n\\n// Read-your-writes guarantee holds\\n// because write quorum + read quorum > N replicas\\n\`\`\`\\n\\n**Use when:** User profile data, session management."
    },
    {
      "label": "ONE (Weakest)",
      "icon": "⚡",
      "content": "Only a single replica needs to confirm. Maximum availability and lowest latency — can tolerate multiple replicas down.\\n\\n\`\`\`\\nWRITE quorum: 1 replica confirms\\nREAD quorum: 1 replica responds\\n\\n// May return stale data — other replicas\\n// may not have received the write yet\\n\`\`\`\\n\\n**Use when:** Like counts, page view metrics, analytics events."
    }
  ]
}
\`\`\`

---

## When to Choose What

\`\`\`callout
{ "type": "tip", "title": "The Decision Framework", "content": "Ask three questions:\\n1. **What's the cost of stale data?** (financial loss vs. slightly wrong counter)\\n2. **What's your scale?** (<10M users: ACID fine. >100M: BASE often necessary)\\n3. **Who handles inconsistency?** (DB: ACID. Application code: BASE)" }
\`\`\`

Real-world examples map cleanly to the spectrum:

| System | Model | Why |
|---|---|---|
| Bank transfers | ACID | Money must never be lost or duplicated |
| E-commerce checkout | ACID | Inventory can't oversell |
| User profile reads | Tunable (QUORUM) | Slight staleness OK, but identity data matters |
| Social media feed | BASE (ONE) | 100ms stale feed is imperceptible |
| Amazon shopping cart | BASE | Dynamo paper: availability > cart accuracy |
| Flight seat booking | ACID | Can't double-sell a seat |
| DNS propagation | BASE | Eventual consistency is fine for domain lookups |
| Ad impression counts | BASE | Approximate counts acceptable at billion-event scale |

\`\`\`collapse
{ "title": "Deep Dive: Amazon's Dynamo Paper and the Shopping Cart Decision", "content": "Amazon's 2007 Dynamo paper is one of the most influential distributed systems papers ever written. It explains why Amazon chose eventual consistency for shopping carts — a decision that surprised many.\\n\\nTheir reasoning: the cost of an **unavailable shopping cart** (customer can't add items, leaves the site) far exceeds the cost of a **conflicting shopping cart** (two browser tabs add items, both are merged). The former loses a sale. The latter can be resolved by taking the union of both carts.\\n\\nThis is the BASE philosophy in practice: define which inconsistencies are acceptable for your domain, then design for them intentionally. Amazon used **vector clocks** to track conflicting versions and reconcile them at read time — the developer (not the DB) handled the merge logic.\\n\\nThis kind of reasoning is what distinguishes senior engineers from junior ones in system design interviews." }
\`\`\`

---

## Architecture Diagram

\`\`\`sysdiag
{
  "title": "ACID vs BASE System Topology",
  "width": 680,
  "height": 380,
  "nodes": [
    { "id": "app", "label": "Application", "x": 340, "y": 40, "kind": "client" },
    { "id": "acid_db", "label": "PostgreSQL\\n(ACID)", "x": 140, "y": 180, "kind": "database" },
    { "id": "base_n1", "label": "Cassandra\\nNode 1", "x": 460, "y": 140, "kind": "service" },
    { "id": "base_n2", "label": "Cassandra\\nNode 2", "x": 580, "y": 240, "kind": "service" },
    { "id": "base_n3", "label": "Cassandra\\nNode 3", "x": 460, "y": 320, "kind": "service" },
    { "id": "wal", "label": "WAL\\n(durable log)", "x": 60, "y": 300, "kind": "storage" }
  ],
  "edges": [
    { "from": "app", "to": "acid_db", "label": "ACID txn" },
    { "from": "app", "to": "base_n1", "label": "BASE write" },
    { "from": "acid_db", "to": "wal", "label": "write-ahead log" },
    { "from": "base_n1", "to": "base_n2", "label": "async replicate" },
    { "from": "base_n2", "to": "base_n3", "label": "async replicate" },
    { "from": "base_n1", "to": "base_n3", "label": "async replicate" }
  ],
  "annotations": {
    "acid_db": "Single primary enforces all ACID guarantees. WAL ensures durability. Vertical scaling only.",
    "base_n1": "Any node accepts writes. Replicates to peers asynchronously. One node down = others continue.",
    "wal": "Write-Ahead Log: every change recorded here before applying to data files. Crash recovery replays the log."
  }
}
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{
  "title": "ACID vs BASE Quiz",
  "questions": [
    {
      "question": "A bank is building a wire transfer system. Two accounts must be debited and credited atomically. Which consistency model is non-negotiable here?",
      "options": [
        "BASE — because banks process millions of transactions and need horizontal scale",
        "ACID — because partial transfers (debit without credit) must be impossible",
        "Either model works — eventual consistency catches up within milliseconds",
        "Tunable consistency with ONE quorum — fastest response wins"
      ],
      "answer": 1,
      "explanation": "The 'A' in ACID — Atomicity — is exactly what prevents a debit from succeeding without its paired credit. In financial systems, a partially applied transaction means real money loss. No eventual consistency window is acceptable here."
    },
    {
      "question": "Cassandra is configured with WRITE quorum = ONE and READ quorum = ONE on a 3-replica cluster. What consistency guarantee does this provide?",
      "options": [
        "Strong consistency — reads always return the latest write",
        "No consistency guarantee — reads may return stale data",
        "Read-your-writes — you always see your own updates",
        "Linearizability — all operations appear atomic"
      ],
      "answer": 1,
      "explanation": "With quorum = ONE for both reads and writes, a read may hit a replica that hasn't received the latest write yet. This gives maximum availability and lowest latency, but you trade the consistency guarantee. Read-your-writes would require write + read quorums to overlap (e.g., QUORUM + QUORUM on a 3-replica cluster)."
    },
    {
      "question": "In BASE terminology, 'Soft State' means:",
      "options": [
        "The database stores data in memory only, without durable persistence",
        "The system's state may change over time even without new user input, due to replication",
        "Writes are buffered softly and applied when the system is idle",
        "The database schema is schema-less and can be changed freely"
      ],
      "answer": 1,
      "explanation": "Soft State refers to the fact that in a BASE system, the state of data can change between reads — not because the user wrote new data, but because background replication processes are propagating earlier writes across replicas. The state is 'converging', not 'settled'. Developers must account for this in application logic."
    },
    {
      "question": "Which of the following is the BEST argument for choosing a BASE database over an ACID database for a social media like-count feature?",
      "options": [
        "SQL databases cannot store integers large enough for like counts",
        "ACID databases do not support the concept of counting",
        "The cost of slightly stale like counts is negligible compared to the performance gains from dropping locking overhead",
        "BASE databases are always faster than ACID databases regardless of use case"
      ],
      "answer": 2,
      "explanation": "The engineering judgment is key: a like count that's 1-2 stale for 100ms has zero business impact. But enforcing ACID isolation for every like across millions of users per second would require expensive locks, dramatically reducing throughput. BASE is the right choice because the acceptable inconsistency is well-defined and the scale benefit is massive."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "ACID (Atomicity, Consistency, Isolation, Durability) guarantees strong transactional integrity — use it wherever data correctness is non-negotiable (banking, inventory, healthcare).",
    "BASE (Basically Available, Soft State, Eventually Consistent) trades strict consistency for availability and horizontal scalability — ideal for high-traffic systems where slightly stale data is acceptable.",
    "Consistency is a spectrum, not a binary: distributed databases like Cassandra expose tunable quorum levels (ONE, QUORUM, ALL) so you can dial in exactly the trade-off your use case requires.",
    "The key design question is 'what is the cost of inconsistency in my domain?' — not 'which model is trending'. Amazon chose BASE for shopping carts because cart unavailability hurts more than cart conflicts.",
    "BASE systems push consistency handling into application code — developers must reason explicitly about which inconsistencies are safe and how to resolve conflicts at read time."
  ]
}
\`\`\``,
    },
    {
      id: "database-indexing",
      slug: "database-indexing",
      title: "Database Indexing: B-Trees, LSM Trees, and Inverted Indexes",
      content: `# Database Indexing: B-Trees, LSM Trees, and Inverted Indexes

Without an index, answering \`SELECT * FROM orders WHERE customer_id = 8472\` on a 500-million-row table means reading every row — a full table scan that could take minutes. Indexes compress that into microseconds by maintaining a secondary data structure organized for fast lookup.

But not all indexes are equal. The data structure underneath determines what the index is optimized for. Choose wrong and you trade read speed for write throughput, or vice versa, at production scale.

| Index Type | Optimized For | Real-World Systems |
|---|---|---|
| **B-Tree** | Point lookups + range queries | PostgreSQL, MySQL, SQLite |
| **LSM Tree** | Write-heavy, append-heavy workloads | Cassandra, RocksDB, LevelDB |
| **Inverted Index** | Full-text search | Elasticsearch, Lucene, Solr |

This lesson goes beyond "which to use" to understand *why* each structure makes its trade-offs.

<!-- voice: We cover three index data structures that every backend engineer must understand deeply. The goal is not just which to pick, but why each structure behaves the way it does under different workloads. -->

\`\`\`concept
{ "title": "The Core Tension: Read vs. Write Optimization", "variant": "mental-model", "content": "Every index is a secondary data structure kept in sync with your table. Faster reads require more organization — and maintaining organization costs extra work on every write. B-trees organize data in-place for fast reads. LSM trees defer organization through background compaction to maximize write throughput. Inverted indexes serve a completely different access pattern: mapping search terms to documents. You cannot optimize for all three — understand your workload first." }
\`\`\`

---

## B-Trees: The Workhorse of OLTP

A B-tree is a self-balancing tree where every node holds an **ordered list of keys** and pointers to child nodes. Unlike a binary search tree (max 2 children), B-tree nodes hold hundreds of keys — this is deliberate. Disk reads happen in **pages** (typically 4KB–16KB), and a fat, wide node minimizes the number of page fetches needed to reach any value.

**The key guarantee:** every path from root to leaf has identical length. The tree is always balanced. This keeps lookup at **O(log n)** regardless of insertion order, even after millions of updates.

When you query for a key, the database:
1. Reads the root page and follows the pointer to the right child
2. Repeats until it reaches a leaf node
3. Reads the value (or row pointer) from the leaf

The visualization below shows binary search happening inside a single B-tree leaf page:

\`\`\`algoviz
{ "title": "B-Tree Leaf Page: Binary Search for key=68", "type": "array", "data": [12, 25, 37, 51, 68, 84, 97], "frames": [ { "highlight": [3], "label": "Check midpoint index 3 (key=51). Target 68 > 51 → search the right half.", "stats": { "lo": 0, "hi": 6, "mid": 3, "target": 68 } }, { "highlight": [5], "label": "New midpoint index 5 (key=84). Target 68 < 84 → search the left half.", "stats": { "lo": 4, "hi": 6, "mid": 5, "target": 68 } }, { "highlight": [4], "label": "Midpoint index 4 (key=68). Match! Follow the row pointer to retrieve the full record.", "stats": { "lo": 4, "hi": 4, "mid": 4, "target": 68 } } ], "speed": 900 }
\`\`\`

### Writes: In-Place Modification

When you insert a row, the B-tree locates the target leaf page and modifies it **in-place** — writing the new key in sorted position. If the page is full, it **splits** into two half-full pages and updates the parent to reference both. This split can cascade upward.

Every write involves multiple **random I/O operations**: descend the tree (reading pages), modify the leaf, write it back to disk, and possibly update parent pages. B-trees shine on read-heavy OLTP but begin to buckle under extremely write-heavy workloads due to random I/O pressure.

\`\`\`callout
{ "type": "warning", "title": "Too Many Indexes Hurt Write Performance", "content": "Each index on a table must be updated on every INSERT, UPDATE, and DELETE. A table with 8 indexes means every write touches 9 data structures. On write-heavy workloads this becomes a serious bottleneck — profile your write/read ratio before adding indexes indiscriminately." }
\`\`\`

---

## LSM Trees: Write-Optimized Indexing

The Log-Structured Merge-tree (LSM-tree) makes a radical trade: **never modify existing data on disk, only append**. This converts random I/O writes into sequential writes — one of the largest single performance wins available on both spinning disks and SSDs.

\`\`\`steps
{ "title": "The LSM Tree Write Pipeline", "steps": [ { "title": "1. Write-Ahead Log (WAL)", "content": "Every write is first appended sequentially to the **WAL** on disk. If the process crashes before anything else happens, the WAL enables full recovery on restart. Sequential appends are the fastest possible disk operation — no seeking." }, { "title": "2. Memtable (In-Memory)", "content": "The write is inserted into the **Memtable** — an in-memory sorted structure (typically a red-black tree or skip list). Reads of recently written keys are served instantly from here. No disk access required at all." }, { "title": "3. Memtable Flush → SSTable", "content": "When the Memtable exceeds a size threshold, it becomes **immutable** and is flushed to disk as an **SSTable** (Sorted String Table). SSTables are never modified after being written — fully immutable. Each carries a **Bloom filter** to enable fast negative lookups." }, { "title": "4. Background Compaction", "content": "Over time, SSTables accumulate. A background **compaction** process merges and sorts them, discarding obsolete (overwritten or deleted) key versions. This keeps the SSTable count manageable and prevents read performance from degrading. Write cost is amortized across many inserts." } ] }
\`\`\`

### The Read Path: Newest First

Reads must check multiple locations — memtable first, then SSTables from newest to oldest. The trace below shows exactly what happens on each operation:

\`\`\`trace
{ "title": "LSM Tree: Write and Read Execution", "language": "python", "code": "class LSMTree:\\n    def __init__(self):\\n        self.memtable = {}   # in-memory, sorted\\n        self.sstables = []   # on-disk, immutable\\n\\n    def put(self, key, value):\\n        # WAL write happens here (omitted)\\n        self.memtable[key] = value\\n\\n    def get(self, key):\\n        if key in self.memtable:\\n            return self.memtable[key]\\n        for sst in reversed(self.sstables):\\n            if key in sst:\\n                return sst[key]\\n        return None\\n\\ndb = LSMTree()\\ndb.put('u:1', 'Alice')\\ndb.put('u:2', 'Bob')\\ndb.put('u:1', 'Alice-v2')\\nresult = db.get('u:1')\\nprint(result)", "frames": [ { "line": 18, "vars": { "db.memtable": "{}", "db.sstables": "[]" }, "note": "LSMTree created. Memtable empty, no SSTables on disk." }, { "line": 19, "vars": { "db.memtable": "{}" }, "note": "put('u:1', 'Alice') — dispatch to put()." }, { "line": 7, "vars": { "db.memtable": "{'u:1': 'Alice'}" }, "note": "memtable updated in O(log n). WAL written sequentially on disk. No random I/O." }, { "line": 20, "vars": { "db.memtable": "{'u:1': 'Alice', 'u:2': 'Bob'}" }, "note": "put('u:2', 'Bob') — same fast path. Still only in-memory." }, { "line": 21, "vars": { "db.memtable": "{'u:1': 'Alice', 'u:2': 'Bob'}" }, "note": "put('u:1', 'Alice-v2') — key already exists. Just overwrite in memtable. Old value survives in SSTable until compaction." }, { "line": 7, "vars": { "db.memtable": "{'u:1': 'Alice-v2', 'u:2': 'Bob'}" }, "note": "Memtable now holds the latest version of u:1. No disk read needed." }, { "line": 22, "vars": {}, "note": "get('u:1') — check memtable first (line 10)." }, { "line": 10, "vars": { "key": "u:1" }, "note": "'u:1' found in memtable. Return immediately — no disk access." }, { "line": 23, "vars": { "result": "Alice-v2" }, "note": "result = 'Alice-v2'. Most recent version returned correctly.", "stdout": "Alice-v2" } ], "speed": 800 }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Bloom Filters: Fast Negative Lookups", "content": "Each SSTable carries a Bloom filter — a probabilistic data structure that answers 'Is this key definitely NOT in this file?' in O(1) with zero false negatives. Before scanning any SSTable, the database checks its Bloom filter. If the filter says no, that file is skipped entirely. Without Bloom filters, reads would degrade to O(SSTables × log n) as more files accumulate." }
\`\`\`

---

## Inverted Indexes: Powering Full-Text Search

When you search "distributed systems tutorial", Elasticsearch doesn't scan every document for that phrase. It consults an **inverted index**: a mapping from each unique term to every document containing it.

\`\`\`
"distributed" → [doc_3, doc_7, doc_12, doc_41]
"systems"     → [doc_3, doc_9, doc_12, doc_55]
"tutorial"    → [doc_7, doc_12, doc_88]
\`\`\`

Querying "distributed systems" intersects the first two posting lists → \`[doc_3, doc_12]\`. Milliseconds, regardless of corpus size.

Building an inverted index requires three steps: **tokenize** the text into individual terms, **normalize** them (lowercase, stemming — "running" → "run"), and construct a **posting list** for each unique term.

\`\`\`playground
{ "title": "Build a Simple Inverted Index", "language": "python", "code": "from collections import defaultdict\\n\\ndef tokenize(text):\\n    # Simple tokenizer: lowercase and split on whitespace\\n    return text.lower().split()\\n\\ndef build_inverted_index(documents):\\n    # Map each term to the set of docs containing it\\n    index = defaultdict(set)\\n    for doc_id, content in documents.items():\\n        for term in tokenize(content):\\n            index[term].add(doc_id)\\n    return dict(index)\\n\\ndef search(index, query):\\n    # AND search: docs must contain ALL query terms\\n    terms = tokenize(query)\\n    if not terms:\\n        return set()\\n    results = index.get(terms[0], set())\\n    for term in terms[1:]:\\n        results = results & index.get(term, set())\\n    return results\\n\\n# Sample document corpus\\ndocs = {\\n    'doc_1': 'distributed systems design patterns',\\n    'doc_2': 'database indexing b-trees lsm trees',\\n    'doc_3': 'distributed database design at scale',\\n    'doc_4': 'inverted index full text search'\\n}\\n\\nindex = build_inverted_index(docs)\\n\\nprint('Posting list for distributed:', sorted(index.get('distributed', [])))\\nprint('Posting list for design:', sorted(index.get('design', [])))\\nprint()\\nresults = search(index, 'distributed design')\\nprint('Search [distributed AND design]:', sorted(results))\\n# Both doc_1 and doc_3 contain both terms", "runnable": true }
\`\`\`

---

## Choosing the Right Index Structure

\`\`\`tabs
{ "tabs": [ { "label": "B-Tree", "icon": "🌳", "content": "**Best for:**\\n- OLTP workloads where reads dominate\\n- Range queries (\`WHERE created_at BETWEEN ...\`)\\n- Primary keys and unique constraints\\n- Balanced read + moderate write workloads\\n\\n**Avoid when:**\\n- Write throughput exceeds ~50K writes/sec per node\\n- Write amplification is a concern (e.g., SSD endurance budgets)\\n\\n**Real systems:** PostgreSQL, MySQL InnoDB, SQLite\\n\\n**Complexity:** O(log n) reads and writes; writes may cascade through page splits" }, { "label": "LSM Tree", "icon": "📝", "content": "**Best for:**\\n- Write-heavy workloads (time-series, event logs, IoT)\\n- Append-heavy data (clickstreams, audit logs)\\n- High sustained write throughput requirements\\n\\n**Avoid when:**\\n- Sub-millisecond reads are critical (reads check multiple SSTables)\\n- Compaction I/O spikes are unacceptable in your SLA\\n\\n**Real systems:** Cassandra, RocksDB, LevelDB, HBase, ScyllaDB\\n\\n**Complexity:** O(1) amortized writes; reads O(log n × k) where k = SSTable count" }, { "label": "Inverted Index", "icon": "🔍", "content": "**Best for:**\\n- Full-text search (search bars, documentation, log search)\\n- Faceted search and multi-attribute filtering\\n- Relevance ranking (TF-IDF, BM25)\\n\\n**Avoid when:**\\n- You need exact key lookups or range queries (use B-tree)\\n- Your schema is highly structured and relational\\n\\n**Real systems:** Elasticsearch, Apache Lucene, Solr, OpenSearch\\n\\n**Complexity:** O(|posting list|) query; O(|document tokens|) index update" } ] }
\`\`\`

\`\`\`compare
{ "variant": "before-after", "before": { "label": "B-Tree Write (Random I/O)", "code": "# B-Tree write path — multiple disk seeks required\\n#\\n# 1. Descend tree root → leaf (log N page reads)\\n#    Each page read = random disk seek\\n# 2. Modify leaf page in-place (sorted insertion)\\n# 3. Write dirty page back to disk\\n# 4. If page is full:\\n#    - Split into two half-full pages\\n#    - Update parent (may cascade upward)\\n#\\n# Result: 3–6 random I/O operations per write\\n#\\n# Works great for balanced workloads.\\n# Becomes a bottleneck at sustained high write rates." }, "after": { "label": "LSM Tree Write (Sequential I/O)", "code": "# LSM write path — sequential appends only\\n#\\n# 1. Append to WAL on disk (sequential — fast)\\n# 2. Insert into in-memory memtable (O(log n))\\n# Done. No page lookups, no random seeks.\\n#\\n# Later, background compaction runs:\\n#   - Merges multiple SSTables into one\\n#   - Removes obsolete key versions\\n#   - All I/O is large sequential reads/writes\\n#\\n# Result: 1–2 sequential I/O ops per write\\n# Handles 100K+ writes/sec on commodity hardware." } }
\`\`\`

---

## Practice

\`\`\`fillblank
{ "title": "Complete the LSM Tree Read Path", "prompt": "Fill in the blanks to implement get() for an LSM tree. Check the in-memory structure first, then scan disk files from newest to oldest.", "language": "python", "template": "def get(self, key):\\n    # Check the in-memory structure first\\n    if key in self.___:\\n        return self.memtable[key]\\n    # Scan SSTables newest-first\\n    for sst in ___(self.sstables):\\n        if key in sst:\\n            return sst[key]\\n    return None", "blanks": [ { "answer": "memtable", "hint": "The in-memory sorted structure that holds the most recent writes" }, { "answer": "reversed", "hint": "Newer SSTables were flushed later — we want to find the most recent version of a key first" } ] }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "A B-tree guarantees O(log n) lookup regardless of insertion order. What structural property makes this possible?", "options": [ "Keys are stored in hash-sorted order at every node", "Every path from root to leaf has identical length — the tree is self-balancing", "Leaf nodes always contain exactly half the maximum number of keys", "The root node always holds the median key of the entire dataset" ], "answer": 1, "explanation": "B-trees are self-balancing. When a node overflows (a page split), the tree rebalances so that all root-to-leaf paths have identical length. This guarantees O(log n) regardless of insertion order — unlike a naive BST that degrades to O(n) on sorted input." }, { "question": "What is the primary purpose of compaction in an LSM tree?", "options": [ "To compress SSTables using gzip and reduce storage costs", "To replicate SSTables across nodes for high availability", "To merge multiple SSTables, remove obsolete key versions, and prevent reads from degrading as files accumulate", "To convert the LSM tree back into a B-tree for faster reads" ], "answer": 2, "explanation": "As writes accumulate, SSTables pile up on disk. Without compaction, a read must check every SSTable for a given key. Compaction merges them into fewer, larger files and discards overwritten or deleted entries. The write cost is amortized — paid across many inserts rather than upfront." }, { "question": "In an inverted index, what does the posting list for the term 'distributed' contain?", "options": [ "The frequency of the term across the entire corpus", "All unique terms that co-occur with 'distributed' in the same sentence", "The document IDs (and optionally positions) of every document containing the term", "A compressed binary representation of the term's ASCII characters" ], "answer": 2, "explanation": "An inverted index maps each term to its posting list — the set of document IDs where the term appears. To answer 'find docs containing both X and Y', the search engine intersects the posting lists for X and Y. This is why full-text search is fast regardless of corpus size." }, { "question": "You are designing a time-series store for IoT sensor data: 80,000 writes/second, writes must be low-latency, and reads are infrequent batch analytics. Which index structure fits best?", "options": [ "B-Tree — it is the industry default and handles all workloads adequately", "Inverted Index — sensor IDs need full-text search capability", "LSM Tree — write-optimized with sequential I/O; batch analytics tolerates the read overhead", "Hash Index — O(1) lookups for each sensor ID point query" ], "answer": 2, "explanation": "80K writes/sec with low write latency is a classic LSM tree workload. LSM converts writes into sequential appends (WAL + memtable), maximizing throughput. Batch analytics reads can tolerate checking multiple SSTables. This is exactly the workload Cassandra, InfluxDB, and similar time-series stores are built for." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "B-trees keep data sorted and self-balanced, guaranteeing O(log n) reads and writes — the standard for OLTP where reads dominate and write patterns are moderate.", "LSM trees convert writes into sequential appends (WAL → Memtable → SSTable), enabling high write throughput; background compaction reclaims space and keeps reads manageable.", "Inverted indexes map each unique term to a posting list of document IDs, enabling millisecond full-text search by intersecting lists rather than scanning documents.", "Every index is a data structure kept in sync with your table — every write must update all indexes, so too many indexes hurt insert performance regardless of index type.", "Bloom filters in LSM trees enable O(1) negative lookups ('key definitely not in this SSTable'), preventing reads from degrading as the SSTable count grows.", "Match the index to the workload: B-tree for balanced OLTP, LSM tree for write-heavy or time-series data, inverted index for full-text search." ] }
\`\`\``,
      starterCode: `# Database Indexing: B-Trees, LSM Trees, and Inverted Indexes
#
# In this exercise you will implement a simplified Inverted Index —
# the core data structure powering full-text search engines like
# Elasticsearch and PostgreSQL's tsvector.
#
# An inverted index maps each unique word → list of document IDs
# that contain that word, enabling O(1) lookups instead of O(n) scans.

from collections import defaultdict

class InvertedIndex:
    def __init__(self):
        # TODO 1: Initialize the index.
        # Use a dict that maps word (str) → set of doc_ids (int).
        # Hint: defaultdict(set) is convenient here.
        self.index = None

    def add_document(self, doc_id: int, text: str) -> None:
        """Index a document so each word points back to doc_id."""
        # TODO 2: Tokenize \`text\` into lowercase words
        # (split on whitespace, strip punctuation from each token).
        # Then insert doc_id into the set for every token.
        pass

    def search(self, query: str) -> set:
        """Return doc IDs that contain ALL words in the query (AND semantics)."""
        # TODO 3: Tokenize the query the same way as add_document.
        # Look up each token in self.index.
        # Return the INTERSECTION of all matching doc-ID sets.
        # Return an empty set if any token is not in the index.
        pass

    def search_any(self, query: str) -> set:
        """Return doc IDs that contain ANY word in the query (OR semantics)."""
        # TODO 4: Similar to search(), but return the UNION instead.
        pass


# ----- tests (run this file to check your work) -----
if __name__ == "__main__":
    idx = InvertedIndex()
    idx.add_document(1, "B-trees are used in OLTP databases")
    idx.add_document(2, "LSM trees are optimized for write-heavy workloads")
    idx.add_document(3, "Inverted indexes power full-text search in databases")
    idx.add_document(4, "B-trees and LSM trees are both database index structures")

    # AND search — both words must appear
    assert idx.search("b-trees databases") == {1, 4}, "AND search failed"
    assert idx.search("lsm trees") == {2, 4}, "AND search failed"
    assert idx.search("b-trees lsm") == {4}, "AND search failed"
    assert idx.search("nonexistent") == set(), "missing word should return empty set"

    # OR search — at least one word must appear
    assert idx.search_any("b-trees lsm") == {1, 2, 4}, "OR search failed"
    assert idx.search_any("full-text oltp") == {1, 3}, "OR search failed"

    print("All tests passed!")
`,
      solutionCode: `# Database Indexing: B-Trees, LSM Trees, and Inverted Indexes
#
# SOLUTION — Inverted Index implementation
#
# Key insight: an inverted index trades write cost (insert into every
# token's posting list) for dramatic read speedup (O(1) per token
# lookup vs O(n) full-document scan).
# This is exactly why full-text search engines maintain a separate
# index structure rather than relying on a B-tree row scan.

import string
from collections import defaultdict

class InvertedIndex:
    def __init__(self):
        # Maps word → set of document IDs containing that word.
        # defaultdict(set) auto-creates an empty set for new keys.
        self.index: dict[str, set[int]] = defaultdict(set)

    def _tokenize(self, text: str) -> list[str]:
        """Lowercase and strip punctuation from each whitespace-delimited token."""
        tokens = []
        for word in text.lower().split():
            # Remove leading/trailing punctuation (e.g. commas, periods)
            cleaned = word.strip(string.punctuation)
            if cleaned:
                tokens.append(cleaned)
        return tokens

    def add_document(self, doc_id: int, text: str) -> None:
        """Index a document so each word points back to doc_id."""
        for token in self._tokenize(text):
            # Append this doc to the token's posting list.
            # Cost: O(k) where k = number of tokens in the document.
            self.index[token].add(doc_id)

    def search(self, query: str) -> set:
        """Return doc IDs containing ALL query words (AND semantics)."""
        tokens = self._tokenize(query)
        if not tokens:
            return set()

        # Start with the posting list for the first token.
        result = self.index.get(tokens[0], set()).copy()

        # Intersect with each subsequent token's posting list.
        # If any token is missing from the index the intersection → empty set.
        for token in tokens[1:]:
            result &= self.index.get(token, set())
            if not result:
                break  # Early exit — intersection already empty

        return result

    def search_any(self, query: str) -> set:
        """Return doc IDs containing ANY query word (OR semantics)."""
        tokens = self._tokenize(query)
        result: set[int] = set()

        for token in tokens:
            result |= self.index.get(token, set())

        return result


# ----- tests -----
if __name__ == "__main__":
    idx = InvertedIndex()
    idx.add_document(1, "B-trees are used in OLTP databases")
    idx.add_document(2, "LSM trees are optimized for write-heavy workloads")
    idx.add_document(3, "Inverted indexes power full-text search in databases")
    idx.add_document(4, "B-trees and LSM trees are both database index structures")

    # AND search
    assert idx.search("b-trees databases") == {1, 4}
    assert idx.search("lsm trees") == {2, 4}
    assert idx.search("b-trees lsm") == {4}
    assert idx.search("nonexistent") == set()

    # OR search
    assert idx.search_any("b-trees lsm") == {1, 2, 4}
    assert idx.search_any("full-text oltp") == {1, 3}

    print("All tests passed!")
`,
    },
    {
      id: "data-replication",
      slug: "data-replication",
      title: "Data Replication: Leader-Follower, Multi-Leader, and Leaderless",
      content: `# Data Replication: Leader-Follower, Multi-Leader, and Leaderless

Imagine your database receives 100,000 writes per second from users across three continents. If you stored all that data on a single machine, any hardware failure would make your entire application unavailable. **Data replication** — keeping copies of the same data on multiple machines — is how distributed systems solve this.

But replication is deceptively hard. The moment you allow data to change, you must answer: *which node accepts the write? what happens if two nodes disagree? how do you recover from a failure?* The answers to these questions define three fundamentally different replication topologies.

\`\`\`concept
{ "title": "Replication Is About Change, Not Copies", "variant": "mental-model", "content": "If your data never changed, replication would be trivial — copy once, done. All the complexity of replication comes from handling writes after the initial copy. Every replication strategy is really a policy for: (1) who may accept a write, (2) how that write propagates to other nodes, and (3) what happens when two nodes have conflicting versions." }
\`\`\`

---

## The Four Structural Variables

Before diving into each strategy, understand the four axes they differ on. Every design decision flows from these.

\`\`\`tabs
{ "tabs": [
  { "label": "Write-Accepting Nodes", "icon": "✍️", "content": "**Who can accept a write?**\\n\\n- **Leader-Follower:** exactly 1 node (the leader/primary)\\n- **Multi-Leader:** 2+ designated nodes (one per datacenter, typically)\\n- **Leaderless:** all N nodes are eligible — clients write to W nodes simultaneously\\n\\nThis directly determines your write availability. If the only write-accepting node goes down, leader-follower becomes unavailable for writes. Multi-leader and leaderless can continue writing even when individual nodes fail." },
  { "label": "Conflict Possibility", "icon": "⚔️", "content": "**Can two nodes ever accept conflicting writes for the same key?**\\n\\n- **Leader-Follower:** ❌ No. All writes are serialized through a single leader. Conflicts are structurally impossible.\\n- **Multi-Leader:** ✅ Yes. Client A writes to Leader-East while Client B writes to Leader-West simultaneously.\\n- **Leaderless:** ✅ Yes. Two clients can write different values to overlapping quorums.\\n\\nIf a strategy allows conflicts, you need a conflict *resolution* policy. More on this below." },
  { "label": "Consistency Default", "icon": "🔄", "content": "**What consistency guarantee does the system offer out of the box?**\\n\\n- **Leader-Follower (sync):** Strong consistency — reads from the leader always see the latest write\\n- **Leader-Follower (async):** Eventual consistency — followers may lag behind\\n- **Multi-Leader:** Eventual or session consistency — conflicts are resolved asynchronously\\n- **Leaderless:** Tunable via quorum parameters (W + R > N → strong; W + R ≤ N → eventual)\\n\\nThe CAP theorem is at play here: systems that remain available during network partitions (A) cannot simultaneously guarantee consistency (C)." },
  { "label": "Failure Handling", "icon": "🔥", "content": "**What happens when a node crashes?**\\n\\n- **Leader-Follower:** Requires **leader election** — a follower must be promoted. This takes seconds to minutes and creates a window of unavailability for writes.\\n- **Multi-Leader:** Each datacenter has its own leader, so a single datacenter failure is handled by **per-datacenter failover** internally. Other datacenters keep writing.\\n- **Leaderless:** No election needed. Clients write to W nodes and read from R nodes. If a node is down, the quorum simply shrinks. Stale nodes catch up via **read repair** or **anti-entropy**." }
] }
\`\`\`

---

## Strategy 1: Leader-Follower (Single-Leader)

This is the most widely deployed model. PostgreSQL, MySQL, MongoDB replica sets, and Kafka all use it.

\`\`\`concept
{ "title": "One Writer, Many Readers", "variant": "rule", "content": "In leader-follower replication, exactly one replica — the leader — accepts all writes. The leader writes to its local storage, then ships the change to followers via a replication log. Followers apply changes in the same order. Clients can read from any replica, but must write to the leader." }
\`\`\`

\`\`\`steps
{ "title": "How a Write Propagates in Leader-Follower", "steps": [
  { "title": "Client sends write to the leader", "content": "The client (or a load balancer that knows the topology) routes the write request directly to the leader node. All writes are serialized at the leader, creating a total order of operations." },
  { "title": "Leader writes locally and appends to replication log", "content": "The leader applies the write to its own storage first, then appends the change to a **replication log** (also called a write-ahead log or change stream). This log is the source of truth for all followers." },
  { "title": "Followers consume the log", "content": "Each follower maintains an ongoing connection to the leader and streams the replication log. Followers apply each entry in order, keeping their local copy in sync.\\n\\n**Synchronous vs Asynchronous:**\\n- *Sync*: Leader waits for follower acknowledgment before confirming the write. Strong consistency, but higher latency.\\n- *Async*: Leader confirms immediately. Lower latency, but followers may lag." },
  { "title": "Client reads from any replica", "content": "Read requests can be served by any follower (or the leader). Reading from a follower that hasn't yet received the latest write gives a **stale read** — this is called **replication lag**. In async replication, this lag can be milliseconds to seconds." },
  { "title": "On leader failure: election", "content": "If the leader crashes, a **failover** process begins:\\n1. Detect failure (via heartbeat timeout)\\n2. Elect a new leader (usually the most up-to-date follower)\\n3. Redirect clients to the new leader\\n\\n⚠️ The biggest risk: the old leader may have written data that was *not yet replicated* to any follower. That data is lost when the new leader takes over." }
] }
\`\`\`

\`\`\`sysdiag
{ "title": "Leader-Follower Topology", "width": 640, "height": 320,
  "nodes": [
    { "id": "client", "label": "Client", "x": 80, "y": 160, "kind": "client" },
    { "id": "leader", "label": "Leader\\n(Primary)", "x": 260, "y": 160, "kind": "service" },
    { "id": "f1", "label": "Follower 1\\n(Replica)", "x": 480, "y": 80, "kind": "database" },
    { "id": "f2", "label": "Follower 2\\n(Replica)", "x": 480, "y": 160, "kind": "database" },
    { "id": "f3", "label": "Follower 3\\n(Replica)", "x": 480, "y": 240, "kind": "database" }
  ],
  "edges": [
    { "from": "client", "to": "leader", "label": "writes" },
    { "from": "leader", "to": "f1", "label": "replication log" },
    { "from": "leader", "to": "f2", "label": "replication log" },
    { "from": "leader", "to": "f3", "label": "replication log" },
    { "from": "client", "to": "f1", "label": "reads" }
  ],
  "annotations": {
    "leader": "Single write-accepting node. Serializes all writes. Source of replication log.",
    "f1": "Applies log entries in order. Can serve reads. May have replication lag in async mode.",
    "client": "Must route writes to the leader. Can read from any replica."
  }
}
\`\`\`

**Real-world examples:**
- **PostgreSQL streaming replication** — widely used with one primary and multiple hot standbys
- **MySQL binlog replication** — the foundation of read-scaling architectures at companies like GitHub and Facebook
- **Kafka partition leaders** — each partition has exactly one broker leader that handles all writes for that partition

---

## Strategy 2: Multi-Leader (Active/Active)

Multi-leader allows more than one node to accept writes simultaneously. It's most commonly deployed across **multiple datacenters**, where each datacenter has its own leader.

\`\`\`concept
{ "title": "Active/Active Across Datacenters", "variant": "analogy", "content": "Think of multi-leader replication like two Google Docs editors working simultaneously in different offices — both can make changes locally without waiting for the other. When they eventually sync, you need to merge their edits. Multi-leader gives you write availability and low-latency writes in each datacenter, but you must handle the 'merging' problem for conflicting writes." }
\`\`\`

\`\`\`tabs
{ "tabs": [
  { "label": "Multi-Datacenter Use Case", "icon": "🌍", "content": "**Why multi-datacenter multi-leader?**\\n\\nWith single-leader across datacenters, every write from a user in Tokyo must travel to a leader in Virginia — adding ~150ms of network latency per write.\\n\\nWith multi-leader, the Tokyo datacenter has its own leader. Writes are committed locally (low latency), then asynchronously replicated to other datacenters.\\n\\n**Trade-off:** You gain write availability and low latency per-region, but you must handle conflicts when users in Tokyo and London write to the same record simultaneously." },
  { "label": "Offline Clients", "icon": "📱", "content": "**Why offline-capable apps use multi-leader logic:**\\n\\nApps like Google Calendar need to work offline. When you create an event offline, your device acts as a local leader. When you reconnect, your device syncs with the server.\\n\\nThis is structurally identical to multi-leader replication — multiple nodes (devices + server) accept writes independently, then reconcile. CouchDB was designed explicitly for this use case.\\n\\nConflict resolution matters here too: if you moved an event while offline and your colleague moved it from the server, which wins?" },
  { "label": "Collaborative Editing", "icon": "📝", "content": "**Google Docs, Notion, Figma:**\\n\\nWhen multiple users edit a document simultaneously, each user's browser is effectively a leader — it accepts local edits immediately (for responsiveness) and replicates to others.\\n\\nModern collaborative editors use **Operational Transformation (OT)** or **CRDTs** (Conflict-free Replicated Data Types) to automatically resolve concurrent text edits. This is a sophisticated form of conflict resolution built on top of multi-leader principles." }
] }
\`\`\`

### The Conflict Problem

Multi-leader's Achilles' heel is write conflicts. Consider:

> **t=1:** User A sets \`title = "Meeting"\` via Leader-East  
> **t=1:** User B sets \`title = "Call"\` via Leader-West  
> **t=2:** Both leaders replicate to each other — now they disagree

\`\`\`compare
{ "variant": "good-bad",
  "before": { "label": "Bad: Last-Write-Wins (LWW)", "code": "# Dangerous conflict resolution\\n# Use wall-clock timestamps to pick winner\\n\\ndef resolve_conflict(write_a, write_b):\\n    # Problem: clocks are not perfectly synchronized\\n    # Problem: silently drops one write — data loss!\\n    return write_a if write_a.timestamp > write_b.timestamp else write_b" },
  "after": { "label": "Better: Preserve Both / CRDT", "code": "# Safe conflict resolution approaches:\\n\\n# Option 1 — Expose conflict to application\\ndef resolve_conflict(write_a, write_b):\\n    if write_a.value == write_b.value:\\n        return write_a\\n    # Return both; let app/user decide\\n    return ConflictRecord(versions=[write_a, write_b])\\n\\n# Option 2 — Merge semantics (works for sets/counters)\\n# e.g. CRDTs: a G-Counter never has conflicts\\nclass GCounter:\\n    def merge(self, other):\\n        return {k: max(self[k], other[k]) for k in all_keys}" }
}
\`\`\`

**Conflict resolution strategies:**
1. **Last-Write-Wins (LWW):** Use timestamps to pick a winner. Simple but loses data and requires clock synchronization.
2. **Application-level resolution:** Expose conflicting versions to the application (like Git merge conflicts). Amazon's Dynamo used this — shopping carts stored all conflicting versions.
3. **CRDTs:** Design your data structure so merges are always deterministic and commutative. Works for counters, sets, sequences.
4. **Custom merge functions:** Define business logic for each field type (e.g., "higher price wins," "merge tag lists").

---

## Strategy 3: Leaderless (Dynamo-Style)

Popularized by Amazon's Dynamo paper (2007) and implemented in DynamoDB, Cassandra, and Riak. There is no concept of a leader — **any node can accept any write**.

\`\`\`concept
{ "title": "Quorum: The Math Behind Leaderless", "variant": "mental-model", "content": "In a cluster of N nodes, if a client writes to W nodes and reads from R nodes, the system guarantees at least one node overlaps between a write set and a read set when W + R > N. This overlap ensures the read always sees the latest write.\\n\\nExample: N=3, W=2, R=2 → W+R=4 > 3 ✅\\nExample: N=3, W=1, R=1 → W+R=2 ≤ 3 ❌ (may miss writes)\\n\\nTuning W and R lets you trade consistency for availability and latency." }
\`\`\`

\`\`\`steps
{ "title": "A Leaderless Write + Read", "steps": [
  { "title": "Client writes to W nodes in parallel", "content": "The client (or a coordinator node) sends the same write to all N nodes simultaneously and waits for W acknowledgments. It does not wait for all N — just W.\\n\\nIf one node is down, the write still succeeds as long as W nodes respond." },
  { "title": "Nodes store with version numbers", "content": "Each node stores the value along with a **version number** (or vector clock). This is how the system later detects which copy is newer when nodes disagree." },
  { "title": "Client reads from R nodes in parallel", "content": "For a read, the client queries R nodes simultaneously and picks the response with the **highest version number** as the authoritative value.\\n\\nIf nodes disagree (stale node vs up-to-date node), the client detects the conflict via version comparison." },
  { "title": "Read repair on stale data", "content": "When a read detects that some nodes returned stale data (lower version number), the client immediately **writes the newest value back** to those stale nodes. This is called **read repair** — it's how leaderless systems self-heal without a centralized sync process." },
  { "title": "Anti-entropy in the background", "content": "Separately, a background process continuously scans for differences between nodes and copies missing data. This ensures nodes that were down for a long time eventually catch up — even if no reads trigger repair." }
] }
\`\`\`

\`\`\`sysdiag
{ "title": "Leaderless Write: N=3, W=2", "width": 640, "height": 300,
  "nodes": [
    { "id": "client", "label": "Client", "x": 80, "y": 150, "kind": "client" },
    { "id": "n1", "label": "Node 1\\n✅ ACK", "x": 320, "y": 60, "kind": "database" },
    { "id": "n2", "label": "Node 2\\n✅ ACK", "x": 320, "y": 150, "kind": "database" },
    { "id": "n3", "label": "Node 3\\n❌ Down", "x": 320, "y": 240, "kind": "database" }
  ],
  "edges": [
    { "from": "client", "to": "n1", "label": "write" },
    { "from": "client", "to": "n2", "label": "write" },
    { "from": "client", "to": "n3", "label": "write (fails)" }
  ],
  "annotations": {
    "client": "Sends write to all 3 nodes. Needs W=2 ACKs. Gets 2 → write succeeds despite Node 3 being down.",
    "n3": "Node is down. When it recovers, it gets stale data. A subsequent read will trigger read repair.",
    "n1": "Any node can accept writes. No leader election needed when Node 3 recovers."
  }
}
\`\`\`

### Quorum Tuning in Practice

\`\`\`callout
{ "type": "tip", "title": "Tuning W and R for Your Use Case", "content": "**High-write throughput (IoT sensors, metrics):** Set W=1, R=2. Writes are fast (only 1 ACK needed); reads cross-check for freshness.\\n\\n**Strong consistency required:** Set W=N, R=1 (or W=quorum, R=quorum). All nodes must ACK a write before it's confirmed.\\n\\n**High read throughput with tolerable staleness:** Set W=2, R=1. Fast reads, slightly higher write cost.\\n\\nCassandra calls these **consistency levels**: ONE, QUORUM, ALL." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Sloppy Quorums and Hinted Handoff", "content": "During a network partition, even W and R nodes may be unreachable. Cassandra and Dynamo use **sloppy quorums**: a write is accepted by a different (available) node acting as a temporary stand-in, with a **hint** noting where to forward the data once the real node recovers.\\n\\nThis increases availability but means W+R > N no longer guarantees you'll read your own writes during the partition window." }
\`\`\`

---

## Side-by-Side Comparison

\`\`\`tabs
{ "tabs": [
  { "label": "Leader-Follower", "icon": "👑", "content": "**Best for:** Transactional workloads, financial systems, anything needing strong consistency\\n\\n| Property | Value |\\n|---|---|\\n| Write nodes | 1 (leader only) |\\n| Conflicts possible | No |\\n| Consistency | Strong (sync) or eventual (async) |\\n| Failure recovery | Leader election (seconds–minutes) |\\n| Write availability | Limited — leader failure = write outage |\\n| Complexity | Low–Medium |\\n\\n**Examples:** PostgreSQL, MySQL, MongoDB (replica set), Kafka partition leaders\\n\\n**Avoid when:** You need active-active writes across multiple datacenters, or your write leader is a bottleneck." },
  { "label": "Multi-Leader", "icon": "👥", "content": "**Best for:** Multi-datacenter deployments, offline-capable apps, collaborative editing\\n\\n| Property | Value |\\n|---|---|\\n| Write nodes | 2+ (one per datacenter) |\\n| Conflicts possible | Yes |\\n| Consistency | Eventual / session |\\n| Failure recovery | Per-datacenter failover |\\n| Write availability | High — local datacenter keeps writing |\\n| Complexity | High (conflict resolution required) |\\n\\n**Examples:** CouchDB, MySQL with circular replication, many homegrown multi-DC setups\\n\\n**Avoid when:** Your data model makes conflict resolution ambiguous (financial balances, inventory counts)." },
  { "label": "Leaderless", "icon": "🌐", "content": "**Best for:** High-availability key-value workloads, time-series data, systems tolerating eventual consistency\\n\\n| Property | Value |\\n|---|---|\\n| Write nodes | All (W out of N) |\\n| Conflicts possible | Yes |\\n| Consistency | Tunable via W+R>N quorums |\\n| Failure recovery | Quorum degradation + read repair |\\n| Write availability | Highest — any node accepts writes |\\n| Complexity | Medium (quorum math, version vectors) |\\n\\n**Examples:** Amazon DynamoDB, Apache Cassandra, Riak, Voldemort\\n\\n**Avoid when:** You need transactional multi-key writes with strong consistency." }
] }
\`\`\`

---

## Replication Lag and Read-Your-Writes

One of the most common bugs in systems using async replication is **reading your own stale write**.

\`\`\`concept
{ "title": "Read-Your-Writes Consistency", "variant": "insight", "content": "After writing a value, a user should always see their own write on subsequent reads — even if the system is eventually consistent overall. This is called 'read-your-writes' (or 'read-your-own-writes') consistency.\\n\\nA common fix: route all reads for data that the current user just wrote to the leader (or the node that accepted the write) for a short window after the write. For other users' data, reading from a follower/replica is fine." }
\`\`\`

**Practical techniques for read-your-writes:**
- Route reads for the current user's own data to the leader for 1 minute after any write
- Track replication position and only serve reads from replicas that have caught up past the write's position
- Use sticky sessions — always route a user to the same replica

---

## Failure Scenarios Deep Dive

\`\`\`collapse
{ "title": "Deep Dive: The Split-Brain Problem in Leader-Follower", "content": "**What is split-brain?**\\n\\nDuring a network partition, the cluster may be unable to tell whether the leader has *crashed* or is simply *unreachable* due to a network issue. If the failover logic incorrectly elects a new leader while the old leader is still running (but partitioned), you now have **two leaders** — a split-brain scenario.\\n\\n**Why it's catastrophic:**\\nBoth leaders accept writes. Their replication logs diverge. When the partition heals, the two logs conflict and the system has no way to automatically reconcile which writes are authoritative.\\n\\n**How systems prevent it:**\\n- **STONITH (Shoot The Other Node In The Head):** Before a new leader takes over, send a command to forcibly shut down the old leader.\\n- **Quorum-based election:** Require an absolute majority of nodes to agree before promoting a new leader. If the cluster is split 50/50, neither side elects a leader.\\n- **Lease-based leadership:** Leaders hold a timed lease. If the lease expires before the leader can renew it, it stops accepting writes voluntarily.\\n- **Raft / Paxos:** Formal consensus algorithms that mathematically prevent two leaders from existing simultaneously.\\n\\n**PostgreSQL Patroni** uses etcd for distributed coordination to prevent split-brain in production deployments." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Vector Clocks vs Last-Write-Wins", "content": "**The problem with wall-clock timestamps:**\\n\\nNetwork Time Protocol (NTP) keeps clocks synchronized to within a few milliseconds — but that's not precise enough. In a system handling thousands of writes per second, two writes can arrive at different nodes within the same millisecond. Last-Write-Wins using wall clocks *silently drops* one of those writes.\\n\\nGoogle Spanner famously solved this with **TrueTime** — GPS and atomic clocks in every datacenter, providing bounded uncertainty intervals. If your write timestamps are within the uncertainty window, Spanner waits before committing.\\n\\n**Vector clocks:**\\nA vector clock is a list of (nodeId, counter) pairs that tracks causality rather than wall time.\\n\\n\`\`\`\\nNode A: [A:1, B:0] → writes value X\\nNode B: [A:0, B:1] → writes value Y (concurrently)\\nMerge result: [A:1, B:1] → conflict detected! Both X and Y exist.\\n\`\`\`\\n\\nAmazon's Dynamo used vector clocks (now Dynamo uses a simpler approach, but Riak still uses them). The benefit: you can tell whether two writes are causally related or truly concurrent. Only concurrent writes need conflict resolution; causally ordered writes can safely be discarded." }
\`\`\`

---

## System Design Interview Application

When asked to design a system in an interview, replication strategy is a key architectural decision. Here's how to reason through it:

\`\`\`steps
{ "title": "Choosing a Replication Strategy in an Interview", "steps": [
  { "title": "Identify write volume and patterns", "content": "**Ask:** How many writes per second? Are writes bursty? Are they distributed globally?\\n\\nHigh global write volume → single-leader creates a geographic bottleneck → consider multi-leader or leaderless." },
  { "title": "Identify consistency requirements", "content": "**Ask:** Can users tolerate reading stale data? Are there financial or inventory-critical writes?\\n\\nStrong consistency (banking, inventory) → leader-follower with sync replication.\\nBest-effort/eventually consistent (social feeds, analytics) → async follower or leaderless." },
  { "title": "Identify availability requirements", "content": "**Ask:** What is the acceptable downtime? Is a 30-second leader election acceptable?\\n\\nFive-nines availability → multi-leader or leaderless (no election downtime).\\nAP system (availability over consistency under partition) → Cassandra/Dynamo style." },
  { "title": "State the trade-off explicitly", "content": "Interviewers want to hear you acknowledge the trade-off:\\n\\n*'I'm choosing Cassandra with a quorum write policy for this use case. We get high write availability and low latency per-region. The trade-off is eventual consistency — we'll handle read-your-writes by routing user-specific reads through the coordinating node for 5 seconds after a write.'\\n\\nThis shows you understand CAP, have thought through failure modes, and have a concrete mitigation plan." }
] }
\`\`\`

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [
  { "question": "In a leaderless system with N=5, W=3, R=3, what is the minimum number of nodes that can fail before a write might not succeed?", "options": ["1 node", "2 nodes", "3 nodes", "4 nodes"], "answer": 1, "explanation": "W=3 means 3 nodes must ACK a write. With N=5, you can lose 5-3=2 nodes and still get 3 ACKs. If 3 nodes are down, only 2 remain — below the quorum of 3 — and the write fails." },
  { "question": "Why does multi-leader replication make conflict resolution necessary, while single-leader does not?", "options": ["Because multi-leader uses asynchronous replication, which causes lag", "Because multiple nodes accept writes simultaneously, so two nodes can receive conflicting writes for the same key at the same time", "Because multi-leader uses vector clocks instead of timestamps", "Because multi-leader does not use a replication log"], "answer": 1, "explanation": "Single-leader serializes all writes through one node — there is no way for two conflicting writes to be 'accepted' simultaneously. Multi-leader allows concurrent writes at different leaders, so two leaders can independently accept different values for the same key before they sync with each other." },
  { "question": "A user posts a tweet and immediately refreshes their feed — but doesn't see their own tweet. The system uses async leader-follower replication. What is the most likely cause?", "options": ["The leader rejected the write", "The user's read was served by a follower that hasn't yet received the replication log entry for the new tweet", "The tweet was lost due to a network error", "The follower had a higher version number than the leader"], "answer": 1, "explanation": "This is the classic 'replication lag' problem. The write succeeded at the leader, but the follower the user read from hasn't yet applied that log entry. This is a 'read-your-writes consistency' violation. Solutions include reading from the leader for the user's own content, or routing reads to a replica that has caught up past the write's log position." },
  { "question": "Which replication strategy is most appropriate for a multi-datacenter system that needs low write latency for users in every region AND can tolerate eventual consistency?", "options": ["Single-leader with sync replication", "Single-leader with the leader in the closest region", "Multi-leader with one leader per datacenter", "Leader-follower with followers in each datacenter"], "answer": 2, "explanation": "Multi-leader with one leader per datacenter allows each region to accept writes locally (low latency), then replicate asynchronously to other regions. Single-leader with sync replication would require every write to travel to the central leader, adding cross-continental latency. Followers in each datacenter can serve local reads but still route writes to the single leader." },
  { "question": "What is 'read repair' in the context of leaderless replication?", "options": ["Forcing all reads through the leader to ensure freshness", "A background anti-entropy process that runs on a schedule", "When a client detects a stale replica during a read and writes the latest version back to it", "Using quorum reads to average out inconsistencies"], "answer": 2, "explanation": "Read repair happens at read time: when a client queries R nodes and notices that some nodes returned an older version (lower version number) than others, the client immediately sends the latest value back to the stale nodes. This is a lazy, on-demand healing mechanism — nodes that are rarely read may remain stale for longer, which is why anti-entropy background processes complement it." }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "The three replication strategies differ on four structural axes: who accepts writes, whether conflicts are possible, the default consistency model, and the failure-recovery mechanism.",
  "Leader-follower provides strong consistency and simple conflict-free operation, but creates a write bottleneck and requires leader election on failure.",
  "Multi-leader enables active/active writes across datacenters with low regional latency, but introduces write conflicts that must be resolved via LWW, application logic, or CRDTs.",
  "Leaderless replication uses quorum math (W + R > N) to tune the consistency-availability trade-off without any leader election; read repair and anti-entropy handle stale replicas.",
  "Read-your-writes consistency is a common pitfall in async replication — solve it by routing a user's own data reads to the leader or a sufficiently up-to-date replica.",
  "In system design interviews, explicitly state the CAP trade-off you're making and explain your concrete mitigation for the weaker guarantee."
] }
\`\`\``,
    },
    {
      id: "database-sharding",
      slug: "database-sharding",
      title: "Database Sharding and Partitioning Strategies",
      content: `# Database Sharding and Partitioning Strategies

When your database hits its limits — slow queries, disk exhaustion, connection pool saturation — you have two choices: scale **up** (buy a bigger server) or scale **out** (spread the load across many servers). Sharding is how you scale out.

**Sharding** (also called horizontal partitioning) splits one large logical database into multiple smaller physical pieces called **shards**, each stored on a separate server. Every shard holds a subset of the total rows, and together they form the complete dataset.

\`\`\`concept
{ "title": "The Core Idea of Sharding", "variant": "analogy", "content": "Think of a phone book. One city-wide phone book becomes unmanageable — too heavy, too slow to search. Sharding is like splitting it into A–G, H–M, N–S, T–Z volumes, each stored in a different library branch. Every name still exists somewhere; you just need to know which branch to visit." }
\`\`\`

This lesson covers the three primary partitioning strategies, their trade-offs, hotspot problems, and the mechanics of shard rebalancing.

---

## Why Sharding Exists: The Scaling Wall

A single PostgreSQL or MySQL instance can comfortably handle a few terabytes and thousands of QPS. Beyond that, you hit hard limits:

| Bottleneck | Symptom | Sharding's Answer |
|---|---|---|
| Disk capacity | Table > single server's disk | Each shard holds a fraction of rows |
| Write throughput | Single write-ahead log, single lock manager | Parallel writes to independent shards |
| Read throughput | One set of CPU cores | Fan-out queries across shards |
| Connection limits | ~1000 connections per Postgres instance | Each shard has its own pool |

\`\`\`callout
{ "type": "warning", "title": "Sharding Is a Last Resort", "content": "Sharding adds significant operational complexity. Before sharding: exhaust read replicas, caching (Redis), vertical scaling, and query optimization. Only shard when you've genuinely hit the ceiling of a single-server architecture." }
\`\`\`

---

## The Three Core Partitioning Strategies

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Range Partitioning",
      "icon": "📏",
      "content": "## Range Partitioning\\n\\nRows are assigned to shards based on a **range of values** in the shard key.\\n\\n**Example — sharding by \`user_id\`:**\\n\\n| Shard | Range |\\n|---|---|\\n| Shard 0 | user_id 1 – 1,000,000 |\\n| Shard 1 | user_id 1,000,001 – 2,000,000 |\\n| Shard 2 | user_id 2,000,001 – 3,000,000 |\\n\\n**Pros:**\\n- Range scans are efficient — all rows for users 500k–600k live on one shard\\n- Easy to reason about which shard owns which data\\n- Adding a new shard at the end is trivial\\n\\n**Cons:**\\n- **Hotspot risk**: if recent users are far more active, the highest-range shard gets hammered\\n- Uneven data distribution if insertions aren't spread uniformly\\n- A single shard can become a bottleneck for time-series or sequential ID workloads"
    },
    {
      "label": "Hash Partitioning",
      "icon": "#️⃣",
      "content": "## Hash Partitioning\\n\\nA hash function is applied to the shard key, and the result determines the target shard:\\n\\n\`\`\`\\nshard_index = hash(key) % num_shards\\n\`\`\`\\n\\n**Example — 4 shards, sharding by \`user_id\`:**\\n\\n| user_id | hash(user_id) | hash % 4 | Shard |\\n|---|---|---|---|\\n| 1001 | 7823456 | 0 | Shard 0 |\\n| 1002 | 4521983 | 1 | Shard 1 |\\n| 1003 | 9034512 | 2 | Shard 2 |\\n| 1004 | 2219087 | 3 | Shard 3 |\\n\\n**Pros:**\\n- Excellent uniform distribution — hotspots are rare with a good hash function\\n- Deterministic: no lookup table needed\\n\\n**Cons:**\\n- Range scans are terrible — consecutive keys scatter across all shards\\n- **Rebalancing pain**: adding a shard changes \`% num_shards\`, requiring almost all data to move\\n- No locality for related records (e.g., all posts by one user)"
    },
    {
      "label": "Directory Partitioning",
      "icon": "📂",
      "content": "## Directory (Lookup-Based) Partitioning\\n\\nA **lookup table** (directory) maps each key (or key range) to a specific shard. The mapping is stored in a separate metadata service.\\n\\n\`\`\`\\nDirectory Service:\\n  tenant_id=acme    → Shard 2\\n  tenant_id=globex  → Shard 0\\n  tenant_id=initech → Shard 2\\n  tenant_id=hooli   → Shard 3\\n\`\`\`\\n\\n**Pros:**\\n- Maximum flexibility: move a tenant to any shard at will\\n- Can co-locate related entities (all of a tenant's data on one shard)\\n- Ideal for multi-tenant SaaS architectures\\n\\n**Cons:**\\n- The directory is a **single point of failure** — must be replicated and highly available\\n- Every query requires a directory lookup — adds latency unless heavily cached\\n- Cache consistency is a real challenge when shard assignments change"
    }
  ]
}
\`\`\`

---

## Visualizing Hash Partitioning

Watch how 8 user IDs distribute across 4 shards using \`hash(id) % 4\`:

\`\`\`algoviz
{
  "title": "Hash Partitioning: Distributing Keys Across 4 Shards",
  "type": "array",
  "data": [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008],
  "frames": [
    { "highlight": [0], "label": "hash(1001) % 4 = 0 → Shard 0", "stats": { "key": 1001, "shard": 0 } },
    { "highlight": [1], "label": "hash(1002) % 4 = 1 → Shard 1", "stats": { "key": 1002, "shard": 1 } },
    { "highlight": [2], "label": "hash(1003) % 4 = 2 → Shard 2", "stats": { "key": 1003, "shard": 2 } },
    { "highlight": [3], "label": "hash(1003) % 4 = 3 → Shard 3", "stats": { "key": 1004, "shard": 3 } },
    { "highlight": [4], "label": "hash(1005) % 4 = 1 → Shard 1", "stats": { "key": 1005, "shard": 1 } },
    { "highlight": [5], "label": "hash(1006) % 4 = 2 → Shard 2", "stats": { "key": 1006, "shard": 2 } },
    { "highlight": [6], "label": "hash(1007) % 4 = 3 → Shard 3", "stats": { "key": 1007, "shard": 3 } },
    { "highlight": [7], "label": "hash(1008) % 4 = 0 → Shard 0 — all shards balanced", "stats": { "key": 1008, "shard": 0 } }
  ],
  "speed": 900
}
\`\`\`

---

## A Sharded Architecture: The Full Picture

\`\`\`sysdiag
{
  "title": "Sharded Database Architecture",
  "width": 680,
  "height": 380,
  "nodes": [
    { "id": "app", "label": "App Server", "x": 340, "y": 40, "kind": "client" },
    { "id": "router", "label": "Shard Router", "x": 340, "y": 130, "kind": "service" },
    { "id": "dir", "label": "Directory\\nService", "x": 560, "y": 130, "kind": "cache" },
    { "id": "s0", "label": "Shard 0\\nusers 1–1M", "x": 120, "y": 270, "kind": "database" },
    { "id": "s1", "label": "Shard 1\\nusers 1M–2M", "x": 280, "y": 270, "kind": "database" },
    { "id": "s2", "label": "Shard 2\\nusers 2M–3M", "x": 440, "y": 270, "kind": "database" },
    { "id": "s3", "label": "Shard 3\\nusers 3M–4M", "x": 600, "y": 270, "kind": "database" }
  ],
  "edges": [
    { "from": "app", "to": "router", "label": "query(user_id=1500000)" },
    { "from": "router", "to": "dir", "label": "lookup shard" },
    { "from": "router", "to": "s0", "label": "" },
    { "from": "router", "to": "s1", "label": "route here" },
    { "from": "router", "to": "s2", "label": "" },
    { "from": "router", "to": "s3", "label": "" }
  ],
  "annotations": {
    "router": "Intercepts every query. Resolves which shard(s) to target based on the shard key extracted from the query predicate.",
    "dir": "Maps key ranges or tenant IDs to physical shard locations. Must be replicated and cached to avoid becoming a bottleneck.",
    "s1": "Receives this query because user_id 1,500,000 falls in the 1M–2M range."
  }
}
\`\`\`

---

## The Rebalancing Problem

The biggest operational headache with sharding is **rebalancing** — moving data when you add or remove shards.

### Naive Hash Rebalancing

With simple modulo hashing (\`hash(key) % N\`), adding one shard changes the denominator for **every key**:

\`\`\`playground
{
  "title": "Simulating Naive Hash Rebalancing",
  "language": "python",
  "code": "def shard_for(key, num_shards):\\n    return hash(key) % num_shards\\n\\nkeys = list(range(1000, 1020))\\n\\n# Before: 4 shards\\nbefore = {k: shard_for(k, 4) for k in keys}\\n\\n# After: 5 shards (added one!)\\nafter = {k: shard_for(k, 5) for k in keys}\\n\\nmoved = [k for k in keys if before[k] != after[k]]\\nstayed = [k for k in keys if before[k] == after[k]]\\n\\nprint(f\\"Keys that MOVED shard: {len(moved)}/{len(keys)} ({100*len(moved)//len(keys)}%)\\")\\nprint(f\\"Keys that STAYED:      {len(stayed)}/{len(keys)}\\")\\nprint()\\nfor k in keys[:8]:\\n    marker = \\"<-- MOVED\\" if before[k] != after[k] else \\"\\"\\n    print(f\\"  key={k}  before=Shard{before[k]}  after=Shard{after[k]} {marker}\\")\\n",
  "runnable": true
}
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "Naive Rebalancing Moves ~80% of Your Data", "content": "When you go from N to N+1 shards using \`hash % N\`, roughly \`N/(N+1)\` of all keys — often 75–80% — must be copied to a new shard. For a 10 TB database this means copying ~8 TB while serving live traffic. This is why consistent hashing was invented." }
\`\`\`

---

## Consistent Hashing: Rebalancing Done Right

Consistent hashing maps both **keys** and **shard nodes** onto the same circular hash ring (0 to 2³²). A key is owned by the first node encountered when walking clockwise from the key's position.

\`\`\`concept
{ "title": "Consistent Hashing Minimizes Data Movement", "variant": "rule", "content": "When a shard is added or removed, only the keys in the arc adjacent to that shard's position on the ring need to move. On average, only K/N keys migrate (where K = total keys, N = number of shards). Going from 4 → 5 shards moves ~20% of data instead of ~80%." }
\`\`\`

\`\`\`playground
{
  "title": "Consistent Hashing: Minimal Rebalancing",
  "language": "python",
  "code": "import hashlib\\n\\ndef ring_hash(value):\\n    \\"\\"\\"Map a string to a position on the hash ring (0 to 2^32).\\"\\"\\"\\n    return int(hashlib.md5(str(value).encode()).hexdigest(), 16) % (2**32)\\n\\ndef find_shard(key, nodes):\\n    \\"\\"\\"Walk clockwise from key's position to find the owning node.\\"\\"\\"\\n    key_pos = ring_hash(key)\\n    node_positions = sorted((ring_hash(n), n) for n in nodes)\\n    for pos, node in node_positions:\\n        if key_pos <= pos:\\n            return node\\n    return node_positions[0][1]  # wrap around\\n\\nkeys = [f\\"user:{i}\\" for i in range(1, 21)]\\n\\n# Before: 4 shards\\nnodes_before = [\\"shard-A\\", \\"shard-B\\", \\"shard-C\\", \\"shard-D\\"]\\nbefore = {k: find_shard(k, nodes_before) for k in keys}\\n\\n# After: add shard-E\\nnodes_after = [\\"shard-A\\", \\"shard-B\\", \\"shard-C\\", \\"shard-D\\", \\"shard-E\\"]\\nafter = {k: find_shard(k, nodes_after) for k in keys}\\n\\nmoved = [k for k in keys if before[k] != after[k]]\\nprint(f\\"Keys moved when adding 1 shard: {len(moved)}/{len(keys)} ({100*len(moved)//len(keys)}%)\\")\\nprint()\\nfor k in moved:\\n    print(f\\"  {k}: {before[k]} --> {after[k]}\\")\\n",
  "runnable": true
}
\`\`\`

---

## Hotspots: When Sharding Backfires

Even with good sharding, **hotspots** can emerge — one shard receiving disproportionate traffic.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Celebrity Problem",
      "icon": "⭐",
      "content": "## The Celebrity / Power User Problem\\n\\nIf you shard a social network's \`posts\` table by \`user_id\`, the shard containing Elon Musk or Taylor Swift handles millions of reads per second while others sit idle.\\n\\n**Solutions:**\\n- **Key suffix salting**: append a random suffix (0–9) to spread one user across 10 virtual shards: \`user_id:3\`, \`user_id:7\`, etc.\\n- **Dedicated shard**: move VIP users to their own shard with extra hardware\\n- **Application-level caching**: serve celebrity reads from Redis, never hitting the DB"
    },
    {
      "label": "Time-Series Hotspot",
      "icon": "🕐",
      "content": "## Time-Series / Sequential Key Hotspot\\n\\nIf you shard by \`created_at\` using range partitioning, all new writes land on the **latest shard** — the other shards are read-only cold storage.\\n\\n**Solutions:**\\n- Use hash partitioning for write distribution (sacrifice range scan locality)\\n- **Composite shard key**: \`hash(user_id) + time_bucket\` balances writes while maintaining per-user locality\\n- **Write-ahead aggregation**: batch time-series writes in a buffer layer before fan-out"
    },
    {
      "label": "Cross-Shard Queries",
      "icon": "🔗",
      "content": "## Cross-Shard Query Complexity\\n\\nA SQL JOIN across two shards requires either:\\n\\n1. **Scatter-gather**: fan the query out to all shards, merge results in the application layer\\n2. **Denormalization**: pre-join and store redundant data so reads stay within one shard\\n3. **Global tables**: replicate small reference tables (e.g., country codes) to every shard\\n\\n\`\`\`sql\\n-- This query across shards requires scatter-gather:\\nSELECT o.*, u.name\\nFROM orders o\\nJOIN users u ON o.user_id = u.id\\nWHERE o.created_at > '2024-01-01';\\n\`\`\`\\n\\nIf \`orders\` and \`users\` are on different shards, the router must query both and merge in memory. This kills the latency gains sharding was supposed to provide — so always **shard related tables on the same key**."
    }
  ]
}
\`\`\`

---

## Choosing the Right Shard Key

\`\`\`concept
{ "title": "The Shard Key Is Your Most Important Schema Decision", "variant": "mental-model", "content": "A shard key cannot be changed without rewriting your entire dataset. Ask three questions before committing: (1) Does this key distribute write traffic evenly? (2) Does this key keep related data co-located for common queries? (3) Does this key avoid hotspots for power users? If you can't satisfy all three, prioritize (1) and mitigate (2) and (3) in the application layer." }
\`\`\`

| Use Case | Recommended Shard Key | Reason |
|---|---|---|
| Social network | \`user_id\` (hash) | Co-locates a user's posts/followers; even distribution |
| E-commerce | \`tenant_id\` (directory) | Tenant isolation; can move big tenants to dedicated shards |
| IoT / time-series | \`device_id\` (hash) | Even write distribution; per-device queries stay local |
| Multi-region app | \`region\` (range) | Data locality; compliance with data residency laws |
| URL shortener | \`short_code\` (hash) | Pure lookup; even read/write distribution |

---

## Practice: Implement a Shard Router

\`\`\`fillblank
{
  "title": "Fill in the Shard Router",
  "prompt": "Complete the \`ShardRouter\` class. The \`hash_shard\` method should return the shard index using Python's built-in \`hash()\` and modulo. The \`range_shard\` method should iterate through sorted boundaries and return the shard whose upper bound is the first value greater than or equal to the key.",
  "language": "python",
  "template": "class ShardRouter:\\n    def __init__(self, num_shards):\\n        self.num_shards = num_shards\\n\\n    def hash_shard(self, key):\\n        # Return shard index: hash of key modulo num_shards\\n        return ___(key) % ___\\n\\n    def range_shard(self, key, boundaries):\\n        # boundaries = sorted list of upper bounds, one per shard\\n        # e.g. [1000000, 2000000, 3000000, float('inf')]\\n        for i, upper in ___(boundaries):\\n            if key <= upper:\\n                return ___\\n        return self.num_shards - 1\\n\\nrouter = ShardRouter(4)\\nprint(router.hash_shard(\\"user:1001\\"))  # some shard 0-3\\nprint(router.range_shard(1500000, [1000000, 2000000, 3000000, float('inf')]))  # 1",
  "blanks": [
    { "answer": "hash", "hint": "Python's built-in hash function" },
    { "answer": "self.num_shards", "hint": "The total number of shards" },
    { "answer": "enumerate", "hint": "Iterate with both index and value" },
    { "answer": "i", "hint": "The current shard index" }
  ]
}
\`\`\`

---

## Strategy Comparison at a Glance

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Poor Shard Key (timestamp for write-heavy workload)",
    "code": "-- Sharding orders table by created_at range\\n-- ALL new writes go to the 'current' shard\\n-- Older shards sit idle\\nCREATE TABLE orders_shard_2024_q1 ...  -- cold\\nCREATE TABLE orders_shard_2024_q2 ...  -- cold  \\nCREATE TABLE orders_shard_2024_q3 ...  -- cold\\nCREATE TABLE orders_shard_2024_q4 ...  -- 100% of writes here!"
  },
  "after": {
    "label": "Good Shard Key (user_id hash for write-heavy workload)",
    "code": "-- Sharding orders table by hash(user_id) % 4\\n-- Writes fan out evenly across all shards\\nCREATE TABLE orders_shard_0 ...  -- ~25% of writes\\nCREATE TABLE orders_shard_1 ...  -- ~25% of writes\\nCREATE TABLE orders_shard_2 ...  -- ~25% of writes\\nCREATE TABLE orders_shard_3 ...  -- ~25% of writes\\n-- Range queries on created_at require scatter-gather\\n-- Acceptable trade-off for even write throughput"
  }
}
\`\`\`

---

## Quiz

\`\`\`quiz
{
  "title": "Sharding and Partitioning Strategies",
  "questions": [
    {
      "question": "You add a 5th shard to a system using naive modulo hash partitioning (\`hash(key) % N\`). Approximately what percentage of existing data must migrate?",
      "options": [
        "~20% — only the data that maps to the new shard",
        "~50% — half the data on average",
        "~80% — most keys now map to a different shard",
        "~100% — all data must be rehashed"
      ],
      "answer": 2,
      "explanation": "With \`hash(key) % N\`, changing N from 4 to 5 means N/(N+1) = 4/5 = 80% of keys map to a different shard. This is the core problem consistent hashing solves — it limits migration to only ~1/N of keys."
    },
    {
      "question": "A social platform shards its \`posts\` table by \`user_id\` using range partitioning. A celebrity with 50 million followers joins. What problem does this cause?",
      "options": [
        "Cross-shard join complexity increases",
        "The celebrity's shard becomes a hotspot under disproportionate read load",
        "The directory service loses track of the celebrity's shard",
        "Consistent hashing fails to place the celebrity on any shard"
      ],
      "answer": 1,
      "explanation": "This is the 'power user' or 'celebrity problem'. Since all reads for the celebrity's posts go to one shard (the one whose range covers their user_id), that shard gets hammered while others are idle. Solutions include key salting, dedicated shards, or application-level caching."
    },
    {
      "question": "Which partitioning strategy is best suited for a multi-tenant SaaS application where you need to migrate a large customer to dedicated hardware?",
      "options": [
        "Range partitioning by tenant_id",
        "Hash partitioning by tenant_id",
        "Directory (lookup-based) partitioning",
        "Consistent hashing with virtual nodes"
      ],
      "answer": 2,
      "explanation": "Directory partitioning stores an explicit tenant_id → shard mapping. Moving a tenant is just updating one row in the directory — no data rehashing required. This flexibility is exactly why directory partitioning is the standard approach for multi-tenant SaaS architectures."
    },
    {
      "question": "You need to run: \`SELECT * FROM orders WHERE user_id = 42 AND created_at > '2024-01-01'\`. The \`orders\` table is sharded by \`hash(user_id) % 8\`. How many shards does the router need to query?",
      "options": [
        "All 8 shards — scatter-gather is required",
        "4 shards — half the ring",
        "Exactly 1 shard — user_id uniquely identifies the target",
        "It depends on the created_at index"
      ],
      "answer": 2,
      "explanation": "Because the query includes the shard key (\`user_id = 42\`), the router can deterministically compute \`hash(42) % 8\` and route to exactly one shard. The \`created_at\` filter is then applied locally on that shard. This is the ideal query pattern for sharded systems."
    },
    {
      "question": "What is the main disadvantage of consistent hashing compared to simple modulo hashing?",
      "options": [
        "It requires more data movement when rebalancing",
        "It produces uneven distribution of keys",
        "It is more complex to implement and typically requires virtual nodes for balance",
        "It cannot handle shard removal, only shard addition"
      ],
      "answer": 2,
      "explanation": "Consistent hashing dramatically reduces rebalancing data movement, but it comes at the cost of implementation complexity. Without virtual nodes, basic consistent hashing can produce uneven load distribution. Virtual nodes (where each physical shard maps to multiple positions on the ring) solve this but add further complexity."
    }
  ]
}
\`\`\`

---

\`\`\`collapse
{ "title": "Deep Dive: Virtual Nodes in Consistent Hashing", "content": "## Virtual Nodes (vnodes)\\n\\nA basic consistent hashing ring with 4 physical shards places exactly 4 points on the ring. The arc size between adjacent points varies, meaning some shards own more of the key space than others — potentially 2–3× imbalance.\\n\\n**Virtual nodes** solve this: each physical shard maps to \`V\` positions on the ring (e.g., 150 positions per shard). The positions are determined by hashing \`shard_name:0\`, \`shard_name:1\`, ..., \`shard_name:149\`.\\n\\nWith 150 vnodes per shard:\\n- Key space is split into 150 × N arcs instead of N arcs\\n- Each physical shard owns ~150 small arcs scattered around the ring\\n- Statistical averaging means each shard owns ≈1/N of the total key space\\n- When a shard is removed, its 150 arcs are distributed to its neighbors — many shards absorb a small amount each, rather than one neighbor absorbing a huge arc\\n\\nCassandra uses 256 vnodes per node by default. DynamoDB uses a similar token-range approach.\\n\\n\`\`\`python\\ndef build_ring(shards, vnodes_per_shard=150):\\n    ring = {}\\n    for shard in shards:\\n        for v in range(vnodes_per_shard):\\n            vnode_key = f\\"{shard}:{v}\\"\\n            position = ring_hash(vnode_key)\\n            ring[position] = shard\\n    return dict(sorted(ring.items()))\\n\`\`\`\\n\\nThe trade-off: more vnodes = better balance but more metadata to store and more positions to scan during routing." }
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Sharding distributes rows across multiple servers — each shard is a subset of the total data, enabling horizontal scaling beyond single-server limits.",
    "Range partitioning excels at range scans but risks hotspots on sequential keys; hash partitioning distributes evenly but breaks range queries and makes naive rebalancing expensive.",
    "Directory partitioning offers the most flexibility (ideal for multi-tenant SaaS) but requires a highly available lookup service that becomes a critical dependency.",
    "Naive modulo hashing (\`hash % N\`) forces ~80% data movement when adding a shard. Consistent hashing limits migration to ~1/N of data by mapping keys and nodes onto the same hash ring.",
    "Hotspots are the silent killer of sharded systems — power users, sequential IDs, and time-series workloads all require special mitigation (key salting, caching, composite keys).",
    "The shard key is the most consequential schema decision you'll make — it determines your query patterns, data locality, rebalancing cost, and hotspot risk for the lifetime of the system."
  ]
}
\`\`\``,
      starterCode: `# Database Sharding and Partitioning Strategies
# Exercise: Implement a ShardRouter that supports three partitioning strategies

import hashlib
from typing import Any

# Simulated shard nodes
SHARDS = ["shard_0", "shard_1", "shard_2", "shard_3"]

# Directory-based partitioning lookup table
DIRECTORY: dict[str, str] = {}


def range_partition(user_id: int, num_shards: int) -> str:
    """
    Route a user_id to a shard using RANGE partitioning.
    Divide the ID space [0, 1000) evenly across shards.

    Example with 4 shards:
      IDs 0-249   -> shard_0
      IDs 250-499 -> shard_1
      IDs 500-749 -> shard_2
      IDs 750-999 -> shard_3
    """
    # TODO: Calculate the size of each range bucket
    bucket_size = None  # replace with: 1000 // num_shards

    # TODO: Determine which shard index this user_id falls into
    shard_index = None  # replace with: user_id // bucket_size

    # TODO: Return the shard name, e.g. "shard_2"
    return None


def hash_partition(user_id: int, num_shards: int) -> str:
    """
    Route a user_id to a shard using HASH partitioning.
    Hash the key and take modulo of num_shards.
    """
    # TODO: Convert user_id to a string and encode to bytes, then compute MD5 hex digest
    hash_hex = None  # hashlib.md5(str(user_id).encode()).hexdigest()

    # TODO: Convert the first 8 characters of the hex digest to an integer (base 16)
    hash_int = None  # int(hash_hex[:8], 16)

    # TODO: Use modulo to pick a shard index and return the shard name
    return None


def directory_partition(user_id: int) -> str:
    """
    Route a user_id to a shard using DIRECTORY-based partitioning.
    Look up the shard in the DIRECTORY dict; raise KeyError if not found.
    """
    key = str(user_id)

    # TODO: Return DIRECTORY[key], or raise KeyError with a descriptive message
    #       if the key is not present in the directory
    pass


def detect_hotspot(routing_results: list[str]) -> dict[str, int]:
    """
    Given a list of shard names (one per request), count how many
    requests each shard received and return the counts dict.
    A hotspot exists when one shard gets far more traffic than others.
    """
    counts: dict[str, int] = {}

    # TODO: Iterate over routing_results and count occurrences of each shard name
    for shard in routing_results:
        pass  # counts[shard] = counts.get(shard, 0) + 1

    return counts


# --- Tests (run this file to check your work) ---
if __name__ == "__main__":
    # Populate directory for a small set of users
    for uid in range(20):
        DIRECTORY[str(uid)] = f"shard_{uid % 4}"

    print("=== Range Partitioning ===")
    for uid in [0, 249, 250, 500, 750, 999]:
        print(f"  user {uid:4d} -> {range_partition(uid, 4)}")

    print("\\n=== Hash Partitioning ===")
    for uid in [1, 2, 3, 4, 5]:
        print(f"  user {uid} -> {hash_partition(uid, 4)}")

    print("\\n=== Directory Partitioning ===")
    for uid in [0, 7, 15]:
        print(f"  user {uid} -> {directory_partition(uid)}")

    print("\\n=== Hotspot Detection ===")
    # Simulate a hotspot: most traffic goes to shard_0
    simulated = ["shard_0"] * 70 + ["shard_1"] * 10 + ["shard_2"] * 15 + ["shard_3"] * 5
    counts = detect_hotspot(simulated)
    print(f"  Shard load: {counts}")
    hotspot = max(counts, key=lambda s: counts[s])
    print(f"  Hotspot detected: {hotspot} ({counts[hotspot]} requests)")
`,
      solutionCode: `# Database Sharding and Partitioning Strategies
# Solution: ShardRouter with range, hash, and directory partitioning

import hashlib

# Simulated shard nodes
SHARDS = ["shard_0", "shard_1", "shard_2", "shard_3"]

# Directory-based partitioning lookup table
DIRECTORY: dict[str, str] = {}


def range_partition(user_id: int, num_shards: int) -> str:
    """
    Range partitioning divides the key space into equal buckets.
    Simple and fast, but sequential inserts concentrate writes on one
    shard (a write hotspot) until the range fills up.
    """
    bucket_size = 1000 // num_shards   # e.g. 250 IDs per shard
    shard_index = user_id // bucket_size
    # Clamp to avoid overflow for edge values like 999 with 4 shards
    shard_index = min(shard_index, num_shards - 1)
    return f"shard_{shard_index}"


def hash_partition(user_id: int, num_shards: int) -> str:
    """
    Hash partitioning distributes keys pseudo-randomly, avoiding hotspots
    for sequential IDs. The trade-off: range queries require hitting ALL
    shards (scatter-gather), making them expensive.
    """
    hash_hex = hashlib.md5(str(user_id).encode()).hexdigest()
    hash_int = int(hash_hex[:8], 16)   # first 32 bits of hash
    shard_index = hash_int % num_shards
    return f"shard_{shard_index}"


def directory_partition(user_id: int) -> str:
    """
    Directory partitioning stores an explicit mapping in a lookup table.
    Maximum flexibility: individual keys can be moved without rehashing.
    The cost: the directory itself becomes a bottleneck / single point of
    failure and must be kept consistent across the cluster.
    """
    key = str(user_id)
    if key not in DIRECTORY:
        raise KeyError(f"No shard mapping found for user_id={user_id}")
    return DIRECTORY[key]


def detect_hotspot(routing_results: list[str]) -> dict[str, int]:
    """
    Count how many requests each shard received.
    A healthy cluster has roughly equal counts; a hotspot means one shard
    is overwhelmed and may need splitting or rebalancing.
    """
    counts: dict[str, int] = {}
    for shard in routing_results:
        counts[shard] = counts.get(shard, 0) + 1
    return counts


# --- Tests ---
if __name__ == "__main__":
    # Populate directory for a small set of users
    for uid in range(20):
        DIRECTORY[str(uid)] = f"shard_{uid % 4}"

    print("=== Range Partitioning ===")
    for uid in [0, 249, 250, 500, 750, 999]:
        print(f"  user {uid:4d} -> {range_partition(uid, 4)}")
    # Expected: shard_0, shard_0, shard_1, shard_2, shard_3, shard_3

    print("\\n=== Hash Partitioning ===")
    for uid in [1, 2, 3, 4, 5]:
        print(f"  user {uid} -> {hash_partition(uid, 4)}")
    # Distribution appears random — no sequential hotspot

    print("\\n=== Directory Partitioning ===")
    for uid in [0, 7, 15]:
        print(f"  user {uid} -> {directory_partition(uid)}")
    # shard_0, shard_3, shard_3

    print("\\n=== Hotspot Detection ===")
    simulated = ["shard_0"] * 70 + ["shard_1"] * 10 + ["shard_2"] * 15 + ["shard_3"] * 5
    counts = detect_hotspot(simulated)
    print(f"  Shard load: {counts}")
    hotspot = max(counts, key=lambda s: counts[s])
    print(f"  Hotspot detected: {hotspot} ({counts[hotspot]} requests)")
    # shard_0 is clearly overloaded -> needs rebalancing or splitting
`,
    },
    {
      id: "checkpoint-database-selection",
      slug: "checkpoint-database-selection",
      title: "Checkpoint: Pick the Right Database for 5 Scenarios",
      content: `# Checkpoint: Pick the Right Database for 5 Scenarios

You've learned the theory — relational vs. document, column-family vs. graph, CAP theorem trade-offs, and when consistency matters more than availability. Now it's time to put that knowledge to work.

This checkpoint walks through **five real-world storage scenarios**. For each one, you'll see the access patterns, read the constraints, and reason through the right database choice — the same way you would in a system design interview.

\`\`\`concept
{ "title": "The Database Selection Framework", "variant": "mental-model", "content": "Before picking a database, answer four questions in order:\\n\\n1. **What is the primary access pattern?** (key lookup, range scan, traversal, aggregation)\\n2. **What are the consistency requirements?** (strong, eventual, session)\\n3. **What is the read/write ratio?** (read-heavy, write-heavy, balanced)\\n4. **Does the schema change often?** (fixed vs. dynamic)\\n\\nThe answers almost always point to one database family. The CAP theorem then helps you choose the specific product." }
\`\`\`

---

## How to Use This Lesson

For each scenario, read the requirements, reason through the constraints yourself, then expand to see the recommended approach and the trade-offs involved. The quiz at the end tests your ability to apply these decisions to new situations.

---

## Scenario 1 — The Social Graph (LinkedIn / Twitter)

**System:** A professional network with 500 million users. Users follow other users, belong to organizations, and have connections. The core feature is **"People You May Know"** — finding 2nd and 3rd degree connections.

**Key requirements:**
- Find all followers of user X: O(1)
- Find mutual connections between users A and B
- Traverse connection depth up to 4 hops
- Write rate: moderate (follows/unfollows)
- Read rate: very high (profile loads, feed generation)

\`\`\`tabs
{ "tabs": [
  {
    "label": "The Problem",
    "icon": "🔍",
    "content": "### Why Relational Fails Here\\n\\nIn a SQL schema, you'd store friendships in a \`connections\` table:\\n\\n\`\`\`sql\\nCREATE TABLE connections (\\n  user_id_a BIGINT,\\n  user_id_b BIGINT,\\n  PRIMARY KEY (user_id_a, user_id_b)\\n);\\n\`\`\`\\n\\nFinding 2nd-degree connections requires a **self-join**:\\n\\n\`\`\`sql\\nSELECT c2.user_id_b\\nFROM connections c1\\nJOIN connections c2 ON c1.user_id_b = c2.user_id_a\\nWHERE c1.user_id_a = ?\\nAND c2.user_id_b != ?;\\n\`\`\`\\n\\nAt 500M users, each with ~300 connections, this join touches **150 billion rows**. With 4-hop traversal, it becomes intractable. This is the fundamental mismatch: **relational databases optimize for sets, not paths**."
  },
  {
    "label": "The Solution",
    "icon": "✅",
    "content": "### Graph Database: Neo4j\\n\\nGraph databases store nodes (users, companies) and edges (follows, works_at) natively. Traversal is pointer-chasing — each node holds direct references to its neighbors.\\n\\n\`\`\`\\nCypher query — 2nd degree connections:\\nMATCH (me:User {id: $userId})-[:FOLLOWS*2]->(suggestions:User)\\nWHERE NOT (me)-[:FOLLOWS]->(suggestions)\\nRETURN DISTINCT suggestions LIMIT 20\\n\`\`\`\\n\\n**Why this works:**\\n- Traversal complexity is proportional to the **number of relationships traversed**, not total dataset size\\n- Adding a new user never slows down existing queries (no join table grows)\\n- Native index-free adjacency: each node stores direct pointers to neighbors\\n\\n**Real world:** LinkedIn uses a custom graph engine. Twitter's social graph is stored in a service called **Flock** — a custom in-memory graph store built on MySQL shards, with the graph structure in memory for fast traversal."
  },
  {
    "label": "Trade-offs",
    "icon": "⚖️",
    "content": "### What You Give Up\\n\\n| Factor | Impact |\\n|--------|--------|\\n| **Consistency** | Neo4j offers ACID on single-instance; clusters trade some consistency for availability |\\n| **Analytics** | Graph DBs are poor at aggregate analytics — you'd still use a data warehouse for \\"how many users joined this month\\" |\\n| **Operational complexity** | Graph query language (Cypher) is a new skill. Fewer engineers know it |\\n| **Cost** | Neo4j Enterprise is expensive. Many teams use PostgreSQL with recursive CTEs for smaller graphs |\\n\\n**When to use PostgreSQL instead:** If your social graph has < 10M nodes and you rarely do 3+ hop traversals, PostgreSQL with recursive CTEs (WITH RECURSIVE) is often sufficient and far simpler to operate."
  }
] }
\`\`\`

---

## Scenario 2 — Time-Series Metrics (Datadog / Prometheus)

**System:** An infrastructure monitoring platform ingesting metrics from 10 million servers. Each server emits CPU, memory, disk, and network metrics **every 10 seconds**. Engineers query dashboards showing the last 24 hours at 1-minute resolution, or the last year at 1-day resolution.

**Key requirements:**
- Write rate: ~50 million data points per minute
- Queries are always time-bounded (\`WHERE time > now() - 24h\`)
- Old data is queried at lower resolution (downsampling)
- Data older than 1 year is automatically deleted

\`\`\`concept
{ "title": "Time-Series Data Is Append-Only — Design Around It", "variant": "rule", "content": "Time-series workloads have a unique property: **data is written once, never updated, and read in time-sorted order**. This means:\\n\\n- Updates and deletes are rare (no write amplification from UPDATE)\\n- Compression is extremely effective (timestamps are sequential, values change slowly)\\n- Range scans dominate queries (always \`WHERE time BETWEEN t1 AND t2\`)\\n- Old data naturally cools and can be tiered to cheap storage\\n\\nAny database that doesn't exploit this structure — ordering writes by time, storing data in time-sorted chunks, compressing per column — will waste 10x-100x the storage and be 10x-100x slower on reads." }
\`\`\`

\`\`\`steps
{ "title": "Why InfluxDB or TimescaleDB Wins Here", "steps": [
  {
    "title": "Chunked Storage",
    "content": "Time-series databases store data in **time-ordered chunks** (e.g., one chunk per hour). A query for the last 2 hours only touches 2 chunks — not the entire dataset. TimescaleDB calls these hypertable chunks. InfluxDB calls them shards."
  },
  {
    "title": "Columnar Compression",
    "content": "Within each chunk, data is stored **column by column** rather than row by row. Timestamps are delta-encoded (storing the difference between consecutive timestamps rather than full values). A value like CPU% that changes slowly compresses to almost nothing with run-length encoding. InfluxDB achieves **40-60x compression** on typical metric data."
  },
  {
    "title": "Native Downsampling",
    "content": "Both databases have built-in **continuous aggregations** (TimescaleDB) or **tasks** (InfluxDB 2.0) that automatically roll up 10-second data into 1-minute summaries, and 1-minute into 1-hour. Your dashboard query for \\"last year, daily resolution\\" reads the pre-aggregated 1-day table — not 50 million raw rows."
  },
  {
    "title": "Automatic TTL / Retention Policies",
    "content": "You configure a **retention policy** (\`DELETE data older than 1 year\`). The database handles this automatically by dropping entire chunks — a near-instant operation that never causes write amplification. Doing this in PostgreSQL requires expensive \`DELETE FROM metrics WHERE time < ?\` queries that rewrite indexes."
  }
] }
\`\`\`

**Real world:** Datadog processes **tens of trillions of data points per day**. Their storage layer, called **Husky**, is a custom time-series engine. Prometheus uses a local time-series database called **TSDB** (time-series database) with the same chunked approach. For most teams, TimescaleDB (PostgreSQL extension) is the right choice — you get time-series optimization with the full SQL ecosystem.

---

## Scenario 3 — E-Commerce Inventory (Amazon / Shopify)

**System:** An e-commerce platform with 2 million products. When a customer places an order, the inventory count must decrement. If two customers simultaneously try to buy the last unit, only one should succeed.

**Key requirements:**
- Inventory reads: very high (product page loads)
- Inventory writes: moderate (orders, restocks)
- **Race condition safety is critical** — overselling is a business disaster
- Complex queries: "Find all products in category X with stock > 0 and price between $20-$50"
- Schema is well-defined and stable

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Bad: Redis for Inventory", "code": "# Using Redis DECR — looks fast, but:\\nredis.decr('inventory:product:42')\\n\\n# Problem 1: If DECR succeeds but the order write to\\n# your primary DB fails — stock is gone, no order exists.\\n# You've created a phantom decrement.\\n\\n# Problem 2: No support for complex queries like\\n# 'products with stock > 0 AND category = electronics'\\n# You'd need to fetch all keys and filter in code.\\n\\n# Problem 3: Redis persistence (RDB/AOF) can lose\\n# the last few seconds of writes on crash." }, "after": { "label": "Good: PostgreSQL with SELECT FOR UPDATE", "code": "-- Atomic inventory decrement inside a transaction:\\nBEGIN;\\n\\nSELECT stock\\nFROM inventory\\nWHERE product_id = 42\\nFOR UPDATE;  -- Row-level lock: blocks other transactions\\n\\n-- Check stock before decrementing\\nUPDATE inventory\\nSET stock = stock - 1\\nWHERE product_id = 42 AND stock > 0;\\n\\n-- If 0 rows updated, stock was 0 — rollback and tell user\\nCOMMIT;\\n\\n-- The lock is held only for milliseconds.\\n-- ACID guarantees no overselling is possible." } }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Pattern: Read from Redis, Write to PostgreSQL", "content": "Production e-commerce systems often use **both**:\\n\\n- **Redis** caches the inventory count for fast product page reads (cache miss rate < 1%)\\n- **PostgreSQL** is the source of truth for all writes and order processing\\n- On inventory change, invalidate the Redis key\\n\\nThis gives you the read speed of Redis with the consistency guarantees of PostgreSQL. Never use Redis as the authoritative store for anything with financial consequences." }
\`\`\`

**Why relational wins here:** Inventory is fundamentally a **consistency problem**. You need ACID transactions. PostgreSQL's row-level locking (\`SELECT FOR UPDATE\`) handles thousands of concurrent orders without overselling. The schema is stable and well-defined, range queries are efficient with B-tree indexes, and the data relationships (products → categories → warehouses) are naturally relational.

---

## Scenario 4 — Chat Messages (WhatsApp / Slack)

**System:** A messaging platform with 2 billion users. Users send messages in 1-on-1 and group conversations. The primary query is **"load the last 50 messages in conversation X"**. Messages are never updated (only deleted in rare cases). Historical search ("find messages containing 'project deadline' in the last 90 days") is a secondary use case.

**Key requirements:**
- Write rate: extremely high (100 billion messages/day at WhatsApp scale)
- Primary read: last N messages in a conversation (by time)
- Reads are always scoped to a conversation ID
- Messages are immutable after send (append-only)
- No cross-conversation queries at runtime

\`\`\`concept
{ "title": "Wide-Column Stores Excel at Partition-Scoped Reads", "variant": "analogy", "content": "Think of Apache Cassandra like a giant filing cabinet.\\n\\n- Each **drawer** is a partition key (the \`conversation_id\`)\\n- Inside each drawer, papers are **sorted by date** (the clustering key: \`sent_at DESC\`)\\n- To read the last 50 messages, you open the exact drawer and grab the top 50 papers\\n- You never need to look in any other drawer\\n\\nThis is why Cassandra is fast for this access pattern: **all data for one conversation lives together, physically sorted by time**. A query for the last 50 messages in conversation 'abc123' reads exactly one partition — no scatter-gather, no joins." }
\`\`\`

\`\`\`tabs
{ "tabs": [
  {
    "label": "Cassandra Schema",
    "icon": "🗃️",
    "content": "\`\`\`sql\\nCREATE TABLE messages (\\n  conversation_id UUID,\\n  sent_at         TIMESTAMP,\\n  message_id      UUID,\\n  sender_id       UUID,\\n  content         TEXT,\\n  message_type    TEXT,   -- 'text', 'image', 'video'\\n  PRIMARY KEY (conversation_id, sent_at, message_id)\\n) WITH CLUSTERING ORDER BY (sent_at DESC);\\n\`\`\`\\n\\nThe \`PRIMARY KEY\` is the critical decision:\\n- \`conversation_id\` → partition key: all messages for one chat are co-located\\n- \`sent_at, message_id\` → clustering key: physically sorted by time descending\\n\\nLoad the last 50 messages:\\n\`\`\`sql\\nSELECT * FROM messages\\nWHERE conversation_id = 'abc123'\\nLIMIT 50;\\n\`\`\`\\n\\nThis reads **one partition** and returns immediately, regardless of how many billions of messages are in the table."
  },
  {
    "label": "Why Not PostgreSQL",
    "icon": "❌",
    "content": "### PostgreSQL Breaks at Chat Scale\\n\\nAt 100 billion messages/day, PostgreSQL faces three problems:\\n\\n**1. Write throughput ceiling**\\nPostgreSQL's WAL-based replication and MVCC overhead caps single-node writes. Cassandra's LSM-tree storage converts random writes to sequential disk I/O — dramatically higher write throughput.\\n\\n**2. Partition tolerance**\\nChats cannot go down if one database node fails. Cassandra's quorum-based replication (\`QUORUM\` reads/writes) survives node failures without a primary/replica failover delay.\\n\\n**3. Horizontal sharding is manual**\\nYou'd have to build your own sharding layer for PostgreSQL. Cassandra shards automatically via consistent hashing — add a node, it absorbs load automatically.\\n\\n**The trade-off:** Cassandra gives up strong consistency (eventual consistency by default) and the ability to query across partitions. You cannot ask \\"all messages sent by user X across all conversations\\" efficiently — that requires a separate index or search system (Elasticsearch)."
  },
  {
    "label": "Real World",
    "icon": "🌍",
    "content": "### How WhatsApp and Slack Store Messages\\n\\n**WhatsApp** stores messages in a distributed system built on **Mnesia** (Erlang's distributed database) for active messages, with older messages offloaded to object storage (S3-equivalent). The append-only, conversation-scoped access pattern is the same.\\n\\n**Slack** uses **MySQL sharded by workspace ID** for small to medium workspaces, with the message history served from a separate data store for large workspaces. They wrote a detailed blog post about their migration strategy.\\n\\n**Discord** migrated from Cassandra to **ScyllaDB** (a Cassandra-compatible, C++ rewrite) to handle 4 trillion messages. The access pattern — conversation ID as partition key, message timestamp as clustering key — is identical. Their migration blog post is one of the most-read system design case studies."
  }
] }
\`\`\`

---

## Scenario 5 — Geolocation (Uber / Google Maps)

**System:** A ride-sharing platform. When a rider requests a trip, the system must **find all available drivers within 5 km** in under 100ms. Drivers update their location every 4 seconds. There are 1 million active drivers at peak.

**Key requirements:**
- Location updates: 1M writes per 4 seconds (250K/sec)
- Query: "find all drivers within radius R of point (lat, lng)"
- P99 latency must be < 100ms
- Driver locations are highly ephemeral — yesterday's position is irrelevant

\`\`\`steps
{ "title": "Why This Needs Special Handling", "steps": [
  {
    "title": "The Naive SQL Approach Fails",
    "content": "A straightforward query — \`SELECT * FROM drivers WHERE ABS(lat - ?) < 0.05 AND ABS(lng - ?) < 0.05\` — does a **full table scan**. Even with indexes on \`lat\` and \`lng\` separately, the database must intersect two index ranges and recheck bounds. At 1M rows, this is 50-100ms in the best case."
  },
  {
    "title": "Geohashing to the Rescue",
    "content": "**Geohash** encodes a latitude/longitude pair into a short alphanumeric string. The key property: nearby locations share a **common prefix**.\\n\\n\`\`\`\\nUber HQ:   (37.7745, -122.4183) → 9q8yy\\nNearby:    (37.7751, -122.4179) → 9q8yy  (same prefix!)\\nFar away:  (40.7128, -74.0060)  → dr5re  (different prefix)\\n\`\`\`\\n\\nA radius query becomes a **prefix search** — dramatically faster than bounding-box arithmetic on raw coordinates."
  },
  {
    "title": "Redis GEOADD + GEORADIUS",
    "content": "Redis implements geohash natively:\\n\\n\`\`\`bash\\n# Driver updates location:\\nGEOADD active_drivers 13.361389 38.115556 \\"driver:1042\\"\\n\\n# Find drivers within 5km of rider:\\nGEOSEARCH active_drivers\\n  FROMMEMBER rider_location\\n  BYRADIUS 5 km\\n  ASC COUNT 20\\n\`\`\`\\n\\nThis returns in microseconds. Redis stores the geohash as a sorted set score — the underlying query is a sorted set range scan, which is O(log N + M) where M is the number of results."
  },
  {
    "title": "Hybrid Architecture",
    "content": "Redis is an in-memory store — it doesn't persist historical location data. The production architecture combines:\\n\\n- **Redis** → current driver locations (writes expire in 30s, location updates overwrite)\\n- **Cassandra or S3** → historical trip GPS traces (for billing disputes, route analysis)\\n- **PostGIS (PostgreSQL extension)** → permanent geospatial data — city polygons, road networks, surge zones. Supports full GIS operations.\\n\\nThis is the classic pattern: **hot data in Redis, warm in Cassandra, cold in object storage**."
  }
] }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "PostGIS vs Redis for Geo — When to Use Each", "content": "**Use Redis GEODATA when:**\\n- Data is ephemeral (driver locations, delivery couriers)\\n- You need sub-millisecond write + read latency\\n- The dataset fits in memory\\n\\n**Use PostGIS when:**\\n- Data is persistent (city boundaries, store locations, no-fly zones)\\n- You need complex spatial operations (intersection, union, polygon contains)\\n- You need ACID guarantees (e.g., geofenced compliance zones)\\n\\n**Real world:** Uber uses a service called **H3** (their open-source hexagonal geospatial indexing system) to partition the world into hexagons at multiple resolutions. It replaces geohash with a hierarchical system that handles edge cases (geohash cells have uneven sizes near the poles)." }
\`\`\`

---

## Summary: The Decision Matrix

| Scenario | Database Family | Key Reason |
|----------|----------------|------------|
| Social graph | **Graph DB** (Neo4j) | Multi-hop traversals are pointer-chasing, not joins |
| Time-series metrics | **Time-series DB** (InfluxDB / TimescaleDB) | Chunked storage + native downsampling + TTL |
| E-commerce inventory | **Relational** (PostgreSQL) | ACID transactions, \`SELECT FOR UPDATE\`, complex queries |
| Chat messages | **Wide-column** (Cassandra) | Partition-scoped writes at extreme scale, append-only |
| Geolocation (live) | **In-memory + geo index** (Redis) | Microsecond reads, ephemeral data, native geohash |

---

\`\`\`quiz
{ "title": "Database Selection Quiz", "questions": [
  {
    "question": "A startup is building a fraud detection system. It needs to find whether two users are connected through a chain of financial transactions (e.g., A paid B, B paid C, C is flagged). Which database is best suited for this use case?",
    "options": [
      "PostgreSQL — ACID transactions are essential for financial data",
      "Cassandra — high write throughput handles transaction volume",
      "Neo4j — relationship traversal is the core access pattern",
      "Redis — low latency is critical for real-time fraud detection"
    ],
    "answer": 2,
    "explanation": "This is a graph traversal problem — finding paths between nodes through relationships. Neo4j stores relationships as first-class citizens with direct pointers, making multi-hop traversals O(depth × degree) rather than O(rows). While PostgreSQL can do this with recursive CTEs, performance degrades significantly beyond 3 hops. Cassandra and Redis do not support graph traversal natively."
  },
  {
    "question": "An IoT platform receives sensor readings from 500,000 industrial machines every 5 seconds. Engineers query dashboards showing the last 7 days at 1-minute resolution. Which trade-off is MOST important for your database choice?",
    "options": [
      "Strong ACID consistency — sensor data must never be lost",
      "Write throughput and efficient time-range queries — 100M data points per day",
      "Graph traversal — machines have complex parent/child relationships",
      "Horizontal key-value scaling — sensor ID lookups must be O(1)"
    ],
    "answer": 1,
    "explanation": "The dominant characteristics are: extremely high write rate (500K machines × 12 writes/minute = 6M writes/min), and queries are always time-bounded range scans. A time-series database like TimescaleDB or InfluxDB handles both with chunked storage and columnar compression. ACID consistency is desirable but not the primary constraint — losing 1 in 10,000 sensor readings is acceptable; being unable to ingest data is not."
  },
  {
    "question": "You are designing a flash sale system. At 12:00 PM exactly, 1 million users simultaneously try to buy a limited item with only 500 units in stock. What is the MOST critical requirement for your database choice?",
    "options": [
      "Eventual consistency — minor overselling can be corrected manually",
      "Horizontal scalability — you need to handle 1M concurrent requests",
      "Atomic, serializable transactions — exactly 500 orders must succeed",
      "Low write latency — each purchase must complete in < 10ms"
    ],
    "answer": 2,
    "explanation": "Overselling is a hard business constraint — if 600 people receive order confirmations for 500 units, you face refunds, customer complaints, and legal risk. This requires serializable transactions with row-level locking (PostgreSQL's SELECT FOR UPDATE). Horizontal scalability and low latency are important secondary concerns, but they can be addressed with connection pooling, read replicas, and Redis caching of inventory counts — the write path must remain strongly consistent."
  },
  {
    "question": "A food delivery app needs to show customers all open restaurants within 3 km of their current location. There are 50,000 restaurants in the database, each with a fixed address. This query runs 10 million times per day. What is the most appropriate storage solution?",
    "options": [
      "Redis GEODATA — microsecond latency for proximity queries",
      "Neo4j — restaurants and users are nodes, proximity is an edge",
      "PostGIS (PostgreSQL extension) — persistent location data with spatial indexing",
      "Cassandra — partition by city to scope geo queries"
    ],
    "answer": 2,
    "explanation": "Restaurant locations are persistent (not ephemeral like driver positions). PostGIS provides a spatial index (R-tree / GiST index on geometry columns) that makes a radius query extremely fast — O(log N) even for millions of restaurants. Redis GEODATA is better for ephemeral, frequently-updated locations (like drivers); restaurant addresses rarely change. Neo4j is wrong here — proximity is not a graph relationship. Cassandra partitioned by city would work but lacks native geo indexing."
  },
  {
    "question": "Which CAP theorem position does Apache Cassandra take by default, and why is this acceptable for the chat message use case?",
    "options": [
      "CP (Consistency + Partition Tolerance) — chat messages must never be lost",
      "CA (Consistency + Availability) — partition tolerance is not needed at chat scale",
      "AP (Availability + Partition Tolerance) — a brief delay before a message appears is acceptable",
      "Cassandra guarantees all three — CAP theorem does not apply to wide-column stores"
    ],
    "answer": 2,
    "explanation": "Cassandra is an AP system — it prioritizes availability and partition tolerance over strict consistency. By default, it uses eventual consistency: a write acknowledged by a quorum of replicas may not be immediately visible on all nodes. For chat, this means a message might appear to a recipient 50-200ms after the sender sees their own message confirmed — which is imperceptible to humans and far better than the alternative (the chat service going down during a network partition). Strong consistency (CP) would require coordination on every write, dramatically reducing throughput."
  }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Match your database to the access pattern first: traversal → graph, time-range → time-series, relational constraints → SQL, partition-scoped writes → wide-column, ephemeral geo → Redis",
  "ACID consistency is non-negotiable for financial operations (inventory, payments). Never accept eventual consistency here — use PostgreSQL with row-level locking",
  "Production systems almost always use multiple databases: a relational DB for authoritative state, Redis for hot read caches, a time-series DB for metrics, and a search index (Elasticsearch) for full-text. The art is knowing which store owns which data",
  "CAP theorem forces a choice: Cassandra trades consistency for availability and write throughput (AP); PostgreSQL trades availability for consistency (CP). Know what your system can and cannot tolerate losing",
  "In interviews, always justify your database choice with access patterns and trade-offs — not just 'it scales'. The reasoning is what interviewers are evaluating, not the final answer"
] }
\`\`\``,
    },
  ],
};
