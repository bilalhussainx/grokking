import { Module } from "../types";

export const pythonConcurrencyModule: Module = {
  id: "concurrency-python",
  title: "Python Concurrency In Depth",
  description: "Master Python's concurrency toolkit: the GIL, threading, multiprocessing, asyncio, and concurrent.futures.",
  lessons: [
    {
      id: "python-gil",
      slug: "python-gil",
      title: "Python's GIL Explained",
      content: `## The Global Interpreter Lock (GIL)

The **GIL** is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecode simultaneously. It is the single most important concept for understanding Python concurrency.

### What the GIL Does

\`\`\`
With GIL (CPython):
  Thread A: ██──────██──────██────  (holds GIL)
  Thread B: ──██──────██──────██──  (holds GIL)
  Only ONE thread runs Python code at any instant

Without GIL (Java, C++):
  Thread A: ████████████████████
  Thread B: ████████████████████
  True parallel execution
\`\`\`

The GIL ensures that only **one thread** executes Python bytecode at a time, even on multi-core machines. Python threads take turns holding the GIL, switching approximately every 5ms (configurable via \`sys.setswitchinterval()\`).

### Why the GIL Exists

CPython's memory management uses **reference counting**. Every Python object has a reference count, and when it reaches zero, the object is freed. Without the GIL, two threads could modify a reference count simultaneously, causing memory corruption or leaks.

\`\`\`
Without GIL protection:
  Thread A: read refcount(3) → increment → write(4)
  Thread B: read refcount(3) → increment → write(4)  ← should be 5!
\`\`\`

The GIL is a simple, effective solution — at the cost of true CPU parallelism.

### CPU-Bound vs I/O-Bound

This distinction is critical for choosing the right concurrency approach:

| Workload | GIL Impact | Best Approach |
|----------|-----------|---------------|
| **CPU-bound** (math, image processing) | GIL kills parallelism | \`multiprocessing\` |
| **I/O-bound** (network, disk, DB) | GIL released during I/O | \`threading\` or \`asyncio\` |

When a thread performs I/O (network request, file read, \`time.sleep()\`), it **releases the GIL**, allowing other threads to run. This is why threading still works well for I/O-heavy programs.

\`\`\`
I/O-Bound (threading works):
  Thread A: ██[I/O wait---]██[I/O wait---]██
  Thread B: ──██[I/O wait---]██[I/O wait---]
  GIL released during I/O → other threads run

CPU-Bound (threading fails):
  Thread A: ██──██──██──██──██──██──  (GIL switching)
  Thread B: ──██──██──██──██──██──██
  Same total work, MORE overhead from switching
\`\`\`

### Proving the GIL's Impact

A CPU-bound task with 2 threads is often **slower** than with 1 thread because of GIL contention overhead:

- 1 thread, 100M operations: ~5 seconds
- 2 threads, 50M each: ~6 seconds (worse!)
- 2 processes, 50M each: ~2.5 seconds (true parallelism)

### GIL-Free Python

- **PyPy**: Still has a GIL (but JIT makes CPU work faster)
- **Jython / IronPython**: No GIL (JVM / CLR handle thread safety)
- **CPython 3.13+**: Experimental free-threaded mode (\`--disable-gil\`)
- **C extensions**: Can release GIL explicitly (\`Py_BEGIN_ALLOW_THREADS\`)

### Interview Key Points

1. The GIL makes CPython threads unsuitable for CPU-bound parallelism
2. Threads still work for I/O-bound work because the GIL is released during I/O
3. Use \`multiprocessing\` to bypass the GIL for CPU-bound tasks
4. The GIL protects CPython internals, NOT your code — you still need locks for shared data`,
      starterCode: `import threading
import time

# TODO: Demonstrate the GIL's impact on CPU-bound work
# 1. Write a CPU-bound function that counts to N
# 2. Run it once with a single thread (count to 20_000_000)
# 3. Run it with two threads (each counts to 10_000_000)
# 4. Compare the times — threading should be SLOWER

def cpu_bound_work(n):
    """Count to n — pure CPU work"""
    # TODO: Simple counting loop
    pass

# TODO: Single-threaded benchmark
# Time running cpu_bound_work(20_000_000) directly

# TODO: Multi-threaded benchmark
# Time running two threads, each doing cpu_bound_work(10_000_000)

# TODO: Print comparison`,
      solutionCode: `import threading
import time

def cpu_bound_work(n):
    """Count to n — pure CPU work"""
    count = 0
    for _ in range(n):
        count += 1
    return count

N = 20_000_000

# Single-threaded
start = time.time()
cpu_bound_work(N)
single_time = time.time() - start
print(f"Single thread: \${single_time:.3f}s")

# Multi-threaded (2 threads, half work each)
start = time.time()
t1 = threading.Thread(target=cpu_bound_work, args=(N // 2,))
t2 = threading.Thread(target=cpu_bound_work, args=(N // 2,))
t1.start()
t2.start()
t1.join()
t2.join()
multi_time = time.time() - start
print(f"Two threads:   \${multi_time:.3f}s")

ratio = multi_time / single_time
print(f"\\nRatio: \${ratio:.2f}x")
if ratio > 1.0:
    print("Threading is SLOWER due to GIL contention!")
    print("For CPU-bound work, use multiprocessing instead.")
else:
    print("Threading was faster (unusual for CPU-bound work).")`
    },
    {
      id: "python-threading",
      slug: "python-threading",
      title: "Threading Module",
      content: `## Python's threading Module

The \`threading\` module provides high-level thread management. It is the standard way to write concurrent I/O-bound programs in Python.

### Creating Threads

Two approaches — function-based and class-based:

\`\`\`python
# Approach 1: Pass a target function
t = threading.Thread(target=my_func, args=(arg1, arg2))
t.start()

# Approach 2: Subclass Thread
class MyThread(threading.Thread):
    def run(self):
        # Thread body here
        pass
\`\`\`

### Thread Constructor Parameters

| Parameter | Description |
|-----------|-------------|
| \`target\` | Callable to invoke in the thread |
| \`args\` | Tuple of positional arguments |
| \`kwargs\` | Dict of keyword arguments |
| \`name\` | Human-readable thread name |
| \`daemon\` | If True, thread dies when main exits |

### Daemon Threads

A daemon thread runs in the background and is **automatically killed** when all non-daemon threads finish. Use for background tasks like monitoring or heartbeats.

\`\`\`
Main Thread:    ████████████████████ → exits
Non-daemon:     ████████████████████████████ → main waits
Daemon:         ████████████████████ → killed when main exits
\`\`\`

**Warning**: Daemon threads don't run \`finally\` blocks or cleanup code when killed.

### Thread-Local Data

\`threading.local()\` creates storage that is **unique to each thread**. Each thread sees its own copy of the data, avoiding shared-state bugs entirely.

\`\`\`python
local_data = threading.local()

def worker(value):
    local_data.x = value  # Each thread has its own local_data.x
    print(local_data.x)   # Always prints this thread's value
\`\`\`

This is commonly used for database connections, request context, or per-thread caches.

### Timer Threads

A \`Timer\` is a thread that waits a specified interval before executing:

\`\`\`python
t = threading.Timer(5.0, my_func)  # Run my_func after 5 seconds
t.start()
t.cancel()  # Cancel if not yet fired
\`\`\`

### Useful Functions

| Function | Description |
|----------|-------------|
| \`threading.current_thread()\` | Returns the current Thread object |
| \`threading.active_count()\` | Number of alive threads |
| \`threading.enumerate()\` | List all alive Thread objects |
| \`threading.main_thread()\` | Returns the main thread |

### Best Practices

1. **Always join non-daemon threads** — otherwise main may exit mid-work
2. **Use \`with lock:\`** instead of manual \`acquire()/release()\` — exception-safe
3. **Prefer \`target=\` over subclassing** — simpler, less boilerplate
4. **Name your threads** — makes debugging much easier
5. **Minimize shared state** — pass data via arguments, collect results via queues`,
      starterCode: `import threading
import time

# TODO: Build a multi-threaded file downloader simulation
# 1. Create a function 'download_file' that takes a filename and size
#    - Print "[thread_name] Downloading {filename}..."
#    - Sleep for (size / 100) seconds to simulate download
#    - Print "[thread_name] Finished {filename}"
# 2. Create a list of files: [("report.pdf", 200), ("image.png", 100),
#    ("data.csv", 300), ("video.mp4", 500), ("notes.txt", 50)]
# 3. Download all files using threads (one thread per file)
# 4. Use thread-local data to track bytes downloaded per thread
# 5. Time the total download and compare with sequential estimate

files = [
    ("report.pdf", 200),
    ("image.png", 100),
    ("data.csv", 300),
    ("video.mp4", 500),
    ("notes.txt", 50),
]

local_data = threading.local()

def download_file(filename, size):
    # TODO: Simulate downloading
    pass

# TODO: Create threads, start them, join them
# TODO: Print total time`,
      solutionCode: `import threading
import time

files = [
    ("report.pdf", 200),
    ("image.png", 100),
    ("data.csv", 300),
    ("video.mp4", 500),
    ("notes.txt", 50),
]

local_data = threading.local()

def download_file(filename, size):
    name = threading.current_thread().name
    local_data.bytes_downloaded = 0
    print(f"[\${name}] Downloading \${filename} (\${size} KB)...")
    time.sleep(size / 100)  # Simulate download time
    local_data.bytes_downloaded = size
    print(f"[\${name}] Finished \${filename} (\${local_data.bytes_downloaded} KB)")

# Sequential estimate
sequential_time = sum(size / 100 for _, size in files)

# Threaded download
start = time.time()
threads = []
for filename, size in files:
    t = threading.Thread(
        target=download_file,
        args=(filename, size),
        name=f"DL-\${filename}"
    )
    threads.append(t)
    t.start()

for t in threads:
    t.join()

elapsed = time.time() - start
total_kb = sum(size for _, size in files)

print(f"\\nAll downloads complete!")
print(f"Total data: \${total_kb} KB")
print(f"Threaded time:    \${elapsed:.2f}s")
print(f"Sequential would: \${sequential_time:.2f}s")
print(f"Speedup: \${sequential_time / elapsed:.1f}x")`
    },
    {
      id: "python-multiprocessing",
      slug: "python-multiprocessing",
      title: "Multiprocessing Module",
      content: `## Python's multiprocessing Module

The \`multiprocessing\` module spawns **separate processes**, each with its own Python interpreter and GIL. This enables true parallelism for CPU-bound work.

### Process vs Thread

\`\`\`
threading.Thread:                  multiprocessing.Process:
┌─────────────────────┐           ┌──────────┐  ┌──────────┐
│   Shared Memory     │           │ Process A │  │ Process B │
│  ┌─────┐ ┌─────┐   │           │ Own GIL   │  │ Own GIL   │
│  │ T1  │ │ T2  │   │           │ Own heap  │  │ Own heap  │
│  └─────┘ └─────┘   │           └──────────┘  └──────────┘
│   One GIL           │              True parallelism
└─────────────────────┘
\`\`\`

### Creating Processes

\`\`\`python
from multiprocessing import Process

def worker(n):
    print(f"Computing in process {os.getpid()}")
    return sum(range(n))

p = Process(target=worker, args=(10_000_000,))
p.start()
p.join()
\`\`\`

### Process Pool

\`Pool\` manages a fixed number of worker processes and distributes tasks:

\`\`\`python
from multiprocessing import Pool

with Pool(processes=4) as pool:
    results = pool.map(cpu_heavy_func, data_list)  # Parallel map
    result = pool.apply_async(func, args)           # Single async task
\`\`\`

| Method | Description |
|--------|-------------|
| \`pool.map(func, iterable)\` | Parallel map, blocks until done |
| \`pool.map_async(func, iterable)\` | Non-blocking map, returns AsyncResult |
| \`pool.apply(func, args)\` | Single call, blocks |
| \`pool.apply_async(func, args)\` | Single call, non-blocking |
| \`pool.starmap(func, iterable)\` | Like map but unpacks argument tuples |

### Inter-Process Communication

Since processes don't share memory, use **Queue** or **Pipe** to communicate:

**Queue** (multi-producer, multi-consumer):
\`\`\`python
from multiprocessing import Queue
q = Queue()
q.put("data")       # Producer
item = q.get()      # Consumer (blocks until available)
\`\`\`

**Pipe** (two-way between exactly 2 processes):
\`\`\`python
from multiprocessing import Pipe
parent_conn, child_conn = Pipe()
parent_conn.send("hello")
msg = child_conn.recv()
\`\`\`

### Shared Memory

For high-performance data sharing without serialization overhead:

\`\`\`python
from multiprocessing import Value, Array

counter = Value('i', 0)       # Shared integer
arr = Array('d', [0.0] * 10)  # Shared double array

with counter.get_lock():
    counter.value += 1
\`\`\`

### When to Use multiprocessing

- **CPU-bound** computation: number crunching, image processing, ML training
- **Need true parallelism**: Must bypass the GIL
- **Crash isolation**: A child process crash doesn't kill the parent

### Caveats

1. **Serialization overhead**: Arguments and return values are pickled/unpickled
2. **Startup cost**: Spawning a process is ~10-100x slower than creating a thread
3. **Memory usage**: Each process duplicates the Python interpreter
4. **Debugging**: Harder to debug across process boundaries`,
      starterCode: `from multiprocessing import Process, Pool, Queue
import time
import os

# TODO: Compare threading vs multiprocessing for CPU-bound work
# 1. Write a CPU-bound function (e.g., sum of squares up to N)
# 2. Run it with multiprocessing.Pool across 4 processes
# 3. Run the same work in a single process
# 4. Compare the times

def sum_of_squares(n):
    """CPU-bound: compute sum of squares from 0 to n"""
    # TODO: Return sum of i*i for i in range(n)
    pass

# TODO: Define work chunks — split 40_000_000 into 4 chunks of 10_000_000
chunks = []

# TODO: Single-process benchmark
# Time running sum_of_squares for all chunks sequentially

# TODO: Multi-process benchmark using Pool
# Time running pool.map(sum_of_squares, chunks)

# TODO: Print comparison`,
      solutionCode: `from multiprocessing import Pool
import time
import os

def sum_of_squares(n):
    """CPU-bound: compute sum of squares from 0 to n"""
    total = 0
    for i in range(n):
        total += i * i
    return total

chunks = [10_000_000] * 4  # 4 chunks of 10M

if __name__ == "__main__":
    # Single-process (sequential)
    start = time.time()
    sequential_results = [sum_of_squares(n) for n in chunks]
    seq_time = time.time() - start
    print(f"Sequential: \${seq_time:.3f}s")
    print(f"  Results: \${[r % 1000000 for r in sequential_results]}")

    # Multi-process (parallel)
    start = time.time()
    with Pool(processes=4) as pool:
        parallel_results = pool.map(sum_of_squares, chunks)
    par_time = time.time() - start
    print(f"\\nParallel (4 processes): \${par_time:.3f}s")
    print(f"  Results: \${[r % 1000000 for r in parallel_results]}")

    # Comparison
    speedup = seq_time / par_time if par_time > 0 else 0
    print(f"\\nSpeedup: \${speedup:.2f}x")
    print(f"True parallelism bypasses the GIL!")
    print(f"Each process ran in its own PID with its own interpreter.")`
    },
    {
      id: "python-asyncio",
      slug: "python-asyncio",
      title: "asyncio & Event Loops",
      content: `## asyncio — Single-Threaded Concurrency

\`asyncio\` is Python's built-in library for writing concurrent code using **coroutines**. It runs in a single thread with an **event loop** that manages thousands of concurrent I/O operations.

### The Event Loop

\`\`\`
Event Loop (single thread):
  ┌──────────────────────────────────────────┐
  │  Check ready tasks → Run one step        │
  │  │                                       │
  │  Task A: await fetch(url1) → suspended   │
  │  Task B: await fetch(url2) → suspended   │
  │  Task C: ready! → run next line          │
  │  │                                       │
  │  I/O complete for A → resume Task A      │
  │  Loop continues...                       │
  └──────────────────────────────────────────┘
\`\`\`

The event loop repeatedly checks which tasks are ready and runs them. When a task hits \`await\`, it **suspends** and the loop runs another task. No OS threads are involved.

### Coroutines and async/await

A **coroutine** is a function defined with \`async def\`. It can be paused with \`await\`:

\`\`\`python
async def fetch_data(url):
    response = await http_client.get(url)  # Suspends here
    return response.json()                  # Resumes when I/O done
\`\`\`

**Key rules:**
- \`async def\` creates a coroutine function
- \`await\` can only be used inside \`async def\`
- \`await\` suspends the coroutine until the awaited thing completes
- Calling a coroutine function returns a coroutine object (doesn't execute it)

### Running Coroutines

\`\`\`python
import asyncio

async def main():
    result = await fetch_data("https://api.example.com")
    print(result)

asyncio.run(main())  # Entry point — creates and runs event loop
\`\`\`

### Tasks and gather

**Tasks** wrap coroutines and schedule them to run concurrently:

\`\`\`python
async def main():
    # Sequential (slow):
    a = await fetch("url1")   # Wait for this...
    b = await fetch("url2")   # Then this...

    # Concurrent (fast):
    task1 = asyncio.create_task(fetch("url1"))
    task2 = asyncio.create_task(fetch("url2"))
    a = await task1  # Both run concurrently
    b = await task2

    # Even simpler with gather:
    a, b = await asyncio.gather(
        fetch("url1"),
        fetch("url2")
    )
\`\`\`

\`\`\`
Sequential:
  fetch url1: ████████████
                            fetch url2: ████████████
  Total: ======================== (24 units)

Concurrent (gather):
  fetch url1: ████████████
  fetch url2: ████████████
  Total: ============ (12 units)
\`\`\`

### asyncio Primitives

| Primitive | Description |
|-----------|-------------|
| \`asyncio.sleep(n)\` | Non-blocking sleep |
| \`asyncio.gather(*coros)\` | Run coroutines concurrently, return all results |
| \`asyncio.wait(tasks)\` | Wait with more control (first done, timeout) |
| \`asyncio.Queue()\` | Async-safe queue for producer/consumer |
| \`asyncio.Lock()\` | Async lock (use \`async with lock:\`) |
| \`asyncio.Semaphore(n)\` | Limit concurrent access to n |
| \`asyncio.Event()\` | Signal between coroutines |

### When to Use asyncio

- **Thousands of concurrent I/O ops** (HTTP requests, DB queries, WebSocket connections)
- **Network servers** handling many simultaneous clients
- **Scraping / API calls** where most time is spent waiting for responses

### asyncio vs threading

| Feature | asyncio | threading |
|---------|---------|----------|
| Concurrency model | Cooperative (await) | Preemptive (OS) |
| Race conditions | Rare (single thread) | Common |
| Overhead per task | Very low | Medium |
| Best for | 10,000+ I/O tasks | Dozens of I/O tasks |
| Learning curve | Higher | Lower |`,
      starterCode: `import asyncio
import time

# TODO: Simulate fetching data from multiple APIs concurrently
# 1. Write an async function 'fetch_api' that takes a name and delay
#    - Print "Fetching {name}..."
#    - await asyncio.sleep(delay) to simulate network I/O
#    - Print "Got {name} (took {delay}s)"
#    - Return a dict {"api": name, "data": f"result from {name}"}
# 2. Write a 'main' coroutine that fetches these APIs:
#    ("users", 2), ("orders", 3), ("products", 1), ("reviews", 2.5)
# 3. First run them sequentially and time it
# 4. Then run them concurrently with asyncio.gather and time it
# 5. Print comparison

apis = [("users", 2), ("orders", 3), ("products", 1), ("reviews", 2.5)]

async def fetch_api(name, delay):
    # TODO: simulate API call
    pass

async def main():
    # TODO: Sequential run
    # TODO: Concurrent run with gather
    # TODO: Print comparison
    pass

asyncio.run(main())`,
      solutionCode: `import asyncio
import time

apis = [("users", 2), ("orders", 3), ("products", 1), ("reviews", 2.5)]

async def fetch_api(name, delay):
    print(f"  Fetching \${name}...")
    await asyncio.sleep(delay)
    print(f"  Got \${name} (took \${delay}s)")
    return {"api": name, "data": f"result from \${name}"}

async def main():
    # Sequential
    print("=== Sequential ===")
    start = time.time()
    seq_results = []
    for name, delay in apis:
        result = await fetch_api(name, delay)
        seq_results.append(result)
    seq_time = time.time() - start
    print(f"Sequential time: \${seq_time:.2f}s\\n")

    # Concurrent with gather
    print("=== Concurrent (asyncio.gather) ===")
    start = time.time()
    con_results = await asyncio.gather(
        *(fetch_api(name, delay) for name, delay in apis)
    )
    con_time = time.time() - start
    print(f"Concurrent time: \${con_time:.2f}s\\n")

    # Results
    print("=== Comparison ===")
    print(f"Sequential: \${seq_time:.2f}s")
    print(f"Concurrent: \${con_time:.2f}s")
    print(f"Speedup:    \${seq_time / con_time:.1f}x")
    print(f"\\nAll results: \${[r['api'] for r in con_results]}")

asyncio.run(main())`
    },
    {
      id: "python-futures",
      slug: "python-futures",
      title: "concurrent.futures",
      content: `## concurrent.futures — High-Level Parallelism

The \`concurrent.futures\` module provides a unified, high-level interface for both thread-based and process-based parallelism. It abstracts away the details of thread/process management behind a clean **Executor** API.

### The Executor Pattern

\`\`\`
┌─────────────────────────────────┐
│         Your Code               │
│   executor.submit(func, args)   │
│   executor.map(func, iterable)  │
└────────────┬────────────────────┘
             │
     ┌───────▼────────┐
     │    Executor     │  ← ThreadPoolExecutor
     │   (manages      │     OR
     │    workers)     │  ← ProcessPoolExecutor
     └───────┬─────────┘
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
 Worker   Worker   Worker
\`\`\`

### ThreadPoolExecutor

Best for **I/O-bound** tasks. Manages a pool of threads:

\`\`\`python
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=5) as executor:
    # Submit individual tasks
    future = executor.submit(fetch_url, "https://example.com")
    result = future.result()  # Blocks until done

    # Map across an iterable
    results = list(executor.map(fetch_url, urls))
\`\`\`

### ProcessPoolExecutor

Best for **CPU-bound** tasks. Manages a pool of processes:

\`\`\`python
from concurrent.futures import ProcessPoolExecutor

with ProcessPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(heavy_computation, data_chunks))
\`\`\`

**Same API** — just swap the executor class. This is the major advantage of \`concurrent.futures\`.

### Future Objects

A \`Future\` represents a computation that may not have completed yet:

| Method | Description |
|--------|-------------|
| \`result(timeout=None)\` | Block and return the result |
| \`done()\` | True if the task completed |
| \`cancelled()\` | True if the task was cancelled |
| \`cancel()\` | Attempt to cancel the task |
| \`exception(timeout=None)\` | Return the exception, if any |
| \`add_done_callback(fn)\` | Call fn when the task completes |

### as_completed — Process Results as They Finish

\`\`\`python
from concurrent.futures import as_completed

futures = {executor.submit(fetch, url): url for url in urls}

for future in as_completed(futures):
    url = futures[future]
    try:
        data = future.result()
        print(f"Got {url}: {len(data)} bytes")
    except Exception as e:
        print(f"Error on {url}: {e}")
\`\`\`

This processes results in **completion order**, not submission order. Faster tasks are handled first.

\`\`\`
Submission order:  Task A (3s) → Task B (1s) → Task C (2s)
as_completed:      Task B (1s) → Task C (2s) → Task A (3s)
                   ↑ fastest result first
\`\`\`

### Choosing the Right Executor

| Scenario | Executor | Why |
|----------|----------|-----|
| Download 100 URLs | ThreadPool | I/O-bound, threads release GIL |
| Process 100 images | ProcessPool | CPU-bound, bypass GIL |
| Query 50 APIs | ThreadPool | Network I/O |
| Train 4 ML models | ProcessPool | Heavy CPU computation |
| Mix of I/O and CPU | ThreadPool + subprocess | Hybrid approach |

### Error Handling

Exceptions in worker threads/processes are captured by the \`Future\` and re-raised when you call \`.result()\`:

\`\`\`python
future = executor.submit(risky_function, data)
try:
    result = future.result(timeout=10)
except TimeoutError:
    print("Task took too long")
except Exception as e:
    print(f"Task failed: {e}")
\`\`\`

### Best Practice: Use the Context Manager

Always use \`with\` — it ensures all threads/processes are properly cleaned up:

\`\`\`python
# GOOD — automatic cleanup
with ThreadPoolExecutor() as executor:
    results = executor.map(func, data)

# BAD — must remember to call shutdown
executor = ThreadPoolExecutor()
# ... if an exception occurs, workers may leak
executor.shutdown(wait=True)
\`\`\``,
      starterCode: `from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor, as_completed
import time

# TODO: Build a URL checker that processes results as they complete
# 1. Create a function 'check_url' that simulates checking a URL
#    - Takes a tuple (url, simulated_delay)
#    - Sleeps for the delay
#    - Returns {"url": url, "status": "OK", "time": delay}
# 2. Define a list of URLs with varying delays
# 3. Use ThreadPoolExecutor with as_completed to process results
#    in the order they finish (not submission order)
# 4. Print each result as it completes, showing the order

urls = [
    ("https://api.fast.com", 0.5),
    ("https://api.slow.com", 3.0),
    ("https://api.medium.com", 1.5),
    ("https://api.quick.com", 0.3),
    ("https://api.sluggish.com", 2.5),
]

def check_url(url_info):
    # TODO: Simulate URL check
    pass

# TODO: Use ThreadPoolExecutor + as_completed
# Print results in completion order`,
      solutionCode: `from concurrent.futures import ThreadPoolExecutor, as_completed
import time

urls = [
    ("https://api.fast.com", 0.5),
    ("https://api.slow.com", 3.0),
    ("https://api.medium.com", 1.5),
    ("https://api.quick.com", 0.3),
    ("https://api.sluggish.com", 2.5),
]

def check_url(url_info):
    url, delay = url_info
    time.sleep(delay)  # Simulate network request
    return {"url": url, "status": "OK", "response_time": delay}

print("Submitting URL checks...\\n")
start = time.time()

with ThreadPoolExecutor(max_workers=5) as executor:
    # Submit all tasks and map futures back to URLs
    future_to_url = {
        executor.submit(check_url, url_info): url_info[0]
        for url_info in urls
    }

    # Process results as they complete (fastest first)
    for i, future in enumerate(as_completed(future_to_url), 1):
        url = future_to_url[future]
        try:
            result = future.result()
            elapsed = time.time() - start
            print(f"  #{i} [\${elapsed:.1f}s] \${result['url']} → "
                  f"\${result['status']} (response: \${result['response_time']}s)")
        except Exception as e:
            print(f"  #{i} \${url} → ERROR: \${e}")

total = time.time() - start
sequential_time = sum(d for _, d in urls)
print(f"\\nTotal time:      \${total:.2f}s")
print(f"Sequential would: \${sequential_time:.2f}s")
print(f"Speedup:          \${sequential_time / total:.1f}x")
print(f"\\nResults came in completion order, not submission order!")`
    }
  ]
};
