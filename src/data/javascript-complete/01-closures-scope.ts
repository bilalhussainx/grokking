import { Module } from "../types";

export const module1: Module = {
  id: "closures-scope",
  title: "Closures, Scope & the Execution Context",
  description: "Understand how JavaScript really works: execution contexts, call stack, scope chain, closures, and the module pattern",
  lessons: [
    {
      id: "execution-context",
      slug: "execution-context",
      title: "Execution Context, Call Stack & Hoisting",
      content: `
# How JavaScript Executes Code

Before writing a single line, the JavaScript engine does two things: creates an **Execution Context** and runs through two phases — creation then execution.

\`\`\`concept
{
  "title": "Execution Context",
  "description": "Every time JavaScript runs code, it creates an Execution Context — a container holding the current scope's variables, the value of 'this', and a reference to the outer scope.",
  "points": [
    "Global Execution Context: created on startup — sets up 'window' (browser) or 'global' (Node)",
    "Function Execution Context: created each time a function is called",
    "Creation phase: variables hoisted (var → undefined, let/const → TDZ), functions fully hoisted",
    "Execution phase: code runs line by line",
    "Call Stack: LIFO structure — tracks which context is currently executing",
    "Stack overflow: infinite recursion fills the call stack"
  ]
}
\`\`\`

## Hoisting

\`\`\`tabs
[
  {
    "label": "var Hoisting",
    "content": "// var declarations are hoisted AND initialized to undefined\\nconsole.log(name); // undefined (NOT ReferenceError)\\nvar name = 'Alice';\\nconsole.log(name); // 'Alice'\\n\\n// What JS actually does:\\nvar name = undefined; // hoisted to top\\nconsole.log(name);    // undefined\\nname = 'Alice';\\nconsole.log(name);    // 'Alice'\\n\\n// Function declarations are FULLY hoisted (definition too):\\ngreet();           // 'Hello!' — works before declaration!\\nfunction greet() { console.log('Hello!'); }"
  },
  {
    "label": "let/const TDZ",
    "content": "// let and const are hoisted but NOT initialized\\n// Accessing before declaration = ReferenceError (Temporal Dead Zone)\\nconsole.log(x); // ReferenceError: Cannot access 'x' before initialization\\nlet x = 5;\\n\\n// Function expressions are NOT hoisted (assigned to var/let/const):\\ngreet(); // TypeError: greet is not a function\\nvar greet = function() { console.log('Hi!'); };\\n\\n// Arrow functions same:\\narrow(); // TypeError\\nvar arrow = () => console.log('Arrow!');"
  }
]
\`\`\`

## Scope & Scope Chain

\`\`\`javascript
// JavaScript uses LEXICAL scoping — scope determined by where code is WRITTEN, not called

const globalVar = 'I am global';

function outer() {
  const outerVar = 'I am outer';

  function inner() {
    const innerVar = 'I am inner';

    // Scope chain lookup: inner → outer → global
    console.log(innerVar);  // own scope ✓
    console.log(outerVar);  // outer scope ✓
    console.log(globalVar); // global scope ✓
  }

  // console.log(innerVar); // ReferenceError — can't go inward!
  inner();
}

outer();
\`\`\`

## Closures

A closure is a function that **remembers its lexical scope** even when executed outside that scope.

\`\`\`tabs
[
  {
    "label": "Classic Closure",
    "content": "function makeCounter(initial = 0) {\\n  let count = initial; // 'count' is captured in the closure\\n\\n  return {\\n    increment() { return ++count; },\\n    decrement() { return --count; },\\n    value()     { return count; },\\n    reset()     { count = initial; },\\n  };\\n}\\n\\nconst counter = makeCounter(10);\\ncounter.increment(); // 11\\ncounter.increment(); // 12\\ncounter.decrement(); // 11\\ncounter.value();     // 11\\n// count is PRIVATE — only accessible through the returned methods"
  },
  {
    "label": "Classic Bug & Fix",
    "content": "// Classic closure bug with var in loops:\\nfor (var i = 0; i < 3; i++) {\\n  setTimeout(() => console.log(i), 100);\\n}\\n// Prints: 3, 3, 3 — all callbacks share same 'i'\\n\\n// Fix 1: use let (block-scoped — new binding per iteration):\\nfor (let i = 0; i < 3; i++) {\\n  setTimeout(() => console.log(i), 100);\\n}\\n// Prints: 0, 1, 2 ✓\\n\\n// Fix 2: IIFE to capture current value:\\nfor (var i = 0; i < 3; i++) {\\n  ((j) => setTimeout(() => console.log(j), 100))(i);\\n}\\n// Prints: 0, 1, 2 ✓"
  },
  {
    "label": "Practical Uses",
    "content": "// 1. Data privacy (module-like encapsulation):\\nconst userStore = (() => {\\n  let users = [];\\n  return {\\n    add: (user) => users.push(user),\\n    getAll: () => [...users], // return copy, not reference\\n    count: () => users.length,\\n  };\\n})(); // IIFE — immediately invoked\\n\\n// 2. Memoization / caching:\\nfunction memoize(fn) {\\n  const cache = new Map();\\n  return function(...args) {\\n    const key = JSON.stringify(args);\\n    if (cache.has(key)) return cache.get(key);\\n    const result = fn(...args);\\n    cache.set(key, result);\\n    return result;\\n  };\\n}\\nconst fib = memoize(n => n <= 1 ? n : fib(n-1) + fib(n-2));"
  }
]
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is a closure?",
      "options": [
        "A function with no parameters",
        "A function that has access to variables from its outer scope even after the outer function has returned",
        "A self-invoking function",
        "A function that closes the program"
      ],
      "answer": 1,
      "explanation": "A closure is formed when a function 'closes over' its surrounding lexical environment. The inner function maintains a reference to the outer scope's variables, keeping them alive in memory even after the outer function has finished."
    },
    {
      "q": "Why does using 'var' in a for loop with setTimeout print the wrong values?",
      "options": [
        "setTimeout is buggy",
        "var has function scope — all loop iterations share one 'i' binding, which is 3 by the time callbacks run",
        "for loops don't work with closures",
        "var is asynchronous"
      ],
      "answer": 1,
      "explanation": "var is function-scoped, not block-scoped. All iterations share the SAME 'i' variable. By the time setTimeout callbacks fire, the loop has completed and 'i' is 3. 'let' creates a new binding for each iteration."
    }
  ]
}
\`\`\`
`,
      starterCode: `// Build a function factory that creates rate-limited functions.
// createRateLimiter(fn, limit, windowMs) should:
// - Allow fn to be called at most 'limit' times per 'windowMs' milliseconds
// - Return the result if within limit, throw RangeError if exceeded
// - Calls older than windowMs should not count toward the limit
// Uses closures to maintain state

function createRateLimiter(fn, limit, windowMs) {
  // TODO: Use closure to track call timestamps
  return function(...args) {
    // TODO: implement rate limiting logic
    return fn(...args);
  };
}

// Test:
const limitedFn = createRateLimiter((x) => x * 2, 3, 1000); // 3 calls per second
console.log(limitedFn(5));  // 10
console.log(limitedFn(5));  // 10
console.log(limitedFn(5));  // 10
// limitedFn(5); // should throw RangeError`,
      solutionCode: `function createRateLimiter(fn, limit, windowMs) {
  const calls = []; // closure captures this array

  return function(...args) {
    const now = Date.now();
    // Remove timestamps older than the window:
    while (calls.length > 0 && now - calls[0] > windowMs) {
      calls.shift();
    }
    if (calls.length >= limit) {
      throw new RangeError(\`Rate limit exceeded: max \${limit} calls per \${windowMs}ms\`);
    }
    calls.push(now);
    return fn(...args);
  };
}

const limitedFn = createRateLimiter((x) => x * 2, 3, 1000);
console.log(limitedFn(5)); // 10
console.log(limitedFn(5)); // 10
console.log(limitedFn(5)); // 10
try { limitedFn(5); } catch(e) { console.log(e.message); } // Rate limit exceeded`,
    },
    {
      id: "prototypes-classes",
      slug: "prototypes-classes",
      title: "Prototypes, Prototype Chain & ES6 Classes",
      content: `
# Prototypes & the Prototype Chain

JavaScript's object model is prototype-based. Classes are syntactic sugar over this.

\`\`\`concept
{
  "title": "The Prototype Chain",
  "description": "Every object in JavaScript has a hidden [[Prototype]] link to another object. Property lookup walks up this chain until it finds the property or hits null.",
  "points": [
    "Every function has a .prototype property (an object)",
    "new Fn() creates an object whose [[Prototype]] = Fn.prototype",
    "Property lookup: own properties first, then [[Prototype]], then [[Prototype]].__proto__, etc.",
    "Object.prototype is at the top — has: toString, hasOwnProperty, etc.",
    "Object.create(proto) creates an object with proto as its [[Prototype]]",
    "ES6 classes are syntactic sugar — the prototype chain works identically",
    "instanceof checks if a prototype is anywhere in the chain"
  ]
}
\`\`\`

## Prototype Chain in Action

\`\`\`javascript
// Constructor function (pre-class syntax):
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return \`\${this.name} makes a noise.\`;
};

function Dog(name) {
  Animal.call(this, name); // super()
}
Dog.prototype = Object.create(Animal.prototype); // inherit
Dog.prototype.constructor = Dog; // fix constructor reference

Dog.prototype.bark = function() {
  return \`\${this.name} barks!\`;
};

const rex = new Dog('Rex');
rex.bark();   // 'Rex barks!'    — own prototype
rex.speak();  // 'Rex makes a noise.' — Animal.prototype
rex.toString(); // Object.prototype

// Chain: rex → Dog.prototype → Animal.prototype → Object.prototype → null

// ES6 class (same result, cleaner syntax):
class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes a noise.\`; }
}
class Dog extends Animal {
  bark() { return \`\${this.name} barks!\`; }
}
\`\`\`

## Object.create & Pure Prototypal Inheritance

\`\`\`javascript
const vehicleProto = {
  start() { return \`\${this.make} started\`; },
  stop()  { return \`\${this.make} stopped\`; },
};

// Factory function — no 'new' required:
function createCar(make, model, year) {
  const car = Object.create(vehicleProto); // [[Prototype]] = vehicleProto
  car.make = make;
  car.model = model;
  car.year = year;
  return car;
}

const tesla = createCar('Tesla', 'Model 3', 2024);
tesla.start(); // 'Tesla started'
Object.getPrototypeOf(tesla) === vehicleProto; // true
\`\`\`

## this — The Context Problem

\`\`\`tabs
[
  {
    "label": "this Rules",
    "content": "// 'this' is determined at CALL TIME (not definition time) — except arrows\\n\\n// 1. Method call: this = the object before the dot\\nconst obj = {\\n  name: 'Alice',\\n  greet() { return this.name; } // this = obj\\n};\\nobj.greet(); // 'Alice'\\n\\n// 2. Standalone: this = undefined (strict) or window\\nconst fn = obj.greet; // detach from object\\nfn(); // undefined or window.name\\n\\n// 3. new: this = newly created object\\nfunction User(name) { this.name = name; }\\nnew User('Bob'); // this = {} → {name: 'Bob'}\\n\\n// 4. Explicit: call/apply/bind\\nobj.greet.call({ name: 'Charlie' }); // 'Charlie'"
  },
  {
    "label": "Arrow Functions & this",
    "content": "// Arrow functions DON'T have their own 'this'\\n// They lexically inherit 'this' from the enclosing scope\\n\\nclass Timer {\\n  constructor() { this.seconds = 0; }\\n\\n  start() {\\n    // 'this' inside arrow = Timer instance (inherited from start's 'this')\\n    setInterval(() => {\\n      this.seconds++;\\n      console.log(this.seconds); // works correctly!\\n    }, 1000);\\n  }\\n}\\n\\n// If setInterval used a regular function:\\n// setInterval(function() { this.seconds++; }, 1000);\\n// 'this' would be window/global — broken!"
  }
]
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does 'new' do when calling a constructor function?",
      "options": [
        "Only allocates memory",
        "Creates a new empty object, sets its [[Prototype]] to the constructor's .prototype, runs the function with 'this' = that object, returns it",
        "Calls Object.create() with the function",
        "Sets the prototype to Object.prototype"
      ],
      "answer": 1,
      "explanation": "new: (1) creates {} with [[Prototype]] = Constructor.prototype, (2) calls Constructor with this = that {}, (3) returns the object (or the explicit return value if it's an object)."
    },
    {
      "q": "Why do arrow functions not work as constructors?",
      "options": [
        "They're too new",
        "Arrow functions have no .prototype and no own 'this' binding — 'new' requires both",
        "Performance reasons",
        "They only work in strict mode"
      ],
      "answer": 1,
      "explanation": "Arrow functions have no .prototype property and no own 'this' binding. Since 'new' requires both (to set [[Prototype]] and bind this), arrow functions cannot be used as constructors."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
