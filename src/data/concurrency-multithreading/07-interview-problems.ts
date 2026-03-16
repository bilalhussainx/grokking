import { Module } from "../types";

export const interviewProblemsModule: Module = {
  id: "concurrency-interview",
  title: "Concurrency Interview Problems",
  description: "Solve the most common concurrency problems from coding interviews: ordering, synchronization barriers, and thread-safe data structures.",
  lessons: [
    {
      id: "interview-print-order",
      slug: "interview-print-order",
      title: "Print in Order",
      content: `## Print in Order (LeetCode 1114)

Three different threads call \`first()\`, \`second()\`, and \`third()\` respectively. Regardless of the order in which the threads are started, ensure the output is always \`"firstsecondthird"\`.

### Problem Setup

\`\`\`
Thread A calls: first()   → prints "first"
Thread B calls: second()  → prints "second"
Thread C calls: third()   → prints "third"

Threads start in RANDOM order. Output must ALWAYS be:
  "firstsecondthird"
\`\`\`

### Why This Is Tricky

Without synchronization, the output depends on which thread the OS schedules first:

\`\`\`
Possible outputs without sync:
  "firstsecondthird"  ✓ (lucky)
  "secondfirstthird"  ✗
  "thirdfirstsecond"  ✗
  "secondthirdfirst"  ✗
\`\`\`

### Solution: Events (Barriers)

Use \`threading.Event\` objects as gates. An Event starts as "not set" (gate closed). When a thread calls \`event.set()\`, it opens the gate for any thread waiting on \`event.wait()\`.

\`\`\`
Timeline:
  first():  print("first") → set(event_1) ──────────────────
  second(): ── wait(event_1) → print("second") → set(event_2)
  third():  ──────────── wait(event_2) → print("third") ────
\`\`\`

### How Events Work

| Method | Description |
|--------|-------------|
| \`Event()\` | Creates an event (initially not set) |
| \`event.wait()\` | Blocks until the event is set |
| \`event.set()\` | Sets the event, unblocking all waiters |
| \`event.is_set()\` | Returns True if the event is set |
| \`event.clear()\` | Resets the event (gate closes again) |

### Alternative Solutions

**Locks**: Use two locks, both initially acquired. \`second()\` waits on lock_1, \`third()\` waits on lock_2. \`first()\` releases lock_1 after printing, \`second()\` releases lock_2 after printing.

**Condition variable**: Use a shared state variable. Threads wait on the condition until the state indicates it's their turn.

**Semaphores**: Initialize semaphores to 0. \`second()\` acquires sem_1 (blocks until \`first()\` releases it). Same for \`third()\` with sem_2.

### Complexity

- **Time**: O(1) per thread (just print and signal)
- **Space**: O(1) — two Event objects
- **Key insight**: We need N-1 synchronization points for N ordered steps

### Interview Tip

This problem tests whether you understand **ordering constraints** in concurrent code. The Event solution is the cleanest and most readable. Always explain why you chose your synchronization primitive.`,
      starterCode: `import threading

# TODO: Implement the Foo class so that three threads always
# print "firstsecondthird" regardless of start order

class Foo:
    def __init__(self):
        # TODO: Create synchronization primitives
        pass

    def first(self, print_func):
        """Called by Thread A"""
        # TODO: Print "first", then signal second can proceed
        print_func("first")

    def second(self, print_func):
        """Called by Thread B"""
        # TODO: Wait for first to complete, print "second",
        #       then signal third can proceed
        print_func("second")

    def third(self, print_func):
        """Called by Thread C"""
        # TODO: Wait for second to complete, print "third"
        print_func("third")

# Test with random thread ordering
import random

def test_print_order():
    output = []
    foo = Foo()

    def print_func(s):
        output.append(s)

    threads = [
        threading.Thread(target=foo.first, args=(print_func,)),
        threading.Thread(target=foo.second, args=(print_func,)),
        threading.Thread(target=foo.third, args=(print_func,)),
    ]
    random.shuffle(threads)  # Random start order!
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    return "".join(output)

# TODO: Run 10 tests and verify all produce "firstsecondthird"
for i in range(10):
    result = test_print_order()
    print(f"Test {i+1}: {result}")`,
      solutionCode: `import threading
import random

class Foo:
    def __init__(self):
        self.event_first = threading.Event()
        self.event_second = threading.Event()

    def first(self, print_func):
        print_func("first")
        self.event_first.set()  # Signal: first is done

    def second(self, print_func):
        self.event_first.wait()  # Wait for first to complete
        print_func("second")
        self.event_second.set()  # Signal: second is done

    def third(self, print_func):
        self.event_second.wait()  # Wait for second to complete
        print_func("third")

# Test with random thread ordering
def test_print_order():
    output = []
    foo = Foo()

    def print_func(s):
        output.append(s)

    threads = [
        threading.Thread(target=foo.first, args=(print_func,)),
        threading.Thread(target=foo.second, args=(print_func,)),
        threading.Thread(target=foo.third, args=(print_func,)),
    ]
    random.shuffle(threads)
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    return "".join(output)

print("Print in Order — 10 random-order tests:")
all_pass = True
for i in range(10):
    result = test_print_order()
    status = "PASS" if result == "firstsecondthird" else "FAIL"
    if status == "FAIL":
        all_pass = False
    print(f"  Test \${i+1}: {result} [{status}]")

print(f"\\nAll tests passed: \${all_pass}")`
    },
    {
      id: "interview-foobar",
      slug: "interview-foobar",
      title: "Print FooBar Alternately",
      content: `## Print FooBar Alternately (LeetCode 1115)

Two threads share a \`FooBar\` instance. Thread A calls \`foo()\` and Thread B calls \`bar()\`. Ensure the output is always \`"foobarfoobarfoobar..."\` for \`n\` repetitions.

### Problem Setup

\`\`\`
n = 3

Thread A: foo() foo() foo()  → prints "foo" three times
Thread B: bar() bar() bar()  → prints "bar" three times

Required output: "foobarfoobar foobar"
             NOT: "foofoobarbar..." or "barfoobarfoo..."
\`\`\`

### Synchronization: Alternating Turns

The threads must take **strict turns**: A, B, A, B, A, B. This is a classic producer-consumer synchronization problem.

\`\`\`
Thread A (foo):  ██────██────██────
Thread B (bar):  ──██────██────██──
                 foo bar foo bar foo bar
\`\`\`

### Solution: Two Events (Ping-Pong)

Use two Events as a "ping-pong" mechanism:

\`\`\`
foo_turn (starts set):     ●──○──●──○──●──○
bar_turn (starts not set): ○──●──○──●──○──●

foo(): wait(foo_turn) → print "foo" → set(bar_turn)
bar(): wait(bar_turn) → print "bar" → set(foo_turn)
\`\`\`

### Alternative: Lock-Based

Use a Lock and a boolean flag:

\`\`\`python
lock = Lock()
foo_printed = False

def foo():
    while not foo_printed:
        with lock:
            if not foo_printed:
                print("foo")
                foo_printed = True
\`\`\`

The Event solution is cleaner — no busy waiting, no flag checking.

### Alternative: Semaphore Pair

\`\`\`python
sem_foo = Semaphore(1)  # Starts at 1 — foo goes first
sem_bar = Semaphore(0)  # Starts at 0 — bar waits

def foo():
    sem_foo.acquire()   # Blocks if bar hasn't signaled
    print("foo")
    sem_bar.release()   # Signal bar to go

def bar():
    sem_bar.acquire()   # Blocks until foo signals
    print("bar")
    sem_foo.release()   # Signal foo to go
\`\`\`

### Why Each Approach Works

| Approach | Mechanism | Pros | Cons |
|----------|-----------|------|------|
| Events | Set/wait/clear | Very readable | Must clear after each use |
| Semaphores | Acquire/release | Clean counting | Slightly less intuitive |
| Lock + Condition | Wait/notify | Most flexible | More boilerplate |
| Barrier | N threads sync | Good for N-way | Overkill for 2 threads |

### Complexity

- **Time**: O(n) — each thread loops n times
- **Space**: O(1) — fixed synchronization primitives
- **Key insight**: Alternation = two-phase synchronization, repeated n times

### Generalization

This pattern extends to K threads printing in sequence: use K events (or K semaphores). Thread i waits on event[i] and signals event[(i+1) % K].`,
      starterCode: `import threading

# TODO: Implement FooBar so two threads alternate printing
# "foobar" n times

class FooBar:
    def __init__(self, n):
        self.n = n
        # TODO: Create synchronization primitives

    def foo(self, print_func):
        for _ in range(self.n):
            # TODO: Wait for foo's turn
            print_func("foo")
            # TODO: Signal bar's turn

    def bar(self, print_func):
        for _ in range(self.n):
            # TODO: Wait for bar's turn
            print_func("bar")
            # TODO: Signal foo's turn

# Test
def test_foobar(n):
    output = []
    fb = FooBar(n)

    def print_func(s):
        output.append(s)

    t1 = threading.Thread(target=fb.foo, args=(print_func,))
    t2 = threading.Thread(target=fb.bar, args=(print_func,))
    t2.start()  # Start bar FIRST to prove ordering works
    t1.start()
    t1.join()
    t2.join()
    return "".join(output)

# TODO: Test with n=1, 3, 5 and verify output
for n in [1, 3, 5]:
    result = test_foobar(n)
    expected = "foobar" * n
    print(f"n={n}: {result} [{'PASS' if result == expected else 'FAIL'}]")`,
      solutionCode: `import threading

class FooBar:
    def __init__(self, n):
        self.n = n
        self.foo_event = threading.Event()
        self.bar_event = threading.Event()
        self.foo_event.set()  # foo goes first

    def foo(self, print_func):
        for _ in range(self.n):
            self.foo_event.wait()   # Wait for foo's turn
            self.foo_event.clear()  # Reset for next round
            print_func("foo")
            self.bar_event.set()    # Signal bar's turn

    def bar(self, print_func):
        for _ in range(self.n):
            self.bar_event.wait()   # Wait for bar's turn
            self.bar_event.clear()  # Reset for next round
            print_func("bar")
            self.foo_event.set()    # Signal foo's turn

# Test
def test_foobar(n):
    output = []
    fb = FooBar(n)

    def print_func(s):
        output.append(s)

    t1 = threading.Thread(target=fb.foo, args=(print_func,))
    t2 = threading.Thread(target=fb.bar, args=(print_func,))
    t2.start()  # Start bar FIRST to prove ordering works
    t1.start()
    t1.join()
    t2.join()
    return "".join(output)

print("Print FooBar Alternately:")
all_pass = True
for n in [1, 3, 5, 10]:
    result = test_foobar(n)
    expected = "foobar" * n
    passed = result == expected
    if not passed:
        all_pass = False
    print(f"  n=\${n}: \${result[:30]}{'...' if len(result) > 30 else ''} [{'PASS' if passed else 'FAIL'}]")

print(f"\\nAll tests passed: \${all_pass}")`
    },
    {
      id: "interview-h2o",
      slug: "interview-h2o",
      title: "Building H2O",
      content: `## Building H2O (LeetCode 1117)

There are two kinds of threads: hydrogen and oxygen. Your goal is to group them into water molecules. Each water molecule requires exactly **2 hydrogen threads** and **1 oxygen thread** to bond together.

### Problem Setup

\`\`\`
Input threads:  H  H  O  H  H  O  H  H  O  ...

Must group as:  [H H O] [H H O] [H H O]
                  H2O     H2O     H2O

Each group of 3 threads must "bond" together before
any thread in the group can proceed.
\`\`\`

### Constraints

1. If a hydrogen thread arrives and no oxygen is available, it must **wait**
2. If an oxygen thread arrives and fewer than 2 hydrogens are available, it must **wait**
3. Exactly 2 hydrogen + 1 oxygen must bond simultaneously

### Solution: Barrier + Semaphores

Use **Semaphores** to count available atoms and a **Barrier** to synchronize the bonding:

\`\`\`
Semaphore hydrogen_sem(2): allows 2 H threads to proceed
Semaphore oxygen_sem(1):   allows 1 O thread to proceed
Barrier(3):                all 3 must arrive before any proceeds

H thread: acquire(hydrogen_sem) → barrier.wait() → bond → release
O thread: acquire(oxygen_sem) → barrier.wait() → bond → release
\`\`\`

### Step-by-Step

\`\`\`
State: hydrogen_sem=2, oxygen_sem=1

H1 arrives: acquire H_sem (now 1) → wait at barrier [H1 | _ | _]
O1 arrives: acquire O_sem (now 0) → wait at barrier [H1 | O1 | _]
H2 arrives: acquire H_sem (now 0) → barrier complete! [H1 | O1 | H2]
            All 3 proceed → bond! → release semaphores

H3 arrives: acquire H_sem (now 1) → wait at barrier (new group)
H4 arrives: acquire H_sem (now 0) → wait at barrier
O2 arrives: acquire O_sem (now 0) → barrier complete!
\`\`\`

### threading.Barrier

A \`Barrier(n)\` blocks until exactly \`n\` threads are waiting, then releases all of them simultaneously:

\`\`\`python
barrier = threading.Barrier(3)

# Each thread:
barrier.wait()  # Blocks until 3 threads are waiting
# All 3 released at once
\`\`\`

| Method | Description |
|--------|-------------|
| \`Barrier(n)\` | Create barrier for n threads |
| \`barrier.wait()\` | Block until n threads are waiting |
| \`barrier.reset()\` | Reset the barrier |
| \`barrier.abort()\` | Put barrier in broken state |

### Why Not Just a Lock?

A Lock only provides mutual exclusion (1 thread at a time). We need to synchronize **exactly 3 threads** in a specific ratio (2:1). This requires counting (Semaphores) + group synchronization (Barrier).

### Complexity

- **Time**: O(1) per thread (acquire, wait, release)
- **Space**: O(1) — fixed number of primitives
- **Key insight**: Semaphores enforce the 2:1 ratio, Barrier ensures simultaneous bonding`,
      starterCode: `import threading
import time
import random

# TODO: Implement H2O so hydrogen and oxygen threads
# bond in groups of exactly 2H + 1O

class H2O:
    def __init__(self):
        # TODO: Create semaphores for H (max 2) and O (max 1)
        # TODO: Create a barrier for 3 threads
        pass

    def hydrogen(self, bond_func):
        """Called by each hydrogen thread"""
        # TODO: Acquire hydrogen semaphore
        # TODO: Wait at barrier
        # TODO: Bond
        # TODO: Release semaphore for next group
        bond_func("H")

    def oxygen(self, bond_func):
        """Called by each oxygen thread"""
        # TODO: Acquire oxygen semaphore
        # TODO: Wait at barrier
        # TODO: Bond
        # TODO: Release semaphore for next group
        bond_func("O")

# Test
def test_h2o(n_molecules):
    h2o = H2O()
    output = []
    lock = threading.Lock()

    def bond(atom):
        with lock:
            output.append(atom)

    threads = []
    for _ in range(n_molecules):
        threads.append(threading.Thread(target=h2o.hydrogen, args=(bond,)))
        threads.append(threading.Thread(target=h2o.hydrogen, args=(bond,)))
        threads.append(threading.Thread(target=h2o.oxygen, args=(bond,)))

    random.shuffle(threads)
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    return "".join(output)

# TODO: Test with 3 molecules (9 threads) and verify valid grouping
result = test_h2o(3)
print(f"Output: {result}")`,
      solutionCode: `import threading
import random

class H2O:
    def __init__(self):
        self.h_sem = threading.Semaphore(2)  # Allow 2 hydrogen
        self.o_sem = threading.Semaphore(1)  # Allow 1 oxygen
        self.barrier = threading.Barrier(3)  # Wait for all 3

    def hydrogen(self, bond_func):
        self.h_sem.acquire()
        self.barrier.wait()     # Wait for 2H + 1O
        bond_func("H")
        self.h_sem.release()    # Open slot for next molecule

    def oxygen(self, bond_func):
        self.o_sem.acquire()
        self.barrier.wait()     # Wait for 2H + 1O
        bond_func("O")
        self.o_sem.release()    # Open slot for next molecule

def test_h2o(n_molecules):
    h2o = H2O()
    output = []
    lock = threading.Lock()

    def bond(atom):
        with lock:
            output.append(atom)

    threads = []
    for _ in range(n_molecules):
        threads.append(threading.Thread(target=h2o.hydrogen, args=(bond,)))
        threads.append(threading.Thread(target=h2o.hydrogen, args=(bond,)))
        threads.append(threading.Thread(target=h2o.oxygen, args=(bond,)))

    random.shuffle(threads)
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    return "".join(output)

def validate(result):
    """Check that every group of 3 is a valid H2O molecule"""
    if len(result) % 3 != 0:
        return False
    h_count = result.count("H")
    o_count = result.count("O")
    return h_count == 2 * o_count  # 2:1 ratio

print("Building H2O — Thread Synchronization:")
all_pass = True
for n in [1, 3, 5, 10]:
    result = test_h2o(n)
    valid = validate(result)
    if not valid:
        all_pass = False
    print(f"  \${n} molecules (\${n*3} threads): \${result[:30]}{'...' if len(result) > 30 else ''}")
    print(f"    H=\${result.count('H')}, O=\${result.count('O')}, Valid=\${valid}")

print(f"\\nAll tests passed: \${all_pass}")`
    },
    {
      id: "interview-traffic-light",
      slug: "interview-traffic-light",
      title: "Traffic Light Controller",
      content: `## Traffic Light Controller (LeetCode 1279)

A traffic intersection has two roads (A and B). Cars arrive from both directions. Only **one road** can have a green light at any time. Design a traffic light controller that prevents collisions.

### Problem Setup

\`\`\`
        Road A
          │
    ──────┼──────  Road B
          │

Rules:
  1. Only one road has green at a time
  2. Cars on a red road must WAIT
  3. When a car arrives and its road is green, it passes immediately
  4. When a car arrives and its road is red, the light must switch
\`\`\`

### Why This Is a Concurrency Problem

Cars arrive as **threads** from random directions at random times. We need **mutual exclusion** — two cars from perpendicular roads must never be in the intersection simultaneously.

### Solution: Lock + State

Track which road is currently green. Use a Lock to make the check-and-switch operation atomic:

\`\`\`
State: green_road = A

Car on A arrives: green_road == A → pass through (no switch needed)
Car on B arrives: green_road != B → switch light → pass through
Car on A arrives: green_road != A → switch light → pass through
\`\`\`

### Key Insight: Minimize Switching

If the light is already green for the arriving car's road, **no switch is needed**. Only switch when a car on the other road arrives. This minimizes state transitions.

\`\`\`
Without optimization:        With optimization:
  Switch for every car         Only switch when road changes
  A→B→A→B→A→B                 A→A→A→B→B→A (fewer switches)
\`\`\`

### Thread Safety Analysis

The critical section is: checking the current green road AND potentially switching it AND allowing the car to pass. All of this must be atomic:

\`\`\`
Thread 1 (Road A):           Thread 2 (Road B):
  lock.acquire()
  check: green == A ✓
  pass through                 lock.acquire() → BLOCKED
  lock.release()
                               check: green == A
                               switch to B
                               pass through
                               lock.release()
\`\`\`

### Starvation Prevention

If cars keep arriving on Road A, Road B cars starve. Solutions:
- **Maximum green time**: Force a switch after N cars or T seconds
- **Fairness flag**: Alternate priority when both roads have waiting cars
- **Queue-based**: Process in arrival order

### Real-World Extensions

| Extension | Description |
|-----------|-------------|
| Left turns | Separate phases for turning traffic |
| Pedestrians | Walk signals with their own phase |
| Sensors | Adaptive timing based on traffic density |
| Emergency | Preempt all lights for emergency vehicles |
| Multi-intersection | Coordinate adjacent lights for green waves |

### Complexity

- **Time**: O(1) per car (lock acquire, check, optional switch, release)
- **Space**: O(1) — one lock, one state variable
- **Key insight**: This is mutual exclusion with state — only one "direction" can be active`,
      starterCode: `import threading
import time
import random

# TODO: Implement a thread-safe traffic light controller
# 1. TrafficLight class tracking which road is green
# 2. car_arrived(car_id, road, direction) — thread-safe passage
# 3. Only switch the light when a car on the other road arrives
# 4. Print each car's passage and any light switches

class TrafficLight:
    def __init__(self):
        # TODO: Initialize green road (start with road A)
        # TODO: Create a lock for thread safety
        pass

    def car_arrived(self, car_id, road, direction):
        """
        car_id: unique identifier
        road: "A" or "B"
        direction: for display only (e.g., "North", "East")
        """
        # TODO: Acquire lock
        # TODO: Switch light if needed
        # TODO: Let car pass through
        # TODO: Release lock
        pass

# Test
light = TrafficLight()
cars = [
    (1, "A", "North"), (2, "A", "South"),
    (3, "B", "East"),  (4, "B", "West"),
    (5, "A", "North"), (6, "B", "East"),
    (7, "A", "South"), (8, "A", "North"),
    (9, "B", "West"),  (10, "B", "East"),
]

# TODO: Create threads for each car with slight random delays
# TODO: Start all threads and join them`,
      solutionCode: `import threading
import time
import random

class TrafficLight:
    def __init__(self):
        self.green_road = "A"  # Road A starts green
        self.lock = threading.Lock()
        self.switches = 0

    def car_arrived(self, car_id, road, direction):
        with self.lock:
            if self.green_road != road:
                print(f"  ** Light switch: Road \${self.green_road} → "
                      f"Road \${road} **")
                self.green_road = road
                self.switches += 1
            print(f"  Car \${car_id:2d} on Road \${road} (\${direction:5s}) "
                  f"→ passed through (green)")

light = TrafficLight()
cars = [
    (1, "A", "North"), (2, "A", "South"),
    (3, "B", "East"),  (4, "B", "West"),
    (5, "A", "North"), (6, "B", "East"),
    (7, "A", "South"), (8, "A", "North"),
    (9, "B", "West"),  (10, "B", "East"),
]

def car_thread(car_id, road, direction):
    time.sleep(random.uniform(0, 0.1))  # Random arrival time
    light.car_arrived(car_id, road, direction)

print("Traffic Light Controller")
print(f"Initial: Road A is green\\n")

threads = [threading.Thread(target=car_thread, args=car)
           for car in cars]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"\\n\${len(cars)} cars passed safely")
print(f"Light switched \${light.switches} times")
print(f"No collisions — mutual exclusion guaranteed")`
    },
    {
      id: "interview-blocking-queue",
      slug: "interview-blocking-queue",
      title: "Thread-Safe Bounded Blocking Queue",
      content: `## Thread-Safe Bounded Blocking Queue (LeetCode 1188)

Implement a thread-safe bounded blocking queue with these operations:
- \`enqueue(element)\`: Add to the back. Block if full.
- \`dequeue()\`: Remove from front. Block if empty.
- \`size()\`: Return current element count.

### Why This Matters

The bounded blocking queue is the **fundamental building block** of producer-consumer systems. It appears everywhere: thread pools, message queues, pipeline processing, and request buffering.

### Blocking Behavior

\`\`\`
Bounded Queue (capacity=3):

enqueue(A): [A _ _]         ← room available, proceed
enqueue(B): [A B _]         ← room available, proceed
enqueue(C): [A B C]         ← full!
enqueue(D): BLOCKS...       ← waits until space available
             dequeue() → A
             [B C _]        ← space freed!
enqueue(D): [B C D]         ← unblocked, proceeds

dequeue():  [C D _] → B
dequeue():  [D _ _] → C
dequeue():  [_ _ _] → D
dequeue():  BLOCKS...       ← empty, waits for enqueue
\`\`\`

### Solution: Lock + Two Conditions

We need two conditions:
1. **not_full**: Producers wait here when the queue is full
2. **not_empty**: Consumers wait here when the queue is empty

\`\`\`
Producer:                    Consumer:
  acquire lock                 acquire lock
  while full:                  while empty:
    wait(not_full)               wait(not_empty)
  add element                  remove element
  notify(not_empty)            notify(not_full)
  release lock                 release lock
\`\`\`

### Why \`while\` Instead of \`if\`?

Always use \`while\` to re-check the condition after waking up:

\`\`\`python
# WRONG — spurious wakeup can cause bugs
if queue_is_full:
    not_full.wait()
# Queue might still be full! Another thread could have filled it.

# CORRECT — re-check after waking
while queue_is_full:
    not_full.wait()
# Guaranteed: queue is NOT full when we exit the loop
\`\`\`

**Spurious wakeups** can occur on some platforms — the OS may wake a thread even when no notify was called. The \`while\` loop handles this safely.

### Alternative: Semaphore Pair

Use two counting semaphores:

\`\`\`python
empty_slots = Semaphore(capacity)  # Tracks available space
full_slots = Semaphore(0)          # Tracks available items
mutex = Lock()                      # Protects the queue

def enqueue(item):
    empty_slots.acquire()  # Wait for space (blocks if 0)
    with mutex:
        queue.append(item)
    full_slots.release()   # Signal: one more item available

def dequeue():
    full_slots.acquire()   # Wait for item (blocks if 0)
    with mutex:
        item = queue.popleft()
    empty_slots.release()  # Signal: one more space available
    return item
\`\`\`

### Complexity

- **Time**: O(1) amortized for enqueue/dequeue (excluding wait time)
- **Space**: O(capacity)
- **Key insight**: Two conditions (not_full, not_empty) handle the dual blocking requirement`,
      starterCode: `import threading
import time
import random
from collections import deque

# TODO: Implement BoundedBlockingQueue
# 1. Thread-safe with Lock + Condition (or Semaphores)
# 2. enqueue() blocks when full
# 3. dequeue() blocks when empty
# 4. size() returns current count

class BoundedBlockingQueue:
    def __init__(self, capacity):
        # TODO: Initialize queue, capacity, lock, conditions
        pass

    def enqueue(self, element):
        # TODO: Block if full, add element, notify consumers
        pass

    def dequeue(self):
        # TODO: Block if empty, remove element, notify producers
        pass

    def size(self):
        # TODO: Return current element count (thread-safe)
        pass

# Test with producers and consumers
def test_blocking_queue():
    q = BoundedBlockingQueue(5)

    def producer(pid, count):
        for i in range(count):
            item = f"P{pid}-{i}"
            q.enqueue(item)
            time.sleep(random.uniform(0.01, 0.05))

    def consumer(cid, count):
        for _ in range(count):
            item = q.dequeue()
            time.sleep(random.uniform(0.02, 0.08))

    # TODO: Create 3 producers (5 items each) and 3 consumers (5 items each)
    # TODO: Start all threads, join all, verify queue is empty

test_blocking_queue()`,
      solutionCode: `import threading
import time
import random
from collections import deque

class BoundedBlockingQueue:
    def __init__(self, capacity):
        self.capacity = capacity
        self.queue = deque()
        self.lock = threading.Lock()
        self.not_full = threading.Condition(self.lock)
        self.not_empty = threading.Condition(self.lock)

    def enqueue(self, element):
        with self.not_full:
            while len(self.queue) >= self.capacity:
                self.not_full.wait()  # Block until space available
            self.queue.append(element)
            self.not_empty.notify()   # Wake a waiting consumer

    def dequeue(self):
        with self.not_empty:
            while len(self.queue) == 0:
                self.not_empty.wait()  # Block until item available
            element = self.queue.popleft()
            self.not_full.notify()     # Wake a waiting producer
            return element

    def size(self):
        with self.lock:
            return len(self.queue)

# Test
q = BoundedBlockingQueue(5)
produced = []
consumed = []
p_lock = threading.Lock()
c_lock = threading.Lock()

def producer(pid, count):
    for i in range(count):
        item = f"P\${pid}-\${i}"
        q.enqueue(item)
        with p_lock:
            produced.append(item)
        name = threading.current_thread().name
        print(f"  [\${name}] Produced: \${item} (queue size: \${q.size()})")
        time.sleep(random.uniform(0.01, 0.05))

def consumer(cid, count):
    for _ in range(count):
        item = q.dequeue()
        with c_lock:
            consumed.append(item)
        name = threading.current_thread().name
        print(f"  [\${name}] Consumed: \${item} (queue size: \${q.size()})")
        time.sleep(random.uniform(0.02, 0.08))

print("Bounded Blocking Queue (capacity=5)")
print("3 producers x 5 items, 3 consumers x 5 items\\n")

threads = []
for i in range(3):
    threads.append(threading.Thread(target=producer, args=(i, 5),
                                    name=f"Prod-\${i}"))
    threads.append(threading.Thread(target=consumer, args=(i, 5),
                                    name=f"Cons-\${i}"))

for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"\\nProduced: \${len(produced)} items")
print(f"Consumed: \${len(consumed)} items")
print(f"Queue empty: \${q.size() == 0}")
print(f"All items accounted for: \${sorted(produced) == sorted(consumed)}")`
    },
    {
      id: "interview-web-crawler",
      slug: "interview-web-crawler",
      title: "Web Crawler Multithreaded",
      content: `## Web Crawler Multithreaded (LeetCode 1242)

Given a starting URL, crawl all pages under the same hostname using multiple threads. Each URL should be visited exactly once. Return all URLs found.

### Problem Setup

\`\`\`
Start: "http://news.example.com/page1"

page1 links to: [page2, page3, external.com/x]
page2 links to: [page1, page3]
page3 links to: [page1]

Result: [page1, page2, page3]
        (external.com excluded — different hostname)
\`\`\`

### Challenges

1. **Multiple threads** crawl simultaneously — must avoid visiting the same URL twice
2. **Thread-safe visited set** — checking and adding must be atomic
3. **Same-hostname filter** — only follow links within the starting domain
4. **Termination** — how do threads know when all work is done?

### Solution: Thread Pool + Synchronized Set

\`\`\`
┌──────────────────────────────────┐
│  Visited Set (thread-safe)       │
│  {page1, page2, page3}          │
└──────────────────────────────────┘
         ▲ check + add (atomic)
         │
┌────────┼─────────────────────────┐
│  URL Queue                       │
│  [page2, page3]                  │
└──────┬───────┬───────────────────┘
       │       │
   ┌───▼──┐ ┌──▼───┐
   │ T1   │ │ T2   │  Worker threads
   │ crawl│ │ crawl│  fetch page, extract links
   └──────┘ └──────┘  add new URLs to queue
\`\`\`

### Thread-Safe Visited Check

The check-and-add operation must be atomic to prevent duplicate visits:

\`\`\`
RACE CONDITION:
  Thread 1: "page2" in visited? NO → (context switch)
  Thread 2: "page2" in visited? NO → visit page2
  Thread 1: visit page2 ← DUPLICATE!

FIX (with lock):
  Thread 1: lock → "page2" in visited? NO → add "page2" → unlock → visit
  Thread 2: lock → "page2" in visited? YES → unlock → skip
\`\`\`

### Termination Detection

The trickiest part: how to know when crawling is complete?

**Approach 1 — Queue-based**: Use a \`Queue\` with \`task_done()\`. Main thread calls \`queue.join()\` which blocks until all tasks are processed.

**Approach 2 — Active counter**: Track in-progress crawls. When counter reaches 0 and queue is empty, all work is done.

**Approach 3 — ThreadPoolExecutor**: Submit futures, collect results with \`as_completed()\`.

### Same-Hostname Check

\`\`\`python
from urllib.parse import urlparse

def same_host(url, start_url):
    return urlparse(url).hostname == urlparse(start_url).hostname
\`\`\`

### Performance Considerations

| Factor | Impact |
|--------|--------|
| Thread count | More threads = more parallelism, but more memory |
| Rate limiting | Respect robots.txt, add delays between requests |
| Queue type | FIFO (BFS) vs LIFO (DFS) — BFS preferred for breadth coverage |
| Connection reuse | HTTP keep-alive reduces connection overhead |

### Complexity

- **Time**: O(V + E) where V = pages, E = links (same as BFS)
- **Space**: O(V) for the visited set
- **Parallelism**: Up to N pages crawled simultaneously with N threads

### Interview Tips

1. Start with the single-threaded BFS solution, then add threading
2. Emphasize the atomic check-and-add on the visited set
3. Discuss termination detection — this is where candidates struggle
4. Mention rate limiting and politeness as real-world concerns`,
      starterCode: `import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse
from collections import deque

# Simulated web — no real HTTP needed
WEB_GRAPH = {
    "http://example.com/": ["http://example.com/about", "http://example.com/blog", "http://external.com"],
    "http://example.com/about": ["http://example.com/", "http://example.com/team"],
    "http://example.com/blog": ["http://example.com/", "http://example.com/blog/post1", "http://example.com/blog/post2"],
    "http://example.com/team": ["http://example.com/about"],
    "http://example.com/blog/post1": ["http://example.com/blog"],
    "http://example.com/blog/post2": ["http://example.com/blog", "http://example.com/about"],
}

def get_links(url):
    """Simulate fetching a page and extracting links"""
    import time
    time.sleep(0.1)  # Simulate network delay
    return WEB_GRAPH.get(url, [])

# TODO: Implement a multithreaded web crawler
# 1. Start from a given URL
# 2. Only crawl URLs with the same hostname
# 3. Visit each URL exactly once (thread-safe visited set)
# 4. Use a thread pool for parallel crawling
# 5. Return all visited URLs

class MultithreadedCrawler:
    def __init__(self, max_workers=4):
        # TODO: Initialize visited set, lock, and thread pool size
        pass

    def crawl(self, start_url):
        """Crawl all pages reachable from start_url on the same host"""
        # TODO: Implement BFS with thread pool
        pass

    def _same_host(self, url, start_url):
        """Check if url has the same hostname as start_url"""
        # TODO: Compare hostnames
        pass

# TODO: Crawl from "http://example.com/" and print all found URLs
crawler = MultithreadedCrawler(max_workers=4)
urls = crawler.crawl("http://example.com/")
print(f"Found {len(urls)} URLs")`,
      solutionCode: `import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse

# Simulated web graph
WEB_GRAPH = {
    "http://example.com/": ["http://example.com/about", "http://example.com/blog", "http://external.com"],
    "http://example.com/about": ["http://example.com/", "http://example.com/team"],
    "http://example.com/blog": ["http://example.com/", "http://example.com/blog/post1", "http://example.com/blog/post2"],
    "http://example.com/team": ["http://example.com/about"],
    "http://example.com/blog/post1": ["http://example.com/blog"],
    "http://example.com/blog/post2": ["http://example.com/blog", "http://example.com/about"],
}

def get_links(url):
    time.sleep(0.1)  # Simulate network delay
    return WEB_GRAPH.get(url, [])

class MultithreadedCrawler:
    def __init__(self, max_workers=4):
        self.max_workers = max_workers
        self.visited = set()
        self.lock = threading.Lock()
        self.result = []
        self.result_lock = threading.Lock()

    def _same_host(self, url, start_url):
        return urlparse(url).hostname == urlparse(start_url).hostname

    def _try_mark_visited(self, url):
        """Atomic check-and-add. Returns True if newly visited."""
        with self.lock:
            if url in self.visited:
                return False
            self.visited.add(url)
            return True

    def _crawl_page(self, url, start_url):
        """Crawl a single page, return new URLs to visit"""
        thread = threading.current_thread().name
        print(f"  [\${thread}] Crawling: \${url}")
        links = get_links(url)
        new_urls = []
        for link in links:
            if self._same_host(link, start_url) and self._try_mark_visited(link):
                new_urls.append(link)
        return new_urls

    def crawl(self, start_url):
        self._try_mark_visited(start_url)
        queue = [start_url]

        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            while queue:
                # Submit all URLs in current batch
                futures = {
                    executor.submit(self._crawl_page, url, start_url): url
                    for url in queue
                }
                queue = []  # Reset for next batch

                # Collect results
                for future in as_completed(futures):
                    new_urls = future.result()
                    queue.extend(new_urls)

        return sorted(self.visited)

# Run the crawler
print("Multithreaded Web Crawler")
print(f"Starting from: http://example.com/\\n")

start = time.time()
crawler = MultithreadedCrawler(max_workers=4)
urls = crawler.crawl("http://example.com/")
elapsed = time.time() - start

print(f"\\nCrawl complete in \${elapsed:.2f}s")
print(f"Found \${len(urls)} URLs:")
for url in urls:
    print(f"  \${url}")

# Sequential comparison
seq_time = len(urls) * 0.1
print(f"\\nSequential would take: ~\${seq_time:.2f}s")
print(f"Parallel speedup: ~\${seq_time / elapsed:.1f}x")`
    }
  ]
};
