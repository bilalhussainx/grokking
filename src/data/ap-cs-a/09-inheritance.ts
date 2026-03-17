import { Module } from "../types";

export const inheritanceModule: Module = {
  id: "ap-csa-inheritance",
  title: "Inheritance",
  description:
    "Build class hierarchies using inheritance -- superclasses, subclasses, method overriding, and polymorphism.",
  lessons: [
    {
      id: "ap-csa-superclass-subclass",
      slug: "superclass-subclass",
      title: "Superclasses and Subclasses",
      content: `## Superclasses and Subclasses

<!-- voice:section_check concept="inheritance as an is-a relationship" -->
## Building on What Exists

Imagine you are designing a game with different character types: Warriors, Mages, and Archers. They all share common traits -- a name, health points, and the ability to take damage. But each type also has unique abilities.

You could copy-paste the shared code into every class, but that is wasteful and error-prone. **Inheritance** lets you write the shared code once in a parent class (called a **superclass**) and let child classes (called **subclasses**) automatically inherit it.

### Java Syntax

\`\`\`java
public class Character {           // Superclass
    String name;
    int health;

    public Character(String name) {
        this.name = name;
        this.health = 100;
    }

    public void takeDamage(int amount) {
        health -= amount;
    }
}

public class Warrior extends Character {  // Subclass
    int armor;

    public Warrior(String name, int armor) {
        super(name);              // Call superclass constructor
        this.armor = armor;
    }
}
\`\`\`

### Python Equivalent

\`\`\`python
class Character:                    # Superclass
    def __init__(self, name):
        self.name = name
        self.health = 100

    def take_damage(self, amount):
        self.health -= amount

class Warrior(Character):           # Subclass
    def __init__(self, name, armor):
        super().__init__(name)      # Call superclass constructor
        self.armor = armor
\`\`\`

<!-- voice:key_insight insight="Inheritance models an is-a relationship. A Warrior IS A Character. If you cannot say 'SubclassX is a SuperclassY' and have it make sense, inheritance is the wrong tool." -->

### The \`super()\` Keyword

When a subclass has its own \`__init__\`, it must call the superclass constructor using \`super().__init__(...)\`. This ensures the inherited attributes (like \`name\` and \`health\`) are properly initialized.

### What Gets Inherited?

| Inherited | Not Inherited |
|-----------|---------------|
| Methods | Constructors (must call \`super()\`) |
| Instance variables | Private methods (in Java) |
| Properties | |

### Reflection Questions

1. Why is inheritance described as an "is-a" relationship?
2. What would happen if a subclass forgot to call \`super().__init__()\`?
3. When would inheritance be a poor design choice?

### Deeper Reading
- AP CSA Unit 9: Inheritance
- *Head First Object-Oriented Analysis and Design*, O'Reilly, 2006, Chapter 8`,
    },
    {
      id: "ap-csa-method-overriding",
      slug: "method-overriding",
      title: "Method Overriding",
      content: `## Method Overriding

<!-- voice:section_check concept="overriding a method to change behavior in a subclass" -->
## Same Name, Different Behavior

A subclass can **override** a method from its superclass by defining a method with the exact same name. When the method is called on a subclass object, the subclass version runs instead of the superclass version.

### Example: Different Attack Styles

\`\`\`python
class Character:
    def __init__(self, name):
        self.name = name
        self.health = 100

    def attack(self):
        return f"{self.name} attacks for 10 damage"

class Warrior(Character):
    def attack(self):                     # Override
        return f"{self.name} swings a sword for 25 damage"

class Mage(Character):
    def attack(self):                     # Override
        return f"{self.name} casts a fireball for 30 damage"
\`\`\`

\`\`\`python
hero = Warrior("Thor")
wizard = Mage("Gandalf")
print(hero.attack())     # "Thor swings a sword for 25 damage"
print(wizard.attack())   # "Gandalf casts a fireball for 30 damage"
\`\`\`

Each subclass provides its own version of \`attack()\`, replacing the generic superclass behavior.

<!-- voice:key_insight insight="Overriding changes WHAT a method does. The method name stays the same, but the subclass provides a specialized implementation. The superclass version still exists and can be called with super().method_name()." -->

### Calling the Superclass Version

Sometimes you want to extend the superclass behavior, not replace it entirely:

\`\`\`python
class HealingMage(Mage):
    def attack(self):
        base_attack = super().attack()     # Call Mage's attack
        self.health += 5                    # Also heal self
        return f"{base_attack} and heals 5 HP"
\`\`\`

### Java's \`@Override\` Annotation

In Java, you mark overridden methods with \`@Override\`. This is not required but strongly recommended -- the compiler will catch you if the method signature does not actually match a superclass method.

\`\`\`java
@Override
public String attack() {
    return name + " swings a sword for 25 damage";
}
\`\`\`

### Reflection Questions

1. What is the difference between overriding a method and overloading a method?
2. When would you call \`super().method_name()\` inside an overridden method?
3. Why does Java recommend the \`@Override\` annotation?

### Deeper Reading
- AP CSA Unit 9: Overriding Methods
- *Effective Java* by Joshua Bloch, Addison-Wesley, 2018, Item 40`,
    },
    {
      id: "ap-csa-polymorphism",
      slug: "polymorphism",
      title: "Polymorphism",
      content: `## Polymorphism

<!-- voice:section_check concept="polymorphism lets one variable hold different types" -->
## One Interface, Many Forms

**Polymorphism** (from Greek: "many forms") means that a variable of a superclass type can hold an object of any subclass type -- and when you call a method on it, the correct subclass version runs automatically.

### Example: A Party of Characters

\`\`\`python
class Character:
    def __init__(self, name):
        self.name = name

    def attack(self):
        return f"{self.name} attacks"

class Warrior(Character):
    def attack(self):
        return f"{self.name} swings a sword"

class Mage(Character):
    def attack(self):
        return f"{self.name} casts a spell"

class Archer(Character):
    def attack(self):
        return f"{self.name} shoots an arrow"
\`\`\`

\`\`\`python
# A list of Character -- but each is a different subclass
party = [Warrior("Thor"), Mage("Gandalf"), Archer("Legolas")]

for member in party:
    print(member.attack())  # Each calls its OWN version
\`\`\`

Output:
\`\`\`
Thor swings a sword
Gandalf casts a spell
Legolas shoots an arrow
\`\`\`

The loop treats every element as a \`Character\`, but Python automatically calls the correct overridden \`attack()\` method for each object. This is polymorphism in action.

<!-- voice:key_insight insight="Polymorphism lets you write code that works with the superclass type, and it automatically does the right thing for any subclass. You do not need to check what type an object is -- just call the method." -->

### Why Polymorphism Matters

Without polymorphism, you would need ugly type-checking:

\`\`\`python
# BAD -- manual type checking
for member in party:
    if isinstance(member, Warrior):
        print(member.name + " swings a sword")
    elif isinstance(member, Mage):
        print(member.name + " casts a spell")
    # ... endless elif chains
\`\`\`

With polymorphism, you just call \`member.attack()\` and trust that each object knows how to handle it. Adding a new character type requires zero changes to the loop.

### Java's Static Typing and Polymorphism

In Java, polymorphism works through the declared type vs. the actual type:

\`\`\`java
Character hero = new Warrior("Thor");  // Declared: Character, Actual: Warrior
hero.attack();  // Calls Warrior's attack(), not Character's
\`\`\`

### Reflection Questions

1. Why does polymorphism eliminate the need for \`isinstance()\` checks?
2. How does adding a new subclass affect existing code that uses polymorphism?
3. What is the difference between the declared type and the actual type of a variable?

### Deeper Reading
- AP CSA Unit 9: Polymorphism
- *Clean Code* by Robert C. Martin, Prentice Hall, 2009, Chapter 6`,
    },
    {
      id: "ap-csa-inheritance-exercise",
      slug: "inheritance-exercise",
      title: "Practice: Inheritance",
      content: `## Practice: Inheritance

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->

Build a class hierarchy and use polymorphism to process different types through a shared interface.`,
      starterCode: `class Shape:
    """Base class for all shapes."""
    def __init__(self, name):
        self.name = name

    def area(self):
        """Return the area of the shape."""
        return 0

    def describe(self):
        """Return a description string."""
        return f"{self.name}: area = {self.area():.2f}"


class Circle(Shape):
    """A circle with a given radius."""
    def __init__(self, radius):
        # TODO: Call super().__init__ with "Circle"
        # TODO: Store the radius
        pass

    def area(self):
        # TODO: Return pi * radius^2 (use 3.14159)
        pass


class Rectangle(Shape):
    """A rectangle with width and height."""
    def __init__(self, width, height):
        # TODO: Call super().__init__ with "Rectangle"
        # TODO: Store width and height
        pass

    def area(self):
        # TODO: Return width * height
        pass


class Triangle(Shape):
    """A triangle with base and height."""
    def __init__(self, base, height):
        # TODO: Call super().__init__ with "Triangle"
        # TODO: Store base and height
        pass

    def area(self):
        # TODO: Return 0.5 * base * height
        pass


def total_area(shapes):
    """Return the total area of all shapes in the list.
    Uses polymorphism -- works with any Shape subclass.
    """
    # TODO: Sum the area of each shape
    pass


# Tests
shapes = [Circle(5), Rectangle(4, 6), Triangle(3, 8)]
for s in shapes:
    print(s.describe())
# Expected:
# Circle: area = 78.54
# Rectangle: area = 24.00
# Triangle: area = 12.00

print(f"Total: {total_area(shapes):.2f}")  # Expected: 114.54
`,
      solutionCode: `class Shape:
    """Base class for all shapes."""
    def __init__(self, name):
        self.name = name

    def area(self):
        """Return the area of the shape."""
        return 0

    def describe(self):
        """Return a description string."""
        return f"{self.name}: area = {self.area():.2f}"


class Circle(Shape):
    """A circle with a given radius."""
    def __init__(self, radius):
        super().__init__("Circle")
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2


class Rectangle(Shape):
    """A rectangle with width and height."""
    def __init__(self, width, height):
        super().__init__("Rectangle")
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height


class Triangle(Shape):
    """A triangle with base and height."""
    def __init__(self, base, height):
        super().__init__("Triangle")
        self.base = base
        self.height = height

    def area(self):
        return 0.5 * self.base * self.height


def total_area(shapes):
    """Return the total area of all shapes in the list."""
    total = 0
    for shape in shapes:
        total += shape.area()
    return total


# Tests
shapes = [Circle(5), Rectangle(4, 6), Triangle(3, 8)]
for s in shapes:
    print(s.describe())
# Expected:
# Circle: area = 78.54
# Rectangle: area = 24.00
# Triangle: area = 12.00

print(f"Total: {total_area(shapes):.2f}")  # Expected: 114.54
`,
    },
    {
      id: "ap-csa-inheritance-checkpoint",
      slug: "inheritance-checkpoint",
      title: "Checkpoint: Inheritance",
      content: `## Checkpoint: Inheritance

Nice work completing the Inheritance module! Let's review the key concepts.

<!-- voice:section_check concept="superclass/subclass, overriding, and polymorphism" -->

### Question 1
What keyword does Python use to call a superclass method from a subclass?

<details>
<summary>Show Answer</summary>

**\`super()\`** -- For example, \`super().__init__(name)\` calls the superclass constructor.
</details>

### Question 2
What is the output?
\`\`\`python
class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"

animals = [Dog(), Cat(), Dog()]
for a in animals:
    print(a.speak())
\`\`\`

<details>
<summary>Show Answer</summary>

\`\`\`
Woof!
Meow!
Woof!
\`\`\`
Each object calls its own overridden \`speak()\` method. This is polymorphism.
</details>

### Question 3
True or False: A subclass inherits the constructor of its superclass automatically.

<details>
<summary>Show Answer</summary>

**False** -- Constructors are NOT inherited. A subclass must define its own \`__init__\` and call \`super().__init__(...)\` to initialize the superclass portion.
</details>

### Question 4
What is the difference between method overriding and method overloading?

<details>
<summary>Show Answer</summary>

**Overriding** means a subclass provides a new implementation for a method that already exists in the superclass (same name, same parameters). **Overloading** means defining multiple methods with the same name but different parameter lists (supported in Java, not natively in Python).
</details>

### Question 5
Why is polymorphism better than using \`isinstance()\` checks?

<details>
<summary>Show Answer</summary>

Polymorphism lets you add new subclasses without modifying existing code. With \`isinstance()\` checks, every new type requires adding another \`elif\` branch everywhere. Polymorphism follows the Open-Closed Principle: open for extension, closed for modification.
</details>

### Excellent!
Next up: Recursion -- functions that call themselves.`,
    },
  ],
};
