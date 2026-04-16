import { Module } from "../types";

export const module5: Module = {
  id: "controlled-forms",
  title: "Controlled vs Uncontrolled Components & Forms",
  description: "Master form handling in React — controlled inputs, uncontrolled refs, validation patterns, and the differences that appear on LinkedIn assessments",
  lessons: [
    {
      id: "controlled-vs-uncontrolled",
      slug: "controlled-vs-uncontrolled",
      title: "Controlled vs Uncontrolled Components",
      content: `
# Controlled vs Uncontrolled Components

This is one of the most frequently tested React concepts. The distinction is fundamental.

\`\`\`concept
{
  "title": "The Core Distinction",
  "description": "Controlled: React state is the single source of truth for the input's value. Uncontrolled: the DOM manages the input's value, and you use a ref to read it when needed.",
  "points": [
    "Controlled: value={state} + onChange={handler} — React controls the value",
    "Uncontrolled: no value prop + ref={ref} — DOM owns the value",
    "Controlled enables: instant validation, conditional disabling, formatted input, syncing to server",
    "Uncontrolled is simpler for: file inputs, large forms with no validation, integrating with non-React code",
    "defaultValue vs value: defaultValue sets initial value only (uncontrolled), value controls always (controlled)",
    "React will warn if you switch from controlled to uncontrolled (or vice versa)"
  ]
}
\`\`\`

## Side-by-Side Comparison

\`\`\`compare
{
  "left": {
    "label": "Controlled Input",
    "code": "function ControlledInput() {\\n  const [value, setValue] = useState('');\\n\\n  // React state IS the source of truth\\n  // Every keystroke updates state → triggers re-render → updates input\\n  return (\\n    <input\\n      value={value}          // controlled: bind to state\\n      onChange={e => setValue(e.target.value)}\\n      placeholder=\\"Controlled\\"\\n    />\\n  );\\n}\\n\\n// Can: validate on change, format, disable submit, sync across components\\n// The input ONLY shows what React says it should show"
  },
  "right": {
    "label": "Uncontrolled Input",
    "code": "function UncontrolledInput() {\\n  const inputRef = useRef(null);\\n\\n  function handleSubmit(e) {\\n    e.preventDefault();\\n    // Read value only when needed (submit):\\n    console.log(inputRef.current.value);\\n  }\\n\\n  return (\\n    <form onSubmit={handleSubmit}>\\n      <input\\n        ref={inputRef}          // just attach a ref\\n        defaultValue=\\"initial\\" // sets initial value (not controlled)\\n        placeholder=\\"Uncontrolled\\"\\n      />\\n      <button type=\\"submit\\">Submit</button>\\n    </form>\\n  );\\n}\\n\\n// Simpler, fewer re-renders, DOM manages the value"
  }
}
\`\`\`

## Complete Controlled Form with Validation

\`\`\`tsx
function SignupForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (fields) => {
    const errs = {};
    if (!fields.email.includes('@')) errs.email = 'Valid email required';
    if (fields.password.length < 8) errs.password = 'Min 8 characters';
    if (fields.password !== fields.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
    // submit to API...
  };

  if (submitted) return <p>Welcome aboard!</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div>
        <input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={Object.keys(errors).length > 0}
      >
        Sign Up
      </button>
    </form>
  );
}
\`\`\`

## Special Cases

\`\`\`tabs
[
  {
    "label": "File Input (always uncontrolled)",
    "content": "// File inputs are ALWAYS uncontrolled — React can't set the value\\nfunction FileUpload() {\\n  const fileRef = useRef(null);\\n  const [preview, setPreview] = useState(null);\\n\\n  const handleChange = (e) => {\\n    const file = e.target.files[0];\\n    if (file) {\\n      setPreview(URL.createObjectURL(file));\\n    }\\n  };\\n\\n  return (\\n    <div>\\n      <input\\n        ref={fileRef}\\n        type=\\"file\\"\\n        accept=\\"image/*\\"\\n        onChange={handleChange}\\n      />\\n      {preview && <img src={preview} alt=\\"Preview\\" />}\\n    </div>\\n  );\\n}"
  },
  {
    "label": "Select / Textarea",
    "content": "// Select and textarea follow same controlled/uncontrolled rules\\n\\n// Controlled select:\\n<select value={selected} onChange={e => setSelected(e.target.value)}>\\n  <option value=\\"\\" disabled>Choose...</option>\\n  <option value=\\"a\\">Option A</option>\\n  <option value=\\"b\\">Option B</option>\\n</select>\\n\\n// Controlled textarea (value, not children):\\n<textarea\\n  value={text}\\n  onChange={e => setText(e.target.value)}\\n/>\\n\\n// Note: defaultValue for uncontrolled:"
  },
  {
    "label": "Checkbox / Radio",
    "content": "// Checkboxes use 'checked' instead of 'value':\\nconst [agreed, setAgreed] = useState(false);\\n<input\\n  type=\\"checkbox\\"\\n  checked={agreed}\\n  onChange={e => setAgreed(e.target.checked)}\\n/>\\n\\n// Checkbox group (multiple selection):\\nconst [selected, setSelected] = useState(new Set());\\nconst toggle = (val) => {\\n  setSelected(prev => {\\n    const next = new Set(prev);\\n    next.has(val) ? next.delete(val) : next.add(val);\\n    return next;\\n  });\\n};"
  }
]
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What makes an input 'controlled' in React?",
      "options": ["Using useRef to attach to it", "Having a name attribute", "Passing value={state} and onChange={handler}", "Using type='controlled'"],
      "answer": 2,
      "explanation": "A controlled input has its value driven by React state (value prop) and updates state on change (onChange handler). React is the single source of truth."
    },
    {
      "q": "What is the difference between 'value' and 'defaultValue' on an input?",
      "options": ["They are identical", "value makes the input controlled (React owns it); defaultValue sets the initial DOM value only (uncontrolled)", "defaultValue triggers validation", "value only works with useState"],
      "answer": 1,
      "explanation": "value = controlled (React manages every update). defaultValue = sets initial DOM value and then the DOM manages it (uncontrolled). Mixing them causes warnings."
    },
    {
      "q": "Why are file inputs always uncontrolled?",
      "options": ["React doesn't support file inputs", "For security — JavaScript cannot programmatically set a file input's value", "File inputs require useRef only", "Browsers block controlled file inputs"],
      "answer": 1,
      "explanation": "For security reasons, browsers don't allow JavaScript to set the value of a file input. Users must select files directly. This makes file inputs inherently uncontrolled."
    }
  ]
}
\`\`\`
`,
      starterCode: `// Build a multi-step form using controlled components
// Step 1: Personal info (name, email)
// Step 2: Account (username, password)
// Step 3: Review and submit
//
// Requirements:
// - Validate each step before allowing next
// - Show current step indicator (1/3, 2/3, 3/3)
// - Allow going back to edit
// - Show summary in step 3

import { useState } from 'react';

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '',
    username: '', password: '',
  });

  // TODO: implement step validation and navigation

  return (
    <div>
      <p>Step {step} of 3</p>
      {/* TODO: render correct step */}
    </div>
  );
}

export default MultiStepForm;`,
      solutionCode: `import { useState } from 'react';

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', username: '', password: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const canNext = () => {
    if (step === 1) return formData.name && formData.email.includes('@');
    if (step === 2) return formData.username.length >= 3 && formData.password.length >= 8;
    return true;
  };

  if (submitted) {
    return <p>Account created for {formData.name}!</p>;
  }

  return (
    <div>
      <p>Step {step} of 3</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[1,2,3].map(s => (
          <div key={s} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: s <= step ? '#3b82f6' : '#e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: s <= step ? 'white' : '#6b7280',
          }}>{s}</div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2>Personal Info</h2>
          <input placeholder="Full name" value={formData.name}
            onChange={e => update('name', e.target.value)} /><br />
          <input placeholder="Email" type="email" value={formData.email}
            onChange={e => update('email', e.target.value)} />
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Account Setup</h2>
          <input placeholder="Username (3+ chars)" value={formData.username}
            onChange={e => update('username', e.target.value)} /><br />
          <input placeholder="Password (8+ chars)" type="password" value={formData.password}
            onChange={e => update('password', e.target.value)} />
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Review</h2>
          <p>Name: {formData.name}</p>
          <p>Email: {formData.email}</p>
          <p>Username: {formData.username}</p>
        </div>
      )}

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        {step > 1 && <button onClick={() => setStep(s => s - 1)}>Back</button>}
        {step < 3 && (
          <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
            Next
          </button>
        )}
        {step === 3 && (
          <button onClick={() => setSubmitted(true)}>Submit</button>
        )}
      </div>
    </div>
  );
}

export default MultiStepForm;`,
    },
  ],
};
