import { Module } from "../types";

export const basicsModule: Module = {
  id: "js-basics",
  title: "Variables & Data Types",
  description:
    "Learn about variables (let, const, var), primitive data types, type coercion, and template literals in modern JavaScript.",
  lessons: [
    {
      id: "js-basics-intro",
      slug: "js-basics-intro",
      title: "Introduction to JavaScript Basics",
      content: `## JavaScript Basics

JavaScript is a **dynamic, loosely-typed** language that runs in browsers and on servers (Node.js). Before writing any logic, you need to understand how JavaScript stores and represents data.

### Variables

JavaScript has three ways to declare variables:

| Keyword | Scope | Reassignable | Hoisted |
|---------|-------|-------------|---------|
| \`var\` | Function | Yes | Yes (as \`undefined\`) |
| \`let\` | Block | Yes | No (TDZ) |
| \`const\` | Block | No | No (TDZ) |

**Best practice:** Use \`const\` by default. Use \`let\` only when you need to reassign. Avoid \`var\`.

### Primitive Data Types

JavaScript has **7 primitive types**: \`string\`, \`number\`, \`boolean\`, \`undefined\`, \`null\`, \`symbol\`, and \`bigint\`.

\`\`\`js
const name = "Alice";       // string
const age = 30;             // number
const active = true;        // boolean
let score;                  // undefined
const empty = null;         // null
\`\`\`

### Template Literals

Use backticks for string interpolation and multi-line strings:

\`\`\`js
const greeting = \\\`Hello, \\\${name}! You are \\\${age} years old.\\\`;
\`\`\`

### typeof Operator

Use \`typeof\` to check the type of a value at runtime. Note: \`typeof null\` returns \`"object"\` — this is a well-known JavaScript quirk.

In the following exercises, you will practice declaring variables, checking types, and using template literals.`,
    },
    {
      id: "js-basics-variable-swap",
      slug: "variable-swap",
      title: "Variable Swap",
      content: `## Variable Swap

### Problem

Write a function \`swap\` that takes two values and returns them in reversed order as an array \`[b, a]\`.

Then write a function \`swapInPlace\` that swaps two variables using **destructuring assignment** (no temporary variable).

### Examples

\`\`\`js
swap(1, 2)         // [2, 1]
swap("hello", "world") // ["world", "hello"]
\`\`\`

### Key Concepts

- Array destructuring: \`[a, b] = [b, a]\`
- Returning multiple values via arrays
- ES6 destructuring eliminates the need for temp variables

### Hints

- For \`swap\`, simply return \`[b, a]\`
- For \`swapInPlace\`, use destructuring: \`[a, b] = [b, a]\``,
      starterCode: `// Variable Swap
// Implement two swap approaches

function swap(a, b) {
  // Return an array with the values swapped
  // YOUR CODE HERE
}

function swapInPlace(a, b) {
  // Use destructuring to swap without a temp variable
  // Return [a, b] after swapping
  // YOUR CODE HERE
}

// Test cases
console.log(swap(1, 2));             // Expected: [2, 1]
console.log(swap("hello", "world")); // Expected: ["world", "hello"]
console.log(swap(true, false));      // Expected: [false, true]
console.log(swapInPlace(10, 20));    // Expected: [20, 10]
console.log(swapInPlace("a", "b"));  // Expected: ["b", "a"]`,
      solutionCode: `// Variable Swap
// Implement two swap approaches

function swap(a, b) {
  return [b, a];
}

function swapInPlace(a, b) {
  [a, b] = [b, a];
  return [a, b];
}

// Test cases
console.log(swap(1, 2));             // Expected: [2, 1]
console.log(swap("hello", "world")); // Expected: ["world", "hello"]
console.log(swap(true, false));      // Expected: [false, true]
console.log(swapInPlace(10, 20));    // Expected: [20, 10]
console.log(swapInPlace("a", "b"));  // Expected: ["b", "a"]`,
    },
    {
      id: "js-basics-type-checker",
      slug: "type-checker",
      title: "Type Checker",
      content: `## Type Checker

### Problem

Write a function \`getType\` that returns a **more accurate** type string than the built-in \`typeof\`. It should correctly identify:

- \`"null"\` (not \`"object"\`)
- \`"array"\` (not \`"object"\`)
- \`"date"\` for Date instances
- \`"regexp"\` for RegExp instances
- All other types should match \`typeof\` output

### Examples

\`\`\`js
getType(null)      // "null"
getType([1, 2])    // "array"
getType(new Date()) // "date"
getType(42)        // "number"
\`\`\`

### Key Concepts

- \`typeof null === "object"\` is a legacy bug in JavaScript
- \`Array.isArray()\` reliably detects arrays
- \`instanceof\` checks the prototype chain
- \`Object.prototype.toString.call()\` returns \`"[object Type]"\``,
      starterCode: `// Type Checker
// Build a more accurate typeof function

function getType(value) {
  // Handle null explicitly
  // Handle arrays
  // Handle Date and RegExp
  // Fall back to typeof for everything else
  // YOUR CODE HERE
}

// Test cases
console.log(getType(42));            // Expected: "number"
console.log(getType("hello"));      // Expected: "string"
console.log(getType(true));         // Expected: "boolean"
console.log(getType(undefined));    // Expected: "undefined"
console.log(getType(null));         // Expected: "null"
console.log(getType([1, 2, 3]));    // Expected: "array"
console.log(getType({ a: 1 }));     // Expected: "object"
console.log(getType(new Date()));   // Expected: "date"
console.log(getType(/abc/));        // Expected: "regexp"
console.log(getType(function(){})); // Expected: "function"`,
      solutionCode: `// Type Checker
// Build a more accurate typeof function

function getType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (value instanceof Date) return "date";
  if (value instanceof RegExp) return "regexp";
  return typeof value;
}

// Test cases
console.log(getType(42));            // Expected: "number"
console.log(getType("hello"));      // Expected: "string"
console.log(getType(true));         // Expected: "boolean"
console.log(getType(undefined));    // Expected: "undefined"
console.log(getType(null));         // Expected: "null"
console.log(getType([1, 2, 3]));    // Expected: "array"
console.log(getType({ a: 1 }));     // Expected: "object"
console.log(getType(new Date()));   // Expected: "date"
console.log(getType(/abc/));        // Expected: "regexp"
console.log(getType(function(){})); // Expected: "function"`,
    },
    {
      id: "js-basics-template-literals",
      slug: "template-literals",
      title: "Template Literals",
      content: `## Template Literals

### Problem

Write three functions that demonstrate different uses of template literals:

1. \`greet(name, age)\` — returns a greeting string with interpolated values
2. \`buildTable(headers, rows)\` — returns a formatted text table using template literals
3. \`tag\` — a tagged template function that wraps interpolated values in \`**bold**\`

### Examples

\`\`\`js
greet("Alice", 30)     // "Hello, Alice! You are 30 years old."
tag\\\`Hi \\\${name}\\\`       // "Hi **Alice**"
\`\`\`

### Key Concepts

- String interpolation with \`\\\${expression}\`
- Multi-line strings without \\n
- Tagged templates receive (strings[], ...values)
- Expression evaluation inside \`\\\${}\``,
      starterCode: `// Template Literals
// Master ES6 string interpolation

function greet(name, age) {
  // Return: "Hello, {name}! You are {age} years old."
  // Use a template literal
  // YOUR CODE HERE
}

function buildTable(headers, rows) {
  // Build a simple text table
  // headers: ["Name", "Age"]
  // rows: [["Alice", 30], ["Bob", 25]]
  // Return a string with headers and rows separated by " | "
  // YOUR CODE HERE
}

function tag(strings, ...values) {
  // Tagged template that wraps values in **bold**
  // YOUR CODE HERE
}

// Test cases
console.log(greet("Alice", 30));
// Expected: "Hello, Alice! You are 30 years old."

console.log(buildTable(["Name", "Age"], [["Alice", 30], ["Bob", 25]]));
// Expected:
// "Name | Age
// Alice | 30
// Bob | 25"

const name = "World";
const result = tag\`Hello \${name}, today is \${"Monday"}\`;
console.log(result);
// Expected: "Hello **World**, today is **Monday**"`,
      solutionCode: `// Template Literals
// Master ES6 string interpolation

function greet(name, age) {
  return \`Hello, \${name}! You are \${age} years old.\`;
}

function buildTable(headers, rows) {
  const headerLine = headers.join(" | ");
  const rowLines = rows.map(row => row.join(" | "));
  return [headerLine, ...rowLines].join("\\n");
}

function tag(strings, ...values) {
  let result = "";
  strings.forEach((str, i) => {
    result += str;
    if (i < values.length) {
      result += \`**\${values[i]}**\`;
    }
  });
  return result;
}

// Test cases
console.log(greet("Alice", 30));
// Expected: "Hello, Alice! You are 30 years old."

console.log(buildTable(["Name", "Age"], [["Alice", 30], ["Bob", 25]]));
// Expected:
// "Name | Age
// Alice | 30
// Bob | 25"

const name = "World";
const result = tag\`Hello \${name}, today is \${"Monday"}\`;
console.log(result);
// Expected: "Hello **World**, today is **Monday**"`,
    },
  ],
};
