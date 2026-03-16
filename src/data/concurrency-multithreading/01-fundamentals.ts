import { Module } from "../types";

export const fundamentalsModule: Module = {
  id: "concurrency-fundamentals",
  title: "Concurrency Fundamentals",
  description: "Understand the core concepts of concurrency: threads, processes, coroutines, and the dangers of shared state.",
  lessons: [
    {
      id: "intro-to-concurrency",
      slug: "intro-to-concurrency",
      title: "Introduction to Concurrency",
      content: `## What Is Concurrency?

Concurrency is the ability of a program to manage multiple tasks that can overlap in time. It does **not** necessarily mean tasks run at the exact same instant — that's **parallelism**. Concurrency is about **structure**; parallelism is about **execution**.

### Concurrency vs Parallelism

\`\`\`
Concurrency (single core — interleaved):
  Thread A: ──██──────██──────██──
  Thread B: ──────██──────██──────

Parallelism (multi-core — simultaneous):
  Core 1:   ██████████████████████
  Core 2:   ██████████████████████
\`\`\`

A concurrent program can run on a single core by **time-slicing** — the OS rapidly switches between tasks so they appear simultaneous. True parallelism requires multiple CPU cores executing instructions at the same physical time.

### Why Concurrency Matters

1. **Responsiveness** — A GUI application must respond to user clicks while performing background work. Without concurrency, the UI freezes during computation.
2. **Throughput** — A web server must handle thousands of requests. Concurrency lets it process many requests without waiting for each to finish sequentially.
3. **Resource utilization** — While one thread waits for disk I/O, another can use the CPU. Concurrency keeps hardware busy.

### The Fundamental Challenge

When multiple threads share data, the order of reads and writes becomes unpredictable:

\`\`\`
Thread A reads  counter = 0
Thread B reads  counter = 0
Thread A writes counter = 1
Thread B writes counter = 1   # Lost update! Should be 2
\`\`\`

This is a **race condition** — the result depends on the unpredictable timing of thread execution. The entire field of concurrency revolves around solving this problem safely and efficiently.

### Concurrency Models

| Model | Description | Example |
|-------|-------------|---------|
| Shared Memory | Threads share heap, communicate via variables | Python threading |
| Message Passing | Processes send messages, no shared state | Go channels, Erlang |
| Actor Model | Isolated actors communicate via async messages | Akka, Elixir |
| Coroutines | Cooperative multitasking within a single thread | Python asyncio |

In this course, we focus primarily on **shared memory concurrency** using Python's threading and multiprocessing modules, as this is what interviews test most frequently.

### Key Terminology

- **Thread**: Lightweight unit of execution within a process; shares memory with other threads
- **Process**: Independent program with its own memory space
- **Context Switch**: The OS saving one thread's state and loading another's
- **Critical Section**: Code that accesses shared resources and must not run concurrently
- **Mutual Exclusion (Mutex)**: Ensuring only one thread enters a critical section at a time`,
      starterCode: `import threading
import time

# TODO: Create a shared counter variable
# TODO: Create a function that increments the counter 100000 times
# TODO: Create two threads that both run the increment function
# TODO: Start both threads and wait for them to finish
# TODO: Print the final counter value
# Question: Is the result always 200000? Why or why not?

counter = 0

def increment():
    # TODO: Increment counter 100000 times
    pass

# TODO: Create and start two threads
# TODO: Join both threads
# TODO: Print result
print(f"Expected: 200000")`,
      solutionCode: `import threading
import time

counter = 0

def increment():
    global counter
    for _ in range(100000):
        counter += 1

# Create two threads
t1 = threading.Thread(target=increment)
t2 = threading.Thread(target=increment)

# Start both threads
t1.start()
t2.start()

# Wait for both to finish
t1.join()
t2.join()

# The result is often LESS than 200000 due to race conditions!
# counter += 1 is NOT atomic: it reads, increments, then writes.
# Two threads can read the same value, both increment it,
# and both write back the same result — losing one update.
print(f"Expected: 200000")
print(f"Actual:   \${counter}")
print(f"Lost updates: \${200000 - counter}")`
    },
    {
      id: "processes-threads-coroutines",
      slug: "processes-threads-coroutines",
      title: "Processes vs Threads vs Coroutines",
      content: `## Processes, Threads, and Coroutines

Understanding the differences between these three execution units is fundamental to concurrency.

### Processes

A **process** is an independent program in execution with its own memory space, file descriptors, and system resources.

\`\`\`
Process A (Memory Space A)        Process B (Memory Space B)
┌─────────────────────┐          ┌─────────────────────┐
│  Code   │   Heap    │          │  Code   │   Heap    │
│─────────│───────────│          │─────────│───────────│
│  Stack  │   Data    │          │  Stack  │   Data    │
└─────────────────────┘          └─────────────────────┘
        ↕ IPC (pipes, sockets, shared memory) ↕
\`\`\`

- **Isolation**: One process crashing doesn't affect others
- **Communication**: Must use Inter-Process Communication (IPC) — pipes, sockets, shared memory
- **Overhead**: Creating a process is expensive (memory duplication)
- **Python advantage**: Bypasses the GIL — true parallelism for CPU work

### Threads

A **thread** is a lightweight execution unit within a process. All threads in a process share the same memory space.

\`\`\`
Process (Shared Memory Space)
┌────────────────────────────────┐
│         Shared Heap            │
│    ┌─────┐  ┌─────┐  ┌─────┐  │
│    │Stack│  │Stack│  │Stack│  │
│    │  A  │  │  B  │  │  C  │  │
│    └─────┘  └─────┘  └─────┘  │
│   Thread A  Thread B Thread C  │
└────────────────────────────────┘
\`\`\`

- **Shared memory**: Threads can read/write the same variables — fast but dangerous
- **Lightweight**: Creating a thread is much cheaper than a process
- **Danger**: Shared state leads to race conditions, deadlocks, and corruption
- **Python limitation**: The GIL means only one thread runs Python bytecode at a time

### Coroutines

A **coroutine** is a function that can suspend and resume execution cooperatively. They run in a **single thread**.

\`\`\`
Single Thread Event Loop:
  coroutine_A runs → yields (I/O wait) →
  coroutine_B runs → yields (I/O wait) →
  coroutine_A resumes → completes →
  coroutine_B resumes → completes
\`\`\`

- **No parallelism**: Everything runs in one thread — no race conditions on shared state
- **Cooperative**: Coroutines explicitly yield control (not preempted by OS)
- **Best for I/O**: Perfect for network requests, file I/O, database queries
- **Python**: \`async/await\` with \`asyncio\`

### Comparison Table

| Feature | Process | Thread | Coroutine |
|---------|---------|--------|-----------|
| Memory | Separate | Shared | Shared |
| Creation cost | High | Medium | Low |
| Communication | IPC | Shared vars | Direct |
| True parallelism | Yes | Limited (GIL) | No |
| Race conditions | No (isolated) | Yes | No (single thread) |
| Best for | CPU-bound | I/O + some CPU | I/O-bound |
| Python module | multiprocessing | threading | asyncio |

### When to Use Each

- **CPU-heavy math, image processing** → multiprocessing (bypass GIL)
- **Multiple I/O waits (files, network)** → threading or asyncio
- **Thousands of concurrent connections** → asyncio (lowest overhead)
- **Need isolation / crash safety** → multiprocessing`,
      starterCode: `import threading
import multiprocessing
import time

# TODO: Compare thread creation vs process creation time
# Create and time the creation + start + join of:
# 1. 10 threads that each sleep for 0.01 seconds
# 2. 10 processes that each sleep for 0.01 seconds

def worker():
    """Simple task: sleep briefly"""
    time.sleep(0.01)

# TODO: Time thread creation
thread_start = time.time()
# Create 10 threads, start them, join them
thread_end = time.time()

# TODO: Time process creation
process_start = time.time()
# Create 10 processes, start them, join them
process_end = time.time()

# TODO: Print comparison
print("Thread time: ???")
print("Process time: ???")`,
      solutionCode: `import threading
import multiprocessing
import time

def worker():
    """Simple task: sleep briefly"""
    time.sleep(0.01)

# Time thread creation
thread_start = time.time()
threads = [threading.Thread(target=worker) for _ in range(10)]
for t in threads:
    t.start()
for t in threads:
    t.join()
thread_end = time.time()

# Time process creation
process_start = time.time()
processes = [multiprocessing.Process(target=worker) for _ in range(10)]
for p in processes:
    p.start()
for p in processes:
    p.join()
process_end = time.time()

print(f"Thread time:  \${thread_end - thread_start:.4f}s")
print(f"Process time: \${process_end - process_start:.4f}s")
print(f"Processes are ~\${(process_end - process_start) / (thread_end - thread_start):.1f}x slower to create")`
    },
    {
      id: "thread-lifecycle-states",
      slug: "thread-lifecycle-states",
      title: "Thread Lifecycle & States",
      content: `## Thread Lifecycle and States

Every thread goes through a well-defined lifecycle from creation to termination. Understanding these states is crucial for debugging concurrency issues.

### Thread States

\`\`\`
         ┌──────────┐
         │   NEW    │  Thread object created
         └────┬─────┘
              │ start()
         ┌────▼─────┐
    ┌────►│ RUNNABLE │◄────┐  Ready to run / running
    │    └────┬─────┘     │
    │         │            │
    │    ┌────▼─────┐     │
    │    │ BLOCKED  │─────┘  Waiting for lock
    │    └──────────┘
    │         │
    │    ┌────▼─────┐
    │    │ WAITING  │─────┘  wait() / join() / sleep()
    │    └──────────┘
    │         │
    │    ┌────▼──────┐
    └────│TERMINATED │     Thread finished
         └───────────┘
\`\`\`

### State Details

**NEW**: The thread object has been created but \`start()\` has not been called. No OS thread exists yet.

**RUNNABLE**: The thread is either running on a CPU core or waiting in the OS ready queue for its turn. The OS scheduler decides when it actually executes.

**BLOCKED**: The thread tried to acquire a lock that another thread holds. It cannot proceed until the lock is released.

**WAITING**: The thread is voluntarily paused — it called \`sleep()\`, \`join()\`, or \`wait()\`. It will resume when the wait condition is met.

**TERMINATED**: The thread's target function has returned (or raised an unhandled exception). The thread cannot be restarted.

### Python Thread Methods

| Method | Description |
|--------|-------------|
| \`start()\` | NEW → RUNNABLE. Creates the OS thread |
| \`join(timeout)\` | Caller blocks until this thread finishes |
| \`is_alive()\` | Returns True if thread has started and not terminated |
| \`daemon\` | If True, thread dies when main thread exits |

### Daemon Threads

A **daemon thread** runs in the background and is automatically killed when all non-daemon threads finish. This is useful for background tasks like logging or heartbeats.

\`\`\`
Main Thread:  ████████████████████ → exits
Daemon:       ████████████████████ → killed automatically
Non-Daemon:   ████████████████████████████ → main waits for this
\`\`\`

**Rule**: The Python interpreter shuts down when all non-daemon threads have completed. Daemon threads are terminated abruptly — they don't get to run cleanup code.

### Thread Safety Tip: Always Join

If you start threads and don't join them, your program might exit before threads finish their work. Always call \`join()\` on threads whose results matter.

\`\`\`python
# BAD — main might exit before threads finish
for t in threads:
    t.start()
# program ends here, threads may be half-done

# GOOD — wait for all threads
for t in threads:
    t.start()
for t in threads:
    t.join()  # blocks until t finishes
\`\`\`

### Interview Insight

Interviewers often ask: "What happens if you call \`start()\` twice on the same thread?" Answer: It raises a \`RuntimeError\`. A thread can only be started once. If you need to run the task again, create a new thread object.`,
      starterCode: `import threading
import time

# TODO: Demonstrate thread lifecycle states
# 1. Create a thread (NEW state)
# 2. Check is_alive() before starting
# 3. Start the thread (RUNNABLE state)
# 4. Check is_alive() while running
# 5. Join the thread (wait for TERMINATED)
# 6. Check is_alive() after completion

def long_task():
    # TODO: Print thread name and simulate work
    pass

# TODO: Create thread and demonstrate lifecycle
# Print the state at each stage`,
      solutionCode: `import threading
import time

def long_task():
    name = threading.current_thread().name
    print(f"  [\${name}] Running... (RUNNABLE)")
    time.sleep(1)
    print(f"  [\${name}] Finishing... (about to TERMINATE)")

# 1. NEW state — thread created but not started
t = threading.Thread(target=long_task, name="Worker-1")
print(f"After creation:  is_alive={t.is_alive()}")  # False (NEW)

# 2. RUNNABLE state — thread started
t.start()
print(f"After start():   is_alive={t.is_alive()}")  # True (RUNNABLE)

# 3. Wait briefly, thread is still running
time.sleep(0.1)
print(f"During work:     is_alive={t.is_alive()}")  # True (RUNNABLE)

# 4. TERMINATED state — wait for thread to finish
t.join()
print(f"After join():    is_alive={t.is_alive()}")  # False (TERMINATED)

# Demonstrate daemon threads
print("\\n--- Daemon Thread Demo ---")

def background_task():
    while True:
        print("  [Daemon] Still running...")
        time.sleep(0.3)

daemon = threading.Thread(target=background_task, daemon=True, name="Daemon-1")
daemon.start()
time.sleep(1)
print("Main thread exiting — daemon will be killed automatically")`
    },
    {
      id: "race-conditions-critical-sections",
      slug: "race-conditions-critical-sections",
      title: "Race Conditions & Critical Sections",
      content: `## Race Conditions and Critical Sections

A **race condition** occurs when the behavior of a program depends on the relative timing of threads. The outcome is nondeterministic — different runs produce different results.

### The Classic Race Condition

\`\`\`
Intended: counter goes from 0 → 1 → 2

Thread A                    Thread B
──────────                  ──────────
read counter (0)
                            read counter (0)
increment (0→1)
                            increment (0→1)
write counter (1)
                            write counter (1)  ← LOST UPDATE

Result: counter = 1 (should be 2)
\`\`\`

The problem: \`counter += 1\` is **not atomic**. In Python bytecode, it compiles to:

1. LOAD_GLOBAL counter (read)
2. LOAD_CONST 1
3. BINARY_ADD (increment)
4. STORE_GLOBAL counter (write)

The OS can switch threads between **any** of these instructions.

### Critical Sections

A **critical section** is a block of code that accesses shared resources and must not be executed by more than one thread at a time.

\`\`\`
Thread A                    Thread B
──────────                  ──────────
[ENTER critical section]
  read counter (0)          [BLOCKED — waiting]
  increment (0→1)           [BLOCKED — waiting]
  write counter (1)         [BLOCKED — waiting]
[EXIT critical section]
                            [ENTER critical section]
                              read counter (1)
                              increment (1→2)
                              write counter (2)
                            [EXIT critical section]

Result: counter = 2 ✓
\`\`\`

### Types of Race Conditions

**Check-then-act**: Read a condition, then act on it — but the condition changes between check and act.
\`\`\`python
if key not in dictionary:      # Thread A checks
    # Thread B inserts key here!
    dictionary[key] = value    # Thread A overwrites!
\`\`\`

**Read-modify-write**: Read a value, compute a new value, write it back — another thread modifies between read and write.
\`\`\`python
balance = get_balance()        # Thread A reads $100
# Thread B withdraws $80 → balance = $20
set_balance(balance - 50)      # Thread A writes $50 (should be -$30!)
\`\`\`

### Detecting Race Conditions

Race conditions are notoriously hard to find because:
1. They may only manifest under specific timing conditions
2. Adding print statements changes timing and may hide the bug
3. They may only appear under high load in production

**Signs of a race condition:**
- Intermittent failures that can't be reproduced reliably
- Results that vary between runs with the same input
- Counters that are slightly off from expected values
- Data corruption that appears "randomly"

### The Fix: Mutual Exclusion

The solution is to ensure **mutual exclusion** — only one thread can be in the critical section at a time. Python provides several mechanisms:
- \`threading.Lock\` — basic mutex
- \`threading.RLock\` — reentrant lock (same thread can acquire multiple times)
- \`threading.Semaphore\` — allows N threads
- \`threading.Condition\` — wait/notify mechanism`,
      starterCode: `import threading

# TODO: Demonstrate a race condition, then fix it
# Part 1: Show the race condition with a shared counter
# Part 2: Fix it using a Lock

class BankAccount:
    def __init__(self, balance):
        self.balance = balance
        # TODO: Add a lock

    def withdraw(self, amount):
        # TODO: This has a race condition!
        # Read balance, check if sufficient, then subtract
        if self.balance >= amount:
            # Simulate processing delay
            self.balance -= amount
            return True
        return False

# TODO: Create an account with balance 100
# TODO: Create 10 threads each trying to withdraw 15
# TODO: Start all threads and join them
# TODO: Print final balance (should never be negative!)`,
      solutionCode: `import threading
import time

class BankAccountUnsafe:
    """Demonstrates the race condition"""
    def __init__(self, balance):
        self.balance = balance

    def withdraw(self, amount):
        if self.balance >= amount:
            time.sleep(0.001)  # Simulate delay — increases race window
            self.balance -= amount
            return True
        return False

class BankAccountSafe:
    """Fixed with a Lock"""
    def __init__(self, balance):
        self.balance = balance
        self.lock = threading.Lock()

    def withdraw(self, amount):
        with self.lock:  # Only one thread in this block at a time
            if self.balance >= amount:
                time.sleep(0.001)
                self.balance -= amount
                return True
            return False

def test_account(account_class, label):
    account = account_class(100)
    results = {"success": 0, "failed": 0}

    def try_withdraw():
        if account.withdraw(15):
            results["success"] += 1
        else:
            results["failed"] += 1

    threads = [threading.Thread(target=try_withdraw) for _ in range(10)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    print(f"[\${label}] Balance: \${account.balance} | "
          f"Withdrawals: \${results['success']} succeeded, \${results['failed']} failed")
    if account.balance < 0:
        print(f"  BUG! Balance went negative!")

print("--- Unsafe (race condition) ---")
for i in range(5):
    test_account(BankAccountUnsafe, f"Run {i+1}")

print("\\n--- Safe (with Lock) ---")
for i in range(5):
    test_account(BankAccountSafe, f"Run {i+1}")`
    },
    {
      id: "deadlock-livelock-starvation",
      slug: "deadlock-livelock-starvation",
      title: "Deadlock, Livelock & Starvation",
      content: `## Deadlock, Livelock, and Starvation

These are three failure modes that can occur in concurrent programs. They all result in threads failing to make progress, but for different reasons.

### Deadlock

A **deadlock** occurs when two or more threads are each waiting for a resource that another thread holds. No thread can proceed.

\`\`\`
Thread A holds Lock 1, waits for Lock 2
Thread B holds Lock 2, waits for Lock 1

Thread A: ──[Lock1]────WAIT(Lock2)────→ blocked forever
Thread B: ──[Lock2]────WAIT(Lock1)────→ blocked forever
\`\`\`

### Four Conditions for Deadlock (Coffman Conditions)

ALL four must be true simultaneously for deadlock to occur:

1. **Mutual Exclusion** — Resources can't be shared (a lock is held exclusively)
2. **Hold and Wait** — A thread holds one resource while waiting for another
3. **No Preemption** — Resources can't be forcibly taken from a thread
4. **Circular Wait** — A cycle of threads, each waiting for the next one's resource

**Break any one condition to prevent deadlock.**

### Deadlock Prevention Strategies

| Strategy | Breaks | How |
|----------|--------|-----|
| Lock ordering | Circular wait | Always acquire locks in the same global order |
| Lock timeout | Hold and wait | Give up if lock not acquired within timeout |
| Try-lock | Hold and wait | Use non-blocking acquire, release all on failure |
| Single lock | Mutual exclusion | Use one coarse-grained lock |

### Livelock

A **livelock** occurs when threads are actively executing but making no progress — like two people in a hallway who keep stepping aside in the same direction.

\`\`\`
Thread A: "B has the lock, I'll back off and retry"
Thread B: "A has the lock, I'll back off and retry"
Thread A: "B has the lock, I'll back off and retry"
... forever ...
\`\`\`

Threads aren't blocked — they're running — but they keep undoing each other's work or endlessly retrying. Fix: add **random backoff** so threads don't keep colliding.

### Starvation

**Starvation** occurs when a thread is perpetually denied access to a resource because other threads keep getting priority.

\`\`\`
High-priority threads:  ██ ██ ██ ██ ██ ██ ██ ██ ██
Low-priority thread:    ── ── ── ── ── ── ── ── ── (never runs!)
\`\`\`

**Causes**: Unfair lock acquisition, priority inversion, greedy threads that hold locks too long.

**Fix**: Use fair locks (FIFO ordering), priority inheritance, or bounded waiting.

### Interview Classic: Dining Philosophers

Five philosophers sit around a table with five forks. Each needs two forks to eat. If each picks up their left fork simultaneously, **deadlock** — everyone has one fork and waits for the other.

\`\`\`
    P1
   / \\
  F5   F1
  |     |
 P5    P2
  |     |
  F4   F2
   \\ /
    P3─F3─P4
\`\`\`

**Solutions**: Lock ordering (always pick up lower-numbered fork first), allow at most N-1 philosophers to attempt eating simultaneously, or use a waiter (central coordinator).

### Detection vs Prevention

- **Prevention**: Design the system so deadlock is impossible (lock ordering)
- **Avoidance**: Dynamically check if granting a resource would cause deadlock (Banker's algorithm)
- **Detection**: Periodically check for cycles in the wait-for graph, then kill a thread to break the cycle`,
      starterCode: `import threading
import time

# TODO: Demonstrate a deadlock, then fix it with lock ordering

lock_a = threading.Lock()
lock_b = threading.Lock()

def thread_1():
    # TODO: Acquire lock_a, then lock_b (causes deadlock)
    pass

def thread_2():
    # TODO: Acquire lock_b, then lock_a (causes deadlock)
    pass

# TODO: Show the deadlock scenario (with a timeout so it doesn't hang forever)
# TODO: Then fix it by having both threads acquire locks in the same order

# Hint: Use lock.acquire(timeout=2) to detect the deadlock
# instead of the 'with' statement which blocks forever`,
      solutionCode: `import threading
import time

# ===== DEADLOCK DEMO (with timeout detection) =====
print("=== Deadlock Demo (with timeout) ===")

lock_a = threading.Lock()
lock_b = threading.Lock()

def deadlock_thread_1():
    lock_a.acquire()
    print("[T1] Acquired Lock A, waiting for Lock B...")
    time.sleep(0.1)  # Ensure both threads hold one lock
    if lock_b.acquire(timeout=2):
        print("[T1] Acquired Lock B")
        lock_b.release()
    else:
        print("[T1] DEADLOCK DETECTED — could not acquire Lock B!")
    lock_a.release()

def deadlock_thread_2():
    lock_b.acquire()
    print("[T2] Acquired Lock B, waiting for Lock A...")
    time.sleep(0.1)
    if lock_a.acquire(timeout=2):
        print("[T2] Acquired Lock A")
        lock_a.release()
    else:
        print("[T2] DEADLOCK DETECTED — could not acquire Lock A!")
    lock_b.release()

t1 = threading.Thread(target=deadlock_thread_1)
t2 = threading.Thread(target=deadlock_thread_2)
t1.start()
t2.start()
t1.join()
t2.join()

# ===== FIX: Lock Ordering =====
print("\\n=== Fixed with Lock Ordering ===")

def safe_thread_1():
    with lock_a:                    # Always acquire A first
        print("[T1] Acquired Lock A")
        time.sleep(0.1)
        with lock_b:                # Then B
            print("[T1] Acquired Lock B")
            print("[T1] Doing work with both locks")

def safe_thread_2():
    with lock_a:                    # Same order: A first
        print("[T2] Acquired Lock A")
        time.sleep(0.1)
        with lock_b:                # Then B
            print("[T2] Acquired Lock B")
            print("[T2] Doing work with both locks")

t1 = threading.Thread(target=safe_thread_1)
t2 = threading.Thread(target=safe_thread_2)
t1.start()
t2.start()
t1.join()
t2.join()
print("No deadlock! Lock ordering prevents circular wait.")`
    }
  ]
};
