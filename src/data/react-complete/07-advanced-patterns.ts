import { Module } from "../types";

export const module7: Module = {
  id: "advanced-patterns",
  title: "Advanced Patterns: HOC, Render Props, Error Boundaries & Portals",
  description: "Master Higher-Order Components, render props, error boundaries, and portals — all tested on LinkedIn assessments",
  lessons: [
    {
      id: "hoc-patterns",
      slug: "hoc-patterns",
      title: "Higher-Order Components (HOC)",
      content: `
# Higher-Order Components (HOC)

A HOC is a function that takes a component and returns a new, enhanced component. It's a **code reuse pattern**, not a React feature.

\`\`\`concept
{
  "title": "HOC Pattern",
  "description": "HOC = function(Component) → EnhancedComponent. Used to add cross-cutting concerns like logging, auth gates, loading states, or data fetching to multiple components without repeating code.",
  "points": [
    "HOC is a pure function — doesn't modify the input component",
    "Naming convention: withXxx (withAuth, withTheme, withLogger)",
    "The returned component should forward all props to the wrapped component",
    "HOCs can compose: withAuth(withLogger(Component))",
    "Hooks have largely replaced HOCs for most use cases",
    "Still important to understand for legacy codebases and LinkedIn assessment"
  ]
}
\`\`\`

## HOC Examples

\`\`\`tabs
[
  {
    "label": "withAuth HOC",
    "content": "// Gates a component behind authentication\\nfunction withAuth(WrappedComponent) {\\n  function AuthenticatedComponent(props) {\\n    const { user, loading } = useAuth();\\n\\n    if (loading) return <Spinner />;\\n    if (!user) return <Redirect to=\\"/login\\" />;\\n\\n    // Pass all props through (+ any extras from HOC):\\n    return <WrappedComponent {...props} user={user} />;\\n  }\\n\\n  // Helpful for debugging:\\n  AuthenticatedComponent.displayName =\\n    \`withAuth(\${WrappedComponent.displayName || WrappedComponent.name})\`;\\n\\n  return AuthenticatedComponent;\\n}\\n\\n// Usage:\\nconst ProtectedDashboard = withAuth(Dashboard);\\nconst ProtectedProfile = withAuth(Profile);"
  },
  {
    "label": "withFetch HOC",
    "content": "function withFetch(WrappedComponent, url) {\\n  return function FetchedComponent(props) {\\n    const [data, setData] = useState(null);\\n    const [loading, setLoading] = useState(true);\\n    const [error, setError] = useState(null);\\n\\n    useEffect(() => {\\n      fetch(url)\\n        .then(r => r.json())\\n        .then(d => { setData(d); setLoading(false); })\\n        .catch(e => { setError(e); setLoading(false); });\\n    }, []);\\n\\n    if (loading) return <Spinner />;\\n    if (error) return <ErrorMessage error={error} />;\\n    return <WrappedComponent {...props} data={data} />;\\n  };\\n}\\n\\nconst UserList = withFetch(UserTable, '/api/users');"
  },
  {
    "label": "Composing HOCs",
    "content": "// HOCs can be composed — right to left application:\\nconst enhance = compose(\\n  withAuth,\\n  withLogger,\\n  withTheme,\\n);\\n\\nconst EnhancedDashboard = enhance(Dashboard);\\n// Same as: withAuth(withLogger(withTheme(Dashboard)))\\n\\n// Or manually:\\nconst Enhanced = withAuth(withLogger(withTheme(Dashboard)));\\n\\n// Warning: HOC wrapper hell can make DevTools hard to read\\n// Prefer hooks for new code"
  }
]
\`\`\`

## HOC vs Custom Hook vs Render Prop

\`\`\`compare
{
  "left": {
    "label": "HOC approach",
    "code": "// HOC: adds capabilities to a component\\nfunction withWindowSize(Component) {\\n  return function(props) {\\n    const [size, setSize] = useState({\\n      width: window.innerWidth,\\n      height: window.innerHeight,\\n    });\\n\\n    useEffect(() => {\\n      const handler = () => setSize({\\n        width: window.innerWidth,\\n        height: window.innerHeight,\\n      });\\n      window.addEventListener('resize', handler);\\n      return () => window.removeEventListener('resize', handler);\\n    }, []);\\n\\n    return <Component {...props} windowSize={size} />;\\n  };\\n}\\n\\nconst ResponsiveChart = withWindowSize(Chart);"
  },
  "right": {
    "label": "Custom Hook approach (preferred)",
    "code": "// Custom hook: share logic without wrapping components\\nfunction useWindowSize() {\\n  const [size, setSize] = useState({\\n    width: window.innerWidth,\\n    height: window.innerHeight,\\n  });\\n\\n  useEffect(() => {\\n    const handler = () => setSize({\\n      width: window.innerWidth,\\n      height: window.innerHeight,\\n    });\\n    window.addEventListener('resize', handler);\\n    return () => window.removeEventListener('resize', handler);\\n  }, []);\\n\\n  return size;\\n}\\n\\n// Usage — no extra wrappers in DevTools:\\nfunction Chart() {\\n  const { width, height } = useWindowSize();\\n  // ...\\n}"
  }
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is a Higher-Order Component?",
      "options": ["A component that renders at the top of the tree", "A function that takes a component and returns an enhanced component", "A class component that extends another class", "A component with more than 100 lines of code"],
      "answer": 1,
      "explanation": "A HOC is a function: (Component) => EnhancedComponent. It wraps a component to add functionality without modifying the original."
    },
    {
      "q": "Why should HOCs set displayName on the returned component?",
      "options": ["It's required by React", "It makes the wrapped component name visible in React DevTools, improving debuggability", "It prevents prop drilling", "It enables server-side rendering"],
      "answer": 1,
      "explanation": "Without displayName, React DevTools shows generic names like 'Component'. Setting displayName to something like 'withAuth(Dashboard)' makes debugging much easier."
    }
  ]
}
\`\`\`
`,
    },
    {
      id: "error-boundaries-portals",
      slug: "error-boundaries-portals",
      title: "Error Boundaries & Portals",
      content: `
# Error Boundaries & Portals

Two important React features that often appear on assessments.

## Error Boundaries

Error boundaries **catch JavaScript errors** anywhere in their child component tree, log them, and display a fallback UI instead of crashing the whole app.

\`\`\`concept
{
  "title": "Error Boundaries",
  "description": "Error boundaries are class components that implement getDerivedStateFromError and/or componentDidCatch. They catch errors in children's render methods, constructors, and lifecycle methods.",
  "points": [
    "Must be class components — no hooks-based equivalent yet",
    "Catch errors in: rendering, lifecycle methods, constructors",
    "Do NOT catch: event handlers, async code, server-side rendering, errors in the boundary itself",
    "Use multiple boundaries to isolate different parts of the UI",
    "getDerivedStateFromError: update state to show fallback",
    "componentDidCatch: log the error to an error reporting service"
  ]
}
\`\`\`

\`\`\`tsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Called during render when a child throws
  // Must return the new state (or null)
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Called after render with error info
  // Good place to log to error tracking (Sentry, etc.)
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error);
    console.error('Component stack:', errorInfo.componentStack);
    // logToSentry(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      return this.props.fallback || (
        <div className="error-state">
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage — wrap sections independently:
function App() {
  return (
    <div>
      <Header />  {/* unprotected — crashes visible */}

      <ErrorBoundary fallback={<p>Widget failed to load</p>}>
        <RiskyWidget />
      </ErrorBoundary>

      <ErrorBoundary>
        <AnotherWidget />
      </ErrorBoundary>
    </div>
  );
}
\`\`\`

## What Error Boundaries Do NOT Catch

\`\`\`tsx
// Event handlers — use try/catch:
function Button() {
  const handleClick = () => {
    try {
      riskyOperation();
    } catch (err) {
      setError(err);
    }
  };
  return <button onClick={handleClick}>Click</button>;
}

// Async code — use try/catch in the async function:
useEffect(() => {
  async function load() {
    try {
      const data = await fetchData();
      setData(data);
    } catch (err) {
      setError(err);
    }
  }
  load();
}, []);
\`\`\`

## Portals

Portals render a component's output **into a different DOM node** than where the component lives in the React tree.

\`\`\`concept
{
  "title": "React Portals",
  "description": "ReactDOM.createPortal(children, domNode) renders children into domNode (outside the component's parent DOM hierarchy) while keeping them in the React component tree.",
  "points": [
    "Event bubbling still follows the React tree (not the DOM tree)",
    "Portals are used for: modals, tooltips, dropdowns, notifications",
    "The portal's React parent can still pass props and context",
    "Created with ReactDOM.createPortal(jsx, domElement)",
    "Must ensure the target DOM node exists (document.getElementById)"
  ]
}
\`\`\`

\`\`\`tsx
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  // Renders children outside the React tree hierarchy
  // but inside #modal-root (which must exist in index.html)
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')!  // target DOM node
  );
}

// index.html must have:
// <div id="root"></div>
// <div id="modal-root"></div>

// Usage — Modal is in React tree under Button, but renders in #modal-root:
function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ overflow: 'hidden' }}>  {/* This won't clip the modal! */}
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Portal Modal</h2>
        <p>This renders outside the overflow:hidden parent</p>
      </Modal>
    </div>
  );
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Error boundaries DO catch errors in...",
      "options": ["Event handlers", "setTimeout callbacks", "The render method of child components", "Async/await calls"],
      "answer": 2,
      "explanation": "Error boundaries catch errors thrown during rendering (in render methods and lifecycle methods). They do NOT catch errors in event handlers, async code, or their own render methods."
    },
    {
      "q": "When using a Portal, event bubbling follows...",
      "options": ["The DOM hierarchy (where the portal renders)", "The React component tree (where the portal is declared)", "Neither — events don't bubble out of portals", "The window object"],
      "answer": 1,
      "explanation": "Even though portals render to a different DOM node, events bubble through the React component tree. A click in a portal will bubble up to the portal's React parent, not the DOM parent."
    },
    {
      "q": "What is the most common use case for Portals?",
      "options": ["Performance optimization", "Code splitting", "Modals, tooltips, dropdowns — elements that need to escape CSS overflow/z-index constraints", "Server-side rendering"],
      "answer": 2,
      "explanation": "Portals are ideal for UI elements that must visually 'break out' of their container (overflow: hidden, z-index stacking contexts) while remaining logically part of the React component tree."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
