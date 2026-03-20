import { Module } from "../types";

export const writingClassesModule: Module = {
  id: "ap-csa-writing-classes",
  title: "Writing Classes",
  description:
    "Design your own classes with instance variables, constructors, methods, and encapsulation.",
  lessons: [
    {
      id: "ap-csa-class-design",
      slug: "class-design",
      title: "Designing Classes",
      content: `## Designing Classes

<!-- voice:key_insight -->

A **class** defines a new type by bundling data (instance variables) and behavior (methods) together. This is the foundation of **object-oriented programming (OOP)**.

### Java vs. Python Class Comparison

**Java:**
\`\`\`java
public class Student {
    private String name;
    private int grade;

    public Student(String name, int grade) {
        this.name = name;
        this.grade = grade;
    }

    public String getName() {
        return name;
    }

    public int getGrade() {
        return grade;
    }

    public String toString() {
        return name + " (Grade " + grade + ")";
    }
}
\`\`\`

**Python equivalent:**
\`\`\`python
class Student:
    def __init__(self, name, grade):
        self._name = name
        self._grade = grade

    def get_name(self):
        return self._name

    def get_grade(self):
        return self._grade

    def __str__(self):
        return f"{self._name} (Grade {self._grade})"
\`\`\`

### Key Concepts

**Instance variables**: Data stored in each object (\`name\`, \`grade\`)
**Constructor**: Special method called when creating an object (\`__init__\` in Python)
**Methods**: Functions that operate on the object's data
**Encapsulation**: Hiding internal data and exposing it through methods (getters/setters)

### Class Structure Overview

\`\`\`mermaid
graph TD
    A["Student Class"] --> B["Fields"]
    A --> C["Constructor"]
    A --> D["Methods"]
    B --> B1["- name: String"]
    B --> B2["- grade: int"]
    C --> C1["Student(name, grade)"]
    D --> D1["getName()"]
    D --> D2["getGrade()"]
    D --> D3["toString()"]
\`\`\`

### Why Encapsulation?

Making variables private (using \`_\` prefix in Python, \`private\` in Java) prevents outside code from breaking the object's internal state. You control access through methods.

### Analogy: A Class Is Like a Blueprint for a House

The blueprint defines rooms (variables) and doors (methods). Each house built from the blueprint (object) has its own rooms with its own furniture (data), but they all follow the same layout.

### Deeper Reading
- AP CSA Unit 5: Writing Classes
- *Head First Java*, Chapter 4: "How Objects Behave"

### Reflection Questions
1. What is the difference between a class and an object?
2. Why should instance variables be private?
3. What does a constructor do?`,
    },
    {
      id: "ap-csa-class-exercise",
      slug: "class-exercise",
      title: "Practice: Writing Classes",
      content: `## Practice: Writing Classes

Design and implement your own classes.`,
      starterCode: `class BankAccount:
    """A simple bank account with deposit, withdraw, and balance.

    Java equivalent would have:
    - private double balance
    - public BankAccount(double initialBalance)
    - public void deposit(double amount)
    - public boolean withdraw(double amount)
    - public double getBalance()
    """

    def __init__(self, initial_balance):
        """Initialize account with the given balance."""
        # TODO: Store the balance as a private variable
        pass

    def deposit(self, amount):
        """Add amount to balance. Only accept positive amounts."""
        # TODO: Validate amount > 0, then add to balance
        pass

    def withdraw(self, amount):
        """Remove amount from balance if sufficient funds.
        Return True if successful, False if insufficient funds.
        """
        # TODO: Check if amount <= balance, withdraw if so
        pass

    def get_balance(self):
        """Return the current balance."""
        # TODO: Return the balance
        pass

    def __str__(self):
        """Return a string like 'Account balance: $150.00'"""
        # TODO: Format the balance to 2 decimal places
        pass


class GradeBook:
    """Track student grades and compute statistics."""

    def __init__(self):
        """Initialize an empty grade book."""
        # TODO: Create an empty list for grades
        pass

    def add_grade(self, grade):
        """Add a grade (0-100) to the book."""
        # TODO: Validate range, then append
        pass

    def get_average(self):
        """Return the average grade, or 0 if no grades."""
        # TODO: Compute and return the average
        pass

    def get_highest(self):
        """Return the highest grade, or 0 if no grades."""
        # TODO: Return the max grade
        pass

    def get_letter_grade(self):
        """Return the letter grade based on average."""
        # TODO: A>=90, B>=80, C>=70, D>=60, F<60
        pass


# Tests
account = BankAccount(100)
account.deposit(50)
print(account.get_balance())     # Expected: 150
print(account.withdraw(30))      # Expected: True
print(account.get_balance())     # Expected: 120
print(account.withdraw(200))     # Expected: False
print(account)                   # Expected: Account balance: $120.00

gb = GradeBook()
gb.add_grade(85)
gb.add_grade(92)
gb.add_grade(78)
print(gb.get_average())          # Expected: 85.0
print(gb.get_highest())          # Expected: 92
print(gb.get_letter_grade())     # Expected: B
`,
      solutionCode: `class BankAccount:
    """A simple bank account with deposit, withdraw, and balance."""

    def __init__(self, initial_balance):
        self._balance = initial_balance

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount

    def withdraw(self, amount):
        if amount <= self._balance and amount > 0:
            self._balance -= amount
            return True
        return False

    def get_balance(self):
        return self._balance

    def __str__(self):
        return f"Account balance: \${self._balance:.2f}"


class GradeBook:
    """Track student grades and compute statistics."""

    def __init__(self):
        self._grades = []

    def add_grade(self, grade):
        if 0 <= grade <= 100:
            self._grades.append(grade)

    def get_average(self):
        if not self._grades:
            return 0
        return sum(self._grades) / len(self._grades)

    def get_highest(self):
        if not self._grades:
            return 0
        return max(self._grades)

    def get_letter_grade(self):
        avg = self.get_average()
        if avg >= 90:
            return "A"
        elif avg >= 80:
            return "B"
        elif avg >= 70:
            return "C"
        elif avg >= 60:
            return "D"
        return "F"


# Tests
account = BankAccount(100)
account.deposit(50)
print(account.get_balance())     # Expected: 150
print(account.withdraw(30))      # Expected: True
print(account.get_balance())     # Expected: 120
print(account.withdraw(200))     # Expected: False
print(account)                   # Expected: Account balance: $120.00

gb = GradeBook()
gb.add_grade(85)
gb.add_grade(92)
gb.add_grade(78)
print(gb.get_average())          # Expected: 85.0
print(gb.get_highest())          # Expected: 92
print(gb.get_letter_grade())     # Expected: B
`,
    },
    {
      id: "ap-csa-classes-checkpoint",
      slug: "classes-checkpoint",
      title: "Checkpoint: Writing Classes",
      content: `## Checkpoint: Writing Classes

<!-- voice:section_check -->

### Question 1
What is encapsulation, and why is it important?

<details>
<summary>Show Answer</summary>

Encapsulation is bundling data with the methods that operate on it, and restricting direct access to the data. It is important because it prevents external code from putting an object into an invalid state (e.g., setting a bank balance to -1000).
</details>

### Question 2
What is the purpose of a constructor?

<details>
<summary>Show Answer</summary>

A constructor initializes a new object's instance variables when the object is created. In Python, it is the \`__init__\` method. In Java, it has the same name as the class.
</details>

### Question 3
What is the difference between \`this\` (Java) and \`self\` (Python)?

<details>
<summary>Show Answer</summary>

Both refer to the current object instance. In Java, \`this\` is implicit (optional in most cases). In Python, \`self\` must be explicitly listed as the first parameter of every instance method.
</details>

### Question 4
Why should getters and setters be used instead of making variables public?

<details>
<summary>Show Answer</summary>

Getters and setters let you add validation (e.g., ensuring age is positive), compute derived values, log access, or change internal representation without breaking external code.
</details>

### Question 5
Write a Python class \`Counter\` with methods \`increment()\`, \`decrement()\`, \`get_count()\`, and \`reset()\`.

<details>
<summary>Show Answer</summary>

\`\`\`python
class Counter:
    def __init__(self):
        self._count = 0
    def increment(self):
        self._count += 1
    def decrement(self):
        self._count -= 1
    def get_count(self):
        return self._count
    def reset(self):
        self._count = 0
\`\`\`
</details>

### Great Progress!
You can now design your own classes. Next: arrays.`,
    },
  ],
};
