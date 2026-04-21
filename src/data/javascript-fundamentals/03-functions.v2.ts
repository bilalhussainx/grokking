import { Module } from "../types";

export const functionsModule: Module = {
  id: "js-functions",
  title: "Functions & Closures",
  description: "Explore function declarations, arrow functions, higher-order functions, callbacks, and the power of closures.",
  lessons: [
    {
      id: "js-functions-intro",
      slug: "js-functions-intro",
      title: "Introduction to Functions",
      content: `## Functions in JavaScript

Functions are **first-class citizens** in JavaScript. They can be assigned to variables, passed as arguments, and returned from other functions.

### Function Declarations vs Expressions

\`\`\`js
// Declaration — hoisted, available before definition
function add(a, b) { return a + b; }

// Expression — NOT hoisted
const add = function(a, b) { return a + b; };
\`\`\`

### Arrow Functions (ES6)

\`\`\`js
const add = (a, b) => a + b;         // implicit return
const greet = name => \\\`Hi \\\${name}\\\`; // single param, no parens needed
const log = () => console.log("hi"); // no params
\`\`\`

Arrow functions do **not** have their own \`this\`, \`arguments\`, or \`super\`.

### Higher-Order Functions

Functions that take or return other functions:

\`\`\`js
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);     // [2, 4, 6, 8, 10]
const evens = numbers.filter(n => n % 2 === 0); // [2, 4]
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15
\`\`\`

### Closures

A closure is a function that **remembers** its outer scope even after the outer function has returned:

\`\`\`js
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
counter(); // 1
counter(); // 2
\`\`\`

Closures enable data privacy, factories, and stateful functions without classes.`,
    },
    {
      id: "js-functions-array-transformer",
      slug: "array-transformer",
      title: "Array Transformer",
      content: `## Array Transformer

### Problem

Implement three utility functions using \`map\`, \`filter\`, and \`reduce\`:

1. \`doubleOdds(arr)\` — doubles only the odd numbers, removes evens
2. \`sumPositive(arr)\` — sums all positive numbers in the array
3. \`pipeline(value, ...fns)\` — passes a value through a series of functions left-to-right

### Examples

\`\`\`js
doubleOdds([1, 2, 3, 4, 5])  // [2, 6, 10]
sumPositive([1, -2, 3, -4])   // 4
pipeline(5, x => x * 2, x => x + 1) // 11
\`\`\`

### Key Concepts

- Chaining \`filter\` then \`map\`
- Using \`reduce\` for accumulation
- Rest parameters (\`...fns\`) for variadic functions
- \`reduce\` as a universal iterator`,
      starterCode: `// Array Transformer
// Practice map, filter, reduce, and function composition

function doubleOdds(arr) {
  // Filter to keep only odd numbers, then double each
  // YOUR CODE HERE
}

function sumPositive(arr) {
  // Sum all positive numbers using reduce
  // YOUR CODE HERE
}

function pipeline(value, ...fns) {
  // Pass value through each function left-to-right
  // pipeline(5, double, addOne) => addOne(double(5))
  // YOUR CODE HERE
}

// Test cases
console.log(doubleOdds([1, 2, 3, 4, 5]));     // Expected: [2, 6, 10]
console.log(doubleOdds([10, 21, 32, 43]));     // Expected: [42, 86]
console.log(doubleOdds([]));                    // Expected: []

console.log(sumPositive([1, -2, 3, -4, 5]));   // Expected: 9
console.log(sumPositive([-1, -2, -3]));         // Expected: 0
console.log(sumPositive([10, 20, 30]));         // Expected: 60

console.log(pipeline(5, x => x * 2, x => x + 1));           // Expected: 11
console.log(pipeline("hello", s => s.toUpperCase(), s => s + "!")); // Expected: "HELLO!"
console.log(pipeline(3, x => x * x, x => x - 1, x => x / 2));     // Expected: 4`,
      solutionCode: `// Array Transformer
// Practice map, filter, reduce, and function composition

function doubleOdds(arr) {
  return arr.filter(n => n % 2 !== 0).map(n => n * 2);
}

function sumPositive(arr) {
  return arr.reduce((sum, n) => n > 0 ? sum + n : sum, 0);
}

function pipeline(value, ...fns) {
  return fns.reduce((result, fn) => fn(result), value);
}

// Test cases
console.log(doubleOdds([1, 2, 3, 4, 5]));     // Expected: [2, 6, 10]
console.log(doubleOdds([10, 21, 32, 43]));     // Expected: [42, 86]
console.log(doubleOdds([]));                    // Expected: []

console.log(sumPositive([1, -2, 3, -4, 5]));   // Expected: 9
console.log(sumPositive([-1, -2, -3]));         // Expected: 0
console.log(sumPositive([10, 20, 30]));         // Expected: 60

console.log(pipeline(5, x => x * 2, x => x + 1));           // Expected: 11
console.log(pipeline("hello", s => s.toUpperCase(), s => s + "!")); // Expected: "HELLO!"
console.log(pipeline(3, x => x * x, x => x - 1, x => x / 2));     // Expected: 4`,
    },
    {
      id: "js-functions-debounce",
      slug: "debounce-function",
      title: "Debounce Function",
      content: `## Debounce Function

### Problem

Implement a \`debounce\` function that delays invoking a function until \`delay\` milliseconds have elapsed since the last call. If called again before the delay expires, the timer resets.

Also implement \`throttle\` — it ensures a function is called **at most once** per \`interval\` milliseconds.

### Examples

\`\`\`js
const debouncedLog = debounce(console.log, 300);
debouncedLog("a"); // timer starts
debouncedLog("b"); // timer resets
// after 300ms: logs "b" (only the last call)
\`\`\`

### Key Concepts

- Closures hold the timer reference between calls
- \`setTimeout\` and \`clearTimeout\` for debounce
- \`Date.now()\` for throttle timing
- Real-world uses: search input, scroll handlers, resize events`,
      starterCode: `// Debounce & Throttle
// Classic closure + timer patterns

function debounce(fn, delay) {
  // Return a new function that delays calling fn
  // If called again before delay expires, reset the timer
  // The returned function should pass through all arguments
  // YOUR CODE HERE
}

function throttle(fn, interval) {
  // Return a new function that calls fn at most once per interval
  // Subsequent calls within the interval are ignored
  // YOUR CODE HERE
}

// Test cases (using synchronous simulation)
// We'll test the logic by tracking calls

function createTracker() {
  const calls = [];
  const fn = (...args) => calls.push(args);
  fn.getCalls = () => calls;
  return fn;
}

// Test debounce logic
const tracker1 = createTracker();
const debouncedFn = debounce(tracker1, 100);
debouncedFn("a");
debouncedFn("b");
debouncedFn("c");
// Only "c" should fire after 100ms

setTimeout(() => {
  console.log("Debounce calls:", tracker1.getCalls());
  // Expected after 100ms: [["c"]]
}, 200);

// Test throttle logic
const tracker2 = createTracker();
const throttledFn = throttle(tracker2, 100);
throttledFn("first");   // should execute
throttledFn("second");  // should be ignored
throttledFn("third");   // should be ignored

console.log("Throttle immediate calls:", tracker2.getCalls());
// Expected: [["first"]]

setTimeout(() => {
  throttledFn("fourth"); // should execute (interval passed)
  console.log("Throttle after interval:", tracker2.getCalls());
  // Expected: [["first"], ["fourth"]]
}, 150);`,
      solutionCode: `// Debounce & Throttle
// Classic closure + timer patterns

function debounce(fn, delay) {
  let timeoutId = null;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

function throttle(fn, interval) {
  let lastCallTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCallTime >= interval) {
      lastCallTime = now;
      fn(...args);
    }
  };
}

// Test cases (using synchronous simulation)
// We'll test the logic by tracking calls

function createTracker() {
  const calls = [];
  const fn = (...args) => calls.push(args);
  fn.getCalls = () => calls;
  return fn;
}

// Test debounce logic
const tracker1 = createTracker();
const debouncedFn = debounce(tracker1, 100);
debouncedFn("a");
debouncedFn("b");
debouncedFn("c");
// Only "c" should fire after 100ms

setTimeout(() => {
  console.log("Debounce calls:", tracker1.getCalls());
  // Expected after 100ms: [["c"]]
}, 200);

// Test throttle logic
const tracker2 = createTracker();
const throttledFn = throttle(tracker2, 100);
throttledFn("first");   // should execute
throttledFn("second");  // should be ignored
throttledFn("third");   // should be ignored

console.log("Throttle immediate calls:", tracker2.getCalls());
// Expected: [["first"]]

setTimeout(() => {
  throttledFn("fourth"); // should execute (interval passed)
  console.log("Throttle after interval:", tracker2.getCalls());
  // Expected: [["first"], ["fourth"]]
}, 150);`,
    },
    {
      id: "js-functions-compose",
      slug: "compose-functions",
      title: "Compose Functions",
      content: `## Compose Functions

### Problem

Implement functional composition utilities:

1. \`compose(...fns)\` — returns a function that applies fns **right-to-left**
2. \`pipe(...fns)\` — returns a function that applies fns **left-to-right**
3. \`memoize(fn)\` — returns a cached version of a single-argument function

### Examples

\`\`\`js
const double = x => x * 2;
const addOne = x => x + 1;

compose(addOne, double)(5)  // 11 — double first, then addOne
pipe(double, addOne)(5)     // 11 — double first, then addOne
\`\`\`

### Key Concepts

- \`compose\` applies functions right-to-left (mathematical convention)
- \`pipe\` applies functions left-to-right (more readable)
- \`reduceRight\` vs \`reduce\` for direction
- Memoization uses a closure to cache results in a Map`,
      starterCode: `// Compose, Pipe, and Memoize
// Master functional programming patterns

function compose(...fns) {
  // Return a function that applies fns right-to-left
  // compose(f, g, h)(x) === f(g(h(x)))
  // YOUR CODE HERE
}

function pipe(...fns) {
  // Return a function that applies fns left-to-right
  // pipe(f, g, h)(x) === h(g(f(x)))
  // YOUR CODE HERE
}

function memoize(fn) {
  // Return a memoized version of fn
  // Cache results using a Map with the argument as key
  // Only needs to handle single-argument functions
  // YOUR CODE HERE
}

// Test cases
const double = x => x * 2;
const addOne = x => x + 1;
const square = x => x * x;

const composed = compose(addOne, double);
console.log(composed(5));  // Expected: 11 (double(5)=10, addOne(10)=11)

const piped = pipe(double, addOne);
console.log(piped(5));     // Expected: 11 (double(5)=10, addOne(10)=11)

const transform = compose(square, addOne, double);
console.log(transform(3)); // Expected: 49 (double(3)=6, addOne(6)=7, square(7)=49)

const piped2 = pipe(double, addOne, square);
console.log(piped2(3));    // Expected: 49

// Memoize test
let callCount = 0;
const expensiveSquare = (n) => {
  callCount++;
  return n * n;
};
const memoSquare = memoize(expensiveSquare);

console.log(memoSquare(4));  // Expected: 16 (computed)
console.log(memoSquare(4));  // Expected: 16 (cached)
console.log(memoSquare(5));  // Expected: 25 (computed)
console.log("Call count:", callCount); // Expected: 2 (4 and 5, not 3)`,
      solutionCode: `// Compose, Pipe, and Memoize
// Master functional programming patterns

function compose(...fns) {
  return function (value) {
    return fns.reduceRight((result, fn) => fn(result), value);
  };
}

function pipe(...fns) {
  return function (value) {
    return fns.reduce((result, fn) => fn(result), value);
  };
}

function memoize(fn) {
  const cache = new Map();
  return function (arg) {
    if (cache.has(arg)) {
      return cache.get(arg);
    }
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

// Test cases
const double = x => x * 2;
const addOne = x => x + 1;
const square = x => x * x;

const composed = compose(addOne, double);
console.log(composed(5));  // Expected: 11 (double(5)=10, addOne(10)=11)

const piped = pipe(double, addOne);
console.log(piped(5));     // Expected: 11 (double(5)=10, addOne(10)=11)

const transform = compose(square, addOne, double);
console.log(transform(3)); // Expected: 49 (double(3)=6, addOne(6)=7, square(7)=49)

const piped2 = pipe(double, addOne, square);
console.log(piped2(3));    // Expected: 49

// Memoize test
let callCount = 0;
const expensiveSquare = (n) => {
  callCount++;
  return n * n;
};
const memoSquare = memoize(expensiveSquare);

console.log(memoSquare(4));  // Expected: 16 (computed)
console.log(memoSquare(4));  // Expected: 16 (cached)
console.log(memoSquare(5));  // Expected: 25 (computed)
console.log("Call count:", callCount); // Expected: 2 (4 and 5, not 3)`,
    },
  ],
};
