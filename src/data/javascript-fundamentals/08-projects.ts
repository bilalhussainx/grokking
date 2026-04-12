import { Module } from "../types";

export const projectsModule: Module = {
  id: "js-projects",
  title: "Mini Projects",
  description: "Apply everything you have learned by building real-world utilities: a task queue, a mini lodash library, and a URL parser.",
  lessons: [
    {
      id: "js-projects-intro",
      slug: "js-projects-intro",
      title: "Introduction to Mini Projects",
      content: `## Mini Projects

Now it is time to put everything together. These projects combine multiple JavaScript concepts into complete, practical utilities.

### What You Will Build

1. **Task Queue** — An async task queue with concurrency control, pause/resume, and priority scheduling. Combines promises, closures, and class design.

2. **Mini Lodash** — Implement three popular lodash utility functions from scratch: \`_.get\`, \`_.set\`, and \`_.chunk\`. Combines object traversal, array manipulation, and edge-case handling.

3. **URL Parser** — A complete URL parser that extracts protocol, host, path, query parameters, and fragment. Combines string manipulation, regular expressions, and object construction.

### How to Approach These

- **Read the full problem** before writing any code
- **Start with the simplest test case** and make it pass first
- **Handle edge cases** after the happy path works
- **Refactor** once all tests pass — clean code matters

### Skills You Will Practice

| Project | Core Skills |
|---------|-------------|
| Task Queue | async/await, closures, class design, state management |
| Mini Lodash | recursion, type checking, array slicing, path parsing |
| URL Parser | string methods, regex, destructuring, builder pattern |

Each project is self-contained and can be tested independently. Good luck!`,
    },
    {
      id: "js-projects-task-queue",
      slug: "task-queue",
      title: "Task Queue",
      content: `## Task Queue

### Problem

Build a \`TaskQueue\` class that manages async tasks with concurrency control:

- \`constructor(concurrency)\` — max number of tasks running simultaneously
- \`add(taskFn, priority = 0)\` — add a task (function returning a promise); higher priority runs first; returns a promise that resolves with the task result
- \`pause()\` / \`resume()\` — pause and resume processing
- \`size\` — getter returning the number of pending tasks

### Examples

\`\`\`js
const queue = new TaskQueue(2);
queue.add(() => fetch(url1));
queue.add(() => fetch(url2));
queue.add(() => fetch(url3)); // waits until one of the first two finishes
\`\`\`

### Key Concepts

- Internal queue with priority sorting
- Concurrency tracking (running count)
- Pause state prevents dequeuing but does not cancel running tasks
- Each \`add\` returns a promise the caller can await`,
      starterCode: `// Task Queue
// Build an async task queue with concurrency and priority

class TaskQueue {
  constructor(concurrency) {
    // Initialize: max concurrency, pending queue, running count, paused state
    // YOUR CODE HERE
  }

  add(taskFn, priority = 0) {
    // Add a task to the queue
    // Return a promise that resolves with the task's result
    // Higher priority tasks should run first
    // YOUR CODE HERE
  }

  pause() {
    // Pause the queue (don't start new tasks, but let running ones finish)
    // YOUR CODE HERE
  }

  resume() {
    // Resume the queue and start processing pending tasks
    // YOUR CODE HERE
  }

  get size() {
    // Return the number of pending (not yet started) tasks
    // YOUR CODE HERE
  }

  _processNext() {
    // Internal: start the next task if under concurrency limit and not paused
    // YOUR CODE HERE
  }
}

// Helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test cases
async function runTests() {
  // Test 1: Basic concurrency
  const queue1 = new TaskQueue(2);
  const order = [];

  await Promise.all([
    queue1.add(async () => { order.push("a-start"); await delay(50); order.push("a-end"); return "a"; }),
    queue1.add(async () => { order.push("b-start"); await delay(30); order.push("b-end"); return "b"; }),
    queue1.add(async () => { order.push("c-start"); await delay(10); order.push("c-end"); return "c"; }),
  ]);
  console.log("Order:", order);
  // a and b start immediately (concurrency 2), c starts after b finishes

  // Test 2: Priority
  const queue2 = new TaskQueue(1);
  const results = [];
  const p1 = queue2.add(async () => { await delay(50); results.push("low"); }, 0);
  const p2 = queue2.add(async () => { results.push("high"); }, 10);
  const p3 = queue2.add(async () => { results.push("medium"); }, 5);
  await Promise.all([p1, p2, p3]);
  console.log("Priority order:", results);
  // Expected: ["low", "high", "medium"] — low runs first (already started), then high, then medium

  // Test 3: Size
  const queue3 = new TaskQueue(1);
  queue3.add(async () => await delay(100));
  queue3.add(async () => await delay(100));
  queue3.add(async () => await delay(100));
  await delay(10); // let first task start
  console.log("Pending size:", queue3.size); // Expected: 2

  // Test 4: Return values
  const queue4 = new TaskQueue(2);
  const val = await queue4.add(async () => 42);
  console.log("Return value:", val); // Expected: 42
}

runTests();`,
      solutionCode: `// Task Queue
// Build an async task queue with concurrency and priority

class TaskQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.pending = [];
    this.running = 0;
    this.paused = false;
  }

  add(taskFn, priority = 0) {
    return new Promise((resolve, reject) => {
      this.pending.push({ taskFn, priority, resolve, reject });
      this.pending.sort((a, b) => b.priority - a.priority);
      this._processNext();
    });
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    this._processNext();
  }

  get size() {
    return this.pending.length;
  }

  _processNext() {
    while (!this.paused && this.running < this.concurrency && this.pending.length > 0) {
      const { taskFn, resolve, reject } = this.pending.shift();
      this.running++;

      taskFn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.running--;
          this._processNext();
        });
    }
  }
}

// Helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test cases
async function runTests() {
  // Test 1: Basic concurrency
  const queue1 = new TaskQueue(2);
  const order = [];

  await Promise.all([
    queue1.add(async () => { order.push("a-start"); await delay(50); order.push("a-end"); return "a"; }),
    queue1.add(async () => { order.push("b-start"); await delay(30); order.push("b-end"); return "b"; }),
    queue1.add(async () => { order.push("c-start"); await delay(10); order.push("c-end"); return "c"; }),
  ]);
  console.log("Order:", order);
  // a and b start immediately (concurrency 2), c starts after b finishes

  // Test 2: Priority
  const queue2 = new TaskQueue(1);
  const results = [];
  const p1 = queue2.add(async () => { await delay(50); results.push("low"); }, 0);
  const p2 = queue2.add(async () => { results.push("high"); }, 10);
  const p3 = queue2.add(async () => { results.push("medium"); }, 5);
  await Promise.all([p1, p2, p3]);
  console.log("Priority order:", results);
  // Expected: ["low", "high", "medium"]

  // Test 3: Size
  const queue3 = new TaskQueue(1);
  queue3.add(async () => await delay(100));
  queue3.add(async () => await delay(100));
  queue3.add(async () => await delay(100));
  await delay(10);
  console.log("Pending size:", queue3.size); // Expected: 2

  // Test 4: Return values
  const queue4 = new TaskQueue(2);
  const val = await queue4.add(async () => 42);
  console.log("Return value:", val); // Expected: 42
}

runTests();`,
    },
    {
      id: "js-projects-mini-lodash",
      slug: "mini-lodash",
      title: "Mini Lodash",
      content: `## Mini Lodash

### Problem

Implement three popular lodash utility functions:

1. \`get(obj, path, defaultValue)\` — safely access nested properties using dot or bracket notation: \`"a.b[0].c"\`
2. \`set(obj, path, value)\` — set a nested property, creating objects/arrays as needed (mutates the object)
3. \`chunk(array, size)\` — split an array into groups of \`size\` elements

### Examples

\`\`\`js
get({ a: [{ b: 1 }] }, "a[0].b")      // 1
set({}, "a[0].b", 42)                   // { a: [{ b: 42 }] }
chunk([1, 2, 3, 4, 5], 2)              // [[1, 2], [3, 4], [5]]
\`\`\`

### Key Concepts

- Path parsing: split \`"a.b[0].c"\` into \`["a", "b", "0", "c"]\`
- Determining if intermediate values should be arrays or objects
- Handling edge cases: empty path, missing properties, size > array length
- These are among the most-used lodash functions in production codebases`,
      starterCode: `// Mini Lodash
// Implement _.get, _.set, and _.chunk

function parsePath(path) {
  // Convert "a.b[0].c" into ["a", "b", "0", "c"]
  // Handle both dot notation and bracket notation
  // YOUR CODE HERE
}

function get(obj, path, defaultValue) {
  // Safely access nested properties
  // Support "a.b.c" and "a[0].b" syntax
  // Return defaultValue if path doesn't resolve
  // YOUR CODE HERE
}

function set(obj, path, value) {
  // Set a nested property, creating intermediates as needed
  // If the next key is a number string, create an array; otherwise create an object
  // Mutates and returns the original object
  // YOUR CODE HERE
}

function chunk(array, size) {
  // Split array into groups of 'size'
  // Last chunk may be smaller if array doesn't divide evenly
  // Return [] for invalid inputs
  // YOUR CODE HERE
}

// Test cases
// --- get ---
const data = {
  users: [
    { name: "Alice", address: { city: "NYC" } },
    { name: "Bob", address: { city: "LA" } },
  ],
  count: 2,
};

console.log(get(data, "users[0].name"));           // Expected: "Alice"
console.log(get(data, "users[1].address.city"));    // Expected: "LA"
console.log(get(data, "users[2].name", "unknown")); // Expected: "unknown"
console.log(get(data, "count"));                    // Expected: 2
console.log(get(data, "missing.deep.path", null));  // Expected: null

// --- set ---
const obj1 = {};
set(obj1, "a.b.c", 42);
console.log(JSON.stringify(obj1));
// Expected: {"a":{"b":{"c":42}}}

const obj2 = {};
set(obj2, "items[0].name", "first");
set(obj2, "items[1].name", "second");
console.log(JSON.stringify(obj2));
// Expected: {"items":[{"name":"first"},{"name":"second"}]}

const obj3 = { existing: true };
set(obj3, "a.b", 1);
console.log(JSON.stringify(obj3));
// Expected: {"existing":true,"a":{"b":1}}

// --- chunk ---
console.log(chunk([1, 2, 3, 4, 5], 2));
// Expected: [[1, 2], [3, 4], [5]]

console.log(chunk([1, 2, 3, 4], 4));
// Expected: [[1, 2, 3, 4]]

console.log(chunk([1, 2, 3], 1));
// Expected: [[1], [2], [3]]

console.log(chunk([], 3));
// Expected: []`,
      solutionCode: `// Mini Lodash
// Implement _.get, _.set, and _.chunk

function parsePath(path) {
  return path
    .replace(/\\[(\\d+)\\]/g, ".$1")
    .split(".")
    .filter(Boolean);
}

function get(obj, path, defaultValue) {
  const keys = parsePath(path);
  let current = obj;

  for (const key of keys) {
    if (current == null || typeof current !== "object") {
      return defaultValue;
    }
    current = current[key];
  }

  return current === undefined ? defaultValue : current;
}

function set(obj, path, value) {
  const keys = parsePath(path);
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const isNextIndex = /^\\d+$/.test(nextKey);

    if (current[key] == null || typeof current[key] !== "object") {
      current[key] = isNextIndex ? [] : {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return obj;
}

function chunk(array, size) {
  if (!array.length || size < 1) return [];

  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Test cases
// --- get ---
const data = {
  users: [
    { name: "Alice", address: { city: "NYC" } },
    { name: "Bob", address: { city: "LA" } },
  ],
  count: 2,
};

console.log(get(data, "users[0].name"));           // Expected: "Alice"
console.log(get(data, "users[1].address.city"));    // Expected: "LA"
console.log(get(data, "users[2].name", "unknown")); // Expected: "unknown"
console.log(get(data, "count"));                    // Expected: 2
console.log(get(data, "missing.deep.path", null));  // Expected: null

// --- set ---
const obj1 = {};
set(obj1, "a.b.c", 42);
console.log(JSON.stringify(obj1));
// Expected: {"a":{"b":{"c":42}}}

const obj2 = {};
set(obj2, "items[0].name", "first");
set(obj2, "items[1].name", "second");
console.log(JSON.stringify(obj2));
// Expected: {"items":[{"name":"first"},{"name":"second"}]}

const obj3 = { existing: true };
set(obj3, "a.b", 1);
console.log(JSON.stringify(obj3));
// Expected: {"existing":true,"a":{"b":1}}

// --- chunk ---
console.log(chunk([1, 2, 3, 4, 5], 2));
// Expected: [[1, 2], [3, 4], [5]]

console.log(chunk([1, 2, 3, 4], 4));
// Expected: [[1, 2, 3, 4]]

console.log(chunk([1, 2, 3], 1));
// Expected: [[1], [2], [3]]

console.log(chunk([], 3));
// Expected: []`,
    },
    {
      id: "js-projects-url-parser",
      slug: "url-parser",
      title: "URL Parser",
      content: `## URL Parser

### Problem

Build a \`parseURL\` function that takes a URL string and returns a structured object with:

- \`protocol\` — e.g., \`"https"\`
- \`host\` — e.g., \`"example.com"\`
- \`port\` — e.g., \`"8080"\` or \`""\` if none
- \`path\` — e.g., \`"/api/users"\`
- \`query\` — parsed object, e.g., \`{ page: "1", sort: "name" }\`
- \`fragment\` — e.g., \`"section1"\` or \`""\`

Also implement \`buildURL(parts)\` that constructs a URL string from the same structure.

### Examples

\`\`\`js
parseURL("https://example.com:8080/api/users?page=1&sort=name#top")
// { protocol: "https", host: "example.com", port: "8080",
//   path: "/api/users", query: { page: "1", sort: "name" }, fragment: "top" }
\`\`\`

### Key Concepts

- String splitting and indexOf for parsing
- Query string parsing with split("&") and split("=")
- Handling optional parts (port, query, fragment)
- URL encoding/decoding with decodeURIComponent`,
      starterCode: `// URL Parser
// Parse and build URLs from scratch

function parseURL(url) {
  // Parse a URL string into its components:
  // { protocol, host, port, path, query, fragment }
  //
  // Handle these URL formats:
  //   https://example.com
  //   https://example.com:8080/path
  //   https://example.com/path?key=value&key2=value2
  //   https://example.com/path#fragment
  //   https://example.com:3000/path?q=search#results
  //
  // YOUR CODE HERE
}

function parseQuery(queryString) {
  // Parse "key1=value1&key2=value2" into { key1: "value1", key2: "value2" }
  // Handle URL-encoded values with decodeURIComponent
  // Return {} for empty query string
  // YOUR CODE HERE
}

function buildURL(parts) {
  // Build a URL string from { protocol, host, port, path, query, fragment }
  // Only include port if non-empty
  // Only include query string if query object is non-empty
  // Only include fragment if non-empty
  // YOUR CODE HERE
}

// Test cases
// Test 1: Full URL
const parsed1 = parseURL("https://example.com:8080/api/users?page=1&sort=name#top");
console.log(parsed1);
// Expected: { protocol: "https", host: "example.com", port: "8080",
//             path: "/api/users", query: { page: "1", sort: "name" }, fragment: "top" }

// Test 2: Simple URL
const parsed2 = parseURL("http://google.com");
console.log(parsed2);
// Expected: { protocol: "http", host: "google.com", port: "",
//             path: "/", query: {}, fragment: "" }

// Test 3: URL with path only
const parsed3 = parseURL("https://api.github.com/repos/facebook/react");
console.log(parsed3);
// Expected: { protocol: "https", host: "api.github.com", port: "",
//             path: "/repos/facebook/react", query: {}, fragment: "" }

// Test 4: URL with encoded query
const parsed4 = parseURL("https://search.com/q?term=hello%20world&lang=en");
console.log(parsed4);
// Expected: { ..., query: { term: "hello world", lang: "en" }, ... }

// Test 5: Roundtrip
const url = "https://example.com:3000/path?key=value#section";
const rebuilt = buildURL(parseURL(url));
console.log("Roundtrip:", rebuilt);
// Expected: "https://example.com:3000/path?key=value#section"

// Test 6: Build without optional parts
const simple = buildURL({ protocol: "https", host: "example.com", port: "", path: "/", query: {}, fragment: "" });
console.log("Simple build:", simple);
// Expected: "https://example.com/"`,
      solutionCode: `// URL Parser
// Parse and build URLs from scratch

function parseURL(url) {
  let remaining = url;

  // Extract protocol
  const protocolEnd = remaining.indexOf("://");
  const protocol = remaining.slice(0, protocolEnd);
  remaining = remaining.slice(protocolEnd + 3);

  // Extract fragment
  let fragment = "";
  const hashIndex = remaining.indexOf("#");
  if (hashIndex !== -1) {
    fragment = remaining.slice(hashIndex + 1);
    remaining = remaining.slice(0, hashIndex);
  }

  // Extract query
  let queryString = "";
  const questionIndex = remaining.indexOf("?");
  if (questionIndex !== -1) {
    queryString = remaining.slice(questionIndex + 1);
    remaining = remaining.slice(0, questionIndex);
  }

  // Extract path
  const pathIndex = remaining.indexOf("/");
  let path = "/";
  let hostPort = remaining;
  if (pathIndex !== -1) {
    path = remaining.slice(pathIndex);
    hostPort = remaining.slice(0, pathIndex);
  }

  // Extract host and port
  let host = hostPort;
  let port = "";
  const colonIndex = hostPort.indexOf(":");
  if (colonIndex !== -1) {
    host = hostPort.slice(0, colonIndex);
    port = hostPort.slice(colonIndex + 1);
  }

  return {
    protocol,
    host,
    port,
    path,
    query: parseQuery(queryString),
    fragment,
  };
}

function parseQuery(queryString) {
  if (!queryString) return {};

  const params = {};
  const pairs = queryString.split("&");

  for (const pair of pairs) {
    const eqIndex = pair.indexOf("=");
    if (eqIndex === -1) {
      params[decodeURIComponent(pair)] = "";
    } else {
      const key = decodeURIComponent(pair.slice(0, eqIndex));
      const value = decodeURIComponent(pair.slice(eqIndex + 1));
      params[key] = value;
    }
  }

  return params;
}

function buildURL(parts) {
  let url = \`\${parts.protocol}://\${parts.host}\`;

  if (parts.port) {
    url += \`:\${parts.port}\`;
  }

  url += parts.path;

  const queryEntries = Object.entries(parts.query);
  if (queryEntries.length > 0) {
    const queryString = queryEntries
      .map(([k, v]) => \`\${encodeURIComponent(k)}=\${encodeURIComponent(v)}\`)
      .join("&");
    url += \`?\${queryString}\`;
  }

  if (parts.fragment) {
    url += \`#\${parts.fragment}\`;
  }

  return url;
}

// Test cases
// Test 1: Full URL
const parsed1 = parseURL("https://example.com:8080/api/users?page=1&sort=name#top");
console.log(parsed1);
// Expected: { protocol: "https", host: "example.com", port: "8080",
//             path: "/api/users", query: { page: "1", sort: "name" }, fragment: "top" }

// Test 2: Simple URL
const parsed2 = parseURL("http://google.com");
console.log(parsed2);
// Expected: { protocol: "http", host: "google.com", port: "",
//             path: "/", query: {}, fragment: "" }

// Test 3: URL with path only
const parsed3 = parseURL("https://api.github.com/repos/facebook/react");
console.log(parsed3);
// Expected: { protocol: "https", host: "api.github.com", port: "",
//             path: "/repos/facebook/react", query: {}, fragment: "" }

// Test 4: URL with encoded query
const parsed4 = parseURL("https://search.com/q?term=hello%20world&lang=en");
console.log(parsed4);
// Expected: { ..., query: { term: "hello world", lang: "en" }, ... }

// Test 5: Roundtrip
const url = "https://example.com:3000/path?key=value#section";
const rebuilt = buildURL(parseURL(url));
console.log("Roundtrip:", rebuilt);
// Expected: "https://example.com:3000/path?key=value#section"

// Test 6: Build without optional parts
const simple = buildURL({ protocol: "https", host: "example.com", port: "", path: "/", query: {}, fragment: "" });
console.log("Simple build:", simple);
// Expected: "https://example.com/"`,
    },
  ],
};
