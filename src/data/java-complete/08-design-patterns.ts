import { Module } from "../types";

export const module8: Module = {
  id: "design-patterns",
  title: "Design Patterns in Java",
  description: "Implement Singleton, Factory, Observer, Strategy, and other GoF patterns — essential for architecture interviews",
  lessons: [
    {
      id: "creational-patterns",
      slug: "creational-patterns",
      title: "Singleton, Factory & Builder Patterns",
      content: `
# Creational Design Patterns

Creational patterns deal with object creation. They appear constantly in real-world Java codebases.

## Singleton Pattern

\`\`\`concept
{
  "title": "Singleton",
  "description": "Ensures a class has only one instance and provides a global access point. Used for: logging, config, thread pools, caches.",
  "points": [
    "Private constructor prevents external instantiation",
    "Static instance stored in the class",
    "Thread-safe singleton requires synchronization or early initialization",
    "Enum singleton is the simplest thread-safe approach (Effective Java)",
    "Singleton makes testing harder — prefer dependency injection in enterprise code"
  ]
}
\`\`\`

\`\`\`tabs
[
  {
    "label": "Double-Checked Locking",
    "content": "public class Singleton {\\n    // volatile: prevents reordering of instance = new Singleton()\\n    private static volatile Singleton instance;\\n\\n    private Singleton() {} // prevent external instantiation\\n\\n    public static Singleton getInstance() {\\n        if (instance == null) {                    // first check (no lock)\\n            synchronized (Singleton.class) {\\n                if (instance == null) {            // second check (with lock)\\n                    instance = new Singleton();\\n                }\\n            }\\n        }\\n        return instance;\\n    }\\n}"
  },
  {
    "label": "Holder Pattern (Best)",
    "content": "public class Singleton {\\n    private Singleton() {}\\n\\n    // Loaded lazily (only when getInstance() is first called)\\n    // JVM guarantees class loading is thread-safe:\\n    private static class Holder {\\n        static final Singleton INSTANCE = new Singleton();\\n    }\\n\\n    public static Singleton getInstance() {\\n        return Holder.INSTANCE;\\n    }\\n}"
  },
  {
    "label": "Enum Singleton (Simplest)",
    "content": "// Josh Bloch's recommendation (Effective Java):\\npublic enum AppConfig {\\n    INSTANCE;\\n\\n    private final String dbUrl;\\n\\n    AppConfig() {\\n        // Load from environment/properties:\\n        this.dbUrl = System.getenv(\\"DATABASE_URL\\");\\n    }\\n\\n    public String getDbUrl() { return dbUrl; }\\n}\\n\\n// Usage:\\nAppConfig.INSTANCE.getDbUrl();\\n// Enum: free serialization safety, thread-safe, concise"
  }
]
\`\`\`

## Factory Pattern

\`\`\`java
// Factory Method: subclasses decide which class to instantiate
interface Notification {
    void send(String message);
}

class EmailNotification implements Notification {
    private String email;
    EmailNotification(String email) { this.email = email; }
    @Override public void send(String message) {
        System.out.println("Email to " + email + ": " + message);
    }
}

class SMSNotification implements Notification {
    private String phone;
    SMSNotification(String phone) { this.phone = phone; }
    @Override public void send(String message) {
        System.out.println("SMS to " + phone + ": " + message);
    }
}

class PushNotification implements Notification {
    @Override public void send(String message) {
        System.out.println("Push: " + message);
    }
}

// Factory encapsulates creation logic:
public class NotificationFactory {
    public static Notification create(String type, String target) {
        return switch (type.toLowerCase()) {
            case "email" -> new EmailNotification(target);
            case "sms"   -> new SMSNotification(target);
            case "push"  -> new PushNotification();
            default -> throw new IllegalArgumentException("Unknown type: " + type);
        };
    }
}

// Caller doesn't know which class was created:
Notification n = NotificationFactory.create("email", "alice@example.com");
n.send("Welcome!"); // Email to alice@example.com: Welcome!
\`\`\`
`,
    },
    {
      id: "behavioral-patterns",
      slug: "behavioral-patterns",
      title: "Strategy, Observer & Command Patterns",
      content: `
# Behavioral Design Patterns

Behavioral patterns define how objects interact and communicate.

## Strategy Pattern

\`\`\`java
// Strategy: define a family of algorithms, make them interchangeable
@FunctionalInterface
interface SortStrategy {
    void sort(int[] arr);
}

// Concrete strategies:
class BubbleSort implements SortStrategy {
    @Override public void sort(int[] arr) {
        // bubble sort implementation...
    }
}

class QuickSort implements SortStrategy {
    @Override public void sort(int[] arr) {
        // quicksort implementation...
    }
}

// Context uses a strategy:
class Sorter {
    private SortStrategy strategy;

    public Sorter(SortStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(SortStrategy strategy) {
        this.strategy = strategy;
    }

    public void sort(int[] arr) {
        strategy.sort(arr);
    }
}

// Usage — swap algorithms at runtime:
Sorter sorter = new Sorter(new BubbleSort());
sorter.sort(data);

sorter.setStrategy(new QuickSort()); // switch strategy
sorter.sort(data);

// Since SortStrategy is @FunctionalInterface, lambdas work too:
sorter.setStrategy(arr -> Arrays.sort(arr)); // built-in sort as strategy
\`\`\`

## Observer Pattern

\`\`\`java
// Observer: when one object changes state, all dependents are notified
interface Observer {
    void update(String event, Object data);
}

interface Observable {
    void addObserver(Observer o);
    void removeObserver(Observer o);
    void notifyObservers(String event, Object data);
}

// Subject (Observable):
class EventBus implements Observable {
    private Map<String, List<Observer>> listeners = new HashMap<>();

    @Override
    public void addObserver(Observer o) {
        // simplified — real impl would use event types
        listeners.computeIfAbsent("all", k -> new ArrayList<>()).add(o);
    }

    @Override
    public void removeObserver(Observer o) {
        listeners.values().forEach(list -> list.remove(o));
    }

    public void publish(String event, Object data) {
        List<Observer> obs = listeners.getOrDefault(event, List.of());
        obs.forEach(o -> o.update(event, data));
    }

    @Override
    public void notifyObservers(String event, Object data) {
        publish(event, data);
    }
}

// Concrete observers:
class Logger implements Observer {
    @Override public void update(String event, Object data) {
        System.out.println("LOG [" + event + "]: " + data);
    }
}

class Analytics implements Observer {
    @Override public void update(String event, Object data) {
        System.out.println("ANALYTICS: event=" + event);
    }
}
\`\`\`

## Template Method Pattern

\`\`\`java
// Template Method: define skeleton of algorithm in base class,
// let subclasses fill in specific steps

abstract class DataProcessor {
    // Template method — final to prevent overriding the skeleton:
    public final void process() {
        readData();       // step 1
        processData();    // step 2 — subclass implements
        writeResults();   // step 3
        cleanup();        // step 4 — has default, can override
    }

    protected abstract void readData();
    protected abstract void processData();
    protected abstract void writeResults();

    // Hook method — optional override:
    protected void cleanup() {
        System.out.println("Cleaning up...");
    }
}

class CSVProcessor extends DataProcessor {
    @Override protected void readData() { System.out.println("Reading CSV..."); }
    @Override protected void processData() { System.out.println("Processing CSV..."); }
    @Override protected void writeResults() { System.out.println("Writing CSV results..."); }
}

class JSONProcessor extends DataProcessor {
    @Override protected void readData() { System.out.println("Reading JSON..."); }
    @Override protected void processData() { System.out.println("Processing JSON..."); }
    @Override protected void writeResults() { System.out.println("Writing JSON results..."); }
    @Override protected void cleanup() { System.out.println("Closing JSON parser..."); }
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What problem does the Strategy pattern solve?",
      "options": [
        "Ensuring only one instance exists",
        "Creating families of interchangeable algorithms that can be swapped at runtime",
        "Notifying dependents of state changes",
        "Providing a simplified interface to complex subsystems"
      ],
      "answer": 1,
      "explanation": "Strategy defines a family of algorithms, encapsulates each one, and makes them interchangeable. It lets the algorithm vary independently from clients that use it."
    },
    {
      "q": "Why is the Enum singleton approach preferred over double-checked locking?",
      "options": ["Enums are faster", "Enums provide free serialization safety, JVM-guaranteed thread-safety, and less code", "Enums use less memory", "Double-checked locking is deprecated"],
      "answer": 1,
      "explanation": "Enum singletons are serialization-safe (protecting against multiple instances via deserialization), thread-safe by JVM class loading semantics, and require minimal code. Double-checked locking needs careful volatile usage."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
