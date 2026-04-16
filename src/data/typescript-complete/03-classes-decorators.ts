import { Module } from "../types";

export const module3: Module = {
  id: "classes-decorators",
  title: "Classes, Access Modifiers & Decorators",
  description: "TypeScript classes in depth: private fields, abstract classes, implements vs extends, and stage-3 decorators",
  lessons: [
    {
      id: "classes-oop",
      slug: "classes-oop",
      title: "TypeScript Classes: OOP Done Right",
      content: `# TypeScript Classes

TypeScript classes extend JavaScript classes with access modifiers, abstract members, and implement interfaces — making OOP patterns robust and refactor-safe.

---

## Access Modifiers

\`\`\`typescript
class BankAccount {
  // public (default): accessible everywhere
  readonly id: string;
  owner: string;

  // protected: accessible in this class and subclasses
  protected balance: number;

  // private: accessible only in THIS class (TypeScript check only)
  private transactionHistory: string[] = [];

  // #field: ECMAScript private (hard private — enforced at runtime too!)
  #pin: string;

  constructor(owner: string, initialBalance: number, pin: string) {
    this.id = crypto.randomUUID();
    this.owner = owner;
    this.balance = initialBalance;
    this.#pin = pin;
  }

  // Shorthand constructor params (declares AND assigns):
  // constructor(public name: string, private age: number) {}

  deposit(amount: number): void {
    if (amount <= 0) throw new RangeError('Deposit must be positive');
    this.balance += amount;
    this.transactionHistory.push(\`+\${amount}\`);
  }

  withdraw(amount: number, pin: string): number {
    if (pin !== this.#pin) throw new Error('Incorrect PIN');
    if (amount > this.balance) throw new RangeError('Insufficient funds');
    this.balance -= amount;
    this.transactionHistory.push(\`-\${amount}\`);
    return amount;
  }

  getBalance(): number { return this.balance; }

  // Getter/setter:
  get summary(): string {
    return \`\${this.owner}: \$\${this.balance}\`;
  }
}

class SavingsAccount extends BankAccount {
  private interestRate: number;

  constructor(owner: string, balance: number, pin: string, interestRate: number) {
    super(owner, balance, pin); // must call super first
    this.interestRate = interestRate;
  }

  applyInterest(): void {
    // Can access 'balance' (protected) but not '#pin' (hard private):
    this.balance += this.balance * this.interestRate;
  }
}
\`\`\`

\`\`\`tabs
{
  "tabs": [
    {
      "label": "private vs #field",
      "icon": "🔐",
      "content": "### TypeScript private vs JavaScript #field\\n\\n| Feature | TypeScript private | JavaScript #field |\\n|---|---|---|\\n| Checked at | Compile time only | Compile time + runtime |\\n| Accessible at runtime | Yes (via any cast or JS) | No — hard enforced |\\n| Reflected in devtools | Visible | Hidden |\\n| In compiled JS | Just a normal property | Actual # private field |\\n\\n\`\`\`typescript\\nclass Foo {\\n  private ts_private = 1;\\n  #js_private = 2;\\n}\\nconst f = new Foo();\\n(f as any).ts_private; // 1 — accessible at runtime!\\n(f as any)['#js_private']; // undefined — truly hidden\\n\`\`\`\\n\\n**Rule of thumb:** use # for data you truly never want to expose at runtime (PINs, secrets). Use private for most internal implementation details."
    },
    {
      "label": "abstract classes",
      "icon": "🏗️",
      "content": "### Abstract Classes\\n\\nAbstract classes: can't be instantiated, may have abstract methods that subclasses MUST implement.\\n\\n\`\`\`typescript\\nabstract class Shape {\\n  abstract area(): number;          // must implement\\n  abstract perimeter(): number;     // must implement\\n\\n  // Concrete method available to all subclasses:\\n  describe(): string {\\n    return \`Area: \${this.area().toFixed(2)}, Perimeter: \${this.perimeter().toFixed(2)}\`;\\n  }\\n}\\n\\nclass Circle extends Shape {\\n  constructor(private radius: number) { super(); }\\n  area() { return Math.PI * this.radius ** 2; }\\n  perimeter() { return 2 * Math.PI * this.radius; }\\n}\\n\\n// new Shape(); // ❌ Cannot instantiate abstract class\\nnew Circle(5).describe(); // ✅\\n\`\`\`"
    },
    {
      "label": "implements",
      "icon": "📋",
      "content": "### implements vs extends\\n\\n- **extends**: inherit implementation from parent class\\n- **implements**: declare that a class satisfies an interface (no inheritance)\\n\\n\`\`\`typescript\\ninterface Serializable {\\n  serialize(): string;\\n  deserialize(data: string): void;\\n}\\n\\ninterface Loggable {\\n  log(message: string): void;\\n}\\n\\n// Implement multiple interfaces (can't extend multiple classes):\\nclass UserRepository implements Serializable, Loggable {\\n  serialize() { return JSON.stringify(this); }\\n  deserialize(data: string) { Object.assign(this, JSON.parse(data)); }\\n  log(msg: string) { console.log(\`[UserRepo] \${msg}\`); }\\n}\\n\`\`\`\\n\\nUse **implements** to type-check a class without creating inheritance coupling."
    }
  ]
}
\`\`\`

## Decorators (Stage 3 — TS 5.0+)

\`\`\`typescript
// Enable: experimentalDecorators: true in tsconfig, OR use TC39 stage-3 decorators

// Method decorator — measure execution time:
function measure(target: any, context: ClassMethodDecoratorContext) {
  return function(this: any, ...args: any[]) {
    const start = performance.now();
    const result = (target as Function).apply(this, args);
    const elapsed = performance.now() - start;
    console.log(\`\${String(context.name)} took \${elapsed.toFixed(2)}ms\`);
    return result;
  };
}

// Field decorator — validate on set:
function positive(target: undefined, context: ClassFieldDecoratorContext) {
  return function(this: any, initialValue: number) {
    let value = initialValue;
    Object.defineProperty(this, context.name, {
      get: () => value,
      set: (v: number) => {
        if (v < 0) throw new RangeError(\`\${String(context.name)} must be positive\`);
        value = v;
      },
    });
    return initialValue;
  };
}

// Class decorator — add metadata:
function injectable(target: new (...args: any[]) => any) {
  Reflect.defineMetadata('injectable', true, target);
  return target;
}

// Usage:
@injectable
class UserService {
  @positive price: number = 100;

  @measure
  async fetchUsers() {
    const res = await fetch('/api/users');
    return res.json();
  }
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the difference between 'extends' and 'implements' in TypeScript?",
      "options": [
        "They are identical",
        "extends inherits implementation from a class; implements just declares that a class satisfies an interface's shape without inheritance",
        "implements is for classes, extends is for interfaces",
        "extends is deprecated"
      ],
      "answer": 1,
      "explanation": "extends creates an inheritance chain — the subclass gets the parent's methods and properties. implements is a pure type-level declaration: 'this class has all the members this interface requires.' A class can implement multiple interfaces but can only extend one class. Implements doesn't give you anything at runtime — it's just a compile-time contract."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
