import { Module } from "../types";

export const arrayListModule: Module = {
  id: "ap-csa-arraylist",
  title: "ArrayList",
  description: "Master Java's ArrayList -- a resizable array that grows dynamically, with Python list equivalents.",
  lessons: [
    {
      id: "ap-csa-arraylist-basics",
      slug: "arraylist-basics",
      title: "ArrayList Fundamentals",
      content: `## ArrayList Fundamentals

<!-- voice:key_insight -->

An **ArrayList** is Java's dynamic array -- it automatically grows and shrinks as you add or remove elements. Python lists work like ArrayLists by default.

### Java ArrayList vs. Python List

**Java:**
\`\`\`java
import java.util.ArrayList;

ArrayList<String> names = new ArrayList<String>();
names.add("Alice");           // append
names.add(0, "Bob");          // insert at index 0
names.get(1);                 // "Alice"
names.set(0, "Charlie");      // replace index 0
names.remove(0);              // remove index 0
names.size();                 // 1
\`\`\`

**Python equivalent:**
\`\`\`python
names = []
names.append("Alice")          # append
names.insert(0, "Bob")         # insert at index 0
names[1]                       # "Alice"
names[0] = "Charlie"           # replace index 0
names.pop(0)                   # remove index 0
len(names)                     # 1
\`\`\`

### ArrayList Methods (AP Exam Reference)

| Java ArrayList | Python List | Description |
|---------------|-------------|-------------|
| \`add(item)\` | \`append(item)\` | Add to end |
| \`add(i, item)\` | \`insert(i, item)\` | Insert at index |
| \`get(i)\` | \`list[i]\` | Get element |
| \`set(i, item)\` | \`list[i] = item\` | Replace element |
| \`remove(i)\` | \`pop(i)\` | Remove by index |
| \`size()\` | \`len(list)\` | Number of elements |

### Traversal Traps (AP Exam Favorite!)

When removing elements while traversing, indices shift:
\`\`\`python
# WRONG -- skips elements after removal
nums = [1, 2, 3, 4, 5]
for i in range(len(nums)):
    if nums[i] % 2 == 0:
        nums.pop(i)  # After removing index 1, index 2 becomes index 1!

# CORRECT -- traverse backwards
for i in range(len(nums) - 1, -1, -1):
    if nums[i] % 2 == 0:
        nums.pop(i)
\`\`\`

### Analogy: ArrayList Is Like a Growing Bookshelf

A regular array is a shelf with fixed slots. An ArrayList is a shelf that magically adds more slots when you need them.

### Deeper Reading
- AP CSA Unit 7: ArrayList
- Java Collections Framework overview

### Reflection Questions
1. When would you use an ArrayList instead of a regular array?
2. Why is removing while traversing forward dangerous?
3. What does "generics" mean in \`ArrayList<String>\`?`,
    },
    {
      id: "ap-csa-arraylist-exercise",
      slug: "arraylist-exercise",
      title: "Practice: ArrayList Operations",
      content: `## Practice: ArrayList Operations

Practice ArrayList-style operations using Python lists.`,
      starterCode: `def remove_evens(numbers):
    """Remove all even numbers from the list IN-PLACE.
    Return the modified list.

    Example: remove_evens([1, 2, 3, 4, 5, 6]) -> [1, 3, 5]
    """
    # TODO: Traverse backwards to safely remove
    pass

def merge_sorted(list1, list2):
    """Merge two sorted lists into one sorted list.

    Example: merge_sorted([1, 3, 5], [2, 4, 6]) -> [1, 2, 3, 4, 5, 6]
    """
    # TODO: Use two pointers
    pass

def rotate_right(lst, k):
    """Rotate list to the right by k positions.

    Example: rotate_right([1, 2, 3, 4, 5], 2) -> [4, 5, 1, 2, 3]
    """
    # TODO: Use slicing
    pass

def flatten(nested_list):
    """Flatten a list of lists into a single list.

    Example: flatten([[1, 2], [3, 4], [5]]) -> [1, 2, 3, 4, 5]
    """
    # TODO: Loop through each sublist and extend
    pass

# Tests
print(remove_evens([1, 2, 3, 4, 5, 6]))         # Expected: [1, 3, 5]
print(merge_sorted([1, 3, 5], [2, 4, 6]))       # Expected: [1, 2, 3, 4, 5, 6]
print(rotate_right([1, 2, 3, 4, 5], 2))         # Expected: [4, 5, 1, 2, 3]
print(flatten([[1, 2], [3, 4], [5]]))            # Expected: [1, 2, 3, 4, 5]
`,
      solutionCode: `def remove_evens(numbers):
    """Remove all even numbers from the list IN-PLACE."""
    i = len(numbers) - 1
    while i >= 0:
        if numbers[i] % 2 == 0:
            numbers.pop(i)
        i -= 1
    return numbers

def merge_sorted(list1, list2):
    """Merge two sorted lists into one sorted list."""
    result = []
    i = j = 0
    while i < len(list1) and j < len(list2):
        if list1[i] <= list2[j]:
            result.append(list1[i])
            i += 1
        else:
            result.append(list2[j])
            j += 1
    result.extend(list1[i:])
    result.extend(list2[j:])
    return result

def rotate_right(lst, k):
    """Rotate list to the right by k positions."""
    if not lst:
        return lst
    k = k % len(lst)
    return lst[-k:] + lst[:-k]

def flatten(nested_list):
    """Flatten a list of lists into a single list."""
    result = []
    for sublist in nested_list:
        result.extend(sublist)
    return result

# Tests
print(remove_evens([1, 2, 3, 4, 5, 6]))         # Expected: [1, 3, 5]
print(merge_sorted([1, 3, 5], [2, 4, 6]))       # Expected: [1, 2, 3, 4, 5, 6]
print(rotate_right([1, 2, 3, 4, 5], 2))         # Expected: [4, 5, 1, 2, 3]
print(flatten([[1, 2], [3, 4], [5]]))            # Expected: [1, 2, 3, 4, 5]
`,
    },
    {
      id: "ap-csa-arraylist-checkpoint",
      slug: "arraylist-checkpoint",
      title: "Checkpoint: ArrayList",
      content: `## Checkpoint: ArrayList

<!-- voice:section_check -->

### Question 1
In Java, what is the difference between \`ArrayList<int>\` and \`ArrayList<Integer>\`?

<details>
<summary>Show Answer</summary>

\`ArrayList<int>\` is **invalid** -- ArrayLists cannot store primitive types. You must use the wrapper class: \`ArrayList<Integer>\`. Java auto-boxes between \`int\` and \`Integer\` automatically.
</details>

### Question 2
What is the bug in this code?
\`\`\`python
nums = [1, 2, 3, 4, 5]
for i in range(len(nums)):
    if nums[i] % 2 == 0:
        nums.pop(i)
\`\`\`

<details>
<summary>Show Answer</summary>

After removing an element, all subsequent indices shift left. The loop may skip elements or go out of bounds. Fix: traverse backwards with \`range(len(nums)-1, -1, -1)\`.
</details>

### Question 3
How does merge sort use the merge operation?

<details>
<summary>Show Answer</summary>

Merge sort recursively splits the list in half until each piece has one element, then merges the sorted halves back together using the merge operation. This achieves O(N log N) time complexity.
</details>

### Question 4
What is autoboxing in Java?

<details>
<summary>Show Answer</summary>

Autoboxing is Java's automatic conversion between primitive types (\`int\`, \`double\`) and their wrapper classes (\`Integer\`, \`Double\`). \`list.add(5)\` autoboxes the \`int\` 5 into an \`Integer\` object.
</details>

### Question 5
What is the time complexity of inserting at the beginning of an ArrayList vs. appending at the end?

<details>
<summary>Show Answer</summary>

**Inserting at beginning: O(N)** -- every existing element must shift right. **Appending at end: O(1)** amortized -- just add at the next available slot (occasionally needs to resize the underlying array).
</details>

### Excellent!
Next: 2D Arrays -- arrays of arrays.`,
    },
  ],
};
