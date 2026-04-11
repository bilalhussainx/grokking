import { Module } from "../types";

export const projectsModule: Module = {
  id: "projects",
  title: "Applied Projects",
  description: "Put it all together with three capstone projects: a Virtual DOM, a Form Validator engine, and a Mini Router.",
  lessons: [
    {
      id: "projects-intro",
      slug: "projects-intro",
      title: "Introduction to Capstone Projects",
      content: `## Capstone Projects

You have learned React's core concepts through simplified JavaScript implementations. Now it is time to build **real systems** that combine multiple patterns.

### Project 1: Virtual DOM

React's most revolutionary idea — instead of manipulating the real DOM, build a lightweight JavaScript representation and compute the **minimum set of changes** needed.

You will implement:
- \`createElement()\` — builds virtual nodes
- \`diff(oldTree, newTree)\` — computes a patch list
- \`patch(element, patches)\` — applies changes

### Project 2: Form Validator Engine

Real-world forms need validation, error messages, touched-field tracking, and submit handling. This project combines state management, reducers, and context.

You will implement:
- Schema-based validation rules
- Field-level and form-level validation
- Dirty/touched tracking
- Async validation support (simulated)

### Project 3: Mini Router

Client-side routing matches URL paths to components and extracts parameters. This project combines pattern matching, context, and state.

You will implement:
- Path pattern matching with parameters (\`/users/:id\`)
- Route registration and resolution
- Navigation history
- Nested route support

### What Makes These "React-like"

Each project uses patterns you have already built:

| Pattern | Virtual DOM | Form Validator | Mini Router |
|---------|------------|---------------|-------------|
| Components | createElement | Field components | Route components |
| State | Tree diffing | Form state | History state |
| Effects | Patch application | Validation triggers | Navigation events |
| Context | - | Form context | Router context |
| Observer | - | Change tracking | Route listeners |

These projects are designed to run in a plain JavaScript environment. They test the **concepts** and **patterns** rather than requiring a browser.`,
    },
    {
      id: "projects-virtual-dom",
      slug: "virtual-dom",
      title: "Virtual DOM Implementation",
      content: `## Virtual DOM Implementation

\`\`\`concept
{
  "title": "What is a Virtual DOM?",
  "variant": "mental-model",
  "content": "Think of the Virtual DOM as a blueprint of your UI. Instead of rebuilding the house every time you change a door, you first update the blueprint, compare it to the old one, and then only touch the parts of the house that actually changed."
}
\`\`\`

### Problem Statement

Build a tiny Virtual DOM engine that can:

1. **Create** lightweight JavaScript objects that describe real DOM nodes
2. **Compare** two descriptions and figure out the smallest set of changes
3. **Apply** those changes to the real DOM (we'll log them instead of touching the browser)

\`\`\`steps
{
  "title": "Patch Types You'll Implement",
  "steps": [
    {
      "title": "CREATE",
      "content": "Add a brand-new node somewhere in the tree"
    },
    {
      "title": "REMOVE",
      "content": "Delete a node and its entire subtree"
    },
    {
      "title": "REPLACE",
      "content": "Swap one node for a completely different one"
    },
    {
      "title": "UPDATE_PROPS",
      "content": "Change, add, or remove attributes/properties"
    },
    {
      "title": "UPDATE_TEXT",
      "content": "Replace text content inside a node"
    }
  ]
}
\`\`\`

### Key Behaviors

- **Tag mismatch?** Entire subtree is blown away and replaced (React's reconciliation shortcut)
- **Props diffed** key-by-key: additions, removals, and value changes tracked separately
- **Children diffed** by index: position 0 vs 0, 1 vs 1, etc. (no fancy key-based matching)
- **Text nodes** compared as plain strings

\`\`\`algoviz
{
  "title": "Diffing Two Tiny Trees",
  "type": "tree",
  "data": [
    {"id": "A", "label": "div", "children": ["B", "C"]},
    {"id": "B", "label": "h1", "children": ["D"]},
    {"id": "C", "label": "p", "children": ["E"]},
    {"id": "D", "label": "text: Hello"},
    {"id": "E", "label": "text: world"}
  ],
  "frames": [
    {"highlight": ["A"], "label": "Compare root tags (both div)"},
    {"highlight": ["B"], "label": "Compare h1 → h1 (same, recurse)"},
    {"highlight": ["D"], "label": "Text changed: Hello → Hi"},
    {"highlight": ["C"], "label": "p tag unchanged, but child will be checked"},
    {"highlight": ["E"], "label": "Text unchanged: world"}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`quiz
{
  "title": "Quick Check: Diff Logic",
  "questions": [
    {
      "question": "If old node is <span> and new node is <p>, what patch is generated?",
      "options": ["UPDATE_PROPS", "REPLACE", "REMOVE + CREATE", "Nothing"],
      "answer": 1,
      "explanation": "Different tags trigger a full REPLACE of the subtree."
    },
    {
      "question": "Which patch type is used when a node's className changes?",
      "options": ["CREATE", "UPDATE_PROPS", "REPLACE", "UPDATE_TEXT"],
      "answer": 1,
      "explanation": "Props (including className) are handled by UPDATE_PROPS."
    },
    {
      "question": "In our simplified diff, how are children matched?",
      "options": ["By unique key", "By index position", "By tag name", "By content hash"],
      "answer": 1,
      "explanation": "We use index-based matching: first child vs first child, etc."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Starter Skeleton",
  "language": "javascript",
  "code": "// 1. Create a vnode\\nfunction h(tag, props, ...children) {\\n  return { tag, props, children };\\n}\\n\\n// 2. Diff two vnodes\\nfunction diff(oldTree, newTree) {\\n  const patches = [];\\n  // your logic here\\n  return patches;\\n}\\n\\n// 3. Apply patches (just log for now)\\nfunction applyPatches(patches) {\\n  patches.forEach(p => console.log(p));\\n}\\n\\n// Example usage:\\nconst oldTree = h('div', {}, h('h1', {}, 'Hello'));\\nconst newTree = h('div', {}, h('h1', {}, 'Hi'));\\nconst patches = diff(oldTree, newTree);\\napplyPatches(patches);",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Virtual DOM = plain JS objects that describe real DOM nodes",
    "Diffing finds the minimal set of changes between two descriptions",
    "Tag mismatches short-circuit into full subtree replacements",
    "Props and children are diffed separately for finer-grained patches"
  ]
}
\`\`\``,
      starterCode: `function h(tag, props, ...children) {
  // TODO: return a virtual node { tag, props, children }
  // Flatten nested children arrays
  // props defaults to {} if null
}

function diff(oldTree, newTree, path = "") {
  // TODO: compare oldTree and newTree, return an array of patches
  // Each patch: { type, path, ... }
  // Types: "CREATE", "REMOVE", "REPLACE", "UPDATE_PROPS", "UPDATE_TEXT"
  //
  // Cases:
  // 1. oldTree is null/undefined → CREATE
  // 2. newTree is null/undefined → REMOVE
  // 3. Types differ (string vs object, or different tags) → REPLACE
  // 4. Both are strings → UPDATE_TEXT if different
  // 5. Same tag → diff props + diff children recursively
}

function applyPatches(patches) {
  // TODO: return an array of human-readable operation strings
  // e.g., "CREATE <div> at root/0"
  // e.g., "UPDATE_PROPS at root: class 'old' -> 'new'"
}

// Test 1: Creating vnodes
const tree1 = h("div", { id: "app" },
  h("h1", { class: "title" }, "Hello"),
  h("p", null, "World")
);
console.log(JSON.stringify(tree1, null, 2));
// Should show the vnode structure

// Test 2: Diffing — no changes
const patches1 = diff(tree1, tree1);
console.log("No changes:", patches1.length);
// Expected: "No changes: 0"

// Test 3: Text change
const tree2 = h("div", { id: "app" },
  h("h1", { class: "title" }, "Goodbye"),
  h("p", null, "World")
);
const patches2 = diff(tree1, tree2);
console.log("Text change patches:", patches2.length);
// Expected: "Text change patches: 1"
console.log(applyPatches(patches2));
// Expected includes UPDATE_TEXT operation

// Test 4: Prop changes
const tree3 = h("div", { id: "app", class: "container" },
  h("h1", { class: "subtitle" }, "Hello"),
  h("p", null, "World")
);
const patches3 = diff(tree1, tree3);
console.log("Prop change patches:");
applyPatches(patches3).forEach(op => console.log(" ", op));

// Test 5: Add child
const tree4 = h("div", { id: "app" },
  h("h1", { class: "title" }, "Hello"),
  h("p", null, "World"),
  h("footer", null, "End")
);
const patches4 = diff(tree1, tree4);
console.log("Add child patches:");
applyPatches(patches4).forEach(op => console.log(" ", op));

// Test 6: Remove child
const tree5 = h("div", { id: "app" },
  h("h1", { class: "title" }, "Hello")
);
const patches5 = diff(tree1, tree5);
console.log("Remove child patches:");
applyPatches(patches5).forEach(op => console.log(" ", op));

// Test 7: Replace node (different tag)
const tree6 = h("div", { id: "app" },
  h("h2", { class: "title" }, "Hello"),
  h("p", null, "World")
);
const patches6 = diff(tree1, tree6);
console.log("Replace tag patches:");
applyPatches(patches6).forEach(op => console.log(" ", op));

// Test 8: Complete replacement
const tree7 = h("span", null, "Simple");
const patches7 = diff(tree1, tree7);
console.log("Full replace patches:");
applyPatches(patches7).forEach(op => console.log(" ", op));
`,
      solutionCode: `function h(tag, props, ...children) {
  return {
    tag,
    props: props || {},
    children: children.flat(),
  };
}

function diff(oldTree, newTree, path = "root") {
  const patches = [];

  if (oldTree === undefined || oldTree === null) {
    if (newTree !== undefined && newTree !== null) {
      patches.push({ type: "CREATE", path, node: newTree });
    }
    return patches;
  }

  if (newTree === undefined || newTree === null) {
    patches.push({ type: "REMOVE", path, node: oldTree });
    return patches;
  }

  if (typeof oldTree === "string" && typeof newTree === "string") {
    if (oldTree !== newTree) {
      patches.push({ type: "UPDATE_TEXT", path, oldText: oldTree, newText: newTree });
    }
    return patches;
  }

  if (typeof oldTree === "string" || typeof newTree === "string") {
    patches.push({ type: "REPLACE", path, oldNode: oldTree, newNode: newTree });
    return patches;
  }

  if (oldTree.tag !== newTree.tag) {
    patches.push({ type: "REPLACE", path, oldNode: oldTree, newNode: newTree });
    return patches;
  }

  // Diff props
  const allKeys = new Set([
    ...Object.keys(oldTree.props),
    ...Object.keys(newTree.props),
  ]);
  const propChanges = {};
  let hasChanges = false;
  for (const key of allKeys) {
    if (oldTree.props[key] !== newTree.props[key]) {
      propChanges[key] = { old: oldTree.props[key], new: newTree.props[key] };
      hasChanges = true;
    }
  }
  if (hasChanges) {
    patches.push({ type: "UPDATE_PROPS", path, changes: propChanges });
  }

  // Diff children
  const maxLen = Math.max(oldTree.children.length, newTree.children.length);
  for (let i = 0; i < maxLen; i++) {
    const childPatches = diff(
      oldTree.children[i],
      newTree.children[i],
      \`\${path}/\${i}\`
    );
    patches.push(...childPatches);
  }

  return patches;
}

function applyPatches(patches) {
  return patches.map((patch) => {
    switch (patch.type) {
      case "CREATE": {
        const desc = typeof patch.node === "string"
          ? \`"\${patch.node}"\`
          : \`<\${patch.node.tag}>\`;
        return \`CREATE \${desc} at \${patch.path}\`;
      }
      case "REMOVE": {
        const desc = typeof patch.node === "string"
          ? \`"\${patch.node}"\`
          : \`<\${patch.node.tag}>\`;
        return \`REMOVE \${desc} at \${patch.path}\`;
      }
      case "REPLACE": {
        const oldDesc = typeof patch.oldNode === "string"
          ? \`"\${patch.oldNode}"\`
          : \`<\${patch.oldNode.tag}>\`;
        const newDesc = typeof patch.newNode === "string"
          ? \`"\${patch.newNode}"\`
          : \`<\${patch.newNode.tag}>\`;
        return \`REPLACE \${oldDesc} with \${newDesc} at \${patch.path}\`;
      }
      case "UPDATE_PROPS": {
        const details = Object.entries(patch.changes)
          .map(([k, v]) => \`\${k}: '\${v.old}' -> '\${v.new}'\`)
          .join(", ");
        return \`UPDATE_PROPS at \${patch.path}: \${details}\`;
      }
      case "UPDATE_TEXT":
        return \`UPDATE_TEXT at \${patch.path}: "\${patch.oldText}" -> "\${patch.newText}"\`;
      default:
        return \`UNKNOWN at \${patch.path}\`;
    }
  });
}

// Test 1: Creating vnodes
const tree1 = h("div", { id: "app" },
  h("h1", { class: "title" }, "Hello"),
  h("p", null, "World")
);
console.log(JSON.stringify(tree1, null, 2));

// Test 2: Diffing — no changes
const patches1 = diff(tree1, tree1);
console.log("No changes:", patches1.length);
// Expected: "No changes: 0"

// Test 3: Text change
const tree2 = h("div", { id: "app" },
  h("h1", { class: "title" }, "Goodbye"),
  h("p", null, "World")
);
const patches2 = diff(tree1, tree2);
console.log("Text change patches:", patches2.length);
// Expected: "Text change patches: 1"
console.log(applyPatches(patches2));

// Test 4: Prop changes
const tree3 = h("div", { id: "app", class: "container" },
  h("h1", { class: "subtitle" }, "Hello"),
  h("p", null, "World")
);
const patches3 = diff(tree1, tree3);
console.log("Prop change patches:");
applyPatches(patches3).forEach(op => console.log(" ", op));

// Test 5: Add child
const tree4 = h("div", { id: "app" },
  h("h1", { class: "title" }, "Hello"),
  h("p", null, "World"),
  h("footer", null, "End")
);
const patches4 = diff(tree1, tree4);
console.log("Add child patches:");
applyPatches(patches4).forEach(op => console.log(" ", op));

// Test 6: Remove child
const tree5 = h("div", { id: "app" },
  h("h1", { class: "title" }, "Hello")
);
const patches5 = diff(tree1, tree5);
console.log("Remove child patches:");
applyPatches(patches5).forEach(op => console.log(" ", op));

// Test 7: Replace node (different tag)
const tree6 = h("div", { id: "app" },
  h("h2", { class: "title" }, "Hello"),
  h("p", null, "World")
);
const patches6 = diff(tree1, tree6);
console.log("Replace tag patches:");
applyPatches(patches6).forEach(op => console.log(" ", op));

// Test 8: Complete replacement
const tree7 = h("span", null, "Simple");
const patches7 = diff(tree1, tree7);
console.log("Full replace patches:");
applyPatches(patches7).forEach(op => console.log(" ", op));
`,
    },
    {
      id: "projects-form-validator",
      slug: "form-validator-engine",
      title: "Form Validator Engine",
      content: `## Form Validator Engine

### Problem Statement

Build a form validation engine that supports schema-based validation, field-level tracking, and composable validation rules.

Implement:
1. **Validation Rules** — \`required()\`, \`minLength(n)\`, \`maxLength(n)\`, \`pattern(regex, message)\`, \`email()\`, \`custom(fn, message)\`
2. **\`createFormValidator(schema)\`** — takes a schema mapping field names to arrays of rules
3. The validator provides:
   - \`validateField(name, value)\` — returns \`{ valid, errors }\`
   - \`validateAll(values)\` — validates all fields, returns \`{ valid, errors }\`
   - \`touch(name)\` — marks a field as touched
   - \`getTouched()\` — returns set of touched field names
   - \`getErrors(values)\` — returns only errors for touched fields (UX pattern)

### Examples

\`\`\`
const validator = createFormValidator({
  email: [required(), email()],
  password: [required(), minLength(8)],
});

validator.validateField("email", "");
// => { valid: false, errors: ["This field is required"] }
\`\`\``,
      starterCode: `// Validation rule factories
function required(message = "This field is required") {
  // TODO: return a rule { validate(value) -> string | null }
}

function minLength(min, message) {
  // TODO: validate string length >= min
}

function maxLength(max, message) {
  // TODO: validate string length <= max
}

function pattern(regex, message = "Invalid format") {
  // TODO: validate value matches regex
}

function email(message = "Invalid email address") {
  // TODO: validate email format
}

function custom(fn, message = "Validation failed") {
  // TODO: run custom validation function
}

function createFormValidator(schema) {
  // TODO: implement form validator with:
  // - validateField(name, value): runs all rules for a field
  // - validateAll(values): validates all fields in schema
  // - touch(name): marks field as interacted with
  // - getTouched(): returns array of touched field names
  // - getErrors(values): returns errors only for touched fields
}

// Test cases
const validator = createFormValidator({
  username: [
    required(),
    minLength(3, "Username must be at least 3 characters"),
    maxLength(20, "Username must be at most 20 characters"),
    pattern(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  ],
  email: [
    required(),
    email(),
  ],
  password: [
    required(),
    minLength(8, "Password must be at least 8 characters"),
    custom(
      (val) => /[A-Z]/.test(val) && /[0-9]/.test(val),
      "Password must contain an uppercase letter and a number"
    ),
  ],
  age: [
    required(),
    custom((val) => Number(val) >= 18, "Must be at least 18 years old"),
  ],
});

// Test 1: Valid field
const r1 = validator.validateField("username", "alice_99");
console.log(r1);
// Expected: { valid: true, errors: [] }

// Test 2: Required fails
const r2 = validator.validateField("username", "");
console.log(r2);
// Expected: { valid: false, errors: ["This field is required"] }

// Test 3: Multiple errors
const r3 = validator.validateField("password", "ab");
console.log(r3);
// Expected: { valid: false, errors: ["Password must be at least 8 characters", "Password must contain an uppercase letter and a number"] }

// Test 4: Email validation
console.log(validator.validateField("email", "bad-email"));
// Expected: { valid: false, errors: ["Invalid email address"] }

console.log(validator.validateField("email", "alice@example.com"));
// Expected: { valid: true, errors: [] }

// Test 5: Validate all
const r5 = validator.validateAll({
  username: "alice",
  email: "alice@example.com",
  password: "SecurePass1",
  age: "25",
});
console.log("All valid:", r5.valid);
// Expected: "All valid: true"

const r6 = validator.validateAll({
  username: "",
  email: "bad",
  password: "short",
  age: "15",
});
console.log("All valid:", r6.valid);
// Expected: "All valid: false"
console.log("Error count:", Object.keys(r6.errors).length);
// Expected: "Error count: 4"

// Test 6: Touched fields
validator.touch("username");
validator.touch("email");
console.log(validator.getTouched());
// Expected: ["username", "email"]

const touchedErrors = validator.getErrors({
  username: "",
  email: "bad",
  password: "short",
  age: "15",
});
console.log("Touched errors keys:", Object.keys(touchedErrors).sort().join(", "));
// Expected: "Touched errors keys: email, username"
// (password and age errors hidden because not touched)
`,
      solutionCode: `function required(message = "This field is required") {
  return {
    validate(value) {
      if (value === undefined || value === null || value === "") return message;
      return null;
    },
  };
}

function minLength(min, message) {
  const msg = message || \`Must be at least \${min} characters\`;
  return {
    validate(value) {
      if (typeof value === "string" && value.length < min) return msg;
      return null;
    },
  };
}

function maxLength(max, message) {
  const msg = message || \`Must be at most \${max} characters\`;
  return {
    validate(value) {
      if (typeof value === "string" && value.length > max) return msg;
      return null;
    },
  };
}

function pattern(regex, message = "Invalid format") {
  return {
    validate(value) {
      if (typeof value === "string" && value && !regex.test(value)) return message;
      return null;
    },
  };
}

function email(message = "Invalid email address") {
  return {
    validate(value) {
      if (typeof value === "string" && value && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
        return message;
      }
      return null;
    },
  };
}

function custom(fn, message = "Validation failed") {
  return {
    validate(value) {
      if (value !== undefined && value !== null && value !== "" && !fn(value)) {
        return message;
      }
      return null;
    },
  };
}

function createFormValidator(schema) {
  const touched = new Set();

  return {
    validateField(name, value) {
      const rules = schema[name] || [];
      const errors = [];
      for (const rule of rules) {
        const error = rule.validate(value);
        if (error) errors.push(error);
      }
      return { valid: errors.length === 0, errors };
    },

    validateAll(values) {
      const errors = {};
      let valid = true;
      for (const name of Object.keys(schema)) {
        const result = this.validateField(name, values[name]);
        if (!result.valid) {
          valid = false;
          errors[name] = result.errors;
        }
      }
      return { valid, errors };
    },

    touch(name) {
      touched.add(name);
    },

    getTouched() {
      return Array.from(touched);
    },

    getErrors(values) {
      const allResult = this.validateAll(values);
      const touchedErrors = {};
      for (const name of touched) {
        if (allResult.errors[name]) {
          touchedErrors[name] = allResult.errors[name];
        }
      }
      return touchedErrors;
    },
  };
}

// Test cases
const validator = createFormValidator({
  username: [
    required(),
    minLength(3, "Username must be at least 3 characters"),
    maxLength(20, "Username must be at most 20 characters"),
    pattern(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  ],
  email: [
    required(),
    email(),
  ],
  password: [
    required(),
    minLength(8, "Password must be at least 8 characters"),
    custom(
      (val) => /[A-Z]/.test(val) && /[0-9]/.test(val),
      "Password must contain an uppercase letter and a number"
    ),
  ],
  age: [
    required(),
    custom((val) => Number(val) >= 18, "Must be at least 18 years old"),
  ],
});

// Test 1: Valid field
const r1 = validator.validateField("username", "alice_99");
console.log(r1);
// Expected: { valid: true, errors: [] }

// Test 2: Required fails
const r2 = validator.validateField("username", "");
console.log(r2);
// Expected: { valid: false, errors: ["This field is required"] }

// Test 3: Multiple errors
const r3 = validator.validateField("password", "ab");
console.log(r3);
// Expected: { valid: false, errors: ["Password must be at least 8 characters", "Password must contain an uppercase letter and a number"] }

// Test 4: Email validation
console.log(validator.validateField("email", "bad-email"));
// Expected: { valid: false, errors: ["Invalid email address"] }

console.log(validator.validateField("email", "alice@example.com"));
// Expected: { valid: true, errors: [] }

// Test 5: Validate all
const r5 = validator.validateAll({
  username: "alice",
  email: "alice@example.com",
  password: "SecurePass1",
  age: "25",
});
console.log("All valid:", r5.valid);
// Expected: "All valid: true"

const r6 = validator.validateAll({
  username: "",
  email: "bad",
  password: "short",
  age: "15",
});
console.log("All valid:", r6.valid);
// Expected: "All valid: false"
console.log("Error count:", Object.keys(r6.errors).length);
// Expected: "Error count: 4"

// Test 6: Touched fields
validator.touch("username");
validator.touch("email");
console.log(validator.getTouched());
// Expected: ["username", "email"]

const touchedErrors = validator.getErrors({
  username: "",
  email: "bad",
  password: "short",
  age: "15",
});
console.log("Touched errors keys:", Object.keys(touchedErrors).sort().join(", "));
// Expected: "Touched errors keys: email, username"
`,
    },
    {
      id: "projects-mini-router",
      slug: "mini-router",
      title: "Mini Router",
      content: `## Mini Router

### Problem Statement

Build a client-side router that handles path matching, parameter extraction, navigation history, and nested routes.

Implement \`createRouter()\` that provides:
- \`addRoute(pattern, handler)\` — registers a route with a pattern like \`/users/:id\`
- \`navigate(path)\` — resolves the path, calls the matching handler, pushes to history
- \`back()\` — pops the history stack and navigates to the previous path
- \`getCurrentRoute()\` — returns the current matched route info
- \`getHistory()\` — returns the navigation history array

Pattern matching rules:
- \`:param\` — matches a path segment and captures it (e.g., \`:id\` matches "123")
- \`*\` — wildcard, matches anything remaining
- Exact segments must match exactly

\`\`\`concept
{
  "title": "History API: The Backbone of Client-Side Routing",
  "variant": "mental-model",
  "content": "Think of the History API as a backstage pass to the browser's URL bar. pushState() lets you silently change the URL without reloading the page, while popstate events notify you when the user hits Back/Forward. Your router listens to these events and decides which view to render."
}
\`\`\`

\`\`\`steps
{
  "title": "Route Resolution Pipeline",
  "steps": [
    {
      "title": "1. Normalize the path",
      "content": "Strip leading/trailing slashes and split into segments: \`/users/42\` → [\\"users\\", \\"42\\"]"
    },
    {
      "title": "2. Attempt pattern match",
      "content": "For each registered route, compare its pattern segments against the path segments. A \`:param\` segment matches any value and stores it under that key."
    },
    {
      "title": "3. Extract parameters",
      "content": "Build a params object: pattern \`/users/:id\` matched against \`[\\"users\\", \\"42\\"]\` yields \`{ id: \\"42\\" }\`"
    },
    {
      "title": "4. Invoke handler & update history",
      "content": "Call the matched handler with params, push the new path onto the history stack, and update current-route metadata."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Starter: createRouter skeleton",
  "language": "javascript",
  "code": "function createRouter() {\\n  const routes = [];\\n  let history = [];\\n  let currentIndex = -1;\\n\\n  function addRoute(pattern, handler) {\\n    // TODO: store pattern and handler\\n  }\\n\\n  function navigate(path) {\\n    // TODO: match path, call handler, update history\\n  }\\n\\n  function back() {\\n    // TODO: pop history and navigate backwards\\n  }\\n\\n  function getCurrentRoute() {\\n    // TODO: return current route info\\n  }\\n\\n  function getHistory() {\\n    // TODO: return history array\\n  }\\n\\n  return { addRoute, navigate, back, getCurrentRoute, getHistory };\\n}",
  "runnable": false
}
\`\`\`

\`\`\`algoviz
{
  "title": "Matching /users/42 against two routes",
  "type": "array",
  "data": ["/users/:id", "/posts/*", "/users/42"],
  "frames": [
    { "highlight": [0], "label": "Try /users/:id pattern", "stats": { "segment": 0 } },
    { "highlight": [0, 2], "label": "Segment 'users' matches exactly", "stats": { "segment": 1 } },
    { "highlight": [0, 2], "label": "Segment ':id' matches '42' → param id=42", "stats": { "segment": 2 } },
    { "highlight": [0], "label": "Full match found; stop searching", "stats": { "match": true } }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naïve string split on '/'",
    "code": "const parts = path.split('/');\\n// [\\"\\", \\"users\\", \\"42\\"]\\n// Oops—empty string at index 0"
  },
  "after": {
    "label": "Robust segment extraction",
    "code": "const parts = path\\n  .replace(/^\\\\/+|\\\\/+$/g, '')\\n  .split('/')\\n  .filter(Boolean);\\n// [\\"users\\", \\"42\\"]"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Check your understanding",
  "questions": [
    {
      "question": "Which History API method updates the URL without reloading the page?",
      "options": ["history.assign()", "history.pushState()", "history.replace()", "location.href="],
      "answer": 1,
      "explanation": "pushState() adds a new entry to the session history stack and changes the URL without a page refresh."
    },
    {
      "question": "What does the pattern \`/blog/:slug/comments/*\` match?",
      "options": ["/blog/123", "/blog/hello/comments", "/blog/hello/comments/1/2", "/blog/comments/*"],
      "answer": 2,
      "explanation": "The wildcard * consumes everything after /comments/, so any depth of trailing segments is accepted."
    },
    {
      "question": "Why keep a history array inside the router instead of relying only on browser history?",
      "options": ["To support IE11", "To enable programmatic back()", "To avoid popstate events", "To compress URLs"],
      "answer": 1,
      "explanation": "Maintaining your own stack lets you implement custom navigation logic (e.g., confirmation modals) and inspect previous routes via getHistory()."
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "RegExp vs. Segment Loop",
  "content": "Converting each pattern to a giant RegExp works, but looping over segments is easier to read, debug, and extend with custom modifiers (e.g., optional groups or regex constraints like \`:id(\\\\\\\\d+)\`)."
}
\`\`\`

\`\`\`collapse
{
  "title": "Deep Dive: Nested Routes",
  "content": "Nested routes mean patterns like \`/dashboard/users/:id\`. Resolve these by recursively slicing the remaining pathname after each match and delegating to sub-routers, or by flattening the pattern into a single regex with capture groups. Keep a parent pointer so each level can bubble up parameter objects."
}
\`\`\`

### Examples

\`\`\`playground
{
  "title": "Demo: router in action",
  "language": "javascript",
  "code": "const router = createRouter();\\n\\nrouter.addRoute(\\"/users/:id\\", (params) => {\\n  console.log(\`User profile for \\\\\${params.id}\`);\\n});\\n\\nrouter.addRoute(\\"/posts/*\\", (params, wildcard) => {\\n  console.log(\`Blog section: \\\\\${wildcard}\`);\\n});\\n\\nrouter.navigate(\\"/users/42\\");\\nrouter.navigate(\\"/posts/2024/roadmap\\");\\nrouter.back();\\nconsole.log(router.getHistory());",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Client-side routing swaps views without page reloads by intercepting URL changes via the History API.",
    "Segment-based pattern matching with :params and * wildcards gives you express-style flexibility.",
    "Maintain an internal history array so you can implement .back() and inspect past routes.",
    "A mini router is great for learning, but production apps often graduate to React Router for features like code-splitting, lazy loading, and accessibility."
  ]
}
\`\`\``,
      starterCode: `function createRouter() {
  // TODO: implement router with:
  // - routes array to store { pattern, handler, segments }
  // - history stack
  // - current route tracking
  // - addRoute(pattern, handler)
  // - navigate(path) — match route, extract params, call handler, push history
  // - back() — go to previous route
  // - getCurrentRoute() — returns { path, params, pattern, result }
  // - getHistory() — returns array of visited paths
}

function matchPath(pattern, path) {
  // TODO: match a path against a pattern
  // Returns { matched: boolean, params: {} } or { matched: false }
  // Handle :param segments and * wildcards
}

// Test matchPath
console.log(matchPath("/users/:id", "/users/42"));
// Expected: { matched: true, params: { id: "42" } }

console.log(matchPath("/users/:id", "/users"));
// Expected: { matched: false }

console.log(matchPath("/users/:id/posts/:postId", "/users/1/posts/99"));
// Expected: { matched: true, params: { id: "1", postId: "99" } }

console.log(matchPath("/files/*", "/files/docs/report.pdf"));
// Expected: { matched: true, params: { wildcard: "docs/report.pdf" } }

console.log(matchPath("/about", "/about"));
// Expected: { matched: true, params: {} }

console.log(matchPath("/about", "/contact"));
// Expected: { matched: false }

// Test Router
const router = createRouter();
const routeLog = [];

router.addRoute("/", (params) => {
  routeLog.push("Home page");
  return "Home";
});

router.addRoute("/users", (params) => {
  routeLog.push("User list");
  return "User List";
});

router.addRoute("/users/:id", (params) => {
  routeLog.push(\`User profile: \${params.id}\`);
  return \`User \${params.id}\`;
});

router.addRoute("/users/:id/posts/:postId", (params) => {
  routeLog.push(\`Post \${params.postId} by user \${params.id}\`);
  return \`Post \${params.postId}\`;
});

router.addRoute("/files/*", (params) => {
  routeLog.push(\`File: \${params.wildcard}\`);
  return \`File: \${params.wildcard}\`;
});

// Test navigation
router.navigate("/");
console.log(routeLog[routeLog.length - 1]);
// Expected: "Home page"

router.navigate("/users");
console.log(routeLog[routeLog.length - 1]);
// Expected: "User list"

router.navigate("/users/42");
console.log(routeLog[routeLog.length - 1]);
// Expected: "User profile: 42"

const current = router.getCurrentRoute();
console.log(current.path, current.params, current.result);
// Expected: "/users/42" { id: "42" } "User 42"

router.navigate("/users/42/posts/7");
console.log(routeLog[routeLog.length - 1]);
// Expected: "Post 7 by user 42"

router.navigate("/files/images/cat.png");
console.log(routeLog[routeLog.length - 1]);
// Expected: "File: images/cat.png"

// Test history
console.log(router.getHistory());
// Expected: ["/", "/users", "/users/42", "/users/42/posts/7", "/files/images/cat.png"]

// Test back navigation
router.back();
console.log(router.getCurrentRoute().path);
// Expected: "/users/42/posts/7"

router.back();
console.log(router.getCurrentRoute().path);
// Expected: "/users/42"

// Test 404
router.navigate("/unknown/path");
console.log(router.getCurrentRoute().result);
// Expected: null or "Not Found"
`,
      solutionCode: `function createRouter() {
  const routes = [];
  const history = [];
  let currentRoute = null;

  return {
    addRoute(pattern, handler) {
      routes.push({ pattern, handler });
    },

    navigate(path) {
      for (const route of routes) {
        const result = matchPath(route.pattern, path);
        if (result.matched) {
          const handlerResult = route.handler(result.params);
          currentRoute = {
            path,
            params: result.params,
            pattern: route.pattern,
            result: handlerResult,
          };
          history.push(path);
          return handlerResult;
        }
      }

      // No match — 404
      currentRoute = { path, params: {}, pattern: null, result: null };
      history.push(path);
      return null;
    },

    back() {
      if (history.length > 1) {
        history.pop(); // remove current
        const previousPath = history[history.length - 1];
        for (const route of routes) {
          const result = matchPath(route.pattern, previousPath);
          if (result.matched) {
            const handlerResult = route.handler(result.params);
            currentRoute = {
              path: previousPath,
              params: result.params,
              pattern: route.pattern,
              result: handlerResult,
            };
            return handlerResult;
          }
        }
      }
      return null;
    },

    getCurrentRoute() {
      return currentRoute;
    },

    getHistory() {
      return [...history];
    },
  };
}

function matchPath(pattern, path) {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);
  const params = {};

  for (let i = 0; i < patternParts.length; i++) {
    const pat = patternParts[i];

    if (pat === "*") {
      params.wildcard = pathParts.slice(i).join("/");
      return { matched: true, params };
    }

    if (i >= pathParts.length) {
      return { matched: false };
    }

    if (pat.startsWith(":")) {
      params[pat.slice(1)] = pathParts[i];
    } else if (pat !== pathParts[i]) {
      return { matched: false };
    }
  }

  if (patternParts.length !== pathParts.length) {
    return { matched: false };
  }

  return { matched: true, params };
}

// Test matchPath
console.log(matchPath("/users/:id", "/users/42"));
// Expected: { matched: true, params: { id: "42" } }

console.log(matchPath("/users/:id", "/users"));
// Expected: { matched: false }

console.log(matchPath("/users/:id/posts/:postId", "/users/1/posts/99"));
// Expected: { matched: true, params: { id: "1", postId: "99" } }

console.log(matchPath("/files/*", "/files/docs/report.pdf"));
// Expected: { matched: true, params: { wildcard: "docs/report.pdf" } }

console.log(matchPath("/about", "/about"));
// Expected: { matched: true, params: {} }

console.log(matchPath("/about", "/contact"));
// Expected: { matched: false }

// Test Router
const router = createRouter();
const routeLog = [];

router.addRoute("/", (params) => {
  routeLog.push("Home page");
  return "Home";
});

router.addRoute("/users", (params) => {
  routeLog.push("User list");
  return "User List";
});

router.addRoute("/users/:id", (params) => {
  routeLog.push(\`User profile: \${params.id}\`);
  return \`User \${params.id}\`;
});

router.addRoute("/users/:id/posts/:postId", (params) => {
  routeLog.push(\`Post \${params.postId} by user \${params.id}\`);
  return \`Post \${params.postId}\`;
});

router.addRoute("/files/*", (params) => {
  routeLog.push(\`File: \${params.wildcard}\`);
  return \`File: \${params.wildcard}\`;
});

// Test navigation
router.navigate("/");
console.log(routeLog[routeLog.length - 1]);
// Expected: "Home page"

router.navigate("/users");
console.log(routeLog[routeLog.length - 1]);
// Expected: "User list"

router.navigate("/users/42");
console.log(routeLog[routeLog.length - 1]);
// Expected: "User profile: 42"

const current = router.getCurrentRoute();
console.log(current.path, current.params, current.result);
// Expected: "/users/42" { id: "42" } "User 42"

router.navigate("/users/42/posts/7");
console.log(routeLog[routeLog.length - 1]);
// Expected: "Post 7 by user 42"

router.navigate("/files/images/cat.png");
console.log(routeLog[routeLog.length - 1]);
// Expected: "File: images/cat.png"

// Test history
console.log(router.getHistory());
// Expected: ["/", "/users", "/users/42", "/users/42/posts/7", "/files/images/cat.png"]

// Test back navigation
router.back();
console.log(router.getCurrentRoute().path);
// Expected: "/users/42/posts/7"

router.back();
console.log(router.getCurrentRoute().path);
// Expected: "/users/42"

// Test 404
router.navigate("/unknown/path");
console.log(router.getCurrentRoute().result);
// Expected: null
`,
    },
  ],
};
