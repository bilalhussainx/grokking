import { Module } from "../types";

export const module3: Module = {
  id: "useeffect-deep",
  title: "useEffect: Side Effects Mastery",
  description: "Master useEffect — dependency arrays, cleanup, common patterns, and avoiding the most common mistakes",
  lessons: [
    {
      id: "effect-phases",
      slug: "effect-phases",
      title: "Effect Phases, Dependency Array & Cleanup",
      content: `
# useEffect: Side Effects in React

\`useEffect\` is how you synchronize your component with external systems — data fetching, subscriptions, DOM manipulation, timers.

\`\`\`concept
{
  "title": "useEffect Mental Model",
  "description": "Don't think of useEffect as 'lifecycle methods'. Think of it as: 'After every render where these values changed, run this code. And if you need to clean up, return a function.'",
  "points": [
    "useEffect runs AFTER the component renders and the DOM is updated",
    "Return a cleanup function to run before the next effect or unmount",
    "The dependency array controls WHEN the effect re-runs",
    "Empty array [] = run once after mount, cleanup on unmount",
    "No array = run after every render (rare use case)",
    "Effects in Strict Mode run twice in development to detect bugs"
  ]
}
\`\`\`

## The Three Forms of useEffect

\`\`\`tabs
[
  {
    "label": "Run Once (Mount/Unmount)",
    "content": "// Empty dependency array — runs once after mount\\nuseEffect(() => {\\n  const subscription = externalService.subscribe(handleData);\\n\\n  // Cleanup runs on unmount:\\n  return () => {\\n    subscription.unsubscribe();\\n  };\\n}, []); // <-- empty array"
  },
  {
    "label": "Run on Value Change",
    "content": "// Dependency array — re-runs when userId changes\\nuseEffect(() => {\\n  let cancelled = false;\\n  \\n  async function fetchUser() {\\n    const data = await api.getUser(userId);\\n    if (!cancelled) setUser(data);\\n  }\\n  \\n  fetchUser();\\n  \\n  return () => { cancelled = true; }; // cancel on cleanup\\n}, [userId]); // <-- re-runs when userId changes"
  },
  {
    "label": "Run After Every Render",
    "content": "// No dependency array — runs after EVERY render\\n// This is almost always wrong — prefer including deps\\nuseEffect(() => {\\n  document.title = \`\${count} items\`;\\n}); // <-- no array (runs every render)\\n\\n// CORRECT: specify the dependency\\nuseEffect(() => {\\n  document.title = \`\${count} items\`;\\n}, [count]); // only re-runs when count changes"
  }
]
\`\`\`

## Cleanup in Detail

\`\`\`tsx
// RULE: Every side effect should be reversible
// The cleanup function runs:
// 1. Before the next effect fires
// 2. When the component unmounts

// Timer cleanup:
useEffect(() => {
  const timer = setInterval(() => {
    setTime(prev => prev + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []);

// Event listener cleanup:
useEffect(() => {
  const handler = (e) => setScrollY(e.target.scrollY);
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
}, []);

// WebSocket cleanup:
useEffect(() => {
  const ws = new WebSocket('wss://api.example.com/live');
  ws.onmessage = (e) => setMessages(prev => [...prev, e.data]);
  return () => ws.close();
}, []);
\`\`\`

## The Exhaustive Deps Rule

**Every reactive value used inside useEffect MUST be in the dependency array.**

\`\`\`tabs
[
  {
    "label": "The Problem",
    "content": "// BUG: userId is used but NOT in deps — stale closure\\nuseEffect(() => {\\n  fetch(\`/api/users/\${userId}\`)  // uses userId\\n    .then(r => r.json())\\n    .then(setUser);\\n}, []); // ESLint will warn: 'userId' missing from deps\\n\\n// If userId changes, effect won't re-run → shows stale data!"
  },
  {
    "label": "The Fix",
    "content": "// Add userId to dependency array:\\nuseEffect(() => {\\n  let active = true;\\n  fetch(\`/api/users/\${userId}\`)\\n    .then(r => r.json())\\n    .then(data => { if (active) setUser(data); });\\n  return () => { active = false; };\\n}, [userId]); // now re-fetches when userId changes"
  },
  {
    "label": "Stable References",
    "content": "// Functions defined in render are NEW on every render\\n// If you include them as deps, effect runs every render!\\n\\n// Option 1: Define function INSIDE the effect\\nuseEffect(() => {\\n  async function load() { /* ... */ }\\n  load();\\n}, [userId]);\\n\\n// Option 2: useCallback to stabilize the function\\nconst fetchUser = useCallback(() => {\\n  return fetch(\`/api/users/\${userId}\`);\\n}, [userId]);\\n\\nuseEffect(() => {\\n  fetchUser().then(setUser);\\n}, [fetchUser]); // stable ref = only re-runs when userId changes"
  }
]
\`\`\`

## Common Patterns

\`\`\`tabs
[
  {
    "label": "Data Fetching",
    "content": "function UserProfile({ userId }) {\\n  const [user, setUser] = useState(null);\\n  const [loading, setLoading] = useState(true);\\n  const [error, setError] = useState(null);\\n\\n  useEffect(() => {\\n    let cancelled = false;\\n    setLoading(true);\\n    setError(null);\\n\\n    fetch(\`/api/users/\${userId}\`)\\n      .then(r => r.ok ? r.json() : Promise.reject(r.status))\\n      .then(data => { if (!cancelled) { setUser(data); setLoading(false); } })\\n      .catch(err => { if (!cancelled) { setError(err); setLoading(false); } });\\n\\n    return () => { cancelled = true; };\\n  }, [userId]);\\n\\n  if (loading) return <Spinner />;\\n  if (error) return <Error message={error} />;\\n  return <div>{user?.name}</div>;\\n}"
  },
  {
    "label": "Local Storage Sync",
    "content": "function usePersisted(key, initialValue) {\\n  const [value, setValue] = useState(\\n    () => JSON.parse(localStorage.getItem(key) ?? 'null') ?? initialValue\\n  );\\n\\n  useEffect(() => {\\n    localStorage.setItem(key, JSON.stringify(value));\\n  }, [key, value]);\\n\\n  return [value, setValue];\\n}"
  },
  {
    "label": "AbortController (Modern)",
    "content": "useEffect(() => {\\n  const controller = new AbortController();\\n\\n  fetch(\`/api/search?q=\${query}\`, {\\n    signal: controller.signal,\\n  })\\n    .then(r => r.json())\\n    .then(setResults)\\n    .catch(err => {\\n      if (err.name === 'AbortError') return; // expected\\n      setError(err);\\n    });\\n\\n  return () => controller.abort();\\n}, [query]);"
  }
]
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "When does the cleanup function returned from useEffect run?",
      "options": ["Only when the component unmounts", "Before every re-render", "Before the next effect fires AND when the component unmounts", "After every render"],
      "answer": 2,
      "explanation": "The cleanup function runs before the next effect fires (so previous subscriptions/timers are torn down) and also when the component unmounts."
    },
    {
      "q": "useEffect with [] (empty array) runs...",
      "options": ["After every render", "Once after the initial render", "Before the first render", "Only when props change"],
      "answer": 1,
      "explanation": "An empty dependency array means 'this effect has no dependencies that can change', so it only runs once after the initial mount."
    },
    {
      "q": "Why do effects run twice in React Strict Mode (development)?",
      "options": ["A bug in React", "To detect missing dependencies", "To verify cleanup functions work correctly — effects should be reversible", "To improve performance"],
      "answer": 2,
      "explanation": "React Strict Mode intentionally mounts → unmounts → remounts components to verify cleanup is correct. If your effect isn't reversible, it will break in Strict Mode."
    },
    {
      "q": "You want to sync state to a server every time 'data' changes. Which is correct?",
      "options": ["useEffect(() => save(data))", "useEffect(() => save(data), [])", "useEffect(() => save(data), [data])", "useEffect(() => save(data), [save])"],
      "answer": 2,
      "explanation": "Include data in the dependency array. The effect re-runs only when data changes, which is exactly what you want."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["useEffect runs after render — use it to synchronize with external systems", "Always return a cleanup function if you create timers, subscriptions, or listeners", "The dependency array tells React WHEN to re-run the effect", "Every reactive value used in the effect must be in the dependency array", "Use AbortController or a 'cancelled' flag to handle race conditions in data fetching"]
\`\`\`
`,
    },
    {
      id: "uselayouteffect",
      slug: "uselayouteffect",
      title: "useLayoutEffect vs useEffect",
      content: `
# useLayoutEffect vs useEffect

These two hooks are nearly identical — the difference is WHEN they run relative to the DOM paint.

\`\`\`concept
{
  "title": "Timing Difference",
  "description": "useEffect fires asynchronously AFTER the browser paints. useLayoutEffect fires synchronously BEFORE the browser paints (same timing as componentDidMount/componentDidUpdate).",
  "points": [
    "useEffect: commit → browser paint → effect fires (async)",
    "useLayoutEffect: commit → effect fires → browser paint (sync, blocks paint)",
    "Prefer useEffect — it's non-blocking and better for performance",
    "Use useLayoutEffect when: you must measure DOM, prevent visual flicker, sync scroll position",
    "On SSR, useLayoutEffect gives a warning — conditionally use useEffect on server"
  ]
}
\`\`\`

\`\`\`compare
{
  "left": {
    "label": "useEffect (prefer this)",
    "code": "// Use for: data fetching, subscriptions, logging\\n// Non-blocking — doesn't delay paint\\nuseEffect(() => {\\n  // Runs after paint — user sees update first\\n  fetchData().then(setData);\\n  const sub = ws.subscribe(handler);\\n  return () => sub.cancel();\\n}, [url]);"
  },
  "right": {
    "label": "useLayoutEffect (when needed)",
    "code": "// Use for: DOM measurements, tooltips, preventing flicker\\n// Runs sync before paint — blocks until done\\nuseLayoutEffect(() => {\\n  // Measure the DOM BEFORE user sees anything\\n  const rect = ref.current.getBoundingClientRect();\\n  setTooltipPosition({ top: rect.bottom, left: rect.left });\\n}, [open]);"
  }
}
\`\`\`

## Real Use Case: Tooltip Positioning

\`\`\`tsx
function Tooltip({ anchorRef, text, open }) {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Must use useLayoutEffect to avoid the tooltip flashing
  // in the wrong position before repositioning
  useLayoutEffect(() => {
    if (!open || !anchorRef.current || !tooltipRef.current) return;

    const anchorRect = anchorRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    setPosition({
      top: anchorRect.bottom + 8,
      left: anchorRect.left + (anchorRect.width - tooltipRect.width) / 2,
    });
  }, [open, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={tooltipRef}
      style={{ position: 'fixed', top: position.top, left: position.left }}
    >
      {text}
    </div>
  );
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Which hook should you use to measure a DOM element's size before the browser paints?",
      "options": ["useEffect", "useLayoutEffect", "useMemo", "useRef"],
      "answer": 1,
      "explanation": "useLayoutEffect runs synchronously after DOM mutations but before the browser paint — ideal for measuring DOM and positioning elements to prevent visual flicker."
    },
    {
      "q": "What is the risk of using useLayoutEffect instead of useEffect?",
      "options": ["State won't update", "It blocks the browser paint, potentially causing jank if the effect is slow", "It doesn't have access to the DOM", "It can't return a cleanup function"],
      "answer": 1,
      "explanation": "useLayoutEffect is synchronous and blocks painting. Long-running effects here will make the UI appear frozen until the effect completes."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
