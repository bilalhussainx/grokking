import { Module } from "../types";

export const effectsModule: Module = {
  id: "effects",
  title: "useEffect & Side Effects",
  description: "Understand side effects in React by building effect systems, cleanup handlers, and dependency tracking from scratch.",
  lessons: [
    {
      id: "effects-intro",
      slug: "effects-intro",
      title: "Introduction to Side Effects",
      content: `## Side Effects in React

In React, a **side effect** is any operation that reaches outside the component's render cycle — fetching data, setting up subscriptions, manually changing the DOM, or writing to localStorage.

### Pure Rendering vs Side Effects

| Pure Rendering | Side Effects |
|----------------|-------------|
| Computing JSX from props/state | Fetching data from an API |
| Filtering or transforming data | Setting up event listeners |
| Calculating derived values | Writing to localStorage |
| Always produces same output | Interacts with the outside world |

### The useEffect Mental Model

\`useEffect\` tells React: "After you finish rendering, run this function." It runs **after** the paint, not during rendering.

\`\`\`
useEffect(() => {
  // This runs AFTER render
  document.title = \`You clicked \${count} times\`;
}, [count]); // Only re-run when count changes
\`\`\`

### The Dependency Array

The second argument to \`useEffect\` controls when the effect re-runs:

| Dependency Array | Behavior |
|-----------------|----------|
| Not provided | Runs after every render |
| \`[]\` (empty) | Runs only once after mount |
| \`[a, b]\` | Runs when a or b changes |

### Cleanup Functions

Effects can return a **cleanup function** that React calls before re-running the effect or when the component unmounts:

\`\`\`
useEffect(() => {
  const handler = () => console.log("clicked");
  window.addEventListener("click", handler);
  return () => window.removeEventListener("click", handler); // cleanup
}, []);
\`\`\`

### The Effect Lifecycle

\`\`\`
Component Mounts
  └─> Effect runs (setup)
        └─> Dependencies change
              └─> Cleanup runs (previous effect)
                    └─> Effect runs again (new setup)
                          └─> Component Unmounts
                                └─> Cleanup runs (final)
\`\`\`

### Common Pitfalls

1. **Missing dependencies** — leads to stale closures
2. **Infinite loops** — effect updates state that triggers itself
3. **Race conditions** — async effects that resolve out of order
4. **Missing cleanup** — memory leaks from subscriptions

In these exercises, you will build effect systems from scratch to deeply understand these patterns.`,
    },
    {
      id: "effects-scheduler",
      slug: "effect-scheduler",
      title: "Effect Scheduler",
      content: `## Effect Scheduler

### Problem Statement

Implement a \`createEffectSystem()\` that simulates React's \`useEffect\` with dependency tracking and cleanup.

The system should provide:
- \`useEffect(setup, deps)\` — registers an effect with optional dependencies
- \`runEffects()\` — executes all pending effects (those whose deps have changed)
- \`unmount()\` — runs all cleanup functions

The \`setup\` function can return a cleanup function. On re-run, the cleanup from the previous run should execute before the new setup runs.

### Key Behaviors

- An effect with \`[]\` deps runs only on the first \`runEffects()\` call
- An effect with \`[a, b]\` deps re-runs only when \`a\` or \`b\` changes
- An effect with no deps array runs every time \`runEffects()\` is called
- Cleanup functions run before re-running and on \`unmount()\`

\`\`\`concept
{
  "title": "React's Effect Scheduler",
  "variant": "mental-model",
  "content": "Think of React's effect scheduler as a smart assistant that:\\n\\n1. **Remembers** what your effect depends on (dependency array)\\n2. **Watches** for changes in those dependencies\\n3. **Cleans up** the previous effect before running the new one\\n4. **Executes** effects asynchronously after the browser paints\\n\\nThis ensures your side effects don't block the UI and always stay in sync with your component's state."
}
\`\`\`

### Understanding Dependency Arrays

\`\`\`tabs
{
  "tabs": [
    {
      "label": "No Dependencies",
      "content": "**Runs after every render**\\n\\n\`\`\`javascript\\nuseEffect(() => {\\n  console.log('This runs after every render');\\n});\\n\`\`\`\\n\\nLike having no memory - the effect always fires regardless of what changed."
    },
    {
      "label": "Empty Array []",
      "content": "**Runs only once (mount)**\\n\\n\`\`\`javascript\\nuseEffect(() => {\\n  console.log('This runs only once');\\n}, []);\\n\`\`\`\\n\\nLike saying \\"I don't depend on anything\\" - the effect runs once and never again."
    },
    {
      "label": "With Dependencies",
      "content": "**Runs when dependencies change**\\n\\n\`\`\`javascript\\nuseEffect(() => {\\n  console.log('User ID changed:', userId);\\n}, [userId]);\\n\`\`\`\\n\\nLike having a watchlist - the effect only fires when something it's watching changes."
    }
  ]
}
\`\`\`

### Implementation Strategy

\`\`\`steps
{
  "title": "Building the Effect System",
  "steps": [
    {
      "title": "1. Store Effects with Metadata",
      "content": "Each effect needs:\\n- The setup function\\n- Current dependencies\\n- Previous dependencies (for comparison)\\n- Cleanup function (if returned by setup)\\n\\n\`\`\`javascript\\nconst effects = [];\\n\\nfunction useEffect(setup, deps) {\\n  effects.push({\\n    setup,\\n    deps,\\n    prevDeps: undefined,\\n    cleanup: undefined\\n  });\\n}\\n\`\`\`"
    },
    {
      "title": "2. Compare Dependencies",
      "content": "Check if dependencies changed using shallow comparison:\\n\\n\`\`\`javascript\\nfunction depsChanged(prevDeps, nextDeps) {\\n  if (!prevDeps || !nextDeps) return true;\\n  if (prevDeps.length !== nextDeps.length) return true;\\n  \\n  for (let i = 0; i < prevDeps.length; i++) {\\n    if (prevDeps[i] !== nextDeps[i]) return true;\\n  }\\n  return false;\\n}\\n\`\`\`"
    },
    {
      "title": "3. Execute Effects with Cleanup",
      "content": "Run cleanup before setup, then store new cleanup:\\n\\n\`\`\`javascript\\nfunction runEffects() {\\n  effects.forEach(effect => {\\n    if (depsChanged(effect.prevDeps, effect.deps)) {\\n      // Run cleanup from previous execution\\n      if (effect.cleanup) {\\n        effect.cleanup();\\n      }\\n      \\n      // Run setup and store new cleanup\\n      effect.cleanup = effect.setup();\\n      effect.prevDeps = effect.deps;\\n    }\\n  });\\n}\\n\`\`\`"
    }
  ]
}
\`\`\`

### Visualizing the Execution Flow

\`\`\`algoviz
{
  "title": "Effect Execution Timeline",
  "type": "array",
  "data": ["Render", "Effects Check", "Cleanup", "Setup", "Paint"],
  "frames": [
    { "highlight": [0], "label": "Component renders with new props/state" },
    { "highlight": [1], "label": "Compare current deps with previous deps" },
    { "highlight": [2], "label": "Run cleanup from previous effect (if exists)" },
    { "highlight": [3], "label": "Run setup function and store cleanup" },
    { "highlight": [4], "label": "Browser paints updates to screen" }
  ],
  "speed": 1000
}
\`\`\`

### Complete Implementation

\`\`\`playground
{
  "title": "Effect System Implementation",
  "language": "javascript",
  "code": "function createEffectSystem() {\\n  const effects = [];\\n  \\n  function useEffect(setup, deps) {\\n    effects.push({\\n      setup,\\n      deps,\\n      prevDeps: undefined,\\n      cleanup: undefined\\n    });\\n  }\\n  \\n  function depsChanged(prevDeps, nextDeps) {\\n    if (!prevDeps || !nextDeps) return true;\\n    if (prevDeps.length !== nextDeps.length) return true;\\n    \\n    for (let i = 0; i < prevDeps.length; i++) {\\n      if (prevDeps[i] !== nextDeps[i]) return true;\\n    }\\n    return false;\\n  }\\n  \\n  function runEffects() {\\n    effects.forEach(effect => {\\n      if (depsChanged(effect.prevDeps, effect.deps)) {\\n        // Run cleanup from previous execution\\n        if (effect.cleanup) {\\n          effect.cleanup();\\n        }\\n        \\n        // Run setup and store new cleanup\\n        effect.cleanup = effect.setup();\\n        effect.prevDeps = effect.deps;\\n      }\\n    });\\n  }\\n  \\n  function unmount() {\\n    effects.forEach(effect => {\\n      if (effect.cleanup) {\\n        effect.cleanup();\\n      }\\n    });\\n  }\\n  \\n  return { useEffect, runEffects, unmount };\\n}\\n\\n// Example usage\\nconst system = createEffectSystem();\\nlet count = 0;\\nlet user = 'Alice';\\n\\n// Effect with no deps - runs every time\\nsystem.useEffect(() => {\\n  console.log('No deps: runs every time');\\n}, undefined);\\n\\n// Effect with empty deps - runs once\\nsystem.useEffect(() => {\\n  console.log('Empty deps: runs once');\\n  return () => console.log('Cleanup from empty deps');\\n}, []);\\n\\n// Effect with specific deps\\nsystem.useEffect(() => {\\n  console.log('User changed to:', user);\\n  return () => console.log('Cleaning up for user:', user);\\n}, [user]);\\n\\nconsole.log('=== First run ===');\\nsystem.runEffects();\\n\\nconsole.log('=== Second run (no changes) ===');\\nsystem.runEffects();\\n\\nconsole.log('=== Third run (user changed) ===');\\nuser = 'Bob';\\nsystem.runEffects();\\n\\nconsole.log('=== Unmount ===');\\nsystem.unmount();",
  "runnable": true
}
\`\`\`

### Testing Your Understanding

\`\`\`quiz
{
  "title": "Effect System Behavior",
  "questions": [
    {
      "question": "When does an effect with dependencies \`[count]\` re-run?",
      "options": [
        "After every render",
        "Only when the component mounts",
        "Only when \`count\` changes",
        "Never"
      ],
      "answer": 2,
      "explanation": "Effects with dependency arrays only re-run when one of their dependencies changes value (using === comparison)."
    },
    {
      "question": "What happens to the cleanup function returned by an effect?",
      "options": [
        "It's ignored",
        "It runs immediately after the setup function",
        "It runs before the next setup execution and on unmount",
        "It runs only on unmount"
      ],
      "answer": 2,
      "explanation": "Cleanup functions run before the effect re-runs (to clean up the previous effect) and when the component unmounts."
    },
    {
      "question": "How does React compare dependencies in the array?",
      "options": [
        "Deep equality comparison",
        "Shallow comparison using ===",
        "JSON.stringify comparison",
        "It doesn't compare, just re-runs"
      ],
      "answer": 1,
      "explanation": "React uses shallow comparison (===) to check if dependencies changed. This is why objects and arrays in deps can cause unnecessary re-runs."
    }
  ]
}
\`\`\`

### Common Pitfalls

\`\`\`callout
{
  "type": "warning",
  "title": "Watch Out for These!",
  "content": "**Stale Closures**: Effects capture variables from their defining scope. If you reference a variable that changes, but don't include it in deps, you'll get stale values.\\n\\n**Object Dependencies**: Including objects or arrays in deps often causes unnecessary re-runs because \`{}\` !== \`{}\` even if they contain the same data.\\n\\n**Missing Cleanup**: Always clean up subscriptions, timers, and event listeners to prevent memory leaks."
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Effects with no deps run after every render; effects with [] run only once",
    "Effects with dependencies re-run when any dependency changes (using ===)",
    "Cleanup functions run before the next effect execution and on unmount",
    "The effect scheduler ensures effects don't block the browser paint",
    "Always include all values from component scope that the effect uses"
  ]
}
\`\`\``,
      starterCode: `function createEffectSystem() {
  // TODO: Track registered effects, their previous deps, and cleanup functions
  // Return: { useEffect, runEffects, unmount }

  function useEffect(setup, deps) {
    // TODO: Register an effect with its dependencies
  }

  function runEffects() {
    // TODO: For each registered effect:
    // - If deps is undefined (no array), always run
    // - If deps is [] and hasn't run yet, run once
    // - If deps changed since last run, run (and cleanup first)
    // - Before running, call the previous cleanup if any
  }

  function unmount() {
    // TODO: Run all cleanup functions
  }

  return { useEffect, runEffects, unmount };
}

// Test cases
const log = [];
const { useEffect, runEffects, unmount } = createEffectSystem();

// Effect 1: runs every time (no deps)
useEffect(() => {
  log.push("effect1:setup");
  return () => log.push("effect1:cleanup");
});

// Effect 2: runs once (empty deps)
useEffect(() => {
  log.push("effect2:setup");
  return () => log.push("effect2:cleanup");
}, []);

// Effect 3: runs when deps change
let count = 0;
useEffect(() => {
  log.push(\`effect3:setup(\${count})\`);
  return () => log.push(\`effect3:cleanup(\${count})\`);
}, [count]);

// First run
runEffects();
console.log(log.join(", "));
// Expected: "effect1:setup, effect2:setup, effect3:setup(0)"

// Second run — no dep changes
log.length = 0;
runEffects();
console.log(log.join(", "));
// Expected: "effect1:cleanup, effect1:setup"
// (effect1 always runs, effect2 skipped because [] already ran, effect3 skipped because [0] unchanged)

// Third run — count changed
log.length = 0;
count = 1;
useEffect(() => {
  log.push(\`effect3:setup(\${count})\`);
  return () => log.push(\`effect3:cleanup(\${count})\`);
}, [count]);
runEffects();
console.log(log.join(", "));
// Expected includes: "effect1:cleanup, effect1:setup, effect3:cleanup(...), effect3:setup(1)"

// Unmount
log.length = 0;
unmount();
console.log(log.join(", "));
// Expected includes cleanup calls for active effects
console.log("All tests complete");
`,
      solutionCode: `function createEffectSystem() {
  const effects = [];
  let effectIndex = 0;

  function useEffect(setup, deps) {
    const index = effectIndex;
    if (effects[index]) {
      effects[index].setup = setup;
      effects[index].nextDeps = deps;
    } else {
      effects.push({
        setup,
        nextDeps: deps,
        prevDeps: undefined,
        cleanup: null,
        hasRun: false,
      });
    }
    effectIndex++;
  }

  function depsChanged(prev, next) {
    if (prev === undefined || next === undefined) return true;
    if (prev.length !== next.length) return true;
    return prev.some((dep, i) => dep !== next[i]);
  }

  function runEffects() {
    effectIndex = 0;
    for (const effect of effects) {
      const shouldRun =
        effect.nextDeps === undefined ||
        !effect.hasRun ||
        depsChanged(effect.prevDeps, effect.nextDeps);

      if (shouldRun) {
        if (effect.cleanup) {
          effect.cleanup();
        }
        effect.cleanup = effect.setup() || null;
        effect.prevDeps = effect.nextDeps ? [...effect.nextDeps] : effect.nextDeps;
        effect.hasRun = true;
      }
    }
  }

  function unmount() {
    for (const effect of effects) {
      if (effect.cleanup) {
        effect.cleanup();
        effect.cleanup = null;
      }
    }
  }

  return { useEffect, runEffects, unmount };
}

// Test cases
const log = [];
const { useEffect, runEffects, unmount } = createEffectSystem();

// Effect 1: runs every time (no deps)
useEffect(() => {
  log.push("effect1:setup");
  return () => log.push("effect1:cleanup");
});

// Effect 2: runs once (empty deps)
useEffect(() => {
  log.push("effect2:setup");
  return () => log.push("effect2:cleanup");
}, []);

// Effect 3: runs when deps change
let count = 0;
useEffect(() => {
  log.push(\`effect3:setup(\${count})\`);
  return () => log.push(\`effect3:cleanup(\${count})\`);
}, [count]);

// First run
runEffects();
console.log(log.join(", "));
// Expected: "effect1:setup, effect2:setup, effect3:setup(0)"

// Second run — no dep changes
log.length = 0;
runEffects();
console.log(log.join(", "));
// Expected: "effect1:cleanup, effect1:setup"

// Third run — count changed
log.length = 0;
count = 1;
useEffect(() => {
  log.push(\`effect3:setup(\${count})\`);
  return () => log.push(\`effect3:cleanup(\${count})\`);
}, [count]);
runEffects();
console.log(log.join(", "));

// Unmount
log.length = 0;
unmount();
console.log(log.join(", "));
console.log("All tests complete");
`,
    },
    {
      id: "effects-data-fetcher",
      slug: "data-fetcher-cache",
      title: "Data Fetcher with Cache",
      content: `## Data Fetcher with Cache

### Problem Statement

Implement a \`createDataFetcher\` that simulates React's data fetching pattern with loading states, error handling, and caching. Since we cannot make real HTTP requests, we simulate with a fake API.

Create \`createFakeAPI(data)\` that simulates async data sources:
- \`lookup(key)\` returns \`{ ok: true, data }\` or \`{ ok: false, error }\`

Create \`createDataFetcher()\` that provides:
- \`fetch(key, fetchFn)\` — fetches data, returns \`{ status, data, error }\`
- Uses a cache to avoid re-fetching the same key
- \`invalidate(key)\` — marks cached data as stale
- \`invalidateAll()\` — marks all cached data as stale
- \`getCacheStatus()\` — returns info about what is cached

The fetcher should track states: \`idle\`, \`loading\`, \`success\`, \`error\`.

\`\`\`concept
{
  "title": "Why Build a Cache System?",
  "variant": "insight",
  "content": "While React's useEffect can handle basic data fetching, implementing caching manually reveals why libraries like React Query and SWR exist. A robust cache system needs to handle race conditions, memory leaks, and stale data - complexities that useEffect alone cannot elegantly solve."
}
\`\`\`

### Hints

- Check the cache before calling fetchFn
- Do not cache error responses
- invalidate removes from cache so the next fetch will call fetchFn again

\`\`\`steps
{
  "title": "Building the Cache System",
  "steps": [
    {
      "title": "1. Create the Fake API",
      "content": "First, build \`createFakeAPI(data)\` that returns an object with a \`lookup(key)\` method. This should simulate network delays using \`setTimeout\` and return either success or error responses based on whether the key exists in your data."
    },
    {
      "title": "2. Design the Cache Structure",
      "content": "Your cache should store objects with \`{ data, timestamp, status }\`. Use a Map or plain object with the fetch key as the identifier. Consider what metadata you need to track for each cached item."
    },
    {
      "title": "3. Implement State Management",
      "content": "Track four states: \`idle\` (initial), \`loading\` (fetch in progress), \`success\` (data received), and \`error\` (fetch failed). The fetch method should return an object with the current state and any relevant data or error information."
    },
    {
      "title": "4. Handle Cache Invalidation",
      "content": "Implement \`invalidate(key)\` to remove specific items and \`invalidateAll()\` to clear the entire cache. Consider whether you want to keep metadata about what was cached or completely remove entries."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Data Fetcher Implementation",
  "language": "javascript",
  "code": "function createFakeAPI(data) {\\n  return {\\n    lookup(key) {\\n      return new Promise(resolve => {\\n        setTimeout(() => {\\n          if (data[key]) {\\n            resolve({ ok: true, data: data[key] });\\n          } else {\\n            resolve({ ok: false, error: 'Not found' });\\n          }\\n        }, 300);\\n      });\\n    }\\n  };\\n}\\n\\nfunction createDataFetcher() {\\n  const cache = new Map();\\n  \\n  return {\\n    async fetch(key, fetchFn) {\\n      // Check cache first\\n      if (cache.has(key)) {\\n        return { status: 'success', data: cache.get(key).data, error: null };\\n      }\\n      \\n      // Not in cache, fetch it\\n      const result = await fetchFn(key);\\n      \\n      if (result.ok) {\\n        cache.set(key, { data: result.data, timestamp: Date.now() });\\n        return { status: 'success', data: result.data, error: null };\\n      } else {\\n        return { status: 'error', data: null, error: result.error };\\n      }\\n    },\\n    \\n    invalidate(key) {\\n      cache.delete(key);\\n    },\\n    \\n    invalidateAll() {\\n      cache.clear();\\n    },\\n    \\n    getCacheStatus() {\\n      return Array.from(cache.keys()).map(key => ({\\n        key,\\n        timestamp: cache.get(key).timestamp\\n      }));\\n    }\\n  };\\n}\\n\\n// Test it out\\nconst api = createFakeAPI({\\n  user1: { name: 'Alice', age: 30 },\\n  user2: { name: 'Bob', age: 25 }\\n});\\n\\nconst fetcher = createDataFetcher();\\n\\nasync function testFetcher() {\\n  console.log('First fetch (cache miss):');\\n  let result = await fetcher.fetch('user1', api.lookup.bind(api));\\n  console.log(result);\\n  \\n  console.log('\\\\nSecond fetch (cache hit):');\\n  result = await fetcher.fetch('user1', api.lookup.bind(api));\\n  console.log(result);\\n  \\n  console.log('\\\\nCache status:');\\n  console.log(fetcher.getCacheStatus());\\n  \\n  console.log('\\\\nAfter invalidation:');\\n  fetcher.invalidate('user1');\\n  console.log(fetcher.getCacheStatus());\\n}\\n\\ntestFetcher();",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Cache Behavior Quiz",
  "questions": [
    {
      "question": "What happens when you call fetch() with a key that's already in the cache?",
      "options": [
        "It makes a new network request every time",
        "It returns cached data immediately without calling fetchFn",
        "It calls fetchFn but ignores the result",
        "It throws an error"
      ],
      "answer": 1,
      "explanation": "The primary benefit of caching is avoiding redundant network requests. When data exists in cache, it's returned immediately."
    },
    {
      "question": "Why shouldn't we cache error responses?",
      "options": [
        "Errors take up too much memory",
        "The same request might succeed later",
        "Errors are always permanent",
        "Caching errors improves performance"
      ],
      "answer": 1,
      "explanation": "Network errors, server timeouts, or temporary issues might resolve themselves. Caching errors would prevent retrying failed requests that might succeed later."
    },
    {
      "question": "What does the invalidate() method do?",
      "options": [
        "Updates cached data with new values",
        "Removes data from cache so next fetch will call fetchFn",
        "Marks data as stale but keeps it in cache",
        "Refreshes all cached data"
      ],
      "answer": 1,
      "explanation": "Invalidation removes data from the cache, forcing the next fetch to make a fresh request. This is useful when you know data has changed on the server."
    }
  ]
}
\`\`\`

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Without Cache",
    "code": "// Every component fetch triggers network call\\nfunction UserProfile({ userId }) {\\n  const [user, setUser] = useState(null);\\n  \\n  useEffect(() => {\\n    fetch(\\\\\`/api/users/\\\\\${userId}\\\\\`)\\n      .then(res => res.json())\\n      .then(setUser);\\n  }, [userId]);\\n  \\n  // Same data fetched multiple times across components\\n}"
  },
  "after": {
    "label": "With Cache",
    "code": "// Shared cache across components\\nconst fetcher = createDataFetcher();\\n\\nfunction UserProfile({ userId }) {\\n  const [state, setState] = useState({ status: 'idle' });\\n  \\n  useEffect(() => {\\n    fetcher.fetch(userId, api.lookup)\\n      .then(setState);\\n  }, [userId]);\\n  \\n  // Same data served instantly from cache\\n}"
  }
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Caching prevents redundant network requests by storing previously fetched data locally",
    "A robust cache system tracks metadata like timestamps and provides invalidation methods",
    "Error responses shouldn't be cached since the same request might succeed later",
    "Manual cache implementation reveals why libraries like React Query handle these complexities for you",
    "Cache invalidation is crucial for data freshness - remove stale entries when you know data has changed"
  ]
}
\`\`\``,
      starterCode: `function createFakeAPI(dataset) {
  // TODO: return an object with lookup(key)
  // - If key exists in dataset, return { ok: true, data: dataset[key] }
  // - Otherwise return { ok: false, error: "Not found: <key>" }
}

function createDataFetcher() {
  // TODO: implement a data fetcher with caching
  // - fetch(key, fetchFn): checks cache first, calls fetchFn if not cached
  //   Returns { status: "success"|"error", data, error }
  // - invalidate(key): removes key from cache
  // - invalidateAll(): clears entire cache
  // - getCacheStatus(): returns { keys: [...], size: number }
}

// Test cases
const api = createFakeAPI({
  "user:1": { id: 1, name: "Alice", role: "admin" },
  "user:2": { id: 2, name: "Bob", role: "user" },
  "user:3": { id: 3, name: "Carol", role: "user" },
  "posts": [
    { id: 1, title: "Hello World", authorId: 1 },
    { id: 2, title: "React Patterns", authorId: 2 },
  ],
});

const fetcher = createDataFetcher();

// Test 1: Fetch data
const result1 = fetcher.fetch("user:1", () => api.lookup("user:1"));
console.log(result1);
// Expected: { status: "success", data: { id: 1, name: "Alice", role: "admin" }, error: null }

// Test 2: Cached fetch (should not call fetchFn again)
let fetchCount = 0;
fetcher.fetch("user:1", () => { fetchCount++; return api.lookup("user:1"); });
console.log(fetchCount);
// Expected: 0 (cache hit, fetchFn not called)

// Test 3: Different key triggers new fetch
const result2 = fetcher.fetch("user:2", () => api.lookup("user:2"));
console.log(result2.data.name);
// Expected: "Bob"

// Test 4: Cache status
console.log(fetcher.getCacheStatus());
// Expected: { keys: ["user:1", "user:2"], size: 2 }

// Test 5: Error handling
const result3 = fetcher.fetch("user:999", () => api.lookup("user:999"));
console.log(result3);
// Expected: { status: "error", data: null, error: "Not found: user:999" }

// Test 6: Invalidate specific key
fetcher.invalidate("user:1");
fetchCount = 0;
fetcher.fetch("user:1", () => { fetchCount++; return api.lookup("user:1"); });
console.log(fetchCount);
// Expected: 1 (cache was invalidated, fetchFn called)

// Test 7: Invalidate all
fetcher.invalidateAll();
console.log(fetcher.getCacheStatus().size);
// Expected: 0

// Test 8: Fetch array data
const result4 = fetcher.fetch("posts", () => api.lookup("posts"));
console.log(result4.data.length);
// Expected: 2
console.log(result4.data[1].title);
// Expected: "React Patterns"
`,
      solutionCode: `function createFakeAPI(dataset) {
  return {
    lookup(key) {
      if (key in dataset) {
        return { ok: true, data: dataset[key] };
      }
      return { ok: false, error: \`Not found: \${key}\` };
    },
  };
}

function createDataFetcher() {
  const cache = new Map();

  return {
    fetch(key, fetchFn) {
      if (cache.has(key)) {
        return cache.get(key);
      }

      const response = fetchFn();

      if (response.ok) {
        const result = { status: "success", data: response.data, error: null };
        cache.set(key, result);
        return result;
      } else {
        const result = { status: "error", data: null, error: response.error };
        return result;
      }
    },
    invalidate(key) {
      cache.delete(key);
    },
    invalidateAll() {
      cache.clear();
    },
    getCacheStatus() {
      return {
        keys: Array.from(cache.keys()),
        size: cache.size,
      };
    },
  };
}

// Test cases
const api = createFakeAPI({
  "user:1": { id: 1, name: "Alice", role: "admin" },
  "user:2": { id: 2, name: "Bob", role: "user" },
  "user:3": { id: 3, name: "Carol", role: "user" },
  "posts": [
    { id: 1, title: "Hello World", authorId: 1 },
    { id: 2, title: "React Patterns", authorId: 2 },
  ],
});

const fetcher = createDataFetcher();

// Test 1: Fetch data
const result1 = fetcher.fetch("user:1", () => api.lookup("user:1"));
console.log(result1);
// Expected: { status: "success", data: { id: 1, name: "Alice", role: "admin" }, error: null }

// Test 2: Cached fetch (should not call fetchFn again)
let fetchCount = 0;
fetcher.fetch("user:1", () => { fetchCount++; return api.lookup("user:1"); });
console.log(fetchCount);
// Expected: 0 (cache hit, fetchFn not called)

// Test 3: Different key triggers new fetch
const result2 = fetcher.fetch("user:2", () => api.lookup("user:2"));
console.log(result2.data.name);
// Expected: "Bob"

// Test 4: Cache status
console.log(fetcher.getCacheStatus());
// Expected: { keys: ["user:1", "user:2"], size: 2 }

// Test 5: Error handling
const result3 = fetcher.fetch("user:999", () => api.lookup("user:999"));
console.log(result3);
// Expected: { status: "error", data: null, error: "Not found: user:999" }

// Test 6: Invalidate specific key
fetcher.invalidate("user:1");
fetchCount = 0;
fetcher.fetch("user:1", () => { fetchCount++; return api.lookup("user:1"); });
console.log(fetchCount);
// Expected: 1 (cache was invalidated, fetchFn called)

// Test 7: Invalidate all
fetcher.invalidateAll();
console.log(fetcher.getCacheStatus().size);
// Expected: 0

// Test 8: Fetch array data
const result4 = fetcher.fetch("posts", () => api.lookup("posts"));
console.log(result4.data.length);
// Expected: 2
console.log(result4.data[1].title);
// Expected: "React Patterns"
`,
    },
  ],
};
