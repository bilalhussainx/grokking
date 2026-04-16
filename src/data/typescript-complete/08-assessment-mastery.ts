import { Module } from "../types";

export const module8: Module = {
  id: "assessment-mastery",
  title: "TypeScript Mastery Assessment & Interview Prep",
  description: "Comprehensive type challenges, common interview questions, debugging complex type errors, and building a fully typed mini-project",
  lessons: [
    {
      id: "type-challenges",
      slug: "type-challenges",
      title: "Advanced Type Challenges (Interview-Level)",
      content: `# TypeScript Type Challenges

These are the kinds of problems asked in TypeScript-heavy interviews at companies like Vercel, Linear, and Stripe. Master them and you'll be in the top 5% of TypeScript engineers.

---

\`\`\`concept
{
  "title": "The Three Tiers of TypeScript Mastery",
  "variant": "mental-model",
  "content": "Tier 1 — Correct: code compiles with strict mode, no 'any' escapes. Tier 2 — Precise: types narrow correctly, no unnecessary unions, intellisense works perfectly for consumers. Tier 3 — Elegant: type logic is readable, reusable, and doesn't fight the type system — it works WITH it."
}
\`\`\`

---

## Challenge 1: Implement \`DeepRequired<T>\`

\`\`\`typescript
// Make every nested property required AND non-nullable:

type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object
    ? T[K] extends Function
      ? NonNullable<T[K]>
      : DeepRequired<NonNullable<T[K]>>
    : NonNullable<T[K]>;
};

// Test:
type Config = {
  server?: {
    host?: string | null;
    port?: number;
  };
  db?: {
    url?: string;
    pool?: { min?: number; max?: number };
  };
};

type StrictConfig = DeepRequired<Config>;
// server: { host: string; port: number }
// db: { url: string; pool: { min: number; max: number } }
// Every optional and nullable removed!
\`\`\`

## Challenge 2: Implement \`Flatten<T>\`

\`\`\`typescript
// Flatten nested arrays one level:
type Flatten<T> = T extends Array<infer Item> ? Item : T;

// Recursive flatten (any depth):
type FlattenDeep<T> = T extends Array<infer Item>
  ? FlattenDeep<Item>
  : T;

type Nested = [[1, 2], [3, [4, 5]]];
type F1 = Flatten<Nested>;      // [1, 2] | [3, [4, 5]]
type F2 = FlattenDeep<Nested>;  // 1 | 2 | 3 | 4 | 5
\`\`\`

## Challenge 3: Implement \`CamelToSnake<S>\`

\`\`\`typescript
// Convert camelCase string to snake_case at the type level:

type CamelToSnake<S extends string> =
  S extends \`\${infer Head}\${infer Tail}\`
    ? Head extends Uppercase<Head>
      ? Head extends Lowercase<Head>  // not a letter
        ? \`\${Head}\${CamelToSnake<Tail>}\`
        : \`_\${Lowercase<Head>}\${CamelToSnake<Tail>}\`
      : \`\${Head}\${CamelToSnake<Tail>}\`
    : S;

type T1 = CamelToSnake<'firstName'>;   // 'first_name'
type T2 = CamelToSnake<'createdAt'>;   // 'created_at'
type T3 = CamelToSnake<'userId'>;      // 'user_id'

// Now make all keys of an object snake_case:
type SnakeCaseKeys<T> = {
  [K in keyof T as CamelToSnake<string & K>]: T[K]
};

type CamelUser = { firstName: string; lastName: string; createdAt: Date };
type SnakeUser = SnakeCaseKeys<CamelUser>;
// { first_name: string; last_name: string; created_at: Date }
\`\`\`

## Challenge 4: Implement Type-Safe \`pick()\`

\`\`\`typescript
// Runtime function that narrows to only the keys you pick:

function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

const user = { id: 1, name: 'Alice', email: 'alice@example.com', password: 'secret' };
const safe = pick(user, ['id', 'name', 'email']);
// Type: { id: number; name: string; email: string }
// safe.password — ❌ TypeScript error — 'password' doesn't exist on Pick

// With const assertion for even better inference:
function pickConst<T extends object, K extends readonly (keyof T)[]>(
  obj: T,
  keys: K
): Pick<T, K[number]> {
  const result = {} as Pick<T, K[number]>;
  for (const key of keys) result[key as K[number]] = obj[key as K[number]];
  return result;
}
\`\`\`

## Challenge 5: Implement \`Curry<F>\`

\`\`\`typescript
// Type-safe curry: given (a: A, b: B, c: C) => R,
// produce a curried version that accepts args one at a time:

type Curry<F extends (...args: any[]) => any> =
  Parameters<F> extends [infer First, ...infer Rest]
    ? Rest extends []
      ? F
      : (arg: First) => Curry<(...args: Rest) => ReturnType<F>>
    : ReturnType<F>;

declare function curry<F extends (...args: any[]) => any>(fn: F): Curry<F>;

function add(a: number, b: number, c: number): number {
  return a + b + c;
}

const curriedAdd = curry(add);
const result = curriedAdd(1)(2)(3); // number ✅
// TypeScript knows the type at every step!
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does '-?' in a mapped type do?",
      "options": [
        "Remove all optional properties",
        "Remove the optional modifier (?) from each mapped property, making all properties required",
        "Add the optional modifier",
        "It's a syntax error"
      ],
      "answer": 1,
      "explanation": "In mapped types, +? adds the optional modifier and -? removes it. 'type Required<T> = { [K in keyof T]-?: T[K] }' is exactly how TypeScript's built-in Required<T> works. Similarly, +readonly and -readonly add/remove readonly. The + prefix is implicit — '[K in keyof T]?: T[K]' and '[K in keyof T]+?: T[K]' are identical."
    },
    {
      "q": "What is 'as' used for in a mapped type like '{ [K in keyof T as CamelToSnake<K>]: T[K] }'?",
      "options": [
        "Type assertion",
        "Key remapping — renames the output key using the type expression after 'as'",
        "Conditional branching",
        "Template literal expansion"
      ],
      "answer": 1,
      "explanation": "TypeScript 4.1 added key remapping in mapped types via 'as'. '[K in keyof T as NewKey<K>]: T[K]' lets you transform the key names during mapping. You can rename, filter (return never to exclude), or completely transform keys. This is what powers SnakeCaseKeys<T> and similar transforms."
    }
  ]
}
\`\`\`
`,
      starterCode: `// Implement a type-safe \`groupBy\` function:
// groupBy([1, 2, 3, 4, 5], n => n % 2 === 0 ? 'even' : 'odd')
// → { even: [2, 4], odd: [1, 3, 5] }

// The return type should be Record<ReturnType<F>, T[]>
// where F is the key selector function

function groupBy<T, K extends string>(
  arr: T[],
  keySelector: (item: T) => K
): Record<K, T[]> {
  // TODO: implement
  return {} as Record<K, T[]>;
}

// Test:
const groups = groupBy(
  [{ name: 'Alice', dept: 'eng' }, { name: 'Bob', dept: 'sales' }, { name: 'Carol', dept: 'eng' }],
  p => p.dept
);
// groups.eng → [Alice, Carol]
// groups.sales → [Bob]
// groups.nonexistent → TypeScript error? (depends on K inference)`,
      solutionCode: `function groupBy<T, K extends string>(
  arr: T[],
  keySelector: (item: T) => K
): Record<K, T[]> {
  const result = {} as Record<K, T[]>;
  for (const item of arr) {
    const key = keySelector(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
  }
  return result;
}

// Bonus: Partial return type (safer — keys may not exist):
function groupByPartial<T, K extends string>(
  arr: T[],
  keySelector: (item: T) => K
): Partial<Record<K, T[]>> {
  const result: Partial<Record<K, T[]>> = {};
  for (const item of arr) {
    const key = keySelector(item);
    (result[key] ??= []).push(item);
  }
  return result;
}

// Usage:
const groups = groupBy(
  [{ name: 'Alice', dept: 'eng' }, { name: 'Bob', dept: 'sales' }, { name: 'Carol', dept: 'eng' }],
  p => p.dept
);
console.log(groups.eng);   // [Alice, Carol]
console.log(groups.sales); // [Bob]`,
    },
    {
      id: "debugging-type-errors",
      slug: "debugging-type-errors",
      title: "Debugging Complex Type Errors",
      content: `# Debugging TypeScript Type Errors

TypeScript error messages are famously verbose. Learning to read them quickly is itself a skill.

---

## The Error Anatomy

\`\`\`typescript
// TypeScript error messages have a structure:
// 1. The main error (first line)
// 2. The chain of "why" explanations (indented lines)
// 3. The exact location (file:line:col)

// Example — reading a real type error:

interface User { id: number; name: string; }
interface Admin extends User { permissions: string[]; }

function processUser(user: User) { return user; }

const admin: Admin = { id: 1, name: 'Alice', permissions: ['read'] };
processUser(admin); // ✅ Admin extends User — allowed

// But this direction fails:
function processAdmin(admin: Admin) { return admin; }
const user: User = { id: 1, name: 'Bob' };
// processAdmin(user); ❌

// Error:
// Argument of type 'User' is not assignable to parameter of type 'Admin'.
//   Property 'permissions' is missing in type 'User' but required in type 'Admin'.

// Reading: "User" doesn't satisfy "Admin" because "permissions" is required in Admin but
// not in User. The indented line tells you EXACTLY which property breaks the contract.
\`\`\`

## Technique 1: Hover-Inspect Intermediate Types

\`\`\`typescript
// When a complex generic type fails, extract intermediate steps:

type MyComplexType<T> = T extends object
  ? { [K in keyof T]: T[K] extends string ? Uppercase<T[K]> : T[K] }
  : never;

// If you get an error using MyComplexType<SomeType>, debug by:
// 1. Create a named intermediate:
type Step1<T> = T extends object ? T : never; // Does T extend object?
type Step2<T extends object> = { [K in keyof T]: T[K] };  // Does mapping work?
type Step3<T extends object> = { [K in keyof T]: T[K] extends string ? Uppercase<T[K]> : T[K] };

// 2. Use type aliases to force evaluation:
type Debug = MyComplexType<{ name: string; age: number }>;
// Hover over 'Debug' in your editor to see the resolved type
\`\`\`

## Technique 2: The \`Expect<Equal<...>>\` Pattern

\`\`\`typescript
// From @type-challenges/utils — write type-level assertions:

type Expect<T extends true> = T;
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2)
    ? true
    : false;

// Usage in tests:
type MyPartial<T> = { [K in keyof T]?: T[K] };

// This assertion fails at compile time if the types don't match:
type _Test1 = Expect<Equal<MyPartial<{ a: string; b: number }>, { a?: string; b?: number }>>;
// No error = your type is correct!
\`\`\`

## Technique 3: Isolate with \`satisfies\`

\`\`\`typescript
// TS 4.9's 'satisfies' operator validates without widening:

const config = {
  port: 3000,
  theme: 'dark',
  features: ['auth', 'analytics'],
} satisfies {
  port: number;
  theme: 'dark' | 'light';
  features: string[];
};

// 'satisfies' validates the shape BUT preserves literal types:
config.port;    // type: 3000 (literal) — not number
config.theme;   // type: 'dark' (literal) — not 'dark' | 'light'

// vs 'as const':
const config2 = { port: 3000, theme: 'dark' } as const;
config2.theme; // 'dark' ✅ — same, but 'as const' makes all props readonly

// 'satisfies' = type check + keep inference. Best for config objects.
\`\`\`

## Common Error Patterns & Fixes

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Type instantiation too deep",
      "icon": "🌀",
      "content": "### Recursive Type Overflow\\n\\nError: 'Type instantiation is excessively deep and possibly infinite'\\n\\n\`\`\`typescript\\n// Cause: recursive type with no base case, or TypeScript can't determine termination\\ntype Infinite<T> = { value: T; next: Infinite<T> }; // Technically fine as a type\\n\\n// Problem: recursive utility with unbounded input:\\ntype Rev<T extends any[]> = T extends [infer H, ...infer Rest]\\n  ? [...Rev<Rest>, H]\\n  : T;\\ntype R = Rev<[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]>; // Might fail on very long tuples\\n\\n// Fix: add depth counter (advanced trick):\\ntype Rev2<T extends any[], Acc extends any[] = []> =\\n  T extends [infer H, ...infer Rest]\\n    ? Rev2<Rest, [H, ...Acc]>\\n    : Acc;\\n// Tail-recursive form — TypeScript optimizes this differently\\n\`\`\`"
    },
    {
      "label": "Contravariance errors",
      "icon": "↔️",
      "content": "### Function Parameter Contravariance\\n\\nError: 'Type X is not assignable to type Y. Types of parameters are incompatible.'\\n\\n\`\`\`typescript\\n// Covariance: can use subtype where supertype expected (return types)\\n// Contravariance: must use supertype where subtype expected (parameter types)\\n\\ntype Logger = (msg: string) => void;\\ntype DetailedLogger = (msg: string, level: 'info' | 'warn' | 'error') => void;\\n\\n// This fails because DetailedLogger requires an extra arg:\\nconst log: Logger = (msg: string, level: 'info') => console.log(msg, level); // ❌\\n\\n// Fix: make extra param optional:\\nconst log2: Logger = (msg: string, level?: string) => console.log(msg, level); // ✅\\n\\n// This is why Array.prototype.sort's callback type is:\\n// (a: T, b: T) => number — not (a: T, b: T, index?: number) => number\\n\`\`\`"
    },
    {
      "label": "Index signature errors",
      "icon": "📇",
      "content": "### Index Signature Incompatibility\\n\\nError: 'Index signature for type string is missing in type X'\\n\\n\`\`\`typescript\\n// This fails:\\nfunction logAll(obj: Record<string, unknown>) {\\n  for (const key in obj) console.log(key, obj[key]);\\n}\\n\\nconst user = { name: 'Alice', age: 30 };\\nlogAll(user); // ❌ — 'user' lacks index signature\\n\\n// Fix options:\\n// 1. Cast at call site (quick, less safe):\\nlogAll(user as Record<string, unknown>);\\n\\n// 2. Use a generic (better — preserves type):\\nfunction logAllGeneric<T extends object>(obj: T) {\\n  for (const key in obj) console.log(key, obj[key as keyof T]);\\n}\\nlogAllGeneric(user); // ✅\\n\\n// 3. Use Object.entries (cleanest):\\nObject.entries(user).forEach(([k, v]) => console.log(k, v));\\n\`\`\`"
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Read error messages bottom-up — the deepest indented line is often the root cause", "Extract intermediate types into named aliases to debug complex generics step-by-step", "Use 'satisfies' to validate shape without losing literal type inference", "Recursive types can be made tail-recursive (accumulator pattern) to avoid depth limits", "Function parameter types are contravariant — callers can't assume extra args exist"]
\`\`\`
`,
    },
    {
      id: "typescript-interview-qa",
      slug: "typescript-interview-qa",
      title: "TypeScript Interview Questions: Expert Answers",
      content: `# TypeScript Interview Questions

These are the questions that separate "knows TypeScript" from "thinks in TypeScript."

---

## Q1: What is structural typing and why does TypeScript use it?

\`\`\`typescript
// TypeScript is structurally typed (duck typing), not nominally typed.
// Two types are compatible if they have the same structure — the name doesn't matter.

interface Point2D { x: number; y: number; }
interface Vector2D { x: number; y: number; } // Different name, same shape

function render(point: Point2D) { console.log(point.x, point.y); }

const v: Vector2D = { x: 1, y: 2 };
render(v); // ✅ — structure matches, TypeScript accepts it

// WHY: JavaScript doesn't have classes in the nominal sense.
// Any object with the right properties works. TypeScript models this reality.
// Contrast: Java/C# are nominally typed — same-shaped objects of different types
// are NOT compatible. TypeScript would break every existing JS pattern if it were nominal.
\`\`\`

## Q2: Explain the difference between \`unknown\` and \`any\`

\`\`\`typescript
// any: opt out of type checking entirely
// unknown: "I don't know the type yet" — forces you to narrow before using

function processAny(value: any) {
  value.toUpperCase(); // ✅ (no error — any disables checking)
  value * 2;           // ✅ (no error — dangerous!)
}

function processUnknown(value: unknown) {
  value.toUpperCase(); // ❌ Error: Object is of type 'unknown'
  value * 2;           // ❌ Error

  // Must narrow first:
  if (typeof value === 'string') {
    value.toUpperCase(); // ✅ — TypeScript knows it's a string now
  }
}

// Rule of thumb:
// - Use 'unknown' for external data, catch blocks, dynamic imports
// - Never use 'any' in production code (it's a bug magnet)
// - 'any' propagates — any + anything = any, silently swallowing errors
\`\`\`

## Q3: What are declaration files (.d.ts) and when do you write them?

\`\`\`typescript
// .d.ts files contain type declarations without implementation.
// Three scenarios where you write them:

// 1. Typing an untyped JS library:
// types/legacy-lib.d.ts
declare module 'legacy-lib' {
  export function doThing(input: string): Promise<{ result: string }>;
  export const VERSION: string;
}

// 2. Global type augmentation:
// types/globals.d.ts
declare global {
  interface Window {
    analytics: { track: (event: string, props?: object) => void };
  }
  const __DEV__: boolean; // global injected by bundler
}

// 3. Ambient declarations for non-JS files:
// types/media.d.ts
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
declare module '*.png' {
  const url: string;
  export default url;
}
\`\`\`

## Q4: How do you handle the \`this\` type in TypeScript?

\`\`\`typescript
// TypeScript can type 'this' explicitly as a fake first parameter:

class EventEmitter {
  private handlers: Map<string, Function[]> = new Map();

  on(event: string, handler: Function): this { // returns 'this' for chaining
    if (!this.handlers.has(event)) this.handlers.set(event, []);
    this.handlers.get(event)!.push(handler);
    return this;
  }

  emit(event: string, ...args: any[]): this {
    this.handlers.get(event)?.forEach(h => h(...args));
    return this;
  }
}

class TypedEmitter extends EventEmitter {
  listen() { return this; } // 'this' is TypedEmitter here, not EventEmitter
}

const emitter = new TypedEmitter();
emitter.on('click', () => {}).listen(); // ✅ — chaining returns TypedEmitter

// 'this' as parameter in standalone functions:
function validateUser(this: { minAge: number }, user: { age: number }): boolean {
  return user.age >= this.minAge;
}

const validator = validateUser.bind({ minAge: 18 });
validator({ age: 20 }); // ✅
\`\`\`

## Q5: When should you use \`interface\` vs \`type\`?

\`\`\`typescript
// INTERFACE — prefer when:
// 1. You want declaration merging (augmenting third-party types)
interface Config { debug: boolean; }
interface Config { port: number; }     // Merges! { debug: boolean; port: number }

// 2. You're modeling a class contract (implements)
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

// TYPE — prefer when:
// 1. Union / intersection types
type Status = 'active' | 'inactive' | 'pending';
type AdminUser = User & Admin;

// 2. Utility types and transformations
type ReadonlyUser = Readonly<User>;
type PartialConfig = Partial<Config>;

// 3. Conditional types, mapped types, template literals
type Getters<T> = { [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K] };

// PRACTICAL RULE: Use 'interface' for object shapes that others will implement.
// Use 'type' for everything else (unions, intersections, computed types).
// The difference is rarely important — pick one and be consistent.
\`\`\`

## Q6: What is \`satisfies\` and when would you use it over \`as\` or annotations?

\`\`\`typescript
// Three ways to ensure a value conforms to a type:

// 1. Type annotation — widens the type
const colors: Record<string, string> = {
  red: '#ff0000',
  green: '#00ff00',
};
// colors.red is 'string' — lost the literal '#ff0000'

// 2. 'as' assertion — no validation, dangerous
const colors2 = { red: '#ff0000', green: '#00ff00' } as Record<string, string>;
// Same problem: widens to string. Also skips all type checking.

// 3. 'satisfies' (TS 4.9) — validates AND preserves
const colors3 = {
  red: '#ff0000',
  green: '#00ff00',
} satisfies Record<string, string>;
// colors3.red is '#ff0000' (literal type preserved!)
// AND TypeScript validates the value matches Record<string, string>

// Perfect for config objects and constants:
const routes = {
  home: '/',
  about: '/about',
  dashboard: '/dashboard',
} satisfies Record<string, \`/\${string}\`>; // validates all values start with /
// Individual values keep their literal types for autocomplete
\`\`\`

\`\`\`takeaways
["Structural typing: TypeScript cares about shape, not name — two types with the same fields are compatible", "unknown forces narrowing before use; any bypasses all checking — never use any in production", ".d.ts files type untyped libs, augment globals, and declare non-JS module imports", "Return 'this' from methods to enable fluent chaining that infers the correct subclass", "interface vs type: use interface for class contracts + merging; type for unions/transforms/computed", "satisfies validates shape while preserving literal types — the right tool for typed constants"]
\`\`\`
`,
    },
  ],
};
