import { Module } from "../types";

export const module5: Module = {
  id: "typescript-bridge",
  title: "TypeScript: Types, Interfaces & Generics",
  description: "TypeScript fundamentals for JavaScript developers — types, interfaces, generics, utility types, and real-world patterns",
  lessons: [
    {
      id: "types-interfaces",
      slug: "types-interfaces",
      title: "Types, Interfaces & Type Narrowing",
      content: `
# TypeScript for JavaScript Developers

TypeScript is a statically typed superset of JavaScript. Every valid JS file is valid TS — you add types incrementally.

## Primitive Types & Basic Annotations

\`\`\`typescript
// Primitives:
let name: string = 'Alice';
let age: number = 30;
let active: boolean = true;
let nothing: null = null;
let missing: undefined = undefined;
let anything: unknown = 42;       // prefer over 'any'
let wild: any = 'anything goes';  // opt out of type checking

// Arrays:
let nums: number[] = [1, 2, 3];
let strs: Array<string> = ['a', 'b'];
let tuple: [string, number] = ['Alice', 30]; // fixed-length, fixed-type

// Literal types — constrain to specific values:
let direction: 'north' | 'south' | 'east' | 'west' = 'north';
let status: 200 | 404 | 500 = 200;

// Functions:
function add(a: number, b: number): number { return a + b; }
const greet = (name: string, greeting?: string): string =>
  \`\${greeting ?? 'Hello'}, \${name}!\`;

// Object type annotation:
function printUser(user: { name: string; age: number; email?: string }): void {
  console.log(user.name, user.age);
}
\`\`\`

## Type vs Interface

\`\`\`typescript
// Interface — for object shapes, extendable, can be merged (declaration merging)
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

interface AdminUser extends User {
  permissions: string[];
  isSuperAdmin: boolean;
}

// Type alias — for anything, including unions and primitives
type ID = string | number;
type Status = 'pending' | 'active' | 'inactive';
type Nullable<T> = T | null;

// For objects, type and interface are nearly equivalent:
type Product = {
  id: number;
  name: string;
  price: number;
};

// Intersection (type) vs extension (interface):
type Staff = User & { department: string; salary: number };

// When to use which:
// - Library/public API: interface (declaration merging is useful)
// - Internal code: either — prefer consistency
// - Union types, tuples, mapped types: type alias (interface can't)
\`\`\`

## Type Narrowing

\`\`\`typescript
// TypeScript narrows union types based on checks

function processInput(input: string | number | null) {
  if (input === null) {
    // TypeScript knows: input is null here
    return 'nothing';
  }

  if (typeof input === 'string') {
    // TypeScript knows: input is string here
    return input.toUpperCase();
  }

  // TypeScript knows: input is number here
  return input.toFixed(2);
}

// Discriminated unions — add a 'type' field:
type Circle = { kind: 'circle'; radius: number };
type Rectangle = { kind: 'rect'; width: number; height: number };
type Shape = Circle | Rectangle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':  return Math.PI * shape.radius ** 2;
    case 'rect':    return shape.width * shape.height;
    // TypeScript ensures exhaustiveness — add a new variant and it warns here
  }
}

// Type guards:
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  );
}

if (isUser(data)) {
  // TypeScript knows data is User here
  console.log(data.name);
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the difference between 'unknown' and 'any'?",
      "options": [
        "No difference",
        "unknown is type-safe: you must narrow it before use; any opts out of all checks",
        "any is stricter than unknown",
        "unknown is only for null/undefined"
      ],
      "answer": 1,
      "explanation": "With 'any', TypeScript lets you do anything without checks. With 'unknown', you must narrow the type (with typeof, instanceof, or a type guard) before you can use it. Prefer unknown for external data — it forces you to validate."
    },
    {
      "q": "When should you use 'interface' over 'type'?",
      "options": [
        "Always — interfaces are always better",
        "For object shapes that need to be extended or merged (declaration merging); type for unions, tuples, and mapped types",
        "Never — type is always better",
        "Only when using classes"
      ],
      "answer": 1,
      "explanation": "Interface is ideal for object shapes in public APIs (declaration merging lets consumers extend them). Type alias is more powerful for unions, intersections, conditional types, and mapped types. In practice, both work for objects — choose one and be consistent."
    }
  ]
}
\`\`\`
`,
    },
    {
      id: "generics-utility",
      slug: "generics-utility",
      title: "Generics, Utility Types & Advanced TypeScript",
      content: `
# Generics & Utility Types

## Generics

\`\`\`typescript
// Generics: write code that works for multiple types

// Generic function:
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
first([1, 2, 3]);     // inferred as number | undefined
first(['a', 'b']);    // inferred as string | undefined

// Generic interface:
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
}

type UsersResponse = ApiResponse<User[]>;
type PostResponse = ApiResponse<Post>;

// Generic class:
class Stack<T> {
  #items: T[] = [];
  push(item: T): void { this.#items.push(item); }
  pop(): T | undefined { return this.#items.pop(); }
  peek(): T | undefined { return this.#items[this.#items.length - 1]; }
  get size(): number { return this.#items.length; }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
numStack.pop(); // 2

// Constraints: limit what T can be
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { name: 'Alice', age: 30 };
getProperty(user, 'name');  // string
getProperty(user, 'age');   // number
// getProperty(user, 'foo'); // Error: not a key of user!
\`\`\`

## Built-in Utility Types

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Partial<T> — all properties optional:
type UserPatch = Partial<User>;
// { id?: number; name?: string; email?: string; ... }

// Required<T> — all properties required:
type StrictUser = Required<Partial<User>>; // same as User

// Pick<T, K> — select specific keys:
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

// Omit<T, K> — exclude specific keys:
type UserWithoutPassword = Omit<User, 'password'>;

// Readonly<T> — prevent mutation:
const config: Readonly<{ url: string; timeout: number }> = {
  url: 'https://api.example.com',
  timeout: 5000,
};
// config.url = 'other'; // Error!

// Record<K, V> — object with specific key/value types:
type RolePermissions = Record<'admin' | 'editor' | 'viewer', string[]>;

// ReturnType<T> — infer function return type:
function getUser() { return { id: 1, name: 'Alice' }; }
type UserResult = ReturnType<typeof getUser>; // { id: number; name: string }

// Parameters<T> — infer function parameters:
type FetchParams = Parameters<typeof fetch>; // [input: RequestInfo, init?: RequestInit]

// Awaited<T> — unwrap Promise type:
type UserData = Awaited<ReturnType<typeof fetchUser>>; // the resolved type
\`\`\`

## Conditional & Mapped Types

\`\`\`typescript
// Conditional types: T extends U ? X : Y
type NonNullable<T> = T extends null | undefined ? never : T;
type IsArray<T> = T extends any[] ? true : false;

// Mapped types: transform every property
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// Template literal types (TS 4.1+):
type EventName = 'click' | 'focus' | 'blur';
type Handler = \`on\${Capitalize<EventName>}\`; // 'onClick' | 'onFocus' | 'onBlur'

type CRUDActions<T extends string> = \`\${T}Created\` | \`\${T}Updated\` | \`\${T}Deleted\`;
type UserActions = CRUDActions<'user'>; // 'userCreated' | 'userUpdated' | 'userDeleted'

// Infer keyword — extract types from complex structures:
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type UnpackArray<T> = T extends (infer U)[] ? U : T;

type Str = UnpackPromise<Promise<string>>; // string
type Num = UnpackArray<number[]>;          // number
\`\`\`

## Real-World TypeScript Patterns

\`\`\`typescript
// 1. Type-safe event system:
type Events = {
  login: { userId: string; timestamp: Date };
  logout: { userId: string };
  purchase: { userId: string; amount: number; items: string[] };
};

class TypedEmitter<T extends Record<string, any>> {
  private listeners = new Map<keyof T, Set<Function>>();

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener);
  }

  emit<K extends keyof T>(event: K, data: T[K]) {
    this.listeners.get(event)?.forEach(l => l(data));
  }
}

const emitter = new TypedEmitter<Events>();
emitter.on('login', ({ userId }) => console.log(userId)); // fully typed!
emitter.emit('purchase', { userId: '1', amount: 99.99, items: ['widget'] });

// 2. Builder pattern with chaining:
class QueryBuilder<T> {
  private conditions: string[] = [];
  private orderByField?: string;
  private limitCount?: number;

  where(condition: string): this { this.conditions.push(condition); return this; }
  orderBy(field: keyof T): this { this.orderByField = field as string; return this; }
  limit(n: number): this { this.limitCount = n; return this; }

  build(): string {
    let query = 'SELECT *';
    if (this.conditions.length) query += \` WHERE \${this.conditions.join(' AND ')}\`;
    if (this.orderByField) query += \` ORDER BY \${this.orderByField}\`;
    if (this.limitCount) query += \` LIMIT \${this.limitCount}\`;
    return query;
  }
}

new QueryBuilder<User>()
  .where('active = true')
  .orderBy('name')
  .limit(10)
  .build();
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does keyof T return?",
      "options": [
        "The values of T",
        "A union type of all keys of T",
        "An array of T's keys",
        "The number of keys in T"
      ],
      "answer": 1,
      "explanation": "keyof T produces a union of all property names (keys) of type T as string/number/symbol literals. For type User = { name: string; age: number }, keyof User = 'name' | 'age'."
    },
    {
      "q": "What does Omit<User, 'password'> do?",
      "options": [
        "Removes 'password' at runtime",
        "Creates a type with all User properties except 'password'",
        "Makes 'password' optional",
        "Throws a compile error"
      ],
      "answer": 1,
      "explanation": "Omit<T, K> creates a new type by removing the specified keys from T. It's a type-level operation only — no runtime effect. Useful for creating safe public-facing types from internal models."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
