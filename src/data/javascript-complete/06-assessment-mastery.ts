import { Module } from "../types";

export const module6: Module = {
  id: "assessment-mastery",
  title: "JavaScript Interview & Assessment Mastery",
  description: "Tricky questions, common gotchas, coercion rules, and everything you need to ace JavaScript assessments",
  lessons: [
    {
      id: "tricky-javascript",
      slug: "tricky-javascript",
      title: "Type Coercion, Equality & JavaScript Gotchas",
      content: `
# JavaScript Tricky Parts

## Type Coercion

\`\`\`concept
{
  "title": "Type Coercion Rules",
  "description": "JavaScript automatically converts types — understanding the rules prevents bugs",
  "points": [
    "== uses Abstract Equality: coerces types before comparing",
    "=== uses Strict Equality: no coercion — always use this",
    "Falsy values: false, 0, -0, 0n, '', null, undefined, NaN — everything else is truthy",
    "String + Number: number coerced to string — '1' + 2 = '12'",
    "String - Number: string coerced to number — '5' - 2 = 3",
    "Boolean in arithmetic: true=1, false=0",
    "Object to primitive: calls [Symbol.toPrimitive], valueOf(), or toString()"
  ]
}
\`\`\`

\`\`\`javascript
// == coercion surprises:
0 == false       // true  — both become 0
'' == false      // true  — both become 0
null == undefined // true — special case
null == 0        // false — null only equals null/undefined
NaN == NaN       // false — NaN ≠ NaN (use Number.isNaN instead)

// Arithmetic coercion:
'5' - 3          // 2    — '-' forces number
'5' + 3          // '53' — '+' prefers string (concatenation)
+'5'             // 5    — unary + converts to number
+''              // 0
+null            // 0
+undefined       // NaN
+[]              // 0    — [] → '' → 0
+{}              // NaN  — {} → '[object Object]' → NaN

// Comparison coercion:
'10' > 9         // true  — '10' coerced to 10
'10' > '9'       // false — string comparison: '1' < '9'
null > 0         // false
null == 0        // false
null >= 0        // true  — bizarre! null becomes 0 in relational comparison

// typeof quirks:
typeof null      // 'object' — historical bug, never fixed
typeof function(){} // 'function' — special case
typeof NaN       // 'number' — NaN is a number type!
typeof undefined // 'undefined'
typeof []        // 'object' — use Array.isArray()
typeof class {}  // 'function' — classes are functions
\`\`\`

## Common JavaScript Gotchas

\`\`\`tabs
[
  {
    "label": "var / let / const",
    "content": "// Hoisting and temporal dead zone:\\nconsole.log(x); // undefined (var hoisted)\\nconsole.log(y); // ReferenceError (TDZ)\\nvar x = 1;\\nlet y = 2;\\n\\n// const prevents reassignment, NOT mutation:\\nconst arr = [1, 2, 3];\\narr.push(4);       // ✓ mutation is fine\\narr = [];          // ✗ TypeError: Assignment to constant variable\\n\\nconst obj = { a: 1 };\\nobj.a = 2;         // ✓ mutation\\nobj = {};          // ✗ reassignment"
  },
  {
    "label": "this binding",
    "content": "// this is determined at CALL TIME\\nconst obj = {\\n  name: 'Alice',\\n  greet() { return this.name; },\\n  greetArrow: () => this?.name, // 'this' = outer scope (module/global)\\n};\\n\\nobj.greet();           // 'Alice'\\nconst fn = obj.greet;  // detach from obj\\nfn();                  // undefined (strict) or '' (non-strict)\\n\\n// Bind fixes it:\\nconst bound = obj.greet.bind(obj);\\nbound(); // 'Alice'\\n\\n// Class methods lose 'this' when passed as callbacks:\\nclass Counter {\\n  count = 0;\\n  increment() { this.count++; }\\n  // Fix: arrow class field\\n  incrementArrow = () => { this.count++; } // always bound to instance\\n}"
  },
  {
    "label": "Async gotchas",
    "content": "// forEach doesn't await Promises:\\nconst ids = [1, 2, 3];\\nawait ids.forEach(async id => {\\n  await fetchUser(id); // forEach ignores the returned promise!\\n});\\n// WRONG: forEach doesn't await\\n\\n// Fix: use for...of or Promise.all:\\nfor (const id of ids) { await fetchUser(id); } // sequential\\nawait Promise.all(ids.map(id => fetchUser(id))); // parallel\\n\\n// try/catch doesn't catch rejected Promises without await:\\ntry {\\n  fetchUser(1); // NOT awaited!\\n} catch (e) {\\n  // Never runs — the rejected promise is unhandled\\n}\\n\\n// Correct:\\ntry { await fetchUser(1); } catch (e) { /* catches */ }"
  },
  {
    "label": "Object reference bugs",
    "content": "// Objects assigned by reference, not value:\\nconst a = { x: 1 };\\nconst b = a;           // both point to same object\\nb.x = 99;\\nconsole.log(a.x);      // 99 — a was mutated!\\n\\n// Shallow copy (spread or Object.assign):\\nconst c = { ...a };    // new object, same nested values\\nc.x = 0;\\nconsole.log(a.x);      // 99 — c is independent\\n\\n// But nested objects are still shared:\\nconst obj = { nested: { val: 1 } };\\nconst shallow = { ...obj };\\nshallow.nested.val = 99;\\nconsole.log(obj.nested.val); // 99 — nested is shared!\\n\\n// Deep clone: structuredClone() (ES2022) or JSON.parse(JSON.stringify(obj))"
  }
]
\`\`\`

## Tricky Output Questions

\`\`\`javascript
// Q1: What does this print?
console.log([] + []);  // '' — both [] → '', '' + '' = ''
console.log({} + []); // '[object Object]' — {} → '[object Object]', + ''
console.log([] + {}); // '[object Object]' — same

// Q2:
console.log(typeof typeof 42);  // 'string' — typeof 42 = 'number', typeof 'number' = 'string'

// Q3:
let x = 1;
let y = x++ + ++x;  // x++ returns 1 (then x=2), ++x makes x=3 and returns 3
// y = 1 + 3 = 4, x = 3

// Q4:
console.log(0.1 + 0.2 === 0.3);  // false — floating point precision
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true — correct comparison

// Q5:
const arr = [1, 2, 3];
arr[10] = 11;
console.log(arr.length); // 11 — sparse array!
console.log(arr[5]);     // undefined

// Q6: for...in vs for...of
const obj = { a: 1, b: 2 };
for (const key in obj) { /* iterates keys: 'a', 'b' */ }
for (const val of [1, 2, 3]) { /* iterates values: 1, 2, 3 */ }
// for...in also iterates inherited enumerable properties!
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the output of: console.log(1 + '2' + 3)?",
      "options": ["6", "'123'", "'15'", "NaN"],
      "answer": 1,
      "explanation": "Left to right: 1 + '2' → '12' (+ with string = concatenation), '12' + 3 → '123'. The result is the string '123'."
    },
    {
      "q": "Why does typeof null === 'object'?",
      "options": [
        "null is an object",
        "Historical bug in JavaScript — null's type tag was 000 (same as object) and was never fixed for backward compatibility",
        "null inherits from Object",
        "It was intentional design"
      ],
      "answer": 1,
      "explanation": "This is a known bug from JavaScript's original implementation. In the first JS runtime, values were stored with a type tag, and null's tag (000) matched objects. It was never fixed because fixing it would break existing code."
    },
    {
      "q": "What is the difference between undefined and null?",
      "options": [
        "They are identical",
        "undefined means a variable has been declared but not assigned; null is an explicit 'no value' assignment",
        "null is for numbers, undefined for strings",
        "undefined is faster"
      ],
      "answer": 1,
      "explanation": "undefined: the JS engine sets this — uninitialized variables, missing function arguments, missing object properties. null: intentional 'no value' — the programmer explicitly assigns it. Both are falsy and loosely equal (null == undefined)."
    }
  ]
}
\`\`\`
`,
    },
    {
      id: "interview-qa",
      slug: "interview-qa",
      title: "JavaScript Interview Q&A & Cheat Sheet",
      content: `
# JavaScript Interview Mastery

## Core Concept Q&A

\`\`\`tabs
[
  {
    "label": "Closures & Scope",
    "content": "Q: What is a closure?\\nA: A function that retains access to its lexical scope's variables even after the outer function has returned.\\n\\nQ: What is the difference between var, let, and const?\\nA: var — function-scoped, hoisted+initialized to undefined, can re-declare.\\n   let — block-scoped, hoisted into TDZ (not accessible before declaration), can re-assign.\\n   const — block-scoped, hoisted into TDZ, cannot re-assign (but objects can mutate).\\n\\nQ: Explain the temporal dead zone.\\nA: The period between when a let/const variable is hoisted and when it's initialized. Accessing it in this window throws ReferenceError."
  },
  {
    "label": "Prototypes & OOP",
    "content": "Q: What is the prototype chain?\\nA: Every object has [[Prototype]] pointing to another object. Property lookup walks up this chain until null.\\n\\nQ: What does 'new' keyword do?\\nA: 1) Creates a new empty object, 2) Sets [[Prototype]] to Constructor.prototype, 3) Executes constructor with this = new object, 4) Returns the object (or explicit return if it's an object).\\n\\nQ: How does class syntax relate to prototypes?\\nA: Classes are syntactic sugar over prototype-based inheritance. class Foo {} is equivalent to function Foo(){} with methods on Foo.prototype."
  },
  {
    "label": "Async JavaScript",
    "content": "Q: How does the event loop work?\\nA: JS is single-threaded. The event loop checks if the call stack is empty, drains ALL microtasks (Promises, queueMicrotask), then picks ONE macrotask (setTimeout, I/O), and repeats.\\n\\nQ: What is the difference between microtask and macrotask queues?\\nA: Microtasks (Promise .then, queueMicrotask) drain completely before any macrotask (setTimeout, setInterval, I/O) runs.\\n\\nQ: What does async/await compile to?\\nA: async functions return Promises. await pauses execution, returns control to the event loop, and resumes when the Promise settles — similar to chained .then() calls."
  },
  {
    "label": "Functions",
    "content": "Q: What is the difference between call, apply, and bind?\\nA: call(thisArg, ...args) — immediately calls fn with given this.\\n   apply(thisArg, argsArray) — same but args as array.\\n   bind(thisArg, ...args) — returns a NEW function with this permanently bound.\\n\\nQ: What are arrow functions and how do they differ from regular functions?\\nA: Arrow functions: no own 'this' (inherit lexically), no 'arguments' object, cannot be used as constructors (no .prototype), cannot use 'new'.\\n\\nQ: What is function currying?\\nA: Transforming a function that takes multiple arguments into a series of functions each taking one argument: curry(add)(1)(2) = 3."
  }
]
\`\`\`

## Performance & Memory

\`\`\`javascript
// Memory leaks in JavaScript — common causes:

// 1. Forgotten event listeners:
window.addEventListener('scroll', heavyHandler);
// Fix: removeEventListener when done, or use { once: true }

// 2. Closures holding large objects:
function createLeak() {
  const hugeArray = new Array(1_000_000).fill('data');
  return function() {
    // hugeArray is captured but maybe only used once
    return hugeArray.length;
  };
  // hugeArray stays in memory as long as the returned function exists
}

// 3. Detached DOM nodes:
let detached;
function setup() {
  const el = document.getElementById('my-el');
  detached = el; // reference kept even after el removed from DOM
  el.remove();   // el is removed from DOM but not GC'd!
}
// Fix: detached = null when done

// 4. Global variables:
function forgetToUseVar() {
  leaked = 'this is global now'; // missing let/const/var
}

// Performance tips:
// - Avoid layout thrashing: don't alternate DOM reads and writes
// - Use requestAnimationFrame for visual updates
// - Debounce scroll/resize handlers
// - Use DocumentFragment for bulk DOM insertions
// - Prefer textContent over innerHTML (XSS risk + slower)
\`\`\`

## JavaScript Cheat Sheet

\`\`\`takeaways
["typeof null === 'object' — historical bug, use obj === null check instead", "NaN !== NaN — use Number.isNaN(val) not val === NaN", "== coerces types; === does not — always use ===", "var is function-scoped; let/const are block-scoped", "Closures capture variables by reference, not by value — classic var loop bug", "async function always returns a Promise — even if it returns a plain value", "Microtasks (Promises) drain before macrotasks (setTimeout) in every event loop tick", "Arrow functions have no own 'this' — inherit from enclosing scope", "Spread {...obj} and [...arr] are SHALLOW copies — nested objects are still shared", "Array.isArray() for arrays, typeof for primitives, instanceof for class instances", "Optional chaining (?.) short-circuits to undefined; nullish coalescing (??) only triggers on null/undefined (unlike ||)", "structuredClone() for deep copies, Proxy for reactive objects, WeakMap for DOM metadata without leaks"]
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the output? setTimeout(() => console.log(1), 0); Promise.resolve().then(() => console.log(2)); console.log(3);",
      "options": [
        "3, 1, 2",
        "3, 2, 1",
        "1, 2, 3",
        "2, 3, 1"
      ],
      "answer": 1,
      "explanation": "Sync runs first: 3. Then microtasks: 2 (Promise.resolve().then is a microtask). Then macrotask: 1 (setTimeout). Output: 3, 2, 1."
    },
    {
      "q": "What is the difference between == and ===?",
      "options": [
        "No difference in modern JS",
        "=== also checks type (no coercion); == performs type coercion before comparing",
        "== is stricter",
        "=== is deprecated"
      ],
      "answer": 1,
      "explanation": "=== (strict equality) requires both value AND type to match — no coercion. == (abstract equality) coerces types first: 0 == false is true, null == undefined is true. Always use === unless you specifically need coercive comparison."
    },
    {
      "q": "How do you properly deep clone an object in modern JavaScript?",
      "options": [
        "const copy = obj — creates a reference, not a copy",
        "const copy = { ...obj } — only shallow copy",
        "const copy = JSON.parse(JSON.stringify(obj)) — breaks with undefined, functions, Dates",
        "const copy = structuredClone(obj) — handles most types correctly (ES2022)"
      ],
      "answer": 3,
      "explanation": "structuredClone() (ES2022) is the modern standard for deep cloning. It handles nested objects, arrays, Dates, Maps, Sets, and more. It fails for functions, class instances, and DOM nodes. For older environments, the JSON.parse/stringify trick works for plain data but drops undefined, functions, and symbol keys, and serializes Dates as strings."
    }
  ]
}
\`\`\`
`,
      starterCode: `// Implement a deep clone function without using structuredClone or JSON.parse.
// deepClone(obj) should handle:
// - Primitives (return as-is)
// - Arrays (deep clone each element)
// - Plain objects (deep clone each property)
// - Date objects (return new Date with same time)
// - Circular references (optional bonus)

function deepClone(value) {
  // TODO: implement
}

// Tests:
const original = {
  a: 1,
  b: 'hello',
  c: [1, 2, { d: 3 }],
  e: new Date('2024-01-01'),
  f: { nested: { deep: true } },
};

const clone = deepClone(original);
console.log(clone.c[2].d);    // 3
clone.c[2].d = 99;
console.log(original.c[2].d); // still 3 (independent copy)
console.log(clone.e instanceof Date); // true`,
      solutionCode: `function deepClone(value, seen = new WeakMap()) {
  // Primitive or null — return as-is
  if (value === null || typeof value !== 'object') return value;

  // Handle circular references
  if (seen.has(value)) return seen.get(value);

  // Handle Date
  if (value instanceof Date) return new Date(value.getTime());

  // Handle Array
  if (Array.isArray(value)) {
    const clone = [];
    seen.set(value, clone);
    for (const item of value) clone.push(deepClone(item, seen));
    return clone;
  }

  // Handle plain object
  const clone = Object.create(Object.getPrototypeOf(value));
  seen.set(value, clone);
  for (const key of Reflect.ownKeys(value)) {
    clone[key] = deepClone(value[key], seen);
  }
  return clone;
}`,
    },
  ],
};
