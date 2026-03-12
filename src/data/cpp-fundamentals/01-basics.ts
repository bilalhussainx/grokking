import { Module } from "../types";

export const cppBasicsModule: Module = {
  id: "cpp-basics",
  title: "Variables, Types & I/O",
  description:
    "Learn C++ fundamentals — variables, the type system, memory layout, and input parsing — through Python exercises that mirror C++ concepts.",
  lessons: [
    {
      id: "cpp-basics-intro",
      slug: "cpp-basics-intro",
      title: "Introduction to C++",
      content: `## Welcome to C++ Fundamentals

### A Brief History

C++ was created by **Bjarne Stroustrup** at Bell Labs in 1979 as an extension of C. Originally called "C with Classes," it was renamed C++ in 1983. Today it powers operating systems, game engines, databases, browsers, and embedded systems.

### Compilation Model

Unlike Python (interpreted), C++ is a **compiled language**:

\`\`\`
Source Code (.cpp) → Preprocessor → Compiler → Assembler → Linker → Executable
\`\`\`

In C++:
\`\`\`cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
\`\`\`

In Python:
\`\`\`python
print("Hello, World!")
\`\`\`

### The C++ Type System

C++ is **statically typed** — every variable must have a declared type at compile time.

| C++ Type | Size (typical) | Python Equivalent |
|----------|---------------|-------------------|
| \`int\` | 4 bytes | \`int\` |
| \`double\` | 8 bytes | \`float\` |
| \`char\` | 1 byte | \`str\` (single char) |
| \`bool\` | 1 byte | \`bool\` |
| \`std::string\` | varies | \`str\` |

### Key Differences from Python

| Feature | C++ | Python |
|---------|-----|--------|
| Typing | Static | Dynamic |
| Memory | Manual / RAII | Garbage collected |
| Speed | Very fast (compiled) | Slower (interpreted) |
| Syntax | Braces + semicolons | Indentation |
| Pointers | Yes | No (references only) |

### What You Will Learn

In this course, we teach C++ **concepts** using Python implementations. Each lesson explains the C++ syntax, then has you build the equivalent behavior in Python. This approach lets you understand the ideas before wrestling with C++ syntax.

> **Note:** All exercises run in Python. C++ code snippets are shown for reference only.`,
    },
    {
      id: "cpp-basics-type-system",
      slug: "cpp-type-system",
      title: "Type System",
      content: `## C++ Type System — Strict Typing

### C++ Enforces Types at Compile Time

In C++, you must declare the type of every variable:

\`\`\`cpp
int age = 25;           // integer
double price = 19.99;   // floating point
char grade = 'A';       // single character
bool passed = true;     // boolean
std::string name = "Alice"; // string
\`\`\`

Assigning an incompatible type is a **compile error**:

\`\`\`cpp
int x = "hello";  // ERROR: cannot convert string to int
\`\`\`

### Your Task

Implement a \`StrictVar\` class in Python that enforces C++-style type checking. Once a variable is created with a type, it should reject assignments of a different type.

### Requirements

1. \`StrictVar(name, var_type, value)\` — create a typed variable
2. \`set(value)\` — update the value; raise \`TypeError\` if the type doesn't match
3. \`get()\` — return the current value
4. \`type_name()\` — return the type name as a string

### Example

\`\`\`python
x = StrictVar("x", int, 42)
x.set(100)      # OK
x.get()         # 100
x.set("hello")  # TypeError: Cannot assign str to variable 'x' of type int
\`\`\``,
      starterCode: `# C++ equivalent:
# int x = 42;
# x = 100;    // OK
# x = "hello"; // Compile error!

class StrictVar:
    """Simulates C++ static typing — once a type is set, it cannot change."""

    def __init__(self, name: str, var_type: type, value):
        # TODO: Store name, type, and validate + store initial value
        pass

    def set(self, value):
        # TODO: Check type before assigning; raise TypeError if mismatch
        pass

    def get(self):
        # TODO: Return current value
        pass

    def type_name(self) -> str:
        # TODO: Return the type name as a string
        pass


# Test cases
x = StrictVar("x", int, 42)
print(x.get())          # Expected: 42
print(x.type_name())    # Expected: int

x.set(100)
print(x.get())          # Expected: 100

try:
    x.set("hello")
except TypeError as e:
    print(e)             # Expected: Cannot assign str to variable 'x' of type int

# Test with float
price = StrictVar("price", float, 19.99)
print(price.get())       # Expected: 19.99
price.set(29.99)
print(price.get())       # Expected: 29.99

try:
    price.set(30)
except TypeError as e:
    print(e)             # Expected: Cannot assign int to variable 'price' of type float
`,
      solutionCode: `# C++ equivalent:
# int x = 42;
# x = 100;    // OK
# x = "hello"; // Compile error!

class StrictVar:
    """Simulates C++ static typing — once a type is set, it cannot change."""

    def __init__(self, name: str, var_type: type, value):
        self._name = name
        self._type = var_type
        if not isinstance(value, var_type):
            raise TypeError(
                f"Cannot assign {type(value).__name__} to variable '{name}' of type {var_type.__name__}"
            )
        self._value = value

    def set(self, value):
        if not isinstance(value, self._type):
            raise TypeError(
                f"Cannot assign {type(value).__name__} to variable '{self._name}' of type {self._type.__name__}"
            )
        self._value = value

    def get(self):
        return self._value

    def type_name(self) -> str:
        return self._type.__name__


# Test cases
x = StrictVar("x", int, 42)
print(x.get())          # Expected: 42
print(x.type_name())    # Expected: int

x.set(100)
print(x.get())          # Expected: 100

try:
    x.set("hello")
except TypeError as e:
    print(e)             # Expected: Cannot assign str to variable 'x' of type int

# Test with float
price = StrictVar("price", float, 19.99)
print(price.get())       # Expected: 19.99
price.set(29.99)
print(price.get())       # Expected: 29.99

try:
    price.set(30)
except TypeError as e:
    print(e)             # Expected: Cannot assign int to variable 'price' of type float
`,
    },
    {
      id: "cpp-basics-memory-layout",
      slug: "cpp-memory-layout",
      title: "Memory Layout",
      content: `## Stack vs Heap Memory

### How C++ Manages Memory

C++ gives you direct control over where data lives:

**Stack allocation** — fast, automatic lifetime:
\`\`\`cpp
void foo() {
    int x = 10;        // stack — destroyed when foo() returns
    double arr[100];    // stack — fixed size, fast
}
\`\`\`

**Heap allocation** — flexible, manual lifetime:
\`\`\`cpp
void bar() {
    int* p = new int(42);     // heap — lives until you delete it
    int* arr = new int[100];  // heap — dynamic size
    delete p;                  // YOU must free it
    delete[] arr;              // or you get a memory leak!
}
\`\`\`

### Key Differences

| Feature | Stack | Heap |
|---------|-------|------|
| Speed | Very fast | Slower (allocation overhead) |
| Size | Limited (~1-8 MB) | Large (limited by RAM) |
| Lifetime | Automatic (scope-based) | Manual (\`new\`/\`delete\`) |
| Fragmentation | None | Possible |

### Your Task

Build a \`MemorySimulator\` that models stack and heap regions. It should support allocating and freeing memory in both regions, and detect memory leaks.`,
      starterCode: `# C++ equivalent:
# int x = 10;              // stack allocation
# int* p = new int(42);    // heap allocation
# delete p;                // heap deallocation

class MemorySimulator:
    """Simulates C++ stack and heap memory regions."""

    def __init__(self, stack_size: int = 1024, heap_size: int = 4096):
        # TODO: Initialize stack and heap with given sizes
        # Track allocations as {address: (size, value, region)}
        pass

    def stack_alloc(self, name: str, value, size: int = 1) -> int:
        """Allocate on the stack. Returns the address (offset).
        Stack grows upward from 0. Raise MemoryError if stack is full."""
        # TODO
        pass

    def heap_alloc(self, size: int, value=None) -> int:
        """Allocate on the heap. Returns the address.
        Raise MemoryError if not enough heap space."""
        # TODO
        pass

    def heap_free(self, address: int):
        """Free a heap allocation. Raise ValueError if address is invalid."""
        # TODO
        pass

    def stack_pop(self) -> None:
        """Pop the most recent stack allocation (simulates leaving scope)."""
        # TODO
        pass

    def check_leaks(self) -> list:
        """Return list of heap addresses that haven't been freed."""
        # TODO
        pass

    def stats(self) -> dict:
        """Return memory usage stats."""
        # TODO
        pass


# Test cases
mem = MemorySimulator(stack_size=100, heap_size=200)

# Stack allocations (like local variables)
addr1 = mem.stack_alloc("x", 42, size=4)
addr2 = mem.stack_alloc("y", 3.14, size=8)
print(f"Stack alloc x at {addr1}")   # Expected: 0
print(f"Stack alloc y at {addr2}")   # Expected: 4

# Heap allocations (like new/malloc)
h1 = mem.heap_alloc(16, "dynamic array")
h2 = mem.heap_alloc(32, "buffer")
print(f"Heap alloc at {h1}")          # Expected: 0
print(f"Heap alloc at {h2}")          # Expected: 16

# Free one heap allocation
mem.heap_free(h1)

# Check for leaks
leaks = mem.check_leaks()
print(f"Leaks: {leaks}")             # Expected: [16] (h2 not freed)

# Stats
print(mem.stats())

# Pop stack
mem.stack_pop()
print(f"After pop, stats: {mem.stats()}")
`,
      solutionCode: `# C++ equivalent:
# int x = 10;              // stack allocation
# int* p = new int(42);    // heap allocation
# delete p;                // heap deallocation

class MemorySimulator:
    """Simulates C++ stack and heap memory regions."""

    def __init__(self, stack_size: int = 1024, heap_size: int = 4096):
        self._stack_size = stack_size
        self._heap_size = heap_size
        self._stack_top = 0
        self._stack_allocs = []  # list of (name, address, size, value)
        self._heap_allocs = {}   # address -> (size, value)
        self._heap_freed = set()
        self._next_heap = 0

    def stack_alloc(self, name: str, value, size: int = 1) -> int:
        if self._stack_top + size > self._stack_size:
            raise MemoryError(f"Stack overflow: cannot allocate {size} bytes")
        address = self._stack_top
        self._stack_allocs.append((name, address, size, value))
        self._stack_top += size
        return address

    def heap_alloc(self, size: int, value=None) -> int:
        if self._next_heap + size > self._heap_size:
            raise MemoryError(f"Heap exhausted: cannot allocate {size} bytes")
        address = self._next_heap
        self._heap_allocs[address] = (size, value)
        self._next_heap += size
        return address

    def heap_free(self, address: int):
        if address not in self._heap_allocs or address in self._heap_freed:
            raise ValueError(f"Invalid free: no active allocation at address {address}")
        self._heap_freed.add(address)

    def stack_pop(self) -> None:
        if not self._stack_allocs:
            raise IndexError("Stack is empty")
        name, address, size, value = self._stack_allocs.pop()
        self._stack_top = address

    def check_leaks(self) -> list:
        return [addr for addr in self._heap_allocs if addr not in self._heap_freed]

    def stats(self) -> dict:
        return {
            "stack_used": self._stack_top,
            "stack_free": self._stack_size - self._stack_top,
            "heap_allocs": len(self._heap_allocs) - len(self._heap_freed),
            "heap_used": sum(s for a, (s, v) in self._heap_allocs.items() if a not in self._heap_freed),
            "heap_freed_count": len(self._heap_freed),
            "leaks": len(self.check_leaks()),
        }


# Test cases
mem = MemorySimulator(stack_size=100, heap_size=200)

# Stack allocations (like local variables)
addr1 = mem.stack_alloc("x", 42, size=4)
addr2 = mem.stack_alloc("y", 3.14, size=8)
print(f"Stack alloc x at {addr1}")   # Expected: 0
print(f"Stack alloc y at {addr2}")   # Expected: 4

# Heap allocations (like new/malloc)
h1 = mem.heap_alloc(16, "dynamic array")
h2 = mem.heap_alloc(32, "buffer")
print(f"Heap alloc at {h1}")          # Expected: 0
print(f"Heap alloc at {h2}")          # Expected: 16

# Free one heap allocation
mem.heap_free(h1)

# Check for leaks
leaks = mem.check_leaks()
print(f"Leaks: {leaks}")             # Expected: [16] (h2 not freed)

# Stats
print(mem.stats())

# Pop stack
mem.stack_pop()
print(f"After pop, stats: {mem.stats()}")
`,
    },
    {
      id: "cpp-basics-input-parser",
      slug: "cpp-input-parser",
      title: "Input Parser",
      content: `## Parsing Input — C++ Style

### How C++ Reads Input

C++ uses \`cin\` and \`scanf\` for formatted input:

\`\`\`cpp
#include <iostream>
#include <sstream>

int main() {
    // Read typed values
    int n;
    double x;
    std::cin >> n >> x;  // reads an int then a double

    // Read a full line
    std::string line;
    std::getline(std::cin, line);

    // Parse with stringstream
    std::istringstream iss("42 3.14 hello");
    int a; double b; std::string c;
    iss >> a >> b >> c;  // a=42, b=3.14, c="hello"
}
\`\`\`

### Type-Safe Parsing

C++ input streams enforce types. Reading \`"hello"\` into an \`int\` puts the stream in a fail state.

### Your Task

Implement a \`TypedParser\` that reads tokens from a string and converts them to specified types, mimicking C++ \`istringstream >> var\` behavior.`,
      starterCode: `# C++ equivalent:
# std::istringstream iss("42 3.14 hello true");
# int a; double b; std::string c; bool d;
# iss >> a >> b >> c >> d;

class TypedParser:
    """Simulates C++ istringstream — reads tokens with type enforcement."""

    def __init__(self, input_string: str):
        # TODO: Split input into tokens and track position
        pass

    def read_int(self) -> int:
        """Read next token as int. Raise ValueError on failure."""
        # TODO
        pass

    def read_float(self) -> float:
        """Read next token as float. Raise ValueError on failure."""
        # TODO
        pass

    def read_string(self) -> str:
        """Read next token as string."""
        # TODO
        pass

    def read_bool(self) -> bool:
        """Read next token as bool (true/false, 1/0). Raise ValueError on failure."""
        # TODO
        pass

    def has_next(self) -> bool:
        """Check if there are more tokens."""
        # TODO
        pass

    def remaining(self) -> int:
        """Return count of remaining tokens."""
        # TODO
        pass


# Test cases
parser = TypedParser("42 3.14 hello true 100")

print(parser.read_int())     # Expected: 42
print(parser.read_float())   # Expected: 3.14
print(parser.read_string())  # Expected: hello
print(parser.read_bool())    # Expected: True
print(parser.remaining())    # Expected: 1
print(parser.read_int())     # Expected: 100
print(parser.has_next())     # Expected: False

# Test error handling
parser2 = TypedParser("not_a_number 3.14")
try:
    parser2.read_int()
except ValueError as e:
    print(e)                  # Expected: Cannot parse 'not_a_number' as int

print(parser2.read_float())  # Expected: 3.14
`,
      solutionCode: `# C++ equivalent:
# std::istringstream iss("42 3.14 hello true");
# int a; double b; std::string c; bool d;
# iss >> a >> b >> c >> d;

class TypedParser:
    """Simulates C++ istringstream — reads tokens with type enforcement."""

    def __init__(self, input_string: str):
        self._tokens = input_string.split()
        self._pos = 0

    def _next_token(self) -> str:
        if self._pos >= len(self._tokens):
            raise ValueError("No more tokens to read")
        token = self._tokens[self._pos]
        self._pos += 1
        return token

    def read_int(self) -> int:
        token = self._next_token()
        try:
            return int(token)
        except ValueError:
            raise ValueError(f"Cannot parse '{token}' as int")

    def read_float(self) -> float:
        token = self._next_token()
        try:
            return float(token)
        except ValueError:
            raise ValueError(f"Cannot parse '{token}' as float")

    def read_string(self) -> str:
        return self._next_token()

    def read_bool(self) -> bool:
        token = self._next_token().lower()
        if token in ("true", "1"):
            return True
        elif token in ("false", "0"):
            return False
        else:
            raise ValueError(f"Cannot parse '{token}' as bool")

    def has_next(self) -> bool:
        return self._pos < len(self._tokens)

    def remaining(self) -> int:
        return len(self._tokens) - self._pos


# Test cases
parser = TypedParser("42 3.14 hello true 100")

print(parser.read_int())     # Expected: 42
print(parser.read_float())   # Expected: 3.14
print(parser.read_string())  # Expected: hello
print(parser.read_bool())    # Expected: True
print(parser.remaining())    # Expected: 1
print(parser.read_int())     # Expected: 100
print(parser.has_next())     # Expected: False

# Test error handling
parser2 = TypedParser("not_a_number 3.14")
try:
    parser2.read_int()
except ValueError as e:
    print(e)                  # Expected: Cannot parse 'not_a_number' as int

print(parser2.read_float())  # Expected: 3.14
`,
    },
  ],
};
