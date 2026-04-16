import { Module } from "../types";

export const module8: Module = {
  id: "context-state",
  title: "Context API & Global State",
  description: "Eliminate prop drilling with Context, combine with useReducer for Redux-like state, and understand context performance",
  lessons: [
    {
      id: "context-api",
      slug: "context-api",
      title: "Context API: createContext, Provider & useContext",
      content: `
# Context API: Solving Prop Drilling

Context provides a way to share values between components without passing props through every level of the tree.

\`\`\`concept
{
  "title": "When to Use Context",
  "description": "Context is designed for 'global' data: current user, theme, language, shopping cart. Not for all state — local component state should stay local.",
  "points": [
    "createContext(defaultValue) creates a context",
    "Provider wraps part of the tree and supplies the value",
    "useContext(MyContext) reads the nearest Provider's value",
    "Every context consumer re-renders when the Provider's value changes",
    "Default value only used when there's no Provider above",
    "Split contexts to limit re-renders: ThemeContext, UserContext, CartContext"
  ]
}
\`\`\`

## Complete Context Setup

\`\`\`tabs
[
  {
    "label": "Creating Context",
    "content": "// theme-context.tsx\\nimport { createContext, useContext, useState } from 'react';\\n\\ntype Theme = 'light' | 'dark';\\n\\ntype ThemeContextType = {\\n  theme: Theme;\\n  toggleTheme: () => void;\\n};\\n\\n// Default value used only when no Provider above:\\nconst ThemeContext = createContext<ThemeContextType>({\\n  theme: 'light',\\n  toggleTheme: () => {},\\n});\\n\\n// Provider component encapsulates the state logic:\\nexport function ThemeProvider({ children }: { children: React.ReactNode }) {\\n  const [theme, setTheme] = useState<Theme>('light');\\n\\n  const toggleTheme = () => {\\n    setTheme(prev => prev === 'light' ? 'dark' : 'light');\\n  };\\n\\n  return (\\n    <ThemeContext.Provider value={{ theme, toggleTheme }}>\\n      {children}\\n    </ThemeContext.Provider>\\n  );\\n}\\n\\n// Custom hook for cleaner usage:\\nexport function useTheme() {\\n  const context = useContext(ThemeContext);\\n  if (!context) throw new Error('useTheme must be used within ThemeProvider');\\n  return context;\\n}"
  },
  {
    "label": "Using Context",
    "content": "// Wrap app at the appropriate level:\\nfunction App() {\\n  return (\\n    <ThemeProvider>\\n      <Router>\\n        <Header />\\n        <Main />\\n      </Router>\\n    </ThemeProvider>\\n  );\\n}\\n\\n// Any descendant can consume it:\\nfunction Header() {\\n  const { theme, toggleTheme } = useTheme();\\n  return (\\n    <header className={\`header header--\${theme}\`}>\\n      <h1>My App</h1>\\n      <button onClick={toggleTheme}>\\n        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}\\n      </button>\\n    </header>\\n  );\\n}\\n\\n// And any deeply nested component too:\\nfunction DeepButton() {\\n  const { theme } = useTheme(); // No prop drilling!\\n  return <button className={\`btn-\${theme}\`}>Action</button>;\\n}"
  },
  {
    "label": "Context Performance",
    "content": "// PROBLEM: all consumers re-render when ANY part of context changes\\n\\n// Context splits by concern:\\nconst UserContext = createContext(null);      // user data\\nconst CartContext = createContext(null);      // cart state\\nconst ThemeContext = createContext('light');  // theme\\n\\n// Product list only re-renders on cart/user changes, not theme:\\nfunction ProductList() {\\n  const { products } = useProducts(); // its own context or prop\\n  return products.map(p => <ProductCard key={p.id} product={p} />);\\n}\\n\\n// Separate state — split context value into stable and changing parts:\\nconst CounterDispatchContext = createContext(null);  // stable\\nconst CounterStateContext = createContext(null);     // changes\\n\\n// Components that only dispatch don't re-render on state changes!"
  }
]
\`\`\`

## Context + useReducer = Lightweight Redux

\`\`\`tsx
// Full global state pattern without Redux:

const StateContext = createContext(null);
const DispatchContext = createContext(null);

const initialState = {
  user: null,
  cart: [],
  theme: 'light',
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.id !== action.payload) };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

// Separate hooks for state vs dispatch:
export const useAppState = () => useContext(StateContext);
export const useAppDispatch = () => useContext(DispatchContext);

// Components that only dispatch DON'T re-render when state changes:
function AddToCartButton({ product }) {
  const dispatch = useAppDispatch(); // DispatchContext is stable!
  return (
    <button onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}>
      Add to Cart
    </button>
  );
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the default value of a Context used for?",
      "options": ["Initial state when the Provider first renders", "The value when there is NO Provider above in the tree", "The value during SSR", "Reset value when Provider unmounts"],
      "answer": 1,
      "explanation": "The default value passed to createContext() is only used when a component tries to useContext() without a matching Provider anywhere above it in the tree."
    },
    {
      "q": "When does a useContext consumer re-render?",
      "options": ["Only when the component's local state changes", "Every time the nearest Provider's value changes", "Only when directly passed new props", "Only on initial mount"],
      "answer": 1,
      "explanation": "Any component calling useContext(MyContext) re-renders whenever the nearest MyContext.Provider's value prop changes. This is why splitting contexts by concern reduces unnecessary re-renders."
    },
    {
      "q": "Why should dispatch be in a separate context from state?",
      "options": ["Required by React", "dispatch is stable (never changes reference) — components that only dispatch won't re-render when state changes", "For security", "To enable time-travel debugging"],
      "answer": 1,
      "explanation": "dispatch from useReducer is guaranteed stable (same reference). By putting it in its own context, action-only components (like buttons) won't re-render when state changes — only when they'd need to re-render anyway."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
