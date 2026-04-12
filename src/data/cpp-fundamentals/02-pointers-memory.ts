import { Module } from "../types";

export const cppPointersMemoryModule: Module = {
  id: "cpp-pointers-memory",
  title: "Pointers & Memory Management",
  description: "Understand pointers, references, and memory management — the heart of C++ — through Python simulations.",
  lessons: [
    {
      id: "cpp-pointers-intro",
      slug: "cpp-pointers-intro",
      title: "Introduction to Pointers",
      content: `## Pointers and References in C++

### What Is a Pointer?

A pointer is a variable that stores the **memory address** of another variable.

\`\`\`cpp
int x = 42;
int* ptr = &x;    // ptr holds the address of x

std::cout << x;      // 42 — the value
std::cout << &x;     // 0x7fff5c — the address
std::cout << ptr;    // 0x7fff5c — same address
std::cout << *ptr;   // 42 — dereferencing the pointer
\`\`\`

### References vs Pointers

\`\`\`cpp
int x = 42;
int& ref = x;    // reference — an alias for x
int* ptr = &x;   // pointer — stores address of x

ref = 100;        // changes x to 100
*ptr = 200;       // changes x to 200
\`\`\`

| Feature | Pointer | Reference |
|---------|---------|-----------|
| Can be null | Yes | No |
| Can be reassigned | Yes | No |
| Syntax | \`*ptr\` to access | Direct use |
| Address-of | \`&var\` to get | Implicit |

### Why Pointers Matter

- **Dynamic memory** — allocate data at runtime
- **Data structures** — linked lists, trees, graphs
- **Polymorphism** — base class pointers to derived objects
- **Efficiency** — pass large objects by pointer instead of copying

### Memory Dangers

\`\`\`cpp
int* p = new int(42);
delete p;            // freed
*p = 10;             // UNDEFINED BEHAVIOR — dangling pointer!

int* q = nullptr;
*q = 5;              // SEGFAULT — null pointer dereference!
\`\`\`

Python handles all of this automatically with garbage collection and references. In the following exercises, we will simulate pointer behavior in Python.`,
    },
    {
      id: "cpp-pointer-simulator",
      slug: "cpp-pointer-simulator",
      title: "Pointer Simulator",
      content: `## Simulating Pointers in Python

### The Concept

In C++, a pointer is just an address. Dereferencing reads/writes the value at that address. We can simulate this with a memory dictionary.

### Your Task

Build a \`PointerSimulator\` with:
- A simulated memory (dictionary of address -> value)
- Ability to create variables, take their address, dereference pointers
- Null pointer detection and dangling pointer detection`,
      starterCode: `# C++ equivalent:
# int x = 42;
# int* p = &x;
# *p = 100;  // x is now 100
# int** pp = &p;  // pointer to pointer

class Pointer:
    """Represents a C++ pointer."""
    def __init__(self, address, memory):
        # TODO: Store address and reference to memory
        pass

    def deref(self):
        """Dereference: return the value at the pointed-to address (*ptr)."""
        # TODO: Return value, raise error for null/dangling
        pass

    def deref_set(self, value):
        """Set value at pointed-to address (*ptr = value)."""
        # TODO
        pass

    def is_null(self) -> bool:
        # TODO
        pass


class PointerSimulator:
    """Simulates C++ pointer operations with a virtual memory space."""

    def __init__(self):
        # TODO: Initialize memory dict, address counter
        pass

    def create_var(self, name: str, value) -> int:
        """Create a named variable in memory. Returns its address."""
        # TODO
        pass

    def address_of(self, name: str) -> Pointer:
        """Get pointer to a named variable (&var)."""
        # TODO
        pass

    def new(self, value) -> Pointer:
        """Heap allocation (like C++ new). Returns pointer."""
        # TODO
        pass

    def delete(self, ptr: Pointer):
        """Free heap memory (like C++ delete)."""
        # TODO
        pass

    def nullptr(self) -> Pointer:
        """Return a null pointer."""
        # TODO
        pass

    def read_memory(self, address: int):
        """Read raw memory at address."""
        # TODO
        pass


# Test cases
sim = PointerSimulator()

# Create variables
sim.create_var("x", 42)
sim.create_var("y", 100)

# Get pointer to x
px = sim.address_of("x")
print(px.deref())         # Expected: 42

# Modify through pointer (*px = 99)
px.deref_set(99)
print(px.deref())         # Expected: 99

# Heap allocation
p = sim.new(3.14)
print(p.deref())          # Expected: 3.14

# Delete and dangling pointer
sim.delete(p)
try:
    p.deref()
except RuntimeError as e:
    print(e)              # Expected: Dangling pointer

# Null pointer
null = sim.nullptr()
print(null.is_null())     # Expected: True
try:
    null.deref()
except RuntimeError as e:
    print(e)              # Expected: Null pointer dereference
`,
      solutionCode: `# C++ equivalent:
# int x = 42;
# int* p = &x;
# *p = 100;  // x is now 100
# int** pp = &p;  // pointer to pointer

class Pointer:
    """Represents a C++ pointer."""
    def __init__(self, address, memory):
        self._address = address
        self._memory = memory

    def deref(self):
        """Dereference: return the value at the pointed-to address (*ptr)."""
        if self._address is None:
            raise RuntimeError("Null pointer dereference")
        if self._address not in self._memory:
            raise RuntimeError("Dangling pointer")
        return self._memory[self._address]

    def deref_set(self, value):
        """Set value at pointed-to address (*ptr = value)."""
        if self._address is None:
            raise RuntimeError("Null pointer dereference")
        if self._address not in self._memory:
            raise RuntimeError("Dangling pointer")
        self._memory[self._address] = value

    def is_null(self) -> bool:
        return self._address is None


class PointerSimulator:
    """Simulates C++ pointer operations with a virtual memory space."""

    def __init__(self):
        self._memory = {}
        self._next_addr = 1000
        self._names = {}  # name -> address

    def create_var(self, name: str, value) -> int:
        addr = self._next_addr
        self._next_addr += 1
        self._memory[addr] = value
        self._names[name] = addr
        return addr

    def address_of(self, name: str) -> Pointer:
        if name not in self._names:
            raise KeyError(f"Variable '{name}' not found")
        return Pointer(self._names[name], self._memory)

    def new(self, value) -> Pointer:
        addr = self._next_addr
        self._next_addr += 1
        self._memory[addr] = value
        return Pointer(addr, self._memory)

    def delete(self, ptr: Pointer):
        if ptr._address is None:
            raise RuntimeError("Cannot delete null pointer")
        if ptr._address not in self._memory:
            raise RuntimeError("Double free detected")
        del self._memory[ptr._address]

    def nullptr(self) -> Pointer:
        return Pointer(None, self._memory)

    def read_memory(self, address: int):
        if address not in self._memory:
            raise RuntimeError(f"Invalid memory access at address {address}")
        return self._memory[address]


# Test cases
sim = PointerSimulator()

# Create variables
sim.create_var("x", 42)
sim.create_var("y", 100)

# Get pointer to x
px = sim.address_of("x")
print(px.deref())         # Expected: 42

# Modify through pointer (*px = 99)
px.deref_set(99)
print(px.deref())         # Expected: 99

# Heap allocation
p = sim.new(3.14)
print(p.deref())          # Expected: 3.14

# Delete and dangling pointer
sim.delete(p)
try:
    p.deref()
except RuntimeError as e:
    print(e)              # Expected: Dangling pointer

# Null pointer
null = sim.nullptr()
print(null.is_null())     # Expected: True
try:
    null.deref()
except RuntimeError as e:
    print(e)              # Expected: Null pointer dereference
`,
    },
    {
      id: "cpp-linked-list",
      slug: "cpp-linked-list-manual-memory",
      title: "Linked List with Manual Memory",
      content: `## Linked List with Manual Memory Management

### C++ Linked List

In C++, linked lists require manual \`new\`/\`delete\`:

\`\`\`cpp
struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

Node* head = new Node(1);
head->next = new Node(2);
head->next->next = new Node(3);

// Must manually delete every node or leak memory!
\`\`\`

### Your Task

Implement a linked list where each node is manually "allocated" and "freed" through a memory manager. Track allocations and detect leaks on destruction.`,
      starterCode: `# C++ equivalent:
# struct Node { int data; Node* next; };
# Node* head = new Node(1);
# delete head;

class MemoryManager:
    """Tracks all allocations to detect leaks."""
    def __init__(self):
        self.allocations = 0
        self.deallocations = 0
        self.active = set()

    def alloc(self, obj_id):
        # TODO: Track allocation
        pass

    def dealloc(self, obj_id):
        # TODO: Track deallocation
        pass

    def has_leaks(self) -> bool:
        # TODO
        pass

    def leak_count(self) -> int:
        # TODO
        pass


class Node:
    _id_counter = 0

    def __init__(self, data, mem_manager: MemoryManager):
        # TODO: Store data, set next=None, register with memory manager
        pass


class LinkedList:
    """Singly linked list with manual memory management."""

    def __init__(self, mem_manager: MemoryManager):
        # TODO
        pass

    def push_front(self, data):
        """Insert at head — like C++ list insertion."""
        # TODO
        pass

    def push_back(self, data):
        """Insert at tail."""
        # TODO
        pass

    def pop_front(self):
        """Remove head node and deallocate it."""
        # TODO
        pass

    def display(self) -> str:
        """Return string like '1 -> 2 -> 3 -> None'."""
        # TODO
        pass

    def destroy(self):
        """Free all nodes — like a C++ destructor."""
        # TODO
        pass

    def __len__(self):
        # TODO
        pass


# Test cases
mm = MemoryManager()
ll = LinkedList(mm)

ll.push_back(1)
ll.push_back(2)
ll.push_back(3)
print(ll.display())        # Expected: 1 -> 2 -> 3 -> None
print(len(ll))             # Expected: 3

ll.push_front(0)
print(ll.display())        # Expected: 0 -> 1 -> 2 -> 3 -> None

ll.pop_front()
print(ll.display())        # Expected: 1 -> 2 -> 3 -> None

print(f"Allocations: {mm.allocations}")      # Expected: 4
print(f"Deallocations: {mm.deallocations}")  # Expected: 1
print(f"Leaks: {mm.has_leaks()}")            # Expected: True

ll.destroy()
print(f"After destroy - Leaks: {mm.has_leaks()}")  # Expected: False
print(f"Leak count: {mm.leak_count()}")             # Expected: 0
`,
      solutionCode: `# C++ equivalent:
# struct Node { int data; Node* next; };
# Node* head = new Node(1);
# delete head;

class MemoryManager:
    """Tracks all allocations to detect leaks."""
    def __init__(self):
        self.allocations = 0
        self.deallocations = 0
        self.active = set()

    def alloc(self, obj_id):
        self.allocations += 1
        self.active.add(obj_id)

    def dealloc(self, obj_id):
        self.deallocations += 1
        self.active.discard(obj_id)

    def has_leaks(self) -> bool:
        return len(self.active) > 0

    def leak_count(self) -> int:
        return len(self.active)


class Node:
    _id_counter = 0

    def __init__(self, data, mem_manager: MemoryManager):
        Node._id_counter += 1
        self.node_id = Node._id_counter
        self.data = data
        self.next = None
        self._mem = mem_manager
        self._mem.alloc(self.node_id)

    def free(self):
        self._mem.dealloc(self.node_id)


class LinkedList:
    """Singly linked list with manual memory management."""

    def __init__(self, mem_manager: MemoryManager):
        self._head = None
        self._mem = mem_manager
        self._size = 0

    def push_front(self, data):
        node = Node(data, self._mem)
        node.next = self._head
        self._head = node
        self._size += 1

    def push_back(self, data):
        node = Node(data, self._mem)
        if self._head is None:
            self._head = node
        else:
            current = self._head
            while current.next:
                current = current.next
            current.next = node
        self._size += 1

    def pop_front(self):
        if self._head is None:
            raise IndexError("List is empty")
        old_head = self._head
        self._head = old_head.next
        data = old_head.data
        old_head.free()
        self._size -= 1
        return data

    def display(self) -> str:
        parts = []
        current = self._head
        while current:
            parts.append(str(current.data))
            current = current.next
        parts.append("None")
        return " -> ".join(parts)

    def destroy(self):
        current = self._head
        while current:
            next_node = current.next
            current.free()
            current = next_node
        self._head = None
        self._size = 0

    def __len__(self):
        return self._size


# Test cases
mm = MemoryManager()
ll = LinkedList(mm)

ll.push_back(1)
ll.push_back(2)
ll.push_back(3)
print(ll.display())        # Expected: 1 -> 2 -> 3 -> None
print(len(ll))             # Expected: 3

ll.push_front(0)
print(ll.display())        # Expected: 0 -> 1 -> 2 -> 3 -> None

ll.pop_front()
print(ll.display())        # Expected: 1 -> 2 -> 3 -> None

print(f"Allocations: {mm.allocations}")      # Expected: 4
print(f"Deallocations: {mm.deallocations}")  # Expected: 1
print(f"Leaks: {mm.has_leaks()}")            # Expected: True

ll.destroy()
print(f"After destroy - Leaks: {mm.has_leaks()}")  # Expected: False
print(f"Leak count: {mm.leak_count()}")             # Expected: 0
`,
    },
    {
      id: "cpp-smart-pointer",
      slug: "cpp-smart-pointer",
      title: "Smart Pointer",
      content: `## Smart Pointers — Automatic Memory Management

### C++ Smart Pointers

Modern C++ (C++11+) introduced smart pointers to automate memory management:

\`\`\`cpp
#include <memory>

// unique_ptr — sole ownership, cannot be copied
std::unique_ptr<int> p1 = std::make_unique<int>(42);

// shared_ptr — reference counted, multiple owners
std::shared_ptr<int> p2 = std::make_shared<int>(100);
std::shared_ptr<int> p3 = p2;  // ref count = 2
// when all shared_ptrs die, memory is freed

// weak_ptr — non-owning observer of shared_ptr
std::weak_ptr<int> w = p2;
\`\`\`

### Your Task

Implement a \`SharedPtr\` class in Python that uses **reference counting** to automatically "free" memory when the last owner is gone.`,
      starterCode: `# C++ equivalent:
# auto p1 = std::make_shared<int>(42);
# auto p2 = p1;  // ref_count = 2
# p1.reset();    // ref_count = 1
# p2.reset();    // ref_count = 0, memory freed

class ControlBlock:
    """Shared control block holding value and reference count."""
    def __init__(self, value):
        # TODO: Store value, ref_count = 1, freed = False
        pass

    def increment(self):
        # TODO
        pass

    def decrement(self) -> int:
        # TODO: Decrement and free if count reaches 0. Return new count.
        pass


class SharedPtr:
    """Simulates C++ std::shared_ptr with reference counting."""

    def __init__(self, value=None):
        # TODO: Create control block if value is provided, else null
        pass

    @classmethod
    def _from_block(cls, block):
        """Internal: create SharedPtr sharing an existing control block."""
        # TODO
        pass

    def copy(self):
        """Create another SharedPtr sharing the same resource (like copy constructor)."""
        # TODO
        pass

    def get(self):
        """Access the managed value (*ptr)."""
        # TODO
        pass

    def reset(self):
        """Release ownership. If last owner, resource is freed."""
        # TODO
        pass

    def use_count(self) -> int:
        """Return current reference count."""
        # TODO
        pass

    def is_null(self) -> bool:
        # TODO
        pass


# Test cases
p1 = SharedPtr(42)
print(p1.get())            # Expected: 42
print(p1.use_count())      # Expected: 1

# Copy — shared ownership
p2 = p1.copy()
print(p2.get())            # Expected: 42
print(p1.use_count())      # Expected: 2
print(p2.use_count())      # Expected: 2

# Another copy
p3 = p2.copy()
print(p1.use_count())      # Expected: 3

# Reset one owner
p1.reset()
print(p1.is_null())        # Expected: True
print(p2.use_count())      # Expected: 2

# Reset another
p2.reset()
print(p3.use_count())      # Expected: 1
print(p3.get())            # Expected: 42

# Last owner releases — resource freed
p3.reset()
print(p3.is_null())        # Expected: True

# Null pointer
null_ptr = SharedPtr()
print(null_ptr.is_null())  # Expected: True
print(null_ptr.use_count()) # Expected: 0
`,
      solutionCode: `# C++ equivalent:
# auto p1 = std::make_shared<int>(42);
# auto p2 = p1;  // ref_count = 2
# p1.reset();    // ref_count = 1
# p2.reset();    // ref_count = 0, memory freed

class ControlBlock:
    """Shared control block holding value and reference count."""
    def __init__(self, value):
        self.value = value
        self.ref_count = 1
        self.freed = False

    def increment(self):
        self.ref_count += 1

    def decrement(self) -> int:
        self.ref_count -= 1
        if self.ref_count == 0:
            self.freed = True
            self.value = None
        return self.ref_count


class SharedPtr:
    """Simulates C++ std::shared_ptr with reference counting."""

    def __init__(self, value=None):
        if value is not None:
            self._block = ControlBlock(value)
        else:
            self._block = None

    @classmethod
    def _from_block(cls, block):
        obj = cls.__new__(cls)
        obj._block = block
        if block is not None:
            block.increment()
        return obj

    def copy(self):
        return SharedPtr._from_block(self._block)

    def get(self):
        if self._block is None or self._block.freed:
            raise RuntimeError("Dereferencing null/freed SharedPtr")
        return self._block.value

    def reset(self):
        if self._block is not None:
            self._block.decrement()
            self._block = None

    def use_count(self) -> int:
        if self._block is None:
            return 0
        return self._block.ref_count

    def is_null(self) -> bool:
        return self._block is None


# Test cases
p1 = SharedPtr(42)
print(p1.get())            # Expected: 42
print(p1.use_count())      # Expected: 1

# Copy — shared ownership
p2 = p1.copy()
print(p2.get())            # Expected: 42
print(p1.use_count())      # Expected: 2
print(p2.use_count())      # Expected: 2

# Another copy
p3 = p2.copy()
print(p1.use_count())      # Expected: 3

# Reset one owner
p1.reset()
print(p1.is_null())        # Expected: True
print(p2.use_count())      # Expected: 2

# Reset another
p2.reset()
print(p3.use_count())      # Expected: 1
print(p3.get())            # Expected: 42

# Last owner releases — resource freed
p3.reset()
print(p3.is_null())        # Expected: True

# Null pointer
null_ptr = SharedPtr()
print(null_ptr.is_null())  # Expected: True
print(null_ptr.use_count()) # Expected: 0
`,
    },
  ],
};
