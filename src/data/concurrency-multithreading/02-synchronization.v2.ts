import { Module } from "../types";

export const synchronizationModule: Module = {
  id: "concurrency-sync",
  title: "Synchronization Primitives",
  description: "Master the building blocks of thread safety: mutexes, semaphores, monitors, read-write locks, and atomic operations.",
  lessons: [
    {
      id: "mutex-and-locks",
      slug: "mutex-and-locks",
      title: "Mutex & Locks",
      content: `## Mutex and Locks

A **mutex** (mutual exclusion) is the most fundamental synchronization primitive. It ensures that only one thread can execute a critical section at a time.

### How a Mutex Works

\`\`\`
Thread A               Lock State              Thread B
────────               ──────────              ────────
acquire()  ──────►    LOCKED (by A)
  work...                                      acquire() → BLOCKED
  work...                                         waiting...
release()  ──────►    UNLOCKED                     waiting...
                      LOCKED (by B)  ◄──────   acquired!
                                                 work...
                                               release() → UNLOCKED
\`\`\`

### Python's threading.Lock

\`threading.Lock\` is a basic mutex. It has two states: locked and unlocked.

\`\`\`python
lock = threading.Lock()

# Method 1: Manual acquire/release
lock.acquire()
try:
    # critical section
    shared_data += 1
finally:
    lock.release()  # ALWAYS release in finally!

# Method 2: Context manager (preferred)
with lock:
    # critical section — auto-released on exit
    shared_data += 1
\`\`\`

### Reentrant Lock (RLock)

A regular Lock will **deadlock** if the same thread tries to acquire it twice. An \`RLock\` (reentrant lock) allows the same thread to acquire it multiple times — it tracks an acquisition count.

\`\`\`python
lock = threading.RLock()

def outer():
    with lock:           # acquire count = 1
        inner()          # same thread acquires again — OK!

def inner():
    with lock:           # acquire count = 2
        do_work()
    # acquire count = 1 (auto-release from 'with')
# acquire count = 0 → fully released
\`\`\`

**When to use RLock**: When a locked function calls another locked function, or in recursive algorithms with shared state.

### Lock Granularity

| Granularity | Pros | Cons |
|-------------|------|------|
| **Coarse** (one lock for everything) | Simple, no deadlocks | Poor concurrency — threads wait a lot |
| **Fine** (lock per data item) | High concurrency | Complex, risk of deadlocks |
| **Medium** (lock per subsystem) | Balance of both | Still requires careful design |

**Interview rule of thumb**: Start coarse, optimize to finer granularity only when you can prove contention is the bottleneck.

### Common Mistakes

1. **Forgetting to release**: Always use \`with\` or \`try/finally\`
2. **Holding locks during I/O**: Locks should protect the smallest critical section possible
3. **Lock ordering violations**: When acquiring multiple locks, always use the same order
4. **Over-locking**: Locking code that doesn't access shared state wastes performance`,
      starterCode: `import threading
import time

# TODO: Implement a thread-safe counter using Lock
# Then implement a recursive function using RLock

class ThreadSafeCounter:
    def __init__(self):
        self.value = 0
        # TODO: Add a Lock

    def increment(self):
        # TODO: Safely increment
        pass

    def get(self):
        # TODO: Safely read
        pass

# TODO: Test with 5 threads, each incrementing 10000 times
# Verify final count is 50000

# BONUS: Show RLock usage with a recursive factorial
# that tracks call depth in a shared variable`,
      solutionCode: `import threading
import time

class ThreadSafeCounter:
    def __init__(self):
        self.value = 0
        self.lock = threading.Lock()

    def increment(self):
        with self.lock:
            self.value += 1

    def get(self):
        with self.lock:
            return self.value

# Test with 5 threads
counter = ThreadSafeCounter()

def worker():
    for _ in range(10000):
        counter.increment()

threads = [threading.Thread(target=worker) for _ in range(5)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"Expected: 50000")
print(f"Actual:   \${counter.get()}")
assert counter.get() == 50000, "Race condition detected!"
print("Lock works correctly!\\n")

# RLock demo: recursive factorial with shared depth tracking
print("=== RLock Recursive Demo ===")
rlock = threading.RLock()
max_depth = {"value": 0}

def factorial(n, depth=0):
    with rlock:  # Same thread can re-acquire
        if depth > max_depth["value"]:
            max_depth["value"] = depth
        if n <= 1:
            return 1
        return n * factorial(n - 1, depth + 1)

result = factorial(10)
print(f"factorial(10) = \${result}")
print(f"Max recursion depth tracked: \${max_depth['value']}")
print("RLock allowed same-thread reentrant locking!")`,
    },
    {
      id: "semaphores",
      slug: "semaphores",
      title: "Semaphores",
      content: `## Semaphores

A **semaphore** is a synchronization primitive that maintains a counter. Unlike a mutex (which allows exactly one thread), a semaphore allows up to **N** threads to access a resource simultaneously.

### How a Semaphore Works

\`\`\`
Semaphore(3) — allows 3 concurrent threads

Thread A: acquire() → counter=2 → enters
Thread B: acquire() → counter=1 → enters
Thread C: acquire() → counter=0 → enters
Thread D: acquire() → counter=0 → BLOCKED (waits)

Thread A: release() → counter=1
Thread D: acquired! → counter=0 → enters
\`\`\`

### Types of Semaphores

**Counting Semaphore**: Allows N concurrent accesses. Used to limit concurrency (e.g., connection pool of 10 connections).

**Binary Semaphore**: A counting semaphore with N=1. Behaves like a mutex but with a key difference — any thread can release it, not just the thread that acquired it.

**BoundedSemaphore**: Like a counting semaphore but raises an error if you release more times than you acquire. Catches programming bugs.

### Semaphore vs Mutex

| Feature | Mutex (Lock) | Semaphore |
|---------|-------------|-----------|
| Max threads | 1 | N (configurable) |
| Ownership | Only holder can release | Any thread can release |
| Use case | Protect critical section | Limit concurrency |
| Python | threading.Lock() | threading.Semaphore(N) |

### Common Use Cases

1. **Connection pooling**: Limit database connections to 10
2. **Rate limiting**: Allow max 5 API calls at a time
3. **Resource pooling**: Limit access to a set of printers/devices
4. **Producer-consumer signaling**: Signal between threads (binary semaphore)

### Python Semaphore API

\`\`\`python
sem = threading.Semaphore(3)     # Allow 3 concurrent threads
sem = threading.BoundedSemaphore(3)  # Same, but catches over-release

sem.acquire()    # Decrement counter (blocks if 0)
sem.release()    # Increment counter

# Context manager
with sem:
    # At most 3 threads here simultaneously
    do_work()
\`\`\`

### The Signaling Pattern

A semaphore initialized to 0 can be used for **signaling** between threads — one thread waits, another signals:

\`\`\`
event = threading.Semaphore(0)

Thread A: event.acquire()  # blocks (counter is 0)

Thread B: event.release()  # counter → 1, Thread A unblocks
\`\`\`

This is how one thread can tell another "the data is ready."

### Interview Tip

When an interviewer asks you to "limit concurrency to N threads," reach for a semaphore immediately. It's the most direct solution and shows you know your primitives.`,
      starterCode: `import threading
import time

# TODO: Simulate a connection pool using a Semaphore
# - Max 3 simultaneous connections allowed
# - 10 worker threads each need a connection
# - Each worker holds the connection for 1 second
# - Print when each worker acquires/releases

MAX_CONNECTIONS = 3

# TODO: Create a BoundedSemaphore with MAX_CONNECTIONS

def worker(worker_id):
    # TODO: Acquire the semaphore
    # Print "Worker {id} connected" with timestamp
    # Sleep 1 second (simulating work)
    # Release the semaphore
    # Print "Worker {id} disconnected"
    pass

# TODO: Create and start 10 threads
# TODO: Join all threads
# TODO: Print total time taken`,
      solutionCode: `import threading
import time

MAX_CONNECTIONS = 3
pool = threading.BoundedSemaphore(MAX_CONNECTIONS)
active_count = {"value": 0}
count_lock = threading.Lock()
start_time = time.time()

def elapsed():
    return time.time() - start_time

def worker(worker_id):
    print(f"[{elapsed():.1f}s] Worker {worker_id} waiting for connection...")
    with pool:
        with count_lock:
            active_count["value"] += 1
            current = active_count["value"]
        print(f"[{elapsed():.1f}s] Worker {worker_id} CONNECTED "
              f"(active: \${current}/\${MAX_CONNECTIONS})")
        time.sleep(1)  # Simulate database work
        with count_lock:
            active_count["value"] -= 1
    print(f"[{elapsed():.1f}s] Worker {worker_id} disconnected")

threads = [threading.Thread(target=worker, args=(i,)) for i in range(10)]
for t in threads:
    t.start()
for t in threads:
    t.join()

total = time.time() - start_time
print(f"\\nAll workers done in {total:.1f}s")
print(f"With \${MAX_CONNECTIONS} max connections, 10 workers each taking 1s:")
print(f"Expected ~{10 / MAX_CONNECTIONS:.0f}s, actual {total:.1f}s")`,
    },
    {
      id: "monitors-condition-variables",
      slug: "monitors-condition-variables",
      title: "Monitors & Condition Variables",
      content: `## Monitors and Condition Variables

A **monitor** is a higher-level synchronization construct that combines a mutex with one or more **condition variables**. It allows threads to wait for specific conditions while automatically managing lock acquisition.

### The Problem Monitors Solve

Sometimes a thread needs to wait until a certain condition is true (e.g., "buffer is not empty"). Busy-waiting wastes CPU:

\`\`\`python
# BAD: Busy waiting (spin lock)
while buffer_is_empty():
    pass  # burns CPU cycles checking over and over
\`\`\`

### Condition Variables

A **condition variable** lets a thread efficiently wait for a condition to become true. It works with a lock:

\`\`\`
Thread A (Consumer):               Thread B (Producer):
────────────────────               ────────────────────
acquire lock
while buffer_empty:
    wait(condition)  ──► releases lock, sleeps
                                   acquire lock
                                   add item to buffer
                                   notify(condition)  ──► wakes Thread A
                                   release lock
woken up, re-acquires lock
consume item
release lock
\`\`\`

### Key Operations

| Method | Description |
|--------|-------------|
| \`wait()\` | Release the lock, sleep until notified, re-acquire the lock |
| \`notify()\` | Wake up ONE waiting thread |
| \`notify_all()\` | Wake up ALL waiting threads |

### Python's Condition

\`\`\`python
condition = threading.Condition()
buffer = []

# Consumer
with condition:
    while not buffer:           # ALWAYS use 'while', not 'if'
        condition.wait()        # releases lock, sleeps, re-acquires on wake
    item = buffer.pop(0)

# Producer
with condition:
    buffer.append(item)
    condition.notify()          # wake one consumer
\`\`\`

### Why \`while\` and Not \`if\`?

**Spurious wakeups** — a thread can wake up from \`wait()\` even without a \`notify()\`. The POSIX standard allows this for performance reasons. Always re-check the condition:

\`\`\`python
# WRONG — may proceed on spurious wakeup
if not buffer:
    condition.wait()

# RIGHT — re-checks condition after every wakeup
while not buffer:
    condition.wait()
\`\`\`

### Event Object

Python's \`threading.Event\` is a simplified condition variable for "flag" scenarios:

\`\`\`python
event = threading.Event()

# Waiting thread
event.wait()          # blocks until flag is set

# Signaling thread
event.set()           # sets flag, unblocks all waiters
event.clear()         # resets flag
event.is_set()        # check without blocking
\`\`\`

**Event vs Condition**: Use Event for simple "go/no-go" signals. Use Condition when you need to check complex conditions or coordinate multiple producers/consumers.

### The Monitor Pattern

In object-oriented design, a monitor encapsulates shared state, a lock, and condition variables into a single class:

\`\`\`python
class BoundedBuffer:
    def __init__(self, capacity):
        self.buffer = []
        self.capacity = capacity
        self.condition = threading.Condition()

    def put(self, item):
        with self.condition:
            while len(self.buffer) >= self.capacity:
                self.condition.wait()     # wait until not full
            self.buffer.append(item)
            self.condition.notify_all()   # signal consumers

    def get(self):
        with self.condition:
            while not self.buffer:
                self.condition.wait()     # wait until not empty
            item = self.buffer.pop(0)
            self.condition.notify_all()   # signal producers
            return item
\`\`\``,
      starterCode: `import threading
import time
import random

# TODO: Implement a BoundedBuffer using Condition variables
# - Buffer has a max capacity
# - put() blocks if buffer is full
# - get() blocks if buffer is empty
# - Use notify_all() to wake waiting threads

class BoundedBuffer:
    def __init__(self, capacity):
        self.capacity = capacity
        self.buffer = []
        # TODO: Create a Condition

    def put(self, item):
        # TODO: Wait while full, then add item
        pass

    def get(self):
        # TODO: Wait while empty, then remove and return item
        pass

# TODO: Create 3 producer threads and 3 consumer threads
# Producers add 5 items each, consumers take 5 items each
# Use a BoundedBuffer with capacity 3`,
      solutionCode: `import threading
import time
import random

class BoundedBuffer:
    def __init__(self, capacity):
        self.capacity = capacity
        self.buffer = []
        self.condition = threading.Condition()

    def put(self, item):
        with self.condition:
            while len(self.buffer) >= self.capacity:
                self.condition.wait()
            self.buffer.append(item)
            print(f"  Produced: \${item} | Buffer: \${list(self.buffer)}")
            self.condition.notify_all()

    def get(self):
        with self.condition:
            while not self.buffer:
                self.condition.wait()
            item = self.buffer.pop(0)
            print(f"  Consumed: \${item} | Buffer: \${list(self.buffer)}")
            self.condition.notify_all()
            return item

buffer = BoundedBuffer(capacity=3)

def producer(pid):
    for i in range(5):
        item = f"P{pid}-{i}"
        buffer.put(item)
        time.sleep(random.uniform(0.05, 0.2))

def consumer(cid):
    for i in range(5):
        item = buffer.get()
        time.sleep(random.uniform(0.05, 0.3))

# 3 producers x 5 items = 15 produced
# 3 consumers x 5 items = 15 consumed
producers = [threading.Thread(target=producer, args=(i,)) for i in range(3)]
consumers = [threading.Thread(target=consumer, args=(i,)) for i in range(3)]

print("Starting producers and consumers...")
for t in producers + consumers:
    t.start()
for t in producers + consumers:
    t.join()
print("\\nAll done! Buffer should be empty:", buffer.buffer)`,
    },
    {
      id: "read-write-locks",
      slug: "read-write-locks",
      title: "Read-Write Locks",
      content: `## Read-Write Locks

A **read-write lock** (RWLock) allows multiple threads to read simultaneously, but only one thread to write at a time. This is optimal when reads vastly outnumber writes.

### Why Not Just a Mutex?

A mutex blocks all threads — even readers who could safely run concurrently:

\`\`\`
Mutex (unnecessary serialization):
  Reader A: ──[LOCK]──read──[UNLOCK]──
  Reader B: ──────────────────────────[LOCK]──read──[UNLOCK]──
  Reader C: ──────────────────────────────────────────────────[LOCK]──read──

RWLock (readers run in parallel):
  Reader A: ──[RLOCK]──read──[UNLOCK]──
  Reader B: ──[RLOCK]──read──[UNLOCK]──  (concurrent with A!)
  Reader C: ──[RLOCK]──read──[UNLOCK]──  (concurrent with A and B!)
  Writer:   ────────────────────────────[WLOCK]──write──[UNLOCK]──
\`\`\`

### Rules

1. **Multiple readers** can hold the read lock simultaneously
2. **Only one writer** can hold the write lock, and no readers
3. **Writer waits** for all readers to release before acquiring write lock
4. **Readers wait** if a writer holds the lock

### Implementation Strategy

Python's \`threading\` module doesn't include a built-in RWLock, but we can build one using a Condition variable:

\`\`\`
State variables:
  - readers: int (number of active readers)
  - writer: bool (is a writer active?)
  - condition: Condition (for waiting)

read_acquire():
  wait while writer is True
  readers += 1

read_release():
  readers -= 1
  if readers == 0: notify_all()

write_acquire():
  wait while writer is True OR readers > 0
  writer = True

write_release():
  writer = False
  notify_all()
\`\`\`

### Reader vs Writer Priority

A subtle design choice with big performance implications:

**Reader-preference**: New readers can always join if no writer is active. Risk: writer starvation if readers keep arriving.

**Writer-preference**: Once a writer is waiting, no new readers can start. Risk: reader starvation during heavy writes.

**Fair**: Requests are served in FIFO order regardless of type.

### When to Use RWLock

| Scenario | Best Lock |
|----------|-----------|
| Mostly reads, rare writes | RWLock |
| Equal reads and writes | Mutex (simpler) |
| Very short critical sections | Mutex (RWLock overhead > gain) |
| Configuration/cache reads | RWLock |

### Interview Application

RWLocks commonly appear in questions about:
- **Caching layers** — many threads read the cache, occasional writes on miss
- **Configuration systems** — read config frequently, update rarely
- **Database systems** — SELECT vs UPDATE locking
- **Concurrent hash maps** — partition-level RWLocks for better throughput`,
      starterCode: `import threading
import time

# TODO: Implement a ReadWriteLock from scratch
# Then use it to protect a shared configuration dictionary

class ReadWriteLock:
    def __init__(self):
        # TODO: Initialize readers count, writer flag, and condition
        pass

    def acquire_read(self):
        # TODO: Wait while a writer is active, then increment readers
        pass

    def release_read(self):
        # TODO: Decrement readers, notify if last reader
        pass

    def acquire_write(self):
        # TODO: Wait while any readers or writers active, set writer flag
        pass

    def release_write(self):
        # TODO: Clear writer flag, notify all
        pass

# TODO: Create a shared config dict protected by RWLock
# Create 5 reader threads and 2 writer threads
# Readers read config 10 times each
# Writers update config 3 times each`,
      solutionCode: `import threading
import time
import random

class ReadWriteLock:
    def __init__(self):
        self.readers = 0
        self.writer = False
        self.condition = threading.Condition()

    def acquire_read(self):
        with self.condition:
            while self.writer:
                self.condition.wait()
            self.readers += 1

    def release_read(self):
        with self.condition:
            self.readers -= 1
            if self.readers == 0:
                self.condition.notify_all()

    def acquire_write(self):
        with self.condition:
            while self.writer or self.readers > 0:
                self.condition.wait()
            self.writer = True

    def release_write(self):
        with self.condition:
            self.writer = False
            self.condition.notify_all()

# Shared configuration
config = {"max_retries": 3, "timeout": 30, "debug": False}
rwlock = ReadWriteLock()
stats = {"reads": 0, "writes": 0}
stats_lock = threading.Lock()

def reader(rid):
    for _ in range(10):
        rwlock.acquire_read()
        try:
            snapshot = dict(config)
            with stats_lock:
                stats["reads"] += 1
        finally:
            rwlock.release_read()
        time.sleep(random.uniform(0.01, 0.05))

def writer(wid):
    for i in range(3):
        rwlock.acquire_write()
        try:
            config["max_retries"] = random.randint(1, 10)
            config["timeout"] = random.randint(10, 60)
            with stats_lock:
                stats["writes"] += 1
            print(f"[Writer {wid}] Updated config: \${dict(config)}")
        finally:
            rwlock.release_write()
        time.sleep(random.uniform(0.1, 0.3))

readers = [threading.Thread(target=reader, args=(i,)) for i in range(5)]
writers = [threading.Thread(target=writer, args=(i,)) for i in range(2)]

start = time.time()
for t in readers + writers:
    t.start()
for t in readers + writers:
    t.join()

print(f"\\nCompleted in {time.time() - start:.2f}s")
print(f"Total reads: \${stats['reads']}, Total writes: \${stats['writes']}")
print(f"Final config: \${config}")`,
    },
    {
      id: "atomic-operations-cas",
      slug: "atomic-operations-cas",
      title: "Atomic Operations & CAS",
      content: `## Atomic Operations and Compare-And-Swap

An **atomic operation** is an operation that completes in a single step from the perspective of other threads — no other thread can observe it in a half-completed state.

### Why Atomicity Matters

The problem with \`counter += 1\` is that it's actually three operations:
1. Read counter value
2. Add 1
3. Write new value

If we could do all three as a **single atomic step**, no race condition is possible.

### Compare-And-Swap (CAS)

CAS is the fundamental building block of lock-free programming. It atomically:
1. Reads the current value
2. Compares it to an expected value
3. If equal, writes a new value
4. Returns whether the swap succeeded

\`\`\`
CAS(location, expected, new_value):
    atomically:
        if *location == expected:
            *location = new_value
            return True
        else:
            return False  # someone else changed it
\`\`\`

### CAS Retry Loop

The common pattern: keep trying until CAS succeeds:

\`\`\`
def atomic_increment(counter):
    while True:
        old = counter.value            # read current
        new = old + 1                  # compute new
        if CAS(counter, old, new):     # try to swap
            return new                 # success!
        # else: another thread changed it, retry
\`\`\`

### Lock-Free vs Lock-Based

| Property | Lock-Based | Lock-Free (CAS) |
|----------|-----------|-----------------|
| Deadlock risk | Yes | No |
| Thread blocking | Yes (mutex) | No (retry loop) |
| Performance under contention | Degrades (threads sleep/wake) | Degrades (more retries) |
| Complexity | Lower | Higher |
| Priority inversion | Possible | Impossible |

### Python's Atomic Operations

Python's GIL makes some operations effectively atomic at the bytecode level, but this is an **implementation detail** you should never rely on. Instead, use proper synchronization.

For true atomic-like behavior in Python, use:
- \`threading.Lock\` — for general critical sections
- \`queue.Queue\` — already thread-safe internally
- \`multiprocessing.Value\` — shared memory with lock parameter

### The ABA Problem

A subtle CAS pitfall:
\`\`\`
Thread A reads value = A
Thread B changes value to B, then back to A
Thread A's CAS succeeds (value is still A)
But the state may have changed meaningfully!
\`\`\`

**Solution**: Use a version counter alongside the value. CAS checks both value AND version.

### Lock-Free Data Structures

CAS enables building data structures without locks:
- **Lock-free stack**: CAS on the head pointer
- **Lock-free queue**: CAS on head and tail pointers
- **Lock-free counter**: CAS retry loop

These are used in high-performance systems (databases, game engines, OS kernels) where lock contention is unacceptable.

### Interview Perspective

Interviewers rarely ask you to implement CAS (it's a hardware instruction). Instead, they test whether you understand:
1. What "atomic" means and why \`x += 1\` isn't atomic
2. The CAS concept and retry loop pattern
3. Trade-offs between lock-free and lock-based approaches
4. When lock-free is worth the complexity (answer: rarely, only at extreme scale)`,
      starterCode: `import threading

# TODO: Implement an AtomicCounter using CAS-style logic
# Since Python doesn't have hardware CAS, simulate it with a lock
# but expose a CAS-like interface

class AtomicCounter:
    def __init__(self, initial=0):
        self.value = initial
        # TODO: Add synchronization

    def compare_and_swap(self, expected, new_value):
        """Atomically: if value == expected, set to new_value and return True"""
        # TODO: Implement CAS
        pass

    def increment(self):
        """Increment using CAS retry loop"""
        # TODO: Keep trying CAS until it succeeds
        pass

    def get(self):
        # TODO: Return current value safely
        pass

# TODO: Test with 10 threads incrementing 10000 times each
# Verify result is exactly 100000`,
      solutionCode: `import threading

class AtomicCounter:
    def __init__(self, initial=0):
        self.value = initial
        self._lock = threading.Lock()
        self.cas_attempts = 0
        self.cas_failures = 0

    def compare_and_swap(self, expected, new_value):
        """Atomically: if value == expected, set to new_value and return True"""
        with self._lock:
            self.cas_attempts += 1
            if self.value == expected:
                self.value = new_value
                return True
            self.cas_failures += 1
            return False

    def increment(self):
        """Increment using CAS retry loop — no explicit lock from caller's view"""
        while True:
            old = self.value
            if self.compare_and_swap(old, old + 1):
                return old + 1
            # CAS failed: another thread changed the value, retry

    def decrement(self):
        """Decrement using CAS retry loop"""
        while True:
            old = self.value
            if self.compare_and_swap(old, old - 1):
                return old - 1

    def get(self):
        with self._lock:
            return self.value

# Test with 10 threads x 10000 increments
counter = AtomicCounter(0)

def worker():
    for _ in range(10000):
        counter.increment()

threads = [threading.Thread(target=worker) for _ in range(10)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"Expected: 100000")
print(f"Actual:   \${counter.get()}")
print(f"CAS attempts: \${counter.cas_attempts}")
print(f"CAS failures: \${counter.cas_failures}")
print(f"Retry rate: \${counter.cas_failures / counter.cas_attempts * 100:.1f}%")
assert counter.get() == 100000, "Incorrect count!"`,
    },
  ],
};
