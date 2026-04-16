import { Module } from "../types";

export const module5: Module = {
  id: "config-ecosystem",
  title: "tsconfig, Strict Mode & TypeScript Ecosystem",
  description: "tsconfig.json deep dive, strict mode flags, project references, path aliases, and integrating TypeScript with build tools",
  lessons: [
    {
      id: "tsconfig-mastery",
      slug: "tsconfig-mastery",
      title: "tsconfig.json: Every Flag That Matters",
      content: `# tsconfig.json Deep Dive

The TypeScript compiler is controlled by \`tsconfig.json\`. Most projects use defaults and suffer for it. This lesson covers every flag that meaningfully affects your codebase.

---

## The Strict Mode Family

\`\`\`concept
{
  "title": "Why Strict Mode?",
  "variant": "mental-model",
  "content": "TypeScript ships conservative defaults to not break existing JavaScript. 'strict: true' enables all the flags that make TypeScript actually useful as a safety net. New projects should always start with strict: true — retrofitting it later onto a large codebase is painful."
}
\`\`\`

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    // 'strict' is shorthand for ALL of these:
    // ┌─ strictNullChecks: true
    // │   null and undefined are NOT assignable to other types
    // │   Forces you to handle null/undefined explicitly
    // │
    // ├─ noImplicitAny: true
    // │   Error when TypeScript can't infer a type (falls back to 'any')
    // │   Forces you to annotate explicitly
    // │
    // ├─ strictFunctionTypes: true
    // │   Functions parameters are checked contravariantly
    // │   Prevents silent covariance bugs in callbacks
    // │
    // ├─ strictBindCallApply: true
    // │   bind/call/apply are typed correctly
    // │
    // ├─ strictPropertyInitialization: true
    // │   Class properties must be initialized in constructor
    // │
    // ├─ noImplicitThis: true
    // │   'this' must be typed in functions where it's ambiguous
    // │
    // └─ useUnknownInCatchVariables: true (TS 4.4+)
    //     catch (e) — 'e' is 'unknown' not 'any'
  }
}
\`\`\`

## Complete tsconfig Reference

\`\`\`json
{
  "compilerOptions": {
    // ─── Target & Module ─────────────────────────────────────────────
    "target": "ES2022",           // JS version to compile to (preserve modern syntax)
    "module": "NodeNext",          // Module format: CommonJS | ESNext | NodeNext
    "moduleResolution": "NodeNext", // How imports are resolved
    "lib": ["ES2022", "DOM", "DOM.Iterable"], // Built-in type definitions to include

    // ─── Emit ───────────────────────────────────────────────────────
    "outDir": "./dist",            // Output directory
    "rootDir": "./src",            // Source directory
    "declaration": true,           // Generate .d.ts files (for libraries)
    "declarationMap": true,        // Maps .d.ts back to source
    "sourceMap": true,             // Generate .js.map files for debugging
    "removeComments": true,        // Strip comments from output

    // ─── Module resolution ───────────────────────────────────────────
    "baseUrl": ".",                // Base for non-relative imports
    "paths": {
      "@/*": ["./src/*"],          // Path alias: import from '@/components/...'
      "@components/*": ["./src/components/*"]
    },
    "esModuleInterop": true,       // Allow default imports from CJS modules
    "allowSyntheticDefaultImports": true,

    // ─── Type checking ───────────────────────────────────────────────
    "strict": true,                // Enable all strict flags
    "noUnusedLocals": true,        // Error on unused variables
    "noUnusedParameters": true,    // Error on unused function params
    "noImplicitReturns": true,     // All code paths must return
    "noFallthroughCasesInSwitch": true, // switch cases need break/return
    "exactOptionalPropertyTypes": true,  // {a?: string} — 'a' can be missing or string, not undefined
    "noUncheckedIndexedAccess": true,    // arr[0] has type T | undefined (safer!)

    // ─── Project references ──────────────────────────────────────────
    "composite": true,             // Enable for project references
    "incremental": true,           // Cache builds for faster recompilation
    "tsBuildInfoFile": "./.tsbuildinfo"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
\`\`\`

## Path Aliases & Monorepo Project References

\`\`\`typescript
// Without path alias (painful):
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../../hooks/useAuth';

// With path alias @/* → src/*:
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

// For Vite/Webpack to also understand the aliases:
// vite.config.ts:
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({ plugins: [tsconfigPaths()] });

// Monorepo project references (packages depend on each other):
// apps/web/tsconfig.json:
{
  "references": [
    { "path": "../../packages/ui" },
    { "path": "../../packages/utils" }
  ]
}
// packages/ui/tsconfig.json:
{ "compilerOptions": { "composite": true } }
// Build with: tsc --build (respects dependency order)
\`\`\`

## Type-Only Imports (TS 3.8+)

\`\`\`typescript
// 'import type' — only imports the type, erased at runtime
// Prevents circular dependency issues and speeds up builds

import type { User } from './user'; // not in bundle
import { createUser } from './user'; // in bundle

// In a .d.ts barrel file:
export type { User, UserRole, UserPermission } from './types';

// 'type' on individual specifiers (TS 4.5+):
import { createUser, type User, type Role } from './user';

// verbatimModuleSyntax (TS 5.0): enforces that import type is used for all
// type-only imports — cleaner bundles, no guessing what's a type vs runtime value
\`\`\`

## Integrating with Frameworks

\`\`\`tabs
{
  "tabs": [
    {
      "label": "React + TS",
      "icon": "⚛️",
      "content": "### React TypeScript Patterns\\n\\n\`\`\`typescript\\n// Function components — use React.FC<Props> or just type props inline:\\ntype ButtonProps = {\\n  label: string;\\n  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;\\n  variant?: 'primary' | 'secondary' | 'danger';\\n  disabled?: boolean;\\n  children?: React.ReactNode;\\n};\\n\\n// Prefer inline — React.FC adds 'children' implicitly (avoid):\\nfunction Button({ label, onClick, variant = 'primary' }: ButtonProps) {\\n  return <button onClick={onClick} className={variant}>{label}</button>;\\n}\\n\\n// Hooks with generics:\\nconst [users, setUsers] = useState<User[]>([]);\\nconst ref = useRef<HTMLInputElement>(null);\\nconst ctx = useContext<ThemeContextType>(ThemeContext);\\n\`\`\`"
    },
    {
      "label": "Node.js + TS",
      "icon": "🟢",
      "content": "### Node.js TypeScript Setup\\n\\n\`\`\`json\\n// package.json\\n{\\n  \\"scripts\\": {\\n    \\"dev\\": \\"tsx watch src/index.ts\\",\\n    \\"build\\": \\"tsc\\",\\n    \\"start\\": \\"node dist/index.js\\"\\n  }\\n}\\n// tsconfig.json for Node.js:\\n{\\n  \\"compilerOptions\\": {\\n    \\"target\\": \\"ES2022\\",\\n    \\"module\\": \\"NodeNext\\",\\n    \\"moduleResolution\\": \\"NodeNext\\",\\n    \\"outDir\\": \\"dist\\",\\n    \\"strict\\": true\\n  }\\n}\\n// Use 'tsx' for dev (no compile step),\\n// 'tsc' for production builds\\n\`\`\`"
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Always start with strict: true — retrofitting is painful", "noUncheckedIndexedAccess prevents arr[0] being 'T' when the array might be empty", "Path aliases (@/*) clean up deeply nested imports — set up in both tsconfig and bundler", "import type erases completely — use it for all type-only imports to prevent circular deps", "Project references (composite: true) enable incremental builds and proper isolation in monorepos", "verbatimModuleSyntax (TS 5.0+) enforces import type usage automatically"]
\`\`\`
`,
    },
  ],
};
