import { Module } from "../types";

export const componentsModule: Module = {
  id: "components",
  title: "Components & Props",
  description:
    "Learn component thinking, props, and composition — the building blocks of every React application.",
  lessons: [
    {
      id: "components-intro",
      slug: "components-intro",
      title: "Introduction to Components",
      content: `## Thinking in Components

React applications are built from **components** — self-contained, reusable pieces of UI. Each component is a function that takes **props** (input data) and returns a description of what should appear on screen.

### Why Components?

Instead of building a monolithic page, you break the UI into small, focused pieces:

| Concept | Description |
|---------|-------------|
| **Encapsulation** | Each component manages its own logic and presentation |
| **Reusability** | Build once, use everywhere with different props |
| **Composition** | Combine simple components to build complex UIs |
| **Separation of concerns** | Each component has one job |

### The Component Mental Model

Think of a component as a **factory function**:

\`\`\`
Input (props) --> Component Function --> Output (UI description)
\`\`\`

A \`Button\` component might receive \`{ label: "Submit", color: "blue" }\` as props and return a description of a styled button element.

### Component Trees

Components form a **tree structure**. A parent component renders child components, passing data down through props:

\`\`\`
App
├── Header
│   ├── Logo
│   └── NavMenu
├── MainContent
│   ├── ArticleList
│   │   ├── ArticleCard
│   │   └── ArticleCard
│   └── Sidebar
└── Footer
\`\`\`

### Key Principles

1. **Single Responsibility** — Each component does one thing well
2. **Props flow down** — Data moves from parent to child
3. **Pure rendering** — Same props always produce the same output
4. **Composition over inheritance** — Build complex UIs by combining simple components

In the following exercises, you will implement these patterns using plain JavaScript functions that simulate React's component model.`,
    },
    {
      id: "components-factory",
      slug: "component-factory",
      title: "Component Factory",
      content: `## Component Factory

### Problem Statement

Implement a \`createComponent\` factory function that simulates how React components work. The function should take a **name** and a **render function**, and return a component object.

The component object should have:
- \`name\` — the component's name
- \`render(props)\` — calls the render function with the given props and returns the result
- \`withDefaults(defaultProps)\` — returns a new component that merges default props with any passed props

### Examples

\`\`\`
const Greeting = createComponent("Greeting", (props) => {
  return \`Hello, \${props.name}! You are \${props.age} years old.\`;
});

Greeting.render({ name: "Alice", age: 30 });
// => "Hello, Alice! You are 30 years old."

const DefaultGreeting = Greeting.withDefaults({ age: 25 });
DefaultGreeting.render({ name: "Bob" });
// => "Hello, Bob! You are 25 years old."
\`\`\`

### Hints

- \`withDefaults\` should return a new component, not modify the original
- Use object spread to merge default props with provided props
- Provided props should override defaults`,
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

### Problem Statement

Implement a \`createPropTypes\` function that validates props against a schema, similar to React's PropTypes. The function takes a schema object and returns a \`validate(props)\` function.

The schema supports these type checkers:
- \`PropTypes.string\` — value must be a string
- \`PropTypes.number\` — value must be a number
- \`PropTypes.bool\` — value must be a boolean
- \`PropTypes.required(checker)\` — the prop must be present AND pass the type check
- \`PropTypes.oneOf(values)\` — value must be one of the given values

The \`validate\` function should return an object \`{ valid, errors }\` where \`errors\` is an array of error message strings.

### Examples

\`\`\`
const schema = {
  name: PropTypes.required(PropTypes.string),
  age: PropTypes.number,
  role: PropTypes.oneOf(["admin", "user"]),
};
const validator = createPropTypes(schema);

validator.validate({ name: "Alice", age: 30, role: "admin" });
// => { valid: true, errors: [] }

validator.validate({ age: "thirty" });
// => { valid: false, errors: ["name is required", "age must be of type number"] }
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

### Problem Statement

Implement a \`createElement\` function and a \`renderTree\` function that simulate React's component tree.

\`createElement(type, props, ...children)\` should return a virtual DOM node:
- \`type\` — a string (like "div") or a function (component)
- \`props\` — an object of properties (can be null)
- \`children\` — any number of child elements or strings

\`renderTree(element, depth)\` should return a string representation of the tree with indentation.

When \`type\` is a function, call it with \`{ ...props, children }\` to get the element it returns, then render that.

### Examples

\`\`\`
const tree = createElement("div", { id: "root" },
  createElement("h1", null, "Hello"),
  createElement("p", null, "World")
);
console.log(renderTree(tree));
// <div id="root">
//   <h1>Hello</h1>
//   <p>World</p>
// </div>
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
