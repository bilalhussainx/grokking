import { Module } from "../types";

export const nodeBasicsModule: Module = {
  id: "node-basics",
  title: "Node.js Fundamentals",
  description: "Learn Node.js core concepts including the module system, event loop, and binary data handling with Buffers.",
  lessons: [
    {
      id: "node-basics-intro",
      slug: "node-basics-intro",
      title: "Introduction to Node.js",
      content: `## Node.js Fundamentals

**Node.js** is a JavaScript runtime built on Chrome's V8 engine that lets you run JavaScript outside the browser. It uses an **event-driven, non-blocking I/O** model that makes it lightweight and efficient.

### Why Node.js for Backend?

| Feature | Benefit |
|---------|---------|
| **Single language** | JavaScript on both client and server |
| **Non-blocking I/O** | Handles thousands of concurrent connections |
| **NPM ecosystem** | Largest package registry in the world |
| **Event-driven** | Perfect for real-time applications |

### Core Concepts

1. **Modules** — Node.js uses a module system (CommonJS by default, ES Modules supported) to organize code into reusable pieces.
2. **Event Loop** — The mechanism that allows Node.js to perform non-blocking operations despite being single-threaded.
3. **Buffers** — Objects for handling raw binary data, essential for file I/O, networking, and streams.
4. **Streams** — Process data piece by piece rather than loading everything into memory.

### The Node.js Architecture

\`\`\`
┌──────────────────────────────┐
│       Your JavaScript        │
├──────────────────────────────┤
│       Node.js Bindings       │
├──────────┬───────────────────┤
│   V8     │   libuv           │
│ (JS      │ (Event Loop,      │
│  Engine) │  Async I/O,       │
│          │  Thread Pool)     │
└──────────┴───────────────────┘
\`\`\`

In the following lessons, you will implement simplified versions of these core systems to deeply understand how Node.js works under the hood.`,
    },
    {
      id: "node-basics-module-system",
      slug: "module-system",
      title: "Module System",
      content: `## Implementing a Module System

### Problem Statement

Implement a simplified version of Node.js's \`require\` / \`module.exports\` system. Your module loader should:

1. **Register** modules by name with a factory function
2. **Require** modules by name, executing the factory only once
3. **Cache** modules so repeated \`require\` calls return the same instance
4. Handle **circular dependency** detection

### How Node.js Modules Work

When you call \`require('myModule')\`:
1. Node resolves the file path
2. If the module is cached, return the cached \`exports\`
3. Otherwise, create a new \`module\` object with an empty \`exports\`
4. Execute the module file, passing \`module\`, \`exports\`, and \`require\`
5. Cache and return \`module.exports\`

### Examples

\`\`\`
// Register modules
register('math', (module, exports, require) => {
  exports.add = (a, b) => a + b;
  exports.multiply = (a, b) => a * b;
});

register('calculator', (module, exports, require) => {
  const math = require('math');
  exports.sum = (...nums) => nums.reduce(math.add, 0);
});

// Use them
const calc = require('calculator');
calc.sum(1, 2, 3); // 6
\`\`\`

### Key Insight

Module caching is crucial — without it, each \`require\` would re-execute the factory, creating new instances each time. This matters for modules that hold state.`,
      starterCode: `// Implement a simplified Node.js module system

function createModuleSystem() {
  const registry = {};  // name -> factory function
  const cache = {};     // name -> cached exports

  function register(name, factory) {
    // TODO: Store the factory function in the registry
  }

  function require(name) {
    // TODO:
    // 1. If module is cached, return cached exports
    // 2. If module is not registered, throw an error
    // 3. Create a module object with empty exports
    // 4. Mark it as loading (for circular dep detection)
    // 5. Execute the factory with (module, module.exports, require)
    // 6. Cache and return module.exports
  }

  return { register, require };
}

// --- Test ---
const { register, require: req } = createModuleSystem();

register('math', (module, exports, require) => {
  exports.add = (a, b) => a + b;
  exports.multiply = (a, b) => a * b;
});

register('calculator', (module, exports, require) => {
  const math = require('math');
  exports.sum = (...nums) => nums.reduce(math.add, 0);
  exports.product = (...nums) => nums.reduce(math.multiply, 1);
});

const calc = req('calculator');
console.log(calc.sum(1, 2, 3, 4));      // Expected: 10
console.log(calc.product(2, 3, 4));      // Expected: 24

// Test caching - same instance returned
const calc2 = req('calculator');
console.log(calc === calc2);              // Expected: true

// Test error on unknown module
try {
  req('nonexistent');
} catch (e) {
  console.log(e.message);                // Expected: Module 'nonexistent' not found
}
`,
      solutionCode: `// Implement a simplified Node.js module system

function createModuleSystem() {
  const registry = {};  // name -> factory function
  const cache = {};     // name -> cached exports
  const loading = {};   // name -> boolean (circular dep detection)

  function register(name, factory) {
    registry[name] = factory;
  }

  function require(name) {
    // 1. Return cached module if available
    if (cache[name]) {
      return cache[name].exports;
    }

    // 2. Check if module is registered
    if (!registry[name]) {
      throw new Error(\`Module '\${name}' not found\`);
    }

    // 3. Detect circular dependencies
    if (loading[name]) {
      // Return partial exports (like real Node.js)
      return cache[name] ? cache[name].exports : {};
    }

    // 4. Create module object
    const module = { exports: {} };
    cache[name] = module;
    loading[name] = true;

    // 5. Execute factory
    registry[name](module, module.exports, require);

    // 6. Mark as loaded
    loading[name] = false;

    return module.exports;
  }

  return { register, require };
}

// --- Test ---
const { register, require: req } = createModuleSystem();

register('math', (module, exports, require) => {
  exports.add = (a, b) => a + b;
  exports.multiply = (a, b) => a * b;
});

register('calculator', (module, exports, require) => {
  const math = require('math');
  exports.sum = (...nums) => nums.reduce(math.add, 0);
  exports.product = (...nums) => nums.reduce(math.multiply, 1);
});

const calc = req('calculator');
console.log(calc.sum(1, 2, 3, 4));      // Expected: 10
console.log(calc.product(2, 3, 4));      // Expected: 24

// Test caching - same instance returned
const calc2 = req('calculator');
console.log(calc === calc2);              // Expected: true

// Test error on unknown module
try {
  req('nonexistent');
} catch (e) {
  console.log(e.message);                // Expected: Module 'nonexistent' not found
}
`,
    },
    {
      id: "node-basics-event-loop",
      slug: "event-loop-simulator",
      title: "Event Loop Simulator",
      content: `## Event Loop Simulator

### Problem Statement

Implement a simplified event loop that demonstrates how Node.js processes different types of asynchronous tasks. Your simulator should handle:

1. **Microtasks** (like Promise callbacks) — processed after current operation, before next macrotask
2. **Macrotasks** (like setTimeout callbacks) — processed one per loop iteration
3. **Execution order** that matches real Node.js behavior

### How the Event Loop Works

\`\`\`
   ┌───────────────────────────┐
┌─>│         macrotask         │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │    all microtasks          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │         macrotask         │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │    all microtasks          │
│  └─────────────┬─────────────┘
└──┴───────────────────────────┘
\`\`\`

### Key Rule

After every macrotask, the engine drains the **entire** microtask queue before picking up the next macrotask. Microtasks added during microtask processing are also drained.

### Examples

\`\`\`
loop.addMacrotask('timeout1', () => log.push('T1'));
loop.addMicrotask('promise1', () => log.push('P1'));
loop.addMacrotask('timeout2', () => log.push('T2'));
loop.addMicrotask('promise2', () => log.push('P2'));

loop.run();
// Order: P1, P2, T1, T2
// (Microtasks drain first, then macrotasks one by one)
\`\`\``,
      starterCode: `// Implement a simplified Node.js Event Loop

function createEventLoop() {
  const microtaskQueue = [];
  const macrotaskQueue = [];
  const executionLog = [];

  function addMicrotask(name, callback) {
    // TODO: Add to microtask queue
  }

  function addMacrotask(name, callback) {
    // TODO: Add to macrotask queue
  }

  function drainMicrotasks() {
    // TODO: Execute ALL microtasks in the queue
    // Important: if a microtask adds another microtask,
    // that new one should also be drained before moving on
  }

  function run() {
    // TODO:
    // 1. First drain all pending microtasks
    // 2. Then process macrotasks one at a time,
    //    draining microtasks after each one
    // 3. Return the execution log
  }

  return { addMicrotask, addMacrotask, run, executionLog };
}

// --- Test 1: Basic ordering ---
const loop1 = createEventLoop();
loop1.addMacrotask('timeout1', () => loop1.executionLog.push('T1'));
loop1.addMicrotask('promise1', () => loop1.executionLog.push('P1'));
loop1.addMacrotask('timeout2', () => loop1.executionLog.push('T2'));
loop1.addMicrotask('promise2', () => loop1.executionLog.push('P2'));

loop1.run();
console.log(loop1.executionLog);
// Expected: ['P1', 'P2', 'T1', 'T2']

// --- Test 2: Microtask adds microtask ---
const loop2 = createEventLoop();
loop2.addMicrotask('p1', () => {
  loop2.executionLog.push('P1');
  loop2.addMicrotask('p1-nested', () => {
    loop2.executionLog.push('P1-nested');
  });
});
loop2.addMacrotask('t1', () => loop2.executionLog.push('T1'));

loop2.run();
console.log(loop2.executionLog);
// Expected: ['P1', 'P1-nested', 'T1']

// --- Test 3: Macrotask adds microtask ---
const loop3 = createEventLoop();
loop3.addMacrotask('t1', () => {
  loop3.executionLog.push('T1');
  loop3.addMicrotask('p-from-t1', () => {
    loop3.executionLog.push('P-from-T1');
  });
});
loop3.addMacrotask('t2', () => loop3.executionLog.push('T2'));

loop3.run();
console.log(loop3.executionLog);
// Expected: ['T1', 'P-from-T1', 'T2']
`,
      solutionCode: `// Implement a simplified Node.js Event Loop

function createEventLoop() {
  const microtaskQueue = [];
  const macrotaskQueue = [];
  const executionLog = [];

  function addMicrotask(name, callback) {
    microtaskQueue.push({ name, callback });
  }

  function addMacrotask(name, callback) {
    macrotaskQueue.push({ name, callback });
  }

  function drainMicrotasks() {
    while (microtaskQueue.length > 0) {
      const task = microtaskQueue.shift();
      task.callback();
    }
  }

  function run() {
    // 1. Drain initial microtasks
    drainMicrotasks();

    // 2. Process macrotasks one at a time
    while (macrotaskQueue.length > 0) {
      const task = macrotaskQueue.shift();
      task.callback();
      // Drain microtasks after each macrotask
      drainMicrotasks();
    }

    return executionLog;
  }

  return { addMicrotask, addMacrotask, run, executionLog };
}

// --- Test 1: Basic ordering ---
const loop1 = createEventLoop();
loop1.addMacrotask('timeout1', () => loop1.executionLog.push('T1'));
loop1.addMicrotask('promise1', () => loop1.executionLog.push('P1'));
loop1.addMacrotask('timeout2', () => loop1.executionLog.push('T2'));
loop1.addMicrotask('promise2', () => loop1.executionLog.push('P2'));

loop1.run();
console.log(loop1.executionLog);
// Expected: ['P1', 'P2', 'T1', 'T2']

// --- Test 2: Microtask adds microtask ---
const loop2 = createEventLoop();
loop2.addMicrotask('p1', () => {
  loop2.executionLog.push('P1');
  loop2.addMicrotask('p1-nested', () => {
    loop2.executionLog.push('P1-nested');
  });
});
loop2.addMacrotask('t1', () => loop2.executionLog.push('T1'));

loop2.run();
console.log(loop2.executionLog);
// Expected: ['P1', 'P1-nested', 'T1']

// --- Test 3: Macrotask adds microtask ---
const loop3 = createEventLoop();
loop3.addMacrotask('t1', () => {
  loop3.executionLog.push('T1');
  loop3.addMicrotask('p-from-t1', () => {
    loop3.executionLog.push('P-from-T1');
  });
});
loop3.addMacrotask('t2', () => loop3.executionLog.push('T2'));

loop3.run();
console.log(loop3.executionLog);
// Expected: ['T1', 'P-from-T1', 'T2']
`,
    },
    {
      id: "node-basics-buffers",
      slug: "buffer-operations",
      title: "Buffer Operations",
      content: `## Buffer Operations

### Problem Statement

Implement a simplified **Buffer** class that handles binary data operations, similar to Node.js's \`Buffer\`. Your implementation should support:

1. Creating buffers from strings and arrays of bytes
2. Reading and writing integers at specific offsets
3. Slicing and concatenating buffers
4. Converting between encodings (hex, base64-like, utf8)

### Why Buffers Matter

In backend development, you work with binary data constantly:
- Reading files from disk
- Sending/receiving data over TCP sockets
- Processing images, audio, and video
- Implementing binary protocols (e.g., WebSocket frames)

JavaScript strings are UTF-16, but network protocols and files use raw bytes. Buffers bridge this gap.

### Examples

\`\`\`
const buf = SimpleBuffer.from("Hello");
buf.toString();        // "Hello"
buf.toHex();           // "48656c6c6f"
buf.byteAt(0);         // 72 (ASCII for 'H')
buf.slice(0, 3).toString(); // "Hel"
\`\`\``,
      starterCode: `// Implement a simplified Buffer class

class SimpleBuffer {
  constructor(bytes) {
    // bytes is an array of numbers (0-255)
    this.data = bytes || [];
  }

  static from(input) {
    // TODO: If input is a string, convert each char to its char code
    // If input is an array, use it directly
    // Return a new SimpleBuffer
  }

  get length() {
    return this.data.length;
  }

  byteAt(index) {
    // TODO: Return the byte at the given index
    // Throw if out of bounds
  }

  writeByteAt(index, value) {
    // TODO: Write a byte (0-255) at the given index
    // Throw if value out of range or index out of bounds
  }

  slice(start, end) {
    // TODO: Return a new SimpleBuffer with bytes from start to end
  }

  static concat(buffers) {
    // TODO: Concatenate an array of SimpleBuffers into one
  }

  toString() {
    // TODO: Convert bytes back to a string
  }

  toHex() {
    // TODO: Convert bytes to hexadecimal string
    // Each byte becomes 2 hex chars (e.g., 72 -> "48")
  }

  static fromHex(hexString) {
    // TODO: Create a SimpleBuffer from a hex string
  }

  equals(otherBuffer) {
    // TODO: Compare two buffers byte by byte
  }

  indexOf(searchByte) {
    // TODO: Find the first index of a byte value, or -1
  }
}

// --- Tests ---
const buf1 = SimpleBuffer.from("Hello");
console.log(buf1.toString());         // Expected: "Hello"
console.log(buf1.length);             // Expected: 5
console.log(buf1.byteAt(0));          // Expected: 72
console.log(buf1.toHex());            // Expected: "48656c6c6f"

const buf2 = SimpleBuffer.from([87, 111, 114, 108, 100]);
console.log(buf2.toString());         // Expected: "World"

const buf3 = SimpleBuffer.concat([buf1, SimpleBuffer.from(" "), buf2]);
console.log(buf3.toString());         // Expected: "Hello World"

const sliced = buf3.slice(0, 5);
console.log(sliced.toString());       // Expected: "Hello"

const fromHex = SimpleBuffer.fromHex("48656c6c6f");
console.log(fromHex.toString());      // Expected: "Hello"
console.log(fromHex.equals(buf1));    // Expected: true

console.log(buf1.indexOf(108));       // Expected: 2 (first 'l')
console.log(buf1.indexOf(255));       // Expected: -1
`,
      solutionCode: `// Implement a simplified Buffer class

class SimpleBuffer {
  constructor(bytes) {
    this.data = bytes || [];
  }

  static from(input) {
    if (typeof input === "string") {
      const bytes = [];
      for (let i = 0; i < input.length; i++) {
        bytes.push(input.charCodeAt(i));
      }
      return new SimpleBuffer(bytes);
    }
    if (Array.isArray(input)) {
      return new SimpleBuffer([...input]);
    }
    throw new Error("Input must be a string or array");
  }

  get length() {
    return this.data.length;
  }

  byteAt(index) {
    if (index < 0 || index >= this.data.length) {
      throw new RangeError(\`Index \${index} out of bounds\`);
    }
    return this.data[index];
  }

  writeByteAt(index, value) {
    if (index < 0 || index >= this.data.length) {
      throw new RangeError(\`Index \${index} out of bounds\`);
    }
    if (value < 0 || value > 255) {
      throw new RangeError(\`Value \${value} out of range (0-255)\`);
    }
    this.data[index] = value;
  }

  slice(start, end) {
    return new SimpleBuffer(this.data.slice(start, end));
  }

  static concat(buffers) {
    const allBytes = [];
    for (const buf of buffers) {
      allBytes.push(...buf.data);
    }
    return new SimpleBuffer(allBytes);
  }

  toString() {
    return this.data.map(b => String.fromCharCode(b)).join("");
  }

  toHex() {
    return this.data.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  static fromHex(hexString) {
    const bytes = [];
    for (let i = 0; i < hexString.length; i += 2) {
      bytes.push(parseInt(hexString.slice(i, i + 2), 16));
    }
    return new SimpleBuffer(bytes);
  }

  equals(otherBuffer) {
    if (this.data.length !== otherBuffer.data.length) return false;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] !== otherBuffer.data[i]) return false;
    }
    return true;
  }

  indexOf(searchByte) {
    return this.data.indexOf(searchByte);
  }
}

// --- Tests ---
const buf1 = SimpleBuffer.from("Hello");
console.log(buf1.toString());         // Expected: "Hello"
console.log(buf1.length);             // Expected: 5
console.log(buf1.byteAt(0));          // Expected: 72
console.log(buf1.toHex());            // Expected: "48656c6c6f"

const buf2 = SimpleBuffer.from([87, 111, 114, 108, 100]);
console.log(buf2.toString());         // Expected: "World"

const buf3 = SimpleBuffer.concat([buf1, SimpleBuffer.from(" "), buf2]);
console.log(buf3.toString());         // Expected: "Hello World"

const sliced = buf3.slice(0, 5);
console.log(sliced.toString());       // Expected: "Hello"

const fromHex = SimpleBuffer.fromHex("48656c6c6f");
console.log(fromHex.toString());      // Expected: "Hello"
console.log(fromHex.equals(buf1));    // Expected: true

console.log(buf1.indexOf(108));       // Expected: 2 (first 'l')
console.log(buf1.indexOf(255));       // Expected: -1
`,
    },
  ],
};
