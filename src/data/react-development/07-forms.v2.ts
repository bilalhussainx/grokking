import { Module } from "../types";

export const formsModule: Module = {
  id: "forms",
  title: "Forms & Validation",
  description: "Master form handling in React by building form state managers, validation engines, and multi-step form wizards from scratch.",
  lessons: [
    {
      id: "forms-intro",
      slug: "forms-intro",
      title: "Introduction to Forms in React",
      content: `## Forms in React

Forms are one of the most interactive parts of any web application. React provides two approaches to managing form inputs, each with distinct trade-offs that affect performance, user experience, and code complexity.

\`\`\`concept
{
  "title": "Controlled vs Uncontrolled Components",
  "variant": "mental-model",
  "content": "Think of controlled components as a puppet where React holds all the strings (state), while uncontrolled components are like a self-driving car that React can only observe through a dashboard (ref) when needed."
}
\`\`\`

### Controlled vs Uncontrolled Components

| Controlled | Uncontrolled |
|-----------|-------------|
| React state drives the input value | DOM maintains the value |
| \`value={state}\` + \`onChange\` handler | \`ref\` to read value when needed |
| Every keystroke triggers re-render | Only read value on submit |
| Full control over input behavior | Simpler for basic forms |

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Uncontrolled (Basic)",
    "code": "function LoginForm() {\\n  const emailRef = useRef();\\n  const passRef = useRef();\\n  \\n  const handleSubmit = (e) => {\\n    e.preventDefault();\\n    console.log(emailRef.current.value);\\n  };\\n  \\n  return (\\n    <form onSubmit={handleSubmit}>\\n      <input ref={emailRef} type=\\"email\\" />\\n      <input ref={passRef} type=\\"password\\" />\\n      <button>Login</button>\\n    </form>\\n  );\\n}"
  },
  "after": {
    "label": "Controlled (With Validation)",
    "code": "function LoginForm() {\\n  const [email, setEmail] = useState('');\\n  const [password, setPassword] = useState('');\\n  const [errors, setErrors] = useState({});\\n  \\n  const validate = () => {\\n    const newErrors = {};\\n    if (!email.includes('@')) newErrors.email = 'Invalid email';\\n    if (password.length < 8) newErrors.password = 'Too short';\\n    setErrors(newErrors);\\n    return Object.keys(newErrors).length === 0;\\n  };\\n  \\n  const handleSubmit = (e) => {\\n    e.preventDefault();\\n    if (validate()) console.log({ email, password });\\n  };\\n  \\n  return (\\n    <form onSubmit={handleSubmit}>\\n      <input \\n        value={email} \\n        onChange={(e) => setEmail(e.target.value)}\\n        className={errors.email ? 'error' : ''}\\n      />\\n      {errors.email && <span>{errors.email}</span>}\\n      <input \\n        value={password} \\n        onChange={(e) => setPassword(e.target.value)}\\n        className={errors.password ? 'error' : ''}\\n      />\\n      {errors.password && <span>{errors.password}</span>}\\n      <button>Login</button>\\n    </form>\\n  );\\n}"
  }
}
\`\`\`

### The Controlled Input Pattern

\`\`\`playground
{
  "title": "Controlled Input Pattern",
  "language": "javascript",
  "code": "import { useState } from 'react';\\n\\nfunction NameInput() {\\n  const [name, setName] = useState(\\"\\");\\n\\n  return (\\n    <div>\\n      <input\\n        value={name}\\n        onChange={(e) => setName(e.target.value)}\\n        placeholder=\\"Type your name...\\"\\n      />\\n      <p>Hello, {name || 'stranger'}!</p>\\n      <p>Character count: {name.length}</p>\\n    </div>\\n  );\\n}\\n\\nexport default NameInput;",
  "runnable": true
}
\`\`\`

React is the "single source of truth" — the input always reflects the state. This pattern enables real-time validation, dynamic UI updates, and complete control over the form's behavior.

### Form Validation Strategies

| Strategy | When | Pros | Cons |
|----------|------|------|------|
| On change | Every keystroke | Instant feedback | Can be annoying |
| On blur | When field loses focus | Balanced UX | Delayed first error |
| On submit | Form submission | Non-intrusive | Late feedback |
| Hybrid | Blur first, then change | Best UX | More complex |

\`\`\`steps
{
  "title": "Implementing Hybrid Validation",
  "steps": [
    {
      "title": "Track touched fields",
      "content": "Use state to track which fields have been blurred at least once:\\n\`\`\`javascript\\nconst [touched, setTouched] = useState({});\\nconst handleBlur = (field) => {\\n  setTouched(prev => ({ ...prev, [field]: true }));\\n};\\n\`\`\`"
    },
    {
      "title": "Validate on blur",
      "content": "When a field loses focus, validate it and show errors:\\n\`\`\`javascript\\nconst handleEmailBlur = () => {\\n  setTouched(prev => ({ ...prev, email: true }));\\n  if (!email.includes('@')) {\\n    setErrors(prev => ({ ...prev, email: 'Invalid email' }));\\n  }\\n};\\n\`\`\`"
    },
    {
      "title": "Validate on change for touched fields",
      "content": "Only show validation errors while typing if the field has been blurred:\\n\`\`\`javascript\\nconst handleEmailChange = (e) => {\\n  const newEmail = e.target.value;\\n  setEmail(newEmail);\\n  if (touched.email) {\\n    setErrors(prev => ({\\n      ...prev,\\n      email: newEmail.includes('@') ? '' : 'Invalid email'\\n    }));\\n  }\\n};\\n\`\`\`"
    }
  ]
}
\`\`\`

### Common Validation Rules

- **Required** — field must have a value
- **Min/Max length** — string length constraints
- **Pattern** — regex matching (email, phone, etc.)
- **Custom** — business logic (password strength, unique username)
- **Cross-field** — password confirmation, date ranges

\`\`\`quiz
{
  "title": "Form Validation Knowledge Check",
  "questions": [
    {
      "question": "Which validation strategy provides the best user experience for complex forms?",
      "options": ["On change", "On blur", "On submit", "Hybrid (blur then change)"],
      "answer": 3,
      "explanation": "Hybrid validation shows errors after the user leaves a field (on blur), then continues validating as they type (on change), providing timely feedback without being overwhelming."
    },
    {
      "question": "In a controlled component, what triggers a re-render?",
      "options": ["Every DOM mutation", "Every state update via onChange", "Only on form submission", "Only when the component mounts"],
      "answer": 1,
      "explanation": "Controlled components update React state on every onChange event, which triggers a re-render to keep the UI in sync with the state."
    },
    {
      "question": "When should you use uncontrolled components?",
      "options": ["Never, always use controlled", "For simple forms with minimal validation", "Only with class components", "When you need real-time validation"],
      "answer": 1,
      "explanation": "Uncontrolled components are suitable for simple forms where you don't need real-time validation or dynamic behavior, as they reduce boilerplate and re-renders."
    }
  ]
}
\`\`\`

### Form Libraries in React

Real-world apps often use libraries like React Hook Form, Formik, or Zod for validation. But understanding the underlying patterns is essential. These libraries abstract away the complexity while still relying on the same controlled/uncontrolled principles you'll master in this module.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Controlled components give React full control but require more code and can cause more re-renders",
    "Uncontrolled components are simpler but limit your ability to validate or manipulate input in real-time",
    "Hybrid validation (blur then change) provides the best balance of user experience and code complexity",
    "Understanding these patterns is crucial before adopting form libraries like React Hook Form or Formik"
  ]
}
\`\`\``,
    },
    {
      id: "forms-validator",
      slug: "form-validator",
      title: "Form Validator",
      content: `## Form Validator

### Problem Statement

Implement a \`createFormValidator(schema)\` that validates form data against a set of rules. The schema maps field names to arrays of validation rules.

Each rule is an object with:
- \`type\` — the validation type: "required", "minLength", "maxLength", "pattern", "custom"
- \`value\` — the parameter (min length number, regex pattern, custom function)
- \`message\` — the error message to show on failure

The validator returns:
- \`validate(data)\` — validates all fields, returns \`{ valid, errors }\`
- \`validateField(field, value)\` — validates a single field
- \`getErrors()\` — returns the current error state

\`\`\`concept
{
  "title": "Why Build Your Own Validator?",
  "variant": "insight",
  "content": "While libraries like React Hook Form (3800ms render time under stress) and Formik (5800ms) exist, building your own validator teaches you the core patterns behind schema validation. This knowledge transfers directly to production libraries like Zod and Yup, which centralize validation logic for maintainability and type safety."
}
\`\`\`

### Examples

\`\`\`
const validator = createFormValidator({
  email: [
    { type: "required", message: "Email is required" },
    { type: "pattern", value: /@/, message: "Must contain @" },
  ],
  password: [
    { type: "required", message: "Password is required" },
    { type: "minLength", value: 8, message: "At least 8 characters" },
  ],
});

validator.validate({ email: "", password: "123" });
// { valid: false, errors: { email: ["Email is required"], password: ["At least 8 characters"] } }
\`\`\`

\`\`\`algoviz
{
  "title": "Validation Flow for Empty Email",
  "type": "array",
  "data": ["email: ''", "password: '123'", "required check", "pattern skip", "minLength fail"],
  "frames": [
    { "highlight": [0], "label": "Check email field" },
    { "highlight": [2], "label": "required rule fails - empty string" },
    { "highlight": [3], "label": "Skip remaining rules for email" },
    { "highlight": [1], "label": "Check password field" },
    { "highlight": [4], "label": "minLength rule fails - only 3 chars" }
  ],
  "speed": 1000
}
\`\`\`

### Implementation Strategy

\`\`\`steps
{
  "title": "Building the Validator",
  "steps": [
    {
      "title": "1. Create Rule Handlers",
      "content": "Map each validation type to a function that returns true/false:\\n- \`required\`: value !== '' && value != null\\n- \`minLength\`: value.length >= rule.value\\n- \`maxLength\`: value.length <= rule.value\\n- \`pattern\`: rule.value.test(value)\\n- \`custom\`: rule.value(value, allData)"
    },
    {
      "title": "2. Field Validation Logic",
      "content": "For each field's rule array:\\n1. Iterate through rules in order\\n2. Stop at first failure (short-circuit)\\n3. Collect error message\\n4. Skip remaining rules if required fails"
    },
    {
      "title": "3. State Management",
      "content": "Maintain internal error state:\\n- Initialize as empty object\\n- Update on validate() calls\\n- Provide getErrors() accessor\\n- Clear errors on successful validation"
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Implement createFormValidator",
  "language": "javascript",
  "code": "function createFormValidator(schema) {\\n  let errors = {};\\n  \\n  const ruleHandlers = {\\n    required: (value) => value !== '' && value != null,\\n    minLength: (value, min) => value.length >= min,\\n    maxLength: (value, max) => value.length <= max,\\n    pattern: (value, regex) => regex.test(value),\\n    custom: (value, fn, allData) => fn(value, allData)\\n  };\\n  \\n  function validateField(field, value, allData) {\\n    const rules = schema[field];\\n    if (!rules) return [];\\n    \\n    const fieldErrors = [];\\n    \\n    for (const rule of rules) {\\n      const handler = ruleHandlers[rule.type];\\n      let isValid = false;\\n      \\n      if (rule.type === 'custom') {\\n        isValid = handler(value, rule.value, allData);\\n      } else if (rule.type === 'required') {\\n        isValid = handler(value);\\n      } else {\\n        isValid = handler(value, rule.value);\\n      }\\n      \\n      if (!isValid) {\\n        fieldErrors.push(rule.message);\\n        if (rule.type === 'required') break; // Short-circuit\\n      }\\n    }\\n    \\n    return fieldErrors;\\n  }\\n  \\n  return {\\n    validate(data) {\\n      errors = {};\\n      let valid = true;\\n      \\n      for (const field in schema) {\\n        const fieldErrors = validateField(field, data[field], data);\\n        if (fieldErrors.length > 0) {\\n          errors[field] = fieldErrors;\\n          valid = false;\\n        }\\n      }\\n      \\n      return { valid, errors };\\n    },\\n    \\n    validateField(field, value) {\\n      const fieldErrors = validateField(field, value);\\n      if (fieldErrors.length > 0) {\\n        errors[field] = fieldErrors;\\n      } else {\\n        delete errors[field];\\n      }\\n      return fieldErrors;\\n    },\\n    \\n    getErrors() {\\n      return errors;\\n    }\\n  };\\n}\\n\\n// Test the implementation\\nconst validator = createFormValidator({\\n  email: [\\n    { type: \\"required\\", message: \\"Email is required\\" },\\n    { type: \\"pattern\\", value: /@/, message: \\"Must contain @\\" },\\n  ],\\n  password: [\\n    { type: \\"required\\", message: \\"Password is required\\" },\\n    { type: \\"minLength\\", value: 8, message: \\"At least 8 characters\\" },\\n  ],\\n});\\n\\nconsole.log(validator.validate({ email: \\"\\", password: \\"123\\" }));\\nconsole.log(validator.validate({ email: \\"user@example.com\\", password: \\"securepass123\\" }));",
  "runnable": true
}
\`\`\`

### Advanced Patterns

\`\`\`callout
{
  "type": "warning",
  "title": "Client-Side Validation Isn't Enough",
  "content": "While this validator runs in the browser for instant feedback, always re-validate on the server. Client-side validation can be bypassed by disabling JavaScript or manipulating requests. Server-side validation is your final security gatekeeper."
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Validating All Rules (Inefficient)",
    "code": "// Don't do this - validates even after required fails\\nfor (const rule of rules) {\\n  if (!isValidRule(rule, value)) {\\n    errors.push(rule.message);\\n  }\\n}"
  },
  "after": {
    "label": "Short-Circuit on Required (Efficient)",
    "code": "// Do this - skip remaining rules if required fails\\nfor (const rule of rules) {\\n  if (!isValidRule(rule, value)) {\\n    errors.push(rule.message);\\n    if (rule.type === 'required') break;\\n  }\\n}"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Validation Strategy Quiz",
  "questions": [
    {
      "question": "Why short-circuit after a failed 'required' rule?",
      "options": ["To improve performance", "To show fewer errors", "Required is most important", "All of the above"],
      "answer": 0,
      "explanation": "Short-circuiting prevents unnecessary validation checks, improving performance especially with complex rules like regex patterns or custom functions."
    },
    {
      "question": "When should you use the 'custom' validation type?",
      "options": ["For email patterns", "For cross-field validation", "For required fields", "For string length"],
      "answer": 1,
      "explanation": "Custom validation is perfect for complex rules like 'passwords must match' or 'end date after start date' that need access to all form data."
    },
    {
      "question": "What's the main benefit of schema-based validation?",
      "options": ["Faster rendering", "Centralized logic", "Smaller bundle size", "Less memory usage"],
      "answer": 1,
      "explanation": "Schema validation centralizes all rules in one declarative object, making it reusable, testable, and maintainable as forms grow complex."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Build validators with short-circuit logic to skip unnecessary checks after required fails",
    "Maintain internal error state and provide both full and field-level validation methods",
    "Always re-validate on the server - client-side validation is for UX, not security",
    "Schema-based validation centralizes logic and scales better than inline validation"
  ]
}
\`\`\``,
      starterCode: `function createFormValidator(schema) {
  // TODO: Create a form validator with:
  // - validate(data): validate all fields, return { valid, errors }
  // - validateField(field, value): validate one field, return string[]
  // - getErrors(): return current error map
  //
  // Rule types:
  // - "required": value must be truthy (non-empty string, etc.)
  // - "minLength": string length >= rule.value
  // - "maxLength": string length <= rule.value
  // - "pattern": value matches regex rule.value
  // - "custom": rule.value(fieldValue, allData) returns true if valid
}

// Test cases
const validator = createFormValidator({
  username: [
    { type: "required", message: "Username is required" },
    { type: "minLength", value: 3, message: "Username must be at least 3 characters" },
    { type: "maxLength", value: 20, message: "Username must be at most 20 characters" },
    { type: "pattern", value: /^[a-zA-Z0-9_]+$/, message: "Only letters, numbers, and underscores" },
  ],
  email: [
    { type: "required", message: "Email is required" },
    { type: "pattern", value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, message: "Invalid email format" },
  ],
  password: [
    { type: "required", message: "Password is required" },
    { type: "minLength", value: 8, message: "Password must be at least 8 characters" },
    { type: "custom", value: (val) => /[A-Z]/.test(val), message: "Must contain an uppercase letter" },
    { type: "custom", value: (val) => /[0-9]/.test(val), message: "Must contain a number" },
  ],
  confirmPassword: [
    { type: "required", message: "Please confirm your password" },
    { type: "custom", value: (val, data) => val === data.password, message: "Passwords do not match" },
  ],
});

// Test 1: All valid
const result1 = validator.validate({
  username: "alice_42",
  email: "alice@example.com",
  password: "Secret123",
  confirmPassword: "Secret123",
});
console.log(result1.valid);
// Expected: true
console.log(result1.errors);
// Expected: {}

// Test 2: Multiple errors
const result2 = validator.validate({
  username: "",
  email: "not-an-email",
  password: "weak",
  confirmPassword: "mismatch",
});
console.log(result2.valid);
// Expected: false
console.log(result2.errors.username);
// Expected: ["Username is required", "Username must be at least 3 characters"]
console.log(result2.errors.email);
// Expected: ["Invalid email format"]
console.log(result2.errors.password);
// Expected: ["Password must be at least 8 characters", "Must contain an uppercase letter", "Must contain a number"]

// Test 3: Single field validation
const emailErrors = validator.validateField("email", "bad");
console.log(emailErrors);
// Expected: ["Invalid email format"]

const emailValid = validator.validateField("email", "good@email.com");
console.log(emailValid);
// Expected: []

// Test 4: Pattern validation
const usernameErrors = validator.validateField("username", "no spaces!");
console.log(usernameErrors);
// Expected: ["Only letters, numbers, and underscores"]

// Test 5: Max length
const longName = validator.validateField("username", "a".repeat(25));
console.log(longName);
// Expected: ["Username must be at most 20 characters"]
`,
      solutionCode: `function createFormValidator(schema) {
  let currentErrors = {};

  function applyRule(rule, value, allData) {
    switch (rule.type) {
      case "required":
        return !value || (typeof value === "string" && value.trim() === "")
          ? rule.message
          : null;
      case "minLength":
        return value && value.length < rule.value ? rule.message : null;
      case "maxLength":
        return value && value.length > rule.value ? rule.message : null;
      case "pattern":
        return value && !rule.value.test(value) ? rule.message : null;
      case "custom":
        return value && !rule.value(value, allData) ? rule.message : null;
      default:
        return null;
    }
  }

  return {
    validate(data) {
      const errors = {};
      for (const [field, rules] of Object.entries(schema)) {
        const fieldErrors = [];
        for (const rule of rules) {
          const error = applyRule(rule, data[field], data);
          if (error) fieldErrors.push(error);
          if (rule.type === "required" && error) break;
        }
        if (fieldErrors.length > 0) {
          errors[field] = fieldErrors;
        }
      }
      currentErrors = errors;
      return {
        valid: Object.keys(errors).length === 0,
        errors,
      };
    },
    validateField(field, value) {
      const rules = schema[field];
      if (!rules) return [];
      const errors = [];
      for (const rule of rules) {
        const error = applyRule(rule, value, {});
        if (error) errors.push(error);
        if (rule.type === "required" && error) break;
      }
      return errors;
    },
    getErrors() {
      return { ...currentErrors };
    },
  };
}

// Test cases
const validator = createFormValidator({
  username: [
    { type: "required", message: "Username is required" },
    { type: "minLength", value: 3, message: "Username must be at least 3 characters" },
    { type: "maxLength", value: 20, message: "Username must be at most 20 characters" },
    { type: "pattern", value: /^[a-zA-Z0-9_]+$/, message: "Only letters, numbers, and underscores" },
  ],
  email: [
    { type: "required", message: "Email is required" },
    { type: "pattern", value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, message: "Invalid email format" },
  ],
  password: [
    { type: "required", message: "Password is required" },
    { type: "minLength", value: 8, message: "Password must be at least 8 characters" },
    { type: "custom", value: (val) => /[A-Z]/.test(val), message: "Must contain an uppercase letter" },
    { type: "custom", value: (val) => /[0-9]/.test(val), message: "Must contain a number" },
  ],
  confirmPassword: [
    { type: "required", message: "Please confirm your password" },
    { type: "custom", value: (val, data) => val === data.password, message: "Passwords do not match" },
  ],
});

// Test 1: All valid
const result1 = validator.validate({
  username: "alice_42",
  email: "alice@example.com",
  password: "Secret123",
  confirmPassword: "Secret123",
});
console.log(result1.valid);
// Expected: true
console.log(result1.errors);
// Expected: {}

// Test 2: Multiple errors
const result2 = validator.validate({
  username: "",
  email: "not-an-email",
  password: "weak",
  confirmPassword: "mismatch",
});
console.log(result2.valid);
// Expected: false
console.log(result2.errors.username);
// Expected: ["Username is required", "Username must be at least 3 characters"]
console.log(result2.errors.email);
// Expected: ["Invalid email format"]
console.log(result2.errors.password);
// Expected: ["Password must be at least 8 characters", "Must contain an uppercase letter", "Must contain a number"]

// Test 3: Single field validation
const emailErrors = validator.validateField("email", "bad");
console.log(emailErrors);
// Expected: ["Invalid email format"]

const emailValid = validator.validateField("email", "good@email.com");
console.log(emailValid);
// Expected: []

// Test 4: Pattern validation
const usernameErrors = validator.validateField("username", "no spaces!");
console.log(usernameErrors);
// Expected: ["Only letters, numbers, and underscores"]

// Test 5: Max length
const longName = validator.validateField("username", "a".repeat(25));
console.log(longName);
// Expected: ["Username must be at most 20 characters"]
`,
    },
    {
      id: "forms-wizard",
      slug: "form-wizard",
      title: "Multi-Step Form Wizard",
      content: `## Multi-Step Form Wizard

\`\`\`concept
{"title": "What is a Multi-Step Form Wizard?", "variant": "mental-model", "content": "Think of a multi-step form wizard as a guided tour through a complex data collection process. Instead of dumping 20+ fields on a single page (overwhelming users), you break the journey into logical \\"rooms\\" (steps). Each room has a specific theme (personal info, address, preferences), validation happens at the door before you can proceed, and a progress bar acts as your map showing how far you've traveled and what's left."}
\`\`\`

Multi-step forms can boost conversion rates by up to 300 % for longer processes by reducing cognitive load and making the experience feel manageable.

### Problem Statement

Implement a \`createFormWizard(steps)\` that manages a multi-step form with per-step validation, navigation, and data aggregation.

Each step has:
- \`id\` — step identifier
- \`fields\` — array of field names for this step
- \`validate(data)\` — optional validation function returning \`{ valid, errors }\`

The wizard returns:
- \`getCurrentStep()\` — returns the current step config
- \`getData()\` — returns all collected form data
- \`setField(field, value)\` — sets a field value
- \`next()\` — validates and moves to next step; returns \`{ success, errors }\`
- \`prev()\` — moves to previous step
- \`canGoNext()\` — returns true if not on last step
- \`canGoPrev()\` — returns true if not on first step
- \`getProgress()\` — returns \`{ current, total, percent }\`
- \`submit()\` — validates all steps and returns final data or errors

\`\`\`steps
{"title": "Building the Wizard Internals", "steps": [{"title": "1. Flat State Object", "content": "Store all form data in a single flat object keyed by field name. This avoids nested state sprawl and makes validation simple: \`{ name: 'Alice', email: 'a@b.com', city: 'NY' }\`."}, {"title": "2. Step Index Tracking", "content": "Keep an integer \`current\` index (0-based). Navigation becomes simple arithmetic: \`next()\` → \`current++\`, \`prev()\` → \`current--\`."}, {"title": "3. Validation Gate", "content": "Before advancing, run the current step’s \`validate(data)\` if provided. If \`valid === false\`, stay on the same step and surface errors."}, {"title": "4. Final Submission", "content": "\`submit()\` re-validates **every** step (not just the current one) to catch any inter-step dependencies or changes made via \`setField\` on previously visited steps."}]}
\`\`\`

### Example Walk-Through

\`\`\`algoviz
{"title": "Wizard State Over Time", "type": "array", "data": ["personal", "address", "confirm"], "frames": [{"highlight": [0], "label": "Step 0: personal fields (name, email)", "stats": {"current": 0, "total": 3, "percent": 0}}, {"highlight": [0], "label": "setField('name', 'Alice') → data.name = 'Alice'", "stats": {"current": 0, "total": 3, "percent": 0}}, {"highlight": [0], "label": "next() validates personal step", "stats": {"current": 0, "total": 3, "percent": 0}}, {"highlight": [1], "label": "Validation passed → move to address", "stats": {"current": 1, "total": 3, "percent": 33}}, {"highlight": [1], "label": "setField('city', 'Boston')", "stats": {"current": 1, "total": 3, "percent": 33}}, {"highlight": [2], "label": "next() again → confirm step", "stats": {"current": 2, "total": 3, "percent": 67}}], "speed": 1200}
\`\`\`

\`\`\`playground
{"title": "Starter Template", "language": "javascript", "code": "function createFormWizard(steps) {\\n  // TODO: implement the wizard API\\n  const data = {};\\n  let current = 0;\\n\\n  return {\\n    getCurrentStep() { return steps[current]; },\\n    getData() { return data; },\\n    setField(field, value) { data[field] = value; },\\n    next() {\\n      // 1. validate current step if it has validate()\\n      // 2. if invalid return { success: false, errors }\\n      // 3. else advance current and return { success: true }\\n    },\\n    prev() { /* ... */ },\\n    canGoNext() { /* ... */ },\\n    canGoPrev() { /* ... */ },\\n    getProgress() { /* ... */ },\\n    submit() { /* validate ALL steps */ }\\n  };\\n}", "runnable": false}
\`\`\`

\`\`\`callout
{"type": "tip", "title": "Design Tip: 3–5 Steps Sweet Spot", "content": "Research shows conversion rates drop when a wizard exceeds 5 steps or when any single step contains more than 6 fields. Group related questions logically and show a progress indicator to set expectations."}
\`\`\`

### Validation Behavior

\`\`\`compare
{"variant": "good-bad", "before": {"label": "next() without validation", "code": "next() {\\n  current++;          // always advances\\n  return { success: true };\\n}"}, "after": {"label": "next() with validation gate", "code": "next() {\\n  const step = steps[current];\\n  if (step.validate) {\\n    const { valid, errors } = step.validate(data);\\n    if (!valid) return { success: false, errors };\\n  }\\n  current++;\\n  return { success: true };\\n}"}}
\`\`\`

### Full Usage Example

\`\`\`trace
{"title": "Complete Wizard Run", "language": "javascript", "code": "const wizard = createFormWizard([\\n  { id: 'personal', fields: ['name', 'email'],\\n    validate: (d) => ({ valid: !!d.name && !!d.email, errors: { name: !d.name && 'required' } }) },\\n  { id: 'address', fields: ['city', 'zip'] },\\n  { id: 'confirm', fields: [] }\\n]);\\n\\nwizard.setField('name', 'Alice');\\nconsole.log(wizard.next()); // { success: false, errors: { email: 'required' } }\\n\\nwizard.setField('email', 'alice@example.com');\\nconsole.log(wizard.next()); // { success: true }\\nconsole.log(wizard.getProgress()); // { current: 2, total: 3, percent: 67 }\\n\\nwizard.setField('city', 'Boston');\\nconsole.log(wizard.submit()); // { success: true, data: { name:'Alice', email:'alice@example.com', city:'Boston' } }", "frames": [{"line": 1, "vars": {"steps": [{"id": "personal", "fields": ["name", "email"]}, {"id": "address", "fields": ["city", "zip"]}, {"id": "confirm", "fields": []}]}, "note": "wizard created, current = 0"}, {"line": 6, "vars": {"data": {"name": "Alice"}, "current": 0}, "note": "name set, email still missing"}, {"line": 7, "stdout": "{ success: false, errors: { email: 'required' } }", "note": "validation blocked advance"}, {"line": 9, "vars": {"data": {"name": "Alice", "email": "alice@example.com"}, "current": 0}, "note": "email now provided"}, {"line": 10, "stdout": "{ success: true }", "note": "validation passed, current → 1"}, {"line": 11, "stdout": "{ current: 2, total: 3, percent: 67 }", "note": "progress reflects 1-based display"}], "speed": 800}
\`\`\`

\`\`\`quiz
{"title": "Check Your Understanding", "questions": [{"question": "When does the wizard run validation?", "options": ["On every setField() call", "Only when submit() is called", "On next() before advancing", "Only on the confirm step"], "answer": 2, "explanation": "Validation is a gatekeeper: it runs during next() to decide whether the user may proceed to the following step."}, {"question": "Why store all data in a single flat object instead of nesting by step?", "options": ["To reduce memory usage", "To simplify validation and avoid state sprawl", "To enable Redux integration", "To encrypt sensitive fields"], "answer": 1, "explanation": "A flat structure keeps the codebase simple and lets any step or final submission validate against the same unified dataset."}, {"question": "What return value indicates a successful move to the next step?", "options": ["{ ok: true }", "{ moved: true }", "{ success: true }", "undefined"], "answer": 2, "explanation": "The API contract specifies \`{ success: true }\` when navigation succeeds; \`{ success: false, errors }\` when blocked."}]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Break long forms into 3–5 logical steps with ≤6 fields each to reduce cognitive load and boost conversions.", "Keep form data flat and centralized; validate on next() to create a gated progression.", "submit() must re-validate every step to catch cross-step inconsistencies and ensure data integrity."]}
\`\`\``,
      starterCode: `function createFormWizard(steps) {
  // TODO: Create a multi-step form wizard with:
  // - Step tracking (current step index)
  // - Form data collection across all steps
  // - Per-step validation on next()
  // - Navigation: next(), prev()
  // - Progress tracking
  // - Final submit with full validation
}

// Test cases
const wizard = createFormWizard([
  {
    id: "account",
    fields: ["username", "email"],
    validate: (data) => {
      const errors = {};
      if (!data.username) errors.username = "Username is required";
      if (!data.email || !data.email.includes("@")) errors.email = "Valid email required";
      return { valid: Object.keys(errors).length === 0, errors };
    },
  },
  {
    id: "profile",
    fields: ["fullName", "bio"],
    validate: (data) => {
      const errors = {};
      if (!data.fullName) errors.fullName = "Full name is required";
      return { valid: Object.keys(errors).length === 0, errors };
    },
  },
  {
    id: "preferences",
    fields: ["theme", "notifications"],
    validate: (data) => {
      return { valid: true, errors: {} };
    },
  },
]);

// Test 1: Initial state
console.log(wizard.getCurrentStep().id);
// Expected: "account"
console.log(wizard.getProgress());
// Expected: { current: 1, total: 3, percent: 33 }

// Test 2: Cannot advance without valid data
const result1 = wizard.next();
console.log(result1.success);
// Expected: false
console.log(result1.errors);
// Expected: { username: "Username is required", email: "Valid email required" }

// Test 3: Set fields and advance
wizard.setField("username", "alice");
wizard.setField("email", "alice@example.com");
const result2 = wizard.next();
console.log(result2.success);
// Expected: true
console.log(wizard.getCurrentStep().id);
// Expected: "profile"

// Test 4: Progress tracking
console.log(wizard.getProgress());
// Expected: { current: 2, total: 3, percent: 67 }

// Test 5: Navigation checks
console.log(wizard.canGoPrev());
// Expected: true
console.log(wizard.canGoNext());
// Expected: true

// Test 6: Go back preserves data
wizard.prev();
console.log(wizard.getCurrentStep().id);
// Expected: "account"
console.log(wizard.getData().username);
// Expected: "alice"

// Test 7: Go forward again
wizard.next();
wizard.setField("fullName", "Alice Smith");
wizard.setField("bio", "Developer");
wizard.next();
console.log(wizard.getCurrentStep().id);
// Expected: "preferences"

// Test 8: Last step
console.log(wizard.canGoNext());
// Expected: false

// Test 9: Set optional preferences
wizard.setField("theme", "dark");
wizard.setField("notifications", true);

// Test 10: Submit collects all data
const submitResult = wizard.submit();
console.log(submitResult.success);
// Expected: true
console.log(submitResult.data);
// Expected: { username: "alice", email: "alice@example.com", fullName: "Alice Smith", bio: "Developer", theme: "dark", notifications: true }

// Test 11: Submit fails if any step is invalid
const wizard2 = createFormWizard([
  {
    id: "step1",
    fields: ["name"],
    validate: (data) => {
      if (!data.name) return { valid: false, errors: { name: "Required" } };
      return { valid: true, errors: {} };
    },
  },
]);
const badSubmit = wizard2.submit();
console.log(badSubmit.success);
// Expected: false
`,
      solutionCode: `function createFormWizard(steps) {
  let currentIndex = 0;
  const data = {};

  return {
    getCurrentStep() {
      return steps[currentIndex];
    },
    getData() {
      return { ...data };
    },
    setField(field, value) {
      data[field] = value;
    },
    next() {
      const step = steps[currentIndex];
      if (step.validate) {
        const result = step.validate(data);
        if (!result.valid) {
          return { success: false, errors: result.errors };
        }
      }
      if (currentIndex < steps.length - 1) {
        currentIndex++;
        return { success: true, errors: {} };
      }
      return { success: false, errors: { _form: "Already on last step" } };
    },
    prev() {
      if (currentIndex > 0) {
        currentIndex--;
      }
    },
    canGoNext() {
      return currentIndex < steps.length - 1;
    },
    canGoPrev() {
      return currentIndex > 0;
    },
    getProgress() {
      return {
        current: currentIndex + 1,
        total: steps.length,
        percent: Math.round(((currentIndex + 1) / steps.length) * 100),
      };
    },
    submit() {
      for (const step of steps) {
        if (step.validate) {
          const result = step.validate(data);
          if (!result.valid) {
            return { success: false, errors: result.errors, data: null };
          }
        }
      }
      return { success: true, errors: {}, data: { ...data } };
    },
  };
}

// Test cases
const wizard = createFormWizard([
  {
    id: "account",
    fields: ["username", "email"],
    validate: (data) => {
      const errors = {};
      if (!data.username) errors.username = "Username is required";
      if (!data.email || !data.email.includes("@")) errors.email = "Valid email required";
      return { valid: Object.keys(errors).length === 0, errors };
    },
  },
  {
    id: "profile",
    fields: ["fullName", "bio"],
    validate: (data) => {
      const errors = {};
      if (!data.fullName) errors.fullName = "Full name is required";
      return { valid: Object.keys(errors).length === 0, errors };
    },
  },
  {
    id: "preferences",
    fields: ["theme", "notifications"],
    validate: (data) => {
      return { valid: true, errors: {} };
    },
  },
]);

// Test 1: Initial state
console.log(wizard.getCurrentStep().id);
// Expected: "account"
console.log(wizard.getProgress());
// Expected: { current: 1, total: 3, percent: 33 }

// Test 2: Cannot advance without valid data
const result1 = wizard.next();
console.log(result1.success);
// Expected: false
console.log(result1.errors);
// Expected: { username: "Username is required", email: "Valid email required" }

// Test 3: Set fields and advance
wizard.setField("username", "alice");
wizard.setField("email", "alice@example.com");
const result2 = wizard.next();
console.log(result2.success);
// Expected: true
console.log(wizard.getCurrentStep().id);
// Expected: "profile"

// Test 4: Progress tracking
console.log(wizard.getProgress());
// Expected: { current: 2, total: 3, percent: 67 }

// Test 5: Navigation checks
console.log(wizard.canGoPrev());
// Expected: true
console.log(wizard.canGoNext());
// Expected: true

// Test 6: Go back preserves data
wizard.prev();
console.log(wizard.getCurrentStep().id);
// Expected: "account"
console.log(wizard.getData().username);
// Expected: "alice"

// Test 7: Go forward again
wizard.next();
wizard.setField("fullName", "Alice Smith");
wizard.setField("bio", "Developer");
wizard.next();
console.log(wizard.getCurrentStep().id);
// Expected: "preferences"

// Test 8: Last step
console.log(wizard.canGoNext());
// Expected: false

// Test 9: Set optional preferences
wizard.setField("theme", "dark");
wizard.setField("notifications", true);

// Test 10: Submit collects all data
const submitResult = wizard.submit();
console.log(submitResult.success);
// Expected: true
console.log(submitResult.data);
// Expected: { username: "alice", email: "alice@example.com", fullName: "Alice Smith", bio: "Developer", theme: "dark", notifications: true }

// Test 11: Submit fails if any step is invalid
const wizard2 = createFormWizard([
  {
    id: "step1",
    fields: ["name"],
    validate: (data) => {
      if (!data.name) return { valid: false, errors: { name: "Required" } };
      return { valid: true, errors: {} };
    },
  },
]);
const badSubmit = wizard2.submit();
console.log(badSubmit.success);
// Expected: false
`,
    },
  ],
};
