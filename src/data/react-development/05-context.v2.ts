import { Module } from "../types";

export const contextModule: Module = {
  id: "context",
  title: "Context API",
  description: "Solve prop drilling by implementing React's Context API from scratch, then build a theme system and auth context on top of it.",
  lessons: [
    {
      id: "context-intro",
      slug: "context-intro",
      title: "Introduction to Context",
      content: `## Context: Solving Prop Drilling

**Prop drilling** is when you pass data through many layers of components that do not need it, just so a deeply nested component can access it:

\`\`\`mermaid
graph TD
    A[App has user data] -->|passes user| B[Layout]
    B -->|passes user| C[Sidebar]
    C -->|passes user| D[UserMenu needs user]
    
    style B fill:#f9f9f9
    style C fill:#f9f9f9
\`\`\`

Layout and Sidebar do not use \`user\` — they just relay it. This makes code hard to maintain and refactor.

\`\`\`concept
{
  "title": "The Prop Drilling Problem",
  "variant": "insight",
  "content": "Every intermediate component becomes coupled to data it doesn't use. Change the shape of \`user\`? Update 3+ components. Remove a layer? Break the chain. Context breaks this coupling by creating a direct pipeline from provider to consumer."
}
\`\`\`

### React Context solves this

Context provides a way to share values between components without explicitly passing props through every level:

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Prop Drilling",
    "code": "function App() {\\n  const user = useUser();\\n  return <Layout user={user} />;\\n}\\n\\nfunction Layout({ user }) {\\n  return <Sidebar user={user} />;\\n}\\n\\nfunction Sidebar({ user }) {\\n  return <UserMenu user={user} />;\\n}"
  },
  "after": {
    "label": "With Context",
    "code": "const UserContext = createContext(null);\\n\\nfunction App() {\\n  const user = useUser();\\n  return (\\n    <UserContext.Provider value={user}>\\n      <Layout />\\n    </UserContext.Provider>\\n  );\\n}\\n\\nfunction UserMenu() {\\n  const user = useContext(UserContext);\\n  return <span>{user.name}</span>;\\n}"
  }
}
\`\`\`

### How Context Works Internally

1. \`createContext(defaultValue)\` creates a context object
2. \`Provider\` stores the value and makes it available to descendants
3. \`useContext(Context)\` walks up the component tree to find the nearest Provider
4. If no Provider is found, the default value is used

\`\`\`trace
{
  "title": "Context Lookup in Action",
  "language": "javascript",
  "code": "const ThemeContext = createContext('light');\\n\\nfunction App() {\\n  return (\\n    <ThemeContext.Provider value=\\"dark\\">\\n      <Header />\\n    </ThemeContext.Provider>\\n  );\\n}\\n\\nfunction Header() {\\n  return <Button />;\\n}\\n\\nfunction Button() {\\n  const theme = useContext(ThemeContext);\\n  return <button className={theme}>Click</button>;\\n}",
  "frames": [
    { "line": 1, "vars": {}, "note": "Context created with default 'light'" },
    { "line": 4, "vars": { "ThemeContext": {} }, "note": "Provider sets value to 'dark'" },
    { "line": 13, "vars": { "theme": "dark" }, "note": "useContext finds nearest Provider" }
  ]
}
\`\`\`

### Context Concepts

| Concept | Description |
|---------|-------------|
| **createContext(default)** | Creates a context with a default value |
| **Provider** | Wraps a subtree and supplies a value |
| **Consumer / useContext** | Reads the nearest provider's value |
| **Nesting** | Inner providers override outer ones |

\`\`\`quiz
{
  "title": "Context Fundamentals",
  "questions": [
    {
      "question": "What happens when useContext finds no Provider above it?",
      "options": ["Throws an error", "Returns undefined", "Returns the default value", "Returns null"],
      "answer": 2,
      "explanation": "useContext returns the default value passed to createContext when no Provider is found in the component tree."
    },
    {
      "question": "Which components need to be aware of Context when using it?",
      "options": ["All components in the tree", "Only the Provider and Consumer", "Every parent up to the Provider", "Only leaf components"],
      "answer": 1,
      "explanation": "Only the component providing the value and the component consuming it need to know about the Context. Intermediate components remain unaware."
    },
    {
      "question": "Can you have multiple Providers for the same Context?",
      "options": ["No, only one Provider allowed", "Yes, but they must have the same value", "Yes, inner Providers override outer ones", "Only if they're in different React trees"],
      "answer": 2,
      "explanation": "You can nest Providers for the same Context. The innermost Provider's value is what consumers below it will receive."
    }
  ]
}
\`\`\`

### When to Use Context

\`\`\`tabs
{
  "tabs": [
    {
      "label": "✅ Good Use Cases",
      "content": "**Theme System**: Dark/light mode that many components need\\n\\n**Authentication**: Current user info accessible throughout app\\n\\n**Localization**: Language/locale settings for translations\\n\\n**Router State**: Current route info for navigation components"
    },
    {
      "label": "❌ Avoid For",
      "content": "**Frequently changing data**: Causes excessive re-renders (use state management instead)\\n\\n**Single component needs**: Just pass props if only 1-2 components need it\\n\\n**Derived state**: Computed values that can be calculated from existing props\\n\\n**Everything**: Overuse leads to performance issues and tangled dependencies"
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Performance Consideration",
  "content": "Context triggers re-renders of all consumers when its value changes. For high-frequency updates (like form inputs), consider splitting contexts or using specialized state management solutions."
}

\`\`\`

In these exercises, you will implement the Context pattern from scratch.`,
    },
    {
      id: "context-provider",
      slug: "context-provider",
      title: "Context Provider",
      content: `## Context Provider

### Problem Statement

Implement a simplified version of React's Context system with \`createContext\`, \`Provider\`, and \`useContext\`.

Create:
- \`createContext(defaultValue)\` — returns a context object
- The context object has a \`Provider(value, callback)\` method that sets the value and runs the callback (simulating rendering children)
- \`useContext(context)\` — returns the current value from the nearest Provider, or the default value if no Provider is active

### Key Behavior

Providers can be nested. The innermost Provider's value wins. When a Provider's callback finishes, the previous value is restored (simulating component tree scope).

\`\`\`concept
{
  "title": "Context Provider Stack",
  "variant": "mental-model",
  "content": "Think of Context Providers like a stack of transparent overlays. Each Provider adds a new overlay with its value. When you call useContext, you always see the top overlay. When a Provider's callback ends, its overlay is removed, revealing the previous value underneath."
}
\`\`\`

\`\`\`trace
{
  "title": "Provider Nesting in Action",
  "language": "javascript",
  "code": "const ThemeContext = createContext(\\"light\\");\\n\\nconsole.log(useContext(ThemeContext)); // \\"light\\" (default)\\n\\nThemeContext.Provider(\\"dark\\", () => {\\n  console.log(useContext(ThemeContext)); // \\"dark\\"\\n  \\n  ThemeContext.Provider(\\"blue\\", () => {\\n    console.log(useContext(ThemeContext)); // \\"blue\\" (innermost)\\n  });\\n  \\n  console.log(useContext(ThemeContext)); // \\"dark\\" (restored)\\n});",
  "frames": [
    { "line": 1, "vars": { "ThemeContext": "context object" }, "note": "Context created with default value 'light'" },
    { "line": 3, "vars": { "stack": [] }, "stdout": "light\\n", "note": "No providers active, using default value" },
    { "line": 5, "vars": { "stack": ["dark"] }, "note": "Provider pushes 'dark' onto stack" },
    { "line": 6, "vars": { "stack": ["dark"] }, "stdout": "dark\\n", "note": "Top of stack is 'dark'" },
    { "line": 8, "vars": { "stack": ["dark", "blue"] }, "note": "Nested provider pushes 'blue'" },
    { "line": 9, "vars": { "stack": ["dark", "blue"] }, "stdout": "blue\\n", "note": "Innermost provider wins" },
    { "line": 8, "vars": { "stack": ["dark"] }, "note": "Inner provider exits, pops 'blue'" },
    { "line": 11, "vars": { "stack": ["dark"] }, "stdout": "dark\\n", "note": "Previous value restored" }
  ],
  "speed": 1000
}
\`\`\`

### Implementation Strategy

\`\`\`steps
{
  "title": "Building the Context System",
  "steps": [
    {
      "title": "Step 1: Create the Context Object",
      "content": "Your \`createContext\` function should return an object with:\\n- A \`Provider\` method that takes (value, callback)\\n- An internal stack to track nested values\\n- A default value property"
    },
    {
      "title": "Step 2: Implement the Provider Method",
      "content": "The Provider method should:\\n1. Push the new value onto the internal stack\\n2. Execute the callback function\\n3. Pop the value from the stack when callback completes\\n4. Handle errors to ensure stack cleanup"
    },
    {
      "title": "Step 3: Create useContext Function",
      "content": "\`useContext\` should:\\n1. Check if the context has any active providers (stack not empty)\\n2. Return the top value from the stack if providers exist\\n3. Return the default value if no providers are active"
    }
  ]
}
\`\`\`

### Hints

- Use a stack to track nested provider values
- Push on Provider entry, pop on Provider exit
- useContext reads the top of the stack, or default if empty

\`\`\`quiz
{
  "title": "Context Provider Behavior",
  "questions": [
    {
      "question": "What happens when multiple Providers are nested?",
      "options": [
        "All values are merged together",
        "The outermost Provider's value is used",
        "The innermost Provider's value is used",
        "An error is thrown"
      ],
      "answer": 2,
      "explanation": "The innermost Provider's value always takes precedence, similar to how local variables shadow outer variables in scope."
    },
    {
      "question": "When should you pop a value from the Provider stack?",
      "options": [
        "Immediately after pushing it",
        "When the Provider component unmounts",
        "When the callback function completes",
        "Never, values accumulate"
      ],
      "answer": 2,
      "explanation": "Values should be popped when the Provider's callback completes, ensuring proper cleanup and restoration of previous values."
    },
    {
      "question": "What does useContext return when no Provider is active?",
      "options": [
        "undefined",
        "null",
        "The default value from createContext",
        "An error"
      ],
      "answer": 2,
      "explanation": "When no Provider is active in the component tree, useContext returns the default value that was passed to createContext."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Implement Your Context System",
  "language": "javascript",
  "code": "function createContext(defaultValue) {\\n  // TODO: Implement createContext\\n  // Should return an object with Provider method\\n  // and handle the internal stack\\n}\\n\\nfunction useContext(context) {\\n  // TODO: Implement useContext\\n  // Should return current context value\\n}\\n\\n// Test your implementation\\nconst ThemeContext = createContext(\\"light\\");\\nconsole.log(\\"Default:\\", useContext(ThemeContext));\\n\\nThemeContext.Provider(\\"dark\\", () => {\\n  console.log(\\"Inside provider:\\", useContext(ThemeContext));\\n});\\n\\nconsole.log(\\"After provider:\\", useContext(ThemeContext));",
  "runnable": true
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Context Providers use a stack-based approach to handle nested contexts",
    "The innermost Provider's value always takes precedence over outer Providers",
    "Values are automatically restored when Providers exit, maintaining proper scope",
    "This pattern mirrors React's actual Context API behavior for prop drilling solutions"
  ]
}
\`\`\``,
      starterCode: `function createContext(defaultValue) {
  // TODO: implement context with:
  // - A stack of values (to support nested Providers)
  // - Provider(value, callback): pushes value, runs callback, pops value
  // - Default value returned when stack is empty
}

function useContext(context) {
  // TODO: return the current value from the context
}

// Test cases
const ThemeContext = createContext("light");

// Test 1: Default value
console.log(useContext(ThemeContext));
// Expected: "light"

// Test 2: Provider overrides default
ThemeContext.Provider("dark", () => {
  console.log(useContext(ThemeContext));
  // Expected: "dark"
});

// Test 3: Value restored after Provider scope ends
console.log(useContext(ThemeContext));
// Expected: "light"

// Test 4: Nested Providers
ThemeContext.Provider("dark", () => {
  console.log("Outer:", useContext(ThemeContext));
  // Expected: "Outer: dark"

  ThemeContext.Provider("blue", () => {
    console.log("Inner:", useContext(ThemeContext));
    // Expected: "Inner: blue"
  });

  console.log("Back to outer:", useContext(ThemeContext));
  // Expected: "Back to outer: dark"
});

// Test 5: Multiple contexts
const UserContext = createContext(null);
const LangContext = createContext("en");

UserContext.Provider({ name: "Alice", role: "admin" }, () => {
  LangContext.Provider("fr", () => {
    const user = useContext(UserContext);
    const lang = useContext(LangContext);
    console.log(\`User: \${user.name}, Lang: \${lang}\`);
    // Expected: "User: Alice, Lang: fr"
  });

  console.log("Lang outside:", useContext(LangContext));
  // Expected: "Lang outside: en"
});

console.log("User outside:", useContext(UserContext));
// Expected: "User outside: null"
`,
      solutionCode: `function createContext(defaultValue) {
  const valueStack = [];

  return {
    Provider(value, callback) {
      valueStack.push(value);
      try {
        callback();
      } finally {
        valueStack.pop();
      }
    },
    _getCurrentValue() {
      return valueStack.length > 0
        ? valueStack[valueStack.length - 1]
        : defaultValue;
    },
  };
}

function useContext(context) {
  return context._getCurrentValue();
}

// Test cases
const ThemeContext = createContext("light");

// Test 1: Default value
console.log(useContext(ThemeContext));
// Expected: "light"

// Test 2: Provider overrides default
ThemeContext.Provider("dark", () => {
  console.log(useContext(ThemeContext));
  // Expected: "dark"
});

// Test 3: Value restored after Provider scope ends
console.log(useContext(ThemeContext));
// Expected: "light"

// Test 4: Nested Providers
ThemeContext.Provider("dark", () => {
  console.log("Outer:", useContext(ThemeContext));
  // Expected: "Outer: dark"

  ThemeContext.Provider("blue", () => {
    console.log("Inner:", useContext(ThemeContext));
    // Expected: "Inner: blue"
  });

  console.log("Back to outer:", useContext(ThemeContext));
  // Expected: "Back to outer: dark"
});

// Test 5: Multiple contexts
const UserContext = createContext(null);
const LangContext = createContext("en");

UserContext.Provider({ name: "Alice", role: "admin" }, () => {
  LangContext.Provider("fr", () => {
    const user = useContext(UserContext);
    const lang = useContext(LangContext);
    console.log(\`User: \${user.name}, Lang: \${lang}\`);
    // Expected: "User: Alice, Lang: fr"
  });

  console.log("Lang outside:", useContext(LangContext));
  // Expected: "Lang outside: en"
});

console.log("User outside:", useContext(UserContext));
// Expected: "User outside: null"
`,
    },
    {
      id: "context-theme-system",
      slug: "theme-system",
      title: "Theme System",
      content: `## Theme System

### Problem Statement

Build a theme system using the context pattern. This simulates how design systems like Material UI or Chakra UI handle theming.

Implement:
- \`createThemeSystem(themes)\` — takes a map of theme names to theme objects
- Returns \`{ ThemeProvider, useTheme, useThemedValue }\`
- \`ThemeProvider(themeName, callback)\` — sets the active theme
- \`useTheme()\` — returns the full current theme object
- \`useThemedValue(path)\` — returns a specific value from the theme by dot-notation path (e.g., "colors.primary")

### Examples

\`\`\`
const { ThemeProvider, useTheme, useThemedValue } = createThemeSystem({
  light: { colors: { primary: "#007bff", bg: "#ffffff" } },
  dark:  { colors: { primary: "#66b3ff", bg: "#1a1a2e" } },
});

ThemeProvider("dark", () => {
  console.log(useThemedValue("colors.bg")); // "#1a1a2e"
});
\`\`\`

### Hints

- Reuse the context pattern (stack-based provider)
- getByPath splits on "." and reduces into the object
- Throw an error if useTheme is called outside a provider`,
      starterCode: `function createThemeSystem(themes) {
  // TODO: implement a theme system using the context pattern
  // - Store the current theme name in a stack (for nesting)
  // - ThemeProvider(themeName, callback): sets the active theme
  // - useTheme(): returns the full theme object
  // - useThemedValue(path): returns a value by dot-notation path
}

// Helper: get nested value by dot path
function getByPath(obj, path) {
  // TODO: "colors.primary" -> obj.colors.primary
}

// Test cases
const { ThemeProvider, useTheme, useThemedValue } = createThemeSystem({
  light: {
    name: "light",
    colors: { primary: "#007bff", secondary: "#6c757d", bg: "#ffffff", text: "#212529" },
    spacing: { sm: 4, md: 8, lg: 16, xl: 24 },
    borderRadius: 4,
  },
  dark: {
    name: "dark",
    colors: { primary: "#66b3ff", secondary: "#adb5bd", bg: "#1a1a2e", text: "#e0e0e0" },
    spacing: { sm: 4, md: 8, lg: 16, xl: 24 },
    borderRadius: 4,
  },
  highContrast: {
    name: "highContrast",
    colors: { primary: "#ffff00", secondary: "#00ffff", bg: "#000000", text: "#ffffff" },
    spacing: { sm: 4, md: 8, lg: 16, xl: 24 },
    borderRadius: 0,
  },
});

// Test 1: No provider should throw
try {
  useTheme();
  console.log("ERROR: should have thrown");
} catch (e) {
  console.log("Correctly threw: no active theme");
}

// Test 2: Light theme
ThemeProvider("light", () => {
  console.log(useTheme().name);
  // Expected: "light"

  console.log(useThemedValue("colors.primary"));
  // Expected: "#007bff"

  console.log(useThemedValue("colors.bg"));
  // Expected: "#ffffff"

  console.log(useThemedValue("spacing.lg"));
  // Expected: 16
});

// Test 3: Dark theme
ThemeProvider("dark", () => {
  console.log(useThemedValue("colors.bg"));
  // Expected: "#1a1a2e"

  console.log(useThemedValue("colors.text"));
  // Expected: "#e0e0e0"
});

// Test 4: Nested theme override
ThemeProvider("light", () => {
  console.log("Outer:", useThemedValue("colors.bg"));
  // Expected: "Outer: #ffffff"

  ThemeProvider("dark", () => {
    console.log("Inner:", useThemedValue("colors.bg"));
    // Expected: "Inner: #1a1a2e"
  });

  console.log("Restored:", useThemedValue("colors.bg"));
  // Expected: "Restored: #ffffff"
});

// Test 5: High contrast theme
ThemeProvider("highContrast", () => {
  console.log(useThemedValue("colors.primary"));
  // Expected: "#ffff00"
  console.log(useThemedValue("borderRadius"));
  // Expected: 0
});
`,
      solutionCode: `function createThemeSystem(themes) {
  const themeStack = [];

  function ThemeProvider(themeName, callback) {
    if (!themes[themeName]) {
      throw new Error(\`Unknown theme: \${themeName}\`);
    }
    themeStack.push(themeName);
    try {
      callback();
    } finally {
      themeStack.pop();
    }
  }

  function useTheme() {
    if (themeStack.length === 0) {
      throw new Error("useTheme must be used within a ThemeProvider");
    }
    const currentThemeName = themeStack[themeStack.length - 1];
    return themes[currentThemeName];
  }

  function useThemedValue(path) {
    const theme = useTheme();
    return getByPath(theme, path);
  }

  return { ThemeProvider, useTheme, useThemedValue };
}

function getByPath(obj, path) {
  return path.split(".").reduce((current, key) => {
    return current !== undefined && current !== null ? current[key] : undefined;
  }, obj);
}

// Test cases
const { ThemeProvider, useTheme, useThemedValue } = createThemeSystem({
  light: {
    name: "light",
    colors: { primary: "#007bff", secondary: "#6c757d", bg: "#ffffff", text: "#212529" },
    spacing: { sm: 4, md: 8, lg: 16, xl: 24 },
    borderRadius: 4,
  },
  dark: {
    name: "dark",
    colors: { primary: "#66b3ff", secondary: "#adb5bd", bg: "#1a1a2e", text: "#e0e0e0" },
    spacing: { sm: 4, md: 8, lg: 16, xl: 24 },
    borderRadius: 4,
  },
  highContrast: {
    name: "highContrast",
    colors: { primary: "#ffff00", secondary: "#00ffff", bg: "#000000", text: "#ffffff" },
    spacing: { sm: 4, md: 8, lg: 16, xl: 24 },
    borderRadius: 0,
  },
});

// Test 1: No provider should throw
try {
  useTheme();
  console.log("ERROR: should have thrown");
} catch (e) {
  console.log("Correctly threw: no active theme");
}

// Test 2: Light theme
ThemeProvider("light", () => {
  console.log(useTheme().name);
  // Expected: "light"

  console.log(useThemedValue("colors.primary"));
  // Expected: "#007bff"

  console.log(useThemedValue("colors.bg"));
  // Expected: "#ffffff"

  console.log(useThemedValue("spacing.lg"));
  // Expected: 16
});

// Test 3: Dark theme
ThemeProvider("dark", () => {
  console.log(useThemedValue("colors.bg"));
  // Expected: "#1a1a2e"

  console.log(useThemedValue("colors.text"));
  // Expected: "#e0e0e0"
});

// Test 4: Nested theme override
ThemeProvider("light", () => {
  console.log("Outer:", useThemedValue("colors.bg"));
  // Expected: "Outer: #ffffff"

  ThemeProvider("dark", () => {
    console.log("Inner:", useThemedValue("colors.bg"));
    // Expected: "Inner: #1a1a2e"
  });

  console.log("Restored:", useThemedValue("colors.bg"));
  // Expected: "Restored: #ffffff"
});

// Test 5: High contrast theme
ThemeProvider("highContrast", () => {
  console.log(useThemedValue("colors.primary"));
  // Expected: "#ffff00"
  console.log(useThemedValue("borderRadius"));
  // Expected: 0
});
`,
    },
  ],
};
