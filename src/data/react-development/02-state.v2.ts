import { Module } from "../types";

export const stateModule: Module = {
  id: "state",
  title: "State Management",
  description: "Understand state management concepts by implementing useState, useReducer, and state machines from scratch.",
  lessons: [
    {
      id: "state-intro",
      slug: "state-intro",
      title: "Introduction to State",
      content: `## Understanding State in React

**State** is data that changes over time and affects what a component renders. Unlike props (which flow down from a parent), state is **owned and managed by the component itself**.

\`\`\`concept
{
  "title": "What is State?",
  "variant": "mental-model",
  "content": "Think of state as a component's short-term memory. Just like you remember if a light switch is on or off, a React component remembers its state values between renders. When state changes, React 'flips the switch' and updates what you see on screen."
}
\`\`\`

### Props vs State

| Props | State |
|-------|-------|
| Passed from parent | Created inside the component |
| Read-only for the component | Can be updated by the component |
| Changes trigger re-render | Changes trigger re-render |
| Flow downward | Owned locally |

\`\`\`quiz
{
  "title": "Props vs State Check",
  "questions": [
    {
      "question": "Which statement about props and state is TRUE?",
      "options": ["Props can be modified by the child component", "State is passed down from parent components", "Both props and state changes trigger re-renders", "State is read-only for the component"],
      "answer": 2,
      "explanation": "Both props and state changes trigger re-renders. Props are read-only to the child component, state is owned locally (not passed from parent), and state can be updated by the component itself."
    },
    {
      "question": "A form input's current value should typically be stored as:",
      "options": ["Props", "State", "A regular JavaScript variable", "A CSS class"],
      "answer": 1,
      "explanation": "Form input values that change over time should be stored in state since the component needs to 'remember' and update this value as the user types."
    },
    {
      "question": "When should you use props instead of state?",
      "options": ["When data needs to change within the component", "When data is provided by a parent component", "When you need to remember user interactions", "When you want to trigger re-renders"],
      "answer": 1,
      "explanation": "Use props when a parent component needs to pass data to a child component. Props are the mechanism for parent-to-child communication in React."
    }
  ]
}
\`\`\`

### How React State Works

When you call \`useState\`, React:

1. **Stores** the value in an internal array, keyed by the order hooks are called
2. **Returns** the current value and a setter function
3. When the setter is called, React **schedules a re-render**
4. On re-render, \`useState\` returns the **updated value**

\`\`\`trace
{
  "title": "useState in Action",
  "language": "javascript",
  "code": "function Counter() {\\n  const [count, setCount] = useState(0);\\n  \\n  function handleClick() {\\n    setCount(count + 1);\\n  }\\n  \\n  return (\\n    <button onClick={handleClick}>\\n      Count: {count}\\n    </button>\\n  );\\n}",
  "frames": [
    {
      "line": 1,
      "vars": {"count": 0},
      "note": "Initial render: useState(0) returns [0, setter]",
      "stdout": ""
    },
    {
      "line": 5,
      "vars": {"count": 0},
      "note": "User clicks button, handleClick called",
      "stdout": ""
    },
    {
      "line": 6,
      "vars": {"count": 0},
      "note": "setCount(1) scheduled - React will re-render",
      "stdout": ""
    },
    {
      "line": 1,
      "vars": {"count": 1},
      "note": "Re-render: useState now returns [1, setter]",
      "stdout": ""
    }
  ],
  "speed": 1000
}
\`\`\`

### The Rules of State

1. **Never mutate state directly** — always use the setter function
2. **State updates may be batched** — React can group multiple updates
3. **State updates are asynchronous** — you cannot read the new value immediately after setting
4. **Hooks must be called in the same order** — no conditionals around hooks

\`\`\`callout
{
  "type": "warning",
  "title": "Common Pitfall: Direct Mutation",
  "content": "Never do this: \`count = 5\` or \`count++\`. Always use the setter: \`setCount(5)\` or \`setCount(prev => prev + 1)\`. Direct mutation bypasses React's re-render mechanism, leaving your UI stale."
}
\`\`\`

### Reducers: State Machines for Complex State

When state logic gets complex (multiple related values, complex transitions), \`useReducer\` provides a more structured pattern:

\`\`\`
(currentState, action) => newState
\`\`\`

Instead of scattering state updates everywhere, you define all transitions in one reducer function.

\`\`\`steps
{
  "title": "When to Choose useReducer",
  "steps": [
    {
      "title": "Multiple State Values",
      "content": "When you have 3+ related state values that update together (like form fields, shopping cart items, or UI flags), useReducer keeps them synchronized in one place."
    },
    {
      "title": "Complex State Logic",
      "content": "If the next state depends on multiple conditions or previous values (like a game state machine or multi-step form), a reducer makes the logic explicit and testable."
    },
    {
      "title": "Predictable Updates",
      "content": "Reducers centralize all state transitions, making it easier to debug and reason about how state changes in response to different actions."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "State is a component's local memory that triggers re-renders when updated",
    "Props flow down from parents; state is owned and managed locally",
    "Always use setter functions to update state—never mutate directly",
    "State updates are asynchronous and may be batched by React",
    "useReducer provides structured state management for complex scenarios"
  ]
}
\`\`\`

In these exercises, you will build these patterns from scratch to deeply understand how React manages state internally.`,
    },
    {
      id: "state-use-state",
      slug: "use-state-simulator",
      title: "useState Simulator",
      content: `## useState Simulator

### Problem Statement

Implement a simplified version of React's \`useState\` hook system. You need to create:

1. \`createHookSystem()\` — returns \`{ useState, runComponent }\`
2. \`useState(initialValue)\` — returns \`[value, setValue]\`
3. \`runComponent(componentFn)\` — simulates rendering a component

The hook system must:
- Track state values between "renders" (calls to runComponent)
- Reset the hook index at the start of each render
- Call the component function each time state changes via setValue

### Examples

\`\`\`
const { useState, runComponent } = createHookSystem();

function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Counter");
  console.log(\`\${name}: \${count}\`);
  return { count, setCount, name, setName };
}

let result = runComponent(Counter);
// Logs: "Counter: 0"

result.setCount(1);
result = runComponent(Counter);
// Logs: "Counter: 1"
\`\`\``,
      starterCode: `function createHookSystem() {
  // TODO: Create a hook system with:
  // - An array to store hook values
  // - A cursor/index to track which hook is being called
  // - useState(initialValue) that returns [value, setter]
  // - runComponent(fn) that resets the cursor and calls fn

  function useState(initialValue) {
    // TODO
  }

  function runComponent(componentFn) {
    // TODO
  }

  return { useState, runComponent };
}

// Test cases
const { useState, runComponent } = createHookSystem();

function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  console.log(\`Count: \${count}, Step: \${step}\`);
  return { count, setCount, step, setStep };
}

let result = runComponent(Counter);
// Expected: "Count: 0, Step: 1"

result.setCount(5);
result = runComponent(Counter);
// Expected: "Count: 5, Step: 1"

result.setStep(10);
result = runComponent(Counter);
// Expected: "Count: 5, Step: 10"

// Test with functional updater
result.setCount(prev => prev + result.step);
result = runComponent(Counter);
// Expected: "Count: 15, Step: 10"

// Second component to verify isolation
const system2 = createHookSystem();
function Timer() {
  const [seconds, setSeconds] = system2.useState(0);
  console.log(\`Timer: \${seconds}s\`);
  return { seconds, setSeconds };
}

let t = system2.runComponent(Timer);
// Expected: "Timer: 0s"
t.setSeconds(30);
t = system2.runComponent(Timer);
// Expected: "Timer: 30s"
`,
      solutionCode: `function createHookSystem() {
  const hooks = [];
  let cursor = 0;

  function useState(initialValue) {
    const index = cursor;
    if (hooks[index] === undefined) {
      hooks[index] = initialValue;
    }
    const setValue = (newValue) => {
      if (typeof newValue === "function") {
        hooks[index] = newValue(hooks[index]);
      } else {
        hooks[index] = newValue;
      }
    };
    const value = hooks[index];
    cursor++;
    return [value, setValue];
  }

  function runComponent(componentFn) {
    cursor = 0;
    return componentFn();
  }

  return { useState, runComponent };
}

// Test cases
const { useState, runComponent } = createHookSystem();

function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  console.log(\`Count: \${count}, Step: \${step}\`);
  return { count, setCount, step, setStep };
}

let result = runComponent(Counter);
// Expected: "Count: 0, Step: 1"

result.setCount(5);
result = runComponent(Counter);
// Expected: "Count: 5, Step: 1"

result.setStep(10);
result = runComponent(Counter);
// Expected: "Count: 5, Step: 10"

// Test with functional updater
result.setCount(prev => prev + result.step);
result = runComponent(Counter);
// Expected: "Count: 15, Step: 10"

// Second component to verify isolation
const system2 = createHookSystem();
function Timer() {
  const [seconds, setSeconds] = system2.useState(0);
  console.log(\`Timer: \${seconds}s\`);
  return { seconds, setSeconds };
}

let t = system2.runComponent(Timer);
// Expected: "Timer: 0s"
t.setSeconds(30);
t = system2.runComponent(Timer);
// Expected: "Timer: 30s"
`,
    },
    {
      id: "state-reducer",
      slug: "state-reducer",
      title: "State Reducer",
      content: `## State Reducer

### Problem Statement

Implement a \`useReducer\` function that follows the reducer pattern: \`(state, action) => newState\`.

Create \`createReducer(reducer, initialState)\` that returns an object with:
- \`getState()\` — returns the current state
- \`dispatch(action)\` — runs the reducer with current state and action, updates state

This is the same pattern used by React's \`useReducer\` hook and Redux.

\`\`\`concept
{
  "title": "The Reducer Pattern",
  "variant": "mental-model",
  "content": "Think of a reducer as a state machine: given the current state and an action describing what happened, it computes the next state. No side effects, no mutations — just pure computation."
}
\`\`\`

### Why Reducers Matter

Reducers shine when state logic grows complex. While \`useState\` works great for independent values, reducers excel at coordinating related state changes through a single, predictable flow.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "useState — scattered logic",
    "code": "const [count, setCount] = useState(0);\\nconst [history, setHistory] = useState([]);\\n\\nfunction increment() {\\n  setCount(c => c + 1);\\n  setHistory(h => [...h, 'inc']);\\n}"
  },
  "after": {
    "label": "useReducer — centralized logic",
    "code": "const [state, dispatch] = useReducer(counterReducer, {\\n  count: 0,\\n  history: []\\n});\\n\\ndispatch({ type: 'INCREMENT' }); // single call"
  }
}
\`\`\`

### Building Your Own createReducer

Let’s implement the core mechanism step-by-step.

\`\`\`steps
{
  "title": "Implementing createReducer",
  "steps": [
    {
      "title": "1. Create closure around state",
      "content": "We need a variable that lives outside the returned object so both \`getState\` and \`dispatch\` can access it."
    },
    {
      "title": "2. Provide read access",
      "content": "\`getState()\` simply returns the current value of that closed-over variable."
    },
    {
      "title": "3. Provide write access",
      "content": "\`dispatch(action)\` calls the reducer with the current state and the action, then replaces the closed-over variable with the returned next state."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Starter: createReducer",
  "language": "javascript",
  "code": "function createReducer(reducer, initialState) {\\n  // TODO: implement\\n  return {\\n    getState() {},\\n    dispatch(action) {}\\n  };\\n}\\n\\n// tests\\nconst counter = createReducer(\\n  (state, { type }) => {\\n    switch (type) {\\n      case 'INC': return { count: state.count + 1 };\\n      case 'DEC': return { count: state.count - 1 };\\n      default:   return state;\\n    }\\n  },\\n  { count: 0 }\\n);\\n\\nconsole.log(counter.getState()); // { count: 0 }\\ncounter.dispatch({ type: 'INC' });\\nconsole.log(counter.getState()); // { count: 1 }",
  "runnable": true
}
\`\`\`

### Watching It Work

Here’s a visual trace of the reducer executing three actions.

\`\`\`trace
{
  "title": "Reducer Execution Trace",
  "language": "javascript",
  "code": "function createReducer(reducer, initialState) {\\n  let state = initialState;\\n  return {\\n    getState() { return state; },\\n    dispatch(action) {\\n      state = reducer(state, action);\\n    }\\n  };\\n}\\n\\nconst r = createReducer((s, a) => {\\n  switch (a.type) {\\n    case 'ADD': return { total: s.total + a.payload };\\n    default:    return s;\\n  }\\n}, { total: 10 });\\n\\nr.dispatch({ type: 'ADD', payload: 5 });\\nr.dispatch({ type: 'ADD', payload: 2 });\\nr.dispatch({ type: 'ADD', payload: 3 });",
  "frames": [
    { "line": 11, "vars": { "state": "{ total: 10 }" }, "note": "initial state", "stdout": "" },
    { "line": 12, "vars": { "state": "{ total: 15 }" }, "note": "after ADD 5", "stdout": "" },
    { "line": 13, "vars": { "state": "{ total: 17 }" }, "note": "after ADD 2", "stdout": "" },
    { "line": 14, "vars": { "state": "{ total: 20 }" }, "note": "after ADD 3", "stdout": "" }
  ],
  "speed": 600
}
\`\`\`

### Common Pitfalls

\`\`\`callout
{
  "type": "warning",
  "title": "Don’t mutate state",
  "content": "Always return a *new* object. Mutating the existing state breaks purity and can lead to subtle bugs when React double-invokes reducers in Strict Mode."
}
\`\`\`

\`\`\`quiz
{
  "title": "Reducer Knowledge Check",
  "questions": [
    {
      "question": "Which of the following is a valid reducer?",
      "options": [
        "(state, action) => { state.count++; return state; }",
        "(state, action) => ({ ...state, count: state.count + 1 })",
        "(state, action) => state.count = state.count + 1",
        "(state, action) => { alert(action.type); return state; }"
      ],
      "answer": 1,
      "explanation": "Reducers must be pure and return new objects. Option 2 spreads the old state and updates only the needed field."
    },
    {
      "question": "When is useReducer preferred over useState?",
      "options": [
        "Always — it’s the modern way",
        "When state has multiple sub-values that update together",
        "When you need faster re-renders",
        "When you want less boilerplate"
      ],
      "answer": 1,
      "explanation": "useReducer centralizes complex, inter-dependent state updates, making them easier to follow and test."
    },
    {
      "question": "What guarantees that dispatch identity is stable?",
      "options": [
        "React memoizes the dispatch function internally",
        "The reducer is pure",
      "initialState is immutable",
        "We use closure in createReducer"
      ],
      "answer": 0,
      "explanation": "React ensures dispatch never changes between renders, allowing child components to safely use it without extra memoization."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Reducers are pure functions: (state, action) → nextState",
    "Complex, intertwined state logic is easier to manage with reducers than scattered setState calls",
    "Dispatch has stable identity, optimizing re-renders when passed to children",
    "Always return new objects; never mutate the previous state"
  ]
}
\`\`\``,
      starterCode: `function createReducer(reducer, initialState) {
  // TODO: implement the reducer pattern
  // - Store the current state
  // - getState() returns current state
  // - dispatch(action) runs reducer(currentState, action) and updates state
}

// Test cases
const counter = createReducer((state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "INCREMENT_BY":
      return { ...state, count: state.count + action.payload };
    case "RESET":
      return { count: 0 };
    default:
      return state;
  }
}, { count: 0 });

console.log(counter.getState());
// Expected: { count: 0 }

counter.dispatch({ type: "INCREMENT" });
counter.dispatch({ type: "INCREMENT" });
counter.dispatch({ type: "INCREMENT" });
console.log(counter.getState());
// Expected: { count: 3 }

counter.dispatch({ type: "DECREMENT" });
console.log(counter.getState());
// Expected: { count: 2 }

counter.dispatch({ type: "INCREMENT_BY", payload: 10 });
console.log(counter.getState());
// Expected: { count: 12 }

counter.dispatch({ type: "RESET" });
console.log(counter.getState());
// Expected: { count: 0 }

// Test with a todo reducer
const todos = createReducer((state, action) => {
  switch (action.type) {
    case "ADD":
      return { items: [...state.items, { text: action.text, done: false }] };
    case "TOGGLE":
      return {
        items: state.items.map((item, i) =>
          i === action.index ? { ...item, done: !item.done } : item
        ),
      };
    default:
      return state;
  }
}, { items: [] });

todos.dispatch({ type: "ADD", text: "Learn React" });
todos.dispatch({ type: "ADD", text: "Build app" });
console.log(todos.getState());
// Expected: { items: [{ text: "Learn React", done: false }, { text: "Build app", done: false }] }

todos.dispatch({ type: "TOGGLE", index: 0 });
console.log(todos.getState());
// Expected: { items: [{ text: "Learn React", done: true }, { text: "Build app", done: false }] }
`,
      solutionCode: `function createReducer(reducer, initialState) {
  let state = initialState;

  return {
    getState() {
      return state;
    },
    dispatch(action) {
      state = reducer(state, action);
    },
  };
}

// Test cases
const counter = createReducer((state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "INCREMENT_BY":
      return { ...state, count: state.count + action.payload };
    case "RESET":
      return { count: 0 };
    default:
      return state;
  }
}, { count: 0 });

console.log(counter.getState());
// Expected: { count: 0 }

counter.dispatch({ type: "INCREMENT" });
counter.dispatch({ type: "INCREMENT" });
counter.dispatch({ type: "INCREMENT" });
console.log(counter.getState());
// Expected: { count: 3 }

counter.dispatch({ type: "DECREMENT" });
console.log(counter.getState());
// Expected: { count: 2 }

counter.dispatch({ type: "INCREMENT_BY", payload: 10 });
console.log(counter.getState());
// Expected: { count: 12 }

counter.dispatch({ type: "RESET" });
console.log(counter.getState());
// Expected: { count: 0 }

// Test with a todo reducer
const todos = createReducer((state, action) => {
  switch (action.type) {
    case "ADD":
      return { items: [...state.items, { text: action.text, done: false }] };
    case "TOGGLE":
      return {
        items: state.items.map((item, i) =>
          i === action.index ? { ...item, done: !item.done } : item
        ),
      };
    default:
      return state;
  }
}, { items: [] });

todos.dispatch({ type: "ADD", text: "Learn React" });
todos.dispatch({ type: "ADD", text: "Build app" });
console.log(todos.getState());
// Expected: { items: [{ text: "Learn React", done: false }, { text: "Build app", done: false }] }

todos.dispatch({ type: "TOGGLE", index: 0 });
console.log(todos.getState());
// Expected: { items: [{ text: "Learn React", done: true }, { text: "Build app", done: false }] }
`,
    },
    {
      id: "state-machine",
      slug: "counter-state-machine",
      title: "Counter State Machine",
      content: `## Counter State Machine

\`\`\`concept
{
  "title": "State Machines vs. Reducers",
  "variant": "mental-model",
  "content": "A reducer answers \\"what happens when an action fires?\\" A state machine answers \\"what happens when an action fires **while I'm in this specific state**?\\" That extra guard makes impossible transitions literally unrepresentable."
}
\`\`\`

### Problem Statement

Implement a \`createStateMachine\` function that enforces valid state transitions. Unlike a plain reducer, a state machine explicitly defines **which transitions are allowed** from each state.

The function takes a config object with:
- \`initial\` — the starting state name
- \`states\` — an object mapping state names to their allowed transitions

Each state maps event names to either:
- A string (the next state name)
- An object \`{ target, action }\` where \`action\` is a side-effect function

Return an object with:
- \`getState()\` — returns \`{ value, context }\`
- \`send(event)\` — transitions if the event is valid for the current state
- \`canSend(event)\` — returns true if the event is valid for the current state

\`\`\`playground
{
  "title": "Starter Code",
  "language": "javascript",
  "code": "function createStateMachine(config) {\\n  // TODO: implement\\n}\\n\\n// usage\\nconst light = createStateMachine({\\n  initial: \\"green\\",\\n  context: {},\\n  states: {\\n    green:  { TIMER: \\"yellow\\" },\\n    yellow: { TIMER: \\"red\\"    },\\n    red:    { TIMER: \\"green\\"  }\\n  }\\n});\\n\\nconsole.log(light.getState().value); // \\"green\\"\\nlight.send(\\"TIMER\\");\\nconsole.log(light.getState().value); // \\"yellow\\"\\nconsole.log(light.canSend(\\"INVALID\\")); // false",
  "runnable": true
}
\`\`\`

### Walk-through: Traffic-Light Example

\`\`\`steps
{
  "title": "Building the Machine",
  "steps": [
    {
      "title": "1. Parse the config",
      "content": "Store \`initial\`, \`context\`, and the \`states\` map. Pre-compute a reverse lookup so \`canSend\` is O(1)."
    },
    {
      "title": "2. Track current state",
      "content": "Keep a private variable \`current\` that always holds the state name. Never expose it directly—only via \`getState()\`."
    },
    {
      "title": "3. Validate transitions",
      "content": "In \`send(event)\` check \`states[current].hasOwnProperty(event)\`. If missing, ignore the event (no-op)."
    },
    {
      "title": "4. Execute side-effects",
      "content": "If the transition config is an object \`{target, action}\`, call \`action(context)\` before switching to \`target\`."
    }
  ]
}
\`\`\`

\`\`\`trace
{
  "title": "Trace: three TIMER events",
  "language": "javascript",
  "code": "const light = createStateMachine({\\n  initial: \\"green\\",\\n  context: { ticks: 0 },\\n  states: {\\n    green:  { TIMER: { target: \\"yellow\\", action: c => c.ticks++ } },\\n    yellow: { TIMER: { target: \\"red\\",    action: c => c.ticks++ } },\\n    red:    { TIMER: { target: \\"green\\",  action: c => c.ticks++ } }\\n  }\\n});\\n\\nlight.send(\\"TIMER\\");\\nlight.send(\\"TIMER\\");\\nlight.send(\\"TIMER\\");\\nconsole.log(light.getState());",
  "frames": [
    { "line": 11, "vars": { "current": "green", "context": { "ticks": 0 } }, "note": "initial state", "stdout": "" },
    { "line": 13, "vars": { "current": "yellow", "context": { "ticks": 1 } }, "note": "TIMER #1", "stdout": "" },
    { "line": 14, "vars": { "current": "red", "context": { "ticks": 2 } }, "note": "TIMER #2", "stdout": "" },
    { "line": 15, "vars": { "current": "green", "context": { "ticks": 3 } }, "note": "TIMER #3", "stdout": "{ value: 'green', context: { ticks: 3 } }" }
  ],
  "speed": 800
}
\`\`\`

### Counter Machine

A **Counter State Machine** is simply an FSM whose states are the integers you care about. Each \`INC\`/\`DEC\` event moves you to the adjacent number, but you can also guard the edges (e.g., never go below 0).

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Plain reducer — anything goes",
    "code": "function counterReducer(state, action) {\\n  switch (action.type) {\\n    case 'INC': return state + 1;\\n    case 'DEC': return state - 1;\\n    case 'JUMP': return action.n; // who knows if this is legal?\\n    default: return state;\\n  }\\n}"
  },
  "after": {
    "label": "State machine — only listed edges",
    "code": "const counter = createStateMachine({\\n  initial: 0,\\n  context: {},\\n  states: {\\n    0: { INC: 1 },               // no DEC from 0\\n    1: { INC: 2, DEC: 0 },\\n    2: { INC: 3, DEC: 1 },\\n    3: { DEC: 2 }                // no INC from 3\\n  }\\n});"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Quick Check",
  "questions": [
    {
      "question": "What happens when the current state has no handler for an event?",
      "options": [
        "The machine throws an error",
        "The machine silently stays in the current state",
        "The machine resets to initial state",
        "The machine picks a random next state"
      ],
      "answer": 1,
      "explanation": "By convention state machines ignore unknown events; they are no-ops so the current state is unchanged."
    },
    {
      "question": "Which best describes the Big-O cost of a transition lookup?",
      "options": [
        "O(n) in the number of states",
        "O(1) — a single object key check",
        "O(log n) using binary search",
        "O(n²) because all states must be scanned"
      ],
      "answer": 1,
      "explanation": "Each state's allowed events are stored in a hash map, so checking \`states[current][event]\` is constant time."
    },
    {
      "question": "Why prefer a state machine over a boolean flag like \`isLoading\`?",
      "options": [
        "State machines use less memory",
        "State machines prevent impossible combos like loading + error simultaneously",
        "State machines render faster in React",
        "State machines eliminate the need for useEffect"
      ],
      "answer": 1,
      "explanation": "Explicit transitions make invalid states unrepresentable, removing an entire class of bugs."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "A state machine is a reducer with guards: only explicitly listed events can move you out of the current state.",
    "Transition lookup is O(1); complexity grows with the number of states, not with data size.",
    "By ignoring invalid events, machines stay in predictable states—no 'ghost' or impossible states.",
    "Side-effects can be attached to transitions via \`{target, action}\` objects without breaking purity of the state map."
  ]
}
\`\`\``,
      starterCode: `function createStateMachine(config) {
  // TODO: implement a state machine with:
  // - current state tracking (value)
  // - context object for extended state
  // - send(event) that transitions only if the event is defined
  //   for the current state
  // - canSend(event) that checks if a transition is possible
  // - If a transition has an "action" function, call it with context
  //   and update context with the return value
}

// Test: Traffic light
const trafficLight = createStateMachine({
  initial: "green",
  context: {},
  states: {
    green:  { TIMER: "yellow" },
    yellow: { TIMER: "red" },
    red:    { TIMER: "green" },
  },
});

console.log(trafficLight.getState().value);
// Expected: "green"

trafficLight.send("TIMER");
console.log(trafficLight.getState().value);
// Expected: "yellow"

trafficLight.send("TIMER");
console.log(trafficLight.getState().value);
// Expected: "red"

trafficLight.send("INVALID_EVENT");
console.log(trafficLight.getState().value);
// Expected: "red" (no change)

console.log(trafficLight.canSend("TIMER"));
// Expected: true

console.log(trafficLight.canSend("STOP"));
// Expected: false

// Test: Counter with context actions
const counter = createStateMachine({
  initial: "active",
  context: { count: 0 },
  states: {
    active: {
      INCREMENT: {
        target: "active",
        action: (ctx) => ({ ...ctx, count: ctx.count + 1 }),
      },
      DECREMENT: {
        target: "active",
        action: (ctx) => ({ ...ctx, count: ctx.count - 1 }),
      },
      RESET: {
        target: "active",
        action: (ctx) => ({ ...ctx, count: 0 }),
      },
      DISABLE: "disabled",
    },
    disabled: {
      ENABLE: "active",
    },
  },
});

counter.send("INCREMENT");
counter.send("INCREMENT");
counter.send("INCREMENT");
console.log(counter.getState());
// Expected: { value: "active", context: { count: 3 } }

counter.send("DECREMENT");
console.log(counter.getState().context.count);
// Expected: 2

counter.send("DISABLE");
console.log(counter.getState().value);
// Expected: "disabled"

counter.send("INCREMENT"); // should be ignored in disabled state
console.log(counter.getState().context.count);
// Expected: 2 (unchanged)

counter.send("ENABLE");
counter.send("RESET");
console.log(counter.getState().context.count);
// Expected: 0
`,
      solutionCode: `function createStateMachine(config) {
  let currentState = config.initial;
  let context = config.context ? { ...config.context } : {};

  return {
    getState() {
      return { value: currentState, context };
    },
    send(event) {
      const stateConfig = config.states[currentState];
      if (!stateConfig || !(event in stateConfig)) {
        return; // invalid transition — ignore
      }

      const transition = stateConfig[event];

      if (typeof transition === "string") {
        currentState = transition;
      } else if (typeof transition === "object") {
        currentState = transition.target;
        if (typeof transition.action === "function") {
          context = transition.action(context);
        }
      }
    },
    canSend(event) {
      const stateConfig = config.states[currentState];
      return stateConfig ? event in stateConfig : false;
    },
  };
}

// Test: Traffic light
const trafficLight = createStateMachine({
  initial: "green",
  context: {},
  states: {
    green:  { TIMER: "yellow" },
    yellow: { TIMER: "red" },
    red:    { TIMER: "green" },
  },
});

console.log(trafficLight.getState().value);
// Expected: "green"

trafficLight.send("TIMER");
console.log(trafficLight.getState().value);
// Expected: "yellow"

trafficLight.send("TIMER");
console.log(trafficLight.getState().value);
// Expected: "red"

trafficLight.send("INVALID_EVENT");
console.log(trafficLight.getState().value);
// Expected: "red" (no change)

console.log(trafficLight.canSend("TIMER"));
// Expected: true

console.log(trafficLight.canSend("STOP"));
// Expected: false

// Test: Counter with context actions
const counter = createStateMachine({
  initial: "active",
  context: { count: 0 },
  states: {
    active: {
      INCREMENT: {
        target: "active",
        action: (ctx) => ({ ...ctx, count: ctx.count + 1 }),
      },
      DECREMENT: {
        target: "active",
        action: (ctx) => ({ ...ctx, count: ctx.count - 1 }),
      },
      RESET: {
        target: "active",
        action: (ctx) => ({ ...ctx, count: 0 }),
      },
      DISABLE: "disabled",
    },
    disabled: {
      ENABLE: "active",
    },
  },
});

counter.send("INCREMENT");
counter.send("INCREMENT");
counter.send("INCREMENT");
console.log(counter.getState());
// Expected: { value: "active", context: { count: 3 } }

counter.send("DECREMENT");
console.log(counter.getState().context.count);
// Expected: 2

counter.send("DISABLE");
console.log(counter.getState().value);
// Expected: "disabled"

counter.send("INCREMENT"); // should be ignored in disabled state
console.log(counter.getState().context.count);
// Expected: 2 (unchanged)

counter.send("ENABLE");
counter.send("RESET");
console.log(counter.getState().context.count);
// Expected: 0
`,
    },
  ],
};
