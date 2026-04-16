import { Module } from "../types";

export const module7: Module = {
  id: "concurrency",
  title: "Concurrency & Multithreading",
  description: "Threads, synchronization, volatile, locks, and the java.util.concurrent toolkit — essential for backend interviews",
  lessons: [
    {
      id: "threads-synchronization",
      slug: "threads-synchronization",
      title: "Threads, Synchronization & Locks",
      content: `
# Concurrency in Java

Java has built-in concurrency support. Understanding threads, synchronization, and the java.util.concurrent package is essential for senior Java roles.

\`\`\`concept
{
  "title": "Concurrency Fundamentals",
  "description": "Multiple threads share memory — this enables performance but introduces race conditions, deadlocks, and visibility problems. Java provides tools to manage this safely.",
  "points": [
    "Thread: lightweight unit of execution within a process",
    "Race condition: result depends on thread execution order",
    "synchronized: ensures only one thread executes a method/block at a time",
    "volatile: guarantees visibility across threads (but not atomicity)",
    "AtomicInteger/Long: thread-safe counter without explicit locks",
    "ReentrantLock: more flexible than synchronized — tryLock, timeout, fairness",
    "Deadlock: two threads each hold a lock the other needs — both wait forever"
  ]
}
\`\`\`

## Creating Threads

\`\`\`tabs
[
  {
    "label": "Thread / Runnable",
    "content": "// Option 1: extend Thread (limits flexibility — single inheritance)\\nclass MyThread extends Thread {\\n    @Override\\n    public void run() {\\n        System.out.println(\\"Running in: \\" + Thread.currentThread().getName());\\n    }\\n}\\nnew MyThread().start();\\n\\n// Option 2: implement Runnable (preferred — separates task from execution)\\nRunnable task = () -> System.out.println(\\"Task running\\");\\nThread t = new Thread(task, \\"worker-1\\");\\nt.start();\\nt.join(); // wait for t to finish\\n\\n// Option 3: ExecutorService (best practice — reuses threads)\\nExecutorService pool = Executors.newFixedThreadPool(4);\\npool.submit(() -> System.out.println(\\"Pool task\\"));\\npool.shutdown(); // stops accepting new tasks\\npool.awaitTermination(10, TimeUnit.SECONDS);"
  },
  {
    "label": "Callable & Future",
    "content": "// Callable returns a result; Runnable doesn't\\nExecutorService pool = Executors.newFixedThreadPool(2);\\n\\nCallable<Integer> task = () -> {\\n    Thread.sleep(100);\\n    return 42;\\n};\\n\\nFuture<Integer> future = pool.submit(task);\\n\\n// Do other work while task runs...\\n\\n// Get result (blocks if not ready):\\nInteger result = future.get(); // 42\\nInteger result = future.get(5, TimeUnit.SECONDS); // timeout version\\n\\n// Check without blocking:\\nif (future.isDone()) {\\n    Integer val = future.get();\\n}\\n\\n// Cancel:\\nfuture.cancel(true); // true = interrupt if running"
  }
]
\`\`\`

## Synchronization

\`\`\`java
// Race condition example:
public class Counter {
    private int count = 0;

    // BAD: read-modify-write is NOT atomic!
    public void increment() {
        count++; // Thread 1 reads 0, Thread 2 reads 0, both write 1 → lost update!
    }
}

// Fix 1: synchronized method (intrinsic lock)
public class SafeCounter {
    private int count = 0;

    public synchronized void increment() {
        count++; // only one thread at a time
    }

    public synchronized int getCount() {
        return count;
    }
}

// Fix 2: synchronized block (more granular)
public class SafeCounter2 {
    private int count = 0;
    private final Object lock = new Object();

    public void increment() {
        synchronized (lock) {
            count++;
        }
        // code here runs concurrently
    }
}

// Fix 3: AtomicInteger (lock-free, CAS-based — best for simple counters)
public class AtomicCounter {
    private AtomicInteger count = new AtomicInteger(0);

    public void increment() { count.incrementAndGet(); }
    public int getCount() { return count.get(); }
}
\`\`\`

## volatile & Visibility

\`\`\`java
// Without volatile: threads may cache field values in CPU registers
// Changes in Thread 1 may NOT be visible to Thread 2!
class SharedState {
    private volatile boolean running = true; // volatile = always read from main memory

    public void stop() { running = false; }

    public void run() {
        while (running) {   // Thread sees the latest value of 'running'
            doWork();
        }
    }
}

// volatile guarantees VISIBILITY but NOT ATOMICITY
// volatile int count; count++ is still a race condition!
// Use AtomicInteger for atomic operations
\`\`\`

## java.util.concurrent Essentials

\`\`\`tabs
[
  {
    "label": "ExecutorService",
    "content": "// Thread pool types:\\nExecutorService fixed = Executors.newFixedThreadPool(4);       // bounded\\nExecutorService cached = Executors.newCachedThreadPool();       // grows as needed\\nExecutorService single = Executors.newSingleThreadExecutor();   // sequential\\nScheduledExecutorService sched = Executors.newScheduledThreadPool(2);\\n\\n// Schedule with delay:\\nsched.schedule(() -> doTask(), 5, TimeUnit.SECONDS);\\n// Repeat at fixed rate:\\nsched.scheduleAtFixedRate(() -> poll(), 0, 1, TimeUnit.SECONDS);"
  },
  {
    "label": "CompletableFuture",
    "content": "// Modern async programming (Java 8+)\\nCompletableFuture<String> future = CompletableFuture\\n    .supplyAsync(() -> fetchUser(id))           // async\\n    .thenApply(user -> user.getName())          // transform\\n    .thenApply(String::toUpperCase)             // chain\\n    .exceptionally(ex -> \\"Unknown\\");           // handle error\\n\\nString result = future.get(); // block for result\\n\\n// Combine two futures:\\nCompletableFuture<String> userFuture = CompletableFuture.supplyAsync(() -> fetchUser(1));\\nCompletableFuture<String> orderFuture = CompletableFuture.supplyAsync(() -> fetchOrder(1));\\n\\nCompletableFuture<String> combined = userFuture\\n    .thenCombine(orderFuture, (user, order) -> user + \\": \\" + order);"
  },
  {
    "label": "Concurrent Collections",
    "content": "// Thread-safe versions of common collections:\\nMap<String, Integer> map = new ConcurrentHashMap<>(); // O(1), segment-level locking\\nList<String> list = new CopyOnWriteArrayList<>();      // snapshot-on-write\\nQueue<Task> queue = new ConcurrentLinkedQueue<>();     // lock-free queue\\nBlockingQueue<String> bq = new LinkedBlockingQueue<>(100); // blocking producer/consumer\\n\\n// DO NOT use Collections.synchronizedMap for most cases:\\n// synchronized wrappers lock the whole map for every operation\\n// ConcurrentHashMap is much better for concurrent access\\n\\n// Producer-Consumer pattern:\\nbq.put(\\"task1\\");   // blocks if full\\nString task = bq.take(); // blocks if empty"
  }
]
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is a race condition?",
      "options": ["Two threads running at the same speed", "A bug where the outcome depends on the interleaving of thread execution", "A performance optimization technique", "A deadlock involving two threads"],
      "answer": 1,
      "explanation": "A race condition occurs when multiple threads access shared state concurrently and the result depends on the timing/order of execution. The classic example is count++ not being atomic."
    },
    {
      "q": "volatile guarantees which property?",
      "options": ["Atomicity of compound operations", "Visibility — all threads see the latest written value", "Ordering of all memory operations", "Prevention of deadlocks"],
      "answer": 1,
      "explanation": "volatile ensures changes to a variable are immediately visible to all threads (no CPU cache). It does NOT provide atomicity — count++ is still a race condition on a volatile field."
    },
    {
      "q": "What is the difference between thread.sleep() and thread.join()?",
      "options": ["No difference", "sleep() pauses the CURRENT thread; join() waits for ANOTHER thread to finish", "join() pauses the current thread; sleep() waits for another", "sleep() is deprecated"],
      "answer": 1,
      "explanation": "Thread.sleep(ms) pauses the calling thread for the specified time. thread.join() makes the calling thread wait until the specified thread completes its execution."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
