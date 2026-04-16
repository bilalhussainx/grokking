import { Module } from "../types";

export const module6: Module = {
  id: "performance-patterns",
  title: "Performance: React.memo, Lazy & Code Splitting",
  description: "Prevent unnecessary renders with React.memo, split bundles with lazy/Suspense, and measure with the Profiler",
  lessons: [
    {
      id: "react-memo",
      slug: "react-memo",
      title: "React.memo & Preventing Re-renders",
      content: `
# React.memo: Memoizing Components

By default, when a parent re-renders, ALL its children re-render — even if their props didn't change. \`React.memo\` is how you prevent this.

\`\`\`concept
{
  "title": "React.memo",
  "description": "React.memo is a Higher Order Component (HOC) that wraps a component and memoizes it. The wrapped component only re-renders if its props changed (shallow comparison).",
  "points": [
    "React.memo does a SHALLOW comparison of props",
    "If all props pass the shallow comparison, the previous render output is reused",
    "Shallow comparison: primitives compared by value, objects/arrays/functions compared by reference",
    "A new function reference (even if logically identical) will still cause a re-render",
    "Use with useCallback to stabilize function props",
    "React.memo is the functional equivalent of PureComponent"
  ]
}
\`\`\`

## When React.memo Helps

\`\`\`mermaid
graph TD
  A[Parent state changes] --> B[Parent re-renders]
  B --> C{Child wrapped in React.memo?}
  C -- No --> D[Child re-renders always]
  C -- Yes --> E{Props changed?}
  E -- Shallow equal --> F[Child SKIPS re-render ✓]
  E -- Changed --> G[Child re-renders]

  style F fill:#4ade80,color:#000
  style D fill:#f87171,color:#000
\`\`\`

## React.memo in Action

\`\`\`tabs
[
  {
    "label": "Basic Usage",
    "content": "// Without memo: re-renders every time parent renders\\nfunction ExpensiveChild({ data, onSort }) {\\n  console.log('Rendering ExpensiveChild');\\n  return <BigTable data={data} onSort={onSort} />;\\n}\\n\\n// With memo: skips re-render if data and onSort references are stable\\nconst MemoExpensiveChild = React.memo(ExpensiveChild);\\n\\n// Parent must stabilize function props too!\\nfunction Parent() {\\n  const [count, setCount] = useState(0);\\n  const [data] = useState(() => generateData());\\n\\n  // MUST use useCallback — otherwise new ref on every render\\n  const handleSort = useCallback((col) => {\\n    console.log('Sort by', col);\\n  }, []);\\n\\n  return (\\n    <>\\n      <button onClick={() => setCount(c => c + 1)}>{count}</button>\\n      <MemoExpensiveChild data={data} onSort={handleSort} />\\n    </>\\n  );\\n}"
  },
  {
    "label": "Custom Comparison",
    "content": "// React.memo takes an optional areEqual(prevProps, nextProps) function\\n// Return true = equal = SKIP re-render\\n// Return false = not equal = RE-RENDER\\n\\nconst DeepComparedList = React.memo(\\n  function ItemList({ items }) {\\n    return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;\\n  },\\n  // Custom comparison: check length + IDs, not deep content\\n  (prevProps, nextProps) => {\\n    if (prevProps.items.length !== nextProps.items.length) return false;\\n    return prevProps.items.every((item, i) => item.id === nextProps.items[i].id);\\n  }\\n);"
  },
  {
    "label": "When NOT to Use",
    "content": "// Don't memo components that ALWAYS receive new props:\\n// - Props are primitives that change frequently\\n// - Parent re-renders are cheap\\n// - Component itself is cheap to render\\n\\n// Pointless memo — onClick is a new function every render!\\nconst BadMemo = React.memo(({ onClick }) => (\\n  <button onClick={onClick}>Click</button>\\n));\\n\\n// Either memoize the callback too, or don't memo the component:\\n// Option A: useCallback in parent\\n// Option B: remove the memo (it's doing nothing useful)"
  }
]
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "React.memo compares props using...",
      "options": ["Deep equality (JSON.stringify)", "Shallow equality (Object.is for each prop)", "Reference equality only", "Triple equality (===) on the props object"],
      "answer": 1,
      "explanation": "React.memo uses shallow comparison — it calls Object.is on each prop value. Primitives are compared by value, objects/arrays/functions by reference."
    },
    {
      "q": "A parent passes onClick={() => handleClick()} to a React.memo child. Will the child re-render when the parent re-renders?",
      "options": ["No — React.memo prevents all re-renders", "Yes — the arrow function creates a new reference on every render", "Only if handleClick changes", "No — event handlers are always stable"],
      "answer": 1,
      "explanation": "() => handleClick() creates a new function reference on every render. React.memo's shallow comparison sees a different reference and re-renders. Use useCallback to stabilize the reference."
    }
  ]
}
\`\`\`
`,
    },
    {
      id: "code-splitting",
      slug: "code-splitting",
      title: "Code Splitting: React.lazy & Suspense",
      content: `
# Code Splitting with React.lazy & Suspense

Large bundles slow down initial page load. Code splitting lets you load components on demand.

\`\`\`concept
{
  "title": "Code Splitting",
  "description": "React.lazy() lets you import a component lazily — only when it's actually needed. Suspense shows a fallback while the lazy component loads.",
  "points": [
    "React.lazy(() => import('./Component')) — dynamic import",
    "Suspense fallback shows while the lazy chunk is loading",
    "Only works with default exports",
    "Nest multiple Suspense boundaries to control which parts show spinners",
    "Error Boundaries catch lazy loading failures (network errors, etc.)",
    "Route-based splitting is the most common and highest-impact pattern"
  ]
}
\`\`\`

## React.lazy + Suspense

\`\`\`tsx
import React, { Suspense, lazy } from 'react';

// These components only load when they're actually rendered:
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    // Single Suspense for all lazy routes:
    <Suspense fallback={<div className="spinner">Loading...</div>}>
      <Router>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Router>
    </Suspense>
  );
}

// Granular: each route has its own fallback
function App() {
  return (
    <Router>
      <Route path="/dashboard" element={
        <Suspense fallback={<DashboardSkeleton />}>
          <Dashboard />
        </Suspense>
      } />
    </Router>
  );
}
\`\`\`

## Suspense for Data (React 18)

\`\`\`tsx
// React 18 extends Suspense to data fetching via use() hook
// or data-fetching libraries (React Query, SWR, Relay) that
// integrate with Suspense

// useTransition — mark updates as non-urgent (doesn't block UI):
function SearchPage() {
  const [query, setQuery] = useState('');
  const [deferredQuery, setDeferredQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e) => {
    setQuery(e.target.value);           // urgent: update input immediately
    startTransition(() => {
      setDeferredQuery(e.target.value); // non-urgent: update results
    });
  };

  return (
    <div>
      <input value={query} onChange={handleSearch} />
      {isPending && <Spinner />}
      <SearchResults query={deferredQuery} />
    </div>
  );
}
\`\`\`

## Error Boundaries with Lazy Loading

\`\`\`tsx
class LazyErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>Failed to load page.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Wrap lazy routes with both Suspense and Error Boundary:
<LazyErrorBoundary>
  <Suspense fallback={<Spinner />}>
    <LazyComponent />
  </Suspense>
</LazyErrorBoundary>
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "React.lazy requires the dynamic import to export...",
      "options": ["A named export", "A default export", "Both named and default", "A module.exports"],
      "answer": 1,
      "explanation": "React.lazy(() => import('./Component')) only works with default exports. For named exports, you must re-export as default or use a wrapper."
    },
    {
      "q": "What happens if a lazy-loaded component fails to load (network error)?",
      "options": ["React silently ignores it", "The fallback stays visible forever", "An error is thrown — must be caught by an Error Boundary", "The app crashes completely"],
      "answer": 2,
      "explanation": "Failed lazy imports throw an error that Suspense alone cannot handle. You need an Error Boundary wrapping the Suspense to handle this case gracefully."
    },
    {
      "q": "useTransition is used to...",
      "options": ["Animate component transitions", "Mark state updates as non-urgent so they don't block UI interactions", "Defer rendering to the next frame", "Run effects after paint"],
      "answer": 1,
      "explanation": "useTransition marks state updates inside startTransition as non-urgent. React can interrupt these updates to handle more urgent ones (like user input), keeping the UI responsive."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["React.memo prevents re-renders when props are shallowly equal — combine with useCallback for function props", "React.lazy + Suspense enables route-based code splitting to reduce initial bundle size", "Always wrap lazy imports with an Error Boundary to handle failed loads", "useTransition marks updates as non-urgent — keeps UI responsive during heavy re-renders", "Profile first — measure real rendering cost before adding React.memo"]
\`\`\`
`,
    },
  ],
};
