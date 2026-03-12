import { Module } from "../types";

export const contextModule: Module = {
  id: "context",
  title: "Context API",
  description:
    "Solve prop drilling by implementing React's Context API from scratch, then build a theme system and auth context on top of it.",
  lessons: [
    {
      id: "context-intro",
      slug: "context-intro",
      title: "Introduction to Context",
      content: `## Context: Solving Prop Drilling

**Prop drilling** is when you pass data through many layers of components that do not need it, just so a deeply nested component can access it:

\`\`\`
App (has user data)
  └─> Layout (passes user down)
       └─> Sidebar (passes user down)
            └─> UserMenu (actually needs user)
\`\`\`

Layout and Sidebar do not use \`user\` — they just relay it. This makes code hard to maintain and refactor.

### React Context solves this

Context provides a way to share values between components without explicitly passing props through every level:

\`\`\`
// Create context with a default value
const UserContext = createContext(null);

// Provide the value at any level
<UserContext.Provider value={currentUser}>
  <Layout />     {/* no user prop needed */}
</UserContext.Provider>

// Consume it anywhere below — no matter how deep
function UserMenu() {
  const user = useContext(UserContext);
  return <span>{user.name}</span>;
}
\`\`\`

### How Context Works Internally

1. \`createContext(defaultValue)\` creates a context object
2. \`Provider\` stores the value and makes it available to descendants
3. \`useContext(Context)\` walks up the component tree to find the nearest Provider
4. If no Provider is found, the default value is used

### Context Concepts

| Concept | Description |
|---------|-------------|
| **createContext(default)** | Creates a context with a default value |
| **Provider** | Wraps a subtree and supplies a value |
| **Consumer / useContext** | Reads the nearest provider's value |
| **Nesting** | Inner providers override outer ones |

### When to Use Context

| Use Context For | Do NOT Use Context For |
|----------------|----------------------|
| Theme (dark/light mode) | Frequently changing data (use state management) |
| Current user / auth state | Data that only 1-2 components need (just pass props) |
| Locale / language | Everything — overuse causes re-render problems |
| Router information | |

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

### Examples

\`\`\`
const ThemeContext = createContext("light");

console.log(useContext(ThemeContext)); // "light" (default)

ThemeContext.Provider("dark", () => {
  console.log(useContext(ThemeContext)); // "dark"

  ThemeContext.Provider("blue", () => {
    console.log(useContext(ThemeContext)); // "blue" (innermost)
  });

  console.log(useContext(ThemeContext)); // "dark" (restored)
});
\`\`\`

### Hints

- Use a stack to track nested provider values
- Push on Provider entry, pop on Provider exit
- useContext reads the top of the stack, or default if empty`,
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
