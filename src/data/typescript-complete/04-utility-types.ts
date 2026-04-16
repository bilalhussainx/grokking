import { Module } from "../types";

export const module4: Module = {
  id: "utility-types",
  title: "Utility Types, Declaration Merging & Module Augmentation",
  description: "Deep dive into built-in utility types, writing custom utilities, declaration merging, and augmenting third-party types",
  lessons: [
    {
      id: "utility-types-mastery",
      slug: "utility-types-mastery",
      title: "All Built-in Utility Types & Custom Utilities",
      content: `# Utility Types Mastery

TypeScript ships dozens of built-in utility types. Knowing them prevents reinventing the wheel and signals maturity in TypeScript to reviewers.

---

## Complete Utility Type Reference

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: Date;
  lastLogin?: Date;
}

// ─── Object transformation ───────────────────────────────────────────────────

// Partial<T> — all properties optional
type UserDraft = Partial<User>;

// Required<T> — all properties required (removes ?)
type StrictUser = Required<User>;

// Readonly<T> — all properties readonly
type ImmutableUser = Readonly<User>;

// Pick<T, K> — select subset of keys
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

// Omit<T, K> — exclude specific keys
type SafeUser = Omit<User, 'password'>;

// Record<K, V> — object with specific key/value types
type RolePermissions = Record<User['role'], string[]>;
type RoleLabel = Record<'admin' | 'editor' | 'viewer', string>;

// ─── Union manipulation ───────────────────────────────────────────────────────

// Exclude<T, U> — remove U from T union
type NonAdminRole = Exclude<User['role'], 'admin'>;  // 'editor' | 'viewer'

// Extract<T, U> — keep only members of T that extend U
type AdminRole = Extract<User['role'], 'admin'>;      // 'admin'

// NonNullable<T> — remove null and undefined
type DefiniteString = NonNullable<string | null | undefined>;  // string

// ─── Function types ───────────────────────────────────────────────────────────

// ReturnType<T> — extract return type of a function
function getUser(): User { return {} as User; }
type UserResult = ReturnType<typeof getUser>;  // User

// Parameters<T> — extract parameters as tuple
type FetchParams = Parameters<typeof fetch>;   // [input: RequestInfo, init?: RequestInit]

// ConstructorParameters<T> — constructor params
type DateParams = ConstructorParameters<typeof Date>;

// InstanceType<T> — instance type from constructor
type PromiseInstance = InstanceType<typeof Promise>;  // Promise<any>

// Awaited<T> — unwrap nested Promise types (TS 4.5+)
type UserAsync = Awaited<Promise<Promise<User>>>;     // User

// ─── String manipulation (TS 4.1+) ───────────────────────────────────────────

type Upper   = Uppercase<'hello'>;    // 'HELLO'
type Lower   = Lowercase<'HELLO'>;   // 'hello'
type Cap     = Capitalize<'hello'>;  // 'Hello'
type Uncap   = Uncapitalize<'Hello'>; // 'hello'
\`\`\`

## Building Custom Utility Types

\`\`\`typescript
// DeepPartial — make nested objects optional too:
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends Function ? T[K] : DeepPartial<T[K]>
    : T[K];
};

// DeepReadonly — make nested objects readonly:
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function ? T[K] : DeepReadonly<T[K]>
    : T[K];
};

// Prettify — expand intersections for readable hover:
type Prettify<T> = { [K in keyof T]: T[K] } & {};

// XOR — exactly one of A or B (not both):
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

// TupleToUnion:
type TupleToUnion<T extends any[]> = T[number];
type Colors = TupleToUnion<['red', 'green', 'blue']>; // 'red' | 'green' | 'blue'

// UnionToIntersection — flip union to intersection:
type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;
type Merged = UnionToIntersection<{ a: string } | { b: number }>; // { a: string } & { b: number }

// Path — all dot-notation property paths:
type PathKeys<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends object
    ? PathKeys<T[K], \`\${Prefix}\${K}.\`>
    : \`\${Prefix}\${K}\`
}[keyof T & string];

type Config = { db: { host: string; port: number }; app: { name: string; debug: boolean } };
type ConfigPaths = PathKeys<Config>; // 'db.host' | 'db.port' | 'app.name' | 'app.debug'
\`\`\`

## Declaration Merging & Module Augmentation

\`\`\`typescript
// Declaration merging: TypeScript merges multiple declarations with the same name

// Interface merging (useful for extending third-party types):
interface Window {
  analytics: Analytics;  // add to browser's Window
  __APP_CONFIG__: AppConfig;
}

// Augmenting Express request to add 'user':
// In types/express.d.ts:
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

// Now req.user is typed everywhere in Express routes:
app.get('/profile', (req, res) => {
  if (req.user) {
    res.json({ name: req.user.id }); // fully typed!
  }
});

// Module augmentation — add to a third-party module:
declare module 'some-library' {
  interface Options {
    myCustomOption: boolean; // add to existing Options interface
  }
}

// Namespace merging:
namespace Validation {
  export interface StringValidator { isAcceptable(s: string): boolean; }
}
namespace Validation {
  // Merges with above:
  const ZIP_CODE_REGEXP = /^[0-9]{5}(-[0-9]{4})?$/;
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) { return ZIP_CODE_REGEXP.test(s); }
  }
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does Awaited<T> do in TypeScript?",
      "options": [
        "Makes a type async",
        "Recursively unwraps Promise types — Awaited<Promise<Promise<string>>> = string",
        "Converts a callback to a Promise",
        "It's the same as ReturnType"
      ],
      "answer": 1,
      "explanation": "Awaited<T> recursively unwraps Promise types. Awaited<Promise<string>> = string. Awaited<Promise<Promise<number>>> = number. This is the type-level equivalent of awaiting a promise. It was added in TypeScript 4.5 and replaces the common need for custom UnwrapPromise utility types."
    },
    {
      "q": "How do you add custom properties to the Express Request object in TypeScript?",
      "options": [
        "Cast to 'any' everywhere",
        "Use module augmentation: declare module 'express' with an interface Request extension in a .d.ts file",
        "Install @types/express-extended",
        "Use a Partial<Request> cast"
      ],
      "answer": 1,
      "explanation": "Module augmentation lets you add to types defined in third-party modules. By declaring 'declare module express { interface Request { user?: AuthUser } }' in a .d.ts file, TypeScript merges your declaration with Express's definition. This is how @types packages work and how you extend any third-party interface."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
