import { Module } from "../types";

export const arraysModule: Module = {
  id: "js-arrays",
  title: "Arrays & Destructuring",
  description:
    "Master array methods, destructuring, the spread operator, and common array manipulation patterns.",
  lessons: [
    {
      id: "js-arrays-intro",
      slug: "js-arrays-intro",
      title: "Introduction to Arrays",
      content: `## Arrays in JavaScript

Arrays are **ordered collections** that can hold any type of value. JavaScript arrays are dynamic — they grow and shrink as needed.

### Creating Arrays

\`\`\`js
const nums = [1, 2, 3];
const mixed = [1, "two", true, null];
const fromConstructor = Array.from({ length: 5 }, (_, i) => i); // [0,1,2,3,4]
\`\`\`

### Essential Methods

| Method | Purpose | Mutates? |
|--------|---------|----------|
| \`push/pop\` | Add/remove from end | Yes |
| \`unshift/shift\` | Add/remove from start | Yes |
| \`splice\` | Insert/remove at index | Yes |
| \`slice\` | Extract a sub-array | No |
| \`map\` | Transform each element | No |
| \`filter\` | Keep elements matching condition | No |
| \`reduce\` | Accumulate into single value | No |
| \`find\` | First element matching condition | No |
| \`some/every\` | Test if any/all match | No |
| \`flat\` | Flatten nested arrays | No |
| \`flatMap\` | Map then flatten one level | No |

### Destructuring

\`\`\`js
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]
\`\`\`

### Spread Operator

\`\`\`js
const merged = [...arr1, ...arr2];
const copy = [...original];
\`\`\`

### Important: Mutation vs Immutability

Methods like \`sort()\`, \`reverse()\`, and \`splice()\` mutate the original array. Use \`toSorted()\`, \`toReversed()\`, and \`toSpliced()\` (ES2023) for immutable alternatives, or spread into a new array first.`,
    },
    {
      id: "js-arrays-flatten",
      slug: "flatten-array",
      title: "Flatten Array",
      content: `## Flatten Array

### Problem

Implement a \`flatten\` function that takes a deeply nested array and returns a flat array. Do NOT use the built-in \`Array.prototype.flat()\`.

Also implement \`flattenDepth(arr, depth)\` that flattens only up to \`depth\` levels deep.

### Examples

\`\`\`js
flatten([1, [2, [3, [4]]]])     // [1, 2, 3, 4]
flattenDepth([1, [2, [3]]], 1)  // [1, 2, [3]]
\`\`\`

### Key Concepts

- Recursion for handling arbitrary nesting depth
- \`Array.isArray()\` to detect nested arrays
- Using \`reduce\` with \`concat\` for a functional approach
- Depth tracking for controlled flattening`,
      starterCode: `// Flatten Array
// Implement deep and depth-limited flattening

function flatten(arr) {
  // Recursively flatten a deeply nested array
  // Do NOT use Array.prototype.flat()
  // YOUR CODE HERE
}

function flattenDepth(arr, depth) {
  // Flatten only up to 'depth' levels
  // flattenDepth([1, [2, [3]]], 1) => [1, 2, [3]]
  // YOUR CODE HERE
}

// Test cases
console.log(flatten([1, [2, [3, [4]]]]));
// Expected: [1, 2, 3, 4]

console.log(flatten([1, [2, 3], [4, [5, [6]]]]));
// Expected: [1, 2, 3, 4, 5, 6]

console.log(flatten([[1, 2], [3, 4], [5, 6]]));
// Expected: [1, 2, 3, 4, 5, 6]

console.log(flatten([1, 2, 3]));
// Expected: [1, 2, 3]

console.log(flattenDepth([1, [2, [3, [4]]]], 1));
// Expected: [1, 2, [3, [4]]]

console.log(flattenDepth([1, [2, [3, [4]]]], 2));
// Expected: [1, 2, 3, [4]]

console.log(flattenDepth([1, [2, [3]]], 0));
// Expected: [1, [2, [3]]]`,
      solutionCode: `// Flatten Array
// Implement deep and depth-limited flattening

function flatten(arr) {
  return arr.reduce((result, item) => {
    if (Array.isArray(item)) {
      return result.concat(flatten(item));
    }
    return result.concat(item);
  }, []);
}

function flattenDepth(arr, depth) {
  if (depth <= 0) return [...arr];
  return arr.reduce((result, item) => {
    if (Array.isArray(item)) {
      return result.concat(flattenDepth(item, depth - 1));
    }
    return result.concat(item);
  }, []);
}

// Test cases
console.log(flatten([1, [2, [3, [4]]]]));
// Expected: [1, 2, 3, 4]

console.log(flatten([1, [2, 3], [4, [5, [6]]]]));
// Expected: [1, 2, 3, 4, 5, 6]

console.log(flatten([[1, 2], [3, 4], [5, 6]]));
// Expected: [1, 2, 3, 4, 5, 6]

console.log(flatten([1, 2, 3]));
// Expected: [1, 2, 3]

console.log(flattenDepth([1, [2, [3, [4]]]], 1));
// Expected: [1, 2, [3, [4]]]

console.log(flattenDepth([1, [2, [3, [4]]]], 2));
// Expected: [1, 2, 3, [4]]

console.log(flattenDepth([1, [2, [3]]], 0));
// Expected: [1, [2, [3]]]`,
    },
    {
      id: "js-arrays-group-by",
      slug: "group-by",
      title: "Group By",
      content: `## Group By

### Problem

Implement a \`groupBy\` function that groups array elements by a given key or function:

1. \`groupBy(arr, key)\` — groups objects by a property name
2. \`groupBy(arr, fn)\` — groups elements by the return value of a function

Also implement \`countBy(arr, fn)\` that returns counts instead of groups.

### Examples

\`\`\`js
groupBy([{age: 20}, {age: 30}, {age: 20}], "age")
// { 20: [{age:20}, {age:20}], 30: [{age:30}] }

groupBy([1, 2, 3, 4, 5], n => n % 2 === 0 ? "even" : "odd")
// { odd: [1, 3, 5], even: [2, 4] }

countBy(["apple", "banana", "avocado"], s => s[0])
// { a: 2, b: 1 }
\`\`\`

### Key Concepts

- Using \`reduce\` to build an object from an array
- Handling both string keys and function keys
- \`typeof\` check to determine key type`,
      starterCode: `// Group By
// Implement grouping and counting utilities

function groupBy(arr, keyOrFn) {
  // If keyOrFn is a string, group by that property
  // If keyOrFn is a function, group by its return value
  // Return an object where keys are group names, values are arrays
  // YOUR CODE HERE
}

function countBy(arr, fn) {
  // Like groupBy but returns counts instead of arrays
  // YOUR CODE HERE
}

// Test cases
console.log(groupBy(
  [{ name: "Alice", age: 20 }, { name: "Bob", age: 30 }, { name: "Carol", age: 20 }],
  "age"
));
// Expected: { "20": [{name:"Alice",age:20}, {name:"Carol",age:20}], "30": [{name:"Bob",age:30}] }

console.log(groupBy([1, 2, 3, 4, 5, 6], n => n % 2 === 0 ? "even" : "odd"));
// Expected: { odd: [1, 3, 5], even: [2, 4, 6] }

console.log(groupBy(["one", "two", "three"], s => s.length));
// Expected: { "3": ["one", "two"], "5": ["three"] }

console.log(countBy(["apple", "banana", "avocado", "blueberry"], s => s[0]));
// Expected: { a: 2, b: 2 }

console.log(countBy([1, 2, 3, 4, 5], n => n > 3 ? "big" : "small"));
// Expected: { small: 3, big: 2 }`,
      solutionCode: `// Group By
// Implement grouping and counting utilities

function groupBy(arr, keyOrFn) {
  const getKey = typeof keyOrFn === "function"
    ? keyOrFn
    : (item) => item[keyOrFn];

  return arr.reduce((groups, item) => {
    const key = getKey(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}

function countBy(arr, fn) {
  return arr.reduce((counts, item) => {
    const key = fn(item);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

// Test cases
console.log(groupBy(
  [{ name: "Alice", age: 20 }, { name: "Bob", age: 30 }, { name: "Carol", age: 20 }],
  "age"
));
// Expected: { "20": [{name:"Alice",age:20}, {name:"Carol",age:20}], "30": [{name:"Bob",age:30}] }

console.log(groupBy([1, 2, 3, 4, 5, 6], n => n % 2 === 0 ? "even" : "odd"));
// Expected: { odd: [1, 3, 5], even: [2, 4, 6] }

console.log(groupBy(["one", "two", "three"], s => s.length));
// Expected: { "3": ["one", "two"], "5": ["three"] }

console.log(countBy(["apple", "banana", "avocado", "blueberry"], s => s[0]));
// Expected: { a: 2, b: 2 }

console.log(countBy([1, 2, 3, 4, 5], n => n > 3 ? "big" : "small"));
// Expected: { small: 3, big: 2 }`,
    },
    {
      id: "js-arrays-intersection",
      slug: "array-intersection",
      title: "Array Intersection",
      content: `## Array Intersection

### Problem

Implement set operations on arrays:

1. \`intersection(arr1, arr2)\` — elements present in both arrays
2. \`union(arr1, arr2)\` — all unique elements from both arrays
3. \`difference(arr1, arr2)\` — elements in arr1 that are not in arr2

### Examples

\`\`\`js
intersection([1,2,3], [2,3,4])  // [2, 3]
union([1,2,3], [2,3,4])         // [1, 2, 3, 4]
difference([1,2,3], [2,3,4])    // [1]
\`\`\`

### Key Concepts

- \`Set\` for O(1) lookups instead of \`includes\` (O(n))
- Spread operator to convert Set back to Array
- \`filter\` with Set membership checks
- These utilities are used constantly in real-world code`,
      starterCode: `// Array Intersection, Union, Difference
// Implement set operations on arrays

function intersection(arr1, arr2) {
  // Return elements present in BOTH arrays
  // Handle duplicates — each element appears at most once
  // YOUR CODE HERE
}

function union(arr1, arr2) {
  // Return all unique elements from both arrays combined
  // YOUR CODE HERE
}

function difference(arr1, arr2) {
  // Return elements in arr1 that are NOT in arr2
  // YOUR CODE HERE
}

// Test cases
console.log(intersection([1, 2, 3, 4], [2, 4, 6, 8]));
// Expected: [2, 4]

console.log(intersection([1, 2, 2, 3], [2, 2, 3, 4]));
// Expected: [2, 3]

console.log(intersection([1, 2], [3, 4]));
// Expected: []

console.log(union([1, 2, 3], [2, 3, 4, 5]));
// Expected: [1, 2, 3, 4, 5]

console.log(union([1, 1, 2], [2, 3, 3]));
// Expected: [1, 2, 3]

console.log(difference([1, 2, 3, 4, 5], [2, 4]));
// Expected: [1, 3, 5]

console.log(difference([1, 2, 3], [1, 2, 3]));
// Expected: []

console.log(difference([1, 2, 3], []));
// Expected: [1, 2, 3]`,
      solutionCode: `// Array Intersection, Union, Difference
// Implement set operations on arrays

function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter(item => set2.has(item));
}

function union(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])];
}

function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter(item => !set2.has(item));
}

// Test cases
console.log(intersection([1, 2, 3, 4], [2, 4, 6, 8]));
// Expected: [2, 4]

console.log(intersection([1, 2, 2, 3], [2, 2, 3, 4]));
// Expected: [2, 3]

console.log(intersection([1, 2], [3, 4]));
// Expected: []

console.log(union([1, 2, 3], [2, 3, 4, 5]));
// Expected: [1, 2, 3, 4, 5]

console.log(union([1, 1, 2], [2, 3, 3]));
// Expected: [1, 2, 3]

console.log(difference([1, 2, 3, 4, 5], [2, 4]));
// Expected: [1, 3, 5]

console.log(difference([1, 2, 3], [1, 2, 3]));
// Expected: []

console.log(difference([1, 2, 3], []));
// Expected: [1, 2, 3]`,
    },
  ],
};
