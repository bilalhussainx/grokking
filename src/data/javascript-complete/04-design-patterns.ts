import { Module } from "../types";

export const module4: Module = {
  id: "design-patterns",
  title: "JavaScript Design Patterns",
  description: "Module, Observer, Factory, Singleton, Decorator, and other patterns in modern JavaScript",
  lessons: [
    {
      id: "creational-patterns",
      slug: "creational-patterns",
      title: "Module, Singleton & Factory Patterns",
      content: `
# JavaScript Design Patterns

Design patterns are reusable solutions to common problems. JavaScript's flexibility means patterns often look different from classical OOP languages.

## The Module Pattern

\`\`\`concept
{
  "title": "Module Pattern",
  "description": "Encapsulates private state and exposes a public API — the foundation of JavaScript modularity",
  "points": [
    "IIFE: Immediately Invoked Function Expression — creates a private scope",
    "Revealing Module: explicitly return the public API, keep implementation private",
    "ES Modules (import/export) are the modern standard — static, tree-shakeable",
    "CommonJS (require/module.exports) is Node.js's original module system",
    "Named exports: multiple values; Default export: one primary value per module"
  ]
}
\`\`\`

\`\`\`tabs
[
  {
    "label": "IIFE Module",
    "content": "// Classic IIFE module (pre-ES6):\\nconst CartModule = (() => {\\n  // Private state:\\n  let items = [];\\n  let discount = 0;\\n\\n  // Private function:\\n  function calculateTotal() {\\n    const sum = items.reduce((t, i) => t + i.price * i.qty, 0);\\n    return sum * (1 - discount);\\n  }\\n\\n  // Public API:\\n  return {\\n    addItem(item) { items.push(item); },\\n    removeItem(id) { items = items.filter(i => i.id !== id); },\\n    setDiscount(pct) { discount = pct / 100; },\\n    getTotal() { return calculateTotal(); },\\n    getItems() { return [...items]; }, // return copy\\n    clear() { items = []; discount = 0; },\\n  };\\n})();\\n\\nCartModule.addItem({ id: 1, name: 'Widget', price: 10, qty: 2 });\\nCartModule.getTotal(); // 20"
  },
  {
    "label": "ES Module",
    "content": "// cart.js — ES Module (modern standard)\\nlet items = [];                    // module-scoped private\\n\\nexport function addItem(item) {    // named export\\n  items.push(item);\\n}\\n\\nexport function getItems() {\\n  return [...items];\\n}\\n\\nexport function getTotal() {\\n  return items.reduce((t, i) => t + i.price * i.qty, 0);\\n}\\n\\nexport function clear() { items = []; }\\n\\n// main.js:\\nimport { addItem, getTotal, clear } from './cart.js';\\n// OR:\\nimport * as Cart from './cart.js';\\nCart.addItem({ id: 1, price: 10, qty: 2 });"
  }
]
\`\`\`

## Singleton Pattern

\`\`\`javascript
// Singleton: only one instance of a class/object exists

// Option 1: Module-level variable (ES module = natural singleton)
// config.js — this module is cached after first import
let _config = null;

export function getConfig() {
  if (!_config) {
    _config = {
      apiUrl: process.env.API_URL,
      timeout: 5000,
      retries: 3,
    };
  }
  return _config;
}

// Option 2: Class with static instance
class Database {
  static #instance = null;

  constructor(url) {
    if (Database.#instance) return Database.#instance;
    this.url = url;
    this.connection = null;
    Database.#instance = this;
  }

  static getInstance(url) {
    return Database.#instance ?? new Database(url);
  }

  async connect() {
    if (!this.connection) {
      this.connection = await createConnection(this.url);
    }
    return this.connection;
  }
}

// Both refer to same instance:
const db1 = Database.getInstance('postgresql://localhost/mydb');
const db2 = Database.getInstance();
db1 === db2; // true
\`\`\`

## Factory Pattern

\`\`\`javascript
// Factory: creates objects without specifying exact class

// Simple factory function:
function createUser(role) {
  const base = {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    permissions: [],
  };

  switch (role) {
    case 'admin':
      return { ...base, role, permissions: ['read', 'write', 'delete', 'manage'] };
    case 'editor':
      return { ...base, role, permissions: ['read', 'write'] };
    case 'viewer':
      return { ...base, role, permissions: ['read'] };
    default:
      throw new Error(\`Unknown role: \${role}\`);
  }
}

// Factory with registry (extensible):
class ShapeFactory {
  static #registry = new Map();

  static register(type, creator) {
    this.#registry.set(type, creator);
  }

  static create(type, ...args) {
    const creator = this.#registry.get(type);
    if (!creator) throw new Error(\`Unknown shape: \${type}\`);
    return creator(...args);
  }
}

ShapeFactory.register('circle', (r) => ({ type: 'circle', radius: r, area: () => Math.PI * r * r }));
ShapeFactory.register('rect', (w, h) => ({ type: 'rect', width: w, height: h, area: () => w * h }));

const circle = ShapeFactory.create('circle', 5);
circle.area(); // 78.5...
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Why are ES modules natural singletons?",
      "options": [
        "They use the Singleton pattern internally",
        "Module code runs once and the module is cached — subsequent imports get the same instance",
        "ES modules don't allow multiple instances by design",
        "JavaScript prohibits creating multiple objects from modules"
      ],
      "answer": 1,
      "explanation": "ES modules are evaluated once and cached by the module system. All imports of the same module receive the same module namespace object. Any module-level state is shared across all importers — making them natural singletons."
    }
  ]
}
\`\`\`
`,
    },
    {
      id: "behavioral-patterns",
      slug: "behavioral-patterns",
      title: "Observer, Strategy, Decorator & Proxy Patterns",
      content: `
# Behavioral & Structural Patterns

## Observer / EventEmitter Pattern

\`\`\`javascript
// Observer: objects subscribe to events and react when they occur

class EventEmitter {
  #listeners = new Map();

  on(event, listener) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(listener);
    return () => this.off(event, listener); // returns unsubscribe fn
  }

  off(event, listener) {
    this.#listeners.get(event)?.delete(listener);
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  emit(event, ...args) {
    this.#listeners.get(event)?.forEach(listener => listener(...args));
  }
}

// Usage:
class Store extends EventEmitter {
  #state;
  constructor(initialState) {
    super();
    this.#state = initialState;
  }

  setState(updater) {
    const prev = this.#state;
    this.#state = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
    this.emit('change', this.#state, prev);
  }

  getState() { return this.#state; }
}

const store = new Store({ count: 0, user: null });
const unsub = store.on('change', (newState) => console.log('State:', newState));
store.setState(s => ({ ...s, count: s.count + 1 }));
unsub(); // remove listener
\`\`\`

## Strategy Pattern

\`\`\`javascript
// Strategy: swap algorithms at runtime — separates "what" from "how"

// Sorting strategy:
const sortStrategies = {
  quickSort: (arr) => { /* quick sort */ return [...arr].sort(); },
  mergeSort: (arr) => { /* merge sort */ return [...arr].sort(); },
  bubbleSort: (arr) => { /* bubble sort */ return [...arr].sort(); },
};

class DataSorter {
  #strategy;
  constructor(strategy = sortStrategies.quickSort) {
    this.#strategy = strategy;
  }
  setStrategy(strategy) { this.#strategy = strategy; }
  sort(data) { return this.#strategy(data); }
}

// Payment strategy (real-world):
const paymentStrategies = {
  creditCard: async ({ amount, card }) => chargeCard(card, amount),
  paypal: async ({ amount, email }) => chargePaypal(email, amount),
  crypto: async ({ amount, wallet }) => sendCrypto(wallet, amount),
};

async function checkout(cart, method, details) {
  const strategy = paymentStrategies[method];
  if (!strategy) throw new Error(\`Payment method not supported: \${method}\`);
  return strategy({ amount: cart.total, ...details });
}
\`\`\`

## Decorator Pattern

\`\`\`javascript
// Decorator: add behavior to an object/function without modifying it

// Function decorators:
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

function throttle(fn, ms) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

// Compose decorators:
const handleSearch = debounce(
  memoize(
    async (query) => fetch(\`/api/search?q=\${query}\`).then(r => r.json())
  ),
  300
);
\`\`\`

## Proxy Pattern

\`\`\`javascript
// Proxy: intercept operations on an object

// Validation proxy:
function createValidatedUser(user) {
  return new Proxy(user, {
    set(target, prop, value) {
      if (prop === 'age' && (typeof value !== 'number' || value < 0)) {
        throw new TypeError('Age must be a non-negative number');
      }
      if (prop === 'email' && !value.includes('@')) {
        throw new TypeError('Invalid email');
      }
      target[prop] = value;
      return true;
    },
    get(target, prop) {
      if (!(prop in target)) {
        throw new ReferenceError(\`Property "\${prop}" does not exist\`);
      }
      return target[prop];
    },
  });
}

// Reactive data (Vue 3's reactivity core uses Proxy):
function reactive(obj, onChange) {
  return new Proxy(obj, {
    set(target, key, value) {
      const old = target[key];
      target[key] = value;
      if (old !== value) onChange(key, value, old);
      return true;
    },
  });
}

const state = reactive({ count: 0 }, (key, newVal) => {
  console.log(\`\${key} changed to \${newVal}\`);
  render();
});
state.count++; // logs: "count changed to 1"
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What problem does the Observer pattern solve?",
      "options": [
        "Memory leaks",
        "Decoupling: objects can react to events without the emitter knowing who's listening",
        "Synchronization between threads",
        "Object creation"
      ],
      "answer": 1,
      "explanation": "Observer decouples event producers from consumers. The emitter doesn't need to know what subscribes to its events — it just emits. This reduces coupling and makes components independently testable."
    },
    {
      "q": "What is the difference between debounce and throttle?",
      "options": [
        "They are identical",
        "Debounce delays until calls stop; throttle limits to once per interval",
        "Throttle delays until calls stop; debounce limits to once per interval",
        "Debounce is only for async functions"
      ],
      "answer": 1,
      "explanation": "Debounce: resets the timer on every call — fires only after the caller stops calling for N ms (e.g., search box). Throttle: fires at most once per N ms regardless of call frequency (e.g., scroll handlers)."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Module pattern: IIFE or ES modules give you private state with a controlled public API", "Singleton: ES modules are natural singletons — module state is shared across imports", "Factory: create objects without exposing construction logic — extensible with a registry", "Observer: decouples event producers from consumers — always unsubscribe to avoid memory leaks", "Strategy: swap algorithms at runtime using functions or classes — eliminates conditionals", "Decorator: wrap functions to add cross-cutting concerns (memoize, throttle, debounce, log)", "Proxy: intercept object operations — powers Vue 3 reactivity, validation, and lazy loading"]
\`\`\`
`,
    },
  ],
};
