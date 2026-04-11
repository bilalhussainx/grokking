import { Module } from "../types";

export const hooksModule: Module = {
  id: "hooks",
  title: "Custom Hooks",
  description: "Master the custom hooks pattern by building reusable logic extractors: useLocalStorage, usePrevious, and useDebounce.",
  lessons: [
    {
      id: "hooks-intro",
      slug: "hooks-intro",
      title: "Introduction to Custom Hooks",
      content: `## Custom Hooks: Reusable Logic

Custom hooks are the primary way to **extract and share stateful logic** between components in React. A custom hook is just a function that uses other hooks.

\`\`\`concept
{
  "title": "What is a Custom Hook?",
  "variant": "mental-model",
  "content": "Think of custom hooks as LEGO blocks for React logic. Each block encapsulates a specific behavior (data fetching, storage, timers) that you can snap into any component. They follow the same rules as built-in hooks but let you compose your own reusable behaviors."
}
\`\`\`

### Why Custom Hooks?

Before hooks, sharing stateful logic required complex patterns like Higher-Order Components or Render Props. Custom hooks let you extract logic into a simple function:

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Duplicated Logic",
    "code": "function UserProfile() {\\n  const [user, setUser] = useState(null);\\n  useEffect(() => { \\n    fetchUser().then(setUser); \\n  }, []);\\n  // ...\\n}\\n\\nfunction UserSettings() {\\n  const [user, setUser] = useState(null);\\n  useEffect(() => { \\n    fetchUser().then(setUser); \\n  }, []);\\n  // ...\\n}"
  },
  "after": {
    "label": "Custom Hook",
    "code": "function useUser() {\\n  const [user, setUser] = useState(null);\\n  useEffect(() => { \\n    fetchUser().then(setUser); \\n  }, []);\\n  return user;\\n}\\n\\nfunction UserProfile() {\\n  const user = useUser();  // clean!\\n}"
  }
}
\`\`\`

\`\`\`callout
{
  "type": "info",
  "title": "React 16.8.0 Release",
  "content": "Custom hooks were introduced in React 16.8.0 (February 2019), enabling functional components to use state and lifecycle features previously exclusive to class components."
}
\`\`\`

### The Rules of Hooks

1. **Only call hooks at the top level** — never inside loops, conditions, or nested functions
2. **Only call hooks from React functions** — components or other custom hooks
3. **Name must start with "use"** — this tells React it is a hook

\`\`\`quiz
{
  "title": "Hook Rules Check",
  "questions": [
    {
      "question": "Which of these is a valid custom hook name?",
      "options": ["getUserData", "fetchData", "useUserData", "userDataHook"],
      "answer": 2,
      "explanation": "Custom hooks must start with 'use' to indicate they are hooks and follow React's rules."
    },
    {
      "question": "Where can you call a hook?",
      "options": ["Inside a loop", "At the top level of a function", "Inside a conditional", "Inside a nested function"],
      "answer": 1,
      "explanation": "Hooks must be called at the top level of React functions to ensure they are called in the same order every time."
    },
    {
      "question": "What can custom hooks call?",
      "options": ["Only useState", "Only built-in hooks", "Other custom hooks", "Any JavaScript function"],
      "answer": 2,
      "explanation": "Custom hooks can call other built-in hooks and other custom hooks, but must follow the same rules."
    }
  ]
}
\`\`\`

### Common Custom Hook Patterns

| Hook | Purpose |
|------|---------|
| \`useLocalStorage\` | Persist state to localStorage |
| \`usePrevious\` | Track the previous value of a variable |
| \`useDebounce\` | Delay updates until user stops changing a value |
| \`useFetch\` | Fetch data with loading/error states |
| \`useMediaQuery\` | Respond to viewport changes |
| \`useOnClickOutside\` | Detect clicks outside an element |

### Anatomy of a Custom Hook

A custom hook:
1. Accepts configuration parameters
2. Uses built-in hooks internally (useState, useEffect, etc.)
3. Returns values and/or functions the consumer needs
4. Encapsulates complexity — the consumer does not need to know the internals

\`\`\`steps
{
  "title": "Building a Custom Hook",
  "steps": [
    {
      "title": "1. Identify Reusable Logic",
      "content": "Find patterns repeated across components, like data fetching, form handling, or localStorage operations."
    },
    {
      "title": "2. Extract into a Function",
      "content": "Create a function starting with 'use' that encapsulates this logic using built-in hooks."
    },
    {
      "title": "3. Return What Consumers Need",
      "content": "Return values, functions, or objects that components need to interact with the logic."
    },
    {
      "title": "4. Use in Components",
      "content": "Import and use the custom hook in any component that needs this behavior."
    }
  ]
}
\`\`\`

In these exercises, we will build custom hooks using our plain JavaScript hook simulator to understand the patterns without needing a browser environment.`,
    },
    {
      id: "hooks-local-storage",
      slug: "use-local-storage",
      title: "useLocalStorage Hook",
      content: `## useLocalStorage Hook

### Problem Statement

Implement a \`useLocalStorage\` hook simulator. Since we cannot use a real browser, we will simulate localStorage with a plain object.

Create:
1. \`createStorage()\` — returns a fake localStorage with \`getItem\`, \`setItem\`, \`removeItem\`
2. \`createUseLocalStorage(storage)\` — returns a \`useLocalStorage(key, initialValue)\` function

\`useLocalStorage(key, initialValue)\` should return \`[value, setValue, removeValue]\` where:
- \`value\` — the current stored value (parsed from JSON), or initialValue if nothing stored
- \`setValue(newValue)\` — updates both the in-memory value and the storage
- \`removeValue()\` — removes the key from storage and resets to initialValue

\`\`\`concept
{
  "title": "Why Custom Hooks?",
  "variant": "insight",
  "content": "Custom hooks like useLocalStorage encapsulate complex state logic that syncs React state with browser APIs. They let you reuse this logic across components without repeating the same useState/useEffect patterns."
}
\`\`\`

### Examples

\`\`\`
const storage = createStorage();
const useLocalStorage = createUseLocalStorage(storage);

const [name, setName, removeName] = useLocalStorage("user_name", "Guest");
console.log(name); // "Guest"

setName("Alice");
console.log(storage.getItem("user_name")); // '"Alice"' (JSON string)
\`\`\`

\`\`\`concept
{
  "title": "localStorage Serialization",
  "variant": "mental-model",
  "content": "localStorage only stores strings. When you store objects, arrays, or numbers, they must be JSON.stringify'd first. When reading, JSON.parse recovers the original type. This is why you see '\\"Alice\\"' (with quotes) in storage — it's the JSON representation of the string \\"Alice\\"."
}
\`\`\`

### Building the Hook Step-by-Step

\`\`\`steps
{
  "title": "Implementation Steps",
  "steps": [
    {
      "title": "Step 1: Create Fake Storage",
      "content": "Build a simple in-memory object that mimics localStorage's API with getItem, setItem, and removeItem methods. All values should be stored as strings."
    },
    {
      "title": "Step 2: Build the Hook Factory",
      "content": "createUseLocalStorage should return a React hook function. Inside, use useState to manage the current value and useEffect to sync changes to the storage object."
    },
    {
      "title": "Step 3: Handle JSON Serialization",
      "content": "When reading: try JSON.parse(storage.getItem(key)) || initialValue. When writing: storage.setItem(key, JSON.stringify(newValue))."
    },
    {
      "title": "Step 4: Provide Removal Method",
      "content": "The removeValue function should call storage.removeItem(key) and reset the React state to initialValue."
    }
  ]
}
\`\`\`

### Interactive Playground

\`\`\`playground
{
  "title": "Build Your useLocalStorage Hook",
  "language": "javascript",
  "code": "// Step 1: Create fake storage\\nfunction createStorage() {\\n  const store = {};\\n  return {\\n    getItem(key) {\\n      return store[key] || null;\\n    },\\n    setItem(key, value) {\\n      store[key] = String(value);\\n    },\\n    removeItem(key) {\\n      delete store[key];\\n    }\\n  };\\n}\\n\\n// Step 2: Build the hook factory\\nfunction createUseLocalStorage(storage) {\\n  return function useLocalStorage(key, initialValue) {\\n    // TODO: Implement the hook\\n    // - Read from storage on mount\\n    // - Provide setValue that updates both state and storage\\n    // - Provide removeValue that clears storage and resets state\\n    \\n    return [initialValue, () => {}, () => {}];\\n  };\\n}\\n\\n// Test your implementation\\nconst storage = createStorage();\\nconst useLocalStorage = createUseLocalStorage(storage);\\n\\n// This should work after you implement the hook:\\nconst [name, setName, removeName] = useLocalStorage(\\"user_name\\", \\"Guest\\");\\nconsole.log(\\"Initial:\\", name); // Should log \\"Guest\\"\\n\\nsetName(\\"Alice\\");\\nconsole.log(\\"After setName:\\", storage.getItem(\\"user_name\\")); // Should log '\\"Alice\\"'\\n\\nremoveName();\\nconsole.log(\\"After removeName:\\", storage.getItem(\\"user_name\\")); // Should log null",
  "runnable": true
}
\`\`\`

### Common Pitfalls

\`\`\`callout
{
  "type": "warning",
  "title": "JSON.parse Can Throw",
  "content": "If localStorage contains invalid JSON, JSON.parse will throw an error. Always wrap it in try-catch or use a safe parsing function that falls back to the initial value."
}
\`\`\`

\`\`\`callout
{
  "type": "danger",
  "title": "Never Store Sensitive Data",
  "content": "localStorage is vulnerable to XSS attacks. Never store passwords, tokens, or personal information here. Data is accessible to any script running on your domain."
}
\`\`\`

### Knowledge Check

\`\`\`quiz
{
  "title": "Understanding useLocalStorage",
  "questions": [
    {
      "question": "Why do we need JSON.stringify when storing data in localStorage?",
      "options": [
        "localStorage encrypts JSON strings automatically",
        "localStorage can only store string values",
        "JSON.stringify makes data smaller",
        "It's required by React hooks"
      ],
      "answer": 1,
      "explanation": "localStorage only accepts string values. JSON.stringify converts objects, arrays, and other types into strings that can be stored and later parsed back."
    },
    {
      "question": "What happens when you call removeValue() in useLocalStorage?",
      "options": [
        "Only clears the React state",
        "Only removes from localStorage",
        "Clears both React state and localStorage, then resets to initialValue",
        "Reloads the page"
      ],
      "answer": 2,
      "explanation": "removeValue should synchronize both the React state and the storage by clearing the storage key and resetting the state to the initial value."
    },
    {
      "question": "Why might you wrap JSON.parse in a try-catch block?",
      "options": [
        "To improve performance",
        "To handle malformed JSON in localStorage",
        "To prevent memory leaks",
        "It's not necessary"
      ],
      "answer": 1,
      "explanation": "If localStorage contains invalid JSON (corrupted data or manual edits), JSON.parse will throw. A try-catch lets you gracefully fall back to the initial value."
    }
  ]
}
\`\`\`

### Complete Solution

\`\`\`collapse
{
  "title": "Full Implementation",
  "content": "\`\`\`javascript\\nfunction createStorage() {\\n  const store = {};\\n  return {\\n    getItem(key) {\\n      return store[key] || null;\\n    },\\n    setItem(key, value) {\\n      store[key] = String(value);\\n    },\\n    removeItem(key) {\\n      delete store[key];\\n    }\\n  };\\n}\\n\\nfunction createUseLocalStorage(storage) {\\n  return function useLocalStorage(key, initialValue) {\\n    const [value, setValue] = React.useState(() => {\\n      try {\\n        const item = storage.getItem(key);\\n        return item ? JSON.parse(item) : initialValue;\\n      } catch (error) {\\n        return initialValue;\\n      }\\n    });\\n\\n    const setStoredValue = (newValue) => {\\n      setValue(newValue);\\n      storage.setItem(key, JSON.stringify(newValue));\\n    };\\n\\n    const removeValue = () => {\\n      storage.removeItem(key);\\n      setValue(initialValue);\\n    };\\n\\n    return [value, setStoredValue, removeValue];\\n  };\\n}\\n\`\`\`"
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Custom hooks encapsulate complex state logic for reuse across components",
    "localStorage requires JSON serialization for non-string data types",
    "Always handle JSON.parse errors gracefully with try-catch",
    "Synchronize both React state and storage to maintain consistency",
    "Never store sensitive data in localStorage due to XSS vulnerabilities"
  ]
}
\`\`\``,
      starterCode: `function createStorage() {
  // TODO: create a fake localStorage with:
  // - getItem(key) -> string | null
  // - setItem(key, value)
  // - removeItem(key)
  // - _dump() -> returns the internal store object (for testing)
}

function createUseLocalStorage(storage) {
  // TODO: return a useLocalStorage(key, initialValue) function
  // that returns [value, setValue, removeValue]
  // - Reads from storage on creation (JSON.parse)
  // - setValue updates both local and storage (JSON.stringify)
  // - removeValue clears from storage and resets to initialValue
}

// Test cases
const storage = createStorage();
const useLocalStorage = createUseLocalStorage(storage);

// Test 1: Initial value when storage is empty
const [name, setName, removeName] = useLocalStorage("user_name", "Guest");
console.log(name);
// Expected: "Guest"

// Test 2: Setting a value persists to storage
setName("Alice");
const [name2] = useLocalStorage("user_name", "Guest");
console.log(name2);
// Expected: "Alice"
console.log(storage.getItem("user_name"));
// Expected: '"Alice"'

// Test 3: Works with objects
const [settings, setSettings, removeSettings] = useLocalStorage("settings", { theme: "light", fontSize: 14 });
console.log(settings);
// Expected: { theme: "light", fontSize: 14 }

setSettings({ theme: "dark", fontSize: 16 });
const [settings2] = useLocalStorage("settings", {});
console.log(settings2);
// Expected: { theme: "dark", fontSize: 16 }

// Test 4: Remove resets to initial value
removeName();
const [name3] = useLocalStorage("user_name", "Guest");
console.log(name3);
// Expected: "Guest"
console.log(storage.getItem("user_name"));
// Expected: null

// Test 5: Works with arrays
const [todos, setTodos] = useLocalStorage("todos", []);
setTodos(["Learn React", "Build App"]);
const [todos2] = useLocalStorage("todos", []);
console.log(todos2);
// Expected: ["Learn React", "Build App"]
`,
      solutionCode: `function createStorage() {
  const store = {};
  return {
    getItem(key) {
      return key in store ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    _dump() {
      return { ...store };
    },
  };
}

function createUseLocalStorage(storage) {
  return function useLocalStorage(key, initialValue) {
    const stored = storage.getItem(key);
    let value = stored !== null ? JSON.parse(stored) : initialValue;

    function setValue(newValue) {
      value = newValue;
      storage.setItem(key, JSON.stringify(newValue));
    }

    function removeValue() {
      value = initialValue;
      storage.removeItem(key);
    }

    return [value, setValue, removeValue];
  };
}

// Test cases
const storage = createStorage();
const useLocalStorage = createUseLocalStorage(storage);

// Test 1: Initial value when storage is empty
const [name, setName, removeName] = useLocalStorage("user_name", "Guest");
console.log(name);
// Expected: "Guest"

// Test 2: Setting a value persists to storage
setName("Alice");
const [name2] = useLocalStorage("user_name", "Guest");
console.log(name2);
// Expected: "Alice"
console.log(storage.getItem("user_name"));
// Expected: '"Alice"'

// Test 3: Works with objects
const [settings, setSettings, removeSettings] = useLocalStorage("settings", { theme: "light", fontSize: 14 });
console.log(settings);
// Expected: { theme: "light", fontSize: 14 }

setSettings({ theme: "dark", fontSize: 16 });
const [settings2] = useLocalStorage("settings", {});
console.log(settings2);
// Expected: { theme: "dark", fontSize: 16 }

// Test 4: Remove resets to initial value
removeName();
const [name3] = useLocalStorage("user_name", "Guest");
console.log(name3);
// Expected: "Guest"
console.log(storage.getItem("user_name"));
// Expected: null

// Test 5: Works with arrays
const [todos, setTodos] = useLocalStorage("todos", []);
setTodos(["Learn React", "Build App"]);
const [todos2] = useLocalStorage("todos", []);
console.log(todos2);
// Expected: ["Learn React", "Build App"]
`,
    },
    {
      id: "hooks-use-previous",
      slug: "use-previous",
      title: "usePrevious Hook",
      content: `## usePrevious Hook

\`\`\`concept
{
  "title": "What is usePrevious?",
  "variant": "mental-model",
  "content": "usePrevious is a custom React hook that acts like a time machine for values. It remembers what a variable was in the *last* render, letting you compare 'then' vs. 'now' without any extra state management."
}
\`\`\`

### Problem Statement

Implement a \`usePrevious\` hook that tracks the previous value of a variable across "renders." This is useful for comparing current and previous values to detect changes.

Create \`createUsePrevious()\` that returns a \`usePrevious(value)\` function. Each call to \`usePrevious\` with a new value should:
- Return the **previous** value (or \`undefined\` on the first call)
- Store the current value for the next call

Also implement \`useValueHistory(value, maxSize)\` that keeps a bounded history of all previous values.

### How It Works Under the Hood

\`\`\`trace
{
  "title": "Step-by-step: usePrevious in action",
  "language": "javascript",
  "code": "function usePrevious(value) {\\n  const ref = useRef();\\n  useEffect(() => {\\n    ref.current = value;  // store AFTER render\\n  }, [value]);\\n  return ref.current;     // read from LAST render\\n}\\n\\nfunction Counter() {\\n  const [count, setCount] = useState(0);\\n  const prev = usePrevious(count);\\n  return (\\n    <div>\\n      <p>Now: {count}, was: {prev}</p>\\n      <button onClick={() => setCount(c => c + 1)}>+</button>\\n    </div>\\n  );\\n}",
  "frames": [
    { "line": 8, "vars": { "count": 0, "prev": "undefined" }, "note": "Initial render: ref.current is undefined" },
    { "line": 3, "vars": { "ref.current": 0 }, "note": "Effect runs after paint, updating ref" },
    { "line": 9, "vars": { "count": 1, "prev": 0 }, "note": "Next render: ref.current now holds 0" },
    { "line": 3, "vars": { "ref.current": 1 }, "note": "Effect updates ref again" }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Common Gotcha",
  "content": "usePrevious gives you the value from the *last committed render*, not necessarily the value right before the most recent state change. If the component re-renders for other reasons, the previous value stays the same."
}
\`\`\`

### Examples

\`\`\`playground
{
  "title": "Try usePrevious live",
  "language": "javascript",
  "code": "import { useState, useEffect, useRef } from 'react';\\n\\nfunction usePrevious(val) {\\n  const ref = useRef();\\n  useEffect(() => {\\n    ref.current = val;\\n  }, [val]);\\n  return ref.current;\\n}\\n\\nfunction App() {\\n  const [n, setN] = useState(1);\\n  const prev = usePrevious(n);\\n  return (\\n    <div>\\n      <h3>Previous: {prev ?? 'undefined'}</h3>\\n      <h3>Current: {n}</h3>\\n      <button onClick={() => setN(n + 1)}>Increment</button>\\n    </div>\\n  );\\n}\\n\\n// export default App;",
  "runnable": true
}
\`\`\`

### Building the Factory

\`\`\`steps
{
  "title": "Creating createUsePrevious",
  "steps": [
    {
      "title": "Step 1: Encapsulate the ref",
      "content": "Wrap \`useRef\` inside a factory so each returned hook gets its own isolated ref. This lets multiple components keep independent previous values."
    },
    {
      "title": "Step 2: Return a bound hook",
      "content": "The factory returns a function that already has the ref closed over. Callers just invoke \`usePrevious(value)\`—no extra setup."
    },
    {
      "title": "Step 3: Handle first-call edge",
      "content": "On the very first call the ref is empty; return \`undefined\` explicitly to signal ‘no previous value’."
    }
  ]
}
\`\`\`

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Inline version (re-create ref every time)",
    "code": "function MyComponent({ value }) {\\n  const prevRef = useRef();          // ❌ new ref each render\\n  useEffect(() => {\\n    prevRef.current = value;\\n  }, [value]);\\n  const prev = prevRef.current;\\n  // ...\\n}"
  },
  "after": {
    "label": "Factory version (re-usable across components)",
    "code": "const usePrevious = createUsePrevious();\\n\\nfunction MyComponent({ value }) {\\n  const prev = usePrevious(value);   // ✅ same ref reused\\n  // ...\\n}"
  }
}
\`\`\`

### Extending to History

\`\`\`playground
{
  "title": "Bounded history: useValueHistory",
  "language": "javascript",
  "code": "function useValueHistory(value, maxSize = 5) {\\n  const [history, setHistory] = useState([]);\\n  useEffect(() => {\\n    setHistory(prev => [value, ...prev].slice(0, maxSize));\\n  }, [value, maxSize]);\\n  return history;\\n}\\n\\n// Usage:\\n// const history = useValueHistory(count, 3);\\n// history -> [3, 2, 1] (newest first)",
  "runnable": false
}
\`\`\`

\`\`\`quiz
{
  "title": "Check your understanding",
  "questions": [
    {
      "question": "Why do we use useEffect instead of updating the ref directly during render?",
      "options": [
        "To avoid stale closures",
        "To ensure the previous value is from the last committed render",
        "Because refs are read-only in render phase",
        "To trigger re-renders when the value changes"
      ],
      "answer": 1,
      "explanation": "Updating inside useEffect guarantees we capture the value *after* React has committed the current render to the DOM, giving us the true 'previous' value on the next cycle."
    },
    {
      "question": "What will \`usePrevious(42)\` return on its very first call?",
      "options": ["42", "null", "undefined", "0"],
      "answer": 2,
      "explanation": "The ref starts empty, so we explicitly return \`undefined\` to signal that there is no previous value yet."
    },
    {
      "question": "Which React built-ins does the canonical usePrevious rely on?",
      "options": ["useState + useMemo", "useRef + useEffect", "useReducer + useLayoutEffect", "useContext + useRef"],
      "answer": 1,
      "explanation": "useRef holds the value across renders, and useEffect updates it after the render commits."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "usePrevious is a custom hook, not part of React core.",
    "It leverages useRef + useEffect to remember the last render’s value.",
    "Always returns the value from the previous *committed* render cycle.",
    "Encapsulate inside a factory (createUsePrevious) for clean reuse.",
    "Extend the pattern to bounded histories with useValueHistory."
  ]
}
\`\`\``,
      starterCode: `function createUsePrevious() {
  // TODO: return a function usePrevious(value) that:
  // - Returns the previous value (undefined on first call)
  // - Stores the current value for the next call
}

function createUseValueHistory(maxSize = 10) {
  // TODO: return a function useValueHistory(value) that:
  // - Adds the value to a history array
  // - Keeps only the last maxSize values
  // - Returns { current, previous, history }
}

// Test cases — usePrevious
const usePrevious = createUsePrevious();

console.log(usePrevious(1));
// Expected: undefined

console.log(usePrevious(2));
// Expected: 1

console.log(usePrevious(3));
// Expected: 2

console.log(usePrevious(3));
// Expected: 3

console.log(usePrevious(10));
// Expected: 3

// Test cases — useValueHistory
const useHistory = createUseValueHistory(3);

console.log(useHistory("a"));
// Expected: { current: "a", previous: undefined, history: ["a"] }

console.log(useHistory("b"));
// Expected: { current: "b", previous: "a", history: ["a", "b"] }

console.log(useHistory("c"));
// Expected: { current: "c", previous: "b", history: ["a", "b", "c"] }

console.log(useHistory("d"));
// Expected: { current: "d", previous: "c", history: ["b", "c", "d"] }
// Note: "a" was dropped because maxSize is 3

// Test with numbers
const useNumHistory = createUseValueHistory(5);
[10, 20, 30, 40, 50, 60].forEach(n => {
  const result = useNumHistory(n);
  console.log(\`Added \${n}: history = [\${result.history}], prev = \${result.previous}\`);
});
// Last output expected: "Added 60: history = [20,30,40,50,60], prev = 50"
`,
      solutionCode: `function createUsePrevious() {
  let previousValue = undefined;

  return function usePrevious(value) {
    const prev = previousValue;
    previousValue = value;
    return prev;
  };
}

function createUseValueHistory(maxSize = 10) {
  const history = [];

  return function useValueHistory(value) {
    const previous = history.length > 0 ? history[history.length - 1] : undefined;
    history.push(value);

    if (history.length > maxSize) {
      history.shift();
    }

    return {
      current: value,
      previous,
      history: [...history],
    };
  };
}

// Test cases — usePrevious
const usePrevious = createUsePrevious();

console.log(usePrevious(1));
// Expected: undefined

console.log(usePrevious(2));
// Expected: 1

console.log(usePrevious(3));
// Expected: 2

console.log(usePrevious(3));
// Expected: 3

console.log(usePrevious(10));
// Expected: 3

// Test cases — useValueHistory
const useHistory = createUseValueHistory(3);

console.log(useHistory("a"));
// Expected: { current: "a", previous: undefined, history: ["a"] }

console.log(useHistory("b"));
// Expected: { current: "b", previous: "a", history: ["a", "b"] }

console.log(useHistory("c"));
// Expected: { current: "c", previous: "b", history: ["a", "b", "c"] }

console.log(useHistory("d"));
// Expected: { current: "d", previous: "c", history: ["b", "c", "d"] }

// Test with numbers
const useNumHistory = createUseValueHistory(5);
[10, 20, 30, 40, 50, 60].forEach(n => {
  const result = useNumHistory(n);
  console.log(\`Added \${n}: history = [\${result.history}], prev = \${result.previous}\`);
});
// Last output expected: "Added 60: history = [20,30,40,50,60], prev = 50"
`,
    },
    {
      id: "hooks-use-debounce",
      slug: "use-debounce",
      title: "useDebounce Hook",
      content: `## useDebounce Hook

### Why Debouncing Matters

Ever typed into a search box and watched it fire off a request for *every single keystroke*? That’s expensive—for your server, your bandwidth, and your user’s battery. Debouncing is the pattern that says: “Wait until the user stops typing, then act.”

\`\`\`concept
{
  "title": "Debouncing vs Throttling",
  "variant": "mental-model",
  "content": "Think of debouncing as resetting a countdown timer every time something happens—only when the timer reaches zero does the action run. Throttling, on the other hand, is like a turnstile: once someone passes, no one else can pass for a fixed interval, no matter how many arrive."
}
\`\`\`

### Building a Manual Debouncer

Because we can’t use real \`setTimeout\` in this environment, we’ll simulate time with explicit “ticks.” The API you build here mirrors the mental model you’ll later translate into a real React hook.

\`\`\`playground
{
  "title": "createDebouncer",
  "language": "javascript",
  "code": "function createDebouncer(delayTicks) {\\n  let pending = undefined;\\n  let committed = undefined;\\n  let ticksUntilCommit = delayTicks;\\n\\n  return {\\n    setValue(v) {\\n      pending = v;\\n      ticksUntilCommit = delayTicks; // reset countdown\\n    },\\n    tick() {\\n      if (pending === undefined) return; // nothing waiting\\n      ticksUntilCommit -= 1;\\n      if (ticksUntilCommit <= 0) {\\n        committed = pending;\\n        pending = undefined;\\n      }\\n    },\\n    getValue() { return committed; },\\n    getPending() { return pending; },\\n    flush() {\\n      committed = pending;\\n      pending = undefined;\\n    },\\n    cancel() { pending = undefined; }\\n  };\\n}\\n\\n// quick sanity check\\nconst d = createDebouncer(2);\\nd.setValue('A');\\nd.tick(); d.tick();\\nconsole.log('committed:', d.getValue()); // 'A'\\nconsole.log('pending:', d.getPending());  // undefined",
  "runnable": true
}
\`\`\`

### Visualizing the Countdown

Each \`tick()\` decrements an internal counter. When it hits zero, the pending value graduates to “committed.”

\`\`\`algoviz
{
  "title": "Debouncer Lifecycle",
  "type": "array",
  "data": ["pending: 'h'", "ticksLeft: 3", "committed: null"],
  "frames": [
    { "highlight": [0,1], "label": "setValue('h') resets countdown to 3" },
    { "highlight": [1], "label": "tick() → ticksLeft = 2" },
    { "highlight": [1], "label": "tick() → ticksLeft = 1" },
    { "highlight": [2], "label": "tick() → ticksLeft = 0, value committed" }
  ],
  "speed": 1000
}
\`\`\`

### Throttling: A Close Cousin

While debouncing waits for silence, throttling enforces a maximum rate—useful for scroll or resize events.

\`\`\`playground
{
  "title": "createThrottler",
  "language": "javascript",
  "code": "function createThrottler(limitTicks) {\\n  let lastCommitTick = -Infinity;\\n  let committed = undefined;\\n  let currentTick = 0;\\n\\n  return {\\n    setValue(v, now = currentTick) {\\n      if (now - lastCommitTick >= limitTicks) {\\n        committed = v;\\n        lastCommitTick = now;\\n      }\\n    },\\n    tick() { currentTick += 1; },\\n    getValue() { return committed; }\\n  };\\n}\\n\\nconst t = createThrottler(3);\\nt.setValue('x', 0); // commits immediately\\nconsole.log(t.getValue()); // 'x'\\nt.tick(); t.tick(); t.tick(); // advance to tick 3\\nt.setValue('y', 3); // 3-0 >= 3 → commits\\nconsole.log(t.getValue()); // 'y'\\nt.setValue('z', 4); // 4-3 < 3 → rejected\\nconsole.log(t.getValue()); // still 'y'",
  "runnable": true
}
\`\`\`

### Quiz: Countdown Logic

\`\`\`quiz
{
  "title": "Debouncer Internals",
  "questions": [
    {
      "question": "After calling \`setValue('x')\`, what is the first thing that happens inside the debouncer?",
      "options": [
        "The value is immediately committed",
        "The internal countdown is reset to the original delay",
        "The pending value is cleared",
        "The flush function is invoked"
      ],
      "answer": 1,
      "explanation": "Setting a new value always resets the countdown so the debounce period starts fresh."
    },
    {
      "question": "If delay is 5 ticks and you call \`tick()\` 4 times, what does \`getValue()\` return?",
      "options": [
        "The pending value",
        "The previously committed value",
        "undefined",
        "null"
      ],
      "answer": 2,
      "explanation": "Only 4 of 5 required ticks have elapsed, so nothing is committed yet; \`getValue()\` still holds the old (or initial undefined) value."
    },
    {
      "question": "Which method immediately moves the pending value to committed without waiting?",
      "options": [
        "cancel()",
        "tick()",
        "flush()",
        "setValue()"
      ],
      "answer": 2,
      "explanation": "\`flush()\` bypasses the countdown and commits the pending value right away."
    }
  ]
}
\`\`\`

### From Manual to React: The Real useDebounce

Once you’re comfortable with the tick-based model, swapping in \`setTimeout\`/\`clearTimeout\` is straightforward. The mental model—reset a timer on every change—remains identical.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Manual tick version",
    "code": "debounced.setValue(input);\\ndebounced.tick(); // repeat..."
  },
  "after": {
    "label": "React hook version",
    "code": "const debounced = useDebounce(input, 300);\\n// automatic, no tick calls needed"
  }
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Debouncing postpones an action until a period of inactivity passes, saving expensive work like API calls.",
    "A manual tick-based model teaches the countdown/reset mechanism without timers.",
    "Throttling is rate-limiting (one action per window), whereas debouncing is silence-detection.",
    "In React, the same logic maps cleanly to setTimeout/clearTimeout inside useEffect with proper cleanup."
  ]
}
\`\`\``,
      starterCode: `function createDebouncer(delay) {
  // TODO: implement debounce logic
  // - setValue(value): sets pending value, resets tick counter
  // - tick(): advances time by 1; commits value if counter reaches delay
  // - getValue(): returns the committed value
  // - getPending(): returns the pending (uncommitted) value
  // - flush(): immediately commits pending value
  // - cancel(): discards the pending value
}

function createThrottler(limit) {
  // TODO: implement throttle logic
  // - setValue(value): sets value only if enough ticks have passed since last set
  //   returns true if accepted, false if throttled
  // - tick(): advances time by 1
  // - getValue(): returns the current value
}

// Test debouncer
const search = createDebouncer(3);

search.setValue("r");
search.tick();
console.log(search.getValue());
// Expected: undefined (only 1 tick, need 3)

search.setValue("re");  // resets counter
search.tick();
search.tick();
console.log(search.getValue());
// Expected: undefined (counter was reset, only 2 ticks since "re")

search.tick();
console.log(search.getValue());
// Expected: "re" (3 ticks since last setValue)

search.setValue("rea");
search.setValue("reac");
search.setValue("react");  // each setValue resets the counter
search.tick();
search.tick();
search.tick();
console.log(search.getValue());
// Expected: "react"

// Test flush
search.setValue("react hooks");
console.log(search.getValue());
// Expected: "react" (not yet committed)
search.flush();
console.log(search.getValue());
// Expected: "react hooks" (flush committed immediately)

// Test cancel
search.setValue("cancelled value");
search.cancel();
search.tick(); search.tick(); search.tick();
console.log(search.getValue());
// Expected: "react hooks" (cancelled value was discarded)

// Test throttler
const throttled = createThrottler(3);

console.log(throttled.setValue("a"));
// Expected: true (first value always accepted)

console.log(throttled.setValue("b"));
// Expected: false (throttled — 0 ticks since last accept)

throttled.tick();
throttled.tick();
console.log(throttled.setValue("c"));
// Expected: false (only 2 ticks, need 3)

throttled.tick();
console.log(throttled.setValue("d"));
// Expected: true (3 ticks passed)

console.log(throttled.getValue());
// Expected: "d"
`,
      solutionCode: `function createDebouncer(delay) {
  let committedValue = undefined;
  let pendingValue = undefined;
  let tickCount = 0;
  let hasPending = false;

  return {
    setValue(value) {
      pendingValue = value;
      tickCount = 0;
      hasPending = true;
    },
    tick() {
      if (hasPending) {
        tickCount++;
        if (tickCount >= delay) {
          committedValue = pendingValue;
          hasPending = false;
          tickCount = 0;
        }
      }
    },
    getValue() {
      return committedValue;
    },
    getPending() {
      return pendingValue;
    },
    flush() {
      if (hasPending) {
        committedValue = pendingValue;
        hasPending = false;
        tickCount = 0;
      }
    },
    cancel() {
      hasPending = false;
      tickCount = 0;
      pendingValue = undefined;
    },
  };
}

function createThrottler(limit) {
  let currentValue = undefined;
  let ticksSinceLastAccept = limit; // start ready to accept

  return {
    setValue(value) {
      if (ticksSinceLastAccept >= limit) {
        currentValue = value;
        ticksSinceLastAccept = 0;
        return true;
      }
      return false;
    },
    tick() {
      ticksSinceLastAccept++;
    },
    getValue() {
      return currentValue;
    },
  };
}

// Test debouncer
const search = createDebouncer(3);

search.setValue("r");
search.tick();
console.log(search.getValue());
// Expected: undefined (only 1 tick, need 3)

search.setValue("re");  // resets counter
search.tick();
search.tick();
console.log(search.getValue());
// Expected: undefined (counter was reset, only 2 ticks since "re")

search.tick();
console.log(search.getValue());
// Expected: "re" (3 ticks since last setValue)

search.setValue("rea");
search.setValue("reac");
search.setValue("react");  // each setValue resets the counter
search.tick();
search.tick();
search.tick();
console.log(search.getValue());
// Expected: "react"

// Test flush
search.setValue("react hooks");
console.log(search.getValue());
// Expected: "react" (not yet committed)
search.flush();
console.log(search.getValue());
// Expected: "react hooks" (flush committed immediately)

// Test cancel
search.setValue("cancelled value");
search.cancel();
search.tick(); search.tick(); search.tick();
console.log(search.getValue());
// Expected: "react hooks" (cancelled value was discarded)

// Test throttler
const throttled = createThrottler(3);

console.log(throttled.setValue("a"));
// Expected: true (first value always accepted)

console.log(throttled.setValue("b"));
// Expected: false (throttled — 0 ticks since last accept)

throttled.tick();
throttled.tick();
console.log(throttled.setValue("c"));
// Expected: false (only 2 ticks, need 3)

throttled.tick();
console.log(throttled.setValue("d"));
// Expected: true (3 ticks passed)

console.log(throttled.getValue());
// Expected: "d"
`,
    },
  ],
};
