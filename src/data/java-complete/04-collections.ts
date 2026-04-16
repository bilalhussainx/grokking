import { Module } from "../types";

export const module4: Module = {
  id: "collections-framework",
  title: "Collections Framework",
  description: "Master List, Set, Map, Queue — their implementations, performance characteristics, and when to use each",
  lessons: [
    {
      id: "list-set-map",
      slug: "list-set-map",
      title: "List, Set & Map — Choosing the Right Collection",
      content: `
# Java Collections Framework

The Collections Framework provides standard data structures. Choosing the right implementation dramatically affects performance.

\`\`\`concept
{
  "title": "Collection Hierarchy",
  "description": "Java collections are organized around interfaces. Always program to the interface (List, Map, Set) rather than the implementation (ArrayList, HashMap).",
  "points": [
    "List: ordered, allows duplicates — ArrayList (fast random access) or LinkedList",
    "Set: no duplicates — HashSet (O(1) ops) or TreeSet (sorted, O(log n))",
    "Map: key-value pairs, unique keys — HashMap (O(1)) or TreeMap (sorted, O(log n))",
    "Queue/Deque: FIFO/LIFO — LinkedList, ArrayDeque, PriorityQueue",
    "All backed by generics — type-safe since Java 5",
    "Collections utility class: sort, shuffle, min, max, frequency, unmodifiableList"
  ]
}
\`\`\`

## List Implementations

\`\`\`tabs
[
  {
    "label": "ArrayList vs LinkedList",
    "content": "// ArrayList: backed by array — O(1) get/set, O(n) insert/delete at middle\\nList<String> al = new ArrayList<>();\\nal.add(\\"a\\");          // O(1) amortized\\nal.get(0);            // O(1)\\nal.add(0, \\"z\\");      // O(n) — shifts elements\\nal.remove(0);         // O(n) — shifts elements\\n\\n// LinkedList: doubly linked — O(1) insert at ends, O(n) random access\\nList<String> ll = new LinkedList<>();\\n((LinkedList<String>) ll).addFirst(\\"z\\"); // O(1)\\nll.get(500); // O(n) — traverses list\\n\\n// ArrayList wins for: most use cases\\n// LinkedList wins for: queue/stack operations (use ArrayDeque instead)"
  },
  {
    "label": "Immutable Lists",
    "content": "// Java 9+ factory methods:\\nList<String> immutable = List.of(\\"a\\", \\"b\\", \\"c\\"); // cannot add/remove/modify\\nList<Integer> nums = List.of(1, 2, 3, 4, 5);\\n\\n// Collections.unmodifiableList wraps (still modifiable via original ref):\\nList<String> mutable = new ArrayList<>(Arrays.asList(\\"a\\", \\"b\\"));\\nList<String> view = Collections.unmodifiableList(mutable);\\n\\n// Common operations:\\nList<String> list = new ArrayList<>(List.of(\\"c\\", \\"a\\", \\"b\\"));\\nCollections.sort(list);                    // [\\"a\\", \\"b\\", \\"c\\"]\\nCollections.reverse(list);                 // [\\"c\\", \\"b\\", \\"a\\"]\\nCollections.shuffle(list);                 // random order\\nint count = Collections.frequency(list, \\"a\\");"
  }
]
\`\`\`

## Set Implementations

\`\`\`java
// HashSet: O(1) add/contains/remove, no order guarantee
Set<String> hashSet = new HashSet<>();
hashSet.add("banana");
hashSet.add("apple");
hashSet.add("banana"); // duplicate ignored
hashSet.contains("apple"); // O(1) — true
System.out.println(hashSet); // [banana, apple] (order not guaranteed)

// LinkedHashSet: insertion order preserved, O(1) ops
Set<String> linkedSet = new LinkedHashSet<>();
linkedSet.add("banana");
linkedSet.add("apple");
System.out.println(linkedSet); // [banana, apple] (insertion order)

// TreeSet: sorted order, O(log n) ops
Set<String> treeSet = new TreeSet<>();
treeSet.add("banana");
treeSet.add("apple");
treeSet.add("cherry");
System.out.println(treeSet); // [apple, banana, cherry] (sorted!)

// TreeSet with custom order:
Set<String> byLength = new TreeSet<>(Comparator.comparingInt(String::length));

// Set operations:
Set<Integer> a = new HashSet<>(Set.of(1, 2, 3, 4));
Set<Integer> b = new HashSet<>(Set.of(3, 4, 5, 6));
a.retainAll(b);  // a is now intersection: {3, 4}
a.addAll(b);     // a is now union
a.removeAll(b);  // a is now difference
\`\`\`

## Map Implementations

\`\`\`tabs
[
  {
    "label": "HashMap Essentials",
    "content": "Map<String, Integer> scores = new HashMap<>();\\n\\n// Basic operations:\\nscores.put(\\"Alice\\", 95);\\nscores.put(\\"Bob\\", 87);\\nscores.get(\\"Alice\\");          // 95\\nscores.get(\\"Nobody\\");         // null (NOT exception)\\nscores.getOrDefault(\\"Nobody\\", 0); // 0 (safe alternative)\\nscores.containsKey(\\"Bob\\");    // true\\nscores.remove(\\"Bob\\");\\n\\n// putIfAbsent, computeIfAbsent, merge:\\nscores.putIfAbsent(\\"Charlie\\", 90); // only if key missing\\n\\n// computeIfAbsent: for value creation:\\nMap<String, List<String>> groups = new HashMap<>();\\ngroups.computeIfAbsent(\\"A\\", k -> new ArrayList<>()).add(\\"Alice\\");"
  },
  {
    "label": "Iterating Maps",
    "content": "Map<String, Integer> map = Map.of(\\"a\\", 1, \\"b\\", 2, \\"c\\", 3);\\n\\n// Iterate entries (most common):\\nfor (Map.Entry<String, Integer> entry : map.entrySet()) {\\n    System.out.println(entry.getKey() + \\"=\\" + entry.getValue());\\n}\\n\\n// Iterate with forEach:\\nmap.forEach((key, value) -> System.out.println(key + \\"=\\" + value));\\n\\n// Keys only:\\nfor (String key : map.keySet()) { ... }\\n\\n// Values only:\\nfor (int value : map.values()) { ... }"
  },
  {
    "label": "Frequency / Grouping Pattern",
    "content": "// Count character frequency (common interview pattern):\\nString text = \\"hello world\\";\\nMap<Character, Integer> freq = new HashMap<>();\\nfor (char c : text.toCharArray()) {\\n    freq.merge(c, 1, Integer::sum);\\n    // equivalent to: freq.put(c, freq.getOrDefault(c, 0) + 1);\\n}\\n\\n// Group strings by first letter:\\nList<String> words = List.of(\\"apple\\", \\"banana\\", \\"avocado\\", \\"blueberry\\");\\nMap<Character, List<String>> grouped = new HashMap<>();\\nfor (String w : words) {\\n    grouped.computeIfAbsent(w.charAt(0), k -> new ArrayList<>()).add(w);\\n}\\n// {a=[apple, avocado], b=[banana, blueberry]}"
  }
]
\`\`\`

## Queue & Deque

\`\`\`java
// ArrayDeque: fast double-ended queue (prefer over LinkedList for this)
Deque<String> stack = new ArrayDeque<>(); // use as stack
stack.push("first");   // push to front (addFirst)
stack.push("second");
stack.pop();           // "second" — LIFO

Deque<String> queue = new ArrayDeque<>(); // use as queue
queue.offer("first");  // add to end
queue.offer("second");
queue.poll();          // "first" — FIFO (returns null if empty)
queue.peek();          // "second" — look without removing

// PriorityQueue: min-heap by default
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(5); minHeap.offer(1); minHeap.offer(3);
minHeap.poll(); // 1 — smallest element

// Max heap:
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
\`\`\`

## Performance Reference

\`\`\`concept
{
  "title": "Big-O Reference for Collections",
  "description": "Know these for interview questions",
  "points": [
    "ArrayList: get O(1), add-end O(1) amortized, add-middle O(n), contains O(n)",
    "LinkedList: add-ends O(1), get O(n), contains O(n)",
    "HashSet/HashMap: add/get/contains O(1) average, O(n) worst (hash collision)",
    "TreeSet/TreeMap: add/get/contains O(log n), always sorted",
    "LinkedHashSet/LinkedHashMap: O(1) ops + insertion order preserved",
    "PriorityQueue: offer O(log n), poll O(log n), peek O(1)"
  ]
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "You need to find if a value exists in a collection 1000 times. Which is fastest?",
      "options": ["ArrayList.contains()", "LinkedList.contains()", "HashSet.contains()", "TreeSet.contains()"],
      "answer": 2,
      "explanation": "HashSet.contains() is O(1) average. ArrayList and LinkedList are O(n) per lookup. TreeSet is O(log n). For 1000 lookups on n elements: HashSet = O(1000), TreeSet = O(1000 log n), List = O(1000n)."
    },
    {
      "q": "map.get('missing-key') returns what?",
      "options": ["Throws NoSuchElementException", "Throws NullPointerException", "null", "An empty Optional"],
      "answer": 2,
      "explanation": "HashMap.get() returns null if the key doesn't exist — not an exception. Use getOrDefault() to provide a fallback, or containsKey() to check first."
    },
    {
      "q": "Which collection preserves insertion order AND prevents duplicates AND has O(1) add/contains?",
      "options": ["HashSet", "TreeSet", "LinkedHashSet", "LinkedList"],
      "answer": 2,
      "explanation": "LinkedHashSet combines the O(1) performance of HashSet with insertion-order iteration, and still prevents duplicates. TreeSet preserves sorted order (not insertion order)."
    }
  ]
}
\`\`\`
`,
      starterCode: `// Interview problem: Given a list of strings, group anagrams together.
// Two strings are anagrams if they contain the same characters in any order.
// Input:  ["eat", "tea", "tan", "ate", "nat", "bat"]
// Output: [["eat","tea","ate"], ["tan","nat"], ["bat"]]

import java.util.*;

public class GroupAnagrams {
    public static List<List<String>> groupAnagrams(String[] strs) {
        // HINT: Two anagrams have the same sorted character array
        // Use a Map<String, List<String>> where key = sorted string
        return new ArrayList<>(); // TODO
    }

    public static void main(String[] args) {
        System.out.println(groupAnagrams(new String[]{"eat","tea","tan","ate","nat","bat"}));
    }
}`,
      solutionCode: `import java.util.*;

public class GroupAnagrams {
    public static List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();

        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars); // sorted chars = canonical form

            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }

        return new ArrayList<>(map.values());
    }

    public static void main(String[] args) {
        System.out.println(groupAnagrams(new String[]{"eat","tea","tan","ate","nat","bat"}));
        // [[eat, tea, ate], [tan, nat], [bat]]
    }
}`,
    },
  ],
};
