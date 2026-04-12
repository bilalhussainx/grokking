import { Module } from "../types";

export const componentsModule: Module = {
  id: "components",
  title: "Components & Props",
  description: "Learn component thinking, props, and composition — the building blocks of every React application.",
  lessons: [
    {
      id: "components-intro",
      slug: "components-intro",
      title: "Introduction to Components",
      content: `## Thinking in Components

Every React application is built from **components** — self-contained, reusable pieces of UI. Think of them like LEGO bricks: simple on their own, but powerful when combined.

\`\`\`concept
{
  "title": "The Component Mental Model",
  "variant": "mental-model",
  "content": "A component is a function that takes data (props) as input and returns a description of what should appear on screen. Same input, same output — always."
}
\`\`\`

### Why Components Matter

Before component-based thinking, web apps were built as monolithic HTML pages with JavaScript sprinkled on top. When something changed, you'd have to figure out which parts of the DOM to update manually. Components changed everything.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Without Components",
      "icon": "❌",
      "content": "Imagine building a dashboard with a sidebar, header, data table, and charts. In vanilla JS, you'd write one massive file managing all the state, event handlers, and DOM updates for everything. Change the sidebar? You might break the table.

\`\`\`html
<!-- Everything tangled together -->
<div id=\\"app\\">
  <div id=\\"sidebar\\">...</div>
  <div id=\\"header\\">...</div>
  <div id=\\"table\\">...</div>
</div>
<script>
  // 500+ lines managing everything
  let sidebarOpen = true;
  let tableData = [];
  let sortColumn = 'name';
  // ... nightmare to maintain
</script>
\`\`\`"
    },
    {
      "label": "With Components",
      "icon": "✅",
      "content": "Each piece is isolated. The Sidebar doesn't know or care about the DataTable. They communicate through well-defined props.

\`\`\`jsx
function App() {
  return (
    <div>
      <Sidebar items={menuItems} />
      <Header user={currentUser} />
      <DataTable data={rows} sortBy=\\"name\\" />
    </div>
  );
}
\`\`\`

Change the Sidebar implementation? The rest of the app doesn't even notice."
    }
  ]
}
\`\`\`

### Component Trees

Components form a **tree structure**. The \`App\` component sits at the root, rendering child components, which render their own children:

\`\`\`mermaid
graph TD
    App --> Header
    App --> MainContent
    App --> Footer
    Header --> Logo
    Header --> NavMenu
    MainContent --> ArticleList
    MainContent --> Sidebar
    ArticleList --> ArticleCard1[ArticleCard]
    ArticleList --> ArticleCard2[ArticleCard]
    ArticleList --> ArticleCard3[ArticleCard]

    style App fill:#4f46e5,color:#fff,stroke:none
    style Header fill:#7c3aed,color:#fff,stroke:none
    style MainContent fill:#7c3aed,color:#fff,stroke:none
    style Footer fill:#7c3aed,color:#fff,stroke:none
    style Logo fill:#a78bfa,color:#fff,stroke:none
    style NavMenu fill:#a78bfa,color:#fff,stroke:none
    style ArticleList fill:#a78bfa,color:#fff,stroke:none
    style Sidebar fill:#a78bfa,color:#fff,stroke:none
    style ArticleCard1 fill:#c4b5fd,color:#1e1b4b,stroke:none
    style ArticleCard2 fill:#c4b5fd,color:#1e1b4b,stroke:none
    style ArticleCard3 fill:#c4b5fd,color:#1e1b4b,stroke:none
\`\`\`

Data flows **downward** through this tree via props. The parent decides what to render and passes the data each child needs.

### The Four Principles

\`\`\`steps
{
  "title": "Core Component Principles",
  "steps": [
    {
      "title": "Single Responsibility",
      "content": "Each component does **one thing well**. A 'UserAvatar' displays an avatar. A 'LoginForm' handles login. Don't build a 'UserAvatarAndLoginFormAndSettings' component.\\n\\n**Rule of thumb:** If you can't describe what a component does in one sentence without using 'and', split it."
    },
    {
      "title": "Props Flow Down",
      "content": "Data moves from parent to child through props. A child never reaches up to grab data from its parent — the parent explicitly passes it down.\\n\\n\`\`\`jsx\\n// Parent decides what the child sees\\n<UserCard name=\\"Alice\\" role=\\"admin\\" />\\n\\n// Child just uses what it's given\\nfunction UserCard({ name, role }) {\\n  return <div>{name} ({role})</div>;\\n}\\n\`\`\`"
    },
    {
      "title": "Pure Rendering",
      "content": "Given the same props, a component should **always** produce the same output. No surprises, no hidden state changes during render.\\n\\nThis makes components predictable and easy to test — you know exactly what you'll get."
    },
    {
      "title": "Composition Over Inheritance",
      "content": "React never uses class inheritance to extend components. Instead, you **compose** — nest components inside each other, pass components as props, and build complex UIs from simple pieces.\\n\\n\`\`\`jsx\\n// Composition: a Dialog wraps any content\\n<Dialog>\\n  <DialogHeader title=\\"Confirm\\" />\\n  <DialogBody>\\n    <p>Are you sure?</p>\\n  </DialogBody>\\n  <DialogFooter>\\n    <Button>Yes</Button>\\n    <Button>Cancel</Button>\\n  </DialogFooter>\\n</Dialog>\\n\`\`\`"
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Real-World Intuition",
  "content": "When you look at any UI, practice breaking it into components. Open Twitter — you'll see a TweetCard component repeated in a TweetFeed, inside a MainColumn, next to a Sidebar, all wrapped in an App shell. Once you see it, you can't unsee it."
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "What is the primary way data flows in a React component tree?",
      "options": ["Sideways between siblings", "Upward from child to parent", "Downward from parent to child via props", "Through a global store only"],
      "answer": 2,
      "explanation": "React's one-way data flow means props pass data from parent components down to their children. Children never reach up to grab data."
    },
    {
      "question": "Why should each component have a single responsibility?",
      "options": ["To make the file smaller", "To make it easier to test, reuse, and maintain", "Because React enforces it", "To reduce rendering time"],
      "answer": 1,
      "explanation": "Single responsibility makes components predictable, reusable across different contexts, and easy to test in isolation. React doesn't enforce this — it's a design principle."
    },
    {
      "question": "How does React build complex UIs?",
      "options": ["Class inheritance", "Component composition", "Template strings", "Direct DOM manipulation"],
      "answer": 1,
      "explanation": "React uses composition — nesting simple components inside each other — rather than inheritance. This is more flexible and easier to reason about."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "items": [
    "Components are functions: props in, UI description out",
    "Component trees mirror your UI hierarchy — data flows downward through props",
    "Each component should have exactly one job (single responsibility)",
    "Build complex UIs by composing simple components, never through inheritance"
  ]
}
\`\`\``,
    },
    {
      id: "components-factory",
      slug: "component-factory",
      title: "Component Factory",
      content: `## Component Factory

You're going to build a mini component system from scratch. This exercise strips away React's syntax to expose the core ideas: **a component is just a function that takes props and produces output**.

\`\`\`concept
{
  "title": "Why Build This?",
  "variant": "analogy",
  "content": "Understanding React's internals makes you better at using React. It's like learning to drive stick before driving automatic — you understand what's happening under the hood, so you make better decisions."
}
\`\`\`

### What You're Building

A \`createComponent\` factory function that creates component objects with:

| Method | What It Does |
|--------|-------------|
| \`name\` | The component's display name |
| \`render(props)\` | Takes props, returns output (like React's render) |
| \`withDefaults(defaultProps)\` | Creates a new component with pre-filled defaults |

### How It Works

\`\`\`playground
{
  "title": "Try it live — Component Factory",
  "language": "javascript",
  "code": "function createComponent(name, renderFn) {\\n  return {\\n    name,\\n    render(props) {\\n      return renderFn(props);\\n    },\\n    withDefaults(defaultProps) {\\n      return createComponent(name, (props) => {\\n        return renderFn({ ...defaultProps, ...props });\\n      });\\n    },\\n  };\\n}\\n\\n// Create a Greeting component\\nconst Greeting = createComponent('Greeting', (props) => {\\n  return \`Hello, \${props.name}! You are \${props.age} years old.\`;\\n});\\n\\nconsole.log(Greeting.render({ name: 'Alice', age: 30 }));\\n\\n// Create a version with default age\\nconst DefaultGreeting = Greeting.withDefaults({ age: 25 });\\nconsole.log(DefaultGreeting.render({ name: 'Bob' }));\\n\\n// Provided props override defaults\\nconsole.log(DefaultGreeting.render({ name: 'Carol', age: 40 }));"
}
\`\`\`

\`\`\`callout
{
  "type": "concept",
  "title": "The Spread Operator is Key",
  "content": "{ ...defaultProps, ...props } merges two objects. Properties in 'props' override matching properties in 'defaultProps'. This is exactly how React's defaultProps work under the hood."
}
\`\`\`

### The \`withDefaults\` Pattern

This pattern is everywhere in React:

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Without Defaults",
    "code": "// Must pass every prop every time\\n<Button\\n  size=\\"medium\\"\\n  variant=\\"primary\\"\\n  rounded={true}\\n  onClick={handleClick}\\n>\\n  Submit\\n</Button>",
    "language": "jsx"
  },
  "after": {
    "label": "With Defaults",
    "code": "// Defaults handle the common case\\n// Only override what's different\\n<Button onClick={handleClick}>\\n  Submit\\n</Button>\\n\\n// Internally: size=\\"medium\\",\\n// variant=\\"primary\\", rounded=true",
    "language": "jsx"
  }
}
\`\`\`

\`\`\`callout
{
  "type": "gotcha",
  "title": "withDefaults Returns a NEW Component",
  "content": "withDefaults should never mutate the original component. It creates a fresh one with its own render function. The original stays unchanged. This is the immutability principle — you'll see it everywhere in React."
}
\`\`\`

### Your Task

Implement \`createComponent\` yourself. The starter code has the test cases — make them all pass.

\`\`\`collapse
{
  "title": "Hint: Object Spread Merge Behavior",
  "content": "Remember how object spread works with overlapping keys:\\n\\nconst defaults = { color: 'blue', size: 'medium' };\\nconst overrides = { size: 'large' };\\nconst merged = { ...defaults, ...overrides };\\n// Result: { color: 'blue', size: 'large' }\\n// 'size' from overrides wins\\n\\nProperties from the **last** spread win. So { ...defaultProps, ...props } means: start with defaults, override with whatever the user passes."
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "question": "What does { ...defaults, ...overrides } produce when both objects have the same key?",
      "options": ["An error", "The value from defaults wins", "The value from overrides wins", "Both values are kept in an array"],
      "answer": 2,
      "explanation": "In object spread, the last spread wins. Properties from 'overrides' replace matching properties from 'defaults'."
    }
  ]
}
\`\`\``,
      starterCode: `function createComponent(name, renderFn) {
  // TODO: Return an object with:
  // - name: the component name
  // - render(props): calls renderFn with props
  // - withDefaults(defaultProps): returns a new component
  //   that merges defaultProps with any props passed to render
}

// Test cases
const Greeting = createComponent("Greeting", (props) => {
  return \`Hello, \${props.name}! You are \${props.age} years old.\`;
});

console.log(Greeting.name);
// Expected: "Greeting"

console.log(Greeting.render({ name: "Alice", age: 30 }));
// Expected: "Hello, Alice! You are 30 years old."

const DefaultGreeting = Greeting.withDefaults({ age: 25 });
console.log(DefaultGreeting.render({ name: "Bob" }));
// Expected: "Hello, Bob! You are 25 years old."

console.log(DefaultGreeting.render({ name: "Carol", age: 40 }));
// Expected: "Hello, Carol! You are 40 years old."

const Card = createComponent("Card", (props) => {
  return \`[\${props.variant}] \${props.title}: \${props.body}\`;
});
const InfoCard = Card.withDefaults({ variant: "info", body: "No content" });
console.log(InfoCard.render({ title: "Notice" }));
// Expected: "[info] Notice: No content"
console.log(InfoCard.render({ title: "Alert", variant: "warning" }));
// Expected: "[warning] Alert: No content"
`,
      solutionCode: `function createComponent(name, renderFn) {
  return {
    name,
    render(props) {
      return renderFn(props);
    },
    withDefaults(defaultProps) {
      return createComponent(name, (props) => {
        return renderFn({ ...defaultProps, ...props });
      });
    },
  };
}

// Test cases
const Greeting = createComponent("Greeting", (props) => {
  return \`Hello, \${props.name}! You are \${props.age} years old.\`;
});

console.log(Greeting.name);
// Expected: "Greeting"

console.log(Greeting.render({ name: "Alice", age: 30 }));
// Expected: "Hello, Alice! You are 30 years old."

const DefaultGreeting = Greeting.withDefaults({ age: 25 });
console.log(DefaultGreeting.render({ name: "Bob" }));
// Expected: "Hello, Bob! You are 25 years old."

console.log(DefaultGreeting.render({ name: "Carol", age: 40 }));
// Expected: "Hello, Carol! You are 40 years old."

const Card = createComponent("Card", (props) => {
  return \`[\${props.variant}] \${props.title}: \${props.body}\`;
});
const InfoCard = Card.withDefaults({ variant: "info", body: "No content" });
console.log(InfoCard.render({ title: "Notice" }));
// Expected: "[info] Notice: No content"
console.log(InfoCard.render({ title: "Alert", variant: "warning" }));
// Expected: "[warning] Alert: No content"
`,
    },
    {
      id: "components-props-validator",
      slug: "props-validator",
      title: "Props Validator",
      content: `## Props Validator

React components can receive *any* props — there's no built-in type enforcement at runtime. That's why React created PropTypes (now replaced by TypeScript in most codebases). You're going to build your own version.

\`\`\`callout
{
  "type": "info",
  "title": "Historical Context",
  "content": "React.PropTypes shipped with React from 2013-2017. It was extracted to the 'prop-types' package in React v15.5. Today, TypeScript handles this job at compile time — but understanding runtime validation is still valuable for API boundaries, form validation, and dynamic data."
}
\`\`\`

### What You're Building

A type-checking system with these validators:

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Basic Types",
      "content": "Basic type checkers match JavaScript's 'typeof':\\n\\n\`\`\`javascript\\nPropTypes.string   // typeof value === 'string'\\nPropTypes.number   // typeof value === 'number'\\nPropTypes.bool     // typeof value === 'boolean'\\n\`\`\`\\n\\nIf a prop is present but the wrong type, the validator reports an error. If a prop is absent and not required, it's fine."
    },
    {
      "label": "Required",
      "content": "Wrapping a checker with 'required()' means the prop MUST be present:\\n\\n\`\`\`javascript\\n// 'name' MUST be a string, 'age' is optional\\nconst schema = {\\n  name: PropTypes.required(PropTypes.string),\\n  age: PropTypes.number,\\n};\\n\\nvalidate({ age: 30 });\\n// Error: 'name is required'\\n\`\`\`"
    },
    {
      "label": "Enum (oneOf)",
      "content": "'oneOf' restricts values to a specific set:\\n\\n\`\`\`javascript\\nconst schema = {\\n  role: PropTypes.oneOf(['admin', 'user', 'guest']),\\n};\\n\\nvalidate({ role: 'superadmin' });\\n// Error: 'role must be one of: admin, user, guest'\\n\`\`\`\\n\\nThis is like TypeScript's union types: 'type Role = 'admin' | 'user' | 'guest''"
    }
  ]
}
\`\`\`

### The Checker Pattern

Each checker is a simple object describing a constraint:

\`\`\`javascript
// A basic checker
{ type: "string" }

// A required checker (wraps another checker)
{ type: "string", isRequired: true }

// An enum checker
{ type: "oneOf", values: ["admin", "user"] }
\`\`\`

The \`validate\` function iterates over the schema, checks each prop against its checker, and collects errors.

\`\`\`callout
{
  "type": "best-practice",
  "title": "Collect All Errors, Don't Bail on First",
  "content": "A good validator reports ALL issues at once. If 'name' is missing AND 'age' is wrong type, report both errors — don't stop at the first one. Users hate fixing one error only to discover another."
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Bail on First Error",
    "code": "function validate(props) {\\n  for (const [key, checker] of entries) {\\n    if (hasError(props[key], checker)) {\\n      return { valid: false, error: '...' };\\n      // User only sees ONE error\\n    }\\n  }\\n}",
    "language": "javascript"
  },
  "after": {
    "label": "Collect All Errors",
    "code": "function validate(props) {\\n  const errors = [];\\n  for (const [key, checker] of entries) {\\n    if (hasError(props[key], checker)) {\\n      errors.push('...');\\n      // Keep going!\\n    }\\n  }\\n  return { valid: !errors.length, errors };\\n}",
    "language": "javascript"
  }
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "question": "Given schema { name: PropTypes.required(PropTypes.string) }, what does validate({}) return?",
      "options": [
        "{ valid: true, errors: [] }",
        "{ valid: false, errors: ['name is required'] }",
        "{ valid: false, errors: ['name must be of type string'] }",
        "It throws an error"
      ],
      "answer": 1,
      "explanation": "When a required prop is missing entirely (undefined), the error message should indicate it's required. The type check only applies when the value is actually present."
    },
    {
      "question": "What should validate({ name: 42 }) return with the same schema?",
      "options": [
        "{ valid: true, errors: [] } — 42 is present so it passes required",
        "{ valid: false, errors: ['name is required'] }",
        "{ valid: false, errors: ['name must be of type string'] }",
        "{ valid: false, errors: ['name is required', 'name must be of type string'] }"
      ],
      "answer": 2,
      "explanation": "The value IS present (not undefined), so it passes the 'required' check. But 42 is a number, not a string, so it fails the type check."
    }
  ]
}
\`\`\`

\`\`\`collapse
{
  "title": "Hint: Structuring the Checker Objects",
  "content": "Think about 'required()' as a wrapper. It takes an existing checker and adds a flag:\\n\\n\`\`\`javascript\\nPropTypes.required(PropTypes.string)\\n// Input:  { type: 'string' }\\n// Output: { type: 'string', isRequired: true }\\n\`\`\`\\n\\nUse the spread operator: '{ ...checker, isRequired: true }'\\n\\nFor 'oneOf', create a different kind of checker:\\n\\n\`\`\`javascript\\nPropTypes.oneOf(['admin', 'user'])\\n// Output: { type: 'oneOf', values: ['admin', 'user'] }\\n\`\`\`\\n\\nIn your validate function, check 'checker.type === 'oneOf'' to handle it differently from basic type checks."
}
\`\`\``,
      starterCode: `const PropTypes = {
  string: { type: "string" },
  number: { type: "number" },
  bool: { type: "boolean" },
  required(checker) {
    // TODO: return a checker marked as required
  },
  oneOf(values) {
    // TODO: return a checker that validates against a list of allowed values
  },
};

function createPropTypes(schema) {
  // TODO: return an object with a validate(props) method
  // validate should return { valid: boolean, errors: string[] }
}

// Test cases
const schema = {
  name: PropTypes.required(PropTypes.string),
  age: PropTypes.number,
  active: PropTypes.bool,
  role: PropTypes.oneOf(["admin", "user", "guest"]),
};

const validator = createPropTypes(schema);

const result1 = validator.validate({ name: "Alice", age: 30, active: true, role: "admin" });
console.log(result1);
// Expected: { valid: true, errors: [] }

const result2 = validator.validate({ age: "thirty" });
console.log(result2);
// Expected: { valid: false, errors: ["name is required", "age must be of type number"] }

const result3 = validator.validate({ name: "Bob", role: "superadmin" });
console.log(result3);
// Expected: { valid: false, errors: ["role must be one of: admin, user, guest"] }

const result4 = validator.validate({ name: 42 });
console.log(result4);
// Expected: { valid: false, errors: ["name must be of type string"] }
`,
      solutionCode: `const PropTypes = {
  string: { type: "string" },
  number: { type: "number" },
  bool: { type: "boolean" },
  required(checker) {
    return { ...checker, isRequired: true };
  },
  oneOf(values) {
    return { type: "oneOf", values };
  },
};

function createPropTypes(schema) {
  return {
    validate(props) {
      const errors = [];
      for (const [key, checker] of Object.entries(schema)) {
        const value = props[key];

        if (value === undefined || value === null) {
          if (checker.isRequired) {
            errors.push(\`\${key} is required\`);
          }
          continue;
        }

        if (checker.type === "oneOf") {
          if (!checker.values.includes(value)) {
            errors.push(\`\${key} must be one of: \${checker.values.join(", ")}\`);
          }
        } else if (typeof value !== checker.type) {
          errors.push(\`\${key} must be of type \${checker.type}\`);
        }
      }
      return { valid: errors.length === 0, errors };
    },
  };
}

// Test cases
const schema = {
  name: PropTypes.required(PropTypes.string),
  age: PropTypes.number,
  active: PropTypes.bool,
  role: PropTypes.oneOf(["admin", "user", "guest"]),
};

const validator = createPropTypes(schema);

const result1 = validator.validate({ name: "Alice", age: 30, active: true, role: "admin" });
console.log(result1);
// Expected: { valid: true, errors: [] }

const result2 = validator.validate({ age: "thirty" });
console.log(result2);
// Expected: { valid: false, errors: ["name is required", "age must be of type number"] }

const result3 = validator.validate({ name: "Bob", role: "superadmin" });
console.log(result3);
// Expected: { valid: false, errors: ["role must be one of: admin, user, guest"] }

const result4 = validator.validate({ name: 42 });
console.log(result4);
// Expected: { valid: false, errors: ["name must be of type string"] }
`,
    },
    {
      id: "components-tree-builder",
      slug: "component-tree-builder",
      title: "Component Tree Builder",
      content: `## Component Tree Builder

Now you'll build the core of how React actually works — the **virtual DOM**. Every time you write JSX like \`<div className="box">Hello</div>\`, React's compiler (Babel/SWC) transforms it into function calls. You're building those function calls.

\`\`\`concept
{
  "title": "JSX is Just Function Calls",
  "variant": "default",
  "content": "When you write <Button color=\\"blue\\">Click</Button>, the compiler turns it into:\\ncreateElement(Button, { color: 'blue' }, 'Click')\\n\\nThere's no magic — JSX is syntactic sugar for nested function calls."
}
\`\`\`

### What JSX Compiles To

\`\`\`compare
{
  "variant": "compare",
  "before": {
    "label": "What You Write (JSX)",
    "code": "<div id=\\"root\\">\\n  <h1 className=\\"title\\">Hello</h1>\\n  <p>World</p>\\n</div>",
    "language": "jsx"
  },
  "after": {
    "label": "What React Sees",
    "code": "createElement('div', { id: 'root' },\\n  createElement('h1',\\n    { className: 'title' },\\n    'Hello'\\n  ),\\n  createElement('p', null, 'World')\\n)",
    "language": "javascript"
  }
}
\`\`\`

### Your Two Functions

\`\`\`steps
{
  "title": "Building createElement and renderTree",
  "steps": [
    {
      "title": "createElement(type, props, ...children)",
      "content": "This function creates a **virtual DOM node** — a plain JavaScript object describing a UI element.\\n\\n\`\`\`javascript\\n// Returns a virtual DOM node:\\n{\\n  type: 'div',           // string tag or function component\\n  props: { id: 'root' }, // attributes (can be null → {})\\n  children: [...]        // nested elements or strings\\n}\\n\`\`\`\\n\\nNotice: the '...children' rest parameter collects all arguments after 'props' into an array."
    },
    {
      "title": "renderTree(element, depth) — String Elements",
      "content": "The simplest case: if the element is just a string (like \\"Hello\\"), return it with proper indentation.\\n\\n\`\`\`javascript\\nrenderTree('Hello', 2)\\n// Returns: '    Hello'  (4 spaces = depth 2 × 2 spaces)\\n\`\`\`"
    },
    {
      "title": "renderTree — Function Components",
      "content": "When 'type' is a function, call it with '{ ...props, children }' and render whatever it returns. This is **component resolution** — React does this every time it encounters a function component.\\n\\n\`\`\`javascript\\nfunction Welcome(props) {\\n  return createElement('h1', null, \\"Hello, \\" + props.name);\\n}\\n\\n// renderTree resolves the function:\\nrenderTree(createElement(Welcome, { name: 'Alice' }))\\n// → calls Welcome({ name: 'Alice', children: [] })\\n// → gets back createElement('h1', null, 'Hello, Alice')\\n// → renders that instead\\n\`\`\`"
    },
    {
      "title": "renderTree — HTML Tags",
      "content": "When 'type' is a string (like 'div'), render it as an HTML-like tag with attributes and recursively render children:\\n\\n\`\`\`\\n<div id=\\"root\\">\\n  <h1>\\n    Hello\\n  </h1>\\n</div>\\n\`\`\`\\n\\nProps become attributes: '{ id: 'root' }' → 'id=\\"root\\"'"
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "deep-dive",
  "title": "Why Virtual DOM?",
  "content": "Real DOM operations are slow. Creating a virtual DOM node (a plain JS object) is near-instant. React builds the entire virtual tree, diffs it against the previous one, and only touches the real DOM where things actually changed. This is React's core performance insight."
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "question": "What does createElement return?",
      "options": [
        "A real DOM element",
        "A plain JavaScript object describing the UI",
        "An HTML string",
        "A React Fiber node"
      ],
      "answer": 1,
      "explanation": "createElement returns a virtual DOM node — a lightweight JS object with type, props, and children. It doesn't touch the real DOM at all."
    },
    {
      "question": "When renderTree encounters a function type, what does it do?",
      "options": [
        "Skip it and move to children",
        "Convert the function to a string",
        "Call the function with props and render the result",
        "Create a closure for later execution"
      ],
      "answer": 2,
      "explanation": "Function components are resolved by calling them with their props (including children). The return value is then rendered recursively — this is component resolution."
    }
  ]
}
\`\`\``,
      starterCode: `function createElement(type, props, ...children) {
  // TODO: return a virtual DOM node object with type, props, and children
}

function renderTree(element, depth = 0) {
  // TODO: return a string representation of the element tree
  // - If element is a string, return it with proper indentation
  // - If element.type is a function, call it with { ...props, children }
  //   and render the returned element
  // - If element.type is a string, render as an HTML-like tag
  //   with props as attributes and render children recursively
  // Use 2-space indentation per depth level
}

// Test cases
const tree1 = createElement("div", { id: "root" },
  createElement("h1", { class: "title" }, "Hello"),
  createElement("p", null, "World")
);
console.log(renderTree(tree1));
// Expected:
// <div id="root">
//   <h1 class="title">
//     Hello
//   </h1>
//   <p>
//     World
//   </p>
// </div>

// Function components
function Welcome(props) {
  return createElement("div", { class: "welcome" },
    createElement("h1", null, \`Hello, \${props.name}!\`),
    createElement("p", null, props.message)
  );
}

const tree2 = createElement("main", null,
  createElement(Welcome, { name: "Alice", message: "Welcome aboard!" })
);
console.log(renderTree(tree2));
// Expected:
// <main>
//   <div class="welcome">
//     <h1>
//       Hello, Alice!
//     </h1>
//     <p>
//       Welcome aboard!
//     </p>
//   </div>
// </main>

// Nested composition
const tree3 = createElement("ul", null,
  createElement("li", null, "Item 1"),
  createElement("li", null, "Item 2"),
  createElement("li", null, "Item 3")
);
console.log(renderTree(tree3));
`,
      solutionCode: `function createElement(type, props, ...children) {
  return {
    type,
    props: props || {},
    children,
  };
}

function renderTree(element, depth = 0) {
  const indent = "  ".repeat(depth);

  if (typeof element === "string") {
    return indent + element;
  }

  if (typeof element.type === "function") {
    const result = element.type({ ...element.props, children: element.children });
    return renderTree(result, depth);
  }

  const propsStr = Object.entries(element.props)
    .map(([key, val]) => \` \${key}="\${val}"\`)
    .join("");

  if (element.children.length === 0) {
    return \`\${indent}<\${element.type}\${propsStr} />\`;
  }

  const childrenStr = element.children
    .map((child) => renderTree(child, depth + 1))
    .join("\\n");

  return \`\${indent}<\${element.type}\${propsStr}>\\n\${childrenStr}\\n\${indent}</\${element.type}>\`;
}

// Test cases
const tree1 = createElement("div", { id: "root" },
  createElement("h1", { class: "title" }, "Hello"),
  createElement("p", null, "World")
);
console.log(renderTree(tree1));

// Function components
function Welcome(props) {
  return createElement("div", { class: "welcome" },
    createElement("h1", null, \`Hello, \${props.name}!\`),
    createElement("p", null, props.message)
  );
}

const tree2 = createElement("main", null,
  createElement(Welcome, { name: "Alice", message: "Welcome aboard!" })
);
console.log(renderTree(tree2));

// Nested composition
const tree3 = createElement("ul", null,
  createElement("li", null, "Item 1"),
  createElement("li", null, "Item 2"),
  createElement("li", null, "Item 3")
);
console.log(renderTree(tree3));
`,
    },
  ],
};
