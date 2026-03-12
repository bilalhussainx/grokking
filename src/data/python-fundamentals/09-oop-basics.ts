import { Module } from "../types";

export const oopBasicsModule: Module = {
  id: "oop-basics",
  title: "OOP Basics",
  description:
    "Introduction to Object-Oriented Programming — classes, objects, methods, __init__, and inheritance.",
  lessons: [
    {
      id: "oop-intro",
      slug: "oop-intro",
      title: "Introduction to OOP",
      content: `## Object-Oriented Programming

Object-Oriented Programming (OOP) organizes code around **objects** — bundles of data (attributes) and behavior (methods).

### Why OOP?

- **Organization**: Group related data and functions together
- **Reusability**: Create templates (classes) and stamp out instances
- **Encapsulation**: Hide internal details, expose a clean interface
- **Inheritance**: Build specialized classes from general ones

### Classes and Objects

A **class** is a blueprint. An **object** (or instance) is a specific thing built from that blueprint.

\`\`\`python
class Dog:
    def __init__(self, name, breed):
        self.name = name      # instance attribute
        self.breed = breed

    def bark(self):           # instance method
        return f"{self.name} says Woof!"

# Create objects
my_dog = Dog("Rex", "Labrador")
print(my_dog.name)    # Rex
print(my_dog.bark())  # Rex says Woof!
\`\`\`

### The \`__init__\` Method

The \`__init__\` method is the **constructor** — it runs automatically when you create a new object. Use it to set up initial attribute values.

### The \`self\` Parameter

Every method's first parameter is \`self\`, which refers to the current instance. Python passes it automatically — you do not include it when calling:

\`\`\`python
my_dog.bark()     # Python internally calls Dog.bark(my_dog)
\`\`\`

### The \`__str__\` Method

Define \`__str__\` to control what \`print()\` shows for your object:

\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return f"Dog({self.name})"

print(Dog("Rex"))  # Dog(Rex)
\`\`\`

### Inheritance

Create a child class that inherits from a parent:

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):            # override parent method
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"
\`\`\`

Use \`super()\` to call the parent's method from the child class.`,
    },
    {
      id: "oop-bank-account",
      slug: "bank-account",
      title: "Bank Account Class",
      content: `## Bank Account Class

Build a \`BankAccount\` class that simulates basic banking operations.

### Requirements

- Track account holder name and balance
- Support deposits and withdrawals
- Prevent overdrafts (cannot withdraw more than balance)
- Track transaction history
- Support transfers between accounts

### Hints

- Use \`self.balance\` to track the current balance
- Store transactions as a list of strings
- The \`__str__\` method should show a readable summary
- Raise or return an error message for invalid operations`,
      starterCode: `class BankAccount:
    def __init__(self, owner, balance=0):
        """Initialize account with owner name and optional starting balance."""
        # TODO: Set owner, balance, and an empty transaction history list
        pass

    def deposit(self, amount):
        """Deposit money. Amount must be positive.
        Return the new balance. Add to transaction history."""
        # TODO: Validate amount, update balance, log transaction
        pass

    def withdraw(self, amount):
        """Withdraw money. Amount must be positive and <= balance.
        Return the new balance, or 'Insufficient funds' message."""
        # TODO: Validate amount and balance, update, log transaction
        pass

    def transfer(self, other_account, amount):
        """Transfer money to another BankAccount.
        Return True if successful, False if insufficient funds."""
        # TODO: Withdraw from self, deposit to other
        pass

    def get_balance(self):
        """Return current balance."""
        # TODO: Return the balance
        pass

    def get_history(self):
        """Return the transaction history as a list of strings."""
        # TODO: Return the history list
        pass

    def __str__(self):
        """Return a string like 'BankAccount(Alice, balance: $100.00)'"""
        # TODO: Format the string
        pass

# Test cases
acc1 = BankAccount("Alice", 1000)
acc2 = BankAccount("Bob", 500)

print(acc1)
# Expected: BankAccount(Alice, balance: $1000.00)

acc1.deposit(500)
print(acc1.get_balance())
# Expected: 1500

acc1.withdraw(200)
print(acc1.get_balance())
# Expected: 1300

print(acc1.withdraw(5000))
# Expected: Insufficient funds

acc1.transfer(acc2, 300)
print(acc1.get_balance())
# Expected: 1000
print(acc2.get_balance())
# Expected: 800

print(acc1.get_history())
# Expected: ['Deposit: $500.00', 'Withdrawal: $200.00', 'Transfer to Bob: $300.00']

print(acc2.get_history())
# Expected: ['Transfer from Alice: $300.00']`,
      solutionCode: `class BankAccount:
    def __init__(self, owner, balance=0):
        """Initialize account with owner name and optional starting balance."""
        self.owner = owner
        self.balance = balance
        self.history = []

    def deposit(self, amount):
        """Deposit money. Amount must be positive.
        Return the new balance. Add to transaction history."""
        if amount <= 0:
            return "Amount must be positive"
        self.balance += amount
        self.history.append(f"Deposit: \${amount:.2f}")
        return self.balance

    def withdraw(self, amount):
        """Withdraw money. Amount must be positive and <= balance.
        Return the new balance, or 'Insufficient funds' message."""
        if amount <= 0:
            return "Amount must be positive"
        if amount > self.balance:
            return "Insufficient funds"
        self.balance -= amount
        self.history.append(f"Withdrawal: \${amount:.2f}")
        return self.balance

    def transfer(self, other_account, amount):
        """Transfer money to another BankAccount.
        Return True if successful, False if insufficient funds."""
        if amount > self.balance:
            return False
        self.balance -= amount
        other_account.balance += amount
        self.history.append(f"Transfer to {other_account.owner}: \${amount:.2f}")
        other_account.history.append(f"Transfer from {self.owner}: \${amount:.2f}")
        return True

    def get_balance(self):
        """Return current balance."""
        return self.balance

    def get_history(self):
        """Return the transaction history as a list of strings."""
        return self.history

    def __str__(self):
        """Return a string like 'BankAccount(Alice, balance: $100.00)'"""
        return f"BankAccount({self.owner}, balance: \${self.balance:.2f})"

# Test cases
acc1 = BankAccount("Alice", 1000)
acc2 = BankAccount("Bob", 500)

print(acc1)
# Expected: BankAccount(Alice, balance: $1000.00)

acc1.deposit(500)
print(acc1.get_balance())
# Expected: 1500

acc1.withdraw(200)
print(acc1.get_balance())
# Expected: 1300

print(acc1.withdraw(5000))
# Expected: Insufficient funds

acc1.transfer(acc2, 300)
print(acc1.get_balance())
# Expected: 1000
print(acc2.get_balance())
# Expected: 800

print(acc1.get_history())
# Expected: ['Deposit: $500.00', 'Withdrawal: $200.00', 'Transfer to Bob: $300.00']

print(acc2.get_history())
# Expected: ['Transfer from Alice: $300.00']`,
    },
    {
      id: "oop-shopping-cart",
      slug: "shopping-cart",
      title: "Shopping Cart",
      content: `## Shopping Cart

Build a shopping cart system with \`Product\` and \`ShoppingCart\` classes.

### Requirements

- \`Product\` class: name, price, and quantity in stock
- \`ShoppingCart\` class: add items, remove items, calculate total
- Apply discounts
- Show a formatted receipt

### Hints

- Store cart items as a dictionary: \`{product_name: quantity}\`
- Keep a reference to products to look up prices
- Handle edge cases: adding more than in stock, removing items not in cart`,
      starterCode: `class Product:
    def __init__(self, name, price, stock=0):
        """Initialize a product with name, price, and stock quantity."""
        # TODO: Set attributes
        pass

    def __str__(self):
        """Return 'Product(name, $price, stock: N)'"""
        # TODO: Format string
        pass

class ShoppingCart:
    def __init__(self):
        """Initialize an empty shopping cart."""
        # TODO: Set up items dict and products reference
        pass

    def add_item(self, product, quantity=1):
        """Add a product to the cart. Check stock availability.
        Return True if added, False if not enough stock."""
        # TODO: Check stock, add to cart, reduce stock
        pass

    def remove_item(self, product_name, quantity=1):
        """Remove quantity of a product from cart.
        Return True if removed, False if not in cart."""
        # TODO: Remove from cart, restore stock
        pass

    def get_total(self):
        """Calculate and return the total price. Round to 2 decimal places."""
        # TODO: Sum up price * quantity for each item
        pass

    def apply_discount(self, percent):
        """Apply a percentage discount to the total.
        Return the discounted total."""
        # TODO: Calculate discount
        pass

    def get_receipt(self):
        """Return a formatted receipt string."""
        # TODO: List items with prices and total
        pass

# Test cases
laptop = Product("Laptop", 999.99, 5)
mouse = Product("Mouse", 29.99, 10)
keyboard = Product("Keyboard", 79.99, 8)

print(laptop)
# Expected: Product(Laptop, $999.99, stock: 5)

cart = ShoppingCart()
cart.add_item(laptop, 2)
cart.add_item(mouse, 3)
cart.add_item(keyboard, 1)

print(cart.get_total())
# Expected: 2169.94

print(cart.apply_discount(10))
# Expected: 1952.95

cart.remove_item("Mouse", 1)
print(cart.get_total())
# Expected: 2139.95

print(cart.add_item(laptop, 10))
# Expected: False (not enough stock)

receipt = cart.get_receipt()
print(receipt)
# Expected:
# Shopping Cart Receipt
# --------------------
# Laptop x2 - $1999.98
# Mouse x2 - $59.98
# Keyboard x1 - $79.99
# --------------------
# Total: $2139.95`,
      solutionCode: `class Product:
    def __init__(self, name, price, stock=0):
        """Initialize a product with name, price, and stock quantity."""
        self.name = name
        self.price = price
        self.stock = stock

    def __str__(self):
        """Return 'Product(name, $price, stock: N)'"""
        return f"Product({self.name}, \${self.price}, stock: {self.stock})"

class ShoppingCart:
    def __init__(self):
        """Initialize an empty shopping cart."""
        self.items = {}      # {product_name: quantity}
        self.products = {}   # {product_name: Product}

    def add_item(self, product, quantity=1):
        """Add a product to the cart. Check stock availability.
        Return True if added, False if not enough stock."""
        if quantity > product.stock:
            return False
        product.stock -= quantity
        self.products[product.name] = product
        self.items[product.name] = self.items.get(product.name, 0) + quantity
        return True

    def remove_item(self, product_name, quantity=1):
        """Remove quantity of a product from cart.
        Return True if removed, False if not in cart."""
        if product_name not in self.items:
            return False
        current = self.items[product_name]
        remove_qty = min(quantity, current)
        self.items[product_name] -= remove_qty
        if self.items[product_name] <= 0:
            del self.items[product_name]
        # Restore stock
        if product_name in self.products:
            self.products[product_name].stock += remove_qty
        return True

    def get_total(self):
        """Calculate and return the total price. Round to 2 decimal places."""
        total = 0
        for name, qty in self.items.items():
            total += self.products[name].price * qty
        return round(total, 2)

    def apply_discount(self, percent):
        """Apply a percentage discount to the total.
        Return the discounted total."""
        total = self.get_total()
        return round(total * (1 - percent / 100), 2)

    def get_receipt(self):
        """Return a formatted receipt string."""
        lines = ["Shopping Cart Receipt", "--------------------"]
        for name, qty in self.items.items():
            price = self.products[name].price
            line_total = round(price * qty, 2)
            lines.append(f"{name} x{qty} - \${line_total}")
        lines.append("--------------------")
        lines.append(f"Total: \${self.get_total()}")
        return "\\n".join(lines)

# Test cases
laptop = Product("Laptop", 999.99, 5)
mouse = Product("Mouse", 29.99, 10)
keyboard = Product("Keyboard", 79.99, 8)

print(laptop)
# Expected: Product(Laptop, $999.99, stock: 5)

cart = ShoppingCart()
cart.add_item(laptop, 2)
cart.add_item(mouse, 3)
cart.add_item(keyboard, 1)

print(cart.get_total())
# Expected: 2169.94

print(cart.apply_discount(10))
# Expected: 1952.95

cart.remove_item("Mouse", 1)
print(cart.get_total())
# Expected: 2139.95

print(cart.add_item(laptop, 10))
# Expected: False (not enough stock)

receipt = cart.get_receipt()
print(receipt)
# Expected:
# Shopping Cart Receipt
# --------------------
# Laptop x2 - $1999.98
# Mouse x2 - $59.98
# Keyboard x1 - $79.99
# --------------------
# Total: $2139.95`,
    },
    {
      id: "oop-animal-hierarchy",
      slug: "animal-hierarchy",
      title: "Animal Hierarchy",
      content: `## Animal Hierarchy — Inheritance in Action

Build a class hierarchy to model different animals, demonstrating **inheritance**, **method overriding**, and **polymorphism**.

### Class Hierarchy

\`\`\`
Animal (base class)
  ├── Dog
  ├── Cat
  └── Bird
\`\`\`

### Concepts

- **Inheritance**: Child classes get all attributes and methods of the parent
- **Method overriding**: Child classes can redefine parent methods
- **super()**: Call the parent class method from the child
- **Polymorphism**: Different classes respond to the same method call differently

### Hints

- Use \`super().__init__()\` to call the parent constructor
- Override \`speak()\` in each animal subclass
- Add unique methods to specific subclasses (e.g., \`fetch()\` for Dog)`,
      starterCode: `class Animal:
    def __init__(self, name, age, species):
        """Initialize an animal with name, age, and species."""
        # TODO: Set attributes
        pass

    def speak(self):
        """Return a generic animal sound. Override in subclasses."""
        # TODO: Return a generic message
        pass

    def info(self):
        """Return a string: 'name is a age-year-old species'"""
        # TODO: Format the info string
        pass

    def __str__(self):
        """Return 'Species(name, age years)'"""
        # TODO: Format string
        pass

class Dog(Animal):
    def __init__(self, name, age, breed):
        """Initialize a Dog with breed. Species is always 'Dog'."""
        # TODO: Call super().__init__, set breed
        pass

    def speak(self):
        """Dogs say 'Woof!'"""
        # TODO: Return dog sound
        pass

    def fetch(self, item):
        """Return 'name fetches the item!'"""
        # TODO: Format fetch message
        pass

class Cat(Animal):
    def __init__(self, name, age, indoor=True):
        """Initialize a Cat. Species is always 'Cat'."""
        # TODO: Call super().__init__, set indoor attribute
        pass

    def speak(self):
        """Cats say 'Meow!'"""
        # TODO: Return cat sound
        pass

    def purr(self):
        """Return 'name purrs contentedly...'"""
        # TODO: Format purr message
        pass

class Bird(Animal):
    def __init__(self, name, age, can_fly=True):
        """Initialize a Bird. Species is always 'Bird'."""
        # TODO: Call super().__init__, set can_fly attribute
        pass

    def speak(self):
        """Birds say 'Tweet!'"""
        # TODO: Return bird sound
        pass

    def fly(self):
        """If can_fly, return 'name soars through the sky!'
        Otherwise return 'name cannot fly.'"""
        # TODO: Check can_fly and return appropriate message
        pass

def animal_roll_call(animals):
    """Given a list of animals, return a list of strings:
    'name says: [their sound]' for each animal."""
    # TODO: Use polymorphism — call speak() on each animal
    pass

# Test cases
dog = Dog("Rex", 5, "Labrador")
cat = Cat("Whiskers", 3)
bird = Bird("Tweety", 2)
penguin = Bird("Tux", 4, can_fly=False)

print(dog)
# Expected: Dog(Rex, 5 years)

print(cat.info())
# Expected: Whiskers is a 3-year-old Cat

print(dog.speak())
# Expected: Rex says Woof!

print(cat.speak())
# Expected: Whiskers says Meow!

print(bird.speak())
# Expected: Tweety says Tweet!

print(dog.fetch("ball"))
# Expected: Rex fetches the ball!

print(cat.purr())
# Expected: Whiskers purrs contentedly...

print(bird.fly())
# Expected: Tweety soars through the sky!

print(penguin.fly())
# Expected: Tux cannot fly.

animals = [dog, cat, bird, penguin]
print(animal_roll_call(animals))
# Expected: ['Rex says: Rex says Woof!', 'Whiskers says: Whiskers says Meow!', 'Tweety says: Tweety says Tweet!', 'Tux says: Tux says Tweet!']`,
      solutionCode: `class Animal:
    def __init__(self, name, age, species):
        """Initialize an animal with name, age, and species."""
        self.name = name
        self.age = age
        self.species = species

    def speak(self):
        """Return a generic animal sound. Override in subclasses."""
        return f"{self.name} says ..."

    def info(self):
        """Return a string: 'name is a age-year-old species'"""
        return f"{self.name} is a {self.age}-year-old {self.species}"

    def __str__(self):
        """Return 'Species(name, age years)'"""
        return f"{self.species}({self.name}, {self.age} years)"

class Dog(Animal):
    def __init__(self, name, age, breed):
        """Initialize a Dog with breed. Species is always 'Dog'."""
        super().__init__(name, age, "Dog")
        self.breed = breed

    def speak(self):
        """Dogs say 'Woof!'"""
        return f"{self.name} says Woof!"

    def fetch(self, item):
        """Return 'name fetches the item!'"""
        return f"{self.name} fetches the {item}!"

class Cat(Animal):
    def __init__(self, name, age, indoor=True):
        """Initialize a Cat. Species is always 'Cat'."""
        super().__init__(name, age, "Cat")
        self.indoor = indoor

    def speak(self):
        """Cats say 'Meow!'"""
        return f"{self.name} says Meow!"

    def purr(self):
        """Return 'name purrs contentedly...'"""
        return f"{self.name} purrs contentedly..."

class Bird(Animal):
    def __init__(self, name, age, can_fly=True):
        """Initialize a Bird. Species is always 'Bird'."""
        super().__init__(name, age, "Bird")
        self.can_fly = can_fly

    def speak(self):
        """Birds say 'Tweet!'"""
        return f"{self.name} says Tweet!"

    def fly(self):
        """If can_fly, return 'name soars through the sky!'
        Otherwise return 'name cannot fly.'"""
        if self.can_fly:
            return f"{self.name} soars through the sky!"
        return f"{self.name} cannot fly."

def animal_roll_call(animals):
    """Given a list of animals, return a list of strings:
    'name says: [their sound]' for each animal."""
    return [f"{a.name} says: {a.speak()}" for a in animals]

# Test cases
dog = Dog("Rex", 5, "Labrador")
cat = Cat("Whiskers", 3)
bird = Bird("Tweety", 2)
penguin = Bird("Tux", 4, can_fly=False)

print(dog)
# Expected: Dog(Rex, 5 years)

print(cat.info())
# Expected: Whiskers is a 3-year-old Cat

print(dog.speak())
# Expected: Rex says Woof!

print(cat.speak())
# Expected: Whiskers says Meow!

print(bird.speak())
# Expected: Tweety says Tweet!

print(dog.fetch("ball"))
# Expected: Rex fetches the ball!

print(cat.purr())
# Expected: Whiskers purrs contentedly...

print(bird.fly())
# Expected: Tweety soars through the sky!

print(penguin.fly())
# Expected: Tux cannot fly.

animals = [dog, cat, bird, penguin]
print(animal_roll_call(animals))
# Expected: ['Rex says: Rex says Woof!', 'Whiskers says: Whiskers says Meow!', 'Tweety says: Tweety says Tweet!', 'Tux says: Tux says Tweet!']`,
    },
  ],
};
