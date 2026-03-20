import { Module } from "../types";

export const hashMapsSetsModule: Module = {
  id: "hash-maps-sets",
  title: "Hash Maps & Sets",
  description:
    "Master O(1) lookup with Python dictionaries and sets. Learn the counting pattern, the complement pattern, and how sets eliminate duplicates instantly.",
  lessons: [
    // ─── Lesson 1: Dictionaries Deep Dive ───
    {
      id: "dictionaries-deep-dive",
      slug: "dictionaries-deep-dive",
      title: "Dictionaries Deep Dive",
      content: `## The Most Useful Data Structure

If arrays are the workhorse, dictionaries are the **Swiss army knife**. A Python \`dict\` maps **keys to values** with O(1) lookup, insert, and delete. Under the hood, it uses a **hash table** — a hash function converts each key into an array index.

<!-- voice:section_check concept="dict uses hash function for O(1) operations" -->

\`\`\`mermaid
graph LR
    K1["Key: 'Alice'"] -->|"hash()"| H1["Hash: 3"]
    K2["Key: 'Bob'"] -->|"hash()"| H2["Hash: 1"]
    K3["Key: 'Charlie'"] -->|"hash()"| H3["Hash: 3"]
    subgraph "Buckets (array)"
        B0["Bucket 0: empty"]
        B1["Bucket 1: Bob->87"]
        B2["Bucket 2: empty"]
        B3["Bucket 3: Alice->95 -> Charlie->92"]
    end
    H1 --> B3
    H2 --> B1
    H3 --> B3
    style B3 fill:#ef5350,stroke:#333
\`\`\`

## Creating and Using Dictionaries

\`\`\`python
# Literal syntax
student = {
    "name": "Alice",
    "age": 20,
    "gpa": 3.8,
}

# Access: O(1)
print(student["name"])       # "Alice"
print(student.get("major"))  # None (safe — no KeyError)
print(student.get("major", "Undeclared"))  # "Undeclared"

# Modify / Add: O(1)
student["major"] = "CS"
student["age"] = 21

# Delete: O(1)
del student["gpa"]

# Check existence: O(1)
print("name" in student)  # True
\`\`\`

## Iterating Over Dictionaries

\`\`\`python
grades = {"Alice": 95, "Bob": 87, "Charlie": 92}

# Keys only (default)
for name in grades:
    print(name)

# Values only
for score in grades.values():
    print(score)

# Both key and value
for name, score in grades.items():
    print(f"\\{name}: \\{score}")
\`\`\`

<!-- voice:key_insight insight="Always use .items() when you need both key and value — it is cleaner and faster than looking up each key" -->

## Java Comparison

\`\`\`java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> grades = new HashMap<>();
grades.put("Alice", 95);
grades.put("Bob", 87);

// Access
int score = grades.getOrDefault("Alice", 0);  // 95

// Iterate
for (Map.Entry<String, Integer> entry : grades.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
\`\`\`

## The Counting Pattern

The single most common dictionary use case: **counting occurrences**.

\`\`\`python
def count_words(text):
    freq = {}
    for word in text.split():
        freq[word] = freq.get(word, 0) + 1
    return freq

print(count_words("the cat and the dog and the fish"))
# {'the': 3, 'cat': 1, 'and': 2, 'dog': 1, 'fish': 1}
\`\`\`

<!-- voice:section_check concept="dict.get(key, 0) + 1 is the counting idiom" -->

\`\`\`mermaid
graph TB
    subgraph "Collision Handling: Chaining"
        H["hash('Alice') = hash('Charlie') = 3"]
        B["Bucket 3"]
        N1["Alice: 95"] -->|"next"| N2["Charlie: 92"] -->|"next"| N3["None"]
        B --> N1
    end
    style B fill:#42a5f5,stroke:#333
    style N1 fill:#66bb6a,stroke:#333
    style N2 fill:#66bb6a,stroke:#333
\`\`\`

## defaultdict and Counter

Python's \`collections\` module provides shortcuts:

\`\`\`python
from collections import defaultdict, Counter

# defaultdict auto-creates missing keys
freq = defaultdict(int)
for word in "the cat and the dog".split():
    freq[word] += 1  # No need for .get()

# Counter does it all in one line
freq = Counter("the cat and the dog".split())
print(freq.most_common(2))  # [('the', 2), ('and', 1)]
\`\`\`

## Try It Yourself

Build a function that groups words by their first letter, and one that merges two dictionaries by summing shared keys.
`,
      starterCode: `def group_by_first_letter(words):
    """
    Group words by their first letter.

    Args:
        words: List of strings

    Returns:
        Dictionary mapping first letter to list of words starting with that letter

    Example:
        >>> group_by_first_letter(["apple", "ant", "bat", "ball"])
        {'a': ['apple', 'ant'], 'b': ['bat', 'ball']}
    """
    # TODO: For each word, get its first letter and add it to the group
    # Hint: Use dict.get(key, []) or check if key exists first
    pass


def merge_dicts(d1, d2):
    """
    Merge two dictionaries. If a key appears in both, sum the values.

    Args:
        d1: First dictionary (string keys, integer values)
        d2: Second dictionary (string keys, integer values)

    Returns:
        Merged dictionary

    Example:
        >>> merge_dicts({"a": 1, "b": 2}, {"b": 3, "c": 4})
        {'a': 1, 'b': 5, 'c': 4}
    """
    # TODO: Start with a copy of d1, then add d2's entries
    # Hint: For shared keys, add the values together
    pass


# ─── Test Cases ───
# Do not modify below this line

print(group_by_first_letter(["apple", "ant", "bat", "ball", "cat"]))
# Expected: {'a': ['apple', 'ant'], 'b': ['bat', 'ball'], 'c': ['cat']}

print(group_by_first_letter([]))
# Expected: {}

print(merge_dicts({"a": 1, "b": 2}, {"b": 3, "c": 4}))
# Expected: {'a': 1, 'b': 5, 'c': 4}

print(merge_dicts({}, {"x": 10}))
# Expected: {'x': 10}

print(merge_dicts({"a": 5}, {}))
# Expected: {'a': 5}
`,
      solutionCode: `def group_by_first_letter(words):
    """
    Group words by their first letter.

    Time Complexity: O(n) — one pass through the word list
    Space Complexity: O(n) — storing all words in groups
    """
    groups = {}
    for word in words:
        letter = word[0]
        if letter not in groups:
            groups[letter] = []
        groups[letter].append(word)
    return groups
    # Alternative: use defaultdict(list)


def merge_dicts(d1, d2):
    """
    Merge two dictionaries. If a key appears in both, sum the values.

    Time Complexity: O(n + m) — iterate through both dicts
    Space Complexity: O(n + m) — new merged dictionary
    """
    result = dict(d1)  # Copy d1
    for key, value in d2.items():
        result[key] = result.get(key, 0) + value
    return result


# ─── Test Cases ───
# Do not modify below this line

print(group_by_first_letter(["apple", "ant", "bat", "ball", "cat"]))
# Expected: {'a': ['apple', 'ant'], 'b': ['bat', 'ball'], 'c': ['cat']}

print(group_by_first_letter([]))
# Expected: {}

print(merge_dicts({"a": 1, "b": 2}, {"b": 3, "c": 4}))
# Expected: {'a': 1, 'b': 5, 'c': 4}

print(merge_dicts({}, {"x": 10}))
# Expected: {'x': 10}

print(merge_dicts({"a": 5}, {}))
# Expected: {'a': 5}
`,
    },

    // ─── Lesson 2: Sets — Fast Membership Testing ───
    {
      id: "sets-fast-membership",
      slug: "sets-fast-membership",
      title: "Sets: Fast Membership Testing",
      content: `## What Is a Set?

A **set** is an unordered collection of **unique elements**. Like a dictionary, it uses hashing for O(1) lookups — but it only stores keys, no values.

Think of it as a dictionary where you only care about "is this key present?" and not what value it maps to.

\`\`\`python
# Creating sets
colors = {"red", "blue", "green"}
numbers = set([1, 2, 3, 2, 1])  # Duplicates removed: {1, 2, 3}
empty = set()  # NOT {} — that creates an empty dict!
\`\`\`

<!-- voice:section_check concept="sets store unique elements with O(1) lookup" -->
## Set Operations

\`\`\`python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

# Membership: O(1) — this is the killer feature
print(3 in a)        # True
print(7 in a)        # False

# Union: elements in either set
print(a | b)         # {1, 2, 3, 4, 5, 6}
print(a.union(b))    # same

# Intersection: elements in both sets
print(a & b)         # {3, 4}
print(a.intersection(b))

# Difference: elements in a but not b
print(a - b)         # {1, 2}

# Symmetric difference: elements in one but not both
print(a ^ b)         # {1, 2, 5, 6}
\`\`\`

## List vs Set for Membership Testing

\`\`\`python
# Searching in a list: O(n)
big_list = list(range(1_000_000))
print(999_999 in big_list)  # Checks up to 1M elements

# Searching in a set: O(1)
big_set = set(range(1_000_000))
print(999_999 in big_set)   # Instant, regardless of size
\`\`\`

| Operation | List | Set |
|-----------|------|-----|
| Check membership | O(n) | O(1) |
| Add element | O(1) append | O(1) |
| Remove element | O(n) | O(1) |
| Duplicates | Allowed | Automatic dedup |

<!-- voice:key_insight insight="Convert a list to a set when you need repeated membership checks — it turns O(n) lookups into O(1)" -->

## Java Comparison

\`\`\`java
import java.util.HashSet;
import java.util.Set;

Set<Integer> nums = new HashSet<>();
nums.add(1);
nums.add(2);
nums.add(2);  // Duplicate ignored
System.out.println(nums.contains(1));  // true
System.out.println(nums.size());       // 2
\`\`\`

## Common Set Patterns

### 1. Finding duplicates

\`\`\`python
def has_duplicates(lst):
    return len(lst) != len(set(lst))
\`\`\`

### 2. Finding common elements

\`\`\`python
list1 = [1, 2, 3, 4]
list2 = [3, 4, 5, 6]
common = set(list1) & set(list2)  # {3, 4}
\`\`\`

### 3. Removing duplicates while preserving order

\`\`\`python
def unique_ordered(lst):
    seen = set()
    result = []
    for item in lst:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result
\`\`\`

<!-- voice:section_check concept="set intersection finds common elements in O(n)" -->

## Try It Yourself

Implement functions to find the intersection and unique elements of two lists.
`,
      starterCode: `def find_common(list1, list2):
    """
    Find all elements that appear in BOTH lists. No duplicates in result.

    Args:
        list1: First list of elements
        list2: Second list of elements

    Returns:
        Sorted list of common elements

    Example:
        >>> find_common([1, 2, 3, 4], [3, 4, 5, 6])
        [3, 4]
    """
    # TODO: Use sets to find the intersection efficiently
    # Hint: Convert to sets, use &, then sort the result
    pass


def first_unique_char(s):
    """
    Find the index of the first non-repeating character in a string.
    Return -1 if all characters repeat.

    Args:
        s: Input string

    Returns:
        Index of first unique character, or -1

    Example:
        >>> first_unique_char("leetcode")
        0  # 'l' is the first non-repeating character
        >>> first_unique_char("aabb")
        -1
    """
    # TODO: Count character frequencies, then find the first with count 1
    # Hint: Use a dictionary for counting, then iterate the string again
    pass


# ─── Test Cases ───
# Do not modify below this line

print(find_common([1, 2, 3, 4], [3, 4, 5, 6]))
# Expected: [3, 4]

print(find_common([1, 2], [3, 4]))
# Expected: []

print(find_common([1, 1, 2, 2], [2, 2, 3, 3]))
# Expected: [2]

print(first_unique_char("leetcode"))
# Expected: 0

print(first_unique_char("aabb"))
# Expected: -1

print(first_unique_char("aabbc"))
# Expected: 4
`,
      solutionCode: `def find_common(list1, list2):
    """
    Find all elements that appear in BOTH lists. No duplicates in result.

    Time Complexity: O(n + m) — convert to sets + intersection
    Space Complexity: O(n + m) — storing both sets
    """
    return sorted(set(list1) & set(list2))


def first_unique_char(s):
    """
    Find the index of the first non-repeating character in a string.

    Time Complexity: O(n) — two passes through the string
    Space Complexity: O(k) — k unique characters (at most 26 for lowercase)
    """
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1

    for i, char in enumerate(s):
        if freq[char] == 1:
            return i

    return -1


# ─── Test Cases ───
# Do not modify below this line

print(find_common([1, 2, 3, 4], [3, 4, 5, 6]))
# Expected: [3, 4]

print(find_common([1, 2], [3, 4]))
# Expected: []

print(find_common([1, 1, 2, 2], [2, 2, 3, 3]))
# Expected: [2]

print(first_unique_char("leetcode"))
# Expected: 0

print(first_unique_char("aabb"))
# Expected: -1

print(first_unique_char("aabbc"))
# Expected: 4
`,
    },

    // ─── Lesson 3: The Complement Pattern (Two Sum) ───
    {
      id: "complement-pattern",
      slug: "complement-pattern",
      title: "The Complement Pattern",
      content: `## The Most Important Hash Map Pattern

If you learn ONE hash map technique, learn this one. The **complement pattern** is the foundation for dozens of coding interview questions. It turns an O(n^2) brute-force search into an O(n) single pass.

<!-- voice:section_check concept="complement pattern idea" -->
## The Problem: Two Sum

Given an array of numbers and a target, find two numbers that add up to the target.

\`\`\`
Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]  (because nums[0] + nums[1] = 2 + 7 = 9)
\`\`\`

## The Brute Force (Slow)

Check every pair — O(n^2):

\`\`\`python
# DON'T do this in an interview
def two_sum_brute(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return [-1, -1]
\`\`\`

For 10,000 elements, that's ~50 million comparisons. We can do better.

## The Insight

For each number, you already KNOW what its partner must be:

\`\`\`
If target = 9 and current number = 2
Then I need: 9 - 2 = 7  ← this is the "complement"
\`\`\`

Instead of checking every pair, ask: **"Have I already seen the complement?"**

A hash map answers that in O(1).

<!-- voice:key_insight insight="The complement pattern turns O(n^2) nested loops into O(n) using a hash map" -->

## The Solution

\`\`\`python
def two_sum(nums, target):
    seen = {}  # value -> index

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:       # O(1) lookup
            return [seen[complement], i]

        seen[num] = i                # Remember this number

    return [-1, -1]
\`\`\`

**Walk through with [2, 7, 11, 15], target = 9:**

| Step | num | complement | seen so far | Found? |
|------|-----|-----------|-------------|--------|
| 0 | 2 | 7 | {} | No -> add {2: 0} |
| 1 | 7 | 2 | {2: 0} | Yes! Return [0, 1] |

Two steps instead of six pairs. O(n) vs O(n^2).

## Java Version

\`\`\`java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{-1, -1};
}
\`\`\`

<!-- voice:section_check concept="same pattern works in every language" -->

## Beyond Two Sum

The complement pattern generalizes to many problems:
- **Two Sum** — complement = target - num
- **Two Sum II (sorted)** — can also use two pointers
- **Subarray Sum Equals K** — complement = prefix_sum - k
- **Pair with Given Difference** — complement = num + diff or num - diff

## Try It Yourself

Implement two_sum and a variation that returns ALL pairs (not just the first).
`,
      starterCode: `def two_sum(nums, target):
    """
    Find two numbers that add up to target. Return their indices.

    Args:
        nums: List of integers
        target: Target sum

    Returns:
        [i, j] where nums[i] + nums[j] == target, or [-1, -1]

    Example:
        >>> two_sum([2, 7, 11, 15], 9)
        [0, 1]

    Must be O(n) — use a hash map, no nested loops.
    """
    # TODO: Use a dictionary to map value -> index
    # For each num, check if (target - num) is already in the dict
    pass


def two_sum_all_pairs(nums, target):
    """
    Find ALL unique pairs of values that add up to target.
    Each pair should be sorted, and no duplicate pairs in the result.

    Args:
        nums: List of integers
        target: Target sum

    Returns:
        List of [a, b] pairs where a + b == target and a <= b

    Example:
        >>> two_sum_all_pairs([1, 2, 3, 4, 5, 6], 7)
        [[1, 6], [2, 5], [3, 4]]
    """
    # TODO: Use a set to track numbers seen
    # Use another set to track pairs already found (to avoid duplicates)
    pass


# ─── Test Cases ───
# Do not modify below this line

print(two_sum([2, 7, 11, 15], 9))
# Expected: [0, 1]

print(two_sum([3, 2, 4], 6))
# Expected: [1, 2]

print(two_sum([3, 3], 6))
# Expected: [0, 1]

print(two_sum([1, 2, 3], 10))
# Expected: [-1, -1]

print(two_sum_all_pairs([1, 2, 3, 4, 5, 6], 7))
# Expected: [[1, 6], [2, 5], [3, 4]]

print(two_sum_all_pairs([1, 1, 2, 2, 3, 3], 4))
# Expected: [[1, 3], [2, 2]]

print(two_sum_all_pairs([5], 10))
# Expected: []
`,
      solutionCode: `def two_sum(nums, target):
    """
    Find two numbers that add up to target. Return their indices.

    Time Complexity: O(n) — single pass
    Space Complexity: O(n) — hash map storage
    """
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return [-1, -1]


def two_sum_all_pairs(nums, target):
    """
    Find ALL unique pairs of values that add up to target.

    Time Complexity: O(n) — single pass + set operations
    Space Complexity: O(n) — sets for tracking
    """
    seen = set()
    found_pairs = set()
    result = []

    for num in nums:
        complement = target - num
        if complement in seen:
            pair = (min(num, complement), max(num, complement))
            if pair not in found_pairs:
                found_pairs.add(pair)
                result.append([pair[0], pair[1]])
        seen.add(num)

    result.sort()
    return result


# ─── Test Cases ───
# Do not modify below this line

print(two_sum([2, 7, 11, 15], 9))
# Expected: [0, 1]

print(two_sum([3, 2, 4], 6))
# Expected: [1, 2]

print(two_sum([3, 3], 6))
# Expected: [0, 1]

print(two_sum([1, 2, 3], 10))
# Expected: [-1, -1]

print(two_sum_all_pairs([1, 2, 3, 4, 5, 6], 7))
# Expected: [[1, 6], [2, 5], [3, 4]]

print(two_sum_all_pairs([1, 1, 2, 2, 3, 3], 4))
# Expected: [[1, 3], [2, 2]]

print(two_sum_all_pairs([5], 10))
# Expected: []
`,
    },

    // ─── Lesson 4: Module Checkpoint ───
    {
      id: "hash-maps-sets-checkpoint",
      slug: "hash-maps-sets-checkpoint",
      title: "Module Checkpoint: Hash Maps & Sets",
      content: `## Excellent Work!

You've completed the Hash Maps & Sets module. These are the data structures you'll reach for most often in real code and interviews.

<!-- voice:section_check concept="module recap" -->
## What You've Mastered

1. **Dictionary Fundamentals** — O(1) insert, lookup, delete; the counting pattern with \`dict.get()\`
2. **Sets** — O(1) membership testing, union/intersection/difference, deduplication
3. **The Complement Pattern** — turning O(n^2) pair search into O(n) with a hash map

## Quick Quiz

**Question 1:** What is the difference between a dictionary and a set in Python?

A) Dictionaries are ordered, sets are not
B) Dictionaries store key-value pairs, sets store only keys
C) Sets are faster than dictionaries
D) Dictionaries allow duplicates, sets do not

**Question 2:** What does this code print?

\`\`\`python
s = {1, 2, 3}
s.add(2)
s.add(4)
print(len(s))
\`\`\`

A) 3
B) 4
C) 5
D) Error

**Question 3:** You need to check if a user ID exists in a list of 10 million IDs, and you'll do this check thousands of times. What should you do first?

A) Sort the list and use binary search
B) Convert the list to a set
C) Use a for loop each time
D) Convert to a dictionary

**Question 4:** Explain in your own words why the complement pattern works. What role does the hash map play?

**Question 5:** What is the output of:

\`\`\`python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a - b)
print(a & b)
\`\`\`

A) \`{1, 2}\` and \`{3, 4}\`
B) \`{3, 4}\` and \`{1, 2}\`
C) \`{1, 2, 5, 6}\` and \`{3, 4}\`
D) \`{5, 6}\` and \`{3, 4}\`

## Voice Summary

Summarize the three big ideas from this module: dictionary operations, set operations, and the complement pattern. When would you choose a set over a dictionary?
`,
    },
  ],
};
