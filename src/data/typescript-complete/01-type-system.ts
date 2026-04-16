import { Module } from "../types";

export const module1: Module = {
  id: "type-system",
  title: "The TypeScript Type System",
  description: "How TypeScript's structural type system works, type inference, widening/narrowing, and the differences from nominal type systems",
  lessons: [
    {
      id: "why-typescript",
      slug: "why-typescript",
      title: "Why TypeScript? Structural Types & Type Inference",
      content: `# Why TypeScript?

TypeScript is JavaScript with a type system bolted on at development time. The compiled output is plain JavaScript — types are erased. What you get in return is a **compile-time safety net** that catches entire classes of bugs before your code runs.

TypeScript adoption grew 301% year-over-year. Every major JS project — React, Angular, Vue, Node frameworks — ships TypeScript definitions. Understanding *why* pays dividends throughout your career.

---

\`\`\`concept
{
  "title": "TypeScript's Core Guarantee",
  "variant": "mental-model",
  "content": "TypeScript checks types at compile time, not runtime. A TypeScript error is a guarantee that a category of runtime error cannot happen. The TS compiler is essentially a proof system: if it compiles, the types are consistent. If it errors, something is wrong before a single user sees it."
}
\`\`\`

---

## Structural vs. Nominal Typing

Most typed languages (Java, C#, Swift) use **nominal typing**: two types are compatible only if they explicitly declare the relationship (implements, extends).

TypeScript uses **structural typing**: two types are compatible if they have the same *shape* — same properties, same types on those properties. The names don't matter.

\`\`\`typescript
// Nominal typing (Java-like — TypeScript does NOT work this way):
// class Dog implements Animal { ... } // must DECLARE the relationship

// Structural typing (TypeScript — shape is all that matters):
interface Animal {
  name: string;
  move(): void;
}

// This works even with NO 'implements Animal' declaration:
class Dog {
  name: string;
  breed: string;
  constructor(name: string, breed: string) {
    this.name = name;
    this.breed = breed;
  }
  move() { console.log(\`\${this.name} runs\`); }
}

function describe(animal: Animal) {
  console.log(animal.name);
  animal.move();
}

describe(new Dog('Rex', 'Labrador')); // ✅ works — Dog has all Animal's properties
// TypeScript checks: does Dog have 'name: string'? Yes. 'move(): void'? Yes. Compatible.
\`\`\`

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Structural (TS)",
      "icon": "🧩",
      "content": "### Duck Typing at Compile Time\\n\\nIf it has the right properties, it is the right type. Name and declaration don't matter.\\n\\n\`\`\`typescript\\ninterface Point { x: number; y: number; }\\n\\nconst p = { x: 1, y: 2, label: 'origin' }; // extra props OK\\nfunction plot(pt: Point) { ... }\\nplot(p); // ✅ — p has x and y, extra 'label' is fine\\n\`\`\`\\n\\n**Benefit:** You can satisfy interfaces without modifying source. Great for working with third-party types."
    },
    {
      "label": "Nominal (Java)",
      "icon": "🏷️",
      "content": "### Name-Based Compatibility\\n\\nTwo classes are compatible only through explicit declaration.\\n\\n\`\`\`java\\ninterface Point { int x(); int y(); }\\nclass MyPoint implements Point { // MUST declare\\n  public int x() { return 1; }\\n  public int y() { return 2; }\\n}\\n\`\`\`\\n\\n**Benefit:** Prevents accidental compatibility — two types that happen to share shape are not interchangeable unless they explicitly say so."
    },
    {
      "label": "When TS Acts Nominal",
      "icon": "⚠️",
      "content": "### Branded Types Simulate Nominal Typing\\n\\n\`\`\`typescript\\n// Problem: both are 'number', but mixing them is a bug\\ntype UserId = number;\\ntype OrderId = number;\\nfunction getUser(id: UserId) { ... }\\nconst orderId: OrderId = 42;\\ngetUser(orderId); // ✅ compiles — same underlying type!\\n\\n// Fix: brand the type\\ntype UserId = number & { _brand: 'UserId' };\\ntype OrderId = number & { _brand: 'OrderId' };\\nfunction makeUserId(n: number): UserId { return n as UserId; }\\nconst uid = makeUserId(1);\\nconst oid = 42 as OrderId;\\ngetUser(uid);  // ✅\\ngetUser(oid);  // ❌ Error: OrderId is not UserId\\n\`\`\`"
    }
  ]
}
\`\`\`

---

## Type Inference — TypeScript Reads Your Mind

TypeScript infers types from context — you rarely need to annotate everything.

\`\`\`typescript
// Inference from assignment:
let name = 'Alice';     // inferred: string
let count = 0;          // inferred: number
let active = true;      // inferred: boolean
const pi = 3.14159;     // inferred: 3.14159 (literal type — const can't change)

// Inference from function return:
function add(a: number, b: number) {
  return a + b; // return type inferred as number
}

// Inference from array literals:
const nums = [1, 2, 3];         // number[]
const mixed = [1, 'hello'];     // (number | string)[]
const tuple = [1, 'hello'] as const; // readonly [1, "hello"] — literal

// Inference in objects:
const user = {
  id: 1,
  name: 'Alice',
  roles: ['admin', 'editor'],
};
// Inferred: { id: number; name: string; roles: string[] }

// Contextual typing (TypeScript uses context to infer):
const nums2 = [1, 2, 3];
nums2.map(n => n.toFixed(2)); // n is inferred as number from nums2's type
\`\`\`

---

## Type Widening and Narrowing

\`\`\`concept
{
  "title": "Widening vs. Narrowing",
  "variant": "mental-model",
  "content": "Widening: TypeScript makes a type more general (e.g., literal 'hello' → string). Narrowing: TypeScript makes a type more specific based on control flow (e.g., string | null → string). Widening happens at assignments. Narrowing happens inside if/switch/instanceof blocks."
}
\`\`\`

\`\`\`typescript
// WIDENING — let widens, const narrows:
let x = 'hello';   // widened to: string
const y = 'hello'; // literal type: "hello"

// Prevent widening with 'as const':
let config = { host: 'localhost', port: 8080 } as const;
// Type: { readonly host: "localhost"; readonly port: 8080 }

// NARROWING — TypeScript tracks type guards:
function process(value: string | number | null) {
  // value: string | number | null

  if (value === null) {
    // value: null
    return 'nothing';
  }
  // value: string | number (null eliminated)

  if (typeof value === 'string') {
    // value: string
    return value.toUpperCase();
  }
  // value: number (string eliminated)

  return value.toFixed(2);
}

// Narrowing with 'in' operator:
type Cat = { meow(): void };
type Dog = { bark(): void };

function makeSound(animal: Cat | Dog) {
  if ('meow' in animal) {
    animal.meow(); // animal: Cat
  } else {
    animal.bark(); // animal: Dog
  }
}

// Narrowing with instanceof:
function format(value: Date | string) {
  if (value instanceof Date) {
    return value.toISOString(); // value: Date
  }
  return value.trim();          // value: string
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "TypeScript uses structural typing. What does that mean?",
      "options": [
        "Types must be declared with 'type' or 'interface'",
        "Two types are compatible if they have the same shape (properties and their types), regardless of names or explicit declarations",
        "Types are checked at runtime",
        "Only classes can be used as types"
      ],
      "answer": 1,
      "explanation": "Structural typing means compatibility is based on the shape (structure) of the type. If object A has all the properties required by type B, A is compatible with B — even if A never explicitly declares it implements B. This is different from Java/C# which require explicit interface declarations."
    },
    {
      "q": "What is the difference between 'let x = 42' and 'const x = 42' in terms of TypeScript types?",
      "options": [
        "No difference",
        "let infers 'number' (widened); const infers the literal type '42'",
        "const is always 'any'",
        "let infers the literal type, const widens to number"
      ],
      "answer": 1,
      "explanation": "Because const can never be reassigned, TypeScript narrows the type to the specific literal value (42). Because let can be reassigned to any number, TypeScript widens it to the general 'number' type. This matters when building union types and discriminated unions."
    }
  ]
}
\`\`\`
`,
    },
    {
      id: "advanced-types",
      slug: "advanced-types",
      title: "Union Types, Intersection, Discriminated Unions & the 'never' Type",
      content: `# Advanced Type Compositions

## Union Types in Depth

\`\`\`typescript
// Union: A | B — value can be either type
type StringOrNumber = string | number;
type ID = string | number;
type NullableString = string | null;

// Discriminated union — add a literal 'kind' field as a tag:
type Circle    = { kind: 'circle';    radius: number };
type Rectangle = { kind: 'rectangle'; width: number; height: number };
type Triangle  = { kind: 'triangle';  base: number;  height: number };
type Shape = Circle | Rectangle | Triangle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':    return Math.PI * shape.radius ** 2;
    case 'rectangle': return shape.width * shape.height;
    case 'triangle':  return 0.5 * shape.base * shape.height;
    // TypeScript exhaustiveness check: add 'never' to catch missing cases
    default:
      const _exhaustive: never = shape; // errors if Shape has unhandled variant
      return _exhaustive;
  }
}

// This is how Redux actions work, how React props variants work,
// and how most real-world discriminated unions are modeled.
\`\`\`

\`\`\`concept
{
  "title": "The 'never' Type",
  "variant": "mental-model",
  "content": "'never' is the bottom type — a value that can never exist. A function that always throws returns 'never'. A variable of type 'never' in a switch default means TypeScript has proven that branch is unreachable. If you add a new variant to Shape and forget to handle it, the 'never' assignment will fail — catching the bug at compile time."
}
\`\`\`

## Intersection Types

\`\`\`typescript
// Intersection: A & B — value must satisfy BOTH types
type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged; // { name: string; age: number }

// Useful for mixins and composition:
type Serializable = { serialize(): string };
type Persistable = { save(): Promise<void>; load(id: string): Promise<void> };
type Repository<T> = Serializable & Persistable & { findAll(): Promise<T[]> };

// Intersection of function types:
type EventHandler = ((event: MouseEvent) => void) & ((event: KeyboardEvent) => void);
// This represents a function that handles BOTH event types (overloads)
\`\`\`

## Template Literal Types (TS 4.1+)

\`\`\`typescript
// Build string types from combinations:
type Direction = 'top' | 'right' | 'bottom' | 'left';
type CSSProperty = \`margin-\${Direction}\` | \`padding-\${Direction}\`;
// 'margin-top' | 'margin-right' | 'margin-bottom' | 'margin-left'
// | 'padding-top' | 'padding-right' | 'padding-bottom' | 'padding-left'

// Event handler naming pattern:
type Event = 'click' | 'focus' | 'blur' | 'change';
type Handler = \`on\${Capitalize<Event>}\`;
// 'onClick' | 'onFocus' | 'onBlur' | 'onChange'

// Type-safe object property paths:
type Flatten<T extends object> = {
  [K in keyof T]: T[K] extends object
    ? \`\${string & K}.\${string & keyof T[K]}\`
    : \`\${string & K}\`;
}[keyof T];

type Config = { db: { host: string; port: number }; app: { name: string } };
type ConfigPath = Flatten<Config>; // 'db.host' | 'db.port' | 'app.name'

// Practical: CSS-in-TS variable names:
type ColorScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type CSSVar = \`--color-\${string}-\${ColorScale}\`;
// '--color-blue-1' | '--color-blue-2' | ... (pattern)
\`\`\`

## Type Guards — Custom Narrowing Functions

\`\`\`typescript
// Type predicate: 'value is Type'
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUser(obj: unknown): obj is { id: number; name: string; email: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as any).id === 'number' &&
    typeof (obj as any).name === 'string' &&
    typeof (obj as any).email === 'string'
  );
}

// Usage:
const data: unknown = JSON.parse(response);
if (isUser(data)) {
  // TypeScript knows: data is { id: number; name: string; email: string }
  console.log(data.name.toUpperCase());
}

// Assertion functions (TS 3.7):
function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== 'string') throw new TypeError('Expected string');
}

function processValue(val: unknown) {
  assertIsString(val);
  // After the assertion, val is narrowed to 'string' for the rest of the function
  console.log(val.toUpperCase());
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the purpose of the 'never' type in a switch/default?",
      "options": [
        "It makes the switch statement optional",
        "Assigning to 'never' in a default branch causes a compile error if any union variant is unhandled — exhaustiveness checking",
        "It prevents TypeScript from checking the switch at all",
        "'never' is deprecated in TypeScript 5"
      ],
      "answer": 1,
      "explanation": "If all variants of a union are handled in a switch, TypeScript knows the default branch is unreachable and the type of 'shape' there is 'never'. Assigning 'never' to a 'never'-typed variable is fine. But if you add a new Shape variant without handling it, shape in the default is no longer 'never' — and the assignment fails with a type error. This is compile-time exhaustiveness checking."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
