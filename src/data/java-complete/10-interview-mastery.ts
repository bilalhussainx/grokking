import { Module } from "../types";

export const module10: Module = {
  id: "interview-mastery",
  title: "Java Interview Mastery",
  description: "The most common Java interview questions — memory model, JVM internals, String pool, and 50 Q&A covering everything",
  lessons: [
    {
      id: "jvm-internals",
      slug: "jvm-internals",
      title: "JVM Internals: Memory, GC & String Pool",
      content: `
# JVM Internals: Memory & Garbage Collection

JVM internals are a staple of mid-to-senior Java interviews. Understanding heap, stack, and GC sets you apart.

\`\`\`concept
{
  "title": "JVM Memory Areas",
  "description": "The JVM divides memory into distinct regions, each with a different lifecycle and purpose.",
  "points": [
    "Heap: all objects and class instances — garbage collected, shared across threads",
    "Stack: one per thread — stores stack frames (local variables, operand stack, method calls)",
    "Method Area (Metaspace in Java 8+): class metadata, static fields, bytecode",
    "String Pool: interned String literals stored in Heap (Java 7+, was PermGen before)",
    "PC Register: per-thread pointer to current instruction",
    "Native Method Stack: for native (C/C++) method calls"
  ]
}
\`\`\`

## Heap Generations

\`\`\`mermaid
graph LR
  H[Heap] --> Y[Young Generation]
  H --> O[Old Generation]
  Y --> E[Eden Space]
  Y --> S1[Survivor 0]
  Y --> S2[Survivor 1]

  style E fill:#4ade80,color:#000
  style S1 fill:#60a5fa,color:#000
  style S2 fill:#60a5fa,color:#000
  style O fill:#fbbf24,color:#000
\`\`\`

- **Eden**: new objects allocated here (fast bump allocation)
- **Survivor**: objects that survived one Minor GC
- **Old Gen**: long-lived objects promoted from Young Gen
- **Minor GC**: Young Gen collection — fast (milliseconds)
- **Major/Full GC**: Old Gen collection — slower, may pause app

## String Pool & Interning

\`\`\`java
// String literals are interned (stored in String Pool):
String a = "Hello";   // goes to String Pool
String b = "Hello";   // reuses same pool entry
a == b;               // TRUE — same object!

// new String() bypasses the pool:
String c = new String("Hello"); // new heap object outside pool
a == c;               // FALSE — different objects
a.equals(c);          // TRUE — same content

// Manual interning:
String d = c.intern(); // returns the pool entry
a == d;               // TRUE

// Interview question: how many objects?
String s = new String("Hello");
// Answer: 1 or 2:
// - If "Hello" literal not yet in pool: 2 objects (pool entry + heap object)
// - If "Hello" already interned: 1 new heap object

// String concatenation in loops — BAD:
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i; // creates 1000 intermediate String objects!
}

// StringBuilder — GOOD:
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String result = sb.toString(); // one final String
\`\`\`

## Garbage Collection Basics

\`\`\`java
// Objects become eligible for GC when no references point to them:
void method() {
    Object obj = new Object(); // obj created on heap
    // ... use obj ...
} // method returns — obj is now unreachable → eligible for GC

// GC roots (never collected):
// - Local variables in active stack frames
// - Static fields
// - Active threads
// - JNI references

// GC algorithms (good to know names):
// Serial GC: single-threaded, simple — for small apps
// Parallel GC: multi-threaded, throughput-focused (Java 8 default)
// G1 GC: regions-based, balanced throughput + pauses (Java 9+ default)
// ZGC: ultra-low latency (<1ms pauses) — Java 15+ production ready
// Shenandoah: concurrent, low pause — similar to ZGC

// finalize() is deprecated — don't rely on it
// Use try-with-resources or Cleaner for cleanup
\`\`\`
`,
    },
    {
      id: "interview-qa",
      slug: "interview-qa",
      title: "50 Java Interview Questions: Complete Q&A",
      content: `
# Java Interview: Comprehensive Q&A

The questions every Java interviewer asks. Know these cold.

## Fundamentals

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the difference between == and .equals() for objects?",
      "options": [
        "No difference",
        "== compares object REFERENCES (memory addresses); .equals() compares object CONTENT (can be overridden)",
        ".equals() compares references, == compares content",
        "== works for all types, .equals() only for String"
      ],
      "answer": 1,
      "explanation": "== is reference equality — true only if both variables point to the same object. .equals() is logical equality — can be overridden to compare content. String overrides it to compare characters."
    },
    {
      "q": "Can you override a private method in Java?",
      "options": ["Yes", "No — private methods are not visible to subclasses, so can't be overridden", "Yes, but only with @Override", "Only in the same package"],
      "answer": 1,
      "explanation": "Private methods are not inherited — they're invisible to subclasses. If a subclass defines a method with the same signature, it's a NEW method, not an override."
    },
    {
      "q": "What is autoboxing?",
      "options": ["Automatic memory allocation", "Automatic conversion between primitives and their wrapper classes (int ↔ Integer)", "Automatic type casting between numeric types", "Boxing of arrays"],
      "answer": 1,
      "explanation": "Autoboxing is Java's automatic conversion: int → Integer (boxing) and Integer → int (unboxing). It happens implicitly when needed, e.g., adding int to List<Integer>."
    },
    {
      "q": "What is the output? Integer a = 127; Integer b = 127; System.out.println(a == b);",
      "options": ["false", "true", "Compile error", "Runtime exception"],
      "answer": 1,
      "explanation": "Integer caches values from -128 to 127. For values in this range, Integer.valueOf() returns the SAME cached object, so == returns true. For values outside this range (e.g., 128), == returns false."
    }
  ]
}
\`\`\`

## OOP & Inheritance

\`\`\`quiz
{
  "questions": [
    {
      "q": "Can an abstract class have a constructor?",
      "options": ["No — abstract classes can't be instantiated", "Yes — called by subclass constructors via super()", "Yes, but only private", "No — constructors are only for concrete classes"],
      "answer": 1,
      "explanation": "Abstract classes CAN have constructors. They're called when a subclass is instantiated via super(). They're useful for initializing fields that all subclasses share."
    },
    {
      "q": "What is covariant return type?",
      "options": [
        "A return type that converts automatically",
        "An overriding method that returns a more specific type than the parent method",
        "A return type that must match exactly",
        "Returning this from a method"
      ],
      "answer": 1,
      "explanation": "Covariant return type allows an overriding method to return a subtype of the parent's return type. E.g., if parent returns Animal, the override can return Dog."
    },
    {
      "q": "What is the diamond problem, and how does Java resolve it?",
      "options": [
        "Multiple inheritance of state — Java prevents it by allowing extends from only one class",
        "A recursion pattern",
        "A memory leak pattern",
        "An issue with generic wildcards"
      ],
      "answer": 0,
      "explanation": "The diamond problem: if A extends B and C, and B and C both override a method from a common parent, which override does A inherit? Java prevents this for classes (single class inheritance). For interfaces with default methods, the implementing class must explicitly override to resolve ambiguity."
    }
  ]
}
\`\`\`

## Collections & Generics

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the initial capacity and load factor of HashMap?",
      "options": ["16 and 0.75", "10 and 0.5", "100 and 1.0", "8 and 0.75"],
      "answer": 0,
      "explanation": "Default HashMap: initial capacity 16, load factor 0.75. When entries > 16 × 0.75 = 12, the map rehashes (doubles capacity). Choose initial capacity wisely to avoid expensive rehashing."
    },
    {
      "q": "What happens when two keys have the same hashCode in HashMap?",
      "options": [
        "Exception thrown",
        "One entry overwrites the other",
        "Collision: entries stored in a linked list (or tree if list grows long) at the same bucket",
        "HashMap capacity increases"
      ],
      "answer": 2,
      "explanation": "HashMap uses separate chaining for collision resolution. Keys with the same hashCode go in the same bucket and are distinguished by equals(). Java 8+ converts the list to a balanced BST when a bucket exceeds 8 entries."
    },
    {
      "q": "What is type erasure?",
      "options": [
        "Java deletes generic type information at compile time — at runtime List<String> and List<Integer> are just 'List'",
        "Removing unused variables",
        "Clearing cache at runtime",
        "Erasing type casts"
      ],
      "answer": 0,
      "explanation": "Java implements generics via type erasure. Generic type parameters are removed at compile time (replaced with Object or bounds). This ensures backward compatibility but means you can't use instanceof with generic types or create generic arrays."
    }
  ]
}
\`\`\`

## Concurrency

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is a deadlock?",
      "options": [
        "When a thread runs forever without stopping",
        "When two or more threads each hold a lock the other needs — both wait forever",
        "When a thread accesses a null reference",
        "When garbage collection pauses all threads"
      ],
      "answer": 1,
      "explanation": "Deadlock: Thread A holds Lock 1, needs Lock 2. Thread B holds Lock 2, needs Lock 1. Both wait forever. Prevention: always acquire locks in the same order, use tryLock with timeout."
    },
    {
      "q": "What is the difference between Runnable and Callable?",
      "options": [
        "No difference",
        "Runnable.run() returns void and can't throw checked exceptions; Callable.call() returns a value and can throw exceptions",
        "Callable runs on the main thread, Runnable on background threads",
        "Runnable is for single-threaded use only"
      ],
      "answer": 1,
      "explanation": "Runnable: void run() — no return, can't throw checked exceptions. Callable<V>: V call() throws Exception — returns a result and can throw checked exceptions. Use with Future to get the result."
    }
  ]
}
\`\`\`

## Memory & JVM

\`\`\`quiz
{
  "questions": [
    {
      "q": "Where are static variables stored in the JVM?",
      "options": ["Stack", "Heap (in the Method Area / Metaspace)", "String Pool", "Native memory"],
      "answer": 1,
      "explanation": "Static variables are stored in the Method Area (called Metaspace in Java 8+). They're part of the class metadata and persist for the lifetime of the class loader."
    },
    {
      "q": "What causes a StackOverflowError?",
      "options": ["Too many objects on the heap", "Too many active stack frames — typically from infinite or very deep recursion", "Memory leak", "NullPointerException in a loop"],
      "answer": 1,
      "explanation": "Each method call pushes a new frame onto the thread's stack. Infinite recursion or extremely deep call chains fill the stack and throw StackOverflowError."
    }
  ]
}
\`\`\`

## Quick Reference Cheat Sheet

\`\`\`concept
{
  "title": "Java Interview Cheat Sheet",
  "description": "Key facts to have memorized",
  "points": [
    "String is immutable, final, stored in String Pool (literals interned)",
    "Integer cache: -128 to 127 cached — == works, but always use .equals()",
    "HashMap: O(1) avg, not thread-safe, allows null key/value",
    "ConcurrentHashMap: thread-safe, no null keys/values",
    "ArrayList vs LinkedList: ArrayList for random access, LinkedList for frequent insert/delete at ends",
    "checked vs unchecked: IOException (checked), RuntimeException (unchecked)",
    "final: variable can't be reassigned, method can't be overridden, class can't be extended",
    "static: belongs to class (not instance), can access without object",
    "abstract: can't be instantiated, may have abstract methods",
    "synchronized: mutual exclusion — only one thread at a time",
    "volatile: visibility guarantee — all threads see latest value",
    "Java 8: Lambda, Stream API, Optional, default methods",
    "Java 16: Records, instanceof pattern matching",
    "Java 17: Sealed classes",
    "Java 21: Virtual Threads, pattern matching in switch"
  ]
}
\`\`\`

\`\`\`takeaways
["Master equals/hashCode contract — violations break HashMap and HashSet", "String literals go to String Pool — use .equals() not == for comparisons", "volatile = visibility, synchronized = atomicity + visibility, AtomicXxx = lock-free atomicity", "Prefer interface over abstract class when no shared state is needed", "Java generics use type erasure — List<String> is just List at runtime", "Stream pipelines are lazy — intermediate ops run only when terminal op is called", "Virtual Threads (Java 21) make blocking I/O cheap — thread-per-request scales again"]
\`\`\`
`,
    },
  ],
};
