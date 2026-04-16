import { Module } from "../types";

export const module9: Module = {
  id: "custom-hooks",
  title: "Custom Hooks: Reusing Stateful Logic",
  description: "Build your own hooks to extract and share stateful logic between components — the modern replacement for HOCs and render props",
  lessons: [
    {
      id: "custom-hooks-patterns",
      slug: "custom-hooks-patterns",
      title: "Building & Testing Custom Hooks",
      content: `
# Custom Hooks: The Modern Code Reuse Pattern

Custom hooks let you extract component logic into reusable functions. They're the best way to share stateful logic in modern React.

\`\`\`concept
{
  "title": "Rules of Hooks",
  "description": "Custom hooks are JavaScript functions whose names start with 'use' and that may call other hooks. They follow the same rules as built-in hooks.",
  "points": [
    "Name MUST start with 'use' — this is how React identifies hooks",
    "Call hooks at the TOP LEVEL only — not inside if/for/while",
    "Call hooks from React functions only — not regular JS functions",
    "Custom hooks can return anything: values, functions, arrays, objects",
    "Each component that calls a custom hook gets its OWN isolated state",
    "Hooks don't share STATE between callers — they share LOGIC"
  ]
}
\`\`\`

## Essential Custom Hook Patterns

\`\`\`tabs
[
  {
    "label": "useLocalStorage",
    "content": "function useLocalStorage(key, initialValue) {\\n  const [storedValue, setStoredValue] = useState(() => {\\n    try {\\n      const item = localStorage.getItem(key);\\n      return item ? JSON.parse(item) : initialValue;\\n    } catch (err) {\\n      return initialValue;\\n    }\\n  });\\n\\n  const setValue = (value) => {\\n    const valueToStore = value instanceof Function ? value(storedValue) : value;\\n    setStoredValue(valueToStore);\\n    localStorage.setItem(key, JSON.stringify(valueToStore));\\n  };\\n\\n  return [storedValue, setValue];\\n}\\n\\n// Usage — exactly like useState but persisted:\\nconst [theme, setTheme] = useLocalStorage('theme', 'light');"
  },
  {
    "label": "useFetch",
    "content": "function useFetch(url) {\\n  const [state, setState] = useState({\\n    data: null,\\n    loading: true,\\n    error: null,\\n  });\\n\\n  useEffect(() => {\\n    if (!url) return;\\n    let cancelled = false;\\n\\n    setState({ data: null, loading: true, error: null });\\n\\n    fetch(url)\\n      .then(r => r.ok ? r.json() : Promise.reject(\`HTTP \${r.status}\`))\\n      .then(data => {\\n        if (!cancelled) setState({ data, loading: false, error: null });\\n      })\\n      .catch(error => {\\n        if (!cancelled) setState({ data: null, loading: false, error });\\n      });\\n\\n    return () => { cancelled = true; };\\n  }, [url]);\\n\\n  return state;\\n}\\n\\n// Usage:\\nfunction UserProfile({ id }) {\\n  const { data, loading, error } = useFetch(\`/api/users/\${id}\`);\\n  if (loading) return <Spinner />;\\n  if (error) return <p>Error: {error}</p>;\\n  return <div>{data.name}</div>;\\n}"
  },
  {
    "label": "useDebounce",
    "content": "function useDebounce(value, delay = 300) {\\n  const [debouncedValue, setDebouncedValue] = useState(value);\\n\\n  useEffect(() => {\\n    const timer = setTimeout(() => {\\n      setDebouncedValue(value);\\n    }, delay);\\n\\n    return () => clearTimeout(timer); // cancel if value changes again\\n  }, [value, delay]);\\n\\n  return debouncedValue;\\n}\\n\\n// Usage — search only fires after user stops typing:\\nfunction SearchPage() {\\n  const [query, setQuery] = useState('');\\n  const debouncedQuery = useDebounce(query, 400);\\n\\n  const { data } = useFetch(\\n    debouncedQuery ? \`/api/search?q=\${debouncedQuery}\` : null\\n  );\\n\\n  return (\\n    <>\\n      <input value={query} onChange={e => setQuery(e.target.value)} />\\n      <Results data={data} />\\n    </>\\n  );\\n}"
  },
  {
    "label": "useMediaQuery",
    "content": "function useMediaQuery(query) {\\n  const [matches, setMatches] = useState(\\n    () => window.matchMedia(query).matches\\n  );\\n\\n  useEffect(() => {\\n    const mediaQuery = window.matchMedia(query);\\n    const handler = (e) => setMatches(e.matches);\\n\\n    mediaQuery.addEventListener('change', handler);\\n    return () => mediaQuery.removeEventListener('change', handler);\\n  }, [query]);\\n\\n  return matches;\\n}\\n\\n// Usage:\\nfunction ResponsiveNav() {\\n  const isMobile = useMediaQuery('(max-width: 768px)');\\n  return isMobile ? <MobileNav /> : <DesktopNav />;\\n}"
  },
  {
    "label": "useToggle",
    "content": "// Composing simpler hooks into a reusable pattern:\\nfunction useToggle(initialValue = false) {\\n  const [value, setValue] = useState(initialValue);\\n\\n  const toggle = useCallback(() => setValue(v => !v), []);\\n  const setTrue = useCallback(() => setValue(true), []);\\n  const setFalse = useCallback(() => setValue(false), []);\\n\\n  return [value, toggle, { setTrue, setFalse }];\\n}\\n\\n// Usage:\\nconst [isOpen, toggleOpen, { setTrue: open, setFalse: close }] = useToggle();\\n\\n<button onClick={toggleOpen}>Toggle Modal</button>\\n<Modal isOpen={isOpen} onClose={close} />"
  }
]
\`\`\`

## Rules of Hooks in Action

\`\`\`tsx
// WRONG: Hook inside a condition
function Component({ isLoggedIn }) {
  if (isLoggedIn) {
    const [user, setUser] = useState(null); // ERROR!
  }
}

// WRONG: Hook inside a loop
function Component({ items }) {
  items.forEach(item => {
    const [active, setActive] = useState(false); // ERROR!
  });
}

// CORRECT: Conditions inside the hook
function Component({ isLoggedIn, items }) {
  const [user, setUser] = useState(null);        // always
  const [activeItems, setActiveItems] = useState([]); // always

  useEffect(() => {
    if (isLoggedIn) {          // condition inside effect ✓
      fetchUser().then(setUser);
    }
  }, [isLoggedIn]);

  // For per-item state, use a data structure:
  const [activeMap, setActiveMap] = useState({});
  const toggleItem = (id) => {
    setActiveMap(prev => ({ ...prev, [id]: !prev[id] }));
  };
}
\`\`\`

## useImperativeHandle

Lets you customize what's exposed when a parent uses a ref on your component:

\`\`\`tsx
const VideoPlayer = forwardRef(function VideoPlayer({ src }, ref) {
  const videoRef = useRef(null);

  // Expose only specific methods to the parent:
  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause(),
    seek: (time) => { videoRef.current.currentTime = time; },
    // The full video element is NOT exposed — parent can only call these 3 methods
  }), []);

  return <video ref={videoRef} src={src} />;
});

// Parent uses only the exposed API:
function App() {
  const playerRef = useRef(null);
  return (
    <>
      <VideoPlayer ref={playerRef} src="/video.mp4" />
      <button onClick={() => playerRef.current.play()}>Play</button>
      <button onClick={() => playerRef.current.seek(30)}>Skip 30s</button>
    </>
  );
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Two components call the same custom hook. What do they share?",
      "options": ["State — all callers share the same state", "Logic — each gets its own isolated state instance", "Both state and logic", "Neither — custom hooks can't be shared"],
      "answer": 1,
      "explanation": "Custom hooks share LOGIC (the code), not STATE. Each component that calls a custom hook gets its own independent state. To share state, use Context or state management."
    },
    {
      "q": "Why must hooks be called at the top level (not inside conditions/loops)?",
      "options": ["Performance reasons", "React relies on call ORDER to associate state with the correct hook call — conditions break the order", "JavaScript limitation", "ES module restriction"],
      "answer": 1,
      "explanation": "React tracks hooks by their call order on each render. If hooks are inside conditions that may or may not run, the order can change, and React associates state with the wrong hook."
    },
    {
      "q": "What does useImperativeHandle do?",
      "options": ["Allows parent components to imperatively change child state", "Customizes what is exposed when a parent uses a ref on a child component", "Creates an uncontrolled input", "Replaces forwardRef"],
      "answer": 1,
      "explanation": "useImperativeHandle, used with forwardRef, lets you control what methods/values are accessible to the parent through the ref. Instead of exposing the entire DOM element, you expose a curated API."
    }
  ]
}
\`\`\`
`,
      starterCode: `// Build a usePagination hook that manages pagination state
// Requirements:
// - Takes totalItems, itemsPerPage, initialPage (default 1)
// - Returns: currentPage, totalPages, startIndex, endIndex, hasNext, hasPrev
// - Returns: goToNext, goToPrev, goToPage functions
// - goToPage should clamp to valid range

function usePagination({ totalItems, itemsPerPage, initialPage = 1 }) {
  // TODO: implement

  return {
    currentPage: 1,
    totalPages: 0,
    startIndex: 0,
    endIndex: 0,
    hasNext: false,
    hasPrev: false,
    goToNext: () => {},
    goToPrev: () => {},
    goToPage: (page) => {},
  };
}

// Test with this component:
function App() {
  const items = Array.from({ length: 47 }, (_, i) => \`Item \${i + 1}\`);
  const pagination = usePagination({ totalItems: items.length, itemsPerPage: 10 });
  const visibleItems = items.slice(pagination.startIndex, pagination.endIndex);

  return (
    <div>
      {visibleItems.map(item => <div key={item}>{item}</div>)}
      <div>
        <button onClick={pagination.goToPrev} disabled={!pagination.hasPrev}>Prev</button>
        <span> Page {pagination.currentPage} of {pagination.totalPages} </span>
        <button onClick={pagination.goToNext} disabled={!pagination.hasNext}>Next</button>
      </div>
    </div>
  );
}`,
      solutionCode: `import { useState, useCallback } from 'react';

function usePagination({ totalItems, itemsPerPage, initialPage = 1 }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(
    Math.min(Math.max(1, initialPage), totalPages || 1)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }, [totalPages]);

  const goToNext = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const goToPrev = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    goToNext,
    goToPrev,
    goToPage,
  };
}

function App() {
  const items = Array.from({ length: 47 }, (_, i) => \`Item \${i + 1}\`);
  const pagination = usePagination({ totalItems: items.length, itemsPerPage: 10 });
  const visibleItems = items.slice(pagination.startIndex, pagination.endIndex);

  return (
    <div>
      {visibleItems.map(item => <div key={item}>{item}</div>)}
      <div>
        <button onClick={pagination.goToPrev} disabled={!pagination.hasPrev}>Prev</button>
        <span> Page {pagination.currentPage} of {pagination.totalPages} </span>
        <button onClick={pagination.goToNext} disabled={!pagination.hasNext}>Next</button>
      </div>
    </div>
  );
}`,
    },
  ],
};
