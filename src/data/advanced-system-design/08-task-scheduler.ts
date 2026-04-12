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

A distributed task scheduler accepts, queues, and executes tasks across a fleet of worker machines. Systems like Celery, Airflow, Temporal, and cloud services like AWS Step Functions power the background processing of nearly every large-scale application.

## The Problem

Modern applications need to execute work outside the request-response cycle. Sending emails, processing images, generating reports, running ML pipelines, retrying failed payments -- all of these are tasks that must happen reliably in the background.

\`\`\`concept
{
  "title": "Synchronous vs Asynchronous Processing",
  "variant": "analogy",
  "content": "Think of a coffee shop. Synchronous is like ordering a complex latte and waiting at the counter while the barista makes it. Asynchronous is ordering, getting a buzzer, and coming back when it's ready. The shop can serve more customers, and you can do other things while waiting."
}
\`\`\`

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Synchronous (bad)",
    "code": "User clicks \\"Export Report\\"\\nServer generates 500MB CSV (takes 45 seconds)\\nUser stares at loading spinner\\nHTTP timeout at 30 seconds\\nUser gets an error"
  },
  "after": {
    "label": "Asynchronous (good)",
    "code": "User clicks \\"Export Report\\"\\nServer enqueues task: \\"generate_report(user_id=42)\\"\\nReturns immediately: \\"Your report is being generated\\"\\nWorker picks up task, generates CSV in background\\nNotifies user when complete (email, push notification)\\nResponse time: < 200ms"
  }
}
\`\`\`

## Types of Tasks

\`\`\`tabs
{
  "tabs": [
    {
      "label": "One-time",
      "icon": "🚀",
      "content": "**Fire-and-forget tasks**\\n\\nExample: \\"Send welcome email to user_42\\"\\n\\n- Execute once, as soon as possible\\n- No scheduling constraints\\n- Most common type in web applications\\n- Typical volume: 1000s per minute"
    },
    {
      "label": "Delayed",
      "icon": "⏰",
      "content": "**Scheduled for future execution**\\n\\nExample: \\"Send reminder email in 24 hours\\"\\n\\n- Execute once, but not until specified time\\n- Requires time-based queue or scheduler\\n- Common for reminders, follow-ups, cleanup jobs\\n- Must survive system restarts"
    },
    {
      "label": "Recurring",
      "icon": "🔄",
      "content": "**Cron-like scheduled tasks**\\n\\nExample: \\"Generate daily sales report at 2:00 AM UTC\\"\\n\\n- Execute repeatedly on a schedule\\n- Requires cron expression parser\\n- Must handle clock changes, DST transitions\\n- Often used for batch processing, maintenance"
    },
    {
      "label": "Workflow/DAG",
      "icon": "🕸️",
      "content": "**Tasks with dependencies**\\n\\nExample pipeline:\\n1. \\"Download data\\"\\n2. \\"Transform data (depends on Step 1)\\"\\n3. \\"Load into warehouse (depends on Step 2)\\"\\n\\n- Directed Acyclic Graph execution\\n- Must track task completion states\\n- Enables parallel execution where possible\\n- Critical for ETL and ML pipelines"
    },
    {
      "label": "Priority",
      "icon": "⚡",
      "content": "**Urgency-based execution**\\n\\nExamples:\\n- \\"Process payment\\" (high priority)\\n- \\"Generate thumbnail\\" (low priority)\\n\\n- Multiple priority queues\\n- Preemptive scheduling for critical tasks\\n- Prevents important work from being starved\\n- Common in payment processing, notifications"
    }
  ]
}
\`\`\`

## Functional Requirements

1. **Submit(task)** -- Enqueue a task for execution
2. **Schedule(task, time)** -- Enqueue a task for future execution
3. **Cron(task, expression)** -- Register a recurring task
4. **Cancel(task_id)** -- Cancel a pending or running task
5. **Status(task_id)** -- Query the current state of a task
6. **Retry(task_id)** -- Re-enqueue a failed task
7. Support for **task priorities** (high, medium, low)
8. Support for **task dependencies** (DAG execution)

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Throughput | 100,000+ tasks/sec enqueue |
| Execution latency | < 100ms from enqueue to worker pickup (for immediate tasks) |
| Reliability | At-least-once delivery (no task silently lost) |
| Scalability | Horizontal -- add workers to increase capacity |
| Durability | Tasks survive broker/scheduler crashes |
| Ordering | Best-effort FIFO within same priority |
| Visibility | Full task lifecycle tracking (pending, running, succeeded, failed) |

## Task Lifecycle

\`\`\`algoviz
{
  "title": "Task State Transitions",
  "type": "array",
  "data": ["PENDING", "SCHEDULED", "RUNNING", "SUCCEEDED", "FAILED", "CANCELLED", "RETRYING", "DEAD_LETTER"],
  "frames": [
    {
      "highlight": [0, 1],
      "label": "Task submitted or scheduled",
      "stats": {"state": "PENDING -> SCHEDULED"}
    },
    {
      "highlight": [1, 2],
      "label": "Worker picks up task",
      "stats": {"state": "SCHEDULED -> RUNNING"}
    },
    {
      "highlight": [2, 3],
      "label": "Task completes successfully",
      "stats": {"state": "RUNNING -> SUCCEEDED"}
    },
    {
      "highlight": [2, 4],
      "label": "Task fails during execution",
      "stats": {"state": "RUNNING -> FAILED"}
    },
    {
      "highlight": [4, 6],
      "label": "System retries failed task",
      "stats": {"state": "FAILED -> RETRYING"}
    },
    {
      "highlight": [6, 2],
      "label": "Retry attempt begins",
      "stats": {"state": "RETRYING -> RUNNING"}
    },
    {
      "highlight": [4, 7],
      "label": "Max retries exceeded",
      "stats": {"state": "FAILED -> DEAD_LETTER"}
    }
  ],
  "speed": 1200
}
\`\`\`

## Scale Reference Points

\`\`\`callout
{
  "type": "info",
  "title": "Industry Scale Examples",
  "content": "**Uber**: ~1 million tasks/minute across global data centers\\n**Airbnb**: ~500K background jobs/hour (search indexing, pricing)\\n**Stripe**: ~millions of webhook delivery tasks/day\\n**Shopify**: ~50 billion background jobs executed in 2023\\n\\nTypical web app: ~1,000-10,000 tasks/hour with 5-20 workers, peaking at 10x average during flash sales or batch imports."
}
\`\`\`

## Quiz: Task Scheduler Fundamentals

\`\`\`quiz
{
  "title": "Understanding Task Scheduling",
  "questions": [
    {
      "question": "Which task type is most suitable for sending a password reset email?",
      "options": ["One-time", "Delayed", "Recurring", "Workflow"],
      "answer": 0,
      "explanation": "Password reset emails should be sent immediately once, making them perfect one-time tasks."
    },
    {
      "question": "What execution guarantee does 'at-least-once delivery' provide?",
      "options": ["Tasks may be lost but never duplicated", "Tasks may be duplicated but never lost", "Tasks execute exactly once", "Tasks execute at most once"],
      "answer": 1,
      "explanation": "At-least-once delivery ensures no task is lost, but may result in duplicate executions during retries or failures."
    },
    {
      "question": "Which state transition is NOT valid in the task lifecycle?",
      "options": ["PENDING → SCHEDULED", "RUNNING → CANCELLED", "FAILED → RETRYING", "SUCCEEDED → FAILED"],
      "answer": 3,
      "explanation": "Once a task reaches SUCCEEDED state, it cannot transition to FAILED. The execution is complete."
    }
  ]
}
\`\`\`

## Key Takeaway

A distributed task scheduler decouples work submission from work execution. It must handle multiple task types (immediate, delayed, recurring), survive failures without losing tasks, and scale horizontally by adding workers. The core challenge is not just executing tasks -- it is ensuring reliable, ordered, observable execution at scale with proper failure handling.`,
    },
    {
      id: "scheduler-queue",
      slug: "scheduler-queue",
      title: "Task Queue Architecture",
      content: `# Task Queue Architecture

The task queue is the backbone of a distributed scheduler. It decouples producers (who submit tasks) from consumers (workers who execute them), enabling asynchronous processing that keeps your application responsive while background work happens elsewhere.

\`\`\`concept
{
  "title": "Task Queue as a Decoupling Pattern",
  "variant": "mental-model",
  "content": "Think of a task queue like a restaurant kitchen's order system. Waiters (producers) take orders from customers and place them on a rail (queue). Chefs (workers) pull orders from the rail and prepare dishes. The waiter doesn't wait for the food to be cooked before moving to the next table, and multiple chefs can work in parallel. This decoupling allows the front-of-house to scale independently from the kitchen, just as your API servers can scale independently from your worker processes."
}
\`\`\`

## Core Queue Design

A well-designed task queue provides four essential guarantees:

1. **FIFO ordering** within the same priority level
2. **At-least-once delivery** (tasks won't disappear)
3. **Invisibility until acknowledged** (prevents double-processing)
4. **Persistence** (survives broker restarts)

\`\`\`sysdiag
{
  "title": "Basic Task Queue Architecture",
  "width": 600,
  "height": 300,
  "nodes": [
    { "id": "api1", "label": "API Server 1", "x": 80, "y": 60, "kind": "service" },
    { "id": "api2", "label": "API Server 2", "x": 80, "y": 120, "kind": "service" },
    { "id": "api3", "label": "API Server 3", "x": 80, "y": 180, "kind": "service" },
    { "id": "cron", "label": "Cron Daemon", "x": 80, "y": 240, "kind": "service" },
    { "id": "queue", "label": "Task Queue", "x": 300, "y": 150, "kind": "database" },
    { "id": "w1", "label": "Worker 1", "x": 520, "y": 60, "kind": "service" },
    { "id": "w2", "label": "Worker 2", "x": 520, "y": 120, "kind": "service" },
    { "id": "w3", "label": "Worker 3", "x": 520, "y": 180, "kind": "service" },
    { "id": "w4", "label": "Worker 4", "x": 520, "y": 240, "kind": "service" }
  ],
  "edges": [
    { "from": "api1", "to": "queue", "label": "enqueue" },
    { "from": "api2", "to": "queue", "label": "enqueue" },
    { "from": "api3", "to": "queue", "label": "enqueue" },
    { "from": "cron", "to": "queue", "label": "enqueue" },
    { "from": "queue", "to": "w1", "label": "dequeue" },
    { "from": "queue", "to": "w2", "label": "dequeue" },
    { "from": "queue", "to": "w3", "label": "dequeue" },
    { "from": "queue", "to": "w4", "label": "dequeue" }
  ],
  "annotations": {
    "queue": "Provides FIFO ordering, at-least-once delivery, and persistence across restarts"
  }
}
\`\`\`

## Task Message Format

Every task needs a standardized message format that carries all the context workers need:

\`\`\`json
{
  "task_id": "uuid-abc-123",
  "task_type": "send_email",
  "payload": {"to": "user@example.com", "template": "welcome"},
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

The \`idempotency_key\` is crucial: it prevents duplicate execution when the same task gets delivered multiple times due to at-least-once guarantees.

## Priority Queues

Multiple queues with different priorities ensure urgent tasks jump ahead of routine work:

\`\`\`algoviz
{
  "title": "Multi-Priority Queue Processing",
  "type": "array",
  "data": ["payment-123", "email-456", "report-789", "payment-124", "thumb-001", "email-457", "payment-125", "report-790"],
  "frames": [
    {"highlight": [0], "label": "Worker checks HIGH priority queue first", "stats": {"queue": "high", "capacity": "60%"}},
    {"highlight": [0], "label": "Processes payment-123 (high priority)", "stats": {"queue": "high", "processed": 1}},
    {"highlight": [3], "label": "Next payment-124 from high queue", "stats": {"queue": "high", "processed": 2}},
    {"highlight": [4], "label": "High queue empty, checks MEDIUM (30% capacity)", "stats": {"queue": "medium", "capacity": "30%"}},
    {"highlight": [4], "label": "Processes email-456 from medium queue", "stats": {"queue": "medium", "processed": 1}},
    {"highlight": [1], "label": "Next email-457 from medium queue", "stats": {"queue": "medium", "processed": 2}},
    {"highlight": [2], "label": "Both high/medium empty, checks LOW (10% capacity)", "stats": {"queue": "low", "capacity": "10%"}},
    {"highlight": [2], "label": "Processes report-789 from low queue", "stats": {"queue": "low", "processed": 1}}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Priority Starvation Alert",
  "content": "Simple priority polling can starve low-priority tasks. Implement weighted fair queuing: allocate 60% of worker capacity to high, 30% to medium, and 10% to low priority queues. This ensures even bulk operations eventually complete."
}
\`\`\`

## Delay Queue

For tasks that shouldn't execute until a future time, you need delayed scheduling:

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Redis ZSET Approach",
      "content": "**Sorted Set Implementation:**\\n\`\`\`\\nZADD delayed_tasks 1705312200 \\"task-abc\\"   # schedule for 10:30\\nZADD delayed_tasks 1705315800 \\"task-def\\"   # schedule for 11:30\\n\\n# Scheduler loop (every second):\\nnow = current_timestamp()\\nready = ZRANGEBYSCORE delayed_tasks 0 now\\nfor task_id in ready:\\n    move task to execution queue\\n    ZREM delayed_tasks task_id\\n\`\`\`\\n\\n**Pros:** O(log n) insertion/removal, Redis-native\\n**Cons:** Requires dedicated scheduler process"
    },
    {
      "label": "Database Polling",
      "content": "**SQL-based scheduling:**\\n\`\`\`sql\\nSELECT * FROM tasks\\nWHERE status = 'scheduled'\\n  AND scheduled_at <= NOW()\\nORDER BY scheduled_at\\nLIMIT 100;\\n\`\`\`\\n\\n**Optimization:** Bucket by minute to reduce query frequency\\n\`\`\`sql\\n-- Poll only current minute bucket\\nSELECT * FROM tasks\\nWHERE status = 'scheduled'\\n  AND scheduled_bucket = '2024-01-15-10:30'\\n\`\`\`\\n\\n**Pros:** Simple, transactional\\n**Cons:** Polling overhead, database load"
    }
  ]
}
\`\`\`

## Dead Letter Queue (DLQ)

Tasks that fail repeatedly need special handling:

\`\`\`trace
{
  "title": "Dead Letter Queue Flow",
  "language": "python",
  "code": "def process_task_with_retry(task):\\n    retry_delays = [1, 4, 16]  # exponential backoff\\n    \\n    for attempt in range(task.max_retries + 1):\\n        try:\\n            execute_task(task)\\n            return  # success!\\n        except Exception as e:\\n            if attempt < task.max_retries:\\n                sleep(retry_delays[attempt])\\n                task.retry_count += 1\\n            else:\\n                move_to_dlq(task, str(e))\\n                alert_engineers(task, str(e))",
  "frames": [
    {"line": 1, "vars": {"task": "send_email", "attempt": 0}, "note": "Initial attempt"},
    {"line": 5, "vars": {"attempt": 0}, "stdout": "SMTP timeout after 30s", "note": "First failure"},
    {"line": 8, "vars": {"attempt": 0, "retry_count": 1}, "note": "Retry in 1 second"},
    {"line": 5, "vars": {"attempt": 1}, "stdout": "SMTP timeout after 30s", "note": "Second failure"},
    {"line": 8, "vars": {"attempt": 1, "retry_count": 2}, "note": "Retry in 4 seconds"},
    {"line": 5, "vars": {"attempt": 2}, "stdout": "SMTP timeout after 30s", "note": "Third failure"},
    {"line": 10, "vars": {"task": "moved_to_dlq"}, "note": "Max retries exceeded, move to DLQ"},
    {"line": 11, "note": "Alert on-call engineer via PagerDuty"}
  ],
  "speed": 1200
}
\`\`\`

DLQ consumers should:
1. Alert on-call engineers for immediate attention
2. Provide dashboards for manual inspection
3. Offer "replay" functionality to re-enqueue with fresh retry counts
4. Group errors by type to identify patterns

## Queue Broker Comparison

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Redis (Simple Tasks)",
    "code": "# Redis: Great for simple, high-throughput tasks\\nr.lpush('tasks', json.dumps(task))\\ntask = r.brpop('tasks', timeout=30)\\n\\n# Priority with ZSET\\nr.zadd('high', {task: priority_score})\\nr.zadd('low', {task: priority_score})\\n\\n# Delayed tasks\\nr.zadd('delayed', {task: scheduled_timestamp})"
  },
  "after": {
    "label": "RabbitMQ (Complex Routing)",
    "code": "# RabbitMQ: Built for complex routing and reliability\\nchannel.basic_publish(\\n    exchange='orders',\\n    routing_key='payment.high',\\n    body=json.dumps(task),\\n    properties=pika.BasicProperties(\\n        delivery_mode=2,  # persistent\\n        priority=10\\n    )\\n)\\n\\n# Dead letter exchange setup\\nchannel.queue_declare(\\n    queue='tasks',\\n    arguments={\\n        'x-dead-letter-exchange': 'dlx',\\n        'x-message-ttl': 30000\\n    }\\n)"
  }
}
\`\`\`

| Feature | Redis | RabbitMQ | Kafka | SQS |
|---------|-------|----------|-------|-----|
| **Delivery** | At-most-once* | At-least-once | At-least-once | At-least-once |
| **Throughput** | ~100K/s | ~50K/s | ~1M/s | ~3K/s per queue |
| **Priority queues** | ZSET | Built-in | No** | No |
| **Delayed tasks** | ZSET | TTL/DLX | No** | Built-in (15 min) |
| **Best for** | Simple tasks | Complex routing | High throughput | Serverless/AWS |

\\*Redis can provide at-least-once with BRPOPLPUSH + ack pattern  
\\*\\*Requires application-level implementation

## Delivery Guarantees

\`\`\`concept
{
  "title": "Exactly-Once is a Myth",
  "variant": "insight",
  "content": "True exactly-once delivery is impossible in distributed systems. What we call 'exactly-once' is really 'at-least-once delivery + idempotent execution.' Design your tasks with idempotency keys and check-before-act patterns. A payment task should check 'have I already charged this order?' before attempting to charge again. This way, duplicate deliveries become harmless rather than catastrophic."
}
\`\`\`

\`\`\`quiz
{
  "title": "Task Queue Design Decisions",
  "questions": [
    {
      "question": "Your e-commerce platform needs to process payments within 100ms but also generate monthly reports. Which queue design is optimal?",
      "options": [
        "Single FIFO queue for simplicity",
        "Multi-priority queues with weighted fair queuing",
        "Separate queues per customer",
        "Kafka with 100 partitions"
      ],
      "answer": 1,
      "explanation": "Multi-priority queues with weighted fair queuing ensure payments (high priority) get processed quickly while reports (low priority) still make progress. Single queue would delay payments behind reports, while per-customer queues create operational complexity."
    },
    {
      "question": "A task fails with 'database connection timeout' after 3 retries. What should your DLQ consumer do?",
      "options": [
        "Immediately replay all DLQ tasks",
        "Alert engineers and analyze error patterns",
        "Delete the task as permanently failed",
        "Double the retry count and re-enqueue"
      ],
      "answer": 1,
      "explanation": "Connection timeouts suggest infrastructure issues, not task-specific problems. Alerting engineers and analyzing patterns helps identify systemic issues. Blind replay would likely fail again, and deleting loses valuable debugging information."
    },
    {
      "question": "You need to schedule a promotional email to send at exactly midnight on Black Friday. Which approach guarantees delivery?",
      "options": [
        "Redis ZSET with 1-second polling",
        "Database polling every minute",
        "SQS with 15-minute delay",
        "RabbitMQ with TTL and dead-letter exchange"
      ],
      "answer": 0,
      "explanation": "Redis ZSET with 1-second polling provides precise timing (±1 second) and high reliability. Database polling every minute is too imprecise for midnight delivery. SQS 15-minute delay is insufficient for days-ahead scheduling. RabbitMQ TTL/DLX is better for shorter delays."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Task queues decouple producers from workers, enabling independent scaling and fault tolerance",
    "Always design tasks to be idempotent - at-least-once delivery means tasks may execute multiple times",
    "Use multi-priority queues with weighted fair queuing to prevent starvation while maintaining urgency",
    "Implement dead letter queues for failed tasks - they're invaluable for debugging and recovery",
    "Choose brokers based on your needs: Redis for simplicity, RabbitMQ for routing, Kafka for throughput, SQS for serverless"
  ]
}
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
  "content": "Think of a worker as a tiny factory with four departments:\\n\\n1. Task Executor: The assembly line that picks, unpacks, and builds each product (task)\\n2. Heartbeat Loop: The security guard that radios \\"all good\\" every 5 seconds\\n3. Task Registry: A bulletin board listing which products this factory can build\\n4. Resource Monitor: A dashboard showing current CPU, memory, and how many items are on the line\\n\\nIf the guard stops checking in, the central office (scheduler) assumes the factory is down and reroutes work elsewhere."
}
\`\`\`

## Worker Pool Management

Static pools are simple but brittle — you either waste money (too many idle workers) or lose tasks (too few workers). Dynamic pools react to real demand.

\`\`\`steps
{
  "title": "Autoscaling Timeline Walk-through",
  "steps": [
    {
      "title": "T = 0 s",
      "content": "Queue depth spikes to 5 000 tasks after a marketing email drops. Average wait time jumps from 200 ms to 8 s."
    },
    {
      "title": "T = 30 s",
      "content": "Autoscaler evaluates rules every 30 s:\\n- queue_depth > 1 000 ✓\\n- average_wait_time > 5 s ✓\\nDecision: add 20 workers"
    },
    {
      "title": "T = 60 s",
      "content": "Cloud provider provisions new VM instances. Cold-start overhead includes pulling Docker image (~30 s) and warming language runtime."
    },
    {
      "title": "T = 120 s",
      "content": "New workers register with scheduler, begin polling. Queue drains at 1 200 tasks/min vs 300 tasks/min arrival rate."
    },
    {
      "title": "T = 600 s",
      "content": "Queue empty. Autoscaler watches idle timer."
    },
    {
      "title": "T = 900 s",
      "content": "Workers idle > 5 min and utilization < 20 %. Gradual scale-down starts, terminating 2 VMs every minute to avoid thundering-herd re-spawn."
    }
  ]
}
\`\`\`

Concurrency per worker depends on task profile:

| Task Type | Example | Optimal Concurrency | Rationale |
|-----------|---------|---------------------|-----------|
| CPU-bound | Image resize, ML inference | 1 per physical core | Prevents context-switch thrashing |
| I/O-bound | API calls, email send | 10–50 | Threads yield while waiting on network |
| Mixed | Web scraping | Separate pools | Prevents CPU tasks from starving I/O |

## Heartbeat Protocol

Workers send periodic heartbeats so the scheduler can detect failures. Missing two intervals (10 s) triggers suspicion; missing six (30 s) declares the worker dead.

\`\`\`trace
{
  "title": "Heartbeat Failure Detection",
  "language": "python",
  "code": "class Scheduler:\\n    def check_workers(self):\\n        for w in self.workers.values():\\n            if time.time() - w.last_beat > 30:\\n                self.mark_dead(w)\\n\\n    def mark_dead(self, worker):\\n        worker.status = 'DEAD'\\n        for task in worker.inflight:\\n            task.requeue()\\n        self.alert_ops(f'{worker.id} missed heartbeat')\\n\\n# Simulate\\nscheduler = Scheduler()\\nscheduler.workers['w-7'].last_beat = time.time() - 35  # 35 s ago\\nscheduler.check_workers()",
  "frames": [
    { "line": 3, "vars": {"w.id": "w-7", "time.time() - w.last_beat": 35}, "note": "Worker w-7 last beat 35 s ago" },
    { "line": 4, "vars": {}, "note": "Condition true, call mark_dead" },
    { "line": 8, "vars": {"worker.id": "w-7", "worker.status": "DEAD"}, "note": "Status flipped" },
    { "line": 9, "vars": {"task.id": "task-abc-123"}, "note": "Re-queue in-flight task" },
    { "line": 11, "note": "PagerDuty alert sent" }
  ],
  "speed": 1000
}
\`\`\`

## Task Assignment Strategies

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Push-based (scheduler assigns)",
    "code": "# Scheduler bottleneck\\nwhile True:\\n    task = queue.peek()\\n    worker = pick_worker(task)  # O(n) scan\\n    rpc_assign(worker, task)    # sync call\\n    # Scheduler stalls if worker slow to ack"
  },
  "after": {
    "label": "Pull-based (workers poll)",
    "code": "# Decentralized, no single bottleneck\\nwhile True:\\n    task = queue.dequeue(timeout=30)\\n    if task:\\n        execute(task)\\n        queue.ack(task)\\n    # Idle workers cost ~zero"
  }
}
\`\`\`

Hybrid claim-based systems split the difference: the scheduler partitions tasks into per-worker queues, but workers still pull. Temporal uses this pattern, rebalancing partitions when workers join or leave.

## Task Affinity and Routing

Some tasks must land on specific workers. Rules are evaluated top-down, first match wins.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "GPU Routing",
      "content": "\`\`\`json\\n{\\n  \\"pattern\\": \\"task.image.resize\\",\\n  \\"queue\\": \\"gpu-queue\\",\\n  \\"pool\\": \\"gpu-workers\\",\\n  \\"rationale\\": \\"Needs CUDA hardware\\"\\n}\\n\`\`\`"
    },
    {
      "label": "Tenant Isolation",
      "content": "\`\`\`json\\n{\\n  \\"pattern\\": \\"tenant.eu.*\\",\\n  \\"queue\\": \\"eu-queue\\",\\n  \\"pool\\": \\"eu-workers\\",\\n  \\"rationale\\": \\"GDPR data stays in EU region\\"\\n}\\n\`\`\`"
    },
    {
      "label": "Sticky Cache",
      "content": "\`\`\`python\\nworker_id = hash(user_id) % num_workers\\n# User 42 always hits worker-3 where model weights are cached\\n\`\`\`"
    }
  ]
}
\`\`\`

## Graceful Shutdown

Workers must drain in-flight tasks before exiting. Kubernetes sends SIGTERM, then waits 30 s (configurable) before SIGKILL.

\`\`\`callout
{
  "type": "warning",
  "title": "Don't Lose Tasks on Deploy",
  "content": "Without graceful shutdown, a rolling restart can double-execute or lose tasks. Always:\\n1. Stop polling new tasks on SIGTERM\\n2. Set a grace period ≥ 95th-percentile task duration\\n3. Re-enqueue tasks that exceed the grace period\\n4. Deregister from scheduler before exit"
}
\`\`\`

Timeline for a 30-second grace period:

| Time | Action |
|------|--------|
| T = 0 s | SIGTERM received |
| T = 0 s | Set \`draining = true\`, stop dequeue |
| T = 0–30 s | Finish up to N in-flight tasks |
| T = 30 s | Force-stop remaining, re-enqueue |
| T = 31 s | Send \`worker.exit\` heartbeat, process exits |

\`\`\`quiz
{
  "title": "Worker Management Quiz",
  "questions": [
    {
      "question": "Your queue depth jumps from 100 to 5 000 in 10 s. What should trigger scale-up first?",
      "options": ["CPU > 80 %", "queue_depth > 1 000", "memory > 90 %", "worker crash"],
      "answer": 1,
      "explanation": "Queue depth is the leading indicator; CPU/memory are lagging. Autoscale rules typically fire on queue depth or wait-time thresholds."
    },
    {
      "question": "A worker misses heartbeats for 25 s. Its current task has run for 10 min. What do you do?",
      "options": ["Let it keep running", "Mark dead, re-enqueue task", "Kill the process", "Wait another 30 s"],
      "answer": 1,
      "explanation": "25 s > 30 s threshold (usually two intervals). Mark worker dead and re-enqueue to avoid infinite stalls."
    },
    {
      "question": "Which assignment mode removes the scheduler as a bottleneck?",
      "options": ["Push-based", "Pull-based", "Hybrid claim", "Round-robin push"],
      "answer": 1,
      "explanation": "Pull-based lets workers dequeue directly; the queue service (e.g., Redis/RabbitMQ) handles distribution, not the scheduler."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use dynamic pools with queue-depth and wait-time triggers to match supply to demand without over-provisioning",
    "Heartbeat failure detection (30 s timeout) plus task re-enqueue prevents silent stalls and lost work",
    "Pull-based assignment is simplest and most scalable; reserve push or hybrid for global scheduling constraints",
    "Implement graceful shutdown with a grace period ≥ 95th-percentile task duration to survive rolling deploys",
    "Route by task type (CPU vs I/O vs GPU) and tenant/data-locality rules to optimize throughput and compliance"
  ]
}
\`\`\``,
    },
    {
      id: "scheduler-failures",
      slug: "scheduler-failures",
      title: "Failure Handling & Retries",
      content: `# Failure Handling & Retries

In a distributed task scheduler, failures are not exceptions — they are the norm. Network timeouts, service outages, OOM kills, and bugs all cause tasks to fail. A robust scheduler must detect failures, retry intelligently, and isolate poison pills.

\`\`\`concept
{
  "title": "Failure Categories",
  "variant": "mental-model",
  "content": "1. Transient failures (retry will likely succeed):\\n   - Network timeout calling external API\\n   - Database connection pool exhausted\\n   - Rate-limited by third-party service\\n   - Temporary disk full\\n\\n2. Permanent failures (retry will NOT help):\\n   - Invalid input data (malformed email address)\\n   - Business logic error (insufficient funds)\\n   - Missing resource (deleted user)\\n   - Bug in task handler code\\n\\n3. Infrastructure failures:\\n   - Worker process crashes (OOM, segfault)\\n   - Worker machine dies (hardware failure)\\n   - Broker/queue becomes unavailable\\n   - Network partition between scheduler and workers\\n\\nThe scheduler must handle ALL of these gracefully."
}
\`\`\`

## Retry with Exponential Backoff

\`\`\`algoviz
{
  "title": "Exponential Backoff with Jitter",
  "type": "array",
  "data": [1, 2, 4, 8, 16, 32],
  "frames": [
    { "highlight": [0], "label": "Attempt 1: immediate execution", "stats": {"attempt": 1, "delay": 0} },
    { "highlight": [1], "label": "Attempt 2: wait 1 second", "stats": {"attempt": 2, "delay": 1} },
    { "highlight": [2], "label": "Attempt 3: wait 2 seconds", "stats": {"attempt": 3, "delay": 2} },
    { "highlight": [3], "label": "Attempt 4: wait 4 seconds", "stats": {"attempt": 4, "delay": 4} },
    { "highlight": [4], "label": "Attempt 5: wait 8 seconds", "stats": {"attempt": 5, "delay": 8} },
    { "highlight": [5], "label": "Attempt 6: wait 16 seconds (capped at max_delay)", "stats": {"attempt": 6, "delay": 16} }
  ],
  "speed": 1000
}
\`\`\`

**Formula:**
\`\`\`
delay = min(base_delay * 2^(attempt-1), max_delay)

With jitter (prevents thundering herd):
  delay = random(0, min(base_delay * 2^(attempt-1), max_delay))
\`\`\`

Without jitter, 100 failed tasks all retry at exactly T+1s, T+2s, T+4s — creating spikes that overwhelm the failing service. With jitter, retries spread across time windows, giving the service room to recover.

\`\`\`playground
{
  "title": "Exponential Backoff Calculator",
  "language": "python",
  "code": "import random\\nimport math\\n\\ndef exponential_backoff(attempt, base_delay=1, max_delay=60, jitter=True):\\n    \\"\\"\\"Calculate retry delay with exponential backoff and optional jitter.\\"\\"\\"\\n    raw_delay = min(base_delay * (2 ** (attempt - 1)), max_delay)\\n    \\n    if jitter:\\n        # Add random jitter between 0 and raw_delay\\n        delay = random.uniform(0, raw_delay)\\n    else:\\n        delay = raw_delay\\n    \\n    return round(delay, 2)\\n\\n# Simulate retry delays for 5 attempts\\nprint(\\"Attempt | Delay (s)\\")\\nprint(\\"--------|----------\\")\\nfor i in range(1, 6):\\n    delay = exponential_backoff(i, base_delay=1, max_delay=60, jitter=True)\\n    print(f\\"   {i}    |   {delay}\\")",
  "runnable": true
}
\`\`\`

## Idempotency

Since tasks may execute more than once (at-least-once delivery), every task must be **idempotent**:

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Non-idempotent (dangerous)",
    "code": "def charge_customer(user_id, amount):\\n    # This will charge twice if retried!\\n    balance = get_balance(user_id)\\n    set_balance(user_id, balance - amount)\\n    create_transaction(user_id, -amount)"
  },
  "after": {
    "label": "Idempotent (safe)",
    "code": "def charge_customer(user_id, amount, idempotency_key):\\n    # Check if already processed\\n    existing = db.query(\\n        \\"SELECT * FROM processed_tasks WHERE key = ?\\", \\n        idempotency_key\\n    )\\n    if existing:\\n        return existing.result  # Already charged\\n    \\n    # First time - execute and record\\n    balance = get_balance(user_id)\\n    set_balance(user_id, balance - amount)\\n    result = create_transaction(user_id, -amount)\\n    \\n    db.execute(\\n        \\"INSERT INTO processed_tasks (key, result) VALUES (?, ?)\\",\\n        idempotency_key, result\\n    )\\n    return result"
  }
}
\`\`\`

## Circuit Breaker Pattern

When a downstream service is down, retrying immediately wastes resources. A circuit breaker stops the flood:

\`\`\`sysdiag
{
  "title": "Circuit Breaker State Machine",
  "width": 600,
  "height": 300,
  "nodes": [
    { "id": "closed", "label": "CLOSED\\nNormal operation", "x": 100, "y": 150, "kind": "service" },
    { "id": "open", "label": "OPEN\\nFail fast", "x": 300, "y": 50, "kind": "error" },
    { "id": "half", "label": "HALF-OPEN\\nTesting", "x": 300, "y": 250, "kind": "warning" }
  ],
  "edges": [
    { "from": "closed", "to": "open", "label": "5 failures in 60s" },
    { "from": "open", "to": "half", "label": "wait 30s" },
    { "from": "half", "to": "closed", "label": "1 success" },
    { "from": "half", "to": "open", "label": "1 failure" }
  ],
  "annotations": {
    "closed": "Tasks execute normally. Monitor failure rate.",
    "open": "Immediately reject tasks. Queue them for later.",
    "half": "Allow one test task through to probe recovery."
  }
}
\`\`\`

When the circuit is OPEN, tasks targeting that service are re-enqueued with a delay (not counted as retry attempts). Alert: "Circuit open for email-service, 500 tasks queued"

## Poison Pill Detection

A **poison pill** is a task that always fails, consuming retry budget and worker resources:

\`\`\`steps
{
  "title": "Poison Pill Detection Process",
  "steps": [
    {
      "title": "Monitor Failure Patterns",
      "content": "Track tasks that fail immediately (< 1 second execution time) with identical error messages. Watch for specific exception types like NullPointerException or ParseError."
    },
    {
      "title": "Trigger Detection Rule",
      "content": "If a task fails 3 times with identical error within 5 minutes, mark it as POISON_PILL and move to dead letter queue immediately (skip remaining retries)."
    },
    {
      "title": "Alert and Investigate",
      "content": "Send alert: \\"Poison pill detected: task-abc, error: NPE at line 42\\". Dead letter queue preserves the task for manual investigation without blocking workers."
    }
  ]
}
\`\`\`

Prevention strategies:
1. Input validation BEFORE enqueueing (reject obviously invalid payloads)
2. Separate queues for untrusted input (user-submitted tasks in sandboxed queue)
3. Timeout enforcement (kill tasks exceeding max_execution_time)
4. Memory limits per task (OOM-kill tasks exceeding allocation)

## Task Timeout Handling

\`\`\`trace
{
  "title": "Timeout Management in Action",
  "language": "python",
  "code": "import time\\nimport threading\\n\\ndef execute_task_with_timeout(task, timeout_sec=120):\\n    result = {\\"status\\": \\"RUNNING\\", \\"error\\": None}\\n    \\n    def run_task():\\n        try:\\n            # Simulate long-running task\\n            time.sleep(180)  # Exceeds 120s timeout\\n            result[\\"status\\"] = \\"SUCCESS\\"\\n        except Exception as e:\\n            result[\\"status\\"] = \\"FAILED\\"\\n            result[\\"error\\"] = str(e)\\n    \\n    # Start task in separate thread\\n    task_thread = threading.Thread(target=run_task)\\n    task_thread.start()\\n    \\n    # Wait for completion or timeout\\n    task_thread.join(timeout=timeout_sec)\\n    \\n    if task_thread.is_alive():\\n        # Task exceeded timeout\\n        result[\\"status\\"] = \\"TIMEOUT\\"\\n        result[\\"error\\"] = f\\"Task exceeded {timeout_sec}s timeout\\"\\n        # Thread will be killed when main process exits\\n    \\n    return result\\n\\n# Execute and trace\\nprint(\\"Starting task execution...\\")\\nresult = execute_task_with_timeout(\\"generate_report\\", timeout_sec=5)\\nprint(f\\"Result: {result}\\")",
  "frames": [
    { "line": 1, "vars": {}, "note": "Import required modules", "stdout": "" },
    { "line": 4, "vars": {"task": "generate_report", "timeout_sec": 5}, "note": "Function called with 5s timeout", "stdout": "" },
    { "line": 20, "vars": {"result": {"status": "RUNNING", "error": null}}, "note": "Task thread started", "stdout": "Starting task execution..." },
    { "line": 23, "vars": {"task_thread": "<Thread(Thread-1, started)>"}, "note": "Waiting for task completion", "stdout": "" },
    { "line": 26, "vars": {"task_thread.is_alive()": true}, "note": "Task still running after 5s", "stdout": "" },
    { "line": 28, "vars": {"result": {"status": "TIMEOUT", "error": "Task exceeded 5s timeout"}}, "note": "Timeout detected", "stdout": "" },
    { "line": 32, "vars": {"result": {"status": "TIMEOUT", "error": "Task exceeded 5s timeout"}}, "note": "Return timeout result", "stdout": "Result: {'status': 'TIMEOUT', 'error': 'Task exceeded 5s timeout'}" }
  ],
  "speed": 1000
}
\`\`\`

**Critical Rule:** visibility_timeout MUST be > task timeout. Otherwise, the queue re-delivers while the worker is still executing → both original and new worker execute the same task.

## Failure Recovery After Broker Crash

\`\`\`quiz
{
  "title": "Broker Failure Recovery Quiz",
  "questions": [
    {
      "question": "What happens to queued tasks if Redis crashes WITHOUT persistence?",
      "options": ["Tasks are preserved and restored", "All queued tasks are lost", "Only in-flight tasks are lost", "Tasks are moved to backup queue"],
      "answer": 1,
      "explanation": "Without persistence (AOF or RDB), Redis stores data only in memory. A crash loses all queued tasks and in-flight tasks will timeout without acknowledgment."
    },
    {
      "question": "Which configuration provides the best task durability during broker failures?",
      "options": ["Redis without persistence", "Redis with AOF persistence", "RabbitMQ with durable queues", "In-memory queue with replication"],
      "answer": 2,
      "explanation": "RabbitMQ with durable queues writes messages to disk and supports mirrored queues for high availability, providing the best durability guarantee."
    },
    {
      "question": "What should visibility_timeout be relative to task timeout?",
      "options": ["Equal to task timeout", "Less than task timeout", "Greater than task timeout", "Unrelated to task timeout"],
      "answer": 2,
      "explanation": "visibility_timeout must be greater than task timeout to prevent queue redelivery while the worker is still executing the task."
    }
  ]
}
\`\`\`

Best practices for broker resilience:
1. Use durable, persistent queues in production
2. Replicate the broker (Redis Sentinel, RabbitMQ mirroring)
3. Store task state in a database as backup (reconstruct queue from DB if broker is unrecoverable)

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Design every task as if it will fail at least once — in distributed systems, it eventually will",
    "Use exponential backoff with jitter to prevent thundering herd problems during retries",
    "Implement idempotency keys to safely handle at-least-once delivery guarantees",
    "Deploy circuit breakers to protect downstream services from cascading failures",
    "Monitor and quarantine poison pills to prevent them from consuming worker resources"
  ]
}
\`\`\``,
    },
    {
      id: "scheduler-priority",
      slug: "scheduler-priority",
      title: "Priority Queues & Delayed Execution",
      content: `# Priority Queues & Delayed Execution

Scheduling tasks at the right time with the right priority is a core challenge. This lesson covers the data structures and algorithms behind priority scheduling, delayed execution, and recurring task management.

\`\`\`concept
{"title": "Priority Queue = Min-Heap", "variant": "mental-model", "content": "Think of a min-heap as a tournament bracket that always puts the highest-priority task at the top. Every insertion and deletion keeps the bracket valid in O(log n) time, so a million pending tasks still need only ~20 comparisons."}
\`\`\`

## Min-Heap for Priority Scheduling

A min-heap (priority queue) efficiently selects the next task to execute. Tasks are ordered by \`(priority, scheduled_time)\` where lower numbers win.

\`\`\`algoviz
{"title": "Min-Heap Scheduling 5 Tasks", "type": "array", "data": ["(1,10:00,payment)", "(2,10:01,email)", "(2,10:00,webhook)", "(3,10:00,thumbnail)", "(3,10:02,report)"],
 "frames": [
   {"highlight": [0], "label": "Root = next task (priority 1)", "stats": {"size":5}},
   {"highlight": [0,1,2], "label": "Children must be ≥ parent", "stats": {"size":5}},
   {"highlight": [0], "label": "Peek: O(1)", "stats": {"size":5}},
   {"highlight": [0,4], "label": "Pop & re-heapify: O(log n)", "stats": {"size":4}}
 ], "speed": 1000}
\`\`\`

Operations:
- Insert task: O(log n)  
- Get next task: O(1)  
- Remove next: O(log n)  
- Peek: O(1)

For 1 million pending tasks: ~20 comparisons per operation (log₂(1M) ≈ 20).

\`\`\`quiz
{"title": "Heap Complexity Check", "questions": [
  {"question": "You have 4 million pending tasks. Roughly how many comparisons does a single insert need?", "options": ["10", "22", "32", "64"], "answer": 1, "explanation": "log₂(4 000 000) ≈ 22."},
  {"question": "Which operation is O(1)?", "options": ["Insert", "Remove-Min", "Peek", "Build-Heap"], "answer": 2, "explanation": "Peeking the root is always O(1)."},
  {"question": "When is a binary heap NOT the best choice?", "options": ["10 tasks", "1 M tasks", "Priority changes often", "All of the above"], "answer": 0, "explanation": "For tiny datasets a sorted array is simpler and faster in practice."}
]}
\`\`\`

## Time-Wheel Algorithm

For delayed tasks at scale, a **time wheel** provides O(1) insertion and O(1) expiration.

\`\`\`algoviz
{"title": "Single-Level Time Wheel (60 slots)", "type": "array", "data": [["A"], [], ["B","C"], [], ["D"], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
 "frames": [
   {"highlight": [0], "label": "Current pointer at slot 0", "stats": {"t":0}},
   {"highlight": [7], "label": "Insert task E for t=7 → slot 7", "stats": {"t":0}},
   {"highlight": [0], "label": "Tick 0: run A, pointer→1", "stats": {"t":1}},
   {"highlight": [2], "label": "Tick 2: run B & C", "stats": {"t":2}}
 ], "speed": 800}
\`\`\`

Wheel with 60 slots (1 slot per second, wraps every 60 s).  
Insert “task E, execute in 7 seconds”:  
\`target_slot = (current_slot + 7) mod 60\`

When the pointer advances to a slot, all tasks in that slot are executed.

For delays > 60 seconds: hierarchical time wheel  
Level 1: seconds (60 slots, 1 s each)  
Level 2: minutes (60 slots, 1 min each)  
Level 3: hours (24 slots, 1 h each)

Task “execute in 90 seconds”:
1. Insert at level 2, slot 1 (1 min)
2. When level 2 slot 1 fires, move task to level 1, slot 30 (remaining 30 s)

Performance:  
- Insert: O(1)  
- Timer expiry: O(1) amortized  
- Memory: O(number of slots)

Used by: Linux kernel timers, Kafka delayed messages, Netty HashedWheelTimer

\`\`\`callout
{"type": "tip", "title": "When to Use a Timing Wheel", "content": "If 90 % of your tasks fire within the next few minutes and you need millions of timers, a timing wheel beats a priority queue on both CPU and memory."}
\`\`\`

## Cron Expression Scheduling

Recurring tasks use cron expressions to define their schedule.

\`\`\`
+----------- minute (0-59)
| +--------- hour (0-23)
| | +------- day of month (1-31)
| | | +----- month (1-12)
| | | | +--- day of week (0-6, Sun=0)
| | | | |
* * * * *
\`\`\`

Examples  
- \`"0 2 * * *"\` → daily at 2:00 AM  
- \`"*/5 * * * *"\` → every 5 minutes  
- \`"0 9 * * 1-5"\` → weekdays at 9:00 AM  
- \`"0 0 1 * *"\` → first of every month at midnight

Cron scheduler algorithm:
1. For each registered cron task  
   a. Parse cron expression  
   b. Calculate \`next_execution_time\`  
   c. Insert into delay queue with that timestamp
2. When delay queue fires the task  
   a. Execute the task  
   b. Calculate NEXT execution time from cron expression  
   c. Re-insert into delay queue
3. Handle overlap  
   If previous execution is still running when next fires:  
   - Option A: Skip (don’t start overlapping instance)  
   - Option B: Queue (wait for previous to finish)  
   - Option C: Allow (run concurrently — dangerous)

\`\`\`playground
{"title": "Next Cron Run Calculator", "language": "python", "runnable": true, "code": "from croniter import croniter\\nfrom datetime import datetime\\n\\ndef next_runs(expr, n=5):\\n    base = datetime(2024, 6, 1, 8, 0)\\n    cron = croniter(expr, base)\\n    for _ in range(n):\\n        print(cron.get_next(datetime))\\n\\nnext_runs(\\"*/5 * * * *\\")  # every 5 min\\nprint(\\"---\\")\\nnext_runs(\\"0 9 * * 1-5\\")  # 9 AM weekdays"}
\`\`\`

## Distributed Cron Challenges

Running cron in a distributed system introduces unique problems.

Problem: 3 scheduler nodes, cron task \`daily_report\` at 2:00 AM  
Node 1 fires at 2:00:00  
Node 2 fires at 2:00:00  
Node 3 fires at 2:00:00  
→ 3 copies of the same report!

Solution 1: Leader election  
- One scheduler is the “cron leader”  
- Only the leader fires cron tasks  
- If leader dies, another is elected  
Used by: Airflow (with DB-based locking)

Solution 2: Distributed lock  
Before executing cron task:  
\`\`\`python
acquired = redis.SET("lock:daily_report", node_id, NX, EX=60)
if acquired:
    execute daily_report
else:
    skip  # another node has the lock
\`\`\`
Used by: Many custom implementations

Solution 3: Consistent hashing of cron tasks  
Each scheduler “owns” a subset of cron tasks:  
\`\`\`
hash("daily_report") mod 3 = 1  → Node 1 owns it
hash("hourly_sync")  mod 3 = 0  → Node 0 owns it
\`\`\`
If a node dies, its tasks are redistributed  
Used by: Temporal, some Kafka-based schedulers

\`\`\`compare
{"variant": "good-bad", "before": {"label": "No coordination (3x execution)", "code": "# Node 1\\nif now == \\"02:00\\":\\n    run_daily_report()\\n\\n# Node 2\\nif now == \\"02:00\\":\\n    run_daily_report()\\n\\n# Node 3\\nif now == \\"02:00\\":\\n    run_daily_report()"}, "after": {"label": "Distributed lock (1x execution)", "code": "# Any node\\nif now == \\"02:00\\":\\n    lock = redis.set(\\"lock:daily_report\\", NODE_ID, nx=True, ex=60)\\n    if lock:\\n        run_daily_report()\\n    # else: another node is handling it"}}
\`\`\`

## Task Dependencies (DAG Scheduling)

Complex workflows have tasks that depend on other tasks.

\`\`\`
ETL Pipeline
                    +-------------+
                    | extract_api |
                    +------+------+
                           |
              +------------+------------+
              |                         |
      +-------v-------+       +--------v------+
      | transform_data |       | validate_data |
      +-------+-------+       +--------+------+
              |                         |
              +------------+------------+
                           |
                    +------v------+
                    |  load_to_dw |
                    +------+------+
                           |
                    +------v------+
                    | notify_team |
                    +-------------+
\`\`\`

Execution rules:
1. \`extract_api\`: no dependencies, runs immediately
2. \`transform_data\`: runs after \`extract_api\` succeeds
3. \`validate_data\`: runs after \`extract_api\` succeeds
4. transform + validate can run IN PARALLEL
5. \`load_to_dw\`: runs after BOTH transform and validate succeed
6. \`notify_team\`: runs after \`load_to_dw\` succeeds

DAG scheduler algorithm:
1. Build dependency graph
2. Find tasks with no unmet dependencies (topological sort)
3. Execute ready tasks in parallel
4. When a task completes  
   a. Mark as complete  
   b. Check downstream tasks: if all dependencies met → enqueue for execution
5. If a task fails  
   a. Mark as failed  
   b. Mark all downstream tasks as BLOCKED  
   c. Retry the failed task (or alert for manual intervention)

\`\`\`trace
{"title": "DAG Scheduler Walk-Through", "language": "python", "code": "graph = {\\n  'extract': [],\\n  'transform': ['extract'],\\n  'validate': ['extract'],\\n  'load': ['transform','validate'],\\n  'notify': ['load']\\n}\\nready = [t for t,dep in graph.items() if not dep]\\nprint('Initial ready:', ready)\\n\\n# simulate\\ncomplete = set()\\nfor step in ['extract', 'validate', 'transform', 'load', 'notify']:\\n    complete.add(step)\\n    newly_ready = [t for t,dep in graph.items() \\n                     if t not in complete and set(dep) <= complete]\\n    print(f'After {step} -> ready: {newly_ready}')", "frames": [
  {"line": 5, "vars": {"ready": ["extract"]}, "stdout": "Initial ready: ['extract']\\n", "note": "Only extract_api has no deps"},
  {"line": 9, "vars": {"complete": "{'extract'}", "newly_ready": ["transform", "validate"]}, "stdout": "After extract -> ready: ['transform', 'validate']\\n", "note": "Both downstream tasks become runnable"},
  {"line": 9, "vars": {"complete": "{'extract', 'validate'}", "newly_ready": ["transform"]}, "stdout": "After validate -> ready: ['transform']\\n", "note": "transform still waiting? No, already runnable"},
  {"line": 9, "vars": {"complete": "{'extract', 'validate', 'transform'}", "newly_ready": ["load"]}, "stdout": "After transform -> ready: ['load']\\n", "note": "load needs both; now runnable"},
  {"line": 9, "vars": {"complete": "{'extract', 'validate', 'transform', 'load'}", "newly_ready": ["notify"]}, "stdout": "After load -> ready: ['notify']\\n", "note": "Final task"}
], "speed": 900}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Priority scheduling uses min-heaps for O(log n) insert/delete and O(1) peek.",
  "Timing wheels give O(1) delayed-task insertion/expiry when most timers are short-lived.",
  "Cron in distributed systems needs leader election, locking, or consistent hashing to avoid duplicate runs.",
  "DAG schedulers track task dependencies and enable parallel execution where possible.",
  "Choose the mechanism that matches your workload: simple jobs → priority + delay queues; data pipelines → full DAG with dependency tracking."
]}
\`\`\``,
    },
    {
      id: "scheduler-architecture",
      slug: "scheduler-architecture",
      title: "Task Scheduler: Architecture Walkthrough",
      content: `# Task Scheduler: Architecture Walkthrough

Let’s stitch every component into one end-to-end distributed task scheduler and see how it stacks up against Celery, Airflow, and Temporal.

\`\`\`concept
{"title": "The Four Pillars of a Scheduler", "variant": "mental-model", "content": "Think of the system as four loosely-coupled micro-services:\\n\\n1. Scheduler Service – the air-traffic controller that accepts, validates and routes every task.\\n2. Task Queues – the holding pens (Redis/RabbitMQ) that buffer work until a worker is ready.\\n3. Worker Pools – the engines that pull and execute tasks, reporting heartbeats and results.\\n4. State Store – the single source of truth (PostgreSQL/DynamoDB) that remembers every task’s life story.\\n\\nIf any pillar fails, the others keep the sky open—provided you designed for idempotency and at-least-once delivery."}
\`\`\`

## End-to-End Walk-through

### Write Path – Submitting a Task

\`\`\`steps
{"title": "From POST to Queue in 4 Steps", "steps": [{"title": "1. Client POST", "content": "Client sends:\\n\`\`\`json\\nPOST /tasks\\n{\\n  \\"type\\": \\"send_email\\",\\n  \\"payload\\": {\\"to\\": \\"user@x.com\\", \\"subject\\": \\"Welcome\\"},\\n  \\"priority\\": \\"high\\",\\n  \\"idempotency_key\\": \\"uuid-123\\"\\n}\\n\`\`\`"}, {"title": "2. API Gateway", "content": "- Schema validation\\n- Rate-limit check\\n- Idempotency lookup in PostgreSQL; if key exists, return 200 with existing task_id"}, {"title": "3. Scheduler Service", "content": "- Generates UUIDv7 (time-sortable) task_id\\n- INSERT INTO tasks (id, type, status, payload, priority, created_at)\\n- If scheduled_at is NULL → LPUSH high_queue\\n- If scheduled_at is set → ZADD delay_queue <timestamp> task_id"}, {"title": "4. Response", "content": "\`\`\`json\\n{\\"task_id\\": \\"task-abc\\", \\"status\\": \\"pending\\"}\\n\`\`\`\\nClient polls GET /tasks/task-abc or listens to WebSocket for status."}]}
\`\`\`

### Read Path – Worker Executes

\`\`\`trace
{"title": "Worker Pull → Run → Ack", "language": "python", "code": "import redis, psycopg2, time\\n\\nconn = psycopg2.connect(...)\\nr = redis.Redis(...)\\n\\ndef worker_loop():\\n    while True:\\n        # 1. Priority-aware blocking pop\\n        _queue, payload = r.brpop(['high_queue','med_queue','low_queue'], timeout=30)\\n        task = json.loads(payload)\\n        \\n        # 2. Claim: CAS status=PENDING → RUNNING\\n        with conn.cursor() as cur:\\n            cur.execute(\\"\\"\\"\\n                UPDATE tasks\\n                SET status='RUNNING', worker_id=%s, started_at=NOW()\\n                WHERE id=%s AND status='PENDING'\\n                RETURNING id;\\n            \\"\\"\\", (WORKER_ID, task['id']))\\n            if cur.rowcount == 0:  # someone else claimed it\\n                continue\\n        \\n        # 3. Execute\\n        try:\\n            result = registry[task['type']](task['payload'])\\n            # 4a. Success path\\n            cur.execute(\\"\\"\\"\\n                UPDATE tasks\\n                SET status='SUCCEEDED', result=%s, completed_at=NOW()\\n                WHERE id=%s\\n            \\"\\"\\", (Json(result), task['id']))\\n            r.lrem(_queue, 1, payload)  # ACK\\n        except Exception as e:\\n            # 4b. Failure path – retry or DLQ\\n            handle_failure(task, e)\\n        \\n        conn.commit()\\n\\nif __name__ == '__main__':\\n    worker_loop()", "frames": [{"line": 7, "vars": {"_queue": "high_queue", "task": {"id": "task-abc", "type": "send_email", "payload": {"to": "user@x.com"}}}, "note": "Worker grabbed task-abc from high_queue"}, {"line": 11, "vars": {"WORKER_ID": "worker-3", "cur.rowcount": 1}, "note": "Successfully claimed task-abc"}, {"line": 22, "vars": {"result": {"sent": true, "msgId": "msg-42"}}, "stdout": "Email sent to user@x.com\\n", "note": "Handler returned success"}, {"line": 24, "vars": {"status": "SUCCEEDED"}, "note": "Task marked completed"}]}
\`\`\`

## Failure Handling in Production

\`\`\`callout
{"type": "warning", "title": "Exactly-Once Is a Myth", "content": "Distributed systems guarantee *at-least-once*. Your task handler **must** be idempotent—safe to run twice. Use idempotency keys, dedupe in the DB, or design operations to be naturally repeatable."}
\`\`\`

\`\`\`sysdiag
{"title": "Failure Detection & Recovery", "width": 720, "height": 320, "nodes": [{"id": "worker", "label": "Worker-3", "x": 120, "y": 80, "kind": "service"}, {"id": "sched", "label": "Scheduler", "x": 300, "y": 80, "kind": "service"}, {"id": "redis", "label": "Redis", "x": 480, "y": 80, "kind": "datastore"}, {"id": "db", "label": "PostgreSQL", "x": 600, "y": 80, "kind": "datastore"}, {"id": "sentinel", "label": "Sentinel", "x": 480, "y": 180, "kind": "service"}, {"id": "standby", "label": "Standby Scheduler", "x": 300, "y": 180, "kind": "service"}], "edges": [{"from": "worker", "to": "sched", "label": "heartbeat 5 s"}, {"from": "sched", "to": "redis", "label": "enqueue"}, {"from": "sched", "to": "db", "label": "write state"}, {"from": "sentinel", "to": "redis", "label": "health poll", "style": "dashed"}, {"from": "standby", "to": "sched", "label": "leader election", "style": "dashed"}], "annotations": {"worker": "If heartbeat stops >30 s, scheduler re-queues in-flight tasks.", "redis": "AOF + replica keep un-acked messages safe.", "db": "Write-ahead log + hot standby guarantee durability.", "sentinel": "Promotes replica within 5 s; clients reconnect.", "standby" : "Becomes active scheduler if current leader fails health check."}}
\`\`\`

## Monitoring the Beast

Key dashboards you’ll stare at during an outage:

| Metric | Normal | Page When |
|--------|--------|-----------|
| queue_depth (high) | < 50 | > 200 |
| queue_wait_time_p99 | < 2 s | > 5 s |
| retry_rate | < 5 % | > 10 % |
| workers_dead | 0 | > 0 |
| dlq_depth | 0 | > 0 |

## Picking Your Scheduler

\`\`\`compare
{"variant": "good-bad", "before": {"label": "Use Celery When…", "code": "- You need background tasks inside a Python web app\\n- Task flow is mostly fire-and-forget\\n- You’re comfortable with Redis/RabbitMQ as broker"}, "after": {"label": "Build Custom When…", "code": "- You must schedule 1M+ tasks/sec and need queue sharding\\n- You need per-task SLAs or complex priority inheritance\\n- You must keep state in an existing multi-region DB\\n- Existing retry/timeout hard-codes don’t fit your failure model"}}
\`\`\`

\`\`\`quiz
{"title": "Architecture Pop-quiz", "questions": [{"question": "Why do we INSERT into PostgreSQL **before** enqueueing to Redis?", "options": ["To make the task visible to workers immediately", "To guarantee durability even if Redis crashes first", "To satisfy foreign-key constraints in Redis", "To generate the task_id using DB sequence"], "answer": 1, "explanation": "The DB is the durable ledger; Redis is only a transient work queue. If Redis dies we still have the task and can re-enqueue."}, {"question": "Which failure scenario is **not** fully covered by a Redis Sentinel setup?", "options": ["Master Redis crash", "Network partition isolating clients from master", "Split-brain with two masters", "Poison pill task crashing multiple workers"], "answer": 3, "explanation": "Sentinel handles Redis-level failures; poison pills are an application concern and must be mitigated by DLQs and fast-fail limits."}, {"question": "What guarantees idempotency in the write path?", "options": ["UUID v7 task_id", "idempotency_key stored in PostgreSQL", "Redis LPUSH atomicity", "Worker ACK after completion"], "answer": 1, "explanation": "The idempotency_key is looked up before any insert; duplicate requests return the original task_id without creating new work."}]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Durability first: write the task to PostgreSQL, then enqueue.", "At-least-once delivery plus idempotent handlers equals safe retries.", "Separate queues by priority and pool workers by capability (GPU, I/O, CPU).", "Use heartbeats + visibility timeout to detect crashed workers and re-queue.", "Start with Celery/Temporal; build custom only when existing retry models, throughput ceilings, or state-storage requirements force you to."]}
\`\`\``,
    },
  ],
};
