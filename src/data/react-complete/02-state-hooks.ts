import { Module } from "../types";

export const module2: Module = {
  id: "state-hooks",
  title: "State: useState & useReducer",
  description: "Master React state management — from basic useState to complex useReducer patterns",
  lessons: [
    {
      id: "usestate-deep",
      slug: "usestate-deep",
      title: "useState: Batching, Functional Updates & Gotchas",
      content: `
# useState: Batching, Functional Updates & Gotchas

useState is the most fundamental hook — but it has important subtleties that trip up even experienced developers.

\`\`\`concept
{
  "title": "useState Core Rules",
  "description": "State updates in React are scheduled, not immediate. Understanding this is key to avoiding subtle bugs.",
  "points": [
    "State updates are asynchronous — reading state right after setState gives the old value",
    "React batches multiple setState calls in event handlers (React 18 batches everywhere)",
    "When new state depends on old state, use the functional update form",
    "State updates trigger a re-render of the component and all its children",
    "useState preserves state between renders but resets when the component unmounts",
    "Arrays and objects in state must be replaced, not mutated"
  ]
}
\`\`\`

## Functional Updates

\`\`\`tabs
[
  {
    "label": "The Problem",
    "content": "// This LOOKS right but can produce wrong results:\\nfunction Counter() {\\n  const [count, setCount] = useState(0);\\n\\n  function handleTripleClick() {\\n    // All three read count = 0 (stale closure)\\n    setCount(count + 1); // schedules: 0 + 1 = 1\\n    setCount(count + 1); // schedules: 0 + 1 = 1 (not 2!)\\n    setCount(count + 1); // schedules: 0 + 1 = 1 (not 3!)\\n    // Result: count = 1, not 3!\\n  }\\n\\n  return <button onClick={handleTripleClick}>{count}</button>;\\n}"
  },
  {
    "label": "The Fix",
    "content": "// Use the functional update form when new state depends on old state:\\nfunction Counter() {\\n  const [count, setCount] = useState(0);\\n\\n  function handleTripleClick() {\\n    // Each receives the latest pending state:\\n    setCount(prev => prev + 1); // 0 → 1\\n    setCount(prev => prev + 1); // 1 → 2\\n    setCount(prev => prev + 1); // 2 → 3\\n    // Result: count = 3 ✓\\n  }\\n\\n  return <button onClick={handleTripleClick}>{count}</button>;\\n}"
  },
  {
    "label": "Lazy Initialization",
    "content": "// Expensive initial state? Pass a function — runs only once:\\nfunction Component() {\\n  // BAD: computeExpensiveValue() runs on every render!\\n  const [state, setState] = useState(computeExpensiveValue());\\n\\n  // GOOD: function is called only on first render:\\n  const [state, setState] = useState(() => computeExpensiveValue());\\n\\n  // Real example — reading from localStorage:\\n  const [theme, setTheme] = useState(\\n    () => localStorage.getItem('theme') ?? 'light'\\n  );\\n}"
  },
  {
    "label": "Batching (React 18)",
    "content": "// React 18 auto-batches ALL updates, including async:\\nfunction Component() {\\n  const [a, setA] = useState(0);\\n  const [b, setB] = useState(0);\\n\\n  // Before React 18: two renders inside setTimeout\\n  // React 18+: ONE render (batched automatically)\\n  setTimeout(() => {\\n    setA(1);\\n    setB(2);\\n    // Single re-render!\\n  }, 0);\\n\\n  // Opt out of batching when needed:\\n  import { flushSync } from 'react-dom';\\n  flushSync(() => setA(1)); // forces immediate render\\n  flushSync(() => setB(2)); // second immediate render\\n}"
  }
]
\`\`\`

## State with Objects and Arrays

State must be **replaced**, not mutated:

\`\`\`tabs
[
  {
    "label": "Objects",
    "content": "const [user, setUser] = useState({ name: 'Alice', age: 30 });\\n\\n// WRONG — mutates existing object, React doesn't detect change:\\nuser.name = 'Bob'; // mutating!\\nsetUser(user);    // same reference → no re-render\\n\\n// CORRECT — spread to create new object:\\nsetUser(prev => ({ ...prev, name: 'Bob' }));\\n\\n// Nested objects — must spread each level:\\nconst [form, setForm] = useState({ user: { name: '', email: '' } });\\nsetForm(prev => ({\\n  ...prev,\\n  user: { ...prev.user, name: 'Bob' }\\n}));"
  },
  {
    "label": "Arrays",
    "content": "const [items, setItems] = useState([1, 2, 3]);\\n\\n// ADD item:\\nsetItems(prev => [...prev, 4]);\\n\\n// REMOVE item (by index):\\nsetItems(prev => prev.filter((_, i) => i !== indexToRemove));\\n\\n// UPDATE item (by id):\\nsetItems(prev =>\\n  prev.map(item => item.id === targetId ? { ...item, done: true } : item)\\n);\\n\\n// WRONG — mutates the array:\\nitems.push(4);    // mutating!\\nitems.splice(0, 1); // mutating!\\nsetItems(items);   // same reference → no re-render"
  }
]
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "You call setCount(count + 1) three times in a row. How many times will the component re-render in React 18?",
      "options": ["3 times", "1 time (batched)", "0 times if count doesn't change", "Depends on the component"],
      "answer": 1,
      "explanation": "React 18 auto-batches state updates in all contexts (including event handlers, timeouts, promises). All three setCount calls are batched into a single re-render."
    },
    {
      "q": "When should you use the functional update form setState(prev => newState)?",
      "options": ["Always — it's best practice", "When new state depends on the previous state", "Only in class components", "Only inside useEffect"],
      "answer": 1,
      "explanation": "Use the functional form when the new state is derived from the previous state, to avoid stale closure bugs."
    },
    {
      "q": "What happens if you mutate state directly (e.g., state.value = 'new') and call setState with the same reference?",
      "options": ["React detects the mutation and re-renders", "React performs a deep comparison and re-renders", "React sees the same reference and may skip re-rendering", "An error is thrown"],
      "answer": 2,
      "explanation": "React uses Object.is() to compare state. If you mutate and pass the same object reference, React sees no change and may skip the re-render."
    }
  ]
}
\`\`\`
`,
      starterCode: `// Build a shopping cart using useState
// Requirements:
// 1. Add items (with name and price)
// 2. Remove items by index
// 3. Update item quantity (no mutation!)
// 4. Show total price

import { useState } from 'react';

const SAMPLE_PRODUCTS = [
  { id: 1, name: 'React Book', price: 29.99 },
  { id: 2, name: 'TypeScript Guide', price: 24.99 },
  { id: 3, name: 'Node.js Handbook', price: 19.99 },
];

function ShoppingCart() {
  const [cart, setCart] = useState([]);

  // TODO: implement addItem, removeItem, updateQuantity
  // Each cart item: { id, name, price, quantity }

  const total = 0; // TODO: calculate total

  return (
    <div>
      <h2>Products</h2>
      {SAMPLE_PRODUCTS.map(p => (
        <div key={p.id}>
          {p.name} - \${p.price}
          <button onClick={() => {/* addItem */}}>Add to Cart</button>
        </div>
      ))}
      <h2>Cart ({cart.length} items)</h2>
      {cart.map((item, idx) => (
        <div key={item.id}>
          {item.name} x {item.quantity}
          <button onClick={() => {/* removeItem */}}>Remove</button>
        </div>
      ))}
      <p>Total: \${total.toFixed(2)}</p>
    </div>
  );
}

export default ShoppingCart;`,
      solutionCode: `import { useState } from 'react';

const SAMPLE_PRODUCTS = [
  { id: 1, name: 'React Book', price: 29.99 },
  { id: 2, name: 'TypeScript Guide', price: 24.99 },
  { id: 3, name: 'Node.js Handbook', price: 19.99 },
];

function ShoppingCart() {
  const [cart, setCart] = useState([]);

  const addItem = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) { removeItem(id); return; }
    setCart(prev =>
      prev.map(item => item.id === id ? { ...item, quantity: qty } : item)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Products</h2>
      {SAMPLE_PRODUCTS.map(p => (
        <div key={p.id}>
          {p.name} - \${p.price}
          <button onClick={() => addItem(p)}>Add to Cart</button>
        </div>
      ))}
      <h2>Cart</h2>
      {cart.map(item => (
        <div key={item.id}>
          {item.name} x
          <input
            type="number"
            value={item.quantity}
            onChange={e => updateQuantity(item.id, Number(e.target.value))}
          />
          = \${(item.price * item.quantity).toFixed(2)}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <strong>Total: \${total.toFixed(2)}</strong>
    </div>
  );
}

export default ShoppingCart;`,
    },
    {
      id: "usereducer",
      slug: "usereducer",
      title: "useReducer: Complex State Logic",
      content: `
# useReducer: Complex State Logic

When state logic gets complex — multiple sub-values, state that depends on previous state in intricate ways — \`useReducer\` is the right tool.

\`\`\`concept
{
  "title": "useReducer vs useState",
  "description": "useReducer is preferred when: state is an object with multiple fields that change together, next state depends on previous state in complex ways, or state transitions follow a known set of actions.",
  "points": [
    "Same mental model as Redux — action describes what happened, reducer computes next state",
    "useReducer(reducer, initialState) → [state, dispatch]",
    "dispatch({ type: 'ACTION_NAME', payload: data })",
    "Reducer must be a pure function — no side effects",
    "Can pass dispatch down instead of many callback props (stable reference)",
    "Easier to test reducers in isolation"
  ]
}
\`\`\`

## Anatomy of useReducer

\`\`\`tsx
// 1. Define state shape
type State = {
  count: number;
  step: number;
  history: number[];
};

// 2. Define action types
type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'RESET' };

// 3. Write the reducer (pure function!)
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + state.step,
        history: [...state.history, state.count + state.step],
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - state.step,
        history: [...state.history, state.count - state.step],
      };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'RESET':
      return { count: 0, step: 1, history: [] };
    default:
      return state; // always return state for unknown actions
  }
}

// 4. Use in component
function AdvancedCounter() {
  const [state, dispatch] = useReducer(reducer, {
    count: 0, step: 1, history: [],
  });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <input
        type="number"
        value={state.step}
        onChange={e => dispatch({ type: 'SET_STEP', payload: Number(e.target.value) })}
      />
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      <p>History: {state.history.join(', ')}</p>
    </div>
  );
}
\`\`\`

## When to Use Which

\`\`\`compare
{
  "left": {
    "label": "Use useState when...",
    "code": "// Simple, independent values\\nconst [name, setName] = useState('');\\nconst [email, setEmail] = useState('');\\nconst [isOpen, setIsOpen] = useState(false);\\n\\n// Short toggle logic\\nconst toggle = () => setIsOpen(prev => !prev);\\n\\n// Independent UI state\\nconst [loading, setLoading] = useState(false);\\nconst [error, setError] = useState(null);\\nconst [data, setData] = useState(null);"
  },
  "right": {
    "label": "Use useReducer when...",
    "code": "// Multiple related values that change together\\nconst [state, dispatch] = useReducer(fetchReducer, {\\n  loading: false,\\n  error: null,\\n  data: null,\\n});\\n\\n// The reducer handles all state transitions atomically:\\ncase 'FETCH_START':\\n  return { loading: true, error: null, data: null };\\ncase 'FETCH_SUCCESS':\\n  return { loading: false, error: null, data: action.payload };\\ncase 'FETCH_ERROR':\\n  return { loading: false, error: action.error, data: null };"
  }
}
\`\`\`

## Passing dispatch Down (Context Pattern)

\`\`\`tsx
const CounterContext = React.createContext(null);

function CounterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // dispatch is always stable — won't cause unnecessary re-renders
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
}

// Deep child can dispatch without prop drilling:
function DeepButton() {
  const { dispatch } = useContext(CounterContext);
  return <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>;
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does dispatch() do?",
      "options": ["Directly updates state", "Calls the reducer with an action to compute next state", "Triggers a re-render without changing state", "Sends an action to a Redux store"],
      "answer": 1,
      "explanation": "dispatch(action) calls the reducer function with the current state and the action. The reducer returns the new state, which React stores and re-renders with."
    },
    {
      "q": "Can a reducer function have side effects (like fetch calls)?",
      "options": ["Yes, that's the main use case", "No — reducers must be pure functions", "Yes, but only async side effects", "Only if wrapped in useEffect"],
      "answer": 1,
      "explanation": "Reducers must be pure: same input always produces same output, no side effects. Side effects belong in event handlers or useEffect."
    },
    {
      "q": "What is the advantage of dispatch being stable (same reference between renders)?",
      "options": ["It's faster", "You can safely include it in useEffect dependency arrays and pass it to memoized children without causing re-renders", "It prevents state from being reset", "It makes debugging easier"],
      "answer": 1,
      "explanation": "React guarantees dispatch is stable. Unlike callback functions created in render, you can pass dispatch to memoized children (React.memo) and include it in dependency arrays without causing unnecessary effects or renders."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
