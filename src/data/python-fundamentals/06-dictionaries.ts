import { Module } from "../types";

export const dictionariesModule: Module = {
  id: "dictionaries",
  title: "Dictionaries",
  description:
    "Learn to use Python dictionaries for key-value storage, iteration, and solving real-world data problems.",
  lessons: [
    {
      id: "dicts-intro",
      slug: "dictionaries-intro",
      title: "Introduction to Dictionaries",
      content: `## Dictionaries — Key-Value Pairs

A **dictionary** stores data as key-value pairs. Think of it like a real dictionary: you look up a word (key) to find its definition (value).

### Creating Dictionaries

\`\`\`python
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

# Empty dictionary
empty = {}
\`\`\`

### Accessing Values

\`\`\`python
person["name"]          # "Alice"
person.get("name")      # "Alice"
person.get("phone", "N/A")  # "N/A" (default if key missing)
\`\`\`

**Note:** Using \`[]\` raises a \`KeyError\` if the key does not exist. Using \`.get()\` returns \`None\` (or a default value) instead.

### Common Operations

| Operation | Example | Description |
|-----------|---------|-------------|
| Add/Update | \`d["key"] = value\` | Set a key-value pair |
| Delete | \`del d["key"]\` | Remove a key |
| Check key | \`"key" in d\` | Returns True/False |
| Keys | \`d.keys()\` | All keys |
| Values | \`d.values()\` | All values |
| Items | \`d.items()\` | All (key, value) pairs |
| Length | \`len(d)\` | Number of pairs |

### Iterating Over Dictionaries

\`\`\`python
scores = {"Alice": 95, "Bob": 87, "Charlie": 92}

# Iterate over keys
for name in scores:
    print(name)

# Iterate over key-value pairs
for name, score in scores.items():
    print(f"{name}: {score}")
\`\`\`

### Dictionary Comprehensions

\`\`\`python
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
\`\`\`

### Key Constraints

Dictionary keys must be **immutable** (strings, numbers, tuples). Lists cannot be keys.`,
    },
    {
      id: "dicts-word-frequency",
      slug: "word-frequency",
      title: "Word Frequency Counter",
      content: `## Word Frequency Counter

Counting word frequencies is one of the most common uses of dictionaries. You will build a tool that analyzes text by counting how often each word appears.

### Pattern: Counting with Dictionaries

\`\`\`python
counts = {}
for item in items:
    counts[item] = counts.get(item, 0) + 1
\`\`\`

### Hints

- Use \`.lower()\` to normalize case
- Use \`.split()\` to break text into words
- \`dict.get(key, default)\` avoids KeyError
- To find the most common word, find the key with the maximum value`,
      starterCode: `def word_count(text):
    """Count the frequency of each word in the text.
    Return a dictionary {word: count}. Convert to lowercase."""
    # TODO: Split text into words, count each one
    pass

def most_common_word(text):
    """Return the most common word in the text (lowercase).
    If there's a tie, return any one of them."""
    # TODO: Use word_count, then find the word with max count
    pass

def char_frequency(text):
    """Count the frequency of each character (excluding spaces).
    Return a dictionary {char: count}. Convert to lowercase."""
    # TODO: Loop through characters, skip spaces
    pass

def top_n_words(text, n):
    """Return the top n most frequent words as a list of tuples
    [(word, count), ...] sorted by count descending."""
    # TODO: Get word counts, sort by count, return top n
    pass

# Test cases
print(word_count("the cat sat on the mat"))
# Expected: {'the': 2, 'cat': 1, 'sat': 1, 'on': 1, 'mat': 1}

print(most_common_word("to be or not to be that is the question"))
# Expected: to (or be — both appear twice)

print(char_frequency("hello"))
# Expected: {'h': 1, 'e': 1, 'l': 2, 'o': 1}

print(top_n_words("the cat sat on the mat the cat", 2))
# Expected: [('the', 3), ('cat', 2)]`,
      solutionCode: `def word_count(text):
    """Count the frequency of each word in the text.
    Return a dictionary {word: count}. Convert to lowercase."""
    counts = {}
    for word in text.lower().split():
        counts[word] = counts.get(word, 0) + 1
    return counts

def most_common_word(text):
    """Return the most common word in the text (lowercase).
    If there's a tie, return any one of them."""
    counts = word_count(text)
    return max(counts, key=counts.get)

def char_frequency(text):
    """Count the frequency of each character (excluding spaces).
    Return a dictionary {char: count}. Convert to lowercase."""
    counts = {}
    for ch in text.lower():
        if ch != " ":
            counts[ch] = counts.get(ch, 0) + 1
    return counts

def top_n_words(text, n):
    """Return the top n most frequent words as a list of tuples
    [(word, count), ...] sorted by count descending."""
    counts = word_count(text)
    sorted_words = sorted(counts.items(), key=lambda x: x[1], reverse=True)
    return sorted_words[:n]

# Test cases
print(word_count("the cat sat on the mat"))
# Expected: {'the': 2, 'cat': 1, 'sat': 1, 'on': 1, 'mat': 1}

print(most_common_word("to be or not to be that is the question"))
# Expected: to (or be — both appear twice)

print(char_frequency("hello"))
# Expected: {'h': 1, 'e': 1, 'l': 2, 'o': 1}

print(top_n_words("the cat sat on the mat the cat", 2))
# Expected: [('the', 3), ('cat', 2)]`,
    },
    {
      id: "dicts-gradebook",
      slug: "student-gradebook",
      title: "Student Grade Book",
      content: `## Student Grade Book

Build a grade book system using dictionaries. Each student has a name and a list of scores.

### Data Structure

\`\`\`python
gradebook = {
    "Alice": [90, 85, 92],
    "Bob": [78, 82, 80],
}
\`\`\`

### Hints

- Use \`sum(scores) / len(scores)\` for averages
- Sort students by average to find the top performer
- A dictionary of lists is a common and powerful pattern`,
      starterCode: `def create_gradebook(names, scores):
    """Create a gradebook from parallel lists of names and score-lists.
    names = ["Alice", "Bob"], scores = [[90, 85], [78, 82]]
    Returns {"Alice": [90, 85], "Bob": [78, 82]}"""
    # TODO: Zip names and scores into a dictionary
    pass

def add_score(gradebook, name, score):
    """Add a score for a student. If student doesn't exist, create them."""
    # TODO: Append score to existing list or create new entry
    pass

def student_average(gradebook, name):
    """Return the average score for a student, rounded to 2 decimal places.
    Return -1 if student not found."""
    # TODO: Look up scores, calculate average
    pass

def class_average(gradebook):
    """Return the overall class average (average of all student averages).
    Round to 2 decimal places."""
    # TODO: Get each student's average, then average those
    pass

def top_student(gradebook):
    """Return the name of the student with the highest average."""
    # TODO: Find the student with the max average
    pass

# Test cases
gb = create_gradebook(
    ["Alice", "Bob", "Charlie"],
    [[90, 85, 92], [78, 82, 80], [95, 88, 91]]
)
print(gb)
# Expected: {'Alice': [90, 85, 92], 'Bob': [78, 82, 80], 'Charlie': [95, 88, 91]}

add_score(gb, "Alice", 88)
add_score(gb, "Diana", 95)
print(gb["Alice"])
# Expected: [90, 85, 92, 88]
print(gb["Diana"])
# Expected: [95]

print(student_average(gb, "Alice"))
# Expected: 88.75

print(student_average(gb, "Unknown"))
# Expected: -1

print(class_average(gb))
# Expected: 86.44

print(top_student(gb))
# Expected: Diana`,
      solutionCode: `def create_gradebook(names, scores):
    """Create a gradebook from parallel lists of names and score-lists."""
    gradebook = {}
    for name, score_list in zip(names, scores):
        gradebook[name] = score_list[:]
    return gradebook

def add_score(gradebook, name, score):
    """Add a score for a student. If student doesn't exist, create them."""
    if name in gradebook:
        gradebook[name].append(score)
    else:
        gradebook[name] = [score]

def student_average(gradebook, name):
    """Return the average score for a student, rounded to 2 decimal places.
    Return -1 if student not found."""
    if name not in gradebook:
        return -1
    scores = gradebook[name]
    return round(sum(scores) / len(scores), 2)

def class_average(gradebook):
    """Return the overall class average (average of all student averages).
    Round to 2 decimal places."""
    averages = []
    for name in gradebook:
        avg = student_average(gradebook, name)
        averages.append(avg)
    return round(sum(averages) / len(averages), 2)

def top_student(gradebook):
    """Return the name of the student with the highest average."""
    best_name = None
    best_avg = -1
    for name in gradebook:
        avg = student_average(gradebook, name)
        if avg > best_avg:
            best_avg = avg
            best_name = name
    return best_name

# Test cases
gb = create_gradebook(
    ["Alice", "Bob", "Charlie"],
    [[90, 85, 92], [78, 82, 80], [95, 88, 91]]
)
print(gb)
# Expected: {'Alice': [90, 85, 92], 'Bob': [78, 82, 80], 'Charlie': [95, 88, 91]}

add_score(gb, "Alice", 88)
add_score(gb, "Diana", 95)
print(gb["Alice"])
# Expected: [90, 85, 92, 88]
print(gb["Diana"])
# Expected: [95]

print(student_average(gb, "Alice"))
# Expected: 88.75

print(student_average(gb, "Unknown"))
# Expected: -1

print(class_average(gb))
# Expected: 86.44

print(top_student(gb))
# Expected: Diana`,
    },
    {
      id: "dicts-inventory",
      slug: "inventory-system",
      title: "Inventory System",
      content: `## Inventory System

Build a product inventory system using nested dictionaries. Each product has a name, price, and quantity.

### Data Structure

\`\`\`python
inventory = {
    "apple": {"price": 0.50, "quantity": 100},
    "banana": {"price": 0.25, "quantity": 150},
}
\`\`\`

### Hints

- Use nested dictionaries to store product attributes
- Check if items exist before modifying them
- Total value = price * quantity for each item`,
      starterCode: `def create_inventory(items):
    """Create an inventory from a list of tuples (name, price, quantity).
    Return a dictionary of dictionaries."""
    # TODO: Build the nested dictionary
    pass

def add_item(inventory, name, price, quantity):
    """Add a new item or update existing item's price and add to quantity."""
    # TODO: If item exists, update price and add quantity
    # If new, create the entry
    pass

def remove_item(inventory, name):
    """Remove an item from inventory. Return True if removed, False if not found."""
    # TODO: Delete the item if it exists
    pass

def total_inventory_value(inventory):
    """Calculate the total value of all items (price * quantity for each).
    Round to 2 decimal places."""
    # TODO: Sum up price * quantity for all items
    pass

def items_below_threshold(inventory, threshold):
    """Return a list of item names where quantity is below the threshold."""
    # TODO: Check each item's quantity
    pass

def most_valuable_item(inventory):
    """Return the name of the item with the highest total value (price * quantity)."""
    # TODO: Find the item with max price * quantity
    pass

# Test cases
inv = create_inventory([
    ("apple", 0.50, 100),
    ("banana", 0.25, 150),
    ("orange", 0.75, 80)
])
print(inv)
# Expected: {'apple': {'price': 0.5, 'quantity': 100}, 'banana': {'price': 0.25, 'quantity': 150}, 'orange': {'price': 0.75, 'quantity': 80}}

add_item(inv, "grape", 1.00, 50)
add_item(inv, "apple", 0.60, 20)
print(inv["grape"])
# Expected: {'price': 1.0, 'quantity': 50}
print(inv["apple"])
# Expected: {'price': 0.6, 'quantity': 120}

print(remove_item(inv, "banana"))
# Expected: True
print(remove_item(inv, "mango"))
# Expected: False

print(total_inventory_value(inv))
# Expected: 194.5

print(items_below_threshold(inv, 100))
# Expected: ['orange', 'grape']

print(most_valuable_item(inv))
# Expected: apple`,
      solutionCode: `def create_inventory(items):
    """Create an inventory from a list of tuples (name, price, quantity)."""
    inventory = {}
    for name, price, quantity in items:
        inventory[name] = {"price": price, "quantity": quantity}
    return inventory

def add_item(inventory, name, price, quantity):
    """Add a new item or update existing item's price and add to quantity."""
    if name in inventory:
        inventory[name]["price"] = price
        inventory[name]["quantity"] += quantity
    else:
        inventory[name] = {"price": price, "quantity": quantity}

def remove_item(inventory, name):
    """Remove an item from inventory. Return True if removed, False if not found."""
    if name in inventory:
        del inventory[name]
        return True
    return False

def total_inventory_value(inventory):
    """Calculate the total value of all items (price * quantity for each).
    Round to 2 decimal places."""
    total = 0
    for item in inventory.values():
        total += item["price"] * item["quantity"]
    return round(total, 2)

def items_below_threshold(inventory, threshold):
    """Return a list of item names where quantity is below the threshold."""
    result = []
    for name, item in inventory.items():
        if item["quantity"] < threshold:
            result.append(name)
    return result

def most_valuable_item(inventory):
    """Return the name of the item with the highest total value (price * quantity)."""
    best_name = None
    best_value = -1
    for name, item in inventory.items():
        value = item["price"] * item["quantity"]
        if value > best_value:
            best_value = value
            best_name = name
    return best_name

# Test cases
inv = create_inventory([
    ("apple", 0.50, 100),
    ("banana", 0.25, 150),
    ("orange", 0.75, 80)
])
print(inv)
# Expected: {'apple': {'price': 0.5, 'quantity': 100}, 'banana': {'price': 0.25, 'quantity': 150}, 'orange': {'price': 0.75, 'quantity': 80}}

add_item(inv, "grape", 1.00, 50)
add_item(inv, "apple", 0.60, 20)
print(inv["grape"])
# Expected: {'price': 1.0, 'quantity': 50}
print(inv["apple"])
# Expected: {'price': 0.6, 'quantity': 120}

print(remove_item(inv, "banana"))
# Expected: True
print(remove_item(inv, "mango"))
# Expected: False

print(total_inventory_value(inv))
# Expected: 194.5

print(items_below_threshold(inv, 100))
# Expected: ['orange', 'grape']

print(most_valuable_item(inv))
# Expected: apple`,
    },
  ],
};
