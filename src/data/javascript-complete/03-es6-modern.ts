import { Module } from "../types";

export const module3: Module = {
  id: "es6-modern",
  title: "ES6+ Modern JavaScript",
  description: "Destructuring, spread/rest, optional chaining, nullish coalescing, symbols, iterators, and all modern JS features",
  lessons: [
    {
      id: "destructuring-spread",
      slug: "destructuring-spread",
      title: "Destructuring, Spread, Rest & Template Literals",
      content: `
# Modern JavaScript Syntax

## Destructuring

\`\`\`tabs
[
  {
    "label": "Object Destructuring",
    "content": "const user = { id: 1, name: 'Alice', role: 'admin', address: { city: 'NYC' } };\\n\\n// Basic:\\nconst { id, name } = user;\\n\\n// Rename:\\nconst { id: userId, name: fullName } = user;\\n\\n// Default values:\\nconst { theme = 'light', lang = 'en' } = user;\\n\\n// Nested:\\nconst { address: { city } } = user;\\n\\n// Rest:\\nconst { id: _, ...userWithoutId } = user;\\n// userWithoutId = { name, role, address }\\n\\n// In function params (very common in React!):\\nfunction UserCard({ name, role = 'user', address: { city } = {} }) {\\n  return \`\${name} (\${role}) from \${city}\`;\\n}"
  },
  {
    "label": "Array Destructuring",
    "content": "const [first, second, ...rest] = [1, 2, 3, 4, 5];\\n// first = 1, second = 2, rest = [3, 4, 5]\\n\\n// Skip elements:\\nconst [,, third] = [1, 2, 3]; // third = 3\\n\\n// Swap variables (no temp!):\\nlet a = 1, b = 2;\\n[a, b] = [b, a];\\n// a = 2, b = 1\\n\\n// From function return:\\nfunction getRange() { return [0, 100]; }\\nconst [min, max] = getRange();\\n\\n// useState pattern (React):\\n// const [count, setCount] = useState(0);"
  },
  {
    "label": "Nested & Dynamic",
    "content": "// Nested destructuring in loops:\\nconst users = [\\n  { id: 1, name: 'Alice', scores: [95, 87, 92] },\\n  { id: 2, name: 'Bob',   scores: [78, 84, 90] },\\n];\\n\\nfor (const { name, scores: [first] } of users) {\\n  console.log(\`\${name}'s first score: \${first}\`);\\n}\\n\\n// Dynamic property names:\\nconst key = 'theme';\\nconst { [key]: currentTheme } = settings; // = settings.theme\\n\\n// Function with options object:\\nfunction createUser({\\n  name,\\n  role = 'user',\\n  permissions = [],\\n  ...extraProps\\n} = {}) {\\n  return { name, role, permissions, ...extraProps };\\n}"
  }
]
\`\`\`

## Spread & Rest

\`\`\`javascript
// SPREAD: expands iterables into individual elements
// REST: collects remaining elements into an array/object

// Array spread:
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];         // [1,2,3,4,5,6]
const copy = [...arr1];                       // shallow copy
const withExtra = [0, ...arr1, 4];           // [0,1,2,3,4]

// Object spread (ES2018):
const defaults = { theme: 'light', lang: 'en', size: 'md' };
const userPrefs = { theme: 'dark', size: 'lg' };
const config = { ...defaults, ...userPrefs }; // later wins
// { theme: 'dark', lang: 'en', size: 'lg' }

// Immutable update patterns (Redux style):
const state = { user: { name: 'Alice', age: 30 }, count: 0 };
const newState = {
  ...state,
  count: state.count + 1,
  user: { ...state.user, age: 31 }, // nested update
};

// Rest parameters (always last):
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4, 5); // 15

// In destructuring:
function first(x, ...rest) { return x; }
\`\`\`

## Template Literals

\`\`\`javascript
const name = 'World';
const multiline = \`
  Hello, \${name}!
  Today is \${new Date().toDateString()}
  Result: \${2 + 2}
\`;

// Tagged templates:
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    return result + \`<mark>\${value}</mark>\` + str;
  });
}

const searchTerm = 'JavaScript';
const text = highlight\`Learning \${searchTerm} is fun!\`;
// "Learning <mark>JavaScript</mark> is fun!"

// Real-world: SQL template tag (parameterized queries):
function sql(strings, ...values) {
  const query = strings.reduce((q, str, i) =>
    q + (i > 0 ? \`$\${i}\` : '') + str
  );
  return { query, values };
}
const { query, values } = sql\`SELECT * FROM users WHERE id = \${userId}\`;
// Safe from SQL injection — values are separated!
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does const { a, ...rest } = obj do?",
      "options": [
        "Copies obj into a and rest",
        "Destructures 'a' from obj; 'rest' is a new object with all other properties",
        "Throws an error — rest can't be used in objects",
        "Makes 'a' equal to the spread of obj"
      ],
      "answer": 1,
      "explanation": "Object rest in destructuring collects all remaining own enumerable properties not already destructured. The result is a shallow copy without the extracted properties. This is useful for 'omit' patterns."
    },
    {
      "q": "{ ...obj1, ...obj2 } — what happens if both have key 'x'?",
      "options": [
        "Error is thrown",
        "Both values are kept in an array",
        "obj1's value wins",
        "obj2's value wins — later spread overrides earlier"
      ],
      "answer": 3,
      "explanation": "When spreading objects, later properties override earlier ones. { ...defaults, ...overrides } is the canonical pattern for applying overrides on top of defaults."
    }
  ]
}
\`\`\`
`,
    },
    {
      id: "optional-chaining-nullish",
      slug: "optional-chaining-nullish",
      title: "Optional Chaining, Nullish Coalescing & ES2020-2024 Features",
      content: `
# Modern JavaScript Features

## Optional Chaining (?.) & Nullish Coalescing (??)

\`\`\`javascript
// Optional chaining: short-circuits to undefined if any step is null/undefined
// Instead of: user && user.address && user.address.city
const city = user?.address?.city;                // undefined if missing
const method = obj?.method?.();                  // call method if it exists
const item = arr?.[0];                           // array access
const nested = data?.users?.[0]?.profile?.name;  // chain deeply

// Nullish coalescing: returns right side ONLY if left is null/undefined
// Unlike ||, doesn't short-circuit on falsy (0, '', false)
const count = data.count ?? 0;     // 0 if null/undefined, NOT if already 0
const name = user.name ?? 'Guest'; // uses '' if user.name = '' (unlike ||)

// Contrast:
const a = 0 || 'default';  // 'default' — 0 is falsy!
const b = 0 ?? 'default';  // 0 — not null/undefined

// Nullish assignment (??=):
user.displayName ??= user.name ?? 'Anonymous'; // only sets if currently null/undefined

// Logical assignment operators (ES2021):
a ||= b;  // a = a || b  — assign if a is falsy
a &&= b;  // a = a && b  — assign if a is truthy
a ??= b;  // a = a ?? b  — assign if a is nullish
\`\`\`

## Symbols

\`\`\`javascript
// Symbol: unique, non-string primitive — guaranteed unique identity
const id = Symbol('id');          // description is just for debugging
const id2 = Symbol('id');
id === id2;                        // false — always unique!

// Use case 1: Private-ish object keys (not enumerable by default)
const _private = Symbol('private');
class Foo {
  constructor() { this[_private] = 'secret'; }
}

// Use case 2: Well-known symbols — customize built-in behavior
class Range {
  constructor(start, end) { this.start = start; this.end = end; }

  // Make the object iterable:
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        return current <= end
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      }
    };
  }
}

for (const n of new Range(1, 5)) console.log(n); // 1 2 3 4 5
[...new Range(3, 6)]; // [3, 4, 5, 6]

// Other well-known symbols:
// Symbol.toPrimitive — customize type coercion
// Symbol.hasInstance — customize instanceof
// Symbol.toStringTag — customize Object.prototype.toString
\`\`\`

## Map, Set, WeakMap, WeakRef

\`\`\`tabs
[
  {
    "label": "Map vs Object",
    "content": "// Map: ordered key-value store — keys can be ANY type\\nconst map = new Map();\\nmap.set('string', 1);\\nmap.set(42, 'number key');\\nmap.set({ id: 1 }, 'object key');\\nmap.size;          // 3\\nmap.has('string'); // true\\nmap.get('string'); // 1\\nmap.delete('string');\\n\\n// Iterate:\\nfor (const [key, value] of map) { /* ... */ }\\n\\n// When to use Map over plain object:\\n// - Keys are not strings/symbols\\n// - Need insertion-order iteration\\n// - Frequent additions/deletions (Map is optimized)\\n// - Need .size without Object.keys().length"
  },
  {
    "label": "Set",
    "content": "// Set: unique values collection\\nconst set = new Set([1, 2, 3, 2, 1]); // {1, 2, 3}\\nset.add(4);\\nset.has(2); // true\\nset.delete(1);\\nset.size;   // 3\\n\\n// Common pattern: deduplicate array\\nconst unique = [...new Set([1, 2, 2, 3, 3, 4])]; // [1,2,3,4]\\n\\n// Set operations (ES2025 native, or manual):\\nconst a = new Set([1, 2, 3]);\\nconst b = new Set([2, 3, 4]);\\nconst union        = new Set([...a, ...b]);        // {1,2,3,4}\\nconst intersection = new Set([...a].filter(x => b.has(x))); // {2,3}\\nconst difference   = new Set([...a].filter(x => !b.has(x))); // {1}"
  },
  {
    "label": "WeakMap / WeakRef",
    "content": "// WeakMap: keys must be objects — does NOT prevent GC\\nconst cache = new WeakMap();\\n\\nfunction processDOM(element) {\\n  if (cache.has(element)) return cache.get(element);\\n  const result = heavyComputation(element);\\n  cache.set(element, result);   // when element is GC'd, entry disappears\\n  return result;\\n}\\n// Perfect for DOM node metadata — no memory leaks!\\n\\n// WeakRef (ES2021): hold a reference that doesn't prevent GC\\nlet obj = { name: 'heavy object' };\\nconst ref = new WeakRef(obj);\\nobj = null;                        // obj can now be GC'd\\n\\n// Sometime later:\\nconst val = ref.deref();           // undefined if GC'd\\nif (val) console.log(val.name);"
  }
]
\`\`\`

## Object & Array Static Methods

\`\`\`javascript
// Object methods:
Object.keys(obj)      // own enumerable string keys
Object.values(obj)    // own enumerable values
Object.entries(obj)   // [[key, value], ...] pairs

Object.fromEntries(entries)  // reverse of entries
const doubled = Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, v * 2])
);

Object.assign(target, ...sources) // shallow merge (mutates target)
Object.freeze(obj)                // deep immutability (shallow freeze!)
Object.is(NaN, NaN)               // true — better than ===

// Structured clone (ES2022) — deep copy:
const deepCopy = structuredClone(complexObject);

// Array methods:
arr.at(-1)         // last element (ES2022)
arr.findIndex(fn)  // first matching index (-1 if none)
arr.find(fn)       // first matching value
arr.flat(depth)    // flatten nested arrays
arr.flatMap(fn)    // map + flat(1) in one pass
arr.fill(value, start, end)
Array.from({ length: 5 }, (_, i) => i * 2); // [0,2,4,6,8]

// Object.groupBy / Map.groupBy (ES2024):
const grouped = Object.groupBy(products, p => p.category);
// { electronics: [...], clothing: [...] }
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the difference between || and ?? for default values?",
      "options": [
        "They are identical",
        "|| returns right side for any falsy left value (including 0, '', false); ?? only for null/undefined",
        "?? is deprecated",
        "|| is faster"
      ],
      "answer": 1,
      "explanation": "The nullish coalescing operator (??) only triggers for null/undefined, while || triggers for all falsy values (0, '', false, null, undefined, NaN). Use ?? when 0 or empty string are valid values you want to preserve."
    },
    {
      "q": "When should you use Map instead of a plain object?",
      "options": [
        "Always — Map is always better",
        "Never — objects are always better",
        "When keys are non-strings, you need ordered iteration, or have frequent additions/deletions",
        "Only in Node.js"
      ],
      "answer": 2,
      "explanation": "Map excels when keys are non-strings (objects, numbers), when insertion order matters, or when you need .size. Plain objects are fine for most string-keyed configs and are faster for simple reads."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
