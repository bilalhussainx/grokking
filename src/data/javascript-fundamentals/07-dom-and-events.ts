import { Module } from "../types";

export const domAndEventsModule: Module = {
  id: "js-dom-events",
  title: "DOM & Events (Simulated)",
  description: "Learn DOM and event concepts through simulated implementations: event emitters, virtual DOM diffing, and state management.",
  lessons: [
    {
      id: "js-dom-events-intro",
      slug: "js-dom-events-intro",
      title: "Introduction to DOM & Events",
      content: `## DOM & Event Concepts

The **Document Object Model** (DOM) is a tree representation of an HTML document. JavaScript interacts with the DOM to create dynamic web pages. Since we cannot run a real browser here, we will build **simulated versions** of core DOM patterns.

### The Event Model

Browsers use an **event-driven** architecture:

1. **Event listeners** register callbacks for specific events
2. When an event fires, all registered listeners are called
3. Events can **propagate** (bubble up or capture down the tree)

\`\`\`js
element.addEventListener("click", handler);
element.removeEventListener("click", handler);
\`\`\`

### The Observer Pattern

The DOM event system is an implementation of the **Observer pattern** (also called Pub/Sub). An emitter maintains a list of subscribers and notifies them when events occur.

### Virtual DOM

Frameworks like React use a **virtual DOM** — a lightweight JavaScript tree that mirrors the real DOM. When state changes:

1. Build a new virtual tree
2. **Diff** the old and new trees to find changes
3. Apply only the minimal set of DOM mutations

### State Management

Modern apps separate **state** from **UI**. A state manager:

- Holds the current state
- Accepts actions that describe changes
- Notifies subscribers when state changes
- Enables time-travel debugging and predictable updates

In the following exercises, you will implement these patterns from scratch.`,
    },
    {
      id: "js-dom-events-emitter",
      slug: "event-emitter",
      title: "Event Emitter Class",
      content: `## Event Emitter Class

### Problem

Implement an \`EventEmitter\` class with:

- \`on(event, listener)\` — register a listener; return an unsubscribe function
- \`off(event, listener)\` — remove a specific listener
- \`emit(event, ...args)\` — call all listeners for the event with the given arguments
- \`once(event, listener)\` — register a listener that fires only once

### Examples

\`\`\`js
const emitter = new EventEmitter();
emitter.on("data", (msg) => console.log(msg));
emitter.emit("data", "hello"); // logs "hello"
\`\`\`

### Key Concepts

- Map of event names to arrays of listener functions
- \`once\` wraps a listener to auto-remove after first call
- Returning an unsubscribe function from \`on\` is a common modern pattern
- This is the foundation of Node.js EventEmitter`,
      starterCode: `// Event Emitter
// Implement the observer/pub-sub pattern

class EventEmitter {
  constructor() {
    // Initialize your listener storage
    // YOUR CODE HERE
  }

  on(event, listener) {
    // Register a listener for the event
    // Return an unsubscribe function
    // YOUR CODE HERE
  }

  off(event, listener) {
    // Remove a specific listener for the event
    // YOUR CODE HERE
  }

  emit(event, ...args) {
    // Call all listeners for the event with args
    // YOUR CODE HERE
  }

  once(event, listener) {
    // Register a listener that fires only once
    // YOUR CODE HERE
  }
}

// Test cases
const emitter = new EventEmitter();

// Test on and emit
const results = [];
emitter.on("greet", (name) => results.push(\`Hello \${name}\`));
emitter.on("greet", (name) => results.push(\`Hi \${name}\`));
emitter.emit("greet", "Alice");
console.log(results); // Expected: ["Hello Alice", "Hi Alice"]

// Test off
const logFn = (msg) => results.push(\`Log: \${msg}\`);
emitter.on("log", logFn);
emitter.emit("log", "test1");
emitter.off("log", logFn);
emitter.emit("log", "test2");
console.log(results.filter(r => r.startsWith("Log")));
// Expected: ["Log: test1"] (test2 should NOT appear)

// Test once
const onceResults = [];
emitter.once("init", () => onceResults.push("initialized"));
emitter.emit("init");
emitter.emit("init");
emitter.emit("init");
console.log(onceResults); // Expected: ["initialized"] (only once)

// Test unsubscribe function
const unsub = emitter.on("tick", () => results.push("tick"));
emitter.emit("tick");
unsub();
emitter.emit("tick");
console.log(results.filter(r => r === "tick").length);
// Expected: 1 (second emit should not fire)`,
      solutionCode: `// Event Emitter
// Implement the observer/pub-sub pattern

class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(listener);

    return () => this.off(event, listener);
  }

  off(event, listener) {
    if (!this.listeners.has(event)) return;
    const fns = this.listeners.get(event);
    const index = fns.indexOf(listener);
    if (index !== -1) {
      fns.splice(index, 1);
    }
  }

  emit(event, ...args) {
    if (!this.listeners.has(event)) return;
    const fns = [...this.listeners.get(event)];
    for (const fn of fns) {
      fn(...args);
    }
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

// Test cases
const emitter = new EventEmitter();

// Test on and emit
const results = [];
emitter.on("greet", (name) => results.push(\`Hello \${name}\`));
emitter.on("greet", (name) => results.push(\`Hi \${name}\`));
emitter.emit("greet", "Alice");
console.log(results); // Expected: ["Hello Alice", "Hi Alice"]

// Test off
const logFn = (msg) => results.push(\`Log: \${msg}\`);
emitter.on("log", logFn);
emitter.emit("log", "test1");
emitter.off("log", logFn);
emitter.emit("log", "test2");
console.log(results.filter(r => r.startsWith("Log")));
// Expected: ["Log: test1"] (test2 should NOT appear)

// Test once
const onceResults = [];
emitter.once("init", () => onceResults.push("initialized"));
emitter.emit("init");
emitter.emit("init");
emitter.emit("init");
console.log(onceResults); // Expected: ["initialized"] (only once)

// Test unsubscribe function
const unsub = emitter.on("tick", () => results.push("tick"));
emitter.emit("tick");
unsub();
emitter.emit("tick");
console.log(results.filter(r => r === "tick").length);
// Expected: 1 (second emit should not fire)`,
    },
    {
      id: "js-dom-events-vdom-diff",
      slug: "virtual-dom-diff",
      title: "Virtual DOM Diff",
      content: `## Virtual DOM Diff

### Problem

Implement a simplified virtual DOM diff algorithm. A virtual node is a plain object:

\`\`\`js
{ tag: "div", props: { id: "main" }, children: [...] }
\`\`\`

Write a \`diff(oldTree, newTree)\` function that returns an array of **patches** describing the changes:

- \`{ type: "CREATE", node }\` — new node added
- \`{ type: "REMOVE" }\` — node removed
- \`{ type: "REPLACE", node }\` — node replaced (different tag)
- \`{ type: "UPDATE", props, children }\` — same tag, but props or children changed

### Examples

\`\`\`js
diff(
  { tag: "div", props: {}, children: [] },
  { tag: "span", props: {}, children: [] }
) // [{ type: "REPLACE", node: {tag:"span",...} }]
\`\`\`

### Key Concepts

- Tree diffing is at the heart of React, Vue, and other frameworks
- Comparing nodes at the same position (no reordering)
- Recursive diffing of children
- This simplified version ignores keys and list reordering`,
      starterCode: `// Virtual DOM Diff
// Implement a simplified tree diffing algorithm

function h(tag, props = {}, ...children) {
  // Helper to create virtual nodes
  return { tag, props, children: children.flat() };
}

function diff(oldNode, newNode) {
  // Compare two virtual DOM trees and return patches
  //
  // Cases:
  // 1. newNode doesn't exist -> { type: "REMOVE" }
  // 2. oldNode doesn't exist -> { type: "CREATE", node: newNode }
  // 3. Different tags -> { type: "REPLACE", node: newNode }
  // 4. Same tag -> { type: "UPDATE", props: diffProps, children: diffChildren }
  //
  // YOUR CODE HERE
}

function diffProps(oldProps, newProps) {
  // Return an object with changed and removed props
  // Changed: keys in newProps with different values
  // Removed: keys in oldProps not in newProps (set to null)
  // YOUR CODE HERE
}

// Test cases
// Test 1: Create new node
const patch1 = diff(null, h("div", { id: "new" }));
console.log("Create:", JSON.stringify(patch1));
// Expected: {"type":"CREATE","node":{"tag":"div","props":{"id":"new"},"children":[]}}

// Test 2: Remove node
const patch2 = diff(h("div"), null);
console.log("Remove:", JSON.stringify(patch2));
// Expected: {"type":"REMOVE"}

// Test 3: Replace node (different tag)
const patch3 = diff(h("div"), h("span"));
console.log("Replace:", JSON.stringify(patch3));
// Expected: {"type":"REPLACE","node":{"tag":"span","props":{},"children":[]}}

// Test 4: Update props
const patch4 = diff(
  h("div", { class: "old", id: "keep" }),
  h("div", { class: "new", id: "keep" })
);
console.log("Update:", JSON.stringify(patch4));
// Expected type: "UPDATE" with props showing class changed

// Test 5: Children diff
const patch5 = diff(
  h("ul", {}, h("li", {}, "one"), h("li", {}, "two")),
  h("ul", {}, h("li", {}, "one"), h("li", {}, "TWO"), h("li", {}, "three"))
);
console.log("Children:", JSON.stringify(patch5));
// Expected: UPDATE with children patches`,
      solutionCode: `// Virtual DOM Diff
// Implement a simplified tree diffing algorithm

function h(tag, props = {}, ...children) {
  return { tag, props, children: children.flat() };
}

function diff(oldNode, newNode) {
  if (oldNode == null) {
    return { type: "CREATE", node: newNode };
  }

  if (newNode == null) {
    return { type: "REMOVE" };
  }

  if (typeof oldNode !== typeof newNode) {
    return { type: "REPLACE", node: newNode };
  }

  if (typeof oldNode === "string" || typeof oldNode === "number") {
    if (oldNode !== newNode) {
      return { type: "REPLACE", node: newNode };
    }
    return null;
  }

  if (oldNode.tag !== newNode.tag) {
    return { type: "REPLACE", node: newNode };
  }

  const propPatches = diffProps(oldNode.props, newNode.props);
  const childPatches = diffChildren(oldNode.children, newNode.children);

  if (Object.keys(propPatches).length === 0 && childPatches.length === 0) {
    return null;
  }

  return { type: "UPDATE", props: propPatches, children: childPatches };
}

function diffProps(oldProps, newProps) {
  const patches = {};

  for (const key of Object.keys(newProps)) {
    if (oldProps[key] !== newProps[key]) {
      patches[key] = newProps[key];
    }
  }

  for (const key of Object.keys(oldProps)) {
    if (!(key in newProps)) {
      patches[key] = null;
    }
  }

  return patches;
}

function diffChildren(oldChildren, newChildren) {
  const patches = [];
  const maxLen = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxLen; i++) {
    const patch = diff(oldChildren[i], newChildren[i]);
    if (patch) {
      patches.push({ index: i, ...patch });
    }
  }

  return patches;
}

// Test cases
// Test 1: Create new node
const patch1 = diff(null, h("div", { id: "new" }));
console.log("Create:", JSON.stringify(patch1));
// Expected: {"type":"CREATE","node":{"tag":"div","props":{"id":"new"},"children":[]}}

// Test 2: Remove node
const patch2 = diff(h("div"), null);
console.log("Remove:", JSON.stringify(patch2));
// Expected: {"type":"REMOVE"}

// Test 3: Replace node (different tag)
const patch3 = diff(h("div"), h("span"));
console.log("Replace:", JSON.stringify(patch3));
// Expected: {"type":"REPLACE","node":{"tag":"span","props":{},"children":[]}}

// Test 4: Update props
const patch4 = diff(
  h("div", { class: "old", id: "keep" }),
  h("div", { class: "new", id: "keep" })
);
console.log("Update:", JSON.stringify(patch4));
// Expected type: "UPDATE" with props showing class changed

// Test 5: Children diff
const patch5 = diff(
  h("ul", {}, h("li", {}, "one"), h("li", {}, "two")),
  h("ul", {}, h("li", {}, "one"), h("li", {}, "TWO"), h("li", {}, "three"))
);
console.log("Children:", JSON.stringify(patch5));
// Expected: UPDATE with children patches`,
    },
    {
      id: "js-dom-events-state-manager",
      slug: "state-manager",
      title: "State Manager",
      content: `## State Manager

### Problem

Implement a \`createStore\` function inspired by Redux:

- \`createStore(reducer, initialState)\` returns a store object
- \`store.getState()\` — returns the current state
- \`store.dispatch(action)\` — passes action to the reducer to compute new state
- \`store.subscribe(listener)\` — registers a listener called on every state change; returns an unsubscribe function

The **reducer** is a pure function: \`(state, action) => newState\`

### Examples

\`\`\`js
const store = createStore((state, action) => {
  if (action.type === "INCREMENT") return { count: state.count + 1 };
  return state;
}, { count: 0 });

store.dispatch({ type: "INCREMENT" });
store.getState(); // { count: 1 }
\`\`\`

### Key Concepts

- Unidirectional data flow: dispatch -> reducer -> new state -> notify
- Reducers must be **pure** (no side effects, no mutation)
- Subscribe/unsubscribe for reactive updates
- This is the core pattern behind Redux, Zustand, and similar libraries`,
      starterCode: `// State Manager
// Implement a Redux-like store

function createStore(reducer, initialState) {
  // Return an object with getState, dispatch, and subscribe methods
  //
  // getState() -> returns current state
  // dispatch(action) -> calls reducer(currentState, action), updates state, notifies listeners
  // subscribe(listener) -> registers listener, returns unsubscribe function
  //
  // YOUR CODE HERE
}

// Test cases
// Counter reducer
const counterReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "ADD":
      return { ...state, count: state.count + action.payload };
    default:
      return state;
  }
};

const store = createStore(counterReducer, { count: 0 });

// Test getState
console.log(store.getState()); // Expected: { count: 0 }

// Test dispatch
store.dispatch({ type: "INCREMENT" });
console.log(store.getState()); // Expected: { count: 1 }

store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
console.log(store.getState()); // Expected: { count: 3 }

store.dispatch({ type: "DECREMENT" });
console.log(store.getState()); // Expected: { count: 2 }

store.dispatch({ type: "ADD", payload: 10 });
console.log(store.getState()); // Expected: { count: 12 }

// Test subscribe
const log = [];
const unsub = store.subscribe(() => {
  log.push(store.getState().count);
});

store.dispatch({ type: "INCREMENT" }); // count: 13
store.dispatch({ type: "INCREMENT" }); // count: 14
unsub();
store.dispatch({ type: "INCREMENT" }); // count: 15 (listener removed)

console.log("Subscriber log:", log);
// Expected: [13, 14] (not 15, because unsubscribed)

console.log("Final state:", store.getState());
// Expected: { count: 15 }`,
      solutionCode: `// State Manager
// Implement a Redux-like store

function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();

  return {
    getState() {
      return state;
    },

    dispatch(action) {
      state = reducer(state, action);
      for (const listener of listeners) {
        listener();
      }
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

// Test cases
// Counter reducer
const counterReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "ADD":
      return { ...state, count: state.count + action.payload };
    default:
      return state;
  }
};

const store = createStore(counterReducer, { count: 0 });

// Test getState
console.log(store.getState()); // Expected: { count: 0 }

// Test dispatch
store.dispatch({ type: "INCREMENT" });
console.log(store.getState()); // Expected: { count: 1 }

store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT" });
console.log(store.getState()); // Expected: { count: 3 }

store.dispatch({ type: "DECREMENT" });
console.log(store.getState()); // Expected: { count: 2 }

store.dispatch({ type: "ADD", payload: 10 });
console.log(store.getState()); // Expected: { count: 12 }

// Test subscribe
const log = [];
const unsub = store.subscribe(() => {
  log.push(store.getState().count);
});

store.dispatch({ type: "INCREMENT" }); // count: 13
store.dispatch({ type: "INCREMENT" }); // count: 14
unsub();
store.dispatch({ type: "INCREMENT" }); // count: 15 (listener removed)

console.log("Subscriber log:", log);
// Expected: [13, 14] (not 15, because unsubscribed)

console.log("Final state:", store.getState());
// Expected: { count: 15 }`,
    },
  ],
};
