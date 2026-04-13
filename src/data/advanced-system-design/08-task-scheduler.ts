import { Module } from "../types";

export const taskSchedulerModule: Module = {
  id: "design-scheduler",
  title: "Designing a Distributed Task Scheduler",
  description: "Design a distributed task scheduler: task queues, worker management, failure handling, priority scheduling, and complete architecture walkthrough with comparisons to Celery, Airflow, and Temporal.",
  lessons: [
    {
      id: "scheduler-requirements",
      slug: "scheduler-requirements",
      title: "Task Scheduler: Requirements & Problem Space",
      content: `# Task Scheduler: Requirements & Problem Space

A distributed task scheduler accepts, queues, and executes tasks across a fleet of worker machines. Systems like Celery, Airflow, Temporal, and cloud services like AWS Step Functions power the background processing of nearly every large-scale application — yet they all solve the same fundamental problem: decoupling **work submission** from **work execution**.

## The Core Problem

Modern applications need to execute work outside the request-response cycle. Sending emails, processing images, generating reports, running ML pipelines, retrying failed payments — all of these are tasks that must happen reliably in the background, at scale, and without blocking the user.

\`\`\`concept
{ "title": "Synchronous vs Asynchronous Processing", "variant": "analogy", "content": "Think of a coffee shop. Synchronous is like ordering a complex latte and waiting at the counter while the barista makes it — you block everything while one thing finishes. Asynchronous is ordering, getting a buzzer, and coming back when it's ready. The shop serves more customers in parallel, and you can do other things while waiting. A task scheduler is the buzzer system for your application." }
\`\`\`

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Synchronous (blocks the user)", "code": "User clicks \\"Export Report\\"\\nServer generates 500MB CSV (45 seconds)\\nUser stares at loading spinner\\nHTTP timeout at 30 seconds\\nUser gets a 504 error" }, "after": { "label": "Asynchronous (task scheduler)", "code": "User clicks \\"Export Report\\"\\nServer enqueues task: generate_report(user_id=42)\\nReturns immediately: \\"Your report is being generated\\"\\nWorker picks up task, generates CSV in background\\nNotifies user when done (email / push)\\nResponse time: < 200ms" } }
\`\`\`

The architectural shift is profound: the API layer becomes a thin **task producer**, and execution capacity scales independently through a **worker fleet** that consumes from a queue.

## Types of Tasks

Not all background work is created equal. Understanding the five task types helps you design the right queuing and scheduling primitives.

\`\`\`tabs
{ "tabs": [ { "label": "One-time", "icon": "🚀", "content": "**Fire-and-forget tasks**\\n\\nExample: \`send_welcome_email(user_id=42)\`\\n\\n- Execute once, as soon as possible\\n- No scheduling constraints\\n- Most common type in web applications\\n- Typical volume: thousands per minute\\n\\nThe simplest case — a producer drops a message onto a queue and the next available worker picks it up." }, { "label": "Delayed", "icon": "⏰", "content": "**Scheduled for future execution**\\n\\nExample: \`send_reminder_email(user_id=42, delay=24h)\`\\n\\n- Execute once, but not until a specified future time\\n- Requires a time-indexed queue or scheduler component\\n- Common for reminders, follow-ups, cleanup jobs\\n- **Must survive restarts** — tasks stored in durable storage, not memory" }, { "label": "Recurring", "icon": "🔄", "content": "**Cron-like scheduled tasks**\\n\\nExample: \`generate_daily_report\` at \`0 2 * * *\` (2:00 AM UTC)\\n\\n- Execute repeatedly on a schedule\\n- Requires cron expression parsing and a clock-based trigger\\n- Must handle edge cases: DST transitions, leap seconds, missed runs during downtime\\n- Often used for batch processing, data pipelines, maintenance windows" }, { "label": "Workflow / DAG", "icon": "🕸️", "content": "**Tasks with explicit dependencies**\\n\\nExample ETL pipeline:\\n1. \`download_data\` (no deps)\\n2. \`transform_data\` (depends on Step 1)\\n3. \`load_warehouse\` (depends on Step 2)\\n4. \`send_completion_email\` (depends on Step 3)\\n\\n- Directed Acyclic Graph execution model\\n- Scheduler tracks which upstream tasks have completed before releasing downstream ones\\n- Enables parallel execution where dependency graph allows\\n- Critical for ETL, ML training pipelines, CI/CD workflows\\n- Airflow and Temporal are purpose-built for this model" }, { "label": "Priority", "icon": "⚡", "content": "**Urgency-based execution order**\\n\\nExamples:\\n- \`process_payment(order_id=99)\` → HIGH priority\\n- \`generate_thumbnail(asset_id=7)\` → LOW priority\\n\\n- Multiple priority queues (commonly 3-5 levels)\\n- Workers drain higher-priority queues first\\n- Prevents low-priority bulk work from starving critical tasks\\n- Common in payment processing, alerting, and notification delivery" } ] }
\`\`\`

## Functional Requirements

These are the operations the system must expose to clients:

| Operation | Signature | Description |
|-----------|-----------|-------------|
| Submit | \`submit(task)\` | Enqueue a task for immediate execution |
| Schedule | \`schedule(task, time)\` | Enqueue a task for future execution |
| Cron | \`cron(task, expression)\` | Register a recurring task |
| Cancel | \`cancel(task_id)\` | Cancel a pending or running task |
| Status | \`status(task_id)\` | Query the current state of a task |
| Retry | \`retry(task_id)\` | Re-enqueue a failed task manually |

Beyond the core CRUD operations, the system must also support **task priorities**, **task dependencies** (DAG execution), and **result retrieval** (where applicable).

## Non-Functional Requirements

\`\`\`callout
{ "type": "info", "title": "NFR Target Table", "content": "| Requirement | Target |\\n|---|---|\\n| Throughput | 100,000+ tasks/sec enqueue |\\n| Execution latency | < 100ms from enqueue to worker pickup (immediate tasks) |\\n| Reliability | At-least-once delivery — no task silently lost |\\n| Scalability | Horizontal — add workers to increase capacity |\\n| Durability | Tasks survive broker/scheduler crashes |\\n| Ordering | Best-effort FIFO within same priority level |\\n| Visibility | Full lifecycle tracking (pending → running → succeeded/failed) |" }
\`\`\`

\`\`\`concept
{ "title": "At-Least-Once vs Exactly-Once", "variant": "rule", "content": "At-least-once delivery guarantees no task is ever silently dropped — but it permits duplicate executions during retries or failover. Exactly-once is extremely hard in distributed systems and is typically approximated for critical operations (e.g. payments) using idempotency keys and transactional guarantees, not by the scheduler itself. Design your task handlers to be idempotent by default." }
\`\`\`

## Task Lifecycle

Every task flows through a well-defined state machine. Understanding these transitions is essential before designing any component of the system.

\`\`\`algoviz
{ "title": "Task State Transitions", "type": "array", "data": ["PENDING", "SCHEDULED", "RUNNING", "SUCCEEDED", "FAILED", "CANCELLED", "RETRYING", "DEAD_LETTER"], "frames": [ { "highlight": [0, 1], "label": "Task submitted or scheduled for future time", "stats": { "transition": "PENDING → SCHEDULED" } }, { "highlight": [1, 2], "label": "Worker picks up task from queue", "stats": { "transition": "SCHEDULED → RUNNING" } }, { "highlight": [2, 3], "label": "Task handler returns successfully", "stats": { "transition": "RUNNING → SUCCEEDED" } }, { "highlight": [2, 4], "label": "Task handler raises an exception", "stats": { "transition": "RUNNING → FAILED" } }, { "highlight": [2, 5], "label": "Client explicitly cancels the task", "stats": { "transition": "RUNNING → CANCELLED" } }, { "highlight": [4, 6], "label": "Retry policy allows another attempt", "stats": { "transition": "FAILED → RETRYING" } }, { "highlight": [6, 2], "label": "Retry attempt begins on a worker", "stats": { "transition": "RETRYING → RUNNING" } }, { "highlight": [4, 7], "label": "Max retries exhausted — task enters dead-letter queue", "stats": { "transition": "FAILED → DEAD_LETTER" } } ], "speed": 1200 }
\`\`\`

Two transitions deserve special attention:

- **RUNNING → CANCELLED**: a running task can only be cancelled if the worker supports cooperative interruption (e.g., checking a cancellation flag periodically). Hard-killing a worker is a last resort.
- **FAILED → DEAD_LETTER**: the dead-letter queue is your observability lifeline. Tasks here require human or automated intervention and must be inspectable, not silently discarded.

## Industry Scale Reference Points

\`\`\`callout
{ "type": "info", "title": "What Real Systems Process", "content": "**Uber**: ~1 million tasks/minute across global data centers\\n**Airbnb**: ~500K background jobs/hour (search indexing, pricing) — Airflow was created at Airbnb in 2014\\n**Stripe**: millions of webhook delivery tasks/day\\n**Shopify**: ~50 billion background jobs executed in 2023\\n\\nA typical web application operates at 1,000–10,000 tasks/hour with 5–20 workers, spiking 10× during flash sales or bulk imports. Designing for 100K tasks/sec from day one is premature — but the architecture must scale to it without rewrites." }
\`\`\`

## Real-World Systems: Where They Fit

The tools you'll compare throughout this module each occupy a different point in the design space:

\`\`\`tabs
{ "tabs": [ { "label": "Celery", "icon": "🌿", "content": "**Best for**: Python web apps needing simple async task execution\\n\\n- Broker-backed (Redis or RabbitMQ), Python-native\\n- Strengths: async/parallel execution, flexible broker support, rich task status tracking, retries, prioritization\\n- Weaknesses: complex management in large distributed systems, multi-datacenter coordination requires extra effort\\n- Typical use: Django/Flask apps, image processing, email delivery" }, { "label": "Airflow", "icon": "🌬️", "content": "**Best for**: Data engineering — batch ETL, ML pipelines, scheduled reporting\\n\\n- DAG-centric model, Python-defined workflows, cron scheduling\\n- Airflow 2.0 resolved the historical single-scheduler bottleneck with active-active multi-scheduler support\\n- CeleryExecutor distributes tasks across worker pools; KubernetesExecutor creates pods per task\\n- Weakness: metadata database becomes a bottleneck at scale (typically addressed with PGBouncer connection pooling)\\n- If scheduler crashes, you may need manual backfills for missed runs" }, { "label": "Temporal", "icon": "⏳", "content": "**Best for**: Long-running, durable business workflows with complex failure handling\\n\\n- Evolved from Uber's Cadence project, open-sourced in 2019\\n- Core model: event sourcing + durable execution. Every workflow action is recorded to an append-only event history\\n- If a worker crashes mid-execution, a new worker replays the history and resumes exactly where it left off — no manual intervention\\n- Worker Auto-Tuning (GA March 2025) automatically adjusts concurrent tasks based on CPU and memory utilization\\n- Activity failures never directly cause workflow failures — retries are first-class SDK primitives" } ] }
\`\`\`

## Quiz: Task Scheduler Fundamentals

\`\`\`quiz
{ "title": "Understanding Task Scheduling", "questions": [ { "question": "Which task type is most suitable for sending a password reset email immediately after a user requests it?", "options": ["One-time", "Delayed", "Recurring", "Workflow/DAG"], "answer": 0, "explanation": "Password reset emails should be sent once, as soon as possible — no delay, no schedule, no dependencies. One-time tasks are the simplest and most common type in web applications." }, { "question": "What does 'at-least-once delivery' guarantee?", "options": ["Tasks may be lost but never duplicated", "Tasks may be duplicated but are never silently lost", "Tasks execute exactly once regardless of failures", "Tasks execute at most once, dropping on failure"], "answer": 1, "explanation": "At-least-once delivery guarantees no task is ever silently dropped. The trade-off is that retries or failover can cause duplicate executions. Task handlers must be designed to be idempotent to handle this safely." }, { "question": "Which state transition is INVALID in the task lifecycle?", "options": ["PENDING → SCHEDULED", "RUNNING → CANCELLED", "FAILED → RETRYING", "SUCCEEDED → FAILED"], "answer": 3, "explanation": "Once a task reaches SUCCEEDED, it is a terminal state — it cannot transition to FAILED. The execution is complete. DEAD_LETTER is the only other terminal state in the standard model." }, { "question": "Airflow was originally created at which company?", "options": ["Google", "Uber", "Airbnb", "Stripe"], "answer": 2, "explanation": "Apache Airflow was started at Airbnb in late 2014 and open-sourced in 2015. Temporal, by contrast, evolved from Uber's Cadence project and launched as open-source in late 2019." }, { "question": "A task that generates a weekly sales report every Monday at 6:00 AM UTC belongs to which task type?", "options": ["One-time", "Delayed", "Recurring", "Priority"], "answer": 2, "explanation": "Weekly reports on a fixed schedule are classic recurring (cron-like) tasks. They use a cron expression (e.g. '0 6 * * MON') and must handle edge cases like DST transitions and missed runs during downtime." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "A task scheduler decouples work submission from work execution — the API enqueues, workers consume, and they scale independently.", "Five task types each demand different scheduling primitives: one-time, delayed, recurring (cron), workflow/DAG, and priority.", "At-least-once delivery is the practical reliability guarantee; exactly-once requires idempotent task handlers.", "The task state machine has two terminal states: SUCCEEDED and DEAD_LETTER. Anything in DEAD_LETTER requires investigation.", "Celery, Airflow, and Temporal solve overlapping but distinct problems — Celery for simple async, Airflow for data pipelines, Temporal for durable long-running business workflows.", "Industry scale (Uber: 1M tasks/min, Shopify: 50B tasks/year) is achieved through horizontal worker scaling and distributed queues — not by making the scheduler smarter." ] }
\`\`\``,
    },
    {
      id: "scheduler-queue",
      slug: "scheduler-queue",
      title: "Task Queue Architecture",
      content: `# Task Queue Architecture

The task queue is the backbone of a distributed scheduler. It decouples producers (who submit tasks) from consumers (workers who execute them), enabling asynchronous processing that keeps your application responsive while background work happens elsewhere.

\`\`\`concept
{ "title": "Task Queue as a Decoupling Pattern", "variant": "mental-model", "content": "Think of a task queue like a restaurant kitchen's order system. Waiters (producers) take orders from customers and place them on a rail (queue). Chefs (workers) pull orders from the rail and prepare dishes. The waiter doesn't wait for the food to be cooked before moving to the next table, and multiple chefs can work in parallel. This decoupling allows the front-of-house to scale independently from the kitchen — just as your API servers can scale independently from your worker processes." }
\`\`\`

## Core Queue Design

A well-designed task queue provides four essential guarantees:

1. **FIFO ordering** within the same priority level
2. **At-least-once delivery** — tasks won't silently disappear
3. **Invisibility until acknowledged** — prevents double-processing
4. **Persistence** — survives broker restarts

\`\`\`sysdiag
{ "title": "Basic Task Queue Architecture", "width": 620, "height": 320, "nodes": [ { "id": "api1", "label": "API Server 1", "x": 80, "y": 60, "kind": "service" }, { "id": "api2", "label": "API Server 2", "x": 80, "y": 130, "kind": "service" }, { "id": "api3", "label": "API Server 3", "x": 80, "y": 200, "kind": "service" }, { "id": "cron", "label": "Cron Daemon", "x": 80, "y": 270, "kind": "service" }, { "id": "queue", "label": "Task Queue", "x": 310, "y": 165, "kind": "database" }, { "id": "w1", "label": "Worker 1", "x": 540, "y": 60, "kind": "service" }, { "id": "w2", "label": "Worker 2", "x": 540, "y": 130, "kind": "service" }, { "id": "w3", "label": "Worker 3", "x": 540, "y": 200, "kind": "service" }, { "id": "w4", "label": "Worker 4", "x": 540, "y": 270, "kind": "service" } ], "edges": [ { "from": "api1", "to": "queue", "label": "enqueue" }, { "from": "api2", "to": "queue", "label": "enqueue" }, { "from": "api3", "to": "queue", "label": "enqueue" }, { "from": "cron", "to": "queue", "label": "enqueue" }, { "from": "queue", "to": "w1", "label": "dequeue" }, { "from": "queue", "to": "w2", "label": "dequeue" }, { "from": "queue", "to": "w3", "label": "dequeue" }, { "from": "queue", "to": "w4", "label": "dequeue" } ], "annotations": { "queue": "FIFO ordering, at-least-once delivery, and persistence across restarts. Workers compete for tasks — each task goes to exactly one worker.", "cron": "Cron daemons are first-class producers, not special cases. They enqueue tasks just like API servers do." } }
\`\`\`

## Task Message Format

Every task needs a standardized message envelope carrying all the context workers need to execute it — and to skip it safely if they've seen it before:

\`\`\`json
{
  "task_id": "uuid-abc-123",
  "task_type": "send_email",
  "payload": { "to": "user@example.com", "template": "welcome" },
  "priority": "high",
  "created_at": "2024-01-15T10:30:00Z",
  "scheduled_at": null,
  "max_retries": 3,
  "retry_count": 0,
  "timeout_sec": 30,
  "idempotency_key": "welcome-user-42",
  "metadata": {
    "submitted_by": "api-server-2",
    "trace_id": "trace-xyz-789"
  }
}
\`\`\`

The \`idempotency_key\` is the most important field for correctness. At-least-once delivery means a task may arrive at a worker more than once (network retry, crash recovery). Workers must check this key — "have I already processed \`welcome-user-42\`?" — before doing any work.

\`\`\`concept
{ "title": "Exactly-Once is a Myth", "variant": "insight", "content": "True exactly-once delivery is impossible in distributed systems. What vendors call 'exactly-once' is really at-least-once delivery plus idempotent execution. Design your tasks to check before acting: a payment task should query 'have I already charged order-42?' before calling the payment gateway. With idempotency keys, duplicate deliveries become harmless rather than catastrophic. Airflow's documentation explicitly warns that tasks must be idempotent because it cannot guarantee exactly-once execution — Temporal's event-sourced history gets closer, but workers must still be designed idempotently." }
\`\`\`

## Priority Queues

Multiple queues with different priorities ensure urgent tasks jump ahead of routine work:

\`\`\`algoviz
{ "title": "Multi-Priority Queue Processing", "type": "array", "data": ["payment-123", "payment-124", "payment-125", "email-456", "email-457", "thumb-001", "report-789", "report-790"], "frames": [ { "highlight": [0], "label": "Worker checks HIGH priority queue first (60% capacity allocation)", "stats": { "queue": "HIGH", "remaining": 3 } }, { "highlight": [0], "label": "Dequeue and process payment-123", "stats": { "queue": "HIGH", "processed": 1 } }, { "highlight": [1], "label": "Dequeue and process payment-124", "stats": { "queue": "HIGH", "processed": 2 } }, { "highlight": [2], "label": "Dequeue and process payment-125 — HIGH queue now empty", "stats": { "queue": "HIGH", "processed": 3 } }, { "highlight": [3], "label": "Checks MEDIUM priority queue (30% capacity allocation)", "stats": { "queue": "MEDIUM", "remaining": 2 } }, { "highlight": [3], "label": "Dequeue and process email-456", "stats": { "queue": "MEDIUM", "processed": 1 } }, { "highlight": [4], "label": "Dequeue and process email-457 — MEDIUM queue now empty", "stats": { "queue": "MEDIUM", "processed": 2 } }, { "highlight": [6], "label": "Checks LOW priority queue (10% capacity allocation)", "stats": { "queue": "LOW", "remaining": 2 } }, { "highlight": [6], "label": "Dequeue and process report-789", "stats": { "queue": "LOW", "processed": 1 } } ], "speed": 1000 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Priority Starvation", "content": "Naive priority polling starves low-priority tasks indefinitely under sustained high-priority load. Use **weighted fair queuing**: allocate 60% of worker capacity to HIGH, 30% to MEDIUM, 10% to LOW. Workers pick the next queue based on weighted random selection rather than strict ordering. This guarantees even bulk reports eventually complete while payments still preempt them in practice." }
\`\`\`

## Delay Queue

For tasks that shouldn't execute until a future time, you need a separate delay mechanism — the execution queue only holds tasks that are ready *now*:

\`\`\`tabs
{ "tabs": [ { "label": "Redis ZSET", "icon": "⚡", "content": "**Sorted Set by timestamp:**\\n\\n\`\`\`\\nZADD delayed_tasks 1705312200 \\"task-abc\\"   # schedule for 10:30\\nZADD delayed_tasks 1705315800 \\"task-def\\"   # schedule for 11:30\\n\\n# Scheduler loop (runs every second):\\nnow = current_timestamp()\\nready = ZRANGEBYSCORE delayed_tasks 0 now LIMIT 0 100\\nfor task_id in ready:\\n    move_to_execution_queue(task_id)\\n    ZREM delayed_tasks task_id\\n\`\`\`\\n\\n**Pros:** O(log n) insert/remove, Redis-native, ±1s precision\\n\\n**Cons:** Requires a dedicated polling process; Redis must be durable (\`appendonly yes\`)" }, { "label": "Database Polling", "icon": "🗄️", "content": "**SQL-based scheduling:**\\n\\n\`\`\`sql\\nSELECT * FROM tasks\\nWHERE status = 'scheduled'\\n  AND scheduled_at <= NOW()\\nORDER BY scheduled_at\\nLIMIT 100;\\n\`\`\`\\n\\n**Optimization — bucket by minute to reduce scan cost:**\\n\\n\`\`\`sql\\nSELECT * FROM tasks\\nWHERE status = 'scheduled'\\n  AND scheduled_bucket = '2024-01-15-10:30'\\nORDER BY created_at\\nLIMIT 100;\\n\`\`\`\\n\\n**Pros:** Transactional, no extra infrastructure, easy to audit\\n\\n**Cons:** Polling adds DB load; precision bounded by poll interval (typically 1–60s)" }, { "label": "SQS Built-in", "icon": "☁️", "content": "**AWS SQS Delay Queues:**\\n\\nSQS supports a \`DelaySeconds\` attribute (0–900 seconds, i.e. up to 15 minutes) per message:\\n\\n\`\`\`python\\nsqs.send_message(\\n    QueueUrl=queue_url,\\n    MessageBody=json.dumps(task),\\n    DelaySeconds=300  # visible to consumers in 5 minutes\\n)\\n\`\`\`\\n\\nFor longer delays, combine SQS with EventBridge Scheduler:\\n- EventBridge triggers a Lambda at the exact scheduled time\\n- Lambda enqueues the task into SQS for immediate pickup\\n\\n**Pros:** Zero infrastructure to manage, at-least-once guaranteed\\n\\n**Cons:** 15-min native cap; EventBridge adds latency (~1s jitter)" } ] }
\`\`\`

## Dead Letter Queue (DLQ)

Tasks that fail repeatedly need special handling rather than infinite retry loops or silent deletion:

\`\`\`trace
{ "title": "Retry With Exponential Backoff → DLQ", "language": "python", "code": "def process_task_with_retry(task):\\n    retry_delays = [1, 4, 16]  # exponential backoff (seconds)\\n\\n    for attempt in range(task.max_retries + 1):\\n        try:\\n            execute_task(task)\\n            return  # success\\n        except Exception as e:\\n            if attempt < task.max_retries:\\n                sleep(retry_delays[attempt])\\n                task.retry_count += 1\\n            else:\\n                move_to_dlq(task, str(e))\\n                alert_engineers(task, str(e))", "frames": [ { "line": 1, "vars": { "task": "send_email", "attempt": "—" }, "note": "Worker picks up task for first attempt" }, { "line": 5, "vars": { "attempt": 0 }, "note": "Execute task — calls SMTP server" }, { "line": 6, "vars": { "attempt": 0 }, "stdout": "SMTPConnectError: timeout after 30s", "note": "First failure — transient SMTP issue?" }, { "line": 7, "vars": { "attempt": 0, "retry_count": 1 }, "note": "Backoff 1s, increment retry counter" }, { "line": 5, "vars": { "attempt": 1 }, "note": "Second attempt after 1s" }, { "line": 6, "vars": { "attempt": 1 }, "stdout": "SMTPConnectError: timeout after 30s", "note": "Second failure — issue persists" }, { "line": 7, "vars": { "attempt": 1, "retry_count": 2 }, "note": "Backoff 4s (2^2)" }, { "line": 5, "vars": { "attempt": 2 }, "note": "Third and final attempt after 4s" }, { "line": 6, "vars": { "attempt": 2 }, "stdout": "SMTPConnectError: timeout after 30s", "note": "Third failure — max retries exhausted" }, { "line": 10, "vars": { "task": "→ DLQ" }, "note": "Move to dead letter queue with full context" }, { "line": 11, "note": "Alert on-call via PagerDuty with error details" } ], "speed": 1100 }
\`\`\`

A well-operated DLQ provides four capabilities:

1. **Alerting** — PagerDuty/Slack notifications for on-call engineers
2. **Inspection dashboard** — browse failed tasks with full payloads and stack traces
3. **Pattern grouping** — cluster errors by type to spot infrastructure-wide failures vs. data-specific bugs
4. **Replay** — re-enqueue tasks with a fresh retry count once the underlying issue is resolved

\`\`\`callout
{ "type": "info", "title": "DLQ as a Diagnostic Signal", "content": "A spike in DLQ depth is often your first warning of a downstream outage — before monitoring dashboards or customer complaints catch it. Wire DLQ depth as a CloudWatch/Datadog metric and alert at both absolute thresholds (>50 tasks) and rate-of-change (>10 tasks/minute). Group by \`task_type\` so you can distinguish 'SMTP is down' from 'payment gateway is down' at a glance." }
\`\`\`

## Broker Comparison

Different brokers make different trade-offs. Redis is fast and simple; RabbitMQ adds AMQP routing semantics; Kafka maximizes throughput; SQS removes operational burden:

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Redis — Simple High-Throughput Tasks", "code": "# Enqueue\\nr.lpush('tasks:high', json.dumps(task))\\n\\n# Dequeue (blocking, 30s timeout)\\ntask_raw = r.brpop(['tasks:high', 'tasks:low'], timeout=30)\\n\\n# Delayed tasks via sorted set\\nr.zadd('tasks:delayed', {task_id: scheduled_ts})\\n\\n# Atomic move from delayed -> ready\\n# (run via Lua script for atomicity)\\nready = r.zrangebyscore('tasks:delayed', 0, now)\\nfor t in ready:\\n    r.lpush('tasks:high', t)\\n    r.zrem('tasks:delayed', t)" }, "after": { "label": "RabbitMQ — Complex Routing and Native DLQ", "code": "# Declare queue with DLX and priority support\\nchannel.queue_declare(\\n    queue='tasks.high',\\n    durable=True,\\n    arguments={\\n        'x-max-priority': 10,\\n        'x-dead-letter-exchange': 'dlx',\\n        'x-message-ttl': 30000\\n    }\\n)\\n\\n# Publish with persistence + priority\\nchannel.basic_publish(\\n    exchange='orders',\\n    routing_key='payment.high',\\n    body=json.dumps(task),\\n    properties=pika.BasicProperties(\\n        delivery_mode=2,   # persist to disk\\n        priority=9\\n    )\\n)" } }
\`\`\`

| Feature | Redis | RabbitMQ | Kafka | SQS |
|---|---|---|---|---|
| **Delivery guarantee** | At-most-once* | At-least-once | At-least-once | At-least-once |
| **Throughput** | ~100K msg/s | ~50K msg/s | ~1M msg/s | ~3K msg/s per queue |
| **Priority queues** | Via ZSET | Built-in (\`x-max-priority\`) | App-level only | No |
| **Delayed tasks** | Via ZSET | TTL + DLX | App-level only | Built-in (≤15 min) |
| **Native DLQ** | No (manual) | Yes (\`x-dead-letter-exchange\`) | No (consumer offset) | Yes |
| **Best fit** | Simple tasks, low ops overhead | Complex routing, enterprise patterns | Log ingestion, analytics pipelines | Serverless / AWS-native stacks |

\\* Redis can achieve at-least-once with the \`BRPOPLPUSH\` + explicit acknowledgment pattern — atomically move task to a processing list; delete only after success.

\`\`\`collapse
{ "title": "Deep Dive: How Airflow Distributes Tasks to Celery Workers", "content": "When Airflow runs with \`CeleryExecutor\`, task distribution follows a multi-step journey:\\n\\n1. **Scheduler** marks a task instance \`scheduled\` in the metadata database (PostgreSQL/MySQL).\\n2. **Scheduler** enqueues the task to the Celery broker (Redis or RabbitMQ) and sets state to \`queued\`.\\n3. **Celery worker** picks up the task, sets state to \`running\`, and begins execution.\\n4. On completion, the worker updates the metadata database to \`success\` or \`failed\`.\\n\\nThe metadata database is the common bottleneck at scale — Airflow 2.0 addressed the historical single-scheduler limitation with active-active multi-scheduler support, but the database still requires connection pooling (PGBouncer) and careful tuning under high task volume. Temporal's architecture avoids this by using event-sourced sharded storage (Cassandra or PostgreSQL with the History Service partitioned into 512–1024 shards), separating scheduling state from a single shared DB." }
\`\`\`

\`\`\`quiz
{ "title": "Task Queue Design Decisions", "questions": [ { "question": "Your e-commerce platform must process payments within 100ms but also generates monthly reporting jobs that take minutes. Which queue design is optimal?", "options": [ "Single FIFO queue for operational simplicity", "Multi-priority queues with weighted fair queuing (60/30/10 split)", "One queue per customer account", "Kafka with 100 partitions for throughput" ], "answer": 1, "explanation": "Multi-priority queues with weighted fair queuing ensure payments (HIGH) get processed quickly while reports (LOW) still make progress. A single FIFO queue would block payments behind long-running reports. Per-customer queues create unmanageable operational overhead. Kafka partitions improve throughput but don't solve priority ordering without application-level logic." }, { "question": "A payment task fails with 'database connection timeout' after exhausting all retries and lands in the DLQ. What should the DLQ consumer do first?", "options": [ "Immediately replay all DLQ tasks to clear the backlog", "Alert engineers and analyze error patterns before replaying", "Delete the task — it's permanently failed", "Double max_retries and re-enqueue with the same backoff" ], "answer": 1, "explanation": "Connection timeouts suggest an infrastructure problem (DB overload, network partition), not a task-specific bug. Blind replay would likely fail again and may amplify load on an already-stressed database. Alerting engineers and grouping errors by type reveals whether this is isolated or systemic. Only replay after the root cause is resolved." }, { "question": "You need to schedule a promotional email to fire at exactly midnight on Black Friday, 72 hours from now. Which approach provides the best precision?", "options": [ "Redis ZSET with a 1-second polling loop", "Database polling every minute with a scheduled_bucket index", "SQS native delay (DelaySeconds parameter)", "RabbitMQ message TTL with dead-letter exchange" ], "answer": 0, "explanation": "Redis ZSET with 1-second polling gives ±1 second precision and scales easily. Database polling every minute is too coarse for a midnight target. SQS native delay tops out at 15 minutes — useless for 72-hour scheduling (you'd need EventBridge Scheduler as an additional layer). RabbitMQ TTL/DLX is designed for message expiry, not precise future scheduling." }, { "question": "Which property of a task message prevents duplicate charges when a payment task is delivered twice due to at-least-once delivery?", "options": [ "task_id (UUID)", "retry_count field", "idempotency_key tied to the order ID", "timeout_sec field" ], "answer": 2, "explanation": "The idempotency_key (e.g., 'charge-order-42') lets the payment service check 'have I already processed this?' before acting. A task_id UUID is unique per message but a retry or requeue creates a *new* UUID for the same logical operation. retry_count and timeout_sec are execution metadata, not deduplication keys." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Task queues decouple producers from workers, enabling independent scaling and fault isolation — API servers and workers can scale to different sizes", "Design every task to be idempotent using an idempotency_key — at-least-once delivery is a guarantee, not a bug, and duplicate deliveries must be safe", "Use weighted fair queuing (60/30/10) across priority levels to prevent starvation while still honoring urgency", "Dead letter queues are a diagnostic goldmine — DLQ depth spikes are often your first signal of a downstream outage", "Match the broker to your needs: Redis for simplicity and speed, RabbitMQ for native routing and DLQ semantics, Kafka for high-throughput pipelines, SQS for managed serverless stacks" ] }
\`\`\``,
    },
    {
      id: "scheduler-workers",
      slug: "scheduler-workers",
      title: "Worker Management & Load Balancing",
      content: `# Worker Management & Load Balancing

Workers are the execution engines of a task scheduler. Managing a pool of workers — scaling them, monitoring their health, and assigning tasks efficiently — is critical for throughput and reliability.

\`\`\`concept
{
  "title": "Worker Process Anatomy",
  "variant": "mental-model",
  "content": "Think of a worker as a tiny factory with four departments:\\n\\n1. **Task Executor**: The assembly line that picks, unpacks, and runs each job\\n2. **Heartbeat Loop**: The security guard that radios \\"all good\\" every 5 seconds\\n3. **Task Registry**: A bulletin board listing which task types this worker can handle\\n4. **Resource Monitor**: A dashboard showing current CPU, memory, and in-flight count\\n\\nIf the guard stops checking in, the central office (scheduler) assumes the factory is down and reroutes work elsewhere."
}
\`\`\`

## Worker Pool Architecture

Before diving into scaling rules, here's how the pieces fit together. Workers pull independently from the queue — the scheduler never assigns tasks directly to a specific worker in the baseline pull design.

\`\`\`sysdiag
{
  "title": "Worker Pool Architecture",
  "width": 700,
  "height": 380,
  "nodes": [
    { "id": "scheduler", "label": "Scheduler", "x": 350, "y": 40, "kind": "service" },
    { "id": "queue", "label": "Task Queue\\n(Redis / RabbitMQ)", "x": 350, "y": 160, "kind": "service" },
    { "id": "registry", "label": "Worker Registry", "x": 100, "y": 160, "kind": "database" },
    { "id": "monitor", "label": "Health Monitor", "x": 600, "y": 160, "kind": "service" },
    { "id": "w1", "label": "Worker 1", "x": 180, "y": 300, "kind": "service" },
    { "id": "w2", "label": "Worker 2", "x": 350, "y": 300, "kind": "service" },
    { "id": "w3", "label": "Worker 3", "x": 520, "y": 300, "kind": "service" }
  ],
  "edges": [
    { "from": "scheduler", "to": "queue", "label": "enqueue" },
    { "from": "scheduler", "to": "registry", "label": "lookup" },
    { "from": "w1", "to": "queue", "label": "poll" },
    { "from": "w2", "to": "queue", "label": "poll" },
    { "from": "w3", "to": "queue", "label": "poll" },
    { "from": "w1", "to": "monitor", "label": "heartbeat" },
    { "from": "w2", "to": "monitor", "label": "heartbeat" },
    { "from": "w3", "to": "monitor", "label": "heartbeat" },
    { "from": "w1", "to": "registry", "label": "register" }
  ],
  "annotations": {
    "scheduler": "Enqueues tasks into priority queues and triggers autoscaling. Not in the task-assignment hot path.",
    "queue": "Buffer between producers and workers. Workers pull independently — queue service handles fanout.",
    "registry": "Maps worker ID to declared capabilities, concurrency slots, and current load factor.",
    "monitor": "Detects missed heartbeats; triggers re-enqueue of in-flight tasks from dead workers.",
    "w1": "Stateless compute node: polls queue, executes tasks, sends heartbeats every 5 s, registers on startup."
  }
}
\`\`\`

## Worker Pool Management

Static pools are simple but brittle — you either waste money (too many idle workers) or drop SLA (too few). Dynamic pools react to real demand using leading indicators.

\`\`\`steps
{
  "title": "Autoscaling Timeline Walk-through",
  "steps": [
    {
      "title": "T = 0 s — Demand Spike",
      "content": "Queue depth spikes to 5,000 tasks after a marketing email drops. Average wait time jumps from 200 ms to 8 s."
    },
    {
      "title": "T = 30 s — Autoscaler Fires",
      "content": "Autoscaler evaluates rules every 30 s:\\n- \`queue_depth > 1,000\` ✓\\n- \`average_wait_time > 5 s\` ✓\\n\\nDecision: add 20 workers. **Queue depth is the leading indicator** — CPU and memory only spike after workers are already overwhelmed."
    },
    {
      "title": "T = 60 s — Provisioning",
      "content": "Cloud provider spins up new VM instances. Cold-start overhead: ~30 s to pull the Docker image and warm the language runtime."
    },
    {
      "title": "T = 120 s — Workers Online",
      "content": "New workers register with the scheduler and begin polling. Queue drains at 1,200 tasks/min vs 300 tasks/min arrival rate — drain rate 4× faster than intake."
    },
    {
      "title": "T = 600 s — Queue Empty",
      "content": "All tasks complete. Autoscaler starts watching the idle timer. Workers remain up briefly to absorb any second wave."
    },
    {
      "title": "T = 900 s — Gradual Scale-Down",
      "content": "Workers idle > 5 min and utilization < 20%. Gradual scale-down terminates 2 VMs per minute to avoid a thundering-herd re-spawn if another spike arrives immediately after."
    }
  ]
}
\`\`\`

Optimal concurrency per worker depends on task profile:

| Task Type | Example | Optimal Concurrency | Rationale |
|-----------|---------|---------------------|-----------|
| CPU-bound | Image resize, ML inference | 1 per physical core | Prevents context-switch thrashing |
| I/O-bound | API calls, email send | 10–50 threads | Threads yield while waiting on network |
| Mixed | Web scraping | Separate pools | Prevents CPU tasks from starving I/O slots |

\`\`\`callout
{
  "type": "info",
  "title": "Celery's Concurrency Model",
  "content": "Celery exposes this choice via \`--concurrency\` and \`--pool\`:\\n\\n- \`--pool=prefork\` (default): one OS process per core — best for CPU-bound work\\n- \`--pool=gevent\` / \`--pool=eventlet\`: green threads — best for I/O-bound work\\n- \`--pool=solo\`: single-threaded, useful for debugging\\n\\nMixing CPU and I/O tasks in one \`prefork\` worker causes priority inversion — a blocked I/O task occupies an entire process slot, starving CPU work."
}
\`\`\`

## Heartbeat Protocol

Workers send periodic heartbeats so the scheduler can detect failures. Missing two intervals (10 s) triggers suspicion; missing six (30 s) declares the worker dead and re-enqueues its in-flight tasks.

\`\`\`trace
{
  "title": "Heartbeat Failure Detection",
  "language": "python",
  "code": "class Scheduler:\\n    def check_workers(self):\\n        for w in self.workers.values():\\n            if time.time() - w.last_beat > 30:\\n                self.mark_dead(w)\\n\\n    def mark_dead(self, worker):\\n        worker.status = 'DEAD'\\n        for task in worker.inflight:\\n            task.requeue()\\n        self.alert_ops(f'{worker.id} missed heartbeat')\\n\\n# Simulate\\nscheduler = Scheduler()\\nscheduler.workers['w-7'].last_beat = time.time() - 35\\nscheduler.check_workers()",
  "frames": [
    { "line": 3, "vars": { "w.id": "w-7", "time.time() - w.last_beat": 35 }, "note": "Iterating workers — w-7 last heartbeat was 35 s ago" },
    { "line": 4, "vars": { "threshold": 30 }, "note": "35 > 30 → condition true, calling mark_dead" },
    { "line": 8, "vars": { "worker.id": "w-7", "worker.status": "DEAD" }, "note": "Status flipped from RUNNING to DEAD" },
    { "line": 9, "vars": { "task.id": "task-abc-123", "inflight_count": 1 }, "note": "Iterating in-flight tasks to re-enqueue" },
    { "line": 10, "vars": { "task.id": "task-abc-123" }, "note": "task-abc-123 returned to PENDING queue" },
    { "line": 11, "vars": {}, "note": "PagerDuty / ops alert fired for w-7" }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Heartbeat Alone Is Not Enough — Add a Reaper",
  "content": "Heartbeat detection handles **worker crashes**. But a worker can hang without crashing — a tight loop, a deadlock, or a network partition that keeps the process alive. A separate **reaper process** scans for tasks stuck in \`RUNNING\` state longer than a configured threshold (e.g., 2× expected task duration) and resets them to \`PENDING\`. This is the second line of defense."
}
\`\`\`

## Task Assignment Strategies

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Push-based (scheduler assigns)",
    "code": "# Scheduler is the bottleneck\\nwhile True:\\n    task = queue.peek()\\n    worker = pick_worker(task)  # O(n) scan\\n    rpc_assign(worker, task)    # synchronous RPC\\n    # Scheduler stalls if worker is slow to ack\\n    # Single point of failure for all assignment"
  },
  "after": {
    "label": "Pull-based (workers poll)",
    "code": "# Decentralized — no single bottleneck\\nwhile True:\\n    task = queue.dequeue(timeout=30)\\n    if task:\\n        execute(task)\\n        queue.ack(task)\\n    # Idle workers cost near-zero\\n    # Queue service (Redis/RabbitMQ) handles fanout"
  }
}
\`\`\`

Hybrid **claim-based** systems split the difference: the scheduler partitions tasks into per-worker queues, but workers still pull. Temporal uses this pattern (called *task routing*), rebalancing partitions when workers join or leave. This gives cache locality without a synchronous push bottleneck.

## Task Affinity and Routing

Some tasks must land on specific workers. Rules are evaluated top-down; first match wins.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "GPU Routing",
      "icon": "🖥️",
      "content": "Route compute-heavy tasks to a dedicated GPU pool:\\n\\n\`\`\`json\\n{\\n  \\"pattern\\": \\"task.image.resize\\",\\n  \\"queue\\": \\"gpu-queue\\",\\n  \\"pool\\": \\"gpu-workers\\",\\n  \\"rationale\\": \\"Requires CUDA hardware\\"\\n}\\n\`\`\`\\n\\nIn Celery: \`task.apply_async(queue='gpu')\`. Workers launch with \`celery worker -Q gpu --pool=solo\`."
    },
    {
      "label": "Tenant Isolation",
      "icon": "🔒",
      "content": "Route EU-tenant tasks to EU-region workers for GDPR compliance:\\n\\n\`\`\`json\\n{\\n  \\"pattern\\": \\"tenant.eu.*\\",\\n  \\"queue\\": \\"eu-queue\\",\\n  \\"pool\\": \\"eu-workers\\",\\n  \\"rationale\\": \\"GDPR — data must not leave the EU region\\"\\n}\\n\`\`\`\\n\\nCombined with VPC-level network policies, this gives regulatory isolation without separate deployments."
    },
    {
      "label": "Sticky Cache",
      "icon": "📌",
      "content": "Pin a user's tasks to the same worker to reuse in-memory model weights:\\n\\n\`\`\`python\\nworker_id = hash(user_id) % num_workers\\n# User 42 always hits worker-3 where ML weights are warm\\n\`\`\`\\n\\n**Trade-off:** cache affinity can create hot spots if some users generate far more tasks than others. Monitor per-worker queue depth independently."
    },
    {
      "label": "Temporal Task Queues",
      "icon": "⏱️",
      "content": "Temporal treats task queues as first-class routing primitives — each \`Worker\` subscribes to a named queue:\\n\\n\`\`\`python\\n# Worker subscribes to a specific queue\\nworker = Worker(\\n    client,\\n    task_queue=\\"gpu-tasks\\",\\n    activities=[resize_image]\\n)\\n\\n# Caller routes to that queue\\nawait client.execute_workflow(\\n    ImageWorkflow.run,\\n    task_queue=\\"gpu-tasks\\"\\n)\\n\`\`\`\\n\\nPartitions rebalance automatically when workers join or leave — no manual rule management needed."
    }
  ]
}
\`\`\`

## Graceful Shutdown

Workers must drain in-flight tasks before exiting. Kubernetes sends \`SIGTERM\`, then waits \`terminationGracePeriodSeconds\` (default 30 s) before \`SIGKILL\`.

\`\`\`callout
{
  "type": "warning",
  "title": "Don't Lose Tasks on Rolling Deploy",
  "content": "Without graceful shutdown, a rolling restart can double-execute or silently drop tasks. Always:\\n1. Stop polling new tasks immediately on \`SIGTERM\`\\n2. Set a grace period ≥ 95th-percentile task duration\\n3. Re-enqueue tasks that exceed the grace period before exit\\n4. Deregister from the worker registry before the process exits"
}
\`\`\`

| Time | Action |
|------|--------|
| T = 0 s | \`SIGTERM\` received |
| T = 0 s | Set \`draining = true\`, stop dequeue loop |
| T = 0–30 s | Finish up to N in-flight tasks |
| T = 30 s | Force-stop remaining tasks, re-enqueue them to PENDING |
| T = 31 s | Send final \`worker.exit\` heartbeat, process exits cleanly |

\`\`\`quiz
{
  "title": "Worker Management Quiz",
  "questions": [
    {
      "question": "Your queue depth jumps from 100 to 5,000 in 10 seconds. Which metric should trigger scale-up first?",
      "options": ["CPU utilization > 80%", "Queue depth > 1,000", "Memory usage > 90%", "A worker crash event"],
      "answer": 1,
      "explanation": "Queue depth is the leading indicator — it reflects demand immediately. CPU and memory are lagging: they only spike after workers are already overwhelmed. Autoscale rules fire on queue depth or average wait-time thresholds for fastest response."
    },
    {
      "question": "A worker has been missing heartbeats for 25 seconds. Its in-flight task has been running for 10 minutes. What is the correct action?",
      "options": ["Let the task keep running — it's almost done", "Mark the worker dead and re-enqueue the task", "Kill the worker process via SSH", "Wait another 30 seconds before deciding"],
      "answer": 1,
      "explanation": "25 s typically exceeds the dead threshold (two missed 5 s intervals = suspicion, six = dead). Mark the worker dead and re-enqueue to avoid an infinite stall. The 10-minute runtime is a sunk cost — safety beats optimism here."
    },
    {
      "question": "Which task assignment model removes the scheduler from the task-distribution hot path?",
      "options": ["Push-based (scheduler assigns via RPC)", "Pull-based (workers poll the queue directly)", "Round-robin push with acks", "Priority-aware scheduler push"],
      "answer": 1,
      "explanation": "Pull-based lets workers dequeue directly from the queue service (Redis, RabbitMQ). The scheduler is not involved in per-task assignment — the queue handles fanout. This eliminates a single point of bottleneck and failure."
    },
    {
      "question": "A Kubernetes pod running a worker receives SIGTERM during a rolling deploy. The in-flight task needs 45 more seconds to finish. terminationGracePeriodSeconds = 30. What happens without graceful shutdown logic?",
      "options": ["The task completes — Kubernetes always waits for the process", "The task is killed at T=30 s and lost unless re-enqueued", "The task is checkpointed and replayed on the next pod", "The pod ignores SIGTERM and keeps running until the task finishes"],
      "answer": 1,
      "explanation": "After 30 s, Kubernetes sends SIGKILL and the process dies immediately — no further code runs. Without graceful shutdown that re-enqueues tasks exceeding the grace period, the in-flight task is lost. Fix: set terminationGracePeriodSeconds ≥ 95th-percentile task duration, or re-enqueue on SIGTERM before the deadline."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use dynamic pools with queue-depth and wait-time triggers — these are leading indicators, unlike CPU/memory which lag actual demand",
    "Heartbeat failure detection (30 s timeout) handles crashes; a reaper process handles silently-hung workers — both layers are needed",
    "Pull-based assignment is the simplest scalable default; the queue service handles fanout without the scheduler in the hot path",
    "Route by task type (CPU vs I/O vs GPU), tenant locality, and cache affinity — each dimension may warrant a separate worker pool",
    "Graceful shutdown with a grace period ≥ 95th-percentile task duration is essential for zero-loss rolling deploys in Kubernetes"
  ]
}
\`\`\``,
    },
    {
      id: "scheduler-failures",
      slug: "scheduler-failures",
      title: "Failure Handling & Retries",
      content: `# Failure Handling & Retries

In a distributed task scheduler, failures are not the exception — they are the expectation. Network timeouts, OOM kills, broker crashes, and buggy handlers are guaranteed to happen at scale. The difference between a fragile scheduler and a production-grade one is how gracefully it handles each failure category.

\`\`\`concept
{ "title": "The Three Failure Families", "variant": "mental-model", "content": "**Transient failures** — retry will likely succeed:\\n- Network timeout calling an external API\\n- Database connection pool exhausted (momentarily)\\n- Rate-limited by a third-party service\\n- Temporary disk full on a worker node\\n\\n**Permanent failures** — retry will NOT help:\\n- Invalid input (malformed email, bad JSON payload)\\n- Business logic error (insufficient funds, deleted user)\\n- Bug in the task handler code itself\\n\\n**Infrastructure failures** — the environment broke, not the task:\\n- Worker process killed (OOM, segfault)\\n- Worker machine dies (hardware failure)\\n- Broker/queue becomes unavailable\\n- Network partition between scheduler and workers\\n\\nEach family demands a different response strategy. Blindly retrying permanent failures wastes resources. Giving up on transient failures loses work. Infrastructure failures require orchestrator-level recovery." }
\`\`\`

## Retry with Exponential Backoff

When a transient failure occurs, retrying immediately usually just hits the same overloaded or unavailable service again. Exponential backoff spaces retries further and further apart, giving downstream systems time to recover.

\`\`\`algoviz
{ "title": "Exponential Backoff — Delay Per Attempt", "type": "array", "data": [0, 1, 2, 4, 8, 16], "frames": [ { "highlight": [0], "label": "Attempt 1: execute immediately (delay = 0s)", "stats": {"attempt": 1, "delay_s": 0, "formula": "base * 2^0 = 1 * 1 = 1 → capped at 0 for first"} }, { "highlight": [1], "label": "Attempt 2: wait 1 second before retry", "stats": {"attempt": 2, "delay_s": 1, "formula": "1 * 2^1 = 2 → with jitter ~1"} }, { "highlight": [2], "label": "Attempt 3: wait 2 seconds", "stats": {"attempt": 3, "delay_s": 2, "formula": "1 * 2^2 = 4 → with jitter ~2"} }, { "highlight": [3], "label": "Attempt 4: wait 4 seconds", "stats": {"attempt": 4, "delay_s": 4, "formula": "1 * 2^3 = 8 → with jitter ~4"} }, { "highlight": [4], "label": "Attempt 5: wait 8 seconds", "stats": {"attempt": 5, "delay_s": 8, "formula": "1 * 2^4 = 16 → with jitter ~8"} }, { "highlight": [5], "label": "Attempt 6: wait 16 seconds (approaching max_delay cap)", "stats": {"attempt": 6, "delay_s": 16, "formula": "1 * 2^5 = 32 → capped at 60s"} } ], "speed": 1000 }
\`\`\`

**The thundering herd problem:** without jitter, 100 tasks that all fail at T=0 will all retry at T+1s, T+2s, T+4s — creating synchronized spikes that overwhelm the service trying to recover. Adding random jitter breaks the synchronization.

\`\`\`
delay = min(base_delay * 2^(attempt-1), max_delay)          # pure backoff
delay = random(0, min(base_delay * 2^(attempt-1), max_delay))  # with jitter
\`\`\`

\`\`\`playground
{ "title": "Exponential Backoff Calculator", "language": "python", "code": "import random\\n\\ndef exponential_backoff(attempt, base_delay=1, max_delay=60, jitter=True):\\n    \\"\\"\\"Calculate retry delay with exponential backoff and optional jitter.\\"\\"\\"\\n    raw_delay = min(base_delay * (2 ** (attempt - 1)), max_delay)\\n    \\n    if jitter:\\n        delay = random.uniform(0, raw_delay)\\n    else:\\n        delay = raw_delay\\n    \\n    return round(delay, 2)\\n\\n# Compare jitter vs no-jitter across 6 attempts\\nprint(f\\"{'Attempt':<10} {'No Jitter':>12} {'With Jitter':>12}\\")\\nprint(\\"-\\" * 36)\\nfor i in range(1, 7):\\n    no_jitter = exponential_backoff(i, jitter=False)\\n    with_jitter = exponential_backoff(i, jitter=True)\\n    print(f\\"{i:<10} {no_jitter:>11}s {with_jitter:>11}s\\")", "runnable": true }
\`\`\`

## Idempotency — The Non-Negotiable Constraint

Because queues provide **at-least-once delivery**, any task may execute more than once — on retry, on worker crash recovery, or on broker redelivery. Every task must be written so that running it twice produces the same outcome as running it once.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Non-idempotent — dangerous on retry", "code": "def charge_customer(user_id, amount):\\n    # BUG: charges the customer again on every retry!\\n    balance = get_balance(user_id)\\n    set_balance(user_id, balance - amount)\\n    create_transaction(user_id, -amount)" }, "after": { "label": "Idempotent — safe on retry", "code": "def charge_customer(user_id, amount, idempotency_key):\\n    # Guard: already processed?\\n    existing = db.query(\\n        'SELECT result FROM processed_tasks WHERE key = ?',\\n        idempotency_key\\n    )\\n    if existing:\\n        return existing.result  # Return cached result, no double-charge\\n    \\n    # First execution — process and record atomically\\n    balance = get_balance(user_id)\\n    set_balance(user_id, balance - amount)\\n    result = create_transaction(user_id, -amount)\\n    \\n    db.execute(\\n        'INSERT INTO processed_tasks (key, result) VALUES (?, ?)',\\n        idempotency_key, result\\n    )\\n    return result" } }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Idempotency in the Wild", "content": "Temporal handles workflow-level idempotency automatically — if a workflow crashes and replays, it won't re-execute completed activities. Airflow, by contrast, leaves idempotency entirely to you: the official docs recommend replacing \`INSERT\` with \`UPSERT\`, avoiding \`datetime.now()\`, and reading from specific data partitions rather than 'latest'." }
\`\`\`

## Circuit Breaker Pattern

When a downstream dependency (e.g., an email service) goes down, every task targeting it fails immediately and retries. This floods the recovering service with requests — exactly when it can least handle them. A circuit breaker interrupts this cycle.

\`\`\`sysdiag
{ "title": "Circuit Breaker State Machine", "width": 640, "height": 320, "nodes": [ { "id": "closed", "label": "CLOSED\\nNormal operation", "x": 100, "y": 160, "kind": "service" }, { "id": "open", "label": "OPEN\\nFail fast", "x": 380, "y": 70, "kind": "error" }, { "id": "half", "label": "HALF-OPEN\\nProbing recovery", "x": 380, "y": 250, "kind": "warning" } ], "edges": [ { "from": "closed", "to": "open", "label": "5 failures / 60s" }, { "from": "open", "to": "half", "label": "wait 30s" }, { "from": "half", "to": "closed", "label": "probe succeeds" }, { "from": "half", "to": "open", "label": "probe fails" } ], "annotations": { "closed": "Tasks execute normally. The scheduler monitors the failure rate.", "open": "Tasks are immediately rejected and re-enqueued with a delay (not counted against retry budget). Alert: 'Circuit open for email-service, 500 tasks queued'.", "half": "One test task is allowed through to check if the service recovered. All others are still rejected." } }
\`\`\`

The key distinction: tasks rejected by an open circuit are **re-enqueued with a cooldown delay**, not counted as retry attempts. The circuit protects the retry budget from being consumed by infrastructure failures the task cannot control.

## Poison Pill Detection & Quarantine

A **poison pill** is a task that fails instantly, every time, with the same error — consuming retry budget and blocking workers without any possibility of recovery. Unlike transient failures, no amount of backoff will help.

\`\`\`steps
{ "title": "Poison Pill Detection Pipeline", "steps": [ { "title": "Monitor Failure Signatures", "content": "Track tasks that fail in under 1 second with identical error messages or exception types (e.g., \`NullPointerException\`, \`ParseError\`, \`ValidationError\`). Short execution time + identical error = strong poison pill signal." }, { "title": "Apply Detection Rule", "content": "If a task fails 3+ times with identical errors within a 5-minute window, classify it as \`POISON_PILL\`. Skip remaining retry attempts and move the task to the **dead letter queue (DLQ)** immediately." }, { "title": "Alert & Preserve for Investigation", "content": "Emit an alert: \`Poison pill detected: task-abc, error: NPE at TaskHandler.java:42\`. The DLQ preserves the full task payload, error stack, and metadata — nothing is discarded. Workers are unblocked and continue processing healthy tasks." }, { "title": "Prevention at the Source", "content": "Validate inputs **before enqueueing** to reject obviously bad payloads early. Route untrusted input (user-submitted tasks) through a sandboxed queue with stricter limits. Enforce per-task memory limits and execution timeouts so that misbehaving tasks cannot monopolize workers." } ] }
\`\`\`

## Task Timeout Management

A task that hangs indefinitely is worse than one that fails fast — it holds a worker slot and blocks other work. Setting \`visibility_timeout\` and \`max_execution_time\` correctly requires understanding how they interact.

\`\`\`trace
{ "title": "Timeout Enforcement — Step by Step", "language": "python", "code": "import threading\\n\\ndef execute_with_timeout(task_fn, timeout_sec=120):\\n    result = {\\"status\\": \\"RUNNING\\", \\"error\\": None}\\n    \\n    def run():\\n        try:\\n            task_fn()  # e.g., generate_report()\\n            result[\\"status\\"] = \\"SUCCESS\\"\\n        except Exception as e:\\n            result[\\"status\\"] = \\"FAILED\\"\\n            result[\\"error\\"] = str(e)\\n    \\n    thread = threading.Thread(target=run)\\n    thread.start()\\n    thread.join(timeout=timeout_sec)\\n    \\n    if thread.is_alive():\\n        result[\\"status\\"] = \\"TIMEOUT\\"\\n        result[\\"error\\"] = f\\"Exceeded {timeout_sec}s limit\\"\\n    \\n    return result\\n\\nresult = execute_with_timeout(generate_report, timeout_sec=5)\\nprint(result)", "frames": [ { "line": 3, "vars": {"timeout_sec": 5}, "note": "Task begins. timeout_sec=5 is shorter than the task's actual runtime.", "stdout": "" }, { "line": 6, "vars": {"result": {"status": "RUNNING", "error": null}}, "note": "Result holder initialised. Task hasn't executed yet.", "stdout": "" }, { "line": 14, "vars": {"thread": "<Thread-1 started>"}, "note": "Worker thread spawned. Main thread calls join() with 5-second deadline.", "stdout": "" }, { "line": 15, "vars": {"elapsed": "5.0s"}, "note": "5 seconds elapse. generate_report() is still running inside the thread.", "stdout": "" }, { "line": 17, "vars": {"thread.is_alive()": true}, "note": "join() returned but the thread is still running — timeout hit.", "stdout": "" }, { "line": 18, "vars": {"result": {"status": "TIMEOUT", "error": "Exceeded 5s limit"}}, "note": "Status updated to TIMEOUT. Task is logged for retry or DLQ routing.", "stdout": "" }, { "line": 21, "vars": {"result": {"status": "TIMEOUT", "error": "Exceeded 5s limit"}}, "note": "Result returned to the scheduler. Worker slot freed.", "stdout": "{'status': 'TIMEOUT', 'error': 'Exceeded 5s limit'}" } ], "speed": 1000 }
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "The visibility_timeout Trap", "content": "**visibility_timeout must always be greater than max_execution_time.** If visibility_timeout expires while a worker is still executing, the queue re-delivers the task to a second worker — now both workers execute the same task simultaneously. This causes duplicate side effects even with idempotency logic, and is one of the most common sources of data corruption in distributed schedulers." }
\`\`\`

## Broker Failure Recovery

\`\`\`tabs
{ "tabs": [ { "label": "Redis", "icon": "🔴", "content": "**Without persistence:** all queued tasks and in-flight tasks are lost on crash. Fast but zero durability.\\n\\n**With AOF (Append-Only File):** writes each operation to disk before acknowledging. Survives crashes with minimal data loss. Performance cost: ~10-30% throughput reduction.\\n\\n**With RDB snapshots:** periodic point-in-time snapshots. Fast, but tasks enqueued since the last snapshot are lost on crash.\\n\\n**Redis Sentinel / Cluster:** automatic failover to a replica. Combined with AOF, this is the standard production Redis setup for task queues." }, { "label": "RabbitMQ", "icon": "🐇", "content": "**Durable queues:** messages survive broker restart when both the queue and message are marked durable. The broker writes messages to disk before acknowledging the producer.\\n\\n**Mirrored queues (classic):** queue is replicated across N nodes. If the primary node dies, a mirror is promoted automatically.\\n\\n**Quorum queues (RabbitMQ 3.8+):** Raft-based consensus replication. Stronger durability guarantees than classic mirrors; the recommended choice for new deployments.\\n\\n**Best practice:** use quorum queues + persistent message delivery for any task that must not be lost." }, { "label": "Recovery Strategy", "icon": "🛟", "content": "Even with a resilient broker, store task state in your **primary database** as a backup source of truth:\\n\\n1. On task enqueue → write a \`PENDING\` row to \`task_executions\` table\\n2. On task completion → update row to \`SUCCESS\` or \`FAILED\`\\n3. On broker total loss → a recovery script scans for \`PENDING\` rows older than N minutes and re-enqueues them\\n\\nThis pattern means a complete broker wipe is recoverable in minutes, not hours. It also gives you an audit log of every task execution for free." } ] }
\`\`\`

\`\`\`quiz
{ "title": "Failure Handling — Check Your Understanding", "questions": [ { "question": "What happens to queued tasks if Redis crashes without any persistence configured?", "options": ["Tasks are preserved and restored automatically on restart", "All queued tasks are permanently lost", "Only in-flight tasks are lost; queued tasks survive", "Tasks are automatically moved to a backup queue"], "answer": 1, "explanation": "Without persistence (AOF or RDB), Redis stores all data in memory only. A crash loses every queued task. In-flight tasks that held a visibility lease will also eventually timeout without acknowledgment and be redelivered if the broker recovers — but without persistence there is no broker state to recover from." }, { "question": "100 tasks all fail at T=0 and are scheduled to retry. Without jitter, what problem arises?", "options": ["Tasks are lost because the queue is full", "All 100 tasks retry simultaneously, creating synchronized load spikes that overwhelm the recovering service", "Retries are delayed indefinitely due to queue contention", "Tasks retry in random order, causing priority inversion"], "answer": 1, "explanation": "Without jitter, every task calculates the same backoff delay (e.g., all wait exactly 2s, then 4s, then 8s). This creates synchronized thundering herd spikes that hit the recovering service exactly when it can least handle load. Jitter randomises each task's delay within the backoff window, spreading retries across time." }, { "question": "A task charges a customer's credit card. It runs, charges successfully, but crashes before sending an acknowledgment back to the queue. The queue redelivers it. What prevents a double-charge?", "options": ["Exponential backoff delays the retry long enough to detect the first charge", "An idempotency key stored in the database makes the second execution a no-op", "The circuit breaker blocks the retry", "The dead letter queue captures the retry before it can execute"], "answer": 1, "explanation": "An idempotency key (generated when the task was first enqueued) is stored in the database alongside the result on first execution. On retry, the handler checks for the key before executing — if it exists, it returns the cached result without re-charging. This is the standard pattern for financial operations under at-least-once delivery." }, { "question": "In the circuit breaker pattern, what happens to tasks targeting a service while the circuit is OPEN?", "options": ["They are executed immediately and counted as retry attempts", "They are discarded and a DLQ entry is created", "They are re-enqueued with a cooldown delay, not counted against retry budget", "They block in a wait queue until the circuit closes"], "answer": 2, "explanation": "When the circuit is OPEN, tasks are rejected fast (no execution attempted) and re-enqueued with a cooldown delay. Critically, this re-enqueue is NOT counted as a retry attempt — the task's retry budget is preserved for when the service actually recovers. The circuit protects both the downstream service and the task's retry capacity." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Classify failures before responding: transient failures warrant retries, permanent failures warrant DLQ routing, infrastructure failures require orchestrator-level recovery", "Exponential backoff with random jitter prevents the thundering herd — never retry in lockstep with other tasks", "Every task must be idempotent: at-least-once delivery means any task may execute more than once, and the outcome must be identical each time", "visibility_timeout must exceed max_execution_time — violating this causes simultaneous duplicate execution, not just duplicate delivery", "Circuit breakers protect retry budgets: tasks rejected while a circuit is OPEN should not consume retry attempts", "Store task state in your primary database independently of the broker — this is your recovery path when the broker itself fails" ] }
\`\`\``,
    },
    {
      id: "scheduler-priority",
      slug: "scheduler-priority",
      title: "Priority Queues & Delayed Execution",
      content: `# Priority Queues & Delayed Execution

Scheduling tasks at the right time with the right priority is a core challenge in distributed systems. This lesson covers the data structures and algorithms behind priority scheduling, delayed execution, and recurring task management — and the subtle distributed problems each introduces.

\`\`\`concept
{ "title": "Priority Queue = Min-Heap", "variant": "mental-model", "content": "Think of a min-heap as a tournament bracket that always puts the highest-priority task at the top. Every insertion and deletion keeps the bracket valid in O(log n) time, so a million pending tasks still need only ~20 comparisons. The root is always the next task to run — you never scan the whole queue." }
\`\`\`

## Min-Heap for Priority Scheduling

A min-heap efficiently selects the next task to execute. Tasks are ordered by \`(priority, scheduled_time)\` — lower priority number wins, ties broken by earliest scheduled time.

\`\`\`algoviz
{ "title": "Min-Heap: 5 Tasks, Priority-Ordered", "type": "array", "data": ["(1,10:00,payment)", "(2,10:01,email)", "(2,10:00,webhook)", "(3,10:00,thumbnail)", "(3,10:02,report)"], "frames": [ { "highlight": [0], "label": "Root = highest-priority task (priority 1, payment)", "stats": { "size": 5 } }, { "highlight": [0, 1, 2], "label": "Children must be ≥ parent — heap property holds", "stats": { "size": 5 } }, { "highlight": [0], "label": "Peek next task: O(1) — just read the root", "stats": { "size": 5 } }, { "highlight": [0, 4], "label": "Pop root, sift last element up: O(log n) re-heapify", "stats": { "size": 4 } }, { "highlight": [0], "label": "New root: (2,10:00,webhook) — tie broken by time", "stats": { "size": 4 } } ], "speed": 1000 }
\`\`\`

**Complexity summary:**

| Operation | Complexity | Notes |
|-----------|-----------|-------|
| Insert task | O(log n) | Bubble up |
| Peek next task | O(1) | Root read |
| Remove next | O(log n) | Sift down after swap |
| Build heap from n tasks | O(n) | Floyd's algorithm |

For 1 million pending tasks: log₂(1,000,000) ≈ 20 comparisons per insert or remove.

\`\`\`callout
{ "type": "warning", "title": "Priority Inversion in Distributed Queues", "content": "In a distributed setting, a single shared heap becomes a bottleneck. Instead, each worker maintains a local priority queue and pulls from partitioned Redis sorted sets (which are backed by skip lists, not heaps). The effective complexity stays O(log n) but you gain horizontal scalability at the cost of global ordering guarantees." }
\`\`\`

## Time-Wheel Algorithm

For delayed tasks at massive scale, a **time wheel** provides O(1) insertion and O(1) expiration — far better than a heap when most timers fire within a bounded window.

\`\`\`concept
{ "title": "Timing Wheel = Circular Clock", "variant": "analogy", "content": "A timing wheel is like a clock face with buckets instead of minutes. The hand advances one slot per tick. Tasks are dropped into the bucket at their target slot. When the hand reaches a bucket, every task inside fires instantly — no sorting needed." }
\`\`\`

\`\`\`algoviz
{ "title": "60-Slot Time Wheel (1 slot = 1 second)", "type": "array", "data": ["[A]", "[ ]", "[B,C]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]"], "frames": [ { "highlight": [0], "label": "Pointer at slot 0 — task A fires now", "stats": { "t": 0 } }, { "highlight": [7], "label": "Insert task E (delay=7s): target = (0+7) mod 60 = slot 7", "stats": { "t": 0 } }, { "highlight": [1], "label": "Tick: pointer advances to slot 1 — empty, nothing fires", "stats": { "t": 1 } }, { "highlight": [2], "label": "Tick: slot 2 — tasks B and C both fire, O(1) per task", "stats": { "t": 2 } }, { "highlight": [7], "label": "Tick: slot 7 — task E fires right on schedule", "stats": { "t": 7 } } ], "speed": 800 }
\`\`\`

**Insert formula:** \`target_slot = (current_slot + delay_seconds) mod wheel_size\`

**Performance vs. heap:**

| | Min-Heap | Timing Wheel |
|---|---|---|
| Insert | O(log n) | O(1) |
| Timer expiry | O(log n) | O(1) amortized |
| Memory | O(n tasks) | O(slots + tasks) |
| Best for | Variable priorities | Short-lived, high-volume timers |

**Hierarchical wheels for long delays:**

When delay > 60 s, cascade across levels:
- Level 1: 60 slots × 1 s = 1 minute range
- Level 2: 60 slots × 1 min = 1 hour range
- Level 3: 24 slots × 1 h = 1 day range

"Execute in 90 seconds" → insert at Level 2, slot 1. When that fires, move the task to Level 1, slot 30 (remaining 30 s).

\`\`\`callout
{ "type": "tip", "title": "Real-World Usage", "content": "Timing wheels are used by the Linux kernel timer subsystem, Kafka's delayed message mechanism, and Netty's HashedWheelTimer. If 90% of your tasks fire within a few minutes and you need millions of concurrent timers, a timing wheel beats a priority queue on both CPU and memory." }
\`\`\`

## Cron Expression Scheduling

Recurring tasks use cron expressions to define their schedule. The five fields are evaluated in sequence — a task fires when all fields match the current time.

\`\`\`tabs
{ "tabs": [ { "label": "Syntax", "icon": "📋", "content": "\`\`\`\\n+----------- minute (0-59)\\n| +--------- hour (0-23)\\n| | +------- day of month (1-31)\\n| | | +----- month (1-12)\\n| | | | +--- day of week (0-6, Sun=0)\\n| | | | |\\n* * * * *\\n\`\`\`" }, { "label": "Examples", "icon": "🕐", "content": "| Expression | Meaning |\\n|---|---|\\n| \`0 2 * * *\` | Daily at 2:00 AM |\\n| \`*/5 * * * *\` | Every 5 minutes |\\n| \`0 9 * * 1-5\` | Weekdays at 9:00 AM |\\n| \`0 0 1 * *\` | First of every month at midnight |\\n| \`0 */6 * * *\` | Every 6 hours |\\n| \`30 8 * * 1\` | Mondays at 8:30 AM |" }, { "label": "Overlap Handling", "icon": "⚠️", "content": "When the previous execution is still running when the next fires, you have three choices:\\n\\n**Option A — Skip:** Don't start an overlapping instance. Safe but can silently miss runs.\\n\\n**Option B — Queue:** Wait for the previous run to finish, then start. Can cause a backlog.\\n\\n**Option C — Allow concurrent:** Run multiple instances simultaneously. Dangerous — only valid if the job is fully idempotent.\\n\\nAirflow defaults to **skip** (via \`max_active_runs=1\`). Most production systems choose skip or queue." } ] }
\`\`\`

**Cron scheduler algorithm:**

\`\`\`steps
{ "title": "How a Cron Scheduler Loops", "steps": [ { "title": "Parse & Pre-compute", "content": "For each registered cron task, parse the expression and calculate \`next_execution_time\`. Insert into the delay queue with that timestamp." }, { "title": "Wait for Next Fire", "content": "The delay queue (or timing wheel) wakes the scheduler when \`now >= next_execution_time\` for any task." }, { "title": "Execute", "content": "Dequeue the task and dispatch it to a worker. Record the actual start time for overlap detection." }, { "title": "Re-schedule", "content": "Calculate the NEXT execution time from the cron expression (not from actual completion — drift prevention). Re-insert into the delay queue." }, { "title": "Handle Overlap", "content": "Before step 3, check if the previous instance is still running. Apply the chosen overlap policy: skip, queue, or allow concurrent." } ] }
\`\`\`

\`\`\`playground
{ "title": "Next Cron Run Calculator", "language": "python", "runnable": true, "code": "from croniter import croniter\\nfrom datetime import datetime\\n\\ndef next_runs(expr, n=5):\\n    base = datetime(2024, 6, 1, 8, 0)\\n    cron = croniter(expr, base)\\n    for _ in range(n):\\n        print(cron.get_next(datetime))\\n\\nprint('Every 5 minutes:')\\nnext_runs('*/5 * * * *')\\n\\nprint('\\\\n9 AM weekdays:')\\nnext_runs('0 9 * * 1-5')\\n\\nprint('\\\\nFirst of month midnight:')\\nnext_runs('0 0 1 * *')" }
\`\`\`

## Distributed Cron Challenges

Running cron across multiple scheduler nodes introduces a deceptively simple-looking problem: **every node fires at the same time**.

**The scenario:** 3 scheduler nodes, cron task \`daily_report\` at 2:00 AM.
All three fire simultaneously → 3 copies of the same report, 3× database load, 3× email sends.

Three solutions exist, each with different trade-offs:

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "No Coordination (3× execution)", "code": "# Node 1\\nif now == '02:00':\\n    run_daily_report()\\n\\n# Node 2\\nif now == '02:00':\\n    run_daily_report()\\n\\n# Node 3\\nif now == '02:00':\\n    run_daily_report()\\n# All three fire simultaneously. Report generated 3x." }, "after": { "label": "Distributed Lock (1× execution)", "code": "# Any node (Redis SET NX = atomic compare-and-set)\\nif now == '02:00':\\n    lock = redis.set(\\n        'lock:daily_report',\\n        NODE_ID,\\n        nx=True,   # Only set if Not eXists\\n        ex=60      # Expire after 60s (safety)\\n    )\\n    if lock:\\n        run_daily_report()\\n    # else: another node holds the lock, skip" } }
\`\`\`

**Three coordination strategies:**

| Strategy | How It Works | Used By | Trade-off |
|---|---|---|---|
| Leader election | One node is "cron leader"; only leader fires | Airflow (DB locking) | Leader is a SPOF |
| Distributed lock | Redis \`SET NX EX\` before each execution | Custom implementations | Lock expiry must exceed max job duration |
| Consistent hashing | \`hash(task_name) mod N\` assigns ownership | Temporal, Kafka-based | Rebalancing on node add/remove |

\`\`\`callout
{ "type": "danger", "title": "Lock TTL Must Exceed Job Duration", "content": "If you set \`ex=60\` (60-second lock) but \`run_daily_report()\` takes 3 minutes, the lock expires while the job runs. A second node grabs the lock and launches a duplicate. Set lock TTL to \`expected_max_duration * 1.5\`, and use a heartbeat to extend the lock if the job is still running." }
\`\`\`

## Task Dependencies (DAG Scheduling)

Complex pipelines have tasks that depend on each other. A Directed Acyclic Graph (DAG) expresses these relationships — Airflow is built entirely on this model.

\`\`\`mermaid
graph TD
    A[extract_api] --> B[transform_data]
    A --> C[validate_data]
    B --> D[load_to_dw]
    C --> D
    D --> E[notify_team]
\`\`\`

**Execution rules for the DAG above:**
1. \`extract_api\` — no dependencies, runs immediately
2. \`transform_data\` and \`validate_data\` — both depend on \`extract_api\`, run **in parallel** after it succeeds
3. \`load_to_dw\` — requires **both** transform and validate to succeed
4. \`notify_team\` — runs after \`load_to_dw\` succeeds

\`\`\`trace
{ "title": "DAG Scheduler Walk-Through", "language": "python", "code": "graph = {\\n  'extract':   [],\\n  'transform': ['extract'],\\n  'validate':  ['extract'],\\n  'load':      ['transform', 'validate'],\\n  'notify':    ['load']\\n}\\n\\ncomplete = set()\\nready = [t for t, deps in graph.items() if not deps]\\nprint('Initial ready:', ready)\\n\\nfor step in ['extract', 'validate', 'transform', 'load', 'notify']:\\n    complete.add(step)\\n    newly_ready = [\\n        t for t, deps in graph.items()\\n        if t not in complete and set(deps) <= complete\\n    ]\\n    print(f'After {step} -> ready: {newly_ready}')", "frames": [ { "line": 9, "vars": { "ready": ["extract"], "complete": "{}" }, "stdout": "Initial ready: ['extract']\\n", "note": "Only extract_api has no deps — it's the only entry point" }, { "line": 12, "vars": { "step": "extract", "complete": "{'extract'}", "newly_ready": ["transform", "validate"] }, "stdout": "After extract -> ready: ['transform', 'validate']\\n", "note": "Both downstream tasks unlock simultaneously — execute in parallel" }, { "line": 12, "vars": { "step": "validate", "complete": "{'extract','validate'}", "newly_ready": [] }, "stdout": "After validate -> ready: []\\n", "note": "load needs transform too — not ready yet" }, { "line": 12, "vars": { "step": "transform", "complete": "{'extract','validate','transform'}", "newly_ready": ["load"] }, "stdout": "After transform -> ready: ['load']\\n", "note": "Now both transform and validate are done — load unlocks" }, { "line": 12, "vars": { "step": "load", "complete": "{'extract','validate','transform','load'}", "newly_ready": ["notify"] }, "stdout": "After load -> ready: ['notify']\\n", "note": "Final task unlocks — pipeline completes" } ], "speed": 900 }
\`\`\`

**Failure propagation:** When a task fails, all downstream tasks are marked \`BLOCKED\`. The scheduler can retry the failed task (with backoff) or alert for manual intervention. This is why Airflow's DAG view colors blocked tasks differently from truly failed ones.

\`\`\`quiz
{ "title": "Priority Queues & Scheduling Check", "questions": [ { "question": "You have 4 million pending tasks in a min-heap. Roughly how many comparisons does a single insert need?", "options": ["~10", "~22", "~32", "~64"], "answer": 1, "explanation": "log₂(4,000,000) ≈ 21.9, so ~22 comparisons. This is why priority queues scale so well — doubling the task count only adds one more comparison." }, { "question": "A timing wheel has 60 slots (1s each). You want to schedule a task 90 seconds from now. What is the correct approach?", "options": ["Insert at slot (current + 90) mod 60", "Use a hierarchical wheel — insert at level-2 slot 1, then cascade", "Fall back to a min-heap for delays > 60s", "Reject the task — it exceeds the wheel range"], "answer": 1, "explanation": "Hierarchical wheels cascade long delays. Insert at level-2 slot 1 (1 minute). When that fires, the remaining 30 seconds goes to level-1 slot 30. This keeps O(1) insertion intact." }, { "question": "Your cron lock TTL is 30 seconds, but the daily report job takes 2 minutes. What happens?", "options": ["The lock renews automatically", "A second node grabs the lock mid-run and launches a duplicate", "The job is killed at 30 seconds", "Nothing — the lock persists until the job completes"], "answer": 1, "explanation": "Redis TTL is wall-clock time, not job-aware. After 30s the key expires. Another node can then SET NX and launch a duplicate run. Fix: set TTL to max_expected_duration × 1.5, and use a heartbeat loop to extend the lock while the job is still running." }, { "question": "In a DAG scheduler, task C depends on tasks A and B. A completes but B fails. What happens to C?", "options": ["C runs using only A's output", "C is marked BLOCKED and waits for B to be retried or fixed", "C is immediately skipped", "C starts with partial input"], "answer": 1, "explanation": "A DAG scheduler marks C as BLOCKED because not all its dependencies have succeeded. The scheduler will retry B (with backoff) or alert for intervention. C will only become RUNNABLE once all upstream dependencies are in a succeeded state." }, { "question": "Which tool was specifically designed around durable execution with event sourcing, making worker crashes transparent to the workflow?", "options": ["Celery", "Airflow", "Temporal", "Redis Streams"], "answer": 2, "explanation": "Temporal's architecture centers on recording every workflow action to an append-only event history. If a worker crashes mid-execution, a new worker replays that history and resumes from exactly where it left off — no manual retry logic required." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Min-heaps give O(log n) insert/delete and O(1) peek — ideal for priority scheduling across millions of tasks.", "Timing wheels provide O(1) insert and expiry for short-lived timers; hierarchical wheels extend the range to days without sacrificing performance.", "Cron in distributed systems needs coordination (leader election, distributed locks, or consistent hashing) to prevent duplicate execution.", "Lock TTL must exceed the maximum job duration — use a heartbeat to extend it for long-running tasks.", "DAG schedulers unlock downstream tasks as their dependencies complete, enabling maximal parallelism while respecting order constraints.", "Choose the mechanism that matches your workload: simple jobs → priority queue; time-sensitive at scale → timing wheel; recurring jobs → cron with locking; complex pipelines → DAG with dependency tracking." ] }
\`\`\``,
    },
    {
      id: "scheduler-architecture",
      slug: "scheduler-architecture",
      title: "Task Scheduler: Architecture Walkthrough",
      content: `# Task Scheduler: Architecture Walkthrough

Let's stitch every component into one end-to-end distributed task scheduler and see how it stacks up against Celery, Airflow, and Temporal.

\`\`\`concept
{ "title": "The Four Pillars of a Distributed Scheduler", "variant": "mental-model", "content": "Think of the system as four loosely-coupled micro-services:\\n\\n1. **Scheduler Service** — the air-traffic controller that accepts, validates, and routes every task.\\n2. **Task Queues** — the holding pens (Redis/RabbitMQ) that buffer work until a worker is ready.\\n3. **Worker Pools** — the engines that pull and execute tasks, reporting heartbeats and results.\\n4. **State Store** — the single source of truth (PostgreSQL/DynamoDB) that remembers every task's life story.\\n\\nIf any pillar fails, the others keep the sky open — provided you designed for idempotency and at-least-once delivery." }
\`\`\`

## End-to-End Walk-through

### Write Path — Submitting a Task

\`\`\`steps
{ "title": "From POST to Queue in 4 Steps", "steps": [ { "title": "Client POST", "content": "Client sends a task request with type, payload, priority, and an idempotency key:\\n\\n\`\`\`json\\nPOST /tasks\\n{\\n  \\"type\\": \\"send_email\\",\\n  \\"payload\\": {\\"to\\": \\"user@x.com\\", \\"subject\\": \\"Welcome\\"},\\n  \\"priority\\": \\"high\\",\\n  \\"idempotency_key\\": \\"uuid-123\\"\\n}\\n\`\`\`" }, { "title": "API Gateway", "content": "- Schema validation — reject malformed payloads at the edge\\n- Rate-limit check per client/API key\\n- Idempotency lookup in PostgreSQL — if the key already exists, return \`200\` with the original \`task_id\` without inserting new work" }, { "title": "Scheduler Service", "content": "- Generates a UUIDv7 (time-sortable) \`task_id\`\\n- \`INSERT INTO tasks (id, type, status, payload, priority, created_at)\`\\n- If \`scheduled_at\` is NULL → \`LPUSH high_queue\` (immediate)\\n- If \`scheduled_at\` is set → \`ZADD delay_queue <epoch_ms> task_id\` (deferred)\\n\\n**Durability rule:** always write PostgreSQL before enqueuing Redis. If Redis crashes right after, the task survives in the durable ledger and can be re-enqueued by the reaper." }, { "title": "Response to Client", "content": "\`\`\`json\\n{\\"task_id\\": \\"task-abc\\", \\"status\\": \\"pending\\"}\\n\`\`\`\\nThe client polls \`GET /tasks/task-abc\` or subscribes via WebSocket for real-time status updates." } ] }
\`\`\`

\`\`\`algoviz
{ "title": "Priority Queue Routing — Where Does the Task Land?", "type": "array", "data": [10, 5, 1, 0], "frames": [ { "highlight": [], "label": "Four queue slots scored by urgency: high(10), medium(5), low(1), delay(0 = deferred)", "stats": { "incoming": "send_email", "priority": "high", "scheduled_at": "null" } }, { "highlight": [0], "label": "priority=high AND scheduled_at=null → LPUSH high_queue (score 10)", "stats": { "chosen": "high_queue", "op": "LPUSH" } }, { "highlight": [3], "label": "scheduled_at=future timestamp → ZADD delay_queue with epoch score", "stats": { "incoming": "report_gen", "priority": "low", "scheduled_at": "1718000000", "op": "ZADD" } }, { "highlight": [1], "label": "priority=medium, no delay → LPUSH med_queue (score 5)", "stats": { "incoming": "resize_image", "chosen": "med_queue", "op": "LPUSH" } } ], "speed": 900 }
\`\`\`

### Read Path — Worker Executes

\`\`\`trace
{ "title": "Worker Pull → Claim → Run → Ack", "language": "python", "code": "import redis, psycopg2, json\\n\\nconn = psycopg2.connect(...)\\nr = redis.Redis(...)\\n\\ndef worker_loop():\\n    while True:\\n        # 1. Priority-aware blocking pop\\n        _queue, payload = r.brpop(\\n            ['high_queue', 'med_queue', 'low_queue'], timeout=30\\n        )\\n        task = json.loads(payload)\\n\\n        with conn.cursor() as cur:\\n            # 2. Claim via CAS: PENDING -> RUNNING\\n            cur.execute(\\n                \\"UPDATE tasks SET status='RUNNING', worker_id=%s, \\"\\n                \\"started_at=NOW() WHERE id=%s AND status='PENDING' RETURNING id;\\",\\n                (WORKER_ID, task['id'])\\n            )\\n            if cur.rowcount == 0:  # another worker claimed it\\n                continue\\n\\n            try:\\n                # 3. Execute handler\\n                result = registry[task['type']](task['payload'])\\n\\n                # 4a. Success path\\n                cur.execute(\\n                    \\"UPDATE tasks SET status='SUCCEEDED', result=%s, \\"\\n                    \\"completed_at=NOW() WHERE id=%s;\\",\\n                    (json.dumps(result), task['id'])\\n                )\\n                r.lrem(_queue, 1, payload)  # ACK\\n            except Exception as e:\\n                # 4b. Failure path - retry counter or DLQ\\n                handle_failure(task, e)\\n\\n        conn.commit()", "frames": [ { "line": 8, "vars": { "_queue": "high_queue", "task": { "id": "task-abc", "type": "send_email", "payload": { "to": "user@x.com" } } }, "note": "brpop checks high_queue first; blocks up to 30 s if all queues empty" }, { "line": 15, "vars": { "WORKER_ID": "worker-3", "cur.rowcount": 1 }, "note": "CAS UPDATE: only succeeds if status is still PENDING — prevents two workers running the same task" }, { "line": 23, "vars": { "result": { "sent": true, "msgId": "msg-42" } }, "stdout": "Email sent to user@x.com\\n", "note": "Handler returns success; result ready to persist" }, { "line": 26, "vars": { "status": "SUCCEEDED" }, "note": "Task durably marked SUCCEEDED in PostgreSQL; LREM removes it from Redis (explicit ACK)" } ], "speed": 900 }
\`\`\`

## Failure Handling in Production

\`\`\`callout
{ "type": "warning", "title": "Exactly-Once Is a Myth in Distributed Systems", "content": "Distributed systems can guarantee *at-least-once* delivery at best. Your task handler **must** be idempotent — safe to run twice with the same observable outcome. Use idempotency keys, deduplicate via \`INSERT ... ON CONFLICT DO NOTHING\`, or design operations that are naturally repeatable (e.g., setting a value rather than incrementing it)." }
\`\`\`

The two most common failure modes in production are **worker crash** (task stuck in \`RUNNING\`) and **scheduler crash** (delay-queue tasks not promoted). Both are recoverable via a reaper process:

- A **reaper** scans PostgreSQL for tasks in \`RUNNING\` state whose last heartbeat exceeds the visibility timeout (e.g., 30 s). It resets them to \`PENDING\` and re-enqueues.
- A **watchdog** promotes \`delay_queue\` tasks whose \`scheduled_at\` has elapsed but weren't dequeued due to a scheduler outage — using \`ZADD\` score ordering and \`FOR UPDATE SKIP LOCKED\` to allow multiple scheduler replicas to poll safely without conflicts.

\`\`\`sysdiag
{ "title": "Failure Detection & Recovery Architecture", "width": 720, "height": 340, "nodes": [ { "id": "worker", "label": "Worker-3", "x": 110, "y": 80, "kind": "service" }, { "id": "sched", "label": "Scheduler", "x": 310, "y": 80, "kind": "service" }, { "id": "redis", "label": "Redis (AOF)", "x": 520, "y": 80, "kind": "datastore" }, { "id": "db", "label": "PostgreSQL", "x": 620, "y": 220, "kind": "datastore" }, { "id": "reaper", "label": "Reaper", "x": 110, "y": 230, "kind": "service" }, { "id": "standby", "label": "Standby Scheduler", "x": 310, "y": 230, "kind": "service" } ], "edges": [ { "from": "worker", "to": "sched", "label": "heartbeat 5 s" }, { "from": "sched", "to": "redis", "label": "LPUSH / ZADD" }, { "from": "sched", "to": "db", "label": "write state" }, { "from": "reaper", "to": "db", "label": "scan RUNNING > 30 s", "style": "dashed" }, { "from": "reaper", "to": "redis", "label": "re-enqueue", "style": "dashed" }, { "from": "standby", "to": "sched", "label": "leader election", "style": "dashed" } ], "annotations": { "worker": "Sends heartbeat every 5 s. Reaper resets tasks if heartbeat stops > 30 s.", "redis": "Append-Only File (AOF) + replica keep un-acked messages durable across crashes.", "db": "WAL + hot standby are the authoritative ledger; reaper reads here.", "reaper": "Periodic job: SELECT stuck RUNNING tasks, reset to PENDING, re-enqueue to Redis.", "standby": "Wins leader election if the primary scheduler fails its health check." } }
\`\`\`

## Monitoring the Beast

Key dashboards you'll be staring at during an outage:

| Metric | Normal | Page When |
|---|---|---|
| \`queue_depth\` (high) | < 50 | > 200 |
| \`queue_wait_time_p99\` | < 2 s | > 5 s |
| \`retry_rate\` | < 5% | > 10% |
| \`workers_dead\` | 0 | > 0 |
| \`dlq_depth\` | 0 | > 0 |
| \`scheduler_lag\` | < 1 s | > 5 s |

A rising \`queue_depth\` paired with a flat \`workers_dead\` count usually means task handlers are slow or stuck — look at \`queue_wait_time_p99\` first. If \`dlq_depth\` climbs, you have a class of tasks failing all retries; inspect DLQ payloads immediately.

## Choosing the Right Tool

\`\`\`tabs
{ "tabs": [ { "label": "Celery", "icon": "🐍", "content": "**Best for:** Background tasks embedded inside a Python web app (Django, FastAPI).\\n\\n**Strengths:**\\n- Fire-and-forget simplicity with minimal setup\\n- Supports Redis or RabbitMQ as broker\\n- Rich built-ins: retries, rate limiting, periodic tasks (Celery Beat)\\n- Large, well-documented community\\n\\n**Limitations:**\\n- Multi-datacenter coordination requires significant extra effort\\n- No built-in DAG dependency tracking\\n- Retry semantics are at-least-once; idempotency is the developer's responsibility\\n- Harder to operate at very high task volumes (100 k+ tasks/s)" }, { "label": "Airflow", "icon": "🌊", "content": "**Best for:** Data pipelines, ETL workflows, and cron-like scheduled batch jobs.\\n\\n**Strengths:**\\n- DAG-based dependency graph with a rich web UI\\n- Python-native operators and extensible hooks\\n- Calendar and cron scheduling built in\\n- Strong Apache community and ecosystem\\n\\n**Limitations:**\\n- Not designed for long-lived or event-driven workflows\\n- Scheduler DB issues can require manual backfills to recover missed runs\\n- Airflow cannot guarantee exactly-once; tasks must be idempotent\\n- Sensors for external waits are themselves task runs, adding scheduling overhead" }, { "label": "Temporal", "icon": "⏱️", "content": "**Best for:** Long-lived, durable workflows where automatic replay and near-exactly-once semantics matter.\\n\\n**Strengths:**\\n- Durable execution: worker crash = workflow pauses, not fails — resumes exactly where it left off\\n- Deterministic replay from event history\\n- Activity retries are first-class (not config params) — a failure never directly causes a workflow failure\\n- Built-in timers of arbitrary duration without polling sensors\\n\\n**Limitations:**\\n- Higher operational complexity (you run a Temporal cluster)\\n- Workflow code must be deterministic — no \`random\`, no \`datetime.now()\` calls\\n- Overkill for simple fire-and-forget background jobs" }, { "label": "Custom Build", "icon": "🔧", "content": "**Build your own only when:**\\n- You need > 1 M tasks/sec and must shard queues across multiple regions\\n- Per-task SLAs or complex priority inheritance exceed off-the-shelf retry models\\n- State must live in an existing multi-region DB with custom consistency guarantees\\n- Existing tools' hard-coded retry/timeout models cannot represent your failure domain\\n\\n**Default to Celery or Temporal first.** Custom schedulers carry high build cost and higher maintenance cost. The threshold to justify custom is throughput, SLA, or state-storage constraints that no managed tool can meet." } ] }
\`\`\`

\`\`\`quiz
{ "title": "Architecture Pop-Quiz", "questions": [ { "question": "Why do we INSERT into PostgreSQL **before** enqueueing to Redis?", "options": [ "To make the task immediately visible to workers", "To guarantee durability even if Redis crashes after the write", "To satisfy foreign-key constraints inside Redis", "To generate the task_id using a DB sequence" ], "answer": 1, "explanation": "PostgreSQL is the durable ledger; Redis is a transient work signal. If Redis crashes right after INSERT but before LPUSH, the task survives in the DB and the reaper can re-enqueue it. If we wrote Redis first and the DB write failed, the task would execute with no record of it ever existing." }, { "question": "A worker crashes mid-execution. Which mechanism detects and recovers the in-flight task?", "options": [ "Redis TTL expiry on the queue entry", "The reaper scanning PostgreSQL for RUNNING tasks past their heartbeat timeout", "The API Gateway polling for pending responses", "Redis Sentinel promoting a new replica" ], "answer": 1, "explanation": "The reaper periodically queries PostgreSQL for tasks stuck in RUNNING beyond the heartbeat window (e.g., 30 s since last heartbeat) and resets them to PENDING for re-queue. Redis Sentinel handles Redis-level HA, not application-level task recovery — that's the application's responsibility." }, { "question": "What guarantees idempotency in the write path?", "options": [ "UUIDv7 task_id uniqueness", "The idempotency_key looked up in PostgreSQL before any INSERT", "Redis LPUSH atomicity", "Worker ACK after task completion" ], "answer": 1, "explanation": "The idempotency_key is checked in PostgreSQL before creating any new task record. Duplicate client retries return the original task_id without inserting new work. UUIDv7 prevents ID collisions between distinct tasks but does not deduplicate retries of the same logical request." }, { "question": "Which failure scenario is **not** covered by Redis Sentinel?", "options": [ "Redis master crash", "Network partition isolating clients from the master", "Split-brain resulting in two masters being elected", "A poison-pill task crashing multiple workers in sequence" ], "answer": 3, "explanation": "Sentinel handles Redis-level HA failures. A poison-pill task is an application concern — the task handler crashes the worker process, not Redis. This must be mitigated at the application layer: DLQs, per-task failure counters, and fast-fail limits that cap how many times a single task can be retried before being routed to the DLQ." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Durability first: write the task to PostgreSQL before enqueueing to Redis — the DB is the ledger, Redis is just the execution signal.", "At-least-once delivery plus idempotent handlers equals safe retries — exactly-once delivery is not achievable in distributed systems.", "Separate queues by priority; pool workers by capability (GPU, I/O-bound, CPU-bound) so heavy tasks don't starve light ones.", "Use heartbeats and a reaper process to detect crashed workers and automatically re-queue stuck RUNNING tasks — never rely on workers to self-report failures.", "Celery for Python background tasks, Airflow for DAG-based batch pipelines, Temporal for durable long-lived workflows — build custom only when throughput, per-task SLAs, or state-storage constraints force your hand." ] }
\`\`\``,
    },
  ],
};
