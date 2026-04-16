import { Module } from "../types";

export const module1: Module = {
  id: "java-fundamentals",
  title: "Java Fundamentals",
  description: "Data types, variables, operators, control flow, and the JVM execution model",
  lessons: [
    {
      id: "jvm-types",
      slug: "jvm-types",
      title: "JVM, Data Types & Variables",
      content: `
# JVM, Data Types & Variables

Java is a **compiled + interpreted** language. Your source code compiles to bytecode, which the JVM runs on any platform — "Write Once, Run Anywhere."

\`\`\`concept
{
  "title": "Java Execution Model",
  "description": "Java source (.java) → compiler (javac) → bytecode (.class) → JVM interprets/JIT-compiles → native code runs",
  "points": [
    "JVM (Java Virtual Machine): runtime environment that executes bytecode",
    "JDK (Java Development Kit): includes compiler + JVM + standard library",
    "JRE (Java Runtime Environment): JVM + library only (no compiler)",
    "Java is strongly and statically typed — every variable must have a declared type",
    "Java is pass-by-value — always copies the value (reference or primitive)",
    "Garbage collection handles memory — no manual malloc/free"
  ]
}
\`\`\`

## Primitive Types

\`\`\`tabs
[
  {
    "label": "Integer Types",
    "content": "byte   b = 127;          // 8-bit,  -128 to 127\\nshort  s = 32_000;       // 16-bit, -32,768 to 32,767\\nint    i = 2_000_000;    // 32-bit, most common\\nlong   l = 9_000_000_000L; // 64-bit, needs L suffix\\n\\n// Numeric literals can have underscores for readability:\\nint million = 1_000_000;\\nlong creditCard = 1234_5678_9012_3456L;"
  },
  {
    "label": "Float, Char, Boolean",
    "content": "float  f = 3.14f;   // 32-bit, needs f suffix\\ndouble d = 3.14159; // 64-bit, default for decimals\\n\\nchar c = 'A';       // 16-bit Unicode character\\nchar heart = '\\u2665'; // Unicode escape\\n\\nboolean flag = true;  // true or false only\\n// Note: no truthy/falsy — only explicit true/false"
  },
  {
    "label": "var (Local Type Inference)",
    "content": "// Java 10+: var infers type from right-hand side\\nvar name = \\"Alice\\";       // inferred: String\\nvar count = 42;            // inferred: int\\nvar list = new ArrayList<String>(); // inferred: ArrayList<String>\\n\\n// var ONLY works for local variables (not fields, params, return types)\\n// Type is still STATIC — not dynamic like JavaScript\\nvar x = 5;\\nx = \\"hello\\"; // COMPILE ERROR — x is int, not String"
  },
  {
    "label": "Type Casting",
    "content": "// Widening (implicit — no data loss):\\nint i = 100;\\nlong l = i;   // int fits in long — automatic\\ndouble d = i; // int fits in double — automatic\\n\\n// Narrowing (explicit — may lose data):\\ndouble pi = 3.14159;\\nint truncated = (int) pi;  // 3 — decimal part lost\\n\\nbyte b = (byte) 300;  // overflow: 300 % 256 = 44\\n\\n// String conversions:\\nString s = String.valueOf(42);  // int to String\\nint n = Integer.parseInt(\\"42\\"); // String to int"
  }
]
\`\`\`

## Control Flow

\`\`\`tabs
[
  {
    "label": "if / switch",
    "content": "// Traditional if-else:\\nif (score >= 90) {\\n    grade = 'A';\\n} else if (score >= 80) {\\n    grade = 'B';\\n} else {\\n    grade = 'F';\\n}\\n\\n// Switch expression (Java 14+):\\nString day = switch (dayNumber) {\\n    case 1 -> \\"Monday\\";\\n    case 2 -> \\"Tuesday\\";\\n    case 6, 7 -> \\"Weekend\\";\\n    default -> \\"Weekday\\";\\n};"
  },
  {
    "label": "Loops",
    "content": "// for loop:\\nfor (int i = 0; i < 10; i++) { System.out.println(i); }\\n\\n// enhanced for (foreach):\\nint[] nums = {1, 2, 3, 4, 5};\\nfor (int n : nums) { System.out.println(n); }\\n\\n// while:\\nwhile (condition) { ... }\\n\\n// do-while (always executes at least once):\\ndo { ... } while (condition);\\n\\n// Labels for breaking nested loops:\\nouter: for (int i = 0; i < 3; i++) {\\n    for (int j = 0; j < 3; j++) {\\n        if (i == j) continue outer; // skip to next outer iteration\\n    }\\n}"
  }
]
\`\`\`

## Strings in Java

\`\`\`java
// Strings are IMMUTABLE objects in Java
String s1 = "Hello";           // String literal (interned)
String s2 = new String("Hello"); // New object (don't do this)

// ALWAYS compare strings with .equals(), NOT ==
s1 == s2;         // false (different references)
s1.equals(s2);    // true (same content)

// Common String methods:
String str = "Hello, World!";
str.length();           // 13
str.charAt(0);          // 'H'
str.substring(7, 12);   // "World"
str.toLowerCase();      // "hello, world!"
str.contains("World");  // true
str.replace("World", "Java"); // "Hello, Java!"
str.split(", ");        // ["Hello", "World!"]
str.trim();             // removes whitespace
str.startsWith("Hello"); // true

// String concatenation builds many String objects — use StringBuilder for loops:
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 100; i++) {
    sb.append(i).append(", ");
}
String result = sb.toString();

// String formatting:
String msg = String.format("Hello, %s! You are %d years old.", name, age);
String msg2 = "Hello, %s!".formatted(name); // Java 15+
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the default value of an int field in a Java class?",
      "options": ["null", "undefined", "0", "1"],
      "answer": 2,
      "explanation": "Java initializes numeric fields to 0, boolean fields to false, and object references to null. Local variables are NOT initialized — must be assigned before use."
    },
    {
      "q": "Why should you use .equals() instead of == to compare Strings?",
      "options": ["Performance", "== compares object references (memory addresses), .equals() compares content", ".equals() is faster", "== doesn't work with Strings"],
      "answer": 1,
      "explanation": "== checks if two variables point to the SAME object. Two String objects with the same content are different objects, so == returns false. .equals() compares the character content."
    },
    {
      "q": "What does the 'L' suffix mean in 9_000_000_000L?",
      "options": ["Lowercase conversion", "Long literal — required for values that don't fit in int", "Lambda expression", "Library reference"],
      "answer": 1,
      "explanation": "Without L, Java treats numeric literals as int (32-bit). 9 billion exceeds int's max (~2.1 billion), so the L suffix is required to declare it as a long."
    }
  ]
}
\`\`\`
`,
      starterCode: `// Exercise: Implement a method that checks if a string is a palindrome
// A palindrome reads the same forwards and backwards (e.g., "racecar", "madam")
// Requirements:
// - Ignore case ("Racecar" is a palindrome)
// - Ignore spaces ("race car" is a palindrome)
// - Return true/false

public class Palindrome {
    public static boolean isPalindrome(String s) {
        // TODO: implement
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar")); // true
        System.out.println(isPalindrome("Race Car")); // true
        System.out.println(isPalindrome("hello"));   // false
        System.out.println(isPalindrome("A man a plan a canal Panama")); // true
    }
}`,
      solutionCode: `public class Palindrome {
    public static boolean isPalindrome(String s) {
        // Normalize: lowercase and remove non-alphanumeric
        String cleaned = s.toLowerCase().replaceAll("[^a-z0-9]", "");

        int left = 0, right = cleaned.length() - 1;
        while (left < right) {
            if (cleaned.charAt(left) != cleaned.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar")); // true
        System.out.println(isPalindrome("Race Car")); // true
        System.out.println(isPalindrome("hello"));   // false
        System.out.println(isPalindrome("A man a plan a canal Panama")); // true
    }
}`,
    },
    {
      id: "arrays-methods",
      slug: "arrays-methods",
      title: "Arrays, Methods & Varargs",
      content: `
# Arrays, Methods & Varargs

\`\`\`concept
{
  "title": "Java Arrays",
  "description": "Arrays in Java are fixed-size, zero-indexed, and store elements of the same type. They are objects — not primitives.",
  "points": [
    "Arrays are fixed size once created — use ArrayList for dynamic sizing",
    "Array index starts at 0, last element at length - 1",
    "Accessing out-of-bounds throws ArrayIndexOutOfBoundsException",
    "Arrays.sort() sorts in-place using dual-pivot quicksort",
    "Multi-dimensional arrays are arrays of arrays",
    "Arrays.copyOf() and System.arraycopy() for copying"
  ]
}
\`\`\`

## Arrays in Practice

\`\`\`java
// Declaration and initialization:
int[] nums = new int[5];           // {0, 0, 0, 0, 0} (default values)
int[] filled = {10, 20, 30, 40};  // array literal
String[] names = new String[3];   // {null, null, null}

// Multi-dimensional:
int[][] matrix = new int[3][3];
int[][] grid = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};

// Common array operations:
Arrays.sort(nums);                         // sort in-place
int idx = Arrays.binarySearch(nums, 30);   // binary search (must be sorted)
int[] copy = Arrays.copyOf(nums, nums.length); // copy
Arrays.fill(nums, 0);                      // fill with value
System.out.println(Arrays.toString(nums)); // print nicely

// Array → List:
List<String> list = Arrays.asList("a", "b", "c"); // fixed-size List
List<String> mutable = new ArrayList<>(Arrays.asList("a", "b")); // mutable
\`\`\`

## Methods

\`\`\`tabs
[
  {
    "label": "Method Signatures",
    "content": "// Anatomy: [access] [static] returnType name(params) [throws]\\npublic static int add(int a, int b) {\\n    return a + b;\\n}\\n\\n// Void — returns nothing:\\npublic void printInfo(String name) {\\n    System.out.println(\\"Name: \\" + name);\\n}\\n\\n// Method overloading — same name, different params:\\npublic double add(double a, double b) { return a + b; }\\npublic int add(int a, int b) { return a + b; }\\npublic int add(int a, int b, int c) { return a + b + c; }"
  },
  {
    "label": "Varargs",
    "content": "// Varargs: variable number of arguments (must be last param)\\npublic static int sum(int... numbers) {\\n    // numbers is just an int[] inside the method\\n    int total = 0;\\n    for (int n : numbers) total += n;\\n    return total;\\n}\\n\\n// Call with any number of args:\\nsum(1, 2, 3);       // 6\\nsum(1, 2, 3, 4, 5); // 15\\nsum();               // 0 (empty array)\\n\\n// Also works with arrays:\\nint[] arr = {1, 2, 3};\\nsum(arr); // valid"
  },
  {
    "label": "Pass by Value",
    "content": "// Java is ALWAYS pass-by-value:\\n\\n// Primitives: copy of the value is passed\\nvoid doubleIt(int x) { x = x * 2; } // doesn't affect caller!\\nint n = 5;\\ndoubleIt(n);\\nSystem.out.println(n); // still 5\\n\\n// Objects: copy of the REFERENCE is passed\\nvoid addItem(List<String> list) {\\n    list.add(\\"new item\\"); // modifies the SAME list object!\\n}\\nList<String> myList = new ArrayList<>();\\naddItem(myList);\\nSystem.out.println(myList); // [\\"new item\\"]"
  }
]
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What happens when you access array[array.length] in Java?",
      "options": ["Returns null", "Returns 0", "Throws ArrayIndexOutOfBoundsException", "Returns the last element"],
      "answer": 2,
      "explanation": "Valid indices are 0 to array.length - 1. Accessing array.length throws ArrayIndexOutOfBoundsException at runtime."
    },
    {
      "q": "Java is pass-by-value. What does this mean for object parameters?",
      "options": ["Objects can't be passed to methods", "A copy of the object is passed", "A copy of the REFERENCE is passed — the method can mutate the object but not reassign the caller's variable", "Objects are passed by reference"],
      "answer": 2,
      "explanation": "Java copies the reference value (memory address). The method receives its own copy of the pointer — it can mutate the object, but reassigning the parameter doesn't affect the caller's variable."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
