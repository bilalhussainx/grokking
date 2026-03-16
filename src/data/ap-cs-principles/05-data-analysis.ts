import { Module } from "../types";

export const dataAnalysisModule: Module = {
  id: "ap-csp-data-analysis",
  title: "Data Analysis",
  description:
    "Learn to collect, clean, and analyze data using Python lists and basic statistics to discover patterns and draw conclusions.",
  lessons: [
    {
      id: "ap-csp-lists-for-data",
      slug: "lists-for-data",
      title: "Working with Data Using Lists",
      content: `## Working with Data Using Lists

<!-- voice:key_insight -->

In the real world, data comes in collections -- test scores for a class, temperatures for a week, prices in a store. Python **lists** let you store and work with these collections.

### Creating and Accessing Lists

\`\`\`python
scores = [85, 92, 78, 95, 88, 73, 91]
cities = ["New York", "London", "Tokyo"]

# Access by index (starts at 0)
first_score = scores[0]     # 85
last_score = scores[-1]     # 91

# Slicing
top_three = scores[:3]      # [85, 92, 78]
\`\`\`

### Useful List Operations

| Operation | Example | Result |
|-----------|---------|--------|
| Length | \`len(scores)\` | 7 |
| Add item | \`scores.append(90)\` | Adds 90 to end |
| Remove item | \`scores.remove(78)\` | Removes first 78 |
| Sort | \`sorted(scores)\` | New sorted list |
| Sum | \`sum(scores)\` | Total of all items |
| Min/Max | \`min(scores)\`, \`max(scores)\` | Smallest/largest |

### Computing Basic Statistics

\`\`\`python
scores = [85, 92, 78, 95, 88, 73, 91]

mean = sum(scores) / len(scores)
minimum = min(scores)
maximum = max(scores)
data_range = maximum - minimum
\`\`\`

### Analogy: Lists Are Like a Numbered Shelf

Imagine a shelf where each position is numbered. You can put items in specific spots, rearrange them, count them, or pick out the biggest and smallest.

### Real-World Connection

Data scientists at companies like Netflix analyze lists of viewing data (watch times, ratings, genres) to recommend shows you might like.

### Deeper Reading
- AP CSP: Big Idea 2 -- Data
- Python documentation: Lists

### Reflection Questions
1. What is the index of the first element in a Python list?
2. What is the difference between \`sort()\` and \`sorted()\`?
3. Why is the mean (average) useful as a summary statistic?`,
    },
    {
      id: "ap-csp-data-analysis-practice",
      slug: "data-analysis-practice",
      title: "Practice: Analyzing a Dataset",
      content: `## Practice: Analyzing a Dataset

Let's analyze some real-world-style data! You will compute statistics, filter data, and find patterns.

### Your Task

Complete the functions to analyze student test score data.`,
      starterCode: `def compute_stats(data):
    """Return a dictionary with mean, median, min, max, and range.

    Example: compute_stats([10, 20, 30]) ->
      {'mean': 20.0, 'median': 20, 'min': 10, 'max': 30, 'range': 20}
    """
    # TODO: Calculate each statistic
    # For median: sort the list, pick the middle element
    # (if even length, average the two middle elements)
    pass

def filter_above(data, threshold):
    """Return a new list containing only values above threshold.

    Example: filter_above([85, 72, 91, 68, 95], 80) -> [85, 91, 95]
    """
    # TODO: Use a loop or list comprehension
    pass

def grade_distribution(scores):
    """Count how many scores fall in each grade range.
    A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: below 60

    Example: grade_distribution([95, 82, 71, 55, 88]) ->
      {'A': 1, 'B': 2, 'C': 1, 'D': 0, 'F': 1}
    """
    # TODO: Use conditionals to categorize each score
    pass

# Test data
test_scores = [88, 92, 75, 95, 83, 67, 91, 78, 85, 72, 96, 81, 59, 90, 84]

print(compute_stats(test_scores))
print(filter_above(test_scores, 85))
print(grade_distribution(test_scores))
`,
      solutionCode: `def compute_stats(data):
    """Return a dictionary with mean, median, min, max, and range."""
    sorted_data = sorted(data)
    n = len(sorted_data)
    if n % 2 == 1:
        median = sorted_data[n // 2]
    else:
        median = (sorted_data[n // 2 - 1] + sorted_data[n // 2]) / 2
    return {
        'mean': sum(data) / len(data),
        'median': median,
        'min': min(data),
        'max': max(data),
        'range': max(data) - min(data),
    }

def filter_above(data, threshold):
    """Return a new list containing only values above threshold."""
    return [x for x in data if x > threshold]

def grade_distribution(scores):
    """Count how many scores fall in each grade range."""
    dist = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0}
    for score in scores:
        if score >= 90:
            dist['A'] += 1
        elif score >= 80:
            dist['B'] += 1
        elif score >= 70:
            dist['C'] += 1
        elif score >= 60:
            dist['D'] += 1
        else:
            dist['F'] += 1
    return dist

# Test data
test_scores = [88, 92, 75, 95, 83, 67, 91, 78, 85, 72, 96, 81, 59, 90, 84]

print(compute_stats(test_scores))
print(filter_above(test_scores, 85))
print(grade_distribution(test_scores))
`,
    },
    {
      id: "ap-csp-data-analysis-checkpoint",
      slug: "data-analysis-checkpoint",
      title: "Checkpoint: Data Analysis",
      content: `## Checkpoint: Data Analysis

<!-- voice:section_check -->

### Question 1
Given the list \`[12, 7, 3, 15, 9, 21, 6]\`, what is the median?

<details>
<summary>Show Answer</summary>

Sort first: [3, 6, 7, **9**, 12, 15, 21]. The middle value is **9**.
</details>

### Question 2
Why might the median be a better summary statistic than the mean in some cases?

<details>
<summary>Show Answer</summary>

The median is not affected by extreme values (outliers). For example, incomes of [30K, 35K, 40K, 42K, 5M] have a mean of ~1M but a median of 40K. The median better represents the "typical" value.
</details>

### Question 3
Write a list comprehension that takes a list of numbers and returns only the odd ones.

<details>
<summary>Show Answer</summary>

\`\`\`python
odds = [x for x in numbers if x % 2 != 0]
\`\`\`
</details>

### Question 4
A dataset has 1,000 temperature readings. You notice that one reading is 999 degrees (likely a sensor error). How should you handle this?

<details>
<summary>Show Answer</summary>

This is an **outlier** likely caused by bad data. You should either remove it, replace it with the mean/median of nearby readings, or flag it for review. Leaving it in would skew your analysis.
</details>

### Question 5
What is the difference between filtering data and sorting data?

<details>
<summary>Show Answer</summary>

**Filtering** removes items that do not meet a condition (reducing the number of items). **Sorting** rearranges all items by some order (same number of items, different arrangement).
</details>

### Great Job!
You can now work with data in Python. Next up: simulations -- using code to model real-world phenomena.`,
    },
  ],
};
