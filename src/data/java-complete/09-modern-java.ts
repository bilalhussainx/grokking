import { Module } from "../types";

export const module9: Module = {
  id: "modern-java",
  title: "Modern Java (8–21)",
  description: "Java 8 through 21 features: records, sealed classes, text blocks, pattern matching, and Virtual Threads",
  lessons: [
    {
      id: "java-8-plus",
      slug: "java-8-plus",
      title: "Java 8–21: What Changed and Why It Matters",
      content: `
# Modern Java Features (Java 8–21)

Java evolves rapidly. Knowing modern features signals you're current and can write concise, idiomatic code.

## Java 8: Foundation of Modern Java

\`\`\`tabs
[
  {
    "label": "Lambda & Method References",
    "content": "// Lambda: anonymous function\\nRunnable r = () -> System.out.println(\\"Hello\\");\\nComparator<String> comp = (a, b) -> a.compareTo(b);\\n\\n// Method references (4 types):\\n// Static method:\\nFunction<String, Integer> parseInt = Integer::parseInt;\\n\\n// Instance method on arbitrary instance:\\nFunction<String, String> upper = String::toUpperCase;\\n\\n// Instance method on specific instance:\\nString prefix = \\"Hello\\";\\nPredicate<String> startsWith = prefix::startsWith; // prefix.startsWith(s)\\n\\n// Constructor:\\nSupplier<ArrayList<String>> listMaker = ArrayList::new;"
  },
  {
    "label": "Default & Static Interface Methods",
    "content": "interface Validator<T> {\\n    boolean validate(T value);\\n\\n    // Compose validators:\\n    default Validator<T> and(Validator<T> other) {\\n        return value -> this.validate(value) && other.validate(value);\\n    }\\n\\n    default Validator<T> or(Validator<T> other) {\\n        return value -> this.validate(value) || other.validate(value);\\n    }\\n\\n    static <T> Validator<T> alwaysTrue() {\\n        return value -> true;\\n    }\\n}\\n\\n// Compose validators:\\nValidator<String> notEmpty = s -> !s.isEmpty();\\nValidator<String> notTooLong = s -> s.length() <= 100;\\nValidator<String> emailValidator = notEmpty.and(notTooLong).and(s -> s.contains(\\"@\\"));"
  }
]
\`\`\`

## Java 9-16: Incremental Improvements

\`\`\`java
// Java 9: Private interface methods, collection factory methods
List<String> list = List.of("a", "b", "c"); // immutable
Map<String, Integer> map = Map.of("one", 1, "two", 2);
Set<Integer> set = Set.of(1, 2, 3, 4);

// Java 10: Local variable type inference
var names = new ArrayList<String>(); // inferred: ArrayList<String>
var entry = map.entrySet().iterator().next(); // inferred: Map.Entry<String, Integer>

// Java 11: String methods
"  Hello  ".strip();           // like trim() but Unicode-aware
"Hello".repeat(3);             // "HelloHelloHello"
"".isBlank();                  // true (whitespace-only = blank)
"a\nb\nc".lines().toList();    // [a, b, c] — Stream of lines

// Java 14: Records (preview) — finalized in 16
record Point(double x, double y) {
    // Compact constructor for validation:
    Point {
        if (x < 0 || y < 0) throw new IllegalArgumentException("Must be positive");
    }

    // Custom methods:
    public double distanceTo(Point other) {
        double dx = this.x - other.x;
        double dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

Point p = new Point(3.0, 4.0);
p.x();        // 3.0 (generated accessor)
p.y();        // 4.0
p.toString(); // "Point[x=3.0, y=4.0]" (generated)

// Java 15: Text Blocks (finalized)
String json = """
        {
            "name": "Alice",
            "age": 30,
            "city": "New York"
        }
        """;
// Leading whitespace stripped, preserves relative indentation
\`\`\`

## Java 17: Sealed Classes

\`\`\`java
// Sealed class: restricts which classes can extend/implement it
// Great for modeling closed hierarchies (ASTs, result types, etc.)
public sealed class Shape
    permits Circle, Rectangle, Triangle {}  // ONLY these can extend Shape

public final class Circle extends Shape {
    private final double radius;
    public Circle(double radius) { this.radius = radius; }
    public double radius() { return radius; }
}

public final class Rectangle extends Shape {
    private final double width, height;
    public Rectangle(double w, double h) { this.width = w; this.height = h; }
    public double width() { return width; }
    public double height() { return height; }
}

public non-sealed class Triangle extends Shape {} // can be extended further

// Java 21: Pattern Matching in switch (with sealed classes)
double area = switch (shape) {
    case Circle c    -> Math.PI * c.radius() * c.radius();
    case Rectangle r -> r.width() * r.height();
    case Triangle t  -> 0.5 * t.base() * t.height();
    // No default needed — compiler knows all permitted subclasses!
};
\`\`\`

## Java 21: Virtual Threads (Project Loom)

\`\`\`java
// Traditional threads: OS threads — heavy, limited to thousands
// Virtual threads: JVM-managed — millions possible, cheaply created

// Create virtual thread:
Thread vThread = Thread.ofVirtual().start(() -> {
    // blocking I/O is fine — virtual thread yields, OS thread freed
    String response = httpClient.send(request);
    processResponse(response);
});

// With ExecutorService (preferred):
try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
    // One virtual thread per task — scales to millions:
    for (int i = 0; i < 100_000; i++) {
        executor.submit(() -> {
            callExternalApi(); // blocking — fine with virtual threads
        });
    }
} // auto-closed

// Virtual threads make the thread-per-request model viable again:
// Each HTTP request gets its own virtual thread — simple, scalable
\`\`\`

## Java 16+: Pattern Matching for instanceof

\`\`\`java
// Before (Java 15-):
if (obj instanceof String) {
    String s = (String) obj; // redundant cast
    System.out.println(s.length());
}

// Java 16+: pattern matching
if (obj instanceof String s) {
    // s is in scope here, already cast:
    System.out.println(s.length());
}

// Java 21: pattern matching in switch
Object value = ...;
String result = switch (value) {
    case Integer i when i > 0 -> "Positive int: " + i;
    case Integer i             -> "Non-positive int: " + i;
    case String s              -> "String of length " + s.length();
    case null                  -> "null";
    default                    -> "Other: " + value;
};
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the main benefit of Java 21 Virtual Threads?",
      "options": [
        "Faster CPU computation",
        "Eliminate the need for async/reactive code — blocking I/O is cheap because virtual threads yield instead of blocking OS threads",
        "Replace synchronized blocks",
        "Provide better garbage collection"
      ],
      "answer": 1,
      "explanation": "Virtual threads are cheap JVM-managed threads. When a virtual thread blocks on I/O, the underlying OS thread is released for other virtual threads. This makes the thread-per-request model scalable to millions of concurrent operations."
    },
    {
      "q": "What does a 'sealed' class guarantee?",
      "options": ["The class cannot be instantiated", "Only permitted subclasses can extend it — the hierarchy is closed and exhaustively known", "All fields are final", "The class is thread-safe"],
      "answer": 1,
      "explanation": "A sealed class restricts which classes can extend/implement it using the 'permits' clause. This enables exhaustive pattern matching in switch — the compiler knows all possible subtypes."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
