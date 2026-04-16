import { Module } from "../types";

export const module6: Module = {
  id: "generics-streams",
  title: "Generics, Lambdas & Streams",
  description: "Write type-safe reusable code with generics, transform data elegantly with the Stream API, and master Java 8+ functional programming",
  lessons: [
    {
      id: "generics",
      slug: "generics",
      title: "Generics: Type Safety Without Casting",
      content: `
# Generics

Generics enable type-safe, reusable code. Without generics, you'd need casts everywhere and get ClassCastExceptions at runtime.

\`\`\`concept
{
  "title": "Why Generics?",
  "description": "Generics move type errors from runtime to compile time. A List<String> can only hold Strings — the compiler enforces this. No casting needed, no ClassCastException surprises.",
  "points": [
    "Type parameters: <T>, <K,V>, <E> (by convention)",
    "Type erasure: generics are compile-time only — at runtime, List<String> = List",
    "Bounded wildcards: <T extends Comparable<T>>, <? extends Number>, <? super Integer>",
    "PECS rule: Producer Extends, Consumer Super",
    "Cannot use primitives as type params — use Integer not int, Double not double",
    "Cannot create arrays of generic types: new T[] is illegal"
  ]
}
\`\`\`

## Generic Classes and Methods

\`\`\`java
// Generic class:
public class Pair<A, B> {
    private final A first;
    private final B second;

    public Pair(A first, B second) {
        this.first = first;
        this.second = second;
    }

    public A getFirst() { return first; }
    public B getSecond() { return second; }

    @Override
    public String toString() { return "(" + first + ", " + second + ")"; }
}

Pair<String, Integer> nameAge = new Pair<>("Alice", 30);
Pair<Double, Double> point = new Pair<>(3.14, 2.71);

// Generic method:
public static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}

max("apple", "banana"); // "banana"
max(42, 17);            // 42
max(3.14, 2.71);        // 3.14

// Generic stack implementation:
public class Stack<T> {
    private List<T> items = new ArrayList<>();

    public void push(T item) { items.add(item); }

    public T pop() {
        if (isEmpty()) throw new EmptyStackException();
        return items.remove(items.size() - 1);
    }

    public T peek() {
        if (isEmpty()) throw new EmptyStackException();
        return items.get(items.size() - 1);
    }

    public boolean isEmpty() { return items.isEmpty(); }
    public int size() { return items.size(); }
}
\`\`\`

## Wildcards

\`\`\`tabs
[
  {
    "label": "? extends (Producer)",
    "content": "// ? extends T: accepts T or any subtype — READ ONLY\\n// Use when you only PRODUCE (read) values from the collection\\nvoid printAll(List<? extends Number> numbers) {\\n    for (Number n : numbers) {\\n        System.out.println(n.doubleValue()); // safe — it's at least a Number\\n    }\\n}\\n\\n// Works with List<Integer>, List<Double>, List<Number>:\\nprintAll(List.of(1, 2, 3));     // Integer\\nprintAll(List.of(1.5, 2.5));   // Double\\n\\n// Cannot add to ? extends:\\nvoid bad(List<? extends Number> list) {\\n    list.add(42); // COMPILE ERROR — type unsafe\\n}"
  },
  {
    "label": "? super (Consumer)",
    "content": "// ? super T: accepts T or any supertype — WRITE\\n// Use when you CONSUME (write) values into the collection\\nvoid addNumbers(List<? super Integer> list) {\\n    list.add(1);  // safe — list can hold Integer or its supertypes\\n    list.add(2);\\n    list.add(3);\\n}\\n\\n// Works with List<Integer>, List<Number>, List<Object>:\\nList<Number> numbers = new ArrayList<>();\\naddNumbers(numbers);  // OK"
  },
  {
    "label": "PECS Mnemonic",
    "content": "// PECS = Producer Extends, Consumer Super\\n// A collection that PRODUCES items for you: ? extends T (read)\\n// A collection that CONSUMES items from you: ? super T (write)\\n\\n// Real example — Collections.copy():\\npublic static <T> void copy(\\n    List<? super T> dest,    // consumer (we write into it)\\n    List<? extends T> src    // producer (we read from it)\\n) {\\n    for (T t : src) {\\n        dest.add(t);\\n    }\\n}"
  }
]
\`\`\`
`,
    },
    {
      id: "streams-api",
      slug: "streams-api",
      title: "Stream API: Functional Data Processing",
      content: `
# Stream API: Elegant Data Processing

Streams let you process collections of data declaratively — filtering, mapping, collecting — without explicit loops.

\`\`\`concept
{
  "title": "Stream Pipeline",
  "description": "A stream pipeline has three parts: source → intermediate operations (lazy) → terminal operation. Intermediate operations return a new Stream. Terminal operations produce a result and consume the stream.",
  "points": [
    "Streams are LAZY — intermediate ops don't run until terminal op triggers them",
    "A stream can only be consumed ONCE — use again = new stream",
    "Intermediate: filter, map, flatMap, sorted, distinct, limit, skip, peek",
    "Terminal: collect, forEach, count, findFirst, findAny, anyMatch, allMatch, reduce, min, max",
    "Collectors: toList, toSet, toMap, groupingBy, joining, counting, summarizingInt",
    "Parallel streams: stream.parallel() — use carefully, overhead for small data"
  ]
}
\`\`\`

## Core Stream Operations

\`\`\`java
List<String> names = List.of("Alice", "Bob", "Charlie", "David", "Eve");

// filter: keep matching elements
List<String> longNames = names.stream()
    .filter(n -> n.length() > 3)
    .collect(Collectors.toList()); // [Alice, Charlie, David]

// map: transform each element
List<Integer> lengths = names.stream()
    .map(String::length)
    .collect(Collectors.toList()); // [5, 3, 7, 5, 3]

// sorted + distinct
List<Integer> sorted = List.of(3, 1, 4, 1, 5, 9, 2, 6)
    .stream()
    .distinct()
    .sorted()
    .collect(Collectors.toList()); // [1, 2, 3, 4, 5, 6, 9]

// reduce: fold all elements into one
int sum = List.of(1, 2, 3, 4, 5).stream()
    .reduce(0, Integer::sum); // 15

// count, min, max, findFirst
long count = names.stream().filter(n -> n.startsWith("A")).count(); // 1

Optional<String> shortest = names.stream()
    .min(Comparator.comparingInt(String::length)); // Optional[Bob]

Optional<String> first = names.stream()
    .filter(n -> n.length() > 4)
    .findFirst(); // Optional[Alice]
\`\`\`

## Advanced Collectors

\`\`\`tabs
[
  {
    "label": "groupingBy",
    "content": "List<String> words = List.of(\\"apple\\", \\"banana\\", \\"avocado\\", \\"blueberry\\", \\"cherry\\");\\n\\n// Group by first character:\\nMap<Character, List<String>> byFirstChar = words.stream()\\n    .collect(Collectors.groupingBy(s -> s.charAt(0)));\\n// {a=[apple, avocado], b=[banana, blueberry], c=[cherry]}\\n\\n// Group + count:\\nMap<Character, Long> countByChar = words.stream()\\n    .collect(Collectors.groupingBy(s -> s.charAt(0), Collectors.counting()));\\n// {a=2, b=2, c=1}\\n\\n// Group by length:\\nMap<Integer, List<String>> byLength = words.stream()\\n    .collect(Collectors.groupingBy(String::length));"
  },
  {
    "label": "joining & toMap",
    "content": "List<String> names = List.of(\\"Alice\\", \\"Bob\\", \\"Charlie\\");\\n\\n// Join with delimiter:\\nString csv = names.stream()\\n    .collect(Collectors.joining(\\", \\")); // \\"Alice, Bob, Charlie\\"\\n\\nString wrapped = names.stream()\\n    .collect(Collectors.joining(\\", \\", \\"[\\" , \\"]\\")); // \\"[Alice, Bob, Charlie]\\"\\n\\n// toMap:\\nList<Person> people = ...;\\nMap<Integer, String> idToName = people.stream()\\n    .collect(Collectors.toMap(Person::getId, Person::getName));"
  },
  {
    "label": "flatMap",
    "content": "// flatMap: flatten nested collections\\nList<List<Integer>> nested = List.of(\\n    List.of(1, 2, 3),\\n    List.of(4, 5, 6),\\n    List.of(7, 8, 9)\\n);\\n\\nList<Integer> flat = nested.stream()\\n    .flatMap(Collection::stream)\\n    .collect(Collectors.toList()); // [1,2,3,4,5,6,7,8,9]\\n\\n// Flatten list of words into list of characters:\\nList<String> words = List.of(\\"hello\\", \\"world\\");\\nList<Character> chars = words.stream()\\n    .flatMap(w -> w.chars().mapToObj(c -> (char) c))\\n    .collect(Collectors.toList());"
  }
]
\`\`\`

## Optional: No More NullPointerException

\`\`\`java
// Optional wraps a value that might be null
Optional<String> present = Optional.of("Hello");
Optional<String> empty = Optional.empty();
Optional<String> nullable = Optional.ofNullable(null); // empty

// Checking and getting:
present.isPresent(); // true
present.get();       // "Hello" (throws if empty — use carefully)

// Safe alternatives:
present.orElse("default");                    // get or default
present.orElseGet(() -> computeDefault());    // lazy default
present.orElseThrow(() -> new RuntimeException("Not found"));

// Chaining with map/filter:
Optional<Integer> length = present.map(String::length); // Optional[5]
Optional<String> filtered = present.filter(s -> s.length() > 3); // Optional[Hello]

// In practice — replacing null returns:
public Optional<User> findById(int id) {
    User user = database.find(id);
    return Optional.ofNullable(user);
}

// Caller handles absence explicitly:
findById(42)
    .map(User::getName)
    .orElse("Unknown");
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What happens if you call stream() on a list, then call terminal operation twice?",
      "options": ["Returns the result twice", "Throws IllegalStateException on second use", "Returns empty result second time", "Works fine"],
      "answer": 1,
      "explanation": "Streams can only be consumed once. After a terminal operation, the stream is closed. Calling another terminal operation throws IllegalStateException: stream has already been operated upon or closed."
    },
    {
      "q": "Which operation is LAZY in a stream pipeline?",
      "options": ["collect()", "forEach()", "filter()", "count()"],
      "answer": 2,
      "explanation": "Intermediate operations (filter, map, sorted, etc.) are lazy — they don't execute until a terminal operation triggers the pipeline. Terminal operations (collect, forEach, count) are eager and consume the stream."
    },
    {
      "q": "What does Optional.orElseGet(() -> compute()) do differently than orElse(compute())?",
      "options": ["No difference", "orElse always evaluates compute(), orElseGet only evaluates it when the Optional is empty", "orElseGet works with null, orElse doesn't", "orElse is thread-safe"],
      "answer": 1,
      "explanation": "orElse(value) always evaluates the default expression. orElseGet(supplier) only evaluates the supplier lazily when the Optional is empty — important when the default is expensive to compute."
    }
  ]
}
\`\`\`
`,
      starterCode: `// Use Stream API to process a list of transactions
// Given a list of Transaction objects with: id, amount (double), category (String), date (LocalDate)
// Implement the following queries:

import java.util.*;
import java.util.stream.*;

record Transaction(int id, double amount, String category, int year) {}

public class TransactionAnalytics {

    // 1. Get all transactions over $100, sorted by amount descending
    public static List<Transaction> getBigTransactions(List<Transaction> txns) {
        return List.of(); // TODO
    }

    // 2. Total spending per category
    public static Map<String, Double> spendingByCategory(List<Transaction> txns) {
        return Map.of(); // TODO
    }

    // 3. Get top 3 most expensive categories
    public static List<String> top3Categories(List<Transaction> txns) {
        return List.of(); // TODO
    }

    // 4. Are all transactions from 2023 or later?
    public static boolean allRecent(List<Transaction> txns) {
        return false; // TODO
    }
}`,
      solutionCode: `import java.util.*;
import java.util.stream.*;

record Transaction(int id, double amount, String category, int year) {}

public class TransactionAnalytics {

    public static List<Transaction> getBigTransactions(List<Transaction> txns) {
        return txns.stream()
            .filter(t -> t.amount() > 100)
            .sorted(Comparator.comparingDouble(Transaction::amount).reversed())
            .collect(Collectors.toList());
    }

    public static Map<String, Double> spendingByCategory(List<Transaction> txns) {
        return txns.stream()
            .collect(Collectors.groupingBy(
                Transaction::category,
                Collectors.summingDouble(Transaction::amount)
            ));
    }

    public static List<String> top3Categories(List<Transaction> txns) {
        return txns.stream()
            .collect(Collectors.groupingBy(
                Transaction::category,
                Collectors.summingDouble(Transaction::amount)
            ))
            .entrySet().stream()
            .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
            .limit(3)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }

    public static boolean allRecent(List<Transaction> txns) {
        return txns.stream().allMatch(t -> t.year() >= 2023);
    }
}`,
    },
  ],
};
