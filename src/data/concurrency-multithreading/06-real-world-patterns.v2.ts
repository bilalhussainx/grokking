import { Module } from "../types";

export const realWorldPatternsModule: Module = {
  id: "concurrency-patterns",
  title: "Real-World Concurrency Patterns",
  description: "Apply concurrency to real systems: web servers, connection pools, rate limiters, map-reduce, and pub-sub.",
  lessons: [
    {
      id: "pattern-web-server",
      slug: "pattern-web-server",
      title: "Web Server Request Handling",
      content: `## Web Server Concurrency Models

Every web server must handle multiple clients simultaneously. The choice of concurrency model defines the server's throughput, latency, and resource usage.

### Model 1: Thread-Per-Request

Each incoming request spawns a new thread:

\`\`\`
Client A ──→ [Thread 1] ──→ Process ──→ Response
Client B ──→ [Thread 2] ──→ Process ──→ Response
Client C ──→ [Thread 3] ──→ Process ──→ Response
\`\`\`

**Pros**: Simple to implement, each request is isolated.
**Cons**: Thread creation is expensive, unbounded threads can crash the server under load. 10,000 threads = massive memory usage and context-switch overhead.

### Model 2: Thread Pool

A fixed pool of worker threads handles requests from a queue:

\`\`\`
                    ┌──────────────────────┐
Requests ──→ Queue ─┤  Worker Thread 1     │
                    │  Worker Thread 2     │
                    │  Worker Thread 3     │
                    │  Worker Thread 4     │
                    └──────────────────────┘
\`\`\`

**Pros**: Bounded resource usage, thread reuse avoids creation overhead.
**Cons**: Queue can grow unbounded under burst traffic, pool size requires tuning.

**Pool sizing rule of thumb:**
- CPU-bound handlers: pool_size = number of CPU cores
- I/O-bound handlers: pool_size = cores * (1 + wait_time / compute_time)

### Model 3: Async Event Loop

A single thread multiplexes thousands of connections using non-blocking I/O:

\`\`\`
              ┌─────────────────────────────────┐
              │         Event Loop               │
Clients ──→  │  Check ready I/O → handle it     │
              │  No blocking — switch instantly  │
              │  10,000+ concurrent connections  │
              └─────────────────────────────────┘
\`\`\`

**Pros**: Minimal memory, handles massive concurrency (C10K+).
**Cons**: CPU-bound work blocks the entire loop, callback-heavy code can be complex.

### Model Comparison

| Model | Concurrency | Memory | CPU-bound? | Complexity |
|-------|-------------|--------|-----------|------------|
| Thread-per-request | Low (hundreds) | High | OK | Low |
| Thread pool | Medium (thousands) | Medium | OK | Medium |
| Async event loop | High (10,000+) | Low | Blocks loop | Higher |
| Hybrid (async + pool) | Highest | Medium | Offloads CPU | Highest |

### Real-World Examples

- **Flask/Django** (default): Thread pool via WSGI server (Gunicorn workers)
- **FastAPI/Starlette**: Async event loop (uvicorn)
- **Node.js**: Single-threaded event loop + worker thread pool for CPU
- **Java Tomcat**: Thread pool (200 threads default)
- **Nginx**: Event-driven (async I/O for proxying)

### Interview Insight

When asked "How would you design a web server?", mention the trade-offs: thread-per-request is simple but doesn't scale; thread pools bound resource usage; async handles the most connections but requires non-blocking code throughout.`,
      starterCode: `import threading
import time
from queue import Queue

# TODO: Implement a thread-pool based request handler
# 1. Create a RequestHandler class with a fixed thread pool
#    - Constructor takes pool_size
#    - Has a request_queue (Queue)
#    - Spawns pool_size daemon worker threads
# 2. Workers pull requests from the queue and process them
# 3. Processing simulates I/O (sleep) then returns a result
# 4. Submit 20 requests and measure total time vs sequential

class ThreadPoolServer:
    def __init__(self, pool_size):
        self.pool_size = pool_size
        self.request_queue = Queue()
        self.results = []
        self.results_lock = threading.Lock()
        # TODO: Create and start worker threads

    def _worker(self):
        # TODO: Loop forever, get request from queue, process it
        pass

    def handle_request(self, request_id, processing_time):
        """Simulate handling a request"""
        # TODO: Sleep for processing_time, return result
        pass

    def submit(self, request_id, processing_time):
        # TODO: Put request on the queue
        pass

    def wait_for_all(self):
        # TODO: Wait for queue to be empty
        pass

# TODO: Create server with pool_size=4
# TODO: Submit 20 requests with random processing times
# TODO: Measure total time`,
      solutionCode: `import threading
import time
from queue import Queue
import random

class ThreadPoolServer:
    def __init__(self, pool_size):
        self.pool_size = pool_size
        self.request_queue = Queue()
        self.results = []
        self.results_lock = threading.Lock()

        # Create worker threads
        for i in range(pool_size):
            t = threading.Thread(target=self._worker, daemon=True,
                                 name=f"Worker-\${i}")
            t.start()

    def _worker(self):
        while True:
            request_id, processing_time = self.request_queue.get()
            try:
                result = self.handle_request(request_id, processing_time)
                with self.results_lock:
                    self.results.append(result)
            finally:
                self.request_queue.task_done()

    def handle_request(self, request_id, processing_time):
        name = threading.current_thread().name
        print(f"  [\${name}] Processing request \${request_id} "
              f"(\${processing_time:.1f}s)")
        time.sleep(processing_time)  # Simulate I/O
        return {"id": request_id, "worker": name, "time": processing_time}

    def submit(self, request_id, processing_time):
        self.request_queue.put((request_id, processing_time))

    def wait_for_all(self):
        self.request_queue.join()

# Create server
POOL_SIZE = 4
server = ThreadPoolServer(pool_size=POOL_SIZE)

# Generate requests with random processing times
requests = [(i, random.uniform(0.1, 0.5)) for i in range(20)]
sequential_time = sum(t for _, t in requests)

# Submit all requests
print(f"Thread Pool Server (pool_size={POOL_SIZE})")
print(f"Submitting \${len(requests)} requests...\\n")
start = time.time()

for req_id, proc_time in requests:
    server.submit(req_id, proc_time)

server.wait_for_all()
total = time.time() - start

print(f"\\nAll requests complete!")
print(f"Pool time:       \${total:.2f}s")
print(f"Sequential would: \${sequential_time:.2f}s")
print(f"Speedup:          \${sequential_time / total:.1f}x")
print(f"Effective workers: \${POOL_SIZE} threads")`,
    },
    {
      id: "pattern-connection-pool",
      slug: "pattern-connection-pool",
      title: "Database Connection Pooling",
      content: `## Database Connection Pooling

Creating a database connection is expensive — it involves TCP handshake, authentication, and protocol negotiation. A **connection pool** reuses a fixed set of connections across requests.

### Why Connection Pooling?

\`\`\`
Without pooling:
  Request 1: [Connect 50ms][Query 5ms][Close]
  Request 2: [Connect 50ms][Query 5ms][Close]
  Total: 110ms, 2 connections created

With pooling:
  Request 1: [Borrow 0ms][Query 5ms][Return]
  Request 2: [Borrow 0ms][Query 5ms][Return]
  Total: 10ms, 1 connection reused!
\`\`\`

### Core Concepts

A connection pool manages:
1. **Minimum connections**: Pre-created at startup (warm pool)
2. **Maximum connections**: Upper bound to prevent overloading the DB
3. **Idle timeout**: Close connections that sit unused too long
4. **Health checks**: Validate connections before lending them out

### Semaphore-Based Implementation

A **Semaphore** is the perfect primitive for connection pooling. It tracks how many connections are available:

\`\`\`
Semaphore(max_connections=3):

  Thread A: acquire() → count=2 → use connection → release() → count=3
  Thread B: acquire() → count=2 → use connection ...
  Thread C: acquire() → count=1 → use connection ...
  Thread D: acquire() → count=0 → BLOCKS until a connection is returned
\`\`\`

### Connection Lifecycle

\`\`\`
                    ┌───────────────┐
                    │  Connection   │
         create()   │    Pool       │  destroy()
    ┌──────────────►│               │──────────────┐
    │               │  [C1] [C2]    │              │
    │    borrow()   │  [C3] [idle]  │  return()    │
    │  ┌───────────►│               │◄───────────┐ │
    │  │            └───────────────┘            │ │
    │  │                                        │ │
    ▼  │            ┌───────────────┐            │ ▼
 Create             │   Worker      │          Return
 on demand          │   Thread      │          to pool
                    └───────────────┘
\`\`\`

### Thread Safety Requirements

The pool must handle:
- **Multiple threads borrowing** simultaneously (use Semaphore)
- **Returning connections** safely (use Lock around the pool list)
- **Exhausted pool** — threads must wait (Semaphore blocks automatically)
- **Broken connections** — detect and replace them

### Design Decisions

| Decision | Options |
|----------|---------|
| When pool exhausted | Block (semaphore) vs raise error vs grow pool |
| Connection validation | On borrow, on return, or periodic background check |
| Pool data structure | Queue (FIFO), Stack (LIFO — cache-friendly) |
| Idle connection cleanup | Background timer thread |

**LIFO is preferred** for database pools — the most recently returned connection is most likely still alive and warm in the server's cache.

### Real-World Pool Libraries

- **Python**: \`sqlalchemy.pool\`, \`psycopg2.pool\`, \`aiomysql.Pool\`
- **Java**: HikariCP, Apache DBCP, c3p0
- **Node.js**: \`pg.Pool\`, \`mysql2.createPool()\`

### Interview Key Points

1. Connection pools trade memory (holding open connections) for latency (avoiding reconnection)
2. Semaphores naturally enforce the max-connections limit
3. Always use try/finally to ensure connections are returned to the pool
4. LIFO ordering improves cache locality and connection freshness`,
      starterCode: `import threading
import time
import random
from queue import Queue, Empty

# TODO: Implement a thread-safe connection pool
# 1. ConnectionPool class with max_size, a Queue of connections,
#    and a Semaphore to limit concurrent borrows
# 2. borrow() - acquire semaphore, get connection from queue
# 3. release(conn) - put connection back, release semaphore
# 4. Use as context manager for automatic release
# 5. Test with multiple threads querying simultaneously

class Connection:
    """Simulated database connection"""
    _counter = 0
    _lock = threading.Lock()

    def __init__(self):
        with Connection._lock:
            Connection._counter += 1
            self.id = Connection._counter
        time.sleep(0.1)  # Simulate connection setup time

    def query(self, sql):
        time.sleep(random.uniform(0.05, 0.15))  # Simulate query
        return f"Result from conn-{self.id}"

class ConnectionPool:
    def __init__(self, max_size):
        # TODO: Initialize pool with max_size connections
        # TODO: Use a Semaphore to limit concurrent access
        pass

    def borrow(self):
        # TODO: Acquire semaphore, get connection from queue
        pass

    def release(self, conn):
        # TODO: Return connection to queue, release semaphore
        pass

# TODO: Create pool with 3 connections
# TODO: Spawn 10 threads that each borrow, query, and release
# TODO: Show that only 3 connections are ever used simultaneously`,
      solutionCode: `import threading
import time
import random
from queue import Queue

class Connection:
    """Simulated database connection"""
    _counter = 0
    _lock = threading.Lock()

    def __init__(self):
        with Connection._lock:
            Connection._counter += 1
            self.id = Connection._counter
        time.sleep(0.1)  # Simulate connection setup

    def query(self, sql):
        time.sleep(random.uniform(0.05, 0.15))
        return f"Result from conn-\${self.id}"

class ConnectionPool:
    def __init__(self, max_size):
        self.max_size = max_size
        self.semaphore = threading.Semaphore(max_size)
        self.pool = Queue()

        # Pre-create connections
        print(f"Creating \${max_size} connections...")
        for _ in range(max_size):
            self.pool.put(Connection())
        print(f"Pool ready with \${max_size} connections\\n")

    def borrow(self):
        self.semaphore.acquire()  # Block if all connections in use
        conn = self.pool.get()
        return conn

    def release(self, conn):
        self.pool.put(conn)
        self.semaphore.release()

# Create pool
pool = ConnectionPool(max_size=3)
results = []
results_lock = threading.Lock()

def worker(worker_id):
    conn = pool.borrow()
    try:
        thread = threading.current_thread().name
        print(f"  [\${thread}] Worker \${worker_id} borrowed conn-\${conn.id}")
        result = conn.query(f"SELECT * FROM users WHERE id=\${worker_id}")
        with results_lock:
            results.append((worker_id, conn.id, result))
    finally:
        pool.release(conn)  # Always return to pool!
        print(f"  [\${thread}] Worker \${worker_id} returned conn-\${conn.id}")

# Spawn 10 workers competing for 3 connections
start = time.time()
threads = [threading.Thread(target=worker, args=(i,), name=f"T-\${i}")
           for i in range(10)]
for t in threads:
    t.start()
for t in threads:
    t.join()

elapsed = time.time() - start
conns_used = set(conn_id for _, conn_id, _ in results)
print(f"\\n10 queries completed in \${elapsed:.2f}s")
print(f"Only \${len(conns_used)} connections used: \${conns_used}")
print(f"Connections were safely reused across \${len(results)} requests")`,
    },
    {
      id: "pattern-rate-limiter",
      slug: "pattern-rate-limiter",
      title: "Rate Limiter with Threading",
      content: `## Thread-Safe Rate Limiter

A **rate limiter** controls how many operations can happen within a time window. This is essential for API servers, network clients, and resource-constrained systems.

### Token Bucket Algorithm

The most common rate-limiting algorithm. Imagine a bucket that holds tokens:

\`\`\`
Token Bucket (capacity=5, refill_rate=2/sec):

Time 0s: [●●●●●] 5 tokens (full)
         Request → consume 1 → [●●●●○] 4 tokens ✓
         Request → consume 1 → [●●●○○] 3 tokens ✓
         Request → consume 1 → [●●○○○] 2 tokens ✓

Time 1s: [●●●●○] 4 tokens (refilled 2)
         Request → consume 1 → [●●●○○] 3 tokens ✓

Burst:   5 rapid requests → [○○○○○] 0 tokens
         Next request → BLOCKED until refill
\`\`\`

### How It Works

1. Bucket starts with N tokens (capacity)
2. Each request consumes 1 token
3. Tokens are added at a fixed rate (e.g., 10/second)
4. If no tokens available, request is blocked or rejected
5. Bucket never exceeds capacity (allows controlled bursts)

### Thread Safety Challenges

Multiple threads requesting tokens simultaneously creates race conditions:

\`\`\`
Thread A: check tokens (1 left) → consume → tokens = 0  ✓
Thread B: check tokens (1 left) → consume → tokens = -1 ✗ RACE!
\`\`\`

We need a **Lock** to make the check-and-consume operation atomic.

### Design Decisions

| Decision | Option A | Option B |
|----------|----------|----------|
| When empty | Block (wait for refill) | Reject immediately |
| Refill strategy | Background thread | Lazy (calculate on check) |
| Scope | Per-client | Global |
| Granularity | Per second | Sliding window |

**Lazy refill** is elegant: instead of a background thread adding tokens, calculate how many tokens should have been added based on elapsed time when a request arrives. This avoids the overhead of a timer thread.

### Lazy Refill Formula

\`\`\`
elapsed = current_time - last_refill_time
new_tokens = elapsed * refill_rate
tokens = min(capacity, tokens + new_tokens)
last_refill_time = current_time
\`\`\`

### Rate Limiter Variants

| Variant | Description | Use Case |
|---------|-------------|----------|
| Token Bucket | Steady rate + burst | API rate limiting |
| Leaky Bucket | Fixed output rate, queue input | Traffic shaping |
| Fixed Window | Count per time window | Simple quotas |
| Sliding Window | Rolling count | Smoother limiting |

### Real-World Usage

- **API Gateways**: Limit requests per API key (e.g., 100 req/min)
- **Login throttling**: Max 5 login attempts per minute per IP
- **Database queries**: Prevent query floods during traffic spikes
- **Message queues**: Control consumer processing rate

### Interview Tip

Rate limiter design is a popular system design question. Be ready to discuss: distributed rate limiting (Redis-based), per-user vs global limits, and the trade-off between blocking and rejecting requests.`,
      starterCode: `import threading
import time

# TODO: Implement a thread-safe Token Bucket rate limiter
# 1. TokenBucket class with capacity, refill_rate, and current tokens
# 2. Use lazy refill: calculate new tokens based on elapsed time
# 3. acquire() method: consume a token (block until available)
# 4. try_acquire() method: consume a token or return False
# 5. All operations must be thread-safe (use Lock)
# 6. Test with multiple threads making requests

class TokenBucket:
    def __init__(self, capacity, refill_rate):
        """
        capacity: max tokens in the bucket
        refill_rate: tokens added per second
        """
        # TODO: Initialize bucket state and lock
        pass

    def _refill(self):
        """Calculate and add tokens based on elapsed time"""
        # TODO: Lazy refill based on time since last refill
        pass

    def acquire(self, timeout=None):
        """Block until a token is available, then consume it"""
        # TODO: Wait for token, return True when consumed
        pass

    def try_acquire(self):
        """Try to consume a token, return False if empty"""
        # TODO: Non-blocking acquire
        pass

# TODO: Create a bucket (capacity=5, refill_rate=2 tokens/sec)
# TODO: Spawn 15 threads that each try to acquire a token
# TODO: Show that requests are rate-limited`,
      solutionCode: `import threading
import time

class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity
        self.last_refill = time.monotonic()
        self.lock = threading.Lock()

    def _refill(self):
        """Lazy refill: calculate tokens earned since last check"""
        now = time.monotonic()
        elapsed = now - self.last_refill
        new_tokens = elapsed * self.refill_rate
        if new_tokens > 0:
            self.tokens = min(self.capacity, self.tokens + new_tokens)
            self.last_refill = now

    def acquire(self, timeout=None):
        """Block until a token is available"""
        deadline = time.monotonic() + timeout if timeout else None
        while True:
            with self.lock:
                self._refill()
                if self.tokens >= 1:
                    self.tokens -= 1
                    return True
            if deadline and time.monotonic() >= deadline:
                return False
            time.sleep(0.05)  # Brief wait before retry

    def try_acquire(self):
        """Non-blocking: return False if no tokens"""
        with self.lock:
            self._refill()
            if self.tokens >= 1:
                self.tokens -= 1
                return True
            return False

# Test the rate limiter
bucket = TokenBucket(capacity=5, refill_rate=2)  # 5 burst, 2/sec steady
results = []
results_lock = threading.Lock()

def make_request(request_id):
    start = time.monotonic()
    acquired = bucket.acquire(timeout=5)
    wait_time = time.monotonic() - start
    name = threading.current_thread().name
    with results_lock:
        status = "ALLOWED" if acquired else "REJECTED"
        results.append((request_id, wait_time, status))
        print(f"  [\${name}] Request \${request_id:2d}: \${status} "
              f"(waited \${wait_time:.2f}s)")

print("Token Bucket Rate Limiter")
print(f"Capacity: 5, Refill: 2/sec\\n")

# Fire 15 requests simultaneously
threads = [threading.Thread(target=make_request, args=(i,),
                            name=f"Req-\${i:02d}")
           for i in range(15)]
start = time.time()
for t in threads:
    t.start()
for t in threads:
    t.join()
total = time.time() - start

allowed = sum(1 for _, _, s in results if s == "ALLOWED")
print(f"\\n\${allowed}/\${len(results)} requests allowed in \${total:.2f}s")
print(f"First 5 were instant (burst capacity)")
print(f"Remaining were rate-limited to ~2/sec")`,
    },
    {
      id: "pattern-map-reduce",
      slug: "pattern-map-reduce",
      title: "Parallel Map-Reduce",
      content: `## Parallel Map-Reduce

Map-Reduce is a two-phase pattern for processing large datasets in parallel: **map** transforms each element independently, **reduce** combines the results.

### The Pattern

\`\`\`
Input Data: [A, B, C, D, E, F, G, H]

Phase 1 — MAP (parallel):
  Thread 1: map([A, B]) → [a', b']
  Thread 2: map([C, D]) → [c', d']
  Thread 3: map([E, F]) → [e', f']
  Thread 4: map([G, H]) → [g', h']

Phase 2 — REDUCE (synchronized):
  combine([a',b'], [c',d'], [e',f'], [g',h']) → Final Result
\`\`\`

### Why It Works

The **map** phase is **embarrassingly parallel** — each chunk can be processed independently with no shared state. The **reduce** phase combines results, which requires synchronization but operates on a much smaller dataset.

### Splitting the Work

Divide the input into roughly equal chunks for N workers:

\`\`\`python
def chunk(data, n_workers):
    size = len(data) // n_workers
    return [data[i:i+size] for i in range(0, len(data), size)]
\`\`\`

### Synchronized Reduce

The reduce phase must be thread-safe. Common approaches:

1. **Collect results in a thread-safe list**, then reduce after all mappers finish:
\`\`\`python
results = []
lock = threading.Lock()

def mapper(chunk):
    partial = process(chunk)
    with lock:
        results.append(partial)
\`\`\`

2. **Use a Queue** — mappers put results, main thread reduces:
\`\`\`python
result_queue = Queue()

def mapper(chunk):
    result_queue.put(process(chunk))

# After all mappers finish:
final = reduce_func(result_queue)
\`\`\`

3. **concurrent.futures** — simplest approach:
\`\`\`python
with ThreadPoolExecutor(max_workers=4) as executor:
    mapped = list(executor.map(process, chunks))
final = reduce(combine, mapped)
\`\`\`

### Use Cases

| Application | Map Phase | Reduce Phase |
|-------------|-----------|--------------|
| Word count | Count words per chunk | Sum all counts |
| Log analysis | Parse entries per file | Merge statistics |
| Image processing | Apply filter per tile | Stitch tiles |
| Search | Search each shard | Merge & rank results |
| Data aggregation | Compute per-partition stats | Combine statistics |

### Performance Considerations

- **Chunk size matters**: Too many small chunks = overhead; too few large chunks = poor load balancing
- **Uneven work**: If chunks take different times, some threads sit idle. Use a work-stealing queue or smaller chunks.
- **Reduce bottleneck**: If reduce is complex, consider a tree reduction (reduce pairs, then reduce results)

\`\`\`
Linear reduce:    [a, b, c, d, e, f, g, h]
                  → ((((((a+b)+c)+d)+e)+f)+g)+h   (7 steps, sequential)

Tree reduce:      [a, b, c, d, e, f, g, h]
                  → [a+b, c+d, e+f, g+h]          (4 parallel)
                  → [ab+cd, ef+gh]                 (2 parallel)
                  → [abcd+efgh]                    (1 final)
                  (3 steps with parallelism)
\`\`\`

### Interview Insight

Map-Reduce is foundational for distributed systems (Hadoop, Spark). In interviews, focus on: how to partition data, ensuring the map function is pure (no side effects), and how to handle failures in individual workers.`,
      starterCode: `import threading
import time
from collections import Counter

# TODO: Implement parallel word count using Map-Reduce
# 1. Write a map function that counts word frequencies in a text chunk
# 2. Write a reduce function that merges multiple Counter objects
# 3. Split a large text into chunks, map in parallel, reduce results
# 4. Compare with single-threaded word count

text = """
the quick brown fox jumps over the lazy dog
the dog barked at the fox and the fox ran away
the quick fox was too quick for the lazy dog
brown dogs and brown foxes live in the forest
the forest was dark and the quick fox hid there
lazy dogs sleep while quick foxes hunt at night
the night was cold and the fox found the dog
""".strip()

# Multiply text to make it large enough to benefit from parallelism
large_text = " ".join([text] * 5000)

def map_word_count(text_chunk):
    """Map: count word frequencies in a chunk"""
    # TODO: Return a Counter of word frequencies
    pass

def reduce_counts(counters):
    """Reduce: merge multiple Counters into one"""
    # TODO: Combine all Counter objects
    pass

def parallel_word_count(text, n_workers=4):
    """Split text, map in parallel, reduce results"""
    # TODO: Split text into chunks
    # TODO: Use threads to map each chunk
    # TODO: Reduce the results
    pass

# TODO: Compare single-threaded vs parallel word count
# TODO: Verify both produce the same results`,
      solutionCode: `import threading
import time
from collections import Counter
from concurrent.futures import ThreadPoolExecutor

text = """
the quick brown fox jumps over the lazy dog
the dog barked at the fox and the fox ran away
the quick fox was too quick for the lazy dog
brown dogs and brown foxes live in the forest
the forest was dark and the quick fox hid there
lazy dogs sleep while quick foxes hunt at night
the night was cold and the fox found the dog
""".strip()

large_text = " ".join([text] * 5000)

def map_word_count(text_chunk):
    """Map: count word frequencies in a chunk"""
    words = text_chunk.lower().split()
    return Counter(words)

def reduce_counts(counters):
    """Reduce: merge multiple Counters into one"""
    total = Counter()
    for c in counters:
        total += c
    return total

def chunk_text(text, n_chunks):
    """Split text into roughly equal chunks at word boundaries"""
    words = text.split()
    size = len(words) // n_chunks
    chunks = []
    for i in range(0, len(words), size):
        chunks.append(" ".join(words[i:i+size]))
    return chunks

def parallel_word_count(text, n_workers=4):
    chunks = chunk_text(text, n_workers)
    with ThreadPoolExecutor(max_workers=n_workers) as executor:
        mapped = list(executor.map(map_word_count, chunks))
    return reduce_counts(mapped)

# Single-threaded
start = time.time()
single_result = map_word_count(large_text)
single_time = time.time() - start

# Parallel
start = time.time()
parallel_result = parallel_word_count(large_text, n_workers=4)
parallel_time = time.time() - start

# Verify correctness
assert single_result == parallel_result, "Results don't match!"

print("Parallel Map-Reduce Word Count")
print(f"Text size: \${len(large_text):,} characters\\n")
print(f"Single-threaded: \${single_time:.3f}s")
print(f"Parallel (4 workers): \${parallel_time:.3f}s")
print(f"Speedup: \${single_time / parallel_time:.2f}x")
print(f"\\nResults match: True")
print(f"\\nTop 10 words:")
for word, count in parallel_result.most_common(10):
    print(f"  \${word:12s} \${count:,}")`,
    },
    {
      id: "pattern-pub-sub",
      slug: "pattern-pub-sub",
      title: "Pub-Sub with Threads",
      content: `## Publish-Subscribe Pattern with Threads

The **Pub-Sub** pattern decouples message producers (publishers) from consumers (subscribers). Publishers send messages to **topics**, and subscribers receive messages from topics they're interested in.

### Architecture

\`\`\`
Publisher A ──→ Topic: "orders" ──→ Subscriber 1 (order processor)
                                ──→ Subscriber 2 (analytics)
                                ──→ Subscriber 3 (notification)

Publisher B ──→ Topic: "logs"   ──→ Subscriber 4 (log aggregator)
\`\`\`

Publishers don't know who subscribes. Subscribers don't know who publishes. The **message broker** manages the routing.

### Thread-Based Implementation

Each subscriber runs in its own thread, waiting for messages on its subscribed topics. The broker uses **Condition variables** to efficiently notify waiting subscribers.

### Why Condition Variables?

A subscriber could busy-wait (spin loop checking for new messages), but this wastes CPU. A **Condition** variable lets threads sleep and wake up only when a new message arrives:

\`\`\`
Without Condition (busy wait):
  Subscriber: check → nothing → check → nothing → check → MESSAGE!
  CPU: 100% spinning

With Condition (efficient wait):
  Subscriber: wait() → sleeping... → notified! → MESSAGE!
  CPU: ~0% while waiting
\`\`\`

### Key Components

| Component | Role |
|-----------|------|
| **Topic** | Named channel for messages |
| **Publisher** | Sends messages to a topic |
| **Subscriber** | Receives messages from subscribed topics |
| **Broker** | Routes messages from topics to subscribers |
| **Condition** | Notifies subscribers when new messages arrive |

### Message Delivery Models

| Model | Description | Use Case |
|-------|-------------|----------|
| Fan-out | Every subscriber gets every message | Event notification |
| Competing consumers | Only one subscriber processes each msg | Work distribution |
| Filtered | Subscribers filter by content | Selective processing |

### Thread Safety Considerations

1. **Topic subscription list** — Lock when adding/removing subscribers
2. **Message queue per subscriber** — Lock or use thread-safe Queue
3. **Notification** — Condition.notify_all() wakes all waiting subscribers
4. **Shutdown** — Publish a sentinel value or set a flag + notify

### Advantages of Pub-Sub

- **Loose coupling**: Publishers and subscribers are independent
- **Scalability**: Add subscribers without modifying publishers
- **Flexibility**: A subscriber can listen to multiple topics
- **Resilience**: If a subscriber is slow, others aren't affected (with queues)

### Real-World Examples

- **Redis Pub/Sub**: In-memory message broker
- **Apache Kafka**: Distributed event streaming
- **RabbitMQ**: Message queue with pub/sub exchanges
- **AWS SNS**: Cloud pub/sub service

### Interview Connection

Pub-Sub comes up in system design interviews for: notification systems, event-driven architectures, chat applications, and real-time dashboards. Emphasize the decoupling benefit and discuss how to handle slow subscribers (backpressure, dropping messages, or bounded queues).`,
      starterCode: `import threading
import time
from queue import Queue

# TODO: Implement a thread-safe Pub-Sub message broker
# 1. MessageBroker class with:
#    - subscribe(topic, callback) — register a callback for a topic
#    - publish(topic, message) — send message to all topic subscribers
#    - Each subscriber callback runs in a separate thread
# 2. Use Condition variables for efficient notification
# 3. Test with multiple publishers and subscribers on different topics

class MessageBroker:
    def __init__(self):
        # TODO: Initialize topic→subscribers mapping and lock
        pass

    def subscribe(self, topic, subscriber_name, callback):
        """Register a callback for a topic"""
        # TODO: Add callback to topic's subscriber list
        pass

    def publish(self, topic, message):
        """Publish message to all subscribers of a topic"""
        # TODO: Notify all subscribers on this topic
        pass

    def start(self):
        """Start subscriber threads"""
        # TODO: Start background processing
        pass

    def shutdown(self):
        """Gracefully shut down all subscribers"""
        pass

# TODO: Create broker
# TODO: Subscribe to "orders" and "logs" topics
# TODO: Publish messages and verify delivery`,
      solutionCode: `import threading
import time
from queue import Queue, Empty

class MessageBroker:
    def __init__(self):
        self.topics = {}  # topic → list of (name, queue)
        self.lock = threading.Lock()
        self.threads = []
        self.running = True

    def subscribe(self, topic, subscriber_name, callback):
        """Register a callback for a topic"""
        msg_queue = Queue()
        with self.lock:
            if topic not in self.topics:
                self.topics[topic] = []
            self.topics[topic].append((subscriber_name, msg_queue))

        # Start a thread for this subscriber
        def listener():
            while self.running:
                try:
                    message = msg_queue.get(timeout=0.5)
                    if message is None:  # Shutdown sentinel
                        break
                    callback(subscriber_name, topic, message)
                except Empty:
                    continue

        t = threading.Thread(target=listener, daemon=True,
                             name=f"Sub-\${subscriber_name}")
        t.start()
        self.threads.append(t)
        print(f"  [\${subscriber_name}] subscribed to '{topic}'")

    def publish(self, topic, message):
        """Publish message to all subscribers of a topic"""
        with self.lock:
            subscribers = self.topics.get(topic, [])
        for name, queue in subscribers:
            queue.put(message)

    def shutdown(self):
        self.running = False
        with self.lock:
            for topic, subs in self.topics.items():
                for name, queue in subs:
                    queue.put(None)  # Sentinel to exit
        for t in self.threads:
            t.join(timeout=2)
        print("\\nBroker shut down.")

# --- Demo ---
broker = MessageBroker()
received = []
received_lock = threading.Lock()

def on_message(subscriber, topic, message):
    with received_lock:
        received.append((subscriber, topic, message))
    print(f"  [\${subscriber}] received on '{topic}': \${message}")

# Subscribe
print("Setting up subscriptions:")
broker.subscribe("orders", "processor", on_message)
broker.subscribe("orders", "analytics", on_message)
broker.subscribe("orders", "notifier", on_message)
broker.subscribe("logs", "aggregator", on_message)
broker.subscribe("logs", "alerter", on_message)

time.sleep(0.1)  # Let threads start

# Publish
print("\\nPublishing messages:")
broker.publish("orders", {"type": "new_order", "id": 1001, "total": 59.99})
broker.publish("orders", {"type": "new_order", "id": 1002, "total": 124.50})
broker.publish("logs", {"level": "ERROR", "msg": "DB connection timeout"})
broker.publish("logs", {"level": "INFO", "msg": "Server started"})

time.sleep(1)  # Let messages be processed

# Summary
print(f"\\nTotal messages delivered: \${len(received)}")
print(f"Order subscribers got: \${sum(1 for s,t,_ in received if t=='orders')} msgs")
print(f"Log subscribers got: \${sum(1 for s,t,_ in received if t=='logs')} msgs")

broker.shutdown()`,
    },
  ],
};
