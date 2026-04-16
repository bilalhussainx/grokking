import { Module } from "../types";

export const module2: Module = {
  id: "oop-classes",
  title: "OOP: Classes, Objects & Encapsulation",
  description: "Master object-oriented programming — classes, constructors, access modifiers, static vs instance, and the Builder pattern",
  lessons: [
    {
      id: "classes-objects",
      slug: "classes-objects",
      title: "Classes, Constructors & Access Modifiers",
      content: `
# Classes, Constructors & Access Modifiers

Java is a class-based OOP language. Every piece of code lives inside a class.

\`\`\`concept
{
  "title": "Class Anatomy",
  "description": "A class is a blueprint for objects. It defines fields (state) and methods (behavior). An object is an instance of a class created with 'new'.",
  "points": [
    "Fields: instance variables that store state",
    "Methods: functions that define behavior",
    "Constructor: special method called when object is created with 'new'",
    "this: refers to the current instance",
    "Access modifiers control visibility: private, package-private, protected, public",
    "Encapsulation: private fields + public getters/setters"
  ]
}
\`\`\`

## A Complete Class

\`\`\`java
public class BankAccount {
    // Fields (private = encapsulated)
    private String owner;
    private double balance;
    private static int accountCount = 0; // shared across ALL instances

    // Constructor:
    public BankAccount(String owner, double initialBalance) {
        this.owner = owner;         // 'this' disambiguates field vs param
        this.balance = initialBalance;
        accountCount++;
    }

    // Overloaded constructor (no initial balance):
    public BankAccount(String owner) {
        this(owner, 0.0);  // delegate to main constructor
    }

    // Getter (accessor):
    public double getBalance() { return balance; }
    public String getOwner() { return owner; }

    // Setter with validation:
    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        balance += amount;
    }

    public boolean withdraw(double amount) {
        if (amount > balance) return false; // insufficient funds
        balance -= amount;
        return true;
    }

    // Static method — belongs to class, not instance:
    public static int getAccountCount() { return accountCount; }

    // toString: called by System.out.println and string concatenation
    @Override
    public String toString() {
        return String.format("BankAccount[owner=%s, balance=%.2f]", owner, balance);
    }
}

// Usage:
BankAccount alice = new BankAccount("Alice", 1000.0);
alice.deposit(500.0);
alice.withdraw(200.0);
System.out.println(alice.getBalance()); // 1300.0
System.out.println(BankAccount.getAccountCount()); // number of accounts
\`\`\`

## Access Modifiers

\`\`\`compare
{
  "left": {
    "label": "Modifier Reference",
    "code": "// private: only within the same class\\nprivate int secret;\\n\\n// (default/package-private): same package\\nint packageLevel;\\n\\n// protected: same package + subclasses\\nprotected int forSubclasses;\\n\\n// public: accessible from anywhere\\npublic String name;"
  },
  "right": {
    "label": "Best Practice",
    "code": "// RULE: Make everything as private as possible\\npublic class Person {\\n    private String name;  // private field\\n    private int age;\\n\\n    // Public API through methods:\\n    public String getName() { return name; }\\n    public int getAge() { return age; }\\n\\n    // Setter with validation:\\n    public void setAge(int age) {\\n        if (age < 0 || age > 150)\\n            throw new IllegalArgumentException();\\n        this.age = age;\\n    }\\n}"
  }
}
\`\`\`

## Static vs Instance

\`\`\`java
public class Counter {
    private static int total = 0;  // shared by ALL Counter objects
    private int count = 0;          // unique to each Counter object

    public void increment() {
        count++;   // this object's count
        total++;   // all counters' total
    }

    // Instance method — needs an object:
    public int getCount() { return count; }

    // Static method — called on the class:
    public static int getTotal() { return total; }
}

Counter c1 = new Counter();
Counter c2 = new Counter();
c1.increment(); c1.increment();  // c1.count=2, total=2
c2.increment();                   // c2.count=1, total=3

System.out.println(c1.getCount()); // 2
System.out.println(Counter.getTotal()); // 3 (same from any reference)

// Static members accessed via CLASS name (not instance):
Counter.getTotal(); // correct
c1.getTotal();      // works but misleading — avoid
\`\`\`

## Records (Java 16+)

Records are immutable data classes with auto-generated constructor, getters, equals, hashCode, toString:

\`\`\`java
// Old way (verbose):
public class Point {
    private final int x;
    private final int y;
    public Point(int x, int y) { this.x = x; this.y = y; }
    public int x() { return x; }
    public int y() { return y; }
    @Override public boolean equals(Object o) { ... }
    @Override public int hashCode() { ... }
    @Override public String toString() { return "Point[x=" + x + ", y=" + y + "]"; }
}

// New way (record — equivalent to above):
public record Point(int x, int y) {}

// Usage:
Point p = new Point(3, 4);
p.x();    // 3 (accessor, not getX())
p.y();    // 4
System.out.println(p); // Point[x=3, y=4]
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the difference between a static and an instance method?",
      "options": [
        "No difference",
        "Static methods can only return void",
        "Static methods belong to the class and can't access instance fields; instance methods require an object and can access all fields",
        "Instance methods run faster"
      ],
      "answer": 2,
      "explanation": "Static methods belong to the class itself — they're called as ClassName.method() and cannot access instance fields (no 'this'). Instance methods require an object and can access both static and instance members."
    },
    {
      "q": "What does 'this(owner, 0.0)' do inside a constructor?",
      "options": ["Creates a new object", "Calls another constructor in the same class (constructor chaining)", "Calls the parent class constructor", "References the static method"],
      "answer": 1,
      "explanation": "this(...) calls another constructor in the same class. It must be the FIRST statement in the constructor. This is constructor chaining — avoids duplicating initialization logic."
    }
  ]
}
\`\`\`
`,
      starterCode: `// Build an immutable Money class:
// - Fields: amount (long cents, to avoid floating-point issues), currency (String)
// - Constructor validates amount >= 0
// - add(Money other) returns new Money (same currency only, throws if different)
// - subtract(Money other) returns new Money (throws if result would be negative)
// - toString() returns "$10.50" (for USD) or formatted amount
// - equals() and hashCode() based on amount + currency

public final class Money {
    // TODO: implement

    public static void main(String[] args) {
        Money a = new Money(1050, "USD"); // $10.50
        Money b = new Money(500, "USD");  // $5.00
        System.out.println(a.add(b));     // $15.50
        System.out.println(a.subtract(b)); // $5.50
    }
}`,
      solutionCode: `import java.util.Objects;

public final class Money {
    private final long cents;
    private final String currency;

    public Money(long cents, String currency) {
        if (cents < 0) throw new IllegalArgumentException("Amount cannot be negative");
        if (currency == null || currency.isBlank()) throw new IllegalArgumentException("Currency required");
        this.cents = cents;
        this.currency = currency.toUpperCase();
    }

    public Money add(Money other) {
        requireSameCurrency(other);
        return new Money(this.cents + other.cents, this.currency);
    }

    public Money subtract(Money other) {
        requireSameCurrency(other);
        if (other.cents > this.cents) throw new IllegalStateException("Insufficient funds");
        return new Money(this.cents - other.cents, this.currency);
    }

    private void requireSameCurrency(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException("Currency mismatch: " + this.currency + " vs " + other.currency);
        }
    }

    @Override
    public String toString() {
        return String.format("%s %.2f", currency, cents / 100.0);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Money m)) return false;
        return cents == m.cents && currency.equals(m.currency);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cents, currency);
    }

    public static void main(String[] args) {
        Money a = new Money(1050, "USD");
        Money b = new Money(500, "USD");
        System.out.println(a.add(b));     // USD 15.50
        System.out.println(a.subtract(b)); // USD 5.50
    }
}`,
    },
    {
      id: "builder-pattern",
      slug: "builder-pattern",
      title: "equals, hashCode, Comparable & Builder Pattern",
      content: `
# equals, hashCode, Comparable & Builder Pattern

These four are essential Java patterns tested in every interview.

## equals & hashCode Contract

\`\`\`concept
{
  "title": "The equals/hashCode Contract",
  "description": "If you override equals(), you MUST override hashCode(). Objects that are equal (equals returns true) must have the same hashCode. Violation breaks HashMap, HashSet, and other hash-based collections.",
  "points": [
    "equals() must be: reflexive (a.equals(a)), symmetric (a.equals(b) = b.equals(a)), transitive, consistent",
    "hashCode() must return the same value for objects that are equal",
    "Objects.equals(a, b) safely handles nulls",
    "Objects.hash(field1, field2) generates a good hashCode",
    "IDE can generate both — or use records/Lombok @EqualsAndHashCode",
    "Default Object.equals() compares references — rarely what you want"
  ]
}
\`\`\`

\`\`\`java
public class Student {
    private String id;
    private String name;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;           // same reference
        if (!(o instanceof Student s)) return false; // null or wrong type (pattern matching Java 16+)
        return Objects.equals(id, s.id);      // id is the identity field
    }

    @Override
    public int hashCode() {
        return Objects.hash(id); // same field(s) as equals
    }
}
\`\`\`

## Comparable & Comparator

\`\`\`tabs
[
  {
    "label": "Comparable (natural order)",
    "content": "// Comparable: implement on the class for its 'natural' ordering\\npublic class Student implements Comparable<Student> {\\n    private String name;\\n    private double gpa;\\n\\n    @Override\\n    public int compareTo(Student other) {\\n        // Negative: this < other\\n        // Zero:     this == other\\n        // Positive: this > other\\n        return Double.compare(other.gpa, this.gpa); // descending by GPA\\n    }\\n}\\n\\n// Then Collections.sort() and TreeSet work automatically:\\nList<Student> students = ...;\\nCollections.sort(students); // uses compareTo"
  },
  {
    "label": "Comparator (custom order)",
    "content": "// Comparator: external, flexible, lambda-friendly\\nList<Student> students = ...;\\n\\n// Sort by name (ascending):\\nstudents.sort(Comparator.comparing(Student::getName));\\n\\n// Sort by GPA (descending), then name (ascending):\\nstudents.sort(\\n    Comparator.comparingDouble(Student::getGpa)\\n              .reversed()\\n              .thenComparing(Student::getName)\\n);\\n\\n// Custom Comparator as lambda:\\nstudents.sort((a, b) -> a.getName().compareTo(b.getName()));"
  }
]
\`\`\`

## Builder Pattern

\`\`\`java
// When a class has many optional fields, Builder prevents telescoping constructors:
public class HttpRequest {
    private final String url;           // required
    private final String method;        // required
    private final Map<String, String> headers; // optional
    private final String body;          // optional
    private final int timeoutMs;        // optional

    private HttpRequest(Builder builder) {
        this.url = builder.url;
        this.method = builder.method;
        this.headers = builder.headers;
        this.body = builder.body;
        this.timeoutMs = builder.timeoutMs;
    }

    public static class Builder {
        // Required:
        private final String url;
        private final String method;
        // Optional with defaults:
        private Map<String, String> headers = new HashMap<>();
        private String body = null;
        private int timeoutMs = 5000;

        public Builder(String url, String method) {
            this.url = url;
            this.method = method;
        }

        public Builder header(String key, String value) {
            headers.put(key, value);
            return this; // fluent — allows chaining
        }

        public Builder body(String body) {
            this.body = body;
            return this;
        }

        public Builder timeout(int ms) {
            this.timeoutMs = ms;
            return this;
        }

        public HttpRequest build() {
            // Validate here if needed
            return new HttpRequest(this);
        }
    }
}

// Usage — readable, no nulls for omitted fields:
HttpRequest request = new HttpRequest.Builder("https://api.example.com/users", "POST")
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer token123")
    .body("{\"name\": \"Alice\"}")
    .timeout(10_000)
    .build();
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "You add a Student to a HashSet, then change its name (which is used in equals/hashCode). What happens when you try to find that student?",
      "options": ["It's found normally", "HashSet updates automatically", "The student may not be found — mutating an object while it's in a hash collection breaks lookup", "An exception is thrown"],
      "answer": 2,
      "explanation": "When you mutate a field used in hashCode(), the bucket where the object is stored no longer matches its new hash. The HashSet can't find it. Mutable keys in hash collections are a classic Java bug."
    },
    {
      "q": "compareTo() should return negative when...",
      "options": ["this is greater than the argument", "this is equal to the argument", "this is less than the argument", "Never — use equals() instead"],
      "answer": 2,
      "explanation": "compareTo() returns: negative if this < other, 0 if equal, positive if this > other. Think 'this minus other' for numeric types."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
