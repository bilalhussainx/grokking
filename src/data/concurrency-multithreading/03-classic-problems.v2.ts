import { Module } from "../types";

export const classicProblemsModule: Module = {
  id: "concurrency-classic",
  title: "Classic Concurrency Problems",
  description: "Solve the legendary concurrency problems: Producer-Consumer, Readers-Writers, Dining Philosophers, Sleeping Barber, and Cigarette Smokers.",
  lessons: [
    {
      id: "producer-consumer",
      slug: "producer-consumer",
      title: "Producer-Consumer Problem",
      content: `## The Producer-Consumer Problem

The **Producer-Consumer problem** (also called the **Bounded Buffer problem**) is the most fundamental concurrency problem. One or more producer threads generate data and place it into a shared buffer. One or more consumer threads remove data and process it.

### The Challenge

\`\`\`
Producer                Buffer (capacity=3)           Consumer
────────                ──────────────────            ────────
produce(A) ──►  [A][_][_]
produce(B) ──►  [A][B][_]
produce(C) ──►  [A][B][C]
produce(D) ──►  FULL! Block.                         consume() ──► A
             ──►  [B][C][D]                          consume() ──► B
                                                     consume() ──► C
                                                     consume() ──► D
                  [_][_][_]                           EMPTY! Block.
\`\`\`

### Three Synchronization Requirements

1. **Mutual exclusion**: Only one thread modifies the buffer at a time
2. **Not full**: Producers must wait when the buffer is full
3. **Not empty**: Consumers must wait when the buffer is empty

### Solution with Condition Variables

The cleanest solution uses a single Condition variable with the monitor pattern:

\`\`\`python
class BoundedBuffer:
    def __init__(self, capacity):
        self.buffer = collections.deque()
        self.capacity = capacity
        self.condition = threading.Condition()

    def produce(self, item):
        with self.condition:
            while len(self.buffer) >= self.capacity:
                self.condition.wait()     # wait: buffer full
            self.buffer.append(item)
            self.condition.notify_all()   # signal: buffer not empty

    def consume(self):
        with self.condition:
            while len(self.buffer) == 0:
                self.condition.wait()     # wait: buffer empty
            item = self.buffer.popleft()
            self.condition.notify_all()   # signal: buffer not full
            return item
\`\`\`

### Solution with Semaphores

An alternative uses two semaphores to track empty and full slots:

\`\`\`
empty = Semaphore(capacity)   # tracks empty slots
full  = Semaphore(0)          # tracks filled slots
mutex = Lock()                # protects buffer access

Producer:                     Consumer:
  empty.acquire()  (slot--)     full.acquire()   (item--)
  mutex.acquire()               mutex.acquire()
  buffer.add(item)              item = buffer.remove()
  mutex.release()               mutex.release()
  full.release()   (item++)     empty.release()  (slot++)
\`\`\`

### Why This Problem Matters

The producer-consumer pattern appears everywhere in real systems:
- **Web servers**: Request queue between acceptor and worker threads
- **Message queues**: Kafka, RabbitMQ, SQS
- **Logging**: Application threads produce log entries, logger thread writes to disk
- **Pipelines**: Each stage produces output consumed by the next stage

### Common Mistakes

1. Using \`if\` instead of \`while\` for the wait condition (spurious wakeups!)
2. Forgetting to notify after modifying the buffer
3. Using \`notify()\` instead of \`notify_all()\` with multiple producers/consumers
4. Not protecting buffer access with a lock when using semaphores`,
      starterCode: `import threading
import time
import random
from collections import deque

# TODO: Implement the Producer-Consumer problem with semaphores
# - Bounded buffer with capacity 5
# - 3 producer threads, each producing 10 items
# - 2 consumer threads, each consuming 15 items (30 total = 30 produced)

class ProducerConsumer:
    def __init__(self, capacity):
        self.buffer = deque()
        self.capacity = capacity
        # TODO: Create semaphores for empty slots and full slots
        # TODO: Create a mutex for buffer access

    def produce(self, item):
        # TODO: Use semaphore pattern
        pass

    def consume(self):
        # TODO: Use semaphore pattern
        pass

# TODO: Create producer and consumer threads
# Producers should produce items with a name like "P{id}-{seq}"
# Print buffer state after each operation`,
      solutionCode: `import threading
import time
import random
from collections import deque

class ProducerConsumer:
    def __init__(self, capacity):
        self.buffer = deque()
        self.capacity = capacity
        self.empty = threading.Semaphore(capacity)  # empty slots
        self.full = threading.Semaphore(0)           # full slots
        self.mutex = threading.Lock()

    def produce(self, item):
        self.empty.acquire()         # wait for empty slot
        with self.mutex:
            self.buffer.append(item)
            print(f"  + Produced \${item} | Buffer({len(self.buffer)}/{self.capacity}): \${list(self.buffer)}")
        self.full.release()          # signal: one more full slot

    def consume(self):
        self.full.acquire()          # wait for full slot
        with self.mutex:
            item = self.buffer.popleft()
            print(f"  - Consumed \${item} | Buffer({len(self.buffer)}/{self.capacity}): \${list(self.buffer)}")
        self.empty.release()         # signal: one more empty slot
        return item

pc = ProducerConsumer(capacity=5)
produced_count = {"value": 0}
consumed_count = {"value": 0}
count_lock = threading.Lock()

def producer(pid):
    for i in range(10):
        item = f"P{pid}-{i}"
        pc.produce(item)
        with count_lock:
            produced_count["value"] += 1
        time.sleep(random.uniform(0.01, 0.1))

def consumer(cid):
    for i in range(15):
        item = pc.consume()
        with count_lock:
            consumed_count["value"] += 1
        time.sleep(random.uniform(0.01, 0.15))

producers = [threading.Thread(target=producer, args=(i,)) for i in range(3)]
consumers = [threading.Thread(target=consumer, args=(i,)) for i in range(2)]

print("=== Producer-Consumer with Semaphores ===")
for t in producers + consumers:
    t.start()
for t in producers + consumers:
    t.join()

print(f"\\nProduced: \${produced_count['value']}, Consumed: \${consumed_count['value']}")
print(f"Buffer remaining: \${list(pc.buffer)}")`,
    },
    {
      id: "readers-writers",
      slug: "readers-writers",
      title: "Readers-Writers Problem",
      content: `## The Readers-Writers Problem

The **Readers-Writers problem** models shared access to a resource where reads can happen concurrently but writes must be exclusive.

### The Rules

1. Multiple readers can access the resource simultaneously
2. Only one writer can access the resource at a time
3. No reader can access while a writer is writing
4. No writer can access while any reader is reading

\`\`\`
Timeline showing valid access patterns:

  R1: ──████────────────────────████──
  R2: ──████────────────────────████──
  R3: ──████──────────────────────────
  W1: ────────────████────────────────
  W2: ──────────────────████──────────
       ↑              ↑         ↑
       Multiple Rs    Ws are    Rs can resume
       concurrent     exclusive after W finishes
\`\`\`

### First Readers-Writers Solution (Reader-Preference)

Readers get priority. A writer must wait for ALL readers to finish, but new readers can start even while a writer is waiting.

**Risk**: Writer starvation — if readers keep arriving, the writer never gets access.

### Second Readers-Writers Solution (Writer-Preference)

Once a writer is waiting, no new readers can start. Only the currently active readers finish, then the writer goes.

**Risk**: Reader starvation under heavy write load.

### Third Solution (Fair / FIFO)

Requests are served in arrival order. No starvation possible.

### Implementation: Reader-Preference

\`\`\`
State:
  reader_count = 0        # active readers
  resource_lock = Lock()  # guards the shared resource
  count_lock = Lock()     # guards reader_count

Reader:
  count_lock.acquire()
  reader_count += 1
  if reader_count == 1:   # first reader locks the resource
      resource_lock.acquire()
  count_lock.release()

  # ... read resource ...

  count_lock.acquire()
  reader_count -= 1
  if reader_count == 0:   # last reader unlocks the resource
      resource_lock.release()
  count_lock.release()

Writer:
  resource_lock.acquire()
  # ... write resource ...
  resource_lock.release()
\`\`\`

The key insight: the **first reader** locks the resource (blocking writers), and the **last reader** unlocks it. Individual readers don't need the resource lock — only the count lock.

### Real-World Applications

| System | Readers | Writers |
|--------|---------|---------|
| Database | SELECT queries | UPDATE/INSERT |
| Cache | Cache lookups | Cache invalidation |
| Config | Read config values | Hot reload config |
| DNS | Resolve domain | Update DNS entry |
| File system | Read file | Write file |

### Interview Note

When asked this problem, always clarify: "Should readers or writers get priority?" This shows you understand the subtlety. Then implement the version they request.`,
      starterCode: `import threading
import time
import random

# TODO: Implement the Readers-Writers problem (reader-preference)
# - A shared "database" (dictionary)
# - Multiple reader threads can read simultaneously
# - Writer threads get exclusive access
# - Track and print concurrent reader count

class ReadersWriters:
    def __init__(self):
        self.data = {"temperature": 72, "humidity": 45}
        self.reader_count = 0
        # TODO: Add locks (resource_lock and count_lock)

    def start_read(self):
        # TODO: First reader locks the resource
        pass

    def end_read(self):
        # TODO: Last reader unlocks the resource
        pass

    def start_write(self):
        # TODO: Acquire exclusive access
        pass

    def end_write(self):
        # TODO: Release exclusive access
        pass

# TODO: Create 5 reader threads and 2 writer threads
# Readers read 5 times each with small delays
# Writers write 3 times each with larger delays`,
      solutionCode: `import threading
import time
import random

class ReadersWriters:
    def __init__(self):
        self.data = {"temperature": 72, "humidity": 45}
        self.reader_count = 0
        self.resource_lock = threading.Lock()
        self.count_lock = threading.Lock()

    def start_read(self):
        with self.count_lock:
            self.reader_count += 1
            if self.reader_count == 1:
                self.resource_lock.acquire()  # First reader locks resource

    def end_read(self):
        with self.count_lock:
            self.reader_count -= 1
            if self.reader_count == 0:
                self.resource_lock.release()  # Last reader unlocks resource

    def start_write(self):
        self.resource_lock.acquire()  # Exclusive access

    def end_write(self):
        self.resource_lock.release()

rw = ReadersWriters()

def reader(rid):
    for _ in range(5):
        rw.start_read()
        snapshot = dict(rw.data)
        readers = rw.reader_count
        print(f"  [R{rid}] Read: \${snapshot} (concurrent readers: \${readers})")
        time.sleep(random.uniform(0.05, 0.15))
        rw.end_read()
        time.sleep(random.uniform(0.01, 0.05))

def writer(wid):
    for i in range(3):
        rw.start_write()
        rw.data["temperature"] = random.randint(60, 90)
        rw.data["humidity"] = random.randint(30, 70)
        print(f"  [W{wid}] WROTE: \${dict(rw.data)}")
        time.sleep(random.uniform(0.1, 0.2))
        rw.end_write()
        time.sleep(random.uniform(0.1, 0.3))

readers = [threading.Thread(target=reader, args=(i,)) for i in range(5)]
writers = [threading.Thread(target=writer, args=(i,)) for i in range(2)]

print("=== Readers-Writers (Reader-Preference) ===")
for t in readers + writers:
    t.start()
for t in readers + writers:
    t.join()
print("\\nDone! All readers and writers completed.")`,
    },
    {
      id: "dining-philosophers",
      slug: "dining-philosophers",
      title: "Dining Philosophers Problem",
      content: `## The Dining Philosophers Problem

Five philosophers sit around a circular table. Each philosopher alternates between **thinking** and **eating**. Between each pair of philosophers is a single fork (five forks total). A philosopher needs **both** adjacent forks to eat.

### The Setup

\`\`\`
        P0
       / \\
     F4    F0
     |      |
    P4      P1
     |      |
     F3    F1
       \\ /
        P3─F2─P2
\`\`\`

Philosopher i needs fork i (left) and fork (i+1)%5 (right).

### The Deadlock Scenario

If every philosopher picks up their left fork simultaneously:

\`\`\`
P0: picks up F0, waits for F1
P1: picks up F1, waits for F2
P2: picks up F2, waits for F3
P3: picks up F3, waits for F4
P4: picks up F4, waits for F0  ← circular wait = DEADLOCK
\`\`\`

### Solution 1: Lock Ordering (Resource Hierarchy)

Break the circular wait by having each philosopher always pick up the **lower-numbered** fork first:

\`\`\`
P0: pick up F0 (lower), then F1 (higher) ✓
P1: pick up F1, then F2 ✓
P2: pick up F2, then F3 ✓
P3: pick up F3, then F4 ✓
P4: pick up F0 (lower!), then F4  ← breaks the cycle!
\`\`\`

P4 now competes with P0 for F0 instead of holding F4 while waiting. No circular wait possible.

### Solution 2: Limit Diners (Semaphore)

Allow at most 4 philosophers to attempt eating simultaneously. With only 4 competing for 5 forks, at least one can always get both forks.

### Solution 3: Chandy/Misra (Request-Based)

Philosophers send "request" messages for forks. Each fork is either "clean" or "dirty." A dirty fork must be given up when requested. This is used in distributed systems.

### Why This Problem Matters

The Dining Philosophers problem illustrates:
- **Deadlock** from circular resource dependencies
- **Starvation** if solutions aren't fair
- **Livelock** if philosophers keep picking up and putting down forks
- **Lock ordering** as a deadlock prevention strategy

These exact patterns appear in database locks, file system access, and network resource allocation.

### Interview Approach

When presented this problem:
1. Identify the deadlock condition (circular wait)
2. Propose lock ordering as the simplest fix
3. Discuss trade-offs: lock ordering reduces concurrency slightly but guarantees no deadlock
4. Mention the semaphore solution as an alternative`,
      starterCode: `import threading
import time
import random

# TODO: Implement the Dining Philosophers problem
# First show the deadlock version, then fix it with lock ordering

NUM_PHILOSOPHERS = 5
# TODO: Create 5 fork locks

def philosopher_deadlock(pid):
    """Naive version that can deadlock"""
    left = pid
    right = (pid + 1) % NUM_PHILOSOPHERS
    # TODO: Pick up left fork, then right fork
    # Eat, then put both down
    pass

def philosopher_safe(pid):
    """Fixed version using lock ordering"""
    # TODO: Always pick up lower-numbered fork first
    # This breaks the circular wait condition
    pass

# TODO: Run the safe version with 5 philosopher threads
# Each philosopher should eat 3 times`,
      solutionCode: `import threading
import time
import random

NUM_PHILOSOPHERS = 5
forks = [threading.Lock() for _ in range(NUM_PHILOSOPHERS)]
eat_count = [0] * NUM_PHILOSOPHERS
count_lock = threading.Lock()

def philosopher_safe(pid, num_meals=3):
    """Fixed version using lock ordering — always pick up lower-numbered fork first"""
    left = pid
    right = (pid + 1) % NUM_PHILOSOPHERS
    first = min(left, right)    # always lock lower number first
    second = max(left, right)

    for meal in range(num_meals):
        # Think
        print(f"  P{pid} thinking...")
        time.sleep(random.uniform(0.05, 0.15))

        # Pick up forks in order
        forks[first].acquire()
        print(f"  P{pid} picked up fork {first}")
        forks[second].acquire()
        print(f"  P{pid} picked up fork {second}")

        # Eat
        print(f"  P{pid} EATING (meal {meal + 1}/{num_meals})")
        time.sleep(random.uniform(0.05, 0.1))

        with count_lock:
            eat_count[pid] += 1

        # Put down forks
        forks[second].release()
        forks[first].release()
        print(f"  P{pid} put down forks {first} & {second}")

print("=== Dining Philosophers (Lock Ordering) ===")
print(f"Forks: 0-{NUM_PHILOSOPHERS - 1}, each philosopher eats 3 times\\n")

threads = [threading.Thread(target=philosopher_safe, args=(i,)) for i in range(NUM_PHILOSOPHERS)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"\\nMeals eaten: \${eat_count}")
print(f"Total meals: \${sum(eat_count)} (expected: \${NUM_PHILOSOPHERS * 3})")
print("No deadlock! Lock ordering prevents circular wait.")`,
    },
    {
      id: "sleeping-barber",
      slug: "sleeping-barber",
      title: "Sleeping Barber Problem",
      content: `## The Sleeping Barber Problem

A barbershop has one barber, one barber chair, and N waiting chairs. When no customers are present, the barber sleeps. When a customer arrives:
- If the barber is sleeping, wake the barber
- If all waiting chairs are full, the customer leaves
- Otherwise, the customer sits in a waiting chair

### The Setup

\`\`\`
┌──────────────────────────────────┐
│          Barbershop              │
│                                  │
│  [Barber Chair]    Waiting Room  │
│   ┌───────┐     ┌──┐┌──┐┌──┐   │
│   │Barber │     │W1││W2││W3│   │
│   │ 💈    │     └──┘└──┘└──┘   │
│   └───────┘      3 chairs      │
│                                  │
└──────────────────────────────────┘
         ↑
    Door (customers enter)
\`\`\`

### Synchronization Challenges

1. **Barber-customer**: The barber must wait (sleep) when no customers are present
2. **Customer-barber**: Customers must wait if barber is busy
3. **Bounded waiting room**: Customers must leave if all chairs are taken
4. **No race conditions**: The count of waiting customers must be accurate

### Solution with Semaphores

\`\`\`
customers = Semaphore(0)      # waiting customers (barber waits on this)
barber_ready = Semaphore(0)   # barber signals readiness
mutex = Lock()                # protects waiting count
waiting = 0                   # number of waiting customers
CHAIRS = 3                    # waiting room capacity

Barber:                           Customer:
  while True:                       mutex.acquire()
    customers.acquire()  # sleep    if waiting < CHAIRS:
    mutex.acquire()                     waiting += 1
    waiting -= 1                        mutex.release()
    barber_ready.release()              customers.release()  # wake barber
    mutex.release()                     barber_ready.acquire()  # wait for turn
    cut_hair()                          get_haircut()
                                    else:
                                        mutex.release()
                                        leave()  # shop full
\`\`\`

### Why Three Semaphores?

Each solves a different coordination problem:

| Semaphore | Purpose | Who waits | Who signals |
|-----------|---------|-----------|-------------|
| customers | Barber sleeps when no customers | Barber | Customer |
| barber_ready | Customer waits for barber | Customer | Barber |
| mutex | Protect waiting count | Both | Both |

### Variants

- **Multiple barbers**: Use a semaphore(N) for barber availability
- **Priority customers**: Use a priority queue instead of FIFO
- **Time-limited waiting**: Customers leave after a timeout

### Real-World Analogy

This pattern appears in:
- **Thread pools**: Worker threads sleep when the task queue is empty
- **Connection pools**: Database connections are reused; new requests wait or are rejected
- **Print spoolers**: The printer (barber) processes jobs from a queue
- **Customer service**: Call center agents handle calls from a queue`,
      starterCode: `import threading
import time
import random

# TODO: Implement the Sleeping Barber problem
# - 1 barber, 3 waiting chairs
# - 10 customers arrive at random intervals
# - If waiting room full, customer leaves
# - Barber sleeps when no customers

WAITING_CHAIRS = 3
NUM_CUSTOMERS = 10

# TODO: Create semaphores and shared state

def barber():
    # TODO: Loop forever (use daemon thread)
    # Wait for customers, then cut hair
    pass

def customer(cid):
    # TODO: Check if waiting room has space
    # If yes, sit and signal barber
    # If no, leave
    pass

# TODO: Start barber as daemon thread
# TODO: Create customer threads with random arrival times`,
      solutionCode: `import threading
import time
import random

WAITING_CHAIRS = 3
NUM_CUSTOMERS = 10

customers_sem = threading.Semaphore(0)
barber_ready = threading.Semaphore(0)
mutex = threading.Lock()
waiting = {"count": 0}
stats = {"served": 0, "turned_away": 0}

def barber():
    while True:
        print("[Barber] Sleeping... zzz")
        customers_sem.acquire()       # sleep until customer arrives

        with mutex:
            waiting["count"] -= 1
        barber_ready.release()        # signal: ready to cut

        # Cut hair
        duration = random.uniform(0.2, 0.5)
        print(f"[Barber] Cutting hair... ({duration:.1f}s)")
        time.sleep(duration)
        stats["served"] += 1
        print(f"[Barber] Haircut done! (total served: \${stats['served']})")

def customer(cid):
    print(f"  [C{cid}] Arrives at barbershop")
    with mutex:
        if waiting["count"] < WAITING_CHAIRS:
            waiting["count"] += 1
            print(f"  [C{cid}] Sits in waiting room "
                  f"(waiting: \${waiting['count']}/\${WAITING_CHAIRS})")
        else:
            print(f"  [C{cid}] Waiting room FULL — leaves! "
                  f"(waiting: \${waiting['count']}/\${WAITING_CHAIRS})")
            stats["turned_away"] += 1
            return

    customers_sem.release()           # wake barber if sleeping
    barber_ready.acquire()            # wait for barber to be ready
    print(f"  [C{cid}] Getting haircut!")
    time.sleep(random.uniform(0.2, 0.5))
    print(f"  [C{cid}] Haircut complete, leaving happy!")

# Start barber as daemon thread
barber_thread = threading.Thread(target=barber, daemon=True)
barber_thread.start()

# Customers arrive at random intervals
customer_threads = []
for i in range(NUM_CUSTOMERS):
    time.sleep(random.uniform(0.1, 0.4))
    t = threading.Thread(target=customer, args=(i,))
    t.start()
    customer_threads.append(t)

for t in customer_threads:
    t.join()

time.sleep(1)  # Let last haircut finish
print(f"\\n=== Results ===")
print(f"Customers served: \${stats['served']}")
print(f"Customers turned away: \${stats['turned_away']}")
print(f"Total: \${stats['served'] + stats['turned_away']} / \${NUM_CUSTOMERS}")`,
    },
    {
      id: "cigarette-smokers",
      slug: "cigarette-smokers",
      title: "Cigarette Smokers Problem",
      content: `## The Cigarette Smokers Problem

Three smokers sit around a table. To smoke, each needs three ingredients: **tobacco**, **paper**, and **matches**. Each smoker has an infinite supply of one ingredient:

- Smoker A has tobacco
- Smoker B has paper
- Smoker C has matches

An **agent** places two random ingredients on the table. The smoker who has the third ingredient picks them up and smokes.

### The Challenge

\`\`\`
Agent places:     Who smokes:
──────────────    ───────────
paper + matches → Smoker A (has tobacco)
tobacco + matches → Smoker B (has paper)
tobacco + paper → Smoker C (has matches)
\`\`\`

The difficulty: smokers cannot simply check what's on the table. Each smoker must be **notified specifically** when their needed combination appears.

### Why It's Hard

The naive approach — each smoker checks the table — leads to problems:

\`\`\`
Agent puts: paper + matches
Smoker A: "I see paper!" (grabs paper)
Smoker B: "I see paper!" (but A already took it — race condition!)
\`\`\`

### Solution: Pusher Threads

Use three intermediate "pusher" threads that observe what the agent places and signal the correct smoker:

\`\`\`
Agent: puts 2 random ingredients on table
  ↓
Pusher threads: observe which 2 ingredients were placed
  ↓
Signal the correct smoker's semaphore
  ↓
Smoker: wakes up, takes ingredients, smokes
\`\`\`

### Implementation Pattern

\`\`\`
agent_sem = Semaphore(1)          # agent can place items
tobacco_sem = Semaphore(0)        # signal smoker with paper+matches
paper_sem = Semaphore(0)          # signal smoker with tobacco+matches
match_sem = Semaphore(0)          # signal smoker with tobacco+paper

Agent:
  while True:
    agent_sem.acquire()
    choose = random.choice(["tobacco+paper", "tobacco+match", "paper+match"])
    place ingredients and signal appropriate pushers

Smoker A (has tobacco):
  while True:
    tobacco_sem.acquire()    # waits for paper+matches
    smoke()
    agent_sem.release()      # signal agent to place more
\`\`\`

### Why This Problem Matters

The Cigarette Smokers problem teaches:
- **Selective notification**: Waking only the correct thread, not all threads
- **Resource composition**: A thread needs a **combination** of resources, not just one
- **Decoupled coordination**: The agent doesn't know which smoker needs what

### Real-World Analogy

This pattern appears in:
- **Job scheduling**: A task needs CPU + memory + I/O — schedule it when all three are available
- **Assembly lines**: A station needs parts from multiple suppliers
- **Event-driven systems**: A handler activates when a specific combination of events occurs`,
      starterCode: `import threading
import time
import random

# TODO: Implement the Cigarette Smokers problem
# - 1 agent, 3 smokers
# - Agent places 2 of 3 ingredients randomly
# - Correct smoker picks them up and smokes
# - Run for 10 rounds

INGREDIENTS = ["tobacco", "paper", "matches"]

# TODO: Create semaphores for agent and each smoker

def agent():
    """Places two random ingredients on the table"""
    # TODO: For each round, pick 2 ingredients and signal correct smoker
    pass

def smoker(name, has_ingredient):
    """Waits for the two ingredients they're missing"""
    # TODO: Wait for signal, then smoke
    pass

# TODO: Start agent and 3 smoker threads`,
      solutionCode: `import threading
import time
import random

ROUNDS = 10
INGREDIENTS = ["tobacco", "paper", "matches"]

agent_sem = threading.Semaphore(1)
# Each smoker's semaphore — named by the ingredient they HAVE
smoker_sems = {
    "tobacco": threading.Semaphore(0),   # needs paper + matches
    "paper": threading.Semaphore(0),     # needs tobacco + matches
    "matches": threading.Semaphore(0),   # needs tobacco + paper
}
smoke_count = {"tobacco": 0, "paper": 0, "matches": 0}

def agent():
    for round_num in range(ROUNDS):
        agent_sem.acquire()
        # Pick two random ingredients to place
        placed = random.sample(INGREDIENTS, 2)
        missing = [i for i in INGREDIENTS if i not in placed][0]
        print(f"\\n[Agent] Round {round_num + 1}: "
              f"Placed {placed[0]} + {placed[1]} "
              f"(smoker with {missing} should smoke)")
        # Signal the smoker who has the missing ingredient
        smoker_sems[missing].release()

def smoker(has_ingredient):
    while True:
        smoker_sems[has_ingredient].acquire()
        needs = [i for i in INGREDIENTS if i != has_ingredient]
        print(f"  [Smoker-{has_ingredient}] Picked up {needs[0]} + {needs[1]}, smoking...")
        time.sleep(random.uniform(0.1, 0.3))
        smoke_count[has_ingredient] += 1
        print(f"  [Smoker-{has_ingredient}] Done! "
              f"(total smokes: \${smoke_count[has_ingredient]})")
        agent_sem.release()  # Signal agent to place more

# Start smokers as daemon threads
for ingredient in INGREDIENTS:
    t = threading.Thread(target=smoker, args=(ingredient,), daemon=True)
    t.start()

# Run agent in main thread
agent()
time.sleep(1)  # Let last smoker finish

print(f"\\n=== Results after \${ROUNDS} rounds ===")
for ingredient, count in smoke_count.items():
    print(f"  Smoker with {ingredient}: smoked \${count} times")
print(f"  Total: \${sum(smoke_count.values())} (expected: \${ROUNDS})")`,
    },
  ],
};
