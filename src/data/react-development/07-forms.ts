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

Forms are one of the most interactive parts of any web application. React provides two approaches to managing form inputs.

### Controlled vs Uncontrolled Components

| Controlled | Uncontrolled |
|-----------|-------------|
| React state drives the input value | DOM maintains the value |
| \`value={state}\` + \`onChange\` handler | \`ref\` to read value when needed |
| Every keystroke triggers re-render | Only read value on submit |
| Full control over input behavior | Simpler for basic forms |

### The Controlled Input Pattern

\`\`\`
function NameInput() {
  const [name, setName] = useState("");

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
\`\`\`

React is the "single source of truth" — the input always reflects the state.

### Form Validation Strategies

| Strategy | When | Pros | Cons |
|----------|------|------|------|
| On change | Every keystroke | Instant feedback | Can be annoying |
| On blur | When field loses focus | Balanced UX | Delayed first error |
| On submit | Form submission | Non-intrusive | Late feedback |
| Hybrid | Blur first, then change | Best UX | More complex |

### Common Validation Rules

- **Required** — field must have a value
- **Min/Max length** — string length constraints
- **Pattern** — regex matching (email, phone, etc.)
- **Custom** — business logic (password strength, unique username)
- **Cross-field** — password confirmation, date ranges

### Form Libraries in React

Real-world apps often use libraries like React Hook Form, Formik, or Zod for validation. But understanding the underlying patterns is essential.

In these exercises, you will build form management systems from scratch.`,
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

### Hints

- "required" checks for empty string, undefined, or null
- Short-circuit after "required" fails — skip other rules for that field
- "custom" calls rule.value(fieldValue, allData) and expects true for valid`,
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

### Examples

\`\`\`
const wizard = createFormWizard([
  { id: "personal", fields: ["name", "email"] },
  { id: "address", fields: ["city", "zip"] },
  { id: "confirm", fields: [] },
]);

wizard.setField("name", "Alice");
wizard.next(); // moves to step 2 if valid
wizard.getProgress(); // { current: 2, total: 3, percent: 67 }
\`\`\`

### Hints

- Store all form data in a single flat object
- Validation runs on next() before advancing
- submit() validates all steps, not just the current one`,
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
