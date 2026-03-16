import { Module } from "../types";

export const taskSchedulerModule: Module = {
  id: "design-scheduler",
  title: "Designing a Distributed Task Scheduler",
  description:
    "Design a distributed task scheduler: task queues, worker management, failure handling, priority scheduling, and complete architecture walkthrough with comparisons to Celery, Airflow, and Temporal.",
  lessons: [
    {
      id: "scheduler-requirements",
      slug: "scheduler-requirements",
      title: "Task Scheduler: Requirements & Problem Space",
      content: `# Task Scheduler: Requirements & Problem Space

A distributed task scheduler accepts, queues, and executes tasks across a fleet of worker machines. Systems like Celery, Airflow, Temporal, and cloud services like AWS Step Functions power the background processing of nearly every large-scale application.

## The Problem

Modern applications need to execute work outside the request-response cycle. Sending emails, processing images, generating reports, running ML pipelines, retrying failed payments -- all of these are tasks that must happen reliably in the background.

\`\`\`
Why Background Task Processing?
=================================

Synchronous (bad):
  User clicks "Export Report"
  --> Server generates 500MB CSV (takes 45 seconds)
  --> User stares at loading spinner
  --> HTTP timeout at 30 seconds
  --> User gets an error

Asynchronous (good):
  User clicks "Export Report"
  --> Server enqueues task: "generate_report(user_id=42)"
  --> Returns immediately: "Your report is being generated"
  --> Worker picks up task, generates CSV in background
  --> Notifies user when complete (email, push notification)
  --> Response time: < 200ms
\`\`\`

## Types of Tasks

\`\`\`
Task Types
===========

1. One-time (fire-and-forget):
   "Send welcome email to user_42"
   Execute once, as soon as possible.

2. Delayed:
   "Send reminder email in 24 hours"
   Execute once, but not until a specified time.

3. Recurring (cron):
   "Generate daily sales report at 2:00 AM UTC"
   Execute repeatedly on a schedule.

4. Workflow / DAG:
   "Step 1: Download data"
   "Step 2: Transform data (depends on Step 1)"
   "Step 3: Load into warehouse (depends on Step 2)"
   Tasks with dependencies, executed in order.

5. Priority:
   "Process payment" (high priority)
   "Generate thumbnail" (low priority)
   Some tasks are more urgent than others.
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

\`\`\`
Task State Machine
====================

  PENDING -----> SCHEDULED -----> RUNNING -----> SUCCEEDED
     |               |               |
     |               |               +----> FAILED
     |               |                         |
     v               v                         v
  CANCELLED      CANCELLED                  RETRYING --> RUNNING
                                               |
                                               v
                                          DEAD_LETTER
                                    (max retries exceeded)
\`\`\`

## Scale Reference Points

\`\`\`
Industry Scale
===============

Uber:       ~1 million tasks/minute across global data centers
Airbnb:     ~500K background jobs/hour (search indexing, pricing)
Stripe:     ~millions of webhook delivery tasks/day
Shopify:    ~50 billion background jobs executed in 2023

Typical web app:
  ~1,000-10,000 tasks/hour
  ~5-20 workers
  Peak: 10x average (flash sales, batch imports)
\`\`\`

## Key Takeaway

A distributed task scheduler decouples work submission from work execution. It must handle multiple task types (immediate, delayed, recurring), survive failures without losing tasks, and scale horizontally by adding workers. The core challenge is not just executing tasks -- it is ensuring reliable, ordered, observable execution at scale with proper failure handling.`,
    },
    {
      id: "scheduler-queue",
      slug: "scheduler-queue",
      title: "Task Queue Architecture",
      content: `# Task Queue Architecture

The task queue is the backbone of a scheduler. It decouples producers (who submit tasks) from consumers (workers who execute them). The queue must handle prioritization, delayed execution, and failed task routing.

## Core Queue Design

\`\`\`
Basic Task Queue Architecture
===============================

[Producers]                      [Consumers/Workers]
  App Server 1 --+               +-- Worker 1
  App Server 2 --+--> [Queue] --+--> Worker 2
  App Server 3 --+               +-- Worker 3
  Cron Daemon  --+               +-- Worker 4

Queue provides:
  1. FIFO ordering (within same priority)
  2. At-least-once delivery
  3. Invisible until acknowledged (prevent double-processing)
  4. Persistence (survive broker restarts)
\`\`\`

## Task Message Format

\`\`\`
Task Message Structure
=======================

{
  "task_id":       "uuid-abc-123",
  "task_type":     "send_email",
  "payload":       {"to": "user@example.com", "template": "welcome"},
  "priority":      "high",          // high, medium, low
  "created_at":    "2024-01-15T10:30:00Z",
  "scheduled_at":  null,            // null = execute immediately
  "max_retries":   3,
  "retry_count":   0,
  "timeout_sec":   30,              // max execution time
  "idempotency_key": "welcome-user-42",  // prevent duplicate execution
  "metadata": {
    "submitted_by": "api-server-2",
    "trace_id":     "trace-xyz-789"
  }
}
\`\`\`

## Priority Queues

Multiple queues with different priorities ensure urgent tasks are processed first:

\`\`\`
Multi-Priority Queue System
==============================

            +------------------+
            | High Priority    |  <-- payment processing, alerts
            | [task] [task]    |      Workers check this FIRST
            +------------------+
                    |
            +------------------+
            | Medium Priority  |  <-- email sending, notifications
            | [task] [task]    |      Checked if high is empty
            +------------------+
                    |
            +------------------+
            | Low Priority     |  <-- report generation, thumbnails
            | [task] [task]    |      Checked if medium is empty
            +------------------+

Worker polling strategy:
  while True:
    task = high_queue.dequeue()    # check high first
    if not task:
      task = medium_queue.dequeue()
    if not task:
      task = low_queue.dequeue()
    if task:
      execute(task)
    else:
      sleep(100ms)  # no tasks available

Problem: starvation of low-priority tasks
Solution: weighted fair queuing
  High: 60% of worker capacity
  Medium: 30% of worker capacity
  Low: 10% of worker capacity
\`\`\`

## Delay Queue

For tasks that should not execute until a future time:

\`\`\`
Delay Queue Implementation
============================

Option 1: Sorted set (Redis ZSET)
  Key: "delayed_tasks"
  Score: scheduled_timestamp
  Value: task_id

  ZADD delayed_tasks 1705312200 "task-abc"   (schedule for 10:30)
  ZADD delayed_tasks 1705315800 "task-def"   (schedule for 11:30)

  Scheduler loop (every second):
    now = current_timestamp()
    ready = ZRANGEBYSCORE delayed_tasks 0 now
    for task_id in ready:
      move task to execution queue
      ZREM delayed_tasks task_id

Option 2: Database polling
  SELECT * FROM tasks
  WHERE status = 'scheduled'
    AND scheduled_at <= NOW()
  ORDER BY scheduled_at
  LIMIT 100

  Problem: polling at high frequency is expensive
  Solution: bucket by minute, poll only current bucket
\`\`\`

## Dead Letter Queue (DLQ)

Tasks that fail repeatedly are moved to a DLQ for investigation:

\`\`\`
Dead Letter Queue Flow
========================

Task "send_email" fails:
  Attempt 1: FAIL (SMTP timeout)     --> retry in 1s
  Attempt 2: FAIL (SMTP timeout)     --> retry in 4s
  Attempt 3: FAIL (SMTP timeout)     --> retry in 16s
  Attempt 4: FAIL (max retries = 3)  --> move to DLQ

Dead Letter Queue:
+-----------------------------------------------------------+
| task_id: abc-123                                           |
| type: send_email                                          |
| payload: {"to": "user@example.com", ...}                 |
| error: "SMTP connection timeout after 30s"               |
| attempts: 4                                               |
| first_failed: "2024-01-15T10:30:00Z"                    |
| last_failed:  "2024-01-15T10:30:21Z"                    |
+-----------------------------------------------------------+

DLQ consumers:
  1. Alert on-call engineer (PagerDuty)
  2. Dashboard for manual inspection
  3. "Replay" button to re-enqueue with fresh retry count
  4. Automated analysis: group by error type, identify patterns
\`\`\`

## Queue Broker Options

\`\`\`
Broker Comparison
==================

+------------------+-----------+----------+----------+-----------+
| Feature          | Redis     | RabbitMQ | Kafka    | SQS       |
+------------------+-----------+----------+----------+-----------+
| Delivery         | At-most-  | At-least | At-least | At-least  |
|                  | once*     | once     | once     | once      |
+------------------+-----------+----------+----------+-----------+
| Ordering         | FIFO      | FIFO     | Per-     | Best-     |
|                  |           |          | partition| effort**  |
+------------------+-----------+----------+----------+-----------+
| Persistence      | Optional  | Yes      | Yes      | Yes       |
|                  | (RDB/AOF)|          | (log)    | (managed) |
+------------------+-----------+----------+----------+-----------+
| Throughput       | ~100K/s   | ~50K/s   | ~1M/s    | ~3K/s per |
|                  |           |          |          | queue     |
+------------------+-----------+----------+----------+-----------+
| Priority queues  | ZSET      | Built-in | No***    | No        |
+------------------+-----------+----------+----------+-----------+
| Delayed tasks    | ZSET      | TTL/DLX  | No***    | Built-in  |
|                  |           |          |          | (15 min)  |
+------------------+-----------+----------+----------+-----------+
| Best for         | Simple    | Complex  | High-    | Serverless|
|                  | tasks     | routing  | throughput| / AWS     |
+------------------+-----------+----------+----------+-----------+

* Redis can provide at-least-once with BRPOPLPUSH + ack pattern
** SQS FIFO queues provide strict ordering (lower throughput)
*** Kafka priorities/delays require application-level implementation
\`\`\`

## Exactly-Once vs. At-Least-Once

\`\`\`
Delivery Guarantees
=====================

At-most-once:
  Dequeue task, delete from queue, then execute.
  If worker crashes mid-execution: task is LOST.

At-least-once:
  Dequeue task (mark invisible), execute, then acknowledge.
  If worker crashes: visibility timeout expires, task reappears.
  Task may execute MORE than once (must be idempotent).

Exactly-once (ideal but hard):
  Requires idempotency:
    1. Task has an idempotency_key
    2. Before executing, check: "have I processed this key before?"
    3. If yes: skip (return cached result)
    4. If no: execute and record the key
    5. Idempotency keys stored in DB with TTL

  IMPORTANT: True exactly-once is impossible in distributed systems.
  "Exactly-once" really means "at-least-once + idempotent execution."
\`\`\`

## Key Takeaway

The task queue decouples producers from workers and provides reliable delivery. Priority queues ensure urgent tasks are processed first, delay queues enable scheduled execution, and dead letter queues capture persistently failing tasks for investigation. Choose your broker based on throughput needs, delivery guarantees, and operational complexity. Always design tasks to be idempotent, because at-least-once delivery means tasks may execute more than once.`,
    },
    {
      id: "scheduler-workers",
      slug: "scheduler-workers",
      title: "Worker Management & Load Balancing",
      content: `# Worker Management & Load Balancing

Workers are the execution engines of a task scheduler. Managing a pool of workers -- scaling them, monitoring their health, and assigning tasks efficiently -- is critical for throughput and reliability.

## Worker Architecture

\`\`\`
Worker Process Anatomy
========================

+------------------------------------------+
|              Worker Process                |
|                                           |
|  +----------------+  +-----------------+  |
|  | Task Executor  |  | Heartbeat Loop  |  |
|  |                |  |                 |  |
|  | 1. Poll queue  |  | Every 5s:       |  |
|  | 2. Deserialize |  |   Send heartbeat|  |
|  |    task        |  |   to scheduler  |  |
|  | 3. Execute     |  |   {worker_id,   |  |
|  |    handler     |  |    status,      |  |
|  | 4. Report      |  |    load,        |  |
|  |    result      |  |    current_task}|  |
|  +----------------+  +-----------------+  |
|                                           |
|  +----------------+  +-----------------+  |
|  | Task Registry  |  | Resource Monitor|  |
|  |                |  |                 |  |
|  | "send_email"   |  | CPU: 45%        |  |
|  |   -> handler() |  | Memory: 2.1 GB  |  |
|  | "resize_image" |  | Tasks in-flight:|  |
|  |   -> handler() |  |   3 of 10 max   |  |
|  +----------------+  +-----------------+  |
+------------------------------------------+
\`\`\`

## Worker Pool Management

\`\`\`
Worker Pool Scaling
=====================

Static pool:
  Fixed number of workers (e.g., 10 per machine)
  Simple but cannot adapt to load changes

Dynamic pool (autoscaling):
  Monitor: queue depth + worker utilization

  Scale UP when:
    queue_depth > threshold (e.g., > 1000 pending tasks)
    OR average_wait_time > target (e.g., > 5 seconds)

  Scale DOWN when:
    queue_depth = 0 for > 5 minutes
    AND worker_utilization < 20%

  Scaling timeline:
    T=0:    Queue depth spikes to 5,000
    T=30s:  Autoscaler detects spike
    T=60s:  New worker instances launching (cloud)
    T=120s: New workers online, draining queue
    T=600s: Queue cleared
    T=900s: Workers idle for 5 min, scale down begins

  Concurrency per worker:
    CPU-bound tasks (image processing): 1 task per core
    I/O-bound tasks (API calls, emails): 10-50 concurrent tasks
    Mixed: use separate worker pools per task type
\`\`\`

## Heartbeat Protocol

Workers send periodic heartbeats so the scheduler can detect failures:

\`\`\`
Heartbeat-Based Health Monitoring
===================================

Worker --> Scheduler (every 5 seconds):
  {
    "worker_id":   "worker-7",
    "timestamp":   1705312200,
    "status":      "busy",
    "current_task": "task-abc-123",
    "task_started": 1705312180,
    "cpu_percent":  65,
    "memory_mb":    1800,
    "tasks_completed": 142,
    "tasks_failed":    3
  }

Scheduler maintains worker table:
  +----------+--------+-------------+------------------+
  | Worker   | Status | Last Beat   | Current Task     |
  +----------+--------+-------------+------------------+
  | worker-1 | idle   | 2s ago      | none             |
  | worker-2 | busy   | 1s ago      | task-def-456     |
  | worker-3 | busy   | 3s ago      | task-ghi-789     |
  | worker-4 | DEAD   | 45s ago     | task-jkl-012     |
  +----------+--------+-------------+------------------+

If last_heartbeat > 30 seconds:
  1. Mark worker as DEAD
  2. Re-enqueue its in-flight task(s)
  3. Alert ops team if multiple workers die simultaneously
\`\`\`

## Task Assignment Strategies

\`\`\`
Assignment Strategies
======================

1. Pull-based (workers poll the queue):

   Worker loop:
     task = queue.dequeue(timeout=30s)
     if task:
       execute(task)
       queue.ack(task)

   Pros: Simple. Workers only take tasks they can handle.
   Cons: Workers poll even when idle (wasted connections).
   Used by: Celery, Sidekiq, most job systems.

2. Push-based (scheduler assigns to workers):

   Scheduler loop:
     task = queue.peek()
     worker = select_best_worker(task)
     assign(task, worker)

   Pros: Scheduler has global view of load.
   Cons: Scheduler is a bottleneck and single point of failure.
   Used by: Kubernetes Jobs, Mesos, YARN.

3. Hybrid (claim-based):

   Scheduler partitions tasks into worker-specific queues:
     worker-1-queue: [task-a, task-d]
     worker-2-queue: [task-b, task-e]
     worker-3-queue: [task-c, task-f]

   Workers pull from their own queue.
   Scheduler rebalances when workers join/leave.
   Used by: Temporal, some Kafka consumer patterns.
\`\`\`

## Task Affinity and Routing

Some tasks should run on specific workers:

\`\`\`
Task Routing Rules
====================

Route by task type:
  "resize_image"  --> GPU worker pool (has GPU hardware)
  "send_email"    --> I/O worker pool (high concurrency)
  "train_model"   --> High-memory worker pool (64GB+ RAM)

Route by tenant:
  tenant_A tasks  --> worker pool in us-east-1
  tenant_B tasks  --> worker pool in eu-west-1
  (data locality, compliance)

Route by affinity (sticky routing):
  Tasks for user_42 --> always worker-3
  Why: worker-3 has user_42's data in local cache
  Implementation: hash(user_id) % num_workers

Routing table:
  +------------------+-------------------+------------------+
  | Pattern          | Queue             | Worker Pool      |
  +------------------+-------------------+------------------+
  | task.email.*     | email-queue       | io-workers       |
  | task.image.*     | image-queue       | gpu-workers      |
  | task.ml.*        | ml-queue          | ml-workers       |
  | task.*           | default-queue     | general-workers  |
  +------------------+-------------------+------------------+
\`\`\`

## Graceful Shutdown

Workers must drain in-flight tasks before shutting down:

\`\`\`
Graceful Shutdown Protocol
============================

1. Worker receives SIGTERM (shutdown signal)

2. Worker stops polling for NEW tasks

3. Worker finishes currently executing tasks
   (up to a grace period, e.g., 30 seconds)

4. If tasks exceed grace period:
   a. Send progress checkpoint to scheduler
   b. Re-enqueue task (scheduler will assign to another worker)
   c. Log warning: "task X interrupted during shutdown"

5. Worker deregisters from scheduler

6. Worker process exits

Timeline:
  T=0:    SIGTERM received
  T=0:    Stop accepting new tasks
  T=0-30: Finish in-flight tasks
  T=30:   Force-stop remaining tasks, re-enqueue
  T=31:   Deregister, exit

This is critical for deployments:
  Rolling restart = shut down worker, start new one
  Without graceful shutdown: tasks are lost or double-executed
\`\`\`

## Key Takeaway

Worker management is about three things: scaling the pool to match demand, monitoring health through heartbeats, and assigning tasks efficiently. Pull-based assignment is simplest and most common. Push-based gives the scheduler more control but adds a bottleneck. Always implement graceful shutdown to prevent task loss during deployments. Separate worker pools by task type when tasks have different resource requirements (CPU vs. I/O vs. GPU).`,
    },
    {
      id: "scheduler-failures",
      slug: "scheduler-failures",
      title: "Failure Handling & Retries",
      content: `# Failure Handling & Retries

In a distributed task scheduler, failures are not exceptions -- they are the norm. Network timeouts, service outages, OOM kills, and bugs all cause tasks to fail. A robust scheduler must detect failures, retry intelligently, and isolate poison pills.

## Types of Failures

\`\`\`
Failure Categories
====================

1. Transient failures (retry will likely succeed):
   - Network timeout calling external API
   - Database connection pool exhausted
   - Rate-limited by third-party service
   - Temporary disk full

2. Permanent failures (retry will NOT help):
   - Invalid input data (malformed email address)
   - Business logic error (insufficient funds)
   - Missing resource (deleted user)
   - Bug in task handler code

3. Infrastructure failures:
   - Worker process crashes (OOM, segfault)
   - Worker machine dies (hardware failure)
   - Broker/queue becomes unavailable
   - Network partition between scheduler and workers

The scheduler must handle ALL of these gracefully.
\`\`\`

## Retry with Exponential Backoff

\`\`\`
Exponential Backoff with Jitter
=================================

Retry delays:
  Attempt 1: immediate execution
  Attempt 2: wait 1 second
  Attempt 3: wait 2 seconds
  Attempt 4: wait 4 seconds
  Attempt 5: wait 8 seconds
  Attempt 6: wait 16 seconds (capped at max_delay)

Formula:
  delay = min(base_delay * 2^(attempt-1), max_delay)

With jitter (prevents thundering herd):
  delay = random(0, min(base_delay * 2^(attempt-1), max_delay))

Without jitter:
  100 failed tasks all retry at exactly T+1s, T+2s, T+4s
  --> Spike of 100 retries every time (overwhelms the failing service)

With jitter:
  100 failed tasks retry spread across T+0s to T+1s, T+0s to T+2s...
  --> Retries are spread out, giving the failing service time to recover

Configuration:
  {
    "max_retries":    5,
    "base_delay_sec": 1,
    "max_delay_sec":  60,
    "jitter":         true,
    "backoff_type":   "exponential"  // or "linear", "fixed"
  }
\`\`\`

## Idempotency

Since tasks may execute more than once (at-least-once delivery), every task must be **idempotent**:

\`\`\`
Idempotency Patterns
======================

Problem: "charge_customer" task executes twice
  --> Customer charged $50 twice!

Solution 1: Idempotency key in database
  Before executing:
    INSERT INTO processed_tasks (idempotency_key, result, created_at)
    VALUES ('charge-user42-order99', NULL, NOW())
    ON CONFLICT DO NOTHING

  If insert succeeds: first time, proceed with execution
  If insert fails (conflict): already processed, return cached result

Solution 2: Natural idempotency
  "Set user status to 'active'" is naturally idempotent
  Running it 5 times has the same effect as running it once

Solution 3: Version checks
  "Update balance WHERE version = 7"
  First execution: version 7 -> 8, balance updated
  Second execution: version != 7, no rows affected, skip

Idempotency key lifecycle:
  Store for 7 days (configurable)
  After 7 days: delete key (assume no more retries)
  If task retries after key expires: safe because the original
  succeeded long ago and side effects are committed
\`\`\`

## Circuit Breaker Pattern

When a downstream service is down, retrying immediately wastes resources. A circuit breaker stops the flood:

\`\`\`
Circuit Breaker for Task Execution
=====================================

States:
  CLOSED  --> normal operation, tasks execute
  OPEN    --> downstream is down, tasks fail fast
  HALF-OPEN --> test if downstream has recovered

State transitions:
  CLOSED --[5 failures in 60s]--> OPEN
  OPEN   --[wait 30s]----------> HALF-OPEN
  HALF-OPEN --[1 success]------> CLOSED
  HALF-OPEN --[1 failure]------> OPEN

         +----------+
         |  CLOSED  |  (normal: execute tasks)
         +----+-----+
              |
         5 failures in 60s
              |
         +----v-----+
         |   OPEN   |  (fail fast: don't even try)
         +----+-----+
              |
         wait 30 seconds
              |
         +----v-----+
         |HALF-OPEN |  (test: try one task)
         +----+-----+
         |         |
     success    failure
         |         |
    +----v---+ +---v----+
    | CLOSED | | OPEN   |
    +--------+ +--------+

When circuit is OPEN:
  Tasks targeting that service are re-enqueued with a delay
  (not counted as a retry attempt)
  Alert: "Circuit open for email-service, 500 tasks queued"
\`\`\`

## Poison Pill Detection

A **poison pill** is a task that always fails, consuming retry budget and worker resources:

\`\`\`
Poison Pill Handling
=====================

Poison pill indicators:
  - Fails immediately (< 1 second execution time)
  - Same error message every attempt
  - Specific exception types (NullPointerException, ParseError)

Detection:
  If task fails 3 times with identical error within 5 minutes:
    Mark as POISON_PILL
    Move to dead letter queue immediately (skip remaining retries)
    Alert: "Poison pill detected: task-abc, error: NPE at line 42"

Prevention:
  1. Input validation BEFORE enqueueing
     (reject obviously invalid payloads)

  2. Separate queues for untrusted input
     (user-submitted tasks in a sandboxed queue)

  3. Timeout enforcement
     (kill tasks that run longer than max_execution_time)

  4. Memory limits per task
     (OOM-kill tasks that exceed allocation)
\`\`\`

## Task Timeout Handling

\`\`\`
Timeout Management
====================

Per-task timeout:
  task = {
    "type": "generate_report",
    "timeout_sec": 120,  // must complete within 2 minutes
    "visibility_timeout": 300  // queue re-delivers after 5 minutes
  }

Worker-side timeout:
  1. Start task execution with a timer
  2. If timer expires before completion:
     a. Kill the task thread/process
     b. Report TIMEOUT failure
     c. Task re-queued (counts as a failure attempt)

Queue-side visibility timeout:
  1. Worker dequeues task (task becomes invisible to other workers)
  2. Worker has visibility_timeout seconds to acknowledge completion
  3. If no acknowledgment received:
     a. Task becomes visible again
     b. Another worker picks it up
  4. Original worker may still be running (zombie task)
     --> Idempotency key prevents double-execution of side effects

CRITICAL: visibility_timeout MUST be > task timeout
  Otherwise: queue re-delivers while worker is still executing
  --> Both original and new worker execute the same task
\`\`\`

## Failure Recovery After Broker Crash

\`\`\`
Broker Failure Recovery
=========================

Scenario: Redis (queue broker) crashes and restarts

If using Redis without persistence:
  All queued tasks are LOST.
  In-flight tasks will timeout and never be acknowledged.
  --> Unacceptable for most production systems.

If using Redis with AOF persistence:
  On restart: replay append-only file
  Queued tasks are restored (last fsync point)
  In-flight tasks that were dequeued but not acked:
    Visibility timeout expires --> tasks reappear in queue

If using RabbitMQ with durable queues:
  Messages written to disk survive broker restart
  Unacknowledged messages redelivered to consumers
  Mirrored queues survive single-node failures

Best practice:
  1. Use durable, persistent queues in production
  2. Replicate the broker (Redis Sentinel, RabbitMQ mirroring)
  3. Store task state in a database as backup
     (reconstruct queue from DB if broker is unrecoverable)
\`\`\`

## Key Takeaway

Robust failure handling requires multiple layers: exponential backoff with jitter for transient failures, circuit breakers to protect downstream services, idempotency to handle duplicate execution, poison pill detection to quarantine bad tasks, and timeout enforcement to prevent resource leaks. Design every task as if it will fail at least once, because in a distributed system, it eventually will.`,
    },
    {
      id: "scheduler-priority",
      slug: "scheduler-priority",
      title: "Priority Queues & Delayed Execution",
      content: `# Priority Queues & Delayed Execution

Scheduling tasks at the right time with the right priority is a core challenge. This lesson covers the data structures and algorithms behind priority scheduling, delayed execution, and recurring task management.

## Min-Heap for Priority Scheduling

A min-heap (priority queue) efficiently selects the next task to execute:

\`\`\`
Min-Heap Priority Queue
=========================

Tasks sorted by (priority, scheduled_time):
  Lower number = higher priority

Heap structure:
              (1, 10:00, "payment")
             /                      \\
    (2, 10:01, "email")     (2, 10:00, "webhook")
      /           \\               /
(3, 10:00,   (3, 10:02,   (3, 10:01,
 "thumbnail") "report")   "analytics")

Operations:
  Insert task:   O(log n)
  Get next task: O(1)      -- always at the root
  Remove next:   O(log n)  -- re-heapify
  Peek:          O(1)

For 1 million pending tasks:
  Insert: ~20 comparisons (log2(1M) = 20)
  Remove: ~20 comparisons
  Far more efficient than scanning a list or sorting
\`\`\`

## Time-Wheel Algorithm

For delayed tasks at scale, a **time wheel** (also called a **timing wheel**) provides O(1) insertion and O(1) expiration:

\`\`\`
Timing Wheel
==============

A circular buffer where each slot represents a time interval.

Wheel with 60 slots (1 slot per second, wraps every 60s):

Slot:  [0]  [1]  [2]  [3]  [4]  ... [59]
Tasks: [A]  [ ]  [B,C][ ]  [D]  ... [ ]
        ^
     current pointer (advances every second)

Insert "task E, execute in 7 seconds":
  target_slot = (current_slot + 7) % 60
  Add E to slot target_slot

When pointer advances to a slot:
  Execute all tasks in that slot

For delays > 60 seconds: hierarchical time wheel
  Level 1: seconds (60 slots, 1s each)
  Level 2: minutes (60 slots, 1 min each)
  Level 3: hours (24 slots, 1 hour each)

  Task "execute in 90 seconds":
    Level 2, slot 1 (1 minute)
    When level 2 slot 1 fires:
      Move task to level 1, slot 30 (remaining 30 seconds)

Performance:
  Insert: O(1)
  Timer expiry: O(1) amortized
  Memory: O(number of slots)

Used by: Linux kernel timers, Kafka delayed messages,
         Netty HashedWheelTimer
\`\`\`

## Cron Expression Scheduling

Recurring tasks use cron expressions to define their schedule:

\`\`\`
Cron Expression Format
========================

+----------- minute (0-59)
| +--------- hour (0-23)
| | +------- day of month (1-31)
| | | +----- month (1-12)
| | | | +--- day of week (0-6, Sun=0)
| | | | |
* * * * *

Examples:
  "0 2 * * *"     --> daily at 2:00 AM
  "*/5 * * * *"   --> every 5 minutes
  "0 9 * * 1-5"   --> weekdays at 9:00 AM
  "0 0 1 * *"     --> first of every month at midnight

Cron scheduler algorithm:
  1. For each registered cron task:
     a. Parse cron expression
     b. Calculate next_execution_time
     c. Insert into delay queue with that timestamp
  2. When delay queue fires the task:
     a. Execute the task
     b. Calculate NEXT execution time from cron expression
     c. Re-insert into delay queue
  3. Handle overlap:
     If previous execution is still running when next fires:
       Option A: Skip (don't start overlapping instance)
       Option B: Queue (wait for previous to finish)
       Option C: Allow (run concurrently -- dangerous)
\`\`\`

## Distributed Cron Challenges

Running cron in a distributed system introduces unique problems:

\`\`\`
Distributed Cron: Single Execution Guarantee
===============================================

Problem: 3 scheduler nodes, cron task "daily_report" at 2:00 AM
  Node 1: fires daily_report at 2:00:00
  Node 2: fires daily_report at 2:00:00
  Node 3: fires daily_report at 2:00:00
  --> 3 copies of the same report!

Solution 1: Leader election
  One scheduler is the "cron leader"
  Only the leader fires cron tasks
  If leader dies, another is elected
  Used by: Airflow (with DB-based locking)

Solution 2: Distributed lock
  Before executing cron task:
    acquired = redis.SET("lock:daily_report", node_id, NX, EX=60)
    if acquired:
      execute daily_report
    else:
      skip (another node has the lock)
  Used by: Many custom implementations

Solution 3: Consistent hashing of cron tasks
  Each scheduler "owns" a subset of cron tasks:
    hash("daily_report") % 3 = 1  --> Node 1 owns it
    hash("hourly_sync")  % 3 = 0  --> Node 0 owns it
  If a node dies, its tasks are redistributed
  Used by: Temporal, some Kafka-based schedulers
\`\`\`

## Task Dependencies (DAG Scheduling)

Complex workflows have tasks that depend on other tasks:

\`\`\`
DAG (Directed Acyclic Graph) Scheduling
==========================================

Workflow: ETL Pipeline
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

Execution rules:
  1. extract_api: no dependencies, runs immediately
  2. transform_data: runs after extract_api succeeds
  3. validate_data: runs after extract_api succeeds
  4. transform + validate can run IN PARALLEL
  5. load_to_dw: runs after BOTH transform and validate succeed
  6. notify_team: runs after load_to_dw succeeds

DAG scheduler algorithm:
  1. Build dependency graph
  2. Find tasks with no unmet dependencies (topological sort)
  3. Execute ready tasks in parallel
  4. When a task completes:
     a. Mark as complete
     b. Check downstream tasks:
        If all dependencies met --> enqueue for execution
  5. If a task fails:
     a. Mark as failed
     b. Mark all downstream tasks as BLOCKED
     c. Retry the failed task (or alert for manual intervention)
\`\`\`

## Key Takeaway

Priority scheduling uses min-heaps for efficient task selection. Delayed execution uses timing wheels for O(1) scheduling at scale. Cron tasks require distributed locking to prevent duplicate execution across nodes. DAG scheduling enables complex workflows with task dependencies. The choice between these mechanisms depends on your workload: simple background jobs need priority queues and delay queues, while data pipelines need full DAG scheduling with dependency tracking.`,
    },
    {
      id: "scheduler-architecture",
      slug: "scheduler-architecture",
      title: "Task Scheduler: Architecture Walkthrough",
      content: `# Task Scheduler: Architecture Walkthrough

Let us bring together all the components into a complete distributed task scheduler and compare it with production systems like Celery, Airflow, and Temporal.

## Complete Architecture

\`\`\`
             Distributed Task Scheduler Architecture
             =========================================

[Producers]
  App Server 1 --+
  App Server 2 --+--> [API Gateway / Task Submission]
  Cron Service --+          |
  Webhook      --+          v
                    +------------------+
                    | Scheduler Service |
                    |                  |
                    | - Accept tasks   |
                    | - Route to queue |
                    | - Manage cron    |
                    | - Track state    |
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
              v              v              v
        +-----------+  +-----------+  +-----------+
        |High Queue |  |Med Queue  |  |Low Queue  |
        | (Redis)   |  | (Redis)   |  | (Redis)   |
        +-----------+  +-----------+  +-----------+
        +-----------+
        |Delay Queue|  (Redis sorted set)
        +-----------+
        +-----------+
        |  DLQ      |  (dead letter queue)
        +-----------+
              |              |              |
              v              v              v
        +-----------+  +-----------+  +-----------+
        | Worker    |  | Worker    |  | Worker    |
        | Pool: GPU |  | Pool: I/O |  | Pool:     |
        | (2 nodes) |  | (10 nodes)|  | General   |
        |           |  |           |  | (5 nodes) |
        +-----------+  +-----------+  +-----------+
              |              |              |
              v              v              v
        +------------------------------------------+
        |          Task State Store                 |
        |        (PostgreSQL / DynamoDB)             |
        |                                           |
        | task_id | status | result | attempts | ...|
        +------------------------------------------+
\`\`\`

## Write Path: Submitting a Task

\`\`\`
Task Submission Flow
======================

Client: POST /tasks
  {"type": "send_email", "payload": {...}, "priority": "high"}
        |
        v
1. API Gateway validates request:
   - Schema validation (required fields present)
   - Idempotency check (has this idempotency_key been seen?)
   - Rate limiting (per-client task submission rate)
        |
        v
2. Scheduler Service:
   a. Generate task_id (UUID v7 -- time-sortable)
   b. Write to Task State Store:
      INSERT INTO tasks (id, type, status, payload, priority, created_at)
      VALUES ('task-abc', 'send_email', 'PENDING', {...}, 'high', NOW())
   c. Enqueue to appropriate queue:
      If scheduled_at is NULL:  LPUSH high_priority_queue task_payload
      If scheduled_at is set:   ZADD delay_queue scheduled_timestamp task_id
   d. Return task_id to client
        |
        v
3. Client receives:
   {"task_id": "task-abc", "status": "pending"}
   Client can poll GET /tasks/task-abc for status updates
\`\`\`

## Read Path: Worker Executing a Task

\`\`\`
Task Execution Flow
======================

Worker-3 (general pool):
        |
        v
1. Poll queues (priority order):
   BRPOP high_queue medium_queue low_queue TIMEOUT 30
        |
        v
2. Receive task payload:
   {"task_id": "task-abc", "type": "send_email", ...}
        |
        v
3. Update state: RUNNING
   UPDATE tasks SET status='RUNNING', worker_id='worker-3',
     started_at=NOW() WHERE id='task-abc'
        |
        v
4. Execute task handler:
   handler = task_registry["send_email"]
   result = handler(payload)
     |
     +-- SUCCESS:
     |   a. Update state: SUCCEEDED
     |      UPDATE tasks SET status='SUCCEEDED',
     |        result='{...}', completed_at=NOW()
     |   b. ACK message from queue
     |   c. Trigger downstream tasks (if DAG)
     |
     +-- FAILURE:
         a. Check retry_count < max_retries?
            YES: Update status='RETRYING', increment retry_count
                 Re-enqueue with backoff delay
            NO:  Update status='FAILED'
                 Move to dead letter queue
                 Alert on-call
\`\`\`

## Fault Tolerance

\`\`\`
Failure Scenarios and Recovery
================================

+---------------------+--------------------+----------------------+
| Failure             | Detection          | Recovery             |
+---------------------+--------------------+----------------------+
| Worker crashes      | Heartbeat timeout  | Re-enqueue in-flight |
| mid-execution       | (30s no heartbeat) | task. New worker     |
|                     |                    | picks it up.         |
+---------------------+--------------------+----------------------+
| Scheduler crashes   | Health check / LB  | Standby scheduler    |
|                     |                    | takes over. State    |
|                     |                    | in DB, not memory.   |
+---------------------+--------------------+----------------------+
| Redis (queue) crash | Sentinel detects   | Sentinel promotes    |
|                     | master failure     | replica. Clients     |
|                     |                    | reconnect. Pending   |
|                     |                    | tasks from AOF.      |
+---------------------+--------------------+----------------------+
| Database crash      | Connection timeout | Failover to replica. |
|                     |                    | Tasks continue from  |
|                     |                    | queue (state is      |
|                     |                    | secondary source).   |
+---------------------+--------------------+----------------------+
| Network partition   | Split-brain        | Quorum writes to DB. |
| (scheduler <->      | detection          | Workers on isolated  |
| workers)            |                    | side stop processing.|
+---------------------+--------------------+----------------------+
| Poison pill task    | 3 fast failures    | Move to DLQ, alert   |
|                     | with same error    | on-call, skip task.  |
+---------------------+--------------------+----------------------+
\`\`\`

## Monitoring Dashboard

\`\`\`
Key Metrics
=============

Queue Health:
  queue_depth{priority="high"}:    12 tasks
  queue_depth{priority="medium"}:  284 tasks
  queue_depth{priority="low"}:     1,893 tasks
  dlq_depth:                       3 tasks    [ALERT if > 0]

Throughput:
  tasks_submitted_per_sec:         142
  tasks_completed_per_sec:         138
  tasks_failed_per_sec:            4

Latency:
  queue_wait_time_p50:             200ms
  queue_wait_time_p99:             2.3s      [ALERT if > 5s]
  execution_time_p50:              1.2s
  execution_time_p99:              15s

Workers:
  workers_active:                  15 / 17
  workers_idle:                    2
  workers_dead:                    0         [ALERT if > 0]
  avg_cpu_utilization:             62%

Reliability:
  retry_rate:                      2.8%      [ALERT if > 10%]
  failure_rate:                    0.3%      [ALERT if > 5%]
  duplicate_execution_rate:        0.01%
\`\`\`

## Comparison with Production Systems

\`\`\`
+------------------+-------------+-------------+-------------+-----------+
| Feature          | Celery      | Airflow     | Temporal    | Custom    |
+------------------+-------------+-------------+-------------+-----------+
| Task types       | One-time,   | DAG-based   | Workflows,  | All       |
|                  | periodic    | workflows   | activities  |           |
+------------------+-------------+-------------+-------------+-----------+
| Broker           | Redis,      | PostgreSQL, | Built-in    | Redis,    |
|                  | RabbitMQ    | Redis       | persistence | RabbitMQ  |
+------------------+-------------+-------------+-------------+-----------+
| DAG support      | Chains,     | First-class | First-class | Manual    |
|                  | chords      | DAG editor  | workflows   |           |
+------------------+-------------+-------------+-------------+-----------+
| Retry logic      | Configurable| Task-level  | Built-in    | Custom    |
|                  | per-task    | retry       | retry policy|           |
+------------------+-------------+-------------+-------------+-----------+
| State mgmt       | Result      | Metadata DB | Event-      | Database  |
|                  | backend     |             | sourced     |           |
+------------------+-------------+-------------+-------------+-----------+
| Scalability      | Worker      | Worker +    | Worker +    | Worker +  |
|                  | scaling     | scheduler   | history svc | queue     |
|                  |             | scaling     | scaling     | scaling   |
+------------------+-------------+-------------+-------------+-----------+
| Best for         | Background  | Data        | Long-running| Full      |
|                  | jobs, async | pipelines,  | business    | control   |
|                  | tasks       | ETL, ML     | workflows   |           |
+------------------+-------------+-------------+-------------+-----------+
| Complexity       | Low-Medium  | Medium-High | High        | Varies    |
+------------------+-------------+-------------+-------------+-----------+

When to use which:
  Celery:   "I need to run background tasks in my Python web app"
  Airflow:  "I need to orchestrate daily/hourly data pipelines"
  Temporal: "I need durable, long-running business workflows
             with complex failure handling"
  Custom:   "I need full control and have specific requirements
             that don't fit existing tools"
\`\`\`

## Summary of Design Decisions

\`\`\`
+---------------------------+-----------------------------------+
| Problem                   | Solution                          |
+---------------------------+-----------------------------------+
| Task persistence          | Write to DB before enqueueing     |
| Priority handling         | Separate queues per priority      |
| Delayed execution         | Redis sorted set + timing wheel   |
| Recurring tasks           | Cron scheduler + distributed lock |
| Worker scaling            | Autoscale on queue depth          |
| Failure detection         | Heartbeats + visibility timeout   |
| Retry logic               | Exponential backoff + jitter      |
| Duplicate prevention      | Idempotency keys in DB            |
| Poison pill isolation     | Fast-fail detection + DLQ         |
| Downstream protection     | Circuit breaker per service       |
| Task dependencies         | DAG scheduler + topological sort  |
| Observability             | Metrics, distributed tracing      |
+---------------------------+-----------------------------------+
\`\`\`

## Key Takeaway

A production distributed task scheduler combines several systems: a durable queue for reliable delivery, a state store for task lifecycle tracking, a scheduler service for routing and cron management, and a worker fleet for execution. The architecture must handle failures at every layer -- worker crashes, broker outages, network partitions, and poison pill tasks. Start with a proven system like Celery or Temporal, and only build custom when you have requirements that existing tools cannot meet. The most important design principle: every task must be idempotent, because in a distributed system, exactly-once delivery is an illusion built on top of at-least-once delivery plus idempotent execution.`,
    },
  ],
};
