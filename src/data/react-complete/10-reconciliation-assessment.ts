import { Module } from "../types";

export const module10: Module = {
  id: "reconciliation-assessment",
  title: "Reconciliation, Virtual DOM & LinkedIn Assessment Mastery",
  description: "Understand how React's diffing algorithm works, keys, concurrent features, and ace the LinkedIn React Skills Assessment",
  lessons: [
    {
      id: "virtual-dom-reconciliation",
      slug: "virtual-dom-reconciliation",
      title: "Virtual DOM & Reconciliation Algorithm",
      content: `
# Virtual DOM & Reconciliation

Understanding HOW React updates the DOM separates senior developers from juniors — and it's heavily tested.

\`\`\`concept
{
  "title": "The Reconciliation Process",
  "description": "React maintains a Virtual DOM (a lightweight JS representation of the real DOM). When state changes, React creates a new Virtual DOM tree and diffs it with the previous one using a heuristic O(n) algorithm.",
  "points": [
    "Virtual DOM: plain JavaScript objects representing UI (not real DOM nodes)",
    "Reconciliation: React's algorithm to determine what changed",
    "React's diffing makes TWO assumptions to achieve O(n) instead of O(n³)",
    "Assumption 1: Elements of different types produce different trees",
    "Assumption 2: Keys hint React which elements in a list are stable",
    "Committing: applying the computed diff to the real DOM"
  ]
}
\`\`\`

## React's Diffing Rules

\`\`\`tabs
[
  {
    "label": "Different Types",
    "content": "// When the root element type changes, React tears down the entire subtree\\n// and rebuilds it from scratch:\\n\\n// Before update:\\n<div>\\n  <Counter />\\n</div>\\n\\n// After update (type changed: div → span):\\n<span>\\n  <Counter />  ← Counter UNMOUNTS and remounts (state LOST!)\\n</span>\\n\\n// This means:\\n// - Switching from <div> to <section> → full remount\\n// - Switching between component types → full remount\\n// - Switching between same type → just update props"
  },
  {
    "label": "Same Type — DOM",
    "content": "// Same element type → React updates ONLY the changed attributes:\\n\\n// Before:\\n<div className=\\"before\\" title=\\"stuff\\">\\n\\n// After:\\n<div className=\\"after\\" title=\\"stuff\\">\\n// React only updates className — title and other attrs unchanged\\n\\n// Style changes: only changed properties updated:\\n// Before: style={{ color: 'red', fontWeight: 'bold' }}\\n// After:  style={{ color: 'blue', fontWeight: 'bold' }}\\n// → Only color changes in the real DOM"
  },
  {
    "label": "Lists Without Keys",
    "content": "// React diffs lists by position — WRONG without keys:\\n\\n// Before:\\n<ul>\\n  <li>Alice</li>\\n  <li>Bob</li>\\n</ul>\\n\\n// After (Alice removed from front):\\n<ul>\\n  <li>Bob</li>\\n</ul>\\n\\n// React sees: position 0 changed Alice→Bob, position 1 removed\\n// It MUTATES the first li (expensive!) instead of removing it\\n// With key=id, React correctly identifies Bob and removes Alice"
  },
  {
    "label": "Lists With Keys",
    "content": "// Keys let React match elements across renders by identity:\\n\\n// Before:\\n<ul>\\n  <li key=\\"alice\\">Alice</li>\\n  <li key=\\"bob\\">Bob</li>\\n</ul>\\n\\n// After (Alice removed):\\n<ul>\\n  <li key=\\"bob\\">Bob</li>  ← same key = same element, just moved!\\n</ul>\\n// React correctly: removes Alice's li, Bob's li is unchanged\\n\\n// Keys must be STABLE, UNIQUE among siblings, and PREDICTABLE\\n// NEVER use index as key for reorderable lists!"
  }
]
\`\`\`

## The Key Prop: Critical Rules

\`\`\`tsx
// ✓ GOOD: Stable, unique identifier
items.map(item => <Card key={item.id} data={item} />)

// ✗ BAD: Index as key for reorderable/filterable lists
items.map((item, index) => <Card key={index} data={item} />)
// Adding to front, reordering, or filtering causes wrong component reuse!

// ✓ Index IS OK for:
//   - Static lists that never change order or length
//   - Purely presentational items with no internal state

// Key trick: force a component to remount by changing its key
// This is intentional — resetting all internal state:
<UserForm key={selectedUserId} userId={selectedUserId} />
// Changing selectedUserId causes UserForm to fully remount (state reset)
// Useful instead of complex useEffect cleanup
\`\`\`

## Render vs Commit vs Commit (Three Phases)

\`\`\`mermaid
graph LR
  A[Trigger] --> B[Render Phase]
  B --> C[Reconciliation / Diff]
  C --> D[Commit Phase]
  D --> E[Real DOM Updated]
  E --> F[useLayoutEffect]
  F --> G[Browser Paints]
  G --> H[useEffect]

  style B fill:#fbbf24,color:#000
  style D fill:#60a5fa,color:#000
  style G fill:#4ade80,color:#000
\`\`\`

- **Render Phase** (pure, may be interrupted in Concurrent Mode): React calls component functions to build new Virtual DOM tree
- **Commit Phase** (synchronous, can't be interrupted): React applies DOM changes
- **After paint**: useEffect fires
`,
    },
    {
      id: "linkedin-assessment-prep",
      slug: "linkedin-assessment-prep",
      title: "LinkedIn Assessment: Complete Q&A",
      content: `
# LinkedIn React Skills Assessment: Complete Preparation

The LinkedIn React assessment covers ~20 multiple-choice questions in 15 minutes. Here's a comprehensive review of every topic they test.

## Topic 1: Component Fundamentals

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the correct way to pass a prop called 'isActive' to a component?",
      "options": ["<Component isActive='true' />", "<Component isActive={true} />", "<Component isActive=true />", "<Component is-active={true} />"],
      "answer": 1,
      "explanation": "Booleans should be passed as JSX expressions {true}. Passing 'true' as a string would be a string, not boolean. {true} can also be written as just the prop name: <Component isActive />"
    },
    {
      "q": "A component re-renders when:",
      "options": ["Its state or props change, or its parent re-renders", "Only when state changes", "Only when props change", "Every 16ms"],
      "answer": 0,
      "explanation": "A component re-renders when: (1) setState/dispatch called, (2) its props change (parent provides new values), or (3) its parent re-renders (even if props are the same, unless wrapped in React.memo)."
    },
    {
      "q": "Which of these correctly defines a React component?",
      "options": ["A function that returns HTML", "A function that returns JSX (or null)", "A class that extends HTMLElement", "An object with a render property"],
      "answer": 1,
      "explanation": "A React component is a function (or class) that returns JSX. It can also return null to render nothing."
    }
  ]
}
\`\`\`

## Topic 2: Hooks

\`\`\`quiz
{
  "questions": [
    {
      "q": "Which hook would you use to run code ONCE when a component mounts?",
      "options": ["useEffect with no deps array", "useEffect with empty deps []", "useMemo(() => ..., [])", "useCallback(() => ..., [])"],
      "answer": 1,
      "explanation": "useEffect(() => { ... }, []) with an empty dependency array runs once after the initial mount and the cleanup runs on unmount."
    },
    {
      "q": "What is the correct way to update state based on the previous state?",
      "options": ["setState(state + 1)", "setState(prev => prev + 1)", "state = state + 1; setState(state)", "setState({ ...state, count: state.count + 1 })"],
      "answer": 1,
      "explanation": "Use the functional update form setState(prev => ...) when new state depends on old state. This avoids stale closure bugs with batched updates."
    },
    {
      "q": "Which statement about useEffect is FALSE?",
      "options": [
        "useEffect runs after the browser paint",
        "useEffect can return a cleanup function",
        "useEffect with [] runs on every state change",
        "useEffect's dependencies should include all reactive values used"
      ],
      "answer": 2,
      "explanation": "FALSE: useEffect with [] runs ONCE after mount, not on every state change. That would be useEffect with no dependency array."
    },
    {
      "q": "What does useRef NOT do?",
      "options": ["Store mutable values across renders", "Trigger re-renders when .current changes", "Hold a reference to a DOM element", "Persist values across re-renders"],
      "answer": 1,
      "explanation": "Updating ref.current does NOT trigger a re-render. This is the key distinction between ref and state."
    }
  ]
}
\`\`\`

## Topic 3: State & Events

\`\`\`quiz
{
  "questions": [
    {
      "q": "How do you prevent a form from refreshing the page on submit?",
      "options": ["return false from the handler", "e.preventDefault()", "e.stopPropagation()", "Using type='button' on the submit button"],
      "answer": 1,
      "explanation": "e.preventDefault() prevents the browser's default form submission behavior (page reload). e.stopPropagation() prevents event bubbling but doesn't prevent the default."
    },
    {
      "q": "React event handlers receive:",
      "options": ["Native DOM events", "Synthetic Events — React's cross-browser event wrapper", "Custom React event objects", "jQuery event objects"],
      "answer": 1,
      "explanation": "React wraps native events in SyntheticEvent for cross-browser compatibility. They have the same interface as native events but are pooled for performance."
    }
  ]
}
\`\`\`

## Topic 4: Lists, Keys & Conditional Rendering

\`\`\`quiz
{
  "questions": [
    {
      "q": "What happens when you use array index as a key for a list that can be reordered?",
      "options": ["Nothing — keys are just hints", "Components may be incorrectly reused, causing state bugs and unnecessary re-renders", "React throws an error", "Items will be sorted automatically"],
      "answer": 1,
      "explanation": "Keys by index break reconciliation when items are added to the front, removed, or reordered. Components with internal state may render stale data."
    },
    {
      "q": "Which is the CORRECT way to conditionally render a component?",
      "options": [
        "{if (show) <Component />}",
        "{show === true && <Component />}",
        "{show ? <Component /> : null}",
        "Both B and C are correct"
      ],
      "answer": 3,
      "explanation": "Both {show && <Component />} and {show ? <Component /> : null} are correct. The difference: if show is 0 (falsy), {0 && ...} renders '0', while {0 ? ... : null} renders nothing. Use ternary for safety with non-boolean values."
    }
  ]
}
\`\`\`

## Topic 5: Advanced Concepts

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is prop drilling?",
      "options": ["Passing a prop through multiple intermediate components that don't use it themselves", "Drilling into a prop to access nested values", "A performance optimization technique", "Mutating props in child components"],
      "answer": 0,
      "explanation": "Prop drilling is passing props through many component levels to reach a deeply nested component. Context API or state management libraries solve this."
    },
    {
      "q": "React.memo is equivalent to which class component feature?",
      "options": ["shouldComponentUpdate returning false always", "PureComponent", "React.Component with no shouldComponentUpdate", "getDerivedStateFromProps"],
      "answer": 1,
      "explanation": "React.memo performs the same optimization as PureComponent — a shallow comparison of props to skip unnecessary re-renders."
    },
    {
      "q": "Where in the component tree should the state live?",
      "options": ["Always at the root", "In the closest common ancestor of all components that need it (lifting state up)", "In every component that displays it", "In a global variable"],
      "answer": 1,
      "explanation": "State should be lifted to the lowest common ancestor of components that share it. This is called 'lifting state up' — a core React pattern."
    },
    {
      "q": "What is the purpose of keys in React lists?",
      "options": ["Styling list items", "Helping React identify which items have changed, been added, or removed", "Making list items clickable", "Enforcing unique component names"],
      "answer": 1,
      "explanation": "Keys help React's reconciliation algorithm match elements across renders. Without keys, React relies on position which causes bugs when items are added/removed/reordered."
    }
  ]
}
\`\`\`

## Quick Reference: All Hooks

\`\`\`concept
{
  "title": "Complete Hook Reference",
  "description": "Every built-in React hook you need to know",
  "points": [
    "useState(initial) → [state, setState] — local component state",
    "useReducer(reducer, init) → [state, dispatch] — complex state logic",
    "useEffect(fn, deps) → cleanup — side effects after render",
    "useLayoutEffect(fn, deps) → cleanup — side effects before paint",
    "useRef(initial) → { current } — mutable value, DOM access",
    "useCallback(fn, deps) → memoized fn — stable function reference",
    "useMemo(() => value, deps) → cached value — expensive computations",
    "useContext(Context) → value — read context value",
    "useImperativeHandle(ref, () => api, deps) — customize ref API",
    "useTransition() → [isPending, startTransition] — non-urgent updates",
    "useDeferredValue(value) → deferred — low-priority render",
    "useId() → id — stable unique IDs for accessibility",
    "useSyncExternalStore(subscribe, getSnapshot) — external store subscription"
  ]
}
\`\`\`

\`\`\`takeaways
["React's reconciliation algorithm is O(n) using two key heuristics: type changes = full remount, keys = stable identity", "Keys must be stable, unique among siblings, and predictable — never use index for reorderable lists", "Changing a component's key forces it to fully remount (intentional reset pattern)", "The render phase can be interrupted in Concurrent Mode — keep it pure!", "LinkedIn assessment focuses on: hooks rules, setState async behavior, keys, controlled inputs, Context, memo, and lifecycle equivalents"]
\`\`\`
`,
    },
  ],
};
