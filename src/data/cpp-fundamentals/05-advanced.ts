import { Module } from "../types";

export const cppAdvancedModule: Module = {
  id: "cpp-advanced",
  title: "Advanced C++ Concepts",
  description: "Explore RAII, move semantics, and iterators — advanced C++ patterns implemented as Python equivalents.",
  lessons: [
    {
      id: "cpp-advanced-intro",
      slug: "cpp-advanced-intro",
      title: "Introduction to Advanced C++",
      content: `## Advanced C++ Concepts

### RAII — Resource Acquisition Is Initialization

RAII is the cornerstone of C++ resource management. The idea: **tie resource lifetime to object lifetime**.

\`\`\`cpp
class FileHandle {
    FILE* file;
public:
    FileHandle(const char* name) : file(fopen(name, "r")) {
        if (!file) throw std::runtime_error("Cannot open file");
    }
    ~FileHandle() {
        fclose(file);  // guaranteed cleanup
    }
};

{
    FileHandle f("data.txt");  // file opened
    // ... use file ...
}  // f goes out of scope → destructor called → file closed
\`\`\`

Python equivalent: **context managers** (\`with\` statement).

### Move Semantics (C++11)

Instead of copying large objects, C++ can **move** them — transferring ownership of resources:

\`\`\`cpp
std::vector<int> create() {
    std::vector<int> v = {1, 2, 3};
    return v;  // MOVED, not copied (RVO/move semantics)
}

std::string a = "hello";
std::string b = std::move(a);  // a is now empty, b owns the data
\`\`\`

### Iterators

Iterators are the glue between containers and algorithms:

\`\`\`cpp
class Range {
    int start, end;
public:
    class Iterator {
        int current;
    public:
        Iterator(int v) : current(v) {}
        int operator*() { return current; }
        Iterator& operator++() { ++current; return *this; }
        bool operator!=(const Iterator& other) { return current != other.current; }
    };
    Iterator begin() { return Iterator(start); }
    Iterator end() { return Iterator(end); }
};
\`\`\`

In this module you will implement all three concepts in Python.`,
    },
    {
      id: "cpp-advanced-raii",
      slug: "cpp-raii-pattern",
      title: "RAII Pattern",
      content: `## RAII — Resource Acquisition Is Initialization

### The Pattern

In C++, RAII ensures resources (files, locks, memory, connections) are automatically released when the owning object is destroyed.

Python's equivalent is the **context manager protocol** (\`__enter__\` / \`__exit__\`).

### Your Task

Implement several RAII-style resource managers:
1. \`ManagedFile\` — auto-closes a file
2. \`ManagedLock\` — auto-releases a lock
3. \`ManagedConnection\` — auto-disconnects
4. A general \`ScopeGuard\` that runs arbitrary cleanup`,
      starterCode: `# C++ equivalent:
# class FileHandle {
#     FILE* f;
#     FileHandle(const char* n) : f(fopen(n,"r")) {}
#     ~FileHandle() { fclose(f); }
# };

class ManagedFile:
    """RAII file handle — auto-closes on scope exit."""

    def __init__(self, filename: str, mode: str = "r"):
        # TODO: Open file, store handle
        pass

    def __enter__(self):
        # TODO: Return self for use in 'with' block
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        # TODO: Close file (cleanup)
        pass

    def read(self) -> str:
        # TODO
        pass

    def write(self, data: str):
        # TODO
        pass

    @property
    def closed(self) -> bool:
        # TODO
        pass


class ScopeGuard:
    """Like C++ scope_guard — runs cleanup function on scope exit.
    Can also be dismissed (cancelled)."""

    def __init__(self, cleanup_func):
        # TODO
        pass

    def dismiss(self):
        """Cancel the cleanup — like committing a transaction."""
        # TODO
        pass

    def __enter__(self):
        # TODO
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        # TODO: Run cleanup unless dismissed
        pass


class ResourcePool:
    """RAII pool that acquires and releases resources automatically."""

    def __init__(self, name: str, size: int):
        # TODO: Create pool of resources
        pass

    def acquire(self):
        """Acquire a resource from the pool."""
        # TODO
        pass

    def release(self, resource_id):
        """Return resource to pool."""
        # TODO
        pass

    def __enter__(self):
        # TODO
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        # TODO: Return all acquired resources
        pass


# Test cases
# Test ManagedFile
import tempfile, os

with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as tmp:
    tmp.write("Hello RAII")
    tmp_name = tmp.name

with ManagedFile(tmp_name, "r") as f:
    content = f.read()
    print(f"Read: {content}")     # Expected: Read: Hello RAII
    print(f"Closed: {f.closed}")  # Expected: Closed: False

print(f"After with: {f.closed}") # Expected: After with: True
os.unlink(tmp_name)

# Test ScopeGuard
log = []

with ScopeGuard(lambda: log.append("cleaned up")):
    log.append("doing work")
print(log)  # Expected: ['doing work', 'cleaned up']

log2 = []
with ScopeGuard(lambda: log2.append("rolled back")) as guard:
    log2.append("doing work")
    guard.dismiss()  # commit — don't rollback
print(log2)  # Expected: ['doing work'] — cleanup was dismissed

# Test ResourcePool
pool = ResourcePool("connections", 3)
with pool as p:
    r1 = p.acquire()
    r2 = p.acquire()
    print(f"Acquired: {r1}, {r2}")  # Expected: Acquired: 0, 1
# Resources auto-released after 'with' block
`,
      solutionCode: `# C++ equivalent:
# class FileHandle {
#     FILE* f;
#     FileHandle(const char* n) : f(fopen(n,"r")) {}
#     ~FileHandle() { fclose(f); }
# };

class ManagedFile:
    """RAII file handle — auto-closes on scope exit."""

    def __init__(self, filename: str, mode: str = "r"):
        self._file = open(filename, mode)
        self._closed = False

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if not self._closed:
            self._file.close()
            self._closed = True
        return False

    def read(self) -> str:
        return self._file.read()

    def write(self, data: str):
        self._file.write(data)

    @property
    def closed(self) -> bool:
        return self._closed


class ScopeGuard:
    """Like C++ scope_guard — runs cleanup function on scope exit."""

    def __init__(self, cleanup_func):
        self._cleanup = cleanup_func
        self._dismissed = False

    def dismiss(self):
        self._dismissed = True

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if not self._dismissed:
            self._cleanup()
        return False


class ResourcePool:
    """RAII pool that acquires and releases resources automatically."""

    def __init__(self, name: str, size: int):
        self._name = name
        self._size = size
        self._available = list(range(size))
        self._acquired = []

    def acquire(self):
        if not self._available:
            raise RuntimeError(f"Pool '{self._name}' exhausted")
        resource = self._available.pop(0)
        self._acquired.append(resource)
        return resource

    def release(self, resource_id):
        if resource_id in self._acquired:
            self._acquired.remove(resource_id)
            self._available.append(resource_id)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        for r in list(self._acquired):
            self.release(r)
        return False


# Test cases
# Test ManagedFile
import tempfile, os

with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as tmp:
    tmp.write("Hello RAII")
    tmp_name = tmp.name

with ManagedFile(tmp_name, "r") as f:
    content = f.read()
    print(f"Read: {content}")     # Expected: Read: Hello RAII
    print(f"Closed: {f.closed}")  # Expected: Closed: False

print(f"After with: {f.closed}") # Expected: After with: True
os.unlink(tmp_name)

# Test ScopeGuard
log = []

with ScopeGuard(lambda: log.append("cleaned up")):
    log.append("doing work")
print(log)  # Expected: ['doing work', 'cleaned up']

log2 = []
with ScopeGuard(lambda: log2.append("rolled back")) as guard:
    log2.append("doing work")
    guard.dismiss()  # commit — don't rollback
print(log2)  # Expected: ['doing work'] — cleanup was dismissed

# Test ResourcePool
pool = ResourcePool("connections", 3)
with pool as p:
    r1 = p.acquire()
    r2 = p.acquire()
    print(f"Acquired: {r1}, {r2}")  # Expected: Acquired: 0, 1
# Resources auto-released after 'with' block
`,
    },
    {
      id: "cpp-advanced-move",
      slug: "cpp-move-semantics",
      title: "Move Semantics Simulator",
      content: `## Move Semantics — Transfer Instead of Copy

### The Problem Move Solves

Copying a large \`std::vector\` is expensive — you allocate new memory and copy every element. But if the source is about to be destroyed anyway, why not just **steal its guts**?

\`\`\`cpp
std::vector<int> a = {1,2,3,4,5};
std::vector<int> b = std::move(a);
// b now owns the data; a is in a "moved-from" state (empty but valid)
\`\`\`

### Your Task

Implement a \`MovableBuffer\` class that supports both copy and move operations. After a move, the source should be in a valid but empty state.`,
      starterCode: `# C++ equivalent:
# std::string a = "hello";
# std::string b = std::move(a);  // a is now ""

class MovableBuffer:
    """Simulates a C++ resource with move semantics."""

    def __init__(self, data: list = None):
        # TODO: Store data, track if moved-from
        pass

    def copy(self):
        """Deep copy — like C++ copy constructor. Expensive."""
        # TODO: Return new MovableBuffer with copied data
        pass

    def move(self):
        """Move — like C++ move constructor. Cheap.
        Transfers ownership; self becomes empty."""
        # TODO: Return new buffer with stolen data, empty self
        pass

    def is_valid(self) -> bool:
        """True if buffer has not been moved from."""
        # TODO
        pass

    def size(self) -> int:
        # TODO: Raise if moved-from
        pass

    def get(self, index: int):
        # TODO: Raise if moved-from
        pass

    def append(self, value):
        # TODO: Raise if moved-from
        pass

    def __repr__(self):
        # TODO
        pass


def transfer_ownership(source: MovableBuffer) -> MovableBuffer:
    """Simulate passing a resource by move — source is emptied."""
    # TODO
    pass


# Test cases
buf = MovableBuffer([1, 2, 3, 4, 5])
print(buf)                    # Expected: Buffer([1, 2, 3, 4, 5])
print(buf.size())             # Expected: 5

# Copy — both remain valid
buf_copy = buf.copy()
print(buf_copy)               # Expected: Buffer([1, 2, 3, 4, 5])
print(buf.is_valid())         # Expected: True (original unchanged)

# Move — source becomes empty
buf_moved = buf.move()
print(buf_moved)              # Expected: Buffer([1, 2, 3, 4, 5])
print(buf_moved.size())       # Expected: 5
print(buf.is_valid())         # Expected: False (moved-from)

try:
    buf.size()
except RuntimeError as e:
    print(e)                  # Expected: Access to moved-from object

# Transfer ownership
source = MovableBuffer([10, 20, 30])
dest = transfer_ownership(source)
print(dest)                   # Expected: Buffer([10, 20, 30])
print(source.is_valid())      # Expected: False
`,
      solutionCode: `# C++ equivalent:
# std::string a = "hello";
# std::string b = std::move(a);  // a is now ""

class MovableBuffer:
    """Simulates a C++ resource with move semantics."""

    def __init__(self, data: list = None):
        self._data = list(data) if data else []
        self._moved = False

    def _check_valid(self):
        if self._moved:
            raise RuntimeError("Access to moved-from object")

    def copy(self):
        self._check_valid()
        return MovableBuffer(list(self._data))

    def move(self):
        self._check_valid()
        new_buf = MovableBuffer.__new__(MovableBuffer)
        new_buf._data = self._data
        new_buf._moved = False
        self._data = []
        self._moved = True
        return new_buf

    def is_valid(self) -> bool:
        return not self._moved

    def size(self) -> int:
        self._check_valid()
        return len(self._data)

    def get(self, index: int):
        self._check_valid()
        return self._data[index]

    def append(self, value):
        self._check_valid()
        self._data.append(value)

    def __repr__(self):
        if self._moved:
            return "Buffer(<moved>)"
        return f"Buffer({self._data})"


def transfer_ownership(source: MovableBuffer) -> MovableBuffer:
    return source.move()


# Test cases
buf = MovableBuffer([1, 2, 3, 4, 5])
print(buf)                    # Expected: Buffer([1, 2, 3, 4, 5])
print(buf.size())             # Expected: 5

# Copy — both remain valid
buf_copy = buf.copy()
print(buf_copy)               # Expected: Buffer([1, 2, 3, 4, 5])
print(buf.is_valid())         # Expected: True (original unchanged)

# Move — source becomes empty
buf_moved = buf.move()
print(buf_moved)              # Expected: Buffer([1, 2, 3, 4, 5])
print(buf_moved.size())       # Expected: 5
print(buf.is_valid())         # Expected: False (moved-from)

try:
    buf.size()
except RuntimeError as e:
    print(e)                  # Expected: Access to moved-from object

# Transfer ownership
source = MovableBuffer([10, 20, 30])
dest = transfer_ownership(source)
print(dest)                   # Expected: Buffer([10, 20, 30])
print(source.is_valid())      # Expected: False
`,
    },
    {
      id: "cpp-advanced-iterator",
      slug: "cpp-custom-iterator",
      title: "Custom Iterator",
      content: `## Custom Iterators — The Iterator Pattern

### C++ Iterators

C++ iterators provide a uniform interface to traverse containers:

\`\`\`cpp
class Range {
public:
    class Iterator {
        int current;
    public:
        Iterator(int val) : current(val) {}
        int operator*() const { return current; }
        Iterator& operator++() { ++current; return *this; }
        bool operator!=(const Iterator& o) const { return current != o.current; }
    };

    Range(int start, int end) : start_(start), end_(end) {}
    Iterator begin() { return Iterator(start_); }
    Iterator end() { return Iterator(end_); }

private:
    int start_, end_;
};

for (int x : Range(1, 5)) {
    std::cout << x << " ";  // 1 2 3 4
}
\`\`\`

### Your Task

Implement several custom iterators in Python using the \`__iter__\`/\`__next__\` protocol:
1. \`Range\` — like C++ range with step
2. \`FilterIterator\` — yields only elements matching a predicate
3. \`ZipIterator\` — pairs elements from two iterables
4. \`ChainIterator\` — concatenates multiple iterables`,
      starterCode: `# C++ equivalent:
# for (int x : Range(0, 10, 2)) { ... }
# Uses begin()/end() + operator++/operator*/operator!=

class Range:
    """Like C++ Range — iterable from start to end with step."""

    def __init__(self, start: int, end: int, step: int = 1):
        # TODO
        pass

    def __iter__(self):
        # TODO: Return iterator object
        pass

    def __next__(self):
        # TODO: Return next value or raise StopIteration
        pass


class FilterIterator:
    """Like C++ filtered range — yields elements matching predicate."""

    def __init__(self, iterable, predicate):
        # TODO
        pass

    def __iter__(self):
        # TODO
        pass

    def __next__(self):
        # TODO: Skip elements not matching predicate
        pass


class ZipIterator:
    """Like C++ zip — pairs elements from two iterables."""

    def __init__(self, iter1, iter2):
        # TODO
        pass

    def __iter__(self):
        # TODO
        pass

    def __next__(self):
        # TODO: Return tuple of next elements from both, stop when either exhausted
        pass


class ChainIterator:
    """Like C++ chain — concatenates multiple iterables."""

    def __init__(self, *iterables):
        # TODO
        pass

    def __iter__(self):
        # TODO
        pass

    def __next__(self):
        # TODO: Yield from first iterable, then second, etc.
        pass


# Test cases
# Range
print("Range(0, 10, 2):", list(Range(0, 10, 2)))   # [0, 2, 4, 6, 8]
print("Range(5, 0, -1):", list(Range(5, 0, -1)))   # [5, 4, 3, 2, 1]

# FilterIterator
evens = FilterIterator(Range(0, 10), lambda x: x % 2 == 0)
print("Evens:", list(evens))  # [0, 2, 4, 6, 8]

# ZipIterator
zipped = ZipIterator([1, 2, 3], ['a', 'b', 'c'])
print("Zipped:", list(zipped))  # [(1, 'a'), (2, 'b'), (3, 'c')]

# ChainIterator
chained = ChainIterator([1, 2], [3, 4], [5, 6])
print("Chained:", list(chained))  # [1, 2, 3, 4, 5, 6]

# Composing iterators — filter over a range, then zip
odds = FilterIterator(Range(1, 20), lambda x: x % 2 == 1)
squares = [x**2 for x in Range(1, 10)]
combined = ZipIterator(odds, squares)
print("Combined:", list(combined))
# Expected: [(1, 1), (3, 4), (5, 9), (7, 16), (9, 25), (11, 36), (13, 49), (15, 64), (17, 81)]
`,
      solutionCode: `# C++ equivalent:
# for (int x : Range(0, 10, 2)) { ... }
# Uses begin()/end() + operator++/operator*/operator!=

class Range:
    """Like C++ Range — iterable from start to end with step."""

    def __init__(self, start: int, end: int, step: int = 1):
        self._start = start
        self._end = end
        self._step = step
        self._current = start

    def __iter__(self):
        self._current = self._start
        return self

    def __next__(self):
        if self._step > 0 and self._current >= self._end:
            raise StopIteration
        if self._step < 0 and self._current <= self._end:
            raise StopIteration
        value = self._current
        self._current += self._step
        return value


class FilterIterator:
    """Like C++ filtered range — yields elements matching predicate."""

    def __init__(self, iterable, predicate):
        self._iter = iter(iterable)
        self._predicate = predicate

    def __iter__(self):
        return self

    def __next__(self):
        while True:
            value = next(self._iter)  # raises StopIteration when exhausted
            if self._predicate(value):
                return value


class ZipIterator:
    """Like C++ zip — pairs elements from two iterables."""

    def __init__(self, iter1, iter2):
        self._iter1 = iter(iter1)
        self._iter2 = iter(iter2)

    def __iter__(self):
        return self

    def __next__(self):
        try:
            a = next(self._iter1)
            b = next(self._iter2)
            return (a, b)
        except StopIteration:
            raise StopIteration


class ChainIterator:
    """Like C++ chain — concatenates multiple iterables."""

    def __init__(self, *iterables):
        self._iterables = list(iterables)
        self._index = 0
        self._current = iter(self._iterables[0]) if self._iterables else iter([])

    def __iter__(self):
        return self

    def __next__(self):
        while True:
            try:
                return next(self._current)
            except StopIteration:
                self._index += 1
                if self._index >= len(self._iterables):
                    raise StopIteration
                self._current = iter(self._iterables[self._index])


# Test cases
# Range
print("Range(0, 10, 2):", list(Range(0, 10, 2)))   # [0, 2, 4, 6, 8]
print("Range(5, 0, -1):", list(Range(5, 0, -1)))   # [5, 4, 3, 2, 1]

# FilterIterator
evens = FilterIterator(Range(0, 10), lambda x: x % 2 == 0)
print("Evens:", list(evens))  # [0, 2, 4, 6, 8]

# ZipIterator
zipped = ZipIterator([1, 2, 3], ['a', 'b', 'c'])
print("Zipped:", list(zipped))  # [(1, 'a'), (2, 'b'), (3, 'c')]

# ChainIterator
chained = ChainIterator([1, 2], [3, 4], [5, 6])
print("Chained:", list(chained))  # [1, 2, 3, 4, 5, 6]

# Composing iterators — filter over a range, then zip
odds = FilterIterator(Range(1, 20), lambda x: x % 2 == 1)
squares = [x**2 for x in Range(1, 10)]
combined = ZipIterator(odds, squares)
print("Combined:", list(combined))
# Expected: [(1, 1), (3, 4), (5, 9), (7, 16), (9, 25), (11, 36), (13, 49), (15, 64), (17, 81)]
`,
    },
  ],
};
