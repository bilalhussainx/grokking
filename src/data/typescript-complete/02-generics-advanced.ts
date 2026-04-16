import { Module } from "../types";

export const module2: Module = {
  id: "generics-advanced",
  title: "Generics, Constraints & Conditional Types",
  description: "Generic functions, classes, constraints with keyof/extends, infer keyword, conditional types, and mapped types in depth",
  lessons: [
    {
      id: "generics-deep-dive",
      slug: "generics-deep-dive",
      title: "Generics: From Basics to Higher-Kinded Patterns",
      content: `# Generics in Depth

Generics are TypeScript's mechanism for writing code that works over a range of types while preserving type information through the operation.

---

\`\`\`concept
{
  "title": "Why Generics?",
  "variant": "mental-model",
  "content": "Without generics, you'd write the same logic for each type (duplication) or use 'any' (loses safety). Generics give you a type variable — a placeholder that gets filled in by the caller — so you write once and TypeScript verifies correctness for each concrete use."
}
\`\`\`

---

## Generic Functions — Preserving Type Through Operations

\`\`\`typescript
// Without generics: loses type information
function identity_any(value: any): any { return value; }
const result = identity_any(42); // type: any — lost!

// With generics: type flows through
function identity<T>(value: T): T { return value; }
const n = identity(42);      // type: number — preserved
const s = identity('hello'); // type: string — preserved

// Multiple type parameters:
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}
const p = pair('Alice', 30); // type: [string, number]

// Generic function with conditional return:
function firstOrDefault<T>(arr: T[], defaultValue: T): T {
  return arr.length > 0 ? arr[0] : defaultValue;
}
const first = firstOrDefault([1, 2, 3], 0);    // number
const name = firstOrDefault([], 'unknown');     // string

// Real-world: type-safe fetch wrapper
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json() as Promise<T>;
}

interface User { id: number; name: string; email: string; }
const user = await fetchJson<User>('/api/users/1'); // type: User — fully typed!
\`\`\`

## Constraints — Limiting What T Can Be

\`\`\`typescript
// T extends SomeType — T must be assignable to SomeType

// Ensure T has a 'length' property:
function logLength<T extends { length: number }>(value: T): T {
  console.log(value.length);
  return value;
}
logLength('hello');      // ✅ string has .length
logLength([1, 2, 3]);    // ✅ arrays have .length
logLength({ length: 5 }); // ✅ plain object with .length
// logLength(42);         // ❌ number has no .length

// keyof constraint — type-safe property access:
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { id: 1, name: 'Alice', age: 30 };
const name = getProperty(user, 'name');   // type: string ✅
const id   = getProperty(user, 'id');     // type: number ✅
// getProperty(user, 'missing');           // ❌ compile error

// Default type parameters (TS 2.3+):
interface Container<T = string> {
  value: T;
  transform<U = T>(fn: (v: T) => U): Container<U>;
}
\`\`\`

## Conditional Types

\`\`\`typescript
// T extends U ? X : Y — branch on type relationship
type IsString<T> = T extends string ? 'yes' : 'no';
type A = IsString<string>;  // 'yes'
type B = IsString<number>;  // 'no'

// Distributive conditional types (auto-distributes over unions):
type NonNullable<T> = T extends null | undefined ? never : T;
type C = NonNullable<string | null | undefined>; // string

// Extract and Exclude (built into TypeScript):
type Extract<T, U> = T extends U ? T : never;
type Exclude<T, U> = T extends U ? never : T;

type OnlyStrings = Extract<string | number | boolean, string>;  // string
type NoStrings   = Exclude<string | number | boolean, string>;  // number | boolean

// Infer — extract a type from a structure:
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type ElementType<T> = T extends (infer E)[] ? E : never;
type PromiseValue<T> = T extends Promise<infer V> ? V : never;

function fetchUser(): Promise<{ id: number; name: string }> { return fetch('/user').then(r => r.json()); }
type UserType = PromiseValue<ReturnType<typeof fetchUser>>;
// type UserType = { id: number; name: string }

// Deep infer — extract parameter types:
type FirstParam<T extends (...args: any[]) => any> =
  T extends (first: infer P, ...rest: any[]) => any ? P : never;

function greet(name: string, age: number): string { return ''; }
type Name = FirstParam<typeof greet>; // string
\`\`\`

## Mapped Types

\`\`\`typescript
// Transform every property of a type
// Syntax: { [K in keyof T]: NewType }

// Make all properties optional:
type Partial<T> = { [K in keyof T]?: T[K] };

// Make all properties required:
type Required<T> = { [K in keyof T]-?: T[K] }; // -? removes optionality

// Make all properties readonly:
type Readonly<T> = { readonly [K in keyof T]: T[K] };

// Remove readonly:
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

// Transform values:
type Stringify<T> = { [K in keyof T]: string };
type Nullable<T> = { [K in keyof T]: T[K] | null };

// Filter properties by value type:
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
}
type StringFields = PickByValue<User, string>;
// { name: string; email: string }

// Key remapping (TS 4.1+):
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};
type UserGetters = Getters<User>;
// { getId: () => number; getName: () => string; ... }
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does 'infer' do in a conditional type?",
      "options": [
        "Infers the type from a variable assignment",
        "Declares a type variable to capture and extract a type from within a structure being matched",
        "Makes TypeScript skip type checking",
        "Converts a value to its type"
      ],
      "answer": 1,
      "explanation": "In 'T extends Promise<infer V> ? V : never', 'infer V' declares a type variable V that captures whatever type is inside the Promise. If T is Promise<string>, V is string. 'infer' can only appear in the extends clause of a conditional type."
    },
    {
      "q": "What does the -? modifier do in a mapped type?",
      "options": [
        "Makes properties optional",
        "Removes optionality — makes optional properties required",
        "Removes properties from the type",
        "Negates the boolean value"
      ],
      "answer": 1,
      "explanation": "In mapped types, ? adds optionality and -? removes it. The built-in Required<T> uses { [K in keyof T]-?: T[K] } to strip the optional marker from every property. Similarly, -readonly removes the readonly modifier."
    }
  ]
}
\`\`\`
`,
      starterCode: `// Build a type-safe EventEmitter class using generics.
// EventMap defines the event names and their payload types.
// on(event, listener) — subscribe
// emit(event, payload) — publish
// off(event, listener) — unsubscribe

type EventMap = {
  login: { userId: string; timestamp: Date };
  logout: { userId: string };
  purchase: { userId: string; amount: number; productId: string };
  error: { message: string; code: number };
};

class TypedEventEmitter<T extends Record<string, any>> {
  // TODO: implement with proper generic types
  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    // TODO
  }

  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    // TODO
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    // TODO
  }
}

// Test — all of these should type-check:
const emitter = new TypedEventEmitter<EventMap>();
emitter.on('login', ({ userId, timestamp }) => {
  console.log(userId, timestamp); // fully typed!
});
emitter.emit('purchase', { userId: '1', amount: 99, productId: 'abc' });
// emitter.emit('login', { wrong: true }); // should be a compile error`,
      solutionCode: `class TypedEventEmitter<T extends Record<string, any>> {
  private listeners = new Map<keyof T, Set<(data: any) => void>>();

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    this.listeners.get(event)?.delete(listener);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.listeners.get(event)?.forEach(listener => listener(data));
  }

  once<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    const wrapper = (data: T[K]) => {
      listener(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}`,
    },
  ],
};
