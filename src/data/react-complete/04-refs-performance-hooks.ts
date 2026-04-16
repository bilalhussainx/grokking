import { Module } from "../types";

export const module4: Module = {
  id: "refs-performance-hooks",
  title: "useRef, useCallback & useMemo",
  description: "Master refs for DOM access and mutable values, and performance hooks for preventing unnecessary work",
  lessons: [
    {
      id: "useref-deep",
      slug: "useref-deep",
      title: "useRef: DOM Access & Mutable Values",
      content: `
# useRef: DOM Access & Mutable Values

\`useRef\` serves two distinct purposes that are often confused. Understanding both is critical.

\`\`\`concept
{
  "title": "Two Uses of useRef",
  "description": "useRef returns a mutable container { current: value }. Unlike state, changing .current does NOT trigger a re-render. This makes it perfect for two very different use cases.",
  "points": [
    "1. DOM REFS: attach to JSX elements to get direct DOM node access",
    "2. MUTABLE VALUES: store any value that should persist across renders but NOT trigger re-renders",
    "ref.current is mutable — you can read/write it freely",
    "Updating ref.current never causes a re-render",
    "The ref object itself is stable — same reference across all renders",
    "Don't read/write refs during rendering — that's state's job"
  ]
}
\`\`\`

## DOM Refs

\`\`\`tabs
[
  {
    "label": "Focus Management",
    "content": "function SearchBox() {\\n  const inputRef = useRef(null);\\n\\n  useEffect(() => {\\n    // Focus input on mount:\\n    inputRef.current?.focus();\\n  }, []);\\n\\n  return (\\n    <div>\\n      <input ref={inputRef} type=\\"search\\" />\\n      <button onClick={() => inputRef.current?.focus()}>\\n        Focus input\\n      </button>\\n    </div>\\n  );\\n}"
  },
  {
    "label": "Measuring DOM",
    "content": "function MeasuredBox() {\\n  const boxRef = useRef(null);\\n  const [size, setSize] = useState({ width: 0, height: 0 });\\n\\n  useLayoutEffect(() => {\\n    if (!boxRef.current) return;\\n    const { width, height } = boxRef.current.getBoundingClientRect();\\n    setSize({ width, height });\\n  }, []);\\n\\n  return (\\n    <div ref={boxRef}>\\n      Size: {size.width} x {size.height}\\n    </div>\\n  );\\n}"
  },
  {
    "label": "Media Control",
    "content": "function VideoPlayer({ src }) {\\n  const videoRef = useRef(null);\\n  const [playing, setPlaying] = useState(false);\\n\\n  const togglePlay = () => {\\n    if (playing) {\\n      videoRef.current.pause();\\n    } else {\\n      videoRef.current.play();\\n    }\\n    setPlaying(prev => !prev);\\n  };\\n\\n  return (\\n    <div>\\n      <video ref={videoRef} src={src} />\\n      <button onClick={togglePlay}>\\n        {playing ? 'Pause' : 'Play'}\\n      </button>\\n    </div>\\n  );\\n}"
  }
]
\`\`\`

## Mutable Value Storage (NOT for rendering)

\`\`\`tsx
// Track previous value:
function usePrevious(value) {
  const prevRef = useRef(value);
  useEffect(() => {
    prevRef.current = value;
  });
  return prevRef.current;
}

// Store timer ID without triggering re-renders:
function Debouncer({ onSearch }) {
  const timerRef = useRef(null);

  const handleChange = (e) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(e.target.value);
    }, 300);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current); // cleanup
  }, []);

  return <input onChange={handleChange} />;
}

// Track component mounted state:
function useIsMounted() {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);
  return isMounted;
}
\`\`\`

## forwardRef: Exposing Refs to Parents

\`\`\`tsx
// A parent might need to control a child's DOM element
// forwardRef allows the parent to pass a ref through

const FancyInput = React.forwardRef(function FancyInput(props, ref) {
  return (
    <div className="fancy-wrapper">
      <input ref={ref} {...props} className="fancy-input" />
    </div>
  );
});

// Parent usage:
function Form() {
  const inputRef = useRef(null);

  return (
    <>
      <FancyInput ref={inputRef} type="text" />
      <button onClick={() => inputRef.current?.focus()}>
        Focus the fancy input
      </button>
    </>
  );
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What happens when you update ref.current?",
      "options": ["The component re-renders", "Nothing — refs don't trigger re-renders", "An error is thrown", "React schedules a re-render"],
      "answer": 1,
      "explanation": "Mutating ref.current does NOT trigger a re-render. This is the key difference from state — use refs for values that shouldn't trigger UI updates."
    },
    {
      "q": "When is it safe to access ref.current in a ref attached to a DOM element?",
      "options": ["During rendering", "In useLayoutEffect or useEffect (after commit)", "In useState initializer", "Anywhere in the component"],
      "answer": 1,
      "explanation": "Refs are populated after the component commits to the DOM. During rendering, ref.current is null. Access refs in effects or event handlers."
    },
    {
      "q": "What is forwardRef used for?",
      "options": ["Forwarding state from child to parent", "Letting a parent component access a DOM element inside a child component", "Passing props to grandchildren", "Creating refs in class components"],
      "answer": 1,
      "explanation": "forwardRef allows a parent to pass a ref down to a child component's inner DOM element, enabling the parent to directly control focus, scroll, etc."
    }
  ]
}
\`\`\`
`,
    },
    {
      id: "usecallback-usememo",
      slug: "usecallback-usememo",
      title: "useCallback & useMemo: Performance Optimization",
      content: `
# useCallback & useMemo: When (Not) to Optimize

These hooks are **optimization tools** — use them to solve real performance problems, not by default.

\`\`\`concept
{
  "title": "Memoization Hooks",
  "description": "Both hooks cache a value between renders. The difference is WHAT they cache: useCallback caches a function, useMemo caches a computed value. Both use a dependency array to decide when to recompute.",
  "points": [
    "useCallback(fn, deps) → returns the same function reference if deps haven't changed",
    "useMemo(() => value, deps) → returns the same computed value if deps haven't changed",
    "Both add complexity and memory overhead — only worth it when they solve a real problem",
    "Three valid use cases: passing stable callbacks to React.memo children, avoiding expensive recalculations, stable references in useEffect deps",
    "WRONG use: wrapping everything preventatively — adds overhead without benefit"
  ]
}
\`\`\`

## useCallback

\`\`\`tabs
[
  {
    "label": "Without useCallback (Problem)",
    "content": "// Every render creates a NEW handleClick function\\n// Even if count doesn't change!\\nfunction Parent() {\\n  const [count, setCount] = useState(0);\\n  const [other, setOther] = useState(0);\\n\\n  // NEW reference on every render — including when 'other' changes!\\n  const handleClick = () => {\\n    console.log('Clicked', count);\\n  };\\n\\n  // MemoizedChild re-renders even when count didn't change\\n  // because handleClick is always a new reference\\n  return (\\n    <>\\n      <MemoizedChild onClick={handleClick} />\\n      <button onClick={() => setOther(o => o + 1)}>Update Other</button>\\n    </>\\n  );\\n}"
  },
  {
    "label": "With useCallback (Solution)",
    "content": "function Parent() {\\n  const [count, setCount] = useState(0);\\n  const [other, setOther] = useState(0);\\n\\n  // handleClick is stable — same reference UNLESS count changes:\\n  const handleClick = useCallback(() => {\\n    console.log('Clicked', count);\\n  }, [count]); // deps: re-create only when count changes\\n\\n  // MemoizedChild won't re-render when 'other' changes\\n  return (\\n    <>\\n      <MemoizedChild onClick={handleClick} />\\n      <button onClick={() => setOther(o => o + 1)}>Update Other</button>\\n    </>\\n  );\\n}"
  },
  {
    "label": "When NOT to Use",
    "content": "// DON'T wrap every function in useCallback!\\n// This adds overhead with no benefit if the child isn't memoized:\\nfunction Simple() {\\n  // Pointless — Parent isn't passing this to React.memo children\\n  const handleClick = useCallback(() => {\\n    console.log('click');\\n  }, []);\\n\\n  return <button onClick={handleClick}>Click</button>;\\n}\\n\\n// The memoization only helps when:\\n// 1. The function is passed to React.memo components\\n// 2. The function is in useEffect/useCallback deps"
  }
]
\`\`\`

## useMemo

\`\`\`tabs
[
  {
    "label": "Expensive Computation",
    "content": "function DataTable({ data, filter }) {\\n  // Without useMemo — runs on EVERY render (including theme changes)\\n  const filtered = data.filter(row =>\\n    row.name.toLowerCase().includes(filter.toLowerCase())\\n  );\\n\\n  // With useMemo — only recalculates when data or filter changes:\\n  const filteredMemo = useMemo(() => {\\n    return data.filter(row =>\\n      row.name.toLowerCase().includes(filter.toLowerCase())\\n    );\\n  }, [data, filter]);\\n\\n  return <Table rows={filteredMemo} />;\\n}"
  },
  {
    "label": "Stable Object Reference",
    "content": "function Chart({ userId, options }) {\\n  // Without useMemo: new object every render → useEffect fires every render!\\n  const config = { userId, ...options };\\n\\n  // With useMemo: stable reference when userId/options don't change:\\n  const config = useMemo(() => ({ userId, ...options }), [userId, options]);\\n\\n  useEffect(() => {\\n    chart.initialize(config); // only runs when config actually changes\\n  }, [config]);\\n}"
  },
  {
    "label": "Profiling First",
    "content": "// ALWAYS profile before optimizing with useMemo!\\n// React DevTools Profiler shows which components render and why.\\n\\n// Checklist before adding useMemo:\\n// 1. Is this computation actually slow? (measure it)\\n// 2. Are the deps primitive or already stable?\\n// 3. Is the component rendering too often? (why?)\\n// 4. Would React.memo on the child solve it more cleanly?\\n\\n// Rule of thumb: if you can't measure the improvement,\\n// the overhead of useMemo may outweigh the benefit."
  }
]
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does useCallback return?",
      "options": ["The return value of the function", "A memoized function with a stable reference", "A React element", "A promise"],
      "answer": 1,
      "explanation": "useCallback(fn, deps) returns the same function reference between renders unless a dependency changes — NOT the result of calling the function."
    },
    {
      "q": "useMemo(() => expensiveCalc(x), [x]) will recompute when...",
      "options": ["Every render", "The component mounts", "x changes (compared by Object.is)", "The user interacts"],
      "answer": 2,
      "explanation": "useMemo recomputes the value only when a dependency changes (compared using Object.is, same as useState). It returns the cached result otherwise."
    },
    {
      "q": "You should add useCallback to EVERY function in a component to prevent re-renders.",
      "options": ["True — it always improves performance", "False — it adds overhead and only helps when the function goes to React.memo children or is in effect deps", "True — React DevTools recommends this", "False — useCallback is only for async functions"],
      "answer": 1,
      "explanation": "Premature optimization with useCallback adds complexity and memory overhead. It's only beneficial when passing to memoized children (React.memo) or including in effect dependency arrays."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["useRef stores mutable values or DOM references — changes do NOT trigger re-renders", "forwardRef lets parent components control child DOM elements via refs", "useCallback memoizes a function reference — useful when passing to React.memo children", "useMemo memoizes a computed value — useful for expensive calculations or stable references", "Profile before optimizing — these hooks add overhead and should solve a measured problem"]
\`\`\`
`,
    },
  ],
};
