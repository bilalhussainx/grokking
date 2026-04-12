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

### Problem Statement

Implement a simplified Virtual DOM system with three core functions:

1. \`h(tag, props, ...children)\` — creates a virtual node (vnode)
2. \`diff(oldTree, newTree)\` — compares two virtual trees and returns a list of patches
3. \`applyPatches(patches)\` — applies patches and returns a log of operations

Patch types:
- \`CREATE\` — add a new node
- \`REMOVE\` — remove a node
- \`REPLACE\` — replace a node with a different one
- \`UPDATE_PROPS\` — change props on an existing node
- \`UPDATE_TEXT\` — change text content

### Key Behaviors

- If tags differ, the entire subtree is replaced (like React)
- Props are diffed individually (added, removed, changed)
- Children are diffed by index (simplified — no key-based reconciliation)
- Text nodes (strings) are compared directly`,
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

### Examples

\`\`\`
const router = createRouter();
router.addRoute("/users/:id", (params) => \`User \${params.id}\`);
router.navigate("/users/42");
// handler called with { id: "42" }
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
