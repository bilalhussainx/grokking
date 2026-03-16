import { Module } from "../types";

export const hashTablesModule: Module = {
  id: "ds-hash-tables",
  title: "Hash Tables",
  description: "Understand hash tables inside and out — from building one from scratch to solving classic interview patterns.",
  lessons: [
    {
      id: "ds-hash-intro",
      slug: "intro-hash-tables",
      title: "Intro to Hash Tables",
      content: `## Intro to Hash Tables

Hash tables are arguably the single most important data structure for coding interviews. They provide average O(1) lookup, insertion, and deletion — making them the go-to choice for optimizing brute-force solutions.

### How Hash Tables Work

A hash table maps **keys** to **values** using a **hash function**. The hash function converts a key into an integer index, which determines where the value is stored in an underlying array.

\`\`\`
key → hash_function(key) → index → array[index] = value
\`\`\`

### Python's dict and set

In Python, \`dict\` is a hash table mapping keys to values. \`set\` is a hash table storing only keys (no values). Both provide O(1) average operations.

| Operation | dict | set |
|-----------|------|-----|
| Lookup | O(1) avg | O(1) avg |
| Insert | O(1) avg | O(1) avg |
| Delete | O(1) avg | O(1) avg |
| Iterate | O(n) | O(n) |

### What Makes a Good Hash Function?

1. **Deterministic**: Same input always produces the same output.
2. **Uniform distribution**: Spreads keys evenly across the array.
3. **Fast to compute**: The speed benefit is lost if hashing is slow.

Python uses a built-in hash for strings and numbers. For custom objects, you implement \`__hash__\` and \`__eq__\`.

### When to Reach for a Hash Table

- **Need O(1) lookup**: "Have I seen this element before?"
- **Counting frequencies**: "How many times does each element appear?"
- **Grouping**: "Which elements share a property?"
- **Caching**: "Store computed results for reuse" (memoization).
- **Two-sum pattern**: "Find two elements with a specific relationship."

### Hash Table vs. Sorting

Many problems can be solved with either hashing (O(n) time, O(n) space) or sorting (O(n log n) time, O(1) space). In interviews, mention both approaches and discuss the tradeoff.

### Common Pitfall: Mutable Keys

In Python, only **immutable** types can be dict keys or set members. Lists and dicts cannot be keys. Convert lists to tuples first.

Implement a function that finds the first non-repeating character and check for valid anagrams.`,
      starterCode: `def first_unique_char(s: str) -> int:
    """
    Find the index of the first non-repeating character in a string.
    Return -1 if none exists.

    Time: O(n), Space: O(1) — at most 26 lowercase letters
    """
    # TODO: Count frequency of each character using a dict
    # TODO: Second pass — find first char with count == 1
    pass


def is_anagram(s: str, t: str) -> bool:
    """
    Check if t is an anagram of s.

    Time: O(n), Space: O(1)
    """
    # TODO: If lengths differ, return False
    # TODO: Count characters in s, decrement for t
    # TODO: All counts should be 0
    pass


def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Return indices of two numbers that add up to target.
    Exactly one solution exists.

    Time: O(n), Space: O(n)
    """
    # TODO: Use a hash map {value: index}
    # TODO: For each number, check if complement exists
    pass


# Test cases
print(first_unique_char("leetcode"))    # 0
print(first_unique_char("loveleetcode"))# 2
print(first_unique_char("aabb"))        # -1

print(is_anagram("anagram", "nagaram")) # True
print(is_anagram("rat", "car"))         # False

print(two_sum([2, 7, 11, 15], 9))      # [0, 1]
print(two_sum([3, 2, 4], 6))           # [1, 2]
`,
      solutionCode: `def first_unique_char(s: str) -> int:
    """
    Find the index of the first non-repeating character in a string.
    Return -1 if none exists.

    Time: O(n), Space: O(1) — at most 26 lowercase letters
    """
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1

    for i, char in enumerate(s):
        if freq[char] == 1:
            return i
    return -1


def is_anagram(s: str, t: str) -> bool:
    """
    Check if t is an anagram of s.

    Time: O(n), Space: O(1)
    """
    if len(s) != len(t):
        return False

    counts = {}
    for char in s:
        counts[char] = counts.get(char, 0) + 1
    for char in t:
        counts[char] = counts.get(char, 0) - 1
        if counts[char] < 0:
            return False
    return True


def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Return indices of two numbers that add up to target.
    Exactly one solution exists.

    Time: O(n), Space: O(n)
    """
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []


# Test cases
print(first_unique_char("leetcode"))    # 0
print(first_unique_char("loveleetcode"))# 2
print(first_unique_char("aabb"))        # -1

print(is_anagram("anagram", "nagaram")) # True
print(is_anagram("rat", "car"))         # False

print(two_sum([2, 7, 11, 15], 9))      # [0, 1]
print(two_sum([3, 2, 4], 6))           # [1, 2]
`,
    },
    {
      id: "ds-hashmap-scratch",
      slug: "implementing-hashmap",
      title: "Implementing HashMap from Scratch",
      content: `## Implementing HashMap from Scratch

Building a hash map from scratch is a classic interview question at top companies. It tests your understanding of hashing, arrays, linked lists, and dynamic resizing.

### Core Components

1. **Hash function**: Converts a key to an array index.
2. **Bucket array**: Stores key-value pairs at computed indices.
3. **Collision handling**: Strategy for when two keys hash to the same index.
4. **Load factor**: Ratio of entries to buckets — triggers resizing.

### Design Decisions

We'll build a hash map using **separate chaining** (each bucket is a linked list of key-value pairs). This is the most common approach and the one Python's dict historically used.

**Hash function**: \`hash(key) % capacity\` gives us a valid index. Python's built-in \`hash()\` handles the heavy lifting.

**Resizing**: When load factor exceeds a threshold (typically 0.75), double the capacity and rehash all entries. This keeps average chain length short.

### Step-by-Step Implementation

1. Initialize with an array of empty lists (buckets).
2. **put(key, value)**: Hash the key, find the bucket, scan for existing key, insert or update.
3. **get(key)**: Hash the key, find the bucket, scan for the key, return value or default.
4. **remove(key)**: Hash the key, find the bucket, scan and remove.
5. **resize()**: Create a new larger array, rehash all existing pairs.

### Complexity Analysis

| Operation | Average | Worst (all collisions) |
|-----------|---------|----------------------|
| put | O(1) | O(n) |
| get | O(1) | O(n) |
| remove | O(1) | O(n) |
| resize | O(n) | O(n) |

The worst case happens when all keys hash to the same bucket. Good hash functions and resizing prevent this in practice.

### Interview Tips

- Mention the load factor and resizing — this shows deeper understanding.
- Know that Java's HashMap switches from linked lists to balanced trees when a bucket exceeds 8 entries.
- Python's dict uses open addressing (not chaining) since Python 3.6, but chaining is simpler to implement.

Build a complete HashMap class with put, get, remove, and automatic resizing.`,
      starterCode: `class HashMap:
    """
    Hash Map implementation using separate chaining.
    """

    def __init__(self, capacity: int = 8):
        """Initialize with given capacity."""
        # TODO: Set capacity and size
        # TODO: Create bucket array (list of empty lists)
        pass

    def _hash(self, key) -> int:
        """Compute bucket index for a key."""
        # TODO: Return hash(key) % self.capacity
        pass

    def put(self, key, value) -> None:
        """Insert or update a key-value pair."""
        # TODO: Compute bucket index
        # TODO: Search bucket for existing key — update if found
        # TODO: If not found, append new pair and increment size
        # TODO: Check load factor and resize if needed
        pass

    def get(self, key, default=None):
        """Get value by key, return default if not found."""
        # TODO: Compute bucket index
        # TODO: Search bucket for key
        # TODO: Return value if found, default otherwise
        pass

    def remove(self, key) -> bool:
        """Remove a key-value pair. Return True if found."""
        # TODO: Compute bucket index
        # TODO: Search bucket for key
        # TODO: Remove pair if found, decrement size, return True
        # TODO: Return False if not found
        pass

    def _resize(self) -> None:
        """Double capacity and rehash all entries."""
        # TODO: Save old buckets
        # TODO: Double capacity, reset size, create new buckets
        # TODO: Re-insert all old pairs using put()
        pass

    def __len__(self) -> int:
        return self.size


# Test cases
hm = HashMap()
hm.put("apple", 1)
hm.put("banana", 2)
hm.put("cherry", 3)
print(hm.get("banana"))      # 2
print(hm.get("grape"))       # None
hm.put("banana", 20)         # Update existing
print(hm.get("banana"))      # 20
hm.remove("banana")
print(hm.get("banana"))      # None
print(len(hm))               # 2

# Test resizing by adding many entries
for i in range(20):
    hm.put(f"key_{i}", i)
print(len(hm))               # 22
print(hm.get("key_15"))      # 15
`,
      solutionCode: `class HashMap:
    """
    Hash Map implementation using separate chaining.
    """

    def __init__(self, capacity: int = 8):
        """Initialize with given capacity."""
        self.capacity = capacity
        self.size = 0
        self.buckets = [[] for _ in range(capacity)]

    def _hash(self, key) -> int:
        """Compute bucket index for a key."""
        return hash(key) % self.capacity

    def put(self, key, value) -> None:
        """Insert or update a key-value pair."""
        idx = self._hash(key)
        bucket = self.buckets[idx]

        # Check if key already exists — update value
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return

        # Key not found — insert new pair
        bucket.append((key, value))
        self.size += 1

        # Resize if load factor exceeds 0.75
        if self.size / self.capacity > 0.75:
            self._resize()

    def get(self, key, default=None):
        """Get value by key, return default if not found."""
        idx = self._hash(key)
        bucket = self.buckets[idx]

        for k, v in bucket:
            if k == key:
                return v
        return default

    def remove(self, key) -> bool:
        """Remove a key-value pair. Return True if found."""
        idx = self._hash(key)
        bucket = self.buckets[idx]

        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket.pop(i)
                self.size -= 1
                return True
        return False

    def _resize(self) -> None:
        """Double capacity and rehash all entries."""
        old_buckets = self.buckets
        self.capacity *= 2
        self.size = 0
        self.buckets = [[] for _ in range(self.capacity)]

        # Re-insert all pairs from old buckets
        for bucket in old_buckets:
            for key, value in bucket:
                self.put(key, value)

    def __len__(self) -> int:
        return self.size


# Test cases
hm = HashMap()
hm.put("apple", 1)
hm.put("banana", 2)
hm.put("cherry", 3)
print(hm.get("banana"))      # 2
print(hm.get("grape"))       # None
hm.put("banana", 20)         # Update existing
print(hm.get("banana"))      # 20
hm.remove("banana")
print(hm.get("banana"))      # None
print(len(hm))               # 2

# Test resizing by adding many entries
for i in range(20):
    hm.put(f"key_{i}", i)
print(len(hm))               # 22
print(hm.get("key_15"))      # 15
`,
    },
    {
      id: "ds-collision-resolution",
      slug: "collision-resolution",
      title: "Collision Resolution",
      content: `## Collision Resolution

Collisions are inevitable in hash tables — the pigeonhole principle guarantees it when we map a large key space to a smaller array. How we handle collisions determines performance.

### Separate Chaining (Closed Addressing)

Each bucket holds a **linked list** (or any collection) of all entries that hash to that index. We implemented this in the previous lesson.

**Pros**: Simple, graceful degradation, deletion is easy.
**Cons**: Extra memory for pointers, cache-unfriendly (scattered memory access).

### Open Addressing (Closed Hashing)

All entries live inside the array itself. When a collision occurs, we **probe** for the next available slot. Three common probing strategies:

#### 1. Linear Probing
Check the next slot: \`(hash + i) % capacity\` for i = 1, 2, 3, ...

**Problem**: **Primary clustering** — consecutive filled slots form clusters that grow, making future insertions slower.

#### 2. Quadratic Probing
Check: \`(hash + i^2) % capacity\` for i = 1, 2, 3, ...

**Advantage**: Reduces primary clustering.
**Problem**: **Secondary clustering** — keys that hash to the same slot follow the same probe sequence.

#### 3. Double Hashing
Use a second hash function: \`(hash1 + i * hash2) % capacity\`

**Advantage**: Minimizes both types of clustering.
**Requirement**: hash2 must never return 0 and should be coprime with capacity.

### Deletion in Open Addressing

You cannot simply empty a slot — it would break probe sequences for later insertions. Instead, use a **tombstone** marker. During lookup, skip tombstones. During insertion, you can reuse tombstone slots.

### Load Factor Impact

| Load Factor | Avg Probes (Linear) | Avg Probes (Double Hash) |
|------------|-------------------|------------------------|
| 0.5 | 1.5 | 1.4 |
| 0.75 | 2.5 | 1.8 |
| 0.9 | 5.5 | 2.6 |
| 0.95 | 10.5 | 3.2 |

This is why we resize well before the table fills up.

### Real-World Usage

- Python dict: Open addressing with custom probing
- Java HashMap: Separate chaining (lists → trees at 8 entries)
- C++ unordered_map: Separate chaining

Implement a hash table using open addressing with linear probing.`,
      starterCode: `class OpenAddressHashMap:
    """
    Hash Map using open addressing with linear probing.
    """
    EMPTY = None
    DELETED = "__DELETED__"  # Tombstone marker

    def __init__(self, capacity: int = 8):
        # TODO: Initialize keys and values arrays with EMPTY
        # TODO: Set capacity and size
        pass

    def _hash(self, key) -> int:
        return hash(key) % self.capacity

    def put(self, key, value) -> None:
        """Insert or update key-value pair using linear probing."""
        # TODO: Resize if load factor > 0.5
        # TODO: Find the correct slot using linear probing
        #   - Skip DELETED tombstones during search
        #   - If key found, update value
        #   - If empty slot found, insert new pair
        pass

    def get(self, key, default=None):
        """Get value by key using linear probing."""
        # TODO: Probe until we find the key or an EMPTY slot
        # TODO: Skip DELETED tombstones during search
        pass

    def remove(self, key) -> bool:
        """Remove key-value pair, leaving a tombstone."""
        # TODO: Find the key using linear probing
        # TODO: Replace with DELETED tombstone
        pass

    def _resize(self) -> None:
        """Double capacity and rehash all non-deleted entries."""
        # TODO: Save old keys and values
        # TODO: Reset with doubled capacity
        # TODO: Re-insert all valid (non-EMPTY, non-DELETED) entries
        pass


# Test cases
hm = OpenAddressHashMap()
hm.put("a", 1)
hm.put("b", 2)
hm.put("c", 3)
print(hm.get("b"))       # 2
hm.remove("b")
print(hm.get("b"))       # None
hm.put("d", 4)           # Should work after deletion
print(hm.get("d"))       # 4
print(hm.get("a"))       # 1 (still accessible)

# Stress test with many insertions
for i in range(50):
    hm.put(i, i * 10)
print(hm.get(25))        # 250
print(hm.get(49))        # 490
`,
      solutionCode: `class OpenAddressHashMap:
    """
    Hash Map using open addressing with linear probing.
    """
    EMPTY = None
    DELETED = "__DELETED__"  # Tombstone marker

    def __init__(self, capacity: int = 8):
        self.capacity = capacity
        self.size = 0
        self.keys = [self.EMPTY] * capacity
        self.values = [self.EMPTY] * capacity

    def _hash(self, key) -> int:
        return hash(key) % self.capacity

    def put(self, key, value) -> None:
        """Insert or update key-value pair using linear probing."""
        if self.size / self.capacity > 0.5:
            self._resize()

        idx = self._hash(key)
        first_deleted = -1  # Track first tombstone for reuse

        for _ in range(self.capacity):
            if self.keys[idx] is self.EMPTY:
                # Use tombstone slot if we passed one
                if first_deleted != -1:
                    idx = first_deleted
                self.keys[idx] = key
                self.values[idx] = value
                self.size += 1
                return
            elif self.keys[idx] == self.DELETED:
                if first_deleted == -1:
                    first_deleted = idx
            elif self.keys[idx] == key:
                # Key exists — update value
                self.values[idx] = value
                return
            idx = (idx + 1) % self.capacity

        # Should not reach here if load factor is managed
        if first_deleted != -1:
            self.keys[first_deleted] = key
            self.values[first_deleted] = value
            self.size += 1

    def get(self, key, default=None):
        """Get value by key using linear probing."""
        idx = self._hash(key)

        for _ in range(self.capacity):
            if self.keys[idx] is self.EMPTY:
                return default  # Key not in table
            elif self.keys[idx] == key:
                return self.values[idx]
            # Skip DELETED tombstones — keep probing
            idx = (idx + 1) % self.capacity

        return default

    def remove(self, key) -> bool:
        """Remove key-value pair, leaving a tombstone."""
        idx = self._hash(key)

        for _ in range(self.capacity):
            if self.keys[idx] is self.EMPTY:
                return False
            elif self.keys[idx] == key:
                self.keys[idx] = self.DELETED
                self.values[idx] = self.EMPTY
                self.size -= 1
                return True
            idx = (idx + 1) % self.capacity

        return False

    def _resize(self) -> None:
        """Double capacity and rehash all non-deleted entries."""
        old_keys = self.keys
        old_values = self.values
        self.capacity *= 2
        self.size = 0
        self.keys = [self.EMPTY] * self.capacity
        self.values = [self.EMPTY] * self.capacity

        for i in range(len(old_keys)):
            if old_keys[i] is not self.EMPTY and old_keys[i] != self.DELETED:
                self.put(old_keys[i], old_values[i])


# Test cases
hm = OpenAddressHashMap()
hm.put("a", 1)
hm.put("b", 2)
hm.put("c", 3)
print(hm.get("b"))       # 2
hm.remove("b")
print(hm.get("b"))       # None
hm.put("d", 4)           # Should work after deletion
print(hm.get("d"))       # 4
print(hm.get("a"))       # 1 (still accessible)

# Stress test with many insertions
for i in range(50):
    hm.put(i, i * 10)
print(hm.get(25))        # 250
print(hm.get(49))        # 490
`,
    },
    {
      id: "ds-frequency-counting",
      slug: "frequency-counting-patterns",
      title: "Frequency Counting Patterns",
      content: `## Frequency Counting Patterns

Frequency counting with hash maps is the backbone of dozens of interview problems. Master these patterns and you'll recognize them instantly.

### Pattern 1: Simple Frequency Count

Count occurrences of each element. Used in anagram checking, majority element, top K frequent.

\`\`\`python
from collections import Counter
freq = Counter(nums)  # or build manually with dict
\`\`\`

### Pattern 2: Sliding Window + Frequency

Maintain a frequency map for the current window. As the window slides, add the new element and remove the old one. Used in:
- Minimum window substring
- Longest substring without repeating characters
- Permutation in string

### Pattern 3: Frequency of Frequencies

Sometimes you need to count how many elements have a given frequency. Example: "single number" (find element appearing exactly once).

### The Majority Element Problem

Find the element that appears more than n/2 times. Three approaches:
1. **Hash map**: Count frequencies, return the one > n/2. O(n) time, O(n) space.
2. **Sorting**: Sort and return middle element. O(n log n) time, O(1) space.
3. **Boyer-Moore Voting**: O(n) time, O(1) space — the optimal solution.

Boyer-Moore works by maintaining a candidate and a count. If count drops to 0, pick a new candidate. The majority element will always survive because it appears more than all others combined.

### Top K Frequent Elements

Find the k most frequent elements. Approaches:
1. Hash map + sort: O(n log n)
2. Hash map + heap: O(n log k) — better when k << n
3. Hash map + bucket sort: O(n) — optimal

Bucket sort approach: Create an array of size n+1 where index i holds elements with frequency i. Then scan from the end to get top K.

### Interview Tips

- \`collections.Counter\` is allowed in Python interviews — use it to save time.
- Always mention the space-time tradeoff: hash map approaches use O(n) space.
- Boyer-Moore Voting is a favorite follow-up question.

Implement majority element (Boyer-Moore) and top K frequent elements (bucket sort).`,
      starterCode: `def majority_element(nums: list[int]) -> int:
    """
    Find the element appearing more than n/2 times.
    Guaranteed to exist.

    Boyer-Moore Voting Algorithm.
    Time: O(n), Space: O(1)
    """
    # TODO: Initialize candidate and count
    # TODO: For each num:
    #   - If count == 0, set new candidate
    #   - If num == candidate, increment count
    #   - Else decrement count
    # TODO: Return candidate
    pass


def top_k_frequent(nums: list[int], k: int) -> list[int]:
    """
    Return the k most frequent elements.

    Approach: Frequency count + bucket sort.
    Time: O(n), Space: O(n)
    """
    # TODO: Count frequency of each element
    # TODO: Create buckets where index = frequency
    # TODO: Collect top k by scanning buckets from highest to lowest
    pass


def longest_consecutive(nums: list[int]) -> int:
    """
    Find the length of the longest consecutive sequence.
    Example: [100, 4, 200, 1, 3, 2] → 4 (sequence: 1,2,3,4)

    Time: O(n), Space: O(n)
    """
    # TODO: Put all numbers in a set
    # TODO: For each number that is a sequence START (num-1 not in set):
    #   - Count consecutive numbers from that start
    #   - Update max length
    pass


# Test cases
print(majority_element([3, 2, 3]))            # 3
print(majority_element([2, 2, 1, 1, 1, 2, 2]))# 2

print(top_k_frequent([1,1,1,2,2,3], 2))       # [1, 2]
print(top_k_frequent([1], 1))                  # [1]

print(longest_consecutive([100, 4, 200, 1, 3, 2]))  # 4
print(longest_consecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]))  # 9
`,
      solutionCode: `def majority_element(nums: list[int]) -> int:
    """
    Find the element appearing more than n/2 times.
    Guaranteed to exist.

    Boyer-Moore Voting Algorithm.
    Time: O(n), Space: O(1)
    """
    candidate = None
    count = 0

    for num in nums:
        if count == 0:
            candidate = num
        if num == candidate:
            count += 1
        else:
            count -= 1

    return candidate


def top_k_frequent(nums: list[int], k: int) -> list[int]:
    """
    Return the k most frequent elements.

    Approach: Frequency count + bucket sort.
    Time: O(n), Space: O(n)
    """
    # Step 1: Count frequencies
    freq = {}
    for num in nums:
        freq[num] = freq.get(num, 0) + 1

    # Step 2: Create buckets (index = frequency)
    # Maximum frequency is len(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, count in freq.items():
        buckets[count].append(num)

    # Step 3: Collect top k from highest frequency down
    result = []
    for i in range(len(buckets) - 1, 0, -1):
        for num in buckets[i]:
            result.append(num)
            if len(result) == k:
                return result

    return result


def longest_consecutive(nums: list[int]) -> int:
    """
    Find the length of the longest consecutive sequence.
    Example: [100, 4, 200, 1, 3, 2] → 4 (sequence: 1,2,3,4)

    Time: O(n), Space: O(n)
    """
    num_set = set(nums)
    max_length = 0

    for num in num_set:
        # Only start counting from the beginning of a sequence
        if num - 1 not in num_set:
            current = num
            length = 1
            while current + 1 in num_set:
                current += 1
                length += 1
            max_length = max(max_length, length)

    return max_length


# Test cases
print(majority_element([3, 2, 3]))            # 3
print(majority_element([2, 2, 1, 1, 1, 2, 2]))# 2

print(top_k_frequent([1,1,1,2,2,3], 2))       # [1, 2]
print(top_k_frequent([1], 1))                  # [1]

print(longest_consecutive([100, 4, 200, 1, 3, 2]))  # 4
print(longest_consecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]))  # 9
`,
    },
    {
      id: "ds-group-anagrams",
      slug: "group-anagrams",
      title: "Group Anagrams",
      content: `## Group Anagrams

Group Anagrams is a classic hash table problem that tests your ability to design a good hash key. It combines frequency counting with grouping — two fundamental hash table skills.

### Problem Statement

Given an array of strings, group the anagrams together. An anagram uses exactly the same letters with the same frequencies but in a different order.

\`\`\`
Input:  ["eat", "tea", "tan", "ate", "nat", "bat"]
Output: [["eat","tea","ate"], ["tan","nat"], ["bat"]]
\`\`\`

### Key Insight: Canonical Form

Two strings are anagrams if and only if they have the same **canonical form**. We need a way to map each string to a key that's the same for all its anagrams.

**Approach 1: Sorted string as key**
Sort each string alphabetically. All anagrams sort to the same string.
- "eat" → "aet", "tea" → "aet", "ate" → "aet"
- Time: O(n * k log k) where k is max string length.

**Approach 2: Character count tuple as key**
Count character frequencies and use the tuple as a key.
- "eat" → (1,0,0,0,1,0,...,1,0,0) — counts for each of 26 letters
- Time: O(n * k) — faster for long strings.

### Which Approach to Use?

- If strings are short (typical interview), sorted string is simpler and fast enough.
- If strings are very long, the count tuple avoids O(k log k) sorting.
- In an interview, start with sorted (simpler) and mention the optimization.

### The defaultdict Trick

\`collections.defaultdict(list)\` automatically creates an empty list for new keys, making grouping cleaner:

\`\`\`python
from collections import defaultdict
groups = defaultdict(list)
groups[key].append(string)  # No need to check if key exists
\`\`\`

### Related Problems

- **Valid Anagram**: Check if two strings are anagrams (simpler version).
- **Find All Anagrams in String**: Sliding window + frequency comparison.
- **Minimum Window Substring**: Hardest variant — sliding window with full frequency tracking.

Implement both approaches to group anagrams, plus the sliding window variant to find all anagram positions.`,
      starterCode: `def group_anagrams_sort(strs: list[str]) -> list[list[str]]:
    """
    Group anagrams using sorted string as key.

    Time: O(n * k log k), Space: O(n * k)
    """
    # TODO: Create a dict mapping sorted_string -> list of original strings
    # TODO: For each string, sort it and use as key
    # TODO: Return all groups
    pass


def group_anagrams_count(strs: list[str]) -> list[list[str]]:
    """
    Group anagrams using character count tuple as key.

    Time: O(n * k), Space: O(n * k)
    """
    # TODO: For each string, create a tuple of 26 character counts
    # TODO: Use this tuple as the dict key
    # TODO: Return all groups
    pass


def find_anagrams(s: str, p: str) -> list[int]:
    """
    Find all start indices of p's anagrams in s.

    Example: s = "cbaebabacd", p = "abc" → [0, 6]

    Approach: Sliding window of size len(p).
    Time: O(n), Space: O(1)
    """
    # TODO: Count chars in p
    # TODO: Use sliding window of size len(p) over s
    # TODO: Maintain window char counts
    # TODO: When counts match, record the start index
    pass


# Test cases
print(group_anagrams_sort(["eat","tea","tan","ate","nat","bat"]))
# [["eat","tea","ate"], ["tan","nat"], ["bat"]] (order may vary)

print(group_anagrams_count(["eat","tea","tan","ate","nat","bat"]))
# Same grouping as above

print(find_anagrams("cbaebabacd", "abc"))  # [0, 6]
print(find_anagrams("abab", "ab"))          # [0, 1, 2]
`,
      solutionCode: `def group_anagrams_sort(strs: list[str]) -> list[list[str]]:
    """
    Group anagrams using sorted string as key.

    Time: O(n * k log k), Space: O(n * k)
    """
    groups = {}
    for s in strs:
        key = "".join(sorted(s))
        if key not in groups:
            groups[key] = []
        groups[key].append(s)
    return list(groups.values())


def group_anagrams_count(strs: list[str]) -> list[list[str]]:
    """
    Group anagrams using character count tuple as key.

    Time: O(n * k), Space: O(n * k)
    """
    groups = {}
    for s in strs:
        # Create a count of each character (26 lowercase letters)
        counts = [0] * 26
        for c in s:
            counts[ord(c) - ord('a')] += 1
        key = tuple(counts)  # Tuples are hashable
        if key not in groups:
            groups[key] = []
        groups[key].append(s)
    return list(groups.values())


def find_anagrams(s: str, p: str) -> list[int]:
    """
    Find all start indices of p's anagrams in s.

    Example: s = "cbaebabacd", p = "abc" → [0, 6]

    Approach: Sliding window of size len(p).
    Time: O(n), Space: O(1)
    """
    if len(p) > len(s):
        return []

    result = []
    p_count = [0] * 26
    w_count = [0] * 26

    # Count characters in p
    for c in p:
        p_count[ord(c) - ord('a')] += 1

    # Initialize window with first len(p) characters
    for i in range(len(p)):
        w_count[ord(s[i]) - ord('a')] += 1

    if w_count == p_count:
        result.append(0)

    # Slide the window
    for i in range(len(p), len(s)):
        # Add new character
        w_count[ord(s[i]) - ord('a')] += 1
        # Remove old character
        w_count[ord(s[i - len(p)]) - ord('a')] -= 1

        if w_count == p_count:
            result.append(i - len(p) + 1)

    return result


# Test cases
print(group_anagrams_sort(["eat","tea","tan","ate","nat","bat"]))
# [["eat","tea","ate"], ["tan","nat"], ["bat"]] (order may vary)

print(group_anagrams_count(["eat","tea","tan","ate","nat","bat"]))
# Same grouping as above

print(find_anagrams("cbaebabacd", "abc"))  # [0, 6]
print(find_anagrams("abab", "ab"))          # [0, 1, 2]
`,
    },
    {
      id: "ds-lru-cache",
      slug: "lru-cache",
      title: "LRU Cache Implementation",
      content: `## LRU Cache Implementation

The LRU (Least Recently Used) Cache is one of the most asked system design + coding questions. It combines a hash map with a doubly linked list to achieve O(1) for both get and put.

### What is an LRU Cache?

A cache with fixed capacity. When the cache is full and a new entry needs to be added, the **least recently used** entry is evicted. Both \`get\` and \`put\` operations count as "using" an entry.

### Why Hash Map + Doubly Linked List?

- **Hash map**: O(1) key lookup to find nodes.
- **Doubly linked list**: O(1) removal and insertion at ends. The most recently used node goes to the front; the least recently used is at the back.

### Node Structure

Each node in the doubly linked list stores:
- \`key\`: needed so we can remove the hash map entry during eviction
- \`value\`: the cached data
- \`prev\`, \`next\`: pointers to neighboring nodes

### Sentinel Nodes

Use **dummy head and tail** nodes to simplify edge cases. All real nodes sit between these sentinels. This eliminates null checks when removing or adding nodes.

### Operations

**get(key)**:
1. If key not in hash map, return -1.
2. Move the node to the front (most recent).
3. Return the value.

**put(key, value)**:
1. If key exists, update value and move to front.
2. If key doesn't exist:
   a. Create new node, add to front and hash map.
   b. If over capacity, remove the node just before tail (LRU) and delete from hash map.

### Complexity

| Operation | Time | Space |
|-----------|------|-------|
| get | O(1) | - |
| put | O(1) | - |
| Total space | - | O(capacity) |

### Python Shortcut: OrderedDict

Python's \`collections.OrderedDict\` maintains insertion order and supports \`move_to_end()\` and \`popitem(last=False)\`. You could build LRU in 10 lines. But interviewers want you to build it from scratch.

Implement the full LRU Cache with doubly linked list and hash map.`,
      starterCode: `class ListNode:
    """Doubly linked list node."""
    def __init__(self, key: int = 0, val: int = 0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity: int):
        """
        Initialize LRU cache with given capacity.
        """
        # TODO: Store capacity
        # TODO: Create hash map (key -> node)
        # TODO: Create dummy head and tail sentinel nodes
        # TODO: Link head <-> tail
        pass

    def _remove(self, node: ListNode) -> None:
        """Remove a node from the doubly linked list."""
        # TODO: Update prev and next pointers to skip this node
        pass

    def _add_to_front(self, node: ListNode) -> None:
        """Add a node right after the head sentinel."""
        # TODO: Insert node between head and head.next
        pass

    def get(self, key: int) -> int:
        """
        Get value by key. Return -1 if not found.
        Move accessed node to front (most recent).
        """
        # TODO: If key in map, remove node, add to front, return value
        # TODO: Else return -1
        pass

    def put(self, key: int, value: int) -> None:
        """
        Insert or update key-value pair.
        If over capacity, evict the least recently used entry.
        """
        # TODO: If key exists, remove old node
        # TODO: Create new node, add to front, update map
        # TODO: If over capacity, remove node before tail (LRU)
        #       and delete its key from the map
        pass


# Test cases
cache = LRUCache(2)
cache.put(1, 1)
cache.put(2, 2)
print(cache.get(1))       # 1
cache.put(3, 3)           # Evicts key 2
print(cache.get(2))       # -1 (evicted)
cache.put(4, 4)           # Evicts key 1
print(cache.get(1))       # -1 (evicted)
print(cache.get(3))       # 3
print(cache.get(4))       # 4
`,
      solutionCode: `class ListNode:
    """Doubly linked list node."""
    def __init__(self, key: int = 0, val: int = 0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity: int):
        """
        Initialize LRU cache with given capacity.
        """
        self.capacity = capacity
        self.cache = {}  # key -> ListNode

        # Dummy sentinel nodes
        self.head = ListNode()
        self.tail = ListNode()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: ListNode) -> None:
        """Remove a node from the doubly linked list."""
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_front(self, node: ListNode) -> None:
        """Add a node right after the head sentinel."""
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        """
        Get value by key. Return -1 if not found.
        Move accessed node to front (most recent).
        """
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add_to_front(node)
            return node.val
        return -1

    def put(self, key: int, value: int) -> None:
        """
        Insert or update key-value pair.
        If over capacity, evict the least recently used entry.
        """
        if key in self.cache:
            # Remove existing node
            self._remove(self.cache[key])
            del self.cache[key]

        # Create new node and add to front
        node = ListNode(key, value)
        self._add_to_front(node)
        self.cache[key] = node

        # Evict LRU if over capacity
        if len(self.cache) > self.capacity:
            # LRU node is just before the tail sentinel
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]


# Test cases
cache = LRUCache(2)
cache.put(1, 1)
cache.put(2, 2)
print(cache.get(1))       # 1
cache.put(3, 3)           # Evicts key 2
print(cache.get(2))       # -1 (evicted)
cache.put(4, 4)           # Evicts key 1
print(cache.get(1))       # -1 (evicted)
print(cache.get(3))       # 3
print(cache.get(4))       # 4
`,
    },
  ],
};
