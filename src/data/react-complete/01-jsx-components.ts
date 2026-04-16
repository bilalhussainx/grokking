import { Module } from "../types";

export const module1: Module = {
  id: "jsx-components",
  title: "JSX & Components Deep Dive",
  description: "Master JSX transformation, functional vs class components, fragments, and the component mental model",
  lessons: [
    {
      id: "jsx-transform",
      slug: "jsx-transform",
      title: "How JSX Works: The Transform",
      content: `
# How JSX Works: The Transform

JSX is **syntactic sugar** — it's not HTML, not a template language. Every JSX expression compiles to a JavaScript function call.

\`\`\`concept
{
  "title": "JSX → JavaScript",
  "description": "Babel (or the React 17+ automatic transform) converts every JSX tag into a React.createElement() call — or the new _jsx() call. Understanding this is foundational.",
  "points": [
    "JSX is not valid JavaScript — it must be compiled",
    "Before React 17: every file using JSX needed import React from 'react'",
    "After React 17 automatic transform: no explicit import needed",
    "JSX expressions must return a single root element (or Fragment)",
    "className not class, htmlFor not for — JSX uses DOM property names"
  ]
}
\`\`\`

## Classic Transform (React 16 and below)

\`\`\`tsx
// What you write:
const element = <h1 className="title">Hello, {name}!</h1>;

// What Babel compiles it to:
const element = React.createElement(
  "h1",
  { className: "title" },
  "Hello, ",
  name,
  "!"
);
\`\`\`

## New Automatic Transform (React 17+)

\`\`\`tsx
// What you write:
const element = <h1>Hello</h1>;

// What the compiler produces (no React import needed):
import { jsx as _jsx } from "react/jsx-runtime";
const element = _jsx("h1", { children: "Hello" });
\`\`\`

## JSX Rules You MUST Know

\`\`\`tabs
[
  {
    "label": "Single Root",
    "content": "// ERROR — two siblings at root level\\nreturn (\\n  <h1>Title</h1>\\n  <p>Paragraph</p>\\n);\\n\\n// OK — wrapped in div\\nreturn (\\n  <div>\\n    <h1>Title</h1>\\n    <p>Paragraph</p>\\n  </div>\\n);\\n\\n// OK — Fragment (no extra DOM node)\\nreturn (\\n  <>\\n    <h1>Title</h1>\\n    <p>Paragraph</p>\\n  </>\\n);"
  },
  {
    "label": "Expressions",
    "content": "// Curly braces for JS expressions\\nreturn (\\n  <div>\\n    <p>{user.name}</p>\\n    <p>{isLoggedIn ? 'Welcome!' : 'Please sign in'}</p>\\n    <p>{count * 2}</p>\\n    {items.map(item => <li key={item.id}>{item.name}</li>)}\\n  </div>\\n);\\n\\n// Statements don't work — must use expressions\\n// BAD: {if (x) ...}\\n// GOOD: {x && <span>...</span>}"
  },
  {
    "label": "Attributes",
    "content": "// HTML attribute → JSX prop name changes:\\n// class         → className\\n// for           → htmlFor\\n// tabindex      → tabIndex\\n// onclick       → onClick\\n// style string  → style object\\n\\n<input\\n  className=\\"input\\"\\n  htmlFor=\\"email\\"\\n  tabIndex={0}\\n  onClick={handleClick}\\n  style={{ color: 'red', fontSize: 16 }}\\n/>"
  },
  {
    "label": "Self-Closing",
    "content": "// In JSX, void elements MUST be self-closed:\\n<input />        // OK\\n<input>         // ERROR\\n<br />           // OK\\n<img src=\\"/x.png\\" alt=\\"X\\" />  // OK\\n\\n// Custom components too:\\n<MyComponent />\\n<MyComponent></MyComponent>  // also OK"
  }
]
\`\`\`

## Fragments

Fragments let you return multiple elements without adding extra DOM nodes.

\`\`\`tsx
// Short syntax (can't accept props):
return (
  <>
    <dt>Term</dt>
    <dd>Definition</dd>
  </>
);

// Long syntax (needed when Fragment needs a key):
return items.map(item => (
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.definition}</dd>
  </React.Fragment>
));
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does JSX compile to in classic React (pre-17)?",
      "options": ["HTML strings", "React.createElement() calls", "Virtual DOM nodes directly", "Template literals"],
      "answer": 1,
      "explanation": "JSX is syntactic sugar for React.createElement(type, props, ...children) calls."
    },
    {
      "q": "Which attribute name change is CORRECT in JSX?",
      "options": ["class → className", "for → forHtml", "tabindex → tab-index", "onclick → on-click"],
      "answer": 0,
      "explanation": "JSX uses DOM property names: class → className, for → htmlFor (not forHtml)."
    },
    {
      "q": "When do you need React.Fragment with a key prop instead of the <> shorthand?",
      "options": ["Never — <> accepts key", "When rendering lists of fragments", "When nesting fragments", "When using TypeScript"],
      "answer": 1,
      "explanation": "The <> shorthand cannot accept props including key. Use <React.Fragment key={x}> when mapping over items that return fragments."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["JSX compiles to React.createElement() or _jsx() — it's not HTML", "Use className not class, htmlFor not for", "JSX requires a single root element — use <> Fragment to avoid extra DOM nodes", "Fragments with keys need the long React.Fragment syntax", "React 17+ automatic transform removes the need to import React in every file"]
\`\`\`
`,
      starterCode: `// Exercise: Fix the broken JSX below
// There are 4 JSX errors — find and fix them all

function BrokenComponent() {
  const user = { name: "Alice", age: 30 };

  return (
    <div class="container">
      <label for="name">Name:</label>
      <input type="text" id="name" />
      <p>Age: user.age</p>
      <button onclick={() => alert("Hello")}>Click me</button>
    </div>
  );
}

export default BrokenComponent;`,
      solutionCode: `// Fixed JSX
function BrokenComponent() {
  const user = { name: "Alice", age: 30 };

  return (
    <div className="container">       {/* class → className */}
      <label htmlFor="name">Name:</label>  {/* for → htmlFor */}
      <input type="text" id="name" />
      <p>Age: {user.age}</p>           {/* expression needs curly braces */}
      <button onClick={() => alert("Hello")}>Click me</button>  {/* onclick → onClick */}
    </div>
  );
}

export default BrokenComponent;`,
    },
    {
      id: "functional-vs-class",
      slug: "functional-vs-class",
      title: "Functional vs Class Components",
      content: `
# Functional vs Class Components

React supports two component styles. **Functional components are the modern standard** — class components are legacy but still tested on LinkedIn assessments.

\`\`\`concept
{
  "title": "Two Component Styles",
  "description": "Functional components (introduced as stateful with Hooks in React 16.8) are now preferred. Class components are still valid but no longer recommended for new code.",
  "points": [
    "Functional: plain JS functions that return JSX",
    "Class: extend React.Component, use this.state and lifecycle methods",
    "Hooks replaced most class component use cases",
    "Error boundaries still require class components (no hook equivalent yet)",
    "Both can receive props and render UI"
  ]
}
\`\`\`

## Side-by-Side Comparison

\`\`\`compare
{
  "left": {
    "label": "Functional Component",
    "code": "import { useState, useEffect } from 'react';\\n\\nfunction Counter({ initialCount = 0 }) {\\n  const [count, setCount] = useState(initialCount);\\n\\n  useEffect(() => {\\n    document.title = \`Count: \${count}\`;\\n    return () => { document.title = 'App'; };\\n  }, [count]);\\n\\n  return (\\n    <div>\\n      <p>Count: {count}</p>\\n      <button onClick={() => setCount(c => c + 1)}>\\n        Increment\\n      </button>\\n    </div>\\n  );\\n}\\n\\nexport default Counter;"
  },
  "right": {
    "label": "Class Component (equivalent)",
    "code": "import { Component } from 'react';\\n\\nclass Counter extends Component {\\n  constructor(props) {\\n    super(props);\\n    this.state = { count: props.initialCount || 0 };\\n  }\\n\\n  componentDidMount() {\\n    document.title = \`Count: \${this.state.count}\`;\\n  }\\n\\n  componentDidUpdate(_, prevState) {\\n    if (prevState.count !== this.state.count) {\\n      document.title = \`Count: \${this.state.count}\`;\\n    }\\n  }\\n\\n  componentWillUnmount() {\\n    document.title = 'App';\\n  }\\n\\n  render() {\\n    return (\\n      <div>\\n        <p>Count: {this.state.count}</p>\\n        <button onClick={() =>\\n          this.setState(s => ({ count: s.count + 1 }))\\n        }>\\n          Increment\\n        </button>\\n      </div>\\n    );\\n  }\\n}"
  }
}
\`\`\`

## Class Component Lifecycle (Must Know for Assessment)

\`\`\`mermaid
graph TD
  A[constructor] --> B[render]
  B --> C[componentDidMount]
  C --> D{update?}
  D -- props/state change --> E[render]
  E --> F[componentDidUpdate]
  F --> D
  D -- unmount --> G[componentWillUnmount]

  style A fill:#4ade80,color:#000
  style C fill:#60a5fa,color:#000
  style G fill:#f87171,color:#000
\`\`\`

## Key Class Component APIs

\`\`\`tabs
[
  {
    "label": "this.setState",
    "content": "// setState is ASYNCHRONOUS\\nthis.setState({ count: 1 });\\nconsole.log(this.state.count); // may still be old value!\\n\\n// Use functional form for state that depends on previous state:\\nthis.setState(prevState => ({\\n  count: prevState.count + 1\\n}));\\n\\n// Callback runs after state is applied:\\nthis.setState({ count: 1 }, () => {\\n  console.log('Now updated:', this.state.count); // 1\\n});"
  },
  {
    "label": "shouldComponentUpdate",
    "content": "// Return false to skip a re-render\\nshouldComponentUpdate(nextProps, nextState) {\\n  return nextProps.value !== this.props.value;\\n}\\n\\n// PureComponent does shallow comparison automatically:\\nclass MyComp extends React.PureComponent {\\n  // automatically implements shouldComponentUpdate\\n  // with shallow prop/state comparison\\n  render() { return <div>{this.props.value}</div>; }\\n}"
  },
  {
    "label": "getDerivedStateFromProps",
    "content": "// Static method — runs before every render\\n// Use sparingly! Usually a code smell.\\nstatic getDerivedStateFromProps(props, state) {\\n  if (props.resetCount !== state.prevResetCount) {\\n    return {\\n      count: 0,\\n      prevResetCount: props.resetCount,\\n    };\\n  }\\n  return null; // null = no state change\\n}"
  },
  {
    "label": "Error Boundaries",
    "content": "// Still REQUIRES a class component (no hooks equivalent)\\nclass ErrorBoundary extends React.Component {\\n  state = { hasError: false, error: null };\\n\\n  static getDerivedStateFromError(error) {\\n    return { hasError: true, error };\\n  }\\n\\n  componentDidCatch(error, errorInfo) {\\n    logErrorToService(error, errorInfo.componentStack);\\n  }\\n\\n  render() {\\n    if (this.state.hasError) {\\n      return <h2>Something went wrong.</h2>;\\n    }\\n    return this.props.children;\\n  }\\n}"
  }
]
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Which lifecycle method runs AFTER a component's DOM output is committed for the first time?",
      "options": ["constructor", "render", "componentDidMount", "componentWillMount"],
      "answer": 2,
      "explanation": "componentDidMount fires once after the initial render is committed to the DOM. It's the right place for data fetching, subscriptions, etc."
    },
    {
      "q": "What does PureComponent do differently than Component?",
      "options": ["It prevents all re-renders", "It does a shallow comparison of props and state in shouldComponentUpdate", "It deep-compares props and state", "It memoizes the render output"],
      "answer": 1,
      "explanation": "PureComponent implements shouldComponentUpdate with a shallow comparison of props and state, preventing unnecessary re-renders when nothing has changed."
    },
    {
      "q": "Error Boundaries require which type of component?",
      "options": ["Functional components with useError hook", "Class components", "Any component with try-catch", "Components wrapped in React.memo"],
      "answer": 1,
      "explanation": "Error boundaries must be class components implementing getDerivedStateFromError and/or componentDidCatch. There is no hooks-based error boundary yet."
    }
  ]
}
\`\`\`
`,
    },
    {
      id: "props-children-patterns",
      slug: "props-children-patterns",
      title: "Props, Children & Component Patterns",
      content: `
# Props, Children & Component Patterns

Props are how components communicate. Understanding props deeply — including children, default props, and prop validation — is essential for the assessment.

\`\`\`concept
{
  "title": "Props Are Read-Only",
  "description": "Props flow one way: parent → child. A component must NEVER modify its own props. This is one of React's core rules.",
  "points": [
    "Props are the function's parameters",
    "Destructure props for cleaner code",
    "children is a special prop for nested JSX",
    "Default props via ES6 default parameters",
    "PropTypes for runtime type checking (JS only)",
    "TypeScript interfaces for compile-time checking"
  ]
}
\`\`\`

## Props Patterns

\`\`\`tabs
[
  {
    "label": "Basic Props",
    "content": "// Props as function parameters\\nfunction Button({ label, onClick, disabled = false, variant = 'primary' }) {\\n  return (\\n    <button\\n      onClick={onClick}\\n      disabled={disabled}\\n      className={\`btn btn-\${variant}\`}\\n    >\\n      {label}\\n    </button>\\n  );\\n}\\n\\n// Usage:\\n<Button label=\\"Save\\" onClick={handleSave} />\\n<Button label=\\"Delete\\" onClick={handleDelete} variant=\\"danger\\" />"
  },
  {
    "label": "children Prop",
    "content": "// children is everything between opening/closing tags\\nfunction Card({ title, children, footer }) {\\n  return (\\n    <div className=\\"card\\">\\n      <div className=\\"card-header\\">{title}</div>\\n      <div className=\\"card-body\\">{children}</div>\\n      {footer && <div className=\\"card-footer\\">{footer}</div>}\\n    </div>\\n  );\\n}\\n\\n// Usage:\\n<Card title=\\"Profile\\" footer={<button>Edit</button>}>\\n  <p>Name: Alice</p>\\n  <p>Role: Engineer</p>\\n</Card>"
  },
  {
    "label": "Spread Props",
    "content": "// Forward all props to an element (useful for wrappers)\\nfunction Input({ label, ...inputProps }) {\\n  return (\\n    <label>\\n      {label}\\n      <input {...inputProps} />\\n    </label>\\n  );\\n}\\n\\n// Usage — all standard input attributes work:\\n<Input\\n  label=\\"Email\\"\\n  type=\\"email\\"\\n  value={email}\\n  onChange={e => setEmail(e.target.value)}\\n  placeholder=\\"you@example.com\\"\\n  required\\n/>"
  },
  {
    "label": "PropTypes",
    "content": "import PropTypes from 'prop-types';\\n\\nfunction UserCard({ name, age, role, onContact }) {\\n  return <div>{name} ({age}) - {role}</div>;\\n}\\n\\nUserCard.propTypes = {\\n  name: PropTypes.string.isRequired,\\n  age: PropTypes.number,\\n  role: PropTypes.oneOf(['admin', 'user', 'guest']),\\n  onContact: PropTypes.func.isRequired,\\n};\\n\\nUserCard.defaultProps = {\\n  age: null,\\n  role: 'user',\\n};"
  }
]
\`\`\`

## Render Props Pattern

\`\`\`tsx
// Render prop: a prop whose value is a function that returns JSX
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  );
}

// Usage:
<MouseTracker render={({ x, y }) => (
  <p>Mouse is at {x}, {y}</p>
)} />

// children-as-function (equivalent pattern):
function MouseTracker({ children }) { ... }
<MouseTracker>{({ x, y }) => <p>{x}, {y}</p>}</MouseTracker>
\`\`\`

## Compound Components Pattern

\`\`\`tsx
// Parent manages state, children are decoupled UI pieces
const TabsContext = React.createContext(null);

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
};

Tabs.Tab = function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      className={activeTab === id ? 'active' : ''}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === id ? <div>{children}</div> : null;
};

// Usage — clean and flexible:
<Tabs defaultTab="profile">
  <Tabs.List>
    <Tabs.Tab id="profile">Profile</Tabs.Tab>
    <Tabs.Tab id="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="profile"><ProfileForm /></Tabs.Panel>
  <Tabs.Panel id="settings"><SettingsForm /></Tabs.Panel>
</Tabs>
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Can a component directly modify its props?",
      "options": ["Yes, via this.props.value = x", "Yes, using useState", "No, props are read-only", "Yes, if using functional components"],
      "answer": 2,
      "explanation": "Props are immutable from the component's perspective. All React components must act like pure functions with respect to their props."
    },
    {
      "q": "What is the 'children' prop?",
      "options": ["An array of child component classes", "The JSX content passed between a component's opening and closing tags", "A list of DOM child nodes", "Props passed from child to parent"],
      "answer": 1,
      "explanation": "children is a special prop automatically set to whatever JSX appears between <Component> and </Component>."
    }
  ]
}
\`\`\`
`,
      starterCode: `// Build a reusable Card component that accepts:
// - title (string, required)
// - children (required)
// - footer (optional JSX)
// - variant ('default' | 'primary' | 'danger', default: 'default')
// - onClose (optional function — shows X button when provided)

import React from 'react';

function Card(/* your props here */) {
  // Your implementation
}

export default Card;

// Test usage:
// <Card title="Hello" variant="primary" onClose={() => alert('closed')}>
//   <p>Content goes here</p>
// </Card>`,
      solutionCode: `import React from 'react';

function Card({ title, children, footer, variant = 'default', onClose }) {
  const variantClasses = {
    default: 'border-gray-200',
    primary: 'border-blue-400',
    danger: 'border-red-400',
  };

  return (
    <div className={\`card border-2 rounded-lg p-4 \${variantClasses[variant]}\`}>
      <div className="card-header flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        {onClose && (
          <button onClick={onClose} aria-label="Close">✕</button>
        )}
      </div>
      <div className="card-body">{children}</div>
      {footer && (
        <div className="card-footer mt-3 pt-3 border-t">{footer}</div>
      )}
    </div>
  );
}

export default Card;`,
    },
  ],
};
