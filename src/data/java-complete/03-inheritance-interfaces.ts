import { Module } from "../types";

export const module3: Module = {
  id: "inheritance-interfaces",
  title: "Inheritance, Polymorphism & Interfaces",
  description: "Master extends, implements, abstract classes, interfaces, and how polymorphism enables flexible design",
  lessons: [
    {
      id: "inheritance-polymorphism",
      slug: "inheritance-polymorphism",
      title: "Inheritance, @Override & Polymorphism",
      content: `
# Inheritance, @Override & Polymorphism

Inheritance lets a class acquire properties and behavior of another class. Polymorphism lets objects of different classes be treated uniformly.

\`\`\`concept
{
  "title": "Inheritance in Java",
  "description": "Java supports single inheritance (a class extends exactly one class). All classes implicitly extend Object. Use 'super' to call parent methods/constructors.",
  "points": [
    "extends: one class inherits from another",
    "super(): call parent constructor (must be first in child constructor)",
    "super.method(): call parent's version of an overridden method",
    "@Override annotation: tells compiler you're overriding — catches typos",
    "final class: cannot be subclassed (e.g., String, Integer)",
    "final method: cannot be overridden",
    "Constructors are NOT inherited"
  ]
}
\`\`\`

## Inheritance Hierarchy

\`\`\`java
// Base class (parent):
public class Shape {
    protected String color;

    public Shape(String color) {
        this.color = color;
    }

    public double area() {
        return 0.0; // default — subclasses should override
    }

    public String describe() {
        return String.format("A %s shape with area %.2f", color, area());
    }
}

// Subclass (child):
public class Circle extends Shape {
    private double radius;

    public Circle(String color, double radius) {
        super(color);   // MUST call parent constructor first
        this.radius = radius;
    }

    @Override  // tells compiler we're overriding — catches typos
    public double area() {
        return Math.PI * radius * radius;
    }

    @Override
    public String toString() {
        return String.format("Circle[color=%s, radius=%.2f]", color, radius);
    }
}

public class Rectangle extends Shape {
    private double width, height;

    public Rectangle(String color, double width, double height) {
        super(color);
        this.width = width;
        this.height = height;
    }

    @Override
    public double area() { return width * height; }
}

// Polymorphism: treat all shapes uniformly:
List<Shape> shapes = List.of(
    new Circle("red", 5),
    new Rectangle("blue", 4, 6),
    new Circle("green", 3)
);

for (Shape s : shapes) {
    System.out.println(s.area()); // calls the correct area() for each type
}

double totalArea = shapes.stream()
    .mapToDouble(Shape::area)
    .sum();
\`\`\`

## Casting & instanceof

\`\`\`java
Shape s = new Circle("red", 5); // Circle stored as Shape reference

// Unsafe cast — throws ClassCastException if wrong type:
Circle c = (Circle) s;  // OK here because s IS a Circle

// Safe check first:
if (s instanceof Circle) {
    Circle circle = (Circle) s;
    System.out.println(circle.getRadius());
}

// Java 16+ pattern matching — cleaner:
if (s instanceof Circle c) {       // cast + assignment in one step
    System.out.println(c.getRadius());
}

// Java 21 pattern matching in switch:
String result = switch (s) {
    case Circle c  -> "Circle with radius " + c.getRadius();
    case Rectangle r -> "Rectangle " + r.getWidth() + "x" + r.getHeight();
    default -> "Unknown shape";
};
\`\`\`

## Abstract Classes

\`\`\`java
// Abstract class: can't be instantiated, may have abstract methods
public abstract class Animal {
    protected String name;

    public Animal(String name) { this.name = name; }

    // Abstract: MUST be implemented by concrete subclasses
    public abstract String speak();

    // Concrete: shared implementation (subclasses can override)
    public void sleep() {
        System.out.println(name + " is sleeping...");
    }
}

public class Dog extends Animal {
    public Dog(String name) { super(name); }

    @Override
    public String speak() { return "Woof!"; }
}

// Animal a = new Animal("x"); // COMPILE ERROR — can't instantiate abstract
Animal dog = new Dog("Rex"); // OK — Dog IS-A Animal
dog.speak(); // "Woof!"
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "When must you call super() in a constructor?",
      "options": ["Always", "Only when the parent has no default constructor", "Only in abstract classes", "Never — Java calls it automatically"],
      "answer": 1,
      "explanation": "If the parent class has no no-arg constructor, you MUST explicitly call super(args) as the first statement in the child constructor. If the parent has a no-arg constructor, Java calls it implicitly."
    },
    {
      "q": "What is the purpose of @Override?",
      "options": ["Makes the method run faster", "Required to override methods", "Tells the compiler you intend to override — catches typos and signature mismatches", "Prevents the method from being overridden further"],
      "answer": 2,
      "explanation": "@Override is not required but is strongly recommended. Without it, a typo like 'euals()' instead of 'equals()' would silently create a NEW method instead of overriding. @Override catches this at compile time."
    }
  ]
}
\`\`\`
`,
    },
    {
      id: "interfaces-default",
      slug: "interfaces-default",
      title: "Interfaces, Default Methods & Functional Interfaces",
      content: `
# Interfaces, Default Methods & Functional Interfaces

Interfaces are Java's mechanism for defining contracts and enabling multiple inheritance of type.

\`\`\`concept
{
  "title": "Interface vs Abstract Class",
  "description": "Use interface when you're defining a ROLE or CAPABILITY (Comparable, Runnable, Serializable). Use abstract class when you're defining a BASE TYPE with shared implementation.",
  "points": [
    "A class can implement MULTIPLE interfaces (multiple inheritance of type)",
    "A class can extend only ONE class (single inheritance of implementation)",
    "Interface fields are implicitly public static final (constants)",
    "Interface methods are implicitly public abstract (before Java 8)",
    "Java 8+: interfaces can have default methods (concrete implementation)",
    "Java 8+: interfaces can have static methods",
    "Functional interface: exactly ONE abstract method — usable as lambda"
  ]
}
\`\`\`

## Interface Anatomy (Modern Java)

\`\`\`java
public interface Printable {
    // Abstract method (implicit public abstract):
    void print();

    // Default method — provides implementation, can be overridden:
    default void printTwice() {
        print();
        print();
    }

    // Static method — called on the interface:
    static Printable of(String content) {
        return () -> System.out.println(content); // lambda!
    }

    // Constant (implicit public static final):
    int MAX_SIZE = 1000;
}

// Implement multiple interfaces:
public class Document implements Printable, Comparable<Document> {
    private String title;
    private String content;

    @Override
    public void print() {
        System.out.println("=== " + title + " ===");
        System.out.println(content);
    }

    @Override
    public int compareTo(Document other) {
        return this.title.compareTo(other.title);
    }
}
\`\`\`

## Interface vs Abstract Class

\`\`\`compare
{
  "left": {
    "label": "When to Use Interface",
    "code": "// Interface = contract / capability\\n// Multiple implementation OK\\n\\ninterface Flyable { void fly(); }\\ninterface Swimmable { void swim(); }\\n\\n// Duck can do both:\\nclass Duck extends Bird\\n      implements Flyable, Swimmable {\\n    @Override public void fly() { ... }\\n    @Override public void swim() { ... }\\n}\\n\\n// Examples from JDK:\\n// Comparable, Iterable, Runnable,\\n// Serializable, Cloneable, AutoCloseable"
  },
  "right": {
    "label": "When to Use Abstract Class",
    "code": "// Abstract class = shared state + behavior\\n// Forces IS-A relationship\\n\\nabstract class Vehicle {\\n    private String make;\\n    private int year;\\n    protected int speed = 0;\\n\\n    // Shared implementation:\\n    public void accelerate(int delta) {\\n        speed += delta;\\n    }\\n\\n    // Subclass must define:\\n    public abstract String fuelType();\\n}\\n\\nclass ElectricCar extends Vehicle {\\n    @Override\\n    public String fuelType() { return \\"Electric\\"; }\\n}"
  }
}
\`\`\`

## Functional Interfaces & Lambdas

\`\`\`java
// Functional interface: exactly ONE abstract method
@FunctionalInterface
interface Calculator {
    double calculate(double a, double b);
}

// Traditional anonymous class:
Calculator add = new Calculator() {
    @Override
    public double calculate(double a, double b) { return a + b; }
};

// Lambda (shorter):
Calculator add = (a, b) -> a + b;
Calculator multiply = (a, b) -> a * b;

System.out.println(add.calculate(3, 4));      // 7.0
System.out.println(multiply.calculate(3, 4)); // 12.0

// Built-in functional interfaces (java.util.function):
// Predicate<T>     : T -> boolean (test conditions)
// Function<T, R>   : T -> R (transform)
// Consumer<T>      : T -> void (process)
// Supplier<T>      : () -> T (produce)
// BiFunction<T,U,R>: (T, U) -> R

Predicate<String> isLong = s -> s.length() > 5;
Function<String, Integer> getLength = String::length;  // method reference
Consumer<String> printer = System.out::println;        // method reference
Supplier<List<String>> listFactory = ArrayList::new;   // constructor reference

isLong.test("Hello");     // false
getLength.apply("Java");  // 4
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Can an interface have instance fields?",
      "options": ["Yes, private fields", "Yes, but they must be initialized", "No — all interface fields are implicitly public static final (constants)", "Yes, protected fields"],
      "answer": 2,
      "explanation": "All fields in an interface are implicitly public static final. You cannot have instance fields in interfaces. Use abstract classes if you need instance state."
    },
    {
      "q": "What is a functional interface?",
      "options": ["An interface with no methods", "An interface with exactly one abstract method — can be implemented with a lambda", "An interface that performs functions", "An interface in the java.util.function package"],
      "answer": 1,
      "explanation": "A functional interface has exactly one abstract method. The @FunctionalInterface annotation enforces this. Any functional interface can be implemented using a lambda expression."
    },
    {
      "q": "What does a default method in an interface allow?",
      "options": ["Fields in interfaces", "Implementing classes to skip @Override", "Adding methods to existing interfaces without breaking implementors", "Abstract methods with bodies"],
      "answer": 2,
      "explanation": "Default methods allow backward-compatible additions to interfaces. Without them, adding a method to an interface would break all existing implementations."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
