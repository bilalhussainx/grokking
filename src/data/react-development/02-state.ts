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

### Props vs State

| Props | State |
|-------|-------|
| Passed from parent | Created inside the component |
| Read-only for the component | Can be updated by the component |
| Changes trigger re-render | Changes trigger re-render |
| Flow downward | Owned locally |

### How React State Works

When you call \`useState\`, React:

1. **Stores** the value in an internal array, keyed by the order hooks are called
2. **Returns** the current value and a setter function
3. When the setter is called, React **schedules a re-render**
4. On re-render, \`useState\` returns the **updated value**

\`\`\`
// Conceptual model:
const [count, setCount] = useState(0);
// React stores: hooks[0] = 0
// Returns: [0, setterForHook0]

setCount(1);
// React updates: hooks[0] = 1
// React re-renders the component
// useState now returns: [1, setterForHook0]
\`\`\`

### The Rules of State

1. **Never mutate state directly** — always use the setter function
2. **State updates may be batched** — React can group multiple updates
3. **State updates are asynchronous** — you cannot read the new value immediately after setting
4. **Hooks must be called in the same order** — no conditionals around hooks

### Reducers: State Machines for Complex State

When state logic gets complex (multiple related values, complex transitions), \`useReducer\` provides a more structured pattern:

\`\`\`
(currentState, action) => newState
\`\`\`

Instead of scattering state updates everywhere, you define all transitions in one reducer function.

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

### Examples

\`\`\`
const counter = createReducer((state, action) => {
  switch (action.type) {
    case "INCREMENT": return { count: state.count + 1 };
    case "DECREMENT": return { count: state.count - 1 };
    default: return state;
  }
}, { count: 0 });

counter.dispatch({ type: "INCREMENT" });
counter.getState(); // => { count: 1 }
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

### Examples

\`\`\`
const light = createStateMachine({
  initial: "green",
  context: {},
  states: {
    green:  { TIMER: "yellow" },
    yellow: { TIMER: "red" },
    red:    { TIMER: "green" },
  },
});

light.getState().value; // "green"
light.send("TIMER");
light.getState().value; // "yellow"
light.send("INVALID"); // no transition — stays "yellow"
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
