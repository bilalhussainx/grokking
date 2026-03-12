import { Module } from "../types";

export const projectsModule: Module = {
  id: "projects",
  title: "Mini Projects",
  description:
    "Apply everything you have learned to build real mini-projects: a todo list, contact book, and calculator.",
  lessons: [
    {
      id: "projects-overview",
      slug: "projects-overview",
      title: "Project Overview",
      content: `## Putting It All Together

Congratulations! You have learned the core building blocks of Python:

- **Variables & Types** — storing and converting data
- **Control Flow** — making decisions with if/elif/else
- **Loops** — repeating actions with for and while
- **Functions** — organizing reusable code
- **Lists** — ordered collections of data
- **Dictionaries** — key-value data storage
- **Strings** — text processing and formatting
- **File Handling** — reading and parsing structured data
- **OOP** — classes, objects, and inheritance

### What is Next?

In the following three lessons, you will build complete mini-projects that combine multiple concepts from the entire course. Each project will require:

1. **Data structures** — choosing the right way to store data
2. **Functions** — organizing your code cleanly
3. **Control flow** — handling user commands and edge cases
4. **String formatting** — presenting output clearly

### Project List

| # | Project | Key Concepts |
|---|---------|-------------|
| 1 | **Todo List Manager** | Lists, dictionaries, functions, OOP |
| 2 | **Contact Book** | Dictionaries, string formatting, search |
| 3 | **Simple Calculator** | Functions, control flow, error handling |

### Tips for Success

- Read the entire problem before coding
- Start with the data structure — decide how to store your data
- Build one function at a time and test as you go
- Handle edge cases: empty inputs, invalid data, duplicates
- Use the test cases to verify your solution`,
    },
    {
      id: "projects-todo-list",
      slug: "todo-list-manager",
      title: "Todo List Manager",
      content: `## Todo List Manager

Build a complete task management system using classes. Each task has a title, priority, and completion status.

### Features

- Add tasks with priority levels (high, medium, low)
- Mark tasks as complete
- Remove tasks
- List tasks filtered by status or priority
- Get statistics

### Hints

- Use a class for individual tasks
- Use a class for the task manager that holds a list of tasks
- Priority sorting: high > medium > low
- Think about unique identification for tasks`,
      starterCode: `class Task:
    def __init__(self, title, priority="medium"):
        """Create a task. Priority is 'high', 'medium', or 'low'.
        Tasks start as not completed. Assign a unique id."""
        # TODO: Set title, priority, completed status
        # Use a class variable to auto-increment IDs
        pass

    def complete(self):
        """Mark the task as completed."""
        # TODO: Set completed to True
        pass

    def __str__(self):
        """Return '[X] title (priority)' if completed,
        or '[ ] title (priority)' if not."""
        # TODO: Format based on completion status
        pass

class TodoList:
    def __init__(self):
        """Initialize an empty todo list."""
        # TODO: Create an empty list to hold tasks
        pass

    def add_task(self, title, priority="medium"):
        """Add a new task. Return the created Task object."""
        # TODO: Create a Task and add it to the list
        pass

    def complete_task(self, task_id):
        """Mark a task as completed by its ID.
        Return True if found and completed, False if not found."""
        # TODO: Find task by ID and complete it
        pass

    def remove_task(self, task_id):
        """Remove a task by its ID.
        Return True if removed, False if not found."""
        # TODO: Find and remove the task
        pass

    def get_tasks(self, status="all"):
        """Return tasks filtered by status: 'all', 'completed', or 'pending'.
        Return as a list of Task objects."""
        # TODO: Filter tasks based on status
        pass

    def get_tasks_by_priority(self, priority):
        """Return all tasks with the given priority."""
        # TODO: Filter by priority
        pass

    def get_stats(self):
        """Return a dictionary with:
        'total', 'completed', 'pending',
        'high', 'medium', 'low' counts."""
        # TODO: Count tasks by status and priority
        pass

    def __str__(self):
        """Return a formatted string showing all tasks."""
        # TODO: Format all tasks with header
        pass

# Test cases
# Reset Task ID counter
Task._id_counter = 0

todo = TodoList()
todo.add_task("Buy groceries", "high")
todo.add_task("Clean house", "medium")
todo.add_task("Read book", "low")
todo.add_task("Pay bills", "high")
todo.add_task("Exercise", "medium")

print(todo)
# Expected:
# Todo List (5 tasks)
# [ ] Buy groceries (high)
# [ ] Clean house (medium)
# [ ] Read book (low)
# [ ] Pay bills (high)
# [ ] Exercise (medium)

todo.complete_task(1)
todo.complete_task(4)

completed = todo.get_tasks("completed")
print(f"Completed: {len(completed)}")
# Expected: Completed: 2

pending = todo.get_tasks("pending")
print(f"Pending: {len(pending)}")
# Expected: Pending: 3

high = todo.get_tasks_by_priority("high")
print(f"High priority: {len(high)}")
# Expected: High priority: 2

stats = todo.get_stats()
print(stats)
# Expected: {'total': 5, 'completed': 2, 'pending': 3, 'high': 2, 'medium': 2, 'low': 1}

todo.remove_task(3)
print(f"After removal: {len(todo.get_tasks())} tasks")
# Expected: After removal: 4 tasks`,
      solutionCode: `class Task:
    _id_counter = 0

    def __init__(self, title, priority="medium"):
        """Create a task. Priority is 'high', 'medium', or 'low'."""
        Task._id_counter += 1
        self.id = Task._id_counter
        self.title = title
        self.priority = priority
        self.completed = False

    def complete(self):
        """Mark the task as completed."""
        self.completed = True

    def __str__(self):
        """Return '[X] title (priority)' if completed,
        or '[ ] title (priority)' if not."""
        status = "X" if self.completed else " "
        return f"[{status}] {self.title} ({self.priority})"

class TodoList:
    def __init__(self):
        """Initialize an empty todo list."""
        self.tasks = []

    def add_task(self, title, priority="medium"):
        """Add a new task. Return the created Task object."""
        task = Task(title, priority)
        self.tasks.append(task)
        return task

    def complete_task(self, task_id):
        """Mark a task as completed by its ID."""
        for task in self.tasks:
            if task.id == task_id:
                task.complete()
                return True
        return False

    def remove_task(self, task_id):
        """Remove a task by its ID."""
        for i, task in enumerate(self.tasks):
            if task.id == task_id:
                self.tasks.pop(i)
                return True
        return False

    def get_tasks(self, status="all"):
        """Return tasks filtered by status: 'all', 'completed', or 'pending'."""
        if status == "all":
            return self.tasks[:]
        elif status == "completed":
            return [t for t in self.tasks if t.completed]
        elif status == "pending":
            return [t for t in self.tasks if not t.completed]
        return []

    def get_tasks_by_priority(self, priority):
        """Return all tasks with the given priority."""
        return [t for t in self.tasks if t.priority == priority]

    def get_stats(self):
        """Return a dictionary with task counts."""
        completed = len([t for t in self.tasks if t.completed])
        return {
            'total': len(self.tasks),
            'completed': completed,
            'pending': len(self.tasks) - completed,
            'high': len([t for t in self.tasks if t.priority == "high"]),
            'medium': len([t for t in self.tasks if t.priority == "medium"]),
            'low': len([t for t in self.tasks if t.priority == "low"]),
        }

    def __str__(self):
        """Return a formatted string showing all tasks."""
        lines = [f"Todo List ({len(self.tasks)} tasks)"]
        for task in self.tasks:
            lines.append(str(task))
        return "\\n".join(lines)

# Test cases
Task._id_counter = 0

todo = TodoList()
todo.add_task("Buy groceries", "high")
todo.add_task("Clean house", "medium")
todo.add_task("Read book", "low")
todo.add_task("Pay bills", "high")
todo.add_task("Exercise", "medium")

print(todo)
# Expected:
# Todo List (5 tasks)
# [ ] Buy groceries (high)
# [ ] Clean house (medium)
# [ ] Read book (low)
# [ ] Pay bills (high)
# [ ] Exercise (medium)

todo.complete_task(1)
todo.complete_task(4)

completed = todo.get_tasks("completed")
print(f"Completed: {len(completed)}")
# Expected: Completed: 2

pending = todo.get_tasks("pending")
print(f"Pending: {len(pending)}")
# Expected: Pending: 3

high = todo.get_tasks_by_priority("high")
print(f"High priority: {len(high)}")
# Expected: High priority: 2

stats = todo.get_stats()
print(stats)
# Expected: {'total': 5, 'completed': 2, 'pending': 3, 'high': 2, 'medium': 2, 'low': 1}

todo.remove_task(3)
print(f"After removal: {len(todo.get_tasks())} tasks")
# Expected: After removal: 4 tasks`,
    },
    {
      id: "projects-contact-book",
      slug: "contact-book",
      title: "Contact Book",
      content: `## Contact Book

Build a contact management system that stores names, phone numbers, and emails, with search and display features.

### Features

- Add, update, and delete contacts
- Search contacts by name (partial match)
- Display all contacts in a formatted table
- Group contacts by first letter

### Hints

- Use a dictionary with contact name as key
- Each contact's value is another dictionary with phone and email
- For search, use \`.lower()\` and the \`in\` operator for partial matching
- Sort contacts alphabetically for display`,
      starterCode: `class ContactBook:
    def __init__(self):
        """Initialize an empty contact book."""
        # TODO: Set up the contacts dictionary
        pass

    def add_contact(self, name, phone, email=""):
        """Add a new contact. If contact exists, return False.
        Otherwise add and return True."""
        # TODO: Check if exists, then add
        pass

    def update_contact(self, name, phone=None, email=None):
        """Update an existing contact's phone and/or email.
        Return True if updated, False if contact not found."""
        # TODO: Find contact and update non-None fields
        pass

    def delete_contact(self, name):
        """Delete a contact by name.
        Return True if deleted, False if not found."""
        # TODO: Remove from dictionary
        pass

    def search(self, query):
        """Search contacts by name (case-insensitive, partial match).
        Return a list of (name, info_dict) tuples."""
        # TODO: Filter contacts where query appears in name
        pass

    def get_all_contacts(self):
        """Return all contacts sorted alphabetically by name.
        Return as a list of (name, info_dict) tuples."""
        # TODO: Sort and return
        pass

    def group_by_letter(self):
        """Group contacts by first letter of name.
        Return a dict like {'A': [...], 'B': [...]}."""
        # TODO: Group contacts
        pass

    def display(self):
        """Return a formatted string showing all contacts as a table."""
        # TODO: Format as aligned table
        pass

    def __len__(self):
        """Return the number of contacts."""
        # TODO: Return count
        pass

# Test cases
book = ContactBook()
book.add_contact("Alice Smith", "555-0101", "alice@email.com")
book.add_contact("Bob Jones", "555-0102", "bob@email.com")
book.add_contact("Alice Johnson", "555-0103", "alicej@email.com")
book.add_contact("Charlie Brown", "555-0104")
book.add_contact("Diana Prince", "555-0105", "diana@email.com")

print(len(book))
# Expected: 5

print(book.add_contact("Alice Smith", "555-9999"))
# Expected: False (duplicate)

book.update_contact("Charlie Brown", email="charlie@email.com")

results = book.search("alice")
print(len(results))
# Expected: 2

for name, info in results:
    print(f"{name}: {info['phone']}")
# Expected:
# Alice Smith: 555-0101
# Alice Johnson: 555-0103

book.delete_contact("Bob Jones")
print(len(book))
# Expected: 4

groups = book.group_by_letter()
print(sorted(groups.keys()))
# Expected: ['A', 'C', 'D']

print(book.display())
# Expected:
# Contact Book (4 contacts)
# -------------------------
# Name            | Phone    | Email
# Alice Johnson   | 555-0103 | alicej@email.com
# Alice Smith     | 555-0101 | alice@email.com
# Charlie Brown   | 555-0104 | charlie@email.com
# Diana Prince    | 555-0105 | diana@email.com`,
      solutionCode: `class ContactBook:
    def __init__(self):
        """Initialize an empty contact book."""
        self.contacts = {}

    def add_contact(self, name, phone, email=""):
        """Add a new contact. If contact exists, return False."""
        if name in self.contacts:
            return False
        self.contacts[name] = {"phone": phone, "email": email}
        return True

    def update_contact(self, name, phone=None, email=None):
        """Update an existing contact's phone and/or email."""
        if name not in self.contacts:
            return False
        if phone is not None:
            self.contacts[name]["phone"] = phone
        if email is not None:
            self.contacts[name]["email"] = email
        return True

    def delete_contact(self, name):
        """Delete a contact by name."""
        if name in self.contacts:
            del self.contacts[name]
            return True
        return False

    def search(self, query):
        """Search contacts by name (case-insensitive, partial match)."""
        results = []
        query_lower = query.lower()
        for name, info in self.contacts.items():
            if query_lower in name.lower():
                results.append((name, info))
        return sorted(results, key=lambda x: x[0])

    def get_all_contacts(self):
        """Return all contacts sorted alphabetically by name."""
        return sorted(self.contacts.items(), key=lambda x: x[0])

    def group_by_letter(self):
        """Group contacts by first letter of name."""
        groups = {}
        for name, info in self.contacts.items():
            letter = name[0].upper()
            if letter not in groups:
                groups[letter] = []
            groups[letter].append((name, info))
        return groups

    def display(self):
        """Return a formatted string showing all contacts as a table."""
        contacts = self.get_all_contacts()
        lines = [f"Contact Book ({len(contacts)} contacts)"]
        lines.append("-" * 25)

        # Calculate column widths
        name_w = max(len("Name"), max((len(n) for n, _ in contacts), default=4))
        phone_w = max(len("Phone"), max((len(i["phone"]) for _, i in contacts), default=5))
        email_w = max(len("Email"), max((len(i["email"]) for _, i in contacts), default=5))

        header = f"{'Name'.ljust(name_w)} | {'Phone'.ljust(phone_w)} | Email"
        lines.append(header)

        for name, info in contacts:
            lines.append(f"{name.ljust(name_w)} | {info['phone'].ljust(phone_w)} | {info['email']}")

        return "\\n".join(lines)

    def __len__(self):
        """Return the number of contacts."""
        return len(self.contacts)

# Test cases
book = ContactBook()
book.add_contact("Alice Smith", "555-0101", "alice@email.com")
book.add_contact("Bob Jones", "555-0102", "bob@email.com")
book.add_contact("Alice Johnson", "555-0103", "alicej@email.com")
book.add_contact("Charlie Brown", "555-0104")
book.add_contact("Diana Prince", "555-0105", "diana@email.com")

print(len(book))
# Expected: 5

print(book.add_contact("Alice Smith", "555-9999"))
# Expected: False (duplicate)

book.update_contact("Charlie Brown", email="charlie@email.com")

results = book.search("alice")
print(len(results))
# Expected: 2

for name, info in results:
    print(f"{name}: {info['phone']}")
# Expected:
# Alice Smith: 555-0101
# Alice Johnson: 555-0103

book.delete_contact("Bob Jones")
print(len(book))
# Expected: 4

groups = book.group_by_letter()
print(sorted(groups.keys()))
# Expected: ['A', 'C', 'D']

print(book.display())
# Expected:
# Contact Book (4 contacts)
# -------------------------
# Name            | Phone    | Email
# Alice Johnson   | 555-0103 | alicej@email.com
# Alice Smith     | 555-0101 | alice@email.com
# Charlie Brown   | 555-0104 | charlie@email.com
# Diana Prince    | 555-0105 | diana@email.com`,
    },
    {
      id: "projects-calculator",
      slug: "simple-calculator",
      title: "Simple Calculator",
      content: `## Simple Calculator

Build a calculator that evaluates mathematical expressions. This project combines string parsing, functions, and error handling.

### Features

- Basic arithmetic: +, -, *, /
- Support parentheses (bonus)
- Handle errors gracefully
- Maintain a calculation history

### Hints

- Start with a simple version that handles "5 + 3" format
- Use \`split()\` to parse the expression
- Map operator strings to actual operations
- Use try/except for error handling`,
      starterCode: `class Calculator:
    def __init__(self):
        """Initialize calculator with empty history."""
        # TODO: Set up history list
        pass

    def add(self, a, b):
        """Return a + b"""
        # TODO: Implement and log to history
        pass

    def subtract(self, a, b):
        """Return a - b"""
        # TODO: Implement and log to history
        pass

    def multiply(self, a, b):
        """Return a * b"""
        # TODO: Implement and log to history
        pass

    def divide(self, a, b):
        """Return a / b. Return 'Error: Division by zero' if b is 0.
        Round result to 4 decimal places."""
        # TODO: Handle division by zero
        pass

    def power(self, base, exponent):
        """Return base ** exponent."""
        # TODO: Implement and log to history
        pass

    def evaluate(self, expression):
        """Evaluate a simple expression string like '5 + 3' or '10 * 2'.
        Supported operators: +, -, *, /, **
        Return the result or an error message string."""
        # TODO: Parse the expression, extract operands and operator
        # Handle invalid input gracefully
        pass

    def get_history(self):
        """Return calculation history as a list of strings like
        ['5 + 3 = 8', '10 * 2 = 20']"""
        # TODO: Return history
        pass

    def clear_history(self):
        """Clear the calculation history."""
        # TODO: Empty the history list
        pass

    def last_result(self):
        """Return the result of the last calculation.
        Return None if no calculations have been made."""
        # TODO: Return last result
        pass

# Test cases
calc = Calculator()

print(calc.add(5, 3))
# Expected: 8

print(calc.subtract(10, 4))
# Expected: 6

print(calc.multiply(6, 7))
# Expected: 42

print(calc.divide(10, 3))
# Expected: 3.3333

print(calc.divide(10, 0))
# Expected: Error: Division by zero

print(calc.power(2, 10))
# Expected: 1024

print(calc.evaluate("15 + 27"))
# Expected: 42

print(calc.evaluate("100 / 4"))
# Expected: 25.0

print(calc.evaluate("2 ** 8"))
# Expected: 256

print(calc.evaluate("hello + world"))
# Expected: Error: Invalid expression

print(calc.evaluate("10 / 0"))
# Expected: Error: Division by zero

history = calc.get_history()
print(len(history))
# Expected: 9

print(history[0])
# Expected: 5 + 3 = 8

print(calc.last_result())
# Expected: Error: Division by zero

calc.clear_history()
print(len(calc.get_history()))
# Expected: 0`,
      solutionCode: `class Calculator:
    def __init__(self):
        """Initialize calculator with empty history."""
        self.history = []
        self._last_result = None

    def _log(self, expression, result):
        """Log a calculation to history."""
        self.history.append(f"{expression} = {result}")
        self._last_result = result

    def add(self, a, b):
        """Return a + b"""
        result = a + b
        self._log(f"{a} + {b}", result)
        return result

    def subtract(self, a, b):
        """Return a - b"""
        result = a - b
        self._log(f"{a} - {b}", result)
        return result

    def multiply(self, a, b):
        """Return a * b"""
        result = a * b
        self._log(f"{a} * {b}", result)
        return result

    def divide(self, a, b):
        """Return a / b. Return error string if b is 0."""
        if b == 0:
            error = "Error: Division by zero"
            self._log(f"{a} / {b}", error)
            return error
        result = round(a / b, 4)
        self._log(f"{a} / {b}", result)
        return result

    def power(self, base, exponent):
        """Return base ** exponent."""
        result = base ** exponent
        self._log(f"{base} ** {exponent}", result)
        return result

    def evaluate(self, expression):
        """Evaluate a simple expression string like '5 + 3'."""
        try:
            parts = expression.strip().split()
            if len(parts) != 3:
                error = "Error: Invalid expression"
                self._log(expression, error)
                return error

            a_str, operator, b_str = parts

            try:
                a = float(a_str)
                b = float(b_str)
                # Convert to int if they are whole numbers
                if a == int(a):
                    a = int(a)
                if b == int(b):
                    b = int(b)
            except ValueError:
                error = "Error: Invalid expression"
                self._log(expression, error)
                return error

            if operator == "+":
                return self.add(a, b)
            elif operator == "-":
                return self.subtract(a, b)
            elif operator == "*":
                return self.multiply(a, b)
            elif operator == "/":
                return self.divide(a, b)
            elif operator == "**":
                return self.power(a, b)
            else:
                error = "Error: Unknown operator"
                self._log(expression, error)
                return error

        except Exception:
            error = "Error: Invalid expression"
            self._log(expression, error)
            return error

    def get_history(self):
        """Return calculation history as a list of strings."""
        return self.history[:]

    def clear_history(self):
        """Clear the calculation history."""
        self.history = []

    def last_result(self):
        """Return the result of the last calculation."""
        return self._last_result

# Test cases
calc = Calculator()

print(calc.add(5, 3))
# Expected: 8

print(calc.subtract(10, 4))
# Expected: 6

print(calc.multiply(6, 7))
# Expected: 42

print(calc.divide(10, 3))
# Expected: 3.3333

print(calc.divide(10, 0))
# Expected: Error: Division by zero

print(calc.power(2, 10))
# Expected: 1024

print(calc.evaluate("15 + 27"))
# Expected: 42

print(calc.evaluate("100 / 4"))
# Expected: 25.0

print(calc.evaluate("2 ** 8"))
# Expected: 256

print(calc.evaluate("hello + world"))
# Expected: Error: Invalid expression

print(calc.evaluate("10 / 0"))
# Expected: Error: Division by zero

history = calc.get_history()
print(len(history))
# Expected: 9

print(history[0])
# Expected: 5 + 3 = 8

print(calc.last_result())
# Expected: Error: Division by zero

calc.clear_history()
print(len(calc.get_history()))
# Expected: 0`,
    },
  ],
};
