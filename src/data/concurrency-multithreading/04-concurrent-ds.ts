import { Module } from "../types";

export const concurrentDsModule: Module = {
  id: "concurrency-ds",
  title: "Concurrent Data Structures",
  description: "Build thread-safe data structures from scratch: queues, hash maps, blocking queues, lock-free stacks, and thread pools.",
  lessons: [
    {
      id: "thread-safe-queue",
      slug: "thread-safe-queue",
      title: "Thread-Safe Queue",
      content: `## Thread-Safe Queue

A **thread-safe queue** allows multiple threads to enqueue and dequeue items safely without data corruption. This is the backbone of producer-consumer patterns and task distribution systems.

### Why Regular Queues Aren't Safe

A standard Python list used as a queue has race conditions:

\`\`\`
Thread A: dequeue                Thread B: dequeue
────────────────                 ────────────────
check: len(q) > 0? Yes          check: len(q) > 0? Yes
                                 item = q.pop(0)  # gets last item
item = q.pop(0)  # IndexError!  # queue is now empty
\`\`\`

### Design Choices

| Approach | Pros | Cons |
|----------|------|------|
| Single lock | Simple, correct | Poor concurrency |
| Two locks (head/tail) | Enqueue/dequeue can run in parallel | More complex |
| Lock-free (CAS) | No blocking | Very complex, subtle bugs |
| Python queue.Queue | Built-in, battle-tested | Slightly slower than hand-rolled |

### Single-Lock Implementation

The simplest correct approach — one lock protects all operations:

\`\`\`python
class ThreadSafeQueue:
    def __init__(self):
        self.items = collections.deque()
        self.lock = threading.Lock()

    def enqueue(self, item):
        with self.lock:
            self.items.append(item)

    def dequeue(self):
        with self.lock:
            if self.items:
                return self.items.popleft()
            return None
\`\`\`

### Two-Lock Queue (Michael-Scott Inspired)

Uses separate locks for the head and tail, allowing concurrent enqueue and dequeue:

\`\`\`
Enqueue (tail lock):          Dequeue (head lock):
  ┌───┐  ┌───┐  ┌───┐         ┌───┐  ┌───┐  ┌───┐
  │ A │→│ B │→│ C │←tail     head→│ A │→│ B │→│ C │
  └───┘  └───┘  └───┘         └───┘  └───┘  └───┘
  Add D to tail                Remove A from head
  (doesn't touch head)        (doesn't touch tail)
\`\`\`

This is a significant performance improvement when enqueue and dequeue rates are balanced.

### Python's queue.Queue

Python provides a production-ready thread-safe queue:

\`\`\`python
import queue

q = queue.Queue(maxsize=10)   # bounded queue
q.put(item)                    # blocks if full
q.put(item, timeout=5)        # blocks up to 5 seconds
item = q.get()                 # blocks if empty
item = q.get_nowait()          # raises queue.Empty if empty
q.task_done()                  # signal that item processing is complete
q.join()                       # block until all items are processed
\`\`\`

### Performance Considerations

For most Python applications, \`queue.Queue\` is the right choice. It uses a \`Condition\` variable internally and handles all edge cases. Only build custom implementations when:
1. You need the two-lock optimization for very high throughput
2. You're building a learning exercise (like this one!)
3. You need specialized behavior not offered by the standard library`,
      starterCode: `import threading
import time
import random
from collections import deque

# TODO: Implement a thread-safe queue with two locks
# (separate head and tail locks for concurrent access)

class TwoLockQueue:
    def __init__(self):
        # TODO: Use a dummy node to separate head and tail
        # This allows head_lock and tail_lock to be independent
        self.head = {"value": None, "next": None}  # dummy node
        self.tail = self.head
        # TODO: Create head_lock and tail_lock
        self.size = 0

    def enqueue(self, item):
        # TODO: Create new node, lock tail, append
        pass

    def dequeue(self):
        # TODO: Lock head, remove first real node
        pass

    def __len__(self):
        return self.size

# TODO: Test with 5 producer threads and 5 consumer threads
# Each producer enqueues 100 items
# Each consumer dequeues 100 items
# Verify no items are lost`,
      solutionCode: `import threading
import time
import random
from collections import deque

class TwoLockQueue:
    def __init__(self):
        # Dummy node separates head and tail operations
        dummy = {"value": None, "next": None}
        self.head = dummy
        self.tail = dummy
        self.head_lock = threading.Lock()
        self.tail_lock = threading.Lock()
        self.size = 0
        self.size_lock = threading.Lock()

    def enqueue(self, item):
        new_node = {"value": item, "next": None}
        with self.tail_lock:
            self.tail["next"] = new_node
            self.tail = new_node
        with self.size_lock:
            self.size += 1

    def dequeue(self):
        with self.head_lock:
            dummy = self.head
            new_head = dummy["next"]
            if new_head is None:
                return None  # queue is empty
            value = new_head["value"]
            self.head = new_head  # new_head becomes the new dummy
        with self.size_lock:
            self.size -= 1
        return value

    def __len__(self):
        with self.size_lock:
            return self.size

# Test with concurrent producers and consumers
q = TwoLockQueue()
produced = []
consumed = []
prod_lock = threading.Lock()
cons_lock = threading.Lock()

def producer(pid):
    for i in range(100):
        item = f"P{pid}-{i}"
        q.enqueue(item)
        with prod_lock:
            produced.append(item)
        time.sleep(random.uniform(0, 0.001))

def consumer(cid):
    local_consumed = []
    attempts = 0
    while len(local_consumed) < 100 and attempts < 5000:
        item = q.dequeue()
        if item is not None:
            local_consumed.append(item)
        else:
            time.sleep(0.001)
            attempts += 1
    with cons_lock:
        consumed.extend(local_consumed)

producers = [threading.Thread(target=producer, args=(i,)) for i in range(5)]
consumers = [threading.Thread(target=consumer, args=(i,)) for i in range(5)]

start = time.time()
for t in producers + consumers:
    t.start()
for t in producers + consumers:
    t.join()

print(f"Time: {time.time() - start:.3f}s")
print(f"Produced: \${len(produced)} items")
print(f"Consumed: \${len(consumed)} items")
print(f"Queue remaining: \${len(q)}")
print(f"All accounted for: \${len(produced) == len(consumed) + len(q)}")`,
    },
    {
      id: "concurrent-hash-map",
      slug: "concurrent-hash-map",
      title: "Concurrent Hash Map",
      content: `## Concurrent Hash Map

A **concurrent hash map** allows multiple threads to read and write key-value pairs safely. The key optimization is **striped locking** — using multiple locks, each protecting a subset of the data.

### The Problem with a Single Lock

\`\`\`
Single lock (coarse-grained):
  Thread A: put("key1") ──[LOCK]── insert ──[UNLOCK]──
  Thread B: put("key2") ──────────────────────────────[LOCK]── insert ──[UNLOCK]──
  Thread C: get("key3") ──────────────────────────────────────────────────[LOCK]── read ──

All operations are serialized even though they touch different keys!
\`\`\`

### Striped Locking

Divide the hash table into segments, each with its own lock:

\`\`\`
Segment 0 (Lock 0):  keys hashing to 0, 4, 8, ...
Segment 1 (Lock 1):  keys hashing to 1, 5, 9, ...
Segment 2 (Lock 2):  keys hashing to 2, 6, 10, ...
Segment 3 (Lock 3):  keys hashing to 3, 7, 11, ...

Thread A: put("apple")  → hash % 4 = 2 → Lock 2
Thread B: put("banana") → hash % 4 = 0 → Lock 0  ← runs in parallel!
Thread C: get("cherry") → hash % 4 = 3 → Lock 3  ← also in parallel!
\`\`\`

Operations on different segments run concurrently. Only operations on the **same segment** need to wait.

### Design

\`\`\`python
class ConcurrentHashMap:
    def __init__(self, num_segments=16):
        self.num_segments = num_segments
        self.segments = [[] for _ in range(num_segments)]  # list of (key, value) pairs
        self.locks = [threading.Lock() for _ in range(num_segments)]

    def _get_segment(self, key):
        return hash(key) % self.num_segments

    def put(self, key, value):
        seg = self._get_segment(key)
        with self.locks[seg]:
            # Update existing or insert new
            for i, (k, v) in enumerate(self.segments[seg]):
                if k == key:
                    self.segments[seg][i] = (key, value)
                    return
            self.segments[seg].append((key, value))

    def get(self, key):
        seg = self._get_segment(key)
        with self.locks[seg]:
            for k, v in self.segments[seg]:
                if k == key:
                    return v
            return None
\`\`\`

### Number of Segments

| Segments | Concurrency | Memory overhead |
|----------|-------------|-----------------|
| 1 | Same as single lock | Minimal |
| 16 | Good for most apps | Low |
| 256 | High-throughput servers | Moderate |
| Per-key | Maximum concurrency | High (one lock per key) |

**Rule of thumb**: Use 2x the expected number of concurrent threads as your segment count.

### Java's ConcurrentHashMap

Java's \`ConcurrentHashMap\` is the gold standard implementation:
- Uses striped locks with 16 segments by default
- Reads are lock-free (using volatile reads)
- Supports atomic operations: \`putIfAbsent\`, \`computeIfAbsent\`
- Size estimation is approximate (avoids locking all segments)

### Interview Tip

When asked to design a thread-safe hash map, start with the single-lock version (correct but slow), then optimize with striped locking. Discuss the trade-off between number of segments, memory, and concurrency.`,
      starterCode: `import threading
import time

# TODO: Implement a ConcurrentHashMap with striped locking
# Support: put(key, value), get(key), delete(key), size()

class ConcurrentHashMap:
    def __init__(self, num_segments=16):
        # TODO: Initialize segments and locks
        pass

    def _get_segment(self, key):
        # TODO: Return segment index for the key
        pass

    def put(self, key, value):
        # TODO: Insert or update key-value pair
        pass

    def get(self, key, default=None):
        # TODO: Return value for key, or default
        pass

    def delete(self, key):
        # TODO: Remove key if exists, return True/False
        pass

    def size(self):
        # TODO: Return total number of entries
        pass

# TODO: Test with concurrent reads and writes
# 5 writer threads, 5 reader threads`,
      solutionCode: `import threading
import time
import random

class ConcurrentHashMap:
    def __init__(self, num_segments=16):
        self.num_segments = num_segments
        self.segments = [[] for _ in range(num_segments)]
        self.locks = [threading.Lock() for _ in range(num_segments)]

    def _get_segment(self, key):
        return hash(key) % self.num_segments

    def put(self, key, value):
        seg = self._get_segment(key)
        with self.locks[seg]:
            for i, (k, v) in enumerate(self.segments[seg]):
                if k == key:
                    self.segments[seg][i] = (key, value)
                    return
            self.segments[seg].append((key, value))

    def get(self, key, default=None):
        seg = self._get_segment(key)
        with self.locks[seg]:
            for k, v in self.segments[seg]:
                if k == key:
                    return v
            return default

    def delete(self, key):
        seg = self._get_segment(key)
        with self.locks[seg]:
            for i, (k, v) in enumerate(self.segments[seg]):
                if k == key:
                    self.segments[seg].pop(i)
                    return True
            return False

    def size(self):
        total = 0
        for i in range(self.num_segments):
            with self.locks[i]:
                total += len(self.segments[i])
        return total

    def keys(self):
        all_keys = []
        for i in range(self.num_segments):
            with self.locks[i]:
                all_keys.extend(k for k, v in self.segments[i])
        return all_keys

# Test
cmap = ConcurrentHashMap(num_segments=8)
ops = {"puts": 0, "gets": 0, "deletes": 0}
ops_lock = threading.Lock()

def writer(wid):
    for i in range(200):
        key = f"key-{random.randint(0, 99)}"
        cmap.put(key, f"val-{wid}-{i}")
        with ops_lock:
            ops["puts"] += 1
        time.sleep(random.uniform(0, 0.001))

def reader(rid):
    for i in range(200):
        key = f"key-{random.randint(0, 99)}"
        val = cmap.get(key, "MISS")
        with ops_lock:
            ops["gets"] += 1
        time.sleep(random.uniform(0, 0.001))

def deleter(did):
    for i in range(50):
        key = f"key-{random.randint(0, 99)}"
        cmap.delete(key)
        with ops_lock:
            ops["deletes"] += 1
        time.sleep(random.uniform(0, 0.005))

writers = [threading.Thread(target=writer, args=(i,)) for i in range(5)]
readers = [threading.Thread(target=reader, args=(i,)) for i in range(5)]
deleters = [threading.Thread(target=deleter, args=(i,)) for i in range(2)]

start = time.time()
for t in writers + readers + deleters:
    t.start()
for t in writers + readers + deleters:
    t.join()

print(f"Time: {time.time() - start:.3f}s")
print(f"Operations — puts: \${ops['puts']}, gets: \${ops['gets']}, deletes: \${ops['deletes']}")
print(f"Final size: \${cmap.size()}")
print(f"Segments: \${cmap.num_segments}")`,
    },
    {
      id: "blocking-queue",
      slug: "blocking-queue",
      title: "Blocking Queue Implementation",
      content: `## Blocking Queue

A **blocking queue** is a thread-safe queue where:
- \`put()\` blocks if the queue is **full** (waits for space)
- \`get()\` blocks if the queue is **empty** (waits for items)

This is the core primitive behind producer-consumer systems, thread pools, and work queues.

### Blocking vs Non-Blocking

\`\`\`
Non-blocking queue:
  put() when full  → raises error or returns False
  get() when empty → raises error or returns None

Blocking queue:
  put() when full  → thread sleeps until space available
  get() when empty → thread sleeps until item available

  Producer           Queue (cap=2)          Consumer
  ────────           ─────────────          ────────
  put(A) ──────►     [A]
  put(B) ──────►     [A][B]
  put(C) ──────►     FULL → sleep                    get() → A
                 ──► [B][C]  ← woken                 get() → B
                     [C]                              get() → C
                     []                               get() → EMPTY → sleep
  put(D) ──────►     [D]  ────────────────────────► woken → D
\`\`\`

### Implementation with Condition Variables

\`\`\`python
class BlockingQueue:
    def __init__(self, capacity):
        self.queue = deque()
        self.capacity = capacity
        self.lock = threading.Lock()
        self.not_full = threading.Condition(self.lock)
        self.not_empty = threading.Condition(self.lock)

    def put(self, item, timeout=None):
        with self.not_full:
            while len(self.queue) >= self.capacity:
                self.not_full.wait(timeout)
            self.queue.append(item)
            self.not_empty.notify()

    def get(self, timeout=None):
        with self.not_empty:
            while len(self.queue) == 0:
                self.not_empty.wait(timeout)
            item = self.queue.popleft()
            self.not_full.notify()
            return item
\`\`\`

### Two Conditions vs One

Using **two conditions** (\`not_full\` and \`not_empty\`) is more efficient than one:

| Approach | Wake behavior |
|----------|--------------|
| One Condition + notify_all | Wakes ALL waiters (producers AND consumers) |
| Two Conditions | put() wakes only consumers; get() wakes only producers |

With separate conditions, we use \`notify()\` (wake one) instead of \`notify_all()\` (wake all), reducing unnecessary context switches.

### Timeout Support

Both \`put()\` and \`get()\` should support timeouts for production use:

\`\`\`python
def get(self, timeout=None):
    with self.not_empty:
        if not self.not_empty.wait_for(
            lambda: len(self.queue) > 0, timeout=timeout
        ):
            raise TimeoutError("Queue get timed out")
        return self.queue.popleft()
\`\`\`

### Poison Pill Pattern

To shut down consumers cleanly, producers send a special "poison pill" value. When a consumer gets the poison pill, it knows to stop:

\`\`\`python
POISON_PILL = None
# Producer: queue.put(POISON_PILL)
# Consumer: item = queue.get(); if item is POISON_PILL: return
\`\`\`

### Real-World Usage

- **Python's queue.Queue**: Uses this exact pattern internally
- **Java's ArrayBlockingQueue / LinkedBlockingQueue**: Standard library implementations
- **Go channels**: Blocking queues are the primary concurrency primitive in Go
- **Task queues**: Celery, RQ, and other job queues use blocking queues internally`,
      starterCode: `import threading
import time
from collections import deque

# TODO: Implement a BlockingQueue with:
# - put(item, timeout) — blocks if full
# - get(timeout) — blocks if empty
# - size() — current number of items
# Use TWO Condition variables for efficiency

class BlockingQueue:
    def __init__(self, capacity):
        self.capacity = capacity
        self.queue = deque()
        # TODO: Create lock and two condition variables

    def put(self, item, timeout=None):
        # TODO: Block while full, then add item
        pass

    def get(self, timeout=None):
        # TODO: Block while empty, then remove and return item
        pass

    def size(self):
        pass

# TODO: Test with 3 fast producers and 2 slow consumers
# Producers should eventually block when queue is full
# Use a small capacity (3) to see blocking behavior`,
      solutionCode: `import threading
import time
import random
from collections import deque

class BlockingQueue:
    def __init__(self, capacity):
        self.capacity = capacity
        self.queue = deque()
        self.lock = threading.Lock()
        self.not_full = threading.Condition(self.lock)
        self.not_empty = threading.Condition(self.lock)

    def put(self, item, timeout=None):
        with self.not_full:
            # Wait while queue is full
            if not self.not_full.wait_for(
                lambda: len(self.queue) < self.capacity,
                timeout=timeout
            ):
                raise TimeoutError("put() timed out — queue is full")
            self.queue.append(item)
            self.not_empty.notify()  # Wake ONE consumer

    def get(self, timeout=None):
        with self.not_empty:
            if not self.not_empty.wait_for(
                lambda: len(self.queue) > 0,
                timeout=timeout
            ):
                raise TimeoutError("get() timed out — queue is empty")
            item = self.queue.popleft()
            self.not_full.notify()   # Wake ONE producer
            return item

    def size(self):
        with self.lock:
            return len(self.queue)

# Test: fast producers, slow consumers, small queue
POISON_PILL = "STOP"
bq = BlockingQueue(capacity=3)
stats = {"produced": 0, "consumed": 0}
stats_lock = threading.Lock()
start_time = time.time()

def elapsed():
    return time.time() - start_time

def producer(pid, count=8):
    for i in range(count):
        item = f"P{pid}-{i}"
        bq.put(item)
        with stats_lock:
            stats["produced"] += 1
        print(f"[{elapsed():.2f}s] + Produced \${item} (queue: \${bq.size()})")
        time.sleep(random.uniform(0.01, 0.05))
    print(f"[{elapsed():.2f}s] Producer {pid} done")

def consumer(cid, count=12):
    for i in range(count):
        item = bq.get()
        with stats_lock:
            stats["consumed"] += 1
        print(f"[{elapsed():.2f}s] - Consumed \${item} (queue: \${bq.size()})")
        time.sleep(random.uniform(0.1, 0.2))  # Slow consumer!
    print(f"[{elapsed():.2f}s] Consumer {cid} done")

producers = [threading.Thread(target=producer, args=(i,)) for i in range(3)]
consumers = [threading.Thread(target=consumer, args=(i,)) for i in range(2)]

for t in producers + consumers:
    t.start()
for t in producers + consumers:
    t.join()

print(f"\\nProduced: \${stats['produced']}, Consumed: \${stats['consumed']}")
print(f"Queue remaining: \${bq.size()}")`,
    },
    {
      id: "lock-free-stack",
      slug: "lock-free-stack",
      title: "Lock-Free Stack",
      content: `## Lock-Free Stack

A **lock-free stack** uses Compare-And-Swap (CAS) instead of locks. It guarantees that at least one thread always makes progress, even if other threads are delayed or suspended.

### The Treiber Stack

The **Treiber Stack** (1986) is the classic lock-free stack algorithm. It uses a CAS operation on the head pointer:

\`\`\`
Push(item):
  loop:
    old_head = head
    new_node = Node(item, next=old_head)
    if CAS(head, old_head, new_node):   # atomic swap
      return                             # success
    # else head changed, retry

Pop():
  loop:
    old_head = head
    if old_head is None:
      return None                        # stack is empty
    new_head = old_head.next
    if CAS(head, old_head, new_head):   # atomic swap
      return old_head.value              # success
    # else head changed, retry
\`\`\`

### Visual Walkthrough

\`\`\`
Initial:  head → [C] → [B] → [A] → None

Push(D):
  1. Read head → [C]
  2. Create node: [D] → [C]
  3. CAS(head, [C], [D]) ← succeeds if head still points to [C]

After:    head → [D] → [C] → [B] → [A] → None

Pop():
  1. Read head → [D]
  2. Read head.next → [C]
  3. CAS(head, [D], [C]) ← succeeds if head still points to [D]
  Return: D

After:    head → [C] → [B] → [A] → None
\`\`\`

### CAS Retry in Action

\`\`\`
Thread A: Push(X)              Thread B: Push(Y)
──────────────────             ──────────────────
read head → [C]                read head → [C]
new: [X]→[C]                  new: [Y]→[C]
CAS(head, [C], [X]) ✓         CAS(head, [C], [Y]) ✗ (head is now [X])
                               read head → [X]  (retry)
                               new: [Y]→[X]
                               CAS(head, [X], [Y]) ✓

Result: head → [Y] → [X] → [C] → ...  (both pushes succeeded!)
\`\`\`

### Python Simulation

Since Python lacks hardware CAS, we simulate it with a lock. The important thing is the **algorithm pattern** — in languages like Java (\`AtomicReference.compareAndSet\`) or C++ (\`std::atomic\`), this would be truly lock-free.

### Lock-Free vs Wait-Free

| Property | Lock-Free | Wait-Free |
|----------|-----------|-----------|
| Guarantee | Some thread always progresses | Every thread progresses in bounded steps |
| CAS retries | Unbounded (but rare) | Bounded |
| Complexity | Moderate | Very high |
| Real-world | Treiber Stack, MS-Queue | Rare in practice |

### When to Use Lock-Free Structures

Lock-free structures are worth the complexity when:
1. **Extreme contention**: Many threads competing for the same structure
2. **Real-time requirements**: Cannot tolerate unbounded lock waits
3. **Priority inversion concerns**: High-priority thread must not wait for low-priority lock holder
4. **Crash tolerance**: If a thread dies while holding a lock, other threads are stuck forever; lock-free avoids this

For most applications, a simple mutex-based approach is simpler and fast enough.`,
      starterCode: `import threading
import time

# TODO: Implement a Lock-Free Stack using CAS (simulated)
# - push(item) using CAS retry loop
# - pop() using CAS retry loop
# - Track CAS attempts and failures for analysis

class Node:
    def __init__(self, value, next_node=None):
        self.value = value
        self.next = next_node

class LockFreeStack:
    def __init__(self):
        self.head = None
        # TODO: Add CAS simulation lock and stats

    def compare_and_swap_head(self, expected, new_value):
        # TODO: Atomically swap head if it matches expected
        pass

    def push(self, value):
        # TODO: CAS retry loop
        pass

    def pop(self):
        # TODO: CAS retry loop
        pass

# TODO: Test with 10 threads, each pushing 1000 items then popping 1000
# Verify total operations match`,
      solutionCode: `import threading
import time

class Node:
    def __init__(self, value, next_node=None):
        self.value = value
        self.next = next_node

class LockFreeStack:
    def __init__(self):
        self.head = None
        self._cas_lock = threading.Lock()  # Simulates hardware CAS
        self.cas_attempts = 0
        self.cas_failures = 0

    def compare_and_swap_head(self, expected, new_value):
        """Simulated atomic CAS on head pointer"""
        with self._cas_lock:
            self.cas_attempts += 1
            if self.head is expected:
                self.head = new_value
                return True
            self.cas_failures += 1
            return False

    def push(self, value):
        while True:
            old_head = self.head
            new_node = Node(value, old_head)
            if self.compare_and_swap_head(old_head, new_node):
                return  # Success

    def pop(self):
        while True:
            old_head = self.head
            if old_head is None:
                return None  # Stack empty
            new_head = old_head.next
            if self.compare_and_swap_head(old_head, new_head):
                return old_head.value  # Success

    def size(self):
        """Not lock-free — just for testing"""
        count = 0
        node = self.head
        while node:
            count += 1
            node = node.next
        return count

stack = LockFreeStack()
popped_items = []
popped_lock = threading.Lock()

def push_worker(tid):
    for i in range(1000):
        stack.push(f"T{tid}-{i}")

def pop_worker(tid):
    local_popped = []
    for i in range(1000):
        item = stack.pop()
        while item is None:
            time.sleep(0.0001)
            item = stack.pop()
        local_popped.append(item)
    with popped_lock:
        popped_items.extend(local_popped)

# Push phase
print("Pushing 10,000 items (10 threads x 1,000)...")
start = time.time()
pushers = [threading.Thread(target=push_worker, args=(i,)) for i in range(10)]
for t in pushers:
    t.start()
for t in pushers:
    t.join()
push_time = time.time() - start

print(f"Stack size after push: \${stack.size()}")
print(f"Push time: {push_time:.3f}s")
print(f"CAS attempts: \${stack.cas_attempts}, failures: \${stack.cas_failures}")

# Pop phase
print("\\nPopping 10,000 items (10 threads x 1,000)...")
start = time.time()
poppers = [threading.Thread(target=pop_worker, args=(i,)) for i in range(10)]
for t in poppers:
    t.start()
for t in poppers:
    t.join()
pop_time = time.time() - start

print(f"Stack size after pop: \${stack.size()}")
print(f"Items popped: \${len(popped_items)}")
print(f"Pop time: {pop_time:.3f}s")
print(f"Total CAS attempts: \${stack.cas_attempts}, failures: \${stack.cas_failures}")
print(f"Retry rate: \${stack.cas_failures / max(1, stack.cas_attempts) * 100:.1f}%")`,
    },
    {
      id: "thread-pool",
      slug: "thread-pool",
      title: "Thread Pool Implementation",
      content: `## Thread Pool

A **thread pool** maintains a set of reusable worker threads that execute submitted tasks. Instead of creating a new thread for each task (expensive), tasks are queued and executed by pre-created workers.

### Why Thread Pools?

\`\`\`
Without pool (create/destroy per task):
  Task 1: [create thread]──work──[destroy thread]
  Task 2:                  [create]──work──[destroy]
  Task 3:                            [create]──work──[destroy]

With pool (reuse workers):
  Worker 1: ──task1──task3──task5──task7──  (reused!)
  Worker 2: ──task2──task4──task6──task8──  (reused!)
\`\`\`

**Benefits**:
1. No thread creation overhead per task
2. Bounded concurrency — never spawn more threads than the pool size
3. Task queuing — excess tasks wait instead of overwhelming the system
4. Graceful shutdown — drain the queue, then stop workers

### Architecture

\`\`\`
                    ┌─────────────┐
submit(task) ───►  │  Task Queue  │
                    │  (Blocking)  │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         ┌────────┐  ┌────────┐  ┌────────┐
         │Worker 1│  │Worker 2│  │Worker 3│
         └────────┘  └────────┘  └────────┘
              │            │            │
              ▼            ▼            ▼
          execute       execute     execute
\`\`\`

### Core Components

1. **Task queue**: A blocking queue that holds pending tasks
2. **Worker threads**: Loop forever: dequeue a task, execute it, repeat
3. **Submit method**: Add a task (callable) to the queue
4. **Shutdown method**: Stop accepting tasks, drain queue, stop workers

### Worker Thread Logic

\`\`\`python
def worker(self):
    while True:
        task = self.task_queue.get()    # blocks if empty
        if task is SHUTDOWN_SENTINEL:
            break
        try:
            task()
        except Exception as e:
            print(f"Task failed: {e}")
\`\`\`

### Shutdown Strategies

**Graceful**: Stop accepting new tasks. Wait for all queued tasks to complete. Then stop workers.

**Immediate**: Stop accepting tasks. Discard pending tasks. Interrupt running tasks.

\`\`\`python
def shutdown(self, wait=True):
    # Send one sentinel per worker
    for _ in self.workers:
        self.task_queue.put(SHUTDOWN_SENTINEL)
    if wait:
        for w in self.workers:
            w.join()  # wait for all workers to finish
\`\`\`

### Python's Built-In Thread Pool

Python provides \`concurrent.futures.ThreadPoolExecutor\`:

\`\`\`python
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=4) as pool:
    future = pool.submit(my_function, arg1, arg2)
    result = future.result(timeout=10)

    # Map over a list
    results = list(pool.map(process, items))
\`\`\`

### Interview Considerations

Thread pool design is a common system design interview topic. Key points:
- **Pool size**: CPU-bound → num_cores. I/O-bound → num_cores * ratio (ratio depends on I/O wait time)
- **Queue type**: Bounded (back-pressure) vs unbounded (risk of OOM)
- **Rejection policy**: When queue is full — block, discard, throw error, or run in caller's thread`,
      starterCode: `import threading
import time
from collections import deque

# TODO: Implement a ThreadPool from scratch
# - __init__(num_workers): create worker threads
# - submit(fn, *args): add task to queue
# - shutdown(wait=True): gracefully stop all workers

SHUTDOWN = object()  # sentinel value

class ThreadPool:
    def __init__(self, num_workers):
        # TODO: Create task queue and worker threads
        pass

    def submit(self, fn, *args):
        # TODO: Add task to queue
        pass

    def shutdown(self, wait=True):
        # TODO: Send shutdown sentinels, optionally wait
        pass

# TODO: Test by submitting 20 tasks to a pool of 4 workers
# Each task simulates 0.5s of work
# Measure total time (should be ~2.5s, not 10s)`,
      solutionCode: `import threading
import time
import random
from collections import deque

SHUTDOWN = object()

class ThreadPool:
    def __init__(self, num_workers):
        self.task_queue = deque()
        self.condition = threading.Condition()
        self.workers = []
        self.active_tasks = 0
        self.active_lock = threading.Lock()

        for i in range(num_workers):
            t = threading.Thread(target=self._worker, args=(i,), daemon=True)
            t.start()
            self.workers.append(t)
        print(f"ThreadPool started with \${num_workers} workers")

    def _worker(self, wid):
        while True:
            with self.condition:
                while not self.task_queue:
                    self.condition.wait()
                task = self.task_queue.popleft()

            if task is SHUTDOWN:
                return

            fn, args = task
            with self.active_lock:
                self.active_tasks += 1
            try:
                fn(*args)
            except Exception as e:
                print(f"[Worker {wid}] Task error: \${e}")
            finally:
                with self.active_lock:
                    self.active_tasks -= 1

    def submit(self, fn, *args):
        with self.condition:
            self.task_queue.append((fn, args))
            self.condition.notify()

    def shutdown(self, wait=True):
        # Send one shutdown sentinel per worker
        with self.condition:
            for _ in self.workers:
                self.task_queue.append(SHUTDOWN)
            self.condition.notify_all()
        if wait:
            for w in self.workers:
                w.join()
        print("ThreadPool shut down")

# Test
results = []
results_lock = threading.Lock()

def task(task_id):
    time.sleep(0.5)  # simulate work
    with results_lock:
        results.append(task_id)
    print(f"  Task {task_id} completed")

pool = ThreadPool(num_workers=4)
start = time.time()

for i in range(20):
    pool.submit(task, i)

pool.shutdown(wait=True)
total = time.time() - start

print(f"\\nCompleted \${len(results)} tasks in {total:.2f}s")
print(f"With 4 workers and 0.5s/task: expected ~\${20 * 0.5 / 4:.1f}s")
print(f"Speedup vs sequential: \${20 * 0.5 / total:.1f}x")`,
    },
  ],
};
