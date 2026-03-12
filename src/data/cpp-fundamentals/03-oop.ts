import { Module } from "../types";

export const cppOopModule: Module = {
  id: "cpp-oop",
  title: "Object-Oriented Programming",
  description:
    "Master C++ OOP — classes, inheritance, polymorphism, operator overloading, and templates — using Python exercises.",
  lessons: [
    {
      id: "cpp-oop-intro",
      slug: "cpp-oop-intro",
      title: "Introduction to C++ OOP",
      content: `## Object-Oriented Programming in C++

### Classes in C++

\`\`\`cpp
class Animal {
private:
    std::string name;
    int age;

public:
    // Constructor
    Animal(std::string n, int a) : name(n), age(a) {}

    // Destructor
    ~Animal() { std::cout << name << " destroyed\\n"; }

    // Virtual method (enables polymorphism)
    virtual std::string speak() const {
        return "...";
    }

    // Getter
    std::string getName() const { return name; }
};

class Dog : public Animal {
public:
    Dog(std::string n, int a) : Animal(n, a) {}

    std::string speak() const override {
        return "Woof!";
    }
};
\`\`\`

### Key C++ OOP Concepts

| Concept | C++ | Python |
|---------|-----|--------|
| Access control | \`private\`, \`protected\`, \`public\` | Convention (\`_\`, \`__\`) |
| Inheritance | \`: public Base\` | \`class D(Base)\` |
| Virtual methods | \`virtual\` keyword | All methods are virtual |
| Pure virtual | \`= 0\` | \`@abstractmethod\` |
| Destructors | \`~ClassName()\` | \`__del__\` |
| Operator overload | \`operator+\` | \`__add__\` |

### Multiple Inheritance

C++ supports multiple inheritance (with the diamond problem):

\`\`\`cpp
class A { };
class B : public A { };
class C : public A { };
class D : public B, public C { };  // diamond problem!
// Solution: virtual inheritance
class B : virtual public A { };
\`\`\`

### Concepts Covered in This Module

1. **Shape Hierarchy** — inheritance and polymorphism
2. **Operator Overloading** — custom operators for user-defined types
3. **Template Function** — generic programming`,
    },
    {
      id: "cpp-oop-shapes",
      slug: "cpp-shape-hierarchy",
      title: "Shape Hierarchy",
      content: `## Shape Hierarchy — Inheritance & Polymorphism

### C++ Virtual Functions

In C++, you use \`virtual\` to enable runtime polymorphism:

\`\`\`cpp
class Shape {
public:
    virtual double area() const = 0;       // pure virtual
    virtual std::string name() const = 0;  // pure virtual
    virtual ~Shape() {}                     // virtual destructor
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override { return 3.14159 * radius * radius; }
    std::string name() const override { return "Circle"; }
};
\`\`\`

### Your Task

Build a shape hierarchy in Python using abstract base classes (Python's equivalent of C++ pure virtual classes). Implement \`Shape\`, \`Circle\`, \`Rectangle\`, and \`Triangle\`. Then write a function that processes a list of shapes polymorphically.`,
      starterCode: `# C++ equivalent:
# class Shape { virtual double area() = 0; };
# class Circle : public Shape { double area() override; };

from abc import ABC, abstractmethod
import math

class Shape(ABC):
    """Abstract base class — like C++ class with pure virtual methods."""

    @abstractmethod
    def area(self) -> float:
        pass

    @abstractmethod
    def perimeter(self) -> float:
        pass

    @abstractmethod
    def name(self) -> str:
        pass

    def describe(self) -> str:
        """Non-virtual method — same in all subclasses."""
        return f"{self.name()}: area={self.area():.2f}, perimeter={self.perimeter():.2f}"


class Circle(Shape):
    def __init__(self, radius: float):
        # TODO
        pass

    def area(self) -> float:
        # TODO
        pass

    def perimeter(self) -> float:
        # TODO
        pass

    def name(self) -> str:
        # TODO
        pass


class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        # TODO
        pass

    def area(self) -> float:
        # TODO
        pass

    def perimeter(self) -> float:
        # TODO
        pass

    def name(self) -> str:
        # TODO
        pass


class Triangle(Shape):
    def __init__(self, a: float, b: float, c: float):
        # TODO: Store sides, validate triangle inequality
        pass

    def area(self) -> float:
        # TODO: Use Heron's formula
        pass

    def perimeter(self) -> float:
        # TODO
        pass

    def name(self) -> str:
        # TODO
        pass


def total_area(shapes: list) -> float:
    """Process shapes polymorphically — like C++ vector<Shape*>."""
    # TODO: Sum all areas
    pass

def largest_shape(shapes: list) -> Shape:
    """Return shape with the largest area."""
    # TODO
    pass


# Test cases
shapes = [
    Circle(5),
    Rectangle(4, 6),
    Triangle(3, 4, 5),
]

for s in shapes:
    print(s.describe())
# Expected:
# Circle: area=78.54, perimeter=31.42
# Rectangle: area=24.00, perimeter=20.00
# Triangle: area=6.00, perimeter=12.00

print(f"Total area: {total_area(shapes):.2f}")    # Expected: 108.54
print(f"Largest: {largest_shape(shapes).name()}")  # Expected: Circle
`,
      solutionCode: `# C++ equivalent:
# class Shape { virtual double area() = 0; };
# class Circle : public Shape { double area() override; };

from abc import ABC, abstractmethod
import math

class Shape(ABC):
    """Abstract base class — like C++ class with pure virtual methods."""

    @abstractmethod
    def area(self) -> float:
        pass

    @abstractmethod
    def perimeter(self) -> float:
        pass

    @abstractmethod
    def name(self) -> str:
        pass

    def describe(self) -> str:
        return f"{self.name()}: area={self.area():.2f}, perimeter={self.perimeter():.2f}"


class Circle(Shape):
    def __init__(self, radius: float):
        self._radius = radius

    def area(self) -> float:
        return math.pi * self._radius ** 2

    def perimeter(self) -> float:
        return 2 * math.pi * self._radius

    def name(self) -> str:
        return "Circle"


class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self._width = width
        self._height = height

    def area(self) -> float:
        return self._width * self._height

    def perimeter(self) -> float:
        return 2 * (self._width + self._height)

    def name(self) -> str:
        return "Rectangle"


class Triangle(Shape):
    def __init__(self, a: float, b: float, c: float):
        if a + b <= c or a + c <= b or b + c <= a:
            raise ValueError("Invalid triangle sides")
        self._a = a
        self._b = b
        self._c = c

    def area(self) -> float:
        s = self.perimeter() / 2
        return math.sqrt(s * (s - self._a) * (s - self._b) * (s - self._c))

    def perimeter(self) -> float:
        return self._a + self._b + self._c

    def name(self) -> str:
        return "Triangle"


def total_area(shapes: list) -> float:
    return sum(s.area() for s in shapes)

def largest_shape(shapes: list) -> Shape:
    return max(shapes, key=lambda s: s.area())


# Test cases
shapes = [
    Circle(5),
    Rectangle(4, 6),
    Triangle(3, 4, 5),
]

for s in shapes:
    print(s.describe())
# Expected:
# Circle: area=78.54, perimeter=31.42
# Rectangle: area=24.00, perimeter=20.00
# Triangle: area=6.00, perimeter=12.00

print(f"Total area: {total_area(shapes):.2f}")    # Expected: 108.54
print(f"Largest: {largest_shape(shapes).name()}")  # Expected: Circle
`,
    },
    {
      id: "cpp-oop-operator-overloading",
      slug: "cpp-operator-overloading",
      title: "Operator Overloading",
      content: `## Operator Overloading

### C++ Operator Overloading

C++ lets you define custom behavior for operators on your classes:

\`\`\`cpp
class Vector2D {
    double x, y;
public:
    Vector2D(double x, double y) : x(x), y(y) {}

    Vector2D operator+(const Vector2D& other) const {
        return Vector2D(x + other.x, y + other.y);
    }

    Vector2D operator*(double scalar) const {
        return Vector2D(x * scalar, y * scalar);
    }

    bool operator==(const Vector2D& other) const {
        return x == other.x && y == other.y;
    }

    friend std::ostream& operator<<(std::ostream& os, const Vector2D& v) {
        os << "(" << v.x << ", " << v.y << ")";
        return os;
    }
};
\`\`\`

### Your Task

Implement a \`Vector2D\` class in Python with full operator overloading: addition, subtraction, scalar multiplication, dot product, equality, and string representation.`,
      starterCode: `# C++ equivalent:
# Vector2D v1(3, 4);
# Vector2D v2 = v1 + Vector2D(1, 2);  // operator+
# Vector2D v3 = v1 * 2.0;             // operator*
# std::cout << v1;                     // operator<<

import math

class Vector2D:
    """2D vector with C++-style operator overloading."""

    def __init__(self, x: float, y: float):
        # TODO
        pass

    def __add__(self, other):
        """Vector addition: v1 + v2"""
        # TODO
        pass

    def __sub__(self, other):
        """Vector subtraction: v1 - v2"""
        # TODO
        pass

    def __mul__(self, scalar):
        """Scalar multiplication: v * 2.0"""
        # TODO
        pass

    def __rmul__(self, scalar):
        """Reverse scalar multiplication: 2.0 * v"""
        # TODO
        pass

    def __eq__(self, other):
        """Equality comparison: v1 == v2"""
        # TODO
        pass

    def __abs__(self):
        """Magnitude: abs(v) returns length"""
        # TODO
        pass

    def __neg__(self):
        """Negation: -v"""
        # TODO
        pass

    def __repr__(self):
        """String representation: like C++ operator<<"""
        # TODO
        pass

    def dot(self, other) -> float:
        """Dot product"""
        # TODO
        pass

    def normalized(self):
        """Return unit vector"""
        # TODO
        pass


# Test cases
v1 = Vector2D(3, 4)
v2 = Vector2D(1, 2)

print(v1 + v2)         # Expected: Vector2D(4, 6)
print(v1 - v2)         # Expected: Vector2D(2, 2)
print(v1 * 2)          # Expected: Vector2D(6, 8)
print(3 * v2)          # Expected: Vector2D(3, 6)
print(-v1)             # Expected: Vector2D(-3, -4)
print(abs(v1))         # Expected: 5.0
print(v1 == Vector2D(3, 4))  # Expected: True
print(v1 == v2)              # Expected: False
print(v1.dot(v2))            # Expected: 11
print(Vector2D(0, 5).normalized())  # Expected: Vector2D(0.0, 1.0)
`,
      solutionCode: `# C++ equivalent:
# Vector2D v1(3, 4);
# Vector2D v2 = v1 + Vector2D(1, 2);  // operator+
# Vector2D v3 = v1 * 2.0;             // operator*
# std::cout << v1;                     // operator<<

import math

class Vector2D:
    """2D vector with C++-style operator overloading."""

    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector2D(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector2D(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        return Vector2D(self.x * scalar, self.y * scalar)

    def __rmul__(self, scalar):
        return self.__mul__(scalar)

    def __eq__(self, other):
        if not isinstance(other, Vector2D):
            return False
        return self.x == other.x and self.y == other.y

    def __abs__(self):
        return math.sqrt(self.x ** 2 + self.y ** 2)

    def __neg__(self):
        return Vector2D(-self.x, -self.y)

    def __repr__(self):
        return f"Vector2D({self.x}, {self.y})"

    def dot(self, other) -> float:
        return self.x * other.x + self.y * other.y

    def normalized(self):
        mag = abs(self)
        if mag == 0:
            raise ValueError("Cannot normalize zero vector")
        return Vector2D(self.x / mag, self.y / mag)


# Test cases
v1 = Vector2D(3, 4)
v2 = Vector2D(1, 2)

print(v1 + v2)         # Expected: Vector2D(4, 6)
print(v1 - v2)         # Expected: Vector2D(2, 2)
print(v1 * 2)          # Expected: Vector2D(6, 8)
print(3 * v2)          # Expected: Vector2D(3, 6)
print(-v1)             # Expected: Vector2D(-3, -4)
print(abs(v1))         # Expected: 5.0
print(v1 == Vector2D(3, 4))  # Expected: True
print(v1 == v2)              # Expected: False
print(v1.dot(v2))            # Expected: 11
print(Vector2D(0, 5).normalized())  # Expected: Vector2D(0.0, 1.0)
`,
    },
    {
      id: "cpp-oop-templates",
      slug: "cpp-template-function",
      title: "Template Function",
      content: `## Templates — Generic Programming

### C++ Templates

Templates let you write functions and classes that work with any type:

\`\`\`cpp
template <typename T>
T max_value(T a, T b) {
    return (a > b) ? a : b;
}

// Usage:
max_value(3, 7);          // T = int
max_value(3.14, 2.71);   // T = double
max_value("abc", "xyz"); // T = const char*

// Class template
template <typename T>
class Stack {
    std::vector<T> data;
public:
    void push(T value) { data.push_back(value); }
    T pop() { T v = data.back(); data.pop_back(); return v; }
};

Stack<int> intStack;
Stack<std::string> strStack;
\`\`\`

### Python Equivalent: Generics

Python 3.12+ has native generics. We will use \`typing\` for broader compatibility.

### Your Task

Implement generic container classes that enforce type safety at runtime, mimicking C++ template behavior.`,
      starterCode: `# C++ equivalent:
# template <typename T>
# class Stack { void push(T val); T pop(); };
# Stack<int> s;

from typing import TypeVar, Generic, List

T = TypeVar('T')

class TypedStack(Generic[T]):
    """Like C++ Stack<T> — only accepts values of type T."""

    def __init__(self, element_type: type):
        # TODO: Store type and initialize empty list
        pass

    def push(self, value):
        """Push value. Raise TypeError if wrong type."""
        # TODO
        pass

    def pop(self):
        """Pop and return top value. Raise IndexError if empty."""
        # TODO
        pass

    def peek(self):
        """Return top without removing."""
        # TODO
        pass

    def size(self) -> int:
        # TODO
        pass

    def is_empty(self) -> bool:
        # TODO
        pass


class TypedPair(Generic[T]):
    """Like C++ std::pair<T, U> — holds two typed values."""

    def __init__(self, first_type: type, second_type: type, first, second):
        # TODO
        pass

    def get_first(self):
        # TODO
        pass

    def get_second(self):
        # TODO
        pass

    def __repr__(self):
        # TODO
        pass


def generic_max(a, b):
    """Like C++ template max — works with any comparable type."""
    # TODO: Return the larger value
    pass

def generic_swap(pair: TypedPair):
    """Swap first and second of a pair — only if same type."""
    # TODO
    pass


# Test cases — TypedStack
int_stack = TypedStack(int)
int_stack.push(1)
int_stack.push(2)
int_stack.push(3)
print(int_stack.peek())     # Expected: 3
print(int_stack.pop())      # Expected: 3
print(int_stack.size())     # Expected: 2

try:
    int_stack.push("hello")
except TypeError as e:
    print(e)                # Expected: Cannot push str into Stack<int>

# Test TypedPair
p = TypedPair(str, int, "age", 25)
print(p)                    # Expected: Pair(age, 25)

# Test generic_max
print(generic_max(3, 7))    # Expected: 7
print(generic_max("abc", "xyz"))  # Expected: xyz
`,
      solutionCode: `# C++ equivalent:
# template <typename T>
# class Stack { void push(T val); T pop(); };
# Stack<int> s;

from typing import TypeVar, Generic, List

T = TypeVar('T')

class TypedStack(Generic[T]):
    """Like C++ Stack<T> — only accepts values of type T."""

    def __init__(self, element_type: type):
        self._type = element_type
        self._data = []

    def push(self, value):
        if not isinstance(value, self._type):
            raise TypeError(
                f"Cannot push {type(value).__name__} into Stack<{self._type.__name__}>"
            )
        self._data.append(value)

    def pop(self):
        if not self._data:
            raise IndexError("Stack is empty")
        return self._data.pop()

    def peek(self):
        if not self._data:
            raise IndexError("Stack is empty")
        return self._data[-1]

    def size(self) -> int:
        return len(self._data)

    def is_empty(self) -> bool:
        return len(self._data) == 0


class TypedPair(Generic[T]):
    """Like C++ std::pair<T, U> — holds two typed values."""

    def __init__(self, first_type: type, second_type: type, first, second):
        if not isinstance(first, first_type):
            raise TypeError(f"First must be {first_type.__name__}")
        if not isinstance(second, second_type):
            raise TypeError(f"Second must be {second_type.__name__}")
        self._first = first
        self._second = second
        self._first_type = first_type
        self._second_type = second_type

    def get_first(self):
        return self._first

    def get_second(self):
        return self._second

    def __repr__(self):
        return f"Pair({self._first}, {self._second})"


def generic_max(a, b):
    return a if a > b else b

def generic_swap(pair: TypedPair):
    if pair._first_type != pair._second_type:
        raise TypeError("Cannot swap pair with different types")
    return TypedPair(pair._second_type, pair._first_type, pair._second, pair._first)


# Test cases — TypedStack
int_stack = TypedStack(int)
int_stack.push(1)
int_stack.push(2)
int_stack.push(3)
print(int_stack.peek())     # Expected: 3
print(int_stack.pop())      # Expected: 3
print(int_stack.size())     # Expected: 2

try:
    int_stack.push("hello")
except TypeError as e:
    print(e)                # Expected: Cannot push str into Stack<int>

# Test TypedPair
p = TypedPair(str, int, "age", 25)
print(p)                    # Expected: Pair(age, 25)

# Test generic_max
print(generic_max(3, 7))    # Expected: 7
print(generic_max("abc", "xyz"))  # Expected: xyz
`,
    },
  ],
};
