import { Module } from "../types";

export const asyncModule: Module = {
  id: "js-async",
  title: "Async JavaScript",
  description:
    "Understand Promises, async/await, error handling, and common asynchronous patterns in modern JavaScript.",
  lessons: [
    {
      id: "js-async-intro",
      slug: "js-async-intro",
      title: "Introduction to Async JavaScript",
      content: `## Asynchronous JavaScript

JavaScript is **single-threaded** but handles concurrency through an **event loop**. Async operations (network requests, timers, file I/O) don't block the main thread.

### Callbacks (The Old Way)

\`\`\`js
setTimeout(() => console.log("Done"), 1000);
\`\`\`

Callbacks lead to "callback hell" when nested deeply.

### Promises (ES6)

A Promise represents a value that may not be available yet:

\`\`\`js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("data"), 1000);
});

promise
  .then(data => console.log(data))   // "data"
  .catch(err => console.error(err))
  .finally(() => console.log("done"));
\`\`\`

### async/await (ES2017)

Syntactic sugar over Promises — makes async code read like sync:

\`\`\`js
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed:", error);
  }
}
\`\`\`

### Promise Combinators

| Method | Behavior |
|--------|----------|
| \`Promise.all([...])\` | Resolves when ALL resolve; rejects if ANY rejects |
| \`Promise.allSettled([...])\` | Resolves when ALL settle (fulfilled or rejected) |
| \`Promise.race([...])\` | Resolves/rejects with the FIRST to settle |
| \`Promise.any([...])\` | Resolves with FIRST to fulfill; rejects if ALL reject |

### Error Handling

Always use \`try/catch\` with \`await\`, or \`.catch()\` with promise chains. Unhandled rejections crash Node.js and show warnings in browsers.`,
    },
    {
      id: "js-async-promise-chain",
      slug: "promise-chain",
      title: "Promise Chain",
      content: `## Promise Chain

### Problem

Implement helper functions for working with promises:

1. \`delay(ms)\` — returns a promise that resolves after \`ms\` milliseconds
2. \`sequence(tasks)\` — runs async tasks one after another, collecting results
3. \`timeout(promise, ms)\` — wraps a promise with a timeout; rejects if it takes too long

### Examples

\`\`\`js
await delay(100);  // resolves after 100ms

await sequence([
  () => delay(50).then(() => 1),
  () => delay(50).then(() => 2),
]); // [1, 2] — runs sequentially

await timeout(delay(50), 100); // resolves (50 < 100)
await timeout(delay(200), 100); // rejects (200 > 100)
\`\`\`

### Key Concepts

- Creating Promises with \`new Promise\`
- Sequential execution with \`reduce\` or \`for...of\`
- \`Promise.race\` for implementing timeouts
- Each task is a function returning a promise (thunk pattern)`,
      starterCode: `// Promise Chain
// Build promise utility functions

function delay(ms) {
  // Return a promise that resolves after ms milliseconds
  // YOUR CODE HERE
}

async function sequence(tasks) {
  // Run async task functions one at a time, in order
  // tasks is an array of functions, each returning a promise
  // Return an array of all results
  // YOUR CODE HERE
}

function timeout(promise, ms) {
  // Race the promise against a timer
  // If the promise doesn't resolve within ms, reject with "Timeout"
  // YOUR CODE HERE
}

// Test cases
async function runTests() {
  // Test delay
  const start = Date.now();
  await delay(100);
  const elapsed = Date.now() - start;
  console.log("Delay works:", elapsed >= 90); // Expected: true

  // Test sequence
  const results = await sequence([
    () => delay(50).then(() => "first"),
    () => delay(50).then(() => "second"),
    () => delay(50).then(() => "third"),
  ]);
  console.log("Sequence results:", results);
  // Expected: ["first", "second", "third"]

  // Test timeout - success case
  try {
    const fast = await timeout(delay(50).then(() => "done"), 200);
    console.log("Timeout success:", fast); // Expected: "done"
  } catch (e) {
    console.log("Should not reach here");
  }

  // Test timeout - failure case
  try {
    await timeout(delay(300).then(() => "too slow"), 100);
    console.log("Should not reach here");
  } catch (e) {
    console.log("Timeout error:", e); // Expected: "Timeout"
  }
}

runTests();`,
      solutionCode: `// Promise Chain
// Build promise utility functions

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sequence(tasks) {
  const results = [];
  for (const task of tasks) {
    const result = await task();
    results.push(result);
  }
  return results;
}

function timeout(promise, ms) {
  const timer = new Promise((_, reject) => {
    setTimeout(() => reject("Timeout"), ms);
  });
  return Promise.race([promise, timer]);
}

// Test cases
async function runTests() {
  // Test delay
  const start = Date.now();
  await delay(100);
  const elapsed = Date.now() - start;
  console.log("Delay works:", elapsed >= 90); // Expected: true

  // Test sequence
  const results = await sequence([
    () => delay(50).then(() => "first"),
    () => delay(50).then(() => "second"),
    () => delay(50).then(() => "third"),
  ]);
  console.log("Sequence results:", results);
  // Expected: ["first", "second", "third"]

  // Test timeout - success case
  try {
    const fast = await timeout(delay(50).then(() => "done"), 200);
    console.log("Timeout success:", fast); // Expected: "done"
  } catch (e) {
    console.log("Should not reach here");
  }

  // Test timeout - failure case
  try {
    await timeout(delay(300).then(() => "too slow"), 100);
    console.log("Should not reach here");
  } catch (e) {
    console.log("Timeout error:", e); // Expected: "Timeout"
  }
}

runTests();`,
    },
    {
      id: "js-async-retry",
      slug: "retry-function",
      title: "Retry Function",
      content: `## Retry Function

### Problem

Implement a \`retry\` function that attempts an async operation up to \`maxRetries\` times. If it fails every attempt, throw the last error. Optionally add exponential backoff between retries.

Also implement \`retryWithFallback\` that tries a primary function, then falls back to an alternative.

### Examples

\`\`\`js
// Succeeds on 3rd attempt
let attempts = 0;
await retry(async () => {
  if (++attempts < 3) throw new Error("fail");
  return "success";
}, 5); // "success"
\`\`\`

### Key Concepts

- \`for\` loop with \`try/catch\` for retry logic
- Exponential backoff: delay = baseDelay * 2^attempt
- Separating the operation (a function) from retry policy
- Real-world use: API calls, database connections`,
      starterCode: `// Retry Function
// Implement retry logic for async operations

async function retry(fn, maxRetries, baseDelay = 0) {
  // Try calling fn() up to maxRetries times
  // If baseDelay > 0, wait baseDelay * 2^attempt ms between retries
  // If all attempts fail, throw the last error
  // YOUR CODE HERE
}

async function retryWithFallback(primaryFn, fallbackFn, maxRetries) {
  // Try primaryFn up to maxRetries times
  // If all primary attempts fail, try fallbackFn once
  // If fallback also fails, throw the fallback error
  // YOUR CODE HERE
}

// Helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test cases
async function runTests() {
  // Test 1: Succeeds on first try
  const result1 = await retry(async () => "immediate", 3);
  console.log("Test 1:", result1); // Expected: "immediate"

  // Test 2: Succeeds on 3rd attempt
  let count2 = 0;
  const result2 = await retry(async () => {
    count2++;
    if (count2 < 3) throw new Error("not yet");
    return "third time";
  }, 5);
  console.log("Test 2:", result2); // Expected: "third time"
  console.log("Attempts:", count2); // Expected: 3

  // Test 3: All retries fail
  try {
    let count3 = 0;
    await retry(async () => {
      count3++;
      throw new Error(\`fail \${count3}\`);
    }, 3);
  } catch (e) {
    console.log("Test 3:", e.message); // Expected: "fail 3"
  }

  // Test 4: Fallback succeeds
  const result4 = await retryWithFallback(
    async () => { throw new Error("primary failed"); },
    async () => "fallback result",
    2
  );
  console.log("Test 4:", result4); // Expected: "fallback result"

  // Test 5: Both fail
  try {
    await retryWithFallback(
      async () => { throw new Error("primary"); },
      async () => { throw new Error("fallback"); },
      2
    );
  } catch (e) {
    console.log("Test 5:", e.message); // Expected: "fallback"
  }
}

runTests();`,
      solutionCode: `// Retry Function
// Implement retry logic for async operations

async function retry(fn, maxRetries, baseDelay = 0) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1 && baseDelay > 0) {
        await delay(baseDelay * Math.pow(2, attempt));
      }
    }
  }

  throw lastError;
}

async function retryWithFallback(primaryFn, fallbackFn, maxRetries) {
  try {
    return await retry(primaryFn, maxRetries);
  } catch {
    return await fallbackFn();
  }
}

// Helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test cases
async function runTests() {
  // Test 1: Succeeds on first try
  const result1 = await retry(async () => "immediate", 3);
  console.log("Test 1:", result1); // Expected: "immediate"

  // Test 2: Succeeds on 3rd attempt
  let count2 = 0;
  const result2 = await retry(async () => {
    count2++;
    if (count2 < 3) throw new Error("not yet");
    return "third time";
  }, 5);
  console.log("Test 2:", result2); // Expected: "third time"
  console.log("Attempts:", count2); // Expected: 3

  // Test 3: All retries fail
  try {
    let count3 = 0;
    await retry(async () => {
      count3++;
      throw new Error(\`fail \${count3}\`);
    }, 3);
  } catch (e) {
    console.log("Test 3:", e.message); // Expected: "fail 3"
  }

  // Test 4: Fallback succeeds
  const result4 = await retryWithFallback(
    async () => { throw new Error("primary failed"); },
    async () => "fallback result",
    2
  );
  console.log("Test 4:", result4); // Expected: "fallback result"

  // Test 5: Both fail
  try {
    await retryWithFallback(
      async () => { throw new Error("primary"); },
      async () => { throw new Error("fallback"); },
      2
    );
  } catch (e) {
    console.log("Test 5:", e.message); // Expected: "fallback"
  }
}

runTests();`,
    },
    {
      id: "js-async-parallel-fetcher",
      slug: "parallel-fetcher",
      title: "Parallel Fetcher",
      content: `## Parallel Fetcher

### Problem

Implement concurrency control utilities:

1. \`parallelLimit(tasks, limit)\` — runs async tasks with at most \`limit\` concurrent executions
2. \`allSettledMap(items, fn)\` — maps items through an async function, returning results with status

### Examples

\`\`\`js
// Run 10 tasks but only 3 at a time
await parallelLimit(tasks, 3);

// Map with error handling
await allSettledMap([1, 2, 3], async (n) => {
  if (n === 2) throw new Error("bad");
  return n * 2;
});
// [{status:"fulfilled",value:2}, {status:"rejected",reason:Error}, {status:"fulfilled",value:6}]
\`\`\`

### Key Concepts

- Concurrency control with a pool/slot system
- \`Promise.allSettled\` semantics (never rejects)
- Tracking fulfilled vs rejected results
- Real-world use: rate-limited API calls, batch processing`,
      starterCode: `// Parallel Fetcher
// Implement concurrency-limited parallel execution

async function parallelLimit(tasks, limit) {
  // Run async task functions with at most 'limit' running concurrently
  // tasks: array of functions returning promises
  // Return array of results in the same order as tasks
  // YOUR CODE HERE
}

async function allSettledMap(items, fn) {
  // Map each item through async fn
  // Return array of {status, value} or {status, reason} objects
  // Never rejects — always resolves with the full results array
  // YOUR CODE HERE
}

// Helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test cases
async function runTests() {
  // Test parallelLimit
  const log = [];
  const tasks = [1, 2, 3, 4, 5].map(n => async () => {
    log.push(\`start-\${n}\`);
    await delay(50);
    log.push(\`end-\${n}\`);
    return n * 10;
  });

  const results = await parallelLimit(tasks, 2);
  console.log("Results:", results);
  // Expected: [10, 20, 30, 40, 50]
  console.log("Order preserved:", results.join(",") === "10,20,30,40,50");
  // Expected: true

  // Test allSettledMap
  const settled = await allSettledMap([1, 2, 3, 4], async (n) => {
    await delay(10);
    if (n === 3) throw new Error("three is bad");
    return n * 2;
  });
  console.log("Settled results:");
  settled.forEach((r, i) => {
    if (r.status === "fulfilled") {
      console.log(\`  [\${i}] fulfilled: \${r.value}\`);
    } else {
      console.log(\`  [\${i}] rejected: \${r.reason.message}\`);
    }
  });
  // Expected:
  //   [0] fulfilled: 2
  //   [1] fulfilled: 4
  //   [2] rejected: three is bad
  //   [3] fulfilled: 8
}

runTests();`,
      solutionCode: `// Parallel Fetcher
// Implement concurrency-limited parallel execution

async function parallelLimit(tasks, limit) {
  const results = new Array(tasks.length);
  let index = 0;

  async function runNext() {
    while (index < tasks.length) {
      const currentIndex = index++;
      results[currentIndex] = await tasks[currentIndex]();
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    () => runNext()
  );

  await Promise.all(workers);
  return results;
}

async function allSettledMap(items, fn) {
  const promises = items.map(async (item) => {
    try {
      const value = await fn(item);
      return { status: "fulfilled", value };
    } catch (error) {
      return { status: "rejected", reason: error };
    }
  });

  return Promise.all(promises);
}

// Helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test cases
async function runTests() {
  // Test parallelLimit
  const log = [];
  const tasks = [1, 2, 3, 4, 5].map(n => async () => {
    log.push(\`start-\${n}\`);
    await delay(50);
    log.push(\`end-\${n}\`);
    return n * 10;
  });

  const results = await parallelLimit(tasks, 2);
  console.log("Results:", results);
  // Expected: [10, 20, 30, 40, 50]
  console.log("Order preserved:", results.join(",") === "10,20,30,40,50");
  // Expected: true

  // Test allSettledMap
  const settled = await allSettledMap([1, 2, 3, 4], async (n) => {
    await delay(10);
    if (n === 3) throw new Error("three is bad");
    return n * 2;
  });
  console.log("Settled results:");
  settled.forEach((r, i) => {
    if (r.status === "fulfilled") {
      console.log(\`  [\${i}] fulfilled: \${r.value}\`);
    } else {
      console.log(\`  [\${i}] rejected: \${r.reason.message}\`);
    }
  });
  // Expected:
  //   [0] fulfilled: 2
  //   [1] fulfilled: 4
  //   [2] rejected: three is bad
  //   [3] fulfilled: 8
}

runTests();`,
    },
  ],
};
