import { Module } from "../types";

export const hooksModule: Module = {
  id: "hooks",
  title: "Custom Hooks",
  description:
    "Master the custom hooks pattern by building reusable logic extractors: useLocalStorage, usePrevious, and useDebounce.",
  lessons: [
    {
      id: "hooks-intro",
      slug: "hooks-intro",
      title: "Introduction to Custom Hooks",
      content: `## Custom Hooks: Reusable Logic

Custom hooks are the primary way to **extract and share stateful logic** between components in React. A custom hook is just a function that uses other hooks.

### Why Custom Hooks?

Before hooks, sharing stateful logic required complex patterns like Higher-Order Components or Render Props. Custom hooks let you extract logic into a simple function:

\`\`\`
// Without custom hook — logic duplicated everywhere:
function UserProfile() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetchUser().then(setUser); }, []);
  // ...
}

function UserSettings() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetchUser().then(setUser); }, []);
  // ...
}

// With custom hook — logic shared:
function useUser() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetchUser().then(setUser); }, []);
  return user;
}

function UserProfile() {
  const user = useUser();  // clean!
}
\`\`\`

### The Rules of Hooks

1. **Only call hooks at the top level** — never inside loops, conditions, or nested functions
2. **Only call hooks from React functions** — components or other custom hooks
3. **Name must start with "use"** — this tells React it is a hook

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

### Examples

\`\`\`
const storage = createStorage();
const useLocalStorage = createUseLocalStorage(storage);

const [name, setName, removeName] = useLocalStorage("user_name", "Guest");
console.log(name); // "Guest"

setName("Alice");
console.log(storage.getItem("user_name")); // '"Alice"' (JSON string)
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

### Problem Statement

Implement a \`usePrevious\` hook that tracks the previous value of a variable across "renders." This is useful for comparing current and previous values to detect changes.

Create \`createUsePrevious()\` that returns a \`usePrevious(value)\` function. Each call to \`usePrevious\` with a new value should:
- Return the **previous** value (or \`undefined\` on the first call)
- Store the current value for the next call

Also implement \`useValueHistory(value, maxSize)\` that keeps a bounded history of all previous values.

### Examples

\`\`\`
const usePrevious = createUsePrevious();
console.log(usePrevious(1)); // undefined (first call)
console.log(usePrevious(2)); // 1
console.log(usePrevious(3)); // 2
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

### Problem Statement

Implement a debounce system that simulates React's \`useDebounce\` pattern. Since we cannot use real timers in this environment, we will simulate time-based debouncing with explicit tick/flush controls.

Create \`createDebouncer(delay)\` that returns:
- \`setValue(value)\` — sets a new pending value and resets the delay counter
- \`tick()\` — advances time by 1 unit; if enough ticks pass, the value is "committed"
- \`getValue()\` — returns the committed (debounced) value
- \`getPending()\` — returns the pending value (what was last set)
- \`flush()\` — immediately commits the pending value
- \`cancel()\` — cancels the pending update

Also create \`createThrottler(limit)\` that allows at most one update per \`limit\` ticks.

### Examples

\`\`\`
const debounced = createDebouncer(3);
debounced.setValue("a");
debounced.tick(); debounced.tick();
debounced.getValue(); // undefined (not yet committed)
debounced.tick();
debounced.getValue(); // "a" (3 ticks passed)
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
