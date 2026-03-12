import { Module } from "../types";

export const objectsModule: Module = {
  id: "js-objects",
  title: "Objects & Prototypes",
  description:
    "Work with objects, understand 'this', prototypes, destructuring, and master deep manipulation patterns.",
  lessons: [
    {
      id: "js-objects-intro",
      slug: "js-objects-intro",
      title: "Introduction to Objects",
      content: `## Objects in JavaScript

Objects are **unordered collections of key-value pairs**. They are the fundamental building block of JavaScript — almost everything is an object.

### Creating Objects

\`\`\`js
const user = { name: "Alice", age: 30 };          // object literal
const fromEntries = Object.fromEntries([["a", 1]]); // from entries
\`\`\`

### Property Access

\`\`\`js
user.name       // dot notation
user["name"]    // bracket notation (dynamic keys)
\`\`\`

### Destructuring

\`\`\`js
const { name, age, role = "user" } = user;
// name = "Alice", age = 30, role = "user" (default)

const { name: userName } = user;  // rename
\`\`\`

### Spread & Rest with Objects

\`\`\`js
const copy = { ...user };                    // shallow copy
const extended = { ...user, role: "admin" }; // extend
const { name, ...rest } = user;              // rest
\`\`\`

### Useful Object Methods

| Method | Purpose |
|--------|---------|
| \`Object.keys(obj)\` | Array of keys |
| \`Object.values(obj)\` | Array of values |
| \`Object.entries(obj)\` | Array of [key, value] pairs |
| \`Object.assign(target, ...sources)\` | Merge objects (mutates target) |
| \`Object.freeze(obj)\` | Prevent modifications |
| \`Object.hasOwn(obj, key)\` | Check own property (ES2022) |

### The \`this\` Keyword

\`this\` depends on **how** a function is called, not where it is defined. Arrow functions inherit \`this\` from their enclosing scope.

### Prototypes

Every object has a hidden \`[[Prototype]]\` link. Property lookups walk the prototype chain until a match is found or the chain ends at \`null\`.`,
    },
    {
      id: "js-objects-deep-clone",
      slug: "deep-clone",
      title: "Deep Clone",
      content: `## Deep Clone

### Problem

Implement a \`deepClone\` function that creates a **deep copy** of any value. The clone must handle:

- Primitives (returned as-is)
- Plain objects (recursively cloned)
- Arrays (recursively cloned)
- Date objects (new Date with same time)
- \`null\` (returned as-is)

Do NOT use \`structuredClone\` or \`JSON.parse(JSON.stringify())\`.

### Examples

\`\`\`js
const original = { a: 1, b: { c: 2 }, d: [3, 4] };
const cloned = deepClone(original);
cloned.b.c = 99;
original.b.c; // still 2
\`\`\`

### Key Concepts

- Shallow copy (\`{...obj}\`) only copies one level deep
- Recursion handles arbitrary nesting
- Must check types to handle arrays, dates, and objects differently
- Circular references are an advanced concern (not required here)`,
      starterCode: `// Deep Clone
// Implement recursive deep copying

function deepClone(value) {
  // Handle null and primitives (return as-is)
  // Handle Date (return new Date with same time)
  // Handle Array (map with deepClone)
  // Handle plain objects (clone each property)
  // YOUR CODE HERE
}

// Test cases
const obj1 = { a: 1, b: { c: 2, d: { e: 3 } } };
const clone1 = deepClone(obj1);
clone1.b.c = 99;
clone1.b.d.e = 100;
console.log(obj1.b.c);     // Expected: 2 (unchanged)
console.log(obj1.b.d.e);   // Expected: 3 (unchanged)
console.log(clone1.b.c);   // Expected: 99

const obj2 = { arr: [1, [2, 3], { x: 4 }], date: new Date("2024-01-01") };
const clone2 = deepClone(obj2);
clone2.arr[1].push(99);
clone2.arr[2].x = 100;
console.log(obj2.arr[1]);      // Expected: [2, 3] (unchanged)
console.log(obj2.arr[2].x);    // Expected: 4 (unchanged)
console.log(clone2.date instanceof Date); // Expected: true
console.log(clone2.date.getTime() === obj2.date.getTime()); // Expected: true

console.log(deepClone(null));      // Expected: null
console.log(deepClone(42));        // Expected: 42
console.log(deepClone("hello"));   // Expected: "hello"`,
      solutionCode: `// Deep Clone
// Implement recursive deep copying

function deepClone(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (Array.isArray(value)) {
    return value.map(item => deepClone(item));
  }

  const cloned = {};
  for (const key of Object.keys(value)) {
    cloned[key] = deepClone(value[key]);
  }
  return cloned;
}

// Test cases
const obj1 = { a: 1, b: { c: 2, d: { e: 3 } } };
const clone1 = deepClone(obj1);
clone1.b.c = 99;
clone1.b.d.e = 100;
console.log(obj1.b.c);     // Expected: 2 (unchanged)
console.log(obj1.b.d.e);   // Expected: 3 (unchanged)
console.log(clone1.b.c);   // Expected: 99

const obj2 = { arr: [1, [2, 3], { x: 4 }], date: new Date("2024-01-01") };
const clone2 = deepClone(obj2);
clone2.arr[1].push(99);
clone2.arr[2].x = 100;
console.log(obj2.arr[1]);      // Expected: [2, 3] (unchanged)
console.log(obj2.arr[2].x);    // Expected: 4 (unchanged)
console.log(clone2.date instanceof Date); // Expected: true
console.log(clone2.date.getTime() === obj2.date.getTime()); // Expected: true

console.log(deepClone(null));      // Expected: null
console.log(deepClone(42));        // Expected: 42
console.log(deepClone("hello"));   // Expected: "hello"`,
    },
    {
      id: "js-objects-merge",
      slug: "object-merge",
      title: "Object Merge",
      content: `## Object Merge

### Problem

Implement a \`deepMerge\` function that recursively merges two objects. When both values at a key are plain objects, merge them recursively. Otherwise, the second object's value wins.

Also implement \`pick(obj, keys)\` and \`omit(obj, keys)\`.

### Examples

\`\`\`js
deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 })
// { a: 1, b: { c: 2, d: 3 }, e: 4 }

pick({ a: 1, b: 2, c: 3 }, ["a", "c"])  // { a: 1, c: 3 }
omit({ a: 1, b: 2, c: 3 }, ["b"])       // { a: 1, c: 3 }
\`\`\`

### Key Concepts

- Recursive merging vs shallow spread
- Checking if a value is a "plain object" (not an array, Date, etc.)
- \`Object.entries\` and \`Object.fromEntries\` for filtering
- These are real-world utilities found in lodash`,
      starterCode: `// Object Merge, Pick, Omit
// Implement deep merge and object filtering

function isPlainObject(value) {
  // Return true if value is a plain object (not array, null, Date, etc.)
  // YOUR CODE HERE
}

function deepMerge(target, source) {
  // Recursively merge source into target
  // If both values are plain objects, merge recursively
  // Otherwise, source value wins
  // Return a NEW object (don't mutate inputs)
  // YOUR CODE HERE
}

function pick(obj, keys) {
  // Return a new object with only the specified keys
  // YOUR CODE HERE
}

function omit(obj, keys) {
  // Return a new object WITHOUT the specified keys
  // YOUR CODE HERE
}

// Test cases
console.log(deepMerge(
  { a: 1, b: { c: 2, d: 3 } },
  { b: { c: 10, e: 5 }, f: 6 }
));
// Expected: { a: 1, b: { c: 10, d: 3, e: 5 }, f: 6 }

console.log(deepMerge(
  { x: { y: { z: 1 } } },
  { x: { y: { w: 2 } } }
));
// Expected: { x: { y: { z: 1, w: 2 } } }

console.log(deepMerge({ a: [1, 2] }, { a: [3, 4] }));
// Expected: { a: [3, 4] } (arrays are replaced, not merged)

console.log(pick({ a: 1, b: 2, c: 3, d: 4 }, ["a", "c"]));
// Expected: { a: 1, c: 3 }

console.log(pick({ a: 1, b: 2 }, ["c"]));
// Expected: {}

console.log(omit({ a: 1, b: 2, c: 3, d: 4 }, ["b", "d"]));
// Expected: { a: 1, c: 3 }

console.log(omit({ a: 1 }, []));
// Expected: { a: 1 }`,
      solutionCode: `// Object Merge, Pick, Omit
// Implement deep merge and object filtering

function isPlainObject(value) {
  return value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && !(value instanceof Date)
    && !(value instanceof RegExp);
}

function deepMerge(target, source) {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (isPlainObject(result[key]) && isPlainObject(source[key])) {
      result[key] = deepMerge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

function pick(obj, keys) {
  const result = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

function omit(obj, keys) {
  const keySet = new Set(keys);
  const result = {};
  for (const key of Object.keys(obj)) {
    if (!keySet.has(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

// Test cases
console.log(deepMerge(
  { a: 1, b: { c: 2, d: 3 } },
  { b: { c: 10, e: 5 }, f: 6 }
));
// Expected: { a: 1, b: { c: 10, d: 3, e: 5 }, f: 6 }

console.log(deepMerge(
  { x: { y: { z: 1 } } },
  { x: { y: { w: 2 } } }
));
// Expected: { x: { y: { z: 1, w: 2 } } }

console.log(deepMerge({ a: [1, 2] }, { a: [3, 4] }));
// Expected: { a: [3, 4] } (arrays are replaced, not merged)

console.log(pick({ a: 1, b: 2, c: 3, d: 4 }, ["a", "c"]));
// Expected: { a: 1, c: 3 }

console.log(pick({ a: 1, b: 2 }, ["c"]));
// Expected: {}

console.log(omit({ a: 1, b: 2, c: 3, d: 4 }, ["b", "d"]));
// Expected: { a: 1, c: 3 }

console.log(omit({ a: 1 }, []));
// Expected: { a: 1 }`,
    },
    {
      id: "js-objects-json-transformer",
      slug: "json-transformer",
      title: "JSON Transformer",
      content: `## JSON Transformer

### Problem

Implement three JSON/object transformation utilities:

1. \`get(obj, path, defaultValue)\` — safely access nested properties using dot-notation path
2. \`set(obj, path, value)\` — set a nested property, creating intermediate objects as needed
3. \`transform(obj, keyFn, valueFn)\` — recursively transform all keys and/or values

### Examples

\`\`\`js
get({ a: { b: { c: 42 } } }, "a.b.c")     // 42
get({ a: 1 }, "a.b.c", "default")          // "default"
set({}, "a.b.c", 42)                        // { a: { b: { c: 42 } } }
\`\`\`

### Key Concepts

- Path splitting with \`split(".")\`
- \`reduce\` for walking nested structures
- Creating intermediate objects during \`set\`
- Recursive transformation of keys/values`,
      starterCode: `// JSON Transformer
// Implement get, set, and transform utilities

function get(obj, path, defaultValue) {
  // Access nested property by dot-notation path string
  // Return defaultValue if the path doesn't exist
  // get({a: {b: 1}}, "a.b") => 1
  // get({a: 1}, "a.b.c", 0) => 0
  // YOUR CODE HERE
}

function set(obj, path, value) {
  // Set a nested property, creating intermediate objects
  // Return a NEW object (don't mutate the original)
  // set({}, "a.b.c", 42) => { a: { b: { c: 42 } } }
  // YOUR CODE HERE
}

function transform(obj, keyFn, valueFn) {
  // Recursively transform all keys and leaf values
  // keyFn transforms each key, valueFn transforms non-object values
  // If a value is a plain object, recurse into it
  // YOUR CODE HERE
}

// Test cases
const data = { user: { name: "Alice", address: { city: "NYC" } } };

console.log(get(data, "user.name"));              // Expected: "Alice"
console.log(get(data, "user.address.city"));       // Expected: "NYC"
console.log(get(data, "user.address.zip"));        // Expected: undefined
console.log(get(data, "user.address.zip", "N/A")); // Expected: "N/A"
console.log(get(data, "user.phone.number", 0));    // Expected: 0

const result1 = set({}, "a.b.c", 42);
console.log(JSON.stringify(result1));
// Expected: {"a":{"b":{"c":42}}}

const result2 = set({ a: { x: 1 } }, "a.b", 2);
console.log(JSON.stringify(result2));
// Expected: {"a":{"x":1,"b":2}}

const snakeCase = { user_name: "alice", user_age: 30, user_address: { street_name: "Main St" } };
const camelCased = transform(
  snakeCase,
  key => key.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
  value => value
);
console.log(JSON.stringify(camelCased));
// Expected: {"userName":"alice","userAge":30,"userAddress":{"streetName":"Main St"}}`,
      solutionCode: `// JSON Transformer
// Implement get, set, and transform utilities

function get(obj, path, defaultValue) {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return defaultValue;
    }
    current = current[key];
  }

  return current === undefined ? defaultValue : current;
}

function set(obj, path, value) {
  const keys = path.split(".");
  const result = { ...obj };
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = current[key] !== undefined && typeof current[key] === "object"
      ? { ...current[key] }
      : {};
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return result;
}

function transform(obj, keyFn, valueFn) {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = keyFn(key);
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      result[newKey] = transform(value, keyFn, valueFn);
    } else {
      result[newKey] = valueFn(value);
    }
  }

  return result;
}

// Test cases
const data = { user: { name: "Alice", address: { city: "NYC" } } };

console.log(get(data, "user.name"));              // Expected: "Alice"
console.log(get(data, "user.address.city"));       // Expected: "NYC"
console.log(get(data, "user.address.zip"));        // Expected: undefined
console.log(get(data, "user.address.zip", "N/A")); // Expected: "N/A"
console.log(get(data, "user.phone.number", 0));    // Expected: 0

const result1 = set({}, "a.b.c", 42);
console.log(JSON.stringify(result1));
// Expected: {"a":{"b":{"c":42}}}

const result2 = set({ a: { x: 1 } }, "a.b", 2);
console.log(JSON.stringify(result2));
// Expected: {"a":{"x":1,"b":2}}

const snakeCase = { user_name: "alice", user_age: 30, user_address: { street_name: "Main St" } };
const camelCased = transform(
  snakeCase,
  key => key.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
  value => value
);
console.log(JSON.stringify(camelCased));
// Expected: {"userName":"alice","userAge":30,"userAddress":{"streetName":"Main St"}}`,
    },
  ],
};
