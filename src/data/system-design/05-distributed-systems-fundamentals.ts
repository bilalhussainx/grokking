import { Module } from "../types";

export const distributedSystemsFundamentalsModule: Module = {
  id: "distributed-systems-fundamentals",
  title: "Distributed Systems Fundamentals",
  description: "Build a rigorous mental model of distributed systems: the CAP theorem, consistency levels, consensus algorithms, and failure modes that every architect must understand.",
  lessons: [
    {
      id: "cap-theorem",
      slug: "cap-theorem",
      title: "CAP Theorem: Consistency, Availability, Partition Tolerance",
      content: `# CAP Theorem: Consistency, Availability, Partition Tolerance

In 1999, Eric Brewer stood at PODC (Principles of Distributed Computing) and made a conjecture that would reshape how engineers think about distributed systems. Two years later, Gilbert and Lynch formally proved it. The CAP theorem is deceptively simple to state and surprisingly easy to misapply.

Here is the one-line version: **a distributed system can only guarantee two of three properties — Consistency, Availability, and Partition Tolerance — at the same time.**

But that framing conceals the real insight. By the end of this lesson, you will understand *why* partition tolerance is effectively mandatory, what the actual trade-off looks like during a network split, and how real systems like Cassandra, HBase, and Zookeeper make their choices.

---

## The Three Pillars

\`\`\`concept
{ "title": "The CAP Theorem", "variant": "mental-model", "content": "A distributed data store can satisfy at most two of: Consistency (every read returns the most recent write or an error), Availability (every request receives a response, though it may be stale), and Partition Tolerance (the system continues operating despite messages being dropped or delayed between nodes). Since network partitions are inevitable in production, the real design choice is always between C and A." }
\`\`\`

Let's make each property concrete before we pit them against each other.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Consistency",
      "icon": "🔒",
      "content": "**Every read reflects the most recent write — or returns an error.**\\n\\nIn a consistent system, all nodes see the same data at the same time. If you write \`balance = $500\` to node A, any subsequent read from node B must also return \`$500\`. If node B cannot guarantee this, it must refuse the read entirely.\\n\\n**The key word is linearizability** — reads and writes appear to happen instantaneously and in a total order across the whole system.\\n\\n**Example:** A traditional relational database like MySQL with synchronous replication. Before acknowledging a write, the primary waits for all replicas to confirm. This guarantees consistency but means writes block during replica lag or failure.\\n\\n> Note: CAP consistency ≠ ACID consistency. CAP consistency is about single-key linearizability across nodes, not multi-record transaction integrity."
    },
    {
      "label": "Availability",
      "icon": "🟢",
      "content": "**Every request receives a response — but it might not contain the latest data.**\\n\\nAn available system never returns an error for a read or write. Every node that receives a request will respond, even if some nodes are unreachable. The catch: the response might be stale.\\n\\n**Example:** DNS (Domain Name System) is the textbook AP system. When you update an A record, the change can take minutes or hours to propagate globally. But DNS servers always respond — they never say \\"I'm not sure, try again later.\\" Your laptop might resolve \`example.com\` to an old IP for a short window. The system is available; it is not strongly consistent.\\n\\n**Social media timelines** work similarly. During a datacenter outage, you might see posts from 30 seconds ago. The feed loads. Life goes on."
    },
    {
      "label": "Partition Tolerance",
      "icon": "🌐",
      "content": "**The system continues operating despite network partitions — messages dropped, delayed, or reordered between nodes.**\\n\\nA **network partition** is any scenario where nodes in your cluster cannot communicate: a bad switch, a severed undersea cable, a misconfigured firewall, a cloud provider dropping packets between availability zones.\\n\\n**Partition tolerance means:** even when node A and node B cannot talk to each other, both keep responding to clients.\\n\\n**Why this is non-negotiable:** In any real distributed system spanning more than one machine (let alone multiple data centers), the network is unreliable. The question is not *if* a partition will occur — it is *when*. Choosing to not be partition-tolerant means choosing to be a single-node system.\\n\\n> Eric Brewer's original framing: \\"Partition tolerance is not optional. Once you accept that partitions happen, you must choose between C and A when they do.\\""
    }
  ]
}
\`\`\`

---

## Why You Cannot Escape Partition Tolerance

\`\`\`callout
{ "type": "warning", "title": "CA Systems Are a Myth in Practice", "content": "You will see CA listed as a category in many charts. In theory, a CA system sacrifices partition tolerance to have both consistency and availability. In practice, this means running on a single machine with no network calls — which is not a distributed system at all. The moment you add a second node, partitions become possible. Distributed databases that claim CA (like some traditional SQL clusters) are really CP systems that fail loudly during partitions rather than serving stale data." }
\`\`\`

Let's walk through the exact moment a partition forces a choice. This is the proof in GeeksforGeeks's framing, made concrete:

\`\`\`steps
{
  "title": "What Happens When a Network Partition Occurs",
  "steps": [
    {
      "title": "Normal operation — everything works",
      "content": "You have two nodes, S1 and S2, replicating data to each other. A client writes \`account_balance = $500\` to S1. S1 replicates this to S2. A subsequent read from either S1 or S2 returns \`$500\`. ✅ Consistent. ✅ Available. ✅ No partition."
    },
    {
      "title": "A network partition occurs",
      "content": "The link between S1 and S2 goes down. They can no longer communicate. Clients can still reach both nodes individually — but the nodes have diverged. S1 has the latest writes; S2 is now stale."
    },
    {
      "title": "A write arrives at S1",
      "content": "A client writes \`account_balance = $300\` to S1 (a withdrawal). S1 accepts it. But S1 cannot propagate this to S2 — the partition is still active. S2 still thinks the balance is \`$500\`."
    },
    {
      "title": "A read arrives at S2 — the moment of truth",
      "content": "Now another client asks S2: \\"What is the account balance?\\"\\n\\nS2 has two choices:\\n\\n**Choice A — Stay Consistent (CP):** S2 says \\"I cannot guarantee this data is current. Error 503.\\" The system sacrifices availability to protect consistency. No stale reads.\\n\\n**Choice B — Stay Available (AP):** S2 returns \`$500\` even though the real balance is \`$300\`. The system sacrifices consistency to remain available. Stale reads are possible."
    },
    {
      "title": "The partition heals",
      "content": "When S1 and S2 reconnect, the system must reconcile. **CP systems** simply re-sync — S2 catches up to S1's state. **AP systems** must resolve conflicts, often using techniques like last-write-wins, vector clocks, or application-level merge logic. This reconciliation phase is where AP systems do their deferred consistency work."
    }
  ]
}
\`\`\`

This is the core of CAP. There is no clever engineering trick that avoids this choice. It is a mathematical constraint: when two nodes disagree and you have a partition, you must either refuse requests (sacrifice availability) or serve potentially wrong data (sacrifice consistency).

---

## CP vs AP: Real Systems, Real Trade-offs

\`\`\`tabs
{
  "tabs": [
    {
      "label": "CP Systems",
      "icon": "🏦",
      "content": "**Consistency + Partition Tolerance — sacrifice availability during splits.**\\n\\nCP systems refuse to serve reads or writes if they cannot guarantee the data is current. During a partition, nodes may return errors or timeouts rather than stale data.\\n\\n| System | Why CP? |\\n|--------|--------|\\n| **HBase** | Hadoop's column store; writes go through a master — stale reads are not tolerated |\\n| **Zookeeper** | Distributed coordination; a stale leader election result would be catastrophic |\\n| **MongoDB** (default) | Primary-only reads by default; secondaries can serve stale reads only if explicitly configured |\\n| **etcd** | Kubernetes config store; wrong config data would break cluster state |\\n\\n**Best for:** Financial transactions, inventory systems, leader election, distributed locks — anywhere where returning wrong data is worse than returning no data.\\n\\n**The cost:** During a partition, clients may see \`503 Service Unavailable\` or timeouts. This is intentional. The system would rather fail loudly than silently corrupt your data."
    },
    {
      "label": "AP Systems",
      "icon": "📱",
      "content": "**Availability + Partition Tolerance — sacrifice strong consistency during splits.**\\n\\nAP systems always respond, even if the data is slightly stale. They resolve conflicts after the partition heals, often using **eventual consistency** — a guarantee that, given no new writes, all nodes will *eventually* converge to the same value.\\n\\n| System | Why AP? |\\n|--------|--------|\\n| **Cassandra** | Masterless ring; every node accepts writes, convergence via gossip protocol |\\n| **DynamoDB** | Eventually consistent reads by default; strongly consistent reads are opt-in and slower |\\n| **CouchDB** | Multi-master replication; conflicts resolved at application layer |\\n| **DNS** | Always responds; propagation delay means stale records are expected |\\n\\n**Best for:** Social feeds, product catalogs, user sessions, shopping carts, IoT telemetry — anywhere where a slightly stale read is acceptable and uptime is paramount.\\n\\n**The cost:** You may read stale data during a partition window. Your application must be designed to tolerate this — idempotent writes, conflict-resolution logic, or user-facing \\"refresh to see latest\\" patterns."
    },
    {
      "label": "Case Study: Payment vs Feed",
      "icon": "⚖️",
      "content": "**Two products, two different CAP choices.**\\n\\n**Stripe (payments) → CP:**\\nStripe processes millions of transactions daily. Charging a customer twice (duplicate write during partition) or showing the wrong balance is far worse than a brief outage. Stripe's infrastructure prefers to queue or reject requests during network issues rather than risk double-charges. Engineers accept the availability trade-off because the cost of inconsistency — chargebacks, legal liability, user trust — is catastrophic.\\n\\n---\\n\\n**Twitter/X (timeline) → AP:**\\nWhen you open Twitter during an outage, you often still see tweets — they may be 10-30 seconds stale. Twitter's feed service is AP: it always returns *something*. During the 2022 infrastructure changes, timelines sometimes showed slightly inconsistent follower counts or like tallies. Users barely noticed. The alternative — taking the entire feed offline to guarantee perfect counts — would have cost far more in user engagement than the stale data ever did.\\n\\n---\\n\\nThis is the engineering trade-off in human terms: **what failure mode is cheaper for your users?**"
    }
  ]
}
\`\`\`

---

## Common Misconceptions

Engineers new to CAP often make these mistakes in system design interviews and in production:

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Misconception",
    "code": "# \\"We can achieve all three if we are clever enough\\"\\n# \\"CA is a valid production architecture\\"\\n# \\"AP means the data is always wrong\\"\\n# \\"CP means the system is always down\\"\\n# \\"CAP applies to every design decision\\""
  },
  "after": {
    "label": "Reality",
    "code": "# Partition tolerance is non-negotiable in distributed systems\\n# CA requires a single node — not distributed\\n# AP means data MAY be stale; eventual consistency converges\\n# CP means errors DURING partitions, not constant downtime\\n# CAP applies specifically to read/write operations on distributed data"
  }
}
\`\`\`

\`\`\`callout
{ "type": "info", "title": "CAP Is Not the Whole Story — Meet PACELC", "content": "CAP only describes behavior *during* partitions. In 2012, Daniel Abadi proposed the PACELC theorem to cover the steady-state case: even when there is no partition, a replicated system must trade off between **Latency** and **Consistency**. A system that synchronously replicates to 3 nodes before acknowledging a write is strongly consistent but has higher write latency. DynamoDB, for example, is classified as PA/EL — it favors availability during partitions and low latency in normal operation. PACELC is the follow-up theorem every senior engineer should know after mastering CAP." }
\`\`\`

---

## Tunable Consistency: The Practical Middle Ground

Real systems rarely exist at the extremes. Modern databases like Cassandra and DynamoDB offer **tunable consistency** — you choose the trade-off per operation.

In Cassandra, a write with \`QUORUM\` consistency requires a majority of nodes to acknowledge before succeeding. A write with \`ONE\` consistency returns as soon as a single node confirms. The CAP constraint still applies — you are just choosing where on the CP↔AP spectrum each operation lands.

\`\`\`callout
{ "type": "tip", "title": "Interview Pattern: Quorum Reads and Writes", "content": "For a cluster of N replicas, define W = nodes that must acknowledge a write, R = nodes that must respond to a read. If W + R > N, you get strong consistency (reads always see the latest write). If W + R ≤ N, you get eventual consistency with better performance. Common setting: N=3, W=2, R=2 (quorum). This is how Cassandra, DynamoDB, and Riak let you tune the CP↔AP dial at the operation level." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{
  "title": "CAP Theorem Quiz",
  "questions": [
    {
      "question": "During a network partition, a node receives a read request. It cannot verify whether its data is current. If the system is CP, what should the node do?",
      "options": [
        "Return the data it has, with a warning header",
        "Return an error or timeout rather than serve potentially stale data",
        "Ask the client to retry in 5 seconds",
        "Promote itself to primary and serve the read"
      ],
      "answer": 1,
      "explanation": "CP systems sacrifice availability to maintain consistency. During a partition, a CP node will refuse to serve reads it cannot guarantee are current — returning an error or timing out. This is intentional: wrong data is worse than no data for CP use cases like financial systems."
    },
    {
      "question": "DNS is a classic example of which CAP category?",
      "options": [
        "CA — consistent and available, since DNS servers rarely go down",
        "CP — because DNS records must be perfectly consistent across all resolvers",
        "AP — always responds but may serve stale records during propagation",
        "It does not fit CAP because it is not a database"
      ],
      "answer": 2,
      "explanation": "DNS is AP. It always responds to queries (high availability) but DNS record changes can take minutes or hours to propagate globally, meaning different resolvers may return different IPs for the same domain during that window. Availability is prioritized over consistency."
    },
    {
      "question": "Which statement about CA (Consistency + Availability without Partition Tolerance) systems is most accurate?",
      "options": [
        "They are achievable with careful enough engineering",
        "They are practical only for systems running on a single node or machine",
        "They sacrifice consistency during partitions to maintain availability",
        "They are the default mode for Cassandra and DynamoDB"
      ],
      "answer": 1,
      "explanation": "CA systems that sacrifice partition tolerance are effectively single-node systems. The moment you add a second node, network partitions become possible, making partition tolerance a necessity. In practice, \\"CA\\" distributed databases are really CP systems that fail loudly during partitions rather than serving stale data."
    },
    {
      "question": "You are designing an inventory system for an e-commerce platform. Selling the same item twice (due to a race condition during a network split) would cause severe operational problems. Which CAP category should you prioritize?",
      "options": [
        "AP — availability ensures customers can always check out",
        "CP — consistency ensures inventory counts are always accurate, even if some requests fail",
        "CA — serve both consistently and with high availability",
        "It does not matter — use caching to avoid the issue"
      ],
      "answer": 1,
      "explanation": "This is a CP use case. Overselling inventory (consistency violation) is worse than a brief checkout failure (availability sacrifice). During a partition, a CP inventory system will reject writes it cannot safely commit rather than risk double-selling. Financial, inventory, and booking systems almost always choose CP."
    },
    {
      "question": "In Cassandra configured with N=3 nodes, W=2, R=2, a client writes a value then immediately reads it. Is the read guaranteed to see the latest write?",
      "options": [
        "No — Cassandra is always eventually consistent regardless of settings",
        "Yes — because W + R > N (2 + 2 > 3), reads will overlap with at least one write node",
        "Yes — because Cassandra uses a synchronous replication protocol",
        "No — quorum reads only guarantee consistency after the partition heals"
      ],
      "answer": 1,
      "explanation": "When W + R > N, the sets of nodes that must acknowledge a write and the nodes that must respond to a read are guaranteed to overlap by at least one node. That overlapping node has the latest write, so the read will always see it. This quorum condition is how Cassandra achieves strong consistency when configured for it."
    }
  ]
}
\`\`\`

---

## Putting It All Together: The Decision Framework

When you sit down to design a distributed system — in an interview or in production — use this mental checklist:

\`\`\`steps
{
  "title": "Applying CAP in System Design",
  "steps": [
    {
      "title": "Ask: what does a consistency failure cost?",
      "content": "If stale or wrong data causes financial loss, safety issues, or data corruption (payments, inventory, healthcare), lean CP. If stale data is a minor UX inconvenience (social feeds, product catalogs, analytics dashboards), AP is likely fine."
    },
    {
      "title": "Ask: what does an availability failure cost?",
      "content": "If a brief outage causes users to abandon your service, revenues to drop, or SLAs to breach (checkout flow, real-time trading), lean AP. If users tolerate a \\"service temporarily unavailable\\" error for correctness (bank transfer, booking confirmation), CP is acceptable."
    },
    {
      "title": "Consider tunable consistency",
      "content": "You do not have to choose globally. Use CP semantics for critical writes (checkout, balance debit) and AP semantics for reads that can tolerate staleness (product descriptions, user profile views). Databases like Cassandra, DynamoDB, and MongoDB let you configure this per operation."
    },
    {
      "title": "Design for partition recovery",
      "content": "Regardless of your CP/AP choice, partitions will heal. Design your reconciliation strategy upfront: last-write-wins, vector clocks, conflict-free replicated data types (CRDTs), or application-layer merge logic. AP systems in particular need a clear answer to: 'what happens when two nodes rejoin and disagree?'"
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "CAP theorem proves that no distributed system can simultaneously guarantee Consistency, Availability, and Partition Tolerance — only two at once.",
    "Partition tolerance is non-negotiable in real distributed systems; the practical choice is always CP (sacrifice availability during partitions) or AP (sacrifice strong consistency).",
    "CP systems (HBase, Zookeeper, etcd) return errors during partitions rather than serve stale data — ideal for financial, inventory, and coordination workloads.",
    "AP systems (Cassandra, DynamoDB, DNS) always respond but may serve stale data — ideal for social feeds, catalogs, and any use case where eventual consistency is acceptable.",
    "Modern databases offer tunable consistency (quorum reads/writes) so you can choose your CP↔AP position per operation, not just globally.",
    "PACELC extends CAP by addressing the latency-vs-consistency trade-off even in the absence of partitions — the next theorem to master after CAP."
  ]
}
\`\`\``,
    },
    {
      id: "consistency-levels",
      slug: "consistency-levels",
      title: "Consistency Levels: Strong, Eventual, Causal, Read-Your-Writes",
      content: `# Consistency Levels: Strong, Eventual, Causal, and Read-Your-Writes

When you write a tweet and immediately refresh your timeline, you expect to see it. When a bank deducts money from your account, every ATM in the world should agree on your new balance. Yet these two scenarios demand *very different* guarantees from the underlying database — and that difference has a name: **consistency level**.

Consistency in distributed systems is not binary. It is a deliberate spectrum of trade-offs between correctness, latency, and availability. Choosing the wrong level is one of the most common — and most expensive — architectural mistakes.

\`\`\`concept
{ "title": "Consistency Is Not a Single Thing", "variant": "mental-model", "content": "A consistency level defines the rules about what data a reader is allowed to see, relative to what has been written. Different parts of the same system can — and often should — use different consistency levels." }
\`\`\`

---

## The Consistency Spectrum

Think of consistency levels as a dial. Turn it toward **strong** and every reader sees the same, fully up-to-date value — but you pay with higher latency and lower availability. Turn it toward **weak/eventual** and you get blazing speed and fault tolerance — but readers may briefly see stale data.

\`\`\`concept
{ "title": "The CAP Trade-off in Practice", "variant": "rule", "content": "The CAP theorem guarantees that during a network partition, a distributed system must choose between Consistency and Availability. Each consistency level is essentially a point on that dial — trading one for the other in a controlled, deliberate way." }
\`\`\`

The spectrum from strongest to weakest:

1. **Linearisability** (strongest) — true strong consistency
2. **Sequential consistency** — global order preserved
3. **Causal consistency** — cause-and-effect preserved
4. **Read-your-writes** — you see your own updates
5. **Monotonic reads** — reads never go backward
6. **Eventual consistency** (weakest) — replicas converge *eventually*

---

## The Four Levels You Must Know

\`\`\`tabs
{ "tabs": [
  {
    "label": "Strong (Linearisability)",
    "icon": "🔒",
    "content": "## Strong Consistency\\n\\nA read **always** returns the most recently written value. Every node in the cluster agrees on the same, current state before any read is served.\\n\\n### How it works\\n- Writes are **synchronously replicated** to a quorum before acknowledging success\\n- Reads always hit the primary node (or a quorum)\\n- No stale data — ever\\n\\n### Latency cost\\nBecause every write must wait for acknowledgement from multiple nodes (often across data-centers), strong consistency adds **tens to hundreds of milliseconds** of latency per write.\\n\\n### Real-world examples\\n- **Google Spanner** uses TrueTime (atomic clock + GPS) to achieve externally consistent (linearisable) transactions globally\\n- **CockroachDB** provides serialisable isolation across geo-distributed nodes\\n- **Zookeeper / etcd** — used for distributed locks, leader election — are strongly consistent by design\\n\\n### When to use\\n- Financial transactions (balance updates, payment processing)\\n- Inventory systems (prevent overselling)\\n- Distributed locks and coordination"
  },
  {
    "label": "Eventual Consistency",
    "icon": "⏳",
    "content": "## Eventual Consistency\\n\\nIf no new writes occur, all replicas will **eventually** converge to the same value. There is no guarantee of *when* — only that it will happen.\\n\\n### How it works\\n- Writes are acknowledged immediately (or after local write)\\n- Replication happens **asynchronously** in the background\\n- Readers may see different values depending on which replica they hit\\n\\n### The trade-off\\nYou get **lower latency**, **higher availability**, and **better partition tolerance** — at the cost of temporary inconsistency.\\n\\n### Real-world examples\\n- **Amazon DynamoDB** (default) — acknowledges writes locally, replicates async\\n- **Apache Cassandra** with \`CONSISTENCY ONE\` — fastest, most available\\n- **Amazon S3** (for overwrite PUTs and DELETEs) — eventually consistent across regions\\n- **DNS** — classic example: a new IP may take minutes/hours to propagate globally\\n\\n### When to use\\n- Social media feeds and activity streams\\n- Shopping cart (Amazon famously chose eventual consistency for carts)\\n- Analytics, view counters, recommendation systems\\n- Any read-heavy workload where stale data is acceptable"
  },
  {
    "label": "Causal Consistency",
    "icon": "🔗",
    "content": "## Causal Consistency\\n\\nOperations that are **causally related** must be seen in the same order by all nodes. Concurrent (causally unrelated) operations can be seen in any order.\\n\\n### The key insight\\nIf event B happened *because of* event A, then any node that sees B must have already seen A. Unrelated events can appear in any order.\\n\\n### Classic example\\n\`\`\`\\nAlice posts: \\"I'm pregnant!\\"\\nBob replies: \\"Congratulations!\\"\\n\\nCarol must see Alice's post BEFORE Bob's reply.\\nOtherwise Bob's reply makes no sense.\\n\`\`\`\\n\\n### How it is implemented\\n- **Vector clocks** or **version vectors** track causal dependencies\\n- Each write carries a causal metadata token\\n- Nodes buffer updates until their causal predecessors have arrived\\n\\n### Real-world examples\\n- **MongoDB** causal sessions (since v3.6) — same session reads respect causal order\\n- **CosmosDB** consistent prefix level — reads never see out-of-order writes\\n- **Facebook's social graph** — comment threads must preserve causal ordering\\n\\n### When to use\\n- Collaborative editing (Google Docs-style)\\n- Chat and comment threads\\n- Any system where logical ordering matters but global coordination is too expensive"
  },
  {
    "label": "Read-Your-Writes",
    "icon": "👁️",
    "content": "## Read-Your-Writes Consistency\\n\\nA user always sees the effects of **their own** most recent write — even if other users may still see the old value.\\n\\n### Why this matters\\nImagine updating your profile photo. Without read-your-writes, you might press Save, reload the page, and see your *old* photo. From your perspective, the system appears broken — even though technically the write succeeded.\\n\\n### How it is implemented\\n**Option 1: Sticky sessions**\\nRoute the same user's reads and writes to the same replica. Simple, but creates hot spots.\\n\\n**Option 2: Write timestamps**\\nRecord when the user last wrote. If a replica's data is older than that timestamp, redirect to primary or wait.\\n\\n**Option 3: Session tokens**\\nEmbed a version token in the write response. Reads supply the token; the replica serves the request only if it has caught up to that version.\\n\\n### Real-world examples\\n- **DynamoDB strongly consistent reads** on a per-user basis\\n- **Cassandra** with \`LOCAL_QUORUM\` reads after writes\\n- **Relational DBs with read replicas** — write to primary, short-term sticky read from primary\\n\\n### When to use\\n- User profile updates\\n- Any write-then-immediately-read user flow\\n- Checkout flows where users update their cart and immediately see the summary"
  }
] }
\`\`\`

---

## Strong vs. Eventual: A Direct Comparison

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Strong Consistency (Spanner / Zookeeper)", "code": "// Write: deduct $100 from account\\n// Spanner broadcasts the write to all replicas\\n// WAITS for quorum acknowledgement (~30ms across regions)\\n// Only then returns success to the client\\n\\n// Any subsequent read — from ANY replica —\\n// will see the updated balance immediately.\\n\\nClient A writes:  balance = $400  ✓ committed\\nClient B reads:   balance = $400  ✓ guaranteed" }, "after": { "label": "Eventual Consistency (Cassandra CONSISTENCY ONE)", "code": "// Write: post a tweet\\n// Cassandra writes to 1 replica, returns success immediately (~1ms)\\n// Replication to other nodes happens async (milliseconds to seconds)\\n\\n// A read from a different replica may return stale data\\n// for a brief window. This is EXPECTED and ACCEPTABLE.\\n\\nClient A writes:  tweet = \\"Hello!\\"  ✓ ack'd\\nClient B reads:   [empty]           ← briefly stale, not a bug" } }
\`\`\`

---

## How Cassandra Lets You Choose

Cassandra is the canonical example of a database that exposes the consistency dial directly to the application developer. You choose per-query.

\`\`\`steps
{ "title": "Cassandra Consistency Levels in Practice", "steps": [
  { "title": "Write with QUORUM", "content": "\`\`\`sql\\nINSERT INTO payments (id, amount) VALUES (uuid(), 500)\\nUSING CONSISTENCY QUORUM;\\n\`\`\`\\nThe write must be acknowledged by a **majority of replicas** (e.g., 2 of 3). Slower, but durable. If a node is down, the write still succeeds as long as quorum is met." },
  { "title": "Read with QUORUM", "content": "\`\`\`sql\\nSELECT amount FROM payments WHERE id = ?\\nUSING CONSISTENCY QUORUM;\\n\`\`\`\\nReads from a majority of replicas and returns the **most recent** value. When both read and write use QUORUM, you get **strong consistency** — the read and write sets are guaranteed to overlap." },
  { "title": "The Magic Rule: R + W > N", "content": "Cassandra's golden formula:\\n\\n- **N** = replication factor (e.g., 3)\\n- **W** = nodes that must acknowledge a write\\n- **R** = nodes that must respond to a read\\n\\nIf **R + W > N**, your read will *always* overlap with your write set — giving you strong consistency.\\n\\n| W | R | R+W | Consistent? |\\n|---|---|-----|-------------|\\n| 1 | 1 | 2   | ❌ No (2 < 3) |\\n| 2 | 2 | 4   | ✅ Yes (4 > 3) |\\n| 3 | 1 | 4   | ✅ Yes (4 > 3) |" },
  { "title": "ONE for speed, QUORUM for safety", "content": "\`\`\`sql\\n-- High-volume analytics counter (stale is fine)\\nUPDATE page_views SET count = count + 1 USING CONSISTENCY ONE;\\n\\n-- Financial ledger entry (must be accurate)\\nINSERT INTO ledger (txn_id, amount) VALUES (?, ?) USING CONSISTENCY QUORUM;\\n\`\`\`\\nThe same Cassandra cluster can serve both workloads simultaneously — each with the appropriate consistency guarantee." }
] }
\`\`\`

---

## DynamoDB: Choosing Per-Read

AWS DynamoDB makes the trade-off explicit at the API level.

\`\`\`callout
{ "type": "info", "title": "DynamoDB Consistency Options", "content": "**Eventually consistent reads** (default): half the cost, uses any available replica. Response time ~1ms.\\n\\n**Strongly consistent reads**: reads only from the leader replica. Guaranteed to reflect all writes that received a successful response. Costs 2x read capacity units. Response time ~5-10ms.\\n\\nFor most workloads, eventual consistency is the right default. Use strongly consistent reads only where correctness is non-negotiable." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: How Google Spanner Achieves Global Strong Consistency", "content": "## TrueTime: Clocks as a First-Class Primitive\\n\\nSpanner achieves **external consistency** (a form of linearisability) across globally distributed data centers using a novel approach: **TrueTime**.\\n\\n### The problem with distributed clocks\\nNetwork Time Protocol (NTP) has clock skew of ~1-10ms. If two writes happen within that window on different servers, the system cannot determine which came first with certainty.\\n\\n### TrueTime's solution\\nEvery Google data center has atomic clocks and GPS receivers. TrueTime exposes a special API:\\n\\n\`\`\`\\nTT.now() → [earliest, latest]  // A time interval, not a point\\nTT.before(t) → bool\\nTT.after(t)  → bool\\n\`\`\`\\n\\nRather than claiming to know the exact time, TrueTime admits uncertainty — and **waits out that uncertainty window** before committing a transaction.\\n\\n### Commit wait\\nBefore a transaction commits, Spanner waits until it is **certain** that the commit timestamp is in the past (i.e., TT.after(s) is true). This ensures that no future transaction could be assigned an earlier timestamp — giving you a globally consistent ordering of all transactions.\\n\\n### The cost\\nCommit wait adds ~7ms of latency per transaction — the price of global strong consistency. For most financial and coordination workloads, this is an entirely acceptable trade." }
\`\`\`

---

## Choosing the Right Level: A Decision Framework

\`\`\`concept
{ "title": "Ask Three Questions", "variant": "analogy", "content": "Think of consistency levels like shipping options at a courier:\\n\\n1. **What happens if the user sees stale data?** (Financial loss → strong. Minor annoyance → eventual.)\\n2. **How often do conflicting writes occur?** (Rare but catastrophic → strong. Common and resolvable → causal/eventual.)\\n3. **What is your latency budget?** (Sub-millisecond → eventual. Sub-100ms → strong is fine.)" }
\`\`\`

| System | Recommended Level | Reason |
|---|---|---|
| Bank balance display | **Strong** | Stale balance causes real financial harm |
| Social media feed | **Eventual** | Brief staleness is invisible to users |
| Comment threads | **Causal** | Replies must follow posts |
| Profile photo update | **Read-your-writes** | User must see their own change |
| Shopping cart | **Eventual** | Amazon's famous choice — availability over consistency |
| Distributed lock | **Strong (linearisable)** | Two processes must never both hold the lock |
| Analytics dashboard | **Eventual** | 5-minute-old data is perfectly acceptable |

---

\`\`\`quiz
{ "title": "Test Your Understanding", "questions": [
  {
    "question": "You are designing a payment processing system. A user transfers $200 between accounts. Which consistency level is most appropriate for reading the account balance immediately after the transfer?",
    "options": [
      "Eventual consistency — replicas will catch up quickly enough",
      "Causal consistency — the transfer and balance read are causally related",
      "Strong consistency — the balance must reflect the transfer immediately across all nodes",
      "Read-your-writes — only the sending user needs to see the updated balance"
    ],
    "answer": 2,
    "explanation": "Financial transactions require strong consistency. If another system (e.g., a second payment request, an ATM) reads the balance from a stale replica before the transfer has replicated, it could approve a transaction that overdraws the account. Strong consistency guarantees the balance is accurate regardless of which replica serves the read."
  },
  {
    "question": "A Cassandra cluster has a replication factor N=3. A write uses CONSISTENCY QUORUM (W=2). What is the minimum R value needed for strongly consistent reads?",
    "options": [
      "R = 1 (reads from one replica)",
      "R = 2 (reads from quorum)",
      "R = 3 (reads from all replicas)",
      "Consistency level does not affect read behavior in Cassandra"
    ],
    "answer": 1,
    "explanation": "Using the formula R + W > N: we need R + 2 > 3, so R > 1, meaning R must be at least 2 (QUORUM). With R=2 and W=2, R+W=4 > 3, guaranteeing the read set always overlaps the write set and returns the most recent value."
  },
  {
    "question": "Alice posts 'I got the job!' on a social platform. Bob immediately comments 'Congratulations!' A third user, Carol, opens the app. She sees Bob's comment but NOT Alice's original post. Which consistency guarantee has been violated?",
    "options": [
      "Strong consistency",
      "Eventual consistency",
      "Causal consistency",
      "Read-your-writes consistency"
    ],
    "answer": 2,
    "explanation": "Causal consistency requires that if Bob's comment was caused by Alice's post, any observer who sees Bob's comment must also have seen Alice's post. Carol seeing the reply without the original post is a causal consistency violation. Strong consistency would also prevent this, but causal consistency is the specific model that captures this cause-and-effect ordering requirement."
  },
  {
    "question": "Which of the following is the BEST description of read-your-writes consistency?",
    "options": [
      "All users see the same value for all reads at any given moment",
      "A user always sees the effects of their own previous writes, even if others may see stale data",
      "Reads never return a value older than the previous read by the same user",
      "Writes are only acknowledged after all replicas have confirmed receipt"
    ],
    "answer": 1,
    "explanation": "Read-your-writes (also called read-my-writes) specifically guarantees that the client who performed a write will subsequently see that write reflected in their reads — even if other clients may still see the old value due to replication lag. This is weaker than strong consistency but stronger than pure eventual consistency."
  },
  {
    "question": "Google Spanner achieves global strong consistency primarily through which mechanism?",
    "options": [
      "Synchronous two-phase commit with Paxos consensus",
      "TrueTime — atomic clock + GPS time intervals with commit wait",
      "Vector clocks that track causal dependencies across data centers",
      "Read repair — reconciling replicas on every read operation"
    ],
    "answer": 1,
    "explanation": "Spanner's TrueTime API exposes time as an interval [earliest, latest] using atomic clocks and GPS receivers in every data center. Before committing a transaction, Spanner performs 'commit wait' — it waits until TT.after(commit_timestamp) is true, ensuring no future transaction can have an earlier timestamp. This gives Spanner external consistency (linearisability) across globally distributed nodes, at the cost of ~7ms commit latency."
  }
] }
\`\`\`

---

\`\`\`callout
{ "type": "warning", "title": "The Hidden Cost of 'Strong Everywhere'", "content": "It is tempting to default to strong consistency 'just to be safe.' But strong consistency across geo-distributed replicas can add **50–150ms** of latency per write — and during a network partition, your system becomes **unavailable** rather than serving potentially stale data. Many production incidents have been caused by over-aggressive consistency requirements, not by too much eventual consistency." }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Consistency is a spectrum — not a binary choice. Model each subsystem's guarantee independently.",
  "Strong consistency (linearisability) guarantees every read reflects the latest write, but costs latency and sacrifices availability during partitions.",
  "Eventual consistency maximises availability and performance; replicas converge asynchronously. Best for feeds, caches, counters, and analytics.",
  "Causal consistency preserves cause-and-effect ordering without the full cost of strong consistency — ideal for comments, chats, and collaborative tools.",
  "Read-your-writes ensures users always see their own updates, even when the global view is eventually consistent.",
  "In Cassandra, R + W > N gives strong consistency using tunable quorum reads/writes.",
  "Google Spanner uses TrueTime (atomic clock + GPS) and commit wait to deliver global linearisability at ~7ms additional latency.",
  "Match the consistency level to the cost of seeing stale data — financial systems demand strong; social feeds thrive on eventual."
] }
\`\`\``,
    },
    {
      id: "consistent-hashing",
      slug: "consistent-hashing",
      title: "Consistent Hashing",
      content: `# Consistent Hashing

Distributed systems live and die by one question: **which node owns this key?** Get the answer right and you get even load distribution, fast lookups, and graceful scaling. Get it wrong and every time a node joins or leaves, you trigger a thundering herd of key migrations that can take your cluster offline.

This lesson shows you exactly why naïve modular hashing breaks at scale, how the consistent hashing ring fixes it, and why virtual nodes make it production-ready — the same technique powering Cassandra, Redis Cluster, and Amazon DynamoDB.

---

## The Problem: Naïve Modular Hashing

Imagine you're distributing cache keys across 3 nodes. The obvious approach:

\`\`\`
node = hash(key) % N    # N = number of nodes
\`\`\`

Works great — until you add a 4th node.

\`\`\`concept
{ "title": "The Rehashing Catastrophe", "variant": "rule", "content": "With modular hashing across N nodes, adding or removing even one node changes the modulus, invalidating ~(N-1)/N of all existing key-to-node mappings. For a cluster of 10 nodes, removing one forces ~90% of keys to migrate." }
\`\`\`

Let's see this concretely:

\`\`\`trace
{ "title": "Naïve Hashing Breaks on Node Change", "language": "python", "code": "keys = ['user:1', 'user:2', 'user:3', 'user:4', 'user:5']\\n\\ndef assign(keys, n):\\n    return {k: hash(k) % n for k in keys}\\n\\nbefore = assign(keys, 3)\\nafter  = assign(keys, 4)\\n\\nmigrations = sum(1 for k in keys if before[k] != after[k])\\nprint(f'Keys that moved: {migrations} / {len(keys)}')", "frames": [ { "line": 1, "vars": {"keys": "[user:1..user:5]"}, "note": "Define our key set", "stdout": "" }, { "line": 4, "vars": {"n": 3}, "note": "Assign with 3 nodes", "stdout": "" }, { "line": 5, "vars": {"before": "{user:1→2, user:2→1, user:3→0, user:4→2, user:5→0}"}, "note": "All 5 keys placed", "stdout": "" }, { "line": 7, "vars": {"n": 4}, "note": "Add one node — recompute", "stdout": "" }, { "line": 8, "vars": {"after": "{user:1→2, user:2→2, user:3→3, user:4→0, user:5→2}"}, "note": "4 out of 5 keys changed nodes!", "stdout": "" }, { "line": 10, "vars": {"migrations": 4}, "note": "80% of cache invalidated by adding ONE node", "stdout": "Keys that moved: 4 / 5" } ], "speed": 900 }
\`\`\`

That 80% cache invalidation hits your database like a wall of water. Consistent hashing was invented specifically to avoid this.

---

## The Hash Ring

Instead of mapping keys to a node *index*, consistent hashing maps both keys **and nodes** onto a single circular hash space — typically 0 to 2³² − 1.

\`\`\`concept
{ "title": "The Hash Ring Mental Model", "variant": "mental-model", "content": "Picture a clock face where every position represents a hash value (0 at 12 o'clock, max at 11:59). Both nodes and keys get hashed onto this circle. A key is owned by the first node you hit when you walk clockwise from the key's position. Adding a node only affects keys between the new node and its predecessor — all other keys stay put." }
\`\`\`

\`\`\`sysdiag
{ "title": "Consistent Hashing Ring — 3 Nodes", "width": 560, "height": 360, "nodes": [ { "id": "ring", "label": "Hash Ring\\n(0 → 2³²)", "x": 280, "y": 180, "kind": "store" }, { "id": "A", "label": "Node A\\nhash=90°", "x": 420, "y": 80, "kind": "service" }, { "id": "B", "label": "Node B\\nhash=210°", "x": 100, "y": 280, "kind": "service" }, { "id": "C", "label": "Node C\\nhash=330°", "x": 460, "y": 290, "kind": "service" }, { "id": "k1", "label": "key:user1\\nhash=120°", "x": 280, "y": 50, "kind": "client" }, { "id": "k2", "label": "key:order7\\nhash=260°", "x": 130, "y": 130, "kind": "client" } ], "edges": [ { "from": "k1", "to": "B", "label": "→ clockwise → Node B" }, { "from": "k2", "to": "C", "label": "→ clockwise → Node C" }, { "from": "A", "to": "ring", "label": "placed at" }, { "from": "B", "to": "ring", "label": "placed at" }, { "from": "C", "to": "ring", "label": "placed at" } ], "annotations": { "ring": "Circular address space shared by all nodes and keys. Both are hashed into [0, 2^32).", "A": "Node A owns keys from hash(B)+1 to hash(A) — its arc on the ring", "k1": "Hashed to 120°. Walking clockwise, the first node encountered is B at 210°." } }
\`\`\`

\`\`\`steps
{ "title": "How Consistent Hashing Works", "steps": [ { "title": "Hash the ring space", "content": "Define a circular key space from 0 to 2³²−1 (or 0 to 2¹²⁸−1 for MD5/SHA). This ring is the same for all nodes and clients — everyone uses the same hash function." }, { "title": "Place nodes on the ring", "content": "Each server is hashed using a unique identifier — typically \`hash(ip:port)\`. The resulting value is its position on the ring. With 3 nodes, you get 3 positions dividing the ring into 3 arcs." }, { "title": "Assign keys to nodes", "content": "To find which node owns a key, hash the key to its ring position, then walk **clockwise** until you hit a node. That node is responsible for storing or serving this key.\\n\\n\`\`\`python\\ndef get_node(key, ring):\\n    pos = hash(key) % RING_SIZE\\n    # Find first node at or after pos (clockwise)\\n    for node_pos in sorted(ring.keys()):\\n        if node_pos >= pos:\\n            return ring[node_pos]\\n    return ring[min(ring.keys())]  # wrap around\\n\`\`\`" }, { "title": "Add a node", "content": "When Node D joins at position 150°, it only takes ownership of keys that were previously between 90° (Node A) and 150°. Every other key stays on its current node — **only the affected arc migrates**." }, { "title": "Remove a node", "content": "When Node B at 210° leaves, its keys transfer to the next clockwise node (Node C at 330°). Again, only one arc is affected. The rest of the cluster continues serving traffic uninterrupted." } ] }
\`\`\`

---

## Implementing the Ring

\`\`\`playground
{ "title": "Consistent Hashing — Python Implementation", "language": "python", "code": "import hashlib\\nimport bisect\\n\\nclass ConsistentHashRing:\\n    def __init__(self):\\n        self._ring = {}       # position -> node_name\\n        self._sorted_keys = [] # sorted positions for binary search\\n\\n    def add_node(self, node):\\n        pos = self._hash(node)\\n        self._ring[pos] = node\\n        bisect.insort(self._sorted_keys, pos)\\n        print(f'Added {node} at position {pos}')\\n\\n    def remove_node(self, node):\\n        pos = self._hash(node)\\n        del self._ring[pos]\\n        self._sorted_keys.remove(pos)\\n        print(f'Removed {node}')\\n\\n    def get_node(self, key):\\n        if not self._ring:\\n            return None\\n        pos = self._hash(key)\\n        # Binary search: find first node >= pos\\n        idx = bisect.bisect_left(self._sorted_keys, pos)\\n        if idx == len(self._sorted_keys):\\n            idx = 0  # wrap around the ring\\n        return self._ring[self._sorted_keys[idx]]\\n\\n    def _hash(self, value):\\n        return int(hashlib.md5(value.encode()).hexdigest(), 16) % (2**32)\\n\\n\\n# --- Demo ---\\nring = ConsistentHashRing()\\nring.add_node('node-A')\\nring.add_node('node-B')\\nring.add_node('node-C')\\n\\nkeys = ['user:1001', 'order:5522', 'session:abc', 'product:xyz', 'cart:99']\\nprint('\\\\n--- Initial Assignments ---')\\nbefore = {k: ring.get_node(k) for k in keys}\\nfor k, n in before.items():\\n    print(f'  {k} -> {n}')\\n\\nprint('\\\\n--- After adding node-D ---')\\nring.add_node('node-D')\\nafter = {k: ring.get_node(k) for k in keys}\\nmoved = sum(1 for k in keys if before[k] != after[k])\\nfor k, n in after.items():\\n    marker = ' <-- MOVED' if before[k] != after[k] else ''\\n    print(f'  {k} -> {n}{marker}')\\nprint(f'\\\\nOnly {moved}/{len(keys)} keys migrated!')\\n", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "success", "title": "O(log N) Lookups with Binary Search", "content": "By keeping ring positions in a sorted list, \`bisect_left\` gives us O(log N) node lookup — efficient even for rings with thousands of virtual nodes. In production Cassandra clusters with 256 vnodes per physical node, this matters." }
\`\`\`

---

## The Problem with Basic Consistent Hashing

The basic ring has a flaw: with only one position per node, the arcs are uneven. Some nodes get huge slices, others tiny ones. When a node fails, all its load piles onto one neighbor instead of spreading across the cluster.

\`\`\`concept
{ "title": "Load Imbalance on the Bare Ring", "variant": "insight", "content": "If 3 nodes land near each other through hash collisions, one node could own 80% of the ring space. This is not theoretical — with fewer than ~100 nodes the variance is high enough to cause serious hotspots in production." }
\`\`\`

**Virtual nodes (vnodes)** solve this by giving each physical node multiple positions on the ring.

---

## Virtual Nodes (Vnodes)

Instead of placing each physical server once, place it **V times** using different hash inputs:

\`\`\`
position_k = hash(node_name + "#" + k)   for k in range(V)
\`\`\`

With V = 150 virtual nodes per physical server, each server is responsible for 150 small arcs scattered across the ring — statistically guaranteeing near-uniform load distribution.

\`\`\`algoviz
{ "title": "Virtual Nodes: 3 Physical Nodes × 4 Vnodes = 12 Ring Positions", "type": "array", "data": ["A1","B1","C1","A2","B2","C2","A3","B3","C3","A4","B4","C4"], "frames": [ { "highlight": [0,3,6,9], "label": "Node A owns 4 evenly-spaced positions (A1, A2, A3, A4)", "stats": {"physical_node":"A", "vnodes":4, "load_share":"~33%"} }, { "highlight": [1,4,7,10], "label": "Node B owns 4 interleaved positions (B1, B2, B3, B4)", "stats": {"physical_node":"B", "vnodes":4, "load_share":"~33%"} }, { "highlight": [2,5,8,11], "label": "Node C owns 4 interleaved positions (C1, C2, C3, C4)", "stats": {"physical_node":"C", "vnodes":4, "load_share":"~33%"} }, { "highlight": [3,4,5], "label": "When Node A fails: its arcs spread to B AND C (not just one neighbor)", "stats": {"migrated_to":"B + C", "migration_fraction":"~33%"} } ], "speed": 1000 }
\`\`\`

\`\`\`tabs
{ "tabs": [ { "label": "Vnode Implementation", "icon": "🔧", "content": "\`\`\`python\\nclass VNodeRing:\\n    def __init__(self, virtual_nodes=150):\\n        self.V = virtual_nodes\\n        self._ring = {}\\n        self._sorted_keys = []\\n\\n    def add_node(self, node):\\n        for i in range(self.V):\\n            vkey = f'{node}#{i}'\\n            pos = int(hashlib.md5(vkey.encode()).hexdigest(), 16) % (2**32)\\n            self._ring[pos] = node\\n            bisect.insort(self._sorted_keys, pos)\\n\\n    def get_node(self, key):\\n        pos = int(hashlib.md5(key.encode()).hexdigest(), 16) % (2**32)\\n        idx = bisect.bisect_left(self._sorted_keys, pos)\\n        if idx == len(self._sorted_keys):\\n            idx = 0\\n        return self._ring[self._sorted_keys[idx]]\\n\`\`\`" }, { "label": "Load Distribution Check", "icon": "📊", "content": "\`\`\`python\\nfrom collections import Counter\\n\\nring = VNodeRing(virtual_nodes=150)\\nring.add_node('node-A')\\nring.add_node('node-B')\\nring.add_node('node-C')\\n\\n# Distribute 10,000 random keys\\nimport random, string\\nkeys = [''.join(random.choices(string.ascii_lowercase, k=8)) for _ in range(10000)]\\ncounts = Counter(ring.get_node(k) for k in keys)\\n\\nfor node, count in sorted(counts.items()):\\n    bar = '█' * (count // 100)\\n    print(f'{node}: {count:5d} keys  {bar}')\\n\\n# Expected output (approximately):\\n# node-A:  3312 keys  █████████████████████████████████\\n# node-B:  3341 keys  █████████████████████████████████\\n# node-C:  3347 keys  █████████████████████████████████\\n\`\`\`" }, { "label": "Cassandra's Approach", "icon": "🗄️", "content": "Cassandra uses **Murmur3Partitioner** with the consistent hashing ring. Each node is assigned a configurable number of virtual nodes (\`num_tokens\` — default 16 in older versions, 256 in Cassandra 4.x).\\n\\nThe token ring is visible via:\\n\`\`\`bash\\nnodetool ring       # shows full token ring\\nnodetool status     # shows per-node token count\\n\`\`\`\\n\\nWhen you add a new node, Cassandra's \`StreamingService\` moves only the affected token ranges — no full cluster rebalance." }, { "label": "Redis Cluster", "icon": "⚡", "content": "Redis Cluster uses a **fixed-slot** variant of consistent hashing with exactly **16,384 hash slots**.\\n\\n- Every key maps to a slot: \`slot = CRC16(key) % 16384\`\\n- Slots (not keys) are assigned to nodes\\n- Adding a node means reassigning some slots to it — partial, online rehashing\\n- Clients cache the slot→node mapping; a \`MOVED\` redirect tells them when it's stale\\n\\nThis gives consistent hashing's stability guarantees while making cluster topology easier to reason about (16,384 slots vs an unbounded ring)." } ] }
\`\`\`

---

## Naïve vs Consistent: Side by Side

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Naïve Modular Hashing", "code": "def get_node(key, nodes):\\n    # Simple mod — breaks on any topology change\\n    index = hash(key) % len(nodes)\\n    return nodes[index]\\n\\n# Adding node-D invalidates ~75% of mappings\\n# Removing node-B invalidates ~67% of mappings\\n# Every scale event → thundering herd on your DB" }, "after": { "label": "Consistent Hashing + Vnodes", "code": "def get_node(key, ring):\\n    # Walk clockwise on the hash ring\\n    pos = md5_hash(key)\\n    idx = bisect_left(ring.sorted_positions, pos)\\n    if idx == len(ring.sorted_positions):\\n        idx = 0\\n    return ring[ring.sorted_positions[idx]]\\n\\n# Adding node-D: only 1/N keys migrate (~25% for 4 nodes)\\n# Removing node-B: only node-B's keys move\\n# Vnodes spread load — no single hotspot neighbor" } }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "How Much Data Moves?", "content": "With N nodes, adding one new node migrates approximately **1/(N+1)** of all keys — not 1/N of the *entire* dataset. For a 10-node cluster: adding a node moves only ~9% of keys. Removing a node moves only that node's portion (~10%). Contrast this with mod hashing where nearly every key moves." }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Implement get_node for a Consistent Hash Ring", "prompt": "Complete the \`get_node\` function. It should hash the key, binary-search for the first node position >= that hash, and wrap around if needed.", "language": "python", "template": "import bisect\\nimport hashlib\\n\\ndef get_node(key, sorted_positions, ring):\\n    pos = int(hashlib.md5(___.encode()).hexdigest(), 16) % (2**32)\\n    idx = bisect.___(sorted_positions, pos)\\n    if idx == ___:\\n        idx = 0\\n    return ring[sorted_positions[idx]]", "blanks": [ { "answer": "key", "hint": "We're hashing the lookup key, not anything else" }, { "answer": "bisect_left", "hint": "We want the first position >= pos (leftmost insertion point)" }, { "answer": "len(sorted_positions)", "hint": "When the hash is larger than all node positions, we wrap around to index 0" } ] }
\`\`\`

---

## Real-World Failure Modes

\`\`\`collapse
{ "title": "Deep Dive: Hotspots, Skew, and What Cassandra Does About It", "content": "**Skew from bad hash functions**\\n\\nNot all hash functions distribute well. CRC32 has known clustering patterns for sequential keys. Cassandra switched from RandomPartitioner (MD5) to **Murmur3Partitioner** because Murmur3 gives better avalanche effect — nearby inputs produce wildly different outputs — leading to more uniform ring coverage.\\n\\n**The 'hot partition' problem**\\n\\nEven with perfect distribution, a single *high-traffic key* (e.g., a viral tweet's ID) still routes all reads/writes to one node. Consistent hashing distributes *key space*, not *traffic*. Solutions:\\n- Read replicas (Cassandra replication factor ≥ 3)\\n- Application-level sharding (append a random suffix, fan-out reads)\\n- Redis Cluster's hash tags: \`{user:1001}.timeline\` — the \`{}\` content determines the slot, letting you co-locate related keys\\n\\n**Node weight heterogeneity**\\n\\nIf you add a beefy 32-core node alongside 8-core nodes, you want it to carry proportionally more load. Vnodes handle this by assigning more virtual nodes to more powerful machines — Cassandra lets you set \`num_tokens\` per node independently in \`cassandra.yaml\`.\\n\\n**Replication**\\n\\nIn Cassandra with replication factor RF=3, a key is written to the *first 3 distinct physical nodes* clockwise from its position. Consistent hashing makes this deterministic and topology-aware — you can place replicas in different racks or datacenters by mapping those constraints onto the ring order (NetworkTopologyStrategy)." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Consistent Hashing Quiz", "questions": [ { "question": "A cluster has 8 nodes using consistent hashing. A new node is added. Approximately what fraction of keys need to migrate?", "options": ["~50% — half the keys always move", "~1/9 (about 11%) — only the new node's arc", "~7/8 (about 87%) — all but one node must rebalance", "0% — consistent hashing never moves keys"], "answer": 1, "explanation": "With N nodes, adding one new node migrates approximately 1/(N+1) keys — only the keys that fall within the new node's arc on the ring. For 8 nodes adding a 9th, that's ~11%." }, { "question": "What problem do virtual nodes (vnodes) primarily solve?", "options": ["They reduce hash computation cost", "They prevent load imbalance caused by uneven arc sizes on the ring", "They eliminate the need for replication", "They allow the ring to support more than 2³² keys"], "answer": 1, "explanation": "Without vnodes, random hash placement of physical nodes creates uneven arc sizes — some nodes own large slices, others tiny ones. Vnodes give each physical node many small arcs scattered around the ring, ensuring near-uniform load distribution statistically." }, { "question": "Redis Cluster uses 16,384 fixed hash slots instead of a continuous ring. What is a key advantage of this design?", "options": ["It allows O(1) lookups without any hashing", "It means keys never need to be migrated when nodes are added", "Topology is expressed as a finite set of slot assignments, making it easier to communicate and cache cluster state", "It eliminates hotspot keys entirely"], "answer": 2, "explanation": "With 16,384 discrete slots, the full cluster topology fits in a compact bitmap. Clients can cache the slot→node map and only invalidate on MOVED/ASK redirects. An unbounded ring requires more complex gossip to synchronize, while slot assignments are easy to broadcast as a fixed-size structure." }, { "question": "In Cassandra, the lookup sequence for a write with replication factor RF=3 is:", "options": ["Hash the key, write to 3 random nodes across the cluster", "Hash the key to a ring position, write to the first 3 distinct physical nodes clockwise", "Hash the key modulo 3 to pick a primary, then replicate to the next 2 in a sorted list", "Write to the coordinator node only; it handles replication asynchronously via a queue"], "answer": 1, "explanation": "Cassandra's consistent hashing ring determines a key's home position. With RF=3, the write goes to the first RF distinct physical nodes encountered clockwise from that position. NetworkTopologyStrategy extends this to prefer replicas in different racks/DCs." } ] }
\`\`\`

---

## Summary

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Naïve mod hashing (hash(key) % N) invalidates ~(N-1)/N of all mappings when any node is added or removed — catastrophic at scale.", "Consistent hashing maps both nodes and keys onto a shared circular ring. A key is owned by the first node clockwise from its position — only ~1/(N+1) keys migrate when the cluster changes.", "Virtual nodes (vnodes) assign each physical server V positions on the ring, turning one large arc into V small distributed arcs that produce near-uniform load and spread failure impact across the whole cluster.", "Cassandra uses Murmur3Partitioner with 256 vnodes per node by default; replication reads the next RF distinct physical nodes clockwise. Redis Cluster uses 16,384 fixed slots as a discrete approximation of the same principle.", "Consistent hashing solves key *distribution*, not key *hotspots* — a single viral key still hammers one node. Mitigate with read replicas, random suffix sharding, or Redis hash tags for co-location." ] }
\`\`\``,
      starterCode: `import hashlib
import bisect
from collections import defaultdict


class ConsistentHashRing:
    """
    A consistent hash ring with virtual nodes.
    
    Virtual nodes (vnodes) are multiple points on the ring per physical node.
    This improves load distribution and minimises remapping when nodes change.
    """

    def __init__(self, virtual_nodes: int = 150):
        self.virtual_nodes = virtual_nodes
        self.ring = {}          # hash_position -> node_name
        self.sorted_keys = []   # sorted list of hash positions

    def _hash(self, key: str) -> int:
        """Return an integer hash of the given key using MD5."""
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node: str) -> None:
        """
        Add a node to the ring by placing \`self.virtual_nodes\` virtual
        points for it.

        Each virtual node is identified by the string f"{node}#vnode{i}"
        for i in range(self.virtual_nodes).

        TODO 1: For each vnode index i, compute its hash key string,
                hash it with self._hash(), store the mapping in self.ring,
                and insert the position into self.sorted_keys in sorted order.
                Hint: use bisect.insort() to keep sorted_keys sorted.
        """
        # YOUR CODE HERE
        pass

    def remove_node(self, node: str) -> None:
        """
        Remove a node and all its virtual points from the ring.

        TODO 2: For each vnode index i, compute the same hash key string
                used in add_node, look up its position, delete it from
                self.ring, and remove it from self.sorted_keys.
                Hint: use self.sorted_keys.remove() or bisect to find it.
        """
        # YOUR CODE HERE
        pass

    def get_node(self, key: str) -> str:
        """
        Return the node responsible for the given key.

        Walk clockwise on the ring from the key's hash position until
        the first virtual node is found. Wrap around if needed.

        TODO 3: Hash the key, then use bisect.bisect() to find the
                insertion point in self.sorted_keys. If the point equals
                len(self.sorted_keys), wrap to index 0. Return the node
                name from self.ring for that position.
        """
        if not self.ring:
            raise ValueError("Ring is empty — add at least one node first.")
        # YOUR CODE HERE
        pass

    def distribution(self, keys: list[str]) -> dict[str, int]:
        """Return a count of how many keys map to each node."""
        counts: dict[str, int] = defaultdict(int)
        for key in keys:
            counts[self.get_node(key)] += 1
        return dict(counts)


# ----- Quick self-test (run this file to check your implementation) -----
if __name__ == "__main__":
    ring = ConsistentHashRing(virtual_nodes=150)

    # Add three nodes
    for node in ["cassandra-1", "cassandra-2", "cassandra-3"]:
        ring.add_node(node)

    # Check a key maps to a node
    key = "user:alice"
    owner = ring.get_node(key)
    print(f"{key!r} -> {owner}")

    # Show distribution across 10 000 keys
    import random, string
    sample_keys = ["".join(random.choices(string.ascii_lowercase, k=8)) for _ in range(10_000)]
    dist = ring.distribution(sample_keys)
    print("Distribution:", {k: f"{v/100:.1f}%" for k, v in sorted(dist.items())})

    # Key stays on the SAME node after an unrelated node is removed
    ring.remove_node("cassandra-3")
    new_owner = ring.get_node(key)
    print(f"{key!r} after removing cassandra-3 -> {new_owner}")
    print("Remapping minimised:", owner == new_owner or new_owner in ["cassandra-1", "cassandra-2"])
`,
      solutionCode: `import hashlib
import bisect
from collections import defaultdict


class ConsistentHashRing:
    """
    A consistent hash ring with virtual nodes.

    The ring is a sorted list of integer positions (0 to 2^128-1 for MD5).
    Each physical node occupies \`virtual_nodes\` positions, spread evenly
    by hashing "node#vnodeI" for i in range(virtual_nodes).

    Key lookup: hash the key -> walk clockwise to the next position -> owner.
    Because each node covers many small arcs, adding/removing a node only
    redistributes ~1/N of the keys instead of rehashing everything.
    """

    def __init__(self, virtual_nodes: int = 150):
        self.virtual_nodes = virtual_nodes
        self.ring: dict[int, str] = {}
        self.sorted_keys: list[int] = []

    def _hash(self, key: str) -> int:
        """MD5-based integer hash — same as starter code."""
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node: str) -> None:
        """
        Place \`virtual_nodes\` points on the ring for the given node.

        Each point uses a deterministic label so add_node / remove_node
        are always consistent with each other.
        """
        for i in range(self.virtual_nodes):
            vnode_key = f"{node}#vnode{i}"       # e.g. "cassandra-1#vnode0"
            position = self._hash(vnode_key)
            self.ring[position] = node
            bisect.insort(self.sorted_keys, position)  # O(log n) insert, keeps sorted

    def remove_node(self, node: str) -> None:
        """
        Remove all virtual points belonging to the node.

        Only the keys that mapped to this node are affected — all other
        keys retain their existing owners (the core guarantee of consistent hashing).
        """
        for i in range(self.virtual_nodes):
            vnode_key = f"{node}#vnode{i}"
            position = self._hash(vnode_key)
            del self.ring[position]
            # Remove the single occurrence from the sorted list
            idx = bisect.bisect_left(self.sorted_keys, position)
            self.sorted_keys.pop(idx)

    def get_node(self, key: str) -> str:
        """
        Find the first ring position >= hash(key), wrapping around if needed.

        bisect.bisect() returns the insertion point for the hash value in
        sorted_keys.  If it equals len(sorted_keys) the hash is past the
        last point, so we wrap to index 0 (the smallest position on the ring).
        """
        if not self.ring:
            raise ValueError("Ring is empty — add at least one node first.")

        position = self._hash(key)
        idx = bisect.bisect(self.sorted_keys, position)  # first position > hash

        if idx == len(self.sorted_keys):
            idx = 0  # wrap around to the start of the ring

        return self.ring[self.sorted_keys[idx]]

    def distribution(self, keys: list[str]) -> dict[str, int]:
        """Return a count of how many keys map to each node."""
        counts: dict[str, int] = defaultdict(int)
        for key in keys:
            counts[self.get_node(key)] += 1
        return dict(counts)


# ----- Self-test -----
if __name__ == "__main__":
    ring = ConsistentHashRing(virtual_nodes=150)

    for node in ["cassandra-1", "cassandra-2", "cassandra-3"]:
        ring.add_node(node)

    key = "user:alice"
    owner = ring.get_node(key)
    print(f"{key!r} -> {owner}")

    import random, string
    sample_keys = ["".join(random.choices(string.ascii_lowercase, k=8)) for _ in range(10_000)]
    dist = ring.distribution(sample_keys)
    print("Distribution:", {k: f"{v/100:.1f}%" for k, v in sorted(dist.items())})
    # Expect roughly 33% each; virtual nodes smooth out hot spots.

    ring.remove_node("cassandra-3")
    new_owner = ring.get_node(key)
    print(f"{key!r} after removing cassandra-3 -> {new_owner}")
    # If alice was on cassandra-3 she moved; otherwise she stayed.  Either way,
    # cassandra-1 and cassandra-2 keys are completely unaffected.
    print("Only ~1/3 of keys remapped (consistent hashing guarantee).")
`,
    },
    {
      id: "quorum-and-consensus",
      slug: "quorum-and-consensus",
      title: "Quorum, Consensus, and the Raft Algorithm",
      content: `# Quorum, Consensus, and the Raft Algorithm

Distributed databases don't fail cleanly — nodes crash mid-write, networks partition, and clocks drift. The question every distributed system must answer is: **how do a group of machines agree on anything?**

This lesson gives you the rigorous mental model behind quorum-based reads and writes, the intuition behind Paxos, and a deep walkthrough of Raft — the algorithm powering etcd, CockroachDB, TiKV, and Consul.

---

\`\`\`concept
{
  "title": "The Core Problem: Agreement Under Failure",
  "variant": "mental-model",
  "content": "A distributed system is a set of nodes that must act as one coherent system, even though any node can fail at any time. Consensus is the mechanism by which nodes agree on a single value or sequence of values. Without consensus, concurrent writes can produce conflicting state that no node can resolve."
}
\`\`\`

---

## Part 1 — Quorum: The Math of Overlap

Before diving into full consensus algorithms, let's understand the simpler primitive that underpins them: **quorum**.

\`\`\`concept
{
  "title": "What Is a Quorum?",
  "variant": "analogy",
  "content": "Imagine a 5-member board that requires 3 votes to pass any resolution. Any two meetings that each have 3 members must share at least one common member — that shared member is your single source of truth. Quorum does exactly this for distributed nodes: it guarantees that any read and any write share at least one node in common."
}
\`\`\`

### The Quorum Formula

Given a cluster of **N** nodes, you choose:

- **W** — the number of nodes that must acknowledge a write before it's considered successful
- **R** — the number of nodes that must respond to a read before it's considered valid

The consistency guarantee requires:

> **R + W > N**

This guarantees at least one node in every read set has seen the latest write.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Strong Consistency",
      "icon": "🔒",
      "content": "**R + W > N** (e.g., N=5, W=3, R=3)\\n\\nEvery read will see the latest write. The overlapping node guarantees freshness.\\n\\n**Cost:** Higher latency — more nodes must respond before operations complete.\\n\\n**Used by:** Zookeeper, etcd, CockroachDB in linearizable mode."
    },
    {
      "label": "Eventual Consistency",
      "icon": "⏳",
      "content": "**R + W ≤ N** (e.g., N=5, W=1, R=1)\\n\\nWrites and reads complete after just one node responds. No overlap guaranteed — stale reads are possible.\\n\\n**Cost:** Possible inconsistency windows where different clients see different values.\\n\\n**Used by:** Cassandra with \`ONE\` consistency level, DynamoDB with eventual reads."
    },
    {
      "label": "Write-Heavy Tuning",
      "icon": "✍️",
      "content": "**W=1, R=N** (e.g., N=5, W=1, R=5)\\n\\nWrites are cheap (single acknowledgment). Reads are expensive (all nodes must respond).\\n\\n**Trade-off:** Extremely low write latency at the cost of slow reads.\\n\\n**Used by:** Log aggregation, metrics pipelines where writes dominate."
    },
    {
      "label": "Read-Heavy Tuning",
      "icon": "📖",
      "content": "**W=N, R=1** (e.g., N=5, W=5, R=1)\\n\\nReads are cheap (any single node is authoritative). Writes require all nodes to acknowledge — high write availability risk.\\n\\n**Trade-off:** Slow writes, but any node serves fresh reads instantly.\\n\\n**Used by:** Read-heavy caches and CDN origin stores."
    }
  ]
}
\`\`\`

### Real-World Example: Cassandra's Consistency Levels

Cassandra exposes quorum directly to the application developer:

| Consistency Level | W or R value | N=3 cluster |
|---|---|---|
| \`ONE\` | 1 | Fastest, possibly stale |
| \`QUORUM\` | ⌊N/2⌋ + 1 = 2 | Balanced — safe with R+W=4 > 3 |
| \`ALL\` | 3 | Strongest, least available |
| \`LOCAL_QUORUM\` | Quorum within one datacenter | Used for multi-region deployments |

\`\`\`callout
{
  "type": "warning",
  "title": "Quorum ≠ Consensus",
  "content": "Quorum is a read/write overlap rule — it prevents stale reads in steady-state operation. But it doesn't handle the case where nodes disagree on what value was written (concurrent writes, network partitions mid-write). That's where consensus algorithms like Paxos and Raft take over."
}
\`\`\`

---

## Part 2 — Paxos: The Original (and Famously Hard) Algorithm

Paxos was described by Leslie Lamport in 1989 and became the theoretical backbone of distributed consensus. Google Spanner, Chubby, and Megastore all use variants of Paxos.

\`\`\`concept
{
  "title": "Paxos Intuition",
  "variant": "analogy",
  "content": "Paxos is like running a vote in a room where people keep leaving and re-entering. To ensure a decision sticks, you need to: (1) announce your intention to propose before proposing, (2) collect promises from a majority that they won't accept older proposals, and (3) only then broadcast your final value. The two-phase structure ensures that even if you leave mid-vote, no conflicting decision gets made."
}
\`\`\`

### The Two Phases

\`\`\`steps
{
  "title": "How Paxos Reaches Consensus",
  "steps": [
    {
      "title": "Phase 1a: Prepare",
      "content": "A **proposer** picks a unique proposal number \`n\` and sends \`PREPARE(n)\` to a majority of **acceptors**.\\n\\nThe proposal number must be higher than any previously seen — this is how Paxos handles competing proposers."
    },
    {
      "title": "Phase 1b: Promise",
      "content": "Each acceptor responds with \`PROMISE(n)\` — a commitment to reject any future \`PREPARE\` with a number < n.\\n\\nIf the acceptor has already accepted a value in a prior round, it includes that value in its promise. This is the crucial step that prevents Paxos from overwriting already-committed values."
    },
    {
      "title": "Phase 2a: Accept",
      "content": "Once the proposer has promises from a majority, it sends \`ACCEPT(n, value)\`.\\n\\nIf any promise included a previously accepted value, the proposer **must** use that value (not its own). This is how Paxos preserves committed decisions across leader changes."
    },
    {
      "title": "Phase 2b: Accepted",
      "content": "Acceptors receive \`ACCEPT(n, value)\`. If they haven't promised a higher \`n\`, they accept it and reply \`ACCEPTED(n, value)\`.\\n\\nOnce a majority have sent \`ACCEPTED\`, consensus is reached — the value is **chosen**."
    },
    {
      "title": "Learners Are Notified",
      "content": "**Learners** (the nodes that need to use the agreed value) are notified of the chosen value. In a replicated state machine, learners apply the value to their local state."
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "info",
  "title": "Why Paxos Fell Out of Favor for Implementations",
  "content": "Paxos proves correctness for agreeing on a **single value**. Building a replicated log requires Multi-Paxos — a complex extension that Lamport never fully specified. Real implementations (like Google Chubby) diverge significantly from the paper, making it difficult to reason about or audit. This is exactly the problem Raft was designed to solve."
}
\`\`\`

---

## Part 3 — Raft: Consensus Made Understandable

Raft was designed in 2013 by Diego Ongaro and John Ousterhout with one explicit goal: **understandability**. The paper is titled "In Search of an Understandable Consensus Algorithm." It decomposes consensus into three relatively independent sub-problems.

\`\`\`concept
{
  "title": "Raft's Design Philosophy",
  "variant": "rule",
  "content": "Raft achieves consensus through a strong leader: at any time, one node is the authoritative source of truth. All writes go through the leader; the leader replicates entries to followers; commits happen only when a majority of nodes have written the entry. This eliminates the ambiguity of peer-to-peer Paxos negotiation."
}
\`\`\`

### Node States in Raft

Every Raft node is always in exactly one of three states:

\`\`\`algoviz
{
  "title": "Raft Node State Machine",
  "type": "array",
  "data": ["Follower", "Candidate", "Leader"],
  "frames": [
    { "highlight": [0], "label": "Initial state: all nodes start as Followers, waiting for heartbeats from a Leader", "stats": { "state": "Follower", "term": 0 } },
    { "highlight": [0, 1], "label": "Election timeout fires: Follower becomes Candidate, increments term, votes for itself", "stats": { "state": "Candidate", "term": 1 } },
    { "highlight": [1, 2], "label": "Candidate wins majority votes: transitions to Leader, begins sending heartbeats", "stats": { "state": "Leader", "term": 1 } },
    { "highlight": [2, 0], "label": "Leader discovers higher term: immediately reverts to Follower (split-brain prevention)", "stats": { "state": "Follower", "term": 2 } }
  ],
  "speed": 1000
}
\`\`\`

### Sub-problem 1: Leader Election

\`\`\`steps
{
  "title": "Raft Leader Election",
  "steps": [
    {
      "title": "Heartbeat Timeout",
      "content": "Every follower has a randomized **election timeout** (typically 150–300 ms). If a follower doesn't receive a heartbeat from the leader within this window, it assumes the leader has failed."
    },
    {
      "title": "Start an Election",
      "content": "The follower increments its **term number** (a logical clock), transitions to **Candidate**, votes for itself, and broadcasts \`RequestVote(term, candidateId, lastLogIndex, lastLogTerm)\` to all peers.\\n\\nThe term number ensures old leaders can't re-establish authority after recovering from a partition."
    },
    {
      "title": "Vote Granting Rules",
      "content": "A node grants its vote only if:\\n1. It hasn't voted in this term yet\\n2. The candidate's log is **at least as up-to-date** as the voter's own log\\n\\nThe second rule is critical — it prevents a stale node from becoming leader and overwriting committed entries."
    },
    {
      "title": "Win the Election",
      "content": "A candidate that receives votes from a **majority (⌊N/2⌋ + 1)** of nodes transitions to Leader and immediately sends heartbeats to suppress new elections."
    },
    {
      "title": "Split Vote Handling",
      "content": "If no candidate wins a majority (two candidates split votes evenly), the election times out and a new election starts with a higher term.\\n\\nRandomized timeouts make this rare — statistically, one node almost always starts its election first."
    }
  ]
}
\`\`\`

### Sub-problem 2: Log Replication

Once a leader is elected, all writes go through it. Here's how an entry moves from client request to committed state:

\`\`\`sysdiag
{
  "title": "Raft Log Replication Flow",
  "width": 640,
  "height": 320,
  "nodes": [
    { "id": "client", "label": "Client", "x": 60, "y": 160, "kind": "client" },
    { "id": "leader", "label": "Leader\\n(Node 1)", "x": 220, "y": 160, "kind": "service" },
    { "id": "f1", "label": "Follower\\n(Node 2)", "x": 420, "y": 80, "kind": "service" },
    { "id": "f2", "label": "Follower\\n(Node 3)", "x": 420, "y": 240, "kind": "service" },
    { "id": "f3", "label": "Follower\\n(Node 4)", "x": 560, "y": 160, "kind": "service" }
  ],
  "edges": [
    { "from": "client", "to": "leader", "label": "1. Write request" },
    { "from": "leader", "to": "f1", "label": "2. AppendEntries RPC" },
    { "from": "leader", "to": "f2", "label": "2. AppendEntries RPC" },
    { "from": "leader", "to": "f3", "label": "2. AppendEntries RPC" },
    { "from": "f1", "to": "leader", "label": "3. ACK" },
    { "from": "f2", "to": "leader", "label": "3. ACK" },
    { "from": "leader", "to": "client", "label": "4. Commit + respond" }
  ],
  "annotations": {
    "leader": "Appends entry to its own log first. Sends AppendEntries to all followers in parallel. Commits once majority (3 of 5) have written the entry.",
    "f1": "Appends entry to local log, replies with success. Applies to state machine only after learning that commit index advanced.",
    "f3": "May be slow or partitioned. Leader does not wait for it — majority (f1 + f2 + leader) is sufficient to commit."
  }
}
\`\`\`

\`\`\`concept
{
  "title": "The Commit Rule",
  "variant": "rule",
  "content": "An entry is **committed** when the leader has replicated it to a majority of nodes. Committed entries are guaranteed to survive leader failures — any new leader elected will have the entry in its log (because it must win a majority vote, and at least one voter in that majority has the committed entry)."
}
\`\`\`

### Sub-problem 3: Safety — Log Consistency Invariant

Raft maintains a powerful invariant: **if two logs have an entry with the same index and term, they are identical up to that point**.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Inconsistent Follower Log (not allowed)",
    "code": "Leader log:   [1:set x=1] [2:set y=2] [3:set z=3]\\nFollower log: [1:set x=1] [2:set y=9] [3:set z=3]\\n                              ^\\n                     Diverged silently — BAD"
  },
  "after": {
    "label": "Raft's Consistency Check (AppendEntries)",
    "code": "AppendEntries includes: prevLogIndex=2, prevLogTerm=1\\n\\nFollower checks: does my log[2] have term=1?\\n  - If YES: append new entry, respond success\\n  - If NO:  reject, leader backs up and retries\\n\\nLeader keeps backing up until match found,\\nthen replays all entries forward — overwriting\\nfollower divergence with leader's authoritative log."
  }
}
\`\`\`

---

## Part 4 — Raft in the Wild

\`\`\`tabs
{
  "tabs": [
    {
      "label": "etcd",
      "icon": "⚙️",
      "content": "**etcd** is Kubernetes' distributed key-value store for cluster state (pod specs, secrets, config maps). It uses Raft to ensure that all control plane nodes agree on cluster state.\\n\\nA 3-node etcd cluster can tolerate 1 node failure. A 5-node cluster tolerates 2.\\n\\n**Why Raft?** Kubernetes needs linearizable reads — when you \`kubectl get pod\`, you must see the most recent write. Raft's strong leader model provides this by default."
    },
    {
      "label": "CockroachDB",
      "icon": "🪳",
      "content": "CockroachDB uses Raft at the **range level** — the database is divided into 64 MB key ranges, and each range has its own independent Raft group with 3–5 replicas.\\n\\nThis means a 9-node cluster can have hundreds of Raft groups running simultaneously — each one handling consensus for its own slice of the keyspace.\\n\\n**Why this matters:** A failure in one range doesn't affect others. The system degrades gracefully rather than failing wholesale."
    },
    {
      "label": "Consul",
      "icon": "🔍",
      "content": "HashiCorp Consul uses Raft for service discovery and health checking consensus. When a service registers or a health check changes state, that event must be agreed upon by the Consul server cluster.\\n\\nConsul exposes the consistency level directly:\\n- **default:** may read from a follower (slightly stale)\\n- **consistent:** routes all reads through the leader (linearizable, higher latency)\\n- **stale:** reads from any node (maximum performance, eventual consistency)"
    },
    {
      "label": "TiKV",
      "icon": "🗃️",
      "content": "TiKV (the storage layer of TiDB) uses a variant called **Multi-Raft** — similar to CockroachDB's per-range approach. Each region (shard) runs its own Raft group.\\n\\nTiKV also implements **Raft learner nodes**: read-only replicas that receive log entries but don't vote. This is used to bootstrap new replicas without impacting the voting quorum during data transfer."
    }
  ]
}
\`\`\`

---

## Part 5 — Failure Modes and Edge Cases

\`\`\`callout
{
  "type": "danger",
  "title": "The Split-Brain Trap",
  "content": "In a network partition, both halves of a cluster might elect their own leader. Raft prevents this because a leader can only be elected with a majority vote — and only one partition can have the majority. The minority partition stops accepting writes (it can't form a quorum), preventing conflicting committed entries."
}
\`\`\`

\`\`\`collapse
{
  "title": "Deep Dive: Leader Completeness Property",
  "content": "Raft guarantees that once an entry is committed, every future leader will have that entry in its log. This is enforced by the vote-granting rule:\\n\\nA voter rejects a candidate whose log is **less up-to-date** than its own. Log comparison uses:\\n1. **Term of last entry** — higher term wins\\n2. **Length of log** — if equal terms, longer log wins\\n\\nThis means a candidate that's missing committed entries (which a majority has) can never win an election — because at least ⌊N/2⌋ + 1 voters have those entries and will reject the stale candidate.\\n\\n**Why this matters for correctness:** Without this property, a new leader could start overwriting committed entries with its own (missing) log state, creating data loss. The completeness property is the cornerstone of Raft's safety proof."
}
\`\`\`

\`\`\`collapse
{
  "title": "Deep Dive: The Pre-Vote Extension",
  "content": "A known weakness in vanilla Raft: if a follower is partitioned from the leader but not from other followers, it keeps incrementing its term every 150ms (election timeout). When the partition heals, it rejoins with a massively inflated term — forcing the current stable leader to step down and triggering an unnecessary election.\\n\\n**Pre-Vote** (an extension used by etcd) fixes this: before actually starting an election and incrementing term, a candidate first asks 'would you vote for me?' If it can't get a majority to hypothetically vote for it, it doesn't start the real election — and doesn't increment the term.\\n\\nThis makes Raft clusters far more stable in flaky network conditions."
}
\`\`\`

---

## Putting It All Together

\`\`\`concept
{
  "title": "Quorum vs. Consensus: When to Use Each",
  "variant": "insight",
  "content": "Quorum rules (R + W > N) are sufficient for systems where concurrent writes are either impossible or handled by application-level logic (like vector clocks). Consensus algorithms like Raft are required when you need total ordering of writes — a single agreed-upon sequence — which is the foundation of replicated state machines. Most production databases combine both: Raft provides the consensus backbone, and quorum configuration lets operators tune read/write latency trade-offs on top."
}
\`\`\`

\`\`\`quiz
{
  "title": "Quorum, Paxos, and Raft",
  "questions": [
    {
      "question": "In a 5-node Cassandra cluster, you set W=3 and R=2. Is this configuration strongly consistent?",
      "options": [
        "Yes — R + W = 5 = N, which satisfies the quorum rule",
        "No — R + W must be strictly greater than N for consistency",
        "Yes — any W ≥ 3 is always strongly consistent regardless of R",
        "No — only W=5 guarantees strong consistency"
      ],
      "answer": 1,
      "explanation": "The quorum rule requires R + W > N (strictly greater than). With N=5, W=3, R=2: 3+2=5, which equals N but does not exceed it. A read quorum of 2 and a write quorum of 3 share no guaranteed overlap — a reader might hit the two nodes that didn't acknowledge the latest write. You need R+W ≥ 6, so W=3, R=3 is the minimum strongly consistent configuration for N=5."
    },
    {
      "question": "In Raft, why must a candidate's log be at least as up-to-date as a voter's log before the vote is granted?",
      "options": [
        "To prevent slow nodes from becoming leaders and reducing throughput",
        "To ensure the new leader has all committed entries, preventing data loss",
        "To minimize the number of AppendEntries RPCs needed after election",
        "To enforce that all logs are identical before an election can succeed"
      ],
      "answer": 1,
      "explanation": "This is Raft's Leader Completeness Property. A committed entry has been replicated to a majority of nodes. If a candidate needs votes from a majority, and at least one node in that majority has every committed entry, then the vote-granting rule (reject candidates with less up-to-date logs) ensures the winner always has all committed entries. Without this rule, a stale leader could overwrite committed data."
    },
    {
      "question": "A 5-node Raft cluster loses 2 nodes simultaneously. What happens?",
      "options": [
        "The cluster enters read-only mode — reads work but writes are rejected",
        "The cluster continues normally since 3 nodes still form a majority",
        "The cluster stops accepting both reads and writes until nodes recover",
        "The two remaining followers auto-promote to leaders to maintain availability"
      ],
      "answer": 1,
      "explanation": "With 5 nodes, majority = ⌊5/2⌋ + 1 = 3. Losing 2 nodes leaves 3 nodes intact — exactly the majority needed to elect a leader and commit entries. The cluster continues to operate normally. This is why production deployments prefer 5-node clusters over 3-node: a 3-node cluster loses quorum on the first failure."
    },
    {
      "question": "Which Paxos phase ensures that an already-committed value cannot be overwritten by a new proposer?",
      "options": [
        "Phase 1a (Prepare) — the new proposer must use a higher proposal number",
        "Phase 1b (Promise) — acceptors return their previously accepted values, forcing the proposer to use them",
        "Phase 2a (Accept) — the proposer broadcasts its value to all acceptors",
        "Phase 2b (Accepted) — acceptors only reply to the original proposer"
      ],
      "answer": 1,
      "explanation": "In Phase 1b, when an acceptor returns a promise, it includes any value it has already accepted. If a majority of acceptors have already accepted a value v (meaning v is committed), then any new proposer will receive v in at least one promise response and is required to use v as its proposed value. This is the mechanism that makes Paxos safe across leader changes."
    },
    {
      "question": "etcd uses linearizable reads by routing all reads through the Raft leader. What is the trade-off compared to allowing follower reads?",
      "options": [
        "Leader reads are faster because the leader has a local cache",
        "Leader reads increase availability but reduce consistency",
        "Leader reads increase latency and reduce throughput but guarantee freshness",
        "Leader reads are only used during elections; normal reads are follower reads"
      ],
      "answer": 2,
      "explanation": "Routing reads through the leader adds a network hop for clients connected to followers, reduces read throughput (one node serves all reads vs. distributed across N nodes), and creates a hotspot on the leader. The trade-off is guaranteed linearizability — the reader always sees the most recent committed write. Consul's 'stale' read mode is the opposite trade-off: any follower can serve reads for maximum throughput, accepting potential staleness."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Quorum (R + W > N) guarantees read-write overlap in steady state — at least one node in every read set has seen the latest write. It is a necessary but not sufficient condition for full distributed consensus.",
    "Paxos uses a two-phase propose-then-accept protocol to handle concurrent proposers safely. Its complexity in practice led to the creation of Raft.",
    "Raft decomposes consensus into leader election, log replication, and safety. A strong leader serializes all writes; commits require acknowledgment from a majority of nodes.",
    "Leader election in Raft uses randomized timeouts and a log-freshness check in the vote-granting rule — ensuring the winner always has all committed entries (Leader Completeness Property).",
    "Real systems (etcd, CockroachDB, Consul, TiKV) build on Raft and expose consistency as a tunable parameter, letting operators make explicit latency vs. freshness trade-offs."
  ]
}
\`\`\``,
    },
    {
      id: "bloom-filters",
      slug: "bloom-filters",
      title: "Bloom Filters and Probabilistic Data Structures",
      content: `# Bloom Filters and Probabilistic Data Structures

Imagine you're building a recommendation engine for a platform with 230 million users and billions of content items. Every time a user requests new content, your system needs to answer one question: **"Has this user already seen this item?"**

A traditional hash set storing every user-item pair would consume terabytes of memory. But what if you could answer that question using just a few megabytes — at the cost of occasionally saying "maybe seen" when the user hasn't? That trade-off is the heart of probabilistic data structures, and **Bloom filters** are their most elegant representative.

---

## The Asymmetric Promise

\`\`\`concept
{ "title": "The Bloom Filter Guarantee", "variant": "rule", "content": "A Bloom filter makes one iron-clad promise: **if it says NO, it is absolutely certain**. If it says YES, there is a small probability it is wrong (a false positive). There are never false negatives." }
\`\`\`

This asymmetry is not a bug — it's the design. In many real systems, a false negative (missing something that exists) is catastrophic, while a false positive (extra work done once) is merely inconvenient. Bloom filters are engineered exactly around this constraint.

\`\`\`tabs
{ "tabs": [
  { "label": "Traditional Hash Set", "icon": "🗂️", "content": "**Memory:** O(n × element_size)\\n\\n**Lookup time:** O(1)\\n\\n**False positives:** 0%\\n\\n**False negatives:** 0%\\n\\nFor 1 billion 64-bit user IDs: **~8 GB of RAM**.\\n\\nFor user-item pairs (user_id + item_id): **~16+ GB**.\\n\\nExact — but prohibitively expensive at scale." },
  { "label": "Bloom Filter", "icon": "🌸", "content": "**Memory:** O(m bits), independent of element size\\n\\n**Lookup time:** O(k) where k = number of hash functions\\n\\n**False positives:** ε (tunable, typically 1–3%)\\n\\n**False negatives:** 0% (guaranteed)\\n\\nFor 1 billion items at 1% false-positive rate: **~1.14 GB**.\\n\\nProbabilistic — but 8× more memory-efficient." },
  { "label": "When to Use", "icon": "🎯", "content": "**Use a Bloom filter when:**\\n- The \\"definitely not\\" answer lets you skip an expensive operation (DB read, network call)\\n- A small false positive rate is acceptable\\n- Memory is constrained\\n- Deletions are not needed (basic version)\\n\\n**Do NOT use when:**\\n- You need 100% precision\\n- You need to delete elements (use a Counting Bloom Filter instead)\\n- The set is tiny (hash set is fine)" }
] }
\`\`\`

---

## How a Bloom Filter Works

A Bloom filter has two components:
- A **bit array** of \`m\` bits, all initialized to 0
- **k independent hash functions**, each mapping an element to a position in \`[0, m-1]\`

**Inserting** an element: compute all k hash positions and set those bits to 1.

**Querying** an element: compute all k hash positions and check if **all** those bits are 1.
- If any bit is 0 → element is **definitely NOT** in the set
- If all bits are 1 → element is **probably** in the set (could be a false positive from other elements)

\`\`\`algoviz
{ "title": "Bloom Filter: Insert 'alice' and 'bob', then query 'carol'", "type": "array", "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "frames": [
  { "highlight": [], "label": "Initial state: 10-bit array, all zeros", "stats": { "operation": "init", "element": "-" } },
  { "highlight": [2, 5, 7], "label": "Insert 'alice': h1('alice')=2, h2('alice')=5, h3('alice')=7 → set bits", "stats": { "operation": "insert", "element": "alice" } },
  { "highlight": [1, 5, 8], "label": "Insert 'bob': h1('bob')=1, h2('bob')=5, h3('bob')=8 → set bits (bit 5 already 1)", "stats": { "operation": "insert", "element": "bob" } },
  { "highlight": [3, 5, 7], "label": "Query 'carol': h1('carol')=3, h2('carol')=5, h3('carol')=7 → check bits", "stats": { "operation": "query", "element": "carol" } },
  { "highlight": [3], "label": "Bit 3 = 0 → 'carol' is DEFINITELY NOT in the set. No false negative possible.", "stats": { "result": "NOT FOUND (certain)", "element": "carol" } }
], "speed": 900 }
\`\`\`

---

## Implementing a Bloom Filter from Scratch

\`\`\`playground
{ "title": "Bloom Filter Implementation", "language": "python", "code": "import hashlib\\nimport math\\n\\nclass BloomFilter:\\n    def __init__(self, capacity: int, error_rate: float = 0.01):\\n        \\"\\"\\"\\n        capacity: expected number of elements\\n        error_rate: acceptable false positive probability (e.g. 0.01 = 1%)\\n        \\"\\"\\"\\n        # Optimal bit array size: m = -n * ln(p) / (ln(2))^2\\n        self.m = math.ceil(-capacity * math.log(error_rate) / (math.log(2) ** 2))\\n        # Optimal number of hash functions: k = (m/n) * ln(2)\\n        self.k = math.ceil((self.m / capacity) * math.log(2))\\n        self.bits = bytearray(math.ceil(self.m / 8))  # byte-packed\\n        self.capacity = capacity\\n        self.count = 0\\n        print(f\\"Bloom filter: m={self.m} bits ({self.m//8} bytes), k={self.k} hashes\\")\\n        print(f\\"Theoretical FP rate at capacity: {error_rate:.1%}\\")\\n\\n    def _hash_positions(self, item: str):\\n        \\"\\"\\"Generate k bit positions using double-hashing.\\"\\"\\"\\n        h1 = int(hashlib.md5(item.encode()).hexdigest(), 16)\\n        h2 = int(hashlib.sha256(item.encode()).hexdigest(), 16)\\n        for i in range(self.k):\\n            yield (h1 + i * h2) % self.m\\n\\n    def add(self, item: str):\\n        for pos in self._hash_positions(item):\\n            byte_idx, bit_idx = divmod(pos, 8)\\n            self.bits[byte_idx] |= (1 << bit_idx)\\n        self.count += 1\\n\\n    def __contains__(self, item: str) -> bool:\\n        for pos in self._hash_positions(item):\\n            byte_idx, bit_idx = divmod(pos, 8)\\n            if not (self.bits[byte_idx] & (1 << bit_idx)):\\n                return False  # Definite NO\\n        return True  # Probable YES\\n\\n    def actual_fp_rate(self) -> float:\\n        \\"\\"\\"Empirical FP rate: (1 - e^(-kn/m))^k\\"\\"\\"\\n        exponent = -self.k * self.count / self.m\\n        return (1 - math.exp(exponent)) ** self.k\\n\\n# --- Demo ---\\nbf = BloomFilter(capacity=1000, error_rate=0.01)\\nprint()\\n\\n# Insert 1000 known items\\nfor i in range(1000):\\n    bf.add(f\\"user:seen:item_{i}\\")\\n\\nprint(f\\"Inserted {bf.count} items\\")\\nprint(f\\"Actual FP rate now: {bf.actual_fp_rate():.2%}\\")\\nprint()\\n\\n# Test known items (should never miss)\\nprint(\\"=== False Negative Test (should all be True) ===\\")\\nfor i in [0, 250, 500, 750, 999]:\\n    print(f\\"  item_{i} in filter: {f'user:seen:item_{i}' in bf}\\")\\n\\n# Test unseen items — measure false positives\\nprint(\\"\\\\n=== False Positive Test (querying 500 unseen items) ===\\")\\nfp = sum(1 for i in range(1000, 1500) if f\\"user:seen:item_{i}\\" in bf)\\nprint(f\\"  False positives: {fp}/500 = {fp/500:.1%}\\")\\n", "runnable": true }
\`\`\`

---

## Deriving the False Positive Formula

This is the key formula every architect must understand intuitively.

\`\`\`concept
{ "title": "False Positive Probability Formula", "variant": "mental-model", "content": "After inserting **n** elements into a filter with **m** bits and **k** hash functions:\\n\\n**P(false positive) = (1 − e^(−kn/m))^k**\\n\\nThe term \`e^(−kn/m)\` is the probability that a specific bit is still 0 after n insertions. So \`1 − e^(−kn/m)\` is the probability a bit was set to 1. We need ALL k bits to be 1 by chance — hence the k-th power." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Deriving Optimal k and m", "content": "### Why These Formulas?\\n\\nGiven a desired false positive rate \`p\` and expected \`n\` insertions:\\n\\n**Optimal bit array size:**\\n\`\`\`\\nm = -n × ln(p) / (ln 2)²\\n\`\`\`\\nThis minimizes memory while achieving the target error rate.\\n\\n**Optimal number of hash functions:**\\n\`\`\`\\nk = (m/n) × ln 2 ≈ 0.693 × (m/n)\\n\`\`\`\\nToo few hashes → bits fill too slowly, high collision chance.\\nToo many hashes → bits fill too quickly, everything looks like a hit.\\n\\n**Practical numbers:**\\n\\n| Error rate | Bits per element (m/n) | Hash functions (k) |\\n|-----------|----------------------|--------------------|\\n| 1% | 9.6 | 7 |\\n| 0.1% | 14.4 | 10 |\\n| 0.01% | 19.2 | 13 |\\n\\nNotice: **each order of magnitude improvement in error rate costs ~4.8 extra bits per element** — a remarkably gentle penalty." }
\`\`\`

---

## Trace: Step-by-Step False Positive

The hardest thing to internalize is *how* false positives arise. Watch what happens when bits from different insertions collide:

\`\`\`trace
{ "title": "How a False Positive Occurs", "language": "python", "code": "# Bit array: 10 positions, k=3 hash functions\\nbits = [0] * 10\\n\\n# Insert 'alice': positions 2, 5, 7\\nbits[2] = bits[5] = bits[7] = 1\\n\\n# Insert 'bob': positions 1, 5, 8\\nbits[1] = bits[5] = bits[8] = 1\\n\\n# Query 'mallory': h1=1, h2=7, h3=8\\n# Check bits[1]=1, bits[7]=1, bits[8]=1\\n# All 1s! But mallory was never inserted.\\nresult = bits[1] == 1 and bits[7] == 1 and bits[8] == 1\\nprint(f\\"False positive: {result}\\")", "frames": [
  { "line": 2, "vars": { "bits": "[0,0,0,0,0,0,0,0,0,0]" }, "note": "Initialize 10-bit array to zeros" },
  { "line": 5, "vars": { "bits": "[0,0,1,0,0,1,0,1,0,0]" }, "note": "Insert 'alice': set positions 2, 5, 7" },
  { "line": 8, "vars": { "bits": "[0,1,1,0,0,1,0,1,1,0]" }, "note": "Insert 'bob': set positions 1, 5, 8. Bit 5 already set." },
  { "line": 11, "vars": { "check_1": 1, "check_7": 1, "check_8": 1 }, "note": "Query 'mallory': h1=1, h2=7, h3=8. ALL three bits happen to be 1!" },
  { "line": 13, "vars": { "result": "True" }, "note": "FALSE POSITIVE: bits[1] set by bob, bits[7] set by alice, bits[8] set by bob. 'mallory' was never inserted but looks like it was.", "stdout": "False positive: True" }
], "speed": 900 }
\`\`\`

---

## Real-World Applications

\`\`\`tabs
{ "tabs": [
  { "label": "Google Chrome", "icon": "🌐", "content": "**Safe Browsing API**\\n\\nChrome downloads a Bloom filter (~50MB) containing millions of known malicious URLs. On every navigation:\\n1. Check the local Bloom filter first (sub-millisecond, no network)\\n2. If NO → safe, proceed\\n3. If YES (possible FP) → make a real API call to verify\\n\\n**Result:** 99%+ of safe URLs never hit the network. The 1% false positive rate is invisible to users — they just see a tiny extra latency on rare URLs." },
  { "label": "Cassandra / HBase", "icon": "🗄️", "content": "**Avoiding Expensive Disk Reads**\\n\\nSSTable storage engines use Bloom filters to avoid reading SSTable files that definitely don't contain a key:\\n1. Query arrives for key K\\n2. For each SSTable file, check its Bloom filter\\n3. If NO → skip this file entirely (saves a disk read)\\n4. If YES → read the file to confirm\\n\\nAt Facebook's scale, Bloom filters in Cassandra reduce disk I/O by 70%+ for read-heavy workloads." },
  { "label": "LinkedIn / Netflix", "icon": "📽️", "content": "**Already-Seen Content Filtering**\\n\\nBefore fetching recommendations from the ML model:\\n1. Bloom filter lookup: 'has user U seen item I?'\\n2. If YES → skip (possible FP means occasional re-recommendation, tolerable)\\n3. If NO → include in candidate set\\n\\n**LinkedIn stats:** A 2GB Bloom filter covers all user-item interactions across 900M members. Alternative exact storage: ~50GB+." },
  { "label": "Bitcoin / Ethereum", "icon": "₿", "content": "**SPV Wallet Filtering**\\n\\nLight clients (mobile wallets) can't store the full blockchain. They send a Bloom filter of their addresses to full nodes:\\n1. Full node filters transactions through the client's Bloom filter\\n2. Only sends transactions that *might* match\\n3. Client verifies the small subset it receives\\n\\nFalse positives send the client some extra transactions — a minor bandwidth cost that preserves privacy (exact address set never revealed)." }
] }
\`\`\`

---

## Beyond Bloom: Other Probabilistic Structures

\`\`\`concept
{ "title": "The Probabilistic Data Structure Zoo", "variant": "insight", "content": "Bloom filters solve *membership testing*. But distributed systems need other approximate queries too — counting distinct elements, estimating frequencies. Each problem has its own elegant probabilistic solution." }
\`\`\`

\`\`\`tabs
{ "tabs": [
  { "label": "HyperLogLog", "icon": "📊", "content": "**Problem:** Count distinct elements in a massive stream (cardinality estimation)\\n\\n**How it works:**\\n- Hash each element to a bit string\\n- Track the maximum number of leading zeros seen (k leading zeros ≈ 2^k distinct elements)\\n- Use multiple registers and harmonic mean to reduce variance\\n\\n**Performance:**\\n- Memory: ~1.5 KB for ±2% accuracy over billions of elements\\n- Time: O(1) per insert\\n\\n**Used by:**\\n- Redis \`PFADD\`/\`PFCOUNT\` commands\\n- Google Analytics (daily active users)\\n- PostgreSQL (query planner estimates)\\n\\n\`\`\`python\\nimport hyperloglog\\nhll = hyperloglog.HyperLogLog(0.02)  # 2% error\\nfor user_id in stream_of_billions:\\n    hll.add(user_id)\\nprint(f'~{len(hll):,} distinct users')\\n\`\`\`" },
  { "label": "Count-Min Sketch", "icon": "📈", "content": "**Problem:** Estimate frequencies of items in a stream (heavy hitters)\\n\\n**How it works:**\\n- Maintain a 2D array of counters: d rows × w columns\\n- d independent hash functions, one per row\\n- Insert: increment \`table[i][h_i(x)]\` for each row i\\n- Query: return \`min(table[i][h_i(x)])\` across all rows (collisions only inflate, never reduce — min corrects)\\n\\n**Performance:**\\n- Memory: O(d × w) — typically kilobytes\\n- Error guarantee: estimate ≤ true + ε·N with probability 1−δ\\n\\n**Used by:**\\n- Twitter: trending topics detection\\n- Networking: top-K traffic flows\\n- Ad systems: click frequency estimation\\n\\nThe min-projection is what makes it work: hash collisions only *add* to counts, so the minimum across rows is the least-inflated estimate." },
  { "label": "Cuckoo Filter", "icon": "🐦", "content": "**Problem:** Bloom filter with deletion support\\n\\n**How it works:**\\n- Stores fingerprints (partial hashes) in a cuckoo hash table\\n- Each item has 2 candidate buckets\\n- On collision, 'kicks out' existing item to its alternate bucket\\n\\n**Advantages over Bloom:**\\n- Supports deletion (decrement fingerprint count)\\n- Better cache performance (compact storage)\\n- Lower FP rate at high load factors\\n\\n**Disadvantage:**\\n- Insert can fail if table is too full (>95% load)\\n- More complex implementation\\n\\n**Used by:**\\n- TiKV (TiDB's storage engine)\\n- Various CDN edge caches" }
] }
\`\`\`

---

## Practice: Fill in the Bloom Filter

\`\`\`fillblank
{ "title": "Complete the Bloom Filter Query Method", "prompt": "Fill in the blanks to implement the \`contains\` check. Remember: a Bloom filter returns False only when at least one bit is 0.", "language": "python", "template": "def contains(self, item: str) -> bool:\\n    for pos in self._hash_positions(item):\\n        byte_idx, bit_idx = ___(pos, 8)\\n        if not (self.bits[byte_idx] & (1 << ___)):\\n            return ___  # Definite NO\\n    return ___  # Probable YES", "blanks": [
  { "answer": "divmod", "hint": "Built-in that returns (quotient, remainder) — used to find byte index and bit offset" },
  { "answer": "bit_idx", "hint": "The bit offset within the byte (0–7)" },
  { "answer": "False", "hint": "If any bit is 0, the element is definitely NOT present" },
  { "answer": "True", "hint": "All k bits were 1 — element is probably present (possible false positive)" }
] }
\`\`\`

---

## System Design: Where to Place a Bloom Filter

\`\`\`sysdiag
{ "title": "Bloom Filter in a Content Recommendation Pipeline", "width": 700, "height": 380, "nodes": [
  { "id": "client", "label": "Mobile Client", "x": 60, "y": 190, "kind": "client" },
  { "id": "api", "label": "API Gateway", "x": 200, "y": 190, "kind": "service" },
  { "id": "bloom", "label": "Bloom Filter\\n(Redis PFADD)", "x": 370, "y": 100, "kind": "cache" },
  { "id": "rec", "label": "Recommendation\\nEngine", "x": 370, "y": 280, "kind": "service" },
  { "id": "db", "label": "User-Item DB\\n(Cassandra)", "x": 560, "y": 190, "kind": "database" }
], "edges": [
  { "from": "client", "to": "api", "label": "GET /feed" },
  { "from": "api", "to": "bloom", "label": "seen? (O(k))" },
  { "from": "bloom", "to": "api", "label": "probably yes / def. no" },
  { "from": "api", "to": "rec", "label": "unseen candidates" },
  { "from": "rec", "to": "db", "label": "verify + rank" },
  { "from": "db", "to": "client", "label": "top-N results" }
], "annotations": {
  "bloom": "Sits in front of the expensive Cassandra read. Filters out 99%+ of already-seen items in microseconds. False positives occasionally omit an unseen item — tolerable for recommendations.",
  "rec": "Only runs ML scoring on the filtered candidate set — a fraction of the full catalog.",
  "db": "Only consulted for candidates that passed the Bloom filter check."
} }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Bloom Filters & Probabilistic Data Structures", "questions": [
  {
    "question": "A Bloom filter returns \`False\` when querying an element. What can you conclude?",
    "options": [
      "The element might be in the set (possible false negative)",
      "The element is definitely not in the set",
      "The element is probably in the set",
      "The bit array is full"
    ],
    "answer": 1,
    "explanation": "This is the core guarantee: Bloom filters have ZERO false negatives. If the filter returns False (any hash position is 0), the element is DEFINITELY not in the set. Only 'True' results can be wrong (false positives)."
  },
  {
    "question": "You double the bit array size \`m\` while keeping \`n\` and \`k\` constant. What happens to the false positive rate?",
    "options": [
      "It stays the same — only k matters",
      "It increases because more bits means more collisions",
      "It decreases because bits are less likely to all be set by coincidence",
      "It becomes exactly 0%"
    ],
    "answer": 2,
    "explanation": "From the formula P = (1 − e^(−kn/m))^k: doubling m makes the exponent −kn/m more negative, so e^(−kn/m) approaches 1, making (1 − e^(−kn/m)) smaller, and the k-th power smaller still. More bits per element → fewer collisions → lower FP rate."
  },
  {
    "question": "Which use case is NOT well-suited for a standard Bloom filter?",
    "options": [
      "Checking if a URL has been crawled before",
      "Pre-filtering database reads in Cassandra",
      "Tracking which users to remove from a recommendation list after they unlike items",
      "Chrome's malicious URL pre-check before a network call"
    ],
    "answer": 2,
    "explanation": "Standard Bloom filters do not support deletion. Once a bit is set to 1, you can't unset it — removing an element would require knowing which bits it exclusively owned. For deletion support, use a Counting Bloom Filter or Cuckoo Filter instead."
  },
  {
    "question": "HyperLogLog is to cardinality estimation as Count-Min Sketch is to:",
    "options": [
      "Membership testing",
      "Frequency estimation of individual elements",
      "Exact set intersection",
      "Sorting a stream"
    ],
    "answer": 1,
    "explanation": "Count-Min Sketch answers 'how many times has item X appeared?' with a small overestimate. HyperLogLog answers 'how many DISTINCT items have appeared?' Bloom filters answer 'has item X appeared at all?' These three probabilistic structures cover the core approximate query types in streaming systems."
  },
  {
    "question": "A Bloom filter has m=100 bits, k=3 hash functions, and n=10 elements inserted. Approximately what is the false positive probability?",
    "options": [
      "Near 0% — only 30 bits could be set",
      "About 1.7% using (1 − e^(−kn/m))^k",
      "Exactly 3% — one per hash function",
      "50% — half the bits are set"
    ],
    "answer": 1,
    "explanation": "Using the formula: P = (1 − e^(−3×10/100))^3 = (1 − e^(−0.3))^3 ≈ (1 − 0.741)^3 ≈ (0.259)^3 ≈ 1.74%. This matches the rule of thumb: ~9.6 bits per element gives ~1% FP rate, and 100/10 = 10 bits/element is close to that."
  }
] }
\`\`\`

---

## Key Takeaways

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Bloom filters guarantee zero false negatives: a 'not found' answer is always correct. False positives (wrongly saying 'maybe found') are the only error mode.",
  "Memory usage is O(m bits) regardless of element size — about 9.6 bits/element for 1% FP rate. This is 8-10× more efficient than a hash set for large element types.",
  "The false positive formula P = (1 − e^(−kn/m))^k determines your trade-off: more bits (larger m) or fewer insertions (smaller n) lower the error rate.",
  "Standard Bloom filters do not support deletion. Use Counting Bloom Filters or Cuckoo Filters when elements must be removable.",
  "HyperLogLog estimates set cardinality (distinct count) in ~1.5 KB with ±2% accuracy. Count-Min Sketch estimates item frequencies with bounded overestimate. Together with Bloom filters, they form the core toolkit for space-efficient approximate queries in distributed systems.",
  "Real deployments: Chrome Safe Browsing (malicious URL check), Cassandra/HBase (skip empty SSTable reads), LinkedIn/Netflix (already-seen content filtering), Bitcoin SPV wallets (privacy-preserving transaction filtering)."
] }
\`\`\``,
      starterCode: `import math
import mmh3  # pip install mmh3
from bitarray import bitarray  # pip install bitarray


class BloomFilter:
    """
    A space-efficient probabilistic data structure that tests
    whether an element is a member of a set.
    """

    def __init__(self, capacity: int, false_positive_rate: float):
        """
        Initialize the Bloom filter.

        Args:
            capacity: Expected number of elements to insert
            false_positive_rate: Desired false positive probability (e.g. 0.01 = 1%)
        """
        # TODO 1: Calculate the optimal bit array size (m) using the formula:
        #   m = -(n * ln(p)) / (ln(2)^2)
        #   where n = capacity, p = false_positive_rate
        self.size = None  # replace with calculated value

        # TODO 2: Calculate the optimal number of hash functions (k):
        #   k = (m / n) * ln(2)
        self.hash_count = None  # replace with calculated value

        # TODO 3: Initialize a bit array of self.size bits, all set to 0
        self.bit_array = None  # replace with bitarray initialization

    def add(self, item: str) -> None:
        """
        Add an item to the Bloom filter.
        Hash the item k times and set those bit positions to 1.
        """
        # TODO 4: For each hash function i in range(self.hash_count),
        #   compute position = mmh3.hash(item, i) % self.size
        #   and set self.bit_array[position] = 1
        pass

    def __contains__(self, item: str) -> bool:
        """
        Test whether an item is possibly in the set.
        Returns False if definitely NOT in set.
        Returns True if POSSIBLY in set (may be a false positive).
        """
        # TODO 5: For each hash function i in range(self.hash_count),
        #   compute the same position as in add().
        #   If ANY bit is 0, return False.
        #   If ALL bits are 1, return True.
        pass


def false_positive_probability(m: int, k: int, n: int) -> float:
    """
    Calculate the theoretical false positive probability.

    Formula: p = (1 - e^(-k*n/m))^k

    Args:
        m: Number of bits in the array
        k: Number of hash functions
        n: Number of elements inserted
    """
    # TODO 6: Implement the false positive probability formula
    pass


# ----- Tests (do not modify) -----
if __name__ == "__main__":
    bf = BloomFilter(capacity=1000, false_positive_rate=0.01)
    print(f"Bit array size: {bf.size} bits ({bf.size / 8:.0f} bytes)")
    print(f"Hash functions: {bf.hash_count}")

    words = ["apple", "banana", "cherry", "date", "elderberry"]
    for w in words:
        bf.add(w)

    # Should all be True (no false negatives)
    for w in words:
        assert w in bf, f"False negative for '{w}'!"
    print("No false negatives — PASS")

    # Count false positives on unseen words
    test_words = [f"word_{i}" for i in range(10000)]
    fp = sum(1 for w in test_words if w in bf)
    actual_fp_rate = fp / len(test_words)
    print(f"Actual false positive rate: {actual_fp_rate:.4f}")
    print(f"Theoretical FP rate: {false_positive_probability(bf.size, bf.hash_count, len(words)):.4f}")
    assert actual_fp_rate < 0.05, "False positive rate too high!"
    print("False positive rate acceptable — PASS")
`,
      solutionCode: `import math
import mmh3
from bitarray import bitarray


class BloomFilter:
    """
    A space-efficient probabilistic data structure that tests
    whether an element is a member of a set.

    Key properties:
    - No false negatives: if add(x) was called, x in bf is always True
    - Possible false positives: x in bf may be True even if x was never added
    - Cannot remove elements (without a Counting Bloom Filter extension)
    """

    def __init__(self, capacity: int, false_positive_rate: float):
        # Optimal bit array size: m = -(n * ln(p)) / (ln(2))^2
        self.size = math.ceil(
            -(capacity * math.log(false_positive_rate)) / (math.log(2) ** 2)
        )

        # Optimal number of hash functions: k = (m / n) * ln(2)
        self.hash_count = math.ceil((self.size / capacity) * math.log(2))

        # Bit array initialized to all zeros
        self.bit_array = bitarray(self.size)
        self.bit_array.setall(0)

    def add(self, item: str) -> None:
        """Hash item k times; set each resulting bit position to 1."""
        for i in range(self.hash_count):
            # mmh3.hash with seed i gives k independent hash functions
            position = mmh3.hash(item, i) % self.size
            self.bit_array[position] = 1

    def __contains__(self, item: str) -> bool:
        """
        Return False if the item is definitely not in the set.
        Return True if the item is possibly in the set.
        """
        for i in range(self.hash_count):
            position = mmh3.hash(item, i) % self.size
            if not self.bit_array[position]:
                return False  # Definite miss — this bit was never set
        return True  # All bits set — probable hit (may be false positive)


def false_positive_probability(m: int, k: int, n: int) -> float:
    """
    Theoretical false positive probability after inserting n elements.

    Derivation:
    - Probability a single bit stays 0 after n inserts with k hashes:
        P(bit=0) = (1 - 1/m)^(k*n) ≈ e^(-k*n/m)
    - Probability all k bits for a query are 1 (false positive):
        p = (1 - e^(-k*n/m))^k
    """
    return (1 - math.exp(-k * n / m)) ** k


# ----- Tests -----
if __name__ == "__main__":
    bf = BloomFilter(capacity=1000, false_positive_rate=0.01)
    print(f"Bit array size: {bf.size} bits ({bf.size / 8:.0f} bytes)")
    print(f"Hash functions: {bf.hash_count}")

    words = ["apple", "banana", "cherry", "date", "elderberry"]
    for w in words:
        bf.add(w)

    for w in words:
        assert w in bf, f"False negative for '{w}'!"
    print("No false negatives — PASS")

    test_words = [f"word_{i}" for i in range(10000)]
    fp = sum(1 for w in test_words if w in bf)
    actual_fp_rate = fp / len(test_words)
    print(f"Actual false positive rate: {actual_fp_rate:.4f}")
    print(f"Theoretical FP rate: {false_positive_probability(bf.size, bf.hash_count, len(words)):.4f}")
    assert actual_fp_rate < 0.05, "False positive rate too high!"
    print("False positive rate acceptable — PASS")
`,
    },
    {
      id: "distributed-transactions",
      slug: "distributed-transactions",
      title: "Distributed Transactions: 2PC, Sagas, and Outbox Pattern",
      content: `# Distributed Transactions: 2PC, Sagas, and Outbox Pattern

When a single operation must span multiple services or databases, you face one of the hardest problems in distributed systems: **how do you keep everything consistent when any step can fail, any network call can time out, and any service can crash mid-operation?**

Consider an e-commerce checkout. Charging the customer, reserving inventory, and creating the order must all succeed together — or none of them should. That's trivial with a single database. Across three independent services with three separate databases, it's a different story entirely.

This lesson explores the three main tools architects use to solve this:

1. **Two-Phase Commit (2PC)** — strong consistency, high cost
2. **Saga Pattern** — eventual consistency, high availability
3. **Outbox Pattern** — reliable event publishing without distributed transactions

---

\`\`\`concept
{ "title": "The Dual-Write Problem", "variant": "mental-model", "content": "Every distributed transaction is fundamentally a dual-write problem: you must write to system A AND system B, but there is no atomic operation that covers both. If you write to A and then crash before writing to B, you have inconsistency. If you write to B first and crash before A, you have the opposite inconsistency. The three patterns in this lesson are all different strategies for escaping this trap." }
\`\`\`

---

## Two-Phase Commit (2PC)

2PC is the classic protocol for distributed transactions. It works like a wedding ceremony: the officiant asks each party "do you commit?", and only if **everyone** says yes does the ceremony proceed.

\`\`\`steps
{ "title": "How 2PC Works", "steps": [ { "title": "Phase 1: Prepare (Vote)", "content": "The **coordinator** (transaction manager) sends a \`PREPARE\` message to all **participants** (databases/services involved).\\n\\nEach participant:\\n- Executes the transaction up to the commit point\\n- Writes a redo/undo log to durable storage\\n- Replies \`YES\` (ready to commit) or \`NO\` (cannot commit)\\n\\nCritically, participants **hold locks** on modified rows throughout this phase." }, { "title": "Phase 2: Commit or Abort", "content": "If **all** participants voted \`YES\`, the coordinator sends \`COMMIT\` to everyone.\\n\\nIf **any** participant voted \`NO\` (or timed out), the coordinator sends \`ABORT\` to everyone.\\n\\nParticipants apply the commit or rollback, then release their locks and acknowledge." }, { "title": "Recovery: The Coordinator Crashes", "content": "This is where 2PC gets painful. If the coordinator crashes **after** sending \`PREPARE\` but **before** sending \`COMMIT\`, every participant is stuck:\\n\\n- They voted \`YES\` and are holding locks\\n- They cannot commit (don't know the final decision)\\n- They cannot rollback (might violate the protocol)\\n\\nThis is the **blocking problem** — participants are in doubt and must wait for the coordinator to recover." } ] }
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "2PC is a Blocking Protocol", "content": "If the coordinator fails after participants vote YES but before it sends COMMIT, all participants block indefinitely — holding locks, consuming resources, and refusing new writes. This is why 2PC is unsuitable for microservices with long-running operations. It's best reserved for distributed databases (Spanner, CockroachDB) that implement it internally with sophisticated recovery mechanisms." }
\`\`\`

### 2PC in Code: What It Looks Like

\`\`\`playground
{ "title": "Simulating 2PC Logic", "language": "python", "code": "import random\\nimport time\\n\\nclass Participant:\\n    def __init__(self, name):\\n        self.name = name\\n        self.prepared = False\\n        self.committed = False\\n\\n    def prepare(self):\\n        # Simulate occasional failure\\n        if random.random() < 0.2:\\n            print(f\\"{self.name}: VOTE NO (cannot prepare)\\")\\n            return False\\n        self.prepared = True\\n        print(f\\"{self.name}: VOTE YES (locks held, ready to commit)\\")\\n        return True\\n\\n    def commit(self):\\n        if not self.prepared:\\n            raise RuntimeError(f\\"{self.name}: Cannot commit — not prepared\\")\\n        self.committed = True\\n        self.prepared = False  # Release locks\\n        print(f\\"{self.name}: COMMITTED\\")\\n\\n    def abort(self):\\n        self.prepared = False  # Release locks\\n        print(f\\"{self.name}: ABORTED (locks released)\\")\\n\\n\\nclass Coordinator:\\n    def __init__(self, participants):\\n        self.participants = participants\\n\\n    def run_transaction(self):\\n        print(\\"=== Phase 1: PREPARE ===\\")\\n        votes = [p.prepare() for p in self.participants]\\n\\n        print(\\"\\\\n=== Phase 2: COMMIT/ABORT ===\\")\\n        if all(votes):\\n            print(\\"All voted YES — sending COMMIT\\")\\n            for p in self.participants:\\n                p.commit()\\n            print(\\"\\\\nTransaction COMMITTED successfully\\")\\n        else:\\n            print(\\"At least one NO — sending ABORT\\")\\n            for p in self.participants:\\n                p.abort()\\n            print(\\"\\\\nTransaction ABORTED\\")\\n\\n\\n# Run it a few times to see both outcomes\\nfor run in range(3):\\n    print(f\\"\\\\n--- Run {run + 1} ---\\")\\n    order_db = Participant(\\"OrderDB\\")\\n    payment_db = Participant(\\"PaymentDB\\")\\n    inventory_db = Participant(\\"InventoryDB\\")\\n    coordinator = Coordinator([order_db, payment_db, inventory_db])\\n    coordinator.run_transaction()\\n", "runnable": true }
\`\`\`

---

## The Saga Pattern

The Saga pattern, introduced by Hector Garcia-Molina and Kenneth Salem in 1987, takes a fundamentally different approach: **don't try to make the whole operation atomic.** Instead, break it into a sequence of local transactions, each with a corresponding **compensating transaction** that logically reverses it.

\`\`\`concept
{ "title": "Compensating Transactions Are Not Undo", "variant": "insight", "content": "A compensating transaction is not a rollback — it's a new forward action that reverses the business effect. You can't 'un-charge' a credit card; you issue a refund. You can't 'un-send' an email; you send a cancellation. Compensations are domain-specific business logic, not database rollbacks. This means they require careful design and can sometimes fail too." }
\`\`\`

### Saga Execution Flow: Happy Path vs. Failure

\`\`\`algoviz
{ "title": "E-Commerce Checkout Saga", "type": "array", "data": ["Create Order", "Charge Payment", "Reserve Inventory", "Send Confirmation"], "frames": [ { "highlight": [], "label": "Saga starts: 4 local transactions in sequence", "stats": { "step": 0, "status": "pending" } }, { "highlight": [0], "label": "T1: Create order in OrderDB → SUCCESS", "stats": { "step": 1, "status": "running" } }, { "highlight": [0, 1], "label": "T2: Charge customer in PaymentDB → SUCCESS", "stats": { "step": 2, "status": "running" } }, { "highlight": [0, 1, 2], "label": "T3: Reserve items in InventoryDB → FAILURE (out of stock)", "stats": { "step": 3, "status": "failed" } }, { "highlight": [1], "label": "C2: Compensate — issue refund in PaymentDB", "stats": { "step": 4, "status": "compensating" } }, { "highlight": [0], "label": "C1: Compensate — cancel order in OrderDB", "stats": { "step": 5, "status": "compensating" } }, { "highlight": [], "label": "Saga complete: system is in consistent state (no charge, no order)", "stats": { "step": 6, "status": "compensated" } } ], "speed": 900 }
\`\`\`

### Choreography vs. Orchestration

There are two ways to coordinate a saga:

\`\`\`tabs
{ "tabs": [ { "label": "Choreography", "icon": "🎭", "content": "## Choreography-Based Saga\\n\\nEach service **listens for events** and decides what to do next. There is no central coordinator.\\n\\n\`\`\`\\nOrderService → publishes OrderCreated\\n  PaymentService listens → charges card → publishes PaymentCharged\\n    InventoryService listens → reserves stock → publishes StockReserved\\n      NotificationService listens → sends email\\n\`\`\`\\n\\n**Pros:**\\n- No single point of failure\\n- Services are loosely coupled\\n- Each service only knows about its own events\\n\\n**Cons:**\\n- Hard to see the overall saga state (no central log)\\n- Risk of cyclic event chains\\n- Debugging requires correlating events across logs\\n- Business logic is scattered across services" }, { "label": "Orchestration", "icon": "🎼", "content": "## Orchestration-Based Saga\\n\\nA dedicated **Saga Orchestrator** (often the initiating service) tells each participant what to do via direct calls or commands.\\n\\n\`\`\`\\nOrderSaga (orchestrator)\\n  → calls PaymentService.charge()\\n  → on success: calls InventoryService.reserve()\\n  → on failure: calls PaymentService.refund()\\n  → updates order state at each step\\n\`\`\`\\n\\n**Pros:**\\n- Saga state is centralized and visible\\n- Easier to implement complex conditional flows\\n- Simpler to debug — one place to trace execution\\n\\n**Cons:**\\n- Orchestrator can become a bottleneck\\n- Couples orchestrator to all participant services\\n- More upfront design effort\\n\\n**Best for:** Complex sagas with branching logic, human-approval steps, or SLA monitoring." } ] }
\`\`\`

### Saga in Code: Orchestration Style

\`\`\`playground
{ "title": "Orchestrated Checkout Saga", "language": "python", "code": "class SagaStep:\\n    def __init__(self, name, action, compensation):\\n        self.name = name\\n        self.action = action\\n        self.compensation = compensation\\n        self.executed = False\\n\\n\\nclass SagaOrchestrator:\\n    def __init__(self, steps):\\n        self.steps = steps\\n        self.executed = []\\n\\n    def execute(self):\\n        print(\\"Starting saga...\\\\n\\")\\n        for step in self.steps:\\n            try:\\n                print(f\\"Executing: {step.name}\\")\\n                step.action()\\n                step.executed = True\\n                self.executed.append(step)\\n                print(f\\"  ✓ {step.name} succeeded\\\\n\\")\\n            except Exception as e:\\n                print(f\\"  ✗ {step.name} FAILED: {e}\\")\\n                print(\\"\\\\nStarting compensation...\\")\\n                self._compensate()\\n                return False\\n        print(\\"Saga completed successfully!\\")\\n        return True\\n\\n    def _compensate(self):\\n        # Compensate in reverse order\\n        for step in reversed(self.executed):\\n            try:\\n                print(f\\"  Compensating: {step.name}\\")\\n                step.compensation()\\n                print(f\\"  ✓ Compensation for {step.name} done\\")\\n            except Exception as e:\\n                # Compensation failures need alerting + manual intervention!\\n                print(f\\"  ✗ COMPENSATION FAILED for {step.name}: {e}\\")\\n\\n\\n# Simulated service calls\\ndef create_order():\\n    print(\\"  → INSERT INTO orders (status='pending') id=42\\")\\n\\ndef cancel_order():\\n    print(\\"  → UPDATE orders SET status='cancelled' WHERE id=42\\")\\n\\ndef charge_payment():\\n    print(\\"  → Charging \\\\$49.99 to card ending 4242\\")\\n\\ndef refund_payment():\\n    print(\\"  → Issuing refund of \\\\$49.99\\")\\n\\ndef reserve_inventory():\\n    # Simulate stock shortage\\n    raise Exception(\\"Item SKU-001 out of stock\\")\\n\\ndef release_inventory():\\n    print(\\"  → Releasing reserved inventory\\")\\n\\n\\nsteps = [\\n    SagaStep(\\"Create Order\\", create_order, cancel_order),\\n    SagaStep(\\"Charge Payment\\", charge_payment, refund_payment),\\n    SagaStep(\\"Reserve Inventory\\", reserve_inventory, release_inventory),\\n]\\n\\norchestrator = SagaOrchestrator(steps)\\norchestrator.execute()\\n", "runnable": true }
\`\`\`

---

## The Transactional Outbox Pattern

Even after adopting Sagas, you face a subtle but critical problem: **publishing an event and updating a database cannot be done atomically with two separate writes.**

Consider this naive code:

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Naive Dual-Write (BROKEN)", "code": "# This is a race condition\\ndef complete_order(order_id):\\n    # Step 1: Update database\\n    db.execute(\\"UPDATE orders SET status='paid' WHERE id=?\\", order_id)\\n    \\n    # CRASH HERE = event never published!\\n    # DB updated, but downstream services never know\\n    \\n    # Step 2: Publish event\\n    kafka.publish('order.paid', {'orderId': order_id})\\n    # If Kafka is down, event is lost\\n    # If we retry, we might double-publish" }, "after": { "label": "Outbox Pattern (CORRECT)", "code": "# Both writes happen in ONE local transaction\\ndef complete_order(order_id):\\n    with db.transaction():\\n        # Step 1: Update the entity\\n        db.execute(\\n            \\"UPDATE orders SET status='paid' WHERE id=?\\",\\n            order_id\\n        )\\n        # Step 2: Write event to outbox (same transaction!)\\n        db.execute(\\n            \\"INSERT INTO outbox (event_type, payload, published) \\"\\n            \\"VALUES ('order.paid', ?, false)\\",\\n            json.dumps({'orderId': order_id})\\n        )\\n    # A separate process reads outbox and publishes to Kafka\\n    # If it crashes, it retries — events have IDs for deduplication" } }
\`\`\`

\`\`\`concept
{ "title": "The Outbox Pattern", "variant": "rule", "content": "Write your business entity update AND your outbox event record in a single local database transaction. A separate relay process (the 'outbox worker') polls the outbox table and publishes events to the message broker. Because the relay can crash and retry, events must be idempotent — consumers deduplicate by event ID. This gives you at-least-once delivery with eventual consistency, without any distributed transaction." }
\`\`\`

### Outbox Architecture

\`\`\`sysdiag
{ "title": "Transactional Outbox Architecture", "width": 680, "height": 340, "nodes": [ { "id": "svc", "label": "Order Service", "x": 120, "y": 170, "kind": "service" }, { "id": "db", "label": "Orders DB\\n+ outbox table", "x": 300, "y": 170, "kind": "database" }, { "id": "relay", "label": "Outbox\\nRelay Worker", "x": 300, "y": 300, "kind": "service" }, { "id": "broker", "label": "Kafka / RabbitMQ", "x": 520, "y": 170, "kind": "service" }, { "id": "consumer", "label": "Downstream\\nServices", "x": 600, "y": 300, "kind": "service" } ], "edges": [ { "from": "svc", "to": "db", "label": "atomic write\\n(entity + event)" }, { "from": "relay", "to": "db", "label": "polls outbox" }, { "from": "relay", "to": "broker", "label": "publishes event" }, { "from": "broker", "to": "consumer", "label": "consumes" } ], "annotations": { "svc": "Writes to both orders table and outbox table in one transaction. Never writes directly to Kafka.", "db": "outbox table: id, event_type, payload, published_at, created_at", "relay": "Reads unpublished rows, publishes to broker, marks rows published. Runs independently — can crash safely.", "broker": "Receives events from relay only. Consumers get at-least-once delivery." } }
\`\`\`

### Tracing the Outbox Flow

\`\`\`trace
{ "title": "Outbox Pattern Step-by-Step", "language": "python", "code": "# 1. Service writes atomically\\nwith db.transaction():\\n    db.update_order(order_id, status='paid')\\n    db.insert_outbox(event='order.paid', payload={'id': order_id})\\n\\n# 2. Relay worker loop (separate process)\\nwhile True:\\n    rows = db.query('SELECT * FROM outbox WHERE published=false LIMIT 100')\\n    for row in rows:\\n        kafka.publish(row.event, row.payload)\\n        db.mark_published(row.id)\\n    sleep(0.5)", "frames": [ { "line": 2, "vars": { "order_id": 42, "status": "paid" }, "note": "Begin local transaction — both writes will be atomic" }, { "line": 3, "vars": { "orders.42.status": "paid" }, "note": "Order row updated in DB — not visible yet (inside transaction)" }, { "line": 4, "vars": { "outbox": "1 new row: {event: 'order.paid', id: 42, published: false}" }, "note": "Outbox row inserted in same transaction — still not committed" }, { "line": 5, "vars": { "committed": true }, "note": "Transaction commits. Both rows are now durable. Even a crash here is safe — relay will find the unpublished row." }, { "line": 9, "vars": { "rows": "[{id:1, event:'order.paid', payload:{id:42}}]" }, "note": "Relay wakes up, finds 1 unpublished row in outbox" }, { "line": 11, "vars": { "kafka": "order.paid event published" }, "note": "Event published to Kafka. If Kafka is down, this throws — relay retries the whole batch" }, { "line": 12, "vars": { "outbox.1.published": true }, "note": "Row marked published. Relay will not process it again." } ], "speed": 900 }
\`\`\`

---

## Choosing the Right Approach

\`\`\`tabs
{ "tabs": [ { "label": "Use 2PC When...", "icon": "🔒", "content": "- You need **strong consistency** across databases (not application services)\\n- Operations are **short-lived** (milliseconds, not minutes)\\n- You're working within a distributed database that supports it natively (Spanner, CockroachDB, YugabyteDB)\\n- Both participants speak the **XA protocol**\\n- You can accept lower availability and some performance overhead\\n\\n> In practice: 2PC is almost exclusively used **inside** distributed databases, not between application-level microservices." }, { "label": "Use Saga When...", "icon": "⛓️", "content": "- You're coordinating across **microservices** with independent databases\\n- Operations may be **long-running** (waiting for external APIs, payment providers, human approval)\\n- You need **high availability** and can tolerate eventual consistency\\n- You want each service to remain **independently deployable**\\n- You can design meaningful compensating transactions\\n\\n> In practice: Sagas are the default choice for microservices architectures. Most modern systems use the Outbox pattern alongside Sagas." }, { "label": "Use Outbox When...", "icon": "📬", "content": "- You need to **atomically update a DB and publish an event**\\n- You're implementing Saga steps that trigger via events\\n- You want **at-least-once delivery** without a distributed transaction\\n- You need **audit logs** of all published events\\n\\n> In practice: The Outbox pattern is almost always used **alongside** Sagas. Sagas describe the flow; the Outbox ensures each step's event is reliably published." } ] }
\`\`\`

---

\`\`\`callout
{ "type": "tip", "title": "Best Practices from Production Systems", "content": "**1. Minimize scope**: Use local transactions wherever possible. Only introduce distributed coordination when truly necessary.\\n\\n**2. Make compensations idempotent**: A compensation might be called more than once if the saga retries. Ensure refund(orderId) applied twice has the same effect as applied once.\\n\\n**3. Store saga state**: Persist the current step and status of each saga execution. Without this, recovering from coordinator crashes is guesswork.\\n\\n**4. Add a dead-letter queue**: Failed compensations need human intervention. Route them to a DLQ with alerting.\\n\\n**5. Use chaos engineering**: Simulate crashes mid-saga, Kafka downtime, and double-publishes to validate your compensations and outbox relay actually work." }
\`\`\`

---

## Practice: Fill in the Gaps

\`\`\`fillblank
{ "title": "Complete the Outbox Insert", "prompt": "In the Outbox pattern, both the entity update and the event row must be written inside the same ___. The relay worker marks rows ___ after publishing to avoid re-processing.", "language": "python", "template": "with db.___():\\n    db.execute(\\"UPDATE orders SET status='paid' WHERE id=?\\", order_id)\\n    db.execute(\\"INSERT INTO outbox (event_type, payload, ___) VALUES (?, ?, false)\\",\\n               'order.paid', payload)\\n\\n# Relay:\\ndb.execute(\\"UPDATE outbox SET ___ = true WHERE id=?\\", row_id)", "blanks": [ { "answer": "transaction", "hint": "The key word that makes both writes atomic" }, { "answer": "published", "hint": "The boolean column tracking relay status" }, { "answer": "published", "hint": "Column name for the INSERT default value" }, { "answer": "published", "hint": "Set this to true after publishing to Kafka" } ] }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Distributed Transactions", "questions": [ { "question": "What is the 'blocking problem' in Two-Phase Commit?", "options": [ "The coordinator sends too many messages, blocking the network", "Participants hold locks indefinitely if the coordinator crashes after PREPARE but before COMMIT", "Participants cannot prepare if another participant is currently writing", "The database blocks all reads during the prepare phase" ], "answer": 1, "explanation": "After voting YES in Phase 1, participants hold locks and cannot proceed without the coordinator's final decision. If the coordinator crashes at this point, participants are stuck in an uncertain state — they cannot commit or rollback until the coordinator recovers." }, { "question": "Which of these is a compensating transaction for 'charge customer $49.99'?", "options": [ "Rollback the charge in the payment database", "Delete the payment record from the table", "Issue a refund of $49.99 to the customer", "Cancel the entire saga and restart from scratch" ], "answer": 2, "explanation": "A compensating transaction is a new forward action that reverses the business effect — not a database rollback. You cannot 'un-charge' a credit card, but you can issue a refund. This is why compensations are domain-specific business logic, not database operations." }, { "question": "Why does the Outbox Pattern require consumers to deduplicate events?", "options": [ "Because the outbox worker uses eventual consistency and may skip events", "Because the relay worker provides at-least-once delivery and may publish the same event more than once on retry", "Because Kafka doesn't support exactly-once delivery at all", "Because events are published before the database transaction commits" ], "answer": 1, "explanation": "The outbox relay worker can crash after publishing an event but before marking it as published. On restart, it will publish the same event again. This gives at-least-once delivery. Consumers must deduplicate using the event ID to achieve idempotent processing." }, { "question": "You're building an e-commerce platform with separate Order, Payment, and Inventory microservices. Which approach is most appropriate?", "options": [ "Two-Phase Commit across all three services using XA protocol", "A single monolithic database shared by all three services", "Saga pattern with Outbox pattern for event publishing", "Three-Phase Commit (3PC) to eliminate the blocking problem" ], "answer": 2, "explanation": "Sagas are the standard choice for coordinating across microservices with independent databases. Each service performs a local transaction and publishes an event. The Outbox pattern ensures events are reliably published without a distributed transaction. 2PC/3PC are poor fits for application-level microservices due to blocking, lock contention, and tight coupling." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "2PC provides strong consistency but is a blocking protocol — coordinator failure leaves participants holding locks indefinitely. Use it inside distributed databases (Spanner, CockroachDB), not between application services.", "The Saga pattern breaks a distributed transaction into local transactions + compensating transactions. Compensations are new forward business actions (refund), not database rollbacks.", "Choreography-based Sagas use events (loose coupling, hard to debug); orchestration-based Sagas use a central coordinator (visible state, easier to trace).", "The dual-write problem: you cannot atomically update a database AND publish an event without the Outbox Pattern. Write both entity and event in one local transaction; let a relay worker publish.", "In microservices architectures, Sagas + Outbox is the dominant pattern. 2PC is reserved for distributed databases. Compensations must be idempotent and resilient to failure." ] }
\`\`\``,
      starterCode: `# Distributed Transactions: Saga Pattern + Transactional Outbox
#
# In this exercise you will implement a simplified e-commerce order flow
# using the Saga pattern (choreography style) and the Transactional Outbox
# pattern to guarantee reliable event publishing.
#
# Scenario:
#   1. Reserve inventory
#   2. Charge payment
#   3. Confirm order
# If any step fails, compensating transactions must roll back prior steps.

from dataclasses import dataclass, field
from typing import List, Optional
import uuid

# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------

@dataclass
class OutboxEvent:
    event_id: str
    event_type: str   # e.g. "INVENTORY_RESERVED", "PAYMENT_CHARGED"
    payload: dict
    published: bool = False

@dataclass
class OrderState:
    order_id: str
    status: str = "PENDING"          # PENDING | COMPLETED | COMPENSATED
    inventory_reserved: bool = False
    payment_charged: bool = False
    outbox: List[OutboxEvent] = field(default_factory=list)

# ---------------------------------------------------------------------------
# Simulated external services (do NOT modify these)
# ---------------------------------------------------------------------------

class InventoryService:
    def __init__(self, stock: int):
        self._stock = stock

    def reserve(self, order_id: str, qty: int) -> bool:
        if self._stock >= qty:
            self._stock -= qty
            return True
        return False

    def release(self, order_id: str, qty: int):
        self._stock += qty

class PaymentService:
    def __init__(self, should_fail: bool = False):
        self._should_fail = should_fail

    def charge(self, order_id: str, amount: float) -> bool:
        return not self._should_fail

    def refund(self, order_id: str, amount: float):
        pass  # compensating action

# ---------------------------------------------------------------------------
# TODO 1: Implement append_outbox_event
#
# Write a helper that creates an OutboxEvent (with a fresh uuid) and appends
# it to state.outbox.  The event must NOT be marked published yet.
# This simulates writing the event atomically with the local DB write.
# ---------------------------------------------------------------------------

def append_outbox_event(state: OrderState, event_type: str, payload: dict):
    # TODO: create an OutboxEvent and append it to state.outbox
    pass

# ---------------------------------------------------------------------------
# TODO 2: Implement the Saga steps
#
# saga_reserve_inventory:
#   - Call inventory.reserve(order_id, qty)
#   - On SUCCESS: set state.inventory_reserved = True,
#                 append event "INVENTORY_RESERVED" with {"qty": qty}
#                 return True
#   - On FAILURE: return False (no compensation needed yet)
#
# saga_charge_payment:
#   - Call payment.charge(order_id, amount)
#   - On SUCCESS: set state.payment_charged = True,
#                 append event "PAYMENT_CHARGED" with {"amount": amount}
#                 return True
#   - On FAILURE: compensate — call inventory.release(order_id, qty),
#                 set state.inventory_reserved = False,
#                 append event "INVENTORY_RELEASED" with {"qty": qty, "reason": "payment_failed"}
#                 return False
# ---------------------------------------------------------------------------

def saga_reserve_inventory(
    state: OrderState,
    inventory: InventoryService,
    qty: int,
) -> bool:
    # TODO
    pass

def saga_charge_payment(
    state: OrderState,
    inventory: InventoryService,
    payment: PaymentService,
    qty: int,
    amount: float,
) -> bool:
    # TODO
    pass

# ---------------------------------------------------------------------------
# TODO 3: Implement publish_outbox_events
#
# Iterate over state.outbox and for each event where published == False:
#   - Print: f"[MESSAGE BUS] Publishing: {event.event_type} ({event.event_id})"
#   - Mark event.published = True
#
# This simulates a background relay process (the "outbox poller") that
# reads unpublished rows and delivers them to the message broker.
# ---------------------------------------------------------------------------

def publish_outbox_events(state: OrderState):
    # TODO
    pass

# ---------------------------------------------------------------------------
# Saga orchestrator — wire the steps together (do NOT modify)
# ---------------------------------------------------------------------------

def run_order_saga(
    inventory: InventoryService,
    payment: PaymentService,
    qty: int = 2,
    amount: float = 49.99,
) -> OrderState:
    state = OrderState(order_id=str(uuid.uuid4())[:8])
    print(f"\\n=== Starting Saga for order {state.order_id} ===")

    if not saga_reserve_inventory(state, inventory, qty):
        state.status = "COMPENSATED"
        print("Saga aborted: inventory unavailable")
    elif not saga_charge_payment(state, inventory, payment, qty, amount):
        state.status = "COMPENSATED"
        print("Saga aborted: payment failed — inventory compensation applied")
    else:
        state.status = "COMPLETED"
        append_outbox_event(state, "ORDER_CONFIRMED", {"order_id": state.order_id})
        print("Saga completed successfully")

    publish_outbox_events(state)
    return state

# ---------------------------------------------------------------------------
# Tests — run this file to verify your implementation
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Test 1: Happy path
    inv = InventoryService(stock=10)
    pay = PaymentService(should_fail=False)
    s = run_order_saga(inv, pay)
    assert s.status == "COMPLETED", "Expected COMPLETED"
    assert s.inventory_reserved
    assert s.payment_charged
    published = [e.event_type for e in s.outbox if e.published]
    assert "INVENTORY_RESERVED" in published
    assert "PAYMENT_CHARGED" in published
    assert "ORDER_CONFIRMED" in published
    print("Test 1 PASSED\\n")

    # Test 2: Payment failure triggers compensation
    inv2 = InventoryService(stock=10)
    pay2 = PaymentService(should_fail=True)
    s2 = run_order_saga(inv2, pay2)
    assert s2.status == "COMPENSATED", "Expected COMPENSATED"
    assert not s2.inventory_reserved, "Inventory should be released after compensation"
    published2 = [e.event_type for e in s2.outbox if e.published]
    assert "INVENTORY_RELEASED" in published2
    print("Test 2 PASSED\\n")

    # Test 3: Inventory unavailable — saga aborts immediately
    inv3 = InventoryService(stock=0)
    pay3 = PaymentService(should_fail=False)
    s3 = run_order_saga(inv3, pay3, qty=2)
    assert s3.status == "COMPENSATED"
    assert not s3.inventory_reserved
    print("Test 3 PASSED\\n")

    print("All tests passed!")
`,
      solutionCode: `# Distributed Transactions: Saga Pattern + Transactional Outbox
# SOLUTION

from dataclasses import dataclass, field
from typing import List
import uuid

# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------

@dataclass
class OutboxEvent:
    event_id: str
    event_type: str
    payload: dict
    published: bool = False

@dataclass
class OrderState:
    order_id: str
    status: str = "PENDING"
    inventory_reserved: bool = False
    payment_charged: bool = False
    outbox: List[OutboxEvent] = field(default_factory=list)

# ---------------------------------------------------------------------------
# Simulated external services
# ---------------------------------------------------------------------------

class InventoryService:
    def __init__(self, stock: int):
        self._stock = stock

    def reserve(self, order_id: str, qty: int) -> bool:
        if self._stock >= qty:
            self._stock -= qty
            return True
        return False

    def release(self, order_id: str, qty: int):
        self._stock += qty

class PaymentService:
    def __init__(self, should_fail: bool = False):
        self._should_fail = should_fail

    def charge(self, order_id: str, amount: float) -> bool:
        return not self._should_fail

    def refund(self, order_id: str, amount: float):
        pass

# ---------------------------------------------------------------------------
# Outbox helper
#
# Key insight: in a real system this write happens in the SAME database
# transaction as the local state change.  That atomicity guarantee is what
# makes the Outbox pattern safe — the event is never lost even if the
# process crashes before it can publish to the message broker.
# ---------------------------------------------------------------------------

def append_outbox_event(state: OrderState, event_type: str, payload: dict):
    event = OutboxEvent(
        event_id=str(uuid.uuid4()),
        event_type=event_type,
        payload=payload,
        published=False,   # poller will set this to True after delivery
    )
    state.outbox.append(event)

# ---------------------------------------------------------------------------
# Saga step 1: Reserve inventory
#
# This is the first participant in the saga.  It either succeeds and records
# a domain event in the outbox, or fails cleanly — no compensation needed
# because nothing has been changed yet.
# ---------------------------------------------------------------------------

def saga_reserve_inventory(
    state: OrderState,
    inventory: InventoryService,
    qty: int,
) -> bool:
    success = inventory.reserve(state.order_id, qty)
    if success:
        state.inventory_reserved = True
        # Write domain event atomically with the state change (outbox pattern)
        append_outbox_event(state, "INVENTORY_RESERVED", {"qty": qty})
    return success

# ---------------------------------------------------------------------------
# Saga step 2: Charge payment
#
# If payment fails we must run the COMPENSATING TRANSACTION for step 1
# (release the reserved inventory).  This is the core of the Saga pattern:
# instead of a distributed rollback (2PC), each step defines its own undo.
#
# Why not 2PC?
#  - 2PC requires all participants to hold locks until the coordinator
#    confirms commit or abort — terrible for long-running flows and
#    unavailable external services.
#  - Sagas trade atomicity for availability: each step commits locally
#    and compensations handle failures asynchronously.
# ---------------------------------------------------------------------------

def saga_charge_payment(
    state: OrderState,
    inventory: InventoryService,
    payment: PaymentService,
    qty: int,
    amount: float,
) -> bool:
    success = payment.charge(state.order_id, amount)
    if success:
        state.payment_charged = True
        append_outbox_event(state, "PAYMENT_CHARGED", {"amount": amount})
    else:
        # Compensate step 1: release the inventory we already reserved
        inventory.release(state.order_id, qty)
        state.inventory_reserved = False
        # Record the compensation event in the outbox so downstream
        # services (e.g. notification service) can react accordingly
        append_outbox_event(
            state,
            "INVENTORY_RELEASED",
            {"qty": qty, "reason": "payment_failed"},
        )
    return success

# ---------------------------------------------------------------------------
# Outbox poller simulation
#
# In production this is a separate process (or scheduled job) that:
#   1. SELECT ... WHERE published = FALSE FOR UPDATE
#   2. Publishes each event to the message broker
#   3. UPDATE ... SET published = TRUE
# Using at-least-once delivery; consumers must be idempotent.
# ---------------------------------------------------------------------------

def publish_outbox_events(state: OrderState):
    for event in state.outbox:
        if not event.published:
            print(f"[MESSAGE BUS] Publishing: {event.event_type} ({event.event_id})")
            event.published = True

# ---------------------------------------------------------------------------
# Saga orchestrator
# ---------------------------------------------------------------------------

def run_order_saga(
    inventory: InventoryService,
    payment: PaymentService,
    qty: int = 2,
    amount: float = 49.99,
) -> OrderState:
    state = OrderState(order_id=str(uuid.uuid4())[:8])
    print(f"\\n=== Starting Saga for order {state.order_id} ===")

    if not saga_reserve_inventory(state, inventory, qty):
        state.status = "COMPENSATED"
        print("Saga aborted: inventory unavailable")
    elif not saga_charge_payment(state, inventory, payment, qty, amount):
        state.status = "COMPENSATED"
        print("Saga aborted: payment failed — inventory compensation applied")
    else:
        state.status = "COMPLETED"
        append_outbox_event(state, "ORDER_CONFIRMED", {"order_id": state.order_id})
        print("Saga completed successfully")

    publish_outbox_events(state)
    return state

# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Test 1: Happy path
    inv = InventoryService(stock=10)
    pay = PaymentService(should_fail=False)
    s = run_order_saga(inv, pay)
    assert s.status == "COMPLETED"
    assert s.inventory_reserved
    assert s.payment_charged
    published = [e.event_type for e in s.outbox if e.published]
    assert "INVENTORY_RESERVED" in published
    assert "PAYMENT_CHARGED" in published
    assert "ORDER_CONFIRMED" in published
    print("Test 1 PASSED\\n")

    # Test 2: Payment failure triggers compensation
    inv2 = InventoryService(stock=10)
    pay2 = PaymentService(should_fail=True)
    s2 = run_order_saga(inv2, pay2)
    assert s2.status == "COMPENSATED"
    assert not s2.inventory_reserved
    published2 = [e.event_type for e in s2.outbox if e.published]
    assert "INVENTORY_RELEASED" in published2
    print("Test 2 PASSED\\n")

    # Test 3: Inventory unavailable
    inv3 = InventoryService(stock=0)
    pay3 = PaymentService(should_fail=False)
    s3 = run_order_saga(inv3, pay3, qty=2)
    assert s3.status == "COMPENSATED"
    assert not s3.inventory_reserved
    print("Test 3 PASSED\\n")

    print("All tests passed!")
`,
    },
    {
      id: "failure-modes-and-fault-tolerance",
      slug: "failure-modes-and-fault-tolerance",
      title: "Failure Modes: Crash, Byzantine, and Network Partitions",
      content: `# Failure Modes: Crash, Byzantine, and Network Partitions

When you design a distributed system, you are not designing for the world as it should work — you are designing for the world as it actually fails. Nodes crash. Messages disappear. Adversaries lie. The engineers who built Google Spanner, Amazon DynamoDB, and the Bitcoin network all had to answer the same foundational question: **what exactly can go wrong, and what are we willing to tolerate?**

This lesson gives you a rigorous taxonomy of distributed failure modes and the defences that production systems use against each class.

---

## The Failure Mode Hierarchy

Before diving into each class, it helps to see how they relate. Failure modes form a **severity hierarchy** — more severe modes subsume less severe ones.

\`\`\`concept
{
  "title": "The Fault Containment Principle",
  "variant": "mental-model",
  "content": "Every failure mode is a specialisation of the one above it. A crash is a special case of omission (omitting all future messages). Omission is a special case of performance failure (infinitely late delivery). Byzantine failure is the most general — a Byzantine node can exhibit any behaviour, including all the others. Design your defences from the top down: if you can tolerate Byzantine faults, you tolerate everything below."
}
\`\`\`

Here is the full hierarchy from least severe to most severe:

| Severity | Mode | Node behaviour |
|---|---|---|
| 1 (mildest) | **Fail-stop** | Halts; survivors can detect the halt |
| 2 | **Crash (fail-silent)** | Halts; no notification to peers |
| 3 | **Crash-recover** | Halts, then restarts with potentially stale state |
| 4 | **Omission** | Selectively drops messages (send, receive, or both) |
| 5 | **Performance** | Delivers correct values at wrong times |
| 6 (severest) | **Byzantine** | Sends arbitrary, contradictory, or forged messages |

---

## Crash Failures

A **crash failure** is the most common and most benign failure you will encounter. The node stops responding and stays stopped. No more messages, no incorrect answers — just silence.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Fail-Stop",
      "icon": "🛑",
      "content": "**Definition:** The node halts AND makes its halt detectable.\\n\\nThis is the *ideal* crash model. Survivors can query a failure detector and receive a definitive answer: \\"Node 3 is dead.\\" Consensus algorithms like Viewstamped Replication assume fail-stop because it simplifies leader election — you never wonder if a slow node is actually crashed.\\n\\n**Real-world approximation:** Zookeeper ephemeral nodes expire when the session dies, giving other nodes a near-immediate signal that the owner crashed.\\n\\n**Defence:** Replication + automatic failover. Replace the dead node or promote a replica."
    },
    {
      "label": "Fail-Silent",
      "icon": "🔇",
      "content": "**Definition:** The node halts WITHOUT notification. Survivors must infer failure via timeout.\\n\\nThis is the realistic crash model. A server that loses power cannot send a \\"goodbye\\" packet. The only evidence is absence of heartbeats.\\n\\n**The timeout dilemma:** In asynchronous networks, you cannot distinguish a crashed node from a very slow one. Set your timeout too short → false positives, premature failover. Too long → availability suffers during a real outage.\\n\\n**Defence:** Gossip-based failure detectors (Phi Accrual Detector used by Cassandra, Akka). Instead of a binary dead/alive signal, they output a *suspicion level* that grows with missed heartbeats — letting callers tune their own threshold."
    },
    {
      "label": "Crash-Recover",
      "icon": "🔄",
      "content": "**Definition:** The node crashes but later restarts. It may have stale or incomplete state.\\n\\nThis is the trickiest crash subtype. A recovered node that missed updates while offline can corrupt the system if it rejoins and sends stale data confidently.\\n\\n**Amazon's lesson:** During AWS us-east-1 outages, recovered nodes sometimes rejoined DynamoDB rings with outdated membership tables, causing routing loops until they completed state sync.\\n\\n**Defence:**\\n1. **Write-ahead log (WAL):** persist every mutation before acknowledging it so the node can replay missed operations on restart.\\n2. **Anti-entropy:** recovered nodes run a Merkle-tree comparison against peers to discover and fill gaps before serving traffic."
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "info",
  "title": "Why crash failures are 'easy'",
  "content": "Crashed nodes are honest — they never lie. They simply stop contributing. This means **f+1 replicas** survive any single crash, and **2f+1 replicas** can tolerate f simultaneous crashes with a majority quorum. Compare this to Byzantine faults, which need 3f+1 replicas. Crash fault tolerance is roughly twice as cheap."
}
\`\`\`

---

## Omission Failures

Omission failures are the silent failure you often overlook. The node is **alive** but selectively failing to send or receive messages.

\`\`\`steps
{
  "title": "Three Flavours of Omission",
  "steps": [
    {
      "title": "Send-omission",
      "content": "The node processes requests internally but fails to transmit the response. From the caller's perspective, the request timed out — but from the node's perspective, the work was done.\\n\\n**Cause:** Network interface card (NIC) buffer overflow under high load, or a kernel bug that drops outbound packets silently.\\n\\n**Why it's dangerous:** Idempotency breaks. The server committed a database write but the client never got the ACK. When the client retries, the operation executes twice unless the server implements idempotency keys."
    },
    {
      "title": "Receive-omission",
      "content": "The node fails to accept inbound messages even though the sender transmitted them.\\n\\n**Cause:** GC pause blocking the message-processing thread. Amazon and Google production post-mortems document GC pauses blocking message receipt for **hundreds of milliseconds** — enough to miss an entire heartbeat window and appear crashed.\\n\\n**Defence:** Off-heap memory management (Java DirectByteBuffer, Netty), GC tuning with low-pause collectors (ZGC, Shenandoah), or switching to languages without GC (Go, Rust, C++)."
    },
    {
      "title": "General omission",
      "content": "Both send and receive paths affected — the node is partially isolated from the network.\\n\\n**Cause:** Asymmetric routing failures, congested middle-box dropping packets in one direction, or a misconfigured iptables rule that blocks a specific port.\\n\\n**Real-world pattern:** A load balancer marks a node healthy (it responded to the health-check endpoint) but a firewall change blocks the data-plane port. Traffic is routed to the node; the node drops it all.\\n\\n**Defence:** Application-level end-to-end health checks that exercise the full data path, not just the control-plane endpoint."
    }
  ]
}
\`\`\`

---

## Byzantine Failures

Byzantine failures are the most severe class. A Byzantine node is not merely absent — it is **actively wrong in an inconsistent way**. Different peers see different things from the same node.

\`\`\`concept
{
  "title": "The Byzantine Generals Problem",
  "variant": "analogy",
  "content": "Imagine several army generals surrounding a city, communicating only by messenger. Some generals are traitors who send conflicting orders — 'attack' to some, 'retreat' to others. The loyal generals must still reach consensus on a single plan.\\n\\nIn a distributed system, generals are nodes, messengers are network packets, and traitors are Byzantine nodes. The key insight: if you have **3f+1 total nodes**, you can tolerate f Byzantine traitors and still reach correct consensus. With fewer nodes, a coordinated minority can prevent or corrupt agreement."
}
\`\`\`

### What causes Byzantine behaviour in practice?

The two root causes are fundamentally different:

**1. Accidental Byzantine faults (bugs)**
- Memory corruption flipping a bit in a stored value
- Race conditions causing a node to send one value to some peers and a different value to others before state converges
- Incorrect state machine implementations that produce contradictory outputs depending on message ordering

**2. Adversarial Byzantine faults (attacks)**
- A node whose software has been modified by an attacker can behave in any way the attacker chooses
- The attacker might selectively mislead some peers while appearing honest to others — for example, convincing half the network that a transaction was committed while telling the other half it was aborted

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Authenticated Byzantine",
      "icon": "🔐",
      "content": "A weaker Byzantine variant where nodes cannot **forge** messages from other nodes — cryptographic signatures prevent impersonation.\\n\\nA node can still lie about its own state (send \`true\` to some, \`false\` to others), but it cannot claim 'Node A said X' when Node A didn't.\\n\\n**Used in:** PBFT (Practical Byzantine Fault Tolerance), Tendermint. Message authentication codes (MACs) or threshold signatures bound each message to its originating node.\\n\\n**Why it matters:** Authenticated Byzantine faults require 3f+1 nodes for safety, same as general Byzantine — but the protocol is simpler and faster because forgery attacks are eliminated."
    },
    {
      "label": "Unauthenticated Byzantine",
      "icon": "😈",
      "content": "The full adversarial model: Byzantine nodes can forge messages, replay old messages, and selectively delay messages to maximize confusion.\\n\\nThis is the threat model for permissionless blockchains where participants are anonymous and economically motivated to cheat.\\n\\n**Defences:**\\n- **Cryptographic message authentication:** every message signed with the sender's private key\\n- **Threshold signatures:** consensus output requires signatures from 2f+1 distinct keys\\n- **Proof-of-work / Proof-of-stake:** make Byzantine behaviour economically costly (Nakamoto consensus, Ethereum PoS slashing)"
    },
    {
      "label": "Real Examples",
      "icon": "📋",
      "content": "**Bitcoin (2010, value overflow bug):** A memory corruption bug caused a node to create 184 billion BTC out of thin air. Honest nodes rejected the block but the corrupted chain briefly forked — accidental Byzantine behaviour.\\n\\n**Amazon DynamoDB (2012):** A software defect caused nodes to return different versions of the same key to different clients during a rolling deployment — inconsistent reads that looked Byzantine to callers.\\n\\n**Space applications:** Radiation-induced bit flips in RAM cause Byzantine behaviour in spacecraft control systems. NASA uses triple modular redundancy (TMR) — three independent processors vote on every output — to handle this."
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Byzantine fault tolerance is expensive",
  "content": "Tolerating f Byzantine faults requires **3f+1** replicas and significantly more message rounds than crash-fault-tolerant protocols (which need only 2f+1). PBFT has O(n²) message complexity per consensus round. Most production systems — databases, distributed locks, queues — use crash-fault-tolerant protocols and rely on perimeter security to prevent Byzantine actors from reaching the cluster at all."
}
\`\`\`

---

## Network Partitions

A **network partition** is not a node failure — the nodes are alive, healthy, and executing code. The network that connects them has split into isolated groups that cannot communicate.

\`\`\`sysdiag
{
  "title": "Network Partition: Two Halves of a Split Cluster",
  "width": 620,
  "height": 300,
  "nodes": [
    { "id": "n1", "label": "Node 1", "x": 80, "y": 150, "kind": "service" },
    { "id": "n2", "label": "Node 2", "x": 200, "y": 80, "kind": "service" },
    { "id": "n3", "label": "Node 3", "x": 200, "y": 220, "kind": "service" },
    { "id": "n4", "label": "Node 4", "x": 420, "y": 80, "kind": "service" },
    { "id": "n5", "label": "Node 5", "x": 420, "y": 220, "kind": "service" },
    { "id": "n6", "label": "Node 6", "x": 540, "y": 150, "kind": "service" },
    { "id": "wall", "label": "⚡ Partition", "x": 310, "y": 150, "kind": "external" }
  ],
  "edges": [
    { "from": "n1", "to": "n2", "label": "" },
    { "from": "n1", "to": "n3", "label": "" },
    { "from": "n2", "to": "n3", "label": "" },
    { "from": "n4", "to": "n5", "label": "" },
    { "from": "n4", "to": "n6", "label": "" },
    { "from": "n5", "to": "n6", "label": "" }
  ],
  "annotations": {
    "wall": "Network link severed — nodes on each side are alive but cannot reach each other. Each side may independently elect a leader.",
    "n2": "Majority partition (3 nodes) — can safely accept writes if using quorum of 2",
    "n5": "Minority partition (3 nodes) — must reject writes to prevent split-brain"
  }
}
\`\`\`

### The Split-Brain Problem

When a partition divides a cluster, each side faces an identical question: **am I the majority, or the minority?** If both sides believe they are the majority and accept writes, the system produces two diverging histories — a **split-brain**.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Split-brain (dangerous)",
    "code": "Partition occurs. Both halves have 3 nodes.\\nBoth halves elect a leader.\\nBoth halves accept writes.\\nPartition heals.\\nConflicting writes — last-write-wins\\ndiscards data silently."
  },
  "after": {
    "label": "Quorum-protected (safe)",
    "code": "Partition occurs. Cluster has 5 nodes total.\\nMajority side (3 nodes) elects leader, accepts writes.\\nMinority side (2 nodes) detects it lacks quorum.\\nMinority side rejects all writes, returns error.\\nPartition heals. No conflicting writes to reconcile."
  }
}
\`\`\`

### Defences Against Partitions

**1. Majority quorum reads and writes**
A write succeeds only if acknowledged by more than half the cluster. Because any two majorities overlap by at least one node, the system cannot have two accepted values simultaneously. This is the mechanism behind Raft, Paxos, and Zookeeper's ZAB protocol.

**2. Fencing tokens**
When a new leader is elected after a partition heals, it is issued a monotonically increasing fencing token. Any write to shared storage must include the current token. Storage rejects writes carrying a stale token — preventing the old leader (which may still think it's primary) from overwriting the new leader's data.

**3. STONITH (Shoot The Other Node In The Head)**
In some clusters, the majority partition actively terminates the minority partition — forcing a power-cycle via IPMI/BMC out-of-band management. Brutal, but it guarantees the minority cannot make progress even if network traffic is partially flowing.

\`\`\`collapse
{
  "title": "Deep Dive: Why Partitions Are Unavoidable",
  "content": "The FLP Impossibility result (Fischer, Lynch, Paterson 1985) proved that in a fully asynchronous network, **no deterministic consensus algorithm can simultaneously guarantee safety, liveness, and tolerance of even a single crash**.\\n\\nThe CAP theorem (Brewer 2000, formalized by Gilbert & Lynch 2002) restates this for partitions: when a network partition occurs, you must choose between:\\n\\n- **Consistency (CP):** Reject requests on the minority partition. The system is correct but unavailable for some users.\\n- **Availability (AP):** Accept requests on all partitions. The system stays up but may return stale or conflicting data.\\n\\nNo production system operates permanently in one camp. HBase, Zookeeper, and etcd choose CP. Cassandra and DynamoDB offer tunable consistency — defaulting to AP but allowing CP for specific operations via quorum reads.\\n\\nThe practical takeaway: **design for partition tolerance first**, then decide your consistency/availability trade-off per operation, not per system."
}
\`\`\`

---

## Comparing the Three Classes

| | Crash | Omission | Byzantine | Partition |
|---|---|---|---|---|
| **Node alive?** | No | Yes | Yes | Yes |
| **Messages honest?** | N/A | Absent | Inconsistent | Absent |
| **Detectable?** | Via timeout | Via timeout | Hard | Via timeout |
| **Replicas needed** | 2f+1 | 2f+1 | 3f+1 | Majority quorum |
| **Primary defence** | Replication + failover | Idempotency + retry | Cryptographic auth + BFT | Quorum + fencing |
| **Examples** | Server power loss | GC pause drops packets | Memory corruption, adversarial node | Network switch failure |

---

## Knowledge Check

\`\`\`quiz
{
  "title": "Failure Modes: Test Your Understanding",
  "questions": [
    {
      "question": "A Cassandra node experiences a 400ms stop-the-world GC pause. During this window it fails to respond to heartbeats and its peers time it out, briefly removing it from the ring. What failure class best describes this event?",
      "options": [
        "Crash failure (fail-silent)",
        "Receive-omission failure",
        "Byzantine failure",
        "Fail-stop failure"
      ],
      "answer": 1,
      "explanation": "The node is alive and processing internally, but its GC pause blocks the thread that receives inbound messages — it cannot receive heartbeat requests. This is a receive-omission failure. It is not a crash because the node recovers when GC completes. It is not Byzantine because the node is not sending incorrect values."
    },
    {
      "question": "You are designing a consensus cluster to tolerate up to 2 simultaneously Byzantine nodes. What is the minimum number of nodes required?",
      "options": [
        "4 nodes (2f+1 = 5, but 4 is sufficient with an optimistic path)",
        "5 nodes (2f+1)",
        "7 nodes (3f+1)",
        "6 nodes (3f)"
      ],
      "answer": 2,
      "explanation": "Byzantine fault tolerant consensus requires 3f+1 nodes to tolerate f Byzantine failures. With f=2, you need 3×2+1 = 7 nodes. Compare to crash-fault tolerance, which only needs 2f+1 = 5 nodes for the same f=2 — Byzantine tolerance is roughly 40% more expensive in node count."
    },
    {
      "question": "After a network partition heals, a node that was on the minority side during the partition tries to write to the shared database using a fencing token it received before the partition. What should the database do?",
      "options": [
        "Accept the write — the partition has healed so it is safe",
        "Accept the write only if no conflicting write occurred during the partition",
        "Reject the write because the fencing token is stale compared to the new leader's token",
        "Buffer the write and apply it after a full state sync"
      ],
      "answer": 2,
      "explanation": "Fencing tokens are monotonically increasing. When the partition healed, the majority partition elected a new leader with a higher-numbered fencing token. Any storage system implementing fencing rejects writes with a lower token, preventing the stale minority leader from overwriting data written by the legitimate new leader during the partition."
    },
    {
      "question": "Which statement correctly describes the relationship between Byzantine and crash failure modes?",
      "options": [
        "They are orthogonal — a Byzantine node cannot also exhibit crash behaviour",
        "Crash failure is a special case of Byzantine failure — a Byzantine node can choose to crash",
        "Byzantine failure is a special case of crash failure — both involve nodes becoming unavailable",
        "They are equivalent in severity because both prevent consensus"
      ],
      "answer": 1,
      "explanation": "Byzantine failure is the most general failure mode. A Byzantine node can behave arbitrarily — including choosing to stop responding (crash behaviour). Crash failure is therefore a strict subset of Byzantine failure. This is why BFT protocols tolerate all failure modes below Byzantine in the hierarchy."
    },
    {
      "question": "A 5-node distributed database cluster experiences a network partition that creates a 3-node group and a 2-node group. Using a majority quorum protocol, what is the correct behaviour for the 2-node minority partition?",
      "options": [
        "Elect a new leader and accept writes, since both nodes agree",
        "Accept reads but reject writes to maintain availability",
        "Reject both reads and writes to prevent split-brain",
        "Accept writes only from clients that were already connected before the partition"
      ],
      "answer": 2,
      "explanation": "A 2-node group in a 5-node cluster cannot form a majority (majority = 3). Under a quorum protocol, the minority partition must reject all writes — and in strongly consistent systems, also reject reads — to prevent split-brain. If both partitions accepted writes, they would diverge. The 3-node majority partition can safely continue serving."
    }
  ]
}
\`\`\`

---

## Defences Summary

\`\`\`steps
{
  "title": "Choosing the Right Defence for Each Failure Class",
  "steps": [
    {
      "title": "Against crash failures: replicate and detect",
      "content": "- **Replication factor ≥ 3** with majority quorum writes\\n- **Gossip failure detector** (Phi Accrual) for probabilistic failure detection without false positives\\n- **Write-ahead log (WAL)** so crash-recover nodes replay missed operations on restart\\n- **Anti-entropy** (Merkle tree sync) to reconcile state after a node rejoins"
    },
    {
      "title": "Against omission failures: make operations idempotent",
      "content": "- **Idempotency keys** on every mutating API call — the server deduplicates retries\\n- **Sequence numbers / epochs** so receivers can detect and discard duplicate messages\\n- **Application-layer heartbeats** independent of TCP keepalive — validate the full message-processing path, not just the TCP connection\\n- **GC tuning / off-heap buffers** to eliminate receive-omission from GC pauses"
    },
    {
      "title": "Against Byzantine failures: authenticate and get a BFT quorum",
      "content": "- **Cryptographic message authentication** — every message signed with the sender's private key; reject unsigned or incorrectly-signed messages\\n- **BFT consensus protocol** (PBFT, Tendermint, HotStuff) — requires 3f+1 nodes and two voting rounds\\n- **Threshold signatures** — consensus output requires signatures from 2f+1 distinct keys, making forgery computationally infeasible\\n- For permissioned clusters: **perimeter security** (mTLS, network policies) to reduce Byzantine surface area so crash-fault tolerance suffices"
    },
    {
      "title": "Against network partitions: quorum + fencing",
      "content": "- **Majority quorum** — writes succeed only on 2f+1 acknowledgements; no minority partition can independently commit\\n- **Fencing tokens** — monotonically increasing token issued at each leader election; storage rejects stale tokens\\n- **Lease-based leadership** — leader periodically renews a time-bounded lease; steps down if renewal fails rather than operating on a possibly stale lease\\n- **PACELC trade-off decision** — explicitly choose CP (reject minority writes) or AP (serve potentially stale reads) per operation type"
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Failure modes form a severity hierarchy: fail-stop ⊂ crash ⊂ omission ⊂ performance ⊂ Byzantine. BFT protocols handle all modes below them.",
    "Crash failures are 'honest' — the node simply stops. Crash-fault-tolerant consensus needs 2f+1 replicas. Byzantine faults need 3f+1.",
    "Omission failures — especially from GC pauses — are often misdiagnosed as crashes. The node is alive; idempotency and application-layer heartbeats are the primary defence.",
    "Byzantine failures can be accidental (memory corruption, race conditions) or adversarial. Cryptographic message authentication eliminates forgery; BFT protocols handle inconsistent behaviour.",
    "Network partitions do not kill nodes — they isolate them. The split-brain hazard is two partitions independently accepting writes. Majority quorum and fencing tokens prevent divergence.",
    "No real system is purely CP or AP. Production systems like Cassandra and DynamoDB offer tunable consistency — choose per-operation, not per-system."
  ]
}
\`\`\``,
    },
    {
      id: "checkpoint-distributed-systems-quiz",
      slug: "checkpoint-distributed-systems-quiz",
      title: "Checkpoint: Distributed Systems Trade-off Quiz",
      content: `# Checkpoint: Distributed Systems Trade-off Quiz

This checkpoint tests your ability to *apply* the fundamentals — not just recall them. Each scenario mirrors the kind of open-ended trade-off reasoning you'll encounter in FAANG-style system design interviews. Read each situation carefully, reason through the constraints, then commit to an answer.

\`\`\`callout
{ "type": "info", "title": "How to use this checkpoint", "content": "Work through each question independently before revealing the explanation. The goal isn't a score — it's identifying which mental models you own versus which ones still feel fuzzy. Flag any question you guessed on and revisit the corresponding lesson." }
\`\`\`

---

## Before You Begin: A Trade-off Refresher

Every question in this checkpoint reduces to one of four core tensions. Anchor yourself here before diving in.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "CAP Triangle",
      "icon": "🔺",
      "content": "**You can guarantee at most two of three:**\\n\\n- **Consistency (C):** Every read returns the most recent write, or an error.\\n- **Availability (A):** Every request receives a (non-error) response — no guarantee it's the latest data.\\n- **Partition Tolerance (P):** The system continues operating despite network partitions.\\n\\n**Practical reality:** Partitions *will* happen. So the real choice is **CP vs AP** — do you prioritize correctness or uptime when nodes can't communicate?\\n\\n| System | Choice | Why |\\n|--------|--------|-----|\\n| HBase | CP | Financial/transactional data |\\n| Cassandra | AP | High-write, eventual-consistency ok |\\n| Zookeeper | CP | Coordination service — correctness is everything |"
    },
    {
      "label": "Consistency Levels",
      "icon": "📊",
      "content": "From strongest to weakest:\\n\\n1. **Linearizability** — Reads always reflect latest write. Feels like a single machine. Slowest.\\n2. **Sequential consistency** — All nodes see writes in the same order, but not necessarily real-time.\\n3. **Causal consistency** — Operations with a causal relationship are seen in order. Unrelated ops may diverge.\\n4. **Eventual consistency** — Given no new writes, all replicas *eventually* converge. Fastest, weakest guarantees.\\n5. **Read-your-writes** — You always see your own writes, even if other clients haven't yet.\\n\\n**Common interview question:** \\"Which consistency level does a social media feed need?\\" — Usually causal or eventual. Users care about seeing their own posts immediately (read-your-writes), but don't need global ordering."
    },
    {
      "label": "Quorum Math",
      "icon": "🧮",
      "content": "Given **N** replicas, you configure write quorum **W** and read quorum **R**:\\n\\n\`\`\`\\nStrong consistency:  W + R > N\\nWrite-heavy:         W = 1, R = N  (fast writes, slow reads)\\nRead-heavy:          W = N, R = 1  (slow writes, fast reads)\\nBalanced (typical):  W = R = (N+1)/2\\n\`\`\`\\n\\n**Example:** N=5 replicas\\n- W=3, R=3 → W+R=6 > 5 → **strong consistency** ✅\\n- W=1, R=3 → W+R=4 < 5 → **eventual consistency** ⚠️\\n- W=5, R=1 → strong consistency but writes block on all 5 nodes\\n\\n**The overlap guarantee:** At least one node in every read quorum has seen the latest write quorum response."
    },
    {
      "label": "Failure Modes",
      "icon": "💥",
      "content": "**Network partition** — Nodes can't talk. System must choose: reject requests (CP) or serve stale data (AP).\\n\\n**Split-brain** — Two nodes both believe they're the leader. Classic CP systems use fencing tokens or STONITH to prevent this.\\n\\n**Cascading failure** — One overloaded node causes others to receive its redirected traffic, causing them to fail too. Mitigation: circuit breakers, bulkheads, exponential backoff.\\n\\n**Byzantine fault** — A node behaves arbitrarily or maliciously (sends conflicting data to different peers). Requires **BFT consensus** (e.g., PBFT). Most internal datacenter systems assume non-Byzantine faults only.\\n\\n**Herd effect (thundering herd)** — Cache expires; thousands of requests simultaneously hit the DB. Mitigation: cache stampede locks, probabilistic early expiration (PER)."
    }
  ]
}
\`\`\`

---

## Section 1: CAP Theorem Applied

\`\`\`quiz
{
  "title": "CAP Scenarios",
  "questions": [
    {
      "question": "A ride-sharing app (like Uber) assigns drivers to riders. Two services in different data centers must agree on which driver is assigned to a given ride. During a network partition, what should the system prioritize?",
      "options": [
        "Availability — always return a driver assignment, even if it might be stale",
        "Consistency — reject assignment requests until the partition heals, preventing double-assignment",
        "Partition tolerance alone — ignore both C and A",
        "Neither — use a single global database with no replication"
      ],
      "answer": 1,
      "explanation": "Driver assignment is a coordination problem where double-assigning a driver to two riders is a business-breaking inconsistency. The system should be CP: reject or queue assignment requests during a partition rather than risk two services assigning the same driver. Uber's dispatch layer uses consistent hashing and leader election precisely to avoid this split-brain scenario. (Option D is tempting but a single DB is a single point of failure — it trades partition tolerance for false simplicity.)"
    },
    {
      "question": "A social media platform stores the number of 'likes' on a post. During a network partition between two data centers, what is the correct choice?",
      "options": [
        "CP — reject all like requests until partition heals to maintain an exact count",
        "AP — allow likes to be recorded locally and reconcile counts when the partition heals",
        "CP — use a distributed lock on every like operation",
        "AP — discard any likes made during the partition to avoid conflicts"
      ],
      "answer": 1,
      "explanation": "Like counts are a classic AP use case. Users don't need an exact real-time count — a post showing '10,243 likes' vs '10,241 likes' is functionally identical. The system should accept like operations in both partitions (AP) and use a CRDT (Conflict-free Replicated Data Type) like a G-Counter to merge counts automatically when the partition heals. Blocking all like writes during a partition (CP) would visibly degrade the user experience for a low-stakes operation."
    },
    {
      "question": "Zookeeper is described as a CP system. What happens when a Zookeeper cluster loses quorum (e.g., 2 of 5 nodes go down)?",
      "options": [
        "The remaining 3 nodes elect a new leader and continue serving reads and writes normally",
        "The cluster serves reads from the remaining nodes but rejects all writes",
        "The cluster stops accepting reads AND writes until quorum is restored",
        "The cluster switches to AP mode automatically to maintain availability"
      ],
      "answer": 2,
      "explanation": "Zookeeper chooses consistency over availability. When it loses quorum (needs a majority — 3 of 5 nodes — to form consensus), it stops serving ALL requests, including reads. This is intentional: Zookeeper is used for distributed coordination (leader election, service discovery, distributed locks). Serving stale coordination data would be worse than serving no data — a service might believe it holds a lock it no longer owns, causing correctness violations downstream."
    }
  ]
}
\`\`\`

---

## Section 2: Consistency Levels in Practice

\`\`\`concept
{ "title": "The Consistency Question You'll Always Be Asked", "variant": "rule", "content": "Interviewers don't want you to say 'use eventual consistency.' They want you to justify it. The right answer is always: 'Given that [user action] causes [harm X] if stale, and [harm Y] if unavailable, I choose [consistency level] because [harm X/Y] is acceptable in this context.'" }
\`\`\`

\`\`\`quiz
{
  "title": "Consistency Level Selection",
  "questions": [
    {
      "question": "A banking system processes fund transfers. User A transfers $500 to User B. Which consistency model is required for the balance reads immediately after the transfer?",
      "options": [
        "Eventual consistency — balances will sync within milliseconds",
        "Causal consistency — User A sees their deduction; User B sees their credit",
        "Linearizability — all reads immediately reflect the latest committed write",
        "Read-your-writes — each user only needs to see their own transactions"
      ],
      "answer": 2,
      "explanation": "Banking requires linearizability (the strongest consistency model). Consider the failure mode of weaker models: with eventual consistency, User A could read their balance as $500 (pre-deduction) and initiate another transfer — a double-spend. With causal consistency, the two-party ordering is preserved but a third-party observer (e.g., fraud detection) might see inconsistent state. Only linearizability guarantees that every read reflects the globally latest committed state, which is the correctness requirement for financial operations."
    },
    {
      "question": "A collaborative document editor (like Google Docs) allows multiple users to edit simultaneously. User A types 'Hello' and User B, editing concurrently, sees the document before User A's change syncs. What consistency model does this describe?",
      "options": [
        "Linearizability — all users see the same document state at all times",
        "Sequential consistency — all users see edits in the same order, with some lag",
        "Eventual consistency with CRDTs — edits merge automatically, final state converges",
        "Causal consistency — only causally related edits are ordered"
      ],
      "answer": 2,
      "explanation": "Google Docs uses Operational Transformation (OT) or CRDT-based eventual consistency. Users can diverge temporarily — User B doesn't immediately see User A's keystrokes — but the system guarantees convergence. The key insight is that document edits are a naturally mergeable operation (unlike bank balances). CRDTs model text edits as conflict-free operations (insert at position X, delete character Y) that can be applied in any order and still produce a consistent final document. This enables real-time collaborative editing without distributed locking."
    },
    {
      "question": "A user updates their profile picture on Instagram. Which consistency guarantee is most critical from a product perspective?",
      "options": [
        "Linearizability — all followers must immediately see the new picture",
        "Read-your-writes — the user must immediately see their own new picture",
        "Eventual consistency — the picture will propagate to all followers eventually",
        "Causal consistency — the new picture must appear before any new posts by the user"
      ],
      "answer": 1,
      "explanation": "This is the classic 'read-your-writes' scenario. The strongest product requirement is that the *user themselves* immediately sees their new profile picture — otherwise they'll think the update failed and repeat it. Followers seeing the old picture for a few seconds is acceptable (eventual consistency for external views), but the user must see their own change immediately. This is why Instagram's session stickiness or read-your-writes guarantees are scoped to the updating user's session, not globally enforced."
    }
  ]
}
\`\`\`

---

## Section 3: Quorum Reasoning

\`\`\`concept
{ "title": "Quorum as an Overlap Guarantee", "variant": "mental-model", "content": "Think of quorum not as 'majority voting' but as 'guaranteed overlap.' If W nodes must acknowledge a write, and R nodes must respond to a read, then W + R > N ensures at least one node in every read set has seen every write. That overlap node is the bridge between what was written and what is read." }
\`\`\`

\`\`\`quiz
{
  "title": "Quorum Calculations",
  "questions": [
    {
      "question": "A Cassandra cluster has N=5 replicas. The team configures W=2, R=2. A write succeeds on nodes 1 and 2. A subsequent read contacts nodes 3, 4, and 5. What is the result?",
      "options": [
        "The read returns the latest write because W + R = 4 < 5, so there's an overlap",
        "The read may return stale data because W + R = 4 < N = 5, so overlap is not guaranteed",
        "The read always returns the latest write because Cassandra uses read repair",
        "The system rejects the read because quorum is not achieved"
      ],
      "answer": 1,
      "explanation": "W + R = 2 + 2 = 4, which is NOT greater than N = 5. This means it's possible for a read quorum to not overlap with the write quorum — in this case, nodes {3,4,5} received the read but nodes {1,2} received the write, with zero overlap. The read will return stale data. For strong consistency, you need W + R > N, e.g., W=3, R=3 (sum=6 > 5). Cassandra's read repair is an eventual consistency mechanism that patches divergence lazily — it doesn't make W+R=4 configurations strongly consistent."
    },
    {
      "question": "A system architect wants to optimize for write-heavy workloads on a 7-node cluster while maintaining strong consistency. Which quorum configuration achieves this?",
      "options": [
        "W=1, R=7 — single-node writes, full-cluster reads",
        "W=4, R=4 — balanced quorum (W+R=8 > 7)",
        "W=7, R=1 — all-node writes, single-node reads",
        "W=2, R=6 — fast writes with strong read quorum"
      ],
      "answer": 3,
      "explanation": "W=7, R=1 satisfies W + R = 8 > 7 (strong consistency) while making writes acknowledge all 7 nodes. Wait — that's the *slowest* write configuration, not write-optimized. The correct write-heavy optimization is W=1, R=7 (option A) if you don't need strong consistency, OR W=4, R=4 (option B) for the minimal balanced strong consistency. Actually, option D (W=2, R=6, sum=8>7) gives fast writes with strong consistency guaranteed. For a write-heavy workload needing strong consistency, W=2 (lowest W that with R=6 still satisfies W+R>N) is the most write-optimized strongly-consistent choice. The key insight: minimize W while keeping W+R > N."
    },
    {
      "question": "DynamoDB's eventual consistency read costs half the throughput units of a strongly consistent read. A team is building a shopping cart service. Which read mode should they use for cart contents?",
      "options": [
        "Strong consistency — the cart must always show the exact current state to prevent checkout errors",
        "Eventual consistency — cart reads are frequent and low-stakes; minor staleness is acceptable",
        "Strong consistency only at checkout; eventual consistency during browsing",
        "Eventual consistency always, with client-side optimistic updates to hide staleness"
      ],
      "answer": 2,
      "explanation": "Option C (strong at checkout, eventual during browsing) is the correct production pattern used by Amazon itself. Cart browsing is high-frequency and low-stakes — a user seeing an item momentarily appear twice due to eventual consistency is a minor UX issue. But at checkout, you need strong consistency to get the authoritative cart state before initiating payment. This hybrid approach cuts read throughput costs by ~50% for the common path (browsing) while preserving correctness for the critical path (checkout). This is a key example of 'trade-offs are context-dependent, not global.'"
    }
  ]
}
\`\`\`

---

## Section 4: Failure Mode Reasoning

\`\`\`quiz
{
  "title": "Failure Scenario Analysis",
  "questions": [
    {
      "question": "At 3 AM, a major e-commerce site's recommendation service goes down. Its failure causes the product page service to time out waiting for recommendations, which causes the API gateway to queue requests, which exhausts its thread pool, taking down the entire site. What failure pattern is this?",
      "options": [
        "Split-brain — two nodes disagree on system state",
        "Cascading failure — one component's failure propagates through the system",
        "Byzantine fault — a node sends conflicting data to different peers",
        "Thundering herd — simultaneous cache misses overload the database"
      ],
      "answer": 1,
      "explanation": "This is a cascading failure (also called a 'cascade' or 'domino effect'). The recommendation service failure propagated upstream because no circuit breaker existed to isolate it. The fix is the Circuit Breaker pattern: when the recommendation service fails N times in T seconds, the circuit 'opens' and the product page immediately returns a default response (e.g., top sellers) instead of waiting. Netflix's Hystrix (now Resilience4j) pioneered this pattern precisely after experiencing cascading failures at scale. The key lesson: services should degrade gracefully, not fail totally, when a dependency is unavailable."
    },
    {
      "question": "A distributed cache (Redis) expires a popular product's data simultaneously for 50,000 concurrent users. All 50,000 requests hit the database at once. What is this called and what prevents it?",
      "options": [
        "Cascading failure — prevented by circuit breakers",
        "Split-brain — prevented by leader election",
        "Thundering herd / cache stampede — prevented by mutex locks, jitter, or probabilistic early expiration",
        "Byzantine fault — prevented by Byzantine fault-tolerant consensus"
      ],
      "answer": 2,
      "explanation": "This is a cache stampede (thundering herd). Three mitigations exist: (1) **Mutex lock** — only one request recomputes the cache entry; others wait and then read the freshly cached value. Risk: increased latency for waiting requests. (2) **TTL jitter** — add randomness to expiration times (e.g., TTL = base ± 20%) so entries don't expire simultaneously. (3) **Probabilistic Early Expiration (PER)** — before expiry, a small fraction of requests proactively recompute the value, so the cache is never actually empty. Facebook uses PER for high-traffic objects."
    }
  ]
}
\`\`\`

---

## How Did You Do?

\`\`\`steps
{
  "title": "Interpreting Your Results",
  "steps": [
    {
      "title": "Missed CAP questions?",
      "content": "Go back to the CAP Theorem lesson and practice the CP vs AP classification for 5 real systems you use daily (your bank app, Twitter, Slack, Google Maps, Spotify). For each one, ask: *what is the worst consequence of stale data vs unavailability?* The answer determines the correct choice."
    },
    {
      "title": "Missed consistency level questions?",
      "content": "The key insight you may be missing: consistency requirements are **per-operation**, not per-system. A single system (like Instagram) uses linearizability for payments, read-your-writes for profile edits, and eventual consistency for feed updates. Practice mapping individual user actions to their minimum required consistency level."
    },
    {
      "title": "Missed quorum questions?",
      "content": "Drill the W + R > N formula with different values of N until it's automatic. Then practice the corollary: for a given N and required W, what is the minimum R for strong consistency? (Answer: R > N - W.) This shows up directly in DynamoDB, Cassandra, and Riak configuration questions."
    },
    {
      "title": "Missed failure mode questions?",
      "content": "Build a mental catalog of failure patterns: cascading failure → circuit breakers; thundering herd → jitter/mutex/PER; split-brain → fencing tokens/STONITH; Byzantine faults → BFT consensus. For each FAANG design question you practice, explicitly ask: *which failure mode is most likely, and how does my design address it?*"
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "CAP forces a CP vs AP choice during partitions — the right answer depends on whether stale data or unavailability causes more business harm.",
    "Consistency requirements are per-operation, not per-system: a single app can use linearizability for payments and eventual consistency for feeds.",
    "Quorum correctness requires W + R > N — anything less risks reads that don't overlap with the latest write quorum.",
    "Cascading failures are prevented by circuit breakers that isolate failing dependencies; cache stampedes are prevented by jitter, mutex locks, or probabilistic early expiration.",
    "In interviews, never just name a trade-off — name it, justify it with the specific harm you're avoiding, and state what you'd accept in return."
  ]
}
\`\`\`

\`\`\`callout
{ "type": "success", "title": "Module Complete", "content": "You've finished the Distributed Systems Fundamentals module. You can now reason about CAP, consistency levels, quorum configurations, and failure modes — the four pillars of every distributed system design question. The next module applies these fundamentals to concrete system components: consistent hashing, replication strategies, and consensus algorithms like Raft." }
\`\`\``,
    },
  ],
};
