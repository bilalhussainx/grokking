import { Module } from "../types";

export const microservicesCommunicationModule: Module = {
  id: "modern-communication",
  title: "Microservices Communication Patterns",
  description:
    "Master synchronous and asynchronous communication, resilience patterns, and distributed transactions in microservices.",
  lessons: [
    {
      id: "synchronous-rest-grpc",
      slug: "synchronous-rest-grpc",
      title: "Synchronous Communication: REST & gRPC",
      content: `# Synchronous Communication: REST & gRPC

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

## Scale Estimation Example

For an order service handling 50K orders/hour:
\`\`\`
QPS = 50,000 / 3,600 ≈ 14 req/s (average)
Peak = 14 × 5 = 70 req/s
With gRPC at 3ms/call: single instance handles ~300 req/s
Instances needed at peak: ceil(70/300) = 1 (with headroom, run 3)
\`\`\`

For internal services, gRPC's efficiency means you need fewer instances to handle the same load.`,
    },
    {
      id: "asynchronous-messaging",
      slug: "asynchronous-messaging",
      title: "Asynchronous Messaging",
      content: `# Asynchronous Messaging

## Why Async?

Synchronous communication creates tight coupling and cascading failures. Asynchronous messaging decouples services in both **time** (consumer processes when ready) and **knowledge** (producer does not know who consumes).

\`\`\`
Synchronous:                 Asynchronous:
A ──req──▶ B (A blocks)      A ──msg──▶ [Queue] ──▶ B
A ◀──res── B                 A continues immediately
\`\`\`

## Messaging Patterns

### Point-to-Point (Queue)

One producer, one consumer. Each message is processed exactly once.

\`\`\`
Producer ──▶ [Queue] ──▶ Consumer
                msg1       (processes msg1)
                msg2
                msg3
\`\`\`

**Use case**: Task processing (send email, resize image, process payment).

### Publish-Subscribe (Topic)

One producer, many consumers. Each consumer gets a copy of every message.

\`\`\`
Producer ──▶ [Topic]
               ├──▶ Consumer A (email service)
               ├──▶ Consumer B (analytics)
               └──▶ Consumer C (audit log)
\`\`\`

**Use case**: Event notification (OrderPlaced triggers email, analytics, and inventory).

### Fan-out / Fan-in

Fan-out: One message triggers multiple parallel tasks. Fan-in: Results are aggregated.

\`\`\`
                    ┌──▶ Worker 1 ──┐
Request ──▶ [Queue] ├──▶ Worker 2 ──┼──▶ Aggregator
                    └──▶ Worker 3 ──┘
\`\`\`

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

**At-least-once + idempotent consumers** is the most practical approach. True exactly-once is extremely hard in distributed systems.

### Idempotent Consumer Pattern

\`\`\`python
def process_message(msg):
    msg_id = msg["id"]

    # Check if already processed
    if redis.exists(f"processed:{msg_id}"):
        return  # Skip duplicate

    # Process the message
    handle_order(msg["payload"])

    # Mark as processed (with TTL for cleanup)
    redis.set(f"processed:{msg_id}", "1", ex=86400)

    # Acknowledge
    msg.ack()
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

- **Bounded queues** — Reject new messages when full (producer slows down)
- **Consumer scaling** — Auto-scale consumers based on queue depth
- **Rate limiting** — Throttle producers at the API gateway
- **Priority queues** — Process critical messages first

## Scale Example: Notification System

\`\`\`
Users: 100M
Notifications/user/day: 10
Total: 1B notifications/day
QPS: 1B / 86,400 ≈ 11,600 msg/s (average)
Peak: 11,600 × 5 ≈ 58,000 msg/s

Kafka partitions needed: 58,000 / 5,000 per partition ≈ 12 partitions
Consumer instances: 12 (one per partition for max throughput)
\`\`\`

Asynchronous messaging is the backbone of every large-scale distributed system.`,
    },
    {
      id: "service-discovery-load-balancing",
      slug: "service-discovery-load-balancing",
      title: "Service Discovery & Load Balancing",
      content: `# Service Discovery & Load Balancing

## The Problem

In a microservices environment, services are dynamic — instances start, stop, scale up, and scale down continuously. Hardcoding IP addresses is impossible. How does Service A find Service B when Service B has 50 instances that change every minute?

## Service Discovery

Service discovery is the mechanism by which services find each other's network locations.

### Client-Side Discovery

The client queries a service registry and selects an instance.

\`\`\`
┌──────────┐    ┌──────────────┐
│ Service  │───▶│  Service     │
│    A     │    │  Registry    │
│          │◀───│ (Consul,     │
│          │    │  Eureka)     │
│          │    └──────────────┘
│          │
│          │──── selects instance ────▶ Service B (10.0.1.5:8080)
└──────────┘
\`\`\`

**Pros**: No extra hop; client can implement smart load balancing.
**Cons**: Every client must implement discovery logic.

### Server-Side Discovery

The client sends requests to a load balancer/router, which queries the registry.

\`\`\`
┌──────────┐    ┌──────────┐    ┌──────────────┐
│ Service  │───▶│   Load   │───▶│  Service B   │
│    A     │    │ Balancer │    │  Instance 1  │
└──────────┘    │          │    ├──────────────┤
                │          │    │  Instance 2  │
                │          │    ├──────────────┤
                │          │───▶│  Instance 3  │
                └────┬─────┘    └──────────────┘
                     │
                ┌────┴─────┐
                │ Service  │
                │ Registry │
                └──────────┘
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

### Kubernetes Service Discovery

Kubernetes provides built-in service discovery:

\`\`\`
┌─────────────────────────────────────────┐
│  Kubernetes Cluster                     │
│                                         │
│  Service "order-svc" ──▶ DNS: order-svc │
│  ┌─────┐ ┌─────┐ ┌─────┐              │
│  │Pod 1│ │Pod 2│ │Pod 3│              │
│  └─────┘ └─────┘ └─────┘              │
│                                         │
│  Other pods call: http://order-svc:8080 │
└─────────────────────────────────────────┘
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

\`\`\`
Internet ──▶ DNS (GeoDNS) ──▶ Regional LB (L4)
                                   │
                              ┌────┴────┐
                              │ L7 LBs  │ (multiple)
                              └────┬────┘
                                   │
                          ┌────────┼────────┐
                          ▼        ▼        ▼
                       App 1    App 2    App N
\`\`\`

GeoDNS routes users to the nearest region. L4 load balancers distribute across L7 load balancers. L7 load balancers route to application instances based on URL path.

## Health Checking

Load balancers must know which instances are healthy:

- **Liveness check**: "Is the process alive?" (TCP connect, HTTP 200)
- **Readiness check**: "Can it handle traffic?" (DB connected, cache warm)

Unhealthy instances are removed from the rotation immediately. This is essential — a single unhealthy instance in a round-robin pool degrades the experience for 1/N of all requests.`,
    },
    {
      id: "circuit-breaker-retry",
      slug: "circuit-breaker-retry",
      title: "Circuit Breaker & Retry Patterns",
      content: `# Circuit Breaker & Retry Patterns

## The Cascade Failure Problem

In a microservices system, one slow or failing service can bring down the entire system:

\`\`\`
User ──▶ API GW ──▶ Order Svc ──▶ Payment Svc (DOWN)
                       │
                       ├── threads blocked waiting for Payment
                       ├── thread pool exhausted
                       ├── Order Svc stops responding
                       ▼
                    API GW threads blocked
                    Everything is down
\`\`\`

This is a **cascade failure**. The circuit breaker pattern prevents it.

## Circuit Breaker

Inspired by electrical circuit breakers, this pattern monitors calls to a service and "opens the circuit" (stops calling) when failures exceed a threshold.

### Three States

\`\`\`
         failures > threshold
  ┌──────────────────────────────┐
  │                              ▼
┌─────────┐                ┌──────────┐
│ CLOSED  │                │  OPEN    │
│ (normal)│                │ (reject  │
│         │                │  all)    │
└─────────┘                └────┬─────┘
  ▲                              │
  │    success                   │ timeout expires
  │                              ▼
  │                        ┌──────────┐
  └────────────────────────│HALF-OPEN │
                           │(test one)│
                           └──────────┘
\`\`\`

- **CLOSED**: Normal operation. Requests pass through. Failures are counted.
- **OPEN**: Failures exceeded threshold. All requests immediately fail (fast-fail) without calling the downstream service. A timer starts.
- **HALF-OPEN**: Timer expired. Allow one test request through. If it succeeds, go to CLOSED. If it fails, go back to OPEN.

### Implementation

\`\`\`python
import time
from enum import Enum

class State(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=30):
        self.state = State.CLOSED
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.last_failure_time = 0

    def call(self, func, *args, **kwargs):
        if self.state == State.OPEN:
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = State.HALF_OPEN
            else:
                raise CircuitOpenError("Circuit is OPEN — failing fast")

        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise e

    def _on_success(self):
        self.failure_count = 0
        self.state = State.CLOSED

    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = State.OPEN

# Usage
breaker = CircuitBreaker(failure_threshold=5, recovery_timeout=30)

try:
    result = breaker.call(payment_service.charge, order)
except CircuitOpenError:
    # Return cached/default response or queue for later
    return fallback_response()
\`\`\`

### Configuration

| Parameter | Typical Value | Purpose |
|-----------|--------------|---------|
| Failure threshold | 5-10 failures | Consecutive failures before opening |
| Recovery timeout | 15-60 seconds | Time before testing recovery |
| Success threshold | 3-5 successes | Successes in half-open before closing |
| Monitoring window | 60 seconds | Window for counting failures |

## Retry Pattern

Retries handle transient failures — network blips, temporary overload, brief downtime during deployments.

### Exponential Backoff with Jitter

\`\`\`python
import random
import time

def retry_with_backoff(func, max_retries=3, base_delay=1.0):
    for attempt in range(max_retries + 1):
        try:
            return func()
        except TransientError as e:
            if attempt == max_retries:
                raise e

            # Exponential backoff: 1s, 2s, 4s
            delay = base_delay * (2 ** attempt)

            # Add jitter to prevent thundering herd
            jitter = random.uniform(0, delay * 0.5)
            actual_delay = delay + jitter

            print(f"Attempt {attempt + 1} failed. "
                  f"Retrying in {actual_delay:.1f}s")
            time.sleep(actual_delay)
\`\`\`

**Why jitter?** Without jitter, if 1000 clients fail at the same time, they all retry at the same time (thundering herd), causing another failure. Jitter spreads retries across time.

### What to Retry

| Retry | Do Not Retry |
|-------|-------------|
| 500 Internal Server Error | 400 Bad Request |
| 503 Service Unavailable | 401 Unauthorized |
| Connection timeout | 404 Not Found |
| DNS resolution failure | 422 Validation Error |

**Never retry non-idempotent operations** (like charging a credit card) without idempotency keys.

## Bulkhead Pattern

Isolate different call paths so one failing dependency cannot exhaust all resources.

\`\`\`
┌─────────────────────────────────┐
│  Order Service                  │
│  ┌───────────────┐              │
│  │ Payment Pool  │ 20 threads   │
│  │ (circuit      │              │
│  │  breaker)     │              │
│  └───────────────┘              │
│  ┌───────────────┐              │
│  │ Inventory Pool│ 10 threads   │
│  └───────────────┘              │
│  ┌───────────────┐              │
│  │ Email Pool    │ 5 threads    │
│  └───────────────┘              │
└─────────────────────────────────┘
\`\`\`

If the payment service is down, only the payment thread pool is exhausted. Inventory and email continue working.

## Combining Patterns

In production, these patterns work together:

\`\`\`
Request ──▶ [Bulkhead] ──▶ [Circuit Breaker] ──▶ [Retry] ──▶ Service
                                                     │
                                               [Timeout: 2s]
\`\`\`

Libraries that implement all of these: **Resilience4j** (Java), **Polly** (.NET), **Hystrix** (legacy Java, Netflix), or implement your own in Python/Go.`,
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

## Compensating Transactions

Compensations are not simply "undo." They are **semantic reversal**:

| Action | Compensation | Note |
|--------|-------------|------|
| Create order | Cancel order | Set status to "cancelled" |
| Charge \$50 | Refund \$50 | Creates a new refund transaction |
| Reserve stock | Release stock | Increment available count |
| Send email | Send cancellation email | Cannot unsend original |

**Key principle**: Compensations must be **idempotent** — running them multiple times produces the same result. This handles the case where the compensation message is delivered more than once.

## Choreography vs Orchestration

| Factor | Choreography | Orchestration |
|--------|-------------|---------------|
| Coupling | Low (events only) | Medium (orchestrator knows services) |
| Complexity | Grows quickly with steps | Linear growth |
| Visibility | Hard to see overall flow | Clear workflow in one place |
| Testing | Hard (distributed events) | Easier (test orchestrator) |
| Best for | 2-4 simple steps | 4+ steps, complex workflows |

## Design Tips

1. **Keep sagas short** — Fewer steps means fewer failure modes
2. **Make all steps idempotent** — Messages may be delivered multiple times
3. **Store saga state** — Persist which steps completed for recovery after crashes
4. **Set timeouts** — A step that never responds should trigger compensation
5. **Consider partial success** — Sometimes "best effort" is acceptable (send email failed but order succeeded)`,
    },
  ],
};
