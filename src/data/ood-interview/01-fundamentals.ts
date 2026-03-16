import { Module } from "../types";

export const fundamentalsModule: Module = {
  id: "ood-fundamentals",
  title: "OOD Fundamentals",
  description: "Master the foundational concepts of object-oriented design including SOLID principles, UML diagrams, design patterns, and a proven interview framework.",
  lessons: [
    {
      id: "ood-fund-1",
      slug: "intro-to-ood",
      title: "Introduction to Object-Oriented Design",
      content: `# Introduction to Object-Oriented Design

## Why Object-Oriented Design Matters

Object-Oriented Design (OOD) is the process of planning a system of interacting objects to solve a software problem. In interviews, OOD questions test your ability to **break down complex real-world systems** into manageable, extensible components.

Unlike coding questions that test algorithmic thinking, OOD questions evaluate your ability to:

- **Identify entities and relationships** in a problem domain
- **Apply abstraction** to hide complexity behind clean interfaces
- **Design for extensibility** so the system can grow without rewrites
- **Communicate your design** clearly with diagrams and code

## The Four Pillars of OOP

### 1. Encapsulation
Bundle data (attributes) and methods (behavior) that operate on that data into a single unit (class). Hide internal state and require all interaction through well-defined interfaces.

\`\`\`python
class BankAccount:
    def __init__(self, owner: str, balance: float = 0):
        self._owner = owner        # protected
        self.__balance = balance    # private

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self.__balance += amount

    def get_balance(self) -> float:
        return self.__balance
\`\`\`

### 2. Abstraction
Expose only the essential features of an object while hiding implementation details. Use abstract classes and interfaces to define contracts.

\`\`\`python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass

    @abstractmethod
    def perimeter(self) -> float:
        pass
\`\`\`

### 3. Inheritance
Create new classes based on existing ones. The child class inherits attributes and methods from the parent, enabling code reuse.

\`\`\`python
class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        return 3.14159 * self.radius ** 2

    def perimeter(self) -> float:
        return 2 * 3.14159 * self.radius
\`\`\`

### 4. Polymorphism
Objects of different classes can be treated through the same interface. A single method call can behave differently depending on the object type.

\`\`\`python
def print_shape_info(shape: Shape):
    # Works with Circle, Rectangle, Triangle, etc.
    print(f"Area: {shape.area()}")
    print(f"Perimeter: {shape.perimeter()}")
\`\`\`

## OOD vs. System Design

| Aspect | OOD | System Design |
|--------|-----|---------------|
| Focus | Classes, objects, relationships | Distributed infrastructure |
| Output | Class diagram + code | Architecture diagram |
| Scale | Single service/component | Multi-service system |
| Patterns | Gang of Four patterns | CAP theorem, sharding |
| Interview Level | Mid-level | Senior+ |

## Key Takeaway

OOD is about **modeling the right abstractions**. A good design makes the system easy to understand, extend, and maintain. In interviews, the journey matters more than the destination -- interviewers want to see your **thought process**, not a perfect final answer.
`,
    },
    {
      id: "ood-fund-2",
      slug: "solid-principles",
      title: "SOLID Principles",
      content: `# SOLID Principles

SOLID is an acronym for five design principles that make software designs more understandable, flexible, and maintainable. These principles are the **foundation of good OOD** and interviewers expect you to apply them naturally.

## S -- Single Responsibility Principle (SRP)

> A class should have only one reason to change.

Each class should do **one thing well**. If a class handles both user authentication and email sending, it has two reasons to change.

\`\`\`python
# BAD: Two responsibilities
class UserManager:
    def authenticate(self, username, password): ...
    def send_welcome_email(self, user): ...

# GOOD: Separated responsibilities
class Authenticator:
    def authenticate(self, username, password): ...

class EmailService:
    def send_welcome_email(self, user): ...
\`\`\`

## O -- Open/Closed Principle (OCP)

> Software entities should be open for extension, closed for modification.

You should be able to add new behavior **without changing existing code**. Use inheritance and polymorphism.

\`\`\`python
class DiscountStrategy(ABC):
    @abstractmethod
    def calculate(self, price: float) -> float: ...

class NoDiscount(DiscountStrategy):
    def calculate(self, price: float) -> float:
        return price

class PercentageDiscount(DiscountStrategy):
    def __init__(self, percent: float):
        self.percent = percent
    def calculate(self, price: float) -> float:
        return price * (1 - self.percent / 100)

# Adding a new discount type requires NO changes to existing classes
class BuyOneGetOneFree(DiscountStrategy):
    def calculate(self, price: float) -> float:
        return price / 2
\`\`\`

## L -- Liskov Substitution Principle (LSP)

> Objects of a superclass should be replaceable with objects of a subclass without breaking the program.

If \`Bird\` has a \`fly()\` method, \`Penguin\` (which cannot fly) should not inherit from \`Bird\` -- or \`fly()\` should not be in the \`Bird\` base class.

\`\`\`python
# BAD: Penguin breaks the contract
class Bird:
    def fly(self): ...

class Penguin(Bird):
    def fly(self):
        raise Exception("Can't fly!")  # Violates LSP

# GOOD: Separate the contract
class Bird(ABC):
    @abstractmethod
    def move(self): ...

class FlyingBird(Bird):
    def move(self):
        print("Flying")

class Penguin(Bird):
    def move(self):
        print("Swimming")
\`\`\`

## I -- Interface Segregation Principle (ISP)

> Clients should not be forced to depend on interfaces they do not use.

Break large interfaces into smaller, focused ones.

\`\`\`python
# BAD: Forces all workers to implement eat()
class Worker(ABC):
    @abstractmethod
    def work(self): ...
    @abstractmethod
    def eat(self): ...

# GOOD: Separated interfaces
class Workable(ABC):
    @abstractmethod
    def work(self): ...

class Feedable(ABC):
    @abstractmethod
    def eat(self): ...

class Human(Workable, Feedable):
    def work(self): ...
    def eat(self): ...

class Robot(Workable):
    def work(self): ...
\`\`\`

## D -- Dependency Inversion Principle (DIP)

> High-level modules should not depend on low-level modules. Both should depend on abstractions.

\`\`\`python
# BAD: High-level depends on low-level
class MySQLDatabase:
    def save(self, data): ...

class UserRepository:
    def __init__(self):
        self.db = MySQLDatabase()  # Tight coupling!

# GOOD: Both depend on abstraction
class Database(ABC):
    @abstractmethod
    def save(self, data): ...

class UserRepository:
    def __init__(self, db: Database):
        self.db = db  # Injected dependency
\`\`\`

## Applying SOLID in Interviews

When designing a system, mention SOLID naturally: "I'll separate \`PaymentProcessor\` from \`OrderManager\` to follow SRP" or "I'll use a strategy pattern here to keep it open for extension."
`,
    },
    {
      id: "ood-fund-3",
      slug: "uml-class-diagrams",
      title: "UML Class Diagrams",
      content: `# UML Class Diagrams

UML (Unified Modeling Language) class diagrams are the standard way to **visualize class relationships** in OOD interviews. You do not need to draw perfect UML, but you must communicate class structures clearly on a whiteboard.

## Class Notation

A class is drawn as a rectangle divided into three sections:

\`\`\`
+------------------+
|    ClassName     |
+------------------+
| - privateAttr    |
| # protectedAttr  |
| + publicAttr     |
+------------------+
| + publicMethod() |
| - privateMethod()|
+------------------+
\`\`\`

**Visibility markers:**
- \`+\` Public
- \`-\` Private
- \`#\` Protected

## Relationships

### 1. Association (has-a, uses)
A general relationship between two classes. Drawn as a **solid line**.

\`\`\`
+--------+          +--------+
| Driver |----------| Car    |
+--------+          +--------+
\`\`\`

A Driver "uses" a Car. Neither owns the other.

### 2. Aggregation (has-a, weak ownership)
A special association where one class **contains** another, but both can exist independently. Drawn with an **empty diamond**.

\`\`\`
+------------+  <>---  +---------+
| Department |--------| Employee |
+------------+        +---------+
\`\`\`

A Department has Employees, but Employees can exist without the Department.

### 3. Composition (has-a, strong ownership)
A stronger form of aggregation where the contained object **cannot exist** without the container. Drawn with a **filled diamond**.

\`\`\`
+---------+  *---  +--------+
|  House  |-------| Room   |
+---------+       +--------+
\`\`\`

A Room cannot exist without its House. If the House is destroyed, so are the Rooms.

### 4. Inheritance (is-a)
A child class inherits from a parent class. Drawn with an **empty triangle arrowhead**.

\`\`\`
    +--------+
    | Animal |
    +--------+
       /\\
      /  \\
+-----+ +-----+
| Dog | | Cat |
+-----+ +-----+
\`\`\`

### 5. Implementation (implements interface)
A class implements an interface/abstract class. Drawn with a **dashed line and empty triangle**.

\`\`\`
   <<interface>>
   +-----------+
   | Printable |
   +-----------+
        ^
        |  (dashed)
   +---------+
   | Invoice |
   +---------+
\`\`\`

## Multiplicity

Numbers at the ends of relationship lines show how many instances participate:

| Notation | Meaning |
|----------|---------|
| 1 | Exactly one |
| 0..1 | Zero or one |
| * | Zero or more |
| 1..* | One or more |
| 3..5 | Three to five |

Example: A Library has 1..* Books. A Book belongs to exactly 1 Library.

\`\`\`
+---------+ 1    1..* +------+
| Library |----------| Book |
+---------+          +------+
\`\`\`

## Interview Tips for Diagrams

1. **Start with nouns** -- they become classes
2. **Verbs become methods** -- "checkout book" becomes \`Library.checkout(book)\`
3. **Adjectives suggest attributes** -- "available book" means Book has \`is_available\`
4. **Use composition for lifecycle dependency** -- If parent dies, child dies
5. **Use aggregation for shared objects** -- The object can be referenced by multiple parents
6. **Keep it simple** -- You only need 5-8 core classes. Do not overdesign.

## Practice

Before moving to design problems, practice drawing class diagrams for everyday objects: a music playlist system, a restaurant ordering system, or a university enrollment system. Identify the classes, attributes, methods, and relationships.
`,
    },
    {
      id: "ood-fund-4",
      slug: "design-patterns-overview",
      title: "Design Patterns Overview",
      content: `# Design Patterns Overview

Design patterns are **reusable solutions to common software design problems**. They are not code you copy-paste, but templates for how to structure your classes. In OOD interviews, knowing when to apply the right pattern demonstrates design maturity.

## Creational Patterns

### Factory Method
Creates objects without specifying the exact class. The factory method defines an interface for creation, and subclasses decide which class to instantiate.

\`\`\`python
from abc import ABC, abstractmethod

class Notification(ABC):
    @abstractmethod
    def send(self, message: str): ...

class EmailNotification(Notification):
    def send(self, message: str):
        print(f"Email: {message}")

class SMSNotification(Notification):
    def send(self, message: str):
        print(f"SMS: {message}")

class NotificationFactory:
    @staticmethod
    def create(channel: str) -> Notification:
        if channel == "email":
            return EmailNotification()
        elif channel == "sms":
            return SMSNotification()
        raise ValueError(f"Unknown channel: {channel}")
\`\`\`

**Use when:** You need to create objects but the exact type depends on runtime conditions.

### Singleton
Ensures a class has **exactly one instance** and provides global access to it. Common for database connections, configuration managers, and caches.

\`\`\`python
class DatabaseConnection:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True
        self.connection = "Connected to DB"
\`\`\`

**Use when:** Exactly one instance of a resource should exist system-wide.

## Behavioral Patterns

### Observer
Defines a one-to-many dependency so that when one object changes state, all dependents are **notified automatically**.

\`\`\`python
class EventManager:
    def __init__(self):
        self._subscribers: dict[str, list] = {}

    def subscribe(self, event: str, callback):
        self._subscribers.setdefault(event, []).append(callback)

    def notify(self, event: str, data=None):
        for callback in self._subscribers.get(event, []):
            callback(data)
\`\`\`

**Use when:** Multiple objects need to react to changes in another object (e.g., UI updates, notifications, logging).

### Strategy
Defines a family of algorithms, encapsulates each one, and makes them **interchangeable** at runtime.

\`\`\`python
class SortStrategy(ABC):
    @abstractmethod
    def sort(self, data: list) -> list: ...

class QuickSort(SortStrategy):
    def sort(self, data: list) -> list:
        # quicksort implementation
        return sorted(data)

class MergeSort(SortStrategy):
    def sort(self, data: list) -> list:
        # mergesort implementation
        return sorted(data)

class Sorter:
    def __init__(self, strategy: SortStrategy):
        self._strategy = strategy

    def sort(self, data: list) -> list:
        return self._strategy.sort(data)
\`\`\`

**Use when:** You have multiple algorithms for the same task and want to switch between them without changing client code.

### Command
Encapsulates a request as an object, allowing you to parameterize actions, queue them, and support **undo/redo**.

\`\`\`python
class Command(ABC):
    @abstractmethod
    def execute(self): ...
    @abstractmethod
    def undo(self): ...

class AddTextCommand(Command):
    def __init__(self, document, text):
        self.document = document
        self.text = text

    def execute(self):
        self.document.add(self.text)

    def undo(self):
        self.document.remove(self.text)
\`\`\`

**Use when:** You need undo/redo, transaction logging, or deferred execution.

## Structural Patterns

### Adapter
Converts the interface of one class into another interface that clients expect. Acts as a **bridge** between incompatible interfaces.

### Decorator
Dynamically adds new behavior to objects by wrapping them. Each decorator adds one responsibility.

## Pattern Selection in Interviews

| Problem | Pattern |
|---------|---------|
| Need to create objects dynamically | Factory |
| Single shared resource | Singleton |
| React to state changes | Observer |
| Swap algorithms at runtime | Strategy |
| Undo/redo support | Command |
| ATM/vending machine states | State |
`,
    },
    {
      id: "ood-fund-5",
      slug: "ood-interview-framework",
      title: "OOD Interview Framework",
      content: `# OOD Interview Framework

A structured approach to OOD interviews ensures you cover all the important aspects while demonstrating clear thinking. Use this **5-step framework** for every design problem.

## Step 1: Clarify Requirements (3-5 minutes)

Ask questions to narrow the scope. Interviewers deliberately leave problems vague to test whether you can identify ambiguity.

**Questions to ask:**
- Who are the **actors** (users) of this system?
- What are the **core use cases**? (List 5-8, then confirm which to focus on)
- What are the **constraints**? (Scale, concurrency, real-time requirements)
- Should I handle **edge cases** like X, Y, Z?

\`\`\`
Example for "Design a Parking Lot":
- Actors: Driver, Parking Attendant, Admin
- Core use cases: Park vehicle, Remove vehicle, Check availability
- Constraints: Multiple floors? Multiple vehicle types? Payment?
- Edge cases: Lot full, Invalid ticket, Handicapped spots
\`\`\`

## Step 2: Identify Core Objects (3-5 minutes)

Extract the **nouns** from your requirements -- these become classes.

**Technique:** Write down every noun from your requirements discussion, then group related ones and eliminate duplicates.

For a Parking Lot:
- ParkingLot, ParkingFloor, ParkingSpot
- Vehicle, Car, Truck, Motorcycle
- Ticket, Payment
- EntranceGate, ExitGate
- DisplayBoard

## Step 3: Define Relationships (5-7 minutes)

Draw a class diagram showing how objects relate. Determine:

- **Is-a** relationships (inheritance): Car is-a Vehicle
- **Has-a** relationships (composition/aggregation): ParkingLot has ParkingFloors
- **Uses** relationships: EntranceGate uses DisplayBoard

\`\`\`
ParkingLot *--- ParkingFloor *--- ParkingSpot
Vehicle <|-- Car, Truck, Motorcycle
ParkingSpot --> Vehicle (association)
Ticket --> ParkingSpot
EntranceGate --> Ticket (creates)
ExitGate --> Payment (processes)
\`\`\`

## Step 4: Define Key Methods (5-7 minutes)

For each core class, define the **public API** -- the methods other objects will call.

\`\`\`python
class ParkingLot:
    def park_vehicle(self, vehicle: Vehicle) -> Ticket: ...
    def remove_vehicle(self, ticket: Ticket) -> Payment: ...
    def get_available_spots(self, vehicle_type: VehicleType) -> int: ...
    def is_full(self) -> bool: ...
\`\`\`

**Focus on:**
- Method signatures (parameters and return types)
- Which class owns which behavior
- How classes communicate (direct calls vs. events)

## Step 5: Implement Core Logic (10-15 minutes)

Write the actual implementation of 2-3 key classes. You will not have time to implement everything -- pick the classes with the most **interesting logic**.

**Prioritize implementing:**
1. The main orchestrator class (e.g., ParkingLot)
2. One class with non-trivial logic (e.g., finding the optimal parking spot)
3. One class that demonstrates a design pattern

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Jumping straight to code | Always start with requirements |
| Too many classes | Focus on 5-8 core classes |
| No enums for types | Use enums for status, type, category |
| Ignoring concurrency | Mention thread safety for shared resources |
| No error handling | Raise exceptions for invalid operations |
| Monolithic god class | Distribute responsibility across classes |

## The "Tell, Don't Ask" Principle

Instead of pulling data out of an object and making decisions externally, **tell the object what to do**. This keeps logic close to data and produces better encapsulation.

\`\`\`python
# BAD: Ask for data, decide externally
if order.get_status() == "paid":
    order.set_status("shipped")

# GOOD: Tell the object what to do
order.ship()  # Order validates internally
\`\`\`

## Practice Makes Perfect

The upcoming modules each present a classic OOD interview problem. For each one, try solving it yourself first using this framework before reading the solution.
`,
    },
  ],
};
