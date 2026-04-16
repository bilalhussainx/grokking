import { Module } from "../types";

export const module2: Module = {
  id: "event-loop-async",
  title: "Event Loop, Promises & Async/Await",
  description: "How JavaScript handles concurrency: the event loop, task queues, Promises, async/await, and generators",
  lessons: [
    {
      id: "event-loop",
      slug: "event-loop",
      title: "The Event Loop & Task Queues",
      content: `
# The Event Loop

JavaScript is **single-threaded** — one call stack, one thread of execution. The event loop is what makes async code possible without blocking.

\`\`\`concept
{
  "title": "JavaScript Runtime Components",
  "description": "The JS runtime has several cooperating parts that handle synchronous and asynchronous work",
  "points": [
    "Call Stack: tracks the current execution frame — LIFO, single-threaded",
    "Heap: unstructured memory region for objects and closures",
    "Web APIs (browser) / libuv (Node): handle setTimeout, fetch, I/O off the main thread",
    "Macrotask Queue (Task Queue): holds callbacks from setTimeout, setInterval, I/O, UI events",
    "Microtask Queue: holds Promise .then()/.catch(), queueMicrotask(), MutationObserver",
    "Event Loop: checks if call stack is empty → drains ALL microtasks → runs ONE macrotask → repeat"
  ]
}
\`\`\`

## Execution Order: The Key Rules

\`\`\`javascript
// RULE: Microtasks drain completely before any macrotask runs

console.log('1 — sync');

setTimeout(() => console.log('2 — macrotask'), 0);

Promise.resolve()
  .then(() => console.log('3 — microtask 1'))
  .then(() => console.log('4 — microtask 2'));

queueMicrotask(() => console.log('5 — microtask 3'));

console.log('6 — sync');

// Output: 1, 6, 3, 5, 4, 2
// Explanation:
// Sync runs first: 1, 6
// Microtask queue drains: 3 (adds another microtask: "4"), then 5, then 4
// Then macrotask: 2
\`\`\`

## setTimeout(fn, 0) — Not Actually Zero

\`\`\`javascript
// setTimeout with 0ms doesn't mean "immediate" — it means "next macrotask"
// The minimum delay in browsers is ~4ms, and it ALWAYS waits for:
// 1. Current synchronous code to finish
// 2. All queued microtasks to drain

function example() {
  console.log('start');

  setTimeout(() => console.log('timeout'), 0);

  Promise.resolve().then(() => {
    console.log('promise 1');
    // This new microtask runs BEFORE the timeout:
    Promise.resolve().then(() => console.log('promise 2'));
  });

  console.log('end');
}
example();
// start → end → promise 1 → promise 2 → timeout
\`\`\`

## Visualizing the Event Loop

\`\`\`tabs
[
  {
    "label": "Step-by-step trace",
    "content": "// Trace what happens with this code:\\nfetch('/api/data')                     // [1] Web API starts fetch\\n  .then(r => r.json())                 // [2] queued when fetch resolves\\n  .then(data => console.log(data));    // [3] queued after [2]\\n\\nconsole.log('sync code');              // [4] runs immediately\\n\\nsetTimeout(() => console.log('timer'), 0); // [5] macrotask\\n\\n// Order:\\n// [4] sync code — runs first\\n// (fetch completes in background, adds to microtask queue)\\n// [2] r.json() — runs when fetch resolves\\n// [3] console.log(data) — runs after json parsing\\n// [5] timer — macrotask, last"
  },
  {
    "label": "Node.js differences",
    "content": "// Node.js adds extra queue phases (libuv event loop):\\n// process.nextTick() — runs before any microtasks (even Promises!)\\n// setImmediate() — runs after I/O callbacks, before setTimeout\\n\\nconsole.log('start');\\nsetTimeout(() => console.log('setTimeout'), 0);\\nsetImmediate(() => console.log('setImmediate'));\\nprocess.nextTick(() => console.log('nextTick'));\\nPromise.resolve().then(() => console.log('promise'));\\nconsole.log('end');\\n\\n// Node output: start → end → nextTick → promise → setImmediate → setTimeout\\n// (setTimeout vs setImmediate order can vary outside I/O)"
  }
]
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Which runs first: a resolved Promise .then() or a setTimeout(fn, 0)?",
      "options": [
        "setTimeout — it was queued first",
        "Promise .then() — microtasks drain before macrotasks",
        "They run simultaneously",
        "It depends on browser"
      ],
      "answer": 1,
      "explanation": "Promise callbacks go to the microtask queue, which drains completely before the event loop picks up any macrotask (like setTimeout). Even a setTimeout(fn, 0) runs after all pending microtasks."
    },
    {
      "q": "What is the output order? console.log('a'); Promise.resolve().then(() => console.log('b')); console.log('c');",
      "options": [
        "a, b, c",
        "b, a, c",
        "a, c, b",
        "c, a, b"
      ],
      "answer": 2,
      "explanation": "Synchronous code runs first: a, c. Then microtasks: b. The Promise.resolve().then() callback is a microtask — it only runs after the current synchronous execution completes."
    }
  ]
}
\`\`\`
`,
    },
    {
      id: "promises-async-await",
      slug: "promises-async-await",
      title: "Promises, async/await & Error Handling",
      content: `
# Promises & async/await

## Promise Fundamentals

\`\`\`concept
{
  "title": "Promise States",
  "description": "A Promise represents an eventual value — it's always in one of three states",
  "points": [
    "pending: initial state, neither fulfilled nor rejected",
    "fulfilled: operation succeeded, value available via .then()",
    "rejected: operation failed, reason available via .catch()",
    "settled: fulfilled OR rejected — can never change state again",
    "Promise.resolve(value) — creates an already-fulfilled promise",
    "Promise.reject(reason) — creates an already-rejected promise"
  ]
}
\`\`\`

\`\`\`javascript
// Creating a Promise:
function delay(ms) {
  return new Promise((resolve, reject) => {
    if (ms < 0) reject(new Error('Delay must be non-negative'));
    setTimeout(resolve, ms);
  });
}

// Chaining — each .then() returns a NEW promise:
delay(100)
  .then(() => fetch('/api/users'))     // .then can return a value or promise
  .then(res => res.json())             // waits for previous promise
  .then(users => console.log(users))
  .catch(err => console.error(err))   // catches ANY error in the chain
  .finally(() => hideSpinner());      // runs whether resolved or rejected
\`\`\`

## Promise Combinators

\`\`\`tabs
[
  {
    "label": "Promise.all",
    "content": "// Promise.all — resolves when ALL resolve, rejects if ANY rejects\\nconst [users, posts, comments] = await Promise.all([\\n  fetch('/api/users').then(r => r.json()),\\n  fetch('/api/posts').then(r => r.json()),\\n  fetch('/api/comments').then(r => r.json()),\\n]);\\n// Fires all 3 fetches concurrently — much faster than sequential!\\n// If ANY fails → whole Promise.all rejects"
  },
  {
    "label": "Promise.allSettled",
    "content": "// Promise.allSettled — waits for ALL, never rejects\\nconst results = await Promise.allSettled([\\n  fetch('/api/users').then(r => r.json()),\\n  fetch('/api/might-fail').then(r => r.json()),\\n]);\\n\\nresults.forEach(result => {\\n  if (result.status === 'fulfilled') {\\n    console.log('✓', result.value);\\n  } else {\\n    console.log('✗', result.reason.message);\\n  }\\n});\\n// Use when you want results from everything, even partial failures"
  },
  {
    "label": "Promise.race / .any",
    "content": "// Promise.race — settles with the FIRST to settle (fulfilled OR rejected)\\nconst result = await Promise.race([\\n  fetch('/api/primary'),\\n  delay(5000).then(() => { throw new Error('timeout'); })\\n]);\\n// Useful for timeouts!\\n\\n// Promise.any — resolves with the FIRST to FULFILL (ignores rejections)\\n// Rejects only if ALL reject (AggregateError)\\nconst fastest = await Promise.any([\\n  fetch('https://mirror1.example.com/data'),\\n  fetch('https://mirror2.example.com/data'),\\n  fetch('https://mirror3.example.com/data'),\\n]);\\n// Gets data from whichever CDN responds first"
  }
]
\`\`\`

## async/await

\`\`\`javascript
// async functions always return a Promise
// await pauses execution inside the async function (not the whole thread!)

async function loadUserProfile(userId) {
  try {
    const user = await fetch(\`/api/users/\${userId}\`).then(r => r.json());
    const posts = await fetch(\`/api/posts?userId=\${userId}\`).then(r => r.json());
    return { user, posts };
  } catch (err) {
    console.error('Failed to load profile:', err);
    throw err; // re-throw so caller knows
  }
}

// Common mistake: sequential when parallel is possible
async function slow() {
  const a = await fetch('/api/a'); // waits for a...
  const b = await fetch('/api/b'); // ...then waits for b
  // Total time: a + b
}

async function fast() {
  const [a, b] = await Promise.all([
    fetch('/api/a'),
    fetch('/api/b'),
  ]);
  // Total time: max(a, b)
}
\`\`\`

## Error Handling Patterns

\`\`\`javascript
// Pattern 1: try/catch (standard)
async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    // Catches both network errors AND thrown errors
    console.error(err);
    return null;
  }
}

// Pattern 2: .catch() on the promise (useful for concise one-liners)
const user = await fetchUser(42).catch(() => null);

// Pattern 3: Result pattern (Go-style, avoids nesting)
async function safeAsync(promise) {
  try {
    return [null, await promise];
  } catch (err) {
    return [err, null];
  }
}

const [err, data] = await safeAsync(fetch('/api/data').then(r => r.json()));
if (err) { /* handle */ }
else { /* use data */ }

// Unhandled promise rejections — always handle!
// Node.js: process.on('unhandledRejection', handler)
// Browser: window.addEventListener('unhandledrejection', handler)
\`\`\`

## Generators & Async Generators

\`\`\`javascript
// Generator functions: can pause (yield) and resume
function* counter(start = 0) {
  while (true) {
    const reset = yield start++;
    if (reset) start = 0;
  }
}

const gen = counter(1);
gen.next();        // { value: 1, done: false }
gen.next();        // { value: 2, done: false }
gen.next(true);    // { value: 0, done: false } — reset!

// Async generators: combine async + yield (used for async iterables)
async function* paginate(url) {
  let cursor = null;
  do {
    const params = cursor ? \`?cursor=\${cursor}\` : '';
    const { data, nextCursor } = await fetch(url + params).then(r => r.json());
    yield data;     // yield each page
    cursor = nextCursor;
  } while (cursor);
}

// Consume with for-await-of:
for await (const page of paginate('/api/items')) {
  console.log('Got page:', page);
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does await do inside an async function?",
      "options": [
        "Blocks the entire JavaScript thread",
        "Pauses execution of that async function and returns control to the event loop",
        "Creates a new thread",
        "Converts the Promise to a synchronous value"
      ],
      "answer": 1,
      "explanation": "await pauses ONLY the current async function, returning control to the event loop so other code can run. Other tasks and microtasks can execute while the awaited Promise is pending."
    },
    {
      "q": "What is the difference between Promise.all and Promise.allSettled?",
      "options": [
        "No difference",
        "Promise.all rejects immediately if any promise rejects; Promise.allSettled always waits for all and returns status+value for each",
        "Promise.allSettled is faster",
        "Promise.all only works with 2 promises"
      ],
      "answer": 1,
      "explanation": "Promise.all short-circuits on first rejection. Promise.allSettled always waits for all promises, giving you {status:'fulfilled',value} or {status:'rejected',reason} for each — useful when you want partial results even on failure."
    }
  ]
}
\`\`\`
`,
      starterCode: `// Build a retry wrapper with exponential backoff.
// retry(fn, maxAttempts, baseDelayMs) should:
// - Call fn() — if it resolves, return the value
// - If fn() rejects, wait baseDelayMs * 2^attempt ms, then retry
// - After maxAttempts failures, reject with the last error
// - Log each retry attempt: "Attempt N failed, retrying in Xms..."

function retry(fn, maxAttempts = 3, baseDelayMs = 100) {
  // TODO: implement with Promises (no async/await required but allowed)
}

// Test:
let callCount = 0;
const flakyFn = () => new Promise((resolve, reject) => {
  callCount++;
  if (callCount < 3) reject(new Error(\`Attempt \${callCount} failed\`));
  else resolve('success!');
});

retry(flakyFn, 3, 50).then(console.log); // 'success!' after 2 retries`,
      solutionCode: `function retry(fn, maxAttempts = 3, baseDelayMs = 100) {
  return new Promise((resolve, reject) => {
    function attempt(n) {
      fn()
        .then(resolve)
        .catch(err => {
          if (n >= maxAttempts) {
            reject(err);
          } else {
            const delay = baseDelayMs * Math.pow(2, n - 1);
            console.log(\`Attempt \${n} failed, retrying in \${delay}ms...\`);
            setTimeout(() => attempt(n + 1), delay);
          }
        });
    }
    attempt(1);
  });
}

// Async/await version (cleaner):
async function retryAsync(fn, maxAttempts = 3, baseDelayMs = 100) {
  for (let n = 1; n <= maxAttempts; n++) {
    try {
      return await fn();
    } catch (err) {
      if (n === maxAttempts) throw err;
      const delay = baseDelayMs * Math.pow(2, n - 1);
      console.log(\`Attempt \${n} failed, retrying in \${delay}ms...\`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}`,
    },
  ],
};
