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

### Hints

- Store each effect's previous deps to compare on re-run
- Use shallow comparison (===) for each dependency element
- Effects with no deps array should run every time`,
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

### Hints

- Check the cache before calling fetchFn
- Do not cache error responses
- invalidate removes from cache so the next fetch will call fetchFn again`,
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
