import { Module } from "../types";

export const module7: Module = {
  id: "performance-migration",
  title: "Migrating to TypeScript & Performance",
  description: "Migrating large JS codebases, allowJs strategy, declaration files, performance tuning the compiler, and TypeScript 5.x features",
  lessons: [
    {
      id: "migration-strategy",
      slug: "migration-strategy",
      title: "Migrating a JavaScript Codebase to TypeScript",
      content: `# Migrating to TypeScript

Migrating a large JavaScript codebase is a marathon, not a sprint. The right strategy avoids a big-bang rewrite and delivers value incrementally.

---

\`\`\`concept
{
  "title": "The Gradual Migration Principle",
  "variant": "mental-model",
  "content": "TypeScript's allowJs + checkJs lets you typecheck JavaScript files without converting them. You can migrate file-by-file, starting with the most critical modules. Any TypeScript file can import from any JavaScript file, and vice versa. The migration is incremental by design."
}
\`\`\`

---

## Phase 1: Setup Without Breaking Anything

\`\`\`json
// tsconfig.json — initial permissive config
{
  "compilerOptions": {
    "allowJs": true,          // TypeScript processes .js files too
    "checkJs": false,         // Don't type-check JS yet — just transpile
    "strict": false,          // Loose for now
    "noEmit": true,           // Don't emit yet — just type-check
    "target": "ES2020",
    "module": "CommonJS"
  },
  "include": ["src/**/*"]
}
\`\`\`

## Phase 2: Enable JS Checking Gradually

\`\`\`javascript
// @ts-check at top of specific JS files you want to check:
// @ts-check
'use strict';

/**
 * JSDoc types work with @ts-check — no conversion needed!
 * @param {string} name
 * @param {number} age
 * @returns {{ id: string; name: string; age: number }}
 */
function createUser(name, age) {
  return { id: crypto.randomUUID(), name, age };
}

// @ts-ignore — suppress a single error
// @ts-expect-error — like ts-ignore but fails if there's NO error (safer)

// Import types from .d.ts files in JSDoc:
/** @type {import('./types').Config} */
const config = loadConfig();
\`\`\`

## Phase 3: File-by-File Conversion

\`\`\`typescript
// Priority order for migration:
// 1. Type definitions and interfaces first (no logic, high value)
// 2. Utility functions (pure, easy to type)
// 3. Data access layer (DB/API — types prevent subtle bugs)
// 4. Business logic (most critical — most benefit)
// 5. UI components last (most churn)

// Common migration patterns:

// Before (JS):
function processItems(items, callback) {
  return items.filter(item => item.active).map(callback);
}

// After (TS):
function processItems<T, R>(
  items: Array<T & { active: boolean }>,
  callback: (item: T) => R
): R[] {
  return items.filter(item => item.active).map(callback);
}

// Handle any-typed legacy code with type assertions as bridges:
const legacyData = getLegacyData() as unknown as NewDataType;
// Document why: this is safe because getLegacyData() always returns...
\`\`\`

## TypeScript 5.x New Features

\`\`\`typescript
// TS 5.0: Const type parameters — preserve literal types in generics
function parseConfig<const T extends Record<string, unknown>>(config: T): T {
  return config;
}
const c = parseConfig({ theme: 'dark', port: 8080 });
// Without 'const': { theme: string; port: number }
// With 'const': { theme: 'dark'; port: 8080 } — literals preserved!

// TS 5.0: Decorators (standard stage-3, no experimentalDecorators needed)

// TS 5.1: Unrelated types for setters
class Temperature {
  private _celsius: number = 0;

  get celsius(): number { return this._celsius; }
  // Setter can accept different type than getter returns:
  set celsius(value: number | string) {
    this._celsius = typeof value === 'string' ? parseFloat(value) : value;
  }
}

// TS 5.2: using / await using (Explicit Resource Management)
class DatabaseConnection {
  [Symbol.dispose]() { this.close(); }
  close() { console.log('Connection closed'); }
  query(sql: string) { return []; }
}

function example() {
  using conn = new DatabaseConnection(); // automatically disposed at end of block!
  const data = conn.query('SELECT * FROM users');
  return data;
  // conn.close() called automatically — no need for try/finally
}

// TS 5.4: NoInfer<T> — prevent type inference from a specific position
function createState<T>(initial: T, options?: { validate?: (v: T) => boolean }): T {
  return initial;
}
// Problem: T inferred from options.validate, not initial:
const state = createState(0, { validate: (v) => v > 0 }); // T = number ✅

// NoInfer prevents options from influencing T:
function createState2<T>(initial: T, options?: { validate?: (v: NoInfer<T>) => boolean }): T {
  return initial;
}
\`\`\`

## Compiler Performance Tuning

\`\`\`json
// tsconfig.json performance flags:
{
  "compilerOptions": {
    "incremental": true,           // Only recheck changed files
    "skipLibCheck": true,          // Skip type checking .d.ts files (faster)
    "skipDefaultLibCheck": true,   // Skip built-in libs
    "isolatedModules": true,       // Each file is an independent module (Babel/esbuild compatible)

    // Exclude directories you don't need to check:
    "exclude": ["node_modules", "dist", "coverage", "**/*.stories.tsx"]
  }
}
// Run tsc --diagnostics to see what's slow
// Run tsc --extendedDiagnostics for detailed timing
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the safest way to use 'as' type assertions when migrating legacy JS?",
      "options": [
        "Use 'as any' everywhere",
        "Use 'as unknown as TargetType' — the double cast forces you to acknowledge you're bypassing the type system, and document why it's safe",
        "Avoid type assertions entirely",
        "Use '!' non-null assertions instead"
      ],
      "answer": 1,
      "explanation": "Direct 'value as TargetType' fails if TypeScript thinks the types are incompatible. 'value as unknown as TargetType' is a double cast that always works — but it's a red flag. By requiring the 'unknown' step, TypeScript signals this is intentional, and you should always add a comment explaining why the assertion is safe."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
