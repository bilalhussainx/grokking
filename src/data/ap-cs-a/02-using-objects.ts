import { Module } from "../types";

export const usingObjectsModule: Module = {
  id: "ap-csa-using-objects",
  title: "Using Objects",
  description:
    "Learn how to create and use objects, call methods, and work with the String class -- one of Java's most important types.",
  lessons: [
    {
      id: "ap-csa-objects-intro",
      slug: "objects-intro",
      title: "Objects and Classes",
      content: `## Objects and Classes

<!-- voice:key_insight -->

An **object** is a bundle of related data and behavior. A **class** is the blueprint for creating objects.

### Java vs. Python Comparison

**Java -- Creating an object:**
\`\`\`java
// Class is the blueprint
Scanner input = new Scanner(System.in);
String greeting = new String("Hello");
// Or simpler:
String greeting = "Hello";
\`\`\`

**Python equivalent:**
\`\`\`python
# In Python, everything is an object
greeting = "Hello"
numbers = [1, 2, 3]  # list object
\`\`\`

### Key Object Concepts

**Constructor**: A special method that creates a new object.
- Java: \`new Scanner(System.in)\`
- Python: \`MyClass()\`

**Methods**: Functions that belong to an object.
- Java: \`greeting.length()\`
- Python: \`greeting.upper()\`

**Null / None**: A special value meaning "no object."
- Java: \`null\`
- Python: \`None\`

### The String Class (AP CSA Focus)

Strings are objects with many built-in methods:

| Java Method | Python Equivalent | Description |
|-------------|-------------------|-------------|
| \`s.length()\` | \`len(s)\` | Number of characters |
| \`s.substring(a, b)\` | \`s[a:b]\` | Extract portion |
| \`s.indexOf("x")\` | \`s.find("x")\` | Find position |
| \`s.equals(t)\` | \`s == t\` | Compare strings |
| \`s.compareTo(t)\` | Compare alphabetically | Returns neg/zero/pos |

### Analogy: Classes and Objects Are Like Cookie Cutters and Cookies

The class (cookie cutter) defines the shape. Each object (cookie) is made from that shape but can have different decorations (different data).

### Deeper Reading
- AP CSA Unit 2: Using Objects
- Oracle Java Tutorials: "Classes and Objects"

### Reflection Questions
1. What is the difference between a class and an object?
2. Why does Java use \`.equals()\` to compare strings instead of \`==\`?
3. What is a constructor?`,
    },
    {
      id: "ap-csa-string-methods",
      slug: "string-methods",
      title: "String Methods Deep Dive",
      content: `## String Methods Deep Dive

Strings are heavily tested on the AP CSA exam. Let's master them.

### Java String Methods (with Python Equivalents)

**substring(beginIndex, endIndex)**
\`\`\`java
// Java
String s = "Computer";
s.substring(0, 4)    // "Comp" (endIndex is exclusive)
s.substring(4)       // "uter" (from index 4 to end)
\`\`\`
\`\`\`python
# Python
s = "Computer"
s[0:4]    # "Comp"
s[4:]     # "uter"
\`\`\`

<!-- voice:key_insight -->

**indexOf(str)**
\`\`\`java
// Java
"Hello World".indexOf("World")   // 6
"Hello World".indexOf("xyz")     // -1 (not found)
\`\`\`
\`\`\`python
# Python
"Hello World".find("World")    # 6
"Hello World".find("xyz")      # -1
\`\`\`

### String Concatenation

Both languages use \`+\` to join strings:
\`\`\`java
// Java
String result = "Hello" + " " + "World";
// Java auto-converts numbers: "Score: " + 95  gives "Score: 95"
\`\`\`
\`\`\`python
# Python
result = "Hello" + " " + "World"
# Python requires explicit conversion: "Score: " + str(95)
\`\`\`

### Immutability

**Strings are immutable** in both Java and Python. Methods like \`substring()\` and \`upper()\` return a NEW string -- they do not modify the original.

### Common AP Exam Traps

1. \`substring(a, b)\` includes index \`a\` but excludes index \`b\`
2. \`indexOf()\` returns -1 if not found (not an error)
3. Java's \`==\` checks if two variables point to the same object, NOT if strings have the same content. Use \`.equals()\`!

### Deeper Reading
- AP CSA: String class methods reference
- Java API documentation: java.lang.String

### Reflection Questions
1. What does \`"abcdef".substring(2, 5)\` return?
2. Why are strings immutable?
3. What is the difference between \`==\` and \`.equals()\` for strings in Java?`,
    },
    {
      id: "ap-csa-objects-exercise",
      slug: "objects-exercise",
      title: "Practice: Using Objects and Strings",
      content: `## Practice: Using Objects and Strings

Practice Java-style string operations using Python.`,
      starterCode: `def java_substring(s, begin, end=None):
    """Simulate Java's substring method.
    substring(begin, end) returns chars from begin to end-1.
    substring(begin) returns chars from begin to the end.

    Example: java_substring("Computer", 0, 4) -> "Comp"
    Example: java_substring("Computer", 4) -> "uter"
    """
    # TODO: Use Python slicing
    pass

def count_occurrences(text, target):
    """Count how many times target appears in text.
    (Simulating repeated indexOf calls in Java)

    Example: count_occurrences("banana", "an") -> 2
    """
    # TODO: Use a loop with find() to count non-overlapping occurrences
    pass

def reverse_words(sentence):
    """Reverse the order of words in a sentence.

    Example: reverse_words("Hello World") -> "World Hello"
    """
    # TODO: Split into words, reverse the list, join back
    pass

def is_palindrome(s):
    """Check if a string is a palindrome (same forward and backward).
    Ignore case and spaces.

    Example: is_palindrome("Race Car") -> True
    """
    # TODO: Clean the string, then compare with its reverse
    pass

# Tests
print(java_substring("Computer", 0, 4))  # Expected: Comp
print(java_substring("Computer", 4))     # Expected: uter
print(count_occurrences("banana", "an"))  # Expected: 2
print(reverse_words("Hello World"))       # Expected: World Hello
print(is_palindrome("Race Car"))          # Expected: True
print(is_palindrome("Hello"))             # Expected: False
`,
      solutionCode: `def java_substring(s, begin, end=None):
    """Simulate Java's substring method."""
    if end is None:
        return s[begin:]
    return s[begin:end]

def count_occurrences(text, target):
    """Count how many times target appears in text."""
    count = 0
    start = 0
    while True:
        pos = text.find(target, start)
        if pos == -1:
            break
        count += 1
        start = pos + len(target)
    return count

def reverse_words(sentence):
    """Reverse the order of words in a sentence."""
    words = sentence.split()
    return ' '.join(reversed(words))

def is_palindrome(s):
    """Check if a string is a palindrome."""
    cleaned = s.replace(" ", "").lower()
    return cleaned == cleaned[::-1]

# Tests
print(java_substring("Computer", 0, 4))  # Expected: Comp
print(java_substring("Computer", 4))     # Expected: uter
print(count_occurrences("banana", "an"))  # Expected: 2
print(reverse_words("Hello World"))       # Expected: World Hello
print(is_palindrome("Race Car"))          # Expected: True
print(is_palindrome("Hello"))             # Expected: False
`,
    },
    {
      id: "ap-csa-objects-checkpoint",
      slug: "objects-checkpoint",
      title: "Checkpoint: Using Objects",
      content: `## Checkpoint: Using Objects

<!-- voice:section_check -->

### Question 1
In Java, what is the difference between \`==\` and \`.equals()\` when comparing strings?

<details>
<summary>Show Answer</summary>

\`==\` checks if two variables refer to the **same object in memory** (reference equality). \`.equals()\` checks if two strings have the **same content** (value equality). For comparing string values, always use \`.equals()\`.
</details>

### Question 2
What does \`"programming".substring(3, 7)\` return?

<details>
<summary>Show Answer</summary>

**"gram"**. Characters at indices 3, 4, 5, 6 (index 7 is excluded).
</details>

### Question 3
What does \`"Hello".indexOf("ll")\` return?

<details>
<summary>Show Answer</summary>

**2**. The substring "ll" starts at index 2 in "Hello".
</details>

### Question 4
Why are strings immutable? What advantage does this provide?

<details>
<summary>Show Answer</summary>

Immutability means strings cannot be changed after creation. Advantages: (1) thread safety in concurrent programs, (2) strings can be safely shared without copying, (3) string values can be cached for performance.
</details>

### Question 5
What happens in Java if you call a method on a \`null\` reference?

<details>
<summary>Show Answer</summary>

A **NullPointerException** is thrown at runtime. This is one of the most common Java errors. Always check for null before calling methods on an object.
</details>

### Well Done!
You now know how to work with objects and strings. Next: boolean expressions and conditionals.`,
    },
  ],
};
