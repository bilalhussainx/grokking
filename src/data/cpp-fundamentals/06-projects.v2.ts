import { Module } from "../types";

export const cppProjectsModule: Module = {
  id: "cpp-projects",
  title: "Projects",
  description: "Apply everything you have learned — build a memory pool allocator, expression parser, and mini database engine.",
  lessons: [
    {
      id: "cpp-projects-intro",
      slug: "cpp-projects-intro",
      title: "Introduction to Projects",
      content: `## Capstone Projects

These projects integrate multiple C++ concepts into realistic systems:

### Project 1: Memory Pool Allocator
- Fixed-size block allocation (like game engines use)
- Concepts: pointers, memory management, RAII

### Project 2: Expression Parser
- Parse and evaluate mathematical expressions
- Concepts: operator precedence, stacks, recursion, OOP

### Project 3: Mini Database
- B-tree index for fast key lookup
- Concepts: templates, iterators, data structures, memory management

Each project builds on the patterns you have learned throughout the course. Take your time and test incrementally.`,
    },
    {
      id: "cpp-projects-memory-pool",
      slug: "cpp-memory-pool",
      title: "Memory Pool Allocator",
      content: `## Memory Pool Allocator

### What Is a Memory Pool?

Game engines and real-time systems avoid calling \`new\`/\`delete\` repeatedly because system allocators are slow and cause fragmentation. Instead, they pre-allocate a large block and manage it themselves.

\`\`\`cpp
// C++ pool allocator concept
class PoolAllocator {
    char* memory;         // pre-allocated block
    size_t block_size;    // fixed size per allocation
    size_t block_count;
    std::vector<void*> free_list;  // available blocks
public:
    void* allocate();     // O(1) — pop from free list
    void deallocate(void* p); // O(1) — push to free list
};
\`\`\`

### Your Task

Implement a pool allocator that pre-allocates N blocks of fixed size. Allocation and deallocation should both be O(1).`,
      starterCode: `# C++ equivalent:
# PoolAllocator pool(sizeof(Particle), 1000);
# Particle* p = (Particle*)pool.allocate();
# pool.deallocate(p);

class PoolAllocator:
    """Fixed-size block pool allocator — O(1) alloc and free."""

    def __init__(self, block_size: int, block_count: int):
        # TODO: Pre-allocate blocks, build free list
        # Each block is identified by its index
        pass

    def allocate(self) -> int:
        """Allocate a block. Returns block index.
        Raise MemoryError if pool exhausted."""
        # TODO
        pass

    def deallocate(self, block_id: int):
        """Return block to pool.
        Raise ValueError for double-free or invalid block."""
        # TODO
        pass

    def read(self, block_id: int):
        """Read data from an allocated block."""
        # TODO
        pass

    def write(self, block_id: int, data):
        """Write data to an allocated block."""
        # TODO
        pass

    @property
    def stats(self) -> dict:
        """Return pool statistics."""
        # TODO: Return dict with total, used, free, fragmentation info
        pass

    def reset(self):
        """Free all blocks at once — O(n)."""
        # TODO
        pass


class ObjectPool:
    """Higher-level: typed object pool built on PoolAllocator."""

    def __init__(self, factory, count: int):
        """factory: callable that creates a new object.
        count: max number of objects."""
        # TODO
        pass

    def acquire(self):
        """Get an object from the pool."""
        # TODO
        pass

    def release(self, obj):
        """Return object to pool."""
        # TODO
        pass

    @property
    def available(self) -> int:
        # TODO
        pass


# Test cases
pool = PoolAllocator(block_size=64, block_count=5)
print(pool.stats)  # total=5, used=0, free=5

b1 = pool.allocate()
b2 = pool.allocate()
b3 = pool.allocate()
pool.write(b1, "particle_1")
pool.write(b2, "particle_2")
print(pool.read(b1))           # Expected: particle_1
print(pool.stats)              # total=5, used=3, free=2

pool.deallocate(b2)
print(pool.stats)              # total=5, used=2, free=3

# Reuse freed block
b4 = pool.allocate()
pool.write(b4, "reused")
print(pool.read(b4))           # Expected: reused

# Double free detection
try:
    pool.deallocate(b2)
except ValueError as e:
    print(e)                   # Expected: Block not allocated

# Exhaust pool
pool.allocate()
pool.allocate()
try:
    pool.allocate()
except MemoryError as e:
    print(e)                   # Expected: Pool exhausted

# Reset
pool.reset()
print(pool.stats)              # total=5, used=0, free=5

# ObjectPool test
class Particle:
    def __init__(self):
        self.x = 0
        self.y = 0
        self.active = False

obj_pool = ObjectPool(Particle, 3)
p1 = obj_pool.acquire()
p1.x = 10
p1.active = True
print(f"Particle at ({p1.x}, {p1.y})")  # (10, 0)
print(f"Available: {obj_pool.available}")  # 2

obj_pool.release(p1)
print(f"Available: {obj_pool.available}")  # 3
`,
      solutionCode: `# C++ equivalent:
# PoolAllocator pool(sizeof(Particle), 1000);
# Particle* p = (Particle*)pool.allocate();
# pool.deallocate(p);

class PoolAllocator:
    """Fixed-size block pool allocator — O(1) alloc and free."""

    def __init__(self, block_size: int, block_count: int):
        self._block_size = block_size
        self._block_count = block_count
        self._data = [None] * block_count
        self._free_list = list(range(block_count))
        self._allocated = set()

    def allocate(self) -> int:
        if not self._free_list:
            raise MemoryError("Pool exhausted")
        block_id = self._free_list.pop()
        self._allocated.add(block_id)
        return block_id

    def deallocate(self, block_id: int):
        if block_id not in self._allocated:
            raise ValueError("Block not allocated")
        self._allocated.remove(block_id)
        self._data[block_id] = None
        self._free_list.append(block_id)

    def read(self, block_id: int):
        if block_id not in self._allocated:
            raise ValueError("Block not allocated")
        return self._data[block_id]

    def write(self, block_id: int, data):
        if block_id not in self._allocated:
            raise ValueError("Block not allocated")
        self._data[block_id] = data

    @property
    def stats(self) -> dict:
        return {
            "total": self._block_count,
            "used": len(self._allocated),
            "free": len(self._free_list),
        }

    def reset(self):
        self._data = [None] * self._block_count
        self._free_list = list(range(self._block_count))
        self._allocated.clear()


class ObjectPool:
    """Higher-level: typed object pool built on PoolAllocator."""

    def __init__(self, factory, count: int):
        self._factory = factory
        self._pool = [factory() for _ in range(count)]
        self._available_objs = list(self._pool)

    def acquire(self):
        if not self._available_objs:
            raise RuntimeError("Object pool exhausted")
        return self._available_objs.pop()

    def release(self, obj):
        self._available_objs.append(obj)

    @property
    def available(self) -> int:
        return len(self._available_objs)


# Test cases
pool = PoolAllocator(block_size=64, block_count=5)
print(pool.stats)  # total=5, used=0, free=5

b1 = pool.allocate()
b2 = pool.allocate()
b3 = pool.allocate()
pool.write(b1, "particle_1")
pool.write(b2, "particle_2")
print(pool.read(b1))           # Expected: particle_1
print(pool.stats)              # total=5, used=3, free=2

pool.deallocate(b2)
print(pool.stats)              # total=5, used=2, free=3

# Reuse freed block
b4 = pool.allocate()
pool.write(b4, "reused")
print(pool.read(b4))           # Expected: reused

# Double free detection
try:
    pool.deallocate(b2)
except ValueError as e:
    print(e)                   # Expected: Block not allocated

# Exhaust pool
pool.allocate()
pool.allocate()
try:
    pool.allocate()
except MemoryError as e:
    print(e)                   # Expected: Pool exhausted

# Reset
pool.reset()
print(pool.stats)              # total=5, used=0, free=5

# ObjectPool test
class Particle:
    def __init__(self):
        self.x = 0
        self.y = 0
        self.active = False

obj_pool = ObjectPool(Particle, 3)
p1 = obj_pool.acquire()
p1.x = 10
p1.active = True
print(f"Particle at ({p1.x}, {p1.y})")  # (10, 0)
print(f"Available: {obj_pool.available}")  # 2

obj_pool.release(p1)
print(f"Available: {obj_pool.available}")  # 3
`,
    },
    {
      id: "cpp-projects-expression-parser",
      slug: "cpp-expression-parser",
      title: "Expression Parser",
      content: `## Expression Parser — Parse & Evaluate Math

### The Problem

Build a parser that handles mathematical expressions with:
- Numbers (integers and floats)
- Operators: \`+\`, \`-\`, \`*\`, \`/\`, \`^\` (power)
- Parentheses for grouping
- Operator precedence and associativity

This is how C++ compilers parse expressions internally.

### Approach: Shunting-Yard Algorithm

Dijkstra's algorithm converts infix to postfix (RPN), then evaluates:

\`\`\`
Infix:   3 + 4 * 2 / (1 - 5) ^ 2
Postfix: 3 4 2 * 1 5 - 2 ^ / +
Result:  3.5
\`\`\``,
      starterCode: `# C++ equivalent:
# Expression parser using recursive descent or shunting-yard
# Like a mini compiler front-end

class Token:
    NUMBER = "NUMBER"
    OPERATOR = "OPERATOR"
    LPAREN = "LPAREN"
    RPAREN = "RPAREN"

    def __init__(self, type: str, value):
        self.type = type
        self.value = value

    def __repr__(self):
        return f"Token({self.type}, {self.value})"


def tokenize(expression: str) -> list:
    """Convert expression string to list of tokens."""
    # TODO: Handle numbers (int/float), operators (+,-,*,/,^), parens
    # Handle negative numbers (unary minus)
    pass


class ExpressionParser:
    """Evaluates mathematical expressions using shunting-yard algorithm."""

    PRECEDENCE = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}
    RIGHT_ASSOC = {'^'}

    def __init__(self):
        pass

    def to_postfix(self, tokens: list) -> list:
        """Convert infix tokens to postfix (RPN) using shunting-yard."""
        # TODO
        pass

    def evaluate_postfix(self, postfix: list) -> float:
        """Evaluate a postfix expression."""
        # TODO
        pass

    def evaluate(self, expression: str) -> float:
        """Parse and evaluate an expression string."""
        # TODO: tokenize -> to_postfix -> evaluate_postfix
        pass


# Test cases
parser = ExpressionParser()

print(parser.evaluate("3 + 4"))              # Expected: 7
print(parser.evaluate("3 + 4 * 2"))          # Expected: 11
print(parser.evaluate("(3 + 4) * 2"))        # Expected: 14
print(parser.evaluate("2 ^ 3"))              # Expected: 8
print(parser.evaluate("10 / 3"))             # Expected: 3.333...
print(parser.evaluate("3 + 4 * 2 / (1 - 5) ^ 2"))  # Expected: 3.5

# Test tokenizer
tokens = tokenize("3 + 4 * 2")
print(tokens)  # [Token(NUMBER, 3), Token(OPERATOR, +), Token(NUMBER, 4), ...]

# Edge cases
print(parser.evaluate("(((5)))"))            # Expected: 5
print(parser.evaluate("2 ^ 2 ^ 3"))          # Expected: 256 (right-associative)
`,
      solutionCode: `# C++ equivalent:
# Expression parser using recursive descent or shunting-yard
# Like a mini compiler front-end

class Token:
    NUMBER = "NUMBER"
    OPERATOR = "OPERATOR"
    LPAREN = "LPAREN"
    RPAREN = "RPAREN"

    def __init__(self, type: str, value):
        self.type = type
        self.value = value

    def __repr__(self):
        return f"Token({self.type}, {self.value})"


def tokenize(expression: str) -> list:
    """Convert expression string to list of tokens."""
    tokens = []
    i = 0
    while i < len(expression):
        ch = expression[i]
        if ch.isspace():
            i += 1
            continue
        if ch in "+-" and (not tokens or tokens[-1].type in (Token.OPERATOR, Token.LPAREN)):
            # Unary +/-
            j = i + 1
            while j < len(expression) and (expression[j].isdigit() or expression[j] == '.'):
                j += 1
            tokens.append(Token(Token.NUMBER, float(expression[i:j])))
            i = j
        elif ch.isdigit() or ch == '.':
            j = i
            while j < len(expression) and (expression[j].isdigit() or expression[j] == '.'):
                j += 1
            tokens.append(Token(Token.NUMBER, float(expression[i:j])))
            i = j
        elif ch in "+-*/^":
            tokens.append(Token(Token.OPERATOR, ch))
            i += 1
        elif ch == '(':
            tokens.append(Token(Token.LPAREN, '('))
            i += 1
        elif ch == ')':
            tokens.append(Token(Token.RPAREN, ')'))
            i += 1
        else:
            raise ValueError(f"Unexpected character: {ch}")
    return tokens


class ExpressionParser:
    """Evaluates mathematical expressions using shunting-yard algorithm."""

    PRECEDENCE = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}
    RIGHT_ASSOC = {'^'}

    def __init__(self):
        pass

    def to_postfix(self, tokens: list) -> list:
        output = []
        op_stack = []
        for token in tokens:
            if token.type == Token.NUMBER:
                output.append(token)
            elif token.type == Token.OPERATOR:
                while (op_stack and op_stack[-1].type == Token.OPERATOR and
                       ((token.value not in self.RIGHT_ASSOC and
                         self.PRECEDENCE.get(op_stack[-1].value, 0) >= self.PRECEDENCE.get(token.value, 0)) or
                        (token.value in self.RIGHT_ASSOC and
                         self.PRECEDENCE.get(op_stack[-1].value, 0) > self.PRECEDENCE.get(token.value, 0)))):
                    output.append(op_stack.pop())
                op_stack.append(token)
            elif token.type == Token.LPAREN:
                op_stack.append(token)
            elif token.type == Token.RPAREN:
                while op_stack and op_stack[-1].type != Token.LPAREN:
                    output.append(op_stack.pop())
                if op_stack:
                    op_stack.pop()  # remove LPAREN
        while op_stack:
            output.append(op_stack.pop())
        return output

    def evaluate_postfix(self, postfix: list) -> float:
        stack = []
        for token in postfix:
            if token.type == Token.NUMBER:
                stack.append(token.value)
            elif token.type == Token.OPERATOR:
                b = stack.pop()
                a = stack.pop()
                if token.value == '+': stack.append(a + b)
                elif token.value == '-': stack.append(a - b)
                elif token.value == '*': stack.append(a * b)
                elif token.value == '/': stack.append(a / b)
                elif token.value == '^': stack.append(a ** b)
        return stack[0]

    def evaluate(self, expression: str) -> float:
        tokens = tokenize(expression)
        postfix = self.to_postfix(tokens)
        return self.evaluate_postfix(postfix)


# Test cases
parser = ExpressionParser()

print(parser.evaluate("3 + 4"))              # Expected: 7
print(parser.evaluate("3 + 4 * 2"))          # Expected: 11
print(parser.evaluate("(3 + 4) * 2"))        # Expected: 14
print(parser.evaluate("2 ^ 3"))              # Expected: 8
print(parser.evaluate("10 / 3"))             # Expected: 3.333...
print(parser.evaluate("3 + 4 * 2 / (1 - 5) ^ 2"))  # Expected: 3.5

# Test tokenizer
tokens = tokenize("3 + 4 * 2")
print(tokens)  # [Token(NUMBER, 3), Token(OPERATOR, +), Token(NUMBER, 4), ...]

# Edge cases
print(parser.evaluate("(((5)))"))            # Expected: 5
print(parser.evaluate("2 ^ 2 ^ 3"))          # Expected: 256 (right-associative)
`,
    },
    {
      id: "cpp-projects-mini-database",
      slug: "cpp-mini-database",
      title: "Mini Database",
      content: `## Mini Database Engine with B-Tree Index

### The Concept

Real databases use B-trees for indexing. A B-tree of order \`t\` has:
- Each node has at most \`2t - 1\` keys
- Each node has at most \`2t\` children
- All leaves are at the same depth
- Search, insert, delete are all O(log n)

### Your Task

Build a simple database with:
1. A B-tree index for fast key lookup
2. Table storage with insert, select, and delete operations
3. Simple query support`,
      starterCode: `# C++ equivalent:
# B-tree index like what SQLite or MySQL InnoDB uses
# template<typename Key, typename Value>
# class BTree { ... };

class BTreeNode:
    """A node in the B-tree."""

    def __init__(self, t: int, leaf: bool = True):
        # TODO: t = minimum degree
        # keys: list of keys
        # values: list of values (parallel to keys)
        # children: list of child nodes
        # leaf: True if leaf node
        pass


class BTree:
    """B-tree index — O(log n) search, insert, delete."""

    def __init__(self, t: int = 3):
        """t = minimum degree (min keys per node = t-1, max = 2t-1)."""
        # TODO
        pass

    def search(self, key):
        """Search for a key. Return value or None."""
        # TODO
        pass

    def insert(self, key, value):
        """Insert key-value pair."""
        # TODO: Handle node splitting when full
        pass

    def delete(self, key):
        """Delete a key."""
        # TODO
        pass

    def range_query(self, low, high) -> list:
        """Return all (key, value) pairs where low <= key <= high."""
        # TODO
        pass

    def display(self):
        """Print tree structure for debugging."""
        # TODO
        pass


class MiniDB:
    """Simple database with B-tree indexing."""

    def __init__(self):
        # TODO: tables dict, each table has data + index
        pass

    def create_table(self, name: str, columns: list, primary_key: str):
        """Create a new table with given columns and primary key."""
        # TODO
        pass

    def insert(self, table: str, row: dict):
        """Insert a row into a table."""
        # TODO: Validate columns, check unique primary key, index
        pass

    def select(self, table: str, where: dict = None) -> list:
        """Select rows. If where has primary key, use index."""
        # TODO
        pass

    def delete(self, table: str, where: dict):
        """Delete matching rows."""
        # TODO
        pass

    def count(self, table: str) -> int:
        # TODO
        pass


# Test cases
db = MiniDB()

# Create table
db.create_table("users", ["id", "name", "age", "email"], primary_key="id")

# Insert rows
db.insert("users", {"id": 1, "name": "Alice", "age": 30, "email": "alice@test.com"})
db.insert("users", {"id": 2, "name": "Bob", "age": 25, "email": "bob@test.com"})
db.insert("users", {"id": 3, "name": "Charlie", "age": 35, "email": "charlie@test.com"})
db.insert("users", {"id": 4, "name": "Diana", "age": 28, "email": "diana@test.com"})
db.insert("users", {"id": 5, "name": "Eve", "age": 32, "email": "eve@test.com"})

print(f"Count: {db.count('users')}")  # Expected: 5

# Select by primary key (uses B-tree index — fast)
result = db.select("users", {"id": 3})
print(result)  # Expected: [{'id': 3, 'name': 'Charlie', ...}]

# Select by non-key (linear scan)
result = db.select("users", {"age": 30})
print(result)  # Expected: [{'id': 1, 'name': 'Alice', ...}]

# Select all
all_users = db.select("users")
print(f"All users: {len(all_users)}")  # Expected: 5

# Delete
db.delete("users", {"id": 2})
print(f"After delete: {db.count('users')}")  # Expected: 4

# Verify deletion
result = db.select("users", {"id": 2})
print(f"Deleted user: {result}")  # Expected: []

# Duplicate key detection
try:
    db.insert("users", {"id": 1, "name": "Duplicate", "age": 99, "email": "dup@test.com"})
except ValueError as e:
    print(e)  # Expected: Duplicate primary key
`,
      solutionCode: `# C++ equivalent:
# B-tree index like what SQLite or MySQL InnoDB uses
# template<typename Key, typename Value>
# class BTree { ... };

class BTreeNode:
    """A node in the B-tree."""

    def __init__(self, t: int, leaf: bool = True):
        self.t = t
        self.keys = []
        self.values = []
        self.children = []
        self.leaf = leaf


class BTree:
    """B-tree index — O(log n) search, insert, delete."""

    def __init__(self, t: int = 3):
        self.t = t
        self.root = BTreeNode(t, leaf=True)

    def search(self, key, node=None):
        if node is None:
            node = self.root
        i = 0
        while i < len(node.keys) and key > node.keys[i]:
            i += 1
        if i < len(node.keys) and key == node.keys[i]:
            return node.values[i]
        if node.leaf:
            return None
        return self.search(key, node.children[i])

    def insert(self, key, value):
        root = self.root
        if len(root.keys) == 2 * self.t - 1:
            new_root = BTreeNode(self.t, leaf=False)
            new_root.children.append(self.root)
            self._split_child(new_root, 0)
            self.root = new_root
        self._insert_non_full(self.root, key, value)

    def _split_child(self, parent, i):
        t = self.t
        child = parent.children[i]
        new_node = BTreeNode(t, leaf=child.leaf)
        mid = t - 1
        parent.keys.insert(i, child.keys[mid])
        parent.values.insert(i, child.values[mid])
        parent.children.insert(i + 1, new_node)
        new_node.keys = child.keys[mid + 1:]
        new_node.values = child.values[mid + 1:]
        child.keys = child.keys[:mid]
        child.values = child.values[:mid]
        if not child.leaf:
            new_node.children = child.children[mid + 1:]
            child.children = child.children[:mid + 1]

    def _insert_non_full(self, node, key, value):
        i = len(node.keys) - 1
        if node.leaf:
            while i >= 0 and key < node.keys[i]:
                i -= 1
            node.keys.insert(i + 1, key)
            node.values.insert(i + 1, value)
        else:
            while i >= 0 and key < node.keys[i]:
                i -= 1
            i += 1
            if len(node.children[i].keys) == 2 * self.t - 1:
                self._split_child(node, i)
                if key > node.keys[i]:
                    i += 1
            self._insert_non_full(node.children[i], key, value)

    def delete(self, key):
        self._delete_key(self.root, key)
        if len(self.root.keys) == 0 and not self.root.leaf:
            self.root = self.root.children[0]

    def _delete_key(self, node, key):
        i = 0
        while i < len(node.keys) and key > node.keys[i]:
            i += 1
        if i < len(node.keys) and key == node.keys[i]:
            node.keys.pop(i)
            node.values.pop(i)
            return True
        if node.leaf:
            return False
        return self._delete_key(node.children[i], key)

    def range_query(self, low, high, node=None, result=None):
        if result is None:
            result = []
        if node is None:
            node = self.root
        for i in range(len(node.keys)):
            if not node.leaf:
                if node.keys[i] >= low:
                    self.range_query(low, high, node.children[i], result)
            if low <= node.keys[i] <= high:
                result.append((node.keys[i], node.values[i]))
        if not node.leaf and len(node.children) > len(node.keys):
            if node.keys and node.keys[-1] <= high:
                self.range_query(low, high, node.children[-1], result)
        return result

    def display(self, node=None, level=0):
        if node is None:
            node = self.root
        print("  " * level + f"Keys: {node.keys}")
        for child in node.children:
            self.display(child, level + 1)


class MiniDB:
    """Simple database with B-tree indexing."""

    def __init__(self):
        self._tables = {}

    def create_table(self, name: str, columns: list, primary_key: str):
        if name in self._tables:
            raise ValueError(f"Table '{name}' already exists")
        if primary_key not in columns:
            raise ValueError(f"Primary key '{primary_key}' not in columns")
        self._tables[name] = {
            "columns": columns,
            "primary_key": primary_key,
            "rows": [],
            "index": BTree(t=3),
        }

    def insert(self, table: str, row: dict):
        t = self._tables[table]
        pk = row[t["primary_key"]]
        if t["index"].search(pk) is not None:
            raise ValueError("Duplicate primary key")
        idx = len(t["rows"])
        t["rows"].append(row)
        t["index"].insert(pk, idx)

    def select(self, table: str, where: dict = None) -> list:
        t = self._tables[table]
        if where is None:
            return [r for r in t["rows"] if r is not None]
        pk_col = t["primary_key"]
        if pk_col in where:
            idx = t["index"].search(where[pk_col])
            if idx is not None and t["rows"][idx] is not None:
                return [t["rows"][idx]]
            return []
        results = []
        for row in t["rows"]:
            if row is None:
                continue
            if all(row.get(k) == v for k, v in where.items()):
                results.append(row)
        return results

    def delete(self, table: str, where: dict):
        t = self._tables[table]
        pk_col = t["primary_key"]
        if pk_col in where:
            idx = t["index"].search(where[pk_col])
            if idx is not None:
                t["rows"][idx] = None
                t["index"].delete(where[pk_col])
        else:
            to_delete = []
            for i, row in enumerate(t["rows"]):
                if row and all(row.get(k) == v for k, v in where.items()):
                    to_delete.append(i)
            for i in to_delete:
                pk = t["rows"][i][pk_col]
                t["rows"][i] = None
                t["index"].delete(pk)

    def count(self, table: str) -> int:
        return sum(1 for r in self._tables[table]["rows"] if r is not None)


# Test cases
db = MiniDB()

# Create table
db.create_table("users", ["id", "name", "age", "email"], primary_key="id")

# Insert rows
db.insert("users", {"id": 1, "name": "Alice", "age": 30, "email": "alice@test.com"})
db.insert("users", {"id": 2, "name": "Bob", "age": 25, "email": "bob@test.com"})
db.insert("users", {"id": 3, "name": "Charlie", "age": 35, "email": "charlie@test.com"})
db.insert("users", {"id": 4, "name": "Diana", "age": 28, "email": "diana@test.com"})
db.insert("users", {"id": 5, "name": "Eve", "age": 32, "email": "eve@test.com"})

print(f"Count: {db.count('users')}")  # Expected: 5

# Select by primary key (uses B-tree index — fast)
result = db.select("users", {"id": 3})
print(result)  # Expected: [{'id': 3, 'name': 'Charlie', ...}]

# Select by non-key (linear scan)
result = db.select("users", {"age": 30})
print(result)  # Expected: [{'id': 1, 'name': 'Alice', ...}]

# Select all
all_users = db.select("users")
print(f"All users: {len(all_users)}")  # Expected: 5

# Delete
db.delete("users", {"id": 2})
print(f"After delete: {db.count('users')}")  # Expected: 4

# Verify deletion
result = db.select("users", {"id": 2})
print(f"Deleted user: {result}")  # Expected: []

# Duplicate key detection
try:
    db.insert("users", {"id": 1, "name": "Duplicate", "age": 99, "email": "dup@test.com"})
except ValueError as e:
    print(e)  # Expected: Duplicate primary key
`,
    },
  ],
};
