import { Module } from "../types";

export const cppStlModule: Module = {
  id: "cpp-stl",
  title: "STL Containers & Algorithms",
  description: "Implement the core STL data structures and algorithms — vector, hash map, sort, find, and transform — in Python.",
  lessons: [
    {
      id: "cpp-stl-intro",
      slug: "cpp-stl-intro",
      title: "Introduction to the STL",
      content: `## The Standard Template Library (STL)

The STL is one of C++'s greatest strengths — a library of generic containers, algorithms, and iterators.

### Core Containers

| Container | Description | Python Equivalent |
|-----------|-------------|-------------------|
| \`std::vector<T>\` | Dynamic array | \`list\` |
| \`std::array<T,N>\` | Fixed-size array | \`tuple\` (fixed) |
| \`std::map<K,V>\` | Ordered key-value (red-black tree) | — |
| \`std::unordered_map<K,V>\` | Hash table | \`dict\` |
| \`std::set<T>\` | Ordered unique elements | — |
| \`std::unordered_set<T>\` | Hash set | \`set\` |
| \`std::deque<T>\` | Double-ended queue | \`collections.deque\` |
| \`std::stack<T>\` | LIFO adapter | \`list\` (as stack) |
| \`std::queue<T>\` | FIFO adapter | \`collections.deque\` |

### STL Algorithms

\`\`\`cpp
#include <algorithm>
#include <vector>

std::vector<int> v = {5, 2, 8, 1, 9, 3};

std::sort(v.begin(), v.end());                    // [1,2,3,5,8,9]
auto it = std::find(v.begin(), v.end(), 5);       // iterator to 5
int count = std::count(v.begin(), v.end(), 3);    // 1

std::vector<int> doubled;
std::transform(v.begin(), v.end(),
    std::back_inserter(doubled),
    [](int x) { return x * 2; });                  // [2,4,6,10,16,18]
\`\`\`

### Iterator Concept

All STL containers expose iterators — a uniform way to traverse elements:

\`\`\`cpp
for (auto it = v.begin(); it != v.end(); ++it) {
    std::cout << *it << " ";
}
// Modern range-based for:
for (const auto& elem : v) {
    std::cout << elem << " ";
}
\`\`\`

In this module, you will implement the core STL containers and algorithms from scratch in Python.`,
    },
    {
      id: "cpp-stl-vector",
      slug: "cpp-custom-vector",
      title: "Custom Vector",
      content: `## Implementing std::vector

### How std::vector Works

\`std::vector\` is a dynamic array that:
- Stores elements contiguously in memory
- Doubles its capacity when full (amortized O(1) push_back)
- Supports random access in O(1)
- Provides \`size()\`, \`capacity()\`, \`push_back()\`, \`pop_back()\`, \`at()\`, \`operator[]\`

\`\`\`cpp
std::vector<int> v;          // size=0, capacity=0
v.push_back(1);              // size=1, capacity=1
v.push_back(2);              // size=2, capacity=2
v.push_back(3);              // size=3, capacity=4 (doubled!)
v.reserve(100);              // capacity=100, size still 3
\`\`\`

### Your Task

Implement a \`Vector\` class that mimics \`std::vector\` behavior, including capacity doubling, bounds checking, and iterator support.`,
      starterCode: `# C++ equivalent:
# std::vector<int> v;
# v.push_back(42);
# v[0];  // 42
# v.size();  // 1
# v.capacity();  // 1

class Vector:
    """Simulates std::vector<T> with dynamic resizing."""

    def __init__(self):
        # TODO: Initialize with capacity 0, size 0
        # Use a fixed-size list as the internal buffer
        pass

    def push_back(self, value):
        """Add element to end. Double capacity if full."""
        # TODO
        pass

    def pop_back(self):
        """Remove and return last element."""
        # TODO
        pass

    def at(self, index: int):
        """Bounds-checked access (like v.at(i) in C++)."""
        # TODO: Raise IndexError if out of bounds
        pass

    def __getitem__(self, index: int):
        """Unchecked access (like v[i] in C++)."""
        # TODO
        pass

    def __setitem__(self, index: int, value):
        # TODO
        pass

    def size(self) -> int:
        # TODO
        pass

    def capacity(self) -> int:
        # TODO
        pass

    def empty(self) -> bool:
        # TODO
        pass

    def reserve(self, new_capacity: int):
        """Reserve at least new_capacity. Never shrinks."""
        # TODO
        pass

    def clear(self):
        """Remove all elements but keep capacity."""
        # TODO
        pass

    def __repr__(self):
        # TODO: Show elements like [1, 2, 3]
        pass

    def __len__(self):
        return self.size()

    def __iter__(self):
        """Iterator support — like begin()/end()."""
        # TODO
        pass


# Test cases
v = Vector()
print(f"Size: {v.size()}, Capacity: {v.capacity()}")  # 0, 0

v.push_back(10)
v.push_back(20)
v.push_back(30)
print(v)                    # [10, 20, 30]
print(f"Size: {v.size()}, Capacity: {v.capacity()}")  # 3, 4

v.push_back(40)
v.push_back(50)
print(f"Size: {v.size()}, Capacity: {v.capacity()}")  # 5, 8

print(v.at(2))              # 30
print(v[0])                 # 10

v[1] = 99
print(v)                    # [10, 99, 30, 40, 50]

print(v.pop_back())         # 50
print(v.size())             # 4

# Bounds checking
try:
    v.at(100)
except IndexError as e:
    print(e)                # index out of range

# Iteration
for x in v:
    print(x, end=" ")      # 10 99 30 40
print()

# Reserve
v.reserve(100)
print(v.capacity())         # 100
print(v.size())             # 4
`,
      solutionCode: `# C++ equivalent:
# std::vector<int> v;
# v.push_back(42);
# v[0];  // 42
# v.size();  // 1
# v.capacity();  // 1

class Vector:
    """Simulates std::vector<T> with dynamic resizing."""

    def __init__(self):
        self._data = []
        self._size = 0
        self._capacity = 0

    def _grow(self):
        new_cap = max(1, self._capacity * 2)
        new_data = [None] * new_cap
        for i in range(self._size):
            new_data[i] = self._data[i]
        self._data = new_data
        self._capacity = new_cap

    def push_back(self, value):
        if self._size == self._capacity:
            self._grow()
        self._data[self._size] = value
        self._size += 1

    def pop_back(self):
        if self._size == 0:
            raise IndexError("pop_back on empty vector")
        self._size -= 1
        val = self._data[self._size]
        self._data[self._size] = None
        return val

    def at(self, index: int):
        if index < 0 or index >= self._size:
            raise IndexError("index out of range")
        return self._data[index]

    def __getitem__(self, index: int):
        return self._data[index]

    def __setitem__(self, index: int, value):
        if index < 0 or index >= self._size:
            raise IndexError("index out of range")
        self._data[index] = value

    def size(self) -> int:
        return self._size

    def capacity(self) -> int:
        return self._capacity

    def empty(self) -> bool:
        return self._size == 0

    def reserve(self, new_capacity: int):
        if new_capacity <= self._capacity:
            return
        new_data = [None] * new_capacity
        for i in range(self._size):
            new_data[i] = self._data[i]
        self._data = new_data
        self._capacity = new_capacity

    def clear(self):
        for i in range(self._size):
            self._data[i] = None
        self._size = 0

    def __repr__(self):
        elements = [str(self._data[i]) for i in range(self._size)]
        return "[" + ", ".join(elements) + "]"

    def __len__(self):
        return self._size

    def __iter__(self):
        for i in range(self._size):
            yield self._data[i]


# Test cases
v = Vector()
print(f"Size: {v.size()}, Capacity: {v.capacity()}")  # 0, 0

v.push_back(10)
v.push_back(20)
v.push_back(30)
print(v)                    # [10, 20, 30]
print(f"Size: {v.size()}, Capacity: {v.capacity()}")  # 3, 4

v.push_back(40)
v.push_back(50)
print(f"Size: {v.size()}, Capacity: {v.capacity()}")  # 5, 8

print(v.at(2))              # 30
print(v[0])                 # 10

v[1] = 99
print(v)                    # [10, 99, 30, 40, 50]

print(v.pop_back())         # 50
print(v.size())             # 4

# Bounds checking
try:
    v.at(100)
except IndexError as e:
    print(e)                # index out of range

# Iteration
for x in v:
    print(x, end=" ")      # 10 99 30 40
print()

# Reserve
v.reserve(100)
print(v.capacity())         # 100
print(v.size())             # 4
`,
    },
    {
      id: "cpp-stl-hashmap",
      slug: "cpp-custom-hashmap",
      title: "Custom HashMap",
      content: `## Implementing std::unordered_map

### How Hash Maps Work

\`std::unordered_map\` uses a hash table with chaining:

\`\`\`cpp
std::unordered_map<std::string, int> ages;
ages["Alice"] = 30;
ages["Bob"] = 25;
ages.count("Alice");    // 1 (exists)
ages.erase("Bob");
\`\`\`

Internally: \`hash(key) % bucket_count\` determines the bucket, and a linked list in each bucket handles collisions.

### Your Task

Implement a hash map from scratch using separate chaining (list of key-value pairs per bucket). Include automatic resizing when the load factor exceeds a threshold.`,
      starterCode: `# C++ equivalent:
# std::unordered_map<std::string, int> map;
# map["key"] = value;
# map.find("key");

class HashMap:
    """Simulates std::unordered_map with separate chaining."""

    def __init__(self, initial_capacity: int = 8, load_factor: float = 0.75):
        # TODO: Initialize buckets (list of lists), size, capacity, load factor
        pass

    def _hash(self, key) -> int:
        """Hash function — maps key to bucket index."""
        # TODO
        pass

    def _resize(self):
        """Double capacity and rehash all entries."""
        # TODO
        pass

    def put(self, key, value):
        """Insert or update key-value pair. Resize if load factor exceeded."""
        # TODO
        pass

    def get(self, key, default=None):
        """Get value by key. Return default if not found."""
        # TODO
        pass

    def remove(self, key) -> bool:
        """Remove key. Return True if found, False otherwise."""
        # TODO
        pass

    def contains(self, key) -> bool:
        """Check if key exists."""
        # TODO
        pass

    def keys(self) -> list:
        # TODO
        pass

    def values(self) -> list:
        # TODO
        pass

    def size(self) -> int:
        # TODO
        pass

    def __setitem__(self, key, value):
        self.put(key, value)

    def __getitem__(self, key):
        result = self.get(key)
        if result is None and not self.contains(key):
            raise KeyError(key)
        return result

    def __repr__(self):
        # TODO
        pass


# Test cases
m = HashMap()
m.put("Alice", 30)
m.put("Bob", 25)
m.put("Charlie", 35)

print(m.get("Alice"))         # Expected: 30
print(m.get("Bob"))           # Expected: 25
print(m.contains("Charlie"))  # Expected: True
print(m.contains("David"))    # Expected: False
print(m.size())               # Expected: 3

# Update existing key
m.put("Alice", 31)
print(m["Alice"])             # Expected: 31

# Remove
m.remove("Bob")
print(m.contains("Bob"))     # Expected: False
print(m.size())               # Expected: 2

# Test resizing by adding many entries
for i in range(20):
    m[f"key_{i}"] = i
print(m.size())               # Expected: 22
print(m.get("key_15"))        # Expected: 15
`,
      solutionCode: `# C++ equivalent:
# std::unordered_map<std::string, int> map;
# map["key"] = value;
# map.find("key");

class HashMap:
    """Simulates std::unordered_map with separate chaining."""

    def __init__(self, initial_capacity: int = 8, load_factor: float = 0.75):
        self._capacity = initial_capacity
        self._load_factor = load_factor
        self._size = 0
        self._buckets = [[] for _ in range(self._capacity)]

    def _hash(self, key) -> int:
        return hash(key) % self._capacity

    def _resize(self):
        old_buckets = self._buckets
        self._capacity *= 2
        self._buckets = [[] for _ in range(self._capacity)]
        self._size = 0
        for bucket in old_buckets:
            for key, value in bucket:
                self.put(key, value)

    def put(self, key, value):
        if self._size >= self._capacity * self._load_factor:
            self._resize()
        idx = self._hash(key)
        for i, (k, v) in enumerate(self._buckets[idx]):
            if k == key:
                self._buckets[idx][i] = (key, value)
                return
        self._buckets[idx].append((key, value))
        self._size += 1

    def get(self, key, default=None):
        idx = self._hash(key)
        for k, v in self._buckets[idx]:
            if k == key:
                return v
        return default

    def remove(self, key) -> bool:
        idx = self._hash(key)
        for i, (k, v) in enumerate(self._buckets[idx]):
            if k == key:
                self._buckets[idx].pop(i)
                self._size -= 1
                return True
        return False

    def contains(self, key) -> bool:
        idx = self._hash(key)
        return any(k == key for k, v in self._buckets[idx])

    def keys(self) -> list:
        result = []
        for bucket in self._buckets:
            for k, v in bucket:
                result.append(k)
        return result

    def values(self) -> list:
        result = []
        for bucket in self._buckets:
            for k, v in bucket:
                result.append(v)
        return result

    def size(self) -> int:
        return self._size

    def __setitem__(self, key, value):
        self.put(key, value)

    def __getitem__(self, key):
        result = self.get(key)
        if result is None and not self.contains(key):
            raise KeyError(key)
        return result

    def __repr__(self):
        pairs = []
        for bucket in self._buckets:
            for k, v in bucket:
                pairs.append(f"{k}: {v}")
        return "{" + ", ".join(pairs) + "}"


# Test cases
m = HashMap()
m.put("Alice", 30)
m.put("Bob", 25)
m.put("Charlie", 35)

print(m.get("Alice"))         # Expected: 30
print(m.get("Bob"))           # Expected: 25
print(m.contains("Charlie"))  # Expected: True
print(m.contains("David"))    # Expected: False
print(m.size())               # Expected: 3

# Update existing key
m.put("Alice", 31)
print(m["Alice"])             # Expected: 31

# Remove
m.remove("Bob")
print(m.contains("Bob"))     # Expected: False
print(m.size())               # Expected: 2

# Test resizing by adding many entries
for i in range(20):
    m[f"key_{i}"] = i
print(m.size())               # Expected: 22
print(m.get("key_15"))        # Expected: 15
`,
    },
    {
      id: "cpp-stl-algorithms",
      slug: "cpp-algorithm-library",
      title: "Algorithm Library",
      content: `## STL Algorithms — Sort, Find, Transform

### C++ \`<algorithm>\` Header

C++ separates algorithms from containers. Algorithms operate on iterator ranges:

\`\`\`cpp
std::vector<int> v = {5, 2, 8, 1, 9};

// Sort
std::sort(v.begin(), v.end());

// Find
auto it = std::find(v.begin(), v.end(), 8);

// Transform (map)
std::vector<int> doubled;
std::transform(v.begin(), v.end(), std::back_inserter(doubled),
    [](int x) { return x * 2; });

// Accumulate (reduce/fold)
int sum = std::accumulate(v.begin(), v.end(), 0);

// Count if
int evens = std::count_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; });
\`\`\`

### Your Task

Implement these STL algorithms as standalone functions that work on Python lists — mimicking the separation of algorithms from containers.`,
      starterCode: `# C++ equivalent:
# std::sort(v.begin(), v.end());
# std::find(v.begin(), v.end(), target);
# std::transform(v.begin(), v.end(), out, func);

def my_sort(data: list, key=None, reverse=False) -> list:
    """Implement merge sort (like std::sort, which uses introsort).
    Return a new sorted list."""
    # TODO: Implement merge sort
    pass

def my_find(data: list, target) -> int:
    """Return index of first occurrence, or -1 if not found.
    Like std::find returning an iterator."""
    # TODO
    pass

def my_find_if(data: list, predicate) -> int:
    """Return index of first element matching predicate, or -1.
    Like std::find_if."""
    # TODO
    pass

def my_transform(data: list, func) -> list:
    """Apply func to each element, return new list.
    Like std::transform."""
    # TODO
    pass

def my_accumulate(data: list, initial, func=None):
    """Fold/reduce with initial value.
    Like std::accumulate."""
    # TODO
    pass

def my_count_if(data: list, predicate) -> int:
    """Count elements matching predicate.
    Like std::count_if."""
    # TODO
    pass

def my_all_of(data: list, predicate) -> bool:
    """True if all elements match predicate."""
    # TODO
    pass

def my_any_of(data: list, predicate) -> bool:
    """True if any element matches predicate."""
    # TODO
    pass

def my_none_of(data: list, predicate) -> bool:
    """True if no element matches predicate."""
    # TODO
    pass


# Test cases
data = [5, 2, 8, 1, 9, 3, 7, 4, 6]

# Sort
print(my_sort(data))                    # [1, 2, 3, 4, 5, 6, 7, 8, 9]
print(my_sort(data, reverse=True))      # [9, 8, 7, 6, 5, 4, 3, 2, 1]

# Find
print(my_find(data, 8))                 # 2
print(my_find(data, 99))                # -1

# Find if
print(my_find_if(data, lambda x: x > 7))  # 2 (first element > 7 is 8)

# Transform
print(my_transform(data, lambda x: x * 2))  # [10, 4, 16, 2, 18, 6, 14, 8, 12]

# Accumulate
print(my_accumulate(data, 0))           # 45 (sum)
print(my_accumulate(data, 1, lambda a, b: a * b))  # 362880 (product)

# Count if
print(my_count_if(data, lambda x: x % 2 == 0))  # 4 (2, 8, 4, 6)

# All/any/none
print(my_all_of(data, lambda x: x > 0))      # True
print(my_any_of(data, lambda x: x > 8))      # True
print(my_none_of(data, lambda x: x > 10))    # True
`,
      solutionCode: `# C++ equivalent:
# std::sort(v.begin(), v.end());
# std::find(v.begin(), v.end(), target);
# std::transform(v.begin(), v.end(), out, func);

def my_sort(data: list, key=None, reverse=False) -> list:
    """Implement merge sort."""
    if len(data) <= 1:
        return data[:]

    mid = len(data) // 2
    left = my_sort(data[:mid], key=key, reverse=reverse)
    right = my_sort(data[mid:], key=key, reverse=reverse)

    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        lval = key(left[i]) if key else left[i]
        rval = key(right[j]) if key else right[j]
        if reverse:
            if lval >= rval:
                result.append(left[i]); i += 1
            else:
                result.append(right[j]); j += 1
        else:
            if lval <= rval:
                result.append(left[i]); i += 1
            else:
                result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

def my_find(data: list, target) -> int:
    for i, val in enumerate(data):
        if val == target:
            return i
    return -1

def my_find_if(data: list, predicate) -> int:
    for i, val in enumerate(data):
        if predicate(val):
            return i
    return -1

def my_transform(data: list, func) -> list:
    return [func(x) for x in data]

def my_accumulate(data: list, initial, func=None):
    result = initial
    for x in data:
        if func:
            result = func(result, x)
        else:
            result = result + x
    return result

def my_count_if(data: list, predicate) -> int:
    count = 0
    for x in data:
        if predicate(x):
            count += 1
    return count

def my_all_of(data: list, predicate) -> bool:
    for x in data:
        if not predicate(x):
            return False
    return True

def my_any_of(data: list, predicate) -> bool:
    for x in data:
        if predicate(x):
            return True
    return False

def my_none_of(data: list, predicate) -> bool:
    return not my_any_of(data, predicate)


# Test cases
data = [5, 2, 8, 1, 9, 3, 7, 4, 6]

# Sort
print(my_sort(data))                    # [1, 2, 3, 4, 5, 6, 7, 8, 9]
print(my_sort(data, reverse=True))      # [9, 8, 7, 6, 5, 4, 3, 2, 1]

# Find
print(my_find(data, 8))                 # 2
print(my_find(data, 99))                # -1

# Find if
print(my_find_if(data, lambda x: x > 7))  # 2 (first element > 7 is 8)

# Transform
print(my_transform(data, lambda x: x * 2))  # [10, 4, 16, 2, 18, 6, 14, 8, 12]

# Accumulate
print(my_accumulate(data, 0))           # 45 (sum)
print(my_accumulate(data, 1, lambda a, b: a * b))  # 362880 (product)

# Count if
print(my_count_if(data, lambda x: x % 2 == 0))  # 4 (2, 8, 4, 6)

# All/any/none
print(my_all_of(data, lambda x: x > 0))      # True
print(my_any_of(data, lambda x: x > 8))      # True
print(my_none_of(data, lambda x: x > 10))    # True
`,
    },
  ],
};
