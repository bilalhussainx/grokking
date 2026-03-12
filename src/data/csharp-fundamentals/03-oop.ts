import { Module } from "../types";

export const oopModule: Module = {
  id: "csharp-oop",
  title: "OOP in C#",
  description:
    "Learn object-oriented programming in C# — classes, objects, inheritance, interfaces, and polymorphism.",
  lessons: [
    {
      id: "csharp-classes-objects",
      slug: "csharp-classes-objects",
      title: "Classes & Objects",
      content: `## Classes & Objects

A **class** is a blueprint; an **object** is an instance of that blueprint.

### Defining a Class

\`\`\`csharp
class Car
{
    // Fields (data)
    public string Make;
    public string Model;
    public int Year;

    // Method (behavior)
    public void Describe()
    {
        Console.WriteLine($"{Year} {Make} {Model}");
    }
}
\`\`\`

### Creating Objects

\`\`\`csharp
Car myCar = new Car();
myCar.Make = "Toyota";
myCar.Model = "Camry";
myCar.Year = 2023;
myCar.Describe();  // "2023 Toyota Camry"
\`\`\`

### Constructors

A constructor initializes an object when it is created:

\`\`\`csharp
class Car
{
    public string Make;
    public string Model;
    public int Year;

    // Constructor
    public Car(string make, string model, int year)
    {
        Make = make;
        Model = model;
        Year = year;
    }

    public void Describe()
    {
        Console.WriteLine($"{Year} {Make} {Model}");
    }
}

// Usage:
Car myCar = new Car("Honda", "Civic", 2024);
myCar.Describe();
\`\`\`

### Properties (Getters & Setters)

Properties provide controlled access to fields:

\`\`\`csharp
class Person
{
    private string name;
    private int age;

    public string Name
    {
        get { return name; }
        set { name = value; }
    }

    public int Age
    {
        get { return age; }
        set
        {
            if (value >= 0 && value <= 150)
                age = value;
        }
    }
}
\`\`\`

### Auto-Properties (Shorthand)

\`\`\`csharp
class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}
\`\`\`

### Access Modifiers

| Modifier | Visibility |
|----------|-----------|
| \`public\` | Accessible everywhere |
| \`private\` | Only within the class |
| \`protected\` | Within the class and its subclasses |
| \`internal\` | Within the same assembly (project) |

### Your Task

Create a \`BankAccount\` class with deposit, withdraw, and balance-check functionality.`,
      starterCode: `using System;

class BankAccount
{
    // Properties:
    // AccountHolder (string) - public get, private set
    // Balance (decimal) - public get, private set
    // AccountNumber (string) - public get, private set

    // Constructor: takes accountHolder and initialBalance

    // Method: Deposit(decimal amount) - adds to balance, prints confirmation

    // Method: Withdraw(decimal amount) - subtracts if sufficient funds, prints confirmation or error

    // Method: DisplayInfo() - prints account details
}

class Program
{
    static void Main()
    {
        // Create an account for "Alice Smith" with $1000 initial balance
        // Deposit $500
        // Withdraw $200
        // Try to withdraw $2000 (should fail)
        // Display final account info
    }
}`,
      solutionCode: `using System;

class BankAccount
{
    public string AccountHolder { get; private set; }
    public decimal Balance { get; private set; }
    public string AccountNumber { get; private set; }

    public BankAccount(string accountHolder, decimal initialBalance)
    {
        AccountHolder = accountHolder;
        Balance = initialBalance;
        AccountNumber = "ACC-" + new Random().Next(10000, 99999);
    }

    public void Deposit(decimal amount)
    {
        if (amount <= 0)
        {
            Console.WriteLine("Deposit amount must be positive.");
            return;
        }
        Balance += amount;
        Console.WriteLine($"Deposited \${amount}. New balance: \${Balance}");
    }

    public void Withdraw(decimal amount)
    {
        if (amount <= 0)
        {
            Console.WriteLine("Withdrawal amount must be positive.");
            return;
        }
        if (amount > Balance)
        {
            Console.WriteLine($"Insufficient funds! Balance: \${Balance}, Requested: \${amount}");
            return;
        }
        Balance -= amount;
        Console.WriteLine($"Withdrew \${amount}. New balance: \${Balance}");
    }

    public void DisplayInfo()
    {
        Console.WriteLine($"Account: {AccountNumber}");
        Console.WriteLine($"Holder: {AccountHolder}");
        Console.WriteLine($"Balance: \${Balance}");
    }
}

class Program
{
    static void Main()
    {
        BankAccount account = new BankAccount("Alice Smith", 1000m);
        account.Deposit(500m);
        account.Withdraw(200m);
        account.Withdraw(2000m);
        Console.WriteLine();
        account.DisplayInfo();
    }
}`,
    },
    {
      id: "csharp-inheritance",
      slug: "csharp-inheritance",
      title: "Inheritance",
      content: `## Inheritance

Inheritance lets a class **derive** from another class, inheriting its fields and methods.

### Base and Derived Classes

\`\`\`csharp
class Animal
{
    public string Name { get; set; }

    public Animal(string name)
    {
        Name = name;
    }

    public virtual void Speak()
    {
        Console.WriteLine($"{Name} makes a sound.");
    }
}

class Dog : Animal
{
    public string Breed { get; set; }

    public Dog(string name, string breed) : base(name)
    {
        Breed = breed;
    }

    public override void Speak()
    {
        Console.WriteLine($"{Name} barks! Woof!");
    }
}
\`\`\`

### Key Concepts

- **\`: base()\`** calls the parent constructor
- **\`virtual\`** allows a method to be overridden in a subclass
- **\`override\`** replaces the parent's method with a new implementation
- **\`base.MethodName()\`** calls the parent's version of a method

### The \`sealed\` Keyword

Prevents further inheritance:

\`\`\`csharp
sealed class FinalClass
{
    // No class can inherit from this
}
\`\`\`

### The \`protected\` Modifier

Members marked \`protected\` are visible to the class and its subclasses but not to outside code:

\`\`\`csharp
class Vehicle
{
    protected int speed;

    public void ShowSpeed()
    {
        Console.WriteLine($"Speed: {speed} km/h");
    }
}

class Car : Vehicle
{
    public void Accelerate()
    {
        speed += 10; // Can access protected member
    }
}
\`\`\`

### Your Task

Create a shape hierarchy: a base \`Shape\` class, with \`Rectangle\` and \`Circle\` derived classes.`,
      starterCode: `using System;

// Create a base class Shape with:
//   - public string Color { get; set; }
//   - Constructor that takes color
//   - virtual method: double GetArea()
//   - virtual method: string Describe()

// Create class Rectangle : Shape with:
//   - Width and Height properties
//   - Constructor that takes color, width, height
//   - Override GetArea() -> Width * Height
//   - Override Describe()

// Create class Circle : Shape with:
//   - Radius property
//   - Constructor that takes color, radius
//   - Override GetArea() -> Math.PI * Radius * Radius
//   - Override Describe()

class Program
{
    static void Main()
    {
        // Create a blue rectangle (5 x 3)
        // Create a red circle (radius 4)
        // Print each shape's description and area
    }
}`,
      solutionCode: `using System;

class Shape
{
    public string Color { get; set; }

    public Shape(string color)
    {
        Color = color;
    }

    public virtual double GetArea()
    {
        return 0;
    }

    public virtual string Describe()
    {
        return $"A {Color} shape";
    }
}

class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }

    public Rectangle(string color, double width, double height) : base(color)
    {
        Width = width;
        Height = height;
    }

    public override double GetArea()
    {
        return Width * Height;
    }

    public override string Describe()
    {
        return $"A {Color} rectangle ({Width} x {Height})";
    }
}

class Circle : Shape
{
    public double Radius { get; set; }

    public Circle(string color, double radius) : base(color)
    {
        Radius = radius;
    }

    public override double GetArea()
    {
        return Math.PI * Radius * Radius;
    }

    public override string Describe()
    {
        return $"A {Color} circle (radius {Radius})";
    }
}

class Program
{
    static void Main()
    {
        Rectangle rect = new Rectangle("blue", 5, 3);
        Circle circle = new Circle("red", 4);

        Console.WriteLine(rect.Describe());
        Console.WriteLine($"Area: {rect.GetArea()}");
        Console.WriteLine();
        Console.WriteLine(circle.Describe());
        Console.WriteLine($"Area: {Math.Round(circle.GetArea(), 2)}");
    }
}`,
    },
    {
      id: "csharp-interfaces",
      slug: "csharp-interfaces",
      title: "Interfaces",
      content: `## Interfaces

An **interface** defines a contract — a set of methods and properties that a class **must** implement.

### Defining an Interface

\`\`\`csharp
interface IPlayable
{
    void Play();
    void Pause();
    void Stop();
    string Title { get; }
}
\`\`\`

**Convention:** Interface names start with \`I\` in C#.

### Implementing an Interface

\`\`\`csharp
class Song : IPlayable
{
    public string Title { get; private set; }
    public string Artist { get; set; }

    public Song(string title, string artist)
    {
        Title = title;
        Artist = artist;
    }

    public void Play()
    {
        Console.WriteLine($"Playing: {Title} by {Artist}");
    }

    public void Pause()
    {
        Console.WriteLine($"Paused: {Title}");
    }

    public void Stop()
    {
        Console.WriteLine($"Stopped: {Title}");
    }
}
\`\`\`

### Multiple Interface Implementation

A class can implement **multiple** interfaces (unlike inheritance, which allows only one base class):

\`\`\`csharp
interface IPrintable
{
    void Print();
}

interface ISaveable
{
    void Save(string path);
}

class Document : IPrintable, ISaveable
{
    public string Content { get; set; }

    public void Print()
    {
        Console.WriteLine($"Printing: {Content}");
    }

    public void Save(string path)
    {
        Console.WriteLine($"Saving to {path}");
    }
}
\`\`\`

### Interface as a Type

You can use interfaces as parameter types for flexibility:

\`\`\`csharp
void PlayAll(IPlayable[] items)
{
    foreach (IPlayable item in items)
    {
        item.Play();
    }
}
\`\`\`

### Your Task

Create an \`IStorable\` interface and implement it in \`FileDocument\` and \`DatabaseRecord\` classes.`,
      starterCode: `using System;

// Define interface IStorable with:
//   string Id { get; }
//   void Save();
//   void Delete();
//   string GetInfo();

// Define interface ISearchable with:
//   bool Matches(string query);

// Create class FileDocument that implements BOTH IStorable and ISearchable:
//   Properties: Id, FileName, Content
//   Save() -> prints "Saving file: [FileName]"
//   Delete() -> prints "Deleting file: [FileName]"
//   GetInfo() -> returns "File: [FileName] (ID: [Id])"
//   Matches(query) -> returns true if FileName or Content contains query

// Create class DatabaseRecord that implements BOTH IStorable and ISearchable:
//   Properties: Id, TableName, Data
//   Save() -> prints "Inserting into [TableName]..."
//   Delete() -> prints "Deleting from [TableName] where ID = [Id]"
//   GetInfo() -> returns "DB Record: [TableName] (ID: [Id])"
//   Matches(query) -> returns true if TableName or Data contains query

class Program
{
    static void Main()
    {
        // Create a FileDocument and a DatabaseRecord
        // Store them in an IStorable array
        // Loop through and call Save(), then GetInfo() on each
        // Test the Matches() method with a search query
    }
}`,
      solutionCode: `using System;

interface IStorable
{
    string Id { get; }
    void Save();
    void Delete();
    string GetInfo();
}

interface ISearchable
{
    bool Matches(string query);
}

class FileDocument : IStorable, ISearchable
{
    public string Id { get; private set; }
    public string FileName { get; set; }
    public string Content { get; set; }

    public FileDocument(string id, string fileName, string content)
    {
        Id = id;
        FileName = fileName;
        Content = content;
    }

    public void Save()
    {
        Console.WriteLine($"Saving file: {FileName}");
    }

    public void Delete()
    {
        Console.WriteLine($"Deleting file: {FileName}");
    }

    public string GetInfo()
    {
        return $"File: {FileName} (ID: {Id})";
    }

    public bool Matches(string query)
    {
        return FileName.Contains(query) || Content.Contains(query);
    }
}

class DatabaseRecord : IStorable, ISearchable
{
    public string Id { get; private set; }
    public string TableName { get; set; }
    public string Data { get; set; }

    public DatabaseRecord(string id, string tableName, string data)
    {
        Id = id;
        TableName = tableName;
        Data = data;
    }

    public void Save()
    {
        Console.WriteLine($"Inserting into {TableName}...");
    }

    public void Delete()
    {
        Console.WriteLine($"Deleting from {TableName} where ID = {Id}");
    }

    public string GetInfo()
    {
        return $"DB Record: {TableName} (ID: {Id})";
    }

    public bool Matches(string query)
    {
        return TableName.Contains(query) || Data.Contains(query);
    }
}

class Program
{
    static void Main()
    {
        IStorable[] items = new IStorable[]
        {
            new FileDocument("F1", "report.pdf", "Annual sales report"),
            new DatabaseRecord("D1", "Users", "Alice, Bob, Charlie")
        };

        foreach (IStorable item in items)
        {
            item.Save();
            Console.WriteLine(item.GetInfo());
        }

        Console.WriteLine("\\n--- Search Test ---");
        string query = "report";
        foreach (IStorable item in items)
        {
            if (item is ISearchable searchable)
            {
                Console.WriteLine($"{item.GetInfo()} matches \\"{query}\\": {searchable.Matches(query)}");
            }
        }
    }
}`,
    },
    {
      id: "csharp-abstract-polymorphism",
      slug: "csharp-abstract-polymorphism",
      title: "Abstract Classes & Polymorphism",
      content: `## Abstract Classes & Polymorphism

### Abstract Classes

An **abstract class** cannot be instantiated directly. It serves as a base for other classes:

\`\`\`csharp
abstract class Employee
{
    public string Name { get; set; }
    public int Id { get; set; }

    public Employee(string name, int id)
    {
        Name = name;
        Id = id;
    }

    // Abstract method — MUST be implemented by subclasses
    public abstract decimal CalculatePay();

    // Concrete method — shared by all subclasses
    public void DisplayInfo()
    {
        Console.WriteLine($"[{Id}] {Name} - Pay: \${CalculatePay()}");
    }
}
\`\`\`

### Abstract vs Interface

| Feature | Abstract Class | Interface |
|---------|---------------|-----------|
| Can have fields | Yes | No |
| Can have constructors | Yes | No |
| Can have method bodies | Yes | Yes (default methods in C# 8+) |
| Multiple inheritance | No (single base) | Yes (many interfaces) |
| Use when... | Classes share behavior | Classes share a contract |

### Polymorphism

**Polymorphism** means "many forms" — a parent type reference can point to child type objects:

\`\`\`csharp
Employee e1 = new FullTimeEmployee("Alice", 1, 5000m);
Employee e2 = new Contractor("Bob", 2, 50m, 160);
// Both are "Employee" but CalculatePay() behaves differently
e1.DisplayInfo(); // Uses FullTimeEmployee's pay calculation
e2.DisplayInfo(); // Uses Contractor's pay calculation
\`\`\`

### The \`is\` and \`as\` Keywords

\`\`\`csharp
if (e1 is FullTimeEmployee fte)
{
    Console.WriteLine($"Bonus: {fte.Bonus}");
}

Contractor c = e2 as Contractor;
if (c != null)
{
    Console.WriteLine($"Hourly rate: {c.HourlyRate}");
}
\`\`\`

### Your Task

Build an employee payroll system with abstract classes and polymorphism.`,
      starterCode: `using System;

// Create abstract class Employee with:
//   Properties: Name (string), Id (int)
//   Constructor taking name and id
//   Abstract method: decimal CalculatePay()
//   Concrete method: void PrintPayStub() that prints name, id, and calculated pay

// Create class SalariedEmployee : Employee
//   Extra property: decimal MonthlySalary
//   CalculatePay() returns MonthlySalary

// Create class HourlyEmployee : Employee
//   Extra properties: decimal HourlyRate, double HoursWorked
//   CalculatePay() returns HourlyRate * HoursWorked
//   If HoursWorked > 40, overtime hours (above 40) are paid at 1.5x rate

// Create class CommissionEmployee : Employee
//   Extra properties: decimal BasePay, decimal SalesAmount, double CommissionRate
//   CalculatePay() returns BasePay + (SalesAmount * CommissionRate)

class Program
{
    static void Main()
    {
        // Create one of each employee type
        // Store them in an Employee array
        // Loop through and call PrintPayStub() for each
        // Print the total payroll cost
    }
}`,
      solutionCode: `using System;

abstract class Employee
{
    public string Name { get; set; }
    public int Id { get; set; }

    public Employee(string name, int id)
    {
        Name = name;
        Id = id;
    }

    public abstract decimal CalculatePay();

    public void PrintPayStub()
    {
        Console.WriteLine($"[{Id}] {Name} - Pay: \${CalculatePay():F2}");
    }
}

class SalariedEmployee : Employee
{
    public decimal MonthlySalary { get; set; }

    public SalariedEmployee(string name, int id, decimal monthlySalary)
        : base(name, id)
    {
        MonthlySalary = monthlySalary;
    }

    public override decimal CalculatePay()
    {
        return MonthlySalary;
    }
}

class HourlyEmployee : Employee
{
    public decimal HourlyRate { get; set; }
    public double HoursWorked { get; set; }

    public HourlyEmployee(string name, int id, decimal hourlyRate, double hoursWorked)
        : base(name, id)
    {
        HourlyRate = hourlyRate;
        HoursWorked = hoursWorked;
    }

    public override decimal CalculatePay()
    {
        if (HoursWorked <= 40)
            return HourlyRate * (decimal)HoursWorked;

        decimal regularPay = HourlyRate * 40;
        decimal overtimePay = HourlyRate * 1.5m * (decimal)(HoursWorked - 40);
        return regularPay + overtimePay;
    }
}

class CommissionEmployee : Employee
{
    public decimal BasePay { get; set; }
    public decimal SalesAmount { get; set; }
    public double CommissionRate { get; set; }

    public CommissionEmployee(string name, int id, decimal basePay, decimal salesAmount, double commissionRate)
        : base(name, id)
    {
        BasePay = basePay;
        SalesAmount = salesAmount;
        CommissionRate = commissionRate;
    }

    public override decimal CalculatePay()
    {
        return BasePay + SalesAmount * (decimal)CommissionRate;
    }
}

class Program
{
    static void Main()
    {
        Employee[] employees = new Employee[]
        {
            new SalariedEmployee("Alice Johnson", 101, 5000m),
            new HourlyEmployee("Bob Smith", 102, 25m, 45),
            new CommissionEmployee("Carol White", 103, 2000m, 15000m, 0.08)
        };

        Console.WriteLine("=== PAYROLL REPORT ===\\n");

        decimal totalPayroll = 0;
        foreach (Employee emp in employees)
        {
            emp.PrintPayStub();
            totalPayroll += emp.CalculatePay();
        }

        Console.WriteLine($"\\nTotal Payroll: \${totalPayroll:F2}");
    }
}`,
    },
  ],
};
