import { Module } from "../types";

export const arraysModule: Module = {
  id: "ap-csa-arrays",
  title: "Arrays",
  description: "Work with fixed-size arrays in Java and lists in Python -- traversal, searching, and common array algorithms.",
  lessons: [
    {
      id: "ap-csa-array-basics",
      slug: "array-basics",
      title: "Array Fundamentals",
      content: `## Array Fundamentals

<!-- voice:key_insight -->

An **array** is a fixed-size, ordered collection of elements of the same type. Arrays are fundamental data structures used in nearly every program.

### Java vs. Python

**Java arrays have a fixed size:**
\`\`\`java
int[] scores = new int[5];        // 5 zeros
int[] primes = {2, 3, 5, 7, 11}; // initialized
scores[0] = 95;                    // set first element
int len = scores.length;           // 5 (note: no parentheses)
\`\`\`

**Python lists are dynamic:**
\`\`\`python
scores = [0] * 5           # [0, 0, 0, 0, 0]
primes = [2, 3, 5, 7, 11]  # initialized
scores[0] = 95              # set first element
length = len(scores)        # 5
\`\`\`

### Key Differences

| Feature | Java Array | Python List |
|---------|-----------|-------------|
| Size | Fixed at creation | Can grow/shrink |
| Types | All same type | Mixed types allowed |
| Bounds | ArrayIndexOutOfBoundsException | IndexError |
| Length | \`.length\` (property) | \`len()\` (function) |

### Array Index Layout

\`\`\`mermaid
graph LR
    subgraph "primes array"
        I0["[0]: 2"] --> I1["[1]: 3"]
        I1 --> I2["[2]: 5"]
        I2 --> I3["[3]: 7"]
        I3 --> I4["[4]: 11"]
    end
    style I0 fill:#4a9eff,color:#fff
    style I4 fill:#4a9eff,color:#fff
\`\`\`

Elements are accessed by index, starting at **0** and ending at **length - 1**.

### Traversing an Array

**By index:**
\`\`\`python
for i in range(len(scores)):
    print(f"Index {i}: {scores[i]}")
\`\`\`

**By value (enhanced for loop):**
\`\`\`python
for score in scores:
    print(score)
\`\`\`

### Common Array Algorithms

- **Sum/Average**: Accumulate with a loop
- **Find min/max**: Track the best seen so far
- **Count matches**: Count elements meeting a condition
- **Shift/Rotate**: Move elements left or right

### Analogy: Arrays Are Like a Row of Lockers

Each locker has a number (index) and contains one item (value). You can open any locker by number, but the total number of lockers is fixed.

### Deeper Reading
- AP CSA Unit 6: Array
- Java common array algorithms

### Reflection Questions
1. What happens if you access \`arr[10]\` in an array of size 5?
2. Why does Java use fixed-size arrays?
3. When would you traverse by index vs. by value?`,
    },
    {
      id: "ap-csa-array-exercise",
      slug: "array-exercise",
      title: "Practice: Arrays",
      content: `## Practice: Arrays

Implement classic array algorithms that appear on the AP CSA exam.`,
      starterCode: `def reverse_array(arr):
    """Reverse the array in-place (do not create a new list).

    Example: [1, 2, 3, 4, 5] -> [5, 4, 3, 2, 1]
    """
    # TODO: Use two pointers, swap from outside in
    pass

def shift_left(arr):
    """Shift all elements one position to the left.
    The first element wraps to the end.

    Example: [1, 2, 3, 4] -> [2, 3, 4, 1]
    """
    # TODO: Save first element, shift everything left, put saved at end
    pass

def remove_duplicates(arr):
    """Return a new list with duplicates removed, preserving order.

    Example: [3, 1, 4, 1, 5, 3] -> [3, 1, 4, 5]
    """
    # TODO: Track seen elements, only add new ones
    pass

def running_sum(arr):
    """Return a new list where each element is the sum of all previous elements plus itself.

    Example: [1, 2, 3, 4] -> [1, 3, 6, 10]
    """
    # TODO: Accumulate the sum as you go
    pass

# Tests
a = [1, 2, 3, 4, 5]
reverse_array(a)
print(a)                        # Expected: [5, 4, 3, 2, 1]

b = [1, 2, 3, 4]
shift_left(b)
print(b)                        # Expected: [2, 3, 4, 1]

print(remove_duplicates([3, 1, 4, 1, 5, 3]))  # Expected: [3, 1, 4, 5]
print(running_sum([1, 2, 3, 4]))               # Expected: [1, 3, 6, 10]
`,
      solutionCode: `def reverse_array(arr):
    """Reverse the array in-place."""
    left = 0
    right = len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1

def shift_left(arr):
    """Shift all elements one position to the left."""
    if len(arr) == 0:
        return
    first = arr[0]
    for i in range(len(arr) - 1):
        arr[i] = arr[i + 1]
    arr[-1] = first

def remove_duplicates(arr):
    """Return a new list with duplicates removed, preserving order."""
    seen = set()
    result = []
    for item in arr:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result

def running_sum(arr):
    """Return a new list where each element is the cumulative sum."""
    result = []
    total = 0
    for num in arr:
        total += num
        result.append(total)
    return result

# Tests
a = [1, 2, 3, 4, 5]
reverse_array(a)
print(a)                        # Expected: [5, 4, 3, 2, 1]

b = [1, 2, 3, 4]
shift_left(b)
print(b)                        # Expected: [2, 3, 4, 1]

print(remove_duplicates([3, 1, 4, 1, 5, 3]))  # Expected: [3, 1, 4, 5]
print(running_sum([1, 2, 3, 4]))               # Expected: [1, 3, 6, 10]
`,
    },
    {
      id: "ap-csa-arrays-checkpoint",
      slug: "arrays-checkpoint",
      title: "Checkpoint: Arrays",
      content: `## Checkpoint: Arrays

<!-- voice:section_check -->

### Question 1
In Java, what happens if you try to add an element to a full array?

<details>
<summary>Show Answer</summary>

You cannot -- Java arrays have a fixed size. You would need to create a new, larger array and copy elements over. This is why Java also has ArrayList (covered next).
</details>

### Question 2
What is the output?
\`\`\`python
arr = [10, 20, 30, 40, 50]
for i in range(1, len(arr)):
    arr[i] = arr[i] + arr[i-1]
print(arr)
\`\`\`

<details>
<summary>Show Answer</summary>

**[10, 30, 60, 100, 150]**. Each element becomes the sum of itself and the previous element (running sum / prefix sum).
</details>

### Question 3
Write code to find the second largest element in a list.

<details>
<summary>Show Answer</summary>

\`\`\`python
def second_largest(arr):
    first = second = float('-inf')
    for num in arr:
        if num > first:
            second = first
            first = num
        elif num > second and num != first:
            second = num
    return second
\`\`\`
</details>

### Question 4
Why is accessing \`arr[i]\` considered O(1) (constant time)?

<details>
<summary>Show Answer</summary>

Arrays store elements in contiguous memory. The computer calculates the exact memory address using: base_address + (index * element_size). This arithmetic is instant regardless of array size.
</details>

### Question 5
What is an off-by-one error? Give an example.

<details>
<summary>Show Answer</summary>

An off-by-one error occurs when a loop iterates one too many or one too few times. Example: \`for i in range(len(arr) + 1)\` would try to access \`arr[len(arr)]\`, which is out of bounds.
</details>

### Keep It Up!
Next: ArrayList -- Java's dynamic, resizable array.`,
    },
  ],
};
